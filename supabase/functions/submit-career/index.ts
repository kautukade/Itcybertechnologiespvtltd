// ITCYBER — submit-career Edge Function
// Validates a career application and stores it in `career_applications`
// via the SERVICE ROLE. Fails closed if the service role key is not
// configured — no anon fallback for inserts.
//
// `resume_path` must match the SAME contract the storage policy enforces:
// pending/<uuid>.(pdf|doc|docx) inside the private `career-resumes` bucket.
//
// Deploy:  supabase functions deploy submit-career --no-verify-jwt
// Secrets: SUPABASE_SERVICE_ROLE_KEY (set automatically), ALLOWED_ORIGINS
//          (optional, comma-separated extra origins for previews)

import { createClient } from "npm:@supabase/supabase-js@2";

/* ── CORS: explicit allow-list. No wildcards, no blind reflection. ── */
const DEFAULT_ORIGINS = ["https://www.itcyber.in", "https://itcyber.in"];
const ALLOWED_ORIGINS = [
  ...new Set([
    ...DEFAULT_ORIGINS,
    ...(Deno.env.get("ALLOWED_ORIGINS") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  ]),
];

function corsFor(requestOrigin: string | null): Record<string, string> {
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : DEFAULT_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
}
const json = (body: unknown, status = 200, origin: string | null = null) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsFor(origin), "Content-Type": "application/json" },
  });

/* ── validation ── */
const ALLOWED: Record<string, number> = {
  job_id: 64, name: 120, email: 254, phone: 30, location: 120,
  experience: 200, linkedin_url: 250, portfolio_url: 250,
  resume_path: 300, message: 4000,
  source_page: 200, utm_source: 120, utm_medium: 120, utm_campaign: 120,
};
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{7,17}$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
// Mirrors the storage policy in 0003_security_hardening.sql exactly.
const RESUME_PATH_RE =
  /^pending\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|doc|docx)$/;

function clean(value: unknown, max: number): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).replace(/\u0000/g, "").trim();
  return s.length === 0 ? null : s.slice(0, max);
}

Deno.serve(async (req) => {
  const reqOrigin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsFor(reqOrigin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, reqOrigin);

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, reqOrigin);
  }
  if (typeof raw !== "object" || raw === null) return json({ error: "Invalid payload" }, 400, reqOrigin);

  if (raw.referral_link) return json({ ok: true }, 200, reqOrigin);
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 2500) return json({ error: "Submission rejected" }, 429, reqOrigin);

  const unknown = Object.keys(raw).filter((k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link"].includes(k));
  if (unknown.length) return json({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400, reqOrigin);

  const  Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email;
  if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required" }, 422, reqOrigin);
  if (!data.name) return json({ error: "Full name is required" }, 422, reqOrigin);
  if (data.phone && !PHONE_RE.test(data.phone)) return json({ error: "Phone number looks invalid" }, 422, reqOrigin);
  if (data.linkedin_url && !URL_RE.test(data.linkedin_url)) return json({ error: "LinkedIn URL looks invalid" }, 422, reqOrigin);
  if (data.portfolio_url && !URL_RE.test(data.portfolio_url)) return json({ error: "Portfolio URL looks invalid" }, 422, reqOrigin);

  // Resume reference must point at the private bucket's pending/ folder,
  // with a generated UUID filename and an allowed extension. Rejects
  // traversal ('..' / extra segments) and arbitrary paths.
  if (data.resume_path && !RESUME_PATH_RE.test(data.resume_path)) {
    return json({ error: "Invalid resume reference" }, 422, reqOrigin);
  }
  if (data.job_id && !UUID_RE.test(data.job_id)) return json({ error: "Invalid job reference" }, 422, reqOrigin);

  // Fail closed: privileged inserts require the service role. No anon fallback.
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !url) {
    console.error("submit-career: SUPABASE_SERVICE_ROLE_KEY is not configured");
    return json({ error: "Submission service is not configured. Please contact us directly." }, 503, reqOrigin);
  }
  const admin = createClient(url, serviceKey);

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("career_applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= 5) return json({ error: "Too many submissions — please try again later." }, 429, reqOrigin);

  const { error } = await admin.from("career_applications").insert({
    job_id: data.job_id, name: data.name, email, phone: data.phone,
    location: data.location, experience: data.experience,
    linkedin_url: data.linkedin_url, portfolio_url: data.portfolio_url,
    resume_path: data.resume_path, message: data.message, status: "new",
  });

  if (error) {
    console.error("career insert failed", error.message);
    return json({ error: "We couldn't submit your application. Please try again." }, 500, reqOrigin);
  }
  return json({ ok: true }, 200, reqOrigin);
});
