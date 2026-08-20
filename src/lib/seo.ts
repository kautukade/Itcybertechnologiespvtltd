/**
 * Per-route SEO: unique title, description, canonical, OpenGraph and Twitter
 * metadata — set imperatively per page instead of a single hardcoded canonical.
 * DB overrides (seo_pages) are merged when Supabase is configured.
 */
import { useEffect } from "react";
import { SITE_URL, supabase } from "./supabase";
import type { SeoPageRow } from "../types/db";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  robots?: string;
  schema?: Record<string, unknown>;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applyPageMeta(meta: PageMeta) {
  document.title = meta.title;
  upsertMeta("name", "description", meta.description);
  upsertMeta("name", "robots", meta.robots ?? "index, follow");
  upsertCanonical(`${SITE_URL}${meta.path}`);
  upsertMeta("property", "og:title", meta.title);
  upsertMeta("property", "og:description", meta.description);
  upsertMeta("property", "og:url", `${SITE_URL}${meta.path}`);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:image", meta.ogImage ?? `${SITE_URL}/og/itcyber-default.svg`);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", meta.title);
  upsertMeta("name", "twitter:description", meta.description);
  upsertMeta("name", "twitter:image", meta.ogImage ?? `${SITE_URL}/og/itcyber-default.svg`);

  let schemaEl = document.getElementById("page-schema");
  if (meta.schema) {
    if (!schemaEl) {
      schemaEl = document.createElement("script");
      schemaEl.id = "page-schema";
      (schemaEl as HTMLScriptElement).type = "application/ld+json";
      document.head.appendChild(schemaEl);
    }
    schemaEl.textContent = JSON.stringify(meta.schema);
  } else if (schemaEl) {
    schemaEl.remove();
  }
}

/** Page-level hook with optional CMS override from seo_pages. */
export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    applyPageMeta(meta);
    if (!supabase) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("seo_pages").select("*").eq("route", meta.path).maybeSingle();
      if (cancelled || !data) return;
      const row = data as SeoPageRow;
      applyPageMeta({
        title: row.title ?? meta.title,
        description: row.description ?? meta.description,
        path: row.canonical ? new URL(row.canonical).pathname : meta.path,
        ogImage: row.og_image ?? meta.ogImage,
        robots: row.robots ?? meta.robots,
        schema: (row.schema_json as Record<string, unknown>) ?? meta.schema,
      });
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.path, meta.title, meta.description]);
}

/** Org schema shared across pages. */
export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ITCYBER Technologies Pvt Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
};
