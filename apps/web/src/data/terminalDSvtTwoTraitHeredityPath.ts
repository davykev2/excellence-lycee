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

const sourceDocument =
  "SVT TD_L12_La transmission de deux caractères héréditaires ches les êtres vivants.pdf";
const guideDocument = "Programme éducatif et guide d’exécution SVT Terminale D — DPFC";
const guideUrl = "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel: string,
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
  eyebrow: "Enquête génétique",
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
  eyebrow: "Croisement à dérouler",
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
  sourceMetadata?: LessonSourceMetadata;
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: seed.sourceMetadata ?? source(seed.pages, seed.section, seed.corrections),
    concept: {
      eyebrow: seed.sourceMetadata?.fidelity === "adapted"
        ? `Niveau ${index + 1} • Complément adapté du guide DPFC`
        : `Niveau ${index + 1} • Support intégral corrigé`,
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
      introduction:
        "Identifie d’abord le croisement et les deux caractères, traite chaque caractère séparément, puis confronte les quatre classes à l’hypothèse chromosomique.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip:
        "Davy te rappelle : les rapports 3/4–1/4 ou 1/2–1/2 décrivent un caractère ; seule l’étude conjointe des quatre phénotypes renseigne sur l’indépendance ou la liaison.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const independentGameteShapes: SchemaShape[] = [
  { shape: "line", x1: 155, y1: 85, x2: 155, y2: 255, tone: "accent" },
  { shape: "line", x1: 205, y1: 85, x2: 205, y2: 255, tone: "outline" },
  { shape: "line", x1: 315, y1: 85, x2: 315, y2: 255, tone: "accent" },
  { shape: "line", x1: 365, y1: 85, x2: 365, y2: 255, tone: "outline" },
  { shape: "text", x: 155, y: 72, content: "R", anchor: "middle" },
  { shape: "text", x: 205, y: 72, content: "r", anchor: "middle" },
  { shape: "text", x: 315, y: 72, content: "V", anchor: "middle" },
  { shape: "text", x: 365, y: 72, content: "v", anchor: "middle" },
  { shape: "path", d: "M400 170 C475 112 520 100 575 100", tone: "muted" },
  { shape: "path", d: "M400 170 C475 145 520 160 575 170", tone: "muted" },
  { shape: "path", d: "M400 170 C475 205 520 230 575 240", tone: "muted" },
  { shape: "path", d: "M400 170 C475 255 520 295 575 310", tone: "muted" },
  { shape: "circle", cx: 650, cy: 100, r: 42, tone: "soft" },
  { shape: "circle", cx: 650, cy: 170, r: 42, tone: "soft" },
  { shape: "circle", cx: 650, cy: 240, r: 42, tone: "soft" },
  { shape: "circle", cx: 650, cy: 310, r: 42, tone: "soft" },
  { shape: "text", x: 650, y: 106, content: "RV", anchor: "middle" },
  { shape: "text", x: 650, y: 176, content: "Rv", anchor: "middle" },
  { shape: "text", x: 650, y: 246, content: "rV", anchor: "middle" },
  { shape: "text", x: 650, y: 316, content: "rv", anchor: "middle" },
  { shape: "text", x: 420, y: 414, content: "Assortiment indépendant — schéma pédagogique original", anchor: "middle" },
];

const independentGameteHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "pair-r", number: 1, label: "Couple R/r", x: 180, y: 170, detail: "Le couple d’allèles de l’aspect est représenté sur une première paire de chromosomes homologues." },
  { id: "pair-v", number: 2, label: "Couple V/v", x: 340, y: 170, detail: "Le couple d’allèles de la couleur est placé sur une autre paire dans le modèle du support." },
  { id: "orientation", number: 3, label: "Orientations indépendantes", x: 450, y: 170, detail: "À la méiose, l’orientation d’une paire ne fixe pas celle de l’autre ; les combinaisons se multiplient." },
  { id: "parental-gametes", number: 4, label: "Gamètes RV et rv", x: 650, y: 135, detail: "Ces deux gamètes reprennent les associations d’allèles des lignées parentales." },
  { id: "mixed-gametes", number: 5, label: "Gamètes Rv et rV", x: 650, y: 275, detail: "Ces deux autres combinaisons apparaissent avec la même fréquence lorsque les couples s’assortissent indépendamment." },
];

const punnettShapes: SchemaShape[] = [
  ...Array.from({ length: 5 }, (_, index): SchemaShape => ({ shape: "line", x1: 180 + index * 120, y1: 70, x2: 180 + index * 120, y2: 390, tone: index === 0 ? "accent" : "muted" })),
  ...Array.from({ length: 5 }, (_, index): SchemaShape => ({ shape: "line", x1: 180, y1: 70 + index * 80, x2: 660, y2: 70 + index * 80, tone: index === 0 ? "accent" : "muted" })),
  { shape: "text", x: 240, y: 50, content: "RV", anchor: "middle" },
  { shape: "text", x: 360, y: 50, content: "Rv", anchor: "middle" },
  { shape: "text", x: 480, y: 50, content: "rV", anchor: "middle" },
  { shape: "text", x: 600, y: 50, content: "rv", anchor: "middle" },
  { shape: "text", x: 145, y: 115, content: "RV", anchor: "middle" },
  { shape: "text", x: 145, y: 195, content: "Rv", anchor: "middle" },
  { shape: "text", x: 145, y: 275, content: "rV", anchor: "middle" },
  { shape: "text", x: 145, y: 355, content: "rv", anchor: "middle" },
  ...[
    "RV", "RV", "RV", "RV",
    "RV", "Rv", "RV", "Rv",
    "RV", "RV", "rV", "rV",
    "RV", "Rv", "rV", "rv",
  ].map((content, index): SchemaShape => ({
    shape: "text",
    x: 240 + (index % 4) * 120,
    y: 120 + Math.floor(index / 4) * 80,
    content: `[${content}]`,
    anchor: "middle",
  })),
  { shape: "text", x: 420, y: 430, content: "Échiquier phénotypique 4 × 4 — reconstruction originale", anchor: "middle" },
];

const punnettHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "gametes", number: 1, label: "Quatre gamètes par parent", x: 180, y: 70, detail: "Chaque parent RrVv produit RV, Rv, rV et rv à la fréquence 1/4 si les couples sont indépendants." },
  { id: "double-dominant", number: 2, label: "Neuf [RV]", x: 300, y: 115, detail: "Neuf cases sur seize portent au moins un allèle R et un allèle V." },
  { id: "single-dominant", number: 3, label: "Deux groupes de trois", x: 540, y: 195, detail: "Trois [Rv] et trois [rV] n’expriment qu’un des deux phénotypes dominants." },
  { id: "double-recessive", number: 4, label: "Un [rv]", x: 600, y: 355, detail: "Le double récessif exige rr et vv : une seule case sur seize." },
  { id: "ratio", number: 5, label: "Bilan 9:3:3:1", x: 750, y: 225, detail: "Le regroupement des seize génotypes par phénotype donne 9/16, 3/16, 3/16 et 1/16." },
];

const linkedChromosomeShapes: SchemaShape[] = [
  { shape: "line", x1: 155, y1: 85, x2: 155, y2: 320, tone: "accent" },
  { shape: "line", x1: 225, y1: 85, x2: 225, y2: 320, tone: "outline" },
  { shape: "circle", cx: 155, cy: 145, r: 13, tone: "fill" },
  { shape: "circle", cx: 155, cy: 255, r: 13, tone: "fill" },
  { shape: "circle", cx: 225, cy: 145, r: 13, tone: "soft" },
  { shape: "circle", cx: 225, cy: 255, r: 13, tone: "soft" },
  { shape: "text", x: 122, y: 151, content: "n⁺", anchor: "middle" },
  { shape: "text", x: 122, y: 261, content: "vg⁺", anchor: "middle" },
  { shape: "text", x: 258, y: 151, content: "n", anchor: "middle" },
  { shape: "text", x: 258, y: 261, content: "vg", anchor: "middle" },
  { shape: "path", d: "M360 115 C410 150 410 225 360 270", tone: "accent" },
  { shape: "path", d: "M430 115 C380 150 380 225 430 270", tone: "outline" },
  { shape: "text", x: 395, y: 204, content: "×", anchor: "middle" },
  { shape: "circle", cx: 610, cy: 105, r: 38, tone: "soft" },
  { shape: "circle", cx: 720, cy: 105, r: 38, tone: "soft" },
  { shape: "circle", cx: 610, cy: 250, r: 38, tone: "accent" },
  { shape: "circle", cx: 720, cy: 250, r: 38, tone: "accent" },
  { shape: "text", x: 610, y: 111, content: "n⁺ vg⁺", anchor: "middle" },
  { shape: "text", x: 720, y: 111, content: "n vg", anchor: "middle" },
  { shape: "text", x: 610, y: 256, content: "n⁺ vg", anchor: "middle" },
  { shape: "text", x: 720, y: 256, content: "n vg⁺", anchor: "middle" },
  { shape: "text", x: 430, y: 416, content: "Liaison en cis et crossing-over — schéma pédagogique original", anchor: "middle" },
];

const linkedChromosomeHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "cis-plus", number: 1, label: "Chromosome n⁺ vg⁺", x: 155, y: 200, detail: "Les deux allèles sauvages sont portés ensemble par un homologue : première association parentale en cis." },
  { id: "cis-mutant", number: 2, label: "Chromosome n vg", x: 225, y: 200, detail: "Les deux allèles mutants occupent l’autre homologue : seconde association parentale." },
  { id: "crossing-over", number: 3, label: "Échange entre homologues", x: 395, y: 200, detail: "Un crossing-over entre les deux loci peut produire des chromatides recombinées." },
  { id: "parental", number: 4, label: "Gamètes parentaux", x: 665, y: 105, detail: "n⁺ vg⁺ et n vg sont majoritaires dans le test-cross : 421 et 422 descendants." },
  { id: "recombined", number: 5, label: "Gamètes recombinés", x: 665, y: 250, detail: "n⁺ vg et n vg⁺ sont minoritaires : 78 et 79 descendants." },
  { id: "frequency", number: 6, label: "15,7 % de recombinaison", x: 810, y: 335, detail: "Les 157 recombinés sur 1 000 descendants situent les loci à 15,7 UR dans le modèle du support." },
];

