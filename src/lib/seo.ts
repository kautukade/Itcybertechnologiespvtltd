/**
 * Per-route SEO metadata with optional Supabase CMS overrides.
 * Static metadata is applied immediately; a matching seo_pages row may then
 * override it. A request generation token prevents stale route responses from
 * changing metadata after navigation.
 */
import { useEffect } from "react";
import { SITE_URL, supabase } from "./supabase";
import type { SeoPageRow } from "../types/db";

export interface PageMeta {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  robots?: string;
  schema?: Record<string, unknown>;
}

let metadataGeneration = 0;

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(attr: "name" | "property", key: string) {
  document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)?.remove();
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

function absoluteUrl(value: string | undefined, fallbackPath: string): string {
  try {
    return new URL(value || fallbackPath, SITE_URL).toString();
  } catch {
    return new URL(fallbackPath, SITE_URL).toString();
  }
}

function pathFromCanonical(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  try {
    const url = new URL(value, SITE_URL);
    return `${url.pathname}${url.search}${url.hash}` || fallback;
  } catch {
    return fallback;
  }
}

function schemaObject(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function applyBaseMeta(meta: PageMeta) {
  const canonical = absoluteUrl(meta.path, "/");
  const ogImage = absoluteUrl(meta.ogImage, "/og/itcyber-default.svg");
  const ogTitle = meta.ogTitle ?? meta.title;
  const ogDescription = meta.ogDescription ?? meta.description;

  document.title = meta.title;
  upsertMeta("name", "description", meta.description);
  if (meta.keywords?.trim()) upsertMeta("name", "keywords", meta.keywords.trim());
  else removeMeta("name", "keywords");
  upsertMeta("name", "robots", meta.robots ?? "index, follow");
  upsertCanonical(canonical);
  upsertMeta("property", "og:title", ogTitle);
  upsertMeta("property", "og:description", ogDescription);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:image", ogImage);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", ogTitle);
  upsertMeta("name", "twitter:description", ogDescription);
  upsertMeta("name", "twitter:image", ogImage);

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

export function applyPageMeta(meta: PageMeta) {
  const generation = ++metadataGeneration;
  applyBaseMeta(meta);

  if (!supabase || meta.path.startsWith("/itcyberadmin")) return;

  void (async () => {
    const { data, error } = await supabase.from("seo_pages").select("*").eq("route", meta.path).maybeSingle();
    if (error || !data || generation !== metadataGeneration) return;
    const row = data as SeoPageRow;
    applyBaseMeta({
      title: row.title ?? meta.title,
      description: row.description ?? meta.description,
      keywords: row.keywords ?? meta.keywords,
      path: pathFromCanonical(row.canonical, meta.path),
      ogTitle: row.og_title ?? meta.ogTitle,
      ogDescription: row.og_description ?? meta.ogDescription,
      ogImage: row.og_image ?? meta.ogImage,
      robots: row.robots ?? meta.robots,
      schema: schemaObject(row.schema_json) ?? meta.schema,
    });
  })().catch(() => {
    /* Static metadata remains authoritative when the CMS cannot be reached. */
  });
}

export function usePageMeta(meta: PageMeta) {
  useEffect(() => {
    applyPageMeta(meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.path, meta.title, meta.description, meta.keywords, meta.ogTitle, meta.ogDescription, meta.ogImage, meta.robots]);
}

export const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ITCYBER Technologies Pvt Ltd",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
};
