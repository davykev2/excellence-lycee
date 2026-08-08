import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 14 isometrie du plan.pdf";

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

function progressionWeight(index: number) {
  return 50 + Math.min(index, 7) * 5;
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
  return {
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
      eyebrow: "Niveau " + (index + 1) + " • Cours officiel",
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Reconstruis la transformation",
      instruction: "Sélectionne chaque étape pour revoir la stratégie avant les exercices.",
      observation: "Une composition se lit de droite à gauche : la transformation la plus à droite agit la première.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: "Réussir : " + seed.title.toLocaleLowerCase("fr"),
      introduction: "Commence par la nature des transformations, respecte l’ordre de composition, puis détermine les éléments caractéristiques.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : pair de symétries = déplacement ; impair de symétries = antidéplacement.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const invariantsInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Laboratoire des invariants",
  title: "Même forme, autre position",
  instruction: "Sélectionne une propriété pour voir ce que l’isométrie transporte.",
  observation: "Conserver toutes les distances suffit à préserver les figures usuelles, les angles et les relations d’incidence.",
  caption: "Triangle ABC et son image A'B'C' par une isométrie.",
  viewBox: "0 0 390 235",
  shapes: [
    { shape: "path", d: "M35 185 L125 185 L78 72 Z", tone: "soft" },
    { shape: "path", d: "M238 170 L343 143 L275 55 Z", tone: "accent" },
    { shape: "circle", cx: 35, cy: 185, r: 5, tone: "fill" },
    { shape: "circle", cx: 125, cy: 185, r: 5, tone: "fill" },
    { shape: "circle", cx: 78, cy: 72, r: 5, tone: "fill" },
    { shape: "circle", cx: 238, cy: 170, r: 5, tone: "fill" },
    { shape: "circle", cx: 343, cy: 143, r: 5, tone: "fill" },
    { shape: "circle", cx: 275, cy: 55, r: 5, tone: "fill" },
    { shape: "path", d: "M145 120 C175 95 195 95 220 105", tone: "muted" },
    { shape: "text", x: 25, y: 207, content: "A", anchor: "middle" },
    { shape: "text", x: 134, y: 207, content: "B", anchor: "middle" },
    { shape: "text", x: 78, y: 55, content: "C", anchor: "middle" },
    { shape: "text", x: 226, y: 192, content: "A'", anchor: "middle" },
    { shape: "text", x: 354, y: 148, content: "B'", anchor: "middle" },
    { shape: "text", x: 275, y: 38, content: "C'", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "distance",
      number: 1,
      label: "Distances",
      detail: "$A'B'=AB$, $B'C'=BC$ et $C'A'=CA$ : le triangle image est superposable au triangle initial.",
      x: 292,
      y: 156,
      highlight: [{ shape: "path", d: "M238 170 L343 143", tone: "accent" }],
    },
    {
      id: "angles",
      number: 2,
      label: "Angles",
      detail: "Les angles géométriques sont conservés. Un angle droit reste donc droit.",
      x: 275,
      y: 88,
      highlight: [{ shape: "path", d: "M238 170 L275 55 L343 143", tone: "accent" }],
    },
    {
      id: "barycenter",
      number: 3,
      label: "Barycentres",
      detail: "Le milieu, le centre de gravité et tout barycentre sont envoyés sur les barycentres des points images avec les mêmes coefficients.",
      x: 292,
      y: 112,
      highlight: [{ shape: "circle", cx: 292, cy: 123, r: 8, tone: "accent" }],
    },
  ],
};

const reflectionCompositionInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Atelier de composition",
  title: "Deux axes décident de tout",
  instruction: "Sélectionne le cas parallèle ou le cas sécant.",
  observation: "L’ordre des deux symétries détermine le sens du vecteur de translation ou le signe de l’angle de rotation.",
  caption: "Les deux configurations fondamentales du cours officiel.",
  viewBox: "0 0 410 230",
  shapes: [
    { shape: "line", x1: 25, y1: 70, x2: 175, y2: 70, tone: "muted" },
    { shape: "line", x1: 25, y1: 150, x2: 175, y2: 150, tone: "accent" },
    { shape: "path", d: "M100 70 L100 150", tone: "soft" },
    { shape: "path", d: "M94 140 L100 150 L106 140 Z", tone: "soft" },
    { shape: "text", x: 35, y: 58, content: "D1", anchor: "start" },
    { shape: "text", x: 35, y: 172, content: "D2", anchor: "start" },
    { shape: "line", x1: 230, y1: 185, x2: 365, y2: 55, tone: "muted" },
    { shape: "line", x1: 230, y1: 55, x2: 365, y2: 185, tone: "accent" },
    { shape: "circle", cx: 298, cy: 120, r: 5, tone: "fill" },
    { shape: "path", d: "M325 145 A38 38 0 0 0 326 94", tone: "soft" },
    { shape: "text", x: 298, y: 140, content: "O", anchor: "middle" },
    { shape: "text", x: 344, y: 118, content: "2a", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "parallel",
      number: 1,
      label: "Axes parallèles",
      detail: "$s_{D_2}\\circ s_{D_1}$ est la translation dont le vecteur est deux fois le vecteur qui va de $D_1$ vers $D_2$ perpendiculairement aux axes.",
      x: 100,
      y: 110,
      highlight: [{ shape: "path", d: "M100 70 L100 150", tone: "accent" }],
    },
    {
      id: "intersecting",
      number: 2,
      label: "Axes sécants",
      detail: "$s_{D_2}\\circ s_{D_1}$ est la rotation de centre O et d’angle deux fois l’angle orienté de $D_1$ vers $D_2$.",
      x: 298,
      y: 120,
      highlight: [{ shape: "path", d: "M325 145 A38 38 0 0 0 326 94", tone: "accent" }],
    },
    {
      id: "identity",
      number: 3,
      label: "Même axe",
      detail: "$s_D\\circ s_D=\\operatorname{Id}_{\\mathcal P}$. Chaque point revient à sa position initiale.",
      x: 175,
      y: 204,
      highlight: [{ shape: "line", x1: 145, y1: 204, x2: 205, y2: 204, tone: "accent" }],
    },
  ],
};

const glideReflectionInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Construction guidée",
  title: "Décomposer le glissement",
  instruction: "Sélectionne la composante normale, la composante parallèle ou l’axe final.",
  observation: "La composante normale déplace l’axe de réflexion ; la composante parallèle devient le vecteur de glissement.",
  caption: "Décomposition du vecteur u en n + tau par rapport à l’axe initial.",
  viewBox: "0 0 390 240",
  shapes: [
    { shape: "line", x1: 30, y1: 165, x2: 350, y2: 85, tone: "muted" },
    { shape: "line", x1: 48, y1: 205, x2: 368, y2: 125, tone: "accent" },
    { shape: "path", d: "M120 170 L235 112", tone: "soft" },
    { shape: "path", d: "M225 110 L235 112 L229 121 Z", tone: "soft" },
    { shape: "path", d: "M120 170 L155 215", tone: "outline" },
    { shape: "path", d: "M155 215 L235 175", tone: "outline" },
    { shape: "text", x: 44, y: 151, content: "Delta", anchor: "start" },
    { shape: "text", x: 58, y: 225, content: "D", anchor: "start" },
    { shape: "text", x: 178, y: 134, content: "u", anchor: "middle" },
    { shape: "text", x: 137, y: 198, content: "n", anchor: "middle" },
    { shape: "text", x: 202, y: 205, content: "tau", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "normal",
      number: 1,
      label: "Composante normale",
      detail: "La composante $\\vec n$ produit une nouvelle symétrie d’axe $D=t_{\\vec n/2}(\\Delta)$.",
      x: 137,
      y: 198,
      highlight: [{ shape: "path", d: "M120 170 L155 215", tone: "accent" }],
    },
    {
      id: "parallel",
      number: 2,
      label: "Composante parallèle",
      detail: "La composante $\\vec\\tau$, parallèle au nouvel axe, est le vecteur de la symétrie glissée.",
      x: 202,
      y: 205,
      highlight: [{ shape: "path", d: "M155 215 L235 175", tone: "accent" }],
    },
    {
      id: "axis",
      number: 3,
      label: "Axe final",
      detail: "Si $\\vec n=\\vec0$, l’axe ne bouge pas. Si $\\vec\\tau=\\vec0$, la composée se réduit à une symétrie orthogonale.",
      x: 250,
      y: 160,
      highlight: [{ shape: "line", x1: 48, y1: 205, x2: 368, y2: 125, tone: "accent" }],
    },
  ],
};

const compositionLabels = {
  Id: "$\\operatorname{Id}_{\\mathcal P}$",
  r: "$r$",
  r2: "$r^2$",
  sAI: "$s_{(AI)}$",
  sBJ: "$s_{(BJ)}$",
  sCK: "$s_{(CK)}$",
} as const;

type CompositionName = keyof typeof compositionLabels;

const compositionOrder = Object.keys(compositionLabels) as CompositionName[];
const compositionTable: Record<CompositionName, CompositionName[]> = {
  Id: ["Id", "r", "r2", "sAI", "sBJ", "sCK"],
  r: ["r", "r2", "Id", "sCK", "sAI", "sBJ"],
  r2: ["r2", "Id", "r", "sBJ", "sCK", "sAI"],
  sAI: ["sAI", "sBJ", "sCK", "Id", "r", "r2"],
  sBJ: ["sBJ", "sCK", "sAI", "r2", "Id", "r"],
  sCK: ["sCK", "sAI", "sBJ", "r", "r2", "Id"],
};

const compositionTableQuestions = compositionOrder.flatMap((left) =>
  compositionOrder.map((right, columnIndex) => {
    const result = compositionTable[left][columnIndex];
    return choice(
      "Dans le tableau de l’exercice 2, complète " + compositionLabels[left] + " $\\circ$ " + compositionLabels[right] + ".",
      compositionOrder.map((name) => compositionLabels[name]),
      compositionOrder.indexOf(result),
      "On compose de droite à gauche. En suivant l’image de A, B et C, on obtient " + compositionLabels[result] + ".",
      "Exercice 2 • pages 17-18",
    );
  }),
);

