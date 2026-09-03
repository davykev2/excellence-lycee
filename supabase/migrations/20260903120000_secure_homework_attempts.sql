begin;

-- ============================================================================
-- Devoirs interactifs sécurisés
--
-- Cette couche installe un socle autonome compatible avec la base Excellence
-- moderne (profiles.level_id / profiles.role), puis expose le moteur versionné
-- sans republier de sujet ni de corrigé. Le sujet et le corrigé possèdent deux
-- interrupteurs distincts. Une question hybride réserve une part au résultat
-- final (auto) et une part à la démonstration (revue humaine critériée).
-- ============================================================================

create extension if not exists pgcrypto;

-- La production active utilise `is_platform_admin()` et non l'ancien helper
-- `is_admin()`. Cette façade garde le moteur Devoirs lisible sans dupliquer la
-- logique des rôles.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_platform_admin();
$$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Socle privé et autonome. Ces tables portent uniquement les devoirs
-- interactifs ; elles ne deviennent jamais une seconde source de vérité pour
-- le catalogue de parcours versionné dans l'application.
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
  ordre int not null default 0
);

create table if not exists public.matieres_series (
  matiere_id uuid not null references public.matieres(id) on delete cascade,
  serie_id uuid not null references public.series(id) on delete cascade,
  primary key (matiere_id, serie_id)
);

insert into public.niveaux (nom, ordre) values
  ('Seconde', 1),
  ('Première', 2),
  ('Terminale', 3)
on conflict (nom) do update set ordre = excluded.ordre;

insert into public.series (nom, niveau_id)
select seed.nom, niveau.id
from (values
  ('Seconde', 'a'), ('Seconde', 'c'),
  ('Première', 'a'), ('Première', 'c'), ('Première', 'd'),
  ('Terminale', 'a'), ('Terminale', 'c'), ('Terminale', 'd')
) as seed(niveau_nom, nom)
join public.niveaux niveau on niveau.nom = seed.niveau_nom
on conflict (nom, niveau_id) do nothing;

insert into public.matieres (nom, slug, icone, ordre) values
  ('Mathématiques', 'maths', '📐', 10),
  ('Physique-Chimie', 'physique-chimie', '⚛️', 20),
  ('Français', 'francais', '📚', 30),
  ('Anglais', 'anglais', '🌍', 40),
  ('SVT', 'svt', '🧬', 50),
  ('Philosophie', 'philosophie', '💭', 60),
  ('Histoire-Géographie', 'histoire-geo', '🗺️', 70)
on conflict (slug) do update set
  nom = excluded.nom,
  icone = excluded.icone,
  ordre = excluded.ordre;

insert into public.matieres_series (matiere_id, serie_id)
select matiere.id, serie.id
from public.matieres matiere
cross join public.series serie
on conflict do nothing;

create table if not exists public.devoirs_editoriaux (
  id uuid primary key default gen_random_uuid(),
  matiere_id uuid not null references public.matieres(id) on delete restrict,
  serie_id uuid not null references public.series(id) on delete restrict,
  numero int not null check (numero > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (matiere_id, serie_id, numero)
);

create table if not exists public.quiz (
  id uuid primary key default gen_random_uuid(),
  chapitre_id uuid,
  matiere_id uuid references public.matieres(id) on delete cascade,
  serie_id uuid references public.series(id) on delete cascade,
  type text not null check (type in ('chapitre', 'devoir')),
  titre text not null,
  numero int not null default 1,
  duree_sec int,
  code text,
  palier text check (palier is null or palier in ('entrainement', 'maitrise', 'concours')),
  est_note boolean not null default true,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  devoir_id uuid references public.devoirs_editoriaux(id) on delete restrict,
  version_devoir int,
  statut_editorial text,
  publication_id uuid,
  published_at timestamptz,
  archived_at timestamptz,
  updated_at timestamptz not null default now(),
  revision_editoriale bigint not null default 0,
  constraint quiz_homework_target check (type <> 'devoir' or matiere_id is not null)
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quiz(id) on delete cascade,
  ordre int not null default 0,
  code text,
  enonce text not null,
  type text not null default 'qcm' check (type in ('qcm', 'texte')),
  choix jsonb,
  bonnes_reponses jsonb not null,
  points int not null default 1,
  image_url text,
  explication text,
  difficulte int check (difficulte is null or difficulte between 1 and 3),
  origine text check (origine is null or origine in ('originale', 'adaptee', 'citation')),
  licence_code text,
  content_hash text,
  image_alt text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (quiz_id, ordre)
);

create table if not exists public.tentatives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  quiz_id uuid not null references public.quiz(id) on delete cascade,
  numero_tentative int not null default 1,
  statut text not null default 'en_cours' check (statut in ('en_cours', 'terminee', 'abandonnee')),
  note numeric(6,2),
  temps_pris_sec int,
  date_fin_theorique timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, quiz_id, numero_tentative)
);

