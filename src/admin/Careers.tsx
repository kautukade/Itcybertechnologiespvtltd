import { useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { logActivity } from "../lib/auth";
import type { JobRow, CareerApplicationRow, Json } from "../types/db";
import { PageHead, ATable, AButton, AInput, ASelect, ATextarea, ACheck, ADrawer, AConfirm, ABadge, FieldRow, Pagination, toast, ErrorState, type Column } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

/* ─────────────────────────── JOBS ─────────────────────────── */

const EMPTY_JOB = {
  title: "", department: "Engineering", location: "Remote (India)", employment_type: "Full-time",
  experience: "", description: "", responsibilities: "[]", requirements: "[]",
  salary_range: "", published: false, applications_open: true, sort_order: 0,
};

export function JobsAdmin() {
  const { rows: raw, loading, error, refresh } = useAdminTable("jobs", "sort_order");
  const rows = raw as unknown as (JobRow & Record<string, unknown>)[];
  const [editing, setEditing] = useState<{ id: string | null; isNew: boolean } | null>(null);
  const [form, setForm] = useState<Record<string, string | boolean | number>>(EMPTY_JOB);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openNew = () => { setForm({ ...EMPTY_JOB }); setEditing({ id: null, isNew: true }); };
  const openEdit = (j: JobRow) => {
    setForm({
      title: j.title, department: j.department, location: j.location, employment_type: j.employment_type,
      experience: j.experience ?? "", description: j.description ?? "",
      responsibilities: JSON.stringify(j.responsibilities_json ?? [], null, 2),
      requirements: JSON.stringify(j.requirements_json ?? [], null, 2),
      salary_range: j.salary_range ?? "", published: j.published, applications_open: j.applications_open,
      sort_order: j.sort_order,
    });
    setEditing({ id: j.id, isNew: false });
  };

  const save = async () => {
    if (!db || !editing) return;
    let resp: Json[]; let req: Json[];
    try {
      resp = JSON.parse(String(form.responsibilities || "[]"));
      req = JSON.parse(String(form.requirements || "[]"));
    } catch { toast("Invalid JSON in responsibilities/requirements", "err"); return; }
    if (!String(form.title).trim()) { toast("Title is required", "err"); return; }
    const payload = {
      title: String(form.title), department: String(form.department), location: String(form.location),
      employment_type: String(form.employment_type), experience: String(form.experience) || null,
      description: String(form.description) || null, responsibilities_json: resp, requirements_json: req,
      salary_range: String(form.salary_range) || null, published: Boolean(form.published),
      applications_open: Boolean(form.applications_open), sort_order: Number(form.sort_order) || 0,
    };
    setSaving(true);
    const r = editing.isNew ? await db.from("jobs").insert(payload) : await db.from("jobs").update(payload).eq("id", editing.id);
    setSaving(false);
    if (r.error) { toast(r.error.message, "err"); return; }
    await logActivity(`job ${editing.isNew ? "created" : "updated"}`, "jobs", editing.id ?? undefined);
    toast(editing.isNew ? "Job created" : "Job saved");
    setEditing(null); refresh();
  };

  const columns: Column<JobRow>[] = [
    { key: "title", label: "Role", render: (j) => <div><p className="font-medium text-slate-900">{j.title}</p><p className="text-[0.7rem] text-slate-400">{j.department} · {j.location}</p></div> },
    { key: "published", label: "Published", render: (j) => <ABadge tone={j.published ? "green" : "slate"}>{j.published ? "live" : "draft"}</ABadge> },
    { key: "applications_open", label: "Applications", render: (j) => <ABadge tone={j.applications_open ? "blue" : "rose"}>{j.applications_open ? "open" : "closed"}</ABadge> },
    {
      key: "act", label: "", className: "text-right",
      render: (j) => (
        <span className="flex gap-1.5 justify-end">
          <AButton size="sm" variant="ghost" onClick={() => openEdit(j)}>Edit</AButton>
          <AButton size="sm" variant="danger" onClick={() => setDeleting(j.id)}>Delete</AButton>
        </span>
      ),
    },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="Jobs" desc="Published + open roles appear on the public careers page with a live count." actions={<AButton onClick={openNew}>+ New role</AButton>} />
      <ATable columns={columns} rows={rows} loading={loading} onRowClick={openEdit} empty={<p className="text-[0.86rem] text-slate-500">No roles yet — the careers page will show zero open positions.</p>} />

      <ADrawer open={!!editing} onClose={() => setEditing(null)} title={editing?.isNew ? "New role" : "Edit role"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldRow label="Title"><AInput value={String(form.title)} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></FieldRow>
          <FieldRow label="Department">
            <ASelect value={String(form.department)} onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}>
              {["Engineering", "Automation", "Business", "Design"].map((d) => <option key={d}>{d}</option>)}
            </ASelect>
          </FieldRow>
          <FieldRow label="Location"><AInput value={String(form.location)} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} /></FieldRow>
          <FieldRow label="Employment type">
            <ASelect value={String(form.employment_type)} onChange={(e) => setForm((f) => ({ ...f, employment_type: e.target.value }))}>
              {["Full-time", "Part-time", "Contract", "Internship"].map((d) => <option key={d}>{d}</option>)}
            </ASelect>
          </FieldRow>
          <FieldRow label="Experience"><AInput value={String(form.experience)} onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))} placeholder="e.g. 2–4 years" /></FieldRow>
          <FieldRow label="Salary range"><AInput value={String(form.salary_range)} onChange={(e) => setForm((f) => ({ ...f, salary_range: e.target.value }))} placeholder="Optional" /></FieldRow>
          <div className="sm:col-span-2">
            <FieldRow label="Description"><ATextarea value={String(form.description)} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></FieldRow>
          </div>
          <div className="sm:col-span-2">
            <FieldRow label="Responsibilities (JSON array of strings)">
              <ATextarea rows={4} className="font-mono text-[0.76rem]" value={String(form.responsibilities)} onChange={(e) => setForm((f) => ({ ...f, responsibilities: e.target.value }))} />
            </FieldRow>
          </div>
          <div className="sm:col-span-2">
            <FieldRow label="Requirements (JSON array of strings)">
              <ATextarea rows={4} className="font-mono text-[0.76rem]" value={String(form.requirements)} onChange={(e) => setForm((f) => ({ ...f, requirements: e.target.value }))} />
            </FieldRow>
          </div>
          <div className="flex items-end gap-6 pb-1">
            <ACheck label="Published" checked={Boolean(form.published)} onChange={(v) => setForm((f) => ({ ...f, published: v }))} />
            <ACheck label="Applications open" checked={Boolean(form.applications_open)} onChange={(v) => setForm((f) => ({ ...f, applications_open: v }))} />
          </div>
          <FieldRow label="Sort order"><AInput type="number" value={String(form.sort_order)} onChange={(e) => setForm((f) => ({ ...f, sort_order: Number(e.target.value) || 0 }))} /></FieldRow>
        </div>
        <div className="flex justify-end gap-2 mt-7 pt-5 border-t border-slate-200">
          <AButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AButton>
          <AButton loading={saving} onClick={save}>{editing?.isNew ? "Create role" : "Save"}</AButton>
        </div>
      </ADrawer>

      <AConfirm open={!!deleting} title="Delete this role?" message="Applications linked to it stay, but the role disappears from the careers page." onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!db || !deleting) return;
          const { error: e } = await db.from("jobs").delete().eq("id", deleting);
          if (e) { toast(e.message, "err"); return; }
          await logActivity("job deleted", "jobs", deleting);
          toast("Role deleted"); setDeleting(null); refresh();
        }} />
    </div>
  );
}

