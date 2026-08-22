import { Reveal, Scramble } from "../lib/motion";
import { Button, Section, SectionHead, CtaBand, Badge } from "../components/ui";
import { IconArrow, IconCheck, IconShield } from "../components/icons";
import { site } from "../data/site";
import { useCollection } from "../lib/cms";
import type { CaseStudyRow, Json } from "../types/db";

const blueprints = [
  {
    sector: "Real Estate",
    title: "Speed-to-lead engine",
    challenge: "A reference architecture for sales teams receiving high volumes of portal and ad leads where response time, qualification and booking are fragmented.",
    before: ["Leads exported from portals in batches", "Sales reps manually call down long lists", "Site visits require back-and-forth scheduling", "Source attribution is difficult to connect to pipeline"],
    solution: ["AI agent responds on WhatsApp within seconds", "Budget, location and timeline qualification from natural conversation", "Site visits auto-booked into sales calendars", "Source-level reporting assembled automatically"],
    architecture: ["Meta + portal lead ingestion", "AI Sales Agent", "CRM bi-directional sync", "WhatsApp Business API", "Calendar"],
    integrations: ["Property portals", "Meta Lead Ads", "CRM", "WhatsApp API", "Google Calendar"],
  },
  {
    sector: "Healthcare",
    title: "Front-desk automation",
    challenge: "A reference architecture for clinics where calls, appointment changes, reminders and repetitive FAQs compete for front-desk attention.",
    before: ["Reception handles calls, WhatsApp and walk-ins simultaneously", "Appointment changes require phone tag", "No-show reminders depend on manual follow-up", "Daily schedules are assembled across multiple tools"],
    solution: ["AI appointment agent books and reschedules against live availability", "Automated reminder cascade", "Patient FAQ agent grounded in clinic policies", "Daily schedule brief for the care team"],
    architecture: ["WhatsApp + website chat intake", "AI Appointment + Support Agents", "Clinic-system integration", "Reminder pipeline", "Daily brief generator"],
    integrations: ["Clinic system", "WhatsApp API", "Google Calendar", "Review platform"],
  },
  {
    sector: "E-commerce",
    title: "Order conversation layer",
    challenge: "A reference architecture for stores where order-status questions, cart recovery and COD verification consume support and operations time.",
    before: ["Support repeats tracking answers", "Cart recovery relies on basic email sequences", "COD verification is inconsistent", "Post-delivery review requests are manual"],
    solution: ["AI agent answers order-status queries from shipping data", "WhatsApp recovery conversations with business rules", "Automated COD confirmation before dispatch", "Post-delivery review and reorder sequences"],
    architecture: ["Commerce-store integration", "Shipping API events", "AI Support Agent", "COD verification flow", "Review automation"],
    integrations: ["Commerce platform", "Shipping API", "WhatsApp API", "Payment gateway"],
  },
];

const caseStudyTemplate = [
  "Client & industry (published with approval)",
  "The challenge in the client's own words",
  "Previous process — mapped step by step",
  "Solution architecture diagram",
  "Integrations & technology used",
  "Implementation timeline",
  "Outcome metrics — verified, or marked pending verification",
  "Client testimonial — only when given",
];

