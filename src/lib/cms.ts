/**
 * CMS read layer for the public site.
 *
 * Contract:
 *  - `configured` — Supabase env vars are present (a client could be created).
 *  - `source: "live"` — ONLY after the query actually succeeded. UI may show
 *    "live" badges only in this state.
 *  - `source: "fallback"` — Supabase absent OR the query failed; bundled
 *    static content renders so the site never blanks. `error` retains the
 *    diagnostic message.
 */
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Database, TableName } from "../types/db";
import { site as staticSite, type SiteConfig } from "../data/site";
import { getSiteConfig, setSiteConfig, useSiteConfig } from "./siteSettings";

type Tables = Database["public"]["Tables"];
type RowOf<T extends TableName> = Tables[T]["Row"];

const sb = supabase as unknown as SupabaseClient | null;

const PUBLISHED_TABLES = new Set<string>([
  "services",
  "ai_agents",
  "automations",
  "industries",
  "case_studies",
  "resources",
  "jobs",
  "technologies",
]);

const SORTABLE_TABLES = new Set<string>([...PUBLISHED_TABLES, "social_links"]);

export interface CollectionState<T> {
  data: T[];
  loading: boolean;
  configured: boolean;
  error: string | null;
  source: "live" | "fallback";
  live: boolean;
}

const nonEmpty = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return value !== null && value !== undefined;
};

/**
 * The original bundled Agent/Industry content is richer than the initial DB
 * seed. When a live row intentionally exists, keep its publication semantics
 * but fill only missing descriptive fields from the bundled record with the
 * same slug. This prevents a successful CMS query from turning a complete page
 * into empty cards while still allowing newly-created CMS records to work.
 */
function enrichSparseLiveRows<T extends TableName>(table: T, rows: unknown[], fallback: RowOf<T>[]): RowOf<T>[] {
  if (table === "ai_agents") {
    const staticRows = fallback as unknown as Array<Record<string, unknown>>;
    return rows.map((raw) => {
      const row = { ...(raw as Record<string, unknown>) };
      const fb = staticRows.find((x) => x.id === row.slug || x.slug === row.slug);
      if (!fb) return row as unknown as RowOf<T>;
      for (const key of ["inputs", "actions", "systems", "outputs", "handoff"] as const) {
        if (!nonEmpty(row[key]) && nonEmpty(fb[key])) row[key] = fb[key];
      }
      return row as unknown as RowOf<T>;
    });
  }

  if (table === "industries") {
    const staticRows = fallback as unknown as Array<Record<string, unknown>>;
    return rows.map((raw) => {
      const row = { ...(raw as Record<string, unknown>) };
      const fb = staticRows.find((x) => x.slug === row.slug);
      if (!fb) return row as unknown as RowOf<T>;

      if (!nonEmpty(row.short_description) && nonEmpty(fb.short)) row.short_description = fb.short;
      const mappings: Array<[string, string]> = [
        ["challenges_json", "challenges"],
        ["opportunities_json", "opportunities"],
        ["automations_json", "automations"],
        ["workflow_json", "workflow"],
        ["integrations_json", "integrations"],
        ["agents_json", "agents"],
        ["faq_json", "faq"],
      ];
      for (const [dbKey, staticKey] of mappings) {
        if (!nonEmpty(row[dbKey]) && nonEmpty(fb[staticKey])) row[dbKey] = fb[staticKey];
      }
      return row as unknown as RowOf<T>;
    });
  }

  return rows as RowOf<T>[];
}

