-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD
-- Migration 0001 — Initial schema, RLS & Storage
-- Safe replacement for fresh / partially initialized Supabase project
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";


-- ═════════════════════════ HELPERS ═════════════════════════

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end
$$;


-- ═════════════════════════ PROFILES ═════════════════════════
-- IMPORTANT:
-- profiles MUST exist before current_app_role() and is_active_profile().

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text not null default 'editor'
    check (role in ('super_admin','admin','editor','sales','hr')),
  active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_updated on public.profiles;

create trigger profiles_updated
  before update on public.profiles
  for each row
  execute function public.set_updated_at();


-- ═════════════════════════ AUTH HELPERS ═════════════════════════

create or replace function public.current_app_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (
      select role
      from public.profiles
      where id = auth.uid()
    ),
    'none'
  )
$$;


create or replace function public.is_active_profile()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and active = true
  )
$$;


create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    role,
    active
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'editor',
    false
  )
  on conflict (id) do nothing;

  return new;
end
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();


-- ═════════════════════════ SITE SETTINGS ═════════════════════════

create table if not exists public.site_settings (
  id uuid primary key default uuid_generate_v4(),

  company_name text,
  legal_name text,
  tagline text,
  description text,

  email text,
  sales_email text,
  careers_email text,

  phone text,
  whatsapp_number text,
  address text,
  business_hours text,

  logo_url text,
  logo_dark_url text,
  favicon_url text,
  default_og_image text,

  homepage jsonb not null default '{}'::jsonb,
  navigation jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists site_settings_updated on public.site_settings;

create trigger site_settings_updated
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();


-- ═════════════════════════ SERVICES ═════════════════════════

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

  seo_title text,
  seo_description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ AI AGENTS ═════════════════════════

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


-- ═════════════════════════ AUTOMATIONS ═════════════════════════

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


-- ═════════════════════════ INDUSTRIES ═════════════════════════

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

  seo_title text,
  seo_description text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ CASE STUDIES ═════════════════════════

create table if not exists public.case_studies (
  id uuid primary key default uuid_generate_v4(),

  slug text unique not null,
  title text not null,

  client_name text,
  industry text,

  case_type text not null default 'reference'
    check (case_type in ('real','reference')),

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


-- ═════════════════════════ TECHNOLOGIES ═════════════════════════

create table if not exists public.technologies (
  id uuid primary key default uuid_generate_v4(),

  name text not null,
  category text not null default 'development',

  published boolean not null default true,
  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ RESOURCES ═════════════════════════

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


-- ═════════════════════════ JOBS ═════════════════════════

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


-- ═════════════════════════ LEGAL ═════════════════════════

create table if not exists public.legal_pages (
  id uuid primary key default uuid_generate_v4(),

  slug text unique not null,
  title text not null,

  body text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ SEO ═════════════════════════

create table if not exists public.seo_pages (
  id uuid primary key default uuid_generate_v4(),

  route text unique not null,

  title text,
  description text,
  keywords text,
  canonical text,

  og_title text,
  og_description text,
  og_image text,

  robots text,

  schema_json jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists seo_pages_updated on public.seo_pages;

create trigger seo_pages_updated
  before update on public.seo_pages
  for each row
  execute function public.set_updated_at();


-- ═════════════════════════ ANNOUNCEMENTS ═════════════════════════

create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),

  text text not null,

  cta_label text,
  cta_to text,

  active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ SOCIAL LINKS ═════════════════════════

create table if not exists public.social_links (
  id uuid primary key default uuid_generate_v4(),

  label text not null,
  href text not null,

  sort_order integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ CONTACT LEADS ═════════════════════════

create table if not exists public.contact_leads (
  id uuid primary key default uuid_generate_v4(),

  full_name text not null,

  company text,
  email text not null,
  phone text,
  website text,

  industry text,
  company_size text,

  automation_interest text,
  existing_tools text,
  budget_range text,

  preferred_contact text,
  message text,

  source_page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,

  status text not null default 'new'
    check (
      status in (
        'new',
        'contacted',
        'qualified',
        'proposal',
        'won',
        'lost',
        'spam'
      )
    ),

  assigned_to uuid
    references public.profiles (id)
    on delete set null,

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists contact_leads_updated on public.contact_leads;

create trigger contact_leads_updated
  before update on public.contact_leads
  for each row
  execute function public.set_updated_at();


-- ═════════════════════════ ASSESSMENTS ═════════════════════════

create table if not exists public.automation_assessments (
  id uuid primary key default uuid_generate_v4(),

  full_name text not null,

  company text,
  email text not null,
  phone text,

  requirement text,
  industry text,
  business_problem text,

  existing_tools text,
  budget text,
  timeline text,

  answers_json jsonb not null default '{}'::jsonb,

  status text not null default 'new'
    check (
      status in (
        'new',
        'reviewed',
        'converted',
        'archived'
      )
    ),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists automation_assessments_updated
  on public.automation_assessments;

create trigger automation_assessments_updated
  before update on public.automation_assessments
  for each row
  execute function public.set_updated_at();


-- ═════════════════════════ CAREER APPLICATIONS ═════════════════════════

create table if not exists public.career_applications (
  id uuid primary key default uuid_generate_v4(),

  job_id uuid
    references public.jobs (id)
    on delete set null,

  name text not null,
  email text not null,

  phone text,
  location text,
  experience text,

  linkedin_url text,
  portfolio_url text,

  resume_path text,
  message text,

  status text not null default 'new'
    check (
      status in (
        'new',
        'screening',
        'shortlisted',
        'interview',
        'selected',
        'rejected'
      )
    ),

  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists career_applications_updated
  on public.career_applications;

create trigger career_applications_updated
  before update on public.career_applications
  for each row
  execute function public.set_updated_at();


-- ═════════════════════════ MEDIA LIBRARY ═════════════════════════

create table if not exists public.media_library (
  id uuid primary key default uuid_generate_v4(),

  name text not null,
  file_type text not null,

  storage_path text not null,
  public_url text not null,

  alt_text text,

  folder text not null default 'general',

  uploaded_by uuid
    references public.profiles (id)
    on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- ═════════════════════════ ADMIN ACTIVITY ═════════════════════════

create table if not exists public.admin_activity_logs (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid
    references public.profiles (id)
    on delete set null,

  action text not null,
  entity_type text not null,
  entity_id text,

  old_data jsonb,
  new_data jsonb,

  created_at timestamptz not null default now()
);


-- ═════════════════════════ UPDATED_AT TRIGGERS ═════════════════════════

do $$
declare
  t text;
begin

  foreach t in array array[
    'services',
    'ai_agents',
    'automations',
    'industries',
    'case_studies',
    'technologies',
    'resources',
    'jobs',
    'legal_pages',
    'announcements',
    'social_links',
    'media_library'
  ]

  loop

    execute format(
      'drop trigger if exists %I_updated on public.%I',
      t,
      t
    );

    execute format(
      'create trigger %I_updated
       before update on public.%I
       for each row
       execute function public.set_updated_at()',
      t,
      t
    );

  end loop;

end
$$;


-- ═════════════════════════ ENABLE RLS ═════════════════════════

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


-- ═════════════════════════ PROFILE POLICIES ═════════════════════════

drop policy if exists "profiles read own"
on public.profiles;

create policy "profiles read own"
on public.profiles
for select
using (
  id = auth.uid()
  or public.current_app_role() in (
    'super_admin',
    'admin',
    'hr'
  )
);


drop policy if exists "profiles update self"
on public.profiles;

create policy "profiles update self"
on public.profiles
for update
using (
  id = auth.uid()
)
with check (
  id = auth.uid()
  and role = (
    select role
    from public.profiles
    where id = auth.uid()
  )
);


drop policy if exists "profiles super_admin manage"
on public.profiles;

create policy "profiles super_admin manage"
on public.profiles
for all
using (
  public.current_app_role() = 'super_admin'
)
with check (
  public.current_app_role() = 'super_admin'
);


-- ═════════════════════════ PUBLIC READ POLICIES ═════════════════════════

drop policy if exists "public read settings"
on public.site_settings;

create policy "public read settings"
on public.site_settings
for select
using (true);


drop policy if exists "public read legal"
on public.legal_pages;

create policy "public read legal"
on public.legal_pages
for select
using (true);


drop policy if exists "public read announcements"
on public.announcements;

create policy "public read announcements"
on public.announcements
for select
using (
  active = true
);


drop policy if exists "public read socials"
on public.social_links;

create policy "public read socials"
on public.social_links
for select
using (true);


drop policy if exists "public read seo"
on public.seo_pages;

create policy "public read seo"
on public.seo_pages
for select
using (true);


do $$
declare
  t text;
  policy_name text;
begin

  foreach t in array array[
    'services',
    'ai_agents',
    'automations',
    'industries',
    'case_studies',
    'technologies',
    'resources'
  ]

  loop

    policy_name := 'public read published ' || t;

    execute format(
      'drop policy if exists %I on public.%I',
      policy_name,
      t
    );

    execute format(
      'create policy %I
       on public.%I
       for select
       using (published = true)',
      policy_name,
      t
    );

  end loop;

end
$$;


drop policy if exists "public read jobs"
on public.jobs;

create policy "public read jobs"
on public.jobs
for select
using (
  published = true
);


-- ═════════════════════════ CONTENT ADMIN POLICIES ═════════════════════════

do $$
declare
  t text;
  policy_name text;
begin

  foreach t in array array[
    'services',
    'ai_agents',
    'automations',
    'industries',
    'case_studies',
    'technologies',
    'resources'
  ]

  loop

    policy_name := 'content manage ' || t;

    execute format(
      'drop policy if exists %I on public.%I',
      policy_name,
      t
    );

    execute format(
      'create policy %I
       on public.%I
       for all
       using (
         public.is_active_profile()
         and public.current_app_role()
             in (''editor'',''admin'',''super_admin'')
       )
       with check (
         public.is_active_profile()
         and public.current_app_role()
             in (''editor'',''admin'',''super_admin'')
       )',
      policy_name,
      t
    );

  end loop;

end
$$;


-- ═════════════════════════ SETTINGS POLICY ═════════════════════════

drop policy if exists "settings manage"
on public.site_settings;

create policy "settings manage"
on public.site_settings
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
);


-- ═════════════════════════ LEGAL POLICY ═════════════════════════

drop policy if exists "legal manage"
on public.legal_pages;

create policy "legal manage"
on public.legal_pages
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
);


-- ═════════════════════════ SEO POLICY ═════════════════════════

drop policy if exists "seo manage"
on public.seo_pages;

create policy "seo manage"
on public.seo_pages
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
);


-- ═════════════════════════ ANNOUNCEMENTS POLICY ═════════════════════════

drop policy if exists "announcements manage"
on public.announcements;

create policy "announcements manage"
on public.announcements
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
);


-- ═════════════════════════ SOCIAL POLICY ═════════════════════════

drop policy if exists "socials manage"
on public.social_links;

create policy "socials manage"
on public.social_links
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
);


-- ═════════════════════════ MEDIA POLICY ═════════════════════════

drop policy if exists "media manage"
on public.media_library;

create policy "media manage"
on public.media_library
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
);


-- ═════════════════════════ LEADS POLICIES ═════════════════════════

drop policy if exists "leads manage"
on public.contact_leads;

create policy "leads manage"
on public.contact_leads
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('sales','admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('sales','admin','super_admin')
);


drop policy if exists "assessments manage"
on public.automation_assessments;

create policy "assessments manage"
on public.automation_assessments
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('sales','admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('sales','admin','super_admin')
);


-- ═════════════════════════ CAREERS POLICIES ═════════════════════════

drop policy if exists "jobs manage"
on public.jobs;

create policy "jobs manage"
on public.jobs
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('hr','admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('hr','admin','super_admin')
);


drop policy if exists "applications manage"
on public.career_applications;

create policy "applications manage"
on public.career_applications
for all
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('hr','admin','super_admin')
)
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('hr','admin','super_admin')
);


-- ═════════════════════════ AUDIT POLICIES ═════════════════════════

drop policy if exists "audit read"
on public.admin_activity_logs;

create policy "audit read"
on public.admin_activity_logs
for select
using (
  public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
);


drop policy if exists "audit insert"
on public.admin_activity_logs;

create policy "audit insert"
on public.admin_activity_logs
for insert
with check (
  public.is_active_profile()
  and public.current_app_role()
      in ('editor','sales','hr','admin','super_admin')
);


-- ═════════════════════════ STORAGE BUCKETS ═════════════════════════

insert into storage.buckets (
  id,
  name,
  public
)
values (
  'site-media',
  'site-media',
  true
)
on conflict (id)
do nothing;


insert into storage.buckets (
  id,
  name,
  public
)
values (
  'career-resumes',
  'career-resumes',
  false
)
on conflict (id)
do nothing;


-- ═════════════════════════ SITE MEDIA STORAGE POLICIES ═════════════════════════

drop policy if exists "site-media public read"
on storage.objects;

create policy "site-media public read"
on storage.objects
for select
using (
  bucket_id = 'site-media'
);


drop policy if exists "site-media admin write"
on storage.objects;

create policy "site-media admin write"
on storage.objects
for insert
with check (
  bucket_id = 'site-media'
  and public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
);


drop policy if exists "site-media admin update"
on storage.objects;

create policy "site-media admin update"
on storage.objects
for update
using (
  bucket_id = 'site-media'
  and public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
)
with check (
  bucket_id = 'site-media'
  and public.is_active_profile()
  and public.current_app_role()
      in ('editor','admin','super_admin')
);


drop policy if exists "site-media admin delete"
on storage.objects;

create policy "site-media admin delete"
on storage.objects
for delete
using (
  bucket_id = 'site-media'
  and public.is_active_profile()
  and public.current_app_role()
      in ('admin','super_admin')
);


-- ═════════════════════════ RESUME STORAGE POLICIES ═════════════════════════

drop policy if exists "resumes anon upload"
on storage.objects;

create policy "resumes anon upload"
on storage.objects
for insert
with check (
  bucket_id = 'career-resumes'
  and (storage.foldername(name))[1] = 'pending'
  and lower(name) ~ '\.(pdf|doc|docx)$'
);


drop policy if exists "resumes staff read"
on storage.objects;

create policy "resumes staff read"
on storage.objects
for select
using (
  bucket_id = 'career-resumes'
  and public.is_active_profile()
  and public.current_app_role()
      in ('hr','admin','super_admin')
);


drop policy if exists "resumes staff delete"
on storage.objects;

create policy "resumes staff delete"
on storage.objects
for delete
using (
  bucket_id = 'career-resumes'
  and public.is_active_profile()
  and public.current_app_role()
      in ('hr','admin','super_admin')
);


-- ═════════════════════════ FIRST ADMIN ═════════════════════════
--
-- After all migrations:
--
-- 1. Supabase Dashboard
--    Authentication → Users → Add user
--
-- 2. Auto-confirm user.
--
-- 3. handle_new_user automatically creates profile.
--
-- 4. Promote trusted first admin using SQL Editor after migration 0003
--    bootstrap-safe guard is installed.
--
-- Never place passwords or service_role keys inside this repository.
--
-- ═════════════════════════ END 0001 ═════════════════════════