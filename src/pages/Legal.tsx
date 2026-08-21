import { Link, useLocation } from "react-router-dom";
import { Reveal, Scramble } from "../lib/motion";
import { site } from "../data/site";
import { useSiteConfig, hasEmail } from "../lib/siteSettings";
import { useCollection } from "../lib/cms";
import type { LegalPageRow } from "../types/db";
import { Button, Section } from "../components/ui";

type Block = { h: string; p: string[] };
type Doc = { title: string; updated: string; intro: string; blocks: Block[] };

/**
 * Static legal copy (fallback). Email references are injected at render time
 * from the RUNTIME settings store, and degrade to "our contact page" when no
 * email is configured — never an empty "by emailing ." sentence.
 */
function buildContent(email: string): Record<string, Doc> {
  const contactRef = email || "our contact page (itcyber.in/contact)";
  const byEmail = email ? `by emailing ${email}` : "via our contact page";
  return {
    "/privacy-policy": {
      title: "Privacy Policy",
      updated: "Last updated: January 2025",
      intro: `This policy explains what ${site.legalName} ("ITCYBER", "we") collects, why, and the choices you have. Short version: we collect what a conversation requires, we use it to do the work you asked for, and we never sell it.`,
      blocks: [
        { h: "1. What we collect", p: [
          "Enquiry details you submit through our forms (name, company, contact details, project description).",
          "Application details submitted via the careers page, including links you choose to share.",
          "Basic technical data such as browser type and pages viewed, used only to understand site usage in aggregate.",
        ]},
        { h: "2. How we use it", p: [
          "To respond to enquiries, prepare scopes and run consultations you request.",
          "To assess job applications and coordinate interviews.",
          "To operate and secure the website — never to build advertising profiles about you.",
        ]},
        { h: "3. Sharing", p: [
          "We do not sell personal data. We share it only with processors required to run the site (hosting, email delivery) under contractual safeguards, or where the law requires it.",
        ]},
        { h: "4. Retention & your rights", p: [
          `Enquiry data is kept while the conversation and any engagement are active, then archived or deleted. You may request access, correction or deletion of your data at any time ${byEmail}.`,
        ]},
        { h: "5. Security", p: [
          "Data is transmitted over TLS, stored with access limited to staff who need it, and reviewed as part of our internal security practices. No method of storage is perfectly secure; we work to minimise, not merely promise, risk.",
        ]},
        { h: "6. Contact", p: [
          `Questions about this policy: reach us through ${contactRef}. This policy may be updated as our services evolve; the date above reflects the current version.`,
        ]},
      ],
    },
    "/terms-of-service": {
      title: "Terms of Service",
      updated: "Last updated: January 2025",
      intro: `These terms govern use of ${site.domain} and the general basis on which ${site.legalName} provides services. Project work is additionally governed by the specific proposal or agreement signed with you.`,
      blocks: [
        { h: "1. Our services", p: [
          "ITCYBER designs and delivers AI systems, automation, integrations, custom software, websites and applications. Scope, timelines and pricing for any engagement are defined in a written proposal; where a proposal and these terms conflict, the proposal prevails.",
        ]},
        { h: "2. Use of this website", p: [
          "You may browse and share this website freely. You may not attempt to disrupt it, scrape it at scale, or misrepresent its content as your own.",
        ]},
        { h: "3. Intellectual property", p: [
          "Website content and design are ours. Deliverables built for a client under a paid engagement are owned by that client per their agreement, including the right to maintain and modify them without us.",
        ]},
        { h: "4. Client responsibilities", p: [
          "Clients remain responsible for the lawful use of systems we build, for the accuracy of data they provide, and for obtaining any consents (for example, WhatsApp opt-ins) required for their communications.",
        ]},
        { h: "5. Warranties & liability", p: [
          "Services are provided with professional care. AI systems are probabilistic by nature; we build guardrails, logging and human escalation to manage this, and engagements define acceptance criteria in writing. Our aggregate liability is limited to the fees paid for the relevant engagement, to the extent permitted by law.",
        ]},
        { h: "6. Governing law", p: [
          `These terms are governed by the laws of India, with courts of the state of our registered office having jurisdiction. Questions: reach us through ${contactRef}.`,
        ]},
      ],
    },
    "/cookie-policy": {
      title: "Cookie Policy",
      updated: "Last updated: January 2025",
      intro: "We keep cookies minimal and honest. This page lists what we use and why — and how to control them.",
      blocks: [
        { h: "1. What we use", p: [
          "Essential storage: browser preferences (such as dismissed announcements) stored locally so the site behaves as you set it. These do not identify you.",
          "Analytics (optional): if enabled, privacy-respecting analytics cookies measure aggregate usage — pages visited, broad location — to improve the site. We do not run advertising trackers.",
        ]},
        { h: "2. Third parties", p: [
          "Embedded services (fonts, WhatsApp links) may set their own cookies when used. Their policies govern those cookies.",
        ]},
        { h: "3. Control", p: [
          `You can clear or block cookies in your browser settings at any time; the site remains fully usable without them. Questions: reach us through ${contactRef}.`,
        ]},
      ],
    },
  };
}

