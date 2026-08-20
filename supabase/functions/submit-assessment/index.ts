// ITCYBER — submit-assessment Edge Function
// Validates the public automation-assessment wizard and stores it in
// `automation_assessments` via the service role.
// Deploy:  supabase functions deploy submit-assessment --no-verify-jwt

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "https://www.itcyber.in",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

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
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let raw: Record<string, unknown>;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }
  if (typeof raw !== "object" || raw === null) return json({ error: "Invalid payload" }, 400);

  if (raw.referral_link) return json({ ok: true });
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 2500) return json({ error: "Submission rejected" }, 429);

  const unknown = Object.keys(raw).filter(
    (k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link", "answers_json"].includes(k)
  );
  if (unknown.length) return json({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400);

  const data: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email;
  if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required" }, 422);
  if (!data.full_name) return json({ error: "Full name is required" }, 422);
  if (data.phone && !PHONE_RE.test(data.phone)) return json({ error: "Phone number looks invalid" }, 422);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("automation_assessments")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= 5) return json({ error: "Too many submissions — please try again later." }, 429);

  const answers = raw.answers_json && typeof raw.answers_json === "object" ? raw.answers_json : {};

  const { error } = await admin.from("automation_assessments").insert({
    full_name: data.full_name, company: data.company, email, phone: data.phone,
    requirement: data.requirement, industry: data.industry,
    business_problem: data.business_problem, existing_tools: data.existing_tools,
    budget: data.budget, timeline: data.timeline,
    answers_json: answers, status: "new",
  });

  if (error) {
    console.error("assessment insert failed", error.message);
    return json({ error: "We couldn't submit your request. Please try again." }, 500);
  }
  return json({ ok: true });
});
