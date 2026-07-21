-- EXCELLENCE LYCEE - Arene de duels v2
--
-- Cette migration ajoute un moteur de duel hybride sans casser les anciens
-- defis. Deux eleves connectes peuvent partir ensemble apres un compte a
-- rebours de trois secondes. Si l'un est absent, l'autre joue sa manche et les
-- evenements horodates sont ensuite rejoues sous forme de progression fantome.
-- Les corrections restent exclusivement dans le snapshot serveur jusqu'a la
-- fin definitive des deux manches.

begin;

-- ---------------------------------------------------------------------------
-- 1. Extension compatible de la table historique des defis
-- ---------------------------------------------------------------------------

alter table public.defis
  add column if not exists arena_version smallint not null default 1,
  add column if not exists matiere_id uuid references public.matieres(id) on delete restrict,
  add column if not exists chapitre_ids_demandes uuid[] not null default '{}'::uuid[],
  add column if not exists chapitre_ids_effectifs uuid[] not null default '{}'::uuid[],
  add column if not exists question_count integer,
  add column if not exists duel_duree_sec integer,
  add column if not exists expires_at timestamptz,
  add column if not exists accepted_at timestamptz,
  add column if not exists ready_challenger_at timestamptz,
  add column if not exists ready_adversaire_at timestamptz,
  add column if not exists common_start_at timestamptz,
  add column if not exists finished_challenger_at timestamptz,
  add column if not exists finished_adversaire_at timestamptz,
  add column if not exists bonnes_challenger integer,
  add column if not exists bonnes_adversaire integer,
  add column if not exists mauvaises_challenger integer,
  add column if not exists mauvaises_adversaire integer,
  add column if not exists temps_challenger_ms integer,
  add column if not exists temps_adversaire_ms integer;

-- L'ancien CHECK ne connaissait pas l'etat expire. Les lignes historiques
-- conservent toutes leurs valeurs et leur arena_version = 1.
alter table public.defis drop constraint if exists defis_statut_check;
alter table public.defis
  add constraint defis_statut_check
  check (statut in ('en_attente', 'en_cours', 'termine', 'refuse', 'expire'));

alter table public.defis drop constraint if exists defis_arena_version_check;
alter table public.defis
  add constraint defis_arena_version_check check (arena_version in (1, 2));

alter table public.defis drop constraint if exists defis_v2_configuration_check;
alter table public.defis
  add constraint defis_v2_configuration_check check (
    arena_version <> 2 or (
      matiere_id is not null
      and cardinality(chapitre_ids_demandes) between 0 and 3
      and cardinality(chapitre_ids_effectifs) between 1 and 3
      and question_count between 1 and 10
      and duel_duree_sec = 90
      and expires_at is not null
      and expires_at > created_at
    )
  );

alter table public.defis drop constraint if exists defis_v2_compteurs_check;
alter table public.defis
  add constraint defis_v2_compteurs_check check (
    arena_version <> 2 or (
      coalesce(bonnes_challenger, 0) >= 0
      and coalesce(bonnes_adversaire, 0) >= 0
      and coalesce(mauvaises_challenger, 0) >= 0
      and coalesce(mauvaises_adversaire, 0) >= 0
      and coalesce(temps_challenger_ms, 0) between 0 and 90000
      and coalesce(temps_adversaire_ms, 0) between 0 and 90000
    )
  );

create index if not exists idx_defis_v2_participants_actifs
  on public.defis(challenger_id, adversaire_id, created_at desc)
  where arena_version = 2 and statut in ('en_attente', 'en_cours');

create index if not exists idx_defis_v2_expiration
  on public.defis(expires_at)
  where arena_version = 2 and statut in ('en_attente', 'en_cours');

-- Le moteur v1 est retire: ses parties actives sont fermees sans gagnant ni
-- recompense, tandis que tous ses resultats termines restent dans l'historique.
update public.defis
set statut = 'expire', gagnant_id = null, terminated_at = clock_timestamp()
where arena_version = 1 and statut in ('en_attente', 'en_cours');

-- ---------------------------------------------------------------------------
-- 2. Reponses privees et immuables
-- ---------------------------------------------------------------------------

