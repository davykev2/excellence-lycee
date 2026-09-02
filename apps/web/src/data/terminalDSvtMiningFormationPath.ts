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

const sourceDocument = "Programme éducatif et guide d’exécution SVT Terminale D — DPFC";
const sourceUrl =
  "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";
const originalPracticeSource =
  "Guide DPFC SVT Terminale D • pp. 9, 19 et 44 • entraînement original";
const catalogPlacementCorrection =
  "La place 13 du catalogue suit la progression annuelle officielle SVT 2025-2026 (p. 14) ; le guide DPFC 2018 utilisé pour le contenu présente ce thème comme « Leçon 1 » et ne fonde donc pas cette numérotation.";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel = originalPracticeSource,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel = originalPracticeSource,
  points = 2,
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
];

const balancedChoice = (row: QuestionRow, ordinal: number): LessonQuestion => {
  const correctIndex = ordinal % 4;
  const options = [...row[2]];
  options.splice(correctIndex, 0, row[1]);
  return choice(row[0], options, correctIndex, row[3]);
};

const questions = (
  firstOrdinal: number,
  rows: QuestionRow[],
  shortQuestion: LessonQuestion,
): LessonQuestion[] => [...rows.map((row, index) => balancedChoice(row, firstOrdinal + index)), shortQuestion];

const diagram = (
  title: string,
  instruction: string,
  rootLabel: string,
  rootDetail: string,
  nodes: DiagramNodeItem[],
  observation: string,
): LessonInteraction => ({
  kind: "diagram",
  eyebrow: "Dossier géologique original",
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
  eyebrow: "Mécanisme à reconstruire",
  title,
  instruction,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
  observation,
});

const schema = (
  title: string,
  instruction: string,
  caption: string,
  shapes: SchemaShape[],
  hotspots: SchemaHotspot[],
  observation: string,
): LessonInteraction => ({
  kind: "schema",
  eyebrow: "Coupe géologique originale",
  title,
  instruction,
  viewBox: "0 0 760 440",
  caption,
  shapes,
  hotspots: hotspots as [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]],
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

const source = (seed: LevelSeed): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages: seed.pages,
  section: seed.section,
  fidelity: "adapted",
  corrections: [catalogPlacementCorrection, ...seed.corrections],
});

function adaptedLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed),
    concept: {
      eyebrow: `Niveau ${index + 1} • Adaptation enrichie du guide DPFC`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode géologique",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction:
        "Une réponse solide distingue les observations, leur interprétation et la conclusion. Elle ne transforme jamais un exemple ou un schéma pédagogique en inventaire exhaustif du sous-sol ivoirien.",
      steps: seed.methodSteps,
      example: { prompt: "Application guidée originale", work: seed.example, result: seed.keyPoint },
      tip:
        "Davy te rappelle : primaire et secondaire décrivent ici le mode de mise en place de l’or, pas l’âge, la qualité ni l’importance économique du gisement.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const vocabularyShapes: SchemaShape[] = [
  { shape: "path", d: "M30 74 L730 74 L730 390 L30 390 Z", tone: "soft" },
  { shape: "path", d: "M48 102 C164 62 250 118 350 88 C465 54 575 86 710 116 L710 358 C564 340 470 364 350 334 C238 306 142 350 48 320 Z", tone: "fill" },
  { shape: "path", d: "M102 332 C186 252 216 146 302 96", tone: "accent" },
  { shape: "path", d: "M124 344 C208 264 238 158 324 108", tone: "accent" },
  { shape: "path", d: "M113 338 C197 258 227 152 313 102", tone: "muted" },
  { shape: "circle", cx: 178, cy: 270, r: 9, tone: "accent" },
  { shape: "circle", cx: 218, cy: 220, r: 7, tone: "accent" },
  { shape: "circle", cx: 255, cy: 166, r: 8, tone: "accent" },
  { shape: "circle", cx: 420, cy: 215, r: 7, tone: "muted" },
  { shape: "circle", cx: 468, cy: 244, r: 6, tone: "muted" },
  { shape: "circle", cx: 515, cy: 198, r: 8, tone: "muted" },
  { shape: "line", x1: 350, y1: 88, x2: 350, y2: 334, tone: "outline" },
  { shape: "line", x1: 350, y1: 334, x2: 710, y2: 358, tone: "outline" },
  { shape: "text", x: 205, y: 126, content: "zone minéralisée", anchor: "middle" },
  { shape: "text", x: 528, y: 126, content: "roche encaissante", anchor: "middle" },
  { shape: "text", x: 380, y: 420, content: "Coupe conceptuelle — proportions non réelles", anchor: "middle" },
];

const vocabularyHotspots: SchemaHotspot[] = [
  { id: "host-rock", number: 1, label: "Roche encaissante", x: 574, y: 292, detail: "Roche qui contient ou entoure la minéralisation. Elle ne devient pas entièrement minerai pour autant." },
  { id: "fracture", number: 2, label: "Fracture", x: 218, y: 312, detail: "Discontinuité pouvant servir de voie de circulation et de lieu de dépôt à des substances minérales." },
  { id: "mineralization", number: 3, label: "Minéralisation", x: 255, y: 196, detail: "Présence localement accrue de minéraux ou d’éléments utiles par rapport à la roche environnante." },
  { id: "gangue", number: 4, label: "Gangue", x: 303, y: 135, detail: "Minéraux associés à la substance recherchée ; ils font partie de la roche à traiter." },
  { id: "ore-zone", number: 5, label: "Zone potentiellement minéralisée", x: 178, y: 270, detail: "Elle ne devient minerai qu’après caractérisation de sa concentration et de son exploitabilité dans des conditions données." },
  { id: "deposit", number: 6, label: "Gisement", x: 420, y: 215, detail: "Concentration naturelle délimitée dans l’espace. Gisement, mine et carrière ne sont pas des synonymes." },
];

const weatheringShapes: SchemaShape[] = [
  { shape: "path", d: "M28 88 C170 46 310 60 442 118 C548 164 626 174 732 158 L732 408 L28 408 Z", tone: "soft" },
  { shape: "path", d: "M28 180 C164 132 298 144 430 194 C550 238 634 242 732 226 L732 408 L28 408 Z", tone: "fill" },
  { shape: "path", d: "M28 284 C160 232 290 246 420 292 C542 334 638 342 732 322 L732 408 L28 408 Z", tone: "muted" },
  { shape: "path", d: "M180 348 C222 274 248 194 286 112", tone: "accent" },
  { shape: "path", d: "M196 356 C238 282 264 202 302 120", tone: "accent" },
  { shape: "circle", cx: 230, cy: 270, r: 8, tone: "accent" },
  { shape: "circle", cx: 258, cy: 216, r: 7, tone: "accent" },
  { shape: "circle", cx: 280, cy: 160, r: 6, tone: "accent" },
  { shape: "circle", cx: 342, cy: 190, r: 5, tone: "accent" },
  { shape: "circle", cx: 386, cy: 214, r: 5, tone: "accent" },
  { shape: "circle", cx: 430, cy: 238, r: 5, tone: "accent" },
  { shape: "line", x1: 318, y1: 142, x2: 380, y2: 180, tone: "outline" },
  { shape: "line", x1: 370, y1: 174, x2: 426, y2: 210, tone: "outline" },
  { shape: "line", x1: 416, y1: 204, x2: 478, y2: 242, tone: "outline" },
  { shape: "text", x: 104, y: 116, content: "surface", anchor: "middle" },
  { shape: "text", x: 602, y: 205, content: "versant", anchor: "middle" },
  { shape: "text", x: 242, y: 392, content: "filon primaire", anchor: "middle" },
  { shape: "text", x: 516, y: 390, content: "roche saine", anchor: "middle" },
];

const weatheringHotspots: SchemaHotspot[] = [
  { id: "fresh-rock", number: 1, label: "Roche saine", x: 536, y: 350, detail: "Roche encore peu altérée qui contient la structure minéralisée primaire." },
  { id: "primary-vein", number: 2, label: "Minéralisation primaire", x: 220, y: 320, detail: "Concentration restée dans ou près de sa roche de mise en place avant l’érosion." },
  { id: "weathering-front", number: 3, label: "Front d’altération", x: 320, y: 258, detail: "Zone où eau, air et variations physiques transforment progressivement les minéraux de la roche." },
  { id: "liberated-grains", number: 4, label: "Grains libérés", x: 344, y: 190, detail: "L’altération désagrège l’encaissant et peut libérer des grains d’or déjà présents ; elle ne crée pas l’élément or." },
  { id: "erosion", number: 5, label: "Érosion", x: 430, y: 238, detail: "Arrachement et déplacement des produits d’altération vers le bas du versant." },
  { id: "slope-storage", number: 6, label: "Stockage de versant", x: 592, y: 286, detail: "Une partie des débris peut s’accumuler temporairement avant d’atteindre un chenal." },
];

