begin;

alter table public.quiz
  add column if not exists homework_statement_markdown text,
  add column if not exists homework_correction_after_submission boolean not null default false;

alter table public.quiz drop constraint if exists quiz_homework_statement_length_check;
alter table public.quiz add constraint quiz_homework_statement_length_check
  check (homework_statement_markdown is null or length(homework_statement_markdown) <= 120000);

alter table public.quiz drop constraint if exists quiz_homework_self_correction_attempt_check;
alter table public.quiz add constraint quiz_homework_self_correction_attempt_check
  check (not homework_correction_after_submission or homework_max_attempts = 1);

alter table public.questions
  add column if not exists homework_correction_figures jsonb not null default '[]'::jsonb;

alter table public.questions drop constraint if exists questions_homework_correction_figures_check;
alter table public.questions add constraint questions_homework_correction_figures_check
  check (jsonb_typeof(homework_correction_figures) = 'array' and jsonb_array_length(homework_correction_figures) <= 8);

comment on column public.quiz.homework_statement_markdown is
  'Retranscription publique fidèle du sujet, sans le corrigé ni les secrets de notation.';
comment on column public.quiz.homework_correction_after_submission is
  'Autorise le propriétaire d’une copie définitivement remise à consulter le corrigé ; exige une tentative unique.';
comment on column public.questions.homework_correction_figures is
  'Figures privées du corrigé, renvoyées uniquement lorsque le corrigé est accessible.';

