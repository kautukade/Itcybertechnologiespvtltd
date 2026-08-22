import { useMemo } from "react";
import { useCollection } from "./cms";
import {
  agents as staticAgents,
  industries as staticIndustries,
  resources as staticResources,
  serviceCategories as staticServiceCategories,
  type Agent,
  type Industry,
  type ServiceCategory,
} from "../data/content";
import type { AgentRow, IndustryRow, Json, ResourceRow, ServiceRow } from "../types/db";

const DEMO_TYPES = ["chat", "score", "ticket", "calendar", "report", "build"] as const;

function stringArray(value: Json): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function faqArray(value: Json): { q: string; a: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const record = item as Record<string, Json | undefined>;
    const q = typeof record.q === "string" ? record.q.trim() : "";
    const a = typeof record.a === "string" ? record.a.trim() : "";
    return q && a ? [{ q, a }] : [];
  });
}

export function usePublishedServiceCategories(): ServiceCategory[] {
  const { data: rows, source } = useCollection("services", [] as ServiceRow[]);
  return useMemo(() => {
    if (source !== "live") return staticServiceCategories;
    return staticServiceCategories.flatMap((category) => {
      const published = rows.filter((row) => row.category === category.id);
      if (!published.length) return [];
      return [{
        ...category,
        items: published.map((row) => ({
          name: row.title,
          blurb: row.short_description ?? "",
        })),
      }];
    });
  }, [rows, source]);
}

export function usePublishedAgents(): Agent[] {
  const { data: rows, source } = useCollection("ai_agents", [] as AgentRow[]);
  return useMemo(() => {
    if (source !== "live") return staticAgents;
    return rows.map((row) => ({
      id: row.slug,
      name: row.name,
      role: row.role ?? "Custom",
      description: row.description ?? "",
      inputs: row.inputs ?? "",
      actions: row.actions ?? "",
      systems: row.systems ?? "",
      outputs: row.outputs ?? "",
      handoff: row.handoff ?? "",
      demo: DEMO_TYPES.includes(row.demo_type as (typeof DEMO_TYPES)[number])
        ? (row.demo_type as Agent["demo"])
        : "chat",
    }));
  }, [rows, source]);
}

export type PublishedIndustry = Industry & {
  seoTitle?: string;
  seoDescription?: string;
};

export function usePublishedIndustries(): PublishedIndustry[] {
  const { data: rows, source } = useCollection("industries", [] as IndustryRow[]);
  return useMemo(() => {
    if (source !== "live") return staticIndustries;
    return rows.map((row) => ({
      slug: row.slug,
      name: row.name,
      short: row.short_description ?? row.hero_description ?? "",
      challenges: stringArray(row.challenges_json),
      opportunities: stringArray(row.opportunities_json),
      automations: stringArray(row.automations_json),
      workflow: stringArray(row.workflow_json),
      integrations: stringArray(row.integrations_json),
      agents: stringArray(row.agents_json),
      faq: faqArray(row.faq_json),
      seoTitle: row.seo_title ?? undefined,
      seoDescription: row.seo_description ?? undefined,
    }));
  }, [rows, source]);
}

export type ResourcePreview = {
  id: string;
  title: string;
  kind: string;
  summary: string;
  to: string;
  meta: string;
};

export function usePublishedResourcePreviews(): ResourcePreview[] {
  const { data: rows, source } = useCollection("resources", [] as ResourceRow[]);
  return useMemo(() => {
    if (source !== "live") {
      return staticResources.map((row, index) => ({
        id: `static-${index}`,
        title: row.title,
        kind: row.kind,
        summary: row.blurb,
        to: row.to,
        meta: row.minutes,
      }));
    }
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      kind: row.kind,
      summary: row.summary ?? "",
      to: `/resources/${row.slug}`,
      meta: "Field note",
    }));
  }, [rows, source]);
}
