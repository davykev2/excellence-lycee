-- Quatre annales supplémentaires, chacune activable indépendamment depuis l'administration.
-- Les sujets sont fermés par défaut ; les corrections seront chargées séparément.

insert into public.bac_exam_settings (
  exam_id,
  title,
  duration_minutes,
  question_count,
  subject_published,
  results_published,
  answer_key,
  corrections,
  updated_at
)
values
  ('bac-ci-2017-archive', 'Sujet type BAC — Session 2017', 180, 74, false, false, '{}'::jsonb, '{}'::jsonb, now()),
  ('bac-ci-2018-archive', 'Sujet type BAC — Session 2018', 180, 60, false, false, '{}'::jsonb, '{}'::jsonb, now()),
  ('bac-ci-2019-archive', 'Sujet type BAC — Session 2019', 180, 60, false, false, '{}'::jsonb, '{}'::jsonb, now()),
  ('bac-ci-2020-archive', 'Sujet type BAC — Session 2020', 180, 60, false, false, '{}'::jsonb, '{}'::jsonb, now())
on conflict (exam_id) do update set
  title = excluded.title,
  duration_minutes = excluded.duration_minutes,
  question_count = excluded.question_count,
  updated_at = now();

-- Les sujets 2018 et 2019 proposent ponctuellement une cinquième réponse E.
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
        or coalesce(p_answers ->> ('q' || lpad(expected.question_number::text, 2, '0')), '') not in ('A', 'B', 'C', 'D', 'E')
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

revoke all on function public.submit_bac_exam(text, jsonb, text) from public, anon;
grant execute on function public.submit_bac_exam(text, jsonb, text) to authenticated;

notify pgrst, 'reload schema';
