import { useEffect, useMemo, useState } from "react";
import { Reveal, Scramble } from "../lib/motion";
import { cn } from "../lib/utils";
import { automationAnatomy, automationExample, serviceCategories } from "../data/content";
import { Button, Section, SectionHead, CtaBand, Tabs } from "../components/ui";
import { IconArrow, IconCheck, IconFlow } from "../components/icons";
import { site } from "../data/site";
import WorkflowRunner from "../components/workflows/WorkflowRunner";
import { useCollection } from "../lib/cms";
import type { AutomationRow, Json } from "../types/db";

const staticLibrary = serviceCategories.find((c) => c.id === "automation")!.items;
const STATIC_CAT: Record<string, string> = {
  "Business Process Automation": "Back Office",
  "Lead Capture Automation": "Leads & Sales",
  "CRM Automation": "Leads & Sales",
  "Sales Pipeline Automation": "Leads & Sales",
  "Follow-up Automation": "Leads & Sales",
  "WhatsApp Automation": "Communication",
  "Email Automation": "Communication",
  "Multi-channel Outreach": "Communication",
  "HR Automation": "People & Data",
  "Reporting Automation": "People & Data",
  "Document Automation": "Back Office",
  "Invoice & Billing Automation": "Back Office",
};

const CMS_CAT: Record<string, string> = {
  sales: "Leads & Sales",
  lead: "Leads & Sales",
  marketing: "Leads & Sales",
  support: "Communication",
  appointment: "Communication",
  operations: "Back Office",
  finance: "Back Office",
  hr: "People & Data",
};

function strings(value: Json): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string" && v.trim().length > 0) : [];
}

function workflowSteps(value: Json): string[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry) => {
    if (typeof entry === "string") {
      const text = entry.trim();
      return text ? [text] : [];
    }
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) return [];
    const step = entry as Record<string, Json | undefined>;
    const parts = [step.node, step.action, step.detail]
      .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
      .map((part) => part.trim());
    return parts.length > 0 ? [parts.join(" — ")] : [];
  });
}

type LibraryItem = {
  key: string;
  name: string;
  blurb: string;
  category: string;
  workflow: string[];
  integrations: string[];
};