const placerShapes: SchemaShape[] = [
  { shape: "path", d: "M28 84 C156 128 258 108 372 82 C498 54 594 76 732 124 L732 410 L28 410 Z", tone: "soft" },
  { shape: "path", d: "M28 232 C166 260 278 238 378 208 C494 174 608 190 732 238 L732 410 L28 410 Z", tone: "fill" },
  { shape: "path", d: "M40 240 C170 286 276 266 382 230 C504 190 610 212 720 250", tone: "accent" },
  { shape: "path", d: "M54 288 C180 330 290 310 396 274 C516 232 620 254 706 292", tone: "muted" },
  { shape: "circle", cx: 214, cy: 292, r: 8, tone: "accent" },
  { shape: "circle", cx: 244, cy: 300, r: 6, tone: "accent" },
  { shape: "circle", cx: 275, cy: 294, r: 7, tone: "accent" },
  { shape: "circle", cx: 468, cy: 258, r: 6, tone: "accent" },
  { shape: "circle", cx: 492, cy: 266, r: 8, tone: "accent" },
  { shape: "circle", cx: 520, cy: 262, r: 5, tone: "accent" },
  { shape: "ellipse", cx: 355, cy: 278, rx: 34, ry: 10, tone: "outline" },
  { shape: "ellipse", cx: 420, cy: 282, rx: 26, ry: 8, tone: "outline" },
  { shape: "line", x1: 92, y1: 204, x2: 170, y2: 224, tone: "outline" },
  { shape: "line", x1: 584, y1: 220, x2: 668, y2: 244, tone: "outline" },
  { shape: "text", x: 110, y: 190, content: "amont", anchor: "middle" },
  { shape: "text", x: 652, y: 205, content: "aval", anchor: "middle" },
  { shape: "text", x: 380, y: 116, content: "chenal à énergie variable", anchor: "middle" },
  { shape: "text", x: 380, y: 390, content: "alluvions et pièges locaux", anchor: "middle" },
];

const placerHotspots: SchemaHotspot[] = [
  { id: "flow", number: 1, label: "Courant", x: 146, y: 220, detail: "Le courant transporte une charge dont la mobilité dépend de la taille, de la forme, de la densité et de l’énergie de l’eau." },
  { id: "coarse-bed", number: 2, label: "Fond grossier", x: 355, y: 278, detail: "Les irrégularités du lit peuvent retenir des particules denses quand la vitesse devient insuffisante." },
  { id: "gold-grains", number: 3, label: "Grains denses", x: 244, y: 300, detail: "Des grains d’or libérés peuvent se concentrer avec d’autres minéraux lourds ; ce dessin ne représente pas une teneur réelle." },
  { id: "bar", number: 4, label: "Barre alluviale", x: 492, y: 266, detail: "Une zone de dépôt apparaît quand l’énergie du courant baisse ; sa position peut évoluer avec les crues." },
  { id: "bedrock-trap", number: 5, label: "Piège du substratum", x: 420, y: 282, detail: "Fissure, creux ou obstacle du fond pouvant favoriser la rétention locale de particules lourdes." },
  { id: "alluvium", number: 6, label: "Alluvions", x: 612, y: 326, detail: "Sédiments déposés par le cours d’eau. Ils forment l’encaissant du dépôt secondaire, pas automatiquement un minerai exploitable." },
];

