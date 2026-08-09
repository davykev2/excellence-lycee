import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 16 Similitudes directes.pdf";

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

const truth = (
  prompt: string,
  isTrue: boolean,
  explanation: string,
  sourceLabel: string,
  points = 1,
) => choice(prompt, ["Vrai", "Faux"], isTrue ? 0 : 1, explanation, sourceLabel, points);

interface OfficialLevelSeed {
  id: string;
  title: string;
  summary: string;
  pages: string;
  section: string;
  durationMinutes: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  timeline: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  interaction?: LessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
  tip?: string;
}

const texSlash = String.fromCharCode(92);
const recoverableTexCommands = [
  "Longleftrightarrow",
  "overrightarrow",
  "operatorname",
  "setminus",
  "mathbb",
  "mathcal",
  "notin",
  "mapsto",
  "infty",
  "qquad",
  "equiv",
  "pmod",
  "sqrt",
  "theta",
  "omega",
  "Omega",
  "cdot",
  "circ",
  "left",
  "right",
  "times",
  "text",
  "quad",
  "sum",
  "lim",
  "pi",
] as const;

/**
 * Les données de questions sont des chaînes JavaScript ordinaires alors que les
 * corps de cours utilisent String.raw. Ce garde-fou restaure les commandes TeX
 * lorsqu'un antislash a été interprété comme une séquence d'échappement avant
 * le rendu. Il ne touche qu'aux portions délimitées par $...$ ou $$...$$.
 */
function repairMathText(text: string) {
  return text.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g, (formula) => {
    let repaired = formula
      .replace(/\u0008ar/g, texSlash + "bar")
      .replace(/\u000crac/g, texSlash + "frac")
      .replace(/\u0009heta/g, texSlash + "theta")
      .replace(/\u0009imes/g, texSlash + "times")
      .replace(/\u0009ext/g, texSlash + "text")
      .replace(/\u0009o/g, texSlash + "to")
      .replace(/\u000dight/g, texSlash + "right")
      .replace(/\u000ae/g, texSlash + "ne");

    for (const command of recoverableTexCommands) {
      let cursor = 0;
      while ((cursor = repaired.indexOf(command, cursor)) >= 0) {
        const precedingSlash = repaired.lastIndexOf(texSlash, cursor - 1);
        const insidePrefixedCommand =
          precedingSlash >= 0 && /^[A-Za-z]+$/.test(repaired.slice(precedingSlash + 1, cursor));
        if ((cursor === 0 || repaired[cursor - 1] !== texSlash) && !insidePrefixedCommand) {
          repaired = repaired.slice(0, cursor) + texSlash + repaired.slice(cursor);
          cursor += command.length + 1;
        } else {
          cursor += command.length;
        }
      }
    }

    return repaired
      .replace("BA_nle10", "BA_n" + texSlash + "le10")
      .replace("kge0", "k" + texSlash + "ge0")
      .replace("ane0", "a" + texSlash + "ne0")
      .replace("kneq", "k" + texSlash + "ne q");
  });
}

function repairPedagogicalText<T>(value: T): T {
  if (typeof value === "string") return repairMathText(value) as T;
  if (Array.isArray(value)) return value.map((item) => repairPedagogicalText(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairPedagogicalText(item)]),
    ) as T;
  }
  return value;
}

function progressionWeight(index: number) {
  return 50 + Math.min(index, 7) * 5;
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
  return repairPedagogicalText({
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: progressionWeight(index),
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
    interaction: seed.interaction ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Reconstruis le raisonnement",
      instruction: "Sélectionne chaque étape pour revoir la stratégie avant les exercices.",
      observation:
        "Une similitude se maîtrise en séparant toujours son rapport, son angle, son centre et les images connues.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction:
        "Commence par inventorier les données géométriques ou complexes, identifie la propriété adaptée, puis contrôle le rapport et l’orientation du résultat.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip:
        seed.tip ??
        "Astuce mémoire de Davy : le rapport change les tailles, l’angle fait tourner et le centre reste fixe.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  });
}

const similarityTriangleInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Laboratoire géométrique",
  title: "Lire le rapport et l’angle sur $\Omega MM'$",
  instruction: "Sélectionne les trois repères pour lire ce que la similitude impose au point M et à son image M'.",
  observation:
    "Tous les triangles $\Omega MM'$ produits par une même similitude ont le même rapport $\Omega M'/\Omega M$ et le même angle orienté.",
  caption: "Le triangle caractéristique d’une similitude directe de centre Ω.",
  viewBox: "0 0 440 250",
  shapes: [
    { shape: "line", x1: 70, y1: 195, x2: 215, y2: 195, tone: "outline" },
    { shape: "line", x1: 70, y1: 195, x2: 350, y2: 70, tone: "accent" },
    { shape: "line", x1: 215, y1: 195, x2: 350, y2: 70, tone: "muted" },
    { shape: "path", d: "M118 195 A48 48 0 0 0 114 175", tone: "soft" },
    { shape: "circle", cx: 70, cy: 195, r: 5, tone: "fill" },
    { shape: "circle", cx: 215, cy: 195, r: 5, tone: "fill" },
    { shape: "circle", cx: 350, cy: 70, r: 5, tone: "accent" },
    { shape: "text", x: 55, y: 220, content: "Ω", anchor: "middle" },
    { shape: "text", x: 215, y: 220, content: "M", anchor: "middle" },
    { shape: "text", x: 365, y: 63, content: "M'", anchor: "middle" },
    { shape: "text", x: 122, y: 174, content: "θ", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "center",
      number: 1,
      label: "Le centre",
      detail: "$\Omega$ reste fixe : $s(\Omega)=\Omega$.",
      x: 70,
      y: 195,
    },
    {
      id: "ratio",
      number: 2,
      label: "Le rapport",
      detail: "$\Omega M'=k\,\Omega M$ avec $k>0$.",
      x: 280,
      y: 132,
    },
    {
      id: "angle",
      number: 3,
      label: "L’angle",
      detail: "$\operatorname{Mes}(\overrightarrow{\Omega M},\overrightarrow{\Omega M'})=\theta$.",
      x: 120,
      y: 183,
    },
  ],
};

const canonicalInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Décomposition animée",
  title: "Deux chemins, une même image",
  instruction: "Explore les deux étapes : rotation puis homothétie, ou homothétie puis rotation.",
  observation:
    "Parce que la rotation et l’homothétie ont le même centre, elles commutent et conduisent au même point M'.",
  caption: "Construction de M' à partir de M autour du centre Ω.",
  viewBox: "0 0 460 270",
  shapes: [
    { shape: "circle", cx: 75, cy: 205, r: 5, tone: "fill" },
    { shape: "circle", cx: 180, cy: 205, r: 5, tone: "outline" },
    { shape: "circle", cx: 145, cy: 120, r: 5, tone: "soft" },
    { shape: "circle", cx: 300, cy: 65, r: 5, tone: "accent" },
    { shape: "line", x1: 75, y1: 205, x2: 180, y2: 205, tone: "outline" },
    { shape: "line", x1: 75, y1: 205, x2: 145, y2: 120, tone: "soft" },
    { shape: "line", x1: 75, y1: 205, x2: 300, y2: 65, tone: "accent" },
    { shape: "path", d: "M180 205 Q230 150 300 65", tone: "muted" },
    { shape: "path", d: "M145 120 Q210 95 300 65", tone: "muted" },
    { shape: "text", x: 60, y: 230, content: "Ω", anchor: "middle" },
    { shape: "text", x: 180, y: 230, content: "M", anchor: "middle" },
    { shape: "text", x: 130, y: 110, content: "M₁=r(M)", anchor: "middle" },
    { shape: "text", x: 325, y: 58, content: "M'", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "rotation",
      number: 1,
      label: "Rotation",
      detail: "La rotation conserve la distance à $\Omega$ et ajoute l’angle $\theta$.",
      x: 135,
      y: 155,
    },
    {
      id: "homothety",
      number: 2,
      label: "Homothétie",
      detail: "L’homothétie positive multiplie ensuite la distance par $k$ sans changer la direction.",
      x: 225,
      y: 95,
    },
    {
      id: "commute",
      number: 3,
      label: "Même résultat",
      detail: "$h_{\Omega,k}\circ r_{\Omega,\theta}=r_{\Omega,\theta}\circ h_{\Omega,k}$.",
      x: 300,
      y: 65,
    },
  ],
};

const centerConstructionInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Construction du centre",
  title: "Deux cercles pour retrouver $\Omega$",
  instruction: "Sélectionne K, les deux cercles puis leur seconde intersection.",
  observation:
    "Le point K code l’angle commun. Les deux cercles imposent simultanément les couples $(A,A')$ et $(B,B')$ ; leur seconde intersection est le centre.",
  caption: "Principe de construction lorsque A→A' et B→B'.",
  viewBox: "0 0 470 280",
  shapes: [
    { shape: "line", x1: 55, y1: 220, x2: 415, y2: 80, tone: "muted" },
    { shape: "line", x1: 95, y1: 205, x2: 370, y2: 205, tone: "outline" },
    { shape: "circle", cx: 170, cy: 165, r: 78, tone: "soft" },
    { shape: "circle", cx: 285, cy: 155, r: 118, tone: "accent" },
    { shape: "circle", cx: 150, cy: 205, r: 5, tone: "fill" },
    { shape: "circle", cx: 325, cy: 205, r: 5, tone: "fill" },
    { shape: "circle", cx: 230, cy: 106, r: 5, tone: "accent" },
    { shape: "circle", cx: 104, cy: 144, r: 5, tone: "outline" },
    { shape: "text", x: 145, y: 230, content: "A", anchor: "middle" },
    { shape: "text", x: 330, y: 230, content: "B", anchor: "middle" },
    { shape: "text", x: 232, y: 92, content: "Ω", anchor: "middle" },
    { shape: "text", x: 92, y: 137, content: "K", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "auxiliary",
      number: 1,
      label: "Point auxiliaire K",
      detail: "K est choisi sur les droites $(AB)$ et $(A'B')$ prolongées ; il matérialise l’angle de la similitude.",
      x: 104,
      y: 144,
    },
    {
      id: "circles",
      number: 2,
      label: "Cercles de contraintes",
      detail: "Un cercle passe par K, A et A' ; l’autre par K, B et B'.",
      x: 345,
      y: 115,
    },
    {
      id: "omega",
      number: 3,
      label: "Seconde intersection",
      detail: "La seconde intersection, différente de K, est le centre $\Omega$.",
      x: 230,
      y: 106,
    },
  ],
};

const spiralInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Suite géométrique dans le plan",
  title: "Une spirale qui converge vers le centre",
  instruction: "Suis A, B, C, D puis E : chaque étape tourne de $-\pi/4$ et réduit les distances par $\sqrt2/2$.",
  observation:
    "Les longueurs sont géométriques de raison $\sqrt2/2$ et les aires de raison $1/2$ ; la spirale s’enroule vers I.",
  caption: "Itération de $z'=\frac{1-i}{2}z+\frac{1+i}{2}$.",
  viewBox: "0 0 460 290",
  shapes: [
    { shape: "path", d: "M70 230 L175 80 L315 80 L390 155 L390 235 L330 270", tone: "accent" },
    { shape: "line", x1: 245, y1: 190, x2: 70, y2: 230, tone: "muted" },
    { shape: "line", x1: 245, y1: 190, x2: 175, y2: 80, tone: "muted" },
    { shape: "line", x1: 245, y1: 190, x2: 315, y2: 80, tone: "muted" },
    { shape: "line", x1: 245, y1: 190, x2: 390, y2: 155, tone: "muted" },
    { shape: "line", x1: 245, y1: 190, x2: 390, y2: 235, tone: "muted" },
    { shape: "circle", cx: 245, cy: 190, r: 5, tone: "fill" },
    { shape: "text", x: 245, y: 212, content: "I", anchor: "middle" },
    { shape: "text", x: 58, y: 245, content: "A", anchor: "middle" },
    { shape: "text", x: 175, y: 66, content: "B", anchor: "middle" },
    { shape: "text", x: 315, y: 66, content: "C", anchor: "middle" },
    { shape: "text", x: 410, y: 153, content: "D", anchor: "middle" },
    { shape: "text", x: 410, y: 240, content: "E", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "lengths",
      number: 1,
      label: "Longueurs",
      detail: "$M_{n+1}M_{n+2}=\frac{\sqrt2}{2}M_nM_{n+1}$.",
      x: 130,
      y: 145,
    },
    {
      id: "areas",
      number: 2,
      label: "Aires",
      detail: "$a_{n+1}=\left(\frac{\sqrt2}{2}\right)^2a_n=\frac12a_n$.",
      x: 330,
      y: 125,
    },
    {
      id: "limit",
      number: 3,
      label: "Convergence",
      detail: "Comme le rapport est inférieur à 1, les points et les sommes d’aires convergent vers une limite.",
      x: 245,
      y: 190,
    },
  ],
};