export default function Legal() {
  const { pathname } = useLocation();
  const cfg = useSiteConfig();
  const { data: livePages } = useCollection("legal_pages", [] as LegalPageRow[]);

  const slug = pathname.replace(/^\//, "");
  const liveDoc = livePages.find((p) => p.slug === slug && p.body && p.body.trim().length > 0);

  /* Live CMS content takes priority; static fallback below. */
  const staticDoc = buildContent(hasEmail(cfg) ? cfg.contact.email : "")[pathname] ?? buildContent("")["/privacy-policy"];
  const doc: Doc = liveDoc
    ? {
        title: liveDoc.title,
        updated: `Last updated: ${new Date(liveDoc.updated_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}`,
        intro: "",
        blocks: liveDoc
          .body!.split(/\n\n+/)
          .filter(Boolean)
          .map((para, i) => ({ h: i === 0 ? "" : "", p: [para] }))
          .filter((b) => b.p[0].trim().length > 0),
      }
    : staticDoc;

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)] max-w-3xl">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="LEGAL // PLAIN LANGUAGE" />
            </p>
            <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05]">{doc.title}</h1>
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-ink-400 mt-4">
              {doc.updated}{liveDoc ? " · managed in CMS" : ""}
            </p>
            {doc.intro && <p className="text-ink-200 mt-5 leading-relaxed">{doc.intro}</p>}
          </Reveal>
        </div>
      </section>
      <Section tone="paper">
        <div className="wrap max-w-3xl space-y-8">
          {doc.blocks.map((b, i) => (
            <Reveal key={`${b.h}-${i}`} delay={i * 0.03}>
              <section>
                {b.h && <h2 className="font-display font-bold text-ink-900 text-[1.25rem] tracking-tight">{b.h}</h2>}
                {b.p.map((t) => (
                  <p key={t.slice(0, 24)} className="text-ink-600 leading-relaxed mt-2.5">{t}</p>
                ))}
              </section>
            </Reveal>
          ))}
          <Reveal>
            <div className="pt-6 border-t border-ink-900/[.1] flex flex-wrap items-center justify-between gap-4">
              <p className="font-mono text-[0.7rem] text-ink-400 uppercase tracking-[0.14em]">{site.legalName}</p>
              <div className="flex gap-3">
                <Link to="/privacy-policy" className="text-[0.85rem] text-ink-500 hover:text-brand-600 transition-colors">Privacy</Link>
                <Link to="/terms-of-service" className="text-[0.85rem] text-ink-500 hover:text-brand-600 transition-colors">Terms</Link>
                <Link to="/cookie-policy" className="text-[0.85rem] text-ink-500 hover:text-brand-600 transition-colors">Cookies</Link>
              </div>
            </div>
            <Button to="/" variant="light" className="mt-6" arrow>Back to Home</Button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