const levels: LevelSeed[] = [
  {
    id: "ivorian-mineral-resources-map",
    title: "Lire les ressources minières sur une carte",
    summary: "Localiser sans confondre ressource, indice, gisement et mine, ni présenter la liste du guide comme un inventaire actuel exhaustif.",
    pages: "p. 9 et p. 19",
    section: "Localiser les principales ressources minières de la Côte d’Ivoire",
    durationMinutes: 18,
    xp: 45,
    body: `
## Ce que demande le programme

Le guide DPFC demande de **localiser les principaux gisements miniers de la Côte d’Ivoire** à l’aide d’une carte. Il cite l’or, le diamant, le nickel, le cuivre, le manganèse, l’aluminium ou la bauxite, le titane, l’étain et le molybdène. La page 19 ajoute le **fer**, absent de la liste de la page 9. Cette différence doit être signalée : la liste est un cadrage curriculaire, pas une base géographique exhaustive et continuellement mise à jour.

Le seul site nommé dans l’exemple de situation est **Ity**, présenté comme gisement d’or. Le guide annonce une carte minière parmi les supports, mais ne la reproduit pas dans le PDF. Il serait donc trompeur d’inventer ici des points précis et de les qualifier d’officiels. L’interaction apprend plutôt à lire correctement toute carte sourcée remise par le professeur.

## Lire avant de mémoriser

Pour chaque symbole, relève cinq informations : la substance, la localité ou les coordonnées, la légende, la date et la source. Vérifie ensuite le statut représenté : **indice**, **gisement**, **mine active** ou simple zone favorable. Ces mots ne décrivent pas la même réalité.

| Terme cartographique | Ce qu’il autorise à conclure |
|---|---|
| indice | une observation justifie des recherches supplémentaires |
| gisement | une concentration naturelle a été reconnue et délimitée |
| mine | un site est aménagé pour extraire ; cela suppose plus qu’une présence géologique |
| ressource | terme général pour la substance utile ou le potentiel considéré |

> **Limite documentaire :** la carte interactive ci-dessous est une grille de lecture originale, pas la carte minière annoncée par le guide.
`,
    keyPoint: "localiser = lire symbole + lieu + légende + date + source + statut",
    example: "Une carte porte un symbole « Au » près d’une localité. On peut localiser une occurrence d’or selon cette carte, mais pas conclure sans légende qu’une mine y est active.",
    methodSteps: [
      "Lire le titre, la date, la source, l’échelle et l’orientation.",
      "Décoder la légende avant de placer une substance.",
      "Distinguer indice, gisement et mine.",
      "Formuler une localisation relative et limitée aux données visibles.",
    ],
    interaction: diagram(
      "Contrôler une carte minière avant de conclure",
      "Ouvre chaque carte du dossier et compose une phrase de localisation qui ne dépasse pas les preuves disponibles.",
      "Carte minière fournie",
      "Une carte ne parle qu’avec sa légende, sa date et sa source. Le guide annonce ce support sans le reproduire.",
      [
        { id: "title-source", label: "Titre et source", role: "Identifier le document", detail: "Le titre fixe le territoire et la source permet d’évaluer l’autorité du document." },
        { id: "date", label: "Date", role: "Situer l’état des données", detail: "Une carte ancienne peut rester utile pour apprendre, sans constituer un inventaire actuel." },
        { id: "legend", label: "Légende", role: "Décoder les symboles", detail: "Elle indique si un symbole représente une substance, un indice, un gisement ou une mine." },
        { id: "scale", label: "Échelle et nord", role: "Situer sans exagérer", detail: "Ils permettent une localisation relative ; un symbole large ne donne pas les limites exactes d’un corps minéralisé." },
        { id: "resource", label: "Substance", role: "Nommer la ressource", detail: "Or, diamant, nickel, cuivre, manganèse, bauxite, titane, étain et molybdène figurent page 9." },
        { id: "iron-difference", label: "Fer", role: "Repérer une divergence", detail: "Le fer est ajouté page 19 mais absent de la liste page 9 : les deux pages ne sont pas identiques." },
        { id: "ity", label: "Ity", role: "Conserver l’unique exemple nommé", detail: "L’exemple de situation cite Ity comme gisement d’or ; aucun autre point précis n’est fourni par ces pages." },
        { id: "status", label: "Statut", role: "Éviter un faux raccourci", detail: "Une ressource cartographiée n’implique pas automatiquement une exploitation en cours." },
      ],
      "La bonne réponse dit « selon la carte » et reste compatible avec la légende ; elle ne transforme jamais un symbole en mine active sans preuve.",
    ),
    questions: questions(0, [
      ["Quel élément faut-il lire avant d’interpréter un symbole minier ?", "La légende", ["La couleur du cahier", "Le nombre de pages du guide", "Le nom du professeur"], "La légende donne le sens documentaire du symbole."],
      ["Quel site aurifère le guide nomme-t-il dans son exemple de situation ?", "Ity", ["Une carte exhaustive de toutes les mines", "Un port pétrolier", "Une carrière sans localisation"], "Ity est le seul exemple de gisement explicitement nommé dans la situation."],
      ["Pourquoi la liste des substances ne doit-elle pas être présentée comme exhaustive et actuelle ?", "Elle cadre l’apprentissage et les pages 9 et 19 diffèrent déjà", ["Elle interdit toute carte", "Elle ne cite aucune substance", "Elle date chaque mine au jour près"], "Le fer apparaît page 19 mais pas page 9, et le guide ne fournit pas de mise à jour cartographique continue."],
      ["Qu’ajoute la page 19 à la liste de la page 9 ?", "Le fer", ["Le pétrole", "Le charbon", "L’uranium"], "Le fer figure dans la consigne de la page 19."],
      ["Que peut-on conclure d’un symbole « indice » ?", "Une observation justifie des recherches supplémentaires", ["Une mine fonctionne déjà", "La teneur est rentable", "Le gisement est entièrement délimité"], "Un indice ne suffit pas à démontrer un gisement exploitable."],
      ["Quelle formulation respecte le mieux une carte datée ?", "Selon cette carte et sa légende, la ressource est signalée dans cette zone", ["Cette mine est forcément active aujourd’hui", "Tout le territoire contient la même teneur", "Le symbole donne les limites exactes du minerai"], "La phrase précise la source et limite la conclusion à ce qu’elle montre."],
      ["Que faut-il distinguer d’un gisement ?", "Une mine en exploitation", ["La légende", "Le nord", "Une unité de longueur"], "Un gisement est géologique ; une mine est un aménagement d’extraction."],
      ["Pourquoi « aluminium ou bauxite » demande-t-il une précision ?", "L’aluminium est l’élément recherché et la bauxite une roche-minerai majeure", ["Les deux mots désignent toujours un même cristal pur", "La bauxite est un métal", "L’aluminium est un cours d’eau"], "Le rapprochement scolaire ne doit pas effacer la différence entre élément et roche-minerai."],
      ["Quel ensemble permet une localisation contrôlée ?", "Symbole, lieu, légende, date, source et statut", ["Couleur seule", "Titre seul", "Mémoire seule"], "Ces six éléments empêchent les conclusions excessives."],
    ], short("Quel gisement d’or est cité dans l’exemple de situation ?", ["Ity", "gisement d’Ity", "Ity en Côte d’Ivoire"], "Le guide cite explicitement le gisement d’or d’Ity.")),
    corrections: [
      "Aucun PDF complet de L13 ni aucune carte minière n’a été fourni : la carte annoncée par le guide n’est pas reconstituée comme document officiel.",
      "Le fer figure page 19 mais pas dans la liste de la page 9 ; la divergence est conservée et explicitée.",
      "La liste du guide est présentée comme curriculaire, non comme inventaire exhaustif et actuel des gisements ivoiriens.",
      "Aluminium et bauxite ne sont pas traités comme des synonymes stricts : l’un est un élément, l’autre une roche-minerai majeure.",
      "Toutes les questions et la grille de lecture sont des adaptations originales fondées sur les habiletés DPFC.",
    ],
  },
  {
    id: "host-rock-mineral-ore-vocabulary",
    title: "Distinguer encaissant, minéralisation et minerai",
    summary: "Construire un vocabulaire précis avant d’expliquer la formation d’un gisement.",
    pages: "p. 9 et p. 19",
    section: "Identifier les roches encaissantes et déduire les notions de roche encaissante et de minerai",
    durationMinutes: 20,
    xp: 55,
    body: `
## La roche encaissante n’est pas le minerai

Une **roche encaissante** est la roche qui contient ou entoure une minéralisation. Elle peut être traversée par une veine, bordée par une lentille minéralisée ou transformée près d’une fracture. Cela ne signifie pas que toute sa masse possède la même composition ni qu’elle est économiquement exploitable.

Une **minéralisation** est une concentration locale de minéraux ou d’éléments d’intérêt géologique. Un **gisement** est une concentration naturelle reconnue dans un volume délimité. Le mot **minerai** ajoute une condition : une roche ou une matière naturelle contient une substance utile en concentration et sous une forme permettant d’envisager son extraction dans des conditions techniques, économiques, sociales et environnementales données.

| Objet | Question utile |
|---|---|
| minéral | quelle espèce naturelle possède une composition et une structure déterminées ? |
| roche | quel assemblage naturel de minéraux observe-t-on ? |
| minéralisation | où la substance est-elle anormalement concentrée ? |
| roche encaissante | quelle roche contient ou entoure cette concentration ? |
| minerai | quelle partie caractérisée peut être considérée comme matière utile à traiter ? |

## Une notion dépendante des conditions

Deux zones ayant la même substance ne sont pas automatiquement deux minerais équivalents. La concentration, le volume, la continuité, la profondeur, la récupération possible et les contraintes du projet comptent. Le guide demande de **déduire** les notions ; la définition enrichie ici évite le raccourci « toute roche contenant un métal est un minerai ».

> **Adaptation :** la coupe interactive est conceptuelle. Elle n’est ni un relevé d’Ity ni un schéma reproduit du guide.
`,
    keyPoint: "encaissant = roche autour ; minéralisation = concentration géologique ; minerai = matière utile caractérisée",
    example: "Des grains d’or sont observés dans une veine de quartz. Le quartz et la roche voisine sont l’environnement géologique ; seule la zone suffisamment caractérisée peut être qualifiée de minerai.",
    methodSteps: [
      "Nommer séparément la substance, les minéraux et les roches.",
      "Décrire la position de la minéralisation dans son encaissant.",
      "Réserver le terme minerai à une zone caractérisée.",
      "Ne pas confondre gisement géologique et mine aménagée.",
    ],
    interaction: schema(
      "Explorer les mots d’une coupe minéralisée",
      "Active les six repères et classe chaque objet : structure, roche, minéralisation ou notion de ressource.",
      "Schéma pédagogique original d’une zone minéralisée ; aucune coupe réelle ni aucun scan n’est reproduit.",
      vocabularyShapes,
      vocabularyHotspots,
      "Les limites d’un minerai ne se lisent pas dans la seule couleur d’une coupe : elles nécessitent observations, échantillonnage et critères explicites.",
    ),
    questions: questions(9, [
      ["Qu’est-ce qu’une roche encaissante ?", "La roche qui contient ou entoure une minéralisation", ["Le métal pur extrait", "Une machine d’extraction", "Le cours d’eau qui transporte les grains"], "La définition porte sur la position géologique de la roche par rapport à la minéralisation."],
      ["Qu’est-ce qu’une minéralisation ?", "Une concentration locale de minéraux ou d’éléments d’intérêt géologique", ["Toute carte minière", "Toute roche de la croûte", "Une mine déjà rentable"], "Le terme décrit d’abord un fait géologique."],
      ["Pourquoi une roche contenant un peu d’or n’est-elle pas automatiquement un minerai ?", "Il faut caractériser concentration, volume et conditions d’extraction", ["L’or n’est jamais un minéral", "Toute roche est déjà une mine", "La roche encaissante est absente"], "La présence seule ne suffit pas à qualifier une matière utile exploitable."],
      ["Quelle différence sépare une roche d’un minéral ?", "Une roche est généralement un assemblage, un minéral une espèce naturelle définie", ["Une roche est toujours métallique", "Un minéral est toujours liquide", "Les deux mots sont strictement synonymes"], "La distinction porte sur l’organisation de la matière géologique."],
      ["Quel terme décrit une concentration naturelle délimitée ?", "Gisement", ["Échelle", "Légende", "Route"], "Le gisement est l’objet géologique, indépendamment de son éventuelle exploitation."],
      ["Quel rôle une fracture peut-elle jouer ?", "Servir de voie de circulation et de lieu de dépôt", ["Créer un élément chimique à partir de rien", "Transformer toute la région en minerai", "Prouver seule la rentabilité"], "Une fracture peut canaliser des fluides et favoriser une minéralisation."],
      ["Que désigne la gangue ?", "Les minéraux associés à la substance recherchée", ["Le métal vendu après raffinage", "La légende cartographique", "La roche entière du pays"], "Gangue et substance utile sont présentes ensemble dans la matière à caractériser."],
      ["Quelle proposition est la plus précise ?", "L’encaissant contient ou entoure la minéralisation", ["L’encaissant est toujours le minerai", "Le minerai est toujours un métal pur", "La mine précède le gisement"], "Cette relation spatiale correspond à la notion demandée par le guide."],
      ["De quoi la qualification de minerai dépend-elle aussi ?", "Des conditions techniques, économiques, sociales et environnementales", ["Du nom du village seulement", "De la couleur de la carte seulement", "D’une règle identique pour tous les projets"], "La notion ne se réduit pas à la présence d’un élément."],
    ], short("Comment nomme-t-on la roche qui contient ou entoure une minéralisation ?", ["roche encaissante", "l’encaissant", "encaissant"], "Le guide demande explicitement de déduire la notion de roche encaissante.")),
    corrections: [
      "La formulation brève « roches encaissantes des minerais » est précisée : l’encaissant contient ou entoure une minéralisation ou un gisement.",
      "Le minerai n’est pas défini par la seule présence d’une substance : concentration, volume et conditions d’extraction sont distingués.",
      "Gisement et mine ne sont pas employés comme synonymes.",
      "La coupe est une création pédagogique originale et ne représente aucun site ivoirien réel.",
      "Les évaluations sont des entraînements originaux, le guide ne fournissant aucun exercice rédigé pour cette leçon.",
    ],
  },
  {
    id: "primary-gold-deposit-formation",
    title: "Expliquer un gisement aurifère primaire",
    summary: "Relier source des substances, circulation géologique, précipitation et concentration dans la roche.",
    pages: "p. 9 et p. 19",
    section: "Expliquer le mécanisme de formation des gisements aurifères primaires",
    durationMinutes: 24,
    xp: 60,
    body: `
## Primaire signifie mis en place dans la roche

Dans le modèle scolaire, un **gisement aurifère primaire** correspond à une concentration d’or demeurée dans ou près de la roche où la minéralisation s’est mise en place. Le mot primaire ne signifie ni « le plus ancien », ni « le plus riche », ni « le meilleur ».

Un mécanisme fréquent est **hydrothermal**. De l’eau chaude circule en profondeur dans des fractures. Elle échange des substances avec les roches traversées et peut transporter l’or sous des formes dissoutes très peu visibles. Une variation de température, de pression ou de composition chimique réduit ensuite la capacité de transport : des minéraux précipitent dans les fractures ou dans des zones réactives. Des épisodes répétés peuvent construire une veine ou un réseau minéralisé.

## La chaîne causale à restituer

1. une source et des roches fournissent les substances mobilisables ;
2. des fractures rendent la circulation possible ;
3. un fluide transporte les substances ;
4. une modification des conditions provoque la précipitation ;
5. des dépôts répétés créent une concentration locale ;
6. l’ensemble reste contenu dans son encaissant : il est primaire.

Le quartz peut accompagner l’or dans une veine, mais toute veine de quartz n’est pas aurifère. Inversement, tous les gisements d’or du monde ne suivent pas exactement un seul scénario. Le guide demande un mécanisme de formation ; la séquence proposée est une **adaptation scientifique de niveau Terminale**, pas la description exhaustive d’Ity.

> **Précision :** les fluides déplacent des substances déjà présentes dans le système géologique ; ils ne créent pas l’élément or.
`,
    keyPoint: "source → circulation → transport → changement des conditions → précipitation → concentration primaire",
    example: "Une fracture recoupant une roche contient quartz et or. La présence conjointe ne suffit pas : on cherche les indices de circulation du fluide, puis les conditions qui ont favorisé le dépôt.",
    methodSteps: [
      "Identifier la roche et les fractures observées.",
      "Nommer le fluide comme agent de transport, non comme créateur de l’or.",
      "Relier précipitation à un changement de conditions.",
      "Conclure primaire seulement si la concentration reste dans son contexte de mise en place.",
    ],
    interaction: timeline(
      "Reconstituer une minéralisation aurifère primaire",
      "Parcours les six moments et formule à chaque fois la relation cause-conséquence.",
      [
        { label: "Roches sources", shortLabel: "Source", detail: "Les roches du système contiennent les éléments susceptibles d’être mobilisés." },
        { label: "Fracturation", shortLabel: "Voies", detail: "Les fractures créent des chemins préférentiels dans la roche encaissante." },
        { label: "Circulation hydrothermale", shortLabel: "Fluide", detail: "Un fluide chaud circule et interagit chimiquement avec les roches." },
        { label: "Transport", shortLabel: "Mobilité", detail: "Certaines substances restent mobiles tant que les conditions physico-chimiques le permettent." },
        { label: "Précipitation", shortLabel: "Dépôt", detail: "Refroidissement, baisse de pression ou réaction avec l’encaissant peuvent diminuer la solubilité." },
        { label: "Concentration primaire", shortLabel: "Gisement", detail: "Des dépôts répétés forment une zone minéralisée dans ou près de la roche de mise en place." },
      ],
      "La chronologie ne suffit pas : l’explication doit préciser pourquoi le transport cesse et pourquoi les minéraux se concentrent localement.",
    ),
    questions: questions(18, [
      ["Que signifie primaire pour un gisement d’or dans ce modèle ?", "La concentration reste dans ou près de sa roche de mise en place", ["Elle est toujours plus ancienne", "Elle est toujours plus riche", "Elle se trouve obligatoirement dans une rivière"], "Primaire décrit le contexte de mise en place, pas une qualité économique."],
      ["Quel rôle jouent les fractures ?", "Elles favorisent la circulation des fluides", ["Elles créent l’or", "Elles prouvent une mine active", "Elles rendent toute roche exploitable"], "Les fractures constituent des voies et parfois des espaces de dépôt."],
      ["Qu’est-ce qu’un fluide hydrothermal ?", "Un fluide chaud circulant dans les roches", ["Un grain d’or transporté par une rivière", "Une roche encaissante intacte", "Un engin de forage"], "Hydrothermal qualifie une circulation de fluide chaud en contexte géologique."],
      ["Qu’est-ce qui peut provoquer la précipitation de minéraux ?", "Un changement de température, de pression ou de chimie", ["Le nom du gisement", "La seule présence d’une carte", "Une hausse obligatoire de vitesse du courant"], "Le changement modifie la capacité du fluide à transporter les substances."],
      ["Pourquoi toute veine de quartz n’est-elle pas aurifère ?", "Le quartz peut se déposer sans concentration notable d’or", ["Le quartz est toujours de l’or", "L’or interdit le quartz", "Une veine est une rivière"], "L’association doit être observée et analysée, non supposée."],
      ["Quel enchaînement est causalement correct ?", "Circulation, transport, changement des conditions, précipitation", ["Précipitation puis création de l’or", "Mine puis gisement puis roche", "Carte puis métal pur"], "Le dépôt suit la circulation et la perte de capacité de transport."],
      ["Que font les fluides par rapport à l’élément or ?", "Ils peuvent le mobiliser et le transporter sans le créer", ["Ils le fabriquent à partir d’eau", "Ils le transforment en aluminium", "Ils suppriment toute gangue"], "L’élément existe déjà dans le système géologique."],
      ["Pourquoi parle-t-on de concentration locale ?", "Les dépôts s’accumulent préférentiellement dans certaines zones", ["Toute la croûte possède la même teneur", "La carte décide de la teneur", "La mine produit le gisement"], "Les conditions de circulation et de précipitation varient dans l’espace."],
      ["Quelle limite faut-il associer au modèle hydrothermal ?", "Il explique un mécanisme fréquent sans représenter tous les gisements d’or", ["Il est faux dans tous les cas", "Il décrit seulement l’exploitation", "Il rend inutile l’observation"], "Un modèle scolaire éclaire une chaîne de processus mais ne remplace pas l’étude du site."],
    ], short("Quel adjectif qualifie les fluides chauds circulant dans les roches ?", ["hydrothermaux", "hydrothermal", "fluides hydrothermaux"], "Le mécanisme présenté mobilise des fluides hydrothermaux.")),
    corrections: [
      "Le guide ne fournit pas le texte annoncé sur la genèse aurifère : le mécanisme hydrothermal est explicitement présenté comme adaptation scientifique.",
      "Primaire ne signifie ni ancien, ni riche, ni rentable ; il décrit le maintien de la concentration dans son contexte de mise en place.",
      "Le fluide mobilise et transporte l’or ; il ne crée pas l’élément chimique.",
      "Toute veine de quartz n’est pas déclarée aurifère et le modèle n’est pas généralisé à tous les gisements d’or.",
      "Le cas d’Ity n’est pas décrit comme si le guide avait fourni sa coupe géologique détaillée.",
    ],
  },
  {
    id: "weathering-gold-liberation",
    title: "Libérer l’or par altération et érosion",
    summary: "Comprendre comment une minéralisation primaire exposée fournit des particules à un dépôt secondaire.",
    pages: "p. 19",
    section: "Passage d’un gisement aurifère primaire aux produits d’altération",
    durationMinutes: 22,
    xp: 70,
    body: `
## De la roche profonde aux produits meubles

Lorsqu’une minéralisation primaire est rapprochée de la surface par l’érosion du relief, sa roche encaissante subit l’**altération**. L’eau, l’air, les variations de température et les réactions chimiques transforment certains minéraux et fragilisent la roche. Des particules d’or déjà présentes peuvent alors être **libérées** de leur gangue.

L’altération agit sur place ; l’**érosion** enlève ensuite une partie des matériaux. La gravité et le ruissellement les déplacent sur le versant, puis éventuellement vers un cours d’eau. Ces étapes ne créent pas l’or : elles séparent, déplacent et parfois reconcentrent un héritage du gisement primaire.

| Processus | Résultat principal dans le modèle |
|---|---|
| altération | transformation et désagrégation de la roche |
| libération | séparation de grains auparavant emprisonnés dans la gangue |
| érosion | arrachement des produits d’altération |
| transfert de versant | déplacement vers les zones basses et les chenaux |

## Un passage progressif

Une concentration peut rester presque sur place dans le manteau d’altération, glisser sur une courte distance ou atteindre un cours d’eau. Il n’existe donc pas une frontière instantanée entre primaire et secondaire. On examine l’état des grains, leur position, le matériau qui les porte et leur relation avec la roche source.

> **Précision :** la résistance relative de l’or favorise sa persistance, mais cela ne signifie pas qu’il est totalement immobile ni que toute altération produit un gisement exploitable.
`,
    keyPoint: "altération libère ; érosion arrache ; gravité et eau transfèrent ; aucun processus ne crée l’or",
    example: "Sous un filon affleurant, des grains apparaissent dans des débris meubles. La proximité de la source suggère un transfert court, mais seule l’étude du terrain permet de relier les deux concentrations.",
    methodSteps: [
      "Repérer la minéralisation primaire et la surface d’altération.",
      "Séparer transformation sur place et arrachement.",
      "Suivre le trajet possible des particules vers le bas du versant.",
      "Conclure sans confondre libération et création de la substance.",
    ],
    interaction: schema(
      "Suivre la libération sur un versant",
      "Active les repères de la roche saine jusqu’au stockage temporaire des débris.",
      "Coupe de versant pédagogique originale ; elle ne représente ni Ity ni une carte minière réelle.",
      weatheringShapes,
      weatheringHotspots,
      "Le trajet commence par une minéralisation existante. Altération, érosion et transfert expliquent son remaniement vers un dépôt secondaire possible.",
    ),
    questions: questions(27, [
      ["Quel processus transforme la roche sur place ?", "L’altération", ["L’exploitation", "La cartographie", "La vente du métal"], "L’altération précède souvent l’arrachement et le transport."],
      ["Que signifie libérer un grain d’or ?", "Le séparer de la gangue ou de la roche qui l’emprisonnait", ["Créer l’élément à partir d’eau", "Le rendre automatiquement rentable", "Construire une mine"], "Le grain était déjà présent dans la minéralisation."],
      ["Quel processus enlève les produits d’altération ?", "L’érosion", ["La légende", "La cristallisation du quartz seulement", "Le raffinage"], "L’érosion assure l’arrachement, puis le transfert peut suivre."],
      ["Pourquoi l’or peut-il persister dans les produits d’altération ?", "Il résiste relativement bien à de nombreuses transformations de surface", ["Il se transforme toujours en bauxite", "Il s’évapore dès la pluie", "Il crée la roche encaissante"], "Sa résistance relative favorise sa conservation sous forme de particules."],
      ["Quel trajet est cohérent ?", "Roche primaire, altération, libération, érosion, transfert", ["Mine, création de l’or, carte", "Transport, création, roche source", "Raffinage, gisement, altération"], "Le dépôt secondaire dérive d’un matériau préexistant."],
      ["L’altération suffit-elle toujours à former un minerai secondaire ?", "Non, une concentration suffisante et des conditions favorables restent nécessaires", ["Oui, dans toute roche", "Oui, sans substance initiale", "Oui, dès la première pluie"], "La transformation ne garantit ni concentration ni exploitabilité."],
      ["Que peut faire la gravité sur un versant ?", "Déplacer les débris vers les zones basses", ["Créer un élément chimique", "Rendre toute carte exhaustive", "Faire remonter tous les grains"], "La gravité contribue au transfert avant ou avec le ruissellement."],
      ["Pourquoi la limite primaire-secondaire peut-elle être progressive ?", "Les particules peuvent être remaniées sur des distances variables", ["Les deux termes sont synonymes", "L’or change d’élément", "La roche n’est jamais altérée"], "On observe un continuum entre source en place et dépôt transporté."],
      ["Quelle affirmation doit être rejetée ?", "L’altération fabrique l’or", ["L’altération fragilise la roche", "L’érosion arrache des matériaux", "Un grain peut être libéré de sa gangue"], "Les processus de surface remanient un élément déjà présent."],
    ], short("Quel processus arrache les produits issus de l’altération ?", ["érosion", "l’érosion"], "L’érosion enlève les matériaux altérés et prépare leur transport.")),
    corrections: [
      "L’altération est distinguée de l’érosion : la première transforme sur place, la seconde arrache.",
      "La libération des grains n’est jamais présentée comme une création de l’élément or.",
      "Le passage du primaire au secondaire est décrit comme progressif et dépendant du trajet réel des particules.",
      "Aucune teneur ni aucune coupe réelle d’Ity n’est inventée à partir de la seule situation du guide.",
      "Le schéma et les questions sont explicitement originaux.",
    ],
  },
  {
    id: "transport-density-sorting",
    title: "Transporter et trier les particules denses",
    summary: "Relier énergie du courant, mobilité des grains, ralentissement et concentration locale.",
    pages: "p. 19",
    section: "Mécanisme adapté de transport et de concentration des produits aurifères",
    durationMinutes: 22,
    xp: 75,
    body: `
## Le cours d’eau est un agent de tri

Un courant peut déplacer des matériaux dissous, en suspension ou sur le fond. Pour des grains solides, la mobilité dépend de plusieurs paramètres : **taille**, **forme**, **densité**, rugosité du fond et énergie de l’écoulement. L’or, très dense, tend à se déposer plus facilement que de nombreux grains légers de taille comparable lorsque la vitesse diminue.

Le tri n’est pas parfait. Une crue peut remobiliser un dépôt, un obstacle peut créer une zone calme, et deux particules de tailles différentes ne se comportent pas comme deux grains identiques. Il faut donc raisonner par changements d’énergie plutôt que réciter « lourd égale toujours immobile ».

## Six moments d’un tri alluvial

1. les produits altérés atteignent un chenal ;
2. une eau énergique mobilise une partie de la charge ;
3. les chocs usent et trient les grains ;
4. la vitesse varie avec pente, débit, obstacles et géométrie ;
5. une baisse d’énergie entraîne le dépôt sélectif de certaines particules ;
6. des cycles de remobilisation et de dépôt peuvent reconcentrer les minéraux lourds.

Des fissures du substratum, l’intérieur d’un méandre ou l’aval immédiat d’un obstacle peuvent constituer des **pièges locaux**. Ce sont des possibilités géomorphologiques, pas des recettes garantissant de trouver de l’or.

> **Adaptation :** le guide demande d’analyser un document sur les gisements secondaires, mais ne fournit pas ce document. La chaîne ci-dessous est une reconstruction pédagogique originale.
`,
    keyPoint: "variation d’énergie + différences de mobilité → tri hydraulique → concentration locale possible",
    example: "Après une crue, des grains denses s’accumulent dans une fissure du fond. On explique le dépôt par une baisse locale d’énergie, sans conclure à un minerai avant échantillonnage.",
    methodSteps: [
      "Identifier le matériau source et son accès au chenal.",
      "Décrire l’énergie du courant et ses variations.",
      "Comparer taille, forme et densité des grains.",
      "Localiser un piège possible puis limiter la conclusion à l’observation.",
    ],
    interaction: timeline(
      "Du versant au tri alluvial",
      "Parcours les étapes et indique à quel moment la concentration peut augmenter sans création de matière.",
      [
        { label: "Apport au chenal", shortLabel: "Apport", detail: "Ruissellement et gravité apportent les produits d’altération vers le cours d’eau." },
        { label: "Mise en mouvement", shortLabel: "Mobilité", detail: "Le courant mobilise une partie des grains lorsque son énergie est suffisante." },
        { label: "Transport", shortLabel: "Trajet", detail: "Les grains se déplacent par roulement, glissement, saltation ou suspension selon leurs propriétés." },
        { label: "Tri hydraulique", shortLabel: "Tri", detail: "Les différences de taille, de forme et de densité produisent des mobilités différentes." },
        { label: "Ralentissement", shortLabel: "Dépôt", detail: "Une baisse d’énergie favorise le dépôt de la charge que le courant ne peut plus transporter." },
        { label: "Reconcentration", shortLabel: "Piège", detail: "Des cycles répétés peuvent enrichir localement une fissure ou une barre en particules lourdes." },
      ],
      "Le courant ne classe pas les grains selon un seul critère : densité, taille, forme et énergie agissent ensemble.",
    ),
    questions: questions(36, [
      ["De quoi dépend la mobilité d’un grain ?", "De sa taille, sa forme, sa densité et de l’énergie du courant", ["Du nom de la mine seulement", "De la couleur du manuel", "D’une date sans observation"], "Le tri hydraulique combine propriétés des grains et conditions d’écoulement."],
      ["Que provoque généralement une baisse d’énergie du courant ?", "Le dépôt d’une partie de la charge", ["La création de l’or", "La disparition de la roche source", "L’ouverture d’une mine"], "Le courant ne peut plus transporter tous les grains mobiles auparavant."],
      ["Pourquoi l’or peut-il être reconcentré ?", "Sa forte densité favorise son dépôt dans certains pièges", ["Il devient plus léger que l’eau", "Il se transforme en fer", "Il flotte toujours"], "La densité contribue au tri, avec la taille, la forme et l’énergie."],
      ["Le tri d’un cours d’eau est-il parfait ?", "Non, les crues et les différences de taille remobilisent et mélangent les grains", ["Oui, chaque grain reste définitivement classé", "Oui, la densité est l’unique facteur", "Oui, dès le premier transport"], "Le dépôt évolue avec le régime du cours d’eau."],
      ["Quel lieu peut agir comme piège local ?", "Une fissure du substratum", ["Le titre de la carte", "Toute surface plane sans sédiment", "Une page du guide"], "Une irrégularité du fond peut retenir des particules denses."],
      ["Quel phénomène peut remobiliser un dépôt ?", "Une crue", ["La seule légende", "Le nom Ity", "La définition de minerai"], "Une hausse d’énergie remet certains grains en mouvement."],
      ["Pourquoi « lourd donc immobile » est-il faux ?", "Un courant suffisamment énergétique peut déplacer aussi des grains denses", ["La densité ne joue jamais", "Tout l’or est dissous", "Aucun cours d’eau ne transporte de solides"], "La mobilité dépend d’un bilan de plusieurs paramètres."],
      ["Que signifie reconcentration ?", "Une augmentation locale de la proportion de grains denses par tri répété", ["La création d’un nouvel élément", "La transformation du gisement en mine", "L’effacement de la source"], "Le tri redistribue une matière préexistante."],
      ["Peut-on conclure qu’un piège contient un minerai sans prélèvement ?", "Non, il faut observer et caractériser le dépôt", ["Oui, toute fissure contient de l’or", "Oui, toute rivière est une mine", "Oui, la densité suffit"], "Un piège potentiel n’est pas une preuve de concentration exploitable."],
    ], short("Comment nomme-t-on le tri produit par un écoulement d’eau ?", ["tri hydraulique", "le tri hydraulique", "tri hydrodynamique"], "Le tri hydraulique résulte de mobilités différentes dans le courant.")),
    corrections: [
      "Le document géologique annoncé page 19 n’étant pas reproduit, la chaîne de transport est marquée comme adaptation originale.",
      "La densité n’est pas présentée comme l’unique paramètre : taille, forme et énergie du courant sont ajoutées.",
      "Un piège potentiel n’est pas assimilé à un minerai sans caractérisation.",
      "Le tri redistribue et reconcentre une matière existante ; il ne crée aucun élément chimique.",
      "Les exemples de fissure, méandre et obstacle sont des modèles pédagogiques, non des localisations officielles.",
    ],
  },
  {
    id: "secondary-alluvial-gold-deposit",
    title: "Former un gisement aurifère secondaire",
    summary: "Assembler altération, transport et dépôt pour expliquer une concentration alluviale remaniée.",
    pages: "p. 9 et p. 19",
    section: "Annoter les types de gisements d’or et expliquer un gisement secondaire",
    durationMinutes: 24,
    xp: 85,
    body: `
## Secondaire signifie remanié

Un **gisement aurifère secondaire** résulte du remaniement de l’or provenant d’une concentration plus ancienne dans la roche. Après altération et érosion, les particules sont déplacées puis déposées dans un nouvel encaissant. Dans un cours d’eau, cet encaissant est formé d’**alluvions** : sables, graviers et autres sédiments déposés par l’écoulement.

Le mécanisme complet relie deux systèmes :

- en amont, une minéralisation primaire fournit les particules ;
- sur le versant, altération et érosion les libèrent puis les arrachent ;
- dans le chenal, transport et tri hydraulique les redistribuent ;
- dans des pièges, une baisse d’énergie favorise leur accumulation ;
- des remaniements successifs peuvent augmenter localement la concentration.

Un dépôt proche de la source et peu transporté peut être éluvial ou de versant ; un dépôt construit par le cours d’eau est alluvial. Ces mots indiquent le mode de dépôt, pas une teneur garantie.

Le dépôt alluvial n’est pas nécessairement limité au lit occupé aujourd’hui. Un ancien chenal ou une terrasse peut conserver des sédiments déposés lors d’un tracé antérieur du cours d’eau. Cette possibilité oblige à reconstituer la géométrie des dépôts au lieu de suivre seulement l’eau visible.

## Lire la coupe sans surinterpréter

La coupe interactive montre des grains denses dans des irrégularités du fond et une barre alluviale. Les pastilles représentent une idée, pas une quantité mesurée. La présence de quelques grains ne suffit pas à appeler tout le chenal « minerai ».

> **Précision :** secondaire ne signifie pas récent, pauvre ou artisanal. Il décrit le déplacement hors du contexte primaire de mise en place.
`,
    keyPoint: "secondaire = or libéré + transporté + trié + redéposé dans un nouvel encaissant",
    example: "Des grains arrondis sont concentrés dans des graviers de chenal, tandis qu’un filon existe en amont. Le dépôt alluvial est secondaire ; le filon reste primaire.",
    methodSteps: [
      "Rechercher une source primaire possible en amont.",
      "Identifier les preuves de transport et de dépôt.",
      "Nommer le nouvel encaissant sédimentaire.",
      "Réserver le mot minerai aux zones effectivement caractérisées.",
    ],
    interaction: schema(
      "Annoter un placer alluvial conceptuel",
      "Active chaque repère et relie-le à transport, tri, piège ou encaissant secondaire.",
      "Coupe alluviale pédagogique originale ; tailles et abondances des grains ne sont pas à l’échelle.",
      placerShapes,
      placerHotspots,
      "Le gisement secondaire est une concentration remaniée : le cours d’eau déplace et trie, puis un nouvel encaissant sédimentaire reçoit les grains.",
    ),
    questions: questions(45, [
      ["Qu’est-ce qui caractérise un gisement secondaire ?", "La substance a été remaniée et déposée dans un nouvel encaissant", ["Il est toujours plus jeune d’un an", "Il est toujours plus pauvre", "Il se trouve obligatoirement dans une mine souterraine"], "Secondaire décrit le déplacement hors du contexte primaire."],
      ["Qu’est-ce qu’une alluvion ?", "Un sédiment déposé par un cours d’eau", ["Un fluide hydrothermal", "Un métal raffiné", "Une roche magmatique profonde"], "Les alluvions peuvent constituer l’encaissant d’un dépôt secondaire."],
      ["Quel enchaînement forme un placer aurifère ?", "Libération, érosion, transport, tri et dépôt", ["Création de l’or, vente, carte", "Mine, gisement, source", "Fusion du cours d’eau"], "La chaîne remanie une substance déjà présente."],
      ["Que montre la présence de grains arrondis dans des graviers ?", "Un transport et un dépôt sont plausibles", ["La roche primaire est intacte sur place", "Une mine est forcément rentable", "L’or a été créé par l’eau"], "La forme et l’encaissant sédimentaire orientent vers un remaniement."],
      ["Secondaire signifie-t-il artisanal ?", "Non, il décrit la genèse géologique", ["Oui, toujours", "Oui, seulement en Côte d’Ivoire", "Oui, si le grain est dense"], "Mode d’exploitation et mode de formation sont deux questions différentes."],
      ["Quel est le nouvel encaissant d’un dépôt alluvial ?", "Les sédiments du chenal ou de la plaine alluviale", ["Le fluide hydrothermal", "La carte", "Le métal raffiné"], "Après transport, les grains sont inclus dans des matériaux déposés par l’eau."],
      ["Pourquoi une barre alluviale peut-elle concentrer des grains ?", "La baisse locale d’énergie favorise leur dépôt", ["Elle crée l’or", "Elle dissout tous les minéraux", "Elle remplace l’échantillonnage"], "La géométrie du chenal modifie l’écoulement et le dépôt."],
      ["Quelques grains suffisent-ils à qualifier tout le chenal de minerai ?", "Non, il faut caractériser concentration, volume et continuité", ["Oui, sans mesure", "Oui, si la carte est colorée", "Oui, toute alluvion est minerai"], "La présence ne suffit pas à une qualification économique."],
      ["Quel lien unit primaire et secondaire ?", "Le primaire peut fournir la matière remaniée du secondaire", ["Ils sont sans relation possible", "Le secondaire crée toujours le primaire", "Ils désignent deux âges fixes"], "La source primaire alimente la chaîne d’altération et de transport."],
    ], short("Comment nomme-t-on les sédiments déposés par un cours d’eau ?", ["alluvions", "des alluvions", "alluvion"], "Les alluvions forment l’encaissant de nombreux dépôts secondaires de chenal.")),
    corrections: [
      "Secondaire est défini par le remaniement et non par l’âge, la richesse ou le mode d’exploitation.",
      "La présence de quelques grains dans des alluvions n’est pas assimilée à un minerai sans caractérisation.",
      "La coupe ne représente aucune teneur ni aucune abondance réelle.",
      "Le lien primaire-source puis secondaire-dépôt est explicité sans prétendre reconstituer un site ivoirien précis.",
      "Éluvial et alluvial sont introduits comme vocabulaire adapté, non comme citations textuelles du guide.",
    ],
  },
  {
    id: "primary-secondary-deposit-comparison",
    title: "Comparer gisements primaires et secondaires",
    summary: "Classer une concentration par ses relations avec la roche source, le transport et le nouvel encaissant.",
    pages: "p. 19",
    section: "Analyser les modes de formation des gisements aurifères primaires et secondaires",
    durationMinutes: 24,
    xp: 95,
    body: `
## Comparer avec des critères observables

La distinction primaire-secondaire devient fiable lorsqu’elle repose sur plusieurs indices concordants.

| Critère | Gisement primaire | Gisement secondaire |
|---|---|---|
| position | dans ou près de la roche de mise en place | dans un nouvel encaissant après remaniement |
| texture possible | veine, dissémination, réseau minéralisé | grains ou particules dans des matériaux meubles |
| processus dominant | circulation, réaction et précipitation géologique | altération, érosion, transport, tri et dépôt |
| relation à la source | directe | dérivée d’une source en amont ou à proximité |
| preuve attendue | structures et minéraux de la roche | indices de transport et de sédimentation |

Un grain isolé n’établit pas tout le mécanisme. On confronte la forme, l’encaissant, la position topographique, les structures, la granulométrie et la distribution spatiale. Les hypothèses restent ouvertes tant que les observations ne convergent pas.

## Ce qu’il ne faut pas transférer aux autres ressources

La page 19 demande d’« appliquer les informations » à d’autres gisements miniers. Cette consigne doit être comprise comme un **transfert de démarche** : chercher une source, un agent de transport éventuel, un processus de concentration et un piège. Elle ne signifie pas que diamant, bauxite, nickel, manganèse et cuivre ont tous exactement la même genèse hydrothermale puis alluviale que l’or.

> **Règle de preuve :** on classe le dépôt selon son histoire observée, jamais selon l’idée « primaire = profond » ou « secondaire = surface » seule.
`,
    keyPoint: "primaire : contexte de mise en place conservé ; secondaire : matière remaniée dans un nouvel encaissant",
    example: "Un réseau de veines recoupe l’encaissant : hypothèse primaire. Des grains dans des graviers triés d’un chenal : hypothèse secondaire. Dans les deux cas, plusieurs indices doivent converger.",
    methodSteps: [
      "Décrire l’encaissant et la forme de la concentration.",
      "Rechercher des indices de transport ou leur absence.",
      "Reconstituer les processus possibles dans l’ordre.",
      "Comparer les hypothèses et annoncer la limite des données.",
    ],
    interaction: diagram(
      "Ouvrir les critères de comparaison",
      "Explore les huit cartes et classe chaque critère comme preuve, processus ou limite d’interprétation.",
      "Deux histoires géologiques",
      "La comparaison porte sur le contexte de mise en place et le remaniement, non sur un jugement de valeur.",
      [
        { id: "primary-host", label: "Encaissant primaire", role: "Contexte conservé", detail: "La concentration reste associée aux structures et aux roches de sa mise en place." },
        { id: "primary-process", label: "Précipitation", role: "Processus primaire", detail: "Dans le modèle hydrothermal, le fluide perd sa capacité de transport et dépose des minéraux." },
        { id: "weathering", label: "Altération", role: "Passage", detail: "Elle fragilise l’encaissant et libère une partie des grains préexistants." },
        { id: "transport", label: "Transport", role: "Indice secondaire", detail: "Déplacement, usure et tri indiquent un remaniement hors du contexte initial." },
        { id: "secondary-host", label: "Nouvel encaissant", role: "Dépôt secondaire", detail: "Alluvions ou matériaux de versant reçoivent les particules redéposées." },
        { id: "age-trap", label: "Âge", role: "Faux critère unique", detail: "Les mots primaire et secondaire ne donnent pas à eux seuls un âge absolu." },
        { id: "value-trap", label: "Richesse", role: "Faux jugement", detail: "Aucune des deux catégories n’est automatiquement plus riche ou plus rentable." },
        { id: "transfer-limit", label: "Autres minerais", role: "Transférer la démarche", detail: "On recherche source, transport et concentration sans imposer le mécanisme de l’or à toutes les ressources." },
      ],
      "Une classification robuste combine position, texture, encaissant et processus ; un seul indice ne suffit pas.",
    ),
    questions: questions(54, [
      ["Quel critère central distingue primaire et secondaire ?", "La conservation ou non du contexte initial de mise en place", ["Le nom du village", "La couleur du métal", "Le nombre de pages"], "Le secondaire implique un remaniement vers un nouvel encaissant."],
      ["Quel indice soutient une origine secondaire ?", "Des grains dans des sédiments triés", ["Une veine recoupant la roche", "Une fracture minéralisée intacte", "Une texture sans transport"], "Les sédiments triés enregistrent transport et dépôt."],
      ["Quel indice soutient une origine primaire ?", "Une minéralisation liée à des fractures de l’encaissant", ["Des grains arrondis dans un chenal", "Une barre alluviale", "Un dépôt remobilisé par les crues"], "La structure conserve la relation à la roche de mise en place."],
      ["Primaire indique-t-il un âge absolu ?", "Non", ["Oui, toujours un milliard d’années", "Oui, toujours plus récent", "Oui, toujours actuel"], "Le terme décrit ici un mode de mise en place."],
      ["Secondaire indique-t-il une faible teneur ?", "Non", ["Oui, par définition", "Oui, dans toute alluvion", "Oui, si l’or est dense"], "La richesse doit être mesurée, elle n’est pas donnée par la catégorie."],
      ["Que signifie appliquer la démarche à d’autres minerais ?", "Rechercher leurs propres sources, transports, concentrations et pièges", ["Imposer à tous le même scénario aurifère", "Déclarer toute roche hydrothermale", "Ignorer les observations"], "La méthode se transfère, pas nécessairement le mécanisme précis."],
      ["Pourquoi plusieurs indices doivent-ils converger ?", "Un indice isolé peut avoir plusieurs explications", ["La géologie interdit les hypothèses", "La carte suffit toujours", "Le minerai est un métal pur"], "La conclusion résulte d’un faisceau d’observations."],
      ["Quel élément appartient surtout au modèle secondaire ?", "Le tri hydraulique", ["La précipitation dans une fracture", "La circulation hydrothermale profonde", "La réaction fluide-roche"], "Le tri intervient après libération et transport en surface."],
      ["Quel élément appartient surtout au modèle primaire présenté ?", "La précipitation à partir d’un fluide dans les fractures", ["Le dépôt de sables dans un méandre", "La remobilisation par une crue", "Le tri de graviers"], "Le modèle primaire conserve la minéralisation dans la roche."],
    ], short("Quel mot qualifie un dépôt remanié hors de son contexte initial ?", ["secondaire", "gisement secondaire", "dépôt secondaire"], "Le remaniement et le nouvel encaissant définissent ici le caractère secondaire.")),
    corrections: [
      "Primaire et secondaire sont séparés de l’âge, de la richesse et du mode d’exploitation.",
      "La consigne de transfert page 19 est interprétée comme transfert de démarche, non comme identité de genèse entre toutes les ressources.",
      "Un indice isolé n’est jamais présenté comme preuve suffisante.",
      "Le scénario hydrothermal-alluvial n’est pas généralisé au diamant, à la bauxite, au nickel, au manganèse ou au cuivre.",
      "La comparaison et ses évaluations sont des créations pédagogiques originales.",
    ],
  },
  {
    id: "gold-deposit-synthesis-annotation",
    title: "Annoter le schéma de synthèse",
    summary: "Transformer une suite de repères en explication complète des deux types de gisements d’or.",
    pages: "p. 9 et p. 19",
    section: "Annoter le schéma de synthèse des différents types de gisements d’or",
    durationMinutes: 26,
    xp: 110,
    body: `
## Annoter, ce n’est pas seulement nommer

Le guide attend l’annotation d’un schéma de synthèse. Une bonne annotation comprend :

1. un **titre** précisant qu’il s’agit d’un modèle de formation ;
2. des repères reliés sans ambiguïté aux objets ;
3. des légendes brèves : encaissant, fracture, minéralisation primaire, zone d’altération, versant, chenal, alluvions, dépôt secondaire ;
4. des flèches de processus : circulation, précipitation, altération, érosion, transport et dépôt ;
5. une conclusion distinguant clairement les deux contextes.

Les flèches ne doivent pas faire croire que la matière apparaît spontanément. La flèche « altération » part d’une roche minéralisée ; la flèche « transport » relie les produits libérés au nouvel encaissant ; la flèche « concentration » traduit une redistribution locale.

## Le récit complet du schéma

Dans la roche encaissante fracturée, un fluide peut transporter puis déposer des substances : une minéralisation primaire se forme. Près de la surface, l’altération désagrège la roche et libère des grains d’or. L’érosion les arrache. La gravité et l’eau les transportent. Lorsque l’énergie baisse, certains grains denses se déposent dans des alluvions et peuvent être reconcentrés : le dépôt est secondaire.

La page 19 annonce un schéma de synthèse mais ne le reproduit pas. La chronologie interactive fournit donc les **légendes attendues**, sans se présenter comme le corrigé officiel d’une figure absente.

> **Contrôle final :** chaque flèche doit pouvoir être lue sous la forme « processus → conséquence observable ».
`,
    keyPoint: "titre + objets + processus + flèches causales + distinction primaire/secondaire + limite documentaire",
    example: "Flèche « altération » : de la roche minéralisée vers des grains libérés. Flèche « transport » : des grains libérés vers les alluvions. Conclusion : nouvel encaissant, donc dépôt secondaire.",
    methodSteps: [
      "Écrire le titre avant de placer les repères.",
      "Séparer objets géologiques et verbes de processus.",
      "Orienter chaque flèche dans le sens causal.",
      "Conclure par les critères primaire et secondaire, puis signaler la nature conceptuelle du modèle.",
    ],
    interaction: timeline(
      "Construire la légende dans l’ordre causal",
      "Parcours les huit repères puis raconte le schéma sans sauter de la roche source au dépôt alluvial.",
      [
        { label: "Roche encaissante", shortLabel: "Encaissant", detail: "Elle contient ou entoure la structure où la minéralisation primaire se met en place." },
        { label: "Fracture et fluide", shortLabel: "Circulation", detail: "La fracture canalise un fluide susceptible de mobiliser des substances." },
        { label: "Précipitation", shortLabel: "Dépôt primaire", detail: "Un changement des conditions provoque le dépôt dans la roche." },
        { label: "Altération", shortLabel: "Transformation", detail: "La roche exposée est transformée et désagrégée près de la surface." },
        { label: "Libération et érosion", shortLabel: "Arrachement", detail: "Des grains sont séparés de la gangue puis enlevés du site primaire." },
        { label: "Transport", shortLabel: "Déplacement", detail: "Gravité et eau déplacent les particules vers un chenal." },
        { label: "Tri et dépôt", shortLabel: "Piège", detail: "Une baisse d’énergie favorise la rétention locale de particules denses." },
        { label: "Nouvel encaissant", shortLabel: "Secondaire", detail: "Les alluvions contiennent désormais la concentration remaniée." },
      ],
      "La synthèse relie deux concentrations par les processus de surface : primaire dans la roche, secondaire dans les matériaux remaniés.",
    ),
    questions: questions(63, [
      ["Que doit contenir le titre du schéma ?", "Le mécanisme représenté et les types de gisements", ["Une teneur inventée", "Une date absente", "Le nom d’une mine non sourcée"], "Le titre fixe l’objet et évite de présenter la figure comme une coupe réelle."],
      ["Que doit relier la flèche d’altération ?", "La roche minéralisée aux produits transformés et aux grains libérés", ["La mine au marché", "La carte au métal pur", "Le dépôt secondaire à la création de l’or"], "L’altération agit sur un matériau préexistant."],
      ["Que doit relier la flèche de transport ?", "Les particules libérées au nouvel encaissant", ["Le fluide profond à la mine active", "La légende au nord", "L’âge à la richesse"], "Le transport assure le déplacement hors du contexte primaire."],
      ["Quelle légende désigne le dépôt dans la roche de mise en place ?", "Minéralisation primaire", ["Alluvions", "Barre alluviale", "Dépôt remanié"], "La relation à l’encaissant initial définit le primaire."],
      ["Quelle légende désigne le nouvel encaissant fluvial ?", "Alluvions", ["Fluide hydrothermal", "Roche source profonde", "Fracture minéralisée"], "Les alluvions sont les sédiments déposés par le cours d’eau."],
      ["Pourquoi faut-il écrire des verbes sur les flèches ?", "Pour rendre explicites les relations cause-conséquence", ["Pour remplacer tous les objets", "Pour inventer des teneurs", "Pour supprimer le titre"], "Une flèche muette peut être interprétée dans le mauvais sens."],
      ["Quelle conclusion termine correctement le schéma ?", "Le primaire reste dans son contexte, le secondaire est remanié dans un nouvel encaissant", ["Le primaire est toujours riche", "Le secondaire est toujours récent", "Les deux sont des mines actives"], "La conclusion reprend le critère géologique central."],
      ["Pourquoi le schéma proposé n’est-il pas un corrigé officiel ?", "Le guide annonce le support mais ne le reproduit pas", ["Le guide interdit tout schéma", "La leçon n’existe pas au programme", "Aucune habileté n’est donnée"], "La figure doit être qualifiée d’adaptation originale."],
      ["Quel contrôle limite une flèche de concentration ?", "Elle doit redistribuer une matière existante, non en créer", ["Elle doit pointer au hasard", "Elle doit effacer la source", "Elle doit prouver la rentabilité"], "La concentration modifie la répartition, pas la quantité d’élément créée."],
    ], short("Quel mot désigne la roche qui contient la minéralisation primaire ?", ["encaissant", "roche encaissante", "l’encaissant"], "L’encaissant constitue le contexte rocheux de la minéralisation primaire.")),
    corrections: [
      "Le schéma annoncé par le guide n’étant pas reproduit, la chronologie et les légendes sont qualifiées d’originales.",
      "Les flèches sont causales et ne suggèrent jamais une création spontanée de l’or.",
      "Objets géologiques et processus sont explicitement séparés.",
      "La conclusion primaire-secondaire repose sur le contexte et le remaniement, non sur l’âge ou la richesse.",
      "Aucune coupe réelle ni aucune teneur d’un site ivoirien n’est attribuée au DPFC.",
    ],
  },
  {
    id: "mineral-deposit-final-mission",
    title: "Mission finale — Relier la source au placer",
    summary: "Traiter un dossier fictif en mobilisant carte, vocabulaire, processus, comparaison et annotation.",
    pages: "pp. 9, 19 et 44",
    section: "Mission de traitement originale conforme aux habiletés et à la grille DPFC",
    durationMinutes: 34,
    xp: 135,
    kind: "challenge",
    body: `
## Dossier fictif de la vallée de Kôla

Cette mission est **entièrement originale**. Kôla est un nom pédagogique fictif : les observations ci-dessous ne décrivent ni Ity ni un autre site réel.

Une équipe scolaire reçoit trois documents reconstitués :

- **zone A, sur la colline** : une roche fracturée contient des veines de quartz avec de rares grains d’or ;
- **zone B, sur le versant** : la roche est altérée, des fragments proviennent de la zone A et des grains sont mêlés à un matériau meuble ;
- **zone C, dans le chenal** : des sables et graviers triés contiennent davantage de grains denses dans des fissures du fond que sur une berge haute.

Aucune teneur, aucun volume et aucun coût n’est fourni. Il est donc interdit de déclarer une mine rentable. L’objectif est seulement de reconstruire les **hypothèses de formation**.

## Travail demandé

1. identifier l’encaissant et la minéralisation de la zone A ;
2. expliquer pourquoi A correspond à une hypothèse primaire ;
3. distinguer altération, érosion et transfert dans la zone B ;
4. expliquer le tri et le dépôt dans la zone C ;
5. classer C comme hypothèse secondaire et justifier par le nouvel encaissant ;
6. proposer une légende de synthèse reliant A, B et C ;
7. formuler les données manquantes avant d’employer le mot minerai.

## Réponse modèle

La zone A conserve la minéralisation dans la roche fracturée : elle est primaire. L’altération de B libère des grains, puis l’érosion et la gravité les déplacent. Dans C, l’eau les transporte et les trie ; une baisse locale d’énergie favorise leur dépôt dans les fissures. C est donc un dépôt secondaire alluvial possible. Il faut encore échantillonner, mesurer concentration, volume et continuité avant de parler de minerai ou de mine.

> **Grille :** le guide page 44 réserve à C1-L1 trois habiletés de connaissance, une de compréhension et une de traitement. La mission ajoute des questions d’entraînement sans les présenter comme une évaluation officielle.
`,
    keyPoint: "observer → relier les processus → classer primaire/secondaire → annoncer les données manquantes",
    example: "A : veine dans l’encaissant, primaire. B : altération et érosion. C : alluvions triées, secondaire possible. Conclusion économique différée faute de mesures.",
    methodSteps: [
      "Séparer toutes les observations des interprétations.",
      "Construire une chaîne causale de A vers C.",
      "Justifier chaque catégorie par l’encaissant et les indices de transport.",
      "Refuser la conclusion minerai ou mine tant que concentration, volume et continuité manquent.",
    ],
    interaction: diagram(
      "Ouvrir le dossier de la vallée fictive",
      "Explore chaque pièce et construis une conclusion qui indique aussi ce que les données ne permettent pas d’affirmer.",
      "Dossier Kôla — cas fictif",
      "Trois zones et cinq contrôles de preuve forment une mission de traitement originale, inspirée des habiletés du guide.",
      [
        { id: "zone-a", label: "Zone A", role: "Roche fracturée", detail: "Veines et grains dans l’encaissant : hypothèse de minéralisation primaire." },
        { id: "zone-b", label: "Zone B", role: "Manteau altéré", detail: "La roche est désagrégée ; des grains préexistants peuvent être libérés et déplacés." },
        { id: "zone-c", label: "Zone C", role: "Chenal alluvial", detail: "Sables, graviers et fissures du fond constituent un nouvel encaissant sédimentaire." },
        { id: "causal-link", label: "Lien A–B–C", role: "Chaîne à prouver", detail: "Altération, érosion, transport, tri et dépôt constituent l’hypothèse de liaison." },
        { id: "primary-test", label: "Test primaire", role: "Contexte conservé", detail: "La relation de la veine aux fractures et à l’encaissant soutient le classement de A." },
        { id: "secondary-test", label: "Test secondaire", role: "Remaniement", detail: "Les grains dans des alluvions triées soutiennent le classement de C." },
        { id: "ore-limit", label: "Limite minerai", role: "Mesures absentes", detail: "Sans concentration, volume, continuité et conditions, le mot minerai reste non démontré." },
        { id: "official-limit", label: "Statut de la mission", role: "Originale", detail: "Le guide fournit les habiletés et une grille, pas ce dossier ni ses questions." },
      ],
      "La meilleure conclusion explique les deux genèses et contient une phrase de limite : aucune rentabilité ne peut être déduite du dossier.",
    ),
    questions: questions(72, [
      ["Quel classement convient à la zone A ?", "Hypothèse de gisement primaire", ["Dépôt alluvial certain", "Mine rentable", "Bauxite pure"], "La minéralisation reste liée aux fractures de son encaissant."],
      ["Quel processus domine dans la zone B avant le transport fluvial ?", "Altération puis érosion", ["Raffinage", "Exploitation souterraine", "Création de l’or"], "La roche est transformée, les grains libérés puis les matériaux arrachés."],
      ["Quel classement convient à la zone C ?", "Hypothèse de dépôt secondaire alluvial", ["Veine primaire intacte", "Métal raffiné", "Roche magmatique profonde"], "Les grains se trouvent dans un nouvel encaissant sédimentaire trié."],
      ["Quel indice relie C à un tri hydraulique ?", "La concentration accrue dans des fissures du fond", ["Le nom fictif de la vallée", "La présence d’une colline", "L’absence de teneur"], "Les fissures peuvent agir comme pièges lors des baisses d’énergie."],
      ["Peut-on affirmer que la zone C est un minerai exploitable ?", "Non, concentration, volume et continuité ne sont pas mesurés", ["Oui, tout gravier est minerai", "Oui, la mission le garantit", "Oui, une fissure suffit"], "Le dossier permet une hypothèse de genèse, pas une décision économique."],
      ["Quelle flèche relie correctement A à B ?", "Altération et libération de grains", ["Création de l’or", "Construction d’une mine", "Raffinage"], "B dérive de la transformation de la roche minéralisée de A."],
      ["Quelle flèche relie correctement B à C ?", "Érosion, transport puis dépôt", ["Précipitation hydrothermale uniquement", "Fusion du métal", "Disparition de l’encaissant"], "Les produits quittent le versant et rejoignent le chenal."],
      ["Pourquoi la mission n’est-elle pas officielle ?", "Le guide ne fournit ni ce dossier ni des exercices rédigés", ["La leçon est absente du programme", "Aucune habileté n’existe", "La géologie est interdite"], "Le contenu est une adaptation évaluative originale."],
      ["Quelle conclusion est la plus complète ?", "A est primaire, C secondaire possible, et des mesures manquent avant de parler de minerai", ["A et C sont des mines actives", "Tout est primaire car l’or est dense", "Tout est secondaire car la vallée est en surface"], "Elle relie les processus et reconnaît les limites du dossier."],
    ], short("Quel terme qualifie le dépôt de la zone C, remanié dans des alluvions ?", ["secondaire", "gisement secondaire", "dépôt secondaire", "alluvial"], "La zone C constitue l’hypothèse de dépôt secondaire alluvial du dossier fictif.")),
    corrections: [
      "La vallée de Kôla, ses zones et toutes ses données sont explicitement fictives et originales.",
      "La grille page 44 est utilisée comme repère taxonomique ; elle ne contient aucun exercice minier rédigé.",
      "Le mot minerai est refusé tant que concentration, volume, continuité et conditions ne sont pas caractérisés.",
      "La mission ne prétend décrire ni Ity ni un autre site ivoirien réel.",
      "La conclusion distingue hypothèse géologique et décision d’exploitation.",
    ],
  },
];

