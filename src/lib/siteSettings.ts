/**
 * Runtime site-settings store.
 *
 * The static/env defaults in `src/data/site.ts` are replaced by the
 * `site_settings` row when Supabase is configured (see useSiteSettings in
 * lib/cms.ts, which calls setSiteConfig). Public components must read
 * contact details through `useSiteConfig()` + the helpers below — never via
 * module-load-time constants — so Admin → Settings edits take effect after
 * refresh.
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

export function useSiteConfig(): SiteConfig {
  return useSyncExternalStore(subscribe, getSiteConfig, getSiteConfig);
}

const phoneDigits = (value: string | null | undefined): string =>
  (value ?? "").replace(/[^\d]/g, "");

export const hasWhatsApp = (cfg: SiteConfig): boolean =>
  /^\d{10,15}$/.test(phoneDigits(cfg.contact.whatsappNumber));

/** A callable phone number is independent from the WhatsApp channel. */
export const hasPhone = (cfg: SiteConfig): boolean => {
  const digits = phoneDigits(cfg.contact.phoneDisplay);
  return /^\d{7,15}$/.test(digits);
};

/** wa.me link or null when WhatsApp is not configured — callers must hide the CTA. */
export const getWhatsAppLink = (cfg: SiteConfig, message: string): string | null => {
  const digits = phoneDigits(cfg.contact.whatsappNumber);
  return hasWhatsApp(cfg)
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : null;
};

export const hasEmail = (cfg: SiteConfig): boolean =>
  (cfg.contact.email ?? "").trim().length > 3;

export const hasCareersEmail = (cfg: SiteConfig): boolean =>
  (cfg.contact.careersEmail ?? "").trim().length > 3;

/** tel: href derived only from the dedicated phone display field. */
export function getPhoneHref(cfg: SiteConfig): string {
  if (!hasPhone(cfg)) return "";
  const raw = (cfg.contact.phoneDisplay ?? "").trim();
  const digits = phoneDigits(raw);
  return raw.startsWith("+") ? `tel:+${digits}` : `tel:${digits}`;
}
