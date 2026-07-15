-- EXCELLENCE LYCÉE — correctifs P0 d'intégrité et de confidentialité
-- À appliquer sur une base existante après sauvegarde. Idempotent hors données
-- dupliquées dans reponses, qui doivent être examinées avant de créer l'index.

begin;

alter table public.signalements
  alter column user_id set default auth.uid();

create unique index if not exists uniq_reponses_tentative_question
  on public.reponses(tentative_id, question_id);

alter table public.defis
  add column if not exists started_challenger_at timestamptz,
  add column if not exists started_adversaire_at timestamptz;

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

alter table public.quiz_rapide_questions enable row level security;
alter table public.quiz_rapide_challenges enable row level security;

drop policy if exists "quiz_rapide_questions_admin" on public.quiz_rapide_questions;
create policy "quiz_rapide_questions_admin" on public.quiz_rapide_questions
  for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.quiz_rapide_questions to authenticated;
revoke all on public.quiz_rapide_questions from anon;
revoke all on public.quiz_rapide_challenges from anon, authenticated;

drop policy if exists "defis_select" on public.defis;
revoke select on public.defis from anon, authenticated;

drop policy if exists "chat_global_select" on public.chat_global;
create policy "chat_global_select" on public.chat_global for select using (
  auth.uid() is not null and
  niveau_id = (select niveau_id from public.profiles where id = auth.uid())
);

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
  if auth.uid() is null then raise exception 'auth_required'; end if;

  select * into v_tentative from public.tentatives
  where id = p_tentative_id and user_id = auth.uid()
  for update;
  if v_tentative is null then raise exception 'tentative_introuvable'; end if;

  if v_tentative.statut = 'terminee' then
    return jsonb_build_object(
      'note', v_tentative.note,
      'corrections', '[]'::jsonb,
      'deja_soumise', true
    );
  end if;
  if v_tentative.statut <> 'en_cours' then raise exception 'tentative_introuvable'; end if;
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
    if v_correcte then v_points_obtenus := v_points_obtenus + v_question.points; end if;

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

  v_note := case when v_total_points > 0
    then round((v_points_obtenus / v_total_points) * 20, 2) else 0 end;

  update public.tentatives set
    statut = 'terminee', note = v_note,
    temps_pris_sec = greatest(0, extract(epoch from (now() - created_at))::int)
  where id = p_tentative_id;

  if v_note > coalesce(v_ancienne_meilleure, -1) then
    v_delta_points := round((v_note - coalesce(v_ancienne_meilleure, 0)) * 2)::int;
    perform set_config('app.internal_update', 'on', true);
    update public.profiles set points_carriere = points_carriere + v_delta_points
    where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());
  return jsonb_build_object('note', v_note, 'corrections', v_corrections);
end;
$$;

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
  ) then raise exception 'matiere_non_autorisee'; end if;

  select q.* into v_question from public.quiz_rapide_questions q
  where q.matiere_id = p_matiere_id and q.active = true
    and (q.niveau_id is null or q.niveau_id = v_niveau_id)
  order by random() limit 1;
  if v_question is null then raise exception 'contenu_insuffisant'; end if;

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
  select c.* into v_challenge from public.quiz_rapide_challenges c
  where c.id = p_challenge_id and c.user_id = auth.uid()
  for update;
  if v_challenge is null then raise exception 'question_introuvable'; end if;
  if v_challenge.answered_at is not null then raise exception 'question_deja_repondue'; end if;
  if now() > v_challenge.expires_at then raise exception 'question_expiree'; end if;

  select q.* into v_question from public.quiz_rapide_questions q
  where q.id = v_challenge.question_id;
  if v_question is null or not v_question.active then raise exception 'question_introuvable'; end if;
  if not exists (
    select 1 from jsonb_array_elements_text(v_question.choix) c(value)
    where c.value = p_choix
  ) then raise exception 'choix_invalide'; end if;

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
    derniere_reponse_at = now(), updated_at = now()
  where user_id = auth.uid() and matiere_id = v_challenge.matiere_id
  returning * into v_score;

  if v_bonne then
    perform set_config('app.internal_update', 'on', true);
    update public.profiles set points_carriere = points_carriere + 5 where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;
  perform public.check_and_award_badges(auth.uid());
  return jsonb_build_object(
    'bonne', v_bonne, 'bonne_reponse', v_question.bonne_reponse,
    'points', v_score.points, 'streak_actuel', v_score.streak_actuel,
    'streak_max', v_score.streak_max
  );
end;
$$;

revoke all on function public.get_quiz_rapide_question(uuid) from public, anon;
revoke all on function public.submit_quiz_rapide(uuid, text) from public, anon;
grant execute on function public.get_quiz_rapide_question(uuid) to authenticated;
grant execute on function public.submit_quiz_rapide(uuid, text) to authenticated;

create or replace function public.get_mes_defis()
returns table (
  id uuid, challenger_id uuid, adversaire_id uuid, statut text,
  score_challenger int, score_adversaire int,
  temps_challenger int, temps_adversaire int,
  gagnant_id uuid, created_at timestamptz, terminated_at timestamptz
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
  ) then raise exception 'matiere_non_autorisee'; end if;

  select jsonb_agg(jsonb_build_object(
    'id', q.id, 'enonce', q.enonce, 'choix', q.choix,
    'bonnes_reponses', q.bonnes_reponses,
    'points', q.points, 'explication', q.explication
  )) into v_questions
  from (
    select qu.* from public.questions qu
    join public.quiz qz on qz.id = qu.quiz_id
    join public.chapitres c on c.id = qz.chapitre_id
    where c.matiere_id = p_matiere_id and c.serie_id = v_serie_id
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
declare v_defi public.defis%rowtype;
begin
  if auth.uid() is null then raise exception 'auth_required'; end if;
  select d.* into v_defi from public.defis d
  where d.id = p_defi_id and d.adversaire_id = auth.uid()
    and d.statut = 'en_attente'
  for update;
  if v_defi is null then raise exception 'defi_introuvable'; end if;
  update public.defis set statut = 'en_cours' where id = p_defi_id;
  return jsonb_build_object('defi_id', v_defi.id);
end;
$$;

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
    update public.defis set statut = 'termine', terminated_at = now(),
      gagnant_id = case
        when v_defi.score_challenger > v_defi.score_adversaire then v_defi.challenger_id
        when v_defi.score_adversaire > v_defi.score_challenger then v_defi.adversaire_id
        when v_defi.temps_challenger <= v_defi.temps_adversaire then v_defi.challenger_id
        else v_defi.adversaire_id end
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

notify pgrst, 'reload schema';
commit;
