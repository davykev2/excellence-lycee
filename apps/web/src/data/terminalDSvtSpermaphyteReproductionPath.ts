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

const sourceDocument = "SVT TD_L10_La reproduction chez les spermaphytes.pdf";

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
      eyebrow: "Méthode botanique",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Commence par situer l’organe et la génération observée, suis les divisions avec leur ploïdie, puis relie pollinisation, fécondations et devenir des tissus.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : chez une plante à fleurs, deux lignées haploïdes se rencontrent dans l’ovule, mais le fruit reste un tissu maternel issu de l’ovaire.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const antherShapes: SchemaShape[] = [
  { shape: "path", d: "M120 215 C120 90 245 48 360 128 C475 48 600 90 600 215 C600 340 475 382 360 302 C245 382 120 340 120 215 Z", tone: "soft" },
  { shape: "ellipse", cx: 245, cy: 145, rx: 76, ry: 54, rotate: -18, tone: "accent" },
  { shape: "ellipse", cx: 245, cy: 285, rx: 76, ry: 54, rotate: 18, tone: "accent" },
  { shape: "ellipse", cx: 475, cy: 145, rx: 76, ry: 54, rotate: 18, tone: "accent" },
  { shape: "ellipse", cx: 475, cy: 285, rx: 76, ry: 54, rotate: -18, tone: "accent" },
  { shape: "circle", cx: 360, cy: 215, r: 34, tone: "fill" },
  { shape: "line", x1: 555, y1: 256, x2: 615, y2: 285, tone: "outline" },
  { shape: "text", x: 360, y: 414, content: "Coupe pédagogique originale d’une anthère à quatre sacs polliniques", anchor: "middle" },
];

const antherHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "epidermis", number: 1, label: "Épiderme", x: 155, y: 102, detail: "Couche externe protectrice de l’anthère ; elle appartient à la paroi sporophytique diploïde." },
  { id: "endothecium", number: 2, label: "Endothèce", x: 198, y: 202, detail: "Couche sous-épidermique à épaississements qui contribue à l’ouverture de l’anthère à maturité." },
  { id: "tapetum", number: 3, label: "Tapetum", x: 245, y: 145, detail: "Assise interne nourricière du microsporange ; elle accompagne la formation des microspores puis régresse." },
  { id: "pollen-sac", number: 4, label: "Sac pollinique", x: 475, y: 145, detail: "Microsporange où les cellules mères diploïdes accomplissent la méiose et produisent des microspores." },
  { id: "vascular", number: 5, label: "Faisceau conducteur", x: 360, y: 215, detail: "Tissu vasculaire du connectif reliant l’anthère au filet de l’étamine." },
  { id: "stomium", number: 6, label: "Fente de déhiscence", x: 584, y: 271, detail: "Zone spécialisée où la paroi s’ouvre afin de libérer les grains de pollen." },
];

const ovuleShapes: SchemaShape[] = [
  { shape: "ellipse", cx: 430, cy: 215, rx: 205, ry: 158, rotate: -8, tone: "soft" },
  { shape: "ellipse", cx: 430, cy: 215, rx: 175, ry: 132, rotate: -8, tone: "outline" },
  { shape: "ellipse", cx: 430, cy: 215, rx: 115, ry: 88, rotate: -8, tone: "accent" },
  { shape: "path", d: "M220 108 C150 130 138 205 182 260 C205 290 230 316 246 365", tone: "fill" },
  { shape: "path", d: "M255 110 C220 122 205 146 198 178", tone: "outline" },
  { shape: "line", x1: 247, y1: 350, x2: 180, y2: 410, tone: "outline" },
  { shape: "line", x1: 263, y1: 132, x2: 223, y2: 94, tone: "muted" },
  { shape: "text", x: 460, y: 430, content: "Ovule anatrope simplifié — représentation originale", anchor: "middle" },
];

const ovuleHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "funiculus", number: 1, label: "Funicule", x: 196, y: 318, detail: "Pédicelle reliant l’ovule au placenta et portant le faisceau conducteur." },
  { id: "hilum", number: 2, label: "Hile", x: 244, y: 350, detail: "Zone d’attache du funicule ; après maturation, elle laisse une cicatrice sur la graine." },
  { id: "raphe", number: 3, label: "Raphé", x: 205, y: 220, detail: "Crête formée par la soudure du funicule au corps d’un ovule anatrope ; elle n’existe pas sur tous les types d’ovules." },
  { id: "integuments", number: 4, label: "Téguments", x: 560, y: 120, detail: "Enveloppes diploïdes maternelles qui entourent le nucelle et formeront l’essentiel du tégument de la graine." },
  { id: "nucellus", number: 5, label: "Nucelle", x: 545, y: 315, detail: "Tissu sporophytique de l’ovule contenant le gamétophyte femelle." },
  { id: "embryo-sac", number: 6, label: "Sac embryonnaire", x: 430, y: 215, detail: "Gametophyte femelle ; le modèle dominant étudié comporte sept cellules et huit noyaux." },
  { id: "micropyle", number: 7, label: "Micropyle", x: 242, y: 111, detail: "Ouverture des téguments près de l’appareil œuf, généralement empruntée par le tube pollinique." },
  { id: "chalaza", number: 8, label: "Chalaze", x: 604, y: 277, detail: "Pôle opposé au micropyle où nucelle et téguments se rejoignent." },
];

const fertilizationShapes: SchemaShape[] = [
  { shape: "ellipse", cx: 505, cy: 220, rx: 172, ry: 176, tone: "soft" },
  { shape: "circle", cx: 465, cy: 327, r: 30, tone: "accent" },
  { shape: "circle", cx: 420, cy: 334, r: 22, tone: "muted" },
  { shape: "circle", cx: 510, cy: 334, r: 22, tone: "muted" },
  { shape: "circle", cx: 480, cy: 205, r: 18, tone: "fill" },
  { shape: "circle", cx: 530, cy: 205, r: 18, tone: "fill" },
  { shape: "circle", cx: 455, cy: 95, r: 18, tone: "outline" },
  { shape: "circle", cx: 505, cy: 88, r: 18, tone: "outline" },
  { shape: "circle", cx: 555, cy: 95, r: 18, tone: "outline" },
  { shape: "path", d: "M85 370 C145 335 225 348 300 335 C355 325 370 300 402 282", tone: "accent" },
  { shape: "circle", cx: 365, cy: 300, r: 10, tone: "accent" },
  { shape: "circle", cx: 388, cy: 291, r: 10, tone: "accent" },
  { shape: "text", x: 495, y: 430, content: "Double fécondation d’une angiosperme — figure originale", anchor: "middle" },
];

const fertilizationHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "pollen-tube", number: 1, label: "Tube pollinique", x: 235, y: 345, detail: "Prolongement de la cellule végétative qui transporte deux gamètes mâles jusqu’au gamétophyte femelle." },
  { id: "sperm-cells", number: 2, label: "Deux spermatozoïdes végétaux", x: 376, y: 295, detail: "Gamètes mâles non flagellés chez les angiospermes ; l’ancien terme anthérozoïdes est évité ici." },
  { id: "micropyle-entry", number: 3, label: "Entrée micropylaire", x: 405, y: 284, detail: "Le tube atteint généralement une synergide près du micropyle puis libère ses deux gamètes." },
  { id: "egg", number: 4, label: "Oosphère n", x: 465, y: 327, detail: "Gamète femelle qui fusionne avec un spermatozoïde pour former le zygote diploïde." },
  { id: "synergids", number: 5, label: "Synergides", x: 420, y: 334, detail: "Cellules de l’appareil œuf impliquées dans l’attraction, l’accueil et l’éclatement du tube pollinique." },
  { id: "polar-nuclei", number: 6, label: "Deux noyaux polaires", x: 505, y: 205, detail: "Ils appartiennent à la cellule centrale et apportent ensemble deux lots haploïdes au noyau primaire de l’endosperme." },
  { id: "zygote", number: 7, label: "Zygote 2n", x: 505, y: 350, detail: "Produit de la fusion n + n ; il donnera l’embryon, accompagné de son suspenseur." },
  { id: "endosperm", number: 8, label: "Noyau primaire de l’endosperme 3n", x: 550, y: 235, detail: "Produit habituel de la fusion d’un gamète mâle n avec la cellule centrale contenant deux noyaux polaires n + n." },
];

const missionShapes: SchemaShape[] = [
  { shape: "circle", cx: 120, cy: 120, r: 54, tone: "accent" },
  { shape: "circle", cx: 104, cy: 116, r: 10, tone: "fill" },
  { shape: "circle", cx: 137, cy: 126, r: 8, tone: "fill" },
  { shape: "path", d: "M128 170 C175 220 260 195 330 245 C382 282 392 345 455 352", tone: "accent" },
  { shape: "circle", cx: 374, cy: 314, r: 9, tone: "accent" },
  { shape: "circle", cx: 395, cy: 327, r: 9, tone: "accent" },
  { shape: "ellipse", cx: 625, cy: 245, rx: 175, ry: 175, tone: "soft" },
  { shape: "circle", cx: 585, cy: 352, r: 30, tone: "accent" },
  { shape: "circle", cx: 625, cy: 235, r: 18, tone: "fill" },
  { shape: "circle", cx: 666, cy: 235, r: 18, tone: "fill" },
  { shape: "circle", cx: 575, cy: 105, r: 17, tone: "outline" },
  { shape: "circle", cx: 625, cy: 94, r: 17, tone: "outline" },
  { shape: "circle", cx: 675, cy: 105, r: 17, tone: "outline" },
  { shape: "text", x: 450, y: 448, content: "Mission reconstruite sans reprendre les figures scannées de l’exercice 4", anchor: "middle" },
];

const missionHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "mission-pollen", number: 1, label: "Grain de pollen", x: 120, y: 120, detail: "Gametophyte mâle déposé sur un stigmate compatible ; il s’hydrate puis germe." },
  { id: "mission-tube", number: 2, label: "Tube pollinique", x: 265, y: 220, detail: "Il croît dans les tissus du pistil ; sa cellule végétative guide le transport des gamètes." },
  { id: "mission-sperm", number: 3, label: "Deux gamètes mâles", x: 385, y: 320, detail: "Ils proviennent de la division de la cellule génératrice avant la double fécondation." },
  { id: "mission-micropyle", number: 4, label: "Micropyle", x: 456, y: 350, detail: "Porte d’entrée usuelle vers l’appareil œuf du sac embryonnaire." },
  { id: "mission-egg", number: 5, label: "Oosphère", x: 585, y: 352, detail: "Sa fusion avec un gamète mâle donne le zygote diploïde." },
  { id: "mission-central", number: 6, label: "Cellule centrale", x: 646, y: 235, detail: "Elle contient deux noyaux polaires ; sa fécondation déclenche l’endosperme généralement triploïde." },
  { id: "mission-antipodals", number: 7, label: "Antipodes", x: 625, y: 96, detail: "Trois cellules au pôle chalazien dans le sac embryonnaire de type Polygonum." },
  { id: "mission-seed", number: 8, label: "Graine en formation", x: 760, y: 325, detail: "L’ovule devient une graine : embryon, tissus de réserve variables et enveloppes maternelles." },
];

