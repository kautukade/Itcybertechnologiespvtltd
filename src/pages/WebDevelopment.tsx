import { useEffect, useState } from "react";
import { Reveal, Scramble, useReducedMotion } from "../lib/motion";
import { cn } from "../lib/utils";
import { architectureLayers } from "../data/content";
import { Button, Section, SectionHead, CtaBand, Badge } from "../components/ui";
import {
  IconArrow, IconArrowUpRight, IconCheck, IconGlobe, IconCode, IconPlug, IconShield, IconSpark,
} from "../components/icons";
import { usePageMeta } from "../lib/seo";

/* ─────────────────────────── data (page-local) ─────────────────────────── */

const siteTypes = [
  { n: "01", t: "Corporate & Business Websites", d: "The digital headquarters: positioning, services, proof and enquiry capture — engineered, not templated." },
  { n: "02", t: "Institutional & Organisation Websites", d: "Multi-section structures with governance: departments, notices, documents and searchable archives." },
  { n: "03", t: "Education Websites", d: "Courses, admissions windows, faculty and enquiry flows that feed straight into your admission pipeline." },
  { n: "04", t: "Healthcare Websites", d: "Doctors, specialities, appointment booking and patient information with privacy handled properly." },
  { n: "05", t: "Real Estate Websites", d: "Listings, project pages, virtual walkthroughs and site-visit booking wired to your sales CRM." },
  { n: "06", t: "Professional Service Websites", d: "Expertise presented as evidence — case architectures, insights and a frictionless first contact." },
  { n: "07", t: "E-Commerce Experiences", d: "Catalogue, cart, payments, shipping and order tracking — with automation on every edge." },
  { n: "08", t: "Landing & Campaign Pages", d: "Single-purpose pages where every element exists to convert one specific audience." },
];

const appSurfaces = [
  { t: "Client & Vendor Portals", d: "Private, role-controlled areas: status tracking, document exchange, approvals and invoices — removing the status-call traffic." },
  { t: "Admin Panels & CMS", d: "Your team publishes content, manages records and configures the site without touching code or waiting on developers." },
  { t: "Booking-Enabled Websites", d: "Appointments, site visits and service slots booked straight from the page — synced to calendars with automated reminders." },
  { t: "Lead-Generation Systems", d: "Every form captured, enriched, scored and routed to your CRM in seconds, with WhatsApp follow-up already running." },
  { t: "Web Applications", d: "Dashboards, management systems and SaaS products — the same engineering discipline, applied to software people live in." },
  { t: "Interactive 3D Experiences", d: "Premium WebGL moments — product configurators, data-driven scenes — deployed where they earn attention, never as decoration." },
];

const aiWebCapabilities = [
  { t: "AI Chat Assistant", d: "Grounded in your business, not a generic script." },
  { t: "AI Sales Assistant", d: "Qualifies visitors and routes hot enquiries." },
  { t: "AI Lead Qualification", d: "Budget, intent and fit scored from the conversation." },
  { t: "AI Appointment Assistant", d: "Books against real availability." },
  { t: "AI Search", d: "Semantic search across your pages and documents." },
  { t: "AI FAQ Assistant", d: "Answers with sources, escalates when unsure." },
  { t: "AI Knowledge Base", d: "Your documentation, made conversational." },
  { t: "AI Product Recommendations", d: "Catalogue surfaces matched to the visitor." },
  { t: "AI Document Analysis", d: "Uploads read, extracted and routed." },
  { t: "AI Enquiry Routing", d: "Right team, right context, every time." },
  { t: "AI Form Analysis", d: "Free-text briefs structured automatically." },
  { t: "AI Quotation Assistance", d: "Ranges and proposals drafted from your rules." },
];

const webStack = ["React & TypeScript", "Vite & modern tooling", "Tailwind CSS", "Framer Motion", "Three.js / WebGL", "Supabase & PostgreSQL", "REST & GraphQL APIs", "Netlify edge hosting"];

const buildSteps = [
  { p: "Strategy & UX", d: "Goals, audiences, structure — the site is planned as a conversion system." },
  { p: "Design System", d: "Typography, spacing, motion language — one coherent identity, not pages." },
  { p: "Engineering", d: "Component-driven build with accessibility, performance budgets and testing." },
  { p: "CMS + Forms", d: "Your team owns the content; every form is wired to CRM and WhatsApp." },
  { p: "Launch & SEO", d: "Per-route metadata, structured data, sitemap, monitoring from day one." },
];

