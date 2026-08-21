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
const guideUrl = "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel: string,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points: 1 });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel: string,
): LessonQuestion => ({
  type: "short-answer",
  prompt,
  options: [],
  correctIndex: 0,
  acceptedAnswers,
  explanation,
  sourceLabel,
  points: 1,
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
): LessonQuestion[] => {
  if (rows.length !== 9) throw new Error("Chaque niveau doit fournir neuf QCM avant la réponse courte.");
  return [...rows.map((row, index) => balancedChoice(row, firstOrdinal + index)), shortQuestion];
};

const guideLabel = (pages: string): string =>
  `Guide DPFC SVT Terminale D, ${pages} • adaptation évaluative originale`;

const source = (pages: string, section: string, precisions: string[]): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages,
  section,
  fidelity: "adapted",
  corrections: [
    "Le guide DPFC fixe les habiletés et la démarche, mais ne fournit ni cours rédigé ni exercices complets : le contenu et toutes les évaluations sont des adaptations originales.",
    ...precisions,
  ],
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
  eyebrow: "Carte génétique à explorer",
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
  eyebrow: "Raisonnement à dérouler",
  title,
  instruction,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
  observation,
});

const male = (x: number, y: number, affected = false): SchemaShape => ({
  shape: "path",
  d: `M${x - 18} ${y - 18} H${x + 18} V${y + 18} H${x - 18} Z`,
  tone: affected ? "accent" : "outline",
});

const female = (x: number, y: number, affected = false): SchemaShape => ({
  shape: "circle",
  cx: x,
  cy: y,
  r: 18,
  tone: affected ? "accent" : "outline",
});

const couple = (x1: number, x2: number, y: number): SchemaShape => ({
  shape: "line",
  x1: x1 + 18,
  y1: y,
  x2: x2 - 18,
  y2: y,
  tone: "muted",
});

const descent = (parentX: number, parentY: number, leftX: number, rightX: number, childY: number): SchemaShape[] => [
  { shape: "line", x1: parentX, y1: parentY, x2: parentX, y2: childY - 42, tone: "muted" },
  { shape: "line", x1: leftX, y1: childY - 42, x2: rightX, y2: childY - 42, tone: "muted" },
];

const childStem = (x: number, childY: number): SchemaShape => ({
  shape: "line",
  x1: x,
  y1: childY - 42,
  x2: x,
  y2: childY - 18,
  tone: "muted",
});

const autosomalShapes: SchemaShape[] = [
  female(260, 82), male(400, 82), couple(260, 400, 82),
  ...descent(330, 82, 120, 540, 238),
  childStem(120, 238), childStem(260, 238), childStem(400, 238), childStem(540, 238),
  male(120, 238), female(260, 238, true), male(400, 238, true), female(540, 238),
  { shape: "text", x: 330, y: 330, content: "Pedigree autosomique récessif — figure pédagogique originale", anchor: "middle" },
];

const autosomalHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "healthy-parents", number: 1, label: "Parents non atteints", x: 330, y: 82, detail: "Deux parents non atteints ayant des enfants atteints sont compatibles avec le croisement $Aa \\,\\times\\, Aa$." },
  { id: "affected-daughter", number: 2, label: "Fille atteinte", x: 260, y: 238, detail: "Son génotype est $aa$. Avec un père non atteint, ce cas contredit le modèle récessif lié à X le plus simple." },
  { id: "affected-son", number: 3, label: "Garçon atteint", x: 400, y: 238, detail: "Il est également $aa$ : dans un modèle autosomique, les deux sexes peuvent être atteints." },
  { id: "healthy-siblings", number: 4, label: "Enfants non atteints", x: 540, y: 238, detail: "Leur phénotype autorise $AA$ ou $Aa$ ; le pedigree ne suffit pas à trancher." },
];

const xLinkedShapes: SchemaShape[] = [
  female(260, 82), { shape: "circle", cx: 260, cy: 82, r: 5, tone: "fill" },
  male(400, 82), couple(260, 400, 82),
  ...descent(330, 82, 120, 540, 238),
  childStem(120, 238), childStem(260, 238), childStem(400, 238), childStem(540, 238),
  male(120, 238, true), female(260, 238), male(400, 238), female(540, 238),
  { shape: "text", x: 330, y: 330, content: "Transmission récessive liée à X — figure pédagogique originale", anchor: "middle" },
];

const xLinkedHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "carrier-mother", number: 1, label: "Mère conductrice", x: 260, y: 82, detail: "Le point central indique ici une femme $X^N X^n$ : elle peut transmettre l’un ou l’autre X." },
  { id: "healthy-father", number: 2, label: "Père non atteint", x: 400, y: 82, detail: "Il est $X^N Y$ et transmet son Y à ses fils : il ne leur transmet donc pas son chromosome X." },
  { id: "affected-boy", number: 3, label: "Garçon atteint", x: 120, y: 238, detail: "Il est $X^nY$ ; son unique chromosome X vient de sa mère. On dit qu’il est hémizygote pour ce locus." },
  { id: "healthy-daughters", number: 4, label: "Filles non atteintes", x: 400, y: 238, detail: "Elles reçoivent $X^N$ du père ; elles peuvent être $X^NX^N$ ou $X^NX^n$." },
];

const aboShapes: SchemaShape[] = [
  { shape: "line", x1: 190, y1: 90, x2: 190, y2: 320, tone: "outline" },
  { shape: "line", x1: 190, y1: 155, x2: 540, y2: 155, tone: "outline" },
  { shape: "line", x1: 365, y1: 90, x2: 365, y2: 320, tone: "outline" },
  { shape: "line", x1: 540, y1: 90, x2: 540, y2: 320, tone: "outline" },
  { shape: "line", x1: 80, y1: 155, x2: 540, y2: 155, tone: "outline" },
  { shape: "line", x1: 80, y1: 237, x2: 540, y2: 237, tone: "outline" },
  { shape: "line", x1: 80, y1: 320, x2: 540, y2: 320, tone: "outline" },
  { shape: "line", x1: 80, y1: 155, x2: 80, y2: 320, tone: "outline" },
  { shape: "text", x: 278, y: 128, content: "Iᴮ", anchor: "middle" },
  { shape: "text", x: 452, y: 128, content: "i", anchor: "middle" },
  { shape: "text", x: 135, y: 205, content: "Iᴬ", anchor: "middle" },
  { shape: "text", x: 135, y: 286, content: "i", anchor: "middle" },
  { shape: "text", x: 278, y: 205, content: "AB", anchor: "middle" },
  { shape: "text", x: 452, y: 205, content: "A", anchor: "middle" },
  { shape: "text", x: 278, y: 286, content: "B", anchor: "middle" },
  { shape: "text", x: 452, y: 286, content: "O", anchor: "middle" },
  { shape: "text", x: 310, y: 370, content: "Échiquier Iᴬi × Iᴮi — représentation pédagogique originale", anchor: "middle" },
];

const aboHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "gametes-a", number: 1, label: "Gamètes du parent A", x: 135, y: 155, detail: "Le génotype $I^Ai$ produit des gamètes $I^A$ ou $i$ en proportions égales dans le modèle." },
  { id: "gametes-b", number: 2, label: "Gamètes du parent B", x: 365, y: 128, detail: "Le génotype $I^Bi$ produit des gamètes $I^B$ ou $i$." },
  { id: "ab-cell", number: 3, label: "Groupe AB", x: 278, y: 205, detail: "$I^AI^B$ exprime simultanément les antigènes A et B : les allèles sont codominants." },
  { id: "o-cell", number: 4, label: "Groupe O", x: 452, y: 286, detail: "$ii$ n’exprime ni antigène A ni antigène B ; deux copies de $i$ sont nécessaires." },
];

const caseXShapes: SchemaShape[] = [
  male(240, 75, true), female(400, 75), couple(240, 400, 75),
  ...descent(320, 75, 130, 510, 220),
  childStem(130, 220), childStem(255, 220), childStem(385, 220), childStem(510, 220),
  female(130, 220), { shape: "circle", cx: 130, cy: 220, r: 5, tone: "fill" },
  male(255, 220), female(385, 220), { shape: "circle", cx: 385, cy: 220, r: 5, tone: "fill" }, male(510, 220),
  { shape: "text", x: 320, y: 310, content: "Père atteint, fils non atteints, filles conductrices — figure originale", anchor: "middle" },
];

const caseXHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "affected-father", number: 1, label: "Père atteint", x: 240, y: 75, detail: "Il est $X^nY$ et donne son chromosome $X^n$ à toutes ses filles, jamais à ses fils." },
  { id: "healthy-mother", number: 2, label: "Mère non conductrice retenue", x: 400, y: 75, detail: "Dans ce cas construit, elle est $X^NX^N$ ; cette information provient d’un test et non du seul phénotype." },
  { id: "carrier-daughters", number: 3, label: "Filles conductrices", x: 260, y: 220, detail: "Chaque fille reçoit $X^n$ du père et $X^N$ de la mère : toutes sont $X^NX^n$." },
  { id: "healthy-sons", number: 4, label: "Fils non atteints", x: 510, y: 220, detail: "Chaque fils reçoit Y du père et $X^N$ de la mère : tous sont $X^NY$." },
];

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
  precisions: string[];
}

function adaptedLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed.pages, seed.section, seed.precisions),
    concept: {
      eyebrow: `Niveau ${index + 1} • Adaptation du guide DPFC`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode génétique",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Sépare toujours les observations du pedigree, l’hypothèse de transmission et les déductions conditionnelles qui en résultent.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : un cas impossible élimine un modèle ; un cas seulement compatible ne le prouve pas à lui seul.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: LevelSeed[] = [
  {
    id: "hereditary-trait-pedigree-basics",
    title: "Du caractère au pedigree",
    summary: "Distinguer caractère, phénotype, génotype et allèle, puis lire les conventions d’un arbre généalogique sans transformer une observation en certitude génétique.",
    pages: "p. 13 et p. 35",
    section: "Habiletés du programme et conventions d’analyse d’un pedigree",
    durationMinutes: 28,
    xp: 45,
    body: `
## 1. Ce que l’on observe et ce que l’on déduit

Un **caractère** est une particularité étudiée, par exemple un groupe sanguin ou une forme de vision des couleurs. Le **phénotype** est l’état observable ou mesurable de ce caractère. Le **génotype** décrit les allèles portés au locus considéré ; un **allèle** est une version d’un gène. Deux personnes de même phénotype ne possèdent donc pas nécessairement le même génotype.

Le guide demande d’identifier des caractères héréditaires puis d’en expliquer la transmission à partir d’arbres généalogiques. Une ressemblance familiale ne suffit pourtant pas à prouver un déterminisme simple : l’environnement, plusieurs gènes ou une pénétrance incomplète peuvent intervenir. Dans ce parcours, chaque pedigree est un **modèle scolaire monogénique** dont les hypothèses sont annoncées.

## 2. Le langage du pedigree

| Symbole | Information conventionnelle |
|---|---|
| carré | homme |
| cercle | femme |
| symbole coloré | phénotype étudié présent |
| trait horizontal | union |
| trait vertical puis barre | descendance et fratrie |
| chiffre romain / arabe | génération / individu |

La couleur renseigne le phénotype, pas automatiquement le génotype. Une personne non atteinte peut porter un allèle récessif. Inversement, un caractère dominant n’est ni « meilleur », ni forcément fréquent ou grave : la dominance décrit seulement la relation d’expression entre deux allèles chez l’hétérozygote.

## 3. Une lecture en trois étages

Commence par **décrire** sans interpréter, formule ensuite une **hypothèse** de transmission, puis cherche une **contradiction**. Si plusieurs génotypes restent possibles, conserve-les tous. Un pedigree limité établit surtout qu’un modèle est compatible ou incompatible avec les données ; il ne remplace ni un examen clinique ni une analyse biologique.

> **Repère Davy — O-H-T :** **O**bserver, émettre une **H**ypothèse, la **T**ester.
`,
    keyPoint: "Un pedigree code des phénotypes ; les génotypes se déduisent seulement sous une hypothèse de transmission explicitement testée.",
    example: "Deux personnes non atteintes ont un enfant atteint : décris d’abord ce fait, puis teste un modèle récessif au lieu d’écrire immédiatement le génotype de toute la famille.",
    methodSteps: [
      "Identifie la légende, les générations et les individus.",
      "Décris les phénotypes sans attribuer encore d’allèles.",
      "Repère un croisement informatif où l’enfant diffère de ses parents.",
      "Teste une hypothèse dominante ou récessive, puis la localisation chromosomique.",
      "Écris seulement les génotypes certains et garde les alternatives restantes.",
    ],
    interaction: diagram(
      "Transformer un arbre en preuve",
      "Explore les cinq branches : chacune correspond à une question obligatoire avant de conclure.",
      "Pedigree",
      "Une représentation familiale fournit des contraintes de transmission, jamais un diagnostic médical à elle seule.",
      [
        { id: "legend", label: "1. Décoder", role: "Convention", detail: "Carré, cercle, couleur, générations et liens de parenté donnent les observations de départ." },
        { id: "phenotype", label: "2. Décrire", role: "Phénotype", detail: "Relève qui exprime le caractère, sans confondre présence du caractère et génotype." },
        { id: "dominance", label: "3. Tester", role: "Dominance", detail: "Un enfant atteint de deux parents non atteints constitue un croisement informatif pour la récessivité." },
        { id: "location", label: "4. Localiser", role: "Autosome ou X", detail: "Suis précisément ce que le père transmet à ses filles et à ses fils." },
        { id: "limits", label: "5. Nuancer", role: "Conclusion", detail: "Conserve les génotypes possibles et nomme les limites des données familiales." },
      ],
      "Le raisonnement part des phénotypes et n’atteint un génotype qu’après élimination des modèles incompatibles.",
    ),
    questions: questions(0, [
      ["Que décrit le phénotype ?", "L’état observable ou mesurable d’un caractère", ["La totalité des chromosomes d’une espèce", "Le seul allèle reçu du père", "Le nombre de générations d’une famille"], "Le phénotype correspond à l’expression observée du caractère étudié.", guideLabel("p. 13")],
      ["Que désigne un allèle ?", "Une version d’un gène", ["Une union dans un pedigree", "Un chromosome sexuel entier", "Un caractère uniquement acquis"], "Les allèles sont les différentes versions d’un même gène.", guideLabel("p. 13")],
      ["Quel symbole conventionnel représente une femme ?", "Un cercle", ["Un carré", "Une flèche", "Un losange obligatoire"], "Le cercle représente une femme dans les conventions scolaires du pedigree.", guideLabel("p. 35")],
      ["Que signifie d’abord un symbole coloré ?", "Le phénotype étudié est présent", ["L’individu est forcément homozygote", "Le gène est situé sur X", "La maladie est dominante"], "La couleur décrit une observation phénotypique ; le génotype reste à déduire.", guideLabel("p. 35")],
      ["Pourquoi une ressemblance familiale ne prouve-t-elle pas toujours une transmission monogénique ?", "L’environnement et plusieurs gènes peuvent aussi contribuer", ["Parce que les enfants ne reçoivent aucun gène", "Parce que tout caractère est lié à Y", "Parce qu’un pedigree interdit toute comparaison"], "Un caractère complexe peut dépendre de facteurs génétiques multiples et de l’environnement.", guideLabel("p. 13")],
      ["Quelle démarche respecte le mieux les données ?", "Décrire, proposer un modèle, puis chercher une contradiction", ["Deviner le génotype au premier regard", "Compter seulement les hommes", "Choisir toujours le modèle dominant"], "La confrontation des prédictions aux observations protège contre une conclusion hâtive.", guideLabel("p. 35")],
      ["Qu’indique une ligne horizontale entre deux individus ?", "Une union", ["Une mutation certaine", "Un génotype identique", "Une génération nouvelle"], "La ligne horizontale relie conventionnellement les deux membres d’une union.", guideLabel("p. 35")],
      ["Si un individu non atteint peut être $AA$ ou $Aa$, que faut-il écrire ?", "$AA$ ou $Aa$", ["$AA$ uniquement", "$Aa$ uniquement", "$aa$ uniquement"], "On conserve toutes les possibilités non éliminées par le pedigree.", guideLabel("p. 35")],
      ["Que signifie la dominance d’un allèle ?", "Il s’exprime chez l’hétérozygote", ["Il est toujours le plus fréquent", "Il est toujours bénéfique", "Il provoque toujours un caractère grave"], "Dominant décrit une relation d’expression, pas une fréquence ni un jugement de valeur.", guideLabel("p. 35")],
    ], short("Donne les trois lettres du repère Observer, Hypothèse, Tester.", ["OHT", "O-H-T", "O H T"], "Le repère est O-H-T : observer, émettre une hypothèse, tester.", guideLabel("p. 35"))),
    precisions: [
      "La ressemblance familiale est distinguée d’une preuve de transmission monogénique.",
      "La dominance est définie comme une relation d’expression, sans connotation de fréquence, de gravité ou de valeur.",
      "Le pedigree est présenté comme un outil de compatibilité des modèles et non comme un diagnostic médical.",
    ],
  },
  {
    id: "dominance-recessivity",
    title: "Établir dominance ou récessivité",
    summary: "Utiliser des croisements familiaux informatifs pour distinguer un allèle dominant d’un allèle récessif et calculer les issues d’un croisement hétérozygote.",
    pages: "p. 35",
    section: "Détermination de la dominance ou de la récessivité du caractère",
    durationMinutes: 29,
    xp: 55,
    body: `
## 1. Le phénotype des parents ne suffit pas toujours

Dans un modèle à **dominance complète**, notons $A$ l’allèle dominant et $a$ l’allèle récessif. Les génotypes $AA$ et $Aa$ donnent le phénotype dominant ; seul $aa$ donne le phénotype récessif. Un individu de phénotype dominant n’a donc pas un génotype unique tant qu’aucune donnée familiale ne tranche.

Le croisement le plus informatif pour établir la récessivité est celui de deux parents non atteints ayant un enfant atteint. Si le modèle est simple, les parents sont $Aa$ et l’enfant $aa$. Chacun des parents a transmis un allèle masqué.

## 2. Tester le modèle inverse

Pour un caractère dominant à pénétrance complète, deux parents atteints peuvent avoir un enfant non atteint s’ils sont $Aa \\times Aa$. Cet enfant $aa$ montre que chacun des parents porte l’allèle récessif. En revanche, deux parents $aa$ ne peuvent avoir, sans autre mécanisme, un enfant de phénotype dominant : ils ne produisent que des gamètes $a$.

| Croisement | Génotypes attendus | Phénotype récessif attendu |
|---|---|---|
| $AA \\times aa$ | tous $Aa$ | 0 |
| $Aa \\times aa$ | $1/2\\,Aa$, $1/2\\,aa$ | $1/2$ |
| $Aa \\times Aa$ | $1/4\\,AA$, $1/2\\,Aa$, $1/4\\,aa$ | $1/4$ |

## 3. Probabilité, pas calendrier familial

Le risque $1/4$ vaut **à chaque grossesse** dans le croisement $Aa \\times Aa$. Quatre enfants ne donnent pas obligatoirement un enfant de chaque case : les conceptions sont des événements indépendants dans le modèle. Après la naissance d’un enfant $aa$, le risque théorique de la grossesse suivante reste $1/4$.

Dans une famille réelle, mutations nouvelles, pénétrance incomplète, erreurs de phénotypage ou hétérogénéité génétique peuvent compliquer l’analyse. L’exercice scolaire annonce donc ses hypothèses avant de conclure.

> **Repère Davy — le caractère récessif peut sauter une génération parce que l’allèle reste caché chez les hétérozygotes.**
`,
    keyPoint: "Deux parents non atteints ayant un enfant atteint établissent la récessivité dans le modèle complet : $Aa \\times Aa$ peut produire $aa$ avec une probabilité $1/4$.",
    example: "Après un premier enfant $aa$ de parents $Aa$, le prochain enfant a encore $1/4$ de probabilité d’être $aa$ ; les résultats précédents ne remplissent pas un quota.",
    methodSteps: [
      "Repère un enfant dont le phénotype diffère de celui de ses deux parents.",
      "Traduis le phénotype récessif par $aa$.",
      "Remonte un allèle $a$ vers chacun des parents obligatoirement porteurs.",
      "Construis l’échiquier de croisement avec les gamètes possibles.",
      "Exprime chaque résultat comme une probabilité par conception.",
    ],
    interaction: timeline(
      "De l’observation au risque mendélien",
      "Avance étape par étape et distingue bien la déduction génétique du calcul probabiliste.",
      [
        { label: "Parents non atteints", shortLabel: "Observation", detail: "Leur phénotype peut cacher un allèle récessif." },
        { label: "Enfant atteint", shortLabel: "$aa$", detail: "Dans le modèle récessif complet, l’enfant reçoit $a$ de chacun des parents." },
        { label: "Parents porteurs", shortLabel: "$Aa \\times Aa$", detail: "Chaque parent est non atteint mais possède l’allèle transmis." },
        { label: "Échiquier", shortLabel: "1–2–1", detail: "Les génotypes théoriques sont $1/4 AA$, $1/2 Aa$ et $1/4 aa$." },
        { label: "Nouvelle grossesse", shortLabel: "$1/4$", detail: "Le risque est recalculé de la même manière à chaque conception." },
      ],
      "Le pedigree établit les génotypes parentaux sous le modèle ; l’échiquier donne ensuite une distribution de probabilités.",
    ),
    questions: questions(9, [
      ["Dans le modèle complet, quel génotype exprime le phénotype récessif ?", "$aa$", ["$AA$", "$Aa$", "$A-$ uniquement"], "Deux allèles récessifs sont nécessaires pour exprimer ce phénotype.", guideLabel("p. 35")],
      ["Deux parents non atteints ont un enfant atteint. Quel croisement est compatible ?", "$Aa \\times Aa$", ["$AA \\times AA$", "$AA \\times aa$", "$aa \\times aa$"], "Chaque parent non atteint doit avoir transmis un allèle $a$ masqué.", guideLabel("p. 35")],
      ["Quelle proportion de $aa$ attend-on pour $Aa \\times Aa$ ?", "$1/4$", ["$0$", "$1/2$", "$3/4$"], "Une des quatre combinaisons équiprobables est $aa$.", guideLabel("p. 35")],
      ["Quel croisement produit uniquement des descendants $Aa$ ?", "$AA \\times aa$", ["$Aa \\times Aa$", "$Aa \\times aa$", "$aa \\times aa$"], "Le premier parent ne produit que A et le second que a.", guideLabel("p. 35")],
      ["Deux parents au phénotype dominant ont un enfant récessif. Que sait-on d’eux ?", "Ils sont tous deux hétérozygotes", ["Ils sont tous deux $AA$", "Ils sont tous deux $aa$", "Leur génotype est sans aucun lien avec l’enfant"], "L’enfant $aa$ a reçu un allèle a de chacun des parents dominants.", guideLabel("p. 35")],
      ["Après un enfant $aa$ de parents $Aa$, quel est le risque théorique pour la grossesse suivante ?", "$1/4$", ["$0$", "$1/2$", "$1$"], "Chaque conception est un nouvel événement dans ce modèle.", guideLabel("p. 35")],
      ["Pourquoi un caractère récessif peut-il sembler sauter une génération ?", "L’allèle peut être masqué chez des hétérozygotes", ["L’allèle quitte temporairement l’ADN", "Les autosomes disparaissent", "Le sexe change le génotype de tous les enfants"], "Les porteurs $Aa$ transmettent a sans exprimer le phénotype récessif.", guideLabel("p. 35")],
      ["Que signifie la probabilité $1/4$ dans une fratrie ?", "Un risque à chaque conception, pas un quota garanti", ["Exactement un enfant sur chaque groupe de quatre", "Le quatrième enfant sera nécessairement atteint", "Le risque devient nul après un cas"], "Les fréquences d’une petite fratrie peuvent s’écarter des proportions théoriques.", guideLabel("p. 35")],
      ["Quelle réserve rend la conclusion scolaire valide ?", "Annoncer un modèle monogénique à pénétrance complète", ["Supposer que toute famille a quatre enfants", "Ignorer tous les génotypes parentaux", "Confondre fréquence et dominance"], "Les conclusions dépendent des hypothèses du modèle utilisé.", guideLabel("p. 35")],
    ], short("Écris le rapport génotypique de $Aa \\times Aa$ sous la forme AA:Aa:aa.", ["1:2:1", "1 2 1", "1/4:1/2:1/4"], "Le rapport génotypique est 1 AA : 2 Aa : 1 aa.", guideLabel("p. 35"))),
    precisions: [
      "La pénétrance complète et le modèle monogénique sont explicitement posés comme hypothèses scolaires.",
      "Les proportions mendéliennes sont présentées comme des probabilités par conception, jamais comme un quota familial.",
      "La dominance n’est pas déduite d’une simple majorité numérique dans le pedigree.",
    ],
  },
  {
    id: "autosomal-inheritance",
    title: "Reconnaître une transmission autosomique",
    summary: "Localiser un caractère sur un autosome par des croisements informatifs, attribuer les génotypes certains et écarter prudemment les modèles liés à X.",
    pages: "pp. 35-36",
    section: "Gènes autosomaux et analyse des arbres généalogiques",
    durationMinutes: 31,
    xp: 65,
    body: `
## 1. Autosome ne signifie pas « autant de femmes que d’hommes »

Un **autosome** est un chromosome autre que X ou Y. Une transmission autosomique peut concerner les deux sexes, car chacun possède deux copies de chaque autosome. Mais une petite famille peut, par hasard, compter davantage de personnes atteintes d’un sexe : le simple décompte ne prouve donc pas la localisation.

Il faut rechercher une relation impossible dans un modèle lié à X. Un père transmet son chromosome **Y à ses fils** et son chromosome **X à ses filles**. Ainsi, une transmission directe père-fils d’un allèle étudié exclut que cet allèle soit porté par X, sous le modèle simple. Pour un caractère récessif, une fille atteinte de père non atteint contredit également le modèle récessif lié à X : elle ne pourrait pas recevoir de lui l’allèle récessif sur X.

## 2. Déduire sans surinterpréter

Le pedigree interactif présente deux parents non atteints et des enfants atteints des deux sexes. Dans le modèle récessif retenu :

- les parents sont $Aa$ ;
- les enfants atteints sont $aa$ ;
- un enfant non atteint reste $AA$ **ou** $Aa$.

La fille atteinte alors que son père est non atteint élimine le modèle récessif lié à X le plus simple. Le modèle autosomique récessif explique toutes les observations sans contradiction.

## 3. Formuler une conclusion proportionnée

La bonne conclusion est : « ce pedigree est **compatible avec** une transmission autosomique récessive dans les hypothèses données ». On n’identifie pas ainsi le chromosome précis, le gène ou la variante. Une analyse moléculaire serait nécessaire pour cela.

> **Repère Davy — père-fils :** un père ne donne jamais son X à son fils. Une transmission certaine père-fils est donc une clé d’élimination d’un modèle lié à X.
`,
    keyPoint: "Une transmission autosomique s’établit par élimination des modèles liés à X à l’aide d’un croisement informatif, pas par un simple comptage des sexes.",
    example: "Une fille $aa$ a un père non atteint : le modèle récessif lié à X échoue, tandis que le modèle autosomique $Aa \\times Aa$ reste cohérent.",
    methodSteps: [
      "Établis d’abord si le caractère est dominant ou récessif.",
      "Écris la transmission des chromosomes X du père vers ses filles et de Y vers ses fils.",
      "Cherche une fille récessive de père non atteint ou une transmission certaine père-fils.",
      "Attribue les génotypes certains dans le modèle autosomique.",
      "Conserve les alternatives chez les personnes dont le phénotype ne tranche pas.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Pedigree autosomique construit",
      title: "Repérer la contradiction qui élimine X",
      instruction: "Sélectionne chaque repère et distingue observation, déduction certaine et possibilité restante.",
      viewBox: "0 0 660 360",
      caption: "Figure pédagogique originale adaptée aux habiletés des pages 35-36 du guide.",
      shapes: autosomalShapes,
      hotspots: autosomalHotspots,
      observation: "La fille atteinte de père non atteint contredit le modèle récessif lié à X ; $Aa \\times Aa$ explique les quatre enfants dans un modèle autosomique.",
    },
    questions: questions(18, [
      ["Qu’est-ce qu’un autosome ?", "Un chromosome autre que X ou Y", ["Un allèle toujours dominant", "Le chromosome X uniquement", "Un chromosome présent seulement chez l’homme"], "Les autosomes sont les chromosomes non sexuels.", guideLabel("p. 35")],
      ["Pourquoi compter les hommes et les femmes atteints ne suffit-il pas ?", "Une petite fratrie peut être déséquilibrée par hasard", ["Les femmes ne possèdent pas d’autosomes", "Les hommes reçoivent deux X", "Le sexe n’est jamais indiqué dans un pedigree"], "La proportion observée dans un petit effectif n’établit pas la localisation du locus.", guideLabel("p. 35")],
      ["Que transmet un père à chacun de ses fils dans le modèle XY ?", "Son chromosome Y", ["Son chromosome X", "Ses deux chromosomes sexuels", "Aucun chromosome sexuel"], "Le fils reçoit Y de son père et X de sa mère.", guideLabel("p. 35")],
      ["Quel fait exclut directement une localisation sur X ?", "Une transmission certaine de père à fils", ["Une mère transmettant à sa fille", "Deux sœurs non atteintes", "Un caractère rare"], "Le père ne transmet pas son chromosome X à son fils.", guideLabel("p. 35")],
      ["Dans un modèle récessif lié à X, que faut-il pour qu’une fille soit atteinte ?", "Elle doit recevoir l’allèle concerné sur chacun de ses X", ["Elle doit recevoir Y de son père", "Un seul allèle sur un autosome suffit", "Sa mère doit être obligatoirement atteinte"], "Une fille possède deux chromosomes X dans ce modèle.", guideLabel("p. 35")],
      ["Une fille atteinte a un père non atteint. Quel modèle simple est contredit ?", "Le modèle récessif lié à X", ["Tout modèle autosomique", "Le modèle autosomique récessif", "La ségrégation des autosomes"], "Le père non atteint ne peut fournir l’allèle récessif lié à X nécessaire à sa fille.", guideLabel("p. 35")],
      ["Dans le schéma, quel génotype ont les enfants atteints sous l’hypothèse autosomique ?", "$aa$", ["$AA$", "$Aa$", "$A-$"], "Le caractère est ici modélisé comme autosomique récessif.", guideLabel("pp. 35-36")],
      ["Quel génotype attribuer à un frère non atteint sans autre donnée ?", "$AA$ ou $Aa$", ["$AA$ seulement", "$Aa$ seulement", "$aa$"], "Son phénotype n’élimine ni l’homozygotie dominante ni l’hétérozygotie.", guideLabel("pp. 35-36")],
      ["Quelle conclusion est la plus rigoureuse ?", "Le pedigree est compatible avec une transmission autosomique récessive", ["Le pedigree révèle le gène exact", "Tous les enfants futurs seront atteints", "Le caractère est autosomique parce que les sexes sont égaux"], "Le pedigree teste un modèle sans identifier à lui seul le gène ni la variante.", guideLabel("p. 36")],
    ], short("Quel chromosome un père transmet-il à son fils : X ou Y ?", ["Y", "chromosome Y", "le Y"], "Dans le modèle XY, le fils reçoit Y de son père.", guideLabel("p. 35"))),
    precisions: [
      "L’autosomie n’est pas conclue à partir d’une égalité approximative entre les sexes.",
      "La transmission père-fils est utilisée comme test d’exclusion de la liaison à X.",
      "La conclusion distingue compatibilité du modèle et identification moléculaire du gène.",
    ],
  },
  {
    id: "x-linked-inheritance",
    title: "Raisonner sur une transmission récessive liée à X",
    summary: "Suivre l’origine des chromosomes X et Y, comprendre l’hémizygotie masculine et interpréter prudemment une déficience rouge-vert liée à X.",
    pages: "p. 35",
    section: "Gènes portés par les chromosomes sexuels et échiquiers de croisement",
    durationMinutes: 32,
    xp: 70,
    body: `
## 1. Un homme possède une seule copie du locus lié à X

Pour un locus porté par X, notons $X^N$ l’allèle usuel et $X^n$ l’allèle récessif étudié. Une femme peut être $X^NX^N$, $X^NX^n$ ou $X^nX^n$. Un homme XY est **hémizygote** pour ce locus : $X^NY$ ou $X^nY$. Un seul allèle récessif sur son unique X suffit donc à produire le phénotype dans ce modèle.

Le père donne son X à toutes ses filles et son Y à tous ses fils. Il n’existe donc pas de transmission père-fils pour un locus lié à X. Une mère $X^NX^n$ et un père $X^NY$ ont théoriquement :

- parmi les fils, $1/2$ $X^nY$ atteints et $1/2$ $X^NY$ non atteints ;
- parmi les filles, $1/2$ $X^NX^n$ conductrices et $1/2$ $X^NX^N$ non conductrices ;
- aucun enfant atteint avec certitude avant la conception.

## 2. Le cas pédagogique de la vision rouge-vert

Les déficiences rouge-vert les plus fréquentes sont généralement liées à X. Elles sont plus souvent exprimées chez les hommes, mais « plus d’hommes atteints » n’est pas une preuve suffisante : c’est la circulation de X dans le pedigree qui fonde le raisonnement. Toutes les déficiences de vision des couleurs ne suivent pas ce mode ; le cours limite donc explicitement l’exemple aux formes rouge-vert classiques.

## 3. Conductrice ne signifie pas certaine sans preuve

Une femme non atteinte n’est pas automatiquement conductrice. Dans le schéma, le point central marque la mère $X^NX^n$ parce que son génotype est déduit des enfants et du modèle. Une fille non atteinte peut être conductrice ou non. Une analyse génétique peut trancher, alors que le phénotype seul ne le peut pas toujours.

> **Repère Davy — les fils reçoivent leur X de leur mère ; les filles reçoivent nécessairement le X paternel.**
`,
    keyPoint: "Pour un caractère récessif lié à X, il n’y a pas de transmission père-fils et un homme $X^nY$ exprime l’allèle porté par son unique X.",
    example: "Avec $X^NX^n \\times X^NY$, chaque fils a $1/2$ de risque d’être $X^nY$, tandis qu’aucune fille n’est atteinte dans ce croisement précis.",
    methodSteps: [
      "Écris séparément les génotypes possibles des femmes XX et des hommes XY.",
      "Liste les gamètes maternels et paternels.",
      "Rappelle que le père donne Y aux fils et X aux filles.",
      "Calcule d’abord les génotypes, puis les phénotypes par sexe.",
      "Vérifie chaque branche du pedigree et conserve les statuts conducteurs possibles.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Transmission liée à X",
      title: "Suivre l’unique X du garçon atteint",
      instruction: "Ouvre les repères pour identifier l’origine de chaque chromosome sexuel.",
      viewBox: "0 0 660 360",
      caption: "Figure pédagogique originale d’une mère conductrice et d’un père non atteint.",
      shapes: xLinkedShapes,
      hotspots: xLinkedHotspots,
      observation: "Le fils atteint reçoit $X^n$ de sa mère et Y de son père ; le père ne peut pas lui transmettre son chromosome X.",
    },
    questions: questions(27, [
      ["Que signifie hémizygote pour un locus lié à X chez un homme XY ?", "Il ne possède qu’une copie de ce locus", ["Il possède trois allèles", "Il possède deux chromosomes X identiques", "Il ne possède aucun chromosome sexuel"], "L’homme XY n’a qu’un chromosome X pour ce locus.", guideLabel("p. 35")],
      ["Quel chromosome sexuel un père transmet-il à sa fille ?", "Son chromosome X", ["Son chromosome Y", "X et Y ensemble", "Aucun chromosome sexuel"], "Une fille reçoit un X de chacun de ses parents.", guideLabel("p. 35")],
      ["Quel chromosome sexuel un père transmet-il à son fils ?", "Son chromosome Y", ["Son chromosome X", "Les deux X", "Aucun"], "Le fils reçoit Y de son père.", guideLabel("p. 35")],
      ["Quel génotype correspond à un homme atteint dans le modèle récessif lié à X ?", "$X^nY$", ["$X^NX^N$", "$X^NX^n$", "$X^NY$"], "Son unique chromosome X porte l’allèle récessif étudié.", guideLabel("p. 35")],
      ["Avec une mère $X^NX^n$ et un père $X^NY$, quel risque a chaque fils d’être atteint ?", "$1/2$", ["$0$", "$1/4$", "$1$"], "Parmi les fils, la moitié reçoit théoriquement $X^n$ de la mère.", guideLabel("p. 35")],
      ["Dans ce même croisement, quelle fille peut être conductrice ?", "$X^NX^n$", ["$X^nY$", "$X^NY$", "$YY$"], "Une fille conductrice reçoit Xn de sa mère et XN de son père.", guideLabel("p. 35")],
      ["Pourquoi n’observe-t-on pas de transmission liée à X de père à fils ?", "Le fils reçoit Y de son père", ["Le père ne possède aucun X", "Le fils reçoit ses deux chromosomes de sa mère", "Le chromosome X devient autosomique"], "Le chromosome X du fils vient de sa mère.", guideLabel("p. 35")],
      ["Quelle formulation est précise pour l’exemple de vision des couleurs ?", "Les formes rouge-vert classiques sont généralement liées à X", ["Toute déficience visuelle est liée à X", "Seuls les hommes peuvent être concernés", "Le phénotype révèle toujours le génotype féminin"], "Les déficiences de vision des couleurs constituent un ensemble plus divers que l’exemple scolaire.", guideLabel("p. 35")],
      ["Une femme non atteinte est-elle toujours conductrice ?", "Non, son génotype peut nécessiter le pedigree ou un test", ["Oui, parce qu’elle possède deux X", "Oui, si elle a un frère", "Non, car une femme ne porte jamais l’allèle"], "Le phénotype non atteint n’impose pas à lui seul le statut conducteur.", guideLabel("p. 35")],
    ], short("De quel parent un garçon reçoit-il son chromosome X ?", ["sa mère", "de sa mère", "mère"], "Un garçon reçoit X de sa mère et Y de son père.", guideLabel("p. 35"))),
    precisions: [
      "L’expression « déficience rouge-vert » remplace toute généralisation abusive à l’ensemble des déficiences de vision des couleurs.",
      "L’hémizygotie masculine et l’absence de transmission père-fils sont explicitement justifiées par les chromosomes reçus.",
      "Une femme non atteinte n’est pas déclarée conductrice sans information familiale ou biologique suffisante.",
    ],
  },
  {
    id: "codominance-sickle-cell",
    title: "Comprendre la codominance avec l’hémoglobine",
    summary: "Relier les allèles $Hb^A$ et $Hb^S$, les profils moléculaires AA, AS et SS, puis calculer un risque familial sans confondre trait drépanocytaire et maladie.",
    pages: "pp. 35-36",
    section: "Codominance, analyse de pedigrees et détermination des génotypes",
    durationMinutes: 34,
    xp: 75,
    body: `
## 1. Deux allèles détectables chez l’hétérozygote

La **codominance** signifie que les deux allèles d’un hétérozygote contribuent de façon détectable au caractère moléculaire étudié. Pour l’hémoglobine, on peut noter $Hb^A$ et $Hb^S$ :

| Génotype simplifié | Profil d’hémoglobine dans le modèle | Interprétation pédagogique |
|---|---|---|
| $Hb^AHb^A$ | HbA | profil AA |
| $Hb^AHb^S$ | HbA et HbS | trait drépanocytaire AS |
| $Hb^SHb^S$ | HbS majoritaire | drépanocytose SS |

La présence simultanée de HbA et HbS chez AS illustre la codominance **au niveau moléculaire**. Elle ne signifie pas que le tableau clinique de SS et le trait AS s’expriment avec la même intensité. Le trait drépanocytaire AS n’est pas une « moitié de maladie » : la plupart des personnes AS ne présentent pas la drépanocytose, même si certaines situations extrêmes peuvent demander des précautions médicales.

## 2. Un croisement AS × AS

Chaque parent produit des gamètes $Hb^A$ et $Hb^S$. À chaque grossesse :

$$Hb^AHb^S \\times Hb^AHb^S \\rightarrow \\frac14 AA + \\frac12 AS + \\frac14 SS$$

Le risque théorique de SS est donc $1/4$, celui d’AS $1/2$ et celui d’AA $1/4$, pour les filles comme pour les garçons puisque le locus est autosomique. Ces probabilités recommencent à chaque conception.

## 3. Le conseil n’est pas une injonction

Un pedigree peut signaler une hypothèse familiale, mais le statut AA, AS ou SS se confirme par une analyse biologique appropriée, comme une étude de l’hémoglobine. Une communication responsable expose les résultats et les incertitudes sans stigmatiser, accuser ni imposer une décision reproductive. D’autres génotypes de drépanocytose existent ; le modèle AA/AS/SS est volontairement limité à l’objectif monohybride du guide.

> **Repère Davy — codominants dans le test, différents dans la clinique :** la présence de deux hémoglobines chez AS ne transforme pas AS en forme atténuée obligatoire de SS.
`,
    keyPoint: "Dans $AS \\times AS$, chaque grossesse donne théoriquement $1/4$ AA, $1/2$ AS et $1/4$ SS ; HbA et HbS sont détectables chez l’hétérozygote AS.",
    example: "Deux parents AS ont déjà un enfant SS : le risque théorique SS de la grossesse suivante reste $1/4$, indépendamment du résultat précédent.",
    methodSteps: [
      "Nommer les deux allèles $Hb^A$ et $Hb^S$ sans les réduire à normal/mauvais.",
      "Associer chaque génotype au profil moléculaire attendu.",
      "Lister les gamètes de chacun des parents.",
      "Construire l’échiquier et calculer AA, AS et SS.",
      "Présenter le risque par grossesse et rappeler la nécessité d’une confirmation biologique.",
    ],
    interaction: diagram(
      "Relier gène, hémoglobine et risque",
      "Explore chaque branche afin de ne pas confondre codominance moléculaire, phénotype clinique et probabilité familiale.",
      "Locus de la β-globine",
      "Le modèle pédagogique compare deux allèles, $Hb^A$ et $Hb^S$, sur un autosome.",
      [
        { id: "aa", label: "AA", role: "HbA", detail: "Le profil simplifié contient HbA ; aucun allèle HbS n’est transmis par cet individu." },
        { id: "as", label: "AS", role: "HbA + HbS", detail: "Les deux formes sont détectables : c’est la codominance moléculaire et le trait drépanocytaire." },
        { id: "ss", label: "SS", role: "Drépanocytose", detail: "Deux allèles HbS sont associés au modèle SS de la maladie." },
        { id: "cross", label: "AS × AS", role: "Échiquier", detail: "Les issues théoriques par conception sont 1/4 AA, 1/2 AS et 1/4 SS." },
        { id: "confirm", label: "Confirmer", role: "Analyse biologique", detail: "Un pedigree oriente ; un examen de l’hémoglobine confirme le statut dans un cadre de santé." },
      ],
      "La codominance s’observe dans le profil moléculaire de AS ; le risque SS de 1/4 est indépendant à chaque grossesse.",
    ),
    questions: questions(36, [
      ["Que montre la codominance chez un individu AS ?", "HbA et HbS sont toutes deux détectables", ["HbS détruit toujours toute HbA", "Aucun produit allélique n’est détecté", "L’individu possède trois allèles"], "Les deux allèles contribuent au profil moléculaire de l’hétérozygote.", guideLabel("p. 35")],
      ["Quel génotype simplifié correspond au trait drépanocytaire ?", "$Hb^AHb^S$", ["$Hb^AHb^A$", "$Hb^SHb^S$", "$YY$"], "Le profil AS porte un allèle HbA et un allèle HbS.", guideLabel("pp. 35-36")],
      ["Quelle proportion SS donne théoriquement AS × AS ?", "$1/4$", ["$0$", "$1/2$", "$3/4$"], "Une des quatre combinaisons reçoit HbS de chacun des parents.", guideLabel("p. 36")],
      ["Quelle proportion AS donne théoriquement AS × AS ?", "$1/2$", ["$1/4$", "$3/4$", "$1$"], "Deux cases sur quatre sont hétérozygotes AS.", guideLabel("p. 36")],
      ["Le risque SS dépend-il du sexe de l’enfant dans ce modèle ?", "Non, le locus est autosomique", ["Oui, seuls les garçons sont SS", "Oui, seules les filles sont SS", "Oui, le père donne X à ses fils"], "Les deux sexes possèdent deux copies du locus autosomique.", guideLabel("p. 35")],
      ["Après la naissance d’un enfant SS de parents AS, quel reste le risque SS suivant ?", "$1/4$", ["$0$", "$1/2$", "$1$"], "Les conceptions sont indépendantes dans le modèle.", guideLabel("p. 36")],
      ["Pourquoi AS ne doit-il pas être appelé automatiquement « moitié de maladie » ?", "La codominance moléculaire ne prédit pas une moitié de tableau clinique", ["Parce que AS ne contient aucun HbS", "Parce que SS est lié à X", "Parce que les allèles disparaissent après la naissance"], "Le niveau moléculaire et l’expression clinique ne se superposent pas de manière proportionnelle.", guideLabel("p. 35")],
      ["Quel outil confirme un statut AA, AS ou SS ?", "Une analyse biologique de l’hémoglobine", ["La forme du symbole dans le pedigree uniquement", "Le nombre de frères", "Une photographie de famille"], "Le pedigree oriente, tandis qu’un examen adapté établit le profil biologique.", guideLabel("p. 36")],
      ["Quelle communication est responsable face à un risque génétique ?", "Informer sans stigmatiser ni imposer une décision", ["Accuser un parent", "Déduire une paternité du seul phénotype", "Interdire tout projet familial"], "Le conseil présente probabilités, limites et possibilités de confirmation de façon non directive.", guideLabel("p. 36")],
    ], short("Dans AS × AS, quel pourcentage théorique des enfants est AS ?", ["50%", "50 %", "un sur deux", "1/2"], "Deux combinaisons sur quatre sont AS, soit 50 %.", guideLabel("p. 36"))),
    precisions: [
      "La codominance est située au niveau moléculaire ; elle n’est pas confondue avec une expression clinique intermédiaire obligatoire.",
      "Le trait drépanocytaire AS est distingué de la drépanocytose SS, avec une formulation non stigmatisante.",
      "Le modèle AA/AS/SS est annoncé comme simplifié car d’autres génotypes de drépanocytose existent.",
      "Le statut biologique n’est jamais déduit avec certitude du seul pedigree.",
    ],
  },

  {
    id: "abo-polyallelism",
    title: "Distinguer polyallélisme et codominance avec ABO",
    summary: "Expliquer comment trois allèles présents dans la population produisent quatre groupes sanguins, puis construire un échiquier sans confondre phénotype et génotype.",
    pages: "p. 35",
    section: "Cas de polyallélisme et de codominance",
    durationMinutes: 33,
    xp: 80,
    body: `
## 1. Trois allèles dans la population, deux chez une personne

Le système ABO illustre le **polyallélisme** : le locus possède au moins trois allèles dans la population, notés $I^A$, $I^B$ et $i$. Une personne diploïde n’en porte cependant que deux, un sur chacun de ses chromosomes homologues. Polyallélisme ne signifie donc jamais « trois allèles chez le même individu ».

Les allèles $I^A$ et $I^B$ sont **codominants** : le génotype $I^AI^B$ exprime les antigènes A et B et donne le groupe AB. Chacun est dominant sur $i$ dans le modèle scolaire.

| Groupe observé | Génotype ou génotypes possibles |
|---|---|
| A | $I^AI^A$ ou $I^Ai$ |
| B | $I^BI^B$ ou $I^Bi$ |
| AB | $I^AI^B$ |
| O | $ii$ |

## 2. Le phénotype parental ne suffit pas toujours

Deux parents de groupes A et B peuvent avoir des génotypes différents. S’ils sont $I^Ai$ et $I^Bi$, leurs gamètes sont respectivement $I^A$ ou $i$, puis $I^B$ ou $i$. L’échiquier donne quatre issues équiprobables : $I^AI^B$ (AB), $I^Ai$ (A), $I^Bi$ (B) et $ii$ (O). Dans ce croisement précis, chacun des quatre groupes a une probabilité $1/4$.

Si le parent A était $I^AI^A$, un enfant O serait impossible avec le même partenaire, car ce parent ne pourrait transmettre aucun allèle $i$. Il faut donc conserver les deux génotypes possibles d’un groupe A ou B tant que la descendance ou une analyse ne tranche pas.

## 3. Une limite éthique et scientifique

Le système ABO peut rendre une filiation **incompatible** dans un modèle simple, mais il ne suffit pas à établir une paternité : de nombreuses personnes partagent chaque groupe, et des variantes rares existent. Les données de groupe sanguin ne doivent jamais servir à accuser une personne. Le cours les utilise uniquement pour apprendre les relations entre allèles.

> **Repère Davy — population : trois allèles ou plus ; individu diploïde : deux allèles au maximum.**
`,
    keyPoint: "$I^A$ et $I^B$ sont codominants, chacun domine $i$, et le polyallélisme ABO concerne le nombre d’allèles dans la population, pas chez un individu.",
    example: "$I^Ai \\times I^Bi$ peut produire A, B, AB ou O, chacun avec une probabilité $1/4$ dans le modèle.",
    methodSteps: [
      "Traduis chaque groupe sanguin en tous ses génotypes possibles.",
      "Utilise la descendance connue pour éliminer les génotypes incompatibles.",
      "Liste un seul allèle par gamète.",
      "Combine les gamètes dans l’échiquier et traduis les génotypes en groupes.",
      "Formule une compatibilité génétique sans tirer de conclusion de filiation.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Échiquier ABO interactif",
      title: "Faire apparaître les quatre groupes",
      instruction: "Explore les gamètes et les cases du croisement $I^Ai \\times I^Bi$.",
      viewBox: "0 0 640 410",
      caption: "Échiquier pédagogique original du croisement entre deux parents hétérozygotes A et B.",
      shapes: aboShapes,
      hotspots: aboHotspots,
      observation: "La case AB illustre la codominance de $I^A$ et $I^B$ ; la case O exige la transmission de $i$ par chacun des parents.",
    },
    questions: questions(45, [
      ["Que signifie le polyallélisme du système ABO ?", "Plus de deux allèles existent dans la population pour ce locus", ["Chaque personne porte obligatoirement trois allèles", "Le locus se trouve sur trois chromosomes", "Tous les groupes ont le même génotype"], "La population comporte IA, IB et i, mais un individu diploïde n’en porte que deux.", guideLabel("p. 35")],
      ["Quel génotype donne le groupe AB ?", "$I^AI^B$", ["$I^Ai$", "$I^Bi$", "$ii$"], "IA et IB s’expriment ensemble chez l’hétérozygote.", guideLabel("p. 35")],
      ["Quels génotypes peuvent donner le groupe A ?", "$I^AI^A$ ou $I^Ai$", ["$I^AI^B$ uniquement", "$I^BI^B$ ou $I^Bi$", "$ii$ uniquement"], "IA domine i, donc le phénotype A ne distingue pas les deux génotypes.", guideLabel("p. 35")],
      ["Quel génotype donne le groupe O dans le modèle scolaire ?", "$ii$", ["$I^AI^A$", "$I^AI^B$", "$I^Bi$"], "Deux allèles i sont nécessaires au groupe O.", guideLabel("p. 35")],
      ["Pourquoi $I^A$ et $I^B$ sont-ils dits codominants ?", "Ils s’expriment simultanément chez $I^AI^B$", ["Ils disparaissent chez l’hétérozygote", "Ils sont toujours plus fréquents que i", "Ils produisent uniquement le groupe O"], "Le groupe AB manifeste les antigènes A et B.", guideLabel("p. 35")],
      ["Quel groupe un enfant $ii$ possède-t-il ?", "O", ["A", "B", "AB"], "Le génotype ii correspond au groupe O dans ce modèle.", guideLabel("p. 35")],
      ["Pour $I^Ai \\times I^Bi$, quelle est la probabilité du groupe O ?", "$1/4$", ["$0$", "$1/2$", "$3/4$"], "Une case sur quatre combine i et i.", guideLabel("p. 35")],
      ["Un parent de groupe A a un enfant O. Que sait-on de son génotype dans le modèle ?", "Il est $I^Ai$", ["Il est nécessairement $I^AI^A$", "Il est $I^AI^B$", "Il est $ii$"], "Il a nécessairement transmis i à l’enfant ii.", guideLabel("p. 35")],
      ["Pourquoi ABO ne prouve-t-il pas à lui seul une paternité ?", "De nombreuses personnes partagent les groupes et le système est peu discriminant", ["Les groupes sanguins ne sont jamais héréditaires", "Chaque enfant change de groupe chaque année", "Le locus ABO est toujours lié à X"], "ABO peut tester certaines incompatibilités, pas identifier une personne de façon unique.", guideLabel("p. 35")],
    ], short("Combien d’allèles ABO une personne diploïde porte-t-elle au maximum à ce locus ?", ["2", "deux", "2 allèles", "deux allèles"], "Un individu diploïde porte deux copies du locus, même si la population compte trois allèles principaux.", guideLabel("p. 35"))),
    precisions: [
      "Le polyallélisme à l’échelle de la population est distingué des deux allèles portés au maximum par un individu diploïde.",
      "Le groupe A ou B ne reçoit pas un génotype unique sans information familiale supplémentaire.",
      "Le système ABO est présenté comme insuffisant pour établir une filiation et ne sert à aucune accusation.",
    ],
  },
  {
    id: "pedigree-diagnostic-strategy",
    title: "Conduire un diagnostic génétique scolaire complet",
    summary: "Organiser l’analyse d’un pedigree en tests successifs, distinguer génotypes certains et possibles, puis annoncer les limites du modèle.",
    pages: "pp. 35-36",
    section: "Méthode d’analyse des arbres généalogiques et détermination du mode de transmission",
    durationMinutes: 32,
    xp: 90,
    body: `
## 1. Une stratégie fixe évite les conclusions intuitives

Le guide demande d’analyser des arbres généalogiques, de déterminer les génotypes et d’expliquer le mode de transmission. Pour réussir, utilise toujours le même ordre. D’abord, relève les **phénotypes** et les liens de parenté. Ensuite, teste dominance ou récessivité à partir d’un croisement informatif. Puis seulement, compare une localisation autosomique à une liaison au chromosome X.

Un modèle fait des prédictions. S’il est récessif lié à X, un père non atteint ne peut avoir une fille atteinte par simple transmission de l’allèle étudié. S’il est dominant lié à X, un père atteint transmettrait l’allèle à toutes ses filles et à aucun de ses fils. Une seule observation incompatible suffit à rejeter le modèle sous les hypothèses annoncées.

## 2. Classer les génotypes par niveau de certitude

Écris d’abord les génotypes **certains** : une personne exprimant un phénotype récessif est homozygote récessive dans un modèle autosomique, ou hémizygote concernée si elle est un homme dans un modèle lié à X. Remonte ensuite vers les parents obligatoirement porteurs. Enfin, note les alternatives : $AA$ ou $Aa$, par exemple, si le phénotype dominant ne tranche pas.

| Formulation | Valeur scientifique |
|---|---|
| « est $aa$ dans le modèle retenu » | déduction conditionnelle certaine |
| « peut être $AA$ ou $Aa$ » | incertitude conservée |
| « le gène exact est prouvé » | conclusion excessive sans analyse |

## 3. Vérifier puis communiquer

Contrôle la transmission en tenant compte de la localisation du locus. Pour un locus autosomique, chaque enfant reçoit bien un allèle de chacun de ses parents. Pour un locus lié à X, une fille reçoit un allèle porté par X de chacun de ses parents, tandis qu’un garçon reçoit l’allèle lié à X de sa mère et le chromosome Y de son père. Vérifie ensuite qu’aucune branche ne contredit l’hypothèse. Calcule les probabilités à partir des génotypes parentaux, sans transformer une fréquence théorique en prédiction individuelle. Termine par une phrase de limite : pedigree incomplet, pénétrance supposée complète, absence de mutation nouvelle, diagnostic biologique non réalisé.

> **Méthode Davy — D-L-G-C :** **D**ominance, **L**ocalisation, **G**énotypes, **C**onclusion et limites.
`,
    keyPoint: "Une analyse robuste suit l’ordre dominance, localisation, génotypes, contrôle des croisements, puis conclusion limitée aux données.",
    example: "Si un modèle explique neuf individus mais échoue pour une fille atteinte de père non atteint, il est rejeté : on ne vote pas à la majorité des branches.",
    methodSteps: [
      "Recopie les observations et identifie le croisement le plus informatif.",
      "Teste dominance et récessivité sous une pénétrance supposée complète.",
      "Teste autosome, liaison à X et transmission père-fils.",
      "Attribue les génotypes certains avant les génotypes possibles.",
      "Vérifie toutes les unions, calcule le risque et rédige une limite explicite.",
    ],
    interaction: timeline(
      "Le protocole en six décisions",
      "Déroule la méthode ; chaque étape doit être validée avant la suivante.",
      [
        { label: "Décrire", shortLabel: "Phénotypes", detail: "Relever sexes, générations, personnes exprimant le caractère et liens de parenté." },
        { label: "Tester la dominance", shortLabel: "D ou r", detail: "Chercher parents non atteints/enfant atteint ou parents atteints/enfant non atteint." },
        { label: "Tester la localisation", shortLabel: "Autosome ou X", detail: "Suivre X du père vers les filles et Y vers les fils ; chercher une contradiction." },
        { label: "Écrire les génotypes", shortLabel: "Certain/possible", detail: "Commencer par les récessifs et les porteurs obligatoires, puis conserver les alternatives." },
        { label: "Contrôler", shortLabel: "Toutes les branches", detail: "Reconstituer les allèles ou chromosomes compatibles selon le sexe de l’enfant et la localisation du locus." },
        { label: "Conclure", shortLabel: "Modèle + limites", detail: "Nommer le mode compatible, la probabilité et ce que le pedigree ne démontre pas." },
      ],
      "Une incompatibilité logique élimine un modèle, même si la plupart des autres branches semblent lui ressembler.",
    ),
    questions: questions(54, [
      ["Quelle est la première étape d’une analyse de pedigree ?", "Décrire les phénotypes et les liens de parenté", ["Nommer immédiatement le gène", "Calculer une moyenne des sexes", "Attribuer $AA$ à tous les non atteints"], "L’observation doit précéder toute hypothèse génotypique.", guideLabel("p. 35")],
      ["Après la dominance, quel test vient logiquement ?", "La localisation autosomique ou liée à X", ["L’homozygotie de tous les individus non atteints", "La fréquence exacte de l’allèle dans la population", "La pénétrance complète déduite sans autre donnée"], "Le guide articule dominance puis localisation chromosomique.", guideLabel("p. 35")],
      ["Que fait une observation impossible pour un modèle simple ?", "Elle élimine ce modèle sous les hypothèses données", ["Elle est ignorée si les autres cas conviennent", "Elle rend tous les modèles vrais", "Elle prouve le gène exact"], "Un modèle doit rendre compte de toutes les transmissions considérées.", guideLabel("p. 36")],
      ["Quels génotypes faut-il écrire d’abord ?", "Les génotypes certains", ["Les génotypes les plus fréquents supposés", "Uniquement ceux des hommes", "Des génotypes choisis au hasard"], "Les individus récessifs et porteurs obligatoires structurent la déduction.", guideLabel("p. 36")],
      ["Que faire si une personne non atteinte peut être $AA$ ou $Aa$ ?", "Conserver les deux possibilités", ["Choisir $AA$ par préférence", "Choisir $Aa$ par préférence", "La déclarer $aa$"], "Une bonne analyse représente l’incertitude restante.", guideLabel("p. 36")],
      ["Quelle vérification doit porter sur chaque enfant ?", "La transmission d’allèles ou de chromosomes doit respecter son sexe et la localisation du locus", ["Il doit avoir exactement le phénotype de son père", "Il doit recevoir deux allèles liés à X de sa mère", "Il doit exprimer tout allèle reçu d’un parent atteint"], "Un garçon ne reçoit aucun allèle paternel d’un locus lié à X : il reçoit le Y de son père.", guideLabel("p. 36")],
      ["À quel moment calcule-t-on le risque de descendance ?", "Après avoir établi les génotypes parentaux possibles", ["Avant de lire le pedigree", "Sans connaître aucun parent", "Après avoir compté les générations uniquement"], "L’échiquier dépend des gamètes produits par les génotypes parentaux.", guideLabel("p. 36")],
      ["Quelle limite convient à la conclusion ?", "Le pedigree n’identifie pas seul le gène ni la variante", ["Le modèle prédit chaque naissance avec certitude", "La pénétrance est toujours complète dans la réalité", "Une famille suffit à décrire toute la population"], "Une conclusion pédagogique doit nommer ce qui nécessiterait une confirmation biologique.", guideLabel("p. 36")],
      ["Que signifie D-L-G-C ?", "Dominance, Localisation, Génotypes, Conclusion", ["Division, Lecture, Groupe, Chromosome", "Dominant, Léthal, Gamète, Cellule", "Donnée, Lignée, Grossesse, Codominance"], "Ce repère résume l’ordre de la méthode diagnostique scolaire.", guideLabel("pp. 35-36")],
    ], short("Après dominance et localisation, quelle lettre du repère D-L-G-C vient ensuite ?", ["G", "g", "Génotypes", "génotypes"], "G désigne l’attribution prudente des génotypes.", guideLabel("pp. 35-36"))),
    precisions: [
      "La démarche sépare explicitement observations, hypothèses, prédictions et conclusion.",
      "Une contradiction logique n’est jamais neutralisée par une majorité de branches compatibles.",
      "Les hypothèses de pénétrance complète et d’absence de mutation nouvelle sont annoncées comme limites du modèle scolaire.",
    ],
  },
  {
    id: "autosomal-family-case",
    title: "Résoudre un cas sous un modèle autosomique dominant",
    summary: "Tester la compatibilité d’un pedigree avec un modèle autosomique dominant explicitement posé, déterminer l’hétérozygotie d’un parent et calculer le risque.",
    pages: "pp. 35-36",
    section: "Application adaptée : détermination du mode de transmission dans un pedigree",
    durationMinutes: 34,
    xp: 100,
    kind: "practice",
    body: `
## 1. Une famille construite pour tester les modèles

Considérons un caractère digital scolaire noté M. Le père exprime M, la mère ne l’exprime pas. Parmi leurs enfants, une fille et un fils expriment M, tandis qu’un autre fils ne l’exprime pas. Cette famille est une **situation évaluative originale** construite à partir des habiletés du guide ; elle ne reproduit aucun exercice présenté comme officiel.

Le modèle **autosomique dominant** est ici une hypothèse de travail explicitement fournie : M est l’allèle dominant, m l’allèle récessif et la pénétrance est supposée complète. La seule coexistence d’un père atteint et d’un fils atteint ne prouve ni que le père lui a transmis l’allèle responsable, ni l’autosomie. Un modèle récessif lié à X resterait par exemple possible si la mère était conductrice. Le pedigree sert donc à tester la compatibilité du modèle annoncé et à préciser les génotypes, pas à inventer une transmission directe à partir de deux phénotypes.

## 2. Le fils non atteint révèle le génotype paternel

Notons $M$ l’allèle dominant et $m$ l’allèle récessif. La mère non atteinte est $mm$. Le fils non atteint est également $mm$ et a reçu un allèle $m$ de chacun de ses parents. Le père atteint possède donc $M$ pour exprimer le caractère et $m$ pour avoir pu le transmettre : il est $Mm$, pas $MM$.

Le croisement est :

$$Mm \\times mm \\rightarrow \\frac12 Mm + \\frac12 mm$$

Chaque enfant, fille ou garçon, a donc dans ce modèle $1/2$ de probabilité d’exprimer M. Le fait que deux enfants sur trois l’expriment reste compatible avec ce risque ; une petite fratrie n’est pas tenue de reproduire exactement la moitié.

## 3. Une conclusion conditionnelle

Certains caractères digitaux réels sont génétiquement hétérogènes et peuvent présenter une pénétrance variable. Ici, M est un caractère abstrait utilisé pour maîtriser le raisonnement mendélien. On conclut seulement : « sous le modèle autosomique dominant fourni et à pénétrance complète, le pedigree construit est compatible avec un père $Mm$ et une mère $mm$ ». Le pedigree ne démontre pas à lui seul la localisation du locus.

> **Repère Davy — un enfant récessif révèle l’allèle caché de chacun de ses parents.**
`,
    keyPoint: "Sous le modèle autosomique dominant fourni, le père atteint est $Mm$ parce qu’il a un enfant $mm$ avec une mère $mm$ ; la co-occurrence père-fils ne localise pas à elle seule le locus.",
    example: "Pour $Mm \\times mm$, les deux issues sont $1/2$ Mm atteint et $1/2$ mm non atteint, quel que soit le sexe.",
    methodSteps: [
      "Énonce l’hypothèse fournie : locus autosomique, M dominant, pénétrance complète.",
      "Distingue la co-occurrence père-fils d’une transmission allélique réellement démontrée.",
      "Écris $mm$ chez la mère et le fils non atteints.",
      "Déduis que le père atteint a transmis m et qu’il est donc $Mm$.",
      "Construis $Mm \\times mm$ et exprime le risque par conception.",
    ],
    interaction: diagram(
      "Reconstituer le cas M",
      "Explore les indices dans l’ordre : l’enfant non atteint transforme la compatibilité du modèle en génotype paternel précis.",
      "Famille M",
      "Père atteint, mère non atteinte, enfants des deux phénotypes et des deux sexes.",
      [
        { id: "father-son", label: "Père et fils atteints", role: "Indice non décisif", detail: "Deux phénotypes concordants ne prouvent pas que l’allèle étudié est passé directement du père au fils." },
        { id: "mother", label: "Mère non atteinte", role: "$mm$", detail: "Dans le modèle dominant complet, son phénotype impose le génotype récessif $mm$." },
        { id: "healthy-son", label: "Fils non atteint", role: "$mm$", detail: "Il a reçu m de sa mère et nécessairement m de son père." },
        { id: "father", label: "Père atteint", role: "$Mm$", detail: "Il exprime M mais porte m révélé par le fils non atteint : il est hétérozygote." },
        { id: "risk", label: "Tous les enfants", role: "$1/2$", detail: "Pour chaque conception, le risque d’exprimer M est 1/2, indépendamment du sexe." },
      ],
      "L’autosomie et la dominance sont les hypothèses fournies ; l’enfant non atteint établit alors l’hétérozygotie du père.",
    ),
    questions: questions(63, [
      ["Que démontre à elle seule la coexistence d’un père atteint et d’un fils atteint ?", "Aucune transmission directe de l’allèle : plusieurs modèles restent possibles", ["Une transmission autosomique dominante certaine", "Une transmission liée à Y certaine", "Une transmission récessive liée à X impossible"], "Le fils reçoit Y de son père, mais il peut avoir reçu un allèle lié à X de sa mère ; les deux phénotypes ne prouvent donc pas le trajet de l’allèle.", guideLabel("pp. 35-36")],
      ["Dans le modèle dominant, quel est le génotype de la mère non atteinte ?", "$mm$", ["$MM$", "$Mm$", "$M-$"], "Le phénotype récessif impose mm dans le modèle complet.", guideLabel("p. 36")],
      ["Quel est le génotype du fils non atteint ?", "$mm$", ["$MM$", "$Mm$", "$MM$ ou $Mm$"], "Il n’exprime pas le caractère dominant M dans le modèle fourni.", guideLabel("p. 36")],
      ["Pourquoi le père atteint n’est-il pas $MM$ ?", "Il a transmis m à son fils $mm$", ["Son phénotype atteint impose toujours l’hétérozygotie", "La mère non atteinte peut seulement transmettre M", "Le sexe masculin empêche l’homozygotie autosomique"], "Le fils reçoit un m de chaque parent, révélant m chez le père dans le modèle autosomique.", guideLabel("p. 36")],
      ["Quel est donc le génotype paternel ?", "$Mm$", ["$MM$", "$mm$", "$MM$ ou $Mm$ sans possibilité de trancher"], "Il exprime le dominant M tout en portant l’allèle m transmis.", guideLabel("p. 36")],
      ["Quelle proportion atteinte donne $Mm \\times mm$ ?", "$1/2$", ["$0$", "$1/4$", "$1$"], "La moitié théorique des enfants reçoit M du père.", guideLabel("p. 36")],
      ["Le risque $1/2$ diffère-t-il entre filles et garçons ?", "Non, le locus est autosomique", ["Oui, seules les filles reçoivent M", "Oui, seuls les garçons reçoivent M", "Oui, M se trouve sur Y"], "Les deux sexes reçoivent un autosome de chacun des parents.", guideLabel("p. 35")],
      ["Deux enfants atteints sur trois contredisent-ils $1/2$ ?", "Non, une petite fratrie peut s’écarter de la proportion théorique", ["Oui, il faut exactement un enfant et demi", "Oui, le troisième doit être atteint", "Oui, tout risque doit être observé exactement"], "La probabilité décrit de nombreuses conceptions, pas un quota de fratrie.", guideLabel("p. 36")],
      ["Pourquoi le cas utilise-t-il un caractère M abstrait ?", "Pour enseigner le raisonnement sans généraliser un caractère réel complexe", ["Parce qu’aucun caractère n’est héréditaire", "Pour prouver un diagnostic clinique", "Pour identifier une personne réelle"], "Le modèle construit rend ses hypothèses transparentes.", guideLabel("pp. 35-36")],
    ], short("Quel est le risque théorique d’exprimer M à chaque conception dans le modèle fourni ?", ["1/2", "0,5", "50 %", "50%"], "Le croisement $Mm \\times mm$ donne une moitié théorique d’enfants $Mm$ exprimant M.", guideLabel("p. 36"))),
    precisions: [
      "Le cas M est annoncé comme une application pédagogique originale, et non comme un exercice du guide.",
      "Un caractère digital abstrait évite de généraliser abusivement un caractère réel génétiquement hétérogène.",
      "La pénétrance complète et le modèle monogénique sont conservés comme hypothèses explicites.",
      "La co-occurrence d’un père et d’un fils atteints n’est jamais assimilée à une transmission directe de l’allèle sans preuve supplémentaire.",
    ],
  },
  {
    id: "x-linked-family-case",
    title: "Résoudre un cas familial lié à X",
    summary: "Déduire la transmission d’un père atteint et d’une mère non conductrice, puis distinguer le statut des filles et celui des fils.",
    pages: "pp. 35-36",
    section: "Application adaptée : gène porté par un chromosome sexuel",
    durationMinutes: 33,
    xp: 115,
    kind: "practice",
    body: `
## 1. Les génotypes parentaux sont ici connus

Le cas construit porte sur un caractère récessif lié à X. Le père est atteint, donc $X^nY$. La mère est non atteinte et une analyse préalable indique qu’elle n’est pas conductrice : $X^NX^N$. Cette précision est indispensable, car son seul phénotype n’aurait pas permis d’exclure $X^NX^n$.

Le père produit des spermatozoïdes $X^n$ ou Y ; la mère ne produit que des ovules $X^N$ pour ce locus. On obtient :

| Enfant | Chromosome paternel | Génotype | Statut dans le modèle |
|---|---|---|---|
| fille | $X^n$ | $X^NX^n$ | non atteinte, conductrice |
| garçon | Y | $X^NY$ | non atteint |

Toutes les filles reçoivent donc l’allèle paternel $X^n$, mais aussi $X^N$ de leur mère : elles sont conductrices sans exprimer le caractère récessif. Aucun fils ne reçoit le X paternel ; tous reçoivent $X^N$ de leur mère dans ce croisement précis.

## 2. Ce qui changerait si la mère était conductrice

Avec une mère $X^NX^n$, les résultats seraient différents : chaque fils aurait $1/2$ de risque d’être atteint et chaque fille $1/2$ de risque d’être $X^nX^n$, puisque le père transmet déjà $X^n$ à toutes ses filles. Le génotype maternel est donc une donnée décisive.

## 3. Ne pas confondre probabilité conditionnelle et généralité

La phrase « toutes les filles sont conductrices et tous les fils sont non atteints » vaut uniquement pour $X^nY \\times X^NX^N$ dans le modèle. Elle ne décrit pas toutes les unions comportant un père atteint. Le cas est une adaptation évaluative originale destinée à exercer la circulation des chromosomes X et Y.

> **Repère Davy — le X paternel va aux filles ; le Y paternel va aux fils.**
`,
    keyPoint: "Dans $X^nY \\times X^NX^N$, toutes les filles sont $X^NX^n$ conductrices et tous les fils sont $X^NY$ non atteints.",
    example: "Le fils ne peut recevoir $X^n$ de son père : il reçoit Y du père et $X^N$ de la mère non conductrice.",
    methodSteps: [
      "Écris les génotypes parentaux en gardant X et Y visibles.",
      "Liste séparément les gamètes du père et ceux de la mère.",
      "Traite d’abord les filles qui reçoivent le X paternel.",
      "Traite ensuite les fils qui reçoivent le Y paternel.",
      "Vérifie que la conclusion reste attachée au génotype maternel annoncé.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Pedigree lié à X construit",
      title: "Suivre le chromosome du père",
      instruction: "Sélectionne les quatre repères pour expliquer pourquoi filles et fils n’ont pas le même statut dans ce croisement.",
      viewBox: "0 0 640 345",
      caption: "Figure pédagogique originale pour $X^nY \\times X^NX^N$.",
      shapes: caseXShapes,
      hotspots: caseXHotspots,
      observation: "Le X altéré du père atteint va à toutes ses filles ; son Y va à tous ses fils. Le X maternel est ici toujours $X^N$.",
    },
    questions: questions(72, [
      ["Quel est le génotype du père atteint dans ce cas récessif lié à X ?", "$X^nY$", ["$X^NX^N$", "$X^NX^n$", "$X^NY$"], "Son unique X porte l’allèle n exprimé.", guideLabel("p. 35")],
      ["Quelle information permet d’écrire $X^NX^N$ pour la mère ?", "Une analyse indique qu’elle n’est pas conductrice", ["Son seul phénotype non atteint", "Le fait qu’elle soit une femme", "Le nombre de ses enfants"], "Une femme non atteinte pourrait sinon être XNXn.", guideLabel("pp. 35-36")],
      ["Quel chromosome le père donne-t-il à toutes ses filles ?", "$X^n$", ["Y", "$X^N$", "Aucun chromosome sexuel"], "Chaque fille reçoit le chromosome X paternel, ici Xn.", guideLabel("p. 35")],
      ["Quel est le génotype de chaque fille dans ce croisement ?", "$X^NX^n$", ["$X^nY$", "$X^NY$", "$X^nX^n$"], "La fille reçoit Xn du père et XN de la mère.", guideLabel("p. 35")],
      ["Quel est le statut de ces filles dans le modèle récessif ?", "Non atteintes et conductrices", ["Toutes atteintes", "Non atteintes et jamais porteuses", "Hémizygotes"], "Xn est masqué par XN chez l’hétérozygote dans le modèle complet.", guideLabel("p. 35")],
      ["Quel chromosome le père donne-t-il à ses fils ?", "Y", ["$X^n$", "$X^N$", "Deux X"], "Le fils reçoit Y du père.", guideLabel("p. 35")],
      ["Quel est le génotype de chaque fils dans ce croisement ?", "$X^NY$", ["$X^nY$", "$X^NX^n$", "$X^nX^n$"], "Le fils reçoit XN de la mère et Y du père.", guideLabel("p. 35")],
      ["Si la mère était $X^NX^n$, quel risque aurait chaque fils d’être atteint ?", "$1/2$", ["$0$", "$1/4$", "$1$"], "La moitié théorique des fils recevrait Xn de la mère.", guideLabel("p. 36")],
      ["À quelle union s’applique la conclusion « tous les fils non atteints » ?", "$X^nY \\times X^NX^N$ uniquement dans ce modèle", ["À toute union avec un père atteint", "À tous les caractères autosomiques", "À toutes les familles réelles sans exception"], "Le résultat dépend précisément des génotypes parentaux annoncés.", guideLabel("p. 36")],
    ], short("Quel chromosome sexuel paternel reçoit une fille ?", ["X", "le X", "chromosome X", "son X"], "Une fille reçoit toujours le chromosome X de son père dans le modèle XX/XY.", guideLabel("p. 35"))),
    precisions: [
      "Le génotype non conducteur de la mère est attribué à une analyse préalable, jamais déduit de son seul phénotype.",
      "Les résultats déterministes sont limités au croisement $X^nY \\times X^NX^N$.",
      "Le cas familial est déclaré comme une application originale adaptée aux habiletés du guide.",
    ],
  },
  {
    id: "single-trait-final-mission",
    title: "Mission finale : expliquer un risque sans décider à la place de la famille",
    summary: "Intégrer pedigree, autosomie, codominance et probabilités dans une situation originale sur l’hémoglobine, puis proposer une communication scientifiquement et humainement responsable.",
    pages: "p. 13 et pp. 35-36",
    section: "Mission de synthèse adaptée aux habiletés du programme-guide Terminale D",
    durationMinutes: 38,
    xp: 145,
    kind: "challenge",
    body: `
## Mission — la famille de Kady et Yao

Cette mission est une **situation évaluative originale**, construite à partir des habiletés du guide DPFC. Une analyse de l’hémoglobine indique que Kady est AS et Yao SS. Ils souhaitent comprendre les résultats possibles pour un futur enfant. Le pedigree familial les a orientés vers une transmission héréditaire, mais les statuts parentaux proviennent ici de l’analyse biologique, pas d’une simple observation.

## 1. Établir le modèle

Le locus étudié est autosomique : filles et garçons reçoivent chacun un allèle de chaque parent. Kady $Hb^AHb^S$ produit deux types de gamètes, $Hb^A$ et $Hb^S$, en proportions théoriquement égales. Yao $Hb^SHb^S$ ne produit que des gamètes $Hb^S$ pour ce locus.

L’échiquier donne :

$$Hb^AHb^S \\times Hb^SHb^S \\rightarrow \\frac12 Hb^AHb^S + \\frac12 Hb^SHb^S$$

À chaque grossesse, la probabilité est donc $1/2$ AS et $1/2$ SS ; la probabilité AA est nulle dans ce modèle, car Yao ne peut transmettre $Hb^A$. Le résultat ne dépend pas du sexe. La naissance précédente, quelle qu’elle soit, ne modifie pas les probabilités de la conception suivante.

## 2. Passer du calcul à l’explication

Une réponse complète distingue trois plans :

1. **génotype** : AS ou SS dans ce croisement ;
2. **profil moléculaire** : HbA et HbS détectables chez AS, HbS majoritaire chez SS ;
3. **santé** : le trait AS n’est pas assimilé à la drépanocytose SS, et toute interprétation individuelle relève d’un professionnel de santé.

Le rôle de l’explication est de présenter les résultats, les limites du modèle et les possibilités d’accompagnement. Il n’est pas de blâmer un parent, d’imposer une décision reproductive ou de transformer une probabilité en destin individuel.

## 3. Nommer les limites

Le modèle se limite aux allèles $Hb^A$ et $Hb^S$ et n’intègre pas les autres génotypes responsables de drépanocytose. Un pedigree seul ne confirme pas AA, AS ou SS. Une prise en charge réelle exige un test validé, une interprétation clinique et un conseil adapté au contexte. Dans l’application, cette leçon reste la carte 8 du catalogue Terminale D ; cette position éditoriale ne modifie pas les principes génétiques étudiés.

> **Repère Davy — calculer, expliquer, respecter :** un risque génétique informe une décision ; il ne décide pas pour la personne.
`,
    keyPoint: "Pour $AS \\times SS$, chaque grossesse donne théoriquement $1/2$ AS, $1/2$ SS et 0 AA, pour les deux sexes ; la conclusion doit rester informative, confirmée biologiquement et non directive.",
    example: "Si le premier enfant est AS, le risque SS de la grossesse suivante reste $1/2$ : le résultat antérieur ne retire aucune case de l’échiquier futur.",
    methodSteps: [
      "Relever les statuts confirmés AS et SS et les traduire en génotypes.",
      "Lister les gamètes : A ou S pour AS, seulement S pour SS.",
      "Construire l’échiquier et calculer AS, SS et AA.",
      "Préciser que le risque vaut pour chaque grossesse et pour les deux sexes.",
      "Distinguer profil moléculaire, situation clinique et décision personnelle.",
      "Terminer par les limites du modèle et la nécessité d’un accompagnement professionnel.",
    ],
    interaction: timeline(
      "Préparer une explication responsable",
      "Déroule les six étapes de la mission avant de rédiger ta conclusion.",
      [
        { label: "Donnée confirmée", shortLabel: "AS × SS", detail: "Les statuts viennent d’une analyse de l’hémoglobine, pas du seul pedigree." },
        { label: "Gamètes", shortLabel: "A/S et S", detail: "Le parent AS produit A ou S ; le parent SS produit seulement S." },
        { label: "Échiquier", shortLabel: "1/2–1/2", detail: "Les issues théoriques sont 1/2 AS et 1/2 SS ; aucune issue AA." },
        { label: "Indépendance", shortLabel: "Chaque grossesse", detail: "Le résultat d’un enfant précédent ne modifie pas le risque suivant." },
        { label: "Interprétation", shortLabel: "Gène ≠ destin", detail: "Distinguer profil d’hémoglobine, trait AS et maladie SS." },
        { label: "Communication", shortLabel: "Informer", detail: "Présenter probabilités, limites et accompagnement sans blâme ni injonction." },
      ],
      "Une bonne réponse contient le calcul exact, la portée du modèle et une communication respectueuse de l’autonomie familiale.",
    ),
    questions: questions(81, [
      ["Quels gamètes produit Kady AS pour le locus étudié ?", "$Hb^A$ ou $Hb^S$", ["Seulement $Hb^A$", "Seulement $Hb^S$", "$Hb^AHb^S$ dans chaque gamète"], "Un gamète reçoit un seul des deux allèles de l’hétérozygote.", guideLabel("pp. 35-36")],
      ["Quels gamètes produit Yao SS ?", "Seulement $Hb^S$", ["Seulement $Hb^A$", "$Hb^A$ ou $Hb^S$", "Aucun gamète"], "Un parent SS transmet nécessairement HbS dans ce modèle.", guideLabel("pp. 35-36")],
      ["Quelle probabilité AS donne AS × SS ?", "$1/2$", ["$0$", "$1/4$", "$1$"], "La moitié des conceptions combine A maternel et S paternel dans la présentation du cas.", guideLabel("p. 36")],
      ["Quelle probabilité SS donne AS × SS ?", "$1/2$", ["$0$", "$1/4$", "$3/4$"], "La moitié des conceptions combine S des deux parents.", guideLabel("p. 36")],
      ["Quelle probabilité AA donne AS × SS ?", "$0$", ["$1/4$", "$1/2$", "$1$"], "Le parent SS ne possède aucun allèle HbA à transmettre.", guideLabel("p. 36")],
      ["Le sexe modifie-t-il ces probabilités ?", "Non, le locus étudié est autosomique", ["Oui, SS concerne seulement les garçons", "Oui, AS concerne seulement les filles", "Oui, le père transmet X à ses fils"], "Les filles et les garçons reçoivent deux copies du locus autosomique.", guideLabel("p. 35")],
      ["Après un enfant AS, quel est le risque SS de la grossesse suivante ?", "$1/2$", ["$0$", "$1/4$", "$1$"], "Chaque conception est indépendante dans ce modèle.", guideLabel("p. 36")],
      ["D’où viennent les statuts AS et SS utilisés dans la mission ?", "D’une analyse biologique de l’hémoglobine", ["Du sexe des parents", "D’une ressemblance photographique", "Du nombre d’enfants uniquement"], "Le pedigree oriente mais ne confirme pas seul le profil d’hémoglobine.", guideLabel("p. 36")],
      ["Quelle conclusion respecte l’autonomie de la famille ?", "Présenter risques, limites et accompagnement sans imposer de choix", ["Décider à la place du couple", "Accuser le parent SS", "Présenter SS comme une certitude pour chaque enfant"], "Un conseil génétique responsable informe de manière non directive.", guideLabel("pp. 35-36")],
    ], short("Dans AS × SS, quel pourcentage théorique des conceptions est SS ?", ["50%", "50 %", "1/2", "un sur deux"], "Une combinaison sur deux est SS, soit 50 %.", guideLabel("p. 36"))),
    precisions: [
      "La mission AS × SS est une création pédagogique originale et n’est jamais qualifiée d’exercice officiel.",
      "Les statuts parentaux sont fournis par une analyse biologique afin de ne pas surinterpréter le pedigree.",
      "Le trait AS est distingué de la drépanocytose SS et le conseil est formulé sans stigmatisation ni injonction.",
      "La place 8 dans le catalogue de l’application est distinguée de la numérotation imprimée des documents pédagogiques.",
    ],
  },
];

