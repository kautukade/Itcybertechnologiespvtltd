-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER migration 0004 — unique constraints for idempotent seeding
--
-- 0002-era seeds used ON CONFLICT DO NOTHING on tables with no usable
-- conflict target, which can silently duplicate rows on re-run. These
-- constraints make real upserts possible.
--
-- NOTE: if a row already violates uniqueness (e.g. two jobs with the same
-- title), de-duplicate first — the constraint creation will fail otherwise.
-- ═══════════════════════════════════════════════════════════════════════

alter table public.jobs
  add constraint jobs_title_key unique (title);

alter table public.technologies
  add constraint technologies_name_category_key unique (name, category);

alter table public.social_links
  add constraint social_links_label_key unique (label);