/* ─────────────────────────────── hero visual ─────────────────────────────── */

function BrowserMock() {
  const reduce = useReducedMotion();
  const [line, setLine] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setLine((l) => (l + 1) % 3), 2600);
    return () => clearInterval(id);
  }, [reduce]);
  return (
    <div className="relative">
      <div className="absolute -inset-8 rounded-full bg-brand-500/[.09] blur-[70px]" aria-hidden />
      <div className="relative bg-ink-900 hairline clip-corner overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)]">
        {/* chrome bar */}
        <div className="flex items-center gap-3 px-4 h-10 border-b border-white/[.07] bg-ink-850">
          <span className="flex gap-1.5" aria-hidden>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-ic/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-ic/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-signal/70" />
          </span>
          <span className="flex-1 h-6 bg-ink-950 hairline clip-corner flex items-center px-3 font-mono text-[0.6rem] text-ink-400 truncate">
            https://your-business.in — engineered by ITCYBER
          </span>
        </div>
        {/* page skeleton */}
        <div className="relative p-5 min-h-[19rem]">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative flex items-center justify-between">
            <span className="font-display font-bold text-white text-[0.95rem]">YourBusiness<span className="text-brand-400">.</span></span>
            <span className="flex gap-2" aria-hidden>
              {[0, 1, 2].map((i) => <span key={i} className="w-9 h-1.5 bg-ink-600" />)}
            </span>
          </div>
          <div className="relative mt-6 max-w-[70%]">
            <p className="font-display font-bold text-white text-[clamp(1.1rem,2vw,1.5rem)] leading-tight">
              A website that<span className="text-cyan-ic"> works</span>,<br />not just exists.
            </p>
            <p className="mt-2 h-1.5 w-3/4 bg-ink-700" aria-hidden />
            <p className="mt-1.5 h-1.5 w-1/2 bg-ink-700" aria-hidden />
            <span className="mt-4 inline-flex items-center gap-1.5 bg-brand-500 text-white font-display font-semibold text-[0.72rem] px-3 h-8 clip-corner">
              Get a proposal <IconArrow size={11} />
            </span>
          </div>
          {/* live integration chips */}
          <div className="relative mt-6 flex flex-wrap gap-1.5">
            {[
              { t: "lead → CRM", tone: "text-signal" },
              { t: "WhatsApp follow-up", tone: "text-cyan-ic" },
              { t: line === 0 ? "booking synced" : line === 1 ? "form scored · 91" : "analytics live", tone: "text-brand-300" },
            ].map((c) => (
              <span key={c.t} className={cn("font-mono text-[0.58rem] uppercase tracking-[0.1em] px-2 py-1 bg-ink-950/80 hairline clip-corner", c.tone)}>
                ▸ {c.t}
              </span>
            ))}
          </div>
          <p className="relative mt-4 font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-500">UI demonstration</p>
        </div>
      </div>
      {/* floating chips */}
      <div className="absolute -top-3 -right-3 sm:-right-6 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-cyan-ic bg-ink-900/95 hairline px-3 py-1.5 clip-corner">
        CMS · Admin · SEO
      </div>
      <div className="absolute -bottom-3 -left-3 sm:-left-6 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-signal bg-ink-900/95 hairline px-3 py-1.5 clip-corner">
        100/100 budget · Core Web Vitals
      </div>
    </div>
  );
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function WebDevelopment() {
  usePageMeta({
    title: "Custom Website & Web Application Development — ITCYBER",
    description: "Custom websites, web applications, portals and AI-integrated web experiences engineered by ITCYBER — CMS, admin panels, CRM and WhatsApp integrations included.",
    path: "/web-development",
  });

  return (
    <>
      {/* hero */}
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(55rem 32rem at 75% 15%, rgba(62,123,255,.14), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)] grid lg:grid-cols-[1.1fr_1fr] gap-x-14 gap-y-12 items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-cyan-ic flex items-center gap-3">
                <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
                <Scramble text="WEB & DIGITAL PRODUCTS" />
              </p>
            </Reveal>
            <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
              Websites engineered like software —<span className="text-brand-400"> because they are.</span>
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
                A business website is a product: it captures leads, books appointments, answers questions and feeds your CRM.
                We design, build and integrate custom websites and web applications that do all of it — with the admin panel,
                CMS and automations your team needs from day one.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/contact" arrow>Discuss Your Website</Button>
                <Button to="/web-development#architecture" variant="ghost">See the Architecture</Button>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {["Custom UI/UX & animation", "CMS + admin panel", "CRM & WhatsApp wired in", "SEO & performance engineering"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[0.84rem] text-ink-200">
                    <IconCheck size={13} className="text-signal shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.25} y={30}>
            <BrowserMock />
          </Reveal>
        </div>
      </section>

      {/* website types — editorial index */}
      <Section tone="paper">
        <div className="wrap">
          <SectionHead
            tone="paper"
            eyebrow="custom website engineering"
            title={<>Eight kinds of websites. <span className="text-brand-600">One engineering standard.</span></>}
            lead="Every site we ship is responsive by construction, accessible by default, and built to be measured — not just admired."
          />
          <div className="mt-10 grid md:grid-cols-2 gap-x-10">
            {siteTypes.map((s, i) => (
              <Reveal key={s.n} delay={(i % 2) * 0.06}>
                <div className="group flex gap-5 py-5 border-b border-ink-900/[.08] hover:bg-white transition-colors duration-300 px-2 -mx-2">
                  <span className="font-mono text-[0.68rem] text-brand-600 pt-1.5 shrink-0">{s.n}</span>
                  <div>
                    <h3 className="font-display font-bold text-ink-900 text-[1.12rem] tracking-tight group-hover:text-brand-600 transition-colors">{s.t}</h3>
                    <p className="text-[0.86rem] text-ink-500 mt-1.5 leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* web applications & portals — sticky split */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap grid lg:grid-cols-[1fr_1.35fr] gap-x-14 gap-y-10">
          <div className="lg:sticky lg:top-28 self-start">
            <SectionHead
              eyebrow="beyond brochures"
              title={<>Web applications, portals and <span className="text-brand-400">systems that run work.</span></>}
              lead="When the website needs logins, dashboards, records and approvals, it becomes a web application — and gets the full engineering treatment: permissions, APIs, testing and monitoring."
            />
            <Reveal delay={0.2}>
              <Button to="/custom-software" className="mt-8" arrow>Explore Custom Software</Button>
            </Reveal>
          </div>
          <div className="space-y-3">
            {appSurfaces.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.05}>
                <div className="group bg-ink-850/80 hairline clip-corner p-5 hover:bg-ink-800 hover:-translate-y-0.5 transition-all duration-400">
                  <div className="flex items-start gap-4">
                    <span className="w-9 h-9 shrink-0 clip-corner bg-brand-500/12 text-brand-300 flex items-center justify-center group-hover:text-cyan-ic transition-colors">
                      <IconCode size={17} />
                    </span>
                    <div>
                      <h3 className="font-display font-bold text-white text-[1.05rem] group-hover:text-cyan-ic transition-colors">{s.t}</h3>
                      <p className="text-[0.86rem] text-ink-200 mt-1 leading-relaxed">{s.d}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* AI-integrated websites */}
      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <SectionHead
            eyebrow="ai-integrated websites"
            title={<>Your website can become an <span className="text-brand-400">intelligent business interface.</span></>}
            lead="These are available engineering capabilities — composed into your site where they create measurable value, never bolted on as gimmicks."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiWebCapabilities.map((c, i) => (
              <Reveal key={c.t} delay={(i % 3) * 0.05}>
                <div className="group h-full hairline bg-ink-900/70 clip-corner p-4 hover:border-cyan-ic/50 hover:bg-ink-850 transition-all duration-300">
                  <p className="flex items-center gap-2 font-display font-semibold text-white text-[0.95rem]">
                    <IconSpark size={14} className="text-brand-400 group-hover:text-cyan-ic transition-colors shrink-0" />
                    {c.t}
                  </p>
                  <p className="text-[0.78rem] text-ink-300 mt-1.5 leading-snug">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <p className="mt-6 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-400">
              Each AI capability ships with decision traces, confidence thresholds and human escalation.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* architecture */}
      <Section tone="paper" id="architecture" className="scroll-mt-20">
        <div className="wrap">
          <SectionHead
            tone="paper"
            eyebrow="how it fits together"
            title={<>A website is the top layer of a <span className="text-brand-600">complete system.</span></>}
            lead="We build the full stack under your site — so the form doesn't just send an email, it updates your CRM, triggers WhatsApp and books the meeting."
          />
          <div className="mt-10 max-w-3xl mx-auto">
            {architectureLayers.map((layer, i) => (
              <Reveal key={layer.id} delay={i * 0.07}>
                <div className="relative">
                  {i < architectureLayers.length - 1 && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[-1.4rem] h-7 w-px bg-ink-900/15" aria-hidden />
                  )}
                  <div className="bg-white hairline-light clip-corner p-5 mb-7 hover:-translate-y-0.5 transition-transform duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="flex items-center gap-2.5 font-display font-bold text-ink-900 text-[1.05rem]">
                        <span className="w-2.5 h-2.5 shrink-0" style={{ background: layer.tone }} aria-hidden />
                        {layer.label}
                      </p>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">layer {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {layer.items.map((it) => (
                        <span key={it} className="font-mono text-[0.68rem] px-2.5 py-1 bg-paper border border-ink-900/[.08] text-ink-600 clip-corner">{it}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* process + security/performance */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap grid lg:grid-cols-2 gap-x-14 gap-y-12">
          <div>
            <SectionHead
              eyebrow="how we build"
              title={<>Five gates between idea <span className="text-brand-400">and launch.</span></>}
            />
            <ol className="mt-8 space-y-4">
              {buildSteps.map((s, i) => (
                <Reveal key={s.p} delay={i * 0.05}>
                  <li className="flex gap-4">
                    <span className="shrink-0 w-9 h-9 clip-corner hairline text-cyan-ic font-mono text-[0.7rem] flex items-center justify-center">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display font-bold text-white text-[1rem]">{s.p}</p>
                      <p className="text-[0.84rem] text-ink-300 mt-0.5 leading-relaxed">{s.d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
          <div>
            <SectionHead
              eyebrow="non-negotiables"
              title={<>Security & performance are <span className="text-brand-400">baseline, not add-ons.</span></>}
            />
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {[
                { i: <IconShield size={16} />, t: "HTTPS, security headers & RLS", d: "Hardened by default, audited per project." },
                { i: <IconGlobe size={16} />, t: "SEO architecture", d: "Per-route metadata, schema, sitemap, internal linking." },
                { i: <IconArrowUpRight size={16} />, t: "Performance budgets", d: "Core Web Vitals targets agreed before we build." },
                { i: <IconPlug size={16} />, t: "Integrations from day one", d: "CRM, WhatsApp, payments and analytics wired in." },
              ].map((x, i) => (
                <Reveal key={x.t} delay={i * 0.05}>
                  <div className="h-full bg-ink-850/80 hairline clip-corner p-4">
                    <span className="text-cyan-ic">{x.i}</span>
                    <p className="font-display font-semibold text-white text-[0.95rem] mt-2">{x.t}</p>
                    <p className="text-[0.78rem] text-ink-300 mt-1 leading-snug">{x.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-6 hairline bg-ink-900/70 clip-corner p-4">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">technologies we work with</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {webStack.map((t) => (
                    <span key={t} className="font-mono text-[0.66rem] px-2.5 py-1.5 bg-ink-950 hairline text-ink-200 clip-corner">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead
              tone="paper"
              eyebrow="reference architectures"
              title={<>What a complete web system <span className="text-brand-600">looks like.</span></>}
              lead="Illustrative compositions we deploy repeatedly — labelled honestly, never presented as named client work."
            />
            <Reveal delay={0.1}><Badge>illustrative · not client data</Badge></Reveal>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { s: "Real Estate Developer", flow: "Project website → AI lead qualification → Property CRM → WhatsApp nurture → Site-visit booking" },
              { s: "Multi-Speciality Clinic", flow: "Clinic website → Appointment engine → Patient portal → Reminder automation → Review requests" },
              { s: "Education Institution", flow: "Institution site → Admissions portal → AI enquiry assistant → Follow-up sequences → Fee dashboard" },
            ].map((x, i) => (
              <Reveal key={x.s} delay={i * 0.06}>
                <div className="h-full bg-white hairline-light clip-corner p-5 hover:-translate-y-1 transition-transform duration-300">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-600">solution architecture</p>
                  <h3 className="font-display font-bold text-ink-900 text-[1.1rem] mt-1.5">{x.s}</h3>
                  <p className="text-[0.84rem] text-ink-500 mt-2 leading-relaxed">{x.flow}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Have a website brief — or just a business goal?"
              text="Send it over. We'll reply with an engineer's read on structure, integrations and what the site should actually achieve."
              primaryLabel="Discuss Your Project"
              primaryTo="/contact"
              secondaryLabel="Explore Web Applications"
              secondaryTo="/custom-software"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
