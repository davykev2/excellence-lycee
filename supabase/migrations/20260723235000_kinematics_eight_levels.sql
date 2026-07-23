-- Passe la leçon « Cinématique du point » (Terminale C/D) de 4 à 8 niveaux.
--
-- Deux identifiants historiques sont conservés (position-vector, velocity-vector),
-- deux sont retirés car leur découpage a changé (acceleration-motion, motion-equations)
-- et six niveaux sont ajoutés. Le parcours distribue toujours exactement 10 000 XP :
-- la répartition est donc entièrement recalculée, puis les progressions déjà
-- enregistrées sont réalignées sans faire perdre le meilleur score des élèves.
--
-- Les poids bruts ci-dessous sont identiques à ceux du frontend
-- (apps/web/src/data/physicsPaths.ts) et du registre XP de l'API
-- (apps/api/src/curriculum.ts), afin que l'XP affiché corresponde à l'XP attribué.

create temporary table kinematics_manifest (
  path_id text primary key,
  lesson_ids jsonb not null
) on commit drop;

insert into kinematics_manifest (path_id, lesson_ids) values
  ('seconde-c-kinematics', '["kinematics-rappels","position-vector","velocity-vector","acceleration-vector","rectilinear-uniform-motion","rectilinear-varied-motion","circular-uniform-motion","pursuit-mission"]');

-- 1. Retire les deux niveaux de l'ancien découpage, ainsi que les progressions
--    qui s'y rattachaient : ils ne sont plus présentés aux élèves et ne doivent
--    plus entrer dans le budget des 10 000 XP.
delete from public.lesson_progress
where path_id = 'seconde-c-kinematics'
  and lesson_id in ('acceleration-motion', 'motion-equations');

delete from public.lesson_rewards
where path_id = 'seconde-c-kinematics'
  and lesson_id in ('acceleration-motion', 'motion-equations');

-- 2. Écrit les poids bruts de progression des huit niveaux.
with raw_rewards as (
  select
    manifest.path_id,
    expanded.lesson_id,
    (array[40, 50, 60, 65, 55, 70, 75, 95])[expanded.position]::integer as xp_awarded
  from kinematics_manifest as manifest
  cross join lateral jsonb_array_elements_text(manifest.lesson_ids)
    with ordinality as expanded(lesson_id, position)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from raw_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

-- 3. Normalise pour que le parcours vaille exactement 10 000 XP, par tranches de
--    10 XP, en attribuant les unités restantes aux plus grandes parties
--    fractionnaires. Cet algorithme reproduit `distributeLessonXp` du frontend.
with reward_weights as (
  select
    reward.path_id,
    reward.lesson_id,
    reward.xp_awarded as weight,
    sum(reward.xp_awarded) over (partition by reward.path_id) as total_weight
  from public.lesson_rewards as reward
  join kinematics_manifest as manifest using (path_id)
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

-- 4. Réaligne les validations déjà acquises sur le nouveau barème, en conservant
--    le meilleur score obtenu : 20/20 donne la totalité du niveau, 10 à 19/20 la moitié.
update public.lesson_progress as progress
set xp_awarded = case
  when progress.best_score = 20 then reward.xp_awarded
  when progress.best_score >= 10 then floor(reward.xp_awarded / 2.0)::integer
  else 0
end
from public.lesson_rewards as reward
where progress.path_id = reward.path_id
  and progress.lesson_id = reward.lesson_id
  and exists (
    select 1 from kinematics_manifest as manifest
    where manifest.path_id = progress.path_id
  );
