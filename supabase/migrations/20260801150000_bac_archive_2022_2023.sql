-- Ajoute deux annales de consultation. Les extraits source ne contiennent pas
-- toutes les questions/corrections nécessaires à une copie interactive : les
-- sujets et leurs résultats restent donc fermés par défaut.

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
  ('bac-ci-2022-archive', 'Sujet type BAC — Session 2022', 180, 41, false, false, '{}'::jsonb, '{}'::jsonb, now()),
  ('bac-ci-2023-archive', 'Sujet type BAC — Session 2023', 180, 43, false, false, '{}'::jsonb, '{}'::jsonb, now())
on conflict (exam_id) do update set
  title = excluded.title,
  duration_minutes = excluded.duration_minutes,
  question_count = excluded.question_count,
  updated_at = now();

notify pgrst, 'reload schema';
