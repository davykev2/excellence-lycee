-- Publie le premier cours continu de Français :
-- « La dissertation littéraire » (Terminales A, C et D).
--
-- Les huit identifiants et les poids bruts sont synchronisés avec
-- terminalFrenchLiteraryDissertationPath.ts et apps/api/src/curriculum.ts.
-- Répartition normalisée attendue :
--   740 / 1020 / 1110 / 1200 / 1300 / 1480 / 1390 / 1760 = 10 000 XP.

create temporary table terminal_french_dissertation_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into terminal_french_dissertation_manifest (path_id, lesson_ids) values
  (
    'terminale-french-l2-literary-dissertation',
    '[
      "terminale-french-l2-literary-dissertation-overview-barreme",
      "terminale-french-l2-literary-dissertation-analyze-subject",
      "terminale-french-l2-literary-dissertation-find-ideas",
      "terminale-french-l2-literary-dissertation-build-plan",
      "terminale-french-l2-literary-dissertation-write-introduction",
      "terminale-french-l2-literary-dissertation-write-development",
      "terminale-french-l2-literary-dissertation-write-conclusion",
      "terminale-french-l2-literary-dissertation-bac-2025-workshop"
    ]'
  );

with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[40, 55, 60, 65, 70, 80, 75, 95])[expanded.position]::integer as xp_awarded
  from terminal_french_dissertation_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

-- Reproduit distributeLessonXp : unités de 10 XP, plancher, puis reste
-- attribué aux plus grandes parties fractionnaires.
with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join terminal_french_dissertation_manifest as manifest using (path_id)
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

-- Une éventuelle progression locale est réalignée sans perdre le meilleur score.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id
  and progress.path_id = 'terminale-french-l2-literary-dissertation';