export default function Automations() {
  const [cat, setCat] = useState("All");
  const { data: liveRows, source } = useCollection("automations", [] as AutomationRow[]);

  const library = useMemo<LibraryItem[]>(() => {
    if (source === "live") {
      return liveRows.map((row) => ({
        key: row.id,
        name: row.name,
        blurb: row.description || "Custom workflow designed around your systems, rules and approval boundaries.",
        category: CMS_CAT[row.category.toLowerCase()] ?? "Back Office",
        workflow: workflowSteps(row.workflow_json),
        integrations: strings(row.integrations_json),
      }));
    }
    return staticLibrary.map((row) => ({
      key: row.name,
      name: row.name,
      blurb: row.blurb,
      category: STATIC_CAT[row.name] ?? "Back Office",
      workflow: [],
      integrations: [],
    }));
  }, [liveRows, source]);

  const cats = useMemo(() => ["All", ...Array.from(new Set(library.map((l) => l.category)))], [library]);
  const filtered = library.filter((l) => cat === "All" || l.category === cat);

  useEffect(() => {
    if (!cats.includes(cat)) setCat("All");
  }, [cat, cats]);

  return (
    <>
      <section className="relative bg-ink-950 text-ink-100 overflow-hidden noise">
        <div className="absolute inset-0 grid-bg" aria-hidden />
        <div className="absolute inset-0" style={{ background: "radial-gradient(50rem 30rem at 20% 0%, rgba(62,123,255,.13), transparent 60%)" }} aria-hidden />
        <div className="relative wrap pt-[clamp(3rem,6vw,5rem)] pb-[clamp(3rem,6vw,5rem)]">
          <Reveal><p className="eyebrow text-cyan-ic flex items-center gap-3"><span className="h-px w-8 bg-cyan-ic/60" aria-hidden /><Scramble text="AUTOMATIONS // WORKFLOWS THAT NEVER SLEEP" /></p></Reveal>
          <h1 className="font-display font-bold text-white tracking-tight mt-5 max-w-3xl text-[clamp(2.1rem,5vw,3.8rem)] leading-[1.05]">Your repetitive work, <span className="text-brand-400">on rails.</span></h1>
          <Reveal delay={0.2}><p className="mt-5 max-w-2xl text-[clamp(1rem,1.5vw,1.15rem)] text-ink-200 leading-relaxed">Every automation we ship has the same anatomy: a trigger, decision logic, AI where judgement is needed, integrations into the tools you already use, and monitoring that pages a human when something drifts.</p></Reveal>
          <Reveal delay={0.3}><ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-7 gap-px bg-white/[.06] hairline clip-corner overflow-hidden">{automationAnatomy.map((a, i) => <li key={a.stage} className="relative bg-ink-900 p-4 group hover:bg-ink-850 transition-colors duration-300"><p className="font-mono text-[0.6rem] text-brand-400">{String(i + 1).padStart(2, "0")}</p><p className="font-display font-bold text-white text-[0.92rem] mt-1">{a.stage}</p><p className="text-[0.72rem] text-ink-300 mt-1.5 leading-snug">{a.text}</p>{i < automationAnatomy.length - 1 && <IconArrow size={12} className="hidden lg:block absolute top-1/2 -right-[7px] -translate-y-1/2 z-10 text-cyan-ic" />}</li>)}</ol></Reveal>
        </div>
      </section>

      <Section tone="paper">
        <div className="wrap">
          <SectionHead tone="paper" eyebrow="one enquiry, zero touches" title={<>Follow a single enquiry through a <span className="text-brand-600">workflow example.</span></>} lead="This illustrates the kind of sequence an automation can coordinate. The actual production steps and permissions are mapped to your systems." />
          <Reveal delay={0.1}><ol className="mt-10 flex flex-wrap items-stretch gap-y-3">{automationExample.map((s, i) => <li key={s} className="flex items-center"><span className={cn("relative font-mono text-[0.74rem] px-4 h-12 inline-flex items-center clip-corner transition-all duration-300 hover:-translate-y-0.5", i === 1 || i === 3 ? "bg-brand-500 text-white shadow-[0_8px_24px_-8px_rgba(62,123,255,.6)]" : "bg-white text-ink-800 hairline-light")}><span className={cn("absolute left-1.5 top-1.5 text-[0.55rem]", i === 1 || i === 3 ? "text-white/70" : "text-brand-600")}>{String(i + 1).padStart(2, "0")}</span>{s}</span>{i < automationExample.length - 1 && <IconArrow size={14} className="mx-1.5 text-brand-500 shrink-0" />}</li>)}</ol></Reveal>
          <Reveal delay={0.15}><p className="mt-4 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ink-400 flex items-center gap-2"><span className="w-2.5 h-2.5 bg-brand-500 inline-block" aria-hidden />AI decision steps — where deterministic templates are not enough</p></Reveal>
        </div>
      </Section>

      <Section tone="dark" className="noise">
        <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
        <div className="relative wrap">
          <div className="flex flex-wrap items-end justify-between gap-4"><SectionHead eyebrow="automation library" title={<>The workflows businesses <span className="text-brand-400">ask for first.</span></>} /><Reveal delay={0.1}><Tabs tabs={cats.map((c) => ({ id: c, label: c }))} active={cat} onChange={setCat} /></Reveal></div>
          {filtered.length > 0 ? (
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((l, i) => <Reveal key={l.key} delay={i * 0.03}><div className="group relative h-full bg-ink-850/80 hairline clip-corner p-5 transition-all duration-400 hover:-translate-y-1 hover:bg-ink-800"><span className="absolute top-0 left-0 w-0 h-[2px] bg-gradient-to-r from-brand-500 to-cyan-ic group-hover:w-full transition-all duration-500" aria-hidden /><p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-cyan-ic">{l.category}</p><h3 className="font-display font-semibold text-white text-[1.05rem] mt-1.5 group-hover:text-cyan-ic transition-colors">{l.name}</h3><p className="text-[0.82rem] text-ink-300 mt-1.5 leading-relaxed">{l.blurb}</p>{l.workflow.length > 0 && <p className="mt-3 text-[0.72rem] text-ink-400">Flow: {l.workflow.slice(0, 4).join(" → ")}</p>}{l.integrations.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{l.integrations.slice(0, 5).map((x) => <span key={x} className="font-mono text-[0.6rem] px-2 py-1 hairline text-ink-300">{x}</span>)}</div>}</div></Reveal>)}
            </div>
          ) : (
            <div className="mt-10 hairline bg-ink-850/70 clip-corner p-7 text-ink-300">
              <p className="font-display font-semibold text-white">No published automation workflows yet.</p>
              <p className="mt-2 text-[0.86rem] leading-relaxed">The library is intentionally empty because the CMS currently has no published entries. Describe your workflow and we can scope it directly.</p>
              <Button to="/contact" variant="ghost" size="sm" className="mt-4">Describe your workflow</Button>
            </div>
          )}
          <Reveal delay={0.1}><p className="mt-6 text-[0.86rem] text-ink-300">Don't see your workflow? Most of what we build is custom. <Button to="/contact" variant="ghost" size="sm" className="ml-2">Describe it to us</Button></p></Reveal>
        </div>
      </Section>

      <Section tone="deeper" className="noise"><div className="absolute inset-0 grid-bg opacity-40" aria-hidden /><div className="relative wrap"><SectionHead eyebrow="run it yourself" title={<>Pick a scenario. Watch it <span className="text-brand-400">execute.</span></>} lead="An interactive demo of the workflow-runner experience; production integrations are connected only after scoping and authorization." /><Reveal delay={0.15}><div className="mt-10"><WorkflowRunner /></div></Reveal></div></Section>

      <Section tone="paper">
        <div className="wrap grid lg:grid-cols-3 gap-4">{[
          { t: "Parallel before replacement", d: "New automations run beside your current process until the team trusts them. No big-bang cutovers." },
          { t: "Monitored like production", d: "Runs are logged and timed with alerts configured so failures surface instead of silently compounding." },
          { t: "Owned by you", d: "Workflows are documented and handed over so you are not dependent on a hidden black box." },
        ].map((g, i) => <Reveal key={g.t} delay={i * 0.08}><div className="h-full bg-white hairline-light clip-corner p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_-20px_rgba(20,32,58,.3)]"><span className="w-9 h-9 clip-corner bg-ink-900 text-cyan-ic flex items-center justify-center"><IconFlow size={17} /></span><h3 className="font-display font-bold text-ink-900 text-[1.15rem] mt-4">{g.t}</h3><p className="text-[0.88rem] text-ink-500 mt-2 leading-relaxed">{g.d}</p></div></Reveal>)}</div>
        <div className="wrap mt-10"><Reveal><ul className="flex flex-wrap gap-x-8 gap-y-2">{["Human approval gates on high-stakes steps", "Documented monitoring and handoff", "WhatsApp automation through official supported APIs"].map((t) => <li key={t} className="flex items-center gap-2 text-[0.86rem] text-ink-600"><IconCheck size={14} className="text-brand-600" />{t}</li>)}</ul></Reveal></div>
      </Section>

      <Section tone="deeper" className="noise"><div className="absolute inset-0 grid-bg opacity-40" aria-hidden /><div className="relative wrap"><Reveal><CtaBand title="Which workflow is eating your team's week?" text="Tell us the one process you'd automate first. We'll map it, identify the dependencies and tell you what should stay human." primaryLabel="Automate This Process" primaryTo="/contact" secondaryLabel={site.cta.assessment} secondaryTo="/contact?mode=assessment" /></Reveal></div></Section>
    </>
  );
}
