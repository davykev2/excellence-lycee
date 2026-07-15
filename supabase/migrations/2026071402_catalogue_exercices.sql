-- ============================================================================
-- Catalogue d'exercices : clés stables, provenance et import JSON idempotent
-- À exécuter avant les migrations de lots de contenu.
-- ============================================================================

begin;

-- Clés métier et métadonnées éditoriales.
alter table public.chapitres add column if not exists code text;
alter table public.quiz add column if not exists code text;
alter table public.quiz add column if not exists palier text;
alter table public.questions add column if not exists code text;
alter table public.questions add column if not exists difficulte int;
alter table public.questions add column if not exists origine text;
alter table public.questions add column if not exists licence_code text;
alter table public.questions add column if not exists content_hash text;
alter table public.questions add column if not exists image_alt text;
alter table public.questions add column if not exists updated_at timestamptz not null default now();

create unique index if not exists uniq_chapitres_code
  on public.chapitres(code) where code is not null;
create unique index if not exists uniq_quiz_code
  on public.quiz(code) where code is not null;
create unique index if not exists uniq_questions_code
  on public.questions(code) where code is not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'quiz_palier_check') then
    alter table public.quiz add constraint quiz_palier_check
      check (palier is null or palier in ('entrainement', 'maitrise', 'concours'));
  end if;
  if not exists (select 1 from pg_constraint where conname = 'questions_difficulte_check') then
    alter table public.questions add constraint questions_difficulte_check
      check (difficulte is null or difficulte between 1 and 3);
  end if;
  if not exists (select 1 from pg_constraint where conname = 'questions_origine_check') then
    alter table public.questions add constraint questions_origine_check
      check (origine is null or origine in ('originale', 'adaptee', 'citation'));
  end if;
end;
$$;

drop trigger if exists trg_questions_updated_at on public.questions;
create trigger trg_questions_updated_at before update on public.questions
  for each row execute function public.set_updated_at();

