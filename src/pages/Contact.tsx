import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Reveal, Scramble } from "../lib/motion";
import { cn } from "../lib/utils";
import { site, waLink } from "../data/site";
import { industries } from "../data/content";
import { Button, Section, Field, TextInput, TextArea, Select, Accordion } from "../components/ui";
import { IconArrow, IconCheck, IconWhatsApp, IconMail, IconClock, IconPin, IconShield } from "../components/icons";
import { submitLead, isEmail, isPhone } from "../lib/leads";

const faqs = [
  { q: "How quickly can a first automation go live?", a: "Most first workflows — typically lead response or support triage — run live within the first few weeks. Discovery and architecture take days, not months, because we scope one high-value workflow first." },
  { q: "Do you work with our existing CRM and tools?", a: "That's the whole point. We integrate with Zoho, HubSpot, Salesforce, Tally, Google Workspace, WhatsApp and most systems with an API. If a tool can't integrate cleanly, we'll tell you before you pay us." },
  { q: "Is WhatsApp automation done through the official API?", a: "Yes — we use the official WhatsApp Business API with approved templates and opt-in flows. No number-banning grey hacks; your number is an asset and we treat it like one." },
  { q: "What does an engagement cost?", a: "It depends on scope: a single workflow is a small build, a full AI operations layer is a program. After the free consultation you get a written scope with a fixed or timeboxed price — no hourly surprises." },
  { q: "Who owns the systems after deployment?", a: "You do — completely. Workflows, credentials and documentation are handed over. We stay on for optimization if you want us, but nothing is held hostage." },
  { q: "How is our data protected?", a: "Scoped credentials per integration, encrypted secrets, full audit logging, permission boundaries on every agent action, and human approval gates on high-stakes steps. We'll walk you through the architecture on a call." },
];

const lookingFor = ["AI Agent", "Workflow Automation", "CRM Automation", "WhatsApp Automation", "Custom Software", "Not sure yet"];
const problems = ["Leads go cold before we respond", "Team drowns in repetitive tasks", "Follow-ups keep slipping", "Systems don't talk to each other", "Reporting takes days", "Support queries pile up after hours"];
const toolOptions = ["Zoho CRM", "HubSpot", "Salesforce", "WhatsApp", "Google Workspace", "Tally", "Shopify", "Sheets / Excel", "Custom ERP", "None yet"];
const budgets = ["Under ₹1L", "₹1L – ₹5L", "₹5L – ₹15L", "₹15L+", "Not sure yet"];
const sizes = ["Just me", "2–10", "11–50", "51–200", "200+"];

