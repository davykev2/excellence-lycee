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

const sourceDocument = "SVT TD_L15_Lamélioration et la protection des sols.pdf";
const guideUrl =
  "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_D_APC.pdf";
const originalPracticeSource = "Entraînement guidé original fondé sur le support complet";

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
  shortQuestions: LessonQuestion[] = [],
): LessonQuestion[] => [
  ...rows.map((row, index) => balancedChoice(row, firstOrdinal + index)),
  ...shortQuestions,
];

const diagram = (
  title: string,
  instruction: string,
  rootLabel: string,
  rootDetail: string,
  nodes: DiagramNodeItem[],
  observation: string,
): LessonInteraction => ({
  kind: "diagram",
  eyebrow: "Carte agronomique à explorer",
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
  eyebrow: "Démarche de gestion des sols",
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

const source = (seed: LevelSeed): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages: seed.pages,
  section: seed.section,
  fidelity: "faithful-corrected",
  corrections: seed.corrections,
});

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed),
    concept: {
      eyebrow: `Niveau ${index + 1} • Support intégral corrigé`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode agronomique",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction:
        "Observe d’abord les données, distingue fertilisant, amendement et protection, puis propose une décision adaptée au sol, à la culture et aux risques environnementaux.",
      steps: seed.methodSteps,
      example: { prompt: "Application guidée", work: seed.example, result: seed.keyPoint },
      tip:
        "Davy te rappelle : diagnostiquer avant d’apporter, couvrir avant que le sol ne s’érode, puis contrôler l’effet réel de la pratique.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const diagnosisShapes: SchemaShape[] = [
  { shape: "path", d: "M20 70 L740 70 L740 145 L20 145 Z", tone: "soft" },
  { shape: "path", d: "M20 145 L740 145 L740 420 L20 420 Z", tone: "muted" },
  { shape: "path", d: "M55 145 C120 165 185 135 250 160 C320 185 390 140 460 165 C540 190 630 145 710 168", tone: "outline" },
  { shape: "path", d: "M95 132 C125 105 155 110 175 142", tone: "accent" },
  { shape: "line", x1: 135, y1: 135, x2: 125, y2: 285, tone: "accent" },
  { shape: "line", x1: 125, y1: 210, x2: 80, y2: 255, tone: "accent" },
  { shape: "line", x1: 127, y1: 230, x2: 178, y2: 282, tone: "accent" },
  { shape: "ellipse", cx: 300, cy: 205, rx: 52, ry: 25, tone: "fill" },
  { shape: "ellipse", cx: 375, cy: 245, rx: 60, ry: 28, tone: "fill" },
  { shape: "ellipse", cx: 300, cy: 305, rx: 48, ry: 24, tone: "fill" },
  { shape: "circle", cx: 335, cy: 205, r: 10, tone: "soft" },
  { shape: "circle", cx: 420, cy: 310, r: 15, tone: "soft" },
  { shape: "circle", cx: 510, cy: 235, r: 12, tone: "accent" },
  { shape: "circle", cx: 560, cy: 290, r: 9, tone: "accent" },
  { shape: "path", d: "M485 170 C520 205 540 260 520 330", tone: "outline" },
  { shape: "path", d: "M590 150 C610 210 600 290 630 360", tone: "outline" },
  { shape: "line", x1: 690, y1: 95, x2: 690, y2: 190, tone: "accent" },
  { shape: "line", x1: 675, y1: 175, x2: 690, y2: 190, tone: "accent" },
  { shape: "line", x1: 705, y1: 175, x2: 690, y2: 190, tone: "accent" },
  { shape: "text", x: 365, y: 105, content: "couvert végétal et résidus", anchor: "middle" },
  { shape: "text", x: 340, y: 390, content: "agrégats, pores, racines, eau et organismes", anchor: "middle" },
  { shape: "text", x: 620, y: 445, content: "Schéma diagnostique original", anchor: "middle" },
];

const diagnosisHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "cover", number: 1, label: "Couverture", x: 365, y: 95, detail: "Résidus et végétation interceptent les gouttes, limitent la battance et nourrissent progressivement le sol." },
  { id: "roots", number: 2, label: "Racines", x: 128, y: 225, detail: "Profondeur, ramification et état des racines renseignent sur l’aération, la compaction, l’eau et les nutriments." },
  { id: "aggregates", number: 3, label: "Agrégats", x: 340, y: 245, detail: "Une structure grumeleuse stable organise les particules sans confondre structure et texture." },
  { id: "pores", number: 4, label: "Porosité", x: 420, y: 310, detail: "Macropores et micropores gouvernent aération, infiltration et réserve en eau ; trop compact n’est pas très perméable." },
  { id: "biology", number: 5, label: "Vie du sol", x: 545, y: 270, detail: "Vers, racines et microorganismes participent à la décomposition, à l’agrégation et au cycle des nutriments." },
  { id: "water", number: 6, label: "Eau", x: 690, y: 170, detail: "Ruissellement, infiltration et rétention sont observés séparément avant de choisir une pratique de correction." },
];

const aggregateShapes: SchemaShape[] = [
  { shape: "path", d: "M20 70 L740 70 L740 420 L20 420 Z", tone: "muted" },
  { shape: "ellipse", cx: 215, cy: 210, rx: 95, ry: 42, tone: "fill" },
  { shape: "ellipse", cx: 315, cy: 160, rx: 90, ry: 38, tone: "fill" },
  { shape: "ellipse", cx: 390, cy: 250, rx: 105, ry: 44, tone: "fill" },
  { shape: "ellipse", cx: 295, cy: 320, rx: 92, ry: 40, tone: "fill" },
  { shape: "circle", cx: 270, cy: 220, r: 28, tone: "accent" },
  { shape: "circle", cx: 355, cy: 205, r: 24, tone: "accent" },
  { shape: "circle", cx: 335, cy: 285, r: 30, tone: "accent" },
  { shape: "circle", cx: 295, cy: 195, r: 8, tone: "soft" },
  { shape: "circle", cx: 365, cy: 235, r: 8, tone: "soft" },
  { shape: "circle", cx: 315, cy: 270, r: 8, tone: "soft" },
  { shape: "line", x1: 278, y1: 220, x2: 347, y2: 207, tone: "outline" },
  { shape: "line", x1: 348, y1: 225, x2: 337, y2: 272, tone: "outline" },
  { shape: "line", x1: 285, y1: 235, x2: 320, y2: 276, tone: "outline" },
  { shape: "path", d: "M505 105 C470 175 490 260 455 365", tone: "accent" },
  { shape: "path", d: "M570 105 C610 175 585 265 635 360", tone: "outline" },
  { shape: "circle", cx: 530, cy: 235, r: 30, tone: "soft" },
  { shape: "circle", cx: 625, cy: 200, r: 18, tone: "soft" },
  { shape: "path", d: "M120 330 C145 300 170 305 185 345 C160 360 135 355 120 330 Z", tone: "accent" },
  { shape: "text", x: 225, y: 130, content: "argile", anchor: "middle" },
  { shape: "text", x: 335, y: 210, content: "humus", anchor: "middle" },
  { shape: "text", x: 315, y: 255, content: "Ca²⁺", anchor: "middle" },
  { shape: "text", x: 545, y: 385, content: "racines et pores continus", anchor: "middle" },
  { shape: "text", x: 610, y: 445, content: "Agrégat pédagogique original", anchor: "middle" },
];

const aggregateHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "clay", number: 1, label: "Argile", x: 220, y: 165, detail: "Les particules minérales fines portent des charges et participent au complexe d’échange." },
  { id: "humus", number: 2, label: "Humus", x: 350, y: 205, detail: "La matière organique transformée contribue à la stabilité des agrégats et à la rétention de nutriments." },
  { id: "calcium", number: 3, label: "Calcium échangeable", x: 315, y: 255, detail: "Ca²⁺ peut favoriser floculation et ponts entre surfaces chargées ; il ne remplace pas des ions OH⁻ fixés." },
  { id: "macropore", number: 4, label: "Macropore", x: 530, y: 235, detail: "Les grands pores facilitent aération, infiltration et croissance racinaire sans garantir à eux seuls une bonne réserve utile." },
  { id: "microbe", number: 5, label: "Microorganismes", x: 150, y: 330, detail: "Bactéries et champignons transforment les résidus ; humification et minéralisation sont deux devenirs distincts." },
  { id: "root", number: 6, label: "Racine", x: 575, y: 175, detail: "La racine explore les pores, prélève les ions de la solution et alimente aussi la vie du sol par ses exsudats." },
];

const slopeShapes: SchemaShape[] = [
  { shape: "path", d: "M20 85 L740 85 L740 420 L20 420 Z", tone: "soft" },
  { shape: "path", d: "M30 130 L720 355 L720 420 L30 420 Z", tone: "muted" },
  { shape: "path", d: "M70 142 L210 188 L210 220 L260 220 L400 265 L400 300 L455 300 L610 350", tone: "outline" },
  { shape: "line", x1: 205, y1: 185, x2: 205, y2: 235, tone: "accent" },
  { shape: "line", x1: 395, y1: 260, x2: 395, y2: 315, tone: "accent" },
  { shape: "path", d: "M55 120 C105 105 165 120 215 145", tone: "accent" },
  { shape: "path", d: "M240 205 C285 188 345 200 405 230", tone: "accent" },
  { shape: "path", d: "M430 285 C490 265 550 285 620 320", tone: "accent" },
  { shape: "line", x1: 80, y1: 145, x2: 70, y2: 205, tone: "outline" },
  { shape: "line", x1: 100, y1: 150, x2: 115, y2: 220, tone: "outline" },
  { shape: "line", x1: 285, y1: 220, x2: 275, y2: 285, tone: "outline" },
  { shape: "line", x1: 315, y1: 230, x2: 330, y2: 300, tone: "outline" },
  { shape: "path", d: "M620 325 C650 292 675 275 700 250", tone: "outline" },
  { shape: "line", x1: 685, y1: 262, x2: 700, y2: 250, tone: "outline" },
  { shape: "line", x1: 685, y1: 248, x2: 700, y2: 250, tone: "outline" },
  { shape: "line", x1: 135, y1: 125, x2: 135, y2: 72, tone: "accent" },
  { shape: "circle", cx: 135, cy: 60, r: 28, tone: "fill" },
  { shape: "line", x1: 555, y1: 310, x2: 555, y2: 245, tone: "accent" },
  { shape: "circle", cx: 555, cy: 230, r: 24, tone: "fill" },
  { shape: "path", d: "M470 310 L530 330 L590 350", tone: "fill" },
  { shape: "text", x: 300, y: 115, content: "couverture et paillage", anchor: "middle" },
  { shape: "text", x: 300, y: 345, content: "terrasses suivant les courbes de niveau", anchor: "middle" },
  { shape: "text", x: 630, y: 205, content: "ruissellement ralenti", anchor: "middle" },
  { shape: "text", x: 610, y: 445, content: "Versant protégé original", anchor: "middle" },
];

const slopeHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "mulch", number: 1, label: "Paillage", x: 300, y: 125, detail: "Une couverture morte amortit les gouttes, réduit évaporation et battance, et peut fournir de la matière organique." },
  { id: "terrace", number: 2, label: "Terrasses", x: 395, y: 275, detail: "Des banquettes conçues et drainées raccourcissent la pente ; un ouvrage mal dimensionné peut concentrer l’eau et rompre." },
  { id: "cover-crop", number: 3, label: "Plantes de couverture", x: 525, y: 290, detail: "Le couvert vivant protège, nourrit les organismes, améliore l’infiltration et récupère certains nutriments." },
  { id: "roots", number: 4, label: "Réseau racinaire", x: 300, y: 265, detail: "Les racines stabilisent la surface et ouvrent des voies d’infiltration ; l’espèce doit être adaptée au milieu." },
  { id: "trees", number: 5, label: "Arbres et bandes", x: 135, y: 82, detail: "Reboisement, agroforesterie ou bandes enherbées protègent des zones dénudées sans remplacer la gestion de la parcelle." },
  { id: "runoff", number: 6, label: "Ruissellement", x: 670, y: 270, detail: "Le but n’est pas de bloquer toute eau mais de ralentir, infiltrer ou évacuer sans éroder ni engorger." },
];

