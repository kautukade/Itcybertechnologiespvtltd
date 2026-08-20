/** Settings · Users · Audit logs · SEO · Legal · Navigation · Pages */
import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { useAdminTable } from "../lib/cms";
import { logActivity, useAuth, type Role } from "../lib/auth";
import type { SiteSettingsRow, ProfileRow, ActivityLogRow, SeoPageRow, LegalPageRow } from "../types/db";
import { PageHead, ATable, AButton, AInput, ASelect, ATextarea, ACheck, AJsonField, ABadge, FieldRow, toast, ErrorState, AConfirm, type Column } from "./ui";

const db = supabase as unknown as SupabaseClient | null;

/* ─────────────────────────── SETTINGS ─────────────────────────── */

const SETTINGS_FIELDS: { key: keyof SiteSettingsRow; label: string; type?: "textarea"; hint?: string }[] = [
  { key: "company_name", label: "Company name" },
  { key: "legal_name", label: "Legal name" },
  { key: "tagline", label: "Tagline" },
  { key: "description", label: "Meta description", type: "textarea" },
  { key: "email", label: "General email" },
  { key: "sales_email", label: "Sales email" },
  { key: "careers_email", label: "Careers email" },
  { key: "phone", label: "Phone (public display)", hint: "Public phone CTAs stay hidden until this and the WhatsApp number are filled." },
  { key: "whatsapp_number", label: "WhatsApp number (digits, intl format)", hint: "e.g. 919876543210 — the floating WhatsApp button appears only when valid." },
  { key: "address", label: "Address line" },
  { key: "business_hours", label: "Business hours" },
  { key: "logo_url", label: "Logo URL" },
  { key: "logo_dark_url", label: "Dark logo URL" },
  { key: "favicon_url", label: "Favicon URL" },
  { key: "default_og_image", label: "Default OG image URL" },
];

