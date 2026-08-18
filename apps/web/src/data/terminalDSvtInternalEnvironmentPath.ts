import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  LessonSourceMetadata,
  SchemaHotspot,
  SchemaShape,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "SVT TD_L5_Le maintien de la constance du milieu intérieur (4).pdf";

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

type QuestionRow = readonly [
  prompt: string,
  correctAnswer: string,
  distractors: readonly [string, string, string],
  explanation: string,
  sourceLabel: string,
];

const balancedChoice = (row: QuestionRow, ordinal: number): LessonQuestion => {
  const correctIndex = ordinal % 4;
  const options = [...row[2]];
  options.splice(correctIndex, 0, row[1]);
  return choice(row[0], options, correctIndex, row[3], row[4]);
};

const questions = (
  firstOrdinal: number,
  rows: QuestionRow[],
  shortQuestion: LessonQuestion,
): LessonQuestion[] => [...rows.map((row, index) => balancedChoice(row, firstOrdinal + index)), shortQuestion];

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
  eyebrow: "Carte à explorer",
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
  eyebrow: "Démarche à dérouler",
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
      eyebrow: "Méthode physiologique",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Décris d’abord les compartiments et les mesures, puis distingue transport, capteur, signal hormonal et réponse rénale avant de fermer la boucle de régulation.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : une régulation se raconte comme une boucle — perturbation, capteur, intégrateur, signal, effecteur, correction.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const nephronShapes: SchemaShape[] = [
  { shape: "path", d: "M150 95 C85 115 85 220 155 235 C210 245 245 190 220 145 C205 115 180 100 150 95 Z", tone: "soft" },
  { shape: "circle", cx: 155, cy: 165, r: 42, tone: "accent" },
  { shape: "path", d: "M195 178 C275 180 260 260 330 260 C385 260 375 340 420 340 C465 340 455 210 520 210 C575 210 575 285 630 285", tone: "outline" },
  { shape: "path", d: "M330 260 L330 410 C330 455 410 455 410 410 L410 338", tone: "outline" },
  { shape: "line", x1: 630, y1: 130, x2: 630, y2: 440, tone: "accent" },
  { shape: "text", x: 385, y: 485, content: "Trajet tubulaire original — proportions volontairement schématiques", anchor: "middle" },
];

const nephronHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "glomerulus", number: 1, label: "Glomérule", x: 155, y: 165, detail: "Peloton capillaire où la pression produit un ultrafiltrat pauvre en cellules et grosses protéines." },
  { id: "bowman", number: 2, label: "Capsule de Bowman", x: 205, y: 130, detail: "Elle recueille l’ultrafiltrat glomérulaire, appelé urine primitive dans le document." },
  { id: "proximal", number: 3, label: "Tube proximal", x: 270, y: 225, detail: "Lieu majeur de réabsorption iso-osmotique : eau, Na⁺, bicarbonate, glucose et acides aminés." },
  { id: "henle", number: 4, label: "Anse de Henlé", x: 368, y: 430, detail: "Ses branches ont des perméabilités différentes et participent au gradient osmotique médullaire." },
  { id: "distal", number: 5, label: "Tube distal", x: 520, y: 210, detail: "Il affine Na⁺, K⁺, H⁺ et le pH sous contrôle local et hormonal." },
  { id: "collector", number: 6, label: "Canal collecteur", x: 630, y: 285, detail: "Il reçoit plusieurs néphrons ; l’ADH y règle AQP2 et donc la perméabilité à l’eau." },
];

const missionShapes: SchemaShape[] = [
  { shape: "path", d: "M45 90 H205 V180 H45 Z", tone: "soft" },
  { shape: "path", d: "M270 90 H430 V180 H270 Z", tone: "accent" },
  { shape: "path", d: "M495 90 H655 V180 H495 Z", tone: "soft" },
  { shape: "path", d: "M720 90 H910 V180 H720 Z", tone: "accent" },
  { shape: "path", d: "M205 135 L270 135 M430 135 L495 135 M655 135 L720 135", tone: "outline" },
  { shape: "path", d: "M815 180 C815 320 580 340 350 300 C170 270 120 220 120 180", tone: "outline" },
  { shape: "text", x: 478, y: 385, content: "Une réponse efficace réduit la perturbation initiale : rétroaction négative", anchor: "middle" },
];

const missionHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "disturbance", number: 1, label: "Perturbation", x: 125, y: 135, detail: "Hémorragie, charge hydrique, excès de NaCl ou acidification changent volume, osmolarité ou pH." },
  { id: "sensors", number: 2, label: "Capteurs", x: 350, y: 135, detail: "Osmorécepteurs hypothalamiques, volorécepteurs, macula densa et cellules juxtaglomérulaires fournissent des indices distincts." },
  { id: "signals", number: 3, label: "Signaux", x: 575, y: 135, detail: "ADH, rénine–angiotensine–aldostérone et sympathique coordonnent eau, Na⁺ et pression." },
  { id: "kidney", number: 4, label: "Réponse rénale", x: 815, y: 135, detail: "Filtration et transports tubulaires règlent le débit, l’osmolarité, les électrolytes et l’équilibre acido-basique." },
  { id: "feedback", number: 5, label: "Retour correcteur", x: 478, y: 315, detail: "La variable revient vers sa plage compatible avec le fonctionnement cellulaire sans devenir absolument constante." },
];

