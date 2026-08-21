import { Link } from "react-router-dom";
import { site } from "../../data/site";
import { serviceCategories, industries } from "../../data/content";
import { useCollection } from "../../lib/cms";
import { useSiteConfig, hasEmail, hasWhatsApp, getWhatsAppLink } from "../../lib/siteSettings";
import type { SocialLinkRow } from "../../types/db";
import { Logo, IconMail, IconWhatsApp, IconPin, IconClock, IconArrowUpRight, IconArrow } from "../icons";

const cols: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Services",
    links: [...serviceCategories.map((s) => ({ label: s.title, to: s.page })), { label: "All Services", to: "/services" }],
  },
  {
    title: "Solutions",
    links: industries.slice(0, 6).map((i) => ({ label: i.name, to: `/solutions/${i.slug}` })),
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Work", to: "/work" },
      { label: "Careers", to: "/careers" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "AI Agents", to: "/ai-agents" },
      { label: "Automations", to: "/automations" },
      { label: "Custom Software", to: "/custom-software" },
      { label: "Web Development", to: "/web-development" },
      { label: "App Development", to: "/app-development" },
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
      { label: "Cookie Policy", to: "/cookie-policy" },
    ],
  },
];

/** Social links: live from the `social_links` table when configured,
 *  otherwise the static defaults. Only renders links with a real href. */
function FooterSocials() {
  const { data } = useCollection("social_links", [] as SocialLinkRow[]);
  const live = (data ?? []).filter((s) => !!s.href);
  const links = live.length
    ? live.map((s) => ({ label: s.label, href: s.href }))
    : site.socials;
  if (!links.length) return null;
  return (
    <div className="mt-6 flex gap-2 flex-wrap">
      {links.map((s) => (
        <a
          key={s.label}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          className="h-9 px-3 inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] hairline text-ink-200 hover:text-white hover:bg-white/[.06] transition-colors clip-corner"
        >
          {s.label} <IconArrowUpRight size={11} />
        </a>
      ))}
    </div>
  );
}

export default function Footer() {
  const cfg = useSiteConfig();
  return (
    <footer className="relative bg-ink-950 text-ink-200 border-t border-white/[.07] overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute -bottom-40 left-1/4 w-[30rem] h-[30rem] rounded-full bg-brand-500/[.07] blur-[110px]" aria-hidden />

      <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-8">
        <div className="grid lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-x-8 gap-y-10">
          <div className="max-w-xs">
            <Link to="/" className="text-white inline-block" aria-label="ITCYBER home">
              <Logo />
            </Link>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-ink-300">
              Custom websites, web applications, business software, mobile apps, AI systems and
              automation — engineered as connected digital products.
            </p>
            <ul className="mt-6 space-y-2.5 text-[0.88rem]">
              {hasEmail(cfg) && (
                <li>
                  <a href={`mailto:${cfg.contact.email}`} className="inline-flex items-center gap-2.5 hover:text-white transition-colors group">
                    <IconMail size={15} className="text-cyan-ic" />
                    <span className="group-hover:underline underline-offset-4">{cfg.contact.email}</span>
                  </a>
                </li>
              )}
              {hasWhatsApp(cfg) && (
                <li>
                  <a href={getWhatsAppLink(cfg, "Hi ITCYBER — I have a question about a project.") ?? undefined} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 hover:text-white transition-colors group">
                    <IconWhatsApp size={15} className="text-signal" />
                    <span className="group-hover:underline underline-offset-4">WhatsApp ITCYBER</span>
                  </a>
                </li>
              )}
              <li className="inline-flex items-center gap-2.5 text-ink-300">
                <IconPin size={15} className="text-brand-400" />
                {cfg.contact.address}
              </li>
              <li className="inline-flex items-center gap-2.5 text-ink-300">
                <IconClock size={15} className="text-brand-400" />
                {cfg.contact.hours}
              </li>
            </ul>
            <FooterSocials />
          </div>

          {cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ink-400">{c.title}</p>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-[0.9rem] text-ink-200 hover:text-cyan-ic transition-colors inline-flex items-center gap-0 group">
                      <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-300 text-cyan-ic" aria-hidden>
                        <IconArrow size={11} />
                      </span>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-white/[.07] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[0.8rem] text-ink-400">
            © {new Date().getFullYear()} {site.legalName}. All rights reserved.
          </p>
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-400">
            Business hours · {cfg.contact.hours}
          </p>
        </div>
      </div>
    </footer>
  );
}
