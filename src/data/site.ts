/**
 * ITCYBER — central site configuration.
 * Every business detail (contacts, phone/WhatsApp, socials, CTA labels,
 * navigation) lives here so an admin layer can drive it later.
 */

export const site = {
  name: "ITCYBER Technologies Pvt Ltd",
  shortName: "ITCYBER",
  legalName: "ITCYBER TECHNOLOGIES PVT LTD",
  domain: "https://www.itcyber.in",
  legacyDomain: "https://www.itcyber.dev",
  tagline: "AI agents, automation and business software — engineered around your systems.",
  description:
    "ITCYBER designs and deploys custom AI agents, intelligent automation systems, business software and AI-powered digital infrastructure for businesses.",

  /** EDIT HERE — verified contact channels */
  contact: {
    email: "hello@itcyber.in",
    salesEmail: "sales@itcyber.in",
    careersEmail: "careers@itcyber.in",
    /** Full international format, digits only — used to build wa.me links */
    whatsappNumber: "919000000000",
    phoneDisplay: "+91 90000 00000",
    phoneHref: "tel:+919000000000",
    address: "India · Serving clients nationwide & remotely",
    hours: "Mon–Sat, 10:00–19:00 IST",
  },

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/itcyber-technologies" },
    { label: "Instagram", href: "https://www.instagram.com/itcyber.tech" },
    { label: "X (Twitter)", href: "https://x.com/itcybertech" },
  ],

  /** Announcement strip — set `show: false` to hide */
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
} as const;

export const waLink = (message: string) =>
  `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;

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
  /** Populate via environment variables — never hardcode IDs */
  gaId: (import.meta as any).env?.VITE_GA_ID ?? "",
  metaPixelId: (import.meta as any).env?.VITE_META_PIXEL_ID ?? "",
  linkedinId: (import.meta as any).env?.VITE_LINKEDIN_ID ?? "",
};
