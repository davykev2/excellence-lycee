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
} from "../domain/paths";

const sourceDocument = "SVT Tle C_L2_Les drogues et le système nerveux.pdf";

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
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages,
  section,
  fidelity: corrections.length ? "faithful-corrected" : "faithful",
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
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Observe les données, compare avec le témoin, interprète le mécanisme puis formule une conclusion précise.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : effet observé et mécanisme ne sont pas la même chose. Décris d’abord, explique ensuite.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const normalSynapseShapes: SchemaShape[] = [
  { shape: "path", d: "M190 35 C135 70 120 150 145 205 C165 242 220 250 285 232 C330 220 355 180 345 115 C338 72 300 42 255 35 Z", tone: "soft" },
  { shape: "line", x1: 145, y1: 232, x2: 350, y2: 232, tone: "outline" },
  { shape: "path", d: "M105 305 C185 270 300 275 400 305 C505 335 600 325 675 292", tone: "soft" },
  { shape: "line", x1: 105, y1: 284, x2: 675, y2: 284, tone: "outline" },
  { shape: "circle", cx: 190, cy: 145, r: 22, tone: "outline" },
  { shape: "circle", cx: 250, cy: 130, r: 22, tone: "outline" },
  { shape: "circle", cx: 302, cy: 160, r: 22, tone: "outline" },
  { shape: "circle", cx: 178, cy: 215, r: 6, tone: "accent" },
  { shape: "circle", cx: 202, cy: 250, r: 6, tone: "accent" },
  { shape: "circle", cx: 230, cy: 258, r: 6, tone: "accent" },
  { shape: "circle", cx: 260, cy: 250, r: 6, tone: "accent" },
  { shape: "circle", cx: 291, cy: 260, r: 6, tone: "accent" },
  { shape: "circle", cx: 322, cy: 245, r: 6, tone: "accent" },
  { shape: "path", d: "M190 145 L178 205 M250 130 L230 205 M302 160 L290 210", tone: "muted" },
  { shape: "path", d: "M185 284 L185 312 L208 312 L208 284 M250 284 L250 312 L273 312 L273 284 M315 284 L315 312 L338 312 L338 284", tone: "outline" },
  { shape: "path", d: "M375 210 L395 210 L395 240 L375 240 Z", tone: "accent" },
  { shape: "path", d: "M405 210 L425 210 L425 240 L405 240 Z", tone: "accent" },
  { shape: "line", x1: 382, y1: 205, x2: 330, y2: 240, tone: "muted" },
  { shape: "line", x1: 415, y1: 205, x2: 460, y2: 165, tone: "muted" },
  { shape: "text", x: 245, y: 22, content: "bouton présynaptique", anchor: "middle" },
  { shape: "text", x: 245, y: 350, content: "neurone postsynaptique", anchor: "middle" },
  { shape: "text", x: 515, y: 260, content: "fente synaptique", anchor: "middle" },
];

const normalSynapseHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "message", number: 1, label: "Message électrique", x: 155, y: 72, detail: "Le potentiel d’action atteint le bouton présynaptique et déclenche l’ouverture de canaux calciques." },
  { id: "vesicles", number: 2, label: "Vésicules", x: 250, y: 130, detail: "Les vésicules stockent le neurotransmetteur. L’entrée de calcium déclenche leur fusion avec la membrane.", highlight: [{ shape: "circle", cx: 250, cy: 130, r: 26, tone: "accent" }] },
  { id: "release", number: 3, label: "Exocytose", x: 178, y: 218, detail: "Le neurotransmetteur est libéré dans la fente synaptique par exocytose." },
  { id: "receptors", number: 4, label: "Récepteurs", x: 260, y: 306, detail: "La fixation du neurotransmetteur sur ses récepteurs modifie l’activité du neurone postsynaptique.", highlight: [{ shape: "ellipse", cx: 260, cy: 298, rx: 105, ry: 28, tone: "accent" }] },
  { id: "transporter", number: 5, label: "Transporteur de recapture", x: 398, y: 225, detail: "Un transporteur comme DAT reprend une partie de la dopamine et limite la durée du signal.", highlight: [{ shape: "ellipse", cx: 400, cy: 225, rx: 36, ry: 28, tone: "accent" }] },
  { id: "termination", number: 6, label: "Fin du signal", x: 470, y: 165, detail: "Dissociation, recapture, diffusion et métabolisme participent à l’arrêt du message ; une enzyme ne « décroche » pas mécaniquement la dopamine de son récepteur." },
];

const stimulantSynapseShapes: SchemaShape[] = [
  { shape: "line", x1: 380, y1: 25, x2: 380, y2: 385, tone: "muted" },
  { shape: "text", x: 190, y: 28, content: "AMPHÉTAMINE : libération accrue", anchor: "middle" },
  { shape: "text", x: 570, y: 28, content: "COCAÏNE : recapture bloquée", anchor: "middle" },
  { shape: "ellipse", cx: 190, cy: 130, rx: 115, ry: 72, tone: "soft" },
  { shape: "ellipse", cx: 570, cy: 130, rx: 115, ry: 72, tone: "soft" },
  { shape: "line", x1: 65, y1: 225, x2: 315, y2: 225, tone: "outline" },
  { shape: "line", x1: 445, y1: 225, x2: 695, y2: 225, tone: "outline" },
  { shape: "line", x1: 65, y1: 280, x2: 315, y2: 280, tone: "outline" },
  { shape: "line", x1: 445, y1: 280, x2: 695, y2: 280, tone: "outline" },
  { shape: "circle", cx: 145, cy: 110, r: 18, tone: "outline" },
  { shape: "circle", cx: 205, cy: 98, r: 18, tone: "outline" },
  { shape: "circle", cx: 250, cy: 135, r: 18, tone: "outline" },
  { shape: "circle", cx: 525, cy: 110, r: 18, tone: "outline" },
  { shape: "circle", cx: 585, cy: 98, r: 18, tone: "outline" },
  { shape: "circle", cx: 630, cy: 135, r: 18, tone: "outline" },
  { shape: "circle", cx: 120, cy: 240, r: 6, tone: "accent" },
  { shape: "circle", cx: 150, cy: 252, r: 6, tone: "accent" },
  { shape: "circle", cx: 180, cy: 236, r: 6, tone: "accent" },
  { shape: "circle", cx: 210, cy: 257, r: 6, tone: "accent" },
  { shape: "circle", cx: 240, cy: 240, r: 6, tone: "accent" },
  { shape: "circle", cx: 270, cy: 255, r: 6, tone: "accent" },
  { shape: "circle", cx: 500, cy: 240, r: 6, tone: "accent" },
  { shape: "circle", cx: 530, cy: 252, r: 6, tone: "accent" },
  { shape: "circle", cx: 560, cy: 236, r: 6, tone: "accent" },
  { shape: "circle", cx: 590, cy: 257, r: 6, tone: "accent" },
  { shape: "circle", cx: 620, cy: 240, r: 6, tone: "accent" },
  { shape: "circle", cx: 650, cy: 255, r: 6, tone: "accent" },
  { shape: "path", d: "M150 280 L150 310 L175 310 L175 280 M215 280 L215 310 L240 310 L240 280", tone: "outline" },
  { shape: "path", d: "M530 280 L530 310 L555 310 L555 280 M595 280 L595 310 L620 310 L620 280", tone: "outline" },
  { shape: "path", d: "M665 205 L690 205 L690 232 L665 232 Z", tone: "accent" },
  { shape: "line", x1: 660, y1: 196, x2: 698, y2: 242, tone: "accent" },
  { shape: "text", x: 190, y: 350, content: "signal postsynaptique prolongé", anchor: "middle" },
  { shape: "text", x: 570, y: 350, content: "dopamine accumulée dans la fente", anchor: "middle" },
];

const stimulantSynapseHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "amp-site", number: 1, label: "Site présynaptique", x: 98, y: 82, detail: "L’amphétamine agit surtout sur les transporteurs et le stockage présynaptiques, ce qui augmente la dopamine disponible et peut inverser le flux du transporteur." },
  { id: "amp-release", number: 2, label: "Libération accrue", x: 190, y: 210, detail: "Davantage de dopamine gagne la fente : le neurone postsynaptique est stimulé plus fortement et plus longtemps." },
  { id: "cocaine-dat", number: 3, label: "DAT bloqué", x: 682, y: 205, detail: "La cocaïne se fixe au transporteur de dopamine DAT et empêche la recapture normale ; elle ne provoque pas une libération continue de dopamine.", highlight: [{ shape: "ellipse", cx: 680, cy: 220, rx: 35, ry: 40, tone: "accent" }] },
  { id: "cocaine-build", number: 4, label: "Accumulation", x: 570, y: 248, detail: "La dopamine déjà libérée reste plus longtemps dans la fente et active davantage de récepteurs." },
  { id: "same-effect", number: 5, label: "Effet commun", x: 380, y: 350, detail: "Les deux substances sont psychostimulantes dans le modèle du cours, mais leurs mécanismes immédiats ne sont pas identiques." },
];

