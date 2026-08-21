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
 *
 * Table awareness: the `published` filter and `sort_order` ordering are only
 * applied to tables that actually have those columns (applying them blindly
 * to e.g. `social_links` produces query errors and silent fallbacks).
 */
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Database, TableName } from "../types/db";
import { site as staticSite, type SiteConfig } from "../data/site";
import { getSiteConfig, setSiteConfig, useSiteConfig } from "./siteSettings";

type Tables = Database["public"]["Tables"];
type RowOf<T extends TableName> = Tables[T]["Row"];

/** Dynamic-table operations use the loosely typed client; rows are cast at the boundary. */
const sb = supabase as unknown as SupabaseClient | null;

/** Tables with a `published` boolean (RLS already exposes only published rows). */
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

/** Tables ordered by sort_order — the published set plus social_links. */
const SORTABLE_TABLES = new Set<string>([...PUBLISHED_TABLES, "social_links"]);

export interface CollectionState<T> {
  data: T[];
  loading: boolean;
  configured: boolean;
  error: string | null;
  source: "live" | "fallback";
  /** convenience alias for source === "live" */
  live: boolean;
}

export function useCollection<T extends TableName>(
  table: T,
  fallback: RowOf<T>[]
): CollectionState<RowOf<T>> {
  const [state, setState] = useState<{
    rows: RowOf<T>[];
    loading: boolean;
    error: string | null;
    source: "live" | "fallback";
  }>({ rows: fallback, loading: sb !== null, error: null, source: "fallback" });

  useEffect(() => {
    if (!sb) return;
    let cancelled = false;
    (async () => {
      let query = sb.from(table).select("*");
      if (PUBLISHED_TABLES.has(table)) query = query.eq("published", true);
      if (SORTABLE_TABLES.has(table)) query = query.order("sort_order", { ascending: true });
      const { data, error } = await query;
      if (cancelled) return;
      if (error || !data) {
        setState({ rows: fallback, loading: false, error: error?.message ?? "No data returned", source: "fallback" });
      } else {
        setState({ rows: data as RowOf<T>[], loading: false, error: null, source: "live" });
      }
    })();
    return () => {
      cancelled = true;
    };
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
    setLoading(true);
    (async () => {
      const { data } = await sb.from("site_settings").select("*").limit(1).maybeSingle();
      if (data) {
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
    })();
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

/**
 * Active announcement: from the `announcements` table when Supabase is live
 * (honouring active + starts_at/ends_at), otherwise the static default.
 * Visitor dismissal is persisted in localStorage so it stays dismissed.
 */
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
    (async () => {
      const { data } = await sb.from("announcements").select("*").eq("active", true).limit(1).maybeSingle();
      if (data) {
        const now = new Date().toISOString();
        const startsOk = !data.starts_at || data.starts_at <= now;
        const endsOk = !data.ends_at || data.ends_at >= now;
        if (startsOk && endsOk) setLive({ text: data.text, cta: data.cta_label ?? "Learn more", to: data.cta_to ?? "/" });
      }
    })();
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
