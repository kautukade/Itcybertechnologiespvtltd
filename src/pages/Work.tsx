import { Reveal, Scramble } from "../lib/motion";
import { Button, Section, SectionHead, CtaBand, Badge } from "../components/ui";
import { IconArrow, IconCheck, IconShield, IconBlueprint } from "../components/icons";
import { site } from "../data/site";

const blueprints = [
  {
    sector: "Real Estate",
    title: "Speed-to-lead engine",
    challenge: "A developer's sales team received hundreds of portal and ad leads daily. First response averaged hours; hot buyers went to whoever replied first.",
    before: ["Leads exported from portals twice a day", "Sales reps manually called down long lists", "Site visits scheduled over back-and-forth calls", "No visibility into which source produced revenue"],
    solution: ["AI agent responds on WhatsApp within seconds, 24×7", "Budget, location and timeline qualification from natural conversation", "Site visits auto-booked into sales calendars", "Source-level reporting assembled automatically"],
    architecture: ["Meta + portal lead ingestion", "AI Sales Agent (qualification + booking)", "Zoho CRM bi-directional sync", "WhatsApp Business API", "Google Calendar"],
    integrations: ["99acres / MagicBricks", "Meta Lead Ads", "Zoho CRM", "WhatsApp API", "Google Calendar"],
  },
  {
    sector: "Healthcare",
    title: "Front-desk automation",
    challenge: "A multi-doctor clinic lost patients at the front desk: calls went unanswered during consultations, no-shows drained schedules, FAQs repeated endlessly.",
    before: ["Reception handled calls, WhatsApp and walk-ins simultaneously", "Appointment changes required phone tag", "No-show reminders were sent manually, if at all", "Doctors started the day without a prepared patient list"],
    solution: ["AI appointment agent books and reschedules against live availability", "Automated reminder cascade (24h and 2h before)", "Patient FAQ agent grounded in clinic policies", "Morning sheet with the day's patients briefed to each doctor"],
    architecture: ["WhatsApp + website chat intake", "AI Appointment + Support Agents", "Clinic HMS integration", "Automated reminders pipeline", "Morning brief generator"],
    integrations: ["Clinic HMS", "WhatsApp API", "Google Calendar", "Google Reviews"],
  },
  {
    sector: "E-commerce",
    title: "Order conversation layer",
    challenge: "A D2C brand's support inbox flooded with order-status queries during sales, while abandoned carts and COD verification drained margin silently.",
    before: ["Support agents answered the same tracking questions all day", "Abandoned-cart emails were the only recovery attempt", "COD orders shipped without verification, inflating RTO", "Review requests depended on memory"],
    solution: ["AI agent answers WISMO queries from live shipping APIs in seconds", "WhatsApp recovery conversations with incentive logic", "Automated COD confirmation before dispatch", "Post-delivery review and reorder sequences"],
    architecture: ["Shopify store integration", "Shipping API polling (Shiprocket/Delhivery)", "AI Support Agent on WhatsApp", "COD verification flow", "Review automation"],
    integrations: ["Shopify", "Shiprocket", "WhatsApp API", "Razorpay"],
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

export default function Work() {
  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 25% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)] max-w-4xl">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="WORK // SHOW THE ARCHITECTURE" />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
            We'd rather show you the system than <span className="text-brand-400">borrow a logo.</span>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              Our client engagements run under NDA, so instead of unverifiable claims we publish{" "}
              <strong className="text-white font-semibold">engagement blueprints</strong> — the exact architecture patterns we deploy,
              the problems they solved, and the systems involved. Verified case studies appear here the moment clients approve them.
            </p>
          </Reveal>
        </div>
      </section>

      {blueprints.map((b, bi) => (
        <Section key={b.title} tone={bi % 2 === 0 ? "dark" : "deeper"} className="noise">
          <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
          <div className="relative wrap">
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <Badge tone="dark">{b.sector}</Badge>
                <Badge tone="signal">engagement blueprint</Badge>
              </div>
              <h2 className="font-display font-bold text-white text-[clamp(1.6rem,3.4vw,2.6rem)] tracking-tight mt-3">{b.title}</h2>
            </Reveal>
            <div className="mt-8 grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <Reveal>
                  <div className="bg-ink-850/70 hairline clip-corner p-5">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-amber-ic">the challenge</p>
                    <p className="text-ink-100 mt-2 leading-relaxed text-[0.95rem]">{b.challenge}</p>
                  </div>
                </Reveal>
                <Reveal delay={0.07}>
                  <div className="bg-ink-850/70 hairline clip-corner p-5">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-rose-ic">existing process</p>
                    <ul className="mt-3 space-y-2">
                      {b.before.map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-[0.88rem] text-ink-300">
                          <span className="mt-2 w-1 h-1 shrink-0 bg-rose-ic rounded-full" aria-hidden />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </div>
              <div className="space-y-5">
                <Reveal delay={0.1}>
                  <div className="relative bg-ink-900 hairline clip-corner p-5 overflow-hidden">
                    <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
                    <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.2em] text-signal">the ITCYBER solution</p>
                    <ul className="relative mt-3 space-y-2">
                      {b.solution.map((s) => (
                        <li key={s} className="flex items-start gap-2.5 text-[0.88rem] text-ink-100">
                          <IconCheck size={14} className="text-signal mt-0.5 shrink-0" />{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
                <Reveal delay={0.15}>
                  <div className="bg-ink-850/70 hairline clip-corner p-5">
                    <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-cyan-ic">architecture & integrations</p>
                    <ol className="mt-3 flex flex-wrap items-center gap-1.5">
                      {b.architecture.map((a, i) => (
                        <li key={a} className="flex items-center gap-1.5">
                          <span className="font-mono text-[0.68rem] px-2 py-1 hairline text-ink-100">{a}</span>
                          {i < b.architecture.length - 1 && <IconArrow size={11} className="text-brand-400" />}
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 pt-3 border-t border-white/[.07] flex flex-wrap gap-1.5">
                      {b.integrations.map((i) => (
                        <span key={i} className="font-mono text-[0.62rem] px-2 py-1 bg-ink-900 hairline text-ink-300">{i}</span>
                      ))}
                    </div>
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <p className="hairline bg-ink-850/50 clip-corner px-4 py-3 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-ink-300 flex items-center gap-2">
                    <IconShield size={13} className="text-amber-ic shrink-0" />
                    Result metrics to be added after verification with the client
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </Section>
      ))}

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHead
              tone="paper"
              eyebrow="our case-study standard"
              title={<>Every published case study will carry <span className="text-brand-600">all eight of these.</span></>}
              lead="If a metric can't be verified, it says so. If a client won't be named, we don't name them. Credibility compounds; fake proof bankrupts."
            />
            <Reveal delay={0.2}>
              <Button to="/contact" className="mt-8" arrow>Be the Next Blueprint</Button>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <ol className="bg-white hairline-light clip-corner divide-y divide-ink-900/[.07]">
              {caseStudyTemplate.map((s, i) => (
                <li key={s} className="flex items-center gap-4 px-5 py-3.5">
                  <span className="font-mono text-[0.66rem] text-brand-600">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[0.9rem] text-ink-700">{s}</span>
                  <IconCheck size={14} className="ml-auto text-brand-600 shrink-0" />
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <Reveal>
            <CtaBand
              title="Want one of these architectures running your operation?"
              text="Start with the free consultation — we'll tell you which blueprint fits, and what to change for your exact tools."
              primaryLabel={site.cta.consultationLong}
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