-- Sources de référence. Ces tables ne sont jamais exposées aux élèves.
create table if not exists public.sources_contenu (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  titre text not null,
  type text not null check (type in ('pdf', 'web', 'livre', 'image', 'autre')),
  auteur_organisme text,
  url text,
  licence_code text,
  licence_url text,
  attribution text,
  droits_statut text not null check (
    droits_statut in ('open', 'public_domain', 'permission', 'reference_only', 'unknown')
  ),
  storage_path text,
  sha256 text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.question_sources (
  question_id uuid not null references public.questions(id) on delete cascade,
  source_id uuid not null references public.sources_contenu(id) on delete cascade,
  role text not null check (role in ('alignement', 'adaptation', 'citation', 'image')),
  locator text,
  created_at timestamptz not null default now(),
  primary key (question_id, source_id, role)
);

create table if not exists public.lots_contenu (
  code text primary key,
  schema_version int not null,
  content_hash text not null,
  cible jsonb not null,
  source_id uuid references public.sources_contenu(id) on delete set null,
  quiz_count int not null,
  question_count int not null,
  statut text not null check (statut in ('brouillon', 'publie')),
  manifeste jsonb not null,
  applied_at timestamptz not null default now()
);

drop trigger if exists trg_sources_contenu_updated_at on public.sources_contenu;
create trigger trg_sources_contenu_updated_at before update on public.sources_contenu
  for each row execute function public.set_updated_at();

alter table public.sources_contenu enable row level security;
alter table public.question_sources enable row level security;
alter table public.lots_contenu enable row level security;

drop policy if exists "sources_contenu_admin" on public.sources_contenu;
create policy "sources_contenu_admin" on public.sources_contenu
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "question_sources_admin" on public.question_sources;
create policy "question_sources_admin" on public.question_sources
  for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists "lots_contenu_admin" on public.lots_contenu;
create policy "lots_contenu_admin" on public.lots_contenu
  for all using (public.is_admin()) with check (public.is_admin());

revoke all on public.sources_contenu, public.question_sources, public.lots_contenu from anon;
grant select, insert, update, delete on public.sources_contenu, public.question_sources, public.lots_contenu to authenticated;

-- Import transactionnel d'un lot validé. Les codes sont les identifiants stables.
-- Un contenu déjà tenté devient immuable : tout changement de hash est refusé.
create or replace function public.importer_lot_exercices(p_lot jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_target jsonb := p_lot -> 'target';
  v_source jsonb := p_lot -> 'source';
  v_chapitre public.chapitres%rowtype;
  v_source_id uuid;
  v_quiz_json jsonb;
  v_question_json jsonb;
  v_quiz public.quiz%rowtype;
  v_question public.questions%rowtype;
  v_hash text;
  v_quiz_count int := 0;
  v_question_count int := 0;
  v_expected_questions int;
  v_actual_questions int;
  v_is_admin boolean := false;
begin
  -- Appel autorisé depuis le SQL Editor/migrations ou par un admin authentifié.
  if auth.uid() is not null then
    select public.is_admin() into v_is_admin;
    if not coalesce(v_is_admin, false) then raise exception 'admin_required'; end if;
  elsif session_user not in ('postgres', 'supabase_admin') and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'admin_required';
  end if;

  if coalesce((p_lot ->> 'schema_version')::int, 0) <> 1 then
    raise exception 'schema_version_invalide';
  end if;
  if coalesce(p_lot ->> 'status', '') <> 'reviewed' then
    raise exception 'lot_non_valide';
  end if;
  if jsonb_typeof(p_lot -> 'quizzes') <> 'array' or jsonb_array_length(p_lot -> 'quizzes') <> 3 then
    raise exception 'trois_quiz_requis';
  end if;
  if coalesce(v_source ->> 'droits_statut', '') not in ('open', 'public_domain', 'permission', 'reference_only') then
    raise exception 'droits_source_non_valides';
  end if;

  select c.* into v_chapitre
  from public.chapitres c
  join public.matieres m on m.id = c.matiere_id
  join public.series s on s.id = c.serie_id
  join public.niveaux n on n.id = s.niveau_id
  where c.id = (v_target ->> 'chapitre_id')::uuid
    and n.nom = v_target ->> 'niveau'
    and s.nom = v_target ->> 'serie'
    and m.slug = v_target ->> 'matiere_slug'
    and c.ordre = (v_target ->> 'chapitre_ordre')::int;

  if v_chapitre.id is null then raise exception 'cible_chapitre_invalide'; end if;
  if v_chapitre.code is not null and v_chapitre.code <> v_target ->> 'chapitre_code' then
    raise exception 'code_chapitre_incompatible';
  end if;
  update public.chapitres set code = v_target ->> 'chapitre_code' where id = v_chapitre.id;

  insert into public.sources_contenu (
    code, titre, type, auteur_organisme, url, licence_code, licence_url,
    attribution, droits_statut, storage_path, sha256, notes
  ) values (
    v_source ->> 'code', v_source ->> 'titre', v_source ->> 'type',
    v_source ->> 'auteur_organisme', nullif(v_source ->> 'url', ''),
    nullif(v_source ->> 'licence_code', ''), nullif(v_source ->> 'licence_url', ''),
    nullif(v_source ->> 'attribution', ''), v_source ->> 'droits_statut',
    v_source ->> 'storage_path', lower(v_source ->> 'sha256'), v_source ->> 'notes'
  )
  on conflict (code) do update set
    titre = excluded.titre,
    type = excluded.type,
    auteur_organisme = excluded.auteur_organisme,
    url = excluded.url,
    licence_code = excluded.licence_code,
    licence_url = excluded.licence_url,
    attribution = excluded.attribution,
    droits_statut = excluded.droits_statut,
    storage_path = excluded.storage_path,
    sha256 = excluded.sha256,
    notes = excluded.notes
  returning id into v_source_id;

  for v_quiz_json in select value from jsonb_array_elements(p_lot -> 'quizzes') loop
    v_quiz_count := v_quiz_count + 1;
    if (v_quiz_json ->> 'numero')::int <> v_quiz_count then
      raise exception 'numerotation_quiz_invalide';
    end if;
    if coalesce(v_quiz_json ->> 'palier', '') not in ('entrainement', 'maitrise', 'concours') then
      raise exception 'palier_quiz_invalide';
    end if;
    if jsonb_typeof(v_quiz_json -> 'questions') <> 'array'
       or jsonb_array_length(v_quiz_json -> 'questions') <> 5 then
      raise exception 'cinq_questions_requises: %', v_quiz_json ->> 'code';
    end if;

    select * into v_quiz from public.quiz where code = v_quiz_json ->> 'code';
    if v_quiz.id is null then
      if exists (
        select 1 from public.quiz
        where chapitre_id = v_chapitre.id
          and type = 'chapitre'
          and numero = (v_quiz_json ->> 'numero')::int
      ) then
        raise exception 'numero_quiz_deja_occupe: %', v_quiz_json ->> 'numero';
      end if;
      insert into public.quiz (
        chapitre_id, matiere_id, serie_id, type, titre, numero,
        published, code, palier
      ) values (
        v_chapitre.id, v_chapitre.matiere_id, v_chapitre.serie_id, 'chapitre',
        v_quiz_json ->> 'titre', (v_quiz_json ->> 'numero')::int,
        false, v_quiz_json ->> 'code', v_quiz_json ->> 'palier'
      ) returning * into v_quiz;
    else
      if v_quiz.chapitre_id <> v_chapitre.id
         or v_quiz.type <> 'chapitre'
         or v_quiz.numero <> (v_quiz_json ->> 'numero')::int then
        raise exception 'code_quiz_cible_incompatible: %', v_quiz_json ->> 'code';
      end if;
      update public.quiz set
        titre = v_quiz_json ->> 'titre',
        matiere_id = v_chapitre.matiere_id,
        serie_id = v_chapitre.serie_id,
        palier = v_quiz_json ->> 'palier'
      where id = v_quiz.id
      returning * into v_quiz;
    end if;

    v_expected_questions := jsonb_array_length(v_quiz_json -> 'questions');
    for v_question_json in select value from jsonb_array_elements(v_quiz_json -> 'questions') loop
      v_question_count := v_question_count + 1;
      if coalesce(v_question_json ->> 'type', '') not in ('qcm', 'texte') then
        raise exception 'type_question_invalide: %', v_question_json ->> 'code';
      end if;
      if (v_question_json ->> 'difficulte')::int not between 1 and 3 then
        raise exception 'difficulte_invalide: %', v_question_json ->> 'code';
      end if;
      if v_question_json ->> 'type' = 'qcm' then
        if jsonb_typeof(v_question_json -> 'choix') <> 'array'
           or not (v_question_json -> 'choix') @> jsonb_build_array(v_question_json -> 'bonnes_reponses') then
          raise exception 'reponse_qcm_invalide: %', v_question_json ->> 'code';
        end if;
      elsif jsonb_typeof(v_question_json -> 'bonnes_reponses') <> 'array' then
        raise exception 'reponses_texte_invalides: %', v_question_json ->> 'code';
      end if;

      v_hash := md5(v_question_json::text);
      select * into v_question from public.questions where code = v_question_json ->> 'code';
      if v_question.id is null then
        if exists (
          select 1 from public.questions
          where quiz_id = v_quiz.id and ordre = (v_question_json ->> 'ordre')::int
        ) then
          raise exception 'ordre_question_deja_occupe: %', v_question_json ->> 'code';
        end if;
        insert into public.questions (
          quiz_id, ordre, enonce, type, choix, bonnes_reponses, points,
          image_url, explication, code, difficulte, origine, licence_code,
          content_hash, image_alt
        ) values (
          v_quiz.id, (v_question_json ->> 'ordre')::int,
          v_question_json ->> 'enonce', v_question_json ->> 'type',
          v_question_json -> 'choix', v_question_json -> 'bonnes_reponses',
          (v_question_json ->> 'points')::int, nullif(v_question_json ->> 'image_url', ''),
          v_question_json ->> 'explication', v_question_json ->> 'code',
          (v_question_json ->> 'difficulte')::int, v_question_json ->> 'origine',
          v_question_json ->> 'licence_code', v_hash,
          nullif(v_question_json ->> 'image_alt', '')
        ) returning * into v_question;
      else
        if v_question.quiz_id <> v_quiz.id then
          raise exception 'code_question_cible_incompatible: %', v_question_json ->> 'code';
        end if;
        if v_question.content_hash is distinct from v_hash
           and exists (select 1 from public.tentatives where quiz_id = v_quiz.id) then
          raise exception 'quiz_immuable_apres_tentative: %', v_quiz.code;
        end if;
        update public.questions set
          ordre = (v_question_json ->> 'ordre')::int,
          enonce = v_question_json ->> 'enonce',
          type = v_question_json ->> 'type',
          choix = v_question_json -> 'choix',
          bonnes_reponses = v_question_json -> 'bonnes_reponses',
          points = (v_question_json ->> 'points')::int,
          image_url = nullif(v_question_json ->> 'image_url', ''),
          explication = v_question_json ->> 'explication',
          difficulte = (v_question_json ->> 'difficulte')::int,
          origine = v_question_json ->> 'origine',
          licence_code = v_question_json ->> 'licence_code',
          content_hash = v_hash,
          image_alt = nullif(v_question_json ->> 'image_alt', '')
        where id = v_question.id
        returning * into v_question;
      end if;

      insert into public.question_sources(question_id, source_id, role, locator)
      values (v_question.id, v_source_id, 'alignement', 'Leçon 1')
      on conflict (question_id, source_id, role) do update set locator = excluded.locator;
    end loop;

    select count(*) into v_actual_questions from public.questions where quiz_id = v_quiz.id;
    if v_actual_questions <> v_expected_questions then
      raise exception 'nombre_questions_inattendu: % (% au lieu de %)',
        v_quiz.code, v_actual_questions, v_expected_questions;
    end if;
    update public.quiz set published = true where id = v_quiz.id;
  end loop;

  insert into public.lots_contenu (
    code, schema_version, content_hash, cible, source_id,
    quiz_count, question_count, statut, manifeste, applied_at
  ) values (
    p_lot ->> 'batch_code', (p_lot ->> 'schema_version')::int,
    md5(p_lot::text), v_target, v_source_id,
    v_quiz_count, v_question_count, 'publie', p_lot, now()
  )
  on conflict (code) do update set
    schema_version = excluded.schema_version,
    content_hash = excluded.content_hash,
    cible = excluded.cible,
    source_id = excluded.source_id,
    quiz_count = excluded.quiz_count,
    question_count = excluded.question_count,
    statut = excluded.statut,
    manifeste = excluded.manifeste,
    applied_at = excluded.applied_at;

  return jsonb_build_object(
    'ok', true,
    'batch_code', p_lot ->> 'batch_code',
    'chapitre_id', v_chapitre.id,
    'quiz_count', v_quiz_count,
    'question_count', v_question_count
  );
end;
$$;

revoke all on function public.importer_lot_exercices(jsonb) from public, anon;
grant execute on function public.importer_lot_exercices(jsonb) to authenticated, service_role;

commit;
