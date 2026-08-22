import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();
const errors = [];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const stat = statSync(path);
    if (stat.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}

function check(condition, message) {
  if (!condition) errors.push(message);
}

const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean);
check(!tracked.some((p) => p === ".env" || (/^\.env\./.test(p) && p !== ".env.example")), "A real environment file is tracked by Git");

const codeFiles = walk(join(ROOT, "src")).filter((p) => [".ts", ".tsx", ".js", ".jsx"].includes(extname(p)));
for (const path of codeFiles) {
  const text = readFileSync(path, "utf8");
  const rel = relative(ROOT, path);
  if (text.includes("dangerouslySetInnerHTML")) errors.push(`${rel}: dangerouslySetInnerHTML requires an explicit security review`);
  if (/\beval\s*\(/.test(text)) errors.push(`${rel}: eval() is not allowed`);
  if (/\bnew\s+Function\s*\(/.test(text)) errors.push(`${rel}: new Function() is not allowed`);
  if (/VITE_SUPABASE_SERVICE_ROLE_KEY/.test(text)) errors.push(`${rel}: service-role credentials must never be referenced by frontend code`);
  if (/sb_secret_[A-Za-z0-9_-]+/.test(text)) errors.push(`${rel}: looks like a Supabase secret key was committed`);
}

const envExample = readFileSync(join(ROOT, ".env.example"), "utf8");
check(!/VITE_SUPABASE_SERVICE_ROLE_KEY\s*=/.test(envExample), ".env.example must not suggest a frontend service-role variable");

const netlify = readFileSync(join(ROOT, "netlify.toml"), "utf8");
for (const required of [
  "script-src 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "X-Content-Type-Options = \"nosniff\"",
]) {
  check(netlify.includes(required), `netlify.toml is missing security control: ${required}`);
}

if (errors.length) {
  console.error("Security regression check failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Security regression check passed (${codeFiles.length} frontend source files scanned).`);
