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

const sourceDocument = "SVT TD_L2_Le fonctionnement du  tissu nerveux.pdf";

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

const source = (
  pages: string,
  section: string,
  corrections: string[],
): LessonSourceMetadata => ({
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
      eyebrow: "Méthode expérimentale",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Décris le dispositif ou le document, relève le résultat utile, puis sépare clairement analyse, interprétation et conclusion.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : un tracé se décrit avant d’être expliqué. N’attribue jamais un mécanisme à une courbe sans citer l’indice observé.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const nerveNeuronShapes: SchemaShape[] = [
  { shape: "path", d: "M40 270 C55 155 160 110 285 140 C345 155 380 210 352 286 C325 352 205 366 112 337 C62 321 34 299 40 270 Z", tone: "soft" },
  { shape: "ellipse", cx: 112, cy: 232, rx: 42, ry: 30, tone: "outline" },
  { shape: "ellipse", cx: 204, cy: 218, rx: 42, ry: 30, tone: "outline" },
  { shape: "ellipse", cx: 286, cy: 252, rx: 42, ry: 30, tone: "outline" },
  { shape: "circle", cx: 112, cy: 232, r: 13, tone: "fill" },
  { shape: "circle", cx: 204, cy: 218, r: 13, tone: "fill" },
  { shape: "circle", cx: 286, cy: 252, r: 13, tone: "fill" },
  { shape: "path", d: "M510 205 C542 172 584 176 607 207 C630 238 612 276 574 282 C536 285 505 252 510 205 Z", tone: "soft" },
  { shape: "circle", cx: 568, cy: 229, r: 13, tone: "fill" },
  { shape: "path", d: "M510 212 L468 172 M468 172 L443 155 M468 172 L452 198 M512 245 L466 278 M466 278 L442 296 M466 278 L452 258", tone: "outline" },
  { shape: "path", d: "M607 232 C664 222 708 246 760 234 C818 221 862 245 916 233", tone: "outline" },
  { shape: "ellipse", cx: 688, cy: 235, rx: 34, ry: 14, tone: "soft" },
  { shape: "ellipse", cx: 774, cy: 235, rx: 34, ry: 14, tone: "soft" },
  { shape: "ellipse", cx: 860, cy: 235, rx: 34, ry: 14, tone: "soft" },
  { shape: "path", d: "M916 233 L957 202 M957 202 L980 187 M957 202 L979 216 M916 233 L962 237 M962 237 L987 229 M916 233 L954 269 M954 269 L979 286", tone: "outline" },
  { shape: "line", x1: 395, y1: 70, x2: 395, y2: 385, tone: "muted" },
  { shape: "text", x: 190, y: 410, content: "Nerf : plusieurs faisceaux de fibres", anchor: "middle" },
  { shape: "text", x: 715, y: 410, content: "Neurone : cellule excitable", anchor: "middle" },
];

const nerveNeuronHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "epineurium", number: 1, label: "Épinèvre", x: 54, y: 154, detail: "L’épinèvre est la gaine conjonctive externe du nerf. Il protège l’ensemble des faisceaux et accompagne les vaisseaux sanguins." },
  { id: "fascicle", number: 2, label: "Faisceau", x: 204, y: 176, detail: "Chaque faisceau réunit de nombreuses fibres nerveuses et est entouré d’un périnèvre." },
  { id: "fiber", number: 3, label: "Fibres nerveuses", x: 286, y: 252, detail: "Une fibre nerveuse correspond principalement à un axone, avec ou sans myéline. Un nerf en contient un grand nombre." },
  { id: "soma", number: 4, label: "Corps cellulaire", x: 568, y: 229, detail: "Le soma contient le noyau et la majeure partie des organites. Les dendrites y convergent." },
  { id: "dendrites", number: 5, label: "Dendrites", x: 454, y: 160, detail: "Les dendrites reçoivent de nombreux signaux et les conduisent vers la région d’intégration du neurone." },
  { id: "axon", number: 6, label: "Axone", x: 640, y: 198, detail: "L’axone conduit le potentiel d’action vers les terminaisons. Il peut constituer la fibre d’un nerf périphérique." },
  { id: "myelin", number: 7, label: "Myéline", x: 774, y: 198, detail: "La myéline isole des segments d’axone. Dans un nerf périphérique, elle est produite par les cellules de Schwann." },
  { id: "node", number: 8, label: "Nœud de Ranvier", x: 817, y: 265, detail: "Entre deux segments de myéline, le nœud concentre des canaux voltage-dépendants et régénère le potentiel d’action." },
  { id: "terminal", number: 9, label: "Arborisation terminale", x: 968, y: 298, detail: "Les terminaisons établissent des synapses avec la cellule suivante et libèrent le neurotransmetteur." },
];

const motorSynapseShapes: SchemaShape[] = [
  { shape: "path", d: "M315 25 L315 105 M365 25 L365 105", tone: "outline" },
  { shape: "path", d: "M315 100 C260 118 240 165 250 225 L430 225 C440 165 420 118 365 100 Z", tone: "soft" },
  { shape: "circle", cx: 288, cy: 166, r: 11, tone: "outline" },
  { shape: "circle", cx: 330, cy: 145, r: 11, tone: "outline" },
  { shape: "circle", cx: 375, cy: 168, r: 11, tone: "outline" },
  { shape: "circle", cx: 310, cy: 200, r: 10, tone: "outline" },
  { shape: "circle", cx: 360, cy: 200, r: 10, tone: "outline" },
  { shape: "circle", cx: 274, cy: 206, r: 4, tone: "accent" },
  { shape: "circle", cx: 288, cy: 235, r: 4, tone: "accent" },
  { shape: "circle", cx: 324, cy: 239, r: 4, tone: "accent" },
  { shape: "circle", cx: 358, cy: 235, r: 4, tone: "accent" },
  { shape: "circle", cx: 398, cy: 208, r: 4, tone: "accent" },
  { shape: "line", x1: 240, y1: 225, x2: 440, y2: 225, tone: "outline" },
  { shape: "line", x1: 220, y1: 250, x2: 460, y2: 250, tone: "muted" },
  { shape: "path", d: "M205 275 L250 275 L258 308 L266 275 L310 275 L318 308 L326 275 L370 275 L378 308 L386 275 L430 275 L438 308 L446 275 L485 275", tone: "outline" },
  { shape: "line", x1: 180, y1: 340, x2: 510, y2: 340, tone: "outline" },
  { shape: "line", x1: 180, y1: 356, x2: 510, y2: 356, tone: "outline" },
  { shape: "text", x: 340, y: 405, content: "Plaque motrice — schéma pédagogique original", anchor: "middle" },
];

const motorSynapseHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "terminal-button", number: 1, label: "Bouton présynaptique", x: 450, y: 128, detail: "La terminaison du motoneurone reçoit le potentiel d’action et contient les vésicules d’acétylcholine." },
  { id: "vesicles", number: 2, label: "Vésicules", x: 330, y: 145, detail: "Les vésicules stockent l’acétylcholine et fusionnent avec la membrane par exocytose quand le calcium entre." },
  { id: "calcium", number: 3, label: "Canaux Ca²⁺", x: 235, y: 205, detail: "Le potentiel d’action ouvre des canaux calciques voltage-dépendants. L’entrée de Ca²⁺ déclenche l’exocytose." },
  { id: "cleft", number: 4, label: "Fente synaptique", x: 500, y: 250, detail: "L’acétylcholine diffuse dans cet espace très étroit entre le neurone et la fibre musculaire." },
  { id: "receptors", number: 5, label: "Récepteurs nicotiniques", x: 430, y: 292, detail: "Ces récepteurs-canaux s’ouvrent quand l’acétylcholine se fixe et laissent surtout entrer des cations, ce qui dépolarise la plaque motrice." },
  { id: "muscle", number: 6, label: "Fibre musculaire", x: 150, y: 350, detail: "Si le potentiel de plaque atteint le seuil, un potentiel d’action musculaire naît et déclenche ensuite le couplage excitation-contraction." },
  { id: "ache", number: 7, label: "Acétylcholinestérase", x: 180, y: 250, detail: "L’enzyme hydrolyse rapidement l’acétylcholine. La choline, et non la molécule intacte, est recaptée pour la resynthèse." },
];

