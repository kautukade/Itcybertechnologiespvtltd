/** Admin UI kit — clean, professional, fast. No 3D, no theatrics. */
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "../lib/utils";

/* ────────────── buttons ────────────── */
export function AButton({
  children, onClick, variant = "primary", size = "md", loading, disabled, type = "button", className, title,
}: {
  children: ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger" | "dark";
  size?: "sm" | "md"; loading?: boolean; disabled?: boolean; type?: "button" | "submit"; className?: string; title?: string;
}) {
  return (
    <button
      type={type}
      title={title}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
        size === "sm" ? "h-8 px-3 text-[0.78rem]" : "h-9.5 px-4 text-[0.85rem]",
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-500",
        variant === "dark" && "bg-slate-900 text-white hover:bg-slate-700",
        variant === "ghost" && "border border-slate-300 text-slate-700 hover:bg-slate-100",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-500",
        className
      )}
    >
      {loading && <span className="w-3.5 h-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/* ────────────── form fields ────────────── */
const fieldCls =
  "w-full h-9.5 px-3 rounded-md border border-slate-300 bg-white text-[0.86rem] text-slate-800 placeholder:text-slate-400 focus:outline-2 focus:outline-blue-500 focus:border-blue-500";

export function AInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldCls, props.className)} />;
}
export function ASelect(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldCls, "pr-8", props.className)} />;
}
export function ATextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={cn(fieldCls, "h-auto py-2", props.className)} />;
}
export function ACheck({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2.5 text-[0.85rem] text-slate-700 cursor-pointer select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 accent-blue-600" />
      {label}
    </label>
  );
}

/** Textarea that validates JSON on change; exposes parsed value via onValue. */
export function AJsonField({ value, onValue, rows = 5, label }: { value: string; onValue: (json: string) => void; rows?: number; label?: string }) {
  const [err, setErr] = useState<string | null>(null);
  return (
    <div>
      {label && <p className="text-[0.72rem] font-medium text-slate-500 mb-1 uppercase tracking-wide">{label}</p>}
      <textarea
        rows={rows}
        value={value}
        spellCheck={false}
        onChange={(e) => {
          onValue(e.target.value);
          try {
            if (e.target.value.trim()) JSON.parse(e.target.value);
            setErr(null);
          } catch (ex) {
            setErr(ex instanceof Error ? ex.message : "Invalid JSON");
          }
        }}
        className={cn(fieldCls, "h-auto py-2 font-mono text-[0.76rem]", err ? "border-rose-500 focus:outline-rose-500" : "")}
      />
      {err && <p className="text-[0.72rem] text-rose-600 mt-1">Invalid JSON: {err}</p>}
    </div>
  );
}

export function FieldRow({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-[0.72rem] font-medium text-slate-500 mb-1 uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-[0.72rem] text-slate-400 mt-1">{hint}</p>}
    </div>
  );
}

/* ────────────── badges / page head ────────────── */
export function ABadge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "green" | "blue" | "amber" | "rose" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[0.68rem] font-medium uppercase tracking-wide",
        tone === "slate" && "bg-slate-100 text-slate-600",
        tone === "green" && "bg-emerald-50 text-emerald-700",
        tone === "blue" && "bg-blue-50 text-blue-700",
        tone === "amber" && "bg-amber-50 text-amber-700",
        tone === "rose" && "bg-rose-50 text-rose-700"
      )}
    >
      {children}
    </span>
  );
}

