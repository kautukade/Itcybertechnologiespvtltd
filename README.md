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

Copy `.env.example` to `.env` for local Supabase configuration. Never commit `.env` or a service-role key.

## Production verification

Use Node 22, which is the supported runtime for the currently resolved Supabase packages:

```bash
npm ci
npm run typecheck
npm run build
```

Pull requests also run GitHub Actions for:

- Node 22 TypeScript + Vite build;
- production dependency audit at high severity;
- Deno typechecking for all three Supabase Edge Functions using the repository's function config.

## Backend architecture

Public forms do not insert directly into protected tables. They call:

- `submit-contact`
- `submit-assessment`
- `submit-career`

The Edge Functions validate fields, reject unexpected payload keys, apply request/rate limits, use an explicit CORS allow-list, and insert with the server-side service role. The career endpoint additionally verifies that a selected role is both published and accepting applications before creating an application.

RLS protects leads, assessments, applications, profiles, audit logs and CMS writes. Resumes are stored in the private `career-resumes` bucket and opened by authorized HR/admin users through short-lived signed URLs.

See **SUPABASE_SETUP.md** for migrations, Auth, first-admin setup, function deployment, RLS verification and production smoke tests.

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
  migrations/   0001 initial schema → 0005 production hardening
  functions/    validated public submission endpoints
  seed.sql      optional idempotent starter CMS content
```

## Netlify deployment

1. Import this GitHub repository into Netlify.
2. `netlify.toml` runs `npm run build`, publishes `dist/`, pins Node 22, configures SPA routing, caching and security headers.
3. Add these Netlify environment variables:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_SITE_URL
```

4. Deploy the three Supabase Edge Functions separately as documented in `SUPABASE_SETUP.md`.
5. Attach `www.itcyber.in`, enable HTTPS and run the production smoke tests.

## Security and content rules

- Service-role credentials never belong in frontend code, Vite variables or Git.
- Public protected-table writes go through validated Edge Functions.
- RLS remains the server-side authorization boundary; client-side RBAC is only UX/navigation.
- `career-resumes` is private and MIME/size restricted server-side.
- `site-media` has server-side MIME/size limits in migration `0005`.
- A case study cannot be marked `real` in the database unless `verified = true`.
- Contact channels stay hidden until configured with real values.
- No fake form-success states, fake client testimonials or invented metrics.
- New database changes use a new numbered migration; already-applied migration history is not rewritten.
