-- Le résultat de l'épreuve BAC/BT est noté sur 69 (un point par question).
-- La clé et le corrigé restent des données privées injectées hors du dépôt.

create or replace function public.get_bac_exam_state(p_exam_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_settings public.bac_exam_settings%rowtype;
  v_submission public.bac_exam_submissions%rowtype;
  v_is_admin boolean := false;
  v_answer_key_ready boolean := false;
  v_correction_ready boolean := false;
  v_correct_answers integer := 0;
  v_state jsonb;
  v_result_corrections jsonb := '{}'::jsonb;
  v_appreciation jsonb;
  v_percentage numeric := 0;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select * into v_settings
  from public.bac_exam_settings
  where exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  select coalesce(role = 'admin', false) into v_is_admin
  from public.profiles
  where id = v_user_id;

  v_answer_key_ready :=
    (select count(*) from jsonb_object_keys(v_settings.answer_key)) = v_settings.question_count
    and not exists (
      select 1
      from generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.answer_key ? ('q' || lpad(expected.question_number::text, 2, '0')))
        or coalesce(v_settings.answer_key ->> ('q' || lpad(expected.question_number::text, 2, '0')), '') not in ('A', 'B', 'C', 'D')
    );

  v_correction_ready :=
    v_answer_key_ready
    and (select count(*) from jsonb_object_keys(v_settings.corrections)) = v_settings.question_count
    and not exists (
      select 1
      from generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.corrections ? ('q' || lpad(expected.question_number::text, 2, '0')))
        or jsonb_typeof(v_settings.corrections -> ('q' || lpad(expected.question_number::text, 2, '0'))) <> 'object'
        or btrim(coalesce(
          v_settings.corrections -> ('q' || lpad(expected.question_number::text, 2, '0')) ->> 'explanation',
          ''
        )) = ''
    );

  select * into v_submission
  from public.bac_exam_submissions
  where exam_id = p_exam_id and user_id = v_user_id;

  v_state := jsonb_build_object(
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
    v_state := v_state || jsonb_build_object(
      'submittedAt', v_submission.submitted_at,
      'submittedAnswers', v_submission.answers
    );
  end if;

  if v_is_admin then
    v_state := v_state || jsonb_build_object(
      'totalSubmissions',
      (select count(*) from public.bac_exam_submissions where exam_id = p_exam_id)
    );
  end if;

  if v_settings.results_published and v_correction_ready and v_submission.id is not null then
    select count(*)::integer into v_correct_answers
    from jsonb_each_text(v_settings.answer_key) as expected(question_key, answer)
    where v_submission.answers ->> expected.question_key = expected.answer;

    select coalesce(
      jsonb_object_agg(
        expected.question_key,
        jsonb_build_object('answer', expected.answer)
          || coalesce(v_settings.corrections -> expected.question_key, '{}'::jsonb)
      ),
      '{}'::jsonb
    ) into v_result_corrections
    from jsonb_each_text(v_settings.answer_key) as expected(question_key, answer);

    v_percentage := v_correct_answers * 100.0 / v_settings.question_count;
    v_appreciation := case
      when v_percentage >= 90 then jsonb_build_object(
        'label', 'Excellent',
        'message', 'Performance remarquable. Tu maîtrises très bien l’ensemble du sujet.'
      )
      when v_percentage >= 80 then jsonb_build_object(
        'label', 'Très bien',
        'message', 'Très belle maîtrise. Quelques points seulement restent à consolider.'
      )
      when v_percentage >= 70 then jsonb_build_object(
        'label', 'Bien',
        'message', 'Bon niveau général. Corrige tes dernières erreurs pour progresser encore.'
      )
      when v_percentage >= 60 then jsonb_build_object(
        'label', 'Assez bien',
        'message', 'Ensemble satisfaisant. Consolide les notions encore fragiles.'
      )
      when v_percentage >= 50 then jsonb_build_object(
        'label', 'Passable',
        'message', 'Les bases sont présentes. Une révision ciblée te fera gagner des points.'
      )
      else jsonb_build_object(
        'label', 'Insuffisant',
        'message', 'Des bases restent à renforcer. Appuie-toi sur la correction pour reprendre chaque difficulté.'
      )
    end;

    v_state := v_state || jsonb_build_object(
      'result',
      jsonb_build_object(
        'correctAnswers', v_correct_answers,
        'scoreMax', v_settings.question_count,
        -- Conservé temporairement pour les anciens clients pendant le déploiement coordonné.
        'scoreOutOf20', round((v_correct_answers * 20.0 / v_settings.question_count)::numeric, 2),
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
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_settings public.bac_exam_settings%rowtype;
  v_is_admin boolean := false;
  v_answer_key_ready boolean := false;
  v_correction_ready boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(role = 'admin', false) into v_is_admin
  from public.profiles
  where id = v_user_id;
  if not v_is_admin then
    raise exception 'Seul un administrateur peut publier les résultats.' using errcode = '42501';
  end if;

  select * into v_settings
  from public.bac_exam_settings
  where exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  v_answer_key_ready :=
    (select count(*) from jsonb_object_keys(v_settings.answer_key)) = v_settings.question_count
    and not exists (
      select 1
      from generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.answer_key ? ('q' || lpad(expected.question_number::text, 2, '0')))
        or coalesce(v_settings.answer_key ->> ('q' || lpad(expected.question_number::text, 2, '0')), '') not in ('A', 'B', 'C', 'D')
    );

  v_correction_ready :=
    v_answer_key_ready
    and (select count(*) from jsonb_object_keys(v_settings.corrections)) = v_settings.question_count
    and not exists (
      select 1
      from generate_series(1, v_settings.question_count) as expected(question_number)
      where not (v_settings.corrections ? ('q' || lpad(expected.question_number::text, 2, '0')))
        or jsonb_typeof(v_settings.corrections -> ('q' || lpad(expected.question_number::text, 2, '0'))) <> 'object'
        or btrim(coalesce(
          v_settings.corrections -> ('q' || lpad(expected.question_number::text, 2, '0')) ->> 'explanation',
          ''
        )) = ''
    );

  if p_published and not v_correction_ready then
    raise exception 'Les 69 réponses expliquées doivent être chargées avant la publication.' using errcode = '55000';
  end if;

  update public.bac_exam_settings
  set results_published = p_published,
      updated_by = v_user_id,
      updated_at = now()
  where exam_id = p_exam_id;

  return p_published;
end;
$$;

revoke all on function public.get_bac_exam_state(text) from public;
revoke all on function public.set_bac_exam_results_published(text, boolean) from public;
grant execute on function public.get_bac_exam_state(text) to authenticated;
grant execute on function public.set_bac_exam_results_published(text, boolean) to authenticated;
