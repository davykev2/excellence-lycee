-- Rend les corrigés des annales 2017–2020 publiables sans exposer leurs clés
-- dans le dépôt. Les clés sont chargées séparément dans bac_exam_settings.

do $$
begin
  if exists (
    select 1
    from public.bac_exam_submissions
    where exam_id = 'bac-ci-2017-archive'
  ) then
    raise exception 'Impossible de corriger le découpage 2017 : des copies existent déjà.';
  end if;

  update public.bac_exam_settings
  set question_count = 86,
      updated_at = now()
  where exam_id = 'bac-ci-2017-archive';
end;
$$;

create or replace function public.bac_exam_section_code(
  p_exam_id text,
  p_question_number integer
)
returns text
language sql
immutable
set search_path = ''
as $$
  select case
    when p_exam_id = 'bac-ci-2017-archive' and p_question_number between 1 and 29 then 'english'
    when p_exam_id = 'bac-ci-2017-archive' and p_question_number between 30 and 63 then 'generalKnowledge'
    when p_exam_id = 'bac-ci-2017-archive' and p_question_number between 64 and 86 then 'scientificKnowledge'
    when p_exam_id in ('bac-ci-2018-archive', 'bac-ci-2019-archive', 'bac-ci-2020-archive')
      and p_question_number between 1 and 20 then 'english'
    when p_exam_id in ('bac-ci-2018-archive', 'bac-ci-2019-archive', 'bac-ci-2020-archive')
      and p_question_number between 21 and 40 then 'generalKnowledge'
    when p_exam_id in ('bac-ci-2018-archive', 'bac-ci-2019-archive', 'bac-ci-2020-archive')
      and p_question_number between 41 and 60 then 'scientificKnowledge'
    when p_exam_id = 'bac-ci-2024-level-test' and p_question_number between 1 and 20 then 'english'
    when p_exam_id = 'bac-ci-2024-level-test'
      and (p_question_number between 21 and 40 or p_question_number between 61 and 65)
      then 'generalKnowledge'
    when p_exam_id = 'bac-ci-2024-level-test'
      and (p_question_number between 41 and 60 or p_question_number between 66 and 69)
      then 'scientificKnowledge'
    else null
  end;
$$;

create or replace function public.bac_exam_section_max(
  p_exam_id text,
  p_section text
)
returns integer
language sql
immutable
set search_path = ''
as $$
  select case
    when p_exam_id = 'bac-ci-2017-archive' and p_section = 'english' then 29
    when p_exam_id = 'bac-ci-2017-archive' and p_section = 'generalKnowledge' then 34
    when p_exam_id = 'bac-ci-2017-archive' and p_section = 'scientificKnowledge' then 23
    when p_exam_id in ('bac-ci-2018-archive', 'bac-ci-2019-archive', 'bac-ci-2020-archive') then 20
    when p_exam_id = 'bac-ci-2024-level-test' and p_section = 'english' then 20
    when p_exam_id = 'bac-ci-2024-level-test' and p_section = 'generalKnowledge' then 25
    when p_exam_id = 'bac-ci-2024-level-test' and p_section = 'scientificKnowledge' then 24
    else 0
  end;
$$;

