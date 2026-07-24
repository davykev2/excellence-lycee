import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  SchemaHotspot,
  SchemaShape,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "SVT Tle C_L1_La communication nerveuse.pdf";

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
  corrections?: string[];
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: {
      documentTitle: sourceDocument,
      pages: seed.pages,
      section: seed.section,
      fidelity: seed.corrections?.length ? "faithful-corrected" : "faithful",
      corrections: seed.corrections ?? [],
    },
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
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique la démarche expérimentale du document : observer, analyser, interpréter, conclure.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "En SVT, une analyse décrit ce que l’on voit ; une interprétation explique pourquoi. Ne jamais confondre les deux.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const timeline = (
  items: TimelineInteractionItem[],
  title: string,
  instruction: string,
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Repères",
  title,
  instruction,
  observation,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
});

/* ------------------------------------------------------------------ *
 * Figure originale 1 : la structure d'un neurone.
 * Dessin vectoriel redessiné d'après le document officiel, avec ses
 * onze repères et les trois territoires traversés par le neurone.
 * ------------------------------------------------------------------ */

const neuronShapes: SchemaShape[] = [
  // Séparations des territoires
  { shape: "line", x1: 250, y1: 20, x2: 250, y2: 280, tone: "muted" },
  { shape: "line", x1: 620, y1: 20, x2: 620, y2: 280, tone: "muted" },
  // Dendrites
  { shape: "path", d: "M95 118 L52 82 M52 82 L30 70 M52 82 L44 58", tone: "outline" },
  { shape: "path", d: "M84 142 L38 134 M38 134 L16 126 M38 134 L20 148", tone: "outline" },
  { shape: "path", d: "M96 184 L58 216 M58 216 L36 234 M58 216 L52 242", tone: "outline" },
  { shape: "path", d: "M130 108 L142 70 M142 70 L128 50 M142 70 L162 56", tone: "outline" },
  // Corps cellulaire (péricaryon) et son noyau
  { shape: "path", d: "M120 106 C147 110 162 128 160 150 C162 173 147 190 120 194 C93 190 78 173 80 150 C78 128 93 110 120 106 Z", tone: "soft" },
  { shape: "ellipse", cx: 120, cy: 150, rx: 15, ry: 12, tone: "fill" },
  // Axone
  { shape: "path", d: "M160 150 C230 140 275 162 330 152 C395 142 440 164 500 152 C560 141 605 163 660 152 C725 140 780 162 826 151", tone: "outline" },
  // Gaines de myéline
  { shape: "ellipse", cx: 345, cy: 151, rx: 36, ry: 13, tone: "soft" },
  { shape: "ellipse", cx: 432, cy: 156, rx: 36, ry: 13, tone: "soft" },
  { shape: "ellipse", cx: 519, cy: 150, rx: 36, ry: 13, tone: "soft" },
  { shape: "ellipse", cx: 668, cy: 152, rx: 36, ry: 13, tone: "soft" },
  { shape: "ellipse", cx: 758, cy: 154, rx: 36, ry: 13, tone: "soft" },
  // Cellule gliale et cellule de Schwann
  { shape: "ellipse", cx: 282, cy: 124, rx: 13, ry: 10, tone: "soft" },
  { shape: "circle", cx: 282, cy: 124, r: 4, tone: "fill" },
  { shape: "ellipse", cx: 668, cy: 133, rx: 15, ry: 9, tone: "soft" },
  { shape: "circle", cx: 668, cy: 133, r: 4, tone: "fill" },
  // Arborisation terminale
  { shape: "path", d: "M826 151 L868 124 M868 124 L888 112 M868 124 L884 136 M826 151 L872 152 M872 152 L892 148 M826 151 L866 180 M866 180 L886 192 M866 180 L870 196", tone: "outline" },
];

const neuronHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  {
    id: "membrane", number: 1, label: "Membrane", x: 168, y: 116,
    detail: "La membrane plasmique délimite le neurone. C’est à travers elle que se font les mouvements d’ions responsables du potentiel de repos et du potentiel d’action.",
    highlight: [{ shape: "path", d: "M120 106 C147 110 162 128 160 150 C162 173 147 190 120 194 C93 190 78 173 80 150 C78 128 93 110 120 106 Z", tone: "outline" }],
  },
  {
    id: "cytoplasme", number: 2, label: "Cytoplasme", x: 96, y: 176,
    detail: "Le cytoplasme remplit le corps cellulaire. Il contient les organites qui assurent la vie du neurone, dont les mitochondries productrices d’ATP.",
  },
  {
    id: "dendrite", number: 3, label: "Dendrite", x: 34, y: 66,
    detail: "Les dendrites sont de courts prolongements ramifiés qui reçoivent les messages venus des autres neurones et les conduisent vers le corps cellulaire.",
    highlight: [{ shape: "path", d: "M95 118 L52 82 M52 82 L30 70 M52 82 L44 58 M84 142 L38 134 M38 134 L16 126 M38 134 L20 148 M96 184 L58 216 M58 216 L36 234 M58 216 L52 242 M130 108 L142 70 M142 70 L128 50 M142 70 L162 56", tone: "accent" }],
  },
  {
    id: "noyau", number: 4, label: "Noyau", x: 120, y: 150,
    detail: "Le noyau contient l’information génétique du neurone. Il commande la synthèse des protéines nécessaires au fonctionnement de la cellule.",
    highlight: [{ shape: "ellipse", cx: 120, cy: 150, rx: 15, ry: 12, tone: "fill" }],
  },
  {
    id: "pericaryon", number: 5, label: "Péricaryon", x: 84, y: 212,
    detail: "Le péricaryon, ou corps cellulaire ou soma, est la région élargie qui contient le noyau. C’est l’une des trois grandes parties du neurone, avec l’axone et l’arborisation terminale.",
    highlight: [{ shape: "path", d: "M120 106 C147 110 162 128 160 150 C162 173 147 190 120 194 C93 190 78 173 80 150 C78 128 93 110 120 106 Z", tone: "accent" }],
  },
  {
    id: "gliale", number: 6, label: "Cellule gliale", x: 282, y: 96,
    detail: "Les cellules gliales entourent et soutiennent les neurones. Elles assurent leur nutrition et leur protection, sans conduire elles-mêmes l’influx nerveux.",
    highlight: [{ shape: "ellipse", cx: 282, cy: 124, rx: 13, ry: 10, tone: "accent" }],
  },
  {
    id: "axone", number: 7, label: "Axone", x: 240, y: 182,
    detail: "L’axone, ou cylindraxe, est le long prolongement unique qui conduit l’influx nerveux du corps cellulaire vers les terminaisons. C’est sur lui que se propagent les courants locaux.",
    highlight: [{ shape: "path", d: "M160 150 C230 140 275 162 330 152 C395 142 440 164 500 152 C560 141 605 163 660 152 C725 140 780 162 826 151", tone: "accent" }],
  },
  {
    id: "myeline", number: 8, label: "Gaine de myéline", x: 432, y: 188,
    detail: "La gaine de myéline est une enveloppe isolante formée par les cellules de Schwann. Elle accélère la propagation de l’influx nerveux, qui saute d’un nœud à l’autre.",
    highlight: [
      { shape: "ellipse", cx: 345, cy: 151, rx: 36, ry: 13, tone: "accent" },
      { shape: "ellipse", cx: 432, cy: 156, rx: 36, ry: 13, tone: "accent" },
      { shape: "ellipse", cx: 519, cy: 150, rx: 36, ry: 13, tone: "accent" },
    ],
  },
  {
    id: "ranvier", number: 9, label: "Nœud de Ranvier", x: 476, y: 116,
    detail: "Le nœud de Ranvier est l’étranglement séparant deux gaines de myéline successives. La membrane y est à nu : c’est là que l’influx nerveux est régénéré.",
    highlight: [{ shape: "circle", cx: 476, cy: 151, r: 9, tone: "accent" }],
  },
  {
    id: "schwann", number: 10, label: "Cellule de Schwann", x: 668, y: 104,
    detail: "La cellule de Schwann s’enroule autour de l’axone et fabrique la gaine de myéline. Chaque cellule couvre un segment, entre deux nœuds de Ranvier.",
    highlight: [{ shape: "ellipse", cx: 668, cy: 133, rx: 15, ry: 9, tone: "accent" }],
  },
  {
    id: "arborisation", number: 11, label: "Arborisation terminale", x: 862, y: 214,
    detail: "L’arborisation terminale est la ramification finale de l’axone. Chacune de ses extrémités forme un bouton synaptique qui transmet le message à la structure suivante.",
    highlight: [{ shape: "path", d: "M826 151 L868 124 M868 124 L888 112 M868 124 L884 136 M826 151 L872 152 M872 152 L892 148 M826 151 L866 180 M866 180 L886 192 M866 180 L870 196", tone: "accent" }],
  },
];

