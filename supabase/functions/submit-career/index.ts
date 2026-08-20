// ITCYBER — submit-career Edge Function
// Validates a career application (optionally referencing a resume already
// uploaded to the private `career-resumes` bucket under `pending/`) and
// stores it in `career_applications` via the service role.
// Deploy:  supabase functions deploy submit-career --no-verify-jwt

import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "https://www.itcyber.in",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

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

  const unknown = Object.keys(raw).filter((k) => !(k in ALLOWED) && !["elapsed_ms", "referral_link"].includes(k));
  if (unknown.length) return json({ error: `Unexpected fields: ${unknown.join(", ")}` }, 400);

  const data: Record<string, string | null> = {};
  for (const [key, max] of Object.entries(ALLOWED)) data[key] = clean(raw[key], max);

  const email = data.email;
  if (!email || !EMAIL_RE.test(email)) return json({ error: "A valid email is required" }, 422);
  if (!data.name) return json({ error: "Full name is required" }, 422);
  if (data.phone && !PHONE_RE.test(data.phone)) return json({ error: "Phone number looks invalid" }, 422);
  if (data.linkedin_url && !URL_RE.test(data.linkedin_url)) return json({ error: "LinkedIn URL looks invalid" }, 422);
  if (data.portfolio_url && !URL_RE.test(data.portfolio_url)) return json({ error: "Portfolio URL looks invalid" }, 422);

  // resume_path must point inside the private bucket's pending folder and be a PDF/DOC/DOCX
  if (data.resume_path) {
    const ok =
      data.resume_path.startsWith("pending/") &&
      !data.resume_path.includes("..") &&
      /\.(pdf|doc|docx)$/i.test(data.resume_path);
    if (!ok) return json({ error: "Invalid resume reference" }, 422);
  }
  if (data.job_id && !UUID_RE.test(data.job_id)) return json({ error: "Invalid job reference" }, 422);

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY")!,
  );

  const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("career_applications")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", hourAgo);
  if ((count ?? 0) >= 5) return json({ error: "Too many submissions — please try again later." }, 429);

  const { error } = await admin.from("career_applications").insert({
    job_id: data.job_id, name: data.name, email, phone: data.phone,
    location: data.location, experience: data.experience,
    linkedin_url: data.linkedin_url, portfolio_url: data.portfolio_url,
    resume_path: data.resume_path, message: data.message, status: "new",
  });

  if (error) {
    console.error("career insert failed", error.message);
    return json({ error: "We couldn't submit your application. Please try again." }, 500);
  }
  return json({ ok: true });
});
