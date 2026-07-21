-- Audit transactionnel de la livraison 2026-07-14.
-- Toutes les mutations de test sont annulées par le ROLLBACK final.

begin;

do $$
declare
  v_admin_id uuid;
  v_admin_before jsonb;
  v_admin_after jsonb;
  v_caller_id uuid;
  v_candidate_id uuid;
  v_niveau_id uuid;
  v_serie_id uuid;
  v_matiere_duel_id uuid;
  v_matiere_quiz_id uuid;
  v_catalogue jsonb;
  v_search jsonb;
  v_question jsonb;
  v_answer jsonb;
  v_expected_chapters integer;
  v_before_questions integer;
  v_after_questions integer;
  v_index integer;
begin
  select p.id into v_admin_id
  from public.profiles p
  where p.is_admin
  order by p.created_at
  limit 1;
  if v_admin_id is null then raise exception 'audit_admin_absent'; end if;

  select coalesce(jsonb_object_agg(p.id::text, p.approuve), '{}'::jsonb)
  into v_admin_before
  from public.profiles p
  where p.is_admin;

  perform set_config('request.jwt.claim.sub', v_admin_id::text, true);
  perform public.set_approbation_utilisateurs_admin_v1(false);

  select coalesce(jsonb_object_agg(p.id::text, p.approuve), '{}'::jsonb)
  into v_admin_after
  from public.profiles p
  where p.is_admin;
  if v_admin_after is distinct from v_admin_before then
    raise exception 'audit_bulk_a_modifie_un_admin';
  end if;
  if exists (select 1 from public.profiles p where not p.is_admin and p.approuve) then
    raise exception 'audit_bulk_desapprobation_incomplete';
  end if;

  perform public.set_approbation_utilisateurs_admin_v1(true);
  if exists (select 1 from public.profiles p where not p.is_admin and not p.approuve) then
    raise exception 'audit_bulk_approbation_incomplete';
  end if;

  select p1.id, p2.id, p1.niveau_id, p1.serie_id
  into v_caller_id, v_candidate_id, v_niveau_id, v_serie_id
  from public.profiles p1
  join public.profiles p2
    on p2.id <> p1.id
   and p2.niveau_id = p1.niveau_id
   and p2.serie_id = p1.serie_id
  where not p1.is_admin
    and not p2.is_admin
    and p1.approuve
    and p2.approuve
    and p1.niveau_id is not null
    and p1.serie_id is not null
  order by p1.created_at, p2.created_at
  limit 1;
  if v_caller_id is null then raise exception 'audit_deux_utilisateurs_meme_classe_absents'; end if;

  update public.profiles
  set username = 'Cœur Lætitia ' || left(v_candidate_id::text, 8)
  where id = v_candidate_id;

  perform set_config('request.jwt.claim.sub', v_caller_id::text, true);
  v_search := public.search_duel_opponents_v2('coeur', 12);
  if not (v_search->'resultats' @> jsonb_build_array(jsonb_build_object('id', v_candidate_id))) then
    raise exception 'audit_recherche_ligature_oe_echouee';
  end if;
  v_search := public.search_duel_opponents_v2('laetitia', 12);
  if not (v_search->'resultats' @> jsonb_build_array(jsonb_build_object('id', v_candidate_id))) then
    raise exception 'audit_recherche_ligature_ae_echouee';
  end if;

  select m.id into v_matiere_duel_id
  from public.matieres m
  join public.matieres_series ms
    on ms.matiere_id = m.id
   and ms.serie_id = v_serie_id
  join public.chapitres c
    on c.matiere_id = m.id
   and c.serie_id = v_serie_id
   and c.published
  group by m.id
  order by count(*) desc, m.id
  limit 1;
  if v_matiere_duel_id is null then raise exception 'audit_catalogue_duel_absent'; end if;

  select count(*)::integer into v_expected_chapters
  from public.chapitres c
  where c.matiere_id = v_matiere_duel_id
    and c.serie_id = v_serie_id
    and c.published;
  v_catalogue := public.get_duel_catalogue_v2(v_matiere_duel_id);
  if jsonb_array_length(v_catalogue->'chapitres') <> v_expected_chapters then
    raise exception 'audit_catalogue_duel_incomplet';
  end if;

  select q.matiere_id into v_matiere_quiz_id
  from public.quiz_rapide_questions q
  join public.matieres_series ms
    on ms.matiere_id = q.matiere_id
   and ms.serie_id = v_serie_id
  where q.active
    and (q.niveau_id is null or q.niveau_id = v_niveau_id)
    and public.quiz_rapide_question_est_eligible_v2(
      q.enonce, q.choix, q.bonne_reponse, q.explication
    )
  group by q.matiere_id
  having count(*) >= 6
  order by q.matiere_id
  limit 1;
  if v_matiere_quiz_id is null then raise exception 'audit_matiere_quiz_absente'; end if;

  update public.app_settings
  set valeur = '0'::jsonb
  where cle = 'anti_spam_quiz_rapide_ms';
  delete from public.quiz_rapide_challenges where user_id = v_caller_id;

  select coalesce(qs.nb_questions, 0) into v_before_questions
  from public.quiz_scores qs
  where qs.user_id = v_caller_id and qs.matiere_id = v_matiere_quiz_id;
  v_before_questions := coalesce(v_before_questions, 0);

  for v_index in 1..35 loop
    v_question := public.get_quiz_rapide_question(v_matiere_quiz_id);
    if v_question ? 'bonne_reponse'
       or v_question ? 'explication'
       or v_question ? 'justification' then
      raise exception 'audit_correction_divulguee_avant_reponse';
    end if;
    v_answer := public.submit_quiz_rapide(
      (v_question->>'challenge_id')::uuid,
      (v_question->'choix')->>0
    );
    if length(btrim(coalesce(v_answer->>'bonne_reponse', ''))) = 0
       or length(btrim(coalesce(v_answer->>'justification', ''))) < 20 then
      raise exception 'audit_correction_ou_justification_absente';
    end if;
  end loop;

  select coalesce(qs.nb_questions, 0) into v_after_questions
  from public.quiz_scores qs
  where qs.user_id = v_caller_id and qs.matiere_id = v_matiere_quiz_id;
  if v_after_questions <> v_before_questions + 35 then
    raise exception 'audit_quiz_continu_compteur_incorrect';
  end if;