/* ------------------------------------------------------------------ *
 * Figure originale 2 : l'ultrastructure d'une plaque motrice.
 * ------------------------------------------------------------------ */

const motorPlateShapes: SchemaShape[] = [
  // Axone descendant, entouré de sa cellule de Schwann
  { shape: "path", d: "M286 18 L286 84 M330 18 L330 84", tone: "outline" },
  { shape: "ellipse", cx: 308, cy: 52, rx: 32, ry: 17, tone: "soft" },
  // Bouton présynaptique
  { shape: "path", d: "M286 84 C238 104 206 152 214 202 L402 202 C410 152 378 104 330 84 Z", tone: "soft" },
  // Vésicules synaptiques
  { shape: "circle", cx: 258, cy: 152, r: 10, tone: "outline" },
  { shape: "circle", cx: 300, cy: 138, r: 10, tone: "outline" },
  { shape: "circle", cx: 344, cy: 156, r: 10, tone: "outline" },
  { shape: "circle", cx: 278, cy: 182, r: 9, tone: "outline" },
  { shape: "circle", cx: 332, cy: 184, r: 9, tone: "outline" },
  // Mitochondrie du bouton
  { shape: "ellipse", cx: 246, cy: 122, rx: 17, ry: 9, tone: "outline" },
  // Membrane présynaptique
  { shape: "line", x1: 210, y1: 202, x2: 406, y2: 202, tone: "outline" },
  // Fente synaptique
  { shape: "line", x1: 170, y1: 212, x2: 450, y2: 212, tone: "muted" },
  // Membrane postsynaptique repliée
  { shape: "path", d: "M170 220 L200 220 L206 246 L212 220 L242 220 L248 246 L254 220 L284 220 L290 246 L296 220 L326 220 L332 246 L338 220 L368 220 L374 246 L380 220 L410 220 L416 246 L422 220 L450 220", tone: "outline" },
  // Fibre musculaire
  { shape: "ellipse", cx: 214, cy: 286, rx: 20, ry: 10, tone: "outline" },
  { shape: "ellipse", cx: 320, cy: 292, rx: 20, ry: 10, tone: "outline" },
  { shape: "ellipse", cx: 412, cy: 284, rx: 20, ry: 10, tone: "outline" },
  { shape: "line", x1: 150, y1: 322, x2: 500, y2: 322, tone: "outline" },
  { shape: "line", x1: 150, y1: 334, x2: 500, y2: 334, tone: "outline" },
  { shape: "line", x1: 150, y1: 346, x2: 500, y2: 346, tone: "outline" },
  { shape: "line", x1: 150, y1: 250, x2: 150, y2: 356, tone: "muted" },
  { shape: "line", x1: 500, y1: 250, x2: 500, y2: 356, tone: "muted" },
];

const motorPlateHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  {
    id: "axone-terminal", number: 1, label: "Axone", x: 308, y: 26,
    detail: "L’axone du motoneurone arrive à la plaque motrice. Il conduit le potentiel d’action jusqu’au bouton présynaptique.",
    highlight: [{ shape: "path", d: "M286 18 L286 84 M330 18 L330 84", tone: "accent" }],
  },
  {
    id: "schwann-plaque", number: 2, label: "Cellule de Schwann", x: 356, y: 46,
    detail: "La cellule de Schwann entoure l’axone jusqu’à son extrémité. Elle isole la terminaison et l’aide à maintenir son fonctionnement.",
    highlight: [{ shape: "ellipse", cx: 308, cy: 52, rx: 32, ry: 17, tone: "accent" }],
  },
  {
    id: "vesicules", number: 3, label: "Vésicules synaptiques", x: 300, y: 138,
    detail: "Les vésicules synaptiques stockent le neurotransmetteur, ici l’acétylcholine. Leur présence en grand nombre, avec des vésicules d’exocytose, traduit une synapse en activité.",
    highlight: [
      { shape: "circle", cx: 258, cy: 152, r: 10, tone: "accent" },
      { shape: "circle", cx: 300, cy: 138, r: 10, tone: "accent" },
      { shape: "circle", cx: 344, cy: 156, r: 10, tone: "accent" },
      { shape: "circle", cx: 278, cy: 182, r: 9, tone: "accent" },
      { shape: "circle", cx: 332, cy: 184, r: 9, tone: "accent" },
    ],
  },
  {
    id: "membrane-pre", number: 4, label: "Membrane présynaptique", x: 430, y: 198,
    detail: "La membrane présynaptique ferme le bouton. C’est elle qui porte les canaux à Ca²⁺ et par laquelle les vésicules libèrent leur contenu par exocytose.",
    highlight: [{ shape: "line", x1: 210, y1: 202, x2: 406, y2: 202, tone: "accent" }],
  },
  {
    id: "fente", number: 5, label: "Fente synaptique", x: 476, y: 212,
    detail: "La fente synaptique est l’espace qui sépare les deux éléments de la synapse. Le neurotransmetteur y diffuse, ce qui impose un sens unique à la transmission.",
    highlight: [{ shape: "line", x1: 170, y1: 212, x2: 450, y2: 212, tone: "accent" }],
  },
  {
    id: "membrane-post", number: 6, label: "Membrane postsynaptique", x: 476, y: 240,
    detail: "La membrane postsynaptique est repliée pour augmenter sa surface. Elle porte les récepteurs spécifiques du neurotransmetteur et les canaux à Na⁺ chimio-dépendants.",
    highlight: [{ shape: "path", d: "M170 220 L200 220 L206 246 L212 220 L242 220 L248 246 L254 220 L284 220 L290 246 L296 220 L326 220 L332 246 L338 220 L368 220 L374 246 L380 220 L410 220 L416 246 L422 220 L450 220", tone: "accent" }],
  },
  {
    id: "mitochondrie", number: 7, label: "Mitochondrie", x: 320, y: 292,
    detail: "Les mitochondries fournissent l’ATP nécessaire au fonctionnement de la synapse, notamment au transport actif et à la recapture du neurotransmetteur.",
    highlight: [
      { shape: "ellipse", cx: 214, cy: 286, rx: 20, ry: 10, tone: "accent" },
      { shape: "ellipse", cx: 320, cy: 292, rx: 20, ry: 10, tone: "accent" },
      { shape: "ellipse", cx: 412, cy: 284, rx: 20, ry: 10, tone: "accent" },
    ],
  },
  {
    id: "myofibrille", number: 8, label: "Myofibrille", x: 534, y: 334,
    detail: "Les myofibrilles sont les éléments contractiles de la fibre musculaire. Le potentiel d’action musculaire s’y propage et déclenche la contraction.",
    highlight: [
      { shape: "line", x1: 150, y1: 322, x2: 500, y2: 322, tone: "accent" },
      { shape: "line", x1: 150, y1: 334, x2: 500, y2: 334, tone: "accent" },
      { shape: "line", x1: 150, y1: 346, x2: 500, y2: 346, tone: "accent" },
    ],
  },
  {
    id: "fibre", number: 9, label: "Fibre musculaire striée", x: 118, y: 300,
    detail: "La fibre musculaire striée est l’élément postsynaptique de la plaque motrice. C’est la cellule effectrice : sa dépolarisation aboutit à la contraction du muscle.",
  },
];

