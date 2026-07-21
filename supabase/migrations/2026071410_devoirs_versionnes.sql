begin;

select set_config('app.devoirs_admin_internal', 'on', true);

-- ==========================================================================
-- Devoirs versionnes
--
-- Un devoir editorial est stable. Chaque publication cree une version de
-- quiz distincte afin que les tentatives, reponses et corrections historiques
-- ne soient jamais reecrites.
-- ==========================================================================

create table if not exists public.devoirs_editoriaux (
  id uuid primary key default gen_random_uuid(),
  matiere_id uuid not null references public.matieres(id) on delete restrict,
  serie_id uuid not null references public.series(id) on delete restrict,
  numero int not null check (numero > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (matiere_id, serie_id, numero)
);

alter table public.devoirs_editoriaux enable row level security;

drop policy if exists "devoirs_editoriaux_admin" on public.devoirs_editoriaux;
create policy "devoirs_editoriaux_admin" on public.devoirs_editoriaux
  for all using (public.is_admin()) with check (public.is_admin());

grant select, insert, update, delete on public.devoirs_editoriaux to authenticated;
revoke all on public.devoirs_editoriaux from anon;

drop trigger if exists trg_devoirs_editoriaux_updated_at on public.devoirs_editoriaux;
create trigger trg_devoirs_editoriaux_updated_at
  before update on public.devoirs_editoriaux
  for each row execute function public.set_updated_at();

alter table public.quiz add column if not exists devoir_id uuid;
alter table public.quiz add column if not exists version_devoir int;
alter table public.quiz add column if not exists statut_editorial text;
alter table public.quiz add column if not exists publication_id uuid;
alter table public.quiz add column if not exists published_at timestamptz;
alter table public.quiz add column if not exists archived_at timestamptz;
alter table public.quiz add column if not exists updated_at timestamptz not null default now();
alter table public.quiz add column if not exists revision_editoriale bigint not null default 0;

alter table public.quiz drop constraint if exists quiz_revision_editoriale_positive;
alter table public.quiz add constraint quiz_revision_editoriale_positive
  check (revision_editoriale >= 0);

do $$
begin
  if exists (
    select 1 from public.quiz
    where type = 'devoir' and (serie_id is null or numero <= 0)
  ) then
    raise exception 'devoir_existant_cible_invalide';
  end if;
end;
$$;

-- Les devoirs historiques deviennent chacun l'entite stable et sa version 1.
-- Reutiliser l'UUID du premier quiz rend cette migration idempotente.
insert into public.devoirs_editoriaux (id, matiere_id, serie_id, numero, created_at, updated_at)
select q.id, q.matiere_id, q.serie_id, q.numero, q.created_at, now()
from public.quiz q
where q.type = 'devoir' and q.devoir_id is null
on conflict (id) do nothing;

update public.quiz q
set
  devoir_id = coalesce(q.devoir_id, q.id),
  version_devoir = coalesce(q.version_devoir, 1),
  statut_editorial = coalesce(
    q.statut_editorial,
    case
      when q.published then 'publie'
      when exists (select 1 from public.tentatives t where t.quiz_id = q.id) then 'archive'
      else 'brouillon'
    end
  ),
  published_at = case
    when q.published then coalesce(q.published_at, q.created_at)
    else q.published_at
  end,
  archived_at = case
    when not q.published
      and exists (select 1 from public.tentatives t where t.quiz_id = q.id)
      then coalesce(q.archived_at, now())
    else q.archived_at
  end,
  updated_at = now()
where q.type = 'devoir';

alter table public.quiz drop constraint if exists quiz_devoir_id_fkey;
alter table public.quiz add constraint quiz_devoir_id_fkey
  foreign key (devoir_id) references public.devoirs_editoriaux(id) on delete restrict;

alter table public.quiz drop constraint if exists quiz_devoir_version_coherence;
alter table public.quiz add constraint quiz_devoir_version_coherence check (
  type <> 'devoir'
  or (
    devoir_id is not null
    and version_devoir is not null
    and version_devoir > 0
    and statut_editorial in ('brouillon', 'publie', 'archive')
    and published = (statut_editorial = 'publie')
  )
);

drop index if exists public.uniq_quiz_devoir_numero;
create unique index if not exists uniq_quiz_devoir_version
  on public.quiz(devoir_id, version_devoir)
  where type = 'devoir';
create unique index if not exists uniq_quiz_devoir_brouillon
  on public.quiz(devoir_id)
  where type = 'devoir' and statut_editorial = 'brouillon';
create unique index if not exists uniq_quiz_devoir_publie
  on public.quiz(devoir_id)
  where type = 'devoir' and statut_editorial = 'publie';
create unique index if not exists uniq_quiz_devoir_numero_publie
  on public.quiz(matiere_id, serie_id, numero)
  where type = 'devoir' and published;
create unique index if not exists uniq_quiz_devoir_publication
  on public.quiz(publication_id)
  where type = 'devoir' and publication_id is not null;

drop trigger if exists trg_quiz_updated_at on public.quiz;
create trigger trg_quiz_updated_at before update on public.quiz
  for each row execute function public.set_updated_at();

-- --------------------------------------------------------------------------
-- Immutabilite : seules les RPC ci-dessous peuvent archiver/publier. Une
-- version publiee, archivee ou deja jouee ne peut jamais etre reecrite.
-- --------------------------------------------------------------------------

create or replace function public.proteger_devoir_editorial()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  if current_setting('app.devoirs_admin_internal', true) = 'on' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;
  raise exception 'edition_devoir_via_rpc_requise';
end;
$$;

drop trigger if exists trg_proteger_devoir_editorial on public.devoirs_editoriaux;
create trigger trg_proteger_devoir_editorial
  before insert or update or delete on public.devoirs_editoriaux
  for each row execute function public.proteger_devoir_editorial();

create or replace function public.proteger_version_devoir()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_old public.quiz%rowtype;
begin
  if current_setting('app.devoirs_admin_internal', true) = 'on' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.type = 'devoir' and new.statut_editorial <> 'brouillon' then
      raise exception 'publication_devoir_via_rpc_requise';
    end if;
    return new;
  end if;

  v_old := old;
  if v_old.type = 'devoir' and (
    v_old.statut_editorial in ('publie', 'archive')
    or exists (select 1 from public.tentatives t where t.quiz_id = v_old.id)
  ) then
    raise exception 'version_devoir_immuable';
  end if;

  if v_old.type = 'devoir'
     or (tg_op = 'UPDATE' and new.type = 'devoir') then
    raise exception 'edition_devoir_via_rpc_requise';
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_version_devoir on public.quiz;
create trigger trg_proteger_version_devoir
  before insert or update or delete on public.quiz
  for each row execute function public.proteger_version_devoir();

create or replace function public.proteger_question_devoir()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_old_quiz public.quiz%rowtype;
  v_new_quiz public.quiz%rowtype;
begin
  if current_setting('app.devoirs_admin_internal', true) = 'on' then
    if tg_op = 'DELETE' then return old; end if;
    return new;
  end if;

  if tg_op in ('UPDATE', 'DELETE') then
    select * into v_old_quiz from public.quiz where id = old.quiz_id;
  end if;
  if tg_op in ('INSERT', 'UPDATE') then
    select * into v_new_quiz from public.quiz where id = new.quiz_id;
  end if;

  if v_old_quiz.type = 'devoir' and (
    v_old_quiz.statut_editorial <> 'brouillon'
    or exists (select 1 from public.tentatives t where t.quiz_id = v_old_quiz.id)
  ) then
    raise exception 'questions_devoir_immuables';
  end if;

  if v_old_quiz.type = 'devoir' or v_new_quiz.type = 'devoir' then
    raise exception 'edition_devoir_via_rpc_requise';
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_question_devoir on public.questions;
create trigger trg_proteger_question_devoir
  before insert or update or delete on public.questions
  for each row execute function public.proteger_question_devoir();

-- --------------------------------------------------------------------------
-- Validation persistante d'une version. Aucun plafond editorial de questions
-- n'est impose ; seule la taille technique de la requete de sauvegarde l'est.
-- --------------------------------------------------------------------------

create or replace function public.valider_version_devoir(p_quiz_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_quiz public.quiz%rowtype;
  v_question public.questions%rowtype;
  v_count int;
  v_min int;
  v_max int;
  v_distinct int;
  v_choices int;
  v_choices_distinct int;
begin
  select * into v_quiz
  from public.quiz
  where id = p_quiz_id and type = 'devoir';

  if v_quiz.id is null then raise exception 'devoir_introuvable'; end if;
  if nullif(btrim(v_quiz.titre), '') is null then raise exception 'titre_requis'; end if;
  if coalesce(v_quiz.duree_sec, 0) <= 0 then raise exception 'duree_invalide'; end if;
  if coalesce(v_quiz.numero, 0) <= 0 then raise exception 'numero_invalide'; end if;

  select count(*), min(ordre), max(ordre), count(distinct ordre)
  into v_count, v_min, v_max, v_distinct
  from public.questions
  where quiz_id = p_quiz_id;

  if v_count < 1 then raise exception 'question_requise'; end if;
  if v_min <> 1 or v_max <> v_count or v_distinct <> v_count then
    raise exception 'numerotation_questions_invalide';
  end if;

  for v_question in
    select * from public.questions where quiz_id = p_quiz_id order by ordre
  loop
    if nullif(btrim(v_question.enonce), '') is null then raise exception 'enonce_requis'; end if;
    if coalesce(v_question.points, 0) <= 0 then raise exception 'points_invalides'; end if;
    if nullif(btrim(coalesce(v_question.explication, '')), '') is null then
      raise exception 'correction_requise';
    end if;

    if v_question.image_url is not null then
      if v_question.image_url !~* '^https://[^[:space:]]+$' then
        raise exception 'image_https_requise';
      end if;
      if nullif(btrim(coalesce(v_question.image_alt, '')), '') is null then
        raise exception 'image_alt_requis';
      end if;
    end if;

    if v_question.type = 'qcm' then
      if jsonb_typeof(v_question.choix) <> 'array'
         or jsonb_array_length(v_question.choix) < 2 then
        raise exception 'qcm_choix_invalides';
      end if;
      if exists (
        select 1 from jsonb_array_elements(v_question.choix) e
        where jsonb_typeof(e) <> 'string' or nullif(btrim(e #>> '{}'), '') is null
      ) then
        raise exception 'qcm_choix_invalides';
      end if;
      select count(*), count(distinct btrim(value))
      into v_choices, v_choices_distinct
      from jsonb_array_elements_text(v_question.choix);
      if v_choices <> v_choices_distinct then raise exception 'qcm_choix_dupliques'; end if;
      if jsonb_typeof(v_question.bonnes_reponses) <> 'string'
         or not exists (
           select 1 from jsonb_array_elements_text(v_question.choix) c
           where c = (v_question.bonnes_reponses #>> '{}')
         ) then
        raise exception 'qcm_reponse_invalide';
      end if;
    elsif v_question.type = 'texte' then
      if jsonb_typeof(v_question.bonnes_reponses) <> 'array'
         or jsonb_array_length(v_question.bonnes_reponses) < 1
         or exists (
           select 1 from jsonb_array_elements(v_question.bonnes_reponses) e
           where jsonb_typeof(e) <> 'string' or nullif(btrim(e #>> '{}'), '') is null
         ) then
        raise exception 'reponse_texte_requise';
      end if;
    else
      raise exception 'type_question_invalide';
    end if;
  end loop;
end;
$$;

-- --------------------------------------------------------------------------
-- Lecture admin
-- --------------------------------------------------------------------------

create or replace function public.lister_devoirs_admin_v1(
  p_niveau_id uuid default null,
  p_serie_id uuid default null,
  p_matiere_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_result jsonb;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'devoir_id', d.id,
    'quiz_id', q.id,
    'version', q.version_devoir,
    'statut', q.statut_editorial,
    'numero', q.numero,
    'titre', q.titre,
    'duree_sec', q.duree_sec,
    'published_at', q.published_at,
    'archived_at', q.archived_at,
    'updated_at', q.updated_at,
    'matiere_id', d.matiere_id,
    'matiere_nom', m.nom,
    'matiere_icone', m.icone,
    'serie_id', d.serie_id,
    'serie_nom', s.nom,
    'niveau_id', n.id,
    'niveau_nom', n.nom,
    'questions_count', (select count(*) from public.questions x where x.quiz_id = q.id),
    'tentatives_count', (select count(*) from public.tentatives t where t.quiz_id = q.id)
  ) order by n.ordre, s.nom, m.ordre, d.numero, q.version_devoir desc), '[]'::jsonb)
  into v_result
  from public.devoirs_editoriaux d
  join public.quiz q on q.devoir_id = d.id and q.type = 'devoir'
  join public.matieres m on m.id = d.matiere_id
  join public.series s on s.id = d.serie_id
  join public.niveaux n on n.id = s.niveau_id
  where (p_niveau_id is null or n.id = p_niveau_id)
    and (p_serie_id is null or s.id = p_serie_id)
    and (p_matiere_id is null or m.id = p_matiere_id);

  return v_result;
end;
$$;

create or replace function public.charger_devoir_admin_v1(
  p_devoir_id uuid,
  p_quiz_id uuid default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_devoir public.devoirs_editoriaux%rowtype;
  v_quiz public.quiz%rowtype;
  v_questions jsonb;
  v_versions jsonb;
  v_matiere public.matieres%rowtype;
  v_serie public.series%rowtype;
  v_niveau public.niveaux%rowtype;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;

  select * into v_devoir from public.devoirs_editoriaux where id = p_devoir_id;
  if v_devoir.id is null then raise exception 'devoir_introuvable'; end if;

  if p_quiz_id is null then
    select * into v_quiz
    from public.quiz
    where devoir_id = p_devoir_id and type = 'devoir'
    order by case statut_editorial when 'brouillon' then 0 when 'publie' then 1 else 2 end,
             version_devoir desc
    limit 1;
  else
    select * into v_quiz
    from public.quiz
    where id = p_quiz_id and devoir_id = p_devoir_id and type = 'devoir';
  end if;
  if v_quiz.id is null then raise exception 'version_devoir_introuvable'; end if;

  select * into v_matiere from public.matieres where id = v_devoir.matiere_id;
  select * into v_serie from public.series where id = v_devoir.serie_id;
  select * into v_niveau from public.niveaux where id = v_serie.niveau_id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', q.id,
    'ordre', q.ordre,
    'type', q.type,
    'enonce', q.enonce,
    'choix', q.choix,
    'bonnes_reponses', q.bonnes_reponses,
    'points', q.points,
    'explication', q.explication,
    'image_url', q.image_url,
    'image_alt', q.image_alt
  ) order by q.ordre), '[]'::jsonb)
  into v_questions
  from public.questions q where q.quiz_id = v_quiz.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'quiz_id', q.id,
    'version', q.version_devoir,
    'statut', q.statut_editorial,
    'titre', q.titre,
    'published_at', q.published_at,
    'archived_at', q.archived_at,
    'tentatives_count', (select count(*) from public.tentatives t where t.quiz_id = q.id)
  ) order by q.version_devoir desc), '[]'::jsonb)
  into v_versions
  from public.quiz q
  where q.devoir_id = p_devoir_id and q.type = 'devoir';

  return jsonb_build_object(
    'devoir', jsonb_build_object(
      'id', v_devoir.id,
      'numero', v_devoir.numero,
      'matiere_id', v_devoir.matiere_id,
      'matiere_nom', v_matiere.nom,
      'serie_id', v_devoir.serie_id,
      'serie_nom', v_serie.nom,
      'niveau_id', v_niveau.id,
      'niveau_nom', v_niveau.nom
    ),
    'version', jsonb_build_object(
      'id', v_quiz.id,
      'version', v_quiz.version_devoir,
      'statut', v_quiz.statut_editorial,
      'titre', v_quiz.titre,
      'numero', v_quiz.numero,
      'duree_sec', v_quiz.duree_sec,
      'revision_editoriale', v_quiz.revision_editoriale,
      'published_at', v_quiz.published_at,
      'archived_at', v_quiz.archived_at
    ),
    'questions', v_questions,
    'versions', v_versions
  );
