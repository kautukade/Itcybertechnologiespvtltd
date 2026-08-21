/**
 * Runtime site-settings store.
 *
 * The static/env defaults in `src/data/site.ts` are replaced by the
 * `site_settings` row when Supabase is configured (see useSiteSettings in
 * lib/cms.ts, which calls setSiteConfig). Public components must read
 * contact details through `useSiteConfig()` + the helpers below — never via
 * module-load-time constants — so Admin → Settings edits (email, WhatsApp,
 * phone, address, hours) take effect on the live site after refresh.
 */
import { useSyncExternalStore } from "react";
import { site as staticSite, type SiteConfig } from "../data/site";

let current: SiteConfig = staticSite;
const listeners = new Set<() => void>();

export function getSiteConfig(): SiteConfig {
  return current;
}

export function setSiteConfig(next: SiteConfig): void {
  if (next === current) return;
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/** Reactive runtime config: env defaults → merged with DB values once loaded. */
export function useSiteConfig(): SiteConfig {
  return useSyncExternalStore(subscribe, getSiteConfig, getSiteConfig);
}

/* ── runtime contact helpers (always derived from CURRENT config) ── */

export const hasPhone = (cfg: SiteConfig): boolean =>
  /^\d{10,15}$/.test(cfg.contact.whatsappNumber ?? "");

export const hasWhatsApp = hasPhone;

/** wa.me link or null when WhatsApp is not configured — callers must hide the CTA. */
export const getWhatsAppLink = (cfg: SiteConfig, message: string): string | null =>
  hasWhatsApp(cfg)
    ? `https://wa.me/${cfg.contact.whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;

export const hasEmail = (cfg: SiteConfig): boolean =>
  (cfg.contact.email ?? "").trim().length > 3;

export const hasCareersEmail = (cfg: SiteConfig): boolean =>
  (cfg.contact.careersEmail ?? "").trim().length > 3;

/** tel: href recomputed from the CURRENT config — never frozen from env vars. */
export function getPhoneHref(cfg: SiteConfig): string {
  if (hasPhone(cfg)) return `tel:+${cfg.contact.whatsappNumber}`;
  const digits = (cfg.contact.phoneDisplay ?? "").replace(/[^+\d]/g, "");
  return digits.length > 5 ? `tel:${digits}` : "";
}
