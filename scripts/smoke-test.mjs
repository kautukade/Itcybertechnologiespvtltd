const baseUrl = (process.env.SITE_URL || "https://itcybertechnologies.netlify.app").replace(/\/$/, "");
const attempts = Number(process.env.SMOKE_ATTEMPTS || 20);
const delayMs = Number(process.env.SMOKE_DELAY_MS || 15000);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(path, expectedStatus = 200) {
  const url = `${baseUrl}${path}`;
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": "ITCYBER-Production-Smoke-Test/1.0" },
      });
      if (response.status === expectedStatus) return response;
      lastError = new Error(`${url} returned ${response.status}; expected ${expectedStatus}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      console.log(`Attempt ${attempt}/${attempts} failed for ${url}; retrying in ${delayMs}ms...`);
      await sleep(delayMs);
    }
  }

  throw lastError || new Error(`Failed to fetch ${url}`);
}

function requireHeader(response, name, predicate = (value) => Boolean(value)) {
  const value = response.headers.get(name);
  if (!value || !predicate(value)) throw new Error(`Missing or invalid ${name} header`);
  console.log(`✓ ${name}: ${value}`);
}

async function main() {
  console.log(`Smoke testing ${baseUrl}`);

  const home = await fetchWithRetry("/");
  const html = await home.text();
  if (!/ITCYBER/i.test(html)) throw new Error("Homepage HTML does not contain ITCYBER branding");
  requireHeader(home, "x-content-type-options", (v) => v.toLowerCase() === "nosniff");
  requireHeader(home, "x-frame-options", (v) => v.toUpperCase() === "DENY");
  requireHeader(home, "content-security-policy");
  requireHeader(home, "strict-transport-security");
  console.log("✓ Homepage and security headers");

  const routes = [
    "/services",
    "/ai-agents",
    "/automations",
    "/custom-software",
    "/web-development",
    "/app-development",
    "/solutions",
    "/work",
    "/about",
    "/careers",
    "/contact",
    "/resources",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
    "/itcyberadmin/login",
  ];

  for (const path of routes) {
    await fetchWithRetry(path);
    console.log(`✓ ${path}`);
  }

  const sitemap = await fetchWithRetry("/sitemap.xml");
  const sitemapText = await sitemap.text();
  if (!sitemapText.includes("<urlset") || !sitemapText.includes("https://www.itcyber.in/")) {
    throw new Error("sitemap.xml content is invalid or missing canonical site URLs");
  }
  console.log("✓ /sitemap.xml");

  const robots = await fetchWithRetry("/robots.txt");
  const robotsText = await robots.text();
  if (!/Sitemap:\s*https:\/\/www\.itcyber\.in\/sitemap\.xml/i.test(robotsText)) {
    throw new Error("robots.txt does not advertise the expected sitemap");
  }
  if (!/Disallow:\s*\/itcyberadmin/i.test(robotsText)) {
    throw new Error("robots.txt does not block the admin route");
  }
  console.log("✓ /robots.txt");

  console.log("Production smoke test passed.");
}

main().catch((error) => {
  console.error(`Production smoke test failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
