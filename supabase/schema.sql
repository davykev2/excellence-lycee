-- ============================================================================
-- EXCELLENCE LYCÉE — schéma Supabase complet (idempotent)
-- État complet pour une nouvelle installation. Pour une base existante,
-- appliquer dans l'ordre les fichiers de supabase/migrations/.
-- Peut être rejoué sans dupliquer les données de référence.
-- ============================================================================

create extension if not exists pgcrypto;

-- ============================================================================
-- 1. TABLES DE RÉFÉRENCE
-- ============================================================================

create table if not exists public.niveaux (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  ordre int not null unique
);

create table if not exists public.series (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  niveau_id uuid not null references public.niveaux(id) on delete cascade,
  unique (nom, niveau_id)
);

create table if not exists public.matieres (
  id uuid primary key default gen_random_uuid(),
  nom text not null unique,
  slug text not null unique,
  icone text,
  ordre int default 0
);

create table if not exists public.matieres_series (
  matiere_id uuid not null references public.matieres(id) on delete cascade,
  serie_id uuid not null references public.series(id) on delete cascade,
  primary key (matiere_id, serie_id)
);

-- ============================================================================
-- 2. PROFILS (liés à auth.users)
-- ============================================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  avatar_url text,
  niveau_id uuid references public.niveaux(id),
  serie_id uuid references public.series(id),
  etablissement text,
  is_admin boolean not null default false,
  approuve boolean not null default false,
  theme text not null default 'dark' check (theme in ('dark','light')),
  points_carriere int not null default 0,
  bio text,
  likes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_niveau_serie on public.profiles(niveau_id, serie_id);
create index if not exists idx_profiles_etablissement on public.profiles(etablissement);

create table if not exists public.profil_likes (
  liker_id uuid not null references public.profiles(id) on delete cascade,
  liked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (liker_id, liked_id)
);

-- ============================================================================
-- 3. CONTENUS PÉDAGOGIQUES
-- ============================================================================

create table if not exists public.chapitres (
  id uuid primary key default gen_random_uuid(),
  matiere_id uuid not null references public.matieres(id) on delete cascade,
  serie_id uuid references public.series(id) on delete cascade,
  ordre int not null default 0,
  code text,
  titre text not null,
  description text,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (matiere_id, serie_id, ordre)
);

create index if not exists idx_chapitres_matiere on public.chapitres(matiere_id, serie_id, ordre);

-- Résumé de cours attaché à chaque leçon (contenu rédigé plus tard, suivi via la
-- matrice de couverture admin)
alter table public.chapitres add column if not exists resume text;
alter table public.chapitres add column if not exists resume_published boolean not null default false;
alter table public.chapitres add column if not exists code text;
create unique index if not exists uniq_chapitres_code
  on public.chapitres(code) where code is not null;

create table if not exists public.quiz (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid references public.chapitres(id) on delete cascade,
  matiere_id uuid references public.matieres(id) on delete cascade,
  serie_id uuid references public.series(id) on delete cascade,
  type text not null check (type in ('chapitre','devoir')),
  titre text not null,
  numero int not null default 1,
  duree_sec int,
  code text,
  palier text check (palier is null or palier in ('entrainement','maitrise','concours')),
  est_note boolean not null default true,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  constraint quiz_cible check (
    (type = 'chapitre' and chapitre_id is not null) or
    (type = 'devoir' and matiere_id is not null)
  ),
  constraint quiz_est_note_coherence check (
    (type = 'devoir' and est_note and palier is null) or
    (
      type = 'chapitre' and (
        (est_note and palier is null) or
        (not est_note and palier in ('entrainement','maitrise','concours'))
      )
    )
  )
);

-- Rejouer schema.sql sur une installation existante doit aussi ajouter les
-- colonnes introduites apres la creation initiale de la table.
alter table public.quiz add column if not exists code text;
alter table public.quiz add column if not exists palier text;
alter table public.quiz add column if not exists est_note boolean not null default true;
update public.quiz set est_note = false where palier is not null and est_note is distinct from false;

alter table public.quiz drop constraint if exists quiz_palier_check;
alter table public.quiz add constraint quiz_palier_check
  check (palier is null or palier in ('entrainement','maitrise','concours'));
alter table public.quiz drop constraint if exists quiz_est_note_coherence;
alter table public.quiz add constraint quiz_est_note_coherence check (
  (type = 'devoir' and est_note and palier is null) or
  (
    type = 'chapitre' and (
      (est_note and palier is null) or
      (not est_note and palier in ('entrainement','maitrise','concours'))
    )
  )
);

create index if not exists idx_quiz_chapitre on public.quiz(chapitre_id, numero);
create index if not exists idx_quiz_devoir on public.quiz(matiere_id, serie_id) where type = 'devoir';
drop index if exists public.uniq_quiz_chapitre_numero;
create unique index if not exists uniq_quiz_chapitre_categorie_numero
  on public.quiz(chapitre_id, est_note, numero) where type = 'chapitre';
create unique index if not exists uniq_quiz_chapitre_palier_entrainement
  on public.quiz(chapitre_id, palier) where type = 'chapitre' and not est_note;
create index if not exists idx_quiz_entrainement_chapitre
  on public.quiz(chapitre_id, numero) where published and not est_note;
create unique index if not exists uniq_quiz_devoir_numero_publie
  on public.quiz(matiere_id, serie_id, numero)
  where type = 'devoir' and published;
create unique index if not exists uniq_quiz_code on public.quiz(code) where code is not null;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quiz(id) on delete cascade,
  ordre int not null default 0,
  code text,
  enonce text not null,
  type text not null default 'qcm' check (type in ('qcm','texte')),
  choix jsonb,
  bonnes_reponses jsonb not null,
  points int not null default 1,
  image_url text,
  explication text,
  difficulte int check (difficulte is null or difficulte between 1 and 3),
  origine text check (origine is null or origine in ('originale','adaptee','citation')),
  licence_code text,
  content_hash text,
  image_alt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quiz_id, ordre)
);

alter table public.questions add column if not exists code text;
alter table public.questions add column if not exists difficulte int;
alter table public.questions add column if not exists origine text;
alter table public.questions add column if not exists licence_code text;
alter table public.questions add column if not exists content_hash text;
alter table public.questions add column if not exists image_alt text;
alter table public.questions add column if not exists updated_at timestamptz not null default now();

alter table public.questions drop constraint if exists questions_difficulte_check;
alter table public.questions add constraint questions_difficulte_check
  check (difficulte is null or difficulte between 1 and 3);
alter table public.questions drop constraint if exists questions_origine_check;
alter table public.questions add constraint questions_origine_check
  check (origine is null or origine in ('originale','adaptee','citation'));

create index if not exists idx_questions_quiz on public.questions(quiz_id, ordre);
create unique index if not exists uniq_questions_code
  on public.questions(code) where code is not null;

-- Provenance editoriale des exercices. Ces tables ne sont jamais exposees aux
-- eleves ; elles servent a l'audit des sources et aux imports idempotents.
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

-- ============================================================================
-- 4. TENTATIVES / RÉPONSES
-- ============================================================================

create table if not exists public.tentatives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quiz(id) on delete cascade,
  numero_tentative int not null default 1,
  statut text not null default 'en_cours' check (statut in ('en_cours','terminee','abandonnee')),
  note numeric(4,2),
  temps_pris_sec int,
  date_fin_theorique timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tentatives_user_quiz on public.tentatives(user_id, quiz_id);
create index if not exists idx_tentatives_quiz on public.tentatives(quiz_id);

create table if not exists public.reponses (
  id uuid primary key default gen_random_uuid(),
  tentative_id uuid not null references public.tentatives(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  choix_selectionnes jsonb,
  correcte boolean not null default false
);

create index if not exists idx_reponses_tentative on public.reponses(tentative_id);
create unique index if not exists uniq_reponses_tentative_question
  on public.reponses(tentative_id, question_id);

-- Nettoie les notes qui auraient ete calculees par une ancienne version sur
-- des packs desormais declares non notes.
update public.tentatives t
set note = null
from public.quiz q
where q.id = t.quiz_id and not q.est_note and t.note is not null;

-- ============================================================================
-- 5. QUIZ RAPIDE
-- ============================================================================

create table if not exists public.quiz_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  matiere_id uuid references public.matieres(id) on delete set null,
  points int not null default 0,
  nb_bonnes int not null default 0,
  nb_questions int not null default 0,
  streak_actuel int not null default 0,
  streak_max int not null default 0,
  derniere_reponse_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, matiere_id)
);

create index if not exists idx_quiz_scores_user on public.quiz_scores(user_id);

-- Banque de questions et défis éphémères du quiz rapide. Les réponses restent
-- côté serveur ; les clients passent exclusivement par les RPC dédiées.
create table if not exists public.quiz_rapide_questions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  matiere_id uuid not null references public.matieres(id) on delete cascade,
  niveau_id uuid references public.niveaux(id) on delete cascade,
  enonce text not null,
  choix jsonb not null check (jsonb_typeof(choix) = 'array' and jsonb_array_length(choix) >= 2),
  bonne_reponse text not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_rapide_questions_matiere
  on public.quiz_rapide_questions(matiere_id, niveau_id) where active = true;

create table if not exists public.quiz_rapide_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  matiere_id uuid not null references public.matieres(id) on delete cascade,
  question_id uuid not null references public.quiz_rapide_questions(id) on delete cascade,
  expires_at timestamptz not null default (now() + interval '2 minutes'),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists idx_quiz_rapide_challenges_user
  on public.quiz_rapide_challenges(user_id, created_at desc);
create unique index if not exists uniq_quiz_rapide_challenge_active
  on public.quiz_rapide_challenges(user_id) where answered_at is null;

-- ============================================================================
-- 6. DÉFIS 1V1
-- ============================================================================

create table if not exists public.defis (
  id uuid primary key default gen_random_uuid(),
  challenger_id uuid not null references public.profiles(id) on delete cascade,
  adversaire_id uuid not null references public.profiles(id) on delete cascade,
  quiz_genere jsonb not null,
  statut text not null default 'en_attente' check (statut in ('en_attente','en_cours','termine','refuse')),
  score_challenger int,
  score_adversaire int,
  temps_challenger int,
  temps_adversaire int,
  started_challenger_at timestamptz,
  started_adversaire_at timestamptz,
  gagnant_id uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  terminated_at timestamptz
);

create index if not exists idx_defis_challenger on public.defis(challenger_id);
create index if not exists idx_defis_adversaire on public.defis(adversaire_id);

-- ============================================================================
-- 7. BADGES / SAISONS
-- ============================================================================

create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  categorie text not null check (categorie in ('performance','progression','assiduite','competition','amelioration')),
  nom text not null,
  description text not null,
  icone text not null default '🏅'
);

create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  saison_id uuid,
  obtenu_le timestamptz not null default now()
);

create unique index if not exists uniq_user_badge_no_saison
  on public.user_badges(user_id, badge_id) where saison_id is null;
create unique index if not exists uniq_user_badge_saison
  on public.user_badges(user_id, badge_id, saison_id) where saison_id is not null;

