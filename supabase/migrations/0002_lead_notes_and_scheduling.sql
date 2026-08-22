-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD
-- Migration 0002
-- Lead notes + announcement scheduling + assessment assignment
-- Safe for partially initialized databases
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────── LEAD NOTES ─────────────────────────

create table if not exists public.lead_notes (
  id uuid primary key default uuid_generate_v4(),

  lead_id uuid not null
    references public.contact_leads (id)
    on delete cascade,

  admin_user_id uuid
    references public.profiles (id)
    on delete set null,

  note text not null,

  created_at timestamptz not null default now()
);

create index if not exists lead_notes_lead_idx
  on public.lead_notes (
    lead_id,
    created_at desc
  );

alter table public.lead_notes
  enable row level security;


-- Remove previous/partial policy safely

drop policy if exists "lead notes manage"
on public.lead_notes;


-- Same access level as leads:
-- sales / admin / super_admin

create policy "lead notes manage"
on public.lead_notes
for all
using (
  public.is_active_profile()
  and public.current_app_role() in (
    'sales',
    'admin',
    'super_admin'
  )
)
with check (
  public.is_active_profile()
  and public.current_app_role() in (
    'sales',
    'admin',
    'super_admin'
  )
);


-- ───────────────────────── ANNOUNCEMENT SCHEDULING ─────────────────────────

alter table public.announcements
  add column if not exists starts_at timestamptz;

alter table public.announcements
  add column if not exists ends_at timestamptz;


-- Replace previous public announcement policy safely

drop policy if exists "public read announcements"
on public.announcements;


create policy "public read announcements"
on public.announcements
for select
using (
  active = true

  and (
    starts_at is null
    or starts_at <= now()
  )

  and (
    ends_at is null
    or ends_at >= now()
  )
);


-- ───────────────────────── ASSESSMENT ASSIGNMENT ─────────────────────────

alter table public.automation_assessments
  add column if not exists assigned_to uuid;


-- Add FK only if it does not already exist.

do $$
begin

  if not exists (
    select 1
    from pg_constraint
    where conname = 'automation_assessments_assigned_to_fkey'
      and conrelid = 'public.automation_assessments'::regclass
  )
  then

    alter table public.automation_assessments
      add constraint automation_assessments_assigned_to_fkey
      foreign key (assigned_to)
      references public.profiles (id)
      on delete set null;

  end if;

end
$$;


-- ═════════════════════════ END 0002 ═════════════════════════