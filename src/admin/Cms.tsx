/**
 * Generic content CRUD engine — one component powers the Services, AI Agents,
 * Automations, Industries, Work and Resources admin screens.
 */
import { useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { logActivity } from "../lib/auth";
import type { TableName } from "../types/db";
import { PageHead, ATable, AButton, AInput, ASelect, ATextarea, ACheck, AJsonField, ADrawer, AConfirm, ABadge, FieldRow, toast, ErrorState, type Column } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "check" | "json" | "number";
  options?: string[];
  span?: boolean;
  hint?: string;
}

export interface CmsConfig {
  table: TableName;
  title: string;
  desc: string;
  nameKey: string;
  fields: FieldDef[];
}

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `item-${Date.now()}`;

export const CMS_CONFIGS: Record<string, CmsConfig> = {
  services: {
    table: "services", title: "Services", desc: "Everything under the Services mega menu and the services page.", nameKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text", hint: "Auto-generated from the title on create" },
      { key: "category", label: "Category", type: "select", options: ["agents", "automation", "software", "integrations", "consulting"] },
      { key: "icon", label: "Icon key", type: "text" },
      { key: "short_description", label: "Short description", type: "textarea", span: true },
      { key: "full_description", label: "Full description", type: "textarea", span: true },
      { key: "featured", label: "Featured", type: "check" },
      { key: "published", label: "Published", type: "check" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "seo_title", label: "SEO title", type: "text", span: true },
      { key: "seo_description", label: "SEO description", type: "textarea", span: true },
    ],
  },
  agents: {
    table: "ai_agents", title: "AI Agents", desc: "The roster shown on the AI Agents page.", nameKey: "name",
    fields: [
      { key: "name", label: "Agent name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "role", label: "Role label", type: "text" },
      { key: "description", label: "Description", type: "textarea", span: true },
      { key: "inputs", label: "Inputs", type: "textarea" },
      { key: "actions", label: "Reasoning & actions", type: "textarea" },
      { key: "systems", label: "Systems accessed", type: "textarea" },
      { key: "outputs", label: "Outputs", type: "textarea" },
      { key: "handoff", label: "Human handoff", type: "textarea", span: true },
      { key: "demo_type", label: "Micro-demo type", type: "select", options: ["chat", "score", "queue", "slots", "report", "build"] },
      { key: "featured", label: "Featured", type: "check" },
      { key: "published", label: "Published", type: "check" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  automations: {
    table: "automations", title: "Automations", desc: "Workflow library entries with JSON step definitions.", nameKey: "name",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "category", label: "Category", type: "select", options: ["sales", "support", "operations", "hr", "finance", "marketing"] },
      { key: "description", label: "Description", type: "textarea", span: true },
      { key: "workflow_json", label: "Workflow steps (JSON array)", type: "json", span: true, hint: '[{"node":"CRM","action":"Create record","detail":"…","tone":"action"}]' },
      { key: "integrations_json", label: "Integrations (JSON array)", type: "json", span: true },
      { key: "featured", label: "Featured", type: "check" },
      { key: "published", label: "Published", type: "check" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  industries: {
    table: "industries", title: "Industries", desc: "Each published industry gets a live page at /solutions/<slug>.", nameKey: "name",
    fields: [
      { key: "name", label: "Industry", type: "text" },
      { key: "slug", label: "Slug", type: "text", hint: "URL: /solutions/<slug>" },
      { key: "short_description", label: "Short description", type: "textarea" },
      { key: "hero_description", label: "Hero description", type: "textarea", span: true },
      { key: "challenges_json", label: "Challenges (JSON)", type: "json", span: true },
      { key: "opportunities_json", label: "AI opportunities (JSON)", type: "json", span: true },
      { key: "automations_json", label: "Recommended automations (JSON)", type: "json", span: true },
      { key: "workflow_json", label: "Example workflow (JSON)", type: "json", span: true },
      { key: "integrations_json", label: "Integrations (JSON)", type: "json", span: true },
      { key: "agents_json", label: "Relevant agents (JSON)", type: "json", span: true },
      { key: "faq_json", label: "FAQ (JSON)", type: "json", span: true },
      { key: "published", label: "Published", type: "check" },
      { key: "sort_order", label: "Sort order", type: "number" },
      { key: "seo_title", label: "SEO title", type: "text", span: true },
      { key: "seo_description", label: "SEO description", type: "textarea", span: true },
    ],
  },
  work: {
    table: "case_studies", title: "Work / Case Studies", desc: "Only verified records may use case_type = real. Everything else must stay labelled reference.", nameKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "client_name", label: "Client name", type: "text", hint: "Leave blank until the client approves being named" },
      { key: "industry", label: "Industry", type: "text" },
      { key: "case_type", label: "Type", type: "select", options: ["reference", "real"], hint: "reference = architecture pattern, real = verified client work" },
      { key: "challenge", label: "Challenge", type: "textarea", span: true },
      { key: "previous_process", label: "Previous process", type: "textarea", span: true },
      { key: "solution", label: "Solution", type: "textarea", span: true },
      { key: "architecture_json", label: "Architecture (JSON)", type: "json", span: true },
      { key: "integrations_json", label: "Integrations (JSON)", type: "json", span: true },
      { key: "results_json", label: "Results (JSON)", type: "json", span: true, hint: "Only verified metrics. Unverified → leave empty and the site says so." },
      { key: "testimonial", label: "Client quote", type: "textarea", span: true, hint: "Only when genuinely given" },
      { key: "verified", label: "Verified with client", type: "check" },
      { key: "published", label: "Published", type: "check" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
  resources: {
    table: "resources", title: "Resources", desc: "Playbooks and field notes shown in the resources section.", nameKey: "title",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "text" },
      { key: "kind", label: "Kind", type: "select", options: ["playbook", "guide", "checklist", "article"] },
      { key: "summary", label: "Summary", type: "textarea", span: true },
      { key: "body", label: "Body (markdown)", type: "textarea", span: true },
      { key: "published", label: "Published", type: "check" },
      { key: "sort_order", label: "Sort order", type: "number" },
    ],
  },
};

type FormState = Record<string, string | boolean>;

export function CmsManager({ configKey }: { configKey: string }) {
  const cfg = CMS_CONFIGS[configKey];
  const { rows: rawRows, loading, error, refresh } = useAdminTable(cfg.table, "sort_order");
  const rows = rawRows as unknown as (Record<string, unknown> & { id: string })[];
  const sorted = useMemo(() => [...rows].sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0)), [rows]);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<{ id: string | null; isNew: boolean } | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const visible = sorted.filter((r) => String((r as Record<string, unknown>)[cfg.nameKey] ?? "").toLowerCase().includes(search.toLowerCase()));

  const openNew = () => {
    const blank: FormState = {};
    cfg.fields.forEach((f) => {
      blank[f.key] = f.type === "check" ? false : f.type === "json" ? "[]" : f.type === "number" ? "0" : "";
    });
    setForm(blank);
    setEditing({ id: null, isNew: true });
  };

  const openEdit = (row: Record<string, unknown>) => {
    const f: FormState = {};
    cfg.fields.forEach((fd) => {
      const v = row[fd.key];
      if (fd.type === "check") f[fd.key] = Boolean(v);
      else if (fd.type === "json") f[fd.key] = v == null ? "[]" : JSON.stringify(v, null, 2);
      else f[fd.key] = v == null ? "" : String(v);
    });
    setForm(f);
    setEditing({ id: String(row.id), isNew: false });
  };

  const save = async () => {
    if (!db || !editing) return;
    const payload: Record<string, unknown> = {};
    for (const fd of cfg.fields) {
      const raw = form[fd.key];
      if (fd.type === "check") payload[fd.key] = Boolean(raw);
      else if (fd.type === "number") payload[fd.key] = Number(raw) || 0;
      else if (fd.type === "json") {
        try {
          payload[fd.key] = raw === "" || raw == null ? [] : JSON.parse(String(raw));
        } catch {
          toast(`Invalid JSON in "${fd.label}"`, "err");
          return;
        }
      } else payload[fd.key] = raw === "" ? null : String(raw);
    }
    if (!payload[cfg.nameKey]) {
      toast("A name/title is required", "err");
      return;
    }
    if (!payload.slug) payload.slug = slugify(String(payload[cfg.nameKey]));

    setSaving(true);
    let err: { message: string } | null = null;
    if (editing.isNew) {
      const r = await db.from(cfg.table).insert(payload);
      err = r.error;
    } else {
      const r = await db.from(cfg.table).update(payload).eq("id", editing.id);
      err = r.error;
    }
    setSaving(false);
    if (err) {
      toast(err.message, "err");
      return;
    }
    await logActivity(`${cfg.title.toLowerCase()} ${editing.isNew ? "created" : "updated"}`, cfg.table, editing.id ?? undefined, null, payload as Record<string, import("../types/db").Json>);
    toast(editing.isNew ? "Created" : "Saved");
    setEditing(null);
    refresh();
  };

  const quickPublish = async (row: Record<string, unknown>, published: boolean) => {
    if (!db) return;
    const { error: e } = await db.from(cfg.table).update({ published }).eq("id", row.id);
    if (e) {
      toast(e.message, "err");
      return;
    }
    await logActivity(`${cfg.title.toLowerCase()} ${published ? "published" : "unpublished"}`, cfg.table, String(row.id));
    toast(published ? "Published" : "Unpublished");
    refresh();
  };

  const reorder = async (row: Record<string, unknown>, delta: number) => {
    if (!db) return;
    const next = Number(row.sort_order ?? 0) + delta;
    await db.from(cfg.table).update({ sort_order: next }).eq("id", row.id);
    refresh();
  };

  const remove = async () => {
    if (!db || !deleting) return;
    const { error: e } = await db.from(cfg.table).delete().eq("id", deleting);
    if (e) {
      toast(e.message, "err");
      return;
    }
    await logActivity(`${cfg.title.toLowerCase()} deleted`, cfg.table, deleting);
    toast("Deleted");
    setDeleting(null);
    refresh();
  };

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  const columns: Column<Record<string, unknown> & { id: string }>[] = [
    {
      key: cfg.nameKey, label: "Name",
      render: (r) => (
        <div>
          <p className="font-medium text-slate-900">{String(r[cfg.nameKey] ?? "—")}</p>
          <p className="text-[0.7rem] text-slate-400 font-mono">/{String(r.slug ?? "")}</p>
        </div>
      ),
    },
    ...(cfg.fields.some((f) => f.key === "category")
      ? [{ key: "category", label: "Category", render: (r: Record<string, unknown>) => String(r.category ?? "—") }]
      : []),
    {
      key: "published", label: "Status",
      render: (r) => (
        <button onClick={(e) => { e.stopPropagation(); quickPublish(r, !r.published); }} title="Toggle publish" className="focus-visible:outline-2 focus-visible:outline-blue-600 rounded">
          <ABadge tone={r.published ? "green" : "slate"}>{r.published ? "live" : "draft"}</ABadge>
        </button>
      ),
    },
    {
      key: "sort_order", label: "Order",
      render: (r) => (
        <span className="inline-flex items-center gap-1">
          <button className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 text-[0.7rem]" onClick={(e) => { e.stopPropagation(); reorder(r, -1); }} aria-label="Move up">↑</button>
          <span className="text-[0.74rem] tabular-nums w-5 text-center">{String(r.sort_order ?? 0)}</span>
          <button className="w-6 h-6 rounded border border-slate-200 text-slate-500 hover:bg-slate-100 text-[0.7rem]" onClick={(e) => { e.stopPropagation(); reorder(r, 1); }} aria-label="Move down">↓</button>
        </span>
      ),
    },
    {
      key: "actions", label: "",
      render: (r) => (
        <span className="flex gap-1.5 justify-end">
          <AButton size="sm" variant="ghost" onClick={() => openEdit(r)}>Edit</AButton>
          <AButton size="sm" variant="danger" onClick={() => setDeleting(String(r.id))}>Delete</AButton>
        </span>
      ),
      className: "text-right",
    },
  ];

  return (
    <div>
      <PageHead
        title={cfg.title}
        desc={cfg.desc}
        actions={<AButton onClick={openNew}>+ New</AButton>}
      />
      <div className="mb-4 max-w-sm">
        <AInput placeholder={`Search ${cfg.title.toLowerCase()}…`} value={search} onChange={(e) => setSearch(e.target.value)} aria-label={`Search ${cfg.title}`} />
      </div>

      <ATable
        columns={columns}
        rows={visible}
        loading={loading}
        onRowClick={(r) => openEdit(r)}
        empty={<p className="text-[0.86rem] text-slate-500">Nothing here yet — create the first entry.</p>}
      />

      <ADrawer open={!!editing} onClose={() => setEditing(null)} title={editing?.isNew ? `New ${cfg.title.slice(0, -1).toLowerCase()}` : "Edit entry"} wide>
        <div className="grid sm:grid-cols-2 gap-4">
          {cfg.fields.map((fd) => {
            const val = form[fd.key];
            return (
              <div key={fd.key} className={fd.span ? "sm:col-span-2" : ""}>
                {fd.type === "check" ? (
                  <div className="pt-5">
                    <ACheck label={fd.label} checked={Boolean(val)} onChange={(v) => setForm((f) => ({ ...f, [fd.key]: v }))} />
                  </div>
                ) : fd.type === "json" ? (
                  <AJsonField label={fd.label} rows={6} value={String(val ?? "[]")} onValue={(v) => setForm((f) => ({ ...f, [fd.key]: v }))} />
                ) : fd.type === "select" ? (
                  <FieldRow label={fd.label} hint={fd.hint}>
                    <ASelect value={String(val ?? "")} onChange={(e) => setForm((f) => ({ ...f, [fd.key]: e.target.value }))}>
                      {(fd.options ?? []).map((o) => <option key={o} value={o}>{o}</option>)}
                    </ASelect>
                  </FieldRow>
                ) : fd.type === "textarea" ? (
                  <FieldRow label={fd.label} hint={fd.hint}>
                    <ATextarea value={String(val ?? "")} onChange={(e) => setForm((f) => ({ ...f, [fd.key]: e.target.value }))} />
                  </FieldRow>
                ) : (
                  <FieldRow label={fd.label} hint={fd.hint}>
                    <AInput type={fd.type === "number" ? "number" : "text"} value={String(val ?? "")} onChange={(e) => setForm((f) => ({ ...f, [fd.key]: e.target.value }))} />
                  </FieldRow>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 mt-7 pt-5 border-t border-slate-200">
          <AButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AButton>
          <AButton loading={saving} onClick={save}>{editing?.isNew ? "Create" : "Save changes"}</AButton>
        </div>
      </ADrawer>

      <AConfirm
        open={!!deleting}
        title="Delete this entry?"
        message="This permanently removes it from the database. Published content disappears from the live site immediately."
        loading={false}
        onCancel={() => setDeleting(null)}
        onConfirm={remove}
      />
    </div>
  );
}
