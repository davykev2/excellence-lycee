-- ============================================================================
-- Exercices guides v2
--
-- Un niveau contient exactement trois exercices. Chaque exercice regroupe au
-- moins deux sous-questions affichees ensemble, sans QCM ni champ de reponse.
-- L'eleve declare l'exercice termine avant de recevoir sa correction complete.
-- Cette progression est volontairement separee des tentatives, notes, XP et
-- badges du moteur de quiz.
-- ============================================================================

begin;

-- --------------------------------------------------------------------------
-- 1. Modele de contenu et progression
-- --------------------------------------------------------------------------

create table if not exists public.packs_entrainement (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  palier text not null check (
    palier in ('entrainement', 'maitrise', 'concours')
  ),
  code text not null unique check (btrim(code) <> ''),
  version int not null default 1 check (version > 0),
  titre text not null check (btrim(titre) <> ''),
  content_hash text not null check (btrim(content_hash) <> ''),
  source_id uuid references public.sources_contenu(id) on delete set null,
  source_locator text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapitre_id, palier, version)
);

-- Une seule version est active a la fois pour une lecon et un palier.
create unique index if not exists uniq_packs_entrainement_actif
  on public.packs_entrainement(chapitre_id, palier)
  where published;

create index if not exists idx_packs_entrainement_chapitre
  on public.packs_entrainement(chapitre_id, palier, published);

create table if not exists public.exercices_entrainement (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.packs_entrainement(id) on delete cascade,
  numero int not null check (numero between 1 and 3),
  code text not null unique check (btrim(code) <> ''),
  titre text not null check (btrim(titre) <> ''),
  consigne text not null check (btrim(consigne) <> ''),
  content_hash text not null check (btrim(content_hash) <> ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pack_id, numero)
);

create index if not exists idx_exercices_entrainement_pack
  on public.exercices_entrainement(pack_id, numero);

create table if not exists public.questions_exercice (
  id uuid primary key default gen_random_uuid(),
  exercice_id uuid not null references public.exercices_entrainement(id) on delete cascade,
  ordre int not null check (ordre > 0),
  enonce_md text not null check (btrim(enonce_md) <> ''),
  correction_md text not null check (btrim(correction_md) <> ''),
  image_url text,
  image_alt text,
  content_hash text not null check (btrim(content_hash) <> ''),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (exercice_id, ordre)
);

create index if not exists idx_questions_exercice_exercice
  on public.questions_exercice(exercice_id, ordre);

create table if not exists public.exercices_termines (
  user_id uuid not null references public.profiles(id) on delete cascade,
  exercice_id uuid not null references public.exercices_entrainement(id),
  termine_at timestamptz not null default now(),
  primary key (user_id, exercice_id)
);

create index if not exists idx_exercices_termines_exercice
  on public.exercices_termines(exercice_id, user_id);

drop trigger if exists trg_packs_entrainement_updated_at
  on public.packs_entrainement;
create trigger trg_packs_entrainement_updated_at
  before update on public.packs_entrainement
  for each row execute function public.set_updated_at();

drop trigger if exists trg_exercices_entrainement_updated_at
  on public.exercices_entrainement;
create trigger trg_exercices_entrainement_updated_at
  before update on public.exercices_entrainement
  for each row execute function public.set_updated_at();

drop trigger if exists trg_questions_exercice_updated_at
  on public.questions_exercice;
create trigger trg_questions_exercice_updated_at
  before update on public.questions_exercice
  for each row execute function public.set_updated_at();

-- Un pack ne devient visible que s'il contient exactement trois exercices,
-- chacun avec au moins deux sous-questions et une correction complete.
create or replace function public.verifier_pack_entrainement_publie()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_nb_exercices int;
begin
  if not new.published then
    return new;
  end if;

  select count(*)::int into v_nb_exercices
  from public.exercices_entrainement e
  where e.pack_id = new.id;

  if v_nb_exercices <> 3 then
    raise exception 'trois_exercices_requis';
  end if;

  if exists (
    select 1
    from public.exercices_entrainement e
    left join public.questions_exercice q on q.exercice_id = e.id
    where e.pack_id = new.id
    group by e.id
    having count(q.id) < 2
       or count(q.id) filter (
         where nullif(btrim(coalesce(q.correction_md, '')), '') is null
       ) > 0
  ) then
    raise exception 'exercice_incomplet';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_verifier_pack_entrainement_publie
  on public.packs_entrainement;
create trigger trg_verifier_pack_entrainement_publie
  before insert or update of published on public.packs_entrainement
  for each row execute function public.verifier_pack_entrainement_publie();

-- Une fois qu'un exercice du pack a ete termine, le contenu de toute cette
-- version devient immuable. Une nouvelle version doit alors etre importee.
create or replace function public.proteger_pack_entrainement_valide()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_pack_id uuid := old.id;
  v_a_validations boolean;
