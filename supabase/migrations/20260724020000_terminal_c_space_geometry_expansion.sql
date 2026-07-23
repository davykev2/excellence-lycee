-- Enrichit la leçon 05 « Géométrie analytique de l’espace » de Terminale C.
-- Les six identifiants historiques restent présents et six niveaux officiels
-- supplémentaires couvrent la distance, la situation complexe et les ateliers.

create temporary table terminal_c_space_geometry_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into terminal_c_space_geometry_manifest (path_id, lesson_ids) values
  (
    'terminale-c-math-l05-space-analytic-geometry',
    '["plane-normal-vector","plane-cartesian-equation","point-plane-distance","line-parametric-form","relative-lines-space","line-plane-position","relative-planes","sculpture-orthogonality-mission","official-applications-workshop","orthogonal-planes-reinforcement","containing-plane-reinforcement","parameterized-planes-mission"]'
  );

-- Poids bruts partagés par le frontend et l’API :
-- 50 + min(index, 7) * 5.
with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (50 + least(expanded.position - 1, 7) * 5)::integer as xp_awarded
  from terminal_c_space_geometry_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

delete from public.lesson_rewards as reward
using terminal_c_space_geometry_manifest as manifest
where reward.path_id = manifest.path_id
  and not (manifest.lesson_ids ? reward.lesson_id);

-- Répartit exactement 10 000 XP, par tranches de 10 XP, selon le même
-- algorithme que `distributeLessonXp` dans le frontend.
with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join terminal_c_space_geometry_manifest as manifest using (path_id)
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

-- Conserve le meilleur score déjà acquis, tout en réalignant les XP sur le
-- nouveau barème du niveau.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id
  and progress.path_id = 'terminale-c-math-l05-space-analytic-geometry';
