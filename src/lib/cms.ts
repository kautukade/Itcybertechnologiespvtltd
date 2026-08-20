/**
 * CMS read layer for the public site.
 * When Supabase is configured, published content is fetched live;
 * otherwise the bundled data acts as a fully functional fallback.
 */
import { useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import type { Database, TableName } from "../types/db";
import { site as staticSite, type SiteConfig } from "../data/site";

type Tables = Database["public"]["Tables"];
type RowOf<T extends TableName> = Tables[T]["Row"];

/** Dynamic-table operations use the loosely typed client; rows are cast at the boundary. */
const sb = supabase as unknown as SupabaseClient | null;

/** Public read: published rows only (matches RLS), ordered by sort_order when present. */
export function useCollection<T extends TableName>(
  table: T,
  fallback: RowOf<T>[],
  opts: { published?: boolean } = {}
) {
  const { published = true } = opts;
  const [data, setData] = useState<RowOf<T>[]>(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!sb) return;
    setLoading(true);
    (async () => {
      let query = sb.from(table).select("*");
      if (published) query = query.eq("published", true);
      if (!["profiles", "admin_activity_logs"].includes(table)) query = query.order("sort_order", { ascending: true });
      const { data: rows, error } = await query;
      if (!cancelled) {
        if (!error && rows) setData(rows as RowOf<T>[]);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [table, published]);

  return { data, loading, live: sb !== null };
}

/** Site settings merged over static/env defaults (single row in DB). */
export function useSiteSettings(): SiteConfig & { live: boolean; loading: boolean } {
  const [merged, setMerged] = useState<SiteConfig>(staticSite);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!sb) return;
    setLoading(true);
    (async () => {
      const { data } = await sb.from("site_settings").select("*").limit(1).maybeSingle();
      if (data) {
        setMerged((prev) => ({
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
        }));
      }
      setLoading(false);
    })();
  }, []);

  return useMemo(() => ({ ...merged, live: sb !== null, loading }), [merged, loading]);
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
