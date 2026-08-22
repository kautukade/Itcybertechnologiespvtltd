# Supabase Setup — ITCYBER (beginner-friendly)

This guide takes a brand-new Supabase project to a working production backend for **www.itcyber.in**: database + RLS, Auth, storage buckets, and the three Edge Functions that receive public form submissions.

Everything required is in this repository:

```text
supabase/
  migrations/
    0001_initial.sql                    # tables, RLS policies, storage buckets
    0002_lead_notes_and_scheduling.sql  # lead notes, announcement scheduling
    0003_security_hardening.sql         # profile guard + resume hardening
    0004_unique_constraints.sql         # idempotent seed constraints
    0005_production_hardening.sql       # media limits, case-study invariant, indexes
  functions/
    submit-contact/index.ts
    submit-assessment/index.ts
    submit-career/index.ts
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
- `anon` / publishable key → `VITE_SUPABASE_ANON_KEY`

The publishable/anon key is designed for browser use. The **service-role key must never appear in frontend code, Vite variables, screenshots, or Git**. Supabase provides it to Edge Functions server-side.

## 3. Apply migrations

### Option A — Supabase CLI (recommended)

```bash
npm i -g supabase
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
supabase migration list
```

`migration list` should show the same versions in Local and Remote.

### Option B — SQL Editor

Dashboard → **SQL Editor → New query**, then run the complete files in this exact order:

1. `supabase/migrations/0001_initial.sql`
2. `supabase/migrations/0002_lead_notes_and_scheduling.sql`
3. `supabase/migrations/0003_security_hardening.sql`
4. `supabase/migrations/0004_unique_constraints.sql`
5. `supabase/migrations/0005_production_hardening.sql`

Verify the Table Editor contains the expected tables including `profiles`, `services`, `ai_agents`, `automations`, `industries`, `case_studies`, `technologies`, `resources`, `jobs`, `contact_leads`, `lead_notes`, `automation_assessments`, `career_applications`, `media_library`, `seo_pages`, `legal_pages`, `announcements`, `social_links`, `admin_activity_logs`, and `site_settings`.

## 4. Load starter CMS content

Run `supabase/seed.sql` in SQL Editor after all migrations. It is idempotent and can be run again safely when the seed changes.

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
| `site-media` | Public | 10 MB; JPG/PNG/WEBP/AVIF/SVG/MP4 | Admin-managed website media |
| `career-resumes` | Private | 5 MB; PDF/DOC/DOCX | Applicant resumes |

Anonymous resume uploads are restricted to generated paths matching `pending/<uuid>.(pdf|doc|docx)`. Anonymous visitors cannot read, update, or delete resumes. HR/admin staff open them through short-lived signed URLs.

## 7. Deploy Edge Functions

From the linked repository:

```bash
supabase functions deploy submit-contact --no-verify-jwt
supabase functions deploy submit-assessment --no-verify-jwt
supabase functions deploy submit-career --no-verify-jwt
```

`--no-verify-jwt` is intentional because anonymous visitors submit these public forms. The functions perform their own validation and use the server-side service role for inserts.

Production origins already include:

```text
https://www.itcyber.in
https://itcyber.in
https://itcybertechnologiespvtltd.netlify.app
```

For Qwen, Netlify deploy previews, or another temporary hostname, add an extra allow-list entry:

```bash
supabase secrets set ALLOWED_ORIGINS="https://your-preview-host.example"
```

Multiple extra origins are comma-separated. Do not use `*`.

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

While testing only on the default Netlify hostname, `VITE_SITE_URL` may temporarily use that hostname. After changing any Vite variable, trigger **Clear cache and deploy site** because Vite injects these values at build time.

Never create a `VITE_SUPABASE_SERVICE_ROLE_KEY`.

## 10. Verify RLS

Anonymous visitors must not be able to read leads, assessments, applications, or admin logs, and must not be able to mutate CMS content directly. Test at minimum:

```sql
select * from public.contact_leads limit 1;
select * from public.career_applications limit 1;
select * from public.automation_assessments limit 1;
select * from public.admin_activity_logs limit 1;
```

Run those through an anon/PostgREST context, not as SQL Editor database owner. They must return no protected data.

Also verify a normal authenticated user cannot self-promote:

```sql
update public.profiles set active = true where id = auth.uid();
update public.profiles set role = 'super_admin' where id = auth.uid();
update public.profiles set email = 'x@example.com' where id = auth.uid();
```

These must fail for non-super-admin users. Updating their own `full_name` is allowed.

## 11. Production smoke test

After frontend deployment and Edge Function deployment:

1. Open `/itcyberadmin/login` and sign in with the active admin.
2. Submit the public Contact form; confirm a row in `contact_leads`.
3. Submit the assessment; confirm a row in `automation_assessments`.
4. Publish one test job with applications open, submit a small resume, and confirm the row + private storage object.
5. Close/unpublish that role and confirm the public application endpoint rejects new submissions for it.
6. In Admin → Applications, confirm the resume opens through a signed URL.
7. In Admin → Media, verify oversized/disallowed files are rejected.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Admin says “Supabase is not configured” | Add Netlify/local Vite env vars and rebuild |
| Forms return 503 | Redeploy Edge Functions and verify Supabase-provided function secrets |
| Browser shows CORS error | Add the exact preview origin to `ALLOWED_ORIGINS` |
| Admin gets RLS error | Verify the profile is active and has the required role |
| Resume upload rejected | PDF/DOC/DOCX only, ≤ 5 MB, generated `pending/<uuid>` path |
| Migration history differs | Run `supabase migration list`; do not edit already-applied historical migrations |

## Release rule

For every new production database change:

1. Create the next migration (`0006_...sql`, etc.).
2. Open a PR.
3. Let CI typecheck/build and validate Edge Functions.
4. Apply the migration to staging/production.
5. Redeploy affected Edge Functions and frontend.
6. Run the smoke tests above.
