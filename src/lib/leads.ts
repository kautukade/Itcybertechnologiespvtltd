/**
 * Lead submission layer.
 *
 * Forms NEVER show a success state unless the backend genuinely stored the
 * record: submissions go through the `submit-public` Supabase Edge Function
 * (server-side validation, honeypot, rate limiting, service-role insert).
 * If the backend is not configured or fails, we surface a real error.
 */
import { supabase, supabaseConfigured } from "./supabase";

export type SubmissionKind = "contact" | "assessment" | "career";

export const SUBMIT_ERROR =
  "We couldn't submit your request. Please try again or contact us on WhatsApp.";
export const BACKEND_MISSING_ERROR =
  "Our submission service isn't reachable right now. Please contact us directly on WhatsApp or email.";

export class SubmissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SubmissionError";
  }
}

export interface SubmissionMeta {
  source_page: string;
  elapsed_ms: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const FUNCTION_BY_KIND: Record<SubmissionKind, string> = {
  contact: "submit-contact",
  assessment: "submit-assessment",
  career: "submit-career",
};

/** Submit via the kind-specific Edge Function. Throws SubmissionError on any failure. */
export async function submitPublic(
  kind: SubmissionKind,
  payload: Record<string, unknown>,
  meta: SubmissionMeta
): Promise<void> {
  if (!supabase) throw new SubmissionError(BACKEND_MISSING_ERROR);

  const { error } = await supabase.functions.invoke(FUNCTION_BY_KIND[kind], {
    body: { ...payload, ...meta },
  });

  if (error) {
    // Try to surface the function's real message (422/429/500)
    let message = SUBMIT_ERROR;
    try {
      const ctx = error as unknown as { context?: Response };
      if (ctx.context) {
        const body = (await ctx.context.json()) as { error?: string };
        if (body.error) message = body.error;
      }
    } catch {
      /* keep default message */
    }
    throw new SubmissionError(message);
  }
}

/* ─────────────── resume upload (private `career-resumes` bucket) ─────────────── */

const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const RESUME_MAX_BYTES = 5 * 1024 * 1024;

export async function uploadResume(file: File): Promise<string> {
  if (!supabase) throw new SubmissionError(BACKEND_MISSING_ERROR);
  if (!RESUME_TYPES.includes(file.type))
    throw new SubmissionError("Resume must be a PDF, DOC or DOCX file.");
  if (file.size > RESUME_MAX_BYTES)
    throw new SubmissionError("Resume must be 5 MB or smaller.");

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const path = `pending/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("career-resumes").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw new SubmissionError("Resume upload failed — please try again or email it to us.");
  return path;
}

export const resumeUploadReady = supabaseConfigured;

/* ─────────────── shared client-side validation helpers ─────────────── */
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isPhone = (v: string) => /^[+\d][\d\s\-()]{7,17}$/.test(v.trim());
export const required = (v: string) => v.trim().length > 0;

/** Read UTM params for lead attribution. */
export function readUtm(params: URLSearchParams): Pick<SubmissionMeta, "utm_source" | "utm_medium" | "utm_campaign"> {
  return {
    utm_source: params.get("utm_source") ?? undefined,
    utm_medium: params.get("utm_medium") ?? undefined,
    utm_campaign: params.get("utm_campaign") ?? undefined,
  };
}
