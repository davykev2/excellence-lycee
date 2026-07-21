-- Excellence Lycée: XP des 15 parcours d'Histoire-Géographie et classement réel par classe.

with published_paths(path_id, lesson_suffixes) as (
  values
    ('terminale-hg-g1-cote-ivoire-development-foundations', array['overview', 'guided-natural-assets', 'guided-human-assets', 'guided-economic-policy-part-1', 'guided-economic-policy-part-2', 'mission-finale']),
    ('terminale-hg-g2-cote-ivoire-economic-sectors', array['overview', 'guided-primary-sector-part-1', 'guided-primary-sector-part-2', 'guided-secondary-sector', 'guided-tertiary-sector', 'mission-finale']),
    ('terminale-hg-g3-cote-ivoire-development-challenges', array['overview', 'guided-general-challenges-part-1', 'guided-general-challenges-part-2', 'guided-sector-challenges', 'guided-solutions', 'mission-finale']),
    ('terminale-hg-g4-south-korea-development-foundations', array['overview', 'guided-territory', 'guided-human-capital', 'guided-development-state-part-1', 'guided-development-state-part-2', 'mission-finale']),
    ('terminale-hg-g6-ecowas', array['overview', 'guided-creation-objectives', 'guided-institutions', 'guided-achievements-limits-part-1', 'guided-achievements-limits-part-2', 'mission-finale']),
    ('terminale-hg-g7-eu-acp-cooperation', array['overview', 'guided-partners', 'guided-agreements-part-1', 'guided-agreements-part-2', 'guided-assessment', 'mission-finale']),
    ('terminale-hg-h1-united-nations', array['overview', 'guided-creation-principles', 'guided-organs', 'guided-assessment-part-1', 'guided-assessment-part-2', 'mission-finale']),
    ('terminale-hg-h2-bipolar-world', array['overview', 'guided-formation-blocs', 'guided-crises-coexistence-part-1', 'guided-crises-coexistence-part-2', 'guided-collapse-ussr', 'mission-finale']),
    ('terminale-hg-h3-multipolar-world', array['overview', 'guided-american-hyperpower-part-1', 'guided-american-hyperpower-part-2', 'guided-world-policeman', 'guided-multipolarity', 'mission-finale']),
    ('terminale-hg-h4-african-nationalism', array['overview', 'guided-factors', 'guided-movements-part-1', 'guided-movements-part-2', 'guided-consequences', 'mission-finale']),
    ('terminale-hg-h5-cote-ivoire-independence', array['overview', 'guided-hope-phase', 'guided-struggle-phase', 'guided-collaboration-independence-part-1', 'guided-collaboration-independence-part-2', 'mission-finale']),
    ('terminale-hg-h6-algeria-independence', array['overview', 'guided-french-algeria', 'guided-insurrection', 'guided-evian-independence-part-1', 'guided-evian-independence-part-2', 'mission-finale']),
    ('terminale-hg-h7-african-union', array['overview', 'guided-birth-objectives', 'guided-institutions', 'guided-assessment-part-1', 'guided-assessment-part-2', 'mission-finale']),
    ('terminale-hg-h8-western-values', array['overview', 'guided-historical-foundations', 'guided-politics-economy-part-1', 'guided-politics-economy-part-2', 'guided-social-cultural', 'mission-finale']),
    ('terminale-hg-h9-negro-african-civilization-mutations', array['overview', 'guided-politics-economy-before-colonization', 'guided-society-culture-beliefs', 'guided-contemporary-mutations-part-1', 'guided-contemporary-mutations-part-2', 'mission-finale'])
), published_rewards as (
  select
    published_paths.path_id,
    published_paths.path_id || '-' || lesson.suffix as lesson_id,
    (array[40, 55, 60, 65, 70, 80])[lesson.ordinality::integer] as xp_awarded
  from published_paths
  cross join lateral unnest(published_paths.lesson_suffixes)
    with ordinality as lesson(suffix, ordinality)
)
insert into public.lesson_rewards (path_id, lesson_id, xp_awarded)
select path_id, lesson_id, xp_awarded
from published_rewards
on conflict (path_id, lesson_id) do update
  set xp_awarded = excluded.xp_awarded;

