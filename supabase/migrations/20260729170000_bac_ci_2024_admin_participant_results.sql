-- Tableau de notes privé de l'épreuve BAC/BT 2024.
-- Seul un administrateur authentifié peut obtenir les identités et les scores.
-- La fonction ne renvoie jamais les réponses des élèves, la clé ni le corrigé,
-- et reste utilisable quand les résultats sont encore masqués aux élèves.

create or replace function public.get_bac_exam_participant_results(p_exam_id text)
returns table (
  user_id uuid,
  student_name text,
  student_email text,
  level_id text,
  photo_url text,
  submitted_at timestamptz,
  correct_answers integer,
  score_max integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_settings public.bac_exam_settings%rowtype;
  v_answer_key_ready boolean := false;
begin
  if v_user_id is null or not public.is_platform_admin() then
    raise exception 'Seul un administrateur peut consulter les notes.' using errcode = '42501';
  end if;

  select settings.*
  into v_settings
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;

  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  v_answer_key_ready :=
    pg_catalog.jsonb_typeof(v_settings.answer_key) = 'object'
    and (
      select pg_catalog.count(*)
      from pg_catalog.jsonb_object_keys(v_settings.answer_key)
    ) = v_settings.question_count
    and not exists (
      select 1
      from pg_catalog.generate_series(1, v_settings.question_count) as expected(question_number)
      where not (
        v_settings.answer_key
        ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0'))
      )
        or coalesce(
          v_settings.answer_key
            ->> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')),
          ''
        ) not in ('A', 'B', 'C', 'D')
    );

  if not v_answer_key_ready then
    raise exception 'La clé de réponses complète doit être chargée avant de calculer les notes.'
      using errcode = '55000';
  end if;

  return query
  with scored as (
    select
      submission.user_id,
      coalesce(
        nullif(pg_catalog.btrim(learner_profile.name), ''),
        nullif(
          pg_catalog.split_part(coalesce(learner_profile.email, ''), '@', 1),
          ''
        ),
        'Élève'
      ) as student_name,
      coalesce(learner_profile.email, '') as student_email,
      coalesce(learner_profile.level_id, '') as level_id,
      learner_profile.photo_url,
      submission.submitted_at,
      (
        select pg_catalog.count(*)::integer
        from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
        where submission.answers ->> expected.question_key = expected.answer
      ) as correct_answers,
      v_settings.question_count::integer as score_max
    from public.bac_exam_submissions as submission
    left join public.profiles as learner_profile
      on learner_profile.id = submission.user_id
    where submission.exam_id = p_exam_id
  )
  select
    scored.user_id,
    scored.student_name,
    scored.student_email,
    scored.level_id,
    scored.photo_url,
    scored.submitted_at,
    scored.correct_answers,
    scored.score_max
  from scored
  order by
    scored.correct_answers desc,
    pg_catalog.lower(scored.student_name),
    scored.user_id;
end;
$$;

create index if not exists bac_exam_submissions_exam_submitted_idx
  on public.bac_exam_submissions (exam_id, submitted_at desc);

revoke all on function public.get_bac_exam_participant_results(text) from public;
revoke all on function public.get_bac_exam_participant_results(text) from anon;
grant execute on function public.get_bac_exam_participant_results(text) to authenticated;

notify pgrst, 'reload schema';
