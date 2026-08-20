-- ═══════════════════════════════════════════════════════════════════════
-- 0003 · SECURITY HARDENING
--
-- 1. Closes the profiles privilege-escalation vector. RLS is row-level,
--    so column protection is enforced with a BEFORE UPDATE trigger:
--      · nobody (any role) may change id / created_at / email
--      · only super_admin may change role / active
--      · all other roles may only change full_name / avatar_url
--    updated_at is excluded from checks (maintained by set_updated_at).
--
-- 2. career-resumes bucket: server-side 5 MB limit + MIME allow-list
--    (storage.buckets.file_size_limit / allowed_mime_types), and a strict
--    upload path policy: pending/<uuid>.(pdf|doc|docx) — blocks path
--    traversal, arbitrary names, overwrite abuse (INSERT-only policy).
--
-- 3. SECURITY DEFINER audit: current_app_role() / is_active_profile()
--    already run with `set search_path = public`, STABLE, and read only
--    profiles.id/role/active. Grants are tightened below so they can be
--    executed only by database roles the app actually uses.
-- ═══════════════════════════════════════════════════════════════════════

-- ───────────────────────── profiles column guard ─────────────────────────
create or replace function public.protect_profile_fields()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- identity fields are immutable for everyone, including super_admin
  if new.id is distinct from old.id then
    raise exception 'profiles.id is immutable' using errcode = '42501';
  end if;
  if new.created_at is distinct from old.created_at then
    raise exception 'profiles.created_at is immutable' using errcode = '42501';
  end if;
  if new.email is distinct from old.email then
    raise exception 'profiles.email cannot be changed here (auth.users is the source of truth)' using errcode = '42501';
  end if;

  -- only super_admin may alter role / active
  if public.current_app_role() <> 'super_admin' then
    if new.role is distinct from old.role then
      raise exception 'Only a super admin can change a profile role' using errcode = '42501';
    end if;
    if new.active is distinct from old.active then
      raise exception 'Only a super admin can activate or deactivate a profile' using errcode = '42501';
    end if;
  end if;

  return new;
end $$;

-- Fire BEFORE the updated_at trigger (alphabetical order guarantees
-- profiles_updated runs first, then this guard sees final values).
drop trigger if exists protect_profile_fields on public.profiles;
create trigger protect_profile_fields
  before update on public.profiles
  for each row execute function public.protect_profile_fields();

-- Self-update policy keeps row scoping; column protection lives in the trigger.
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ───────────── SECURITY DEFINER grant tightening ─────────────
revoke execute on function public.current_app_role() from public;
revoke execute on function public.is_active_profile() from public;
grant execute on function public.current_app_role() to anon, authenticated, service_role;
grant execute on function public.is_active_profile() to anon, authenticated, service_role;
revoke execute on function public.protect_profile_fields() from public;

-- ─────────────────── career-resumes bucket hardening ───────────────────
-- Server-side limits (not just browser validation):
--   · max 5 MB per object
--   · MIME restricted to PDF / DOC / DOCX
update storage.buckets
   set file_size_limit = 5242880,
       allowed_mime_types = array[
         'application/pdf',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
       ]
 where id = 'career-resumes';

-- Strict upload path: pending/<uuid>.(pdf|doc|docx) only.
-- Blocks path traversal (no extra slashes, no '..'), arbitrary filenames,
-- and overwrites (policy is INSERT-only; anon has no UPDATE policy).
drop policy if exists "resumes anon upload" on storage.objects;
create policy "resumes anon upload" on storage.objects for insert
  with check (
    bucket_id = 'career-resumes'
    and name ~ '^pending/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(pdf|doc|docx)$'
  );

-- Belt-and-braces: anonymous users can never update or delete in this bucket.
drop policy if exists "resumes anon update" on storage.objects;
drop policy if exists "resumes anon delete" on storage.objects;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICATION (run as the relevant role in the SQL editor):
--
--   -- as an authenticated NON-super_admin (e.g. editor), on their own row:
--   update public.profiles set active = true where id = auth.uid();        -- MUST FAIL
--   update public.profiles set role = 'super_admin' where id = auth.uid(); -- MUST FAIL
--   update public.profiles set email = 'x@x.io' where id = auth.uid();     -- MUST FAIL
--   update public.profiles set full_name = 'New Name' where id = auth.uid(); -- allowed
--
--   -- as super_admin:
--   update public.profiles set role = 'sales', active = true
--    where email = 'someone@itcyber.in';                                   -- allowed
--
--   -- storage: a 6 MB PDF upload to career-resumes MUST be rejected by
--   -- file_size_limit; a .png upload MUST be rejected by allowed_mime_types;
--   -- an upload to 'resumes/evil.pdf' MUST be rejected by the path policy.
-- ═══════════════════════════════════════════════════════════════════════
