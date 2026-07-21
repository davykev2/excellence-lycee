-- Mastery levels: partial XP, perfect-score upgrades and repeatable attempts.

alter table public.lesson_progress
  add column if not exists best_score integer not null default 20
    check (best_score between 0 and 20),
  add column if not exists attempt_count integer not null default 1
    check (attempt_count >= 1);

insert into public.lesson_rewards (path_id, lesson_id, xp_awarded) values
  ('seconde-c-kinematics', 'position-vector', 40),
  ('seconde-c-kinematics', 'velocity-vector', 50),
  ('seconde-c-kinematics', 'acceleration-motion', 60),
  ('seconde-c-kinematics', 'motion-equations', 80)
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

create or replace function public.submit_level_attempt(
  p_path_id text,
  p_lesson_id text,
  p_score integer
)
returns table(
  passed boolean,
  improved boolean,
  xp_delta integer,
  xp_awarded integer,
  best_score integer,
  attempt_count integer
)
language plpgsql
security definer set search_path = ''
as $$
declare
  current_user_id uuid;
  reward integer;
  desired_xp integer;
  previous_xp integer;
  previous_best integer;
  previous_attempts integer;
  next_xp integer;
  next_best integer;
  next_attempts integer;
begin
  current_user_id := auth.uid();
  if current_user_id is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if p_score < 0 or p_score > 20 then
    raise exception 'Le score doit être compris entre 0 et 20.' using errcode = '22023';
  end if;

  select r.xp_awarded into reward
  from public.lesson_rewards r
  where r.path_id = p_path_id and r.lesson_id = p_lesson_id;

  if reward is null then
    raise exception 'Niveau introuvable dans le programme publié.' using errcode = 'P0002';
  end if;

  desired_xp := case
    when p_score = 20 then reward
    when p_score >= 10 then floor(reward / 2.0)::integer
    else 0
  end;

  select lp.xp_awarded, lp.best_score, lp.attempt_count
  into previous_xp, previous_best, previous_attempts
  from public.lesson_progress lp
  where lp.user_id = current_user_id
    and lp.path_id = p_path_id
    and lp.lesson_id = p_lesson_id
  for update;

  if found then
    next_xp := greatest(previous_xp, desired_xp);
    next_best := greatest(previous_best, p_score);
    next_attempts := previous_attempts + 1;

    update public.lesson_progress lp
    set xp_awarded = next_xp,
        best_score = next_best,
        attempt_count = next_attempts
    where lp.user_id = current_user_id
      and lp.path_id = p_path_id
      and lp.lesson_id = p_lesson_id;

    return query select
      p_score >= 10,
      next_xp > previous_xp,
      next_xp - previous_xp,
      next_xp,
      next_best,
      next_attempts;
    return;
  end if;

  if p_score < 10 then
    return query select false, false, 0, 0, p_score, 1;
    return;
  end if;

  insert into public.lesson_progress (
    user_id, path_id, lesson_id, xp_awarded, best_score, attempt_count
  ) values (
    current_user_id, p_path_id, p_lesson_id, desired_xp, p_score, 1
  );

  return query select true, true, desired_xp, desired_xp, p_score, 1;
end;
$$;

revoke all on function public.complete_lesson(text, text) from authenticated;
revoke all on function public.submit_level_attempt(text, text, integer) from public, anon;
grant execute on function public.submit_level_attempt(text, text, integer) to authenticated;
