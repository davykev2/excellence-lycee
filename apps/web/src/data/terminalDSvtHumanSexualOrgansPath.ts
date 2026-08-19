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

const sourceDocument = "SVT TD_L9_Le fonctionnement des organes sexuels chez lHomme (ok).pdf";

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
      introduction: "Identifie les organes, les hormones et le sens des actions ; sépare ensuite observation, interprétation et rétrocontrôle avant de conclure.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : organe source → hormone → organe cible → effet → retour sur la commande.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const ovaryShapes: SchemaShape[] = [
  { shape: "path", d: "M80 235 C105 120 245 70 405 105 C545 135 650 230 610 330 C565 430 365 430 205 380 C105 350 55 300 80 235 Z", tone: "soft" },
  { shape: "circle", cx: 170, cy: 245, r: 18, tone: "outline" },
  { shape: "circle", cx: 255, cy: 225, r: 34, tone: "fill" },
  { shape: "circle", cx: 365, cy: 205, r: 56, tone: "outline" },
  { shape: "circle", cx: 380, cy: 200, r: 14, tone: "accent" },
  { shape: "path", d: "M425 185 C475 130 540 135 565 175 C590 215 560 245 525 255", tone: "accent" },
  { shape: "circle", cx: 585, cy: 150, r: 14, tone: "accent" },
  { shape: "path", d: "M485 285 C520 245 580 260 590 315 C595 365 540 395 495 365 C460 340 455 310 485 285 Z", tone: "fill" },
  { shape: "text", x: 350, y: 470, content: "Cycle ovarien — figure pédagogique originale", anchor: "middle" },
];

const ovaryHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "follicle-cohort", number: 1, label: "Cohorte folliculaire", x: 170, y: 245, detail: "Plusieurs follicules poursuivent leur croissance au début de la phase folliculaire sous l'influence de la FSH." },
  { id: "dominant-follicle", number: 2, label: "Follicule dominant", x: 255, y: 225, detail: "Un follicule devient dominant, sécrète davantage d'estradiol et poursuit sa maturation tandis que les autres régressent." },
  { id: "mature-follicle", number: 3, label: "Follicule mûr", x: 365, y: 205, detail: "Le follicule préovulatoire contient l'ovocyte II et produit un taux élevé d'estradiol." },
  { id: "ovulation", number: 4, label: "Ovulation", x: 585, y: 150, detail: "Le pic de LH déclenche la rupture folliculaire et la libération de l'ovocyte II entouré de cellules du cumulus." },
  { id: "corpus-luteum", number: 5, label: "Corps jaune", x: 535, y: 325, detail: "Le follicule rompu se lutéinise ; le corps jaune sécrète surtout la progestérone et aussi de l'estradiol." },
];

const testisShapes: SchemaShape[] = [
  { shape: "ellipse", cx: 350, cy: 250, rx: 220, ry: 165, rotate: -8, tone: "soft" },
  { shape: "path", d: "M205 175 C265 120 360 120 445 175 C500 210 500 285 440 330 C360 390 250 365 205 305 C170 260 170 210 205 175 Z", tone: "outline" },
  { shape: "path", d: "M245 175 C300 215 295 300 235 330 M315 145 C375 205 365 310 300 360 M390 150 C450 210 440 300 380 355", tone: "muted" },
  { shape: "path", d: "M535 120 C630 170 625 325 530 390 C565 330 565 190 535 120 Z", tone: "accent" },
  { shape: "line", x1: 565, y1: 385, x2: 680, y2: 455, tone: "accent" },
  { shape: "circle", cx: 330, cy: 235, r: 16, tone: "fill" },
  { shape: "circle", cx: 400, cy: 270, r: 13, tone: "accent" },
  { shape: "text", x: 420, y: 500, content: "Testicule et voies de sortie — dessin original, non à l'échelle", anchor: "middle" },
];

const testisHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "seminiferous-tubules", number: 1, label: "Tubes séminifères", x: 250, y: 210, detail: "Ils contiennent les cellules germinales et les cellules de Sertoli ; la spermatogenèse s'y déroule." },
  { id: "sertoli-cells", number: 2, label: "Cellules de Sertoli", x: 330, y: 235, detail: "Elles soutiennent les cellules germinales, participent à la barrière hémato-testiculaire et sécrètent notamment l'inhibine B." },
  { id: "leydig-cells", number: 3, label: "Cellules de Leydig", x: 400, y: 270, detail: "Situées dans le tissu interstitiel, elles produisent la testostérone sous l'action de la LH." },
  { id: "epididymis", number: 4, label: "Épididyme", x: 565, y: 245, detail: "Les spermatozoïdes y mûrissent après leur sortie du testicule et sont stockés surtout dans sa queue." },
  { id: "deferens", number: 5, label: "Canal déférent", x: 650, y: 435, detail: "Il transporte les spermatozoïdes depuis l'épididyme vers les voies éjaculatrices." },
];

