-- Exercices guides : nombre variable par difficulte.
begin;

alter table public.exercices_entrainement
  drop constraint if exists exercices_entrainement_numero_check;
alter table public.exercices_entrainement
  drop constraint if exists exercices_entrainement_numero_positive;
alter table public.exercices_entrainement
  add constraint exercices_entrainement_numero_positive check (numero > 0);

create or replace function public.verifier_pack_entrainement_publie()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_nb_exercices int;
  v_min_numero int;
  v_max_numero int;
  v_numeros_distincts int;
begin
  if not new.published then
    return new;
  end if;

  select
    count(*)::int,
    min(e.numero),
    max(e.numero),
    count(distinct e.numero)::int
  into v_nb_exercices, v_min_numero, v_max_numero, v_numeros_distincts
  from public.exercices_entrainement e
  where e.pack_id = new.id;

  if v_nb_exercices < 1 then
    raise exception 'exercice_requis';
  end if;

  if v_min_numero <> 1
     or v_max_numero <> v_nb_exercices
     or v_numeros_distincts <> v_nb_exercices then
    raise exception 'numerotation_exercices_invalide';
  end if;

  if exists (
    select 1
    from public.exercices_entrainement e
    left join public.questions_exercice q on q.exercice_id = e.id
    where e.pack_id = new.id
    group by e.id
    having count(q.id) < 2
       or min(q.ordre) <> 1
       or max(q.ordre) <> count(q.id)
       or count(distinct q.ordre) <> count(q.id)
       or count(q.id) filter (
         where nullif(btrim(coalesce(q.enonce_md, '')), '') is null
            or nullif(btrim(coalesce(q.correction_md, '')), '') is null
       ) > 0
  ) then
    raise exception 'exercice_incomplet';
  end if;

  return new;
end;
$$;

