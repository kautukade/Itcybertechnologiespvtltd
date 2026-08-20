/**
 * ITCYBER — central site configuration.
 * Every business detail lives here; values come from environment variables
 * (see .env.example) and are overridden at runtime by Admin → Settings
 * through the `site_settings` table.
 */

const env = import.meta.env;

export interface SiteContact {
  email: string;
  salesEmail: string;
  careersEmail: string;
  /** Full international format, digits only — used to build wa.me links */
  whatsappNumber: string;
  phoneDisplay: string;
  phoneHref: string;
  address: string;
  hours: string;
}

export interface SiteConfig {
  name: string;
  shortName: string;
  legalName: string;
  domain: string;
  legacyDomain: string;
  tagline: string;
  description: string;
  contact: SiteContact;
  socials: { label: string; href: string }[];
  announcement: { show: boolean; text: string; cta: string; to: string };
  cta: { consultation: string; consultationLong: string; assessment: string; whatsapp: string };
  /** CMS-managed JSON blobs (populated from site_settings when live) */
  _homepage?: unknown;
  _navigation?: unknown;
}

const wa = env.VITE_WHATSAPP_NUMBER ?? "";

export const site: SiteConfig = {
  name: "ITCYBER Technologies Pvt Ltd",
  shortName: "ITCYBER",
  legalName: "ITCYBER TECHNOLOGIES PVT LTD",
  domain: "https://www.itcyber.in",
  legacyDomain: "https://www.itcyber.dev",
  tagline: "AI agents, automation and business software — engineered around your systems.",
  description:
    "ITCYBER designs and deploys custom AI agents, intelligent automation systems, business software and AI-powered digital infrastructure for businesses.",

  contact: {
    email: env.VITE_COMPANY_EMAIL ?? "",
    salesEmail: env.VITE_SALES_EMAIL ?? "",
    careersEmail: env.VITE_CAREERS_EMAIL ?? "",
    whatsappNumber: wa,
    phoneDisplay: env.VITE_PHONE_DISPLAY ?? "",
    phoneHref: wa ? `tel:+${wa}` : "",
    address: "India · Serving clients nationwide & remotely",
    hours: "Mon–Sat, 10:00–19:00 IST",
  },

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/itcyber-technologies" },
    { label: "Instagram", href: "https://www.instagram.com/itcyber.tech" },
    { label: "X (Twitter)", href: "https://x.com/itcybertech" },
  ],

  announcement: {
    show: true,
    text: "AI agents that work with your existing business systems",
    cta: "Explore AI Agents",
    to: "/ai-agents",
  },

  cta: {
    consultation: "Book Free Consultation",
    consultationLong: "Book Free AI Consultation",
    assessment: "Get an Automation Assessment",
    whatsapp: "Chat with ITCYBER",
  },
};

/* ── guards: never expose unconfigured contact channels publicly ── */
export const isPhoneConfigured = (n: string) => /^\d{10,15}$/.test(n);
export const contactReady = isPhoneConfigured(site.contact.whatsappNumber);
export const emailReady = site.contact.email.trim().length > 3;

/** Returns null when WhatsApp isn't configured — callers must hide the CTA. */
export const waLink = (message: string): string | null =>
  contactReady
    ? `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;

export const nav = {
  primary: [
    { label: "Services", to: "/services", mega: "services" },
    { label: "AI Agents", to: "/ai-agents" },
    { label: "Solutions", to: "/solutions", mega: "solutions" },
    { label: "Work", to: "/work" },
    { label: "Company", to: "/about", mega: "company" },
  ],
  resources: [
    { label: "Automation Field Notes", to: "/#resources", blurb: "Playbooks from live deployments" },
    { label: "How We Deliver", to: "/about#process", blurb: "Understand → Architect → Build → Deploy → Optimize" },
    { label: "Security & Control", to: "/#security", blurb: "Boundaries, logs and human escalation" },
    { label: "FAQ", to: "/contact#faq", blurb: "Answers before the first call" },
  ],
} as const;

export const analytics = {
  gaId: env.VITE_GA_ID ?? "",
  metaPixelId: env.VITE_META_PIXEL_ID ?? "",
  linkedinId: env.VITE_LINKEDIN_ID ?? "",
};
