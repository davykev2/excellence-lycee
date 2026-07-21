-- Rewards for Terminale A: polynomial and rational function mastery path.

insert into public.lesson_rewards (path_id, lesson_id, xp_awarded) values
  ('terminale-a-polynomial-rational-functions', 'polynomial-limits', 50),
  ('terminale-a-polynomial-rational-functions', 'rational-limits', 50),
  ('terminale-a-polynomial-rational-functions', 'limit-operations', 60),
  ('terminale-a-polynomial-rational-functions', 'asymptotes', 60),
  ('terminale-a-polynomial-rational-functions', 'derivatives-extrema', 70),
  ('terminale-a-polynomial-rational-functions', 'tangent-intermediate-value', 80)
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;
