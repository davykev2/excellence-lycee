-- Publie la leçon de SVT « La reproduction chez les spermaphytes »
-- (Terminale D, chapitre 7 du catalogue). Le cours distingue la portée générale
-- des spermaphytes de la double fécondation et du fruit, propres aux angiospermes.
--
-- C'est une création : le parcours n'existait pas encore. Cette migration
-- n'effectue donc aucune suppression de récompense.
--
-- Les poids bruts ci-dessous sont identiques à ceux du frontend
-- (apps/web/src/data/terminalDSvtSpermaphyteReproductionPath.ts) et du registre
-- XP de l'API (apps/api/src/curriculum.ts). Répartition normalisée attendue :
--   590 / 720 / 860 / 920 / 1050 / 1190 / 1320 / 1510 / 1840 = 10 000.

create temporary table svt_d_spermaphyte_reproduction_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into svt_d_spermaphyte_reproduction_manifest (path_id, lesson_ids) values
  ('terminale-d-svt-l7-spermaphyte-reproduction', '["flowering-plant-scope-pollination","anther-pollen-sacs-dehiscence","microsporogenesis-pollen-grain","ovary-ovule-anatomy","megasporogenesis-embryo-sac","pollination-pollen-tube-guidance","double-fertilization-seed-fruit","official-vocabulary-order-ploidy","spermaphyte-reproduction-final-mission"]');

-- 1. Écrit les poids bruts des neuf niveaux.
with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[45, 55, 65, 70, 80, 90, 100, 115, 140])[expanded.position]::integer as xp_awarded
  from svt_d_spermaphyte_reproduction_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

-- 2. Normalise le parcours à 10 000 XP par tranches de 10 XP. La méthode
--    reproduit distributeLessonXp du frontend : plancher, puis attribution
--    des unités restantes aux plus grandes parties fractionnaires.
with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join svt_d_spermaphyte_reproduction_manifest as manifest using (path_id)
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

-- 3. Conserve le meilleur score déjà acquis, tout en réalignant les XP sur le
--    barème normalisé du niveau si la migration est rejouée après une activité.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id
  and progress.path_id = 'terminale-d-svt-l7-spermaphyte-reproduction';
