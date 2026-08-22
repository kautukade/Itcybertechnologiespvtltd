import { Link, useParams } from "react-router-dom";
import { Reveal, Scramble } from "../lib/motion";
import { Button, Section, SectionHead, Badge } from "../components/ui";
import { IconArrow, IconArrowUpRight } from "../components/icons";
import { resources as staticResources } from "../data/content";
import { useCollection } from "../lib/cms";
import { usePageMeta } from "../lib/seo";
import type { ResourceRow } from "../types/db";
import NotFound from "./NotFound";

export default function Resources() {
  const { slug } = useParams();
  const { data: liveRows, source, loading } = useCollection("resources", [] as ResourceRow[]);
  const current = slug && source === "live" ? liveRows.find((row) => row.slug === slug) : undefined;

  usePageMeta({
    title: current ? `${current.title} | ITCYBER Resources` : "Resources — AI, Automation & Software Field Notes | ITCYBER",
    description: current?.summary ?? "Practical ITCYBER field notes on AI agents, automation, custom software, websites and business systems.",
    path: slug ? `/resources/${slug}` : "/resources",
  });

  if (loading) {
    return (
      <Section tone="dark" className="min-h-[60vh]">
        <div className="wrap py-16">
          <div className="h-8 w-72 bg-white/[.08] animate-pulse" />
          <div className="mt-6 h-40 bg-white/[.05] hairline animate-pulse" />
        </div>
      </Section>
    );
  }

  if (slug) {
    if (!current) return <NotFound />;
    const paragraphs = (current.body ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

    return (
      <>
        <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
          <div className="absolute inset-0 grid-bg" aria-hidden />
          <div className="relative wrap py-[clamp(3rem,7vw,6rem)] max-w-4xl">
            <Reveal><Badge tone="dark">{current.kind}</Badge></Reveal>
            <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">{current.title}</h1>
            {current.summary && <p className="mt-5 max-w-2xl text-ink-200 text-[1.05rem] leading-relaxed">{current.summary}</p>}
          </div>
        </section>

        <Section tone="paper">
          <article className="wrap max-w-3xl">
            {paragraphs.length ? paragraphs.map((paragraph, index) => (
              <p key={`${current.id}-${index}`} className="text-ink-700 leading-8 text-[1rem] mb-6 whitespace-pre-wrap">{paragraph}</p>
            )) : <p className="text-ink-500">This resource is being prepared for publication.</p>}
            <div className="mt-10 pt-6 border-t border-ink-900/[.1] flex flex-wrap gap-3">
              <Button to="/resources" variant="light">All Resources</Button>
              <Button to="/contact" arrow>Discuss Your Project</Button>
            </div>
          </article>
        </Section>
      </>
    );
  }

  const cards = source === "live"
    ? liveRows.map((row) => ({ id: row.id, title: row.title, kind: row.kind, summary: row.summary ?? "", to: `/resources/${row.slug}`, meta: "Field note" }))
    : staticResources.map((row, index) => ({ id: `static-${index}`, title: row.title, kind: row.kind, summary: row.blurb, to: row.to, meta: row.minutes }));

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal><p className="eyebrow text-cyan-ic"><Scramble text="RESOURCES // PRACTICAL FIELD NOTES" /></p></Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">Practical reading. <span className="text-brand-400">Zero fluff.</span></h1>
          <p className="mt-5 max-w-2xl text-ink-200 leading-relaxed">Playbooks, field notes and implementation guidance from the systems we design and operate.</p>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap">
          <SectionHead tone="paper" eyebrow="library" title={<>Build with better <span className="text-brand-600">context.</span></>} />
          {cards.length ? (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cards.map((card, index) => (
                <Reveal key={card.id} delay={index * 0.04}>
                  <Link to={card.to} className="group block h-full bg-white hairline-light clip-corner p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-22px_rgba(20,32,58,.35)]">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-brand-600 flex items-center justify-between gap-3"><span>{card.kind}</span><span className="text-ink-400">{card.meta}</span></p>
                    <h2 className="font-display font-bold text-ink-900 text-[1.1rem] mt-3 group-hover:text-brand-600 transition-colors">{card.title}</h2>
                    <p className="text-[0.86rem] text-ink-500 mt-2 leading-relaxed">{card.summary}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-brand-600">Read <IconArrow size={12} /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 bg-white hairline-light clip-corner p-8 text-center">
              <p className="text-ink-600">No resources are currently published.</p>
              <Button to="/contact" variant="light" className="mt-5" arrow>Ask an Engineer</Button>
            </div>
          )}
          <div className="mt-10 flex justify-end"><Link to="/contact" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brand-600 inline-flex items-center gap-1.5">Need a specific playbook? <IconArrowUpRight size={13} /></Link></div>
        </div>
      </Section>
    </>
  );
}