end;
$$;

-- --------------------------------------------------------------------------
-- Creation ou clonage d'un brouillon
-- --------------------------------------------------------------------------

create or replace function public.preparer_brouillon_devoir_admin_v1(
  p_devoir_id uuid,
  p_matiere_id uuid,
  p_serie_id uuid,
  p_numero int,
  p_titre text,
  p_duree_sec int
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_devoir public.devoirs_editoriaux%rowtype;
  v_source public.quiz%rowtype;
  v_brouillon public.quiz%rowtype;
  v_version int;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;

  if p_devoir_id is null then
    if p_matiere_id is null or p_serie_id is null then raise exception 'cible_requise'; end if;
    if coalesce(p_numero, 0) <= 0 then raise exception 'numero_invalide'; end if;
    if nullif(btrim(coalesce(p_titre, '')), '') is null then raise exception 'titre_requis'; end if;
    if coalesce(p_duree_sec, 0) <= 0 then raise exception 'duree_invalide'; end if;
    if not exists (
      select 1 from public.matieres_series ms
      where ms.matiere_id = p_matiere_id and ms.serie_id = p_serie_id
    ) then raise exception 'matiere_serie_invalide'; end if;

    perform set_config('app.devoirs_admin_internal', 'on', true);
    insert into public.devoirs_editoriaux (matiere_id, serie_id, numero)
    values (p_matiere_id, p_serie_id, p_numero)
    returning * into v_devoir;

    perform set_config('app.devoirs_admin_internal', 'on', true);
    insert into public.quiz (
      matiere_id, serie_id, type, titre, numero, duree_sec,
      palier, est_note, published, devoir_id, version_devoir, statut_editorial
    ) values (
      v_devoir.matiere_id, v_devoir.serie_id, 'devoir', btrim(p_titre),
      v_devoir.numero, p_duree_sec, null, true, false,
      v_devoir.id, 1, 'brouillon'
    ) returning * into v_brouillon;
  else
    select * into v_devoir
    from public.devoirs_editoriaux
    where id = p_devoir_id
    for update;
    if v_devoir.id is null then raise exception 'devoir_introuvable'; end if;

    select * into v_brouillon
    from public.quiz
    where devoir_id = p_devoir_id and type = 'devoir' and statut_editorial = 'brouillon';

    if v_brouillon.id is null then
      select * into v_source
      from public.quiz
      where devoir_id = p_devoir_id and type = 'devoir'
        and statut_editorial in ('publie', 'archive')
      order by case when statut_editorial = 'publie' then 0 else 1 end,
               version_devoir desc
      limit 1;
      if v_source.id is null then raise exception 'version_source_introuvable'; end if;

      select coalesce(max(version_devoir), 0) + 1 into v_version
      from public.quiz where devoir_id = p_devoir_id and type = 'devoir';

      perform set_config('app.devoirs_admin_internal', 'on', true);
      insert into public.quiz (
        matiere_id, serie_id, chapitre_id, type, titre, numero, duree_sec,
        palier, est_note, published, devoir_id, version_devoir, statut_editorial
      ) values (
        v_devoir.matiere_id, v_devoir.serie_id, null, 'devoir', v_source.titre,
        v_devoir.numero, v_source.duree_sec, null, true, false,
        v_devoir.id, v_version, 'brouillon'
      ) returning * into v_brouillon;

      insert into public.questions (
        quiz_id, ordre, enonce, type, choix, bonnes_reponses, points,
        image_url, explication, difficulte, origine, licence_code, image_alt
      )
      select
        v_brouillon.id, ordre, enonce, type, choix, bonnes_reponses, points,
        image_url, explication, difficulte, origine, licence_code, image_alt
      from public.questions
      where quiz_id = v_source.id
      order by ordre;

      insert into public.question_sources (question_id, source_id, role, locator)
      select nouvelle.id, provenance.source_id, provenance.role, provenance.locator
      from public.questions ancienne
      join public.questions nouvelle
        on nouvelle.quiz_id = v_brouillon.id and nouvelle.ordre = ancienne.ordre
      join public.question_sources provenance on provenance.question_id = ancienne.id
      where ancienne.quiz_id = v_source.id
      on conflict (question_id, source_id, role) do nothing;
    end if;
  end if;

  return public.charger_devoir_admin_v1(v_devoir.id, v_brouillon.id);
end;
$$;

-- --------------------------------------------------------------------------
-- Sauvegarde transactionnelle du brouillon
-- --------------------------------------------------------------------------

drop function if exists public.enregistrer_brouillon_devoir_admin_v1(uuid, uuid, jsonb);
create or replace function public.enregistrer_brouillon_devoir_admin_v1(
  p_devoir_id uuid,
  p_quiz_id uuid,
  p_payload jsonb,
  p_revision_attendue bigint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_devoir public.devoirs_editoriaux%rowtype;
  v_quiz public.quiz%rowtype;
  v_item jsonb;
  v_ord bigint;
  v_type text;
  v_image_url text;
  v_image_alt text;
  v_base_question_id uuid;
  v_choice jsonb;
  v_choice_count int;
  v_choice_distinct int;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  if p_payload is null or octet_length(p_payload::text) > 1048576 then
    raise exception 'contenu_trop_volumineux';
  end if;
  if jsonb_typeof(p_payload -> 'questions') <> 'array'
     or jsonb_array_length(p_payload -> 'questions') < 1 then
    raise exception 'question_requise';
  end if;
  if coalesce(p_payload ->> 'numero', '') !~ '^[1-9][0-9]*$' then raise exception 'numero_invalide'; end if;
  if coalesce(p_payload ->> 'duree_sec', '') !~ '^[1-9][0-9]*$' then raise exception 'duree_invalide'; end if;
  if nullif(btrim(coalesce(p_payload ->> 'titre', '')), '') is null then raise exception 'titre_requis'; end if;

  select * into v_devoir
  from public.devoirs_editoriaux where id = p_devoir_id for update;
  if v_devoir.id is null then raise exception 'devoir_introuvable'; end if;

  select * into v_quiz
  from public.quiz
  where id = p_quiz_id and devoir_id = p_devoir_id
    and type = 'devoir' and statut_editorial = 'brouillon'
  for update;
  if v_quiz.id is null then raise exception 'brouillon_introuvable'; end if;
  if p_revision_attendue is distinct from v_quiz.revision_editoriale then
    raise exception 'devoir_revision_conflit';
  end if;
  if exists (select 1 from public.tentatives t where t.quiz_id = v_quiz.id) then
    raise exception 'brouillon_deja_joue';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_payload -> 'questions') item
    where nullif(item ->> 'base_question_id', '') is not null
    group by item ->> 'base_question_id'
    having count(*) > 1
  ) then
    raise exception 'questions_de_base_dupliquees';
  end if;

  for v_item, v_ord in
    select e.value, e.ordinality
    from jsonb_array_elements(p_payload -> 'questions') with ordinality e(value, ordinality)
  loop
    if coalesce(v_item ->> 'ordre', '') !~ '^[1-9][0-9]*$'
       or (v_item ->> 'ordre')::int <> v_ord then
      raise exception 'numerotation_questions_invalide';
    end if;
    v_base_question_id := nullif(v_item ->> 'base_question_id', '')::uuid;
    if v_base_question_id is not null and not exists (
      select 1 from public.questions q
      where q.id = v_base_question_id and q.quiz_id = p_quiz_id
    ) then
      raise exception 'question_base_invalide';
    end if;
    v_type := v_item ->> 'type';
    if v_type not in ('qcm', 'texte') then raise exception 'type_question_invalide'; end if;
    if nullif(btrim(coalesce(v_item ->> 'enonce', '')), '') is null then raise exception 'enonce_requis'; end if;
    if coalesce(v_item ->> 'points', '') !~ '^[1-9][0-9]*$' then raise exception 'points_invalides'; end if;
    if nullif(btrim(coalesce(v_item ->> 'explication', '')), '') is null then raise exception 'correction_requise'; end if;

    v_image_url := nullif(btrim(coalesce(v_item ->> 'image_url', '')), '');
    v_image_alt := nullif(btrim(coalesce(v_item ->> 'image_alt', '')), '');
    if v_image_url is not null and v_image_url !~* '^https://[^[:space:]]+$' then
      raise exception 'image_https_requise';
    end if;
    if v_image_url is not null and v_image_alt is null then raise exception 'image_alt_requis'; end if;

    if v_type = 'qcm' then
      if jsonb_typeof(v_item -> 'choix') <> 'array'
         or jsonb_array_length(v_item -> 'choix') < 2 then
        raise exception 'qcm_choix_invalides';
      end if;
      if exists (
        select 1 from jsonb_array_elements(v_item -> 'choix') c
        where jsonb_typeof(c) <> 'string' or nullif(btrim(c #>> '{}'), '') is null
      ) then raise exception 'qcm_choix_invalides'; end if;
      select count(*), count(distinct btrim(value))
      into v_choice_count, v_choice_distinct
      from jsonb_array_elements_text(v_item -> 'choix');
      if v_choice_count <> v_choice_distinct then raise exception 'qcm_choix_dupliques'; end if;
      if jsonb_typeof(v_item -> 'bonnes_reponses') <> 'string'
         or not exists (
           select 1 from jsonb_array_elements_text(v_item -> 'choix') c
           where c = (v_item -> 'bonnes_reponses') #>> '{}'
         ) then raise exception 'qcm_reponse_invalide'; end if;
    else
      if jsonb_typeof(v_item -> 'bonnes_reponses') <> 'array'
         or jsonb_array_length(v_item -> 'bonnes_reponses') < 1
         or exists (
           select 1 from jsonb_array_elements(v_item -> 'bonnes_reponses') r
           where jsonb_typeof(r) <> 'string' or nullif(btrim(r #>> '{}'), '') is null
         ) then raise exception 'reponse_texte_requise'; end if;
    end if;
  end loop;

  perform set_config('app.devoirs_admin_internal', 'on', true);

  update public.devoirs_editoriaux
  set numero = (p_payload ->> 'numero')::int
  where id = p_devoir_id;

  update public.quiz
  set
    titre = btrim(p_payload ->> 'titre'),
    numero = (p_payload ->> 'numero')::int,
    duree_sec = (p_payload ->> 'duree_sec')::int,
    revision_editoriale = revision_editoriale + 1
  where id = p_quiz_id;

  -- Libère temporairement les numéros pour permettre tout réordonnancement,
  -- tout en conservant les UUID et les liens de provenance des questions.
  update public.questions set ordre = -ordre where quiz_id = p_quiz_id;

  for v_item, v_ord in
    select e.value, e.ordinality
    from jsonb_array_elements(p_payload -> 'questions') with ordinality e(value, ordinality)
  loop
    v_type := v_item ->> 'type';
    v_base_question_id := nullif(v_item ->> 'base_question_id', '')::uuid;
    if v_base_question_id is not null then
      update public.questions
      set
        ordre = v_ord::int,
        enonce = btrim(v_item ->> 'enonce'),
        type = v_type,
        choix = case when v_type = 'qcm' then v_item -> 'choix' else null end,
        bonnes_reponses = v_item -> 'bonnes_reponses',
        points = (v_item ->> 'points')::int,
        image_url = nullif(btrim(coalesce(v_item ->> 'image_url', '')), ''),
        image_alt = nullif(btrim(coalesce(v_item ->> 'image_alt', '')), ''),
        explication = btrim(v_item ->> 'explication'),
        origine = case
          when origine = 'citation' and (
            enonce is distinct from btrim(v_item ->> 'enonce')
            or choix is distinct from case when v_type = 'qcm' then v_item -> 'choix' else null end
            or bonnes_reponses is distinct from v_item -> 'bonnes_reponses'
            or explication is distinct from btrim(v_item ->> 'explication')
          ) then 'adaptee'
          else origine
        end,
        content_hash = md5(v_item::text),
        updated_at = now()
      where id = v_base_question_id and quiz_id = p_quiz_id;
    else
      insert into public.questions (
        quiz_id, ordre, enonce, type, choix, bonnes_reponses, points,
        image_url, image_alt, explication, origine, content_hash
      ) values (
        p_quiz_id,
        v_ord::int,
        btrim(v_item ->> 'enonce'),
        v_type,
        case when v_type = 'qcm' then v_item -> 'choix' else null end,
        v_item -> 'bonnes_reponses',
        (v_item ->> 'points')::int,
        nullif(btrim(coalesce(v_item ->> 'image_url', '')), ''),
        nullif(btrim(coalesce(v_item ->> 'image_alt', '')), ''),
        btrim(v_item ->> 'explication'),
        'originale',
        md5(v_item::text)
      );
    end if;
  end loop;

  delete from public.questions where quiz_id = p_quiz_id and ordre < 0;

  perform public.valider_version_devoir(p_quiz_id);
  return public.charger_devoir_admin_v1(p_devoir_id, p_quiz_id);
end;
$$;

-- --------------------------------------------------------------------------
-- Publication atomique et idempotente
-- --------------------------------------------------------------------------

drop function if exists public.publier_devoir_admin_v1(uuid, uuid, uuid);
create or replace function public.publier_devoir_admin_v1(
  p_devoir_id uuid,
  p_quiz_id uuid,
  p_publication_id uuid,
  p_revision_attendue bigint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_devoir public.devoirs_editoriaux%rowtype;
  v_quiz public.quiz%rowtype;
  v_deja public.quiz%rowtype;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  if p_publication_id is null then raise exception 'publication_id_requis'; end if;

  select * into v_devoir
  from public.devoirs_editoriaux where id = p_devoir_id for update;
  if v_devoir.id is null then raise exception 'devoir_introuvable'; end if;

  select * into v_deja
  from public.quiz
  where publication_id = p_publication_id and type = 'devoir';
  if v_deja.id is not null then
    if v_deja.devoir_id is distinct from p_devoir_id
       or v_deja.id is distinct from p_quiz_id then
      raise exception 'publication_id_deja_utilise';
    end if;
    return public.charger_devoir_admin_v1(v_deja.devoir_id, v_deja.id);
  end if;

  select * into v_quiz
  from public.quiz
  where id = p_quiz_id and devoir_id = p_devoir_id
    and type = 'devoir' and statut_editorial = 'brouillon'
  for update;
  if v_quiz.id is null then raise exception 'brouillon_introuvable'; end if;
  if p_revision_attendue is distinct from v_quiz.revision_editoriale then
    raise exception 'devoir_revision_conflit';
  end if;

  perform public.valider_version_devoir(p_quiz_id);
  perform set_config('app.devoirs_admin_internal', 'on', true);

  update public.quiz
  set
    statut_editorial = 'archive',
    published = false,
    archived_at = now()
  where devoir_id = p_devoir_id
    and type = 'devoir'
    and statut_editorial = 'publie';

  update public.quiz
  set
    statut_editorial = 'publie',
    published = true,
    published_at = now(),
    archived_at = null,
    publication_id = p_publication_id,
    revision_editoriale = revision_editoriale + 1
  where id = p_quiz_id;

  return public.charger_devoir_admin_v1(p_devoir_id, p_quiz_id);
end;
$$;

-- --------------------------------------------------------------------------
-- Moteur eleve : verifie la serie cote serveur. Une tentative en cours peut
-- continuer sur sa version desormais archivee ; aucune nouvelle tentative ne
-- peut en revanche etre ouverte sur une version archivee.
-- --------------------------------------------------------------------------

create or replace function public.start_tentative(p_quiz_id uuid)
returns jsonb language plpgsql security definer set search_path = pg_catalog, public as $$
declare
  v_quiz record;
  v_chapitre_precedent_id uuid;
  v_meilleure_note numeric;
  v_nb_tentatives int;
  v_numero_tentative int;
  v_facteur numeric;
  v_duree numeric;
  v_tentative record;
  v_questions jsonb;
  v_approuve boolean;
  v_profile_serie_id uuid;
  v_chapitre_ordre int;
  v_limite_decouverte int;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select * into v_tentative from public.tentatives
  where user_id = auth.uid() and quiz_id = p_quiz_id and statut = 'en_cours'
    and (date_fin_theorique is null or date_fin_theorique > now())
  order by created_at desc limit 1;

  if v_tentative is not null then
    select * into v_quiz from public.quiz where id = p_quiz_id;
  else
    select * into v_quiz from public.quiz where id = p_quiz_id and published = true;
  end if;
  if v_quiz is null then raise exception 'quiz_introuvable'; end if;
  if not v_quiz.est_note or v_quiz.palier is not null then
    raise exception 'utiliser_entrainement_rpc';
  end if;

  -- Coordonne le démarrage avec une republication. Une tentative déjà en
  -- cours peut continuer sur l'archive ; une nouvelle doit encore viser la
  -- version publiée après l'acquisition du verrou.
  if v_quiz.type = 'devoir' and v_quiz.devoir_id is not null then
    perform 1
    from public.devoirs_editoriaux d
    where d.id = v_quiz.devoir_id
    for key share;
    if not found then raise exception 'quiz_introuvable'; end if;

    if v_tentative is null and not exists (
      select 1 from public.quiz q where q.id = p_quiz_id and q.published = true
    ) then
      raise exception 'quiz_introuvable';
    end if;
  end if;

  select approuve, serie_id into v_approuve, v_profile_serie_id
  from public.profiles where id = auth.uid();

  if v_quiz.type = 'devoir'
     and not public.is_admin()
     and v_quiz.serie_id is distinct from v_profile_serie_id then
    raise exception 'contenu_non_autorise';
  end if;

  if not coalesce(v_approuve, false) then
    if v_quiz.type = 'devoir' then raise exception 'contenu_reserve_membres'; end if;
    select ordre into v_chapitre_ordre from public.chapitres where id = v_quiz.chapitre_id;
    select coalesce((valeur #>> '{}')::int, 1) into v_limite_decouverte
      from public.app_settings where cle = 'contenu_decouverte_chapitres';
    if coalesce(v_chapitre_ordre, 999) > coalesce(v_limite_decouverte, 1) then
      raise exception 'contenu_reserve_membres';
    end if;
  end if;

  if v_quiz.type = 'chapitre' and v_quiz.est_note and v_quiz.numero > 1 then
    select id into v_chapitre_precedent_id from public.quiz
      where chapitre_id = v_quiz.chapitre_id and type = 'chapitre' and est_note
        and numero = v_quiz.numero - 1 limit 1;
    if v_chapitre_precedent_id is not null then
      select max(note) into v_meilleure_note from public.tentatives
        where user_id = auth.uid() and quiz_id = v_chapitre_precedent_id and statut = 'terminee';
      if coalesce(v_meilleure_note, 0) < 12 then raise exception 'quiz_verrouille'; end if;
    end if;
  end if;

  if v_tentative is null then
    -- Evite deux creations simultanees pour le meme utilisateur et devoir.
    perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text || ':' || p_quiz_id::text, 0));
    select * into v_tentative from public.tentatives
    where user_id = auth.uid() and quiz_id = p_quiz_id and statut = 'en_cours'
      and (date_fin_theorique is null or date_fin_theorique > now())
    order by created_at desc limit 1;
    if v_tentative is null
       and v_quiz.type = 'devoir'
       and not exists (
         select 1 from public.quiz q
         where q.id = p_quiz_id and q.published
       ) then
      raise exception 'quiz_introuvable';
    end if;
  end if;

  if v_tentative is null then
    select count(*) into v_nb_tentatives from public.tentatives
      where user_id = auth.uid() and quiz_id = p_quiz_id;
    v_numero_tentative := v_nb_tentatives + 1;
    if v_quiz.type = 'devoir' then
      if v_numero_tentative > 3 then raise exception 'quota_tentatives_atteint'; end if;
      v_facteur := case v_numero_tentative when 1 then 1.0 when 2 then 0.66 else 0.33 end;
      v_duree := coalesce(v_quiz.duree_sec, 2700) * v_facteur;
    else
      v_duree := null;
    end if;

    insert into public.tentatives (user_id, quiz_id, numero_tentative, statut, date_fin_theorique)
    values (
      auth.uid(), p_quiz_id, v_numero_tentative, 'en_cours',
      case when v_duree is not null then now() + (v_duree || ' seconds')::interval else null end
    ) returning * into v_tentative;
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id, 'ordre', q.ordre, 'enonce', q.enonce, 'type', q.type,
    'choix', q.choix, 'points', q.points, 'image_url', q.image_url,
    'image_alt', q.image_alt
  ) order by q.ordre) into v_questions
  from public.questions q where q.quiz_id = p_quiz_id;

  return jsonb_build_object(
    'tentative_id', v_tentative.id,
    'numero_tentative', v_tentative.numero_tentative,
    'date_fin_theorique', v_tentative.date_fin_theorique,
    'quiz', jsonb_build_object(
      'id', v_quiz.id, 'titre', v_quiz.titre, 'type', v_quiz.type,
      'duree_sec', v_quiz.duree_sec, 'est_note', true, 'palier', null
    ),
    'questions', coalesce(v_questions, '[]'::jsonb)
  );
end;
$$;

-- Le resultat conserve l'ID et le contenu historiques, mais indique aussi la
-- version courante a utiliser pour l'action "Rejouer".
create or replace function public.get_tentative_resultat(p_tentative_id uuid)
returns jsonb language plpgsql security definer set search_path = pg_catalog, public as $$
declare
  v_tentative record;
  v_quiz record;
  v_corrections jsonb;
  v_current_quiz_id uuid;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select * into v_tentative from public.tentatives where id = p_tentative_id;
  if v_tentative is null or (v_tentative.user_id <> auth.uid() and not public.is_admin()) then
    raise exception 'tentative_introuvable';
  end if;
  if v_tentative.statut <> 'terminee' then raise exception 'tentative_non_terminee'; end if;

  select * into v_quiz from public.quiz where id = v_tentative.quiz_id;
  if not coalesce(v_quiz.est_note, true) then raise exception 'utiliser_entrainement_rpc'; end if;

  if v_quiz.type = 'devoir' and v_quiz.devoir_id is not null then
    select id into v_current_quiz_id
    from public.quiz
    where devoir_id = v_quiz.devoir_id and type = 'devoir' and published
    limit 1;
  else
    v_current_quiz_id := v_quiz.id;
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id, 'ordre', q.ordre, 'enonce', q.enonce, 'choix', q.choix,
    'image_url', q.image_url, 'image_alt', q.image_alt,
    'bonnes_reponses', q.bonnes_reponses, 'explication', q.explication,
    'choix_selectionnes', r.choix_selectionnes, 'correcte', coalesce(r.correcte, false)
  ) order by q.ordre) into v_corrections
  from public.questions q
  left join public.reponses r on r.question_id = q.id and r.tentative_id = p_tentative_id
  where q.quiz_id = v_tentative.quiz_id;

  return jsonb_build_object(
    'note', v_tentative.note,
    'temps_pris_sec', v_tentative.temps_pris_sec,
    'numero_tentative', v_tentative.numero_tentative,
    'quiz', jsonb_build_object(
      'id', v_quiz.id,
      'current_quiz_id', v_current_quiz_id,
      'titre', v_quiz.titre,
      'type', v_quiz.type,
      'version', v_quiz.version_devoir
    ),
    'questions', coalesce(v_corrections, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.proteger_devoir_editorial() from public, anon, authenticated;
revoke all on function public.proteger_version_devoir() from public, anon, authenticated;
revoke all on function public.proteger_question_devoir() from public, anon, authenticated;
revoke all on function public.valider_version_devoir(uuid) from public, anon, authenticated;

revoke all on function public.lister_devoirs_admin_v1(uuid, uuid, uuid) from public, anon;
revoke all on function public.charger_devoir_admin_v1(uuid, uuid) from public, anon;
revoke all on function public.preparer_brouillon_devoir_admin_v1(uuid, uuid, uuid, int, text, int) from public, anon;
revoke all on function public.enregistrer_brouillon_devoir_admin_v1(uuid, uuid, jsonb, bigint) from public, anon;
revoke all on function public.publier_devoir_admin_v1(uuid, uuid, uuid, bigint) from public, anon;

grant execute on function public.lister_devoirs_admin_v1(uuid, uuid, uuid) to authenticated;
grant execute on function public.charger_devoir_admin_v1(uuid, uuid) to authenticated;
grant execute on function public.preparer_brouillon_devoir_admin_v1(uuid, uuid, uuid, int, text, int) to authenticated;
grant execute on function public.enregistrer_brouillon_devoir_admin_v1(uuid, uuid, jsonb, bigint) to authenticated;
grant execute on function public.publier_devoir_admin_v1(uuid, uuid, uuid, bigint) to authenticated;

revoke all on function public.start_tentative(uuid) from public, anon;
grant execute on function public.start_tentative(uuid) to authenticated;
revoke all on function public.get_tentative_resultat(uuid) from public, anon;
grant execute on function public.get_tentative_resultat(uuid) to authenticated;

notify pgrst, 'reload schema';
commit;
