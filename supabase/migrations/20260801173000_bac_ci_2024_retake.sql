-- Ouvre un nouveau passage du concours BAC & BT 2024 sans perdre les
-- copies du premier passage. Les copies archivées sont privées : seul le
-- rôle de service (ou une intervention SQL d'administration) peut les lire.

create table if not exists public.bac_exam_submission_archives (
  source_submission_id uuid primary key,
  archive_batch_id uuid not null,
  exam_id text not null,
  user_id uuid not null,
  answers jsonb not null check (pg_catalog.jsonb_typeof(answers) = 'object'),
  candidate_zone text check (
    candidate_zone is null
    or candidate_zone in ('cocody', 'bingerville', 'yopougon', 'online')
  ),
  submitted_at timestamptz not null,
  archived_at timestamptz not null default pg_catalog.now(),
  archive_reason text not null
);

create index if not exists bac_exam_submission_archives_exam_idx
  on public.bac_exam_submission_archives (exam_id, archived_at desc);

create index if not exists bac_exam_submission_archives_user_idx
  on public.bac_exam_submission_archives (user_id, submitted_at desc);

alter table public.bac_exam_submission_archives enable row level security;
revoke all on table public.bac_exam_submission_archives from public, anon, authenticated;

do $$
declare
  v_exam_id constant text := 'bac-ci-2024-level-test';
  v_batch_id uuid := gen_random_uuid();
  v_active_before integer := 0;
  v_archived integer := 0;
  v_deleted integer := 0;
begin
  if not exists (
    select 1
    from public.bac_exam_settings as settings
    where settings.exam_id = v_exam_id
  ) then
    raise exception 'Épreuve BAC & BT 2024 introuvable.';
  end if;

  select pg_catalog.count(*)::integer into v_active_before
  from public.bac_exam_submissions as submission
  where submission.exam_id = v_exam_id;

  insert into public.bac_exam_submission_archives (
    source_submission_id,
    archive_batch_id,
    exam_id,
    user_id,
    answers,
    candidate_zone,
    submitted_at,
    archive_reason
  )
  select
    submission.id,
    v_batch_id,
    submission.exam_id,
    submission.user_id,
    submission.answers,
    submission.candidate_zone,
    submission.submitted_at,
    'Nouveau passage demandé le 1er août 2026'
  from public.bac_exam_submissions as submission
  where submission.exam_id = v_exam_id
  on conflict (source_submission_id) do nothing;

  select pg_catalog.count(*)::integer into v_archived
  from public.bac_exam_submission_archives as archive
  where archive.archive_batch_id = v_batch_id
    and archive.exam_id = v_exam_id;

  if v_archived <> v_active_before then
    raise exception
      'Archivage BAC 2024 incomplet : % copies actives, % copies archivées.',
      v_active_before,
      v_archived;
  end if;

  delete from public.bac_exam_submissions as submission
  where submission.exam_id = v_exam_id
    and exists (
      select 1
      from public.bac_exam_submission_archives as archive
      where archive.source_submission_id = submission.id
        and archive.archive_batch_id = v_batch_id
    );

  get diagnostics v_deleted = row_count;
  if v_deleted <> v_active_before then
    raise exception
      'Remise à zéro BAC 2024 incomplète : % copies attendues, % copies retirées.',
      v_active_before,
      v_deleted;
  end if;

  if exists (
    select 1
    from public.bac_exam_submissions as submission
    where submission.exam_id = v_exam_id
  ) then
    raise exception 'Des copies BAC 2024 sont encore présentes après archivage.';
  end if;

  update public.bac_exam_settings
  set subject_published = true,
      results_published = false,
      updated_by = null,
      updated_at = pg_catalog.now()
  where exam_id = v_exam_id;
end;
$$;

notify pgrst, 'reload schema';
