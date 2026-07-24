-- EXCELLENCE LYCEE (nouvel app) - Arene de duels v3 : modele de donnees
--
-- Duel neuf, aligne sur le nouvel app (profiles email/name/role/level_id) et sur
-- la vision produit : un duel porte sur UN OU PLUSIEURS exercices, chacun avec
-- ses questions (QCM, saisie, vrai/faux), le tout filtre par difficulte.
--
-- Cette migration installe UNIQUEMENT le modele de donnees (tables + RLS +
-- index) et une premiere RPC de lecture (catalogue). Les RPC de creation, de
-- lobby et de jeu temps reel viendront dans une migration suivante, une fois ce
-- schema valide.
--
-- A appliquer sur le projet Supabase DU NOUVEL APP (celui de excellence_core),
-- pas sur le projet legacy.

begin;

-- ---------------------------------------------------------------------------
-- 1. Banque de contenu : exercices -> questions, tagues difficulte
-- ---------------------------------------------------------------------------

create table if not exists public.duel_exercises (
  id uuid primary key default gen_random_uuid(),
  level_id text not null check (level_id in (
    'seconde-a', 'seconde-c', 'premiere-a', 'premiere-c', 'premiere-d',
    'terminale-a', 'terminale-c', 'terminale-d'
  )),
  subject_id text not null,
  topic text not null,                       -- regroupe des exercices (ex. "Derivation")
  title text not null,
  statement_markdown text not null default '', -- enonce / contexte partage par les questions
  difficulty text not null check (difficulty in (
    'facile', 'moyen', 'difficile', 'tres-difficile', 'ultra'
  )),
  published boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_duel_exercises_pool
  on public.duel_exercises(subject_id, level_id, difficulty, topic)
  where published = true;

create table if not exists public.duel_questions (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references public.duel_exercises(id) on delete cascade,
  position integer not null default 1 check (position between 1 and 50),
  type text not null check (type in ('qcm', 'saisie', 'vrai-faux')),
  prompt_markdown text not null,
  choices jsonb,             -- QCM : ["a", "b", ...] ; sinon null
  answer jsonb not null,     -- QCM : bonne option ; saisie : ["2x-3", ...] (formes acceptees) ; vrai-faux : true/false
  explanation_markdown text not null default '',
  points integer not null default 1 check (points between 1 and 10),
  created_at timestamptz not null default now(),
  unique (exercise_id, position)
);

create index if not exists idx_duel_questions_exercise
  on public.duel_questions(exercise_id, position);

-- ---------------------------------------------------------------------------
-- 2. Duels (matchs) et reponses
-- ---------------------------------------------------------------------------

create table if not exists public.duels (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references public.profiles(id) on delete cascade,
  opponent_id uuid not null references public.profiles(id) on delete cascade,
  level_id text not null,
  subject_id text not null,
  topics text[] not null default '{}'::text[],
  difficulty text not null check (difficulty in (
    'facile', 'moyen', 'difficile', 'tres-difficile', 'ultra'
  )),
  question_count integer not null check (question_count between 1 and 20),
  duration_sec integer not null default 90 check (duration_sec = 90),
  status text not null default 'pending'
    check (status in ('pending', 'active', 'finished', 'declined', 'expired')),
  -- Snapshot fige, identique pour les deux joueurs. Ne contient jamais la bonne
  -- reponse cote client : la correction n'est exposee qu'a la fin (status=finished).
  snapshot jsonb not null default '[]'::jsonb,
  expires_at timestamptz not null,
  accepted_at timestamptz,
  ready_challenger_at timestamptz,
  ready_opponent_at timestamptz,
  common_start_at timestamptz,
  started_challenger_at timestamptz,
  started_opponent_at timestamptz,
  finished_challenger_at timestamptz,
  finished_opponent_at timestamptz,
  score_challenger integer not null default 0,
  score_opponent integer not null default 0,
  correct_challenger integer not null default 0,
  correct_opponent integer not null default 0,
  time_challenger_ms integer,
  time_opponent_ms integer,
  winner_id uuid references public.profiles(id) on delete set null,
  terminated_at timestamptz,
  created_at timestamptz not null default now(),
  constraint duels_distinct_players check (challenger_id <> opponent_id),
  constraint duels_expiry_future check (expires_at > created_at)
);

create index if not exists idx_duels_participants_active
  on public.duels(challenger_id, opponent_id, created_at desc)
  where status in ('pending', 'active');

create index if not exists idx_duels_expiration
  on public.duels(expires_at)
  where status in ('pending', 'active');

create table if not exists public.duel_responses (
  id uuid primary key default gen_random_uuid(),
  duel_id uuid not null references public.duels(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null,
  answer jsonb,
  correct boolean not null,
  points integer not null default 0 check (points >= 0),
  offset_ms integer not null check (offset_ms between 0 and 90000),
  is_timeout boolean not null default false,
  answered_at timestamptz not null default now(),
  unique (duel_id, user_id, question_id)
);

create index if not exists idx_duel_responses_timeline
  on public.duel_responses(duel_id, user_id, offset_ms, answered_at);

-- ---------------------------------------------------------------------------
-- 3. RLS : tout passe par des RPC security definer (aucun acces direct)
-- ---------------------------------------------------------------------------

alter table public.duel_exercises enable row level security;
alter table public.duel_questions enable row level security;
alter table public.duels enable row level security;
alter table public.duel_responses enable row level security;

revoke all on table public.duel_exercises from public, anon, authenticated;
revoke all on table public.duel_questions from public, anon, authenticated;
revoke all on table public.duels from public, anon, authenticated;
revoke all on table public.duel_responses from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 4. Catalogue : adversaires de la meme classe + themes et difficultes dispo
-- ---------------------------------------------------------------------------

create or replace function public.get_duel_catalogue_v3(p_subject_id text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_opponents jsonb := '[]'::jsonb;
  v_topics jsonb := '[]'::jsonb;
  v_difficulties jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select p.* into v_profile from public.profiles p where p.id = auth.uid();
  if not found then raise exception 'profil_introuvable'; end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('id', p.id, 'name', p.name, 'photo_url', p.photo_url)
      order by p.name
    ),
    '[]'::jsonb
  ) into v_opponents
  from public.profiles p
  where p.id <> auth.uid()
    and p.level_id = v_profile.level_id
    and p.account_type = 'student';

  select coalesce(jsonb_agg(distinct e.topic order by e.topic), '[]'::jsonb)
  into v_topics
  from public.duel_exercises e
  where e.subject_id = p_subject_id
    and e.level_id = v_profile.level_id
    and e.published = true;

  select coalesce(jsonb_agg(distinct e.difficulty), '[]'::jsonb)
  into v_difficulties
  from public.duel_exercises e
  where e.subject_id = p_subject_id
    and e.level_id = v_profile.level_id
    and e.published = true;

  return jsonb_build_object(
    'subject_id', p_subject_id,
    'level_id', v_profile.level_id,
    'opponents', v_opponents,
    'topics', v_topics,
    'difficulties', v_difficulties,
    'rules', jsonb_build_object(
      'max_topics', 3,
      'max_questions', 20,
      'duration_sec', 90,
      'expiration_hours', 48
    )
  );
end;
$$;

revoke all on function public.get_duel_catalogue_v3(text) from public, anon, authenticated;
grant execute on function public.get_duel_catalogue_v3(text) to authenticated;

notify pgrst, 'reload schema';

commit;
