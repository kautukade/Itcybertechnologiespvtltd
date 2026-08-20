import { Reveal, Scramble } from "../lib/motion";
import { serviceCategories } from "../data/content";
import { Button, Section, SectionHead, CtaBand, IconTile } from "../components/ui";
import { IconCode, IconCheck, IconArrowUpRight } from "../components/icons";
import OpsDashboard from "../components/workflows/OpsDashboard";

const software = serviceCategories.find((c) => c.id === "software")!;

const engagements = [
  {
    title: "Internal Business Tools",
    desc: "Replace the spreadsheet that runs your operations with proper tooling: approval queues, task flows, internal search and role-based views.",
    points: ["Ops consoles", "Approval workflows", "Internal knowledge search"],
  },
  {
    title: "Dashboards & Analytics",
    desc: "Live operational dashboards that pull from your CRM, ERP and billing — with an AI analyst layer that answers questions in plain language.",
    points: ["Executive dashboards", "KPI alerting", "AI Q&A over your data"],
  },
  {
    title: "Client & Vendor Portals",
    desc: "Self-service portals where clients track status, upload documents and approve work — cutting the status-call traffic to zero.",
    points: ["Client portals", "Document exchange", "Self-service booking"],
  },
  {
    title: "SaaS Products",
    desc: "Multi-tenant platforms built to bill: auth, teams, usage metering, payments and the AI features that make the product defensible.",
    points: ["Multi-tenant architecture", "Billing & metering", "AI-native features"],
  },
  {
    title: "AI-enabled Websites",
    desc: "Marketing sites with agents embedded — every visitor conversation qualified, captured and routed before your team wakes up.",
    points: ["Embedded agents", "Lead routing", "Performance-first builds"],
  },
  {
    title: "APIs & Integrations",
    desc: "Clean, documented APIs and event pipelines that let your systems — and your partners' systems — talk without brittle point-to-point hacks.",
    points: ["REST & GraphQL", "Webhook infrastructure", "Versioning & docs"],
  },
];

const stack = ["React & TypeScript", "Node.js & Python", "PostgreSQL / Supabase", "Serverless & edge", "OpenAI / Claude / Gemini", "CI/CD & monitoring", "Web & mobile-ready"];

