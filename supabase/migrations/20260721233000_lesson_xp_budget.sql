-- Chaque leçon/parcours publié distribue exactement 10 000 XP entre ses niveaux.
-- Les poids historiques sont conservés afin que les niveaux avancés restent plus récompensés.
-- La distribution se fait par tranches de 10 XP et le reliquat est attribué de façon déterministe.

alter table public.lesson_rewards
  drop constraint if exists lesson_rewards_xp_awarded_check;

alter table public.lesson_rewards
  add constraint lesson_rewards_xp_awarded_check
  check (xp_awarded between 0 and 10000);

-- Ces six identifiants appartenaient à l’ancienne version condensée du parcours.
-- Ils ne sont plus présentés aux élèves et ne doivent pas entrer dans le budget des 19 niveaux actuels.
delete from public.lesson_rewards
where path_id = 'terminale-a-polynomial-rational-functions'
  and lesson_id in (
    'polynomial-limits',
    'rational-limits',
    'limit-operations',
    'asymptotes',
    'derivatives-extrema',
    'tangent-intermediate-value'
  );

with reward_weights as (
  select
    path_id,
    lesson_id,
    xp_awarded as weight,
    sum(xp_awarded) over (partition by path_id) as total_weight
  from public.lesson_rewards
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

-- Les élèves ayant déjà validé un niveau reçoivent automatiquement le nouveau barème
-- selon leur meilleur score : totalité à 20/20, moitié à partir de 10/20.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id;