begin
  select exists (
    select 1
    from public.exercices_entrainement e
    join public.exercices_termines et on et.exercice_id = e.id
    where e.pack_id = v_pack_id
  ) into v_a_validations;

  if not v_a_validations then
    if tg_op = 'DELETE' then
      return old;
    end if;
    return new;
  end if;

  if tg_op = 'DELETE' then
    raise exception 'pack_immuable_apres_validation';
  end if;

  if new.chapitre_id is distinct from old.chapitre_id
     or new.palier is distinct from old.palier
     or new.code is distinct from old.code
     or new.version is distinct from old.version
     or new.titre is distinct from old.titre
     or new.content_hash is distinct from old.content_hash then
    raise exception 'pack_immuable_apres_validation';
  end if;

  -- L'archivage et les corrections de provenance restent autorises.
  return new;
end;
$$;

drop trigger if exists trg_proteger_pack_entrainement_valide
  on public.packs_entrainement;
create trigger trg_proteger_pack_entrainement_valide
  before update or delete on public.packs_entrainement
  for each row execute function public.proteger_pack_entrainement_valide();

-- Les enfants d'un pack publie doivent d'abord etre depublies. Meme depublie,
-- un pack deja valide ne peut plus etre reecrit.
create or replace function public.proteger_contenu_entrainement()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_pack_id uuid;
  v_pack_publie boolean;
  v_a_validations boolean;
begin
  if tg_table_name = 'exercices_entrainement' then
    if tg_op = 'UPDATE' and new.pack_id is distinct from old.pack_id then
      raise exception 'cible_exercice_immutable';
    end if;
    v_pack_id := case when tg_op = 'INSERT' then new.pack_id else old.pack_id end;
  else
    if tg_op = 'UPDATE' and new.exercice_id is distinct from old.exercice_id then
      raise exception 'cible_question_immutable';
    end if;
    select e.pack_id into v_pack_id
    from public.exercices_entrainement e
    where e.id = case
      when tg_op = 'INSERT' then new.exercice_id
      else old.exercice_id
    end;
  end if;

  select p.published into v_pack_publie
  from public.packs_entrainement p
  where p.id = v_pack_id;

  if coalesce(v_pack_publie, false) then
    raise exception 'depublier_pack_avant_modification';
  end if;

  select exists (
    select 1
    from public.exercices_entrainement e
    join public.exercices_termines et on et.exercice_id = e.id
    where e.pack_id = v_pack_id
  ) into v_a_validations;

  if v_a_validations then
    raise exception 'pack_immuable_apres_validation';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_exercices_entrainement
  on public.exercices_entrainement;
create trigger trg_proteger_exercices_entrainement
  before insert or update or delete on public.exercices_entrainement
  for each row execute function public.proteger_contenu_entrainement();

drop trigger if exists trg_proteger_questions_exercice
  on public.questions_exercice;
create trigger trg_proteger_questions_exercice
  before insert or update or delete on public.questions_exercice
  for each row execute function public.proteger_contenu_entrainement();

revoke all on function public.verifier_pack_entrainement_publie()
  from public, anon, authenticated;
revoke all on function public.proteger_pack_entrainement_valide()
  from public, anon, authenticated;
revoke all on function public.proteger_contenu_entrainement()
  from public, anon, authenticated;

-- --------------------------------------------------------------------------
-- 2. RLS : les corrections ne sont jamais lues directement par un eleve
-- --------------------------------------------------------------------------

alter table public.packs_entrainement enable row level security;
alter table public.exercices_entrainement enable row level security;
alter table public.questions_exercice enable row level security;
alter table public.exercices_termines enable row level security;

drop policy if exists "packs_entrainement_admin" on public.packs_entrainement;
create policy "packs_entrainement_admin" on public.packs_entrainement
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "exercices_entrainement_admin" on public.exercices_entrainement;
create policy "exercices_entrainement_admin" on public.exercices_entrainement
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "questions_exercice_admin" on public.questions_exercice;
create policy "questions_exercice_admin" on public.questions_exercice
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "exercices_termines_select_own" on public.exercices_termines;
create policy "exercices_termines_select_own" on public.exercices_termines
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "exercices_termines_admin" on public.exercices_termines;
create policy "exercices_termines_admin" on public.exercices_termines
  for all using (public.is_admin()) with check (public.is_admin());

revoke all on public.packs_entrainement,
  public.exercices_entrainement,
  public.questions_exercice,
  public.exercices_termines
  from anon;

grant select, insert, update, delete on public.packs_entrainement,
  public.exercices_entrainement,
  public.questions_exercice,
  public.exercices_termines
  to authenticated;

-- --------------------------------------------------------------------------
-- 3. Lecture d'un palier : toutes les questions d'un exercice sont groupees
-- --------------------------------------------------------------------------