const levels: LevelSeed[] = [
  {
    id: "dihybridism-evidence",
    title: "Lire un croisement portant sur deux caractères",
    summary: "Identifier le dihybridisme, séparer caractères et phénotypes, puis transformer une observation en hypothèses vérifiables.",
    pages: "1–3",
    section: "Situation d’apprentissage, présentation et analyse des croisements de pois",
    durationMinutes: 28,
    xp: 45,
    body: String.raw`
## Du lapereau surprenant au problème génétique

Le support s’ouvre sur deux lapins au pelage noir et aux yeux noirs qui engendrent notamment un petit au **pelage blanc et aux yeux rouges**. L’observation porte simultanément sur deux caractères : la couleur du pelage et la couleur des yeux. Étudier la transmission de deux caractères au cours d’un même croisement constitue un **dihybridisme**.

Un **caractère** est une propriété étudiée, par exemple l’aspect de la graine. Un **phénotype** est l’état observable de ce caractère, par exemple lisse ou ridé. Il ne faut donc pas annoncer « quatre caractères » quand la descendance comporte quatre combinaisons phénotypiques : on étudie deux caractères, chacun sous deux formes.

## Deux hypothèses à confronter

Le document propose deux modèles :

- les deux couples d’allèles sont portés par des chromosomes différents et s’assortissent indépendamment ;
- les deux couples d’allèles sont portés par un même chromosome et sont liés.

Ces hypothèses ne se tranchent pas en observant un seul descendant. Il faut un croisement informatif, des effectifs pour les quatre combinaisons et des proportions théoriques auxquelles les comparer.

## La lecture en trois étages

1. **Inventorier** les deux caractères et leurs deux phénotypes.
2. **Étudier séparément** chaque caractère pour repérer dominance et ségrégation.
3. **Réunir les deux caractères** et comparer les quatre classes observées aux classes attendues.

Chez les pois du support, les caractères sont l’aspect — lisse ou ridé — et la couleur — jaune ou verte. La notation phénotypique abrégée $[RV]$ signifie « lisse et jaune » : les majuscules désignent ici les phénotypes dominants retenus par le document, pas encore un génotype complet.

## Ce que l’observation des lapins permet réellement

Deux parents exprimant deux phénotypes dominants peuvent avoir un descendant double récessif s’ils portent chacun les allèles récessifs correspondants. Mais sans effectifs des quatre classes, on ne peut pas décider si les deux gènes sont indépendants ou liés. La situation lance donc l’enquête ; elle ne fournit pas à elle seule sa conclusion.

> **Précision.** Le support formule l’alternative « même chromosome ou chromosomes différents ». Les proportions testent directement l’assortiment observé ; une proportion proche de 50 % de recombinaison ne localise pas, à elle seule, les gènes avec certitude.
`,
    keyPoint: "Dihybridisme = étude simultanée de deux caractères ; la liaison se teste sur les quatre combinaisons, pas caractère par caractère seulement.",
    example: "Pois : caractère 1 = aspect (lisse/ridé) ; caractère 2 = couleur (jaune/vert) ; [Rv] = lisse et vert.",
    methodSteps: [
      "Nommer exactement les deux caractères étudiés.",
      "Associer deux phénotypes à chaque caractère sans les confondre avec les génotypes.",
      "Identifier le type de croisement et totaliser toute la descendance.",
      "Analyser chaque caractère, puis les quatre combinaisons ensemble.",
      "Conclure seulement après comparaison des effectifs observés et attendus.",
    ],
    interaction: diagram(
      "La carte d’identité d’un dihybridisme",
      "Explore chaque branche, puis explique pourquoi un seul lapereau ne suffit pas à localiser les gènes.",
      "Croisement à deux caractères",
      "Une même descendance est classée selon deux caractères, chacun décliné en deux phénotypes.",
      [
        { id: "character-one", label: "Caractère 1", role: "Première propriété", detail: "Chez le pois : aspect de la graine, lisse ou ridé." },
        { id: "character-two", label: "Caractère 2", role: "Seconde propriété", detail: "Chez le pois : couleur de la graine, jaune ou verte." },
        { id: "four-classes", label: "Quatre combinaisons", role: "Descendance conjointe", detail: "[RV], [Rv], [rV] et [rv] combinent les deux caractères sans former quatre caractères distincts." },
        { id: "separate-analysis", label: "Analyse marginale", role: "Un caractère à la fois", detail: "Elle révèle 3/4–1/4 ou 1/2–1/2 et aide à poser dominance et génotypes." },
        { id: "joint-analysis", label: "Analyse simultanée", role: "Test décisif", detail: "Elle compare les quatre classes aux rapports 9:3:3:1 ou 1:1:1:1 attendus sous indépendance." },
        { id: "hypotheses", label: "Deux modèles", role: "Indépendance ou liaison", detail: "La proximité ou l’écart aux proportions attendues oriente la conclusion chromosomique." },
      ],
      "Deux ségrégations marginales normales peuvent coexister avec une liaison : il faut conserver les associations entre phénotypes.",
    ),
    questions: questions(0, [
      ["Comment nomme-t-on l’étude simultanée de deux caractères héréditaires ?", "Le dihybridisme", ["Le monohybridisme", "La polyploïdie", "La mitose"], "Deux caractères sont suivis dans le même ensemble de croisements.", "Cours source • p. 2"],
      ["Dans l’expérience des pois, quel est un caractère étudié ?", "L’aspect de la graine", ["Le nombre de chromosomes", "La hauteur du plant uniquement", "La masse du pollen"], "Le document suit l’aspect lisse ou ridé et la couleur jaune ou verte.", "Cours source • p. 2"],
      ["Que sont lisse et ridé dans ce cours ?", "Deux phénotypes du caractère aspect", ["Deux espèces de pois", "Deux caractères indépendants", "Deux chromosomes"], "Ils sont les deux formes observables d’un même caractère.", "Cours source • p. 2"],
      ["Combien de combinaisons phénotypiques obtient-on avec deux caractères à deux formes chacun ?", "Quatre", ["Deux", "Trois", "Huit"], "Le produit 2 × 2 donne quatre classes conjointes.", "Application originale • d’après les p. 2–3"],
      ["Que signifie la notation phénotypique [Rv] du support ?", "Graines lisses et vertes", ["Graines ridées et jaunes", "Génotype RRVV", "Gamètes R et v séparés"], "R représente lisse et v représente vert dans cette écriture phénotypique.", "Cours source • p. 2"],
      ["Quelle donnée manque pour décider indépendance ou liaison dans la situation des lapins ?", "Les effectifs des quatre combinaisons", ["Le seul effectif du phénotype double récessif", "Les effectifs marginaux d’un seul caractère", "Le total des descendants sans répartition phénotypique"], "Une seule naissance double récessive ne permet pas de comparer des proportions.", "Précision pédagogique • p. 1"],
      ["Quelle étape vient avant l’étude simultanée des quatre classes ?", "L’étude de chaque caractère séparément", ["La construction immédiate d’une carte", "La suppression des petites classes", "Le choix arbitraire des chromosomes"], "Le protocole du support calcule d’abord les fréquences marginales.", "Cours source • p. 2–3"],
      ["Quelle paire oppose correctement caractère et phénotype ?", "Couleur / jaune", ["Jaune / couleur", "Lisse / chromosome", "Ridé / gène"], "La couleur est la propriété ; jaune est un état observable.", "Application originale • d’après la p. 2"],
      ["Pourquoi faut-il garder les quatre associations phénotypiques ?", "Pour tester l’assortiment des deux couples d’allèles", ["Pour calculer l’âge des parents", "Pour remplacer les effectifs par des couleurs", "Pour prouver une mutation nouvelle"], "La liaison concerne les associations entre les deux caractères.", "Application originale • d’après les p. 2–3"],
    ], short("Donne le nom de l’étude simultanée de deux caractères.", ["dihybridisme", "le dihybridisme"], "Le terme attendu est dihybridisme.", "Cours source • p. 2")),
    corrections: [
      "La situation des lapins est conservée comme problème déclencheur, mais elle est déclarée insuffisante pour conclure à l’indépendance ou à la liaison sans effectifs complets.",
      "Le numéro imprimé L12 est distingué de la position 9 du catalogue actuel de Terminale D.",
      "La formulation physique chromosomes différents/même chromosome est nuancée : les proportions testent d’abord l’assortiment génétique observé.",
    ],
  },
  {
    id: "pea-pure-lines-f1",
    title: "Des lignées pures à la F1 double hétérozygote",
    summary: "Exploiter le premier croisement de pois pour fixer dominance, symboles et génotype de la génération F1.",
    pages: "1–4, 6",
    section: "Premier croisement de pois et interprétation chromosomique",
    durationMinutes: 30,
    xp: 55,
    body: String.raw`
## Le premier croisement établit les conventions

Le support croise une lignée de pois à graines **lisses et jaunes** avec une lignée à graines **ridées et vertes**. Toute la génération F1 est lisse et jaune. Dans le modèle expérimental annoncé, les parents sont des lignées pures : ils sont homozygotes pour chacun des deux couples d’allèles.

Le document choisit les symboles :

- $R$ pour lisse, dominant sur $r$ pour ridé ;
- $V$ pour jaune, dominant sur $v$ pour vert.

Les parents s’écrivent alors $RRVV$ et $rrvv$. Chacun ne produit qu’un type de gamète, respectivement $RV$ et $rv$. La fécondation donne :

$$RRVV \times rrvv \longrightarrow 100\,\%\ RrVv$$

La F1 est donc **double hétérozygote** et exprime les deux phénotypes dominants.

## Phénotype et génotype ne racontent pas la même chose

Le phénotype $[RV]$ indique seulement que la graine est lisse et jaune. Il ne permet pas, sans le croisement, de choisir entre plusieurs génotypes possibles comme $RRVV$, $RRVv$, $RrVV$ ou $RrVv$. Ici, l’identité des lignées parentales impose $RrVv$ à la F1.

## Les trois croisements du support

Le premier croisement construit la F1. Le deuxième est une autofécondation $F_1 \times F_1$ qui fait apparaître quatre classes. Le troisième croise la F1 avec le parent double récessif : c’est un **test-cross**. Chaque croisement répond à une question différente : dominance, proportions de F2, puis nature des gamètes de l’hybride.

## Une inférence à encadrer

Une F1 uniforme ne prouve pas universellement que n’importe quels parents sont purs. Dans l’exercice, cette conclusion repose sur le cadre annoncé de deux souches contrastées et sur la loi d’uniformité utilisée par le support. Une réponse rigoureuse écrit donc « dans le modèle de ce croisement ».

> **Repère.** Dominant ne signifie ni meilleur, ni plus fréquent dans toute population. Cela signifie que le phénotype s’exprime chez l’hétérozygote dans le modèle étudié.
`,
    keyPoint: "Dans le croisement source, RRVV × rrvv donne 100 % RrVv, de phénotype [RV].",
    example: "Le gamète RV de la lignée lisse-jaune rencontre le gamète rv de la lignée ridée-verte : le zygote reçoit Rr et Vv.",
    methodSteps: [
      "Repérer les phénotypes parentaux opposés pour les deux caractères.",
      "Utiliser l’homogénéité de F1 dans le cadre des lignées pures annoncé.",
      "Attribuer une majuscule au dominant et la minuscule correspondante au récessif.",
      "Écrire les génotypes parentaux puis leurs gamètes avant la fécondation.",
      "Vérifier que chaque F1 reçoit un allèle de chaque parent pour chaque gène.",
    ],
    interaction: timeline(
      "La logique des trois croisements de pois",
      "Déroule les étapes et associe chaque croisement à l’information qu’il fournit.",
      [
        { label: "Lignées parentales", shortLabel: "P", detail: "RRVV lisse-jaune est croisé avec rrvv ridé-vert dans le modèle du support." },
        { label: "F1 uniforme", shortLabel: "F1", detail: "Tous les descendants sont RrVv, lisses et jaunes : R et V sont dominants." },
        { label: "Autofécondation", shortLabel: "F1×F1", detail: "La F1 produit des gamètes et révèle en F2 les quatre combinaisons phénotypiques." },
        { label: "Croisement test", shortLabel: "Test", detail: "RrVv est croisé avec rrvv ; le parent testeur ne masque aucun gamète de la F1." },
        { label: "Comparaison", shortLabel: "Bilan", detail: "Les proportions des quatre classes permettent ensuite d’évaluer indépendance ou liaison." },
      ],
      "Le premier croisement fixe les symboles ; les deux suivants testent l’organisation et la transmission des allèles.",
    ),
    questions: questions(9, [
      ["Quel phénotype présente toute la F1 du premier croisement de pois ?", "Lisse et jaune", ["Ridé et vert", "Lisse et vert", "Ridé et jaune"], "Les deux phénotypes exprimés en F1 sont les dominants du modèle.", "Cours source • p. 2"],
      ["Quel symbole désigne l’allèle lisse dans le support ?", "R", ["r", "V", "v"], "R est dominant sur r pour l’aspect.", "Cours source • p. 4"],
      ["Quel symbole désigne l’allèle vert ?", "v", ["V", "R", "r"], "Le vert est récessif et reçoit la minuscule v.", "Cours source • p. 4"],
      ["Quel génotype attribue-t-on au parent lisse-jaune de lignée pure ?", "RRVV", ["RrVv", "rrvv", "RRvv"], "Une lignée pure dominante pour les deux caractères est double homozygote dominante.", "Interprétation chromosomique • p. 6"],
      ["Quel génotype a la F1 issue de RRVV × rrvv ?", "RrVv", ["RRVV", "rrvv", "Rrvv"], "Chaque descendant reçoit RV d’un parent et rv de l’autre.", "Interprétation chromosomique • p. 6"],
      ["Combien de types de gamètes produit le parent RRVV ?", "Un seul : RV", ["Deux : R et V", "Quatre : RV, Rv, rV, rv", "Aucun"], "Un double homozygote transmet toujours R et V dans ce modèle.", "Application originale • d’après la p. 6"],
      ["Que signifie double hétérozygote ?", "Hétérozygote pour chacun des deux gènes", ["Deux cellules fusionnées", "Homozygote dominant deux fois", "Deux phénotypes récessifs"], "RrVv porte deux allèles différents à chacun des loci.", "Application originale • d’après les p. 4–6"],
      ["Quel croisement du support est une autofécondation ?", "F1 × F1 chez les pois", ["RRVV × rrvv", "F1 × rrvv", "Deux lignées mutantes de drosophile"], "Les plants issus de F1 fournissent pollen et pistil au deuxième croisement.", "Cours source • p. 1"],
      ["Dans ce contexte, que signifie dominant ?", "Le phénotype s’exprime chez l’hétérozygote", ["L’allèle est toujours le plus fréquent", "Le caractère est avantageux", "L’allèle supprime le gène récessif"], "La dominance décrit l’expression phénotypique, pas la valeur ou la fréquence de l’allèle.", "Précision pédagogique • d’après les p. 3–4"],
    ], short("Écris le génotype de la F1 obtenue par RRVV × rrvv.", ["RrVv", "Rr Vv", "Rr/Vv"], "La F1 reçoit R et V du premier parent, r et v du second.", "Interprétation chromosomique • p. 6")),
    corrections: [
      "L’expression race pure est accompagnée du terme précis lignée homozygote.",
      "L’uniformité de F1 est interprétée dans le cadre des souches pures annoncé, et non comme une preuve universelle isolée.",
      "Dominant est défini comme une relation d’expression chez l’hétérozygote, sans connotation de fréquence ou d’avantage.",
    ],
  },
  {
    id: "independent-gametes",
    title: "Produire quatre gamètes par assortiment indépendant",
    summary: "Relier la méiose du double hétérozygote aux gamètes RV, Rv, rV et rv équiprobables du modèle indépendant.",
    pages: "4–7, 12–13",
    section: "Recherche de la ségrégation et interprétation chromosomique des pois",
    durationMinutes: 32,
    xp: 65,
    body: String.raw`
## Deux couples d’allèles, quatre combinaisons

La F1 de pois a pour génotype $RrVv$. Si les couples $R/r$ et $V/v$ s’assortissent indépendamment, un gamète reçoit un allèle du premier couple et un allèle du second. Il existe donc quatre combinaisons :

$$RV,\quad Rv,\quad rV,\quad rv$$

Dans le modèle idéal du support, chacune a une fréquence de $1/4$.

## Pourquoi les fréquences se multiplient

La probabilité de transmettre $R$ vaut $1/2$ et celle de transmettre $V$ vaut $1/2$. Sous l’hypothèse d’indépendance :

$$P(RV)=P(R)\times P(V)=\frac{1}{2}\times\frac{1}{2}=\frac{1}{4}$$

Le même calcul vaut pour $Rv$, $rV$ et $rv$. Cette règle ne consiste pas à transmettre deux gamètes : un gamète unique contient une combinaison d’un allèle de chaque gène.

## Traduction chromosomique

Le support place les deux couples d’allèles sur deux paires de chromosomes différentes. À la métaphase I de méiose, l’orientation d’une paire d’homologues est indépendante de celle de l’autre. Les séparations successives donnent alors les quatre types de gamètes en proportions égales sur un grand nombre de méioses.

L’égalité exacte n’est pas attendue dans un petit échantillon : le hasard d’échantillonnage produit des écarts. On cherche une **compatibilité raisonnable** avec $25\,\%$ par classe, pas quatre nombres forcément identiques.

## Ne pas appliquer la règle avant de la tester

Écrire quatre gamètes à 25 % est une **hypothèse** pour un double hétérozygote dont les gènes s’assortissent indépendamment. Si les gènes sont liés, les mêmes quatre types peuvent exister, mais les gamètes parentaux sont plus fréquents que les recombinés. Le test-cross de drosophile du support montrera précisément cette différence.

## Contrôle rapide

- chaque gamète comporte une lettre du couple $R/r$ ;
- chaque gamète comporte une lettre du couple $V/v$ ;
- les quatre fréquences totalisent 1 ;
- aucun gamète n’est écrit $Rr$ ou $Vv$, car il est haploïde pour chaque locus.

> **Mémoire.** Deux choix indépendants à deux issues donnent $2\times2=4$ combinaisons et $(1/2)\times(1/2)=1/4$ pour chacune.
`,
    keyPoint: "Sous indépendance, RrVv produit RV, Rv, rV et rv à 1/4 chacun.",
    example: "Pour obtenir rV, le gamète reçoit r avec une probabilité 1/2 et V avec une probabilité 1/2 : P(rV)=1/4.",
    methodSteps: [
      "Écrire les deux couples d’allèles séparément : R/r et V/v.",
      "Choisir exactement un allèle dans chaque couple.",
      "Former toutes les combinaisons sans doublon.",
      "Multiplier les fréquences seulement sous l’hypothèse d’indépendance.",
      "Vérifier que la somme des fréquences vaut 100 %.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Méiose à explorer",
      title: "De deux paires chromosomiques à quatre gamètes",
      instruction: "Sélectionne les repères pour suivre l’assortiment indépendant et distinguer chromosomes, allèles et gamètes.",
      viewBox: "0 0 900 460",
      caption: "Représentation pédagogique originale de l’assortiment indépendant ; aucune figure du PDF n’est reproduite.",
      shapes: independentGameteShapes,
      hotspots: independentGameteHotspots,
      observation: "Les quatre combinaisons sont équiprobables seulement dans l’hypothèse indépendante retenue pour les pois.",
    },
    questions: questions(18, [
      ["Quels gamètes produit RrVv sous l’hypothèse d’indépendance ?", "RV, Rv, rV et rv", ["Rr et Vv", "RR, Rr, VV et Vv", "RV et rv seulement"], "Un gamète reçoit un allèle de chacun des deux couples.", "Interprétation chromosomique • p. 7"],
      ["Quelle est la fréquence théorique de chaque gamète de RrVv si les gènes sont indépendants ?", "1/4", ["1/2", "1/8", "3/4"], "Deux choix indépendants de probabilité 1/2 donnent 1/4.", "Interprétation chromosomique • p. 7"],
      ["Quel calcul donne P(RV) sous indépendance ?", "1/2 × 1/2", ["1/2 + 1/2", "3/4 × 3/4", "1 − 1/4"], "Il faut transmettre R et V dans le même gamète.", "Application originale • d’après les p. 5–7"],
      ["Pourquoi Rr n’est-il pas un gamète possible de RrVv ?", "Un gamète ne reçoit qu’un allèle de ce locus", ["R et r sont deux gènes", "Rr est toujours létal", "La méiose double les allèles"], "La séparation des homologues réduit le nombre d’allèles par locus.", "Application originale • d’après la p. 7"],
      ["Que modélise l’assortiment indépendant ?", "L’orientation d’une paire n’impose pas celle de l’autre", ["Tous les allèles restent ensemble", "Chaque gamète reçoit deux chromosomes homologues", "Le crossing-over est impossible"], "Les deux paires se distribuent sans association privilégiée dans ce modèle.", "Interprétation chromosomique • p. 7"],
      ["Quelle somme doivent donner les fréquences des quatre gamètes ?", "100 %", ["25 %", "50 %", "200 %"], "Les quatre classes couvrent tous les gamètes possibles.", "Application originale • d’après la p. 7"],
      ["Quel gamète combine les deux allèles récessifs ?", "rv", ["RV", "Rv", "rV"], "r et v sont les deux symboles récessifs.", "Cours source • p. 6–7"],
      ["Si les quatre gamètes existent mais à 42 %, 42 %, 8 % et 8 %, quelle hypothèse devient plausible ?", "Une liaison génétique", ["Une indépendance parfaite", "Une absence de méiose", "Un seul caractère étudié"], "Deux classes majoritaires et deux minoritaires signalent des associations parentales et recombinées.", "Application originale • d’après les p. 12–13"],
      ["Des effectifs réels doivent-ils être exactement égaux pour soutenir 1/4 chacun ?", "Non, de petits écarts aléatoires sont possibles", ["Oui, sans aucune tolérance", "Oui, mais seulement pour les récessifs", "Non, car les fréquences ne se comparent jamais"], "Une proportion théorique sert de référence à laquelle les données sont confrontées.", "Précision statistique • d’après les p. 5–6"],
    ], short("Écris les quatre gamètes possibles de RrVv sous indépendance.", ["RV Rv rV rv", "RV, Rv, rV, rv", "RV ; Rv ; rV ; rv", "RV/Rv/rV/rv"], "Les quatre combinaisons prennent un allèle de chaque couple.", "Interprétation chromosomique • p. 7")),
    corrections: [
      "Les fréquences égales sont présentées comme une hypothèse d’assortiment indépendant à confronter aux données, non comme un automatisme de tout double hétérozygote.",
      "L’égalité théorique de 25 % est distinguée de l’égalité exacte des effectifs observés.",
      "Le support localise les couples sur des chromosomes différents ; le parcours précise que les proportions testent directement l’assortiment observé.",
    ],
  },
  {
    id: "pea-f2-nine-three-three-one",
    title: "Construire et vérifier le rapport 9:3:3:1",
    summary: "Passer des ségrégations 3/4–1/4 de chaque caractère aux seize combinaisons de F2 et aux quatre phénotypes attendus.",
    pages: "2–5, 7–8",
    section: "Deuxième croisement de pois : autofécondation F1 × F1",
    durationMinutes: 36,
    xp: 70,
    body: String.raw`
## Les données de l’autofécondation

La F1 lisse-jaune s’autoféconde. Le support compte 5 431 graines :

| Phénotype | Observé | Proportion attendue sous indépendance |
|---|---:|---:|
| $[RV]$ lisse-jaune | 3 057 | $9/16$ |
| $[Rv]$ lisse-verte | 1 021 | $3/16$ |
| $[rV]$ ridée-jaune | 1 012 | $3/16$ |
| $[rv]$ ridée-verte | 341 | $1/16$ |

Chaque caractère pris séparément suit environ $3/4$ dominant et $1/4$ récessif. Pour l’aspect, les lisses totalisent $3\,057+1\,021=4\,078$ ; pour la couleur, les jaunes totalisent $3\,057+1\,012=4\,069$.

## De deux rapports 3:1 au rapport 9:3:3:1

Sous indépendance, les probabilités se multiplient :

$$P([RV])=\frac{3}{4}\times\frac{3}{4}=\frac{9}{16}$$

$$P([Rv])=\frac{3}{4}\times\frac{1}{4}=\frac{3}{16},\qquad
P([rV])=\frac{1}{4}\times\frac{3}{4}=\frac{3}{16}$$

$$P([rv])=\frac{1}{4}\times\frac{1}{4}=\frac{1}{16}$$

L’échiquier $4\times4$ contient seize unions de gamètes équiprobables. Regrouper les génotypes selon leur phénotype donne neuf, trois, trois et une case.

## Effectifs théoriques

On multiplie le total par chaque fraction :

- $5\,431\times9/16=3\,054{,}94$ ;
- $5\,431\times3/16=1\,018{,}31$ pour chacune des deux classes intermédiaires ;
- $5\,431\times1/16=339{,}44$.

Les effectifs observés sont très proches de ces valeurs. Dans la démarche descriptive du support, ils sont **compatibles** avec le modèle indépendant.

## Ce que prouve l’échiquier

L’échiquier explique le rapport théorique à partir des gamètes. Il ne faut pas le remplir à partir du rapport mémorisé : écrire d’abord les gamètes sur les marges évite de perdre une classe ou de confondre génotype et phénotype.

Le rapport compte des **phénotypes**, non seize génotypes tous différents : plusieurs cases génotypiques expriment le même aspect visible dès qu’elles contiennent au moins un allèle dominant.

> **Correction numérique.** La source affiche 3 054,93 et 339,43 ; l’arrondi usuel des valeurs 3 054,9375 et 339,4375 donne 3 054,94 et 339,44.
`,
    keyPoint: "RrVv × RrVv, sous indépendance et dominance complète, donne 9/16 [RV], 3/16 [Rv], 3/16 [rV] et 1/16 [rv].",
    example: "Pour 5 431 graines, l’attendu double récessif vaut 5 431/16 = 339,44, très proche des 341 observées.",
    methodSteps: [
      "Vérifier que les deux parents sont doubles hétérozygotes.",
      "Écrire RV, Rv, rV et rv à 1/4 sur chaque marge.",
      "Former les seize unions de gamètes sans sauter de case.",
      "Regrouper les génotypes en quatre phénotypes selon la dominance.",
      "Multiplier 9/16, 3/16, 3/16 et 1/16 par le total observé.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Échiquier interactif",
      title: "Les seize cases derrière 9:3:3:1",
      instruction: "Explore les groupes phénotypiques et retrouve pourquoi chacun occupe 9, 3, 3 ou 1 case.",
      viewBox: "0 0 900 460",
      caption: "Échiquier phénotypique original reconstruit à partir du croisement de pois des pages 7–8.",
      shapes: punnettShapes,
      hotspots: punnettHotspots,
      observation: "Le rapport 9:3:3:1 dépend à la fois de l’assortiment indépendant et de la dominance complète aux deux loci.",
    },
    questions: questions(27, [
      ["Quel est l’effectif total du deuxième croisement de pois ?", "5 431", ["1 999", "1 000", "1 025"], "La somme 3 057 + 1 021 + 1 012 + 341 vaut 5 431.", "Cours source • p. 3"],
      ["Quel rapport phénotypique attend-on pour RrVv × RrVv sous indépendance ?", "9:3:3:1", ["1:1:1:1", "3:1", "1:2:1"], "Les deux ségrégations 3:1 se combinent en quatre classes.", "Cours source • p. 5 et 8"],
      ["Quelle fraction attend-on pour le double phénotype dominant [RV] ?", "9/16", ["3/16", "1/16", "1/4"], "La probabilité vaut 3/4 × 3/4.", "Cours source • p. 5"],
      ["Quelle fraction attend-on pour le double récessif [rv] ?", "1/16", ["9/16", "3/16", "1/4"], "Il faut recevoir rr et vv, soit 1/4 × 1/4.", "Cours source • p. 5"],
      ["Combien de cases contient l’échiquier de RrVv × RrVv ?", "Seize", ["Quatre", "Huit", "Trente-deux"], "Quatre gamètes de chaque parent donnent 4 × 4 unions.", "Interprétation chromosomique • p. 7–8"],
      ["Quel effectif théorique corrigé correspond à 9/16 de 5 431 ?", "3 054,94", ["3 057", "3 054,93 exactement arrondi", "1 018,31"], "Le produit vaut 3 054,9375, arrondi à deux décimales en 3 054,94.", "Calcul corrigé • p. 5"],
      ["Pourquoi les classes [Rv] et [rV] ont-elles chacune 3/16 ?", "Elles combinent un phénotype dominant et un récessif", ["Elles sont toujours recombinées", "Elles contiennent trois chromosomes", "Elles sont homozygotes aux deux loci"], "Le produit est 3/4 × 1/4 dans un ordre ou dans l’autre.", "Cours source • p. 5"],
      ["Quel total d’individus lisses observe-t-on ?", "4 078", ["4 069", "1 353", "5 431"], "Les classes lisses sont [RV] 3 057 et [Rv] 1 021.", "Cours source • p. 2"],
      ["Quelle conclusion descriptive convient aux données 3 057/1 021/1 012/341 ?", "Elles sont compatibles avec 9:3:3:1", ["Elles prouvent une liaison complète", "Elles forment exactement quatre effectifs égaux", "Elles invalident la dominance"], "Chaque effectif est très proche de l’attendu calculé sous indépendance.", "Interprétation corrigée • p. 5"],
    ], short("Écris le rapport des quatre phénotypes de F2 sous indépendance.", ["9:3:3:1", "9 3 3 1", "9/3/3/1"], "Le regroupement des seize cases donne 9, 3, 3 et 1.", "Cours source • p. 8")),
    corrections: [
      "Les valeurs 3 054,9375 et 339,4375 sont arrondies à 3 054,94 et 339,44, plutôt que tronquées à 3 054,93 et 339,43 comme dans le tableau source.",
      "L’expression statistiquement identiques est remplacée par compatibles avec les proportions attendues, aucun test ni seuil n’étant fourni.",
      "Le rapport 9:3:3:1 est explicitement conditionné par l’indépendance et la dominance complète aux deux loci.",
    ],
  },
  {
    id: "pea-test-cross",
    title: "Faire parler un test-cross indépendant",
    summary: "Comprendre pourquoi le croisement avec un double récessif révèle directement les gamètes de la F1 et conduit à 1:1:1:1.",
    pages: "2–3, 5–6, 8–9, 12–13",
    section: "Troisième croisement de pois : F1 × double homozygote récessif",
    durationMinutes: 34,
    xp: 75,
    body: String.raw`
## Le parent testeur ne masque aucun allèle

Le troisième croisement associe la F1 lisse-jaune $RrVv$ au parent ridé-vert $rrvv$. Ce dernier ne produit que des gamètes $rv$. Il est **double homozygote récessif** : le phénotype de chaque descendant révèle donc la combinaison transmise par le parent F1.

| Gamète de F1 | Gamète du testeur | Descendant | Phénotype |
|---|---|---|---|
| $RV$ | $rv$ | $RrVv$ | $[RV]$ |
| $Rv$ | $rv$ | $Rrvv$ | $[Rv]$ |
| $rV$ | $rv$ | $rrVv$ | $[rV]$ |
| $rv$ | $rv$ | $rrvv$ | $[rv]$ |

Si les couples sont indépendants, les quatre gamètes de F1 valent chacun $1/4$ ; les quatre phénotypes descendants sont donc attendus selon $1:1:1:1$.

## Les données du support

Le texte initial donne 496 lisses-jaunes, 507 lisses-vertes, 496 ridées-jaunes et **500 ridées-vertes**, soit 1 999 graines. L’attendu vaut :

$$\frac{1}{4}\times1\,999=499{,}75$$

Les quatre observations sont proches de 499,75. Chaque caractère pris séparément suit aussi environ $1/2$ dominant et $1/2$ récessif.

## Pourquoi ce croisement est plus lisible

Dans $F_1\times F_1$, les gamètes des deux parents se combinent et plusieurs génotypes donnent le même phénotype dominant. Dans un test-cross, le testeur apporte seulement les récessifs ; chaque classe descendante devient la signature d’un gamète du parent étudié.

Le rapport $1:1:1:1$ n’est toutefois pas « le rapport de tout test-cross ». Il est attendu pour un double hétérozygote **si les deux gènes s’assortissent indépendamment**. Deux classes majoritaires et deux minoritaires orienteraient vers une liaison.

Un test-cross peut aussi être un rétrocroisement lorsque le testeur est l’un des parents récessifs de départ, comme ici. C’est sa fonction révélatrice — et non ce lien généalogique — qui définit l’usage génétique du croisement.

> **Correction de cohérence.** Le tableau de la page 6 affiche 501 pour la classe ridée-verte, mais les résultats de la page 2 donnent 500 et le total annoncé 1 999 l’impose : 496 + 507 + 496 + 500 = 1 999.
`,
    keyPoint: "Dans RrVv × rrvv, chaque phénotype descendant révèle un gamète de RrVv ; sous indépendance, les quatre classes valent 1/4.",
    example: "Un descendant rrVv est ridé-jaune : le testeur a donné rv, donc la F1 a nécessairement donné rV.",
    methodSteps: [
      "Vérifier que le testeur est récessif pour les deux caractères.",
      "Écrire son unique gamète rv.",
      "Associer chaque phénotype descendant au gamète correspondant de la F1.",
      "Calculer l’attendu N/4 sous indépendance.",
      "Comparer les quatre classes avant de conclure.",
    ],
    interaction: timeline(
      "Le test-cross en cinq gestes",
      "Déroule le raisonnement depuis le choix du testeur jusqu’à la conclusion d’indépendance.",
      [
        { label: "Parent étudié", shortLabel: "F1", detail: "La F1 RrVv peut produire plusieurs combinaisons d’allèles." },
        { label: "Parent testeur", shortLabel: "rrvv", detail: "Le double récessif ne produit que rv et ne masque aucun allèle dominant reçu." },
        { label: "Quatre signatures", shortLabel: "Classes", detail: "[RV], [Rv], [rV] et [rv] correspondent directement à RV, Rv, rV et rv de F1." },
        { label: "Attendu indépendant", shortLabel: "N/4", detail: "Pour 1 999 descendants, chaque classe est attendue à 499,75." },
        { label: "Décision", shortLabel: "Bilan", detail: "496, 507, 496 et 500 sont proches de l’attendu : le modèle indépendant est compatible." },
      ],
      "Le testeur transforme les gamètes invisibles du double hétérozygote en phénotypes descendants observables.",
    ),
    questions: questions(36, [
      ["Quel génotype doit avoir le parent testeur pour deux caractères récessifs ?", "rrvv", ["RrVv", "RRVV", "Rrvv"], "Il doit être homozygote récessif aux deux loci.", "Cours source • p. 5–6"],
      ["Quel unique gamète produit rrvv ?", "rv", ["RV", "Rr", "Vv"], "Le parent testeur ne possède que r au premier locus et v au second.", "Interprétation chromosomique • p. 8"],
      ["Que révèle le phénotype d’un descendant de RrVv × rrvv ?", "Le gamète transmis par RrVv", ["L’ordre physique exact des deux loci", "Le génotype des parents de la F1", "La fréquence des gamètes du testeur rrvv"], "Les allèles récessifs du testeur laissent s’exprimer la combinaison du parent étudié.", "Cours source • p. 8–9"],
      ["Quel rapport attend-on dans ce test-cross si les gènes sont indépendants ?", "1:1:1:1", ["9:3:3:1", "3:1", "1:2:1"], "Les quatre gamètes de F1 sont alors équiprobables.", "Cours source • p. 6 et 9"],
      ["Quel est le total corrigé du troisième croisement de pois ?", "1 999", ["2 000", "5 431", "1 000"], "496 + 507 + 496 + 500 = 1 999.", "Résultats et correction • p. 2 et 6"],
      ["Quel effectif doit remplacer 501 dans le tableau de la page 6 ?", "500", ["499", "496", "507"], "La liste initiale et le total 1 999 imposent 500 ridées-vertes.", "Correction explicite • p. 2 et 6"],
      ["Quel effectif théorique vaut N/4 pour N = 1 999 ?", "499,75", ["500,25", "499", "501"], "1 999 divisé par quatre vaut 499,75.", "Cours source • p. 6"],
      ["Quel descendant révèle un gamète Rv de la F1 ?", "Rrvv, phénotype [Rv]", ["rrVv, phénotype [rV]", "rrvv, phénotype [rv]", "RrVv, phénotype [RV] seulement par rv"], "Rv du parent étudié s’unit à rv du testeur.", "Application originale • d’après la p. 8"],
      ["Deux classes majoritaires et deux minoritaires dans un test-cross suggèrent quoi ?", "Des gènes liés", ["Une indépendance parfaite", "Un parent sans gamètes", "Une dominance incomplète nécessaire"], "Les associations parentales dominent alors les recombinées.", "Application originale • transition vers les p. 12–13"],
    ], short("Nomme le croisement d’un hybride avec un homozygote récessif.", ["test-cross", "test cross", "croisement test", "croisement-test"], "Il s’agit du test-cross ou croisement test.", "Cours source • p. 5")),
    corrections: [
      "La classe ridée-verte est fixée à 500, cohérente avec la liste de la page 2 et le total 1 999, au lieu de 501 dans le tableau de la page 6.",
      "Le rapport 1:1:1:1 est conditionné par un double hétérozygote et l’hypothèse d’indépendance ; il n’est pas attribué à tout test-cross.",
      "Les écarts aux quatre effectifs de 499,75 sont qualifiés de proches et compatibles, non d’identiques.",
    ],
  },
  {
    id: "independence-check-method",
    title: "Comparer observé et attendu sans sauter d’étape",
    summary: "Installer une démarche reproductible qui choisit le bon modèle, calcule les effectifs attendus et formule une conclusion proportionnée.",
    pages: "2–6, 10–14",
    section: "Analyses caractère par caractère et tests de l’hypothèse d’indépendance",
    durationMinutes: 35,
    xp: 80,
    kind: "practice",
    body: String.raw`
## Une méthode commune aux pois et aux drosophiles

Le support répète la même architecture : présenter le croisement, compter les descendants, analyser chaque caractère, rechercher la ségrégation conjointe, puis comparer l’observé à un attendu d’indépendance. Cette succession évite une conclusion fondée sur une impression visuelle.

## Étape 1 — reconnaître le croisement

- Pour $F_1\times F_1$ avec dominance complète aux deux loci : attendu $9/16,3/16,3/16,1/16$.
- Pour $F_1\times rrvv$ : attendu $1/4,1/4,1/4,1/4$ si les gènes sont indépendants.

Employer le mauvais rapport fausse tout le raisonnement, même si les calculs suivants sont exacts.

## Étape 2 — vérifier les marges

On additionne les classes qui partagent un phénotype pour chaque caractère. Des marges proches de $3/4$–$1/4$ ou de $1/2$–$1/2$ confirment le modèle de dominance et les génotypes proposés. Elles ne suffisent pas à établir l’indépendance : chez la drosophile liée, chaque caractère du test-cross suit bien $1/2$–$1/2$ alors que les quatre associations valent 421, 78, 79 et 422.

## Étape 3 — calculer l’attendu conjoint

Pour chaque classe $i$ :

$$E_i=N\times p_i$$

Avec 1 000 drosophiles en test-cross sous indépendance, $E_i=1\,000/4=250$. Les écarts massifs entre 421/422 et 78/79 ne ressemblent pas aux petits écarts d’échantillonnage des pois.

## Étape 4 — comparer avec un vocabulaire exact

Le support écrit parfois « statistiquement identiques », mais aucun test du $\chi^2$, aucun seuil et aucun degré de liberté ne sont calculés. Le parcours emploie donc :

- **proches et compatibles** avec le modèle pour les pois ;
- **nettement éloignés et incompatibles** avec le rapport 1:1:1:1 pour la drosophile.

Un véritable jugement statistique demanderait un test explicite. Ici, on respecte la démarche descriptive du document sans lui attribuer un niveau de preuve qu’il ne fournit pas.

## Étape 5 — formuler la conclusion

La conclusion cite le croisement, les attendus et le motif observé. « Les gènes sont liés » est justifié par deux classes parentales majoritaires et deux recombinées minoritaires, pas seulement par le fait que les quatre nombres diffèrent.

> **Phrase modèle.** « Dans ce test-cross, les quatre classes observées ne sont pas proches de N/4 : deux sont majoritaires et deux minoritaires ; les couples d’allèles ne s’assortissent donc pas indépendamment dans ce croisement et sont interprétés comme liés. »
`,
    keyPoint: "Identifier le croisement → analyser les marges → calculer Ei=N×pi → comparer les quatre classes → conclure avec le niveau de preuve disponible.",
    example: "Pour 1 000 drosophiles, l’attendu indépendant est 250 par classe ; 421/78/79/422 montre un contraste parental/recombiné net.",
    methodSteps: [
      "Calculer le total N sans reprendre aveuglément un total imprimé.",
      "Choisir les proportions attendues d’après le type de croisement.",
      "Contrôler chaque caractère séparément, puis revenir aux quatre classes conjointes.",
      "Calculer chaque effectif attendu Ei = N × pi.",
      "Décrire la compatibilité et le motif des écarts avant la conclusion chromosomique.",
    ],
    interaction: diagram(
      "L’arbre de décision d’une analyse dihybride",
      "Ouvre les cartes dans l’ordre et applique la démarche aux pois puis à la drosophile.",
      "Données de descendance",
      "Quatre effectifs n’ont de sens qu’après identification du croisement, calcul du total et choix d’un modèle attendu.",
      [
        { id: "cross-type", label: "1. Type de croisement", role: "Choisir le rapport", detail: "F1×F1 appelle 9:3:3:1 ; un test-cross indépendant appelle 1:1:1:1." },
        { id: "margins", label: "2. Marges", role: "Un caractère à la fois", detail: "Additionner deux classes par phénotype contrôle dominance et ségrégation sans conclure encore sur la liaison." },
        { id: "expected", label: "3. Attendus", role: "Ei = N × pi", detail: "Transformer chaque fraction théorique en effectif comparable aux données." },
        { id: "pattern", label: "4. Motif des écarts", role: "Petit bruit ou deux blocs", detail: "Des écarts faibles soutiennent le modèle ; deux grandes et deux petites classes signalent une liaison." },
        { id: "evidence", label: "5. Niveau de preuve", role: "Décrire sans surpromettre", detail: "Sans test statistique explicite, dire compatible ou incompatible dans la démarche descriptive." },
        { id: "conclusion", label: "6. Conclusion", role: "Relier données et modèle", detail: "Nommer indépendance ou liaison et citer le rapport ou le contraste qui soutient la décision." },
      ],
      "Les proportions marginales ne suffisent jamais : la structure des quatre classes est l’information décisive.",
    ),
    questions: questions(45, [
      ["Quel rapport choisir pour une autofécondation RrVv × RrVv indépendante ?", "9:3:3:1", ["1:1:1:1", "1:2:1", "3:1 seulement"], "Le croisement combine deux ségrégations 3:1 avec dominance complète.", "Méthode source • p. 5"],
      ["Quel rapport choisir pour un test-cross dihybride indépendant ?", "1:1:1:1", ["9:3:3:1", "3:1", "2:1:1"], "Les quatre gamètes du double hétérozygote sont attendus à 1/4.", "Méthode source • p. 6"],
      ["Quelle formule donne l’effectif théorique d’une classe ?", "E = N × p", ["E = N + p", "E = p/N", "E = N − p"], "On applique la proportion théorique p au total N.", "Application originale • d’après les tableaux p. 5–6"],
      ["Pourquoi analyser d’abord chaque caractère séparément ?", "Pour contrôler ségrégation, dominance et génotypes", ["Pour supprimer deux classes", "Pour prouver immédiatement l’indépendance", "Pour éviter de calculer le total"], "Cette analyse prépare le modèle mais ne tranche pas l’association des deux loci.", "Cours source • p. 2–5 et 10–12"],
      ["Que montre le test-cross de drosophile caractère par caractère ?", "Environ 1/2–1/2 pour chaque caractère", ["9/16–7/16", "100 % dominant", "Deux classes absentes"], "Gris/noir et long/vestigial sont chacun proches de 50/50.", "Cours source • p. 10"],
      ["Pourquoi ces deux rapports 1/2–1/2 ne prouvent-ils pas l’indépendance ?", "Ils perdent l’association entre les deux caractères", ["Ils sont calculés sur trop de descendants", "Ils concernent trois gènes", "Ils interdisent un test-cross"], "Les quatre classes conjointes révèlent deux fortes et deux faibles fréquences.", "Application originale • d’après les p. 10–12"],
      ["Quel attendu indépendant correspond à chacune des 1 000 drosophiles du test-cross ?", "250 par classe", ["125 par classe", "500 par classe", "1 000 par classe"], "Un quart de 1 000 vaut 250.", "Cours source • p. 12"],
      ["Quelle formulation est rigoureuse sans test statistique explicite ?", "Les données sont compatibles avec le modèle", ["Les données sont statistiquement identiques", "Le modèle est prouvé sans incertitude", "Les écarts doivent être nuls"], "Le support ne calcule ni statistique, ni seuil de décision.", "Correction méthodologique • p. 5–6"],
      ["Quel motif caractérise le jeu 421/78/79/422 ?", "Deux classes majoritaires et deux minoritaires", ["Quatre classes quasi égales", "Une seule classe dominante", "Un rapport 9:3:3:1"], "Les deux grandes classes sont parentales et les deux petites recombinées.", "Cours source • p. 12–13"],
    ], short("Pour N = 1 000 en test-cross indépendant, quel est l’effectif attendu par classe ?", ["250", "250 individus", "250 par classe"], "Chaque classe vaut N/4.", "Cours source • p. 12")),
    corrections: [
      "Statistiquement identiques est remplacé par proches et compatibles, le support ne donnant aucun test du chi-deux ni seuil.",
      "Les ségrégations marginales 1/2–1/2 sont explicitement déclarées insuffisantes pour décider de l’indépendance.",
      "La conclusion de liaison exige le motif deux classes parentales majoritaires/deux recombinées minoritaires, pas une simple inégalité numérique.",
    ],
  },
  {
    id: "drosophila-linked-test-cross",
    title: "Reconnaître une liaison dans le test-cross de drosophile",
    summary: "Exploiter les trois croisements du support et le contraste 421/422 contre 78/79 pour rejeter le modèle indépendant.",
    pages: "9–14",
    section: "Croisements de drosophiles : résultats, analyse et test d’indépendance",
    durationMinutes: 38,
    xp: 90,
    body: String.raw`
## Deux caractères chez la drosophile

Le support étudie la couleur du corps — gris ou noir — et la longueur des ailes — longues ou vestigiales. Il note :

- $n^+$ l’allèle sauvage gris, dominant sur $n$ noir ;
- $vg^+$ l’allèle sauvage ailes longues, dominant sur $vg$ vestigial.

Le premier croisement oppose une souche sauvage gris-long à une souche double mutante noir-vestigial. Toute la F1 est gris-long : dans le modèle du document, elle est double hétérozygote.

## Le croisement révélateur

Une femelle F1 est croisée avec un mâle double récessif noir-vestigial. La descendance de 1 000 individus se répartit ainsi :

| Phénotype | Effectif | Rôle interprété |
|---|---:|---|
| $[n^+\,vg^+]$ gris-long | 421 | parental majoritaire |
| $[n^+\,vg]$ gris-vestigial | 78 | recombiné minoritaire |
| $[n\,vg^+]$ noir-long | 79 | recombiné minoritaire |
| $[n\,vg]$ noir-vestigial | 422 | parental majoritaire |

Chaque caractère, isolément, donne presque $1/2$–$1/2$ : 499 gris contre 501 noirs et 500 longues contre 500 vestigiales. Pourtant, les quatre associations ne valent pas 250 chacune.

## Le contraste qui révèle la liaison

Sous indépendance, l’attendu serait $250/250/250/250$. Les observations forment au contraire deux classes autour de 42 % et deux autour de 8 %. Les associations sauvages-sauvages et mutantes-mutantes sont conservées le plus souvent ; les deux associations croisées sont moins fréquentes.

Le support conclut que les couples $n^+/n$ et $vg^+/vg$ sont liés, donc portés par le même chromosome dans ce modèle. Les classes minoritaires montrent que la liaison n’est pas complète : un mécanisme de recombinaison produit encore de nouvelles associations.

## Le troisième croisement comme contrôle

Le croisement femelle F1 × mâle F1 donne 719 gris-long, 44 gris-vestigial, 46 noir-long et 216 noir-vestigial sur 1 025. Chaque caractère suit environ $3/4$–$1/4$, mais les quatre classes s’écartent fortement de 9:3:3:1. Il confirme donc la même liaison par une autre combinaison de gamètes.

> **Point décisif.** Des marges mendéliennes normales ne garantissent pas l’indépendance. La liaison apparaît dans la conservation préférentielle de certaines associations entre les deux caractères.
`,
    keyPoint: "421 et 422 classes parentales contre 78 et 79 recombinées : le test-cross est incompatible avec 1:1:1:1 et révèle des gènes liés.",
    example: "Les gris totalisent 421+78=499 et les noirs 79+422=501, mais cette égalité marginale masque le contraste des associations.",
    methodSteps: [
      "Identifier le double récessif et confirmer qu’il s’agit d’un test-cross.",
      "Calculer les marges 1/2–1/2 pour chaque caractère.",
      "Fixer l’attendu conjoint à 250 pour chacune des quatre classes.",
      "Classer les deux grandes classes comme parentales et les deux petites comme recombinées.",
      "Conclure à une liaison avec recombinaison.",
    ],
    interaction: timeline(
      "Les trois croisements de drosophiles",
      "Déroule la série expérimentale et repère le rôle propre de chaque croisement.",
      [
        { label: "Souches contrastées", shortLabel: "P", detail: "Gris-long × noir-vestigial donne une F1 uniforme gris-long et fixe la dominance de n⁺ et vg⁺." },
        { label: "Test-cross", shortLabel: "F1×P2", detail: "La femelle F1 × mâle double récessif produit 421/78/79/422." },
        { label: "Attendu indépendant", shortLabel: "250×4", detail: "Un test-cross indépendant donnerait quatre classes proches de 250 sur 1 000." },
        { label: "Signature liée", shortLabel: "2+2", detail: "Deux parentales majoritaires et deux recombinées minoritaires révèlent la liaison." },
        { label: "Croisement F1×F1", shortLabel: "Contrôle", detail: "719/44/46/216 s’écarte aussi de 9:3:3:1 et confirme la liaison dans un croisement plus complexe." },
      ],
      "Le test-cross est le plus direct : chaque classe descendante mesure un type de gamète produit par la femelle F1.",
    ),
    questions: questions(54, [
      ["Quels caractères sont étudiés chez la drosophile ?", "Couleur du corps et longueur des ailes", ["Couleur des yeux et sexe", "Aspect et couleur des graines", "Taille et fertilité seulement"], "Le support oppose gris/noir et ailes longues/vestigiales.", "Cours source • p. 9–10"],
      ["Quels phénotypes sont dominants dans la F1 ?", "Corps gris et ailes longues", ["Corps noir et ailes vestigiales", "Corps gris et ailes vestigiales", "Corps noir et ailes longues"], "Toute la F1 exprime les caractères sauvages gris et long.", "Cours source • p. 9–11"],
      ["Quel symbole désigne l’allèle du corps noir ?", "n", ["n⁺", "vg", "vg⁺"], "Le support note n le mutant noir et n⁺ le sauvage gris.", "Cours source • p. 11"],
      ["Quel symbole désigne l’allèle des ailes vestigiales ?", "vg", ["vg⁺", "n", "V"], "vg est récessif devant vg⁺, associé aux ailes longues.", "Cours source • p. 11"],
      ["Quelles sont les deux classes majoritaires du test-cross ?", "Gris-long et noir-vestigial", ["Gris-vestigial et noir-long", "Gris-long et gris-vestigial", "Noir-long et noir-vestigial"], "Leurs effectifs sont 421 et 422.", "Cours source • p. 9 et 12–13"],
      ["Quelles sont les deux classes recombinées minoritaires ?", "Gris-vestigial et noir-long", ["Gris-long et noir-vestigial", "Gris-long et noir-long", "Noir-vestigial et gris-long"], "Leurs effectifs sont 78 et 79.", "Cours source • p. 9 et 13"],
      ["Quel attendu indépendant compare-t-on aux 1 000 descendants ?", "250 dans chaque classe", ["500 dans deux classes", "421 dans chaque classe", "9:3:3:1"], "Le test-cross indépendant prévoit 1/4 par classe.", "Cours source • p. 12"],
      ["Quelle conclusion tire-t-on du motif 421/78/79/422 ?", "Les deux gènes sont liés avec recombinaison", ["Les gènes sont parfaitement indépendants", "Il n’existe qu’un seul gène", "Les recombinés sont les plus fréquents"], "Les associations parentales dominent nettement les recombinées.", "Cours source • p. 12–13"],
      ["Que montre le troisième croisement 719/44/46/216 ?", "Un nouvel écart net au modèle indépendant", ["Le rapport exact 9:3:3:1", "Quatre classes égales", "L’absence des allèles récessifs"], "Les attendus 576,56/192,19/192,19/64,06 sont très éloignés des observations.", "Cours source • p. 14"],
    ], short("Donne les effectifs des deux classes recombinées du test-cross.", ["78 et 79", "78 79", "79 et 78"], "Les recombinés gris-vestigial et noir-long comptent 78 et 79 individus.", "Cours source • p. 9 et 13")),
    corrections: [
      "Les rapports 1/2–1/2 caractère par caractère sont explicitement séparés du test conjoint qui révèle la liaison.",
      "Les quatre observations sont dites incompatibles avec 250 par classe dans la démarche descriptive, sans revendiquer un test statistique absent.",
      "Le troisième croisement est utilisé comme confirmation et non pour remplacer le test-cross, plus direct pour lire les gamètes.",
    ],
  },
  {
    id: "cis-crossing-over",
    title: "Distinguer phase cis, parentaux et recombinés",
    summary: "Lire l’organisation des allèles sur les homologues et relier les classes minoritaires au crossing-over.",
    pages: "12–13, 16–17",
    section: "Position des allèles et interprétation chromosomique de la liaison",
    durationMinutes: 38,
    xp: 100,
    body: String.raw`
## Deux phases possibles pour un double hétérozygote lié

Quand deux loci sont sur le même chromosome, écrire seulement « double hétérozygote » ne précise pas quelles associations occupent chaque homologue.

En **cis** ou couplage, les deux allèles sauvages sont ensemble et les deux mutants ensemble :

$$\dfrac{n^{+}\,vg^{+}}{n\,vg}$$

En **trans** ou répulsion, chaque homologue associe un allèle sauvage et un mutant :

$$\dfrac{n^{+}\,vg}{n\,vg^{+}}$$

## Les classes majoritaires révèlent la phase

Dans le test-cross, le phénotype descendant reflète le gamète de la femelle F1. Les classes 421 gris-long et 422 noir-vestigial sont les plus fréquentes ; les gamètes $n^+vg^+$ et $nvg$ sont donc parentaux. La F1 est en phase cis.

Le support se concentre sur la classe double récessive 422, supérieure à l’attendu 250. Une démonstration plus robuste identifie **ensemble les deux classes majoritaires**, car une phase est définie par la paire d’associations parentales.

## L’origine des recombinés

Au cours de la prophase I de méiose, un crossing-over peut échanger des segments entre chromatides non sœurs de chromosomes homologues. Si l’échange a lieu entre les loci $n$ et $vg$, il produit les nouvelles associations $n^+vg$ et $nvg^+$. Elles correspondent aux classes 78 et 79.

Les parentaux restent majoritaires dans cet exemple ; les recombinés ne sont toutefois ni des erreurs, ni de nouveaux allèles. Ils réassocient des allèles déjà présents.

## Une lecture complète du test-cross

- parental $n^+vg^+$ : $421/1\,000=42{,}1\,\%$ ;
- parental $nvg$ : $422/1\,000=42{,}2\,\%$ ;
- recombiné $n^+vg$ : $78/1\,000=7{,}8\,\%$ ;
- recombiné $nvg^+$ : $79/1\,000=7{,}9\,\%$.

Les deux classes d’une même catégorie sont proches deux à deux, comme attendu par la symétrie de la méiose. Leur somme prépare le calcul de distance génétique.

> **Vigilance.** Majoritaire signifie parental dans ce test-cross parce que le crossing-over entre ces deux loci produit moins de la moitié des gamètes. Il faut toujours lire le protocole avant d’étiqueter les classes.
`,
    keyPoint: "Les classes majoritaires n⁺vg⁺ et nvg révèlent une phase cis ; les minoritaires n⁺vg et nvg⁺ proviennent de recombinaisons.",
    example: "421 gris-long et 422 noir-vestigial conservent les associations des deux souches parentales : la F1 est n⁺vg⁺/nvg.",
    methodSteps: [
      "Confirmer que la descendance est celle d’un test-cross.",
      "Associer chaque phénotype au gamète du double hétérozygote.",
      "Repérer les deux classes majoritaires comme associations parentales.",
      "Écrire les deux haplotypes sur les chromosomes homologues.",
      "Attribuer les classes minoritaires à un crossing-over entre les deux loci.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Chromosomes à explorer",
      title: "Du couplage cis aux gamètes recombinés",
      instruction: "Sélectionne les six repères pour relier position des allèles, crossing-over et effectifs descendants.",
      viewBox: "0 0 900 460",
      caption: "Schéma chromosomique pédagogique original inspiré des interprétations des pages 12, 16 et 17.",
      shapes: linkedChromosomeShapes,
      hotspots: linkedChromosomeHotspots,
      observation: "La phase se lit avec la paire de classes parentales, tandis que la somme des deux recombinées mesure la recombinaison.",
    },
    questions: questions(63, [
      ["Quelle écriture décrit la phase cis de la F1 du support ?", "n⁺vg⁺ / nvg", ["n⁺vg / nvg⁺", "n⁺n / vg⁺vg", "nvg⁺ / n⁺vg⁺"], "Les deux allèles sauvages sont sur un homologue et les deux mutants sur l’autre.", "Cours source • p. 12"],
      ["Quelle écriture décrit la phase trans ?", "n⁺vg / nvg⁺", ["n⁺vg⁺ / nvg", "n⁺n / vg⁺vg", "nvg / nvg"], "Chaque homologue associe alors un sauvage et un mutant.", "Cours source • p. 12"],
      ["Quelles classes permettent le mieux de déterminer la phase ?", "Les deux classes majoritaires", ["Une seule classe choisie au hasard", "Les deux caractères analysés séparément", "Le total sans les phénotypes"], "Elles identifient la paire d’associations parentales.", "Interprétation corrigée • p. 12–13"],
      ["Quel gamète parental correspond au phénotype gris-long ?", "n⁺vg⁺", ["n⁺vg", "nvg⁺", "nvg"], "Le testeur étant double récessif, le phénotype lit directement le gamète de F1.", "Cours source • p. 13"],
      ["Quel gamète parental correspond au phénotype noir-vestigial ?", "nvg", ["n⁺vg⁺", "n⁺vg", "nvg⁺"], "C’est la seconde association conservée des souches parentales.", "Cours source • p. 13"],
      ["Quel mécanisme forme n⁺vg et nvg⁺ ?", "Un crossing-over entre les deux loci", ["Une mitose sans réplication", "Une dominance incomplète", "Une mutation obligatoire de chaque allèle"], "L’échange entre homologues réassocie les allèles existants.", "Cours source • p. 13 et 16–17"],
      ["À quel moment méiotique situe-t-on le crossing-over ?", "Pendant la prophase I", ["Pendant la télophase II seulement", "Après la fécondation", "Pendant la mitose de F1"], "Les chromatides non sœurs d’homologues appariés échangent des segments en prophase I.", "Précision scientifique • d’après l’interprétation p. 16–17"],
      ["Les recombinés portent-ils nécessairement de nouveaux allèles ?", "Non, ils réassocient les allèles parentaux", ["Oui, deux mutations sont obligatoires", "Oui, ils perdent un chromosome", "Non, car ils sont identiques aux parentaux"], "La recombinaison change les associations, pas l’identité des allèles.", "Application originale • d’après les p. 13 et 16–17"],
      ["Pourquoi les classes 78 et 79 sont-elles qualifiées de symétriques ?", "Leurs effectifs sont proches et correspondent aux deux produits réciproques", ["Elles sont toutes deux parentales", "Elles totalisent 50 %", "Elles ont le même phénotype"], "Un crossing-over produit les deux associations réciproques n⁺vg et nvg⁺.", "Application originale • d’après la p. 13"],
    ], short("Nomme la phase où n⁺ et vg⁺ sont sur le même homologue.", ["cis", "phase cis", "couplage", "couplage cis"], "Cette organisation est la phase cis ou couplage.", "Cours source • p. 12")),
    corrections: [
      "La phase cis est déterminée à partir des deux classes majoritaires parentales, plutôt que de la seule classe double récessive mise en avant par le support.",
      "Le crossing-over est situé en prophase I entre chromatides non sœurs d’homologues et présenté comme une réassociation d’allèles, non une mutation.",
      "La qualification rare du crossing-over dans le document est ramenée au constat local : les recombinés sont minoritaires pour ces deux loci.",
    ],
  },
  {
    id: "genetic-distance-map",
    title: "Calculer une distance génétique et tracer la carte",
    summary: "Mesurer la fréquence de recombinaison dans un test-cross, retrouver la même valeur dans F1 × F1 et convertir l’écart en carte factorielle.",
    pages: "13–17",
    section: "Distance génétique, carte factorielle et interprétation des deuxième et troisième croisements",
    durationMinutes: 42,
    xp: 110,
    kind: "practice",
    body: String.raw`
## Le calcul direct dans le test-cross

Le test-cross reflète en qualité et en quantité les gamètes de la femelle F1. Les recombinés sont les deux classes minoritaires, 78 gris-vestigial et 79 noir-long. La fréquence de recombinaison vaut :

$$r=\frac{78+79}{1\,000}=0{,}157$$

La distance génétique exprimée en unités de recombinaison ou en centimorgans est :

$$d=100\times r=15{,}7\ \mathrm{cM}$$

Dans le cadre du support, 1 % de descendants recombinés correspond à 1 UR, soit 1 cM de carte.

## Reconstituer le calcul hors test-cross

Le troisième croisement associe une femelle F1 cis à un mâle F1. Le document précise que le mâle de la drosophile ne réalise pas de crossing-over : il produit seulement les deux gamètes parentaux, chacun à $1/2$.

Si $P$ est la fréquence totale des gamètes recombinés de la femelle :

- chaque gamète parental femelle a la fréquence $(1-P)/2$ ;
- chaque gamète recombiné femelle a la fréquence $P/2$ ;
- chaque gamète parental mâle a la fréquence $1/2$.

Le phénotype double récessif $[n\,vg]$ exige le gamète parental $nvg$ des deux parents. On pose donc :

$$\frac{1-P}{2}\times\frac{1}{2}=\frac{216}{1\,025}$$

Ainsi $(1-P)/4=216/1\,025$, d’où $P\approx0{,}157$ et $d\approx15{,}7$ cM, cohérent avec le test-cross.

## Corriger le tableau des gamètes

Aux pages 15 et 16, le support étiquette aussi les gamètes recombinés $(1-P)/2$. C’est impossible : les quatre fréquences totaliseraient $2(1-P)$. Les recombinés doivent chacun porter $P/2$, tandis que les parentaux portent chacun $(1-P)/2$.

## Construire la carte factorielle

La carte place les loci $n$ et $vg$ sur une ligne, séparés de 15,7 cM. Avec l’échelle graphique « 0,5 cm sur le dessin pour 1 UR », la longueur à tracer est :

$$15{,}7\times0{,}5=7{,}85\ \mathrm{cm}$$

Le document écrit 8 cm : c’est un arrondi, pas le résultat exact.

## Limites utiles

Une fréquence de recombinaison observable ne dépasse pas 50 %. L’équivalence directe pourcentage-cM est surtout une bonne approximation pour des distances courtes ; des crossing-over multiples peuvent masquer certains événements à grande distance. Cette précision évite d’interpréter 50 % comme une distance illimitée.
`,
    keyPoint: "Test-cross : d(cM) = 100 × (recombinés/total) ; ici (78+79)/1 000 × 100 = 15,7 cM.",
    example: "À l’échelle 0,5 cm pour 1 UR, 15,7 UR occupent exactement 7,85 cm sur la carte, soit environ 7,9 cm.",
    methodSteps: [
      "Vérifier si le croisement est un test-cross avant de sommer directement les phénotypes minoritaires.",
      "Identifier les deux classes recombinées réciproques.",
      "Diviser leur somme par le total pour obtenir r en écriture décimale.",
      "Multiplier r par 100 pour obtenir la distance en cM ou UR.",
      "Appliquer séparément l’échelle graphique et annoncer tout arrondi.",
    ],
    interaction: {
      kind: "numeric",
      eyebrow: "Calculateur de recombinaison",
      title: "Du taux décimal à la distance génétique",
      instruction: "Déplace r entre 0 et 0,5 ; observe la distance d = 100 × r et retrouve r = 0,157.",
      formula: "d = 100 × r",
      formulaTex: "d=100\\times r",
      inputSymbol: "r",
      outputSuffix: " cM",
      rule: { kind: "linear", coefficient: 100, constant: 0 },
      input: { min: 0, max: 0.5, step: 0.001, initial: 0.157 },
      observation: "Le curseur attend r sous forme décimale : 0,157 devient 15,7 cM ; saisir 15,7 confondrait proportion et pourcentage.",
    },
    questions: questions(72, [
      ["Quels effectifs faut-il sommer pour calculer r dans le test-cross ?", "78 et 79", ["421 et 422", "421 et 78", "719 et 216"], "Ce sont les deux classes recombinées minoritaires.", "Cours source • p. 13"],
      ["Quelle est la fréquence décimale de recombinaison ?", "0,157", ["15,7", "0,843", "1,57"], "157 recombinés divisés par 1 000 donnent 0,157.", "Cours source • p. 13"],
      ["Quelle distance génétique correspond à r = 0,157 ?", "15,7 cM", ["0,157 cM", "157 cM", "84,3 cM"], "La distance du modèle vaut 100 × r.", "Cours source • p. 13"],
      ["Pourquoi le test-cross permet-il le calcul direct par les phénotypes minoritaires ?", "Les phénotypes descendants reflètent les gamètes de l’hétérozygote", ["Le testeur produit quatre gamètes", "Tous les descendants sont homozygotes", "Le crossing-over est impossible"], "Le double récessif apporte toujours la même combinaison d’allèles.", "Cours source • p. 13"],
      ["Chez quel parent le support autorise-t-il le crossing-over de ce croisement de drosophile ?", "Chez la femelle F1", ["Chez le mâle F1 seulement", "Chez aucun parent", "Chez le parent double récessif uniquement"], "Le document précise l’absence de crossing-over chez le mâle de la drosophile.", "Cours source • p. 15–17"],
      ["Quelle fréquence correcte porte chaque gamète recombiné femelle si P est leur fréquence totale ?", "P/2", ["(1−P)/2", "P", "1−P"], "Les deux recombinés se partagent la fréquence totale P.", "Correction explicite • p. 15–16"],
      ["Quelle équation utilise la classe double récessive du troisième croisement ?", "(1−P)/4 = 216/1 025", ["P/4 = 719/1 025", "(1+P)/2 = 216/1 025", "P = 216 × 1 025"], "Le gamète parental nvg vaut (1−P)/2 chez la femelle et 1/2 chez le mâle.", "Cours corrigé • p. 15"],
      ["À l’échelle 0,5 cm pour 1 UR, quelle longueur exacte représente 15,7 UR ?", "7,85 cm", ["8,00 cm exactement", "15,7 cm", "31,4 cm"], "15,7 × 0,5 = 7,85 ; 8 cm n’est qu’un arrondi.", "Correction explicite • p. 13 et 16"],
      ["Quelle borne supérieure a la fréquence observable de recombinaison entre deux loci ?", "50 %", ["25 %", "75 %", "100 %"], "Au-delà, les associations deviennent indiscernables d’un assortiment indépendant.", "Précision scientifique • prolongement des p. 13–16"],
    ], short("Calcule la distance en cM pour 157 recombinés sur 1 000 descendants.", ["15,7", "15.7", "15,7 cM", "15.7 cM"], "157/1 000 × 100 = 15,7 cM.", "Cours source • p. 13")),
    corrections: [
      "Les gamètes recombinés de la femelle sont corrigés en P/2 chacun aux pages 15–16 ; (1−P)/2 est réservé aux deux gamètes parentaux.",
      "La longueur de carte à l’échelle 0,5 cm pour 1 UR est 7,85 cm ; les 8 cm du support sont explicitement signalés comme un arrondi.",
      "L’unité est normalisée en centimorgan, symbole cM, et l’équivalence directe avec le pourcentage est encadrée pour les courtes distances.",
      "La limite de 50 % de recombinaison observable est ajoutée pour éviter une extrapolation abusive de la carte.",
    ],
  },
  {
    id: "genetic-applications-supplement",
    title: "Comparer hybridation, clonage, insémination et FIVETE",
    summary: "Compléter le support par les habiletés du guide DPFC : calculer le pourcentage de liaison, définir quatre techniques et expliquer l’intérêt génétique de l’hybridation.",
    pages: "pp. 36-37",
    section: "Habiletés du guide : pourcentage de liaison et applications de la génétique",
    durationMinutes: 36,
    xp: 120,
    kind: "practice",
    body: String.raw`
## 1. Du taux de recombinaison au pourcentage de liaison

Dans le test-cross de drosophiles, 157 descendants sur 1 000 sont recombinés. La fréquence de recombinaison est donc 15,7 %. Les deux classes parentales regroupent 421 + 422 = 843 descendants. Le **pourcentage de liaison parentale**, au sens employé dans le guide, vaut :

$$L=\frac{843}{1\,000}\times100=84{,}3\,\%$$

Il se calcule aussi par $100\,\%-15{,}7\,\%=84{,}3\,\%$. Il ne faut pas confondre cette proportion de gamètes parentaux avec la distance génétique, qui vaut ici 15,7 cM. Une liaison de 84,3 % ne signifie pas une absence totale de crossing-over : les 15,7 % de recombinés montrent précisément que des échanges ont eu lieu entre les loci.

## 2. L’hybridation : croiser des patrimoines génétiques différents

En génétique, une **hybridation** est le croisement de parents génétiquement différents pour un ou plusieurs caractères. Elle peut réunir dans une descendance des allèles d’intérêt provenant de lignées distinctes, produire de nouvelles combinaisons et accroître la variabilité disponible pour la sélection. En agriculture ou en élevage, on peut rechercher par exemple l’association d’un bon rendement et d’une résistance à une maladie.

L’hybridation ne garantit pourtant pas que chaque descendant cumule toutes les qualités souhaitées. Les allèles se séparent et se recombinent ; il faut donc observer, tester et sélectionner les descendants. Une vigueur hybride peut apparaître dans certains croisements, mais elle n’est ni automatique ni synonyme de fixation durable des caractères.

## 3. Trois techniques à ne pas confondre

| Technique | Opération essentielle | Conséquence génétique attendue |
|---|---|---|
| **clonage** | produire des cellules ou des organismes issus d’un même modèle biologique | obtenir des copies génétiquement très proches, sans croisement de deux parents |
| **insémination artificielle** | déposer des spermatozoïdes sélectionnés dans les voies génitales femelles sans accouplement | la fécondation a généralement lieu dans l’organisme ; les deux parents contribuent au génome |
| **FIVETE** | mettre ovocytes et spermatozoïdes en présence hors de l’organisme, puis transférer un ou plusieurs embryons | la fécondation est in vitro ; l’embryon reçoit des allèles des deux parents |

**FIVETE** signifie **fécondation in vitro et transfert d’embryon**. L’insémination artificielle et la FIVETE sont donc deux techniques de reproduction assistée, mais le lieu de la fécondation les distingue. Le clonage répond à une autre logique : il cherche à reproduire un patrimoine génétique déjà présent plutôt qu’à combiner les gamètes de deux parents.

## 4. Lire l’intérêt sans promettre le résultat

Ces techniques sont des outils, pas des garanties. L’hybridation crée des combinaisons à évaluer ; le clonage conserve largement un génotype mais n’efface ni l’effet du milieu ni les variations biologiques ; l’insémination et la FIVETE facilitent une reproduction sans déterminer à l’avance le phénotype de chaque descendant. Une utilisation responsable tient compte de la diversité génétique, du bien-être animal, du suivi sanitaire et des règles éthiques applicables.

> **Repère Davy — H-C-I-F :** **H**ybrider combine, **C**loner copie, **I**nséminer dépose les spermatozoïdes, **F**IVETE féconde hors de l’organisme puis transfère l’embryon.
`,
    keyPoint: "Liaison parentale : 84,3 % ; l’hybridation combine des patrimoines, le clonage les copie, l’insémination dépose les spermatozoïdes et la FIVETE réalise la fécondation in vitro avant transfert.",
    example: "Pour 15,7 % de recombinés, 84,3 % des gamètes conservent les associations parentales ; ce complément n’est pas la distance, qui reste 15,7 cM.",
    methodSteps: [
      "Calculer la recombinaison puis son complément parental à 100 %.",
      "Définir l’hybridation comme un croisement entre parents génétiquement différents.",
      "Relier son intérêt à la combinaison d’allèles et à la sélection des descendants.",
      "Distinguer le clonage, sans croisement, des deux techniques de reproduction assistée.",
      "Séparer insémination in vivo et fécondation in vitro suivie d’un transfert d’embryon.",
      "Formuler les bénéfices possibles sans promettre un phénotype ni ignorer les limites.",
    ],
    interaction: timeline(
      "Choisir le bon outil génétique",
      "Déroule les six repères et associe chaque objectif à l’opération réellement réalisée.",
      [
        { label: "Mesurer la liaison", shortLabel: "84,3 %", detail: "Soustraire 15,7 % de recombinaison à 100 %, ou sommer les deux classes parentales." },
        { label: "Combiner", shortLabel: "Hybridation", detail: "Croiser des parents différents pour créer des associations d’allèles à évaluer." },
        { label: "Sélectionner", shortLabel: "Descendants", detail: "Repérer les individus réunissant les caractères recherchés sans supposer que tous les hybrides les possèdent." },
        { label: "Copier", shortLabel: "Clonage", detail: "Produire des copies génétiquement très proches à partir d’un même modèle, sans fécondation entre deux parents." },
        { label: "Déposer", shortLabel: "Insémination", detail: "Introduire les spermatozoïdes ; la rencontre avec l’ovocyte se déroule généralement dans l’organisme." },
        { label: "Féconder puis transférer", shortLabel: "FIVETE", detail: "Réaliser la fécondation hors de l’organisme avant le transfert embryonnaire." },
      ],
      "Le critère le plus sûr est l’opération : croiser, copier, déposer des spermatozoïdes ou féconder in vitro puis transférer.",
    ),
    questions: questions(81, [
      ["Comment calcule-t-on le pourcentage de liaison parentale dans le test-cross étudié ?", "100 % moins le pourcentage de recombinaison", ["La moitié du pourcentage de recombinaison", "La distance en cM ajoutée à 100 %", "Le rapport d’une seule classe parentale au total"], "Les parentaux et les recombinés couvrent ici 100 % des gamètes observés.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Qu’est-ce qu’une hybridation en génétique ?", "Un croisement entre parents génétiquement différents", ["La copie d’un organisme sans croisement", "Le dépôt de spermatozoïdes sans fécondation in vitro", "Le transfert d’un embryon déjà formé"], "L’hybridation combine les contributions génétiques de parents différents.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Quel est un intérêt génétique majeur de l’hybridation ?", "Créer des combinaisons d’allèles réunissant potentiellement plusieurs qualités", ["Rendre tous les descendants homozygotes en une génération", "Produire des copies strictement identiques du meilleur parent", "Empêcher toute ségrégation au cours de la méiose"], "Le croisement fournit une diversité sur laquelle une sélection peut ensuite agir.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Pourquoi faut-il sélectionner les descendants après une hybridation ?", "Chaque descendant ne réunit pas nécessairement tous les caractères recherchés", ["Aucun descendant ne reçoit d’allèle parental", "Tous les hybrides possèdent obligatoirement le même génotype à vie", "L’hybridation supprime la recombinaison"], "Ségrégation et recombinaison produisent plusieurs combinaisons possibles.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Quelle proposition définit le mieux le clonage ?", "Produire des copies génétiquement très proches à partir d’un même modèle", ["Croiser deux lignées contrastées", "Déposer des spermatozoïdes dans les voies génitales", "Féconder un ovocyte in vitro avec deux gamètes"], "Le clonage ne combine pas les gamètes de deux parents.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Que réalise l’insémination artificielle ?", "Le dépôt de spermatozoïdes dans les voies génitales sans accouplement", ["Le transfert d’un clone dans un incubateur", "La fécondation obligatoire hors de l’organisme", "Le croisement de chromosomes en prophase I"], "La fécondation reste généralement in vivo après le dépôt des spermatozoïdes.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Que signifie FIVETE ?", "Fécondation in vitro et transfert d’embryon", ["Fixation in vivo et transfert d’enzymes", "Fécondation interne par voie exclusivement naturelle", "Formation identique de végétaux et transfert écologique"], "Les gamètes sont mis en présence hors de l’organisme avant le transfert embryonnaire.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Quelle différence centrale sépare insémination artificielle et FIVETE ?", "Le lieu de la fécondation : généralement in vivo pour l’une, in vitro pour l’autre", ["Une seule utilise des gamètes", "Une seule implique deux parents génétiques", "La FIVETE produit nécessairement un clone"], "Les deux peuvent mobiliser deux parents, mais la fécondation ne se déroule pas au même endroit.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
      ["Quelle technique crée directement de nouvelles combinaisons par croisement de parents différents ?", "L’hybridation", ["Le clonage", "La conservation d’un clone", "La multiplication de cellules d’un même donneur"], "L’hybridation associe des allèles issus de deux patrimoines génétiques.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale"],
    ], short("Calcule le pourcentage de liaison pour 15,7 % de recombinaison.", ["84,3 %", "84.3 %", "84,3%", "84.3%"], "100 % − 15,7 % = 84,3 % d’associations parentales.", "Guide DPFC SVT Terminale D • p. 37 • adaptation évaluative originale")),
    corrections: [
      "Ce niveau est un complément adapté du guide DPFC Terminale D, pages 36-37 ; il n’est pas présenté comme une partie du support complet de 19 pages.",
      "Le pourcentage de liaison est défini dans le contexte du test-cross comme le complément des recombinés, sans être confondu avec la distance génétique.",
      "L’hybridation est distinguée du clonage et son intérêt est formulé comme une possibilité soumise à ségrégation, évaluation et sélection.",
      "L’insémination artificielle est séparée de la FIVETE par le lieu de la fécondation ; aucune technique n’est présentée comme garantissant un phénotype.",
    ],
    sourceMetadata: {
      documentTitle: guideDocument,
      pages: "pp. 36-37",
      section: "Habiletés : calculer le pourcentage de liaison ; identifier et décrire l’hybridation, le clonage, l’insémination artificielle et la FIVETE ; dégager l’importance de l’hybridation",
      fidelity: "adapted",
      corrections: [
        "Le programme-guide énumère les habiletés mais ne fournit pas ici de cours rédigé ni d’exercice complet : les explications, l’interaction et les dix évaluations sont des adaptations originales.",
        "Le pourcentage de liaison est défini dans le contexte du test-cross comme le complément des recombinés, sans être confondu avec la distance génétique.",
        "L’hybridation est distinguée du clonage et son intérêt est formulé comme une possibilité soumise à ségrégation, évaluation et sélection.",
        "L’insémination artificielle est séparée de la FIVETE par le lieu de la fécondation ; aucune technique n’est présentée comme garantissant un phénotype.",
      ],
    },
  },
  {
    id: "two-trait-heredity-final-mission",
    title: "Mission finale — résoudre les évaluations du support",
    summary: "Associer proportions et croisements, puis conduire jusqu’au génotype l’étude complète de l’autofécondation de maïs.",
    pages: "1, 18–19",
    section: "Situation d’apprentissage et évaluation — exercices 1 et 2",
    durationMinutes: 45,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## Exercice 1 — reconnaître le croisement derrière une proportion

Le tableau du support propose quatre résultats et trois types de croisements : hybride × récessif, deux lignées pures, ou deux hybrides.

- **100 % d’un même phénotype** correspond au croisement de deux lignées pures contrastées dans le modèle d’uniformité : $1\rightarrow b$.
- **3/4 dominant et 1/4 récessif** correspond à deux hybrides en dominance complète : $2\rightarrow c$.
- **1/2 intermédiaire et 1/4 de chaque phénotype parental** correspond à deux hybrides avec dominance incomplète : $3\rightarrow c$.
- **1/2 dominant et 1/2 récessif** correspond au croisement d’un hybride avec un récessif : $4\rightarrow a$.

La réponse complète est donc **1-b ; 2-c ; 3-c ; 4-a**. Une même catégorie de croisement peut produire des rapports différents selon la relation de dominance.

## Exercice 2 — organiser les données du maïs

L’autofécondation d’un plant issu d’un grain lisse-jaune donne : 3 036 lisses-jaunes, 1 000 lisses-vertes, 1 000 ridées-jaunes et 320 ridées-vertes.

### 1. Identifier

Les caractères sont l’**aspect** de la graine — lisse/ridée — et sa **couleur** — jaune/verte.

### 2. Analyser caractère par caractère

Le total est :

$$N=3\,036+1\,000+1\,000+320=5\,356$$

Les lisses et les jaunes totalisent chacun 4 036, soit environ 75,35 %. Les ridées et les vertes totalisent chacun 1 320, soit environ 24,65 %. Chaque caractère suit donc approximativement $3/4$–$1/4$ avec lisse et jaune dominants.

### 3. Tester l’indépendance

Sous $9:3:3:1$, les effectifs attendus sont :

| Classe | Observé | Attendu |
|---|---:|---:|
| lisse-jaune | 3 036 | $5\,356\times9/16=3\,012{,}75$ |
| lisse-verte | 1 000 | $5\,356\times3/16=1\,004{,}25$ |
| ridée-jaune | 1 000 | $5\,356\times3/16=1\,004{,}25$ |
| ridée-verte | 320 | $5\,356\times1/16=334{,}75$ |

Les observations sont proches des attendus. Dans la méthode descriptive du support, elles sont compatibles avec l’assortiment indépendant.

### 4. Écrire le croisement

L’apparition de chaque phénotype récessif dans une autofécondation impose que le plant lisse-jaune porte $r$ et $v$. Il est donc $RrVv$ et le croisement est :

$$RrVv\times RrVv$$

## Retour raisonné aux lapins

Le lapereau blanc aux yeux rouges montre que les deux parents noirs peuvent porter les allèles récessifs des deux caractères. Mais l’énoncé de la page 1 ne donne ni les quatre effectifs ni un test-cross : il ne permet pas de choisir entre indépendance et liaison. Cette limite fait partie d’une bonne conclusion scientifique.

> **Réponse modèle.** « Les données de maïs concernent l’aspect et la couleur. Chaque caractère suit environ 3/4–1/4. Les quatre classes sont proches de 9:3:3:1, donc compatibles avec l’indépendance dans la démarche du support. Le plant autofécondé est double hétérozygote RrVv. »
`,
    keyPoint: "Maïs : N=5 356, marges ≈3/4–1/4, quatre classes compatibles avec 9:3:3:1, croisement RrVv × RrVv.",
    example: "L’attendu double récessif vaut 5 356/16 = 334,75 ; les 320 observés restent proches dans l’analyse descriptive demandée.",
    methodSteps: [
      "Associer chaque proportion de l’exercice 1 au bon type de croisement.",
      "Pour le maïs, identifier les deux caractères puis calculer le total 5 356.",
      "Regrouper les classes caractère par caractère et fixer dominance et hétérozygotie.",
      "Calculer les quatre attendus de 9:3:3:1 et les comparer aux observations.",
      "Écrire RrVv × RrVv et formuler une conclusion limitée aux données.",
    ],
    interaction: diagram(
      "Le dossier final en six preuves",
      "Explore chaque carte puis reconstruis une réponse continue aux cinq consignes de l’exercice 2.",
      "Autofécondation du maïs",
      "Quatre effectifs doivent conduire des caractères au génotype, en passant par les marges et l’hypothèse d’indépendance.",
      [
        { id: "traits", label: "Deux caractères", role: "Identifier", detail: "Aspect lisse/ridé et couleur jaune/verte." },
        { id: "total", label: "Total 5 356", role: "Additionner", detail: "3 036 + 1 000 + 1 000 + 320 = 5 356 descendants." },
        { id: "margins", label: "Marges 4 036/1 320", role: "Analyser", detail: "Pour chaque caractère, environ 75,35 % dominant et 24,65 % récessif." },
        { id: "expected", label: "Attendu 9:3:3:1", role: "Calculer", detail: "3 012,75 ; 1 004,25 ; 1 004,25 ; 334,75." },
        { id: "comparison", label: "Observé proche", role: "Comparer", detail: "3 036 ; 1 000 ; 1 000 ; 320 sont compatibles avec le modèle indépendant descriptif." },
        { id: "genotype", label: "RrVv × RrVv", role: "Conclure", detail: "L’autofécondation révèle que le plant lisse-jaune porte les deux allèles récessifs." },
      ],
      "Une réponse excellente montre les calculs, nomme le modèle et n’affirme pas plus que les données ne permettent.",
    ),
    questions: questions(90, [
      ["Quelle association répond à l’exercice 1 du support ?", "1-b ; 2-c ; 3-c ; 4-a", ["1-a ; 2-b ; 3-c ; 4-b", "1-c ; 2-a ; 3-b ; 4-c", "1-b ; 2-a ; 3-b ; 4-c"], "Uniformité : lignées pures ; 3:1 et 1:2:1 : deux hybrides ; 1:1 : hybride × récessif.", "Évaluation source • exercice 1 • p. 18"],
      ["Quel est le total des grains de maïs de l’exercice 2 ?", "5 356", ["5 431", "6 356", "3 356"], "3 036 + 1 000 + 1 000 + 320 = 5 356.", "Évaluation source • exercice 2 • p. 19"],
      ["Quels caractères étudie l’exercice du maïs ?", "Aspect et couleur des grains", ["Taille et masse des plants", "Couleur des fleurs et hauteur", "Sexe et viabilité"], "Les phénotypes sont lisse/ridé et jaune/vert.", "Évaluation source • exercice 2 • p. 19"],
      ["Combien de grains lisses compte-t-on ?", "4 036", ["3 036", "1 320", "5 356"], "Les classes lisse-jaune et lisse-verte valent 3 036 + 1 000.", "Évaluation guidée • exercice 2 • p. 19"],
      ["Quel effectif théorique attend-on pour chaque classe à 3/16 ?", "1 004,25", ["1 000", "3 012,75", "334,75"], "5 356 × 3/16 = 1 004,25.", "Évaluation guidée • exercice 2 • p. 19"],
      ["Quel effectif théorique attend-on pour la classe double récessive ?", "334,75", ["320", "1 004,25", "3 012,75"], "5 356 × 1/16 = 334,75.", "Évaluation guidée • exercice 2 • p. 19"],
      ["Quelle conclusion convient aux quatre effectifs du maïs ?", "Ils sont compatibles avec 9:3:3:1", ["Ils indiquent deux classes parentales à 42 %", "Ils prouvent une liaison complète", "Ils suivent 1:1:1:1"], "Les écarts aux attendus 9:3:3:1 sont faibles dans la démarche descriptive du support.", "Évaluation source corrigée • exercice 2 • p. 19"],
      ["Quel est le génotype du plant lisse-jaune autofécondé ?", "RrVv", ["RRVV", "rrvv", "RRVv"], "Les deux phénotypes récessifs apparaissent, donc le parent porte r et v tout en exprimant R et V.", "Évaluation source • exercice 2 • p. 19"],
      ["Que peut-on conclure de la seule naissance du lapereau blanc aux yeux rouges ?", "Les parents peuvent porter les deux allèles récessifs, sans trancher liaison ou indépendance", ["Les gènes sont forcément indépendants", "Les gènes sont forcément complètement liés", "Les phénotypes noirs sont récessifs"], "La situation ne fournit pas la distribution des quatre classes nécessaire au test.", "Situation source précisée • p. 1"],
    ], short("Écris le croisement génotypique de l’autofécondation du maïs.", ["RrVv x RrVv", "RrVv × RrVv", "RrVv*RrVv"], "Le même plant RrVv fournit les gamètes des deux côtés du croisement.", "Évaluation source • exercice 2 • p. 19")),
    corrections: [
      "Le total de l’exercice 2 est calculé explicitement à 5 356 afin d’éviter une lecture fautive de la série d’effectifs.",
      "Les observations du maïs sont dites compatibles avec 9:3:3:1 dans la méthode descriptive, et non statistiquement identiques sans test fourni.",
      "La situation des lapins est résolue seulement jusqu’au portage possible des allèles récessifs ; elle ne permet pas de trancher liaison ou indépendance.",
      "L’exercice 1 est restitué comme exercice du support ; le retour aux lapins est signalé comme un prolongement raisonné, pas comme une consigne officielle ajoutée.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtTwoTraitHeredityPath: LearningPath = {
  id: "terminale-d-svt-l9-two-trait-heredity",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Support complet corrigé + complément du guide DPFC",
  curriculumSourceUrl: guideUrl,
  theme: { number: 2, title: "La transmission des caractères héréditaires" },
  chapterNumber: 9,
  title: "La transmission de deux caractères héréditaires chez les êtres vivants",
  description: "Le support complet de 19 pages reconstruit et corrigé, complété en onze niveaux par les habiletés DPFC sur le pourcentage de liaison, l’hybridation, le clonage, l’insémination artificielle et la FIVETE.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Analyser séparément puis simultanément deux caractères héréditaires",
    "Prévoir les gamètes et les proportions d’un dihybridisme indépendant",
    "Interpréter un test-cross pour distinguer indépendance et liaison génétique",
    "Identifier parentaux, recombinés et phase cis puis calculer une distance génétique",
    "Calculer le pourcentage de liaison et distinguer hybridation, clonage, insémination artificielle et FIVETE",
    "Résoudre les deux évaluations du support avec une conclusion proportionnée aux données",
  ],
  modules: [
    {
      id: "two-trait-heredity-mastery",
      title: "Maîtriser la transmission simultanée de deux caractères",
      description: "Onze niveaux progressifs, des croisements à la carte factorielle, aux applications génétiques du guide et à la mission de maïs.",
      lessons: builtLevels,
    },
  ],
};
