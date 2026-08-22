# Supabase Setup — ITCYBER (beginner-friendly)

This guide takes a brand-new Supabase project to a working production backend for **www.itcyber.in**: database + RLS, Auth, storage buckets, public Edge Functions, server-side abuse controls and the signed resume-upload flow.

Everything required is in this repository:

```text
supabase/
  migrations/
    0001_initial.sql                    # tables, RLS policies, storage buckets
    0002_lead_notes_and_scheduling.sql  # lead notes, announcement scheduling
    0003_security_hardening.sql         # profile guard + resume limits
    0004_unique_constraints.sql         # idempotent seed constraints
    0005_production_hardening.sql       # media limits, invariants, indexes
    0006_security_hardening.sql         # abuse throttling, authorship guards, signed-upload model
  functions/
    _shared/security.ts
    submit-contact/index.ts
    submit-assessment/index.ts
    submit-career/index.ts
    prepare-resume-upload/index.ts
    deno.json
  seed.sql                              # optional starter CMS content
```

> There is no `supabase/schema.sql`. The schema lives in numbered migrations and they must be applied **in numeric order**. Once a migration has been applied to production, do not edit history to make a new schema change — create the next numbered migration instead.

---

## 1. Create the Supabase project

1. Go to Supabase → **New project**.
2. Choose a strong database password and the region closest to your users.
3. Wait for provisioning to finish.

## 2. Find the Project URL and publishable key

Dashboard → **Project Settings → API**:

- Project URL → `VITE_SUPABASE_URL`
- publishable / anon key → `VITE_SUPABASE_ANON_KEY`

The publishable/anon key is designed for browser use. The **service-role key must never appear in frontend code, Vite variables, screenshots, Git, or client logs**. Supabase makes server credentials available to Edge Functions at runtime.

## 3. Apply migrations

### Option A — Supabase CLI (recommended)

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
supabase migration list
```

`migration list` should show the same versions in Local and Remote, including `0006`.

### Option B — SQL Editor

Dashboard → **SQL Editor → New query**, then run the complete files in this exact order:

1. `supabase/migrations/0001_initial.sql`
2. `supabase/migrations/0002_lead_notes_and_scheduling.sql`
3. `supabase/migrations/0003_security_hardening.sql`
4. `supabase/migrations/0004_unique_constraints.sql`
5. `supabase/migrations/0005_production_hardening.sql`
6. `supabase/migrations/0006_security_hardening.sql`

Verify the Table Editor contains the expected tables including `profiles`, `services`, `ai_agents`, `automations`, `industries`, `case_studies`, `technologies`, `resources`, `jobs`, `contact_leads`, `lead_notes`, `automation_assessments`, `career_applications`, `media_library`, `seo_pages`, `legal_pages`, `announcements`, `social_links`, `admin_activity_logs`, `site_settings`, and `public_rate_limits`.

`public_rate_limits` is intentionally not readable by normal anonymous/authenticated clients. It is used by the service-role-only rate-limit function.

## 4. Load starter CMS content

Run `supabase/seed.sql` in SQL Editor after all migrations. It is designed to be repeatable where the documented unique constraints exist.

The seed intentionally leaves contact channels empty and seeds jobs unpublished/closed. Configure real contact details in Admin → Settings and publish real vacancies from Admin → Jobs.

## 5. Configure Auth

Dashboard → **Authentication → Providers → Email**:

- Keep Email enabled.
- For this private admin panel, disable public self-sign-up.
- Add staff accounts manually.

## 6. Verify Storage

Migrations create and harden:

| Bucket | Visibility | Server limits | Purpose |
| --- | --- | --- | --- |
| `site-media` | Public | 10 MB; JPG/PNG/WEBP/AVIF/MP4 | Admin-managed website media |
| `career-resumes` | Private | 5 MB; PDF/DOC/DOCX | Applicant resumes |

### Important security behavior

- Arbitrary public SVG uploads are intentionally disabled because SVG can contain active content.
- Anonymous visitors have **no direct `INSERT` policy** on `career-resumes`.
- The browser calls `prepare-resume-upload`, which validates file metadata and abuse limits server-side.
- That function generates a controlled path matching `pending/<uuid>.(pdf|doc|docx)` and returns a short-lived signed upload token.
- The browser uploads only to that signed path.
- Anonymous visitors cannot read, update or delete resumes.
- HR/admin staff open resumes through short-lived signed read URLs.

## 7. Deploy the four public Edge Functions

From the linked repository:

```bash
supabase functions deploy submit-contact --no-verify-jwt
supabase functions deploy submit-assessment --no-verify-jwt
supabase functions deploy submit-career --no-verify-jwt
supabase functions deploy prepare-resume-upload --no-verify-jwt
```

`--no-verify-jwt` is intentional because these endpoints are called by anonymous public visitors. They are not unauthenticated database writes: each function performs its own strict validation/origin checks and uses server-side credentials only after the request passes those controls.

Production origins built into the shared security layer include:

```text
https://www.itcyber.in
https://itcyber.in
https://itcybertechnologiespvtltd.netlify.app
```

For Qwen, Netlify deploy previews, or another temporary hostname, add the exact additional origin:

```bash
supabase secrets set ALLOWED_ORIGINS="https://your-preview-host.example"
```

Multiple extra origins are comma-separated. Do not use `*`.

For rate-limit fingerprinting, configure a dedicated random server secret rather than putting any value in frontend environment variables:

```bash
supabase secrets set RATE_LIMIT_PEPPER="<long-random-server-only-value>"
```

Never commit `RATE_LIMIT_PEPPER` or the service-role key.

## 8. Create the first admin

Never store an admin password in code or docs.

1. Dashboard → **Authentication → Users → Add user**.
2. Enter the trusted admin email and password; auto-confirm the user.
3. The auth trigger creates the profile.
4. In SQL Editor promote that specific account:

```sql
update public.profiles
set role = 'super_admin',
    active = true