function jsonStrings(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

function textLines(value: string | null): string[] {
  if (!value) return [];
  return value.split(/\n+/).map((v) => v.trim()).filter(Boolean);
}

function LiveCaseStudy({ item, index }: { item: CaseStudyRow; index: number }) {
  const isVerifiedReal = item.case_type === "real" && item.verified;
  const previous = textLines(item.previous_process);
  const solution = textLines(item.solution);
  const architecture = jsonStrings(item.architecture_json);
  const integrations = jsonStrings(item.integrations_json);
  const results = jsonStrings(item.results_json);

  return (
    <Section tone={index % 2 === 0 ? "dark" : "deeper"} className="noise">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone="dark">{item.industry || "Business systems"}</Badge>
            <Badge tone={isVerifiedReal ? "signal" : "dark"}>{isVerifiedReal ? "verified case study" : "reference architecture"}</Badge>
          </div>
          <h2 className="font-display font-bold text-white text-[clamp(1.6rem,3.4vw,2.6rem)] tracking-tight mt-3">{item.title}</h2>
          {isVerifiedReal && item.client_name && <p className="mt-2 text-ink-300">Client: {item.client_name}</p>}
        </Reveal>

        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            {item.challenge && (
              <Reveal>
                <div className="bg-ink-850/70 hairline clip-corner p-5">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-amber-ic">the challenge</p>
                  <p className="text-ink-100 mt-2 leading-relaxed text-[0.95rem]">{item.challenge}</p>
                </div>
              </Reveal>
            )}
            {previous.length > 0 && (
              <Reveal delay={0.07}>
                <div className="bg-ink-850/70 hairline clip-corner p-5">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-rose-ic">previous process</p>
                  <ul className="mt-3 space-y-2">
                    {previous.map((s) => <li key={s} className="flex items-start gap-2.5 text-[0.88rem] text-ink-300"><span className="mt-2 w-1 h-1 shrink-0 bg-rose-ic rounded-full" aria-hidden />{s}</li>)}
                  </ul>
                </div>
              </Reveal>
            )}
          </div>

          <div className="space-y-5">
            {solution.length > 0 && (
              <Reveal delay={0.1}>
                <div className="relative bg-ink-900 hairline clip-corner p-5 overflow-hidden">
                  <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
                  <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.2em] text-signal">the ITCYBER solution</p>
                  <ul className="relative mt-3 space-y-2">
                    {solution.map((s) => <li key={s} className="flex items-start gap-2.5 text-[0.88rem] text-ink-100"><IconCheck size={14} className="text-signal mt-0.5 shrink-0" />{s}</li>)}
                  </ul>
                </div>
              </Reveal>
            )}

            {(architecture.length > 0 || integrations.length > 0) && (
              <Reveal delay={0.15}>
                <div className="bg-ink-850/70 hairline clip-corner p-5">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan-ic">architecture & integrations</p>
                  {architecture.length > 0 && (
                    <ol className="mt-3 flex flex-wrap items-center gap-1.5">
                      {architecture.map((a, i) => <li key={a} className="flex items-center gap-1.5"><span className="font-mono text-[0.68rem] px-2 py-1 hairline text-ink-100">{a}</span>{i < architecture.length - 1 && <IconArrow size={11} className="text-brand-400" />}</li>)}
                    </ol>
                  )}
                  {integrations.length > 0 && <div className="mt-4 pt-3 border-t border-white/[.07] flex flex-wrap gap-1.5">{integrations.map((i) => <span key={i} className="font-mono text-[0.62rem] px-2 py-1 bg-ink-900 hairline text-ink-300">{i}</span>)}</div>}
                </div>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              {isVerifiedReal && results.length > 0 ? (
                <div className="hairline bg-ink-850/50 clip-corner px-4 py-3">
                  <p className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-signal">verified outcomes</p>
                  <ul className="mt-2 space-y-1.5">{results.map((r) => <li key={r} className="text-[0.86rem] text-ink-200 flex items-start gap-2"><IconCheck size={13} className="text-signal mt-0.5 shrink-0" />{r}</li>)}</ul>
                </div>
              ) : (
                <p className="hairline bg-ink-850/50 clip-corner px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-300 flex items-center gap-2"><IconShield size={13} className="text-amber-ic shrink-0" />No unverified result metrics published</p>
              )}
            </Reveal>

            {isVerifiedReal && item.testimonial && <blockquote className="hairline clip-corner p-4 text-ink-200 italic">“{item.testimonial}”</blockquote>}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Blueprint({ b, index }: { b: (typeof blueprints)[number]; index: number }) {
  return (
    <Section tone={index % 2 === 0 ? "dark" : "deeper"} className="noise">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3"><Badge tone="dark">{b.sector}</Badge><Badge tone="dark">reference architecture</Badge></div>
          <h2 className="font-display font-bold text-white text-[clamp(1.6rem,3.4vw,2.6rem)] tracking-tight mt-3">{b.title}</h2>
        </Reveal>
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div className="bg-ink-850/70 hairline clip-corner p-5"><p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-amber-ic">the challenge pattern</p><p className="text-ink-100 mt-2 leading-relaxed text-[0.95rem]">{b.challenge}</p></div>
            <div className="bg-ink-850/70 hairline clip-corner p-5"><p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-rose-ic">typical manual process</p><ul className="mt-3 space-y-2">{b.before.map((s) => <li key={s} className="flex items-start gap-2.5 text-[0.88rem] text-ink-300"><span className="mt-2 w-1 h-1 shrink-0 bg-rose-ic rounded-full" aria-hidden />{s}</li>)}</ul></div>
          </div>
          <div className="space-y-5">
            <div className="relative bg-ink-900 hairline clip-corner p-5 overflow-hidden"><div className="absolute inset-0 grid-bg opacity-50" aria-hidden /><p className="relative font-mono text-[0.62rem] uppercase tracking-[0.2em] text-signal">reference solution</p><ul className="relative mt-3 space-y-2">{b.solution.map((s) => <li key={s} className="flex items-start gap-2.5 text-[0.88rem] text-ink-100"><IconCheck size={14} className="text-signal mt-0.5 shrink-0" />{s}</li>)}</ul></div>
            <div className="bg-ink-850/70 hairline clip-corner p-5"><p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan-ic">architecture & integrations</p><ol className="mt-3 flex flex-wrap items-center gap-1.5">{b.architecture.map((a, i) => <li key={a} className="flex items-center gap-1.5"><span className="font-mono text-[0.68rem] px-2 py-1 hairline text-ink-100">{a}</span>{i < b.architecture.length - 1 && <IconArrow size={11} className="text-brand-400" />}</li>)}</ol><div className="mt-4 pt-3 border-t border-white/[.07] flex flex-wrap gap-1.5">{b.integrations.map((i) => <span key={i} className="font-mono text-[0.62rem] px-2 py-1 bg-ink-900 hairline text-ink-300">{i}</span>)}</div></div>
            <p className="hairline bg-ink-850/50 clip-corner px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-300 flex items-center gap-2"><IconShield size={13} className="text-amber-ic shrink-0" />Reference only — no client result metrics claimed</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export default function Work() {
  const { data: liveCases, source } = useCollection("case_studies", [] as CaseStudyRow[]);
  const hasLiveCases = source === "live" && liveCases.length > 0;

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 25% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)] max-w-4xl">
          <Reveal><p className="eyebrow text-cyan-ic flex items-center gap-3"><span className="h-px w-8 bg-cyan-ic/60" aria-hidden /><Scramble text="WORK // SHOW THE ARCHITECTURE" /></p></Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">Evidence where we have it. <span className="text-brand-400">Reference patterns where we don't.</span></h1>
          <Reveal delay={0.2}><p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">Verified client work appears only when a client has approved publication. Everything else below is explicitly labelled as a reference architecture — useful for understanding how we design systems, not presented as client proof.</p></Reveal>
        </div>
      </section>

      {hasLiveCases && liveCases.map((item, index) => <LiveCaseStudy key={item.id} item={item} index={index} />)}

      <Section tone="paper">
        <div className="wrap"><SectionHead tone="paper" eyebrow="reference architectures" title={<>Common systems we can <span className="text-brand-600">architect around your stack.</span></>} lead="These are design patterns, not attributed client results. The final workflow, tools and controls are chosen around your actual business process." /></div>
      </Section>
      {blueprints.map((b, i) => <Blueprint key={b.title} b={b} index={i} />)}

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-12 items-start">
          <div><SectionHead tone="paper" eyebrow="our case-study standard" title={<>Every published case study carries <span className="text-brand-600">all eight of these.</span></>} lead="If a metric can't be verified, it says so. If a client won't be named, we don't name them." /><Reveal delay={0.2}><Button to="/contact" className="mt-8" arrow>Discuss Your Project</Button></Reveal></div>
          <Reveal delay={0.1}><ol className="bg-white hairline-light clip-corner divide-y divide-ink-900/[.07]">{caseStudyTemplate.map((s, i) => <li key={s} className="flex items-center gap-4 px-5 py-3.5"><span className="font-mono text-[0.66rem] text-brand-600">{String(i + 1).padStart(2, "0")}</span><span className="text-[0.9rem] text-ink-700">{s}</span><IconCheck size={14} className="ml-auto text-brand-600 shrink-0" /></li>)}</ol></Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise"><div className="absolute inset-0 grid-bg opacity-40" aria-hidden /><div className="relative wrap"><Reveal><CtaBand title="Want an architecture like this built around your operation?" text="Start with the free consultation — we'll map the process, identify the right integrations and tell you what should stay human." primaryLabel={site.cta.consultationLong} primaryTo="/contact" secondaryLabel="Explore AI Agents" secondaryTo="/ai-agents" /></Reveal></div></Section>
    </>
  );
}