const levelOrder = [
  "hereditary-trait-pedigree-basics",
  "dominance-recessivity",
  "autosomal-inheritance",
  "x-linked-inheritance",
  "codominance-sickle-cell",
  "abo-polyallelism",
  "pedigree-diagnostic-strategy",
  "autosomal-family-case",
  "x-linked-family-case",
  "single-trait-final-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau d’hérédité monohybride introuvable : ${id}`);
  return adaptedLevel(index, seed);
});

export const terminalDSvtSingleTraitHeredityPath: LearningPath = {
  id: "terminale-d-svt-l8-single-trait-heredity",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Adaptation du guide DPFC",
  curriculumSourceUrl: guideUrl,
  theme: { number: 2, title: "La transmission des caractères héréditaires" },
  chapterNumber: 8,
  title: "La transmission d’un caractère héréditaire chez l’Homme",
  description: "Dix niveaux adaptés du guide DPFC pour identifier un caractère héréditaire, analyser un pedigree et distinguer dominance, récessivité, autosomie, liaison à X, codominance et polyallélisme.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer phénotype, génotype, allèle et caractère héréditaire",
    "Lire un pedigree et reconnaître les croisements informatifs",
    "Tester une transmission autosomique ou liée au chromosome X",
    "Expliquer dominance complète, codominance et polyallélisme sans les confondre",
    "Calculer un risque par grossesse et formuler une conclusion proportionnée aux données",
  ],
  modules: [{
    id: "single-trait-heredity-mastery",
    title: "Maîtriser la transmission d’un caractère chez l’Homme",
    description: "Du vocabulaire du pedigree à une mission intégrée sur l’hémoglobine, avec cent réponses évaluables originales.",
    lessons: builtLevels,
  }],
};
