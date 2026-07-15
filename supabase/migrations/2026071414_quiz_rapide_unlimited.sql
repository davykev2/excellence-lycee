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
