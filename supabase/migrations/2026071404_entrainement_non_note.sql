-- ============================================================================
-- Entrainement non note par lecon : trois paliers, correction apres validation
-- et progression par utilisateur. Idempotent et transactionnel.
-- ============================================================================

begin;

-- --------------------------------------------------------------------------
-- 1. Distinguer les evaluations notees des packs d'entrainement.
-- --------------------------------------------------------------------------

alter table public.quiz
  add column if not exists est_note boolean not null default true;

-- Les lots deja importes avec un palier sont des entrainements, jamais des notes.
update public.quiz
set est_note = false
where palier is not null
  and est_note is distinct from false;

-- Une ancienne version pouvait deja avoir calcule une note sur ces packs.
-- Elle est effacee afin qu'aucun resultat historique non note ne participe aux
-- tableaux de bord, badges ou calculs de progression notes.
update public.tentatives t
set note = null
from public.quiz q
where q.id = t.quiz_id
  and not q.est_note
  and t.note is not null;

alter table public.quiz
  drop constraint if exists quiz_est_note_coherence;

alter table public.quiz
  add constraint quiz_est_note_coherence check (
    (type = 'devoir' and est_note and palier is null)
    or
    (
      type = 'chapitre'
      and (
        (est_note and palier is null)
        or
        (
          not est_note
          and palier in ('entrainement', 'maitrise', 'concours')
        )
      )
    )
  );

-- Un quiz note et un pack d'entrainement peuvent partager le meme numero dans
-- une lecon. Chaque palier d'entrainement reste unique dans cette lecon.
drop index if exists public.uniq_quiz_chapitre_numero;

create unique index if not exists uniq_quiz_chapitre_categorie_numero
  on public.quiz(chapitre_id, est_note, numero)
  where type = 'chapitre';

create unique index if not exists uniq_quiz_chapitre_palier_entrainement
  on public.quiz(chapitre_id, palier)
  where type = 'chapitre' and not est_note;

create index if not exists idx_quiz_entrainement_chapitre
  on public.quiz(chapitre_id, numero)
  where published and not est_note;

-- L'importeur historique n'ecrit pas encore est_note. Le trigger garantit que
-- toute ligne munie d'un palier est classee comme entrainement avant les checks.
create or replace function public.force_quiz_entrainement_non_note()
returns trigger
language plpgsql
set search_path = public
as $$
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

-- Les tentatives d'entrainement ne comptent dans aucune branche de badges.
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

-- --------------------------------------------------------------------------
-- 2. Le moteur de quiz note refuse explicitement les packs d'entrainement.
-- --------------------------------------------------------------------------

-- Remplace l'importeur deja installe : un numero de pack peut coexister avec
-- le meme numero de quiz note, et toute question publiee doit avoir sa correction.
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

