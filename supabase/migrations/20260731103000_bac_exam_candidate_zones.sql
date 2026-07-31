-- Chaque nouvelle copie d'un sujet type BAC doit indiquer son centre de rattachement.
-- Les copies historiques restent valides avec une zone nulle et sont affichées comme non renseignées.

alter table public.bac_exam_submissions
  add column if not exists candidate_zone text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'bac_exam_submissions_candidate_zone_check'
      and conrelid = 'public.bac_exam_submissions'::regclass
  ) then
    alter table public.bac_exam_submissions
      add constraint bac_exam_submissions_candidate_zone_check
      check (candidate_zone is null or candidate_zone in ('cocody', 'bingerville', 'yopougon', 'online'));
  end if;
end;
$$;

create index if not exists bac_exam_submissions_exam_zone_idx
  on public.bac_exam_submissions (exam_id, candidate_zone, submitted_at desc);

create or replace function public.get_bac_exam_availability(p_exam_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_subject_published boolean;
  v_is_admin boolean := false;
  v_candidate_zone text;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select settings.subject_published into v_subject_published
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  select coalesce(profile.role = 'admin', false) into v_is_admin
  from public.profiles as profile
  where profile.id = v_user_id;

  select submission.candidate_zone into v_candidate_zone
  from public.bac_exam_submissions as submission
  where submission.exam_id = p_exam_id
    and submission.user_id = v_user_id;

  return jsonb_build_object(
    'subjectPublished', v_subject_published,
    'canManageSubject', v_is_admin,
    'candidateZone', v_candidate_zone
  );
end;
$$;

create or replace function public.submit_bac_exam(
  p_exam_id text,
  p_answers jsonb,
  p_candidate_zone text
)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_question_count integer;
  v_subject_published boolean;
  v_submitted_at timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if p_candidate_zone is null
    or p_candidate_zone not in ('cocody', 'bingerville', 'yopougon', 'online')
  then
    raise exception 'Choisis Cocody, Bingerville, Yopougon ou Cours en ligne avant de valider.' using errcode = '22023';
  end if;

  select settings.question_count, settings.subject_published
  into v_question_count, v_subject_published
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  if not v_subject_published then
    raise exception 'Ce sujet est actuellement fermé par l’administrateur.' using errcode = '55000';
  end if;

  if jsonb_typeof(p_answers) <> 'object'
    or (select count(*) from jsonb_object_keys(p_answers)) <> v_question_count
    or exists (
      select 1
      from generate_series(1, v_question_count) as expected(question_number)
      where not (p_answers ? ('q' || lpad(expected.question_number::text, 2, '0')))
        or coalesce(p_answers ->> ('q' || lpad(expected.question_number::text, 2, '0')), '') not in ('A', 'B', 'C', 'D')
    )
  then
    raise exception 'Réponds à toutes les questions avant de valider ta copie.' using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.bac_exam_submissions as submission
    where submission.exam_id = p_exam_id
      and submission.user_id = v_user_id
  ) then
    raise exception 'Ta copie a déjà été validée.' using errcode = 'P0001';
  end if;

  insert into public.bac_exam_submissions (exam_id, user_id, answers, candidate_zone, submitted_at)
  values (p_exam_id, v_user_id, p_answers, p_candidate_zone, v_submitted_at);

  return v_submitted_at::text;
end;
$$;

create or replace function public.get_bac_exam_participant_zones(p_exam_id text)
returns table (
  user_id uuid,
  candidate_zone text
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_is_admin boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(profile.role = 'admin', false) into v_is_admin
  from public.profiles as profile
  where profile.id = v_user_id;
  if not v_is_admin then
    raise exception 'Seul un administrateur peut consulter les zones des candidats.' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.bac_exam_settings as settings where settings.exam_id = p_exam_id
  ) then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  return query
  select submission.user_id, submission.candidate_zone
  from public.bac_exam_submissions as submission
  where submission.exam_id = p_exam_id;
end;
$$;

revoke all on function public.submit_bac_exam(text, jsonb) from public, anon, authenticated;
revoke all on function public.submit_bac_exam(text, jsonb, text) from public, anon;
revoke all on function public.get_bac_exam_availability(text) from public, anon;
revoke all on function public.get_bac_exam_participant_zones(text) from public, anon;

grant execute on function public.submit_bac_exam(text, jsonb, text) to authenticated;
grant execute on function public.get_bac_exam_availability(text) to authenticated;
grant execute on function public.get_bac_exam_participant_zones(text) to authenticated;

notify pgrst, 'reload schema';