create or replace function public.get_bac_exam_state(p_exam_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_settings public.bac_exam_settings%rowtype;
  v_submission public.bac_exam_submissions%rowtype;
  v_is_admin boolean := false;
  v_answer_key_ready boolean := false;
  v_correction_ready boolean := false;
  v_correct_answers integer := 0;
  v_english_correct integer := 0;
  v_general_correct integer := 0;
  v_scientific_correct integer := 0;
  v_state jsonb;
  v_result_corrections jsonb := '{}'::jsonb;
  v_appreciation jsonb;
  v_percentage numeric := 0;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select settings.* into v_settings
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  select coalesce(profile.role = 'admin', false) into v_is_admin
  from public.profiles as profile
  where profile.id = v_user_id;

  v_answer_key_ready :=
    pg_catalog.jsonb_typeof(v_settings.answer_key) = 'object'
    and (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(v_settings.answer_key)) = v_settings.question_count
    and not exists (
      select 1
      from pg_catalog.generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.answer_key ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')))
        or coalesce(v_settings.answer_key ->> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')), '')
          not in ('A', 'B', 'C', 'D', 'E')
    );

  v_correction_ready :=
    v_answer_key_ready
    and pg_catalog.jsonb_typeof(v_settings.corrections) = 'object'
    and (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(v_settings.corrections)) = v_settings.question_count
    and not exists (
      select 1
      from pg_catalog.generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.corrections ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')))
        or pg_catalog.jsonb_typeof(v_settings.corrections -> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0'))) <> 'object'
        or pg_catalog.btrim(coalesce(
          v_settings.corrections -> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')) ->> 'explanation',
          ''
        )) = ''
    );

  select submission.* into v_submission
  from public.bac_exam_submissions as submission
  where submission.exam_id = p_exam_id and submission.user_id = v_user_id;

  v_state := pg_catalog.jsonb_build_object(
    'examId', v_settings.exam_id,
    'title', v_settings.title,
    'durationMinutes', v_settings.duration_minutes,
    'questionCount', v_settings.question_count,
    'resultsPublished', v_settings.results_published,
    'answerKeyReady', v_answer_key_ready,
    'correctionReady', v_correction_ready,
    'canPublishResults', v_is_admin and v_correction_ready
  );

  if v_submission.id is not null then
    v_state := v_state || pg_catalog.jsonb_build_object(
      'submittedAt', v_submission.submitted_at,
      'submittedAnswers', v_submission.answers
    );
  end if;

  if v_is_admin then
    v_state := v_state || pg_catalog.jsonb_build_object(
      'totalSubmissions',
      (select pg_catalog.count(*) from public.bac_exam_submissions as submission where submission.exam_id = p_exam_id)
    );
  end if;

  if v_settings.results_published and v_correction_ready and v_submission.id is not null then
    select
      pg_catalog.count(*)::integer,
      pg_catalog.count(*) filter (
        where public.bac_exam_section_code(p_exam_id, pg_catalog.substr(expected.question_key, 2)::integer) = 'english'
      )::integer,
      pg_catalog.count(*) filter (
        where public.bac_exam_section_code(p_exam_id, pg_catalog.substr(expected.question_key, 2)::integer) = 'generalKnowledge'
      )::integer,
      pg_catalog.count(*) filter (
        where public.bac_exam_section_code(p_exam_id, pg_catalog.substr(expected.question_key, 2)::integer) = 'scientificKnowledge'
      )::integer
    into v_correct_answers, v_english_correct, v_general_correct, v_scientific_correct
    from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
    where v_submission.answers ->> expected.question_key = expected.answer;

    select coalesce(
      pg_catalog.jsonb_object_agg(
        expected.question_key,
        pg_catalog.jsonb_build_object('answer', expected.answer)
          || coalesce(v_settings.corrections -> expected.question_key, '{}'::jsonb)
      ),
      '{}'::jsonb
    ) into v_result_corrections
    from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer);

    v_percentage := v_correct_answers * 100.0 / v_settings.question_count;
    v_appreciation := case
      when v_percentage >= 90 then pg_catalog.jsonb_build_object('label', 'Excellent', 'message', 'Performance remarquable. Tu maîtrises très bien l’ensemble du sujet.')
      when v_percentage >= 80 then pg_catalog.jsonb_build_object('label', 'Très bien', 'message', 'Très belle maîtrise. Quelques points seulement restent à consolider.')
      when v_percentage >= 70 then pg_catalog.jsonb_build_object('label', 'Bien', 'message', 'Bon niveau général. Corrige tes dernières erreurs pour progresser encore.')
      when v_percentage >= 60 then pg_catalog.jsonb_build_object('label', 'Assez bien', 'message', 'Ensemble satisfaisant. Consolide les notions encore fragiles.')
      when v_percentage >= 50 then pg_catalog.jsonb_build_object('label', 'Passable', 'message', 'Les bases sont présentes. Une révision ciblée te fera gagner des points.')
      else pg_catalog.jsonb_build_object('label', 'Insuffisant', 'message', 'Des bases restent à renforcer. Appuie-toi sur la correction pour reprendre chaque difficulté.')
    end;

    v_state := v_state || pg_catalog.jsonb_build_object(
      'result', pg_catalog.jsonb_build_object(
        'correctAnswers', v_correct_answers,
        'scoreMax', v_settings.question_count,
        'scoreOutOf20', pg_catalog.round((v_correct_answers * 20.0 / v_settings.question_count)::numeric, 2),
        'sectionScores', pg_catalog.jsonb_build_object(
          'english', pg_catalog.jsonb_build_object('correctAnswers', v_english_correct, 'scoreMax', public.bac_exam_section_max(p_exam_id, 'english')),
          'generalKnowledge', pg_catalog.jsonb_build_object('correctAnswers', v_general_correct, 'scoreMax', public.bac_exam_section_max(p_exam_id, 'generalKnowledge')),
          'scientificKnowledge', pg_catalog.jsonb_build_object('correctAnswers', v_scientific_correct, 'scoreMax', public.bac_exam_section_max(p_exam_id, 'scientificKnowledge'))
        ),
        'appreciation', v_appreciation,
        'corrections', v_result_corrections
      )
    );
  end if;

  return v_state;
end;
$$;

create or replace function public.set_bac_exam_results_published(
  p_exam_id text,
  p_published boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_settings public.bac_exam_settings%rowtype;
  v_ready boolean := false;
begin
  if auth.uid() is null or not public.is_platform_admin() then
    raise exception 'Seul un administrateur peut publier les résultats.' using errcode = '42501';
  end if;

  select settings.* into v_settings
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  v_ready :=
    pg_catalog.jsonb_typeof(v_settings.answer_key) = 'object'
    and (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(v_settings.answer_key)) = v_settings.question_count
    and not exists (
      select 1
      from pg_catalog.generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.answer_key ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')))
        or coalesce(v_settings.answer_key ->> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')), '') not in ('A', 'B', 'C', 'D', 'E')
        or not (v_settings.corrections ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')))
        or pg_catalog.jsonb_typeof(v_settings.corrections -> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0'))) <> 'object'
        or pg_catalog.btrim(coalesce(v_settings.corrections -> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')) ->> 'explanation', '')) = ''
    );

  if p_published and not v_ready then
    raise exception 'La correction complète doit être chargée avant la publication.' using errcode = '55000';
  end if;

  update public.bac_exam_settings
  set results_published = p_published,
      updated_by = auth.uid(),
      updated_at = now()
  where exam_id = p_exam_id;

  return p_published;
end;
$$;

drop function if exists public.get_bac_exam_participant_results(text);

create function public.get_bac_exam_participant_results(p_exam_id text)
returns table (
  user_id uuid,
  student_name text,
  student_email text,
  level_id text,
  photo_url text,
  submitted_at timestamptz,
  english_correct integer,
  english_max integer,
  general_knowledge_correct integer,
  general_knowledge_max integer,
  scientific_knowledge_correct integer,
  scientific_knowledge_max integer,
  correct_answers integer,
  score_max integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_settings public.bac_exam_settings%rowtype;
  v_ready boolean := false;
begin
  if auth.uid() is null or not public.is_platform_admin() then
    raise exception 'Seul un administrateur peut consulter les notes.' using errcode = '42501';
  end if;

  select settings.* into v_settings
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  v_ready :=
    pg_catalog.jsonb_typeof(v_settings.answer_key) = 'object'
    and (select pg_catalog.count(*) from pg_catalog.jsonb_object_keys(v_settings.answer_key)) = v_settings.question_count
    and not exists (
      select 1
      from pg_catalog.generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.answer_key ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')))
        or coalesce(v_settings.answer_key ->> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0')), '') not in ('A', 'B', 'C', 'D', 'E')
    );
  if not v_ready then
    raise exception 'La clé de réponses complète doit être chargée avant de calculer les notes.' using errcode = '55000';
  end if;

  return query
  select
    submission.user_id,
    coalesce(nullif(pg_catalog.btrim(profile.name), ''), nullif(pg_catalog.split_part(coalesce(profile.email, ''), '@', 1), ''), 'Élève'),
    coalesce(profile.email, ''),
    coalesce(profile.level_id, ''),
    profile.photo_url,
    submission.submitted_at,
    (select pg_catalog.count(*)::integer from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
      where submission.answers ->> expected.question_key = expected.answer
        and public.bac_exam_section_code(p_exam_id, pg_catalog.substr(expected.question_key, 2)::integer) = 'english'),
    public.bac_exam_section_max(p_exam_id, 'english'),
    (select pg_catalog.count(*)::integer from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
      where submission.answers ->> expected.question_key = expected.answer
        and public.bac_exam_section_code(p_exam_id, pg_catalog.substr(expected.question_key, 2)::integer) = 'generalKnowledge'),
    public.bac_exam_section_max(p_exam_id, 'generalKnowledge'),
    (select pg_catalog.count(*)::integer from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
      where submission.answers ->> expected.question_key = expected.answer
        and public.bac_exam_section_code(p_exam_id, pg_catalog.substr(expected.question_key, 2)::integer) = 'scientificKnowledge'),
    public.bac_exam_section_max(p_exam_id, 'scientificKnowledge'),
    (select pg_catalog.count(*)::integer from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
      where submission.answers ->> expected.question_key = expected.answer),
    v_settings.question_count::integer
  from public.bac_exam_submissions as submission
  left join public.profiles as profile on profile.id = submission.user_id
  where submission.exam_id = p_exam_id
  order by 13 desc, pg_catalog.lower(coalesce(profile.name, '')), submission.user_id;
end;
$$;

revoke all on function public.bac_exam_section_code(text, integer) from public, anon, authenticated;
revoke all on function public.bac_exam_section_max(text, text) from public, anon, authenticated;
revoke all on function public.get_bac_exam_state(text) from public, anon;
revoke all on function public.set_bac_exam_results_published(text, boolean) from public, anon;
revoke all on function public.get_bac_exam_participant_results(text) from public, anon;
grant execute on function public.get_bac_exam_state(text) to authenticated;
grant execute on function public.set_bac_exam_results_published(text, boolean) to authenticated;
grant execute on function public.get_bac_exam_participant_results(text) to authenticated;

notify pgrst, 'reload schema';