export default function Software() {
  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 80% 20%, rgba(62,123,255,.12), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)] grid lg:grid-cols-[1fr_1.15fr] gap-12 items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-cyan-ic flex items-center gap-3">
                <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
                <Scramble text="CUSTOM SOFTWARE // BEYOND NO-CODE" />
              </p>
            </Reveal>
            <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
              When off-the-shelf can't fit, <span className="text-brand-400">we engineer it.</span>
            </h1>
            <Reveal delay={0.2}>
              <p className="mt-5 max-w-xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
                Automation platforms hit a ceiling. Past it, you need real software: dashboards that unify your systems,
                portals your clients actually use, and products with AI at their core — built by engineers who also ship automations.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button to="/contact" arrow>Start a Project</Button>
                <Button to="/work" variant="ghost">See Blueprint Examples</Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-1.5">
                {stack.map((s) => (
                  <span key={s} className="font-mono text-[0.66rem] px-2.5 py-1.5 hairline text-ink-200 bg-ink-900/60 clip-corner">{s}</span>
                ))}
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.25}>
            <OpsDashboard />
          </Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap">
          <SectionHead
            tone="paper"
            eyebrow="what we build"
            title={<>Six kinds of software, one <span className="text-brand-600">standard.</span></>}
            lead="Fast, accessible, monitored and documented — whether it's a two-week internal tool or a multi-tenant platform."
          />
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {engagements.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.05}>
                <article className="group relative h-full bg-white hairline-light clip-corner p-6 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_24px_54px_-24px_rgba(46,99,232,.3)] overflow-hidden">
                  <span className="absolute top-0 right-0 w-14 h-14 bg-brand-500/[.06] rounded-bl-full group-hover:bg-brand-500/[.12] transition-colors duration-500" aria-hidden />
                  <IconTile tone="paper"><IconCode size={18} /></IconTile>
                  <h3 className="font-display font-bold text-ink-900 text-[1.2rem] tracking-tight mt-4 group-hover:text-brand-600 transition-colors">{e.title}</h3>
                  <p className="text-[0.86rem] text-ink-500 mt-2 leading-relaxed">{e.desc}</p>
                  <ul className="mt-4 space-y-1.5">
                    {e.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[0.8rem] text-ink-600">
                        <IconCheck size={13} className="text-brand-600 shrink-0" />{p}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap grid lg:grid-cols-[1fr_1.4fr] gap-12">
          <div>
            <SectionHead
              eyebrow="engineering standard"
              title={<>Built the way we'd want to <span className="text-brand-400">inherit it.</span></>}
              lead="Software outlives the sprint it was built in. Everything we ship is written for the engineer who maintains it in two years — often you, sometimes us."
            />
            <Reveal delay={0.2}>
              <Button to="/contact" className="mt-8" arrow>Discuss Your Build</Button>
            </Reveal>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["Typed end-to-end", "TypeScript from database schema to UI — whole classes of bugs never ship."],
              ["Observable by default", "Errors, latency and usage wired to alerts from day one, not after the first incident."],
              ["Access-controlled", "Role-based permissions designed into the data model, bolted onto nothing."],
              ["Deployed on CI/CD", "Preview environments, automated tests and one-click rollbacks on every project."],
              ["Documented for handover", "Architecture notes, runbooks and recorded walkthroughs at every milestone."],
              ["Performance budgets", "Load targets agreed up front and verified before anything goes live."],
            ].map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.05}>
                <div className="h-full bg-ink-850/80 hairline clip-corner p-5 hover:bg-ink-800 transition-colors duration-300">
                  <p className="font-display font-semibold text-white text-[1rem]">{t}</p>
                  <p className="text-[0.82rem] text-ink-300 mt-1.5 leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionHead tone="paper" eyebrow="delivery rhythm" title={<>Weekly shipping, <span className="text-brand-600">no black boxes.</span></>} />
            <Reveal delay={0.1}>
              <ol className="mt-8 space-y-4">
                {[
                  ["Week 0", "Discovery: workflows, data, success criteria — fixed scope or timeboxed discovery, your choice."],
                  ["Weeks 1–2", "Architecture + walking skeleton: the thinnest end-to-end slice, deployed, not slideware."],
                  ["Every week", "A demo of working software on Friday. Feedback lands in Monday's plan."],
                  ["Go-live", "Parallel run, training, monitoring dashboard, and a 30-day stabilization window."],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-4">
                    <span className="shrink-0 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-600 w-20 pt-1">{k}</span>
                    <p className="text-ink-600 leading-relaxed">{v}</p>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="bg-ink-900 hairline clip-corner p-6 relative overflow-hidden">
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
              <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic">a note from engineering</p>
              <p className="relative text-white font-display font-semibold text-[1.2rem] leading-snug mt-3">
                "The best internal tool is the one your team refuses to give up. We design for that moment."
              </p>
              <ul className="relative mt-5 space-y-2">
                {software.items.slice(0, 5).map((s) => (
                  <li key={s.name} className="flex items-center justify-between gap-3 text-[0.85rem] text-ink-200 border-b border-white/[.06] pb-2 last:border-0">
                    <span>{s.name}</span>
                    <IconArrowUpRight size={13} className="text-brand-400 shrink-0" />
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Have a build in mind — or just a bottleneck?"
              text="Send the rough idea. An engineer replies with an honest read on scope, stack and timeline."
              primaryLabel="Start a Project"
              primaryTo="/contact"
              secondaryLabel="Explore AI Agents"
              secondaryTo="/ai-agents"
            />
          </Reveal>
        </div>
      </Section>
    </>
  );
}
