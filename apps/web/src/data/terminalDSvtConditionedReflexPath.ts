import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  LessonSourceMetadata,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "SVT TD_L1_Le reflexe conditionnel.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel?: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel?: string,
  points = 1,
): LessonQuestion => ({
  type: "short-answer",
  prompt,
  options: [],
  correctIndex: 0,
  acceptedAnswers,
  explanation,
  sourceLabel,
  points,
});

const trueFalse = (
  prompt: string,
  answer: boolean,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], answer ? 0 : 1, explanation, sourceLabel);

const source = (pages: string, section: string, corrections: string[]): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages,
  section,
  fidelity: "faithful-corrected",
  corrections,
});

const diagram = (
  title: string,
  instruction: string,
  rootLabel: string,
  rootDetail: string,
  nodes: DiagramNodeItem[],
  observation: string,
): LessonInteraction => ({
  kind: "diagram",
  eyebrow: "Carte originale à explorer",
  title,
  instruction,
  rootLabel,
  rootDetail,
  nodes: nodes as [DiagramNodeItem, DiagramNodeItem, ...DiagramNodeItem[]],
  observation,
});

const timeline = (
  title: string,
  instruction: string,
  items: TimelineInteractionItem[],
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Expérience à dérouler",
  title,
  instruction,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
  observation,
});

