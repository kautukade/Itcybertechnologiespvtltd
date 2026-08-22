/**
 * Small security helpers shared by public/admin UI code.
 * Keep untrusted CMS/form data away from navigation primitives and spreadsheet
 * formula execution surfaces.
 */

const DANGEROUS_CSV_PREFIX = /^[=+\-@\t\r]/;

/** Quote a value for CSV and neutralise spreadsheet-formula prefixes. */
export function csvCell(value: unknown): string {
  let text = String(value ?? "");
  if (DANGEROUS_CSV_PREFIX.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Return an internal router path only. Reject scheme-like values, protocol-
 * relative URLs and backslashes (which have caused router/open-redirect bugs).
 */
export function safeInternalPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string") return fallback;
  const path = value.trim();
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return fallback;
  if (/^\/[a-zA-Z][a-zA-Z0-9+.-]*:/.test(path)) return fallback;
  return path;
}

/** Allow only real http/https URLs. */
export function safeHttpUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Allow the URL schemes used by buttons/links on this site. */
export function safeHref(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();
  if (raw.startsWith("/")) return safeInternalPath(raw, "") || null;
  try {
    const url = new URL(raw);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** Open a validated external HTTP(S) URL without giving it window.opener. */
export function openExternal(value: unknown): boolean {
  const url = safeHttpUrl(value);
  if (!url) return false;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (win) win.opener = null;
  return Boolean(win);
}