export function useCollection<T extends TableName>(
  table: T,
  fallback: RowOf<T>[]
): CollectionState<RowOf<T>> {
  /* Careers are a truth-sensitive exception: bundled demo job records must
     never be presented as real open positions when the backend is missing. */
  const safeFallback = (table === "jobs" ? [] : fallback) as RowOf<T>[];

  const [state, setState] = useState<{
    rows: RowOf<T>[];
    loading: boolean;
    error: string | null;
    source: "live" | "fallback";
  }>({ rows: safeFallback, loading: sb !== null, error: null, source: "fallback" });

  useEffect(() => {
    if (!sb) {
      setState({ rows: safeFallback, loading: false, error: null, source: "fallback" });
      return;
    }
    let cancelled = false;
    (async () => {
      let query = sb.from(table).select("*");
      if (PUBLISHED_TABLES.has(table)) query = query.eq("published", true);
      if (SORTABLE_TABLES.has(table)) query = query.order("sort_order", { ascending: true });
      const { data, error } = await query;
      if (cancelled) return;
      if (error || !data) {
        setState({ rows: safeFallback, loading: false, error: error?.message ?? "No data returned", source: "fallback" });
      } else {
        const liveRows = enrichSparseLiveRows(table, data as unknown[], fallback);
        setState({ rows: liveRows, loading: false, error: null, source: "live" });
      }
    })();
    return () => {
      cancelled = true;
    };
    // `fallback` is static module data at all current call sites; table is the
    // only runtime identity that should trigger a reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  return {
    data: state.rows,
    loading: state.loading,
    configured: sb !== null,
    error: state.error,
    source: state.source,
    live: state.source === "live",
  };
}

/**
 * Site settings merged over static/env defaults (single row in DB).
 * Also pushes the merged config into the runtime store so every component
 * using `useSiteConfig()` re-renders with admin-updated contact details.
 */
export function useSiteSettings(): SiteConfig & { live: boolean; loading: boolean; source: "live" | "fallback" } {
  const [loading, setLoading] = useState(false);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!sb) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const { data, error } = await sb.from("site_settings").select("*").limit(1).maybeSingle();
      if (cancelled) return;
      if (!error && data) {
        const prev = getSiteConfig();
        setSiteConfig({
          ...prev,
          contact: {
            ...prev.contact,
            email: data.email ?? prev.contact.email,
            salesEmail: data.sales_email ?? prev.contact.salesEmail,
            careersEmail: data.careers_email ?? prev.contact.careersEmail,
            whatsappNumber: data.whatsapp_number ?? prev.contact.whatsappNumber,
            phoneDisplay: data.phone ?? prev.contact.phoneDisplay,
            address: data.address ?? prev.contact.address,
            hours: data.business_hours ?? prev.contact.hours,
          },
          tagline: data.tagline ?? prev.tagline,
          description: data.description ?? prev.description,
          _homepage: data.homepage ?? prev._homepage,
          _navigation: data.navigation ?? prev._navigation,
        });
        setLive(true);
      }
      setLoading(false);
    })().catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const merged = useSiteConfig();
  return useMemo(
    () => ({ ...merged, live, loading, source: live ? ("live" as const) : ("fallback" as const) }),
    [merged, live, loading]
  );
}

export interface LiveAnnouncement {
  text: string;
  cta: string;
  to: string;
}

export function useAnnouncement(): LiveAnnouncement & { dismissed: boolean; dismiss: () => void } {
  const [live, setLive] = useState<LiveAnnouncement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem("itcyber_announcement_dismissed") === "1");
    } catch {
      setDismissed(false);
    }
    if (!sb) return;
    let cancelled = false;
    (async () => {
      const { data } = await sb.from("announcements").select("*").eq("active", true).limit(1).maybeSingle();
      if (cancelled || !data) return;
      const now = new Date().toISOString();
      const startsOk = !data.starts_at || data.starts_at <= now;
      const endsOk = !data.ends_at || data.ends_at >= now;
      if (startsOk && endsOk) setLive({ text: data.text, cta: data.cta_label ?? "Learn more", to: data.cta_to ?? "/" });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("itcyber_announcement_dismissed", "1");
    } catch {
      /* private mode — dismissal just won't persist */
    }
  };

  const ann = live ?? { text: staticSite.announcement.text, cta: staticSite.announcement.cta, to: staticSite.announcement.to };
  return { ...ann, dismissed, dismiss };
}

/** Minimal admin table reader (all rows). */
export function useAdminTable<T extends TableName>(table: T, orderBy = "created_at") {
  const [rows, setRows] = useState<RowOf<T>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    if (!sb) {
      setError("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.");
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const { data, error: err } = await sb.from(table).select("*").order(orderBy, { ascending: false });
      if (cancelled) return;
      if (err) setError(err.message);
      else {
        setRows((data ?? []) as RowOf<T>[]);
        setError(null);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [table, orderBy, version]);

  return { rows, loading, error, refresh: () => setVersion((v) => v + 1) };
}
