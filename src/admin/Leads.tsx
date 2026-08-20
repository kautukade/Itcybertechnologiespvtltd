import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { logActivity, useAuth } from "../lib/auth";
import type { ContactLeadRow, ProfileRow, LeadNoteRow } from "../types/db";
import { PageHead, ATable, AButton, AInput, ASelect, ADrawer, ABadge, FieldRow, Pagination, toast, ErrorState, AConfirm, type Column } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

const STATUSES = ["new", "contacted", "qualified", "proposal", "won", "lost", "spam"] as const;
const PAGE_SIZE = 10;

const tone = (s: string) =>
  (s === "won" ? "green" : s === "qualified" || s === "proposal" ? "blue" : s === "new" ? "amber" : s === "lost" || s === "spam" ? "rose" : "slate") as "green";

export default function Leads() {
  const { rows, loading, error, refresh } = useAdminTable("contact_leads");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [budget, setBudget] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [openLead, setOpenLead] = useState<ContactLeadRow | null>(null);
  const [users, setUsers] = useState<ProfileRow[]>([]);

  useMemo(() => {
    if (!db) return;
    db.from("profiles").select("*").then(({ data }) => setUsers((data ?? []) as ProfileRow[]));
  }, [loading]);

  const industries = useMemo(() => [...new Set(rows.map((r) => r.industry).filter(Boolean))] as string[], [rows]);
  const budgets = useMemo(() => [...new Set(rows.map((r) => r.budget_range).filter(Boolean))] as string[], [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((l) => {
      if (status !== "all" && l.status !== status) return false;
      if (industry !== "all" && l.industry !== industry) return false;
      if (budget !== "all" && l.budget_range !== budget) return false;
      if (dateFrom && l.created_at.slice(0, 10) < dateFrom) return false;
      if (dateTo && l.created_at.slice(0, 10) > dateTo) return false;
      if (q && ![l.full_name, l.company, l.email, l.phone, l.message].some((v) => v?.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [rows, search, status, industry, budget, dateFrom, dateTo]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const exportCsv = () => {
    const head = ["full_name", "company", "email", "phone", "industry", "company_size", "automation_interest", "budget_range", "status", "source_page", "utm_source", "created_at"];
    const lines = filtered.map((l) =>
      head.map((h) => `"${String((l as unknown as Record<string, unknown>)[h] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const blob = new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `itcyber-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported ${filtered.length} leads`);
  };

  const columns: Column<ContactLeadRow>[] = [
    {
      key: "full_name",
      label: "Lead",
      render: (l) => (
        <div>
          <p className="font-medium text-slate-900">{l.full_name}</p>
          <p className="text-[0.72rem] text-slate-400">{l.company || "—"}</p>
        </div>
      ),
    },
    { key: "email", label: "Contact", render: (l) => <div><p>{l.email}</p><p className="text-[0.72rem] text-slate-400">{l.phone || ""}</p></div> },
    { key: "automation_interest", label: "Interest", render: (l) => l.automation_interest ?? "—" },
    { key: "industry", label: "Industry", render: (l) => l.industry ?? "—" },
    { key: "budget_range", label: "Budget", render: (l) => l.budget_range ?? "—" },
    { key: "status", label: "Status", render: (l) => <ABadge tone={tone(l.status)}>{l.status}</ABadge> },
    { key: "created_at", label: "Created", render: (l) => <span className="text-[0.76rem] text-slate-500">{new Date(l.created_at).toLocaleDateString()}</span> },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead
        title="Leads"
        desc="Every public contact-form submission, stored by the submit-public edge function."
        actions={<AButton variant="ghost" onClick={exportCsv}>Export CSV</AButton>}
      />

      {/* filters */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 mb-4 grid sm:grid-cols-2 lg:grid-cols-6 gap-2">
        <AInput placeholder="Search name, company, email…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} aria-label="Search leads" />
        <ASelect value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </ASelect>
        <ASelect value={industry} onChange={(e) => { setIndustry(e.target.value); setPage(1); }} aria-label="Filter by industry">
          <option value="all">All industries</option>
          {industries.map((s) => <option key={s} value={s}>{s}</option>)}
        </ASelect>
        <ASelect value={budget} onChange={(e) => { setBudget(e.target.value); setPage(1); }} aria-label="Filter by budget">
          <option value="all">All budgets</option>
          {budgets.map((s) => <option key={s} value={s}>{s}</option>)}
        </ASelect>
        <AInput type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }} aria-label="From date" />
        <AInput type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }} aria-label="To date" />
      </div>

      <ATable columns={columns} rows={pageRows} loading={loading} onRowClick={setOpenLead}
        empty={<p className="text-[0.86rem] text-slate-500">No leads match these filters yet.</p>} />
      <Pagination page={page} pages={pages} onPage={setPage} />
      <p className="text-[0.72rem] text-slate-400 mt-2">{filtered.length} lead(s) match · click a row to open the lead</p>

      <LeadDrawer lead={openLead} users={users} onClose={() => setOpenLead(null)} onChanged={() => { refresh(); setOpenLead(null); }} />
    </div>
  );
}

function LeadDrawer({ lead, users, onClose, onChanged }: { lead: ContactLeadRow | null; users: ProfileRow[]; onClose: () => void; onChanged: () => void }) {
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [confirmSpam, setConfirmSpam] = useState(false);
  const [notes, setNotes] = useState<LeadNoteRow[]>([]);

  // Load the per-lead note history whenever a lead is opened
  useEffect(() => {
    let cancelled = false;
    if (!lead || !db) return;
    setNotes([]);
    (async () => {
      const { data } = await db.from("lead_notes").select("*").eq("lead_id", lead.id).order("created_at", { ascending: false });
      if (!cancelled && data) setNotes(data as LeadNoteRow[]);
    })();
    return () => {
      cancelled = true;
    };
  }, [lead?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lead) return <ADrawer open={false} onClose={onClose} title=""><span /></ADrawer>;

  const patch = async (changes: Partial<ContactLeadRow>, action: string) => {
    if (!db) return;
    setSaving(true);
    const { error } = await db.from("contact_leads").update(changes).eq("id", lead.id);
    setSaving(false);
    if (error) {
      toast(error.message, "err");
      return;
    }
    await logActivity(action, "contact_lead", lead.id, null, changes as Record<string, never>);
    toast("Lead updated");
    onChanged();
  };

  const waDigits = (lead.phone ?? "").replace(/[^\d]/g, "");

  return (
    <ADrawer open={!!lead} onClose={onClose} title={`${lead.full_name} — lead`} wide>
      <div className="grid sm:grid-cols-2 gap-4">
        <FieldRow label="Status">
          <ASelect value={lead.status} onChange={(e) => patch({ status: e.target.value as ContactLeadRow["status"] }, `lead status → ${e.target.value}`)} disabled={saving}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </ASelect>
        </FieldRow>
        <FieldRow label="Assigned to">
          <ASelect value={lead.assigned_to ?? ""} onChange={(e) => patch({ assigned_to: e.target.value || null }, "lead reassigned")} disabled={saving}>
            <option value="">Unassigned</option>
            {users.filter((u) => ["sales", "admin", "super_admin"].includes(u.role)).map((u) => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </ASelect>
        </FieldRow>
      </div>

      {/* quick actions */}
      <div className="flex flex-wrap gap-2 mt-4">
        {lead.phone && <AButton variant="ghost" size="sm" onClick={() => window.open(`tel:${lead.phone}`)}>Call {lead.phone}</AButton>}
        <AButton variant="ghost" size="sm" onClick={() => window.open(`mailto:${lead.email}?subject=Re: your automation enquiry — ITCYBER`)}>Email</AButton>
        {waDigits.length >= 10 && <AButton variant="ghost" size="sm" onClick={() => window.open(`https://wa.me/${waDigits}`, "_blank")}>WhatsApp</AButton>}
        {lead.website && <AButton variant="ghost" size="sm" onClick={() => window.open(lead.website!.startsWith("http") ? lead.website! : `https://${lead.website}`, "_blank")}>Website ↗</AButton>}
      </div>

      <dl className="mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-[0.84rem]">
        {([
          ["Company", lead.company], ["Industry", lead.industry], ["Company size", lead.company_size],
          ["Interest", lead.automation_interest], ["Existing tools", lead.existing_tools], ["Budget", lead.budget_range],
          ["Preferred contact", lead.preferred_contact], ["Source page", lead.source_page],
          ["UTM source", lead.utm_source], ["UTM medium", lead.utm_medium], ["UTM campaign", lead.utm_campaign],
          ["Created", new Date(lead.created_at).toLocaleString()],
        ] as const).map(([k, v]) => (
          <div key={k}>
            <dt className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-medium">{k}</dt>
            <dd className="text-slate-700 mt-0.5">{v || "—"}</dd>
          </div>
        ))}
      </dl>

      {lead.message && (
        <div className="mt-5">
          <p className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-medium">Message</p>
          <p className="mt-1.5 text-[0.86rem] text-slate-700 bg-slate-50 border border-slate-200 rounded-md p-3 whitespace-pre-wrap">{lead.message}</p>
        </div>
      )}

      <NoteHistory lead={lead} notes={notes} note={note} setNote={setNote} saving={saving} onSaved={(n) => setNotes((x) => [n, ...x])} />

      <div className="flex gap-2 mt-4">
        <AButton variant="danger" size="sm" onClick={() => setConfirmSpam(true)}>Mark as spam</AButton>
      </div>

      <AConfirm
        open={confirmSpam}
        title="Mark this lead as spam?"
        message="It will move to the spam status. You can change it back any time."
        confirmLabel="Mark spam"
        loading={saving}
        onCancel={() => setConfirmSpam(false)}
        onConfirm={() => { setConfirmSpam(false); patch({ status: "spam" }, "lead marked spam"); }}
      />
    </ADrawer>
  );
}

/** Per-lead note history backed by the `lead_notes` table. */
function NoteHistory({
  lead, notes, note, setNote, saving, onSaved,
}: {
  lead: ContactLeadRow;
  notes: LeadNoteRow[];
  note: string;
  setNote: (v: string) => void;
  saving: boolean;
  onSaved: (n: LeadNoteRow) => void;
}) {
  const { profile } = useAuth();
  const [busy, setBusy] = useState(false);

  const addNote = async () => {
    if (!db || !note.trim()) return;
    setBusy(true);
    const { data, error } = await db
      .from("lead_notes")
      .insert({ lead_id: lead.id, admin_user_id: profile?.id ?? null, note: note.trim() })
      .select()
      .single();
    setBusy(false);
    if (error || !data) {
      toast(error?.message ?? "Could not save the note.", "err");
      return;
    }
    await logActivity("lead note added", "contact_lead", lead.id);
    onSaved(data as LeadNoteRow);
    setNote("");
  };

  return (
    <div className="mt-6">
      <FieldRow label="Add internal note">
        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 text-[0.84rem] focus:outline-2 focus:outline-blue-500" placeholder="Visible to the team only…" />
      </FieldRow>
      <div className="flex gap-2 mt-2">
        <AButton size="sm" disabled={!note.trim() || saving || busy} loading={busy} onClick={addNote}>Save note</AButton>
      </div>
      {notes.length > 0 && (
        <ul className="mt-4 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="text-[0.8rem] text-slate-700 bg-amber-50 border border-amber-200 rounded-md p-3">
              <span className="whitespace-pre-wrap">{n.note}</span>
              <span className="block mt-1.5 text-[0.66rem] text-amber-700">{new Date(n.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
