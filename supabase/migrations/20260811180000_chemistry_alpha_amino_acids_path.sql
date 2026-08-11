-- Publie la leçon de chimie « Les acides α-aminés » en Terminale D.
--
-- Le parcours n'existait pas auparavant : aucune récompense ni progression
-- historique n'est supprimée. Les poids sont identiques dans le Web, l'API et
-- cette migration, puis normalisés à exactement 10 000 XP.
-- Répartition attendue :
--   810 / 990 / 1080 / 1260 / 1350 / 1440 / 1350 / 1720 = 10 000.

create temporary table alpha_amino_acids_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into alpha_amino_acids_manifest (path_id, lesson_ids) values
  ('terminale-d-chemistry-alpha-amino-acids', '["alpha-amino-structure-nomenclature","alpha-amino-zwitterion-acid-base","peptide-bond-condensation-hydrolysis","peptide-selective-synthesis","alpha-amino-composition-identification","dipeptide-molar-mass","peptides-proteins-biuret","alpha-amino-final-mission"]');

with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[45, 55, 60, 70, 75, 80, 75, 95])[expanded.position]::integer as xp_awarded
  from alpha_amino_acids_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join alpha_amino_acids_manifest as manifest using (path_id)
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