create or replace function public.get_class_leaderboard(p_period text default 'week')
returns table (
  user_id uuid,
  learner_name text,
  photo_url text,
  score bigint,
  completed_lessons bigint,
  streak_days bigint,
  ranking bigint,
  is_current_user boolean,
  level_id text
)
language plpgsql
security definer set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentification requise.' using errcode = '42501';
  end if;

  if p_period not in ('week', 'month', 'all-time') then
    raise exception 'Période de classement invalide.' using errcode = '22023';
  end if;

  return query
  with viewer as (
    select profile.level_id
    from public.profiles as profile
    where profile.id = auth.uid()
  ), class_members as (
    select profile.id, profile.name, profile.photo_url, profile.level_id
    from public.profiles as profile
    inner join viewer on viewer.level_id = profile.level_id
    where profile.account_type = 'student'
  ), period_settings as (
    select case p_period
      when 'week' then date_trunc('week', now() at time zone 'UTC') at time zone 'UTC'
      when 'month' then date_trunc('month', now() at time zone 'UTC') at time zone 'UTC'
      else null::timestamptz
    end as starts_at
  ), activity_days as (
    select distinct
      progress.user_id,
      (progress.completed_at at time zone 'UTC')::date as active_day
    from public.lesson_progress as progress
    inner join class_members on class_members.id = progress.user_id
  ), numbered_days as (
    select
      activity_days.user_id,
      activity_days.active_day,
      activity_days.active_day - (
        row_number() over (partition by activity_days.user_id order by activity_days.active_day)
      )::integer as island_key
    from activity_days
  ), latest_days as (
    select distinct on (numbered_days.user_id)
      numbered_days.user_id,
      numbered_days.active_day,
      numbered_days.island_key
    from numbered_days
    order by numbered_days.user_id, numbered_days.active_day desc
  ), streaks as (
    select
      numbered_days.user_id,
      case
        when latest_days.active_day >= (now() at time zone 'UTC')::date - 1
          then count(*)::bigint
        else 0::bigint
      end as streak_days
    from numbered_days
    inner join latest_days
      on latest_days.user_id = numbered_days.user_id
      and latest_days.island_key = numbered_days.island_key
    group by numbered_days.user_id, latest_days.active_day
  ), period_totals as (
    select
      member.id,
      member.name,
      member.photo_url,
      member.level_id,
      coalesce(sum(progress.xp_awarded) filter (
        where settings.starts_at is null or progress.completed_at >= settings.starts_at
      ), 0)::bigint as score,
      count(progress.id) filter (
        where settings.starts_at is null or progress.completed_at >= settings.starts_at
      )::bigint as completed_lessons,
      coalesce(streaks.streak_days, 0)::bigint as streak_days
    from class_members as member
    cross join period_settings as settings
    left join public.lesson_progress as progress on progress.user_id = member.id
    left join streaks on streaks.user_id = member.id
    group by member.id, member.name, member.photo_url, member.level_id, streaks.streak_days
  ), ranked as (
    select
      period_totals.*,
      row_number() over (
        order by period_totals.score desc, period_totals.streak_days desc, period_totals.name asc
      )::bigint as ranking
    from period_totals
  )
  select
    ranked.id,
    ranked.name,
    ranked.photo_url,
    ranked.score,
    ranked.completed_lessons,
    ranked.streak_days,
    ranked.ranking,
    ranked.id = auth.uid(),
    ranked.level_id
  from ranked
  order by ranked.ranking;
end;
$$;

revoke all on function public.get_class_leaderboard(text) from public, anon;
grant execute on function public.get_class_leaderboard(text) to authenticated;
