# ITCYBER Technologies Pvt Ltd — Website + Admin Platform

Premium marketing site **and** secure admin/CMS platform for ITCYBER Technologies
Pvt Ltd — custom AI agents, intelligent business automation and custom software.

**Stack:** React 18 · TypeScript (strict) · Vite · Tailwind CSS v4 · Framer Motion ·
React Router · React Three Fiber (adaptive 3D hero) · Supabase (Auth, Postgres,
Storage, Edge Functions, RLS) · Netlify.

## Run locally

```bash
npm install
npm run dev
```

The public site works **with or without** Supabase:
- Without env vars → bundled content, forms show an honest "service unavailable" error.
- With env vars (see `.env.example` + `SUPABASE_SETUP.md`) → live CMS content,
  real form storage, admin panel enabled.

## Production build

```bash
npm run build      # emits dist/
npm run typecheck  # strict TS check
```

## Backend in one paragraph

Public forms never insert into the database directly. They call the
`submit-public` Edge Function (server-side validation, honeypot, timing check,
per-email rate limit), which inserts with the service role. RLS blocks all
anonymous reads of leads/applications and enforces role-based admin permissions
(`super_admin`, `admin`, `editor`, `sales`, `hr`) server-side. Resumes upload to
the **private** `career-resumes` bucket and are opened only via 5-minute signed
URLs. See **SUPABASE_SETUP.md** for the full beginner walkthrough
(schema → auth → first admin → functions → storage → RLS verification → deploy).

## Admin panel

Sign in at `/itcyberadmin/login` (never linked from the public site, excluded in
`robots.txt`, `noindex`). Includes:

| Area | Capabilities |
| --- | --- |
| Dashboard | Real-time lead counts, 14-day chart, status funnel, sources, activity |
| Leads | Mini-CRM: search, filters, pagination, drawer, status/assign/notes, CSV export |
| Assessments | Review + stage the public automation assessment submissions |
| Services / AI Agents / Automations / Industries / Work / Resources | Full CMS (create, edit, publish, reorder, JSON fields) |
| Jobs / Applications | Role CRUD, open/close applications, stage pipeline, signed resume URLs, CSV |
| Media | Upload/preview/alt-text/replace/delete in the `site-media` bucket |
| SEO | Per-route title/description/canonical/OG/robots/schema overrides |
| Navigation / Pages | Announcement + homepage hero copy overrides |
| Settings | Company contact details (warns when incomplete — public CTAs stay hidden) |
| Users / Audit Logs | Role + activation management (super_admin), full audit trail |

## Project structure

```
src/
  admin/        admin panel (layout, CRM, CMS engine, system screens)
  components/   layout, ui kit, custom icons, workflow demos, 3D scene
  data/         centralized content + site config (fallback when CMS offline)
  lib/          supabase client, leads API, auth/roles, cms hooks, seo, motion
  pages/        public routes
  types/        hand-maintained Supabase row types
supabase/
  schema.sql    all tables + RLS + storage + triggers
  functions/submit-public/   validated public submission endpoint
```

## Netlify deployment

1. Push to GitHub → Netlify **Import project** (settings auto-read from `netlify.toml`).
2. Add the environment variables from `.env.example` under Site settings.
3. Deploy; attach `www.itcyber.in` and enable HTTPS.
Manual option: `npm run build` then drag `dist/` to https://app.netlify.com/drop.
`netlify.toml` already configures SPA redirects, asset caching and security
headers (CSP, HSTS, nosniff, frame denial, referrer + permissions policy).

## Rules this codebase follows

- No fake submissions: success states only after the backend confirms storage.
- No placeholder contact details shown publicly — unconfigured channels are hidden.
- No invented clients, metrics, testimonials or certifications; `case_type`
  distinguishes `reference` architectures from verified `real` case studies.
- Service-role keys never appear in frontend code.
