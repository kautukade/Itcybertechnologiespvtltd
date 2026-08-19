import { Link } from "react-router-dom";
import { site } from "../../data/site";
import { serviceCategories, industries } from "../../data/content";
import { Logo, IconMail, IconWhatsApp, IconPin, IconArrowUpRight, IconArrow } from "../icons";

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
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Terms of Service", to: "/terms-of-service" },
      { label: "Cookie Policy", to: "/cookie-policy" },
    ],
  },
];

export default function Footer() {
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
              Custom AI agents, intelligent automation and business software — engineered around the systems your business already runs on.
            </p>
            <ul className="mt-6 space-y-2.5 text-[0.88rem]">
              <li>
                <a href={`mailto:${site.contact.email}`} className="inline-flex items-center gap-2.5 hover:text-white transition-colors group">
                  <IconMail size={15} className="text-cyan-ic" />
                  <span className="group-hover:underline underline-offset-4">{site.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${site.contact.whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2.5 hover:text-white transition-colors group">
                  <IconWhatsApp size={15} className="text-signal" />
                  <span className="group-hover:underline underline-offset-4">WhatsApp ITCYBER</span>
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-ink-300">
                <IconPin size={15} className="text-brand-400" />
                {site.contact.address}
              </li>
            </ul>
            <div className="mt-6 flex gap-2">
              {site.socials.map((s) => (
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
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-signal rounded-full anim-pulse-dot" aria-hidden />
            All systems operational · {site.contact.hours}
          </p>
          <div className="flex gap-5 text-[0.8rem]">
            <Link to="/privacy-policy" className="text-ink-400 hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms-of-service" className="text-ink-400 hover:text-white transition-colors">Terms</Link>
            <Link to="/cookie-policy" className="text-ink-400 hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
