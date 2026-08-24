const required = ["VITE_SUPABASE_URL", "VITE_SUPABASE_ANON_KEY"];
const missing = required.filter((name) => !process.env[name]?.trim());

if (missing.length > 0) {
  console.error("\nNetlify production environment is incomplete.");
  console.error(`Missing required environment variable${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`);
  console.error("Configure them in Netlify before deploying so public forms and CMS features do not ship in a broken state.\n");
  process.exit(1);
}

try {
  const url = new URL(process.env.VITE_SUPABASE_URL);
  if (url.protocol !== "https:") throw new Error("Supabase URL must use HTTPS");
} catch {
  console.error("\nVITE_SUPABASE_URL is not a valid HTTPS URL. Fix the Netlify environment variable before deploying.\n");
  process.exit(1);
}

console.log("Netlify environment check passed: required Supabase public variables are present.");
