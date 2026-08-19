import { useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { logActivity } from "../lib/auth";
import type { AssessmentRow } from "../types/db";
import { PageHead, ATable, ASelect, ADrawer, ABadge, FieldRow, toast, ErrorState, type Column } from "./ui";

const db = supabase as unknown as SupabaseClient | null;
const STATUSES = ["new", "reviewed", "converted", "archived"] as const;

export default function Assessments() {
  const { rows, loading, error, refresh } = useAdminTable("automation_assessments");
  const [open, setOpen] = useState<AssessmentRow | null>(null);

  const columns: Column<AssessmentRow>[] = [
    {
      key: "full_name", label: "Contact",
      render: (a) => (<div><p className="font-medium text-slate-900">{a.full_name}</p><p className="text-[0.72rem] text-slate-400">{a.email}</p></div>),
    },
    { key: "requirement", label: "Needs", render: (a) => a.requirement ?? "—" },
    { key: "industry", label: "Industry", render: (a) => a.industry ?? "—" },
    { key: "budget", label: "Budget", render: (a) => a.budget || "—" },
    { key: "timeline", label: "Timeline", render: (a) => a.timeline || "—" },
    {
      key: "status", label: "Status",
      render: (a) => <ABadge tone={a.status === "converted" ? "green" : a.status === "reviewed" ? "blue" : a.status === "archived" ? "slate" : "amber"}>{a.status}</ABadge>,
    },
    { key: "created_at", label: "Submitted", render: (a) => <span className="text-[0.76rem] text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span> },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="Automation Assessments" desc="Qualified intent from the public multi-step assessment." />
      <ATable columns={columns} rows={rows} loading={loading} onRowClick={setOpen}
        empty={<p className="text-[0.86rem] text-slate-500">No assessments yet — they appear as soon as visitors complete the wizard.</p>} />

      <ADrawer open={!!open} onClose={() => setOpen(null)} title={open ? `${open.full_name} — assessment` : ""}>
        {open && (
          <AssessmentBody
            a={open}
            onStatus={async (status) => {
              if (!db) return;
              const { error: e } = await db.from("automation_assessments").update({ status }).eq("id", open.id);
              if (e) { toast(e.message, "err"); return; }
              await logActivity(`assessment status → ${status}`, "automation_assessment", open.id);
              toast("Assessment updated");
              refresh();
              setOpen(null);
            }}
          />
        )}
      </ADrawer>
    </div>
  );
}

function AssessmentBody({ a, onStatus }: { a: AssessmentRow; onStatus: (s: AssessmentRow["status"]) => void }) {
  return (
    <div>
      <FieldRow label="Status">
        <ASelect value={a.status} onChange={(e) => onStatus(e.target.value as AssessmentRow["status"])}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </ASelect>
      </FieldRow>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.84rem]">
        {([
          ["Company", a.company], ["Email", a.email], ["Phone", a.phone],
          ["Requirement", a.requirement], ["Industry", a.industry],
          ["Existing tools", a.existing_tools], ["Budget", a.budget], ["Timeline", a.timeline],
          ["Submitted", new Date(a.created_at).toLocaleString()],
        ] as const).map(([k, v]) => (
          <div key={k} className={k === "Submitted" ? "col-span-2" : ""}>
            <dt className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-medium">{k}</dt>
            <dd className="text-slate-700 mt-0.5">{v || "—"}</dd>
          </div>
        ))}
      </dl>
      {a.business_problem && (
        <div className="mt-5">
          <p className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-medium">Main problem</p>
          <p className="mt-1.5 text-[0.86rem] text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-3 whitespace-pre-wrap">{a.business_problem}</p>
        </div>
      )}
      <div className="flex gap-2 mt-6">
        <a className="inline-flex items-center h-8 px-3 rounded-md border border-slate-300 text-[0.78rem] font-medium text-slate-700 hover:bg-slate-100" href={`mailto:${a.email}?subject=Your ITCYBER automation assessment`}>Email reply</a>
        {a.phone && <a className="inline-flex items-center h-8 px-3 rounded-md border border-slate-300 text-[0.78rem] font-medium text-slate-700 hover:bg-slate-100" href={`tel:${a.phone}`}>Call</a>}
      </div>
    </div>
  );
}
