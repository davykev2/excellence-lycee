-- Première tranche des annales du concours d'entrée à l'ESATIC.
-- Les sujets 2023 et 2024 sont publiés comme fac-similés de consultation :
-- les feuilles de réponses et corrigés interactifs seront ajoutés séparément.

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
  ('esatic-2023-archive', 'Concours d’entrée à l’ESATIC — Session 2023', 180, 80, false, false, '{}'::jsonb, '{}'::jsonb, now()),
  ('esatic-2024-archive', 'Concours d’entrée à l’ESATIC — Session 2024', 180, 100, false, false, '{}'::jsonb, '{}'::jsonb, now())
on conflict (exam_id) do update set
  title = excluded.title,
  duration_minutes = excluded.duration_minutes,
  question_count = excluded.question_count,
  updated_at = now();

notify pgrst, 'reload schema';
