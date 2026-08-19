import { useMemo, useState } from "react";
import { Reveal, Scramble } from "../lib/motion";
import { cn } from "../lib/utils";
import { jobs, type Job } from "../data/content";
import { site } from "../data/site";
import { Button, Section, SectionHead, CtaBand, Field, TextInput, TextArea, Select, Tabs } from "../components/ui";
import { IconArrow, IconCheck, IconChevron, IconClock, IconPin, IconMail } from "../components/icons";
import { submitLead, isEmail, isPhone } from "../lib/leads";

const whyJoin = [
  { t: "Ship systems that run companies", d: "Your work answers real leads, books real appointments and moves real revenue — visible from day one." },
  { t: "Full-stack AI, not slide AI", d: "Agents, automations, integrations and software in one team. You'll learn the entire discipline." },
  { t: "Small team, real ownership", d: "No ticket-churning. You own the workflow from discovery call to production monitoring." },
  { t: "Honest engineering culture", d: "We scope truthfully, document everything and ship weekly. Craft is rewarded, theatre isn't." },
];

export default function Careers() {
  const [team, setTeam] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(jobs[0].id);
  const [applyingFor, setApplyingFor] = useState<Job | null>(null);

  const filtered = useMemo(() => jobs.filter((j) => team === "All" || j.team === team), [team]);

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 70% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal>
            <p className="eyebrow text-cyan-ic flex items-center gap-3">
              <span className="h-px w-8 bg-cyan-ic/60" aria-hidden />
              <Scramble text={`CAREERS // ${jobs.length} OPEN ROLES`} />
            </p>
          </Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">
            Build the systems that <span className="text-brand-400">run businesses.</span>
          </h1>
          <Reveal delay={0.2}>
            <p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">
              ITCYBER is where AI stops being a demo and starts being infrastructure. If you want your work measured in
              hours given back and revenue unblocked — not pull requests merged — you'll fit in.
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#roles" className="inline-flex items-center gap-2 bg-brand-500 text-white font-display font-semibold px-6 h-11 clip-corner hover:bg-brand-400 transition-colors">
                View Open Roles <IconArrow size={15} />
              </a>
              <Button href={`mailto:${site.contact.careersEmail}`} variant="ghost">Email {site.contact.careersEmail}</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHead tone="paper" eyebrow="why ITCYBER" title={<>Work that <span className="text-brand-600">compounds.</span></>} />
            <div className="mt-7 space-y-3">
              {whyJoin.map((w, i) => (
                <Reveal key={w.t} delay={i * 0.06}>
                  <div className="bg-white hairline-light clip-corner p-5 hover:-translate-y-0.5 transition-transform duration-300">
                    <p className="font-display font-bold text-ink-900 text-[1.02rem]">{w.t}</p>
                    <p className="text-[0.86rem] text-ink-500 mt-1.5 leading-relaxed">{w.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal delay={0.15}>
            <div className="relative bg-ink-900 hairline clip-corner p-6 overflow-hidden lg:sticky lg:top-28">
              <div className="absolute inset-0 grid-bg opacity-50" aria-hidden />
              <p className="relative font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic">what we build, weekly</p>
              <ul className="relative mt-4 space-y-3 font-mono text-[0.74rem]">
                {[
                  ["agents", "AI workers qualifying leads, resolving tickets, booking calendars"],
                  ["automations", "WhatsApp, CRM, billing and reporting flows in production"],
                  ["integrations", "Tally, Zoho, Shopify, shipping APIs, Google Workspace"],
                  ["software", "dashboards, portals and AI-enabled apps for clients"],
                ].map(([k, v]) => (
                  <li key={k} className="flex gap-3">
                    <span className="text-signal shrink-0">▸ {k}</span>
                    <span className="text-ink-300">{v}</span>
                  </li>
                ))}
              </ul>
              <p className="relative mt-6 pt-4 border-t border-white/[.08] text-[0.86rem] text-ink-200 leading-relaxed">
                Culture in one line: <span className="text-white font-semibold">ship on Friday, review on Monday, own it forever.</span>{" "}
                Remote-friendly across India, with hybrid options where clients need us on-site.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* roles */}
      <Section tone="dark" id="roles" className="noise scroll-mt-20">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHead eyebrow="open roles" title={<>Find your <span className="text-brand-400">workflow.</span></>} />
            <Reveal delay={0.1}>
              <Tabs tabs={[{ id: "All", label: "All" }, { id: "Engineering", label: "Engineering" }, { id: "Automation", label: "Automation" }, { id: "Business", label: "Business" }]} active={team} onChange={setTeam} />
            </Reveal>
          </div>
          <div className="mt-10 space-y-3">
            {filtered.map((j) => {
              const open = expanded === j.id;
              return (
                <Reveal key={j.id} delay={0.04}>
                  <article className={cn("bg-ink-850/80 hairline clip-corner transition-all duration-400 overflow-hidden", open && "bg-ink-850")}>
                    <button className="w-full text-left p-5 sm:p-6 group" onClick={() => setExpanded(open ? null : j.id)} aria-expanded={open}>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <div className="flex-1 min-w-[14rem]">
                          <h3 className="font-display font-bold text-white text-[1.2rem] tracking-tight group-hover:text-cyan-ic transition-colors">{j.title}</h3>
                          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-ink-400">
                            <span className="text-brand-300">{j.team}</span>
                            <span className="inline-flex items-center gap-1.5"><IconPin size={12} /> {j.location}</span>
                            <span className="inline-flex items-center gap-1.5"><IconClock size={12} /> {j.type}</span>
                            <span>{j.experience}</span>
                          </p>
                        </div>
                        <span className={cn("w-9 h-9 shrink-0 clip-corner hairline flex items-center justify-center text-cyan-ic transition-transform duration-300", open && "rotate-90 bg-brand-500 border-brand-500 text-white")}>
                          <IconChevron size={14} />
                        </span>
                      </div>
                    </button>
                    <div className={cn("grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(.16,1,.3,1)]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-6 grid lg:grid-cols-[1fr_1fr_auto] gap-8">
                          <div>
                            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic mb-2">the role</p>
                            <p className="text-[0.9rem] text-ink-200 leading-relaxed">{j.about}</p>
                            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic mt-5 mb-2">you'll own</p>
                            <ul className="space-y-1.5">
                              {j.responsibilities.map((r) => (
                                <li key={r} className="flex items-start gap-2 text-[0.85rem] text-ink-200"><IconCheck size={13} className="text-signal mt-1 shrink-0" />{r}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-cyan-ic mb-2">we're looking for</p>
                            <ul className="space-y-1.5">
                              {j.requirements.map((r) => (
                                <li key={r} className="flex items-start gap-2 text-[0.85rem] text-ink-200"><span className="mt-2 w-1 h-1 bg-brand-400 rounded-full shrink-0" aria-hidden />{r}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="lg:w-44 flex lg:flex-col gap-3 lg:justify-start">
                            <Button size="md" onClick={() => { setApplyingFor(j); document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" }); }} arrow>Apply</Button>
                            <Button size="md" variant="ghost" href={`mailto:${site.contact.careersEmail}?subject=Application: ${j.title}`}>Refer someone</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Section>

      <ApplicationForm role={applyingFor} onRoleChange={setApplyingFor} />
    </>
  );
}

/* ------------------------------ application form ------------------------------ */

function ApplicationForm({ role, onRoleChange }: { role: Job | null; onRoleChange: (j: Job) => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", role: jobs[0].id, experience: "", linkedin: "", portfolio: "", resumeName: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Please enter your full name";
    if (!isEmail(form.email)) errs.email = "Enter a valid email address";
    if (!isPhone(form.phone)) errs.phone = "Enter a valid phone number";
    if (!form.location.trim()) errs.location = "Where are you based?";
    if (!form.experience.trim()) errs.experience = "A line about your experience helps";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("loading");
    try {
      await submitLead({ kind: "career", payload: { ...form, roleTitle: jobs.find((j) => j.id === form.role)?.title }, submittedAt: new Date().toISOString(), source: "itcyber.in" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success")
    return (
      <Section tone="paper" id="apply">
        <div className="wrap max-w-2xl text-center">
          <Reveal>
            <span className="inline-flex w-16 h-16 clip-corner bg-signal/15 text-signal items-center justify-center"><IconCheck size={30} /></span>
            <h2 className="font-display font-bold text-ink-900 text-[clamp(1.6rem,3vw,2.4rem)] tracking-tight mt-5">Application received.</h2>
            <p className="text-ink-500 mt-3 leading-relaxed">
              Thanks, {form.name.split(" ")[0]} — our team reviews every application personally.
              Expect a reply at <strong className="text-ink-800">{form.email}</strong> within three working days.
            </p>
            <Button to="/careers" variant="light" className="mt-7" onClick={() => { setStatus("idle"); setForm({ name: "", email: "", phone: "", location: "", role: jobs[0].id, experience: "", linkedin: "", portfolio: "", resumeName: "", message: "" }); }}>
              View more roles
            </Button>
          </Reveal>
        </div>
      </Section>
    );

  return (
    <Section tone="paper" id="apply" className="scroll-mt-20">
      <div className="wrap grid lg:grid-cols-[1fr_1.6fr] gap-12">
        <div className="lg:sticky lg:top-28 self-start">
          <SectionHead
            tone="paper"
            eyebrow="apply"
            title={<>Tell us what you've <span className="text-brand-600">built.</span></>}
            lead="Portfolios and tinkering beat resumes. Link anything real — a workflow, an app, a GitHub, a Notion doc."
          />
          <Reveal delay={0.15}>
            <p className="mt-6 flex items-center gap-2.5 text-[0.86rem] text-ink-500">
              <IconMail size={15} className="text-brand-600" /> Prefer email? Write to <a className="text-brand-600 underline underline-offset-4" href={`mailto:${site.contact.careersEmail}`}>{site.contact.careersEmail}</a>
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <form onSubmit={submit} noValidate className="bg-white hairline-light clip-corner p-6 sm:p-8 grid sm:grid-cols-2 gap-5">
            <Field label="Full name *" name="c-name" tone="paper" error={errors.name}>
              <TextInput id="c-name" tone="paper" error={!!errors.name} value={form.name} onChange={set("name")} placeholder="Your name" autoComplete="name" />
            </Field>
            <Field label="Email *" name="c-email" tone="paper" error={errors.email}>
              <TextInput id="c-email" type="email" tone="paper" error={!!errors.email} value={form.email} onChange={set("email")} placeholder="you@example.com" autoComplete="email" />
            </Field>
            <Field label="Phone *" name="c-phone" tone="paper" error={errors.phone}>
              <TextInput id="c-phone" type="tel" tone="paper" error={!!errors.phone} value={form.phone} onChange={set("phone")} placeholder="+91…" autoComplete="tel" />
            </Field>
            <Field label="Location *" name="c-loc" tone="paper" error={errors.location}>
              <TextInput id="c-loc" tone="paper" error={!!errors.location} value={form.location} onChange={set("location")} placeholder="City, India" />
            </Field>
            <Field label="Role *" name="c-role" tone="paper">
              <Select id="c-role" tone="paper" value={role?.id ?? form.role} onChange={(e) => { set("role")(e); onRoleChange(jobs.find((j) => j.id === e.target.value) ?? jobs[0]); }}>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
              </Select>
            </Field>
            <Field label="Experience *" name="c-exp" tone="paper" error={errors.experience}>
              <TextInput id="c-exp" tone="paper" error={!!errors.experience} value={form.experience} onChange={set("experience")} placeholder="e.g. 3 years in automation" />
            </Field>
            <Field label="LinkedIn" name="c-li" tone="paper">
              <TextInput id="c-li" type="url" tone="paper" value={form.linkedin} onChange={set("linkedin")} placeholder="linkedin.com/in/you" />
            </Field>
            <Field label="Portfolio / GitHub" name="c-portfolio" tone="paper">
              <TextInput id="c-portfolio" type="url" tone="paper" value={form.portfolio} onChange={set("portfolio")} placeholder="Anything you've built" />
            </Field>
            <Field label="Resume" name="c-resume" tone="paper" hint="Upload becomes active once the careers backend is connected — for now, link it in your message or portfolio.">
              <label className="flex items-center justify-between w-full h-12 px-4 bg-white hairline-light clip-corner cursor-pointer hover:bg-paper transition-colors text-[0.86rem] text-ink-500">
                <span className="truncate">{form.resumeName || "Attach PDF (optional)"}</span>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-brand-600 shrink-0">browse</span>
                <input type="file" accept=".pdf,.doc,.docx" className="sr-only" onChange={(e) => setForm((f) => ({ ...f, resumeName: e.target.files?.[0]?.name ?? "" }))} />
              </label>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Message — what have you built or automated?" name="c-msg" tone="paper">
                <TextArea id="c-msg" tone="paper" value={form.message} onChange={set("message")} placeholder="The workflow, tool or project you're proudest of…" />
              </Field>
            </div>
            <div className="sm:col-span-2 flex flex-wrap items-center gap-4">
              <Button type="submit" size="lg" loading={status === "loading"} arrow>Submit Application</Button>
              {status === "error" && <p className="text-[0.82rem] text-rose-ic" role="alert">Something went wrong — please email us directly at {site.contact.careersEmail}.</p>}
            </div>
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
