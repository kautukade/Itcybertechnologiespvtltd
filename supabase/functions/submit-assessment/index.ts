// ITCYBER — submit-assessment Edge Function
// Validates the public automation/project assessment and stores it in
// `automation_assessments` via the SERVICE ROLE. Fails closed if the
// service role key is not configured — no anon fallback for inserts.
//
// Deploy:  supabase functions deploy submit-assessment --no-verify-jwt
// Secrets: SUPABASE_SERVICE_ROLE_KEY (set automatically), ALLOWED_ORIGINS

import { createClient } from "npm:@supabase/supabase-js@2";

const DEFAULT_ORIGINS = [
  "https://www.itcyber.in",
  "https://itcyber.in",
  "https://itcybertechnologiespvtltd.netlify.app",
];
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
  const reqOrigin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsFor(reqOrigin) });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405, reqOrigin);

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > 49_152) {
    return json({ error: "Request is too large" }, 413, reqOrigin);
  }

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400, reqOrigin);
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return json({ error: "Invalid payload" }, 400, reqOrigin);

  if (raw.referral_link) return json({ ok: true }, 200, reqOrigin);
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 2500) return json({ error: "Submission rejected" }, 429, reqOrigin);

  const unknown = Object.keys(raw).filter(
    (k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link", "answers_json"].includes(k)
  );
  if (unknown.length) return json({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400, reqOrigin);

  const data: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email;
  if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required" }, 422, reqOrigin);
  if (!data.full_name) return json({ error: "Full name is required" }, 422, reqOrigin);
  if (data.phone && !PHONE_RE.test(data.phone)) return json({ error: "Phone number looks invalid" }, 422, reqOrigin);

  const answers = raw.answers_json;
  if (answers !== undefined && (typeof answers !== "object" || answers === null || Array.isArray(answers))) {
    return json({ error: "Invalid assessment answers" }, 422, reqOrigin);
  }
  const answersJson = answers ?? {};
  if (JSON.stringify(answersJson).length > 20_000) {
    return json({ error: "Assessment answers are too large" }, 413, reqOrigin);
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !url) {
    console.error("submit-assessment: SUPABASE_SERVICE_ROLE_KEY is not configured");
    return json({ error: "Submission service is not configured. Please contact us directly." }, 503, reqOrigin);
  }
  const admin = createClient(url, serviceKey);

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await admin
    .from("automation_assessments")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if (rateError) {
    console.error("assessment rate-limit lookup failed", rateError.message);
    return json({ error: "We couldn't submit your request. Please try again." }, 500, reqOrigin);
  }
  if ((count ?? 0) >= 5) return json({ error: "Too many submissions — please try again later." }, 429, reqOrigin);

  const { error } = await admin.from("automation_assessments").insert({
    full_name: data.full_name, company: data.company, email, phone: data.phone,
    requirement: data.requirement, industry: data.industry,
    business_problem: data.business_problem, existing_tools: data.existing_tools,
    budget: data.budget, timeline: data.timeline,
    answers_json: answersJson, status: "new",
  });

  if (error) {
    console.error("assessment insert failed", error.message);
    return json({ error: "We couldn't submit your request. Please try again." }, 500, reqOrigin);
  }
  return json({ ok: true }, 200, reqOrigin);
});
