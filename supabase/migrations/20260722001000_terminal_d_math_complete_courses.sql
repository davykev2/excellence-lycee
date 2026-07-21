-- Publie les 12 cours officiels de mathématiques de Terminale D.
-- Les PDF Terminale D correspondent aux blocs homologues déjà validés en Terminale C.
-- Les récompenses sont donc recopiées à identifiants de parcours distincts : 10 000 XP par leçon.

create temporary table terminal_d_math_path_map (
  path_id text primary key,
  source_path_id text not null unique
) on commit drop;

insert into terminal_d_math_path_map (path_id, source_path_id) values
  ('terminale-d-math-l01-limits-continuity', 'terminale-c-math-l01-limits-continuity'),
  ('terminale-d-math-l02-probability', 'terminale-c-math-l17-probability'),
  ('terminale-d-math-l03-derivatives-functions', 'terminale-c-math-l04-derivatives-functions'),
  ('terminale-d-math-l04-primitives', 'terminale-c-math-l06-primitives'),
  ('terminale-d-math-l05-logarithms', 'terminale-c-math-l08-logarithms'),
  ('terminale-d-math-l06-complex-numbers', 'terminale-c-math-l09-complex-numbers'),
  ('terminale-d-math-l07-exponential-power', 'terminale-c-math-l10-exponential-power'),
  ('terminale-d-math-l08-complex-geometry', 'terminale-c-math-l13-complex-geometry'),
  ('terminale-d-math-l09-sequences', 'terminale-c-math-l12-sequences'),
  ('terminale-d-math-l10-integral-calculus', 'terminale-c-math-l15-integral-calculus'),
  ('terminale-d-math-l11-statistics', 'terminale-c-math-l19-statistics'),
  ('terminale-d-math-l12-differential-equations', 'terminale-c-math-l18-differential-equations');

insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select mapping.path_id, reward.lesson_id, reward.xp_awarded
from terminal_d_math_path_map as mapping
join public.lesson_rewards as reward on reward.path_id = mapping.source_path_id
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

do $$
begin
  if exists (
    select 1
    from terminal_d_math_path_map as mapping
    left join public.lesson_rewards as reward on reward.path_id = mapping.path_id
    group by mapping.path_id
    having count(reward.lesson_id) = 0 or sum(reward.xp_awarded) <> 10000
  ) then
    raise exception 'Récompenses Terminale D incomplètes ou différentes de 10 000 XP';
  end if;
end
$$;

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
    select 1 from terminal_d_math_path_map as mapping where mapping.path_id = progress.path_id
  );