export function PageHead({ title, desc, actions }: { title: string; desc?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-[1.45rem] font-semibold tracking-tight text-slate-900">{title}</h1>
        {desc && <p className="text-[0.85rem] text-slate-500 mt-1 max-w-2xl">{desc}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ────────────── table ────────────── */
export interface Column<R> {
  key: string;
  label: string;
  render?: (row: R) => ReactNode;
  className?: string;
}

export function ATable<R extends { id: string }>({
  columns, rows, loading, onRowClick, empty,
}: {
  columns: Column<R>[]; rows: R[]; loading?: boolean; onRowClick?: (row: R) => void; empty?: ReactNode;
}) {
  if (loading) return <TableSkeleton cols={columns.length} />;
  if (rows.length === 0)
    return (
      <div className="border border-dashed border-slate-300 rounded-lg p-10 text-center bg-white">
        {empty ?? <p className="text-[0.86rem] text-slate-500">Nothing here yet.</p>}
      </div>
    );
  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((c) => (
              <th key={c.key} className={cn("px-4 py-2.5 text-[0.68rem] font-semibold uppercase tracking-wider text-slate-500", c.className)}>
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr
              key={r.id}
              onClick={onRowClick ? () => onRowClick(r) : undefined}
              className={cn("border-b border-slate-100 last:border-0", onRowClick && "cursor-pointer hover:bg-blue-50/40 transition-colors")}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn("px-4 py-3 text-[0.84rem] text-slate-700 align-top", c.className)}>
                  {c.render ? c.render(r) : String((r as Record<string, unknown>)[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function TableSkeleton({ cols = 4, rows = 6 }: { cols?: number; rows?: number }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 animate-pulse" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3.5 bg-slate-100 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="border border-rose-200 bg-rose-50 rounded-lg p-6 text-center">
      <p className="text-[0.86rem] text-rose-700 font-medium">Something went wrong</p>
      <p className="text-[0.8rem] text-rose-600 mt-1">{message}</p>
      {onRetry && (
        <AButton variant="ghost" size="sm" onClick={onRetry} className="mt-3">
          Try again
        </AButton>
      )}
    </div>
  );
}

/* ────────────── drawer ────────────── */
export function ADrawer({
  open, onClose, title, children, wide,
}: {
  open: boolean; onClose: () => void; title: ReactNode; children: ReactNode; wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className={cn("fixed inset-0 z-[80]", !open && "pointer-events-none")} aria-hidden={!open}>
      <div className={cn("absolute inset-0 bg-slate-900/50 transition-opacity duration-300", open ? "opacity-100" : "opacity-0")} onClick={onClose} />
      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute right-0 top-0 bottom-0 bg-white shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] overflow-y-auto w-full focus:outline-none",
          wide ? "sm:w-[46rem]" : "sm:w-[30rem]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4 z-10">
          <h2 className="font-semibold text-slate-900 text-[1.02rem]">{title}</h2>
          <button onClick={onClose} aria-label="Close panel" className="w-8 h-8 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ────────────── confirm dialog ────────────── */
export function AConfirm({
  open, title, message, confirmLabel = "Delete", loading, onConfirm, onCancel,
}: {
  open: boolean; title: string; message: string; confirmLabel?: string; loading?: boolean;
  onConfirm: () => void; onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50" onClick={onCancel} />
      <div role="alertdialog" aria-modal="true" aria-label={title} className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full p-6">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-[0.85rem] text-slate-500 mt-2">{message}</p>
        <div className="flex justify-end gap-2 mt-5">
          <AButton variant="ghost" onClick={onCancel}>Cancel</AButton>
          <AButton variant="danger" loading={loading} onClick={onConfirm}>{confirmLabel}</AButton>
        </div>
      </div>
    </div>
  );
}

/* ────────────── toasts ────────────── */
type ToastMsg = { id: number; text: string; tone: "ok" | "err" };
let toastListeners: ((t: ToastMsg) => void)[] = [];

export function toast(text: string, tone: "ok" | "err" = "ok") {
  const m: ToastMsg = { id: Date.now() + Math.random(), text, tone };
  toastListeners.forEach((l) => l(m));
}

export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const l = (t: ToastMsg) => {
      setItems((s) => [...s, t]);
      setTimeout(() => setItems((s) => s.filter((x) => x.id !== t.id)), 3800);
    };
    toastListeners.push(l);
    return () => {
      toastListeners = toastListeners.filter((x) => x !== l);
    };
  }, []);
  return (
    <div className="fixed bottom-4 right-4 z-[95] space-y-2" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={cn("px-4 py-2.5 rounded-md shadow-lg text-[0.82rem] font-medium text-white", t.tone === "ok" ? "bg-slate-900" : "bg-rose-600")}>
          {t.text}
        </div>
      ))}
    </div>
  );
}

/* ────────────── pagination ────────────── */
export function Pagination({ page, pages, onPage }: { page: number; pages: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-[0.76rem] text-slate-500">Page {page} of {pages}</p>
      <div className="flex gap-2">
        <AButton variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</AButton>
        <AButton variant="ghost" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>Next</AButton>
      </div>
    </div>
  );
}

/* ────────────── small stat card ────────────── */
export function StatCard({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4">
      <p className="text-[0.7rem] font-medium uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-[1.7rem] font-semibold text-slate-900 mt-1 tabular-nums leading-none">{value}</p>
      {hint && <p className="text-[0.72rem] text-slate-400 mt-1.5">{hint}</p>}
    </div>
  );
}
