// ITCYBER — `submit-public` Edge Function
// Handles contact leads, automation assessments and career applications.
// Anonymous clients can NEVER insert into these tables directly (RLS blocks it);
// this function validates server-side, then inserts with the service role.
//
// Deploy:  supabase functions deploy submit-public
// Secrets: supabase secrets set SUBMIT_ALLOWED_ORIGIN=https://www.itcyber.in
import { createClient } from "npm:@supabase/supabase-js@2";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s\-()]{7,17}$/;
const MAX_LEN = 5000;

type Kind = "contact" | "assessment" | "career";

const str = (v: unknown, max = MAX_LEN): string | null =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max ? v.trim() : null;

function cors(origin: string | null) {
  const allowed = Deno.env.get("SUBMIT_ALLOWED_ORIGIN") ?? "https://www.itcyber.in";
  const ok = origin && (origin === allowed || origin.startsWith("http://localhost"));
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function fail(origin: string | null, status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { ...cors(origin), "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors(origin) });
  if (req.method !== "POST") return fail(origin, 405, "Method not allowed");

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(origin, 400, "Invalid JSON body");
  }

  const kind = body.kind as Kind;
  const p = (body.payload ?? {}) as Record<string, unknown>;
  const meta = (body.meta ?? {}) as Record<string, unknown>;

  // ── anti-spam: honeypot must be empty, humans take >2.5s to fill the form ──
  if (str(p.hp_field)) return fail(origin, 422, "Submission rejected");
  const elapsed = Number(meta.elapsed_ms);
  if (!Number.isFinite(elapsed) || elapsed < 2500) return fail(origin, 422, "Submission rejected");

  // ── shared field validation ──
  const email = str(p.email, 320);
  const name = str(p.full_name ?? p.name, 200);
  if (!name) return fail(origin, 422, "Full name is required");
  if (!email || !EMAIL_RE.test(email)) return fail(origin, 422, "A valid email is required");
  const phone = str(p.phone, 30);
  if (phone && !PHONE_RE.test(phone)) return fail(origin, 422, "Phone number looks invalid");

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

  // ── naive rate limit: max 3 submissions per email per 10 minutes ──
  const table =
    kind === "contact" ? "contact_leads" : kind === "assessment" ? "automation_assessments" : "career_applications";
  if (!["contact", "assessment", "career"].includes(kind)) return fail(origin, 422, "Unknown submission kind");
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { count } = await admin.from(table).select("id", { count: "exact", head: true }).eq("email", email).gte("created_at", since);
  if ((count ?? 0) >= 3) return fail(origin, 429, "Too many submissions — please try again later");

  // ── insert with allow-listed fields only ──
  let row: Record<string, unknown>;
  if (kind === "contact") {
    row = {
      full_name: name, email, phone,
      company: str(p.company, 200), website: str(p.website, 300),
      industry: str(p.industry, 120), company_size: str(p.company_size, 120),
      automation_interest: str(p.automation_interest, 400),
      existing_tools: str(p.existing_tools, 600),
      budget_range: str(p.budget_range, 120),
      preferred_contact: str(p.preferred_contact, 120),
      message: str(p.message),
      source_page: str(meta.source_page, 300),
      utm_source: str(meta.utm_source, 200), utm_medium: str(meta.utm_medium, 200),
      utm_campaign: str(meta.utm_campaign, 200),
    };
  } else if (kind === "assessment") {
    row = {
      full_name: name, email, phone,
      company: str(p.company, 200),
      requirement: str(p.requirement, 200), industry: str(p.industry, 120),
      business_problem: str(p.business_problem, 600),
      existing_tools: str(p.existing_tools, 600),
      budget: str(p.budget, 120), timeline: str(p.timeline, 120),
      answers_json: (p.answers_json && typeof p.answers_json === "object" ? p.answers_json : {}) as Record<string, unknown>,
    };
  } else {
    row = {
      job_id: typeof p.job_id === "string" && p.job_id.length === 36 ? p.job_id : null,
      name, email, phone,
      location: str(p.location, 200), experience: str(p.experience, 400),
      linkedin_url: str(p.linkedin_url, 300), portfolio_url: str(p.portfolio_url, 300),
      resume_path: str(p.resume_path, 400),
      message: str(p.message),
    };
  }

  const { error } = await admin.from(table).insert(row);
  if (error) {
    console.error("submit-public insert error", error.message);
    return fail(origin, 500, "We couldn't store your submission. Please try again or contact us directly.");
  }

  return new Response(JSON.stringify({ ok: true }), { status: 201, headers: { ...cors(origin), "Content-Type": "application/json" } });
});
