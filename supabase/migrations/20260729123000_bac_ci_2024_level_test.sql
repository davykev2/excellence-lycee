-- Épreuve unique « Concours BAC & BT 2024 — Test de niveau ».
-- La copie de chaque candidat est figée à la validation. Le corrigé et la clé
-- restent côté serveur jusqu'à leur publication explicite par un administrateur.

create table if not exists public.bac_exam_settings (
  exam_id text primary key,
  title text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  question_count integer not null check (question_count > 0),
  results_published boolean not null default false,
  answer_key jsonb not null default '{}'::jsonb check (jsonb_typeof(answer_key) = 'object'),
  corrections jsonb not null default '{}'::jsonb check (jsonb_typeof(corrections) = 'object'),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

create table if not exists public.bac_exam_submissions (
  id uuid primary key default gen_random_uuid(),
  exam_id text not null references public.bac_exam_settings(exam_id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  answers jsonb not null check (jsonb_typeof(answers) = 'object'),
  submitted_at timestamptz not null default now(),
  unique (exam_id, user_id)
);

create index if not exists bac_exam_submissions_user_idx
  on public.bac_exam_submissions(user_id, submitted_at desc);

insert into public.bac_exam_settings (
  exam_id,
  title,
  duration_minutes,
  question_count
) values (
  'bac-ci-2024-level-test',
  'Concours BAC & BT 2024 — Test de niveau',
  180,
  69
)
on conflict (exam_id) do update set
  title = excluded.title,
  duration_minutes = excluded.duration_minutes,
  question_count = excluded.question_count;

alter table public.bac_exam_settings enable row level security;
alter table public.bac_exam_submissions enable row level security;

-- Aucune lecture directe : les fonctions ci-dessous filtrent la clé et le
-- corrigé avant publication.
revoke all on public.bac_exam_settings from anon, authenticated;
revoke all on public.bac_exam_submissions from anon, authenticated;

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
  v_correct_answers integer := 0;
  v_state jsonb;
  v_result_corrections jsonb := '{}'::jsonb;
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
    'canPublishResults', v_is_admin and v_answer_key_ready
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

  if v_settings.results_published and v_answer_key_ready and v_submission.id is not null then
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

    v_state := v_state || jsonb_build_object(
      'result',
      jsonb_build_object(
        'correctAnswers', v_correct_answers,
        'scoreOutOf20', round((v_correct_answers * 20.0 / v_settings.question_count)::numeric, 2),
        'corrections', v_result_corrections
      )
    );
  end if;

  return v_state;
end;
$$;

create or replace function public.submit_bac_exam(
  p_exam_id text,
  p_answers jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_question_count integer;
  v_submitted_at timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select question_count into v_question_count
  from public.bac_exam_settings
  where exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
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
    raise exception 'Réponds aux 69 questions avant de valider ta copie.' using errcode = '22023';
  end if;

  if exists (
    select 1 from public.bac_exam_submissions
    where exam_id = p_exam_id and user_id = v_user_id
  ) then
    raise exception 'Ta copie a déjà été validée.' using errcode = 'P0001';
  end if;

  insert into public.bac_exam_submissions (exam_id, user_id, answers, submitted_at)
  values (p_exam_id, v_user_id, p_answers, v_submitted_at);

  return v_submitted_at::text;
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

  if p_published and not v_answer_key_ready then
    raise exception 'La correction complète doit être chargée avant la publication.' using errcode = '55000';
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
revoke all on function public.submit_bac_exam(text, jsonb) from public;
revoke all on function public.set_bac_exam_results_published(text, boolean) from public;
grant execute on function public.get_bac_exam_state(text) to authenticated;
grant execute on function public.submit_bac_exam(text, jsonb) to authenticated;
grant execute on function public.set_bac_exam_results_published(text, boolean) to authenticated;
