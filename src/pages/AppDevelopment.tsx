import { useEffect, useState } from "react";
import { Reveal, Scramble, useReducedMotion } from "../lib/motion";
import { cn } from "../lib/utils";
import { Button, Section, SectionHead, CtaBand, Badge } from "../components/ui";
import {
  IconArrow, IconCheck, IconDevice, IconCode, IconPlug, IconShield, IconSpark, IconPulse,
} from "../components/icons";
import { usePageMeta } from "../lib/seo";

/* ─────────────────────────── data (page-local) ─────────────────────────── */

const appTypes = [
  { n: "01", t: "Customer Apps", d: "Booking, tracking, offers and self-service — the relationship lives in their pocket." },
  { n: "02", t: "Employee & Operations Apps", d: "Approvals, updates, checklists and field reports from anywhere, synced when back online." },
  { n: "03", t: "Field & Service Apps", d: "Job sheets, GPS check-ins, photo capture and signature — the site visit, digitised." },
  { n: "04", t: "Booking & Service Apps", d: "Scheduling with reminders that measurably reduce no-shows and reschedule friction." },
  { n: "05", t: "Marketplace Apps", d: "Listings, orders, payments and fulfilment flows for two-sided businesses." },
  { n: "06", t: "AI-Powered Apps", d: "Chat, voice, scan and recommendations — intelligence where the user already is." },
  { n: "07", t: "Mobile Dashboards", d: "The five numbers that run your day, available before the first coffee." },
  { n: "08", t: "Progressive Web Apps", d: "Installable, offline-ready web experiences — no app-store friction, full native feel." },
];

const aiAppCapabilities = [
  { t: "AI Chat Assistant", d: "In-app support grounded in your policies." },
  { t: "Voice AI", d: "Hands-free commands for field and ops teams." },
  { t: "Smart Search", d: "Find records by meaning, not exact spelling." },
  { t: "AI Recommendations", d: "Next-best products, slots and actions." },
  { t: "AI Summaries", d: "Daily briefs generated from live data." },
  { t: "Document AI", d: "Scan, extract and file — receipts to KYC." },
  { t: "Image Analysis", d: "Site photos, meters and stock read automatically." },
  { t: "Workflow Assistant", d: "Guides users through multi-step processes." },
  { t: "Sales Assistant", d: "Talk tracks and quotes from your catalogue." },
  { t: "Business Alerts", d: "Anomaly detection that pings before it hurts." },
  { t: "Personalisation", d: "Interfaces that adapt to each user's role." },
  { t: "Customer Support Triage", d: "Queries answered, tagged and escalated properly." },
];

const mobileArch = [
  { l: "App Shell", items: ["Cross-platform UI", "Offline-first state", "Push notifications", "Camera & scanner"], tone: "#56D9FF" },
  { l: "Sync & API Layer", items: ["Background sync", "Conflict handling", "Signed requests", "Versioned APIs"], tone: "#8FB4FF" },
  { l: "AI Layer", items: ["On-device inference", "LLM assistants", "Document AI", "Recommendations"], tone: "#3E7BFF" },
  { l: "Backend", items: ["Supabase", "PostgreSQL", "Auth & RLS", "Private storage"], tone: "#8FB4FF" },
  { l: "Business Systems", items: ["CRM", "ERP", "Payments", "Calendar", "WhatsApp"], tone: "#3DDC97" },
];

const appStack = ["React Native / Expo", "Progressive Web Apps", "React & TypeScript", "Supabase & PostgreSQL", "Push notification services", "Offline sync & storage", "Camera / OCR pipelines", "App Store & Play publishing"];

const processSteps = [
  { p: "Use-Case Mapping", d: "Who uses it, where, and on what connection — the app is designed around real days, not demos." },
  { p: "UX & Flows", d: "Thumbs-first navigation, states for empty / loading / error / offline." },
  { p: "Build", d: "Cross-platform engineering with typed APIs and automated tests." },
  { p: "Publish / Install", d: "Store submissions, PWA install prompts, rollout and versioning." },
  { p: "Monitor", d: "Crash reporting, usage analytics and a stabilisation window after launch." },
];

/* ─────────────────────────────── hero visual ─────────────────────────────── */

