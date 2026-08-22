from pathlib import Path


def replace(path: str, old: str, new: str) -> None:
    p = Path(path)
    text = p.read_text(encoding="utf-8")
    if old not in text:
        raise SystemExit(f"Expected block not found in {path}: {old[:120]!r}")
    p.write_text(text.replace(old, new, 1), encoding="utf-8")


Path("src/lib/catalog.ts").write_text(r'''import { useMemo } from "react";
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
''', encoding="utf-8")

replace("src/pages/Home.tsx", '''import {
  trustItems, beforeFlow, afterFlow, serviceCategories, agents, functionSolutions,
  industries, techEcosystem, processSteps, whyPillars, securityPillars, resources, capabilitiesIntro,
} from "../data/content";''', '''import {
  trustItems, beforeFlow, afterFlow, functionSolutions,
  techEcosystem, processSteps, whyPillars, securityPillars, capabilitiesIntro,
  type Agent, type Industry, type ServiceCategory,
} from "../data/content";''')
replace("src/pages/Home.tsx", 'import { useSiteSettings } from "../lib/cms";', 'import { useSiteSettings } from "../lib/cms";\nimport { usePublishedAgents, usePublishedIndustries, usePublishedResourcePreviews, usePublishedServiceCategories, type ResourcePreview } from "../lib/catalog";')
replace("src/pages/Home.tsx", '''function Capabilities() {
  const [agentsIdx, setAgentsIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setAgentsIdx((v) => (v + 1) % 4), 1600);
    return () => clearInterval(id);
  }, []);''', '''function Capabilities({ categories, agents }: { categories: ServiceCategory[]; agents: Agent[] }) {
  const [agentsIdx, setAgentsIdx] = useState(0);
  const previewCount = Math.max(1, Math.min(4, agents.length));
  useEffect(() => {
    const id = setInterval(() => setAgentsIdx((v) => (v + 1) % previewCount), 1600);
    return () => clearInterval(id);
  }, [previewCount]);''')
replace("src/pages/Home.tsx", '{serviceCategories.map((cat, i) => (', '{categories.map((cat, i) => (')
replace("src/pages/Home.tsx", 'function IndustriesStrip() {', 'function IndustriesStrip({ industries }: { industries: Industry[] }) {')
replace("src/pages/Home.tsx", 'function Resources() {', 'function Resources({ resources }: { resources: ResourcePreview[] }) {')
replace("src/pages/Home.tsx", '''export default function Home() {
  return (''', '''export default function Home() {
  const homeAgents = usePublishedAgents();
  const homeIndustries = usePublishedIndustries();
  const homeResources = usePublishedResourcePreviews();
  const homeServiceCategories = usePublishedServiceCategories();
  return (''')
replace("src/pages/Home.tsx", '<Capabilities />', '<Capabilities categories={homeServiceCategories} agents={homeAgents} />')
replace("src/pages/Home.tsx", '{agents.map((a, i) => (', '{homeAgents.map((a, i) => (')
replace("src/pages/Home.tsx", '<IndustriesStrip />', '<IndustriesStrip industries={homeIndustries} />')
replace("src/pages/Home.tsx", '<Resources />', '<Resources resources={homeResources} />')
replace("src/pages/Home.tsx", '<Reveal key={r.title} delay={i * 0.06}>', '<Reveal key={r.id} delay={i * 0.06}>')
replace("src/pages/Home.tsx", '<p className="text-[0.83rem] text-ink-500 mt-2 leading-relaxed">{r.blurb}</p>', '<p className="text-[0.83rem] text-ink-500 mt-2 leading-relaxed">{r.summary}</p>')

replace("src/components/layout/Navbar.tsx", 'import { serviceCategories, industries, functionSolutions } from "../../data/content";', 'import { functionSolutions, type Industry, type ServiceCategory } from "../../data/content";\nimport { usePublishedIndustries, usePublishedServiceCategories } from "../../lib/catalog";')
replace("src/components/layout/Navbar.tsx", '  const [announceHidden, setAnnounceHidden] = useState(false);', '  const [dismissedAnnouncementKey, setDismissedAnnouncementKey] = useState("");')
replace("src/components/layout/Navbar.tsx", '''  const announcement = useAnnouncement();
  const ann = {
    show: (navOverride.announcement?.show ?? site.announcement.show) && !announcement.dismissed,
    text: announcement.text,
    cta: announcement.cta,
    to: announcement.to,
  };''', '''  const announcement = useAnnouncement();
  const serviceCategories = usePublishedServiceCategories();
  const industries = usePublishedIndustries();
  const announcementKey = `${announcement.text}\u0000${announcement.cta}\u0000${announcement.to}`;
  useEffect(() => {
    try {
      setDismissedAnnouncementKey(localStorage.getItem("itcyber_announcement_dismissed_key") ?? "");
    } catch {
      setDismissedAnnouncementKey("");
    }
  }, []);
  const dismissAnnouncement = () => {
    setDismissedAnnouncementKey(announcementKey);
    try {
      localStorage.setItem("itcyber_announcement_dismissed_key", announcementKey);
    } catch {
      // Private browsing/storage denial: dismissal remains session-local.
    }
  };
  const ann = {
    show: (navOverride.announcement?.show ?? site.announcement.show) && dismissedAnnouncementKey !== announcementKey,
    text: announcement.text,
    cta: announcement.cta,
    to: announcement.to,
  };''')
