import { Reveal, Scramble, MaskLines } from "../lib/motion";
import { processSteps } from "../data/content";
import { Button, Section, SectionHead, CtaBand, IconTile } from "../components/ui";
import { IconArrow, IconCheck, IconCompass, IconBlueprint, IconRoute, IconLayers } from "../components/icons";
import { site } from "../data/site";

const beliefs = [
  {
    t: "Automation is a design problem",
    d: "Most 'automation projects' fail before a single tool is chosen — because nobody mapped the workflow. We design first, then build.",
  },
  {
    t: "AI earns trust in small loops",
    d: "We don't ask teams to believe in AI. We run it beside their process, show the logs, and let the evidence convert them.",
  },
  {
    t: "The best system is the one that gets used",
    d: "Adoption beats elegance. If the sales team won't open the dashboard, the dashboard is unfinished — no matter how good it looks.",
  },
  {
    t: "Speed is a feature of trust",
    d: "A working slice in two weeks tells a client more than a sixty-page proposal. We ship early and iterate in the open.",
  },
];

export default function About() {
  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 75% 10%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="COMPANY // PRACTICAL AI, SERIOUS ENGINEERING" />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.2rem,5.4vw,4.2rem)] leading-[1.04] max-w-4xl">
            <MaskLines lines={[<>Building practical AI systems</>, <>for <span className="text-brand-400">real businesses.</span></>]} />
          </h1>
          <Reveal delay={0.25}>
            <p className="mt-6 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              ITCYBER Technologies Pvt Ltd exists because most Indian businesses don't need another dashboard demo —
              they need the enquiry answered at midnight, the invoice raised without asking, the report waiting at 8 AM.
              We build the systems that make that ordinary.
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[.07] hairline clip-corner overflow-hidden max-w-3xl">
              {[
                ["Founded", "In India, for India first"],
                ["Focus", "AI agents + automation + software"],
                ["Style", "Business-first engineering"],
                ["Promise", "Systems you own outright"],
              ].map(([k, v]) => (
                <div key={k} className="bg-ink-900 p-4">
                  <dt className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-cyan-ic">{k}</dt>
                  <dd className="font-display font-semibold text-white text-[0.95rem] mt-1.5 leading-snug">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* story + beliefs */}
      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-[1.1fr_1fr] gap-14">
          <div>
            <SectionHead
              tone="paper"
              eyebrow="the story"
              title={<>We kept watching the same <span className="text-brand-600">expensive routine.</span></>}
            />
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-ink-600 leading-relaxed">
                <p>
                  Talented teams buried in copy-paste. Leads going cold in spreadsheets. Founders personally chasing
                  follow-ups at 11 PM. The tools existed — CRMs, WhatsApp, cloud — but nobody had wired them together
                  with intelligence in the middle.
                </p>
                <p>
                  So we built a company that does exactly that wiring: engineers who speak both LLM and ledger.
                  We start from your workflow, not our product catalogue. Sometimes the answer is an agent, sometimes a
                  fifteen-line webhook, sometimes honest advice that you don't need us yet.
                </p>
                <p>
                  That last one is why clients stay. The systems we ship are designed to be owned — documented, monitored
                  and handed over — because a vendor lock-in is a failure of engineering, not a business model.
                </p>
              </div>
            </Reveal>
          </div>
          <div>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-brand-600">what we believe</p>
            <div className="mt-5 space-y-3">
              {beliefs.map((b, i) => (
                <Reveal key={b.t} delay={i * 0.06}>
                  <div className="group bg-white hairline-light clip-corner p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(20,32,58,.3)]">
                    <p className="flex items-center gap-3 font-display font-bold text-ink-900 text-[1.02rem]">
                      <span className="font-mono text-[0.62rem] text-brand-600 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      {b.t}
                    </p>
                    <p className="text-[0.86rem] text-ink-500 mt-2 leading-relaxed">{b.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* mission / vision / philosophy */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap grid md:grid-cols-3 gap-4">
          {[
            { icon: <IconCompass size={20} />, k: "mission", t: "Make world-class automation ordinary", d: "Give every serious Indian business — not just the funded ones — the operational leverage that AI makes possible." },
            { icon: <IconBlueprint size={20} />, k: "vision", t: "Businesses that run themselves", d: "A company where repetitive work is infrastructure: invisible, reliable, monitored — and humans spend their day on judgement." },
            { icon: <IconRoute size={20} />, k: "engineering philosophy", t: "Boring reliability, exciting outcomes", d: "Proven stacks, typed code, logged actions, small deploys. The surprise should be in the results, never in the outage." },
          ].map((m, i) => (
            <Reveal key={m.k} delay={i * 0.07}>
              <div className="h-full bg-ink-900/80 hairline clip-corner p-6 group hover:bg-ink-850 transition-colors duration-300">
                <IconTile>{m.icon}</IconTile>
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan-ic mt-4">{m.k}</p>
                <h2 className="font-display font-bold text-white text-[1.25rem] tracking-tight mt-1.5">{m.t}</h2>
                <p className="text-[0.88rem] text-ink-300 mt-2.5 leading-relaxed">{m.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* delivery methodology */}
      <Section tone="paper" id="process" className="scroll-mt-20">
        <div className="wrap">
          <SectionHead
            tone="paper"
            eyebrow="how we approach automation"
            title={<>A method, not a <span className="text-brand-600">mood.</span></>}
            lead="The same five moves on every engagement — from a single WhatsApp flow to a full AI operations layer."
          />
          <div className="mt-10 grid md:grid-cols-5 gap-3">
            {processSteps.map((p, i) => (
              <Reveal key={p.index} delay={i * 0.06}>
                <div className="relative h-full bg-white hairline-light clip-corner p-5 group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_18px_44px_-22px_rgba(20,32,58,.35)]">
                  <p className="font-display font-bold text-brand-600 text-[1.6rem] leading-none">{p.index}</p>
                  <h3 className="font-display font-bold text-ink-900 text-[1.05rem] mt-2">{p.title}</h3>
                  <p className="text-[0.8rem] text-ink-500 mt-1.5 leading-relaxed">{p.text}</p>
                  <p className="mt-3 pt-3 border-t border-ink-900/[.08] font-mono text-[0.6rem] uppercase tracking-[0.1em] text-brand-600">{p.deliverable}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* team / culture */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHead
              eyebrow="team & culture"
              title={<>Small team, <span className="text-brand-400">deep bench.</span></>}
              lead="Automation architects, full-stack engineers and AI specialists who've shipped systems businesses depend on daily. Leadership profiles join this page as the team grows — we don't stock it with stock faces."
            />
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/careers" arrow>See Open Roles</Button>
                <Button href={`mailto:${site.contact.email}`} variant="ghost">Say Hello</Button>
              </div>
            </Reveal>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Builders first", "Everyone ships — including the people who talk to clients."],
              ["Client context", "Engineers sit in on discovery calls. Context makes better systems."],
              ["Written culture", "Decisions, architectures and reviews live in documents, not hallways."],
              ["Honest scoping", "We've talked clients out of projects they didn't need. It's a feature."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="h-full bg-ink-900/80 hairline clip-corner p-5 hover:bg-ink-850 transition-colors duration-300">
                  <p className="flex items-center gap-2 font-display font-semibold text-white text-[0.98rem]">
                    <IconCheck size={14} className="text-signal shrink-0" />{t}
                  </p>
                  <p className="text-[0.8rem] text-ink-300 mt-2 leading-relaxed">{d}</p>
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
              title="Long-term, we want to be boring to rely on."
              text="The systems should hum quietly in the background while your business compounds. Start the conversation — we'll bring the workflow map."
              primaryLabel={site.cta.consultationLong}
              primaryTo="/contact"
              secondaryLabel="Meet the Work"
              secondaryTo="/work"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