function PhoneMock() {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTab((t) => (t + 1) % 3), 2800);
    return () => clearInterval(id);
  }, [reduce]);

  const feed = [
    { a: "New booking", d: "Sat 11:00 · confirmed", tone: "bg-signal" },
    { a: "Payment received", d: "₹24,000 · Razorpay", tone: "bg-cyan-ic" },
    { a: "AI summary ready", d: "3 action items", tone: "bg-brand-400" },
  ];
  const visible = [0, 1, 2].map((o) => feed[(tab + o) % feed.length]);

  return (
    <div className="relative flex justify-center">
      <div className="absolute -inset-6 rounded-full bg-brand-500/[.09] blur-[70px]" aria-hidden />
      {/* phone frame */}
      <div className="relative w-[17rem] sm:w-[19rem] bg-ink-900 hairline rounded-[2rem] p-2.5 shadow-[0_40px_100px_-30px_rgba(0,0,0,.9)]">
        <div className="relative bg-ink-950 rounded-[1.5rem] overflow-hidden">
          <div className="flex items-center justify-center pt-2" aria-hidden>
            <span className="w-16 h-1.5 bg-ink-700 rounded-full" />
          </div>
          <div className="p-4">
            <p className="font-display font-bold text-white text-[1rem]">YourOps</p>
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ink-400">business app · demo ui</p>
            <div className="mt-3 space-y-2">
              {visible.map((f, i) => (
                <div key={`${f.a}-${i}`} className={cn("flex items-center gap-2.5 bg-ink-850 hairline clip-corner px-3 py-2.5 transition-all duration-500", i === 0 ? "opacity-100" : i === 1 ? "opacity-70" : "opacity-40")}>
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", f.tone, !reduce && "anim-pulse-dot")} aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-display font-semibold text-white text-[0.78rem] leading-tight">{f.a}</span>
                    <span className="block font-mono text-[0.6rem] text-ink-400">{f.d}</span>
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {["Today", "AI Brief", "Scan"].map((b, i) => (
                <span key={b} className={cn("h-9 flex items-center justify-center font-mono text-[0.6rem] uppercase tracking-[0.08em] clip-corner border", i === 0 ? "border-brand-400/70 text-cyan-ic bg-brand-500/[.08]" : "border-ink-600 text-ink-300")}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* floating capability chips */}
      <div className="absolute top-8 -left-2 sm:-left-10 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-cyan-ic bg-ink-900/95 hairline px-2.5 py-1.5 clip-corner">
        offline-ready
      </div>
      <div className="absolute bottom-16 -right-2 sm:-right-10 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-signal bg-ink-900/95 hairline px-2.5 py-1.5 clip-corner">
        push enabled
      </div>
      <div className="absolute top-1/2 -right-2 sm:-right-14 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-brand-300 bg-ink-900/95 hairline px-2.5 py-1.5 clip-corner">
        AI on-device
      </div>
    </div>
  );
}

/* ─────────────────────────────── the page ─────────────────────────────── */

export default function AppDevelopment() {
  usePageMeta({
    title: "Mobile App & PWA Development — ITCYBER",
    description: "Cross-platform mobile applications and progressive web apps by ITCYBER — customer, employee and operations apps with AI features, offline sync and Supabase backends."
    ,
    path: "/app-development",
  });

  return (
    <>
      {/* hero */}
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 25% 10%, rgba(86,217,255,.1), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)] grid lg:grid-cols-[1.1fr_1fr] gap-x-14 gap-y-12 items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-cyan-ic flex items-center gap-3">
                <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
                <Scramble text="MOBILE & PWA APPLICATIONS" />
              </p>
            </Reveal>
            <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
              Business software,<span className="text-brand-400"> in every pocket.</span>
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
                Customer apps, employee apps, field operations and progressive web apps — cross-platform,
                offline-aware and connected to your CRM and backend from day one. AI features are added
                where they create real value, never as decoration.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/contact" arrow>Discuss Your App</Button>
                <Button to="/app-development#architecture" variant="ghost">See Mobile Architecture</Button>
              </div>
            </Reveal>
            <Reveal delay={0.4}>
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
                {["Cross-platform & PWA", "Offline-aware sync", "Push notifications", "Supabase backend & auth"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[0.84rem] text-ink-200">
                    <IconCheck size={13} className="text-signal shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.25} y={30}>
            <PhoneMock />
          </Reveal>
        </div>
      </section>

      {/* app types — editorial index */}
      <Section tone="paper">
        <div className="wrap">
          <SectionHead
            tone="paper"
            eyebrow="what we build"
            title={<>Eight kinds of business apps. <span className="text-brand-600">One standard of craft.</span></>}
            lead="Every app ships with the unglamorous essentials done properly: empty states, error handling, offline behaviour and accessibility."
          />
          <div className="mt-10 grid md:grid-cols-2 gap-x-10">
            {appTypes.map((s, i) => (
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

      {/* architecture — vertical */}
      <Section tone="dark" id="architecture" className="noise scroll-mt-20">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <SectionHead
            eyebrow="mobile architecture"
            title={<>Five layers between the screen <span className="text-brand-400">and your systems.</span></>}
            lead="An app is only as good as what it's connected to. We engineer the full path from the interface down to your CRM and ERP."
          />
          <div className="mt-10 max-w-3xl mx-auto">
            {mobileArch.map((layer, i) => (
              <Reveal key={layer.l} delay={i * 0.07}>
                <div className="relative">
                  {i < mobileArch.length - 1 && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[-1.4rem] h-7 w-px bg-white/[.12]" aria-hidden />
                  )}
                  <div className="bg-ink-850/80 hairline clip-corner p-5 mb-7 hover:-translate-y-0.5 hover:bg-ink-800 transition-all duration-300">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="flex items-center gap-2.5 font-display font-bold text-white text-[1.05rem]">
                        <span className="w-2.5 h-2.5 shrink-0" style={{ background: layer.tone }} aria-hidden />
                        {layer.l}
                      </p>
                      <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">layer {String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {layer.items.map((it) => (
                        <span key={it} className="font-mono text-[0.68rem] px-2.5 py-1 bg-ink-950/70 hairline text-ink-200 clip-corner">{it}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* AI in apps */}
      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <SectionHead
            eyebrow="ai in apps"
            title={<>Intelligence where your users <span className="text-brand-400">already are.</span></>}
            lead="Available engineering capabilities — scoped per project, deployed where they change outcomes."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {aiAppCapabilities.map((c, i) => (
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
              On-device where latency matters, cloud LLMs where reasoning matters — chosen per feature.
            </p>
          </Reveal>
        </div>
      </Section>

      {/* backend, security, integrations + process */}
      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-x-14 gap-y-12">
          <div>
            <SectionHead
              tone="paper"
              eyebrow="backend & security"
              title={<>The invisible half, <span className="text-brand-600">done properly.</span></>}
            />
            <div className="mt-8 space-y-3">
              {[
                { i: <IconShield size={16} />, t: "Authentication & RLS", d: "Supabase auth with row-level security — every user sees exactly their data." },
                { i: <IconDevice size={16} />, t: "Secure storage", d: "Documents and media in private buckets, opened only via short-lived signed URLs." },
                { i: <IconPulse size={16} />, t: "Offline-aware sync", d: "Work continues without signal; changes reconcile cleanly when back online." },
                { i: <IconPlug size={16} />, t: "CRM / ERP / payments", d: "The app updates your systems in real time — not someone's to-do list." },
              ].map((x, i) => (
                <Reveal key={x.t} delay={i * 0.05}>
                  <div className="flex items-start gap-4 bg-white hairline-light clip-corner p-4 hover:-translate-y-0.5 transition-transform duration-300">
                    <span className="w-9 h-9 shrink-0 clip-corner bg-brand-500/10 text-brand-600 flex items-center justify-center">{x.i}</span>
                    <div>
                      <p className="font-display font-semibold text-ink-900 text-[0.98rem]">{x.t}</p>
                      <p className="text-[0.8rem] text-ink-500 mt-0.5 leading-relaxed">{x.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <div>
            <SectionHead
              tone="paper"
              eyebrow="how we build"
              title={<>From use-case to <span className="text-brand-600">installed.</span></>}
            />
            <ol className="mt-8 space-y-4">
              {processSteps.map((s, i) => (
                <Reveal key={s.p} delay={i * 0.05}>
                  <li className="flex gap-4">
                    <span className="shrink-0 w-9 h-9 clip-corner hairline-light bg-white text-brand-600 font-mono text-[0.7rem] flex items-center justify-center border border-ink-900/[.08]">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <p className="font-display font-bold text-ink-900 text-[1rem]">{s.p}</p>
                      <p className="text-[0.84rem] text-ink-500 mt-0.5 leading-relaxed">{s.d}</p>
                    </div>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.2}>
              <div className="mt-6 hairline-light bg-white clip-corner p-4 border border-ink-900/[.08]">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">technologies we work with</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {appStack.map((t) => (
                    <span key={t} className="font-mono text-[0.66rem] px-2.5 py-1.5 bg-paper border border-ink-900/[.08] text-ink-600 clip-corner">{t}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* reference product architectures */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead
              eyebrow="reference product architectures"
              title={<>Apps we've architected <span className="text-brand-400">patterns for.</span></>}
              lead="Illustrative compositions — labelled honestly, never presented as named client work."
            />
            <Reveal delay={0.1}><Badge>illustrative · not client data</Badge></Reveal>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              { s: "Home-Services Business", flow: "Customer booking app → technician job-sheet app → GPS check-ins → payment capture → CRM + invoice automation" },
              { s: "Distribution Company", flow: "Sales rep order app → offline-first stock view → route planning → collection tracking → ERP sync" },
              { s: "Clinic Group", flow: "Patient app → appointment & reports → doctor daily brief → reminder automation → HMS integration" },
            ].map((x, i) => (
              <Reveal key={x.s} delay={i * 0.06}>
                <div className="h-full bg-ink-850/80 hairline clip-corner p-5 hover:-translate-y-1 transition-transform duration-300">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-cyan-ic">product architecture</p>
                  <h3 className="font-display font-bold text-white text-[1.1rem] mt-1.5">{x.s}</h3>
                  <p className="text-[0.84rem] text-ink-200 mt-2 leading-relaxed">{x.flow}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button to="/contact" arrow>
                Discuss Your App <IconArrow size={14} />
              </Button>
              <Button to="/web-development" variant="ghost">
                <IconCode size={15} /> Prefer a Web App?
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="paper">
        <div className="wrap">
          <Reveal>
            <CtaBand
              title="Native, PWA or web app — the honest answer depends on your users."
              text="Tell us who uses it, where, and how often offline. We'll recommend the right format and what it takes to ship."
              primaryLabel="Get an App Assessment"
              primaryTo="/contact?mode=assessment"
              secondaryLabel="Explore Custom Software"
              secondaryTo="/custom-software"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