const levels: LevelSeed[] = [
  {
    id: "soil-fertility-diagnosis",
    title: "Diagnostiquer la fertilité sans confondre les leviers",
    summary:
      "La fertilité résulte de propriétés physiques, chimiques et biologiques ; engrais, amendements et protection n’agissent ni au même endroit ni au même rythme.",
    pages: "1–5",
    section: "Problème scientifique, amendements et propriétés du sol",
    durationMinutes: 34,
    xp: 45,
    body: String.raw`
## Une propriété globale, pas un simple stock d’engrais

Après la situation d’apprentissage — **retirée de ce parcours** — le support pose deux pistes : améliorer le sol par des apports et préserver sa fertilité par des pratiques culturales. Pour les raisonner, il faut d’abord distinguer trois dimensions liées.

| Dimension | Questions de diagnostic | Exemples d’indicateurs |
|---|---|---|
| Physique | L’eau entre-t-elle, reste-t-elle disponible et l’air circule-t-il ? | structure, porosité, compaction, infiltration, stabilité des agrégats |
| Chimique | Les nutriments sont-ils disponibles sans toxicité ni déséquilibre ? | pH, azote, phosphore, potassium, calcium, capacité d’échange |
| Biologique | Les organismes transforment-ils les résidus et entretiennent-ils les cycles ? | racines, vers de terre, microorganismes, matière organique |

Un rendement faible peut venir d’un nutriment limitant, mais aussi d’une acidité excessive, d’un sol compact, d’un manque d’eau, d’un engorgement, de ravageurs ou d’une mauvaise adaptation de la culture. **Mesurer avant d’apporter** évite de traiter une cause imaginaire.

## Trois familles d’action

- Un **fertilisant** fournit principalement des nutriments à la culture. Un engrais minéral peut agir rapidement si ses ions deviennent disponibles.
- Un **amendement** vise surtout les propriétés du sol. Le calcaire corrige une acidité ; une matière organique peut améliorer structure, réserve et activité biologique tout en apportant aussi des nutriments.
- Une **technique de protection** limite les pertes ou la dégradation : paillage, couverture, rotation, terrasse bien conçue ou boisement adapté.

Ces catégories peuvent se recouper, mais les confondre conduit à de mauvaises décisions. Dans le vocabulaire agronomique corrigé, un engrais NPK n’est pas automatiquement un « amendement chimique ».

## Lire une donnée sans la surinterpréter

Le support compare des doses, des rendements, des teneurs minérales et des cultures. Une comparaison valable exige unités, témoin, conditions identiques, répétitions et domaine de validité. Une valeur totale du sol n’est pas forcément la fraction immédiatement disponible aux racines.

> **Distinction documentaire.** La situation d’apprentissage de la page 1 et les activités internes de construction des pages 2 à 6 sont écartées. Les trois activités placées explicitement sous **III — Exercices** et les situations d’évaluation sont, elles, intégrées plus loin.

La gestion rationnelle combine donc diagnostic, besoin de la culture, choix d’une pratique, dose adaptée, protection des eaux et contrôle après intervention.
`,
    keyPoint: "fertilité = propriétés physiques + disponibilité chimique + fonctionnement biologique",
    example:
      "Un sol à pH 4,5, compact et pauvre en humus ne se corrige pas par une dose NPK choisie au hasard : il faut confirmer acidité, structure, matière organique et besoin de la culture.",
    methodSteps: [
      "Nommer le symptôme observé sans lui attribuer immédiatement une cause.",
      "Classer les données en propriétés physiques, chimiques et biologiques.",
      "Distinguer fertilisant, amendement et mesure de protection.",
      "Choisir un indicateur de contrôle après l’intervention.",
    ],
    interaction: diagram(
      "Les trois dimensions d’un sol fertile",
      "Explore chaque carte et relie le symptôme observé à une mesure, puis à un levier possible.",
      "Sol cultivé",
      "Le rendement dépend du fonctionnement conjoint de la structure, de la solution du sol, de la matière organique et des organismes.",
      [
        { id: "physical", label: "État physique", role: "Habitat", detail: "Structure, pores, eau et air conditionnent l’enracinement et l’activité biologique." },
        { id: "chemical", label: "État chimique", role: "Nutrition", detail: "pH, ions disponibles, salinité et capacité d’échange orientent la nutrition et les risques de toxicité." },
        { id: "biological", label: "État biologique", role: "Cycles", detail: "Racines, faune et microorganismes décomposent, transforment et stabilisent la matière organique." },
        { id: "fertilizer", label: "Fertiliser", role: "Apporter", detail: "Une dose raisonnée fournit les nutriments réellement limitants au moment utile." },
        { id: "amendment", label: "Amender", role: "Corriger", detail: "Calcaire ou matière organique modifient surtout les propriétés du sol, avec des effets progressifs et conditionnels." },
        { id: "protect", label: "Protéger", role: "Conserver", detail: "Couverture, rotation et aménagement réduisent érosion, battance, ruissellement et épuisement." },
      ],
      "Une pratique isolée ne compense pas automatiquement toutes les contraintes : le diagnostic décide du levier.",
    ),
    questions: questions(0, [
      ["Quelles dimensions faut-il associer pour parler de fertilité du sol ?", "Physique, chimique et biologique", ["Seulement la couleur", "Seulement la quantité d’engrais", "Seulement le rendement d’une année"], "La fertilité décrit un fonctionnement global du milieu cultivé.", originalPracticeSource + " • pages 1–5"],
      ["Quel est le rôle principal d’un fertilisant ?", "Fournir des nutriments aux plantes", ["Construire une terrasse", "Mesurer le pH", "Remplacer toute matière organique"], "Un fertilisant apporte des éléments nutritifs sous une forme qui doit devenir disponible.", originalPracticeSource + " • pages 1–2"],
      ["Quel est le rôle principal d’un amendement ?", "Modifier favorablement des propriétés du sol", ["Garantir une récolte sans diagnostic", "Détruire les organismes", "Augmenter toujours le ruissellement"], "Le calcaire agit sur l’acidité et une matière organique sur plusieurs propriétés.", originalPracticeSource + " • pages 3–5"],
      ["Pourquoi analyser le sol avant un apport ?", "Pour identifier les contraintes et ajuster le produit et la dose", ["Pour choisir la dose la plus élevée", "Pour éviter de connaître le pH", "Pour supprimer les besoins de la culture"], "Une décision fondée sur les données réduit carence, gaspillage et pollution.", originalPracticeSource + " • pages 1–5"],
      ["Quel indicateur appartient surtout au diagnostic physique ?", "La compaction et la porosité", ["La formule du nitrate seulement", "Le nom du village", "Le prix d’un sac sans unité"], "La circulation de l’air et de l’eau dépend de l’organisation des pores.", originalPracticeSource + " • pages 3–4"],
      ["Quel indicateur appartient surtout au diagnostic chimique ?", "Le pH et les ions disponibles", ["La forme des feuilles uniquement", "Le nombre d’élèves", "La longueur du texte"], "Acidité et disponibilité des nutriments relèvent du fonctionnement chimique.", originalPracticeSource + " • pages 3–4"],
      ["Quel indice renseigne directement sur la dimension biologique ?", "L’activité des vers et des microorganismes", ["La masse du tracteur", "La pente seule", "La marque d’engrais"], "La vie du sol participe aux transformations organiques et aux cycles.", originalPracticeSource + " • pages 2–5"],
      ["Un rendement faible prouve-t-il à lui seul une carence NPK ?", "Non, plusieurs contraintes peuvent produire le même symptôme", ["Oui, toujours", "Oui, si la parcelle est grande", "Non, car les plantes n’utilisent aucun minéral"], "Il faut séparer observation, hypothèses et mesures de confirmation.", originalPracticeSource + " • pages 1–5"],
      ["Une teneur totale mesurée est-elle toujours entièrement disponible ?", "Non, disponibilité et quantité totale sont différentes", ["Oui, sans effet du pH", "Oui, même si l’ion est immobilisé", "Non, car aucun ion n’est absorbé"], "Forme chimique, pH, eau et activité biologique modulent l’accès des racines.", originalPracticeSource + " • pages 3–5"],
      ["Quelle démarche correspond à une gestion rationnelle ?", "Diagnostiquer, agir à dose adaptée, protéger puis contrôler", ["Apporter au maximum puis observer", "Attendre l’érosion avant de couvrir", "Changer de culture sans lire les données"], "La décision est une boucle et non un geste unique.", originalPracticeSource + " • pages 1–6"],
    ]),
    corrections: [
      "La situation d’apprentissage de la page 1 est retirée ; seules les hypothèses scientifiques ouvrant le contenu sont conservées.",
      "Les activités internes de construction des pages 2 à 6 ne sont pas transformées en évaluations ; les exercices officiels des pages 8–11 restent réservés aux niveaux dédiés.",
      "Engrais et amendement sont distingués : un engrais apporte principalement des nutriments, un amendement corrige surtout des propriétés du sol.",
      "Un rendement faible n’est pas assimilé automatiquement à une carence NPK et une quantité totale n’est pas confondue avec une disponibilité réelle.",
    ],
  },
  {
    id: "mineral-fertilizer-dose-response",
    title: "Lire la réponse à une dose d’engrais minéral",
    summary:
      "La série dose-rendement montre un maximum observé à 150 kg/ha, puis une baisse ; elle justifie une fertilisation mesurée, jamais une dose universelle.",
    pages: "1–2",
    section: "Amendement chimique dans le vocabulaire source : expérience dose–rendement",
    durationMinutes: 36,
    xp: 55,
    body: String.raw`
## Une série de six traitements

Le support épand un engrais présenté comme N–P–K et relève le rendement de la parcelle.

| Dose apportée (kg/ha) | 50 | 100 | 150 | 200 | 250 | 300 |
|---:|---:|---:|---:|---:|---:|---:|
| Rendement (quintaux/ha) | 48 | 67 | 82,5 | 80 | 60 | 40 |

De 50 à 150 kg/ha, le rendement augmente. **150 kg/ha donne le meilleur rendement parmi les six traitements mesurés**, soit 82,5 quintaux/ha. Ensuite, les valeurs diminuent : 80, 60 puis 40 quintaux/ha.

La couverture imprimée écrit « 82,5 qtx/kg » et parle ensuite de « 60 à 40 kg/ha » pour le rendement. Les unités correctes du tableau sont des **quintaux par hectare**.

## Pourquoi la courbe monte puis baisse

Si un nutriment est limitant, un apport adapté corrige la carence et soutient la croissance. Au-delà des besoins et de la capacité du milieu, un excès peut entraîner déséquilibre nutritif, concentration saline, brûlure, acidification selon le produit, pertes par lixiviation ou ruissellement et contamination de l’eau. Le tableau seul ne permet pas de choisir lequel de ces mécanismes explique exactement la baisse.

N, P et K sont des **éléments nutritifs**. Un engrais commercial peut les apporter sous différentes formes et exprime souvent P et K en équivalents $P_2O_5$ et $K_2O$. Dire que N, P et K « sont des engrais simples » confond l’élément et le produit.

## Ce que l’expérience ne prouve pas

- Le meilleur traitement observé n’est pas un optimum universel.
- Il manque un témoin à 0 kg/ha dans le tableau publié.
- Répétitions, variabilité, nature du sol, variété, pluie et composition exacte de l’engrais ne sont pas précisées.
- Une réponse de rendement ne mesure pas à elle seule la fertilité physique ou biologique.

> **Règle des 4 B :** bonne source, bonne dose, bon moment, bon emplacement — auxquels s’ajoutent ici diagnostic et suivi environnemental.

L’activité interne de la page 2 est une étape de construction du cours et n’est pas reprise comme exercice. Le parcours conserve toutefois son idée correcte : l’excès n’est pas bénéfique.
`,
    keyPoint: "maximum observé : 82,5 q/ha pour 150 kg/ha ; au-delà, les rendements mesurés diminuent",
    example:
      "Comparer 150 et 300 kg/ha : doubler la dose fait passer le rendement de 82,5 à 40 q/ha dans cette expérience ; plus d’engrais ne signifie donc pas plus de rendement.",
    methodSteps: [
      "Nommer les axes et vérifier leurs unités.",
      "Décrire les valeurs avant de proposer un mécanisme.",
      "Distinguer maximum observé et optimum généralisable.",
      "Citer les données manquantes avant toute recommandation.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "Explorer le rendement selon la dose",
      instruction: "Déplace le repère sur les six traitements et compare la zone croissante à la baisse après 150 kg/ha.",
      formula: "Rendement R(d), en quintaux par hectare",
      formulaTex: "R(d)",
      rule: { kind: "samples", points: [[50, 48], [100, 67], [150, 82.5], [200, 80], [250, 60], [300, 40]] },
      window: { xMin: 50, xMax: 300, yMin: 35, yMax: 90 },
      guides: [
        { kind: "vertical", value: 150, label: "meilleur traitement observé" },
        { kind: "horizontal", value: 82.5, label: "82,5 q/ha" },
      ],
      marker: { min: 50, max: 300, step: 50, initial: 150 },
      observation:
        "La courbe augmente jusqu’au point mesuré à 150 kg/ha puis baisse. Elle n’autorise ni interpolation agronomique universelle ni prescription hors de l’expérience.",
    },
    questions: questions(10, [
      ["Quel rendement est mesuré pour 50 kg/ha ?", "48 quintaux/ha", ["67 quintaux/ha", "82,5 kg/ha", "300 quintaux/ha"], "La première colonne associe 50 kg/ha à 48 q/ha.", "Tableau du cours corrigé • page 2"],
      ["Quel traitement donne le rendement le plus élevé du tableau ?", "150 kg/ha", ["50 kg/ha", "250 kg/ha", "300 kg/ha"], "82,5 q/ha est le maximum parmi les six mesures.", "Tableau du cours • page 2"],
      ["Quelle valeur est mesurée à 200 kg/ha ?", "80 quintaux/ha", ["82,5 quintaux/ha", "60 kg/ha", "40 quintaux/kg"], "Le premier point après le maximum reste à 80 q/ha.", "Tableau du cours corrigé • page 2"],
      ["Comment évolue la série après 150 kg/ha ?", "Elle diminue globalement de 82,5 à 40 q/ha", ["Elle augmente jusqu’à 300", "Elle reste exactement constante", "Elle devient négative"], "Les valeurs successives sont 80, 60 et 40 q/ha.", "Analyse corrigée • page 2"],
      ["Quelle unité corrige « 82,5 qtx/kg » ?", "Le quintal par hectare", ["Le kilogramme par quintal", "Le litre par seconde", "Le pH par hectare"], "Le rendement du tableau est exprimé en q/ha.", "Correction de l’unité • page 2"],
      ["Pourquoi 150 kg/ha n’est-il pas un optimum universel ?", "Le résultat dépend du sol, du produit, de la culture et du protocole", ["Tout sol a exactement la même réponse", "La dose n’a aucune unité", "Le rendement ne varie jamais"], "Le point est seulement le meilleur des traitements fournis.", originalPracticeSource + " • pages 1–2"],
      ["Quel risque peut accompagner une dose excessive ?", "Déséquilibre, salinité, phytotoxicité ou pertes nutritives", ["Une fertilité garantie", "Une disparition de l’eau", "Une neutralité automatique"], "Plusieurs mécanismes sont possibles ; le tableau ne choisit pas à lui seul.", "Interprétation corrigée • page 2"],
      ["Que représentent N, P et K ?", "Des éléments nutritifs que des engrais peuvent fournir", ["Trois textures de sol", "Trois vers de terre", "Trois types de terrasse"], "L’élément chimique est distingué du produit fertilisant.", "Vocabulaire corrigé • pages 1–2"],
      ["Quelle limite expérimentale est visible ?", "Le tableau ne contient pas de témoin à dose nulle", ["Il ne contient aucune dose", "Il mesure seulement le pH", "Il compare dix cultures"], "Sans 0 kg/ha, la réponse par rapport à l’absence d’apport reste inconnue.", originalPracticeSource + " • pages 1–2"],
      ["Quelle décision est la plus prudente ?", "Ajuster la dose à une analyse et contrôler le rendement et les pertes", ["Choisir systématiquement 300 kg/ha", "Doubler toute dose efficace", "Ignorer la culture"], "La fertilisation raisonnée évite carence comme excès.", originalPracticeSource + " • pages 1–2"],
    ]),
    corrections: [
      "Les unités erronées « qtx/kg » et « kg/ha » appliquées au rendement sont corrigées en quintaux par hectare.",
      "Le point à 150 kg/ha est présenté comme meilleur traitement observé, non comme optimum universel.",
      "La baisse est décrite avec les trois valeurs 80, 60 et 40 q/ha, et non seulement « de 60 à 40 ».",
      "N, P et K sont identifiés comme nutriments fournis par des produits fertilisants, pas comme trois engrais simples en eux-mêmes.",
      "L’activité interne de la page 2 est retirée conformément au tri documentaire ; aucune de ses réponses n’est comptée parmi les exercices officiels.",
    ],
  },
  {
    id: "earthworms-organic-mineralization",
    title: "Relier vers de terre, microbes et minéralisation",
    summary:
      "Les turricules enrichis illustrent un cycle collectif : fragmentation et mélange par la faune, transformations microbiennes, minéralisation et stabilisation organique.",
    pages: "2–3",
    section: "Amendement organique : vers de terre, turricules et sels minéraux",
    durationMinutes: 36,
    xp: 65,
    body: String.raw`
## Comparer les deux colonnes

Le support oppose un sol sans vers de terre à un sol avec vers, en unités arbitraires.

| Élément mesuré | Sans vers | Avec vers |
|---|---:|---:|
| Calcium | 1,990 | 2,79 |
| Manganèse | 0,162 | 0,492 |
| Nitrate | 0,004 | 0,022 |
| Phosphore | 0,009 | 0,067 |
| Potassium | 0,032 | 0,358 |

Chaque valeur de la colonne « avec vers » est supérieure dans cette expérience. Le rapport n’est pas identique : potassium et phosphore augmentent davantage en proportion que calcium. Les unités arbitraires permettent une comparaison interne, pas une conversion en kg/ha.

## Une chaîne d’acteurs

Les vers creusent des galeries, ingèrent un mélange de particules et de résidus, fragmentent et brassent la matière. Leurs déjections forment des **turricules**. Ces activités modifient porosité, agrégation et accessibilité de la matière organique.

La source attribue toute la décomposition et la minéralisation aux vers. La correction distingue les rôles :

1. la macrofaune fragmente, mélange et transporte ;
2. bactéries et champignons réalisent une grande part des transformations chimiques ;
3. la **minéralisation** libère des formes minérales, par exemple ammonium puis nitrate selon les conditions ;
4. l’**humification** produit des matières organiques plus transformées et relativement stables.

Ces voies sont liées mais ne sont pas synonymes. Tout résidu ne devient pas immédiatement un ion assimilable.

## Matières organiques et précautions

Paille, fumier, purin, compost et engrais verts diffèrent par humidité, rapport carbone/azote, degré de transformation et vitesse de libération. Une matière trop fraîche ou mal gérée peut immobiliser temporairement de l’azote, transporter des agents pathogènes ou perdre des nutriments.

> **Précision expérimentale :** le tableau montre une association mesurée dans les conditions fournies. Pour démontrer un effet causal général, il faudrait sols comparables, répétitions, durée, teneur initiale et méthode d’analyse.

L’activité annoncée en bas de la page 3 ne contient ni texte, ni consigne complète, ni corrigé. Elle est explicitement exclue : aucune réponse officielle n’est inventée.
`,
    keyPoint: "vers : fragmenter et mélanger ; microbes : transformer ; minéralisation : libérer des formes minérales",
    example:
      "Le potassium passe de 0,032 à 0,358 unité arbitraire avec vers : on décrit l’écart, puis on propose la chaîne faune–microbes sans prétendre que les vers fabriquent seuls l’élément.",
    methodSteps: [
      "Comparer chaque élément dans la même unité.",
      "Distinguer observation du tableau et mécanisme proposé.",
      "Attribuer à la faune et aux microorganismes leurs rôles complémentaires.",
      "Séparer minéralisation, humification et disponibilité immédiate.",
    ],
    interaction: diagram(
      "La chaîne biologique de transformation",
      "Explore les cartes depuis le résidu jusqu’aux formes minérales et repère les rôles qui se complètent.",
      "Résidus organiques",
      "Paille, racines, fumier et organismes morts apportent du carbone, des nutriments et des structures complexes.",
      [
        { id: "fragmentation", label: "Fragmentation", role: "Faune", detail: "Les vers et autres animaux réduisent, déplacent et mélangent les résidus aux particules minérales." },
        { id: "casts", label: "Turricules", role: "Mélange", detail: "Les déjections concentrent localement particules, mucus, microbes et éléments transformés." },
        { id: "microbes", label: "Décomposition", role: "Microbes", detail: "Bactéries et champignons dégradent les molécules organiques grâce à leurs enzymes." },
        { id: "mineralization", label: "Minéralisation", role: "Libérer", detail: "Une partie des éléments revient sous des formes minérales susceptibles d’entrer dans la solution du sol." },
        { id: "humification", label: "Humification", role: "Stabiliser", detail: "Une autre partie contribue à des matières organiques transformées plus durables." },
        { id: "plant", label: "Nutrition", role: "Absorber", detail: "Les racines prélèvent des ions disponibles, dans les limites du pH, de l’eau et de la demande de la culture." },
      ],
      "Le cycle est collectif : aucun organisme ne réalise seul toutes les transformations et aucune hausse mesurée n’est automatiquement universelle.",
    ),
    questions: questions(20, [
      ["Quel élément passe de 0,032 à 0,358 unité arbitraire ?", "Le potassium", ["Le calcium", "Le manganèse", "Le nitrate"], "Ces valeurs occupent la dernière ligne du tableau.", "Tableau du cours • page 3"],
      ["Quelle valeur de calcium est mesurée avec vers ?", "2,79 unités arbitraires", ["1,990 unités", "0,279 kg/ha", "0,022 unité"], "La colonne avec vers donne 2,79.", "Tableau du cours • page 3"],
      ["Que peut-on affirmer pour les cinq éléments du tableau ?", "Ils sont tous plus élevés dans la colonne avec vers", ["Ils sont tous identiques", "Ils disparaissent avec les vers", "Le calcium seul augmente"], "La comparaison ligne par ligne montre la même direction.", "Analyse du cours • page 3"],
      ["Que sont les turricules ?", "Des déjections de vers mêlées à des particules et matières transformées", ["Des engrais minéraux industriels", "Des racines de légumineuse", "Des terrasses de pente"], "Le support emploie ce nom pour les rejets des vers.", "Cours corrigé • pages 2–3"],
      ["Quel rôle physique ont les galeries de vers ?", "Elles peuvent favoriser porosité et circulation de l’eau et de l’air", ["Elles rendent tout sol imperméable", "Elles remplacent les racines", "Elles fixent seules l’azote atmosphérique"], "La bioturbation modifie l’organisation du sol.", originalPracticeSource + " • pages 2–3"],
      ["Qui réalise une grande part des transformations enzymatiques ?", "Les bactéries et les champignons", ["Les grains de sable", "Les ions calcium", "Les terrasses"], "Les vers fragmentent et stimulent un réseau microbien.", "Correction scientifique • page 3"],
      ["Qu’est-ce que la minéralisation ?", "La transformation de matière organique avec libération de formes minérales", ["La formation d’une pente", "L’ajout obligatoire de chaux", "La disparition de tous les microbes"], "Elle rend certains éléments susceptibles d’entrer dans la solution du sol.", "Cours corrigé • page 3"],
      ["Minéralisation et humification sont-elles identiques ?", "Non, elles correspondent à des devenirs organiques différents", ["Oui, toujours", "Oui, car elles ne concernent aucun microbe", "Non, car l’humus est un minéral pur"], "L’une libère des formes minérales, l’autre contribue à une matière organique transformée.", originalPracticeSource + " • pages 3–5"],
      ["Pourquoi les unités arbitraires imposent-elles de la prudence ?", "Elles permettent la comparaison interne mais pas une conversion directe en kg/ha", ["Elles valent toujours un kilogramme", "Elles suppriment toute comparaison", "Elles prouvent une dose universelle"], "La méthode de mesure et l’échelle ne sont pas précisées.", "Tableau du cours • page 3"],
      ["Pourquoi aucune question n’est-elle créée depuis l’activité organique annoncée page 3 ?", "Son texte, sa consigne et son corrigé sont absents", ["Elle contient huit réponses complètes", "Elle appartient à la page 12", "Elle décrit une mine"], "Inventer l’évaluation contredirait la fidélité documentaire.", "Limite documentaire • page 3"],
    ]),
    corrections: [
      "La décomposition et la minéralisation ne sont pas attribuées aux vers seuls : fragmentation, mélange et transformations microbiennes sont distingués.",
      "Minéralisation et humification sont séparées, et tout résidu n’est pas présenté comme immédiatement assimilable.",
      "Les unités arbitraires restent des comparaisons internes ; aucune conversion en dose agricole n’est inventée.",
      "L’activité annoncée page 3 est matériellement incomplète et retirée sans créer de question ni de corrigé.",
      "Paille, fumier, purin, compost et engrais verts sont distingués au lieu d’être réduits à une seule matière homogène.",
    ],
  },
  {
    id: "green-manure-nitrogen-cycle",
    title: "Raisonner l’engrais vert et la fixation de l’azote",
    summary:
      "L’évaluation du riz compare témoin, azote minéral et légumineuse ; la correction relie nodosités, rhizobiums, résidus et rendement sans promettre un effet universel.",
    pages: "3 et 7–8",
    section: "Engrais verts et situation d’évaluation du riz",
    durationMinutes: 40,
    xp: 70,
    body: String.raw`
## Une culture au service de la suivante

Un **engrais vert** est une culture implantée surtout pour protéger et améliorer le sol, puis restituée ou gérée avant la culture principale. Les légumineuses peuvent héberger dans leurs nodosités des bactéries symbiotiques, notamment des rhizobiums.

La fixation biologique réduit le diazote atmosphérique $N_2$ en formes combinées grâce à la nitrogénase microbienne. La plante fournit des composés carbonés aux bactéries ; elle reçoit de l’azote fixé. L’azote ne passe pas automatiquement et immédiatement des nodosités à toutes les plantes voisines. Une part bénéficie aux cultures suivantes lorsque racines et parties restituées se décomposent puis se minéralisent.

## Les trois traitements de l’évaluation

| Condition pour le riz | Rendement (kg/ha) |
|---|---:|
| Témoin sans engrais ni légumineuse | 2 100 |
| 60 kg d’engrais azoté par hectare | 3 800 |
| Légumineuse utilisée comme engrais vert | 5 900 |

L’ordre observé est :

$$2100 < 3800 < 5900\ \mathrm{kg/ha}$$

Dans les conditions testées, l’apport azoté améliore le rendement par rapport au témoin, et le traitement légumineuse donne le rendement le plus élevé.

## Expliquer sans dépasser les données

L’engrais azoté fournit un nutriment probablement limitant. La légumineuse peut combiner fixation symbiotique, couverture, racines, apport de résidus et stimulation biologique après restitution. Mais le tableau ne précise ni espèce, biomasse, quantité d’azote fixée, date d’incorporation, équivalence de dose, répétitions ni dispersion des rendements.

La conclusion fidèle est donc : **choisir l’engrais vert parmi ces trois traitements**, tout en demandant confirmation locale. Ce n’est pas la preuve que toute légumineuse sur tout sol dépasse toujours 60 kg d’azote minéral.

> **Correction de vocabulaire :** l’engrais azoté est une fertilisation minérale, non un amendement chimique au sens strict. L’engrais vert est une pratique organique et conservatoire dont l’effet dépend de sa gestion.

Une stratégie réelle peut associer couverture, inoculation adaptée si nécessaire, restitution des résidus, analyse du sol et complément minéral ajusté, au lieu d’opposer systématiquement organique et minéral.
`,
    keyPoint: "traitements observés : témoin 2 100 < azote minéral 3 800 < légumineuse 5 900 kg/ha",
    example:
      "Le gain du traitement légumineuse sur le témoin vaut 3 800 kg/ha ; cette différence décrit l’essai mais ne quantifie pas à elle seule l’azote fixé.",
    methodSteps: [
      "Nommer les trois traitements sans changer leurs unités.",
      "Comparer les rendements par différences et ordre.",
      "Relier la légumineuse à la symbiose rhizobienne et à la restitution des résidus.",
      "Limiter le choix aux conditions testées et citer les données manquantes.",
    ],
    interaction: timeline(
      "Du diazote au bénéfice agronomique",
      "Déroule la chaîne et repère le moment où l’azote devient réellement accessible à une culture suivante.",
      [
        { label: "Implanter", shortLabel: "Couvert", detail: "Une légumineuse adaptée couvre le sol et développe racines et biomasse." },
        { label: "Noduler", shortLabel: "Symbiose", detail: "Des rhizobiums compatibles colonisent les racines et forment des nodosités fonctionnelles." },
        { label: "Fixer", shortLabel: "N₂", detail: "La nitrogénase bactérienne réduit le diazote grâce à l’énergie issue des composés fournis par la plante." },
        { label: "Restituer", shortLabel: "Résidus", detail: "La biomasse est laissée, fauchée ou incorporée selon le système, sans laisser le sol nu." },
        { label: "Décomposer", shortLabel: "Microbes", detail: "Le réseau du sol transforme les résidus ; le rythme dépend du climat et du rapport C/N." },
        { label: "Minéraliser", shortLabel: "Azote", detail: "Une partie de l’azote organique devient minérale et peut être absorbée ou perdue si elle n’est pas synchronisée." },
      ],
      "La nodosité enrichit d’abord la légumineuse ; le bénéfice pour la culture suivante dépend surtout de la restitution et de la synchronisation.",
    ),
    questions: questions(30, [
      ["Quel organisme réalise la fixation dans les nodosités d’une légumineuse ?", "Des bactéries symbiotiques comme les rhizobiums", ["Les grains de quartz", "Les racines seules sans microbe", "Les ions potassium"], "La fixation biologique est une fonction microbienne en symbiose.", originalPracticeSource + " • pages 3 et 7–8"],
      ["Quelle molécule atmosphérique est fixée ?", "Le diazote N₂", ["Le dioxyde de carbone uniquement", "Le phosphate P₂O₅", "Le carbonate de calcium"], "La nitrogénase réduit N₂ en azote combiné.", originalPracticeSource + " • pages 7–8"],
      ["À quel moment une grande part de l’azote peut-elle profiter à la culture suivante ?", "Après restitution, décomposition et minéralisation des résidus", ["Avant toute nodulation", "Après disparition de tous les microbes", "Seulement si le sol est nu"], "Le transfert n’est ni automatique ni instantané.", "Explication corrigée • pages 7–8"],
      ["Quel autre service rend une légumineuse de couverture ?", "Protéger la surface et apporter des racines et de la matière organique", ["Rendre toute terrasse inutile", "Neutraliser toujours tout sol acide", "Supprimer tout ravageur"], "L’engrais vert agit aussi sur la protection et le fonctionnement biologique.", originalPracticeSource + " • pages 3 et 7–8"],
      ["Quel gain mesure-t-on entre témoin et azote minéral ?", "1 700 kg/ha", ["2 100 kg/ha", "3 800 kg/ha", "5 900 kg/ha"], "3 800 − 2 100 = 1 700 kg/ha.", "Calcul guidé du tableau • page 7"],
      ["Quel gain mesure-t-on entre témoin et légumineuse ?", "3 800 kg/ha", ["1 700 kg/ha", "5 900 kg/ha", "60 kg/ha"], "5 900 − 2 100 = 3 800 kg/ha.", "Calcul guidé du tableau • pages 7–8"],
      ["Pourquoi l’essai ne donne-t-il pas une règle universelle ?", "Espèce, sol, biomasse, répétitions et doses équivalentes ne sont pas précisés", ["Les rendements n’ont aucune unité", "Aucun traitement n’est fourni", "Le riz n’absorbe jamais d’azote"], "La portée reste celle du tableau.", originalPracticeSource + " • pages 7–8"],
      ["Quelle gestion limite une perte d’azote après minéralisation ?", "Synchroniser la libération avec l’absorption de la culture", ["Laisser le sol nu sous forte pluie", "Appliquer sans connaître le besoin", "Éliminer toutes les racines"], "Un nitrate libéré sans culture peut être lixivié.", originalPracticeSource + " • pages 3 et 7–8"],
      ["Quelles techniques l’évaluation demande-t-elle de nommer ?", "Fertilisation azotée minérale et engrais vert de légumineuse", ["Chaulage et terrassement", "Paillage et forage", "Reboisement et irrigation uniquement"], "Le tableau oppose un engrais azoté à une légumineuse comme engrais vert.", "Situation d’évaluation • page 7"],
      ["Quelle analyse respecte les trois rendements ?", "2 100 < 3 800 < 5 900 kg/ha", ["5 900 < 3 800 < 2 100", "2 100 = 3 800 = 5 900", "60 < 2 100 < 3 800 q/ha"], "Le témoin est le plus faible et la légumineuse la plus élevée.", "Situation d’évaluation • page 7"],
      ["Quelle explication corrige le rôle des nodosités ?", "Les rhizobiums fixent N₂ et les résidus restitués fournissent ensuite de l’azote après transformation", ["La légumineuse crée directement du potassium", "Les nodosités sont des sacs d’engrais NPK", "La faune seule fixe N₂"], "La symbiose et la restitution sont deux étapes distinctes.", "Situation d’évaluation corrigée • pages 7–8"],
      ["Quelle technique faut-il déduire parmi les seules conditions testées ?", "L’engrais vert de légumineuse", ["Le témoin sans apport", "La dose minérale la plus forte possible", "Une terrasse sans culture"], "Elle correspond au rendement maximal du tableau, avec une conclusion limitée au protocole.", "Situation d’évaluation corrigée • pages 7–8"],
    ]),
    corrections: [
      "L’engrais azoté est appelé fertilisation minérale et non amendement chimique au sens strict.",
      "La fixation de N₂ est attribuée aux bactéries symbiotiques des nodosités, pas à la plante seule.",
      "L’azote n’est pas dit immédiatement disponible pour toutes les plantes : restitution, décomposition et minéralisation sont nécessaires.",
      "Le choix de la légumineuse est limité aux trois traitements du tableau ; aucune supériorité universelle n’est affirmée.",
      "L’absence de répétitions, d’incertitudes et d’équivalence des apports est signalée.",
    ],
  },
  {
    id: "acid-soil-degradation-diagnosis",
    title: "Diagnostiquer un sol acide et dégradé",
    summary:
      "Le profil pH 4,5, structure compacte, faible humus et faible activité biologique exige un diagnostic cohérent avant chaulage ou apport organique.",
    pages: "3–4",
    section: "Amendements calcaire et humifère : diagnostic pédologique",
    durationMinutes: 38,
    xp: 75,
    body: String.raw`
## Le dossier fourni

Le champ étudié garde de faibles rendements malgré de fortes doses de fertilisants. Le tableau indique :

- un **pH de 4,5**, donc un milieu nettement acide ;
- une structure compacte, peu granuleuse ;
- très peu d’humus ;
- une vie microbienne presque inexistante et l’absence de végétation ;
- beaucoup d’ions $H^+$ et très peu de calcium échangeable selon le modèle scolaire.

Le document écrit pourtant « structure compacte » et « très perméable à l’eau et à l’air ». Ces descriptions sont contradictoires. Une compaction associée à un manque de granulation évoque plutôt une porosité fonctionnelle réduite, une aération difficile et une infiltration hétérogène ou faible. La correction retient donc **peu perméable et mal aéré**, tout en rappelant qu’une mesure d’infiltration serait nécessaire.

## Trois diagnostics liés

**Physique.** Observer stabilité des mottes, croûte de battance, profondeur d’enracinement, densité apparente, infiltration et rétention. La texture — proportions sable, limon, argile — ne se déduit pas de la structure.

**Chimique.** Confirmer pH, acidité échangeable, calcium et magnésium, matière organique, capacité d’échange et nutriments disponibles. « Pas de sels minéraux » ou « absence de $Ca^{2+}$ » est trop absolu : le support montre surtout des teneurs insuffisantes ou un déséquilibre.

**Biologique.** Examiner racines, respiration, biomasse microbienne, faune, résidus et vitesse de décomposition. Une faible activité peut être conséquence et cause de la dégradation.

## Choisir le levier

Un chaulage peut corriger une acidité confirmée, mais sa dose dépend du pH cible, du pouvoir tampon, de la profondeur traitée et du produit. Un amendement organique peut soutenir agrégation, eau, échange et organismes. Une couverture protège la correction acquise.

Le fait que des doses élevées de fertilisant n’aient pas rétabli le rendement montre pourquoi **apport nutritif et restauration du sol ne sont pas interchangeables**.

> **Séquence de décision :** échantillon représentatif → analyses → contrainte prioritaire → dose et pratique adaptées → contrôle du pH, de la structure et de la culture.

Un sol acide n’est pas automatiquement impropre à toute agriculture : certaines cultures tolèrent l’acidité. Le diagnostic vise une culture et un objectif donnés.
`,
    keyPoint: "pH 4,5 + compaction + peu d’humus + faible activité = contraintes multiples à confirmer",
    example:
      "Avant de chauler, on mesure pH et pouvoir tampon ; avant d’ajouter du compost, on vérifie sa maturité et on maintient une couverture pour éviter de perdre le bénéfice.",
    methodSteps: [
      "Relever chaque observation sans corriger silencieusement le document.",
      "Repérer les contradictions et demander la mesure discriminante.",
      "Classer les contraintes en physique, chimique et biologique.",
      "Associer chaque action à un indicateur de suivi.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Profil de sol original",
      title: "Explorer les indicateurs du diagnostic",
      instruction: "Active les six repères et distingue ce qui est observé, ce qui doit être mesuré et ce qu’une pratique peut corriger.",
      viewBox: "0 0 760 470",
      caption: "Schéma pédagogique original inspiré du diagnostic des pages 3–4 ; aucun scan n’est republié.",
      shapes: diagnosisShapes,
      hotspots: diagnosisHotspots,
      observation:
        "Une structure compacte, un pH acide et une vie faible se renforcent parfois ; le choix d’un seul produit sans analyse peut manquer la contrainte principale.",
    },
    questions: questions(42, [
      ["Comment classer un pH de 4,5 ?", "Comme nettement acide", ["Comme neutre", "Comme fortement basique", "Comme une unité de rendement"], "La neutralité se situe autour de 7.", "Diagnostic du cours • page 4"],
      ["Pourquoi « compact et très perméable » pose-t-il problème ?", "La compaction et le manque de granulation évoquent plutôt une porosité fonctionnelle réduite", ["Toute compaction accroît toujours l’air", "La perméabilité est un pH", "La structure ne touche jamais l’eau"], "La contradiction demande une mesure d’infiltration et d’aération.", "Correction du tableau • page 4"],
      ["Quelle mesure aide à confirmer la contrainte physique ?", "Un test d’infiltration et une observation de la porosité", ["Le nom de l’engrais", "Le rendement d’un autre pays", "La date de couverture"], "Il faut mesurer ce que l’on souhaite corriger.", originalPracticeSource + " • pages 3–4"],
      ["Pourquoi remplacer « absence de Ca²⁺ » par « teneur faible » ?", "Une analyse quantitative ne justifie pas une absence absolue", ["Le calcium est un gaz", "Tout sol contient la même dose", "Le pH mesure directement le rendement"], "Le vocabulaire doit respecter la portée de la donnée.", "Correction scientifique • page 4"],
      ["Quelle propriété le peu d’humus affecte-t-il potentiellement ?", "Structure, rétention, échange et activité biologique", ["Seulement la couleur du ciel", "Uniquement le numéro de leçon", "Aucune propriété"], "La matière organique relie plusieurs fonctions.", "Cours corrigé • pages 4–5"],
      ["Une vie microbienne faible peut-elle avoir plusieurs causes ?", "Oui, acidité, manque de substrat, compaction ou eau peuvent intervenir", ["Non, l’engrais manque toujours", "Non, seuls les vers comptent", "Oui, mais jamais le pH"], "Les facteurs physiques et chimiques façonnent l’habitat biologique.", originalPracticeSource + " • pages 3–5"],
      ["Que faut-il connaître pour calculer un chaulage ?", "Le pH cible, le pouvoir tampon, la profondeur et le produit", ["Seulement la couleur du sol", "La dose maximale du commerce", "Le rendement du riz uniquement"], "Deux sols au même pH peuvent exiger des doses différentes.", originalPracticeSource + " • pages 4–5"],
      ["Pourquoi de fortes doses de fertilisant peuvent-elles échouer ?", "Elles ne corrigent pas nécessairement acidité, compaction ou faible matière organique", ["Elles rendent toujours le sol neutre", "Elles suppriment toute porosité", "Elles empêchent toute absorption par définition"], "Le nutriment n’est qu’une composante de la fertilité.", "Interprétation corrigée • pages 3–4"],
      ["Un sol à pH 4,5 est-il impropre à toute culture ?", "Non, la tolérance dépend de la culture et des autres contraintes", ["Oui, sans exception", "Oui, car aucune racine n’existe sous pH 7", "Non, car le pH n’a jamais d’effet"], "La décision agronomique vise une culture et un objectif précis.", originalPracticeSource + " • pages 3–4"],
      ["Quel suivi vérifie une restauration intégrée ?", "pH, infiltration, matière organique, activité biologique et rendement", ["Le rendement seul pendant un jour", "La dose apportée sans mesure", "Le prix d’un produit uniquement"], "Plusieurs indicateurs montrent si la fonction du sol s’améliore.", originalPracticeSource + " • pages 3–5"],
    ]),
    corrections: [
      "La contradiction « structure compacte » mais « très perméable à l’eau et à l’air » est explicitée ; le modèle retient une faible porosité fonctionnelle à vérifier.",
      "Les formulations absolues « pas de Ca²⁺ » et « absence de sels minéraux » sont remplacées par teneurs faibles ou disponibilité insuffisante.",
      "Texture et structure ne sont pas confondues, et le pH ne suffit pas à prescrire une dose de chaux.",
      "Un sol acide n’est pas déclaré impropre à toute agriculture : tolérance de la culture et autres contraintes sont prises en compte.",
      "L’échec des fortes doses de fertilisant est relié aux contraintes physiques, chimiques et biologiques non corrigées.",
    ],
  },
  {
    id: "lime-exchange-neutralization",
    title: "Corriger l’acidité par un chaulage raisonné",
    summary:
      "CaO et CaCO₃ sont replacés dans des réactions équilibrées : Ca²⁺ occupe des sites d’échange libérés et les bases neutralisent H⁺, ce qui élève le pH acide.",
    pages: "4–5 et 9–10",
    section: "Amendement calcaire et situation d’évaluation 1",
    durationMinutes: 42,
    xp: 80,
    body: String.raw`
## Deux produits, une même finalité agronomique

Le support présente la chaux vive $CaO$ et le carbonate de calcium $CaCO_3$.

La chaux vive réagit avec l’eau :

$$CaO + H_2O \rightarrow Ca(OH)_2$$

Puis l’hydroxyde de calcium libère :

$$Ca(OH)_2 \rightarrow Ca^{2+} + 2\,OH^-$$

Le carbonate se dissout et réagit dans un milieu acide. Deux écritures utiles sont :

$$CaCO_3 + CO_2 + H_2O \rightleftharpoons Ca^{2+} + 2\,HCO_3^-$$

$$CaCO_3 + 2\,H^+ \rightarrow Ca^{2+} + CO_2 + H_2O$$

La notation imprimée $Ca(CO_3H)_2$ est remplacée par $Ca(HCO_3)_2$.

## Échange et neutralisation : ne pas inverser les ions

Le complexe argilo-humique porte des sites chargés négativement qui retiennent des **cations**. Dans le modèle d’un sol acide, des ions $H^+$ et parfois $Al^{3+}$ occupent une partie de ces sites. Un ion $Ca^{2+}$ peut prendre la place de deux $H^+$ échangeables.

Les ions $OH^-$ ne sont pas les cations fixés que le calcium remplace. Ils neutralisent des protons en solution :

$$H^+ + OH^- \rightarrow H_2O$$

Le corrigé source affirme à tort que $Ca^{2+}$ remplace deux $OH^-$ sur le complexe. Il écrit aussi que le chaulage « fait baisser le pH vers la neutralité ». Pour un sol acide, le pH **augmente** vers une zone plus adaptée.

## Une dose, pas un automatisme

Le chaulage peut réduire acidité et toxicité aluminique, apporter calcium ou magnésium selon le produit, favoriser certaines activités biologiques et contribuer à l’agrégation. Mais un surchaulage peut induire des carences ou déséquilibres.

La dose dépend de l’analyse, du pouvoir tampon, du pH cible, de la profondeur, de la finesse et de la valeur neutralisante. $CaO$ est réactif et caustique : il exige calcul, protection et conseil compétent ; $CaCO_3$ agit généralement plus doucement.

## Reconstituer le document officiel

Figure a : sites portant des $H^+$, avec $Ca^{2+}$ et base dans la solution. Figure b : $Ca^{2+}$ occupe des sites d’échange ; les $H^+$ libérés sont neutralisés. La figure b est le résultat de la figure **a**, non « de la figure b » comme l’écrit le corrigé.
`,
    keyPoint: "sur le complexe : Ca²⁺ remplace 2 H⁺ ; en solution : H⁺ + OH⁻ → H₂O ; le pH acide augmente",
    example:
      "Pour deux sites portant chacun H⁺, l’arrivée d’un Ca²⁺ libère deux protons ; deux OH⁻ peuvent alors former deux molécules d’eau avec eux.",
    methodSteps: [
      "Identifier le produit calcaire et écrire sa réaction équilibrée.",
      "Séparer échange cationique sur le complexe et neutralisation en solution.",
      "Vérifier le sens de variation du pH d’un sol acide.",
      "Conditionner la dose au pouvoir tampon et au pH cible.",
    ],
    interaction: timeline(
      "Du produit calcaire au pH corrigé",
      "Déroule la chaîne et repère l’erreur du corrigé imprimé sur les ions échangés.",
      [
        { label: "Diagnostiquer", shortLabel: "pH", detail: "Mesurer pH, acidité échangeable et pouvoir tampon sur un échantillonnage représentatif." },
        { label: "Choisir", shortLabel: "Produit", detail: "Comparer carbonate, dolomie ou chaux selon réactivité, calcium, magnésium et sécurité." },
        { label: "Réagir", shortLabel: "Base", detail: "Le produit libère ou consomme des espèces capables de neutraliser l’acidité." },
        { label: "Échanger", shortLabel: "Ca²⁺", detail: "Le calcium occupe des sites cationiques et libère des H⁺ ; il ne remplace pas des OH⁻ fixés." },
        { label: "Neutraliser", shortLabel: "H₂O", detail: "Les protons libérés réagissent avec la base pour former notamment de l’eau ; le pH acide augmente." },
        { label: "Contrôler", shortLabel: "Suivi", detail: "Après le délai d’action, mesurer pH, culture et nutriments pour éviter le surchaulage." },
      ],
      "Échange et neutralisation sont couplés mais distincts. Une équation correcte protège le raisonnement et la dose.",
    ),
    questions: questions(52, [
      ["Quelle réaction hydrate correctement la chaux vive ?", "CaO + H₂O → Ca(OH)₂", ["CaO → Ca + O₂", "CaCO₃ → NPK", "CaO + H⁺ → nitrate"], "L’eau transforme l’oxyde en hydroxyde de calcium.", "Cours corrigé • page 4"],
      ["Que libère la dissociation de Ca(OH)₂ ?", "Un Ca²⁺ et deux OH⁻", ["Deux Ca²⁺ et un H⁺", "Un nitrate et un potassium", "Uniquement du CO₂"], "La stœchiométrie conserve atomes et charges.", "Cours corrigé • page 4"],
      ["Quelle formule remplace Ca(CO₃H)₂ ?", "Ca(HCO₃)₂", ["CaH₂CO₃", "Ca₂OH", "NPK₂"], "L’ion hydrogénocarbonate s’écrit HCO₃⁻.", "Cours corrigé • page 5"],
      ["Dans un sol acide, que remplace Ca²⁺ sur le complexe ?", "Deux H⁺ échangeables", ["Deux OH⁻ fixés", "Deux molécules d’eau", "Deux grains de sable"], "Le complexe retient des cations ; OH⁻ est un anion.", "Analyse guidée du mécanisme • pages 9–10"],
      ["Quelle réaction neutralise directement un proton ?", "H⁺ + OH⁻ → H₂O", ["H⁺ + H⁺ → Ca²⁺", "OH⁻ + Ca²⁺ → N₂", "H₂O → K⁺ + P"], "Acide et base forment ici de l’eau.", "Cours corrigé • pages 4–5"],
      ["Comment varie le pH d’un sol acide correctement chaulé ?", "Il augmente vers la zone cible", ["Il baisse toujours", "Il devient forcément 14", "Il ne peut jamais changer"], "Réduire l’acidité signifie augmenter le pH.", "Conséquence guidée du chaulage • page 10"],
      ["Pourquoi le pouvoir tampon est-il important ?", "Il influence la quantité nécessaire pour changer le pH", ["Il mesure le rendement du riz", "Il remplace le pH", "Il impose la même dose à tous les sols"], "Deux sols au même pH initial peuvent réagir différemment.", originalPracticeSource + " • pages 4–5"],
      ["Quelle prudence concerne CaO ?", "Il est caustique et très réactif", ["Il est une plante de couverture", "Il ne réagit jamais avec l’eau", "Il fournit uniquement de l’azote"], "Manipulation, calcul et protection doivent être maîtrisés.", originalPracticeSource + " • page 4"],
      ["Que montre la figure a du document officiel ?", "Un complexe portant des H⁺ avec Ca²⁺ et OH⁻ dans la solution", ["Un complexe portant seulement du potassium", "Une terrasse en pente", "Un grain de pollen"], "C’est l’état initial après l’apport de chaux dans le modèle.", "Situation d’évaluation 1 corrigée • page 9"],
      ["Quel mécanisme explique correctement la transformation a → b ?", "Ca²⁺ échange deux H⁺ puis OH⁻ neutralise les H⁺ libérés", ["Ca²⁺ échange deux OH⁻ fixés", "Le pH baisse parce que l’acidité disparaît", "Le calcium devient du nitrate"], "Le corrigé source inverse anions et cations.", "Situation d’évaluation 1 corrigée • pages 9–10"],
      ["Quel intérêt faut-il déduire du chaulage ?", "Diminuer l’acidité et améliorer éventuellement agrégation et disponibilité", ["Rendre toute culture indépendante de l’eau", "Remplacer toute matière organique", "Abaisser le pH d’un sol acide"], "L’effet reste conditionné par la dose et le diagnostic.", "Situation d’évaluation 1 corrigée • page 10"],
    ], [
      short(
        "Nomme la technique culturale illustrée dans la situation d’évaluation 1.",
        ["amendement calcaire", "chaulage", "le chaulage", "amendement calcaire ou chaulage"],
        "Le document montre l’action d’un produit calcaire sur un complexe acide.",
        "Situation d’évaluation 1 • pages 9–10",
        2,
      ),
    ]),
    corrections: [
      "Les équations de CaO, Ca(OH)₂, CaCO₃ et HCO₃⁻ sont équilibrées et la formule Ca(HCO₃)₂ remplace Ca(CO₃H)₂.",
      "Ca²⁺ remplace deux H⁺ échangeables sur le complexe ; il ne remplace jamais deux OH⁻ fixés.",
      "Les ions OH⁻ neutralisent H⁺ dans la solution pour former de l’eau.",
      "Le chaulage d’un sol acide élève son pH ; la phrase source disant qu’il le fait baisser est corrigée.",
      "La figure b est le résultat de la figure a, et non d’elle-même.",
      "La dose est conditionnée par pH cible et pouvoir tampon ; CaO est signalé comme caustique.",
    ],
  },
  {
    id: "humus-clay-soil-properties",
    title: "Construire des agrégats avec humus, argile et calcium",
    summary:
      "L’amendement humifère relie matière organique transformée, complexe argilo-humique, porosité, réserve, échanges et activité biologique.",
    pages: "5",
    section: "Amendement humifère : propriétés physiques, chimiques et biologiques",
    durationMinutes: 38,
    xp: 90,
    body: String.raw`
## D’où vient l’humus ?

Le support définit l’humus comme une matière sombre issue d’une origine « exclusivement végétale ». Cette exclusivité est fausse. Les matières organiques du sol résultent de résidus **végétaux, animaux et microbiens**, de leurs produits de transformation et de composés stabilisés à des degrés variés.

Une matière organique apportée n’est pas immédiatement de l’humus. Elle est fragmentée, décomposée, respirée, minéralisée ou transformée. Le climat, l’aération, l’humidité, le rapport carbone/azote et les organismes contrôlent ces trajectoires.

## Une architecture d’agrégats

Les surfaces d’argile et de matière organique portent des charges. Avec des cations comme $Ca^{2+}$, des associations et ponts contribuent à former un **complexe argilo-humique** et des agrégats stables.

Cette organisation :

- crée des pores de tailles différentes ;
- améliore souvent infiltration et aération ;
- augmente la résistance à la battance et à l’érosion ;
- favorise l’exploration racinaire.

Une bonne structure ne signifie toutefois ni drainage infini ni réserve illimitée : macropores et micropores jouent des rôles complémentaires.

## Échanges et réserve

Le complexe retient des cations nutritifs échangeables tels que $K^+$, $Ca^{2+}$, $Mg^{2+}$ ou $NH_4^+$. La **capacité d’échange cationique** ne remplace pas la solution du sol : les racines absorbent des formes dissoutes, alimentées par des échanges et des transformations.

La matière organique retient aussi de l’eau, fournit énergie et habitat aux microorganismes, et libère progressivement des nutriments. L’affirmation source selon laquelle elle contient des « activateurs de croissance » n’est pas utilisée comme mécanisme universel.

## Choisir un amendement organique

Compost mûr, fumier, résidus, paillage ou engrais vert n’ont pas la même composition. Il faut vérifier maturité, dose, contaminants, salinité, synchronisation des nutriments et besoin du sol.

> **Boucle vertueuse conditionnelle :** résidus adaptés → activité biologique → agrégation et cycles → racines plus fonctionnelles → nouveaux résidus. Elle exige couverture et limitation des perturbations destructrices.

Le but n’est pas d’ajouter « le plus de matière possible », mais d’entretenir une matière organique fonctionnelle sans polluer l’eau ni immobiliser durablement l’azote.
`,
    keyPoint: "argile + humus + cations → agrégats ; pores + échanges + organismes → fonctions du sol",
    example:
      "Un compost mûr peut améliorer agrégation et capacité d’échange ; sa dose reste ajustée car il apporte aussi sels, carbone et parfois nutriments disponibles.",
    methodSteps: [
      "Identifier l’origine et l’état de transformation de la matière organique.",
      "Relier charges, cations et stabilité des agrégats.",
      "Distinguer réserve échangeable, solution du sol et absorption racinaire.",
      "Évaluer qualité, dose et risques de l’amendement.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Agrégat original à explorer",
      title: "Relier argile, humus, calcium et pores",
      instruction: "Active les six repères et explique comment une organisation microscopique produit des fonctions visibles à l’échelle de la parcelle.",
      viewBox: "0 0 760 470",
      caption: "Schéma pédagogique original inspiré du texte de la page 5 ; aucun scan n’est republié.",
      shapes: aggregateShapes,
      hotspots: aggregateHotspots,
      observation:
        "L’agrégat stable associe composants minéraux et organiques ; il ne transforme pas tout nutriment retenu en nutriment immédiatement absorbé.",
    },
    questions: questions(63, [
      ["De quelles origines l’humus peut-il provenir ?", "De résidus végétaux, animaux et microbiens transformés", ["Exclusivement de feuilles", "Exclusivement de calcium", "Uniquement d’engrais NPK"], "L’origine exclusivement végétale du support est corrigée.", "Cours corrigé • page 5"],
      ["Une matière organique fraîche est-elle déjà de l’humus ?", "Non, plusieurs transformations sont nécessaires", ["Oui, toujours immédiatement", "Oui, si elle est verte", "Non, car l’humus est un minéral"], "Décomposition, minéralisation et stabilisation prennent du temps.", originalPracticeSource + " • page 5"],
      ["Quel ion peut favoriser des ponts dans le complexe argilo-humique ?", "Ca²⁺", ["OH⁻ fixé comme cation", "N₂ gazeux", "CO₂ uniquement"], "Le calcium est un cation divalent échangeable.", "Cours corrigé • pages 4–5"],
      ["Quel effet physique accompagne souvent des agrégats stables ?", "Une meilleure porosité fonctionnelle et moins de battance", ["Une compaction automatique", "La disparition de toute eau", "Une texture toujours sableuse"], "Structure et pores influencent infiltration et aération.", "Cours corrigé • page 5"],
      ["Que retient la capacité d’échange cationique ?", "Des cations échangeables", ["Seulement des anions OH⁻", "Des terrasses", "La pluie entière"], "Les charges négatives retiennent notamment K⁺, Ca²⁺, Mg²⁺ et NH₄⁺.", originalPracticeSource + " • page 5"],
      ["Où les racines prélèvent-elles directement les ions ?", "Dans la solution du sol", ["Dans le pied de page", "Dans une roche sans eau", "Dans l’atmosphère pour tous les éléments"], "Les réserves doivent alimenter la phase dissoute.", originalPracticeSource + " • page 5"],
      ["Quel service biologique rend la matière organique ?", "Elle fournit énergie et habitat au réseau du sol", ["Elle supprime tous les microbes", "Elle remplace l’air", "Elle empêche toute racine"], "Les organismes utilisent les composés organiques et transforment les résidus.", "Cours corrigé • page 5"],
      ["Pourquoi un compost doit-il être contrôlé ?", "Maturité, salinité, contaminants et dose peuvent varier", ["Tout compost est identique", "Il ne contient jamais de nutriments", "Sa couleur fixe la dose"], "L’amendement organique n’est pas un produit uniforme.", originalPracticeSource + " • page 5"],
      ["Minéralisation et capacité d’échange ont-elles le même rôle ?", "Non, l’une libère des formes minérales et l’autre retient des cations échangeables", ["Oui, elles désignent le pH", "Oui, elles fabriquent des terrasses", "Non, car aucune ne concerne les ions"], "Les processus sont complémentaires mais distincts.", originalPracticeSource + " • pages 3–5"],
      ["Quelle stratégie entretient la matière organique ?", "Restituer des résidus adaptés, couvrir et limiter les pertes", ["Brûler systématiquement la couverture", "Laisser le sol nu", "Ajouter sans vérifier la qualité"], "L’entretien repose sur des apports et une protection cohérente.", originalPracticeSource + " • page 5"],
    ]),
    corrections: [
      "L’humus n’est plus défini comme exclusivement végétal : origines végétale, animale et microbienne sont incluses.",
      "Matière organique fraîche, humification et minéralisation sont distinguées.",
      "Le complexe argilo-humique retient des cations échangeables sans les rendre tous immédiatement absorbables.",
      "Les « activateurs de croissance » ne sont pas utilisés comme mécanisme général non démontré.",
      "Les amendements organiques sont différenciés par maturité, composition, dose et risques.",
    ],
  },
  {
    id: "soil-protection-practices",
    title: "Choisir paillage, rotation, jachère, couverture et terrasses",
    summary:
      "Les pratiques de protection agissent par couverture, diversification, ralentissement de l’eau et restauration ; leur effet dépend du site et de la gestion.",
    pages: "5–6 et 8",
    section: "Techniques de protection et activités d’application 1–2 sous III — Exercices",
    durationMinutes: 44,
    xp: 100,
    body: String.raw`
## Garder le sol couvert

Le **paillage** place une matière végétale morte à la surface. Il amortit l’impact des gouttes, limite battance et érosion, réduit l’évaporation, modère la température et peut nourrir progressivement le sol. Il ne lutte donc pas « uniquement contre l’érosion ».

Les **plantes de couverture** maintiennent des racines vivantes, captent une partie des nutriments, favorisent infiltration et activité biologique, et protègent contre vent et pluie. L’espèce et la date doivent éviter concurrence, invasivité ou réserve d’hôtes indésirables.

## Diversifier dans le temps et l’espace

La **rotation** est la succession planifiée de cultures sur une même parcelle. Elle répartit les besoins, rompt certains cycles de ravageurs, diversifie les racines et peut inclure une légumineuse.

L’**assolement** décrit plutôt la répartition des cultures entre parcelles pendant une campagne. Les deux notions sont liées mais pas strictement synonymes.

La **jachère** met une parcelle temporairement hors culture. Sa fertilité ne se reconstitue pas automatiquement : durée, couverture, pâturage, feux, érosion et retour de biomasse déterminent le résultat.

## Organiser un versant

Des **terrasses** ou banquettes suivant la topographie raccourcissent la pente, ralentissent l’eau et réduisent l’érosion si elles sont dimensionnées, entretenues et drainées. Mal conçues, elles peuvent concentrer l’eau, rompre ou engorger.

Le texte cite aussi engazonnement, reboisement et terrains dénudés. La reconstruction les conserve sous forme de couverture pérenne, bandes enherbées, agroforesterie ou restauration adaptée ; planter des arbres n’est pas une solution unique à toute parcelle agricole.

## Deux exercices officiels

L’activité 1 associe :

- assolement/rotation → alternance de cultures aux besoins différents ;
- jachère → repos temporaire ;
- paillage → matière végétale morte ;
- terrassement → bandes planes en travers de pente.

L’activité 2 retient les affirmations **1, 2 et 3** : les engrais organiques sont transformés avant assimilation, le chaulage élève le pH d’un sol acide et l’amendement humifère nourrit le réseau biologique. Les propositions « uniquement de l’humus » et « uniquement contre l’érosion » sont fausses.

> **Tri documentaire protégé :** l’association de la page 6 appartient à la construction du cours et reste retirée. Les deux activités ci-dessus, placées sous **III — Exercices** page 8, sont intégrées intégralement.
`,
    keyPoint: "protéger = couvrir + diversifier + ralentir l’eau + restaurer + entretenir",
    example:
      "Sur une pente cultivée, associer couvert, bandes suivant les courbes de niveau et rotation protège mieux qu’une terrasse nue et non entretenue.",
    methodSteps: [
      "Identifier le processus de dégradation : battance, ruissellement, érosion ou épuisement.",
      "Choisir la pratique qui agit directement sur ce processus.",
      "Vérifier adaptation à la pente, au climat et au système cultural.",
      "Prévoir entretien et indicateur de suivi.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Versant protégé original",
      title: "Explorer une protection combinée",
      instruction: "Active les six repères et distingue couverture de surface, enracinement, ralentissement de l’eau et aménagement.",
      viewBox: "0 0 760 470",
      caption: "Schéma pédagogique original inspiré du texte des pages 5–6 ; aucun scan n’est republié.",
      shapes: slopeShapes,
      hotspots: slopeHotspots,
      observation:
        "La technique efficace dépend du processus dominant. Un versant protégé combine souvent plusieurs pratiques et un entretien régulier.",
    },
    questions: questions(73, [
      ["Quel processus le paillage réduit-il directement ?", "L’impact des gouttes et l’évaporation de surface", ["La fixation de tout N₂ sans microbe", "Le pH jusqu’à 14", "La pente géologique"], "La couverture morte protège et modère le microclimat.", originalPracticeSource + " • pages 5–6"],
      ["Pourquoi la jachère n’est-elle pas une garantie automatique ?", "Sa durée, sa couverture et sa gestion déterminent la restauration", ["Toute jachère détruit le sol", "Elle apporte toujours 60 kg de N", "Elle remplace toute rotation"], "Un repos nu et érodé peut ne pas reconstituer les fonctions.", originalPracticeSource + " • pages 5–6"],
      ["Quelle différence précise rotation et assolement ?", "Rotation = succession temporelle ; assolement = répartition spatiale annuelle", ["Ils sont sans rapport avec les cultures", "Rotation = chaulage ; assolement = engrais", "Ils désignent tous deux une terrasse"], "Le support les rapproche, le cours corrige la synonymie stricte.", "Vocabulaire corrigé • pages 5–6"],
      ["Quel service rend un couvert vivant ?", "Il protège, entretient des racines et recycle des nutriments", ["Il laisse toujours le sol nu", "Il augmente forcément l’érosion", "Il dissout toute l’argile"], "Le couvert agit à la surface et dans le profil.", originalPracticeSource + " • pages 5–6"],
      ["Quelle condition rend une terrasse utile ?", "Un dimensionnement, un drainage et un entretien adaptés", ["Une pente ignorée", "Une rupture volontaire", "L’absence totale de couverture"], "Un ouvrage peut concentrer l’eau s’il est mal conçu.", originalPracticeSource + " • pages 5–6"],
      ["Comment reprendre le reboisement cité page 5 ?", "Comme restauration ou agroforesterie adaptée aux zones et objectifs", ["Comme remplacement obligatoire de toute culture", "Comme preuve que le paillage est inutile", "Comme fertilisant minéral"], "Les arbres sont un levier parmi d’autres.", "Texte adapté du cours • pages 5–6"],
      ["Dans l’activité 1, quelle description correspond à l’assolement ?", "Alternance ou organisation de cultures aux besoins différents", ["Matière végétale morte posée au sol", "Mise au repos après récolte", "Bandes planes en travers d’une pente"], "Le corrigé officiel donne 1-d.", "Activité d’application 1 • page 8"],
      ["Dans l’activité 1, quelle description correspond à la jachère ?", "Mise au repos temporaire d’un sol", ["Alternance de cultures", "Apport de chaux vive", "Construction d’un forage"], "Le corrigé officiel donne 2-b.", "Activité d’application 1 • page 8"],
      ["Dans l’activité 1, quelle description correspond au paillage ?", "Mise en place de matière végétale morte sur le sol", ["Apport de CaCO₃", "Succession de rizières", "Bandes planes de pente"], "Le corrigé officiel donne 3-a.", "Activité d’application 1 • page 8"],
      ["Dans l’activité 1, quelle description correspond au terrassement ?", "Réalisation de bandes planes en travers d’une pente", ["Repos temporaire", "Paillis de surface", "Dissolution d’un engrais"], "Le corrigé officiel donne 4-c.", "Activité d’application 1 • page 8"],
      ["Comment classer l’affirmation 1 : « les engrais organiques sont minéralisés avant assimilation » ?", "Juste dans le modèle de l’exercice", ["Fausse car les plantes absorbent directement la paille", "Hors sujet car aucun ion n’existe", "Impossible car la minéralisation est une terrasse"], "La matière organique doit être transformée en formes disponibles.", "Activité d’application 2 • page 8"],
      ["Comment classer l’affirmation 2 : « l’amendement calcaire élève le pH des sols acides » ?", "Juste", ["Fausse, il abaisse toujours le pH", "Hors sujet, le pH est un rendement", "Fausse, il fournit seulement N₂"], "Le chaulage neutralise l’acidité.", "Activité d’application 2 • page 8"],
      ["Comment classer l’affirmation 3 sur l’amendement humifère et les microorganismes ?", "Juste", ["Fausse, l’humus détruit toute vie", "Hors sujet, les microbes sont des minéraux", "Fausse, il ne fournit jamais de carbone"], "La matière organique sert de support et de ressource énergétique.", "Activité d’application 2 • page 8"],
      ["Pourquoi l’affirmation 4 « uniquement de l’humus » est-elle fausse ?", "Les apports organiques peuvent aussi fournir des nutriments et d’autres composés", ["Ils ne contiennent jamais de carbone", "Ils sont tous du CaO", "Ils servent seulement à terrasser"], "Le mot uniquement rend la proposition fausse.", "Activité d’application 2 • page 8"],
      ["Pourquoi l’affirmation 5 « uniquement contre l’érosion » est-elle fausse ?", "Le paillage agit aussi sur battance, eau, température et matière organique", ["Il ne protège jamais la surface", "Il remplace toute culture", "Il abaisse toujours le pH"], "Le corrigé officiel retient seulement 1, 2 et 3.", "Activité d’application 2 • page 8"],
    ]),
    corrections: [
      "Assolement spatial et rotation temporelle sont distingués au lieu d’être traités comme synonymes stricts.",
      "La jachère est présentée comme conditionnelle à sa durée, sa couverture et sa gestion, non comme restauration automatique.",
      "Le paillage ne lutte pas uniquement contre l’érosion : battance, évaporation, température et matière organique sont ajoutées.",
      "Les terrasses sont conditionnées par conception, drainage et entretien ; le reboisement cité page 5 est conservé comme levier adapté.",
      "L’activité interne de la page 6 est retirée, tandis que les activités 1 et 2 placées sous III — Exercices page 8 sont intégrées sans confusion.",
    ],
  },
  {
    id: "soil-official-application-exercises",
    title: "Compléter l’exercice officiel sur les engrais",
    summary:
      "Les huit blancs de l’activité 3 sont conservés dans l’ordre, avec une correction sur la durée réelle des effets minéraux et organiques.",
    pages: "8–9",
    section: "III — Exercices : activité d’application 3",
    durationMinutes: 34,
    xp: 110,
    body: String.raw`
## Deux vitesses de fourniture

L’activité 3 compare des engrais minéraux solubles et des matières organiques. Le texte officiel complété est :

> Les engrais chimiques se présentent sous forme de **sels** que l’on répand sur le sol. Ils se **dissolvent** dans la solution du sol dans laquelle ils libèrent des **éléments minéraux** directement assimilables par les plantes. Les engrais organiques sont des **substances organiques**. Mélangés au sol, ils sont **transformés** en éléments minéraux **utilisables** par les plantes. L’effet des engrais chimiques est **immédiat** mais il ne dure que le temps **d’une récolte**.

Les huit mots et groupes de mots sont conservés parce qu’ils constituent le corrigé officiel.

## Ce que signifie « soluble »

Un sel doit se dissoudre pour libérer des ions dans la solution du sol. Cela ne garantit pas que 100 % de la dose sera absorbée : adsorption, précipitation, volatilisation, lixiviation, ruissellement, immobilisation biologique et profondeur des racines interviennent.

Les matières organiques subissent des transformations biologiques. La vitesse dépend de leur qualité, du rapport C/N, de l’eau, de l’oxygène et de la température. Une forte teneur organique ne signifie pas une libération immédiate.

## Une simplification à protéger

« Immédiat » veut dire **plus rapidement accessible dans le modèle**, pas instantané ni sans perte. « Le temps d’une récolte » est une généralisation scolaire : l’effet résiduel varie selon nutriment, formulation, dose, sol et climat. Le phosphore peut persister sous des formes peu disponibles ; certains apports azotés sont perdus rapidement ; un amendement organique peut agir sur plusieurs campagnes.

## La décision raisonnée

Comparer les sources selon :

1. le nutriment et la quantité réellement nécessaires ;
2. la vitesse recherchée ;
3. la contribution à la matière organique ;
4. les risques de pertes ;
5. le coût et la qualité du produit ;
6. la possibilité d’associer source organique et complément minéral.

> **Fidélité contrôlée :** les huit réponses sont évaluées séparément et dans l’ordre 1 à 8. Elles ne sont pas fusionnées en une seule question, afin de restituer toute l’activité.
`,
    keyPoint: "minéral soluble : ions plus rapides ; organique : transformations biologiques ; durée : variable selon le système",
    example:
      "Un nitrate peut être disponible rapidement mais aussi lixivié ; un résidu riche en carbone peut d’abord immobiliser l’azote avant une minéralisation ultérieure.",
    methodSteps: [
      "Repérer la nature minérale ou organique de la source.",
      "Suivre dissolution ou transformation jusqu’à la forme disponible.",
      "Vérifier le synchronisme entre libération et besoin de la culture.",
      "Nuancer la durée par le sol, le climat et la formulation.",
    ],
    interaction: timeline(
      "De l’apport à l’absorption",
      "Compare la voie minérale rapide à la voie organique transformée et repère leurs pertes possibles.",
      [
        { label: "Apporter", shortLabel: "Source", detail: "Le produit est caractérisé par sa composition, sa dose et sa qualité." },
        { label: "Dissoudre", shortLabel: "Minéral", detail: "Les sels solubles libèrent des ions dans l’eau du sol." },
        { label: "Décomposer", shortLabel: "Organique", detail: "La faune et les microbes fragmentent et transforment les matières organiques." },
        { label: "Minéraliser", shortLabel: "Ions", detail: "Une fraction organique devient des formes minérales après un délai variable." },
        { label: "Absorber", shortLabel: "Racines", detail: "La culture prélève selon ses besoins, son enracinement, le pH et l’eau disponible." },
        { label: "Perdre ou retenir", shortLabel: "Bilan", detail: "Lixiviation, volatilisation, adsorption ou immobilisation modifient l’efficacité et l’effet résiduel." },
      ],
      "Rapide ne signifie pas intégralement absorbé ; lent ne signifie pas inefficace. Le synchronisme décide d’une grande part de l’efficience.",
    ),
    questions: questions(88, [
      ["Sous quelle forme une plante absorbe-t-elle surtout les nutriments du sol ?", "Sous forme d’ions dissous", ["Sous forme de paille entière", "Sous forme de terrasses", "Sous forme de roches non altérées uniquement"], "La solution du sol met des espèces minérales à portée des racines.", originalPracticeSource + " • pages 8–9"],
      ["Pourquoi un engrais soluble peut-il être perdu ?", "Des ions peuvent être lixiviés, ruisseler, se volatiliser ou être immobilisés", ["Toute la dose entre forcément dans la plante", "La dissolution supprime l’eau", "Les racines absorbent sans limite"], "Disponibilité et absorption effective ne sont pas identiques.", originalPracticeSource + " • pages 8–9"],
      ["Qu’est-ce qui règle la vitesse de transformation organique ?", "Qualité du résidu, eau, oxygène, température et organismes", ["Le numéro de la page seulement", "La pente uniquement", "Une dose universelle de calcium"], "Les conditions contrôlent l’activité biologique.", originalPracticeSource + " • pages 8–9"],
      ["Pourquoi « une récolte » doit-il être nuancé ?", "L’effet résiduel dépend du nutriment, de la formulation, du sol et du climat", ["Tout engrais disparaît le jour de la récolte", "Aucun nutriment ne persiste", "La récolte mesure le pH"], "La phrase appartient au modèle scolaire, pas à une loi universelle.", "Précision guidée de l’activité 3 • page 9"],
    ], [
      short("Complète le blanc 1 de l’activité 3.", ["sels", "des sels", "sel"], "Les engrais minéraux sont présentés comme des sels.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 2 de l’activité 3.", ["dissolvent", "se dissolvent", "ils se dissolvent"], "Les sels se dissolvent dans la solution du sol.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 3 de l’activité 3.", ["éléments minéraux", "des éléments minéraux", "elements mineraux"], "La dissolution libère des éléments minéraux dans le vocabulaire source.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 4 de l’activité 3.", ["substances organiques", "des substances organiques", "substance organique"], "Les engrais organiques sont des matières ou substances organiques.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 5 de l’activité 3.", ["transformés", "transformees", "transformés en éléments minéraux"], "Ils doivent être transformés avant libération de formes minérales.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 6 de l’activité 3.", ["utilisables", "assimilables", "utilisables par les plantes"], "Le corrigé emploie utilisables.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 7 de l’activité 3.", ["immédiat", "immediat", "effet immédiat"], "Le corrigé qualifie l’effet minéral d’immédiat dans son modèle simplifié.", "Activité d’application 3 • page 9"),
      short("Complète le blanc 8 de l’activité 3.", ["d’une récolte", "une récolte", "d'une recolte", "d'une récolte"], "La formulation officielle est conservée puis nuancée dans le cours.", "Activité d’application 3 • page 9"),
    ]),
    corrections: [
      "Les huit réponses officielles sont conservées séparément et dans leur ordre exact.",
      "« Directement assimilable » est limité aux ions disponibles dans la solution, sans supposer une absorption totale.",
      "« Immédiat » est compris comme relativement rapide, non instantané ni sans pertes.",
      "La durée « d’une récolte » est signalée comme simplification : effet résiduel variable selon nutriment, produit, sol et climat.",
      "Transformation organique, minéralisation et absorption racinaire sont séparées.",
    ],
  },
  {
    id: "soil-management-final-mission",
    title: "Décider avec un budget N–P–K corrigé",
    summary:
      "La mission finale compare disponibilités du sol et besoins de quatre cultures, répare la justification du riz et remplace le NPK générique par un plan nutritif mesuré.",
    pages: "10–11",
    section: "Situation d’évaluation 2 : choix cultural et fertilisation",
    durationMinutes: 48,
    xp: 130,
    body: String.raw`
## Deux tableaux à mettre dans la même unité

Le sol contient, dans le modèle de l’exercice :

| Nutriment | N | P | K |
|---|---:|---:|---:|
| Quantité annoncée (kg/ha) | 50 | 23,6 | 100 |

Les valeurs attribuées aux cultures sont :

| Culture | N | P | K |
|---|---:|---:|---:|
| Riz | 46 | 5,23 | 10 |
| Tomate | 180 | 24,6 | 250 |
| Coton | 150 | 4,3 | 134 |
| Banane | 61,5 | 7,7 | 161 |

Pour la tomate, le potassium est la plus grande quantité du tableau : 250 kg/ha. Ses trois valeurs dépassent celles annoncées disponibles : $180>50$, $24{,}6>23{,}6$ et $250>100$.

## Le riz : corriger une inégalité décisive

Le riz est la seule culture dont les trois valeurs ne dépassent pas le stock donné :

$$46 \le 50,\qquad 5{,}23 \le 23{,}6,\qquad 10 \le 100$$

Le corrigé source choisit correctement le riz, mais affirme que ses besoins sont **supérieurs** aux quantités disponibles. C’est l’inverse : dans ce modèle, ils sont inférieurs ou égaux.

## Calculer des déficits théoriques sans prescrire

Pour la tomate, les écarts tabulaires sont :

$$\Delta N = 180-50 = 130\ \mathrm{kg/ha}$$

$$\Delta P = 24{,}6-23{,}6 = 1\ \mathrm{kg/ha}$$

$$\Delta K = 250-100 = 150\ \mathrm{kg/ha}$$

Ces différences ne sont **pas des doses de sacs d’engrais**. Il faudrait connaître disponibilité réelle, objectif de rendement, profondeur, efficacité d’utilisation, pertes, fractionnement et composition du produit. Un grade N–P₂O₅–K₂O ne donne pas directement des kilogrammes de P et K élémentaires.

## Une solution raisonnable

Le document recommande « un amendement chimique NPK ». La correction propose plutôt :

1. confirmer le diagnostic par analyse représentative ;
2. établir un budget nutritif spécifique à la tomate ;
3. choisir la source et le grade adaptés, avec conversion correcte ;
4. fractionner, placer et dater les apports ;
5. associer matière organique et couverture si le diagnostic le justifie ;
6. suivre culture, pH, eau et pertes.

Le rendement faible ne prouve pas que seule la nutrition minérale est en cause. Eau, structure, maladies et climat doivent rester dans le diagnostic.

> **Limite documentaire :** page 12 est blanche hors pied de page. Aucun exercice, chiffre ou corrigé supplémentaire n’est inventé.
`,
    keyPoint: "riz compatible dans le tableau car besoins ≤ stock ; tomate : déficits théoriques N 130, P 1, K 150 kg/ha",
    example:
      "Le déficit K théorique de 150 kg/ha ne signifie pas 150 kg/ha d’un engrais NPK : il faut convertir le grade, corriger l’efficacité et fractionner selon le besoin.",
    methodSteps: [
      "Aligner les unités et comparer chaque nutriment séparément.",
      "Repérer la culture qui satisfait simultanément les trois inégalités.",
      "Calculer les écarts sans les confondre avec une prescription.",
      "Proposer un plan spécifique, fractionné, suivi et compatible avec la protection du sol.",
    ],
    interaction: diagram(
      "Le filtre de décision N–P–K",
      "Explore les six cartes et transforme les deux tableaux en décision prudente.",
      "Analyse du sol",
      "Le modèle annonce 50 kg/ha de N, 23,6 de P et 100 de K ; ces nombres doivent être comparés dans la même convention aux besoins fournis.",
      [
        { id: "tomato", label: "Tomate", role: "Déficitaire", detail: "N, P et K dépassent les disponibilités annoncées ; K est la plus grande valeur consommée." },
        { id: "rice", label: "Riz", role: "Compatible", detail: "46≤50, 5,23≤23,6 et 10≤100 : c’est le choix du modèle scolaire." },
        { id: "cotton", label: "Coton", role: "N et K", detail: "150>50 et 134>100, même si P=4,3 reste sous 23,6." },
        { id: "banana", label: "Banane", role: "N et K", detail: "61,5>50 et 161>100 ; P=7,7 reste sous la disponibilité annoncée." },
        { id: "budget", label: "Budget tomate", role: "Calculer", detail: "Écarts théoriques : N 130, P 1 et K 150 kg/ha, avant toute correction d’efficacité." },
        { id: "plan", label: "Plan de gestion", role: "Décider", detail: "Analyse, objectif, grade, fractionnement, matière organique, couverture et suivi remplacent l’apport NPK générique." },
      ],
      "Le tableau permet un raisonnement comparatif. Il ne remplace ni une recommandation locale ni la conversion des unités commerciales.",
    ),
    questions: questions(92, [
      ["Pourquoi la première récolte de tomate peut-elle être faible dans le modèle ?", "Les trois besoins indiqués dépassent les disponibilités du tableau", ["Le sol contient trop de tous les nutriments", "Le riz a déjà absorbé les tomates", "Le potassium est absent de la tomate"], "180>50, 24,6>23,6 et 250>100.", "Situation d’évaluation 2 • pages 10–11"],
      ["Quelle culture est la mieux adaptée au seul bilan minéral fourni ?", "Le riz", ["La tomate", "Le coton", "La banane"], "Ses trois valeurs restent sous les disponibilités annoncées.", "Situation d’évaluation 2 • pages 10–11"],
      ["Quelle justification corrige le texte source pour le riz ?", "Ses besoins sont inférieurs ou égaux aux quantités disponibles", ["Ses besoins sont tous supérieurs", "Il n’utilise aucun minéral", "Il fixe seul tout le N₂"], "Le corrigé imprimé inverse l’inégalité.", "Situation d’évaluation 2 corrigée • page 11"],
      ["Quelle solution remplace l’apport NPK générique ?", "Un plan spécifique fondé sur analyse, budget, grade, fractionnement et suivi", ["La dose maximale sans calcul", "Un apport unique identique partout", "La suppression de toute couverture"], "Une recommandation agronomique dépend du site et du rendement visé.", "Situation d’évaluation 2 corrigée • pages 10–11"],
      ["Quel déficit théorique de N calcule-t-on pour la tomate ?", "130 kg/ha", ["50 kg/ha", "180 kg/ha", "1 kg/ha"], "180 − 50 = 130.", "Calcul guidé corrigé • pages 10–11"],
      ["Quel déficit théorique de P calcule-t-on ?", "1 kg/ha", ["23,6 kg/ha", "24,6 kg/ha", "150 kg/ha"], "24,6 − 23,6 = 1.", "Calcul guidé corrigé • pages 10–11"],
      ["Quel déficit théorique de K calcule-t-on ?", "150 kg/ha", ["100 kg/ha", "250 kg/ha", "130 kg/ha"], "250 − 100 = 150.", "Calcul guidé corrigé • pages 10–11"],
      ["Quel écart tabulaire est le plus grand pour la tomate ?", "L’écart en potassium, 150 kg/ha", ["L’écart en phosphore, 1 kg/ha", "L’écart en azote, 13 kg/ha", "Aucun écart"], "K dépasse de 150, contre 130 pour N et 1 pour P.", originalPracticeSource + " • pages 10–11"],
      ["Quelles inégalités vérifie le riz ?", "N 46≤50, P 5,23≤23,6 et K 10≤100", ["N 46>50, P 5,23>23,6 et K 10>100", "N 180≤50, P 24,6≤23,6 et K 250≤100", "Seulement K 250≤100"], "Les trois critères doivent être satisfaits ensemble.", "Vérification guidée du tableau • pages 10–11"],
      ["Quels nutriments dépassent le stock pour le coton ?", "N et K", ["P seulement", "N, P et K tous", "Aucun"], "150>50 et 134>100, tandis que 4,3<23,6.", originalPracticeSource + " • pages 10–11"],
      ["Quels nutriments dépassent le stock pour la banane ?", "N et K", ["P seulement", "K seulement", "Aucun"], "61,5>50 et 161>100, tandis que 7,7<23,6.", originalPracticeSource + " • pages 10–11"],
      ["Pourquoi les écarts ne sont-ils pas directement des doses d’engrais ?", "Disponibilité, efficacité, pertes et composition commerciale doivent être intégrées", ["Un kilogramme n’a pas d’unité", "Les plantes n’absorbent jamais d’ions", "Tout engrais contient 100 % de N, P et K"], "Le budget de nutriments précède la conversion en produit.", originalPracticeSource + " • pages 10–11"],
      ["Que signifie un grade commercial N–P₂O₅–K₂O ?", "Il exprime N et des équivalents oxydes, pas directement N–P–K élémentaires", ["Il donne le pH du sol", "Il mesure la pente", "Il nomme trois cultures"], "P₂O₅ et K₂O exigent une conversion pour comparer à P et K.", originalPracticeSource + " • pages 10–11"],
      ["Quelle vérification complète le bilan nutritif ?", "Contrôler eau, pH, structure, santé de la culture et risques de pertes", ["Observer seulement la couleur du sac", "Ignorer les racines", "Mesurer uniquement le numéro de parcelle"], "La nutrition n’est qu’une dimension du rendement.", originalPracticeSource + " • pages 10–11"],
    ], [
      short(
        "Relève le sel minéral le plus consommé par la tomate dans le tableau.",
        ["potassium", "le potassium", "K", "potassium K"],
        "La tomate est associée à 250 kg/ha de potassium, la plus grande des trois valeurs.",
        "Situation d’évaluation 2 • pages 10–11",
        2,
      ),
    ]),
    corrections: [
      "Le potassium à 250 kg/ha est conservé comme nutriment le plus consommé par la tomate dans le tableau.",
      "La justification du riz est inversée par rapport au corrigé fautif : ses besoins sont inférieurs ou égaux aux disponibilités.",
      "Les écarts théoriques tomate sont calculés à N 130, P 1 et K 150 kg/ha sans devenir des doses prescrites.",
      "L’engrais NPK n’est plus appelé amendement chimique et le grade N–P₂O₅–K₂O est distingué de N–P–K élémentaires.",
      "La disponibilité réelle, l’efficacité, le fractionnement, le pH, l’eau et la protection du sol conditionnent la recommandation.",
      "La page 12 blanche n’est ni sourcée comme cours ni remplie par un contenu inventé.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtSoilProtectionPath: LearningPath = {
  id: "terminale-d-svt-l15-soil-protection",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel:
    "Programme ivoirien • Terminale D • Support complet fidèlement reconstruit et corrigé",
  curriculumSourceUrl: guideUrl,
  theme: { number: 2, title: "La gestion des sols" },
  chapterNumber: 15,
  title: "L’amélioration et la protection des sols",
  description:
    "Dix niveaux pour diagnostiquer la fertilité, raisonner engrais et amendements, restaurer un sol acide, protéger la surface et décider à partir des évaluations officielles corrigées.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer fertilité physique, chimique et biologique, fertilisant, amendement et technique de protection",
    "Interpréter une réponse dose-rendement sans transformer le meilleur traitement observé en optimum universel",
    "Expliquer les rôles complémentaires des vers de terre, microorganismes, résidus et engrais verts",
    "Diagnostiquer un sol acide et expliquer correctement neutralisation, échange cationique et chaulage",
    "Relier humus, argile, calcium, agrégats, porosité, eau et activité biologique",
    "Comparer paillage, jachère, rotation, couverture, terrasses et reboisement selon leurs limites",
    "Établir un budget nutritif prudent et proposer une gestion intégrée fondée sur l’analyse du sol",
  ],
  modules: [
    {
      id: "soil-protection-mastery",
      title: "Maîtriser l’amélioration et la protection raisonnées des sols",
      description:
        "Une progression complète, du diagnostic de fertilité à une décision culturale et conservatoire vérifiable.",
      lessons: builtLevels,
    },
  ],
};
