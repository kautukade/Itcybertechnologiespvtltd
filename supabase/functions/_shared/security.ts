const DEFAULT_ORIGINS = [
  "https://www.itcyber.in",
  "https://itcyber.in",
  "https://itcybertechnologiespvtltd.netlify.app",
];

const extraOrigins = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export const ALLOWED_ORIGINS = [...new Set([...DEFAULT_ORIGINS, ...extraOrigins])];

export function isAllowedOrigin(origin: string | null): boolean {
  return Boolean(origin && ALLOWED_ORIGINS.includes(origin));
}

export function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "600",
    Vary: "Origin",
  };
  if (isAllowedOrigin(origin)) headers["Access-Control-Allow-Origin"] = origin!;
  return headers;
}

export function securityHeaders(): Record<string, string> {
  return {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
  };
}

export function jsonResponse(body: unknown, status: number, origin: string | null): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(origin),
      ...securityHeaders(),
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export function rejectDisallowedOrigin(req: Request): Response | null {
  const origin = req.headers.get("origin");
  if (isAllowedOrigin(origin)) return null;
  return jsonResponse({ error: "Origin not allowed" }, 403, origin);
}

export async function readJsonObject(req: Request, maxBytes: number): Promise<Record<string, unknown>> {
  const declared = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(declared) && declared > maxBytes) throw new RequestBodyError("Request is too large", 413);

  const text = await req.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) throw new RequestBodyError("Request is too large", 413);

  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch {
    throw new RequestBodyError("Invalid JSON body", 400);
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new RequestBodyError("Invalid payload", 400);
  }
  return value as Record<string, unknown>;
}

export class RequestBodyError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "RequestBodyError";
    this.status = status;
  }
}

function clientAddress(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    forwarded ||
    req.headers.get("fly-client-ip") ||
    "unknown"
  );
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Hash server-observed request metadata before storing a rate-limit key.
 * Raw IP addresses are never written to Postgres.
 */
export async function requestFingerprint(req: Request): Promise<string> {
  const pepper = Deno.env.get("RATE_LIMIT_PEPPER") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "itcyber";
  const source = [
    pepper,
    clientAddress(req),
    req.headers.get("user-agent") ?? "unknown",
  ].join("|");
  return sha256Hex(source);
}

type RpcClient = {
  rpc: (name: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: { message: string } | null }>;
};

export async function consumePublicRateLimit(
  admin: RpcClient,
  scope: string,
  fingerprint: string,
  limit: number,
  windowSeconds: number,
): Promise<"allowed" | "blocked" | "error"> {
  const { data, error } = await admin.rpc("consume_public_rate_limit", {
    p_scope: scope,
    p_fingerprint: fingerprint,
    p_limit: limit,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error(`${scope}: rate-limit RPC failed`, error.message);
    return "error";
  }
  return data === true ? "allowed" : "blocked";
}
