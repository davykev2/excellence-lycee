-- Publie la leçon 04 de Physique « Mouvements dans les champs g et E uniformes »
-- (Terminales C et D, thème Mécanique).
--
-- C'est une création : le parcours n'existait pas encore. Cette migration
-- n'effectue donc aucune suppression et ne touche aucune progression existante.
--
-- Les poids bruts ci-dessous sont identiques à ceux du frontend
-- (apps/web/src/data/terminalCDUniformFieldsPath.ts) et du registre XP de l'API
-- (apps/api/src/curriculum.ts), afin que l'XP affiché corresponde à l'XP attribué.
-- Répartition normalisée attendue :
--   990 / 1360 / 1600 / 1730 / 1970 / 2350 = 10 000.
-- Les six poids (40, 55, 65, 70, 80, 95) étant distincts, aucune partie
-- fractionnaire n'est partagée : la règle de départage `lesson_id asc` n'a aucun effet.

create temporary table uniform_fields_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into uniform_fields_manifest (path_id, lesson_ids) values
  ('terminale-cd-uniform-fields', '["uniform-field","projectile-motion","projectile-range-height","charged-particle-motion","electrostatic-deflection","oscilloscope-mission"]');

-- 1. Écrit les poids bruts de progression des six niveaux.
with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[40, 55, 65, 70, 80, 95])[expanded.position]::integer as xp_awarded
  from uniform_fields_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

-- 2. Normalise pour que le parcours vaille exactement 10 000 XP, par tranches de
--    10 XP, en attribuant les unités restantes aux plus grandes parties
--    fractionnaires. Cet algorithme reproduit `distributeLessonXp` du frontend.
with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join uniform_fields_manifest as manifest using (path_id)
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
