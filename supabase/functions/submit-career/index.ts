// ITCYBER — submit-career Edge Function
// Validates career applications, verifies live roles and cleans uploaded
// resumes on rejected submissions. All database/storage writes use service role.

import { createClient } from "npm:@supabase/supabase-js@2";
import {
  consumePublicRateLimit,
  corsHeaders,
  isAllowedOrigin,
  jsonResponse,
  readJsonObject,
  rejectDisallowedOrigin,
  requestFingerprint,
  RequestBodyError,
} from "../_shared/security.ts";

const ALLOWED: Record<string, number> = {
  job_id: 64, name: 120, email: 254, phone: 30, location: 120,
  experience: 200, linkedin_url: 250, portfolio_url: 250,
  resume_path: 300, message: 4000,
  source_page: 200, utm_source: 120, utm_medium: 120, utm_campaign: 120,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{7,17}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const RESUME_PATH_RE = /^pending\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|doc|docx)$/;

function clean(value: unknown, max: number): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).replace(/\u0000/g, "").trim();
  return s.length === 0 ? null : s.slice(0, max);
}

function validHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");

  if (req.method === "OPTIONS") {
    if (!isAllowedOrigin(origin)) return jsonResponse({ error: "Origin not allowed" }, 403, origin);
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405, origin);

  const originError = rejectDisallowedOrigin(req);
  if (originError) return originError;

  let raw: Record<string, unknown>;
  try {
    raw = await readJsonObject(req, 32_768);
  } catch (error) {
    if (error instanceof RequestBodyError) return jsonResponse({ error: error.message }, error.status, origin);
    return jsonResponse({ error: "Invalid request" }, 400, origin);
  }

  if (raw.referral_link) return jsonResponse({ ok: true }, 200, origin);
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 2500) return jsonResponse({ error: "Submission rejected" }, 429, origin);

  const unknown = Object.keys(raw).filter((k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link"].includes(k));
  if (unknown.length) return jsonResponse({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400, origin);

  const data: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email?.toLowerCase() ?? null;
  if (!email || !EMAIL_RE.test(email)) return jsonResponse({ error: "A valid email is required" }, 422, origin);
  if (!data.name) return jsonResponse({ error: "Full name is required" }, 422, origin);
  if (data.phone && !PHONE_RE.test(data.phone)) return jsonResponse({ error: "Phone number looks invalid" }, 422, origin);
  if (data.linkedin_url && !validHttpUrl(data.linkedin_url)) return jsonResponse({ error: "LinkedIn URL looks invalid" }, 422, origin);
  if (data.portfolio_url && !validHttpUrl(data.portfolio_url)) return jsonResponse({ error: "Portfolio URL looks invalid" }, 422, origin);
  if (data.resume_path && !RESUME_PATH_RE.test(data.resume_path)) return jsonResponse({ error: "Invalid resume reference" }, 422, origin);
  if (data.job_id && !UUID_RE.test(data.job_id)) return jsonResponse({ error: "Invalid job reference" }, 422, origin);

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !url) {
    console.error("submit-career: server credentials are not configured");
    return jsonResponse({ error: "Submission service is not configured. Please contact us directly." }, 503, origin);
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const cleanupResume = async () => {
    if (!data.resume_path) return;
    const { error } = await admin.storage.from("career-resumes").remove([data.resume_path]);
    if (error) console.error("career resume cleanup failed", error.message);
  };

  const fingerprint = await requestFingerprint(req);
  const abuse = await consumePublicRateLimit(admin, "career", fingerprint, 20, 3600);
  if (abuse === "blocked") {
    await cleanupResume();
    return jsonResponse({ error: "Too many submissions — please try again later." }, 429, origin);
  }
  if (abuse === "error") {
    await cleanupResume();
    return jsonResponse({ error: "We couldn't submit your application. Please try again." }, 503, origin);
  }

  if (data.job_id) {
    const { data: job, error: jobError } = await admin
      .from("jobs")
      .select("id,published,applications_open")
      .eq("id", data.job_id)
      .maybeSingle();

    if (jobError) {
      console.error("career job lookup failed", jobError.message);
      await cleanupResume();
      return jsonResponse({ error: "We couldn't verify this role. Please try again." }, 500, origin);
    }
    if (!job || !job.published || !job.applications_open) {
      await cleanupResume();
      return jsonResponse({ error: "This role is no longer accepting applications." }, 422, origin);
    }
  }

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await admin
    .from("career_applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if (rateError) {
    console.error("career rate-limit lookup failed", rateError.message);
    await cleanupResume();
    return jsonResponse({ error: "We couldn't submit your application. Please try again." }, 500, origin);
  }
  if ((count ?? 0) >= 5) {
    await cleanupResume();
    return jsonResponse({ error: "Too many submissions — please try again later." }, 429, origin);
  }

  const { error } = await admin.from("career_applications").insert({
    job_id: data.job_id, name: data.name, email, phone: data.phone,
    location: data.location, experience: data.experience,
    linkedin_url: data.linkedin_url, portfolio_url: data.portfolio_url,
    resume_path: data.resume_path, message: data.message, status: "new",
  });

  if (error) {
    console.error("career insert failed", error.message);
    await cleanupResume();
    return jsonResponse({ error: "We couldn't submit your application. Please try again." }, 500, origin);
  }
  return jsonResponse({ ok: true }, 200, origin);
});