const levels: OfficialLevelSeed[] = [
  {
    id: "isometry-invariants",
    title: "Reconnaître une isométrie et ses invariants",
    summary: "Comprendre qu’une isométrie conserve les distances et transporte sans déformation les figures, les angles, les produits scalaires et les barycentres.",
    pages: "1-3",
    section: "B. Contenu de la leçon • I. Définition et propriétés",
    durationMinutes: 28,
    body: String.raw`## Les transformations déjà connues

Le document rappelle quatre applications du plan.

| Transformation | Caractérisation | Effet sur une longueur |
|---|---|---|
| Translation $t_{\vec u}$ | $t_{\vec u}(M)=M'\iff\overrightarrow{MM'}=\vec u$ | $M'N'=MN$ |
| Symétrie orthogonale $s_D$ | si $M\notin D$, alors $D$ est la médiatrice de $[MM']$ | $M'N'=MN$ |
| Rotation $r_{K,\theta}$ | $KM'=KM$ et $\operatorname{Mes}(\overrightarrow{KM},\overrightarrow{KM'})=\theta$ | $M'N'=MN$ |
| Homothétie $h_{K,\lambda}$ | $\overrightarrow{KM'}=\lambda\overrightarrow{KM}$ | $M'N'=\lvert\lambda\rvert MN$ |

Les translations, les symétries orthogonales et les rotations conservent donc toutes les distances.

> **Attention.** Une homothétie n’est une isométrie que lorsque $|\lambda|=1$ : $\lambda=1$ donne l’identité et $\lambda=-1$ une symétrie centrale.

## Définition

Une **isométrie plane** est une application du plan dans lui-même qui conserve la distance :

$$
\forall M,N,\qquad f(M)f(N)=MN.
$$

Toute isométrie est une transformation du plan, c’est-à-dire une bijection du plan sur lui-même.

## Images des figures simples

Si $f(A)=A'$ et $f(B)=B'$, alors :

- la droite $(AB)$ devient la droite $(A'B')$ ;
- le segment $[AB]$ devient le segment $[A'B']$ ;
- le cercle de centre O et de rayon r devient le cercle de centre $f(O)$ et de même rayon r.

Le cercle image ne garde donc pas nécessairement le même centre, mais il garde exactement le même rayon.

## Ce qui est conservé

Une isométrie conserve :

- le produit scalaire ;
- le barycentre avec les mêmes coefficients ;
- le parallélisme et l’orthogonalité ;
- les angles géométriques ;
- le contact entre deux figures.

Ainsi, si G est le barycentre des points pondérés $(A_i,\alpha_i)$, alors

$$
f(G)=\operatorname{bar}\{(f(A_i),\alpha_i)\}.
$$

Le milieu est un cas particulier du barycentre : l’image du milieu de $[AB]$ est le milieu de $[A'B']$.

> **Astuce mémoire de Davy.** « Iso » signifie même et « métrie » mesure : une isométrie garde les mêmes mesures de longueur.`,
    keyPoint: "$f(M)f(N)=MN$ pour tous points M et N.",
    example: "Une rotation peut déplacer entièrement un triangle, mais ses trois côtés et ses trois angles gardent leurs mesures : le triangle image lui est superposable.",
    methodSteps: [
      "Vérifie que toutes les distances sont conservées, pas seulement une longueur particulière.",
      "Identifie la figure image à partir de points qui la déterminent.",
      "Transporte ensuite les propriétés : milieu, perpendicularité, parallélisme, cercle ou barycentre.",
      "Écarte une homothétie dès que la valeur absolue de son rapport est différente de 1.",
    ],
    timeline: [
      { label: "Distance", detail: "C’est la propriété qui définit une isométrie." },
      { label: "Bijection", detail: "Toute isométrie possède une transformation réciproque." },
      { label: "Figures", detail: "Droites, segments et cercles sont envoyés sur des figures du même type." },
      { label: "Invariants", detail: "Angles, produit scalaire et barycentres sont transportés." },
    ],
    interaction: invariantsInteraction,
    corrections: [
      "Couverture : le PDF imprime « Leçon 15 », tandis que le fichier officiel et le référentiel du projet classent ce contenu comme leçon 14 ; le parcours conserve le numéro 14.",
      "Page 2 : la formulation sur les homothéties est précisée. Une homothétie conserve les distances exactement pour les rapports 1 et -1 ; elle ne les conserve pas lorsque |λ| est différent de 1.",
    ],
    questions: [
      choice("Quelle propriété définit une isométrie plane ?", ["Elle conserve toutes les distances", "Elle conserve seulement les aires", "Elle fixe toujours un point", "Elle conserve seulement les angles orientés"], 0, "La conservation de la distance pour toute paire de points est la définition.", "Définition • page 2"),
      truth("Toute translation est une isométrie.", true, "Une translation conserve la distance.", "Tableau de rappel • page 1"),
      truth("Une homothétie de rapport 2 est une isométrie.", false, "Elle multiplie les longueurs par 2.", "Tableau de rappel • page 2"),
      truth("Une homothétie de rapport -1 est une isométrie.", true, "C’est une symétrie centrale : les distances sont conservées.", "Tableau corrigé • page 2"),
      choice("L’image d’un cercle de centre O et de rayon r par f est…", ["un cercle de centre f(O) et de rayon r", "un cercle de centre O et de rayon 2r", "une ellipse", "une droite"], 0, "Une isométrie conserve le type de figure et le rayon.", "Images de figures simples • page 2"),
      choice("Si G est le milieu de [AB], que vaut f(G) ?", ["Le milieu de [f(A)f(B)]", "Toujours G", "Le centre du plan", "Le symétrique de G par rapport à A"], 0, "Le milieu est le barycentre de A et B avec les coefficients 1 et 1.", "Conservation du barycentre • page 2"),
      choice("Si AB est perpendiculaire à CD, alors…", ["f(A)f(B) est perpendiculaire à f(C)f(D)", "les droites images sont parallèles", "les quatre images sont alignées", "f(A)=f(B)"], 0, "L’orthogonalité est conservée.", "Propriétés de conservation • page 2"),
      truth("Toute isométrie transforme un carré en un carré.", true, "Les quatre côtés égaux, les angles droits et le parallélisme sont conservés.", "Exercice de fixation a • page 3"),
      truth("Toute isométrie transforme un triangle équilatéral en un triangle équilatéral.", true, "Les trois longueurs égales restent égales.", "Exercice de fixation b • page 3"),
      truth("Toute isométrie transforme un angle droit en un angle plat.", false, "Les angles géométriques sont conservés : un angle droit reste droit.", "Exercice de fixation c • page 3"),
      truth("Une isométrie plane est bijective.", true, "Le cours affirme que toute isométrie est une transformation du plan.", "Propriété • page 2"),
      choice("Quelle égalité traduit la conservation du produit scalaire ?", ["$\\overrightarrow{AB}\\cdot\\overrightarrow{CD}=\\overrightarrow{A'B'}\\cdot\\overrightarrow{C'D'}$", "$AB=A'B'+1$", "$\\overrightarrow{AB}=\\overrightarrow{A'B'}$ dans tous les cas", "$A'=A$ et $B'=B$"], 0, "Les vecteurs peuvent changer de direction, mais leur produit scalaire est conservé.", "Propriétés de conservation • page 2", 2),
      choice("Pourquoi l’image d’un triangle rectangle reste-t-elle rectangle ?", ["Parce que l’orthogonalité est conservée", "Parce que tous ses points sont fixes", "Parce que son aire devient nulle", "Parce qu’une isométrie est toujours une translation"], 0, "Les deux côtés perpendiculaires ont des images encore perpendiculaires.", "Synthèse • pages 2-3"),
    ],
  },
  {
    id: "reflection-compositions",
    title: "Décomposer translations et rotations",
    summary: "Transformer une paire de symétries d’axes parallèles en translation et une paire d’axes sécants en rotation, puis effectuer la décomposition inverse.",
    pages: "3-6, 18-19",
    section: "II. Décomposition d’une translation et d’une rotation • Exercices 6 et 7",
    durationMinutes: 38,
    body: String.raw`## Deux symétries d’axes parallèles

Soient $D_1$ et $D_2$ deux droites parallèles. Si H appartient à $D_1$ et K est son projeté orthogonal sur $D_2$, alors

$$
s_{D_2}\circ s_{D_1}=t_{2\overrightarrow{HK}}.
$$

En inversant l’ordre, le vecteur change de sens :

$$
s_{D_1}\circ s_{D_2}=t_{2\overrightarrow{KH}}.
$$

Ces deux composées sont donc généralement différentes.

Si les deux axes sont confondus,

$$
s_D\circ s_D=\operatorname{Id}_{\mathcal P}.
$$

## Décomposer une translation

On donne une translation $t_{\vec u}$ avec $\vec u\ne\vec0$ et une droite $\Delta$ normale à $\vec u$.

Pour écrire

$$
t_{\vec u}=s_D\circ s_\Delta,
$$

on translate l’axe de départ d’un **demi-vecteur** :

$$
D=t_{\frac12\vec u}(\Delta).
$$

Pour écrire la symétrie donnée à gauche,

$$
t_{\vec u}=s_\Delta\circ s_{D'},
\qquad
D'=t_{-\frac12\vec u}(\Delta).
$$

> **Astuce mémoire de Davy.** L’axe de droite agit en premier. Pour aller dans le sens de $\vec u$, le second axe rencontré se trouve un demi-vecteur plus loin.

## Deux symétries d’axes sécants

Dans un plan orienté, si $D_1$ et $D_2$ se coupent en O et si

$$
\alpha=\operatorname{Mes}(\vec u_1,\vec u_2)
$$

pour des vecteurs directeurs des deux axes, alors

$$
s_{D_2}\circ s_{D_1}=r_{O,2\alpha}.
$$

Lorsque les axes sont perpendiculaires, l’angle vaut $\pi$ : la composée est la symétrie centrale de centre O.

## Décomposer une rotation

Pour une rotation $r_{O,\theta}$ et une droite $D_1$ passant par O,

$$
r_{O,\theta}=s_{D_2}\circ s_{D_1},
\qquad
D_2=r_{O,\theta/2}(D_1).
$$

Si c’est le second axe $D_2$ qui est donné, alors

$$
D_1=r_{O,-\theta/2}(D_2).
$$

Le **demi-angle** joue donc pour les rotations le même rôle que le **demi-vecteur** pour les translations.`,
    keyPoint: "$s_{D_2}\\circ s_{D_1}$ : axes parallèles → translation ; axes sécants → rotation.",
    example: "Dans un triangle équilatéral direct, l’angle de (AB) vers (AI) vaut π/6 ; ainsi $s_{(AI)}\\circ s_{(AB)}=r_{A,\\pi/3}$.",
    methodSteps: [
      "Lis la composée de droite à gauche et nomme le premier axe puis le second.",
      "Détermine si les axes sont parallèles, confondus ou sécants.",
      "Axes parallèles : utilise deux fois le vecteur perpendiculaire du premier axe vers le second.",
      "Axes sécants : double l’angle orienté du premier axe vers le second.",
      "Pour la décomposition inverse, place l’axe inconnu avec le demi-vecteur ou le demi-angle.",
    ],
    timeline: [
      { label: "Parallèles", detail: "Deux réflexions donnent une translation." },
      { label: "Sécants", detail: "Deux réflexions donnent une rotation." },
      { label: "Demi-vecteur", detail: "Il place le second axe d’une translation." },
      { label: "Demi-angle", detail: "Il place le second axe d’une rotation." },
    ],
    interaction: reflectionCompositionInteraction,
    questions: [
      choice("Dans le rectangle ABCD de la page 3, que vaut $s_{(IJ)}\\circ s_{(AD)}$ ?", ["$t_{\\overrightarrow{AB}}$", "$t_{\\overrightarrow{BA}}$", "$s_{(IK)}$", "$\\operatorname{Id}_{\\mathcal P}$"], 0, "Les axes (AD) puis (IJ) sont parallèles et séparés d’un demi-vecteur AB.", "Exercice de fixation • page 3"),
      choice("Que vaut $s_{(IK)}\\circ s_{(IK)}$ ?", ["$\\operatorname{Id}_{\\mathcal P}$", "$t_{\\overrightarrow{IK}}$", "$s_I$", "$r_{I,\\pi/2}$"], 0, "Une symétrie orthogonale est sa propre réciproque.", "Exercice de fixation • page 3"),
      truth("$t_{\\overrightarrow{AB}}=s_{(AD)}\\circ s_{(IJ)}$.", false, "Cet ordre produit le vecteur opposé.", "Exercice de fixation 1 • page 4"),
      truth("$t_{\\overrightarrow{AB}}=s_{(BC)}\\circ s_{(IJ)}$.", true, "L’axe (BC) se trouve un demi-vecteur AB après (IJ).", "Exercice de fixation 2 • page 4"),
      truth("$t_{\\overrightarrow{AB}}=s_{(IJ)}\\circ s_{(AD)}$.", true, "C’est la décomposition établie à la page 3.", "Exercice de fixation 3 • page 4"),
      truth("$t_{\\overrightarrow{AD}}=s_{(AB)}\\circ s_{(KL)}$.", false, "Cet ordre donne le vecteur DA.", "Exercice de fixation 4 • page 4"),
      truth("$t_{\\overrightarrow{AD}}=s_{(CD)}\\circ s_{(KL)}$.", true, "Le second axe est un demi-vecteur AD au-dessus du premier.", "Exercice de fixation 5 • page 4"),
      truth("$t_{\\overrightarrow{AD}}=s_{(KL)}\\circ s_{(AB)}$.", true, "L’ordre va de (AB) vers (KL), donc dans le sens de AD.", "Exercice de fixation 6 • page 4"),
      choice("Dans le triangle équilatéral direct, que vaut $s_{(AI)}\\circ s_{(AB)}$ ?", ["$r_{A,\\pi/3}$", "$r_{A,-\\pi/3}$", "$s_A$", "$t_{\\overrightarrow{AI}}$"], 0, "L’angle de (AB) vers (AI) vaut π/6 ; la rotation a pour angle π/3.", "Exercice de fixation 1 • page 5"),
      choice("Que vaut $s_{(AI)}\\circ s_{(CK)}$ ?", ["$r_{G,-2\\pi/3}$", "$r_{G,2\\pi/3}$", "$s_G$", "$t_{\\overrightarrow{CK}}$"], 0, "Les axes se coupent en G et le double de l’angle orienté vaut -2π/3.", "Exercice de fixation 2 • page 5"),
      choice("Que vaut $s_{(CB)}\\circ s_{(AI)}$ ?", ["La symétrie centrale $s_I$", "La symétrie $s_{(CB)}$", "La rotation $r_{G,2\\pi/3}$", "Une translation"], 0, "Les axes (AI) et (CB) sont perpendiculaires en I.", "Exercice de fixation 3 • page 5"),
      choice("Dans $r_{G,-2\\pi/3}=s_\\Delta\\circ s_{(AI)}$, quelle est la droite Δ ?", ["$(JB)$", "$(AB)$", "$(BC)$", "$(CK)$"], 0, "(JB) est l’image de (AI) par la rotation de centre G et d’angle -π/3.", "Exercice de fixation 1 • page 6"),
      choice("Dans $r_{B,\\pi/3}=s_{(BG)}\\circ s_\\Delta$, quelle est la droite Δ ?", ["$(BC)$", "$(AB)$", "$(AI)$", "$(JK)$"], 0, "L’axe placé en premier doit être tourné de -π/6 par rapport à (BG) ; on obtient (BC).", "Exercice de fixation 2 • page 6"),
      choice("Dans $s_K=s_\\Delta\\circ s_{(CG)}$, quelle est la droite Δ ?", ["$(AB)$", "$(BC)$", "$(AC)$", "$(IJ)$"], 0, "Une symétrie centrale est une rotation d’angle π ; les deux axes sont perpendiculaires en K.", "Exercice de fixation 3 • page 6"),
      choice("Exercice 6. Dans $t_{\\overrightarrow{CK}}=s_\\Delta\\circ s_{(IJ)}$, quelle est Δ ?", ["$(AB)$", "$(AC)$", "$(BC)$", "$(AI)$"], 0, "(AB) est l’image de (IJ) par la translation de demi-vecteur CK.", "Exercice 6.1 • pages 18-19"),
      choice("Exercice 6. Dans $t_{\\overrightarrow{JB}}=s_{(IK)}\\circ s_\\Delta$, quelle est Δ ?", ["$(AC)$", "$(AB)$", "$(BC)$", "$(CK)$"], 0, "En reculant (IK) du demi-vecteur JB, on obtient la droite (AC).", "Exercice 6.2 • page 19"),
      choice("Exercice 6. Dans $t_{\\overrightarrow{IA}}=s_\\Delta\\circ s_{(BC)}$, quelle est Δ ?", ["$(KJ)$", "$(AI)$", "$(AB)$", "$(IJ)$"], 0, "La translation de (BC) par le demi-vecteur IA donne la parallèle (KJ).", "Exercice 6.3 • page 19"),
      choice("Exercice 6. Dans $t_{\\overrightarrow{AB}}=s_{(CK)}\\circ s_\\Delta$, quelle est Δ ?", ["La droite passant par A et parallèle à (CK)", "$(AI)$", "$(BC)$", "$(IJ)$"], 0, "On recule (CK) du demi-vecteur AB : on obtient la perpendiculaire à (AB) passant par A.", "Exercice 6.4 • page 19", 2),
      choice("Exercice 7. Dans $r_{G,2\\pi/3}=s_{(CK)}\\circ s_\\Delta$, quelle est Δ ?", ["$(AI)$", "$(BJ)$", "$(AB)$", "$(IJ)$"], 0, "Il faut tourner (CK) de -π/3 autour de G ; on obtient (AI).", "Exercice 7.1 • page 19"),
      choice("Exercice 7. Dans $r_{A,-\\pi/3}=s_\\Delta\\circ s_{(AI)}$, quelle est Δ ?", ["$(AB)$", "$(AC)$", "$(BJ)$", "$(CK)$"], 0, "L’image de (AI) par la rotation de centre A et d’angle -π/6 est (AB).", "Exercice 7.2 • page 19"),
      choice("Exercice 7. Dans $r_{G,-2\\pi/3}=s_{(BJ)}\\circ s_\\Delta$, quelle est Δ ?", ["$(AI)$", "$(CK)$", "$(BC)$", "$(AB)$"], 0, "On vérifie $s_{(BJ)}\\circ s_{(AI)}=r_{G,-2\\pi/3}$.", "Exercice 7.3 • page 19"),
    ],
  },
  {
    id: "reflection-translation-rotation",
    title: "Composer translations et rotations",
    summary: "Reconnaître la nature d’une composée contenant une translation ou plusieurs rotations, puis retrouver son centre et son angle.",
    pages: "6-7, 18-19, 22",
    section: "III-1. Composée d’une translation et d’une rotation • Exercices 5 et 9",
    durationMinutes: 34,
    body: String.raw`## Translation suivie ou précédée d’une rotation

Soit r une rotation d’angle $\alpha$ et t une translation.

- si $\alpha\equiv0\ [2\pi]$, r est l’identité et la composée se réduit à t ;
- si $\alpha\not\equiv0\ [2\pi]$, alors $t\circ r$ et $r\circ t$ sont des rotations d’angle $\alpha$.

L’angle est facile à trouver ; le centre demande davantage de travail.

> **Attention à l’ordre.** En général, $t\circ r\ne r\circ t$. Les deux rotations obtenues ont le même angle, mais pas forcément le même centre.

## Trouver le centre de la rotation composée

Trois méthodes sont utiles :

1. décomposer r et t en symétries orthogonales et simplifier deux symétries identiques consécutives ;
2. calculer les images de deux points puis intersecter les médiatrices des segments formés avec leurs images ;
3. si un point M et son image M' sont connus avec l’angle $\alpha$, construire le point O tel que

$$
OM=OM'
\quad\text{et}\quad
\operatorname{Mes}(\overrightarrow{OM},\overrightarrow{OM'})=\alpha.
$$

## Rappel : composer deux rotations

Si $r_1$ et $r_2$ ont pour angles $\alpha_1$ et $\alpha_2$ :

- si $\alpha_1+\alpha_2\equiv0\ [2\pi]$, leur composée est une translation, éventuellement l’identité ;
- sinon, leur composée est une rotation d’angle $\alpha_1+\alpha_2$ modulo $2\pi$.

Cette règle permet de traiter les exercices officiels qui mêlent plusieurs rotations.

## Exemple du carré

Dans le carré ABCD direct de centre O, le document étudie

$$
f=t_{\overrightarrow{CB}}\circ r_{D,\pi/2}.
$$

On écrit

$$
r_{D,\pi/2}=s_{(DC)}\circ s_{(DO)}
\quad\text{et}\quad
t_{\overrightarrow{CB}}=s_\Delta\circ s_{(DC)}.
$$

Les deux symétries d’axe (DC) s’annulent :

$$
f=s_\Delta\circ s_{(DO)}=r_{O,\pi/2}.
$$

Le calcul ne donne pas seulement la nature : il fournit directement le centre O.`,
    keyPoint: "$\\alpha\\ne0\\ [2\\pi]\\Longrightarrow t\\circ r$ et $r\\circ t$ sont des rotations d’angle $\\alpha$.",
    example: "Dans l’exemple officiel, les décompositions font apparaître deux symétries identiques consécutives ; elles donnent l’identité et la composée restante est $r_{O,\\pi/2}$.",
    methodSteps: [
      "Additionne d’abord les angles des rotations et ignore les translations pour déterminer l’angle final.",
      "Si l’angle final est nul, cherche une translation ou l’identité ; sinon, cherche une rotation.",
      "Décompose avec un axe commun afin de faire apparaître $s_D\\circ s_D$.",
      "Pour confirmer le centre, calcule l’image d’un ou deux points simples.",
    ],
    timeline: [
      { label: "Angle", detail: "Une translation n’ajoute aucun angle." },
      { label: "Nature", detail: "Angle non nul : rotation ; angle nul : translation possible." },
      { label: "Simplification", detail: "Deux symétries identiques consécutives donnent l’identité." },
      { label: "Centre", detail: "Intersection des médiatrices ou des axes restants." },
    ],
    questions: [
      choice("Si r a un angle non nul α, quelle est la nature de $t\\circ r$ ?", ["Une rotation d’angle α", "Une translation", "Une symétrie orthogonale", "Toujours l’identité"], 0, "Une translation ne modifie pas l’angle de la rotation composée.", "Propriété • page 6"),
      truth("En général, $r\\circ t=t\\circ r$.", false, "Les centres des deux rotations composées peuvent être différents.", "Remarques • page 6"),
      choice("Dans l’exemple du carré, quelle est la nature de $t_{\\overrightarrow{CB}}\\circ r_{D,\\pi/2}$ ?", ["Une rotation d’angle π/2", "Une translation", "Une symétrie glissée", "Une rotation d’angle π"], 0, "L’angle de la rotation initiale est conservé.", "Exercice de fixation • page 7"),
      choice("Quel est son centre dans la correction officielle ?", ["O", "D", "B", "Le milieu de [CB]"], 0, "La simplification donne $s_\\Delta\\circ s_{(OD)}=r_{O,\\pi/2}$.", "Exercice de fixation corrigé • page 7"),
      choice("Exercice 5.1. Que vaut $s_{(DC)}\\circ s_{(AB)}$ dans le carré direct ?", ["$t_{2\\overrightarrow{AD}}$", "$t_{\\overrightarrow{AD}}$", "$r_{O,\\pi}$", "$s_{(AC)}$"], 0, "Les axes parallèles (AB) puis (DC) sont séparés par le vecteur AD ; la translation vaut deux fois ce vecteur.", "Exercice 5.1 • page 18"),
      choice("Exercice 5.2. Que vaut $s_{(AC)}\\circ r_{A,\\pi/2}$ ?", ["$s_{(AB)}$", "$s_{(AD)}$", "$r_{A,\\pi}$", "$t_{\\overrightarrow{AB}}$"], 0, "On décompose $r_{A,\\pi/2}=s_{(AC)}\\circ s_{(AB)}$, puis $s_{(AC)}\\circ s_{(AC)}$ s’annule.", "Exercice 5.2 • page 18", 2),
      choice("Exercice 5.3. Que vaut $s_{(DC)}\\circ s_{(AC)}$ ?", ["$r_{C,-\\pi/2}$", "$r_{C,\\pi/2}$", "$s_C$", "$t_{\\overrightarrow{DC}}$"], 0, "Les axes se coupent en C ; l’angle orienté de (AC) vers (DC), doublé, vaut -π/2.", "Exercice 5.3 • page 18"),
      choice("Exercice 5.4. Que vaut $r_{C,-\\pi/2}\\circ r_{A,\\pi/2}$ ?", ["$t_{2\\overrightarrow{AD}}$", "$r_{O,\\pi}$", "$t_{\\overrightarrow{AB}}$", "$\\operatorname{Id}_{\\mathcal P}$"], 0, "La somme des angles est nulle et l’image de A est le point A+2AD.", "Exercice 5.4 • page 18", 2),
      choice("Exercice 5.5. Que vaut $t_{2\\overrightarrow{AD}}\\circ r_{A,-\\pi/2}$ ?", ["$r_{C,-\\pi/2}$", "$r_{D,-\\pi/2}$", "$t_{2\\overrightarrow{AD}}$", "$s_{(DC)}$"], 0, "La composée est une rotation d’angle -π/2 et C est fixe.", "Exercice 5.5 • page 18", 2),
      choice("Exercice 5.6. Que vaut $t_{\\overrightarrow{DC}}\\circ t_{\\overrightarrow{DA}}$ ?", ["$t_{\\overrightarrow{DB}}$", "$t_{\\overrightarrow{AC}}$", "$t_{\\overrightarrow{CD}}$", "$\\operatorname{Id}_{\\mathcal P}$"], 0, "Les vecteurs s’additionnent : DC+DA=DB.", "Exercice 5.6 • page 18"),
      choice("Exercice 5.7. Que vaut $r_{C,\\pi/2}\\circ s_D\\circ r_{A,\\pi/2}$ ?", ["$\\operatorname{Id}_{\\mathcal P}$", "$s_O$", "$r_{O,\\pi/2}$", "$t_{\\overrightarrow{AC}}$"], 0, "La symétrie centrale s_D est une rotation d’angle π ; l’angle total vaut 2π et le calcul des images donne l’identité.", "Exercice 5.7 • page 18", 3),
      choice("Exercice 9.1. Quelle est la nature de $r_{D,\\pi/2}\\circ t_{\\overrightarrow{CB}}$ ?", ["Une rotation d’angle π/2", "Une translation", "Une symétrie glissée", "Une symétrie centrale"], 0, "Une rotation d’angle non nul composée avec une translation reste une rotation de même angle.", "Exercice 9.1 • pages 19 et 22"),
      choice("Quel centre la correction officielle associe-t-elle à cette rotation ?", ["O', point construit sur la figure", "D", "A", "Le milieu de [AB]"], 0, "La correction écrit la composée sous la forme $r_{O',\\pi/2}$.", "Correction de l’exercice 9.1 • page 22"),
      choice("Exercice 9.2. Que vaut $r_{B,\\pi/2}\\circ t_{\\overrightarrow{DC}}$ ?", ["$r_{O,\\pi/2}$", "$r_{B,\\pi/2}$", "$t_{\\overrightarrow{DC}}$", "$s_{(BO)}$"], 0, "La décomposition de la correction laisse deux axes sécants en O.", "Correction de l’exercice 9.2 • page 22", 2),
      choice("Exercice 9.3. Quelle transformation obtient-on après simplification ?", ["$r_{O,\\pi/2}$", "$r_{C,\\pi/2}$", "$t_{\\overrightarrow{CD}}$", "$s_O$"], 0, "La correction réduit h à $s_{(OO')}\\circ s_{(AC)}=r_{O,\\pi/2}$.", "Correction de l’exercice 9.3 • page 22", 2),
      choice("Pour trouver le centre d’une rotation quand A→A' et B→B', que construit-on ?", ["Les médiatrices de [AA'] et [BB']", "Les parallèles à (AB)", "Le cercle de diamètre [AB] seulement", "Les hauteurs du triangle ABA'"], 0, "Le centre est équidistant d’un point et de son image.", "Point méthode • complément SPM", 2),
    ],
  },
  {
    id: "direct-isometries",
    title: "Déplacements et table des compositions",
    summary: "Classer les isométries qui conservent les angles orientés et maîtriser la règle de composition des déplacements et antidéplacements.",
    pages: "13-14, 17-18",
    section: "IV-2. Déplacement et antidéplacement • Exercices 1 et 2",
    durationMinutes: 48,
    body: String.raw`## Déplacement ou antidéplacement ?

Un **déplacement** est une isométrie qui conserve les angles orientés :

$$
\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{CD})
=
\operatorname{Mes}(\overrightarrow{A'B'},\overrightarrow{C'D'})
\ [2\pi].
$$

Les déplacements du plan sont :

- l’identité ;
- les translations ;
- les rotations.

Un **antidéplacement** transforme chaque angle orienté en son opposé. Les antidéplacements sont les symétries orthogonales et les symétries glissées.

## Transformations réciproques

- la réciproque d’un déplacement est un déplacement ;
- la réciproque d’un antidéplacement est un antidéplacement.

Par exemple, l’inverse d’une rotation est une rotation d’angle opposé, et l’inverse d’une symétrie glissée est encore une symétrie glissée.

## Règle de composition

La règle se lit comme une règle de signes :

| Première famille | Deuxième famille | Famille de la composée |
|---|---|---|
| déplacement | déplacement | déplacement |
| antidéplacement | antidéplacement | déplacement |
| déplacement | antidéplacement | antidéplacement |
| antidéplacement | déplacement | antidéplacement |

On peut mémoriser :

$$
(+)\times(+)=+,\qquad(-)\times(-)=+,\qquad(+)\times(-)=-.
$$

Ici, le signe + représente un déplacement et le signe - un antidéplacement.

## La table du triangle équilatéral

Dans le triangle équilatéral ABC de centre G :

- $r=r_{G,2\pi/3}$ et $r^2=r_{G,4\pi/3}$ ;
- $s_{(AI)}$, $s_{(BJ)}$ et $s_{(CK)}$ sont les trois symétries axiales du triangle.

Ces six transformations forment un ensemble fermé pour la composition. Pour remplir une case, suis successivement l’image des sommets A, B et C.

> **Astuce mémoire de Davy.** Les rotations sont des déplacements (+) et les symétries axiales des antidéplacements (-). La famille du résultat se connaît avant même de calculer son nom.`,
    keyPoint: "deux transformations de même famille → déplacement ; de familles différentes → antidéplacement.",
    example: "$s_{(AI)}\\circ s_{(CK)}$ est la composée de deux antidéplacements : c’est un déplacement, précisément la rotation $r^2$ ou r selon l’ordre.",
    methodSteps: [
      "Classe chaque facteur : déplacement (+) ou antidéplacement (-).",
      "Utilise la règle des signes pour connaître la famille de la composée.",
      "Pour préciser la transformation, suis les images de deux ou trois points remarquables.",
      "Dans une table, n’oublie jamais que la colonne agit avant la ligne dans l’écriture ligne ∘ colonne.",
    ],
    timeline: [
      { label: "Déplacements", detail: "Identité, translations et rotations." },
      { label: "Antidéplacements", detail: "Symétries orthogonales et glissées." },
      { label: "Parité", detail: "Un nombre pair de réflexions conserve l’orientation." },
      { label: "Table", detail: "Les images de A, B et C déterminent la case." },
    ],
    corrections: [
      "Pages 13-14 : les affirmations 1 et 4 de l’exercice vrai/faux sont identiques dans le PDF. Elles sont conservées comme deux items officiels et ont toutes deux la réponse Faux.",
    ],
    questions: [
      truth("La transformation réciproque d’un antidéplacement est un déplacement.", false, "La réciproque d’un antidéplacement reste un antidéplacement.", "Exercice de fixation 1 • pages 13-14"),
      truth("Tout antidéplacement est une symétrie orthogonale ou une symétrie glissée.", true, "C’est la classification complète des antidéplacements du plan.", "Exercice de fixation 2 • page 14"),
      truth("Tout déplacement est une translation ou une rotation.", true, "L’identité est incluse comme translation de vecteur nul ou rotation d’angle nul.", "Exercice de fixation 3 • page 14"),
      truth("La transformation réciproque d’un antidéplacement est un déplacement.", false, "Cet item répète l’affirmation 1 du document ; la réponse reste Faux.", "Exercice de fixation 4 dupliqué • page 14"),
      truth("Toute isométrie est à la fois un déplacement et un antidéplacement.", false, "Hors cas dégénérés, les deux familles sont distinctes ; toute isométrie appartient à l’une d’elles.", "Exercice de fixation 5 • page 14"),
      choice("Classe $r^2$.", ["Déplacement", "Antidéplacement"], 0, "Une puissance d’une rotation reste une rotation.", "Tableau de fixation • page 14"),
      choice("Classe $s_{(AI)}\\circ r$.", ["Déplacement", "Antidéplacement"], 1, "Antidéplacement composé avec déplacement : antidéplacement.", "Tableau de fixation • page 14"),
      choice("Classe $s_{(BJ)}\\circ s_I$, où $s_I$ est une symétrie centrale.", ["Déplacement", "Antidéplacement"], 1, "La symétrie centrale est une rotation, donc un déplacement ; axial ∘ central est un antidéplacement.", "Tableau de fixation • page 14"),
      choice("Classe $s_{(BJ)}\\circ\\operatorname{Id}_{\\mathcal P}$.", ["Déplacement", "Antidéplacement"], 1, "La composée reste la symétrie orthogonale $s_{(BJ)}$.", "Tableau de fixation • page 14"),
      choice("Classe $s_{(BJ)}\\circ t_{\\overrightarrow{AC}}$.", ["Déplacement", "Antidéplacement"], 1, "Symétrie axiale ∘ translation : antidéplacement.", "Tableau de fixation • page 14"),
      choice("Classe $s_{(AI)}\\circ s_{(CK)}$.", ["Déplacement", "Antidéplacement"], 0, "Deux antidéplacements composés donnent un déplacement.", "Tableau de fixation • page 14"),
      choice("Classe $t_{\\overrightarrow{AC}}\\circ t_{\\overrightarrow{GI}}$.", ["Déplacement", "Antidéplacement"], 0, "La composée de deux translations est une translation.", "Tableau de fixation • pages 14-15"),
      choice("Exercice 1. Que vaut $t_{\\vec u}\\circ t_{\\vec v}$ ?", ["$t_{\\vec u+\\vec v}$", "$t_{\\vec u-\\vec v}$", "$t_{\\vec u\\cdot\\vec v}$", "$s_{(\\vec u,\\vec v)}$"], 0, "Les vecteurs de deux translations s’additionnent.", "Exercice 1.1 • page 17"),
      choice("Exercice 1. Deux symétries d’axes parallèles composées donnent…", ["une translation", "une rotation", "une symétrie orthogonale", "une homothétie"], 0, "C’est le premier cas fondamental de décomposition.", "Exercice 1.2 • page 17"),
      choice("Exercice 1. Une rotation d’angle non nul composée avec une translation donne…", ["une rotation", "une translation", "une symétrie orthogonale", "une homothétie"], 0, "L’angle non nul est conservé par la composée.", "Exercice 1.3 • page 17"),
      choice("Exercice 1. Si $\\vec u$ est normal à Δ, que vaut la nature de $s_\\Delta\\circ t_{\\vec u}$ ?", ["Une symétrie orthogonale", "Une translation", "Une symétrie glissée", "Une rotation"], 0, "La composante parallèle est nulle ; il ne reste qu’une réflexion sur un axe translaté.", "Exercice 1.4 • page 17"),
      choice("Exercice 1. Quand $s_\\Delta$ et $t_{\\vec u}$ commutent-elles ?", ["Quand $\\vec u$ dirige Δ", "Quand $\\vec u$ est normal à Δ", "Pour tout vecteur", "Jamais"], 0, "Une symétrie glissée est précisément la composition commutative avec une translation parallèle à l’axe.", "Exercice 1.5 • page 17"),
      choice("Exercice 1. Si O n’appartient pas à Δ, quelle est la nature de $s_\\Delta\\circ r_O$ ?", ["Une symétrie glissée", "Une rotation", "Une translation", "Une symétrie centrale"], 0, "Rotation et symétrie d’axe ne contenant pas le centre donnent une symétrie glissée.", "Exercice 1.6 • page 17"),
      ...compositionTableQuestions,
    ],
  },
  {
    id: "opposite-isometries",
    title: "Composer une symétrie et une rotation",
    summary: "Décider si la composée est une symétrie orthogonale ou une symétrie glissée, puis déterminer un antidéplacement à partir de deux images.",
    pages: "11-12, 15-16",
    section: "III-3. Symétrie orthogonale et rotation • V-2. Détermination d’un antidéplacement",
    durationMinutes: 32,
    body: String.raw`## Symétrie orthogonale et rotation

Soient D une droite et $r_{K,\theta}$ une rotation.

La position du centre K par rapport à l’axe D décide de la nature :

| Condition | Nature de $r_{K,\theta}\circ s_D$ et de $s_D\circ r_{K,\theta}$ |
|---|---|
| $K\in D$ | symétries orthogonales |
| $K\notin D$ | symétries glissées |

Les deux composées ont la même famille, mais ne sont généralement pas égales.

## Pourquoi le centre sur l’axe donne une symétrie

Si $K\in D$, on décompose la rotation avec l’axe D :

$$
r_{K,\theta}=s_{D_2}\circ s_D
=
s_D\circ s_{D_1},
$$

où

$$
D_2=r_{K,\theta/2}(D),
\qquad
D_1=r_{K,-\theta/2}(D).
$$

Alors

$$
r_{K,\theta}\circ s_D=s_{D_2}
\quad\text{et}\quad
s_D\circ r_{K,\theta}=s_{D_1}.
$$

## Pourquoi le centre hors de l’axe donne un glissement

Si $K\notin D$, on introduit la parallèle $D'$ à D passant par K. La composée de $s_{D'}$ et $s_D$ fournit une translation non nulle. Il reste alors une symétrie suivie d’une translation qui n’est pas normale à son axe : c’est une symétrie glissée.

## Déterminer l’unique antidéplacement

Soient A, B, A' et B' tels que

$$
AB=A'B'
\quad\text{et}\quad
A\ne B.
$$

Il existe un unique antidéplacement g envoyant A sur A' et B sur B'.

- Si $[AA']$ et $[BB']$ ont la même médiatrice Δ, alors $g=s_\Delta$.
- Si leurs médiatrices sont différentes, g est une symétrie glissée.

Cette méthode évite de deviner la transformation : les deux couples image-point imposent entièrement l’antidéplacement.`,
    keyPoint: "$K\\in D$ → symétrie orthogonale ; $K\\notin D$ → symétrie glissée.",
    example: "Dans le triangle équilatéral, $s_{(AG)}\\circ r_{G,2\\pi/3}$ est une symétrie orthogonale car $G\\in(AG)$ ; son axe est (GB).",
    methodSteps: [
      "Repère le centre de la rotation et vérifie s’il appartient à l’axe de symétrie.",
      "Décompose la rotation avec une droite passant par son centre et parallèle ou égale à l’axe.",
      "Simplifie deux symétries identiques consécutives.",
      "Pour deux images imposées, compare les médiatrices de [AA'] et [BB'].",
    ],
    timeline: [
      { label: "Centre sur l’axe", detail: "La composée est une symétrie orthogonale." },
      { label: "Centre hors axe", detail: "La composée est une symétrie glissée." },
      { label: "Deux images", detail: "Elles déterminent un unique antidéplacement." },
      { label: "Médiatrices", detail: "Communes : réflexion ; distinctes : glissement." },
    ],
    corrections: [
      "Page 11 : dans la construction du premier cas, la droite Δ1 doit être l’image de l’axe D par la rotation de centre K et d’angle -θ/2 ; la mention D' dans la phrase imprimée est une coquille.",
      "Page 12 : la correction imprimée laisse « vecteur JC à détailler ». Le vecteur de la symétrie glissée g est bien $\\overrightarrow{JC}$, parallèle à son axe (KI).",
    ],
    questions: [
      choice("Si le centre K de la rotation appartient à l’axe D, quelle est la nature de $r_K\\circ s_D$ ?", ["Une symétrie orthogonale", "Une symétrie glissée", "Une translation", "Une homothétie"], 0, "Le centre sur l’axe permet de simplifier une réflexion commune.", "Propriété • page 11"),
      choice("Si K n’appartient pas à D, quelle est la nature de $s_D\\circ r_K$ ?", ["Une symétrie glissée", "Une rotation", "Une translation", "Une symétrie centrale"], 0, "La translation résiduelle possède une composante parallèle à l’axe.", "Propriété • pages 11-12"),
      truth("En général, $r\\circ s_D=s_D\\circ r$.", false, "Les axes ou vecteurs caractéristiques obtenus dépendent de l’ordre.", "Remarque • page 11"),
      choice("Dans le triangle équilatéral, que vaut $f(A)$ pour $f=s_{(AG)}\\circ r_{G,2\\pi/3}$ ?", ["C", "B", "A", "G"], 0, "La rotation envoie A sur B, puis la symétrie d’axe (AG) envoie B sur C.", "Exercice de fixation a • page 12"),
      choice("Quelle est la nature de f ?", ["La symétrie orthogonale d’axe (GB)", "La rotation de centre G", "La symétrie glissée d’axe (AG)", "La translation de vecteur AC"], 0, "G appartient à (AG) et la médiatrice de [AC] est (GB).", "Exercice de fixation a • page 12", 2),
      choice("Pour $g=r_{G,2\\pi/3}\\circ s_{(AB)}$, quelles sont les images de A et B ?", ["g(A)=B et g(B)=C", "g(A)=C et g(B)=A", "g(A)=A et g(B)=B", "g(A)=G et g(B)=G"], 0, "La symétrie fixe A et B, puis la rotation les envoie respectivement sur B et C.", "Exercice de fixation b • page 12"),
      choice("Quels sont les éléments caractéristiques de g ?", ["Axe (KI), vecteur JC", "Axe (AB), vecteur nul", "Centre G, angle 2π/3", "Axe (GB), vecteur AC"], 0, "Les milieux de [AB] et [BC] déterminent l’axe (KI), et le glissement parallèle est JC.", "Exercice de fixation b complété • page 12", 2),
      choice("Quand l’antidéplacement A→A' et B→B' est-il une symétrie orthogonale ?", ["Quand [AA'] et [BB'] ont la même médiatrice", "Quand A'=B'", "Quand AB et A'B' sont perpendiculaires", "Toujours"], 0, "L’axe doit être simultanément la médiatrice des deux segments point-image.", "Propriété • page 15"),
      choice("Si les deux médiatrices sont différentes, l’antidéplacement est…", ["une symétrie glissée", "une rotation", "une translation", "l’identité"], 0, "Une symétrie orthogonale ne peut pas avoir deux axes différents.", "Propriété • page 15"),
      choice("Dans le triangle rectangle de la page 16, quelle transformation envoie B sur O et K sur I ?", ["Une symétrie orthogonale", "Une rotation", "Une translation", "Une homothétie"], 0, "Les segments [BO] et [KI] ont la même médiatrice.", "Exercice de fixation 1 • page 16"),
      choice("L’antidéplacement g qui envoie B sur A et A sur O est…", ["une symétrie glissée", "une symétrie orthogonale", "une rotation", "l’identité"], 0, "Les segments [BA] et [AO] ont des médiatrices différentes.", "Exercice de fixation 2 • page 16"),
      choice("Quels sont l’axe et le vecteur de g ?", ["Axe (KI), vecteur KI", "Axe (BO), vecteur BA", "Axe (AB), vecteur AO", "Axe (AC), vecteur nul"], 0, "Le document obtient l’axe (KI) et $\\frac12\\overrightarrow{BO}=\\overrightarrow{KI}$.", "Exercice de fixation 2 • page 16", 2),
      truth("Deux couples de points A→A' et B→B' avec AB=A'B' déterminent un unique antidéplacement.", true, "C’est la propriété de détermination du cours.", "Propriété • page 15"),
    ],
  },
  {
    id: "glide-reflection",
    title: "Maîtriser la symétrie glissée",
    summary: "Construire, reconnaître et déterminer une symétrie glissée à partir de son axe, de son vecteur ou de deux couples point-image.",
    pages: "7-11, 18-20, 22",
    section: "III-2. Symétrie glissée et composée translation-symétrie • Exercices 3, 4, 8 et 11",
    durationMinutes: 42,
    body: String.raw`## Définition

Soit D une droite et $\vec u$ un vecteur directeur de D. La **symétrie glissée** d’axe D et de vecteur $\vec u$ est

$$
g=t_{\vec u}\circ s_D.
$$

Comme $\vec u$ est parallèle à D, les deux transformations commutent :

$$
t_{\vec u}\circ s_D=s_D\circ t_{\vec u}.
$$

Une symétrie glissée est entièrement caractérisée par son axe et son vecteur.

## Propriétés géométriques

Une symétrie glissée non triviale :

- n’admet aucun point invariant ;
- est un antidéplacement ;
- vérifie

$$
g^2=t_{2\vec u}.
$$

Si $M'=g(M)$, le milieu de $[MM']$ appartient à l’axe D. Avec deux points M et N d’images M' et N', l’axe est donc la droite joignant les milieux de $[MM']$ et $[NN']$.

Si A'' est l’image de A par $g^2$, alors

$$
\vec u=\frac12\overrightarrow{AA''}.
$$

## Composer une translation et une symétrie

On étudie $t_{\vec u}\circ s_\Delta$.

### Cas 1 : $\vec u$ est normal à Δ

La composée est une symétrie orthogonale. Son axe est la droite

$$
D=t_{\frac12\vec u}(\Delta).
$$

Pour l’ordre inverse, l’axe est déplacé dans l’autre sens :

$$
D'=t_{-\frac12\vec u}(\Delta).
$$

### Cas 2 : $\vec u$ n’est pas normal à Δ

On décompose

$$
\vec u=\vec n+\vec\tau,
$$

avec $\vec n$ normal à Δ et $\vec\tau$ parallèle à Δ. Alors

$$
t_{\vec u}\circ s_\Delta
=
t_{\vec\tau}\circ s_D,
\qquad
D=t_{\frac12\vec n}(\Delta).
$$

La composée est une symétrie glissée d’axe D et de vecteur $\vec\tau$.

> **Astuce mémoire de Davy.** La partie normale déplace l’axe ; la partie parallèle produit le glissement.`,
    keyPoint: "$g=t_{\\vec u}\\circ s_D=s_D\\circ t_{\\vec u}$ avec $\\vec u\\parallel D$ et $g^2=t_{2\\vec u}$.",
    example: "Dans le carré, $t_{\\overrightarrow{AC}}\\circ s_{(KI)}$ devient la symétrie glissée d’axe (BC) et de vecteur $\\overrightarrow{BC}$ après décomposition de AC en AB+BC.",
    methodSteps: [
      "Compare d’abord le vecteur de translation à la normale de l’axe.",
      "S’il est normal, translate l’axe d’un demi-vecteur et conclus à une symétrie orthogonale.",
      "Sinon, décompose le vecteur en composantes normale et parallèle.",
      "Déplace l’axe avec la moitié de la composante normale ; garde la composante parallèle comme vecteur de glissement.",
      "Avec deux images, relie les milieux des segments point-image pour retrouver l’axe.",
    ],
    timeline: [
      { label: "Axe + vecteur", detail: "Ils caractérisent entièrement la symétrie glissée." },
      { label: "Milieux", detail: "Les milieux des segments point-image sont sur l’axe." },
      { label: "Composante normale", detail: "Elle déplace l’axe." },
      { label: "Composante parallèle", detail: "Elle donne le vecteur de glissement." },
    ],
    interaction: glideReflectionInteraction,
    corrections: [
      "Page 9 : la ligne imprimée « t_u = t_n + τ » est rétablie comme une composition de translations : $t_{\\vec u}=t_{\\vec n}\\circ t_{\\vec\\tau}=t_{\\vec\\tau}\\circ t_{\\vec n}$.",
      "Pages 18-20 : l’exercice 8 répète exactement l’exercice 3, et l’exercice 11 répète exactement l’exercice 4. Les doublons sont signalés mais restent présents dans l’entraînement fidèle.",
    ],
    questions: [
      choice("Qu’est-ce qu’une symétrie glissée d’axe D et de vecteur u ?", ["$t_{\\vec u}\\circ s_D$ avec $\\vec u\\parallel D$", "$t_{\\vec u}\\circ s_D$ avec $\\vec u\\perp D$", "$r_{D,\\pi/2}$", "$s_D\\circ s_D$"], 0, "Le glissement s’effectue parallèlement à l’axe.", "Définition • page 7"),
      truth("$t_{\\vec u}\\circ s_D=s_D\\circ t_{\\vec u}$ lorsque $\\vec u$ dirige D.", true, "La translation parallèle à l’axe commute avec la réflexion.", "Définition • page 7"),
      truth("Une symétrie glissée non triviale possède un point invariant.", false, "Elle n’en possède aucun.", "Propriété 1 • page 8"),
      choice("Si $g^2(A)=A''$, que vaut le vecteur de g ?", ["$\\frac12\\overrightarrow{AA''}$", "$\\overrightarrow{AA''}$", "$2\\overrightarrow{AA''}$", "$\\overrightarrow{A''A}$"], 0, "$g^2$ est la translation de vecteur double.", "Point méthode • page 8"),
      choice("Où se trouve le milieu de [MM'] si M'=g(M) ?", ["Sur l’axe de g", "Toujours en M", "Au centre d’une rotation", "À l’extérieur du plan"], 0, "C’est la propriété 2 du cours.", "Propriété 2 • page 8"),
      choice("Dans le triangle de la page 8, quelles sont les images par f d’axe (IJ) et de vecteur BK ?", ["f(A)=D, f(B)=C, f(I)=J", "f(A)=C, f(B)=D, f(I)=I", "f(A)=A, f(B)=B, f(I)=J", "f(A)=B, f(B)=A, f(I)=K"], 0, "La translation parallèle à (IJ) est appliquée avec la symétrie de cet axe.", "Exercice de fixation 1 • pages 8-9"),
      choice("Si g(C)=B et g(L)=K, quel est son axe ?", ["(IJ)", "(AC)", "(BK)", "(CL)"], 0, "L’axe passe par les milieux de [CB] et [LK], qui sont I et J.", "Exercice de fixation 2 • pages 8-9"),
      choice("Quel est alors le vecteur de g ?", ["$\\overrightarrow{KB}$", "$\\overrightarrow{BK}$", "$\\overrightarrow{IJ}$", "$\\overrightarrow{CL}$"], 0, "Le document obtient le vecteur KB, parallèle à (IJ).", "Exercice de fixation 2 • page 9"),
      choice("Si u est normal à Δ, quelle est la nature de $t_{\\vec u}\\circ s_\\Delta$ ?", ["Une symétrie orthogonale", "Une symétrie glissée", "Une rotation", "Une translation"], 0, "La composante parallèle est nulle.", "Propriété • page 9"),
      choice("Si u n’est pas normal à Δ, quelle est la nature de la composée ?", ["Une symétrie glissée", "Une rotation", "L’identité", "Une homothétie"], 0, "Une composante parallèle non nulle subsiste.", "Propriété • pages 9-10"),
      choice("Dans $\\vec u=\\vec n+\\vec\\tau$, quel vecteur devient le vecteur de glissement ?", ["$\\vec\\tau$", "$\\vec n$", "$2\\vec n$", "$\\vec u-2\\vec\\tau$"], 0, "τ est la composante parallèle au nouvel axe.", "Méthode • pages 9-11"),
      choice("Dans le carré, que vaut $g=t_{\\overrightarrow{BC}}\\circ s_{(JL)}$ ?", ["$s_{(CD)}$", "$s_{(AB)}$", "Une symétrie glissée d’axe (JL)", "$r_{O,\\pi}$"], 0, "BC est normal à (JL) et le nouvel axe est (CD).", "Exercice de fixation a • page 10"),
      choice("Que vaut $f=t_{\\overrightarrow{AC}}\\circ s_{(KI)}$ ?", ["Symétrie glissée d’axe (BC) et de vecteur BC", "Symétrie d’axe (CD)", "Rotation de centre O", "Translation de vecteur AC"], 0, "AC=AB+BC ; la composante AB déplace l’axe et BC reste parallèle.", "Exercice de fixation b • page 10", 2),
      choice("Exercice 3. Pour la symétrie glissée d’axe (IJ) et de vecteur AK, que vaut f(A) ?", ["C", "D", "B", "A"], 0, "La correction officielle donne f(A)=C.", "Exercice 3 • pages 18 et 22"),
      choice("Que vaut f(C) ?", ["B", "A", "D", "C"], 0, "La correction officielle donne f(C)=B.", "Exercice 3 • pages 18 et 22"),
      choice("Que vaut f(J) ?", ["I", "K", "L", "J"], 0, "La correction officielle donne f(J)=I.", "Exercice 3 • pages 18 et 22"),
      choice("Que vaut f(L) ?", ["K", "I", "J", "L"], 0, "La correction officielle donne f(L)=K.", "Exercice 3 • pages 18 et 22"),
      choice("Exercice 4. Que vaut $s_{(JL)}\\circ t_{\\overrightarrow{BC}}$ ?", ["$s_{(AB)}$", "$s_{(CD)}$", "$r_{O,\\pi}$", "$t_{\\overrightarrow{BC}}$"], 0, "L’ordre inverse déplace l’axe vers (AB).", "Exercice 4 a • pages 18 et 22"),
      choice("Que vaut $s_{(KI)}\\circ t_{\\overrightarrow{AC}}$ ?", ["Symétrie glissée d’axe (AD), vecteur BC", "Symétrie glissée d’axe (BC), vecteur BC", "Symétrie d’axe (AB)", "Rotation de centre O"], 0, "La correction officielle donne l’axe (AD) et le vecteur BC.", "Exercice 4 b • pages 18 et 22", 2),
      choice("Exercice 8 reprend exactement quel exercice ?", ["L’exercice 3", "L’exercice 4", "L’exercice 6", "L’exercice 9"], 0, "Même figure, même axe, même vecteur et mêmes quatre images.", "Exercice 8 dupliqué • page 19"),
      choice("Exercice 11 reprend exactement quel exercice ?", ["L’exercice 4", "L’exercice 3", "L’exercice 5", "L’exercice 10"], 0, "Les deux compositions du carré sont reproduites à l’identique.", "Exercice 11 dupliqué • page 20"),
      choice("Pourquoi une symétrie glissée est-elle un antidéplacement ?", ["Elle contient une seule réflexion axiale", "Elle est composée de deux rotations", "Elle fixe tous les points", "Elle multiplie les longueurs par 2"], 0, "La translation conserve l’orientation, la réflexion la renverse.", "Synthèse • pages 7-11"),
    ],
  },
  {
    id: "isometry-fixed-points",
    title: "Identifier et déterminer une isométrie",
    summary: "Utiliser les points invariants et deux couples point-image pour distinguer identité, rotation, translation, symétrie ou symétrie glissée.",
    pages: "13, 15-16, 20-21, 23",
    section: "IV-1. Points invariants • V. Détermination • Exercices 13, 14 et 15",
    durationMinutes: 38,
    body: String.raw`## Classer par les points invariants

L’ensemble des points M tels que $f(M)=M$ est noté

$$
\operatorname{Fix}(f).
$$

Pour une isométrie plane :

| Points invariants | Conclusion |
|---|---|
| trois points non alignés | $f=\operatorname{Id}_{\mathcal P}$ |
| deux points distincts A et B, avec $f\ne\operatorname{Id}$ | $f=s_{(AB)}$ |
| un unique point A | f est une rotation de centre A |
| aucun point | f est une translation non nulle ou une symétrie glissée |

La famille déplacement/antidéplacement permet de lever la dernière ambiguïté.

## Déterminer l’unique déplacement

Soient A, B, A' et B' tels que

$$
AB=A'B'
\quad\text{et}\quad
A\ne B.
$$

Il existe un unique déplacement f tel que $f(A)=A'$ et $f(B)=B'$.

### Cas de la translation

Si

$$
\overrightarrow{AB}=\overrightarrow{A'B'},
$$

alors

$$
f=t_{\overrightarrow{AA'}}.
$$

### Cas de la rotation

Si les deux vecteurs ne sont pas égaux, f est la rotation d’angle

$$
\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{A'B'}).
$$

Son centre est l’intersection des médiatrices de $[AA']$ et $[BB']$.

## Deux propriétés de stabilité

Si f et g sont deux isométries, alors :

$$
g\circ f
\quad\text{et}\quad
f^{-1}
$$

sont encore des isométries. En effet, une égalité de distances reste vraie après une seconde conservation de distance, et la bijection réciproque restitue les mêmes longueurs.

> **Astuce mémoire de Davy.** Points fixes pour la nature ; deux images pour les éléments caractéristiques.`,
    keyPoint: "$\\operatorname{Fix}(f)$ et deux couples point-image suffisent à identifier l’isométrie.",
    example: "Si A→C, B→A' et $\\overrightarrow{AB}=\\overrightarrow{CA'}$, l’unique déplacement est la translation de vecteur AC.",
    methodSteps: [
      "Cherche d’abord les points invariants évidents.",
      "Décide si la transformation conserve ou renverse l’orientation.",
      "Avec deux images, vérifie l’égalité AB=A'B'.",
      "Compare ensuite les vecteurs AB et A'B' : égaux → translation ; différents → rotation.",
      "Pour une rotation, construis les deux médiatrices pour obtenir le centre.",
    ],
    timeline: [
      { label: "Trois points", detail: "Non alignés et fixes : identité." },
      { label: "Deux points", detail: "Fixes et transformation non identique : symétrie axiale." },
      { label: "Un point", detail: "Unique : rotation." },
      { label: "Aucun point", detail: "Translation ou symétrie glissée." },
    ],
    questions: [
      choice("Une isométrie qui fixe trois points non alignés est…", ["l’identité", "une rotation non triviale", "une translation", "une symétrie glissée"], 0, "Trois distances vers des points non alignés déterminent chaque point du plan.", "Exercice de fixation A-D • page 13"),
      choice("Une isométrie non identique qui fixe deux points distincts A et B est…", ["$s_{(AB)}$", "$r_{A,\\pi/2}$", "$t_{\\overrightarrow{AB}}$", "une symétrie glissée"], 0, "Son axe est la droite des deux points fixes.", "Exercice de fixation • page 13"),
      choice("Une isométrie qui possède un unique point fixe A est…", ["une rotation de centre A", "une translation", "une symétrie glissée", "l’identité"], 0, "C’est la caractérisation par un point invariant unique.", "Exercice de fixation • page 13"),
      choice("Une isométrie sans point invariant est…", ["une translation ou une symétrie glissée", "toujours une rotation", "toujours l’identité", "toujours une symétrie orthogonale"], 0, "Ce sont les deux classes sans point fixe.", "Exercice de fixation • page 13"),
      truth("Deux couples A→A' et B→B' avec AB=A'B' déterminent un unique déplacement.", true, "C’est la propriété de détermination du déplacement.", "Propriété • page 15"),
      choice("Quand ce déplacement est-il une translation ?", ["Quand $\\overrightarrow{AB}=\\overrightarrow{A'B'}$", "Quand A'=B'", "Quand les segments sont perpendiculaires", "Toujours"], 0, "Les deux segments ont alors même direction, même sens et même longueur.", "Propriété • page 15"),
      choice("Quel est alors son vecteur ?", ["$\\overrightarrow{AA'}$", "$\\overrightarrow{AB}$", "$\\overrightarrow{A'B'}$", "$\\overrightarrow{A'A}$"], 0, "La translation envoie A sur A'.", "Propriété • page 15"),
      choice("Si les vecteurs AB et A'B' sont différents, le déplacement est…", ["une rotation", "une symétrie glissée", "une homothétie", "une projection"], 0, "Un déplacement non translation est une rotation.", "Propriété • page 15"),
      choice("Quel est son angle ?", ["$\\operatorname{Mes}(\\overrightarrow{AB},\\overrightarrow{A'B'})$", "$\\operatorname{Mes}(\\overrightarrow{AA'},\\overrightarrow{BB'})$", "Toujours π", "Toujours 0"], 0, "L’angle orienté transporte la direction de AB vers celle de A'B'.", "Propriété • page 15"),
      choice("Dans l’exemple du cercle, quelle translation envoie A sur C et B sur A' ?", ["$t_{\\overrightarrow{AC}}$", "$t_{\\overrightarrow{AB}}$", "$t_{\\overrightarrow{CA}}$", "$t_{\\overrightarrow{BO}}$"], 0, "Le document établit $\\overrightarrow{AB}=\\overrightarrow{CA'}$.", "Exercice de fixation 1 • page 15"),
      choice("Le déplacement g tel que g(A)=C et g(B)=O est de quelle nature ?", ["Une rotation", "Une translation", "Une symétrie orthogonale", "Une symétrie glissée"], 0, "Les vecteurs AB et CO ne sont pas égaux.", "Exercice de fixation 2 • page 15"),
      short("Quel est l’angle de cette rotation g ?", ["π/3", "pi/3", "60°", "60"], "Le document calcule $\\operatorname{Mes}(\\overrightarrow{AB},\\overrightarrow{CO})=\\pi/3$.", "Exercice de fixation 2 b • page 15", 2),
      choice("Exercice 13. Pourquoi le centre O d’un polygone régulier Γ est-il fixe par toute isométrie qui laisse Γ globalement invariant ?", ["O est l’isobarycentre des sommets et les barycentres sont conservés", "O est choisi au hasard", "Toute isométrie fixe l’origine", "Γ possède seulement deux sommets"], 0, "L’ensemble des images des sommets est le même ensemble de sommets.", "Exercice 13.1 • pages 20 et 23", 2),
      choice("Une isométrie non identique laissant globalement invariant Γ est donc…", ["une rotation ou une symétrie orthogonale", "une translation non nulle seulement", "une symétrie glissée seulement", "une homothétie"], 0, "Elle possède au moins le point fixe O.", "Exercice 13.2 • pages 20 et 23"),
      choice("Exercice 14. Pourquoi l’application décrite est-elle une isométrie ?", ["La conservation des barycentres la rend affine et les repères orthonormés images préservent les normes", "Elle fixe nécessairement tous les points", "Elle double toutes les longueurs", "Elle transforme les droites en cercles"], 0, "Une base orthonormée image permet de conserver la norme de chaque vecteur.", "Exercice 14 • pages 20-21", 3),
      truth("La composée de deux isométries est une isométrie.", true, "Chaque application conserve successivement la même distance.", "Exercice 15.1 • page 21"),
      truth("La transformation réciproque d’une isométrie est une isométrie.", true, "La bijection réciproque restitue les distances conservées.", "Exercice 15.2 • page 21"),
    ],
  },
  {
    id: "isometry-applications",
    title: "Missions et configurations de synthèse",
    summary: "Mobiliser les isométries pour démontrer égalités, perpendicularités, alignements et transformer des motifs complexes.",
    pages: "16-23",
    section: "Situation complexe • Exercices 10, 12 et 16 à 19 • Corrections",
    durationMinutes: 52,
    kind: "challenge",
    body: String.raw`## Transporter une propriété au lieu de recalculer

Si une rotation r envoie le segment $[AB]$ sur $[A'B']$, alors

$$
AB=A'B'
$$

et l’angle entre les deux supports est l’angle de r. Pour une rotation d’angle $\pm\pi/2$, on obtient immédiatement égalité de longueurs et perpendicularité.

Le produit scalaire est également transporté :

$$
\overrightarrow{NA}\cdot\overrightarrow{NB}
=
\overrightarrow{r(N)r(A)}\cdot\overrightarrow{r(N)r(B)}.
$$

## Les quarts de tour dans les carrés

Dans deux carrés directs construits à partir du même sommet A, la rotation de centre A et d’angle $\pi/2$ envoie les côtés correspondants les uns sur les autres.

Pour l’exercice 16, cette rotation envoie le vecteur $\overrightarrow{BH}$ sur $\overrightarrow{CG}$ :

$$
\overrightarrow{CG}
=
R_{\pi/2}\left(\overrightarrow{BH}\right).
$$

Donc

$$
BH=CG
\quad\text{et}\quad
(BH)\perp(CG).
$$

## Mission du losange : déterminer complètement une symétrie glissée

Dans l’exercice 18, ABCD est un losange de côté 5 et d’angle $\pi/3$. L’isométrie f est définie par

$$
f(A)=B,\qquad f(B)=D,\qquad f(D)=C.
$$

Elle renverse l’orientation : c’est un antidéplacement. Elle ne possède pas de point fixe, donc c’est une symétrie glissée.

Avec Δ médiatrice de [AB] et la rotation $r_{B,-\pi/3}$ :

$$
f=r_{B,-\pi/3}\circ s_\Delta.
$$

Si $\Delta'$ est la médiatrice de [CD], alors

$$
r_{B,-\pi/3}=s_{(BC)}\circ s_{\Delta'}
$$

et

$$
f=s_{(BC)}\circ t_{\overrightarrow{AB}}.
$$

Enfin, en retirant la translation

$$
t_2=t_{\frac12\overrightarrow{AD}},
$$

on obtient

$$
g=t_2^{-1}\circ f=s_{(IO)}.
$$

La forme canonique de f est donc

$$
f=t_{\overrightarrow{IO}}\circ s_{(IO)},
\qquad
\overrightarrow{IO}=\frac12\overrightarrow{AD}.
$$

## Mission finale : le motif du pagne

Le motif contient cinq triangles : CIA, BAC, BOC, BAJ et IOJ.

- l’identité conserve CIA ;
- $t_{\overrightarrow{IA}}$ envoie CIA sur BAJ ;
- $t_{\overrightarrow{IC}}$ envoie CIA sur BOC ;
- la symétrie glissée composée avec $t_{\overrightarrow{IC}}$ et $s_{(BC)}$ envoie CIA sur BAC ;
- l’homothétie de centre I et de rapport 2 envoie CIA sur OIJ.

> **Précision importante.** La dernière transformation appartient au thème général des transformations du plan, mais ce n’est pas une isométrie car elle double les longueurs.`,
    keyPoint: "Choisir une isométrie qui transporte toute la configuration permet d’obtenir simultanément longueurs, angles et incidences.",
    example: "Dans l’exercice 10, la rotation de centre I et d’angle -π/2 envoie N sur P et C sur B ; elle donne directement NC=PB et $(NC)\\perp(PB)$.",
    methodSteps: [
      "Cherche deux éléments de la figure qui se correspondent par une rotation, une translation ou une symétrie.",
      "Détermine l’image de deux points ou de deux droites pour verrouiller la transformation.",
      "Transporte les propriétés conservées au lieu de reprendre des calculs de distances.",
      "Pour une symétrie glissée, retire d’abord la translation parallèle afin de faire apparaître la symétrie axiale.",
      "Dans une mission, vérifie que chaque transformation annoncée envoie bien les trois sommets du triangle source.",
    ],
    timeline: [
      { label: "Repères", detail: "Choisis les points dont les images sont évidentes." },
      { label: "Transformation", detail: "Détermine nature et éléments caractéristiques." },
      { label: "Transport", detail: "Longueurs, angles et produits scalaires sont conservés." },
      { label: "Conclusion", detail: "Traduis les invariants dans la propriété demandée." },
    ],
    corrections: [
      "Page 16 : la note d’éditeur « A changer » placée avant la situation complexe n’est pas un contenu pédagogique et a été retirée.",
      "Page 20 : dans l’exercice 12, le symbole $r_I$ manque avant « et r_J » dans le PDF. L’énoncé est rétabli avec les rotations $r_I$ et $r_J$ de centres I et J.",
      "Pages 17 et 23 : l’homothétie de centre I et de rapport 2 est conservée fidèlement dans la mission, mais elle est explicitement distinguée des isométries puisqu’elle double les longueurs.",
      "Page 21 : la numérotation interne de l’exercice 18 est régularisée sans modifier les questions.",
    ],
    questions: [
      choice("Exercice 10. Que vaut r(B) pour la rotation de centre I et d’angle -π/2 ?", ["A", "C", "D", "B"], 0, "Le quart de tour négatif autour du centre du carré envoie B sur A.", "Exercice 10 a • pages 20 et 22"),
      choice("Que vaut r(M) ?", ["Q", "N", "P", "I"], 0, "Le triangle IMQ est rectangle isocèle en I et de sens indirect.", "Exercice 10 a • pages 20 et 22"),
      choice("Pourquoi r(N)=P ?", ["r envoie (AB) sur (AD) et (MN) sur (MP)", "N et P sont toujours confondus", "r fixe toutes les droites", "M est le milieu de [NP]"], 0, "N et P sont les intersections correspondantes de ces deux couples de droites.", "Exercice 10 b • page 22", 2),
      choice("Quelle conclusion donne la rotation pour NC et BP ?", ["NC=BP et (NC) est perpendiculaire à (BP)", "NC=2BP", "NC et BP sont parallèles", "N=C"], 0, "Une rotation d’angle -π/2 conserve les longueurs et transforme une direction en sa perpendiculaire.", "Exercice 10 d • pages 20 et 23", 2),
      choice("Exercice 12. La composée de deux rotations d’angle π/2 a pour angle total…", ["π", "π/2", "0", "2π"], 0, "Les angles s’additionnent.", "Exercice 12 a • page 20"),
      choice("Quelle est donc sa nature ?", ["Une symétrie centrale", "Une translation non nulle", "Une symétrie glissée", "Une homothétie"], 0, "Une rotation d’angle π est une symétrie centrale.", "Exercice 12 a • page 20"),
      choice("Quelle conclusion porte sur OIJ ?", ["OIJ est rectangle isocèle en O", "OIJ est équilatéral", "O, I et J sont alignés", "OI=2OJ"], 0, "La composée de quarts de tour donne OI=OJ et un angle droit en O.", "Exercice 12 a • page 20"),
      choice("Quelle conclusion finale porte sur IK et JL ?", ["IK=JL et (IK)⊥(JL)", "IK=2JL et les droites sont parallèles", "I=K et J=L", "Les deux segments sont quelconques"], 0, "Les deux triangles rectangles isocèles construits autour de O permettent de transporter les diagonales.", "Exercice 12 c • page 20", 2),
      choice("Exercice 16. Quelle relation vectorielle résume la preuve ?", ["$\\overrightarrow{CG}=R_{\\pi/2}(\\overrightarrow{BH})$", "$\\overrightarrow{CG}=2\\overrightarrow{BH}$", "$\\overrightarrow{CG}=-\\overrightarrow{BH}$", "$\\overrightarrow{CG}=\\vec0$"], 0, "Le quart de tour autour de A transforme les côtés correspondants des deux carrés.", "Exercice 16 • page 21", 2),
      choice("Qu’en déduit-on ?", ["BH=CG et (BH)⊥(CG)", "BH=2CG", "B, H, C et G sont alignés", "BH et CG sont des rayons"], 0, "Une rotation conserve les longueurs et ajoute un angle droit.", "Exercice 16 • page 21"),
      choice("Exercice 17. Quel est le point A' ?", ["Le symétrique de A par rapport à C", "Le milieu de [AB]", "Le centre du cercle", "Le symétrique de B par rapport à D"], 0, "La configuration du triangle équilatéral donne C milieu de [AA'].", "Exercice 17.1 • page 21"),
      choice("Que vaut $s_{(BD)}\\circ s_{(DC)}$ ?", ["$r_{D,-2\\pi/3}$", "$r_{D,2\\pi/3}$", "$s_D$", "$t_{\\overrightarrow{BC}}$"], 0, "Les axes se coupent en D et le double de l’angle orienté de (DC) vers (DB) vaut -2π/3.", "Exercice 17.2 a • page 21", 2),
      choice("Que vaut $s_{(CA)}\\circ s_{(AB)}$ ?", ["$r_{A,2\\pi/3}$", "$r_{A,-2\\pi/3}$", "$s_A$", "$t_{\\overrightarrow{AB}}$"], 0, "Les axes se coupent en A avec un angle orienté de π/3.", "Exercice 17.2 b • page 21"),
      choice("Que vaut $s_{(DC)}\\circ s_{(CA)}$ ?", ["La symétrie centrale $s_C$", "La rotation $r_{C,\\pi/2}$", "La translation de vecteur DC", "La symétrie d’axe (AC)"], 0, "Les deux axes sont perpendiculaires en C.", "Exercice 17.2 c • page 21"),
      choice("Pour $f=s_{(BD)}\\circ s_C\\circ s_{(AB)}$, que vaut f(A) ?", ["A'", "A", "B", "D"], 0, "s_(AB) fixe A, s_C envoie A sur A', puis A' appartient à (BD).", "Exercice 17.3 a • page 21", 2),
      choice("Quelle est la nature de f ?", ["La translation $t_{\\overrightarrow{AA'}}$", "Une rotation de centre C", "La symétrie d’axe (BD)", "L’identité"], 0, "Le calcul affine ou la décomposition montre que tous les points sont déplacés du vecteur AA'.", "Exercice 17.3 a • page 21", 3),
      choice("Qu’en déduit-on pour $s_{(BD)}\\circ s_C$ ?", ["Une symétrie glissée", "Une rotation", "Une translation", "L’identité"], 0, "Cette transformation vaut $t_{\\overrightarrow{AA'}}\\circ s_{(AB)}$ et le vecteur n’est pas normal à (AB).", "Exercice 17.3 b • page 21", 3),
      choice("Exercice 18. Pourquoi f est-elle un antidéplacement ?", ["Elle renverse l’orientation du triangle ABD vers BDC", "Elle multiplie les longueurs par 2", "Elle fixe trois points", "Elle est une rotation"], 0, "Les trois images imposées inversent l’orientation.", "Exercice 18.2 a • page 21", 2),
      choice("Pourquoi f est-elle une symétrie glissée ?", ["C’est un antidéplacement sans point fixe", "C’est un déplacement avec un centre", "Elle fixe toute une droite", "Elle n’est pas une isométrie"], 0, "Un antidéplacement sans point invariant est une symétrie glissée.", "Exercice 18.2 b • page 21"),
      truth("$f=r_{B,-\\pi/3}\\circ s_\\Delta$.", true, "La symétrie d’axe Δ échange A et B, puis la rotation envoie A sur D et D sur C comme requis.", "Exercice 18.3 a • page 21"),
      truth("$f=s_\\Delta\\circ r_{B,-\\pi/3}$.", false, "L’ordre des deux transformations ne commute pas.", "Exercice 18.3 b • page 21"),
      choice("Quel est l’axe de s tel que $r_{B,-\\pi/3}=s_{(BC)}\\circ s$ ?", ["La médiatrice Δ' de [CD]", "La médiatrice Δ de [AB]", "(AD)", "(IO)"], 0, "L’axe s passe par B et fait un angle π/6 adapté avec (BC) ; c’est Δ'.", "Exercice 18.4 a • page 21", 2),
      choice("Quelle translation t1 vérifie $f=s_{(BC)}\\circ t_1$ ?", ["$t_{\\overrightarrow{AB}}$", "$t_{\\overrightarrow{AD}}$", "$t_{\\overrightarrow{IO}}$", "$t_{\\overrightarrow{BC}}$"], 0, "$s_{\\Delta'}\\circ s_\\Delta$ est la translation de vecteur AB.", "Exercice 18.4 b • page 21", 2),
      choice("Pour $g=t_2^{-1}\\circ f$, que vaut g(D) ?", ["J", "D", "I", "O"], 0, "Après retrait du demi-vecteur AD, g est la réflexion d’axe (IO), qui envoie D sur J.", "Exercice 18.5 a • page 21", 2),
      choice("Que valent g(I) et g(O) ?", ["g(I)=I et g(O)=O", "g(I)=O et g(O)=I", "g(I)=J et g(O)=D", "Ils ne sont pas définis"], 0, "I et O appartiennent à l’axe de la symétrie g.", "Exercice 18.5 a • page 21"),
      choice("Quelle est la transformation g ?", ["$s_{(IO)}$", "$r_{O,\\pi/3}$", "$t_{\\overrightarrow{IO}}$", "$s_\\Delta$"], 0, "Elle fixe I et O et n’est pas l’identité.", "Exercice 18.5 a • page 21"),
      choice("Quels sont finalement l’axe et le vecteur de f ?", ["Axe (IO), vecteur IO", "Axe (AB), vecteur AB", "Axe (BC), vecteur nul", "Centre O, angle π/3"], 0, "$\\overrightarrow{IO}=\\frac12\\overrightarrow{AD}$ est parallèle à l’axe (IO).", "Exercice 18.5 b • page 21", 3),
      choice("Mission 19. Quelle transformation envoie CIA sur BAJ ?", ["$t_{\\overrightarrow{IA}}$", "$t_{\\overrightarrow{IC}}$", "$s_{(BC)}$", "$h_{I,2}$"], 0, "Les trois sommets sont déplacés du vecteur IA.", "Situation complexe • pages 22-23"),
      choice("Quelle transformation envoie CIA sur BOC ?", ["$t_{\\overrightarrow{IC}}$", "$t_{\\overrightarrow{IA}}$", "$r_{I,\\pi/2}$", "$s_{(BC)}$"], 0, "Les trois sommets sont déplacés du vecteur IC.", "Situation complexe • pages 22-23"),
      choice("Quelle transformation du document envoie CIA sur BAC ?", ["La symétrie glissée construite avec $t_{\\overrightarrow{IC}}$ et $s_{(BC)}$", "L’identité", "$h_{I,2}$", "$t_{\\overrightarrow{IA}}$"], 0, "La translation place le triangle, puis la symétrie d’axe (BC) inverse son orientation.", "Situation complexe • pages 22-23", 2),
      choice("Quelle transformation envoie CIA sur OIJ ?", ["L’homothétie de centre I et de rapport 2", "Une rotation de centre I", "Une translation", "Une symétrie glissée"], 0, "Chaque vecteur issu de I est doublé.", "Situation complexe • pages 22-23"),
      truth("Cette homothétie de rapport 2 est une isométrie.", false, "Elle multiplie toutes les longueurs par 2.", "Situation complexe précisée • pages 22-23"),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCIsometriesPath: LearningPath = {
  id: "terminale-c-math-l14-plane-isometries",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Transformations du plan" },
  chapterNumber: 14,
  title: "Isométries du plan",
  description: "Distances, décompositions, compositions, déplacements, antidéplacements, symétries glissées et détermination d’une isométrie.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître une isométrie et exploiter ses invariants",
    "Décomposer une translation ou une rotation en deux symétries orthogonales",
    "Composer translations, rotations et symétries dans le bon ordre",
    "Distinguer déplacement et antidéplacement",
    "Déterminer une symétrie glissée, son axe et son vecteur",
    "Identifier une isométrie à partir de ses points fixes ou de deux images",
    "Résoudre une configuration de synthèse à l’aide des transformations du plan",
  ],
  modules: [
    {
      id: "terminale-c-math-l14-plane-isometries-mastery",
      title: "Maîtriser les isométries du plan",
      description:
        "Huit niveaux progressifs, " +
        builtLevels.reduce((sum, lesson) => sum + (lesson.questions?.length ?? 0), 0) +
        " réponses évaluables, trois schémas interactifs et les corrections explicites des coquilles du document.",
      lessons: builtLevels,
    },
  ],
};