interface LevelSeed {
  id: string;
  title: string;
  summary: string;
  pages: string;
  section: string;
  durationMinutes: number;
  xp: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  interaction: LessonInteraction;
  questions: LessonQuestion[];
  corrections: string[];
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed.pages, seed.section, seed.corrections),
    concept: {
      eyebrow: `Niveau ${index + 1} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode expérimentale",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Décris le protocole et les réponses observées avant d’identifier le stimulus, le type d’apprentissage et le mécanisme proposé.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : stimulus et réponse sont deux objets différents ; nomme toujours chacun avant d’expliquer leur association.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: LevelSeed[] = [
  {
    id: "reflex-response-foundations",
    title: "Distinguer stimulus, réponse et apprentissage",
    summary: "Construire le vocabulaire du conditionnement classique sans confondre réflexe inné, réponse conditionnée et habileté complexe.",
    pages: "1-3 et 8-9",
    section: "Introduction et notions fondamentales",
    durationMinutes: 25,
    xp: 45,
    body: String.raw`
## Partir d’une relation simple

Un **stimulus** est un événement détectable par l’organisme ; une **réponse** est une modification mesurable qui suit ce stimulus. Dans le conditionnement classique, on étudie comment un stimulus d’abord neutre acquiert le pouvoir de prédire un événement biologiquement significatif et finit par déclencher une réponse conditionnée.

Le vocabulaire standard évite les confusions :

| Avant apprentissage | Après apprentissage |
|---|---|
| stimulus inconditionnel **SI** ou « absolu » : viande | stimulus conditionnel **SC** : son devenu prédictif |
| réponse inconditionnelle **RI** : salivation provoquée par la viande | réponse conditionnelle **RC** : salivation provoquée par le son |
| stimulus neutre **SN** : son sans salivation attendue | le même signal n’est plus neutre |

« Inconditionnel » signifie que la relation étudiée ne dépend pas de cet apprentissage particulier. Cela ne veut pas dire que la réponse est rigide dans toutes les circonstances : satiété, santé, attention et intensité du stimulus peuvent la modifier. « Conditionnel » signifie acquis sous certaines conditions, pas volontaire ni éternel.

## Réflexe inné et réponse conditionnée

La salivation à la nourriture est une réponse inconditionnelle. La salivation au son, après association, est une réponse conditionnée. Le cours parle de **réflexe conditionnel** ou **réflexe acquis** ; ce vocabulaire scolaire est conservé, mais « réponse conditionnée » est souvent plus précis, car l’apprentissage modifie une probabilité et une amplitude de réponse.

L’activité 1 du document demande si un réflexe inné a nécessairement la moelle épinière pour centre. Cette généralisation est trop large. Certains réflexes innés sont spinaux, d’autres passent par le tronc cérébral, comme le réflexe salivaire. Un animal privé de moelle ne peut d’ailleurs pas accomplir normalement tous les réflexes spinaux sous la lésion.

## Toutes les habiletés ne sont pas un simple conditionnement pavlovien

La conduite, la nage, l’écriture et la lecture citées dans l’introduction sont bien apprises, mais elles mobilisent aussi apprentissage procédural, décisions, correction des erreurs et parfois conditionnement opérant. Elles ne sont pas chacune un unique « réflexe conditionnel ». L’expérience de Pavlov isole un mécanisme plus simple : un signal prédit un événement.

## Lire une question sans tomber dans le piège

Un stimulus neutre « n’apporte pas naturellement la réponse attendue » avant conditionnement. Le stimulus inconditionnel provoque la RI sans que l’association SN-SI ait été apprise. Une réponse conditionnée apparaît après apprentissage et reste modifiable.

> **Astuce mémoire :** N devient C ; I reste I. Le stimulus **N**eutre devient **C**onditionnel, tandis que le couple **I**nconditionnel existe avant l’apprentissage étudié.
`,
    keyPoint: "Avant : SN sans RC et SI → RI ; après associations : SC → RC, tandis que SI → RI demeure.",
    example: "Avant les essais, la viande fait saliver mais le son non ; après apprentissage, le son devient SC et déclenche une RC de salivation.",
    methodSteps: [
      "Nomme l’événement présenté et la réponse mesurée.",
      "Teste leur relation avant tout apprentissage.",
      "Classe l’événement comme SN ou SI et la réponse comme RI.",
      "Après les associations, renomme seulement le signal appris SC et sa réponse RC.",
    ],
    interaction: diagram(
      "Le dictionnaire du conditionnement",
      "Ouvre chaque terme puis reconstruis les relations avant et après apprentissage.",
      "Stimulus et réponse",
      "Le statut d’un signal dépend de son histoire : le même son passe de neutre à conditionnel.",
      [
        { id: "sn", label: "SN", role: "Son avant apprentissage", detail: "Il n’entraîne pas la salivation étudiée ; il est neutre pour cette réponse.", group: "Avant" },
        { id: "si", label: "SI", role: "Viande", detail: "Elle provoque la salivation sans association préalable avec le son.", group: "Avant" },
        { id: "ri", label: "RI", role: "Salivation à la viande", detail: "Réponse inconditionnelle déclenchée par le SI.", group: "Avant" },
        { id: "pairing", label: "SN puis SI", role: "Essais associés", detail: "Le son devient un prédicteur fiable de l’arrivée de la viande.", group: "Apprentissage" },
        { id: "sc", label: "SC", role: "Son après apprentissage", detail: "Le signal auparavant neutre est désormais conditionnel.", group: "Après" },
        { id: "rc", label: "RC", role: "Salivation au son", detail: "La réponse conditionnée est mesurée lorsque le SC est présenté seul.", group: "Après" },
      ],
      "Le stimulus n’est pas la réponse : SC désigne le son appris, RC la salivation qu’il déclenche.",
    ),
    questions: [
      choice("Avant apprentissage, quel statut a le son sans salivation ?", ["Stimulus neutre", "Stimulus inconditionnel", "Réponse conditionnée", "Effecteur"], 0, "Il ne déclenche pas naturellement la salivation étudiée.", "Activité 1 • page 8"),
      choice("Quel sigle désigne la viande dans l’expérience ?", ["RC", "SI", "SN", "SC"], 1, "La viande est le stimulus inconditionnel."),
      choice("Quelle est la RI ?", ["Le son", "La viande", "La salivation à la viande", "La cage"], 2, "La réponse inconditionnelle est provoquée par le SI."),
      choice("Après apprentissage, le son devient…", ["une RI", "un SI", "une glande", "un SC"], 3, "Le signal appris est le stimulus conditionnel."),
      trueFalse("Une RC est nécessairement volontaire.", false, "Une réponse conditionnée peut être automatique et mesurée sans décision volontaire."),
      choice("Quelle proposition de l’activité 1 définit le mieux un stimulus neutre ?", ["Il n’apporte pas naturellement la réponse attendue", "Il produit toujours la réponse", "Il doit suivre le SI", "Il est une réponse"], 0, "C’est la réponse 1-b du document."),
      choice("Quel énoncé corrige l’item sur le réflexe inné ?", ["Tous les réflexes sont corticaux", "Les réflexes innés peuvent avoir des centres spinaux ou du tronc cérébral", "Aucun réflexe n’utilise la moelle", "Le cerveau est un muscle"], 1, "Le centre dépend du réflexe considéré."),
      choice("Quelle activité n’est pas réductible à un seul conditionnement pavlovien ?", ["La salivation à la viande", "Le clignement réflexe", "La conduite automobile", "Le réflexe pupillaire"], 2, "Conduire mobilise plusieurs formes d’apprentissage et de contrôle."),
      trueFalse("Le mot « absolu » de la source correspond au stimulus inconditionnel.", true, "Les deux termes désignent ici la viande avant apprentissage."),
      choice("Quel couple reste valide après le conditionnement ?", ["SN → RC", "SC → RI seulement", "SN → SI", "SI → RI"], 3, "La viande continue de provoquer la réponse inconditionnelle."),
      short("Donne les deux sigles du couple appris son → salivation.", ["SC et RC", "SC-RC", "SC puis RC"], "Après apprentissage, le son est SC et la salivation au son est RC."),
    ],
    corrections: [
      "La terminologie SN/SI/RI/SC/RC est ajoutée à « stimulus absolu » et « réflexe acquis » pour séparer sans ambiguïté signal et réponse.",
      "L’affirmation de l’activité 1 selon laquelle le réflexe inné a pour centre la moelle est limitée aux réflexes spinaux ; les réflexes innés peuvent aussi être bulbaires.",
      "Conduite, nage, écriture et lecture ne sont pas présentées comme de simples réflexes pavloviens, mais comme des apprentissages complexes.",
      "L’en-tête « Leçon 4 » du PDF est conservé comme repère source mais le parcours suit le catalogue produit, où ce cours occupe le chapitre 1 de Terminale D.",
    ],
  },
  {
    id: "conditioned-reflex-acquisition",
    title: "Mesurer l’acquisition du réflexe conditionnel",
    summary: "Suivre l’apparition progressive de la réponse et résoudre fidèlement le texte à huit blancs de la source.",
    pages: "2-3 et 9-10",
    section: "Phase d’apprentissage et acquisition",
    durationMinutes: 27,
    xp: 65,
    body: String.raw`
## L’acquisition est une évolution, pas un instant magique

Au début, le stimulus neutre ne provoque pas la réponse étudiée. À mesure que le signal prédit de façon répétée le stimulus inconditionnel, la réponse au signal seul devient plus probable et souvent plus ample. Cette phase s’appelle **acquisition**. Elle peut être représentée par une courbe : nombre d’essais en abscisse, quantité de salive ou probabilité de réponse en ordonnée.

Une seule apparition de salive ne suffit pas pour affirmer que l’apprentissage est stable. On répète des essais de test sans distribuer trop souvent le SI, on mesure une ligne de base, et on recherche une tendance qui dépasse la variabilité spontanée.

## Les huit blancs de l’activité officielle

La page 3 demande de compléter : viande, son de métronome, association, puis son seul. L’ordre fidèle est :

1. viande = stimulus **absolu** ou inconditionnel ;
2. salivation à la viande = réflexe **inné** ou réponse inconditionnelle ;
3. au son initial, le chien dresse les oreilles **sans saliver** ;
4. le son est alors **neutre** pour la salivation ;
5. on **associe** son et viande, le son précédant la viande ;
6. après apprentissage, le son présenté **seul** déclenche la salivation ;
7. cette réaction est **un réflexe acquis** ou RC ;
8. le son est devenu **un stimulus conditionnel**.

Le fait que le chien dresse les oreilles au son ne rend pas le son « non neutre » pour tout comportement. La neutralité est toujours définie **par rapport à la réponse mesurée** : le son peut provoquer une orientation auditive tout en restant neutre pour la salivation.

## La contingence complète la répétition

La répétition facilite l’apprentissage quand le SC informe réellement sur l’arrivée du SI. Si la viande survient aussi souvent sans son qu’après le son, le signal apporte peu d’information et l’acquisition est faible. On parle de **contingence** : différence entre la probabilité du SI après le SC et sa probabilité en l’absence du SC.

Le conditionnement n’exige donc pas seulement que deux événements existent dans la même séance. Leur ordre, leur intervalle, leur régularité et leur valeur biologique importent. La réponse augmente plus facilement quand le signal précède le SI d’un délai approprié que lorsque l’ordre est inversé.

## Distinguer acquisition et performance

L’animal peut avoir appris sans répondre à chaque essai : satiété, distraction ou stress peuvent réduire la performance. À l’inverse, une goutte de salive isolée peut survenir sans association. On conclut sur plusieurs mesures et, si possible, plusieurs animaux.

> **Astuce mémoire — apprendre, c’est prédire :** le SC gagne de la valeur lorsqu’il annonce mieux le SI que le contexte seul.
`,
    keyPoint: "L’acquisition est l’augmentation progressive de la RC quand le SC prédit le SI ; la neutralité se définit relativement à la réponse étudiée.",
    example: "Le métronome peut faire dresser les oreilles dès le premier essai mais rester SN pour la salivation ; il devient SC seulement quand il déclenche la salivation apprise.",
    methodSteps: [
      "Définis la réponse mesurée avant de qualifier le stimulus.",
      "Trace ou compare la RC au fil des essais.",
      "Vérifie que le SC précède et prédit le SI.",
      "Sépare variabilité de performance et tendance d’acquisition.",
    ],
    interaction: diagram(
      "Les huit pièces du texte à trous",
      "Ouvre chaque pièce dans l’ordre et explique pourquoi elle occupe ce blanc.",
      "Acquisition de la salivation",
      "Le son garde une réponse d’orientation possible, mais son statut pour la salivation change après association.",
      [
        { id: "absolute", label: "1. Absolu", role: "Viande = SI", detail: "Le terme moderne équivalent est stimulus inconditionnel.", group: "Avant" },
        { id: "innate", label: "2. Inné", role: "Salivation = RI", detail: "La viande déclenche la réponse sans apprentissage son-viande.", group: "Avant" },
        { id: "ears", label: "3. Sans saliver", role: "Orientation seule", detail: "Le chien peut dresser les oreilles sans produire la réponse salivaire étudiée.", group: "Avant" },
        { id: "neutral", label: "4. Neutre", role: "Son pour la salivation", detail: "La neutralité est relative à la fonction mesurée.", group: "Avant" },
        { id: "associate", label: "5. Associe", role: "Son puis viande", detail: "Les essais rendent le signal prédictif.", group: "Apprentissage" },
        { id: "alone", label: "6. Seul", role: "Test sans viande", detail: "Le test final isole le pouvoir acquis du son.", group: "Après" },
        { id: "acquired", label: "7. Réflexe acquis", role: "RC", detail: "La salivation au son est la réponse conditionnée.", group: "Après" },
        { id: "conditioned", label: "8. Stimulus conditionnel", role: "SC", detail: "Le son était SN et devient SC.", group: "Après" },
      ],
      "Chaque blanc appartient soit à l’état initial, soit à l’association, soit au test après acquisition.",
    ),
    questions: [
      choice("Quel mot remplit le blanc 1 ?", ["absolu", "neutre", "seul", "acquis"], 0, "La viande est le stimulus absolu/inconditionnel.", "Activité • page 3"),
      choice("Quel mot remplit le blanc 2 ?", ["conditionnel", "inné", "neutre", "associé"], 1, "La salivation à la viande est le réflexe inné/RI."),
      choice("Quel groupe remplit le blanc 3 ?", ["en salivant", "avec la viande", "sans saliver", "après extinction"], 2, "Le son produit une orientation mais pas la salivation."),
      choice("Quel mot remplit le blanc 4 ?", ["absolu", "acquis", "seul", "neutre"], 3, "Le son est initialement neutre pour la salivation."),
      choice("Quel mot remplit le blanc 5 ?", ["associe", "éteint", "détruit", "inverse"], 0, "On associe les deux stimuli."),
      choice("Quel mot remplit le blanc 6 ?", ["inné", "seul", "neutre", "spinal"], 1, "Le son seul teste la RC."),
      choice("Quel groupe remplit le blanc 7 ?", ["un SI", "une RI", "un réflexe acquis", "un SN"], 2, "La salivation apprise est la RC."),
      choice("Quel groupe remplit le blanc 8 ?", ["une réponse absolue", "une glande", "un réflexe inné", "un stimulus conditionnel"], 3, "Le son a acquis le statut de SC."),
      trueFalse("Dresser les oreilles suffit pour dire que le son n’est pas neutre pour la salivation.", false, "La neutralité est relative à la réponse étudiée."),
      choice("Quel facteur rend le SC informatif ?", ["Une forte contingence SC-SI", "Une présentation aléatoire sans relation", "L’absence de toute mesure", "Un seul essai ambigu"], 0, "Le SI doit être plus probable après le SC."),
      short("Quel nom donne-t-on à la phase où la RC augmente ?", ["acquisition", "phase d’acquisition", "apprentissage"], "C’est la phase d’acquisition du conditionnement."),
    ],
    corrections: [
      "Les huit réponses de l’activité sont conservées dans l’ordre exact du corrigé source.",
      "Le son peut provoquer une orientation sans salivation : la neutralité est précisée comme relative à la réponse mesurée.",
      "La répétition est complétée par la notion de contingence prédictive et par la distinction apprentissage/performance.",
    ],
  },
  {
    id: "temporal-association-repetition",
    title: "Maîtriser ordre, délai et répétition",
    summary: "Analyser l’effet de l’ordre temporel des stimuli et corriger précisément les périodes d’essais de la souris.",
    pages: "5 et 9-11",
    section: "Conditions temporelles et situation d’évaluation de la souris",
    durationMinutes: 29,
    xp: 70,
    body: String.raw`
## Le signal doit annoncer, pas suivre au hasard

Le document rappelle que le stimulus neutre choisi doit **précéder** le stimulus inconditionnel. Ce conditionnement différé est généralement efficace : le début du SC annonce l’arrivée prochaine du SI. Un intervalle trop long rend la prédiction imprécise ; un intervalle trop court ou une présentation strictement simultanée peut réduire l’information fournie. L’intervalle optimal dépend des systèmes sensoriels et de la réponse étudiée.

La répétition consolide l’association, mais elle n’est pas une garantie isolée. Des présentations nombreuses sans relation temporelle stable peuvent produire habituation ou simple exposition, pas le même apprentissage SC-SI.

## Lire exactement les quinze essais de la souris

La situation d’évaluation 1 utilise une lumière et un courant électrique faible appliqué à la patte. Le tableau doit être lu colonne par colonne :

| Essais | Présentation | Flexion |
|---|---|---|
| 1 | lumière seule | non |
| 2 à 4 | courant seul | oui |
| 5 à 9 | lumière suivie du courant | oui |
| 10 à 13 | lumière seule | oui |
| 14 à 15 | lumière seule | non |

La lumière est SN au premier essai ; le courant est SI aversif et la flexion qu’il déclenche est RI. Aux essais **5 à 9**, la lumière prédit le courant : acquisition. Aux essais **10 à 13**, la lumière seule déclenche la flexion : lumière = SC, flexion = RC. Aux essais **14 à 15**, la RC disparaît dans cette courte série non renforcée : extinction comportementale.

## Corriger la contradiction du corrigé

La page 10 analyse correctement les appariements 5 à 9, mais la page 11 écrit ensuite « du 5e au 10e essai ». Or l’essai 10 ne comporte plus de courant dans le tableau : c’est déjà un essai lumière seule. La période fidèle aux marques du document est donc **5-9 pour l’association**, puis **10-13 pour la réponse conditionnée**, enfin **14-15 pour l’absence de réponse observée**.

## Ne pas surinterpréter deux essais

Deux essais sans flexion indiquent une baisse de performance, mais un protocole scientifique chercherait davantage d’essais et un nouveau test après un délai. L’extinction n’est pas nécessairement un effacement de l’association ; une récupération spontanée peut survenir. Le tableau montre une extinction apparente à court terme, pas la disparition anatomique d’une « liaison ».

## Éthique de l’exemple aversif

Le courant électrique est présenté dans un document pédagogique historique. Une expérience réelle devrait être autorisée, justifiée, raffinée pour minimiser douleur et stress, et remplacée par une méthode non aversive lorsque cela est possible. Le cours apprend à analyser les données, pas à reproduire le protocole sans cadre éthique.

> **Astuce mémoire — 1 / 2-4 / 5-9 / 10-13 / 14-15 :** neutre, inconditionnel, association, acquisition testée, extinction observée.
`,
    keyPoint: "Essais souris : 1 lumière seule ; 2-4 courant ; 5-9 appariements ; 10-13 lumière seule avec RC ; 14-15 lumière seule sans RC.",
    example: "L’essai 10 appartient au test du SC seul, pas aux associations : le carré du courant est absent mais le cercle de flexion reste présent.",
    methodSteps: [
      "Lis les symboles de chaque ligne avant le corrigé rédigé.",
      "Regroupe seulement des colonnes de protocole identique.",
      "Attribue SN/SI/RI puis SC/RC à chaque période.",
      "Signale toute contradiction entre tableau et commentaire.",
    ],
    interaction: timeline(
      "Les quinze essais sans décalage",
      "Déroule les cinq périodes et repère la frontière exacte entre appariement et test.",
      [
        { label: "Essai 1", shortLabel: "Lumière", detail: "Lumière seule, aucune flexion : la lumière est SN pour cette réponse." },
        { label: "Essais 2-4", shortLabel: "Courant", detail: "Le SI déclenche la flexion RI sans apprentissage lumière-courant." },
        { label: "Essais 5-9", shortLabel: "Association", detail: "Lumière puis courant, avec flexion : phase d’apprentissage exacte." },
        { label: "Essais 10-13", shortLabel: "Test du SC", detail: "La lumière seule déclenche encore la flexion conditionnée." },
        { label: "Essais 14-15", shortLabel: "Extinction", detail: "La lumière reste seule mais la flexion n’est plus observée." },
        { label: "Après délai", shortLabel: "Test à prévoir", detail: "Un test ultérieur pourrait révéler une récupération spontanée." },
      ],
      "Les marques du tableau font autorité : l’appariement s’arrête à l’essai 9.",
    ),
    questions: [
      choice("Que présente l’essai 1 ?", ["La lumière seule", "Le courant seul", "Lumière + courant", "Aucun stimulus"], 0, "La lumière ne déclenche pas la flexion initiale.", "Situation 1 • pages 9-10"),
      choice("Quels essais testent le courant seul ?", ["1-3", "2-4", "5-9", "10-13"], 1, "Les carrés du courant sont présents sans lumière aux essais 2 à 4."),
      choice("Quelle période correspond aux appariements ?", ["1-4", "10-15", "5-9", "5-10"], 2, "Le tableau montre lumière et courant ensemble de 5 à 9."),
      choice("Quelle période montre lumière seule avec flexion ?", ["2-4", "5-9", "14-15", "10-13"], 3, "La RC est observée sur ces quatre essais."),
      trueFalse("L’essai 10 contient encore le courant électrique.", false, "Le symbole du courant s’arrête à l’essai 9."),
      choice("Quel statut initial a la lumière ?", ["SN", "SI", "RI", "RC"], 0, "Elle ne provoque pas initialement la flexion."),
      choice("Quel statut a le courant ?", ["SC", "SI", "SN", "RC"], 1, "Il déclenche la flexion inconditionnelle."),
      choice("Que montrent les essais 14-15 ?", ["Une acquisition", "Une RI accrue", "Une absence de RC après essais non renforcés", "Une généralisation"], 2, "La flexion conditionnée n’est plus visible."),
      trueFalse("Deux essais sans réponse prouvent que toute mémoire est anatomiquement effacée.", false, "L’extinction peut être suivie de récupération spontanée."),
      choice("Quelle correction faut-il appliquer au texte de la page 11 ?", ["Remplacer lumière par son", "Supprimer l’essai 1", "Déplacer l’extinction à 2-4", "Remplacer 5-10 par 5-9 pour les appariements"], 3, "L’essai 10 est déjà lumière seule."),
      short("Écris la suite des cinq périodes d’essais.", ["1; 2-4; 5-9; 10-13; 14-15", "1 2-4 5-9 10-13 14-15"], "Cette segmentation suit exactement les symboles du tableau."),
    ],
    corrections: [
      "La contradiction source est corrigée : les appariements occupent les essais 5 à 9, non 5 à 10.",
      "Les essais 10 à 13 sont identifiés comme tests de la lumière seule avec RC ; 14-15 montrent une extinction apparente.",
      "L’exemple aversif est contextualisé par les exigences contemporaines de bien-être animal et n’est pas présenté comme protocole à reproduire librement.",
    ],
  },
  {
    id: "pavlov-conditioning-experiment",
    title: "Reconstituer l’expérience de Pavlov",
    summary: "Lire les quatre phases son, viande, association et test, puis séparer résultat, analyse et interprétation.",
    pages: "1-2 et 6-7",
    section: "I. Présentation, résultats et interprétation de l’expérience",
    durationMinutes: 27,
    xp: 55,
    body: String.raw`
## Un protocole qui contrôle les signaux

Le chien est placé dans un environnement stable et isolé autant que possible des bruits, odeurs et mouvements parasites. Une fistule salivaire reliée à un récipient permet de mesurer la sécrétion. L’expérimentateur peut présenter le son du métronome et la nourriture sans devenir lui-même un signal visible.

L’expérience comporte quatre phases logiques :

1. **Son seul avant apprentissage** : le chien ne produit pas la salivation attendue ; le son est SN.
2. **Viande seule** : le chien salive ; viande = SI, salivation = RI.
3. **Son puis viande, à plusieurs reprises** : le son prédit l’arrivée du SI ; c’est l’acquisition.
4. **Son seul après apprentissage** : le chien salive ; son = SC, salivation au son = RC.

La troisième phase doit distinguer ce qui déclenche la salivation au moment de l’essai : tant que la viande est présente, la salivation observée peut inclure la RI. La preuve de l’apprentissage est le **test du son seul** de la quatrième phase.

## Résultat, analyse, interprétation

Un résultat brut indique « présence ou absence de salive » et, idéalement, une quantité. L’analyse compare les phases. L’interprétation attribue les statuts SN, SI, SC et explique l’association apprise. Dire seulement « le chien a parfaitement intégré le son » est moins précis que : « après des appariements, le son prédit la viande et déclenche une réponse conditionnée ».

| Phase | Présentation | Réponse | Conclusion |
|---|---|---|---|
| 1 | son | pas de salivation attendue | SN |
| 2 | viande | salivation | SI → RI |
| 3 | son puis viande | salivation | appariements/acquisition |
| 4 | son seul | salivation | SC → RC |

## Une reproduction originale du document A-D

La situation d’évaluation des pages 6-7 remplace le métronome par un sifflet. A : nourriture et salivation ; B : sifflet seul et absence de salivation ; C : sifflet associé à nourriture et salivation ; D : sifflet seul après apprentissage et salivation. Le principe est identique, ce qui montre que le type physique du signal peut varier.

## Limites du protocole historique

Une seule observation ne suffit pas pour quantifier un apprentissage. Un protocole robuste inclut plusieurs sujets, un niveau de salivation avant apprentissage, des essais témoins non appariés, un ordre temporel contrôlé et une mesure répétée. Les expériences animales modernes exigent aussi justification scientifique, réduction du nombre d’animaux, raffinement des procédures et protection du bien-être.

> **Astuce mémoire — seul, naturel, ensemble, seul :** le premier « seul » teste la neutralité ; le dernier teste l’acquisition.
`,
    keyPoint: "Son seul : SN ; viande seule : SI → RI ; son puis viande répétés : acquisition ; son seul final : SC → RC.",
    example: "Le sifflet ne fait pas saliver en B mais le fait en D : le changement entre ces deux tests prouve l’apprentissage.",
    methodSteps: [
      "Repère ce qui est présenté dans chaque phase.",
      "Décris la salivation sans l’expliquer d’abord.",
      "Attribue les statuts SN/SI/RI avant l’apprentissage.",
      "Utilise le test final du signal seul pour conclure SC/RC.",
    ],
    interaction: timeline(
      "Les quatre temps de Pavlov",
      "Déroule le protocole et vérifie à quel moment l’apprentissage est réellement démontré.",
      [
        { label: "Phase 1", shortLabel: "Son seul", detail: "Avant apprentissage, le son ne provoque pas la salivation étudiée : c’est un SN." },
        { label: "Phase 2", shortLabel: "Viande seule", detail: "Le SI déclenche naturellement la RI de salivation." },
        { label: "Phase 3", shortLabel: "Son puis viande", detail: "Plusieurs appariements rendent le son prédictif ; la salivation de l’essai inclut encore la RI." },
        { label: "Phase 4", shortLabel: "Son seul final", detail: "La salivation en l’absence de viande est la preuve de la RC." },
        { label: "Variante", shortLabel: "Sifflet A-D", detail: "Les pages 6-7 reproduisent la même logique avec un sifflet comme signal auditif." },
        { label: "Contrôle", shortLabel: "Essais non appariés", detail: "Un groupe témoin aiderait à vérifier que la simple répétition ne suffit pas." },
      ],
      "Le test décisif est la réponse au signal présenté seul après les appariements.",
    ),
    questions: [
      choice("Que se passe-t-il lors de la phase 1 ?", ["Son seul sans salivation attendue", "Viande seule avec salivation", "Son et viande", "Son conditionnel déjà acquis"], 0, "Cette phase établit la neutralité initiale du son.", "Protocole • page 2"),
      choice("Quel couple décrit la phase 2 ?", ["SC → RC", "SI → RI", "SN → RC", "RC → SI"], 1, "La viande déclenche la salivation inconditionnelle."),
      choice("Que répète-t-on en phase 3 ?", ["Viande puis sommeil", "Son seul", "Son puis viande", "Aucun stimulus"], 2, "Le signal précède l’événement biologiquement significatif."),
      choice("Quelle phase démontre le mieux l’acquisition ?", ["La cage vide", "La viande seule", "L’association avec viande présente", "Le son seul final qui déclenche la salivation"], 3, "La RC doit être testée sans SI."),
      trueFalse("Saliver pendant la phase son + viande prouve à lui seul que le son est devenu SC.", false, "La viande peut produire la RI ; il faut tester le son seul."),
      choice("Dans la variante A-D, quelle est la nature initiale du sifflet ?", ["Stimulus neutre", "Réponse", "SI", "Effecteur"], 0, "En B, il ne déclenche pas la salivation."),
      choice("Que montre la figure D ?", ["La nourriture seule", "Le sifflet seul déclenche une RC", "Une extinction complète", "Aucune réponse"], 1, "Le sifflet est devenu conditionnel."),
      choice("Quel dispositif mesure directement la réponse étudiée ?", ["Le métronome", "La double cloison", "La fistule salivaire reliée à un récipient", "La viande"], 2, "Il recueille la salive produite."),
      trueFalse("L’analyse doit précéder la description des résultats bruts.", false, "On décrit d’abord, puis on compare et interprète."),
      choice("Quel contrôle renforcerait la conclusion ?", ["Retirer toute mesure", "Changer toutes les variables", "Ne tester qu’un animal une fois", "Présenter son et viande non appariés à un groupe témoin"], 3, "Le témoin teste l’effet de la contingence."),
      short("Dans l’ordre, donne les quatre présentations principales.", ["son, viande, son plus viande, son", "son seul, viande seule, son et viande, son seul", "son viande son+viande son"], "L’expérience va du test de neutralité au test final de conditionnement.", "Pages 1-2"),
    ],
    corrections: [
      "La salivation pendant l’appariement est distinguée de la preuve d’acquisition, qui exige le test du signal seul.",
      "La formule vague « le chien a intégré le son » est remplacée par la notion de prédiction/apprentissage SC-SI.",
      "Les limites de l’expérience illustrée sont précisées : mesures répétées, témoins, effectif et exigences contemporaines de bien-être animal.",
    ],
  },
  {
    id: "reinforcement-conditioning-maintenance",
    title: "Renforcer et entretenir le conditionnement",
    summary: "Comprendre pourquoi les appariements renforcés maintiennent la valeur prédictive du signal sans garantir une réponse immuable.",
    pages: "2, 5 et 13-14",
    section: "Conditions de mise en place et entretien",
    durationMinutes: 27,
    xp: 75,
    body: String.raw`
## Renforcer signifie confirmer la prédiction

Dans ce conditionnement, un essai est **renforcé** lorsque le stimulus conditionnel est suivi du stimulus inconditionnel attendu. Le son ou la lumière conserve alors sa valeur prédictive. Un essai **non renforcé** présente le SC sans SI. Une longue série de tels essais fait généralement diminuer la RC.

Le document affirme que le réflexe installé doit être entretenu pour éviter sa disparition. L’idée centrale est juste, mais « entretien » ne signifie pas qu’il faut renforcer chaque essai toute la vie. Un renforcement intermittent peut maintenir une réponse, et les modalités dépendent de l’apprentissage. La fréquence, la contingence et la valeur du SI comptent davantage qu’une simple répétition mécanique.

## Conditions regroupées et justifiées

| Condition de la source | Rôle dans l’expérience |
|---|---|
| hémisphères cérébraux fonctionnels | traitement du signal, apprentissage et plasticité |
| récepteurs et voies nerveuses intègres | détection, transmission et réponse |
| vigilance sans stress excessif | attention et performance mesurable |
| stimuli discriminables | signal perceptible mais non dangereux |
| SC avant SI | relation prédictive temporelle |
| appariements répétés | acquisition suffisamment stable |
| essais renforcés ultérieurs | maintien de la valeur du SC |

Le mot « doux » employé pour un stimulus ne doit pas être interprété comme une loi absolue de l’apprentissage ; il exprime ici la nécessité d’un signal perceptible, non nocif et compatible avec le bien-être. Un stress excessif peut masquer la réponse ou créer d’autres associations.

## Le tableau des vingt essais

Dans la situation d’évaluation 2, la lumière blanche seule donne **0 goutte aux essais 1-3**. La viande seule donne **15 gouttes aux essais 4-5**. Lumière + viande donnent **15 gouttes aux essais 6-12** : ce sont sept essais renforcés. La lumière seule est ensuite testée aux essais 13-20, avec **15, 13, 11, 9, 9, 2, 0, 0** gouttes. La RC est d’abord forte puis décline en l’absence de viande.

Ces données montrent à la fois acquisition et besoin de mise à jour : quand le signal cesse d’annoncer la viande, l’organisme réduit progressivement sa réponse. Cette flexibilité est utile ; répondre indéfiniment à une prédiction devenue fausse gaspillerait des ressources.

## Ce qu’un tableau ne prouve pas seul

La sécrétion de quinze gouttes pendant lumière + viande peut être la RI produite par la viande. L’acquisition est démontrée au treizième essai, lorsque la lumière seule donne encore quinze gouttes. La diminution suivante ne signifie pas que la glande est épuisée : l’explication de conditionnement exige des contrôles, par exemple présenter à nouveau la viande pour vérifier l’intégrité de l’effecteur.

> **Astuce mémoire — renforcer = SC annonce encore SI ; éteindre = SC annonce maintenant l’absence de SI.**
`,
    keyPoint: "Un essai renforcé associe SC puis SI ; les essais 6-12 renforcent la lumière, et les essais 13-20 non renforcés font décroître la RC.",
    example: "Quinze gouttes au premier test lumière seule (essai 13) prouvent l’acquisition ; la baisse jusqu’à zéro montre une mise à jour quand la viande n’arrive plus.",
    methodSteps: [
      "Classe chaque essai selon les stimuli réellement présents.",
      "Réserve le mot renforcé aux essais où SC est suivi de SI.",
      "Repère le premier test du SC seul pour prouver l’acquisition.",
      "Analyse la série non renforcée sans confondre apprentissage et fatigue de la glande.",
    ],
    interaction: timeline(
      "Vingt essais, une prédiction mise à jour",
      "Déroule les périodes du tableau et suis le nombre de gouttes.",
      [
        { label: "Essais 1-3", shortLabel: "0 goutte", detail: "Lumière blanche seule : elle est neutre pour la salivation." },
        { label: "Essais 4-5", shortLabel: "15 gouttes", detail: "Viande seule : SI et RI salivaire intacte." },
        { label: "Essais 6-12", shortLabel: "15 gouttes", detail: "Lumière + viande : sept appariements renforcés." },
        { label: "Essai 13", shortLabel: "15 gouttes", detail: "Lumière seule : premier test positif, preuve de la RC." },
        { label: "Essais 14-18", shortLabel: "13 à 2", detail: "La lumière non renforcée déclenche une RC décroissante." },
        { label: "Essais 19-20", shortLabel: "0 goutte", detail: "La RC n’est plus observée dans ce contexte d’extinction." },
      ],
      "Le maintien dépend de la valeur prédictive du SC, pas de la simple présence répétée de lumière.",
    ),
    questions: [
      choice("Qu’est-ce qu’un essai renforcé ici ?", ["SC suivi du SI", "SC présenté seul", "Aucun stimulus", "RI sans SI"], 0, "La conséquence attendue confirme le signal."),
      choice("Combien de gouttes sont recueillies aux essais 1-3 ?", ["15", "0", "13", "2"], 1, "La lumière seule est initialement neutre.", "Situation 2 • page 13"),
      choice("Quels essais présentent la viande seule ?", ["1-3", "6-12", "4-5", "13-20"], 2, "Les essais 4 et 5 établissent la RI."),
      choice("Quels essais associent lumière et viande ?", ["4-5", "13-20", "1-3", "6-12"], 3, "Sept appariements sont indiqués."),
      trueFalse("Les 15 gouttes pendant lumière + viande prouvent seules la RC.", false, "La viande peut déclencher la RI ; il faut un test lumière seule."),
      choice("Quel essai prouve d’abord la RC à la lumière seule ?", ["13", "4", "6", "20"], 0, "À l’essai 13, la lumière seule donne 15 gouttes."),
      choice("Quelle suite correspond aux essais 13-20 ?", ["0,0,0,15,15,15,15,15", "15,13,11,9,9,2,0,0", "15 huit fois", "2,9,11,13,15,15,15,15"], 1, "La série montre une diminution graduelle."),
      choice("Quelle hypothèse contrôle l’intégrité de l’effecteur ?", ["Supprimer toute mesure", "Changer d’animal à chaque essai", "Présenter à nouveau la viande", "Conclure sans test"], 2, "Une RI intacte exclut un simple épuisement glandulaire."),
      trueFalse("Entretenir une RC exige nécessairement de renforcer chaque essai sans exception.", false, "Des renforcements intermittents peuvent maintenir un apprentissage."),
      choice("Quel facteur rend le SC utile ?", ["Sa couleur uniquement", "Sa durée maximale", "Son absence permanente", "Sa valeur prédictive du SI"], 3, "Le signal compte parce qu’il annonce l’événement."),
      short("Combien d’essais renforcés lumière + viande y a-t-il de 6 à 12 ?", ["7", "sept"], "Les essais 6, 7, 8, 9, 10, 11 et 12 sont renforcés.", "Tableau • page 13"),
    ],
    corrections: [
      "L’entretien est reformulé en maintien de la valeur prédictive par des essais renforcés, sans exiger un renforcement continu universel.",
      "La preuve d’acquisition est située au premier essai lumière seule (13), et non dans les essais où la viande déclenche encore la RI.",
      "La baisse de salivation n’est pas attribuée sans contrôle à un épuisement glandulaire ; un test du SI est proposé.",
    ],
  },
  {
    id: "extinction-spontaneous-recovery",
    title: "Comprendre extinction et récupération spontanée",
    summary: "Lire la baisse de réponse pendant les essais non renforcés et comprendre pourquoi l’extinction n’efface pas simplement la mémoire initiale.",
    pages: "5, 9-11 et 13-14",
    section: "Extinction du réflexe acquis",
    durationMinutes: 28,
    xp: 80,
    body: String.raw`
## Une nouvelle règle est apprise

L’**extinction** se produit quand le stimulus conditionnel est présenté de façon répétée sans le stimulus inconditionnel. La réponse conditionnée diminue. Le document décrit cette diminution comme la disparition d’une « nouvelle liaison nerveuse ». Cette image est trop forte : l’association initiale n’est généralement pas simplement effacée.

L’organisme apprend plutôt une seconde relation, dépendante du contexte : « dans cette situation, le SC n’est plus suivi du SI ». Cette mémoire d’extinction inhibe l’expression de la RC. Plusieurs phénomènes montrent que l’apprentissage initial subsiste au moins en partie.

## Quatre signes que l’extinction n’est pas l’oubli total

- **Récupération spontanée** : après un délai sans nouvel essai, une RC éteinte peut réapparaître.
- **Renouvellement** : changer de contexte après extinction peut restaurer la RC.
- **Rétablissement** : une nouvelle présentation du SI peut favoriser le retour de la RC.
- **Réacquisition rapide** : de nouveaux appariements peuvent rétablir la réponse plus vite qu’au premier apprentissage.

La récupération spontanée demandée dans ce niveau n’apparaît pas directement dans les tableaux du PDF, car aucun test retardé n’est montré. Elle est ajoutée pour corriger l’idée de disparition définitive et pour proposer l’expérience complémentaire logique.

## Comparer les deux séries d’extinction

Chez la souris, la lumière seule produit une flexion aux essais 10-13 puis aucune flexion aux essais 14-15. Chez le chien, la lumière seule donne 15, 13, 11, 9, 9, 2, 0, 0 gouttes aux essais 13-20. Le second tableau montre mieux la **courbe de décroissance** ; le premier ne donne qu’une réponse binaire.

Une mesure continue est plus informative qu’un simple oui/non : elle révèle que l’extinction peut être graduelle. Cependant, ni l’une ni l’autre expérience ne comprend un test après plusieurs heures ou jours. On ne peut donc pas y conclure « aucune récupération spontanée ».

## Caractère temporaire et caractère modifiable

Le corrigé dit que le réflexe conditionnel est temporaire et non stéréotypé. Il vaut mieux écrire : la RC est **acquise, modifiable, sensible au contexte et au renforcement**. Elle peut persister longtemps dans certains cas, diminuer dans d’autres et revenir après extinction. « Temporaire » ne signifie donc pas qu’elle possède toujours la même durée.

## Concevoir le test manquant

Après extinction, on laisse passer un délai sans SC ni SI, puis on présente le SC seul dans le même contexte. Si la RC réapparaît partiellement avant de rediminuer, on observe une récupération spontanée. On compare cette réponse à la fin de l’extinction et à la RC avant extinction.

> **Astuce mémoire — extinction ≠ effacement :** la réponse baisse, mais l’histoire d’apprentissage peut encore influencer le comportement futur.
`,
    keyPoint: "SC sans SI répété → extinction de la RC ; après un délai, son retour partiel est une récupération spontanée et prouve que l’apprentissage n’était pas simplement effacé.",
    example: "Le chien passe de 15 à 0 goutte sous lumière non renforcée ; un nouveau test demain pourrait produire quelques gouttes avant une nouvelle baisse.",
    methodSteps: [
      "Vérifie que le SC est présenté sans SI.",
      "Décris la baisse essai par essai sans parler d’effacement anatomique.",
      "Formule l’extinction comme un apprentissage SC-sans-SI.",
      "Ajoute un test retardé pour rechercher la récupération spontanée.",
    ],
    interaction: diagram(
      "Ce qui peut revenir après l’extinction",
      "Explore chaque phénomène et identifie la manipulation qui le révèle.",
      "RC devenue faible",
      "La fin visible de la réponse ne garantit pas la disparition de l’association initiale.",
      [
        { id: "extinction", label: "Extinction", role: "SC sans SI répété", detail: "Une nouvelle relation inhibitrice réduit progressivement la RC.", group: "Apprentissage 2" },
        { id: "spontaneous", label: "Récupération spontanée", role: "Passage du temps", detail: "Une RC peut réapparaître partiellement après un délai.", group: "Retour" },
        { id: "renewal", label: "Renouvellement", role: "Contexte changé", detail: "La mémoire d’extinction est souvent dépendante du contexte.", group: "Retour" },
        { id: "reinstatement", label: "Rétablissement", role: "SI présenté de nouveau", detail: "Le SI seul peut favoriser un retour contextuel de la RC.", group: "Retour" },
        { id: "reacquisition", label: "Réacquisition", role: "Nouveaux SC-SI", detail: "Le conditionnement peut revenir rapidement.", group: "Retour" },
        { id: "delayed-test", label: "Test retardé", role: "SC seul après repos", detail: "C’est la manipulation nécessaire pour observer la récupération spontanée.", group: "Protocole" },
      ],
      "L’extinction change la signification actuelle du SC sans supprimer nécessairement son histoire.",
    ),
    questions: [
      choice("Quelle procédure produit l’extinction ?", ["SC répété sans SI", "SI répété avec SC", "Aucun test", "SC toujours renforcé"], 0, "Le signal cesse d’être suivi de l’événement attendu."),
      choice("Comment évolue la salivation du chien aux essais 13-20 ?", ["Elle reste à 15", "Elle passe de 15 à 0", "Elle passe de 0 à 15", "Elle n’est pas mesurée"], 1, "La série montre une extinction graduelle.", "Situation 2 • pages 13-14"),
      choice("Que faut-il ajouter pour tester la récupération spontanée ?", ["Un tendon", "Une coupe histologique", "Un délai puis SC seul", "Une lumière permanente"], 2, "Le passage du temps définit ce phénomène."),
      choice("Quelle interprétation moderne convient ?", ["La glande disparaît", "Le SC devient SI", "Le cerveau n’apprend rien", "L’extinction implique un nouvel apprentissage inhibiteur"], 3, "La mémoire initiale peut rester disponible."),
      trueFalse("L’absence de RC à la fin de l’extinction prouve un effacement total.", false, "Des effets de retour montrent le contraire."),
      choice("Quel phénomène est le retour après passage du temps ?", ["Récupération spontanée", "Acquisition", "Habituation sensorielle uniquement", "RI"], 0, "Il se teste après un délai."),
      choice("Quel phénomène dépend d’un changement de contexte ?", ["Réarmement", "Renouvellement", "Dépolarisation", "Tétanos"], 1, "Une RC peut revenir hors du contexte d’extinction."),
      choice("Que montre mieux la mesure en gouttes ?", ["La couleur du chien", "Le nombre de neurones", "La décroissance graduelle de la RC", "Le volume du cerveau"], 2, "Une variable continue révèle l’évolution fine."),
      trueFalse("Une RC peut parfois persister longtemps malgré son caractère acquis.", true, "Acquis ne signifie pas forcément bref."),
      choice("Quel test contrôle une fatigue de la glande ?", ["Ne plus rien présenter", "Changer de tableau", "Présenter seulement un autre SC", "Présenter le SI et vérifier la RI"], 3, "Une RI intacte montre que l’effecteur fonctionne."),
      short("Comment appelle-t-on le retour partiel de la RC après un délai ?", ["récupération spontanée", "la récupération spontanée"], "Ce retour est compatible avec une mémoire initiale non effacée."),
    ],
    corrections: [
      "La « disparition de la liaison nerveuse » est corrigée : l’extinction correspond surtout à un nouvel apprentissage inhibiteur et contextuel.",
      "La récupération spontanée est ajoutée comme test décisif montrant que l’extinction n’équivaut pas à l’effacement.",
      "Le caractère « temporaire » est reformulé en réponse acquise, modifiable et sensible au contexte, dont la durée n’est pas universelle.",
    ],
  },
  {
    id: "generalization-discrimination",
    title: "Distinguer généralisation et discrimination",
    summary: "Expliquer pourquoi une réponse peut s’étendre à des signaux voisins ou rester spécifique, sans confondre apprentissage et espèce.",
    pages: "11-12",
    section: "Exercice 2 : éclairs colorés chez le chien et le chimpanzé",
    durationMinutes: 28,
    xp: 90,
    body: String.raw`
## Deux propriétés complémentaires

La **généralisation** est l’extension de la réponse conditionnée à des stimuli ressemblant au SC d’origine. Après conditionnement à une lumière blanche, un animal peut répondre à une lumière rouge, verte ou bleue si ces signaux sont perçus comme suffisamment proches.

La **discrimination** est la capacité à répondre différemment à des stimuli distincts, notamment lorsqu’un stimulus est renforcé et les autres non. Elle peut être apprise par entraînement différentiel. Généralisation et discrimination ne s’excluent pas absolument : un gradient de généralisation peut montrer une réponse forte près du SC et plus faible à mesure que les signaux s’en éloignent.

## Restituer les deux tableaux

Dans l’expérience 1, un chien conditionné avec un éclair blanc produit **10 gouttes en 30 secondes** à 12 h 00 pour le blanc, puis 10 à 12 h 15 pour le bleu, 10 à 12 h 30 pour le vert et 10 à 12 h 45 pour le rouge. Le tableau illustre une généralisation complète dans les quatre tests rapportés.

Dans l’expérience 2, un chimpanzé testé avec le même signal initial produit **10 gouttes** à 14 h 00 pour le blanc, **0** à 14 h 15 pour le bleu, **0** à 14 h 30 pour le vert, **10** à « 12 h 45 » pour le blanc et **0** à 15 h 00 pour le rouge. Le « 12 h 45 » rompt l’ordre 14 h 00, 14 h 15, 14 h 30, puis 15 h 00 : il s’agit probablement d’une coquille pour **14 h 45**.

Ce second tableau illustre une réponse spécifique au blanc, donc une discrimination dans les conditions décrites.

## Ne pas conclure « chien contre chimpanzé »

Le document compare un chien et un chimpanzé, mais il ne donne ni effectif, ni historique d’entraînement, ni contrôle perceptif, ni ordre contrebalancé. L’espèce est confondue avec toutes ces variables. On peut décrire **les résultats des deux individus ou expériences**, mais on ne peut pas conclure que tous les chiens généralisent et tous les chimpanzés discriminent.

Les horaires montrent aussi que les couleurs sont toujours testées dans le même ordre. Une extinction progressive ou une satiété pourrait affecter les réponses tardives. Pour isoler la couleur, il faudrait plusieurs animaux, un ordre randomisé, une intensité lumineuse comparable et des essais témoins.

## Construire un test de discrimination

On peut renforcer le blanc (SC+) par la nourriture et présenter les autres couleurs sans nourriture (SC−), avec un ordre aléatoire. Une discrimination est acquise si la RC reste forte au SC+ et diminue aux SC−. Le gradient est mesuré avec des lumières dont longueur d’onde, luminance et durée sont contrôlées.

> **Astuce mémoire — généraliser rapproche, discriminer sépare.** Décris d’abord la réponse, puis seulement le mécanisme d’apprentissage.
`,
    keyPoint: "Généralisation : RC aux signaux voisins ; discrimination : réponse sélective au SC+, apprise par renforcement différentiel.",
    example: "Dix gouttes pour blanc, bleu, vert et rouge illustrent une généralisation ; dix seulement pour blanc illustre une discrimination dans ce protocole.",
    methodSteps: [
      "Identifie le SC d’origine et la mesure de RC.",
      "Compare chaque stimulus test au SC sans changer d’unité.",
      "Nomme généralisation si la RC s’étend, discrimination si elle reste sélective.",
      "Recherche effectif, ordre et variables confondues avant toute conclusion d’espèce.",
    ],
    interaction: diagram(
      "Un blanc, plusieurs couleurs",
      "Compare les deux profils puis propose un protocole capable de séparer espèce, ordre et apprentissage.",
      "SC d’origine : lumière blanche",
      "La RC est comptée en gouttes de salive pendant 30 secondes.",
      [
        { id: "dog-white", label: "Chien : blanc", role: "10 gouttes", detail: "Le SC d’origine déclenche la RC attendue.", group: "Expérience 1" },
        { id: "dog-colors", label: "Chien : bleu/vert/rouge", role: "10/10/10", detail: "La réponse s’étend aux trois couleurs testées : généralisation observée.", group: "Expérience 1" },
        { id: "chimp-white", label: "Chimpanzé : blanc", role: "10 puis 10", detail: "La réponse au signal d’origine reste présente.", group: "Expérience 2" },
        { id: "chimp-colors", label: "Chimpanzé : bleu/vert/rouge", role: "0/0/0", detail: "La réponse est sélective au blanc dans ces essais.", group: "Expérience 2" },
        { id: "confound", label: "Confondants", role: "Espèce + protocole", detail: "Un seul sujet, horaire, ordre et entraînement empêchent une généralisation à l’espèce.", group: "Critique" },
        { id: "better", label: "Test amélioré", role: "Ordre randomisé", detail: "Plusieurs sujets, luminance contrôlée et renforcement différentiel isolent la discrimination.", group: "Critique" },
      ],
      "Les tableaux décrivent deux profils, mais ne démontrent pas une différence universelle entre espèces.",
    ),
    questions: [
      choice("Qu’est-ce que la généralisation ?", ["Une RC étendue à des stimuli proches du SC", "Une absence de toute réponse", "Une RI sans SI", "Une lésion"], 0, "L’effet du conditionnement s’étend à des signaux similaires."),
      choice("Qu’est-ce que la discrimination ?", ["Répondre à tout", "Répondre différemment selon le signal", "Supprimer le récepteur", "Changer le SI en RI"], 1, "L’organisme distingue le SC+ des signaux non renforcés."),
      choice("Combien de gouttes le chien produit-il pour chaque couleur testée ?", ["0", "15", "10", "Une valeur différente à chaque fois"], 2, "Le tableau 1 donne 10 partout.", "Exercice 2 • page 11"),
      choice("Quel profil décrit le chimpanzé ?", ["0 pour tout", "10 pour toutes les couleurs", "15 pour blanc", "10 pour blanc, 0 pour bleu/vert/rouge"], 3, "Le profil est sélectif au blanc."),
      trueFalse("Ces deux sujets suffisent pour conclure sur toutes les espèces chien et chimpanzé.", false, "Espèce, individu, entraînement et ordre sont confondus."),
      choice("Quelle heure du tableau est probablement une coquille ?", ["12 h 45, probablement 14 h 45", "14 h 00", "14 h 15", "15 h 00"], 0, "La série avance par quarts d’heure autour de 14-15 h."),
      choice("Quel protocole entraîne une discrimination ?", ["Renforcer toutes les couleurs", "Renforcer le blanc et non les autres couleurs", "Supprimer les tests", "Changer de mesure à chaque couleur"], 1, "Le blanc devient SC+ et les autres SC−."),
      choice("Quelle variable visuelle faut-il contrôler ?", ["Le nom du chien uniquement", "Le nombre de pages", "La luminance des éclairs", "La taille du tableau"], 2, "Des intensités différentes pourraient expliquer la réponse."),
      trueFalse("Généralisation et discrimination peuvent être représentées par un gradient de réponse.", true, "La réponse peut décroître avec la dissimilarité."),
      choice("Quelle conclusion est rigoureuse ?", ["Tous les chiens généralisent", "Tous les chimpanzés discriminent", "La couleur n’est jamais perçue", "Les deux expériences rapportent des profils différents dans leurs conditions"], 3, "Cette formulation reste limitée aux données."),
      short("Quel mot désigne l’extension de la RC à des couleurs voisines ?", ["généralisation", "la généralisation", "généralisation du stimulus"], "C’est la généralisation du stimulus."),
    ],
    corrections: [
      "L’heure « 12 h 45 » du second tableau est signalée comme probable coquille pour 14 h 45.",
      "La comparaison chien/chimpanzé n’est pas transformée en conclusion d’espèce : effectif, entraînement, perception et ordre sont confondus.",
      "Généralisation et discrimination sont reliées à un gradient et à un entraînement différentiel SC+/SC−.",
    ],
  },
  {
    id: "cortical-plasticity-neural-pathways",
    title: "Tracer les voies nerveuses et la plasticité",
    summary: "Reconstituer le trajet sensoriel-cortical-bulbaire et corriger le faux relais médullaire du schéma source.",
    pages: "4-6 et 12-14",
    section: "Mécanisme et trajet de l’influx nerveux",
    durationMinutes: 31,
    xp: 100,
    body: String.raw`
## Deux circuits se rencontrent

Avant apprentissage, la nourriture active les récepteurs gustatifs de la langue. Les messages afférents atteignent le tronc cérébral et des régions supérieures ; les **noyaux salivatoires** du tronc cérébral commandent la sécrétion par les voies autonomes. Le son active les récepteurs cochléaires et les voies auditives, mais ne recrute pas suffisamment cette commande salivaire.

Après conditionnement, la représentation auditive du SC peut activer les réseaux qui prédisent la nourriture et modulent la commande salivaire. Le PDF représente cela par une « nouvelle liaison nerveuse entre aire auditive et aire gustative ». C’est un modèle scolaire utile, mais pas un câble unique nouvellement fabriqué : l’apprentissage dépend de modifications de l’efficacité synaptique dans des réseaux distribués, incluant cortex et structures sous-corticales.

## Corriger le trajet efférent salivaire

Le document classe la moelle épinière comme « relais entre le cerveau et l’effecteur ». Pour la salivation crânienne, ce relais spinal n’est pas nécessaire. Les neurones préganglionnaires parasympathiques partent des noyaux salivatoires du tronc cérébral :

- noyau salivaire supérieur et **nerf facial VII** pour les glandes submandibulaires et sublinguales ;
- noyau salivaire inférieur et **nerf glossopharyngien IX** pour la parotide ;
- relais dans des ganglions autonomes périphériques, puis fibres postganglionnaires vers les glandes.

Les voies sympathiques peuvent aussi modifier la sécrétion, mais la salivation abondante de l’expérience est principalement expliquée par l’activation parasympathique.

## Le trajet auditif conditionné, étape par étape

Son → cellules ciliées de la cochlée → nerf cochléaire VIII → relais auditifs du tronc cérébral et thalamus → cortex auditif → réseaux associatifs appris → centres autonomes hypothalamiques/tronc cérébral → noyaux salivatoires → nerfs VII/IX et ganglions → glandes → salive.

Le mot « oreille interne » du tableau peut servir de récepteur macroscopique, mais le véritable transducteur est la **cellule ciliée cochléaire**. De même, « neurone moteur » est trop somatique : les voies sécrétoires sont des neurones autonomes préganglionnaires et postganglionnaires.

## Résoudre le classement a-i

La correction source place : récepteur **i** oreille interne ; structures nerveuses **a, e, f, h** (neurone d’association, nouvelle liaison, neurone moteur, neurone sensitif) ; centres **c, b, d** (aire auditive, bulbe rachidien, aire gustative) ; effecteur **g** glandes salivaires. Cette réponse est restituée pour l’exercice, puis précisée par les voies modernes ci-dessus.

## Variante visuelle

Pour la lumière blanche, le trajet commence par la rétine et le nerf optique, atteint les réseaux visuels et associatifs, puis converge vers la commande salivaire du tronc cérébral. Le corrigé source écrit « fibres gustatives » entre aire gustative et centre salivaire ; il s’agit plutôt d’une influence descendante centrale, non de fibres gustatives afférentes allant du cortex vers le bulbe.

> **Astuce mémoire — perception, prédiction, commande :** le cortex identifie le signal et sa valeur apprise ; le tronc cérébral organise la sortie autonome.
`,
    keyPoint: "Le SC est traité par les voies sensorielles et réseaux plastiques ; la commande salivaire finale vient des noyaux du tronc cérébral via les voies autonomes VII/IX, sans relais spinal obligatoire.",
    example: "Une lumière conditionnée suit rétine → nerf optique → réseaux visuels/associatifs → noyaux salivatoires → voies autonomes → glandes.",
    methodSteps: [
      "Pars du récepteur sensoriel spécifique au SC.",
      "Suis la voie afférente vers le cortex et les réseaux associatifs.",
      "Fais converger la prédiction vers les noyaux salivatoires du tronc cérébral.",
      "Termine par les voies autonomes VII/IX, ganglions et glandes.",
    ],
    interaction: diagram(
      "Du son à la salive, sans faux relais",
      "Explore chaque station et distingue voie sensorielle, plasticité et commande autonome.",
      "Son conditionnel",
      "Le signal auditif appris influence la sécrétion par des réseaux centraux puis des voies autonomes crâniennes.",
      [
        { id: "cochlea", label: "Cellules ciliées", role: "Récepteurs", detail: "Elles transforment les vibrations en messages nerveux auditifs.", group: "Afférence" },
        { id: "viii", label: "Nerf VIII", role: "Voie auditive", detail: "La branche cochléaire conduit vers les relais du tronc cérébral.", group: "Afférence" },
        { id: "auditory", label: "Réseaux auditifs", role: "Perception du SC", detail: "Le cortex et ses relais représentent le son conditionné.", group: "Centre" },
        { id: "plasticity", label: "Réseaux associatifs", role: "Prédiction apprise", detail: "La plasticité modifie l’influence du SC sur les systèmes liés au SI.", group: "Centre" },
        { id: "salivatory", label: "Noyaux salivatoires", role: "Tronc cérébral", detail: "Ils intègrent les influences centrales et commandent les neurones préganglionnaires.", group: "Commande" },
        { id: "vii-ix", label: "Nerfs VII et IX", role: "Voies parasympathiques", detail: "Avec leurs ganglions, ils atteignent les principales glandes salivaires.", group: "Efférence" },
        { id: "glands", label: "Glandes salivaires", role: "Effecteurs", detail: "Les cellules acineuses sécrètent la salive mesurée.", group: "Réponse" },
      ],
      "La moelle épinière n’est pas le relais obligatoire de cette commande crânienne.",
    ),
    questions: [
      choice("Quel élément est classé récepteur dans l’exercice a-i ?", ["i : oreille interne", "g : glandes", "b : bulbe", "f : neurone moteur"], 0, "C’est la réponse source, précisée par les cellules ciliées.", "Activité • pages 5-6"),
      choice("Quels éléments sont classés structures nerveuses ?", ["b,c,d", "a,e,f,h", "g uniquement", "i uniquement"], 1, "Le corrigé source donne a, e, f et h."),
      choice("Quels éléments sont classés centres nerveux ?", ["a,e,f,h", "g,i", "c,b,d", "aucun"], 2, "Aire auditive, bulbe et aire gustative."),
      choice("Quel élément est l’effecteur ?", ["L’oreille", "Le cortex", "Le nerf VIII", "g : glandes salivaires"], 3, "Les glandes produisent la réponse."),
      trueFalse("La moelle épinière est un relais obligatoire entre cerveau et glandes salivaires.", false, "La commande principale passe par le tronc cérébral et les nerfs crâniens."),
      choice("Quel nerf participe à la commande submandibulaire/sublinguale ?", ["VII facial", "II optique", "VIII cochléaire", "XII hypoglosse seul"], 0, "Les fibres préganglionnaires viennent du noyau salivaire supérieur via VII."),
      choice("Quel nerf participe à la commande de la parotide ?", ["I olfactif", "IX glossopharyngien", "VI abducens", "XI accessoire"], 1, "Le noyau salivaire inférieur emprunte IX."),
      choice("Quelle cellule est le transducteur auditif précis ?", ["Une glande", "Un globule rouge", "La cellule ciliée cochléaire", "Un tendon"], 2, "L’oreille interne est un organe, la cellule ciliée est le récepteur."),
      trueFalse("La « nouvelle liaison » doit être comprise comme une plasticité de réseaux plutôt qu’un câble unique.", true, "L’apprentissage modifie des efficacités synaptiques distribuées."),
      choice("Pourquoi « fibres gustatives » descendantes est-il trompeur ?", ["Le goût n’existe pas", "Le bulbe est un muscle", "Les glandes sont sensorielles", "Les fibres gustatives sont afférentes ; ici il s’agit d’une influence centrale descendante"], 3, "Le sens anatomique du message doit être respecté."),
      short("Cite les deux nerfs crâniens salivaires principaux attendus.", ["VII et IX", "7 et 9", "nerfs facial et glossopharyngien", "facial et glossopharyngien"], "VII commande surtout submandibulaire/sublinguale et IX la parotide."),
    ],
    corrections: [
      "La moelle épinière est retirée comme relais obligatoire de la salivation ; la commande passe par les noyaux salivatoires du tronc cérébral et les nerfs VII/IX.",
      "La « nouvelle liaison aire auditive-aire gustative » est conservée comme modèle scolaire mais actualisée en plasticité de réseaux distribués.",
      "Les « fibres gustatives » descendantes sont corrigées en influence centrale vers les noyaux salivatoires ; les voies gustatives sont afférentes.",
      "L’oreille interne est précisée par les cellules ciliées cochléaires et le « neurone moteur » par une voie autonome à deux neurones.",
    ],
  },
  {
    id: "conditioned-reflex-applications-limits",
    title: "Appliquer le modèle sans le généraliser à tort",
    summary: "Mobiliser le conditionnement en éducation et santé tout en distinguant apprentissage pavlovien, opérant, habitudes et limites éthiques.",
    pages: "3 et 8-9",
    section: "Applications, activités 1-3 et limites",
    durationMinutes: 28,
    xp: 110,
    body: String.raw`
## À quoi sert le modèle ?

Le conditionnement classique aide à comprendre des réponses anticipatrices : saliver à un signal alimentaire, accélérer le rythme cardiaque face à un contexte associé au stress, ou ressentir une nausée à une odeur précédemment associée à un malaise. Il est utilisé pour étudier apprentissage, émotions et adaptation. Dans certains soins, des procédures d’exposition cherchent à construire un nouvel apprentissage de sécurité ; elles ne se résument pas à « effacer » une peur.

Le PDF mentionne dressage, automatisme et éducation. Ces domaines utilisent souvent plusieurs mécanismes. Le **conditionnement opérant** concerne les conséquences d’un comportement ; l’apprentissage procédural concerne les habiletés ; le conditionnement classique concerne surtout l’association entre signaux et événements. Une récompense donnée après une action relève davantage de l’opérant que du schéma SN-SI de Pavlov.

## Corriger les quatre items de l’activité 1

1. Stimulus neutre : **b**, il n’apporte pas naturellement la réponse attendue.
2. Réflexe inné : la source retient **c**, « a pour centre la moelle épinière ». Cette réponse ne vaut que pour le réflexe spinal visé ; elle ne définit pas tous les réflexes innés.
3. Stimulus absolu : **b**, il provoque la réponse inconditionnelle dans l’expérience, sans apprentissage SN-SI.
4. Réflexe conditionnel : **c**, il est obtenu à la suite d’un apprentissage.

## Restituer l’activité 2

1. Mise en place du réflexe conditionnel : **a**, elle nécessite ici le cerveau et les réseaux d’apprentissage.
2. Aires impliquées : **c**, dans les hémisphères cérébraux selon le modèle source.
3. Organes sensoriels de Pavlov : **c**, langue et oreille.
4. Nouvelles connexions après apprentissage : **b**, dans le cerveau.

Ces réponses sont celles de l’exercice officiel. Elles sont accompagnées des précisions du niveau précédent : l’arc salivaire final est bulbaire et autonome, et la plasticité n’est pas limitée à une unique connexion corticale.

## Restituer l’activité 3

La correspondance fidèle est **1-B ; 2-D ; 3-C ; 4-A** : acquisition = réponse au stimulus devenu conditionnel ; extinction = réponse qui diminue ; début = indifférence au SN ; apprentissage = réactions pendant les appariements. Il est plus rigoureux de dire que, durant les appariements, la réponse observée peut inclure la RI au SI.

## Limites et responsabilité

Un résultat de laboratoire ne justifie pas de manipuler une personne à son insu. En contexte humain, consentement, confidentialité et proportionnalité sont essentiels. Pour les animaux, les principes de remplacement, réduction et raffinement encadrent les protocoles. Les décharges électriques et restrictions du document sont analysées comme exemples historiques ; l’élève n’est pas invité à les reproduire.

Enfin, une association n’implique pas une fatalité. Les réponses apprises dépendent du contexte, peuvent être discriminées, inhibées ou remplacées par de nouveaux apprentissages.

> **Astuce mémoire — Pavlov prédit, opérant produit :** en classique, un signal prédit ; en opérant, un comportement produit une conséquence.
`,
    keyPoint: "Le conditionnement classique explique des réponses à des signaux prédictifs, mais ne remplace ni l’apprentissage opérant/procédural ni les exigences éthiques.",
    example: "Une sonnerie associée au repas peut devenir SC ; féliciter un élève après une tâche réussie est plutôt une conséquence opérante.",
    methodSteps: [
      "Repère si deux stimuli sont associés ou si une conséquence suit un comportement.",
      "Restitue les réponses officielles puis ajoute la limite scientifique nécessaire.",
      "Évite de transformer une observation individuelle en règle universelle.",
      "Vérifie consentement, bien-être et proportionnalité avant toute application réelle.",
    ],
    interaction: diagram(
      "Choisir le bon modèle d’apprentissage",
      "Explore chaque situation et décide ce que Pavlov explique, ce qu’il n’explique pas seul et quelle limite s’impose.",
      "Comportement appris",
      "Un résultat observable peut combiner plusieurs mécanismes d’apprentissage.",
      [
        { id: "signal", label: "Signal → événement", role: "Conditionnement classique", detail: "Un stimulus apprend à prédire un SI et déclenche une RC.", group: "Modèle" },
        { id: "consequence", label: "Action → conséquence", role: "Conditionnement opérant", detail: "La fréquence d’un comportement dépend de ses conséquences.", group: "Modèle" },
        { id: "skill", label: "Habileté motrice", role: "Apprentissage procédural", detail: "Conduite et nage mobilisent pratique, correction et automatisation complexe.", group: "Modèle" },
        { id: "therapy", label: "Exposition", role: "Nouvel apprentissage", detail: "La sécurité apprise peut inhiber une ancienne réponse sans effacer toute mémoire.", group: "Application" },
        { id: "human", label: "Sujet humain", role: "Consentement", detail: "L’application exige information, respect et protection des données.", group: "Éthique" },
        { id: "animal", label: "Animal", role: "3R", detail: "Remplacer, réduire et raffiner les expériences pour limiter la souffrance.", group: "Éthique" },
      ],
      "Le modèle de Pavlov est puissant lorsqu’on respecte son domaine et ses limites.",
    ),
    questions: [
      choice("Quelle réponse officielle convient à l’activité 1, item 1 ?", ["b", "a", "c", "aucune"], 0, "Un SN n’apporte pas naturellement la réponse attendue.", "Activité 1 • page 8"),
      choice("Quelle réponse source est retenue à l’item 2, avec une limite ?", ["a", "c", "b", "aucune"], 1, "c convient au réflexe spinal visé, pas à tous les réflexes innés."),
      choice("Quelle réponse convient à l’item 3 ?", ["a", "c", "b", "a et c"], 2, "Le stimulus absolu provoque la RI indépendamment de l’apprentissage étudié."),
      choice("Quelle réponse convient à l’item 4 ?", ["a", "b", "a et b", "c"], 3, "La réponse conditionnée résulte d’un apprentissage."),
      choice("Activité 2 : où se situent les aires du modèle source ?", ["Dans les hémisphères cérébraux", "Dans les tendons", "Dans les glandes", "Dans les os"], 0, "La réponse officielle est 2-c.", "Activité 2 • pages 8-9"),
      choice("Quels organes sensoriels interviennent dans Pavlov ?", ["Nez et peau", "Langue et oreille", "Œil et peau", "Rein et langue"], 1, "La source retient la langue pour la viande et l’oreille pour le son."),
      choice("Quelle correspondance de l’activité 3 est correcte ?", ["1-A", "1-C", "1-B", "1-D"], 2, "Acquisition = réponse au stimulus devenu conditionnel.", "Activité 3 • page 9"),
      choice("Quelle correspondance décrit l’extinction ?", ["2-A", "2-B", "2-C", "2-D"], 3, "D décrit la diminution puis l’absence de réponse."),
      trueFalse("Une récompense après une action relève toujours du conditionnement classique.", false, "Cette relation comportement-conséquence est généralement opérante."),
      choice("Quel principe éthique concerne les animaux ?", ["Remplacer, réduire, raffiner", "Multiplier toute souffrance", "Supprimer toute mesure", "Cacher le protocole"], 0, "Les 3R guident la recherche animale."),
      short("Donne la correspondance complète de l’activité 3.", ["1-B 2-D 3-C 4-A", "1B 2D 3C 4A", "1-B;2-D;3-C;4-A"], "C’est le corrigé officiel du tableau."),
    ],
    corrections: [
      "La réponse 2-c de l’activité 1 est conservée comme réponse du réflexe spinal visé, mais n’est pas généralisée à tous les réflexes innés.",
      "Les réponses officielles des activités 1, 2 et 3 sont toutes restituées avec leurs limites anatomiques et expérimentales.",
      "Dressage, éducation et automatismes sont séparés en conditionnements classique/opérant et apprentissage procédural.",
      "Les protocoles humains et animaux sont replacés dans un cadre de consentement, bien-être et principes des 3R.",
    ],
  },
  {
    id: "conditioned-reflex-final-mission",
    title: "Mission finale : résoudre toutes les évaluations",
    summary: "Traiter les situations sifflet-nourriture, souris, couleurs et vingt essais avec une rédaction complète, critique et corrigée.",
    pages: "6-14",
    section: "Situation d’évaluation, exercices et situations 1-2",
    durationMinutes: 48,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## Dossier A — nourriture et sifflet

La nourriture est un **SI** et le sifflet est initialement un **SN**. A : nourriture → salivation RI. B : sifflet seul → pas de salivation. C : sifflet + nourriture répétés → salivation et acquisition. D : sifflet seul après apprentissage → salivation RC ; le sifflet est devenu SC. Pour rédiger, distingue l’observation de l’explication et mentionne que la preuve de la RC se trouve en D.

## Dossier B — les quinze essais de la souris

La lumière seule à l’essai 1 ne fléchit pas la patte : SN. Le courant seul aux essais 2-4 produit la flexion : SI → RI. Les essais **5-9** associent lumière puis courant. Les essais **10-13** présentent la lumière seule avec flexion : SC → RC. Aux essais 14-15, la lumière seule ne produit plus de flexion : extinction apparente. Le corrigé source écrit une fois 5-10 ; le tableau impose 5-9.

Deux caractéristiques peuvent être dégagées : la réponse est **acquise et modifiable** ; elle dépend du renforcement/contexte et peut s’éteindre. « Non stéréotypée » signifie ici moins immuable que la réponse inconditionnelle, pas totalement aléatoire.

## Dossier C — généraliser ou discriminer

Le chien produit 10 gouttes en 30 s pour blanc, bleu, vert et rouge : généralisation dans cette série. Le chimpanzé produit 10 pour le blanc et 0 pour bleu, vert et rouge : discrimination dans cette série. L’heure « 12 h 45 » du second tableau est probablement **14 h 45**. Il est interdit de conclure à une loi d’espèce avec un sujet par condition et sans protocole comparatif contrôlé.

Le trajet de la lumière conditionnée est : rétine → nerf optique → voies et cortex visuels → réseaux associatifs plastiques → noyaux salivatoires du tronc cérébral → voies autonomes crâniennes VII/IX et ganglions → glandes → salive. La moelle n’est pas le relais obligatoire de cette réponse crânienne.

## Dossier D — vingt essais chez le chien

Les essais 1-3 lumière seule donnent 0 goutte ; 4-5 viande seule donnent 15 ; 6-12 lumière + viande donnent 15 ; 13-20 lumière seule donnent **15, 13, 11, 9, 9, 2, 0, 0**. La lumière devient SC après sept appariements, puis la RC diminue pendant l’extinction.

Pour tester une récupération spontanée, attends un délai sans stimulation puis présente de nouveau la lumière seule. Pour exclure un épuisement des glandes, présente la viande et vérifie le retour de la RI.

## Modèle de réponse longue

« Au départ, la lumière blanche seule ne provoque aucune goutte : elle est neutre pour la salivation. La viande seule provoque quinze gouttes : elle est SI et la salivation RI. Après sept appariements, la lumière seule provoque quinze gouttes : elle est devenue SC et déclenche une RC. Sous présentations non renforcées, la RC diminue jusqu’à zéro : c’est l’extinction. Cette baisse ne prouve pas un effacement ; un test retardé peut révéler une récupération spontanée. Le signal lumineux est traité par les voies visuelles et des réseaux associatifs, puis influence les noyaux salivatoires du tronc cérébral, dont la commande autonome atteint les glandes via les nerfs crâniens. »

## Grille de maîtrise

Une réponse complète contient : nature des stimuli ; analyse chiffrée par périodes ; mécanisme d’acquisition ; distinction RI/RC ; extinction sans effacement ; trajet nerveux corrigé ; limite expérimentale ou éthique. Les quatre verbes de consigne ne sont pas synonymes : **donner** nomme, **analyser** compare, **expliquer** relie au mécanisme, **déduire** généralise prudemment.

> **Mission Davy :** pour chaque document, écris d’abord une phrase sans « car » pour le résultat, puis une phrase avec « car » pour l’interprétation.
`,
    keyPoint: "Analyser = périodes et chiffres ; expliquer = SN/SI puis SC/RC ; déduire = acquisition, plasticité, extinction et limites sans surinterprétation.",
    example: "Essais 13-20 : lumière seule, 15→0 goutte ; j’observe une baisse de RC et je l’explique par des essais non renforcés produisant l’extinction.",
    methodSteps: [
      "Recopie les périodes exactes avant toute interprétation.",
      "Nomme SN/SI/RI puis SC/RC pour chaque dossier.",
      "Sépare acquisition, test, renforcement et extinction.",
      "Trace le trajet sensoriel, associatif puis autonome sans relais médullaire fictif.",
      "Termine par une limite de protocole et l’expérience complémentaire pertinente.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Données officielles redessinées",
      title: "Acquisition puis extinction sur vingt essais",
      instruction: "Déplace le repère d’un essai entier à l’autre et lis le nombre de gouttes recueillies en 30 secondes.",
      observation: "Les essais 6 à 12 associent lumière et viande et maintiennent 15 gouttes. L’essai 13 teste la lumière seule : la réponse conditionnée est encore maximale. Sans renforcement, elle décroît ensuite de 13 à 0 goutte aux essais 14 à 20 : c’est l’extinction, non un effacement démontré de l’apprentissage.",
      formula: "Nombre de gouttes de salive par 30 s",
      formulaTex: "N_{\\mathrm{salive}}(n)",
      rule: {
        kind: "samples",
        points: [
          [1, 0], [2, 0], [3, 0], [4, 15], [5, 15],
          [6, 15], [7, 15], [8, 15], [9, 15], [10, 15], [11, 15], [12, 15], [13, 15],
          [14, 13], [15, 11], [16, 9], [17, 9], [18, 2], [19, 0], [20, 0],
        ],
      },
      window: { xMin: 1, xMax: 20, yMin: 0, yMax: 16 },
      guides: [
        { kind: "vertical", value: 6, label: "Association : essais 6–12" },
        { kind: "vertical", value: 13, label: "Test puis extinction : essais 13–20" },
      ],
      marker: { min: 1, max: 20, step: 1, initial: 13 },
    },
    questions: [
      choice("Dossier A : quelle est la nature de la nourriture ?", ["SI ou stimulus absolu", "SN", "RC", "SC"], 0, "Elle déclenche la RI sans conditionnement sifflet-nourriture.", "Situation • pages 6-7"),
      choice("Dossier A : quelle est la nature initiale du sifflet ?", ["SI", "SN", "RI", "Effecteur"], 1, "Il ne fait pas saliver en B."),
      choice("Dossier A : quelle figure démontre la RC ?", ["A", "B", "D", "C seule"], 2, "En D, le sifflet seul déclenche la salivation."),
      choice("Dossier B : quelle période est l’association exacte ?", ["2-4", "10-13", "14-15", "5-9"], 3, "Le courant est présent avec la lumière seulement jusqu’à 9.", "Situation 1 • pages 9-11"),
      choice("Dossier B : que montrent les essais 10-13 ?", ["RC à la lumière seule", "RI au courant seul", "Absence de stimulus", "Généralisation colorée"], 0, "La lumière est devenue SC."),
      choice("Dossier B : que montrent 14-15 ?", ["Acquisition", "Extinction apparente", "RI", "Réflexe pupillaire"], 1, "La flexion n’est plus observée sous lumière seule."),
      choice("Dossier C : quel profil montre le chien ?", ["Discrimination parfaite", "Aucune réponse", "Généralisation aux couleurs testées", "Extinction"], 2, "Il produit 10 gouttes pour chaque couleur."),
      choice("Dossier C : quel profil montre le chimpanzé ?", ["10 pour tout", "15 pour rouge", "Aucune réponse au blanc", "Réponse au blanc seulement"], 3, "Le tableau illustre une discrimination dans ces conditions."),
      choice("Quelle heure est probablement corrigée en 14 h 45 ?", ["12 h 45", "14 h 00", "14 h 15", "15 h 00"], 0, "L’horaire source brise la séquence par quarts d’heure."),
      choice("Dossier D : combien de gouttes aux essais 1-3 ?", ["15", "0", "13", "2"], 1, "La lumière est initialement neutre.", "Situation 2 • pages 13-14"),
      choice("Dossier D : quels essais présentent la viande seule ?", ["1-3", "6-12", "4-5", "13-20"], 2, "Ils établissent SI → RI."),
      choice("Dossier D : quels essais sont renforcés lumière + viande ?", ["4-5", "13-20", "1-3", "6-12"], 3, "Sept appariements sont réalisés."),
      choice("Quelle suite décrit les huit tests lumière seule finaux ?", ["15,13,11,9,9,2,0,0", "0,0,0,15,15,15,15,15", "15 huit fois", "0 huit fois"], 0, "La RC s’éteint graduellement."),
      choice("Quel test recherche une récupération spontanée ?", ["SI immédiat", "SC seul après un délai", "Aucun stimulus pour toujours", "Changer l’effecteur"], 1, "Le retour après passage du temps définit ce phénomène."),
      choice("Quel test contrôle l’épuisement des glandes ?", ["SC encore dix fois", "Changer de couleur", "Présenter la viande et mesurer la RI", "Supprimer le récipient"], 2, "Une salivation à la viande montre que l’effecteur fonctionne."),
      choice("Quel centre commande finalement la sécrétion ?", ["La moelle comme relais obligatoire", "Le tendon", "Le cortex moteur spinal", "Les noyaux salivatoires du tronc cérébral"], 3, "Ils envoient les sorties autonomes."),
      choice("Quels nerfs portent surtout les voies parasympathiques salivaires ?", ["VII et IX", "I et II", "III et IV", "XI et XII uniquement"], 0, "Facial pour submandibulaire/sublinguale et glossopharyngien pour parotide."),
      trueFalse("L’extinction prouve la destruction définitive de l’association.", false, "La réponse peut revenir spontanément ou avec le contexte."),
      trueFalse("Un chien et un chimpanzé suffisent pour établir une différence d’espèce.", false, "Le protocole manque d’effectif et de contrôles comparables."),
      short("Donne la segmentation exacte des quinze essais de la souris.", ["1; 2-4; 5-9; 10-13; 14-15", "1 2-4 5-9 10-13 14-15"], "C’est la lecture exacte des symboles du tableau."),
      short("Donne la série des huit nombres de gouttes pendant l’extinction du chien.", ["15 13 11 9 9 2 0 0", "15,13,11,9,9,2,0,0"], "Les essais 13 à 20 montrent cette décroissance."),
    ],
    corrections: [
      "Toutes les situations et activités des pages 6 à 14 sont réinvesties : A-D, QCM, classement, souris, couleurs et vingt essais.",
      "La période d’appariement de la souris est fixée à 5-9, conformément au tableau, malgré le 5-10 fautif du corrigé.",
      "L’heure 12 h 45 du tableau du chimpanzé est signalée comme probable 14 h 45.",
      "La comparaison chien/chimpanzé est limitée aux expériences rapportées et ne devient pas une conclusion d’espèce.",
      "Le trajet final utilise les noyaux salivatoires du tronc cérébral et les voies VII/IX, sans relais médullaire obligatoire.",
      "L’extinction est distinguée d’un effacement et complétée par le test de récupération spontanée.",
    ],
  },
];

