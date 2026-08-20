import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { MaskLines, Reveal, Scramble, useReducedMotion } from "../lib/motion";
import { cn } from "../lib/utils";
import { site } from "../data/site";
import {
  trustItems, beforeFlow, afterFlow, serviceCategories, agents, functionSolutions,
  industries, techEcosystem, processSteps, whyPillars, securityPillars, resources, capabilitiesIntro,
} from "../data/content";
import { Button, Section, SectionHead, Badge, IconTile, Tabs, CtaBand } from "../components/ui";
import {
  IconArrow, IconArrowUpRight, IconAgent, IconFlow, IconCode, IconPlug, IconShield,
  IconCheck, IconCompass, IconBlueprint, IconRoute, IconLayers, IconGrowth, IconSpark, IconPulse,
} from "../components/icons";
import HeroVisual from "../components/sections/HeroVisual";
import EcosystemVisual from "../components/sections/EcosystemVisual";
import { usePageMeta, orgSchema } from "../lib/seo";
import { useSiteSettings } from "../lib/cms";
import WorkflowRunner from "../components/workflows/WorkflowRunner";
import OpsDashboard from "../components/workflows/OpsDashboard";
import AgentMicroDemo from "../components/sections/AgentMicroDemo";

/* ---------------------------------- HERO ----------------------------------- */