create table if not exists public.defi_reponses (
  id uuid primary key default gen_random_uuid(),
  defi_id uuid not null references public.defis(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null,
  choix jsonb,
  correcte boolean not null,
  points_obtenus integer not null default 0 check (points_obtenus >= 0),
  offset_ms integer not null check (offset_ms between 0 and 90000),
  est_timeout boolean not null default false,
  answered_at timestamptz not null default clock_timestamp(),
  unique (defi_id, user_id, question_id)
);

create index if not exists idx_defi_reponses_timeline
  on public.defi_reponses(defi_id, user_id, offset_ms, answered_at);

alter table public.defi_reponses enable row level security;

-- Aucun SELECT direct: toutes les vues sont filtrees et nettoyees dans les RPC.
revoke all on table public.defi_reponses from public, anon, authenticated;
revoke all on table public.defis from public, anon, authenticated;

create or replace function public.proteger_defi_reponse_immuable_v2()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  raise exception 'reponse_duel_immuable';
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Invitation, lobby et depart hybride
-- ---------------------------------------------------------------------------

create or replace function public.accept_defi_v2(p_defi_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  v_role := public.duel_v2_role_autorise(p_defi_id, auth.uid());
  if v_role <> 'adversaire' then raise exception 'seul_adversaire_peut_accepter'; end if;

  perform public.duel_v2_maintenir(p_defi_id);
  select d.* into v_defi from public.defis d where d.id = p_defi_id for update;

  if v_defi.statut = 'expire' then
    return public.duel_v2_construire_etat(p_defi_id, auth.uid());
  end if;
  if v_defi.statut in ('termine', 'refuse') then raise exception 'defi_non_disponible'; end if;

  if v_defi.accepted_at is null then
    update public.defis
    set accepted_at = clock_timestamp(), statut = 'en_cours'
    where id = p_defi_id;
  end if;

  return public.duel_v2_construire_etat(p_defi_id, auth.uid());
end;
$$;

create or replace function public.set_defi_ready_v2(
  p_defi_id uuid,
  p_play_now boolean default true
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
  v_depart timestamptz;
  v_nb_reponses integer;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  v_role := public.duel_v2_role_autorise(p_defi_id, auth.uid());
  perform public.duel_v2_maintenir(p_defi_id);
  select d.* into v_defi from public.defis d where d.id = p_defi_id for update;

  if v_defi.statut in ('termine', 'expire', 'refuse') then
    return public.duel_v2_construire_etat(p_defi_id, auth.uid());
  end if;
  if v_role = 'adversaire' and v_defi.accepted_at is null then
    raise exception 'defi_non_accepte';
  end if;
  if (v_role = 'challenger' and v_defi.finished_challenger_at is not null)
     or (v_role = 'adversaire' and v_defi.finished_adversaire_at is not null) then
    return public.duel_v2_construire_etat(p_defi_id, auth.uid());
  end if;

  if v_role = 'challenger' then
    update public.defis
    set ready_challenger_at = coalesce(ready_challenger_at, clock_timestamp())
    where id = p_defi_id;
  else
    update public.defis
    set ready_adversaire_at = coalesce(ready_adversaire_at, clock_timestamp())
    where id = p_defi_id;
  end if;

  select d.* into v_defi from public.defis d where d.id = p_defi_id for update;
  select count(*) into v_nb_reponses
  from public.defi_reponses r where r.defi_id = p_defi_id;

  -- Les deux joueurs sont prets avant le debut effectif et aucune reponse n'a
  -- ete donnee: on convertit le lobby en direct avec un depart commun a +3 s.
  if v_defi.ready_challenger_at is not null
     and v_defi.ready_adversaire_at is not null
     and v_defi.common_start_at is null
     and v_nb_reponses = 0
     and (v_defi.started_challenger_at is null
          or v_defi.started_challenger_at > clock_timestamp())
     and (v_defi.started_adversaire_at is null
          or v_defi.started_adversaire_at > clock_timestamp()) then
    v_depart := clock_timestamp() + interval '3 seconds';
    update public.defis
    set common_start_at = v_depart,
        started_challenger_at = v_depart,
        started_adversaire_at = v_depart,
        statut = 'en_cours'
    where id = p_defi_id;

  -- Sinon le joueur qui le demande lance sa manche asynchrone. L'adversaire
  -- absent rejouera ensuite la timeline fantome en fonction des offset_ms.
  elsif coalesce(p_play_now, false) then
    v_depart := clock_timestamp() + interval '3 seconds';
    if v_role = 'challenger' and v_defi.started_challenger_at is null then
      update public.defis set started_challenger_at = v_depart where id = p_defi_id;
    elsif v_role = 'adversaire' and v_defi.started_adversaire_at is null then
      update public.defis
      set started_adversaire_at = v_depart, statut = 'en_cours'
      where id = p_defi_id;
    end if;
  end if;

  return public.duel_v2_construire_etat(p_defi_id, auth.uid());
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Questions, reponses unitaires et fin de manche
-- ---------------------------------------------------------------------------

create or replace function public.get_defi_questions_v2(p_defi_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
  v_start_at timestamptz;
  v_questions jsonb := '[]'::jsonb;
  v_answered_ids jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  v_role := public.duel_v2_role_autorise(p_defi_id, auth.uid());
  perform public.duel_v2_maintenir(p_defi_id);
  select d.* into v_defi from public.defis d where d.id = p_defi_id for update;

  if v_defi.statut in ('expire', 'refuse') then raise exception 'defi_non_disponible'; end if;
  if v_role = 'adversaire' and v_defi.accepted_at is null then
    raise exception 'defi_non_accepte';
  end if;

  v_start_at := case when v_role = 'challenger'
    then v_defi.started_challenger_at else v_defi.started_adversaire_at end;
  if v_start_at is null then raise exception 'defi_non_demarre'; end if;
  if clock_timestamp() < v_start_at then raise exception 'duel_pas_encore_demarre'; end if;

  -- Projection volontairement sans bonnes_reponses ni explication.
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', q.item -> 'id',
        'chapitre_id', q.item -> 'chapitre_id',
        'enonce', q.item -> 'enonce',
        'choix', q.item -> 'choix',
        'points', q.item -> 'points',
        'image_url', q.item -> 'image_url'
      ) order by q.position
    ),
    '[]'::jsonb
  ) into v_questions
  from jsonb_array_elements(v_defi.quiz_genere)
    with ordinality as q(item, position);

  select coalesce(jsonb_agg(to_jsonb(r.question_id) order by r.answered_at), '[]'::jsonb)
  into v_answered_ids
  from public.defi_reponses r
  where r.defi_id = p_defi_id and r.user_id = auth.uid();

  return jsonb_build_object(
    'defi_id', v_defi.id,
    'statut', v_defi.statut,
    'start_at', v_start_at,
    'deadline_at', v_start_at + make_interval(secs => v_defi.duel_duree_sec),
    'duree_sec', v_defi.duel_duree_sec,
    'question_count', v_defi.question_count,
    'questions', v_questions,
    'answered_question_ids', v_answered_ids
  );
end;
$$;

create or replace function public.submit_defi_answer_v2(
  p_defi_id uuid,
  p_question_id uuid,
  p_choix jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
  v_start_at timestamptz;
  v_finished_at timestamptz;
  v_question jsonb;
  v_existing public.defi_reponses%rowtype;
  v_correcte boolean;
  v_points integer;
  v_offset_ms integer;
  v_bonnes integer;
  v_mauvaises integer;
  v_score integer;
  v_nb_reponses integer;
  v_state jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  -- Le verrou de la ligne duel serialise toutes les reponses et les timeouts.
  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  v_role := public.duel_v2_role_autorise(p_defi_id, auth.uid());
  perform public.duel_v2_maintenir(p_defi_id);
  select d.* into v_defi from public.defis d where d.id = p_defi_id for update;

  if v_defi.statut in ('expire', 'refuse') then
    return jsonb_build_object(
      'accepted', false, 'reason', v_defi.statut,
      'question_id', p_question_id,
      'state', public.duel_v2_construire_etat(p_defi_id, auth.uid())
    );
  end if;
  if v_role = 'adversaire' and v_defi.accepted_at is null then
    raise exception 'defi_non_accepte';
  end if;

  v_start_at := case when v_role = 'challenger'
    then v_defi.started_challenger_at else v_defi.started_adversaire_at end;
  v_finished_at := case when v_role = 'challenger'
    then v_defi.finished_challenger_at else v_defi.finished_adversaire_at end;
  if v_start_at is null then raise exception 'defi_non_demarre'; end if;

  if clock_timestamp() < v_start_at then
    return jsonb_build_object(
      'accepted', false, 'reason', 'pas_encore_demarre',
      'question_id', p_question_id,
      'state', public.duel_v2_construire_etat(p_defi_id, auth.uid())
    );
  end if;

  if v_finished_at is not null
     or clock_timestamp() >= v_start_at + make_interval(secs => v_defi.duel_duree_sec) then
    perform public.duel_v2_finaliser_joueur(p_defi_id, auth.uid());
    perform public.duel_v2_finaliser_match(p_defi_id);
    return jsonb_build_object(
      'accepted', false, 'reason', 'temps_ecoule',
      'question_id', p_question_id,
      'state', public.duel_v2_construire_etat(p_defi_id, auth.uid())
    );
  end if;

  select q.item into v_question
  from jsonb_array_elements(v_defi.quiz_genere) as q(item)
  where q.item ->> 'id' = p_question_id::text
  limit 1;
  if v_question is null then raise exception 'question_hors_duel'; end if;

  select r.* into v_existing
  from public.defi_reponses r
  where r.defi_id = p_defi_id
    and r.user_id = auth.uid()
    and r.question_id = p_question_id;
  if found then
    v_state := public.duel_v2_construire_etat(p_defi_id, auth.uid());
    return jsonb_build_object(
      'accepted', false,
      'reason', 'deja_repondue',
      'question_id', p_question_id,
      'correcte', v_existing.correcte,
      'correct', v_existing.correcte,
      'est_correcte', v_existing.correcte,
      'score', (v_state #>> '{me,score}')::integer,
      'correctes', (v_state #>> '{me,correctes}')::integer,
      'incorrectes', (v_state #>> '{me,incorrectes}')::integer,
      'offset_ms', v_existing.offset_ms,
      'finished', (v_state #>> '{me,finished_at}') is not null,
      'state', v_state
    );
  end if;

  if p_choix is null
     or jsonb_typeof(p_choix) <> 'string'
     or length(btrim(p_choix #>> '{}')) = 0
     or not ((v_question -> 'choix') @> jsonb_build_array(p_choix)) then
    raise exception 'choix_invalide';
  end if;

  -- Les QCM actuels stockent une seule bonne reponse sous forme de JSON string.
  v_correcte := p_choix = (v_question -> 'bonnes_reponses');
  v_points := case when v_correcte then coalesce((v_question ->> 'points')::integer, 1) else 0 end;
  v_offset_ms := least(
    v_defi.duel_duree_sec * 1000,
    greatest(0, floor(extract(epoch from (clock_timestamp() - v_start_at)) * 1000)::integer)
  );

  insert into public.defi_reponses (
    defi_id, user_id, question_id, choix, correcte,
    points_obtenus, offset_ms, est_timeout, answered_at
  ) values (
    p_defi_id, auth.uid(), p_question_id, p_choix, v_correcte,
    v_points, v_offset_ms, false, clock_timestamp()
  );

  select
    count(*) filter (where r.correcte),
    count(*) filter (where not r.correcte),
    coalesce(sum(r.points_obtenus), 0),
    count(*)
  into v_bonnes, v_mauvaises, v_score, v_nb_reponses
  from public.defi_reponses r
  where r.defi_id = p_defi_id and r.user_id = auth.uid();

  if v_role = 'challenger' then
    update public.defis
    set bonnes_challenger = v_bonnes,
        mauvaises_challenger = v_mauvaises,
        score_challenger = v_score
    where id = p_defi_id;
  else
    update public.defis
    set bonnes_adversaire = v_bonnes,
        mauvaises_adversaire = v_mauvaises,
        score_adversaire = v_score
    where id = p_defi_id;
  end if;

  if v_nb_reponses >= v_defi.question_count then
    perform public.duel_v2_finaliser_joueur(p_defi_id, auth.uid());
  end if;
  perform public.duel_v2_finaliser_match(p_defi_id);

  v_state := public.duel_v2_construire_etat(p_defi_id, auth.uid());
  return jsonb_build_object(
    'accepted', true,
    'question_id', p_question_id,
    'correcte', v_correcte,
    'correct', v_correcte,
    'est_correcte', v_correcte,
    'score', (v_state #>> '{me,score}')::integer,
    'correctes', (v_state #>> '{me,correctes}')::integer,
    'incorrectes', (v_state #>> '{me,incorrectes}')::integer,
    'offset_ms', v_offset_ms,
    'finished', (v_state #>> '{me,finished_at}') is not null,
    'state', v_state
  );
end;
$$;

create or replace function public.finish_defi_v2(p_defi_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
  v_start_at timestamptz;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  v_role := public.duel_v2_role_autorise(p_defi_id, auth.uid());
  perform public.duel_v2_maintenir(p_defi_id);
  select d.* into v_defi from public.defis d where d.id = p_defi_id for update;

  if v_defi.statut in ('expire', 'refuse', 'termine') then
    return public.duel_v2_construire_etat(p_defi_id, auth.uid());
  end if;
  if v_role = 'adversaire' and v_defi.accepted_at is null then
    raise exception 'defi_non_accepte';
  end if;

  v_start_at := case when v_role = 'challenger'
    then v_defi.started_challenger_at else v_defi.started_adversaire_at end;
  if v_start_at is null then raise exception 'defi_non_demarre'; end if;

  -- Avant 90 s, cette fonction ne force pas les questions restantes en erreur;
  -- elle ne termine tot que lorsque toutes les questions ont deja une reponse.
  perform public.duel_v2_finaliser_joueur(p_defi_id, auth.uid());
  perform public.duel_v2_finaliser_match(p_defi_id);
  return public.duel_v2_construire_etat(p_defi_id, auth.uid());
end;
$$;


-- Construit l'etat nettoye d'un duel. Le seul flux fantome expose des offsets
-- et des booleens correcte/incorrecte, jamais le choix adverse. Les bonnes
-- reponses et explications ne sont ajoutees qu'apres le statut termine.
create or replace function public.duel_v2_construire_etat(
  p_defi_id uuid,
  p_user_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
  v_me_id uuid;
  v_opponent_id uuid;
  v_me record;
  v_opponent record;
  v_challenger record;
  v_adversaire record;
  v_matiere jsonb;
  v_chapitres jsonb := '[]'::jsonb;
  v_timeline jsonb := '[]'::jsonb;
  v_challenger_json jsonb;
  v_adversaire_json jsonb;
  v_me_json jsonb;
  v_opponent_json jsonb;
  v_resultat jsonb := null;
  v_corrections jsonb := '[]'::jsonb;
  v_state jsonb;
  v_start_at timestamptz;
  v_visible_bonnes integer := 0;
  v_visible_mauvaises integer := 0;
  v_opponent_finished_visible boolean := false;
begin
  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2;
  if not found then raise exception 'defi_introuvable'; end if;

  v_role := case
    when p_user_id = v_defi.challenger_id then 'challenger'
    when p_user_id = v_defi.adversaire_id then 'adversaire'
    else null
  end;
  if v_role is null then raise exception 'defi_interdit'; end if;

  v_me_id := case when v_role = 'challenger'
    then v_defi.challenger_id else v_defi.adversaire_id end;
  v_opponent_id := case when v_role = 'challenger'
    then v_defi.adversaire_id else v_defi.challenger_id end;
  v_start_at := case when v_role = 'challenger'
    then v_defi.started_challenger_at else v_defi.started_adversaire_at end;

  select p.id, p.username, p.avatar_url into v_me
  from public.profiles p where p.id = v_me_id;
  select p.id, p.username, p.avatar_url into v_opponent
  from public.profiles p where p.id = v_opponent_id;
  select p.id, p.username, p.avatar_url into v_challenger
  from public.profiles p where p.id = v_defi.challenger_id;
  select p.id, p.username, p.avatar_url into v_adversaire
  from public.profiles p where p.id = v_defi.adversaire_id;

  select jsonb_build_object('id', m.id, 'nom', m.nom, 'slug', m.slug, 'icone', m.icone)
  into v_matiere
  from public.matieres m where m.id = v_defi.matiere_id;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('id', c.id, 'titre', c.titre, 'ordre', c.ordre)
      order by x.position
    ),
    '[]'::jsonb
  )
  into v_chapitres
  from unnest(v_defi.chapitre_ids_effectifs) with ordinality as x(chapitre_id, position)
  join public.chapitres c on c.id = x.chapitre_id;

  -- Timeline fantome relative au depart de la manche adverse.
  select coalesce(
    jsonb_agg(
      jsonb_build_object('offset_ms', r.offset_ms, 'correcte', r.correcte)
      order by r.offset_ms, r.answered_at
    ),
    '[]'::jsonb
  )
  into v_timeline
  from public.defi_reponses r
  where r.defi_id = p_defi_id
    and r.user_id = v_opponent_id
    and (
      v_defi.statut = 'termine'
      or (
        v_start_at is not null
        and clock_timestamp() >= v_start_at
        and r.offset_ms <= least(
          v_defi.duel_duree_sec * 1000,
          greatest(0, floor(extract(epoch from (clock_timestamp() - v_start_at)) * 1000)::integer)
        )
      )
    );

  select
    count(*) filter (where (event.item ->> 'correcte')::boolean),
    count(*) filter (where not (event.item ->> 'correcte')::boolean)
  into v_visible_bonnes, v_visible_mauvaises
  from jsonb_array_elements(v_timeline) as event(item);

  v_opponent_finished_visible := v_defi.statut = 'termine'
    or (
      v_start_at is not null
      and clock_timestamp() >= v_start_at + make_interval(secs => v_defi.duel_duree_sec)
    );

  v_challenger_json := jsonb_build_object(
    'id', v_challenger.id,
    'username', v_challenger.username,
    'avatar_url', v_challenger.avatar_url,
    'score', coalesce(v_defi.score_challenger, 0),
    'correctes', coalesce(v_defi.bonnes_challenger, 0),
    'incorrectes', coalesce(v_defi.mauvaises_challenger, 0),
    'bonnes_reponses', coalesce(v_defi.bonnes_challenger, 0),
    'mauvaises_reponses', coalesce(v_defi.mauvaises_challenger, 0),
    'ready_at', v_defi.ready_challenger_at,
    'start_at', v_defi.started_challenger_at,
    'finished_at', v_defi.finished_challenger_at
  );
  v_adversaire_json := jsonb_build_object(
    'id', v_adversaire.id,
    'username', v_adversaire.username,
    'avatar_url', v_adversaire.avatar_url,
    'score', coalesce(v_defi.score_adversaire, 0),
    'correctes', coalesce(v_defi.bonnes_adversaire, 0),
    'incorrectes', coalesce(v_defi.mauvaises_adversaire, 0),
    'bonnes_reponses', coalesce(v_defi.bonnes_adversaire, 0),
    'mauvaises_reponses', coalesce(v_defi.mauvaises_adversaire, 0),
    'ready_at', v_defi.ready_adversaire_at,
    'start_at', v_defi.started_adversaire_at,
    'finished_at', v_defi.finished_adversaire_at
  );

  v_me_json := case when v_role = 'challenger'
    then v_challenger_json else v_adversaire_json end;
  v_opponent_json := (case when v_role = 'challenger'
    then v_adversaire_json else v_challenger_json end)
    || jsonb_build_object('timeline', v_timeline);

  -- Avant la fin, le HUD adverse ne connait que les evenements dont l'offset
  -- est deja atteint par le chrono du viewer. Le score final et finished_at ne
  -- peuvent donc pas fuiter depuis une manche fantome jouee plus tot.
  if v_defi.statut <> 'termine' then
    v_opponent_json := v_opponent_json || jsonb_build_object(
      'score', 0,
      'correctes', v_visible_bonnes,
      'incorrectes', v_visible_mauvaises,
      'bonnes_reponses', v_visible_bonnes,
      'mauvaises_reponses', v_visible_mauvaises,
      'finished_at', case when v_opponent_finished_visible
        then v_opponent_json -> 'finished_at' else 'null'::jsonb end
    );

    if v_role = 'challenger' then
      v_adversaire_json := v_opponent_json - 'timeline';
    else
      v_challenger_json := v_opponent_json - 'timeline';
    end if;
  end if;

  if v_defi.statut = 'termine' then
    v_resultat := jsonb_build_object(
      'issue', case
        when v_defi.gagnant_id is null then 'egalite'
        when v_defi.gagnant_id = p_user_id then 'victoire'
        else 'defaite'
      end,
      'gagnant_id', v_defi.gagnant_id,
      'score', case when v_role = 'challenger'
        then v_defi.score_challenger else v_defi.score_adversaire end,
      'score_adversaire', case when v_role = 'challenger'
        then v_defi.score_adversaire else v_defi.score_challenger end
    );

    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'question_id', q.item -> 'id',
          'bonnes_reponses', q.item -> 'bonnes_reponses',
          'explication', q.item -> 'explication'
        ) order by q.position
      ),
      '[]'::jsonb
    )
    into v_corrections
    from jsonb_array_elements(v_defi.quiz_genere)
      with ordinality as q(item, position);
  end if;

  v_state := jsonb_build_object(
    'id', v_defi.id,
    'statut', v_defi.statut,
    'role', v_role,
    'matiere', v_matiere,
    'chapitres', v_chapitres,
    'question_count', v_defi.question_count,
    'duree_sec', v_defi.duel_duree_sec,
    'expires_at', v_defi.expires_at,
    'accepted_at', v_defi.accepted_at,
    'common_start_at', v_defi.common_start_at,
    'start_at', v_start_at,
    'deadline_at', case when v_start_at is null then null
      else v_start_at + make_interval(secs => v_defi.duel_duree_sec) end,
    'moi_pret', case when v_role = 'challenger'
      then v_defi.ready_challenger_at is not null else v_defi.ready_adversaire_at is not null end,
    'adversaire_pret', case when v_role = 'challenger'
      then v_defi.ready_adversaire_at is not null else v_defi.ready_challenger_at is not null end,
    'peut_jouer', v_start_at is not null
      and clock_timestamp() >= v_start_at
      and v_defi.statut not in ('termine', 'expire', 'refuse')
      and (case when v_role = 'challenger'
        then v_defi.finished_challenger_at is null else v_defi.finished_adversaire_at is null end),
    'me', v_me_json,
    'opponent', v_opponent_json,
    'challenger', v_challenger_json,
    'adversaire', v_adversaire_json,
    'gagnant_id', v_defi.gagnant_id,
    'terminated_at', v_defi.terminated_at,
    'resultat', v_resultat
  );

  -- La cle elle-meme est absente avant la fin: aucun client ne peut confondre
  -- une liste vide avec une correction dont le chargement aurait echoue.
  if v_defi.statut = 'termine' then
    v_state := v_state || jsonb_build_object('corrections', v_corrections);
  end if;

  return v_state;
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Catalogue et creation
-- ---------------------------------------------------------------------------

create or replace function public.get_duel_catalogue_v2(p_matiere_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_matiere jsonb;
  v_chapitres jsonb := '[]'::jsonb;
  v_adversaires jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select p.* into v_profile from public.profiles p where p.id = auth.uid();
  if not found or not coalesce(v_profile.approuve, false) then
    raise exception 'compte_non_approuve';
  end if;
  if v_profile.niveau_id is null or v_profile.serie_id is null then
    raise exception 'profil_incomplet';
  end if;

  select jsonb_build_object('id', m.id, 'nom', m.nom, 'slug', m.slug, 'icone', m.icone)
  into v_matiere
  from public.matieres m
  join public.matieres_series ms
    on ms.matiere_id = m.id and ms.serie_id = v_profile.serie_id
  where m.id = p_matiere_id;
  if v_matiere is null then raise exception 'matiere_non_autorisee'; end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', catalogue.id,
        'titre', catalogue.titre,
        'ordre', catalogue.ordre,
        'question_count', catalogue.question_count
      ) order by catalogue.ordre, catalogue.titre
    ),
    '[]'::jsonb
  ) into v_chapitres
  from (
    select c.id, c.titre, c.ordre, count(distinct qu.id)::integer as question_count
    from public.chapitres c
    join public.quiz qz on qz.chapitre_id = c.id
    join public.questions qu on qu.quiz_id = qz.id
    where c.matiere_id = p_matiere_id
      and c.serie_id = v_profile.serie_id
      and c.published = true
      and qz.type = 'chapitre'
      and qz.published = true
      and qu.type = 'qcm'
      and jsonb_typeof(qu.choix) = 'array'
      and jsonb_array_length(qu.choix) >= 2
      and jsonb_typeof(qu.bonnes_reponses) = 'string'
      and length(btrim(qu.bonnes_reponses #>> '{}')) > 0
      and qu.choix @> jsonb_build_array(qu.bonnes_reponses)
    group by c.id, c.titre, c.ordre
  ) catalogue;

  select coalesce(
    jsonb_agg(
      jsonb_build_object('id', p.id, 'username', p.username, 'avatar_url', p.avatar_url)
      order by p.username
    ),
    '[]'::jsonb
  ) into v_adversaires
  from public.profiles p
  where p.id <> auth.uid()
    and p.approuve = true
    and p.niveau_id = v_profile.niveau_id
    and p.serie_id = v_profile.serie_id;

  return jsonb_build_object(
    'matiere', v_matiere,
    'chapitres', v_chapitres,
    'adversaires', v_adversaires,
    'regles', jsonb_build_object(
      'max_chapitres', 3,
      'max_questions', 10,
      'duree_sec', 90,
      'expiration_heures', 48
    )
  );
end;
$$;

create or replace function public.create_defi_v2(
  p_adversaire_id uuid,
  p_matiere_id uuid,
  p_chapitre_ids uuid[] default '{}'::uuid[]
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_adversaire public.profiles%rowtype;
  v_chapitre_ids uuid[] := coalesce(p_chapitre_ids, '{}'::uuid[]);
  v_chapitre_ids_effectifs uuid[];
  v_total_ids integer;
  v_distinct_ids integer;
  v_valides integer;
  v_questions jsonb := '[]'::jsonb;
  v_question_count integer;
  v_defi_id uuid;
  v_expires_at timestamptz := clock_timestamp() + interval '48 hours';
  v_defis_actifs boolean := true;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  if p_adversaire_id is null or p_adversaire_id = auth.uid() then
    raise exception 'auto_defi_interdit';
  end if;

  select p.* into v_profile from public.profiles p where p.id = auth.uid();
  select p.* into v_adversaire from public.profiles p where p.id = p_adversaire_id;
  if not found then raise exception 'adversaire_introuvable'; end if;

  if not coalesce(v_profile.approuve, false)
     or not coalesce(v_adversaire.approuve, false) then
    raise exception 'compte_non_approuve';
  end if;
  if v_profile.niveau_id is null or v_profile.serie_id is null
     or v_adversaire.niveau_id is distinct from v_profile.niveau_id
     or v_adversaire.serie_id is distinct from v_profile.serie_id then
    raise exception 'adversaire_non_autorise';
  end if;

  select coalesce((s.valeur #>> '{}')::boolean, true)
  into v_defis_actifs
  from public.app_settings s where s.cle = 'fonctionnalite_defis_active';
  if not coalesce(v_defis_actifs, true) then raise exception 'defis_desactives'; end if;

  if not exists (
    select 1 from public.matieres_series ms
    where ms.matiere_id = p_matiere_id and ms.serie_id = v_profile.serie_id
  ) then
    raise exception 'matiere_non_autorisee';
  end if;

  if cardinality(v_chapitre_ids) > 3 or array_position(v_chapitre_ids, null) is not null then
    raise exception 'chapitres_invalides';
  end if;
  select count(*), count(distinct x.chapitre_id)
  into v_total_ids, v_distinct_ids
  from unnest(v_chapitre_ids) as x(chapitre_id);
  if v_total_ids <> v_distinct_ids then raise exception 'chapitres_dupliques'; end if;

  if cardinality(v_chapitre_ids) > 0 then
    select count(*) into v_valides
    from unnest(v_chapitre_ids) as requested(chapitre_id)
    where exists (
      select 1
      from public.chapitres c
      join public.quiz qz on qz.chapitre_id = c.id
      join public.questions qu on qu.quiz_id = qz.id
      where c.id = requested.chapitre_id
        and c.matiere_id = p_matiere_id
        and c.serie_id = v_profile.serie_id
        and c.published = true
        and qz.type = 'chapitre'
        and qz.published = true
        and qu.type = 'qcm'
        and jsonb_typeof(qu.choix) = 'array'
        and jsonb_array_length(qu.choix) >= 2
        and jsonb_typeof(qu.bonnes_reponses) = 'string'
        and length(btrim(qu.bonnes_reponses #>> '{}')) > 0
        and qu.choix @> jsonb_build_array(qu.bonnes_reponses)
    );
    if v_valides <> cardinality(v_chapitre_ids) then
      raise exception 'chapitre_non_autorise_ou_sans_question';
    end if;
    v_chapitre_ids_effectifs := v_chapitre_ids;
  else
    -- Aucun choix: le serveur tire jusqu'a trois lecons eligibles de la matiere.
    select coalesce(array_agg(random_chapter.id), '{}'::uuid[])
    into v_chapitre_ids_effectifs
    from (
      select c.id
      from public.chapitres c
      where c.matiere_id = p_matiere_id
        and c.serie_id = v_profile.serie_id
        and c.published = true
        and exists (
          select 1
          from public.quiz qz
          join public.questions qu on qu.quiz_id = qz.id
          where qz.chapitre_id = c.id
            and qz.type = 'chapitre'
            and qz.published = true
            and qu.type = 'qcm'
            and jsonb_typeof(qu.choix) = 'array'
            and jsonb_array_length(qu.choix) >= 2
            and jsonb_typeof(qu.bonnes_reponses) = 'string'
            and length(btrim(qu.bonnes_reponses #>> '{}')) > 0
            and qu.choix @> jsonb_build_array(qu.bonnes_reponses)
        )
      order by random()
      limit 3
    ) random_chapter;
  end if;

  if cardinality(v_chapitre_ids_effectifs) = 0 then raise exception 'contenu_insuffisant'; end if;

  -- Snapshot unique, identique pour les deux joueurs. LIMIT 10 est un maximum:
  -- une selection contenant 1 a 9 QCM reste parfaitement jouable.
  with random_questions as (
    select
      qu.id,
      qu.enonce,
      qu.choix,
      qu.bonnes_reponses,
      qu.points,
      qu.image_url,
      qu.explication,
      c.id as chapitre_id,
      c.titre as chapitre_titre
    from public.questions qu
    join public.quiz qz on qz.id = qu.quiz_id
    join public.chapitres c on c.id = qz.chapitre_id
    where c.id = any(v_chapitre_ids_effectifs)
      and c.matiere_id = p_matiere_id
      and c.serie_id = v_profile.serie_id
      and c.published = true
      and qz.type = 'chapitre'
      and qz.published = true
      and qu.type = 'qcm'
      and jsonb_typeof(qu.choix) = 'array'
      and jsonb_array_length(qu.choix) >= 2
      and jsonb_typeof(qu.bonnes_reponses) = 'string'
      and length(btrim(qu.bonnes_reponses #>> '{}')) > 0
      and qu.choix @> jsonb_build_array(qu.bonnes_reponses)
    order by random()
    limit 10
  ), numbered as (
    select row_number() over () as position, rq.* from random_questions rq
  )
  select
    count(*)::integer,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', n.id,
          'chapitre_id', n.chapitre_id,
          'chapitre_titre', n.chapitre_titre,
          'enonce', n.enonce,
          'choix', n.choix,
          'bonnes_reponses', n.bonnes_reponses,
          'points', n.points,
          'image_url', n.image_url,
          'explication', n.explication
        ) order by n.position
      ),
      '[]'::jsonb
    )
  into v_question_count, v_questions
  from numbered n;

  if v_question_count = 0 then raise exception 'contenu_insuffisant'; end if;

  insert into public.defis (
    challenger_id, adversaire_id, quiz_genere, statut,
    arena_version, matiere_id, chapitre_ids_demandes,
    chapitre_ids_effectifs, question_count, duel_duree_sec,
    expires_at, bonnes_challenger, bonnes_adversaire,
    mauvaises_challenger, mauvaises_adversaire
  ) values (
    auth.uid(), p_adversaire_id, v_questions, 'en_attente',
    2, p_matiere_id, v_chapitre_ids, v_chapitre_ids_effectifs,
    v_question_count, 90, v_expires_at, 0, 0, 0, 0
  ) returning id into v_defi_id;

  return jsonb_build_object(
    'defi_id', v_defi_id,
    'statut', 'en_attente',
    'expires_at', v_expires_at,
    'question_count', v_question_count,
    'chapitre_ids_demandes', to_jsonb(v_chapitre_ids),
    'chapitre_ids_effectifs', to_jsonb(v_chapitre_ids_effectifs),
    'state', public.duel_v2_construire_etat(v_defi_id, auth.uid())
  );
end;
$$;


drop trigger if exists trg_defi_reponse_immuable_v2 on public.defi_reponses;
create trigger trg_defi_reponse_immuable_v2
before update or delete on public.defi_reponses
for each row execute function public.proteger_defi_reponse_immuable_v2();

-- ---------------------------------------------------------------------------
-- 3. Helpers internes. Ils ne sont jamais exposes aux roles API.
-- ---------------------------------------------------------------------------

-- Verifie a chaque action que les deux comptes sont encore approuves et dans
-- la meme classe (niveau + serie), puis retourne le role du demandeur.
create or replace function public.duel_v2_role_autorise(
  p_defi_id uuid,
  p_user_id uuid
)
returns text
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi record;
begin
  select
    d.challenger_id,
    d.adversaire_id,
    pc.approuve as challenger_approuve,
    pa.approuve as adversaire_approuve,
    pc.niveau_id as challenger_niveau_id,
    pa.niveau_id as adversaire_niveau_id,
    pc.serie_id as challenger_serie_id,
    pa.serie_id as adversaire_serie_id
  into v_defi
  from public.defis d
  join public.profiles pc on pc.id = d.challenger_id
  join public.profiles pa on pa.id = d.adversaire_id
  where d.id = p_defi_id
    and d.arena_version = 2
    and p_user_id in (d.challenger_id, d.adversaire_id);

  if not found then
    raise exception 'defi_introuvable';
  end if;

  if not coalesce(v_defi.challenger_approuve, false)
     or not coalesce(v_defi.adversaire_approuve, false)
     or v_defi.challenger_niveau_id is distinct from v_defi.adversaire_niveau_id
     or v_defi.challenger_serie_id is distinct from v_defi.adversaire_serie_id then
    raise exception 'participants_non_autorises';
  end if;

  return case
    when p_user_id = v_defi.challenger_id then 'challenger'
    else 'adversaire'
  end;
end;
$$;

-- Termine une manche lorsque toutes les questions ont ete traitees ou lorsque
-- les 90 secondes serveur sont ecoulees. Les questions sans reponse deviennent
-- explicitement des erreurs de timeout, ce qui rend les compteurs auditables.
create or replace function public.duel_v2_finaliser_joueur(
  p_defi_id uuid,
  p_user_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_role text;
  v_started_at timestamptz;
  v_finished_at timestamptz;
  v_nb_reponses integer;
  v_temps_ms integer;
  v_bonnes integer;
  v_mauvaises integer;
  v_score integer;
begin
  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;

  if not found then
    raise exception 'defi_introuvable';
  end if;

  v_role := case
    when p_user_id = v_defi.challenger_id then 'challenger'
    when p_user_id = v_defi.adversaire_id then 'adversaire'
    else null
  end;
  if v_role is null then raise exception 'defi_interdit'; end if;

  v_started_at := case when v_role = 'challenger'
    then v_defi.started_challenger_at else v_defi.started_adversaire_at end;
  v_finished_at := case when v_role = 'challenger'
    then v_defi.finished_challenger_at else v_defi.finished_adversaire_at end;

  if v_finished_at is not null then return true; end if;
  if v_started_at is null or clock_timestamp() < v_started_at then return false; end if;

  select count(*) into v_nb_reponses
  from public.defi_reponses r
  where r.defi_id = p_defi_id and r.user_id = p_user_id;

  if v_nb_reponses < v_defi.question_count
     and clock_timestamp() < v_started_at + make_interval(secs => v_defi.duel_duree_sec) then
    return false;
  end if;

  -- A l'expiration du chrono, chaque absence devient une mauvaise reponse a
  -- offset 90000. ON CONFLICT garantit l'idempotence sous appels concurrents.
  if v_nb_reponses < v_defi.question_count then
    insert into public.defi_reponses (
      defi_id, user_id, question_id, choix, correcte,
      points_obtenus, offset_ms, est_timeout, answered_at
    )
    select
      p_defi_id,
      p_user_id,
      (q.item ->> 'id')::uuid,
      null,
      false,
      0,
      v_defi.duel_duree_sec * 1000,
      true,
      v_started_at + make_interval(secs => v_defi.duel_duree_sec)
    from jsonb_array_elements(v_defi.quiz_genere) as q(item)
    where not exists (
      select 1
      from public.defi_reponses r
      where r.defi_id = p_defi_id
        and r.user_id = p_user_id
        and r.question_id = (q.item ->> 'id')::uuid
    )
    on conflict (defi_id, user_id, question_id) do nothing;
  end if;

  select
    count(*) filter (where r.correcte),
    count(*) filter (where not r.correcte),
    coalesce(sum(r.points_obtenus), 0),
    least(v_defi.duel_duree_sec * 1000, coalesce(max(r.offset_ms), 0))
  into v_bonnes, v_mauvaises, v_score, v_temps_ms
  from public.defi_reponses r
  where r.defi_id = p_defi_id and r.user_id = p_user_id;

  if v_role = 'challenger' then
    update public.defis
    set bonnes_challenger = v_bonnes,
        mauvaises_challenger = v_mauvaises,
        score_challenger = v_score,
        temps_challenger_ms = v_temps_ms,
        temps_challenger = ceil(v_temps_ms / 1000.0)::integer,
        finished_challenger_at = clock_timestamp()
    where id = p_defi_id;
  else
    update public.defis
    set bonnes_adversaire = v_bonnes,
        mauvaises_adversaire = v_mauvaises,
        score_adversaire = v_score,
        temps_adversaire_ms = v_temps_ms,
        temps_adversaire = ceil(v_temps_ms / 1000.0)::integer,
        finished_adversaire_at = clock_timestamp()
    where id = p_defi_id;
  end if;

  return true;
end;
$$;

-- Cloture le duel lorsque les deux manches sont terminees. L'ordre de
-- departage est strictement: score, moins d'erreurs, puis temps. Une egalite
-- parfaite conserve gagnant_id a NULL.
create or replace function public.duel_v2_finaliser_match(p_defi_id uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
  v_gagnant uuid;
begin
  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;

  if not found then raise exception 'defi_introuvable'; end if;
  if v_defi.statut in ('termine', 'expire', 'refuse') then
    return v_defi.statut = 'termine';
  end if;
  if v_defi.finished_challenger_at is null or v_defi.finished_adversaire_at is null then
    return false;
  end if;

  v_gagnant := case
    when v_defi.score_challenger > v_defi.score_adversaire then v_defi.challenger_id
    when v_defi.score_adversaire > v_defi.score_challenger then v_defi.adversaire_id
    when v_defi.mauvaises_challenger < v_defi.mauvaises_adversaire then v_defi.challenger_id
    when v_defi.mauvaises_adversaire < v_defi.mauvaises_challenger then v_defi.adversaire_id
    when v_defi.temps_challenger_ms < v_defi.temps_adversaire_ms then v_defi.challenger_id
    when v_defi.temps_adversaire_ms < v_defi.temps_challenger_ms then v_defi.adversaire_id
    else null
  end;

  update public.defis
  set statut = 'termine',
      gagnant_id = v_gagnant,
      terminated_at = clock_timestamp()
  where id = p_defi_id;

  -- Les badges ne doivent jamais empecher la cloture transactionnelle du duel.
  begin
    perform public.check_and_award_badges(v_defi.challenger_id);
    perform public.check_and_award_badges(v_defi.adversaire_id);
  exception when others then
    null;
  end;

  return true;
end;
$$;

-- Maintenance paresseuse appelee par chaque lecture: expiration des invitations
-- non acceptees, timeouts des manches demarrees et cloture eventuelle du match.
create or replace function public.duel_v2_maintenir(p_defi_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
begin
  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  if v_defi.statut not in ('termine', 'expire', 'refuse') then
    if v_defi.started_challenger_at is not null
       and v_defi.finished_challenger_at is null
       and clock_timestamp() >= v_defi.started_challenger_at
           + make_interval(secs => v_defi.duel_duree_sec) then
      perform public.duel_v2_finaliser_joueur(p_defi_id, v_defi.challenger_id);
    end if;

    if v_defi.started_adversaire_at is not null
       and v_defi.finished_adversaire_at is null
       and clock_timestamp() >= v_defi.started_adversaire_at
           + make_interval(secs => v_defi.duel_duree_sec) then
      perform public.duel_v2_finaliser_joueur(p_defi_id, v_defi.adversaire_id);
    end if;

    perform public.duel_v2_finaliser_match(p_defi_id);

    -- L'invitation et le duel asynchrone disposent tous deux d'une fenetre de
    -- 48 h. Une manche effectivement demarree avant l'echeance conserve au
    -- maximum ses 90 secondes; sinon le duel incomplet expire sans resultat.
    select d.* into v_defi from public.defis d where d.id = p_defi_id for update;
    if v_defi.statut not in ('termine', 'expire', 'refuse')
       and clock_timestamp() >= v_defi.expires_at
       and not (
         (v_defi.finished_challenger_at is null
          and v_defi.started_challenger_at is not null
          and clock_timestamp() < v_defi.started_challenger_at
              + make_interval(secs => v_defi.duel_duree_sec))
         or
         (v_defi.finished_adversaire_at is null
          and v_defi.started_adversaire_at is not null
          and clock_timestamp() < v_defi.started_adversaire_at
              + make_interval(secs => v_defi.duel_duree_sec))
       ) then
      update public.defis
      set statut = 'expire', gagnant_id = null, terminated_at = clock_timestamp()
      where id = p_defi_id;
    end if;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Etat synchronise et liste personnelle
-- ---------------------------------------------------------------------------

create or replace function public.get_defi_state_v2(p_defi_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_defi public.defis%rowtype;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi
  from public.defis d
  where d.id = p_defi_id and d.arena_version = 2
  for update;
  if not found then raise exception 'defi_introuvable'; end if;

  perform public.duel_v2_role_autorise(p_defi_id, auth.uid());
  perform public.duel_v2_maintenir(p_defi_id);
  return public.duel_v2_construire_etat(p_defi_id, auth.uid());
end;
$$;

create or replace function public.get_mes_defis_v2()
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_row record;
  v_state jsonb;
  v_summary jsonb;
  v_items jsonb := '[]'::jsonb;
  v_defi public.defis%rowtype;
  v_role text;
  v_challenger_json jsonb;
  v_adversaire_json jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select p.* into v_profile from public.profiles p where p.id = auth.uid();
  if not found or not coalesce(v_profile.approuve, false) then
    raise exception 'compte_non_approuve';
  end if;

  for v_row in
    select d.id, d.arena_version
    from public.defis d
    where auth.uid() in (d.challenger_id, d.adversaire_id)
    order by d.created_at desc
  loop
    if v_row.arena_version = 2 then
      perform public.duel_v2_maintenir(v_row.id);
      v_state := public.duel_v2_construire_etat(v_row.id, auth.uid());

      -- La liste ne transporte ni correction ni timeline; ces donnees sont
      -- disponibles uniquement dans l'etat detaille du duel concerne.
      v_summary := v_state - 'corrections';
      v_summary := jsonb_set(v_summary, '{opponent,timeline}', '[]'::jsonb, false);
    else
      -- Compatibilite historique: les v1 termines/refuses/expires restent
      -- visibles, mais leur ancien snapshot (qui contient des corrections)
      -- n'est jamais projete dans la nouvelle API.
      select d.* into v_defi from public.defis d where d.id = v_row.id;
      v_role := case when auth.uid() = v_defi.challenger_id
        then 'challenger' else 'adversaire' end;

      select jsonb_build_object(
        'id', p.id, 'username', p.username, 'avatar_url', p.avatar_url,
        'score', coalesce(v_defi.score_challenger, 0),
        'correctes', coalesce(v_defi.score_challenger, 0),
        'incorrectes', 0,
        'bonnes_reponses', coalesce(v_defi.score_challenger, 0),
        'mauvaises_reponses', 0,
        'ready_at', null,
        'start_at', v_defi.started_challenger_at,
        'finished_at', case when v_defi.score_challenger is null then null else v_defi.terminated_at end
      ) into v_challenger_json
      from public.profiles p where p.id = v_defi.challenger_id;

      select jsonb_build_object(
        'id', p.id, 'username', p.username, 'avatar_url', p.avatar_url,
        'score', coalesce(v_defi.score_adversaire, 0),
        'correctes', coalesce(v_defi.score_adversaire, 0),
        'incorrectes', 0,
        'bonnes_reponses', coalesce(v_defi.score_adversaire, 0),
        'mauvaises_reponses', 0,
        'ready_at', null,
        'start_at', v_defi.started_adversaire_at,
        'finished_at', case when v_defi.score_adversaire is null then null else v_defi.terminated_at end
      ) into v_adversaire_json
      from public.profiles p where p.id = v_defi.adversaire_id;

      v_summary := jsonb_build_object(
        'id', v_defi.id,
        'arena_version', 1,
        'legacy', true,
        'statut', v_defi.statut,
        'role', v_role,
        'matiere', null,
        'chapitres', '[]'::jsonb,
        'question_count', case when jsonb_typeof(v_defi.quiz_genere) = 'array'
          then jsonb_array_length(v_defi.quiz_genere) else 0 end,
        'duree_sec', null,
        'expires_at', null,
        'accepted_at', null,
        'common_start_at', null,
        'start_at', case when v_role = 'challenger'
          then v_defi.started_challenger_at else v_defi.started_adversaire_at end,
        'deadline_at', null,
        'moi_pret', false,
        'adversaire_pret', false,
        'peut_jouer', false,
        'me', case when v_role = 'challenger'
          then v_challenger_json else v_adversaire_json end,
        'opponent', (case when v_role = 'challenger'
          then v_adversaire_json else v_challenger_json end)
          || jsonb_build_object('timeline', '[]'::jsonb),
        'challenger', v_challenger_json,
        'adversaire', v_adversaire_json,
        'gagnant_id', v_defi.gagnant_id,
        'terminated_at', v_defi.terminated_at,
        'resultat', case when v_defi.statut = 'termine' then jsonb_build_object(
          'issue', case
            when v_defi.gagnant_id is null then 'egalite'
            when v_defi.gagnant_id = auth.uid() then 'victoire'
            else 'defaite'
          end,
          'gagnant_id', v_defi.gagnant_id,
          'score', case when v_role = 'challenger'
            then v_defi.score_challenger else v_defi.score_adversaire end,
          'score_adversaire', case when v_role = 'challenger'
            then v_defi.score_adversaire else v_defi.score_challenger end
        ) else null end
      );
    end if;

    v_items := v_items || jsonb_build_array(v_summary);
  end loop;

  return jsonb_build_object('defis', v_items);
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Surface API minimale
-- ---------------------------------------------------------------------------

-- Desactive les mutateurs v1. Les anciens duels termines restent lisibles via
-- get_mes_defis_v2(), mais aucune RPC historique ne peut lire les compteurs
-- fantomes ni contourner les invariants de l'arene v2.
revoke execute on function public.create_defi(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.get_mes_defis() from public, anon, authenticated;
revoke execute on function public.accept_defi(uuid) from public, anon, authenticated;
revoke execute on function public.get_defi_questions(uuid) from public, anon, authenticated;
revoke execute on function public.submit_defi(uuid, jsonb) from public, anon, authenticated;

-- Helpers internes et trigger: jamais executables directement par l'API.
revoke all on function public.proteger_defi_reponse_immuable_v2() from public, anon, authenticated;
revoke all on function public.duel_v2_role_autorise(uuid, uuid) from public, anon, authenticated;
revoke all on function public.duel_v2_finaliser_joueur(uuid, uuid) from public, anon, authenticated;
revoke all on function public.duel_v2_finaliser_match(uuid) from public, anon, authenticated;
revoke all on function public.duel_v2_maintenir(uuid) from public, anon, authenticated;
revoke all on function public.duel_v2_construire_etat(uuid, uuid) from public, anon, authenticated;

-- RPC publiques v2: aucun acces anonyme, execution reservee aux utilisateurs
-- authentifies; chaque fonction refait ensuite ses controles d'approbation.
revoke all on function public.get_duel_catalogue_v2(uuid) from public, anon, authenticated;
revoke all on function public.create_defi_v2(uuid, uuid, uuid[]) from public, anon, authenticated;
revoke all on function public.get_mes_defis_v2() from public, anon, authenticated;
revoke all on function public.accept_defi_v2(uuid) from public, anon, authenticated;
revoke all on function public.set_defi_ready_v2(uuid, boolean) from public, anon, authenticated;
revoke all on function public.get_defi_questions_v2(uuid) from public, anon, authenticated;
revoke all on function public.submit_defi_answer_v2(uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.finish_defi_v2(uuid) from public, anon, authenticated;
revoke all on function public.get_defi_state_v2(uuid) from public, anon, authenticated;

grant execute on function public.get_duel_catalogue_v2(uuid) to authenticated;
grant execute on function public.create_defi_v2(uuid, uuid, uuid[]) to authenticated;
grant execute on function public.get_mes_defis_v2() to authenticated;
grant execute on function public.accept_defi_v2(uuid) to authenticated;
grant execute on function public.set_defi_ready_v2(uuid, boolean) to authenticated;
grant execute on function public.get_defi_questions_v2(uuid) to authenticated;
grant execute on function public.submit_defi_answer_v2(uuid, uuid, jsonb) to authenticated;
grant execute on function public.finish_defi_v2(uuid) to authenticated;
grant execute on function public.get_defi_state_v2(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
