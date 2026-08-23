const SITE_URL = "https://www.itcyber.in";

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
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const publicKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
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