const levels: LevelSeed[] = [
  {
    id: "experimental-effects",
    title: "Comparer les effets de la nicotine et du diazépam",
    summary: "Lire un protocole témoin et distinguer augmentation et diminution de l’activité nerveuse.",
    pages: "1-2 et 9",
    section: "Expériences sur le ganglion de phasme et conclusion sur les effets",
    durationMinutes: 22,
    xp: 45,
    body: `
## 1. Une substance psychoactive modifie le fonctionnement nerveux

Une **substance psychoactive** agit sur le système nerveux central et peut modifier l’éveil, l’humeur, la perception, la pensée ou le comportement. Le mot « drogue » utilisé dans le PDF recouvre des produits très différents : substance interdite, alcool, nicotine, mais aussi certains médicaments lorsqu’ils sont employés hors prescription ou de manière dangereuse.

> **Vocabulaire respectueux :** on parle d’une *personne qui consomme une substance* ou d’une *personne présentant un trouble de l’usage*, et non d’une personne réduite à l’étiquette « drogué ».

## 2. Le protocole expérimental

Le document compare l’activité électrique d’un **ganglion nerveux de phasme** dans trois conditions. Une seule variable change : le liquide qui entoure le ganglion.

| Expérience | Milieu | Observation du document | Rôle |
|---|---|---|---|
| 1 | liquide physiologique | activité spontanée de référence | **témoin** |
| 2 | solution de nicotine | signal plus fréquent et d’amplitude globale plus grande | substance testée |
| 3 | solution de diazépam | signal plus rare et d’amplitude globale plus faible | substance testée |

Le témoin permet d’attribuer les différences aux substances ajoutées, puisque le ganglion et les conditions d’enregistrement restent comparables.

## 3. Décrire avant d’interpréter

- **Résultat :** par rapport au témoin, la nicotine augmente l’activité enregistrée ; le diazépam la diminue.
- **Interprétation scolaire :** la nicotine a ici un effet excitateur ; le diazépam un effet inhibiteur ou sédatif.
- **Conclusion :** toutes les substances psychoactives n’ont pas le même effet sur les circuits nerveux.

> **Précision scientifique :** un potentiel d’action isolé obéit à la loi du tout-ou-rien. Le tracé d’un ganglion est un signal extracellulaire composé provenant de plusieurs fibres ; sa « grande amplitude » peut traduire le recrutement ou la synchronisation de davantage de fibres, et non un potentiel d’action individuel devenu arbitrairement plus grand.

## 4. Ne pas confondre sédatif et dépression

Le diazépam est une benzodiazépine prescrite dans certaines situations médicales. Il renforce l’action inhibitrice du GABA sur les récepteurs $\\mathrm{GABA_A}$ et diminue l’excitabilité neuronale. L’expression « psycho-dépressif » du PDF est remplacée par **dépresseur du système nerveux central** ou **sédatif** : cela ne signifie pas qu’il provoque à lui seul une dépression psychologique.

> **Astuce mémoire — T-C-I :** **T**émoin, **C**omparaison, **I**nterprétation. Sans témoin, l’interprétation est fragile.
`,
    keyPoint: "Par rapport au témoin, la nicotine augmente l’activité globale enregistrée alors que le diazépam la diminue.",
    example: "Le même ganglion est comparé dans un liquide physiologique, avec nicotine puis avec diazépam : seule la substance change.",
    methodSteps: [
      "Identifie l’expérience témoin et la variable modifiée.",
      "Compare fréquence et amplitude globale sans expliquer trop tôt.",
      "Qualifie ensuite l’effet d’excitateur ou d’inhibiteur.",
      "Conclue uniquement dans les limites du protocole.",
    ],
    interaction: diagram(
      "Trois enregistrements, une seule variable",
      "Ouvre chaque condition puis compare-la au témoin.",
      "Ganglion nerveux de phasme",
      "L’activité extracellulaire composée est enregistrée pendant que le milieu autour du ganglion change.",
      [
        { id: "control", label: "Liquide physiologique", role: "Témoin", detail: "Fréquence et amplitude globale de référence : aucune des deux substances étudiées n’est ajoutée.", group: "Conditions" },
        { id: "nicotine", label: "Solution de nicotine", role: "Activité accrue", detail: "Le signal composé présente davantage de variations : le document conclut à un effet excitateur dans ce modèle.", group: "Conditions" },
        { id: "diazepam", label: "Solution de diazépam", role: "Activité réduite", detail: "Les variations deviennent rares et faibles : le document conclut à un effet inhibiteur ou sédatif.", group: "Conditions" },
        { id: "variable", label: "Variable étudiée", role: "La substance", detail: "Le ganglion et l’enregistrement restent comparables ; le liquide contenant la substance est la variable expérimentale.", group: "Raisonnement" },
        { id: "limit", label: "Limite du tracé", role: "Signal composé", detail: "On ne transforme pas la loi du tout-ou-rien : le ganglion réunit plusieurs fibres dont l’activité se superpose.", group: "Raisonnement" },
      ],
      "Le protocole montre des effets opposés sur une activité nerveuse globale ; il ne suffit pas encore à identifier la cible moléculaire.",
    ),
    questions: [
      choice("Quelle expérience sert de témoin ?", ["Le ganglion dans le liquide physiologique", "Le ganglion dans la nicotine", "Le ganglion dans le diazépam", "Le ganglion sans enregistrement"], 0, "Le milieu physiologique fournit l’activité de référence.", "Expérience 1 • page 1"),
      choice("Quelle variable change entre les trois expériences ?", ["L’espèce du phasme", "La substance présente dans le milieu", "La durée de la leçon", "Le nombre de ganglions"], 1, "Le protocole compare les liquides entourant le même type de préparation.", "Protocole • pages 1-2"),
      choice("Par rapport au témoin, la nicotine produit dans le document…", ["une activité identique", "la disparition du ganglion", "une activité globale plus fréquente et plus ample", "seulement un changement de couleur"], 2, "Le tracé devient globalement plus actif.", "Résultats • page 2"),
      choice("Par rapport au témoin, le diazépam produit…", ["une fréquence accrue", "une amplitude illimitée", "aucun effet observable", "une activité globale plus faible et moins fréquente"], 3, "Le troisième enregistrement est fortement réduit.", "Résultats • page 2"),
      choice("Quelle conclusion est justifiée par le protocole ?", ["Les substances étudiées peuvent avoir des effets nerveux opposés", "Toutes les drogues ont le même effet", "Le diazépam excite toujours les neurones", "La nicotine bloque toute activité"], 0, "Une substance augmente l’activité globale, l’autre la réduit.", "Conclusion 1-5 • page 2"),
      trueFalse("Un potentiel d’action isolé peut prendre n’importe quelle amplitude selon la dose de nicotine.", false, "Le potentiel d’action individuel est tout-ou-rien ; le tracé du ganglion est composé."),
      choice("Le diazépam renforce surtout l’action de quel neurotransmetteur inhibiteur ?", ["Dopamine", "GABA", "Adrénaline", "Acétylcholine"], 1, "Le diazépam est un modulateur positif des récepteurs GABA_A."),
      choice("Dans ce contexte, « dépresseur du système nerveux central » signifie…", ["cause certaine de dépression morale", "jugement sur la personne", "diminution de l’activité nerveuse", "absence de tout effet"], 2, "Le terme décrit un effet physiologique inhibiteur ou sédatif."),
      short("Donne les trois lettres de la méthode de comparaison : témoin, comparaison, interprétation.", ["TCI", "T-C-I", "tci"], "TCI aide à structurer l’analyse expérimentale."),
    ],
    corrections: [
      "Le terme stigmatisant « drogués » est remplacé par un vocabulaire centré sur la personne.",
      "L’amplitude d’un potentiel d’action isolé reste tout-ou-rien ; l’enregistrement du ganglion est interprété comme un signal extracellulaire composé.",
      "« Effet psycho-dépressif » est précisé en effet dépresseur du système nerveux central ou sédatif, sans confusion avec la dépression.",
      "Le mécanisme GABA_A du diazépam est ajouté pour expliquer l’inhibition observée.",
    ],
  },
  {
    id: "normal-synapse",
    title: "Comprendre le fonctionnement normal d’une synapse",
    summary: "Suivre libération, fixation, réponse postsynaptique puis arrêt du signal.",
    pages: "2-3 et 7-9",
    section: "Synapse dopaminergique normale et documents de consolidation",
    durationMinutes: 24,
    xp: 55,
    body: `
## 1. Le passage électrique → chimique → électrique

Une synapse chimique relie un élément **présynaptique** à un élément **postsynaptique**. Le message arrive électriquement dans le bouton, traverse la fente sous forme chimique, puis modifie électriquement la cellule suivante.

| Étape | Événement essentiel |
|---|---|
| 1 | le potentiel d’action atteint le bouton présynaptique |
| 2 | des canaux calciques s’ouvrent et $\\mathrm{Ca^{2+}}$ entre |
| 3 | les vésicules fusionnent avec la membrane : **exocytose** |
| 4 | le neurotransmetteur diffuse dans la fente |
| 5 | il se fixe à des récepteurs postsynaptiques spécifiques |
| 6 | les canaux ou voies de signalisation modifient l’excitabilité de la cellule cible |
| 7 | le neurotransmetteur se dissocie ; recapture, diffusion ou métabolisme arrêtent le signal |

## 2. L’exemple de la dopamine

Dans le document 1 de l’exercice 3, un neurone de l’**aire tegmentale ventrale** libère de la dopamine vers un neurone du **noyau accumbens**. La dopamine se fixe à ses récepteurs, puis une partie est reprise dans le bouton présynaptique par le **transporteur de dopamine DAT**.

La recapture ne « nie » pas le message : elle règle sa durée et recycle une partie du neurotransmetteur. Si DAT est bloqué, la dopamine reste plus longtemps dans la fente.

## 3. Une correction importante du texte source

Le corrigé indique qu’une enzyme « libère le neuromédiateur fixé », puis qu’il est réabsorbé. En réalité, la molécule se **dissocie** de son récepteur. Selon le neurotransmetteur, le signal est ensuite arrêté surtout par recapture, dégradation enzymatique ou diffusion. Pour la dopamine, la recapture par DAT joue un rôle majeur.

## 4. Excitation et inhibition dépendent du récepteur

Un neurotransmetteur n’est pas une étiquette universelle « excitateur » ou « inhibiteur ». Son effet dépend du **récepteur**, de la cellule et du circuit. Dans le modèle scolaire dopaminergique présenté, une dopamine qui persiste dans la fente prolonge la stimulation du circuit étudié.

> **Astuce mémoire — E-F-R :** **E**xocytose, **F**ixation, **R**ecapture. Une substance peut perturber chacune de ces étapes.
`,
    keyPoint: "Le message synaptique suit PA → Ca²⁺ → exocytose → récepteur → réponse → dissociation et recapture/métabolisme.",
    example: "Bloquer DAT ne crée pas la dopamine : cela empêche surtout sa recapture après sa libération.",
    methodSteps: [
      "Repère le bouton présynaptique, la fente et la membrane postsynaptique.",
      "Remets les étapes dans l’ordre du potentiel d’action à la réponse.",
      "Identifie le mécanisme qui termine normalement le signal.",
      "Localise ensuite l’étape perturbée par la substance.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Synapse redessinée",
      title: "Suivre un message dopaminergique",
      instruction: "Sélectionne les repères dans l’ordre, de l’arrivée du message à sa terminaison.",
      viewBox: "0 0 760 390",
      caption: "Figure originale redessinée d’après les documents des pages 7 et 9 ; aucun scan n’est intégré.",
      shapes: normalSynapseShapes,
      hotspots: normalSynapseHotspots,
      observation: "La synapse possède plusieurs cibles possibles : libération, récepteur, recapture et métabolisme. Deux substances peuvent donc produire un effet voisin par des mécanismes différents.",
    },
    questions: [
      choice("Quelle étape suit immédiatement l’arrivée du potentiel d’action au bouton ?", ["La recapture de la dopamine", "L’ouverture de canaux calciques", "La division du neurone", "La disparition des récepteurs"], 1, "L’entrée de Ca²⁺ déclenche l’exocytose.", "Corrigé exercice 3 • page 8"),
      choice("Comment le neurotransmetteur gagne-t-il la fente ?", ["Par mitose", "Par osmose du noyau", "Par exocytose des vésicules", "Par réplication"], 2, "Les vésicules fusionnent avec la membrane présynaptique.", "Corrigé exercice 3 • page 8"),
      choice("Où se trouvent les récepteurs activés dans le schéma simplifié ?", ["Sur la membrane postsynaptique", "Dans le noyau du phasme", "Dans le sang uniquement", "Sur le document papier"], 0, "Le neurotransmetteur traverse la fente et se fixe sur la cellule cible.", "Document 1 • page 7"),
      choice("Quel transporteur reprend la dopamine dans le bouton présynaptique ?", ["GABA_A", "Na⁺/K⁺-ATPase uniquement", "ARN polymérase", "DAT"], 3, "DAT signifie transporteur de dopamine."),
      trueFalse("La recapture contribue à limiter la durée du signal dopaminergique.", true, "Elle retire une partie de la dopamine de la fente."),
      choice("Pourquoi la phrase « une enzyme libère le neurotransmetteur fixé » est-elle corrigée ?", ["Le neurotransmetteur devient un ion", "La molécule se dissocie du récepteur puis est recaptée, diffusée ou métabolisée", "Aucune molécule ne se fixe", "Toutes les synapses sont électriques"], 1, "Dissociation et terminaison du signal sont des étapes distinctes.", "Corrigé source précisé • page 8"),
      choice("Dans le document, quels territoires sont reliés par la synapse dopaminergique ?", ["Cervelet et moelle", "Rétine et muscle", "Aire tegmentale ventrale et noyau accumbens", "Hypophyse et rein"], 2, "Ces deux structures sont nommées dans le corrigé.", "Document 1 • pages 7-8"),
      choice("Quel ordre est correct ?", ["Récepteur → PA → exocytose → Ca²⁺", "Recapture → exocytose → PA → récepteur", "PA → exocytose → Ca²⁺ → récepteur", "PA → Ca²⁺ → exocytose → récepteur"], 3, "Le calcium entre avant la fusion des vésicules."),
      short("Complète : potentiel d’action → Ca²⁺ → … → récepteur.", ["exocytose", "l’exocytose"], "L’exocytose libère le neurotransmetteur dans la fente."),
      choice("Pourquoi faut-il connaître la synapse normale avant l’effet d’une substance ?", ["Pour repérer précisément l’étape perturbée", "Pour apprendre uniquement le dessin", "Pour éviter toute comparaison", "Parce que toutes les substances détruisent la synapse"], 0, "Le mécanisme normal sert de témoin conceptuel."),
    ],
    corrections: [
      "La terminaison du signal dopaminergique est corrigée : dissociation du récepteur puis recapture par DAT, diffusion ou métabolisme, et non « enzyme qui libère le neurotransmetteur fixé ».",
      "L’entrée de Ca²⁺, l’exocytose et la recapture sont distinguées comme étapes successives.",
      "L’effet d’un neurotransmetteur est relié au récepteur et au circuit, plutôt qu’à une étiquette universelle.",
    ],
  },
  {
    id: "stimulant-mechanisms",
    title: "Distinguer amphétamine et cocaïne",
    summary: "Comparer une libération accrue de dopamine à un blocage de sa recapture.",
    pages: "2-3 et 5",
    section: "Modes d’action des substances psychostimulantes et situation d’évaluation",
    durationMinutes: 25,
    xp: 65,
    body: `
## 1. Même effet général, mécanismes différents

Le PDF classe l’amphétamine et la cocaïne parmi les **psychostimulants**. Elles peuvent toutes deux augmenter et prolonger la signalisation dopaminergique, mais il faut distinguer leurs cibles immédiates.

| Substance | Étape surtout perturbée dans le modèle | Conséquence dans la fente |
|---|---|---|
| amphétamine | stockage et transport présynaptiques ; libération accrue et flux de DAT pouvant s’inverser | davantage de dopamine est mise à disposition |
| cocaïne | blocage du transporteur DAT | la dopamine déjà libérée est moins recaptée |

## 2. L’amphétamine

Le schéma officiel montre une **libération accrue** de dopamine. À un niveau plus précis, l’amphétamine entre dans le neurone présynaptique par des transporteurs, perturbe le stockage vésiculaire et favorise un flux sortant de monoamines. Le résultat attendu au programme reste : davantage de dopamine dans la fente et une stimulation prolongée.

## 3. La cocaïne

La cocaïne se fixe sur le **transporteur de dopamine DAT** et empêche la recapture. La dopamine ne rentre donc pas normalement dans le bouton présynaptique ; elle s’accumule temporairement dans la fente et active plus longtemps les récepteurs.

> **Correction majeure :** le corrigé de la page 8 attribue à la cocaïne une « libération continue » après pénétration dans le neurone. Ce mécanisme correspond beaucoup mieux à l’amphétamine. Pour la cocaïne, le mécanisme central demandé est le **blocage de la recapture**.

## 4. Construire une réponse notée

Pour chaque substance, écris trois éléments :

1. **site** : synapse dopaminergique, surtout élément présynaptique ;
2. **mécanisme** : libération accrue pour l’amphétamine / recapture bloquée pour la cocaïne ;
3. **effet** : dopamine plus abondante ou persistante, stimulation postsynaptique prolongée, effet psychostimulant.

> **Astuce mémoire — A sort, C conserve :** l’**A**mphétamine favorise la **sortie** ; la **C**ocaïne **conserve** la dopamine dans la fente en bloquant sa reprise.
`,
    keyPoint: "Amphétamine : disponibilité/libération accrue ; cocaïne : DAT bloqué et recapture réduite ; effet commun : stimulation prolongée.",
    example: "Deux routes mènent à davantage de dopamine synaptique : augmenter sa sortie ou empêcher son retour.",
    methodSteps: [
      "Nomme le site d’action : la synapse dopaminergique.",
      "Identifie l’étape touchée : libération ou recapture.",
      "Déduis l’évolution de la dopamine dans la fente.",
      "Relie cette évolution à la durée de la stimulation postsynaptique.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Deux synapses redessinées",
      title: "Même effet, deux chemins",
      instruction: "Explore d’abord l’amphétamine, puis la cocaïne et compare les cibles.",
      viewBox: "0 0 760 390",
      caption: "Figure originale inspirée des schémas des pages 2, 3 et 5 ; aucun scan n’est intégré.",
      shapes: stimulantSynapseShapes,
      hotspots: stimulantSynapseHotspots,
      observation: "La concentration synaptique augmente dans les deux cas, mais une copie complète distingue la sortie accrue du blocage de la recapture.",
    },
    questions: [
      choice("Quel est le site d’action commun indiqué dans l’évaluation ?", ["Le rein", "La synapse", "Le muscle uniquement", "Le globule rouge"], 1, "Les deux substances perturbent une synapse dopaminergique.", "Situation d’évaluation, question 1 • page 5"),
      choice("Quel mécanisme correspond à l’amphétamine dans le modèle du cours ?", ["Destruction de tous les récepteurs", "Blocage du calcium musculaire", "Libération accrue de dopamine", "Recapture accélérée"], 2, "Le document la représente du côté présynaptique en favorisant la disponibilité/libération.", "Situation d’évaluation, question 2 • page 5"),
      choice("Quel mécanisme correspond à la cocaïne ?", ["Fabrication d’un neurone", "Activation de GABA_A", "Dégradation immédiate de la dopamine", "Blocage de DAT et de la recapture"], 3, "La cocaïne empêche le transporteur de reprendre normalement la dopamine.", "Document 1, figure B • pages 2-3"),
      choice("Que devient la dopamine si DAT est bloqué ?", ["Elle persiste davantage dans la fente", "Elle devient de l’ADN", "Elle disparaît instantanément", "Elle traverse le crâne"], 0, "La recapture réduite prolonge la présence synaptique."),
      trueFalse("L’amphétamine et la cocaïne ont nécessairement le même mécanisme parce qu’elles ont un effet stimulant commun.", false, "Un effet voisin peut résulter de cibles immédiates différentes.", "Situation d’évaluation • page 5"),
      choice("Quelle phrase corrige le mieux la page 8 ?", ["La cocaïne inhibe les récepteurs GABA_A", "La cocaïne bloque surtout la recapture de dopamine", "La cocaïne produit la dopamine dans le sang", "La cocaïne transforme la dopamine en sérotonine"], 1, "Le blocage de DAT est le mécanisme central à retenir.", "Corrigé exercice 3 précisé • page 8"),
      choice("Quel effet commun peut être déduit ?", ["Une paralysie obligatoire", "L’absence de tout message", "Une stimulation postsynaptique prolongée", "Une baisse certaine de dopamine"], 2, "La dopamine plus disponible ou persistante stimule plus longtemps.", "Situation d’évaluation, question 3 • pages 5-6"),
      choice("Quel triplet donne une réponse complète ?", ["Nom → jugement → punition", "Couleur → forme → taille", "Dose → prix → publicité", "Site → mécanisme → effet"], 3, "Cette chaîne répond aux trois consignes du sujet."),
      short("Quel transporteur de dopamine est bloqué par la cocaïne ?", ["DAT", "dat", "le transporteur DAT", "transporteur de dopamine"], "DAT assure normalement une grande partie de la recapture de dopamine."),
      choice("L’astuce « A sort, C conserve » signifie…", ["amphétamine : sortie accrue ; cocaïne : dopamine conservée dans la fente", "amphétamine : arrêt ; cocaïne : calcium", "alcool : sortie ; café : conservation", "aucune différence"], 0, "Elle résume sans confondre les deux mécanismes."),
    ],
    corrections: [
      "Le mécanisme de la cocaïne est rétabli en blocage du transporteur DAT et de la recapture, et non en libération continue après pénétration dans le neurone.",
      "L’amphétamine est précisée comme agissant sur le stockage et les transporteurs présynaptiques, avec disponibilité/libération accrue de monoamines.",
      "L’expression « mêmes effets » est nuancée : l’effet psychostimulant général est voisin, mais les mécanismes immédiats diffèrent.",
    ],
  },
  {
    id: "inhibitory-modulation",
    title: "Corriger et classer les mécanismes inhibiteurs",
    summary: "Relier diazépam, morphine et LSD à leurs vraies cibles sans les confondre.",
    pages: "3-4 et 6-7",
    section: "Modes d’action inhibiteurs, analgésie et exercice de classement",
    durationMinutes: 26,
    xp: 70,
    body: `
## 1. « Inhibiteur » ne désigne pas un mécanisme unique

Une activité nerveuse peut diminuer si une substance :

- réduit la libération d’un neurotransmetteur excitateur ;
- augmente une inhibition normale, par exemple via le GABA ;
- active un récepteur inhibiteur ;
- bloque un récepteur nécessaire à la transmission ;
- modifie des canaux ioniques et rend le neurone moins excitable.

## 2. Diazépam : renforcer l’inhibition GABAergique

Le diazépam se fixe sur un site allostérique du récepteur $\\mathrm{GABA_A}$. En présence de GABA, il augmente la probabilité/fréquence d’ouverture du canal chlorure : l’entrée de $\\mathrm{Cl^-}$ favorise l’hyperpolarisation et réduit l’excitabilité. Il ne remplace pas le GABA et ne doit être utilisé que sous prescription.

## 3. Morphine : activer les récepteurs opioïdes

La morphine est un **agoniste des récepteurs opioïdes**, notamment $\\mu$. Leur activation peut :

- diminuer l’entrée présynaptique de $\\mathrm{Ca^{2+}}$ et donc la libération de médiateurs nociceptifs comme le glutamate ou la substance P ;
- augmenter la sortie postsynaptique de $\\mathrm{K^+}$ et hyperpolariser la cellule.

> **Correction :** la substance P transmet des messages nociceptifs ; les enképhalines sont des peptides opioïdes endogènes qui activent des récepteurs inhibiteurs. « Substance P (enképhaline) responsable de la douleur » mélange donc deux molécules différentes.

## 4. LSD : hallucinogène, pas simple bloqueur de sérotonine

Le PDF affirme que le LSD inhibe l’action de la sérotonine. Cette formulation est trop simple et trompeuse : le LSD agit principalement comme **agoniste partiel de récepteurs sérotoninergiques**, en particulier $5\\text{-HT}_{2A}$, ce qui perturbe les circuits de perception et de cognition. Il est mieux classé comme **hallucinogène** que comme simple dépresseur.

## 5. Trois familles utiles, avec prudence

| Famille pédagogique | Exemples | Effet dominant possible |
|---|---|---|
| psychostimulants | nicotine, amphétamine, cocaïne | vigilance/excitation accrues |
| dépresseurs/sédatifs | benzodiazépines, alcool | activité centrale ralentie |
| hallucinogènes | LSD | perception et cognition altérées |

Les effets réels varient avec la dose, la voie, le mélange, le contexte et la personne. Une même substance peut produire plusieurs effets et présenter des risques graves.

> **Astuce mémoire — Cible avant classe :** commence toujours par le récepteur, le transporteur ou le canal touché ; la catégorie générale vient ensuite.
`,
    keyPoint: "Diazépam : GABA_A renforcé ; morphine : récepteurs opioïdes ; LSD : surtout agonisme sérotoninergique 5-HT₂A.",
    example: "Deux substances peuvent réduire une activité, l’une en renforçant GABA, l’autre en activant un récepteur opioïde.",
    methodSteps: [
      "Nomme la cible moléculaire ou l’étape synaptique.",
      "Indique si la substance active, renforce ou bloque cette cible.",
      "Déduis l’effet sur l’excitabilité ou la transmission.",
      "Évite de transformer une famille pédagogique en règle absolue.",
    ],
    interaction: diagram(
      "Trois substances, trois cibles",
      "Ouvre chaque mécanisme puis compare cible, action et effet.",
      "Modulation de la transmission nerveuse",
      "Un ralentissement apparent peut résulter d’un renforcement de l’inhibition, d’une activation opioïde ou d’autres modifications de circuits.",
      [
        { id: "diazepam-target", label: "Diazépam", role: "Modulateur GABA_A", detail: "Il renforce l’effet du GABA sur un canal chlorure et réduit l’excitabilité ; ce n’est pas un simple bouchon de récepteur.", group: "Cibles" },
        { id: "morphine-target", label: "Morphine", role: "Agoniste opioïde", detail: "Elle active des récepteurs opioïdes, réduit certains médiateurs nociceptifs et hyperpolarise des neurones.", group: "Cibles" },
        { id: "lsd-target", label: "LSD", role: "Hallucinogène sérotoninergique", detail: "Il active notamment les récepteurs 5-HT2A et perturbe perception et cognition ; il ne se résume pas à bloquer la sérotonine.", group: "Cibles" },
        { id: "substance-p", label: "Substance P", role: "Médiateur nociceptif", detail: "Elle participe à la transmission de la douleur ; sa libération peut être réduite par l’activation opioïde présynaptique.", group: "À ne pas confondre" },
        { id: "enkephalin", label: "Enképhalines", role: "Opioïdes endogènes", detail: "Elles activent naturellement des récepteurs opioïdes ; elles ne sont pas un autre nom de la substance P.", group: "À ne pas confondre" },
      ],
      "Le raisonnement correct part de la cible et du mécanisme, pas d’une étiquette unique « excitant/inhibiteur ».",
    ),
    questions: [
      choice("Quel récepteur est renforcé par le diazépam ?", ["DAT", "Récepteur à l’insuline", "GABA_A", "Récepteur à l’ADN"], 2, "Le diazépam est un modulateur allostérique positif de GABA_A."),
      choice("Quel mouvement ionique participe à l’hyperpolarisation GABA_A ?", ["Sortie massive d’ADN", "Entrée de Cl⁻", "Entrée de glucose par DAT", "Sortie de Ca²⁺ du noyau"], 1, "Le canal GABA_A laisse entrer des ions chlorure dans le modèle simplifié."),
      choice("La morphine agit principalement en…", ["activant des récepteurs opioïdes", "bloquant DAT uniquement", "fabriquant de la substance P", "détruisant tous les neurones"], 0, "C’est un agoniste opioïde, notamment des récepteurs μ."),
      choice("Quelle proposition distingue correctement substance P et enképhalines ?", ["Ce sont deux noms du même ion", "La substance P est un récepteur", "Les enképhalines transmettent uniquement la douleur", "La substance P est nociceptive ; les enképhalines sont des opioïdes endogènes"], 3, "Le PDF mélange ces deux familles de molécules."),
      choice("Comment faut-il corriger le mécanisme attribué au LSD ?", ["Il bloque toujours toute sérotonine", "Il active notamment des récepteurs sérotoninergiques 5-HT2A", "Il agit uniquement sur DAT", "Il ne touche aucun circuit nerveux"], 1, "Le LSD est un hallucinogène sérotoninergique, pas un simple inhibiteur.", "Précision du passage LSD • page 4"),
      trueFalse("Une même étiquette « inhibiteur » prouve que deux substances ont la même cible.", false, "Des mécanismes différents peuvent tous réduire une activité."),
      choice("Quel effet présynaptique peut suivre l’activation d’un récepteur opioïde ?", ["Augmentation obligatoire de Ca²⁺", "Synthèse d’ADN", "Diminution de la libération de glutamate ou substance P", "Blocage de toute respiration cellulaire"], 2, "La réduction de l’entrée de Ca²⁺ diminue l’exocytose de médiateurs nociceptifs."),
      choice("Dans quelle famille pédagogique classe-t-on surtout le LSD ?", ["Hallucinogènes", "Antibiotiques", "Vitamines", "Hormones sexuelles"], 0, "Son effet dominant concerne la perception et la cognition."),
      choice("Pourquoi la catégorie d’une substance n’est-elle pas une règle absolue ?", ["Parce que les neurones n’existent pas", "Parce que dose, voie, mélange, circuit et personne modifient les effets", "Parce que toutes les doses sont identiques", "Parce que le récepteur n’a aucun rôle"], 1, "Les effets dépendent de plusieurs paramètres."),
      short("Quel peptide du PDF est confondu avec les enképhalines ?", ["substance P", "la substance P", "Substance P"], "La substance P et les enképhalines sont distinctes.", "Passage morphine corrigé • page 4"),
    ],
    corrections: [
      "La substance P, médiateur nociceptif, est distinguée des enképhalines, opioïdes endogènes.",
      "La morphine est décrite comme agoniste de récepteurs opioïdes avec effets pré- et postsynaptiques, pas comme bouchon mécanique unique.",
      "Le diazépam est précisé comme modulateur allostérique positif de GABA_A.",
      "Le LSD n’est plus présenté comme simple inhibiteur de la sérotonine : son agonisme partiel, notamment sur 5-HT2A, et son classement hallucinogène sont rétablis.",
    ],
  },
  {
    id: "health-social-prevention",
    title: "Prévenir les risques et orienter vers l’aide",
    summary: "Distinguer effets sur la santé, conséquences sociales, prévention et prise en charge sans stigmatiser.",
    pages: "4-5",
    section: "Conséquences, mesures préventives et mesures curatives",
    durationMinutes: 23,
    xp: 75,
    body: `
## 1. Des risques multiples, jamais une destinée automatique

Le PDF distingue les conséquences sur l’organisme et sur la vie sociale. Cette distinction est utile, mais plusieurs formulations sont trop absolues. Une consommation ne conduit pas automatiquement à la « folie », à la délinquance ou à l’éclatement d’une famille. Les risques dépendent notamment :

- de la substance, de la dose, de la fréquence et de la voie d’administration ;
- des mélanges, en particulier avec l’alcool ou des médicaments sédatifs ;
- de l’âge, de l’état de santé et du contexte psychologique ;
- de la vulnérabilité sociale et de l’accès aux soins.

## 2. Conséquences possibles sur la santé

| Horizon | Exemples possibles |
|---|---|
| immédiat | altération du jugement, anxiété, agitation, somnolence, accident, intoxication |
| répété | tolérance, dépendance, troubles du sommeil, de l’humeur, de l’attention ou de la mémoire |
| selon le produit | atteintes cardiovasculaires, respiratoires, neurologiques, infectieuses ou nutritionnelles |

Le terme **trouble de l’usage d’une substance** désigne une difficulté persistante à contrôler l’usage malgré des conséquences négatives. C’est un problème de santé qui peut être traité ; ce n’est ni une faiblesse morale ni une identité.

## 3. Conséquences sociales possibles

Les difficultés scolaires ou professionnelles, conflits, isolement, dépenses, violences subies ou commises et problèmes judiciaires peuvent survenir. On ne doit toutefois pas les attribuer mécaniquement à toute personne qui consomme : l’analyse doit rester factuelle et éviter la stigmatisation.

## 4. Prévenir

Une prévention efficace ne se limite pas à dire « non ». Elle combine :

1. information fiable sur les produits et les mélanges ;
2. compétences pour résister à la pression du groupe ;
3. activités et liens sociaux protecteurs ;
4. repérage précoce d’un mal-être ou d’un usage à risque ;
5. dialogue avec un adulte de confiance ou un professionnel.

## 5. Aider et soigner

La prise en charge peut associer évaluation médicale, accompagnement psychologique et social, traitement de symptômes ou de certaines dépendances, soutien familial et suivi dans le temps. Le mot « désintoxication » du PDF correspond seulement à une partie éventuelle du soin : le rétablissement ne s’arrête pas au sevrage.

> **Sécurité :** une personne inconsciente, qui respire difficilement, convulse, présente une douleur thoracique ou une agitation extrême après consommation nécessite une aide médicale urgente. Ne la laisse pas seule et transmets honnêtement les produits suspectés aux secours.

> **Astuce mémoire — P-A-S :** **P**révenir, **A**ccompagner, **S**oigner. Punir ou humilier n’explique pas le mécanisme et n’aide pas au rétablissement.
`,
    keyPoint: "Les risques sont biologiques, psychologiques et sociaux ; prévention et soin reposent sur l’information, le soutien et des professionnels.",
    example: "Une baisse des résultats n’établit pas à elle seule une consommation : on observe, on dialogue sans juger et on oriente vers une aide compétente.",
    methodSteps: [
      "Classe les conséquences en santé, vie psychique et vie sociale.",
      "Emploie « peut » ou « augmente le risque » plutôt qu’une causalité automatique.",
      "Propose une prévention concrète et adaptée au contexte.",
      "Pour une personne en difficulté, privilégie écoute, orientation et suivi.",
    ],
    interaction: diagram(
      "Du risque au rétablissement",
      "Explore les quatre familles et repère ce qui relève de la santé, du contexte et de l’aide.",
      "Usage d’une substance psychoactive",
      "Les conséquences ne dépendent jamais d’un seul facteur ; agir tôt et sans jugement améliore l’accès à l’aide.",
      [
        { id: "acute", label: "Effets immédiats", role: "Sécurité", detail: "Altération du jugement, agitation, somnolence, accident ou intoxication peuvent exiger une aide rapide.", group: "Risques" },
        { id: "chronic", label: "Usage répété", role: "Santé", detail: "Tolérance, dépendance et troubles physiques ou psychiques peuvent apparaître selon le produit et l’exposition.", group: "Risques" },
        { id: "social", label: "Vie sociale", role: "Contexte", detail: "Conflits, isolement ou difficultés scolaires sont possibles, mais jamais automatiques ni suffisants pour juger une personne.", group: "Risques" },
        { id: "prevention", label: "Prévention", role: "Informer et protéger", detail: "Information fiable, compétences psychosociales, activités protectrices et dialogue réduisent les risques.", group: "Réponses" },
        { id: "care", label: "Prise en charge", role: "Soins dans la durée", detail: "Évaluation médicale, soutien psychologique et social, traitements adaptés et suivi peuvent être combinés.", group: "Réponses" },
        { id: "emergency", label: "Signes d’urgence", role: "Alerter", detail: "Inconscience, respiration difficile, convulsion, douleur thoracique ou agitation extrême imposent une aide médicale urgente.", group: "Réponses" },
      ],
      "Une réponse utile associe réduction des risques, accès aux soins et respect de la personne.",
    ),
    questions: [
      choice("Quelle formulation est scientifiquement la plus juste ?", ["Toute consommation provoque automatiquement la délinquance", "Le risque varie selon le produit, la dose, les mélanges et la personne", "Une personne dépendante manque seulement de volonté", "Le sevrage suffit toujours"], 1, "Les conséquences dépendent de nombreux facteurs."),
      choice("Qu’est-ce qu’un trouble de l’usage d’une substance ?", ["Une identité définitive", "Un jugement moral", "Une difficulté persistante à contrôler l’usage malgré des conséquences", "Un simple synonyme de tristesse"], 2, "C’est un problème de santé qui peut être pris en charge."),
      choice("Laquelle est une conséquence immédiate possible ?", ["Altération du jugement et accident", "Mutation instantanée de l’ADN de tous les neurones", "Disparition du cerveau", "Immunité absolue"], 0, "Le jugement et la coordination peuvent être rapidement perturbés."),
      choice("Quelle mesure relève d’une prévention efficace ?", ["Humilier la personne", "Cacher les risques", "Rompre tout dialogue", "Informer, développer les compétences et offrir un adulte de confiance"], 3, "La prévention combine connaissances, capacités d’action et soutien."),
      trueFalse("Le mot « désintoxication » décrit à lui seul toute la prise en charge d’une dépendance.", false, "Le soin peut nécessiter un accompagnement médical, psychologique et social prolongé.", "Mesures curatives • page 5"),
      choice("Quel signe impose une aide médicale urgente après une consommation ?", ["Envie de parler du cours", "Respiration difficile", "Question sur le mécanisme", "Sommeil normal"], 1, "Une difficulté respiratoire peut engager le pronostic vital."),
      choice("Que faire devant une personne inconsciente après consommation ?", ["La laisser seule", "Lui faire honte", "Chercher une aide médicale urgente et transmettre les produits suspectés", "Attendre plusieurs heures sans surveiller"], 2, "La sécurité et l’information des secours sont prioritaires."),
      choice("Pourquoi éviter l’étiquette « drogué » ?", ["Elle réduit une personne à un comportement et renforce la stigmatisation", "Elle décrit une molécule", "Elle améliore toujours les soins", "Elle remplace un diagnostic précis"], 0, "Le vocabulaire centré sur la personne favorise le respect et l’accès à l’aide."),
      choice("Quelle chaîne résume le niveau ?", ["Punir–Accuser–Séparer", "Produit–Argent–Secret", "Peur–Abandon–Silence", "Prévenir–Accompagner–Soigner"], 3, "P-A-S réunit les trois réponses utiles."),
      short("Donne le sigle de l’astuce : Prévenir, Accompagner, Soigner.", ["PAS", "P-A-S", "pas"], "PAS aide à mémoriser prévention, accompagnement et soin."),
    ],
    corrections: [
      "Les liens automatiques entre consommation, « folie », délinquance, dégradation des mœurs et éclatement familial sont remplacés par des risques possibles et contextualisés.",
      "Le trouble de l’usage est présenté comme un problème de santé traitable, sans jugement moral ni identité stigmatisante.",
      "La cure de « désintoxication » est replacée dans une prise en charge médicale, psychologique et sociale plus large et suivie.",
      "Des signes d’urgence et une conduite de protection sont ajoutés sans se substituer à un professionnel de santé.",
    ],
  },
  {
    id: "amphetamine-cocaine-assessment",
    title: "Résoudre l’évaluation amphétamine–cocaïne",
    summary: "Rédiger une réponse complète en distinguant site, mécanisme et effet commun.",
    pages: "5-6",
    section: "Situation d’évaluation officielle sur l’amphétamine et la cocaïne",
    durationMinutes: 22,
    xp: 80,
    kind: "practice",
    body: `
## Le problème posé

Le professeur présente deux synapses : l’une exposée à l’amphétamine, l’autre à la cocaïne. Il affirme que les deux substances ont les mêmes **effets** sur le fonctionnement nerveux. Il faut vérifier cette phrase sans confondre effet et mécanisme.

## 1. Relever le site d’action

Les deux substances agissent au niveau d’une **synapse dopaminergique**, avec une cible principalement présynaptique dans le modèle : transport, stockage ou recapture de la dopamine.

## 2. Expliquer chaque action

| Substance | Mécanisme attendu | Conséquence immédiate |
|---|---|---|
| amphétamine | favorise la disponibilité et la libération de dopamine | concentration synaptique accrue |
| cocaïne | bloque DAT et donc la recapture | dopamine plus longtemps présente |

## 3. Déduire l’effet

Dans les deux cas, la dopamine active plus fortement ou plus longtemps les récepteurs postsynaptiques : l’effet général est **psychostimulant**. La phrase du professeur est donc acceptable pour l’effet global, mais pas pour le mécanisme.

## Modèle de réponse rédigée

> L’amphétamine et la cocaïne agissent dans une synapse dopaminergique. L’amphétamine favorise la mise à disposition et la libération de dopamine par le neurone présynaptique, tandis que la cocaïne bloque le transporteur DAT et réduit la recapture. Dans les deux cas, la dopamine augmente ou persiste dans la fente, ce qui prolonge la stimulation postsynaptique. Les deux substances ont donc un effet psychostimulant voisin par des mécanismes immédiats différents.

## Barème conseillé

| Élément | Point essentiel |
|---|---|
| site | synapse dopaminergique |
| amphétamine | libération/disponibilité accrue |
| cocaïne | DAT et recapture bloqués |
| conséquence | dopamine accrue ou persistante |
| effet | stimulation postsynaptique prolongée |

> **Astuce mémoire — S-M-E :** **S**ite, **M**écanisme, **E**ffet. Chaque paragraphe doit contenir les trois.
`,
    keyPoint: "Même effet psychostimulant global, mais amphétamine et cocaïne perturbent des étapes différentes.",
    example: "Dire seulement « elles excitent » ne suffit pas : il faut expliquer comment chacune augmente la dopamine synaptique.",
    methodSteps: [
      "Commence par le site commun : la synapse dopaminergique.",
      "Rédige une phrase de mécanisme par substance.",
      "Déduis l’évolution de la dopamine dans la fente.",
      "Conclue sur l’effet commun tout en rappelant la différence de mécanisme.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Copie guidée",
      title: "Construire la réponse en quatre temps",
      instruction: "Parcours les étapes dans l’ordre avant de comparer ton paragraphe au modèle.",
      items: [
        { label: "1. Site", shortLabel: "Site", detail: "Les deux substances agissent au niveau d’une synapse dopaminergique." },
        { label: "2. Amphétamine", shortLabel: "Amphétamine", detail: "Elle augmente la disponibilité/libération présynaptique de dopamine." },
        { label: "3. Cocaïne", shortLabel: "Cocaïne", detail: "Elle bloque DAT et ralentit la recapture de dopamine." },
        { label: "4. Effet", shortLabel: "Effet", detail: "La dopamine plus abondante ou persistante prolonge la stimulation postsynaptique : effet psychostimulant." },
      ],
      observation: "Une excellente copie accepte l’effet commun annoncé, mais refuse d’en déduire un mécanisme identique.",
    },
    questions: [
      choice("Quel site doit apparaître dès la première phrase ?", ["La synapse dopaminergique", "Le rein", "La moelle osseuse", "L’estomac uniquement"], 0, "Le document représente deux synapses dopaminergiques.", "Question 1 • page 5"),
      choice("Quelle action attribuer à l’amphétamine ?", ["Recapture accélérée", "Libération/disponibilité accrue de dopamine", "Destruction de DAT", "Blocage des récepteurs opioïdes"], 1, "Elle augmente la dopamine mise à disposition dans la fente.", "Question 2 • page 5"),
      choice("Quelle action attribuer à la cocaïne ?", ["Activation de GABA_A", "Libération d’insuline", "Blocage de DAT et de la recapture", "Synthèse de substance P"], 2, "La cocaïne empêche le retour normal de dopamine.", "Question 2 • page 5"),
      choice("Quelle conséquence synaptique est commune ?", ["Moins de dopamine dans tous les cas", "Aucune réponse postsynaptique", "Transformation en GABA", "Dopamine accrue ou plus persistante"], 3, "Les deux mécanismes prolongent la disponibilité de dopamine."),
      trueFalse("L’affirmation du professeur est correcte pour l’effet global, mais pas pour le mécanisme immédiat.", true, "Les deux sont psychostimulantes sans agir exactement de la même manière.", "Problématique • page 5"),
      choice("Quelle conclusion répond à la troisième consigne ?", ["Effet psychostimulant avec stimulation postsynaptique prolongée", "Effet antibiotique", "Aucun effet nerveux", "Effet exclusivement musculaire"], 0, "Le document conduit à une excitation prolongée.", "Question 3 et corrigé • pages 5-6"),
      choice("Quel ordre suit S-M-E ?", ["Substance–Mémoire–Énergie", "Site–Mécanisme–Effet", "Sang–Muscle–Enzyme", "Signe–Maladie–Erreur"], 1, "Ce plan rend le raisonnement vérifiable."),
      choice("Quelle copie est incomplète ?", ["Elle nomme le site et les deux mécanismes", "Elle relie dopamine et réponse postsynaptique", "Elle écrit seulement « les deux excitent »", "Elle distingue effet et mécanisme"], 2, "L’effet sans mécanisme ne répond pas à la consigne d’explication."),
      short("Complète : la cocaïne bloque la … de la dopamine.", ["recapture", "réabsorption", "reprise", "la recapture"], "Le transporteur DAT ne reprend plus normalement la dopamine.", "Question 2 • page 5"),
    ],
    corrections: [
      "La réponse modèle conserve les trois consignes officielles tout en distinguant clairement effet commun et mécanismes différents.",
      "Le mécanisme de la cocaïne est corrigé en blocage de DAT/recapture.",
      "Le mécanisme de l’amphétamine est formulé comme disponibilité et libération accrues, plutôt que comme une simple « libre transmission ».",
    ],
  },
  {
    id: "consolidation-vocabulary",
    title: "Consolider les effets et le vocabulaire",
    summary: "Classer les indices excitateurs/inhibiteurs et compléter le texte scientifique officiel.",
    pages: "6-7",
    section: "Exercices 1 et 2 de consolidation avec corrigés",
    durationMinutes: 24,
    xp: 90,
    kind: "practice",
    body: `
## Exercice 1 — Classer les effets

Le PDF propose six expressions. Le classement fidèle est :

| Effets associés à une action excitatrice | Effets associés à une action inhibitrice |
|---|---|
| hyperexcitabilité | insensibilité dans le contexte analgésique |
| nombre élevé de complexes récepteur–neurotransmetteur | récepteurs bloqués dans le modèle fourni |
| potentiel postsynaptique excitateur élevé | absence de message postsynaptique |

> **Précision :** « récepteurs bloqués » n’est pas synonyme de toute inhibition. Le diazépam, par exemple, renforce un récepteur inhibiteur au lieu de le bloquer. Le tableau restitue l’exercice, pas une loi universelle.

## Exercice 2 — Compléter le texte

La banque de mots est : **neurosciences ; neurotransmetteurs ; action ; récepteurs ; mécanisme d’action ; drogues ; système nerveux ; analgésiques**.

Les réponses attendues sont :

1. action ;
2. système nerveux ;
3. neurosciences ;
4. mécanisme d’action ;
5. analgésiques ;
6. neurotransmetteurs ;
7. récepteurs ;
8. drogues.

Le passage rappelle que les opiacés possèdent une forme capable d’activer certains des mêmes récepteurs que les opioïdes endogènes. L’expression « même forme » reste un modèle : la reconnaissance moléculaire dépend de plusieurs interactions tridimensionnelles.

## Une méthode rapide pour les textes à trous

1. détermine la **nature grammaticale** attendue ;
2. cherche la **cohérence biologique** ;
3. barre chaque mot déjà utilisé ;
4. relis la phrase entière ;
5. vérifie qu’aucun mot ne reste sans place.

## Mini-synthèse

Un mécanisme complet peut se rédiger ainsi :

> Une substance agit sur une **cible** synaptique ; elle modifie une **étape** de la transmission ; cette modification change la **réponse** du neurone postsynaptique et peut produire un **effet** sur le comportement ou la perception.

> **Astuce mémoire — G-B-R :** **G**rammaire, **B**iologie, **R**electure pour réussir un texte à trous.
`,
    keyPoint: "Classer exige de relier chaque expression à une transmission accrue ou réduite, puis de vérifier le contexte du mécanisme.",
    example: "« Nombre élevé de complexes récepteur–neurotransmetteur » indique ici une stimulation accrue, mais ne suffit pas à identifier la substance.",
    methodSteps: [
      "Dans le classement, cherche si le message postsynaptique augmente ou diminue.",
      "Dans le texte à trous, détermine la catégorie grammaticale.",
      "Teste ensuite le sens scientifique de la phrase complète.",
      "Relis et vérifie que chaque terme est utilisé une seule fois.",
    ],
    interaction: diagram(
      "Trier sans généraliser",
      "Ouvre les indices, puis décide s’ils décrivent une transmission accrue ou réduite dans le contexte de l’exercice.",
      "Réponse postsynaptique",
      "Le classement porte sur l’effet observable ; le mécanisme exact doit toujours être ajouté séparément.",
      [
        { id: "hyper", label: "Hyperexcitabilité", role: "Activité accrue", detail: "Le neurone postsynaptique répond plus facilement ou plus longtemps.", group: "Excitateur" },
        { id: "complexes", label: "Nombre élevé de complexes", role: "Récepteurs davantage occupés", detail: "Une concentration synaptique élevée peut activer davantage de récepteurs.", group: "Excitateur" },
        { id: "ppse", label: "PPSE très élevé", role: "Dépolarisation accrue", detail: "Le potentiel postsynaptique excitateur rapproche davantage la membrane du seuil.", group: "Excitateur" },
        { id: "insensitive", label: "Insensibilité", role: "Transmission nociceptive réduite", detail: "Dans l’exercice, elle renvoie à l’analgésie par diminution d’un message de douleur.", group: "Inhibiteur" },
        { id: "blocked", label: "Récepteurs bloqués", role: "Fixation empêchée", detail: "Dans le schéma simplifié, le neurotransmetteur ne peut plus produire sa réponse.", group: "Inhibiteur" },
        { id: "absent", label: "Absence de message", role: "Réponse réduite", detail: "Aucun potentiel postsynaptique mesurable n’est produit dans le modèle.", group: "Inhibiteur" },
      ],
      "Le tableau est réussi quand chaque terme est classé et expliqué par son effet sur la cellule postsynaptique.",
    ),
    questions: [
      choice("Où classer « hyperexcitabilité » ?", ["Effet excitateur", "Effet inhibiteur", "Structure du chromosome", "Mesure sociale"], 0, "Le terme décrit une activité accrue.", "Exercice 1 • page 6"),
      choice("Où classer « absence de message postsynaptique » ?", ["Effet excitateur", "Effet inhibiteur", "Synthèse protéique", "Sécrétion hormonale"], 1, "L’absence de réponse indique ici une transmission réduite.", "Exercice 1 • page 6"),
      choice("Quel mot complète la lacune 1 : « substances ayant une … sur le fonctionnement » ?", ["récepteur", "neurosciences", "action", "analgésiques"], 2, "La construction grammaticale et le sens imposent « action ».", "Exercice 2 et corrigé • pages 6-7"),
      choice("Quel groupe complète la lacune 2 ?", ["mécanisme d’action", "neurotransmetteurs", "drogues", "système nerveux"], 3, "Les substances agissent sur le fonctionnement du système nerveux.", "Exercice 2 • page 6"),
      choice("Quel mot complète la lacune 3 ?", ["neurosciences", "récepteurs", "analgésiques", "action"], 0, "Les progrès des neurosciences permettent d’étudier les mécanismes.", "Corrigé exercice 2 • page 7"),
      choice("Quel groupe complète la lacune 4 ?", ["système nerveux", "mécanisme d’action", "récepteurs", "drogues"], 1, "On cherche à connaître le mécanisme d’action des substances.", "Corrigé exercice 2 • page 7"),
      choice("Les opiacés sont décrits dans le texte comme de puissants…", ["psychostimulants", "hormones", "analgésiques", "anticorps"], 2, "Le mot attendu à la lacune 5 est analgésiques.", "Exercice 2 • page 6"),
      choice("Sur quelles cibles opiacés et enképhalines peuvent-ils agir ?", ["Les ribosomes", "Les gènes", "Les transporteurs de glucose uniquement", "Des récepteurs opioïdes"], 3, "La ressemblance fonctionnelle permet d’activer des récepteurs opioïdes."),
      trueFalse("Tous les mécanismes inhibiteurs bloquent nécessairement un récepteur.", false, "Certains renforcent une inhibition normale ou diminuent une libération."),
      short("Donne les trois lettres de la méthode : Grammaire, Biologie, Relecture.", ["GBR", "G-B-R", "gbr"], "GBR structure la résolution d’un texte à trous."),
    ],
    corrections: [
      "Le classement officiel est conservé, mais sa portée est limitée au contexte : tous les effets inhibiteurs ne bloquent pas un récepteur.",
      "La ressemblance des opiacés et des opioïdes endogènes est formulée en reconnaissance tridimensionnelle de récepteurs opioïdes.",
      "Le texte à trous et ses huit réponses sont intégralement restitués après « J’ai compris ».",
    ],
  },
  {
    id: "cocaine-dopamine-mission",
    title: "Mission : expliquer la courbe dopamine–cocaïne",
    summary: "Analyser une courbe expérimentale, corriger sa lecture et relier les données au blocage de DAT.",
    pages: "7-9",
    section: "Exercice 3, synapse normale, courbe expérimentale et corrigé",
    durationMinutes: 28,
    xp: 105,
    kind: "challenge",
    body: `
## Le dossier expérimental

Deux groupes de rats sont comparés :

- un groupe reçoit une injection de cocaïne dans le modèle expérimental ;
- l’autre groupe sert de témoin sans injection.

Le graphique donne une **quantité relative de dopamine dans la fente synaptique**, en pourcentage, selon le temps. Il faut décrire les courbes avant d’expliquer le mécanisme.

## 1. Lire correctement les données

Sur le graphique, la courbe exposée à la cocaïne :

- part autour de $50\\,\\%$ au premier point visible ;
- augmente jusqu’à environ $230\\,\\%$ vers $50$ minutes ;
- redescend ensuite ;
- rejoint approximativement le niveau témoin vers $125$ minutes et atteint environ $40\\,\\%$ à $140$ minutes.

La courbe témoin reste globalement entre environ $45$ et $60\\,\\%$.

> **Correction de lecture :** le corrigé écrit « 30 % à 230 % à 40 minutes » et « témoin constant à 30 % ». Les points visibles indiquent plutôt un départ voisin de 50 %, un maximum proche de 230 % vers 50 minutes et un témoin proche de 45–60 %. Ce sont des lectures approchées : les axes et les points priment sur le texte.

## 2. Analyser

À temps comparable, la quantité de dopamine est beaucoup plus forte chez les rats exposés pendant la phase ascendante et le début de la descente. La différence maximale est observée près du sommet.

Une analyse correcte utilise des valeurs et évite « la courbe monte beaucoup » :

> Entre le premier point et environ 50 min, la quantité relative passe d’environ 50 % à 230 % dans le groupe exposé, alors que le témoin reste voisin de 50–55 %.

## 3. Interpréter

La cocaïne bloque le transporteur **DAT**. La dopamine libérée est moins recaptée, reste plus longtemps dans la fente et s’accumule temporairement. Elle active donc davantage et plus longtemps les récepteurs postsynaptiques du circuit étudié.

Le retour progressif de la courbe ne signifie pas que la cocaïne est sans danger : distribution, métabolisme, adaptations du circuit et autres mécanismes font évoluer l’effet au cours du temps.

## 4. Réponse modèle

> Le document 1 présente une synapse dopaminergique normale : après exocytose, la dopamine active des récepteurs puis est en partie recaptée par DAT. Le document 2 montre qu’après exposition à la cocaïne, sa quantité relative dans la fente atteint environ 230 % vers 50 min, bien au-dessus du témoin qui reste autour de 45–60 %. La cocaïne bloque DAT ; la dopamine est moins recaptée et persiste dans la fente. La stimulation postsynaptique est donc renforcée et prolongée, ce qui explique l’effet psychostimulant observé dans ce modèle.

## 5. La méthode attendue au BAC

1. présenter les documents ;
2. décrire chaque courbe avec unités et valeurs ;
3. comparer au même instant ;
4. mobiliser la synapse normale ;
5. nommer DAT et la recapture ;
6. déduire l’effet postsynaptique ;
7. conclure en une phrase.

> **Astuce mémoire — D-A-I-C :** **D**écrire, **A**nalyser, **I**nterpréter, **C**onclure.
`,
    keyPoint: "La courbe montre une accumulation transitoire de dopamine ; le mécanisme cohérent est le blocage de DAT et de la recapture.",
    example: "Vers 50 min : cocaïne ≈ 230 %, témoin ≈ 50–55 % ; l’écart appuie une persistance accrue de dopamine.",
    methodSteps: [
      "Lis les axes, les unités et les deux groupes.",
      "Relève début, maximum, décroissance et retour vers le témoin.",
      "Compare les groupes à un même instant.",
      "Explique la différence par DAT, puis conclus sur la réponse postsynaptique.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "Suivre la dopamine après exposition à la cocaïne",
      instruction: "Déplace le point et repère le maximum puis le retour vers la zone témoin.",
      formula: "Quantité relative de dopamine (%)",
      rule: { kind: "samples", points: [[10, 50], [30, 150], [50, 230], [70, 210], [85, 125], [105, 120], [125, 50], [140, 40]] },
      window: { xMin: 0, xMax: 140, yMin: 0, yMax: 240 },
      guides: [
        { kind: "horizontal", value: 52, label: "zone témoin ≈ 45–60 %" },
        { kind: "vertical", value: 50, label: "maximum ≈ 50 min" },
      ],
      marker: { min: 10, max: 140, step: 5, initial: 50 },
      observation: "La polyligne reproduit les points lisibles de la courbe exposée ; les valeurs sont approximatives et la zone témoin reste globalement autour de 45–60 %.",
    },
    questions: [
      choice("Quelle est la variable portée en abscisse ?", ["La quantité d’ADN", "Le temps en minutes", "La masse du cerveau", "La tension artérielle"], 1, "L’axe horizontal va de 0 à 140 minutes.", "Document 2 • page 7"),
      choice("Quelle grandeur est portée en ordonnée ?", ["Quantité relative de dopamine dans la fente (%)", "Nombre de rats", "Dose de GABA", "Température"], 0, "Le titre de l’axe indique la concentration/quantité relative de dopamine.", "Document 2 • page 7"),
      choice("Quel maximum lit-on approximativement pour le groupe exposé ?", ["30 %", "100 %", "230 %", "500 %"], 2, "Le sommet est voisin de 230 %.", "Lecture corrigée • page 7"),
      choice("À quel instant le maximum est-il graphiquement le plus proche ?", ["10 min", "140 min", "100 min", "50 min"], 3, "Le point le plus haut se situe près de 50 minutes.", "Lecture corrigée • page 7"),
      choice("Dans quelle zone évolue surtout le témoin ?", ["Environ 45–60 %", "Environ 200–230 %", "Toujours 0 %", "Au-dessus de 400 %"], 0, "La courbe témoin varie légèrement autour d’une cinquantaine de pourcents.", "Document 2 • page 7"),
      trueFalse("Le texte du corrigé et les points du graphique concordent parfaitement sur 30 %, 40 min et le témoin.", false, "Le graphique indique plutôt environ 50 %, un sommet vers 50 min et un témoin vers 45–60 %.", "Correction de lecture • pages 7-8"),
      choice("Quel mécanisme explique l’accumulation ?", ["Production de dopamine par les récepteurs", "Blocage de DAT et diminution de la recapture", "Transformation du GABA en dopamine", "Destruction du neurone témoin"], 1, "La cocaïne empêche le recyclage normal par DAT."),
      choice("Quelle conséquence postsynaptique est attendue ?", ["Aucune fixation", "Disparition de tous les canaux", "Stimulation plus forte et prolongée", "Blocage absolu du cerveau"], 2, "Davantage de dopamine disponible active plus longtemps les récepteurs.", "Conclusion exercice 3 • page 8"),
      choice("Quelle phrase appartient à l’analyse et non à l’interprétation ?", ["La cocaïne bloque DAT", "La dopamine persiste car la recapture diminue", "Le transporteur est la cible", "La courbe atteint environ 230 % vers 50 min"], 3, "Donner la valeur lue décrit les données ; expliquer DAT interprète."),
      choice("Quel ordre suit D-A-I-C ?", ["Décrire–Analyser–Interpréter–Conclure", "Déduire–Apprendre–Ignorer–Copier", "Doser–Arrêter–Inventer–Classer", "Document–Auteur–Image–Couleur"], 0, "Cette progression sépare données et mécanisme."),
      short("Quel transporteur dois-tu nommer dans la conclusion ?", ["DAT", "dat", "transporteur DAT", "le transporteur de dopamine"], "DAT assure normalement la recapture d’une partie de la dopamine.", "Interprétation corrigée • page 8"),
    ],
    corrections: [
      "La courbe est relue depuis ses axes : départ proche de 50 %, maximum proche de 230 % vers 50 minutes et témoin autour de 45–60 %, au lieu des valeurs 30 %/40 min/30 % du corrigé.",
      "Le mécanisme est corrigé en blocage de DAT et diminution de la recapture, non en libération continue provoquée par la cocaïne.",
      "La grandeur en pourcentage est présentée comme relative et les valeurs comme approximatives, faute de protocole quantitatif détaillé dans le PDF.",
      "Le retour de la courbe vers le témoin n’est pas assimilé à une absence de risque.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCSvtDrugsPath: LearningPath = {
  id: "terminale-c-svt-l2-drugs-nervous-system",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "La communication dans l’organisme" },
  chapterNumber: 2,
  title: "Les drogues et le système nerveux",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, enrichi par des synapses redessinées, une lecture expérimentale rigoureuse, les exercices officiels et des corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Comparer un témoin à des enregistrements sous nicotine ou diazépam",
    "Décrire une synapse normale et ses mécanismes de terminaison du signal",
    "Distinguer la libération accrue par l’amphétamine du blocage de recapture par la cocaïne",
    "Analyser une courbe dopamine–temps et rédiger une conclusion expérimentale",
    "Présenter les risques, la prévention et la prise en charge sans stigmatisation",
  ],
  modules: [
    {
      id: "drugs-nervous-system-mastery",
      title: "Maîtriser les substances psychoactives et la transmission nerveuse",
      description: "Huit niveaux progressifs, de l’expérience témoin à la mission d’analyse de la dopamine.",
      lessons: builtLevels,
    },
  ],
};
