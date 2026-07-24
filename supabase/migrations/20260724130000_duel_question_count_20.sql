-- EXCELLENCE LYCEE - Arene de duels : nombre de questions au choix (max 20)
--
-- 1. La borne haute de question_count passe de 10 a 20.
-- 2. create_defi_v2 accepte desormais un p_question_count optionnel : le tirage
--    est limite a ce nombre (borne a [1, 20]). Sans valeur, on garde le maximum.
-- 3. get_duel_catalogue_v2 annonce max_questions = 20.
--
-- L'ancienne signature create_defi_v2(uuid, uuid, uuid[]) est remplacee par la
-- version a 4 arguments pour eviter toute ambiguite cote PostgREST.

begin;

-- ---------------------------------------------------------------------------
-- 1. Contrainte : jusqu'a 20 questions
-- ---------------------------------------------------------------------------

alter table public.defis drop constraint if exists defis_v2_configuration_check;
alter table public.defis
  add constraint defis_v2_configuration_check check (
    arena_version <> 2 or (
      matiere_id is not null
      and cardinality(chapitre_ids_demandes) between 0 and 3
      and cardinality(chapitre_ids_effectifs) between 1 and 3
      and question_count between 1 and 20
      and duel_duree_sec = 90
      and expires_at is not null
      and expires_at > created_at
    )
  );

-- ---------------------------------------------------------------------------
-- 2. create_defi_v2 avec nombre de questions choisi
-- ---------------------------------------------------------------------------

-- On retire l'ancienne signature (3 arguments) avant d'installer la nouvelle.
revoke execute on function public.create_defi_v2(uuid, uuid, uuid[]) from public, anon, authenticated;
drop function if exists public.create_defi_v2(uuid, uuid, uuid[]);

create or replace function public.create_defi_v2(
  p_adversaire_id uuid,
  p_matiere_id uuid,
  p_chapitre_ids uuid[] default '{}'::uuid[],
  p_question_count integer default null
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
  v_limite integer := least(20, greatest(1, coalesce(p_question_count, 20)));
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

  -- Snapshot unique, identique pour les deux joueurs. La limite est desormais le
  -- nombre de questions demande (borne a 20), au lieu d'un plafond fixe de 10.
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
    limit v_limite
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

revoke all on function public.create_defi_v2(uuid, uuid, uuid[], integer) from public, anon, authenticated;
grant execute on function public.create_defi_v2(uuid, uuid, uuid[], integer) to authenticated;

-- ---------------------------------------------------------------------------
-- 3. Le catalogue annonce le nouveau plafond
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
      'max_questions', 20,
      'duree_sec', 90,
      'expiration_heures', 48
    )
  );
end;
$$;

revoke all on function public.get_duel_catalogue_v2(uuid) from public, anon, authenticated;
grant execute on function public.get_duel_catalogue_v2(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
