// ITCYBER — prepare-resume-upload Edge Function
// Issues a short-lived signed Storage upload token after validating metadata and
// applying server-side abuse throttling. Browsers never receive service-role
// credentials and no anonymous Storage INSERT policy is required.

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

const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

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
    raw = await readJsonObject(req, 8_192);
  } catch (error) {
    if (error instanceof RequestBodyError) return jsonResponse({ error: error.message }, error.status, origin);
    return jsonResponse({ error: "Invalid request" }, 400, origin);
  }

  if (raw.referral_link) return jsonResponse({ ok: true }, 200, origin);
  const elapsed = Number(raw.elapsed_ms);
  if (Number.isFinite(elapsed) && elapsed < 1500) return jsonResponse({ error: "Upload rejected" }, 429, origin);

  const allowedFields = new Set(["file_name", "file_type", "file_size", "elapsed_ms", "referral_link"]);
  const unknown = Object.keys(raw).filter((key) => !allowedFields.has(key));
  if (unknown.length) return jsonResponse({ error: "Unexpected upload metadata" }, 400, origin);

  const fileName = typeof raw.file_name === "string" ? raw.file_name.trim() : "";
  const fileType = typeof raw.file_type === "string" ? raw.file_type.trim().toLowerCase() : "";
  const fileSize = Number(raw.file_size);
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";

  if (!TYPES[ext] || TYPES[ext] !== fileType) {
    return jsonResponse({ error: "Resume must be a PDF, DOC or DOCX file." }, 422, origin);
  }
  if (!Number.isSafeInteger(fileSize) || fileSize < 1 || fileSize > MAX_BYTES) {
    return jsonResponse({ error: "Resume must be between 1 byte and 5 MB." }, 422, origin);
  }

  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");
  if (!serviceKey || !url) {
    console.error("prepare-resume-upload: server credentials are not configured");
    return jsonResponse({ error: "Resume upload service is not configured." }, 503, origin);
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

  const fingerprint = await requestFingerprint(req);
  const abuse = await consumePublicRateLimit(admin, "resume-upload", fingerprint, 12, 3600);
  if (abuse === "blocked") return jsonResponse({ error: "Too many uploads — please try again later." }, 429, origin);
  if (abuse === "error") return jsonResponse({ error: "Resume upload is temporarily unavailable." }, 503, origin);

  const path = `pending/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await admin.storage.from("career-resumes").createSignedUploadUrl(path);
  if (error || !data?.token) {
    console.error("prepare-resume-upload: signed upload creation failed", error?.message ?? "missing token");
    return jsonResponse({ error: "Resume upload is temporarily unavailable." }, 500, origin);
  }

  return jsonResponse({ path, token: data.token }, 200, origin);
});
