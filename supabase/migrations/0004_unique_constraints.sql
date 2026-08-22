-- ═══════════════════════════════════════════════════════════════════════
-- ITCYBER TECHNOLOGIES PVT LTD
-- Migration 0004 — Unique constraints for safe/idempotent seed
-- Safe for partially initialized databases
-- ═══════════════════════════════════════════════════════════════════════


-- ═════════════════════════ JOB TITLE ═════════════════════════

do $$
begin

  if not exists (
    select 1
    from pg_constraint
    where conname = 'jobs_title_key'
      and conrelid = 'public.jobs'::regclass
  )
  then

    alter table public.jobs
      add constraint jobs_title_key
      unique (title);

  end if;

end
$$;


-- ═════════════════════════ TECHNOLOGY NAME + CATEGORY ═════════════════════════

do $$
begin

  if not exists (
    select 1
    from pg_constraint
    where conname = 'technologies_name_category_key'
      and conrelid = 'public.technologies'::regclass
  )
  then

    alter table public.technologies
      add constraint technologies_name_category_key
      unique (
        name,
        category
      );

  end if;

end
$$;


-- ═════════════════════════ SOCIAL LINK LABEL ═════════════════════════

do $$
begin

  if not exists (
    select 1
    from pg_constraint
    where conname = 'social_links_label_key'
      and conrelid = 'public.social_links'::regclass
  )
  then

    alter table public.social_links
      add constraint social_links_label_key
      unique (label);

  end if;

end
$$;


-- ═════════════════════════ END 0004 ═════════════════════════