export function SettingsAdmin() {
  const [row, setRow] = useState<SiteSettingsRow | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!db) { setError("Supabase not configured"); setLoading(false); return; }
    const { data, error: e } = await db.from("site_settings").select("*").limit(1).maybeSingle();
    if (e) setError(e.message);
    if (data) {
      setRow(data as SiteSettingsRow);
      const f: Record<string, string> = {};
      SETTINGS_FIELDS.forEach((fd) => { f[fd.key as string] = String((data as Record<string, unknown>)[fd.key] ?? ""); });
      setForm(f);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!db) return;
    setSaving(true);
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v || null]));
    let e: { message: string } | null = null;
    if (row) e = (await db.from("site_settings").update(payload).eq("id", row.id)).error;
    else e = (await db.from("site_settings").insert(payload)).error;
    setSaving(false);
    if (e) { toast(e.message, "err"); return; }
    await logActivity("site settings changed", "site_settings", row?.id);
    toast("Settings saved — live on the public site");
    load();
  };

  if (error) return <ErrorState message={error} onRetry={load} />;

  const incomplete = !/^\d{10,15}$/.test(form.whatsapp_number ?? "") || !(form.email ?? "").trim();

  return (
    <div>
      <PageHead title="Company Settings" desc="These values override the bundled defaults across the public site." actions={<AButton loading={saving} onClick={save}>Save settings</AButton>} />
      {incomplete && (
        <div className="border border-amber-300 bg-amber-50 rounded-lg p-4 mb-5 flex items-start gap-3">
          <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[0.7rem] font-bold flex items-center justify-center shrink-0 mt-0.5">!</span>
          <div>
            <p className="text-[0.86rem] font-semibold text-amber-900">Company contact details incomplete.</p>
            <p className="text-[0.78rem] text-amber-800 mt-0.5">Until a valid email and WhatsApp number are saved here, public phone/WhatsApp CTAs remain hidden. No placeholder contact is ever shown.</p>
          </div>
        </div>
      )}
      {loading ? (
        <div className="h-64 bg-white border border-slate-200 rounded-lg animate-pulse" />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg p-6 grid sm:grid-cols-2 gap-4 max-w-4xl">
          {SETTINGS_FIELDS.map((fd) => (
            <div key={fd.key as string} className={fd.type === "textarea" ? "sm:col-span-2" : ""}>
              <FieldRow label={fd.label} hint={fd.hint}>
                {fd.type === "textarea" ? (
                  <ATextarea value={form[fd.key as string] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [fd.key as string]: e.target.value }))} />
                ) : (
                  <AInput value={form[fd.key as string] ?? ""} onChange={(e) => setForm((f) => ({ ...f, [fd.key as string]: e.target.value }))} />
                )}
              </FieldRow>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── USERS ─────────────────────────── */

const ROLES: Role[] = ["super_admin", "admin", "editor", "sales", "hr"];

export function UsersAdmin() {
  const { rows: raw, loading, error, refresh } = useAdminTable("profiles", "created_at");
  const users = raw as unknown as ProfileRow[];
  const { profile: me } = useAuth();
  const [busyId, setBusyId] = useState<string | null>(null);

  const update = async (u: ProfileRow, changes: Partial<ProfileRow>, action: string) => {
    if (!db) return;
    setBusyId(u.id);
    const { error: e } = await db.from("profiles").update(changes).eq("id", u.id);
    setBusyId(null);
    if (e) { toast(e.message, "err"); return; }
    await logActivity(action, "profiles", u.id);
    toast("User updated");
    refresh();
  };

  const columns: Column<ProfileRow>[] = [
    { key: "email", label: "User", render: (u) => <div><p className="font-medium text-slate-900">{u.full_name || u.email}</p><p className="text-[0.72rem] text-slate-400">{u.email}</p></div> },
    {
      key: "role", label: "Role",
      render: (u) =>
        u.id === me?.id ? (
          <ABadge tone="blue">{u.role.replace("_", " ")}</ABadge>
        ) : (
          <ASelect value={u.role} disabled={busyId === u.id} onChange={(e) => update(u, { role: e.target.value as Role }, `role → ${e.target.value}`)} className="w-36 h-8 text-[0.78rem]">
            {ROLES.map((r) => <option key={r} value={r}>{r.replace("_", " ")}</option>)}
          </ASelect>
        ),
    },
    {
      key: "active", label: "Active",
      render: (u) =>
        u.id === me?.id ? (
          <ABadge tone="green">you</ABadge>
        ) : (
          <button onClick={() => update(u, { active: !u.active }, u.active ? "user deactivated" : "user activated")} className="focus-visible:outline-2 focus-visible:outline-blue-600 rounded">
            <ABadge tone={u.active ? "green" : "rose"}>{u.active ? "active" : "inactive"}</ABadge>
          </button>
        ),
    },
    { key: "created_at", label: "Created", render: (u) => <span className="text-[0.76rem] text-slate-500">{new Date(u.created_at).toLocaleDateString()}</span> },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="Users & Roles" desc="Create users in Supabase Auth, then activate them and assign roles here. RLS enforces these roles server-side." />
      <ATable columns={columns} rows={users} loading={loading} empty={<p className="text-[0.86rem] text-slate-500">No users yet.</p>} />
    </div>
  );
}

/* ─────────────────────────── AUDIT ─────────────────────────── */

export function AuditAdmin() {
  const { rows: raw, loading, error, refresh } = useAdminTable("admin_activity_logs", "created_at");
  const logs = raw as unknown as ActivityLogRow[];
  const [expanded, setExpanded] = useState<string | null>(null);

  const columns: Column<ActivityLogRow>[] = [
    { key: "action", label: "Action", render: (l) => <span className="font-medium text-slate-800">{l.action}</span> },
    { key: "entity_type", label: "Entity", render: (l) => <span className="font-mono text-[0.72rem] text-slate-500">{l.entity_type} {l.entity_id ? `· ${l.entity_id.slice(0, 8)}…` : ""}</span> },
    { key: "created_at", label: "When", render: (l) => <span className="text-[0.76rem] text-slate-500">{new Date(l.created_at).toLocaleString()}</span> },
    {
      key: "data", label: "", className: "text-right",
      render: (l) =>
        l.new_data || l.old_data ? (
          <AButton size="sm" variant="ghost" onClick={() => setExpanded(expanded === l.id ? null : l.id)}>{expanded === l.id ? "Hide" : "Payload"}</AButton>
        ) : (
          <span className="text-[0.72rem] text-slate-300">—</span>
        ),
    },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="Audit Logs" desc="Every meaningful admin action, written automatically." />
      <ATable columns={columns} rows={logs} loading={loading} empty={<p className="text-[0.86rem] text-slate-500">No activity recorded yet.</p>} />
      {expanded && (
        <pre className="mt-4 bg-slate-900 text-slate-100 rounded-lg p-4 text-[0.72rem] font-mono overflow-x-auto">
          {JSON.stringify(logs.find((l) => l.id === expanded)?.new_data ?? logs.find((l) => l.id === expanded)?.old_data, null, 2)}
        </pre>
      )}
    </div>
  );
}

/* ─────────────────────────── SEO ─────────────────────────── */

export function SeoAdmin() {
  const { rows: raw, loading, error, refresh } = useAdminTable("seo_pages", "route");
  const rows = raw as unknown as SeoPageRow[];
  const [editing, setEditing] = useState<SeoPageRow | "new" | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const blank = { route: "", title: "", description: "", keywords: "", canonical: "", og_title: "", og_description: "", og_image: "", robots: "index, follow", schema: "{}" };

  const open = (r: SeoPageRow | "new") => {
    setEditing(r);
    setForm(r === "new" ? { ...blank } : {
      route: r.route, title: r.title ?? "", description: r.description ?? "", keywords: r.keywords ?? "",
      canonical: r.canonical ?? "", og_title: r.og_title ?? "", og_description: r.og_description ?? "",
      og_image: r.og_image ?? "", robots: r.robots ?? "index, follow",
      schema: JSON.stringify(r.schema_json ?? {}, null, 2),
    });
  };

  const save = async () => {
    if (!db || !editing) return;
    let schema: unknown;
    try { schema = JSON.parse(form.schema || "{}"); } catch { toast("Invalid schema JSON", "err"); return; }
    if (!form.route.startsWith("/")) { toast("Route must start with /", "err"); return; }
    const payload = {
      route: form.route, title: form.title || null, description: form.description || null,
      keywords: form.keywords || null, canonical: form.canonical || null, og_title: form.og_title || null,
      og_description: form.og_description || null, og_image: form.og_image || null, robots: form.robots || null,
      schema_json: schema,
    };
    setSaving(true);
    const r = editing === "new" ? await db.from("seo_pages").insert(payload) : await db.from("seo_pages").update(payload).eq("id", (editing as SeoPageRow).id);
    setSaving(false);
    if (r.error) { toast(r.error.message, "err"); return; }
    await logActivity(`seo page ${editing === "new" ? "created" : "updated"}`, "seo_pages", form.route);
    toast("SEO saved");
    setEditing(null);
    refresh();
  };

  const columns: Column<SeoPageRow>[] = [
    { key: "route", label: "Route", render: (r) => <span className="font-mono text-[0.78rem] text-blue-700">{r.route}</span> },
    { key: "title", label: "Title", render: (r) => r.title ?? <span className="text-slate-400">default</span> },
    { key: "robots", label: "Robots", render: (r) => <ABadge>{r.robots ?? "index, follow"}</ABadge> },
    { key: "act", label: "", className: "text-right", render: (r) => <AButton size="sm" variant="ghost" onClick={() => open(r)}>Edit</AButton> },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="SEO Pages" desc="Override title, description, canonical, OG tags and schema per route. Unlisted routes use their code defaults." actions={<AButton onClick={() => open("new")}>+ Route override</AButton>} />
      <ATable columns={columns} rows={rows} loading={loading} onRowClick={open} empty={<p className="text-[0.86rem] text-slate-500">No overrides — every route uses its code default meta.</p>} />

      {editing && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6 max-h-[85vh] overflow-y-auto">
            <h3 className="font-semibold text-slate-900 mb-4">{editing === "new" ? "New route override" : `Edit ${form.route}`}</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <FieldRow label="Route"><AInput value={form.route} onChange={(e) => setForm((f) => ({ ...f, route: e.target.value }))} placeholder="/services" /></FieldRow>
              <FieldRow label="Robots"><AInput value={form.robots} onChange={(e) => setForm((f) => ({ ...f, robots: e.target.value }))} /></FieldRow>
              <div className="sm:col-span-2"><FieldRow label="Title"><AInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></FieldRow></div>
              <div className="sm:col-span-2"><FieldRow label="Description"><ATextarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></FieldRow></div>
              <FieldRow label="Keywords"><AInput value={form.keywords} onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} /></FieldRow>
              <FieldRow label="Canonical URL"><AInput value={form.canonical} onChange={(e) => setForm((f) => ({ ...f, canonical: e.target.value }))} /></FieldRow>
              <FieldRow label="OG title"><AInput value={form.og_title} onChange={(e) => setForm((f) => ({ ...f, og_title: e.target.value }))} /></FieldRow>
              <FieldRow label="OG image URL"><AInput value={form.og_image} onChange={(e) => setForm((f) => ({ ...f, og_image: e.target.value }))} /></FieldRow>
              <div className="sm:col-span-2">
                <AJsonField label="Schema.org JSON-LD" rows={4} value={form.schema} onValue={(v) => setForm((f) => ({ ...f, schema: v }))} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <AButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AButton>
              <AButton loading={saving} onClick={save}>Save</AButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── LEGAL ─────────────────────────── */

export function LegalAdmin() {
  const { rows: raw, loading, error, refresh } = useAdminTable("legal_pages", "slug");
  const rows = raw as unknown as LegalPageRow[];
  const [editing, setEditing] = useState<LegalPageRow | "new" | null>(null);
  const [form, setForm] = useState({ slug: "", title: "", body: "" });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!db || !editing) return;
    const payload = { slug: form.slug, title: form.title, body: form.body || null };
    setSaving(true);
    const r = editing === "new" ? await db.from("legal_pages").insert(payload) : await db.from("legal_pages").update(payload).eq("id", (editing as LegalPageRow).id);
    setSaving(false);
    if (r.error) { toast(r.error.message, "err"); return; }
    await logActivity(`legal page saved`, "legal_pages", form.slug);
    toast("Saved"); setEditing(null); refresh();
  };

  const columns: Column<LegalPageRow>[] = [
    { key: "slug", label: "Slug", render: (r) => <span className="font-mono text-[0.78rem]">/{r.slug}</span> },
    { key: "title", label: "Title", render: (r) => r.title },
    { key: "updated_at", label: "Updated", render: (r) => <span className="text-[0.76rem] text-slate-500">{new Date(r.updated_at).toLocaleDateString()}</span> },
    { key: "act", label: "", className: "text-right", render: (r) => <AButton size="sm" variant="ghost" onClick={() => { setEditing(r); setForm({ slug: r.slug, title: r.title, body: r.body ?? "" }); }}>Edit</AButton> },
  ];

  if (error) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div>
      <PageHead title="Legal Pages" desc="DB versions override the bundled policies when present." actions={<AButton onClick={() => { setEditing("new"); setForm({ slug: "", title: "", body: "" }); }}>+ Page</AButton>} />
      <ATable columns={columns} rows={rows} loading={loading} empty={<p className="text-[0.86rem] text-slate-500">Using bundled legal copy — create a page here to override it.</p>} />
      {editing && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <FieldRow label="Slug"><AInput value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="privacy-policy" /></FieldRow>
              <FieldRow label="Title"><AInput value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} /></FieldRow>
              <div className="sm:col-span-2"><FieldRow label="Body (markdown)"><ATextarea rows={10} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} /></FieldRow></div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <AButton variant="ghost" onClick={() => setEditing(null)}>Cancel</AButton>
              <AButton loading={saving} onClick={save}>Save</AButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── NAV / PAGES (settings JSON) ─────────────────────────── */

function JsonSettingsEditor({ title, desc, field, placeholder, keysHelp }: { title: string; desc: string; field: "navigation" | "homepage"; placeholder: string; keysHelp: string[] }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rowId, setRowId] = useState<string | null>(null);

  const load = async () => {
    if (!db) { setLoading(false); return; }
    const { data } = await db.from("site_settings").select("*").limit(1).maybeSingle();
    if (data) {
      setRowId(data.id);
      setValue(JSON.stringify((data as Record<string, unknown>)[field] ?? {}, null, 2));
    } else setValue("{}");
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!db) return;
    let parsed: unknown;
    try { parsed = JSON.parse(value || "{}"); } catch { toast("Invalid JSON", "err"); return; }
    setSaving(true);
    const r = rowId
      ? await db.from("site_settings").update({ [field]: parsed }).eq("id", rowId)
      : await db.from("site_settings").insert({ [field]: parsed });
    setSaving(false);
    if (r.error) { toast(r.error.message, "err"); return; }
    await logActivity(`${field} settings changed`, "site_settings", rowId ?? undefined);
    toast("Saved — live on the public site");
    load();
  };

  return (
    <div>
      <PageHead title={title} desc={desc} actions={<AButton loading={saving} onClick={save}>Save</AButton>} />
      <div className="max-w-3xl">
        {loading ? (
          <div className="h-64 bg-white border border-slate-200 rounded-lg animate-pulse" />
        ) : (
          <>
            <AJsonField rows={14} value={value} onValue={setValue} />
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-[0.72rem] font-semibold uppercase tracking-wider text-slate-500 mb-2">Recognised keys</p>
              <ul className="space-y-1">
                {keysHelp.map((k) => <li key={k} className="font-mono text-[0.74rem] text-slate-600">{k}</li>)}
              </ul>
            </div>
            <p className="text-[0.74rem] text-slate-400 mt-3">Start from: <code className="font-mono">{placeholder}</code></p>
          </>
        )}
      </div>
    </div>
  );
}

export function NavAdmin() {
  return (
    <JsonSettingsEditor
      title="Navigation"
      desc="The announcement strip and footer/resource links read from this JSON when set."
      field="navigation"
      placeholder='{"announcement": {"show": true, "text": "…", "cta": "…", "to": "/ai-agents"}}'
      keysHelp={["announcement.show (boolean)", "announcement.text (string)", "announcement.cta (string)", "announcement.to (route)"]}
    />
  );
}

export function PagesAdmin() {
  return (
    <JsonSettingsEditor
      title="Homepage Content"
      desc="Override the hero sub-copy and primary CTA label on the homepage."
      field="homepage"
      placeholder='{"sub": "ITCYBER designs and deploys custom AI agents…", "cta": "Book Free AI Consultation"}'
      keysHelp={["sub (hero paragraph — plain text)", "cta (primary hero button label)"]}
    />
  );
}
