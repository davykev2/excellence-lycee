-- Sous-notes de l'épreuve BAC/BT 2024 :
-- Anglais Q1-Q20 (/20), Culture générale Q21-Q40 + Q61-Q65 (/25),
-- Culture scientifique Q41-Q60 + Q66-Q69 (/24).
-- La clé et les réponses restent exclusivement traitées dans les fonctions
-- security-definer ; aucun détail secret supplémentaire n'est exposé.

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
  v_general_knowledge_correct integer := 0;
  v_scientific_knowledge_correct integer := 0;
  v_state jsonb;
  v_result_corrections jsonb := '{}'::jsonb;
  v_appreciation jsonb;
  v_percentage numeric := 0;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select settings.*
  into v_settings
  from public.bac_exam_settings as settings
  where settings.exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  select coalesce(profile.role = 'admin', false)
  into v_is_admin
  from public.profiles as profile
  where profile.id = v_user_id;

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

  v_correction_ready :=
    v_answer_key_ready
    and pg_catalog.jsonb_typeof(v_settings.corrections) = 'object'
    and (
      select pg_catalog.count(*)
      from pg_catalog.jsonb_object_keys(v_settings.corrections)
    ) = v_settings.question_count
    and not exists (
      select 1
      from pg_catalog.generate_series(1, v_settings.question_count) as expected(question_number)
      where not (
        v_settings.corrections
        ? ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0'))
      )
        or pg_catalog.jsonb_typeof(
          v_settings.corrections
            -> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0'))
        ) <> 'object'
        or pg_catalog.btrim(coalesce(
          v_settings.corrections
            -> ('q' || pg_catalog.lpad(expected.question_number::text, 2, '0'))
            ->> 'explanation',
          ''
        )) = ''
    );

  select submission.*
  into v_submission
  from public.bac_exam_submissions as submission
  where submission.exam_id = p_exam_id
    and submission.user_id = v_user_id;

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
      (
        select pg_catalog.count(*)
        from public.bac_exam_submissions as submission
        where submission.exam_id = p_exam_id
      )
    );
  end if;

  if v_settings.results_published and v_correction_ready and v_submission.id is not null then
    select
      pg_catalog.count(*)::integer,
      pg_catalog.count(*) filter (
        where pg_catalog.substr(expected.question_key, 2)::integer between 1 and 20
      )::integer,
      pg_catalog.count(*) filter (
        where pg_catalog.substr(expected.question_key, 2)::integer between 21 and 40
          or pg_catalog.substr(expected.question_key, 2)::integer between 61 and 65
      )::integer,
      pg_catalog.count(*) filter (
        where pg_catalog.substr(expected.question_key, 2)::integer between 41 and 60
          or pg_catalog.substr(expected.question_key, 2)::integer between 66 and 69
      )::integer
    into
      v_correct_answers,
      v_english_correct,
      v_general_knowledge_correct,
      v_scientific_knowledge_correct
    from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
    where v_submission.answers ->> expected.question_key = expected.answer;

    select coalesce(
      pg_catalog.jsonb_object_agg(
        expected.question_key,
        pg_catalog.jsonb_build_object('answer', expected.answer)
          || coalesce(v_settings.corrections -> expected.question_key, '{}'::jsonb)
      ),
      '{}'::jsonb
    )
    into v_result_corrections
    from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer);

    v_percentage := v_correct_answers * 100.0 / v_settings.question_count;
    v_appreciation := case
      when v_percentage >= 90 then pg_catalog.jsonb_build_object(
        'label', 'Excellent',
        'message', 'Performance remarquable. Tu maîtrises très bien l’ensemble du sujet.'
      )
      when v_percentage >= 80 then pg_catalog.jsonb_build_object(
        'label', 'Très bien',
        'message', 'Très belle maîtrise. Quelques points seulement restent à consolider.'
      )
      when v_percentage >= 70 then pg_catalog.jsonb_build_object(
        'label', 'Bien',
        'message', 'Bon niveau général. Corrige tes dernières erreurs pour progresser encore.'
      )
      when v_percentage >= 60 then pg_catalog.jsonb_build_object(
        'label', 'Assez bien',
        'message', 'Ensemble satisfaisant. Consolide les notions encore fragiles.'
      )
      when v_percentage >= 50 then pg_catalog.jsonb_build_object(
        'label', 'Passable',
        'message', 'Les bases sont présentes. Une révision ciblée te fera gagner des points.'
      )
      else pg_catalog.jsonb_build_object(
        'label', 'Insuffisant',
        'message', 'Des bases restent à renforcer. Appuie-toi sur la correction pour reprendre chaque difficulté.'
      )
    end;

    v_state := v_state || pg_catalog.jsonb_build_object(
      'result',
      pg_catalog.jsonb_build_object(
        'correctAnswers', v_correct_answers,
        'scoreMax', v_settings.question_count,
        'scoreOutOf20', pg_catalog.round(
          (v_correct_answers * 20.0 / v_settings.question_count)::numeric,
          2
        ),
        'sectionScores', pg_catalog.jsonb_build_object(
          'english', pg_catalog.jsonb_build_object(
            'correctAnswers', v_english_correct,
            'scoreMax', 20
          ),
          'generalKnowledge', pg_catalog.jsonb_build_object(
            'correctAnswers', v_general_knowledge_correct,
            'scoreMax', 25
          ),
          'scientificKnowledge', pg_catalog.jsonb_build_object(
            'correctAnswers', v_scientific_knowledge_correct,
            'scoreMax', 24
          )
        ),
        'appreciation', v_appreciation,
        'corrections', v_result_corrections
      )
    );
  end if;

  return v_state;
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
          and pg_catalog.substr(expected.question_key, 2)::integer between 1 and 20
      ) as english_correct,
      20::integer as english_max,
      (
        select pg_catalog.count(*)::integer
        from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
        where submission.answers ->> expected.question_key = expected.answer
          and (
            pg_catalog.substr(expected.question_key, 2)::integer between 21 and 40
            or pg_catalog.substr(expected.question_key, 2)::integer between 61 and 65
          )
      ) as general_knowledge_correct,
      25::integer as general_knowledge_max,
      (
        select pg_catalog.count(*)::integer
        from pg_catalog.jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
        where submission.answers ->> expected.question_key = expected.answer
          and (
            pg_catalog.substr(expected.question_key, 2)::integer between 41 and 60
            or pg_catalog.substr(expected.question_key, 2)::integer between 66 and 69
          )
      ) as scientific_knowledge_correct,
      24::integer as scientific_knowledge_max,
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
    scored.english_correct,
    scored.english_max,
    scored.general_knowledge_correct,
    scored.general_knowledge_max,
    scored.scientific_knowledge_correct,
    scored.scientific_knowledge_max,
    scored.correct_answers,
    scored.score_max
  from scored
  order by
    scored.correct_answers desc,
    pg_catalog.lower(scored.student_name),
    scored.user_id;
end;
$$;

revoke all on function public.get_bac_exam_state(text) from public;
revoke all on function public.get_bac_exam_state(text) from anon;
grant execute on function public.get_bac_exam_state(text) to authenticated;

revoke all on function public.get_bac_exam_participant_results(text) from public;
revoke all on function public.get_bac_exam_participant_results(text) from anon;
grant execute on function public.get_bac_exam_participant_results(text) to authenticated;

notify pgrst, 'reload schema';
