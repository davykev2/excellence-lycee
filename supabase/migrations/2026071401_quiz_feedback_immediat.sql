-- ============================================================================
-- Quiz à feedback immédiat : validation question par question + réponses libres
-- Idempotent, rejouable. À coller dans Supabase SQL Editor > New query.
-- ============================================================================

-- ---- Normalisation de texte (réponses libres) ------------------------------
-- Minuscule, sans accents, espaces réduits : comparaison tolérante.
create or replace function public.norm_txt(p text)
returns text language sql immutable set search_path = public as $$
  select btrim(regexp_replace(
    translate(lower(coalesce(p, '')),
      'àâäáãçéèêëíìîïñóòôöõúùûüýÿ',
      'aaaaaceeeeiiiinooooouuuuyy'),
    '\s+', ' ', 'g'));
$$;

-- ---- Valider une réponse et renvoyer la correction -------------------------
-- Verrouille la réponse (anti-triche) : une fois répondu, on renvoie la
-- correction stockée sans recréditer. Gère les QCM et les questions 'texte'.
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

  select * into v_q from public.questions
    where id = p_question_id and quiz_id = v_tentative.quiz_id;
  if v_q is null then raise exception 'question_introuvable'; end if;

  -- Déjà répondu : on renvoie la correction sans rien changer.
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

  -- Évaluation selon le type de question
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

-- ---- Finaliser la tentative (note depuis les réponses stockées) ------------
create or replace function public.finalize_tentative(p_tentative_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tentative record;
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

  if v_tentative.statut = 'terminee' then
    return jsonb_build_object('note', v_tentative.note, 'deja_soumise', true);
  end if;
  if v_tentative.statut <> 'en_cours' then raise exception 'tentative_introuvable'; end if;

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

  -- Crédit des points carrière (uniquement sur progression), via le flag interne.
  if v_note > coalesce(v_ancienne, -1) then
    v_delta := round((v_note - coalesce(v_ancienne, 0)) * 2)::int;
    perform set_config('app.internal_update', 'on', true);
    update public.profiles set points_carriere = points_carriere + v_delta where id = auth.uid();
    perform set_config('app.internal_update', '', true);
  end if;

  perform public.check_and_award_badges(auth.uid());

  return jsonb_build_object('note', v_note);
end;
$$;

grant execute on function public.norm_txt(text) to anon, authenticated;
grant execute on function public.answer_question(uuid, uuid, jsonb) to authenticated;
grant execute on function public.finalize_tentative(uuid) to authenticated;
