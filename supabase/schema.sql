-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD — Supabase schema, RLS & storage
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ───────────────────────── helpers ─────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Role of the currently authenticated user (security definer so policies
-- can read profiles without a separate select grant).
create or replace function public.current_app_role()
returns text language sql security definer set search_path = public stable as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'none')
$$;

create or replace function public.is_active_profile()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active = true)
$$;

-- ───────────────────────── profiles ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'editor' check (role in ('super_admin','admin','editor','sales','hr')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile for every new auth user (inactive until an admin activates it).
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role, active)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''), 'editor', false)
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ───────────────────────── CMS tables ─────────────────────────
create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),
  company_name text, legal_name text, tagline text, description text,
  email text, sales_email text, careers_email text,
  phone text, whatsapp_number text, address text, business_hours text,
  logo_url text, logo_dark_url text, favicon_url text, default_og_image text,
  homepage jsonb not null default '{}'::jsonb,
  navigation jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger site_settings_updated before update on public.site_settings
  for each row execute function public.set_updated_at();

create table if not exists public.services (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  short_description text,
  full_description text,
  category text not null default 'automation',
  icon text,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  seo_title text, seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ai_agents (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  role text,
  description text,
  inputs text,
  actions text,
  systems text,
  outputs text,
  handoff text,
  demo_type text not null default 'chat',
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.automations (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  category text not null default 'sales',
  description text,
  workflow_json jsonb not null default '[]'::jsonb,
  integrations_json jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.industries (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  short_description text,
  hero_description text,
  challenges_json jsonb not null default '[]'::jsonb,
  opportunities_json jsonb not null default '[]'::jsonb,
  automations_json jsonb not null default '[]'::jsonb,
  workflow_json jsonb not null default '[]'::jsonb,
  integrations_json jsonb not null default '[]'::jsonb,
  agents_json jsonb not null default '[]'::jsonb,
  faq_json jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  sort_order integer not null default 0,
  seo_title text, seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.case_studies (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  client_name text,
  industry text,
  case_type text not null default 'reference' check (case_type in ('real','reference')),
  challenge text,
  previous_process text,
  solution text,
  architecture_json jsonb not null default '[]'::jsonb,
  integrations_json jsonb not null default '[]'::jsonb,
  results_json jsonb not null default '[]'::jsonb,
  testimonial text,
  client_logo text,
  featured_image text,
  verified boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.technologies (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null default 'development',
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  kind text not null default 'playbook',
  summary text,
  body text,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  department text not null default 'Engineering',
  location text not null default 'Remote (India)',
  employment_type text not null default 'Full-time',
  experience text,
  description text,
  responsibilities_json jsonb not null default '[]'::jsonb,
  requirements_json jsonb not null default '[]'::jsonb,
  salary_range text,
  published boolean not null default false,
  applications_open boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.legal_pages (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  body text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seo_pages (
  id uuid primary key default uuid_generate_v4(),
  route text unique not null,
  title text, description text, keywords text, canonical text,
  og_title text, og_description text, og_image text, robots text,
  schema_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger seo_pages_updated before update on public.seo_pages
  for each row execute function public.set_updated_at();

create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  text text not null,
  cta_label text, cta_to text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.social_links (
  id uuid primary key default uuid_generate_v4(),
  label text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ───────────────────────── lead / application tables ─────────────────────────
create table if not exists public.contact_leads (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  company text, email text not null, phone text, website text,
  industry text, company_size text,
  automation_interest text, existing_tools text, budget_range text,
  preferred_contact text, message text,
  source_page text, utm_source text, utm_medium text, utm_campaign text,
  status text not null default 'new'
    check (status in ('new','contacted','qualified','proposal','won','lost','spam')),
  assigned_to uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger contact_leads_updated before update on public.contact_leads
  for each row execute function public.set_updated_at();

create table if not exists public.automation_assessments (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  company text, email text not null, phone text,
  requirement text, industry text, business_problem text,
  existing_tools text, budget text, timeline text,
  answers_json jsonb not null default '{}'::jsonb,
  status text not null default 'new' check (status in ('new','reviewed','converted','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger automation_assessments_updated before update on public.automation_assessments
  for each row execute function public.set_updated_at();

create table if not exists public.career_applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references public.jobs (id) on delete set null,
  name text not null,
  email text not null,
  phone text, location text, experience text,
  linkedin_url text, portfolio_url text,
  resume_path text,               -- private storage path inside `career-resumes`
  message text,
  status text not null default 'new'
    check (status in ('new','screening','shortlisted','interview','selected','rejected')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger career_applications_updated before update on public.career_applications
  for each row execute function public.set_updated_at();

create table if not exists public.media_library (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  file_type text not null,
  storage_path text not null,
  public_url text not null,
  alt_text text,
  folder text not null default 'general',
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- Apply updated_at triggers to the remaining CMS tables
do $$
declare t text;
begin
  foreach t in array array['services','ai_agents','automations','industries','case_studies',
                           'technologies','resources','jobs','legal_pages','announcements',
                           'social_links','media_library']
  loop
    execute format('drop trigger if exists %I_updated on public.%I; 
                    create trigger %I_updated before update on public.%I
                    for each row execute function public.set_updated_at();', t, t, t, t);
  end loop;
end $$;

-- ═════════════════════════ RLS ═════════════════════════
alter table public.profiles enable row level security;
alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.ai_agents enable row level security;
alter table public.automations enable row level security;
alter table public.industries enable row level security;
alter table public.case_studies enable row level security;
alter table public.technologies enable row level security;
alter table public.resources enable row level security;
alter table public.jobs enable row level security;
alter table public.legal_pages enable row level security;
alter table public.seo_pages enable row level security;
alter table public.announcements enable row level security;
alter table public.social_links enable row level security;
alter table public.contact_leads enable row level security;
alter table public.automation_assessments enable row level security;
alter table public.career_applications enable row level security;
alter table public.media_library enable row level security;
alter table public.admin_activity_logs enable row level security;

-- ── profiles ──
create policy "profiles read own" on public.profiles for select
  using (id = auth.uid() or public.current_app_role() in ('super_admin','admin','hr'));
create policy "profiles update self" on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));
create policy "profiles super_admin manage" on public.profiles for all
  using (public.current_app_role() = 'super_admin') with check (public.current_app_role() = 'super_admin');

-- ── public read: published content only ──
create policy "public read settings" on public.site_settings for select using (true);
create policy "public read legal" on public.legal_pages for select using (true);
create policy "public read announcements" on public.announcements for select using (active = true);
create policy "public read socials" on public.social_links for select using (true);
create policy "public read seo" on public.seo_pages for select using (true);

do $$
declare t text;
begin
  foreach t in array array['services','ai_agents','automations','industries','case_studies','technologies','resources']
  loop
    execute format('create policy "public read published %s" on public.%I for select using (published = true);', t, t);
  end loop;
end $$;
create policy "public read jobs" on public.jobs for select using (published = true);

-- ── anonymous users can NEVER insert/update/delete CMS or lead tables ──
-- (Public submissions flow through the `submit-public` Edge Function, which
--  uses the service role after server-side validation.)

-- ── admin write policies by role ──
do $$
declare t text;
begin
  -- content tables: editor, admin, super_admin
  foreach t in array array['services','ai_agents','automations','industries','case_studies','technologies','resources']
  loop
    execute format('create policy "content manage %s" on public.%I for all using (public.is_active_profile() and public.current_app_role() in (''editor'',''admin'',''super_admin'')) with check (public.is_active_profile() and public.current_app_role() in (''editor'',''admin'',''super_admin''));', t, t);
  end loop;
end $$;

create policy "settings manage" on public.site_settings for all
  using (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'));
create policy "legal manage" on public.legal_pages for all
  using (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'));
create policy "seo manage" on public.seo_pages for all
  using (public.is_active_profile() and public.current_app_role() in ('editor','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('editor','admin','super_admin'));
create policy "announcements manage" on public.announcements for all
  using (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'));
create policy "socials manage" on public.social_links for all
  using (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'));
create policy "media manage" on public.media_library for all
  using (public.is_active_profile() and public.current_app_role() in ('editor','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('editor','admin','super_admin'));

-- leads & assessments: sales, admin, super_admin
create policy "leads manage" on public.contact_leads for all
  using (public.is_active_profile() and public.current_app_role() in ('sales','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('sales','admin','super_admin'));
create policy "assessments manage" on public.automation_assessments for all
  using (public.is_active_profile() and public.current_app_role() in ('sales','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('sales','admin','super_admin'));

-- jobs & applications: hr, admin, super_admin (sales may read applications? no — hr scope)
create policy "jobs manage" on public.jobs for all
  using (public.is_active_profile() and public.current_app_role() in ('hr','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('hr','admin','super_admin'));
create policy "applications manage" on public.career_applications for all
  using (public.is_active_profile() and public.current_app_role() in ('hr','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('hr','admin','super_admin'));

create policy "audit read" on public.admin_activity_logs for select
  using (public.is_active_profile() and public.current_app_role() in ('admin','super_admin'));
create policy "audit insert" on public.admin_activity_logs for insert
  with check (public.is_active_profile() and public.current_app_role() in ('editor','sales','hr','admin','super_admin'));

-- ═════════════════════════ STORAGE ═════════════════════════
insert into storage.buckets (id, name, public) values ('site-media', 'site-media', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('career-resumes', 'career-resumes', false)
  on conflict (id) do nothing;

-- site-media: anyone can read (public bucket); only content roles can write/delete
create policy "site-media public read" on storage.objects for select
  using (bucket_id = 'site-media');
create policy "site-media admin write" on storage.objects for insert
  with check (bucket_id = 'site-media' and public.is_active_profile()
    and public.current_app_role() in ('editor','admin','super_admin'));
create policy "site-media admin update" on storage.objects for update
  using (bucket_id = 'site-media' and public.is_active_profile()
    and public.current_app_role() in ('editor','admin','super_admin'));
create policy "site-media admin delete" on storage.objects for delete
  using (bucket_id = 'site-media' and public.is_active_profile()
    and public.current_app_role() in ('admin','super_admin'));

-- career-resumes: anonymous applicants may upload once into pending/<uuid>.*
-- (path prefix enforced; file type/size validated client-side AND by the
--  Edge Function that creates the application row). Only HR/admins can read,
--  via signed URLs; they may also delete.
create policy "resumes anon upload" on storage.objects for insert
  with check (bucket_id = 'career-resumes'
    and (storage.foldername(name))[1] = 'pending'
    and lower(name) ~ '\.(pdf|doc|docx)$');
create policy "resumes staff read" on storage.objects for select
  using (bucket_id = 'career-resumes' and public.is_active_profile()
    and public.current_app_role() in ('hr','admin','super_admin'));
create policy "resumes staff delete" on storage.objects for delete
  using (bucket_id = 'career-resumes' and public.is_active_profile()
    and public.current_app_role() in ('hr','admin','super_admin'));

-- ═════════════════════════ FIRST ADMIN ═════════════════════════
-- 1. In Supabase Dashboard → Authentication → Users → "Add user" (email + password,
--    check "Auto confirm user"). The trigger above creates their profile automatically.
-- 2. Then run (substituting the real email):
--      update public.profiles set role = 'super_admin', active = true
--      where email = 'you@itcyber.in';
-- Never commit credentials anywhere in this repository.
