-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER — Migration 0002
-- Adds: lead_notes (per-lead note history), announcement scheduling
-- windows (starts_at / ends_at), and assessment assignment.
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────── lead notes ─────────────────────────
create table if not exists public.lead_notes (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid not null references public.contact_leads (id) on delete cascade,
  admin_user_id uuid references public.profiles (id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

alter table public.lead_notes enable row level security;

-- Same audience as the leads themselves: sales, admin, super_admin.
create policy "lead notes manage" on public.lead_notes for all
  using (public.is_active_profile() and public.current_app_role() in ('sales','admin','super_admin'))
  with check (public.is_active_profile() and public.current_app_role() in ('sales','admin','super_admin'));

-- ───────────────────────── announcement scheduling ─────────────────────────
alter table public.announcements
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz;

-- Public read policy now honours the schedule window as well as `active`.
drop policy if exists "public read announcements" on public.announcements;
create policy "public read announcements" on public.announcements for select
  using (active = true
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now()));

-- ───────────────────────── assessment assignment ─────────────────────────
alter table public.automation_assessments
  add column if not exists assigned_to uuid references public.profiles (id) on delete set null;
