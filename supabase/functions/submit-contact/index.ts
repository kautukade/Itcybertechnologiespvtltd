// ITCYBER — submit-contact Edge Function
// Validates a public contact-form payload server-side and stores it in
// `contact_leads` using the service role (never exposed to the browser).
// Deploy:  supabase functions deploy submit-contact --no-verify-jwt
// Secret:  supabase secrets set SUPABASE_SERVICE_ROLE_KEY=... (project settings)

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "https://www.itcyber.in",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const ALLOWED: Record<string, number> = {
  full_name: 120, company: 160, email: 254, phone: 30, website: 250, industry: 80,
  company_size: 40, automation_interest: 80, existing_tools: 400, budget_range: 60,
  preferred_contact: 40, message: 5000, source_page: 200,
  utm_source: 120, utm_medium: 120, utm_campaign: 120,
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

  // Honeypot + submission-timing anti-spam checks
  if (raw.referral_link) return json({ ok: true });
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 2500) return json({ error: "Submission rejected" }, 429);

  // Reject unknown fields and oversized payloads
  const unknown = Object.keys(raw).filter((k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link"].includes(k));
  if (unknown.length) return json({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400);

  const data: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email;
  if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required" }, 422);
  const fullName = data.full_name;
  if (!fullName) return json({ error: "Full name is required" }, 422);
  if (data.phone && !PHONE_RE.test(data.phone)) return json({ error: "Phone number looks invalid" }, 422);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  // Simple rate limit: max 5 submissions per email per hour
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("contact_leads")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= 5) return json({ error: "Too many submissions — please try again later." }, 429);

  const { error } = await admin.from("contact_leads").insert({
    full_name: fullName,
    company: data.company, email, phone: data.phone, website: data.website,
    industry: data.industry, company_size: data.company_size,
    automation_interest: data.automation_interest, existing_tools: data.existing_tools,
    budget_range: data.budget_range, preferred_contact: data.preferred_contact,
    message: data.message, source_page: data.source_page,
    utm_source: data.utm_source, utm_medium: data.utm_medium, utm_campaign: data.utm_campaign,
    status: "new",
  });

  if (error) {
    console.error("contact insert failed", error.message);
    return json({ error: "We couldn't submit your request. Please try again." }, 500);
  }
  return json({ ok: true });
});
