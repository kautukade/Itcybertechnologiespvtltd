-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD
-- Migration 0005 — Production hardening
--
-- IMPORTANT: 0001–0004 are already historical migrations. New production
-- constraints and storage limits belong here rather than rewriting history.
-- ═══════════════════════════════════════════════════════════════════════


-- ═════════════════════════ SITE MEDIA SERVER LIMITS ═════════════════════════
-- Client-side checks are UX only. Enforce the same contract in Storage.

update storage.buckets
set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'video/mp4'
  ]
where id = 'site-media';


-- ═════════════════════════ VERIFIED CASE-STUDY INVARIANT ═════════════════════════
-- A record may only call itself a real client case study after verification.
-- Normalize any pre-existing inconsistent rows before adding the constraint.

update public.case_studies
set case_type = 'reference'
where case_type = 'real'
  and verified is not true;

alter table public.case_studies
  drop constraint if exists case_studies_real_requires_verified;

alter table public.case_studies
  add constraint case_studies_real_requires_verified
  check (
    case_type <> 'real'
    or verified = true
  );


-- ═════════════════════════ QUERY / RATE-LIMIT INDEXES ═════════════════════════
-- Edge Functions rate-limit by email + created_at. Admin screens frequently
-- filter by status and sort by creation time. These indexes keep those paths
-- predictable as production data grows.

create index if not exists contact_leads_email_created_idx
  on public.contact_leads (email, created_at desc);

create index if not exists contact_leads_status_created_idx
  on public.contact_leads (status, created_at desc);

create index if not exists automation_assessments_email_created_idx
  on public.automation_assessments (email, created_at desc);

create index if not exists automation_assessments_status_created_idx
  on public.automation_assessments (status, created_at desc);

create index if not exists career_applications_email_created_idx
  on public.career_applications (email, created_at desc);

create index if not exists career_applications_status_created_idx
  on public.career_applications (status, created_at desc);

create index if not exists jobs_public_listing_idx
  on public.jobs (published, applications_open, sort_order);

create index if not exists case_studies_public_listing_idx
  on public.case_studies (published, sort_order);


-- ═════════════════════════ END 0005 ═════════════════════════