function Hero() {
  const settings = useSiteSettings();
  const hp = (settings._homepage ?? {}) as { sub?: string; cta?: string };
  usePageMeta({
    title: "ITCYBER — AI Agents, Business Automation & Custom Software",
    description: site.description,
    path: "/",
    schema: orgSchema,
  });
  return (
    <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
      <div className="absolute inset-0 grid-bg" aria-hidden />
      <div className="absolute inset-0" style={{ background: "radial-gradient(58rem 34rem at 78% 18%, rgba(62,123,255,.14), transparent 60%)" }} aria-hidden />
      <div className="absolute inset-0" style={{ background: "radial-gradient(40rem 28rem at 8% 90%, rgba(86,217,255,.07), transparent 60%)" }} aria-hidden />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" aria-hidden />

      <div className="relative wrap pt-[clamp(2.5rem,5vw,4.5rem)] pb-[clamp(3rem,6vw,5rem)] lg:min-h-[calc(100svh-8.5rem)] lg:max-h-[1060px] lg:flex lg:flex-col lg:justify-center">
        <div className="grid lg:grid-cols-[1.02fr_1fr] gap-x-12 gap-y-10 items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-cyan-ic flex items-center gap-3">
                <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
                <Scramble text="AI OPERATIONS · BUILT IN INDIA" />
              </p>
            </Reveal>
            <h1 className="font-display font-bold tracking-tight text-white mt-5 text-[clamp(2.3rem,5.6vw,4.3rem)] leading-[1.03]">
              <MaskLines
                lines={[
                  <>Built for businesses</>,
                  <>ready to operate</>,
                  <span key="accent" className="relative inline-block">
                    with&nbsp;AI<span className="text-brand-400">.</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 220 10" fill="none" aria-hidden>
                      <path d="M3 7c60-5 150-5 214-2" stroke="#56D9FF" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
                    </svg>
                  </span>,
                ]}
              />
            </h1>
            <Reveal delay={0.25}>
              <p className="mt-6 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] leading-relaxed text-ink-200">
                {hp.sub ?? (
                <>ITCYBER designs and deploys <strong className="text-white font-semibold">custom AI agents</strong>,{" "}
                <strong className="text-white font-semibold">intelligent automations</strong> and{" "}
                <strong className="text-white font-semibold">business software</strong> that work across your existing
                systems — so your team moves faster, repetitive work disappears and operations scale.</>
                )}
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button to="/contact" size="lg" arrow>{hp.cta ?? site.cta.consultationLong}</Button>
                <Button to="/solutions" variant="ghost" size="lg">Explore Our Solutions</Button>
              </div>
              <Link to="/#demo" className="group mt-5 inline-flex items-center gap-2 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-ink-300 hover:text-cyan-ic transition-colors">
                <IconPulse size={14} className="text-cyan-ic" />
                See how it works
                <span className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10" aria-hidden />
              </Link>
            </Reveal>
            <Reveal delay={0.45}>
              <dl className="mt-10 grid grid-cols-3 gap-4 max-w-md">
                {[
                  { v: "Seconds", k: "lead response, by design" },
                  { v: "24×7", k: "agents working your systems" },
                  { v: "1 team", k: "AI + automation + software" },
                ].map((s) => (
                  <div key={s.k} className="border-l border-ink-600 pl-3">
                    <dt className="sr-only">{s.k}</dt>
                    <dd className="font-display font-bold text-white text-[clamp(1.15rem,2vw,1.5rem)]">{s.v}</dd>
                    <dd className="text-[0.72rem] text-ink-300 mt-0.5 leading-snug">{s.k}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.2} y={34} className="relative">
            <HeroVisual />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- TRUST ----------------------------------- */

function TrustStrip() {
  return (
    <section className="bg-paper text-ink-800 border-y border-ink-900/[.08] relative overflow-hidden">
      <div className="absolute inset-0 grid-bg-light opacity-70" aria-hidden />
      <div className="relative wrap py-[clamp(2.2rem,4vw,3.2rem)]">
        <Reveal>
          <p className="font-display font-bold text-ink-900 text-[clamp(1.15rem,2.2vw,1.6rem)] tracking-tight max-w-3xl text-balance">
            Designed for businesses that want AI to produce <span className="text-brand-600">measurable outcomes</span> — not demos.
          </p>
        </Reveal>
        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ink-900/[.1]">
          {trustItems.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06} className="bg-paper">
              <div className="p-4 h-full group hover:bg-white transition-colors duration-300">
                <p className="flex items-center gap-2 font-display font-semibold text-ink-900 text-[0.95rem]">
                  <IconCheck size={14} className="text-brand-600 shrink-0 transition-transform duration-300 group-hover:scale-125" />
                  {t.title}
                </p>
                <p className="text-[0.8rem] text-ink-500 mt-1.5 leading-snug">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- PROBLEM → SOLUTION ---------------------------- */

function ProblemSolution() {
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!playing) return;
    if (reduce) {
      setStep(afterFlow.length);
      setPlaying(false);
      return;
    }
    if (step > afterFlow.length) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStep((s) => s + 1), 620);
    return () => clearTimeout(id);
  }, [playing, step, reduce]);

  const run = () => {
    setStep(0);
    setPlaying(true);
  };

  return (
    <Section tone="paper">
      <div className="wrap">
        <SectionHead
          tone="paper"
          eyebrow="the operational tax"
          title={<>Your team shouldn't spend its day doing work <span className="text-brand-600">AI can handle.</span></>}
          lead="Every hour spent copying leads between tools, chasing follow-ups and rebuilding reports is an hour not spent selling, serving or growing."
        />

        <div className="mt-10 grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-start">
          {/* before */}
          <Reveal className="relative bg-white hairline-light clip-corner p-6">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-rose-ic flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-rose-ic rounded-full" aria-hidden /> before — manual
            </p>
            <ol className="mt-5 space-y-0">
              {beforeFlow.map((s, i) => (
                <li key={s} className="relative pl-7 pb-5 last:pb-0">
                  {i < beforeFlow.length - 1 && <span className="absolute left-[7px] top-5 bottom-0 w-px bg-ink-900/15" aria-hidden />}
                  <span className="absolute left-0 top-1 w-[15px] h-[15px] border border-rose-ic/60 bg-rose-ic/[.07] flex items-center justify-center" aria-hidden>
                    <span className="w-1 h-1 bg-rose-ic rounded-full" />
                  </span>
                  <span className="font-display font-semibold text-ink-800 text-[0.95rem]">{s}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* toggle */}
          <Reveal delay={0.1} className="flex lg:flex-col items-center justify-center gap-3 lg:pt-24">
            <button
              onClick={run}
              className="relative w-14 h-14 shrink-0 inline-flex items-center justify-center bg-brand-500 text-white clip-corner hover:bg-brand-400 transition-all duration-300 shadow-[0_10px_30px_-8px_rgba(62,123,255,.6)] hover:-translate-y-0.5"
              aria-label="Play the automated workflow comparison"
            >
              {playing ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4.5v15l13-7.5Z" /></svg>
              )}
            </button>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-500 hidden lg:block [writing-mode:vertical-lr]">run the difference</span>
          </Reveal>

          {/* after */}
          <Reveal delay={0.15} className={cn("relative bg-ink-900 hairline clip-corner p-6 overflow-hidden transition-shadow duration-500", playing && "shadow-[0_20px_60px_-20px_rgba(62,123,255,.5)]")}>
            <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
            <p className="relative font-mono text-[0.64rem] uppercase tracking-[0.2em] text-signal flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-signal rounded-full anim-pulse-dot" aria-hidden /> after ITCYBER — automated
            </p>
            <ol className="relative mt-5">
              {afterFlow.map((s, i) => {
                const on = playing ? i < step : true;
                const current = playing && i === step - 1;
                return (
                  <li key={s} className={cn("relative pl-7 pb-5 last:pb-0 transition-all duration-500", on ? "opacity-100" : "opacity-30")}>
                    {i < afterFlow.length - 1 && (
                      <span className={cn("absolute left-[7px] top-5 bottom-0 w-px transition-colors duration-500", on ? "bg-brand-500/70" : "bg-white/10")} aria-hidden />
                    )}
                    <span className={cn("absolute left-0 top-0.5 w-[15px] h-[15px] border flex items-center justify-center transition-all duration-500", on ? "border-signal bg-signal/15" : "border-white/20")} aria-hidden>
                      {on && <IconCheck size={9} className="text-signal" />}
                    </span>
                    <span className={cn("font-display font-semibold text-[0.95rem] transition-colors duration-500", current ? "text-cyan-ic" : "text-white")}>{s}</span>
                  </li>
                );
              })}
            </ol>
            {!playing && step === 0 && (
              <p className="relative mt-4 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-400">press play to watch it run</p>
            )}
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-2.5">
            {["Faster response to every enquiry", "Fewer manual tasks per sale", "Follow-ups that never forget", "Systems that share one truth", "Reporting that builds itself"].map((b) => (
              <li key={b} className="flex items-center gap-2 text-[0.88rem] text-ink-600">
                <IconCheck size={14} className="text-brand-600" /> {b}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------ CORE CAPABILITIES ---------------------------- */

function MiniAutomationFlow() {
  const nodes = ["Trigger", "AI step", "CRM write", "WhatsApp", "Report"];
  const [a, setA] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setA((v) => (v + 1) % (nodes.length + 1)), 900);
    return () => clearInterval(id);
  }, [reduce, nodes.length]);

  return (
    <div className="flex items-center gap-1 flex-wrap" aria-hidden>
      {nodes.map((n, i) => (
        <span key={n} className="flex items-center gap-1">
          <span
            className={cn(
              "font-mono text-[0.62rem] uppercase tracking-[0.1em] px-2.5 h-8 inline-flex items-center border clip-corner transition-all duration-500",
              i === a % nodes.length ? "border-cyan-ic text-cyan-ic bg-cyan-ic/[.07]" : "border-ink-600 text-ink-300"
            )}
            style={i === a % nodes.length && !reduce ? { boxShadow: "0 0 14px rgba(86,217,255,.35)" } : undefined}
          >
            {n}
          </span>
          {i < nodes.length - 1 && (
            <span className={cn("h-px w-4 transition-colors duration-500", i < a % nodes.length ? "bg-cyan-ic" : "bg-ink-600")} />
          )}
        </span>
      ))}
    </div>
  );
}

function IntegrationOrbit() {
  const inner = ["WhatsApp", "CRM", "Email", "Calendar"];
  const outer = ["ERP", "Payments", "Sheets", "APIs", "Database", "Telephony"];
  const reduce = useReducedMotion();

  if (reduce)
    return (
      <div className="flex flex-wrap gap-1.5" aria-hidden>
        {[...inner, ...outer].map((t) => (
          <span key={t} className="font-mono text-[0.62rem] px-2 py-1 hairline text-ink-200">{t}</span>
        ))}
      </div>
    );

  return (
    <div className="relative w-[15rem] h-[15rem] mx-auto" aria-hidden>
      <span className="absolute inset-[4.5rem] border border-brand-500/40 rounded-full" />
      <span className="absolute inset-0 border border-ink-600 rounded-full" />
      <span className="absolute inset-[4.5rem] rounded-full flex items-center justify-center">
        <span className="w-16 h-16 clip-corner bg-ink-800 hairline flex items-center justify-center font-display font-bold text-[0.7rem] text-cyan-ic text-center leading-tight">ITCYBER<br />core</span>
      </span>
      <div className="absolute inset-[4.5rem] anim-spin-slow" style={{ animationDuration: "26s" }}>
        {inner.map((t, i) => (
          <span key={t} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${i * 90}deg) translate(3.6rem) rotate(-${i * 90}deg)` }}>
            <span className="anim-spin-slow font-mono text-[0.6rem] px-2 py-1 bg-ink-800 hairline text-brand-300 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 block" style={{ animationDuration: "26s", animationDirection: "reverse" }}>{t}</span>
          </span>
        ))}
      </div>
      <div className="absolute inset-0 anim-spin-slow" style={{ animationDuration: "40s", animationDirection: "reverse" }}>
        {outer.map((t, i) => (
          <span key={t} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${i * 60 + 15}deg) translate(7.35rem) rotate(-${i * 60 + 15}deg)` }}>
            <span className="anim-spin-slow font-mono text-[0.6rem] px-2 py-1 bg-ink-900 hairline text-ink-200 whitespace-nowrap -translate-x-1/2 -translate-y-1/2 block" style={{ animationDuration: "40s" }}>{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Capabilities() {
  const [agentsIdx, setAgentsIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAgentsIdx((v) => (v + 1) % 4), 1600);
    return () => clearInterval(id);
  }, []);
  const capIcons = [<IconAgent key="a" size={22} />, <IconFlow key="f" size={22} />, <IconCode key="c" size={22} />, <IconPlug key="p" size={22} />];

  const visuals = [
    /* agents: rotating agent chips */
    <div key="v0" className="space-y-2" aria-hidden>
      {agents.slice(0, 4).map((a, i) => (
        <div key={a.id} className={cn("flex items-center justify-between gap-3 p-3 clip-corner border transition-all duration-500", i === agentsIdx ? "border-brand-400/70 bg-brand-500/[.08] translate-x-1" : "border-white/[.08] bg-ink-850/60")}>
          <span className="flex items-center gap-2.5">
            <span className={cn("w-1.5 h-1.5 rounded-full", i === agentsIdx ? "bg-signal anim-pulse-dot" : "bg-ink-500")} />
            <span className={cn("font-display font-semibold text-[0.9rem]", i === agentsIdx ? "text-white" : "text-ink-200")}>{a.name}</span>
          </span>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-ink-400">{a.role}</span>
        </div>
      ))}
    </div>,
    /* automation builder */
    <div key="v1" className="bg-ink-950/70 hairline clip-corner p-5">
      <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-400 mb-4">workflow builder · lead-response.run</p>
      <MiniAutomationFlow />
      <div className="mt-5 grid grid-cols-3 gap-2 font-mono text-[0.6rem] text-ink-300" aria-hidden>
        <p className="hairline p-2">runs today<br /><span className="text-white text-[0.9rem] font-display font-bold">312</span></p>
        <p className="hairline p-2">fail rate<br /><span className="text-signal text-[0.9rem] font-display font-bold">0.3%</span></p>
        <p className="hairline p-2">hours saved<br /><span className="text-cyan-ic text-[0.9rem] font-display font-bold">41/wk</span></p>
      </div>
      <p className="mt-2 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ink-500">UI demo values</p>
    </div>,
    /* dashboard mock */
    <div key="v2"><OpsDashboard /></div>,
    /* integrations orbit */
    <div key="v3" className="py-4"><EcosystemVisual /></div>,
  ];

  return (
    <Section tone="deeper" className="noise">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <SectionHead
          eyebrow="core capabilities"
          title={capabilitiesIntro.heading}
          lead={capabilitiesIntro.text}
        />
        <div className="mt-12 space-y-5">
          {serviceCategories.map((cat, i) => (
            <Reveal key={cat.id} delay={0.05}>
              <article className={cn("group relative grid lg:grid-cols-2 gap-8 lg:gap-14 items-center bg-ink-900/70 hairline clip-corner p-[clamp(1.25rem,3vw,2.75rem)] overflow-hidden transition-colors duration-500 hover:bg-ink-850")}>
                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-gradient-to-b from-brand-500 to-cyan-ic opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden />
                <div className={cn(i % 2 === 1 && "lg:order-2")}>
                  <div className="flex items-center gap-4">
                    <IconTile>{capIcons[i]}</IconTile>
                    <span className="font-mono text-[0.66rem] tracking-[0.24em] text-ink-400">/{cat.index}</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-[clamp(1.4rem,2.6vw,2rem)] tracking-tight mt-4">{cat.title}</h3>
                  <p className="text-cyan-ic font-mono text-[0.72rem] uppercase tracking-[0.14em] mt-2">{cat.tagline}</p>
                  <p className="text-ink-200 mt-3 leading-relaxed max-w-lg">{cat.description}</p>
                  <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2 max-w-lg">
                    {cat.items.slice(0, 6).map((it) => (
                      <li key={it.name} className="flex items-start gap-2 text-[0.86rem] text-ink-200">
                        <IconCheck size={13} className="text-brand-400 mt-1 shrink-0" />
                        {it.name}
                      </li>
                    ))}
                  </ul>
                  <Link to={cat.page} className="group/link mt-6 inline-flex items-center gap-2 font-display font-semibold text-brand-300 hover:text-cyan-ic transition-colors">
                    {cat.pageLabel}
                    <IconArrow size={15} className="transition-transform duration-300 group-hover/link:translate-x-1" />
                  </Link>
                </div>
                <div className={cn(i % 2 === 1 && "lg:order-1")}>{visuals[i]}</div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------- FUNCTIONS ---------------------------------- */

function FunctionSolutions() {
  const [active, setActive] = useState(functionSolutions[0].id);
  const f = functionSolutions.find((x) => x.id === active)!;

  return (
    <Section tone="dark" id="solutions" className="scroll-mt-20">
      <div className="wrap">
        <SectionHead
          eyebrow="solutions by function"
          title={<>Every department has a workflow <span className="text-brand-400">waiting to be automated.</span></>}
          lead="Pick the function that hurts most. This is the shape of the system we would build around it."
        />
        <Reveal delay={0.1}>
          <div className="mt-8">
            <Tabs tabs={functionSolutions.map((x) => ({ id: x.id, label: x.label }))} active={active} onChange={setActive} />
          </div>
        </Reveal>

        <div key={f.id} className="mt-8 grid lg:grid-cols-[1fr_1.1fr] gap-6">
          <div className="space-y-5">
            {[
              { k: "the problem", v: f.problem, c: "text-rose-ic" },
              { k: "the ITCYBER system", v: f.solution, c: "text-cyan-ic" },
              { k: "the outcome", v: f.outcome, c: "text-signal" },
            ].map((row, i) => (
              <Reveal key={row.k} delay={i * 0.07}>
                <div className="bg-ink-850/70 hairline clip-corner p-5 h-full">
                  <p className={cn("font-mono text-[0.62rem] uppercase tracking-[0.2em]", row.c)}>{row.k}</p>
                  <p className="text-ink-100 mt-2 leading-relaxed text-[0.95rem]">{row.v}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.22}>
              <div className="flex flex-wrap gap-1.5">
                {f.tech.map((t) => (
                  <span key={t} className="font-mono text-[0.64rem] px-2.5 py-1.5 hairline text-ink-200 bg-ink-850 clip-corner">{t}</span>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="relative bg-ink-950/70 hairline clip-corner p-6 h-full overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
              <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-6">workflow · {f.label.toLowerCase()}</p>
              <ol className="relative grid sm:grid-cols-2 gap-x-8">
                {f.workflow.map((w, i) => (
                  <li key={w} className="relative flex items-center gap-3 pb-5">
                    <span className="relative z-10 w-8 h-8 shrink-0 clip-corner hairline bg-ink-800 flex items-center justify-center font-mono text-[0.62rem] text-cyan-ic">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display font-semibold text-white text-[0.92rem]">{w}</span>
                    {i < f.workflow.length - 1 && <span className="absolute left-4 top-9 bottom-0 w-px bg-ink-600 sm:hidden" aria-hidden />}
                  </li>
                ))}
              </ol>
              <div className="relative mt-2 pt-4 border-t border-white/[.07] flex items-center justify-between gap-3">
                <p className="text-[0.8rem] text-ink-300">Want this for your team?</p>
                <Button to="/contact" size="sm" arrow>Discuss Your Workflow</Button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------- INDUSTRIES -------------------------------- */

function IndustriesStrip() {
  return (
    <Section tone="paper">
      <div className="wrap flex flex-wrap items-end justify-between gap-4">
        <SectionHead
          tone="paper"
          eyebrow="industry solutions"
          title={<>Built around how your industry <span className="text-brand-600">actually runs.</span></>}
        />
        <Reveal delay={0.15}>
          <Button to="/solutions" variant="light" arrow>All industries</Button>
        </Reveal>
      </div>
      <div className="mt-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 px-[clamp(1.125rem,4vw,2.5rem)] pb-4 w-max">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.05} className="w-[19rem] shrink-0">
              <Link
                to={`/solutions/${ind.slug}`}
                className="group relative block h-full bg-white hairline-light clip-corner p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-24px_rgba(20,32,58,.35)]"
              >
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand-600">{String(i + 1).padStart(2, "0")} · playbook</p>
                <h3 className="font-display font-bold text-ink-900 text-[1.25rem] tracking-tight mt-2 group-hover:text-brand-600 transition-colors">{ind.name}</h3>
                <p className="text-[0.85rem] text-ink-500 mt-2 leading-relaxed">{ind.short}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {ind.agents.slice(0, 2).map((a) => (
                    <span key={a} className="font-mono text-[0.58rem] px-1.5 py-0.5 bg-brand-500/[.08] text-brand-600">{a}</span>
                  ))}
                </div>
                <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-500 group-hover:text-brand-600 transition-colors">
                  Open playbook <IconArrowUpRight size={12} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------- WORK TEASER --------------------------------- */

function WorkTeaser() {
  const blueprints = [
    { sector: "Real Estate", scope: "Speed-to-lead engine", stack: ["AI Sales Agent", "WhatsApp API", "Zoho CRM"], flow: "Portal leads → AI qualification → site visits auto-booked" },
    { sector: "Healthcare", scope: "Front-desk automation", stack: ["AI Appointment Agent", "Reminders", "Clinic HMS"], flow: "Enquiry → slot selection → confirmed appointment → zero no-show chases" },
    { sector: "E-commerce", scope: "Order conversation layer", stack: ["AI Support Agent", "Shipping APIs", "Store"], flow: "WISMO query → live tracking answer → resolved in seconds" },
  ];
  return (
    <Section tone="deeper" className="noise">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            eyebrow="engagement blueprints"
            title={<>What an ITCYBER system <span className="text-brand-400">looks like.</span></>}
            lead="Client engagements are under NDA, so instead of borrowed logos we show you the actual architecture patterns we deploy — and what they change."
          />
          <Reveal delay={0.15}>
            <Button to="/work" variant="ghost" arrow>How we document work</Button>
          </Reveal>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {blueprints.map((b, i) => (
            <Reveal key={b.sector} delay={i * 0.08}>
              <Link to="/work" className="group relative block h-full bg-ink-850/80 hairline clip-corner p-6 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-24px_rgba(62,123,255,.35)]">
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-brand-500/[.1] blur-3xl group-hover:bg-brand-500/[.2] transition-colors duration-500" aria-hidden />
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic">{b.sector} · blueprint</p>
                <h3 className="font-display font-bold text-white text-[1.2rem] tracking-tight mt-2">{b.scope}</h3>
                <p className="mt-3 text-[0.85rem] text-ink-300 font-mono leading-relaxed">{b.flow}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {b.stack.map((s) => (
                    <span key={s} className="font-mono text-[0.6rem] px-2 py-1 hairline text-ink-200">{s}</span>
                  ))}
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-brand-300 group-hover:text-cyan-ic transition-colors">
                  View anatomy <IconArrow size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-6 font-mono text-[0.7rem] text-ink-400 flex items-center gap-2">
            <IconShield size={13} className="text-cyan-ic" />
            Verified case studies with client names and metrics will be published here with client approval. We don't invent social proof.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

/* -------------------------------- TECH STACK --------------------------------- */

function TechEcosystem() {
  return (
    <Section tone="paper">
      <div className="wrap">
        <SectionHead
          tone="paper"
          eyebrow="technology ecosystem"
          title={<>Technologies we work with<span className="text-brand-600">.</span></>}
          lead="Model-agnostic and platform-honest: we pick the tools that fit your systems and budget — and we're fluent across all of these."
        />
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {techEcosystem.map((cat, i) => (
            <Reveal key={cat.category} delay={i * 0.05}>
              <div className="group bg-white hairline-light clip-corner p-5 h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-20px_rgba(20,32,58,.3)]">
                <p className="flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-500">
                  {cat.category}
                  <span className="w-1.5 h-1.5 bg-brand-500 group-hover:bg-signal transition-colors" aria-hidden />
                </p>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {cat.items.map((it) => (
                    <li key={it} className="font-mono text-[0.7rem] px-2 py-1 bg-paper text-ink-700 hairline-light transition-colors duration-300 group-hover:border-brand-500/40">
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------- PROCESS ---------------------------------- */

function Process() {
  return (
    <Section tone="dark" id="process">
      <div className="wrap">
        <SectionHead
          eyebrow="how we work"
          title={<>From bottleneck to running system in <span className="text-brand-400">five moves.</span></>}
          lead="A delivery path with no mystery: you always know what's happening, what's next and what you'll receive."
        />
        <div className="relative mt-14">
          <div className="hidden lg:block absolute top-6 left-[4%] right-[4%] h-px bg-ink-600" aria-hidden />
          <div className="hidden lg:block absolute top-6 left-[4%] h-px bg-gradient-to-r from-brand-500 to-cyan-ic anim-breathe" style={{ width: "92%" }} aria-hidden />
          <ol className="grid lg:grid-cols-5 gap-8 lg:gap-5">
            {processSteps.map((p, i) => (
              <Reveal key={p.index} delay={i * 0.08}>
                <li className="relative">
                  <div className="relative z-10 w-12 h-12 clip-corner bg-ink-800 hairline flex items-center justify-center font-display font-bold text-cyan-ic transition-all duration-500 hover:bg-brand-500 hover:text-white hover:shadow-[0_0_30px_-6px_rgba(62,123,255,.8)]">
                    {p.index}
                  </div>
                  <h3 className="font-display font-bold text-white text-[1.15rem] mt-4">{p.title}</h3>
                  <p className="text-[0.85rem] text-ink-300 mt-2 leading-relaxed">{p.text}</p>
                  <p className="mt-3 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-signal flex items-center gap-1.5">
                    <IconCheck size={11} /> {p.deliverable}
                  </p>
                  {i < processSteps.length - 1 && (
                    <span className="lg:hidden absolute left-6 top-14 bottom-[-2rem] w-px bg-ink-600" aria-hidden />
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/* -------------------------------- WHY ITCYBER -------------------------------- */

const pillarIcons: Record<string, React.ReactNode> = {
  compass: <IconCompass size={20} />,
  blueprint: <IconBlueprint size={20} />,
  route: <IconRoute size={20} />,
  layers: <IconLayers size={20} />,
  plug: <IconPlug size={20} />,
  growth: <IconGrowth size={20} />,
};

function WhyItcyber() {
  const [open, setOpen] = useState(0);
  return (
    <Section tone="paper">
      <div className="wrap grid lg:grid-cols-[1fr_1.25fr] gap-12 items-start">
        <div className="lg:sticky lg:top-28">
          <SectionHead
            tone="paper"
            eyebrow="why ITCYBER"
            title={<>Most vendors sell a tool. We deliver <span className="text-brand-600">a running system.</span></>}
            lead="Six commitments that shape every engagement — expand each to see what it means in practice."
          />
          <Reveal delay={0.2}>
            <div className="mt-8 bg-ink-900 hairline clip-corner p-5 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
              <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic">one accountable team</p>
              <p className="relative text-white font-display font-semibold text-[1.05rem] mt-2 leading-snug">
                Strategy, agents, automations, software and support — under one roof, on one roadmap.
              </p>
            </div>
          </Reveal>
        </div>
        <div>
          {whyPillars.map((p, i) => {
            const on = open === i;
            return (
              <Reveal key={p.title} delay={i * 0.04}>
                <button
                  className={cn("w-full text-left border-b border-ink-900/[.1] py-5 group", i === 0 && "border-t")}
                  onClick={() => setOpen(on ? -1 : i)}
                  aria-expanded={on}
                >
                  <span className="flex items-center gap-4">
                    <span className={cn("w-10 h-10 shrink-0 inline-flex items-center justify-center clip-corner border transition-all duration-300", on ? "bg-brand-500 border-brand-500 text-white" : "border-ink-900/25 text-brand-600 group-hover:border-brand-500")}>
                      {pillarIcons[p.icon]}
                    </span>
                    <span className="flex-1 font-display font-bold text-ink-900 text-[clamp(1.05rem,2vw,1.3rem)] tracking-tight">{p.title}</span>
                    <span className={cn("font-mono text-[0.66rem] text-ink-400 transition-transform duration-300", on && "rotate-45 text-brand-600")}>+</span>
                  </span>
                  <span className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", on ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                    <span className="overflow-hidden block">
                      <span className="block pt-3 pl-14 text-ink-500 leading-relaxed max-w-xl">{p.text}</span>
                    </span>
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------- SECURITY ---------------------------------- */

function Security() {
  return (
    <Section tone="deeper" id="security" className="noise scroll-mt-20">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] rounded-full bg-brand-500/[.05] blur-[120px]" aria-hidden />
      <div className="relative wrap">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12">
          <div>
            <SectionHead
              eyebrow="security & reliability"
              title={<>AI innovation without <span className="text-brand-400">compromising control.</span></>}
              lead="Autonomy without boundaries is a liability. Every ITCYBER system ships with explicit permissions, complete logs and a human in the loop wherever stakes are high."
            />
            <Reveal delay={0.2}>
              <div className="mt-8 inline-flex items-center gap-3 hairline bg-ink-850 clip-corner px-4 py-3">
                <IconShield size={20} className="text-signal" />
                <p className="text-[0.82rem] text-ink-200 max-w-xs">
                  No inflated compliance claims — we implement real controls and show you the architecture.
                </p>
              </div>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 gap-px bg-white/[.06] hairline clip-corner overflow-hidden">
            {securityPillars.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.04} className="bg-ink-900">
                <div className="p-5 h-full group hover:bg-ink-850 transition-colors duration-300 relative">
                  <span className="absolute top-0 left-0 w-5 h-px bg-cyan-ic/0 group-hover:bg-cyan-ic/70 transition-colors duration-500" aria-hidden />
                  <p className="font-display font-semibold text-white text-[0.95rem] flex items-center gap-2">
                    <span className="w-1 h-1 bg-cyan-ic" aria-hidden />
                    {s.title}
                  </p>
                  <p className="text-[0.8rem] text-ink-300 mt-1.5 leading-relaxed">{s.text}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.3} className="bg-ink-900 sm:col-span-2">
              <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-ink-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-signal rounded-full anim-pulse-dot" aria-hidden />
                  audit log · every action traceable
                </p>
                <Link to="/contact" className="font-mono text-[0.68rem] uppercase tracking-[0.14em] text-cyan-ic hover:text-white transition-colors inline-flex items-center gap-1.5">
                  Request architecture review <IconArrowUpRight size={12} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------------- RESOURCES --------------------------------- */

function Resources() {
  return (
    <Section tone="paper" id="resources" className="scroll-mt-20">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead tone="paper" eyebrow="field notes" title={<>Practical reading, <span className="text-brand-600">zero fluff.</span></>} />
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <Link to={r.to} className="group relative block h-full bg-white hairline-light clip-corner p-5 overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_-22px_rgba(20,32,58,.35)]">
                <p className="flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.16em]">
                  <span className="text-brand-600">{r.kind}</span>
                  <span className="text-ink-400">{r.minutes}</span>
                </p>
                <h3 className="font-display font-bold text-ink-900 text-[1.05rem] tracking-tight mt-3 leading-snug group-hover:text-brand-600 transition-colors">{r.title}</h3>
                <p className="text-[0.83rem] text-ink-500 mt-2 leading-relaxed">{r.blurb}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ink-500 group-hover:text-brand-600 transition-colors">
                  Read <IconArrow size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ----------------------------------- PAGE ------------------------------------ */

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSolution />
      <Capabilities />
      <Section tone="deeper" id="demo" className="noise scroll-mt-20 pt-[clamp(4rem,8vw,6.5rem)]">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <SectionHead
            eyebrow="interactive demo"
            title={<>Watch an AI workflow <span className="text-brand-400">run.</span></>}
            lead="Pick a scenario. Every step below mirrors a run our systems execute for real businesses."
          />
          <Reveal delay={0.15}>
            <div className="mt-10">
              <WorkflowRunner />
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button to="/contact" arrow>Automate This Process</Button>
              <Button to="/automations" variant="ghost">Explore Automations</Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* AI Agents preview */}
      <Section tone="paper">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead
              tone="paper"
              eyebrow="ai agents"
              title={<>Agents that do the work, <span className="text-brand-600">not just the talking.</span></>}
              lead="Each one is wired into your systems and bounded by your rules. Hover a card — they're already working."
            />
            <Reveal delay={0.15}>
              <Button to="/ai-agents" variant="light" arrow>Discover AI Agents</Button>
            </Reveal>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.05}>
                <Link to="/ai-agents" className="group relative block h-full bg-white hairline-light clip-corner p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_-24px_rgba(46,99,232,.3)] overflow-hidden">
                  <span className="absolute top-0 right-0 w-16 h-16 bg-brand-500/[.06] rounded-bl-full group-hover:bg-brand-500/[.12] transition-colors duration-500" aria-hidden />
                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-brand-600">{a.role}</p>
                  <h3 className="font-display font-bold text-ink-900 text-[1.15rem] tracking-tight mt-1.5 group-hover:text-brand-600 transition-colors">{a.name}</h3>
                  <p className="text-[0.83rem] text-ink-500 mt-2 leading-relaxed">{a.description}</p>
                  <div className="mt-4 pt-4 border-t border-ink-900/[.08]">
                    <AgentMicroDemo demo={a.demo} tone="paper" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <FunctionSolutions />
      <IndustriesStrip />
      <WorkTeaser />
      <TechEcosystem />
      <Process />
      <WhyItcyber />
      <Security />
      <Resources />

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Ready to see your business running on AI?"
              text="Book a free consultation — we'll map one workflow worth automating in the first call, whether or not you hire us."
              primaryLabel={site.cta.consultationLong}
              primaryTo="/contact"
              secondaryLabel="Get an Automation Assessment"
              secondaryTo="/contact?mode=assessment"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
