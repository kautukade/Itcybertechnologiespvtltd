import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Reveal, Scramble } from "../lib/motion";
import { industries as staticIndustries, type Industry } from "../data/content";
import { Button, Section, SectionHead, CtaBand, Accordion, Badge } from "../components/ui";
import { IconArrow, IconArrowUpRight, IconCheck, IconShield } from "../components/icons";
import { site } from "../data/site";
import { useCollection } from "../lib/cms";
import type { IndustryRow } from "../types/db";
import NotFound from "./NotFound";
import { usePageMeta } from "../lib/seo";

type PublicIndustry = Industry & { seoTitle?: string; seoDescription?: string };

/** Live published industries from the CMS, with the bundled data as fallback.
 *  A newly published industry renders at /solutions/<slug> without code changes. */
function useIndustries(): PublicIndustry[] {
  const { data } = useCollection("industries", staticIndustries as unknown as IndustryRow[]);
  return useMemo(
    () =>
      data.map((r) => {
        if (!("hero_description" in r)) return r as unknown as Industry;
        const row = r as IndustryRow;
        return {
          slug: row.slug,
          name: row.name,
          short: row.short_description ?? "",
          challenges: (row.challenges_json as string[]) ?? [],
          opportunities: (row.opportunities_json as string[]) ?? [],
          automations: (row.automations_json as string[]) ?? [],
          workflow: (row.workflow_json as string[]) ?? [],
          integrations: (row.integrations_json as string[]) ?? [],
          agents: (row.agents_json as string[]) ?? [],
          faq: (row.faq_json as { q: string; a: string }[]) ?? [],
          seoTitle: row.seo_title ?? undefined,
          seoDescription: row.seo_description ?? undefined,
        };
      }),
    [data]
  );
}

/* ------------------------------ industry detail ------------------------------ */

