-- Rend les sessions ESATIC 2023 et 2024 composables avec les mêmes garanties
-- que les concours BAC : sujets/résultats indépendants et notes par épreuve.
-- Les clés de réponses restent volontairement hors du dépôt.

update public.bac_exam_settings
set duration_minutes = 180,
    subject_published = false,
    results_published = false,
    updated_at = now()
where exam_id in ('esatic-2023-archive', 'esatic-2024-archive');

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
    when p_exam_id = 'esatic-2023-archive' and p_question_number between 1 and 25 then 'english'
    when p_exam_id = 'esatic-2023-archive' and p_question_number between 26 and 50 then 'generalKnowledge'
    when p_exam_id = 'esatic-2023-archive' and p_question_number between 51 and 80 then 'scientificKnowledge'
    when p_exam_id = 'esatic-2024-archive' and p_question_number between 1 and 25 then 'english'
    when p_exam_id = 'esatic-2024-archive' and p_question_number between 26 and 50 then 'generalKnowledge'
    when p_exam_id = 'esatic-2024-archive' and p_question_number between 51 and 100 then 'scientificKnowledge'
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
    when p_exam_id = 'esatic-2023-archive' and p_section in ('english', 'generalKnowledge') then 25
    when p_exam_id = 'esatic-2023-archive' and p_section = 'scientificKnowledge' then 30
    when p_exam_id = 'esatic-2024-archive' and p_section in ('english', 'generalKnowledge') then 25
    when p_exam_id = 'esatic-2024-archive' and p_section = 'scientificKnowledge' then 50
    when p_exam_id = 'bac-ci-2024-level-test' and p_section = 'english' then 20
    when p_exam_id = 'bac-ci-2024-level-test' and p_section = 'generalKnowledge' then 25
    when p_exam_id = 'bac-ci-2024-level-test' and p_section = 'scientificKnowledge' then 24
    else 0
  end;
$$;

revoke all on function public.bac_exam_section_code(text, integer) from public, anon, authenticated;
revoke all on function public.bac_exam_section_max(text, text) from public, anon, authenticated;

notify pgrst, 'reload schema';
