/**
 * Homepage expansion sections for ITCYBER's full capability story:
 *  - WhatWeBuild: interactive index of the six things ITCYBER engineers
 *  - FullStack: product architecture layers + 3D ecosystem + AI-vs-traditional toggle
 *  - Lifecycle: idea → intelligent system journey
 *  - SolutionArchitectures: illustrative composed systems per sector
 */
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal, useReducedMotion } from "../../lib/motion";
import { cn } from "../../lib/utils";
import {
  whatWeBuild, architectureLayers, traditionalVsAi, lifecyclePhases, solutionArchitectures,
  type BuildCapability,
} from "../../data/content";
import { Section, SectionHead, Button, Badge } from "../ui";
import { IconArrow, IconCheck, IconChevron, IconSpark } from "../icons";
import EcosystemVisual from "./EcosystemVisual";

/* ─────────────────────────── capability glyphs (SVG) ─────────────────────────── */

function Glyph({ kind }: { kind: BuildCapability["glyph"] }) {
  const common = "w-full h-auto";
  switch (kind) {
    case "browser":
      return (
        <svg viewBox="0 0 240 140" className={common} aria-hidden>
          <rect x="10" y="14" width="220" height="112" fill="#0a1120" stroke="#2a3d66" />
          <path d="M10 34h220" stroke="#2a3d66" />
          <circle cx="24" cy="24" r="3" fill="#ff7a90" /><circle cx="36" cy="24" r="3" fill="#ffb454" /><circle cx="48" cy="24" r="3" fill="#3ddc97" />
          <rect x="26" y="50" width="92" height="8" fill="#3E7BFF" opacity=".9" />
          <rect x="26" y="66" width="120" height="5" fill="#2a3d66" />
          <rect x="26" y="77" width="104" height="5" fill="#2a3d66" />
          <rect x="26" y="96" width="56" height="16" fill="#56D9FF" opacity=".85" />
          <rect x="150" y="46" width="64" height="64" fill="#0d1628" stroke="#3E7BFF" strokeOpacity=".5" />
          <path d="M150 46l64 64M214 46l-64 64" stroke="#3E7BFF" strokeOpacity=".25" />
          <path d="M26 118h120" stroke="#1d2c4d" strokeDasharray="3 5" className="anim-flow" />
        </svg>
      );
    case "app":
      return (
        <svg viewBox="0 0 240 140" className={common} aria-hidden>
          <rect x="14" y="16" width="64" height="44" fill="#0d1628" stroke="#3E7BFF" strokeOpacity=".6" />
          <rect x="88" y="16" width="138" height="20" fill="#0d1628" stroke="#2a3d66" />
          <rect x="88" y="42" width="64" height="18" fill="#1d2c4d" />
          <rect x="162" y="42" width="64" height="18" fill="#1d2c4d" />
          <rect x="14" y="70" width="212" height="52" fill="#0a1120" stroke="#2a3d66" />
          <path d="M22 112V96l14-8 14 10 14-14 14 8 14-6 14 12 14-10 14 6 14-12 14 8 14-4 14 10" fill="none" stroke="#56D9FF" strokeWidth="2" className="anim-flow" strokeDasharray="4 4" />
          <rect x="24" y="24" width="30" height="4" fill="#56D9FF" opacity=".8" />
          <rect x="24" y="34" width="44" height="3" fill="#2a3d66" />
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 240 140" className={common} aria-hidden>
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <path d={`M120 ${22 + i * 26}l78 16-78 16-78-16Z`} fill={i === 1 ? "#12234a" : "#0d1628"} stroke={i === 1 ? "#56D9FF" : "#2a3d66"} strokeWidth={i === 1 ? 1.5 : 1} />
            </g>
          ))}
          <path d="M198 38v62" stroke="#3E7BFF" strokeDasharray="3 5" className="anim-flow" />
          <path d="M42 38v62" stroke="#2a3d66" strokeDasharray="3 5" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 240 140" className={common} aria-hidden>
          <rect x="92" y="8" width="56" height="124" rx="8" fill="#0d1628" stroke="#3E7BFF" strokeOpacity=".7" />
          <rect x="98" y="22" width="44" height="8" fill="#1d2c4d" />
          <rect x="98" y="36" width="44" height="26" fill="#0a1120" stroke="#2a3d66" />
          <rect x="98" y="68" width="20" height="20" fill="#12234a" stroke="#56D9FF" strokeOpacity=".6" />
          <rect x="122" y="68" width="20" height="20" fill="#1d2c4d" />
          <rect x="98" y="94" width="20" height="20" fill="#1d2c4d" />
          <rect x="122" y="94" width="20" height="20" fill="#12234a" stroke="#3E7BFF" strokeOpacity=".6" />
          <circle cx="120" cy="15" r="1.6" fill="#56D9FF" />
          <path d="M20 70h56M164 40h56M164 100h56" stroke="#2a3d66" strokeDasharray="3 5" className="anim-flow" />
          <circle cx="76" cy="70" r="3" fill="#56D9FF" /><circle cx="220" cy="40" r="3" fill="#3E7BFF" /><circle cx="220" cy="100" r="3" fill="#3ddc97" />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 240 140" className={common} aria-hidden>
          <circle cx="120" cy="70" r="22" fill="#12234a" stroke="#56D9FF" />
          <path d="M120 58v24M108 70h24" stroke="#56D9FF" strokeWidth="2" strokeLinecap="round" />
          {[[48, 34], [196, 30], [40, 104], [200, 108], [120, 16]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M120 70L${x} ${y}`} stroke="#2a3d66" strokeDasharray="3 5" className="anim-flow" />
              <circle cx={x} cy={y} r="5" fill="#0d1628" stroke={i % 2 ? "#3E7BFF" : "#56D9FF"} />
            </g>
          ))}
        </svg>
      );
    case "flow":
      return (
        <svg viewBox="0 0 240 140" className={common} aria-hidden>
          <rect x="16" y="20" width="52" height="24" fill="#0d1628" stroke="#2a3d66" />
          <rect x="94" y="58" width="52" height="24" fill="#12234a" stroke="#56D9FF" />
          <rect x="172" y="20" width="52" height="24" fill="#0d1628" stroke="#2a3d66" />
          <rect x="172" y="96" width="52" height="24" fill="#0d1628" stroke="#3ddc97" strokeOpacity=".7" />
          <path d="M68 32c40 0 26 38 26 38M146 70c30 0 26-38 26-38M146 70c30 0 26 38 26 38" fill="none" stroke="#3E7BFF" strokeDasharray="4 5" className="anim-flow" />
          <circle cx="90" cy="46" r="3" fill="#56D9FF" /><circle cx="162" cy="50" r="3" fill="#3E7BFF" /><circle cx="162" cy="90" r="3" fill="#3ddc97" />
        </svg>
      );
  }
}

/* ─────────────────────────── 1. WHAT WE BUILD ─────────────────────────── */

function CapabilityDetail({ cap }: { cap: BuildCapability }) {
  return (
    <div>
      <div className="bg-ink-950/70 hairline clip-corner p-4 overflow-hidden">
        <Glyph kind={cap.glyph} />
      </div>
      <p className="mt-5 text-ink-200 leading-relaxed">{cap.description}</p>
      <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2">
        {cap.deliverables.map((d) => (
          <li key={d} className="flex items-start gap-2 text-[0.86rem] text-ink-200">
            <IconCheck size={13} className="text-signal mt-1 shrink-0" />
            {d}
          </li>
        ))}
      </ul>
      <Link to={cap.page} className="group/link mt-6 inline-flex items-center gap-2 font-display font-semibold text-brand-300 hover:text-cyan-ic transition-colors">
        {cap.pageLabel}
        <IconArrow size={15} className="transition-transform duration-300 group-hover/link:translate-x-1" />
      </Link>
    </div>
  );
}

export function WhatWeBuild() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const cap = whatWeBuild[active];

  useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % whatWeBuild.length), 5500);
    return () => clearInterval(id);
  }, [reduce, paused]);

  return (
    <Section tone="deeper" id="build" className="noise scroll-mt-20">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <SectionHead
          eyebrow="what we build"
          title={<>We design. We build. We integrate. <span className="text-brand-400">We automate.</span></>}
          lead="From customer-facing websites to internal business software and AI-powered operations, ITCYBER engineers complete digital systems around the way your business actually works."
        />

        <div
          className="mt-12 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-8 lg:gap-14"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* index */}
          <div role="tablist" aria-label="Capabilities" aria-orientation="vertical">
            {whatWeBuild.map((c, i) => {
              const on = i === active;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={cn(
                    "group w-full text-left flex items-center gap-4 sm:gap-6 py-4 sm:py-[1.15rem] border-b border-white/[.07] transition-all duration-400",
                    on ? "pl-2 sm:pl-4" : "pl-0 hover:pl-2"
                  )}
                >
                  <span className={cn("font-mono text-[0.7rem] tracking-[0.2em] transition-colors duration-400 shrink-0", on ? "text-cyan-ic" : "text-ink-500 group-hover:text-ink-300")}>/{c.num}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block font-display font-bold tracking-tight text-[clamp(1.05rem,2vw,1.45rem)] transition-colors duration-400", on ? "text-white" : "text-ink-300 group-hover:text-ink-100")}>
                      {c.title}
                    </span>
                    <span className={cn("hidden sm:block text-[0.8rem] mt-0.5 transition-colors duration-400", on ? "text-ink-200" : "text-ink-500")}>{c.line}</span>
                  </span>
                  {/* progress marker */}
                  <span className="relative hidden md:block w-16 h-[2px] bg-ink-700 shrink-0 overflow-hidden" aria-hidden>
                    {on && !reduce && (
                      <span key={`bar-${active}-${paused}`} className="absolute inset-0 bg-gradient-to-r from-brand-500 to-cyan-ic origin-left" style={{ animation: paused ? "none" : "wwb-bar 5.5s linear forwards" }} />
                    )}
                    {on && reduce && <span className="absolute inset-0 bg-cyan-ic" />}
                  </span>
                  <IconChevron size={13} className={cn("md:hidden shrink-0 transition-transform duration-300", on ? "rotate-90 text-cyan-ic" : "text-ink-500")} />
                </button>
              );
            })}
            <style>{`@keyframes wwb-bar { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
          </div>

          {/* detail */}
          <div className="relative">
            {/* mobile: detail sits under the index row; desktop: sticky panel */}
            <div className="lg:sticky lg:top-28 bg-ink-900/80 hairline clip-corner p-[clamp(1.25rem,3vw,2.25rem)] overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-500/[.09] blur-3xl" aria-hidden />
              <div className="flex items-center justify-between gap-4 mb-5">
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-cyan-ic">capability {cap.num} / 06</p>
                <Badge tone="dark">{cap.line}</Badge>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={cap.id}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="font-display font-bold text-white text-[clamp(1.5rem,2.8vw,2.1rem)] tracking-tight">{cap.title}</h3>
                  <div className="mt-4">
                    <CapabilityDetail cap={cap} />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ─────────────────────────── 2. FULL-STACK SYSTEM ─────────────────────────── */

export function FullStackSection() {
  const [layer, setLayer] = useState(0);
  const [mode, setMode] = useState<"traditional" | "ai">("ai");
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setLayer((l) => (l + 1) % architectureLayers.length), 2000);
    return () => clearInterval(id);
  }, [reduce]);

  const steps = mode === "ai" ? traditionalVsAi.ai : traditionalVsAi.traditional;

  return (
    <Section tone="dark" className="noise">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <SectionHead
          eyebrow="one engineering team"
          title={<>The complete digital system, <span className="text-brand-400">engineered as one.</span></>}
          lead="Most vendors sell a slice. ITCYBER builds the whole stack — the interface your customers see, the software your team runs, the AI that works inside it, and the integrations that keep your existing tools in sync."
        />

        <div className="mt-12 grid lg:grid-cols-2 gap-10 items-center">
          {/* architecture layers */}
          <Reveal>
            <ol className="relative space-y-2.5">
              {/* descending pulse line */}
              {!reduce && (
                <span className="absolute left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-ic/50 via-brand-500/30 to-signal/50 -z-0" aria-hidden />
              )}
              {architectureLayers.map((l, i) => {
                const on = i === layer;
                return (
                  <li
                    key={l.id}
                    onMouseEnter={() => setLayer(i)}
                    className={cn(
                      "relative bg-ink-850/80 border clip-corner px-4 sm:px-5 py-3.5 transition-all duration-500 cursor-default",
                      on ? "border-brand-400/60 bg-ink-800 -translate-y-0.5 shadow-[0_16px_44px_-18px_rgba(62,123,255,.45)]" : "border-white/[.07] hover:border-white/[.16]"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] w-28 shrink-0" style={{ color: l.tone }}>
                        L{i + 1} · {l.label}
                      </span>
                      <span className="flex flex-wrap gap-1.5">
                        {l.items.map((it) => (
                          <span key={it} className={cn("font-mono text-[0.64rem] px-2 py-1 clip-corner border transition-colors duration-500", on ? "border-white/[.14] text-ink-100 bg-white/[.04]" : "border-white/[.07] text-ink-300")}>
                            {it}
                          </span>
                        ))}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
            <p className="mt-4 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-ink-400">
              every layer designed together — no seams, no blame games
            </p>
          </Reveal>

          {/* ecosystem 3D / SVG */}
          <Reveal delay={0.15}>
            <div className="relative bg-ink-950/60 hairline clip-corner overflow-hidden">
              <EcosystemVisual />
            </div>
          </Reveal>
        </div>

        {/* traditional vs AI-integrated software */}
        <Reveal delay={0.1}>
          <div className="mt-14 bg-ink-900/80 hairline clip-corner p-[clamp(1.25rem,3vw,2.25rem)] grid lg:grid-cols-[auto_1fr] gap-8 items-start">
            <div>
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-cyan-ic flex items-center gap-2">
                <IconSpark size={13} /> the difference AI makes
              </p>
              <h3 className="font-display font-bold text-white text-[clamp(1.3rem,2.4vw,1.8rem)] tracking-tight mt-2 max-w-xs">
                Software that decides <span className="text-brand-400">with you.</span>
              </h3>
              <div className="mt-5 inline-flex hairline clip-corner p-1 gap-1 bg-ink-950/60" role="tablist" aria-label="Software comparison">
                {(["traditional", "ai"] as const).map((m) => (
                  <button
                    key={m}
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => setMode(m)}
                    className={cn(
                      "font-display font-semibold text-[0.85rem] px-4 h-9 clip-corner transition-all duration-300",
                      mode === m ? (m === "ai" ? "bg-brand-500 text-white" : "bg-ink-700 text-white") : "text-ink-300 hover:text-white"
                    )}
                  >
                    {m === "ai" ? "AI-integrated" : "Traditional"}
                  </button>
                ))}
              </div>
            </div>
            <ol className="relative">
              <AnimatePresence mode="wait">
                <motion.ol
                  key={mode}
                  initial={reduce ? false : { opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduce ? undefined : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-0"
                >
                  {steps.map((s, i) => (
                    <li key={s} className="relative pl-9 pb-4 last:pb-0">
                      {i < steps.length - 1 && (
                        <span className={cn("absolute left-[11px] top-6 bottom-0 w-px", mode === "ai" ? "bg-brand-500/40" : "bg-white/10")} aria-hidden />
                      )}
                      <span
                        className={cn(
                          "absolute left-0 top-0.5 w-[23px] h-[23px] clip-corner border flex items-center justify-center font-mono text-[0.6rem]",
                          mode === "ai" ? "border-signal/60 text-signal bg-signal/[.08]" : "border-ink-500 text-ink-400"
                        )}
                        aria-hidden
                      >
                        {i + 1}
                      </span>
                      <span className={cn("font-display font-semibold text-[1rem]", mode === "ai" ? "text-white" : "text-ink-300")}>{s}</span>
                    </li>
                  ))}
                </motion.ol>
              </AnimatePresence>
            </ol>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─────────────────────────── 3. LIFECYCLE ─────────────────────────── */

export function Lifecycle() {
  return (
    <Section tone="paper">
      <div className="wrap">
        <SectionHead
          tone="paper"
          eyebrow="idea → intelligent system"
          title={<>One team. From idea to <span className="text-brand-600">intelligent system.</span></>}
          lead="Strategy, design, engineering, AI and automation under one roof — so nothing gets lost between vendors and your system ships as a coherent whole."
        />
        <ol className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lifecyclePhases.map((p, pi) => (
            <Reveal key={p.phase} delay={pi * 0.08}>
              <li className="group relative h-full bg-white hairline-light clip-corner p-6 overflow-hidden transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_-24px_rgba(46,99,232,.3)]">
                <span className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-500 to-cyan-ic scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" aria-hidden />
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brand-600">phase {String(pi + 1).padStart(2, "0")}</p>
                <h3 className="font-display font-bold text-ink-900 text-[1.3rem] tracking-tight mt-1.5">{p.phase}</h3>
                <ul className="mt-4 space-y-2">
                  {p.steps.map((s, si) => (
                    <li key={s} className="flex items-center gap-2.5 text-[0.88rem] text-ink-600">
                      <span className="font-mono text-[0.6rem] text-ink-400 w-6 shrink-0">{pi + 1}.{si + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button to="/contact" arrow>Discuss Your Project</Button>
            <Button to="/work" variant="ghost">See How Systems Come Together</Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* ─────────────────────────── 4. SOLUTION ARCHITECTURES ─────────────────────────── */

export function SolutionArchitectures() {
  return (
    <Section tone="deeper" className="noise">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            eyebrow="composed systems"
            title={<>What a complete build <span className="text-brand-400">looks like.</span></>}
            lead="Real combinations of website, software, AI and automation — the way engagements are actually architected."
          />
          <Reveal delay={0.1}>
            <span className="mb-2 inline-block"><Badge tone="dark">solution architectures · illustrative</Badge></span>
          </Reveal>
        </div>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-6 gap-4">
          {solutionArchitectures.map((s, i) => (
            <Reveal key={s.sector} delay={i * 0.06} className={cn(i === 0 ? "lg:col-span-2" : "lg:col-span-1")}>
              <article className={cn("group relative h-full bg-ink-900/80 hairline clip-corner p-5 overflow-hidden transition-all duration-400 hover:bg-ink-850 hover:-translate-y-1", i === 0 && "lg:p-7")}>
                <span className="absolute top-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-700" style={{ background: s.tone }} aria-hidden />
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em]" style={{ color: s.tone }}>{s.sector}</p>
                <h3 className={cn("font-display font-bold text-white tracking-tight mt-1.5", i === 0 ? "text-[1.5rem]" : "text-[1.05rem]")}>
                  {s.components[0]} <span className="text-ink-400 font-medium">+ {s.components.length - 1} systems</span>
                </h3>
                <ul className={cn("mt-4", i === 0 ? "grid sm:grid-cols-2 gap-x-6" : "")}>
                  {s.components.map((c, ci) => (
                    <li key={c} className="relative flex items-center gap-2.5 py-1.5 text-[0.86rem] text-ink-200">
                      {ci > 0 && <span className="font-mono text-[0.7rem] shrink-0" style={{ color: s.tone }}>+</span>}
                      {ci === 0 && <span className="w-[11px] shrink-0" aria-hidden />}
                      {c}
                    </li>
                  ))}
                </ul>
                {i === 0 && (
                  <p className="mt-4 pt-4 border-t border-white/[.08] text-[0.86rem] text-ink-300 leading-relaxed">{s.outcome}</p>
                )}
              </article>
            </Reveal>
          ))}

          {/* CTA tile */}
          <Reveal delay={0.3} className="lg:col-span-1">
            <Link to="/solutions" className="group relative h-full min-h-[10rem] flex flex-col justify-between bg-brand-500 clip-corner p-5 overflow-hidden transition-all duration-400 hover:-translate-y-1 hover:bg-brand-400">
              <span className="absolute -bottom-10 -right-10 w-36 h-36 rounded-full bg-white/[.08] blur-2xl group-hover:bg-white/[.14] transition-colors" aria-hidden />
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-white/80">your sector?</p>
              <div>
                <p className="font-display font-bold text-white text-[1.2rem] tracking-tight leading-snug">See the industry playbooks</p>
                <span className="mt-3 inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/90">
                  8 industries <IconArrow size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