where email = 'you@itcyber.in'
returning id, email, role, active;
```

Expected: one row with `role = super_admin` and `active = true`.

Other roles are `admin`, `editor`, `sales`, and `hr`.

## 9. Configure frontend environment variables

### Local development

Copy `.env.example` to `.env` and set:

```env
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
VITE_SITE_URL=http://localhost:5173
```

Restart Vite after environment changes.

### Netlify

Netlify → Site configuration → **Environment variables**:

```text
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<publishable-key>
VITE_SITE_URL=https://www.itcyber.in
```

After changing a Vite variable, trigger a fresh deploy because Vite injects these values at build time.

Never create `VITE_SUPABASE_SERVICE_ROLE_KEY`, `VITE_RATE_LIMIT_PEPPER`, or any other frontend variable containing a server secret.

## 10. Verify RLS and privilege guards

Anonymous visitors must not be able to read leads, assessments, applications, admin logs, lead-note internals, or the rate-limit ledger, and must not be able to mutate CMS content directly.

Test through an anon/PostgREST context, not as SQL Editor database owner. Protected tables must return no protected data.

Also verify a normal authenticated user cannot self-promote:

```sql
update public.profiles set active = true where id = auth.uid();
update public.profiles set role = 'super_admin' where id = auth.uid();
update public.profiles set email = 'x@example.com' where id = auth.uid();
```

These must fail for non-super-admin users. Updating their own allowed profile fields such as `full_name` remains permitted.

Also verify:

- audit log inserts cannot claim another staff member's `user_id`;
- a sales user cannot create a lead note under another staff member's identity;
- anonymous direct inserts into `career-resumes` are rejected;
- `public_rate_limits` cannot be read or mutated by `anon` / normal `authenticated` users.

## 11. Production smoke test

After frontend deployment, migration `0006`, and all four Edge Functions are live:

1. Open `/itcyberadmin/login` and sign in with an active admin.
2. Submit the public Contact form; confirm a row in `contact_leads`.
3. Submit the assessment; confirm a row in `automation_assessments`.
4. Publish one test job with applications open.
5. Submit a small PDF/DOC/DOCX resume and confirm:
   - `prepare-resume-upload` returns successfully,
   - the private storage object is created under `pending/`,
   - a row appears in `career_applications`.
6. Close/unpublish that role and confirm `submit-career` rejects new submissions for it.
7. In Admin → Applications, confirm the resume opens through a short-lived signed URL.
8. In Admin → Media, verify SVG and oversized/disallowed files are rejected.
9. Export Leads and Applications CSVs with a test value beginning with `=`, `+`, `-`, or `@`; confirm the exported value is neutralized rather than interpreted as a spreadsheet formula.
10. Test a disallowed Origin against the public Edge Functions; confirm it receives `403 Origin not allowed`.

## 12. Repository security verification

Before production releases run:

```bash
npm ci
node scripts/security-check.mjs
npm run typecheck
npm audit --omit=dev --audit-level=moderate
npm run build
```

GitHub CI runs the same security regression checks, production dependency audit, TypeScript build, and Deno checks for all four Edge Functions.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Admin says “Supabase is not configured” | Add Netlify/local Vite env vars and rebuild |
| Forms return 503 | Verify migration `0006`, redeploy the Edge Functions, and check server-side function secrets/logs |
| Browser shows CORS error / 403 | Add the exact trusted preview origin to `ALLOWED_ORIGINS`; never use `*` |
| Admin gets RLS error | Verify the profile is active and has the required role |
| Resume upload preparation rejected | PDF/DOC/DOCX only, 1 byte–5 MB, correct MIME/extension, allowed origin |
| Resume token works but upload fails | Verify `career-resumes` is private and the signed-upload flow is deployed; do not restore an anonymous INSERT policy |
| Media SVG rejected | Expected security behavior; use PNG/WEBP/AVIF/JPG or MP4 instead |
| Migration history differs | Run `supabase migration list`; do not edit already-applied historical migrations |
| CI dependency audit fails | Upgrade/remove the vulnerable production dependency; do not lower the audit threshold to hide it |

## Release rule

For every new production database change:

1. Create the next migration (`0007_...sql` after the current `0006`).
2. Open a PR.
3. Let CI run security regression checks, dependency audit, TypeScript/build, and Deno validation.
4. Apply the migration to staging/production.
5. Redeploy affected Edge Functions and frontend.
6. Run the production smoke tests above.

Do not rewrite already-applied migration files to make future schema changes.
