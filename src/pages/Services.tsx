import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Reveal, Scramble } from "../lib/motion";
import { cn } from "../lib/utils";
import { serviceCategories, automationExample } from "../data/content";
import { Button, Section, SectionHead, CtaBand, IconTile } from "../components/ui";
import { IconArrow, IconCheck, IconAgent, IconFlow, IconPlug, IconCode, IconArrowUpRight } from "../components/icons";
import { site } from "../data/site";

const icons: Record<string, React.ReactNode> = {
  "ai-agents": <IconAgent size={22} />,
  automation: <IconFlow size={22} />,
  integrations: <IconPlug size={22} />,
  software: <IconCode size={22} />,
};

export default function Services() {
  const { hash } = useLocation();
  const [activeCat, setActiveCat] = useState(serviceCategories[0].id);

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      if (serviceCategories.some((c) => c.id === id)) setActiveCat(id);
    }
  }, [hash]);

  const scrollTo = (id: string) => {
    setActiveCat(id);
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      {/* hero */}
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 75% 10%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)]">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="SERVICES // FULL-STACK INTELLIGENCE" />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
            Four disciplines. One operating system for your business.
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              Agents think, automations move, integrations connect and custom software gives your team control.
              Buy one discipline or the whole system — every piece is built to work with the others.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-2">
              {serviceCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => scrollTo(c.id)}
                  className={cn(
                    "font-mono text-[0.7rem] uppercase tracking-[0.14em] px-4 h-10 inline-flex items-center gap-2 clip-corner transition-all duration-300",
                    activeCat === c.id ? "bg-brand-500 text-white" : "hairline text-ink-200 hover:text-white hover:bg-white/[.05]"
                  )}
                >
                  <span className="text-cyan-ic">{c.index}</span> {c.title}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* category sections */}
      {serviceCategories.map((cat, ci) => (
        <Section key={cat.id} tone={ci % 2 === 0 ? "dark" : "deeper"} id={`cat-${cat.id}`} className="scroll-mt-24 noise">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative wrap">
            <div className="grid lg:grid-cols-[1fr_1.6fr] gap-10">
              <div className="lg:sticky lg:top-28 self-start">
                <Reveal>
                  <IconTile>{icons[cat.id]}</IconTile>
                  <p className="font-mono text-[0.66rem] tracking-[0.24em] text-ink-400 mt-4">/{cat.index}</p>
                  <h2 className="font-display font-bold text-white text-[clamp(1.7rem,3.4vw,2.6rem)] tracking-tight mt-1">{cat.title}</h2>
                  <p className="text-cyan-ic font-mono text-[0.72rem] uppercase tracking-[0.14em] mt-2">{cat.tagline}</p>
                  <p className="text-ink-200 mt-4 leading-relaxed">{cat.description}</p>

                  <div className="mt-6 bg-ink-950/60 hairline clip-corner p-4">
                    <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-400 mb-3">example flow</p>
                    <ol className="flex flex-wrap items-center gap-1.5">
                      {cat.exampleFlow.map((s, i) => (
                        <li key={s} className="flex items-center gap-1.5">
                          <span className="font-mono text-[0.66rem] px-2 py-1 hairline text-ink-100">{s}</span>
                          {i < cat.exampleFlow.length - 1 && <IconArrow size={11} className="text-brand-400" />}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-ink-400 mt-6 mb-2">works with</p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.integrations.map((i) => (
                      <span key={i} className="font-mono text-[0.66rem] px-2 py-1 bg-ink-850 hairline text-ink-200">{i}</span>
                    ))}
                  </div>

                  <Button to="/contact" className="mt-8" arrow>Discuss {cat.title}</Button>
                </Reveal>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 self-start">
                {cat.items.map((it, i) => (
                  <Reveal key={it.name} delay={i * 0.04}>
                    <Link
                      to="/contact"
                      className="group relative block h-full bg-ink-850/80 hairline clip-corner p-5 transition-all duration-400 hover:-translate-y-1 hover:bg-ink-800 hover:shadow-[0_18px_50px_-20px_rgba(62,123,255,.35)]"
                    >
                      <span className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-500 to-cyan-ic group-hover:w-full transition-all duration-500" aria-hidden />
                      <p className="font-mono text-[0.6rem] text-ink-400">{cat.id}·{String(i + 1).padStart(2, "0")}</p>
                      <h3 className="font-display font-semibold text-white text-[1.02rem] mt-1.5 group-hover:text-cyan-ic transition-colors">{it.name}</h3>
                      <p className="text-[0.82rem] text-ink-300 mt-1.5 leading-relaxed">{it.blurb}</p>
                      <IconArrowUpRight size={14} className="absolute top-4 right-4 text-ink-500 group-hover:text-cyan-ic transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>

            {/* related */}
            <Reveal delay={0.1}>
              <div className="mt-10 pt-6 border-t border-white/[.07] flex flex-wrap items-center gap-3">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">pairs well with:</span>
                {serviceCategories.filter((c) => c.id !== cat.id).map((c) => (
                  <button key={c.id} onClick={() => scrollTo(c.id)} className="font-mono text-[0.66rem] px-3 py-1.5 hairline text-ink-200 hover:text-cyan-ic hover:bg-white/[.04] transition-colors clip-corner">
                    {c.title}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>
        </Section>
      ))}

      {/* how a project runs across services */}
      <Section tone="paper">
        <div className="wrap">
          <SectionHead
            tone="paper"
            eyebrow="one engagement"
            title={<>A typical system touches all four <span className="text-brand-600">disciplines.</span></>}
            lead="Here's the shape of a real deployment — from the first enquiry to the dashboard your managers open every morning."
          />
          <Reveal delay={0.1}>
            <div className="mt-10 bg-white hairline-light clip-corner p-6 overflow-x-auto no-scrollbar">
              <ol className="flex items-center gap-2 w-max">
                {automationExample.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className={cn("font-mono text-[0.72rem] px-3 py-2 clip-corner whitespace-nowrap", i % 3 === 1 ? "bg-brand-500/[.1] text-brand-600 border border-brand-500/30" : "bg-paper text-ink-700 hairline-light")}>
                      {s}
                    </span>
                    {i < automationExample.length - 1 && <IconArrow size={13} className="text-brand-500 shrink-0" />}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { k: "Business problems solved", v: "Slow lead response, leaky follow-up, stale reporting, double data entry, scheduling friction." },
                { k: "What you receive", v: "A documented architecture, working systems, training for your team and a monitoring dashboard." },
                { k: "Typical first milestone", v: "One high-volume workflow live — most teams see it running within the first few weeks." },
                { k: "After go-live", v: "Monthly optimization reviews, prompt tuning, new workflows and priority engineer support." },
              ].map((b) => (
                <li key={b.k} className="bg-white hairline-light clip-corner p-5">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-600">{b.k}</p>
                  <p className="text-[0.86rem] text-ink-600 mt-2 leading-relaxed">{b.v}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Not sure which service fits?"
              text="Run the 2-minute automation assessment — we'll tell you honestly whether you need an agent, an automation, software, or nothing yet."
              primaryLabel={site.cta.assessment}
              primaryTo="/contact?mode=assessment"
              secondaryLabel="Talk to an AI Engineer"
              secondaryTo="/contact"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
