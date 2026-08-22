-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD
-- Migration 0006 — second-pass security hardening
--
-- 1. Server-side abuse throttling primitive for anonymous Edge Functions.
-- 2. Prevent audit-log and lead-note author spoofing.
-- 3. Remove active SVG uploads from the public media bucket and constrain paths.
--
-- IMPORTANT: do not rewrite 0001–0005 after they have been applied.
-- ═══════════════════════════════════════════════════════════════════════


-- ═════════════════════════ PUBLIC RATE LIMIT LEDGER ═════════════════════════

create table if not exists public.public_rate_limits (
  id bigint generated always as identity primary key,
  scope text not null,
  fingerprint text not null,
  created_at timestamptz not null default now()
);

create index if not exists public_rate_limits_lookup_idx
  on public.public_rate_limits (scope, fingerprint, created_at desc);

create index if not exists public_rate_limits_created_idx
  on public.public_rate_limits (created_at);

alter table public.public_rate_limits enable row level security;

-- There are intentionally NO anon/authenticated RLS policies on this table.
-- Only the service-role-only function below may consume it.
revoke all on table public.public_rate_limits from anon, authenticated;
grant select, insert, delete on table public.public_rate_limits to service_role;

create or replace function public.consume_public_rate_limit(
  p_scope text,
  p_fingerprint text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  recent_count integer;
begin
  if p_scope is null
     or length(p_scope) < 1
     or length(p_scope) > 80
     or p_fingerprint is null
     or length(p_fingerprint) < 16
     or length(p_fingerprint) > 128
     or p_limit < 1
     or p_limit > 1000
     or p_window_seconds < 10
     or p_window_seconds > 86400
  then
    raise exception 'invalid rate-limit arguments' using errcode = '22023';
  end if;

  -- Serialise identical buckets so concurrent requests cannot race the count.
  perform pg_advisory_xact_lock(hashtextextended(p_scope || ':' || p_fingerprint, 0));

  select count(*)::integer
    into recent_count
  from public.public_rate_limits
  where scope = p_scope
    and fingerprint = p_fingerprint
    and created_at >= now() - make_interval(secs => p_window_seconds);

  if recent_count >= p_limit then
    return false;
  end if;

  insert into public.public_rate_limits (scope, fingerprint)
  values (p_scope, p_fingerprint);

  -- Opportunistic bounded cleanup. This is not relied on for correctness.
  delete from public.public_rate_limits
  where created_at < now() - interval '2 days';

  return true;
end
$$;

revoke execute on function public.consume_public_rate_limit(text,text,integer,integer) from public, anon, authenticated;
grant execute on function public.consume_public_rate_limit(text,text,integer,integer) to service_role;


-- ═════════════════════════ AUDIT AUTHORSHIP ═════════════════════════
-- An authenticated staff member may only create an audit entry as themself.

drop policy if exists "audit insert" on public.admin_activity_logs;

create policy "audit insert"
on public.admin_activity_logs
for insert
with check (
  public.is_active_profile()
  and public.current_app_role() in ('editor','sales','hr','admin','super_admin')
  and user_id = auth.uid()
);


-- ═════════════════════════ LEAD NOTE AUTHORSHIP ═════════════════════════
-- Replace the broad FOR ALL policy so a sales user cannot forge another
-- employee's note identity. Admins may moderate existing notes.

drop policy if exists "lead notes manage" on public.lead_notes;
drop policy if exists "lead notes read" on public.lead_notes;
drop policy if exists "lead notes insert own" on public.lead_notes;
drop policy if exists "lead notes update own or admin" on public.lead_notes;
drop policy if exists "lead notes delete own or admin" on public.lead_notes;

create policy "lead notes read"
on public.lead_notes
for select
using (
  public.is_active_profile()
  and public.current_app_role() in ('sales','admin','super_admin')
);

create policy "lead notes insert own"
on public.lead_notes
for insert
with check (
  public.is_active_profile()
  and public.current_app_role() in ('sales','admin','super_admin')
  and admin_user_id = auth.uid()
);

create policy "lead notes update own or admin"
on public.lead_notes
for update
using (
  public.is_active_profile()
  and (
    admin_user_id = auth.uid()
    or public.current_app_role() in ('admin','super_admin')
  )
)
with check (
  public.is_active_profile()
  and admin_user_id is not null
  and (
    admin_user_id = auth.uid()
    or public.current_app_role() in ('admin','super_admin')
  )
);

create policy "lead notes delete own or admin"
on public.lead_notes
for delete
using (
  public.is_active_profile()
  and (
    admin_user_id = auth.uid()
    or public.current_app_role() in ('admin','super_admin')
  )
);


-- ═════════════════════════ PUBLIC MEDIA HARDENING ═════════════════════════
-- SVG is active content when served from a public bucket. The application does
-- not need arbitrary SVG uploads, so only passive raster images + MP4 remain.

update storage.buckets
set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'video/mp4'
  ]
where id = 'site-media';

-- Existing public reads remain intentional; harden write paths/extensions.
drop policy if exists "site-media admin write" on storage.objects;
drop policy if exists "site-media admin update" on storage.objects;

create policy "site-media admin write"
on storage.objects
for insert
with check (
  bucket_id = 'site-media'
  and lower(name) ~ '^media/[a-z0-9._-]+\.(jpg|jpeg|png|webp|avif|mp4)$'
  and public.is_active_profile()
  and public.current_app_role() in ('editor','admin','super_admin')
);

create policy "site-media admin update"
on storage.objects
for update
using (
  bucket_id = 'site-media'
  and lower(name) ~ '^media/[a-z0-9._-]+\.(jpg|jpeg|png|webp|avif|mp4)$'
  and public.is_active_profile()
  and public.current_app_role() in ('editor','admin','super_admin')
)
with check (
  bucket_id = 'site-media'
  and lower(name) ~ '^media/[a-z0-9._-]+\.(jpg|jpeg|png|webp|avif|mp4)$'
  and public.is_active_profile()
  and public.current_app_role() in ('editor','admin','super_admin')
);


-- ═════════════════════════ RESUME UPLOAD POLICY ═════════════════════════
-- Anonymous direct Storage uploads are removed. The new prepare-resume-upload
-- Edge Function issues short-lived signed upload tokens after abuse checks.

drop policy if exists "resumes anon upload" on storage.objects;


-- ═════════════════════════ END 0006 ═════════════════════════
