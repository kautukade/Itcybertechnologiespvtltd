-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD
-- Migration 0003 — SECURITY HARDENING
--
-- 1. Protect profile privilege fields.
-- 2. Harden career resume storage.
-- 3. Tighten SECURITY DEFINER permissions.
-- ═══════════════════════════════════════════════════════════════════════


-- ═════════════════════════ PROFILE FIELD GUARD ═════════════════════════

create or replace function public.protect_profile_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare

  caller_uid uuid := auth.uid();

  caller_role text := public.current_app_role();

  -- Trusted direct database session.
  -- Needed so the first super_admin can be bootstrapped safely
  -- from Supabase SQL Editor.
  direct_database_admin boolean :=
    caller_uid is null
    and session_user in (
      'postgres',
      'supabase_admin'
    );

begin

  -- ID is immutable.

  if new.id is distinct from old.id then
    raise exception
      'profiles.id is immutable'
      using errcode = '42501';
  end if;


  -- created_at is immutable.

  if new.created_at is distinct from old.created_at then
    raise exception
      'profiles.created_at is immutable'
      using errcode = '42501';
  end if;


  -- Email identity comes from auth.users.

  if new.email is distinct from old.email then
    raise exception
      'profiles.email cannot be changed here (auth.users is the source of truth)'
      using errcode = '42501';
  end if;


  -- Only:
  --
  -- 1. existing super_admin
  -- 2. trusted direct database admin
  --
  -- may modify role / active.

  if not direct_database_admin
     and caller_role <> 'super_admin'
  then

    if new.role is distinct from old.role then
      raise exception
        'Only a super admin can change a profile role'
        using errcode = '42501';
    end if;


    if new.active is distinct from old.active then
      raise exception
        'Only a super admin can activate or deactivate a profile'
        using errcode = '42501';
    end if;

  end if;


  return new;

end
$$;


-- ───────────────────────── PROFILE GUARD TRIGGER ─────────────────────────

drop trigger if exists protect_profile_fields
on public.profiles;


create trigger protect_profile_fields
  before update on public.profiles
  for each row
  execute function public.protect_profile_fields();


-- ───────────────────────── SELF UPDATE POLICY ─────────────────────────

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
);


-- ═════════════════════════ SECURITY DEFINER PERMISSIONS ═════════════════════════

revoke execute
on function public.current_app_role()
from public;


revoke execute
on function public.is_active_profile()
from public;


grant execute
on function public.current_app_role()
to anon, authenticated, service_role;


grant execute
on function public.is_active_profile()
to anon, authenticated, service_role;


revoke execute
on function public.protect_profile_fields()
from public;


-- ═════════════════════════ CAREER RESUME BUCKET ═════════════════════════

-- Ensure bucket exists even if database was partially initialized.

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


-- Server-side restrictions:
--
-- max 5 MB
-- PDF / DOC / DOCX only

update storage.buckets

set
  public = false,

  file_size_limit = 5242880,

  allowed_mime_types = array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]

where id = 'career-resumes';


-- ═════════════════════════ RESUME UPLOAD POLICY ═════════════════════════

drop policy if exists "resumes anon upload"
on storage.objects;


create policy "resumes anon upload"
on storage.objects
for insert
with check (

  bucket_id = 'career-resumes'

  and name ~
    '^pending/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|doc|docx)$'

);


-- Anonymous users must never update or delete uploaded resumes.

drop policy if exists "resumes anon update"
on storage.objects;


drop policy if exists "resumes anon delete"
on storage.objects;


-- Staff read policy

drop policy if exists "resumes staff read"
on storage.objects;


create policy "resumes staff read"
on storage.objects
for select
using (

  bucket_id = 'career-resumes'

  and public.is_active_profile()

  and public.current_app_role() in (
    'hr',
    'admin',
    'super_admin'
  )

);


-- Staff delete policy

drop policy if exists "resumes staff delete"
on storage.objects;


create policy "resumes staff delete"
on storage.objects
for delete
using (

  bucket_id = 'career-resumes'

  and public.is_active_profile()

  and public.current_app_role() in (
    'hr',
    'admin',
    'super_admin'
  )

);


-- ═════════════════════════ VERIFICATION NOTES ═════════════════════════
--
-- Authenticated normal user:
--
-- update public.profiles
-- set active = true
-- where id = auth.uid();
--
-- MUST FAIL
--
--
-- update public.profiles
-- set role = 'super_admin'
-- where id = auth.uid();
--
-- MUST FAIL
--
--
-- update public.profiles
-- set full_name = 'New Name'
-- where id = auth.uid();
--
-- ALLOWED
--
--
-- First admin may be bootstrapped from SQL Editor:
--
-- update public.profiles
-- set
--   role = 'super_admin',
--   active = true
-- where email = 'your-real-admin-email@example.com';
--
-- ═════════════════════════ END 0003 ═════════════════════════