end;
$$;

rollback;

select jsonb_build_object(
  'profile_default_true', (
    select c.column_default in ('true', 'true::boolean')
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name = 'profiles'
      and c.column_name = 'approuve'
  ),
  'bulk_rpc_exists', to_regprocedure(
    'public.set_approbation_utilisateurs_admin_v1(boolean)'
  ) is not null,
  'bulk_authenticated_only',
    has_function_privilege(
      'authenticated',
      'public.set_approbation_utilisateurs_admin_v1(boolean)',
      'EXECUTE'
    )
    and not has_function_privilege(
      'anon',
      'public.set_approbation_utilisateurs_admin_v1(boolean)',
      'EXECUTE'
    ),
  'duel_search_exists', to_regprocedure(
    'public.search_duel_opponents_v2(text,integer)'
  ) is not null,
  'legacy_quota_removed', not exists (
    select 1 from public.app_settings
    where cle = 'decouverte_quiz_rapide_limite'
  ),
  'seeded_questions', (
    select count(*)
    from public.quiz_rapide_questions q
    where q.code ~ '^(maths|pc|svt|fr|en|hg|philo|es)-0[1-6]$'
  ),
  'active_questions', (
    select count(*) from public.quiz_rapide_questions q where q.active
  ),
  'active_invalid', (
    select count(*)
    from public.quiz_rapide_questions q
    where q.active
      and not public.quiz_rapide_question_est_eligible_v2(
        q.enonce, q.choix, q.bonne_reponse, q.explication
      )
  ),
  'subjects_with_six', (
    select count(*)
    from (
      select m.slug
      from public.matieres m
      join public.quiz_rapide_questions q on q.matiere_id = m.id
      where q.active
        and m.slug in (
          'maths', 'physique-chimie', 'svt', 'francais',
          'anglais', 'histoire-geo', 'philosophie', 'espagnol'
        )
        and public.quiz_rapide_question_est_eligible_v2(
          q.enonce, q.choix, q.bonne_reponse, q.explication
        )
      group by m.slug
      having count(*) >= 6
    ) valid_subjects
  ),
  'transactional_checks', jsonb_build_array(
    'bulk_admin_protected',
    'bulk_approve_disapprove',
    'duel_ligatures',
    'duel_all_published_lessons',
    'quiz_no_preanswer_leak',
    'quiz_35_answers_without_quota',
    'quiz_postanswer_justification'
  )
) as release_audit;
