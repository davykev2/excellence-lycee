-- ============================================================================
-- Quiz rapide : justification (explication) renvoyée après chaque réponse.
-- Idempotent, rejouable. À coller dans Supabase SQL Editor > New query.
-- ============================================================================

-- 1. Colonne pour stocker la justification de chaque question
alter table public.quiz_rapide_questions
  add column if not exists explication text;

-- 2. submit_quiz_rapide renvoie désormais aussi 'explication'
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
    'explication', v_question.explication,
    'points', v_score.points, 'streak_actuel', v_score.streak_actuel,
    'streak_max', v_score.streak_max
  );
end;
$$;

revoke all on function public.submit_quiz_rapide(uuid, text) from public, anon;
grant execute on function public.submit_quiz_rapide(uuid, text) to authenticated;