export default function Contact() {
  const [params, setParams] = useSearchParams();
  const mode = params.get("mode") === "assessment" ? "assessment" : "form";

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 75% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2.5rem,5vw,4rem)]">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="CONTACT // START THE SYSTEM" />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05] max-w-3xl">
            Tell us what you want to <span className="text-brand-400">automate.</span>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              Two ways in: the detailed brief below, or a 2-minute assessment that qualifies the project for you.
              Either way, a solutions engineer replies — not a sales sequence.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-7 inline-flex hairline clip-corner p-1 gap-1">
              {(
                [
                  { id: "form", label: "Detailed brief" },
                  { id: "assessment", label: "2-min assessment" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setParams(m.id === "assessment" ? { mode: "assessment" } : {})}
                  className={cn(
                    "font-display font-semibold text-[0.88rem] px-4 h-9 clip-corner transition-all duration-300",
                    mode === m.id ? "bg-brand-500 text-white" : "text-ink-300 hover:text-white"
                  )}
                  aria-pressed={mode === m.id}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-[1.7fr_1fr] gap-10 items-start">
          <div>{mode === "assessment" ? <Assessment /> : <BriefForm />}</div>

          {/* sidebar */}
          <div className="space-y-4 lg:sticky lg:top-28">
            <Reveal delay={0.1}>
              <div className="bg-ink-900 hairline clip-corner p-6 relative overflow-hidden">
                <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
                <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic">direct lines</p>
                <ul className="relative mt-4 space-y-3.5 text-[0.9rem]">
                  <li>
                    <a href={`mailto:${site.contact.email}`} className="group flex items-center gap-3 text-ink-100 hover:text-white transition-colors">
                      <IconMail size={16} className="text-cyan-ic shrink-0" />
                      <span className="group-hover:underline underline-offset-4">{site.contact.email}</span>
                    </a>
                  </li>
                  <li className="flex items-center gap-3 text-ink-100">
                    <IconClock size={16} className="text-brand-400 shrink-0" />{site.contact.hours}
                  </li>
                  <li className="flex items-center gap-3 text-ink-100">
                    <IconPin size={16} className="text-brand-400 shrink-0" />{site.contact.address}
                  </li>
                </ul>
                <div className="relative mt-5 grid grid-cols-2 gap-2.5">
                  <Button href={waLink("Hi ITCYBER — I'd like to discuss automating my business.")} variant="whatsapp" size="sm">
                    <IconWhatsApp size={15} /> WhatsApp Us
                  </Button>
                  <Button href={site.contact.phoneHref} variant="ghost" size="sm">Call</Button>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="bg-white hairline-light clip-corner p-6">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand-600">what happens next</p>
                <ol className="mt-4 space-y-3">
                  {[
                    ["Within 1 business day", "A solutions engineer reviews your brief and replies with first observations."],
                    ["Free consultation", "A 30-minute call: we map one workflow worth automating — yours to keep either way."],
                    ["Written scope", "Architecture, timeline and fixed or timeboxed pricing. No surprises later."],
                  ].map(([k, v], i) => (
                    <li key={k} className="flex gap-3">
                      <span className="w-6 h-6 shrink-0 clip-corner bg-brand-500 text-white font-mono text-[0.62rem] flex items-center justify-center">{i + 1}</span>
                      <p className="text-[0.84rem] text-ink-600 leading-snug"><strong className="text-ink-900 font-display">{k}.</strong> {v}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="flex items-start gap-2.5 text-[0.78rem] text-ink-500 px-1">
                <IconShield size={14} className="text-brand-600 mt-0.5 shrink-0" />
                Your details go straight to our team — never sold, never spammed. NDAs welcomed before any deep discussion.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="dark" id="faq" className="noise scroll-mt-20">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap grid lg:grid-cols-[1fr_1.5fr] gap-12">
          <div className="lg:sticky lg:top-28 self-start">
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="FAQ // BEFORE THE CALL" />
            </p>
            <h2 className="font-display font-bold text-white tracking-tight mt-4 text-[clamp(1.6rem,3vw,2.4rem)] leading-tight">
              Answers before you <span className="text-brand-400">even ask.</span>
            </h2>
            <p className="text-ink-300 mt-3 leading-relaxed">Still unsure? The consultation exists exactly for that — it's free and useful either way.</p>
            <Button to="/contact?mode=assessment" variant="ghost" className="mt-6" arrow>Run the Assessment</Button>
          </div>
          <Reveal delay={0.1}>
            <div className="hairline clip-corner bg-ink-900/70 px-6">
              <Accordion items={faqs} />
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

/* -------------------------------- detailed brief ------------------------------- */

function BriefForm() {
  const [f, setF] = useState({
    name: "", company: "", phone: "", email: "", website: "", industry: "", size: "",
    automate: "", tools: "", budget: "", contactPref: "WhatsApp", message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF((v) => ({ ...v, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!f.name.trim()) errs.name = "Your name helps us reply properly";
    if (!isEmail(f.email)) errs.email = "Enter a valid work email";
    if (f.phone && !isPhone(f.phone)) errs.phone = "That phone number doesn't look right";
    if (!f.automate.trim()) errs.automate = "Even one line — 'follow-ups' is enough to start";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    try {
      await submitLead({ kind: "contact", payload: f, submittedAt: new Date().toISOString(), source: "itcyber.in" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success")
    return (
      <div className="bg-white hairline-light clip-corner p-8 sm:p-10 text-center">
        <span className="inline-flex w-16 h-16 clip-corner bg-signal/15 text-signal items-center justify-center"><IconCheck size={30} /></span>
        <h2 className="font-display font-bold text-ink-900 text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mt-5">Brief received. The clock starts now.</h2>
        <p className="text-ink-500 mt-3 leading-relaxed max-w-lg mx-auto">
          A solutions engineer will reply to <strong className="text-ink-800">{f.email}</strong> within one business day
          with first observations on your workflow{f.company ? ` for ${f.company}` : ""}. Prefer faster?{" "}
          <a className="text-brand-600 underline underline-offset-4" href={waLink(`Hi ITCYBER — I just sent a project brief (${f.name}).`)} target="_blank" rel="noreferrer">Ping us on WhatsApp</a>.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button onClick={() => { setStatus("idle"); setF({ name: "", company: "", phone: "", email: "", website: "", industry: "", size: "", automate: "", tools: "", budget: "", contactPref: "WhatsApp", message: "" }); }} variant="light">Send Another Brief</Button>
          <Button to="/automations" variant="ghost">Browse Automations While You Wait</Button>
        </div>
      </div>
    );

  return (
    <form onSubmit={submit} noValidate className="bg-white hairline-light clip-corner p-6 sm:p-8">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brand-600 mb-6">project brief · ~3 minutes</p>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Name *" name="b-name" tone="paper" error={errors.name}>
          <TextInput id="b-name" tone="paper" error={!!errors.name} value={f.name} onChange={set("name")} autoComplete="name" placeholder="Full name" />
        </Field>
        <Field label="Company" name="b-company" tone="paper">
          <TextInput id="b-company" tone="paper" value={f.company} onChange={set("company")} autoComplete="organization" placeholder="Company name" />
        </Field>
        <Field label="Work email *" name="b-email" tone="paper" error={errors.email}>
          <TextInput id="b-email" type="email" tone="paper" error={!!errors.email} value={f.email} onChange={set("email")} autoComplete="email" placeholder="you@company.com" />
        </Field>
        <Field label="Phone" name="b-phone" tone="paper" error={errors.phone}>
          <TextInput id="b-phone" type="tel" tone="paper" error={!!errors.phone} value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="+91…" />
        </Field>
        <Field label="Website" name="b-web" tone="paper">
          <TextInput id="b-web" type="url" tone="paper" value={f.website} onChange={set("website")} placeholder="https://…" />
        </Field>
        <Field label="Industry" name="b-ind" tone="paper">
          <Select id="b-ind" tone="paper" value={f.industry} onChange={set("industry")}>
            <option value="">Select industry</option>
            {industries.map((i) => <option key={i.slug} value={i.name}>{i.name}</option>)}
            <option value="Other">Other</option>
          </Select>
        </Field>
        <Field label="Company size" name="b-size" tone="paper">
          <Select id="b-size" tone="paper" value={f.size} onChange={set("size")}>
            <option value="">Select size</option>
            {sizes.map((s) => <option key={s} value={s}>{s} people</option>)}
          </Select>
        </Field>
        <Field label="Estimated budget" name="b-budget" tone="paper">
          <Select id="b-budget" tone="paper" value={f.budget} onChange={set("budget")}>
            <option value="">Select range</option>
            {budgets.map((b) => <option key={b} value={b}>{b}</option>)}
          </Select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="What would you like to automate? *" name="b-automate" tone="paper" error={errors.automate}>
            <Select id="b-automate" tone="paper" error={!!errors.automate} value={f.automate} onChange={set("automate")}>
              <option value="">Select the biggest headache</option>
              {problems.map((p) => <option key={p} value={p}>{p}</option>)}
              <option value="Something else">Something else</option>
            </Select>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Current tools" name="b-tools" tone="paper" hint="CRM, billing, spreadsheets — whatever the workflow touches today.">
            <TextInput id="b-tools" tone="paper" value={f.tools} onChange={set("tools")} placeholder="e.g. Zoho CRM, WhatsApp, Tally, Sheets" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Preferred contact method" name="b-pref" tone="paper">
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferred contact method">
              {["WhatsApp", "Call", "Email"].map((m) => (
                <button
                  type="button"
                  key={m}
                  role="radio"
                  aria-checked={f.contactPref === m}
                  onClick={() => setF((v) => ({ ...v, contactPref: m }))}
                  className={cn(
                    "font-display font-semibold text-[0.85rem] px-4 h-10 clip-corner transition-all duration-300",
                    f.contactPref === m ? "bg-brand-500 text-white" : "bg-white hairline-light text-ink-600 hover:bg-paper"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="Message" name="b-msg" tone="paper">
            <TextArea id="b-msg" tone="paper" value={f.message} onChange={set("message")} placeholder="Walk us through the workflow in your own words — the messier the detail, the better the scope." />
          </Field>
        </div>
      </div>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" loading={status === "loading"} arrow>Submit Request</Button>
        <Button type="button" href={waLink("Hi ITCYBER — I'd like to book a free AI consultation.")} variant="whatsapp" size="lg">
          <IconWhatsApp size={17} /> WhatsApp Us
        </Button>
        {status === "error" && <p className="text-[0.82rem] text-rose-ic w-full" role="alert">Submission failed — please email {site.contact.email} or use WhatsApp.</p>}
      </div>
    </form>
  );
}

/* ------------------------------ assessment wizard ------------------------------ */

function Assessment() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState({ looking: "", industry: "", problem: "", problemDetail: "", tools: [] as string[], name: "", email: "", phone: "", company: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const steps = ["Looking for", "Industry", "Main problem", "Current tools", "Your details"];
  const canNext = useMemo(() => {
    if (step === 0) return !!a.looking;
    if (step === 1) return !!a.industry;
    if (step === 2) return !!a.problem;
    if (step === 3) return a.tools.length > 0;
    return true;
  }, [step, a]);

  const next = () => {
    if (step < 4) {
      setStep((s) => s + 1);
      return;
    }
    const errs: Record<string, string> = {};
    if (!a.name.trim()) errs.name = "We need a name to reply to";
    if (!isEmail(a.email)) errs.email = "Enter a valid email";
    if (a.phone && !isPhone(a.phone)) errs.phone = "That phone doesn't look right";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    submitLead({ kind: "assessment", payload: a, submittedAt: new Date().toISOString(), source: "itcyber.in" }).then(() => setStatus("success"));
  };

  if (status === "success")
    return (
      <div className="bg-white hairline-light clip-corner p-8 sm:p-10 text-center">
        <span className="inline-flex w-16 h-16 clip-corner bg-signal/15 text-signal items-center justify-center"><IconCheck size={30} /></span>
        <h2 className="font-display font-bold text-ink-900 text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mt-5">Your automation assessment has been submitted.</h2>
        <p className="text-ink-500 mt-3 leading-relaxed max-w-lg mx-auto">
          Based on your answers, we'll prepare a short read on where an agent or automation fits{" "}
          {a.industry && <>in <strong className="text-ink-800">{a.industry.toLowerCase()}</strong></>} — sent to{" "}
          <strong className="text-ink-800">{a.email}</strong> within one business day.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button href={waLink(`Hi ITCYBER — I just submitted an automation assessment (${a.name}, ${a.looking}).`)} variant="whatsapp"><IconWhatsApp size={15} /> Continue on WhatsApp</Button>
          <Button to="/" variant="ghost">Back to Home</Button>
        </div>
      </div>
    );

  const chip = (on: boolean) =>
    cn("font-display font-semibold text-[0.88rem] px-4 py-2.5 clip-corner transition-all duration-300 text-left",
      on ? "bg-brand-500 text-white shadow-[0_8px_24px_-8px_rgba(62,123,255,.6)]" : "bg-white hairline-light text-ink-700 hover:bg-paper");

  return (
    <div className="bg-white hairline-light clip-corner p-6 sm:p-8">
      {/* progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-brand-600">
          step {step + 1} / 5 — {steps[step]}
        </p>
        <p className="font-mono text-[0.62rem] text-ink-400">~2 min total</p>
      </div>
      <div className="mt-3 flex gap-1">
        {steps.map((s, i) => (
          <button key={s} onClick={() => i < step && setStep(i)} disabled={i > step} aria-label={`Go to step ${i + 1}: ${s}`}
            className={cn("h-1.5 flex-1 transition-all duration-500", i <= step ? "bg-brand-500" : "bg-ink-900/10", i < step && "cursor-pointer hover:bg-brand-400")} />
        ))}
      </div>

      <div className="mt-7 min-h-[16rem]">
        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-2.5">
            {lookingFor.map((o) => (
              <button key={o} className={chip(a.looking === o)} onClick={() => setA((v) => ({ ...v, looking: o }))} aria-pressed={a.looking === o}>{o}</button>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="flex flex-wrap gap-2">
            {[...industries.map((i) => i.name), "Other"].map((o) => (
              <button key={o} className={chip(a.industry === o)} onClick={() => setA((v) => ({ ...v, industry: o }))} aria-pressed={a.industry === o}>{o}</button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {problems.map((p) => (
                <button key={p} className={chip(a.problem === p)} onClick={() => setA((v) => ({ ...v, problem: p }))} aria-pressed={a.problem === p}>{p}</button>
              ))}
            </div>
            <div className="mt-4">
              <TextArea tone="paper" value={a.problemDetail} onChange={(e) => setA((v) => ({ ...v, problemDetail: e.target.value }))} placeholder="Optional: describe it in your own words…" />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="flex flex-wrap gap-2">
            {toolOptions.map((t) => {
              const on = a.tools.includes(t);
              return (
                <button key={t} className={chip(on)} onClick={() => setA((v) => ({ ...v, tools: on ? v.tools.filter((x) => x !== t) : [...v.tools, t] }))} aria-pressed={on}>
                  {on && <IconCheck size={12} className="inline mr-1.5" />}{t}
                </button>
              );
            })}
            <p className="w-full text-[0.78rem] text-ink-400 mt-2">Select everything the workflow touches — integrations shape the architecture.</p>
          </div>
        )}
        {step === 4 && (
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *" name="a-name" tone="paper" error={errors.name}>
              <TextInput id="a-name" tone="paper" error={!!errors.name} value={a.name} onChange={(e) => setA((v) => ({ ...v, name: e.target.value }))} autoComplete="name" placeholder="Full name" />
            </Field>
            <Field label="Work email *" name="a-email" tone="paper" error={errors.email}>
              <TextInput id="a-email" type="email" tone="paper" error={!!errors.email} value={a.email} onChange={(e) => setA((v) => ({ ...v, email: e.target.value }))} autoComplete="email" placeholder="you@company.com" />
            </Field>
            <Field label="Phone" name="a-phone" tone="paper" error={errors.phone}>
              <TextInput id="a-phone" type="tel" tone="paper" error={!!errors.phone} value={a.phone} onChange={(e) => setA((v) => ({ ...v, phone: e.target.value }))} autoComplete="tel" placeholder="+91…" />
            </Field>
            <Field label="Company" name="a-company" tone="paper">
              <TextInput id="a-company" tone="paper" value={a.company} onChange={(e) => setA((v) => ({ ...v, company: e.target.value }))} autoComplete="organization" placeholder="Company" />
            </Field>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button variant="light" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          ← Back
        </Button>
        <div className="flex items-center gap-3">
          {step === 4 && (
            <p className="hidden sm:block text-[0.78rem] text-ink-400">
              {a.looking} · {a.industry} · {a.tools.length} tools
            </p>
          )}
          <Button onClick={next} disabled={!canNext} loading={status === "loading"} arrow>
            {step === 4 ? "Submit Assessment" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