const levels: LevelSeed[] = [
  {
    id: "flowering-plant-scope-pollination",
    title: "Délimiter le modèle et tester la pollinisation",
    summary: "Comprendre que le fascicule décrit surtout les angiospermes et transformer la situation d’apprentissage en expérience contrôlée.",
    pages: "1",
    section: "Situation d’apprentissage et problème scientifique",
    durationMinutes: 26,
    xp: 45,
    body: String.raw`
## Le titre large et le modèle réellement étudié

Les **spermaphytes** sont les plantes qui produisent des graines. Elles regroupent notamment les gymnospermes, dont les ovules sont exposés sur des écailles ou structures comparables, et les **angiospermes**, plantes à fleurs dont les ovules sont enfermés dans un ovaire. Or le document travaille avec un pistil, un ovaire, un stigmate, un fruit et un sac embryonnaire à sept cellules : il décrit donc le modèle classique des **angiospermes**.

Conserver le titre officiel est utile pour rester aligné sur le programme, mais généraliser chaque conclusion à toutes les plantes à graines serait faux. La transformation de l’ovaire en fruit et la double fécondation donnant embryon et endosperme sont ici des caractères du modèle angiosperme.

## Lire la situation comme une expérience

Deux fleurs de la même plante sont comparées. Le pistil de la première est entouré d’une gaze ; celui de la seconde reçoit du pollen. Seule la fleur pollinisée forme un fruit contenant des graines. Cette observation soutient l’idée qu’un **transfert de pollen compatible** précède la fécondation et la formation des graines.

Cependant, la gaze n’est pas à elle seule un témoin parfait. Une fleur peut déjà avoir reçu son propre pollen, la gaze peut laisser passer de petits grains ou empêcher d’autres facteurs, et la fleur poudrée doit rester comparable à l’autre. Un protocole robuste précise :

1. choisir des boutons floraux avant l’ouverture ;
2. retirer les étamines si l’espèce peut s’autopolliniser ;
3. ensacher les deux fleurs de manière identique ;
4. déposer du pollen compatible sur le stigmate du lot expérimental seulement ;
5. répéter sur plusieurs fleurs et compter fruits et graines.

Le **témoin négatif** reçoit toutes les manipulations sauf le pollen compatible. Un témoin positif peut recevoir une pollinisation manuelle connue pour réussir. On distingue alors clairement corrélation et causalité.

## Trois événements à séparer

La **pollinisation** est le dépôt du pollen sur une surface réceptrice. La **germination pollinique** produit un tube. La **fécondation** est la fusion des gamètes dans l’ovule. Un fruit visible ne prouve pas toujours à lui seul une fécondation, car certaines espèces peuvent former des fruits parthénocarpiques ; la présence d’embryons ou de graines viables constitue un indice plus direct.

> **Correction de portée.** Le fascicule emploie « spermaphytes » pour un mécanisme construit avec fleur, ovaire et fruit : la suite précise systématiquement qu’il s’agit du modèle des angiospermes.

> **Astuce mémoire — P-G-F :** **P**ollen déposé, **G**ermination du tube, puis **F**usions gamétiques.
`,
    keyPoint: "Le document porte sur les spermaphytes mais son modèle expérimental et anatomique est celui des angiospermes : pollinisation, tube pollinique, double fécondation, graine et fruit.",
    example: "Une fleur ensachée et émasculée ne reçoit aucun pollen ; une fleur identique reçoit un pollen compatible. La différence de graines teste le rôle du pollen.",
    methodSteps: [
      "Identifier le groupe végétal réellement décrit par les organes cités.",
      "Nommer la variable manipulée : présence d’un pollen compatible.",
      "Construire un témoin soumis aux mêmes gestes sauf la pollinisation.",
      "Mesurer séparément nouaison, nombre de graines et viabilité.",
    ],
    interaction: diagram(
      "Du groupe végétal à la graine",
      "Explore les cartes puis classe les événements qui relèvent de toutes les plantes à graines ou seulement du modèle angiosperme.",
      "Reproduction sexuée d’une plante à graines",
      "Le pollen transporte la lignée mâle ; dans le fascicule, il atteint un pistil d’angiosperme dont les ovules sont enfermés dans un ovaire.",
      [
        { id: "seed-plants", label: "Spermaphytes", role: "Produire des graines", detail: "Ensemble large comprenant gymnospermes et angiospermes.", group: "Portée" },
        { id: "gymnosperms", label: "Gymnospermes", role: "Ovules non enfermés dans un ovaire", detail: "Elles produisent des graines mais pas un fruit issu d’un ovaire au sens des angiospermes.", group: "Portée" },
        { id: "angiosperms", label: "Angiospermes", role: "Fleur, ovaire et fruit", detail: "C’est le modèle effectivement représenté dans les huit pages du fascicule.", group: "Portée" },
        { id: "pollination", label: "Pollinisation", role: "Déposer le pollen", detail: "Le pollen compatible atteint le stigmate avant de germer.", group: "Séquence" },
        { id: "fertilization", label: "Double fécondation", role: "Réaliser deux fusions", detail: "Un gamète mâle féconde l’oosphère et l’autre la cellule centrale.", group: "Séquence" },
        { id: "seed-fruit", label: "Graine et fruit", role: "Transformer ovule et ovaire", detail: "L’ovule devient une graine ; l’ovaire contribue au fruit dans le modèle étudié.", group: "Devenir" },
      ],
      "La graine caractérise les spermaphytes ; l’ovaire devenu fruit et l’endosperme issu de la seconde fécondation situent précisément l’étude chez les angiospermes.",
    ),
    questions: questions(0, [
      ["Quel groupe le fascicule décrit-il réellement avec fleur, ovaire et fruit ?", "Les angiospermes", ["Toutes les algues", "Les mousses uniquement", "Les fougères sans graines"], "Ces organes et ce devenir appartiennent au modèle des plantes à fleurs.", "Situation et titre • page 1"],
      ["Que désigne la pollinisation ?", "Le dépôt du pollen sur une surface réceptrice", ["La fusion des deux noyaux polaires", "La croissance de l’embryon", "La déhiscence du fruit"], "La pollinisation précède germination du pollen et fécondation.", "Situation d’apprentissage • page 1"],
      ["Quel lot constitue le meilleur témoin négatif ?", "Une fleur comparable manipulée mais privée de pollen compatible", ["Une autre espèce non suivie", "Une graine déjà mûre", "Une fleur pollinisée avec davantage de pollen"], "Seule la variable pollen compatible doit différer.", "Situation expérimentale • page 1"],
      ["Pourquoi retirer les étamines avant l’ouverture chez une espèce autogame ?", "Pour empêcher une autopollinisation non contrôlée", ["Pour accélérer la méiose de l’ovule", "Pour créer un fruit sans ovaire", "Pour rendre le pollen diploïde"], "L’émasculation protège le témoin d’un pollen produit par la même fleur.", "Protocole corrigé • page 1"],
      ["Quel résultat soutient le plus directement une fécondation réussie ?", "La présence de graines contenant un embryon", ["La couleur de la gaze", "La seule ouverture de l’anthère", "Le nombre de sépales"], "L’embryon dérive du zygote formé après fusion des gamètes.", "Interprétation • page 1"],
      ["Quel caractère est commun aux gymnospermes et aux angiospermes ?", "La production de graines", ["La formation d’un fruit par l’ovaire", "La présence obligatoire d’un stigmate", "Un sac embryonnaire toujours identique"], "Ces deux lignées appartiennent aux plantes à graines.", "Portée du titre • page 1"],
      ["Quel enchaînement est correct ?", "Pollinisation → germination du pollen → fécondation", ["Fécondation → pollinisation → méiose", "Fruit → stigmate → pollen", "Méiose → fruit → pollinisation"], "Le pollen doit d’abord être déposé puis former un tube avant les fusions.", "Problème scientifique • page 1"],
      ["Pourquoi répéter l’expérience sur plusieurs fleurs ?", "Pour estimer la variabilité et rendre la conclusion plus robuste", ["Pour changer simultanément plusieurs variables", "Pour supprimer le témoin", "Pour transformer le pollen en ovule"], "Une répétition limite le poids d’un accident individuel.", "Protocole corrigé • page 1"],
      ["Quelle affirmation exige une nuance ?", "La double fécondation décrite caractérise toutes les spermaphytes", ["Les angiospermes sont des plantes à graines", "Le pollen précède la formation de graines", "L’ovule appartient au pistil du modèle étudié"], "Le mécanisme embryon + endosperme du cours est celui des angiospermes.", "Correction de portée • page 1"],
    ], short("Nomme le groupe des plantes à fleurs.", ["angiospermes", "les angiospermes", "angiosperme"], "Les angiospermes possèdent des fleurs et des ovules enfermés dans un ovaire.", "Portée botanique • page 1")),
    corrections: [
      "La double fécondation embryon-endosperme, l’ovaire et le fruit sont attribués aux angiospermes plutôt qu’à toutes les spermaphytes.",
      "La gaze seule n’est pas considérée comme un témoin suffisant : autopollinisation, compatibilité et répétitions sont contrôlées.",
      "Pollinisation, germination du pollen et fécondation sont séparées en trois événements distincts.",
      "La présence d’un fruit n’est pas tenue pour une preuve absolue de fécondation à cause de la parthénocarpie possible.",
    ],
  },
  {
    id: "anther-pollen-sacs-dehiscence",
    title: "Explorer l’anthère et ses sacs polliniques",
    summary: "Identifier les tissus d’une anthère jeune, le rôle du tapetum et le mécanisme de déhiscence qui libère le pollen.",
    pages: "1-3",
    section: "Étude d’une anthère — observations, résultats et interprétation",
    durationMinutes: 28,
    xp: 55,
    body: String.raw`
## L’étamine porte les microsporanges

Une étamine comporte généralement un **filet** et une **anthère**. Dans le modèle dessiné page 2, l’anthère présente deux thèques, chacune contenant deux sacs polliniques : quatre **microsporanges** au total. Le connectif central contient notamment un faisceau conducteur.

La paroi d’un sac pollinique jeune comprend plusieurs assises. L’**épiderme** protège l’ensemble. Sous lui, l’**endothèce** — appelé assise mécanique dans le fascicule — développe des épaississements qui participent à l’ouverture. Des couches moyennes transitoires puis le **tapetum** entourent le tissu sporogène. Le tapetum est l’assise nourricière la plus interne ; parler globalement « d’assises nourricières » masque son identité et ses fonctions.

Au centre se trouvent les cellules mères des microspores, diploïdes. Elles appartiennent encore à la génération sporophytique de la plante. Le pollen haploïde ne préexiste donc pas dans une anthère jeune : il résulte d’une méiose suivie d’une différenciation.

## De l’anthère fermée à l’anthère ouverte

À maturité, la dessiccation et les épaississements différentiels de l’endothèce créent des tensions. La zone appelée **stomium** ou fente de déhiscence se rompt, ouvrant chaque thèque et libérant le pollen. Le document dit que « l’assise mécanique se rompt suivant la fente » ; il est plus exact de dire que l’endothèce contribue aux contraintes et que la rupture se produit dans le stomium spécialisé.

La déhiscence ne doit pas être confondue avec la pollinisation. Elle libère le pollen depuis l’anthère ; la pollinisation le transporte ensuite vers une surface femelle réceptrice.

## Lire une coupe sans apprendre une image par cœur

On repère d’abord la symétrie générale et le connectif central, puis les quatre loges. Dans chaque loge, on progresse de l’extérieur vers l’intérieur : épiderme, endothèce, couches moyennes, tapetum, contenu sporogène. À maturité, plusieurs couches régressent et la loge contient des grains de pollen différenciés.

La page 3 nomme « tissus foliaires » l’épiderme, le parenchyme et le faisceau. Cette expression est impropre ici : ce sont des **tissus sporophytiques de l’anthère**, pas une feuille autonome. Le faisceau est libéro-ligneux, mais l’appellation moderne xylème-phloème suffit.

> **Astuce mémoire — E-E-T :** **É**piderme dehors, **e**ndothèce mécanique, **t**apetum au contact des microspores.
`,
    keyPoint: "Une anthère typique possède quatre sacs polliniques ; tapetum et endothèce ont des rôles différents, puis le stomium s’ouvre et libère le pollen.",
    example: "Sur une coupe, la loge remplie de cellules mères est un microsporange jeune ; une loge ouverte remplie de pollen signale la déhiscence.",
    methodSteps: [
      "Situer connectif et faisceau au centre de l’anthère.",
      "Compter les sacs polliniques et suivre leur paroi de dehors en dedans.",
      "Distinguer tapetum nourricier et endothèce mécanique.",
      "Relier dessiccation, tensions de paroi, stomium et libération du pollen.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original à annoter",
      title: "Coupe d’une anthère tétrasporangiée",
      instruction: "Sélectionne les six repères et distingue paroi, tissu nourricier, contenu sporogène et zone d’ouverture.",
      viewBox: "0 0 720 440",
      caption: "Reconstruction pédagogique originale des documents 1 et 2 ; aucun schéma scanné n’est republié.",
      shapes: antherShapes,
      hotspots: antherHotspots,
      observation: "Le tapetum accompagne la formation du pollen dans chaque sac ; l’endothèce et le stomium interviennent surtout lors de l’ouverture de l’anthère.",
    },
    questions: questions(9, [
      ["Combien de sacs polliniques montre l’anthère typique du document ?", "Quatre", ["Un", "Deux seulement", "Huit obligatoirement"], "Deux thèques contiennent chacune deux microsporanges.", "Documents 1 et 2 • page 2"],
      ["Quel tissu est l’assise nourricière interne du microsporange ?", "Le tapetum", ["Le xylème", "Le stigmate", "Le micropyle"], "Le tapetum borde le tissu sporogène et soutient les microspores.", "Analyse corrigée • page 3"],
      ["À quoi correspond l’assise mécanique du fascicule ?", "À l’endothèce", ["Au sac embryonnaire", "À l’oosphère", "À l’albumen"], "L’endothèce développe des épaississements impliqués dans la déhiscence.", "Document 1 • pages 2-3"],
      ["Où se trouvent les cellules mères du pollen ?", "Dans les sacs polliniques de l’anthère jeune", ["Dans le fruit mûr", "Dans le tube pollinique", "Dans les téguments de l’ovule"], "Elles occupent le tissu sporogène des microsporanges.", "Document 1 • page 2"],
      ["Quel tissu conduit l’eau et les assimilats dans le connectif ?", "Le faisceau conducteur", ["Le stomium", "L’exine", "La synergide"], "Le faisceau libéro-ligneux traverse le connectif.", "Document 1 • page 2"],
      ["Que désigne la déhiscence de l’anthère ?", "Son ouverture et la libération du pollen", ["La fusion des gamètes", "La formation du sac embryonnaire", "La germination de la graine"], "La fente s’ouvre à maturité.", "Analyse • page 3"],
      ["Quelle zone se rompt directement lors de l’ouverture ?", "Le stomium ou fente de déhiscence", ["Le nucelle", "Le hile", "La chalaze"], "Le stomium est une zone spécialisée de rupture.", "Document 1 corrigé • pages 2-3"],
      ["Pourquoi l’expression « tissus foliaires » est-elle corrigée ?", "L’anthère possède des tissus sporophytiques mais n’est pas décrite comme une feuille autonome", ["Le pollen est un animal", "L’épiderme n’existe pas", "Le faisceau appartient à l’embryon"], "La formulation source amalgame origine morphologique et description tissulaire.", "Analyse • page 3"],
      ["Quel événement suit logiquement la déhiscence ?", "Le transport du pollen lors de la pollinisation", ["La méiose de l’oosphère", "La formation immédiate du fruit sans pollen", "La disparition de l’ovaire"], "Le pollen libéré doit encore atteindre une surface réceptrice.", "Conclusion partielle • page 3"],
    ], short("Nomme l’ouverture spécialisée d’une anthère mature.", ["stomium", "le stomium", "fente de déhiscence", "la fente de déhiscence"], "Le stomium est la ligne de rupture libérant le pollen.", "Document 1 • page 2")),
    corrections: [
      "Les « tissus foliaires » de la page 3 sont reformulés en tissus sporophytiques de l’anthère.",
      "L’assise nourricière est identifiée au tapetum et l’assise mécanique à l’endothèce.",
      "La rupture est localisée au stomium ; l’endothèce crée les contraintes mais ne constitue pas à lui seul la fente.",
      "Déhiscence de l’anthère et pollinisation sont explicitement distinguées.",
    ],
  },
  {
    id: "microsporogenesis-pollen-grain",
    title: "Former et lire un grain de pollen",
    summary: "Suivre méiose, tétrade et mitose pollinique en conservant la ploïdie et la diversité des pollens bicellulaires ou tricellulaires.",
    pages: "2-3 et 7",
    section: "Formation et structure du grain de pollen ; exercices 2 et 3",
    durationMinutes: 30,
    xp: 65,
    body: String.raw`
## De la cellule mère à quatre microspores

Dans chaque sac pollinique, une cellule mère des microspores est diploïde. Les deux divisions de méiose ne donnent pas simplement « deux cellules puis le pollen » : elles produisent quatre cellules haploïdes réunies temporairement en **tétrade**.

$$\text{cellule mère }(2n)\xrightarrow{\text{méiose}}\text{tétrade de quatre microspores }(n)$$

Le mot **tétrade** décrit le groupe ; chaque cellule est une **microspore**. L’exercice 2 emploie « tétraspores », terme ambigu dans ce contexte. On ordonne donc : cellule mère, tétrade de microspores, microspores séparées, pollen bicellulaire ou tricellulaire selon l’espèce.

## La première mitose pollinique

Chaque microspore réalise une mitose asymétrique. Elle donne une grande **cellule végétative**, qui construira le tube pollinique, et une petite **cellule génératrice** ou reproductrice. Les deux noyaux restent haploïdes, car une mitose ne change pas la ploïdie.

Le fascicule présente un grain libéré avec noyau végétatif et noyau reproducteur : c’est le modèle du pollen **bicellulaire**. Chez de nombreuses angiospermes, la cellule génératrice se divise ensuite dans le tube et donne deux spermatozoïdes végétaux. Chez d’autres, cette division a lieu avant la dispersion et le pollen est déjà **tricellulaire**. Le schéma source est donc un modèle fréquent, pas une règle universelle.

## Deux parois spécialisées

L’**exine** est la paroi externe résistante, riche en sporopollénine. L’**intine** est la paroi interne plus souple, à partir de laquelle émerge le tube au niveau d’une aperture. La page 3 décrit l’exine comme épaisse, épineuse et percée de pores. Épaisseur, ornementation et nombre d’apertures varient fortement : tous les pollens ne sont pas épineux.

Le pollen n’est pas un gamète isolé. C’est le **gamétophyte mâle** très réduit qui porte ou produira les deux gamètes mâles. Dans l’exercice 3, dire que le « grain de pollen est haploïde » signifie que ses noyaux gamétophytiques portent chacun un lot chromosomique $n$.

## Répondre aux exercices de classement

L’ordre demandé page 7 est :

1. cellule mère des microspores $2n$ ;
2. tétrade de quatre microspores $n$ ;
3. séparation des microspores $n$ ;
4. première mitose et pollen bicellulaire $n$.

Pour la ploïdie : cellule mère $2n$ ; mégaspore, microspores de la tétrade et cellules du pollen $n$. La mégaspore appartient à la lignée femelle mais l’exercice la mélange volontairement aux éléments mâles pour vérifier le raisonnement.

> **Astuce mémoire :** **Méiose divise la ploïdie ; mitose multiplie les cellules sans la changer.**
`,
    keyPoint: "Une cellule mère 2n subit la méiose et donne quatre microspores n ; chaque microspore devient un gamétophyte mâle bicellulaire ou tricellulaire selon le moment de la division génératrice.",
    example: "Si une cellule mère possède 2n = 24 chromosomes, chaque microspore puis chaque noyau du pollen en possède n = 12.",
    methodSteps: [
      "Écrire la ploïdie de la cellule mère avant toute division.",
      "Associer méiose à quatre produits haploïdes réunis en tétrade.",
      "Associer mitose pollinique à cellule végétative et cellule génératrice.",
      "Identifier exine, intine et aperture sans généraliser l’ornementation.",
    ],
    interaction: timeline(
      "Dérouler la microsporogenèse et la microgamétogenèse",
      "Avance étape par étape et annonce à chaque fois division, nombre de produits et ploïdie.",
      [
        { label: "Cellule mère 2n", shortLabel: "Mère", detail: "Cellule sporophytique située dans le sac pollinique." },
        { label: "Méiose I puis II", shortLabel: "Méiose", detail: "Deux divisions produisent quatre noyaux puis quatre cellules haploïdes." },
        { label: "Tétrade de microspores n", shortLabel: "Tétrade", detail: "Quatre microspores sont momentanément réunies dans la paroi de la cellule mère." },
        { label: "Microspores séparées", shortLabel: "Séparation", detail: "Chaque microspore croît, construit exine et intine et se polarise." },
        { label: "Mitose asymétrique", shortLabel: "Mitose", detail: "Une cellule végétative volumineuse et une cellule génératrice plus petite se différencient." },
        { label: "Deux gamètes mâles", shortLabel: "Gamètes", detail: "La cellule génératrice se divise avant ou après la dispersion selon l’espèce." },
      ],
      "Le passage 2n → n est produit uniquement par la méiose ; toutes les mitoses suivantes conservent n.",
    ),
    questions: questions(18, [
      ["Quelle division forme les quatre microspores ?", "La méiose", ["Une simple croissance", "La fécondation", "La déhiscence"], "Les deux divisions méiotiques réduisent la ploïdie.", "Figure 1 • page 2"],
      ["Comment nommer le groupe temporaire de quatre microspores ?", "Une tétrade", ["Un zygote", "Un endosperme", "Un ovaire"], "Les quatre produits de méiose restent d’abord groupés.", "Figure 1 • page 2"],
      ["Quelle est la ploïdie d’une cellule mère des microspores ?", "Diploïde 2n", ["Haploïde n", "Triploïde 3n", "Toujours tétraploïde 4n"], "Elle appartient au sporophyte de l’anthère.", "Exercice 3 • page 7"],
      ["Quelle est la ploïdie d’une microspore normale ?", "Haploïde n", ["Diploïde 2n", "Triploïde 3n", "Sans chromosomes"], "La méiose a réduit le nombre de lots chromosomiques.", "Exercice 3 • page 7"],
      ["Que produit la première mitose d’une microspore ?", "Une cellule végétative et une cellule génératrice", ["Deux ovaires", "Un zygote et un fruit", "Quatre cellules mères"], "La division est asymétrique.", "Figure 1 et analyse • pages 2-3"],
      ["Quel noyau pilote surtout la croissance du tube ?", "Le noyau végétatif", ["Le noyau de l’oosphère", "Le noyau de l’endosperme", "Le noyau antipodal"], "La cellule végétative construit le tube pollinique.", "Structure du pollen • pages 2-3"],
      ["Quel constituant forme la paroi externe résistante du pollen ?", "L’exine", ["L’intine", "Le nucelle", "Le funicule"], "L’exine est riche en sporopollénine.", "Figure 2 • page 2"],
      ["D’où émerge le tube pollinique ?", "D’une aperture où l’intine se prolonge", ["Du hile de la graine mûre", "De la chalaze uniquement", "Du faisceau de l’anthère"], "L’aperture est une zone spécialisée de germination.", "Structure corrigée • pages 2-3"],
      ["Pourquoi tous les pollens ne peuvent-ils pas être dits épineux ?", "L’ornementation de l’exine varie selon les espèces", ["Ils n’ont jamais d’exine", "Le pollen est toujours liquide", "Les épines appartiennent au nucelle"], "Le dessin montre un type d’ornementation, pas une propriété universelle.", "Figure 2 corrigée • page 2"],
      ["Qu’est-ce qu’un grain de pollen au sens biologique ?", "Un gamétophyte mâle réduit", ["Un gamète mâle unique", "Un embryon diploïde", "Un fruit microscopique"], "Il comprend une cellule végétative et une lignée génératrice.", "Conclusion partielle corrigée • page 3"],
    ], short("Nomme la paroi interne du grain de pollen.", ["intine", "l’intine", "l'intine"], "L’intine est interne à l’exine et participe au tube pollinique.", "Figure 2 • page 2")),
    corrections: [
      "Le stade « tétraspores » de l’exercice 2 est reformulé en tétrade de quatre microspores.",
      "Le pollen à deux cellules est présenté comme un modèle fréquent ; la division génératrice peut avoir lieu avant ou après dispersion.",
      "L’exine n’est pas déclarée universellement épineuse et son nombre d’apertures varie selon l’espèce.",
      "Le grain de pollen est identifié comme gamétophyte mâle et non comme un gamète isolé.",
    ],
  },
  {
    id: "ovary-ovule-anatomy",
    title: "Orienter l’ovaire et l’ovule",
    summary: "Lire une coupe d’ovaire puis un ovule anatrope en distinguant tissus maternels, gamétophyte femelle et ouvertures fonctionnelles.",
    pages: "3-5",
    section: "Étude de l’ovaire et structure de l’ovule",
    durationMinutes: 29,
    xp: 70,
    body: String.raw`
## Du carpelle à la loge ovarienne

Le **pistil** ou gynécée est formé d’un ou plusieurs carpelles. Dans la coupe transversale de la page 4, les carpelles sont soudés et délimitent des **loges ovariennes**. Les **placentas** portent les ovules. Leur position sert à décrire la placentation, mais le dessin ne suffit pas à imposer la même organisation à toutes les fleurs.

Un ovaire appartient à la génération sporophytique diploïde de la plante. Sa paroi formera généralement le péricarpe du fruit après fécondation, tandis que chaque ovule fécondé devient une graine. Ovaire et ovule ne sont donc pas synonymes.

## Le plan d’un ovule anatrope

Le document montre un ovule **anatrope**, courbé de sorte que le micropyle se trouve près de la zone d’attache. Le **funicule** relie l’ovule au placenta. Son point d’insertion définit le **hile** ; lorsque le funicule est soudé latéralement au corps de l’ovule, il forme un **raphé**. Le raphé n’existe donc pas sur tous les types d’ovules, précision que la page 4 indique déjà partiellement.

La **chalaze** est le pôle où nucelle et téguments se rejoignent, à l’opposé du micropyle. Les deux téguments, historiquement appelés primine et secondine, entourent le **nucelle** sans se fermer complètement : leur ouverture est le **micropyle**. Après la fécondation, ces téguments maternels contribueront aux enveloppes de la graine.

Au cœur du nucelle se développe le **sac embryonnaire**, gamétophyte femelle haploïde très réduit. Le nucelle et les téguments sont diploïdes car ils appartiennent au sporophyte maternel ; les noyaux du sac dérivent au contraire d’une mégaspore haploïde.

## Ne pas confondre position et devenir

Le micropyle n’est pas le hile. Le hile est une zone d’attache ; le micropyle est un canal entre les téguments. Le raphé est une crête de soudure propre notamment aux ovules anatropes. La chalaze se situe à l’autre pôle et assure la continuité des tissus.

$$\text{placenta}\rightarrow\text{funicule}\rightarrow\text{ovule}$$

$$\text{téguments}\supset\text{nucelle}\supset\text{sac embryonnaire}$$

Ces inclusions aident à retrouver les structures même lorsque l’orientation du schéma change.

> **Précision terminologique.** « Primine » et « secondine » sont des termes historiques ; tégument externe et tégument interne sont plus directs.

> **Astuce mémoire :** **Mi**cropyle = **mi**ni-ouverture ; **hi**le = point où le funicule **hi**sse l’ovule au placenta.
`,
    keyPoint: "Dans un ovule anatrope, funicule, hile et raphé décrivent l’attache ; téguments, nucelle et sac embryonnaire s’emboîtent ; le micropyle ouvre le pôle opposé à la chalaze.",
    example: "Un repère placé dans la petite interruption des téguments indique le micropyle, non le hile ; le sac embryonnaire est inclus dans le nucelle.",
    methodSteps: [
      "Repérer d’abord placenta, loge et funicule sur la coupe d’ovaire.",
      "Trouver le micropyle par l’interruption des téguments.",
      "Situer la chalaze au pôle opposé et suivre hile puis raphé.",
      "Attribuer la ploïdie sporophytique aux tissus maternels et n au gamétophyte.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original à annoter",
      title: "Lire un ovule anatrope",
      instruction: "Sélectionne les huit repères et explique pour chacun position, appartenance tissulaire et devenir.",
      viewBox: "0 0 760 460",
      caption: "Reconstruction pédagogique originale des documents 3 et 4 ; aucune figure scannée n’est republiée.",
      shapes: ovuleShapes,
      hotspots: ovuleHotspots,
      observation: "Le sac embryonnaire est un petit gamétophyte inclus dans des tissus maternels diploïdes ; le tube pollinique l’atteindra par le micropyle.",
    },
    questions: questions(28, [
      ["Quelle structure porte directement les ovules dans l’ovaire ?", "Le placenta", ["L’exine", "Le tapetum", "L’endothèce"], "Les ovules sont attachés aux placentas par leur funicule.", "Document 3 • page 4"],
      ["Comment nommer la cavité délimitée par un carpelle ?", "Une loge ovarienne", ["Un sac pollinique", "Un tube pollinique", "Un stomium"], "La coupe montre plusieurs loges car les carpelles sont soudés.", "Document 3 • page 4"],
      ["Quel élément relie l’ovule au placenta ?", "Le funicule", ["Le micropyle", "L’oosphère", "L’exine"], "Le funicule est le pédicelle de l’ovule.", "Document 3 • page 4"],
      ["Que désigne le hile ?", "La zone d’attache du funicule à l’ovule", ["L’ouverture entre les téguments", "Le pôle des antipodes", "La paroi du pollen"], "Après maturation, cette attache laisse une cicatrice sur la graine.", "Coupe d’ovule • page 4"],
      ["Dans quel type d’ovule le raphé est-il particulièrement attendu ?", "Un ovule anatrope", ["Un grain de pollen", "Un fruit parthénocarpique", "Une anthère déhiscente"], "La courbure rapproche le funicule et le corps de l’ovule.", "Analyse • page 4"],
      ["Quelle structure laisse un passage à travers les téguments ?", "Le micropyle", ["La chalaze", "Le connectif", "Le tapetum"], "Le tube pollinique emprunte généralement cette ouverture.", "Document 3 • page 4"],
      ["Quel tissu entoure directement le sac embryonnaire dans le modèle ?", "Le nucelle", ["L’endosperme mûr", "Le péricarpe", "Le stigmate"], "Le gamétophyte femelle se développe dans le nucelle.", "Documents 3 et 4 • pages 4-5"],
      ["Quel pôle est opposé au micropyle ?", "La chalaze", ["Le stomium", "Le hile réel uniquement", "Le noyau végétatif"], "La chalaze est la zone de continuité des téguments et du nucelle.", "Document 3 • page 4"],
      ["Quelle partie de l’ovaire contribue au fruit ?", "La paroi ovarienne", ["Le noyau végétatif du pollen", "Les synergides seules", "Le tapetum"], "Elle forme généralement le péricarpe.", "Interprétation corrigée • pages 5-6"],
    ], short("Nomme le gamétophyte femelle contenu dans l’ovule.", ["sac embryonnaire", "le sac embryonnaire", "gamétophyte femelle"], "Le sac embryonnaire dérive de la mégaspore fonctionnelle.", "Conclusion partielle • page 5")),
    corrections: [
      "Hile, micropyle, raphé et chalaze sont séparés fonctionnellement au lieu d’être appris comme une simple liste.",
      "Le raphé est limité au plan d’un ovule anatrope et n’est pas présenté comme universel.",
      "Primine et secondine sont modernisés en téguments externe et interne.",
      "Ovaire, ovule et sac embryonnaire sont distingués ainsi que leur appartenance sporophytique ou gamétophytique.",
    ],
  },
  {
    id: "megasporogenesis-embryo-sac",
    title: "Construire le sac embryonnaire",
    summary: "Suivre méiose femelle, sélection de la mégaspore, trois mitoses et organisation du sac de type Polygonum sans en faire un modèle universel.",
    pages: "4-5 et 7",
    section: "Formation et organisation du sac embryonnaire ; exercices 1 et 3",
    durationMinutes: 31,
    xp: 80,
    body: String.raw`
## La mégasporogenèse

Dans le nucelle se différencie une **cellule mère des mégaspores** diploïde. Sa méiose produit quatre mégaspores haploïdes. Dans le modèle présenté, trois dégénèrent et une seule devient la **mégaspore fonctionnelle**.

$$\text{cellule mère }(2n)\xrightarrow{\text{méiose}}4\ \text{mégaspores }(n)\longrightarrow1\ \text{mégaspore fonctionnelle}$$

Cette première phase est la mégasporogenèse. Le fascicule l’appelle formation de quatre cellules haploïdes puis sélection d’une « macrospore ou mégaspore ». Le terme actuel le plus courant est **mégaspore**.

## Trois mitoses, huit noyaux

La mégaspore fonctionnelle réalise trois mitoses nucléaires successives. Le nombre de noyaux double à chaque fois : $1\rightarrow2\rightarrow4\rightarrow8$. Après migration et cellularisation, le sac embryonnaire classique de type **Polygonum** comporte sept cellules et huit noyaux :

- au pôle micropylaire, une **oosphère** entourée de deux **synergides** ;
- au pôle chalazien, trois **antipodes** ;
- au centre, une grande **cellule centrale** contenant deux noyaux polaires, souvent fusionnés avant la fécondation.

Le décompte sept cellules / huit noyaux vient donc de la cellule centrale : une seule cellule y contient deux noyaux. Les synergides participent au guidage et à la réception du tube pollinique. Les fonctions et la persistance des antipodes varient.

## Un modèle dominant, pas unique

Le texte conclut que « l’ovule renferme le sac embryonnaire qui comporte huit noyaux répartis en sept cellules ». C’est le modèle majoritaire enseigné, mais les angiospermes possèdent d’autres types de sacs embryonnaires. On répond selon le document tout en signalant cette portée.

L’oosphère est le gamète femelle haploïde. La cellule centrale est l’autre partenaire femelle de la double fécondation au sens cellulaire : elle fusionne avec le second gamète mâle et forme le noyau primaire de l’endosperme. Les antipodes et synergides ne deviennent pas directement l’embryon.

## Corriger l’exercice de ploïdie

La mégaspore est haploïde $n$, comme les noyaux issus de ses mitoses. Avant fusion des noyaux polaires, chacun vaut $n$. Leur réunion forme un noyau central $2n$ dans le type classique. La cellule centrale fécondée reçoit encore un lot paternel $n$ :

$$n+(n+n)=3n$$

L’endosperme habituel est donc triploïde, tandis que le zygote issu de l’oosphère vaut $n+n=2n$.

> **Astuce mémoire — 3-2-1 :** trois antipodes, deux synergides, une oosphère ; ajoute une cellule centrale à deux noyaux.
`,
    keyPoint: "Une cellule mère 2n donne quatre mégaspores n ; une mégaspore fonctionnelle réalise trois mitoses et produit le sac de type Polygonum à sept cellules et huit noyaux.",
    example: "Le sac contient 3 antipodes + 2 synergides + 1 oosphère + 1 cellule centrale = 7 cellules, mais la cellule centrale porte 2 noyaux : total 8.",
    methodSteps: [
      "Séparer mégasporogenèse méiotique et mégagamétogenèse mitotique.",
      "Conserver n après les trois mitoses de la mégaspore.",
      "Orienter pôle micropylaire, centre et pôle chalazien.",
      "Compter cellules et noyaux séparément puis annoncer la portée du modèle.",
    ],
    interaction: timeline(
      "Dérouler la formation du sac embryonnaire",
      "Sélectionne chaque étape puis annonce division, ploïdie, nombre de noyaux et organisation spatiale.",
      [
        { label: "Cellule mère 2n", shortLabel: "Mère", detail: "Méiosite femelle différenciée dans le nucelle de l’ovule." },
        { label: "Quatre mégaspores n", shortLabel: "Méiose", detail: "La méiose réduit la ploïdie et produit une tétrade de mégaspores." },
        { label: "Une mégaspore fonctionnelle", shortLabel: "Sélection", detail: "Dans le modèle, trois mégaspores dégénèrent et une poursuit le développement." },
        { label: "Deux puis quatre noyaux", shortLabel: "Mitoses 1-2", detail: "Les noyaux migrent vers les deux pôles du futur sac." },
        { label: "Huit noyaux", shortLabel: "Mitose 3", detail: "Quatre noyaux occupent chaque pôle avant l’organisation finale." },
        { label: "Sept cellules", shortLabel: "Cellularisation", detail: "Oosphère, deux synergides, trois antipodes et cellule centrale à deux noyaux." },
      ],
      "Les trois mitoses expliquent huit noyaux ; la cellularisation explique pourquoi ces huit noyaux n’occupent que sept cellules.",
    ),
    questions: questions(37, [
      ["Où se situe la cellule mère des mégaspores ?", "Dans le nucelle de l’ovule", ["Dans l’exine", "Dans le connectif de l’anthère", "Dans le péricarpe mûr"], "La lignée femelle commence dans le tissu nucellaire.", "Document 4 et interprétation • pages 4-5"],
      ["Combien de mégaspores la méiose produit-elle dans le modèle ?", "Quatre", ["Une seule immédiatement", "Deux diploïdes", "Huit triploïdes"], "Les quatre produits sont haploïdes.", "Document 4 • page 4"],
      ["Combien de mégaspores poursuivent généralement le développement présenté ?", "Une", ["Les quatre obligatoirement", "Aucune", "Deux cellules diploïdes"], "Trois dégénèrent dans le type monosporique du document.", "Interprétation • page 5"],
      ["Combien de mitoses réalise la mégaspore fonctionnelle ?", "Trois", ["Une méiose supplémentaire", "Deux fécondations", "Sept"], "Elles produisent successivement 2, 4 puis 8 noyaux.", "Document 4 • pages 4-5"],
      ["Quel ensemble se trouve au pôle micropylaire ?", "L’oosphère et les deux synergides", ["Les trois antipodes uniquement", "Le tapetum et l’endothèce", "Le zygote déjà mûr"], "Ces trois cellules forment l’appareil œuf.", "Interprétation • page 5"],
      ["Quelles cellules occupent le pôle chalazien dans le modèle ?", "Les trois antipodes", ["Les deux spermatozoïdes", "Les cellules du tapetum", "Les quatre microspores"], "Elles sont opposées au micropyle.", "Interprétation • page 5"],
      ["Pourquoi compte-t-on huit noyaux mais sept cellules ?", "La cellule centrale contient deux noyaux polaires", ["L’oosphère n’a pas de noyau", "Chaque synergide vaut deux cellules", "Le nucelle disparaît"], "Une cellule centrale porte les deux noyaux supplémentaires.", "Conclusion partielle • page 5"],
      ["Quelle est la ploïdie de l’oosphère avant fécondation ?", "Haploïde n", ["Diploïde 2n", "Triploïde 3n", "Tétraploïde 4n"], "Elle dérive par mitoses d’une mégaspore n.", "Organisation du sac • page 5"],
      ["Quel rôle majeur ont les synergides ?", "Guider et accueillir le tube pollinique", ["Former directement le péricarpe", "Produire l’exine", "Devenir les étamines"], "Elles participent au signal d’attraction et à la libération des gamètes.", "Précision du sac • page 5"],
      ["Quelle portée donner au sac à sept cellules et huit noyaux ?", "C’est le type Polygonum dominant, pas l’unique organisation", ["Il est universel chez toutes les plantes", "Il n’existe chez aucune angiosperme", "Il appartient seulement aux animaux"], "Le fascicule présente le modèle classique majoritaire.", "Conclusion corrigée • page 5"],
    ], short("Nomme la mégaspore qui poursuit les mitoses.", ["mégaspore fonctionnelle", "la mégaspore fonctionnelle", "macrospore fonctionnelle"], "Une seule des quatre mégaspores poursuit le développement dans le modèle.", "Interprétation • page 5")),
    corrections: [
      "Le sac à sept cellules et huit noyaux est identifié comme type Polygonum dominant et non comme organisation universelle.",
      "Macrospore est modernisé en mégaspore et mégasporogenèse séparée de la mégagamétogenèse.",
      "La cellule centrale est distinguée des deux noyaux polaires qu’elle contient.",
      "La ploïdie n des noyaux polaires, 2n après leur fusion et 3n après fécondation est explicitée.",
    ],
  },
  {
    id: "pollination-pollen-tube-guidance",
    title: "Faire germer le pollen et guider le tube",
    summary: "Ordonner hydratation, germination, division génératrice et croissance du tube jusqu’au micropyle sans attribuer le mouvement aux gamètes.",
    pages: "5-6 et 8",
    section: "Germination du grain de pollen ; document 5 et figure 1 de l’exercice 4",
    durationMinutes: 30,
    xp: 90,
    body: String.raw`
## Du stigmate au tissu conducteur

Après une pollinisation compatible, le grain de pollen adhère au **stigmate**, s’hydrate et reprend son métabolisme. L’intine fait saillie à travers une aperture de l’exine et forme le **tube pollinique**. La cellule végétative contrôle cette croissance polarisée.

Le tube traverse le stigmate puis le style dans des tissus conducteurs. Il gagne l’ovaire, suit le funicule et s’oriente vers le micropyle sous l’effet d’échanges chimiques avec les tissus femelles. La croissance n’est donc pas une simple chute mécanique.

## Deux gamètes transportés, non nageurs

Dans le modèle bicellulaire du document, le noyau reproducteur se divise pendant la croissance du tube et forme deux gamètes mâles. La page 6 les nomme **anthérozoïdes**. Chez les angiospermes, ce sont des spermatozoïdes végétaux non flagellés et non mobiles par eux-mêmes : le tube les livre au sac embryonnaire.

Le noyau végétatif peut précéder la lignée génératrice dans le tube et dégénère après avoir rempli sa fonction. L’important n’est pas de mémoriser une distance rigide entre les noyaux, mais de comprendre la coopération entre cellule végétative et gamètes.

## Atteindre l’appareil œuf

À proximité de l’ovule, le tube emprunte généralement le micropyle. Il pénètre dans une synergide réceptrice et éclate, libérant les deux spermatozoïdes. Les deux cellules femelles partenaires sont alors :

- l’**oosphère**, qui donnera le zygote ;
- la **cellule centrale**, qui donnera l’endosperme après fécondation.

L’exercice 4 montre en figure 1 un grain germé et son tube. Sa faible résolution rend les flèches ambiguës ; la légende attendue est : **a = tube pollinique**, **b = gamètes mâles**, **c = cellule végétative**, dont le noyau est visible vers la zone de croissance. Le parcours remplace l’image par une séquence originale et explique cette lecture au lieu de republier le scan.

## Compatibilité et réussite

Tous les pollens déposés ne réussissent pas. Compatibilité génétique, réceptivité du stigmate, hydratation, température et signaux de guidage influencent la germination et la progression. Le nombre de grains sur le stigmate ne suffit donc pas à prédire le nombre de graines.

> **Correction de vocabulaire.** Les gamètes mâles des angiospermes sont des spermatozoïdes végétaux non mobiles ; « anthérozoïdes » est conservé uniquement comme terme historique du fascicule.

> **Astuce mémoire — V-G-G :** cellule **v**égétative pour le tube, cellule **g**énératrice pour deux **g**amètes.
`,
    keyPoint: "Le pollen compatible germe sur le stigmate ; sa cellule végétative construit un tube qui livre deux gamètes mâles non mobiles à l’oosphère et à la cellule centrale.",
    example: "Dans la figure 1 de l’exercice 4, a désigne le tube, b les gamètes mâles et c la cellule végétative dont le noyau accompagne la zone de croissance.",
    methodSteps: [
      "Commencer par adhésion et hydratation sur un stigmate compatible.",
      "Faire émerger le tube par une aperture de l’exine.",
      "Suivre le tube dans style, ovaire, funicule puis micropyle.",
      "Terminer par l’éclatement dans une synergide et la libération des deux gamètes.",
    ],
    interaction: timeline(
      "Suivre le long voyage du tube pollinique",
      "Déroule chaque étape et associe-lui structure, acteur cellulaire et destination.",
      [
        { label: "Adhésion et hydratation", shortLabel: "Stigmate", detail: "Un pollen compatible se réhydrate sur une surface réceptrice." },
        { label: "Émergence par l’aperture", shortLabel: "Germination", detail: "L’intine forme un tube tandis que l’exine reste autour du grain." },
        { label: "Croissance dans le style", shortLabel: "Style", detail: "La cellule végétative allonge le tube dans le tissu conducteur." },
        { label: "Deux gamètes mâles", shortLabel: "Division", detail: "La cellule génératrice se divise avant ou pendant cette croissance selon l’espèce." },
        { label: "Guidage vers le micropyle", shortLabel: "Ovule", detail: "Le tube suit les signaux des tissus femelles jusqu’à l’appareil œuf." },
        { label: "Libération dans une synergide", shortLabel: "Arrivée", detail: "Le tube éclate et rend les deux spermatozoïdes disponibles pour les deux fusions." },
      ],
      "Le tube est le système de transport actif ; les spermatozoïdes végétaux ne nagent pas jusqu’à l’oosphère.",
    ),
    questions: questions(47, [
      ["Sur quelle structure le pollen germe-t-il dans le modèle du fascicule ?", "Le stigmate", ["La chalaze", "Le tapetum", "Le péricarpe"], "Le stigmate reçoit, hydrate et sélectionne le pollen.", "Situation et document 5 • pages 1 et 5"],
      ["Quelle paroi se prolonge pour former le tube ?", "L’intine", ["L’exine entière", "Le nucelle", "Le raphé"], "Le tube émerge à travers une aperture.", "Document 5 corrigé • page 5"],
      ["Quelle cellule construit principalement le tube pollinique ?", "La cellule végétative", ["L’oosphère", "Une antipode", "La cellule mère des mégaspores"], "Le gamétophyte mâle possède une composante végétative spécialisée.", "Analyse du document 5 • page 6"],
      ["Que devient la cellule génératrice dans le modèle bicellulaire ?", "Elle se divise en deux gamètes mâles", ["Elle devient le fruit", "Elle forme quatre ovules", "Elle produit le tapetum"], "Sa mitose fournit les deux partenaires mâles.", "Document 5 • pages 5-6"],
      ["Comment se déplacent les gamètes mâles des angiospermes ?", "Ils sont transportés dans le tube pollinique", ["Ils nagent librement avec des flagelles", "Ils voyagent dans le xylème", "Ils sortent par le hile d’une graine"], "Ce sont des spermatozoïdes végétaux non mobiles.", "Correction terminologique • page 6"],
      ["Quel passage emprunte généralement le tube pour entrer dans l’ovule ?", "Le micropyle", ["Le stomium", "Le hile de l’anthère", "L’exine"], "Le micropyle ouvre les téguments près de l’appareil œuf.", "Documents 5-6 • pages 5-6"],
      ["Quelle cellule femelle reçoit typiquement l’extrémité du tube ?", "Une synergide", ["Une antipode uniquement", "Une cellule du tapetum", "Une cellule du péricarpe"], "La synergide participe à l’attraction et à la libération des gamètes.", "Guidage corrigé • pages 5-6"],
      ["Que représente le repère a de la figure 1 de l’exercice 4 ?", "Le tube pollinique", ["Le raphé", "La chalaze", "Le sac pollinique"], "La flèche a vise la longue structure issue du pollen germé.", "Exercice 4, figure 1 • page 8"],
      ["Que représentent ensemble les repères b de la figure reconstruite ?", "Les deux gamètes mâles", ["Deux téguments", "Deux antipodes", "Deux carpelles"], "Deux petits éléments suivent le tube avant les fusions.", "Exercice 4 corrigé • page 8"],
      ["Pourquoi un pollen déposé peut-il ne pas former de graine ?", "Il peut être incompatible ou ne pas atteindre l’ovule", ["Tout pollen forme toujours un fruit", "Il est nécessairement diploïde", "Le micropyle est dans l’anthère"], "La réussite dépend de plusieurs étapes de reconnaissance et de guidage.", "Situation et interprétation corrigées • pages 1, 5-6"],
    ], short("Nomme la cellule du sac embryonnaire qui accueille généralement le tube.", ["synergide", "une synergide", "la synergide"], "Le tube pénètre dans une synergide réceptrice avant de libérer les gamètes.", "Document 6 corrigé • page 6")),
    corrections: [
      "Anthérozoïdes est modernisé en spermatozoïdes végétaux ou gamètes mâles non mobiles chez les angiospermes.",
      "La croissance du tube est attribuée à la cellule végétative et à un guidage tissulaire, non à une nage des gamètes.",
      "La figure 1 peu lisible de l’exercice 4 est reconstruite avec a = tube, b = gamètes et c = cellule végétative, noyau compris.",
      "La compatibilité pollen-pistil est ajoutée pour éviter l’idée que tout pollen déposé produit nécessairement une graine.",
    ],
  },
  {
    id: "double-fertilization-seed-fruit",
    title: "Relier double fécondation, graine et fruit",
    summary: "Expliquer les deux fusions, leurs ploïdies et le devenir distinct de l’ovule, de l’ovaire, du zygote, de l’endosperme et des téguments.",
    pages: "6-7",
    section: "Double fécondation, interprétation et conclusion générale",
    durationMinutes: 32,
    xp: 100,
    body: String.raw`
## Deux gamètes mâles, deux partenaires femelles

Le tube pollinique libère deux spermatozoïdes végétaux dans le sac embryonnaire. Le premier fusionne avec l’**oosphère** haploïde. Il forme un **zygote diploïde** :

$$n+n=2n$$

Le zygote se divisera et donnera l’embryon ainsi que son suspenseur. L’expression source « œuf principal ou œuf embryon » est remplacée par zygote, terme précis pour la cellule issue de cette fusion.

Le second spermatozoïde fusionne avec la **cellule centrale**. Dans le sac classique, celle-ci contient deux noyaux polaires haploïdes déjà réunis ou proches de l’être. Le noyau primaire de l’endosperme est donc généralement triploïde :

$$n+(n+n)=3n$$

Il donnera l’**endosperme**, appelé albumen dans le fascicule. « Œuf accessoire » est un terme historique : la cellule centrale fécondée n’est pas un embryon secondaire.

## Pourquoi parler de double fécondation ?

Il ne s’agit pas d’un spermatozoïde qui féconde deux cellules. Deux gamètes mâles distincts réalisent deux fusions synchronisées : l’un avec l’oosphère, l’autre avec la cellule centrale. L’ensemble est la **double fécondation** caractéristique des angiospermes.

La dernière phrase de la page 7 l’attribue à toutes les spermaphytes. On corrige la portée : chez les gymnospermes, le tissu nourricier préexiste généralement à la fécondation ; certains groupes possèdent des phénomènes doubles particuliers, mais pas le système angiosperme zygote + endosperme décrit ici.

## Les devenirs coordonnés

Après la double fécondation :

- le zygote $2n$ devient l’**embryon** ;
- la cellule centrale fécondée devient l’**endosperme**, souvent $3n$ ;
- les téguments maternels de l’ovule deviennent les enveloppes de la graine ;
- l’**ovule** devient une graine ;
- la paroi de l’**ovaire** devient principalement le péricarpe du fruit.

L’ovaire ne devient pas un fruit parce qu’il « emmagasine toujours les réserves ». Sa croissance et sa différenciation sont déclenchées par des signaux de développement. Certains fruits incorporent aussi d’autres pièces florales : on parle de fruits accessoires.

L’endosperme peut rester volumineux dans la graine mûre, comme chez le maïs, ou être largement consommé par l’embryon, comme chez de nombreux haricots, dont les cotylédons stockent les réserves. Toutes les graines ne sont donc pas « albuminées » à maturité.

## Une graine associe trois origines

La graine combine au moins :

1. un embryon à origine maternelle et paternelle ;
2. un endosperme issu de la seconde fusion, de ploïdie souvent $3n$ ;
3. des enveloppes à origine maternelle diploïde.

Ce mélange d’origines explique pourquoi « la graine vient de la fécondation » est vrai globalement mais insuffisant : toutes ses parties ne proviennent pas du même événement ni du même génome.

> **Astuce mémoire — O-O :** **o**osphère → embry**o**n ; cellule centrale → réserves d’endosperme.
`,
    keyPoint: "Chez une angiosperme, un gamète mâle + oosphère donne le zygote 2n ; l’autre + cellule centrale donne l’endosperme généralement 3n ; l’ovule devient graine et l’ovaire contribue au fruit.",
    example: "Dans un sac à deux noyaux polaires n, la première fusion vaut n+n=2n et la seconde n+n+n=3n.",
    methodSteps: [
      "Identifier les deux gamètes mâles livrés par le même tube.",
      "Associer oosphère au zygote puis cellule centrale à l’endosperme.",
      "Calculer séparément 2n et 3n sans confondre les produits.",
      "Relier tissus de l’ovule à la graine et paroi ovarienne au fruit.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original à annoter",
      title: "Les deux fusions dans le sac embryonnaire",
      instruction: "Sélectionne les huit repères puis raconte les deux fusions et le devenir de leurs produits.",
      viewBox: "0 0 760 460",
      caption: "Représentation pédagogique originale du document 6 ; aucun schéma du PDF n’est republié.",
      shapes: fertilizationShapes,
      hotspots: fertilizationHotspots,
      observation: "La double fécondation crée deux lignées différentes : embryon diploïde et endosperme généralement triploïde.",
    },
    questions: questions(57, [
      ["Avec quelle cellule fusionne le premier gamète mâle ?", "L’oosphère", ["Une antipode", "Le tapetum", "L’endothèce"], "Cette fusion forme le zygote.", "Document 6 • page 6"],
      ["Avec quelle cellule fusionne le second gamète mâle ?", "La cellule centrale", ["Le funicule", "Le péricarpe mûr", "Le stomium"], "La cellule centrale contient les noyaux polaires.", "Document 6 • page 6"],
      ["Quelle est la ploïdie habituelle du zygote ?", "Diploïde 2n", ["Haploïde n", "Triploïde 3n", "Sans noyau"], "Un gamète n fusionne avec l’oosphère n.", "Analyse • page 6"],
      ["Quelle est la ploïdie habituelle du noyau primaire de l’endosperme ?", "Triploïde 3n", ["Diploïde 2n seulement", "Haploïde n", "Toujours 4n"], "Le gamète n rejoint deux noyaux polaires n+n.", "Analyse • page 6"],
      ["Que devient principalement le zygote ?", "L’embryon", ["Le péricarpe", "L’exine", "Le stigmate"], "Ses divisions construisent l’embryon et le suspenseur.", "Interprétation • page 6"],
      ["Que devient la cellule centrale fécondée ?", "L’endosperme", ["Le tube pollinique", "Le raphé", "La paroi de l’anthère"], "Elle initie le tissu nourricier de la graine.", "Interprétation • page 6"],
      ["Que deviennent les téguments de l’ovule ?", "Les enveloppes de la graine", ["Les étamines", "Le pollen", "Le stigmate"], "Ils sont des tissus maternels diploïdes.", "Interprétation corrigée • page 6"],
      ["Quel organe devient une graine ?", "L’ovule", ["L’anthère", "Le filet", "Le stigmate"], "L’ovule renferme embryon, endosperme variable et téguments.", "Conclusion générale • page 6"],
      ["Quel organe contribue principalement au fruit ?", "L’ovaire", ["Le grain de pollen", "La synergide", "Le sac pollinique"], "Sa paroi devient généralement le péricarpe.", "Conclusion générale • page 6"],
      ["À quel groupe attribuer le mécanisme zygote + endosperme du cours ?", "Aux angiospermes", ["À tous les animaux", "À toutes les mousses", "À toutes les spermaphytes sans nuance"], "Ce type de double fécondation est un caractère des plantes à fleurs.", "Conclusion corrigée • page 7"],
      ["Pourquoi toutes les graines mûres ne sont-elles pas dites albuminées ?", "L’endosperme peut être consommé et les réserves transférées aux cotylédons", ["Aucune graine ne contient de réserves", "Le zygote devient toujours un fruit", "Les téguments disparaissent avant fécondation"], "La persistance de l’endosperme varie selon l’espèce.", "Interprétation corrigée • pages 6-7"],
    ], short("Nomme le tissu issu de la fécondation de la cellule centrale.", ["endosperme", "l’endosperme", "albumen", "l’albumen"], "Le terme actuel endosperme correspond à l’albumen du fascicule.", "Document 6 • page 6")),
    corrections: [
      "La double fécondation zygote-endosperme est attribuée aux angiospermes, non indistinctement à toutes les spermaphytes.",
      "Œuf principal et œuf accessoire sont modernisés en zygote et cellule centrale fécondée ou noyau primaire de l’endosperme.",
      "La triploïdie habituelle de l’endosperme est démontrée par n + n + n au lieu d’être seulement affirmée.",
      "Le fruit n’est pas expliqué par un simple stockage de réserves ; péricarpe et fruits accessoires sont distingués.",
      "La persistance variable de l’endosperme dans les graines mûres est explicitée.",
    ],
  },
  {
    id: "official-vocabulary-order-ploidy",
    title: "Résoudre les exercices officiels 1 à 3",
    summary: "Compléter le texte, ordonner la formation du pollen et relier chaque cellule à sa ploïdie avec une correction explicitée.",
    pages: "7",
    section: "Évaluations — exercices 1, 2 et 3",
    durationMinutes: 31,
    xp: 115,
    kind: "practice",
    body: String.raw`
## Exercice 1 — compléter sans perdre la grammaire

La banque proposée contient : « l’ovule ; anthère jeune ; cellule mère ; sacs polliniques ; oosphère ; binucléée ; antipodes ». Les réponses attendues sont :

1. **anthères jeunes** ;
2. **sacs polliniques** ;
3. **l’ovule** ;
4. **cellule mère** ;
5. **oosphère** ;
6. **antipodes** ;
7. **binucléée**.

Le texte reconstitué devient :

« Les grains de pollen se forment dans les **anthères jeunes** et sont stockés dans les **sacs polliniques** des anthères mûres. Les ovules se trouvent dans l’ovaire du pistil. Le sac embryonnaire se forme dans **l’ovule**, à partir d’une **cellule mère**, et il comporte sept cellules : une **oosphère**, deux synergides, trois **antipodes** et une cellule centrale **binucléée**. »

La liste donne « anthère jeune » au singulier alors que la phrase exige le pluriel. On accorde la réponse. Le scan peut faire lire « blnucléée » ; le mot correct est **binucléée**, c’est-à-dire contenant deux noyaux polaires.

## Exercice 2 — remettre les étapes dans l’ordre

Les numéros fournis sont :

- 1 : grains de pollen ;
- 2 : cellule mère des grains de pollen ;
- 3 : « tétraspores » ;
- 4 : stade à deux cellules.

L’ordre demandé est **2 → 3 → 4 → 1**. Scientifiquement, on précise que 3 représente la **tétrade de microspores**, et que le stade à deux cellules correspond déjà à un pollen bicellulaire en maturation. La catégorie 1 désigne les grains prêts à être libérés ; l’exercice distingue donc arbitrairement stade bicellulaire et pollen mûr.

## Exercice 3 — relier chaque élément à n ou 2n

La correction est :

| Élément | Ploïdie | Justification |
|---|---:|---|
| Cellule mère des grains de pollen | $2n$ | cellule sporophytique avant méiose |
| Mégaspore | $n$ | produit de la méiose femelle |
| Microspores de la tétrade | $n$ | produits de la méiose mâle |
| Grain de pollen | $n$ | gamétophyte mâle issu d’une microspore |

La présence de la mégaspore au milieu d’un tableau consacré au pollen est une incohérence éditoriale, mais sa ploïdie reste bien testable. Le document écrit « tétraspores » ; on comprend ici les quatre microspores de la tétrade.

## Stratégie de vérification

Pour toute question de ploïdie :

1. localiser la dernière méiose ;
2. écrire $2n\rightarrow n$ ;
3. conserver $n$ pendant les mitoses ;
4. ne revenir à $2n$ ou $3n$ qu’au moment des fusions.

> **Astuce mémoire :** avant méiose, cellule mère $2n$ ; après méiose, toutes les spores et tous les noyaux gamétophytiques sont $n$.
`,
    keyPoint: "Exercice 1 : anthères jeunes, sacs polliniques, ovule, cellule mère, oosphère, antipodes, binucléée ; exercice 2 : 2-3-4-1 ; exercice 3 : seule la cellule mère est 2n.",
    example: "La mégaspore et la microspore appartiennent à deux lignées différentes mais ont toutes deux subi la réduction méiotique : elles sont n.",
    methodSteps: [
      "Accorder les mots proposés avec la phrase reconstituée.",
      "Remplacer « tétraspores » par tétrade de microspores dans l’explication.",
      "Placer la méiose avant d’attribuer n ou 2n.",
      "Relire la séquence complète et vérifier qu’aucune mitose ne change la ploïdie.",
    ],
    interaction: diagram(
      "Construire la correction des trois exercices",
      "Choisis un bloc, formule sa réponse puis contrôle la justification.",
      "Évaluations de la page 7",
      "Trois tâches complémentaires vérifient vocabulaire, chronologie et ploïdie.",
      [
        { id: "fill-anther", label: "Lacunes 1-2", role: "Situer le pollen", detail: "Anthères jeunes puis sacs polliniques des anthères mûres.", group: "Exercice 1" },
        { id: "fill-ovule", label: "Lacunes 3-7", role: "Décrire le sac", detail: "Ovule, cellule mère, oosphère, antipodes, cellule centrale binucléée.", group: "Exercice 1" },
        { id: "order", label: "Ordre 2-3-4-1", role: "Suivre les stades", detail: "Cellule mère, tétrade, pollen bicellulaire, grains mûrs.", group: "Exercice 2" },
        { id: "diploid", label: "Cellule mère", role: "Conserver 2n", detail: "Elle appartient encore au sporophyte avant la méiose.", group: "Exercice 3" },
        { id: "haploid", label: "Spores et pollen", role: "Attribuer n", detail: "Mégaspore, microspores et pollen dérivent d’une méiose.", group: "Exercice 3" },
      ],
      "Une seule règle relie les exercices 2 et 3 : la méiose précède les spores haploïdes, puis les mitoses conservent n.",
    ),
    questions: questions(68, [
      ["Quel mot complète la lacune 1 ?", "Anthères jeunes", ["Ovules mûrs", "Sacs embryonnaires", "Tubes polliniques"], "Les cellules mères et les microspores se développent dans les anthères jeunes.", "Exercice 1 • page 7"],
      ["Quel groupe complète la lacune 2 ?", "Sacs polliniques", ["Loges ovariennes", "Téguments", "Synergides"], "Les grains sont contenus dans les microsporanges de l’anthère.", "Exercice 1 • page 7"],
      ["Quel mot complète la lacune 3 ?", "L’ovule", ["Le fruit", "L’exine", "Le filet"], "Le sac embryonnaire se développe dans l’ovule.", "Exercice 1 • page 7"],
      ["Quel groupe complète la lacune 4 ?", "Cellule mère", ["Tube pollinique", "Faisceau conducteur", "Paroi du fruit"], "La cellule mère des mégaspores initie la lignée femelle.", "Exercice 1 • page 7"],
      ["Quel mot complète la lacune 5 ?", "Oosphère", ["Tapetum", "Endothèce", "Exine"], "L’oosphère est la cellule reproductrice du sac.", "Exercice 1 • page 7"],
      ["Quel mot complète la lacune 6 ?", "Antipodes", ["Anthères", "Carpelles", "Cotylédons"], "Trois antipodes occupent le pôle chalazien du modèle.", "Exercice 1 • page 7"],
      ["Quel adjectif complète la lacune 7 ?", "Binucléée", ["Dénucléée", "Toujours quadrinucléée", "Diploïde par méiose"], "La cellule centrale contient deux noyaux polaires.", "Exercice 1 • page 7"],
      ["Quel ordre numérique répond à l’exercice 2 ?", "2 → 3 → 4 → 1", ["1 → 4 → 3 → 2", "3 → 2 → 1 → 4", "4 → 1 → 2 → 3"], "Cellule mère, tétrade, stade bicellulaire puis pollen mûr.", "Exercice 2 • page 7"],
      ["Quelle cellule du tableau est diploïde ?", "La cellule mère des grains de pollen", ["La mégaspore", "Chaque microspore", "Le grain de pollen"], "Elle n’a pas encore subi la méiose.", "Exercice 3 • page 7"],
      ["Quelle est la ploïdie de la mégaspore ?", "Haploïde n", ["Diploïde 2n", "Triploïde 3n", "Variable sans méiose"], "Elle est un produit de la méiose femelle.", "Exercice 3 • page 7"],
      ["Quelle est la ploïdie des noyaux d’un grain de pollen normal ?", "Haploïde n", ["Diploïde 2n", "Triploïde 3n", "Tétraploïde 4n"], "Les mitoses de la microspore n conservent n.", "Exercice 3 • page 7"],
    ], short("Donne l’ordre des quatre numéros de l’exercice 2.", ["2 3 4 1", "2-3-4-1", "2 → 3 → 4 → 1", "2341"], "La cellule mère précède la tétrade, le stade bicellulaire et le grain mûr.", "Exercice 2 • page 7")),
    corrections: [
      "Anthère jeune est accordé au pluriel pour s’insérer correctement dans la phrase de l’exercice 1.",
      "La lecture fautive « blnucléée » du scan est rétablie en binucléée.",
      "Tétraspores est interprété comme tétrade de quatre microspores.",
      "La mégaspore, étrangère au thème strict du tableau mâle, est conservée et correctement classée haploïde.",
      "Le stade bicellulaire et le grain de pollen mûr sont distingués comme le demande l’ordre officiel, tout en signalant leur recouvrement biologique.",
    ],
  },
  {
    id: "spermaphyte-reproduction-final-mission",
    title: "Mission finale — expliquer la formation d’une graine",
    summary: "Résoudre intégralement l’exercice 4 en identifiant, annotant, localisant et reliant germination pollinique et double fécondation.",
    pages: "8",
    section: "Évaluation — exercice 4",
    durationMinutes: 38,
    xp: 140,
    kind: "challenge",
    body: String.raw`
## Dossier officiel — deux figures, une seule histoire

La figure 1 représente la **germination d’un grain de pollen et la croissance du tube pollinique**. La figure 2 représente la **double fécondation dans le sac embryonnaire**. Les deux phénomènes sont reliés : le premier transporte les gamètes ; le second les fait fusionner avec leurs partenaires femelles.

## 1. Nommer et annoter la figure 1

La légende attendue est :

- **a : tube pollinique** ;
- **b : gamète mâle**, l’image en contenant deux ;
- **c : cellule végétative**, dont le noyau accompagne l’extrémité du tube.

Le terme source « anthérozoïde » pour b est modernisé en spermatozoïde végétal ou gamète mâle non mobile. La figure ne doit pas faire croire que ces cellules nagent : elles sont transportées.

## 2. Nommer et annoter la figure 2

La correction cohérente avec les repères de la figure est :

1. **tube pollinique** ;
2. **premier gamète mâle** ;
3. **oosphère** ;
4. **nucelle** ;
5. **second gamète mâle** ;
6. **noyau central**, issu des noyaux polaires dans le modèle classique.

Les numéros 2 et 5 désignent donc deux gamètes distincts. Le repère 4 pointe un tissu maternel autour du sac, non un « œuf principal ». Le repère 6 désigne le partenaire central avant ou au moment de la seconde fusion.

## 3. Localiser les phénomènes

La germination débute sur le **stigmate** et la croissance du tube se poursuit dans le style jusqu’à l’ovaire. La double fécondation a lieu dans le **sac embryonnaire**, lui-même inclus dans le nucelle d’un ovule contenu dans l’ovaire.

Répondre seulement « dans la fleur » est insuffisant : l’exercice évalue les niveaux d’emboîtement.

## 4. Expliquer la formation de la graine

Une réponse complète suit six étapes :

1. un pollen compatible se dépose sur le stigmate, s’hydrate et germe ;
2. la cellule végétative construit le tube dans le style ;
3. la cellule génératrice fournit deux gamètes mâles ;
4. le tube atteint le micropyle et libère les gamètes dans une synergide ;
5. un gamète fusionne avec l’oosphère : le zygote $2n$ donnera l’embryon ;
6. l’autre fusionne avec la cellule centrale : l’endosperme généralement $3n$ se développe.

Ensuite, les téguments deviennent les enveloppes de la graine ; l’ovule devient une graine et la paroi ovarienne contribue au fruit.

## Réponse modèle

« La figure 1 montre un pollen qui germe sur le stigmate. Sa cellule végétative forme un tube a qui transporte les deux gamètes b ; son noyau, repère c, accompagne la croissance. Le tube traverse le style et atteint un ovule par le micropyle. Dans la figure 2, il libère les gamètes 2 et 5 dans le sac embryonnaire entouré par le nucelle 4. Le gamète 2 fusionne avec l’oosphère 3 et donne le zygote $2n$ ; le gamète 5 fusionne avec le noyau central 6 et donne l’endosperme généralement $3n$. L’embryon, l’endosperme et les enveloppes se coordonnent pendant que l’ovule devient graine. »

## Barème de contrôle

- phénomènes nommés : 2 points ;
- légendes a-c et 1-6 : 4 points ;
- localisation emboîtée : 2 points ;
- deux fusions, ploïdies et devenirs : 6 points ;
- vocabulaire et enchaînement : 2 points.

> **Correction finale.** Le mécanisme représenté est celui des angiospermes ; la formulation officielle « chez les spermaphytes » est conservée comme titre de programme, mais pas comme généralisation biologique.
`,
    keyPoint: "Figure 1 : germination et tube ; figure 2 : double fécondation ; un gamète donne le zygote 2n, l’autre l’endosperme généralement 3n, puis l’ovule devient une graine.",
    example: "Localisation précise : stigmate et style pour la croissance du tube ; sac embryonnaire d’un ovule dans l’ovaire pour les deux fusions.",
    methodSteps: [
      "Nommer séparément germination pollinique et double fécondation.",
      "Annoter a-c puis 1-6 avant d’expliquer le mécanisme.",
      "Localiser du pistil vers l’ovaire, l’ovule puis le sac embryonnaire.",
      "Conclure par les deux ploïdies et les devenirs graine-fruit.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Mission reconstruite",
      title: "Du pollen à la graine",
      instruction: "Explore les huit repères, puis produis oralement une réponse continue aux quatre consignes de l’exercice.",
      viewBox: "0 0 900 470",
      caption: "Synthèse pédagogique originale inspirée des deux figures de la page 8 ; aucun scan n’est republié.",
      shapes: missionShapes,
      hotspots: missionHotspots,
      observation: "Le transport et les fusions doivent rester distincts : le tube livre deux gamètes, puis deux cellules femelles différentes sont fécondées.",
    },
    questions: questions(79, [
      ["Quel phénomène montre la figure 1 ?", "La germination du pollen et la croissance du tube", ["La méiose de l’oosphère", "La maturation du fruit", "La déhiscence de la graine"], "Le grain émet une longue extension transportant la lignée mâle.", "Exercice 4, figure 1 • page 8"],
      ["Quel phénomène montre la figure 2 ?", "La double fécondation", ["La pollinisation par le vent", "La méiose du pollen", "La germination de la graine"], "Deux gamètes mâles atteignent deux partenaires du sac.", "Exercice 4, figure 2 • page 8"],
      ["Que désigne la lettre a ?", "Le tube pollinique", ["Le funicule", "Le raphé", "Le nucelle"], "a pointe le prolongement du grain germé.", "Exercice 4, figure 1 • page 8"],
      ["Que désigne la lettre b ?", "Les gamètes mâles transportés", ["Les deux téguments", "Les deux noyaux polaires", "Les parois de l’ovaire"], "Les petits éléments dans le tube correspondent à la lignée génératrice.", "Exercice 4 corrigé • page 8"],
      ["Que désigne la lettre c dans la correction attendue ?", "La cellule végétative et son noyau", ["L’oosphère", "Une antipode", "Le tapetum"], "La cellule végétative construit le tube et son noyau accompagne la croissance.", "Exercice 4 corrigé • page 8"],
      ["Que désigne le numéro 1 ?", "Le tube pollinique", ["Le sac pollinique", "L’endosperme", "La chalaze"], "Le tube pénètre au voisinage de l’appareil œuf.", "Exercice 4, figure 2 • page 8"],
      ["Que désignent les numéros 2 et 5 ?", "Les deux gamètes mâles", ["Deux synergides seulement", "Deux carpelles", "Deux téguments"], "Un participera à chaque fusion.", "Exercice 4 corrigé • page 8"],
      ["Que désigne le numéro 3 ?", "L’oosphère", ["Le nucelle", "Le stomium", "Le connectif"], "Elle est le partenaire femelle de la première fusion.", "Exercice 4, figure 2 • page 8"],
      ["Que désigne le numéro 4 ?", "Le nucelle", ["Le zygote déjà formé", "L’exine", "Le péricarpe"], "Le repère pointe le tissu maternel entourant le sac.", "Exercice 4 corrigé • page 8"],
      ["Que désigne le numéro 6 ?", "Le noyau central", ["Le noyau végétatif du pollen", "Le hile", "Le tapetum"], "Il représente les noyaux polaires réunis ou leur noyau commun.", "Exercice 4 corrigé • page 8"],
      ["Où débute le phénomène de la figure 1 ?", "Sur le stigmate puis dans le style", ["Dans l’albumen d’une graine mûre", "Dans le sac pollinique fermé", "Dans la chalaze seulement"], "Le pollen germe sur le stigmate et son tube traverse le pistil.", "Localisation demandée • page 8"],
      ["Où se déroule la figure 2 ?", "Dans le sac embryonnaire d’un ovule de l’ovaire", ["Dans le filet de l’étamine", "Dans l’exine du pollen", "Dans le pétale"], "Les deux fusions ont lieu au sein du gamétophyte femelle.", "Localisation demandée • page 8"],
      ["Quel produit donne la fusion du gamète 2 avec l’oosphère ?", "Le zygote diploïde", ["L’endosperme triploïde", "Le péricarpe", "Le stigmate"], "n+n forme 2n et initie l’embryon.", "Explication demandée • page 8"],
      ["Quel produit donne la fusion du gamète 5 avec la cellule centrale ?", "L’endosperme généralement triploïde", ["Un second embryon obligatoire", "Le tube pollinique", "L’exine"], "n rejoint les deux lots maternels de la cellule centrale.", "Explication demandée • page 8"],
    ], short("Quel organe devient une graine après les deux fécondations ?", ["ovule", "l’ovule", "un ovule"], "L’ovule fécondé et ses tissus se transforment en graine.", "Conclusion de l’exercice 4 • page 8", 2)),
    corrections: [
      "Les phénomènes des deux figures sont explicitement séparés en germination pollinique et double fécondation.",
      "La figure 1 est légendée a = tube, b = gamètes mâles, c = cellule végétative et son noyau.",
      "La figure 2 est légendée 1 tube, 2 et 5 gamètes mâles, 3 oosphère, 4 nucelle, 6 noyau central.",
      "La localisation est emboîtée du stigmate au style puis du micropyle au sac embryonnaire.",
      "La portée angiosperme et les ploïdies 2n/3n sont ajoutées à la réponse officielle.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtSpermaphyteReproductionPath: LearningPath = {
  id: "terminale-d-svt-l7-spermaphyte-reproduction",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "La reproduction chez les mammifères et chez les spermaphytes" },
  chapterNumber: 7,
  title: "La reproduction chez les spermaphytes",
  description: "Le fascicule officiel reconstruit en neuf niveaux, de la pollinisation à la formation du pollen et du sac embryonnaire, puis à la double fécondation, la graine et le fruit, avec figures originales et corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer spermaphytes et angiospermes puis raisonner sur une pollinisation contrôlée",
    "Expliquer microsporogenèse, pollen, mégasporogenèse et sac embryonnaire",
    "Suivre le tube pollinique et les deux fusions de la double fécondation",
    "Relier zygote, endosperme, téguments, graine et fruit dans les évaluations officielles",
  ],
  modules: [
    {
      id: "spermaphyte-reproduction-mastery",
      title: "Maîtriser la reproduction des plantes à graines",
      description: "Neuf niveaux progressifs, des structures florales à la mission officielle de synthèse.",
      lessons: builtLevels,
    },
  ],
};
