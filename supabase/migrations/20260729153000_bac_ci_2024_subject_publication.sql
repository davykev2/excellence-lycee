-- L'ouverture du sujet et la publication des résultats sont deux décisions
-- indépendantes. Le sujet reste fermé tant qu'un administrateur ne l'ouvre pas.

alter table public.bac_exam_settings
  add column if not exists subject_published boolean not null default false;

update public.bac_exam_settings
set subject_published = false
where exam_id = 'bac-ci-2024-level-test';

create or replace function public.get_bac_exam_availability(p_exam_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_subject_published boolean;
  v_is_admin boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select subject_published into v_subject_published
  from public.bac_exam_settings
  where exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  select coalesce(role = 'admin', false) into v_is_admin
  from public.profiles
  where id = v_user_id;

  return jsonb_build_object(
    'subjectPublished', v_subject_published,
    'canManageSubject', v_is_admin
  );
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
  v_subject_published boolean;
  v_submitted_at timestamptz := now();
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select question_count, subject_published
  into v_question_count, v_subject_published
  from public.bac_exam_settings
  where exam_id = p_exam_id;
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

create or replace function public.set_bac_exam_subject_published(
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
  v_is_admin boolean := false;
begin
  if v_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  select coalesce(role = 'admin', false) into v_is_admin
  from public.profiles
  where id = v_user_id;
  if not v_is_admin then
    raise exception 'Seul un administrateur peut ouvrir ou fermer ce sujet.' using errcode = '42501';
  end if;

  update public.bac_exam_settings
  set subject_published = p_published,
      updated_by = v_user_id,
      updated_at = now()
  where exam_id = p_exam_id;
  if not found then
    raise exception 'Épreuve introuvable.' using errcode = 'P0002';
  end if;

  return p_published;
end;
$$;

revoke all on function public.get_bac_exam_availability(text) from public;
revoke all on function public.submit_bac_exam(text, jsonb) from public;
revoke all on function public.set_bac_exam_subject_published(text, boolean) from public;
grant execute on function public.get_bac_exam_availability(text) to authenticated;
grant execute on function public.submit_bac_exam(text, jsonb) to authenticated;
grant execute on function public.set_bac_exam_subject_published(text, boolean) to authenticated;

notify pgrst, 'reload schema';
