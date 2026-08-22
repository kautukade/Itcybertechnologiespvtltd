// ITCYBER — submit-assessment Edge Function
// Public endpoint with strict origin/body validation, server-side abuse
// throttling and service-role-only database writes.

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
  full_name: 120, company: 160, email: 254, phone: 30,
  requirement: 80, industry: 80, business_problem: 2000,
  existing_tools: 400, budget: 60, timeline: 40,
  source_page: 200, utm_source: 120, utm_medium: 120, utm_campaign: 120,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{7,17}$/;

function clean(value: unknown, max: number): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).replace(/\u0000/g, "").trim();
  return s.length === 0 ? null : s.slice(0, max);
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
    raw = await readJsonObject(req, 49_152);
  } catch (error) {
    if (error instanceof RequestBodyError) return jsonResponse({ error: error.message }, error.status, origin);
    return jsonResponse({ error: "Invalid request" }, 400, origin);
  }

  if (raw.referral_link) return jsonResponse({ ok: true }, 200, origin);
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 2500) return jsonResponse({ error: "Submission rejected" }, 429, origin);

  const unknown = Object.keys(raw).filter(
    (k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link", "answers_json"].includes(k)
  );
  if (unknown.length) return jsonResponse({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400, origin);

  const data: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email?.toLowerCase() ?? null;
  if (!email || !EMAIL_RE.test(email)) return jsonResponse({ error: "A valid email is required" }, 422, origin);
  if (!data.full_name) return jsonResponse({ error: "Full name is required" }, 422, origin);
  if (data.phone && !PHONE_RE.test(data.phone)) return jsonResponse({ error: "Phone number looks invalid" }, 422, origin);

  const answers = raw.answers_json;
  if (answers !== undefined && (typeof answers !== "object" || answers === null || Array.isArray(answers))) {
    return jsonResponse({ error: "Invalid assessment answers" }, 422, origin);
  }
  const answersJson = answers ?? {};
  if (JSON.stringify(answersJson).length > 20_000) {
    return jsonResponse({ error: "Assessment answers are too large" }, 413, origin);
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !url) {
    console.error("submit-assessment: server credentials are not configured");
    return jsonResponse({ error: "Submission service is not configured. Please contact us directly." }, 503, origin);
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const fingerprint = await requestFingerprint(req);
  const abuse = await consumePublicRateLimit(admin, "assessment", fingerprint, 20, 3600);
  if (abuse === "blocked") return jsonResponse({ error: "Too many submissions — please try again later." }, 429, origin);
  if (abuse === "error") return jsonResponse({ error: "We couldn't submit your request. Please try again." }, 503, origin);

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await admin
    .from("automation_assessments")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if (rateError) {
    console.error("assessment rate-limit lookup failed", rateError.message);
    return jsonResponse({ error: "We couldn't submit your request. Please try again." }, 500, origin);
  }
  if ((count ?? 0) >= 5) return jsonResponse({ error: "Too many submissions — please try again later." }, 429, origin);

  const { error } = await admin.from("automation_assessments").insert({
    full_name: data.full_name, company: data.company, email, phone: data.phone,
    requirement: data.requirement, industry: data.industry,
    business_problem: data.business_problem, existing_tools: data.existing_tools,
    budget: data.budget, timeline: data.timeline,
    answers_json: answersJson, status: "new",
  });

  if (error) {
    console.error("assessment insert failed", error.message);
    return jsonResponse({ error: "We couldn't submit your request. Please try again." }, 500, origin);
  }
  return jsonResponse({ ok: true }, 200, origin);
});
