import { Reveal, Scramble } from "../lib/motion";
import { agents } from "../data/content";
import { Button, Section, SectionHead, CtaBand, Badge } from "../components/ui";
import { IconArrow, IconCheck, IconClose, IconSpark, IconShield } from "../components/icons";
import { site } from "../data/site";
import AgentMicroDemo from "../components/sections/AgentMicroDemo";

const comparison = [
  { aspect: "Scope", bot: "Answers scripted questions", agent: "Completes multi-step tasks across systems" },
  { aspect: "Memory", bot: "Forgets between sessions", agent: "Knows the lead, the history and the stage" },
  { aspect: "Systems", bot: "Lives in one chat window", agent: "Reads and writes CRM, calendar, WhatsApp, ERP" },
  { aspect: "Decisions", bot: "If/else branches", agent: "Reasons with your business rules as context" },
  { aspect: "Failure", bot: "Silently loops or dies", agent: "Escalates to a human with full context" },
  { aspect: "Value", bot: "Deflects conversations", agent: "Produces pipeline, bookings and resolved tickets" },
];

export default function Agents() {
  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 70% 0%, rgba(86,217,255,.1), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)] grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-cyan-ic flex items-center gap-3">
                <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
                <Scramble text="AI AGENTS // AUTONOMOUS WITH BOUNDARIES" />
              </p>
            </Reveal>
            <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
              AI agents built around <span className="relative inline-block">your business<span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-gradient-to-r from-brand-500 to-cyan-ic" aria-hidden /></span>.
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
                A chatbot answers. An agent <strong className="text-white font-semibold">works</strong> — qualifying leads, resolving tickets,
                booking appointments and updating your systems, with human escalation built into its DNA.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/contact" arrow>Build a Custom Agent</Button>
                <Button href={site.contact.phoneHref} variant="ghost">Talk to an AI Engineer</Button>
              </div>
            </Reveal>
          </div>

          {/* chatbot vs agent terminal */}
          <Reveal delay={0.25}>
            <div className="relative bg-ink-900 hairline clip-corner overflow-hidden">
              <div className="px-4 h-10 flex items-center justify-between border-b border-white/[.07] bg-ink-850">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ink-400">the difference</span>
                <span className="flex gap-1.5" aria-hidden><span className="w-2 h-2 rounded-full bg-rose-ic/70" /><span className="w-2 h-2 rounded-full bg-amber-ic/70" /><span className="w-2 h-2 rounded-full bg-signal/70" /></span>
              </div>
              <div className="p-4 space-y-2.5 font-mono text-[0.7rem]">
                <p className="text-ink-400">// basic chatbot</p>
                <p className="text-ink-300">&gt; customer: can I get a demo on Friday?</p>
                <p className="text-rose-ic/90">bot: Please contact our sales team at sales@…</p>
                <p className="text-ink-500">→ lead lost, 0 systems updated</p>
                <div className="h-px bg-white/[.08] my-3" aria-hidden />
                <p className="text-cyan-ic">// ITCYBER AI agent</p>
                <p className="text-ink-300">&gt; customer: can I get a demo on Friday?</p>
                <p className="text-signal">agent: Friday 11:00 or 15:30 with our solutions lead?</p>
                <p className="text-signal">agent: ✓ booked 15:30 · CRM updated · reminder set</p>
                <p className="text-ink-500">→ meeting created, 3 systems updated, 0 humans needed</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* comparison table */}
      <Section tone="paper">
        <div className="wrap">
          <SectionHead tone="paper" eyebrow="chatbot vs agent" title={<>Stop buying scripts. <span className="text-brand-600">Deploy workers.</span></>} />
          <Reveal delay={0.1}>
            <div className="mt-10 overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[40rem] border-collapse">
                <thead>
                  <tr className="text-left">
                    <th className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-400 py-3 pr-4 font-medium w-32">Aspect</th>
                    <th className="py-3 px-4 font-display font-bold text-ink-400 text-[1rem]">Basic chatbot</th>
                    <th className="py-3 px-4 font-display font-bold text-brand-600 text-[1rem]">ITCYBER AI agent</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={row.aspect} className="border-t border-ink-900/[.08] group">
                      <td className="py-4 pr-4 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-500">{row.aspect}</td>
                      <td className="py-4 px-4 text-[0.9rem] text-ink-500">
                        <span className="inline-flex items-start gap-2"><IconClose size={14} className="text-rose-ic mt-0.5 shrink-0" />{row.bot}</span>
                      </td>
                      <td className="py-4 px-4 text-[0.9rem] text-ink-800 bg-brand-500/[.05] group-hover:bg-brand-500/[.08] transition-colors">
                        <span className="inline-flex items-start gap-2"><IconCheck size={14} className="text-brand-600 mt-0.5 shrink-0" />{row.agent}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* agent roster */}
      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <SectionHead
            eyebrow="the roster"
            title={<>Six agents, one <span className="text-brand-400">workforce.</span></>}
            lead="Every agent ships with the same anatomy: defined inputs, visible reasoning, scoped system access, human handoff and a security boundary it cannot cross."
          />
          <div className="mt-12 grid md:grid-cols-2 gap-5">
            {agents.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.05}>
                <article className="group relative h-full bg-ink-900/80 hairline clip-corner p-6 overflow-hidden transition-all duration-500 hover:bg-ink-850 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(62,123,255,.4)]">
                  <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-brand-500/[.08] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" aria-hidden />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Badge tone="dark">{a.role}</Badge>
                      <h3 className="font-display font-bold text-white text-[1.35rem] tracking-tight mt-2.5 group-hover:text-cyan-ic transition-colors">{a.name}</h3>
                    </div>
                    <IconSpark size={20} className="text-brand-400 shrink-0 mt-1 group-hover:text-cyan-ic transition-colors" />
                  </div>
                  <p className="text-ink-200 text-[0.9rem] mt-2.5 leading-relaxed">{a.description}</p>

                  <div className="mt-4 bg-ink-950/60 hairline clip-corner p-4 min-h-[6.5rem]">
                    <AgentMicroDemo demo={a.demo} />
                  </div>

                  <dl className="mt-4 grid grid-cols-1 gap-2 text-[0.8rem]">
                    {[
                      ["Inputs", a.inputs],
                      ["Reasoning & action", a.actions],
                      ["Systems accessed", a.systems],
                      ["Outputs", a.outputs],
                      ["Human handoff", a.handoff],
                    ].map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-2 py-1.5 border-b border-white/[.05] last:border-0">
                        <dt className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-cyan-ic pt-0.5">{k}</dt>
                        <dd className="text-ink-200 leading-snug">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 flex items-center gap-2 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-signal">
                    <IconShield size={13} /> permission boundaries enforced per action
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* anatomy */}
      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHead
              tone="paper"
              eyebrow="agent anatomy"
              title={<>Trust comes from <span className="text-brand-600">visibility.</span></>}
              lead="You can watch every agent think. Each decision is logged with its inputs, the rule or model step used, the systems touched and the result — exportable, auditable, yours."
            />
            <Reveal delay={0.2}>
              <ul className="mt-8 space-y-3">
                {[
                  "Every conversation and action stored against the customer record",
                  "Confidence thresholds — below them, a human takes over automatically",
                  "Hard-coded boundaries: agents can't touch what you haven't allowed",
                  "Kill switch per agent — pause any worker without touching the rest",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-ink-700">
                    <span className="w-5 h-5 mt-0.5 shrink-0 clip-corner bg-brand-500 text-white flex items-center justify-center"><IconCheck size={11} /></span>
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="relative bg-ink-900 hairline clip-corner p-5 overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
              <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ink-400 mb-4">agent decision log · entry 14,208</p>
              <div className="relative space-y-2 font-mono text-[0.72rem]">
                <p className="text-ink-300">input: WhatsApp message from +91 ••• 2214</p>
                <p className="text-brand-300">intent: reschedule appointment · confidence 0.96</p>
                <p className="text-ink-300">rules checked: booking policy v3 · agent scope: calendar.write</p>
                <p className="text-cyan-ic">action: proposed 3 slots from Dr. Mehta's calendar</p>
                <p className="text-signal">result: rescheduled to Fri 17:15 · HMS updated · confirmed</p>
                <p className="text-ink-500">latency 1.9s · human approval required: no · logged ✓</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Have a process that follows a logic? It can be an agent."
              text="Describe the workflow in plain language — we'll reply with whether an agent fits, what it would access, and what it would cost to run."
              primaryLabel="Design My Agent"
              primaryTo="/contact"
              secondaryLabel="See Live Workflows"
              secondaryTo="/#demo"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