const orderedLevelIds = [
  "reflex-response-foundations",
  "pavlov-conditioning-experiment",
  "conditioned-reflex-acquisition",
  "temporal-association-repetition",
  "reinforcement-conditioning-maintenance",
  "extinction-spontaneous-recovery",
  "generalization-discrimination",
  "cortical-plasticity-neural-pathways",
  "conditioned-reflex-applications-limits",
  "conditioned-reflex-final-mission",
] as const;

const seedById = new Map(levels.map((seed) => [seed.id, seed]));
const builtLevels = orderedLevelIds.map((id, index) => {
  const seed = seedById.get(id);
  if (!seed) throw new Error(`Niveau du réflexe conditionnel introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalDSvtConditionedReflexPath: LearningPath = {
  id: "terminale-d-svt-l1-conditioned-reflex",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "La communication dans l’organisme" },
  chapterNumber: 1,
  title: "Le réflexe conditionnel",
  description: "Le cours officiel intégral hors situation d’apprentissage, de Pavlov à l’extinction et la discrimination, avec dix interactions originales, toutes les évaluations et des corrections neurophysiologiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer SN, SI, RI, SC et RC dans un protocole de conditionnement",
    "Analyser acquisition, renforcement, extinction, récupération, généralisation et discrimination",
    "Tracer les voies sensorielles, associatives et autonomes de la salivation",
    "Résoudre les activités et situations officielles en évaluant leurs limites",
  ],
  modules: [
    {
      id: "conditioned-reflex-mastery",
      title: "Maîtriser le réflexe conditionnel",
      description: "Dix niveaux progressifs, des notions fondamentales à la mission de synthèse sur les quatre dossiers officiels.",
      lessons: builtLevels,
    },
  ],
};