create table if not exists public.reponses (
  id uuid primary key default gen_random_uuid(),
  tentative_id uuid not null references public.tentatives(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  choix_selectionnes jsonb,
  correcte boolean not null default false,
  unique (tentative_id, question_id)
);

create index if not exists homework_quiz_catalog_idx
  on public.quiz(matiere_id, serie_id, published, created_at desc);
create index if not exists homework_questions_quiz_idx
  on public.questions(quiz_id, ordre);
create index if not exists homework_attempts_user_quiz_idx
  on public.tentatives(user_id, quiz_id, created_at desc);
create index if not exists homework_answers_attempt_idx
  on public.reponses(tentative_id);

alter table public.niveaux enable row level security;
alter table public.series enable row level security;
alter table public.matieres enable row level security;
alter table public.matieres_series enable row level security;
alter table public.devoirs_editoriaux enable row level security;
alter table public.quiz enable row level security;
alter table public.questions enable row level security;
alter table public.tentatives enable row level security;
alter table public.reponses enable row level security;

revoke all on table public.niveaux, public.series, public.matieres,
  public.matieres_series, public.devoirs_editoriaux, public.quiz,
  public.questions, public.tentatives, public.reponses from anon, authenticated;

-- Façades historiques privées : la base moderne n'a aucun ancien quiz à
-- reprendre. Elles ne servent qu'à conserver la frontière de sécurité prévue
-- plus bas lors du renommage des anciens RPC.
create or replace function public.answer_question(
  p_tentative_id uuid,
  p_question_id uuid,
  p_choix jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  raise exception 'legacy_quiz_unavailable';
end;
$$;

create or replace function public.finalize_tentative(p_tentative_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
begin
  raise exception 'legacy_quiz_unavailable';
end;
$$;

alter table public.devoirs_editoriaux
  add column if not exists homework_stable_id text,
  add column if not exists public_slug text,
  add column if not exists institution text,
  add column if not exists academic_year text,
  add column if not exists subject_code text,
  add column if not exists level_code text,
  add column if not exists series_code text;

-- L'ancien moteur identifiait un devoir par le seul triplet
-- matière/série/numéro. Deux établissements ne pouvaient donc pas publier le
-- même numéro. L'identité moderne inclut explicitement l'établissement et
-- l'année scolaire ; une entité legacy n'est jamais renommée/adoptée en silence.
alter table public.devoirs_editoriaux
  drop constraint if exists devoirs_editoriaux_matiere_id_serie_id_numero_key;
drop index if exists public.uniq_quiz_devoir_numero_publie;

update public.devoirs_editoriaux d
set
  homework_stable_id = coalesce(d.homework_stable_id, 'legacy-' || d.id::text),
  public_slug = coalesce(d.public_slug, 'devoir-' || d.id::text),
  institution = coalesce(d.institution, 'Établissement non renseigné'),
  academic_year = coalesce(d.academic_year, 'Année non renseignée'),
  subject_code = coalesce(d.subject_code, (
    select case m.slug
      when 'maths' then 'mathematics'
      when 'physique-chimie' then 'physics-chemistry'
      when 'francais' then 'french'
      when 'anglais' then 'english'
      when 'histoire-geo' then 'history-geography'
      when 'philosophie' then 'philosophy'
      else m.slug
    end
    from public.matieres m where m.id = d.matiere_id
  )),
  level_code = coalesce(d.level_code, (
    select lower(translate(n.nom, 'èéêëàâäîïôöùûüç', 'eeeeaaaiioouuuc')) || '-' || lower(s.nom)
    from public.series s join public.niveaux n on n.id = s.niveau_id
    where s.id = d.serie_id
  )),
  series_code = coalesce(d.series_code, (
    select lower(s.nom) from public.series s where s.id = d.serie_id
  ));

create unique index if not exists devoirs_editoriaux_homework_stable_idx
  on public.devoirs_editoriaux(homework_stable_id)
  where homework_stable_id is not null;
create unique index if not exists devoirs_editoriaux_public_slug_idx
  on public.devoirs_editoriaux(public_slug)
  where public_slug is not null;
create unique index if not exists devoirs_editoriaux_homework_identity_idx
  on public.devoirs_editoriaux(
    matiere_id,
    serie_id,
    numero,
    lower(btrim(institution)),
    academic_year
  )
  where institution is not null and academic_year is not null;

alter table public.quiz
  add column if not exists homework_import_id uuid,
  add column if not exists homework_subject_open boolean not null default false,
  add column if not exists homework_corrections_published boolean not null default false,
  add column if not exists homework_grading_mode text,
  add column if not exists homework_instructions_markdown text,
  add column if not exists homework_source_notice text,
  add column if not exists homework_max_attempts int not null default 3,
  add column if not exists homework_payload_hash text;

update public.quiz
set homework_grading_mode = coalesce(homework_grading_mode, 'auto')
where type = 'devoir';

alter table public.quiz drop constraint if exists quiz_homework_grading_mode_check;
alter table public.quiz add constraint quiz_homework_grading_mode_check
  check (homework_grading_mode is null or homework_grading_mode in ('auto', 'manual', 'hybrid'));
alter table public.quiz drop constraint if exists quiz_homework_max_attempts_check;
alter table public.quiz add constraint quiz_homework_max_attempts_check
  check (homework_max_attempts between 1 and 10);
create unique index if not exists quiz_homework_import_id_idx
  on public.quiz(homework_import_id) where homework_import_id is not null;

alter table public.questions
  add column if not exists homework_question_key text,
  add column if not exists homework_section_id text,
  add column if not exists homework_section_title text,
  add column if not exists homework_section_order int,
  add column if not exists homework_exercise_id text,
  add column if not exists homework_exercise_title text,
  add column if not exists homework_exercise_order int,
  add column if not exists homework_exercise_instructions_markdown text,
  add column if not exists homework_question_label text,
  add column if not exists homework_answer_kind text,
  add column if not exists homework_grading_mode text,
  add column if not exists homework_points numeric(8,2),
  add column if not exists homework_auto_points numeric(8,2),
  add column if not exists homework_manual_points numeric(8,2),
  add column if not exists homework_neutralized boolean not null default false,
  add column if not exists homework_choices jsonb,
  add column if not exists homework_expected_answer jsonb,
  add column if not exists homework_explanation_markdown text,
  add column if not exists homework_rubric jsonb not null default '[]'::jsonb,
  add column if not exists homework_source_notice text;

update public.questions question
set
  homework_question_key = coalesce(question.homework_question_key, 'legacy-' || question.id::text),
  homework_section_id = coalesce(question.homework_section_id, 'subject'),
  homework_section_title = coalesce(question.homework_section_title, 'Sujet'),
  homework_section_order = coalesce(question.homework_section_order, 1),
  homework_exercise_id = coalesce(question.homework_exercise_id, 'exercise-' || question.ordre::text),
  homework_exercise_title = coalesce(question.homework_exercise_title, 'Exercice ' || question.ordre::text),
  homework_exercise_order = coalesce(question.homework_exercise_order, question.ordre),
  homework_question_label = coalesce(question.homework_question_label, question.ordre::text),
  homework_answer_kind = coalesce(question.homework_answer_kind, case when question.type = 'qcm' then 'single-choice' else 'short-text' end),
  homework_grading_mode = coalesce(question.homework_grading_mode, 'auto'),
  homework_points = coalesce(question.homework_points, question.points::numeric),
  homework_auto_points = coalesce(question.homework_auto_points, question.points::numeric),
  homework_manual_points = coalesce(question.homework_manual_points, 0),
  homework_choices = coalesce(question.homework_choices, case
    when jsonb_typeof(question.choix) = 'array' then (
      select jsonb_agg(jsonb_build_object(
        'id', chr(64 + item.ordinality::int),
        'label', chr(64 + item.ordinality::int),
        'contentMarkdown', item.value
      ) order by item.ordinality)
      from jsonb_array_elements_text(question.choix) with ordinality item(value, ordinality)
    ) else null end),
  homework_expected_answer = coalesce(question.homework_expected_answer, question.bonnes_reponses),
  homework_explanation_markdown = coalesce(question.homework_explanation_markdown, question.explication, '')
where exists (
  select 1 from public.quiz quiz where quiz.id = question.quiz_id and quiz.type = 'devoir'
);

alter table public.questions drop constraint if exists questions_homework_answer_kind_check;
alter table public.questions add constraint questions_homework_answer_kind_check check (
  homework_answer_kind is null or homework_answer_kind in (
    'single-choice', 'true-false', 'short-text', 'number', 'formula', 'essay'
  )
);
alter table public.questions drop constraint if exists questions_homework_grading_mode_check;
alter table public.questions add constraint questions_homework_grading_mode_check check (
  homework_grading_mode is null or homework_grading_mode in ('auto', 'manual', 'hybrid')
);
alter table public.questions drop constraint if exists questions_homework_points_check;
alter table public.questions add constraint questions_homework_points_check check (
  homework_points is null or (
    homework_points > 0
    and homework_auto_points >= 0
    and homework_manual_points >= 0
    and abs(homework_auto_points + homework_manual_points - homework_points) < 0.001
  )
);
create unique index if not exists questions_homework_key_idx
  on public.questions(quiz_id, homework_question_key)
  where homework_question_key is not null;

alter table public.tentatives
  add column if not exists homework_review_status text,
  add column if not exists homework_auto_points numeric(10,2) not null default 0,
  add column if not exists homework_pending_manual_points numeric(10,2) not null default 0,
  add column if not exists homework_total_points numeric(10,2) not null default 0,
  add column if not exists homework_review_comment text,
  add column if not exists homework_reviewed_by uuid references public.profiles(id) on delete set null,
  add column if not exists homework_reviewed_at timestamptz;

alter table public.tentatives drop constraint if exists tentatives_homework_review_status_check;
alter table public.tentatives add constraint tentatives_homework_review_status_check
  check (homework_review_status is null or homework_review_status in ('not-required', 'pending', 'completed'));
create unique index if not exists tentatives_homework_active_idx
  on public.tentatives(user_id, quiz_id)
  where statut = 'en_cours' and homework_review_status is not null;

alter table public.reponses
  add column if not exists homework_attachment_urls jsonb not null default '[]'::jsonb,
  add column if not exists homework_auto_points numeric(8,2) not null default 0,
  add column if not exists homework_manual_points numeric(8,2),
  add column if not exists homework_review_comment text,
  add column if not exists homework_rubric_awards jsonb;

-- Réaffirme la frontière de lecture des questions après l'ajout des colonnes
-- privées (clé, correction et barème interne). Le rôle authenticated possède
-- le droit de table nécessaire aux RPC, mais la RLS ne laisse passer qu'un
-- administrateur en SELECT direct.
drop policy if exists "questions_select_admin" on public.questions;
create policy "questions_select_admin" on public.questions for select using (public.is_admin());

-- Les RPC dédiés renvoient une projection sûre. Les lignes brutes d'un devoir
-- sécurisé contiennent le verdict et les points automatiques : elles ne sont
-- donc jamais lisibles directement par l'élève. Les quiz/exercices historiques
-- conservent leur ancien contrat de lecture.
drop policy if exists "tentatives_select_own" on public.tentatives;
create policy "tentatives_select_own" on public.tentatives for select using (
  public.is_admin()
  or (
    user_id = auth.uid()
    and exists (
      select 1 from public.quiz q
      where q.id = tentatives.quiz_id and q.homework_import_id is null
    )
  )
);

drop policy if exists "reponses_select_own" on public.reponses;
create policy "reponses_select_own" on public.reponses for select using (
  public.is_admin()
  or exists (
    select 1
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    where t.id = reponses.tentative_id
      and t.user_id = auth.uid()
      and q.homework_import_id is null
  )
);

-- Les anciens RPC `start_tentative` / `finalize_tentative` restent nécessaires
-- aux quiz historiques. Ils ne doivent toutefois jamais écrire dans une copie
-- issue du nouveau paquet privé, sous peine de contourner le barème hybride.
create or replace function public.proteger_tentative_devoir_securise_v1()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_quiz_id uuid;
  v_attempt_id uuid;
begin
  if tg_table_name = 'tentatives' then
    v_quiz_id := case when tg_op = 'DELETE' then old.quiz_id else new.quiz_id end;
  else
    v_attempt_id := case when tg_op = 'DELETE' then old.tentative_id else new.tentative_id end;
    select quiz_id into v_quiz_id from public.tentatives where id = v_attempt_id;
  end if;

  if exists (
    select 1 from public.quiz q
    where q.id = v_quiz_id and q.type = 'devoir' and q.homework_import_id is not null
  ) and current_setting('app.homework_secure_internal', true) is distinct from 'on' then
    raise exception 'secure_homework_rpc_required';
  end if;

  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;

drop trigger if exists trg_proteger_tentative_devoir_securise on public.tentatives;
create trigger trg_proteger_tentative_devoir_securise
  before insert or update or delete on public.tentatives
  for each row execute function public.proteger_tentative_devoir_securise_v1();

drop trigger if exists trg_proteger_reponse_devoir_securise on public.reponses;
create trigger trg_proteger_reponse_devoir_securise
  before insert or update or delete on public.reponses
  for each row execute function public.proteger_tentative_devoir_securise_v1();

-- Les helpers ci-dessous sont internes : seuls les RPC de façade sont accordés.
create or replace function public.homework_summary_json_v1(
  p_quiz_id uuid,
  p_actor_id uuid
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_quiz public.quiz%rowtype;
  v_devoir public.devoirs_editoriaux%rowtype;
  v_matiere public.matieres%rowtype;
  v_attempts int;
  v_active uuid;
  v_latest uuid;
  v_completed boolean;
  v_exercise_count int;
  v_question_count int;
  v_total numeric;
begin
  select * into v_quiz from public.quiz where id = p_quiz_id and type = 'devoir';
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;
  select * into v_devoir from public.devoirs_editoriaux where id = v_quiz.devoir_id;
  select * into v_matiere from public.matieres where id = v_devoir.matiere_id;
  select count(*) into v_attempts
  from public.tentatives t
  join public.quiz attempt_quiz on attempt_quiz.id = t.quiz_id
  join public.devoirs_editoriaux attempt_devoir on attempt_devoir.id = attempt_quiz.devoir_id
  where t.user_id = p_actor_id
    and attempt_devoir.homework_stable_id = v_devoir.homework_stable_id;

  -- Une nouvelle version ne doit pas faire disparaître la copie précédente de
  -- la bibliothèque, ni empêcher la reprise d'une tentative encore active.
  select
    (array_agg(t.id order by t.created_at desc) filter (
      where t.statut = 'en_cours' and (t.date_fin_theorique is null or t.date_fin_theorique > now())
    ))[1],
    (array_agg(t.id order by t.created_at desc) filter (where t.statut = 'terminee'))[1],
    coalesce(bool_or(t.statut = 'terminee'), false)
  into v_active, v_latest, v_completed
  from public.tentatives t
  join public.quiz attempt_quiz on attempt_quiz.id = t.quiz_id
  join public.devoirs_editoriaux attempt_devoir on attempt_devoir.id = attempt_quiz.devoir_id
  where t.user_id = p_actor_id
    and attempt_devoir.homework_stable_id = v_devoir.homework_stable_id;
  select count(distinct (q.homework_section_id, q.homework_exercise_id)),
    count(*), coalesce(sum(q.homework_points), 0)
  into v_exercise_count, v_question_count, v_total
  from public.questions q where q.quiz_id = p_quiz_id;

  return jsonb_build_object(
    'id', v_quiz.id,
    'stableId', v_devoir.homework_stable_id,
    'slug', v_devoir.public_slug,
    'title', v_quiz.titre,
    'number', v_devoir.numero,
    'version', v_quiz.version_devoir,
    'editorialStatus', case
      when v_quiz.statut_editorial = 'publie' and v_quiz.published then 'published'
      else 'archived'
    end,
    'institution', v_devoir.institution,
    'academicYear', v_devoir.academic_year,
    'subject', jsonb_build_object('id', v_devoir.subject_code, 'name', v_matiere.nom, 'icon', v_matiere.icone),
    'level', jsonb_build_object('id', v_devoir.level_code, 'name', initcap(split_part(v_devoir.level_code, '-', 1))),
    'series', jsonb_build_object('id', v_devoir.series_code, 'name', upper(v_devoir.series_code)),
    'durationSeconds', v_quiz.duree_sec,
    'gradingMode', v_quiz.homework_grading_mode,
    'subjectPublished', v_quiz.homework_subject_open,
    'correctionsPublished', v_quiz.homework_corrections_published,
    'exerciseCount', v_exercise_count,
    'questionCount', v_question_count,
    'totalPoints', v_total,
    'scoreMax', 20,
    'attemptsUsed', v_attempts,
    'maxAttempts', v_quiz.homework_max_attempts,
    'activeAttemptId', v_active,
    'latestAttemptId', v_latest,
    'status', case when v_active is not null then 'in-progress' when v_completed then 'completed' else 'available' end
  );
end;
$$;

create or replace function public.homework_attempt_json_v1(p_attempt_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_answers jsonb;
  v_answered int;
  v_total int;
begin
  select * into v_attempt from public.tentatives where id = p_attempt_id;
  if v_attempt.id is null then raise exception 'attempt_not_found'; end if;
  select coalesce(jsonb_object_agg(
    r.question_id::text,
    jsonb_build_object(
      'answer', r.choix_selectionnes,
      'attachmentUrls', coalesce(r.homework_attachment_urls, '[]'::jsonb)
    )
  ), '{}'::jsonb)
  into v_answers
  from public.reponses r where r.tentative_id = p_attempt_id;
  select count(*), count(*) filter (where q.homework_neutralized or r.id is not null)
  into v_total, v_answered
  from public.questions q
  left join public.reponses r
    on r.question_id = q.id and r.tentative_id = p_attempt_id
  where q.quiz_id = v_attempt.quiz_id;
  return jsonb_build_object(
    'id', v_attempt.id,
    'homeworkId', v_attempt.quiz_id,
    'attemptNumber', v_attempt.numero_tentative,
    'status', case
      when v_attempt.statut = 'en_cours' then 'in-progress'
      when v_attempt.homework_review_status = 'pending' then 'awaiting-review'
      else 'graded'
    end,
    'startedAt', v_attempt.created_at,
    'expiresAt', v_attempt.date_fin_theorique,
    'submittedAt', case when v_attempt.statut = 'terminee' then v_attempt.updated_at else null end,
    'serverNow', now(),
    'answers', v_answers,
    'answeredCount', v_answered,
    'questionCount', v_total
  );
end;
$$;

create or replace function public.import_homework_package_v1(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_import_id uuid;
  v_payload_hash text;
  v_stable_id text;
  v_slug text;
  v_subject_code text;
  v_subject_slug text;
  v_level_code text;
  v_level_name text;
  v_series_code text;
  v_matiere public.matieres%rowtype;
  v_niveau public.niveaux%rowtype;
  v_serie public.series%rowtype;
  v_devoir public.devoirs_editoriaux%rowtype;
  v_quiz public.quiz%rowtype;
  v_existing public.quiz%rowtype;
  v_version int;
  v_section jsonb;
  v_exercise jsonb;
  v_question jsonb;
  v_section_order bigint;
  v_exercise_order bigint;
  v_question_order bigint := 0;
  v_points numeric;
  v_auto numeric;
  v_manual numeric;
  v_mode text;
  v_type text;
  v_answer_kind text;
  v_image_url text;
  v_image_alt text;
  v_choices jsonb;
  v_choice_contents jsonb;
  v_expected jsonb;
  v_neutralized boolean;
  v_rubric jsonb;
  v_rubric_total numeric;
  v_derived_mode text;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  if jsonb_typeof(p_payload) <> 'object' then raise exception 'homework_payload_invalid'; end if;

  begin
    v_import_id := (p_payload ->> 'importId')::uuid;
  exception when others then
    raise exception 'homework_import_id_invalid';
  end;
  v_payload_hash := md5(p_payload::text);
  v_stable_id := btrim(coalesce(p_payload ->> 'stableId', ''));
  v_slug := btrim(coalesce(p_payload ->> 'slug', ''));
  v_subject_code := btrim(coalesce(p_payload #>> '{subject,id}', ''));
  v_level_code := btrim(coalesce(p_payload #>> '{level,id}', ''));
  v_series_code := lower(split_part(v_level_code, '-', 2));
  v_level_name := case split_part(v_level_code, '-', 1)
    when 'seconde' then 'Seconde'
    when 'premiere' then 'Première'
    when 'terminale' then 'Terminale'
    else null
  end;

  if v_stable_id !~ '^[A-Za-z0-9][A-Za-z0-9-]{2,119}$'
     or v_slug !~ '^[A-Za-z0-9][A-Za-z0-9-]{2,119}$' then
    raise exception 'homework_reference_invalid';
  end if;
  if v_level_code not in (
    'seconde-a', 'seconde-c', 'premiere-a', 'premiere-c', 'premiere-d',
    'terminale-a', 'terminale-c', 'terminale-d'
  ) then raise exception 'homework_level_invalid'; end if;
  if lower(btrim(coalesce(p_payload #>> '{series,id}', ''))) is distinct from v_series_code then
    raise exception 'homework_series_level_mismatch';
  end if;
  if v_subject_code not in (
    'mathematics', 'physics-chemistry', 'french', 'english', 'svt', 'philosophy', 'history-geography'
  ) then raise exception 'homework_subject_invalid'; end if;
  if btrim(coalesce(p_payload ->> 'title', '')) = ''
     or btrim(coalesce(p_payload ->> 'institution', '')) = ''
     or coalesce(p_payload ->> 'academicYear', '') !~ '^20[0-9]{2}[–-]20[0-9]{2}$'
     or coalesce((p_payload ->> 'number')::int, 0) <= 0
     or coalesce((p_payload ->> 'durationSeconds')::int, 0) < 60
     or coalesce((p_payload ->> 'maxAttempts')::int, 0) not between 1 and 10
     or length(coalesce(p_payload ->> 'instructionsMarkdown', '')) > 30000
     or length(coalesce(p_payload ->> 'sourceNotice', '')) > 4000
     or jsonb_typeof(p_payload -> 'sections') <> 'array'
     or jsonb_array_length(p_payload -> 'sections') = 0 then
    raise exception 'homework_metadata_invalid';
  end if;
  if coalesce((p_payload ->> 'correctionsPublished')::boolean, false)
     and coalesce((p_payload ->> 'subjectPublished')::boolean, false) then
    raise exception 'homework_correction_requires_closed_subject';
  end if;
  if (
    select count(*) <> count(distinct item ->> 'id')
    from jsonb_array_elements(p_payload -> 'sections') item
  ) then raise exception 'homework_section_ids_duplicated'; end if;

  select * into v_existing
  from public.quiz where homework_import_id = v_import_id;
  if v_existing.id is not null then
    select * into v_devoir from public.devoirs_editoriaux where id = v_existing.devoir_id;
    if v_devoir.homework_stable_id is distinct from v_stable_id
       or v_existing.homework_payload_hash is distinct from v_payload_hash then
      raise exception 'homework_import_id_conflict';
    end if;
    return jsonb_build_object(
      'homework', public.homework_summary_json_v1(v_existing.id, auth.uid()),
      'imported', false,
      'version', v_existing.version_devoir
    );
  end if;

  v_subject_slug := case v_subject_code
    when 'mathematics' then 'maths'
    when 'physics-chemistry' then 'physique-chimie'
    when 'french' then 'francais'
    when 'english' then 'anglais'
    when 'history-geography' then 'histoire-geo'
    when 'philosophy' then 'philosophie'
    else v_subject_code
  end;
  select * into v_matiere from public.matieres where slug = v_subject_slug;
  select * into v_niveau from public.niveaux where nom = v_level_name;
  select * into v_serie from public.series where niveau_id = v_niveau.id and lower(nom) = v_series_code;
  if v_matiere.id is null or v_niveau.id is null or v_serie.id is null then
    raise exception 'homework_catalog_target_not_found';
  end if;
  if not exists (
    select 1 from public.matieres_series ms
    where ms.matiere_id = v_matiere.id and ms.serie_id = v_serie.id
  ) then raise exception 'homework_subject_not_available_for_series'; end if;

  select * into v_devoir
  from public.devoirs_editoriaux
  where homework_stable_id = v_stable_id
  for update;

  if exists (
    select 1 from public.devoirs_editoriaux d
    where d.matiere_id = v_matiere.id
      and d.serie_id = v_serie.id
      and d.numero = (p_payload ->> 'number')::int
      and lower(btrim(d.institution)) = lower(btrim(p_payload ->> 'institution'))
      and d.academic_year = p_payload ->> 'academicYear'
      and d.homework_stable_id is distinct from v_stable_id
  ) then
    raise exception 'homework_identity_conflict';
  end if;

  if v_devoir.id is null then
    if exists (
      select 1 from public.devoirs_editoriaux
      where public_slug = v_slug
    ) then
      raise exception 'homework_slug_conflict';
    end if;
    perform set_config('app.devoirs_admin_internal', 'on', true);
    insert into public.devoirs_editoriaux (
      matiere_id, serie_id, numero, homework_stable_id, public_slug,
      institution, academic_year, subject_code, level_code, series_code
    ) values (
      v_matiere.id, v_serie.id, (p_payload ->> 'number')::int,
      v_stable_id, v_slug, btrim(p_payload ->> 'institution'),
      p_payload ->> 'academicYear', v_subject_code, v_level_code, v_series_code
    ) returning * into v_devoir;
  else
    if v_devoir.public_slug is distinct from v_slug
       or v_devoir.matiere_id is distinct from v_matiere.id
       or v_devoir.serie_id is distinct from v_serie.id
       or v_devoir.numero is distinct from (p_payload ->> 'number')::int
       or v_devoir.institution is distinct from btrim(p_payload ->> 'institution')
       or v_devoir.academic_year is distinct from (p_payload ->> 'academicYear') then
      raise exception 'homework_stable_metadata_conflict';
    end if;
  end if;

  select coalesce(max(version_devoir), 0) + 1 into v_version
  from public.quiz where devoir_id = v_devoir.id and type = 'devoir';

  perform set_config('app.devoirs_admin_internal', 'on', true);
  update public.quiz
  set statut_editorial = 'archive', published = false, homework_subject_open = false,
      archived_at = now()
  where devoir_id = v_devoir.id and type = 'devoir' and statut_editorial = 'publie';

  insert into public.quiz (
    matiere_id, serie_id, type, titre, numero, duree_sec, palier, est_note,
    published, devoir_id, version_devoir, statut_editorial, publication_id,
    published_at, revision_editoriale, homework_import_id,
    homework_subject_open, homework_corrections_published,
    homework_grading_mode, homework_instructions_markdown, homework_source_notice,
    homework_max_attempts, homework_payload_hash
  ) values (
    v_matiere.id, v_serie.id, 'devoir', btrim(p_payload ->> 'title'),
    v_devoir.numero, (p_payload ->> 'durationSeconds')::int,
    null, true, true, v_devoir.id, v_version, 'publie', gen_random_uuid(),
    now(), 1, v_import_id,
    coalesce((p_payload ->> 'subjectPublished')::boolean, false),
    coalesce((p_payload ->> 'correctionsPublished')::boolean, false),
    p_payload ->> 'gradingMode', nullif(btrim(coalesce(p_payload ->> 'instructionsMarkdown', '')), ''),
    nullif(btrim(coalesce(p_payload ->> 'sourceNotice', '')), ''),
    (p_payload ->> 'maxAttempts')::int, v_payload_hash
  ) returning * into v_quiz;

  for v_section, v_section_order in
    select item.value, item.ordinality
    from jsonb_array_elements(p_payload -> 'sections') with ordinality item(value, ordinality)
  loop
    if (v_section ->> 'order')::int <> v_section_order
       or coalesce(v_section ->> 'id', '') !~ '^[A-Za-z0-9][A-Za-z0-9-]{2,119}$'
       or btrim(coalesce(v_section ->> 'title', '')) = ''
       or jsonb_typeof(v_section -> 'exercises') <> 'array'
       or jsonb_array_length(v_section -> 'exercises') = 0 then
      raise exception 'homework_section_invalid';
    end if;
    if (
      select count(*) <> count(distinct item ->> 'id')
      from jsonb_array_elements(v_section -> 'exercises') item
    ) then raise exception 'homework_exercise_ids_duplicated'; end if;
    for v_exercise, v_exercise_order in
      select item.value, item.ordinality
      from jsonb_array_elements(v_section -> 'exercises') with ordinality item(value, ordinality)
    loop
      if (v_exercise ->> 'order')::int <> v_exercise_order
         or coalesce(v_exercise ->> 'id', '') !~ '^[A-Za-z0-9][A-Za-z0-9-]{2,119}$'
         or btrim(coalesce(v_exercise ->> 'title', '')) = ''
         or length(coalesce(v_exercise ->> 'instructionsMarkdown', '')) > 30000
         or jsonb_typeof(v_exercise -> 'questions') <> 'array'
         or jsonb_array_length(v_exercise -> 'questions') = 0 then
        raise exception 'homework_exercise_invalid';
      end if;
      for v_question in select value from jsonb_array_elements(v_exercise -> 'questions')
      loop
        v_question_order := v_question_order + 1;
        v_points := (v_question ->> 'points')::numeric;
        v_auto := (v_question ->> 'autoPoints')::numeric;
        v_manual := (v_question ->> 'manualPoints')::numeric;
        v_mode := v_question ->> 'gradingMode';
        v_type := v_question ->> 'type';
        v_answer_kind := v_question ->> 'answerKind';
        v_image_url := nullif(btrim(coalesce(v_question ->> 'imageUrl', '')), '');
        v_image_alt := nullif(btrim(coalesce(v_question ->> 'imageAlt', '')), '');
        v_choices := v_question -> 'choices';
        v_expected := coalesce(v_question -> 'expectedAnswer', 'null'::jsonb);
        v_neutralized := coalesce((v_question ->> 'isNeutralized')::boolean, false);
        v_rubric := coalesce(v_question -> 'rubricCriteria', '[]'::jsonb);

        if coalesce(v_question ->> 'id', '') !~ '^[A-Za-z0-9][A-Za-z0-9-]{2,119}$'
           or btrim(coalesce(v_question ->> 'label', '')) = ''
           or btrim(coalesce(v_question ->> 'promptMarkdown', '')) = ''
           or length(btrim(coalesce(v_question ->> 'explanationMarkdown', ''))) < 20
           or length(coalesce(v_question ->> 'sourceNotice', '')) > 4000
           or v_points <= 0 or v_auto < 0 or v_manual < 0
           or abs(v_auto + v_manual - v_points) >= 0.001
           or v_mode not in ('auto', 'manual', 'hybrid')
           or v_type not in ('qcm', 'texte')
           or v_answer_kind not in ('single-choice', 'true-false', 'short-text', 'number', 'formula', 'essay') then
          raise exception 'homework_question_invalid';
        end if;
        if v_image_url is not null and v_image_url !~ '^https://[^[:space:]]+$' then
          raise exception 'homework_image_invalid';
        end if;
        if v_image_url is not null and v_image_alt is null then
          raise exception 'homework_image_alt_required';
        end if;
        if (v_mode = 'auto' and (v_auto <> v_points or v_manual <> 0))
           or (v_mode = 'manual' and (v_manual <> v_points or v_auto <> 0))
           or (v_mode = 'hybrid' and (v_auto <= 0 or v_manual <= 0 or v_type <> 'texte')) then
          raise exception 'homework_grading_partition_invalid';
        end if;
        if v_neutralized and v_expected <> 'null'::jsonb then
          raise exception 'homework_neutralized_expected_answer_forbidden';
        end if;

        if v_type = 'qcm' then
          if jsonb_typeof(v_choices) <> 'array' or jsonb_array_length(v_choices) < 2
             or jsonb_array_length(v_choices) > 8
             or v_answer_kind not in ('single-choice', 'true-false')
             or (not v_neutralized and v_mode <> 'manual' and (jsonb_typeof(v_expected) <> 'string'
             or not exists (
               select 1 from jsonb_array_elements(v_choices) choice
               where choice ->> 'id' = v_expected #>> '{}'
             ))) then raise exception 'homework_choices_invalid'; end if;
          if exists (
            select 1 from jsonb_array_elements(v_choices) choice
            where btrim(coalesce(choice ->> 'id', '')) = ''
               or btrim(coalesce(choice ->> 'label', '')) = ''
               or btrim(coalesce(choice ->> 'contentMarkdown', '')) = ''
          ) or (
            select count(*) <> count(distinct choice ->> 'id')
            from jsonb_array_elements(v_choices) choice
          ) then raise exception 'homework_choices_invalid'; end if;
          select jsonb_agg(to_jsonb(choice ->> 'contentMarkdown'))
          into v_choice_contents from jsonb_array_elements(v_choices) choice;
        else
          v_choice_contents := null;
          if v_answer_kind in ('single-choice', 'true-false') then
            raise exception 'homework_answer_kind_invalid';
          end if;
          if not v_neutralized and v_mode <> 'manual' and not (
            (jsonb_typeof(v_expected) = 'string' and btrim(v_expected #>> '{}') <> '')
            or (jsonb_typeof(v_expected) = 'array' and jsonb_array_length(v_expected) > 0
              and not exists (
                select 1 from jsonb_array_elements(v_expected) answer
                where jsonb_typeof(answer) <> 'string' or btrim(answer #>> '{}') = ''
              ))
          ) then raise exception 'homework_expected_answer_invalid'; end if;
        end if;

        if v_manual > 0 then
          if jsonb_typeof(v_rubric) <> 'array' or jsonb_array_length(v_rubric) = 0 then
            raise exception 'homework_rubric_required';
          end if;
          select coalesce(sum((criterion ->> 'pointsMax')::numeric), 0)
          into v_rubric_total from jsonb_array_elements(v_rubric) criterion;
          if abs(v_rubric_total - v_manual) >= 0.001
             or exists (
               select 1 from jsonb_array_elements(v_rubric) criterion
               where btrim(coalesce(criterion ->> 'id', '')) = ''
                  or btrim(coalesce(criterion ->> 'label', '')) = ''
                   or (criterion ->> 'pointsMax')::numeric <= 0
             ) or (
               select count(*) <> count(distinct criterion ->> 'id')
               from jsonb_array_elements(v_rubric) criterion
             ) then raise exception 'homework_rubric_invalid'; end if;
        elsif jsonb_array_length(v_rubric) > 0 then
          raise exception 'homework_rubric_unexpected';
        end if;

        insert into public.questions (
          quiz_id, ordre, enonce, type, choix, bonnes_reponses, points,
          image_url, image_alt, explication, origine, content_hash,
          homework_question_key, homework_section_id, homework_section_title,
          homework_section_order, homework_exercise_id, homework_exercise_title,
          homework_exercise_order, homework_exercise_instructions_markdown,
          homework_question_label, homework_answer_kind,
          homework_grading_mode, homework_points, homework_auto_points,
          homework_manual_points, homework_neutralized, homework_choices,
          homework_expected_answer, homework_explanation_markdown, homework_rubric,
          homework_source_notice
        ) values (
          v_quiz.id, v_question_order, btrim(v_question ->> 'promptMarkdown'), v_type,
          v_choice_contents, v_expected, greatest(1, ceil(v_points)::int),
          v_image_url,
          v_image_alt,
          btrim(v_question ->> 'explanationMarkdown'), 'originale', md5(v_question::text),
          v_question ->> 'id', v_section ->> 'id', v_section ->> 'title', v_section_order,
          v_exercise ->> 'id', v_exercise ->> 'title', v_exercise_order,
          nullif(btrim(coalesce(v_exercise ->> 'instructionsMarkdown', '')), ''),
          v_question ->> 'label', v_question ->> 'answerKind', v_mode,
          v_points, v_auto, v_manual,
          v_neutralized,
          v_choices, v_expected, btrim(v_question ->> 'explanationMarkdown'), v_rubric,
          nullif(btrim(coalesce(v_question ->> 'sourceNotice', '')), '')
        );
      end loop;
    end loop;
  end loop;

  if v_question_order = 0 then raise exception 'homework_question_required'; end if;
  select case
    when bool_and(q.homework_manual_points = 0) then 'auto'
    when bool_and(q.homework_auto_points = 0) then 'manual'
    else 'hybrid'
  end into v_derived_mode
  from public.questions q where q.quiz_id = v_quiz.id;
  if v_derived_mode is distinct from v_quiz.homework_grading_mode then
    raise exception 'homework_global_grading_mode_invalid';
  end if;

  insert into public.audit_logs(actor_user_id, action, subject_id, metadata_json)
  values (auth.uid(), 'homework.version.import', v_stable_id, jsonb_build_object(
    'quizId', v_quiz.id, 'importId', v_import_id, 'version', v_version,
    'questionCount', v_question_order,
    'subjectPublished', v_quiz.homework_subject_open,
    'correctionsPublished', v_quiz.homework_corrections_published
  ));

  return jsonb_build_object(
    'homework', public.homework_summary_json_v1(v_quiz.id, auth.uid()),
    'imported', true,
    'version', v_version
  );
end;
$$;

create or replace function public.list_homeworks_v1(
  p_subject_id text default null,
  p_academic_year text default null,
  p_institution text default null,
  p_level_id text default null
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_result jsonb;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'profile_not_found'; end if;
  if not public.is_admin() and (v_profile.role <> 'student' or v_profile.account_type <> 'student') then
    raise exception 'homework_composition_forbidden';
  end if;
  select coalesce(jsonb_agg(public.homework_summary_json_v1(q.id, auth.uid())
    order by d.academic_year desc, d.institution, m.nom, d.numero, q.version_devoir desc), '[]'::jsonb)
  into v_result
  from public.quiz q
  join public.devoirs_editoriaux d on d.id = q.devoir_id
  join public.matieres m on m.id = d.matiere_id
  where q.type = 'devoir'
    and (
      public.is_admin()
      or (
        q.statut_editorial = 'publie' and q.published
        and
        d.level_code = v_profile.level_id
        and (
          q.homework_subject_open
          or exists (
            select 1
            from public.tentatives visible_attempt
            join public.quiz attempted_quiz on attempted_quiz.id = visible_attempt.quiz_id
            where visible_attempt.user_id = auth.uid()
              and attempted_quiz.devoir_id = d.id
          )
        )
      )
    )
    and (p_level_id is null or d.level_code = p_level_id)
    and (p_subject_id is null or d.subject_code = p_subject_id)
    and (p_academic_year is null or d.academic_year = p_academic_year)
    and (p_institution is null or d.institution ilike '%' || p_institution || '%');
  return v_result;
end;
$$;

create or replace function public.get_homework_public_v1(p_homework_ref text)
returns jsonb
language plpgsql
volatile
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_quiz public.quiz%rowtype;
  v_devoir public.devoirs_editoriaux%rowtype;
  v_attempt public.tentatives%rowtype;
  v_completed_quiz_id uuid;
  v_questions jsonb;
  v_include_questions boolean := false;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'profile_not_found'; end if;
  if not public.is_admin() and (v_profile.role <> 'student' or v_profile.account_type <> 'student') then
    raise exception 'homework_composition_forbidden';
  end if;

  if not public.is_admin() then
    select t.* into v_attempt
    from public.tentatives t
    join public.quiz q on q.id = t.quiz_id
    join public.devoirs_editoriaux d on d.id = q.devoir_id
    where t.user_id = auth.uid() and t.statut = 'en_cours'
      and (q.id::text = p_homework_ref or d.homework_stable_id = p_homework_ref or d.public_slug = p_homework_ref)
    order by t.created_at desc limit 1;
    if v_attempt.id is not null and v_attempt.date_fin_theorique is not null
       and v_attempt.date_fin_theorique <= now() then
      -- Une reprise après expiration remet d'abord la copie. Sans cette étape,
      -- la page redevenait artificiellement « disponible » et le clic suivant
      -- consommait aussitôt une deuxième tentative.
      v_completed_quiz_id := v_attempt.quiz_id;
      perform public.finalize_homework_attempt_internal_v1(v_attempt.id);
      v_attempt := null;
    end if;
  end if;

  if v_attempt.id is not null then
    select * into v_quiz from public.quiz where id = v_attempt.quiz_id and type = 'devoir';
    v_include_questions := true;
  else
    select q.* into v_quiz
    from public.quiz q join public.devoirs_editoriaux d on d.id = q.devoir_id
    where q.type = 'devoir' and (
      (public.is_admin() and q.id::text = p_homework_ref)
      or (
        q.id::text = p_homework_ref
        and exists (
          select 1 from public.tentatives owned_attempt
          where owned_attempt.user_id = auth.uid() and owned_attempt.quiz_id = q.id
        )
      )
      or q.id = v_completed_quiz_id
      or (
        q.statut_editorial = 'publie' and q.published
        and (q.id::text = p_homework_ref or d.homework_stable_id = p_homework_ref or d.public_slug = p_homework_ref)
      )
    )
    order by case when q.id::text = p_homework_ref then 0 else 1 end,
      q.version_devoir desc limit 1;
    v_include_questions := public.is_admin();
  end if;
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;
  select * into v_devoir from public.devoirs_editoriaux where id = v_quiz.devoir_id;
  if not public.is_admin() and (
    v_devoir.level_code <> v_profile.level_id
    or (
      v_attempt.id is null
      and not v_quiz.homework_subject_open
      and not exists (
        select 1
        from public.tentatives visible_attempt
        join public.quiz attempted_quiz on attempted_quiz.id = visible_attempt.quiz_id
        join public.devoirs_editoriaux attempted_devoir on attempted_devoir.id = attempted_quiz.devoir_id
        where visible_attempt.user_id = auth.uid()
          and attempted_devoir.homework_stable_id = v_devoir.homework_stable_id
      )
    )
  ) then
    raise exception 'homework_access_denied';
  end if;

  if v_include_questions then
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', q.id,
      'order', q.ordre,
      'label', q.homework_question_label,
      'promptMarkdown', q.enonce,
      'type', q.type,
      'answerKind', q.homework_answer_kind,
      'gradingMode', q.homework_grading_mode,
      'isNeutralized', q.homework_neutralized,
      'choices', q.homework_choices,
      'points', q.homework_points,
      'autoPoints', q.homework_auto_points,
      'manualPoints', q.homework_manual_points,
      'imageUrl', q.image_url,
      'imageAlt', q.image_alt,
      'sourceNotice', q.homework_source_notice,
      'rubricCriteria', case when q.homework_manual_points > 0 then q.homework_rubric else null end,
      'sectionId', q.homework_section_id,
      'sectionTitle', q.homework_section_title,
      'sectionOrder', q.homework_section_order,
      'exerciseId', q.homework_exercise_id,
      'exerciseTitle', q.homework_exercise_title,
      'exerciseOrder', q.homework_exercise_order,
      'exerciseInstructionsMarkdown', q.homework_exercise_instructions_markdown
    ) order by q.ordre), '[]'::jsonb)
    into v_questions from public.questions q where q.quiz_id = v_quiz.id;
  else
    v_questions := '[]'::jsonb;
  end if;

  return jsonb_build_object(
    'summary', public.homework_summary_json_v1(v_quiz.id, auth.uid()),
    'instructionsMarkdown', v_quiz.homework_instructions_markdown,
    'sourceNotice', v_quiz.homework_source_notice,
    'questions', v_questions
  );
end;
$$;

create or replace function public.finalize_homework_attempt_internal_v1(p_attempt_id uuid)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_auto numeric;
  v_pending numeric;
  v_total numeric;
  v_note numeric;
  v_end timestamptz;
begin
  select * into v_attempt from public.tentatives where id = p_attempt_id for update;
  if v_attempt.id is null then raise exception 'attempt_not_found'; end if;
  if v_attempt.statut <> 'en_cours' then return; end if;

  perform set_config('app.homework_secure_internal', 'on', true);

  select
    coalesce(sum(case
      when q.homework_neutralized then q.homework_points
      else coalesce(r.homework_auto_points, 0)
    end), 0),
    coalesce(sum(case
      when not q.homework_neutralized and q.homework_manual_points > 0 and r.id is not null
        then q.homework_manual_points else 0 end), 0),
    coalesce(sum(q.homework_points), 0)
  into v_auto, v_pending, v_total
  from public.questions q
  left join public.reponses r on r.question_id = q.id and r.tentative_id = v_attempt.id
  where q.quiz_id = v_attempt.quiz_id;

  v_note := case when v_pending > 0 or v_total <= 0 then null else round(20 * v_auto / v_total, 2) end;
  v_end := least(now(), coalesce(v_attempt.date_fin_theorique, now()));
  update public.tentatives
  set statut = 'terminee', note = v_note,
      temps_pris_sec = greatest(0, extract(epoch from (v_end - created_at))::int),
      homework_auto_points = v_auto,
      homework_pending_manual_points = v_pending,
      homework_total_points = v_total,
      homework_review_status = case when v_pending > 0 then 'pending' else 'not-required' end,
      updated_at = now()
  where id = v_attempt.id and statut = 'en_cours';
end;
$$;

create or replace function public.homework_result_json_v1(
  p_attempt_id uuid,
  p_allow_admin_secrets boolean default false
)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_quiz public.quiz%rowtype;
  v_corrections_available boolean;
  v_answered int;
  v_question_count int;
  v_corrections jsonb;
  v_score numeric;
  v_appreciation jsonb;
begin
  select * into v_attempt from public.tentatives where id = p_attempt_id;
  if v_attempt.id is null then raise exception 'attempt_not_found'; end if;
  if v_attempt.statut <> 'terminee' then raise exception 'attempt_in_progress'; end if;
  select * into v_quiz from public.quiz where id = v_attempt.quiz_id and type = 'devoir';
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;
  select count(*), count(*) filter (where q.homework_neutralized or r.id is not null)
  into v_question_count, v_answered
  from public.questions q
  left join public.reponses r
    on r.question_id = q.id and r.tentative_id = v_attempt.id
  where q.quiz_id = v_quiz.id;
  v_corrections_available := p_allow_admin_secrets
    or (v_quiz.homework_corrections_published and v_attempt.homework_review_status <> 'pending');
  v_score := case when v_corrections_available then v_attempt.note else null end;
  if v_score is not null then
    v_appreciation := case
      when v_score >= 16 then jsonb_build_object('label', 'Excellent', 'message', 'La maîtrise est solide.')
      when v_score >= 14 then jsonb_build_object('label', 'Très bien', 'message', 'Les méthodes sont bien installées.')
      when v_score >= 12 then jsonb_build_object('label', 'Bien', 'message', 'L’essentiel est acquis.')
      when v_score >= 10 then jsonb_build_object('label', 'Encourageant', 'message', 'Quelques points restent à consolider.')
      else jsonb_build_object('label', 'À consolider', 'message', 'Reprends la correction pas à pas avant une nouvelle tentative.')
    end;
  end if;

  if v_corrections_available then
    select coalesce(jsonb_agg((jsonb_build_object(
      'questionId', q.id,
      'label', q.homework_question_label,
      'promptMarkdown', q.enonce,
      'choices', q.homework_choices,
      'studentAnswer', r.choix_selectionnes,
      'attachmentUrls', coalesce(r.homework_attachment_urls, '[]'::jsonb),
      'expectedAnswer', q.homework_expected_answer,
      'correct', case
        when q.homework_neutralized then true
        when q.homework_auto_points > 0 then coalesce(r.correcte, false)
        else null
      end,
      'pointsAwarded', case
        when q.homework_neutralized then q.homework_points
        else coalesce(r.homework_auto_points, 0) + coalesce(r.homework_manual_points, 0)
      end,
      'pointsMax', q.homework_points,
      'explanationMarkdown', q.homework_explanation_markdown,
      'reviewComment', r.homework_review_comment,
      'rubricCriteria', case when jsonb_array_length(q.homework_rubric) > 0 then (
        select jsonb_agg(criterion || jsonb_build_object(
          'pointsAwarded', coalesce((
            select (award ->> 'pointsAwarded')::numeric
            from jsonb_array_elements(coalesce(r.homework_rubric_awards, '[]'::jsonb)) award
            where award ->> 'id' = criterion ->> 'id'
          ), 0),
          'status', 'reviewed'
        ))
        from jsonb_array_elements(q.homework_rubric) criterion
      ) else null end
    ) - case when q.homework_neutralized then 'expectedAnswer' else '' end) order by q.ordre), '[]'::jsonb)
    into v_corrections
    from public.questions q
    left join public.reponses r on r.question_id = q.id and r.tentative_id = v_attempt.id
    where q.quiz_id = v_quiz.id;
  end if;

  return jsonb_strip_nulls(jsonb_build_object(
    'attemptId', v_attempt.id,
    'homeworkId', v_attempt.quiz_id,
    'status', case when v_attempt.homework_review_status = 'pending' then 'awaiting-review' else 'graded' end,
    'submittedAt', v_attempt.updated_at,
    'timeSpentSeconds', coalesce(v_attempt.temps_pris_sec, 0),
    'gradingMode', v_quiz.homework_grading_mode,
    'reviewStatus', coalesce(v_attempt.homework_review_status, 'not-required'),
    'answeredCount', v_answered,
    'questionCount', v_question_count,
    'autoGradedPoints', case when v_corrections_available then v_attempt.homework_auto_points else null end,
    'pendingManualPoints', v_attempt.homework_pending_manual_points,
    'totalPoints', v_attempt.homework_total_points,
    'provisionalScoreOutOf20', case
      when v_corrections_available and v_attempt.homework_review_status = 'pending' and v_attempt.homework_total_points > 0
        then round(20 * v_attempt.homework_auto_points / v_attempt.homework_total_points, 2)
      else null end,
    'scoreOutOf20', v_score,
    'appreciation', v_appreciation,
    'reviewComment', case when v_corrections_available then v_attempt.homework_review_comment else null end,
    'correctionsAvailable', v_corrections_available,
    'corrections', v_corrections
  ));
end;
$$;

create or replace function public.start_homework_attempt_v1(p_homework_ref text)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_profile public.profiles%rowtype;
  v_quiz public.quiz%rowtype;
  v_devoir public.devoirs_editoriaux%rowtype;
  v_attempt public.tentatives%rowtype;
  v_attempts int;
  v_number int;
  v_factor numeric;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'profile_not_found'; end if;
  if not public.is_admin() and (v_profile.role <> 'student' or v_profile.account_type <> 'student') then
    raise exception 'homework_composition_forbidden';
  end if;
  -- Une tentative démarrée appartient à sa version immuable. Elle reste donc
  -- prioritaire quand une nouvelle version est importée entre-temps.
  select t.* into v_attempt
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id
  join public.devoirs_editoriaux d on d.id = q.devoir_id
  where t.user_id = auth.uid() and t.statut = 'en_cours'
    and (q.id::text = p_homework_ref or d.homework_stable_id = p_homework_ref or d.public_slug = p_homework_ref)
  order by t.created_at desc limit 1;

  if v_attempt.id is not null then
    select * into v_quiz from public.quiz where id = v_attempt.quiz_id;
  else
    select q.* into v_quiz
    from public.quiz q join public.devoirs_editoriaux d on d.id = q.devoir_id
    where q.type = 'devoir' and q.statut_editorial = 'publie' and q.published
      and (q.id::text = p_homework_ref or d.homework_stable_id = p_homework_ref or d.public_slug = p_homework_ref)
    order by q.version_devoir desc limit 1;
  end if;
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;
  select * into v_devoir from public.devoirs_editoriaux where id = v_quiz.devoir_id;

  perform pg_advisory_xact_lock(hashtextextended(
    auth.uid()::text || ':' || v_devoir.homework_stable_id,
    0
  ));
  v_attempt := null;
  select t.* into v_attempt
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id
  join public.devoirs_editoriaux d on d.id = q.devoir_id
  where t.user_id = auth.uid() and t.statut = 'en_cours'
    and d.homework_stable_id = v_devoir.homework_stable_id
  order by t.created_at desc limit 1 for update of t;
  if v_attempt.id is not null and v_attempt.date_fin_theorique is not null
     and v_attempt.date_fin_theorique <= now() then
    perform public.finalize_homework_attempt_internal_v1(v_attempt.id);
    -- Même contrat qu'en local : le premier appel après l'échéance rend la
    -- copie auto-remise au lieu de créer implicitement la tentative n°2.
    return public.homework_attempt_json_v1(v_attempt.id);
  end if;
  if v_attempt.id is not null then
    if not public.is_admin() and v_devoir.level_code <> v_profile.level_id then
      raise exception 'homework_access_denied';
    end if;
    return public.homework_attempt_json_v1(v_attempt.id);
  end if;
  if not public.is_admin() and (not v_quiz.homework_subject_open or v_devoir.level_code <> v_profile.level_id) then
    raise exception 'homework_access_denied';
  end if;
  if v_attempt.id is null and v_quiz.homework_corrections_published then
    raise exception 'homework_corrections_already_published';
  end if;

  perform set_config('app.homework_secure_internal', 'on', true);
  select count(*) into v_attempts
  from public.tentatives t
  join public.quiz attempt_quiz on attempt_quiz.id = t.quiz_id
  join public.devoirs_editoriaux attempt_devoir on attempt_devoir.id = attempt_quiz.devoir_id
  where t.user_id = auth.uid()
    and attempt_devoir.homework_stable_id = v_devoir.homework_stable_id;
  if v_attempts >= v_quiz.homework_max_attempts then raise exception 'homework_attempt_limit'; end if;
  v_number := v_attempts + 1;
  v_factor := case v_number when 1 then 1.0 when 2 then 0.66 else 0.33 end;
  insert into public.tentatives (
    user_id, quiz_id, numero_tentative, statut, date_fin_theorique,
    homework_review_status, homework_auto_points,
    homework_pending_manual_points, homework_total_points
  ) values (
    auth.uid(), v_quiz.id, v_number, 'en_cours',
    now() + (greatest(60, round(v_quiz.duree_sec * v_factor))::text || ' seconds')::interval,
    'not-required', 0, 0, 0
  ) returning * into v_attempt;
  return public.homework_attempt_json_v1(v_attempt.id);
end;
$$;

-- Comparateur privé propre aux devoirs. Il rapproche les saisies téléphone et
-- LaTeX usuelles sans prétendre valider une démonstration : seule la réponse
-- finale automatique passe ici, le raisonnement reste évalué par le barème.
create or replace function public.homework_normalize_answer_v1(p_value text)
returns text
language plpgsql
immutable
set search_path = pg_catalog, public
as $$
declare
  v text := lower(coalesce(p_value, ''));
  v_comma_count int;
begin
  v := replace(replace(replace(v, '−', '-'), '–', '-'), '—', '-');
  v := replace(v, '∞', 'infinity');
  v := replace(replace(v, '≤', '<='), '⩽', '<=');
  v := replace(replace(v, '≥', '>='), '⩾', '>=');
  v := replace(v, '≠', '!=');
  v := replace(replace(v, '≈', '~'), '≃', '~');
  v := replace(v, 'ℝ', 'r');
  v := replace(v, 'α', 'alpha');
  v := public.norm_txt(v);
  v := replace(replace(v, E'\\dfrac', E'\\frac'), E'\\tfrac', E'\\frac');
  for fraction_depth in 1..5 loop
    exit when v !~ E'\\\\frac\\s*\\{[^{}]+\\}\\s*\\{[^{}]+\\}';
    v := regexp_replace(
      v,
      E'\\\\frac\\s*\\{([^{}]+)\\}\\s*\\{([^{}]+)\\}',
      E'(\\1)/(\\2)',
      'g'
    );
  end loop;
  v := regexp_replace(v, E'\\\\(left|right|displaystyle)', '', 'gi');
  v := regexp_replace(v, E'\\\\mathbb\\s*(\\{\\s*r\\s*\\}|r)', 'r', 'gi');
  v := replace(v, E'\\infty', 'infinity');
  v := replace(v, E'\\alpha', 'alpha');
  v := replace(replace(v, E'\\leq', '<='), E'\\le', '<=');
  v := replace(replace(v, E'\\geq', '>='), E'\\ge', '>=');
  v := replace(replace(v, E'\\neq', '!='), E'\\ne', '!=');
  v := replace(replace(v, E'\\approx', '~'), E'\\simeq', '~');
  v := replace(replace(v, E'\\setminus', chr(92)), E'\\backslash', chr(92));
  v := replace(replace(v, E'\\cdot', '*'), E'\\times', '*');
  v := replace(replace(replace(replace(v, E'\\,', ''), E'\\;', ''), E'\\!', ''), E'\\:', '');
  v := replace(replace(v, chr(92) || '{', '{'), chr(92) || '}', '}');
  v := regexp_replace(v, '[[:space:]$]+', '', 'g');
  v := regexp_replace(v, E'\\(([+-]?[0-9]+([.][0-9]+)?)\\)', E'\\1', 'g');

  -- Les intervalles ivoiriens/francophones utilisent « ; » et la virgule
  -- décimale. La variante internationale [1.1,1.2] est aussi acceptée.
  if left(v, 1) in ('[', '(') and right(v, 1) in (']', ')')
     and position(';' in v) = 0 then
    v_comma_count := length(v) - length(replace(v, ',', ''));
    if v_comma_count = 1 then v := replace(v, ',', ';'); end if;
  end if;
  if left(v, 1) = ']' then v := '(' || substr(v, 2); end if;
  if right(v, 1) = '[' then v := left(v, length(v) - 1) || ')'; end if;
  if position(';' in v) > 0 or (
    position('[' in v) = 0 and position(']' in v) = 0
    and position('(' in v) = 0 and position(')' in v) = 0
    and position('{' in v) = 0 and position('}' in v) = 0
  ) then
    v := regexp_replace(v, '([0-9]),([0-9])', E'\\1.\\2', 'g');
  end if;
  v := regexp_replace(v, '^(d_?[a-z]+|domaine(de)?[a-z]*)=', '');

  -- Les deux graphies R\{0,2} et R\setminus\{0;2\} convergent.
  if left(v, 2) = 'r{' then v := 'r' || chr(92) || substr(v, 2); end if;
  if left(v, 3) = ('r' || chr(92) || '{') and right(v, 1) = '}' then
    v := replace(v, ';', ',');
  end if;
  return v;
end;
$$;

create or replace function public.homework_alpha_coefficient_v1(p_value text)
returns numeric
language plpgsql
immutable
set search_path = pg_catalog, public
as $$
declare
  v text := replace(regexp_replace(p_value, '^f\\(alpha\\)=', ''), '*', '');
  v_parts text[];
begin
  if v in ('alpha', '+alpha') then return 1; end if;
  if v = '-alpha' then return -1; end if;
  if v ~ '^[+-]?[0-9]+([.][0-9]+)?alpha$' then
    return replace(v, 'alpha', '')::numeric;
  end if;
  if v ~ '^[+-]?[0-9]+([.][0-9]+)?alpha/[+-]?[0-9]+([.][0-9]+)?$' then
    v_parts := string_to_array(replace(v, 'alpha', ''), '/');
    if v_parts[2]::numeric <> 0 then return v_parts[1]::numeric / v_parts[2]::numeric; end if;
  end if;
  if v ~ '^[+-]?[0-9]+([.][0-9]+)?/[+-]?[0-9]+([.][0-9]+)?alpha$' then
    v_parts := string_to_array(replace(v, 'alpha', ''), '/');
    if v_parts[2]::numeric <> 0 then return v_parts[1]::numeric / v_parts[2]::numeric; end if;
  end if;
  return null;
exception when invalid_text_representation or division_by_zero then
  return null;
end;
$$;

create or replace function public.homework_answer_text_matches_v1(p_expected text, p_actual text)
returns boolean
language plpgsql
immutable
set search_path = pg_catalog, public
as $$
declare
  v_expected text := public.homework_normalize_answer_v1(p_expected);
  v_actual text := public.homework_normalize_answer_v1(p_actual);
  v_expected_number_text text;
  v_actual_number_text text;
  v_expected_number numeric;
  v_actual_number numeric;
  v_expected_alpha numeric;
  v_actual_alpha numeric;
  v_tolerance numeric;
begin
  if v_expected = '' or v_actual = '' then return false; end if;
  if v_expected = v_actual then return true; end if;

  v_expected_number_text := regexp_replace(v_expected, '^(alpha|[a-z])[=~]', '');
  v_actual_number_text := regexp_replace(v_actual, '^(alpha|[a-z])[=~]', '');
  if v_expected_number_text ~ '^[+-]?[0-9]+([.][0-9]+)?$'
     and v_actual_number_text ~ '^[+-]?[0-9]+([.][0-9]+)?$' then
    v_expected_number := v_expected_number_text::numeric;
    v_actual_number := v_actual_number_text::numeric;
    v_tolerance := case when position('~' in v_expected) > 0
      then greatest(0.0001, abs(v_expected_number) * 0.000001)
      else 0.0000000001 end;
    return abs(v_expected_number - v_actual_number) <= v_tolerance;
  end if;

  v_expected_alpha := public.homework_alpha_coefficient_v1(v_expected);
  v_actual_alpha := public.homework_alpha_coefficient_v1(v_actual);
  return v_expected_alpha is not null and v_actual_alpha is not null
    and abs(v_expected_alpha - v_actual_alpha) <= 0.0000000001;
end;
$$;

create or replace function public.homework_answer_matches_v1(p_expected jsonb, p_actual text)
returns boolean
language sql
immutable
set search_path = pg_catalog, public
as $$
  select case jsonb_typeof(p_expected)
    when 'array' then exists (
      select 1 from jsonb_array_elements_text(p_expected) accepted
      where public.homework_answer_text_matches_v1(accepted, p_actual)
    )
    when 'string' then public.homework_answer_text_matches_v1(p_expected #>> '{}', p_actual)
    else false
  end;
$$;

create or replace function public.save_homework_answer_v1(
  p_attempt_id uuid,
  p_question_id uuid,
  p_answer jsonb,
  p_attachment_urls jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_question public.questions%rowtype;
  v_profile public.profiles%rowtype;
  v_final text;
  v_correct boolean := false;
  v_auto numeric := 0;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'profile_not_found'; end if;
  if not public.is_admin() and (v_profile.role <> 'student' or v_profile.account_type <> 'student') then
    raise exception 'homework_composition_forbidden';
  end if;
  select * into v_attempt from public.tentatives where id = p_attempt_id for update;
  if v_attempt.id is null or v_attempt.user_id <> auth.uid() then raise exception 'attempt_not_found'; end if;
  if v_attempt.statut <> 'en_cours' then
    return jsonb_build_object('saved', false, 'expired', false, 'questionId', p_question_id,
      'serverNow', now(), 'attemptStatus', case when v_attempt.homework_review_status = 'pending' then 'awaiting-review' else 'graded' end);
  end if;
  if v_attempt.date_fin_theorique is not null and v_attempt.date_fin_theorique <= now() then
    perform public.finalize_homework_attempt_internal_v1(v_attempt.id);
    return jsonb_build_object('saved', false, 'expired', true, 'questionId', p_question_id,
      'serverNow', now(), 'attemptStatus', public.homework_attempt_json_v1(v_attempt.id) ->> 'status');
  end if;
  select * into v_question from public.questions
  where id = p_question_id and quiz_id = v_attempt.quiz_id;
  if v_question.id is null then raise exception 'question_not_found'; end if;
  if jsonb_typeof(coalesce(p_attachment_urls, '[]'::jsonb)) <> 'array'
     or jsonb_array_length(coalesce(p_attachment_urls, '[]'::jsonb)) > 5
     or exists (
       select 1 from jsonb_array_elements(coalesce(p_attachment_urls, '[]'::jsonb)) url
       where jsonb_typeof(url) <> 'string'
          or length(url #>> '{}') > 2048
          or (url #>> '{}') !~ '^https://[^[:space:]]+$'
     ) then raise exception 'homework_attachment_invalid'; end if;
  if jsonb_array_length(coalesce(p_attachment_urls, '[]'::jsonb)) = 0
     and (
       p_answer is null
       or p_answer = 'null'::jsonb
       or (
         jsonb_typeof(p_answer) = 'string'
         and nullif(btrim(p_answer #>> '{}'), '') is null
       )
       or (
         jsonb_typeof(p_answer) = 'object'
         and nullif(btrim(coalesce(p_answer ->> 'finalAnswer', '')), '') is null
         and nullif(btrim(coalesce(p_answer ->> 'reasoning', '')), '') is null
       )
     ) then
    raise exception 'homework_answer_required';
  end if;

  if v_question.type = 'qcm' then
    if jsonb_typeof(p_answer) <> 'string'
       or not exists (
         select 1 from jsonb_array_elements(v_question.homework_choices) choice
         where choice ->> 'id' = p_answer #>> '{}'
       ) then raise exception 'homework_choice_invalid'; end if;
    if jsonb_array_length(coalesce(p_attachment_urls, '[]'::jsonb)) > 0 then
      raise exception 'homework_attachment_invalid';
    end if;
    v_final := p_answer #>> '{}';
    v_correct := v_question.homework_auto_points > 0
      and v_final = v_question.homework_expected_answer #>> '{}';
  else
    if p_answer is not null and p_answer <> 'null'::jsonb and length(p_answer::text) > 60000 then
      raise exception 'homework_answer_too_large';
    end if;
    if p_answer is not null and p_answer <> 'null'::jsonb
       and jsonb_typeof(p_answer) not in ('string', 'object') then
      raise exception 'homework_answer_invalid';
    end if;
    if jsonb_typeof(p_answer) = 'string' and length(p_answer #>> '{}') > 50000 then
      raise exception 'homework_answer_too_large';
    end if;
    if jsonb_typeof(p_answer) = 'object' then
      if exists (
        select 1 from jsonb_object_keys(p_answer) answer_key
        where answer_key not in ('finalAnswer', 'reasoning')
      )
      or (p_answer ? 'finalAnswer' and jsonb_typeof(p_answer -> 'finalAnswer') <> 'string')
      or (p_answer ? 'reasoning' and jsonb_typeof(p_answer -> 'reasoning') <> 'string')
      or length(coalesce(p_answer ->> 'finalAnswer', '')) > 10000
      or length(coalesce(p_answer ->> 'reasoning', '')) > 50000 then
        raise exception 'homework_answer_invalid';
      end if;
    end if;
    if v_question.homework_grading_mode = 'hybrid' and (
      jsonb_typeof(p_answer) <> 'object' or not (p_answer ? 'finalAnswer')
    ) then
      raise exception 'homework_hybrid_answer_invalid';
    end if;
    v_final := case when jsonb_typeof(p_answer) = 'object' then p_answer ->> 'finalAnswer' else p_answer #>> '{}' end;
    if v_question.homework_auto_points > 0 then
      if nullif(btrim(coalesce(v_final, '')), '') is null then raise exception 'homework_final_answer_required'; end if;
      v_correct := public.homework_answer_matches_v1(v_question.homework_expected_answer, v_final);
    end if;
  end if;
  v_auto := case when v_correct then v_question.homework_auto_points else 0 end;

  perform set_config('app.homework_secure_internal', 'on', true);
  insert into public.reponses (
    tentative_id, question_id, choix_selectionnes, correcte,
    homework_attachment_urls, homework_auto_points,
    homework_manual_points, homework_review_comment, homework_rubric_awards
  ) values (
    v_attempt.id, v_question.id, p_answer, v_correct,
    coalesce(p_attachment_urls, '[]'::jsonb), v_auto, null, null, null
  )
  on conflict (tentative_id, question_id) do update set
    choix_selectionnes = excluded.choix_selectionnes,
    correcte = excluded.correcte,
    homework_attachment_urls = excluded.homework_attachment_urls,
    homework_auto_points = excluded.homework_auto_points,
    homework_manual_points = null,
    homework_review_comment = null,
    homework_rubric_awards = null;

  return jsonb_build_object(
    'saved', true, 'expired', false, 'questionId', v_question.id,
    'answer', p_answer, 'attachmentUrls', coalesce(p_attachment_urls, '[]'::jsonb),
    'serverNow', now(), 'attemptStatus', 'in-progress'
  );
end;
$$;

create or replace function public.delete_homework_answer_v1(
  p_attempt_id uuid,
  p_question_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_question_id uuid;
  v_profile public.profiles%rowtype;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'profile_not_found'; end if;
  if not public.is_admin() and (v_profile.role <> 'student' or v_profile.account_type <> 'student') then
    raise exception 'homework_composition_forbidden';
  end if;
  select * into v_attempt from public.tentatives where id = p_attempt_id for update;
  if v_attempt.id is null or v_attempt.user_id <> auth.uid() then raise exception 'attempt_not_found'; end if;
  if v_attempt.statut <> 'en_cours' then
    return jsonb_build_object('deleted', false, 'expired', false, 'questionId', p_question_id,
      'serverNow', now(), 'attemptStatus', case when v_attempt.homework_review_status = 'pending' then 'awaiting-review' else 'graded' end);
  end if;
  if v_attempt.date_fin_theorique is not null and v_attempt.date_fin_theorique <= now() then
    perform public.finalize_homework_attempt_internal_v1(v_attempt.id);
    return jsonb_build_object('deleted', false, 'expired', true, 'questionId', p_question_id,
      'serverNow', now(), 'attemptStatus', public.homework_attempt_json_v1(v_attempt.id) ->> 'status');
  end if;
  select q.id into v_question_id
  from public.questions q
  where q.id = p_question_id and q.quiz_id = v_attempt.quiz_id;
  if v_question_id is null then raise exception 'question_not_found'; end if;

  perform set_config('app.homework_secure_internal', 'on', true);
  delete from public.reponses
  where tentative_id = v_attempt.id and question_id = v_question_id;

  return jsonb_build_object(
    'deleted', true, 'expired', false, 'questionId', v_question_id,
    'serverNow', now(), 'attemptStatus', 'in-progress'
  );
end;
$$;

create or replace function public.finalize_homework_attempt_v1(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_profile public.profiles%rowtype;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_profile from public.profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'profile_not_found'; end if;
  if not public.is_admin() and (v_profile.role <> 'student' or v_profile.account_type <> 'student') then
    raise exception 'homework_composition_forbidden';
  end if;
  select * into v_attempt from public.tentatives where id = p_attempt_id;
  if v_attempt.id is null or (v_attempt.user_id <> auth.uid() and not public.is_admin()) then
    raise exception 'attempt_not_found';
  end if;
  perform public.finalize_homework_attempt_internal_v1(p_attempt_id);
  return public.homework_result_json_v1(p_attempt_id, public.is_admin());
end;
$$;

create or replace function public.get_homework_result_v1(p_attempt_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select * into v_attempt from public.tentatives where id = p_attempt_id;
  if v_attempt.id is null or (v_attempt.user_id <> auth.uid() and not public.is_admin()) then
    raise exception 'attempt_not_found';
  end if;
  if v_attempt.statut = 'en_cours' and v_attempt.date_fin_theorique is not null
     and v_attempt.date_fin_theorique <= now() then
    perform public.finalize_homework_attempt_internal_v1(p_attempt_id);
  elsif v_attempt.statut = 'en_cours' then
    raise exception 'attempt_in_progress';
  end if;
  return public.homework_result_json_v1(p_attempt_id, public.is_admin());
end;
$$;

create or replace function public.list_homework_reviews_v1(p_status text default 'pending')
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
  if p_status not in ('pending', 'completed') then raise exception 'homework_review_status_invalid'; end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'attemptId', t.id,
    'homeworkId', t.quiz_id,
    'homeworkTitle', q.titre,
    'institution', d.institution,
    'academicYear', d.academic_year,
    'student', jsonb_build_object(
      'id', p.id, 'name', p.name, 'email', p.email, 'levelId', p.level_id
    ),
    'submittedAt', t.updated_at,
    'reviewStatus', t.homework_review_status,
    'autoGradedPoints', t.homework_auto_points,
    'pendingManualPoints', t.homework_pending_manual_points,
    'totalPoints', t.homework_total_points
  ) order by t.updated_at), '[]'::jsonb)
  into v_result
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id and q.type = 'devoir'
  join public.devoirs_editoriaux d on d.id = q.devoir_id
  join public.profiles p on p.id = t.user_id
  where t.homework_review_status = p_status;
  return v_result;
end;
$$;

create or replace function public.get_homework_review_v1(p_attempt_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_quiz public.quiz%rowtype;
  v_profile public.profiles%rowtype;
  v_questions jsonb;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  select * into v_attempt from public.tentatives where id = p_attempt_id;
  if v_attempt.id is null or v_attempt.statut <> 'terminee' then raise exception 'attempt_not_found'; end if;
  select * into v_quiz from public.quiz where id = v_attempt.quiz_id and type = 'devoir';
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;
  select * into v_profile from public.profiles where id = v_attempt.user_id;

  select coalesce(jsonb_agg((jsonb_build_object(
    'id', q.id,
    'order', q.ordre,
    'label', q.homework_question_label,
    'promptMarkdown', q.enonce,
    'type', q.type,
    'answerKind', q.homework_answer_kind,
    'gradingMode', q.homework_grading_mode,
    'isNeutralized', q.homework_neutralized,
    'choices', q.homework_choices,
    'points', q.homework_points,
    'autoPoints', q.homework_auto_points,
    'manualPoints', q.homework_manual_points,
    'imageUrl', q.image_url,
    'imageAlt', q.image_alt,
    'sourceNotice', q.homework_source_notice,
    'studentAnswer', r.choix_selectionnes,
    'attachmentUrls', coalesce(r.homework_attachment_urls, '[]'::jsonb),
    'expectedAnswer', q.homework_expected_answer,
    'explanationMarkdown', q.homework_explanation_markdown,
    'rubricCriteria', q.homework_rubric,
    'autoPointsAwarded', coalesce(r.homework_auto_points, 0),
    'manualPointsAwarded', r.homework_manual_points,
    'pointsAwarded', case when q.homework_manual_points > 0 then r.homework_manual_points else coalesce(r.homework_auto_points, 0) end,
    'reviewComment', r.homework_review_comment
  ) - case when q.homework_neutralized then 'expectedAnswer' else '' end) order by q.ordre), '[]'::jsonb)
  into v_questions
  from public.questions q
  left join public.reponses r on r.question_id = q.id and r.tentative_id = v_attempt.id
  where q.quiz_id = v_quiz.id;

  return jsonb_build_object(
    'attempt', public.homework_attempt_json_v1(v_attempt.id),
    'homework', public.homework_summary_json_v1(v_quiz.id, auth.uid()),
    'student', jsonb_build_object('id', v_profile.id, 'name', v_profile.name, 'email', v_profile.email, 'levelId', v_profile.level_id),
    'questions', v_questions
  );
end;
$$;

create or replace function public.review_homework_attempt_v1(
  p_attempt_id uuid,
  p_reviews jsonb,
  p_comment text default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_attempt public.tentatives%rowtype;
  v_question public.questions%rowtype;
  v_review jsonb;
  v_criteria jsonb;
  v_criterion jsonb;
  v_award jsonb;
  v_points numeric;
  v_sum numeric;
  v_manual_total numeric;
  v_score numeric;
  v_expected_count int;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  if jsonb_typeof(p_reviews) <> 'array' then raise exception 'homework_review_invalid'; end if;
  select * into v_attempt from public.tentatives where id = p_attempt_id for update;
  if v_attempt.id is null or v_attempt.homework_review_status <> 'pending' then
    raise exception 'review_not_pending';
  end if;

  perform set_config('app.homework_secure_internal', 'on', true);

  select count(*) into v_expected_count
  from public.questions q join public.reponses r
    on r.question_id = q.id and r.tentative_id = v_attempt.id
  where q.quiz_id = v_attempt.quiz_id
    and not q.homework_neutralized and q.homework_manual_points > 0;
  if jsonb_array_length(p_reviews) <> v_expected_count
     or (select count(*) <> count(distinct item ->> 'questionId') from jsonb_array_elements(p_reviews) item) then
    raise exception 'incomplete_homework_review';
  end if;

  for v_question in
    select q.* from public.questions q join public.reponses r
      on r.question_id = q.id and r.tentative_id = v_attempt.id
    where q.quiz_id = v_attempt.quiz_id
      and not q.homework_neutralized and q.homework_manual_points > 0
    order by q.ordre
  loop
    select item into v_review from jsonb_array_elements(p_reviews) item
    where item ->> 'questionId' = v_question.id::text;
    if v_review is null then raise exception 'incomplete_homework_review'; end if;
    begin
      v_points := (v_review ->> 'pointsAwarded')::numeric;
    exception when others then
      raise exception 'homework_review_score_invalid';
    end;
    if v_points < 0 or v_points > v_question.homework_manual_points then
      raise exception 'homework_review_score_invalid';
    end if;
    v_criteria := coalesce(v_review -> 'criteria', '[]'::jsonb);
    if jsonb_array_length(v_question.homework_rubric) > 0 then
      if jsonb_typeof(v_criteria) <> 'array'
         or jsonb_array_length(v_criteria) <> jsonb_array_length(v_question.homework_rubric)
         or (select count(*) <> count(distinct item ->> 'id') from jsonb_array_elements(v_criteria) item) then
        raise exception 'homework_rubric_review_incomplete';
      end if;
      v_sum := 0;
      for v_criterion in select value from jsonb_array_elements(v_question.homework_rubric)
      loop
        select item into v_award from jsonb_array_elements(v_criteria) item
        where item ->> 'id' = v_criterion ->> 'id';
        if v_award is null
           or (v_award ->> 'pointsAwarded')::numeric < 0
           or (v_award ->> 'pointsAwarded')::numeric > (v_criterion ->> 'pointsMax')::numeric then
          raise exception 'homework_rubric_score_invalid';
        end if;
        v_sum := v_sum + (v_award ->> 'pointsAwarded')::numeric;
      end loop;
      if abs(v_sum - v_points) >= 0.001 then raise exception 'homework_rubric_total_mismatch'; end if;
    end if;
    update public.reponses set
      homework_manual_points = v_points,
      homework_review_comment = nullif(btrim(coalesce(v_review ->> 'comment', '')), ''),
      homework_rubric_awards = v_criteria
    where tentative_id = v_attempt.id and question_id = v_question.id;
  end loop;

  select coalesce(sum(r.homework_manual_points), 0) into v_manual_total
  from public.reponses r where r.tentative_id = v_attempt.id;
  v_score := case when v_attempt.homework_total_points > 0
    then round(20 * (v_attempt.homework_auto_points + v_manual_total) / v_attempt.homework_total_points, 2)
    else 0 end;
  update public.tentatives set
    note = v_score,
    homework_pending_manual_points = 0,
    homework_review_status = 'completed',
    homework_review_comment = nullif(btrim(coalesce(p_comment, '')), ''),
    homework_reviewed_by = auth.uid(),
    homework_reviewed_at = now(),
    updated_at = now()
  where id = v_attempt.id and homework_review_status = 'pending';

  insert into public.audit_logs(actor_user_id, action, subject_id, metadata_json)
  values (auth.uid(), 'homework.attempt.review', v_attempt.id::text,
    jsonb_build_object('scoreOutOf20', v_score, 'reviewedQuestions', v_expected_count));
  return public.homework_result_json_v1(v_attempt.id, true);
end;
$$;

create or replace function public.set_homework_publication_v1(
  p_homework_ref text,
  p_subject_open boolean default null,
  p_corrections_published boolean default null
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_quiz public.quiz%rowtype;
  v_expired_attempt_id uuid;
  v_active int;
  v_pending int;
  v_incomplete int;
begin
  if not public.is_admin() then raise exception 'admin_required'; end if;
  if p_subject_open is null and p_corrections_published is null then
    raise exception 'homework_publication_state_required';
  end if;
  select q.* into v_quiz
  from public.quiz q join public.devoirs_editoriaux d on d.id = q.devoir_id
  where q.type = 'devoir' and (
    q.id::text = p_homework_ref
    or (q.statut_editorial = 'publie' and q.published
      and (d.homework_stable_id = p_homework_ref or d.public_slug = p_homework_ref))
  )
  order by case when q.id::text = p_homework_ref then 0 else 1 end,
    q.version_devoir desc
  limit 1 for update of q;
  if v_quiz.id is null then raise exception 'homework_not_found'; end if;
  if v_quiz.statut_editorial <> 'publie' and p_subject_open is not null then
    raise exception 'homework_archived_subject_immutable';
  end if;
  if coalesce(p_subject_open, v_quiz.homework_subject_open)
     and coalesce(p_corrections_published, v_quiz.homework_corrections_published) then
    raise exception 'homework_correction_requires_closed_subject';
  end if;
  if p_corrections_published then
    for v_expired_attempt_id in
      select id from public.tentatives
      where quiz_id = v_quiz.id and statut = 'en_cours'
        and date_fin_theorique is not null and date_fin_theorique <= now()
      for update
    loop
      perform public.finalize_homework_attempt_internal_v1(v_expired_attempt_id);
    end loop;
    select count(*) into v_active from public.tentatives
    where quiz_id = v_quiz.id and statut = 'en_cours';
    select count(*) into v_pending from public.tentatives
    where quiz_id = v_quiz.id and homework_review_status = 'pending';
    select count(*) into v_incomplete from public.questions
    where quiz_id = v_quiz.id and nullif(btrim(coalesce(homework_explanation_markdown, '')), '') is null;
    if v_active > 0 then raise exception 'homework_attempts_active'; end if;
    if v_pending > 0 then raise exception 'homework_reviews_pending'; end if;
    if v_incomplete > 0 then raise exception 'homework_correction_incomplete'; end if;
  end if;
  perform set_config('app.devoirs_admin_internal', 'on', true);
  update public.quiz set
    homework_subject_open = coalesce(p_subject_open, homework_subject_open),
    homework_corrections_published = coalesce(p_corrections_published, homework_corrections_published),
    updated_at = now()
  where id = v_quiz.id;
  insert into public.audit_logs(actor_user_id, action, subject_id, metadata_json)
  values (auth.uid(), 'homework.publication.update', v_quiz.devoir_id::text,
    jsonb_build_object('subjectPublished', p_subject_open, 'correctionsPublished', p_corrections_published));
  return public.homework_summary_json_v1(v_quiz.id, auth.uid());
end;
$$;

-- Les deux RPC historiques ci-dessous ont des branches de reprise qui lisent
-- directement `correcte`, `bonnes_reponses`, `explication` ou `note` avant
-- toute écriture. Le trigger seul ne suffit donc pas : après une sauvegarde
-- sécurisée, `answer_question` pouvait renvoyer la clé depuis sa branche
-- « déjà répondu », et `finalize_tentative` pouvait renvoyer la note d'une
-- copie déjà remise. On conserve leur implémentation pour les anciens quiz,
-- sous un nom interne non exécutable via PostgREST, puis on garde les noms
-- publics comme façades qui refusent tout paquet Devoirs sécurisé.
do $migration$
begin
  if to_regprocedure('public.answer_question_legacy_v1(uuid,uuid,jsonb)') is null then
    if to_regprocedure('public.answer_question(uuid,uuid,jsonb)') is null then
      raise exception 'missing_legacy_answer_question';
    end if;
    alter function public.answer_question(uuid, uuid, jsonb)
      rename to answer_question_legacy_v1;
  end if;

  if to_regprocedure('public.finalize_tentative_legacy_v1(uuid)') is null then
    if to_regprocedure('public.finalize_tentative(uuid)') is null then
      raise exception 'missing_legacy_finalize_tentative';
    end if;
    alter function public.finalize_tentative(uuid)
      rename to finalize_tentative_legacy_v1;
  end if;
end;
$migration$;

create or replace function public.answer_question(
  p_tentative_id uuid,
  p_question_id uuid,
  p_choix jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_homework_import_id uuid;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select q.homework_import_id into v_homework_import_id
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id
  where t.id = p_tentative_id and t.user_id = auth.uid();
  if v_homework_import_id is not null then
    raise exception 'secure_homework_rpc_required';
  end if;
  return public.answer_question_legacy_v1(p_tentative_id, p_question_id, p_choix);
end;
$$;

create or replace function public.finalize_tentative(p_tentative_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  v_homework_import_id uuid;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select q.homework_import_id into v_homework_import_id
  from public.tentatives t
  join public.quiz q on q.id = t.quiz_id
  where t.id = p_tentative_id and t.user_id = auth.uid();
  if v_homework_import_id is not null then
    raise exception 'secure_homework_rpc_required';
  end if;
  return public.finalize_tentative_legacy_v1(p_tentative_id);
end;
$$;

-- Le lecteur historique exposait immédiatement `bonnes_reponses` et
-- `explication`. On le conserve pour l'ancien moteur, mais les devoirs
-- sécurisés doivent obligatoirement passer par get_homework_result_v1.
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
  if v_quiz.homework_import_id is not null then
    raise exception 'secure_homework_rpc_required';
  end if;
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

revoke all on function public.proteger_tentative_devoir_securise_v1() from public, anon, authenticated;
revoke all on function public.homework_summary_json_v1(uuid, uuid) from public, anon, authenticated;
revoke all on function public.homework_attempt_json_v1(uuid) from public, anon, authenticated;
revoke all on function public.finalize_homework_attempt_internal_v1(uuid) from public, anon, authenticated;
revoke all on function public.homework_result_json_v1(uuid, boolean) from public, anon, authenticated;
revoke all on function public.homework_normalize_answer_v1(text) from public, anon, authenticated;
revoke all on function public.homework_alpha_coefficient_v1(text) from public, anon, authenticated;
revoke all on function public.homework_answer_text_matches_v1(text, text) from public, anon, authenticated;
revoke all on function public.homework_answer_matches_v1(jsonb, text) from public, anon, authenticated;
revoke all on function public.answer_question_legacy_v1(uuid, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.finalize_tentative_legacy_v1(uuid) from public, anon, authenticated;

revoke all on function public.import_homework_package_v1(jsonb) from public, anon;
revoke all on function public.list_homeworks_v1(text, text, text, text) from public, anon;
revoke all on function public.get_homework_public_v1(text) from public, anon;
revoke all on function public.start_homework_attempt_v1(text) from public, anon;
revoke all on function public.save_homework_answer_v1(uuid, uuid, jsonb, jsonb) from public, anon;
revoke all on function public.delete_homework_answer_v1(uuid, uuid) from public, anon;
revoke all on function public.finalize_homework_attempt_v1(uuid) from public, anon;
revoke all on function public.get_homework_result_v1(uuid) from public, anon;
revoke all on function public.list_homework_reviews_v1(text) from public, anon;
revoke all on function public.get_homework_review_v1(uuid) from public, anon;
revoke all on function public.review_homework_attempt_v1(uuid, jsonb, text) from public, anon;
revoke all on function public.set_homework_publication_v1(text, boolean, boolean) from public, anon;
revoke all on function public.answer_question(uuid, uuid, jsonb) from public, anon;
revoke all on function public.finalize_tentative(uuid) from public, anon;

grant execute on function public.import_homework_package_v1(jsonb) to authenticated;
grant execute on function public.list_homeworks_v1(text, text, text, text) to authenticated;
grant execute on function public.get_homework_public_v1(text) to authenticated;
grant execute on function public.start_homework_attempt_v1(text) to authenticated;
grant execute on function public.save_homework_answer_v1(uuid, uuid, jsonb, jsonb) to authenticated;
grant execute on function public.delete_homework_answer_v1(uuid, uuid) to authenticated;
grant execute on function public.finalize_homework_attempt_v1(uuid) to authenticated;
grant execute on function public.get_homework_result_v1(uuid) to authenticated;
grant execute on function public.list_homework_reviews_v1(text) to authenticated;
grant execute on function public.get_homework_review_v1(uuid) to authenticated;
grant execute on function public.review_homework_attempt_v1(uuid, jsonb, text) to authenticated;
grant execute on function public.set_homework_publication_v1(text, boolean, boolean) to authenticated;
grant execute on function public.answer_question(uuid, uuid, jsonb) to authenticated;
grant execute on function public.finalize_tentative(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
