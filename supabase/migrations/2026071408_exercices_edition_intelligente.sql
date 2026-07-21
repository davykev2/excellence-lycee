-- Edition intelligente des exercices guides.
-- Une publication ne remplace que les difficultes modifiees et conserve les
-- validations lorsque le contenu a traiter par l'eleve reste identique.
begin;

alter table public.exercices_entrainement
  add column if not exists progress_hash text;

-- Le recalcul est une métadonnée technique sur des contenus immuables. Le
-- déclencheur est suspendu uniquement pendant cette transaction de migration.
alter table public.exercices_entrainement
  disable trigger trg_proteger_exercices_entrainement;

update public.exercices_entrainement e
set progress_hash = md5(jsonb_build_object(
  'titre', e.titre,
  'consigne', e.consigne,
  'questions', coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'ordre', q.ordre,
        'enonce_md', q.enonce_md,
        'image_url', nullif(btrim(q.image_url), ''),
        'image_alt', nullif(btrim(q.image_alt), '')
      ) order by q.ordre
    )
    from public.questions_exercice q
    where q.exercice_id = e.id
  ), '[]'::jsonb)
)::text)
where e.progress_hash is null;

alter table public.exercices_entrainement
  enable trigger trg_proteger_exercices_entrainement;

alter table public.exercices_entrainement
  drop constraint if exists exercices_entrainement_progress_hash_check;
alter table public.exercices_entrainement
  add constraint exercices_entrainement_progress_hash_check
  check (progress_hash is null or btrim(progress_hash) <> '');

-- Synchronise une validation élève avec la republication du chapitre. Si la
-- publication a déjà commencé, l'insertion attend puis refuse l'ancien pack ;
-- si la validation arrive d'abord, la publication attend et la recopie.
create or replace function public.verrouiller_progression_exercice()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if public.is_admin() then
    return new;
  end if;

  perform 1
  from public.chapitres c
  join public.packs_entrainement p on p.chapitre_id = c.id
  join public.exercices_entrainement e on e.pack_id = p.id
  where e.id = new.exercice_id
    and p.published = true
    and c.published = true
  for share of p;

  if not found then
    raise exception 'exercice_introuvable';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_verrouiller_progression_exercice
  on public.exercices_termines;
create trigger trg_verrouiller_progression_exercice
  before insert on public.exercices_termines
  for each row execute function public.verrouiller_progression_exercice();

revoke all on function public.verrouiller_progression_exercice()
  from public, anon, authenticated;

create or replace function public.calculer_progress_hash_exercice_json(
  p_exercice jsonb
)
returns text
language sql
immutable
set search_path = pg_catalog
as $$
  select md5(jsonb_build_object(
    'titre', p_exercice ->> 'titre',
    'consigne', p_exercice ->> 'consigne',
    'questions', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'ordre', (question_item.value ->> 'ordre')::int,
          'enonce_md', question_item.value ->> 'enonce_md',
          'image_url', nullif(btrim(question_item.value ->> 'image_url'), ''),
          'image_alt', nullif(btrim(question_item.value ->> 'image_alt'), '')
        ) order by (question_item.value ->> 'ordre')::int
      )
      from jsonb_array_elements(p_exercice -> 'questions') as question_item(value)
    ), '[]'::jsonb)
  )::text);
$$;

create or replace function public.calculer_hash_niveau_entrainement_json(
  p_level jsonb
)
returns text
language sql
immutable
set search_path = pg_catalog
as $$
  select md5(jsonb_build_object(
    'titre', p_level ->> 'titre',
    'exercises', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'numero', (exercise_item.value ->> 'numero')::int,
          'titre', exercise_item.value ->> 'titre',
          'consigne', exercise_item.value ->> 'consigne',
          'questions', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'ordre', (question_item.value ->> 'ordre')::int,
                'enonce_md', question_item.value ->> 'enonce_md',
                'correction_md', question_item.value ->> 'correction_md',
                'image_url', nullif(btrim(question_item.value ->> 'image_url'), ''),
                'image_alt', nullif(btrim(question_item.value ->> 'image_alt'), '')
              ) order by (question_item.value ->> 'ordre')::int
            )
            from jsonb_array_elements(exercise_item.value -> 'questions')
              as question_item(value)
          ), '[]'::jsonb)
        ) order by (exercise_item.value ->> 'numero')::int
      )
      from jsonb_array_elements(p_level -> 'exercises') as exercise_item(value)
    ), '[]'::jsonb)
  )::text);