create or replace function public.get_exercices_entrainement_v2(
  p_chapitre_id uuid,
  p_palier text
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_chapitre public.chapitres%rowtype;
  v_pack public.packs_entrainement%rowtype;
  v_exercices jsonb;
  v_limite_decouverte int;
  v_total int;
  v_termines int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  if p_palier is null
     or p_palier not in ('entrainement', 'maitrise', 'concours') then
    raise exception 'palier_invalide';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile.id is null then
    raise exception 'profil_introuvable';
  end if;

  select * into v_chapitre
  from public.chapitres
  where id = p_chapitre_id and published = true;

  if v_chapitre.id is null then
    raise exception 'chapitre_introuvable';
  end if;

  if not public.is_admin()
     and v_chapitre.serie_id is not null
     and v_chapitre.serie_id is distinct from v_profile.serie_id then
    raise exception 'contenu_non_autorise';
  end if;

  if not public.is_admin() and not coalesce(v_profile.approuve, false) then
    select coalesce((valeur #>> '{}')::int, 1) into v_limite_decouverte
    from public.app_settings
    where cle = 'contenu_decouverte_chapitres';

    if coalesce(v_chapitre.ordre, 999) > coalesce(v_limite_decouverte, 1) then
      raise exception 'contenu_reserve_membres';
    end if;
  end if;

  select * into v_pack
  from public.packs_entrainement
  where chapitre_id = p_chapitre_id
    and palier = p_palier
    and published = true
  limit 1;

  if v_pack.id is null then
    raise exception 'entrainement_introuvable';
  end if;

  select
    coalesce(jsonb_agg(
      jsonb_build_object(
        'id', e.id,
        'numero', e.numero,
        'code', e.code,
        'titre', e.titre,
        'consigne', e.consigne,
        'questions', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', q.id,
              'ordre', q.ordre,
              'enonce_md', q.enonce_md,
              'image_url', q.image_url,
              'image_alt', q.image_alt,
              -- La cle existe toujours pour un contrat frontend stable, mais
              -- sa valeur reste nulle tant que l'exercice n'est pas termine.
              'correction_md', case
                when et.user_id is null then null
                else q.correction_md
              end
            ) order by q.ordre
          )
          from public.questions_exercice q
          where q.exercice_id = e.id
        ), '[]'::jsonb),
        'termine', et.user_id is not null,
        'termine_at', et.termine_at
      ) order by e.numero
    ), '[]'::jsonb),
    count(e.id)::int,
    count(et.exercice_id)::int
  into v_exercices, v_total, v_termines
  from public.exercices_entrainement e
  left join public.exercices_termines et
    on et.exercice_id = e.id
   and et.user_id = auth.uid()
  where e.pack_id = v_pack.id;

  return jsonb_build_object(
    'chapitre', jsonb_build_object(
      'id', v_chapitre.id,
      'titre', v_chapitre.titre
    ),
    'palier', v_pack.palier,
    'libelle', case v_pack.palier
      when 'entrainement' then 'Facile'
      when 'maitrise' then 'Moyen'
      when 'concours' then 'Difficile'
    end,
    'titre', v_pack.titre,
    'exercices_total', v_total,
    'exercices_termines', v_termines,
    'pourcentage', case
      when v_total = 0 then 0
      else round(100.0 * v_termines / v_total)::int
    end,
    'exercices', v_exercices
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 4. Validation d'un exercice entier et revelation atomique de la correction
-- --------------------------------------------------------------------------

create or replace function public.terminer_exercice_entrainement_v2(
  p_exercice_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_chapitre public.chapitres%rowtype;
  v_pack public.packs_entrainement%rowtype;
  v_exercice public.exercices_entrainement%rowtype;
  v_limite_decouverte int;
  v_insere boolean;
  v_termine_at timestamptz;
  v_correction jsonb;
  v_nb_questions int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile.id is null then
    raise exception 'profil_introuvable';
  end if;

  select e.*
  into v_exercice
  from public.exercices_entrainement e
  join public.packs_entrainement p on p.id = e.pack_id
  join public.chapitres c on c.id = p.chapitre_id
  where e.id = p_exercice_id
    and p.published = true
    and c.published = true;

  if v_exercice.id is null then
    raise exception 'exercice_introuvable';
  end if;

  select * into v_pack
  from public.packs_entrainement
  where id = v_exercice.pack_id;

  select * into v_chapitre
  from public.chapitres
  where id = v_pack.chapitre_id;

  if not public.is_admin()
     and v_chapitre.serie_id is not null
     and v_chapitre.serie_id is distinct from v_profile.serie_id then
    raise exception 'contenu_non_autorise';
  end if;

  if not public.is_admin() and not coalesce(v_profile.approuve, false) then
    select coalesce((valeur #>> '{}')::int, 1) into v_limite_decouverte
    from public.app_settings
    where cle = 'contenu_decouverte_chapitres';

    if coalesce(v_chapitre.ordre, 999) > coalesce(v_limite_decouverte, 1) then
      raise exception 'contenu_reserve_membres';
    end if;
  end if;

  select count(*)::int into v_nb_questions
  from public.questions_exercice
  where exercice_id = v_exercice.id;

  if v_nb_questions < 2 then
    raise exception 'exercice_incomplet';
  end if;

  v_insere := false;
  insert into public.exercices_termines(user_id, exercice_id)
  values (auth.uid(), v_exercice.id)
  on conflict (user_id, exercice_id) do nothing
  returning true into v_insere;

  v_insere := coalesce(v_insere, false);

  select termine_at into v_termine_at
  from public.exercices_termines
  where user_id = auth.uid() and exercice_id = v_exercice.id;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'question_id', q.id,
      'ordre', q.ordre,
      'enonce_md', q.enonce_md,
      'correction_md', q.correction_md,
      'image_url', q.image_url,
      'image_alt', q.image_alt
    ) order by q.ordre
  ), '[]'::jsonb)
  into v_correction
  from public.questions_exercice q
  where q.exercice_id = v_exercice.id;

  return jsonb_build_object(
    'exercice_id', v_exercice.id,
    'termine', true,
    'termine_at', v_termine_at,
    'deja_termine', not v_insere,
    'corrections', v_correction,
    -- Alias temporaire pour les consommateurs experimentaux deja branches.
    'correction', v_correction
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 5. Progression par niveau dans une lecon
-- --------------------------------------------------------------------------

create or replace function public.get_niveaux_exercices_chapitre_v2(
  p_chapitre_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_chapitre public.chapitres%rowtype;
  v_niveaux jsonb;
  v_total int;
  v_termines int;
  v_limite_decouverte int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile.id is null then
    raise exception 'profil_introuvable';
  end if;

  select * into v_chapitre
  from public.chapitres
  where id = p_chapitre_id and published = true;

  if v_chapitre.id is null then
    raise exception 'chapitre_introuvable';
  end if;

  if not public.is_admin()
     and v_chapitre.serie_id is not null
     and v_chapitre.serie_id is distinct from v_profile.serie_id then
    raise exception 'contenu_non_autorise';
  end if;

  if not public.is_admin() and not coalesce(v_profile.approuve, false) then
    select coalesce((valeur #>> '{}')::int, 1) into v_limite_decouverte
    from public.app_settings
    where cle = 'contenu_decouverte_chapitres';

    if coalesce(v_chapitre.ordre, 999) > coalesce(v_limite_decouverte, 1) then
      raise exception 'contenu_reserve_membres';
    end if;
  end if;

  with stats as (
    select
      p.id,
      p.palier,
      p.titre,
      count(e.id)::int as total,
      count(et.exercice_id)::int as termines
    from public.packs_entrainement p
    join public.exercices_entrainement e on e.pack_id = p.id
    left join public.exercices_termines et
      on et.exercice_id = e.id
     and et.user_id = auth.uid()
    where p.chapitre_id = p_chapitre_id
      and p.published = true
    group by p.id, p.palier, p.titre
  )
  select
    coalesce(jsonb_agg(
      jsonb_build_object(
        'palier', s.palier,
        'libelle', case s.palier
          when 'entrainement' then 'Facile'
          when 'maitrise' then 'Moyen'
          when 'concours' then 'Difficile'
        end,
        'titre', s.titre,
        'exercices_total', s.total,
        'exercices_termines', s.termines,
        -- Alias conserve pour simplifier le basculement du frontend actuel.
        'exercices_valides', s.termines,
        'pourcentage', case
          when s.total = 0 then 0
          else round(100.0 * s.termines / s.total)::int
        end
      ) order by case s.palier
        when 'entrainement' then 1
        when 'maitrise' then 2
        when 'concours' then 3
        else 4
      end
    ), '[]'::jsonb),
    coalesce(sum(s.total), 0)::int,
    coalesce(sum(s.termines), 0)::int
  into v_niveaux, v_total, v_termines
  from stats s;

  return jsonb_build_object(
    'chapitre', jsonb_build_object(
      'id', v_chapitre.id,
      'titre', v_chapitre.titre
    ),
    'exercices_total', v_total,
    'exercices_termines', v_termines,
    'exercices_valides', v_termines,
    'pourcentage', case
      when v_total = 0 then 0
      else round(100.0 * v_termines / v_total)::int
    end,
    'niveaux', v_niveaux
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 6. Progression lecon par lecon pour les cartes d'une matiere
-- --------------------------------------------------------------------------

create or replace function public.get_progression_exercices_matiere_v2(
  p_matiere_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile public.profiles%rowtype;
  v_matiere public.matieres%rowtype;
  v_chapitres jsonb;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile.id is null then
    raise exception 'profil_introuvable';
  end if;

  select * into v_matiere
  from public.matieres
  where id = p_matiere_id;

  if v_matiere.id is null then
    raise exception 'matiere_introuvable';
  end if;

  if not public.is_admin() and not exists (
    select 1
    from public.matieres_series ms
    where ms.matiere_id = p_matiere_id
      and ms.serie_id = v_profile.serie_id
  ) then
    raise exception 'matiere_non_autorisee';
  end if;

  with stats as (
    select
      c.id,
      c.titre,
      c.ordre,
      count(e.id)::int as total,
      count(et.exercice_id)::int as termines
    from public.chapitres c
    left join public.packs_entrainement p
      on p.chapitre_id = c.id
     and p.published = true
    left join public.exercices_entrainement e on e.pack_id = p.id
    left join public.exercices_termines et
      on et.exercice_id = e.id
     and et.user_id = auth.uid()
    where c.matiere_id = p_matiere_id
      and c.published = true
      and (
        public.is_admin()
        or c.serie_id is null
        or c.serie_id = v_profile.serie_id
      )
    group by c.id, c.titre, c.ordre
  )
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'chapitre_id', s.id,
      'titre', s.titre,
      'ordre', s.ordre,
      'exercices_total', s.total,
      'exercices_termines', s.termines,
      'exercices_valides', s.termines,
      'pourcentage', case
        when s.total = 0 then 0
        else round(100.0 * s.termines / s.total)::int
      end
    ) order by s.ordre
  ), '[]'::jsonb)
  into v_chapitres
  from stats s;

  return jsonb_build_object(
    'matiere', jsonb_build_object(
      'id', v_matiere.id,
      'nom', v_matiere.nom,
      'slug', v_matiere.slug
    ),
    'chapitres', v_chapitres
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 7. Import JSON v2 transactionnel et idempotent
-- --------------------------------------------------------------------------

-- Contrat attendu :
-- {
--   "schema_version": 2,
--   "batch_code": "...",
--   "status": "reviewed",
--   "target": {
--     "chapitre_id": "uuid", "chapitre_code": "...", "niveau": "...",
--     "serie": "...", "matiere_slug": "...", "chapitre_ordre": 1
--   },
--   "source": { ..., "locator": "..." },
--   "levels": [
--     {
--       "palier": "entrainement", "libelle": "Facile", "titre": "...",
--       "exercises": [
--         {
--           "numero": 1, "code": "...", "titre": "...", "consigne": "...",
--           "questions": [
--             {
--               "ordre": 1, "enonce_md": "...", "correction_md": "...",
--               "image_url": null, "image_alt": null
--             }
--           ]
--         }
--       ]
--     }
--   ]
-- }
create or replace function public.importer_lot_exercices_v2(p_lot jsonb)
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
  v_level_json jsonb;
  v_exercice_json jsonb;
  v_question_json jsonb;
  v_pack public.packs_entrainement%rowtype;
  v_exercice public.exercices_entrainement%rowtype;
  v_question public.questions_exercice%rowtype;
  v_batch_code text;
  v_pack_code text;
  v_palier text;
  v_level_hash text;
  v_exercice_hash text;
  v_question_hash text;
  v_version int;
  v_pack_count int := 0;
  v_exercice_count int := 0;
  v_question_count int := 0;
  v_array_count int;
  v_distinct_count int;
  v_min_ordre int;
  v_max_ordre int;
  v_has_validations boolean;
  v_same_hash boolean;
  v_is_admin boolean := false;
begin
  -- SQL Editor, service role ou profil administrateur uniquement.
  if auth.uid() is not null then
    select public.is_admin() into v_is_admin;
    if not coalesce(v_is_admin, false) then
      raise exception 'admin_required';
    end if;
  elsif session_user not in ('postgres', 'supabase_admin')
        and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'admin_required';
  end if;

  if p_lot is null or jsonb_typeof(p_lot) <> 'object' then
    raise exception 'lot_invalide';
  end if;

  if coalesce((p_lot ->> 'schema_version')::int, 0) <> 2 then
    raise exception 'schema_version_invalide';
  end if;

  if coalesce(p_lot ->> 'status', '') <> 'reviewed' then
    raise exception 'lot_non_valide';
  end if;

  v_batch_code := nullif(btrim(coalesce(p_lot ->> 'batch_code', '')), '');
  if v_batch_code is null then
    raise exception 'batch_code_requis';
  end if;

  if exists (
    select 1
    from public.lots_contenu l
    where l.code = v_batch_code and l.schema_version <> 2
  ) then
    raise exception 'batch_code_schema_incompatible';
  end if;

  if jsonb_typeof(v_target) <> 'object'
     or nullif(btrim(coalesce(v_target ->> 'chapitre_code', '')), '') is null then
    raise exception 'cible_invalide';
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

  if v_chapitre.id is null then
    raise exception 'cible_chapitre_invalide';
  end if;

  if v_chapitre.code is not null
     and v_chapitre.code <> v_target ->> 'chapitre_code' then
    raise exception 'code_chapitre_incompatible';
  end if;

  update public.chapitres
  set code = v_target ->> 'chapitre_code'
  where id = v_chapitre.id and code is null;

  if jsonb_typeof(v_source) <> 'object'
     or nullif(btrim(coalesce(v_source ->> 'code', '')), '') is null
     or nullif(btrim(coalesce(v_source ->> 'titre', '')), '') is null then
    raise exception 'source_invalide';
  end if;

  if coalesce(v_source ->> 'droits_statut', '')
     not in ('open', 'public_domain', 'permission', 'reference_only') then
    raise exception 'droits_source_non_valides';
  end if;

  -- Validation structurelle complete avant toute mutation de contenu.
  if jsonb_typeof(p_lot -> 'levels') <> 'array'
     or jsonb_array_length(p_lot -> 'levels') <> 3 then
    raise exception 'trois_niveaux_requis';
  end if;

  select count(distinct level_item.value ->> 'palier')::int
  into v_distinct_count
  from jsonb_array_elements(p_lot -> 'levels') as level_item(value);

  if v_distinct_count <> 3 then
    raise exception 'paliers_dupliques_ou_manquants';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_lot -> 'levels') as level_item(value)
    where case level_item.value ->> 'palier'
      when 'entrainement' then level_item.value ->> 'libelle' is distinct from 'Facile'
      when 'maitrise' then level_item.value ->> 'libelle' is distinct from 'Moyen'
      when 'concours' then level_item.value ->> 'libelle' is distinct from 'Difficile'
      else true
    end
  ) then
    raise exception 'palier_ou_libelle_invalide';
  end if;

  for v_level_json in
    select value from jsonb_array_elements(p_lot -> 'levels')
  loop
    v_pack_count := v_pack_count + 1;

    if nullif(btrim(coalesce(v_level_json ->> 'titre', '')), '') is null then
      raise exception 'titre_niveau_requis: %', v_level_json ->> 'palier';
    end if;

    if jsonb_typeof(v_level_json -> 'exercises') <> 'array'
       or jsonb_array_length(v_level_json -> 'exercises') <> 3 then
      raise exception 'trois_exercices_requis: %', v_level_json ->> 'palier';
    end if;

    select
      count(*)::int,
      count(distinct (exercise_item.value ->> 'numero')::int)::int,
      min((exercise_item.value ->> 'numero')::int),
      max((exercise_item.value ->> 'numero')::int)
    into v_array_count, v_distinct_count, v_min_ordre, v_max_ordre
    from jsonb_array_elements(v_level_json -> 'exercises') as exercise_item(value);

    if v_array_count <> 3
       or v_distinct_count <> 3
       or v_min_ordre <> 1
       or v_max_ordre <> 3 then
      raise exception 'numerotation_exercices_invalide: %',
        v_level_json ->> 'palier';
    end if;

    for v_exercice_json in
      select value from jsonb_array_elements(v_level_json -> 'exercises')
    loop
      v_exercice_count := v_exercice_count + 1;

      if nullif(btrim(coalesce(v_exercice_json ->> 'code', '')), '') is null
         or nullif(btrim(coalesce(v_exercice_json ->> 'titre', '')), '') is null
         or nullif(btrim(coalesce(v_exercice_json ->> 'consigne', '')), '') is null then
        raise exception 'exercice_invalide: %',
          coalesce(v_exercice_json ->> 'code', 'sans_code');
      end if;

      if jsonb_typeof(v_exercice_json -> 'questions') <> 'array'
         or jsonb_array_length(v_exercice_json -> 'questions') < 2 then
        raise exception 'deux_questions_minimum: %', v_exercice_json ->> 'code';
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
        raise exception 'numerotation_questions_invalide: %',
          v_exercice_json ->> 'code';
      end if;

      for v_question_json in
        select value from jsonb_array_elements(v_exercice_json -> 'questions')
      loop
        v_question_count := v_question_count + 1;

        if nullif(btrim(coalesce(v_question_json ->> 'enonce_md', '')), '') is null
           or nullif(btrim(coalesce(v_question_json ->> 'correction_md', '')), '') is null then
          raise exception 'question_ou_correction_invalide: %/%',
            v_exercice_json ->> 'code', v_question_json ->> 'ordre';
        end if;

        -- Le format guide ne transporte aucune reponse eleve ni mecanique QCM.
        if v_question_json ? 'type'
           or v_question_json ? 'choix'
           or v_question_json ? 'bonnes_reponses'
           or v_question_json ? 'p_choix'
           or v_question_json ? 'reponse' then
          raise exception 'champ_interactif_interdit: %/%',
            v_exercice_json ->> 'code', v_question_json ->> 'ordre';
        end if;
      end loop;
    end loop;
  end loop;

  if v_pack_count <> 3 or v_exercice_count <> 9 then
    raise exception 'structure_lot_invalide';
  end if;

  select count(distinct exercise_item.value ->> 'code')::int
  into v_distinct_count
  from jsonb_array_elements(p_lot -> 'levels') as level_item(value)
  cross join lateral jsonb_array_elements(level_item.value -> 'exercises')
    as exercise_item(value);

  if v_distinct_count <> 9 then
    raise exception 'codes_exercices_dupliques';
  end if;

  insert into public.sources_contenu (
    code, titre, type, auteur_organisme, url, licence_code, licence_url,
    attribution, droits_statut, storage_path, sha256, notes
  ) values (
    v_source ->> 'code',
    v_source ->> 'titre',
    v_source ->> 'type',
    nullif(v_source ->> 'auteur_organisme', ''),
    nullif(v_source ->> 'url', ''),
    nullif(v_source ->> 'licence_code', ''),
    nullif(v_source ->> 'licence_url', ''),
    nullif(v_source ->> 'attribution', ''),
    v_source ->> 'droits_statut',
    nullif(v_source ->> 'storage_path', ''),
    nullif(lower(v_source ->> 'sha256'), ''),
    nullif(v_source ->> 'notes', '')
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

  -- Le contenu n'est publie qu'apres reconstruction et controle de chaque pack.
  for v_level_json in
    select value from jsonb_array_elements(p_lot -> 'levels')
  loop
    v_palier := v_level_json ->> 'palier';
    v_pack_code := v_batch_code || ':' || v_palier;
    v_level_hash := md5(v_level_json::text);

    select * into v_pack
    from public.packs_entrainement
    where code = v_pack_code;

    if v_pack.id is null then
      select coalesce(max(version), 0) + 1 into v_version
      from public.packs_entrainement
      where chapitre_id = v_chapitre.id and palier = v_palier;

      insert into public.packs_entrainement (
        chapitre_id, palier, code, version, titre, content_hash,
        source_id, source_locator, published
      ) values (
        v_chapitre.id,
        v_palier,
        v_pack_code,
        v_version,
        v_level_json ->> 'titre',
        v_level_hash,
        v_source_id,
        nullif(v_source ->> 'locator', ''),
        false
      )
      returning * into v_pack;
      v_same_hash := false;
      v_has_validations := false;
    else
      if v_pack.chapitre_id <> v_chapitre.id
         or v_pack.palier <> v_palier then
        raise exception 'code_pack_cible_incompatible: %', v_pack_code;
      end if;

      v_same_hash := v_pack.content_hash = v_level_hash;

      select exists (
        select 1
        from public.exercices_entrainement e
        join public.exercices_termines et on et.exercice_id = e.id
        where e.pack_id = v_pack.id
      ) into v_has_validations;

      if not v_same_hash and v_has_validations then
        raise exception 'pack_immuable_apres_validation: %', v_pack.code;
      end if;

      -- La provenance peut etre rectifiee sans changer le contenu pedagogique.
      update public.packs_entrainement
      set source_id = v_source_id,
          source_locator = nullif(v_source ->> 'locator', '')
      where id = v_pack.id
      returning * into v_pack;
    end if;

    if v_same_hash then
      if v_pack.published then
        continue;
      end if;

      -- Rejouer un ancien lot ne reactive jamais une version deja archivee.
      if exists (
        select 1
        from public.packs_entrainement p
        where p.chapitre_id = v_chapitre.id
          and p.palier = v_palier
          and p.id <> v_pack.id
          and p.published
      ) then
        continue;
      end if;

      update public.packs_entrainement
      set published = true
      where id = v_pack.id
      returning * into v_pack;
      continue;
    end if;

    if v_pack.published then
      update public.packs_entrainement
      set published = false
      where id = v_pack.id
      returning * into v_pack;
    end if;

    update public.packs_entrainement
    set titre = v_level_json ->> 'titre',
        content_hash = v_level_hash,
        source_id = v_source_id,
        source_locator = nullif(v_source ->> 'locator', '')
    where id = v_pack.id
    returning * into v_pack;

    for v_exercice_json in
      select value from jsonb_array_elements(v_level_json -> 'exercises')
    loop
      v_exercice_hash := md5(v_exercice_json::text);

      select * into v_exercice
      from public.exercices_entrainement
      where code = v_exercice_json ->> 'code';

      if v_exercice.id is null then
        if exists (
          select 1
          from public.exercices_entrainement e
          where e.pack_id = v_pack.id
            and e.numero = (v_exercice_json ->> 'numero')::int
        ) then
          raise exception 'numero_exercice_deja_occupe: %/%',
            v_pack.code, v_exercice_json ->> 'numero';
        end if;

        insert into public.exercices_entrainement (
          pack_id, numero, code, titre, consigne, content_hash
        ) values (
          v_pack.id,
          (v_exercice_json ->> 'numero')::int,
          v_exercice_json ->> 'code',
          v_exercice_json ->> 'titre',
          v_exercice_json ->> 'consigne',
          v_exercice_hash
        )
        returning * into v_exercice;
      else
        if v_exercice.pack_id <> v_pack.id
           or v_exercice.numero <> (v_exercice_json ->> 'numero')::int then
          raise exception 'code_exercice_cible_incompatible: %',
            v_exercice_json ->> 'code';
        end if;

        update public.exercices_entrainement
        set titre = v_exercice_json ->> 'titre',
            consigne = v_exercice_json ->> 'consigne',
            content_hash = v_exercice_hash
        where id = v_exercice.id
        returning * into v_exercice;
      end if;

      for v_question_json in
        select value from jsonb_array_elements(v_exercice_json -> 'questions')
      loop
        v_question_hash := md5(v_question_json::text);

        select * into v_question
        from public.questions_exercice
        where exercice_id = v_exercice.id
          and ordre = (v_question_json ->> 'ordre')::int;

        if v_question.id is null then
          insert into public.questions_exercice (
            exercice_id, ordre, enonce_md, correction_md,
            image_url, image_alt, content_hash
          ) values (
            v_exercice.id,
            (v_question_json ->> 'ordre')::int,
            v_question_json ->> 'enonce_md',
            v_question_json ->> 'correction_md',
            nullif(v_question_json ->> 'image_url', ''),
            nullif(v_question_json ->> 'image_alt', ''),
            v_question_hash
          )
          returning * into v_question;
        else
          update public.questions_exercice
          set enonce_md = v_question_json ->> 'enonce_md',
              correction_md = v_question_json ->> 'correction_md',
              image_url = nullif(v_question_json ->> 'image_url', ''),
              image_alt = nullif(v_question_json ->> 'image_alt', ''),
              content_hash = v_question_hash
          where id = v_question.id
          returning * into v_question;
        end if;
      end loop;

      delete from public.questions_exercice q
      where q.exercice_id = v_exercice.id
        and not exists (
          select 1
          from jsonb_array_elements(v_exercice_json -> 'questions')
            as question_item(value)
          where (question_item.value ->> 'ordre')::int = q.ordre
        );

      select count(*)::int into v_array_count
      from public.questions_exercice q
      where q.exercice_id = v_exercice.id;

      if v_array_count < 2 then
        raise exception 'exercice_incomplet: %', v_exercice.code;
      end if;
    end loop;

    delete from public.exercices_entrainement e
    where e.pack_id = v_pack.id
      and not exists (
        select 1
        from jsonb_array_elements(v_level_json -> 'exercises')
          as exercise_item(value)
        where exercise_item.value ->> 'code' = e.code
      );

    select count(*)::int into v_array_count
    from public.exercices_entrainement e
    where e.pack_id = v_pack.id;

    if v_array_count <> 3 then
      raise exception 'pack_incomplet: %', v_pack.code;
    end if;

    -- La nouvelle version remplace atomiquement l'ancienne version active.
    update public.packs_entrainement
    set published = false
    where chapitre_id = v_chapitre.id
      and palier = v_palier
      and id <> v_pack.id
      and published = true;

    update public.packs_entrainement
    set published = true
    where id = v_pack.id
    returning * into v_pack;
  end loop;

  insert into public.lots_contenu (
    code, schema_version, content_hash, cible, source_id,
    quiz_count, question_count, statut, manifeste, applied_at
  ) values (
    v_batch_code,
    2,
    md5(p_lot::text),
    v_target,
    v_source_id,
    v_pack_count,
    v_question_count,
    'publie',
    p_lot,
    now()
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
    'batch_code', v_batch_code,
    'chapitre_id', v_chapitre.id,
    'pack_count', v_pack_count,
    'exercise_count', v_exercice_count,
    'question_count', v_question_count
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 8. Surface RPC minimale
-- --------------------------------------------------------------------------

revoke all on function public.get_exercices_entrainement_v2(uuid, text)
  from public, anon;
revoke all on function public.terminer_exercice_entrainement_v2(uuid)
  from public, anon;
revoke all on function public.get_niveaux_exercices_chapitre_v2(uuid)
  from public, anon;
revoke all on function public.get_progression_exercices_matiere_v2(uuid)
  from public, anon;
revoke all on function public.importer_lot_exercices_v2(jsonb)
  from public, anon;

grant execute on function public.get_exercices_entrainement_v2(uuid, text)
  to authenticated;
grant execute on function public.terminer_exercice_entrainement_v2(uuid)
  to authenticated;
grant execute on function public.get_niveaux_exercices_chapitre_v2(uuid)
  to authenticated;
grant execute on function public.get_progression_exercices_matiere_v2(uuid)
  to authenticated;
grant execute on function public.importer_lot_exercices_v2(jsonb)
  to authenticated, service_role;

notify pgrst, 'reload schema';

commit;
