# Supabase Setup — ITCYBER (beginner-friendly)

This guide takes a brand-new Supabase project to a fully working backend for
**www.itcyber.in**: database + RLS, Auth, storage buckets, and the three Edge
Functions that receive public form submissions.

Everything you need is already in this repository:

```
supabase/
  migrations/
    0001_initial.sql                    ← all tables, RLS policies, storage buckets
    0002_lead_notes_and_scheduling.sql  ← lead_notes, announcement scheduling
    0003_security_hardening.sql         ← profile privilege-escalation guard,
                                          resume bucket limits, strict upload paths
  functions/
    submit-contact/index.ts             ← validates + stores contact leads
    submit-assessment/index.ts          ← validates + stores assessments
    submit-career/index.ts              ← validates + stores job applications
  seed.sql                              ← optional starter content for the CMS
```

> There is no `supabase/schema.sql` — the schema lives in the numbered files
> under `supabase/migrations/` and must be applied **in numeric order**.

---

## 1. Create the Supabase project

1. Go to https://supabase.com → **New project**.
2. Choose a name (e.g. `itcyber`), a strong database password (store it in a
   password manager), and the region closest to your users.
3. Wait for provisioning to finish.

## 2. Find your Project URL and anon key

Dashboard → **Project Settings → API**:

- **Project URL** → this is `VITE_SUPABASE_URL`
- **`anon` / `publishable` key** → this is `VITE_SUPABASE_ANON_KEY`

The anon key is safe for the browser. The **`service_role` key is NOT** — it
must never appear in frontend code or in Git. It is only used by Edge
Functions, and Supabase injects it into functions automatically.

## 3. Apply the migrations

### Option A — Supabase CLI (recommended)

```bash
npm i -g supabase            # one-time
supabase login               # opens a browser to authorize
supabase link --project-ref <your-project-ref>   # ref is in the project URL
supabase db push             # applies every migration in order
```

### Option B — SQL Editor

1. Dashboard → **SQL Editor → New query**.
2. Paste the full contents of `supabase/migrations/0001_initial.sql` → **Run**.
3. Repeat for `0002_lead_notes_and_scheduling.sql`, then
   `0003_security_hardening.sql` — **in this numeric order**.

Verify: Dashboard → **Table Editor** should now show `profiles`, `services`,
`ai_agents`, `automations`, `industries`, `case_studies`, `technologies`,
`resources`, `jobs`, `contact_leads`, `lead_notes`, `automation_assessments`,
`career_applications`, `media_library`, `seo_pages`, `legal_pages`,
`announcements`, `social_links`, `admin_activity_logs`, `site_settings`.

## 4. (Optional) Load starter content

Run `supabase/seed.sql` in the SQL Editor. It inserts the services, agents,
industries and jobs the public site ships with, so the CMS starts populated.
Skip it if you plan to author content from the admin panel only.

## 5. Configure Auth

Dashboard → **Authentication → Providers → Email**:

- Keep **Email** enabled.
- For a private admin panel, disable self-sign-up (**Sign-ups → turn off**)
  and add admins manually (step 8). This prevents strangers from creating
  login accounts that would sit in `profiles` as inactive editors.

## 6. Configure storage

The migrations already create both buckets with the right visibility:

| Bucket | Visibility | Purpose |
| --- | --- | --- |
| `site-media` | **Public** | Website images managed in Admin → Media |
| `career-resumes` | **Private** | Applicant resumes — never public |

`0003_security_hardening.sql` additionally sets, **server-side**:

- `career-resumes` max file size: **5 MB** (`file_size_limit`)
- `career-resumes` allowed MIME types: **PDF / DOC / DOCX** only
- anonymous uploads restricted to paths matching
  `pending/<uuid>.(pdf|doc|docx)` — no traversal, no arbitrary names, no
  overwrites (anon has INSERT only; reads are via **signed URLs** by HR/admin)

Check both buckets exist under **Storage** and that `career-resumes` shows
*Private*.

## 7. Deploy the Edge Functions

```bash
supabase functions deploy submit-contact    --no-verify-jwt
supabase functions deploy submit-assessment --no-verify-jwt
supabase functions deploy submit-career     --no-verify-jwt
```

