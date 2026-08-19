# ITCYBER — Supabase Backend Setup (beginner friendly)

This guide takes you from an empty Supabase account to a fully working
website + admin panel. Every step is done in a browser or terminal — no prior
backend experience required.

## 1. Create a Supabase project

1. Go to https://supabase.com → **Start your project** (GitHub login works).
2. **New project** → name it `itcyber` → set a strong database password (save it in a password manager) → pick a region close to India (e.g. Mumbai `ap-south-1`) → **Create**.
3. Wait ~1 minute for provisioning.

## 2. Add environment variables

1. In your local project, copy the example file:
   ```bash
   cp .env.example .env
   ```
2. In the Supabase dashboard open **Project Settings → API** and copy:
   - **Project URL** → paste into `VITE_SUPABASE_URL`
   - **anon public key** → paste into `VITE_SUPABASE_ANON_KEY`
3. Optionally fill the contact variables (`VITE_WHATSAPP_NUMBER` etc.). If left
   empty, phone/WhatsApp CTAs stay hidden until you configure them in
   **Admin → Settings**.
4. **Never** put the `service_role` key in `.env` or any frontend file. It only
   ever lives inside Supabase Edge Functions.

## 3. Run the database migrations

1. In the dashboard open **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this repo, copy the *entire* file, paste it
   into the query box and press **Run**.
   - This creates all 19 tables, RLS policies, storage buckets and triggers.
3. (Optional CLI way: `supabase link --project-ref <ref>` then `supabase db push`.)

## 4. Configure Auth

1. **Authentication → Providers → Email**: keep it enabled. For your own admin
   accounts, you can leave "Confirm email" on — you'll confirm via your inbox.
2. No other providers are required.

## 5. Create the first admin (safely)

1. **Authentication → Users → Add user** → enter your email + a strong
   password → check **Auto confirm user** → **Create user**.
   The schema trigger automatically creates a `profiles` row (inactive editor).
2. Open **SQL Editor** and run:
   ```sql
   update public.profiles
   set role = 'super_admin', active = true
   where email = 'you@itcyber.in';
   ```
   (Replace with your real email.) **Never commit this email/password anywhere.**

## 6. Deploy the Edge Function (secure public submissions)

You need the Supabase CLI (https://supabase.com/docs/guides/cli) and Docker
running locally.

```bash
supabase login
supabase link --project-ref <your-project-ref>     # shown in Project Settings → General
supabase secrets set SUBMIT_ALLOWED_ORIGIN=https://www.itcyber.in
supabase functions deploy submit-public
```

> Without the function deployed, public forms show an honest error instead of a
> fake success — that's intentional.

## 7. Configure Storage

Buckets `site-media` (public) and `career-resumes` (private) are created by the
schema. Nothing else to do — RLS already restricts:

- `site-media`: anyone reads; only editor/admin/super_admin write.
- `career-resumes`: anonymous uploads allowed **only** into `pending/*.pdf|doc|docx`;
  only hr/admin/super_admin can read (via signed URLs) or delete.

## 8. Verify RLS (anonymous users must not read private data)

In **SQL Editor**, switch to the "anon" role check by running:

```sql
set role anon;
select count(*) from public.contact_leads;      -- must ERROR with permission denied
select count(*) from public.career_applications;-- must ERROR with permission denied
select count(*) from public.services where published = true; -- must succeed
reset role;
```

If the first two queries return rows instead of an error, re-run `schema.sql`.

## 9. Run locally & test

```bash
npm install
npm run dev
```

- **Public site** loads with bundled content (works even without Supabase).
- **Contact page → Project Brief**: submit the form; it should show success
  *only* after the Edge Function stored it. Verify in
  **Supabase → Table Editor → contact_leads**.
- **Assessment** (`/contact?mode=assessment`) and **Careers** (with a real
  resume upload) write to `automation_assessments` / `career_applications`.
- **Admin**: open `/itcyberadmin/login`, sign in with your admin user.
  Explore Dashboard, Leads CRM, CMS screens, Settings (set the real WhatsApp
  number there — the floating button appears on the public site afterwards).

## 10. Deploy to Netlify

1. Push the repo to GitHub.
2. Netlify → **Add new site → Import project** → choose the repo.
3. Build settings are auto-read from `netlify.toml` (`npm run build`, publish `dist`).
4. **Site settings → Environment variables**: add every variable from `.env`
   (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SITE_URL`, optional
   contact + analytics vars).
5. **Deploy site** → add your custom domain (`www.itcyber.in`) and enable HTTPS.
6. Update `SUBMIT_ALLOWED_ORIGIN` if your production origin differs.

## Operational notes

- **Roles**: super_admin · admin · editor · sales · hr — enforced by RLS, not just the UI.
- **New admins**: create the auth user (step 5.1), then activate + assign a role in **Admin → Users**.
- **Audit trail**: every meaningful admin action lands in `admin_activity_logs`.
- **Backups**: enable Supabase Point-in-Time Recovery for production.
