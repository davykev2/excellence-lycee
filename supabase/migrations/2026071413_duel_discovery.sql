begin;

-- Découverte de l'arène : le catalogue montre toutes les leçons publiées de
-- la matière, y compris celles qui ne possèdent pas encore de QCM compatible.
-- La liste complète des élèves n'est plus renvoyée : quelques suggestions
-- bornées suffisent tant que l'utilisateur n'effectue pas de recherche.
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
  v_suggestions jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select p.* into v_profile
  from public.profiles p
  where p.id = auth.uid();

  if not found or not coalesce(v_profile.approuve, false) then
    raise exception 'compte_non_approuve';
  end if;
  if v_profile.niveau_id is null or v_profile.serie_id is null then
    raise exception 'profil_incomplet';
  end if;

  select jsonb_build_object(
    'id', m.id,
    'nom', m.nom,
    'slug', m.slug,
    'icone', m.icone
  )
  into v_matiere
  from public.matieres m
  join public.matieres_series ms
    on ms.matiere_id = m.id
   and ms.serie_id = v_profile.serie_id
  where m.id = p_matiere_id;

  if v_matiere is null then raise exception 'matiere_non_autorisee'; end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', catalogue.id,
        'titre', catalogue.titre,
        'ordre', catalogue.ordre,
        'question_count', catalogue.question_count,
        'available', catalogue.question_count > 0,
        'unavailable_reason_code', case
          when catalogue.question_count = 0 then 'aucun_qcm_duel_publie'
          else null
        end,
        'unavailable_reason', case
          when catalogue.question_count = 0
            then 'Aucun QCM compatible publié pour cette leçon'
          else null
        end
      ) order by catalogue.ordre, catalogue.titre
    ),
    '[]'::jsonb
  )
  into v_chapitres
  from (
    select
      c.id,
      c.titre,
      c.ordre,
      count(distinct qu.id) filter (
        where qz.type = 'chapitre'
          and qz.published = true
          and qu.type = 'qcm'
          and jsonb_typeof(qu.choix) = 'array'
          and jsonb_array_length(qu.choix) >= 2
          and jsonb_typeof(qu.bonnes_reponses) = 'string'
          and length(btrim(qu.bonnes_reponses #>> '{}')) > 0
          and qu.choix @> jsonb_build_array(qu.bonnes_reponses)
      )::integer as question_count
    from public.chapitres c
    left join public.quiz qz on qz.chapitre_id = c.id
    left join public.questions qu on qu.quiz_id = qz.id
    where c.matiere_id = p_matiere_id
      and c.serie_id = v_profile.serie_id
      and c.published = true
    group by c.id, c.titre, c.ordre
  ) catalogue;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', suggestion.id,
        'username', suggestion.username,
        'avatar_url', suggestion.avatar_url
      ) order by suggestion.updated_at desc, suggestion.username
    ),
    '[]'::jsonb
  )
  into v_suggestions
  from (
    select p.id, p.username, p.avatar_url, p.updated_at
    from public.profiles p
    where p.id <> auth.uid()
      and p.approuve = true
      and p.niveau_id = v_profile.niveau_id
      and p.serie_id = v_profile.serie_id
    order by p.updated_at desc, p.username
    limit 6
  ) suggestion;

  return jsonb_build_object(
    'matiere', v_matiere,
    'chapitres', v_chapitres,
    'suggestions', v_suggestions,
    'regles', jsonb_build_object(
      'max_chapitres', 3,
      'max_questions', 10,
      'duree_sec', 90,
      'expiration_heures', 48,
      'max_suggestions', 6
    )
  );
end;
$$;

-- Recherche bornée, sans accent et insensible à la casse. Tous les contrôles
-- d'éligibilité sont refaits dans la fonction afin qu'un client ne puisse ni
-- énumérer une autre classe ni défier un compte non approuvé.
create or replace function public.search_duel_opponents_v2(
  p_query text,
  p_limit integer default 12
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_query text;
  v_limit integer := least(greatest(coalesce(p_limit, 8), 1), 12);
  v_resultats jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select p.* into v_profile
  from public.profiles p
  where p.id = auth.uid();

  if not found or not coalesce(v_profile.approuve, false) then
    raise exception 'compte_non_approuve';
  end if;
  if v_profile.niveau_id is null or v_profile.serie_id is null then
    raise exception 'profil_incomplet';
  end if;

  v_query := translate(
    replace(replace(lower(btrim(coalesce(p_query, ''))), 'œ', 'oe'), 'æ', 'ae'),
    'àáâãäåçèéêëìíîïñòóôõöøùúûüýÿšž',
    'aaaaaaceeeeiiiinoooooouuuuyysz'
  );
  if length(v_query) < 2 then raise exception 'recherche_trop_courte'; end if;
  if length(v_query) > 50 then raise exception 'recherche_trop_longue'; end if;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', candidat.id,
        'username', candidat.username,
        'avatar_url', candidat.avatar_url
      ) order by candidat.prefix_rank, candidat.username
    ),
    '[]'::jsonb
  )
  into v_resultats
  from (
    select
      p.id,
      p.username,
      p.avatar_url,
      case when left(
        translate(
          replace(replace(lower(p.username), 'œ', 'oe'), 'æ', 'ae'),
          'àáâãäåçèéêëìíîïñòóôõöøùúûüýÿšž',
          'aaaaaaceeeeiiiinoooooouuuuyysz'
        ),
        length(v_query)
      ) = v_query then 0 else 1 end as prefix_rank
    from public.profiles p
    where p.id <> auth.uid()
      and p.approuve = true
      and p.niveau_id = v_profile.niveau_id
      and p.serie_id = v_profile.serie_id
      and position(v_query in translate(
        replace(replace(lower(p.username), 'œ', 'oe'), 'æ', 'ae'),
        'àáâãäåçèéêëìíîïñòóôõöøùúûüýÿšž',
        'aaaaaaceeeeiiiinoooooouuuuyysz'
      )) > 0
    order by prefix_rank, p.username
    limit v_limit
  ) candidat;

  return jsonb_build_object(
    'query', btrim(p_query),
    'resultats', v_resultats,
    'limit', v_limit
  );
end;
$$;

revoke all on function public.get_duel_catalogue_v2(uuid)
  from public, anon, authenticated;
revoke all on function public.search_duel_opponents_v2(text, integer)
  from public, anon, authenticated;

grant execute on function public.get_duel_catalogue_v2(uuid) to authenticated;
grant execute on function public.search_duel_opponents_v2(text, integer) to authenticated;

notify pgrst, 'reload schema';

commit;
