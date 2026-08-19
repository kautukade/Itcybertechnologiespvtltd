/**
 * Lead submission layer.
 * - Validates on the client, submits through one async entry point.
 * - If Supabase env vars exist, writes to a `submissions` table.
 * - Otherwise simulates a successful request (no fake network errors).
 * Server-side validation, rate limiting and spam checks belong on the
 * backend / edge function — this interface is already shaped for it.
 */

export type Submission = {
  kind: "contact" | "assessment" | "career";
  payload: Record<string, unknown>;
  submittedAt: string;
  source: "itcyber.in";
};

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string | undefined;

export async function submitLead(submission: Submission): Promise<{ ok: true; simulated: boolean }> {
  if (SUPABASE_URL && SUPABASE_KEY) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/submissions`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(submission),
    });
    if (!res.ok) throw new Error("Submission failed");
    return { ok: true, simulated: false };
  }
  await new Promise((r) => setTimeout(r, 900));
  return { ok: true, simulated: true };
}

/* Shared validation helpers */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^[+\d][\d\s\-()]{7,17}$/.test(v.trim());
export const required = (v: string) => v.trim().length > 0;