export const terminalDSvtMiningFormationPath: LearningPath = {
  id: "terminale-d-svt-l13-mining-formation",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Adaptation enrichie du guide officiel",
  curriculumSourceUrl: sourceUrl,
  theme: { number: 1, title: "Les ressources minières" },
  chapterNumber: 13,
  title: "La mise en place des gisements miniers en Côte d’Ivoire",
  description:
    "Neuf niveaux adaptés des habiletés DPFC pour lire une carte minière sourcée, distinguer encaissant et minerai, puis expliquer et comparer les gisements aurifères primaires et secondaires sans inventer de document officiel.",
  estimatedMinutes: levels.reduce((total, level) => total + level.durationMinutes, 0),
  outcomes: [
    "Lire une carte minière en contrôlant légende, date, source et statut des symboles.",
    "Distinguer minéral, roche, minéralisation, roche encaissante, gisement, minerai et mine.",
    "Expliquer un modèle de formation d’un gisement aurifère primaire.",
    "Relier altération, érosion, transport, tri et dépôt à un gisement secondaire.",
    "Annoter une synthèse originale et traiter un dossier géologique sans dépasser les preuves.",
  ],
  modules: [
    {
      id: "mining-formation-mastery",
      title: "Des roches sources aux concentrations aurifères",
      description:
        "Un parcours original et explicitement adapté : les habiletés du guide sont couvertes, mais la carte, le texte géologique, les schémas et les évaluations absents du PDF ne sont jamais présentés comme officiels.",
      lessons: levels.map((level, index) => adaptedLevel(index, level)),
    },
  ],
};