const levels: OfficialLevelSeed[] = [
  {
    id: "similarity-definition",
    title: "Rapport et angle d’une similitude directe",
    summary:
      "Définir une similitude directe, lire son rapport et son angle, puis reconnaître les transformations usuelles comme cas particuliers.",
    pages: "1-2",
    section: "I-1. Définition et caractérisation",
    durationMinutes: 34,
    body: String.raw`## Définition constructive

Une **similitude directe** est la composée d’une homothétie et d’un déplacement. Elle conserve l’orientation des figures. Les similitudes indirectes, qui renversent l’orientation, ne sont pas étudiées dans cette leçon.

## Caractérisation par deux nombres

Une application $s$ du plan dans lui-même est une similitude directe si, pour tous points distincts $A$ et $B$, d’images $A'$ et $B'$, il existe :

- un réel $k>0$, appelé **rapport** ;
- un angle $	heta\in]-\pi;\pi]$, appelé **angle**,

tels que

$$A'B'=k\,AB$$

et

$$\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{A'B'})=\theta.$$

Le rapport agit sur les **longueurs** ; l’angle agit sur les **directions orientées**. Ces deux valeurs sont indépendantes des points choisis.

## Transformations usuelles à reconnaître

| Transformation | Rapport $k$ | Angle principal $\theta$ |
|---|---:|---:|
| Translation | $1$ | $0$ |
| Rotation d’angle $\theta$ | $1$ | $\theta$ |
| Homothétie de rapport positif $k$ | $k$ | $0$ |
| Homothétie de rapport négatif $-k$ | $k$ | $\pi$ |

Une homothétie de rapport $-2$ est donc, au sens des similitudes directes, de rapport positif $2$ et d’angle $\pi$.

## Exercice de fixation du cours

Dans le triangle équilatéral direct $ABC$, $I$ est le milieu de $[BC]$. La similitude $s$ vérifie $s(I)=B$ et $s(B)=A$.

Son rapport vaut

$$k=\frac{BA}{IB}=\frac{BC}{BC/2}=2.$$

Pour l’angle, on lit l’orientation de $\overrightarrow{IB}$ vers $\overrightarrow{BA}$ :

$$\theta=\operatorname{Mes}(\overrightarrow{IB},\overrightarrow{BA})=-\frac{2\pi}{3}.$$

Ainsi, $s$ agrandit toutes les longueurs par $2$ et fait tourner toutes les directions de $-120^\circ$.

> **Point de vigilance.** Le rapport d’une similitude est toujours strictement positif. Le signe d’une homothétie est absorbé par l’angle $0$ ou $\pi$.

> **Astuce mémoire de Davy.** « Taille puis virage » : calcule d’abord une longueur image sur une longueur source, puis mesure l’angle du vecteur source vers le vecteur image.` ,
    keyPoint:
      "$A'B'=kAB$ et $\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{A'B'})=\theta$, avec $k>0$.",
    example:
      "Dans le triangle équilatéral du cours, $I\mapsto B$ et $B\mapsto A$ donnent $k=2$ et $\theta=-2\pi/3$.",
    methodSteps: [
      "Choisis deux points distincts dont les images sont connues.",
      "Calcule le quotient longueur image sur longueur source pour obtenir k.",
      "Mesure l’angle orienté du vecteur source vers le vecteur image.",
      "Ramène l’angle dans l’intervalle principal ]-π ; π].",
    ],
    timeline: [
      { label: "Deux points", detail: "Identifier A, B puis leurs images A′, B′." },
      { label: "Rapport", detail: "Calculer A′B′/AB, toujours positif." },
      { label: "Angle", detail: "Mesurer de AB vers A′B′, dans cet ordre." },
      { label: "Nature", detail: "Comparer k et θ aux transformations usuelles." },
    ],
    interaction: similarityTriangleInteraction,
    questions: [
      choice("Une similitude directe conserve :", ["L’orientation", "Toutes les longueurs", "Toutes les aires", "Le sens des angles non orientés seulement"], 0, "Elle ne renverse pas l’orientation des figures.", "Définition • page 1"),
      choice("Le rapport $k$ d’une similitude directe vérifie :", ["$k>0$", "$k<0$", "$k\ne0$ mais peut être négatif", "$k\ge0$"], 0, "Le rapport est une valeur strictement positive.", "Caractérisation • page 2"),
      short("Une longueur de 7 cm a pour image une longueur de 21 cm. Donne le rapport.", ["3", "+3"], "$k=21/7=3$.", "Caractérisation • page 2"),
      choice("Une translation a pour couple $(k,\theta)$ :", ["$(1,0)$", "$(0,1)$", "$(1,\pi)$", "$(2,0)$"], 0, "Elle conserve les longueurs et les directions.", "Exemples • page 2"),
      choice("Une rotation d’angle $\pi/3$ a pour rapport :", ["$1$", "$\pi/3$", "$\sqrt3$", "$0$"], 0, "Une rotation conserve toutes les longueurs.", "Exemples • page 2"),
      choice("Une homothétie de rapport $-4$ devient une similitude de :", ["rapport 4 et angle $\pi$", "rapport -4 et angle 0", "rapport 4 et angle 0", "rapport 1 et angle $\pi$"], 0, "Le rapport de similitude est positif et le signe moins correspond à un demi-tour.", "Exemples • page 2", 2),
      truth("L’angle d’une similitude dépend des deux points utilisés pour le calculer.", false, "L’angle est constant pour toute paire de points distincts.", "Caractérisation • page 2"),
      short("Dans l’exercice du triangle équilatéral, calcule $BA/IB$.", ["2", "+2"], "I est le milieu de BC, donc IB=BC/2 et BA=BC.", "Exercice de fixation • page 2"),
      choice("Dans cet exercice, l’angle principal de la similitude vaut :", ["$-2\pi/3$", "$2\pi/3$", "$\pi/3$", "$-\pi/3$"], 0, "On mesure de $\overrightarrow{IB}$ vers $\overrightarrow{BA}$.", "Exercice de fixation • page 2", 2),
      short("Une similitude de rapport 2 transforme une longueur 5. Donne la longueur image.", ["10", "+10"], "$5\times2=10$.", "Application de la définition"),
      choice("Si $k=1$ et $\theta\ne0$, la similitude non translation est :", ["Une rotation", "Une homothétie positive", "Une symétrie axiale", "Une projection"], 0, "Le rapport 1 conserve les distances et l’angle non nul produit une rotation.", "Exemples • page 2"),
      choice("Si $k=3$ et $\theta=0$, on reconnaît :", ["Une homothétie positive", "Une rotation", "Une translation", "Une similitude indirecte"], 0, "L’angle nul conserve les directions.", "Exemples • page 2"),
      truth("Une symétrie axiale est une similitude directe.", false, "Elle renverse l’orientation : c’est une similitude indirecte.", "Définition • page 1"),
      choice("Pour trouver $\theta$, quel ordre est correct ?", ["vecteur source vers vecteur image", "vecteur image vers vecteur source", "le plus petit angle non orienté", "ordre indifférent"], 0, "L’ordre des vecteurs fixe le signe de l’angle orienté.", "Caractérisation • page 2", 2),
    ],
  },
  {
    id: "similarity-composition-inverse",
    title: "Composer une similitude et trouver sa réciproque",
    summary:
      "Multiplier les rapports, additionner les angles et inverser correctement ces deux paramètres pour la transformation réciproque.",
    pages: "2-3",
    section: "I-2. Composition et réciproque",
    durationMinutes: 32,
    body: String.raw`## Composition de deux similitudes directes

Soient $f$ et $g$ deux similitudes directes de rapports respectifs $k$ et $k'$ et d’angles $	heta$ et $	heta'$.

Les composées $g\circ f$ et $f\circ g$ ont toutes deux :

$$k_{g\circ f}=k_{f\circ g}=kk'$$

et

$$\theta_{g\circ f}=\theta_{f\circ g}=\theta+\theta'\pmod{2\pi}.$$

Les **paramètres** sont les mêmes dans les deux ordres, mais les transformations elles-mêmes ne sont pas forcément égales : leurs centres ou leurs termes de translation peuvent différer.

## Similitude réciproque

Toute similitude directe $f$ est bijective. Sa réciproque $f^{-1}$ annule exactement son effet :

$$k_{f^{-1}}=\frac1k\qquad\text{et}\qquad\theta_{f^{-1}}=-\theta.$$

On retrouve bien l’identité après composition : rapport $k\times1/k=1$ et angle $	heta-\theta=0$.

## Exercice de fixation du cours

On donne :

$$f:\quad k_f=3,\quad\theta_f=\frac\pi2$$

$$g:\quad k_g=\frac{\sqrt2}{2},\quad\theta_g=-\frac{2\pi}{3}.$$

Alors les deux composées ont pour rapport

$$3\times\frac{\sqrt2}{2}=\frac{3\sqrt2}{2}$$

et pour angle principal

$$\frac\pi2-\frac{2\pi}{3}=-\frac\pi6.$$

Pour la réciproque de $g$ :

$$k_{g^{-1}}=\frac{1}{\sqrt2/2}=\sqrt2,qquad
\theta_{g^{-1}}=\frac{2\pi}{3}.$$

## Réduire un angle composé

Si la somme sort de $]-\pi;\pi]$, ajoute ou retranche $2\pi$. Par exemple :

$$\frac{3\pi}{4}+\frac{2\pi}{3}=\frac{17\pi}{12}equiv-\frac{7\pi}{12}\pmod{2\pi}.$$

> **Erreur fréquente.** La réciproque ne remplace pas $k$ par $-k$. Elle remplace $k$ par $1/k$ et $	heta$ par $-\theta$.

> **Astuce mémoire de Davy.** « Composer : fois et plus. Revenir : inverse et opposé. »`,
    keyPoint:
      "$k_{g\circ f}=k_gk_f$, $\theta_{g\circ f}=\theta_g+\theta_f$ ; $f^{-1}$ a pour paramètres $(1/k,-\theta)$.",
    example:
      "$f(3,\pi/2)$ et $g(\sqrt2/2,-2\pi/3)$ donnent $(3\sqrt2/2,-\pi/6)$ ; $g^{-1}$ donne $(\sqrt2,2\pi/3)$.",
    methodSteps: [
      "Écris séparément le rapport et l’angle de chaque transformation.",
      "Multiplie les rapports dans une composition.",
      "Additionne les angles puis réduis modulo 2π.",
      "Pour une réciproque, prends l’inverse du rapport et l’opposé de l’angle.",
    ],
    timeline: [
      { label: "Paramètres", detail: "Isoler les couples (k,θ) de f et g." },
      { label: "Rapports", detail: "Former le produit kk′." },
      { label: "Angles", detail: "Former θ+θ′ et réduire modulo 2π." },
      { label: "Réciproque", detail: "Passer de (k,θ) à (1/k,-θ)." },
    ],
    questions: [
      short("Deux similitudes ont pour rapports 2 et 5. Donne le rapport de leur composée.", ["10", "+10"], "$2\times5=10$.", "Propriété • page 3"),
      choice("Les angles d’une composée :", ["S’additionnent", "Se multiplient", "Se soustraient toujours", "S’annulent toujours"], 0, "Les angles s’additionnent modulo 2π.", "Propriété • page 3"),
      short("Calcule $\pi/2-2\pi/3$.", ["-pi/6", "-π/6", "-1/6pi", "-pi÷6"], "Avec le dénominateur 6 : 3π/6-4π/6=-π/6.", "Exercice de fixation • page 3"),
      choice("Le rapport de $f\circ g$ dans l’exercice vaut :", ["$3\sqrt2/2$", "$3/\sqrt2$ uniquement", "$3+\sqrt2/2$", "$\sqrt2/6$"], 0, "On multiplie les rapports.", "Exercice de fixation • page 3"),
      choice("L’angle principal de $g\circ f$ vaut :", ["$-\pi/6$", "$7\pi/6$", "$\pi/6$", "$-7\pi/6$"], 0, "La somme vaut -π/6.", "Exercice de fixation • page 3"),
      truth("$f\circ g$ et $g\circ f$ ont toujours le même rapport et le même angle.", true, "La multiplication des rapports et l’addition des angles sont commutatives.", "Propriété • page 3"),
      truth("$f\circ g$ et $g\circ f$ sont toujours exactement la même application.", false, "Les paramètres coïncident, mais le centre ou la translation peuvent différer.", "Précision sur la composition • page 3", 2),
      short("Donne le rapport de la réciproque d’une similitude de rapport 4.", ["1/4", "0,25", "0.25"], "Le rapport réciproque est 1/k.", "Réciproque • page 3"),
      choice("La réciproque d’un angle $-2\pi/3$ a pour angle :", ["$2\pi/3$", "$-2\pi/3$", "$3\pi/2$", "$-3\pi/2$"], 0, "On prend l’opposé.", "Exercice de fixation • page 3"),
      short("Dans l’exercice, donne le rapport de $g^{-1}$.", ["sqrt2", "√2", "racine de 2"], "$1/(\sqrt2/2)=\sqrt2$.", "Exercice de fixation • page 3"),
      choice("Composer une similitude avec sa réciproque donne :", ["L’identité", "Une rotation d’angle π", "Une homothétie de rapport -1", "Une projection"], 0, "Le rapport devient 1 et l’angle 0.", "Réciproque • page 3"),
      choice("Réduis $17\pi/12$ dans $]-\pi;\pi]$.", ["$-7\pi/12$", "$7\pi/12$", "$5\pi/12$", "$-5\pi/12$"], 0, "$17\pi/12-2\pi=-7\pi/12$.", "Réduction modulo 2π", 2),
      short("Une composée a les rapports $1/3$, 6 et 2. Donne son rapport.", ["4", "+4"], "$(1/3)\times6\times2=4$.", "Application de la propriété"),
      choice("Pour annuler une rotation d’angle $5\pi/6$, il faut composer avec un angle :", ["$-5\pi/6$", "$5\pi/6$", "$\pi/6$", "$-\pi/6$"], 0, "L’angle opposé donne une somme nulle.", "Réciproque • page 3"),
    ],
  },
  {
    id: "similarity-invariants",
    title: "Exploiter les propriétés géométriques conservées",
    summary:
      "Utiliser les invariants de forme, les rapports, les barycentres et le facteur $k^2$ sur les aires.",
    pages: "3-4",
    section: "I-3. Propriétés géométriques",
    durationMinutes: 35,
    body: String.raw`## Ce qui est conservé

Une similitude directe conserve :

- l’alignement des points ;
- le parallélisme et l’orthogonalité ;
- le contact et la tangence ;
- les angles orientés ;
- les rapports de longueurs ;
- les barycentres avec les mêmes coefficients.

Elle conserve donc la **forme**, mais pas nécessairement la taille.

## Ce qui est multiplié

Si son rapport vaut $k$ :

$$A'B'=k\,AB$$

et toute aire est multipliée par

$$k^2.$$

Ainsi, un agrandissement de rapport $3$ multiplie les périmètres par $3$, mais les aires par $9$.

## Images de figures usuelles

- une droite devient une droite ;
- une demi-droite devient une demi-droite ;
- un segment devient un segment ;
- un cercle de rayon $r$ devient un cercle de rayon $kr$.

Les relations d’incidence sont conservées : si une droite est tangente à un cercle, leurs images restent tangentes.

## Exercice de fixation sur le barycentre

Le cours suppose

$$\overrightarrow{AD}=2\overrightarrow{AB}-5\overrightarrow{CD}.$$

Or

$$\overrightarrow{CD}=\overrightarrow{CA}+\overrightarrow{AD}.$$

En remplaçant puis en regroupant, on obtient

$$-6\overrightarrow{AD}+2\overrightarrow{AB}+5\overrightarrow{AC}=\overrightarrow0.$$

Le point $A$ est donc le barycentre du système

$$\{(D,-6),(B,2),(C,5)\}$$

car la somme des coefficients vaut $-6+2+5=1\ne0$.

Si $A',B',C',D'$ sont les images, la conservation du barycentre donne

$$-6\overrightarrow{A'D'}+2\overrightarrow{A'B'}+5\overrightarrow{A'C'}=\overrightarrow0.$$

En revenant à la forme initiale :

$$\overrightarrow{A'D'}=2\overrightarrow{A'B'}-5\overrightarrow{C'D'}.$$

> **Réflexe utile.** Une relation vectorielle dont les coefficients ont une somme non nulle cache souvent un barycentre. Réécris-la avec une même origine.

> **Astuce mémoire de Davy.** « Longueurs : $k$ ; surfaces : $k^2$ ; angles : inchangés. »`,
    keyPoint:
      "Une similitude conserve les angles et les rapports ; elle multiplie les longueurs par $k$ et les aires par $k^2$.",
    example:
      "Le barycentre $A=\operatorname{bar}\{(D,-6),(B,2),(C,5)\}$ devient le même barycentre de $D',B',C'$.",
    methodSteps: [
      "Identifie la nature de la relation à transporter : angle, longueur, incidence ou barycentre.",
      "Pour une longueur, multiplie par k ; pour une aire, multiplie par k².",
      "Pour un barycentre, conserve exactement les coefficients.",
      "Réécris le résultat avec les points images et simplifie.",
    ],
    timeline: [
      { label: "Forme", detail: "Alignement, parallélisme, orthogonalité et tangence sont conservés." },
      { label: "Mesures", detail: "Longueurs ×k, aires ×k²." },
      { label: "Angles", detail: "Les angles orientés ne changent pas." },
      { label: "Barycentre", detail: "Les mêmes masses passent aux points images." },
    ],
    questions: [
      truth("Une similitude directe conserve l’alignement.", true, "L’image d’une droite est une droite.", "Propriétés • pages 3-4"),
      truth("Une similitude directe conserve toujours les longueurs.", false, "Les longueurs sont multipliées par k ; elles ne sont conservées que si k=1.", "Propriétés • page 4"),
      choice("Si $k=4$, une aire est multipliée par :", ["16", "4", "8", "2"], 0, "Le facteur d’aire est k².", "Propriétés • page 4"),
      short("Un cercle de rayon 3 a pour image un cercle de rayon 15. Donne k.", ["5", "+5"], "$k=15/3=5$.", "Images de figures • page 4"),
      choice("L’image de deux droites perpendiculaires est formée de droites :", ["Perpendiculaires", "Parallèles", "Confondues", "Quelconques"], 0, "L’orthogonalité est conservée.", "Propriétés • page 3"),
      truth("La tangence entre une droite et un cercle est conservée.", true, "Le contact et la tangence font partie des invariants.", "Propriétés • page 3"),
      short("Si un segment mesure 8 cm et $k=3/2$, donne la longueur image.", ["12", "12cm", "12 cm"], "$8\times3/2=12$ cm.", "Rapport • page 4"),
      short("Si une aire vaut 10 cm² et $k=1/2$, donne l’aire image.", ["2,5", "2.5", "2,5cm2", "2.5cm2"], "$10\times(1/2)^2=2,5$ cm².", "Aires • page 4", 2),
      choice("Dans la relation du cours, la somme des coefficients $-6+2+5$ vaut :", ["1", "0", "-1", "13"], 0, "La somme non nulle garantit l’existence du barycentre.", "Exercice de fixation • page 4"),
      choice("Le point A est barycentre de :", ["$(D,-6),(B,2),(C,5)$", "$(D,6),(B,2),(C,5)$", "$(D,-6),(B,-2),(C,5)$", "$(D,1),(B,1),(C,1)$"], 0, "C’est la relation vectorielle obtenue après regroupement.", "Exercice de fixation • page 4", 2),
      truth("Les coefficients d’un barycentre changent lorsqu’on applique une similitude.", false, "La similitude conserve le barycentre avec les mêmes coefficients.", "Propriété du barycentre • page 3"),
      choice("La relation image correcte est :", ["$\overrightarrow{A'D'}=2\overrightarrow{A'B'}-5\overrightarrow{C'D'}$", "$\overrightarrow{A'D'}=2\overrightarrow{AB}-5\overrightarrow{CD}$", "$\overrightarrow{A'D'}=k^2\overrightarrow{AD}$", "$\overrightarrow{A'D'}=\overrightarrow{AD}$"], 0, "On remplace chaque point par son image en gardant la relation affine.", "Exercice de fixation • page 4", 2),
      choice("Une similitude de rapport 2 transforme un périmètre 7 en :", ["14", "28", "9", "3,5"], 0, "Un périmètre est une somme de longueurs, donc il est multiplié par k.", "Conséquence des propriétés"),
      choice("Elle transforme une aire 7 avec le même rapport 2 en :", ["28", "14", "9", "3,5"], 0, "L’aire est multipliée par 2²=4.", "Conséquence des propriétés"),
    ],
  },
  {
    id: "similarity-canonical",
    title: "Centre et décomposition canonique",
    summary:
      "Reconnaître le centre unique d’une similitude non translation et construire une image par rotation et homothétie de même centre.",
    pages: "4-5",
    section: "II-1. Caractérisation d’une similitude directe",
    durationMinutes: 36,
    body: String.raw`## Le centre d’une similitude directe

Toute similitude directe qui n’est pas une translation possède un **unique point invariant** $\Omega$ :

$$s(\Omega)=\Omega.$$

Ce point est appelé **centre** de la similitude.

## Forme canonique

Une similitude directe $s$, autre que l’identité, de centre $\Omega$, de rapport $k$ et d’angle $\theta$ est :

- une translation si $k=1$ et $\theta=0$ mais qu’aucun point n’est fixe ;
- sinon la composée d’une rotation $r_{\Omega,\theta}$ et d’une homothétie positive $h_{\Omega,k}$.

Comme les deux transformations ont le même centre, elles commutent :

$$s=h_{\Omega,k}\circ r_{\Omega,\theta}
=r_{\Omega,\theta}\circ h_{\Omega,k}.$$

Cette écriture est appelée **forme réduite** ou **décomposition canonique**.

## Construire l’image d’un point sans nombres complexes

Pour construire $M'=s(M)$, deux chemins sont possibles :

1. construire $M_1=r_{\Omega,\theta}(M)$, puis $M'=h_{\Omega,k}(M_1)$ ;
2. construire $M_2=h_{\Omega,k}(M)$, puis $M'=r_{\Omega,\theta}(M_2)$.

Dans les deux cas :

$$\Omega M'=k\,\Omega M$$

et

$$\operatorname{Mes}(\overrightarrow{\Omega M},\overrightarrow{\Omega M'})=\theta.$$

## Exercice de fixation du cours

On considère $S(A,2,-\pi/3)$.

Sa décomposition est

$$S=r_{A,-\pi/3}\circ h_{A,2}
=h_{A,2}\circ r_{A,-\pi/3}.$$

Pour construire l’image $M'$ de $M$ :

- fais d’abord tourner $M$ de $-60^\circ$ autour de $A$, puis double la distance à $A$ ;
- ou double d’abord $AM$, puis applique la rotation de $-60^\circ$.

Le contrôle final doit donner

$$AM'=2AM,qquad
\operatorname{Mes}(\overrightarrow{AM},\overrightarrow{AM'})=-\frac\pi3.$$

## Cas particuliers

- $k=1$ et centre fixé : rotation ;
- $\theta=0$ : homothétie positive ;
- $\theta=\pi$ : homothétie négative de rapport $-k$ ;
- $k=1$, $\theta=0$ : identité si tous les points sont fixes, translation sinon.

> **Astuce mémoire de Davy.** Le centre est le « clou » : la figure tourne et change de taille autour de lui, mais lui ne bouge jamais.`,
    keyPoint:
      "$s=h_{\Omega,k}\circ r_{\Omega,\theta}=r_{\Omega,\theta}\circ h_{\Omega,k}$ lorsque $s$ n’est pas une translation.",
    example:
      "$S(A,2,-\pi/3)$ s’obtient par une rotation de centre A et d’angle $-\pi/3$, puis une homothétie de même centre et de rapport 2.",
    methodSteps: [
      "Repère le centre Ω et vérifie qu’il est fixe.",
      "Construis la rotation d’angle θ autour de Ω.",
      "Sur la même demi-droite, multiplie ensuite la distance par k.",
      "Contrôle simultanément la distance ΩM′ et l’angle orienté.",
    ],
    timeline: [
      { label: "Centre", detail: "Le point Ω vérifie s(Ω)=Ω." },
      { label: "Rotation", detail: "Elle impose l’angle θ sans changer la distance." },
      { label: "Homothétie", detail: "Elle multiplie la distance par k." },
      { label: "Contrôle", detail: "Vérifier ΩM′=kΩM et l’angle θ." },
    ],
    interaction: canonicalInteraction,
    questions: [
      choice("Une similitude directe non translation possède :", ["Un centre unique", "Deux centres", "Aucun point fixe", "Une infinité de centres"], 0, "Son unique point invariant est son centre.", "Propriété • page 5"),
      truth("Le centre Ω vérifie $s(\Omega)=\Omega$.", true, "C’est la définition du point invariant.", "Caractérisation • pages 4-5"),
      choice("Dans la décomposition canonique, la rotation et l’homothétie ont :", ["Le même centre", "Des centres quelconques", "Des rapports égaux", "Des angles opposés"], 0, "Le centre commun est Ω.", "Propriété • page 5"),
      truth("$h_{\Omega,k}$ et $r_{\Omega,\theta}$ commutent.", true, "Avec le même centre, l’ordre ne change pas le résultat.", "Propriété • page 5"),
      choice("Pour $S(A,2,-\pi/3)$, la rotation a pour angle :", ["$-\pi/3$", "$\pi/3$", "$2\pi/3$", "$-2\pi/3$"], 0, "La rotation porte exactement l’angle de la similitude.", "Exercice de fixation • page 5"),
      short("Pour cette même similitude, donne $AM'/AM$.", ["2", "+2"], "Le quotient est le rapport k=2.", "Exercice de fixation • page 5"),
      choice("Si $k=1$ et $\theta\ne0$ avec un centre, on obtient :", ["Une rotation", "Une translation", "Une homothétie", "Une symétrie axiale"], 0, "Le facteur de longueur vaut 1.", "Cas particulier • page 5"),
      choice("Si $\theta=0$ et $k\ne1$, on obtient :", ["Une homothétie positive", "Une rotation", "Une translation", "Une symétrie centrale"], 0, "Il n’y a aucune rotation des directions.", "Cas particulier • page 5"),
      choice("Une homothétie de rapport négatif $-3$ correspond à :", ["$k=3,\theta=\pi$", "$k=-3,\theta=0$", "$k=3,\theta=0$", "$k=1,\theta=-3$"], 0, "Le demi-tour porte le signe négatif.", "Cas particulier • page 5", 2),
      choice("Premier chemin pour construire M′ :", ["Rotation puis homothétie", "Projection puis translation", "Symétrie puis rotation", "Deux translations"], 0, "C’est l’une des deux décompositions canoniques.", "Remarque • page 5"),
      short("Une rotation conserve $\Omega M=6$. Quelle est la distance après la rotation ?", ["6", "6cm", "6 cm"], "Une rotation est une isométrie.", "Décomposition • page 5"),
      short("Après une homothétie de rapport 2, quelle devient cette distance 6 ?", ["12", "12cm", "12 cm"], "$6\times2=12$.", "Décomposition • page 5"),
      truth("Une translation non nulle possède un centre.", false, "Elle n’a aucun point invariant.", "Propriété • page 5"),
      choice("Le contrôle géométrique complet de M′ porte sur :", ["La distance et l’angle", "L’aire seulement", "La distance seulement", "L’angle seulement"], 0, "Les deux paramètres doivent être vérifiés.", "Remarque • page 5", 2),
    ],
  },
  {
    id: "similarity-complex-form",
    title: "Reconnaître une similitude par son écriture complexe",
    summary:
      "Passer des coordonnées à $z'=az+b$, puis lire la nature, le rapport, l’angle et le centre à partir de $a$ et $b$.",
    pages: "5-7",
    section: "II-2. Nature d’une similitude d’écriture complexe",
    durationMinutes: 45,
    kind: "practice",
    body: String.raw`## Critère complexe fondamental

Dans un repère orthonormé direct, une application est une similitude directe si et seulement si son écriture complexe est

$$z'=az+b$$

avec $a\in\mathbb C^*$ et $b\in\mathbb C$.

Le coefficient $a$ porte les paramètres géométriques :

$$k=|a|,qquad\theta=\operatorname{Arg}(a).$$

## Retrouver l’écriture à partir de coordonnées

Le cours donne

$$x'=x+y-3,qquad y'=-x+y+2.$$

Comme $z=x+iy$ et $z'=x'+iy'$ :

$$z'=x+y-3+i(-x+y+2).$$

En regroupant $x+iy$ :

$$z'=(1-i)(x+iy)-3+2i$$

donc

$$z'=(1-i)z-3+2i.$$

Le coefficient $1-i$ est non nul : il s’agit bien d’une similitude directe.

## Tableau de reconnaissance

| Condition sur $a$ | Nature | Éléments |
|---|---|---|
| $a=1$ | translation | vecteur d’affixe $b$ |
| $a\in\mathbb R\setminus\{0,1\}$ | homothétie | centre $\omega=b/(1-a)$, rapport algébrique $a$ |
| $a\notin\mathbb R$, $|a|=1$ | rotation | centre $\omega=b/(1-a)$, angle $\operatorname{Arg}(a)$ |
| $a\notin\mathbb R$, $|a|\ne1$ | similitude directe propre | centre $\omega=b/(1-a)$, rapport $|a|$, angle $\operatorname{Arg}(a)$ |

## Exercice de fixation : quatre reconnaissances

### a) $z'=5z+2i$

$a=5$ est réel : homothétie de rapport $5$ et de centre

$$\omega=\frac{2i}{1-5}=-\frac i2.$$

### b) $z'=z+1+3i$

$a=1$ : translation de vecteur d’affixe $1+3i$.

### c) $z'=\left(\frac12+i\frac{\sqrt3}{2}\right)z+\frac12-i\frac{\sqrt3}{2}$

$a=e^{i\pi/3}$ et $|a|=1$ : rotation d’angle $\pi/3$. Son centre a pour affixe

$$\omega=\frac{b}{1-a}=1.$$

### d) $z'=(-1+i)z+2$

$$|-1+i|=\sqrt2,qquad\operatorname{Arg}(-1+i)=\frac{3\pi}{4}$$

et

$$\omega=\frac{2}{2-i}=\frac45+\frac25i.$$

C’est une similitude directe propre de centre d’affixe $4/5+2i/5$, de rapport $\sqrt2$ et d’angle $3\pi/4$.

## Écriture depuis le centre

Pour un centre $A$ d’affixe $z_A$ :

$$z'=ke^{i\theta}(z-z_A)+z_A.$$

Avec $z_A=i$, $k=\sqrt2$ et $\theta=\pi/4$, on a $ke^{i\theta}=1+i$, donc

$$z'=(1+i)(z-i)+i=(1+i)z+1.$$

> **Astuce mémoire de Davy.** Dans $z'=az+b$, regarde d’abord $a$ : module = taille, argument = virage. Seulement ensuite, calcule le centre avec $b/(1-a)$.`,
    keyPoint:
      "$z'=az+b$ avec $a\ne0$ ; $k=|a|$, $\theta=\operatorname{Arg}(a)$ et, si $a\ne1$, $\omega=b/(1-a)$.",
    example:
      "$z'=(-1+i)z+2$ a pour centre $4/5+2i/5$, rapport $\sqrt2$ et angle $3\pi/4$.",
    methodSteps: [
      "Mets l’expression sous la forme z′=az+b.",
      "Teste d’abord si a=1, puis si a est réel et enfin si |a|=1.",
      "Calcule k=|a| et θ=Arg(a).",
      "Si a≠1, calcule le centre ω=b/(1-a) et vérifie s(ω)=ω.",
    ],
    timeline: [
      { label: "Forme", detail: "Regrouper x+iy pour obtenir z′=az+b." },
      { label: "Module", detail: "Le rapport vaut |a|." },
      { label: "Argument", detail: "L’angle vaut Arg(a)." },
      { label: "Centre", detail: "Résoudre z′=z : ω=b/(1-a)." },
    ],
    questions: [
      choice("La forme complexe d’une similitude directe est :", ["$z'=az+b$ avec $a\ne0$", "$z'=a\bar z+b$", "$z'=az^2+b$", "$z'=b$"], 0, "Le coefficient de z doit être non nul.", "Propriété • page 6"),
      choice("Dans $z'=az+b$, le rapport vaut :", ["$|a|$", "$|b|$", "$a+b$", "$1-a$"], 0, "Le module de a mesure le facteur de longueur.", "Propriété • page 6"),
      choice("L’angle vaut :", ["$\operatorname{Arg}(a)$", "$\operatorname{Arg}(b)$", "$|a|$", "$\operatorname{Re}(a)$"], 0, "L’argument de a porte la rotation.", "Propriété • page 6"),
      choice("Les coordonnées du cours donnent :", ["$z'=(1-i)z-3+2i$", "$z'=(1+i)z-3+2i$", "$z'=(1-i)z+3-2i$", "$z'=z-3+2i$"], 0, "Le regroupement des termes en x et y donne le facteur 1-i.", "Exercice de fixation • page 6", 2),
      short("Donne le module de $1-i$.", ["sqrt2", "√2", "racine de 2"], "$|1-i|=\sqrt{1^2+(-1)^2}=\sqrt2$.", "Exercice de fixation • page 6"),
      choice("Si $a=1$, l’application est :", ["Une translation", "Toujours l’identité", "Une rotation", "Une homothétie"], 0, "Le terme b donne le vecteur de translation ; si b=0, c’est l’identité.", "Tableau récapitulatif • page 6"),
      choice("$z'=5z+2i$ est :", ["Une homothétie", "Une rotation", "Une translation", "Une similitude indirecte"], 0, "a=5 est réel et différent de 1.", "Exercice de fixation • page 7"),
      short("Donne l’affixe du centre de $z'=5z+2i$.", ["-i/2", "-0,5i", "-0.5i"], "$\omega=2i/(1-5)=-i/2$.", "Exercice de fixation • page 7", 2),
      choice("$z'=z+1+3i$ est une translation de vecteur d’affixe :", ["$1+3i$", "$1-3i$", "$3+i$", "$0$"], 0, "Quand a=1, b est l’affixe du vecteur.", "Exercice de fixation • page 7"),
      choice("Le coefficient $1/2+i\sqrt3/2$ a pour argument principal :", ["$\pi/3$", "$-\pi/3$", "$2\pi/3$", "$\pi/6$"], 0, "C’est la forme trigonométrique de $e^{i\pi/3}$.", "Exercice de fixation • page 7"),
      short("Donne le centre de cette rotation du cours.", ["1", "+1", "1+0i"], "$b=1-a$, donc $b/(1-a)=1$.", "Exercice de fixation • page 7", 2),
      short("Donne le rapport de $z'=(-1+i)z+2$.", ["sqrt2", "√2", "racine de 2"], "$|-1+i|=\sqrt2$.", "Exercice de fixation • page 7"),
      choice("Son angle principal est :", ["$3\pi/4$", "$-3\pi/4$", "$\pi/4$", "$-\pi/4$"], 0, "Le point (-1,1) est dans le deuxième quadrant.", "Exercice de fixation • page 7"),
      choice("Son centre a pour affixe :", ["$4/5+2i/5$", "$4/5-2i/5$", "$2+i$", "$1$"], 0, "$2/(2-i)=(4+2i)/5$.", "Exercice de fixation • page 7", 2),
      choice("Pour un centre d’affixe $z_A$, la bonne forme est :", ["$z'=ke^{i\theta}(z-z_A)+z_A$", "$z'=ke^{i\theta}z_A+z$", "$z'=k(z+z_A)$", "$z'=z-z_A$"], 0, "Cette forme rend immédiatement le centre invariant.", "Propriété • page 7"),
      choice("Avec $z_A=i$, $k=\sqrt2$, $\theta=\pi/4$, le coefficient de z vaut :", ["$1+i$", "$1-i$", "$\sqrt2+i$", "$i$"], 0, "$\sqrt2e^{i\pi/4}=1+i$.", "Exercice de fixation • page 7"),
      choice("L’écriture finale de cette similitude est :", ["$z'=(1+i)z+1$", "$z'=(1+i)z+i$", "$z'=(1-i)z+1$", "$z'=iz+1$"], 0, "En développant $(1+i)(z-i)+i$, le terme constant vaut 1.", "Exercice de fixation • page 7", 2),
      truth("Si $a\ne1$, le centre se trouve en résolvant $z'=z$.", true, "Le centre est le point fixe unique.", "Tableau récapitulatif • page 6"),
    ],
  },
  {
    id: "similarity-center-form",
    title: "Déterminer les images depuis le centre",
    summary:
      "Utiliser le triangle caractéristique $AMM'$ et reconnaître les configurations remarquables liées au rapport et à l’angle.",
    pages: "7-9",
    section: "III-1 et III-2. Centre, point et image",
    durationMinutes: 40,
    body: String.raw`## Caractérisation géométrique depuis le centre

Soit $s$ une similitude directe de centre $A$, de rapport $k$ et d’angle $	heta$. Pour tout point $M\ne A$, son image $M'$ est l’unique point vérifiant

$$AM'=k\,AM$$

et

$$\operatorname{Mes}(\overrightarrow{AM},\overrightarrow{AM'})=\theta.$$

Les triangles $AMM'$ associés à une même similitude ont donc la même nature, le même sens et le sommet commun $A$.

## Exercice des trois carrés

Dans la figure du cours, $ABCD$, $AEFG$ et $AHIJ$ sont des carrés directs. La similitude de centre $A$ a pour rapport $\sqrt2$ et pour angle $\pi/4$.

Dans le carré $AHIJ$ :

$$AI=\sqrt2\,AH,qquad
\operatorname{Mes}(\overrightarrow{AH},\overrightarrow{AI})=\frac\pi4.$$

Donc $s(H)=I$. De même :

$$s(E)=F,qquad s(B)=C.$$

## Triangles remarquables $AMM'$

Certaines valeurs de $(k,\theta)$ donnent immédiatement une figure connue :

| $|\theta|$ | Valeurs usuelles de $k$ | Nature de $AMM'$ |
|---:|---:|---|
| $\pi/4$ | $\sqrt2/2$ ou $\sqrt2$ | rectangle isocèle en $M$ ou en $M'$ |
| $\pi/3$ | $1/2$ ou $2$ | demi-triangle équilatéral |
| $\pi/6$ | $\sqrt3/2$ ou $2\sqrt3/3$ | demi-triangle équilatéral, selon le sommet droit |

L’orientation de l’angle décide si le triangle est de sens direct ou indirect.

## Exercice des triangles équilatéraux

$ABC$ et $ADE$ sont équilatéraux et directs, $I$ et $J$ sont les milieux de $[AB]$ et $[AD]$. Pour la similitude de centre $A$, de rapport $2$ et d’angle $\pi/3$ :

- $AIC$ est un demi-triangle équilatéral, donc $s(I)=C$ ;
- $AJE$ est un demi-triangle équilatéral, donc $s(J)=E$.

## Existence à partir d’un centre et d’une image

Si $A$, $M$ et $M'$ vérifient $A\ne M$ et $A\ne M'$, il existe une **unique** similitude directe de centre $A$ qui transforme $M$ en $M'$.

Ses paramètres sont simplement

$$k=\frac{AM'}{AM},qquad
\theta=\operatorname{Mes}(\overrightarrow{AM},\overrightarrow{AM'}).$$

Dans un carré direct $ABCD$, il existe donc une unique similitude de centre $A$ telle que $s(B)=C$.

> **Astuce mémoire de Davy.** Autour du centre, cherche un triangle connu : carré → $\pi/4$, équilatéral → $\pi/3$, puis lis le rapport sur les côtés.` ,
    keyPoint:
      "$s(M)=M'\Longleftrightarrow AM'=kAM$ et $\operatorname{Mes}(\overrightarrow{AM},\overrightarrow{AM'})=\theta$.",
    example:
      "Dans les carrés emboîtés, $k=\sqrt2$ et $\theta=\pi/4$ donnent $H\mapsto I$, $E\mapsto F$ et $B\mapsto C$.",
    methodSteps: [
      "Relie le centre A au point M puis au candidat M′.",
      "Vérifie le quotient AM′/AM.",
      "Vérifie l’angle orienté de AM vers AM′.",
      "Utilise un triangle remarquable pour éviter des calculs inutiles.",
    ],
    timeline: [
      { label: "Centre", detail: "Le sommet commun de tous les triangles AMM′ est A." },
      { label: "Distance", detail: "AM′ doit valoir k fois AM." },
      { label: "Orientation", detail: "L’angle orienté doit être θ." },
      { label: "Unicité", detail: "Ces deux contraintes déterminent un seul point M′." },
    ],
    questions: [
      choice("Si $s$ a pour centre A et $s(M)=M'$, alors :", ["$AM'=kAM$", "$MM'=kAM$", "$AM'=AM/k^2$", "$AM'=\theta AM$"], 0, "Le rapport compare les distances au centre.", "Propriété • page 7"),
      choice("L’angle caractéristique se mesure de :", ["$\overrightarrow{AM}$ vers $\overrightarrow{AM'}$", "$\overrightarrow{MM'}$ vers $\overrightarrow{AM}$", "$\overrightarrow{AM'}$ vers $\overrightarrow{AM}$", "$\overrightarrow{MA}$ vers $\overrightarrow{M'A}$"], 0, "L’ordre source puis image est essentiel.", "Propriété • page 7"),
      short("Dans un carré de côté h, donne la longueur de sa diagonale.", ["hsqrt2", "h√2", "sqrt2h", "√2h"], "Le théorème de Pythagore donne $h\sqrt2$.", "Exercice de fixation • page 7"),
      choice("Dans les carrés emboîtés, l’image de H est :", ["I", "J", "E", "B"], 0, "$AI=\sqrt2AH$ et l’angle vaut π/4.", "Exercice de fixation • pages 7-8"),
      choice("L’image de E est :", ["F", "G", "C", "I"], 0, "Le même triangle rectangle isocèle se reproduit.", "Exercice de fixation • pages 7-8"),
      choice("L’image de B est :", ["C", "D", "F", "E"], 0, "La diagonale AC vérifie les deux contraintes.", "Exercice de fixation • pages 7-8"),
      choice("Pour $|\theta|=\pi/4$ et $k=\sqrt2$, le triangle centre-point-image est :", ["Rectangle isocèle", "Équilatéral", "Quelconque", "Aplati"], 0, "C’est une configuration remarquable du tableau.", "Tableau récapitulatif • page 8"),
      choice("Pour $|\theta|=\pi/3$ et $k=2$, on obtient :", ["Un demi-triangle équilatéral", "Un carré", "Un triangle rectangle isocèle", "Un cercle"], 0, "Le rapport 2 relie un côté à l’hypoténuse du demi-triangle équilatéral.", "Tableau récapitulatif • page 8"),
      choice("Dans l’exercice des triangles équilatéraux, $s(I)$ vaut :", ["C", "E", "J", "B"], 0, "$AC=2AI$ et l’angle de AI vers AC vaut π/3.", "Exercice de fixation • page 9", 2),
      choice("Dans le même exercice, $s(J)$ vaut :", ["E", "C", "D", "I"], 0, "$AE=2AJ$ avec le même angle.", "Exercice de fixation • page 9", 2),
      truth("Tous les triangles AMM′ d’une même similitude ont la même nature et le même sens.", true, "Ils partagent le même rapport et le même angle.", "Conséquence • page 8"),
      choice("Avec A, M et M′ fixés, le rapport est :", ["$AM'/AM$", "$MM'/AM$", "$AM/AM'$ uniquement", "$AM+AM'$"], 0, "On compare la distance image à la distance source.", "Propriété • page 9"),
      truth("Il existe plusieurs similitudes directes de centre A transformant M en M′.", false, "Le rapport et l’angle sont imposés ; la similitude est unique.", "Propriété • page 9"),
      choice("Dans un carré direct ABCD, la similitude de centre A envoyant B sur C a pour rapport :", ["$\sqrt2$", "$1$", "$2$", "$\sqrt2/2$"], 0, "$AC/AB=\sqrt2$.", "Exercice de fixation • pages 9-10"),
      choice("Son angle vaut :", ["$\pi/4$", "$-\pi/4$", "$\pi/2$", "$\pi$"], 0, "La diagonale AC fait un angle de π/4 avec AB dans le carré direct.", "Exercice de fixation • pages 9-10", 2),
    ],
  },
  {
    id: "similarity-from-images",
    title: "Déterminer une similitude par des images",
    summary:
      "Exploiter un centre et une image, deux couples de points homologues ou deux triangles directement semblables.",
    pages: "9-12",
    section: "III-2 à III-4. Détermination d’une similitude directe",
    durationMinutes: 46,
    body: String.raw`## Un centre, un point et son image

Trois points $A$, $M$ et $M'$ tels que $A\ne M$ et $A\ne M'$ déterminent une unique similitude directe de centre $A$ qui transforme $M$ en $M'$ :

$$k=\frac{AM'}{AM},qquad
\theta=\operatorname{Mes}(\overrightarrow{AM},\overrightarrow{AM'}).$$

## Deux points distincts et leurs images

Si $A\ne B$ et $C\ne D$, il existe une unique similitude directe telle que

$$s(A)=C,qquad s(B)=D.$$

En écriture complexe, si $z'=az+b$, la soustraction des deux équations élimine $b$ :

$$a=\frac{z_D-z_C}{z_B-z_A},qquad
b=z_C-az_A.$$

Le centre, lorsque $a\ne1$, vaut ensuite

$$\omega=\frac{b}{1-a}.$$

## Exercice des deux carrés

Le cours donne deux carrés directs $ABCD$ et $DCEF$, et une similitude vérifiant

$$s(B)=C,qquad s(O)=D,$$

où $O$ est le centre du carré $ABCD$.

Les triangles $ABC$ et $AOD$ sont rectangles isocèles, de même sens, et ont le sommet commun $A$. Le centre de $s$ est donc $A$.

De même, les triangles $ABC$ et $ACF$ sont rectangles isocèles de même sens. On en déduit

$$s(C)=F.$$

## Construire le centre à partir de deux couples

Lorsque $s(A)=C$ et $s(B)=D$ et que la similitude n’est ni un déplacement ni une homothétie, le document construit :

1. $K=(AB)\cap(CD)$ ;
2. le cercle passant par $K,A,C$ ;
3. le cercle passant par $K,B,D$ ;
4. leur seconde intersection $\Omega$, qui est le centre.

Les angles inscrits assurent

$$\operatorname{Mes}(\overrightarrow{\Omega A},\overrightarrow{\Omega C})
=\operatorname{Mes}(\overrightarrow{\Omega B},\overrightarrow{\Omega D}).$$

## Conséquences

- Si $A\ne B$ et $B\ne C$, il existe une unique similitude directe envoyant $A$ sur $B$ et $B$ sur $C$.
- Deux triangles de même sens et de côtés homologues proportionnels sont **directement semblables**.
- Une unique similitude directe envoie alors les trois sommets du premier triangle sur ceux du second.

## Exercice des triangles $ABC$ et $DEF$

Le dessin donne

$$AB=2,quad BC=1{,}5,quad AC=1{,}75$$

et

$$DE=4,quad EF=3,quad DF=3{,}5.$$

On vérifie

$$\frac{DE}{AB}=\frac{EF}{BC}=\frac{DF}{AC}=2.$$

Les triangles ont le même sens : ils sont directement semblables, et la similitude $A\mapsto D$, $B\mapsto E$, $C\mapsto F$ a pour rapport $2$.

## Rapport, angle, un point et son image

La donnée de $k>0$, de $	heta$, d’un point $A$ et de son image $B$ détermine elle aussi une unique similitude directe. Son centre éventuel est ensuite retrouvé par construction ou par l’équation complexe du point fixe.

> **Astuce mémoire de Davy.** Avec deux images en complexes : « soustraire pour trouver $a$, remplacer pour trouver $b$, fixer pour trouver $\omega$ ».`,
    keyPoint:
      "$a=(z_D-z_C)/(z_B-z_A)$ puis $b=z_C-az_A$ lorsque $A\mapsto C$ et $B\mapsto D$.",
    example:
      "Dans les deux carrés du cours, $B\mapsto C$ et $O\mapsto D$ imposent le centre A ; la même configuration donne $C\mapsto F$.",
    methodSteps: [
      "Associe correctement chaque point source à son image.",
      "En complexes, soustrais les deux équations pour isoler a.",
      "Remplace dans une équation pour calculer b.",
      "Déduis rapport, angle et centre, puis contrôle les deux images.",
    ],
    timeline: [
      { label: "Correspondances", detail: "Écrire A→C et B→D sans inverser les couples." },
      { label: "Coefficient", detail: "Calculer le quotient des différences complexes." },
      { label: "Constante", detail: "Utiliser une image pour trouver b." },
      { label: "Centre", detail: "Résoudre ω=aω+b si a≠1." },
    ],
    interaction: centerConstructionInteraction,
    questions: [
      truth("Deux points distincts et leurs deux images distinctes déterminent une unique similitude directe.", true, "Les deux équations déterminent a et b de façon unique.", "Propriété • page 10"),
      choice("Pour $A\mapsto C$ et $B\mapsto D$, le coefficient a vaut :", ["$(z_D-z_C)/(z_B-z_A)$", "$(z_B-z_A)/(z_D-z_C)$", "$(z_C+z_D)/(z_A+z_B)$", "$z_C-z_A$"], 0, "On soustrait les équations images dans le même ordre.", "Détermination complexe • conséquence de la propriété"),
      choice("Une fois a connu, on peut calculer b par :", ["$b=z_C-az_A$", "$b=z_C+az_A$", "$b=a-z_C$", "$b=z_A-z_C$"], 0, "On remplace A→C dans z′=az+b.", "Détermination complexe"),
      short("Si $0\mapsto1$ et $1\mapsto1+i$, donne a.", ["i", "+i", "0+i"], "$a=((1+i)-1)/(1-0)=i$.", "Application directe"),
      choice("L’écriture correspondante est :", ["$z'=iz+1$", "$z'=z+i$", "$z'=(1+i)z$", "$z'=iz-1$"], 0, "L’image de 0 donne immédiatement b=1.", "Application directe", 2),
      choice("Dans l’exercice des deux carrés, le centre de s est :", ["A", "O", "C", "D"], 0, "Les deux triangles rectangles isocèles ont le sommet commun A.", "Exercice de fixation 1 • page 10"),
      choice("Dans ce même exercice, $s(C)$ vaut :", ["F", "E", "D", "B"], 0, "Les triangles ABC et ACF sont directement semblables.", "Exercice de fixation 1 • page 10", 2),
      choice("Dans la construction du centre, K est :", ["L’intersection de (AB) et (CD)", "Le milieu de [AC]", "Le milieu de [BD]", "Le centre d’un cercle donné"], 0, "K est le point auxiliaire commun aux deux faisceaux.", "Exercice de fixation 2 • page 11"),
      choice("Le centre Ω est :", ["La seconde intersection des deux cercles", "Toujours K", "Le milieu de [AB]", "L’intersection de [AC] et [BD]"], 0, "Les deux cercles se coupent en K et Ω.", "Exercice de fixation 2 • page 11"),
      truth("Si AB et CD sont parallèles dans cet exercice, la construction par leur intersection K s’applique sans adaptation.", false, "K serait à l’infini ; le cas doit être traité séparément.", "Précision de construction • page 11"),
      choice("Deux triangles directement semblables doivent d’abord avoir :", ["Le même sens", "La même aire", "Le même périmètre", "Un sommet commun"], 0, "Une similitude directe conserve l’orientation.", "Vocabulaire • page 12"),
      short("Calcule $DE/AB$ avec DE=4 et AB=2.", ["2", "+2"], "$4/2=2$.", "Exercice de fixation • page 12"),
      short("Calcule $EF/BC$ avec EF=3 et BC=1,5.", ["2", "+2"], "$3/1,5=2$.", "Exercice de fixation • page 12"),
      short("Calcule $DF/AC$ avec DF=3,5 et AC=1,75.", ["2", "+2"], "$3,5/1,75=2$.", "Exercice de fixation • page 12"),
      choice("Le rapport de la similitude envoyant ABC sur DEF vaut :", ["2", "1/2", "3", "4"], 0, "Les trois quotients homologues valent 2.", "Exercice de fixation • page 12", 2),
      truth("L’égalité d’un seul quotient de côtés suffit toujours à prouver que deux triangles sont directement semblables.", false, "Il faut des rapports homologues cohérents et le même sens, ou une condition angle-rapports équivalente.", "Propriétés • page 12", 2),
    ],
  },
  {
    id: "similarity-center-construction",
    title: "Construire un centre, une image et un lieu",
    summary:
      "Combiner arc capable, cercle d’Apollonius, image d’une droite et image d’un cercle pour résoudre des constructions.",
    pages: "13-18",
    section: "III-4 et IV. Construction et utilisation des similitudes directes",
    durationMinutes: 56,
    kind: "challenge",
    body: String.raw`## Construire le centre avec le rapport et l’angle

On connaît $A$, son image $B$, le rapport $k=4$ et l’angle $	heta=\pi/4$. Le centre $K$ doit satisfaire simultanément

$$\operatorname{Mes}(\overrightarrow{KA},\overrightarrow{KB})=\frac\pi4$$

et

$$\frac{KB}{KA}=4.$$

La première contrainte définit un **arc capable** $(E_1)$ construit sur $[AB]$. La seconde définit un **cercle d’Apollonius** $(E_2)$.

### Cercle d’Apollonius corrigé

Pour $MB/MA=4$, les deux points de division de la droite $(AB)$ sont :

$$\overrightarrow{AI}=\frac15\overrightarrow{AB}$$

et

$$\overrightarrow{AJ}=-\frac13\overrightarrow{AB}.$$

Le lieu $(E_2)$ est le cercle de diamètre $[IJ]$. Le centre $K$ cherché est l’intersection de $(E_1)$ et $(E_2)$ qui respecte l’orientation $pi/4$.

## Construire l’image d’un point avec $(k,\theta,A\mapsto B)$

Le cours donne un triangle direct $ABC$, rectangle en $C$, avec

$$\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{AC})=\frac\pi6,$$

et une similitude de rapport $3$, d’angle $\pi/6$, telle que $s(A)=B$. Pour construire $D=s(C)$, il faut imposer

$$BD=3AC$$

et

$$\operatorname{Mes}(\overrightarrow{AC},\overrightarrow{BD})=\frac\pi6.$$

Une demi-droite issue de $B$ fournit la direction ; le report de $3AC$ fournit la position de $D$.

## Démontrer une propriété par composition

Dans le triangle direct $ABC$, les triangles $IBC$, $JAC$ et $KBA$ sont rectangles isocèles. Le cours définit :

- $s_1$ de centre $A$, envoyant $C$ sur $J$, de rapport $\sqrt2/2$ et d’angle $\pi/4$ ;
- $s_2$ de centre $B$, envoyant $C$ sur $I$ et $A$ sur $K$, avec les mêmes paramètres.

La composée

$$s=s_1\circ s_2^{-1}$$

a pour rapport $1$ et angle $0$ : c’est une translation. Elle envoie $K$ sur $A$ et $I$ sur $J$, donc

$$\overrightarrow{KA}=\overrightarrow{IJ}.$$

Ainsi, le quadrilatère $IJAK$ est un parallélogramme.

## Résoudre un problème de construction entre deux droites

On cherche un triangle $ABC$ rectangle en $B$, avec $B\in(D_2)$, $C\in(D_1)$ et

$$\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{AC})=\frac\pi3.$$

Le triangle est un demi-triangle équilatéral :

$$AC=2AB.$$

Le point $C$ est donc l’image de $B$ par la similitude de centre $A$, de rapport $2$ et d’angle $\pi/3$. On construit l’image $(D_2')$ de la droite $(D_2)$ ; alors

$$C=(D_1)\cap(D_2').$$

Enfin $B=s^{-1}(C)$, où $s^{-1}$ a pour rapport $1/2$ et angle $-\pi/3$.

## Rechercher un lieu géométrique

Un point $K$ décrit un cercle $(C)$ de diamètre $[IJ]$. Le point $B$ est l’image de $K$ par une similitude fixe de centre $A$, de rapport $\sqrt2/2$ et d’angle $-\pi/4$.

L’image d’un cercle par une similitude est un cercle. Si $I'=s(I)$ et $J'=s(J)$, le lieu de $B$ est donc

$$C'=s(C),$$

le cercle de diamètre $[I'J']$.

> **Correction de la source.** La page 13 imprime $\overrightarrow{AI}=\frac14\overrightarrow{AB}$ après avoir annoncé que $I$ est le barycentre de $(A,4)$ et $(B,1)$. Le calcul correct donne $\frac1{4+1}=\frac15$.

> **Astuce mémoire de Davy.** Une construction par similitude devient souvent simple dès qu’on construit l’image d’une **droite entière** ou d’un **cercle entier**, puis qu’on prend une intersection.` ,
    keyPoint:
      "Centre = intersection des lieux imposés par l’angle et le rapport ; image d’un lieu = lieu des images.",
    example:
      "Pour construire le triangle entre $(D_1)$ et $(D_2)$, transforme d’abord toute la droite $(D_2)$, puis prends son intersection avec $(D_1)$.",
    methodSteps: [
      "Traduis chaque donnée en un lieu : arc capable, cercle d’Apollonius, droite ou cercle image.",
      "Construis les lieux indépendamment avec une règle et un compas.",
      "Prends leur intersection en respectant l’orientation demandée.",
      "Vérifie à la fin le rapport, l’angle et l’appartenance aux lieux initiaux.",
    ],
    timeline: [
      { label: "Contraintes", detail: "Séparer angle, rapport et appartenances." },
      { label: "Lieux", detail: "Transformer chaque contrainte en objet constructible." },
      { label: "Intersection", detail: "Croiser les lieux obtenus." },
      { label: "Validation", detail: "Contrôler orientation et longueurs." },
    ],
    questions: [
      choice("La condition $\operatorname{Mes}(\overrightarrow{MA},\overrightarrow{MB})=\pi/4$ définit :", ["Un arc capable", "Une médiatrice", "Une ellipse", "Une droite parallèle"], 0, "Un angle inscrit constant définit un arc capable.", "Exercice de fixation 1 • page 13"),
      choice("La condition $MB/MA=4$ définit :", ["Un cercle d’Apollonius", "Une parabole", "Un segment", "Toujours une droite"], 0, "Un rapport constant de distances à deux points définit un cercle si le rapport diffère de 1.", "Exercice de fixation 1 • page 13"),
      choice("La valeur correcte de $\overrightarrow{AI}$ est :", ["$\frac15\overrightarrow{AB}$", "$\frac14\overrightarrow{AB}$", "$\frac13\overrightarrow{AB}$", "$4\overrightarrow{AB}$"], 0, "I est barycentre de (A,4) et (B,1), donc AI=AB/5.", "Exercice de fixation 1 corrigé • page 13", 3),
      choice("La valeur de $\overrightarrow{AJ}$ est :", ["$-\frac13\overrightarrow{AB}$", "$\frac13\overrightarrow{AB}$", "$-\frac14\overrightarrow{AB}$", "$3\overrightarrow{AB}$"], 0, "J est le point de division extérieure correspondant.", "Exercice de fixation 1 • page 13", 2),
      choice("Le cercle d’Apollonius $(E_2)$ a pour diamètre :", ["$[IJ]$", "$[AB]$", "$[AI]$", "$[BJ]$"], 0, "Les deux points de division interne et externe sont les extrémités du diamètre.", "Exercice de fixation 1 • pages 13-14"),
      choice("Le centre K cherché appartient :", ["Aux deux lieux $E_1$ et $E_2$", "Seulement à $E_1$", "À la médiatrice de [AB] uniquement", "À [AB]"], 0, "Il doit vérifier simultanément l’angle et le rapport.", "Exercice de fixation 1 • pages 13-14"),
      short("Dans l’exercice 2, donne le rapport $BD/AC$.", ["3", "+3"], "Une similitude de rapport 3 multiplie AC par 3.", "Exercice de fixation 2 • page 15"),
      choice("L’angle de $\overrightarrow{AC}$ vers $\overrightarrow{BD}$ vaut :", ["$\pi/6$", "$-\pi/6$", "$\pi/3$", "$\pi/2$"], 0, "C’est l’angle de la similitude.", "Exercice de fixation 2 • page 15"),
      choice("Dans la preuve du parallélogramme, le rapport de $s_2^{-1}$ vaut :", ["$\sqrt2$", "$\sqrt2/2$", "$2$", "$1$"], 0, "On inverse le rapport √2/2.", "Utilisation 1 • page 16"),
      choice("Son angle vaut :", ["$-\pi/4$", "$\pi/4$", "$\pi/2$", "$0$"], 0, "La réciproque change le signe de l’angle.", "Utilisation 1 • page 16"),
      choice("La composée $s_1\circ s_2^{-1}$ est :", ["Une translation", "Une rotation", "Une homothétie", "Une symétrie"], 0, "Son rapport vaut 1 et son angle 0.", "Utilisation 1 • page 16", 2),
      choice("Elle permet de conclure que IJAK est :", ["Un parallélogramme", "Un carré", "Un trapèze quelconque", "Un triangle"], 0, "$\overrightarrow{KA}=\overrightarrow{IJ}$.", "Utilisation 1 • page 16", 2),
      choice("Dans le problème entre deux droites, le rapport de la similitude est :", ["2", "1/2", "√2", "3"], 0, "Le demi-triangle équilatéral vérifie AC=2AB.", "Utilisation 2 • page 17"),
      choice("Son angle est :", ["$\pi/3$", "$-\pi/3$", "$\pi/6$", "$\pi/2$"], 0, "C’est l’angle donné de AB vers AC.", "Utilisation 2 • page 17"),
      choice("Le point C se construit comme :", ["$(D_1)\cap s(D_2)$", "$(D_2)\cap s(D_1)$", "Le milieu de [AB]", "Le centre d’un cercle"], 0, "B appartient à D2, donc C=s(B) appartient à s(D2), et C appartient aussi à D1.", "Utilisation 2 • page 17", 2),
      choice("La réciproque utilisée pour retrouver B a pour paramètres :", ["$(1/2,-\pi/3)$", "$(2,\pi/3)$", "$(1/2,\pi/3)$", "$(2,-\pi/3)$"], 0, "On inverse le rapport et on oppose l’angle.", "Utilisation 2 • page 17", 2),
      choice("L’image d’un cercle par une similitude est :", ["Un cercle", "Toujours une droite", "Une ellipse quelconque", "Un segment"], 0, "Les distances au centre sont toutes multipliées par k.", "Utilisation 3 • page 18"),
      choice("Le lieu de B lorsque K décrit (C) est :", ["Le cercle $(C')$ de diamètre $[I'J']$", "La droite (IJ)", "Le cercle (C) inchangé", "Une parabole"], 0, "B=s(K), donc son lieu est l’image s(C).", "Utilisation 3 • page 18", 3),
    ],
    corrections: [
      "Page 13 : pour I barycentre de (A,4) et (B,1), le document imprime AI=AB/4. Le calcul correct est AI=AB/5 ; le cercle d’Apollonius est conservé avec cette position corrigée.",
    ],
  },
  {
    id: "similarity-applications",
    title: "Missions de synthèse et applications",
    summary:
      "Mobiliser tout le chapitre dans les ellipses, les constructions, les suites complexes, les lieux géométriques et une situation de charpente.",
    pages: "19-33",
    section: "V. Synthèse, application, renforcement, Bac et situation complexe",
    durationMinutes: 90,
    kind: "challenge",
    body: String.raw`## 1. Transformer une ellipse par une similitude

On considère

$$E:\quad25x^2+25y^2+14xy-144=0$$

et la similitude

$$z'=(1-i)z.$$

Comme

$$z=\frac{1+i}{2}z',$$

on obtient

$$x=\frac{x'-y'}2,qquad y=\frac{x'+y'}2.$$

En remplaçant dans l’équation de $E$ :

$$16x'^2+9y'^2=144.$$

L’ellipse auxiliaire correcte est donc

$$E_0:\quad\frac{x'^2}{9}+\frac{y'^2}{16}=1.$$

Ses sommets sont

$$A_0(0;4),\ A_0'(0;-4),\ B_0(3;0),\ B_0'(-3;0),$$

si l’on nomme $A_0,A_0'$ sur le grand axe. Le document utilise une autre attribution des lettres après avoir inversé les coefficients dans l’énoncé ; pour rester cohérent avec son tableau final, on peut aussi prendre les sommets calculés de $16x'^2+9y'^2=144$ : $(\pm3;0)$ et $(0;\pm4)$.

L’important est de ne pas mélanger l’équation et les sommets. Les sommets de $E$ sont les images réciproques par

$$s^{-1}(z')=\frac{1+i}{2}z'.$$

Ainsi :

$$ (3,0)\mapsto\left(\frac32,\frac32\right),\qquad
(0,4)\mapsto(-2,2),$$

et de même pour les opposés.

> **Correction majeure.** La page 19 annonce $9x^2+16y^2-144=0$, tandis que le calcul développé page 20 donne bien $16x^2+9y^2-144=0$. C’est cette dernière équation, obtenue par substitution directe, qui est correcte. Les « exercices 1 et 2 » de la page 19 sont par ailleurs des duplications mot pour mot : ils ne sont comptés qu’une fois ici.

## 2. Exercices d’application

### Carré direct

Dans un carré direct $ABCD$ de centre $I$, la similitude de centre $A$ telle que $s(B)=C$ a pour rapport $\sqrt2$ et angle $\pi/4$. Le triangle $AID$ porte les mêmes paramètres, donc

$$s(I)=D.$$

Dans un autre carré direct, si $s(D)=O$ et $s(C)=B$, alors

$$k=\frac{OB}{DC}=\frac{\sqrt2}{2},qquad\theta=-\frac\pi4.$$

### Reconnaissance de six écritures complexes

| Écriture | Nature et éléments essentiels |
|---|---|
| $z'=\frac{-1+i}{2}z+4-3i$ | centre $3-i$, $k=\sqrt2/2$, $\theta=3\pi/4$ |
| $z'=(\frac{\sqrt3}{2}-\frac i2)z-\sqrt3+(5-2\sqrt3)i$ | rotation de centre $2+4i$, angle $-\pi/6$ |
| $z'=z+5-7i$ | translation de vecteur d’affixe $5-7i$ |
| $z'=-4z+\frac{15}{2}-\frac52i$ | homothétie de centre $3/2-i/2$, rapport algébrique $-4$ |
| $z'=-z+2-6i$ | demi-tour de centre $1-3i$ |
| $z'=-(1+i)z$ | centre O, $k=\sqrt2$, $\theta=-3\pi/4$ |

### Produit scalaire

Une similitude de rapport $k$ conserve les angles et multiplie chaque longueur par $k$. Pour trois points $A,B,C$ :

$$\overrightarrow{A'B'}\cdot\overrightarrow{A'C'}
=k^2\,\overrightarrow{AB}\cdot\overrightarrow{AC}.$$

### Écritures à partir du centre

Le coefficient complexe est toujours $a=ke^{i\theta}$ et $b=(1-a)\omega$.

- centre $3-2i$, $k=2\sqrt2$, $\theta=-3\pi/4$ :

$$z'=(-2-2i)z+13;$$

- centre $i\sqrt3$, $k=4$, $\theta=-2\pi/3$ :

$$z'=(-2-2\sqrt3i)z-6+3\sqrt3i;$$

- centre O, $k=3$, $\theta=5\pi/6$ :

$$z'=\left(-\frac{3\sqrt3}{2}+\frac32i\right)z.$$

### Losange et composée

Dans le losange du document, la similitude de centre $A$ envoyant $B$ sur le centre $O$ a pour paramètres

$$k=\frac12,qquad\theta=\frac\pi3.$$

Elle envoie $C$ sur le milieu $L$ de $[AD]$. Le point $E$ tel que $s(E)=C$ est sur la demi-droite $[AB)$ et vérifie $AE=8$ cm. Enfin

$$s^3$$

a pour rapport $1/8$ et angle $\pi$ : c’est l’homothétie de centre $A$ et de rapport algébrique $-1/8$.

### Triangle équilatéral

Dans le triangle équilatéral direct $ABC$, la similitude de rapport $2$, d’angle $\pi/3$, telle que $s(A)=B$ construit $D=s(C)$ en imposant

$$BD=2AC,qquad
\operatorname{Mes}(\overrightarrow{AC},\overrightarrow{BD})=\frac\pi3.$$

### Équation d’un cercle

Pour

$$s(z)=(-1+i)z+3-4i,$$

le coefficient donne $k=\sqrt2$ et $\theta=3\pi/4$. L’unique antécédent de O est

$$z_0=-\frac{3-4i}{-1+i}=\frac72-\frac12i.$$

Comme $s(z)=(-1+i)(z-z_0)$, l’équation

$$|(-1+i)z+3-4i|=2\sqrt2$$

équivaut à

$$|z-z_0|=2.$$

Le lieu est le cercle de centre d’affixe $7/2-i/2$ et de rayon $2$.

### Carré entre deux droites

Pour construire un carré indirect avec $B\in(D_2)$ et $C\in(D_1)$, utilise la similitude de centre $A$, de rapport $\sqrt2$ et d’angle $-\pi/4$, qui envoie $B$ sur $C$. Construis $s(D_2)$, prends

$$C=(D_1)\cap s(D_2),$$

puis retrouve $B=s^{-1}(C)$.

## 3. Renforcement : une suite de points qui converge

On étudie

$$z'=\frac{1-i}{2}z+1+i.$$

Le centre est le point $B$ d’affixe $2$, le rapport vaut $\sqrt2/2$ et l’angle $-\pi/4$. Avec $z_0=10$ et $z_{n+1}=s(z_n)$ :

$$z_n=2+8\left(\frac{1-i}{2}\right)^n.$$

Donc

$$\operatorname{Mes}(\overrightarrow{OI},\overrightarrow{BA_n})=-\frac{n\pi}{4}\pmod{2\pi}$$

et

$$BA_n=\frac8{(\sqrt2)^n}.$$

On en déduit :

- $A_n\in(OI)$ si et seulement si $n=4q$ ;
- $(BA_n)\perp(OI)$ si et seulement si $n=4q+2$ ;
- le premier $n$ tel que $BA_n\le10^{-2}$ est $n=20$.

La ligne brisée de $A_0$ à $A_n$ a pour longueur

$$L_n=(8\sqrt2+8)\left[1-\left(\frac{\sqrt2}{2}\right)^n\right]$$

et

$$\lim_{n\to+\infty}L_n=8\sqrt2+8.$$

## 4. Renforcement : similitude et sommes d’aires

Pour

$$z'=\left(\frac12-\frac i2\right)z+\frac12+\frac i2,$$

le centre est $I$ d’affixe $1$, le rapport $\sqrt2/2$ et l’angle $-\pi/4$. Les points successifs $A,B,C,D,E$ forment une spirale de triangles rectangles isocèles.

Si $a_n$ est l’aire de $IM_nM_{n+1}$, alors

$$a_0=16,qquad a_{n+1}=\frac12a_n.$$

La somme correcte est

$$A_n=\sum_{j=0}^na_j
=32\left[1-\left(\frac12\right)^{n+1}\right].$$

Par conséquent :

$$\mathcal A(IABCDE)=A_3=30,qquad
\lim_{n\to+\infty}A_n=32.$$

Enfin, si $AB=4\sqrt2$ :

$$DE=\left(\frac{\sqrt2}{2}\right)^3AB=2.$$

> **Correction majeure.** La page 31 oublie le facteur $1/(1-1/2)=2$ dans la somme géométrique. Elle annonce donc 15 et 16 au lieu des valeurs correctes 30 et 32.

## 5. Extrait Bac C Côte d’Ivoire 1998

Dans le carré $ABCD$, la rotation $r$ de centre $A$ telle que $r(D)=B$ a pour angle $\pi/2$. Si $M\in(DC)$, alors

$$N=r(M),$$

et le triangle $AMN$ est rectangle isocèle en $A$.

La similitude $s$ de centre $A$ telle que $s(D)=O$ a pour paramètres

$$k=\frac{\sqrt2}{2},qquad\theta=\frac\pi4.$$

Elle vérifie $s(C)=B$. Comme $I$ est le milieu de $[MN]$, on a $I=s(M)$. Lorsque $M$ décrit $(DC)$, $I$ décrit donc la droite image

$$s(DC)=(OB).$$

> **Correction de l’énoncé.** La page 32 demande de montrer que « N est l’image de N » par la rotation. La cohérence de la figure et de la suite impose : **N est l’image de M**.

## 6. Mission finale : retrouver l’intersection de deux chevrons

Deux droites $(D)$ et $(D')$ se coupent hors de la toiture en un point inaccessible $O$. On veut tracer, depuis le point accessible $A$, la droite $(AO)$.

1. Choisis une homothétie $h$ de centre $A$ et de rapport $1/2$.
2. Choisis $B\in(D)$ et construis $h(B)$ ; la parallèle à $(D)$ passant par $h(B)$ est $h(D)$.
3. Choisis $E\in(D')$ et construis $h(E)$ ; la parallèle à $(D')$ passant par $h(E)$ est $h(D')$.
4. Construis $O'=h(D)\cap h(D')$.

Comme $O'=h(O)$ et que toute homothétie aligne un point, son image et son centre, les points $A,O',O$ sont alignés. La droite recherchée est donc

$$(AO')=(AO).$$

> **Astuce mémoire de Davy.** Quand l’intersection est trop loin, réduis toute la figure par une homothétie : l’intersection revient à portée, mais sa direction depuis le centre ne change pas.`,
    keyPoint:
      "Choisir la similitude adaptée transforme un problème difficile de figure, de suite ou de lieu en un calcul de rapport, d’angle et d’image.",
    example:
      "Pour les chevrons, une homothétie de centre A et de rapport 1/2 ramène l’intersection inaccessible O en un point O′ constructible, aligné avec A et O.",
    methodSteps: [
      "Repère les points homologues, la figure mobile ou la suite itérée.",
      "Détermine le coefficient complexe ou les paramètres géométriques.",
      "Transforme l’objet entier : droite, cercle, ellipse, longueurs ou aires.",
      "Contrôle la cohérence des unités, de l’orientation et des sommes géométriques.",
    ],
    timeline: [
      { label: "Modéliser", detail: "Reconnaître la similitude cachée dans la figure ou la récurrence." },
      { label: "Paramétrer", detail: "Calculer centre, rapport et angle." },
      { label: "Transformer", detail: "Appliquer l’image aux objets ou aux suites." },
      { label: "Valider", detail: "Contrôler équations, longueurs, aires et limites." },
    ],
    interaction: spiralInteraction,
    corrections: [
      "Page 19 : les exercices de synthèse 1 et 2 sont strictement identiques ; le doublon est regroupé sans supprimer aucune question distincte.",
      "Pages 19-20 : la substitution donne E₀ : 16x²+9y²-144=0, et non 9x²+16y²-144=0 comme annoncé dans l’énoncé.",
      "Page 31 : la somme des aires oublie la division par 1-q. Les valeurs correctes sont Aₙ=32[1-(1/2)^(n+1)], aire(IABCDE)=30 et limite 32.",
      "Page 32 : « N est l’image de N par r » est remplacé par « N est l’image de M par r », conformément à la figure et à la démonstration.",
      "Pages 32-33 : les coquilles rédactionnelles « doit penser » et « droit » sont interprétées comme « doit passer » et « droite » sans modifier la construction par homothétie.",
    ],
    questions: [
      choice("Pour $z'=(1-i)z$, l’expression de z en fonction de z′ est :", ["$z=(1+i)z'/2$", "$z=(1-i)z'/2$", "$z=(1+i)z'$", "$z=z'/2$"], 0, "L’inverse de 1-i est (1+i)/2.", "Synthèse • pages 19-20"),
      choice("Après substitution, l’équation correcte de $E_0$ est :", ["$16x^2+9y^2=144$", "$9x^2+16y^2=144$", "$25x^2+25y^2=144$", "$x^2+y^2=144$"], 0, "Le calcul développé de la source et la substitution directe donnent ces coefficients.", "Synthèse corrigée • pages 19-20", 3),
      short("Pour $16x^2+9y^2=144$, donne le demi-axe porté par Ox.", ["3", "+3"], "$x^2/9+y^2/16=1$, donc le demi-axe horizontal vaut 3.", "Synthèse corrigée • page 20"),
      short("Donne le demi-axe porté par Oy.", ["4", "+4"], "Le dénominateur sous y² vaut 16.", "Synthèse corrigée • page 20"),
      choice("L’image réciproque de $(3,0)$ par s est :", ["$(3/2,3/2)$", "$(3,3)$", "$(-3/2,3/2)$", "$(0,3)$"], 0, "On multiplie 3 par (1+i)/2.", "Synthèse corrigée • pages 20-21", 2),
      choice("L’image réciproque de $(0,4)$ est :", ["$(-2,2)$", "$(2,2)$", "$(-4,4)$", "$(0,2)$"], 0, "$(1+i)4i/2=-2+2i$.", "Synthèse corrigée • pages 20-21", 2),
      truth("Les exercices de synthèse 1 et 2 de la page 19 ont des énoncés différents.", false, "Ils sont dupliqués mot pour mot dans le PDF.", "Synthèse • page 19"),
      choice("Dans le carré direct de l’application 1, $s(I)$ vaut :", ["D", "C", "B", "A"], 0, "Les triangles ABC et AID portent le même rapport et le même angle.", "Exercice d’application 1 • page 22", 2),
      choice("Pour $s(D)=O$ et $s(C)=B$ dans un carré, le rapport vaut :", ["$\sqrt2/2$", "$\sqrt2$", "$1/2$", "$2$"], 0, "$OB/DC=1/\sqrt2=\sqrt2/2$.", "Exercice d’application 2 • page 22"),
      choice("Son angle vaut :", ["$-\pi/4$", "$\pi/4$", "$-\pi/2$", "$0$"], 0, "La direction DC est transformée en OB avec un quart de tour négatif de 45°.", "Exercice d’application 2 • page 22", 2),
      choice("$z'=(-1+i)z/2+4-3i$ a pour centre :", ["$3-i$", "$3+i$", "$4-3i$", "$1$"], 0, "$b/(1-a)=3-i$.", "Exercice d’application 3a • page 22", 2),
      choice("Son rapport vaut :", ["$\sqrt2/2$", "$\sqrt2$", "$1/2$", "$2$"], 0, "$|(-1+i)/2|=\sqrt2/2$.", "Exercice d’application 3a • page 22"),
      choice("La transformation 3b est :", ["Une rotation de centre $2+4i$", "Une translation", "Une homothétie", "Une similitude indirecte"], 0, "Le coefficient a un module 1 et un argument -π/6.", "Exercice d’application 3b • page 22", 2),
      choice("$z'=z+5-7i$ est :", ["Une translation", "Une rotation", "Une homothétie", "L’identité"], 0, "a=1 et b≠0.", "Exercice d’application 3c • page 22"),
      choice("$z'=-4z+15/2-5i/2$ est une homothétie de centre :", ["$3/2-i/2$", "$15/2-5i/2$", "$3/2+i/2$", "$0$"], 0, "$b/(1+4)=3/2-i/2$.", "Exercice d’application 3d • page 22", 2),
      choice("$z'=-z+2-6i$ est un demi-tour de centre :", ["$1-3i$", "$2-6i$", "$-1+3i$", "$0$"], 0, "$b/(1-(-1))=1-3i$.", "Exercice d’application 3e • page 22"),
      choice("$z'=-(1+i)z$ a pour angle principal :", ["$-3\pi/4$", "$3\pi/4$", "$-\pi/4$", "$\pi/4$"], 0, "Le coefficient -1-i est dans le troisième quadrant, d’argument principal -3π/4.", "Exercice d’application 3f • page 22"),
      choice("Le produit scalaire des vecteurs images est multiplié par :", ["$k^2$", "$k$", "$1/k$", "$\theta$"], 0, "Chaque norme est multipliée par k et le cosinus de l’angle est conservé.", "Exercice d’application 4 • page 22", 2),
      choice("Pour construire $S(A,3,3\pi/4)(M)$, il faut :", ["Tourner de $3\pi/4$ puis tripler la distance à A", "Tripler l’angle", "Faire une translation de 3", "Prendre le symétrique de M"], 0, "La décomposition canonique sépare rotation et homothétie.", "Exercice d’application 5 • page 23"),
      choice("Centre $3-2i$, $k=2\sqrt2$, angle $-3\pi/4$ : le coefficient a vaut :", ["$-2-2i$", "$2-2i$", "$-2+2i$", "$2+2i$"], 0, "$2\sqrt2e^{-3i\pi/4}=-2-2i$.", "Exercice d’application 6a • page 23", 2),
      choice("L’écriture complète correspondante est :", ["$z'=(-2-2i)z+13$", "$z'=(-2-2i)z+3-2i$", "$z'=(2+2i)z+13$", "$z'=-2z+13$"], 0, "$b=(1-a)(3-2i)=13$.", "Exercice d’application 6a • page 23", 3),
      choice("Pour le centre $i\sqrt3$, $k=4$, angle $-2\pi/3$, l’écriture est :", ["$z'=(-2-2\sqrt3i)z-6+3\sqrt3i$", "$z'=4z+i\sqrt3$", "$z'=(-2+2\sqrt3i)z+6$", "$z'=iz-6$"], 0, "On calcule a=4e^{-2iπ/3}, puis b=(1-a)i√3.", "Exercice d’application 6b • page 23", 3),
      choice("Pour le centre O, $k=3$, angle $5\pi/6$, le terme constant vaut :", ["0", "3", "$5\pi/6$", "$i$"], 0, "Une similitude centrée en O s’écrit z′=az.", "Exercice d’application 6c • page 23"),
      choice("Dans le losange, le rapport de s est :", ["$1/2$", "2", "$\sqrt2/2$", "1"], 0, "O est le milieu de la diagonale AC et la géométrie du losange donne AO/AB=1/2.", "Exercice d’application 7 • page 23"),
      choice("L’image de C est :", ["Le milieu L de [AD]", "D", "O", "B"], 0, "La rotation de π/3 et la réduction de moitié envoient AC sur AL.", "Exercice d’application 7a • page 23", 2),
      short("Le point E tel que s(E)=C vérifie AE= combien de cm ?", ["8", "8cm", "8 cm"], "La réciproque a pour rapport 2 et AC=4 cm dans cette configuration.", "Exercice d’application 7b • page 23", 2),
      choice("La composée $s^3$ est une homothétie de rapport algébrique :", ["$-1/8$", "$1/8$", "$-1/2$", "$1/2$"], 0, "Le rapport positif est (1/2)³=1/8 et l’angle total π donne le signe négatif.", "Exercice d’application 7c • page 23", 3),
      choice("Dans le triangle équilatéral de l’exercice 8, D doit vérifier :", ["$BD=2AC$ et angle $(AC,BD)=\pi/3$", "$BD=AC/2$", "$CD=2AB$", "$BD=AC$"], 0, "Ce sont le rapport et l’angle appliqués au couple A,C.", "Exercice d’application 8 • page 23"),
      short("Pour $s(z)=(-1+i)z+3-4i$, donne le rapport.", ["sqrt2", "√2", "racine de 2"], "$|-1+i|=\sqrt2$.", "Exercice d’application 9 • page 24"),
      choice("L’unique antécédent de O a pour affixe :", ["$7/2-i/2$", "$2-i$", "$-7/2+i/2$", "$3-4i$"], 0, "Il résout (-1+i)z+3-4i=0.", "Exercice d’application 9 • page 24", 2),
      choice("Le lieu $|(-1+i)z+3-4i|=2\sqrt2$ est un cercle de rayon :", ["2", "$2\sqrt2$", "$\sqrt2$", "4"], 0, "On divise les deux membres par |-1+i|=√2.", "Exercice d’application 9 • page 24", 2),
      choice("Pour le carré indirect entre deux droites, C se trouve par :", ["$(D_1)\cap s(D_2)$", "$(D_2)\cap s(D_1)$", "Une médiatrice", "Le cercle de centre A"], 0, "B∈D2 et C=s(B)∈s(D2), tout en appartenant à D1.", "Exercice d’application 10 • page 24", 2),
      choice("Dans le renforcement 2, le centre de s a pour affixe :", ["2", "10", "$1+i$", "0"], 0, "$b/(1-a)=2$.", "Renforcement 2 • pages 26-27"),
      choice("Son rapport vaut :", ["$\sqrt2/2$", "$\sqrt2$", "$1/2$", "2"], 0, "$|(1-i)/2|=\sqrt2/2$.", "Renforcement 2 • pages 26-27"),
      choice("La formule de $z_n$ est :", ["$2+8((1-i)/2)^n$", "$10((1-i)/2)^n$", "$2+8(1-i)^n$", "$8+2((1-i)/2)^n$"], 0, "On écrit l’itération autour du point fixe 2.", "Renforcement 2 • pages 26-28", 2),
      choice("$A_n$ appartient à (OI) lorsque :", ["$n=4q$", "$n=2q+1$", "$n=4q+2$", "pour tout n"], 0, "Il faut que -nπ/4 soit multiple de π.", "Renforcement 2 • page 28", 2),
      choice("$(BA_n)$ est perpendiculaire à (OI) lorsque :", ["$n=4q+2$", "$n=4q$", "$n=2q+1$", "$n=8q$"], 0, "L’angle doit être π/2 modulo π.", "Renforcement 2 • page 28", 2),
      choice("La distance $BA_n$ vaut :", ["$8/(\sqrt2)^n$", "$8(\sqrt2)^n$", "$2/8^n$", "$8/n$"], 0, "Chaque itération multiplie la distance au centre par √2/2.", "Renforcement 2 • page 28"),
      short("Donne le premier n tel que $BA_n\le10^{-2}$.", ["20", "+20"], "Le calcul logarithmique donne n≥19,28, donc le plus petit entier est 20.", "Renforcement 2 • page 28", 3),
      short("Calcule $L_1$.", ["4sqrt2", "4√2", "sqrt2*4"], "$|z_1-z_0|=|-4-4i|=4\sqrt2$.", "Renforcement 2 • page 30", 2),
      choice("La limite de $L_n$ vaut :", ["$8\sqrt2+8$", "$4\sqrt2$", "8", "$+\infty$"], 0, "La somme géométrique converge car √2/2<1.", "Renforcement 2 • page 30", 3),
      choice("Dans le renforcement 3, la raison de la suite des aires est :", ["$1/2$", "$\sqrt2/2$", "2", "$1/4$"], 0, "Les aires sont multipliées par k²=(√2/2)²=1/2.", "Renforcement 3 • pages 30-31"),
      short("Donne l’aire initiale $a_0$.", ["16", "+16"], "Le triangle IAB est rectangle, de base 8 et hauteur 4 : aire 16.", "Renforcement 3 • page 31"),
      choice("La formule corrigée de $A_n$ est :", ["$32[1-(1/2)^{n+1}]$", "$16[1-(1/2)^{n+1}]$", "$16(1/2)^n$", "$32(1/2)^n$"], 0, "La somme géométrique doit être divisée par 1-1/2.", "Renforcement 3 corrigé • page 31", 3),
      short("Donne l’aire corrigée du polygone IABCDE.", ["30", "+30"], "$A_3=16+8+4+2=30$.", "Renforcement 3 corrigé • page 31", 3),
      short("Donne la limite corrigée de $A_n$.", ["32", "+32"], "La somme infinie vaut 16/(1-1/2)=32.", "Renforcement 3 corrigé • page 31", 3),
      short("Si $AB=4\sqrt2$, donne DE.", ["2", "+2"], "$DE=(\sqrt2/2)^3AB=2$.", "Renforcement 3 • page 31", 2),
      choice("Dans l’exercice Bac, la phrase correcte est :", ["N est l’image de M par r", "N est l’image de N par r", "M est fixe par r", "D est l’image de N"], 0, "La rotation envoie la droite (DC) sur (BC) et AM sur AN.", "Exercice de maison corrigé • page 32", 3),
      choice("Le triangle AMN est :", ["Rectangle isocèle en A", "Équilatéral", "Rectangle en M", "Quelconque"], 0, "Une rotation de π/2 conserve AM et donne AM⊥AN.", "Exercice de maison • page 32"),
      choice("La similitude de centre A envoyant D sur O a pour paramètres :", ["$(\sqrt2/2,\pi/4)$", "$(\sqrt2,\pi/4)$", "$(1/2,\pi/2)$", "$(1,\pi/4)$"], 0, "AO/AD=√2/2 et l’angle de AD vers AO vaut π/4.", "Exercice de maison • page 32", 2),
      choice("L’image de C par cette similitude est :", ["B", "O", "D", "A"], 0, "Dans un repère du carré, le coefficient (1+i)/2 envoie C sur B.", "Exercice de maison • page 32", 2),
      choice("Le lieu de I lorsque M décrit (DC) est :", ["La droite (OB)", "Le cercle de centre O", "La droite (AB)", "Le segment [OB] seulement"], 0, "I=s(M) et l’image de (DC) est la droite passant par s(D)=O et s(C)=B.", "Exercice de maison • page 32", 3),
      choice("Dans la mission des chevrons, l’homothétie choisie a pour rapport :", ["$1/2$", "2", "-1", "$\sqrt2$"], 0, "Le cours ramène l’intersection à portée par une réduction de moitié.", "Situation complexe • pages 32-33"),
      choice("Pour construire $h(D)$, on trace :", ["La parallèle à (D) passant par h(B)", "La perpendiculaire à (D)", "Le cercle de centre A", "La droite (AB)"], 0, "L’image d’une droite ne passant pas par le centre est une parallèle.", "Situation complexe • pages 32-33"),
      choice("Pourquoi la droite $AO'$ est-elle la droite cherchée ?", ["A, O′ et O sont alignés par l’homothétie", "O′=O", "Les droites sont perpendiculaires", "A est le milieu de OO′"], 0, "Le centre, un point et son image par homothétie sont alignés.", "Situation complexe • page 33", 3),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCDirectSimilaritiesPath: LearningPath = {
  id: "terminale-c-math-l16-direct-similarities",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Transformations du plan" },
  chapterNumber: 16,
  title: "Similitudes directes",
  description:
    "Rapport, angle, composition, invariants, forme canonique, écriture complexe, détermination, constructions et applications des similitudes directes.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Caractériser une similitude directe par son rapport et son angle",
    "Composer une similitude et déterminer sa réciproque",
    "Exploiter les invariants géométriques et les triangles directement semblables",
    "Reconnaître une similitude à partir de son écriture complexe",
    "Déterminer son centre, son rapport, son angle et ses images",
    "Construire un centre, une image et un lieu géométrique",
    "Mobiliser les similitudes dans une preuve, une suite et un problème de construction",
  ],
  modules: [
    {
      id: "terminale-c-math-l16-direct-similarities-mastery",
      title: "Maîtriser les similitudes directes",
      description:
        "Neuf niveaux progressifs, " +
        builtLevels.reduce((sum, lesson) => sum + (lesson.questions?.length ?? 0), 0) +
        " réponses évaluables, des schémas interactifs et les corrections explicites des coquilles du document.",
      lessons: builtLevels,
    },
  ],
};
