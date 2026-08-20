import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Reveal, Scramble } from "../lib/motion";
import { cn } from "../lib/utils";
import { site, waLink, contactReady, emailReady } from "../data/site";
import { Button, Section, SectionHead, Field, TextInput, TextArea, Select, Badge } from "../components/ui";
import { IconArrow, IconCheck, IconMail, IconPhone, IconWhatsApp, IconChevron, IconClock, IconPin } from "../components/icons";
import { submitPublic, isEmail, isPhone, readUtm, SUBMIT_ERROR, type SubmissionMeta } from "../lib/leads";
import { usePageMeta } from "../lib/seo";
import { industries } from "../data/content";

type Status = "idle" | "loading" | "success" | "error";

const TOOL_CHIPS = ["Zoho", "HubSpot", "Salesforce", "Tally", "Google Workspace", "WhatsApp Business", "Shopify", "Sheets/Excel", "Custom ERP", "Other"];

function metaFrom(elapsed: number): SubmissionMeta {
  const params = new URLSearchParams(window.location.search);
  return {
    source_page: window.location.pathname,
    elapsed_ms: elapsed,
    ...readUtm(params),
  };
}

export default function Contact() {
  usePageMeta({
    title: "Contact ITCYBER — Tell Us What You Want to Automate",
    description: "Book a free AI consultation or run the 2-minute automation assessment. ITCYBER builds AI agents, workflow automation and custom software for Indian businesses.",
    path: "/contact",
  });

  const [params] = useSearchParams();
  const [tab, setTab] = useState<"form" | "assessment">(params.get("mode") === "assessment" ? "assessment" : "form");

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 75% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(2rem,4vw,3rem)]">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text="CONTACT // REAL REPLIES, REAL ENGINEERS" />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05] max-w-3xl">
            Tell us what you want to <span className="text-brand-400">automate.</span>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-4 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              Two ways in: a detailed project brief, or the 2-minute automation assessment that helps us
              (and you) understand what's worth automating first.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-7 inline-flex hairline clip-corner p-1 gap-1 bg-ink-900/70" role="tablist" aria-label="Contact mode">
              {(
                [
                  { id: "form", label: "Project Brief" },
                  { id: "assessment", label: "Automation Assessment" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "font-display font-semibold text-[0.92rem] px-5 h-10 clip-corner transition-all duration-300",
                    tab === t.id ? "bg-brand-500 text-white" : "text-ink-200 hover:text-white"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-[1fr_1.7fr] gap-12 items-start">
          {/* channels */}
          <div className="lg:sticky lg:top-28 space-y-5">
            <SectionHead
              tone="paper"
              eyebrow="direct channels"
              title={<>Talk to a human <span className="text-brand-600">first.</span></>}
              lead="Every enquiry is read by an engineer, not a routing bot. We reply with an honest read — including when automation isn't the right answer."
            />
            <div className="space-y-3">
              {emailReady && (
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-4 bg-white hairline-light clip-corner p-4 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(46,99,232,.4)] transition-all duration-300">
                  <span className="w-10 h-10 shrink-0 clip-corner bg-brand-500/10 text-brand-600 flex items-center justify-center"><IconMail size={18} /></span>
                  <span>
                    <span className="block font-display font-bold text-ink-900 text-[0.95rem]">Email us</span>
                    <span className="block text-[0.82rem] text-ink-500">{site.contact.email}</span>
                  </span>
                </a>
              )}
              {contactReady && (
                <a href={waLink("Hi ITCYBER — I'd like to discuss AI automation for my business.") ?? undefined} target="_blank" rel="noreferrer" className="flex items-center gap-4 bg-white hairline-light clip-corner p-4 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(31,175,99,.4)] transition-all duration-300">
                  <span className="w-10 h-10 shrink-0 clip-corner bg-[#1FAF63]/12 text-[#1FAF63] flex items-center justify-center"><IconWhatsApp size={18} /></span>
                  <span>
                    <span className="block font-display font-bold text-ink-900 text-[0.95rem]">{site.cta.whatsapp}</span>
                    <span className="block text-[0.82rem] text-ink-500">{site.contact.phoneDisplay || "Fastest response channel"}</span>
                  </span>
                </a>
              )}
              {contactReady && site.contact.phoneHref && (
                <a href={site.contact.phoneHref} className="flex items-center gap-4 bg-white hairline-light clip-corner p-4 hover:-translate-y-0.5 transition-all duration-300">
                  <span className="w-10 h-10 shrink-0 clip-corner bg-brand-500/10 text-brand-600 flex items-center justify-center"><IconPhone size={18} /></span>
                  <span>
                    <span className="block font-display font-bold text-ink-900 text-[0.95rem]">Call us</span>
                    <span className="block text-[0.82rem] text-ink-500">{site.contact.phoneDisplay}</span>
                  </span>
                </a>
              )}
              <div className="flex items-start gap-4 bg-white hairline-light clip-corner p-4">
                <span className="w-10 h-10 shrink-0 clip-corner bg-brand-500/10 text-brand-600 flex items-center justify-center"><IconPin size={18} /></span>
                <span>
                  <span className="block font-display font-bold text-ink-900 text-[0.95rem]">Based in</span>
                  <span className="block text-[0.82rem] text-ink-500">{site.contact.address}</span>
                  <span className="flex items-center gap-1.5 text-[0.78rem] text-ink-500 mt-1"><IconClock size={12} className="text-brand-600" />{site.contact.hours}</span>
                </span>
              </div>
            </div>
            <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-400">
              Submissions are stored securely and reviewed by an engineer — not a routing bot.
            </p>
          </div>

          <div>{tab === "form" ? <ProjectBrief /> : <AssessmentWizard />}</div>
        </div>
      </Section>

      <FaqSection />
    </>
  );
}

/* ─────────────────────────── project brief form ─────────────────────────── */

const EMPTY_BRIEF = {
  full_name: "", company: "", phone: "", email: "", website: "", industry: "", company_size: "",
  automation_interest: "", existing_tools: "", budget_range: "", preferred_contact: "Email", message: "",
  referral_link: "",
};

function ProjectBrief() {
  const [form, setForm] = useState(EMPTY_BRIEF);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const startedAt = useRef(Date.now());

  const set = (k: keyof typeof EMPTY_BRIEF) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.referral_link) return; // honeypot
    const errs: Record<string, string> = {};
    if (!form.full_name.trim()) errs.full_name = "Please enter your name";
    if (!isEmail(form.email)) errs.email = "Enter a valid work email";
    if (form.phone && !isPhone(form.phone)) errs.phone = "Phone number looks invalid";
    if (!form.message.trim()) errs.message = "Tell us briefly what you'd like to automate";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("loading");
    try {
      const { referral_link: _hp, ...payload } = form;
      await submitPublic("contact", payload, metaFrom(Date.now() - startedAt.current));
      setStatus("success");
    } catch (err) {
      setErrMsg(err instanceof Error ? err.message : SUBMIT_ERROR);
      setStatus("error");
    }
  };

  if (status === "success") return <SuccessCard name={form.full_name} email={form.email} what="project brief" />;

  return (
    <Reveal delay={0.1}>
      <form onSubmit={submit} noValidate className="bg-white hairline-light clip-corner p-6 sm:p-8 grid sm:grid-cols-2 gap-5">
        <Field label="Name *" name="b-name" tone="paper" error={errors.full_name}>
          <TextInput id="b-name" tone="paper" error={!!errors.full_name} value={form.full_name} onChange={set("full_name")} placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Company" name="b-company" tone="paper">
          <TextInput id="b-company" tone="paper" value={form.company} onChange={set("company")} placeholder="Company name" autoComplete="organization" />
        </Field>
        <Field label="Work email *" name="b-email" tone="paper" error={errors.email}>
          <TextInput id="b-email" type="email" tone="paper" error={!!errors.email} value={form.email} onChange={set("email")} placeholder="you@company.com" autoComplete="email" />
        </Field>
        <Field label="Phone" name="b-phone" tone="paper" error={errors.phone}>
          <TextInput id="b-phone" type="tel" tone="paper" error={!!errors.phone} value={form.phone} onChange={set("phone")} placeholder="+91…" autoComplete="tel" />
        </Field>
        <Field label="Website" name="b-website" tone="paper">
          <TextInput id="b-website" type="url" tone="paper" value={form.website} onChange={set("website")} placeholder="company.com" />
        </Field>
        <Field label="Industry" name="b-industry" tone="paper">
          <Select id="b-industry" tone="paper" value={form.industry} onChange={set("industry")}>
            <option value="">Select industry</option>
            {industries.map((i) => <option key={i.slug} value={i.name}>{i.name}</option>)}
          </Select>
        </Field>
        <Field label="Company size" name="b-size" tone="paper">
          <Select id="b-size" tone="paper" value={form.company_size} onChange={set("company_size")}>
            <option value="">Select size</option>
            {["Just me", "2–10", "11–50", "51–200", "200+"].map((s) => <option key={s} value={s}>{s} people</option>)}
          </Select>
        </Field>
        <Field label="What would you like to automate?" name="b-interest" tone="paper">
          <Select id="b-interest" tone="paper" value={form.automation_interest} onChange={set("automation_interest")}>
            <option value="">Select area</option>
            {["AI Agent", "Workflow Automation", "CRM Automation", "WhatsApp Automation", "Custom Software", "Integrations", "Not sure yet"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Current tools" name="b-tools" tone="paper">
          <TextInput id="b-tools" tone="paper" value={form.existing_tools} onChange={set("existing_tools")} placeholder="e.g. Zoho CRM, Tally, WhatsApp" />
        </Field>
        <Field label="Estimated budget range" name="b-budget" tone="paper">
          <Select id="b-budget" tone="paper" value={form.budget_range} onChange={set("budget_range")}>
            <option value="">Prefer not to say</option>
            {["Under ₹50k", "₹50k–₹1.5L", "₹1.5L–₹5L", "₹5L+", "Monthly retainer"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        <Field label="Preferred contact method" name="b-pref" tone="paper">
          <Select id="b-pref" tone="paper" value={form.preferred_contact} onChange={set("preferred_contact")}>
            {["Email", "Phone", "WhatsApp", "Video call"].map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </Field>
        {/* honeypot — hidden from humans, bait for bots */}
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="b-referral">Leave this empty</label>
          <TextInput id="b-referral" tabIndex={-1} autoComplete="off" value={form.referral_link} onChange={set("referral_link")} />
        </div>
        <div className="sm:col-span-2">
          <Field label="Message *" name="b-message" tone="paper" error={errors.message}>
            <TextArea id="b-message" tone="paper" error={!!errors.message} value={form.message} onChange={set("message")} placeholder="Describe the workflow that eats your team's time…" />
          </Field>
        </div>
        <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
          <Button type="submit" size="lg" loading={status === "loading"} arrow>Submit Request</Button>
          {contactReady && (
            <Button type="button" href={waLink("Hi ITCYBER — sending my project brief via WhatsApp instead.") ?? undefined} variant="ghost" size="lg">WhatsApp Us</Button>
          )}
          <Button to="/contact?mode=assessment" variant="ghost" size="lg">Book Consultation via Assessment</Button>
        </div>
        {status === "error" && <p className="sm:col-span-2 text-[0.85rem] text-rose-ic" role="alert">{errMsg}</p>}
      </form>
    </Reveal>
  );
}

/* ─────────────────────── multi-step automation assessment ─────────────────────── */

const STEPS = ["What you need", "Industry", "Main problem", "Current tools", "Budget & timeline", "Contact details"];

function AssessmentWizard() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState({ requirement: "", industry: "", business_problem: "", tools: [] as string[], budget: "", timeline: "", full_name: "", company: "", email: "", phone: "", referral_link: "" });
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const startedAt = useRef(Date.now());

  const canNext = [
    a.requirement !== "",
    a.industry !== "",
    a.business_problem.trim() !== "",
    true,
    true,
    a.full_name.trim() !== "" && isEmail(a.email),
  ][step];

  const next = () => {
    if (step === 3 && a.tools.length === 0) {
      setError("Pick at least one — or choose Other.");
      return;
    }
    setError("");
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else submit();
  };

  const submit = async () => {
    if (a.referral_link) return;
    if (!a.full_name.trim() || !isEmail(a.email)) {
      setError("Enter your name and a valid email to finish.");
      return;
    }
    setStatus("loading");
    try {
      await submitPublic(
        "assessment",
        {
          requirement: a.requirement,
          industry: a.industry,
          business_problem: a.business_problem,
          existing_tools: a.tools.join(", "),
          budget: a.budget,
          timeline: a.timeline,
          full_name: a.full_name,
          company: a.company,
          email: a.email,
          phone: a.phone,
          answers_json: { steps_completed: STEPS.length },
        },
        metaFrom(Date.now() - startedAt.current)
      );
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : SUBMIT_ERROR);
      setStatus("error");
    }
  };

  if (status === "success") return <SuccessCard name={a.full_name} email={a.email} what="automation assessment" />;

  const chip = (v: string) =>
    cn(
      "font-display font-semibold text-[0.85rem] px-4 h-11 clip-corner transition-all duration-300",
      a.requirement === v ? "bg-brand-500 text-white shadow-[0_8px_24px_-8px_rgba(62,123,255,.7)]" : "hairline bg-white text-ink-700 hover:border-brand-500/60 hover:text-brand-600"
    );

  return (
    <Reveal delay={0.1}>
      <div className="bg-white hairline-light clip-corner p-6 sm:p-8">
        {/* progress */}
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ink-400">
            Step {step + 1} / {STEPS.length} — {STEPS[step]}
          </p>
          <p className="font-mono text-[0.64rem] text-brand-600">{Math.round(((step + 1) / STEPS.length) * 100)}%</p>
        </div>
        <div className="h-[3px] bg-ink-900/[.08] mb-8">
          <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-ic transition-all duration-500 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>

        {step === 0 && (
          <div className="grid sm:grid-cols-2 gap-3">
            {["AI Agent", "Workflow Automation", "CRM Automation", "WhatsApp Automation", "Custom Software", "Not sure yet"].map((v) => (
              <button key={v} className={chip(v)} onClick={() => setA((x) => ({ ...x, requirement: v }))}>{v}</button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-3">
            {industries.map((i) => (
              <button key={i.slug} className={cn(chip(i.name), "text-left")} onClick={() => setA((x) => ({ ...x, industry: i.name }))}>{i.name}</button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div>
            <p className="font-display font-bold text-ink-900 text-[1.1rem] mb-3">What's the main problem you want solved?</p>
            <TextArea id="a-problem" tone="paper" value={a.business_problem} onChange={(e) => setA((x) => ({ ...x, business_problem: e.target.value }))} placeholder="e.g. Leads reply late because follow-up is manual, and nobody knows which leads are actually hot…" />
            <div className="mt-3 flex flex-wrap gap-2">
              {["Leads slip through", "Follow-ups are manual", "Too much data entry", "Reports take too long", "Support is overloaded"].map((s) => (
                <button key={s} onClick={() => setA((x) => ({ ...x, business_problem: s }))} className="font-mono text-[0.68rem] px-3 py-2 hairline clip-corner text-ink-500 hover:text-brand-600 hover:border-brand-500/50 transition-colors">{s}</button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p className="font-display font-bold text-ink-900 text-[1.1rem] mb-3">Which tools do you use today?</p>
            <div className="flex flex-wrap gap-2">
              {TOOL_CHIPS.map((t) => {
                const on = a.tools.includes(t);
                return (
                  <button
                    key={t}
                    aria-pressed={on}
                    onClick={() => setA((x) => ({ ...x, tools: on ? x.tools.filter((v) => v !== t) : [...x.tools, t] }))}
                    className={cn("font-display font-semibold text-[0.85rem] px-4 h-10 clip-corner transition-all duration-300", on ? "bg-ink-900 text-white" : "hairline bg-white text-ink-600 hover:border-brand-500/60")}
                  >
                    {on && <IconCheck size={12} className="inline mr-1.5 -mt-0.5" />}{t}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Budget range" name="a-budget" tone="paper">
              <Select id="a-budget" tone="paper" value={a.budget} onChange={(e) => setA((x) => ({ ...x, budget: e.target.value }))}>
                <option value="">Prefer not to say</option>
                {["Under ₹50k", "₹50k–₹1.5L", "₹1.5L–₹5L", "₹5L+", "Monthly retainer"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
            <Field label="Timeline" name="a-timeline" tone="paper">
              <Select id="a-timeline" tone="paper" value={a.timeline} onChange={(e) => setA((x) => ({ ...x, timeline: e.target.value }))}>
                <option value="">No rush</option>
                {["ASAP", "This month", "This quarter", "Exploring"].map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        )}

        {step === 5 && (
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name *" name="a-name" tone="paper">
              <TextInput id="a-name" tone="paper" value={a.full_name} onChange={(e) => setA((x) => ({ ...x, full_name: e.target.value }))} placeholder="Your name" autoComplete="name" />
            </Field>
            <Field label="Company" name="a-company" tone="paper">
              <TextInput id="a-company" tone="paper" value={a.company} onChange={(e) => setA((x) => ({ ...x, company: e.target.value }))} placeholder="Company" autoComplete="organization" />
            </Field>
            <Field label="Work email *" name="a-email" tone="paper">
              <TextInput id="a-email" type="email" tone="paper" value={a.email} onChange={(e) => setA((x) => ({ ...x, email: e.target.value }))} placeholder="you@company.com" autoComplete="email" />
            </Field>
            <Field label="Phone" name="a-phone" tone="paper">
              <TextInput id="a-phone" type="tel" tone="paper" value={a.phone} onChange={(e) => setA((x) => ({ ...x, phone: e.target.value }))} placeholder="+91…" autoComplete="tel" />
            </Field>
            <div className="sr-only" aria-hidden="true">
              <label htmlFor="a-referral">Leave this empty</label>
              <TextInput id="a-referral" tabIndex={-1} autoComplete="off" value={a.referral_link} onChange={(e) => setA((x) => ({ ...x, referral_link: e.target.value }))} />
            </div>
          </div>
        )}

        {error && <p className="mt-4 text-[0.85rem] text-rose-ic" role="alert">{error}</p>}

        <div className="mt-8 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} type="button">
            Back
          </Button>
          <Button onClick={next} loading={status === "loading"} disabled={!canNext && step !== 3 && step !== 4} arrow type="button">
            {step === STEPS.length - 1 ? "Submit Assessment" : "Continue"}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

/* ─────────────────────────── shared success card ─────────────────────────── */

function SuccessCard({ name, email, what }: { name: string; email: string; what: string }) {
  return (
    <div className="bg-white hairline-light clip-corner p-8 sm:p-10 text-center">
      <span className="inline-flex w-16 h-16 clip-corner bg-signal/15 text-signal items-center justify-center"><IconCheck size={30} /></span>
      <h2 className="font-display font-bold text-ink-900 text-[clamp(1.5rem,3vw,2.2rem)] tracking-tight mt-5">
        Your {what} has been submitted.
      </h2>
      <p className="text-ink-500 mt-3 leading-relaxed max-w-md mx-auto">
        Thanks, {name.split(" ")[0]} — it's safely stored and a real person reviews every submission.
        Your details are safely stored and a real engineer reviews every submission. We'll reply to <strong className="text-ink-800">{email}</strong> as soon as it's read.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Button to="/" variant="light">Back to Home</Button>
        {contactReady && <Button href={waLink("Hi ITCYBER — I just submitted my enquiry on the website.") ?? undefined} variant="ghost">Continue on WhatsApp</Button>}
      </div>
    </div>
  );
}

/* ─────────────────────────────── FAQ ─────────────────────────────── */

const FAQS = [
  { q: "How quickly can a first automation go live?", a: "Most first workflows — lead response, CRM sync, WhatsApp follow-up — go live within two to four weeks, depending on how many systems we're connecting." },
  { q: "Do we need to change our existing tools?", a: "No. We build around your current CRM, ERP, spreadsheets and communication tools. Replacing systems is a choice you can make later, never a prerequisite." },
  { q: "What does an engagement cost?", a: "It depends on scope: a single workflow costs far less than a full AI agent fleet. After the free consultation you get a fixed, itemized proposal — no hourly surprises." },
  { q: "Who owns the systems you build?", a: "You do. Code, workflows, integrations and documentation are handed over. We offer optional support retainers, but nothing is locked to us." },
  { q: "What happens when an AI agent isn't sure?", a: "It hands off to a human with full context — the conversation, the decision trace and a suggested action. Confidence thresholds and permission boundaries are set by you." },
];

function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section tone="dark" id="faq" className="noise scroll-mt-20">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div className="relative wrap max-w-4xl">
        <SectionHead
          eyebrow="before the first call"
          title={<>Questions we hear <span className="text-brand-400">every week.</span></>}
        />
        <div className="mt-8 divide-y divide-white/[.07] hairline clip-corner bg-ink-900/60">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4 group" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                  <span className={cn("font-display font-semibold text-[1rem] transition-colors", isOpen ? "text-cyan-ic" : "text-white group-hover:text-cyan-ic")}>{f.q}</span>
                  <span className={cn("w-8 h-8 shrink-0 clip-corner hairline flex items-center justify-center text-cyan-ic transition-transform duration-300", isOpen && "rotate-90 bg-brand-500 border-brand-500 text-white")}>
                    <IconChevron size={13} />
                  </span>
                </button>
                <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                  <div className="overflow-hidden">
                    <p className="px-5 sm:px-6 pb-5 text-[0.9rem] text-ink-200 leading-relaxed max-w-2xl">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Badge tone="dark">No obligation</Badge>
            <span className="text-[0.86rem] text-ink-300">The consultation is a working session — you leave with a prioritized automation map, either way.</span>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