const levels: LevelSeed[] = [
  {
    id: "renal-homeostasis-architecture",
    title: "Situer le rein dans l’homéostasie",
    summary: "Relier milieu intérieur, organisation du rein et fonction osmorégulatrice sans reproduire les inversions anatomiques de la source.",
    pages: "1-2",
    section: "Introduction et structure générale du rein",
    durationMinutes: 28,
    xp: 45,
    body: String.raw`
## Une leçon, trois numérotations

Le fichier source porte le repère **L5**, sa couverture affiche **« LEÇON 8 »**, tandis que la progression annuelle officielle 2025-2026 place « Le maintien de la constance du milieu intérieur » en **dixième position globale** de Terminale D. Le parcours conserve donc le chapitre 10 et ne déplace aucune carte du catalogue. Ces repères appartiennent à des systèmes de classement incompatibles ; le titre scientifique, lui, reste identique.

Le **milieu intérieur** désigne surtout les liquides extracellulaires qui baignent ou relient les cellules : plasma, liquide interstitiel et lymphe. Leur volume et leur composition varient légèrement, mais doivent rester dans des plages compatibles avec l’activité cellulaire. L’**homéostasie** n’est donc pas l’immobilité : c’est une stabilité dynamique obtenue par des échanges et des rétroactions.

## L’architecture rénale corrigée

Chaque rein reçoit le sang par une artère rénale et le restitue par une veine rénale. L’urine quitte le bassinet par l’uretère. Sur une coupe longitudinale, le **cortex** est périphérique ; la **médulla** est plus interne et contient les pyramides rénales dont les papilles débouchent vers les calices puis le pelvis rénal. La page 2 inverse ces repères en plaçant le bassinet au centre de la médulla et les pyramides dans le cortex : on corrige explicitement cette formulation.

Le cortex renferme tous les corpuscules rénaux et de nombreux segments contournés. Les anses de Henlé et les canaux collecteurs plongent plus ou moins profondément dans la médulla. Cette organisation corticomedullaire permet à la fois l’ultrafiltration du plasma, les échanges tubulaires et la concentration variable de l’urine.

## Une fonction osmorégulatrice intégrée

Le rein ne fabrique pas seulement un déchet liquide. Il ajuste l’excrétion d’eau, de Na⁺, de K⁺, de H⁺, d’urée et d’autres solutés. En modulant ces sorties, il participe au maintien de l’osmolarité, du volume extracellulaire, de la pression artérielle et du pH. Les poumons, le foie, la peau et les systèmes hormonaux coopèrent avec lui : attribuer à un seul organe toute l’homéostasie serait excessif.

Une insuffisance rénale grave, évoquée dans l’introduction, empêche l’élimination correcte des déchets et le réglage de l’eau, des ions et de l’acidité. La dialyse remplace une partie de ces échanges, mais pas toutes les fonctions endocrines du rein.

> **Corrections de la source.** Cortex périphérique, pyramides dans la médulla, pelvis collecteur distinct du tissu médullaire ; chapitre 10 retenu malgré « L5 » et « Leçon 8 ».

> **Astuce mémoire :** **C**ortex = **c**ouronne ; **m**édulla = **m**ilieu profond ; pelvis = entonnoir vers l’uretère.
`,
    keyPoint: "Le rein stabilise dynamiquement volume, osmolarité, ions et pH ; le cortex est périphérique et les pyramides appartiennent à la médulla.",
    example: "Sur une coupe, on suit cortex → médulla/pyramides → calices → pelvis → uretère, sans confondre tissu rénal et voie excrétrice.",
    methodSteps: [
      "Identifier la variable du milieu intérieur à stabiliser.",
      "Orienter la coupe du cortex périphérique vers la médulla interne.",
      "Distinguer tissus fonctionnels, cavités collectrices et vaisseaux.",
      "Relier l’organisation aux réglages d’eau, d’ions, de déchets et de pH.",
    ],
    interaction: diagram(
      "Explorer l’organisation fonctionnelle du rein",
      "Choisis un compartiment puis relie sa position anatomique à sa fonction.",
      "Rein et milieu intérieur",
      "Le rein filtre le plasma au cortex, transforme le filtrat le long des tubules et draine l’urine vers les cavités excrétrices.",
      [
        { id: "cortex", label: "Cortex périphérique", role: "Filtrer", detail: "Il contient les corpuscules rénaux et une grande partie des tubules contournés.", group: "Parenchyme" },
        { id: "medulla", label: "Médulla", role: "Concentrer", detail: "Pyramides, anses et collecteurs participent au gradient corticomedullaire.", group: "Parenchyme" },
        { id: "pelvis", label: "Calices et pelvis", role: "Collecter", detail: "Ces cavités reçoivent l’urine formée ; elles ne filtrent pas le plasma.", group: "Voies urinaires" },
        { id: "vessels", label: "Artère et veine rénales", role: "Échanger", detail: "Le débit sanguin apporte les substances à filtrer et reprend ce qui est réabsorbé.", group: "Circulation" },
        { id: "ureter", label: "Uretère", role: "Conduire", detail: "Il transporte l’urine du pelvis à la vessie sans la former.", group: "Voies urinaires" },
      ],
      "La disposition périphérie-profondeur rend possible le passage d’un filtrat abondant à une urine dont le volume et la concentration sont réglés.",
    ),
    questions: questions(0, [
      ["Quel tissu forme la zone périphérique du rein ?", "Le cortex rénal", ["La médulla", "Le pelvis", "L’uretère"], "Le cortex entoure la médulla.", "Coupe rénale • page 2"],
      ["Où se trouvent les pyramides rénales ?", "Dans la médulla", ["Dans la vessie", "Dans le cortex exclusivement", "Dans l’artère rénale"], "Les pyramides sont des structures médullaires.", "Schéma du rein • page 2"],
      ["Quelle cavité se prolonge par l’uretère ?", "Le pelvis rénal", ["Le glomérule", "La capsule", "Le cortex"], "Le pelvis collecte l’urine avant l’uretère.", "Voies urinaires • page 2"],
      ["Que signifie homéostasie ?", "Une stabilité dynamique des variables internes", ["Une composition absolument immobile", "L’arrêt des échanges", "La seule production d’urine"], "Les valeurs fluctuent autour de plages régulées.", "Introduction • page 1"],
      ["Quel compartiment appartient au milieu intérieur ?", "Le liquide interstitiel", ["La lumière digestive", "L’air alvéolaire", "L’urine finale"], "Le liquide interstitiel baigne les cellules.", "Notion de milieu intérieur • page 1"],
      ["Quel rôle n’appartient pas directement à l’uretère ?", "Filtrer le plasma", ["Conduire l’urine", "Relier pelvis et vessie", "Participer aux voies urinaires"], "La filtration se fait dans les corpuscules rénaux.", "Organisation • page 2"],
      ["Pourquoi le rein est-il osmorégulateur ?", "Il ajuste l’excrétion d’eau et de solutés", ["Il rend toute urine identique", "Il bloque tout sodium", "Il remplace les poumons"], "L’ajustement des sorties stabilise les liquides extracellulaires.", "Conclusion fonctionnelle • page 2"],
      ["Quel vaisseau apporte le sang au rein ?", "L’artère rénale", ["L’uretère", "La veine cave uniquement", "Le canal collecteur"], "L’artère rénale apporte le débit à traiter.", "Coupe rénale • page 2"],
      ["Quel repère canonique doit prendre ce parcours ?", "Chapitre 10", ["Chapitre 5", "Chapitre 8", "Aucun chapitre"], "La progression officielle place cette leçon en dixième position.", "Couverture • page 1 et progression officielle"],
    ], short("Nomme la zone rénale située sous le cortex.", ["médulla", "la médulla", "médullaire", "zone médullaire"], "La médulla est la zone interne contenant les pyramides.", "Coupe rénale • page 2")),
    corrections: [
      "La progression officielle fixe le chapitre/position 10 malgré le nom de fichier L5 et la couverture Leçon 8.",
      "Le cortex est replacé en périphérie et les pyramides dans la médulla, contrairement à l’inversion du texte source.",
      "Le pelvis est présenté comme une cavité collectrice et non comme le centre fonctionnel de la médulla.",
    ],
  },
  {
    id: "nephron-structure-urine-pathway",
    title: "Suivre le filtrat dans le néphron",
    summary: "Identifier corpuscule, segments tubulaires et canal collecteur, puis suivre sans confusion le sang, le filtrat et l’urine.",
    pages: "2-3",
    section: "Structure du néphron et voies urinaires",
    durationMinutes: 30,
    xp: 55,
    body: String.raw`
## L’unité de filtration et de transformation

Le **néphron** est l’unité fonctionnelle élémentaire du rein. Il commence par un corpuscule rénal formé du glomérule capillaire et de la capsule de Bowman. Le filtrat entre ensuite dans le tube proximal, descend et remonte dans l’anse de Henlé, atteint le tube distal puis rejoint un canal collecteur.

La source range le « tube collecteur de Bellini » parmi les constituants du néphron. Dans un sens anatomique strict, le **canal collecteur n’appartient pas au néphron embryologique** : il reçoit les tubules distaux de plusieurs néphrons. Au lycée, on peut le dessiner dans la continuité du trajet urinaire, mais on doit signaler cette nuance. Le terme actuel « canal collecteur » suffit ; les canaux papillaires de Bellini correspondent à la partie terminale.

## Trois trajets à ne pas mélanger

Le sang arrive au glomérule par l’artériole afférente et repart par l’artériole efférente. Celle-ci alimente un réseau capillaire péritubulaire et, pour les néphrons profonds, les vasa recta. Le filtrat, lui, traverse la barrière glomérulaire vers l’espace de Bowman puis avance dans la lumière tubulaire. Enfin, les substances réabsorbées passent de la lumière vers l’interstitium puis les capillaires ; les substances sécrétées font le chemin inverse.

$$\text{sang glomérulaire}\rightarrow\text{espace de Bowman}\rightarrow\text{proximal}\rightarrow\text{anse}\rightarrow\text{distal}\rightarrow\text{collecteur}$$

Ce schéma ne signifie pas que le sang circule dans le tubule. Il sépare clairement **compartiment vasculaire** et **compartiment urinaire**. L’urine ne devient « finale » qu’après l’ensemble des transformations tubulaires et collectrices.

## Une spécialisation segmentaire

Le tube proximal réabsorbe la majorité de l’eau et du Na⁺ filtrés ainsi que, en situation normale, presque tout le glucose et les acides aminés. L’anse de Henlé crée avec les vasa recta un gradient médullaire. Le tube distal et le collecteur assurent des réglages fins : Na⁺, K⁺, H⁺, bicarbonate et eau selon les hormones et les besoins.

La capsule n’est pas un simple sac étanche : son feuillet viscéral porte les podocytes de la barrière. Le glomérule ne « choisit » pas consciemment les molécules ; la pression, la taille, la charge et les propriétés de la barrière déterminent le passage.

> **Corrections anatomiques.** Le collecteur reçoit plusieurs néphrons ; le sang reste dans les vaisseaux ; la sécrétion va du sang vers la lumière et non dans le sens inverse.

> **Astuce mémoire :** **B-P-A-D-C** : Bowman, proximal, anse, distal, collecteur.
`,
    keyPoint: "Le filtrat suit Bowman → proximal → anse de Henlé → distal → collecteur ; le collecteur reçoit plusieurs néphrons et n’en fait pas strictement partie.",
    example: "Une molécule réabsorbée quitte la lumière tubulaire, traverse l’épithélium et rejoint l’interstitium puis les capillaires péritubulaires.",
    methodSteps: [
      "Colorer mentalement le compartiment sanguin et le compartiment urinaire.",
      "Commencer le filtrat dans l’espace de Bowman.",
      "Suivre les segments dans leur ordre sans faire circuler le sang dans le tubule.",
      "Préciser le sens lumière→sang pour la réabsorption et sang→lumière pour la sécrétion.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Parcourir le néphron et son collecteur",
      instruction: "Sélectionne les six repères et raconte le trajet du filtrat, puis celui d’une substance réabsorbée.",
      viewBox: "0 0 760 520",
      caption: "Figure pédagogique originale inspirée des pages 2-3 ; aucune image du PDF n’est republiée.",
      shapes: nephronShapes,
      hotspots: nephronHotspots,
      observation: "Le collecteur prolonge fonctionnellement le trajet urinaire mais reçoit plusieurs néphrons : cette distinction évite une erreur anatomique fréquente.",
    },
    questions: questions(9, [
      ["Quel ensemble forme le corpuscule rénal ?", "Glomérule et capsule de Bowman", ["Anse et collecteur", "Pelvis et uretère", "Distal et vessie"], "Le corpuscule est le site initial de filtration.", "Tableau d’application • page 3"],
      ["Quel segment suit la capsule de Bowman ?", "Le tube proximal", ["Le canal collecteur", "L’uretère", "Le tube distal"], "Le filtrat entre d’abord dans le proximal.", "Schéma du néphron • page 2"],
      ["Quel segment forme une boucle médullaire ?", "L’anse de Henlé", ["La capsule", "Le pelvis", "L’artériole afférente"], "L’anse possède une branche descendante et une ascendante.", "Structure • page 2"],
      ["Quelle nuance concerne le canal collecteur ?", "Il reçoit plusieurs néphrons sans appartenir strictement à chacun", ["Il filtre tout le plasma", "Il est une artère", "Il se trouve dans la vessie"], "Son origine embryologique et son drainage le distinguent du néphron strict.", "Tableau • page 3"],
      ["Dans quel sens se fait la réabsorption ?", "De la lumière tubulaire vers le sang", ["Du sang vers la lumière", "Du pelvis vers le glomérule", "De l’uretère vers le cortex"], "La substance retourne au milieu intérieur.", "Fonctions rénales • page 5"],
      ["Dans quel sens se fait la sécrétion tubulaire ?", "Du sang vers la lumière tubulaire", ["De l’urine vers le sang", "Du glomérule vers l’artère", "Du collecteur vers le distal"], "La sécrétion ajoute une substance au fluide tubulaire.", "Fonctions rénales • page 5"],
      ["Quel vaisseau quitte le glomérule ?", "L’artériole efférente", ["L’artériole afférente", "L’uretère", "Le canal de Bellini"], "L’efférente alimente ensuite les capillaires péritubulaires.", "Corpuscule • page 2"],
      ["Où le filtrat apparaît-il d’abord ?", "Dans l’espace de Bowman", ["Dans la veine rénale", "Dans la vessie", "Dans le pelvis directement"], "La barrière sépare capillaires glomérulaires et espace capsulaire.", "Schéma • page 2"],
      ["Quel segment reçoit le tube distal ?", "Le canal collecteur", ["L’artère rénale", "La capsule", "Le glomérule"], "Le distal se jette dans le système collecteur.", "Trajet urinaire • page 2"],
    ], short("Donne le nom de l’unité fonctionnelle élémentaire du rein.", ["néphron", "le néphron", "nephron"], "Le néphron associe corpuscule et tubule rénal.", "Définition • page 3")),
    corrections: [
      "Le canal collecteur est intégré au trajet fonctionnel mais distingué du néphron au sens anatomique strict.",
      "Les trajets du sang et du filtrat sont séparés pour éviter de faire circuler le sang dans la lumière tubulaire.",
      "Le sens de la sécrétion est corrigé : capillaires/interstitium vers lumière tubulaire.",
    ],
  },
  {
    id: "glomerular-filtration-selectivity",
    title: "Comparer plasma, filtrat et urine",
    summary: "Interpréter les tableaux de composition en corrigeant la filtration du glucose, le statut des lipides et la notion de sélectivité.",
    pages: "3-5",
    section: "Composition du plasma et des urines",
    durationMinutes: 32,
    xp: 65,
    body: String.raw`
## Un ultrafiltrat du plasma

La filtration glomérulaire résulte d’un bilan de pressions à travers une barrière formée par l’endothélium fenestré, la membrane basale glomérulaire et les fentes entre pédicelles des podocytes. Les cellules sanguines et la majorité des grosses protéines restent dans le plasma. L’eau et les petits solutés dissous — Na⁺, Cl⁻, urée, glucose, acides aminés — traversent normalement la barrière.

Le document compare plasma, urine primitive et urine finale, mais il explique à tort que le **glucose** serait retenu lors de la filtration parce qu’il aurait une masse élevée. Le glucose est une petite molécule **librement filtrée**. S’il est presque absent de l’urine finale normale, c’est parce qu’il est réabsorbé dans le tube proximal par des cotransporteurs sodium-glucose puis renvoyé au sang. Lorsque la charge filtrée dépasse la capacité de transport, une glycosurie peut apparaître.

## Protéines et lipides : deux nuances nécessaires

Les protéines plasmatiques sont en grande partie retenues par leur taille et leur charge, même si de petites protéines peuvent passer puis être reprises. Une protéinurie importante signale donc une atteinte possible de la barrière ou des mécanismes tubulaires.

Les **lipides** ne forment pas une catégorie simple de grosses molécules libres bloquées par un tamis. Beaucoup circulent associés à des lipoprotéines volumineuses, qui restent dans le plasma ; les acides gras peuvent aussi être liés à l’albumine. Leur absence de l’urine normale ne se démontre pas par la formule vague « lipides trop gros ». On doit préciser la forme de transport.

## Lire correctement les concentrations

Une concentration finale élevée ne signifie pas nécessairement une sécrétion. L’eau peut être réabsorbée davantage que le soluté, ce qui concentre celui-ci. Inversement, une substance absente de l’urine finale peut avoir été filtrée puis totalement réabsorbée. Pour conclure, il faudrait comparer les **débits de substance** :

$$\text{charge filtrée}=DFG\times P_x$$

$$\text{débit excrété}=U_x\times V$$

où $DFG$ est le débit de filtration glomérulaire, $P_x$ la concentration plasmatique, $U_x$ la concentration urinaire et $V$ le débit urinaire en **mL/min**. Les tableaux scolaires donnent des indices, mais pas toujours assez de données pour calculer tous les flux.

Les ions, l’urée et l’acide urique peuvent être présents dans plasma et urine ; leur quantité finale dépend de la filtration, de la réabsorption, de la sécrétion et de l’eau excrétée. L’ammonium et certains acides organiques sont aussi produits ou sécrétés par le rein.

> **Corrections scientifiques.** Le glucose est filtré puis réabsorbé ; les lipides circulent surtout dans des complexes ; concentration et quantité excrétée ne sont pas synonymes.

> **Astuce mémoire :** petit et libre peut filtrer ; absent à la sortie peut avoir été repris en chemin.
`,
    keyPoint: "Le filtrat glomérulaire contient eau et petits solutés, dont le glucose ; cellules et grandes protéines restent surtout dans le plasma.",
    example: "Glucose présent dans le filtrat mais absent de l’urine finale normale : la conclusion correcte est réabsorption proximale quasi complète, pas blocage glomérulaire.",
    methodSteps: [
      "Comparer d’abord la taille et la forme de transport des substances.",
      "Distinguer présence dans le filtrat et présence dans l’urine finale.",
      "Ne pas déduire un flux d’une concentration sans tenir compte du débit d’eau.",
      "Proposer filtration, réabsorption ou sécrétion en justifiant chaque étape.",
    ],
    interaction: diagram(
      "Classer les substances à la barrière glomérulaire",
      "Sélectionne une substance et prédis son passage initial puis son devenir tubulaire normal.",
      "Barrière de filtration",
      "La taille, la charge et la forme circulante déterminent le passage initial ; les tubules modifient ensuite le filtrat.",
      [
        { id: "cells", label: "Cellules sanguines", role: "Retenues", detail: "Elles ne traversent pas une barrière glomérulaire intacte.", group: "Plasma" },
        { id: "proteins", label: "Grosses protéines", role: "Majoritairement retenues", detail: "Taille et charge limitent leur filtration ; une albuminurie importante est anormale.", group: "Plasma" },
        { id: "glucose", label: "Glucose libre", role: "Filtré puis repris", detail: "Il traverse le glomérule et est normalement réabsorbé dans le proximal.", group: "Petits solutés" },
        { id: "ions", label: "Eau et ions", role: "Filtrés et réglés", detail: "Leur excrétion finale dépend de réabsorptions et sécrétions segmentaires.", group: "Petits solutés" },
        { id: "lipids", label: "Lipides transportés", role: "Dépend du complexe", detail: "Les lipoprotéines et complexes avec l’albumine ne se décrivent pas comme de simples lipides libres.", group: "Nuance" },
      ],
      "La sélectivité glomérulaire ne suffit pas à expliquer l’urine finale : le tubule transforme profondément l’ultrafiltrat.",
    ),
    questions: questions(18, [
      ["Quel élément ne traverse normalement pas la barrière glomérulaire intacte ?", "Une cellule sanguine", ["Une molécule d’eau", "Un ion sodium", "Une molécule de glucose"], "Les éléments figurés restent dans le sang.", "Tableau comparatif • pages 3-4"],
      ["Quel sort initial connaît le glucose ?", "Il est librement filtré", ["Il est toujours bloqué", "Il est produit dans Bowman", "Il traverse l’uretère vers le sang"], "Sa petite taille permet sa filtration.", "Interprétation corrigée • page 5"],
      ["Pourquoi le glucose manque-t-il normalement dans l’urine finale ?", "Il est presque totalement réabsorbé au proximal", ["Il est trop gros", "Il devient une protéine", "Il est détruit dans le glomérule"], "Les cotransporteurs proximaux le reprennent.", "Tableau • pages 3-5"],
      ["Quelle structure forme la dernière couche de la barrière côté urine ?", "Les podocytes et leurs fentes", ["L’uretère", "La vessie", "Le tube distal"], "Les pédicelles bordent l’espace urinaire.", "Enrichissement de la filtration"],
      ["Pourquoi de nombreux lipides restent-ils dans le plasma ?", "Ils circulent associés à des lipoprotéines ou protéines", ["Tous sont des cellules", "Ils sont transformés en sodium", "La vessie les filtre"], "La forme circulante importe.", "Correction de l’interprétation • page 5"],
      ["Que peut signifier une forte protéinurie ?", "Une atteinte glomérulaire ou tubulaire", ["Une filtration toujours normale", "Une absence de plasma", "Une simple hausse du débit d’eau"], "Les protéines sont normalement très peu excrétées.", "Tableaux • pages 3-4"],
      ["Quelle expression donne la charge filtrée d’un soluté ?", "$DFG\times P_x$", ["$U_x/V$", "$P_x-U_x$", "$V/DFG$"], "Le débit filtré multiplie la concentration plasmatique filtrable.", "Méthode quantitative"],
      ["Quelle unité convient au débit urinaire ?", "mL/min", ["mOsm/L", "g uniquement", "mmHg/L"], "Un débit est un volume par unité de temps.", "Courbes et tableaux • pages 3-6"],
      ["Une urine plus concentrée en urée prouve-t-elle une sécrétion nette ?", "Non, la réabsorption d’eau peut suffire à concentrer", ["Oui, toujours", "Oui, car l’urée est une cellule", "Non, car l’urée ne filtre jamais"], "Concentration et quantité excrétée doivent être distinguées.", "Analyse des tableaux • page 4"],
      ["Quel constituant traverse facilement avec l’eau ?", "Le sodium filtrable", ["Un globule rouge", "Une grosse lipoprotéine", "Une plaquette"], "Les petits ions sont ultrafiltrés.", "Composition • pages 3-4"],
    ], short("Nomme le segment qui réabsorbe normalement presque tout le glucose filtré.", ["tube proximal", "le tube proximal", "tubule proximal", "TCP"], "Les transporteurs du tube proximal reprennent le glucose.", "Correction • page 5")),
    corrections: [
      "Le glucose n’est plus présenté comme une grosse molécule bloquée : il est filtré puis réabsorbé dans le tube proximal.",
      "L’absence urinaire des lipides est expliquée par leurs formes de transport, notamment lipoprotéines et liaison à l’albumine.",
      "Les concentrations des tableaux sont distinguées des débits de substance afin de ne pas conclure abusivement à une sécrétion.",
    ],
  },
  {
    id: "tubular-reabsorption-secretion-excretion",
    title: "Établir le bilan tubulaire",
    summary: "Distinguer filtration, réabsorption, sécrétion et excrétion, puis localiser les transports sans réserver la sécrétion à l’anse.",
    pages: "4-5 et 15",
    section: "Fonctions du néphron et exercice sur les transferts",
    durationMinutes: 34,
    xp: 75,
    body: String.raw`
## Quatre mots, quatre opérations

La **filtration glomérulaire** fait passer l’eau et les petits solutés du plasma vers l’espace de Bowman. La **réabsorption tubulaire** ramène une substance de la lumière vers le sang. La **sécrétion tubulaire** ajoute au contraire une substance du sang ou des cellules tubulaires vers la lumière. L’**excrétion** est la quantité qui quitte finalement l’organisme dans l’urine.

Le bilan fondamental est :

$$\boxed{\text{excrétion}=\text{filtration}-\text{réabsorption}+\text{sécrétion}}$$

Cette équation s’applique aux quantités par unité de temps. Une substance peut être filtrée, partiellement réabsorbée et aussi sécrétée. L’urée, par exemple, connaît des mouvements complexes ; le K⁺ et H⁺ sont réglés selon les segments et l’état physiologique.

## Les segments ne possèdent pas une fonction unique

La page 5 associe chaque fonction à un seul territoire et laisse croire que la sécrétion serait propre à l’anse de Henlé. C’est inexact. Le tube proximal sécrète notamment des acides et bases organiques ainsi que H⁺ ; le distal et le collecteur sécrètent K⁺ ou H⁺ selon les cellules et les signaux. L’anse contribue surtout à la création du gradient médullaire par ses perméabilités différentes, sans être « le segment de la sécrétion ».

Le tube proximal assure une réabsorption massive. La branche descendante de Henlé est très perméable à l’eau ; la branche ascendante épaisse réabsorbe Na⁺, K⁺ et Cl⁻ tout en étant peu perméable à l’eau. Le distal et le collecteur affinent le bilan sous l’action de l’aldostérone, de l’ADH et d’autres régulations.

## Corriger l’exercice du glucose

À la page 15, une question demande où le glucose « disparaît » du fluide urinaire, mais aucune option proposée n’est correcte ; la correction indique le tube collecteur. Or le glucose est normalement repris **presque entièrement dans le tube proximal**. Le collecteur n’est pas le site physiologique de sa réabsorption. Si la glycémie et donc la charge filtrée dépassent le transport maximal proximal, du glucose persiste dans l’urine.

La sécrétion doit également être orientée correctement : **sang/interstitium → cellule tubulaire → lumière**. Une flèche lumière→sang représente une réabsorption. Cette convention permet d’interpréter sans ambiguïté les schémas à repères.

## Résoudre un bilan

Si 100 unités sont filtrées, 80 réabsorbées et 15 sécrétées, alors 35 unités sont excrétées. Si l’excrétion est inférieure à la filtration, une réabsorption nette a eu lieu ; si elle est supérieure, une sécrétion nette est nécessaire. Cette comparaison suppose les mêmes unités et la même durée.

> **Corrections de la source.** Sécrétion non limitée à l’anse ; glucose repris au proximal ; aucune bonne option dans la question de la page 15 ; sens des flèches explicitement rétabli.

> **Astuce mémoire :** **F − R + S = E** ; réabsorber revient au sang, sécréter sort du sang.
`,
    keyPoint: "Excrétion = filtration − réabsorption + sécrétion ; réabsorption lumière→sang, sécrétion sang→lumière.",
    example: "Filtré 120, réabsorbé 95, sécrété 5 : excrété = 120 − 95 + 5 = 30 unités par minute.",
    methodSteps: [
      "Tracer deux compartiments, sang et lumière tubulaire.",
      "Orienter chaque flux avant de lui donner un nom.",
      "Appliquer F − R + S = E avec des unités identiques.",
      "Vérifier la plausibilité segmentaire, notamment glucose au proximal.",
    ],
    interaction: timeline(
      "Dérouler le devenir d’une substance",
      "Suis une molécule depuis le plasma jusqu’au bilan urinaire final.",
      [
        { label: "Plasma glomérulaire", shortLabel: "Départ", detail: "La substance arrive par l’artériole afférente avec le plasma." },
        { label: "Filtration éventuelle", shortLabel: "F", detail: "La fraction filtrable traverse vers l’espace de Bowman." },
        { label: "Réabsorption éventuelle", shortLabel: "−R", detail: "Une partie quitte la lumière et retourne au sang." },
        { label: "Sécrétion éventuelle", shortLabel: "+S", detail: "Une partie supplémentaire passe du sang vers la lumière." },
        { label: "Excrétion urinaire", shortLabel: "E", detail: "Le reliquat quitte le rein : E = F − R + S." },
      ],
      "Le même segment peut réabsorber certaines substances et en sécréter d’autres ; les verbes décrivent un sens, pas un lieu unique.",
    ),
    questions: questions(28, [
      ["Quel flux va de la lumière vers le sang ?", "La réabsorption", ["La filtration", "La sécrétion", "L’excrétion"], "Réabsorber ramène au milieu intérieur.", "Fonctions • page 5"],
      ["Quel flux va du sang vers la lumière tubulaire ?", "La sécrétion", ["La réabsorption", "L’excrétion hors du corps", "Le drainage lymphatique"], "La sécrétion ajoute au fluide tubulaire.", "Schéma de transfert • page 15"],
      ["Quelle équation est correcte ?", "E = F − R + S", ["E = F + R − S", "E = R − F − S", "E = F + R + S"], "Réabsorption retire, sécrétion ajoute.", "Bilan rénal"],
      ["Où le glucose est-il normalement réabsorbé ?", "Dans le tube proximal", ["Dans le collecteur uniquement", "Dans l’uretère", "Dans le pelvis"], "La correction source indiquant le collecteur est fausse.", "Exercice • page 15"],
      ["Quel segment réabsorbe activement NaCl mais peu d’eau ?", "La branche ascendante épaisse", ["La capsule", "L’uretère", "La branche descendante exclusivement"], "Elle contribue à diluer le fluide tubulaire.", "Fonction de l’anse • page 5"],
      ["La sécrétion est-elle réservée à l’anse ?", "Non, proximal, distal et collecteur peuvent sécréter", ["Oui, toujours", "Oui, sauf Bowman", "Non, elle se fait seulement dans la vessie"], "Plusieurs segments sécrètent des solutés.", "Association corrigée • page 5"],
      ["Si F=100, R=80 et S=15, combien vaut E ?", "35", ["5", "165", "195"], "$100-80+15=35$.", "Application quantitative"],
      ["Une excrétion supérieure à la filtration suggère quoi ?", "Une sécrétion nette", ["Une réabsorption nette seule", "Une absence de tubule", "Une filtration nulle"], "Un ajout tubulaire est nécessaire au bilan.", "Déduction du bilan"],
      ["Quel énoncé décrit l’excrétion ?", "La quantité quittant finalement l’organisme dans l’urine", ["Tout ce qui entre dans l’artère rénale", "Seulement ce qui est sécrété", "Seulement ce qui est filtré"], "L’excrétion est le résultat net.", "Définition • page 5"],
      ["Que révèle une glycosurie avec filtration élevée ?", "La capacité proximale peut être dépassée", ["Le glucose ne filtre jamais", "Le collecteur fabrique le glucose", "L’uretère réabsorbe tout"], "Les transporteurs ont un maximum.", "Exercice glucose • page 15"],
    ], short("Écris les quatre lettres du bilan excrétion rénale dans l’ordre.", ["F-R+S=E", "E=F-R+S", "filtration moins réabsorption plus sécrétion égale excrétion"], "Le bilan net est E = F − R + S.", "Synthèse des fonctions • page 5")),
    corrections: [
      "La sécrétion est localisée dans plusieurs segments et non attribuée exclusivement à l’anse de Henlé.",
      "La direction sang vers lumière est imposée pour la sécrétion ; la direction inverse est une réabsorption.",
      "L’item sans bonne option de la page 15 est corrigé : le glucose est réabsorbé dans le tube proximal, non le collecteur.",
    ],
  },
  {
    id: "water-load-diuresis-osmolarity",
    title: "Interpréter une charge hydrique",
    summary: "Lire la courbe de diurèse après apport d’eau, corriger les incohérences du protocole et relier débit urinaire, osmolarité et volume.",
    pages: "6 et 12",
    section: "Expérience de charge hydrique et exercice d’exploitation",
    durationMinutes: 34,
    xp: 85,
    kind: "graph",
    body: String.raw`
## Décrire avant d’expliquer

La page 6 présente un chien recevant 250 mL d’eau. Le protocole parle à la fois d’eau **injectée** et d’eau **ingérée** : ces voies ne sont pas équivalentes. Une ingestion implique absorption digestive et délai ; une perfusion intraveineuse modifie directement le compartiment vasculaire. Comme la figure ne tranche pas proprement, on retient prudemment « apport hydrique » et on signale l’incohérence au lieu d’inventer un protocole.

Le débit urinaire part d’environ $1\ \mathrm{mL/min}$, augmente progressivement jusqu’à un maximum proche de $4{,}3\ \mathrm{mL/min}$ vers 60 minutes, puis commence à diminuer. La source utilise $\mathrm{cm^3/min}$ ; $1\ \mathrm{cm^3}=1\ \mathrm{mL}$. Il faut annoncer l’axe du temps, l’unité et les valeurs approximatives avant toute interprétation.

## De l’eau en excès à une urine diluée

Après absorption, l’excès relatif d’eau tend à **diminuer l’osmolarité plasmatique**, exprimée en $\mathrm{mOsm/L}$, et à augmenter transitoirement le volume extracellulaire. Les osmorécepteurs hypothalamiques réduisent alors le signal qui entretient la libération d’ADH. Avec moins d’ADH, les canaux collecteurs insèrent moins d’aquaporines AQP2 dans leur membrane apicale ; ils deviennent moins perméables à l’eau. Davantage d’eau reste dans la lumière : le débit d’urine diluée augmente.

Le terme **diurèse** désigne le débit urinaire. Une hausse physiologique après boisson ne doit pas être automatiquement qualifiée de polyurie pathologique. La polyurie clinique correspond à un volume quotidien excessif persistant et demande un contexte temporel.

## Fermer la boucle

L’élimination de l’excès d’eau fait remonter l’osmolarité vers sa plage initiale et réduit l’expansion volumique. La libération d’ADH retrouve alors son niveau approprié. La courbe revient avec retard car absorption, circulation, signal hormonal, trafic d’AQP2 et transit tubulaire prennent du temps.

Une courbe de débit seule ne mesure pas directement l’osmolarité. Elle est compatible avec une urine plus diluée, mais une démonstration complète demanderait une mesure simultanée de l’osmolarité urinaire et plasmatique. Cette distinction protège contre l’affirmation « débit élevé = osmolarité forcément nulle ».

> **Corrections expérimentales.** « Ingestion/injection » demeure une incertitude ; les unités sont normalisées en mL/min ; le mot polyurie n’est pas appliqué sans durée clinique ; débit et osmolarité restent deux mesures distinctes.

> **Astuce mémoire :** eau en excès → osmolarité ↓ → ADH ↓ → AQP2 ↓ → eau urinaire ↑.
`,
    keyPoint: "Une charge hydrique réduit transitoirement l’osmolarité, freine l’ADH et augmente le débit d’une urine diluée après un délai.",
    example: "Le débit passe approximativement de 1 à 4,3 mL/min vers 60 min : on décrit d’abord cette variation avant de proposer ADH↓ et AQP2↓.",
    methodSteps: [
      "Nommer axes, unités et nature approximative des valeurs.",
      "Décrire départ, sens de variation, maximum et retour.",
      "Séparer les conséquences sur volume et osmolarité.",
      "Construire la boucle osmorécepteurs–ADH–collecteur–excrétion d’eau.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "Explorer la diurèse après apport hydrique",
      instruction: "Déplace le repère et relève le débit urinaire approximatif avant, pendant et après le maximum.",
      formula: "Débit urinaire V(t), en mL/min",
      formulaTex: "V(t)",
      rule: { kind: "samples", points: [[-20, 0.9], [-10, 1.05], [0, 0.85], [10, 0.95], [20, 1.1], [30, 1.8], [40, 2.6], [50, 3.4], [60, 4.3], [65, 3.65], [70, 3.85], [80, 3.95], [90, 3.55]] },
      window: { xMin: -20, xMax: 90, yMin: 0, yMax: 5 },
      guides: [
        { kind: "vertical", value: 60, label: "maximum ≈ 60 min" },
        { kind: "horizontal", value: 1, label: "débit initial ≈ 1 mL/min" },
      ],
      marker: { min: -20, max: 90, step: 5, initial: 60 },
      observation: "Le maximum retardé est compatible avec l’absorption, l’ajustement hormonal et le transit rénal ; le tracé seul ne décide pas si l’eau fut ingérée ou injectée.",
    },
    questions: questions(38, [
      ["Quelle unité convient à l’axe du débit urinaire ?", "mL/min", ["mOsm/L", "mmHg", "g/L de temps"], "Le débit est un volume par temps.", "Courbe • page 6"],
      ["Quel débit initial lit-on approximativement ?", "1 mL/min", ["0 mL/min", "4,3 mL/min", "60 mL/min"], "La courbe commence autour de 1.", "Courbe • page 6"],
      ["Vers quand apparaît le maximum ?", "Vers 60 minutes", ["À 1 minute", "Vers 200 minutes", "Avant l’apport"], "Le pic graphique se situe près de 60 min.", "Courbe • page 6"],
      ["Quel maximum approximatif est lu ?", "4,3 mL/min", ["43 mOsm/L", "0,43 L/s", "60 mL/min"], "La graduation source indique environ 4,3 cm³/min.", "Courbe • page 6"],
      ["Quel effet initial a l’excès d’eau sur l’osmolarité ?", "Il tend à la diminuer", ["Il la double toujours", "Il la rend nulle", "Il ne peut jamais l’influencer"], "L’eau dilue les solutés extracellulaires.", "Interprétation • page 6"],
      ["Quelle réponse hormonale est attendue ?", "Une baisse de libération d’ADH", ["Une hausse obligatoire d’aldostérone", "Une production d’angiotensine par l’urine", "Une disparition de toute hormone"], "La faible osmolarité réduit le signal osmotique.", "Régulation hydrique • pages 6-8"],
      ["Quel changement se produit dans le collecteur ?", "Moins d’AQP2 apicales", ["Plus de glucose filtré par taille", "Fermeture de tous les néphrons", "Production d’hématies"], "Une baisse d’ADH réduit l’insertion d’AQP2.", "Mécanisme corrigé"],
      ["Pourquoi le protocole doit-il être nuancé ?", "Il mélange ingestion et injection", ["Il n’utilise aucun animal", "Il mesure uniquement la pression", "Il indique deux reins différents"], "Les deux voies ont des cinétiques différentes.", "Protocole • page 6"],
      ["Une hausse brève du débit après boisson suffit-elle à diagnostiquer une polyurie ?", "Non, il faut un volume quotidien excessif persistant", ["Oui, toujours", "Oui, dès 1 mL/min", "Non, car la diurèse n’existe pas"], "Le terme clinique requiert durée et volume.", "Vocabulaire • pages 6-7"],
      ["Le débit urinaire mesure-t-il directement l’osmolarité ?", "Non, ce sont deux variables différentes", ["Oui, avec la même unité", "Oui, sans analyse d’urine", "Non, car l’urine n’a pas de solutés"], "Il faut mesurer concentration et débit séparément.", "Analyse critique • page 12"],
      ["Pourquoi le pic est-il retardé ?", "Absorption, signal hormonal et transit prennent du temps", ["Le rein cesse de recevoir du sang", "L’eau devient une protéine", "Le cortex change de place"], "Une boucle physiologique a une dynamique.", "Exploitation • pages 6 et 12"],
    ], short("Donne l’équivalence entre un centimètre cube et un millilitre.", ["1 cm3 = 1 mL", "1 cm³ = 1 mL", "un centimètre cube égale un millilitre"], "Les deux unités de volume sont équivalentes.", "Axe de la courbe • page 6")),
    corrections: [
      "L’incohérence entre ingestion et injection d’eau est signalée et le cours parle prudemment d’apport hydrique.",
      "Les cm³/min sont convertis en mL/min et distingués des mOsm/L de l’osmolarité.",
      "La diurèse physiologique transitoire n’est pas appelée polyurie clinique sans critère de durée et de volume quotidien.",
    ],
  },
  {
    id: "adh-water-balance-feedback",
    title: "Reconstruire la boucle de l’ADH",
    summary: "Localiser capteurs, synthèse, stockage et action de l’ADH, puis nuancer les réponses à l’hyperosmolarité, l’hypovolémie et l’hémorragie.",
    pages: "7-8 et 12-13",
    section: "Régulation de l’eau par l’hormone antidiurétique",
    durationMinutes: 34,
    xp: 90,
    body: String.raw`
## Des capteurs principalement hypothalamiques

Les principaux **osmorécepteurs** qui commandent l’ADH se trouvent dans des régions hypothalamiques spécialisées proches des organes circumventriculaires. Ils détectent les variations de tonicité efficace du plasma. La source place les osmorécepteurs dans les carotides ; cette localisation confond le contrôle osmotique avec des récepteurs vasculaires. Le sinus carotidien héberge surtout des barorécepteurs sensibles à l’étirement.

Les récepteurs cardiopulmonaires de basse pression — parfois appelés volorécepteurs — renseignent sur le remplissage des atria et des gros vaisseaux thoraciques. Les barorécepteurs artériels participent aussi lorsque la volémie ou la pression chute fortement. Les messages volumiques peuvent dominer l’osmolarité en situation d’urgence circulatoire.

## Synthétisée ici, libérée ailleurs

L’ADH, ou vasopressine, est **synthétisée dans des neurones magnocellulaires de l’hypothalamus**, notamment dans les noyaux supraoptique et paraventriculaire. Elle descend dans leurs axones, est stockée dans des terminaisons de la **neurohypophyse** puis libérée dans le sang. Dire qu’elle est « produite par la posthypophyse », comme aux pages 7-8, est donc inexact : la neurohypophyse stocke et libère une hormone fabriquée par les neurones hypothalamiques.

## V2, AMPc et AQP2

Dans les cellules principales du canal collecteur, l’ADH se lie à des récepteurs **V2** basolatéraux. Une cascade via AMPc et protéine kinase A favorise l’insertion d’**aquaporines AQP2** dans la membrane apicale. L’eau entre alors depuis la lumière selon le gradient osmotique médullaire, puis rejoint l’interstitium et le sang par d’autres aquaporines basolatérales. L’urine devient moins abondante et plus concentrée.

En hyperosmolarité ou manque d’eau : ADH ↑, soif ↑, perméabilité du collecteur ↑, conservation d’eau ↑. En hypo-osmolarité après apport d’eau : la séquence s’inverse. Cette boucle est une rétroaction négative.

## Nuancer l’hémorragie isotone

Une hémorragie aiguë emporte initialement eau et solutés du plasma dans des proportions proches : elle peut être **approximativement isotone**, donc sans hausse immédiate majeure de l’osmolarité. Pourtant l’ADH augmente parce que la baisse de volume et de pression active les voies volumiques et baroréceptrices. Après redistribution des liquides et réponses compensatrices, l’osmolarité peut évoluer. Il serait faux d’exiger une hyperosmolarité pour toute libération d’ADH.

> **Corrections centrales.** Osmorécepteurs hypothalamiques, ADH synthétisée dans l’hypothalamus puis stockée/libérée par la neurohypophyse, action V2–AQP2 au collecteur, réponse volumique possible sans hyperosmolarité.

> **Astuce mémoire :** **H-H-C** : hypothalamus fabrique, hypophyse libère, collecteur conserve.
`,
    keyPoint: "L’ADH est synthétisée dans l’hypothalamus, libérée par la neurohypophyse et agit via V2–AQP2 sur le collecteur.",
    example: "Après hémorragie isotone, l’ADH peut augmenter malgré une osmolarité initialement peu changée, car la baisse de volume et de pression devient prioritaire.",
    methodSteps: [
      "Identifier si la perturbation concerne osmolarité, volume, pression ou plusieurs variables.",
      "Localiser correctement les osmorécepteurs dans l’hypothalamus.",
      "Séparer synthèse hypothalamique et libération neurohypophysaire.",
      "Relier V2, AQP2, réabsorption d’eau et correction de la perturbation.",
    ],
    interaction: timeline(
      "Dérouler une réponse antidiurétique",
      "Pars d’une hyperosmolarité et suis chaque maillon jusqu’au retour vers la plage normale.",
      [
        { label: "Hyperosmolarité", shortLabel: "Perturbation", detail: "La tonicité efficace du plasma augmente, par exemple lors d’une perte d’eau." },
        { label: "Osmorécepteurs hypothalamiques", shortLabel: "Capteurs", detail: "Leur activité stimule les neurones magnocellulaires et la soif." },
        { label: "Neurones supraoptiques et paraventriculaires", shortLabel: "Synthèse", detail: "Ils synthétisent la vasopressine et la transportent dans leurs axones." },
        { label: "Neurohypophyse", shortLabel: "Libération", detail: "Les terminaisons libèrent l’ADH dans la circulation." },
        { label: "V2 et AQP2 au collecteur", shortLabel: "Effecteur", detail: "La perméabilité apicale à l’eau augmente." },
        { label: "Eau conservée", shortLabel: "Rétroaction −", detail: "L’urine se concentre et l’osmolarité plasmatique tend à diminuer." },
      ],
      "Une forte hypovolémie peut stimuler cette même voie même si le signal osmotique isolé serait faible ou opposé.",
    ),
    questions: questions(49, [
      ["Où se trouvent les principaux osmorécepteurs de l’ADH ?", "Dans l’hypothalamus", ["Dans l’uretère", "Dans les carotides uniquement", "Dans la vessie"], "Le contrôle osmotique principal est central.", "Schéma corrigé • page 7"],
      ["Où l’ADH est-elle synthétisée ?", "Dans des neurones hypothalamiques", ["Dans le canal collecteur", "Dans la neurohypophyse elle-même", "Dans le glomérule"], "Les noyaux supraoptique et paraventriculaire la fabriquent.", "Conclusion corrigée • page 8"],
      ["Quel est le rôle de la neurohypophyse ?", "Stocker et libérer l’ADH", ["Filtrer le glucose", "Produire la rénine", "Créer le gradient médullaire"], "Elle contient les terminaisons axonales.", "Régulation • pages 7-8"],
      ["Quel récepteur rénal lie l’ADH ?", "Le récepteur V2", ["Le récepteur à l’insuline", "Le canal ENaC seul", "Le récepteur nicotinique"], "V2 active une cascade AMPc dans les cellules principales.", "Mécanisme enrichi"],
      ["Quelle aquaporine est insérée à la membrane apicale ?", "AQP2", ["AQP0", "Na/K-ATPase", "ECA"], "AQP2 augmente la perméabilité à l’eau.", "Mécanisme enrichi"],
      ["Quel effet a l’ADH sur le débit urinaire ?", "Elle tend à le diminuer", ["Elle le rend toujours nul", "Elle augmente la filtration du glucose", "Elle ferme l’artère rénale"], "Davantage d’eau est réabsorbée.", "Schéma • page 7"],
      ["Pourquoi une hémorragie isotone stimule-t-elle l’ADH ?", "La baisse de volume et de pression active les voies non osmotiques", ["Elle augmente toujours immédiatement le sodium", "Elle rend le plasma sans eau", "Elle bloque les volorécepteurs"], "La priorité circulatoire peut dominer le signal osmotique.", "Application • pages 12-13"],
      ["Que détectent surtout les récepteurs cardiopulmonaires de basse pression ?", "Le remplissage et le volume central", ["Le glucose urinaire", "La taille des protéines", "Le pH de la vessie"], "Ils renseignent sur le volume circulant efficace.", "Schéma corrigé • page 7"],
      ["Quelle boucle suit une hypo-osmolarité ?", "ADH diminuée puis excrétion d’eau accrue", ["ADH accrue puis eau conservée", "Rénine transformée en glucose", "AQP2 bloquée puis urine concentrée"], "La réponse corrige la dilution.", "Charge hydrique • pages 6-8"],
    ], short("Donne l’autre nom de l’ADH.", ["vasopressine", "la vasopressine", "hormone antidiurétique"], "ADH et vasopressine désignent la même hormone.", "Conclusion • page 8")),
    corrections: [
      "Les osmorécepteurs sont replacés dans l’hypothalamus ; les récepteurs carotidiens ne sont plus présentés comme les capteurs osmotiques principaux.",
      "L’ADH est dite synthétisée par les neurones hypothalamiques puis stockée et libérée par la neurohypophyse.",
      "L’action V2–AQP2 est explicitée et l’hémorragie isotone est distinguée d’une hyperosmolarité obligatoire.",
    ],
  },
  {
    id: "renin-angiotensin-aldosterone-system",
    title: "Dérouler le système rénine–angiotensine–aldostérone",
    summary: "Identifier les signaux juxtaglomérulaires et ordonner rénine, angiotensines, ECA et aldostérone sans confondre enzyme, substrat et hormone.",
    pages: "8-10 et 15-16",
    section: "Régulation du sodium et système rénine–angiotensine–aldostérone",
    durationMinutes: 36,
    xp: 95,
    body: String.raw`
## Trois portes d’entrée vers la rénine

Les cellules granulaires **juxtaglomérulaires** de l’artériole afférente libèrent la rénine lorsque la pression de perfusion rénale baisse. Elles répondent aussi à une stimulation sympathique β1. Enfin, la **macula densa**, située au début du tube distal au contact du pôle vasculaire, détecte la livraison de NaCl et transmet des signaux locaux : une faible livraison de NaCl favorise la libération de rénine.

Ces trois indices ne sont pas parfaitement équivalents. Une baisse de NaCl à la macula densa peut refléter un débit filtré réduit ou une réabsorption proximale accrue. Le système intègre donc pression locale, contenu tubulaire et commande nerveuse.

## Remettre la cascade dans le bon ordre

La **rénine est une enzyme**. Elle clive l’**angiotensinogène**, qui est un substrat protéique produit principalement par le foie, pour former l’angiotensine I. L’**enzyme de conversion de l’angiotensine** (ECA), présente notamment à la surface de l’endothélium, transforme ensuite l’angiotensine I en angiotensine II.

$$\text{angiotensinogène}\xrightarrow{\text{rénine}}\text{Ang I}\xrightarrow{\text{ECA}}\text{Ang II}$$

La page 9 appelle l’angiotensinogène une enzyme et omet ou brouille l’étape ECA : on rétablit le statut de chaque molécule. L’angiotensine II est un puissant signal : vasoconstriction, stimulation de l’aldostérone, facilitation de la soif et de l’ADH, augmentation de la réabsorption de Na⁺ selon plusieurs mécanismes.

## Aldostérone et transport distal

L’aldostérone est produite par la zone glomérulée du cortex surrénalien. L’**aldostérone agit surtout sur le tubule distal puis le canal collecteur**. Dans les cellules principales, elle augmente notamment l’expression et l’activité d’ENaC et de la Na⁺/K⁺-ATPase : davantage de Na⁺ est réabsorbé, tandis que la sécrétion de K⁺ est favorisée. Dans certaines cellules intercalaires, elle peut aussi favoriser la sécrétion de H⁺.

L’eau ne suit le Na⁺ que si le segment est perméable à l’eau et si des gradients le permettent ; l’ADH joue donc un rôle complémentaire. Dire « aldostérone = rétention d’eau automatique » est trop sommaire.

## Corriger l’expérience d’extrait rénal

L’activité pressive issue d’un extrait de rein ischémique correspond historiquement à la **rénine**, qui déclenche la formation d’angiotensine dans le plasma. L’extrait rénal n’est pas simplement « de l’angiotensine ». Sans angiotensinogène et cascade plasmatique, l’interprétation change. Cette correction relie proprement l’expérience à la physiologie moléculaire.

> **Corrections de la source.** Angiotensinogène = substrat, rénine = enzyme rénale, ECA entre Ang I et Ang II, aldostérone sur distal/collecteur avec effets Na⁺/K⁺/H⁺, extrait rénal actif = rénine.

> **Astuce mémoire :** **R-A-I-E-A-II-A** : rénine, angiotensinogène, I, ECA, II, aldostérone.
`,
    keyPoint: "Perfusion↓, NaCl à la macula densa↓ ou sympathique β1↑ → rénine → Ang I → ECA → Ang II → aldostérone et conservation de Na⁺.",
    example: "Une sténose d’artère rénale réduit la perfusion : la rénine augmente même si la pression systémique peut ensuite devenir élevée.",
    methodSteps: [
      "Chercher pression afférente, NaCl à la macula densa et signal β1.",
      "Distinguer l’enzyme rénine du substrat angiotensinogène.",
      "Insérer obligatoirement Ang I puis ECA avant Ang II.",
      "Relier aldostérone aux transports distaux de Na⁺, K⁺ et H⁺.",
    ],
    interaction: timeline(
      "Dérouler la cascade rénale",
      "Suis une baisse de perfusion depuis l’appareil juxtaglomérulaire jusqu’à la correction du volume et de la pression.",
      [
        { label: "Perfusion ou NaCl distal en baisse", shortLabel: "Signal", detail: "Cellules granulaires, macula densa et sympathique β1 convergent vers la libération de rénine." },
        { label: "Rénine libérée", shortLabel: "Enzyme", detail: "La rénine clive l’angiotensinogène circulant." },
        { label: "Angiotensine I", shortLabel: "Précurseur", detail: "Ce peptide intermédiaire doit encore être transformé." },
        { label: "ECA", shortLabel: "Conversion", detail: "L’enzyme de conversion forme l’angiotensine II." },
        { label: "Angiotensine II", shortLabel: "Signal majeur", detail: "Vasoconstriction, soif, ADH et sécrétion d’aldostérone sont favorisées." },
        { label: "Aldostérone", shortLabel: "Effecteur distal", detail: "Na⁺ est davantage repris ; K⁺ et, selon les cellules, H⁺ sont davantage sécrétés." },
      ],
      "La cascade conserve Na⁺ et soutient la pression, mais une activation chronique excessive peut devenir pathologique.",
    ),
    questions: questions(58, [
      ["Quelles cellules libèrent la rénine ?", "Les cellules juxtaglomérulaires granulaires", ["Les podocytes", "Les cellules de la vessie", "Les hématies"], "Elles entourent surtout l’artériole afférente.", "Schéma • pages 9-10"],
      ["Que détecte la macula densa ?", "La livraison de NaCl dans le tube distal", ["La glycémie dans l’uretère", "La taille du rein", "La pression dans la vessie"], "Elle fournit un signal tubuloglomérulaire.", "Régulation • page 9"],
      ["Quel signal nerveux stimule la rénine ?", "Le sympathique via β1", ["Le vague via M2", "Le moteur somatique", "Aucun nerf possible"], "Les récepteurs β1 sont portés par les cellules granulaires.", "Enrichissement du SRAA"],
      ["Quel est le statut de la rénine ?", "Une enzyme protéolytique", ["Un substrat hépatique", "Une aquaporine", "Un ion"], "Elle clive l’angiotensinogène.", "Correction • page 9"],
      ["Quel est le statut de l’angiotensinogène ?", "Un substrat protéique surtout hépatique", ["Une enzyme rénale", "Un canal à eau", "Une cellule endocrine"], "La source le qualifie à tort d’enzyme.", "Correction • page 9"],
      ["Que produit directement la rénine ?", "L’angiotensine I", ["L’angiotensine II directement", "L’aldostérone", "AQP2"], "L’ECA assure l’étape suivante.", "Cascade • page 9"],
      ["Que fait l’ECA ?", "Elle transforme Ang I en Ang II", ["Elle transforme Na⁺ en K⁺", "Elle produit la rénine", "Elle filtre l’albumine"], "Cette étape manquait dans la source.", "Cascade corrigée • page 9"],
      ["Où l’aldostérone est-elle produite ?", "Dans le cortex surrénalien", ["Dans la neurohypophyse", "Dans le glomérule", "Dans le foie"], "La zone glomérulée la sécrète.", "Régulation hormonale • pages 9-10"],
      ["Quel effet distal a l’aldostérone ?", "Na⁺ réabsorbé davantage et K⁺ sécrété davantage", ["Glucose filtré moins", "AQP2 détruite", "Toutes les protéines excrétées"], "ENaC et Na/K-ATPase sont notamment stimulés.", "Effets • pages 9-10"],
      ["Pourquoi l’eau ne suit-elle pas toujours automatiquement le Na⁺ ?", "La perméabilité à l’eau du segment doit le permettre", ["L’eau est une protéine", "Le sodium ne se réabsorbe jamais", "La vessie décide seule"], "L’ADH et le gradient sont complémentaires.", "Nuance physiologique"],
      ["Quelle substance active contient surtout l’extrait rénal ischémique historique ?", "La rénine", ["L’angiotensine II déjà prête", "L’aldostérone", "L’ADH"], "La rénine agit sur le substrat plasmatique.", "Expérience • pages 15-16"],
    ], short("Écris le sigle de l’enzyme qui transforme Ang I en Ang II.", ["ECA", "enzyme de conversion de l’angiotensine", "ACE"], "L’ECA réalise l’étape Ang I → Ang II.", "Cascade corrigée • page 9")),
    corrections: [
      "L’angiotensinogène est rétabli comme substrat hépatique et la rénine comme enzyme libérée par les cellules juxtaglomérulaires.",
      "L’étape angiotensine I puis ECA puis angiotensine II est ajoutée explicitement.",
      "L’aldostérone est reliée au distal/collecteur, à la réabsorption de Na⁺ et aux sécrétions de K⁺ et H⁺ ; l’extrait rénal est identifié comme rénine.",
    ],
  },
  {
    id: "renal-acid-base-regulation",
    title: "Stabiliser le pH du milieu intérieur",
    summary: "Relier tampons, poumons et rein, puis expliquer réabsorption du bicarbonate, excrétion d’acides et ammoniogenèse.",
    pages: "4-5 et 9-10",
    section: "Fonctions rénales et maintien de la composition du milieu intérieur",
    durationMinutes: 34,
    xp: 100,
    body: String.raw`
## Une plage étroite mais non immobile

Le pH artériel normal se situe approximativement entre **7,35 et 7,45**. Cette plage ne signifie pas que toutes les urines doivent avoir le même pH : le rein peut produire une urine plus acide ou plus alcaline afin de stabiliser le plasma. Les tampons chimiques agissent immédiatement, les poumons règlent rapidement le CO₂ et les reins ajustent sur une durée plus longue bicarbonate et acides non volatils.

Le système bicarbonate peut être résumé par :

$$CO_2+H_2O\rightleftharpoons H_2CO_3\rightleftharpoons H^++HCO_3^-$$

Les poumons modulent $CO_2$ ; les reins récupèrent le bicarbonate filtré et génèrent du bicarbonate « neuf » lorsque des H⁺ sont excrétés avec des tampons urinaires.

## Réabsorber le bicarbonate filtré

Dans le tube proximal, la sécrétion de H⁺ dans la lumière permet de convertir le bicarbonate filtré en CO₂ et eau, avec l’aide de l’anhydrase carbonique. Le CO₂ diffuse dans la cellule, où la réaction inverse reforme H⁺ et $HCO_3^-$. Le H⁺ peut être recyclé vers la lumière tandis que le bicarbonate gagne le sang. Il s’agit fonctionnellement d’une **récupération du bicarbonate filtré**, pas d’une excrétion massive de bicarbonate en situation normale.

## Excréter la charge acide

Les segments distaux et collecteurs sécrètent des H⁺, notamment par les cellules intercalaires de type A. Les H⁺ libres ne peuvent pas à eux seuls porter toute la charge acide sans faire chuter excessivement le pH urinaire. Ils sont tamponnés par le phosphate et par l’ammoniac $NH_3$, qui capte un proton pour former $NH_4^+$ piégé dans la lumière.

Le rein produit de l’ammonium à partir de la glutamine, surtout dans le proximal ; ce mécanisme augmente lors d’une acidose chronique. L’ammonium présent dans l’urine ne prouve donc pas simplement qu’il était absent du plasma puis « créé par filtration » : il résulte en grande partie du métabolisme et des transports tubulaires.

L’aldostérone peut favoriser la sécrétion distale de H⁺ ; elle ne règle toutefois pas seule tout l’équilibre acido-basique. Une perte rénale de bicarbonate, une excrétion acide insuffisante ou une ventilation inadaptée ont des conséquences différentes qu’il faut distinguer.

## Une méthode de diagnostic

Devant une baisse du pH sanguin, on parle d’acidémie. On examine ensuite bicarbonate et pression partielle de CO₂ pour déterminer la composante métabolique ou respiratoire. À ce niveau, l’objectif est surtout de relier la réponse rénale attendue : récupérer $HCO_3^-$ et augmenter l’excrétion nette d’acide. L’urine peut alors devenir plus acide et plus riche en ammonium.

> **Corrections pédagogiques.** Le pH sanguin est chiffré 7,35–7,45 ; bicarbonate récupéré et bicarbonate neuf sont distingués ; l’ammonium urinaire est relié à l’ammoniogenèse et au piégeage de H⁺.

> **Astuce mémoire :** poumons sortent l’acide volatil CO₂ ; reins gardent la base et sortent l’acide fixe.
`,
    keyPoint: "Le rein maintient le pH 7,35–7,45 en récupérant le bicarbonate filtré et en excrétant H⁺ sous forme tamponnée, notamment NH₄⁺.",
    example: "Lors d’une acidose métabolique durable, la réabsorption de bicarbonate et l’ammoniogenèse augmentent afin d’accroître l’excrétion nette d’acide.",
    methodSteps: [
      "Comparer le pH sanguin à la plage 7,35–7,45.",
      "Séparer la réponse rapide du poumon et la réponse durable du rein.",
      "Suivre le bicarbonate filtré puis la sécrétion tubulaire de H⁺.",
      "Ajouter phosphate et NH₃/NH₄⁺ pour expliquer l’excrétion acide.",
    ],
    interaction: diagram(
      "Explorer le bilan acido-basique rénal",
      "Choisis un mécanisme et indique s’il conserve une base, excrète un acide ou coopère avec le poumon.",
      "pH artériel 7,35–7,45",
      "Tampons, ventilation et transport rénal agissent à des vitesses différentes pour stabiliser la concentration en H⁺.",
      [
        { id: "buffers", label: "Tampons", role: "Limiter immédiatement", detail: "Bicarbonate, protéines et phosphate captent ou libèrent rapidement des H⁺.", group: "Secondes" },
        { id: "lungs", label: "Poumons", role: "Régler le CO₂", detail: "La ventilation modifie la composante volatile de l’équilibre bicarbonate.", group: "Minutes" },
        { id: "bicarb", label: "Bicarbonate filtré", role: "Récupérer", detail: "Le proximal récupère presque tout le bicarbonate filtré en situation normale.", group: "Rein" },
        { id: "distal-h", label: "H⁺ distal", role: "Sécréter", detail: "Les cellules intercalaires acidifient l’urine et ajoutent du bicarbonate au sang.", group: "Rein" },
        { id: "ammonium", label: "NH₄⁺", role: "Piéger l’acide", detail: "L’ammoniogenèse permet d’excréter davantage de charge acide sans H⁺ libre excessif.", group: "Rein" },
      ],
      "Le pH urinaire peut varier justement parce que le rein protège la plage beaucoup plus étroite du pH sanguin.",
    ),
    questions: questions(69, [
      ["Quelle plage correspond au pH artériel normal ?", "7,35 à 7,45", ["5 à 6", "7,8 à 8,2", "0 à 14 sans plage"], "Le plasma artériel est légèrement alcalin.", "Maintien du milieu intérieur • pages 9-10"],
      ["Quel organe règle rapidement le CO₂ ?", "Le poumon", ["La vessie", "Le cortex surrénalien", "Le pelvis"], "La ventilation modifie l’acide volatil.", "Coordination homéostatique"],
      ["Que fait le proximal du bicarbonate filtré ?", "Il en récupère presque tout", ["Il l’excrète toujours entièrement", "Il le transforme en glucose", "Il le bloque au glomérule"], "Le mécanisme implique sécrétion et recyclage de H⁺.", "Fonctions tubulaires • page 5"],
      ["Quelle cellule acidifie notamment l’urine distale ?", "La cellule intercalaire de type A", ["Le podocyte", "L’hématie", "La cellule musculaire"], "Elle sécrète des H⁺ dans le collecteur.", "Enrichissement acido-basique"],
      ["Pourquoi faut-il des tampons urinaires ?", "Pour excréter des H⁺ sans pH urinaire invivable", ["Pour empêcher toute filtration", "Pour fabriquer des globules", "Pour rendre le sang acide"], "Phosphate et ammoniac portent la charge acide.", "Rôle rénal • pages 4-5"],
      ["Quelle forme piège un proton avec NH₃ ?", "$NH_4^+$", ["$NaCl$", "$CO_2$ uniquement", "$O_2$"], "$NH_3+H^+\rightarrow NH_4^+$.", "Ammonium urinaire • page 4"],
      ["D’où vient une grande part de l’ammonium urinaire ?", "De l’ammoniogenèse tubulaire à partir de glutamine", ["De globules filtrés", "Du pelvis", "De l’ADH"], "Le proximal produit NH₄⁺ et bicarbonate.", "Interprétation corrigée • page 4"],
      ["Que doit faire le rein lors d’une acidose durable ?", "Augmenter conservation du bicarbonate et excrétion nette d’acide", ["Excréter tout le bicarbonate", "Arrêter l’ammonium", "Bloquer l’eau au glomérule"], "La réponse tend à corriger l’acidémie.", "Application homéostatique"],
      ["Pourquoi le pH urinaire varie-t-il davantage que le pH sanguin ?", "Le rein modifie l’urine pour protéger le plasma", ["Le sang n’a aucun tampon", "L’urine est toujours neutre", "Le poumon filtre l’urine"], "L’effecteur peut varier sa sortie pour stabiliser l’intérieur.", "Conclusion • pages 9-10"],
    ], short("Nomme l’ion base majeur du tampon carbonique sanguin.", ["bicarbonate", "ion bicarbonate", "HCO3-", "HCO₃⁻"], "Le bicarbonate est la base conjuguée du système carbonique.", "Équilibre acido-basique")),
    corrections: [
      "La plage physiologique du pH artériel est explicitée à 7,35–7,45 au lieu d’une notion vague de constance.",
      "La récupération du bicarbonate filtré est distinguée de la génération de bicarbonate neuf liée à l’excrétion d’acide.",
      "L’ammonium urinaire est relié à l’ammoniogenèse tubulaire et non à une simple apparition sans mécanisme.",
    ],
  },
  {
    id: "renal-experiments-critical-analysis",
    title: "Auditer les expériences officielles",
    summary: "Évaluer protocoles, axes, repères, vrai/faux et corrections officielles afin de construire une conclusion fondée sur les données.",
    pages: "8-16",
    section: "Applications, exercices et situation d’évaluation",
    durationMinutes: 38,
    xp: 110,
    kind: "practice",
    body: String.raw`
## Une grille d’analyse en cinq questions

Pour chaque expérience, on demande : **quelle variable est manipulée ? quelle variable est mesurée ? quelle unité ? quel témoin ? quelle conclusion est réellement permise ?** Cette grille évite de recopier une conclusion parce qu’elle figure sous un schéma.

La courbe suivant une charge de NaCl à 20 ‰ présente un axe ou une légende réutilisant à tort « après injection d’eau ». On ne doit donc pas mélanger charge saline et charge hydrique. Après un apport hypertonique, l’osmolarité tend à augmenter, ce qui stimule ADH et soif ; la diurèse peut d’abord diminuer. Le devenir ultérieur dépend aussi de l’excrétion de Na⁺, du volume et des hormones. Le tracé doit être décrit avec prudence, car le libellé source est fautif.

## Corriger les items sans les effacer

Dans le vrai/faux de la page 10, plusieurs formulations sont trop absolues. Un rein « élimine les déchets » mais ne se résume pas à une passoire ; l’aldostérone conserve Na⁺ tout en favorisant K⁺ et parfois H⁺ ; l’ADH agit surtout sur l’eau mais modifie indirectement la concentration urinaire. Une réponse rigoureuse doit justifier et nuancer plutôt que cocher mécaniquement.

La correction à trous de la page 11 inverse les réponses **12 et 13**. On rétablit l’ordre à partir de la syntaxe et du mécanisme décrit, au lieu de conserver un corrigé contradictoire. Sur un schéma de la page 14, le **repère 12 manque** ou n’est pas exploitable : il faut le signaler, ne pas inventer une structure. L’évaluation doit accepter l’identification des repères visibles et expliquer l’impossibilité du douzième.

La page 15 propose une question sur le lieu de réabsorption du glucose sans aucune bonne option ; sa correction choisit le collecteur. La réponse scientifique est le **tube proximal**. La même série doit préserver le sens des transferts : sécrétion du sang vers la lumière, réabsorption en sens inverse.

## Exploiter ce qui manque

La situation finale annonce une courbe expérimentale, mais la courbe est absente des pages fournies. On ne peut ni relever un maximum ni calculer une pente imaginaire. Une bonne réponse distingue les données disponibles des données manquantes, propose les axes attendus et indique quelles observations permettraient de tester l’hypothèse.

L’expérience d’extrait rénal doit aussi être corrigée : le facteur rénal actif est la **rénine**, non une angiotensine déjà produite dans le rein. La rénine agit sur l’angiotensinogène plasmatique ; l’ECA intervient ensuite.

## Formuler une conclusion robuste

Une conclusion contient une tendance observée, les limites du dispositif, puis un mécanisme compatible. Elle ne transforme pas une corrélation en preuve unique. Par exemple : « après la charge hydrique, le débit augmente avec retard ; cette observation est compatible avec une baisse d’ADH, mais le protocole ingestion/injection et l’absence d’osmolarité mesurée limitent l’interprétation ».

> **Corrections auditées.** Axe NaCl fautif, vrai/faux nuancés, réponses 12/13 inversées, repère 12 absent, aucune bonne option pour le glucose, courbe finale absente, extrait rénal = rénine.

> **Astuce mémoire :** données présentes, conclusion permise, limite explicite — jamais de mesure inventée.
`,
    keyPoint: "Une analyse critique décrit les données, contrôle axes et unités, repère les informations manquantes, puis limite sa conclusion à ce que le protocole permet.",
    example: "Courbe finale absente : on peut proposer débit en mL/min et temps en min comme axes attendus, mais aucune valeur ne doit être relevée ou calculée.",
    methodSteps: [
      "Identifier manipulation, mesure, axes, unités et témoin.",
      "Comparer l’énoncé, la figure et le corrigé pour repérer une contradiction.",
      "Corriger scientifiquement en conservant une trace explicite de l’erreur.",
      "Séparer résultats observés, interprétation plausible et données manquantes.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Poste d’audit original",
      title: "Contrôler une preuve expérimentale",
      instruction: "Sélectionne chaque contrôle avant d’accepter une conclusion du document.",
      viewBox: "0 0 960 420",
      caption: "Grille pédagogique originale issue de l’audit des pages 8-16 ; aucune figure source n’est republiée.",
      shapes: missionShapes,
      hotspots: missionHotspots,
      observation: "Le même cadre sert à corriger un axe erroné, une option absente, un repère manquant ou une courbe non fournie sans inventer de donnée.",
    },
    questions: questions(78, [
      ["Quelle erreur touche la courbe de charge saline ?", "L’axe ou la légende mentionne encore l’eau", ["Elle mesure le pH", "Elle n’a aucun temps", "Elle utilise des protéines"], "Le libellé a été repris d’une autre expérience.", "Charge de NaCl • page 8"],
      ["Quel effet initial est compatible avec une charge hypertonique ?", "Une hausse d’osmolarité et d’ADH", ["Une baisse certaine de tout sodium", "Une disparition du volume", "Une inhibition obligatoire de la soif"], "Le signal osmotique favorise la conservation d’eau.", "Interprétation • pages 8-9"],
      ["Que faire d’un vrai/faux trop absolu ?", "Justifier et préciser les conditions", ["Cocher sans lire", "Le supprimer sans trace", "Inventer un résultat"], "La physiologie dépend souvent du contexte.", "Vrai/faux • page 10"],
      ["Quelle anomalie touche la correction à trous ?", "Les réponses 12 et 13 sont inversées", ["Toutes les réponses sont absentes", "Le chapitre change de titre", "Le rein est remplacé par le cœur"], "La syntaxe et le mécanisme rétablissent l’ordre.", "Exercice • page 11"],
      ["Que faire du repère 12 absent ?", "Signaler qu’il est inexploitable", ["Inventer son emplacement", "Renommer le repère 11", "Déplacer le catalogue"], "Une donnée absente ne doit pas être fabriquée.", "Schéma • page 14"],
      ["Quelle est la réponse scientifique à l’item glucose ?", "Le tube proximal", ["Le collecteur", "L’uretère", "Le pelvis"], "Aucune option source n’était correcte.", "QCM • page 15"],
      ["Quel est le sens d’une sécrétion ?", "Du sang vers la lumière", ["De la lumière vers le sang", "Du pelvis vers le cortex", "De l’urine vers l’artère"], "Le sens inverse est une réabsorption.", "Schéma • page 15"],
      ["Comment traiter la courbe finale absente ?", "Ne relever aucune valeur et indiquer les données nécessaires", ["Dessiner des valeurs comme si elles étaient fournies", "Conclure sans axe", "Ignorer la limite"], "La transparence sur les données manquantes est obligatoire.", "Situation finale • pages 15-16"],
      ["Quel facteur actif vient de l’extrait rénal ischémique ?", "La rénine", ["L’angiotensine II déjà formée", "L’ADH", "Le bicarbonate"], "La cascade plasmatique produit ensuite les angiotensines.", "Expérience • pages 15-16"],
      ["Quelle phrase constitue une observation ?", "Le débit passe approximativement de 1 à 4,3 mL/min", ["L’ADH est forcément la seule cause", "Le protocole est parfait", "Le rein veut diluer le sang"], "Une observation décrit le tracé sans finalité ni cause.", "Courbe • page 6"],
    ], short("Nomme le document expérimental annoncé mais absent à la fin du PDF.", ["courbe", "la courbe", "courbe expérimentale", "le graphique"], "Les pages 15-16 annoncent une courbe qui n’est pas fournie.", "Situation d’évaluation • pages 15-16")),
    corrections: [
      "La page 11 contient les réponses 12 et 13 inversées ; leur ordre est rétabli à partir du mécanisme et de la syntaxe.",
      "La page 14 présente un repère 12 manquant ; la page 15 pose le glucose sans aucune option correcte, corrigé par le tube proximal.",
      "La page 15 annonce une courbe absente : elle n’est pas inventée ; l’extrait rénal des pages 15-16 est identifié comme source de rénine.",
    ],
  },
  {
    id: "internal-environment-final-mission",
    title: "Piloter une mission d’homéostasie rénale",
    summary: "Mobiliser filtration, ADH, SRAA, transports et équilibre acido-basique pour interpréter un dossier clinique et expérimental complet.",
    pages: "1-16",
    section: "Mission de synthèse inspirée des situations et exercices officiels",
    durationMinutes: 42,
    xp: 140,
    kind: "challenge",
    body: String.raw`
## Dossier : chaleur, diarrhée et baisse de pression

Une élève arrive au centre de santé après une journée très chaude accompagnée de diarrhée. Elle a soif, sa pression artérielle a diminué, son débit urinaire est faible et son urine est concentrée. Le laboratoire mesure une osmolarité plasmatique élevée et une baisse du bicarbonate. Le dossier demande d’expliquer les réponses qui protègent son milieu intérieur, puis d’anticiper l’effet d’une réhydratation adaptée.

Première étape : distinguer les perturbations. La perte d’eau tend à augmenter l’osmolarité ; la perte de volume diminue le remplissage et la pression ; la perte digestive de bicarbonate favorise une acidose métabolique. Une seule hormone ne peut donc pas expliquer tout le tableau.

## Réponse hydrique

L’hyperosmolarité active les osmorécepteurs hypothalamiques et la soif. La baisse de volume et de pression renforce, par les voies baro- et voloréceptrices, la libération d’ADH synthétisée dans l’hypothalamus puis libérée par la neurohypophyse. ADH–V2 augmente AQP2 au collecteur : davantage d’eau est reprise, le débit urinaire diminue et l’urine se concentre.

## Réponse sodée et circulatoire

La faible perfusion rénale, le sympathique β1 et une faible livraison de NaCl à la macula densa stimulent la rénine. La cascade correcte est angiotensinogène → Ang I → ECA → Ang II. Ang II soutient la pression, la soif, l’ADH et l’aldostérone. L’aldostérone augmente la reprise distale de Na⁺ et favorise la sécrétion de K⁺ et H⁺. Le suivi doit donc inclure la kaliémie ; une réponse utile au volume peut avoir un coût électrolytique.

## Réponse acido-basique

La baisse du bicarbonate oriente vers une composante métabolique. Les tampons agissent immédiatement et la ventilation peut compenser en diminuant le CO₂. Le rein, si sa perfusion et sa fonction restent suffisantes, récupère le bicarbonate filtré, augmente l’ammoniogenèse et excrète davantage de H⁺ tamponnés. On ne promet pas une correction instantanée : la réponse rénale prend du temps et une hypoperfusion sévère peut la limiter.

## Lire deux variables sans les confondre

La courbe interactive redessine l’**osmolarité plasmatique** réellement visible à la page 12 après un apport hydrique : elle part près de $300\ \mathrm{mOsm/L}$, atteint un minimum proche de $291\ \mathrm{mOsm/L}$ vers 60 minutes, puis revient vers $300\ \mathrm{mOsm/L}$ autour de 150 minutes. Le **débit urinaire**, exprimé en mL/min, est traité dans le dossier clinique et les questions, mais il n’est pas superposé sur le même axe : deux unités différentes exigent deux échelles ou deux graphiques. La baisse d’osmolarité est compatible avec la dilution suivie de l’excrétion de l’excès d’eau ; elle n’autorise pas à calculer un débit à partir de la seule concentration.

La solution de réhydratation doit apporter eau et électrolytes de façon adaptée. Une eau très rapide et sans surveillance peut corriger le volume mais modifier trop vite l’osmolarité selon le contexte. La mission exige donc des mesures répétées : pression, fréquence, débit urinaire, Na⁺, K⁺, bicarbonate, pH et osmolarité.

## Réponse structurée attendue

1. nommer chaque perturbation et son unité ;
2. construire séparément la boucle ADH et la cascade SRAA ;
3. appliquer excrétion = filtration − réabsorption + sécrétion ;
4. relier bicarbonate, H⁺ et NH₄⁺ ;
5. décrire la courbe sans inventer la courbe absente du PDF ;
6. proposer un suivi qui permette de tester la correction.

> **Corrections intégrées.** ADH hypothalamique, glucose proximal, extrait rénal = rénine, ECA obligatoire, unités mL/min et mOsm/L distinctes, sécrétion sang→lumière et données absentes non inventées.

> **Astuce mémoire finale — O-V-pH :** contrôler **o**smolarité, **v**olume/pression et **pH** avec des boucles coordonnées.
`,
    keyPoint: "Une mission d’homéostasie sépare osmolarité, volume et pH, puis coordonne ADH, SRAA et transports rénaux avec des unités contrôlées.",
    example: "Déshydratation hyperosmolaire et hypovolémique : ADH et SRAA augmentent ensemble, tandis que le rein conserve eau/Na⁺ et adapte l’excrétion acide.",
    methodSteps: [
      "Dresser un tableau variable–valeur–unité–sens de variation.",
      "Construire séparément la boucle ADH et la cascade rénine–Ang II–aldostérone.",
      "Relier chaque hormone à un segment et à un flux orienté.",
      "Conclure par les mesures de suivi et les limites des données disponibles.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "Suivre l’osmolarité après l’apport hydrique",
      instruction: "Déplace le repère sur la courbe officielle redessinée de la page 12 et distingue l’osmolarité du débit urinaire étudié séparément.",
      formula: "Osmolarité plasmatique O(t), en mOsm/L",
      formulaTex: "O(t)",
      rule: { kind: "samples", points: [[0, 300], [20, 298], [40, 294], [60, 291], [80, 292], [100, 295], [120, 297], [150, 300], [180, 300]] },
      window: { xMin: 0, xMax: 180, yMin: 289, yMax: 303 },
      guides: [
        { kind: "horizontal", value: 300, label: "valeur initiale ≈ 300 mOsm/L" },
        { kind: "vertical", value: 60, label: "minimum ≈ 291 mOsm/L" },
      ],
      marker: { min: 0, max: 180, step: 5, initial: 60 },
      observation: "L’osmolarité diminue puis revient vers 300 mOsm/L ; le débit urinaire doit être mesuré en mL/min sur une série distincte et ne se déduit pas de cette courbe.",
    },
    questions: questions(88, [
      ["Quelle variable augmente lors d’une perte d’eau prédominante ?", "L’osmolarité plasmatique", ["Le bicarbonate obligatoirement", "Le débit urinaire", "Le volume extracellulaire"], "La perte d’eau concentre les solutés.", "Mission inspirée des pages 6-8"],
      ["Quel signal explique l’ADH malgré une hémorragie isotone ?", "La baisse de volume et de pression", ["Une hyperglycémie obligatoire", "La taille des protéines", "Le glucose collecteur"], "Les signaux non osmotiques stimulent l’ADH.", "Applications • pages 12-13"],
      ["Quel enchaînement hormonal est exact ?", "Rénine → Ang I → ECA → Ang II → aldostérone", ["ADH → glucose → rénine", "Ang II → angiotensinogène → ECA", "Aldostérone → rénine → AQP2"], "Chaque molécule conserve son rôle.", "Cascade • pages 9-10"],
      ["Quel transport l’aldostérone favorise-t-elle ?", "Réabsorption de Na⁺ et sécrétion de K⁺", ["Filtration des hématies", "Réabsorption du glucose au collecteur", "Excrétion de toutes les protéines"], "Elle agit surtout sur le néphron distal et le collecteur.", "Régulation saline • pages 9-10"],
      ["Quelle unité exprime l’osmolarité ?", "mOsm/L", ["mL/min", "bpm", "kg de pression"], "L’osmolarité est une concentration en particules osmotiques.", "Mission et courbes"],
      ["Quelle unité exprime le débit urinaire ?", "mL/min", ["mOsm/L", "mol sans temps", "pH/min"], "C’est un volume par unité de temps.", "Courbes • pages 6 et 12"],
      ["Pourquoi ne pas superposer débit et osmolarité sur un axe unique ?", "Ils ont des unités et échelles différentes", ["Ils sont toujours égaux", "L’osmolarité n’existe pas", "Le débit est une hormone"], "Deux axes clairement étiquetés seraient nécessaires.", "Analyse quantitative"],
      ["Quelle réponse rénale accompagne une acidose métabolique ?", "Conserver HCO₃⁻ et excréter davantage d’acide", ["Excréter tout HCO₃⁻", "Bloquer NH₄⁺", "Supprimer la ventilation"], "Le rein augmente l’excrétion nette d’acide.", "Synthèse acido-basique"],
      ["Quel bilan décrit un soluté urinaire ?", "E = F − R + S", ["E = F + R − S", "E = R − F", "E = F seulement"], "Le résultat net combine les trois opérations.", "Fonctions • page 5"],
      ["Où le glucose filtré normal est-il repris ?", "Dans le tube proximal", ["Dans le canal collecteur", "Dans le pelvis", "Dans l’uretère"], "La mission reprend la correction du QCM source.", "QCM corrigé • page 15"],
      ["Que faut-il faire de la courbe absente du PDF ?", "Décrire les mesures nécessaires sans inventer de valeurs", ["Fabriquer un maximum officiel", "Choisir un axe au hasard", "La citer comme preuve complète"], "Une limite documentaire doit rester visible.", "Situation • pages 15-16"],
      ["Quel suivi est prioritaire avec l’aldostérone élevée ?", "La kaliémie", ["La couleur du cortex", "Le numéro de chapitre", "La taille du pelvis"], "La sécrétion de K⁺ peut modifier le potassium plasmatique.", "Synthèse hormonale"],
    ], short("Nomme les trois dimensions résumées par O-V-pH.", ["osmolarité volume pH", "osmolarité, volume et pH", "osmolarité volume pression et pH"], "La mission sépare osmolarité, état volumique/pression et équilibre acido-basique.", "Mission finale"),
    ),
    corrections: [
      "Le dossier dissocie osmolarité, volume/pression et pH au lieu d’attribuer toutes les variations à une seule hormone.",
      "Les unités mL/min et mOsm/L sont séparées et la courbe mobile ne prétend pas mesurer deux grandeurs incompatibles sur un axe.",
      "Toutes les corrections critiques du PDF sont mobilisées : ADH, glucose proximal, rénine, ECA, flux tubulaires et courbe absente.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtInternalEnvironmentPath: LearningPath = {
  id: "terminale-d-svt-l10-internal-environment",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Le milieu intérieur" },
  chapterNumber: 10,
  title: "Le maintien de la constance du milieu intérieur",
  description: "Le cours officiel intégral, hors situation d’apprentissage, de l’organisation rénale aux boucles ADH et rénine–angiotensine–aldostérone, avec expériences redessinées, mission originale et corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Relier rein, néphron et transports tubulaires à l’homéostasie du milieu intérieur",
    "Interpréter les expériences de charge hydrique et saline avec des axes et unités corrects",
    "Reconstruire les boucles ADH et rénine–angiotensine–aldostérone",
    "Intégrer volume, osmolarité, électrolytes et équilibre acido-basique dans une mission critique",
  ],
  modules: [
    {
      id: "internal-environment-mastery",
      title: "Maîtriser la constance du milieu intérieur",
      description: "Dix niveaux progressifs, de l’architecture rénale à une mission intégrée eau–sodium–pression–pH.",
      lessons: builtLevels,
    },
  ],
};
