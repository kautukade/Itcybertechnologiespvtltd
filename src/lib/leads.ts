/**
 * Public submission layer. Forms never fake success: all writes go through
 * validated Edge Functions and failures are surfaced to the visitor.
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

async function functionErrorMessage(error: unknown, fallback: string): Promise<string> {
  try {
    const ctx = error as { context?: Response };
    if (ctx.context) {
      const body = (await ctx.context.json()) as { error?: string };
      if (body.error) return body.error;
    }
  } catch {
    /* keep fallback */
  }
  return fallback;
}

/** Submit via the kind-specific Edge Function. Throws on any failure. */
export async function submitPublic(
  kind: SubmissionKind,
  payload: Record<string, unknown>,
  meta: SubmissionMeta
): Promise<void> {
  if (!supabase) throw new SubmissionError(BACKEND_MISSING_ERROR);

  const { error } = await supabase.functions.invoke(FUNCTION_BY_KIND[kind], {
    body: { ...payload, ...meta },
  });

  if (error) throw new SubmissionError(await functionErrorMessage(error, SUBMIT_ERROR));
}

/* ─────────────── resume upload (private `career-resumes` bucket) ─────────────── */

const RESUME_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
const RESUME_MAX_BYTES = 5 * 1024 * 1024;

/**
 * Anonymous visitors no longer have direct INSERT permission on Storage.
 * `prepare-resume-upload` validates metadata/rate limits server-side and returns
 * a short-lived signed token for one generated path.
 */
export async function uploadResume(file: File): Promise<string> {
  if (!supabase) throw new SubmissionError(BACKEND_MISSING_ERROR);

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!RESUME_TYPES[ext] || RESUME_TYPES[ext] !== file.type)
    throw new SubmissionError("Resume must be a PDF, DOC or DOCX file.");
  if (file.size < 1 || file.size > RESUME_MAX_BYTES)
    throw new SubmissionError("Resume must be between 1 byte and 5 MB.");

  const { data, error: tokenError } = await supabase.functions.invoke("prepare-resume-upload", {
    body: {
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
    },
  });

  if (tokenError) {
    throw new SubmissionError(
      await functionErrorMessage(tokenError, "Resume upload could not be prepared — please try again or email it to us.")
    );
  }

  const signed = data as { path?: string; token?: string } | null;
  if (!signed?.path || !signed.token)
    throw new SubmissionError("Resume upload could not be prepared — please try again.");

  const { error: uploadError } = await supabase.storage
    .from("career-resumes")
    .uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type });

  if (uploadError)
    throw new SubmissionError("Resume upload failed — please try again or email it to us.");

  return signed.path;
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