create table if not exists public.saisons (
  id uuid primary key default gen_random_uuid(),
  trimestre text not null unique,
  date_debut date not null,
  date_fin date not null,
  statut text not null default 'active' check (statut in ('active','archivee')),
  classements_figes jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 8. COMMUNAUTÉ
-- ============================================================================

create table if not exists public.chat_global (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  niveau_id uuid not null references public.niveaux(id) on delete cascade,
  contenu text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_chat_global_niveau on public.chat_global(niveau_id, created_at desc);

create table if not exists public.messages_prives (
  id uuid primary key default gen_random_uuid(),
  de uuid not null references public.profiles(id) on delete cascade,
  vers uuid not null references public.profiles(id) on delete cascade,
  contenu text not null,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_messages_prives_conv on public.messages_prives(de, vers, created_at);

create table if not exists public.signalements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  motif text not null,
  statut text not null default 'ouvert' check (statut in ('ouvert','traite','rejete')),
  reponse_admin text,
  created_at timestamptz not null default now()
);

create index if not exists idx_signalements_statut on public.signalements(statut);

-- ============================================================================
-- 9. PARAMÈTRES D'APPLICATION
-- ============================================================================

create table if not exists public.app_settings (
  cle text primary key,
  valeur jsonb not null,
  description text
);

-- ============================================================================
-- 10. TRIGGERS UTILITAIRES
-- ============================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tout contenu avec un palier est un pack d'entrainement non note. Ce trigger
-- garde les anciens importeurs compatibles, meme s'ils n'envoient pas est_note.
create or replace function public.force_quiz_entrainement_non_note()
returns trigger language plpgsql set search_path = public as $$
begin
  if new.palier is not null then
    new.est_note := false;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_force_quiz_entrainement_non_note on public.quiz;
create trigger trg_force_quiz_entrainement_non_note
  before insert or update of palier, est_note on public.quiz
  for each row execute function public.force_quiz_entrainement_non_note();

revoke all on function public.force_quiz_entrainement_non_note() from public;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_tentatives_updated_at on public.tentatives;
create trigger trg_tentatives_updated_at before update on public.tentatives
  for each row execute function public.set_updated_at();

drop trigger if exists trg_questions_updated_at on public.questions;
create trigger trg_questions_updated_at before update on public.questions
  for each row execute function public.set_updated_at();

drop trigger if exists trg_sources_contenu_updated_at on public.sources_contenu;
create trigger trg_sources_contenu_updated_at before update on public.sources_contenu
  for each row execute function public.set_updated_at();

-- Création automatique du profil à l'inscription (lit raw_user_meta_data passé au signUp)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, avatar_url, niveau_id, serie_id, etablissement)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    nullif(new.raw_user_meta_data->>'niveau_id', '')::uuid,
    nullif(new.raw_user_meta_data->>'serie_id', '')::uuid,
    new.raw_user_meta_data->>'etablissement'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Empêche un non-admin de s'auto-élever (is_admin/approuve/points_carriere protégés).
-- Ne s'applique qu'aux sessions utilisateur : le SQL Editor et le service role
-- (auth.uid() null) passent librement, sinon l'élévation manuelle du premier
-- admin serait impossible. Les RPC internes (attribution de points) posent le
-- flag transactionnel app.internal_update pour passer aussi.
create or replace function public.protect_privileged_columns()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_is_admin boolean;
begin
  if auth.uid() is null then
    return new;
  end if;
  if coalesce(current_setting('app.internal_update', true), '') = 'on' then
    return new;
  end if;
  select is_admin into v_is_admin from public.profiles where id = auth.uid();
  if not coalesce(v_is_admin, false) then
    new.is_admin := old.is_admin;
    new.approuve := old.approuve;
    new.points_carriere := old.points_carriere;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_protect_privileged on public.profiles;
create trigger trg_protect_privileged before update on public.profiles
  for each row execute function public.protect_privileged_columns();

-- ============================================================================
-- 11. ROW LEVEL SECURITY
-- ============================================================================

alter table public.niveaux enable row level security;
alter table public.series enable row level security;
alter table public.matieres enable row level security;
alter table public.matieres_series enable row level security;
alter table public.profiles enable row level security;
alter table public.chapitres enable row level security;
alter table public.quiz enable row level security;
alter table public.questions enable row level security;
alter table public.sources_contenu enable row level security;
alter table public.question_sources enable row level security;
alter table public.lots_contenu enable row level security;
alter table public.tentatives enable row level security;
alter table public.reponses enable row level security;
alter table public.quiz_scores enable row level security;
alter table public.quiz_rapide_questions enable row level security;
alter table public.quiz_rapide_challenges enable row level security;
alter table public.defis enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;
alter table public.saisons enable row level security;
alter table public.chat_global enable row level security;
alter table public.messages_prives enable row level security;
alter table public.signalements enable row level security;
alter table public.app_settings enable row level security;
alter table public.profil_likes enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false);
$$;

-- Référentiels : lecture publique, écriture admin
drop policy if exists "niveaux_select" on public.niveaux;
create policy "niveaux_select" on public.niveaux for select using (true);
drop policy if exists "niveaux_write" on public.niveaux;
create policy "niveaux_write" on public.niveaux for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "series_select" on public.series;
create policy "series_select" on public.series for select using (true);
drop policy if exists "series_write" on public.series;
create policy "series_write" on public.series for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "matieres_select" on public.matieres;
create policy "matieres_select" on public.matieres for select using (true);
drop policy if exists "matieres_write" on public.matieres;
create policy "matieres_write" on public.matieres for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "matieres_series_select" on public.matieres_series;
create policy "matieres_series_select" on public.matieres_series for select using (true);
drop policy if exists "matieres_series_write" on public.matieres_series;
create policy "matieres_series_write" on public.matieres_series for all using (public.is_admin()) with check (public.is_admin());

-- Profils : lecture publique (classements, profils publics), écriture de son propre profil uniquement
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "profiles_update_admin" on public.profiles;
create policy "profiles_update_admin" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- Chapitres : lecture publique du contenu publié, tout pour l'admin
drop policy if exists "chapitres_select" on public.chapitres;
create policy "chapitres_select" on public.chapitres for select using (published = true or public.is_admin());
drop policy if exists "chapitres_write" on public.chapitres;
create policy "chapitres_write" on public.chapitres for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "quiz_select" on public.quiz;
create policy "quiz_select" on public.quiz for select using (published = true or public.is_admin());
drop policy if exists "quiz_write" on public.quiz;
create policy "quiz_write" on public.quiz for all using (public.is_admin()) with check (public.is_admin());

-- Questions : jamais accessibles directement aux élèves (uniquement via RPC SECURITY DEFINER)
drop policy if exists "questions_select_admin" on public.questions;
create policy "questions_select_admin" on public.questions for select using (public.is_admin());
drop policy if exists "questions_write" on public.questions;
create policy "questions_write" on public.questions for all using (public.is_admin()) with check (public.is_admin());

-- Provenance et lots d'import : administration uniquement.
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
grant select, insert, update, delete
  on public.sources_contenu, public.question_sources, public.lots_contenu
  to authenticated;

-- Tentatives / réponses : lecture de ses propres données ; écriture uniquement via RPC (aucune policy insert/update)
drop policy if exists "tentatives_select_own" on public.tentatives;
create policy "tentatives_select_own" on public.tentatives for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "reponses_select_own" on public.reponses;
create policy "reponses_select_own" on public.reponses for select using (
  exists (select 1 from public.tentatives t where t.id = reponses.tentative_id and (t.user_id = auth.uid() or public.is_admin()))
);

-- Quiz scores : lecture publique (classements), écriture uniquement via RPC
drop policy if exists "quiz_scores_select" on public.quiz_scores;
create policy "quiz_scores_select" on public.quiz_scores for select using (true);

-- Banque du quiz rapide : administration uniquement. Les challenges ne sont
-- jamais exposés directement, même à leur propriétaire.
drop policy if exists "quiz_rapide_questions_admin" on public.quiz_rapide_questions;
create policy "quiz_rapide_questions_admin" on public.quiz_rapide_questions
  for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.quiz_rapide_questions to authenticated;
revoke all on public.quiz_rapide_questions from anon;
revoke all on public.quiz_rapide_challenges from anon, authenticated;

-- Défis : aucune lecture directe car quiz_genere contient les corrections.
-- Les participants passent par get_mes_defis() et get_defi_questions().
drop policy if exists "defis_select" on public.defis;
revoke select on public.defis from anon, authenticated;

-- Badges : lecture publique, écriture admin (catalogue) / RPC (attribution)
drop policy if exists "badges_select" on public.badges;
create policy "badges_select" on public.badges for select using (true);
drop policy if exists "badges_write" on public.badges;
create policy "badges_write" on public.badges for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "user_badges_select" on public.user_badges;
create policy "user_badges_select" on public.user_badges for select using (true);

-- Saisons : lecture publique, écriture admin
drop policy if exists "saisons_select" on public.saisons;
create policy "saisons_select" on public.saisons for select using (true);
drop policy if exists "saisons_write" on public.saisons;
create policy "saisons_write" on public.saisons for all using (public.is_admin()) with check (public.is_admin());

-- Chat global : lecture/écriture par les inscrits, sur son propre niveau
drop policy if exists "chat_global_select" on public.chat_global;
create policy "chat_global_select" on public.chat_global for select using (
  auth.uid() is not null and
  niveau_id = (select niveau_id from public.profiles where id = auth.uid())
);
drop policy if exists "chat_global_insert" on public.chat_global;
create policy "chat_global_insert" on public.chat_global for insert with check (
  user_id = auth.uid() and
  niveau_id = (select niveau_id from public.profiles where id = auth.uid())
);

-- Messagerie privée : lecture/écriture des messages où on est impliqué
drop policy if exists "messages_prives_select" on public.messages_prives;
create policy "messages_prives_select" on public.messages_prives for select using (de = auth.uid() or vers = auth.uid());
drop policy if exists "messages_prives_insert" on public.messages_prives;
create policy "messages_prives_insert" on public.messages_prives for insert with check (de = auth.uid());
drop policy if exists "messages_prives_update" on public.messages_prives;
create policy "messages_prives_update" on public.messages_prives for update using (vers = auth.uid()) with check (vers = auth.uid());

-- Signalements : élève voit les siens, admin voit tout
drop policy if exists "signalements_select" on public.signalements;
create policy "signalements_select" on public.signalements for select using (user_id = auth.uid() or public.is_admin());
drop policy if exists "signalements_insert" on public.signalements;
create policy "signalements_insert" on public.signalements for insert with check (user_id = auth.uid());
drop policy if exists "signalements_update_admin" on public.signalements;
create policy "signalements_update_admin" on public.signalements for update using (public.is_admin()) with check (public.is_admin());

-- Likes de profil : lecture publique, écriture uniquement via RPC
drop policy if exists "profil_likes_select" on public.profil_likes;
create policy "profil_likes_select" on public.profil_likes for select using (true);

-- Paramètres d'app : lecture publique, écriture admin
drop policy if exists "app_settings_select" on public.app_settings;
create policy "app_settings_select" on public.app_settings for select using (true);
drop policy if exists "app_settings_write" on public.app_settings;
create policy "app_settings_write" on public.app_settings for all using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- 12. STORAGE
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('question-images', 'question-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('sources', 'sources', false)
on conflict (id) do nothing;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read" on storage.objects for select using (bucket_id = 'avatars');
drop policy if exists "avatars_own_write" on storage.objects;
create policy "avatars_own_write" on storage.objects for insert with check (bucket_id = 'avatars' and auth.uid() is not null);
drop policy if exists "avatars_own_update" on storage.objects;
create policy "avatars_own_update" on storage.objects for update using (bucket_id = 'avatars' and owner = auth.uid());
drop policy if exists "avatars_own_delete" on storage.objects;
create policy "avatars_own_delete" on storage.objects for delete using (bucket_id = 'avatars' and owner = auth.uid());

drop policy if exists "question_images_public_read" on storage.objects;
create policy "question_images_public_read" on storage.objects for select using (bucket_id = 'question-images');
drop policy if exists "question_images_admin_write" on storage.objects;
create policy "question_images_admin_write" on storage.objects for all using (bucket_id = 'question-images' and public.is_admin()) with check (bucket_id = 'question-images' and public.is_admin());

drop policy if exists "sources_admin_only" on storage.objects;
create policy "sources_admin_only" on storage.objects for all using (bucket_id = 'sources' and public.is_admin()) with check (bucket_id = 'sources' and public.is_admin());

-- ============================================================================
-- 13. FONCTIONS MÉTIER (RPC, SECURITY DEFINER)
-- ============================================================================

-- Import transactionnel des trois packs d'entrainement d'une lecon.
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
          and not est_note
          and numero = (v_quiz_json ->> 'numero')::int
      ) then
        raise exception 'numero_quiz_deja_occupe: %', v_quiz_json ->> 'numero';
      end if;
      insert into public.quiz (
        chapitre_id, matiere_id, serie_id, type, titre, numero,
        published, code, palier, est_note
      ) values (
        v_chapitre.id, v_chapitre.matiere_id, v_chapitre.serie_id, 'chapitre',
        v_quiz_json ->> 'titre', (v_quiz_json ->> 'numero')::int,
        false, v_quiz_json ->> 'code', v_quiz_json ->> 'palier', false
      ) returning * into v_quiz;
    else
      if v_quiz.chapitre_id <> v_chapitre.id
         or v_quiz.type <> 'chapitre'
         or v_quiz.est_note
         or v_quiz.numero <> (v_quiz_json ->> 'numero')::int then
        raise exception 'code_quiz_cible_incompatible: %', v_quiz_json ->> 'code';
      end if;
      update public.quiz set
        titre = v_quiz_json ->> 'titre',
        matiere_id = v_chapitre.matiere_id,
        serie_id = v_chapitre.serie_id,
        palier = v_quiz_json ->> 'palier',
        est_note = false
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
      if nullif(btrim(coalesce(v_question_json ->> 'explication', '')), '') is null then
        raise exception 'explication_requise: %', v_question_json ->> 'code';
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
grant execute on function public.importer_lot_exercices(jsonb)
  to authenticated, service_role;

-- ---- Attribution de badges (interne, appelée par les autres RPC) -----------
create or replace function public.check_and_award_badges(p_user_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_saison_id uuid;
  v_nb_20 int;
  v_nb_20_premiere int;
  v_nb_eclair int;
  v_nb_tentatives int;
  v_jours_actifs int;
  v_jours_consecutifs int;
  v_defis_joues int;
  v_defis_gagnes_affile int;
begin
  select id into v_saison_id from public.saisons where statut = 'active' order by date_debut desc limit 1;

  if exists (
    select 1
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.user_id = p_user_id and t.statut = 'terminee' and q.est_note
  ) then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'premier_pas'
      on conflict do nothing;
  end if;

  select count(*) into v_nb_20
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id
  where t.user_id = p_user_id
    and t.statut = 'terminee'
    and t.note = 20
    and q.est_note;
  if v_nb_20 > 0 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'sans_faute'
      on conflict do nothing;
  end if;

  select count(*) into v_nb_20_premiere
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id
  where t.user_id = p_user_id
    and t.statut = 'terminee'
    and t.note = 20
    and t.numero_tentative = 1
    and q.est_note;
  if v_nb_20_premiere > 0 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'perfectionniste'
      on conflict do nothing;
  end if;

  select count(*) into v_nb_eclair from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.user_id = p_user_id and t.statut = 'terminee' and t.note >= 16
      and q.est_note
      and q.duree_sec is not null and t.temps_pris_sec is not null
      and t.temps_pris_sec < q.duree_sec / 2.0;
  if v_nb_eclair > 0 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'eclair'
      on conflict do nothing;
  end if;

  select count(*) into v_nb_tentatives from (
    select t.quiz_id
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.user_id = p_user_id and q.est_note
    group by t.quiz_id
    having count(*) >= 3
  ) x;
  if v_nb_tentatives > 0 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'increvable'
      on conflict do nothing;
  end if;

  select count(distinct d) into v_jours_actifs from (
    select date(t.created_at) d
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.user_id = p_user_id and t.statut = 'terminee' and q.est_note
    union
    select date(updated_at) d from public.quiz_scores where user_id = p_user_id
  ) x;
  if v_jours_actifs >= 30 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'marathonien'
      on conflict do nothing;
  end if;

  select count(distinct d) into v_jours_consecutifs from (
    select date(t.created_at) d
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.user_id = p_user_id
      and t.statut = 'terminee'
      and q.est_note
      and t.created_at >= now() - interval '3 days'
    union
    select date(updated_at) d from public.quiz_scores where user_id = p_user_id
      and updated_at >= now() - interval '3 days'
  ) x;
  if v_jours_consecutifs >= 3 then
    insert into public.user_badges (user_id, badge_id, saison_id)
      select p_user_id, id, v_saison_id from public.badges where code = 'serie_en_cours'
      on conflict do nothing;
  end if;

  select count(*) into v_defis_joues from public.defis
    where (challenger_id = p_user_id or adversaire_id = p_user_id) and statut = 'termine';
  if v_defis_joues >= 10 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'duelliste'
      on conflict do nothing;
  end if;

  select count(*) into v_defis_gagnes_affile from (
    select gagnant_id from public.defis
      where (challenger_id = p_user_id or adversaire_id = p_user_id) and statut = 'termine'
      order by terminated_at desc limit 5
  ) x where gagnant_id = p_user_id;
  if v_defis_gagnes_affile = 5 then
    insert into public.user_badges (user_id, badge_id)
      select p_user_id, id from public.badges where code = 'invaincu'
      on conflict do nothing;
  end if;
end;
$$;

-- ---- start_tentative : démarre/reprend une tentative, renvoie les questions SANS les réponses ----
create or replace function public.start_tentative(p_quiz_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
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
  v_chapitre_ordre int;
  v_limite_decouverte int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_quiz from public.quiz where id = p_quiz_id and published = true;
  if v_quiz is null then
    raise exception 'quiz_introuvable';
  end if;

  -- Les packs avec palier passent exclusivement par les RPC d'entrainement :
  -- ils ne doivent jamais entrer dans le moteur de notation / XP.
  if not v_quiz.est_note or v_quiz.palier is not null then
    raise exception 'utiliser_entrainement_rpc';
  end if;

  -- Contenu Découverte : appliqué côté serveur, pas seulement en UI
  select approuve into v_approuve from public.profiles where id = auth.uid();
  if not coalesce(v_approuve, false) then
    if v_quiz.type = 'devoir' then
      raise exception 'contenu_reserve_membres';
    end if;
    select ordre into v_chapitre_ordre from public.chapitres where id = v_quiz.chapitre_id;
    select coalesce((valeur #>> '{}')::int, 1) into v_limite_decouverte
      from public.app_settings where cle = 'contenu_decouverte_chapitres';
    if coalesce(v_chapitre_ordre, 999) > coalesce(v_limite_decouverte, 1) then
      raise exception 'contenu_reserve_membres';
    end if;
  end if;

  -- Déblocage progressif pour les quiz de chapitre (numero > 1)
  if v_quiz.type = 'chapitre' and v_quiz.est_note and v_quiz.numero > 1 then
    select id into v_chapitre_precedent_id from public.quiz
      where chapitre_id = v_quiz.chapitre_id
        and type = 'chapitre'
        and est_note
        and numero = v_quiz.numero - 1
      limit 1;
    if v_chapitre_precedent_id is not null then
      select max(note) into v_meilleure_note from public.tentatives
        where user_id = auth.uid() and quiz_id = v_chapitre_precedent_id and statut = 'terminee';
      if coalesce(v_meilleure_note, 0) < 12 then
        raise exception 'quiz_verrouille';
      end if;
    end if;
  end if;

  -- Reprise d'une tentative en cours (non expirée)
  select * into v_tentative from public.tentatives
    where user_id = auth.uid() and quiz_id = p_quiz_id and statut = 'en_cours'
      and (date_fin_theorique is null or date_fin_theorique > now())
    order by created_at desc limit 1;

  if v_tentative is null then
    select count(*) into v_nb_tentatives from public.tentatives
      where user_id = auth.uid() and quiz_id = p_quiz_id;
    v_numero_tentative := v_nb_tentatives + 1;

    if v_quiz.type = 'devoir' then
      if v_numero_tentative > 3 then
        raise exception 'quota_tentatives_atteint';
      end if;
      v_facteur := case v_numero_tentative when 1 then 1.0 when 2 then 0.66 else 0.33 end;
      v_duree := coalesce(v_quiz.duree_sec, 2700) * v_facteur;
    else
      v_duree := null;
    end if;

    insert into public.tentatives (user_id, quiz_id, numero_tentative, statut, date_fin_theorique)
    values (
      auth.uid(), p_quiz_id, v_numero_tentative, 'en_cours',
      case when v_duree is not null then now() + (v_duree || ' seconds')::interval else null end
    )
    returning * into v_tentative;
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id, 'ordre', q.ordre, 'enonce', q.enonce, 'type', q.type,
    'choix', q.choix, 'points', q.points, 'image_url', q.image_url
  ) order by q.ordre) into v_questions
  from public.questions q where q.quiz_id = p_quiz_id;

  return jsonb_build_object(
    'tentative_id', v_tentative.id,
    'numero_tentative', v_tentative.numero_tentative,
    'date_fin_theorique', v_tentative.date_fin_theorique,
    'quiz', jsonb_build_object(
      'id', v_quiz.id,
      'titre', v_quiz.titre,
      'type', v_quiz.type,
      'duree_sec', v_quiz.duree_sec,
      'est_note', true,
      'palier', null
    ),
    'questions', coalesce(v_questions, '[]'::jsonb)
  );
end;
$$;

-- ---- submit_tentative : corrige, note /20, attribue badges et points -------
create or replace function public.submit_tentative(p_tentative_id uuid, p_reponses jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tentative record;
  v_question record;
  v_reponse jsonb;
  v_total_points numeric := 0;
  v_points_obtenus numeric := 0;
  v_correcte boolean;
  v_note numeric;
  v_ancienne_meilleure numeric;
  v_delta_points int;
  v_corrections jsonb := '[]'::jsonb;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  -- Le verrou rend la soumission atomique : deux requêtes concurrentes ne
  -- peuvent plus corriger ni créditer deux fois la même tentative.
  select * into v_tentative from public.tentatives
    where id = p_tentative_id and user_id = auth.uid()
    for update;
  if v_tentative is null then
    raise exception 'tentative_introuvable';
  end if;

  -- Une relance réseau après une soumission réussie est sans effet.
  if v_tentative.statut = 'terminee' then
    return jsonb_build_object(
      'note', v_tentative.note,
      'corrections', '[]'::jsonb,
      'deja_soumise', true
    );
  end if;
  if v_tentative.statut <> 'en_cours' then
    raise exception 'tentative_introuvable';
  end if;

  -- Tolérance courte pour le temps de transport de la requête déclenchée à 0.
  if v_tentative.date_fin_theorique is not null
     and now() > v_tentative.date_fin_theorique + interval '10 seconds' then
    raise exception 'temps_ecoule';
  end if;

  select max(note) into v_ancienne_meilleure from public.tentatives
    where user_id = auth.uid() and quiz_id = v_tentative.quiz_id and statut = 'terminee';

  for v_question in select * from public.questions where quiz_id = v_tentative.quiz_id loop
    v_total_points := v_total_points + v_question.points;
    v_reponse := (
      select r -> 'choix' from jsonb_array_elements(p_reponses) r
      where (r ->> 'question_id') = v_question.id::text limit 1
    );
    v_correcte := coalesce(v_reponse, 'null'::jsonb) = v_question.bonnes_reponses;

    if v_correcte then
      v_points_obtenus := v_points_obtenus + v_question.points;
    end if;

    insert into public.reponses (tentative_id, question_id, choix_selectionnes, correcte)
    values (p_tentative_id, v_question.id, v_reponse, v_correcte)
    on conflict (tentative_id, question_id) do nothing;

    v_corrections := v_corrections || jsonb_build_object(
      'question_id', v_question.id,
      'correcte', v_correcte,
      'bonnes_reponses', v_question.bonnes_reponses,
      'explication', v_question.explication
    );
  end loop;

  v_note := case when v_total_points > 0 then round((v_points_obtenus / v_total_points) * 20, 2) else 0 end;

  update public.tentatives set
    statut = 'terminee',
    note = v_note,
    temps_pris_sec = greatest(0, extract(epoch from (now() - created_at))::int)
  where id = p_tentative_id;

  if v_note > coalesce(v_ancienne_meilleure, -1) then
    v_delta_points := round((v_note - coalesce(v_ancienne_meilleure, 0)) * 2)::int;
    perform set_config('app.internal_update', 'on', true);
    update public.profiles set points_carriere = points_carriere + v_delta_points where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());

  return jsonb_build_object('note', v_note, 'corrections', v_corrections);
end;
$$;

-- ---- Validation question par question et feedback immediat ----------------
create or replace function public.norm_txt(p text)
returns text language sql immutable set search_path = public as $$
  select btrim(regexp_replace(
    translate(lower(coalesce(p, '')),
      'àâäáãçéèêëíìîïñóòôöõúùûüýÿ',
      'aaaaaceeeeiiiinooooouuuuyy'),
    '\s+', ' ', 'g'));
$$;

create or replace function public.answer_question(
  p_tentative_id uuid,
  p_question_id uuid,
  p_choix jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tentative record;
  v_q record;
  v_exist record;
  v_correcte boolean;
  v_user_txt text;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select * into v_tentative from public.tentatives
    where id = p_tentative_id and user_id = auth.uid()
    for update;
  if v_tentative is null then raise exception 'tentative_introuvable'; end if;
  if v_tentative.statut <> 'en_cours' then raise exception 'tentative_close'; end if;
  if v_tentative.date_fin_theorique is not null
     and now() > v_tentative.date_fin_theorique + interval '10 seconds' then
    raise exception 'temps_ecoule';
  end if;

  if exists (
    select 1 from public.quiz
    where id = v_tentative.quiz_id and not est_note
  ) then
    raise exception 'utiliser_entrainement_rpc';
  end if;

  select * into v_q from public.questions
    where id = p_question_id and quiz_id = v_tentative.quiz_id;
  if v_q is null then raise exception 'question_introuvable'; end if;

  select * into v_exist from public.reponses
    where tentative_id = p_tentative_id and question_id = p_question_id;
  if v_exist is not null then
    return jsonb_build_object(
      'correcte', v_exist.correcte,
      'bonnes_reponses', v_q.bonnes_reponses,
      'explication', v_q.explication,
      'points', v_q.points,
      'deja', true
    );
  end if;

  if v_q.type = 'texte' then
    v_user_txt := coalesce(p_choix #>> '{}', '');
    if jsonb_typeof(v_q.bonnes_reponses) = 'array' then
      v_correcte := exists (
        select 1 from jsonb_array_elements_text(v_q.bonnes_reponses) e
        where public.norm_txt(e) = public.norm_txt(v_user_txt)
      );
    else
      v_correcte := public.norm_txt(v_q.bonnes_reponses #>> '{}') = public.norm_txt(v_user_txt);
    end if;
  else
    v_correcte := coalesce(p_choix, 'null'::jsonb) = v_q.bonnes_reponses;
  end if;

  insert into public.reponses (tentative_id, question_id, choix_selectionnes, correcte)
  values (p_tentative_id, p_question_id, p_choix, v_correcte)
  on conflict (tentative_id, question_id) do nothing;

  return jsonb_build_object(
    'correcte', v_correcte,
    'bonnes_reponses', v_q.bonnes_reponses,
    'explication', v_q.explication,
    'points', v_q.points,
    'deja', false
  );
end;
$$;

-- Une tentative de pack non note est fermee sans note, XP ni badge. La branche
-- de notation historique reste reservee aux quiz/devoirs est_note = true.
create or replace function public.finalize_tentative(p_tentative_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tentative record;
  v_est_note boolean;
  v_total numeric := 0;
  v_obtenus numeric := 0;
  v_note numeric;
  v_ancienne numeric;
  v_delta int;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select * into v_tentative from public.tentatives
    where id = p_tentative_id and user_id = auth.uid()
    for update;
  if v_tentative is null then raise exception 'tentative_introuvable'; end if;

  select est_note into v_est_note from public.quiz where id = v_tentative.quiz_id;
  if not coalesce(v_est_note, true) then
    if v_tentative.statut = 'en_cours' then
      update public.tentatives set
        statut = 'terminee',
        note = null,
        temps_pris_sec = greatest(0, extract(epoch from (now() - created_at))::int)
      where id = p_tentative_id;
    end if;
    return jsonb_build_object(
      'non_note', true,
      'note', null,
      'deja_soumise', v_tentative.statut = 'terminee'
    );
  end if;

  if v_tentative.statut = 'terminee' then
    return jsonb_build_object(
      'note', v_tentative.note,
      'deja_soumise', true,
      'non_note', false
    );
  end if;
  if v_tentative.statut <> 'en_cours' then raise exception 'tentative_introuvable'; end if;

  if v_tentative.date_fin_theorique is not null
     and now() > v_tentative.date_fin_theorique + interval '10 seconds' then
    raise exception 'temps_ecoule';
  end if;

  select coalesce(sum(points), 0) into v_total
    from public.questions where quiz_id = v_tentative.quiz_id;
  select coalesce(sum(q.points), 0) into v_obtenus
    from public.reponses r
    join public.questions q on q.id = r.question_id
    where r.tentative_id = p_tentative_id and r.correcte;

  v_note := case when v_total > 0 then round((v_obtenus / v_total) * 20, 2) else 0 end;

  select max(note) into v_ancienne from public.tentatives
    where user_id = auth.uid() and quiz_id = v_tentative.quiz_id and statut = 'terminee';

  update public.tentatives set
    statut = 'terminee',
    note = v_note,
    temps_pris_sec = greatest(0, extract(epoch from (now() - created_at))::int)
  where id = p_tentative_id;

  if v_note > coalesce(v_ancienne, -1) then
    v_delta := round((v_note - coalesce(v_ancienne, 0)) * 2)::int;
    perform set_config('app.internal_update', 'on', true);
    update public.profiles set points_carriere = points_carriere + v_delta where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());
  return jsonb_build_object('note', v_note, 'non_note', false);
end;
$$;

revoke all on function public.start_tentative(uuid) from public, anon;
grant execute on function public.start_tentative(uuid) to authenticated;
revoke all on function public.answer_question(uuid, uuid, jsonb) from public, anon;
grant execute on function public.answer_question(uuid, uuid, jsonb) to authenticated;
revoke all on function public.finalize_tentative(uuid) from public, anon;
grant execute on function public.finalize_tentative(uuid) to authenticated;
-- Le client actuel utilise answer_question + finalize_tentative. Garder
-- submit_tentative prive evite tout contournement de la branche non notee.
revoke all on function public.submit_tentative(uuid, jsonb)
  from public, anon, authenticated;

-- ---- get_tentative_resultat : correction complète (relecture après coup) ---
create or replace function public.get_tentative_resultat(p_tentative_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tentative record;
  v_quiz record;
  v_corrections jsonb;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_tentative from public.tentatives where id = p_tentative_id;
  if v_tentative is null or (v_tentative.user_id <> auth.uid() and not public.is_admin()) then
    raise exception 'tentative_introuvable';
  end if;
  if v_tentative.statut <> 'terminee' then
    raise exception 'tentative_non_terminee';
  end if;

  select * into v_quiz from public.quiz where id = v_tentative.quiz_id;

  if not coalesce(v_quiz.est_note, true) then
    raise exception 'utiliser_entrainement_rpc';
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id, 'ordre', q.ordre, 'enonce', q.enonce, 'choix', q.choix, 'image_url', q.image_url,
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
    'quiz', jsonb_build_object('id', v_quiz.id, 'titre', v_quiz.titre, 'type', v_quiz.type),
    'questions', coalesce(v_corrections, '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_tentative_resultat(uuid) from public, anon;
grant execute on function public.get_tentative_resultat(uuid) to authenticated;

-- ============================================================================
-- 13 bis. ENTRAINEMENT NON NOTE
-- ============================================================================

create or replace function public.get_exercices_entrainement(
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
  v_profile record;
  v_chapitre record;
  v_quiz record;
  v_questions jsonb;
  v_limite_decouverte int;
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

  if v_profile is null then
    raise exception 'profil_introuvable';
  end if;

  select * into v_chapitre
  from public.chapitres
  where id = p_chapitre_id and published = true;

  if v_chapitre is null then
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

  select * into v_quiz
  from public.quiz
  where chapitre_id = p_chapitre_id
    and type = 'chapitre'
    and palier = p_palier
    and not est_note
    and published = true
  limit 1;

  if v_quiz is null then
    raise exception 'entrainement_introuvable';
  end if;

  select jsonb_agg(
    jsonb_build_object(
      'id', q.id,
      'ordre', q.ordre,
      'enonce', q.enonce,
      'type', q.type,
      'choix', q.choix,
      'image_url', q.image_url,
      'validation', case
        when vr.reponse_id is null then null
        else jsonb_build_object(
          'choix_selectionnes', vr.choix_selectionnes,
          'correcte', vr.correcte,
          'bonnes_reponses', q.bonnes_reponses,
          'explication', q.explication
        )
      end
    )
    order by q.ordre
  ) into v_questions
  from public.questions q
  left join lateral (
    select
      r.id as reponse_id,
      r.choix_selectionnes,
      r.correcte
    from public.tentatives t
    join public.reponses r
      on r.tentative_id = t.id
     and r.question_id = q.id
    where t.user_id = auth.uid()
      and t.quiz_id = v_quiz.id
    order by t.updated_at desc, t.created_at desc
    limit 1
  ) vr on true
  where q.quiz_id = v_quiz.id;

  return jsonb_build_object(
    'chapitre', jsonb_build_object(
      'id', v_chapitre.id,
      'titre', v_chapitre.titre
    ),
    'palier', v_quiz.palier,
    'titre', v_quiz.titre,
    'questions', coalesce(v_questions, '[]'::jsonb)
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 4. Validation atomique d'un exercice et revelation de sa correction.
-- --------------------------------------------------------------------------

create or replace function public.valider_exercice_entrainement(
  p_question_id uuid,
  p_choix jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile record;
  v_chapitre record;
  v_quiz record;
  v_question record;
  v_tentative record;
  v_exist record;
  v_correcte boolean;
  v_user_txt text;
  v_numero_tentative int;
  v_limite_decouverte int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile is null then
    raise exception 'profil_introuvable';
  end if;

  select q.* into v_question
  from public.questions q
  join public.quiz qz on qz.id = q.quiz_id
  join public.chapitres c on c.id = qz.chapitre_id
  where q.id = p_question_id
    and qz.type = 'chapitre'
    and qz.palier is not null
    and not qz.est_note
    and qz.published = true
    and c.published = true;

  if v_question is null then
    raise exception 'exercice_introuvable';
  end if;

  select * into v_quiz
  from public.quiz
  where id = v_question.quiz_id;

  select * into v_chapitre
  from public.chapitres
  where id = v_quiz.chapitre_id;

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

  if nullif(btrim(coalesce(v_question.explication, '')), '') is null then
    raise exception 'correction_indisponible';
  end if;

  if p_choix is null or p_choix = 'null'::jsonb then
    raise exception 'reponse_requise';
  end if;

  if v_question.type = 'qcm' then
    if jsonb_typeof(p_choix) <> 'string'
       or jsonb_typeof(v_question.choix) <> 'array'
       or not (v_question.choix @> jsonb_build_array(p_choix)) then
      raise exception 'choix_invalide';
    end if;
  elsif v_question.type = 'texte' then
    if jsonb_typeof(p_choix) <> 'string'
       or btrim(coalesce(p_choix #>> '{}', '')) = '' then
      raise exception 'reponse_requise';
    end if;
  else
    raise exception 'type_question_invalide';
  end if;

  -- Serialise les validations d'un meme utilisateur/palier. Le second appel
  -- concurrent relit la reponse creee par le premier au lieu de la dupliquer.
  perform pg_advisory_xact_lock(
    hashtextextended(auth.uid()::text || ':' || v_quiz.id::text, 0)
  );

  select
    r.id,
    r.choix_selectionnes,
    r.correcte,
    t.id as tentative_id
  into v_exist
  from public.tentatives t
  join public.reponses r
    on r.tentative_id = t.id
   and r.question_id = p_question_id
  where t.user_id = auth.uid()
    and t.quiz_id = v_quiz.id
  order by t.updated_at desc, t.created_at desc
  limit 1;

  if v_exist is not null then
    return jsonb_build_object(
      'question_id', p_question_id,
      'tentative_id', v_exist.tentative_id,
      'validee', true,
      'correcte', v_exist.correcte,
      'choix_selectionnes', v_exist.choix_selectionnes,
      'bonnes_reponses', v_question.bonnes_reponses,
      'explication', v_question.explication,
      'deja_validee', true
    );
  end if;

  select * into v_tentative
  from public.tentatives
  where user_id = auth.uid()
    and quiz_id = v_quiz.id
    and statut = 'en_cours'
  order by created_at desc
  limit 1
  for update;

  if v_tentative is null then
    select count(*) + 1 into v_numero_tentative
    from public.tentatives
    where user_id = auth.uid() and quiz_id = v_quiz.id;

    insert into public.tentatives (
      user_id,
      quiz_id,
      numero_tentative,
      statut,
      note,
      date_fin_theorique
    ) values (
      auth.uid(),
      v_quiz.id,
      v_numero_tentative,
      'en_cours',
      null,
      null
    )
    returning * into v_tentative;
  end if;

  if v_question.type = 'texte' then
    v_user_txt := coalesce(p_choix #>> '{}', '');
    if jsonb_typeof(v_question.bonnes_reponses) = 'array' then
      v_correcte := exists (
        select 1
        from jsonb_array_elements_text(v_question.bonnes_reponses) e
        where public.norm_txt(e) = public.norm_txt(v_user_txt)
      );
    else
      v_correcte := public.norm_txt(v_question.bonnes_reponses #>> '{}')
        = public.norm_txt(v_user_txt);
    end if;
  else
    v_correcte := p_choix = v_question.bonnes_reponses;
  end if;

  insert into public.reponses (
    tentative_id,
    question_id,
    choix_selectionnes,
    correcte
  ) values (
    v_tentative.id,
    p_question_id,
    p_choix,
    v_correcte
  )
  on conflict (tentative_id, question_id) do nothing;

  -- Une mauvaise reponse compte elle aussi comme exercice valide. Lorsque tous
  -- les exercices du palier ont au moins une reponse, toute tentative interne
  -- encore ouverte est fermee sans note.
  if not exists (
    select 1
    from public.questions q
    where q.quiz_id = v_quiz.id
      and not exists (
        select 1
        from public.tentatives t
        join public.reponses r
          on r.tentative_id = t.id
         and r.question_id = q.id
        where t.user_id = auth.uid()
          and t.quiz_id = v_quiz.id
      )
  ) then
    update public.tentatives
    set statut = 'terminee',
        note = null,
        temps_pris_sec = greatest(0, extract(epoch from (now() - created_at))::int)
    where user_id = auth.uid()
      and quiz_id = v_quiz.id
      and statut = 'en_cours';
  end if;

  return jsonb_build_object(
    'question_id', p_question_id,
    'tentative_id', v_tentative.id,
    'validee', true,
    'correcte', v_correcte,
    'choix_selectionnes', p_choix,
    'bonnes_reponses', v_question.bonnes_reponses,
    'explication', v_question.explication,
    'deja_validee', false
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 5. Progression des trois niveaux d'une lecon.
-- --------------------------------------------------------------------------

create or replace function public.get_niveaux_exercices_chapitre(
  p_chapitre_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile record;
  v_chapitre record;
  v_niveaux jsonb;
  v_total int;
  v_valides int;
  v_limite_decouverte int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile is null then
    raise exception 'profil_introuvable';
  end if;

  select * into v_chapitre
  from public.chapitres
  where id = p_chapitre_id and published = true;

  if v_chapitre is null then
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
      qz.palier,
      qz.titre,
      qz.numero,
      count(distinct q.id)::int as total,
      count(distinct r.question_id)::int as valides
    from public.quiz qz
    left join public.questions q on q.quiz_id = qz.id
    left join public.tentatives t
      on t.quiz_id = qz.id
     and t.user_id = auth.uid()
    left join public.reponses r
      on r.tentative_id = t.id
     and r.question_id = q.id
    where qz.chapitre_id = p_chapitre_id
      and qz.type = 'chapitre'
      and qz.palier is not null
      and not qz.est_note
      and qz.published = true
    group by qz.id, qz.palier, qz.titre, qz.numero
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
        'exercices_valides', s.valides,
        'pourcentage', case
          when s.total = 0 then 0
          else round(100.0 * s.valides / s.total)::int
        end
      )
      order by case s.palier
        when 'entrainement' then 1
        when 'maitrise' then 2
        when 'concours' then 3
        else 4
      end
    ), '[]'::jsonb),
    coalesce(sum(s.total), 0)::int,
    coalesce(sum(s.valides), 0)::int
  into v_niveaux, v_total, v_valides
  from stats s;

  return jsonb_build_object(
    'chapitre', jsonb_build_object(
      'id', v_chapitre.id,
      'titre', v_chapitre.titre
    ),
    'exercices_total', v_total,
    'exercices_valides', v_valides,
    'pourcentage', case
      when v_total = 0 then 0
      else round(100.0 * v_valides / v_total)::int
    end,
    'niveaux', v_niveaux
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 6. Progression lecon par lecon pour les cartes d'une matiere.
-- --------------------------------------------------------------------------

create or replace function public.get_progression_exercices_matiere(
  p_matiere_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile record;
  v_matiere record;
  v_chapitres jsonb;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_profile
  from public.profiles
  where id = auth.uid();

  if v_profile is null then
    raise exception 'profil_introuvable';
  end if;

  select * into v_matiere
  from public.matieres
  where id = p_matiere_id;

  if v_matiere is null then
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
      count(distinct q.id)::int as total,
      count(distinct r.question_id)::int as valides
    from public.chapitres c
    left join public.quiz qz
      on qz.chapitre_id = c.id
     and qz.type = 'chapitre'
     and qz.palier is not null
     and not qz.est_note
     and qz.published = true
    left join public.questions q on q.quiz_id = qz.id
    left join public.tentatives t
      on t.quiz_id = qz.id
     and t.user_id = auth.uid()
    left join public.reponses r
      on r.tentative_id = t.id
     and r.question_id = q.id
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
      'exercices_valides', s.valides,
      'pourcentage', case
        when s.total = 0 then 0
        else round(100.0 * s.valides / s.total)::int
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

revoke all on function public.get_exercices_entrainement(uuid, text)
  from public, anon;
revoke all on function public.valider_exercice_entrainement(uuid, jsonb)
  from public, anon;
revoke all on function public.get_niveaux_exercices_chapitre(uuid)
  from public, anon;
revoke all on function public.get_progression_exercices_matiere(uuid)
  from public, anon;

grant execute on function public.get_exercices_entrainement(uuid, text)
  to authenticated;
grant execute on function public.valider_exercice_entrainement(uuid, jsonb)
  to authenticated;
grant execute on function public.get_niveaux_exercices_chapitre(uuid)
  to authenticated;
grant execute on function public.get_progression_exercices_matiere(uuid)
  to authenticated;

-- ---- Quiz rapide : question et correction entièrement côté serveur ----------
drop function if exists public.quiz_add_result(uuid, boolean);

create or replace function public.get_quiz_rapide_question(p_matiere_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_niveau_id uuid;
  v_serie_id uuid;
  v_question public.quiz_rapide_questions%rowtype;
  v_challenge_id uuid;
  v_choix jsonb;
  v_expires_at timestamptz := now() + interval '2 minutes';
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select p.niveau_id, p.serie_id into v_niveau_id, v_serie_id
  from public.profiles p where p.id = auth.uid();
  if v_serie_id is null then raise exception 'profil_incomplet'; end if;

  if not exists (
    select 1 from public.matieres_series ms
    where ms.matiere_id = p_matiere_id and ms.serie_id = v_serie_id
  ) then
    raise exception 'matiere_non_autorisee';
  end if;

  select q.* into v_question
  from public.quiz_rapide_questions q
  where q.matiere_id = p_matiere_id
    and q.active = true
    and (q.niveau_id is null or q.niveau_id = v_niveau_id)
  order by random()
  limit 1;
  if v_question is null then raise exception 'contenu_insuffisant'; end if;

  -- Un seul challenge actif par élève évite les préchargements massifs.
  delete from public.quiz_rapide_challenges
  where user_id = auth.uid() and answered_at is null;

  select jsonb_agg(e.value order by random()) into v_choix
  from jsonb_array_elements(v_question.choix) e;

  insert into public.quiz_rapide_challenges
    (user_id, matiere_id, question_id, expires_at)
  values (auth.uid(), p_matiere_id, v_question.id, v_expires_at)
  returning id into v_challenge_id;

  return jsonb_build_object(
    'challenge_id', v_challenge_id,
    'enonce', v_question.enonce,
    'choix', v_choix,
    'expires_at', v_expires_at
  );
end;
$$;

create or replace function public.submit_quiz_rapide(p_challenge_id uuid, p_choix text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_challenge public.quiz_rapide_challenges%rowtype;
  v_question public.quiz_rapide_questions%rowtype;
  v_score public.quiz_scores%rowtype;
  v_bonne boolean;
  v_approuve boolean;
  v_total_questions int;
  v_limite_decouverte int := 30;
  v_anti_spam_ms int := 1500;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select c.* into v_challenge
  from public.quiz_rapide_challenges c
  where c.id = p_challenge_id and c.user_id = auth.uid()
  for update;
  if v_challenge is null then raise exception 'question_introuvable'; end if;
  if v_challenge.answered_at is not null then raise exception 'question_deja_repondue'; end if;
  if now() > v_challenge.expires_at then raise exception 'question_expiree'; end if;

  select q.* into v_question
  from public.quiz_rapide_questions q where q.id = v_challenge.question_id;
  if v_question is null or not v_question.active then raise exception 'question_introuvable'; end if;
  if not exists (
    select 1 from jsonb_array_elements_text(v_question.choix) c(value)
    where c.value = p_choix
  ) then
    raise exception 'choix_invalide';
  end if;

  select p.approuve into v_approuve from public.profiles p where p.id = auth.uid();
  if not coalesce(v_approuve, false) then
    select coalesce(sum(qs.nb_questions), 0) into v_total_questions
    from public.quiz_scores qs where qs.user_id = auth.uid();
    select coalesce((s.valeur #>> '{}')::int, 30) into v_limite_decouverte
    from public.app_settings s where s.cle = 'decouverte_quiz_rapide_limite';
    if v_total_questions >= coalesce(v_limite_decouverte, 30) then
      raise exception 'quota_decouverte_atteint';
    end if;
  end if;

  insert into public.quiz_scores
    (user_id, matiere_id, points, nb_bonnes, nb_questions, streak_actuel, streak_max)
  values (auth.uid(), v_challenge.matiere_id, 0, 0, 0, 0, 0)
  on conflict (user_id, matiere_id) do nothing;

  select qs.* into v_score from public.quiz_scores qs
  where qs.user_id = auth.uid() and qs.matiere_id = v_challenge.matiere_id
  for update;

  select coalesce((s.valeur #>> '{}')::int, 1500) into v_anti_spam_ms
  from public.app_settings s where s.cle = 'anti_spam_quiz_rapide_ms';
  if v_score.derniere_reponse_at is not null
     and v_score.derniere_reponse_at > now() - make_interval(
       secs => coalesce(v_anti_spam_ms, 1500)::double precision / 1000.0
     ) then
    raise exception 'trop_rapide';
  end if;

  v_bonne := p_choix = v_question.bonne_reponse;
  update public.quiz_rapide_challenges set answered_at = now()
  where id = v_challenge.id;

  update public.quiz_scores set
    points = points + case when v_bonne then 5 else 0 end,
    nb_bonnes = nb_bonnes + case when v_bonne then 1 else 0 end,
    nb_questions = nb_questions + 1,
    streak_actuel = case when v_bonne then streak_actuel + 1 else 0 end,
    streak_max = greatest(streak_max, case when v_bonne then streak_actuel + 1 else streak_actuel end),
    derniere_reponse_at = now(),
    updated_at = now()
  where user_id = auth.uid() and matiere_id = v_challenge.matiere_id
  returning * into v_score;

  if v_bonne then
    perform set_config('app.internal_update', 'on', true);
    update public.profiles set points_carriere = points_carriere + 5 where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());

  return jsonb_build_object(
    'bonne', v_bonne,
    'bonne_reponse', v_question.bonne_reponse,
    'points', v_score.points,
    'streak_actuel', v_score.streak_actuel,
    'streak_max', v_score.streak_max
  );
end;
$$;

revoke all on function public.get_quiz_rapide_question(uuid) from public, anon;
revoke all on function public.submit_quiz_rapide(uuid, text) from public, anon;
grant execute on function public.get_quiz_rapide_question(uuid) to authenticated;
grant execute on function public.submit_quiz_rapide(uuid, text) to authenticated;

-- ---- Classements -------------------------------------------------------------
create or replace function public.get_classement_matiere(p_matiere_id uuid, p_niveau_id uuid, p_serie_id uuid)
returns table (user_id uuid, username text, avatar_url text, points numeric, nb_quiz int, temps_total int)
language sql stable security definer set search_path = public as $$
  with meilleures as (
    select distinct on (t.user_id, t.quiz_id)
      t.user_id, t.quiz_id, t.note, t.temps_pris_sec
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.statut = 'terminee'
      and (q.matiere_id = p_matiere_id
           or q.chapitre_id in (select id from public.chapitres c where c.matiere_id = p_matiere_id))
    order by t.user_id, t.quiz_id, t.note desc nulls last, t.temps_pris_sec asc nulls last
  )
  select p.id, p.username, p.avatar_url,
    coalesce(sum(m.note), 0) * 2 as points,
    count(m.quiz_id)::int as nb_quiz,
    coalesce(sum(m.temps_pris_sec), 0)::int as temps_total
  from public.profiles p
  left join meilleures m on m.user_id = p.id
  where p.niveau_id = p_niveau_id and p.serie_id = p_serie_id and p.approuve = true
  group by p.id, p.username, p.avatar_url
  order by points desc, nb_quiz desc, temps_total asc;
$$;

create or replace function public.get_classement_classe(p_niveau_id uuid, p_serie_id uuid)
returns table (user_id uuid, username text, avatar_url text, points numeric, nb_quiz int, temps_total int)
language sql stable security definer set search_path = public as $$
  with meilleures as (
    select distinct on (t.user_id, t.quiz_id)
      t.user_id, t.quiz_id, t.note, t.temps_pris_sec
    from public.tentatives t
    where t.statut = 'terminee'
    order by t.user_id, t.quiz_id, t.note desc nulls last, t.temps_pris_sec asc nulls last
  )
  select p.id, p.username, p.avatar_url,
    coalesce(sum(m.note), 0) * 2 as points,
    count(m.quiz_id)::int as nb_quiz,
    coalesce(sum(m.temps_pris_sec), 0)::int as temps_total
  from public.profiles p
  left join meilleures m on m.user_id = p.id
  where p.niveau_id = p_niveau_id and p.serie_id = p_serie_id and p.approuve = true
  group by p.id, p.username, p.avatar_url
  order by points desc, nb_quiz desc, temps_total asc;
$$;

create or replace function public.get_classement_etablissement()
returns table (etablissement text, points_moyen numeric, nb_eleves int)
language sql stable security definer set search_path = public as $$
  select p.etablissement, avg(p.points_carriere)::numeric(10,2) as points_moyen, count(*)::int as nb_eleves
  from public.profiles p
  where p.etablissement is not null and p.approuve = true
  group by p.etablissement
  having count(*) >= 5
  order by points_moyen desc;
$$;

create or replace function public.get_classement_quiz_rapide()
returns table (user_id uuid, username text, avatar_url text, points bigint, streak_max int)
language sql stable security definer set search_path = public as $$
  select p.id, p.username, p.avatar_url, sum(qs.points)::bigint as points, max(qs.streak_max) as streak_max
  from public.profiles p
  join public.quiz_scores qs on qs.user_id = p.id
  where p.approuve = true
  group by p.id, p.username, p.avatar_url
  order by points desc;
$$;

-- ---- Like d'un profil public ---------------------------------------------------
create or replace function public.toggle_like_profile(p_liked_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_deja_like boolean;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  if p_liked_id = auth.uid() then raise exception 'auto_like_interdit'; end if;

  select exists(select 1 from public.profil_likes where liker_id = auth.uid() and liked_id = p_liked_id) into v_deja_like;

  if v_deja_like then
    delete from public.profil_likes where liker_id = auth.uid() and liked_id = p_liked_id;
    update public.profiles set likes = greatest(0, likes - 1) where id = p_liked_id;
  else
    insert into public.profil_likes (liker_id, liked_id) values (auth.uid(), p_liked_id);
    update public.profiles set likes = likes + 1 where id = p_liked_id;
  end if;

  return jsonb_build_object('like', not v_deja_like);
end;
$$;

-- ---- Stats publiques d'un profil (défis) ---------------------------------------
-- La table defis n'est lisible que par ses participants ; cette fonction expose
-- uniquement le bilan agrégé, consultable par tout utilisateur connecté.
create or replace function public.get_public_profile_stats(p_user_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'defis_joues', count(*),
    'victoires', count(*) filter (where gagnant_id = p_user_id),
    'defaites', count(*) filter (where gagnant_id is not null and gagnant_id <> p_user_id)
  )
  from public.defis
  where statut = 'termine' and (challenger_id = p_user_id or adversaire_id = p_user_id);
$$;

-- ---- Statistiques publiques (landing page) -----------------------------------
create or replace function public.get_stats_globales()
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'nb_eleves', (select count(*) from public.profiles where approuve = true),
    'nb_questions', (select count(*) from public.questions),
    'nb_quiz_joues', (select count(*) from public.tentatives where statut = 'terminee'),
    'nb_etablissements', (select count(distinct etablissement) from public.profiles where etablissement is not null)
  );
$$;

-- ---- Défis 1v1 ---------------------------------------------------------------
-- Liste sûre : quiz_genere et ses corrections ne quittent jamais la fonction.
create or replace function public.get_mes_defis()
returns table (
  id uuid,
  challenger_id uuid,
  adversaire_id uuid,
  statut text,
  score_challenger int,
  score_adversaire int,
  temps_challenger int,
  temps_adversaire int,
  gagnant_id uuid,
  created_at timestamptz,
  terminated_at timestamptz
)
language sql stable security definer set search_path = public as $$
  select d.id, d.challenger_id, d.adversaire_id, d.statut,
    d.score_challenger, d.score_adversaire,
    d.temps_challenger, d.temps_adversaire,
    d.gagnant_id, d.created_at, d.terminated_at
  from public.defis d
  where auth.uid() is not null
    and (d.challenger_id = auth.uid() or d.adversaire_id = auth.uid())
  order by d.created_at desc;
$$;

create or replace function public.create_defi(p_adversaire_id uuid, p_matiere_id uuid)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_defi_id uuid;
  v_questions jsonb;
  v_niveau_id uuid;
  v_serie_id uuid;
  v_approuve boolean;
  v_adv_niveau_id uuid;
  v_adv_serie_id uuid;
  v_adv_approuve boolean;
  v_defis_actifs boolean := true;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  if p_adversaire_id = auth.uid() then raise exception 'auto_defi_interdit'; end if;

  select p.niveau_id, p.serie_id, p.approuve
  into v_niveau_id, v_serie_id, v_approuve
  from public.profiles p where p.id = auth.uid();
  if not coalesce(v_approuve, false) then raise exception 'compte_non_approuve'; end if;

  select p.niveau_id, p.serie_id, p.approuve
  into v_adv_niveau_id, v_adv_serie_id, v_adv_approuve
  from public.profiles p where p.id = p_adversaire_id;
  if not found or not coalesce(v_adv_approuve, false)
     or v_adv_niveau_id is distinct from v_niveau_id
     or v_adv_serie_id is distinct from v_serie_id then
    raise exception 'adversaire_non_autorise';
  end if;

  select coalesce((s.valeur #>> '{}')::boolean, true) into v_defis_actifs
  from public.app_settings s where s.cle = 'fonctionnalite_defis_active';
  if not coalesce(v_defis_actifs, true) then raise exception 'defis_desactives'; end if;

  if not exists (
    select 1 from public.matieres_series ms
    where ms.matiere_id = p_matiere_id and ms.serie_id = v_serie_id
  ) then
    raise exception 'matiere_non_autorisee';
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id, 'enonce', q.enonce, 'choix', q.choix,
    'bonnes_reponses', q.bonnes_reponses,
    'points', q.points, 'explication', q.explication
  )) into v_questions
  from (
    select qu.* from public.questions qu
    join public.quiz qz on qz.id = qu.quiz_id
    join public.chapitres c on c.id = qz.chapitre_id
    where c.matiere_id = p_matiere_id
      and c.serie_id = v_serie_id
      and qz.published = true
    order by random() limit 10
  ) q;

  if v_questions is null or jsonb_array_length(v_questions) = 0 then
    raise exception 'contenu_insuffisant';
  end if;

  insert into public.defis (challenger_id, adversaire_id, quiz_genere, statut)
  values (auth.uid(), p_adversaire_id, v_questions, 'en_attente')
  returning id into v_defi_id;

  return v_defi_id;
end;
$$;

create or replace function public.accept_defi(p_defi_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_defi public.defis%rowtype;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi from public.defis d
  where d.id = p_defi_id and d.adversaire_id = auth.uid() and d.statut = 'en_attente'
  for update;
  if v_defi is null then raise exception 'defi_introuvable'; end if;

  update public.defis set statut = 'en_cours' where id = p_defi_id;
  return jsonb_build_object('defi_id', v_defi.id);
end;
$$;

-- Questions sans correction. Le premier appel démarre le chronomètre serveur.
create or replace function public.get_defi_questions(p_defi_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_defi public.defis%rowtype;
  v_est_challenger boolean;
  v_questions_sans_reponses jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi from public.defis d
  where d.id = p_defi_id
    and (d.challenger_id = auth.uid() or d.adversaire_id = auth.uid())
    and d.statut in ('en_attente', 'en_cours')
  for update;
  if v_defi is null then raise exception 'defi_introuvable'; end if;

  v_est_challenger := v_defi.challenger_id = auth.uid();
  if not v_est_challenger and v_defi.statut <> 'en_cours' then
    raise exception 'defi_non_accepte';
  end if;
  if (v_est_challenger and v_defi.score_challenger is not null)
     or (not v_est_challenger and v_defi.score_adversaire is not null) then
    raise exception 'defi_deja_joue';
  end if;

  if v_est_challenger then
    update public.defis set started_challenger_at = coalesce(started_challenger_at, now())
    where id = p_defi_id;
  else
    update public.defis set started_adversaire_at = coalesce(started_adversaire_at, now())
    where id = p_defi_id;
  end if;

  select jsonb_agg(
    jsonb_build_object('id', e->'id', 'enonce', e->'enonce', 'choix', e->'choix', 'points', e->'points')
    order by ord
  ) into v_questions_sans_reponses
  from jsonb_array_elements(v_defi.quiz_genere) with ordinality as t(e, ord);

  return jsonb_build_object('defi_id', v_defi.id, 'questions', v_questions_sans_reponses);
end;
$$;

drop function if exists public.submit_defi(uuid, jsonb, integer);

create or replace function public.submit_defi(p_defi_id uuid, p_reponses jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_defi public.defis%rowtype;
  v_est_challenger boolean;
  v_started_at timestamptz;
  v_temps_sec int;
  v_score int := 0;
  v_question jsonb;
  v_reponse jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select d.* into v_defi from public.defis d
  where d.id = p_defi_id
    and (d.challenger_id = auth.uid() or d.adversaire_id = auth.uid())
    and d.statut in ('en_attente', 'en_cours')
  for update;
  if v_defi is null then raise exception 'defi_introuvable'; end if;

  v_est_challenger := v_defi.challenger_id = auth.uid();
  if not v_est_challenger and v_defi.statut <> 'en_cours' then
    raise exception 'defi_non_accepte';
  end if;
  if (v_est_challenger and v_defi.score_challenger is not null)
     or (not v_est_challenger and v_defi.score_adversaire is not null) then
    raise exception 'defi_deja_joue';
  end if;

  v_started_at := case when v_est_challenger
    then v_defi.started_challenger_at else v_defi.started_adversaire_at end;
  if v_started_at is null then raise exception 'defi_non_demarre'; end if;
  v_temps_sec := greatest(0, extract(epoch from (now() - v_started_at))::int);

  for v_question in select * from jsonb_array_elements(v_defi.quiz_genere) loop
    v_reponse := (
      select r -> 'choix' from jsonb_array_elements(p_reponses) r
      where (r ->> 'question_id') = (v_question ->> 'id') limit 1
    );
    if coalesce(v_reponse, 'null'::jsonb) = (v_question -> 'bonnes_reponses') then
      v_score := v_score + coalesce((v_question ->> 'points')::int, 1);
    end if;
  end loop;

  if v_est_challenger then
    update public.defis set score_challenger = v_score, temps_challenger = v_temps_sec
    where id = p_defi_id;
  else
    update public.defis set score_adversaire = v_score, temps_adversaire = v_temps_sec
    where id = p_defi_id;
  end if;

  select d.* into v_defi from public.defis d where d.id = p_defi_id;
  if v_defi.score_challenger is not null and v_defi.score_adversaire is not null then
    update public.defis set
      statut = 'termine',
      terminated_at = now(),
      gagnant_id = case
        when v_defi.score_challenger > v_defi.score_adversaire then v_defi.challenger_id
        when v_defi.score_adversaire > v_defi.score_challenger then v_defi.adversaire_id
        when v_defi.temps_challenger <= v_defi.temps_adversaire then v_defi.challenger_id
        else v_defi.adversaire_id
      end
    where id = p_defi_id;

    perform public.check_and_award_badges(v_defi.challenger_id);
    perform public.check_and_award_badges(v_defi.adversaire_id);
  end if;

  return jsonb_build_object('score', v_score, 'temps_sec', v_temps_sec);
end;
$$;

revoke all on function public.get_mes_defis() from public, anon;
revoke all on function public.create_defi(uuid, uuid) from public, anon;
revoke all on function public.accept_defi(uuid) from public, anon;
revoke all on function public.get_defi_questions(uuid) from public, anon;
revoke all on function public.submit_defi(uuid, jsonb) from public, anon;
grant execute on function public.get_mes_defis() to authenticated;
grant execute on function public.create_defi(uuid, uuid) to authenticated;
grant execute on function public.accept_defi(uuid) to authenticated;
grant execute on function public.get_defi_questions(uuid) to authenticated;
grant execute on function public.submit_defi(uuid, jsonb) to authenticated;

-- ============================================================================
-- Exercices guides v2
--
-- Un niveau contient un nombre variable d'exercices. Chaque exercice regroupe
-- au moins deux sous-questions affichees ensemble, sans QCM ni champ de reponse.
-- L'eleve declare l'exercice termine avant de recevoir sa correction complete.
-- Cette progression est volontairement separee des tentatives, notes, XP et
-- badges du moteur de quiz.
-- ============================================================================
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
  numero int not null check (numero > 0),
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

-- Un pack ne devient visible que s'il contient au moins un exercice, avec une
-- numerotation continue. Chaque exercice doit lui-meme contenir au moins deux
-- sous-questions numerotees sans trou et une correction complete.
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


-- ============================================================================
-- 14. ÉDITEUR ADMIN DES EXERCICES GUIDÉS
-- ============================================================================

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
  v_chapitre_code text;
  v_lot jsonb;
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

  if coalesce(jsonb_typeof(p_levels), 'null') <> 'array' then
    raise exception 'contenu_invalide';
  end if;

  if coalesce(pg_column_size(p_levels), 0) > 1048576 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select
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

  v_chapitre_code := coalesce(
    nullif(btrim(v_meta.chapitre_code), ''),
    'ADMIN-' || upper(replace(p_chapitre_id::text, '-', ''))
  );

  update public.chapitres
  set code = v_chapitre_code
  where id = p_chapitre_id
    and nullif(btrim(code), '') is null;

  v_lot := jsonb_build_object(
    'schema_version', 2,
    'batch_code',
      'admin-v2:' || p_chapitre_id::text || ':' || p_publication_id::text,
    'status', 'reviewed',
    'target', jsonb_build_object(
      'chapitre_id', p_chapitre_id,
      'chapitre_code', v_chapitre_code,
      'niveau', v_meta.niveau,
      'serie', v_meta.serie,
      'matiere_slug', v_meta.matiere_slug,
      'chapitre_ordre', v_meta.chapitre_ordre,
      'chapitre_titre', v_meta.chapitre_titre
    ),
    'source', jsonb_build_object(
      'code', 'ADMIN-EDITOR-' || upper(replace(p_chapitre_id::text, '-', '')),
      'titre', 'Saisie manuelle admin - ' || v_meta.chapitre_titre,
      'type', 'autre',
      'auteur_organisme', 'Administration EXCELLENCE',
      'url', null,
      'licence_code', null,
      'licence_url', null,
      'attribution', null,
      'droits_statut', 'permission',
      'storage_path', null,
      'sha256', null,
      'locator', 'Editeur admin des exercices guides',
      'notes', 'Contenu saisi et relu manuellement dans l administration.'
    ),
    'levels', p_levels
  );

  return public.importer_lot_exercices_v2(v_lot);
end;
$$;

revoke all on function public.publier_exercices_admin_v2(uuid, uuid, jsonb)
  from public, anon;
grant execute on function public.publier_exercices_admin_v2(uuid, uuid, jsonb)
  to authenticated;

-- La saisie manuelle admin autorise un nombre variable d'exercices par
-- difficulte. Cette definition finale remplace la facade stricte ci-dessus,
-- tandis que l'importeur editorial v2 conserve son contrat 3 x 3.
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

-- ============================================================================
-- Réactions (❤️ 👍 😐 ❌) et commentaires publics sur les résumés de leçons
-- Idempotent, rejouable. À coller dans Supabase SQL Editor > New query.
-- ============================================================================

-- ---- Tables ----------------------------------------------------------------

-- Une réaction unique par (chapitre, utilisateur), modifiable à volonté.
create table if not exists public.lecon_reactions (
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  reaction    text not null check (reaction in ('love','up','meh','bad')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (chapitre_id, user_id)
);
create index if not exists idx_lecon_reactions_chapitre on public.lecon_reactions(chapitre_id);

-- Commentaires libres (max 1000 caractères).
create table if not exists public.lecon_commentaires (
  id          uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  contenu     text not null check (char_length(btrim(contenu)) between 1 and 1000),
  created_at  timestamptz not null default now()
);
create index if not exists idx_lecon_commentaires_chapitre on public.lecon_commentaires(chapitre_id, created_at);

-- ---- Row Level Security ----------------------------------------------------

alter table public.lecon_reactions enable row level security;
alter table public.lecon_commentaires enable row level security;

-- Réactions : lecture publique (compteurs), écriture uniquement sur sa ligne.
drop policy if exists "lecon_reactions_select" on public.lecon_reactions;
create policy "lecon_reactions_select" on public.lecon_reactions for select using (true);
drop policy if exists "lecon_reactions_write_own" on public.lecon_reactions;
create policy "lecon_reactions_write_own" on public.lecon_reactions
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Commentaires : lecture publique, création par l'auteur, suppression auteur ou admin.
drop policy if exists "lecon_commentaires_select" on public.lecon_commentaires;
create policy "lecon_commentaires_select" on public.lecon_commentaires for select using (true);
drop policy if exists "lecon_commentaires_insert_own" on public.lecon_commentaires;
create policy "lecon_commentaires_insert_own" on public.lecon_commentaires
  for insert with check (user_id = auth.uid());
drop policy if exists "lecon_commentaires_delete_own" on public.lecon_commentaires;
create policy "lecon_commentaires_delete_own" on public.lecon_commentaires
  for delete using (user_id = auth.uid() or public.is_admin());

grant select on public.lecon_reactions to anon, authenticated;
grant insert, update, delete on public.lecon_reactions to authenticated;
grant select on public.lecon_commentaires to anon, authenticated;
grant insert, delete on public.lecon_commentaires to authenticated;

-- ---- RPC -------------------------------------------------------------------

-- Compteurs agrégés + réaction de l'utilisateur courant (consultable par tous).
create or replace function public.get_lecon_reactions(p_chapitre_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'love',  count(*) filter (where reaction = 'love'),
    'up',    count(*) filter (where reaction = 'up'),
    'meh',   count(*) filter (where reaction = 'meh'),
    'bad',   count(*) filter (where reaction = 'bad'),
    'total', count(*),
    'ma_reaction', (
      select r.reaction from public.lecon_reactions r
      where r.chapitre_id = p_chapitre_id and r.user_id = auth.uid()
    )
  )
  from public.lecon_reactions
  where chapitre_id = p_chapitre_id;
$$;

-- Poser / modifier / retirer sa réaction. Renvoie les compteurs à jour.
-- p_reaction = null (ou identique à l'actuelle) => on retire la réaction.
create or replace function public.set_lecon_reaction(p_chapitre_id uuid, p_reaction text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_current text;
begin
  if v_uid is null then raise exception 'auth_required'; end if;
  if p_reaction is not null and p_reaction not in ('love','up','meh','bad') then
    raise exception 'reaction_invalide';
  end if;

  select reaction into v_current from public.lecon_reactions
  where chapitre_id = p_chapitre_id and user_id = v_uid;

  if p_reaction is null or p_reaction = v_current then
    delete from public.lecon_reactions where chapitre_id = p_chapitre_id and user_id = v_uid;
  else
    insert into public.lecon_reactions (chapitre_id, user_id, reaction)
    values (p_chapitre_id, v_uid, p_reaction)
    on conflict (chapitre_id, user_id) do update set reaction = excluded.reaction, updated_at = now();
  end if;

  return public.get_lecon_reactions(p_chapitre_id);
end;
$$;

grant execute on function public.get_lecon_reactions(uuid) to anon, authenticated;
grant execute on function public.set_lecon_reaction(uuid, text) to authenticated;


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


-- ============================================================================
-- EXCELLENCE LYCÉE — atelier éditorial des résumés
-- Brouillons privés, historique immuable, publication atomique et suivi des
-- commentaires. Cette migration suppose 2026071301 déjà appliquée.
-- ============================================================================

begin;

-- La colonne `resume` reste exclusivement la version visible par les élèves.
alter table public.chapitres
  add column if not exists resume_revision bigint not null default 0,
  add column if not exists resume_updated_at timestamptz,
  add column if not exists resume_updated_by uuid references public.profiles(id) on delete set null;

alter table public.chapitres drop constraint if exists chapitres_resume_revision_positive;
alter table public.chapitres
  add constraint chapitres_resume_revision_positive check (resume_revision >= 0);

-- Les résumés déjà publiés deviennent la révision initiale sans modifier leur
-- contenu ni leur état de publication.
update public.chapitres
set
  resume_revision = 1,
  resume_updated_at = coalesce(resume_updated_at, created_at)
where resume_revision = 0
  and resume_published = true
  and nullif(btrim(resume), '') is not null;

create table if not exists public.resume_brouillons (
  chapitre_id uuid primary key references public.chapitres(id) on delete cascade,
  contenu text not null default '',
  base_revision bigint not null default 0 check (base_revision >= 0),
  revision bigint not null default 0 check (revision >= 0),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Un ancien résumé non publié était jusque-là conservé dans la colonne live,
-- donc techniquement lisible via l'API dès que le chapitre était public. Il
-- devient un vrai brouillon privé avant d'être retiré de la ligne élève.
insert into public.resume_brouillons (
  chapitre_id,
  contenu,
  base_revision,
  revision,
  updated_by,
  updated_at
)
select
  c.id,
  c.resume,
  0,
  1,
  c.resume_updated_by,
  coalesce(c.resume_updated_at, c.created_at, now())
from public.chapitres c
where c.resume_published = false
  and nullif(btrim(c.resume), '') is not null
on conflict (chapitre_id) do nothing;

update public.chapitres
set
  resume = '',
  resume_revision = 0,
  resume_updated_at = null,
  resume_updated_by = null
where resume_published = false
  and nullif(btrim(resume), '') is not null;

create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid not null references public.chapitres(id) on delete cascade,
  revision bigint not null check (revision > 0),
  contenu text not null,
  published_by uuid references public.profiles(id) on delete set null,
  published_at timestamptz not null default now(),
  unique (chapitre_id, revision)
);

create index if not exists idx_resume_versions_chapitre
  on public.resume_versions(chapitre_id, revision desc);

-- Le texte original du commentaire reste immuable. Seul ce suivi éditorial,
-- invisible aux élèves, peut être modifié par un administrateur.
create table if not exists public.lecon_commentaire_suivi (
  commentaire_id uuid primary key references public.lecon_commentaires(id) on delete cascade,
  statut text not null default 'nouveau' check (statut in ('nouveau', 'traite', 'ignore')),
  updated_by uuid references public.profiles(id) on delete set null,
  updated_at timestamptz not null default now()
);

-- Conserver une première version restaurable de chaque résumé historique.
insert into public.resume_versions (
  chapitre_id,
  revision,
  contenu,
  published_by,
  published_at
)
select
  c.id,
  c.resume_revision,
  c.resume,
  c.resume_updated_by,
  coalesce(c.resume_updated_at, c.created_at, now())
from public.chapitres c
where c.resume_revision > 0
  and c.resume_published = true
  and nullif(btrim(c.resume), '') is not null
on conflict (chapitre_id, revision) do nothing;

-- ---------------------------------------------------------------------------
-- RLS : aucun brouillon, historique ou statut interne n'est exposé aux élèves.
-- ---------------------------------------------------------------------------

alter table public.resume_brouillons enable row level security;
alter table public.resume_versions enable row level security;
alter table public.lecon_commentaire_suivi enable row level security;

drop policy if exists "resume_brouillons_admin" on public.resume_brouillons;
create policy "resume_brouillons_admin" on public.resume_brouillons
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "resume_versions_admin_read" on public.resume_versions;
create policy "resume_versions_admin_read" on public.resume_versions
  for select using (public.is_admin());

drop policy if exists "lecon_commentaire_suivi_admin" on public.lecon_commentaire_suivi;
create policy "lecon_commentaire_suivi_admin" on public.lecon_commentaire_suivi
  for all using (public.is_admin()) with check (public.is_admin());

revoke all on public.resume_brouillons, public.resume_versions, public.lecon_commentaire_suivi
  from anon, authenticated;
grant select, insert, update, delete on public.resume_brouillons, public.lecon_commentaire_suivi
  to authenticated;
grant select on public.resume_versions to authenticated;

-- ---------------------------------------------------------------------------
-- Lecture de l'atelier. Au premier accès, le live est copié dans un brouillon
-- privé afin que les résumés existants soient immédiatement modifiables.
-- ---------------------------------------------------------------------------

create or replace function public.get_resume_admin(p_chapitre_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_chapitre public.chapitres%rowtype;
  v_result jsonb;
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;

  select * into v_chapitre
  from public.chapitres
  where id = p_chapitre_id;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;

  insert into public.resume_brouillons (
    chapitre_id,
    contenu,
    base_revision,
    revision,
    updated_by
  )
  values (
    v_chapitre.id,
    coalesce(v_chapitre.resume, ''),
    v_chapitre.resume_revision,
    0,
    v_uid
  )
  on conflict (chapitre_id) do nothing;

  select jsonb_build_object(
    'chapitre_id', c.id,
    'titre', c.titre,
    'description', c.description,
    'ordre', c.ordre,
    'chapitre_published', c.published,
    'resume_published', c.resume_published,
    'contenu_publie', coalesce(c.resume, ''),
    'revision', c.resume_revision,
    'resume_updated_at', c.resume_updated_at,
    'brouillon', jsonb_build_object(
      'contenu', b.contenu,
      'base_revision', b.base_revision,
      'revision', b.revision,
      'updated_at', b.updated_at
    ),
    'versions', coalesce((
      select jsonb_agg(v.obj order by v.revision desc)
      from (
        select
          rv.revision,
          jsonb_build_object(
            'revision', rv.revision,
            'contenu', rv.contenu,
            'published_at', rv.published_at,
            'published_by', rv.published_by,
            'published_by_username', p.username
          ) as obj
        from public.resume_versions rv
        left join public.profiles p on p.id = rv.published_by
        where rv.chapitre_id = c.id
        order by rv.revision desc
        limit 20
      ) v
    ), '[]'::jsonb),
    'commentaires', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', lc.id,
          'user_id', lc.user_id,
          'contenu', lc.contenu,
          'created_at', lc.created_at,
          'username', p.username,
          'avatar_url', p.avatar_url,
          'statut', coalesce(s.statut, 'nouveau'),
          'statut_updated_at', s.updated_at
        )
        order by lc.created_at desc
      )
      from public.lecon_commentaires lc
      left join public.profiles p on p.id = lc.user_id
      left join public.lecon_commentaire_suivi s on s.commentaire_id = lc.id
      where lc.chapitre_id = c.id
    ), '[]'::jsonb)
  ) into v_result
  from public.chapitres c
  join public.resume_brouillons b on b.chapitre_id = c.id
  where c.id = p_chapitre_id;

  return v_result;
end;
$$;

-- Sauvegarde privée avec contrôle de la version live ET de la version du
-- brouillon : deux onglets administrateur ne peuvent pas s'écraser en silence.
create or replace function public.sauvegarder_brouillon_resume_admin(
  p_chapitre_id uuid,
  p_contenu text,
  p_revision_attendue bigint,
  p_brouillon_revision_attendue bigint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_live_revision bigint;
  v_base_revision bigint;
  v_brouillon_revision bigint;
  v_updated_at timestamptz;
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;
  if octet_length(coalesce(p_contenu, '')) > 2097152 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select resume_revision into v_live_revision
  from public.chapitres
  where id = p_chapitre_id
  for update;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;
  if p_revision_attendue is distinct from v_live_revision then
    raise exception 'resume_revision_conflit';
  end if;

  select base_revision, revision
  into v_base_revision, v_brouillon_revision
  from public.resume_brouillons
  where chapitre_id = p_chapitre_id
  for update;

  if not found then
    if coalesce(p_brouillon_revision_attendue, 0) <> 0 then
      raise exception 'brouillon_revision_conflit';
    end if;
    insert into public.resume_brouillons (
      chapitre_id,
      contenu,
      base_revision,
      revision,
      updated_by,
      updated_at
    ) values (
      p_chapitre_id,
      coalesce(p_contenu, ''),
      v_live_revision,
      1,
      v_uid,
      now()
    )
    returning base_revision, revision, updated_at
    into v_base_revision, v_brouillon_revision, v_updated_at;
  else
    if v_base_revision <> v_live_revision then
      raise exception 'resume_revision_conflit';
    end if;
    if p_brouillon_revision_attendue is distinct from v_brouillon_revision then
      raise exception 'brouillon_revision_conflit';
    end if;

    update public.resume_brouillons
    set
      contenu = coalesce(p_contenu, ''),
      revision = revision + 1,
      updated_by = v_uid,
      updated_at = now()
    where chapitre_id = p_chapitre_id
    returning base_revision, revision, updated_at
    into v_base_revision, v_brouillon_revision, v_updated_at;
  end if;

  return jsonb_build_object(
    'chapitre_id', p_chapitre_id,
    'base_revision', v_base_revision,
    'brouillon_revision', v_brouillon_revision,
    'updated_at', v_updated_at
  );
end;
$$;

-- Publication transactionnelle : la nouvelle version live, son historique et
-- le brouillon synchronisé sont validés ensemble ou pas du tout.
create or replace function public.publier_resume_admin(
  p_chapitre_id uuid,
  p_contenu text,
  p_revision_attendue bigint,
  p_brouillon_revision_attendue bigint
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_live_revision bigint;
  v_base_revision bigint;
  v_brouillon_revision bigint;
  v_nouvelle_revision bigint;
  v_published_at timestamptz := now();
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;
  if nullif(btrim(coalesce(p_contenu, '')), '') is null then
    raise exception 'resume_vide';
  end if;
  if octet_length(coalesce(p_contenu, '')) > 2097152 then
    raise exception 'contenu_trop_volumineux';
  end if;

  select resume_revision into v_live_revision
  from public.chapitres
  where id = p_chapitre_id
  for update;

  if not found then
    raise exception 'chapitre_introuvable';
  end if;
  if p_revision_attendue is distinct from v_live_revision then
    raise exception 'resume_revision_conflit';
  end if;

  select base_revision, revision
  into v_base_revision, v_brouillon_revision
  from public.resume_brouillons
  where chapitre_id = p_chapitre_id
  for update;

  if not found then
    if coalesce(p_brouillon_revision_attendue, 0) <> 0 then
      raise exception 'brouillon_revision_conflit';
    end if;
    v_base_revision := v_live_revision;
    v_brouillon_revision := 0;
  end if;

  if v_base_revision <> v_live_revision then
    raise exception 'resume_revision_conflit';
  end if;
  if p_brouillon_revision_attendue is distinct from v_brouillon_revision then
    raise exception 'brouillon_revision_conflit';
  end if;

  v_nouvelle_revision := v_live_revision + 1;

  insert into public.resume_versions (
    chapitre_id,
    revision,
    contenu,
    published_by,
    published_at
  ) values (
    p_chapitre_id,
    v_nouvelle_revision,
    p_contenu,
    v_uid,
    v_published_at
  );

  update public.chapitres
  set
    resume = p_contenu,
    resume_published = true,
    resume_revision = v_nouvelle_revision,
    resume_updated_by = v_uid,
    resume_updated_at = v_published_at
  where id = p_chapitre_id;

  insert into public.resume_brouillons (
    chapitre_id,
    contenu,
    base_revision,
    revision,
    updated_by,
    updated_at
  ) values (
    p_chapitre_id,
    p_contenu,
    v_nouvelle_revision,
    v_brouillon_revision + 1,
    v_uid,
    v_published_at
  )
  on conflict (chapitre_id) do update
  set
    contenu = excluded.contenu,
    base_revision = excluded.base_revision,
    revision = excluded.revision,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  return jsonb_build_object(
    'chapitre_id', p_chapitre_id,
    'revision', v_nouvelle_revision,
    'brouillon_revision', v_brouillon_revision + 1,
    'published_at', v_published_at
  );
end;
$$;

create or replace function public.changer_statut_commentaire_resume_admin(
  p_commentaire_id uuid,
  p_statut text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_uid uuid := auth.uid();
  v_updated_at timestamptz := now();
begin
  if v_uid is null then
    raise exception 'auth_required';
  end if;
  if not public.is_admin() then
    raise exception 'admin_required';
  end if;
  if p_statut not in ('nouveau', 'traite', 'ignore') then
    raise exception 'statut_commentaire_invalide';
  end if;
  if not exists (
    select 1 from public.lecon_commentaires where id = p_commentaire_id
  ) then
    raise exception 'commentaire_introuvable';
  end if;

  insert into public.lecon_commentaire_suivi (
    commentaire_id,
    statut,
    updated_by,
    updated_at
  ) values (
    p_commentaire_id,
    p_statut,
    v_uid,
    v_updated_at
  )
  on conflict (commentaire_id) do update
  set
    statut = excluded.statut,
    updated_by = excluded.updated_by,
    updated_at = excluded.updated_at;

  return jsonb_build_object(
    'commentaire_id', p_commentaire_id,
    'statut', p_statut,
    'updated_at', v_updated_at
  );
end;
$$;

revoke all on function public.get_resume_admin(uuid) from public, anon;
revoke all on function public.sauvegarder_brouillon_resume_admin(uuid, text, bigint, bigint) from public, anon;
revoke all on function public.publier_resume_admin(uuid, text, bigint, bigint) from public, anon;
revoke all on function public.changer_statut_commentaire_resume_admin(uuid, text) from public, anon;

grant execute on function public.get_resume_admin(uuid) to authenticated;
grant execute on function public.sauvegarder_brouillon_resume_admin(uuid, text, bigint, bigint) to authenticated;
grant execute on function public.publier_resume_admin(uuid, text, bigint, bigint) to authenticated;
grant execute on function public.changer_statut_commentaire_resume_admin(uuid, text) to authenticated;

notify pgrst, 'reload schema';

commit;

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
-- ============================================================================

-- 15. DONNÉES DE DÉMONSTRATION (idempotent)
-- ============================================================================

insert into public.niveaux (nom, ordre) values
  ('Seconde', 1), ('Première', 2), ('Terminale', 3)
on conflict (nom) do nothing;

insert into public.series (nom, niveau_id)
select s.nom, n.id from public.niveaux n
join (values ('Seconde','A'), ('Seconde','C'),
             ('Première','A'), ('Première','C'), ('Première','D'),
             ('Terminale','A'), ('Terminale','C'), ('Terminale','D')) as s(niveau, nom)
  on s.niveau = n.nom
on conflict (nom, niveau_id) do nothing;

insert into public.matieres (nom, slug, icone, ordre) values
  ('Mathématiques', 'maths', '📐', 1),
  ('Physique-Chimie', 'physique-chimie', '⚗️', 2),
  ('SVT', 'svt', '🧬', 3),
  ('Français', 'francais', '📚', 4),
  ('Anglais', 'anglais', '🇬🇧', 5),
  ('Histoire-Géographie', 'histoire-geo', '🌍', 6),
  ('Philosophie', 'philosophie', '💭', 7),
  ('Espagnol', 'espagnol', '🇪🇸', 8)
on conflict (nom) do nothing;

-- Banque initiale du quiz rapide. La correction n'est jamais envoyée avec la
-- question ; elle est comparée par submit_quiz_rapide().
insert into public.quiz_rapide_questions
  (code, matiere_id, enonce, choix, bonne_reponse)
select x.code, m.id, x.enonce, x.choix::jsonb, x.bonne_reponse
from public.matieres m
join (values
  ('maths', 'maths-01', 'Combien vaut 12 × 8 ?', '["96","86","108","88"]', '96'),
  ('maths', 'maths-02', 'La dérivée de f(x) = x³ est :', '["x²","3x²","3x","x³"]', '3x²'),
  ('maths', 'maths-03', '25 % de 80 vaut :', '["15","20","25","40"]', '20'),

  ('physique-chimie', 'pc-01', 'Quelle est l''unité SI de la force ?', '["Watt","Newton","Joule","Pascal"]', 'Newton'),
  ('physique-chimie', 'pc-02', 'Le pH d''une solution neutre est :', '["0","7","10","14"]', '7'),
  ('physique-chimie', 'pc-03', 'Quel est le symbole chimique du fer ?', '["F","Fe","Fr","Ir"]', 'Fe'),

  ('svt', 'svt-01', 'Combien de chromosomes possède une cellule humaine normale ?', '["23","44","46","48"]', '46'),
  ('svt', 'svt-02', 'Quel organe assure principalement la filtration du sang ?', '["Le foie","Le rein","Le cœur","Le poumon"]', 'Le rein'),
  ('svt', 'svt-03', 'La méiose produit des cellules :', '["Diploïdes","Haploïdes","Triploïdes","Identiques à la cellule mère"]', 'Haploïdes'),

  ('francais', 'fr-01', 'Quel est le pluriel de « cheval » ?', '["chevals","chevaux","chevales","chevaus"]', 'chevaux'),
  ('francais', 'fr-02', 'Quelle est la nature du mot « rapidement » ?', '["Adjectif","Adverbe","Nom","Verbe"]', 'Adverbe'),
  ('francais', 'fr-03', 'Quel est le synonyme de « joyeux » ?', '["triste","content","fatigué","furieux"]', 'content'),

  ('anglais', 'en-01', 'Comment dit-on « maison » en anglais ?', '["house","book","school","road"]', 'house'),
  ('anglais', 'en-02', 'Que signifie « teacher » ?', '["élève","professeur","ami","parent"]', 'professeur'),
  ('anglais', 'en-03', 'Comment dit-on « eau » en anglais ?', '["food","light","water","time"]', 'water'),

  ('histoire-geo', 'hg-01', 'En quelle année la Côte d''Ivoire a-t-elle obtenu son indépendance ?', '["1958","1960","1962","1965"]', '1960'),
  ('histoire-geo', 'hg-02', 'Quel fleuve traverse l''Égypte ?', '["Le Congo","Le Nil","Le Niger","Le Zambèze"]', 'Le Nil'),
  ('histoire-geo', 'hg-03', 'Quelle est la capitale politique de la Côte d''Ivoire ?', '["Abidjan","Yamoussoukro","Bouaké","San-Pédro"]', 'Yamoussoukro'),

  ('philosophie', 'philo-01', 'Qui a écrit « Le Discours de la méthode » ?', '["Platon","Descartes","Kant","Nietzsche"]', 'Descartes'),
  ('philosophie', 'philo-02', 'L''épistémologie étudie principalement :', '["Les sentiments","La connaissance scientifique","Le langage","L''art"]', 'La connaissance scientifique'),
  ('philosophie', 'philo-03', 'Pour Kant, l''impératif catégorique relève :', '["De l''intérêt personnel","Du devoir moral universel","Du plaisir","De la tradition"]', 'Du devoir moral universel'),

  ('espagnol', 'es-01', 'Comment dit-on « bonjour » en espagnol ?', '["Adiós","Hola","Gracias","Por favor"]', 'Hola'),
  ('espagnol', 'es-02', 'Que signifie « casa » ?', '["Voiture","Maison","Chat","École"]', 'Maison'),
  ('espagnol', 'es-03', 'Comment dit-on « merci » en espagnol ?', '["Gracias","Hola","Adiós","Sí"]', 'Gracias')
) as x(slug, code, enonce, choix, bonne_reponse) on x.slug = m.slug
on conflict (code) do update set
  matiere_id = excluded.matiere_id,
  enonce = excluded.enonce,
  choix = excluded.choix,
  bonne_reponse = excluded.bonne_reponse,
  active = true;

-- Matières ↔ séries (table de correspondance ajustable par l'admin)
insert into public.matieres_series (matiere_id, serie_id)
select m.id, s.id from public.matieres m
join public.series s on true
join public.niveaux n on n.id = s.niveau_id
where
  (m.slug = 'maths') or
  (m.slug = 'physique-chimie' and s.nom in ('C','D')) or
  (m.slug = 'svt' and (s.nom = 'A' and n.nom = 'Seconde' or s.nom in ('C','D'))) or
  (m.slug = 'francais') or
  (m.slug = 'anglais') or
  (m.slug = 'histoire-geo') or
  (m.slug = 'philosophie' and n.nom in ('Première','Terminale')) or
  (m.slug = 'espagnol' and s.nom = 'A')
on conflict do nothing;

-- Badges (5 catégories du cahier des charges)
insert into public.badges (code, categorie, nom, description, icone) values
  ('sans_faute', 'performance', 'Sans-faute', 'Obtenir 20/20 à un quiz', '💯'),
  ('perfectionniste', 'performance', 'Perfectionniste', '20/20 dès la 1ère tentative', '⭐'),
  ('eclair', 'performance', 'Éclair', '≥16/20 en moins de la moitié du temps imparti', '⚡'),
  ('premier_pas', 'progression', 'Premier pas', 'Valider son premier quiz', '👣'),
  ('chapitre_maitrise', 'progression', 'Chapitre maîtrisé', 'Tous les quiz d''un chapitre ≥ 16/20', '📗'),
  ('matiere_completee', 'progression', 'Matière complétée', 'Tous les chapitres d''une matière terminés', '🎓'),
  ('saison_complete', 'progression', 'Saison complète', 'Actif chaque semaine d''un trimestre', '📅'),
  ('serie_en_cours', 'assiduite', 'Série en cours', '3 jours d''activité consécutifs', '🔥'),
  ('marathonien', 'assiduite', 'Marathonien', '30 jours d''activité cumulés', '🏃'),
  ('increvable', 'assiduite', 'Increvable', '3 tentatives sur un même devoir', '💪'),
  ('top10_classe', 'competition', 'Top 10 de classe', 'Faire partie du top 10 de sa classe', '🏆'),
  ('numero1', 'competition', 'Numéro 1', 'Être 1er du classement de sa classe', '🥇'),
  ('podium_saison', 'competition', 'Podium de saison', 'Terminer une saison dans le top 3', '🏅'),
  ('duelliste', 'competition', 'Duelliste', 'Jouer 10 défis', '⚔️'),
  ('invaincu', 'competition', 'Invaincu', 'Gagner 5 défis d''affilée', '🛡️'),
  ('revanche_reussie', 'amelioration', 'Revanche réussie', '+4 points entre deux tentatives', '📈'),
  ('remontada', 'amelioration', 'Remontada', 'Gagner 10 places au classement en une semaine', '🚀')
on conflict (code) do nothing;

-- Paramètres d'application par défaut
insert into public.app_settings (cle, valeur, description) values
  ('duree_devoir_defaut_sec', '2700', 'Durée par défaut d''un devoir en secondes (45 min)'),
  ('note_deblocage_quiz', '12', 'Note minimale sur 20 pour débloquer le quiz suivant d''un chapitre'),
  ('anti_spam_quiz_rapide_ms', '1500', 'Délai minimal entre deux réponses en quiz rapide'),
  ('contenu_decouverte_chapitres', '1', 'Nombre de chapitres en accès libre par matière'),
  ('fonctionnalite_defis_active', 'true', 'Active/désactive les défis 1 contre 1')
on conflict (cle) do nothing;

-- Saison en cours (trimestre 1)
insert into public.saisons (trimestre, date_debut, date_fin, statut)
values ('2026-T1', date_trunc('quarter', current_date)::date, (date_trunc('quarter', current_date) + interval '3 months' - interval '1 day')::date, 'active')
on conflict (trimestre) do nothing;

-- Contenu de démo : chapitres + 1 quiz + questions pour Maths Terminale D
do $$
declare
  v_matiere_id uuid;
  v_serie_id uuid;
  v_chapitre_id uuid;
  v_quiz_id uuid;
  v_devoir_id uuid;
begin
  perform set_config('app.devoirs_admin_internal', 'on', true);
  select id into v_matiere_id from public.matieres where slug = 'maths';
  select s.id into v_serie_id from public.series s join public.niveaux n on n.id = s.niveau_id
    where n.nom = 'Terminale' and s.nom = 'D';

  insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
  values (v_matiere_id, v_serie_id, 1, 'Limites et continuité', 'Limites de fonctions, continuité, théorème des valeurs intermédiaires', true)
  on conflict do nothing
  returning id into v_chapitre_id;

  if v_chapitre_id is null then
    select id into v_chapitre_id from public.chapitres
      where matiere_id = v_matiere_id and serie_id = v_serie_id and titre = 'Limites et continuité';
  end if;

  insert into public.chapitres (matiere_id, serie_id, ordre, titre, description, published)
  values
    (v_matiere_id, v_serie_id, 2, 'Dérivabilité', 'Nombre dérivé, fonction dérivée, applications', true),
    (v_matiere_id, v_serie_id, 3, 'Primitives', 'Calcul de primitives, équations différentielles', true)
  on conflict do nothing;

  if not exists (
    select 1 from public.quiz
    where chapitre_id = v_chapitre_id and est_note and numero = 1
  ) then
    insert into public.quiz (chapitre_id, type, titre, numero, published)
    values (v_chapitre_id, 'chapitre', 'Quiz 1 — Limites et continuité', 1, true)
    returning id into v_quiz_id;

    insert into public.questions (quiz_id, ordre, enonce, type, choix, bonnes_reponses, points, explication) values
    (v_quiz_id, 1, 'Quelle est la limite de f(x) = 1/x quand x tend vers +∞ ?', 'qcm',
      '["0", "1", "+∞", "N''existe pas"]'::jsonb, '"0"'::jsonb, 1,
      'Quand x devient très grand, 1/x se rapproche de 0.'),
    (v_quiz_id, 2, 'Une fonction continue sur [a,b] telle que f(a) et f(b) sont de signes opposés admet...', 'qcm',
      '["Aucune racine sur ]a,b[", "Au moins une racine sur ]a,b[", "Exactement une racine", "Une infinité de racines"]'::jsonb,
      '"Au moins une racine sur ]a,b["'::jsonb, 1,
      'C''est le théorème des valeurs intermédiaires (corollaire).'),
    (v_quiz_id, 3, 'La limite de (x²-1)/(x-1) quand x tend vers 1 vaut :', 'qcm',
      '["0", "1", "2", "N''existe pas"]'::jsonb, '"2"'::jsonb, 1,
      'On factorise : (x-1)(x+1)/(x-1) = x+1, qui tend vers 2 quand x tend vers 1.')
    on conflict do nothing;
  end if;

  -- Devoir de démo sur la matière
  if not exists (select 1 from public.quiz where matiere_id = v_matiere_id and serie_id = v_serie_id and type = 'devoir') then
    insert into public.devoirs_editoriaux (matiere_id, serie_id, numero)
    values (v_matiere_id, v_serie_id, 1)
    on conflict (matiere_id, serie_id, numero) do update set updated_at = now()
    returning id into v_devoir_id;

    insert into public.quiz (
      matiere_id, serie_id, type, titre, numero, duree_sec, published,
      devoir_id, version_devoir, statut_editorial, published_at
    )
    values (
      v_matiere_id, v_serie_id, 'devoir', 'Devoir surveillé n°1 — Analyse',
      1, 2700, true, v_devoir_id, 1, 'publie', now()
    )
    returning id into v_quiz_id;

    insert into public.questions (quiz_id, ordre, enonce, type, choix, bonnes_reponses, points, explication) values
    (v_quiz_id, 1, 'La dérivée de f(x) = x³ est :', 'qcm', '["x²", "3x²", "3x", "x²/3"]'::jsonb, '"3x²"'::jsonb, 1, 'Règle de dérivation : (xⁿ)'' = n·xⁿ⁻¹.'),
    (v_quiz_id, 2, 'Une primitive de f(x) = 2x est :', 'qcm', '["x²", "2x²", "x", "2"]'::jsonb, '"x²"'::jsonb, 1, 'La dérivée de x² est 2x.')
    on conflict do nothing;
  end if;
end $$;

-- EXCELLENCE LYCEE - Approbation automatique et actions admin groupees

begin;

-- Tous les profils crees a l'avenir sont approuves par defaut. Le trigger
-- d'inscription fixe aussi explicitement la valeur afin qu'une metadata client
-- ne puisse ni desactiver ni influencer cette decision serveur.
alter table public.profiles
  alter column approuve set default true;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  insert into public.profiles (
    id, username, avatar_url, niveau_id, serie_id, etablissement, approuve
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url',
    nullif(new.raw_user_meta_data ->> 'niveau_id', '')::uuid,
    nullif(new.raw_user_meta_data ->> 'serie_id', '')::uuid,
    new.raw_user_meta_data ->> 'etablissement',
    true
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Une seule RPC couvre les deux actions de masse. Elle ne touche jamais les
-- administrateurs. La desapprobation exclut en plus explicitement le demandeur,
-- meme si cette protection est deja impliquee par son statut administrateur.
create or replace function public.set_approbation_utilisateurs_admin_v1(
  p_approuve boolean
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_caller_id uuid := auth.uid();
  v_is_admin boolean;
  v_eligible_count integer := 0;
  v_updated_count integer := 0;
  v_approved_count integer := 0;
  v_pending_count integer := 0;
begin
  if v_caller_id is null then raise exception 'auth_required'; end if;
  if p_approuve is null then raise exception 'statut_approbation_requis'; end if;

  select p.is_admin into v_is_admin
  from public.profiles p
  where p.id = v_caller_id
  for share of p;

  if not coalesce(v_is_admin, false) then raise exception 'admin_required'; end if;

  select count(*)::integer into v_eligible_count
  from public.profiles p
  where p.is_admin = false
    and p.approuve is distinct from p_approuve
    and (p_approuve or p.id <> v_caller_id);

  update public.profiles p
  set approuve = p_approuve,
      updated_at = clock_timestamp()
  where p.is_admin = false
    and p.approuve is distinct from p_approuve
    and (p_approuve or p.id <> v_caller_id);

  get diagnostics v_updated_count = row_count;

  select
    (count(*) filter (where p.approuve))::integer,
    (count(*) filter (where not p.approuve))::integer
  into v_approved_count, v_pending_count
  from public.profiles p
  where p.is_admin = false;

  return jsonb_build_object(
    'action', case when p_approuve then 'approve_all' else 'disapprove_all' end,
    'requested_status', p_approuve,
    'eligible_count', v_eligible_count,
    'updated_count', v_updated_count,
    'approved_count', v_approved_count,
    'pending_count', v_pending_count
  );
end;
$$;

-- Le trigger est prive; seule la RPC groupee est appelee depuis l'interface.
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_approbation_utilisateurs_admin_v1(boolean)
  from public, anon, authenticated;
grant execute on function public.set_approbation_utilisateurs_admin_v1(boolean)
  to authenticated;

notify pgrst, 'reload schema';

commit;

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

-- EXCELLENCE LYCEE - Quiz rapide continu et banque pedagogique fiable
--
-- Le quiz rapide n'a plus de quota de questions. La selection privilegie les
-- questions jamais vues par l'eleve puis, lorsque la banque est epuisee,
-- reprend la question vue depuis le plus longtemps. La correction et sa
-- justification restent strictement cote serveur jusqu'a la soumission.

begin;

alter table public.quiz_rapide_questions
  add column if not exists explication text;

-- Le mode est désormais continu : supprimer l'ancien réglage d'administration
-- évite d'afficher un quota de 30 questions qui n'est plus appliqué.
delete from public.app_settings
where cle = 'decouverte_quiz_rapide_limite';

create index if not exists idx_quiz_rapide_challenges_seen
  on public.quiz_rapide_challenges(user_id, question_id, created_at desc);

-- Predicate unique de qualite pour la selection et l'audit. Dans cette banque,
-- active=true est le drapeau de publication et toutes les lignes sont des QCM.
create or replace function public.quiz_rapide_question_est_eligible_v2(
  p_enonce text,
  p_choix jsonb,
  p_bonne_reponse text,
  p_explication text
)
returns boolean
language sql
immutable
set search_path = pg_catalog
as $$
  select case
    when p_choix is null or jsonb_typeof(p_choix) <> 'array' then false
    when jsonb_array_length(p_choix) not between 2 and 6 then false
    else
      char_length(btrim(coalesce(p_enonce, ''))) between 5 and 2000
      and char_length(btrim(coalesce(p_bonne_reponse, ''))) between 1 and 300
      and char_length(btrim(coalesce(p_explication, ''))) between 20 and 3000
      and not exists (
        select 1
        from jsonb_array_elements(p_choix) as choice(item)
        where jsonb_typeof(choice.item) <> 'string'
           or char_length(btrim(choice.item #>> '{}')) not between 1 and 300
      )
      and (
        select count(distinct lower(btrim(choice.item #>> '{}')))
        from jsonb_array_elements(p_choix) as choice(item)
      ) = jsonb_array_length(p_choix)
      and exists (
        select 1
        from jsonb_array_elements_text(p_choix) as choice(value)
        where choice.value = p_bonne_reponse
      )
  end;
$$;

revoke all on function public.quiz_rapide_question_est_eligible_v2(text, jsonb, text, text)
  from public, anon, authenticated;

-- Six questions originales et expliquees pour chacune des huit matieres deja
-- presentes dans la banque. L'upsert corrige aussi les anciennes lignes dont
-- l'explication etait absente.
with contenu(slug, code, enonce, choix, bonne_reponse, explication) as (
  values
    (
      'maths', 'maths-01', 'Combien vaut 12 × 8 ?',
      jsonb_build_array('96', '86', '108', '88'), '96',
      'Multiplier 12 par 8 revient à additionner huit fois 12 : 12 × 8 = 96.'
    ),
    (
      'maths', 'maths-02', 'La dérivée de f(x) = x³ est :',
      jsonb_build_array('x²', '3x²', '3x', 'x³'), '3x²',
      'La règle (xⁿ)′ = n·xⁿ⁻¹ donne ici (x³)′ = 3x².'
    ),
    (
      'maths', 'maths-03', '25 % de 80 vaut :',
      jsonb_build_array('15', '20', '25', '40'), '20',
      '25 % représente un quart. Un quart de 80 vaut 80 ÷ 4 = 20.'
    ),
    (
      'maths', 'maths-04', 'Quelles sont les solutions de x² − 5x + 6 = 0 ?',
      jsonb_build_array('{2 ; 3}', '{−2 ; −3}', '{1 ; 6}', 'Aucune solution réelle'), '{2 ; 3}',
      'On factorise x² − 5x + 6 = (x − 2)(x − 3). Le produit est nul pour x = 2 ou x = 3.'
    ),
    (
      'maths', 'maths-05', 'Une suite arithmétique vérifie u₀ = 2 et a pour raison 3. Combien vaut u₄ ?',
      jsonb_build_array('11', '12', '14', '17'), '14',
      'Pour une suite arithmétique, uₙ = u₀ + n·r. Ainsi u₄ = 2 + 4 × 3 = 14.'
    ),
    (
      'maths', 'maths-06', 'Quelle est la limite de 1/x lorsque x tend vers +∞ ?',
      jsonb_build_array('0', '1', '+∞', 'Elle n’existe pas'), '0',
      'Quand x devient arbitrairement grand, son inverse 1/x devient arbitrairement proche de 0.'
    ),

    (
      'physique-chimie', 'pc-01', 'Quelle est l’unité SI de la force ?',
      jsonb_build_array('watt', 'newton', 'joule', 'pascal'), 'newton',
      'Dans le Système international, une force se mesure en newtons (N), conformément à la relation F = m·a.'
    ),
    (
      'physique-chimie', 'pc-02', 'Le pH d’une solution neutre à 25 °C est :',
      jsonb_build_array('0', '7', '10', '14'), '7',
      'À 25 °C, une solution neutre contient autant d’ions H₃O⁺ que d’ions HO⁻ ; son pH vaut 7.'
    ),
    (
      'physique-chimie', 'pc-03', 'Quel est le symbole chimique du fer ?',
      jsonb_build_array('F', 'Fe', 'Fr', 'Ir'), 'Fe',
      'Le symbole du fer est Fe, issu du latin ferrum. F désigne le fluor, Fr le francium et Ir l’iridium.'
    ),
    (
      'physique-chimie', 'pc-04', 'Quelle relation traduit la loi d’Ohm pour un conducteur ohmique ?',
      jsonb_build_array('U = R·I', 'P = U·I', 'E = m·c²', 'F = m·a'), 'U = R·I',
      'La loi d’Ohm relie la tension U, la résistance R et l’intensité I : U = R·I.'
    ),
    (
      'physique-chimie', 'pc-05', 'Dans le vide, la lumière se propage approximativement à :',
      jsonb_build_array('3 × 10⁸ m/s', '3 × 10⁵ m/s', '340 m/s', '9,81 m/s'), '3 × 10⁸ m/s',
      'La célérité de la lumière dans le vide est c ≈ 3,00 × 10⁸ m/s. La valeur 340 m/s correspond au son dans l’air.'
    ),
    (
      'physique-chimie', 'pc-06', 'Au cours d’une réaction chimique réalisée en système fermé, la masse totale :',
      jsonb_build_array('Se conserve', 'Double toujours', 'Disparaît', 'Dépend uniquement du catalyseur'), 'Se conserve',
      'Dans un système fermé, les atomes se réarrangent sans être créés ni détruits : la masse totale se conserve.'
    ),

    (
      'svt', 'svt-01', 'Combien de chromosomes contient le noyau d’une cellule somatique humaine diploïde ?',
      jsonb_build_array('23', '44', '46', '48'), '46',
      'Une cellule somatique humaine possède 23 paires de chromosomes, soit 46 chromosomes au total.'
    ),
    (
      'svt', 'svt-02', 'Quel organe assure principalement la filtration du sang et la formation de l’urine ?',
      jsonb_build_array('Le foie', 'Le rein', 'Le cœur', 'Le poumon'), 'Le rein',
      'Les reins filtrent le plasma sanguin dans les néphrons et participent ainsi à la formation de l’urine.'
    ),
    (
      'svt', 'svt-03', 'La méiose produit des cellules :',
      jsonb_build_array('Diploïdes', 'Haploïdes', 'Triploïdes', 'Identiques à la cellule mère'), 'Haploïdes',
      'La méiose divise par deux le nombre de chromosomes et produit des cellules haploïdes destinées à la reproduction sexuée.'
    ),
    (
      'svt', 'svt-04', 'Dans une cellule eucaryote, l’ADN chromosomique se trouve principalement :',
      jsonb_build_array('Dans le noyau', 'Dans la membrane plasmique', 'Dans les ribosomes', 'Dans l’appareil de Golgi'), 'Dans le noyau',
      'Chez les eucaryotes, les chromosomes constitués d’ADN sont contenus dans le noyau de la cellule.'
    ),
    (
      'svt', 'svt-05', 'Quel gaz une plante verte prélève-t-elle pour réaliser la photosynthèse ?',
      jsonb_build_array('Le dioxyde de carbone', 'Le dioxygène', 'Le diazote', 'Le méthane'), 'Le dioxyde de carbone',
      'La photosynthèse consomme du dioxyde de carbone et de l’eau pour produire de la matière organique, avec libération de dioxygène.'
    ),
    (
      'svt', 'svt-06', 'Quelle hormone contribue à faire diminuer la glycémie après un repas ?',
      jsonb_build_array('L’insuline', 'Le glucagon', 'L’adrénaline', 'La thyroxine'), 'L’insuline',
      'Sécrétée par le pancréas, l’insuline favorise l’entrée et le stockage du glucose dans les cellules, ce qui abaisse la glycémie.'
    ),

    (
      'francais', 'fr-01', 'Quel est le pluriel du nom « cheval » ?',
      jsonb_build_array('chevals', 'chevaux', 'chevales', 'chevaus'), 'chevaux',
      'Le nom cheval fait partie des noms en -al dont le pluriel se forme en -aux : un cheval, des chevaux.'
    ),
    (
      'francais', 'fr-02', 'Quelle est la nature grammaticale du mot « rapidement » ?',
      jsonb_build_array('Adjectif', 'Adverbe', 'Nom', 'Verbe'), 'Adverbe',
      'Rapidement modifie le sens d’un verbe ou d’un adjectif et se termine par -ment : c’est un adverbe.'
    ),
    (
      'francais', 'fr-03', 'Quel est le synonyme le plus proche de « joyeux » ?',
      jsonb_build_array('triste', 'content', 'fatigué', 'furieux'), 'content',
      'Joyeux et content expriment tous deux un état de satisfaction ou de bonheur ; les autres mots ont un sens différent.'
    ),
    (
      'francais', 'fr-04', 'Quelle figure de style apparaît dans l’expression « cette obscure clarté » ?',
      jsonb_build_array('Un oxymore', 'Une comparaison', 'Une anaphore', 'Une hyperbole'), 'Un oxymore',
      'Un oxymore rapproche deux termes contradictoires. Ici, obscure s’oppose directement à clarté.'
    ),
    (
      'francais', 'fr-05', 'Complète correctement : « Les lettres que j’ai … hier sont parties. »',
      jsonb_build_array('écrites', 'écrit', 'écrits', 'écrite'), 'écrites',
      'Avec l’auxiliaire avoir, le participe passé s’accorde avec le COD placé avant. « Que » reprend « les lettres » : on écrit écrites.'
    ),
    (
      'francais', 'fr-06', 'À quel mouvement littéraire Victor Hugo est-il principalement associé ?',
      jsonb_build_array('Le romantisme', 'Le naturalisme', 'Le classicisme', 'Le surréalisme'), 'Le romantisme',
      'Victor Hugo est une figure majeure du romantisme français, mouvement qui valorise notamment l’expression du moi et la liberté créatrice.'
    ),

    (
      'anglais', 'en-01', 'Comment dit-on « maison » en anglais ?',
      jsonb_build_array('house', 'book', 'school', 'road'), 'house',
      'Le nom anglais house désigne une maison, tandis que book, school et road signifient respectivement livre, école et route.'
    ),
    (
      'anglais', 'en-02', 'Que signifie le mot anglais « teacher » ?',
      jsonb_build_array('élève', 'professeur', 'ami', 'parent'), 'professeur',
      'Teacher désigne la personne qui enseigne : un professeur ou une professeure. Student désigne l’élève.'
    ),
    (
      'anglais', 'en-03', 'Comment dit-on « eau » en anglais ?',
      jsonb_build_array('food', 'light', 'water', 'time'), 'water',
      'Le mot anglais water signifie eau. Food signifie nourriture, light lumière et time temps.'
    ),
    (
      'anglais', 'en-04', 'Quel est le prétérit du verbe irrégulier « to go » ?',
      jsonb_build_array('went', 'goed', 'gone', 'goes'), 'went',
      'To go est irrégulier : son prétérit est went. Gone est son participe passé et s’emploie avec have.'
    ),
    (
      'anglais', 'en-05', 'Complète : « If I had known, I … have come. »',
      jsonb_build_array('would', 'will', 'did', 'am'), 'would',
      'Le troisième conditionnel se forme avec if + past perfect, puis would have + participe passé : would have come.'
    ),
    (
      'anglais', 'en-06', 'Quel mot anglais est un synonyme de « rapid » ?',
      jsonb_build_array('fast', 'slow', 'weak', 'late'), 'fast',
      'Fast et rapid signifient tous deux rapide. Slow signifie lent, weak faible et late en retard.'
    ),

    (
      'histoire-geo', 'hg-01', 'En quelle année la Côte d’Ivoire a-t-elle obtenu son indépendance ?',
      jsonb_build_array('1958', '1960', '1962', '1965'), '1960',
      'La Côte d’Ivoire est devenue indépendante le 7 août 1960, après avoir été une colonie française.'
    ),
    (
      'histoire-geo', 'hg-02', 'Quel fleuve traverse l’Égypte du sud vers le nord ?',
      jsonb_build_array('Le Congo', 'Le Nil', 'Le Niger', 'Le Zambèze'), 'Le Nil',
      'Le Nil traverse l’Égypte et se jette dans la mer Méditerranée en formant un vaste delta.'
    ),
    (
      'histoire-geo', 'hg-03', 'Quelle est la capitale politique de la Côte d’Ivoire ?',
      jsonb_build_array('Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'), 'Yamoussoukro',
      'Yamoussoukro est la capitale politique et administrative depuis 1983 ; Abidjan demeure la principale capitale économique.'
    ),
    (
      'histoire-geo', 'hg-04', 'En quelle année l’Organisation des Nations unies a-t-elle été fondée ?',
      jsonb_build_array('1919', '1945', '1957', '1989'), '1945',
      'La Charte des Nations unies est entrée en vigueur le 24 octobre 1945, après la Seconde Guerre mondiale.'
    ),
    (
      'histoire-geo', 'hg-05', 'Quelle latitude correspond à l’équateur ?',
      jsonb_build_array('0°', '23,5° Nord', '45° Sud', '90° Nord'), '0°',
      'L’équateur est le parallèle de référence : sa latitude est 0° et il sépare les hémisphères Nord et Sud.'
    ),
    (
      'histoire-geo', 'hg-06', 'En quelle année le mur de Berlin est-il tombé ?',
      jsonb_build_array('1961', '1975', '1989', '1991'), '1989',
      'Le mur de Berlin s’est ouvert le 9 novembre 1989, événement majeur de la fin de la guerre froide en Europe.'
    ),

    (
      'philosophie', 'philo-01', 'Qui a écrit « Le Discours de la méthode » ?',
      jsonb_build_array('Platon', 'Descartes', 'Kant', 'Nietzsche'), 'Descartes',
      'René Descartes publie le Discours de la méthode en 1637 pour présenter une démarche rationnelle de recherche de la vérité.'
    ),
    (
      'philosophie', 'philo-02', 'L’épistémologie étudie principalement :',
      jsonb_build_array('Les sentiments', 'La connaissance scientifique', 'Le langage', 'L’art'), 'La connaissance scientifique',
      'L’épistémologie examine les méthodes, les fondements et la validité des connaissances produites par les sciences.'
    ),
    (
      'philosophie', 'philo-03', 'Pour Kant, l’impératif catégorique relève :',
      jsonb_build_array('De l’intérêt personnel', 'Du devoir moral universel', 'Du plaisir', 'De la tradition'), 'Du devoir moral universel',
      'L’impératif catégorique commande sans dépendre d’un intérêt particulier : la maxime de l’action doit pouvoir valoir universellement.'
    ),
    (
      'philosophie', 'philo-04', 'À quel philosophe associe-t-on la formule « Je pense, donc je suis » ?',
      jsonb_build_array('Descartes', 'Aristote', 'Hegel', 'Rousseau'), 'Descartes',
      'Dans le doute méthodique, Descartes découvre que l’acte même de penser prouve nécessairement l’existence du sujet pensant.'
    ),
    (
      'philosophie', 'philo-05', 'Dans l’allégorie de la caverne de Platon, la sortie de la caverne symbolise :',
      jsonb_build_array('L’accès progressif à la connaissance', 'Le refus de toute vérité', 'La recherche du plaisir', 'L’oubli de la cité'), 'L’accès progressif à la connaissance',
      'Le passage de l’ombre à la lumière représente l’éducation de l’esprit, qui quitte l’opinion pour se tourner vers la connaissance.'
    ),
    (
      'philosophie', 'philo-06', 'Quel philosophe affirme que l’être humain est « condamné à être libre » ?',
      jsonb_build_array('Jean-Paul Sartre', 'Épicure', 'Auguste Comte', 'Spinoza'), 'Jean-Paul Sartre',
      'Pour Sartre, aucun déterminisme ne dispense totalement l’être humain de choisir : il demeure responsable de ses actes et de son projet.'
    ),

    (
      'espagnol', 'es-01', 'Comment dit-on « bonjour » en espagnol ?',
      jsonb_build_array('Adiós', 'Hola', 'Gracias', 'Por favor'), 'Hola',
      'Hola est la salutation espagnole courante pour dire bonjour. Adiós signifie au revoir et gracias merci.'
    ),
    (
      'espagnol', 'es-02', 'Que signifie le mot espagnol « casa » ?',
      jsonb_build_array('Voiture', 'Maison', 'Chat', 'École'), 'Maison',
      'Le nom espagnol casa signifie maison. Coche signifie voiture, gato chat et escuela école.'
    ),
    (
      'espagnol', 'es-03', 'Comment dit-on « merci » en espagnol ?',
      jsonb_build_array('Gracias', 'Hola', 'Adiós', 'Sí'), 'Gracias',
      'Gracias est la formule espagnole employée pour remercier quelqu’un ; muchas gracias signifie merci beaucoup.'
    ),
    (
      'espagnol', 'es-04', 'Quelle est la forme de « tener » avec le pronom « yo » au présent ?',
      jsonb_build_array('tengo', 'tienes', 'tenemos', 'tienen'), 'tengo',
      'Tener est irrégulier à la première personne du singulier : yo tengo. Tienes correspond à tú et tenemos à nosotros.'
    ),
    (
      'espagnol', 'es-05', 'Quel mot indique généralement une action située dans le passé ?',
      jsonb_build_array('ayer', 'mañana', 'ahora', 'siempre'), 'ayer',
      'Ayer signifie hier et situe donc l’action dans le passé. Mañana signifie demain et ahora maintenant.'
    ),
    (
      'espagnol', 'es-06', 'Comment conjugue-t-on « hablar » avec « nosotros » au présent ?',
      jsonb_build_array('hablamos', 'habláis', 'hablan', 'hablo'), 'hablamos',
      'Les verbes réguliers en -ar prennent la terminaison -amos avec nosotros : nosotros hablamos.'
    )
)
insert into public.quiz_rapide_questions (
  code, matiere_id, enonce, choix, bonne_reponse, explication, active
)
select
  contenu.code,
  matiere.id,
  contenu.enonce,
  contenu.choix,
  contenu.bonne_reponse,
  contenu.explication,
  true
from contenu
join public.matieres matiere on matiere.slug = contenu.slug
on conflict (code) do update set
  matiere_id = excluded.matiere_id,
  enonce = excluded.enonce,
  choix = excluded.choix,
  bonne_reponse = excluded.bonne_reponse,
  explication = excluded.explication,
  active = true;

-- Une question inconnue et incomplète n'est jamais servie. Elle est conservée
-- pour correction par l'admin, mais retirée de la publication plutôt que de
-- recevoir une justification générique potentiellement fausse.
do $$
declare
  v_desactivees integer;
begin
  update public.quiz_rapide_questions q
  set active = false
  where q.active
    and not public.quiz_rapide_question_est_eligible_v2(
      q.enonce, q.choix, q.bonne_reponse, q.explication
    );
  get diagnostics v_desactivees = row_count;
  raise notice 'quiz_rapide_questions_invalides_desactivees=%', v_desactivees;
end;
$$;

-- ---------------------------------------------------------------------------
-- Question suivante : inédit d'abord, puis la moins récemment vue.
-- ---------------------------------------------------------------------------

create or replace function public.get_quiz_rapide_question(p_matiere_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_niveau_id uuid;
  v_serie_id uuid;
  v_question public.quiz_rapide_questions%rowtype;
  v_challenge_id uuid;
  v_choix jsonb;
  v_expires_at timestamptz := clock_timestamp() + interval '2 minutes';
  v_recyclee boolean := false;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  -- Toutes les opérations quiz rapide d'un même élève sont sérialisées sans
  -- inverser l'ordre des verrous des tables challenges/scores/profiles.
  perform pg_advisory_xact_lock(
    hashtextextended('quiz_rapide:' || auth.uid()::text, 0)
  );

  select p.niveau_id, p.serie_id
  into v_niveau_id, v_serie_id
  from public.profiles p
  where p.id = auth.uid();
  if not found or v_serie_id is null then raise exception 'profil_incomplet'; end if;

  if not exists (
    select 1
    from public.matieres_series ms
    where ms.matiere_id = p_matiere_id
      and ms.serie_id = v_serie_id
  ) then
    raise exception 'matiere_non_autorisee';
  end if;

  select q.*
  into v_question
  from public.quiz_rapide_questions q
  left join lateral (
    select max(c.created_at) as derniere_vue_at
    from public.quiz_rapide_challenges c
    where c.user_id = auth.uid()
      and c.question_id = q.id
  ) historique on true
  where q.matiere_id = p_matiere_id
    and q.active = true
    and (q.niveau_id is null or q.niveau_id = v_niveau_id)
    and public.quiz_rapide_question_est_eligible_v2(
      q.enonce, q.choix, q.bonne_reponse, q.explication
    )
  order by
    case when historique.derniere_vue_at is null then 0 else 1 end,
    historique.derniere_vue_at asc nulls first,
    random()
  limit 1;

  if not found then raise exception 'contenu_insuffisant'; end if;

  select exists (
    select 1
    from public.quiz_rapide_challenges c
    where c.user_id = auth.uid()
      and c.question_id = v_question.id
  ) into v_recyclee;

  -- Un seul challenge actif empêche de précharger plusieurs questions et de
  -- rechercher la bonne réponse hors du flux de validation.
  delete from public.quiz_rapide_challenges
  where user_id = auth.uid() and answered_at is null;

  select jsonb_agg(choice.value order by random())
  into v_choix
  from jsonb_array_elements(v_question.choix) as choice(value);

  insert into public.quiz_rapide_challenges (
    user_id, matiere_id, question_id, expires_at
  ) values (
    auth.uid(), p_matiere_id, v_question.id, v_expires_at
  )
  returning id into v_challenge_id;

  -- Ne jamais ajouter bonne_reponse ou explication à cette projection.
  return jsonb_build_object(
    'challenge_id', v_challenge_id,
    'question_id', v_question.id,
    'enonce', v_question.enonce,
    'choix', v_choix,
    'expires_at', v_expires_at,
    'cycle_recommence', v_recyclee
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Validation : correction et justification révélées uniquement après réponse.
-- ---------------------------------------------------------------------------

create or replace function public.submit_quiz_rapide(
  p_challenge_id uuid,
  p_choix text
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_challenge public.quiz_rapide_challenges%rowtype;
  v_question public.quiz_rapide_questions%rowtype;
  v_score public.quiz_scores%rowtype;
  v_bonne boolean;
  v_anti_spam_ms integer := 1500;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;

  perform pg_advisory_xact_lock(
    hashtextextended('quiz_rapide:' || auth.uid()::text, 0)
  );

  select c.*
  into v_challenge
  from public.quiz_rapide_challenges c
  where c.id = p_challenge_id
    and c.user_id = auth.uid()
  for update;
  if not found then raise exception 'question_introuvable'; end if;
  if v_challenge.answered_at is not null then raise exception 'question_deja_repondue'; end if;
  if clock_timestamp() > v_challenge.expires_at then raise exception 'question_expiree'; end if;

  select q.*
  into v_question
  from public.quiz_rapide_questions q
  where q.id = v_challenge.question_id
  for share;
  if not found
     or not v_question.active
     or not public.quiz_rapide_question_est_eligible_v2(
       v_question.enonce,
       v_question.choix,
       v_question.bonne_reponse,
       v_question.explication
     ) then
    raise exception 'question_introuvable';
  end if;

  if p_choix is null
     or not exists (
       select 1
       from jsonb_array_elements_text(v_question.choix) as choice(value)
       where choice.value = p_choix
     ) then
    raise exception 'choix_invalide';
  end if;

  insert into public.quiz_scores (
    user_id, matiere_id, points, nb_bonnes, nb_questions,
    streak_actuel, streak_max
  ) values (
    auth.uid(), v_challenge.matiere_id, 0, 0, 0, 0, 0
  )
  on conflict (user_id, matiere_id) do nothing;

  select qs.*
  into v_score
  from public.quiz_scores qs
  where qs.user_id = auth.uid()
    and qs.matiere_id = v_challenge.matiere_id
  for update;

  select coalesce((s.valeur #>> '{}')::integer, 1500)
  into v_anti_spam_ms
  from public.app_settings s
  where s.cle = 'anti_spam_quiz_rapide_ms';

  if v_score.derniere_reponse_at is not null
     and v_score.derniere_reponse_at > clock_timestamp() - make_interval(
       secs => coalesce(v_anti_spam_ms, 1500)::double precision / 1000.0
     ) then
    raise exception 'trop_rapide';
  end if;

  v_bonne := p_choix = v_question.bonne_reponse;

  update public.quiz_rapide_challenges
  set answered_at = clock_timestamp()
  where id = v_challenge.id;

  update public.quiz_scores
  set points = points + case when v_bonne then 5 else 0 end,
      nb_bonnes = nb_bonnes + case when v_bonne then 1 else 0 end,
      nb_questions = nb_questions + 1,
      streak_actuel = case when v_bonne then streak_actuel + 1 else 0 end,
      streak_max = greatest(
        streak_max,
        case when v_bonne then streak_actuel + 1 else streak_actuel end
      ),
      derniere_reponse_at = clock_timestamp(),
      updated_at = clock_timestamp()
  where user_id = auth.uid()
    and matiere_id = v_challenge.matiere_id
  returning * into v_score;

  if v_bonne then
    perform set_config('app.internal_update', 'on', true);
    update public.profiles
    set points_carriere = points_carriere + 5
    where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());

  return jsonb_build_object(
    'bonne', v_bonne,
    'bonne_reponse', v_question.bonne_reponse,
    'justification', v_question.explication,
    'explication', v_question.explication,
    'points', v_score.points,
    'streak_actuel', v_score.streak_actuel,
    'streak_max', v_score.streak_max
  );
end;
$$;

-- Surface RPC minimale : aucune exécution anonyme et aucune lecture directe de
-- la banque/challenges par les élèves.
revoke all on function public.get_quiz_rapide_question(uuid)
  from public, anon, authenticated;
revoke all on function public.submit_quiz_rapide(uuid, text)
  from public, anon, authenticated;
grant execute on function public.get_quiz_rapide_question(uuid)
  to authenticated;
grant execute on function public.submit_quiz_rapide(uuid, text)
  to authenticated;

-- Audit transactionnel : six questions valides minimum par matière seedée,
-- aucune question publiée sans justification et compteur explicite du reliquat.
do $$
declare
  v_matiere record;
  v_valides integer;
  v_invalides_actives integer;
  v_explications_manquantes_actives integer;
  v_explications_manquantes_total integer;
begin
  for v_matiere in
    select expected.slug
    from (values
      ('maths'),
      ('physique-chimie'),
      ('svt'),
      ('francais'),
      ('anglais'),
      ('histoire-geo'),
      ('philosophie'),
      ('espagnol')
    ) as expected(slug)
  loop
    select count(*)
    into v_valides
    from public.quiz_rapide_questions q
    join public.matieres m on m.id = q.matiere_id
    where m.slug = v_matiere.slug
      and q.active
      and public.quiz_rapide_question_est_eligible_v2(
        q.enonce, q.choix, q.bonne_reponse, q.explication
      );

    if v_valides < 6 then
      raise exception 'banque_quiz_rapide_insuffisante:%:%', v_matiere.slug, v_valides;
    end if;
  end loop;

  select count(*)
  into v_invalides_actives
  from public.quiz_rapide_questions q
  where q.active
    and not public.quiz_rapide_question_est_eligible_v2(
      q.enonce, q.choix, q.bonne_reponse, q.explication
    );
  if v_invalides_actives <> 0 then
    raise exception 'quiz_rapide_questions_actives_invalides:%', v_invalides_actives;
  end if;

  select count(*)
  into v_explications_manquantes_actives
  from public.quiz_rapide_questions q
  where q.active
    and btrim(coalesce(q.explication, '')) = '';
  if v_explications_manquantes_actives <> 0 then
    raise exception 'quiz_rapide_explications_actives_manquantes:%',
      v_explications_manquantes_actives;
  end if;

  select count(*)
  into v_explications_manquantes_total
  from public.quiz_rapide_questions q
  where btrim(coalesce(q.explication, '')) = '';

  raise notice 'quiz_rapide_explications_manquantes_total=%', v_explications_manquantes_total;
  raise notice 'quiz_rapide_explications_actives_manquantes=%', v_explications_manquantes_actives;
  raise notice 'quiz_rapide_questions_actives_invalides=%', v_invalides_actives;
end;
$$;

notify pgrst, 'reload schema';

commit;
