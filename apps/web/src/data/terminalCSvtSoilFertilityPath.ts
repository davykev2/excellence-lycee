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

const sourceDocument = "Programme éducatif et guide d’exécution SVT Terminale C (DPFC)";
const sourceUrl = "https://dpfc-ci.net/wp-content/uploads/dpfc_fichiers/2018-2019/programmes_guides/SVT/PROGR_ED_SVT_2018-2019_TLE_C_APC.pdf";
const evaluationSource = "Programme DPFC, pages 9 et 18 - adaptation évaluative";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel = evaluationSource,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel = evaluationSource,
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
  sourceLabel = evaluationSource,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], answer ? 0 : 1, explanation, sourceLabel);

const source = (section: string, adaptations: string[]): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages: "9 (habiletés) et 18 (guide d’exécution)",
  section,
  fidelity: "adapted",
  corrections: adaptations,
});

const timeline = (
  title: string,
  instruction: string,
  items: TimelineInteractionItem[],
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Démarche agronomique",
  title,
  instruction,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
  observation,
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
  eyebrow: "Décision sur le sol",
  title,
  instruction,
  rootLabel,
  rootDetail,
  nodes: nodes as [DiagramNodeItem, DiagramNodeItem, ...DiagramNodeItem[]],
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
  eyebrow: "Schéma agronomique",
  title,
  instruction,
  viewBox: "0 0 760 390",
  caption,
  shapes,
  hotspots: hotspots as [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]],
  observation,
});

interface LevelSeed {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  xp: number;
  kind?: LessonKind;
  section: string;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  interaction: LessonInteraction;
  questions: LessonQuestion[];
  adaptations: string[];
}

function adaptedLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed.section, seed.adaptations),
    concept: {
      eyebrow: `Niveau ${index + 1} • Adaptation enrichie du programme officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Une décision agronomique solide part d’un diagnostic, choisit une intervention ciblée puis prévoit un indicateur de suivi.",
      steps: seed.methodSteps,
      example: { prompt: "Application guidée", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : on ne traite pas un sol au hasard. On observe, on mesure, on corrige la cause et on vérifie l’effet.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const waterAirShapes: SchemaShape[] = [
  { shape: "path", d: "M30 65 L730 65 L730 118 L30 118 Z", tone: "soft" },
  { shape: "path", d: "M30 118 L730 118 L730 305 L30 305 Z", tone: "fill" },
  { shape: "path", d: "M30 305 L730 305 L730 365 L30 365 Z", tone: "soft" },
  { shape: "line", x1: 70, y1: 105, x2: 70, y2: 250, tone: "accent" },
  { shape: "line", x1: 105, y1: 105, x2: 105, y2: 230, tone: "accent" },
  { shape: "line", x1: 140, y1: 105, x2: 140, y2: 275, tone: "accent" },
  { shape: "circle", cx: 240, cy: 165, r: 24, tone: "soft" },
  { shape: "circle", cx: 300, cy: 205, r: 19, tone: "soft" },
  { shape: "circle", cx: 260, cy: 255, r: 15, tone: "soft" },
  { shape: "circle", cx: 365, cy: 160, r: 13, tone: "accent" },
  { shape: "circle", cx: 410, cy: 215, r: 17, tone: "accent" },
  { shape: "path", d: "M510 85 C540 130 565 165 565 218 C565 270 545 310 520 345", tone: "accent" },
  { shape: "line", x1: 600, y1: 112, x2: 600, y2: 325, tone: "soft" },
  { shape: "line", x1: 630, y1: 112, x2: 630, y2: 325, tone: "soft" },
  { shape: "line", x1: 660, y1: 112, x2: 660, y2: 325, tone: "soft" },
  { shape: "circle", cx: 610, cy: 180, r: 8, tone: "accent" },
];

const waterAirHotspots: SchemaHotspot[] = [
  { id: "mulch", number: 1, label: "Couverture", x: 110, y: 82, detail: "Un paillis réduit l’évaporation et amortit l’impact des pluies sans supprimer toute infiltration." },
  { id: "roots", number: 2, label: "Racines", x: 105, y: 205, detail: "Les racines explorent un volume de sol seulement si eau et oxygène restent accessibles." },
  { id: "macropores", number: 3, label: "Macropores", x: 260, y: 165, detail: "Les gros pores conduisent l’eau gravitaire et renouvellent l’air du sol." },
  { id: "micropores", number: 4, label: "Micropores", x: 405, y: 215, detail: "Les petits pores retiennent une partie de l’eau utilisable, mais un excès d’eau peut chasser l’air." },
  { id: "drainage", number: 5, label: "Drainage", x: 545, y: 285, detail: "Un drainage adapté évacue l’excès d’eau ; il ne doit pas assécher inutilement la parcelle." },
  { id: "compaction", number: 6, label: "Zone tassée", x: 640, y: 245, detail: "Le tassement ferme les pores, freine les racines et rend l’aération difficile." },
];

const limeShapes: SchemaShape[] = [
  { shape: "path", d: "M25 80 L735 80 L735 345 L25 345 Z", tone: "fill" },
  { shape: "circle", cx: 160, cy: 175, r: 38, tone: "soft" },
  { shape: "circle", cx: 250, cy: 245, r: 44, tone: "soft" },
  { shape: "circle", cx: 350, cy: 165, r: 35, tone: "soft" },
  { shape: "circle", cx: 455, cy: 250, r: 42, tone: "soft" },
  { shape: "circle", cx: 555, cy: 170, r: 34, tone: "soft" },
  { shape: "line", x1: 160, y1: 175, x2: 250, y2: 245, tone: "accent" },
  { shape: "line", x1: 250, y1: 245, x2: 350, y2: 165, tone: "accent" },
  { shape: "line", x1: 350, y1: 165, x2: 455, y2: 250, tone: "accent" },
  { shape: "line", x1: 455, y1: 250, x2: 555, y2: 170, tone: "accent" },
  { shape: "circle", cx: 205, cy: 140, r: 12, tone: "accent" },
  { shape: "circle", cx: 310, cy: 275, r: 12, tone: "accent" },
  { shape: "circle", cx: 410, cy: 125, r: 12, tone: "accent" },
  { shape: "circle", cx: 520, cy: 290, r: 12, tone: "accent" },
  { shape: "path", d: "M610 105 L705 105 L705 315 L610 315 Z", tone: "soft" },
  { shape: "line", x1: 635, y1: 285, x2: 680, y2: 140, tone: "accent" },
];

const limeHotspots: SchemaHotspot[] = [
  { id: "acid", number: 1, label: "Sol acide", x: 95, y: 115, detail: "Un pH faible peut limiter certaines disponibilités nutritives et accroître la toxicité de certains éléments." },
  { id: "carbonate", number: 2, label: "Carbonate", x: 205, y: 140, detail: "Le carbonate de calcium neutralise progressivement une partie de l’acidité ; la dose dépend du diagnostic." },
  { id: "calcium", number: 3, label: "Calcium", x: 310, y: 275, detail: "Le calcium participe aux échanges du complexe et peut favoriser la stabilité structurale selon le sol." },
  { id: "aggregate", number: 4, label: "Agrégats", x: 410, y: 125, detail: "Les particules assemblées laissent des pores, améliorant circulation de l’eau et de l’air." },
  { id: "ph", number: 5, label: "pH suivi", x: 655, y: 205, detail: "Le pH doit être remesuré : surchauler peut provoquer d’autres carences et n’est jamais un objectif en soi." },
  { id: "biology", number: 6, label: "Vie du sol", x: 520, y: 290, detail: "Une réaction moins acide peut favoriser certaines activités biologiques, sans remplacer les apports organiques." },
];

const humusShapes: SchemaShape[] = [
  { shape: "path", d: "M25 70 L735 70 L735 350 L25 350 Z", tone: "fill" },
  { shape: "path", d: "M65 110 Q160 65 250 120 T435 115 T690 105", tone: "accent" },
  { shape: "circle", cx: 140, cy: 180, r: 34, tone: "soft" },
  { shape: "circle", cx: 220, cy: 240, r: 41, tone: "soft" },
  { shape: "circle", cx: 315, cy: 175, r: 37, tone: "soft" },
  { shape: "circle", cx: 410, cy: 250, r: 43, tone: "soft" },
  { shape: "circle", cx: 510, cy: 180, r: 36, tone: "soft" },
  { shape: "line", x1: 140, y1: 180, x2: 220, y2: 240, tone: "accent" },
  { shape: "line", x1: 220, y1: 240, x2: 315, y2: 175, tone: "accent" },
  { shape: "line", x1: 315, y1: 175, x2: 410, y2: 250, tone: "accent" },
  { shape: "line", x1: 410, y1: 250, x2: 510, y2: 180, tone: "accent" },
  { shape: "circle", cx: 180, cy: 130, r: 10, tone: "accent" },
  { shape: "circle", cx: 280, cy: 285, r: 10, tone: "accent" },
  { shape: "circle", cx: 375, cy: 120, r: 10, tone: "accent" },
  { shape: "circle", cx: 475, cy: 300, r: 10, tone: "accent" },
  { shape: "path", d: "M590 125 C630 155 655 210 620 290", tone: "soft" },
];

const humusHotspots: SchemaHotspot[] = [
  { id: "residue", number: 1, label: "Résidus", x: 120, y: 95, detail: "Les résidus végétaux deviennent une ressource seulement s’ils sont gérés et décomposés, pas simplement brûlés." },
  { id: "decomposer", number: 2, label: "Décomposeurs", x: 180, y: 130, detail: "Micro-organismes et faune fragmentent et transforment la matière organique." },
  { id: "humus", number: 3, label: "Humus", x: 315, y: 175, detail: "La fraction organique stabilisée contribue aux propriétés du sol, mais se renouvelle lentement." },
  { id: "complex", number: 4, label: "Complexe", x: 410, y: 250, detail: "Argiles et humus chargés retiennent des cations échangeables et s’assemblent en agrégats." },
  { id: "water", number: 5, label: "Eau retenue", x: 620, y: 205, detail: "Une structure agrégée améliore souvent infiltration et réserve utile sans rendre le sol imperméable." },
  { id: "mineral", number: 6, label: "Minéralisation", x: 475, y: 300, detail: "Une partie de la matière organique libère progressivement des éléments minéraux assimilables." },
];

const levels: LevelSeed[] = [
  {
    id: "soil-fertility-diagnosis",
    title: "Diagnostiquer la fertilité d’un sol",
    summary: "Distinguer fertilité, productivité et qualité du sol avant toute intervention.",
    durationMinutes: 16,
    xp: 45,
    section: "Identifier quelques techniques d’amélioration — diagnostic préalable",
    body: String.raw`
## Une capacité, pas une simple couleur

La **fertilité du sol** est sa capacité à fournir aux plantes un milieu favorable : éléments minéraux disponibles, eau, air, profondeur exploitable par les racines et activité biologique. Elle possède donc plusieurs dimensions qui se répondent.

| Dimension | Indices utiles | Risque si elle est dégradée |
|---|---|---|
| physique | structure, porosité, infiltration, profondeur, tassement | asphyxie, ruissellement ou faible enracinement |
| chimique | pH, matière organique, azote, phosphore, potassium, salinité | carence, toxicité ou déséquilibre |
| biologique | vers de terre, racines, micro-organismes, décomposition | recyclage lent et structure fragile |

La **productivité** est le rendement réellement obtenu. Elle dépend de la fertilité, mais aussi de la variété, de l’eau disponible, du climat, des ravageurs et de la conduite de culture. Un faible rendement n’autorise donc pas à conclure immédiatement « manque d’engrais ».

Le diagnostic croise plusieurs observations : historique de la parcelle, comparaison de zones, profil cultural, test d’infiltration, pH et analyse de sol. Les symptômes foliaires peuvent orienter, mais plusieurs causes produisent des signes proches. Une chlorose peut venir d’un manque d’azote, d’un pH qui bloque un élément, de racines asphyxiées ou d’une maladie.

> **Précision.** Un sol riche en nutriments mais gorgé d’eau peut être peu fertile pour une culture sensible à l’asphyxie. À l’inverse, une parcelle pauvre peut être améliorée si la cause dominante est correctement identifiée.

La première décision est donc toujours une **hypothèse testable** : « le tassement limite l’enracinement », « l’acidité réduit la disponibilité de certains éléments » ou « l’exportation des récoltes dépasse les restitutions ».
`,
    keyPoint: "Fertilité = propriétés physiques + chimiques + biologiques adaptées aux besoins de la culture",
    example: "Deux zones reçoivent le même engrais. La zone tassée reste jaune et l’eau y stagne : avant d’ajouter une nouvelle dose, il faut tester l’aération, l’enracinement et le drainage.",
    methodSteps: [
      "Décris le symptôme sans lui attribuer immédiatement une cause.",
      "Compare une zone touchée et une zone témoin de la même parcelle.",
      "Classe les indices en propriétés physiques, chimiques et biologiques.",
      "Choisis une mesure permettant de départager les hypothèses.",
    ],
    interaction: diagram(
      "Construire un diagnostic croisé",
      "Ouvre chaque branche et relie l’indice à la mesure qui peut le confirmer.",
      "Sol et culture",
      "Le rendement résulte du sol, de la plante, du climat et de la conduite ; une seule observation ne suffit pas.",
      [
        { id: "physical", group: "Diagnostic", label: "Structure et eau", role: "Observer", detail: "Tassement, croûte, infiltration, stagnation, profondeur des racines et érosion renseignent la dimension physique." },
        { id: "chemical", group: "Diagnostic", label: "pH et nutriments", role: "Mesurer", detail: "Une analyse raisonnée examine pH, matière organique et éléments disponibles au lieu de prescrire un engrais au hasard." },
        { id: "biological", group: "Diagnostic", label: "Vie du sol", role: "Comparer", detail: "Décomposition, racines fines, faune et odeur peuvent signaler une activité biologique favorable ou perturbée." },
        { id: "history", group: "Contexte", label: "Historique", role: "Questionner", detail: "Cultures, rendements, brûlis, apports, travail du sol et incidents hydriques expliquent souvent l’évolution observée." },
        { id: "crop", group: "Contexte", label: "Besoins de la culture", role: "Adapter", detail: "Une même parcelle ne répond pas de façon identique aux exigences du manioc, du maïs ou d’un légume." },
      ],
      "Le diagnostic le plus robuste associe observation de terrain, mesure et comparaison avec un témoin.",
    ),
    questions: [
      choice("Quelle définition décrit le mieux la fertilité d’un sol ?", ["Sa seule teneur totale en éléments, même indisponibles", "Sa capacité à offrir eau, air, nutriments et milieu racinaire adaptés", "Le rendement maximal observé une année, quel que soit le climat", "Sa seule couleur foncée"], 1, "La fertilité combine plusieurs propriétés du milieu exploité par les racines."),
      choice("Quelle propriété est surtout physique ?", ["Le pH", "La teneur en nitrate", "La porosité", "La diversité génétique de la culture"], 2, "La porosité organise la circulation de l’eau et de l’air."),
      choice("Pourquoi un faible rendement ne prouve-t-il pas une carence minérale ?", ["Parce que les engrais n’agissent jamais", "Parce que le rendement dépend aussi de l’eau, du climat, des racines et des ravageurs", "Parce que le sol est toujours fertile", "Parce que les plantes n’utilisent aucun minéral"], 1, "Plusieurs facteurs peuvent limiter la production."),
      choice("Quel couple compare correctement fertilité et productivité ?", ["Fertilité = rendement vendu ; productivité = pH", "Fertilité = capacité du sol ; productivité = résultat obtenu", "Les deux mots sont toujours synonymes", "Fertilité = climat ; productivité = roche"], 1, "La productivité dépend de la fertilité mais aussi d’autres facteurs."),
      trueFalse("Un sol riche en nutriments peut rester défavorable si ses racines sont asphyxiées.", true, "La dimension physique peut devenir le facteur limitant."),
      choice("Quel contrôle départage le mieux manque d’eau et mauvais drainage ?", ["La teneur totale en phosphore seule", "L’observation de l’humidité, de l’infiltration et des racines", "Le pH seul", "Le rendement seul"], 1, "Le diagnostic doit porter sur l’eau dans le profil et l’état racinaire."),
      choice("Une chlorose identique dans deux parcelles signifie forcément…", ["la même cause", "un excès de pluie", "qu’il faut croiser d’autres indices", "un manque certain de potassium"], 2, "Un symptôme peut avoir plusieurs causes."),
      choice("Quel indicateur relève surtout de l’activité biologique du sol ?", ["La vitesse de décomposition des résidus", "Le pH de la solution", "La proportion d’argile", "La profondeur de la nappe"], 0, "La décomposition implique faune et micro-organismes du sol."),
      choice("Quelle action vient en premier ?", ["Doubler tous les apports", "Choisir une cause sans mesure", "Formuler puis tester une hypothèse", "Brûler les résidus"], 2, "L’intervention doit suivre un diagnostic."),
      short("Écris le mot désignant la capacité du sol à soutenir la croissance d’une culture.", ["fertilité", "la fertilité", "fertilite"], "Cette capacité multidimensionnelle est la fertilité.", evaluationSource, 2),
    ],
    adaptations: [
      "Le guide demande d’identifier des techniques ; le parcours ajoute explicitement le diagnostic qui doit précéder leur choix.",
      "Fertilité et productivité sont distinguées pour éviter d’attribuer automatiquement tout faible rendement à un manque d’engrais.",
      "Les propriétés physiques, chimiques et biologiques sont croisées au lieu de réduire la fertilité à la seule réserve minérale.",
    ],
  },
  {
    id: "water-air-regulation",
    title: "Réguler l’humidité et l’aération",
    summary: "Maintenir simultanément une eau accessible et des pores remplis d’air.",
    durationMinutes: 17,
    xp: 55,
    section: "Techniques de régulation de l’humidité et d’aération",
    body: String.raw`
## Deux ressources dans le même espace poreux

L’eau et l’air occupent les **pores** du sol. Après une forte pluie, les grands pores se vident progressivement sous l’effet de la gravité et se remplissent d’air ; une partie de l’eau reste retenue dans les pores plus fins. Les racines ont besoin des deux : de l’eau pour les transports et de dioxygène pour la respiration cellulaire.

Un sol **engorgé** manque d’air. Les racines respirent mal, explorent moins le profil et absorbent moins efficacement certains éléments. Un sol trop sec interrompt aussi les flux vers la plante. L’objectif n’est donc ni « le plus d’eau possible » ni « le drainage maximal », mais une humidité compatible avec la culture et une porosité fonctionnelle.

| Problème dominant | Indices | Intervention possible | Contrôle |
|---|---|---|---|
| évaporation rapide | surface nue, sol chaud | paillage, apport fractionné d’eau | humidité sous couverture |
| ruissellement | croûte, pente, flaques | couverture, courbes de niveau, infiltration | eau infiltrée après pluie |
| engorgement | odeur, racines sombres, eau stagnante | drainage raisonné, planches surélevées | durée de stagnation |
| tassement | semelle, racines déviées | limiter passages humides, décompacter si nécessaire | porosité et enracinement |

Le **travail du sol** peut aérer temporairement, mais des passages répétés d’engins lourds ou un travail sur sol trop humide créent du tassement. Le paillage protège la surface et limite l’évaporation ; son effet sur l’humidité doit être suivi, notamment en milieu très humide.

> **Erreur fréquente.** Une motte pulvérisée n’est pas forcément un sol bien structuré. La stabilité des agrégats, les galeries biologiques et les racines vivantes entretiennent une porosité plus durable.
`,
    keyPoint: "Une bonne fertilité exige une humidité utile et une porosité qui renouvelle l’air des racines",
    example: "Dans une planche maraîchère, l’eau reste deux jours en surface et les racines noircissent. La priorité est de réduire l’engorgement et le tassement, pas d’ajouter immédiatement de l’azote.",
    methodSteps: [
      "Observe la vitesse d’infiltration et la durée de stagnation après pluie.",
      "Examine la profondeur, la couleur et la direction des racines.",
      "Choisis une technique qui corrige le problème dominant sans créer l’excès inverse.",
      "Mesure de nouveau l’humidité et l’enracinement après intervention.",
    ],
    interaction: schema(
      "Lire l’eau et l’air dans le profil",
      "Sélectionne les six repères pour comprendre comment couverture, pores, racines, drainage et tassement interagissent.",
      "Profil pédagogique original de circulation de l’eau et de l’air ; les tailles de pores ne sont pas à l’échelle.",
      waterAirShapes,
      waterAirHotspots,
      "L’amélioration vient de l’équilibre : infiltrer et retenir une partie de l’eau tout en laissant respirer les racines.",
    ),
    questions: [
      choice("Pourquoi les racines ont-elles besoin d’air dans le sol ?", ["Pour fixer directement tout le diazote atmosphérique", "Pour leur respiration cellulaire", "Pour rendre l’eau gravitaire immobile", "Pour transformer tout l’humus en argile"], 1, "Les cellules racinaires respirent et ont besoin de dioxygène."),
      choice("Quel ensemble de signes évoque surtout un engorgement ?", ["Eau stagnante, odeur réductrice et racines assombries", "Sol sec, fissures et feuilles flétries", "Croûte de battance sèche et ruissellement sans stagnation", "Chlorose isolée sur une seule feuille"], 0, "La stagnation prolongée et les signes réducteurs indiquent une faible aération du profil."),
      choice("Quel rôle joue un paillis ?", ["Il bloque toute pluie", "Il réduit l’évaporation et protège la surface", "Il remplace toujours le drainage", "Il augmente automatiquement le pH"], 1, "La couverture amortit pluie et insolation."),
      choice("Quel comportement favorise le tassement ?", ["Maintenir des racines vivantes", "Passer un engin lourd sur sol humide", "Ajouter du compost mûr", "Observer le profil"], 1, "La pression sur un sol humide ferme une partie des pores."),
      trueFalse("Le maximum d’eau dans tous les pores garantit toujours la meilleure fertilité.", false, "Un sol saturé peut manquer d’oxygène."),
      choice("Après une pluie, les macropores servent surtout à…", ["conduire l’eau gravitaire puis renouveler l’air", "fixer tous les engrais", "fabriquer l’argile", "arrêter les racines"], 0, "Les grands pores assurent drainage et aération."),
      choice("Quelle solution cible une stagnation persistante ?", ["Une dose aléatoire d’urée", "Un drainage raisonné et la réduction du tassement", "Le brûlage systématique", "La suppression de toute matière organique"], 1, "Il faut corriger le fonctionnement hydrique et structural."),
      choice("Pourquoi contrôler l’effet après intervention ?", ["Parce qu’une technique peut créer l’excès inverse", "Parce que le sol ne change jamais", "Parce que les plantes n’ont pas de racines", "Pour éviter toute mesure"], 0, "Drainage, irrigation et travail doivent être ajustés."),
      choice("Quel indice révèle le mieux une semelle compacte ?", ["Des racines déviées horizontalement à une profondeur constante", "Des macropores continus sur tout le profil", "Une infiltration rapide et homogène", "Une forte activité de vers dans la couche concernée"], 0, "Les racines contournent souvent une couche résistante."),
      short("Écris le mot désignant les vides du sol occupés par l’eau ou l’air.", ["pores", "les pores", "porosité", "porosite"], "Les pores composent la porosité du sol.", evaluationSource, 2),
    ],
    adaptations: [
      "Les techniques de régulation de l’humidité et d’aération citées par le guide sont reliées au fonctionnement des pores.",
      "L’engorgement et la sécheresse sont présentés comme deux excès distincts ; aucune technique unique n’est prescrite partout.",
      "Le travail mécanique est nuancé : il peut aérer temporairement mais aussi tasser lorsqu’il est répété ou réalisé sur sol humide.",
    ],
  },
  {
    id: "cultural-techniques",
    title: "Choisir des techniques culturales",
    summary: "Faire de la succession des cultures et de la couverture du sol des leviers de fertilité.",
    durationMinutes: 17,
    xp: 65,
    section: "Techniques culturales d’amélioration de la fertilité",
    body: String.raw`
## Gérer des flux au fil des saisons

Une culture prélève des éléments, produit des racines et laisse des résidus. La fertilité évolue donc avec la **succession des cultures** et pas seulement avec l’apport effectué le jour du semis.

La **rotation** alterne des espèces aux besoins et enracinements différents. Elle peut interrompre certains cycles de ravageurs, explorer plusieurs profondeurs et répartir les exportations. L’introduction d’une légumineuse ne « crée » pas gratuitement de l’azote : des bactéries symbiotiques de nodosités peuvent fixer du diazote, puis une partie de cet azote rejoint le sol après restitution et décomposition de la biomasse.

Une **culture de couverture** protège la surface, produit des racines et capte une partie des éléments mobiles. Un **engrais vert** est cultivé principalement pour fournir de la biomasse restituée au sol. L’**agroforesterie** associe arbres et cultures ; elle peut recycler des éléments depuis des horizons plus profonds, fournir litière et réduire l’érosion, mais elle doit aussi gérer compétition pour la lumière et l’eau.

La **jachère** est une période sans culture de récolte permettant une reconstitution partielle. Sa réussite dépend de la durée, de la végétation, des feux et de la pression sur la terre ; une jachère très courte et dénudée ne restaure pas automatiquement la fertilité.

| Choix | Service attendu | Point de vigilance |
|---|---|---|
| rotation céréale-légumineuse | diversification et restitution | exporter toute la biomasse réduit le retour |
| couverture | protection et racines vivantes | choisir une espèce non envahissante |
| résidus restitués | carbone et éléments recyclés | éviter brûlage et accumulation malade |
| agroforesterie | litière, microclimat, racines profondes | gérer densité et compétition |

Une technique culturale devient efficace lorsqu’elle répond au diagnostic, s’insère dans le calendrier et fait l’objet d’un suivi.
`,
    keyPoint: "Rotation, couverture et restitution pilotent les prélèvements, les retours et la protection du sol",
    example: "Après plusieurs années de maïs continu, une parcelle est nue entre deux saisons. Une rotation avec légumineuse, couverture et restitution de résidus diversifie les flux sans supprimer le besoin d’un diagnostic nutritif.",
    methodSteps: [
      "Reconstitue la succession des cultures et les résidus réellement restitués.",
      "Repère le facteur à corriger : sol nu, exportation, ravageur ou faible diversité racinaire.",
      "Choisis une technique compatible avec eau, calendrier et débouchés.",
      "Prévois un témoin et des indicateurs de couverture, rendement et état du sol.",
    ],
    interaction: timeline(
      "Planifier une rotation fertile",
      "Parcours les étapes et observe comment la fertilité se gère avant, pendant et après chaque culture.",
      [
        { label: "Diagnostic après récolte", shortLabel: "Observer", detail: "Mesurer couverture, résidus, structure, rendement et problèmes sanitaires avant de choisir la culture suivante." },
        { label: "Culture de couverture", shortLabel: "Couvrir", detail: "Une espèce adaptée protège le sol, produit des racines et limite certaines pertes pendant l’interculture." },
        { label: "Légumineuse", shortLabel: "Diversifier", detail: "La symbiose peut fixer du diazote ; l’effet sur le système dépend de la biomasse réellement restituée." },
        { label: "Culture exigeante", shortLabel: "Produire", detail: "La culture suivante profite du meilleur état du sol mais ses besoins restent calculés à partir du diagnostic." },
        { label: "Restitution et bilan", shortLabel: "Évaluer", detail: "Comparer exportations, restitutions, rendement, couverture et état structural pour ajuster le cycle suivant." },
      ],
      "Une rotation n’est pas une liste fixe : c’est une séquence ajustée aux flux, aux risques et aux objectifs de la parcelle.",
    ),
    questions: [
      choice("Quel principe définit une rotation ?", ["La même culture chaque année", "L’alternance planifiée de cultures", "L’absence définitive de récolte", "L’ajout exclusif de chaux"], 1, "La rotation organise une succession d’espèces."),
      choice("Comment une légumineuse peut-elle enrichir le système en azote ?", ["Par des bactéries symbiotiques fixant le diazote", "En fabriquant du calcium", "En arrêtant toute décomposition", "En transformant le sable en argile"], 0, "La fixation biologique implique des bactéries des nodosités."),
      choice("Pourquoi la restitution de biomasse compte-t-elle ?", ["Parce qu’elle rend une partie du carbone et des éléments au sol", "Parce qu’elle supprime les racines", "Parce qu’elle stérilise le champ", "Parce qu’elle remplace toute analyse"], 0, "Exporter toute la biomasse réduit le retour au sol."),
      choice("Quel est un service d’une culture de couverture ?", ["Laisser le sol nu", "Protéger la surface et maintenir des racines", "Garantir tout rendement", "Neutraliser instantanément tout pH"], 1, "La couverture protège et capte certains éléments."),
      trueFalse("Une jachère très courte et dénudée restaure automatiquement toute la fertilité.", false, "L’effet dépend de la durée et de la végétation."),
      choice("Quel risque doit être géré en agroforesterie ?", ["La compétition pour l’eau et la lumière", "Une fixation d’azote garantie par toute espèce d’arbre", "Une suppression complète de l’érosion quelle que soit la pente", "Une accumulation d’humus indépendante des restitutions"], 0, "La densité, les espèces et la conduite des arbres doivent limiter les compétitions."),
      choice("Après du maïs continu, quel choix diversifie le mieux le système ?", ["Encore du maïs sans résidu", "Une légumineuse et une couverture adaptées", "Le brûlage de toute biomasse", "Une dose identique partout"], 1, "La diversification agit sur racines, azote et couverture."),
      choice("Pourquoi garder un témoin ?", ["Pour comparer l’effet réel de la technique", "Pour empêcher toute mesure", "Pour remplacer l’historique", "Pour supprimer les variations"], 0, "Le témoin aide à distinguer l’effet de l’intervention."),
      choice("Un engrais vert est cultivé principalement pour…", ["être incorporé ou restitué comme biomasse", "produire du minerai", "drainer une nappe", "mesurer le pH"], 0, "Sa biomasse est destinée au fonctionnement du sol."),
      short("Écris le mot désignant l’alternance planifiée de plusieurs cultures sur une même parcelle.", ["rotation", "la rotation", "rotation culturale", "succession culturale"], "La rotation organise la succession temporelle ; l’assolement décrit plutôt la répartition spatiale des cultures à un moment donné.", evaluationSource, 2),
    ],
    adaptations: [
      "La catégorie générale « techniques culturales » du guide est détaillée en rotation, couverture, restitution, jachère et agroforesterie.",
      "La fixation d’azote par les légumineuses est attribuée à la symbiose bactérienne et conditionnée par la restitution de biomasse.",
      "La jachère et l’agroforesterie sont présentées avec leurs conditions de réussite, sans bénéfice automatique ou universel.",
    ],
  },
  {
    id: "fertilizer-dose-balance",
    title: "Raisonner les engrais minéraux",
    summary: "Relier besoins de la culture, analyse du sol, dose, moment et placement.",
    durationMinutes: 19,
    xp: 75,
    section: "Effets de l’utilisation des engrais — bénéfices et dose",
    body: String.raw`
## Nourrir la culture sans confondre sac et élément

Un **engrais minéral** apporte un ou plusieurs éléments sous une forme rapidement disponible. Les trois nombres du grade N-P-K indiquent conventionnellement les pourcentages massiques de **N**, de **P₂O₅** et de **K₂O** dans le produit. Ils ne donnent donc pas directement les pourcentages de phosphore P et de potassium K élémentaires, et ne signifient pas que toutes les plantes demandent la même proportion.

| Élément | Rôles majeurs | Exemple de risque d’excès ou déséquilibre |
|---|---|---|
| azote N | protéines, chlorophylle, croissance | végétation fragile, pertes par lixiviation ou émissions |
| phosphore P | transferts d’énergie, racines, reproduction | accumulation et eutrophisation après transfert |
| potassium K | régulation hydrique, enzymes, résistance | antagonismes avec d’autres cations |

La bonne dose dépend du **besoin prévisible**, de ce que le sol peut fournir, des restitutions et du rendement visé. Pour convertir un besoin d’élément en masse de produit :

$$
\text{masse de produit}=\frac{\text{masse d’élément recherchée}}{\text{fraction de l’élément dans le produit}}.
$$

Ainsi, fournir 30 kg d’azote avec un engrais à 15 % d’azote demanderait théoriquement $30/0{,}15=200$ kg de produit par hectare. Ce calcul ne constitue pas à lui seul une recommandation : disponibilité du sol, fractionnement, pertes et réglementation doivent encore être considérés.

Une courbe dose-rendement augmente d’abord, puis atteint une zone où le gain supplémentaire devient faible ; au-delà, rendement, qualité, coût ou environnement peuvent se dégrader. Les « **4 bons** » résument la décision : bonne source, bonne dose, bon moment et bon placement.

> **Erreur fréquente.** Une formule commerciale n’est pas une ordonnance universelle. Le même sac peut être pertinent dans une parcelle et déséquilibré dans une autre.
`,
    keyPoint: "Engrais raisonné = source, dose, moment et placement adaptés au diagnostic et au besoin",
    example: "Une analyse signale un phosphore déjà élevé mais un besoin azoté fractionnable. Choisir automatiquement un N-P-K riche en phosphore augmenterait un stock inutile et le risque de transfert.",
    methodSteps: [
      "Détermine le besoin de la culture et la fourniture probable du sol.",
      "Lis la composition du produit sans confondre pourcentage et kilogrammes.",
      "Calcule une dose théorique puis adapte moment et placement.",
      "Compare rendement, qualité, coût et indicateurs environnementaux.",
    ],
    interaction: diagram(
      "Passer du besoin à la décision",
      "Ouvre les branches dans l’ordre : besoin, source, dose, calendrier, suivi.",
      "Parcelle diagnostiquée",
      "La recommandation naît du croisement entre sol, culture, climat, historique et objectif de rendement.",
      [
        { id: "need", group: "Calcul", label: "Besoin net", role: "Estimer", detail: "Besoin de la culture moins fourniture du sol et restitutions prévisibles ; éviter un objectif irréaliste." },
        { id: "source", group: "Choix", label: "Bonne source", role: "Sélectionner", detail: "Choisir une composition qui cible le déficit sans accumuler inutilement un autre élément." },
        { id: "rate", group: "Calcul", label: "Bonne dose", role: "Convertir", detail: "Passer de kilogrammes d’élément à kilogrammes de produit en utilisant la fraction indiquée." },
        { id: "time", group: "Application", label: "Bon moment", role: "Fractionner", detail: "Synchroniser l’apport avec l’absorption et éviter les pluies susceptibles d’emporter le produit." },
        { id: "place", group: "Application", label: "Bon placement", role: "Positionner", detail: "Rendre l’élément accessible tout en limitant contact toxique, volatilisation ou ruissellement." },
        { id: "monitor", group: "Suivi", label: "Résultat", role: "Mesurer", detail: "Comparer rendement, qualité, marge et état du sol plutôt que le seul verdissement immédiat." },
      ],
      "Le bon résultat agronomique ne se réduit jamais à la quantité versée.",
    ),
    questions: [
      choice("Que représentent conventionnellement les trois nombres du grade N-P-K ?", ["Les pourcentages massiques de N, P₂O₅ et K₂O", "Les pourcentages élémentaires de N, P et K", "Les masses de N, P et K absorbées par toute culture", "Les proportions d’azote organique, de phosphore soluble et de potassium échangeable du sol"], 0, "Le grade commercial exprime N, P₂O₅ et K₂O ; P₂O₅ et K₂O ne sont pas les teneurs élémentaires directes en P et K."),
      choice("Quel élément intervient notamment dans les protéines et la chlorophylle ?", ["Azote", "Silice uniquement", "Chlore atmosphérique", "Aluminium"], 0, "L’azote est central dans protéines et chlorophylle."),
      choice("Pour fournir 30 kg de N avec un produit à 15 % N, quelle masse théorique faut-il ?", ["45 kg", "150 kg", "200 kg", "450 kg"], 2, "30/0,15 = 200 kg."),
      choice("Pourquoi ce calcul n’est-il pas encore une recommandation complète ?", ["Il manque sol, pertes, moment et placement", "Les pourcentages n’existent pas", "Les cultures n’absorbent rien", "Il faut toujours doubler"], 0, "La décision agronomique demande du contexte."),
      trueFalse("Le même engrais et la même dose conviennent automatiquement à toutes les parcelles.", false, "Les diagnostics et besoins diffèrent."),
      choice("Que signifie le bon moment ?", ["Appliquer toute la dose au semis dans tous les cas", "Synchroniser l’apport avec les besoins et les risques de perte", "Attendre systématiquement la fin de l’absorption", "Appliquer dès que le sol est saturé en eau"], 1, "Le calendrier influence l’efficacité et les pertes."),
      choice("Une parcelle déjà riche en phosphore reçoit encore beaucoup de P. Quel risque augmente ?", ["Accumulation et transfert vers l’eau", "Création d’humus instantanée", "Disparition de tout azote", "Aération automatique"], 0, "Un apport inutile peut s’accumuler puis être transféré."),
      choice("Pourquoi fractionner certains apports d’azote ?", ["Pour mieux synchroniser disponibilité et absorption et réduire certaines pertes", "Pour augmenter le stock de nitrate longtemps avant le besoin", "Pour rendre inutile toute analyse du sol", "Pour garantir la même efficacité sous toute pluie"], 0, "Plusieurs apports peuvent mieux coïncider avec la demande."),
      choice("Quel ensemble correspond aux 4 bons de la fertilisation ?", ["source, dose, moment, placement", "source, rendement visé, texture, variété", "dose, pH, irrigation, rotation", "moment, analyse foliaire, couverture, coût"], 0, "Source, dose, moment et placement structurent la décision ; les autres facteurs l’éclairent mais ne remplacent pas ces quatre termes."),
      short("Écris le symbole chimique de l’élément azote dans N-P-K.", ["N", "n"], "L’azote est noté N.", evaluationSource, 2),
    ],
    adaptations: [
      "Les effets positifs attendus des engrais sont reliés aux rôles de N, P et K plutôt qu’à une promesse générale de rendement.",
      "Le calcul de conversion entre besoin d’élément et masse de produit est ajouté comme outil de lecture, sans devenir une prescription locale.",
      "La décision est structurée par source, dose, moment et placement afin de relier efficacité, coût et pertes environnementales.",
    ],
  },
  {
    id: "organic-amendments",
    title: "Transformer la matière organique",
    summary: "Suivre résidus, compost, humus et minéralisation sans promettre un effet instantané.",
    durationMinutes: 18,
    xp: 85,
    section: "Amendements humifères et techniques organiques",
    body: String.raw`
## De la biomasse au sol vivant

Les fumiers, composts, résidus, engrais verts et autres matières organiques n’agissent pas tous de la même manière. Leur effet dépend de leur composition, de leur maturité, de la dose, de l’humidité, de la température et du contact avec le sol.

La **décomposition** transforme la matière sous l’action de la faune et des micro-organismes. Deux voies se déroulent ensemble :

- la **minéralisation** libère des éléments sous forme minérale ;
- l’**humification** produit des composés organiques plus stabilisés contribuant à l’humus.

Un résidu très riche en carbone et pauvre en azote peut provoquer une **immobilisation temporaire** : les micro-organismes utilisent l’azote disponible pour décomposer ce carbone. Ce phénomène ne signifie pas que la matière organique est mauvaise ; il impose de gérer la qualité du résidu et le calendrier.

Un compost mûr est homogène, ne chauffe plus fortement et ne ressemble plus aux matières initiales. Un compost insuffisamment mûr peut consommer de l’oxygène, immobiliser de l’azote, contenir des composés phytotoxiques ou disséminer des graines et organismes indésirables. À l’inverse, une matière organique stabilisée améliore souvent agrégation, infiltration, réserve en eau, capacité d’échange et activité biologique.

| Matière | Effet plutôt rapide | Effet plutôt durable |
|---|---|---|
| résidu tendre ou engrais vert | libération possible d’éléments | carbone restitué |
| fumier bien géré | éléments et activité microbienne | matière organique |
| compost mûr | apport modéré et régulier | structure et humus |
| résidu très ligneux | faible au début | couverture et carbone, avec immobilisation possible |

La matière organique est donc un **flux à gérer**, pas un déchet uniforme ni un engrais de composition constante.
`,
    keyPoint: "Matière organique → décomposition → minéralisation + humification, à une vitesse dépendant de sa qualité et du milieu",
    example: "Une paille très ligneuse est enfouie juste avant une culture exigeante. La décomposition peut immobiliser temporairement de l’azote ; il faut ajuster calendrier, mélange et suivi.",
    methodSteps: [
      "Identifie l’origine, la maturité et l’humidité de la matière apportée.",
      "Anticipe une libération rapide ou une immobilisation temporaire.",
      "Choisis dose, moment et mode d’application compatibles avec la culture.",
      "Surveille température, odeur, structure, croissance et analyse du sol.",
    ],
    interaction: timeline(
      "Suivre un compost jusqu’à son effet",
      "Ouvre chaque étape et distingue transformation biologique, stabilisation et réponse du sol.",
      [
        { label: "Mélange initial", shortLabel: "Assembler", detail: "Associer matières humides riches en azote et matières structurantes riches en carbone, sans noyer le tas." },
        { label: "Phase active", shortLabel: "Décomposer", detail: "L’activité microbienne chauffe le mélange ; oxygène et humidité sont contrôlés pour éviter putréfaction ou dessèchement." },
        { label: "Retournement", shortLabel: "Aérer", detail: "Le brassage homogénéise et renouvelle l’air sans constituer une fin en soi." },
        { label: "Maturation", shortLabel: "Stabiliser", detail: "La température revient vers l’ambiante et les matières initiales deviennent difficiles à reconnaître." },
        { label: "Application", shortLabel: "Amender", detail: "Le compost mûr est apporté selon diagnostic, dose et calendrier, puis incorporé ou laissé en surface selon le système." },
        { label: "Suivi", shortLabel: "Vérifier", detail: "Observer structure, humidité, croissance et évolution de la matière organique sur plusieurs cycles." },
      ],
      "Le compostage transforme un mélange ; il ne garantit ni stérilité absolue ni dose universelle.",
    ),
    questions: [
      choice("Qu’est-ce que la minéralisation ?", ["La libération d’éléments minéraux lors de la décomposition", "La fabrication de roche mère", "La suppression de tout micro-organisme", "Le drainage d’un champ"], 0, "La décomposition rend une partie des éléments minéraux."),
      choice("Qu’est-ce que l’humification ?", ["La formation de composés organiques plus stabilisés", "L’ajout exclusif d’eau", "Le retrait de toute argile", "La combustion du compost"], 0, "Elle contribue à la formation de l’humus."),
      choice("Quel résidu risque une immobilisation temporaire d’azote ?", ["Un résidu très ligneux riche en carbone", "Une solution pure de nitrate", "Une roche calcaire", "Une eau d’irrigation"], 0, "Les décomposeurs mobilisent de l’azote pour traiter ce carbone."),
      choice("Quel indice évoque un compost mûr ?", ["Il chauffe toujours très fortement", "Il est stabilisé et les matières initiales sont peu reconnaissables", "Il sent fortement la putréfaction", "Il contient uniquement du plastique"], 1, "La maturation réduit l’activité thermique intense."),
      trueFalse("Toute matière organique libère immédiatement la même quantité d’azote.", false, "Composition et conditions modifient la vitesse."),
      choice("Pourquoi aérer un compost ?", ["Pour soutenir les décomposeurs aérobies", "Pour retirer tout carbone", "Pour augmenter le pH à 14", "Pour remplacer la maturité"], 0, "L’oxygène favorise une décomposition aérobie contrôlée."),
      choice("Quel effet durable est souvent recherché ?", ["Amélioration de l’agrégation et de l’activité biologique", "Disparition de tous les pores", "Stérilisation définitive", "Suppression de l’eau"], 0, "La matière organique contribue à la structure et à la vie du sol."),
      choice("Quel risque présente un compost immature ?", ["Immobilisation d’azote, phytotoxicité ou consommation d’oxygène", "Humification complète et immédiate de tout carbone", "Libération parfaitement synchronisée avec tout besoin cultural", "Innocuité garantie quelle que soit son origine"], 0, "Une maturation insuffisante peut perturber le sol et la culture."),
      choice("Pourquoi suivre plusieurs cycles ?", ["Parce que les effets organiques évoluent lentement", "Parce que le sol ne change jamais", "Pour éviter toute comparaison", "Pour supprimer les récoltes"], 0, "Une partie des bénéfices est progressive."),
      short("Écris le mot désignant la matière organique stabilisée du sol.", ["humus", "l'humus", "l’humus"], "L’humus est une fraction organique stabilisée.", evaluationSource, 2),
    ],
    adaptations: [
      "Le mode d’action humifère demandé par le guide est détaillé en décomposition, minéralisation, humification et stabilisation.",
      "L’immobilisation temporaire de l’azote est ajoutée pour éviter de présenter tout résidu organique comme un engrais immédiatement disponible.",
      "La maturité du compost et les risques d’un produit mal stabilisé sont explicités avant toute recommandation d’application.",
    ],
  },
  {
    id: "calcareous-amendment",
    title: "Comprendre l’amendement calcaire",
    summary: "Corriger une acidité diagnostiquée sans confondre chaulage et fertilisation N-P-K.",
    durationMinutes: 18,
    xp: 95,
    section: "Mode d’action des amendements calcaires",
    body: String.raw`
## Neutraliser une partie de l’acidité

Un **amendement calcaire** est utilisé lorsqu’un diagnostic montre qu’une acidité excessive limite le système. Il ne nourrit pas la plante comme un engrais N-P-K : il agit surtout sur la réaction du sol, certains équilibres chimiques et, selon la texture et la matière organique, sur la stabilité structurale.

Pour un carbonate, une écriture simplifiée de la neutralisation est :

$$
\mathrm{CaCO_3 + 2H^+ \rightarrow Ca^{2+} + CO_2 + H_2O}.
$$

La consommation d’ions $H^+$ fait remonter le pH. Le calcium peut occuper des sites d’échange sur les argiles et l’humus et favoriser la **floculation**, c’est-à-dire le rapprochement de particules en agrégats plus stables. L’intensité de l’effet dépend toutefois de la texture, de la capacité tampon, du produit, de sa finesse et de son incorporation.

Le besoin de chaulage ne se déduit pas du seul pH. Deux sols au même pH peuvent demander des quantités différentes parce que leur capacité à résister au changement diffère. Il faut aussi connaître la culture : certaines tolèrent davantage l’acidité que d’autres.

| Étape | Question |
|---|---|
| mesurer | pH, texture, matière organique et parfois acidité échangeable |
| décider | quel pH cible est adapté à la culture, sans viser la neutralité par principe ? |
| choisir | carbonate, chaux ou autre produit, avec quelle valeur neutralisante ? |
| appliquer | quelle dose, quelle répartition et quel délai avant culture ? |
| vérifier | le pH et la structure ont-ils évolué sans carence induite ? |

> **Risque.** Le **surchaulage** peut réduire la disponibilité de certains oligo-éléments ou déséquilibrer les cations. Plus n’est donc pas mieux.
`,
    keyPoint: "Chaulage raisonné = acidité mesurée + produit adapté + dose calculée + pH contrôlé",
    example: "Un sol à pH 4,8 porte une culture sensible, mais sa capacité tampon est forte. Une petite dose standard peut être insuffisante ; une dose massive sans calcul peut surcorriger. Le besoin doit être mesuré.",
    methodSteps: [
      "Confirme que l’acidité est réellement un facteur limitant pour la culture.",
      "Considère texture, matière organique et capacité tampon.",
      "Choisis le produit et la dose selon sa valeur neutralisante.",
      "Répartis correctement puis contrôle le pH après réaction.",
    ],
    interaction: schema(
      "Suivre l’action du calcaire",
      "Explore les six repères, de l’acidité initiale au contrôle final du pH.",
      "Schéma pédagogique original du chaulage et de l’agrégation ; les particules et ions ne sont pas à l’échelle.",
      limeShapes,
      limeHotspots,
      "Le calcium et la neutralisation peuvent améliorer le milieu, mais seulement lorsque produit et dose répondent au diagnostic.",
    ),
    questions: [
      choice("Quel est l’objectif principal d’un amendement calcaire ?", ["Apporter automatiquement N-P-K", "Corriger une acidité diagnostiquée", "Saturer tous les pores d’eau", "Brûler l’humus"], 1, "Le chaulage vise surtout la réaction acide du sol."),
      choice("Que consomme le carbonate dans l’équation simplifiée ?", ["Des ions H+", "Tout l’oxygène atmosphérique", "Les racines", "Le sable"], 0, "La neutralisation consomme une partie des ions responsables de l’acidité."),
      choice("Quel cation est apporté par CaCO3 ?", ["Ca2+", "Mg2+", "K+", "Al3+"], 0, "Le carbonate de calcium apporte l’ion calcium Ca²+."),
      choice("Qu’est-ce que la floculation des colloïdes du sol ?", ["Le rapprochement de particules en agrégats", "Leur dispersion accrue dans l’eau", "La libération d’azote minéral par décomposition", "L’oxydation de l’ammonium en nitrate"], 0, "La floculation rapproche des particules ; elle s’oppose à leur dispersion."),
      trueFalse("Deux sols au même pH demandent toujours exactement la même dose de calcaire.", false, "Leur capacité tampon peut différer."),
      choice("Pourquoi définir un pH cible selon la culture ?", ["Les espèces n’ont pas toutes les mêmes tolérances", "Toutes exigent pH 14", "Le pH ne change jamais", "Le pH mesure la pente"], 0, "Le niveau souhaitable varie avec culture et sol."),
      choice("Quel risque accompagne le surchaulage ?", ["Une disponibilité réduite de certains oligo-éléments", "Une acidification supplémentaire par consommation de H+", "Une disparition immédiate de la capacité tampon", "Une augmentation garantie de tous les rendements"], 0, "Une correction excessive peut induire des carences et des déséquilibres."),
      choice("Quelle mesure vérifie le plus directement l’effet neutralisant après application ?", ["Le pH du sol", "La conductivité électrique seule", "Le nitrate résiduel seul", "La teneur en argile seule"], 0, "Le suivi du pH vérifie l’évolution de la réaction acide ; d’autres analyses complètent le diagnostic."),
      choice("Le chaulage remplace-t-il toujours un apport organique ?", ["Oui, car neutraliser H+ forme automatiquement de l’humus", "Non, leurs modes d’action diffèrent", "Oui, dès que le pH cible est atteint", "Non, parce que le calcaire acidifie toujours le sol"], 1, "Le calcaire corrige surtout l’acidité ; la matière organique soutient d’autres fonctions physiques, chimiques et biologiques."),
      short("Écris le symbole de l’ion calcium.", ["Ca2+", "Ca²+", "Ca^{2+}", "ca2+"], "Le calcium échangeable est l’ion Ca²+.", evaluationSource, 2),
    ],
    adaptations: [
      "Le mode d’action calcaire demandé par le guide est relié à la neutralisation de l’acidité et aux échanges du complexe.",
      "La dose n’est jamais déduite du pH seul : texture, matière organique, capacité tampon et culture sont ajoutées au raisonnement.",
      "Le risque de surchaulage et de carences induites est explicité afin d’écarter la règle erronée « plus de chaux = meilleur sol ».",
    ],
  },
  {
    id: "humiferous-amendment",
    title: "Comprendre l’amendement humifère",
    summary: "Relier humus, complexe argilo-humique, agrégats, eau, nutriments et vie du sol.",
    durationMinutes: 18,
    xp: 105,
    section: "Mode d’action des amendements humifères",
    body: String.raw`
## Une interface organo-minérale

Un **amendement humifère** apporte de la matière organique susceptible d’entretenir l’humus. L’humus et certaines argiles portent des charges négatives capables de retenir des cations comme $\mathrm{Ca^{2+}}$, $\mathrm{Mg^{2+}}$, $\mathrm{K^+}$ ou $\mathrm{NH_4^+}$. Leur association contribue au **complexe argilo-humique**.

Cette rétention est réversible : les racines et la solution du sol échangent des ions avec les surfaces. Le complexe n’est donc pas un coffre qui bloque définitivement les nutriments. Il contribue à limiter certaines pertes tout en maintenant des éléments échangeables.

L’humus agit sur trois dimensions :

- **physique** : agrégation, porosité, infiltration, résistance à la battance et réserve en eau ;
- **chimique** : capacité d’échange, tamponnement et libération progressive d’éléments lors de la minéralisation ;
- **biologique** : ressource et habitat pour une partie des organismes du sol.

Un sol sableux peut gagner en rétention d’eau et de nutriments ; un sol argileux compact peut gagner en stabilité d’agrégats et en porosité. Les réponses ne sont pas identiques, et l’effet demande des apports réguliers, une couverture et une réduction des pertes de matière organique.

> **Précision.** « Humifère » ne signifie pas simplement « humide ». Le terme renvoie à l’humus. De même, l’humus n’est pas toute la matière organique fraîche : il représente une fraction transformée et relativement stabilisée.

L’objectif n’est pas d’accumuler sans limite. Des apports mal caractérisés peuvent contenir sels, contaminants ou organismes indésirables. Qualité, maturité, dose et origine doivent être tracées.
`,
    keyPoint: "Humus + argiles + cations → agrégats et échanges qui soutiennent structure, eau, nutriments et organismes",
    example: "Un sol sableux laisse rapidement passer l’eau et les nitrates. Un compost mûr régulier, associé à une couverture, peut améliorer rétention et activité biologique sans rendre instantanément le sol argileux.",
    methodSteps: [
      "Caractérise texture, matière organique et problème dominant du sol.",
      "Vérifie origine, maturité, salinité et innocuité de l’amendement.",
      "Relie l’effet attendu à une propriété physique, chimique ou biologique.",
      "Suit la matière organique et la structure sur plusieurs campagnes.",
    ],
    interaction: schema(
      "Construire un complexe vivant",
      "Sélectionne les repères depuis les résidus jusqu’à l’eau et aux éléments échangeables.",
      "Schéma pédagogique original du continuum résidus-humus-complexe ; les particules ne sont pas à l’échelle.",
      humusShapes,
      humusHotspots,
      "L’effet humifère associe transformations biologiques, surfaces d’échange et organisation physique du sol.",
    ),
    questions: [
      choice("À quoi renvoie précisément le mot humifère ?", ["À l’entretien ou à la formation d’humus", "À une augmentation immédiate de l’humidité", "À tout résidu végétal avant décomposition", "À un apport minéral sans carbone"], 0, "Un amendement humifère contribue à la matière organique humifiée ; humifère ne signifie pas simplement humide."),
      choice("Quelles fractions forment surtout le complexe argilo-humique ?", ["Les colloïdes argileux et humiques", "Le sable grossier et le limon seulement", "Les carbonates dissous et l’eau gravitaire", "Les racines vivantes et les décomposeurs seulement"], 0, "Argiles et humus constituent l’interface colloïdale chargée."),
      choice("Pourquoi le complexe retient-il des cations ?", ["Ses surfaces portent majoritairement des charges négatives", "Ses surfaces sont neutres mais rendent les ions insolubles", "Il transforme tous les cations en anions", "Il enferme irréversiblement les ions dans les agrégats"], 0, "L’attraction électrostatique permet une rétention réversible et des échanges."),
      choice("Cette rétention est-elle définitive ?", ["Oui, aucun ion ne ressort", "Non, les ions restent échangeables", "Seulement pour l’eau", "Seulement pour le sable"], 1, "Les racines et la solution échangent des ions."),
      trueFalse("Toute matière organique fraîche est déjà de l’humus stabilisé.", false, "La transformation et la stabilisation demandent du temps."),
      choice("Quel effet du complexe est surtout physique ?", ["L’amélioration de l’agrégation et de la porosité", "L’augmentation de la capacité d’échange cationique", "La libération d’ions par minéralisation", "La stimulation de la respiration microbienne"], 0, "Les agrégats organisent la structure et la porosité ; les autres propositions relèvent surtout des dimensions chimique ou biologique."),
      choice("Quel effet est surtout chimique ?", ["La capacité d’échange de cations", "La création de macropores par les racines", "La fragmentation des résidus par la faune", "La protection physique de la surface par un paillis"], 0, "Les surfaces argileuses et humiques retiennent et échangent des cations."),
      choice("Pourquoi vérifier la qualité d’un amendement ?", ["Il peut contenir sels ou contaminants", "Il est toujours identique", "Pour supprimer les analyses", "Pour augmenter automatiquement la pluie"], 0, "Origine et maturité influencent efficacité et risques."),
      choice("Quel suivi évalue le mieux un amendement humifère ?", ["Matière organique, agrégation et infiltration sur plusieurs campagnes", "pH mesuré une seule fois juste après l’épandage", "rendement d’une plante sans témoin", "masse brute apportée sans analyser le produit"], 0, "Les effets sont progressifs et concernent plusieurs propriétés."),
      short("Écris le nom de l’association entre argiles et humus.", ["complexe argilo-humique", "le complexe argilo-humique", "complexe argilohumique"], "Cette association porte des sites d’échange et participe aux agrégats.", evaluationSource, 2),
    ],
    adaptations: [
      "Le mode d’action humifère demandé par le guide est déployé sur les dimensions physique, chimique et biologique.",
      "Le complexe argilo-humique est présenté comme une interface d’échanges réversibles et non comme un stockage définitif.",
      "Humus, matière organique fraîche et humidité sont distingués pour corriger trois confusions terminologiques fréquentes.",
    ],
  },
  {
    id: "fertilizer-benefits-risks",
    title: "Évaluer bénéfices et risques des engrais",
    summary: "Mesurer simultanément rendement, santé du sol, pertes et pollution de l’environnement.",
    durationMinutes: 19,
    xp: 115,
    section: "Effets positifs et négatifs des engrais sur le sol et l’environnement",
    body: String.raw`
## Un effet dépendant de la dose et du trajet

Un engrais adapté peut corriger une carence, accélérer la croissance et augmenter rendement ou qualité. Ces effets sont **positifs** lorsque l’élément apporté limite réellement la culture et que la dose est accessible aux racines au bon moment.

La fraction non absorbée suit plusieurs trajets. Le nitrate dissous peut descendre avec l’eau vers la nappe par **lixiviation** — phénomène souvent appelé « lessivage des nitrates » dans l’usage courant, alors que le lessivage désigne plus précisément l’entraînement de particules. Le phosphore est souvent transporté avec les particules érodées ; l’urée laissée en surface peut perdre une partie de son azote par volatilisation ; des transformations microbiennes peuvent produire du protoxyde d’azote. Des apports répétés peuvent aussi contribuer à l’acidification, à la salinité ou à des déséquilibres nutritifs selon produits et sols.

Lorsque azote ou phosphore atteignent une eau de surface, ils peuvent stimuler une prolifération d’algues. Leur décomposition consomme du dioxygène : c’est une composante de l’**eutrophisation**. Le risque ne dépend donc pas seulement de la quantité achetée, mais du transfert depuis la parcelle.

| Risque | Prévention ciblée |
|---|---|
| lixiviation du nitrate dissous | dose ajustée, fractionnement, couverture, calendrier |
| ruissellement du phosphore | couverture, lutte contre l’érosion, incorporation raisonnée |
| volatilisation | source, placement, météo et délai adaptés |
| acidification ou salinité | suivi du pH et de la conductivité, choix du produit |

L’évaluation doit associer **rendement**, efficacité d’utilisation, coût, pH, salinité, reliquat nutritif et qualité de l’eau lorsque le contexte l’exige. Une culture plus verte n’est pas une preuve suffisante de durabilité.

> **Décision responsable.** Réduire les pertes ne signifie pas supprimer tout engrais ; il s’agit de rapprocher l’apport du besoin, de recycler les ressources et de protéger les voies de transfert.
`,
    keyPoint: "Bénéfice si l’élément limite la culture ; risque lorsque dose, moment ou trajet créent un excédent transférable",
    example: "Une forte dose appliquée avant un orage verdit d’abord la culture, mais une partie du nitrate est lixiviée. Le rendement supplémentaire doit être comparé aux pertes et à la qualité de l’eau.",
    methodSteps: [
      "Identifie le bénéfice agronomique attendu et l’élément limitant.",
      "Trace les voies possibles : plante, sol, air, ruissellement et nappe.",
      "Choisis une prévention spécifique à la voie dominante.",
      "Évalue rendement et indicateurs environnementaux sur la même période.",
    ],
    interaction: diagram(
      "Suivre le devenir d’un apport",
      "Ouvre chaque destination et distingue absorption utile, stockage temporaire et perte.",
      "Engrais appliqué",
      "Après dissolution et transformation, l’élément peut être absorbé, retenu, transformé ou transféré hors de la parcelle.",
      [
        { id: "crop", group: "Utile", label: "Absorption", role: "Produire", detail: "La plante utilise l’élément si racines, eau, pH et stade permettent son absorption." },
        { id: "soil", group: "Réserve", label: "Sol", role: "Retenir", detail: "Une fraction peut être adsorbée, immobilisée ou rester en solution ; elle n’est pas toujours immédiatement perdue ni disponible." },
        { id: "leaching", group: "Perte", label: "Lixiviation", role: "Protéger la nappe", detail: "Le nitrate dissous peut suivre l’eau sous la zone racinaire, surtout si l’apport dépasse l’absorption ; le terme lessivage est souvent employé par extension." },
        { id: "runoff", group: "Perte", label: "Ruissellement", role: "Protéger les eaux", detail: "Eau et particules érodées transportent des nutriments vers fossés, rivières et lagunes." },
        { id: "air", group: "Perte", label: "Atmosphère", role: "Limiter", detail: "Volatilisation et transformations microbiennes peuvent transférer une partie de l’azote vers l’air." },
        { id: "monitor", group: "Décision", label: "Suivi", role: "Ajuster", detail: "Rendement, reliquat, pH, conductivité et eau permettent de corriger la stratégie suivante." },
      ],
      "Une prévention efficace vise le trajet dominant au lieu d’appliquer une règle identique à toutes les parcelles.",
    ),
    questions: [
      choice("Quand un engrais produit-il surtout un bénéfice ?", ["Quand il corrige un élément réellement limitant", "Quand la dose est maximale", "Quand il ruisselle", "Quand le sol est ignoré"], 0, "Le bénéfice dépend d’un besoin réel et d’une bonne utilisation."),
      choice("Quel ion est particulièrement mobile vers la nappe ?", ["Nitrate", "Argile entière", "Humus solide", "Roche mère"], 0, "Le nitrate suit facilement l’eau."),
      choice("Comment le phosphore atteint-il souvent une eau de surface ?", ["Avec des particules érodées entraînées par ruissellement", "Par lixiviation rapide sous forme gazeuse", "Par volatilisation directe du phosphate", "Par absorption racinaire puis disparition de toute biomasse"], 0, "Le phosphore fixé aux particules peut être transféré par érosion et ruissellement."),
      choice("Quelle chaîne décrit l’eutrophisation d’une eau ?", ["Apport nutritif → prolifération → décomposition → déficit d’oxygène", "Acidification du sol → floculation → hausse immédiate de l’oxygène", "Lixiviation → disparition des organismes → eau plus oligotrophe", "Chaulage → salinisation → fixation biologique de l’azote"], 0, "L’excès nutritif stimule une biomasse dont la décomposition consomme du dioxygène."),
      trueFalse("Une culture plus verte suffit à prouver que la stratégie est durable.", false, "Il faut aussi mesurer rendement, pertes et état du milieu."),
      choice("Quelle pratique limite la lixiviation du nitrate ?", ["Fractionner et synchroniser l’apport avec l’absorption", "Appliquer toute la dose avant une pluie drainante", "Supprimer la couverture entre cultures", "Augmenter le reliquat après récolte"], 0, "La synchronisation rapproche apport et absorption et réduit le stock dissous exposé au drainage."),
      choice("Quel suivi détecte directement une acidification progressive ?", ["Le pH mesuré selon un protocole constant", "La conductivité électrique sans mesure de pH", "Le nitrate résiduel sans mesure de pH", "Le rendement seul"], 0, "Le suivi répété du pH renseigne la réaction du sol."),
      choice("Quel indicateur aide à suivre un risque de salinité ?", ["La conductivité électrique de l’extrait de sol", "Le pH seul, quelle que soit la concentration ionique", "Le taux d’argile seul", "Le rendement d’une seule plante"], 0, "La conductivité reflète globalement la concentration en sels dissous."),
      choice("Réduire les pertes signifie-t-il supprimer tout engrais ?", ["Oui, même lorsqu’une carence mesurée limite la culture", "Non, il faut ajuster l’apport au besoin et aux voies de transfert", "Oui, car tout élément minéral est nécessairement polluant", "Non, car toute dose est intégralement absorbée"], 1, "La gestion raisonnée cherche l’efficacité sans nier les besoins diagnostiqués."),
      short("Écris le terme agronomique précis désignant l’entraînement d’un soluté dissous vers la profondeur par l’eau.", ["lixiviation", "la lixiviation", "lessivage", "le lessivage"], "Le terme précis est lixiviation ; lessivage reste toléré ici parce qu’il est très souvent employé par extension pour les nitrates.", evaluationSource, 2),
    ],
    adaptations: [
      "Les effets négatifs cités par le guide sont reliés à des voies précises : lixiviation, ruissellement, volatilisation et transformation microbienne.",
      "L’eutrophisation est expliquée comme une chaîne nutriments-prolifération-décomposition-déficit d’oxygène.",
      "Les bénéfices et risques sont évalués ensemble afin de ne présenter ni l’engrais comme solution universelle ni son abandon comme règle universelle.",
    ],
  },
  {
    id: "cooperative-garden-mission",
    title: "Mission : restaurer le jardin de la coopérative",
    summary: "Combiner diagnostic, techniques culturales, amendements et engrais dans un plan vérifiable.",
    durationMinutes: 25,
    xp: 145,
    kind: "challenge",
    section: "Situation intégrée — amélioration raisonnée de la fertilité",
    body: String.raw`
## Situation d’évaluation adaptée du guide

Le jardin de la coopérative produit peu. Trois planches de tomate présentent une croissance irrégulière. Les élèves disposent des données suivantes :

| Indicateur | Zone A | Zone B | Zone C |
|---|---:|---:|---:|
| pH | 4,7 | 5,8 | 5,9 |
| matière organique | 0,9 % | 1,8 % | 1,9 % |
| infiltration de 20 mm | 55 min | 24 min | 22 min |
| eau stagnante après pluie | 30 h | 4 h | 3 h |
| rendement témoin | 8 t/ha | 14 t/ha | 15 t/ha |

Un essai local compare quatre traitements dans chaque zone : témoin, compost mûr, engrais minéral raisonné, compost + engrais fractionné. Un chaulage calculé est testé seulement en zone A, où l’acidité est confirmée. Les élèves mesurent rendement, pH, infiltration, nitrate résiduel et coût.

Avant l’essai complet, une expérimentation d’amendement conduite en zone A fournit, après une campagne, les moyennes pédagogiques suivantes :

| Traitement | pH final | agrégats stables | infiltration de 20 mm | rendement |
|---|---:|---:|---:|---:|
| témoin | 4,7 | 22 % | 54 min | 8,1 t/ha |
| calcaire seul | 5,6 | 30 % | 46 min | 10,3 t/ha |
| compost mûr seul | 4,9 | 43 % | 31 min | 11,5 t/ha |
| calcaire + compost | 5,6 | 52 % | 24 min | 13,7 t/ha |

Le calcaire est associé ici à la plus forte correction du pH. Le compost modifie peu le pH, mais s’accompagne d’agrégats plus stables et d’une infiltration plus rapide. Le traitement combiné réunit ces évolutions ; cependant, sans répétitions, dispersion des mesures ni test statistique, ce tableau ne suffit pas à prouver une synergie universelle.

### Travail demandé

1. **Diagnostiquer** : en A, acidité, faible matière organique et mauvaise infiltration se cumulent ; il faut aussi vérifier tassement et drainage. B et C servent de comparaison, mais ne sont pas des copies parfaites.
2. **Choisir** : apporter un compost mûr pour la matière organique, corriger l’acidité de A par une dose de calcaire calculée, réduire le tassement et maintenir une couverture. L’engrais est choisi à partir des besoins et fractionné.
3. **Analyser et interpréter** : comparer chaque indicateur au témoin, associer les évolutions aux modes d’action proposés, puis distinguer association et preuve causale. Randomiser les sous-parcelles et répéter les mesures consolident l’interprétation.
4. **Protéger** : ne pas appliquer avant un orage, limiter le ruissellement et la lixiviation, puis surveiller nitrate et pH.
5. **Décider** : retenir la stratégie qui améliore rendement et sol avec un coût acceptable, sans transférer l’excédent vers l’eau.

> **Conclusion attendue.** « Compost + engrais » n’est pas automatiquement gagnant ; la combinaison doit être comparée aux traitements simples. Le chaulage n’est retenu que là où le diagnostic d’acidité le justifie.

La mission transforme la situation introductive du guide en protocole de décision. Les valeurs sont **pédagogiques et originales** : elles ne doivent pas être attribuées à un essai officiel du DPFC.
`,
    keyPoint: "Plan intégré = diagnostiquer → comparer → corriger les causes → mesurer rendement et environnement → ajuster",
    example: "Si le traitement combiné augmente le rendement mais laisse beaucoup de nitrate résiduel, on réduit ou fractionne mieux la dose au cycle suivant au lieu de déclarer le protocole définitivement optimal.",
    methodSteps: [
      "Hiérarchise les contraintes de chaque zone à partir des données.",
      "Associe chaque intervention à une cause et à un indicateur de réussite.",
      "Construis des traitements comparables avec témoin et répétitions.",
      "Décide avec rendement, coût, pH, structure et risque de perte.",
      "Formule l’ajustement du cycle suivant et les limites de l’essai.",
    ],
    interaction: timeline(
      "Conduire l’essai de la coopérative",
      "Ouvre les étapes et vérifie qu’aucune décision ne précède le diagnostic.",
      [
        { label: "Cartographier les zones", shortLabel: "Comparer", detail: "Séparer A, B et C selon pH, matière organique, infiltration, stagnation et rendement avant de mélanger leurs résultats." },
        { label: "Formuler les hypothèses", shortLabel: "Expliquer", detail: "Acidité, tassement, engorgement et faible restitution sont des hypothèses à tester, pas des certitudes tirées d’un seul indice." },
        { label: "Installer les traitements", shortLabel: "Tester", detail: "Témoin, compost, engrais raisonné et combinaison permettent de comparer les contributions ; le calcaire reste ciblé sur A." },
        { label: "Suivre la campagne", shortLabel: "Mesurer", detail: "Rendement, pH, infiltration, nitrate résiduel, symptômes et coût sont recueillis avec le même protocole." },
        { label: "Évaluer les transferts", shortLabel: "Protéger", detail: "Observer pluies, ruissellement et reliquats pour éviter qu’un gain de rendement masque une pollution." },
        { label: "Ajuster", shortLabel: "Décider", detail: "La stratégie suivante conserve les bénéfices observés, réduit les excès et reconnaît les limites du petit essai." },
      ],
      "La mission réussit lorsqu’elle justifie chaque action et prévoit comment réfuter ou corriger le plan.",
    ),
    questions: [
      choice("Quelle zone cumule le plus de contraintes mesurées ?", ["Zone B", "Zone C", "Aucune donnée ne distingue les zones", "Zone A"], 3, "A combine forte acidité, faible matière organique, infiltration lente et longue stagnation."),
      choice("Pourquoi le chaulage est-il testé seulement en A ?", ["Parce que l’acidité y est diagnostiquée", "Parce que le calcaire remplace tout engrais", "Parce que B et C n’ont pas de sol", "Parce qu’il faut toujours chauler la première zone"], 0, "Une correction calcaire doit cibler une acidité confirmée."),
      choice("Quel résultat soutient le plus directement l’action du calcaire sur l’acidité ?", ["Le rendement du témoin reste à 8,1 t/ha", "Le pH passe de 4,7 à 5,6 avec le calcaire seul", "Les agrégats du témoin valent 22 %", "Le compost seul donne un pH de 4,9"], 1, "Comparé au témoin, le calcaire seul est associé à une hausse nette du pH."),
      choice("Quel couple d’indicateurs soutient surtout l’effet structural du compost seul ?", ["pH 4,9 et rendement 11,5 t/ha", "pH 4,9 et pH témoin 4,7", "43 % d’agrégats stables et infiltration ramenée à 31 min", "rendement 11,5 t/ha et rendement combiné 13,7 t/ha"], 2, "Par rapport au témoin, stabilité des agrégats et vitesse d’infiltration renseignent directement la structure."),
      trueFalse("Le traitement au meilleur rendement est automatiquement le meilleur, quel que soit son coût ou le nitrate résiduel.", false, "La décision intègre coût, sol et environnement."),
      choice("Pourquoi le meilleur résultat du traitement combiné ne prouve-t-il pas encore une synergie ?", ["Le pH n’a jamais été mesuré", "Le témoin a reçu plus de calcaire", "Le compost ne contient aucune matière organique", "Il manque répétitions, variabilité et analyse statistique"], 3, "Une valeur moyenne unique montre une association, pas une interaction démontrée ni une règle universelle."),
      choice("Quel résultat impose de revoir en priorité la fertilisation azotée ?", ["Un nitrate résiduel élevé après récolte malgré un rendement stable", "Une hausse du pH après le seul traitement calcaire", "Une infiltration plus rapide après compost", "Une meilleure stabilité des agrégats sans nitrate excédentaire"], 0, "Un reliquat élevé signale un excédent dissous potentiellement lixiviable."),
      choice("Pourquoi éviter un apport juste avant un orage ?", ["Pour réduire ruissellement et lixiviation", "Pour empêcher toute absorption racinaire", "Pour accélérer la minéralisation sans perte", "Pour rendre le sol nécessairement plus poreux"], 0, "La pluie intense peut entraîner particules et solutés avant leur utilisation par la culture."),
      choice("Quelle conclusion est rigoureuse ?", ["Le plan doit être ajusté à partir des résultats et de leurs limites", "Une seule campagne prouve une règle universelle", "Plus de produit est toujours meilleur", "Les trois zones sont identiques"], 0, "Un essai local guide sans établir une vérité universelle."),
      short("Écris le mot désignant la parcelle sans traitement utilisée comme référence.", ["témoin", "temoin", "le témoin", "parcelle témoin"], "Le témoin permet d’estimer l’évolution sans intervention.", evaluationSource, 2),
    ],
    adaptations: [
      "La situation du jardin de coopérative proposée par le guide est transformée en mission expérimentale avec données pédagogiques originales clairement signalées.",
      "Le dispositif sépare témoin, compost, engrais et combinaison afin de ne pas attribuer un effet sans comparaison.",
      "La décision finale intègre rendement, coût, pH, infiltration et nitrate résiduel, conformément à l’analyse conjointe des effets positifs et négatifs.",
      "Le chaulage reste limité à la zone où l’acidité est diagnostiquée ; il n’est jamais généralisé à tout le jardin.",
    ],
  },
];

const levelOrder = [
  "soil-fertility-diagnosis",
  "water-air-regulation",
  "cultural-techniques",
  "fertilizer-dose-balance",
  "organic-amendments",
  "calcareous-amendment",
  "humiferous-amendment",
  "fertilizer-benefits-risks",
  "cooperative-garden-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau fertilité du sol introuvable : ${id}`);
  return adaptedLevel(index, seed);
});

