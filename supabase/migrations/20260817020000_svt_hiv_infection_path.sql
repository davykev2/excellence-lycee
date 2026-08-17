-- Publie la leçon de SVT « L'infection de l'organisme par le VIH »
-- (Terminale C, thème La défense de l'organisme et son dysfonctionnement).
--
-- C'est une création : le parcours n'existait pas encore. Cette migration
-- n'effectue donc aucune suppression et ne touche aucune progression existante.
--
-- Les poids bruts ci-dessous sont identiques à ceux du frontend
-- (apps/web/src/data/terminalCSvtHivInfectionPath.ts) et du registre XP de l'API
-- (apps/api/src/curriculum.ts), afin que l'XP affiché corresponde à l'XP attribué.
-- Répartition normalisée attendue :
--   640 / 780 / 920 / 990 / 1060 / 1210 / 1280 / 1420 / 1700 = 10 000.

create temporary table svt_hiv_infection_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into svt_hiv_infection_manifest (path_id, lesson_ids) values
  ('terminale-c-svt-l6-hiv-infection', '["virion-structure","cd4-entry-fusion","reverse-transcription-integration","viral-expression-assembly","acute-infection-seroconversion","chronic-phase-aids","transmission-prevention-treatment","official-sequence-gap-exercises","mother-child-diagnosis-final-mission"]');

-- 1. Écrit les poids bruts des neuf niveaux.
with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[45, 55, 65, 70, 75, 85, 90, 100, 120])[expanded.position]::integer as xp_awarded
  from svt_hiv_infection_manifest as manifest
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
  join svt_hiv_infection_manifest as manifest using (path_id)
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