create or replace function public.publier_exercices_admin_v2(
  p_chapitre_id uuid,
  p_publication_id uuid,
  p_levels jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_meta record;
  v_level_json jsonb;
  v_exercice_json jsonb;
  v_question_json jsonb;
  v_pack public.packs_entrainement%rowtype;
  v_exercice public.exercices_entrainement%rowtype;
  v_lot_code text;
  v_pack_code text;
  v_palier text;
  v_level_hash text;
  v_version int;
  v_pack_count int := 0;
  v_exercice_count int := 0;
  v_question_count int := 0;
  v_array_count int;
  v_distinct_count int;
  v_min_ordre int;
  v_max_ordre int;
  v_manifest jsonb;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  if p_chapitre_id is null or p_publication_id is null then
    raise exception 'identifiant_publication_requis';
  end if;

  if coalesce(jsonb_typeof(p_levels), 'null') <> 'array'
     or jsonb_array_length(p_levels) <> 3 then
    raise exception 'trois_niveaux_requis';
  end if;

  if coalesce(pg_column_size(p_levels), 0) > 1048576 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select
    c.id as chapitre_id,
    c.code as chapitre_code,
    c.titre as chapitre_titre,
    c.ordre as chapitre_ordre,
    n.nom as niveau,
    s.nom as serie,
    m.slug as matiere_slug
  into v_meta
  from public.chapitres c
  join public.matieres m on m.id = c.matiere_id
  join public.series s on s.id = c.serie_id
  join public.niveaux n on n.id = s.niveau_id
  where c.id = p_chapitre_id
  for update of c;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;

  select count(distinct level_item.value ->> 'palier')::int
  into v_distinct_count
  from jsonb_array_elements(p_levels) as level_item(value);

  if v_distinct_count <> 3 then
    raise exception 'paliers_dupliques_ou_manquants';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_levels) as level_item(value)
    where case level_item.value ->> 'palier'
      when 'entrainement' then level_item.value ->> 'libelle' is distinct from 'Facile'
      when 'maitrise' then level_item.value ->> 'libelle' is distinct from 'Moyen'
      when 'concours' then level_item.value ->> 'libelle' is distinct from 'Difficile'
      else true
    end
  ) then
    raise exception 'palier_ou_libelle_invalide';
  end if;

  -- Toute la publication est validee avant la premiere ecriture.
  for v_level_json in
    select value from jsonb_array_elements(p_levels)
  loop
    v_pack_count := v_pack_count + 1;

    if nullif(btrim(coalesce(v_level_json ->> 'titre', '')), '') is null then
      raise exception 'titre_niveau_requis: %', v_level_json ->> 'palier';
    end if;

    if jsonb_typeof(v_level_json -> 'exercises') <> 'array'
       or jsonb_array_length(v_level_json -> 'exercises') < 1 then
      raise exception 'exercice_requis: %', v_level_json ->> 'palier';
    end if;

    select
      count(*)::int,
      count(distinct (exercise_item.value ->> 'numero')::int)::int,
      min((exercise_item.value ->> 'numero')::int),
      max((exercise_item.value ->> 'numero')::int)
    into v_array_count, v_distinct_count, v_min_ordre, v_max_ordre
    from jsonb_array_elements(v_level_json -> 'exercises') as exercise_item(value);

    if v_array_count < 1
       or v_distinct_count <> v_array_count
       or v_min_ordre <> 1
       or v_max_ordre <> v_array_count then
      raise exception 'numerotation_exercices_invalide: %',
        v_level_json ->> 'palier';
    end if;

    for v_exercice_json in
      select value from jsonb_array_elements(v_level_json -> 'exercises')
    loop
      v_exercice_count := v_exercice_count + 1;

      if nullif(btrim(coalesce(v_exercice_json ->> 'titre', '')), '') is null
         or nullif(btrim(coalesce(v_exercice_json ->> 'consigne', '')), '') is null then
        raise exception 'exercice_invalide: %/%',
          v_level_json ->> 'palier', v_exercice_json ->> 'numero';
      end if;

      if jsonb_typeof(v_exercice_json -> 'questions') <> 'array'
         or jsonb_array_length(v_exercice_json -> 'questions') < 2 then
        raise exception 'deux_questions_minimum: %/%',
          v_level_json ->> 'palier', v_exercice_json ->> 'numero';
      end if;

      select
        count(*)::int,
        count(distinct (question_item.value ->> 'ordre')::int)::int,
        min((question_item.value ->> 'ordre')::int),
        max((question_item.value ->> 'ordre')::int)
      into v_array_count, v_distinct_count, v_min_ordre, v_max_ordre
      from jsonb_array_elements(v_exercice_json -> 'questions') as question_item(value);

      if v_distinct_count <> v_array_count
         or v_min_ordre <> 1
         or v_max_ordre <> v_array_count then
        raise exception 'numerotation_questions_invalide: %/%',
          v_level_json ->> 'palier', v_exercice_json ->> 'numero';
      end if;

      for v_question_json in
        select value from jsonb_array_elements(v_exercice_json -> 'questions')
      loop
        v_question_count := v_question_count + 1;

        if nullif(btrim(coalesce(v_question_json ->> 'enonce_md', '')), '') is null
           or nullif(btrim(coalesce(v_question_json ->> 'correction_md', '')), '') is null then
          raise exception 'question_ou_correction_invalide: %/%/%',
            v_level_json ->> 'palier',
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;

        if v_question_json ? 'type'
           or v_question_json ? 'choix'
           or v_question_json ? 'bonnes_reponses'
           or v_question_json ? 'p_choix'
           or v_question_json ? 'reponse' then
          raise exception 'champ_interactif_interdit: %/%/%',
            v_level_json ->> 'palier',
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;

        if nullif(btrim(coalesce(v_question_json ->> 'image_url', '')), '') is not null
           and lower(btrim(v_question_json ->> 'image_url')) not like 'https://%' then
          raise exception 'image_https_requise: %/%/%',
            v_level_json ->> 'palier',
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;

        if nullif(btrim(coalesce(v_question_json ->> 'image_url', '')), '') is not null
           and nullif(btrim(coalesce(v_question_json ->> 'image_alt', '')), '') is null then
          raise exception 'description_image_requise: %/%/%',
            v_level_json ->> 'palier',
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;
      end loop;
    end loop;
  end loop;

  v_lot_code := 'admin-v3:' || p_chapitre_id::text || ':' || p_publication_id::text;

  for v_level_json in
    select value from jsonb_array_elements(p_levels)
    order by case value ->> 'palier'
      when 'entrainement' then 1
      when 'maitrise' then 2
      when 'concours' then 3
      else 4
    end
  loop
    v_palier := v_level_json ->> 'palier';
    v_pack_code := v_lot_code || ':' || v_palier;
    v_level_hash := md5(v_level_json::text);

    select * into v_pack
    from public.packs_entrainement
    where code = v_pack_code;

    if v_pack.id is not null then
      if v_pack.content_hash <> v_level_hash then
        raise exception 'identifiant_publication_reutilise';
      end if;
      if not v_pack.published then
        raise exception 'publication_deja_archivee';
      end if;
      continue;
    end if;

    select coalesce(max(version), 0) + 1 into v_version
    from public.packs_entrainement
    where chapitre_id = p_chapitre_id
      and palier = v_palier;

    insert into public.packs_entrainement (
      chapitre_id, palier, code, version, titre, content_hash,
      source_id, source_locator, published
    ) values (
      p_chapitre_id,
      v_palier,
      v_pack_code,
      v_version,
      v_level_json ->> 'titre',
      v_level_hash,
      null,
      'Editeur admin des exercices guides',
      false
    )
    returning * into v_pack;

    for v_exercice_json in
      select value
      from jsonb_array_elements(v_level_json -> 'exercises')
      order by (value ->> 'numero')::int
    loop
      insert into public.exercices_entrainement (
        pack_id, numero, code, titre, consigne, content_hash
      ) values (
        v_pack.id,
        (v_exercice_json ->> 'numero')::int,
        v_pack_code || ':E' || lpad(v_exercice_json ->> 'numero', 6, '0'),
        v_exercice_json ->> 'titre',
        v_exercice_json ->> 'consigne',
        md5(v_exercice_json::text)
      )
      returning * into v_exercice;

      for v_question_json in
        select value
        from jsonb_array_elements(v_exercice_json -> 'questions')
        order by (value ->> 'ordre')::int
      loop
        insert into public.questions_exercice (
          exercice_id, ordre, enonce_md, correction_md,
          image_url, image_alt, content_hash
        ) values (
          v_exercice.id,
          (v_question_json ->> 'ordre')::int,
          v_question_json ->> 'enonce_md',
          v_question_json ->> 'correction_md',
          nullif(btrim(v_question_json ->> 'image_url'), ''),
          nullif(btrim(v_question_json ->> 'image_alt'), ''),
          md5(v_question_json::text)
        );
      end loop;
    end loop;

    update public.packs_entrainement
    set published = false
    where chapitre_id = p_chapitre_id
      and palier = v_palier
      and id <> v_pack.id
      and published = true;

    update public.packs_entrainement
    set published = true
    where id = v_pack.id;
  end loop;

  v_manifest := jsonb_build_object(
    'schema_version', 3,
    'batch_code', v_lot_code,
    'status', 'reviewed',
    'target', jsonb_build_object(
      'chapitre_id', p_chapitre_id,
      'niveau', v_meta.niveau,
      'serie', v_meta.serie,
      'matiere_slug', v_meta.matiere_slug,
      'chapitre_ordre', v_meta.chapitre_ordre,
      'chapitre_titre', v_meta.chapitre_titre
    ),
    'source', jsonb_build_object(
      'type', 'autre',
      'auteur_organisme', 'Administration EXCELLENCE',
      'droits_statut', 'permission',
      'notes', 'Contenu saisi et relu manuellement dans l administration.'
    ),
    'levels', p_levels
  );

  insert into public.lots_contenu (
    code, schema_version, content_hash, cible, source_id,
    quiz_count, question_count, statut, manifeste, applied_at
  ) values (
    v_lot_code,
    3,
    md5(p_levels::text),
    v_manifest -> 'target',
    null,
    v_pack_count,
    v_question_count,
    'publie',
    v_manifest,
    now()
  )
  on conflict (code) do update set
    content_hash = excluded.content_hash,
    question_count = excluded.question_count,
    manifeste = excluded.manifeste,
    applied_at = excluded.applied_at;

  return jsonb_build_object(
    'ok', true,
    'batch_code', v_lot_code,
    'chapitre_id', p_chapitre_id,
    'pack_count', v_pack_count,
    'exercise_count', v_exercice_count,
    'question_count', v_question_count
  );
end;
$$;

revoke all on function public.publier_exercices_admin_v2(uuid, uuid, jsonb)
  from public, anon;
grant execute on function public.publier_exercices_admin_v2(uuid, uuid, jsonb)
  to authenticated;

notify pgrst, 'reload schema';

commit;