const levels: LevelSeed[] = [
  {
    id: "female-sexual-cycle-landmarks",
    title: "Poser les repères des cycles sexuels",
    summary: "Distinguer les cycles ovarien, utérin et hormonal, puis les replacer dans un modèle chronologique qui respecte la variabilité humaine.",
    pages: "1-3",
    section: "Situation, document 1 et principaux cycles sexuels chez la femme",
    durationMinutes: 24,
    xp: 45,
    body: String.raw`
## Une coordination cyclique, pas une horloge identique pour toutes

Le document part d'une situation de grossesse pour poser trois questions : comment évoluent les organes sexuels féminins, qui commande ces transformations et comment une contraception hormonale peut-elle agir ? Cette situation doit être étudiée sans jugement. Des nausées ou des vertiges ne prouvent pas une grossesse ; seul un test adapté, interprété dans un cadre de santé, permet de l'établir. L'objectif scientifique est de comprendre les mécanismes et de donner des repères de prévention fiables.

Le **jour 1** d'un cycle menstruel correspond au premier jour du saignement, noté $J_1$ dans la frise. Le schéma officiel présente un cycle modèle de 28 jours, avec une ovulation proche du jour 14. Ce modèle aide à ordonner les événements, mais la durée totale et la date d'ovulation varient d'une personne à l'autre et parfois d'un cycle à l'autre. On ne peut donc pas utiliser le seul calendrier comme preuve d'une ovulation ou comme méthode contraceptive fiable.

## Quatre séries de transformations à synchroniser

| Ensemble suivi | Organe ou source | Repères majeurs |
|---|---|---|
| cycle ovarien | ovaires | phase folliculaire, ovulation, phase lutéale |
| cycle utérin | endomètre | menstruation, reconstruction proliférative, phase sécrétoire |
| hormones hypophysaires | antéhypophyse | variations de FSH et de LH |
| hormones ovariennes | follicule puis corps jaune | estradiol puis progestérone dominante |

Le cycle ovarien est classiquement décrit en **deux phases**, folliculaire et lutéale, séparées par l'ovulation. Le fascicule compte l'ovulation comme une troisième « phase » ; il est plus précis de la traiter comme un événement de transition bref. Pendant la phase folliculaire, des follicules croissent et l'un d'eux devient dominant. L'ovulation libère un ovocyte II. Pendant la phase lutéale, le follicule rompu devient corps jaune.

Dans l'utérus, la couche fonctionnelle de l'endomètre se détache partiellement au début du cycle, puis se reconstruit sous l'action de l'estradiol. Après l'ovulation, la progestérone transforme cette muqueuse en tissu sécrétoire. Sans grossesse, le corps jaune régresse, l'estradiol et la progestérone chutent et une nouvelle menstruation commence.

## Lire une figure composite

Pour exploiter le document 1, trace quatre lignes horizontales : hypophyse, ovaire, hormones ovariennes et utérus. Place ensuite une même verticale au voisinage de l'ovulation. Cette verticale rencontre le grand pic de LH, la rupture folliculaire, le début de la phase lutéale et la transition de l'endomètre vers sa phase sécrétoire. La simultanéité permet de relier les phénomènes sans confondre leurs organes.

> **Astuce mémoire — O-H-U :** l'**o**vaire produit des hormones, les **h**ormones coordonnent et l'**u**térus répond.
`,
    keyPoint: "Le jour 1 ouvre le cycle menstruel ; le modèle de 28 jours synchronise ovaire, hypophyse et utérus sans imposer une durée universelle.",
    example: "Une menstruation observée au jour 1 appartient au cycle utérin et coïncide avec le début de la phase folliculaire ovarienne.",
    methodSteps: [
      "Fixer le jour 1 au début du saignement menstruel.",
      "Séparer sur quatre lignes ovaire, utérus, hypophyse et hormones ovariennes.",
      "Placer l'ovulation comme transition entre les phases folliculaire et lutéale.",
      "Présenter 28 jours et le jour 14 comme des repères de modèle, non comme des certitudes individuelles.",
    ],
    interaction: timeline(
      "Synchroniser un cycle modèle",
      "Déroule les étapes et relie chaque événement ovarien à la réponse de l'endomètre.",
      [
        { label: "Début du cycle", shortLabel: "J1", detail: "Les menstruations commencent ; plusieurs follicules poursuivent leur croissance." },
        { label: "Phase folliculaire", shortLabel: "Follicule", detail: "Le follicule dominant produit davantage d'estradiol et l'endomètre prolifère." },
        { label: "Ovulation", shortLabel: "Transition", detail: "Le pic de LH déclenche la libération de l'ovocyte II ; la date réelle n'est pas fixée universellement au jour 14." },
        { label: "Phase lutéale", shortLabel: "Corps jaune", detail: "Le corps jaune produit surtout la progestérone et l'endomètre devient sécrétoire." },
        { label: "Sans grossesse", shortLabel: "Chute", detail: "Le corps jaune régresse ; estradiol et progestérone chutent avant un nouveau jour 1." },
      ],
      "Le cycle ovarien et le cycle utérin sont simultanés : leurs phases portent des noms différents parce qu'elles décrivent des organes différents.",
    ),
    questions: questions(0, [
      ["Quel événement définit le jour 1 du cycle menstruel ?", "Le début des menstruations", ["Le maximum de progestérone", "La fécondation", "La fin de la phase lutéale"], "Le premier jour du saignement est conventionnellement le jour 1.", "Document 1 • page 2"],
      ["Quel organe est directement décrit par le cycle ovarien ?", "L'ovaire", ["L'utérus", "L'hypophyse seule", "Le vagin seul"], "Le cycle ovarien suit follicules, ovulation et corps jaune.", "Résultats • page 2"],
      ["Quel tissu change pendant le cycle utérin ?", "L'endomètre", ["Le cartilage", "La rétine", "L'émail dentaire"], "L'endomètre est la muqueuse interne de l'utérus.", "Document 1 • pages 2-3"],
      ["Comment utiliser le cycle de 28 jours du document ?", "Comme un modèle pédagogique", ["Comme une durée obligatoire", "Comme un diagnostic de grossesse", "Comme une preuve certaine d'ovulation au jour 14"], "La durée et la date d'ovulation varient.", "Document 1 • page 2"],
      ["Quelle succession décrit le cycle ovarien ?", "Phase folliculaire, ovulation, phase lutéale", ["Menstruation, fécondation, naissance", "Phase lutéale, puberté, ménopause", "Ovulation, phase folliculaire, règles définitives"], "L'ovulation sépare les deux grandes phases ovariennes.", "Analyse • page 3"],
      ["Quelle structure apparaît après l'ovulation ?", "Le corps jaune", ["Le glomérule", "Le placenta immédiat", "Le neurone moteur"], "Le follicule rompu se transforme en corps jaune.", "Analyse • page 3"],
      ["Quel événement suit la régression du corps jaune sans grossesse ?", "La chute d'estradiol et de progestérone", ["Un pic durable de LH", "Une sécrétion d'hCG", "Une disparition de l'utérus"], "La perte du soutien hormonal prépare les menstruations.", "Interprétation • pages 3-4"],
      ["Pourquoi tracer une verticale autour de l'ovulation ?", "Pour relier des événements simultanés", ["Pour rendre tous les taux égaux", "Pour calculer une grossesse", "Pour supprimer la variabilité"], "La figure superpose plusieurs lignes temporelles.", "Document 1 • page 2"],
      ["Quelle formulation est scientifiquement la plus précise ?", "Deux phases ovariennes séparées par l'ovulation", ["Trois organes appelés phases", "Une seule phase de 28 jours", "Aucune phase avant l'ovulation"], "L'ovulation est un événement bref entre les phases folliculaire et lutéale.", "Analyse corrigée • page 3"],
    ], short("Nomme les deux organes dont les transformations cycliques sont directement comparées.", ["ovaire et utérus", "l'ovaire et l'utérus", "ovaires et utérus", "les ovaires et l'utérus"], "Le document synchronise le cycle ovarien et le cycle utérin.", "Document 1 • page 2")),
    corrections: [
      "Le cycle de 28 jours et l'ovulation vers le jour 14 forment un modèle ; la durée est variable et ce n'est pas une règle universelle.",
      "L'ovulation est présentée comme l'événement séparant deux phases ovariennes, malgré le découpage en trois phases du fascicule.",
      "La situation de grossesse est reformulée sans stigmatisation et les symptômes ne sont pas présentés comme un diagnostic.",
      "Le nom du fichier PDF porte L9, tandis que la progression et le catalogue fixent cette leçon à la carte et au chapitre 6 ; le parcours suit cette source de vérité.",
      "La portée humaine est explicitement mixte : les cycles féminins sont complétés par l'axe masculin et le fonctionnement testiculaire.",
    ],
  },
  {
    id: "ovarian-follicular-ovulatory-luteal-cycle",
    title: "Suivre le cycle ovarien",
    summary: "Décrire la croissance folliculaire, l'ovulation et le devenir du follicule rompu en reliant chaque événement aux hormones utiles.",
    pages: "2-4",
    section: "Cycle ovarien, hormones ovariennes et interprétation",
    durationMinutes: 28,
    xp: 55,
    body: String.raw`
## La phase folliculaire : sélectionner un follicule dominant

Au début du cycle, une cohorte de follicules poursuit sa croissance sous l'influence de la **FSH**. Chaque follicule contient un ovocyte entouré de cellules folliculaires. L'un d'eux devient généralement dominant ; ses cellules de la granulosa et de la thèque participent à une production croissante d'estradiol. Les autres follicules régressent par atrésie. L'ovaire ne fabrique donc pas un nouvel ovocyte le jour de l'ovulation : il conduit à maturité un follicule qui contient déjà une cellule germinale.

Le follicule dominant devient préovulatoire. Quand l'estradiol reste élevé assez longtemps, le rétrocontrôle exercé sur le complexe hypothalamo-hypophysaire devient positif. Une forte décharge de **LH** apparaît. Le début de cette décharge précède généralement l'ovulation d'environ 36 heures ; son maximum la précède plutôt de 10 à 12 heures. La mention « 48 heures » du fascicule décrit grossièrement la période préovulatoire mais ne doit pas être transformée en délai exact entre le maximum du pic et l'ovulation.

## L'ovulation : libérer un ovocyte II

La LH déclenche une cascade qui fragilise la paroi folliculaire. Le follicule mûr se rompt et libère un **ovocyte II**, entouré de cellules du cumulus. Il ne s'agit ni d'un ovule déjà fécondé ni d'un embryon. Dans le modèle de 28 jours, cet événement est placé près du jour 14 ; dans un cycle réel, sa date dépend notamment de la durée de la phase folliculaire.

## La phase lutéale : construire un corps jaune

Après l'ovulation, les cellules restantes du follicule se lutéinisent et forment le **corps jaune**. Celui-ci sécrète surtout de la progestérone et aussi de l'estradiol. Ces hormones préparent et maintiennent temporairement un endomètre sécrétoire tout en exerçant un rétrocontrôle négatif sur la commande hypophysaire.

| Structure ovarienne | Sécrétion ou événement dominant | Conséquence repérable |
|---|---|---|
| follicules en croissance | estradiol croissant | reconstruction de l'endomètre |
| follicule mûr | estradiol élevé | préparation du pic de LH |
| ovulation | libération de l'ovocyte II | transition vers la phase lutéale |
| corps jaune | progestérone + estradiol | endomètre sécrétoire |

Sans grossesse, le corps jaune régresse et devient un corps blanc. S'il y a début de grossesse, l'embryon en développement produit de l'**hCG**, qui maintient provisoirement le corps jaune. La fécondation seule, avant tout signal embryonnaire, ne suffit donc pas à expliquer ce maintien.

> **Astuce mémoire — F-O-J :** **f**ollicule dominant, **o**vulation, corps **j**aune.
`,
    keyPoint: "La FSH soutient la croissance folliculaire, le pic de LH déclenche l'ovulation et le follicule rompu devient un corps jaune sécréteur de progestérone.",
    example: "Un ovaire portant un corps jaune et une progestérone élevée est observé après l'ovulation, pendant la phase lutéale.",
    methodSteps: [
      "Ordonner cohorte folliculaire, follicule dominant, ovulation puis corps jaune.",
      "Associer FSH à la croissance folliculaire et le grand pic de LH à l'ovulation.",
      "Nommer précisément la cellule libérée : l'ovocyte II.",
      "Distinguer régression sans grossesse et maintien précoce par l'hCG.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure annotée originale",
      title: "Explorer les structures successives de l'ovaire",
      instruction: "Sélectionne chaque repère pour reconstruire la succession follicule–ovulation–corps jaune.",
      viewBox: "0 0 700 520",
      caption: "Figure redessinée d'après le document officiel ; aucune image du PDF n'est republiée.",
      shapes: ovaryShapes,
      hotspots: ovaryHotspots,
      observation: "Le corps jaune provient du follicule rompu : il n'apparaît pas indépendamment de l'ovulation.",
    },
    questions: questions(9, [
      ["Quelle hormone soutient principalement la croissance folliculaire ?", "La FSH", ["La prolactine", "L'adrénaline", "L'insuline"], "La FSH agit sur les cellules folliculaires.", "Cycle ovarien • pages 2-3"],
      ["Quel follicule poursuit généralement la maturation jusqu'à l'ovulation ?", "Le follicule dominant", ["Tous les follicules de la cohorte", "Le corps jaune", "Le follicule déjà rompu"], "Les autres follicules régressent le plus souvent par atrésie.", "Analyse • page 3"],
      ["Quelle cellule est libérée lors de l'ovulation humaine ?", "Un ovocyte II", ["Un embryon", "Un spermatozoïde", "Un ovule déjà fécondé"], "Le follicule mûr libère un ovocyte II.", "Analyse • page 3"],
      ["Quel signal déclenche directement l'ovulation ?", "La forte décharge de LH", ["La chute d'insuline", "L'hCG avant fécondation", "La seule menstruation"], "Le pic préovulatoire de LH déclenche la rupture folliculaire.", "Interprétation • pages 3-4"],
      ["Que devient le follicule rompu ?", "Un corps jaune", ["Un endomètre", "Un glomérule", "Une antéhypophyse"], "La lutéinisation transforme les cellules folliculaires restantes.", "Analyse • page 3"],
      ["Quelle hormone domine la sécrétion du corps jaune ?", "La progestérone", ["La GnRH", "La FSH", "L'adrénaline"], "Le corps jaune sécrète surtout la progestérone.", "Hormones ovariennes • page 3"],
      ["Quel phénomène touche les follicules non dominants ?", "L'atrésie", ["La nidation", "La fécondation", "La menstruation"], "Ils régressent au cours de la phase folliculaire.", "Cycle ovarien • pages 2-3"],
      ["Quel délai sépare approximativement le maximum de LH de l'ovulation ?", "Environ 10 à 12 heures", ["Environ 28 jours", "Environ 48 semaines", "Moins d'une minute"], "Le début de la décharge précède davantage l'ovulation que son maximum.", "Délai corrigé • page 4"],
      ["Qu'est-ce qui maintient le corps jaune au début d'une grossesse ?", "L'hCG embryonnaire", ["La FSH seule", "Les menstruations", "La disparition de l'estradiol"], "L'hCG exerce une action lutéotrope précoce.", "Interprétation enrichie • pages 3-4"],
      ["Pourquoi le jour 14 n'est-il pas une date universelle ?", "La durée de la phase folliculaire varie", ["La phase lutéale n'existe jamais", "La LH est absente", "Tous les cycles durent 14 jours"], "Le modèle de 28 jours ne prédit pas exactement chaque cycle.", "Document 1 • page 2"],
    ], short("Nomme la structure endocrine formée après l'ovulation.", ["corps jaune", "le corps jaune", "corpus luteum"], "Le follicule rompu se transforme en corps jaune.", "Cycle ovarien • pages 2-3")),
    corrections: [
      "La cellule libérée est nommée ovocyte II et non ovule fécondé ou embryon.",
      "Le délai est distingué entre début de la décharge de LH, environ 36 h, et maximum du pic, environ 10 à 12 h avant l'ovulation.",
      "Le maintien du corps jaune en début de grossesse est relié à l'hCG et non à la fécondation seule.",
    ],
  },
  {
    id: "uterine-menstrual-proliferative-secretory-cycle",
    title: "Lire le cycle de l'endomètre",
    summary: "Relier menstruation, phase proliférative et phase sécrétoire aux variations successives de l'estradiol et de la progestérone.",
    pages: "2-3 et 14-15",
    section: "Cycle utérin et exercice sur l'apparition des menstruations",
    durationMinutes: 28,
    xp: 65,
    body: String.raw`
## L'endomètre : une muqueuse qui se renouvelle

L'**endomètre** est la muqueuse interne de l'utérus. Il comprend une couche basale qui persiste et une couche fonctionnelle qui s'épaissit, devient sécrétoire puis se détache partiellement pendant les menstruations. Le fascicule écrit que l'endomètre est « presque totalement détruit » : cette formule doit être corrigée, car la couche basale demeure et permet la reconstruction du cycle suivant. Le **myomètre**, couche musculaire de l'utérus, n'est pas éliminé pendant les règles.

Le cycle utérin peut être lu en trois temps. Les dates indiquées correspondent au modèle de 28 jours de la source ; elles ne sont pas des frontières universelles.

## 1. Menstruation : retirer le soutien hormonal

En fin de cycle sans grossesse, le corps jaune régresse. Les concentrations d'estradiol et surtout de progestérone chutent. Les artères spiralées et la couche fonctionnelle ne reçoivent plus le même soutien ; le tissu se désorganise et une partie est éliminée avec du sang. Ce sont les **menstruations**. Leur déclenchement ne s'explique pas directement par de faibles taux de FSH et de LH, contrairement à la première phrase du corrigé page 15 : ce sont d'abord les stéroïdes ovariens qui agissent sur l'endomètre.

## 2. Phase proliférative : reconstruire sous estradiol

Pendant la phase folliculaire ovarienne, le follicule dominant sécrète un taux croissant d'estradiol. La couche basale régénère la couche fonctionnelle ; les cellules prolifèrent, les glandes s'allongent et les artères spiralées se développent. Cette phase utérine est dite **proliférative**. Le corrigé officiel associe parfois la prolifération à la progestérone ; la distinction correcte est : estradiol pour la prolifération, progestérone pour la maturation sécrétoire.

## 3. Phase sécrétoire : préparer un accueil possible

Après l'ovulation, la progestérone du corps jaune agit sur un endomètre préalablement préparé par l'estradiol. Les glandes deviennent tortueuses et sécrétrices, la vascularisation augmente et la muqueuse prend l'aspect scolaire de « dentelle utérine ». Elle devient favorable à une éventuelle implantation. Cette préparation n'annonce pas nécessairement une grossesse ; elle se produit à chaque cycle ovulatoire.

| État de l'ovaire | Hormone dominante | Réponse de l'utérus |
|---|---|---|
| follicule en croissance | estradiol | prolifération de l'endomètre |
| corps jaune | progestérone | transformation sécrétoire |
| régression du corps jaune | chute des deux stéroïdes | menstruation |

L'exercice des pages 14-15 découpe le modèle en jours 1-5, 5-14 et 14-28. Une bonne réponse décrit d'abord l'aspect du tissu, puis relie la variation à l'hormone ovarienne dominante. Elle évite d'attribuer à la FSH ou à la LH un effet direct sur l'endomètre.

> **Astuce mémoire — M-P-S :** **m**enstruation, **p**rolifération, **s**écrétion.
`,
    keyPoint: "L'estradiol reconstruit l'endomètre ; la progestérone le transforme en muqueuse sécrétoire ; la chute des deux déclenche la menstruation.",
    example: "Des glandes tortueuses dans un endomètre épais indiquent une phase sécrétoire, donc une phase lutéale avec progestérone élevée.",
    methodSteps: [
      "Décrire l'épaisseur, les glandes et les artères de l'endomètre.",
      "Associer prolifération à l'estradiol et sécrétion à la progestérone.",
      "Expliquer les règles par la chute des stéroïdes après régression du corps jaune.",
      "Distinguer couche fonctionnelle, couche basale et myomètre.",
    ],
    interaction: timeline(
      "De la menstruation à la phase sécrétoire",
      "Parcours les états de l'endomètre et identifie l'hormone ovarienne dominante.",
      [
        { label: "Menstruation", shortLabel: "J1-J5", detail: "La chute d'estradiol et de progestérone entraîne l'élimination partielle de la couche fonctionnelle." },
        { label: "Reconstruction", shortLabel: "Après J5", detail: "La couche basale régénère l'endomètre sous l'influence croissante de l'estradiol." },
        { label: "Prolifération", shortLabel: "Avant ovulation", detail: "Les cellules se multiplient, les glandes s'allongent et les artères se développent." },
        { label: "Transformation sécrétoire", shortLabel: "Après ovulation", detail: "La progestérone rend les glandes tortueuses et sécrétrices." },
        { label: "Fin sans grossesse", shortLabel: "Nouvelle chute", detail: "La régression du corps jaune retire le soutien hormonal et prépare un nouveau cycle." },
      ],
      "La phase proliférative utérine accompagne la phase folliculaire ovarienne ; la phase sécrétoire accompagne la phase lutéale.",
    ),
    questions: questions(19, [
      ["Quelle couche est principalement éliminée pendant les menstruations ?", "La couche fonctionnelle de l'endomètre", ["Tout le myomètre", "La couche basale entière", "Le col de l'utérus"], "La couche basale persiste et régénère la muqueuse.", "Analyse du cycle utérin • page 3"],
      ["Quelle hormone stimule surtout la phase proliférative ?", "L'estradiol", ["La mélatonine", "La testostérone", "L'adrénaline"], "L'estradiol produit par le follicule favorise la reconstruction.", "Interprétation • page 3"],
      ["Quelle hormone domine la transformation sécrétoire ?", "La progestérone", ["La FSH seule", "La GnRH seule", "L'insuline"], "La progestérone du corps jaune transforme l'endomètre préparé.", "Interprétation • pages 3-4"],
      ["Quel aspect caractérise les glandes en phase sécrétoire ?", "Elles deviennent tortueuses et sécrétrices", ["Elles disparaissent définitivement", "Elles deviennent osseuses", "Elles restent toujours droites"], "Le fascicule parle d'une dentelle utérine.", "Analyse • page 3"],
      ["Quelle structure permet la reconstruction après les règles ?", "La couche basale de l'endomètre", ["Le corps jaune permanent", "Le myomètre éliminé", "La trompe de Fallope"], "La couche basale n'est pas desquamée comme la couche fonctionnelle.", "Correction scientifique • page 3"],
      ["Quelle succession utérine est correcte ?", "Menstruation, prolifération, sécrétion", ["Sécrétion, fécondation obligatoire, disparition", "Ovulation, myomètre, puberté", "Prolifération, ménopause, menstruation"], "Ces trois états se répètent au cours d'un cycle ovulatoire.", "Document 1 • pages 2-3"],
      ["Quelle phase ovarienne correspond à la phase sécrétoire utérine ?", "La phase lutéale", ["La phase folliculaire seule", "La puberté", "La ménopause"], "Le corps jaune lutéal fournit la progestérone.", "Analyse • page 3"],
      ["Quelle cause immédiate prépare les menstruations sans grossesse ?", "La chute d'estradiol et de progestérone", ["Un pic d'hCG", "Une hausse durable de progestérone", "La FSH détruisant directement l'utérus"], "La régression du corps jaune retire le soutien stéroïdien.", "Exercice 3 corrigé • pages 14-15"],
      ["Que décrit la période modèle des jours 5 à 14 ?", "La reconstruction et l'épaississement progressif", ["La disparition du myomètre", "Une nidation obligatoire", "Une sécrétion maximale de progestérone dès J5"], "Cette période correspond à la phase proliférative.", "Exercice 3 • page 14"],
      ["Pourquoi les dates 1-5, 5-14 et 14-28 restent-elles indicatives ?", "La durée des cycles varie", ["L'endomètre ne change jamais", "Les hormones sont absentes", "Le jour 1 est inconnu"], "Le schéma présente un modèle de 28 jours.", "Document 1 et exercice 3 • pages 2 et 14"],
    ], short("Donne le nom de la muqueuse interne de l'utérus.", ["endomètre", "l'endomètre", "endometre", "l'endometre"], "La muqueuse interne de l'utérus est l'endomètre.", "Cycle utérin • pages 2-3")),
    corrections: [
      "La menstruation élimine surtout la couche fonctionnelle ; la couche basale et le myomètre ne sont pas détruits.",
      "La prolifération est reliée à l'estradiol, tandis que la progestérone induit la transformation sécrétoire.",
      "L'apparition des règles est expliquée par la chute d'estradiol et de progestérone, non par une action directe de faibles taux de FSH et LH.",
    ],
  },
  {
    id: "ovarian-pituitary-hormone-curves",
    title: "Interpréter les courbes hormonales",
    summary: "Lire ensemble FSH, LH, estradiol et progestérone pour localiser l'ovulation et expliquer les transformations de l'ovaire et de l'utérus.",
    pages: "2-3, 6 et 14",
    section: "Courbes hypophysaires et ovariennes des documents 1 et 2",
    durationMinutes: 30,
    xp: 70,
    kind: "graph",
    body: String.raw`
## Commencer par les axes et non par la couleur

Le document 1 juxtapose quatre courbes : FSH et LH produites par l'antéhypophyse, estradiol et progestérone produits par l'ovaire. Les axes imprimés sont difficiles à lire et certaines unités sont incohérentes : les gonadostimulines apparaissent avec une unité en ng/mL et la progestérone avec une échelle qui ne permet pas une comparaison fiable. Le parcours conserve donc la **forme relative** et l'ordre des événements, sans transformer les hauteurs du dessin en mesures cliniques.

La hauteur de deux courbes utilisant des unités ou des échelles différentes ne se compare pas directement. On demande plutôt : quand la courbe monte-t-elle ? Quand atteint-elle un maximum ? Quel événement apparaît immédiatement après ?

## FSH et LH : deux signaux hypophysaires

Au début du cycle, la FSH augmente suffisamment pour soutenir une cohorte folliculaire. Quand le follicule dominant produit davantage d'estradiol, la FSH tend à diminuer sous l'effet du rétrocontrôle négatif et de signaux folliculaires. Au milieu du cycle, une élévation modeste de FSH accompagne la forte décharge de LH.

La **LH** reste présente à un niveau basal pendant tout le cycle ; elle n'est pas nulle hors de son pic. Sa décharge préovulatoire est brève et très marquée. Le début de cette décharge précède l'ovulation d'environ 36 heures et son maximum d'environ 10 à 12 heures. Après l'ovulation, la LH contribue au fonctionnement du corps jaune, puis son taux revient à un niveau bas sous le rétrocontrôle des hormones ovariennes.

## Estradiol et progestérone : lire l'activité de l'ovaire

L'estradiol augmente pendant la phase folliculaire et atteint un niveau élevé avant l'ovulation. Cette élévation soutenue prépare le rétrocontrôle positif et le pic de LH. Il baisse brièvement autour de l'ovulation puis présente souvent une élévation plus modeste pendant la phase lutéale, car le corps jaune en produit aussi.

La progestérone reste basse avant l'ovulation. Elle augmente après la formation du corps jaune, atteint un maximum au milieu de la phase lutéale puis chute si aucune grossesse ne maintient le corps jaune. Une progestérone durablement élevée est donc un bon indice d'une phase postovulatoire.

| Indice graphique | Interprétation prudente |
|---|---|
| grand pic bref de LH | période ovulatoire proche |
| estradiol élevé avant le pic | follicule dominant actif et rétrocontrôle positif possible |
| progestérone élevée après le pic | corps jaune fonctionnel |
| chute conjointe des stéroïdes | fin de phase lutéale et règles proches |

La courbe interactive représente la LH en **indice relatif**. Elle n'invente aucune concentration : elle redessine seulement la dynamique qualitative visible page 2.

> **Astuce mémoire — LH = Libération à Haute intensité :** le grand pic annonce la libération de l'ovocyte.
`,
    keyPoint: "Le pic bref de LH localise l'ovulation ; la progestérone élevée localise la phase lutéale ; les unités différentes interdisent de comparer naïvement les hauteurs.",
    example: "Un pic aigu de LH suivi d'une montée durable de progestérone indique une ovulation puis l'installation d'un corps jaune.",
    methodSteps: [
      "Lire le titre, l'unité et l'échelle de chaque axe.",
      "Repérer le pic le plus bref et le plus marqué : celui de la LH.",
      "Chercher ensuite la montée postovulatoire de progestérone.",
      "Relier les chutes des stéroïdes à la fin du cycle sans inventer de valeurs absolues.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "Suivre la dynamique relative de la LH",
      instruction: "Déplace le repère le long du cycle modèle et observe le contraste entre niveau basal et décharge préovulatoire.",
      formula: "Indice relatif de LH selon le jour du cycle",
      rule: { kind: "samples", points: [[1, 3], [4, 3.5], [7, 3], [10, 4], [12, 7], [13, 15], [14, 24], [15, 8], [18, 3], [21, 2.5], [24, 2], [28, 3]] },
      window: { xMin: 1, xMax: 28, yMin: 0, yMax: 26 },
      guides: [
        { kind: "vertical", value: 14, label: "ovulation du modèle" },
        { kind: "horizontal", value: 4, label: "niveau basal relatif" },
      ],
      marker: { min: 1, max: 28, step: 1, initial: 14 },
      observation: "Le tracé est un indice qualitatif redessiné : il respecte la forme de la source sans reprendre ses unités illisibles ou incohérentes.",
    },
    questions: questions(29, [
      ["Quelle hormone présente le pic préovulatoire le plus marqué ?", "La LH", ["La progestérone", "L'insuline", "La thyroxine"], "La forte décharge de LH précède l'ovulation.", "Document 1 • page 2"],
      ["Quelle hormone ovarienne augmente surtout après l'ovulation ?", "La progestérone", ["La FSH", "La GnRH", "L'adrénaline"], "Le corps jaune produit surtout la progestérone.", "Hormones ovariennes • pages 2-3"],
      ["Quelle structure produit l'estradiol croissant avant l'ovulation ?", "Le follicule dominant", ["Le myomètre", "L'antéhypophyse", "Le globule rouge"], "Les cellules folliculaires assurent la production préovulatoire.", "Interprétation • page 3"],
      ["Que signifie une chute conjointe d'estradiol et de progestérone en fin de cycle ?", "La régression du corps jaune", ["Une grossesse certaine", "Un pic d'hCG", "Une ovulation immédiate"], "La lutéolyse retire le soutien stéroïdien.", "Interprétation • pages 3-4"],
      ["Pourquoi ne pas comparer directement la hauteur de deux courbes ovariennes ?", "Leurs unités et échelles diffèrent", ["Elles représentent la même hormone", "Elles n'ont aucune abscisse", "Le jour 1 est absent"], "Une double échelle exige une lecture séparée.", "Document 1 • page 2"],
      ["Quelle élévation accompagne modestement le pic de LH ?", "Une élévation de FSH", ["Une décharge d'insuline", "Une disparition d'estradiol", "Une hausse d'hCG avant grossesse"], "La hausse de FSH au milieu du cycle est plus petite.", "Cycle hypophysaire • pages 2-3"],
      ["Quel indice repère le mieux une phase lutéale ?", "Une progestérone durablement élevée", ["Une LH totalement absente", "Un pic de FSH au jour 1", "Une absence de tout stéroïde"], "La progestérone traduit l'activité du corps jaune.", "Cycle ovarien • pages 2-3"],
      ["Quel ordre hormonal est correct autour de l'ovulation ?", "Estradiol élevé, pic de LH, ovulation", ["Progestérone haute, follicule dominant, menstruation", "FSH absente, ovulation, estradiol nul", "hCG, menstruation, pic de LH"], "L'estradiol soutenu prépare la décharge de LH.", "Documents 1-2 • pages 2 et 6"],
      ["Que montre la LH hors de son pic ?", "Un niveau basal non nul", ["Une absence complète", "Une concentration toujours maximale", "Une sécrétion uniquement utérine"], "La LH reste sécrétée de manière pulsatile.", "Analyse corrigée • pages 2-3"],
      ["Pourquoi la courbe interactive utilise-t-elle un indice relatif ?", "Pour ne pas inventer des concentrations", ["Pour affirmer que toutes les hormones sont égales", "Pour supprimer l'axe du temps", "Pour diagnostiquer un trouble"], "La figure source permet une lecture qualitative, pas une mesure fiable.", "Document 1 redessiné • page 2"],
    ], short("Donne le sigle de l'hormone dont le grand pic déclenche l'ovulation.", ["LH", "L.H.", "hormone lutéinisante"], "L'hormone lutéinisante est abrégée LH.", "Cycle hypophysaire • pages 2-3")),
    corrections: [
      "Les courbes sont redessinées en indices relatifs ; aucune concentration n'est déduite des unités incohérentes de la figure.",
      "La LH reste basale et pulsatile hors du pic, elle n'est pas décrite comme absente.",
      "Le maximum du pic de LH est distingué du début de sa décharge pour éviter la formule imprécise des 48 heures.",
    ],
  },
  {
    id: "hypophysectomy-ovariectomy-experiments",
    title: "Raisonner à partir des expériences d'ablation",
    summary: "Interpréter hypophysectomie, ovariectomie, lésions, stimulations et restaurations pour établir les relations causales de l'axe reproducteur féminin.",
    pages: "4-5",
    section: "Expériences 1 à 3 sur l'hypophyse, l'hypothalamus et les ovaires",
    durationMinutes: 32,
    xp: 75,
    kind: "practice",
    body: String.raw`
## Une expérience ne vaut que si sa logique est explicite

Les pages 4 et 5 regroupent neuf manipulations réalisées chez des animaux. Pour chacune, il faut distinguer **ce qui est modifié**, **ce qui est observé** et **ce que l'on peut en déduire**. Une ablation supprime plusieurs signaux à la fois ; une injection d'extrait en ajoute plusieurs. Les résultats montrent donc des relations fonctionnelles, mais ne permettent pas toujours d'identifier à eux seuls une hormone unique.

## Série 1 : démontrer le rôle de l'hypophyse

Après **hypophysectomie** chez une femelle adulte, les ovaires s'atrophient et les cycles s'interrompent. La disparition de l'hypophyse retire les gonadostimulines qui soutenaient les follicules. À l'inverse, l'administration d'extraits hypophysaires d'adulte à une femelle immature provoque maturation folliculaire, ovulation et formation de corps jaunes. La greffe de tissu hypophysaire produit un résultat comparable. L'ensemble suppression–restauration constitue un argument causal fort : des facteurs hypophysaires diffusibles stimulent l'ovaire.

Un **extrait** n'est toutefois pas une hormone purifiée. Les expériences historiques ne suffisent donc pas à attribuer séparément chaque effet à la FSH ou à la LH ; les connaissances actuelles précisent ensuite que la FSH soutient la croissance folliculaire et que la forte décharge de LH déclenche l'ovulation.

## Série 2 : placer l'hypothalamus en amont

Une lésion de la région hypothalamique provoque une atrophie ovarienne et l'arrêt des cycles. Une stimulation électrique localisée peut au contraire provoquer une augmentation de LH, une maturation folliculaire puis une ovulation. Enfin, la section des vaisseaux portes entre hypothalamus et antéhypophyse diminue l'activité ovarienne. Ces résultats convergent : l'hypothalamus libère dans le sang porte un message chimique, la **GnRH**, qui commande l'antéhypophyse. La stimulation électrique est un outil expérimental ; le fonctionnement normal repose sur des pulses chimiques de GnRH, pas sur un courant extérieur.

## Série 3 : révéler le retour des hormones ovariennes

Après **ovariectomie**, l'antéhypophyse grossit et les concentrations de gonadostimulines augmentent. La suppression des ovaires a donc retiré un frein. L'apport prolongé de faibles doses d'estradiol et de progestérone au voisinage du complexe hypothalamo-hypophysaire abaisse FSH et LH et peut entraîner secondairement une atrophie ovarienne par défaut de stimulation. Cette interprétation concerne une exposition expérimentale chronique ; elle ne décrit pas un effet instantané ni une règle de dosage médical.

| Manipulation | Observation rapportée | Déduction prudente |
|---|---|---|
| hypophysectomie | ovaires atrophiés, cycles arrêtés | l'hypophyse est nécessaire à l'activité ovarienne |
| extraits ou greffe hypophysaires | follicules mûrs, ovulation, corps jaunes | des signaux hypophysaires circulants stimulent l'ovaire |
| lésion ou stimulation hypothalamique | activité ovarienne diminuée ou relancée | l'hypothalamus commande l'hypophyse |
| section des vaisseaux portes | activité ovarienne diminuée | un signal chimique passe par la circulation porte |
| ovariectomie | hypophyse hypertrophiée, FSH/LH élevées | l'ovaire exerce normalement un rétrocontrôle négatif |

> **Astuce mémoire — S-O-R-C :** **s**upprimer, **o**bserver, **r**estaurer, **c**onclure.
`,
    keyPoint: "Les expériences croisées établissent la commande hypothalamus → hypophyse → ovaires et le rétrocontrôle des hormones ovariennes sur les deux premiers étages.",
    example: "Ovariectomie puis hausse de FSH/LH : l'observation révèle la disparition d'un rétrocontrôle ovarien négatif.",
    methodSteps: [
      "Nommer précisément l'organe retiré, lésé, stimulé, greffé ou remplacé.",
      "Séparer l'observation mesurée de l'interprétation proposée.",
      "Chercher une restauration ou une manipulation complémentaire qui renforce la causalité.",
      "Limiter la conclusion au signal réellement testé, surtout lorsqu'un extrait non purifié est utilisé.",
    ],
    interaction: diagram(
      "Reconstituer les preuves expérimentales",
      "Sélectionne chaque manipulation pour retrouver l'observation et la relation fonctionnelle qu'elle révèle.",
      "Trois séries d'expériences complémentaires",
      "Les suppressions, restaurations et stimulations construisent ensemble une boucle ; aucune manipulation isolée ne suffit à identifier tout l'axe.",
      [
        { id: "pituitary-removal", label: "Hypophysectomie", role: "Supprimer la commande", detail: "Les ovaires s'atrophient et les cycles cessent : l'hypophyse fournit des signaux indispensables." },
        { id: "pituitary-restoration", label: "Extraits ou greffe", role: "Restaurer l'activité", detail: "Maturation folliculaire, ovulation et corps jaunes réapparaissent sous l'action de facteurs hypophysaires diffusibles." },
        { id: "hypothalamic-tests", label: "Lésion ou stimulation", role: "Tester l'étage amont", detail: "La lésion réduit l'activité, tandis que la stimulation peut augmenter la LH et provoquer l'ovulation." },
        { id: "portal-section", label: "Vaisseaux portes sectionnés", role: "Couper la transmission", detail: "La diminution de l'activité ovarienne révèle le passage d'un message hypothalamique vers l'antéhypophyse." },
        { id: "ovary-removal", label: "Ovariectomie", role: "Retirer le retour", detail: "L'hypertrophie hypophysaire et la hausse de FSH/LH montrent la disparition du frein ovarien." },
        { id: "steroid-restoration", label: "Stéroïdes à faible dose", role: "Rétablir le frein", detail: "L'estradiol et la progestérone abaissent la commande gonadotrope lors d'une exposition expérimentale prolongée." },
      ],
      "La circulation porte explique comment un petit volume de GnRH atteint efficacement l'antéhypophyse avant dilution dans la circulation générale.",
    ),
    questions: questions(39, [
      ["Quel résultat suit l'hypophysectomie d'une femelle adulte ?", "Une atrophie ovarienne et l'arrêt des cycles", ["Une ovulation permanente", "Une hausse immédiate d'hCG", "Une transformation de l'utérus en ovaire"], "La suppression des gonadostimulines prive l'ovaire de sa commande.", "Expérience 1 • page 4"],
      ["Que provoquent les extraits hypophysaires d'adulte chez une femelle immature ?", "Maturation folliculaire, ovulation et corps jaunes", ["Des menstruations sans activité ovarienne", "Une destruction de l'hypothalamus", "Une absence définitive de follicules"], "Les facteurs de l'extrait stimulent l'ovaire immature.", "Expérience 1 • page 4"],
      ["Pourquoi la greffe hypophysaire renforce-t-elle la conclusion ?", "Elle restaure une activité ovarienne après suppression de la commande", ["Elle prouve que l'utérus sécrète la GnRH", "Elle mesure directement chaque hormone", "Elle rend inutile tout témoin"], "Une restauration cohérente complète l'expérience d'ablation.", "Expérience 1 • page 4"],
      ["Quel résultat accompagne une lésion hypothalamique dans la source ?", "Une atrophie ovarienne et l'arrêt des cycles", ["Une production permanente d'hCG", "Une ovulation quotidienne", "Un corps jaune éternel"], "L'hypothalamus est situé en amont de la commande hypophysaire.", "Expérience 2 • page 4"],
      ["Quel signal augmente après une stimulation hypothalamique adaptée ?", "La LH", ["La bile", "L'hémoglobine", "La thyroxine uniquement"], "La stimulation de l'amont peut activer la sécrétion gonadotrope.", "Expérience 2 • page 4"],
      ["Que montre la section des vaisseaux portes hypothalamo-hypophysaires ?", "Un message chimique circule entre hypothalamus et antéhypophyse", ["L'ovaire touche directement l'hypothalamus", "La FSH est une hormone utérine", "Les neurones fabriquent des follicules"], "La GnRH rejoint l'antéhypophyse par cette circulation spécialisée.", "Expérience 2 • pages 4-5"],
      ["Quel changement suit l'ovariectomie ?", "Une hausse des gonadostimulines et une hypertrophie hypophysaire", ["Une disparition certaine de FSH et LH", "Une hausse obligatoire d'hCG", "Une sécrétion d'insuline par l'utérus"], "La disparition des stéroïdes retire le rétrocontrôle négatif.", "Expérience 3 • page 5"],
      ["Quel effet produit l'apport prolongé de faibles doses de stéroïdes dans l'expérience ?", "Il freine FSH et LH", ["Il détruit immédiatement l'hypophyse", "Il déclenche toujours une grossesse", "Il transforme la GnRH en progestérone"], "Estradiol et progestérone exercent ici un rétrocontrôle négatif.", "Expérience 3 • page 5"],
      ["Pourquoi un extrait hypophysaire ne permet-il pas d'attribuer un effet à une hormone unique ?", "Il peut contenir plusieurs facteurs actifs", ["Il ne contient jamais de molécule", "Il agit seulement sur l'utérus", "Il supprime toutes les variables"], "Un extrait brut ne sépare pas FSH, LH et autres constituants.", "Méthode expérimentale • page 4"],
      ["Quelle conclusion réunit les trois séries ?", "L'axe commande l'ovaire et l'ovaire rétrocontrôle l'axe", ["L'utérus commande seul l'hypophyse", "L'ovaire fonctionne sans aucun signal", "La GnRH est produite par le corps jaune"], "Les expériences montrent une commande descendante et un retour hormonal.", "Bilan expérimental • pages 4-5"],
    ], short("Nomme l'ablation chirurgicale de l'hypophyse.", ["hypophysectomie", "l'hypophysectomie"], "L'ablation de l'hypophyse est une hypophysectomie.", "Vocabulaire • page 4")),
    corrections: [
      "Les extraits hypophysaires sont décrits comme des mélanges de facteurs et non comme une dose pure de FSH ou de LH.",
      "La stimulation électrique de l'hypothalamus est séparée de la sécrétion physiologique pulsatile de GnRH.",
      "Les effets des stéroïdes sont interprétés comme ceux d'une exposition chronique et dosée, non comme une réaction instantanée universelle.",
    ],
  },
  {
    id: "hypothalamic-pituitary-ovarian-control",
    title: "Construire l'axe hypothalamo-hypophyso-ovarien",
    summary: "Ordonner GnRH, FSH, LH, estradiol et progestérone, puis relier leurs organes sources, leurs cibles et leurs effets.",
    pages: "5-7 et 13",
    section: "Interprétation des expériences et schéma de régulation du cycle féminin",
    durationMinutes: 30,
    xp: 80,
    body: String.raw`
## Premier étage : l'hypothalamus rythme la commande

Des neurones spécialisés de l'**hypothalamus** libèrent la GnRH par bouffées dans les capillaires du système porte. La GnRH parcourt une courte distance jusqu'à l'antéhypophyse. Son caractère **pulsatile** est essentiel : une concentration moyenne dessinée sur un schéma ne doit pas faire oublier que la fréquence et l'amplitude des pulses participent au réglage de la réponse gonadotrope.

Le schéma d'appariement de la page 13 énumère plusieurs organes et hormones mais omet l'hypothalamus dans certains liens proposés. Un axe complet doit commencer par lui. La relation « complexe hypothalamo-hypophysaire » ne signifie pas que les deux organes sont confondus : ils forment deux étages reliés par des neurones et des vaisseaux portes.

## Deuxième étage : l'antéhypophyse relaie

Sous l'action de la GnRH, l'**antéhypophyse** sécrète les gonadostimulines FSH et LH. La FSH soutient la croissance des follicules et l'activité de la granulosa. La LH agit notamment sur la thèque, participe à la stéroïdogenèse, déclenche l'ovulation lors de sa forte décharge et soutient la lutéinisation. Les deux hormones coopèrent ; réduire la FSH à « maturation » et la LH à « ovulation » aide à débuter mais devient insuffisant pour interpréter l'ensemble du cycle.

## Troisième étage : l'ovaire répond et informe

Le follicule dominant produit de plus en plus d'estradiol. Après l'ovulation, le corps jaune sécrète surtout de la progestérone, ainsi que de l'estradiol et de l'inhibine. Ces hormones gagnent plusieurs cibles par le sang :

- l'endomètre, qui prolifère sous estradiol puis devient sécrétoire sous progestérone ;
- le col, dont le mucus varie au cours du cycle ;
- l'hypothalamus et l'antéhypophyse, qui reçoivent l'information de retour.

La régulation forme donc une **boucle**. Une flèche vers le bas représente la commande, tandis qu'une flèche de retour représente un rétrocontrôle. Le signe de ce retour est le plus souvent négatif ; il devient positif dans la fenêtre préovulatoire lorsqu'un taux élevé d'estradiol est maintenu.

| Source | Signal | Cible immédiate | Effet majeur étudié |
|---|---|---|---|
| hypothalamus | GnRH pulsatile | antéhypophyse | libération de FSH et LH |
| antéhypophyse | FSH | follicules | croissance et sécrétion d'estradiol |
| antéhypophyse | LH | ovaire | ovulation, lutéinisation, soutien du corps jaune |
| follicule | estradiol | utérus et axe | prolifération, rétrocontrôle selon le contexte |
| corps jaune | progestérone + estradiol | utérus et axe | phase sécrétoire et frein lutéal |

Pour résoudre l'exercice de la page 13, écris toujours le nom du signal sur la liaison : un organe n'agit pas « par magie » sur un autre. Cette règle évite de relier directement l'hypothalamus à l'ovaire ou de faire produire FSH et LH par l'utérus.

> **Astuce mémoire — G-FL-EP :** **G**nRH → **F**SH/**L**H → **E**stradiol/**P**rogestérone.
`,
    keyPoint: "La GnRH pulsatile stimule l'antéhypophyse ; FSH et LH stimulent l'ovaire ; les stéroïdes ovariens agissent sur l'utérus et ferment la boucle par rétrocontrôle.",
    example: "Une section des vaisseaux portes réduit l'action de la GnRH sur l'antéhypophyse, puis diminue FSH/LH et enfin l'activité ovarienne.",
    methodSteps: [
      "Commencer par l'hypothalamus et écrire GnRH sur la première flèche.",
      "Placer l'antéhypophyse avant FSH et LH, puis préciser leurs actions ovariennes.",
      "Distinguer follicule et corps jaune pour attribuer correctement estradiol et progestérone.",
      "Fermer la boucle en indiquant la cible et le signe du rétrocontrôle.",
    ],
    interaction: diagram(
      "Parcourir la boucle ovarienne",
      "Sélectionne chaque étage pour retrouver le signal circulant et sa cible immédiate.",
      "Axe hypothalamo-hypophyso-ovarien",
      "Une commande descendante coordonne le cycle ; les hormones ovariennes renvoient en permanence une information vers les étages supérieurs.",
      [
        { id: "female-hypothalamus", label: "Hypothalamus", role: "Donner le rythme", detail: "Il libère la GnRH par pulses dans les vaisseaux portes." },
        { id: "female-pituitary", label: "Antéhypophyse", role: "Relayer", detail: "Elle répond à la GnRH en sécrétant FSH et LH dans la circulation générale." },
        { id: "female-fsh", label: "FSH", role: "Soutenir les follicules", detail: "Elle favorise la croissance folliculaire et la production d'estradiol par la granulosa." },
        { id: "female-lh", label: "LH", role: "Ovuler et lutéiniser", detail: "Sa forte décharge déclenche l'ovulation ; elle soutient ensuite le corps jaune." },
        { id: "female-ovary", label: "Ovaire", role: "Répondre et informer", detail: "Follicule et corps jaune produisent estradiol, progestérone et inhibines." },
        { id: "female-uterus", label: "Utérus", role: "Répondre aux stéroïdes", detail: "L'endomètre prolifère sous estradiol puis devient sécrétoire sous progestérone." },
        { id: "female-feedback", label: "Rétrocontrôle", role: "Fermer la boucle", detail: "Les signaux ovariens modulent l'hypothalamus et l'antéhypophyse selon le moment du cycle." },
      ],
      "L'hypothalamus manquant dans certains appariements de la page 13 est rétabli : sans lui, la chaîne de commande serait incomplète.",
    ),
    questions: questions(49, [
      ["Quel organe libère la GnRH ?", "L'hypothalamus", ["L'endomètre", "Le corps jaune", "L'épididyme"], "Des neurones hypothalamiques sécrètent la GnRH.", "Schéma de régulation • pages 6-7"],
      ["Où la GnRH agit-elle directement ?", "Sur l'antéhypophyse", ["Sur l'ovocyte dans la trompe", "Sur le myomètre uniquement", "Sur le corps jaune sans relais"], "Elle atteint les cellules gonadotropes par la circulation porte.", "Interprétation • pages 5-7"],
      ["Quelles hormones l'antéhypophyse sécrète-t-elle dans cet axe ?", "FSH et LH", ["Estradiol et progestérone", "hCG et insuline", "Testostérone et inhibine uniquement"], "FSH et LH sont les gonadostimulines hypophysaires.", "Schéma de régulation • pages 6-7"],
      ["Quelle action appartient surtout à la FSH ?", "Soutenir la croissance folliculaire", ["Déclencher seule la menstruation", "Produire la GnRH", "Transformer le myomètre en endomètre"], "La FSH agit sur les cellules folliculaires.", "Interprétation • pages 5-6"],
      ["Quelle action appartient à la forte décharge de LH ?", "Déclencher l'ovulation", ["Détruire la couche basale", "Produire l'estradiol dans l'utérus", "Bloquer toute lutéinisation"], "Le pic de LH déclenche la rupture folliculaire.", "Cycle hormonal • pages 2-3 et 6"],
      ["Quelle structure sécrète surtout la progestérone ?", "Le corps jaune", ["L'antéhypophyse", "Le follicule primordial", "Le col utérin"], "Le corps jaune devient la principale source postovulatoire.", "Schéma de régulation • pages 6-7"],
      ["Quelle cible utérine répond aux hormones ovariennes ?", "L'endomètre", ["Le cristallin", "Le cartilage", "La moelle épinière"], "Estradiol et progestérone modifient la muqueuse utérine.", "Cycle utérin • pages 2-3"],
      ["Pourquoi la régulation est-elle une boucle ?", "Les hormones ovariennes modulent en retour l'axe", ["Les organes sont disposés en cercle", "Le sang ne quitte jamais l'ovaire", "La FSH retourne dans l'hypothalamus comme neurone"], "Le rétrocontrôle ferme la chaîne fonctionnelle.", "Bilan • pages 6-7"],
      ["Quel trajet est scientifiquement complet ?", "Hypothalamus, GnRH, antéhypophyse, FSH/LH, ovaire", ["Utérus, GnRH, ovaire, LH", "Ovaire, FSH, hypothalamus, endomètre", "Antéhypophyse, estradiol, GnRH, trompe"], "Chaque signal est placé entre sa source et sa cible.", "Exercice d'appariement corrigé • page 13"],
      ["Pourquoi préciser que la GnRH est pulsatile ?", "Son rythme participe au contrôle des gonadostimulines", ["Elle est une onde électrique externe", "Elle n'agit qu'une fois dans la vie", "Elle est stockée dans l'endomètre"], "La représentation statique ne montre pas les bouffées physiologiques.", "Précision du schéma • pages 6-7"],
    ], short("Écris les deux sigles des gonadostimulines hypophysaires.", ["FSH et LH", "LH et FSH", "FSH/LH", "LH/FSH"], "Les gonadostimulines de cet axe sont FSH et LH.", "Bilan hormonal • pages 6-7")),
    corrections: [
      "L'hypothalamus est rétabli comme premier étage malgré son omission dans certains appariements de la page 13.",
      "La GnRH est décrite comme pulsatile et transportée par le système porte, non comme une concentration constante allant directement à l'ovaire.",
      "FSH et LH sont présentées comme coopérantes, avec des rôles dominants mais non mutuellement exclusifs.",
    ],
  },
  {
    id: "female-negative-positive-feedback",
    title: "Distinguer rétrocontrôles négatif et positif",
    summary: "Expliquer pourquoi les hormones ovariennes freinent généralement l'axe, puis pourquoi un estradiol élevé et maintenu déclenche le pic de LH.",
    pages: "6-7 et 14-15",
    section: "Rétrocontrôles du cycle ovarien et exercice de synthèse",
    durationMinutes: 31,
    xp: 90,
    kind: "graph",
    body: String.raw`
## Le rétrocontrôle négatif domine

Un rétrocontrôle est **négatif** lorsqu'un produit formé en aval diminue l'activité des étages qui le commandent. Au début et au milieu de la phase folliculaire, un taux faible à modéré d'estradiol, associé notamment à l'inhibine B folliculaire, limite la sécrétion de gonadostimulines. La baisse relative de FSH contribue à la sélection du follicule dominant, tandis que les follicules moins sensibles entrent en atrésie.

Après l'ovulation, le corps jaune sécrète progestérone, estradiol et inhibine A. Cet ensemble ralentit GnRH, FSH et LH. Le frein lutéal empêche normalement le recrutement immédiat d'une nouvelle ovulation. Dire « la progestérone bloque tout » serait excessif : les sécrétions basales persistent et plusieurs hormones coopèrent.

## Une exception brève prépare l'ovulation

En fin de phase folliculaire, le follicule dominant produit un taux d'estradiol **élevé et maintenu**. Dans ce contexte précis, le signe du retour s'inverse. L'hypothalamus et l'antéhypophyse répondent par une forte décharge de LH, accompagnée d'une plus petite élévation de FSH. Ce rétrocontrôle positif préovulatoire rend possible l'ovulation.

L'estradiol n'est donc ni toujours inhibiteur ni toujours stimulateur. Son effet dépend du niveau atteint, de la durée et du contexte du cycle. Une seule valeur isolée, sans chronologie, ne permet pas de choisir le signe du rétrocontrôle.

## Fermer le cycle sans grossesse

Après l'ovulation, la progestérone élevée rétablit un rétrocontrôle négatif. Sans hCG embryonnaire, le corps jaune régresse en fin de cycle ; estradiol et progestérone chutent. La couche fonctionnelle de l'endomètre perd son soutien et les menstruations commencent. Dans le même temps, la levée progressive du frein permet à la FSH de remonter et d'engager une nouvelle cohorte folliculaire.

| Moment | Profil ovarien | Retour sur l'axe | Conséquence |
|---|---|---|---|
| phase folliculaire ordinaire | estradiol faible à modéré | négatif | FSH contenue, sélection folliculaire |
| fenêtre préovulatoire | estradiol élevé et maintenu | positif | pic de LH puis ovulation |
| phase lutéale | progestérone + estradiol | négatif | gonadostimulines freinées |
| fin de cycle sans grossesse | stéroïdes en chute | levée du frein | règles puis nouveau recrutement |

La courbe interactive suit l'estradiol en **indice relatif** : elle met en évidence la montée préovulatoire, une baisse autour de l'ovulation et une élévation lutéale plus modeste. Elle ne représente ni une norme clinique ni la variabilité de toutes les personnes.

> **Astuce mémoire — presque toujours moins, brièvement plus :** le retour négatif domine ; l'exception positive déclenche l'ovulation.
`,
    keyPoint: "Les stéroïdes ovariens freinent surtout l'axe ; seul un estradiol préovulatoire élevé et maintenu provoque le rétrocontrôle positif et la décharge de LH.",
    example: "Estradiol haut depuis un temps suffisant, progestérone encore basse et LH qui s'élève fortement : la fenêtre de rétrocontrôle positif est ouverte.",
    methodSteps: [
      "Identifier la phase du cycle avant de donner le signe du retour hormonal.",
      "Lire ensemble estradiol, progestérone, FSH et LH plutôt qu'une courbe isolée.",
      "Réserver le signe positif à l'estradiol préovulatoire élevé et maintenu.",
      "Relier la chute lutéale des stéroïdes aux règles et à la levée du frein sur la FSH.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe cyclique redessinée",
      title: "Repérer la fenêtre positive de l'estradiol",
      instruction: "Déplace le repère et compare le grand maximum préovulatoire à la remontée lutéale plus faible.",
      formula: "Indice relatif d'estradiol selon le jour du cycle",
      rule: { kind: "samples", points: [[1, 3], [5, 4], [8, 6], [10, 10], [12, 18], [13, 24], [14, 16], [16, 8], [19, 11], [22, 14], [25, 8], [28, 3]] },
      window: { xMin: 1, xMax: 28, yMin: 0, yMax: 26 },
      guides: [
        { kind: "vertical", value: 13, label: "estradiol préovulatoire élevé" },
        { kind: "vertical", value: 14, label: "ovulation du modèle" },
      ],
      marker: { min: 1, max: 28, step: 1, initial: 13 },
      observation: "La hauteur est un indice qualitatif : le rétrocontrôle positif dépend d'une élévation soutenue et non d'un jour de calendrier isolé.",
    },
    questions: questions(59, [
      ["Quel rétrocontrôle domine la majeure partie du cycle féminin ?", "Le rétrocontrôle négatif", ["Le rétrocontrôle positif permanent", "Aucun retour hormonal", "Un réflexe musculaire"], "Les hormones ovariennes freinent habituellement l'axe.", "Interprétation • pages 6-7"],
      ["Quelle condition prépare le rétrocontrôle positif ?", "Un estradiol élevé et maintenu", ["Une progestérone nulle pendant toute la vie", "Une FSH absente", "Une chute d'hCG avant fécondation"], "Le contexte préovulatoire transforme temporairement le signe du retour.", "Schéma de régulation • pages 6-7"],
      ["Quelle conséquence majeure suit ce retour positif ?", "Le pic de LH", ["La disparition de l'ovaire", "La menstruation immédiate", "La production d'insuline"], "La décharge de LH déclenche ensuite l'ovulation.", "Cycle hormonal • pages 2 et 6"],
      ["Quel profil maintient le rétrocontrôle négatif pendant la phase lutéale ?", "Progestérone, estradiol et inhibine du corps jaune", ["LH seule à son maximum", "hCG chez toute personne", "FSH seule sans ovaire"], "Plusieurs produits lutéaux participent au frein.", "Bilan • pages 6-7"],
      ["Pourquoi l'estradiol n'a-t-il pas toujours le même effet sur l'axe ?", "Son niveau, sa durée et le contexte changent", ["Il change d'organe source chaque minute", "Il devient une enzyme", "Il n'atteint jamais l'hypophyse"], "Le signe dépend du profil temporel et du moment du cycle.", "Interprétation enrichie • pages 6-7"],
      ["Que favorise la diminution relative de FSH pendant la phase folliculaire ?", "La sélection du follicule dominant", ["La création d'un second utérus", "La fécondation automatique", "La disparition de tous les ovocytes"], "Les follicules moins sensibles régressent par atrésie.", "Cycle ovarien • pages 2-3"],
      ["Que provoque la chute des stéroïdes sans grossesse ?", "La perte du soutien endométrial", ["Un maintien permanent du corps jaune", "Un pic durable d'hCG", "Une seconde ovulation immédiate"], "La chute d'estradiol et de progestérone prépare les règles.", "Exercice 3 • pages 14-15"],
      ["Que signifie la levée du frein hormonal en fin de cycle ?", "La FSH peut recommencer à augmenter", ["La GnRH disparaît définitivement", "L'endomètre produit un ovaire", "La LH reste toujours au maximum"], "Un nouveau recrutement folliculaire peut s'amorcer.", "Bilan du cycle • pages 14-15"],
      ["Quel signal maintient le corps jaune en début de grossesse ?", "L'hCG embryonnaire", ["La FSH seule", "La mélatonine", "La chute de progestérone"], "L'hCG maintient temporairement la fonction lutéale.", "Interprétation enrichie • pages 3 et 15"],
      ["Pourquoi la courbe est-elle exprimée en indice relatif ?", "Pour conserver la dynamique sans inventer une unité clinique", ["Pour dire que tous les cycles sont identiques", "Pour calculer une contraception", "Pour remplacer toute analyse biologique"], "Les unités et échelles du document ne permettent pas une mesure clinique fiable.", "Courbes corrigées • pages 2 et 6"],
    ], short("Donne le signe du rétrocontrôle qui précède le pic de LH.", ["positif", "rétrocontrôle positif", "retrocontrole positif", "+"], "L'estradiol élevé et maintenu exerce alors un rétrocontrôle positif.", "Schéma de régulation • pages 6-7")),
    corrections: [
      "L'effet de l'estradiol est contextualisé : négatif à taux faible ou modéré, positif lorsqu'il est élevé et maintenu avant l'ovulation.",
      "Le frein lutéal est attribué à la combinaison progestérone, estradiol et inhibine, et non à une hormone unique.",
      "Les menstruations sont reliées à la chute des stéroïdes ovariens et non à une action directe d'une FSH ou d'une LH basse.",
    ],
  },
  {
    id: "male-hypothalamic-pituitary-testicular-control",
    title: "Comprendre le fonctionnement testiculaire",
    summary: "Relier anatomie du testicule, spermatogenèse, maturation épididymaire, cellules de Sertoli et de Leydig à la commande hormonale masculine.",
    pages: "7-10 et 12",
    section: "Expériences et schéma du fonctionnement des organes sexuels masculins",
    durationMinutes: 36,
    xp: 100,
    body: String.raw`
## Une double fonction portée par le testicule

Le testicule possède une fonction **exocrine**, la production de spermatozoïdes, et une fonction **endocrine**, la production de testostérone. Les tubes séminifères contiennent les cellules germinales associées aux cellules de Sertoli. Entre les tubes, le tissu interstitiel contient les cellules de Leydig. Cette organisation permet de comprendre pourquoi une même commande hypophysaire utilise deux hormones et deux grandes cibles cellulaires.

À la puberté, la **gonadarche** s'accompagne d'une augmentation du volume testiculaire, premier repère clinique de la mise en activité des gonades. Après cette installation, le fonctionnement testiculaire est globalement continu et stabilisé par un rétrocontrôle négatif, contrairement à la succession cyclique des événements ovariens.

La sortie suit un trajet organisé : lumière des tubes séminifères → tubes droits et réseau testiculaire → canaux efférents → **épididyme** → canal déférent. L'épididyme n'est pas un simple tuyau : les spermatozoïdes y acquièrent progressivement motilité et compétences fonctionnelles et sont stockés surtout dans sa queue. La **capacitation**, indispensable à la fécondation, se déroule plus tard dans les voies génitales féminines ; elle n'est pas achevée dans le testicule.

## De la spermatogonie au spermatozoïde

Près de la paroi du tube, les spermatogonies se multiplient par mitoses. Certaines deviennent spermatocytes I. La méiose I produit des spermatocytes II haploïdes, puis la méiose II donne des spermatides. La **spermiogenèse** transforme ensuite chaque spermatide en spermatozoïde : condensation du noyau, formation de l'acrosome et du flagelle, élimination d'une partie du cytoplasme. Cette dernière étape est une différenciation, **sans nouvelle division cellulaire**.

Les cellules de **Sertoli** nourrissent et accompagnent les cellules germinales, forment la barrière hémato-testiculaire, phagocytent les corps résiduels et sécrètent notamment inhibine B et protéine de liaison aux androgènes, ou ABP. L'ABP maintient localement une forte concentration de testostérone ; elle ne doit pas être confondue avec l'inhibine B.

## La commande hypothalamo-hypophyso-testiculaire

La GnRH pulsatile stimule l'antéhypophyse. La **LH stimule les cellules de Leydig, qui produisent la testostérone**. La **FSH** cible principalement les cellules de Sertoli ; avec une forte concentration locale de testostérone, elle soutient la spermatogenèse. La testostérone exerce un rétrocontrôle négatif sur l'hypothalamus et l'antéhypophyse. L'inhibine B produite par Sertoli freine plus sélectivement la FSH.

La FSH et la testostérone **coopèrent** au maintien de la spermatogenèse. La testostérone diffuse dans les tubes et agit par les récepteurs androgéniques des cellules de Sertoli ; elle n'est pas présentée comme stimulant directement les cellules germinales. Les Sertoli traduisent ainsi le signal hormonal en soutien métabolique et structural de la lignée germinale.

Les expériences des pages 7 à 10 soutiennent cette répartition. L'ablation de l'hypophyse réduit l'activité testiculaire ; l'administration de gonadostimulines peut la restaurer. Une destruction des cellules de Leydig diminue la testostérone et perturbe indirectement la spermatogenèse, tandis qu'une atteinte des tubes séminifères peut réduire la production de spermatozoïdes sans supprimer immédiatement toute testostérone. L'exercice de la page 12 demande précisément de relier un traitement, une observation et la cellule cible.

| Signal | Cible principale | Effet | Retour |
|---|---|---|---|
| GnRH | antéhypophyse | libération de FSH et LH | freinée par la testostérone |
| LH | Leydig | production de testostérone | testostérone freine GnRH/LH |
| FSH | Sertoli | soutien de la spermatogenèse | inhibine B freine surtout FSH |
| testostérone + ABP | tubes séminifères | milieu androgenisé nécessaire | ABP n'est pas une hormone de rétrocontrôle |

Il faut enfin distinguer **spermatozoïde** et **sperme**. Le spermatozoïde est une cellule produite par le testicule ; le sperme est le liquide éjaculé qui contient des spermatozoïdes et des sécrétions des vésicules séminales, de la prostate et d'autres glandes. Une concentration ou une mobilité s'évalue par un examen adapté, jamais par une impression visuelle seule.

> **Astuce mémoire — FSH–Sertoli, LH–Leydig :** les initiales S et L permettent d'associer chaque gonadostimuline à sa cellule cible.
`,
    keyPoint: "La FSH agit surtout sur Sertoli, la LH sur Leydig ; testostérone et inhibine B ferment des boucles négatives tandis que l'épididyme assure la maturation post-testiculaire.",
    example: "Après atteinte sélective des cellules de Leydig, la testostérone baisse ; la LH tend à augmenter par levée du rétrocontrôle et la spermatogenèse est fragilisée.",
    methodSteps: [
      "Repérer tubes séminifères, tissu interstitiel, Sertoli, Leydig et voies de sortie.",
      "Ordonner mitoses, méiose I, méiose II puis spermiogenèse.",
      "Associer FSH à Sertoli et LH à Leydig avant d'ajouter testostérone et inhibine B.",
      "Distinguer production testiculaire, maturation épididymaire, capacitation et composition du sperme.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Anatomie fonctionnelle originale",
      title: "Explorer le testicule et ses voies de sortie",
      instruction: "Sélectionne chaque repère pour relier localisation, cellule, production et étape de maturation.",
      viewBox: "0 0 720 540",
      caption: "Schéma pédagogique redessiné à partir des expériences du fascicule ; aucune coupe scannée n'est reprise.",
      shapes: testisShapes,
      hotspots: testisHotspots,
      observation: "Les cellules de Sertoli sont dans les tubes séminifères ; les cellules de Leydig sont entre les tubes ; l'épididyme intervient après la production testiculaire.",
    },
    questions: questions(69, [
      ["Où se déroule la spermatogenèse ?", "Dans les tubes séminifères", ["Dans la prostate", "Dans le canal déférent", "Dans les vésicules séminales"], "Les cellules germinales se différencient dans l'épithélium séminifère.", "Organisation testiculaire • pages 7-9"],
      ["Quelle cellule est la cible principale de la FSH dans le testicule ?", "La cellule de Sertoli", ["La cellule de Leydig", "Le spermatozoïde éjaculé", "La cellule du myomètre"], "La FSH soutient les fonctions de Sertoli.", "Schéma de régulation • pages 9-10"],
      ["Quelle cellule répond surtout à la LH ?", "La cellule de Leydig", ["La spermatide", "La cellule de l'endomètre", "La cellule de Sertoli uniquement"], "La LH stimule la stéroïdogenèse des cellules interstitielles.", "Expériences masculines • pages 8-10"],
      ["Quelle hormone les cellules de Leydig produisent-elles ?", "La testostérone", ["La GnRH", "La FSH", "La progestérone lutéale"], "Les Leydig assurent la fonction endocrine androgénique.", "Bilan expérimental • pages 9-10"],
      ["Quel ordre de cellules germinales est correct ?", "Spermatogonie, spermatocyte I, spermatocyte II, spermatide, spermatozoïde", ["Spermatozoïde, spermatogonie, ovocyte", "Spermatide, Leydig, follicule", "Sertoli, spermatogonie, corps jaune"], "Mitoses, méioses puis différenciation ordonnent la lignée.", "Synthèse de la spermatogenèse • pages 8-9"],
      ["Que représente la spermiogenèse ?", "Une différenciation sans nouvelle division", ["Une méiose III", "Une fécondation", "Une division de Leydig"], "La spermatide acquiert la forme du spermatozoïde.", "Précision scientifique • pages 8-9"],
      ["Quel rôle appartient à l'épididyme ?", "La maturation fonctionnelle des spermatozoïdes", ["La production de GnRH", "L'ovulation", "La formation du corps jaune"], "Motilité et compétences fonctionnelles s'acquièrent après la sortie du testicule.", "Voies génitales masculines • pages 8-9"],
      ["Quel signal freine plus sélectivement la FSH ?", "L'inhibine B", ["L'ABP", "La GnRH", "L'hCG"], "Sertoli sécrète l'inhibine B en relation avec l'activité séminifère.", "Régulation masculine • pages 9-10"],
      ["Quel rôle joue l'ABP ?", "Maintenir une forte concentration locale d'androgènes", ["Freiner sélectivement la FSH", "Déclencher la menstruation", "Transporter la GnRH vers l'ovaire"], "La protéine lie les androgènes dans les tubes séminifères.", "Précision Sertoli • pages 9-10"],
      ["Quelle différence sépare spermatozoïde et sperme ?", "Le premier est une cellule, le second un liquide contenant cellules et sécrétions", ["Ce sont deux noms du testicule", "Le sperme est une hormone", "Le spermatozoïde est une glande"], "Les glandes annexes contribuent à la composition du sperme.", "Anatomie fonctionnelle • pages 8-10"],
    ], short("Nomme l'organe où les spermatozoïdes mûrissent après leur sortie du testicule.", ["épididyme", "l'épididyme", "epididyme", "l'epididyme"], "La maturation post-testiculaire se poursuit dans l'épididyme.", "Voies génitales masculines • pages 8-9")),
    corrections: [
      "La FSH est associée à Sertoli et la LH à Leydig ; la testostérone n'est pas décrite comme sans effet sur la FSH.",
      "L'inhibine B, rétrocontrôle sélectif de la FSH, est distinguée de l'ABP qui maintient localement les androgènes.",
      "La spermiogenèse est une différenciation sans division et la capacitation est replacée plus tard dans les voies féminines.",
      "Le spermatozoïde est distingué du sperme, qui contient aussi les sécrétions des glandes annexes.",
    ],
  },
  {
    id: "hormonal-contraception-mechanisms",
    title: "Expliquer la contraception hormonale",
    summary: "Relier les méthodes hormonales modernes à l'ovulation, au mucus cervical et à l'endomètre, en distinguant prévention, urgence et protection contre les IST.",
    pages: "10-11",
    section: "Mode d'action de la pilule et documents sur la contraception",
    durationMinutes: 31,
    xp: 110,
    kind: "practice",
    body: String.raw`
## Agir sur l'axe sans confondre les méthodes

Une contraception hormonale apporte un **progestatif**, seul ou associé à un œstrogène selon la méthode. L'apport hormonal modifie le rétrocontrôle du complexe hypothalamo-hypophysaire. Pour une méthode combinée correctement utilisée, FSH et LH sont suffisamment freinées pour empêcher la maturation folliculaire complète et surtout le pic ovulatoire de LH. L'ovulation est ainsi généralement inhibée.

Une contraception hormonale peut donc inhiber l'ovulation et épaissir la **glaire cervicale**, autre nom du mucus cervical. Ces deux mécanismes ne protègent cependant pas contre les infections sexuellement transmissibles.

Le fascicule oppose « pilule normodosée » et « pilule microdosée » d'une manière devenue imprécise. Une pilule **combinée** contient œstrogène et progestatif, à des doses variables. La **minipilule est progestative seule** : elle contient seulement un progestatif ; son efficacité repose notamment sur l'épaississement du mucus cervical et, selon la molécule et la dose, sur une inhibition plus ou moins constante de l'ovulation. Elle n'est donc pas simplement une pilule combinée à très faible dose.

## Plusieurs verrous complémentaires

Le progestatif rend le **mucus cervical** plus épais et moins perméable aux spermatozoïdes. Il modifie aussi l'endomètre, qui devient moins favorable à une implantation. Selon la méthode, l'inhibition de l'ovulation reste le mécanisme principal ou l'un des mécanismes. Il faut présenter ces actions dans leur ordre et ne pas transformer une modification endométriale en interruption d'une grossesse installée.

Les schémas en « 21 comprimés puis 7 jours » sont un exemple historique de prise cyclique, pas un calendrier universel. Il existe des plaquettes et des schémas continus différents. Le saignement de l'intervalle sans hormones est souvent un **saignement de privation** et non la preuve qu'un cycle ovarien naturel s'est déroulé.

## Contraception d'urgence et prévention des infections

La contraception d'urgence au lévonorgestrel ou à l'ulipristal agit surtout en **retardant ou empêchant l'ovulation** lorsqu'elle n'a pas encore eu lieu. Elle n'a aucun effet sur une grossesse déjà implantée et son mécanisme ne repose pas sur l'implantation. Le dispositif intra-utérin au cuivre peut aussi être utilisé en urgence dans un cadre de santé, avec une très grande efficacité.

Aucune méthode hormonale ne protège des **infections sexuellement transmissibles**. Les préservatifs externe et interne contribuent à cette protection et peuvent être associés à une autre contraception. Le choix dépend de la santé, des préférences, de l'accès et d'un conseil qualifié ; aucune méthode ne justifie la culpabilisation d'une personne. En cas d'oubli, de vomissements proches d'une prise, d'interaction médicamenteuse ou de doute, il faut consulter la notice et un professionnel plutôt que d'improviser une règle unique.

| Méthode ou composant | Action principale à retenir | Limite à ne pas oublier |
|---|---|---|
| combinée œstrogène–progestatif | inhibition du pic de LH et de l'ovulation | contre-indications à évaluer médicalement |
| progestatif seul | mucus cervical épaissi, ovulation variable selon le produit | régularité de prise importante pour certaines pilules |
| urgence hormonale | retarde ou empêche l'ovulation | n'interrompt pas une grossesse établie |
| préservatif | barrière et réduction du risque d'IST | usage correct à chaque rapport |

> **Astuce mémoire — A-M-E :** agir sur l'**a**xe, épaissir le **m**ucus, modifier l'**e**ndomètre.
`,
    keyPoint: "Les contraceptions hormonales freinent l'axe et/ou épaississent le mucus ; l'urgence retarde l'ovulation, et seul un moyen barrière contribue aussi à la protection contre les IST.",
    example: "Sous méthode combinée correctement utilisée, l'absence de pic de LH empêche généralement l'ovulation ; un saignement de privation ne prouve pas un cycle naturel.",
    methodSteps: [
      "Identifier si la méthode est combinée, progestative seule, d'urgence ou non hormonale.",
      "Relier chaque composant à l'axe, au mucus et éventuellement à l'endomètre.",
      "Distinguer contraception avant grossesse, contraception d'urgence et interruption d'une grossesse.",
      "Ajouter systématiquement la question des IST, de l'usage réel et du conseil de santé.",
    ],
    interaction: diagram(
      "Comparer les mécanismes contraceptifs",
      "Sélectionne chaque mécanisme et identifie sa cible, son effet et sa limite.",
      "Prévenir une grossesse avant qu'elle ne débute",
      "Les méthodes n'agissent ni toutes au même endroit ni avec les mêmes contraintes ; le choix doit être individualisé et informé.",
      [
        { id: "contraception-axis", label: "Frein de l'axe", role: "Empêcher le pic ovulatoire", detail: "Les méthodes combinées inhibent suffisamment FSH/LH pour empêcher généralement l'ovulation." },
        { id: "contraception-mucus", label: "Mucus cervical", role: "Former une barrière", detail: "Les progestatifs épaississent le mucus et rendent le passage des spermatozoïdes plus difficile." },
        { id: "contraception-endometrium", label: "Endomètre", role: "Modifier la muqueuse", detail: "Les progestatifs maintiennent souvent un endomètre plus fin ; ce mécanisme n'est pas une interruption de grossesse." },
        { id: "contraception-emergency", label: "Contraception d'urgence", role: "Décaler l'ovulation", detail: "Lévonorgestrel et ulipristal retardent ou empêchent surtout l'ovulation si elle n'a pas encore eu lieu." },
        { id: "contraception-condom", label: "Préservatif", role: "Réduire aussi le risque d'IST", detail: "Le moyen barrière peut compléter une méthode hormonale et reste le repère de protection infectieuse." },
        { id: "contraception-advice", label: "Conseil de santé", role: "Adapter et sécuriser", detail: "Contre-indications, oublis, interactions et préférences demandent une information personnalisée." },
      ],
      "Une méthode contraceptive empêche une grossesse avant son établissement ; elle ne se définit pas par une action sur une grossesse déjà implantée.",
    ),
    questions: questions(79, [
      ["Quel effet central recherche une pilule combinée ?", "Empêcher le pic de LH et l'ovulation", ["Déclencher une ovulation quotidienne", "Produire une hCG permanente", "Détruire l'hypothalamus"], "Le rétrocontrôle hormonal freine la commande gonadotrope.", "Contraception hormonale • pages 10-11"],
      ["Que contient une contraception hormonale combinée ?", "Un œstrogène et un progestatif", ["Deux antibiotiques", "FSH et LH", "Testostérone et hCG"], "Le mot combinée renvoie à ces deux catégories hormonales.", "Précision du document • pages 10-11"],
      ["Que contient une pilule progestative ?", "Un progestatif seul", ["Toujours un œstrogène à forte dose", "De la GnRH", "Un vaccin"], "Elle ne doit pas être confondue avec une combinée faiblement dosée.", "Correction terminologique • pages 10-11"],
      ["Quel effet cervical exerce le progestatif ?", "Il épaissit le mucus cervical", ["Il supprime le col", "Il transforme le mucus en ovocyte", "Il déclenche le pic de LH"], "Un mucus moins perméable limite le passage des spermatozoïdes.", "Mode d'action • pages 10-11"],
      ["Que représente souvent le saignement pendant une pause hormonale ?", "Un saignement de privation", ["La preuve d'une ovulation certaine", "Une grossesse", "Une méiose ovarienne"], "La baisse artificielle des hormones provoque ce saignement.", "Schéma de prise corrigé • page 11"],
      ["Comment agit principalement une contraception d'urgence hormonale ?", "Elle retarde ou empêche l'ovulation", ["Elle interrompt une grossesse implantée", "Elle détruit l'endomètre définitivement", "Elle protège des IST"], "Elle intervient avant l'établissement d'une grossesse.", "Précision moderne • pages 10-11"],
      ["Quelle méthode contribue aussi à réduire le risque d'IST ?", "Le préservatif", ["La pilule combinée", "La pilule progestative", "La contraception d'urgence"], "Les méthodes hormonales ne protègent pas des infections.", "Prévention enrichie • pages 10-11"],
      ["Pourquoi le schéma 21 jours plus 7 jours n'est-il pas universel ?", "Les produits et schémas de prise diffèrent", ["Toute contraception dure exactement 28 jours", "Les hormones n'ont aucun effet", "Il n'existe aucune prise continue"], "Des prises continues et d'autres présentations existent.", "Schéma de prise • page 11"],
      ["Que faire en cas d'oubli ou d'interaction médicamenteuse ?", "Consulter la notice et un professionnel qualifié", ["Doubler toujours toutes les doses", "Attendre une grossesse", "Arrêter toute prévention sans avis"], "La conduite dépend du produit et du délai.", "Conseil de santé enrichi • pages 10-11"],
      ["Pourquoi le choix contraceptif doit-il rester non stigmatisant ?", "Il dépend de la santé, des préférences et de l'accès", ["Une seule méthode convient à tout le monde", "Les symptômes révèlent la moralité", "Le calendrier suffit toujours"], "L'information et le consentement guident le choix.", "Situation reformulée • pages 1 et 10-11"],
    ], short("Nomme le moyen barrière qui contribue aussi à la protection contre les IST.", ["préservatif", "le préservatif", "préservatif externe", "préservatif interne", "preservatif"], "Les préservatifs peuvent compléter une contraception hormonale.", "Prévention enrichie • pages 10-11")),
    corrections: [
      "La pilule combinée œstrogène–progestatif est distinguée de la pilule progestative seule, au lieu de les réduire à une différence de dose.",
      "La contraception d'urgence retarde ou inhibe l'ovulation ; elle n'interrompt pas une grossesse implantée.",
      "Le schéma 21/7 est présenté comme un exemple et le saignement associé comme un saignement de privation, non comme un cycle naturel obligatoire.",
      "La protection contre les IST et le conseil individualisé sont ajoutés sans jugement ni stigmatisation.",
    ],
  },
  {
    id: "human-sexual-organs-final-mission",
    title: "Mission : expertiser un dossier reproducteur",
    summary: "Mobiliser expériences, courbes, anatomie et contraception pour corriger un dossier mêlant cycle féminin, commande testiculaire et prévention.",
    pages: "12-15",
    section: "Activités d'application, appariements, vrai-faux et exercice sur les menstruations",
    durationMinutes: 42,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## Le dossier à expertiser

Un centre scolaire prépare une fiche intitulée « Comment fonctionnent les organes sexuels humains ? ». Il fournit quatre documents inspirés des évaluations des pages 12 à 15 : une expérience chez un mammifère mâle, sept propositions à apparier, une série de vrai-faux et un schéma d'endomètre pendant un cycle modèle. Ton équipe doit produire une conclusion scientifiquement solide, respectueuse et compréhensible.

### Document A — expérience masculine

Un premier lot possède une hypophyse fonctionnelle. Un deuxième subit une hypophysectomie : les testicules diminuent d'activité, la testostérone baisse et la production de spermatozoïdes est perturbée. Un traitement par gonadostimulines améliore certaines fonctions. Pour interpréter, sépare les deux voies : FSH → Sertoli → soutien de la spermatogenèse et inhibine B ; LH → Leydig → testostérone. La testostérone est aussi nécessaire localement, avec l'ABP, au bon déroulement de la spermatogenèse.

### Document B — reconstruire les liaisons

Les mots « hypophyse », « ovaire », « utérus », « FSH/LH », « estradiol/progestérone » et « rétrocontrôle » doivent être ordonnés. La liste source oublie parfois l'hypothalamus : ajoute-le avec la GnRH. Une réponse complète devient : hypothalamus —GnRH→ antéhypophyse —FSH/LH→ ovaire —estradiol/progestérone→ endomètre, avec un retour hormonal vers l'hypothalamus et l'antéhypophyse.

### Document C — contrôler les affirmations

Pour chaque proposition, exige un mécanisme. « La FSH agit sur les cellules de Leydig » est faux : elle cible principalement Sertoli. « La LH stimule Leydig » est vrai. « L'inhibine B est l'ABP » est faux : l'une rétrocontrôle surtout FSH, l'autre lie localement les androgènes. « L'estradiol exerce toujours un rétrocontrôle positif » est faux : le signe positif n'apparaît que dans la fenêtre préovulatoire adéquate. Une correction doit remplacer l'erreur, pas seulement écrire « faux ».

### Document D — expliquer les menstruations

Jours 1 à 5 du modèle : la couche fonctionnelle de l'endomètre est partiellement éliminée après la chute d'estradiol et de progestérone. Jours 5 à 14 : l'estradiol folliculaire stimule la prolifération. Après l'ovulation : la progestérone du corps jaune transforme l'endomètre en muqueuse sécrétoire. Sans grossesse, le corps jaune régresse et les stéroïdes chutent de nouveau. La phrase du corrigé page 15 qui attribue la destruction à de faibles taux de FSH/LH est donc reformulée : ces hormones agissent sur l'ovaire, tandis que l'endomètre répond directement aux stéroïdes ovariens.

## Production attendue

1. Construis deux axes, féminin et masculin, avec chaque signal écrit sur sa flèche.
2. Analyse l'expérience A en trois colonnes : manipulation, observation, conclusion.
3. Corrige les propositions sans confondre Sertoli, Leydig, inhibine B et ABP.
4. Explique le cycle utérin sans imposer un jour 14 universel.
5. Ajoute une recommandation contraceptive : mécanisme, limite et protection contre les IST.

| Indice du dossier | Conclusion recevable | Conclusion à écarter |
|---|---|---|
| testostérone basse après hypophysectomie | la LH hypophysaire soutient Leydig | l'utérus produit la testostérone |
| progestérone haute après ovulation | un corps jaune fonctionne | une grossesse est certaine |
| hormones ovariennes en chute | le soutien de l'endomètre disparaît | FSH/LH détruisent directement l'endomètre |
| absence de pic de LH sous combinée | ovulation généralement inhibée | protection automatique contre les IST |

La réponse finale doit aussi reconnaître les limites : les courbes sont relatives, une expérience animale ne remplace pas une consultation, et ni un symptôme ni une date de calendrier ne diagnostique une grossesse ou une ovulation. Cette prudence ne diminue pas la valeur du raisonnement ; elle en définit la portée.

> **Astuce finale — Source, signal, cible, effet, retour :** cinq mots suffisent pour vérifier chaque flèche et chaque conclusion.
`,
    keyPoint: "Une expertise correcte relie manipulation, signal, cible et effet, corrige les omissions de l'axe et respecte la portée des données sans diagnostic abusif.",
    example: "Progestérone haute après un pic de LH : corps jaune actif et phase lutéale probable, mais aucune grossesse ne peut être affirmée sans donnée supplémentaire.",
    methodSteps: [
      "Inventorier les organes, hormones, cellules et moments du cycle présents dans le dossier.",
      "Traiter chaque expérience par manipulation, observation, restauration éventuelle et conclusion limitée.",
      "Vérifier chaque liaison féminine ou masculine avec le couple source–cible.",
      "Corriger les affirmations fausses par une phrase positive, puis formuler une prévention moderne et non stigmatisante.",
    ],
    interaction: timeline(
      "Conduire l'expertise finale",
      "Déroule les six étapes dans l'ordre et vérifie qu'aucune conclusion ne dépasse les données.",
      [
        { label: "Inventaire", shortLabel: "Sources", detail: "Repérer pages, courbes relatives, expériences animales et limites documentaires." },
        { label: "Axe féminin", shortLabel: "GnRH–FSH/LH", detail: "Rétablir l'hypothalamus, puis relier ovaire, stéroïdes, endomètre et rétrocontrôles." },
        { label: "Axe masculin", shortLabel: "Sertoli–Leydig", detail: "Séparer FSH–Sertoli–inhibine B de LH–Leydig–testostérone." },
        { label: "Cycle utérin", shortLabel: "M-P-S", detail: "Expliquer menstruation, prolifération et sécrétion par les stéroïdes ovariens." },
        { label: "Contraception", shortLabel: "Mécanismes", detail: "Distinguer inhibition de l'ovulation, mucus, urgence et protection contre les IST." },
        { label: "Conclusion", shortLabel: "Portée", detail: "Remplacer chaque erreur par un mécanisme exact et signaler ce que les données ne prouvent pas." },
      ],
      "Une bonne synthèse ne juxtapose pas des mots : elle écrit les signaux entre leurs sources et leurs cibles, puis justifie chaque effet.",
    ),
    questions: questions(89, [
      ["Quel effet testiculaire suit une hypophysectomie ?", "Une baisse de l'activité testiculaire", ["Une production illimitée de testostérone", "Une ovulation", "Une hausse obligatoire d'hCG"], "La disparition de FSH et LH prive le testicule de sa commande.", "Activité d'application • page 12"],
      ["Quelle association corrige l'axe masculin ?", "FSH–Sertoli et LH–Leydig", ["FSH–Leydig et LH–endomètre", "GnRH–épididyme et FSH–prostate", "LH–Sertoli uniquement et FSH–corps jaune"], "Chaque gonadostimuline possède une cible dominante distincte.", "Vrai-faux et bilan • pages 12-13"],
      ["Quel élément faut-il ajouter à la chaîne féminine incomplète de la page 13 ?", "L'hypothalamus et sa GnRH", ["Une seconde hypophyse", "Le pancréas comme source de LH", "L'épididyme"], "La commande commence par la GnRH hypothalamique.", "Appariement corrigé • page 13"],
      ["Quel énoncé sur l'inhibine B est correct ?", "Elle freine surtout la FSH", ["Elle est identique à l'ABP", "Elle déclenche l'ovulation", "Elle compose le myomètre"], "Sertoli sécrète l'inhibine B comme signal de retour.", "Vrai-faux corrigé • page 13"],
      ["Quel énoncé sur l'ABP est correct ?", "Elle lie les androgènes dans les tubes séminifères", ["Elle remplace l'inhibine B dans le sang", "Elle produit la LH", "Elle détruit les spermatozoïdes"], "L'ABP aide à maintenir une forte concentration locale de testostérone.", "Précision masculine • pages 9 et 13"],
      ["Quelle cause directe explique les menstruations sans grossesse ?", "La chute d'estradiol et de progestérone", ["Une FSH détruisant directement l'endomètre", "Une LH toujours maximale", "Une hausse d'hCG"], "La régression du corps jaune retire le soutien de la couche fonctionnelle.", "Exercice 3 corrigé • pages 14-15"],
      ["Quelle hormone pilote surtout la prolifération de l'endomètre ?", "L'estradiol", ["La progestérone seule avant tout estradiol", "La FSH directement", "L'inhibine B"], "L'estradiol folliculaire reconstruit la muqueuse.", "Exercice 3 • pages 14-15"],
      ["Quelle hormone pilote surtout la transformation sécrétoire ?", "La progestérone", ["La GnRH directement", "La LH dans l'endomètre", "L'ABP"], "La progestérone du corps jaune agit après la préparation œstrogénique.", "Exercice 3 corrigé • pages 14-15"],
      ["Que peut-on conclure d'une progestérone élevée après un pic de LH ?", "Un corps jaune est probablement actif", ["Une grossesse est certaine", "L'ovaire est absent", "Les menstruations ont déjà détruit le myomètre"], "Le profil indique une phase lutéale, pas à lui seul une grossesse.", "Courbes de synthèse • pages 2 et 14"],
      ["Quelle limite faut-il signaler pour le cycle de 28 jours ?", "Il s'agit d'un modèle et les cycles varient", ["Toute ovulation survient exactement à J14", "Une date suffit à diagnostiquer", "La phase folliculaire dure toujours 14 jours"], "Le calendrier ne prouve pas une ovulation individuelle.", "Document 1 et exercice 3 • pages 2 et 14"],
      ["Quelle recommandation complète une contraception hormonale face aux IST ?", "Associer un préservatif selon les besoins de prévention", ["Compter seulement les jours", "Prendre une urgence après chaque rapport sans conseil", "Considérer la pilule comme protection infectieuse"], "Les hormones contraceptives ne protègent pas des IST.", "Prévention intégrée • pages 10-11"],
    ], short("Nomme les deux types de cellules testiculaires associés respectivement à la FSH et à la LH.", ["Sertoli et Leydig", "cellules de Sertoli et cellules de Leydig", "Sertoli/Leydig", "Sertoli puis Leydig"], "La FSH cible surtout Sertoli et la LH cible surtout Leydig.", "Synthèse masculine • pages 9-13")),
    corrections: [
      "Les appariements incomplets de la page 13 sont corrigés en rétablissant hypothalamus, GnRH et circulation porte.",
      "Les propositions confondant Sertoli, Leydig, inhibine B et ABP sont remplacées par leurs relations physiologiques exactes.",
      "La phrase fautive de la page 15 est corrigée : la chute des stéroïdes ovariens, non de faibles FSH/LH directes, déclenche la menstruation.",
      "Les numéros de bas de page incohérents sur les pages physiques 12 et 14 ne sont pas utilisés comme repères de source.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtHumanSexualOrgansPath: LearningPath = {
  id: "terminale-d-svt-l6-human-sexual-organs",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "La reproduction chez les mammifères" },
  chapterNumber: 6,
  title: "Le fonctionnement des organes sexuels chez l’Homme",
  description: "Le cours officiel intégral, enrichi et corrigé, des cycles sexuels féminins à la commande testiculaire et à la contraception, avec les quinze pages exploitées sans reprendre les scans.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Synchroniser cycles ovarien, utérin et hormonal sans transformer le modèle de 28 jours en règle individuelle",
    "Interpréter les expériences d'ablation, de restauration et de stimulation qui établissent les axes reproducteurs",
    "Relier Sertoli, Leydig, spermatogenèse, épididyme et rétrocontrôles au fonctionnement testiculaire",
    "Expliquer les contraceptions hormonales et leurs limites dans une démarche moderne, fiable et non stigmatisante",
  ],
  modules: [
    {
      id: "human-sexual-organs-mastery",
      title: "Maîtriser le fonctionnement des organes sexuels humains",
      description: "Dix niveaux progressifs, des repères cycliques à une mission intégrée sur les axes féminin et masculin et la prévention.",
      lessons: builtLevels,
    },
  ],
};
