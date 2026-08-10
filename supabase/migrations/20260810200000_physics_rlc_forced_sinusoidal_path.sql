-- Publie la leçon de Physique « Circuit RLC en régime sinusoïdal forcé »
-- (leçon 13 en Terminale C et leçon 11 en Terminale D, thème Électricité).
--
-- C'est une création : le parcours n'existait pas encore. Cette migration
-- n'effectue aucune suppression et ne touche aucune progression existante.
--
-- Les poids bruts sont identiques au frontend et au registre XP de l'API.
-- Répartition normalisée attendue :
--   590 / 720 / 850 / 970 / 1100 / 1230 / 1360 / 1490 / 1690 = 10 000 XP.

create temporary table rlc_forced_sinusoidal_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into rlc_forced_sinusoidal_manifest (path_id, lesson_ids) values
  ('terminale-cd-rlc-forced-sinusoidal', '["sinusoidal-current-effective-values","rlc-experimental-impedance","oscilloscope-phase-shift","rlc-series-dipoles-equation","fresnel-vector-construction","rlc-impedance-phase-nature","rlc-official-fresnel-mission","rlc-oscilloscope-current-mission","rc-capacitance-data-audit-mission"]');

-- 1. Écrit les poids bruts des neuf niveaux.
with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[45, 55, 65, 75, 85, 95, 105, 115, 130])[expanded.position]::integer as xp_awarded
  from rlc_forced_sinusoidal_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

-- 2. Normalise à 10 000 XP par tranches de 10, avec la même règle de
-- départage déterministe que distributeLessonXp côté frontend.
with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join rlc_forced_sinusoidal_manifest as manifest using (path_id)
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