create or replace function public.homework_experience_summary_json_v1(
  p_quiz_id uuid,
  p_actor_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_summary jsonb;
  v_after_submission boolean;
begin
  v_summary := public.homework_summary_json_v1(p_quiz_id, p_actor_id);
  select q.homework_correction_after_submission
  into v_after_submission
  from public.quiz q
  where q.id = p_quiz_id and q.type = 'devoir';

  return v_summary || jsonb_build_object(
    'correctionAfterSubmission', coalesce(v_after_submission, false)
  );
end;
$$;

create or replace function public.list_homework_experiences_v1(
  p_subject_id text default null,
  p_academic_year text default null,
  p_institution text default null,
  p_level_id text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_homeworks jsonb;
  v_result jsonb;
begin
  v_homeworks := public.list_homeworks_v1(
    p_subject_id,
    p_academic_year,
    p_institution,
    p_level_id
  );

  select coalesce(jsonb_agg(
    entry.item || jsonb_build_object(
      'correctionAfterSubmission', coalesce(q.homework_correction_after_submission, false)
    )
    order by entry.position
  ), '[]'::jsonb)
  into v_result
  from jsonb_array_elements(coalesce(v_homeworks, '[]'::jsonb))
    with ordinality as entry(item, position)
  left join public.quiz q on q.id = (entry.item ->> 'id')::uuid;

  return v_result;
end;
$$;

create or replace function public.get_homework_experience_v1(p_homework_ref text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = pg_catalog, public
as $$
declare
  v_payload jsonb;
  v_quiz_id uuid;
  v_statement text;
begin
  v_payload := public.get_homework_public_v1(p_homework_ref);
  v_quiz_id := (v_payload #>> '{summary,id}')::uuid;

  select q.homework_statement_markdown
  into v_statement
  from public.quiz q
  where q.id = v_quiz_id;

  v_payload := jsonb_set(
    v_payload,
    '{summary}',
    public.homework_experience_summary_json_v1(v_quiz_id, auth.uid()),
    false
  );

  return jsonb_strip_nulls(v_payload || jsonb_build_object(
    'statementMarkdown', v_statement
  ));
end;
$$;

create or replace function public.homework_experience_result_json_v1(
  p_attempt_id uuid,
  p_allow_admin_secrets boolean default false
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_quiz public.quiz%rowtype;
  v_attempt public.tentatives%rowtype;
  v_result jsonb;
  v_corrections jsonb;
  v_release_after_submission boolean;
  v_pending_review boolean;
begin
  select * into v_attempt from public.tentatives where id = p_attempt_id;
  if v_attempt.id is null then raise exception 'attempt_not_found'; end if;
  select * into v_quiz from public.quiz where id = v_attempt.quiz_id and type = 'devoir';
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;

  v_release_after_submission := coalesce(v_quiz.homework_correction_after_submission, false);
  v_pending_review := coalesce(v_attempt.homework_review_status, 'not-required') = 'pending';
  v_result := public.homework_result_json_v1(
    p_attempt_id,
    p_allow_admin_secrets or v_release_after_submission
  );

  if coalesce((v_result ->> 'correctionsAvailable')::boolean, false) then
    select coalesce(jsonb_agg(
      (
        case
          when v_release_after_submission and v_pending_review and not p_allow_admin_secrets
            then correction.item - 'pointsAwarded' - 'correct' - 'reviewComment' - 'rubricCriteria'
          else correction.item
        end
      ) || jsonb_build_object(
        'sectionId', q.homework_section_id,
        'sectionTitle', q.homework_section_title,
        'sectionOrder', q.homework_section_order,
        'exerciseId', q.homework_exercise_id,
        'exerciseTitle', q.homework_exercise_title,
        'exerciseOrder', q.homework_exercise_order,
        'questionOrder', q.ordre,
        'figures', q.homework_correction_figures
      )
      order by q.homework_section_order, q.homework_exercise_order, q.ordre
    ), '[]'::jsonb)
    into v_corrections
    from jsonb_array_elements(coalesce(v_result -> 'corrections', '[]'::jsonb)) correction(item)
    join public.questions q on q.id = (correction.item ->> 'questionId')::uuid;

    v_result := jsonb_set(v_result, '{corrections}', v_corrections, true);
  end if;

  if v_release_after_submission and v_pending_review and not p_allow_admin_secrets then
    v_result := v_result
      - 'autoGradedPoints'
      - 'provisionalScoreOutOf20'
      - 'scoreOutOf20'
      - 'appreciation'
      - 'reviewComment';
  end if;

  return v_result;
end;
$$;

create or replace function public.finalize_homework_experience_attempt_v1(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform public.finalize_homework_attempt_v1(p_attempt_id);
  return public.homework_experience_result_json_v1(p_attempt_id, public.is_admin());
end;
$$;

create or replace function public.get_homework_experience_result_v1(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  perform public.get_homework_result_v1(p_attempt_id);
  return public.homework_experience_result_json_v1(p_attempt_id, public.is_admin());
end;
$$;

create or replace function public.import_homework_experience_package_v1(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_result jsonb;
  v_quiz_id uuid;
  v_question jsonb;
  v_figure jsonb;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'homework_payload_invalid'; end if;

  if coalesce((p_payload ->> 'correctionAfterSubmission')::boolean, false)
     and coalesce((p_payload ->> 'maxAttempts')::int, 0) <> 1 then
    raise exception 'homework_self_correction_requires_single_attempt';
  end if;
  if length(coalesce(p_payload ->> 'statementMarkdown', '')) > 120000 then
    raise exception 'homework_statement_too_long';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(coalesce(p_payload -> 'sections', '[]'::jsonb)) section(value),
         jsonb_array_elements(coalesce(section.value -> 'exercises', '[]'::jsonb)) exercise(value),
         jsonb_array_elements(coalesce(exercise.value -> 'questions', '[]'::jsonb)) question(value)
    where question.value ? 'correctionFigures'
      and jsonb_typeof(question.value -> 'correctionFigures') <> 'array'
  ) then raise exception 'homework_correction_figures_invalid'; end if;

  for v_question in
    select question.value
    from jsonb_array_elements(coalesce(p_payload -> 'sections', '[]'::jsonb)) section(value),
         jsonb_array_elements(coalesce(section.value -> 'exercises', '[]'::jsonb)) exercise(value),
         jsonb_array_elements(coalesce(exercise.value -> 'questions', '[]'::jsonb)) question(value)
  loop
    if jsonb_array_length(coalesce(v_question -> 'correctionFigures', '[]'::jsonb)) > 8 then
      raise exception 'homework_correction_figures_invalid';
    end if;
    for v_figure in
      select value from jsonb_array_elements(coalesce(v_question -> 'correctionFigures', '[]'::jsonb))
    loop
      if jsonb_typeof(v_figure) <> 'object'
         or coalesce(v_figure ->> 'url', '') !~ '^https://'
         or length(btrim(coalesce(v_figure ->> 'alt', ''))) < 3
         or length(coalesce(v_figure ->> 'caption', '')) > 1000 then
        raise exception 'homework_correction_figures_invalid';
      end if;
    end loop;
  end loop;

  v_result := public.import_homework_package_v1(p_payload);
  v_quiz_id := (v_result #>> '{homework,id}')::uuid;

  update public.quiz
  set homework_statement_markdown = nullif(btrim(coalesce(p_payload ->> 'statementMarkdown', '')), ''),
      homework_correction_after_submission = coalesce((p_payload ->> 'correctionAfterSubmission')::boolean, false),
      updated_at = now()
  where id = v_quiz_id;

  for v_question in
    select question.value
    from jsonb_array_elements(p_payload -> 'sections') section(value),
         jsonb_array_elements(section.value -> 'exercises') exercise(value),
         jsonb_array_elements(exercise.value -> 'questions') question(value)
  loop
    update public.questions
    set homework_correction_figures = coalesce(v_question -> 'correctionFigures', '[]'::jsonb),
        updated_at = now()
    where quiz_id = v_quiz_id
      and homework_question_key = v_question ->> 'id';
  end loop;

  return jsonb_set(
    v_result,
    '{homework}',
    public.homework_experience_summary_json_v1(v_quiz_id, auth.uid()),
    false
  );
end;
$$;

revoke all on function public.homework_experience_summary_json_v1(uuid, uuid) from public, anon, authenticated;
revoke all on function public.homework_experience_result_json_v1(uuid, boolean) from public, anon, authenticated;
revoke all on function public.list_homework_experiences_v1(text, text, text, text) from public, anon;
revoke all on function public.get_homework_experience_v1(text) from public, anon;
revoke all on function public.finalize_homework_experience_attempt_v1(uuid) from public, anon;
revoke all on function public.get_homework_experience_result_v1(uuid) from public, anon;
revoke all on function public.import_homework_experience_package_v1(jsonb) from public, anon;

grant execute on function public.list_homework_experiences_v1(text, text, text, text) to authenticated;
grant execute on function public.get_homework_experience_v1(text) to authenticated;
grant execute on function public.finalize_homework_experience_attempt_v1(uuid) to authenticated;
grant execute on function public.get_homework_experience_result_v1(uuid) to authenticated;
grant execute on function public.import_homework_experience_package_v1(jsonb) to authenticated;

notify pgrst, 'reload schema';

commit;