/* ─────────────────────────── APPLICATIONS ─────────────────────────── */

const STAGES = ["new", "screening", "shortlisted", "interview", "selected", "rejected"] as const;

export function ApplicationsAdmin() {
  const { rows: rawApps, loading, error, refresh } = useAdminTable("career_applications");
  const { rows: rawJobs } = useAdminTable("jobs", "sort_order");
  const apps = rawApps as unknown as CareerApplicationRow[];
  const jobs = rawJobs as unknown as JobRow[];

  const [jobFilter, setJobFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<CareerApplicationRow | null>(null);
  const [note, setNote] = useState("");
  const [signing, setSigning] = useState(false);
  const PAGE_SIZE = 10;

  const jobTitle = (id: string | null) => jobs.find((j) => j.id === id)?.title ?? "General";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return apps.filter((a) => {
      if (jobFilter !== "all" && a.job_id !== jobFilter) return false;
      if (stageFilter !== "all" && a.status !== stageFilter) return false;
      if (q && ![a.name, a.email, a.location, a.experience].some((v) => v?.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [apps, jobFilter, stageFilter, search]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const patch = async (id: string, changes: Partial<CareerApplicationRow>, action: string) => {
    if (!db) return;
    const { error: e } = await db.from("career_applications").update(changes).eq("id", id);
    if (e) { toast(e.message, "err"); return; }
    await logActivity(action, "career_application", id);
    toast("Application updated");
    refresh();
    setOpen(null);
  };

  const exportCsv = () => {
    const head = ["name", "email", "phone", "location", "experience", "status", "created_at"];
    const lines = filtered.map((a) => head.map((h) => `"${String((a as unknown as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(","));
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const el = document.createElement("a");
    el.href = URL.createObjectURL(blob);
    el.download = `itcyber-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    el.click();
    URL.revokeObjectURL(el.href);
  };

  const openResume = async (a: CareerApplicationRow) => {
    if (!db || !a.resume_path) return;
    setSigning(true);
    const { data, error: e } = await db.storage.from("career-resumes").createSignedUrl(a.resume_path, 300);
    setSigning(false);
    if (e || !data) { toast(e?.message ?? "Could not sign resume URL", "err"); return; }
    window.open(data.signedUrl, "_blank");
  };

  const columns: Column<CareerApplicationRow>[] = [
    { key: "name", label: "Candidate", render: (a) => <div><p className="font-medium text-slate-900">{a.name}</p><p className="text-[0.72rem] text-slate-400">{a.email}</p></div> },
    { key: "job", label: "Role", render: (a) => jobTitle(a.job_id) },
    { key: "experience", label: "Experience", render: (a) => a.experience ?? "—" },
    { key: "resume", label: "Resume", render: (a) => (a.resume_path ? <ABadge tone="blue">attached</ABadge> : <ABadge>none</ABadge>) },
    { key: "status", label: "Stage", render: (a) => <ABadge tone={a.status === "selected" ? "green" : a.status === "rejected" ? "rose" : a.status === "new" ? "amber" : "blue"}>{a.status}</ABadge> },
    { key: "created_at", label: "Applied", render: (a) => <span className="text-[0.76rem] text-slate-500">{new Date(a.created_at).toLocaleDateString()}</span> },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="Career Applications" desc="Resumes live in the private career-resumes bucket — access via time-limited signed URLs only." actions={<AButton variant="ghost" onClick={exportCsv}>Export CSV</AButton>} />

      <div className="bg-white border border-slate-200 rounded-lg p-3 mb-4 grid sm:grid-cols-3 gap-2">
        <AInput placeholder="Search candidates…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search applications" />
        <ASelect value={jobFilter} onChange={(e) => { setJobFilter(e.target.value); setPage(1); }} aria-label="Filter by role">
          <option value="all">All roles</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </ASelect>
        <ASelect value={stageFilter} onChange={(e) => { setStageFilter(e.target.value); setPage(1); }} aria-label="Filter by stage">
          <option value="all">All stages</option>
          {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
        </ASelect>
      </div>

      <ATable columns={columns} rows={pageRows} loading={loading} onRowClick={(a) => { setOpen(a); setNote(""); }} empty={<p className="text-[0.86rem] text-slate-500">No applications yet.</p>} />
      <Pagination page={page} pages={pages} onPage={setPage} />

      <ADrawer open={!!open} onClose={() => setOpen(null)} title={open ? `${open.name} — ${jobTitle(open.job_id)}` : ""}>
        {open && (
          <div>
            <FieldRow label="Stage">
              <ASelect value={open.status} onChange={(e) => patch(open.id, { status: e.target.value as CareerApplicationRow["status"] }, `application stage → ${e.target.value}`)}>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </ASelect>
            </FieldRow>
            <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.84rem]">
              {([["Email", open.email], ["Phone", open.phone], ["Location", open.location], ["Experience", open.experience], ["Applied", new Date(open.created_at).toLocaleString()]] as const).map(([k, v]) => (
                <div key={k}><dt className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-medium">{k}</dt><dd className="text-slate-700 mt-0.5">{v || "—"}</dd></div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2 mt-5">
              {open.resume_path ? (
                <AButton size="sm" loading={signing} onClick={() => openResume(open)}>Open resume (signed URL · 5 min)</AButton>
              ) : (
                <ABadge>No resume attached</ABadge>
              )}
              {open.linkedin_url && <AButton size="sm" variant="ghost" onClick={() => window.open(open.linkedin_url!, "_blank")}>LinkedIn ↗</AButton>}
              {open.portfolio_url && <AButton size="sm" variant="ghost" onClick={() => window.open(open.portfolio_url!, "_blank")}>Portfolio ↗</AButton>}
              <AButton size="sm" variant="ghost" onClick={() => window.open(`mailto:${open.email}`)}>Email</AButton>
            </div>
            {open.message && (
              <div className="mt-5">
                <p className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-medium">Message</p>
                <p className="mt-1.5 text-[0.86rem] text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-3 whitespace-pre-wrap">{open.message}</p>
              </div>
            )}
            <div className="mt-6">
              <FieldRow label="HR notes">
                <ATextarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Visible to the team only…" />
              </FieldRow>
              <div className="flex gap-2 mt-2">
                <AButton size="sm" disabled={!note.trim()} onClick={() => patch(open.id, { notes: (open.notes ? open.notes + "\n" : "") + `[${new Date().toLocaleString()}] ${note.trim()}` }, "application note added")}>Save note</AButton>
              </div>
              {open.notes && <p className="mt-4 text-[0.8rem] text-slate-600 bg-amber-50 border border-amber-200 rounded-md p-3 whitespace-pre-wrap">{open.notes}</p>}
            </div>
          </div>
        )}
      </ADrawer>
    </div>
  );
}