export function IndustryPage() {
  const { slug } = useParams();
  const industries = useIndustries();
  const ind = industries.find((i) => i.slug === slug);
  const pagePath = `/solutions/${slug ?? ""}`;
  usePageMeta({
    title: ind?.seoTitle ?? (ind ? `${ind.name} — AI & Automation Solutions | ITCYBER` : "Industry Solution Not Found | ITCYBER"),
    description: ind?.seoDescription ?? ind?.short ?? "Industry-specific AI and automation playbook from ITCYBER.",
    path: pagePath,
    robots: ind ? undefined : "noindex, nofollow",
  });
  /* Unknown slug → real 404, never a silent redirect to the index. */
  if (!ind) return <NotFound />;
  const idx = industries.indexOf(ind);

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 75% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <nav aria-label="Breadcrumb" className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-400 flex items-center gap-2">
              <Link to="/" className="hover:text-white transition-colors">Home</Link> /
              <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link> /
              <span className="text-cyan-ic">{ind.name}</span>
            </nav>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2rem,4.6vw,3.6rem)] leading-[1.05] max-w-3xl">
            AI & automation for <span className="text-brand-400">{ind.name}.</span>
          </h1>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">{ind.short}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button to="/contact" arrow>Discuss Your Workflow</Button>
              <Button to="/contact?mode=assessment" variant="ghost">Get an Automation Assessment</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-6">
          <Reveal>
            <div className="h-full bg-white hairline-light clip-corner p-6">
              <p className="font-mono text-[0.64rem] uppercase tracking-[0.2em] text-rose-ic">where it hurts</p>
              <h2 className="font-display font-bold text-ink-900 text-[1.4rem] tracking-tight mt-2">Challenges we hear every week</h2>
              <ul className="mt-5 space-y-3">
                {ind.challenges.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-[0.92rem] text-ink-600 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 shrink-0 bg-rose-ic rounded-full" aria-hidden />{c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="h-full bg-ink-900 hairline clip-corner p-6 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
              <p className="relative font-mono text-[0.64rem] uppercase tracking-[0.2em] text-signal">the opening</p>
              <h2 className="relative font-display font-bold text-white text-[1.4rem] tracking-tight mt-2">Where AI creates leverage</h2>
              <ul className="relative mt-5 space-y-3">
                {ind.opportunities.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-[0.92rem] text-ink-100 leading-relaxed">
                    <IconCheck size={15} className="text-signal mt-0.5 shrink-0" />{o}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* workflow */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <SectionHead eyebrow="example workflow" title={<>What the system <span className="text-brand-400">runs.</span></>} lead="A typical first deployment for this industry — live in weeks, measured from day one." />
          <Reveal delay={0.1}>
            <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ind.workflow.map((w, i) => (
                <li key={w} className="relative bg-ink-850/80 hairline clip-corner p-5 group hover:bg-ink-800 transition-colors duration-300">
                  <span className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-500 to-cyan-ic group-hover:w-full transition-all duration-500" aria-hidden />
                  <p className="font-mono text-[0.62rem] text-cyan-ic">{String(i + 1).padStart(2, "0")}</p>
                  <p className="font-display font-semibold text-white text-[1.02rem] mt-1">{w}</p>
                  {i < ind.workflow.length - 1 && <IconArrow size={14} className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-brand-400 z-10" />}
                </li>
              ))}
            </ol>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            <Reveal>
              <div className="h-full">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-3">recommended automations</p>
                <ul className="space-y-2">
                  {ind.automations.map((a) => (
                    <li key={a} className="flex items-center gap-2.5 text-[0.88rem] text-ink-100 bg-ink-850/70 hairline clip-corner px-3.5 py-2.5">
                      <IconCheck size={13} className="text-signal shrink-0" />{a}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-3">integrations we wire</p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.integrations.map((i) => (
                    <span key={i} className="font-mono text-[0.7rem] px-2.5 py-1.5 hairline text-ink-200 bg-ink-850">{i}</span>
                  ))}
                </div>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mt-6 mb-3">agents that fit</p>
                <div className="flex flex-wrap gap-1.5">
                  {ind.agents.map((a) => (
                    <Badge key={a} tone="dark">{a}</Badge>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="h-full bg-ink-850/70 hairline clip-corner p-5">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic mb-3">engagement note</p>
                <p className="text-[0.9rem] text-ink-200 leading-relaxed">
                  Every {ind.name.toLowerCase()} deployment starts with your actual tools and data — nothing is assumed.
                  Verified result metrics for engagements in this sector are added here once clients approve publication.
                </p>
                <p className="mt-4 flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-signal">
                  <IconShield size={13} /> scoped access · audit logs · human escalation
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <SectionHead tone="paper" eyebrow="quick answers" title={<>Questions {ind.name} teams <span className="text-brand-600">ask us.</span></>} />
          <Reveal delay={0.1}>
            <Accordion items={ind.faq} tone="paper" />
          </Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title={`Running a ${ind.name.toLowerCase()} business with manual bottlenecks?`}
              text="Book a free consultation — we'll map one workflow worth automating in the first call and show you the exact systems involved."
              primaryLabel={site.cta.consultationLong}
              primaryTo="/contact"
              secondaryLabel="WhatsApp ITCYBER"
              secondaryTo="/contact"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-6 flex items-center justify-between gap-4 text-[0.86rem]">
              {idx > 0 ? (
                <Link to={`/solutions/${industries[idx - 1].slug}`} className="group inline-flex items-center gap-2 text-ink-300 hover:text-white transition-colors">
                  <IconArrow size={14} className="rotate-180 group-hover:-translate-x-1 transition-transform" /> {industries[idx - 1].name}
                </Link>
              ) : <span />}
              {idx < industries.length - 1 && (
                <Link to={`/solutions/${industries[idx + 1].slug}`} className="group inline-flex items-center gap-2 text-ink-300 hover:text-white transition-colors">
                  {industries[idx + 1].name} <IconArrow size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

/* ------------------------------- solutions index ------------------------------ */

export default function SolutionsIndex() {
  const industries = useIndustries();
  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 70% 0%, rgba(86,217,255,.1), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="SOLUTIONS // INDUSTRY PLAYBOOKS" />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
            Does ITCYBER understand <span className="text-brand-400">your business?</span>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              Eight industry playbooks — the challenges we hear, the automations that pay for themselves first,
              and the exact workflow shape we'd deploy for you.
            </p>
          </Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.slug} delay={i * 0.04}>
              <Link
                to={`/solutions/${ind.slug}`}
                className="group relative flex flex-col h-full bg-white hairline-light clip-corner p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_60px_-26px_rgba(20,32,58,.4)] overflow-hidden"
              >
                <span className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-500 to-cyan-ic group-hover:w-full transition-all duration-500" aria-hidden />
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand-600">{String(i + 1).padStart(2, "0")} · playbook</p>
                <h2 className="font-display font-bold text-ink-900 text-[1.3rem] tracking-tight mt-2 group-hover:text-brand-600 transition-colors">{ind.name}</h2>
                <p className="text-[0.85rem] text-ink-500 mt-2 leading-relaxed flex-1">{ind.short}</p>
                <div className="mt-4 flex flex-wrap gap-1">
                  {ind.automations.slice(0, 2).map((a) => (
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
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Your industry isn't on the list?"
              text="Good — the playbooks are patterns, not limits. Describe your operation and we'll draft the workflow live on the call."
              primaryLabel="Discuss Your Workflow"
              primaryTo="/contact"
              secondaryLabel="See Business Functions"
              secondaryTo="/#solutions"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