$$;

revoke all on function public.calculer_progress_hash_exercice_json(jsonb)
  from public, anon, authenticated;
revoke all on function public.calculer_hash_niveau_entrainement_json(jsonb)
  from public, anon, authenticated;

create or replace function public.publier_exercices_admin_v3(
  p_chapitre_id uuid,
  p_publication_id uuid,
  p_base_packs jsonb,
  p_levels jsonb,
  p_note_modification text
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
  v_base_json jsonb;
  v_old_level_json jsonb;
  v_old_pack public.packs_entrainement%rowtype;
  v_new_pack public.packs_entrainement%rowtype;
  v_new_exercice public.exercices_entrainement%rowtype;
  v_palier text;
  v_lot_code text;
  v_pack_code text;
  v_note text;
  v_request_hash text;
  v_existing_hash text;
  v_existing_manifest jsonb;
  v_level_hash text;
  v_old_level_hash text;
  v_progress_hash text;
  v_old_progress_hash text;
  v_base_exercice_id uuid;
  v_version int;
  v_array_count int;
  v_distinct_count int;
  v_min_ordre int;
  v_max_ordre int;
  v_base_exercice_count int;
  v_base_exercice_distinct_count int;
  v_total_exercice_count int := 0;
  v_total_question_count int := 0;
  v_changed_pack_count int := 0;
  v_changed_exercice_count int := 0;
  v_changed_question_count int := 0;
  v_old_completion_count int := 0;
  v_level_completion_count int := 0;
  v_copied_count int := 0;
  v_progressions_conservees int := 0;
  v_progressions_reinitialisees int := 0;
  v_changed_paliers jsonb := '[]'::jsonb;
  v_unchanged_paliers jsonb := '[]'::jsonb;
  v_result jsonb;
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

  v_note := btrim(coalesce(p_note_modification, ''));
  if v_note = '' then
    raise exception 'note_modification_requise';
  end if;
  if length(v_note) > 1000 then
    raise exception 'note_modification_trop_longue';
  end if;

  if coalesce(jsonb_typeof(p_base_packs), 'null') <> 'array'
     or jsonb_array_length(p_base_packs) <> 3 then
    raise exception 'trois_packs_de_base_requis';
  end if;

  if coalesce(jsonb_typeof(p_levels), 'null') <> 'array'
     or jsonb_array_length(p_levels) <> 3 then
    raise exception 'trois_niveaux_requis';
  end if;

  if coalesce(pg_column_size(p_levels), 0) > 1048576 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select count(distinct base_item.value ->> 'palier')::int
  into v_distinct_count
  from jsonb_array_elements(p_base_packs) as base_item(value);

  if v_distinct_count <> 3 or exists (
    select 1
    from jsonb_array_elements(p_base_packs) as base_item(value)
    where base_item.value ->> 'palier'
      not in ('entrainement', 'maitrise', 'concours')
  ) then
    raise exception 'packs_de_base_invalides';
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

  v_lot_code := 'admin-edit-v3:' || p_chapitre_id::text || ':' || p_publication_id::text;
  v_request_hash := md5(jsonb_build_object(
    'base_packs', p_base_packs,
    'levels', p_levels,
    'note_modification', v_note
  )::text);

  select l.content_hash, l.manifeste
  into v_existing_hash, v_existing_manifest
  from public.lots_contenu l
  where l.code = v_lot_code;

  if found then
    if v_existing_hash <> v_request_hash then
      raise exception 'identifiant_publication_reutilise';
    end if;
    return v_existing_manifest -> 'result';
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

  -- Revérifie l'idempotence sous le verrou du chapitre. Deux doubles-clics
  -- simultanés avec le même identifiant renvoient ainsi le même résultat.
  select l.content_hash, l.manifeste
  into v_existing_hash, v_existing_manifest
  from public.lots_contenu l
  where l.code = v_lot_code;

  if found then
    if v_existing_hash <> v_request_hash then
      raise exception 'identifiant_publication_reutilise';
    end if;
    return v_existing_manifest -> 'result';
  end if;

  -- Le verrou du chapitre serialise les publications. Les trois versions de
  -- base doivent toujours correspondre aux packs actifs charges par l'admin.
  foreach v_palier in array array['entrainement', 'maitrise', 'concours']::text[]
  loop
    select base_item.value into v_base_json
    from jsonb_array_elements(p_base_packs) as base_item(value)
    where base_item.value ->> 'palier' = v_palier;

    select p.* into v_old_pack
    from public.packs_entrainement p
    where p.chapitre_id = p_chapitre_id
      and p.palier = v_palier
      and p.published = true
    for update of p;

    if v_old_pack.id is null then
      if nullif(v_base_json ->> 'id', '') is not null
         or coalesce((v_base_json ->> 'version')::int, 0) <> 0
         or nullif(v_base_json ->> 'content_hash', '') is not null then
        raise exception 'contenu_modifie_ailleurs: %', v_palier;
      end if;
    elsif nullif(v_base_json ->> 'id', '') is null
       or (v_base_json ->> 'id')::uuid <> v_old_pack.id
       or coalesce((v_base_json ->> 'version')::int, 0) <> v_old_pack.version
       or coalesce(v_base_json ->> 'content_hash', '') <> v_old_pack.content_hash then
      raise exception 'contenu_modifie_ailleurs: %', v_palier;
    end if;
  end loop;

  -- Validation complete avant la premiere mutation.
  for v_level_json in
    select level_item.value
    from jsonb_array_elements(p_levels) as level_item(value)
  loop
    v_palier := v_level_json ->> 'palier';

    select p.* into v_old_pack
    from public.packs_entrainement p
    where p.chapitre_id = p_chapitre_id
      and p.palier = v_palier
      and p.published = true;

    if nullif(btrim(coalesce(v_level_json ->> 'titre', '')), '') is null then
      raise exception 'titre_niveau_requis: %', v_palier;
    end if;

    if jsonb_typeof(v_level_json -> 'exercises') <> 'array'
       or jsonb_array_length(v_level_json -> 'exercises') < 1 then
      raise exception 'exercice_requis: %', v_palier;
    end if;

    select
      count(*)::int,
      count(distinct (exercise_item.value ->> 'numero')::int)::int,
      min((exercise_item.value ->> 'numero')::int),
      max((exercise_item.value ->> 'numero')::int),
      count(*) filter (
        where nullif(exercise_item.value ->> 'base_exercice_id', '') is not null
      )::int,
      count(distinct nullif(exercise_item.value ->> 'base_exercice_id', ''))::int
    into
      v_array_count,
      v_distinct_count,
      v_min_ordre,
      v_max_ordre,
      v_base_exercice_count,
      v_base_exercice_distinct_count
    from jsonb_array_elements(v_level_json -> 'exercises') as exercise_item(value);

    if v_array_count < 1
       or v_distinct_count <> v_array_count
       or v_min_ordre <> 1
       or v_max_ordre <> v_array_count then
      raise exception 'numerotation_exercices_invalide: %', v_palier;
    end if;

    if v_base_exercice_count <> v_base_exercice_distinct_count then
      raise exception 'exercices_de_base_dupliques: %', v_palier;
    end if;

    for v_exercice_json in
      select exercise_item.value
      from jsonb_array_elements(v_level_json -> 'exercises') as exercise_item(value)
    loop
      v_total_exercice_count := v_total_exercice_count + 1;
      v_base_exercice_id := nullif(v_exercice_json ->> 'base_exercice_id', '')::uuid;

      if v_base_exercice_id is not null and (
        v_old_pack.id is null or not exists (
          select 1
          from public.exercices_entrainement e
          where e.id = v_base_exercice_id
            and e.pack_id = v_old_pack.id
        )
      ) then
        raise exception 'exercice_base_invalide: %/%',
          v_palier, v_exercice_json ->> 'numero';
      end if;

      if nullif(btrim(coalesce(v_exercice_json ->> 'titre', '')), '') is null
         or nullif(btrim(coalesce(v_exercice_json ->> 'consigne', '')), '') is null then
        raise exception 'exercice_invalide: %/%',
          v_palier, v_exercice_json ->> 'numero';
      end if;

      if jsonb_typeof(v_exercice_json -> 'questions') <> 'array'
         or jsonb_array_length(v_exercice_json -> 'questions') < 2 then
        raise exception 'deux_questions_minimum: %/%',
          v_palier, v_exercice_json ->> 'numero';
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
          v_palier, v_exercice_json ->> 'numero';
      end if;

      for v_question_json in
        select question_item.value
        from jsonb_array_elements(v_exercice_json -> 'questions') as question_item(value)
      loop
        v_total_question_count := v_total_question_count + 1;

        if nullif(btrim(coalesce(v_question_json ->> 'enonce_md', '')), '') is null
           or nullif(btrim(coalesce(v_question_json ->> 'correction_md', '')), '') is null then
          raise exception 'question_ou_correction_invalide: %/%/%',
            v_palier,
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;

        if v_question_json ? 'type'
           or v_question_json ? 'choix'
           or v_question_json ? 'bonnes_reponses'
           or v_question_json ? 'p_choix'
           or v_question_json ? 'reponse' then
          raise exception 'champ_interactif_interdit: %/%/%',
            v_palier,
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;

        if nullif(btrim(coalesce(v_question_json ->> 'image_url', '')), '') is not null
           and lower(btrim(v_question_json ->> 'image_url')) not like 'https://%' then
          raise exception 'image_https_requise: %/%/%',
            v_palier,
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;

        if nullif(btrim(coalesce(v_question_json ->> 'image_url', '')), '') is not null
           and nullif(btrim(coalesce(v_question_json ->> 'image_alt', '')), '') is null then
          raise exception 'description_image_requise: %/%/%',
            v_palier,
            v_exercice_json ->> 'numero',
            v_question_json ->> 'ordre';
        end if;
      end loop;
    end loop;
  end loop;

  -- Chaque niveau est compare au contenu actif sous une forme canonique qui
  -- exclut les identifiants techniques du formulaire.
  for v_level_json in
    select level_item.value
    from jsonb_array_elements(p_levels) as level_item(value)
    order by case level_item.value ->> 'palier'
      when 'entrainement' then 1
      when 'maitrise' then 2
      when 'concours' then 3
      else 4
    end
  loop
    v_palier := v_level_json ->> 'palier';
    v_level_hash := public.calculer_hash_niveau_entrainement_json(v_level_json);

    select p.* into v_old_pack
    from public.packs_entrainement p
    where p.chapitre_id = p_chapitre_id
      and p.palier = v_palier
      and p.published = true;

    v_old_level_hash := null;
    if v_old_pack.id is not null then
      select jsonb_build_object(
        'titre', p.titre,
        'exercises', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'numero', e.numero,
              'titre', e.titre,
              'consigne', e.consigne,
              'questions', coalesce((
                select jsonb_agg(
                  jsonb_build_object(
                    'ordre', q.ordre,
                    'enonce_md', q.enonce_md,
                    'correction_md', q.correction_md,
                    'image_url', q.image_url,
                    'image_alt', q.image_alt
                  ) order by q.ordre
                )
                from public.questions_exercice q
                where q.exercice_id = e.id
              ), '[]'::jsonb)
            ) order by e.numero
          )
          from public.exercices_entrainement e
          where e.pack_id = p.id
        ), '[]'::jsonb)
      ) into v_old_level_json
      from public.packs_entrainement p
      where p.id = v_old_pack.id;

      v_old_level_hash := public.calculer_hash_niveau_entrainement_json(v_old_level_json);
    end if;

    if v_old_pack.id is not null and v_old_level_hash = v_level_hash then
      v_unchanged_paliers := v_unchanged_paliers || jsonb_build_array(
        jsonb_build_object(
          'palier', v_palier,
          'pack_id', v_old_pack.id,
          'version', v_old_pack.version
        )
      );
      continue;
    end if;

    v_changed_pack_count := v_changed_pack_count + 1;
    v_level_completion_count := 0;

    if v_old_pack.id is not null then
      select count(*)::int into v_old_completion_count
      from public.exercices_termines et
      join public.exercices_entrainement e on e.id = et.exercice_id
      where e.pack_id = v_old_pack.id;
    else
      v_old_completion_count := 0;
    end if;

    select coalesce(max(p.version), 0) + 1 into v_version
    from public.packs_entrainement p
    where p.chapitre_id = p_chapitre_id
      and p.palier = v_palier;

    v_pack_code := v_lot_code || ':' || v_palier;

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
      v_old_pack.source_id,
      case
        when v_old_pack.id is null then 'Editeur admin des exercices guides'
        else v_old_pack.source_locator
      end,
      false
    )
    returning * into v_new_pack;

    for v_exercice_json in
      select exercise_item.value
      from jsonb_array_elements(v_level_json -> 'exercises') as exercise_item(value)
      order by (exercise_item.value ->> 'numero')::int
    loop
      v_changed_exercice_count := v_changed_exercice_count + 1;
      v_progress_hash := public.calculer_progress_hash_exercice_json(v_exercice_json);

      insert into public.exercices_entrainement (
        pack_id, numero, code, titre, consigne, content_hash, progress_hash
      ) values (
        v_new_pack.id,
        (v_exercice_json ->> 'numero')::int,
        v_pack_code || ':E' || lpad(v_exercice_json ->> 'numero', 6, '0'),
        v_exercice_json ->> 'titre',
        v_exercice_json ->> 'consigne',
        md5(v_exercice_json::text),
        v_progress_hash
      )
      returning * into v_new_exercice;

      for v_question_json in
        select question_item.value
        from jsonb_array_elements(v_exercice_json -> 'questions') as question_item(value)
        order by (question_item.value ->> 'ordre')::int
      loop
        v_changed_question_count := v_changed_question_count + 1;

        insert into public.questions_exercice (
          exercice_id, ordre, enonce_md, correction_md,
          image_url, image_alt, content_hash
        ) values (
          v_new_exercice.id,
          (v_question_json ->> 'ordre')::int,
          v_question_json ->> 'enonce_md',
          v_question_json ->> 'correction_md',
          nullif(btrim(v_question_json ->> 'image_url'), ''),
          nullif(btrim(v_question_json ->> 'image_alt'), ''),
          md5(v_question_json::text)
        );
      end loop;

    end loop;

    -- La copie de progression arrive seulement apres la construction complete
    -- du pack. Des validations presentes plus tot rendraient le pack immuable
    -- et empecheraient l'insertion des exercices suivants.
    for v_exercice_json in
      select exercise_item.value
      from jsonb_array_elements(v_level_json -> 'exercises') as exercise_item(value)
      order by (exercise_item.value ->> 'numero')::int
    loop
      v_base_exercice_id := nullif(v_exercice_json ->> 'base_exercice_id', '')::uuid;
      v_progress_hash := public.calculer_progress_hash_exercice_json(v_exercice_json);

      if v_base_exercice_id is not null then
        select e.* into v_new_exercice
        from public.exercices_entrainement e
        where e.pack_id = v_new_pack.id
          and e.numero = (v_exercice_json ->> 'numero')::int;

        select md5(jsonb_build_object(
          'titre', e.titre,
          'consigne', e.consigne,
          'questions', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'ordre', q.ordre,
                'enonce_md', q.enonce_md,
                'image_url', nullif(btrim(q.image_url), ''),
                'image_alt', nullif(btrim(q.image_alt), '')
              ) order by q.ordre
            )
            from public.questions_exercice q
            where q.exercice_id = e.id
          ), '[]'::jsonb)
        )::text) into v_old_progress_hash
        from public.exercices_entrainement e
        where e.id = v_base_exercice_id
          and e.pack_id = v_old_pack.id;

        if v_old_progress_hash = v_progress_hash then
          insert into public.exercices_termines(user_id, exercice_id, termine_at)
          select et.user_id, v_new_exercice.id, et.termine_at
          from public.exercices_termines et
          where et.exercice_id = v_base_exercice_id
          on conflict (user_id, exercice_id) do nothing;

          get diagnostics v_copied_count = row_count;
          v_level_completion_count := v_level_completion_count + v_copied_count;
        end if;
      end if;
    end loop;

    update public.packs_entrainement
    set published = false
    where chapitre_id = p_chapitre_id
      and palier = v_palier
      and id <> v_new_pack.id
      and published = true;

    update public.packs_entrainement
    set published = true
    where id = v_new_pack.id;

    v_progressions_conservees :=
      v_progressions_conservees + v_level_completion_count;
    v_progressions_reinitialisees :=
      v_progressions_reinitialisees
      + greatest(v_old_completion_count - v_level_completion_count, 0);

    v_changed_paliers := v_changed_paliers || jsonb_build_array(
      jsonb_build_object(
        'palier', v_palier,
        'pack_id', v_new_pack.id,
        'version_precedente', v_old_pack.version,
        'version', v_new_pack.version,
        'progressions_conservees', v_level_completion_count,
        'progressions_reinitialisees',
          greatest(v_old_completion_count - v_level_completion_count, 0)
      )
    );
  end loop;

  v_result := jsonb_build_object(
    'ok', true,
    'batch_code', v_lot_code,
    'chapitre_id', p_chapitre_id,
    'changed_pack_count', v_changed_pack_count,
    'unchanged_pack_count', 3 - v_changed_pack_count,
    'exercise_count', v_total_exercice_count,
    'question_count', v_total_question_count,
    'changed_exercise_count', v_changed_exercice_count,
    'changed_question_count', v_changed_question_count,
    'progressions_conservees', v_progressions_conservees,
    'progressions_reinitialisees', v_progressions_reinitialisees,
    'changed_paliers', v_changed_paliers,
    'unchanged_paliers', v_unchanged_paliers
  );

  v_manifest := jsonb_build_object(
    'schema_version', 4,
    'batch_code', v_lot_code,
    'status', 'reviewed',
    'editor_user_id', auth.uid(),
    'note_modification', v_note,
    'target', jsonb_build_object(
      'chapitre_id', p_chapitre_id,
      'niveau', v_meta.niveau,
      'serie', v_meta.serie,
      'matiere_slug', v_meta.matiere_slug,
      'chapitre_ordre', v_meta.chapitre_ordre,
      'chapitre_titre', v_meta.chapitre_titre
    ),
    'base_packs', p_base_packs,
    'levels', p_levels,
    'changed_paliers', v_changed_paliers,
    'unchanged_paliers', v_unchanged_paliers,
    'result', v_result
  );

  insert into public.lots_contenu (
    code, schema_version, content_hash, cible, source_id,
    quiz_count, question_count, statut, manifeste, applied_at
  ) values (
    v_lot_code,
    4,
    v_request_hash,
    v_manifest -> 'target',
    null,
    v_changed_pack_count,
    v_changed_question_count,
    'publie',
    v_manifest,
    now()
  );

  return v_result;
end;
$$;

revoke all on function public.publier_exercices_admin_v3(
  uuid, uuid, jsonb, jsonb, text
) from public, anon;
grant execute on function public.publier_exercices_admin_v3(
  uuid, uuid, jsonb, jsonb, text
) to authenticated;

notify pgrst, 'reload schema';

commit;