const levels: LevelSeed[] = [
  {
    id: "nerve-tissue-organization",
    title: "Organiser le nerf et le neurone",
    summary: "Distinguer nerf, faisceau, fibre nerveuse, neurone et cellules gliales sur une figure originale annotée.",
    pages: "1-3 et 20",
    section: "I-A. Organisation du tissu nerveux",
    durationMinutes: 25,
    xp: 45,
    body: String.raw`
## Du nerf à la cellule nerveuse

Le document commence par une coupe transversale de **nerf**. Un nerf périphérique n’est pas une cellule : c’est un organe formé de plusieurs faisceaux de fibres nerveuses, de vaisseaux sanguins et de tissu conjonctif.

| Échelle | Organisation | Enveloppe principale |
|---|---|---|
| nerf entier | plusieurs faisceaux, vaisseaux et tissu conjonctif | **épinèvre** |
| faisceau | ensemble de fibres nerveuses | **périnèvre** |
| fibre nerveuse | axone, parfois entouré de myéline | endonèvre autour des fibres |

Le **neurone** est une cellule excitable spécialisée dans la réception, l’intégration et la transmission de signaux. Il comporte un **corps cellulaire** ou soma, des **dendrites**, un **axone** et une **arborisation terminale**. L’axone d’un neurone peut devenir une fibre d’un nerf périphérique.

## Neurones et cellules gliales

Le tissu nerveux n’est pas constitué uniquement de nerfs. Il réunit des **neurones** et des **cellules gliales** dans les centres nerveux ; les nerfs appartiennent au système nerveux périphérique. Les cellules gliales soutiennent, nourrissent, protègent et isolent les neurones.

La **myéline** est produite par les cellules de Schwann autour des axones périphériques. Dans l’encéphale et la moelle épinière, le même rôle est assuré par les oligodendrocytes. Entre deux segments de myéline, la membrane reste exposée au **nœud de Ranvier**.

## Lire le schéma sans confondre les niveaux

Le dessin interactif met côte à côte une coupe de nerf et un neurone. Une fibre du nerf correspond principalement à un axone ; elle n’est ni un neurone entier ni un faisceau. Le soma et les dendrites ne parcourent généralement pas le nerf périphérique.

> **Correction de la source.** La phrase « le tissu nerveux est constitué de nerfs » est trop restrictive. Le tissu nerveux comprend surtout neurones et glie ; un nerf est une structure périphérique faite de nombreux axones. La liste scolaire en trois parties omet aussi les dendrites, indispensables à la réception des signaux.

> **Astuce mémoire — E-P-E :** **É**pinèvre autour du nerf, **P**érinèvre autour du faisceau, **E**ndonèvre autour de la fibre.
`,
    keyPoint: "Un nerf est un organe plurifasciculaire ; le neurone est la cellule excitable, et sa fibre correspond principalement à son axone.",
    example: "Sur une coupe, plusieurs petits cercles dans un compartiment entouré indiquent des fibres réunies en faisceau, pas plusieurs corps cellulaires.",
    methodSteps: [
      "Repère d’abord la limite du nerf entier et son épinèvre.",
      "Identifie ensuite les faisceaux entourés de périnèvre.",
      "Descends à l’échelle d’une fibre et relie-la à l’axone d’un neurone.",
      "Ajoute les dendrites et distingue myéline périphérique et myéline centrale.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Du nerf au neurone",
      instruction: "Sélectionne les neuf repères et compare l’organe collectif avec la cellule individuelle.",
      viewBox: "0 0 1030 440",
      caption: "Figure pédagogique originale reconstruite d’après les éléments des pages 1-2 ; aucune image du PDF n’est republiée.",
      shapes: nerveNeuronShapes,
      hotspots: nerveNeuronHotspots,
      observation: "Le nerf contient de nombreux axones ; le corps cellulaire et les dendrites appartiennent au neurone mais ne sont pas les petits cercles de la coupe de nerf.",
    },
    questions: [
      choice("Quelle enveloppe entoure le nerf entier ?", ["L’épinèvre", "Le périnèvre", "La myéline", "La fente synaptique"], 0, "L’épinèvre est la gaine conjonctive externe du nerf.", "Figure 1 • page 2"),
      choice("Que trouve-t-on à l’intérieur d’un faisceau nerveux ?", ["Des corps jaunes", "Des fibres nerveuses", "Des alvéoles", "Des néphrons"], 1, "Le faisceau rassemble de nombreux axones ou fibres nerveuses.", "Analyse • page 2"),
      choice("À quelle partie du neurone correspond principalement une fibre nerveuse ?", ["Au noyau", "À la dendrite seule", "À l’axone", "À la fente synaptique"], 2, "Dans un nerf périphérique, la fibre est principalement l’axone avec ses enveloppes."),
      choice("Qui produit la myéline autour d’un axone périphérique ?", ["Le globule rouge", "Le neurone postsynaptique", "Le périnèvre", "La cellule de Schwann"], 3, "La cellule de Schwann myélinise un segment d’axone dans le système périphérique."),
      trueFalse("Un nerf entier est une seule cellule nerveuse.", false, "Un nerf est un organe formé de nombreux axones, de tissu conjonctif et de vaisseaux."),
      choice("Quel prolongement reçoit de nombreux signaux vers le soma ?", ["La dendrite", "L’épinèvre", "Le muscle", "Le nœud lymphatique"], 0, "Les dendrites constituent une grande surface de réception."),
      choice("Quelle cellule myélinise les axones dans les centres nerveux ?", ["La cellule de Schwann", "L’oligodendrocyte", "Le fibroblaste", "Le lymphocyte"], 1, "Les oligodendrocytes assurent la myélinisation dans le système nerveux central."),
      choice("Quelle enveloppe entoure un faisceau ?", ["L’épinèvre", "La pie-mère", "Le périnèvre", "Le sarcomère"], 2, "Le périnèvre délimite chaque faisceau."),
      choice("Quel énoncé corrige le mieux la conclusion du PDF ?", ["Le tissu nerveux ne contient que des vaisseaux", "Tous les neurones sont dans les nerfs", "Une fibre est un neurone complet", "Le tissu nerveux associe neurones et glie ; les nerfs sont périphériques"], 3, "Cette formulation respecte les deux niveaux d’organisation."),
      short("Donne le nom de l’interruption entre deux segments de myéline.", ["nœud de Ranvier", "noeud de Ranvier", "le nœud de Ranvier", "le noeud de Ranvier"], "Le potentiel d’action est régénéré aux nœuds de Ranvier.", "Figure 2 • page 2"),
    ],
    corrections: [
      "Le tissu nerveux est décrit comme un ensemble de neurones et de cellules gliales ; un nerf est une structure du système périphérique.",
      "Les dendrites sont ajoutées à la description fonctionnelle du neurone, que le découpage en trois parties du PDF omet.",
      "La myéline périphérique produite par les cellules de Schwann est distinguée de la myéline centrale produite par les oligodendrocytes.",
    ],
  },
  {
    id: "resting-membrane-potential",
    title: "Expliquer le potentiel de repos",
    summary: "Interpréter les deux montages d’électrodes et relier environ −70 mV aux gradients ioniques et à la perméabilité membranaire.",
    pages: "3-6 et 21",
    section: "I-B. Nature du message nerveux — potentiel de repos",
    durationMinutes: 28,
    xp: 55,
    kind: "graph",
    body: String.raw`
## Deux électrodes, deux mesures

Le dispositif compare le potentiel électrique enregistré par deux microélectrodes. Quand elles sont toutes les deux posées à la surface de l’axone au repos, elles mesurent le même milieu : la différence de potentiel est **0 mV**.

Quand une électrode pénètre dans l’axone et que l’autre reste dehors, l’oscilloscope indique environ **−70 mV**. Par convention :

$$V_m=V_{\text{intérieur}}-V_{\text{extérieur}}\approx -70\ \mathrm{mV}$$

L’intérieur est donc plus négatif que l’extérieur au repos. La valeur exacte dépend du type de cellule ; −70 mV est un ordre de grandeur pédagogique, pas une constante universelle.

## Une répartition ionique inégale

Le tableau du document montre davantage de $\mathrm{K^+}$ dans le cytoplasme et davantage de $\mathrm{Na^+}$ dans le milieu extracellulaire. La membrane au repos est plus perméable au potassium grâce aux canaux de fuite. Le départ net de $\mathrm{K^+}$ laisse derrière lui des charges négatives non diffusibles et contribue fortement au potentiel de repos.

La pompe sodium-potassium utilise de l’ATP pour transporter, par cycle :

$$3\,\mathrm{Na^+}\ \text{vers l’extérieur}\quad\text{et}\quad 2\,\mathrm{K^+}\ \text{vers l’intérieur}$$

Elle maintient les gradients sur la durée et contribue légèrement au caractère négatif du potentiel. Elle ne « crée » pas seule et instantanément la valeur de −70 mV.

## Ne pas confondre concentration et charge

Les deux milieux restent globalement électroneutres : le potentiel vient d’une séparation infime de charges au voisinage de la membrane, non d’un cytoplasme entier rempli uniquement de charges négatives. Les gradients de concentration fournissent l’énergie potentielle ; la perméabilité sélective transforme ces gradients en différence de potentiel.

> **Correction de mécanisme.** Le PDF attribue le maintien du déséquilibre uniquement à la pompe Na⁺/K⁺. La pompe entretient les gradients, mais le potentiel instantané dépend surtout des perméabilités relatives et des flux à travers les canaux de fuite.

> **Astuce mémoire :** **K⁺ fuit, la pompe entretient.**
`,
    keyPoint: "Deux électrodes dans des milieux différents mesurent environ −70 mV ; le gradient de K⁺ et les canaux de fuite déterminent l’essentiel du repos, la pompe entretient les gradients.",
    example: "Deux électrodes extracellulaires donnent 0 mV ; dès que l’une traverse la membrane, la mesure devient négative.",
    methodSteps: [
      "Repère la position exacte de chaque électrode avant de lire la valeur.",
      "Écris la convention intérieur moins extérieur.",
      "Relie le signe négatif au flux de K⁺ et aux anions intracellulaires.",
      "Donne à la pompe son rôle durable d’entretien des gradients.",
    ],
    interaction: diagram(
      "Construire le potentiel de repos",
      "Sélectionne chaque mécanisme et relie la mesure à l’organisation de la membrane.",
      "Potentiel de repos ≈ −70 mV",
      "La valeur résulte des gradients ioniques, de la perméabilité sélective et de leur entretien métabolique.",
      [
        { id: "measurement", label: "Mesure", role: "Intérieur − extérieur", detail: "Deux électrodes à la surface donnent 0 mV ; une électrode interne et une externe révèlent environ −70 mV.", group: "Observer" },
        { id: "potassium", label: "K⁺", role: "Gradient sortant", detail: "Le potassium est plus concentré dedans et diffuse par des canaux de fuite, ce qui laisse l’intérieur relativement négatif.", group: "Expliquer" },
        { id: "sodium", label: "Na⁺", role: "Gradient entrant", detail: "Le sodium est plus concentré dehors, mais la membrane au repos lui est beaucoup moins perméable qu’au K⁺.", group: "Expliquer" },
        { id: "pump", label: "Pompe Na⁺/K⁺", role: "3 Na⁺ sortent, 2 K⁺ entrent", detail: "Cette ATPase compense les fuites sur le long terme et empêche la dissipation progressive des gradients.", group: "Entretenir" },
        { id: "anions", label: "Anions intracellulaires", role: "Charges non diffusibles", detail: "Des protéines et autres anions contribuent à la négativité relative près de la face interne.", group: "Expliquer" },
      ],
      "La pompe est indispensable à long terme, mais fermer les canaux de fuite changerait immédiatement le potentiel : perméabilité et pompe n’ont pas le même rôle.",
    ),
    questions: [
      choice("Quelle mesure obtient-on avec deux électrodes placées à la surface du même axone au repos ?", ["0 mV", "+70 mV", "−70 V", "+1 mV"], 0, "Les deux électrodes baignent dans le même milieu extracellulaire.", "Figure A-1 • page 5"),
      choice("Comment calcule-t-on conventionnellement le potentiel de membrane ?", ["extérieur moins intérieur", "intérieur moins extérieur", "somme des deux potentiels", "intérieur multiplié par extérieur"], 1, "$V_m=V_{int}-V_{ext}$.", "Interprétation • page 6"),
      choice("Quel ion est le plus concentré dans le cytoplasme du tableau ?", ["Na⁺", "Cl⁻", "K⁺", "Ca²⁺"], 2, "Le tableau donne une concentration intracellulaire de K⁺ nettement supérieure."),
      choice("Quel transport décrit correctement la pompe Na⁺/K⁺ ?", ["2 Na⁺ sortent et 3 K⁺ entrent", "3 Na⁺ entrent et 2 K⁺ sortent", "1 Na⁺ et 1 K⁺ sortent", "3 Na⁺ sortent et 2 K⁺ entrent"], 3, "La pompe est électrogène et consomme de l’ATP."),
      trueFalse("À −70 mV, tout le cytoplasme est électriquement négatif sans aucun ion positif.", false, "La séparation de charges est très locale et les milieux restent presque électroneutres."),
      choice("Quelle perméabilité domine au repos dans le modèle simplifié ?", ["Celle aux K⁺ par les canaux de fuite", "Celle au glucose", "Celle à l’ADN", "Aucune perméabilité"], 0, "Le flux de K⁺ explique une grande part du potentiel de repos."),
      choice("Quel est le rôle principal durable de la pompe ?", ["Produire chaque potentiel d’action seule", "Maintenir les gradients de Na⁺ et K⁺", "Ouvrir les récepteurs synaptiques", "Détruire la myéline"], 1, "Elle compense les flux ioniques au cours du temps."),
      choice("Pourquoi la mesure devient-elle négative quand une électrode entre dans l’axone ?", ["L’oscilloscope est cassé", "Le milieu extérieur disparaît", "L’intérieur est à un potentiel inférieur à l’extérieur", "Le nerf se contracte"], 2, "La convention intérieur moins extérieur donne une valeur négative."),
      choice("Quelle affirmation est la plus précise ?", ["La pompe explique seule −70 mV", "Les concentrations n’ont aucun rôle", "La membrane est imperméable à tous les ions", "Le repos dépend des gradients et de la perméabilité sélective"], 3, "Les gradients et les conductances ioniques doivent être considérés ensemble."),
      short("Écris l’ordre de grandeur du potentiel de repos indiqué par le PDF, avec son unité.", ["-70 mV", "−70 mV", "moins 70 mV", "-70 millivolts", "−70 millivolts"], "Le document utilise environ −70 mV.", "Figure A-2 • pages 4-6"),
    ],
    corrections: [
      "La pompe Na⁺/K⁺ est présentée comme l’entretien durable des gradients, non comme la cause instantanée unique du potentiel de repos.",
      "Le potentiel est relié à la perméabilité sélective, en particulier aux canaux de fuite du K⁺.",
      "La séparation de charges est localisée au voisinage de la membrane ; les milieux ne cessent pas d’être globalement électroneutres.",
    ],
  },
  {
    id: "action-potential-ionic-phases",
    title: "Lire les phases du potentiel d’action",
    summary: "Associer latence, dépolarisation, repolarisation et hyperpolarisation aux états des canaux Na⁺ et K⁺.",
    pages: "5-7 et 21",
    section: "I-B. Nature du message nerveux — potentiel d’action",
    durationMinutes: 30,
    xp: 65,
    kind: "graph",
    body: String.raw`
## Du stimulus à la réponse électrique

Le tracé monophasique du document commence par un **artéfact de stimulation**, qui marque l’instant où l’appareil stimule. Une **latence** suit : elle dépend notamment du temps de propagation entre le site stimulé et l’électrode d’enregistrement. Ce segment n’est pas une phase ionique du potentiel d’action lui-même.

Quand le seuil est atteint, le potentiel de membrane suit une séquence reproductible :

| Phase | Mécanisme dominant | Effet sur $V_m$ |
|---|---|---|
| dépolarisation | ouverture rapide des canaux Na⁺ voltage-dépendants, entrée de Na⁺ | le potentiel devient moins négatif puis positif |
| repolarisation | inactivation des canaux Na⁺ et ouverture retardée des canaux K⁺ | retour vers les valeurs négatives |
| hyperpolarisation | fermeture lente de certains canaux K⁺ | valeur transitoirement plus négative que le repos |
| retour au repos | fermeture/réinitialisation des canaux et conductances de fuite | stabilisation près du repos |

Le potentiel d’action correspond à une variation brève et locale de $V_m$. Son amplitude n’augmente pas avec l’intensité une fois le seuil franchi : c’est la loi du **tout ou rien** à l’échelle d’une fibre.

## Ce que fait réellement la pompe

La pompe Na⁺/K⁺ maintient les gradients au cours du temps, mais elle n’est pas le mécanisme rapide qui repolarise chaque potentiel d’action. La repolarisation milliseconde par milliseconde résulte surtout de l’**inactivation des canaux Na⁺** et de l’**ouverture des canaux K⁺**.

## Tracé pédagogique original

La courbe interactive redessine un potentiel d’action depuis −70 mV, jusqu’à environ +35 mV, puis une hyperpolarisation proche de −82 mV. Les valeurs sont un modèle cohérent avec la forme de la page 5 ; elles ne prétendent pas numériser les pixels de la source.

$$\Delta V=V_{\mathrm{max}}-V_{\mathrm{repos}}$$

Avec $V_{\mathrm{max}}=+35\ \mathrm{mV}$ et $V_{\mathrm{repos}}=-70\ \mathrm{mV}$, l’amplitude du modèle vaut $105\ \mathrm{mV}$.

> **Astuce mémoire — Na entre, K sort :** Na⁺ lance la montée ; K⁺ ramène la courbe.
`,
    keyPoint: "La dépolarisation vient de l’entrée de Na⁺ ; la repolarisation et l’hyperpolarisation viennent surtout de la sortie de K⁺ et de la cinétique des canaux.",
    example: "Une courbe redescend après son pic alors que les canaux Na⁺ s’inactivent et que les canaux K⁺ s’ouvrent : c’est la repolarisation.",
    methodSteps: [
      "Sépare l’artéfact et la latence de la variation membranaire.",
      "Repère le franchissement du seuil et le pic positif.",
      "Associe la montée au Na⁺ et la descente au K⁺.",
      "Explique l’hyperpolarisation par la fermeture retardée des canaux K⁺.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Enregistrement redessiné",
      title: "Explorer un potentiel d’action monophasique",
      instruction: "Déplace le repère de 0 à 6 ms et nomme la phase correspondant à la valeur observée.",
      formula: "Potentiel de membrane Vₘ(t), en mV",
      formulaTex: "V_m(t)",
      rule: { kind: "samples", points: [[0, -70], [0.8, -70], [1.2, -58], [1.55, -20], [1.9, 35], [2.2, 5], [2.65, -55], [3.1, -82], [3.8, -75], [4.6, -70], [6, -70]] },
      window: { xMin: 0, xMax: 6, yMin: -100, yMax: 50 },
      guides: [
        { kind: "horizontal", value: -70, label: "repos ≈ −70 mV" },
        { kind: "horizontal", value: -55, label: "seuil indicatif" },
      ],
      marker: { min: 0, max: 6, step: 0.1, initial: 1.9 },
      observation: "L’hyperpolarisation n’est pas une seconde stimulation : elle vient de la fermeture retardée des canaux K⁺.",
    },
    questions: [
      choice("Quel événement ionique déclenche la montée rapide du potentiel d’action ?", ["L’entrée de Na⁺", "La sortie de Na⁺", "L’entrée de protéines", "La disparition de l’ATP"], 0, "Les canaux Na⁺ voltage-dépendants s’ouvrent rapidement.", "Interprétation BC • page 7"),
      choice("Quel mécanisme domine la repolarisation ?", ["L’entrée de glucose", "La sortie de K⁺", "L’entrée de Cl⁻ uniquement", "La synthèse d’ADN"], 1, "L’ouverture retardée des canaux K⁺ ramène le potentiel vers des valeurs négatives.", "Interprétation CD • page 7"),
      choice("Pourquoi le potentiel descend-il parfois sous le repos ?", ["Le Na⁺ continue d’entrer", "Le noyau devient positif", "Des canaux K⁺ ferment avec retard", "La myéline disparaît"], 2, "La conductance K⁺ reste temporairement élevée."),
      choice("Que marque l’artéfact de stimulation ?", ["Le maximum du PA", "Le repos définitif", "La synapse inhibitrice", "L’instant de la stimulation par l’appareil"], 3, "Il sert de repère temporel et ne constitue pas une phase du PA."),
      trueFalse("La pompe Na⁺/K⁺ provoque à elle seule la repolarisation rapide de chaque potentiel d’action.", false, "La cinétique des canaux Na⁺ et K⁺ explique l’essentiel de cette phase rapide."),
      choice("Comment se nomme la phase ascendante du tracé ?", ["Dépolarisation", "Hyperpolarisation", "Repos", "Réfractarité relative"], 0, "Le potentiel devient moins négatif puis positif."),
      choice("Que signifie la latence observée avant le PA enregistré ?", ["Le neurone est mort", "Le message met un temps à atteindre l’électrode", "Le K⁺ est absent", "La pompe est bloquée"], 1, "La distance entre stimulation et enregistrement contribue à la latence."),
      choice("Quelle propriété s’applique au PA d’une fibre au-dessus du seuil ?", ["L’amplitude augmente sans limite", "Il disparaît", "Il est d’amplitude stéréotypée", "Il devient un potentiel de repos"], 2, "Une fibre obéit au tout ou rien."),
      choice("Dans le modèle interactif, quelle amplitude sépare −70 mV de +35 mV ?", ["35 mV", "70 mV", "−105 mV", "105 mV"], 3, "$35-(-70)=105$ mV."),
      short("Donne le nom de la phase où le potentiel devient transitoirement plus négatif que le repos.", ["hyperpolarisation", "l’hyperpolarisation", "hyperpolarization"], "Elle suit la repolarisation dans le tracé du document.", "Phase DE • page 7"),
    ],
    corrections: [
      "La repolarisation rapide est attribuée à l’inactivation des canaux Na⁺ et à l’ouverture des canaux K⁺, non à l’action instantanée de la pompe Na⁺/K⁺.",
      "La latence est distinguée des phases membranaires du potentiel d’action.",
      "Le potentiel d’action est présenté comme une variation du potentiel de membrane, plutôt que comme une simple onde de charges négatives.",
    ],
  },
  {
    id: "excitability-rheobase-chronaxie",
    title: "Mesurer l’excitabilité du nerf",
    summary: "Lire une courbe intensité-durée et définir excitation liminaire, rhéobase, temps utile et chronaxie.",
    pages: "7-9 et 22",
    section: "II-A. Réponse du nerf aux stimulations d’intensités et de durées variables",
    durationMinutes: 29,
    xp: 70,
    kind: "graph",
    body: String.raw`
## Une stimulation possède deux dimensions

Une stimulation brève peut être efficace si son intensité est assez forte ; une stimulation plus longue peut déclencher une réponse avec une intensité plus faible. La courbe **intensité-durée** délimite les couples qui atteignent le seuil d’excitation.

| Position par rapport à la courbe | Nom | Réponse attendue |
|---|---|---|
| sur la courbe | stimulation **liminaire** | réponse juste déclenchée |
| sous la courbe | stimulation **infraliminaire** | pas de réponse |
| au-dessus de la courbe | stimulation **supraliminaire** | réponse déclenchée |

Dans le document, l’intensité seuil tend vers environ **1 V** pour les durées longues. Cette valeur est prise comme **rhéobase**. La durée minimale nécessaire quand l’intensité vaut le double de la rhéobase, soit 2 V, est lue à environ **0,6 ms** : c’est la **chronaxie**.

## Définitions à stabiliser

- **Rhéobase** : intensité minimale théorique capable de déclencher une réponse pour une stimulation de durée très longue.
- **Chronaxie** : durée minimale nécessaire avec une intensité égale à deux fois la rhéobase.
- **Temps utile** : dans le vocabulaire du document, durée minimale à la rhéobase pour obtenir une réponse ; la courbe le place vers 1,8 ms.

Plus la chronaxie est courte, plus le tissu est excitable : il atteint son seuil rapidement sous une stimulation de $2I_r$.

## Lire plutôt que réciter

La courbe interactive reprend les valeurs du tableau : $(0{,}3\ \mathrm{ms};3{,}3\ \mathrm{V})$, $(0{,}6;2{,}0)$, $(0{,}9;1{,}5)$, puis un plateau voisin de 1 V. À 0,3 ms, une stimulation de 2 V est sous le seuil ; à 1,2 ms, la même intensité est largement supraliminaire.

> **Correction de précision.** Une courbe réelle approche la rhéobase de manière asymptotique. Le point « 1 V pendant 1,8 ms » est une lecture scolaire du tracé, pas la définition générale de la rhéobase. La chronaxie reste, elle, définie à $2I_r$.

> **Astuce mémoire :** **Rhéo = intensité**, **chronaxie = temps**.
`,
    keyPoint: "La courbe sépare les stimulations inefficaces des efficaces ; la rhéobase vaut environ 1 V et la chronaxie environ 0,6 ms dans le document.",
    example: "À 0,6 ms, le seuil vaut 2 V : 1,5 V est infraliminaire, 2 V liminaire et 2,5 V supraliminaire.",
    methodSteps: [
      "Lis la durée sur l’axe horizontal et l’intensité sur l’axe vertical.",
      "Compare le point proposé à la courbe seuil.",
      "Pour la chronaxie, double d’abord la rhéobase puis lis la durée correspondante.",
      "Présente les valeurs comme des lectures du document, avec leurs unités.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "La limite d’excitation du nerf",
      instruction: "Déplace le repère selon la durée et observe l’intensité minimale correspondante.",
      formula: "Intensité seuil I en fonction de la durée t",
      formulaTex: "I_{\mathrm{seuil}}(t)",
      rule: { kind: "samples", points: [[0.3, 3.3], [0.6, 2], [0.9, 1.5], [1.2, 1.2], [1.5, 1.1], [1.8, 1], [2.1, 1], [2.4, 1]] },
      window: { xMin: 0, xMax: 2.7, yMin: 0, yMax: 3.7 },
      guides: [
        { kind: "horizontal", value: 1, label: "rhéobase ≈ 1 V" },
        { kind: "vertical", value: 0.6, label: "chronaxie ≈ 0,6 ms" },
      ],
      marker: { min: 0.3, max: 2.4, step: 0.1, initial: 0.6 },
      observation: "Quand la durée augmente, l’intensité seuil diminue puis tend vers une limite : prolonger indéfiniment le stimulus ne fait pas descendre le seuil à zéro.",
    },
    questions: [
      choice("Comment nomme-t-on une stimulation située exactement sur la courbe seuil ?", ["Liminaire", "Infraliminaire", "Subliminale au sens psychologique", "Réfractaire"], 0, "Une excitation liminaire déclenche tout juste une réponse.", "Analyse • page 8"),
      choice("Que produit une stimulation située sous la courbe ?", ["Une réponse maximale obligatoire", "Aucune réponse", "Une contraction permanente", "Une synapse nouvelle"], 1, "Elle est infraliminaire.", "Analyse • page 8"),
      choice("Quelle valeur le document retient-il comme rhéobase ?", ["0,3 V", "0,6 V", "Environ 1 V", "3,3 ms"], 2, "Le plateau de la courbe est voisin de 1 V."),
      choice("Quelle durée correspond à la chronaxie du document ?", ["3,3 ms", "2,4 ms", "1,8 ms", "Environ 0,6 ms"], 3, "À 2 V, soit deux fois la rhéobase, la courbe donne environ 0,6 ms."),
      trueFalse("Une stimulation supraliminaire est située au-dessus de la courbe seuil.", true, "Son couple intensité-durée dépasse le minimum nécessaire."),
      choice("Que compare la courbe ?", ["L’intensité et la durée de stimulation", "La température et la masse", "La glycémie et l’âge", "Le diamètre du noyau et le temps"], 0, "Elle montre la compensation entre intensité et durée."),
      choice("À 0,6 ms, une stimulation de 1,5 V est…", ["supraliminaire", "infraliminaire", "exactement liminaire", "une rhéobase"], 1, "Le seuil vaut environ 2 V à cette durée."),
      choice("Quelle grandeur diminue quand l’excitabilité augmente, à protocole comparable ?", ["La quantité d’ADN", "Le nombre de neurones", "La chronaxie", "La taille du corps"], 2, "Une chronaxie courte traduit une réponse obtenue plus rapidement à 2 rhéobases."),
      choice("Quelle définition de la rhéobase est la plus précise ?", ["La durée à 2 V", "Le point le plus haut de la courbe", "Toute intensité efficace", "L’intensité minimale pour une durée très longue"], 3, "La rhéobase est la limite d’intensité lorsque la durée devient grande."),
      short("Calcule deux fois la rhéobase du document.", ["2 V", "2V", "deux volts", "2 volts"], "Deux fois 1 V donne 2 V, intensité utilisée pour lire la chronaxie.", "Tableau • page 8"),
    ],
    corrections: [
      "La rhéobase est définie comme une limite pour une stimulation très longue ; le point 1 V à 1,8 ms reste une lecture scolaire du tracé.",
      "Les axes et les unités intensité en volts, durée en millisecondes sont explicités avant toute conclusion.",
      "La zone sous la courbe est bien distinguée de la zone au-dessus, conformément à l’orientation des axes du document.",
    ],
  },
  {
    id: "all-or-none-nerve-recruitment",
    title: "Distinguer tout ou rien et recrutement",
    summary: "Comparer la réponse d’une fibre isolée au potentiel d’action composé d’un nerf entier lorsque l’intensité augmente.",
    pages: "9-10 et 23",
    section: "II-B. Réponses aux stimulations d’intensités croissantes",
    durationMinutes: 28,
    xp: 75,
    kind: "practice",
    body: String.raw`
## Une fibre : une réponse stéréotypée

Sous le seuil, une fibre isolée ne produit pas de potentiel d’action. Dès que le seuil est franchi, elle produit un potentiel d’action d’amplitude pratiquement constante. Une intensité plus forte ne rend pas ce potentiel d’action individuel « plus grand » : la fibre obéit à la loi du **tout ou rien**.

Ce principe repose sur une boucle régénérative : l’ouverture de canaux Na⁺ dépolarise la membrane, ce qui ouvre davantage de canaux jusqu’à la réponse complète. Si le seuil n’est pas atteint, cette boucle ne s’amorce pas.

## Un nerf : plusieurs seuils additionnés

Un nerf contient de nombreuses fibres de diamètres, de myélinisation et de seuils différents. L’enregistrement extracellulaire du nerf entier est un **potentiel d’action composé** : il additionne les contributions des fibres recrutées.

| Intensité | Fibre isolée | Nerf entier |
|---|---|---|
| sous le seuil minimal | aucune réponse | aucune réponse |
| juste au premier seuil | PA complet de la fibre | petite réponse composée |
| intensité croissante | même amplitude pour cette fibre | amplitude croissante : nouvelles fibres recrutées |
| tous les seuils dépassés | réponse toujours stéréotypée | plateau : toutes les fibres accessibles sont recrutées |

Le document nomme cette croissance « loi de sommation ». Il s’agit ici surtout d’une **sommation spatiale par recrutement** de fibres différentes, et non de plusieurs potentiels d’action qui s’empileraient dans une même fibre.

## Coder l’intensité d’un stimulus

Dans l’organisme, l’intensité d’une stimulation peut être codée par la **fréquence** des potentiels d’action et par le **nombre de fibres recrutées**, pas par l’amplitude d’un potentiel d’action individuel.

> **Correction de vocabulaire.** Le tracé du nerf est un potentiel d’action composé. Dire seulement « le nerf obéit à la sommation » peut faire croire que chaque PA grossit ; l’augmentation vient principalement du recrutement progressif de fibres aux seuils différents.

> **Astuce mémoire :** **une fibre = tout ou rien ; un nerf = de plus en plus de fibres.**
`,
    keyPoint: "Une fibre produit un PA stéréotypé au-dessus du seuil ; l’amplitude du signal d’un nerf augmente parce que des fibres supplémentaires sont recrutées.",
    example: "Entre I₂ et I₄, le signal du nerf passe d’environ 20 à 30 mV tandis que le PA de la fibre testée reste de même amplitude.",
    methodSteps: [
      "Identifie si le tracé vient d’une fibre isolée ou d’un nerf entier.",
      "Repère la première intensité efficace et le plateau final.",
      "Pour la fibre, applique le tout ou rien.",
      "Pour le nerf, explique l’augmentation par le recrutement de fibres aux seuils différents.",
    ],
    interaction: diagram(
      "Deux réponses à ne pas confondre",
      "Ouvre les cartes de gauche à droite pour suivre l’effet d’une intensité croissante.",
      "Stimulation d’intensité croissante",
      "Le même protocole produit deux lectures différentes selon que l’on enregistre une fibre ou tout un nerf.",
      [
        { id: "fiber-below", label: "Fibre sous le seuil", role: "Aucun PA", detail: "La dépolarisation reste insuffisante pour déclencher la boucle des canaux Na⁺.", group: "Fibre isolée" },
        { id: "fiber-above", label: "Fibre au-dessus du seuil", role: "PA complet", detail: "Le potentiel d’action atteint immédiatement son amplitude stéréotypée : tout ou rien.", group: "Fibre isolée" },
        { id: "nerve-first", label: "Nerf au premier seuil", role: "Petite réponse", detail: "Seules les fibres les plus excitables répondent ; leurs signaux composent une petite amplitude.", group: "Nerf entier" },
        { id: "nerve-recruitment", label: "Nerf : intensité augmente", role: "Recrutement", detail: "Des fibres de seuil plus élevé sont activées et s’ajoutent au potentiel d’action composé.", group: "Nerf entier" },
        { id: "nerve-plateau", label: "Nerf au plateau", role: "Toutes les fibres recrutées", detail: "Augmenter encore l’intensité ne fait plus croître le signal composé dans les conditions du montage.", group: "Nerf entier" },
      ],
      "L’amplitude croissante du nerf ne contredit pas le tout ou rien : elle additionne plusieurs fibres, chacune répondant selon le tout ou rien.",
    ),
    questions: [
      choice("Quelle loi décrit la réponse d’une fibre isolée au-dessus du seuil ?", ["La loi du tout ou rien", "La loi de dilution", "La loi de réflexion", "La loi des gaz parfaits"], 0, "L’amplitude du PA individuel est stéréotypée.", "Interprétation • pages 9-10"),
      choice("Pourquoi l’amplitude enregistrée sur un nerf augmente-t-elle avec l’intensité ?", ["Chaque PA devient infiniment grand", "Davantage de fibres sont recrutées", "Le nerf gagne des noyaux", "La myéline fond"], 1, "Les fibres du nerf ont des seuils différents."),
      choice("Comment nomme-t-on le signal extracellulaire du nerf entier ?", ["Potentiel de repos unique", "PPSI", "Potentiel d’action composé", "Courant hormonal"], 2, "Il additionne les contributions temporelles de nombreuses fibres."),
      choice("Que signifie le plateau final de la réponse du nerf ?", ["Aucune fibre ne répond", "Une seule fibre répond", "Le seuil n’a pas été atteint", "Toutes les fibres recrutables répondent"], 3, "Il ne reste plus de nouvelle population de fibres à recruter dans le montage."),
      trueFalse("Un stimulus plus intense augmente fortement l’amplitude du PA individuel d’une même fibre.", false, "Au-dessus du seuil, l’amplitude du PA de la fibre reste pratiquement constante."),
      choice("Sous le seuil d’une fibre, qu’observe-t-on ?", ["Aucun potentiel d’action propagé", "Un PA deux fois plus petit", "Un PA permanent", "Une synapse nouvelle"], 0, "La réponse régénérative ne démarre pas."),
      choice("Quel mécanisme code notamment une stimulation plus forte dans un nerf ?", ["Une amplitude infinie de chaque PA", "Le recrutement de fibres supplémentaires", "La disparition du seuil", "La fermeture de tous les canaux"], 1, "Le nombre de fibres activées peut augmenter."),
      choice("Dans le PDF, l’amplitude composée du nerf passe approximativement de…", ["0 à 1 V", "−70 à +70 V", "20 à 30 mV", "3 à 3000 A"], 2, "Les valeurs indiquées sont environ 20 puis 30 mV."),
      choice("Quelle distinction résout l’apparente contradiction entre les deux tracés ?", ["Un nerf n’a pas de fibres", "Une fibre ne conduit pas", "Le seuil dépend de la couleur", "Le nerf additionne plusieurs fibres, la fibre suit le tout ou rien"], 3, "Les niveaux d’organisation sont différents."),
      short("Complète : l’activation progressive de nouvelles fibres s’appelle le…", ["recrutement", "recrutement progressif", "recrutement des fibres"], "Le recrutement explique la croissance du potentiel d’action composé.", "Interprétation • page 10"),
    ],
    corrections: [
      "La réponse du nerf est nommée potentiel d’action composé et son augmentation est reliée au recrutement progressif de fibres.",
      "La sommation du document est distinguée de la sommation temporelle des potentiels postsynaptiques.",
      "Le codage d’intensité est complété par la fréquence des PA et le nombre de fibres actives, non par l’amplitude du PA individuel.",
    ],
  },
  {
    id: "refractory-period-propagation-direction",
    title: "Relier réfractarité et sens de propagation",
    summary: "Interpréter deux stimulations successives, distinguer périodes absolue et relative, puis raisonner sur le sens du message.",
    pages: "10-12 et 23",
    section: "II-C-D. Périodes réfractaires et sens de propagation",
    durationMinutes: 30,
    xp: 80,
    kind: "practice",
    body: String.raw`
## Deux stimulations successives

Le document applique deux stimulations efficaces identiques en faisant varier leur intervalle. Quand elles sont très rapprochées, la seconde ne déclenche aucune réponse. À mesure que l’intervalle augmente, la seconde réponse réapparaît progressivement puis retrouve l’amplitude de la première.

| Période | État principal des canaux | Conséquence |
|---|---|---|
| réfractaire **absolue** | une grande partie des canaux Na⁺ est inactivée | aucun second PA, même avec une forte stimulation |
| réfractaire **relative** | une partie des canaux Na⁺ a récupéré, conductance K⁺ encore élevée | un stimulus plus fort peut déclencher un PA |
| récupération complète | canaux réinitialisés, membrane proche du repos | réponse normale |

La pompe Na⁺/K⁺ entretient les gradients, mais elle n’explique pas à elle seule la durée de quelques millisecondes des périodes réfractaires. Cette durée vient surtout des changements de conformation des canaux voltage-dépendants.

## Pourquoi l’onde avance-t-elle ?

Dans une fibre isolée stimulée artificiellement au milieu, un potentiel d’action peut partir dans **les deux directions**, parce que les deux régions voisines sont au repos et excitables.

Dans un circuit vivant, la propagation est généralement orientée : le potentiel d’action naît dans une zone gâchette puis gagne les terminaisons axonales. La zone juste derrière le front est réfractaire, ce qui empêche le retour immédiat de l’onde.

La formule scolaire « dendrites → corps cellulaire → axone → arborisation » décrit bien beaucoup de neurones multipolaires, mais pas toute l’anatomie. Dans un neurone sensitif pseudounipolaire, le message se propage de la terminaison réceptrice vers la branche centrale sans traverser fonctionnellement le soma.

## Deux sens différents à mémoriser

- **sur un axone isolé stimulé au milieu** : deux directions possibles ;
- **à travers une synapse chimique** : un seul sens, du présynaptique vers le postsynaptique ;
- **dans un neurone en fonctionnement** : de la zone de déclenchement vers les terminaisons.

> **Correction de la source.** La période absolue est due à l’inactivation des canaux Na⁺, non à une pompe qui n’aurait pas eu le temps de replacer tous les ions. Le sens physiologique n’est pas une règle morphologique universelle passant toujours par les dendrites et le soma.

> **Astuce mémoire :** **A = aucun second PA ; R = réponse possible mais plus difficile.**
`,
    keyPoint: "L’inactivation des canaux Na⁺ crée la période absolue ; la récupération partielle et la conductance K⁺ créent la période relative, ce qui favorise une propagation vers l’avant.",
    example: "Si le second stimulus ne produit rien, l’axone est en période absolue ; s’il faut un stimulus plus fort, il est en période relative.",
    methodSteps: [
      "Compare l’amplitude de la deuxième réponse à celle de la première.",
      "Associe absence totale à la période absolue et récupération progressive à la relative.",
      "Relie la période absolue à l’inactivation des canaux Na⁺.",
      "Précise toujours si tu parles d’un axone isolé, d’un neurone vivant ou d’une synapse.",
    ],
    interaction: timeline(
      "De la période absolue à la récupération",
      "Parcours la frise puis explique pourquoi le front de dépolarisation ne repart pas immédiatement en arrière.",
      [
        { label: "Premier potentiel d’action", shortLabel: "PA 1", detail: "Les canaux Na⁺ s’ouvrent puis s’inactivent ; les canaux K⁺ s’ouvrent avec retard." },
        { label: "Période réfractaire absolue", shortLabel: "Absolue", detail: "Trop de canaux Na⁺ sont inactivés : aucun second PA ne peut naître." },
        { label: "Période réfractaire relative", shortLabel: "Relative", detail: "Des canaux Na⁺ ont récupéré mais la membrane reste moins excitable ; un stimulus plus intense peut réussir." },
        { label: "Récupération complète", shortLabel: "Repos", detail: "Les canaux ont retrouvé leur état activable et la réponse au second stimulus redevient normale." },
        { label: "Propagation orientée", shortLabel: "Avant", detail: "La région derrière le front est réfractaire tandis que la région devant est encore excitable." },
      ],
      "La réfractarité explique à la fois l’impossibilité de sommer immédiatement deux PA dans une fibre et l’avancée ordonnée du front de dépolarisation.",
    ),
    questions: [
      choice("Quel état des canaux explique surtout la période réfractaire absolue ?", ["L’inactivation des canaux Na⁺", "L’ouverture des récepteurs hormonaux", "La synthèse de myéline", "La fermeture des vaisseaux"], 0, "Un canal Na⁺ inactivé ne peut pas se rouvrir immédiatement.", "Interprétation • page 11"),
      choice("Que faut-il souvent pendant la période réfractaire relative ?", ["Aucun stimulus ne peut agir", "Un stimulus plus intense", "Une nouvelle cellule", "Une température nulle"], 1, "L’excitabilité est réduite mais non abolie."),
      choice("Que montre une seconde réponse qui retrouve progressivement son amplitude ?", ["Une destruction du nerf", "Un repos permanent", "Une récupération de l’excitabilité", "Une absence de canaux"], 2, "Le délai permet aux canaux de revenir vers leur état activable."),
      choice("Dans une fibre isolée stimulée au milieu, l’influx peut se propager…", ["uniquement vers le soma", "uniquement vers le muscle", "sans aucune direction", "dans les deux directions"], 3, "Les deux régions voisines sont initialement excitables."),
      trueFalse("La pompe Na⁺/K⁺ suffit à expliquer la période réfractaire absolue milliseconde par milliseconde.", false, "L’inactivation des canaux Na⁺ est le mécanisme direct essentiel."),
      choice("Quelle région empêche le front du PA de repartir immédiatement en arrière ?", ["La région réfractaire située derrière lui", "La fente synaptique devant lui", "Le noyau d’une autre cellule", "Le sang"], 0, "La membrane récemment activée n’est pas immédiatement réexcitable."),
      choice("À travers une synapse chimique, le message va…", ["dans les deux sens", "du présynaptique vers le postsynaptique", "du postsynaptique vers les vésicules", "au hasard"], 1, "Les vésicules et les récepteurs sont répartis de façon asymétrique."),
      choice("Quel neurone constitue une exception au trajet simplifié passant fonctionnellement par le soma ?", ["Le globule rouge", "Le myocyte", "Le neurone sensitif pseudounipolaire", "Le fibroblaste"], 2, "Son prolongement périphérique rejoint directement la branche centrale."),
      choice("Que signifie PRA dans le contexte de la leçon ?", ["Pompe de repos active", "Potentiel rapide axonal", "Propagation réversible absolue", "Période réfractaire absolue"], 3, "C’est l’intervalle où aucun second PA ne peut être déclenché."),
      short("Complète : pendant la période relative, une partie des canaux Na⁺ a déjà…", ["récupéré", "recupere", "récupérée", "retrouvé un état activable"], "La récupération partielle rend une nouvelle réponse possible sous stimulation plus forte.", "Interprétation • page 11"),
    ],
    corrections: [
      "La période réfractaire absolue est reliée à l’inactivation des canaux Na⁺, et la relative à leur récupération partielle avec une conductance K⁺ encore élevée.",
      "Le rôle de la pompe Na⁺/K⁺ est replacé dans l’entretien des gradients plutôt que dans la réinitialisation instantanée des canaux.",
      "Le trajet dendrites-soma-axone est présenté comme un modèle fréquent, avec l’exception fonctionnelle des neurones sensitifs pseudounipolaires.",
    ],
  },
  {
    id: "conduction-speed-myelination",
    title: "Comparer les vitesses de conduction",
    summary: "Relier vitesse, diamètre, myéline et température, puis calculer une vitesse à partir de deux enregistrements.",
    pages: "12-14 et 24-25",
    section: "II-E. Vitesse de conduction de l’influx nerveux",
    durationMinutes: 31,
    xp: 90,
    kind: "graph",
    body: String.raw`
## Deux modes de propagation

Dans une fibre **amyélinisée**, chaque portion voisine de membrane doit être dépolarisée successivement. Les courants locaux avancent de proche en proche : la conduction est dite **continue**.

Dans une fibre **myélinisée**, la gaine limite les fuites de courant entre deux nœuds de Ranvier. Le potentiel d’action est régénéré surtout aux nœuds, riches en canaux voltage-dépendants. Le courant se propage rapidement sous la myéline jusqu’au nœud suivant : la conduction est dite **saltatoire**.

> Le potentiel d’action ne « saute » pas dans le vide : le courant se propage sous la gaine et le signal est régénéré à chaque nœud.

## Les facteurs comparés dans le tableau

| Fibre | Diamètre | Température | Vitesse |
|---|---:|---:|---:|
| grenouille myélinisée | 10 µm | 20 °C | 17 m·s⁻¹ |
| grenouille myélinisée | 20 µm | 20 °C | 30 m·s⁻¹ |
| grenouille myélinisée | 20 µm | 30 °C | 60 à 80 m·s⁻¹ |
| mammifère myélinisée | 20 µm | 37 °C | 120 m·s⁻¹ |
| axone géant de calmar amyélinisé | 1 000 µm | 23 °C | 33 m·s⁻¹ |

À nature et température comparables, un diamètre plus grand réduit la résistance interne et augmente la vitesse. À diamètre et espèce comparables, une hausse modérée de température accélère la cinétique des canaux. Mais cette relation n’est valable que dans une plage physiologique : un froid important ralentit, une chaleur excessive altère les protéines et ne peut pas augmenter indéfiniment la vitesse.

Le contraste le plus parlant est le calmar : malgré un axone de **1 000 µm**, sa fibre amyélinisée ne dépasse qu’environ 33 m·s⁻¹, alors qu’une fibre myélinisée de mammifère de 20 µm atteint 120 m·s⁻¹.

## Calculer la vitesse sans utiliser le délai de stimulation

Deux électrodes enregistrent le même potentiel d’action à des distances différentes. On soustrait les distances et les latences :

$$v=\frac{\Delta d}{\Delta t}=\frac{d_2-d_1}{t_2-t_1}$$

Cette différence élimine les délais communs du stimulateur et de l’appareil. Si $d_2-d_1=0{,}12\ \mathrm{m}$ et $t_2-t_1=2\ \mathrm{ms}=0{,}002\ \mathrm{s}$, alors $v=60\ \mathrm{m\,s^{-1}}$.

> **Correction de précision.** La température n’est pas un accélérateur illimité et les espèces du tableau ne doivent pas être comparées comme si tous les autres paramètres étaient identiques.
`,
    keyPoint: "La myéline permet une conduction saltatoire rapide ; le diamètre et une température physiologique favorable augmentent aussi la vitesse, calculée par Δd/Δt.",
    example: "Un décalage de 2 ms sur 12 cm donne $0{,}12/0{,}002=60\ \mathrm{m\,s^{-1}}$.",
    methodSteps: [
      "Compare une seule variable à la fois dans le tableau.",
      "Distingue conduction continue et saltatoire.",
      "Soustrais les deux distances et les deux temps d’arrivée.",
      "Convertis millisecondes en secondes avant de calculer la vitesse.",
    ],
    interaction: diagram(
      "Pourquoi la myéline accélère-t-elle ?",
      "Compare le trajet du courant dans une fibre amyélinisée et dans une fibre myélinisée.",
      "Propagation du potentiel d’action",
      "Le courant local dépolarise la région suivante ; la myéline change l’espacement des zones où le PA doit être régénéré.",
      [
        { id: "continuous", label: "Fibre amyélinisée", role: "Conduction continue", detail: "Chaque segment voisin de membrane doit ouvrir ses canaux et régénérer le potentiel d’action.", group: "Mode" },
        { id: "myelin", label: "Segment myélinisé", role: "Isolation électrique", detail: "La gaine augmente la résistance membranaire et réduit les pertes de courant sur l’internœud.", group: "Mode" },
        { id: "node", label: "Nœud de Ranvier", role: "Régénération du PA", detail: "La forte densité de canaux Na⁺ permet au potentiel d’action d’être renouvelé au nœud suivant.", group: "Mode" },
        { id: "diameter", label: "Diamètre", role: "Résistance interne plus faible", detail: "Un axone plus large conduit plus vite à myélinisation et température comparables.", group: "Facteurs" },
        { id: "temperature", label: "Température", role: "Cinétique des canaux", detail: "Dans une plage physiologique, une température plus élevée accélère les réactions et la cinétique des canaux.", group: "Facteurs" },
        { id: "calculation", label: "Deux électrodes", role: "v = Δd/Δt", detail: "La différence des latences correspond au temps nécessaire pour parcourir la distance séparant les sites d’enregistrement.", group: "Mesure" },
      ],
      "Un axone géant amyélinisé reste plus lent qu’une fibre myélinisée beaucoup plus fine : la myéline est un avantage majeur, pas un simple détail anatomique.",
    ),
    questions: [
      choice("Comment se nomme la conduction d’une fibre myélinisée ?", ["Saltatoire", "Digestive", "Osmotique", "Hormono-dépendante"], 0, "Le PA est régénéré de nœud en nœud.", "Interprétation • page 13"),
      choice("Où le potentiel d’action est-il surtout régénéré dans une fibre myélinisée ?", ["Sous toute la gaine au même instant", "Aux nœuds de Ranvier", "Dans l’épinèvre", "Dans le sang"], 1, "Les nœuds concentrent les canaux voltage-dépendants."),
      choice("À nature et température identiques, quel changement tend à accélérer la conduction ?", ["Une diminution de l’ATP à zéro", "La disparition des canaux", "Une augmentation du diamètre", "Une rupture de l’axone"], 2, "Le diamètre plus grand réduit la résistance axiale."),
      choice("Quelle vitesse donne le tableau pour la fibre myélinisée de mammifère à 37 °C ?", ["17 m·s⁻¹", "30 m·s⁻¹", "33 m·s⁻¹", "120 m·s⁻¹"], 3, "C’est la valeur la plus élevée du tableau."),
      trueFalse("Dans une fibre myélinisée, le courant disparaît entre deux nœuds et réapparaît sans propagation.", false, "Le courant se propage sous la gaine ; seul le PA est régénéré préférentiellement aux nœuds."),
      choice("Quelle formule calcule la vitesse avec deux enregistrements ?", ["$v=(d_2-d_1)/(t_2-t_1)$", "$v=(t_2-t_1)/(d_2-d_1)$", "$v=d_1+t_1$", "$v=d_2t_2$"], 0, "La vitesse est une distance divisée par un temps."),
      choice("Que vaut 2 ms en secondes ?", ["2 s", "0,002 s", "0,02 s", "0,00002 s"], 1, "Une milliseconde vaut un millième de seconde."),
      choice("Pourquoi le calmar a-t-il un axone géant ?", ["Pour fabriquer de la myéline centrale", "Pour arrêter tout signal", "Le grand diamètre compense partiellement l’absence de myéline", "Pour produire des hormones"], 2, "Un diamètre de 1 000 µm permet tout de même environ 33 m·s⁻¹."),
      choice("Quelle affirmation sur la température est correcte ?", ["Plus chaud est toujours mieux sans limite", "Elle n’a aucun effet", "37 °C convient à toutes les espèces", "Elle accélère dans une plage physiologique mais l’excès devient nocif"], 3, "Les enzymes et canaux ont une plage de fonctionnement."),
      short("Calcule la vitesse pour 0,12 m parcouru en 0,002 s.", ["60 m/s", "60 m·s⁻¹", "60 m.s-1", "60"], "$0{,}12/0{,}002=60$ m·s⁻¹.", "Calcul • page 13"),
    ],
    corrections: [
      "La conduction saltatoire est décrite comme propagation du courant sous la myéline puis régénération du PA aux nœuds, et non comme un saut sans continuité physique.",
      "L’effet de la température est limité à une plage physiologique ; une température excessive n’accélère pas indéfiniment la conduction.",
      "Les comparaisons entre espèces du tableau sont interprétées avec prudence, plusieurs variables changeant simultanément.",
    ],
  },
  {
    id: "synapse-types-motor-endplate",
    title: "Identifier les synapses et la plaque motrice",
    summary: "Nommer les contacts axo-dendritique, axo-somatique, axo-axonique et explorer l’ultrastructure d’une jonction neuromusculaire.",
    pages: "14-16 et 25-26",
    section: "III-A. Zones de contact entre structures cellulaires",
    durationMinutes: 29,
    xp: 100,
    body: String.raw`
## Nommer une synapse par ses deux partenaires

Une **synapse** est une zone de communication spécialisée. Son nom indique d’abord la partie du neurone présynaptique, généralement l’axone, puis la cible postsynaptique.

| Contact | Nom | Effet possible |
|---|---|---|
| axone → dendrite | axo-dendritique | modifier l’intégration d’une dendrite |
| axone → soma | axo-somatique | agir près de la zone de déclenchement |
| axone → axone | axo-axonique | moduler la libération présynaptique |
| motoneurone → fibre musculaire | jonction neuromusculaire ou **plaque motrice** | déclencher un potentiel d’action musculaire |

Une synapse chimique comporte un **élément présynaptique**, une **fente synaptique** et un **élément postsynaptique**. Les vésicules sont concentrées dans le bouton présynaptique ; les récepteurs sont concentrés sur la membrane postsynaptique. Cette asymétrie impose le sens de transmission.

## Lire une plaque motrice

Le bouton du motoneurone contient des vésicules d’**acétylcholine** et des mitochondries. Sa membrane possède des canaux Ca²⁺ voltage-dépendants. En face, la membrane de la fibre musculaire forme des replis jonctionnels portant des récepteurs nicotiniques à l’acétylcholine.

L’électronographie du PDF montre des vésicules seulement du côté présynaptique. Elle ne montre pas une fusion permanente des deux cellules : la fente les sépare toujours.

## Synapse, jonction, plaque : le bon niveau de précision

« Plaque motrice » peut désigner la région spécialisée de la fibre musculaire au contact de la terminaison, tandis que « jonction neuromusculaire » désigne l’ensemble du dispositif. Au niveau scolaire, les deux expressions sont souvent utilisées comme équivalentes ; il faut néanmoins savoir identifier les trois compartiments.

> **Correction de vocabulaire.** Les récepteurs postsynaptiques ne sont pas simplement des « récepteurs à Na⁺ ». Ce sont des récepteurs du neurotransmetteur couplés à un canal ionique ; à la plaque motrice, le récepteur nicotinique laisse passer plusieurs cations et le courant net dépolarise la membrane.

> **Astuce mémoire :** **pré = produit et libère ; post = porte les récepteurs.**
`,
    keyPoint: "Une synapse chimique associe bouton présynaptique, fente et membrane postsynaptique ; à la plaque motrice, le motoneurone libère l’acétylcholine vers la fibre musculaire.",
    example: "Un contact axone-dendrite est axo-dendritique ; un contact motoneurone-muscle est une jonction neuromusculaire.",
    methodSteps: [
      "Identifie la structure présynaptique puis la cible postsynaptique.",
      "Nomme la synapse avec ces deux éléments.",
      "Repère les vésicules, la fente et les récepteurs.",
      "Déduis le sens à partir de l’asymétrie du dispositif.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Explorer une jonction neuromusculaire",
      instruction: "Sélectionne les sept repères, du bouton du motoneurone à la fibre musculaire.",
      viewBox: "0 0 700 430",
      caption: "Représentation pédagogique originale fondée sur les éléments visibles aux pages 14-16 et 26 ; aucune figure scannée n’est réutilisée.",
      shapes: motorSynapseShapes,
      hotspots: motorSynapseHotspots,
      observation: "Vésicules d’un côté et récepteurs de l’autre : la structure même de la synapse impose une transmission présynaptique vers postsynaptique.",
    },
    questions: [
      choice("Comment se nomme un contact axone-dendrite ?", ["Axo-dendritique", "Axo-somatique", "Neuro-musculaire", "Dendro-dendritique obligatoire"], 0, "Le premier terme est l’axone présynaptique, le second la dendrite cible.", "Analyse • page 15"),
      choice("Quel nom porte le contact entre un motoneurone et une fibre musculaire ?", ["Nœud de Ranvier", "Jonction neuromusculaire", "Périnèvre", "Fuseau mitotique"], 1, "On l’appelle aussi plaque motrice.", "Figure 2 • page 15"),
      choice("Où se trouvent les vésicules synaptiques ?", ["Dans la fente", "Dans la fibre musculaire seulement", "Dans l’élément présynaptique", "Dans l’épinèvre"], 2, "Elles stockent le neurotransmetteur dans le bouton."),
      choice("Quel élément sépare les deux membranes ?", ["Le soma", "La myéline", "Le périnèvre", "La fente synaptique"], 3, "La fente est l’espace extracellulaire franchi par le neurotransmetteur."),
      trueFalse("Les deux cellules d’une synapse chimique fusionnent en permanence.", false, "Leurs membranes restent séparées par une fente."),
      choice("Quel neurotransmetteur agit normalement à la plaque motrice ?", ["L’acétylcholine", "L’hémoglobine", "L’insuline", "Le collagène"], 0, "Les vésicules du motoneurone contiennent de l’ACh."),
      choice("Quel canal s’ouvre dans le bouton à l’arrivée du PA ?", ["Un canal à ADN", "Un canal Ca²⁺ voltage-dépendant", "Un canal à glucose", "Un canal de l’épinèvre"], 1, "L’entrée de Ca²⁺ déclenche l’exocytose."),
      choice("Quel contact est axo-axonique ?", ["Dendrite vers muscle", "Soma vers axone", "Axone vers axone", "Nerf vers vaisseau"], 2, "Le bouton présynaptique cible un autre axone."),
      choice("Pourquoi la transmission est-elle orientée ?", ["Les deux côtés sont identiques", "La fente est fermée", "Le muscle contient les vésicules", "Vésicules et récepteurs sont répartis asymétriquement"], 3, "Le pré libère et le post reçoit."),
      short("Écris l’abréviation usuelle de l’acétylcholine.", ["ACh", "ACH", "Ach", "ach"], "ACh est le neurotransmetteur de la jonction neuromusculaire.", "Interprétation • page 16"),
    ],
    corrections: [
      "Les récepteurs postsynaptiques sont décrits comme récepteurs du neurotransmetteur couplés à des canaux, et non comme de simples récepteurs au Na⁺.",
      "La plaque motrice est distinguée, lorsque nécessaire, de l’ensemble de la jonction neuromusculaire.",
      "La présence de vésicules exclusivement présynaptiques est utilisée comme preuve structurale du sens de transmission.",
    ],
  },
  {
    id: "chemical-synaptic-transmission",
    title: "Ordonner la transmission synaptique",
    summary: "Dérouler les étapes de l’arrivée du PA à l’arrêt du message et distinguer PPSE, PPSI et potentiel d’action.",
    pages: "15-16, 18-19, 26-27",
    section: "III-B. Passage de l’influx à travers une synapse et exercices 1-2",
    durationMinutes: 32,
    xp: 110,
    kind: "practice",
    body: String.raw`
## De l’électricité au chimique, puis de nouveau à l’électricité

La transmission d’une synapse chimique suit une séquence orientée :

1. le potentiel d’action arrive au bouton présynaptique ;
2. les canaux Ca²⁺ voltage-dépendants s’ouvrent et le Ca²⁺ entre ;
3. les vésicules fusionnent avec la membrane par **exocytose** ;
4. le neurotransmetteur diffuse dans la fente ;
5. il se fixe sur des récepteurs postsynaptiques spécifiques ;
6. des canaux ioniques s’ouvrent et créent un **potentiel postsynaptique** ;
7. le transmetteur est éliminé par hydrolyse, diffusion ou recapture selon la synapse ;
8. les constituants utiles sont recyclés.

À la plaque motrice, l’acétylcholine ouvre des récepteurs-canaux cationiques. Le courant net entrant dépolarise la membrane. Si le seuil est atteint, un potentiel d’action musculaire naît. L’**acétylcholinestérase** hydrolyse ensuite l’ACh en choline et acétate ; c’est surtout la **choline** qui est recaptée pour la resynthèse.

## PPSE et PPSI

Un **PPSE** déplace le potentiel vers le seuil. Une entrée nette de cations, notamment Na⁺, peut le produire. Un **PPSI** éloigne du seuil ou stabilise la membrane : une entrée de Cl⁻, une sortie de K⁺ ou une conductance de shunt peut y contribuer.

| Signal | Propriété | Se propage sans décroître ? |
|---|---|---|
| PPSE/PPSI | local, gradué, sommable | non |
| potentiel d’action | tout ou rien après seuil | oui, le long de l’axone |

La membrane postsynaptique additionne des centaines de PPSE et PPSI dans le temps et dans l’espace. Le potentiel d’action n’apparaît que si la somme atteint le seuil à la zone gâchette.

## Les exercices du document

L’exercice 1 oppose fibre myélinisée/amyélinisée, conduction saltatoire/continue, tout ou rien/recrutement et sens physiologique. L’exercice 2 demande l’ordre des lettres : arrivée du PA (**g**), entrée du Ca²⁺ (**c**), exocytose (**a**), fixation (**d**), entrée de Na⁺ (**b**), dépolarisation (**f**), naissance du PA postsynaptique (**e**).

$$g\rightarrow c\rightarrow a\rightarrow d\rightarrow b\rightarrow f\rightarrow e$$

> **Correction de la source.** Le PDF parle de « recapture du neurotransmetteur » après hydrolyse de l’ACh : à la plaque motrice, la molécule intacte est hydrolysée et la choline est recaptée. Un PPSI n’exige pas toujours une hyperpolarisation visible ; un shunt peut aussi réduire l’excitabilité.
`,
    keyPoint: "PA présynaptique → Ca²⁺ → exocytose → récepteur → PPS ; l’ACh est hydrolysée, et la somme des PPSE/PPSI décide si un nouveau PA naît.",
    example: "Dans l’exercice 2, la suite correcte commence g-c-a : arrivée du PA, entrée de Ca²⁺, puis exocytose.",
    methodSteps: [
      "Pars toujours du potentiel d’action présynaptique.",
      "Place l’entrée de Ca²⁺ avant l’exocytose.",
      "Place la fixation au récepteur avant le mouvement ionique postsynaptique.",
      "Termine par l’arrêt du signal et distingue PPS local de PA propagé.",
    ],
    interaction: timeline(
      "Les huit temps d’une synapse chimique",
      "Avance de l’arrivée du PA au recyclage et repère le passage électrique-chimique-électrique.",
      [
        { label: "1. Potentiel d’action", shortLabel: "PA", detail: "Le PA atteint le bouton présynaptique et dépolarise sa membrane." },
        { label: "2. Entrée de Ca²⁺", shortLabel: "Ca²⁺", detail: "Des canaux calciques voltage-dépendants s’ouvrent ; le calcium entre selon son gradient électrochimique." },
        { label: "3. Exocytose", shortLabel: "Libérer", detail: "Le Ca²⁺ déclenche la fusion des vésicules et la libération du neurotransmetteur." },
        { label: "4. Diffusion", shortLabel: "Fente", detail: "Le neurotransmetteur traverse la très courte fente synaptique." },
        { label: "5. Récepteurs", shortLabel: "Fixer", detail: "La molécule se fixe à des récepteurs spécifiques de la membrane postsynaptique." },
        { label: "6. Potentiel postsynaptique", shortLabel: "PPS", detail: "Les conductances ioniques changent et produisent un PPSE ou un PPSI local et gradué." },
        { label: "7. Fin du message", shortLabel: "Arrêter", detail: "Hydrolyse, recapture ou diffusion réduisent la concentration du neurotransmetteur." },
        { label: "8. Recyclage", shortLabel: "Recycler", detail: "À la plaque motrice, la choline est recaptée et sert à resynthétiser l’acétylcholine." },
      ],
      "Le Ca²⁺ agit du côté présynaptique ; le courant postsynaptique dépend des récepteurs activés. Inverser ces deux lieux détruit le raisonnement.",
    ),
    questions: [
      choice("Quel ion entre d’abord dans le bouton présynaptique à l’arrivée du PA ?", ["Ca²⁺", "Na⁺ uniquement", "Cl⁻ uniquement", "Fe³⁺"], 0, "Le Ca²⁺ déclenche l’exocytose.", "Étape 2 • page 16"),
      choice("Quel phénomène libère le neurotransmetteur ?", ["La mitose", "L’exocytose", "La filtration glomérulaire", "La phagocytose du muscle"], 1, "Les vésicules fusionnent avec la membrane présynaptique."),
      choice("Quel potentiel rapproche généralement la membrane du seuil ?", ["PPSI", "Potentiel de repos", "PPSE", "Potentiel hydrique"], 2, "Un PPSE est excitateur."),
      choice("Après hydrolyse de l’ACh, quel constituant est surtout recapté ?", ["Le calcium", "L’acétate et toute la fente", "La molécule d’ACh intacte", "La choline"], 3, "La choline retourne dans le bouton pour la resynthèse."),
      trueFalse("Un potentiel postsynaptique est local, gradué et peut se sommer avec d’autres.", true, "Il se distingue ainsi du potentiel d’action tout ou rien."),
      choice("Quelle enzyme hydrolyse l’acétylcholine ?", ["L’acétylcholinestérase", "L’amylase", "La pepsine", "La transcriptase inverse"], 0, "L’AChE met fin rapidement au signal de la plaque motrice."),
      choice("Dans l’exercice 2, quelle lettre vient juste après g ?", ["b", "c", "e", "f"], 1, "Après l’arrivée du PA (g), le Ca²⁺ entre (c).", "Exercice 2 • pages 18-19"),
      choice("Quelle suite commence correctement l’exercice 2 ?", ["a-d-g", "b-f-e", "g-c-a", "e-f-b"], 2, "Arrivée du PA, entrée de Ca²⁺, puis exocytose."),
      choice("Quel mécanisme peut produire un PPSI ?", ["Une entrée nette de Na⁺", "Une exocytose sans récepteur", "Une ouverture obligatoire des canaux Ca²⁺ postsynaptiques", "Une entrée de Cl⁻ ou une sortie de K⁺"], 3, "Ces flux éloignent du seuil ou stabilisent la membrane."),
      short("Écris la suite complète des lettres de l’exercice 2, sans espace.", ["gcadbfe", "g-c-a-d-b-f-e", "g c a d b f e"], "L’ordre suit PA → Ca²⁺ → exocytose → fixation → Na⁺ → dépolarisation → PA.", "Exercice 2 • pages 18-19"),
    ],
    corrections: [
      "À la plaque motrice, l’acétylcholine est hydrolysée ; c’est principalement la choline, et non l’ACh intacte, qui est recaptée.",
      "Les récepteurs nicotiniques sont décrits comme des canaux cationiques activés par l’ACh, plutôt que comme des récepteurs à Na⁺ au sens strict.",
      "Le PPSI est élargi à l’hyperpolarisation ou au shunt inhibiteur, selon le type de récepteur et le potentiel d’équilibre ionique.",
    ],
  },
  {
    id: "pain-morphine-final-mission",
    title: "Mission finale : douleur rapide, douleur lente et morphine",
    summary: "Identifier les fibres nociceptives, interpréter les enregistrements médullaires et expliquer l’action synaptique de la morphine.",
    pages: "17-19",
    section: "Situation d’évaluation et exercice 3",
    durationMinutes: 38,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## La situation officielle

Une forte stimulation cutanée provoque une douleur brève et rapide, puis une douleur plus tardive. Une microélectrode enregistre l’activité d’un neurone de la corne dorsale de la moelle. Après application locale de morphine, la réponse tardive diminue fortement sur le tracé.

Le tableau distingue deux groupes expérimentaux :

| Groupe du PDF | Diamètre | Vitesse | Identification physiologique |
|---|---:|---:|---|
| fibre A | 0,5 à 1 µm | 1 à 3 m·s⁻¹ | fibre **C**, fine et amyélinisée |
| fibre B | 4 à 8 µm | 24 à 48 m·s⁻¹ | fibre **Aδ**, myélinisée |

La lettre A ou B du document sert seulement à nommer ses deux tracés ; elle ne correspond pas à la nomenclature internationale des fibres.

## Deux composantes de la douleur

Les fibres Aδ conduisent vite grâce à leur myéline : elles contribuent à une douleur **rapide, vive et mieux localisée**. Les fibres C, fines et amyélinisées, conduisent lentement : elles contribuent à une douleur **retardée, diffuse et persistante**.

Le décalage temporel ne vient donc pas d’un stimulus différent. La même stimulation recrute deux voies dont les vitesses sont différentes.

## Effet de la morphine

La morphine active des récepteurs opioïdes. Dans les voies nociceptives médullaires, elle peut :

- réduire l’entrée présynaptique de Ca²⁺ et donc la libération de glutamate et de substance P ;
- augmenter une conductance K⁺ postsynaptique et hyperpolariser la cellule ;
- diminuer ainsi la transmission du message douloureux.

Elle ne « détruit » pas la fibre et n’annule pas toute sensation. C’est un médicament puissant soumis à prescription, pouvant provoquer somnolence, dépression respiratoire, tolérance et dépendance.

## Réinvestir l’exercice 3

Le dernier exercice stimule des neurones A, B et C. Après ajout de cholinestérase au niveau de B, B répond encore mais C ne répond plus. Dans le modèle cholinergique proposé, l’enzyme dégrade l’acétylcholine entre B et C : l’excitabilité de B est conservée, mais la transmission chimique vers C est bloquée. Cette conclusion reste conditionnée par l’hypothèse que cette synapse utilise bien l’ACh.

## Réponse rédigée attendue

La douleur rapide apparaît d’abord parce que les fibres Aδ myélinisées conduisent à 24-48 m·s⁻¹. La douleur lente suit parce que les fibres C amyélinisées ne conduisent qu’à 1-3 m·s⁻¹. La morphine réduit la réponse médullaire en activant des récepteurs opioïdes qui freinent la libération présynaptique et l’excitabilité postsynaptique.

> **Corrections de portée.** Le PDF ne nomme pas Aδ et C et demande seulement de déduire l’effet de la morphine. Ces identifications et mécanismes actualisent le cours sans transformer l’enregistrement en diagnostic individuel. L’exercice à la cholinestérase ne prouve un médiateur précis que dans le cadre cholinergique posé.
`,
    keyPoint: "Aδ myélinisée conduit la douleur rapide ; C amyélinisée conduit la douleur lente ; la morphine réduit la transmission nociceptive par les récepteurs opioïdes.",
    example: "À distance égale, un message à 30 m·s⁻¹ arrive avant un message à 2 m·s⁻¹ : les deux composantes de la douleur sont décalées.",
    methodSteps: [
      "Compare diamètre, myéline et vitesse des deux groupes de fibres.",
      "Associe la voie rapide à Aδ et la voie lente à C.",
      "Compare les tracés avant et après morphine sans inventer une valeur absente.",
      "Explique l’effet par les récepteurs opioïdes et conclus sur la transmission synaptique.",
    ],
    interaction: diagram(
      "Deux voies, un même stimulus",
      "Sélectionne chaque étape depuis la peau jusqu’au neurone médullaire, puis applique la morphine.",
      "Stimulation nociceptive cutanée",
      "Le même stimulus active des fibres rapides et lentes avant leur relais dans la corne dorsale.",
      [
        { id: "adelta", label: "Fibre Aδ", role: "24 à 48 m·s⁻¹", detail: "Myélinisée et de diamètre supérieur, elle contribue à la douleur initiale vive et localisée.", group: "Conduction" },
        { id: "c-fiber", label: "Fibre C", role: "1 à 3 m·s⁻¹", detail: "Fine et amyélinisée, elle contribue à la douleur tardive plus diffuse et persistante.", group: "Conduction" },
        { id: "dorsal-horn", label: "Corne dorsale", role: "Premier relais médullaire", detail: "Les afférences nociceptives libèrent notamment glutamate et substance P vers les neurones relais.", group: "Synapse" },
        { id: "opioid-pre", label: "Morphine présynaptique", role: "Moins de Ca²⁺", detail: "L’activation opioïde réduit l’entrée de Ca²⁺ et la libération de neurotransmetteurs nociceptifs.", group: "Modulation" },
        { id: "opioid-post", label: "Morphine postsynaptique", role: "Sortie de K⁺", detail: "L’hyperpolarisation éloigne le neurone du seuil et réduit sa réponse.", group: "Modulation" },
        { id: "result", label: "Résultat", role: "Transmission douloureuse réduite", detail: "La morphine diminue la réponse enregistrée sans supprimer anatomiquement les fibres sensitives.", group: "Conclusion" },
      ],
      "Une voie rapide et une voie lente expliquent les deux temps ; la morphine agit surtout au relais synaptique, pas sur la vitesse de myélinisation.",
    ),
    questions: [
      choice("Quelle fibre contribue principalement à la douleur rapide ?", ["La fibre Aδ myélinisée", "La fibre C amyélinisée", "Un globule rouge", "Une fibre musculaire"], 0, "Sa vitesse de 24 à 48 m·s⁻¹ permet une arrivée précoce.", "Tableau • page 18"),
      choice("Quelle fibre correspond au groupe A du tableau, fin et lent ?", ["Aδ", "C", "B motrice", "Une fibre végétale"], 1, "0,5 à 1 µm et 1 à 3 m·s⁻¹ correspondent à une fibre C."),
      choice("Pourquoi la douleur lente arrive-t-elle après la douleur rapide ?", ["Le stimulus est appliqué plus tard", "La moelle disparaît", "Les fibres C conduisent plus lentement", "La morphine accélère Aδ"], 2, "Les deux voies sont activées ensemble mais n’ont pas la même vitesse."),
      choice("Quel effet présynaptique peut produire la morphine ?", ["Augmenter toute libération", "Créer de la myéline", "Ouvrir tous les canaux Na⁺", "Réduire l’entrée de Ca²⁺ et la libération de médiateurs"], 3, "Les récepteurs opioïdes freinent la transmission nociceptive."),
      trueFalse("La morphine détruit les fibres nociceptives pour supprimer définitivement toute douleur.", false, "Elle module réversiblement la transmission et comporte des risques cliniques."),
      choice("Quel médiateur peptidique nociceptif est notamment réduit au relais médullaire ?", ["La substance P", "L’hémoglobine", "La kératine", "Le glycogène"], 0, "Les afférences nociceptives peuvent libérer substance P et glutamate."),
      choice("Quel effet postsynaptique opioïde réduit l’excitabilité ?", ["Une entrée massive de Na⁺", "Une augmentation de conductance K⁺", "Une mitose", "Une rupture de l’axone"], 1, "La sortie de K⁺ hyperpolarise la cellule."),
      choice("Dans l’exercice 3, B répond encore après cholinestérase mais C ne répond plus. Où se situe le blocage ?", ["Dans le noyau de B", "Dans le muscle", "À la transmission synaptique B→C", "Dans toute la moelle"], 2, "B reste excitable mais son message chimique n’atteint plus C.", "Exercice 3 • page 19"),
      choice("Quelle limite faut-il ajouter à l’interprétation de la cholinestérase ?", ["Elle prouve que toutes les synapses sont électriques", "Elle accélère toujours C", "Elle transforme B en muscle", "La conclusion sur l’ACh suppose une synapse cholinergique"], 3, "L’identité du neurotransmetteur doit être établie, pas supposée universelle."),
      short("Donne l’intervalle de vitesse des fibres rapides du tableau.", ["24 à 48 m/s", "24-48 m/s", "24 à 48 m·s⁻¹", "24–48 m.s-1"], "Le groupe rapide, identifié à Aδ, conduit entre 24 et 48 m·s⁻¹.", "Tableau • page 18"),
      choice("Quel premier relais central est montré dans la situation ?", ["La corne dorsale de la moelle épinière", "Le foie", "Le rein", "Le cristallin"], 0, "La microélectrode est implantée dans un neurone de la corne dorsale.", "Document 1 • page 17"),
      short("Nomme les deux types physiologiques de fibres associés aux douleurs rapide et lente, dans cet ordre.", ["Aδ et C", "A-delta et C", "Adelta et C", "A delta puis C"], "La fibre Aδ est rapide et myélinisée ; la fibre C est lente et amyélinisée.", "Tableau • page 18"),
    ],
    corrections: [
      "Les groupes A et B du tableau sont identifiés respectivement comme fibres C lentes amyélinisées et fibres Aδ rapides myélinisées.",
      "L’effet de la morphine est actualisé par les récepteurs opioïdes : réduction présynaptique de Ca²⁺/médiateurs et hyperpolarisation postsynaptique.",
      "Les risques de dépression respiratoire, tolérance et dépendance sont rappelés sans transformer le contenu en conseil médical individuel.",
      "L’exercice à la cholinestérase est interprété sous l’hypothèse explicite d’une synapse cholinergique.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtNervousTissuePath: LearningPath = {
  id: "terminale-d-svt-l2-nervous-tissue",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "La communication dans l’organisme" },
  chapterNumber: 2,
  title: "Le fonctionnement du tissu nerveux",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, de l’organisation du nerf aux voies de la douleur, avec schémas originaux, expériences, exercices et corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer nerf, fibre nerveuse, neurone, myéline et glie",
    "Interpréter le potentiel de repos, le potentiel d’action et les périodes réfractaires",
    "Expliquer rhéobase, chronaxie, tout ou rien, recrutement et vitesse de conduction",
    "Décrire une synapse chimique et analyser l’effet de la morphine sur les voies nociceptives",
  ],
  modules: [
    {
      id: "nervous-tissue-mastery",
      title: "Maîtriser le fonctionnement du tissu nerveux",
      description: "Dix niveaux progressifs, des structures du nerf à la mission sur les deux composantes de la douleur.",
      lessons: builtLevels,
    },
  ],
};
