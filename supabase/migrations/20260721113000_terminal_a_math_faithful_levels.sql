-- Rewards for the faithful 18-level Terminale A course and its final mission.
-- Legacy rewards remain available so completed attempts keep their history.

insert into public.lesson_rewards (path_id, lesson_id, xp_awarded) values
  ('terminale-a-polynomial-rational-functions', 'polynomial-limit-at-point', 50),
  ('terminale-a-polynomial-rational-functions', 'polynomial-limit-at-infinity', 55),
  ('terminale-a-polynomial-rational-functions', 'rational-limit-defined-point', 40),
  ('terminale-a-polynomial-rational-functions', 'one-sided-rational-limits', 60),
  ('terminale-a-polynomial-rational-functions', 'rational-limit-at-infinity', 55),
  ('terminale-a-polynomial-rational-functions', 'sum-of-limits', 45),
  ('terminale-a-polynomial-rational-functions', 'product-of-limits', 45),
  ('terminale-a-polynomial-rational-functions', 'inverse-and-quotient-limits', 60),
  ('terminale-a-polynomial-rational-functions', 'horizontal-asymptote', 45),
  ('terminale-a-polynomial-rational-functions', 'vertical-asymptote', 45),
  ('terminale-a-polynomial-rational-functions', 'oblique-asymptote', 65),
  ('terminale-a-polynomial-rational-functions', 'elementary-derivatives', 50),
  ('terminale-a-polynomial-rational-functions', 'derivative-operations', 60),
  ('terminale-a-polynomial-rational-functions', 'variations-and-relative-extrema', 75),
  ('terminale-a-polynomial-rational-functions', 'tangent-equation', 45),
  ('terminale-a-polynomial-rational-functions', 'intermediate-value-theorem', 60),
  ('terminale-a-polynomial-rational-functions', 'bisection-method', 55),
  ('terminale-a-polynomial-rational-functions', 'scanning-method', 50),
  ('terminale-a-polynomial-rational-functions', 'complete-function-study-mission', 100)
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;