export const terminalCSvtSoilFertilityPath: LearningPath = {
  id: "terminale-c-svt-l11-soil-fertility",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Adaptation enrichie du guide officiel",
  curriculumSourceUrl: sourceUrl,
  theme: { number: 2, title: "La gestion des sols" },
  chapterNumber: 11,
  title: "L’amélioration de la fertilité du sol",
  description: "Neuf niveaux pour diagnostiquer un sol, réguler eau et air, raisonner techniques culturales, engrais et amendements, puis restaurer le jardin d’une coopérative sans déplacer la pollution.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer fertilité, productivité et propriétés physiques, chimiques et biologiques",
    "Choisir des techniques de régulation de l’humidité, d’aération et de conduite culturale",
    "Raisonner source, dose, moment et placement des engrais minéraux",
    "Expliquer décomposition, minéralisation, humification et complexe argilo-humique",
    "Expliquer l’action d’un amendement calcaire et prévenir le surchaulage",
    "Évaluer ensemble rendement, état du sol, pertes nutritives et pollution",
    "Construire un essai comparatif et ajuster un plan intégré de restauration",
  ],
  modules: [
    {
      id: "diagnose-manage-soil-fertility",
      title: "Diagnostiquer et gérer la fertilité",
      description: "Du fonctionnement du sol à une décision agronomique mesurée et révisable.",
      lessons: builtLevels,
    },
  ],
};