create or replace function public.start_tentative(p_quiz_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
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

  select * into v_quiz
  from public.quiz
  where id = p_quiz_id and published = true;

  if v_quiz is null then
    raise exception 'quiz_introuvable';
  end if;

  if not v_quiz.est_note or v_quiz.palier is not null then
    raise exception 'utiliser_entrainement_rpc';
  end if;

  select approuve into v_approuve
  from public.profiles
  where id = auth.uid();

  if not coalesce(v_approuve, false) then
    if v_quiz.type = 'devoir' then
      raise exception 'contenu_reserve_membres';
    end if;

    select ordre into v_chapitre_ordre
    from public.chapitres
    where id = v_quiz.chapitre_id;

    select coalesce((valeur #>> '{}')::int, 1) into v_limite_decouverte
    from public.app_settings
    where cle = 'contenu_decouverte_chapitres';

    if coalesce(v_chapitre_ordre, 999) > coalesce(v_limite_decouverte, 1) then
      raise exception 'contenu_reserve_membres';
    end if;
  end if;

  -- Seuls les quiz notes participent au deblocage a 12/20.
  if v_quiz.type = 'chapitre' and v_quiz.est_note and v_quiz.numero > 1 then
    select id into v_chapitre_precedent_id
    from public.quiz
    where chapitre_id = v_quiz.chapitre_id
      and type = 'chapitre'
      and est_note
      and numero = v_quiz.numero - 1
    limit 1;

    if v_chapitre_precedent_id is not null then
      select max(note) into v_meilleure_note
      from public.tentatives
      where user_id = auth.uid()
        and quiz_id = v_chapitre_precedent_id
        and statut = 'terminee';

      if coalesce(v_meilleure_note, 0) < 12 then
        raise exception 'quiz_verrouille';
      end if;
    end if;
  end if;

  select * into v_tentative
  from public.tentatives
  where user_id = auth.uid()
    and quiz_id = p_quiz_id
    and statut = 'en_cours'
    and (date_fin_theorique is null or date_fin_theorique > now())
  order by created_at desc
  limit 1;

  if v_tentative is null then
    select count(*) into v_nb_tentatives
    from public.tentatives
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

    insert into public.tentatives (
      user_id, quiz_id, numero_tentative, statut, date_fin_theorique
    ) values (
      auth.uid(), p_quiz_id, v_numero_tentative, 'en_cours',
      case when v_duree is not null
        then now() + (v_duree || ' seconds')::interval
        else null
      end
    )
    returning * into v_tentative;
  end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id,
    'ordre', q.ordre,
    'enonce', q.enonce,
    'type', q.type,
    'choix', q.choix,
    'points', q.points,
    'image_url', q.image_url
  ) order by q.ordre)
  into v_questions
  from public.questions q
  where q.quiz_id = p_quiz_id;

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

revoke all on function public.start_tentative(uuid) from public, anon;
grant execute on function public.start_tentative(uuid) to authenticated;

-- answer_question reste reserve aux evaluations notees. Sans ce garde-fou, un
-- client pourrait reutiliser une tentative interne et contourner la validation
-- stricte (reponse non vide, choix appartenant au QCM) ci-dessous.
create or replace function public.answer_question(
  p_tentative_id uuid,
  p_question_id uuid,
  p_choix jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tentative record;
  v_q record;
  v_exist record;
  v_correcte boolean;
  v_user_txt text;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_tentative
  from public.tentatives
  where id = p_tentative_id and user_id = auth.uid()
  for update;

  if v_tentative is null then
    raise exception 'tentative_introuvable';
  end if;

  if v_tentative.statut <> 'en_cours' then
    raise exception 'tentative_close';
  end if;

  if v_tentative.date_fin_theorique is not null
     and now() > v_tentative.date_fin_theorique + interval '10 seconds' then
    raise exception 'temps_ecoule';
  end if;

  if exists (
    select 1
    from public.quiz
    where id = v_tentative.quiz_id and not est_note
  ) then
    raise exception 'utiliser_entrainement_rpc';
  end if;

  select * into v_q
  from public.questions
  where id = p_question_id and quiz_id = v_tentative.quiz_id;

  if v_q is null then
    raise exception 'question_introuvable';
  end if;

  select * into v_exist
  from public.reponses
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
        select 1
        from jsonb_array_elements_text(v_q.bonnes_reponses) e
        where public.norm_txt(e) = public.norm_txt(v_user_txt)
      );
    else
      v_correcte := public.norm_txt(v_q.bonnes_reponses #>> '{}')
        = public.norm_txt(v_user_txt);
    end if;
  else
    v_correcte := coalesce(p_choix, 'null'::jsonb) = v_q.bonnes_reponses;
  end if;

  insert into public.reponses (
    tentative_id, question_id, choix_selectionnes, correcte
  ) values (
    p_tentative_id, p_question_id, p_choix, v_correcte
  )
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

-- Une tentative d'entrainement ne peut jamais produire note, XP ou badge,
-- meme si un ancien client appelle finalize_tentative directement.
create or replace function public.finalize_tentative(p_tentative_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tentative record;
  v_est_note boolean;
  v_total numeric := 0;
  v_obtenus numeric := 0;
  v_note numeric;
  v_ancienne numeric;
  v_delta int;
begin
  if auth.uid() is null then
    raise exception 'auth_required';
  end if;

  select * into v_tentative
  from public.tentatives
  where id = p_tentative_id and user_id = auth.uid()
  for update;

  if v_tentative is null then
    raise exception 'tentative_introuvable';
  end if;

  select est_note into v_est_note
  from public.quiz
  where id = v_tentative.quiz_id;

  if not coalesce(v_est_note, true) then
    if v_tentative.statut = 'en_cours' then
      update public.tentatives
      set statut = 'terminee',
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

  if v_tentative.statut <> 'en_cours' then
    raise exception 'tentative_introuvable';
  end if;

  if v_tentative.date_fin_theorique is not null
     and now() > v_tentative.date_fin_theorique + interval '10 seconds' then
    raise exception 'temps_ecoule';
  end if;

  select coalesce(sum(points), 0) into v_total
  from public.questions
  where quiz_id = v_tentative.quiz_id;

  select coalesce(sum(q.points), 0) into v_obtenus
  from public.reponses r
  join public.questions q on q.id = r.question_id
  where r.tentative_id = p_tentative_id and r.correcte;

  v_note := case
    when v_total > 0 then round((v_obtenus / v_total) * 20, 2)
    else 0
  end;

  select max(note) into v_ancienne
  from public.tentatives
  where user_id = auth.uid()
    and quiz_id = v_tentative.quiz_id
    and statut = 'terminee';

  update public.tentatives
  set statut = 'terminee',
      note = v_note,
      temps_pris_sec = greatest(0, extract(epoch from (now() - created_at))::int)
  where id = p_tentative_id;

  if v_note > coalesce(v_ancienne, -1) then
    v_delta := round((v_note - coalesce(v_ancienne, 0)) * 2)::int;
    perform set_config('app.internal_update', 'on', true);
    update public.profiles
    set points_carriere = points_carriere + v_delta
    where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());

  return jsonb_build_object('note', v_note, 'non_note', false);
end;
$$;

revoke all on function public.finalize_tentative(uuid) from public, anon;
grant execute on function public.finalize_tentative(uuid) to authenticated;

-- Le resultat note ne doit jamais reveler en bloc les corrections restantes
-- d'un pack d'entrainement partiellement valide.
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

-- L'ancien submit_tentative n'est plus utilise par le frontend et pourrait
-- contourner la branche non notee. Il reste reserve au role serveur.
revoke all on function public.submit_tentative(uuid, jsonb)
  from public, anon, authenticated;

-- Durcissement des RPC de quiz deja existantes.
revoke all on function public.answer_question(uuid, uuid, jsonb) from public, anon;
grant execute on function public.answer_question(uuid, uuid, jsonb) to authenticated;
revoke all on function public.get_tentative_resultat(uuid) from public, anon;
grant execute on function public.get_tentative_resultat(uuid) to authenticated;

-- --------------------------------------------------------------------------
-- 3. Lecture d'un palier : jamais de correction avant une validation stockee.
-- --------------------------------------------------------------------------

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

notify pgrst, 'reload schema';

commit;
