import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { ContactLeadRow, AssessmentRow, ActivityLogRow, JobRow, CareerApplicationRow } from "../types/db";
import { PageHead, StatCard, TableSkeleton, ErrorState, ABadge } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

interface DashData {
  leads: ContactLeadRow[];
  assessments: AssessmentRow[];
  jobs: JobRow[];
  applications: CareerApplicationRow[];
  services: number;
  agents: number;
  caseStudies: number;
  activity: ActivityLogRow[];
}

const statusTone = (s: string) =>
  s === "won" ? "green" : s === "qualified" ? "blue" : s === "new" ? "amber" : s === "lost" || s === "spam" ? "rose" : "slate";

export default function Dashboard() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    if (!db) {
      setError("Supabase is not configured.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const [leads, assessments, jobs, applications, services, agents, cs, activity] = await Promise.all([
      db.from("contact_leads").select("*").order("created_at", { ascending: false }),
      db.from("automation_assessments").select("*").order("created_at", { ascending: false }),
      db.from("jobs").select("*"),
      db.from("career_applications").select("*").order("created_at", { ascending: false }),
      db.from("services").select("id", { count: "exact", head: true }).eq("published", true),
      db.from("ai_agents").select("id", { count: "exact", head: true }).eq("published", true),
      db.from("case_studies").select("id", { count: "exact", head: true }).eq("published", true),
      db.from("admin_activity_logs").select("*").order("created_at", { ascending: false }).limit(8),
    ]);
    const firstErr = [leads, assessments, jobs, applications, services, agents, cs, activity].find((r) => r.error);
    if (firstErr?.error) setError(firstErr.error.message);
    else
      setData({
        leads: (leads.data ?? []) as ContactLeadRow[],
        assessments: (assessments.data ?? []) as AssessmentRow[],
        jobs: (jobs.data ?? []) as JobRow[],
        applications: (applications.data ?? []) as CareerApplicationRow[],
        services: services.count ?? 0,
        agents: agents.count ?? 0,
        caseStudies: cs.count ?? 0,
        activity: (activity.data ?? []) as ActivityLogRow[],
      });
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading)
    return (
      <div>
        <PageHead title="Dashboard" desc="Live figures from your Supabase database — no sample data." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-slate-200 rounded-lg animate-pulse" />
          ))}
        </div>
        <TableSkeleton cols={4} rows={5} />
      </div>
    );

  if (error || !data) return <ErrorState message={error || "No data"} onRetry={load} />;

  const newLeads = data.leads.filter((l) => l.status === "new").length;
  const qualified = data.leads.filter((l) => l.status === "qualified" || l.status === "proposal" || l.status === "won").length;
  const openJobs = data.jobs.filter((j) => j.published && j.applications_open).length;

  /* leads over last 14 days */
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const key = d.toISOString().slice(0, 10);
    return { key, label: d.getDate(), count: data.leads.filter((l) => l.created_at.slice(0, 10) === key).length };
  });
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  /* funnel */
  const funnel = ["new", "contacted", "qualified", "proposal", "won"].map((s) => ({
    s,
    n: data.leads.filter((l) => l.status === s).length,
  }));
  const maxFunnel = Math.max(1, ...funnel.map((f) => f.n));

  /* sources */
  const srcMap = new Map<string, number>();
  data.leads.forEach((l) => {
    const k = l.utm_source || l.source_page || "direct";
    srcMap.set(k, (srcMap.get(k) ?? 0) + 1);
  });
  const sources = [...srcMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSrc = Math.max(1, ...sources.map(([, n]) => n));

  return (
    <div>
      <PageHead title="Dashboard" desc="Live figures from your Supabase database — no sample data." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="New leads" value={newLeads} hint="awaiting first contact" />
        <StatCard label="Qualified +" value={qualified} hint="qualified / proposal / won" />
        <StatCard label="Assessments" value={data.assessments.length} />
        <StatCard label="Open jobs" value={openJobs} hint={`${data.applications.length} application${data.applications.length === 1 ? "" : "s"} received`} />
        <StatCard label="Published services" value={data.services} />
        <StatCard label="Published agents" value={data.agents} />
        <StatCard label="Published case studies" value={data.caseStudies} />
        <StatCard label="Career applications" value={data.applications.filter((a) => a.status === "new").length} hint="new / unreviewed" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-5">
        {/* leads over time */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-slate-500">Leads · last 14 days</p>
          <div className="flex items-end gap-1 h-28 mt-4" role="img" aria-label="Bar chart of leads per day over the last 14 days">
            {days.map((d) => (
              <div key={d.key} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full bg-blue-500/80 group-hover:bg-blue-600 rounded-t transition-colors" style={{ height: `${Math.max(3, (d.count / maxDay) * 100)}%` }} title={`${d.count} lead(s)`} />
                <span className="text-[0.58rem] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* funnel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-slate-500">Lead status funnel</p>
          <div className="mt-4 space-y-2.5">
            {funnel.map((f) => (
              <div key={f.s}>
                <div className="flex justify-between text-[0.72rem] text-slate-500 mb-1">
                  <span className="capitalize">{f.s}</span>
                  <span className="tabular-nums font-medium text-slate-700">{f.n}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded">
                  <div className="h-full bg-blue-500 rounded transition-all duration-700" style={{ width: `${(f.n / maxFunnel) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* sources */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-slate-500">Lead sources</p>
          {sources.length === 0 ? (
            <p className="text-[0.8rem] text-slate-400 mt-4">No leads yet — sources appear once submissions arrive.</p>
          ) : (
            <div className="mt-4 space-y-2.5">
              {sources.map(([k, n]) => (
                <div key={k}>
                  <div className="flex justify-between text-[0.72rem] text-slate-500 mb-1">
                    <span className="truncate max-w-[12rem] font-mono">{k}</span>
                    <span className="tabular-nums font-medium text-slate-700">{n}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded">
                    <div className="h-full bg-emerald-500 rounded" style={{ width: `${(n / maxSrc) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 mt-5">
        {/* recent leads */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-slate-500">Recent leads</p>
            <Link to="/itcyberadmin/leads" className="text-[0.76rem] font-medium text-blue-600 hover:underline">Open CRM →</Link>
          </div>
          {data.leads.length === 0 ? (
            <p className="text-[0.8rem] text-slate-400 mt-4">No leads yet. Submissions from the public contact form land here in real time.</p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {data.leads.slice(0, 6).map((l) => (
                <li key={l.id} className="py-2.5 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.85rem] font-medium text-slate-800 truncate">{l.full_name} {l.company && <span className="text-slate-400 font-normal">· {l.company}</span>}</p>
                    <p className="text-[0.72rem] text-slate-400 truncate">{l.automation_interest ?? "—"} · {new Date(l.created_at).toLocaleDateString()}</p>
                  </div>
                  <ABadge tone={statusTone(l.status) as "green"}>{l.status}</ABadge>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* activity */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-slate-500">Recent admin activity</p>
          {data.activity.length === 0 ? (
            <p className="text-[0.8rem] text-slate-400 mt-4">Actions taken in the admin panel are logged here automatically.</p>
          ) : (
            <ul className="mt-3 space-y-2.5">
              {data.activity.map((a) => (
                <li key={a.id} className="text-[0.78rem] text-slate-600">
                  <span className="font-medium text-slate-800">{a.action}</span>{" "}
                  <span className="font-mono text-[0.7rem] text-slate-400">{a.entity_type}</span>
                  <span className="block text-[0.68rem] text-slate-400">{new Date(a.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