const levels: LevelSeed[] = [
  {
    id: "neuron-structure",
    title: "Le neurone, structure support de l’influx nerveux",
    summary: "Identifier les parties du neurone et situer son trajet de la substance grise jusqu’au nerf.",
    pages: "1-3",
    section: "I. L’influx nerveux se propage-t-il le long d’une structure particulière ?",
    durationMinutes: 20,
    xp: 45,
    body: String.raw`## La démarche du document

Le cours part d’un fait : piqué par une épine, un élève lâche brusquement sa daba. Pour comprendre, on pose trois questions successives, auxquelles répondent les trois parties de la leçon :

1. L’influx nerveux se propage-t-il **le long d’une structure particulière** ?
2. Se propage-t-il **sous différents aspects** ?
3. Se propage-t-il **selon un mécanisme** ?

## Le nerf

Le nerf est formé essentiellement :

- d’une **gaine conjonctive**, avec une membrane externe l’**épinèvre** et une membrane interne le **périnèvre** qui entoure chaque faisceau ;
- de **faisceaux de fibres nerveuses** (axones) ;
- de **vaisseaux sanguins** situés dans un tissu conjonctif.

## Le neurone

Le neurone est une cellule allongée constituée de **trois grandes parties** :

| Partie | Rôle |
|---|---|
| Le **corps cellulaire** (soma ou péricaryon) | contient le noyau ; centre de vie de la cellule |
| L’**axone** (cylindraxe) | conduit l’influx nerveux |
| L’**arborisation terminale** | transmet le message à la structure suivante |

> **Ce que montre le schéma, et que le texte ne dit pas.** Le neurone **traverse trois territoires** : son corps cellulaire est dans la **substance grise**, son axone chemine dans la **substance blanche**, puis se retrouve **dans un nerf**. Un seul neurone relie donc le centre nerveux à l’organe — c’est ce qui explique la rapidité de la réaction à la piqûre.

## Conclusion

L’influx nerveux se propage le long d’une structure particulière appelée **neurone** ou cellule nerveuse, qui représente l’**unité fonctionnelle** du tissu nerveux.

> **Piège classique.** Le **nerf** n’est pas l’unité fonctionnelle : c’est un assemblage de fibres. La **fibre nerveuse** n’est qu’une **portion** du neurone (l’axone), et non le neurone entier.`,
    keyPoint: "Le neurone est l’unité fonctionnelle du tissu nerveux : corps cellulaire, axone et arborisation terminale.",
    example: "Le corps cellulaire se trouve dans la substance grise, l’axone chemine dans la substance blanche puis dans un nerf.",
    methodSteps: [
      "Repère les trois grandes parties : corps cellulaire, axone, arborisation terminale.",
      "Situe chaque structure dans son territoire : substance grise, blanche ou nerf.",
      "Distingue le neurone (la cellule entière) de la fibre nerveuse (une portion).",
      "Rappelle que le nerf est un assemblage de fibres, pas une cellule.",
    ],
    corrections: [
      "Dans le document, la légende « Figure 1 : COUPE TRANSVERSALE D’UN NERF » est placée sous un schéma de neurone : les deux figures de la page représentent en réalité la structure d’un neurone, et la coupe transversale de nerf annoncée est absente. La description du nerf donnée ici s’appuie donc sur le texte de l’analyse.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Explorer",
      title: "La structure d’un neurone",
      instruction: "Sélectionne un repère numéroté pour éclairer la structure correspondante et lire son rôle.",
      observation: "Le même neurone traverse trois territoires : corps cellulaire dans la substance grise, axone dans la substance blanche puis dans un nerf.",
      caption: "Schéma de la structure d’un neurone — figure redessinée d’après le document officiel.",
      viewBox: "0 0 900 300",
      zones: [
        { label: "Dans la substance grise", xStart: 0, xEnd: 250 },
        { label: "Dans la substance blanche", xStart: 250, xEnd: 620 },
        { label: "Dans un nerf", xStart: 620, xEnd: 900 },
      ],
      shapes: neuronShapes,
      hotspots: neuronHotspots,
    },
    questions: [
      choice("Quelle est l’unité fonctionnelle du tissu nerveux ?", ["le neurone", "le nerf", "la fibre nerveuse", "la gaine de myéline"], 0, "Le neurone, ou cellule nerveuse, est l’unité fonctionnelle.", "I-4 Conclusion"),
      choice("Le neurone est constitué de trois grandes parties :", ["corps cellulaire, axone et arborisation terminale", "épinèvre, périnèvre et vaisseaux", "membrane, cytoplasme et noyau", "dendrite, myéline et nœud de Ranvier"], 0, "Ce sont les trois parties citées par l’analyse du document.", "I-3 Analyse", 2),
      choice("« La fibre nerveuse et le neurone représentent une même structure. »", ["Faux", "Vrai"], 0, "La fibre nerveuse n’est qu’une portion du neurone.", "Exercice 1 - affirmation 3", 2),
      choice("« Le nerf est l’unité fonctionnelle du système nerveux. »", ["Faux", "Vrai"], 0, "C’est le neurone, pas le nerf.", "Exercice 1 - affirmation 2"),
      choice("« Toutes les fibres nerveuses sont myélinisées. »", ["Faux", "Vrai"], 0, "Certaines fibres sont amyéliniques.", "Exercice 1 - affirmation 1", 2),
      short("Comment se nomme la membrane externe de la gaine conjonctive du nerf ?", ["épinèvre", "epinevre", "l’épinèvre"], "L’épinèvre entoure le nerf ; le périnèvre entoure chaque faisceau.", "I-3 Analyse", 2),
      short("Quel repère du schéma désigne l’étranglement entre deux gaines de myéline ?", ["nœud de Ranvier", "noeud de Ranvier", "9"], "Le nœud de Ranvier est le repère 9.", "Document I - annotation"),
    ],
  },
  {
    id: "resting-potential",
    title: "Le potentiel de repos : mise en évidence",
    summary: "Comparer le potentiel de référence et le potentiel de membrane obtenus sur l’axone géant de calmar.",
    pages: "3-8",
    section: "II. Expériences 1 et 2 — potentiel de référence et potentiel de membrane",
    durationMinutes: 20,
    xp: 55,
    kind: "graph",
    body: String.raw`## Le dispositif

On réalise sur un **axone géant de calmar** une série d’expériences, en enregistrant à l’oscilloscope. Deux microélectrodes réceptrices $R_1$ et $R_2$ recueillent le signal ; deux électrodes stimulatrices $E_1$ et $E_2$ permettent d’exciter.

## Les deux premières expériences, sans stimulation

| Expérience | Position des électrodes | Enregistrement | Nom |
|---|---|---|---|
| **1** | $R_1$ et $R_2$ **toutes deux à la surface** | ligne plate à **0 mV** | **potentiel de référence** |
| **2** | $R_2$ **enfoncée dans** l’axone, $R_1$ en surface | ligne plate à **−70 mV** | **potentiel de membrane** (ou de repos) |

## Interprétation

**Le potentiel de référence (0 mV).** Toute la surface de l’axone est au même potentiel, donc porte la même charge. Aucune différence n’apparaît entre deux points de la surface.

**Le potentiel de membrane (−70 mV).** La face interne et la face externe **ne sont pas au même potentiel**. Le faisceau d’électrons est repoussé par la plaque reliée à $R_2$ (enfoncée) : la face **interne** est donc **électronégative**. Il est attiré par la plaque reliée à $R_1$ (en surface) : la face **externe** est **électropositive**.

> **La conclusion à retenir.** Une membrane au repos est **polarisée** : négative à l’intérieur, positive à l’extérieur, avec une différence de potentiel de **−70 mV**. C’est cette polarisation que l’influx nerveux va momentanément inverser.

> **Piège fréquent.** Le potentiel de repos ne se mesure **que** si une électrode est **enfoncée**. Avec les deux électrodes en surface, on lit 0 mV — ce qui ne signifie pas que la membrane n’est pas polarisée, mais qu’on ne compare que deux points de la même face.`,
    keyPoint: "Deux électrodes en surface donnent 0 mV (potentiel de référence) ; une électrode enfoncée révèle −70 mV (potentiel de membrane).",
    example: "Figure 2 : $R_2$ enfoncée dans l’axone, le spot se stabilise à −70 mV.",
    methodSteps: [
      "Repère la position exacte des deux électrodes réceptrices.",
      "Deux électrodes en surface : on mesure le potentiel de référence, 0 mV.",
      "Une électrode enfoncée : on mesure le potentiel de membrane, −70 mV.",
      "Conclus sur la polarisation : intérieur négatif, extérieur positif.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Enregistrement de l’expérience 2",
      instruction: "Déplace le point le long du tracé : la valeur reste constante, sans aucune stimulation.",
      observation: "Le spot se stabilise à −70 mV et n’en bouge pas : c’est le potentiel de membrane, ou potentiel de repos. La ligne est plate car aucune excitation n’est portée.",
      formula: "Potentiel de membrane au repos",
      formulaTex: "V_{\\text{repos}}=-70\\ \\text{mV}",
      rule: { kind: "samples", points: [[0, -70], [1, -70], [2, -70], [3, -70], [4, -70], [5, -70], [6, -70]] },
      window: { xMin: 0, xMax: 6, yMin: -90, yMax: 50 },
      guides: [
        { kind: "horizontal", value: 0, label: "0 mV (référence)" },
        { kind: "horizontal", value: -70, label: "−70 mV (repos)" },
      ],
      marker: { min: 0, max: 6, step: 0.2, initial: 3 },
    },
    questions: [
      short("Quelle valeur enregistre-t-on avec les deux électrodes à la surface, sans stimulation ?", ["0", "0 mV", "0mV"], "C’est le potentiel de référence.", "Figure 1"),
      short("Quelle valeur enregistre-t-on lorsque $R_2$ est enfoncée dans l’axone, sans stimulation ?", ["-70", "-70 mV", "-70mV"], "C’est le potentiel de membrane, ou potentiel de repos.", "Figure 2", 2),
      choice("Au repos, la face interne de la membrane est…", ["électronégative", "électropositive", "neutre", "variable"], 0, "Le faisceau repoussé par la plaque reliée à $R_2$ indique une face interne négative.", "II-4 Interprétation", 2),
      choice("Le potentiel de référence de 0 mV indique que…", ["toute la surface de l’axone porte la même charge", "la membrane n’est pas polarisée", "l’axone est mort", "l’axone est stimulé"], 0, "Deux points de la même face sont au même potentiel.", "II-4 Interprétation", 2),
      choice("« Le potentiel de référence est obtenu en absence d’excitation. »", ["Vrai", "Faux"], 0, "Les expériences 1 et 2 se font sans stimulation.", "Exercice 1 - affirmation 6"),
      choice("« La fibre nerveuse réagit à une excitation en développant un potentiel de membrane. »", ["Faux", "Vrai"], 0, "À l’excitation, elle développe un potentiel d’**action**, pas un potentiel de membrane.", "Exercice 1 - affirmation 7", 2),
    ],
  },
  {
    id: "action-potential-phases",
    title: "Le potentiel d’action et ses phases",
    summary: "Décrire les six phases du potentiel d’action monophasique enregistré après stimulation.",
    pages: "5-8",
    section: "II. Expérience 3 — le potentiel d’action monophasique",
    durationMinutes: 24,
    xp: 70,
    kind: "graph",
    body: String.raw`## L’expérience 3

$R_2$ reste **enfoncée** dans l’axone, $R_1$ en surface, et l’on porte une **stimulation efficace** grâce aux électrodes $E_1$ et $E_2$. Le tracé obtenu s’appelle **potentiel d’action monophasique**.

## Les six phases

| Portion | Nom | Ce qui se passe |
|---|---|---|
| **A** | artefact de stimulation | marque le moment précis de la stimulation, à l’origine de l’influx nerveux |
| **AB** | temps de latence | temps mis par l’influx pour atteindre l’électrode réceptrice |
| **BC** | **dépolarisation** | inversion de la polarité : l’extérieur devient négatif, l’intérieur positif. Le sommet C donne l’**amplitude** du PA |
| **CD** | **repolarisation** | retour de la polarité initiale après le passage de l’influx |
| **DE** | **hyperpolarisation** | repolarisation exagérée : le spot descend **sous** le potentiel de repos |
| **EF** | restauration | la membrane retrouve son potentiel de repos initial |

> **La définition à retenir.** Le potentiel d’action correspond à une **inversion momentanée de la polarité** entre les deux faces de la membrane de l’axone.

> **Erreur fréquente.** L’hyperpolarisation n’est **pas** un retour au repos : c’est un dépassement, sous le potentiel de repos. Le retour au repos, c’est la phase suivante, la restauration.

## L’influx nerveux

L’influx nerveux est une **onde de négativité** qui se propage le long de l’axone en le dépolarisant localement, sous forme de **courants locaux**.`,
    keyPoint: "Le PA suit six phases : artefact, latence, dépolarisation, repolarisation, hyperpolarisation, restauration.",
    example: "Le sommet C du tracé donne l’amplitude du potentiel d’action.",
    methodSteps: [
      "Repère l’artefact A, qui date la stimulation.",
      "Mesure le temps de latence AB avant la réponse.",
      "Identifie la montée BC (dépolarisation) et son sommet C.",
      "Suis la descente CD, le creux DE sous le repos, puis le retour EF.",
    ],
    corrections: [
      "Sur la figure 3 du document, la ligne de base est dessinée vers −60 mV, avec la mention manuscrite « (revoir la graduation à −70) ». Le tracé présenté ici part donc bien de −70 mV, conformément au potentiel de repos établi à l’expérience 2.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Le potentiel d’action monophasique",
      instruction: "Parcours le tracé de gauche à droite et retrouve les six phases, de l’artefact à la restauration.",
      observation: "Le spot part de −70 mV, monte brusquement jusqu’au sommet C, redescend, passe sous le repos (hyperpolarisation) puis revient à −70 mV.",
      formula: "Potentiel d’action monophasique",
      formulaTex: "\\text{PA monophasique}",
      rule: {
        kind: "samples",
        points: [
          [0, -70], [0.8, -70], [0.95, -64], [1.1, -70], [2, -70],
          [2.3, -58], [2.6, -20], [2.85, 18], [3, 40], [3.2, 22],
          [3.5, -12], [3.9, -48], [4.3, -66], [4.7, -76], [5.2, -77],
          [5.6, -73], [6, -70],
        ],
      },
      window: { xMin: 0, xMax: 6, yMin: -90, yMax: 55 },
      guides: [
        { kind: "horizontal", value: 0, label: "0 mV" },
        { kind: "horizontal", value: -70, label: "potentiel de repos" },
      ],
      marker: { min: 0, max: 6, step: 0.1, initial: 0 },
    },
    questions: [
      choice("La portion A du tracé correspond…", ["à l’artefact de stimulation", "au temps de latence", "à la dépolarisation", "à l’hyperpolarisation"], 0, "L’artefact marque le moment de la stimulation.", "II-3 Analyse"),
      choice("La phase BC est…", ["la dépolarisation", "la repolarisation", "l’hyperpolarisation", "la restauration"], 0, "C’est l’inversion de polarité, jusqu’au sommet C.", "II-3 Analyse", 2),
      choice("La phase DE correspond à…", ["l’hyperpolarisation", "la dépolarisation", "le temps de latence", "l’artefact"], 0, "Une repolarisation exagérée qui descend sous le potentiel de repos.", "II-3 Analyse", 2),
      short("Quel point du tracé permet de déterminer l’amplitude du potentiel d’action ?", ["C", "le point C", "le sommet C"], "Le pic C donne l’amplitude.", "II-4 Interprétation"),
      choice("Le potentiel d’action correspond à…", ["une inversion momentanée de la polarité de la membrane", "une disparition définitive de la polarité", "un arrêt du métabolisme", "une contraction du neurone"], 0, "C’est la définition donnée par le document.", "II-4 Interprétation", 2),
      choice("L’influx nerveux est décrit comme…", ["une onde de négativité", "une onde de positivité", "un flux de calcium", "une contraction"], 0, "Il dépolarise localement l’axone sous forme de courants locaux.", "II-4 Interprétation", 2),
      choice("« Le potentiel d’action est toujours monophasique. »", ["Faux", "Vrai"], 0, "Il peut être diphasique lorsque les deux électrodes sont en surface.", "Exercice 1 - affirmation 8", 2),
    ],
  },
  {
    id: "ionic-explanation",
    title: "L’explication ionique : canaux et pompe Na⁺/K⁺",
    summary: "Expliquer le potentiel de repos et chaque phase du PA par les mouvements des ions Na⁺ et K⁺.",
    pages: "8-9",
    section: "II-4. Interprétation sur le plan ionique",
    durationMinutes: 24,
    xp: 70,
    body: String.raw`## L’origine du potentiel de membrane

Elle s’explique par une **inégale répartition des ions** de part et d’autre de la membrane :

| Milieu | Ion le plus concentré |
|---|---|
| **Intracellulaire** | K⁺ |
| **Extracellulaire** | Na⁺ |

Au repos, la membrane est **plus perméable au K⁺ qu’au Na⁺**. Il sort donc plus de K⁺ qu’il n’entre de Na⁺, selon leur gradient de concentration : c’est un **mouvement passif**. Les charges positives s’accumulent à l’extérieur, d’où l’extérieur positif et l’intérieur négatif.

## Pourquoi le déséquilibre ne s’efface-t-il pas ?

Le mouvement passif devrait aboutir à l’égalité des concentrations. Mais l’inégalité persiste, **grâce à la pompe ionique Na⁺/K⁺ dépendante**, qui refoule **3 Na⁺ pour 2 K⁺ entrants**.

## Chaque phase du PA, expliquée par les canaux

| Phase | État des canaux voltage-dépendants | Mouvement ionique |
|---|---|---|
| **Temps de latence** | canaux Na⁺ et K⁺ **fermés** | aucun |
| **Dépolarisation** | canaux **Na⁺ ouverts**, K⁺ fermés | **entrée massive de Na⁺** |
| **Repolarisation** | canaux **K⁺ ouverts**, Na⁺ fermés | **sortie progressive de K⁺** |
| **Hyperpolarisation** | canaux K⁺ **restent longtemps ouverts** | sortie **exagérée** de K⁺ |
| **Restauration** | canaux Na⁺ et K⁺ **fermés** | la pompe Na⁺/K⁺ rétablit les concentrations |

> **Passif ou actif ?** Les mouvements par les canaux se font **dans le sens** du gradient : ils sont **passifs** et gratuits. La pompe travaille **contre** le gradient : elle est **active** et consomme l’énergie de l’**hydrolyse de l’ATP**. C’est la distinction attendue à l’examen.

> **Astuce mémoire.** « **Na⁺ entre, ça monte ; K⁺ sort, ça descend.** » L’entrée de sodium dépolarise, la sortie de potassium repolarise — et si elle dure trop, elle hyperpolarise.`,
    keyPoint: "Repos : plus de K⁺ dedans, plus de Na⁺ dehors, maintenu par la pompe 3 Na⁺/2 K⁺. PA : entrée de Na⁺ puis sortie de K⁺.",
    example: "La dépolarisation est due à l’entrée massive de Na⁺ par les canaux sodiques voltage-dépendants.",
    methodSteps: [
      "Rappelle la répartition des ions : K⁺ à l’intérieur, Na⁺ à l’extérieur.",
      "Associe chaque phase du PA à l’ouverture ou la fermeture d’un canal.",
      "Précise le sens du mouvement ionique correspondant.",
      "Distingue le transport passif par les canaux du transport actif par la pompe.",
    ],
    interaction: timeline(
      [
        { label: "Repos", shortLabel: "Repos", detail: "Membrane plus perméable au K⁺ : sortie passive de K⁺, extérieur positif, intérieur négatif à −70 mV." },
        { label: "Dépolarisation", shortLabel: "Dépol.", detail: "Ouverture des canaux Na⁺ voltage-dépendants : entrée massive de Na⁺, la polarité s’inverse." },
        { label: "Repolarisation", shortLabel: "Repol.", detail: "Ouverture des canaux K⁺ voltage-dépendants : sortie progressive de K⁺, la polarité initiale revient." },
        { label: "Hyperpolarisation", shortLabel: "Hyperpol.", detail: "Les canaux K⁺ restent longtemps ouverts : la sortie exagérée de K⁺ fait descendre sous le repos." },
        { label: "Restauration", shortLabel: "Restaur.", detail: "La pompe Na⁺/K⁺ fait sortir les Na⁺ entrés et entrer les K⁺ sortis, contre leur gradient, grâce à l’ATP." },
      ],
      "Le trajet des ions pendant un potentiel d’action",
      "Suis les cinq moments et repère à chaque fois quel canal s’ouvre et quel ion se déplace.",
      "Les canaux assurent un transport passif ; seule la pompe Na⁺/K⁺ travaille contre le gradient, en consommant de l’ATP.",
    ),
    questions: [
      choice("Au repos, quel ion est le plus concentré dans le milieu intracellulaire ?", ["K⁺", "Na⁺", "Ca²⁺", "Cl⁻"], 0, "Le milieu intracellulaire est plus concentré en K⁺.", "II-4 Plan ionique"),
      short("Combien d’ions Na⁺ la pompe refoule-t-elle pour 2 K⁺ entrants ?", ["3", "3 Na+", "trois"], "La pompe Na⁺/K⁺ refoule 3 Na⁺ pour 2 K⁺ entrants.", "II-4 Plan ionique", 2),
      choice("La phase de dépolarisation est due à…", ["une entrée massive de Na⁺", "une sortie de K⁺", "une entrée de Ca²⁺", "une sortie de Cl⁻"], 0, "Les canaux sodiques voltage-dépendants s’ouvrent.", "II-4 Plan ionique", 2),
      choice("La phase de repolarisation s’explique par…", ["une sortie progressive de K⁺", "une entrée de Na⁺", "une entrée de K⁺", "une sortie de Na⁺"], 0, "Les canaux K⁺ voltage-dépendants s’ouvrent, les canaux Na⁺ restent fermés.", "II-4 Plan ionique", 2),
      choice("Le transport assuré par la pompe Na⁺/K⁺ est…", ["actif, il consomme l’ATP", "passif, il suit le gradient", "gratuit", "assuré par les canaux voltage-dépendants"], 0, "Elle travaille contre le gradient grâce à l’hydrolyse de l’ATP.", "II-4 Plan ionique", 3),
      choice("Pendant le temps de latence, les canaux Na⁺ et K⁺ voltage-dépendants sont…", ["fermés", "ouverts", "l’un ouvert, l’autre fermé", "détruits"], 0, "Les deux types de canaux restent fermés.", "II-4 Plan ionique", 2),
    ],
  },
  {
    id: "local-currents",
    title: "La propagation par courants locaux",
    summary: "Comprendre le potentiel d’action diphasique et la propagation de l’influx le long de l’axone.",
    pages: "6-9",
    section: "II. Expérience 4 et conclusion",
    durationMinutes: 20,
    xp: 60,
    kind: "graph",
    body: String.raw`## L’expérience 4

Les deux électrodes réceptrices $R_1$ et $R_2$ sont replacées **à la surface** de l’axone, et l’on porte une stimulation efficace. On obtient une courbe **à deux sommets inversés** : le **potentiel d’action diphasique**.

> **Pourquoi deux sommets ?** L’onde de négativité passe **d’abord sous $R_1$**, ce qui donne un premier sommet, **puis sous $R_2$**, ce qui donne un second sommet **inversé**. Chaque sommet présente les mêmes phases que le PA monophasique.

## La différence entre les deux tracés

| | Monophasique | Diphasique |
|---|---|---|
| Position des électrodes | une **enfoncée**, une en surface | les **deux en surface** |
| Ligne de base | **−70 mV** | **0 mV** |
| Allure | un seul pic | deux sommets **inversés** |

## Conclusion de la deuxième partie

L’influx nerveux se propage grâce à des **courants locaux** issus de l’**inversion de la polarité** entre les deux faces de la membrane plasmique. Cette inversion est due aux **mouvements des ions Na⁺ et K⁺** de part et d’autre de la membrane.

> **Le sens de propagation.** Dans l’organisme, l’influx nerveux se déplace **toujours** du corps cellulaire vers les terminaisons nerveuses. Sur un axone isolé stimulé en son milieu, en revanche, il se propage dans les deux sens.`,
    keyPoint: "Deux électrodes en surface donnent un PA diphasique à deux sommets inversés, sur une ligne de base à 0 mV.",
    example: "Le premier sommet correspond au passage de l’onde sous $R_1$, le second, inversé, sous $R_2$.",
    methodSteps: [
      "Note la position des électrodes pour prévoir l’allure du tracé.",
      "Deux électrodes en surface : attends-toi à deux sommets inversés.",
      "Vérifie la ligne de base : 0 mV en diphasique, −70 mV en monophasique.",
      "Explique la propagation par les courants locaux dus à l’inversion de polarité.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Le potentiel d’action diphasique",
      instruction: "Parcours le tracé : repère le premier sommet, puis le second, inversé.",
      observation: "La ligne de base est ici à 0 mV, car les deux électrodes sont en surface. L’onde passe d’abord sous R₁ (sommet positif) puis sous R₂ (sommet négatif).",
      formula: "Potentiel d’action diphasique",
      formulaTex: "\\text{PA diphasique}",
      rule: {
        kind: "samples",
        points: [
          [0, 0], [0.5, 0], [0.62, 5], [0.75, 0], [1, 0],
          [1.15, 22], [1.4, 60], [1.65, 38], [1.9, 8], [2.05, -6],
          [2.2, -26], [2.4, -38], [2.6, -26], [2.9, -8], [3.2, -1],
          [3.6, 0], [4, 0],
        ],
      },
      window: { xMin: 0, xMax: 4, yMin: -55, yMax: 75 },
      guides: [{ kind: "horizontal", value: 0, label: "0 mV (ligne de base)" }],
      marker: { min: 0, max: 4, step: 0.1, initial: 0 },
    },
    questions: [
      choice("Le potentiel d’action diphasique s’obtient lorsque…", ["les deux électrodes réceptrices sont à la surface", "une électrode est enfoncée", "il n’y a aucune stimulation", "l’axone est sectionné"], 0, "C’est la condition de l’expérience 4.", "Expérience 4", 2),
      choice("La courbe diphasique présente…", ["deux sommets inversés", "un seul sommet", "trois sommets", "aucun sommet"], 0, "Chaque sommet présente les mêmes phases que le PA monophasique.", "II-3 Analyse", 2),
      choice("L’influx nerveux se propage grâce à…", ["des courants locaux issus de l’inversion de polarité", "la circulation sanguine", "la contraction de l’axone", "la diffusion de l’ATP"], 0, "C’est la conclusion de la deuxième partie.", "II-5 Conclusion", 2),
      choice("« Dans l’organisme, l’influx nerveux est transmis dans un seul sens au niveau d’un neurone. »", ["Vrai", "Faux"], 0, "Il va toujours du corps cellulaire vers les terminaisons.", "Exercice 1 - affirmation 10", 2),
      choice("« La repolarisation et la dépolarisation sont des phases du PA. »", ["Vrai", "Faux"], 0, "Ce sont deux des six phases du potentiel d’action.", "Exercice 1 - affirmation 9"),
    ],
  },
  {
    id: "synapse-types",
    title: "Les synapses : types et ultrastructure",
    summary: "Distinguer les trois synapses neuroniques et reconnaître les éléments d’une plaque motrice.",
    pages: "9-11",
    section: "III-A. Les différentes zones de contact",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Les trois synapses entre neurones

Une **synapse** est une zone de contact entre deux structures excitables. Entre deux neurones, on distingue trois types selon les parties mises en contact :

| Type | Contact entre |
|---|---|
| **Axo-axonique** | l’axone d’un neurone et l’**axone** d’un autre |
| **Axo-dendritique** | l’axone d’un neurone et la **dendrite** d’un autre |
| **Axo-somatique** | l’axone d’un neurone et le **corps cellulaire** d’un autre |

> **Astuce de lecture.** Le nom se lit dans le **sens du message** : le premier terme désigne toujours l’élément **présynaptique** (l’axone qui arrive), le second l’élément **postsynaptique** qui reçoit.

## La jonction neuro-musculaire

Le contact entre un neurone et une **cellule musculaire** s’appelle **jonction neuro-musculaire** ou **plaque motrice**.

## La composition d’une synapse

Toute synapse comprend :

- un **élément présynaptique** (le bouton, qui contient les vésicules) ;
- un **élément postsynaptique** (qui porte les récepteurs) ;
- séparés par un espace, la **fente synaptique**.

L’électronographie montre de **nombreuses vésicules synaptiques et des vésicules d’exocytose dans le neurone présynaptique**, et **aucune vésicule dans le postsynaptique** : la synapse est en activité, et cette dissymétrie impose le **sens unique** de la transmission.

## Conclusion

La transmission de l’influx nerveux d’un neurone à une structure cellulaire se fait à travers des zones de contact appelées **synapses**.`,
    keyPoint: "Trois synapses neuroniques : axo-axonique, axo-dendritique, axo-somatique. Avec un muscle : la plaque motrice.",
    example: "Les vésicules ne sont présentes que du côté présynaptique : la transmission est à sens unique.",
    methodSteps: [
      "Identifie les deux structures mises en contact.",
      "Nomme la synapse en commençant par l’élément présynaptique.",
      "Repère les trois éléments : bouton, fente, membrane postsynaptique.",
      "Utilise la position des vésicules pour déterminer le sens de transmission.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Explorer",
      title: "L’ultrastructure d’une plaque motrice",
      instruction: "Sélectionne un repère pour éclairer l’élément correspondant et lire son rôle.",
      observation: "Les vésicules ne sont que d’un seul côté, dans le bouton présynaptique : c’est ce qui impose le sens unique de la transmission.",
      caption: "Ultrastructure d’une plaque motrice — figure redessinée d’après le document officiel.",
      viewBox: "0 0 700 380",
      shapes: motorPlateShapes,
      hotspots: motorPlateHotspots,
    },
    questions: [
      choice("Le contact entre l’axone d’un neurone et la dendrite d’un autre s’appelle…", ["synapse axo-dendritique", "synapse axo-axonique", "synapse axo-somatique", "plaque motrice"], 0, "Le premier terme désigne l’élément présynaptique.", "III-A-3 Analyse", 2),
      choice("Le contact entre un neurone et une cellule musculaire s’appelle…", ["plaque motrice", "synapse axo-somatique", "nœud de Ranvier", "fente synaptique"], 0, "C’est la jonction neuro-musculaire.", "III-A-3 Analyse"),
      choice("Une synapse est composée de…", ["un élément présynaptique, une fente et un élément postsynaptique", "deux axones collés", "un seul neurone replié", "une gaine de myéline"], 0, "C’est la composition donnée par le document.", "III-A-3 Analyse", 2),
      choice("Où trouve-t-on les vésicules synaptiques ?", ["uniquement dans l’élément présynaptique", "uniquement dans le postsynaptique", "dans les deux", "dans la fente"], 0, "Leur absence côté postsynaptique impose le sens unique.", "III-B-2 Résultat", 2),
      short("Comment se nomme l’espace qui sépare les deux éléments d’une synapse ?", ["fente synaptique", "la fente synaptique"], "La fente synaptique est traversée par le neurotransmetteur.", "III-A-3 Analyse", 2),
      short("Quel repère du schéma porte les récepteurs du neurotransmetteur ?", ["membrane postsynaptique", "la membrane postsynaptique", "6"], "C’est le repère 6, la membrane postsynaptique repliée.", "Document III - figure 2", 2),
    ],
  },
  {
    id: "synaptic-transmission",
    title: "La transmission synaptique : les huit étapes",
    summary: "Ordonner les étapes du fonctionnement d’une synapse et distinguer PPSE et PPSI.",
    pages: "12-13",
    section: "III-B. Le passage de l’influx nerveux à travers une synapse",
    durationMinutes: 24,
    xp: 75,
    kind: "practice",
    body: String.raw`## Les huit étapes, dans l’ordre chronologique

1. **Arrivée de l’influx nerveux** au niveau du bouton présynaptique ;
2. **entrée des ions Ca²⁺** dans le bouton synaptique ;
3. **libération des neurotransmetteurs** dans la fente synaptique par **exocytose** ;
4. **fixation des neurotransmetteurs** sur les récepteurs à Na⁺ de la membrane postsynaptique ;
5. **ouverture des canaux à Na⁺** et entrée des ions Na⁺ ;
6. **dépolarisation** de la membrane postsynaptique ;
7. **hydrolyse du neuromédiateur** ;
8. **recapture** du neurotransmetteur par le bouton synaptique.

## Le détail à la plaque motrice

Le neurotransmetteur est l’**acétylcholine (ACh)**, stockée dans les vésicules. Sa fixation ouvre les canaux à Na⁺ **chimio-dépendants**, provoquant l’entrée massive de Na⁺ et donc la naissance d’un **PA musculaire** : le muscle se contracte.

La contraction s’arrête lorsque l’ACh est **hydrolysée en acétate et choline** par une enzyme, l’**acétylcholinestérase**. La choline est ensuite **réabsorbée** par le bouton pour resynthétiser de l’acétylcholine.

> **Deux familles de canaux à ne pas confondre.** Sur l’axone, les canaux sont **voltage-dépendants** : ils s’ouvrent sous l’effet d’un changement de potentiel. Sur la membrane postsynaptique, ils sont **chimio-dépendants** : ils s’ouvrent sous l’effet du neurotransmetteur.

## Synapse excitatrice ou inhibitrice ?

| Type | Ce que font les neurotransmetteurs | Effet | Potentiel obtenu |
|---|---|---|---|
| **Excitatrice** | ouvrent les canaux à **Na⁺** | **dépolarisation** | **PPSE** (potentiel postsynaptique excitateur) |
| **Inhibitrice** | provoquent une sortie de **K⁺** ou une entrée de **Cl⁻** | **hyperpolarisation** | **PPSI** (potentiel postsynaptique inhibiteur) |

Dans le cas inhibiteur, la membrane est inhibée : **aucun PA n’y naît**.

## Conclusion

La transmission de l’influx nerveux se fait grâce aux **médiateurs chimiques** qui se fixent sur leurs **récepteurs spécifiques** situés sur la membrane postsynaptique.`,
    keyPoint: "Influx → Ca²⁺ → exocytose → fixation → canaux Na⁺ → dépolarisation → hydrolyse → recapture. PPSE si Na⁺ entre, PPSI si K⁺ sort ou Cl⁻ entre.",
    example: "L’acétylcholine est hydrolysée par l’acétylcholinestérase, ce qui arrête la contraction.",
    methodSteps: [
      "Pars toujours de l’arrivée de l’influx au bouton présynaptique.",
      "Rappelle que le Ca²⁺ entre avant toute libération de neurotransmetteur.",
      "Suis le neurotransmetteur : exocytose, traversée de la fente, fixation.",
      "Termine par l’hydrolyse et la recapture, qui arrêtent le message.",
    ],
    interaction: timeline(
      [
        { label: "1. Arrivée de l’influx", shortLabel: "1", detail: "Le potentiel d’action atteint le bouton présynaptique et ouvre les canaux à Ca²⁺." },
        { label: "2. Entrée de Ca²⁺", shortLabel: "2", detail: "Les ions Ca²⁺ entrent massivement dans le bouton synaptique." },
        { label: "3. Exocytose", shortLabel: "3", detail: "Les vésicules libèrent le neurotransmetteur dans la fente synaptique." },
        { label: "4. Fixation", shortLabel: "4", detail: "Le neurotransmetteur se fixe sur ses récepteurs spécifiques de la membrane postsynaptique." },
        { label: "5. Ouverture des canaux Na⁺", shortLabel: "5", detail: "Les canaux à Na⁺ chimio-dépendants s’ouvrent : les ions Na⁺ entrent." },
        { label: "6. Dépolarisation", shortLabel: "6", detail: "La membrane postsynaptique se dépolarise : un PA y prend naissance." },
        { label: "7. Hydrolyse", shortLabel: "7", detail: "L’acétylcholinestérase hydrolyse l’ACh en acétate et choline : le message s’arrête." },
        { label: "8. Recapture", shortLabel: "8", detail: "La choline est réabsorbée par le bouton pour resynthétiser du neurotransmetteur." },
      ],
      "Les huit étapes de la transmission synaptique",
      "Parcours les étapes dans l’ordre chronologique, de l’arrivée de l’influx à la recapture.",
      "Retiens que le Ca²⁺ entre côté présynaptique et le Na⁺ côté postsynaptique : ce sont deux ions différents, à deux endroits différents.",
    ),
    questions: [
      short("Quel ion entre dans le bouton présynaptique à l’arrivée de l’influx ?", ["Ca2+", "Ca²⁺", "calcium"], "L’ouverture des canaux à Ca²⁺ déclenche l’exocytose.", "III-B-4 Interprétation", 2),
      choice("Après la fixation du neurotransmetteur, quels canaux s’ouvrent ?", ["les canaux à Na⁺ chimio-dépendants", "les canaux à Na⁺ voltage-dépendants", "les canaux à Ca²⁺", "les canaux à K⁺ voltage-dépendants"], 0, "Sur la membrane postsynaptique, les canaux sont chimio-dépendants.", "III-B-4 Interprétation", 3),
      short("Quelle enzyme hydrolyse l’acétylcholine ?", ["acétylcholinestérase", "acetylcholinesterase", "l’acétylcholinestérase"], "Elle la coupe en acétate et choline, ce qui arrête la contraction.", "III-B-4 Interprétation", 2),
      choice("Dans une synapse **inhibitrice**, les neurotransmetteurs provoquent…", ["une sortie de K⁺ ou une entrée de Cl⁻", "une entrée de Na⁺", "une entrée de Ca²⁺", "une sortie de Na⁺"], 0, "Il en résulte une hyperpolarisation : c’est le PPSI.", "III-B-4 Interprétation", 3),
      choice("Le potentiel obtenu dans une synapse excitatrice s’appelle…", ["PPSE", "PPSI", "PA diphasique", "potentiel de repos"], 0, "Potentiel postsynaptique excitateur.", "III-B-4 Interprétation", 2),
      short("Range dans l’ordre chronologique : g, c, a, d, f, e. Donne la 2ᵉ lettre de la suite correcte (g, ?, a, d, f, e).", ["c"], "Après l’arrivée du PA (g) vient l’entrée des ions Ca²⁺ (c), puis l’exocytose (a).", "Exercice 2", 3),
      choice("Dans l’exercice 2, l’item b « entrée des ions Na⁺ dans le bouton synaptique » est…", ["une erreur : c’est le Ca²⁺ qui entre dans le bouton", "l’étape 2 correcte", "la dernière étape", "l’étape initiale"], 0, "Le Na⁺ entre côté postsynaptique, pas dans le bouton.", "Exercice 2 - piège", 3),
    ],
  },
  {
    id: "neuron-chain-mission",
    title: "Mission finale : la chaîne de neurones A, B et C",
    summary: "Analyser des enregistrements sur une chaîne de neurones et déduire le sens de propagation.",
    pages: "14-15",
    section: "Exercice 3 — situation d’évaluation",
    durationMinutes: 36,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

Des élèves simulent des expériences d’excitation sur une **chaîne de neurones A, B et C**. Ils excitent successivement A puis B, puis excitent une seconde fois B **après y avoir injecté de la cholinestérase**.

## Les résultats

| | Expérience 1 : excitation de A | Expérience 2 : excitation de B | Expérience 3 : excitation de B après cholinestérase |
|---|---|---|---|
| **Réponse de A** | image de PA | un trait | un trait |
| **Réponse de B** | un trait | image de PA | image de PA |
| **Réponse de C** | image de PA | image de PA | **un trait** |

## L’analyse

**Expérience 1.** L’excitation de A donne un PA en A **et en C**, mais rien en B. Le message part donc de A et parvient à C **sans passer par B**… ou plutôt : B n’est pas sur le trajet enregistré, tandis que A est bien relié à C.

**Expérience 2.** L’excitation de B donne un PA en B et en C, mais rien en A. Le message va donc de B **vers** C, et **jamais** vers A.

**Expérience 3.** Après injection de cholinestérase dans B, l’excitation de B donne toujours un PA en B, mais **plus rien en C**.

## L’explication

La **cholinestérase** hydrolyse l’**acétylcholine**. En l’injectant dans B, on détruit le neurotransmetteur avant qu’il n’atteigne C : la transmission synaptique est **bloquée**, alors que le neurone B lui-même reste parfaitement excitable — il donne toujours son PA.

> **Ce que cette expérience démontre.** Le passage d’un neurone à l’autre ne se fait **pas** par simple contact électrique, mais bien par un **médiateur chimique**. Détruire le médiateur suffit à interrompre le message, sans altérer les neurones.

## La déduction

Dans une synapse, l’influx nerveux se propage **toujours dans un seul sens** : de l’élément **présynaptique** vers l’élément **postsynaptique**. C’est la conséquence directe de la répartition des vésicules, présentes d’un seul côté.

## Conclusion générale de la leçon

L’influx nerveux se propage le long d’une structure nerveuse. Il est provoqué par une **modification de la perméabilité membranaire** à certains ions et circule sous forme de **courants locaux**. Son passage à travers la synapse est assuré par un **médiateur chimique** libéré dans la fente synaptique, qui provoque la dépolarisation de l’élément postsynaptique. Dans l’organisme, l’influx se déplace toujours du corps cellulaire vers les terminaisons nerveuses.`,
    keyPoint: "La cholinestérase bloque la transmission sans empêcher le PA : la synapse fonctionne par médiateur chimique, à sens unique.",
    example: "Après cholinestérase dans B, B répond toujours mais C ne répond plus.",
    methodSteps: [
      "Décris d’abord le PA obtenu, avec ses phases.",
      "Analyse chaque expérience : qui répond, qui ne répond pas.",
      "Explique en reliant l’absence de réponse à une cause précise.",
      "Déduis le sens de propagation dans la synapse.",
    ],
    interaction: timeline(
      [
        { label: "Expérience 1 : on excite A", shortLabel: "Exp. 1", detail: "PA en A et en C, rien en B : le message circule de A vers C." },
        { label: "Expérience 2 : on excite B", shortLabel: "Exp. 2", detail: "PA en B et en C, rien en A : le message va vers C, jamais en arrière vers A." },
        { label: "Expérience 3 : B + cholinestérase", shortLabel: "Exp. 3", detail: "PA en B mais plus rien en C : la transmission est bloquée alors que le neurone reste excitable." },
        { label: "Explication", shortLabel: "Pourquoi", detail: "La cholinestérase hydrolyse l’acétylcholine : sans médiateur, la synapse ne transmet plus." },
        { label: "Déduction", shortLabel: "Conclusion", detail: "L’influx ne traverse une synapse que dans un seul sens, du présynaptique vers le postsynaptique." },
      ],
      "Décrypter les trois expériences",
      "Compare les trois colonnes du tableau et cherche à chaque fois ce qui change.",
      "Un neurone qui répond encore alors que le suivant ne répond plus : la coupure est dans la synapse, pas dans le neurone.",
    ),
    questions: [
      choice("Expérience 2 : on excite B, A ne répond pas. Cela montre que…", ["le message ne remonte pas de B vers A", "le neurone A est mort", "B n’est pas excitable", "la synapse est détruite"], 0, "La transmission synaptique est à sens unique.", "Exercice 3 - question 2", 2),
      choice("Après injection de cholinestérase dans B, B répond encore. Cela prouve que…", ["le neurone B reste excitable", "B est détruit", "la cholinestérase excite B", "B ne conduit plus rien"], 0, "Seule la transmission vers C est bloquée.", "Exercice 3 - question 3", 2),
      choice("Pourquoi C ne répond-il plus après l’injection de cholinestérase ?", ["l’acétylcholine est hydrolysée avant d’agir sur C", "le neurone C est détruit", "B n’est plus excitable", "les canaux Na⁺ de B sont bloqués"], 0, "Sans médiateur chimique, la synapse ne transmet plus.", "Exercice 3 - question 3", 3),
      choice("Ces expériences démontrent que la transmission synaptique est…", ["chimique, par un médiateur", "purement électrique", "mécanique", "impossible"], 0, "Détruire le médiateur suffit à interrompre le message.", "Exercice 3 - question 3", 3),
      short("Dans quel sens l’influx nerveux traverse-t-il une synapse ? Complète : du … vers le postsynaptique.", ["présynaptique", "presynaptique", "élément présynaptique"], "Toujours du présynaptique vers le postsynaptique.", "Exercice 3 - question 4", 2),
      choice("Dans l’organisme, au niveau d’un neurone, l’influx se déplace…", ["du corps cellulaire vers les terminaisons", "des terminaisons vers le corps cellulaire", "dans les deux sens", "au hasard"], 0, "C’est la conclusion générale du document.", "Conclusion générale", 2),
      short("Quel enzyme a été injecté dans le neurone B ?", ["cholinestérase", "la cholinestérase", "acétylcholinestérase"], "Elle hydrolyse l’acétylcholine et bloque la transmission.", "Exercice 3 - énoncé", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCSvtNervousPath: LearningPath = {
  id: "terminale-c-svt-l1-nervous-communication",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "La communication dans l’organisme" },
  chapterNumber: 1,
  title: "La communication nerveuse",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses schémas annotés, ses enregistrements et ses exercices.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Identifier les structures du neurone et du nerf sur un schéma annoté",
    "Interpréter les enregistrements du potentiel de repos et du potentiel d’action",
    "Expliquer le potentiel d’action par les mouvements des ions Na⁺ et K⁺",
    "Décrire la transmission synaptique et démontrer son sens unique",
  ],
  modules: [
    { id: "nervous-mastery", title: "Maîtriser la communication nerveuse", description: "Un niveau après l’autre, de la structure du neurone à la chaîne de neurones.", lessons: builtLevels },
  ],
};
