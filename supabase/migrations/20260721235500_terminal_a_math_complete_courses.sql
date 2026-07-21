-- Publie les niveaux fidèles aux cours officiels de mathématiques de Terminale A.
-- Chaque ligne conserve un poids pédagogique ; la seconde partie distribue exactement 10 000 XP par leçon.

insert into public.lesson_rewards (path_id, lesson_id, xp_awarded) values
  ('terminale-a1-probability-random-variable', 'random-experiments-events', 45),
  ('terminale-a1-probability-random-variable', 'probability-events-subsets', 45),
  ('terminale-a1-probability-random-variable', 'event-operations', 55),
  ('terminale-a1-probability-random-variable', 'finite-probability', 60),
  ('terminale-a1-probability-random-variable', 'probability-event-properties', 60),
  ('terminale-a1-probability-random-variable', 'probability-equiprobability', 75),
  ('terminale-a1-probability-random-variable', 'random-variable-law', 85),
  ('terminale-a2-probability', 'random-experiments-events', 45),
  ('terminale-a2-probability', 'probability-events-subsets', 45),
  ('terminale-a2-probability', 'event-operations', 55),
  ('terminale-a2-probability', 'finite-probability', 60),
  ('terminale-a2-probability', 'probability-event-properties', 60),
  ('terminale-a2-probability', 'probability-equiprobability', 75),
  ('terminale-a-natural-logarithm', 'log-definition-properties', 50),
  ('terminale-a-natural-logarithm', 'log-algebraic-properties', 55),
  ('terminale-a-natural-logarithm', 'log-limits-variations', 60),
  ('terminale-a-natural-logarithm', 'log-derivative-variation', 65),
  ('terminale-a-natural-logarithm', 'log-equations-inequalities', 75),
  ('terminale-a-natural-logarithm', 'log-inequalities', 75),
  ('terminale-a-natural-logarithm', 'log-composite-derivatives', 70),
  ('terminale-a-natural-logarithm', 'log-primitives', 75),
  ('terminale-a-exponential', 'exp-definition-properties', 50),
  ('terminale-a-exponential', 'exp-algebraic-properties', 55),
  ('terminale-a-exponential', 'exp-limits-variations', 65),
  ('terminale-a-exponential', 'exp-derivative-variation', 65),
  ('terminale-a-exponential', 'exp-equations-inequalities', 75),
  ('terminale-a-exponential', 'exp-inequalities', 75),
  ('terminale-a-exponential', 'exp-composite-derivatives', 75),
  ('terminale-a-exponential', 'exp-primitives-a1', 80),
  ('terminale-a-sequences', 'arithmetic-sequences', 50),
  ('terminale-a-sequences', 'arithmetic-general-term', 55),
  ('terminale-a-sequences', 'arithmetic-variation', 45),
  ('terminale-a-sequences', 'arithmetic-sums', 65),
  ('terminale-a-sequences', 'geometric-sequences', 50),
  ('terminale-a-sequences', 'geometric-general-term', 55),
  ('terminale-a-sequences', 'geometric-variation', 45),
  ('terminale-a-sequences', 'geometric-sums-modeling', 70),
  ('terminale-a-bivariate-statistics', 'statistical-series-scatterplot', 45),
  ('terminale-a-bivariate-statistics', 'mean-point-marginals', 50),
  ('terminale-a-bivariate-statistics', 'statistical-scatterplot', 50),
  ('terminale-a-bivariate-statistics', 'statistical-mean-point', 55),
  ('terminale-a-bivariate-statistics', 'mayer-adjustment', 60),
  ('terminale-a-bivariate-statistics', 'mayer-equation', 65),
  ('terminale-a-bivariate-statistics', 'covariance-correlation-regression', 65),
  ('terminale-a-bivariate-statistics', 'correlation-regression-a1', 80),
  ('terminale-a-bivariate-statistics', 'statistical-estimation', 75),
  ('terminale-a-linear-systems', 'substitution-elimination', 60),
  ('terminale-a-linear-systems', 'log-exp-systems', 70),
  ('terminale-a-linear-systems', 'linear-inequalities-halfplanes', 65),
  ('terminale-a-linear-systems', 'inequality-systems-modeling', 75),
  ('terminale-a-primitives-integrals', 'primitive-definition-usual-functions', 50),
  ('terminale-a-primitives-integrals', 'primitive-initial-condition', 55),
  ('terminale-a-primitives-integrals', 'primitive-usual-functions', 60),
  ('terminale-a-primitives-integrals', 'primitive-sum', 60),
  ('terminale-a-primitives-integrals', 'primitive-scalar-multiple', 60),
  ('terminale-a-primitives-integrals', 'composite-primitives', 70),
  ('terminale-a-primitives-integrals', 'primitive-logarithmic-form', 75),
  ('terminale-a-primitives-integrals', 'primitive-exponential-form', 75),
  ('terminale-a-primitives-integrals', 'definite-integral', 70),
  ('terminale-a-primitives-integrals', 'integral-positive-area', 75),
  ('terminale-a-primitives-integrals', 'integral-area', 85)
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

with affected_paths(path_id) as (
  values
    ('terminale-a1-probability-random-variable'),
    ('terminale-a2-probability'),
    ('terminale-a-natural-logarithm'),
    ('terminale-a-exponential'),
    ('terminale-a-sequences'),
    ('terminale-a-bivariate-statistics'),
    ('terminale-a-linear-systems'),
    ('terminale-a-primitives-integrals')
),
reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join affected_paths using (path_id)
),
base_allocations as (
  select
    path_id,
    lesson_id,
    floor(1000.0 * weight / nullif(total_weight, 0))::integer as base_units,
    (1000.0 * weight / nullif(total_weight, 0))
      - floor(1000.0 * weight / nullif(total_weight, 0)) as fractional_units
  from reward_weights
),
allocations_with_remainder as (
  select
    path_id,
    lesson_id,
    base_units,
    fractional_units,
    1000 - sum(base_units) over (partition by path_id) as remaining_units
  from base_allocations
),
ranked_allocations as (
  select
    path_id,
    lesson_id,
    base_units,
    remaining_units,
    row_number() over (
      partition by path_id
      order by fractional_units desc, lesson_id asc
    ) as bonus_rank
  from allocations_with_remainder
),
normalized_rewards as (
  select
    path_id,
    lesson_id,
    (base_units + case when bonus_rank <= remaining_units then 1 else 0 end) * 10 as xp_awarded
  from ranked_allocations
)
update public.lesson_rewards as reward
set xp_awarded = normalized.xp_awarded
from normalized_rewards as normalized
where reward.path_id = normalized.path_id
  and reward.lesson_id = normalized.lesson_id;

-- Recalcule les validations déjà acquises sans faire perdre le meilleur score de l’élève.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id
  and progress.path_id in (
    'terminale-a1-probability-random-variable',
    'terminale-a2-probability',
    'terminale-a-natural-logarithm',
    'terminale-a-exponential',
    'terminale-a-sequences',
    'terminale-a-bivariate-statistics',
    'terminale-a-linear-systems',
    'terminale-a-primitives-integrals'
  );