(`--no-verify-jwt` is required because anonymous visitors submit these forms.)

The functions read two settings:

- `SUPABASE_SERVICE_ROLE_KEY` — injected by Supabase automatically. **The
  functions fail closed (HTTP 503) if it is missing — they never fall back to
  the anon key.**
- `ALLOWED_ORIGINS` — *optional*. Comma-separated extra origins allowed by
  CORS (e.g. a Netlify deploy-preview URL for testing):

  ```bash
  supabase secrets set ALLOWED_ORIGINS="https://deploy-preview-12--yoursite.netlify.app"
  ```

  Production CORS already allow-lists `https://www.itcyber.in` and
  `https://itcyber.in`. Wildcards are not supported by design.

## 8. Create the first admin (safely)

Never put an admin password in code or docs.

1. Dashboard → **Authentication → Users → Add user**.
2. Enter the admin's email + password, tick **Auto confirm user**.
   (The `handle_new_user` trigger creates their `profiles` row automatically.)
3. In the **SQL Editor**, promote them:

   ```sql
   update public.profiles
      set role   = 'super_admin',
          active = true
    where email  = 'you@itcyber.in';   -- ← the email you just added
   ```

Other roles: `admin`, `editor`, `sales`, `hr`. New accounts start
`active = false` on purpose — a super_admin activates them from
**Admin → Users**.

## 9. Add frontend environment variables

**Netlify** → Site configuration → **Environment variables** (never in Git):

```
VITE_SUPABASE_URL=<Project URL from step 2>
VITE_SUPABASE_ANON_KEY=<anon key from step 2>
VITE_SITE_URL=https://www.itcyber.in
```

Locally, copy `.env.example` to `.env` and fill the same three values.
`.gitignore` already blocks `.env`.

## 10. Verify RLS is actually protecting data

In the SQL Editor, run each of these **as the anon role** (tick "Run as
authenticated user: OFF" — or use the built-in *PostgREST anon* context).
Every one must return a permission error or zero rows:

```sql
-- anonymous reads MUST fail / return nothing
select * from public.contact_leads limit 1;
select * from public.career_applications limit 1;
select * from public.automation_assessments limit 1;
select * from public.admin_activity_logs limit 1;

-- anonymous writes MUST fail
update public.services set published = true where slug = 'custom-software';
delete from public.jobs;
```

Then verify the **profile privilege guard** (migration 0003). Log in as a
non-super_admin (e.g. an `editor`) and run against *their own* row:

```sql
update public.profiles set active = true            where id = auth.uid(); -- MUST FAIL
update public.profiles set role   = 'super_admin'   where id = auth.uid(); -- MUST FAIL
update public.profiles set email  = 'x@x.io'        where id = auth.uid(); -- MUST FAIL
update public.profiles set full_name = 'New Name'   where id = auth.uid(); -- allowed
```

And as **super_admin**:

```sql
update public.profiles set role = 'sales', active = true
 where email = 'someone@itcyber.in';                                       -- allowed
```

Storage check: an anonymous 6 MB PDF upload to `career-resumes` must be
rejected (size limit); a `.png` must be rejected (MIME); an upload to
`resumes/evil.pdf` must be rejected (path policy).

## 11. Smoke-test the forms

1. Deploy the frontend (see `NETLIFY_DEPLOYMENT.md`).
2. Submit the contact form, the assessment wizard, and a job application
   (with a small PDF resume).
3. In the Supabase Table Editor confirm rows appear in `contact_leads`,
   `automation_assessments` and `career_applications` — and the resume object
   under `career-resumes/pending/`.
4. Sign in at `/itcyberadmin/login` and verify the new lead appears on the
   dashboard.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Forms show "submission service isn't reachable" | Frontend env vars missing — step 9 |
| Forms fail with 503 | Function can't see the service-role key — redeploy after `supabase secrets set` |
| CORS error in browser console | Origin not allow-listed — set `ALLOWED_ORIGINS` (step 7) |
| "row-level security policy violation" in admin | Profile is inactive or role missing — step 8 |
| Resume upload rejected | File must be PDF/DOC/DOCX, ≤ 5 MB, auto-named under `pending/` |