replace("src/components/layout/Navbar.tsx", '{ann.show && !announceHidden && (', '{ann.show && (')
replace("src/components/layout/Navbar.tsx", 'onClick={() => { announcement.dismiss(); setAnnounceHidden(true); }}', 'onClick={dismissAnnouncement}')
replace("src/components/layout/Navbar.tsx", '<MegaPanel kind={item.mega!} />', '<MegaPanel kind={item.mega!} serviceCategories={serviceCategories} industries={industries} />')
replace("src/components/layout/Navbar.tsx", '{ label: "All Industries", to: "/solutions", blurb: "8 industry playbooks" }', '{ label: "All Industries", to: "/solutions", blurb: `${industries.length} industry playbooks` }')
replace("src/components/layout/Navbar.tsx", 'function MegaPanel({ kind }: { kind: string }) {', 'function MegaPanel({ kind, serviceCategories, industries }: { kind: string; serviceCategories: ServiceCategory[]; industries: Industry[] }) {')

replace("src/pages/Solutions.tsx", 'import NotFound from "./NotFound";', 'import NotFound from "./NotFound";\nimport { usePageMeta } from "../lib/seo";')
replace("src/pages/Solutions.tsx", '''/** Live published industries from the CMS, with the bundled data as fallback.
 *  A newly published industry renders at /solutions/<slug> without code changes. */
function useIndustries(): Industry[] {''', '''type PublicIndustry = Industry & { seoTitle?: string; seoDescription?: string };

/** Live published industries from the CMS, with the bundled data as fallback.
 *  A newly published industry renders at /solutions/<slug> without code changes. */
function useIndustries(): PublicIndustry[] {''')
replace("src/pages/Solutions.tsx", '''          faq: (row.faq_json as { q: string; a: string }[]) ?? [],
        };''', '''          faq: (row.faq_json as { q: string; a: string }[]) ?? [],
          seoTitle: row.seo_title ?? undefined,
          seoDescription: row.seo_description ?? undefined,
        };''')
replace("src/pages/Solutions.tsx", '''  const ind = industries.find((i) => i.slug === slug);
  /* Unknown slug → real 404, never a silent redirect to the index. */
  if (!ind) return <NotFound />;''', '''  const ind = industries.find((i) => i.slug === slug);
  const pagePath = `/solutions/${slug ?? ""}`;
  usePageMeta({
    title: ind?.seoTitle ?? (ind ? `${ind.name} — AI & Automation Solutions | ITCYBER` : "Industry Solution Not Found | ITCYBER"),
    description: ind?.seoDescription ?? ind?.short ?? "Industry-specific AI and automation playbook from ITCYBER.",
    path: pagePath,
    robots: ind ? undefined : "noindex, nofollow",
  });
  /* Unknown slug → real 404, never a silent redirect to the index. */
  if (!ind) return <NotFound />;''')

replace("src/admin/Cms.tsx", 'options: ["sales", "support", "operations", "hr", "finance", "marketing"]', 'options: ["sales", "lead", "marketing", "support", "appointment", "operations", "hr", "finance"]')

Path("netlify/functions").mkdir(parents=True, exist_ok=True)
Path("netlify/functions/sitemap.mjs").write_text(r'''const SITE_URL = "https://www.itcyber.in";

const CORE_PATHS = [
  "/", "/services", "/ai-agents", "/automations", "/custom-software",
  "/web-development", "/app-development", "/solutions", "/work", "/about",
  "/careers", "/contact", "/resources", "/privacy-policy", "/terms-of-service",
  "/cookie-policy",
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function safeSlug(value) {
  return typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? value : null;
}

async function publishedSlugs(table) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const publicKey = process.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !publicKey) return [];
  const endpoint = new URL(`/rest/v1/${table}`, supabaseUrl);
  endpoint.searchParams.set("published", "eq.true");
  endpoint.searchParams.set("select", "slug");
  endpoint.searchParams.set("order", "sort_order.asc");
  const response = await fetch(endpoint, {
    headers: {
      apikey: publicKey,
      Authorization: `Bearer ${publicKey}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) throw new Error(`${table} sitemap query failed: ${response.status}`);
  const rows = await response.json();
  return Array.isArray(rows) ? rows.map((row) => safeSlug(row?.slug)).filter(Boolean) : [];
}

export default async () => {
  let dynamicPaths = [];
  try {
    const [industries, resources] = await Promise.all([
      publishedSlugs("industries"),
      publishedSlugs("resources"),
    ]);
    dynamicPaths = [
      ...industries.map((slug) => `/solutions/${slug}`),
      ...resources.map((slug) => `/resources/${slug}`),
    ];
  } catch (error) {
    console.error("sitemap dynamic routes unavailable", error instanceof Error ? error.message : error);
  }
  const paths = [...new Set([...CORE_PATHS, ...dynamicPaths])];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${escapeXml(`${SITE_URL}${path}`)}</loc></url>`).join("\n")}\n</urlset>\n`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
};
''', encoding="utf-8")

replace("netlify.toml", '''[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200''', '''[[redirects]]
  from = "/sitemap.xml"
  to = "/.netlify/functions/sitemap"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200''')

readme = Path("README.md").read_text(encoding="utf-8")
if "### Dynamic sitemap" not in readme:
    Path("README.md").write_text(readme + '''\n\n### Dynamic sitemap\n\nNetlify routes `/sitemap.xml` through `netlify/functions/sitemap.mjs`. The function uses the public Supabase key and RLS to include currently published industry and resource slugs, while retaining a static core-route fallback if Supabase is unavailable.\n''', encoding="utf-8")
