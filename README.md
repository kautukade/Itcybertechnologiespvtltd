# ITCYBER Technologies Pvt Ltd — Website + Admin Platform

Production marketing site and secure admin/CMS platform for **ITCYBER Technologies Pvt Ltd** — custom AI systems, business automation, websites, applications and custom software.

**Stack:** React 18 · TypeScript strict mode · Vite · Tailwind CSS · Framer Motion · React Router · React Three Fiber · Supabase (Auth, Postgres, Storage, Edge Functions, RLS) · Netlify.

## Local development

```bash
npm install
npm run dev
```

The public site degrades safely when Supabase is unavailable:

- bundled non-sensitive content remains visible;
- public forms never fake success;
- careers do **not** show bundled demo jobs as live vacancies;
- admin login clearly reports missing frontend environment configuration.

Copy `.env.example` to `.env` for local Supabase configuration. Never commit `.env`, admin passwords, service-role credentials or Edge Function secrets.

## Production verification

Use Node 22:

```bash
npm ci
npm run typecheck
npm audit --omit=dev --audit-level=moderate
npm run build
```

Pull requests also run GitHub Actions for:

- repository security regression checks;
- Node 22 TypeScript + Vite build;
- production dependency audit at **moderate** severity or higher;
- Deno typechecking for all four public Supabase Edge Functions.

## Backend architecture

Public form records do not insert directly into protected application tables. They use these Edge Functions:

- `submit-contact`
- `submit-assessment`
- `submit-career`
- `prepare-resume-upload`

The submission functions validate fields, reject unexpected payload keys and oversized bodies, enforce an explicit origin allow-list, apply server-side abuse throttling, and insert with the server-side service role. The career endpoint also verifies that a selected role is both published and accepting applications before creating an application.

Resume uploads use a separate signed-upload flow. Anonymous visitors do **not** have direct `INSERT` permission on the private `career-resumes` bucket. `prepare-resume-upload` validates file metadata and rate limits, generates a server-controlled `pending/<uuid>.<ext>` path, and returns a short-lived signed upload token. The browser never receives service-role credentials.

RLS protects leads, assessments, applications, profiles, audit logs and CMS writes. Authorized HR/admin users open resumes through short-lived signed read URLs.

See **SUPABASE_SETUP.md** for migrations, Auth, first-admin setup, Edge Function deployment, RLS verification and production smoke tests.

## Admin panel

Sign in at `/itcyberadmin/login`. The route is excluded from indexing and is never advertised on the public site.

| Area | Capabilities |
| --- | --- |
| Dashboard | Lead/application overview and operational summaries |
| Leads | Search, filters, assignment, notes, status pipeline, CSV export |
| Assessments | Review and manage project/automation assessments |
| Services / AI Agents / Automations / Industries / Work / Resources | CMS create/edit/publish/reorder workflows |
| Jobs / Applications | Role CRUD, open/close controls, candidate stages, signed resumes |
| Media | Validated upload/replace/delete in `site-media` |
| SEO | Per-route title, description, canonical, OG, robots and schema overrides |
| Navigation / Pages | Announcement and homepage/navigation settings |
| Settings | Runtime contact and company settings |
| Users / Audit Logs | Role/activation administration and activity history |

## Project structure

```text
src/
  admin/        admin panel and CMS
  components/   layout, UI, workflow demos and 3D scene
  data/         bundled fallback content and default site config
  lib/          Supabase, forms, auth/RBAC, CMS, SEO and motion helpers
  pages/        public routes
  types/        Supabase row types
supabase/
  migrations/   0001 initial schema → 0006 second-pass security hardening
  functions/    4 validated public endpoints, plus shared security helpers
  seed.sql      optional idempotent starter CMS content
scripts/
  security-check.mjs   repository regression/security checks
```

## Netlify deployment

1. Import this GitHub repository into Netlify.
2. `netlify.toml` runs `npm run build`, publishes `dist/`, pins Node 22, configures SPA routing, caching and browser security headers.
3. Add these Netlify environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_URL
```

4. Deploy the four Supabase Edge Functions separately as documented in `SUPABASE_SETUP.md`.
5. Attach `www.itcyber.in`, enable HTTPS and run the production smoke tests.

## Security and content rules

- Service-role credentials never belong in frontend code, Vite variables or Git.
- Public protected-table writes go through validated Edge Functions.
- Public endpoints use strict allowed origins, bounded request bodies and server-side rate limiting.
- RLS remains the server-side authorization boundary; client-side RBAC is only UX/navigation.
- Audit entries must be authored by the authenticated staff member; lead-note authorship is protected by RLS.
- `career-resumes` is private, MIME/size restricted, and has no anonymous direct upload policy.
- `site-media` permits passive raster images plus MP4 only; arbitrary SVG upload is intentionally disabled.
- CSV exports neutralize spreadsheet formula prefixes before writing user-controlled values.
- External/admin-managed URLs are validated before navigation.
- A case study cannot be marked `real` in the database unless `verified = true`.
- Contact channels stay hidden until configured with real values.
- No fake form-success states, fake client testimonials or invented metrics.
- New database changes use a new numbered migration; already-applied migration history is not rewritten.
- Dependabot checks npm and GitHub Actions dependencies regularly; CI rejects production dependency advisories at moderate severity or higher.
