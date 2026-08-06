import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths lecon 13 Nombres complexes et géometrie du plan.pdf";

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
      observation: "En géométrie complexe, l’ordre des différences d’affixes fixe le sens des vecteurs et donc le signe de l’angle.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Traduis d’abord la figure en affixes, choisis le quotient adapté, puis interprète séparément son module et son argument.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : module = longueur, argument = direction. Un seul quotient peut donc donner deux informations géométriques.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const quotientInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Laboratoire complexe",
  title: "Un quotient, deux lectures",
  instruction: "Sélectionne une zone pour relier le calcul complexe à la figure.",
  observation: "Le numérateur représente le second vecteur de l’angle ; le dénominateur représente le premier.",
  caption: "Schéma original redessiné à partir des propriétés du cours officiel.",
  viewBox: "0 0 360 240",
  shapes: [
    { shape: "line", x1: 30, y1: 205, x2: 330, y2: 205, tone: "outline" },
    { shape: "line", x1: 65, y1: 225, x2: 65, y2: 25, tone: "outline" },
    { shape: "path", d: "M105 175 L255 175", tone: "accent" },
    { shape: "path", d: "M105 175 L218 72", tone: "soft" },
    { shape: "circle", cx: 105, cy: 175, r: 5, tone: "fill" },
    { shape: "circle", cx: 255, cy: 175, r: 5, tone: "fill" },
    { shape: "circle", cx: 218, cy: 72, r: 5, tone: "fill" },
    { shape: "path", d: "M145 175 A40 40 0 0 0 135 148", tone: "muted" },
    { shape: "text", x: 94, y: 195, content: "A", anchor: "middle" },
    { shape: "text", x: 267, y: 195, content: "B", anchor: "middle" },
    { shape: "text", x: 218, y: 57, content: "C", anchor: "middle" },
    { shape: "text", x: 183, y: 196, content: "AB", anchor: "middle" },
    { shape: "text", x: 153, y: 113, content: "AC", anchor: "middle" },
    { shape: "text", x: 137, y: 157, content: "θ", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "module",
      number: 1,
      label: "Le module",
      detail: "$\\left|\\dfrac{z_C-z_A}{z_B-z_A}\\right|=\\dfrac{AC}{AB}$. Il compare les deux longueurs issues de A.",
      x: 180,
      y: 122,
      highlight: [{ shape: "path", d: "M105 175 L255 175 M105 175 L218 72", tone: "accent" }],
    },
    {
      id: "argument",
      number: 2,
      label: "L’argument",
      detail: "$\\arg\\left(\\dfrac{z_C-z_A}{z_B-z_A}\\right)=\\operatorname{Mes}(\\overrightarrow{AB},\\overrightarrow{AC})$ modulo $2\\pi$.",
      x: 137,
      y: 157,
      highlight: [{ shape: "path", d: "M145 175 A40 40 0 0 0 135 148", tone: "accent" }],
    },
    {
      id: "order",
      number: 3,
      label: "L’ordre des vecteurs",
      detail: "Inverser le quotient inverse le rapport et change le signe de l’angle. Écris toujours l’angle demandé avant le quotient.",
      x: 105,
      y: 175,
      highlight: [{ shape: "circle", cx: 105, cy: 175, r: 11, tone: "accent" }],
    },
  ],
};

const lociInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Carte des lieux",
  title: "Reconnaître le lieu sans calcul inutile",
  instruction: "Sélectionne une figure pour retrouver la condition complexe associée.",
  observation: "Une égalité de distances produit souvent une médiatrice ; un rapport constant différent de 1 produit un cercle d’Apollonius.",
  caption: "Cercle, médiatrice et demi-droite du tableau officiel des lieux géométriques.",
  viewBox: "0 0 390 230",
  shapes: [
    { shape: "circle", cx: 75, cy: 115, r: 48, tone: "soft" },
    { shape: "circle", cx: 75, cy: 115, r: 4, tone: "fill" },
    { shape: "text", x: 75, y: 180, content: "|z-a|=r", anchor: "middle" },
    { shape: "circle", cx: 188, cy: 115, r: 4, tone: "fill" },
    { shape: "circle", cx: 292, cy: 115, r: 4, tone: "fill" },
    { shape: "line", x1: 240, y1: 45, x2: 240, y2: 185, tone: "accent" },
    { shape: "text", x: 240, y: 210, content: "MA=MB", anchor: "middle" },
    { shape: "path", d: "M330 168 L380 76", tone: "soft" },
    { shape: "path", d: "M374 81 L380 76 L379 86 Z", tone: "soft" },
    { shape: "circle", cx: 330, cy: 168, r: 4, tone: "fill" },
    { shape: "text", x: 350, y: 205, content: "arg(z-a)=α", anchor: "middle" },
  ],
  hotspots: [
    { id: "circle", number: 1, label: "Cercle", detail: "$|z-a|=r$ décrit le cercle de centre A d’affixe a et de rayon r.", x: 75, y: 115, highlight: [{ shape: "circle", cx: 75, cy: 115, r: 48, tone: "accent" }] },
    { id: "bisector", number: 2, label: "Médiatrice", detail: "$|z-a|=|z-b|$ signifie MA=MB : M appartient à la médiatrice de [AB].", x: 240, y: 115, highlight: [{ shape: "line", x1: 240, y1: 45, x2: 240, y2: 185, tone: "accent" }] },
    { id: "ray", number: 3, label: "Demi-droite", detail: "$\\arg(z-a)\\equiv\\alpha\ [2\\pi]$ fixe une direction et un sens : c’est une demi-droite privée de A.", x: 350, y: 120, highlight: [{ shape: "path", d: "M330 168 L380 76", tone: "accent" }] },
  ],
};

const similarityInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Construction guidée",
  title: "Tourner puis agrandir",
  instruction: "Sélectionne les étapes de la similitude de centre Ω.",
  observation: "La rotation et l’homothétie de même centre commutent : l’ordre de construction ne change pas le point final.",
  caption: "Décomposition canonique d’une similitude directe.",
  viewBox: "0 0 370 245",
  shapes: [
    { shape: "circle", cx: 85, cy: 180, r: 5, tone: "fill" },
    { shape: "circle", cx: 180, cy: 180, r: 5, tone: "fill" },
    { shape: "circle", cx: 270, cy: 82, r: 5, tone: "fill" },
    { shape: "path", d: "M85 180 L180 180", tone: "muted" },
    { shape: "path", d: "M85 180 L270 82", tone: "accent" },
    { shape: "path", d: "M125 180 A40 40 0 0 0 119 159", tone: "soft" },
    { shape: "text", x: 75, y: 202, content: "Ω", anchor: "middle" },
    { shape: "text", x: 182, y: 202, content: "M", anchor: "middle" },
    { shape: "text", x: 282, y: 78, content: "M'", anchor: "start" },
    { shape: "text", x: 128, y: 170, content: "θ", anchor: "middle" },
    { shape: "text", x: 178, y: 118, content: "× k", anchor: "middle" },
  ],
  hotspots: [
    { id: "center", number: 1, label: "Le centre", detail: "Ω est fixe. Si $a\\ne1$, son affixe est $\\omega=b/(1-a)$.", x: 85, y: 180, highlight: [{ shape: "circle", cx: 85, cy: 180, r: 11, tone: "accent" }] },
    { id: "angle", number: 2, label: "La rotation", detail: "L’angle orienté de la similitude vaut $\\arg(a)$.", x: 128, y: 165, highlight: [{ shape: "path", d: "M125 180 A40 40 0 0 0 119 159", tone: "accent" }] },
    { id: "ratio", number: 3, label: "L’homothétie", detail: "Toutes les longueurs sont multipliées par $k=|a|$.", x: 180, y: 118, highlight: [{ shape: "path", d: "M85 180 L270 82", tone: "accent" }] },
  ],
};

const levels: OfficialLevelSeed[] = [
  {
    id: "complex-angle",
    title: "Quotient complexe et angle orienté",
    summary: "Interpréter l’argument d’un quotient de différences d’affixes comme une mesure d’angle orienté.",
    pages: "2",
    section: "I-1. Interprétation d’un argument",
    durationMinutes: 22,
    body: String.raw`## De la différence d’affixes au vecteur

Si A et B ont pour affixes $z_A$ et $z_B$, alors le vecteur $\overrightarrow{AB}$ a pour affixe

$$
z_B-z_A.
$$

L’ordre est essentiel : $z_A-z_B$ est l’affixe de $\overrightarrow{BA}$.

## Interpréter un quotient

Pour quatre points tels que $A\ne B$ et $C\ne D$,

$$
\arg\left(\frac{z_A-z_B}{z_C-z_D}\right)
\equiv
\operatorname{Mes}(\overrightarrow{DC},\overrightarrow{BA})
\pmod{2\pi}.
$$

En particulier,

$$
\arg\left(\frac{z_C-z_A}{z_B-z_A}\right)
\equiv
\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{AC})
\pmod{2\pi}.
$$

> **À retenir.** Dans le quotient, le vecteur du numérateur est le second vecteur de l’angle, et celui du dénominateur est le premier.

## Exercice officiel guidé

On prend $z_A=-1+i\sqrt3$, $z_B=2$ et $z_C=-1-i\sqrt3$. Alors

$$
\frac{z_A-z_B}{z_C-z_B}
=\frac{-3+i\sqrt3}{-3-i\sqrt3}
=\frac12-\frac{\sqrt3}{2}i
=e^{-i\pi/3}.
$$

La mesure principale de $(\overrightarrow{BC},\overrightarrow{BA})$ est donc $-\pi/3$.

> **Astuce mémoire de Davy.** Écris d’abord l’angle sous la forme $(\text{premier vecteur},\text{second vecteur})$, puis place le second au numérateur.`,
    keyPoint: String.raw`$\arg\left(\dfrac{z_C-z_A}{z_B-z_A}\right)=\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{AC})\ [2\pi]$`,
    example: String.raw`Avec $z_A=-1+i\sqrt3$, $z_B=2$ et $z_C=-1-i\sqrt3$, le quotient $(z_A-z_B)/(z_C-z_B)=e^{-i\pi/3}$ donne l’angle principal $-\pi/3$.`,
    methodSteps: [
      "Vérifie que chaque vecteur utilisé est non nul.",
      "Écris l’affixe du premier puis du second vecteur.",
      "Forme second/premier et simplifie le quotient.",
      "Lis son argument et ramène-le dans ]−π,π] si une mesure principale est demandée.",
    ],
    timeline: [
      { label: "Vecteurs", detail: "AB a pour affixe zB−zA." },
      { label: "Quotient", detail: "Pour l’angle (AB,AC), calcule (zC−zA)/(zB−zA)." },
      { label: "Argument", detail: "L’argument du quotient est la mesure orientée cherchée." },
      { label: "Principale", detail: "Choisis la représentante appartenant à ]−π,π]." },
    ],
    interaction: quotientInteraction,
    corrections: [
      "Le document est titré « Leçon 08 » sur sa première page alors que le référentiel du projet et le fichier officiel le classent comme leçon 13 ; le contenu est conservé sous la leçon 13.",
    ],
    questions: [
      choice(String.raw`Quelle est l’affixe de $\overrightarrow{AB}$ ?`, [String.raw`$z_B-z_A$`, String.raw`$z_A-z_B$`, String.raw`$z_A+z_B$`, String.raw`$z_Az_B$`], 0, "La différence arrivée moins départ représente le vecteur.", "Propriété • page 2"),
      choice(String.raw`Que représente $\arg((z_C-z_A)/(z_B-z_A))$ ?`, [String.raw`$\operatorname{Mes}(\overrightarrow{AB},\overrightarrow{AC})$`, String.raw`$AB/AC$`, String.raw`$\operatorname{Mes}(\overrightarrow{AC},\overrightarrow{AB})$`, String.raw`$AC-AB$`], 0, "Le dénominateur fournit le premier vecteur de l’angle.", "Propriété • page 2", 2),
      truth(String.raw`Inverser le quotient change le signe de l’angle orienté.`, true, String.raw`$\arg(1/q)=-\arg(q)$ modulo $2\pi$.`, "Conséquence de la propriété • page 2"),
      choice(String.raw`Dans l’exercice, que vaut $(z_A-z_B)/(z_C-z_B)$ ?`, [String.raw`$\frac12-\frac{\sqrt3}{2}i$`, String.raw`$\frac12+\frac{\sqrt3}{2}i$`, String.raw`$-1$`, String.raw`$i$`], 0, "Le quotient se simplifie en la forme trigonométrique d’angle −π/3.", "Exercice de fixation • page 2", 2),
      short(String.raw`Donne la mesure principale de $(\overrightarrow{BC},\overrightarrow{BA})$.`, ["-π/3", "-pi/3", "−π/3", "-60°", "-60"], "L’argument principal de e^(−iπ/3) est −π/3.", "Exercice de fixation • page 2", 2),
      choice(String.raw`Si un quotient a pour argument $3\pi/2$, quelle est sa mesure principale ?`, [String.raw`$-\pi/2$`, String.raw`$3\pi/2$`, String.raw`$\pi/2$`, String.raw`$-3\pi/2$`], 0, "On retranche 2π pour entrer dans ]−π,π].", "Application directe • page 2"),
      truth(String.raw`Le quotient $(z_A-z_B)/(z_C-z_D)$ existe sans condition sur les points.`, false, "Il faut au minimum C≠D pour que le dénominateur soit non nul ; le cours suppose aussi A≠B pour parler de deux directions.", "Propriété • page 2"),
      choice(String.raw`Si $q=e^{i\pi}$, les deux directions comparées sont :`, ["Opposées ou parallèles", "Perpendiculaires", "Confondues avec même sens uniquement", "Sans relation"], 0, "Un angle π caractérise des directions parallèles de sens opposés.", "Interprétation • page 2"),
    ],
  },
  {
    id: "complex-distance-ratio",
    title: "Module d’un quotient et rapport de distances",
    summary: "Transformer le module d’un quotient complexe en rapport de longueurs et reconnaître des côtés égaux.",
    pages: "3",
    section: "I-2. Interprétation d’un module",
    durationMinutes: 20,
    body: String.raw`## Le module mesure une longueur

Pour deux points A et B,

$$AB=|z_B-z_A|.$$

Ainsi, si $C\ne D$,

$$
\left|\frac{z_A-z_B}{z_C-z_D}\right|
=\frac{|z_A-z_B|}{|z_C-z_D|}
=\frac{AB}{CD}.
$$

## Trois conclusions immédiates

| Valeur du module | Conclusion géométrique |
|---|---|
| $1$ | les deux longueurs sont égales |
| $k>1$ | la longueur du numérateur est $k$ fois plus grande |
| $0<k<1$ | la longueur du numérateur est plus petite |

## Exercice officiel

Pour $z_A=-1+i\sqrt3$, $z_B=2$ et $z_C=-1-i\sqrt3$,

$$
\frac{z_A-z_B}{z_C-z_B}=e^{-i\pi/3}.
$$

Son module vaut 1. Or

$$
\left|\frac{z_A-z_B}{z_C-z_B}\right|=\frac{AB}{CB}.
$$

Donc $AB=BC$ : le triangle ABC est isocèle en B.

> **Astuce mémoire de Davy.** Les barres de module transforment automatiquement les différences d’affixes en distances.`,
    keyPoint: String.raw`$\left|\dfrac{z_A-z_B}{z_C-z_D}\right|=\dfrac{AB}{CD}$`,
    example: String.raw`Si $|(z_C-z_A)/(z_B-z_A)|=2$, alors $AC=2AB$.`,
    methodSteps: [
      "Vérifie que le segment placé au dénominateur n’est pas nul.",
      "Associe chaque différence d’affixes au segment correspondant.",
      "Utilise |u/v|=|u|/|v|.",
      "Traduis la valeur obtenue en égalité ou rapport de longueurs.",
    ],
    timeline: [
      { label: "Différences", detail: "|zB−zA|=AB." },
      { label: "Quotient", detail: "Le module d’un quotient devient un quotient de modules." },
      { label: "Rapport", detail: "On obtient une comparaison exacte de distances." },
      { label: "Figure", detail: "Rapport 1 signifie longueurs égales." },
    ],
    interaction: quotientInteraction,
    questions: [
      choice(String.raw`Que vaut $|z_B-z_A|$ ?`, ["AB", "OA+OB", "AB²", "1/AB"], 0, "Le module de la différence est la distance AB.", "Propriété • page 3"),
      choice(String.raw`Que vaut $|(z_A-z_B)/(z_C-z_D)|$ ?`, ["AB/CD", "AC/BD", "AB×CD", "CD/AB"], 0, "Le numérateur représente AB et le dénominateur CD.", "Propriété • page 3", 2),
      truth(String.raw`Si le module du quotient vaut $1$, les longueurs correspondantes sont égales.`, true, "Un rapport positif égal à 1 impose l’égalité.", "Conséquence • page 3"),
      choice(String.raw`Dans l’exercice officiel, $|(z_A-z_B)/(z_C-z_B)|$ représente :`, ["AB/CB", "AC/AB", "BC/AB", "OA/OC"], 0, "Les différences ont les extrémités A,B puis C,B.", "Exercice de fixation • page 3"),
      short("Quel est le module de $e^{-i\pi/3}$ ?", ["1", "+1"], "Tout complexe de la forme e^(iθ) a pour module 1.", "Exercice de fixation • page 3"),
      choice("Quelle conclusion donne ce module dans l’exercice ?", ["AB=BC", "AB=AC", "AC=BC", "A,B,C alignés"], 0, "Le rapport AB/CB vaut 1.", "Exercice de fixation • page 3", 2),
      choice(String.raw`Si $|(z_C-z_A)/(z_B-z_A)|=3/2$, alors :`, ["AC=3AB/2", "AB=3AC/2", "AC=AB", "AC=3+AB/2"], 0, "Le module est précisément AC/AB.", "Application • page 3"),
      truth(String.raw`Le module seul permet toujours de connaître l’orientation de l’angle.`, false, "Le module donne des longueurs ; l’argument donne l’orientation.", "Synthèse • page 3"),
    ],
  },
  {
    id: "complex-loci",
    title: "Lieux géométriques complexes",
    summary: "Reconnaître cercle, médiatrice, droite, demi-droite, cercle de diamètre et cercle d’Apollonius.",
    pages: "3-4 et 23-24",
    section: "I-3. Ensembles de points",
    durationMinutes: 32,
    body: String.raw`## Traduire avant de calculer

Quand M a pour affixe z, l’expression $|z-z_A|$ est la distance MA et $\arg(z-z_A)$ donne la direction de $\overrightarrow{AM}$.

| Condition complexe | Lieu de M |
|---|---|
| $|z-z_A|=r$, $r>0$ | cercle de centre A et de rayon r |
| $|z-z_A|=|z-z_B|$ | médiatrice de [AB] |
| $|z-z_A|=\lambda|z-z_B|$, $\lambda\ne1$ | cercle d’Apollonius |
| $\arg((z_B-z)/(z_A-z))\equiv0\ [\pi]$ | droite (AB), sans A ni B |
| $\arg((z_B-z)/(z_A-z))\equiv\pi/2\ [\pi]$ | cercle de diamètre [AB], sans A ni B |
| $\arg(z-z_A)\equiv\alpha\ [\pi]$ | droite par A de direction $\alpha$, sans A |
| $\arg(z-z_A)\equiv\alpha\ [2\pi]$ | demi-droite issue de A de direction $\alpha$, sans A |

> **Attention.** Le modulo $\pi$ oublie le sens et donne une droite ; le modulo $2\pi$ conserve le sens et donne une demi-droite.

## Cercle d’Apollonius officiel

Résolvons

$$|2iz-3+2i|=|z-2|.$$

Comme $|2i|=2$,

$$2|z-(-1-\tfrac32 i)|=|z-2|.$$

C’est un cercle d’Apollonius. Le calcul barycentrique du document conduit au cercle de diamètre [HK], avec

$$z_H=-1,\qquad z_K=-4-3i.$$

## Trois lieux de renforcement

- $|z-1+i|=2$ : cercle de centre $1-i$, rayon 2 ;
- $|z-1+i|=|z+1+3i|$ : médiatrice des points d’affixes $1-i$ et $-1-3i$ ;
- $\arg(z-1-i)\equiv\pi/6\ [2\pi]$ : demi-droite issue du point d’affixe $1+i$.

> **Astuce mémoire de Davy.** Module fixe → cercle ; deux modules égaux → médiatrice ; argument modulo π → droite ; argument modulo 2π → demi-droite.`,
    keyPoint: String.raw`$|z-a|=r\Longleftrightarrow M\in\mathcal C(A,r)$`,
    example: String.raw`$|z-(1-i)|=|z-(-1-3i)|$ décrit la médiatrice du segment joignant les points d’affixes $1-i$ et $-1-3i$.`,
    methodSteps: [
      "Réécris chaque expression sous la forme z−a.",
      "Traduis les modules en distances et les arguments en directions.",
      "Observe s’il s’agit d’une distance fixe, de deux distances égales ou d’un rapport constant.",
      "Retire les points qui annulent un dénominateur et précise droite ou demi-droite.",
    ],
    timeline: [
      { label: "Centre", detail: "Dans |z−a|, a est l’affixe du centre." },
      { label: "Distance", detail: "Une valeur fixe r donne un cercle." },
      { label: "Comparaison", detail: "MA=MB donne la médiatrice ; MA=λMB donne Apollonius." },
      { label: "Direction", detail: "Modulo π : droite ; modulo 2π : demi-droite." },
    ],
    interaction: lociInteraction,
    corrections: [
      "Page 4 : la dernière caractérisation du tableau répète α+kπ, ce qui décrit une droite. Pour obtenir la demi-droite annoncée, il faut arg(z−zA)≡α [2π], soit α+2kπ.",
    ],
    questions: [
      choice(String.raw`Quel lieu vérifie $|z-z_A|=r$ avec $r>0$ ?`, ["Le cercle de centre A et de rayon r", "La droite (OA)", "La médiatrice de [OA]", "Un seul point"], 0, "C’est la définition complexe d’un cercle.", "Tableau • pages 3-4"),
      choice(String.raw`Quel lieu vérifie $|z-z_A|=|z-z_B|$ ?`, ["La médiatrice de [AB]", "Le cercle de diamètre [AB]", "La droite (AB)", "La demi-droite [AB)"], 0, "MA=MB caractérise la médiatrice.", "Tableau • pages 3-4"),
      choice(String.raw`Pour $\lambda\ne1$, $|z-z_A|=\lambda|z-z_B|$ décrit :`, ["Un cercle d’Apollonius", "Toujours une droite", "Une parabole", "Un segment"], 0, "Le rapport de deux distances à deux points fixes est constant.", "Tableau • page 4"),
      choice(String.raw`La condition $\arg((z_B-z)/(z_A-z))\equiv\pi/2\ [\pi]$ décrit :`, ["Le cercle de diamètre [AB] privé de A et B", "La médiatrice de [AB]", "La droite (AB)", "Le disque de diamètre [AB]"], 0, "L’angle AMB est droit : théorème du cercle de diamètre.", "Tableau • page 4", 2),
      choice(String.raw`La condition $\arg(z-z_A)\equiv\alpha\ [2\pi]$ décrit :`, ["Une demi-droite issue de A, privée de A", "Une droite entière", "Un cercle", "Un point"], 0, "Le modulo 2π conserve le sens de la direction.", "Tableau corrigé • page 4", 2),
      choice("Dans l’exercice d’association, quelle correspondance est correcte ?", ["A→4, B→5, C→6, D→1, E→2, F→3", "A→1, B→2, C→3, D→4, E→5, F→6", "A→4, B→6, C→5, D→2, E→1, F→3", "A→5, B→4, C→6, D→1, E→3, F→2"], 0, "C’est l’association obtenue en traduisant successivement module et argument.", "Exercice de fixation • page 4", 3),
      choice(String.raw`Quelle réécriture de $|2iz-3+2i|$ est correcte ?`, [String.raw`$2|z+1+\frac32i|$`, String.raw`$|z+1+\frac32i|$`, String.raw`$2|z-1-\frac32i|$`, String.raw`$|2z-3+2i|$`], 0, String.raw`$2iz-3+2i=2i(z+1+\frac32i)$ et $|2i|=2$.`, "Exercice d’Apollonius • page 4", 3),
      choice("Quelles sont les affixes des extrémités du diamètre obtenu ?", [String.raw`$z_H=-1$ et $z_K=-4-3i$`, String.raw`$z_H=1$ et $z_K=4+3i$`, String.raw`$z_H=2$ et $z_K=-1$`, String.raw`$z_H=-1-i$ et $z_K=-4$`], 0, "Ce sont les deux barycentres calculés dans la solution officielle.", "Exercice d’Apollonius • page 4", 3),
      choice(String.raw`Quel est le centre du lieu $|z-1+i|=2$ ?`, [String.raw`$1-i$`, String.raw`$1+i$`, String.raw`$-1+i$`, String.raw`$-1-i$`], 0, String.raw`$z-1+i=z-(1-i)$.`, "Exercice de renforcement 3 • page 23"),
      short(String.raw`Quel est le rayon du lieu $|z-1+i|=2$ ?`, ["2", "+2"], "La constante positive à droite est le rayon.", "Exercice de renforcement 3 • page 23"),
      choice(String.raw`Quel lieu vérifie $|z-1+i|=|z+1+3i|$ ?`, ["La médiatrice des points d’affixes 1−i et −1−3i", "Le cercle de centre 1−i", "La droite des réels", "Une demi-droite"], 0, "Les deux modules sont les distances à deux points fixes.", "Exercice de renforcement 3 • page 24", 2),
      truth(String.raw`La condition $\arg(z-1-i)\equiv\pi/6\ [2\pi]$ contient le point d’affixe $1+i$.`, false, "Au point A, z−zA=0 et l’argument de 0 n’existe pas ; A est exclu.", "Exercice de renforcement 3 • page 24", 2),
    ],
  },
  {
    id: "complex-align-orthogonal",
    title: "Alignement, parallélisme et orthogonalité",
    summary: "Reconnaître directions parallèles ou perpendiculaires grâce au caractère réel ou imaginaire pur d’un quotient.",
    pages: "5-7 et 10-11",
    section: "II-1 à II-3. Configurations",
    durationMinutes: 30,
    body: String.raw`## Le test du quotient

Soient deux vecteurs non nuls d’affixes u et v.

| Nature de $u/v$ | Interprétation |
|---|---|
| réel non nul | directions parallèles |
| imaginaire pur non nul | directions perpendiculaires |

Ainsi,

$$
A,B,C\text{ alignés}
\Longleftrightarrow
\frac{z_C-z_A}{z_B-z_A}\in\mathbb R.
$$

Et pour quatre points adaptés,

$$
(AB)\perp(CD)
\Longleftrightarrow
\frac{z_D-z_C}{z_B-z_A}\in i\mathbb R^*.
$$

## Parallélisme officiel

Avec $z_A=5+i$, $z_B=-2$, $z_C=1+i$ et $z_D=-4-2i$,

$$
\frac{z_D-z_A}{z_C-z_B}
=\frac{-9-3i}{3+i}=-3\in\mathbb R^*.
$$

Donc $(AD)\parallel(BC)$.

## Alignement officiel

Avec $z_A=2+i\sqrt3$, $z_B=-1$ et $z_C=11+4i\sqrt3$,

$$
\frac{z_A-z_B}{z_C-z_B}=\frac14\in\mathbb R^*.
$$

Donc A, B et C sont alignés.

## Perpendicularité officielle

Pour $z_A=-3-i$, $z_B=-2+4i$, $z_C=3-i$ et $z_H=-2$,

$$
\frac{z_B-z_C}{z_H-z_A}=5i\in i\mathbb R^*.
$$

Donc $(AH)\perp(BC)$.

> **Astuce mémoire de Davy.** Réel = même axe ; imaginaire pur = quart de tour.`,
    keyPoint: String.raw`$q\in\mathbb R^*\Rightarrow\parallel\qquad q\in i\mathbb R^*\Rightarrow\perp$`,
    example: String.raw`Le quotient $(z_D-z_C)/(z_K-z_O)=i$ prouve directement que $(CD)\perp(OK)$.`,
    methodSteps: [
      "Choisis deux vecteurs directeurs des droites étudiées.",
      "Vérifie qu’ils sont non nuls.",
      "Calcule le quotient de leurs affixes.",
      "Conclue : réel non nul pour parallèle, imaginaire pur non nul pour perpendiculaire.",
    ],
    timeline: [
      { label: "Directions", detail: "Choisis un vecteur directeur sur chaque droite." },
      { label: "Non-zéro", detail: "Contrôle que le dénominateur ne s’annule pas." },
      { label: "Nature", detail: "Simplifie le quotient et regarde s’il est réel ou imaginaire pur." },
      { label: "Conclusion", detail: "Réel : parallèle ; imaginaire pur : perpendiculaire." },
    ],
    corrections: [
      "Page 5 : la justification de l’existence du quotient cite A≠B et D≠C, alors que le quotient calculé est (zD−zA)/(zC−zB). Les conditions pertinentes sont D≠A et C≠B.",
    ],
    questions: [
      choice(String.raw`Si $(z_D-z_C)/(z_B-z_A)\in\mathbb R^*$, alors :`, ["(AB) et (CD) sont parallèles", "(AB) et (CD) sont perpendiculaires", "A,B,C,D sont toujours cocycliques", "AB=CD"], 0, "Un quotient réel non nul signifie que les directions sont colinéaires.", "Propriété • page 5"),
      choice(String.raw`Si $(z_C-z_A)/(z_B-z_A)\in\mathbb R$, alors :`, ["A, B et C sont alignés", "ABC est rectangle", "AB=AC", "A et B sont confondus"], 0, "Les vecteurs AB et AC sont colinéaires.", "Propriété • pages 5-6"),
      choice(String.raw`Si $(z_D-z_C)/(z_B-z_A)\in i\mathbb R^*$, alors :`, ["(AB)⊥(CD)", "(AB)∥(CD)", "AB=CD", "A=B"], 0, "Un imaginaire pur non nul a un argument ±π/2.", "Propriété • page 6"),
      short(String.raw`Calcule $(z_D-z_A)/(z_C-z_B)$ pour $z_A=5+i$, $z_B=-2$, $z_C=1+i$, $z_D=-4-2i$.`, ["-3", "−3"], "Le numérateur est −9−3i=−3(3+i) et le dénominateur 3+i.", "Exercice de fixation • page 5", 3),
      choice("Quelle conclusion en découle ?", ["(AD)∥(BC)", "(AD)⊥(BC)", "A,D,B,C cocycliques", "AD=BC"], 0, "Le quotient directeur vaut le réel non nul −3.", "Exercice de fixation • page 5", 2),
      short(String.raw`Que vaut $(z_A-z_B)/(z_C-z_B)$ dans l’exercice d’alignement ?`, ["1/4", "0.25", "¼"], "La factorisation donne (3+i√3)/(4(3+i√3))=1/4.", "Exercice de fixation • page 6", 2),
      choice("Que prouve la valeur 1/4 ?", ["A, B et C sont alignés", "ABC est rectangle", "A est le milieu de [BC]", "AB=BC"], 0, "Le quotient est réel.", "Exercice de fixation • page 6"),
      short(String.raw`Calcule $(z_B-z_C)/(z_H-z_A)$ dans l’exercice de perpendicularité.`, ["5i", "+5i"], "(−5+5i)/(1+i)=5i.", "Exercice de fixation • pages 6-7", 3),
      choice("Que prouve la valeur 5i ?", ["(AH)⊥(BC)", "(AH)∥(BC)", "AH=BC", "A,H,B,C alignés"], 0, "5i est un imaginaire pur non nul.", "Exercice de fixation • page 7", 2),
      short(String.raw`Dans l’exercice de synthèse, que vaut $(z_D-z_C)/(z_B-z_A)$ ?`, ["-2", "−2"], "Le quotient vaut 4i/(−2i)=−2.", "Exercice de fixation • pages 10-11", 2),
      short(String.raw`Dans le même exercice, que vaut $(z_D-z_C)/(z_K-z_O)$ ?`, ["i", "+i", "1i"], "Le quotient vaut 4i/4=i.", "Exercice de fixation • page 11", 2),
    ],
  },
  {
    id: "complex-cyclic-triangles",
    title: "Cocyclicité et triangles particuliers",
    summary: "Caractériser points cocycliques, triangles rectangles, isocèles, rectangles isocèles et équilatéraux.",
    pages: "7-10 et 22-27",
    section: "II-4 et II-5. Figures particulières",
    durationMinutes: 38,
    kind: "challenge",
    body: String.raw`## Quatre points cocycliques

Pour quatre points deux à deux distincts et non alignés, la cocyclicité revient à comparer deux angles inscrits. Une forme pratique est

$$
\frac{z_C-z_A}{z_D-z_A}
\div
\frac{z_C-z_B}{z_D-z_B}
\in\mathbb R^*.
$$

Dans l’exercice officiel avec

$$z_A=-2i,\quad z_B=7-i,\quad z_C=8+2i,\quad z_D=-1+5i,$$

le quotient de quotients vaut $-1/3$, donc A, B, C et D sont cocycliques.

## Triangles particuliers

Posons

$$q=\frac{z_C-z_A}{z_B-z_A}.$$

| Triangle ABC | Condition sur q |
|---|---|
| rectangle en A | $q\in i\mathbb R^*$ |
| isocèle en A | $|q|=1$ |
| rectangle isocèle en A | $q=i$ ou $q=-i$ |
| équilatéral | $q=e^{i\pi/3}$ ou $q=e^{-i\pi/3}$ |

Les exercices du cours donnent successivement un triangle rectangle en B, un triangle rectangle isocèle en B et un triangle équilatéral.

## Exercice d’approfondissement : cercle puis triangle

L’équation $z^2-2z+2=0$ a pour solutions $1+i$ et $1-i$. Après la substitution $Z=-iz+3i+3$, on obtient aussi les points d’affixes $2-2i$ et $4-2i$.

Les points A$(1+i)$, B$(1-i)$ et C$(2-2i)$ appartiennent au cercle de centre I d’affixe 3 et de rayon $\sqrt5$. De plus,

$$
\frac{z_C-3}{z_A-3}=i,
$$

donc le triangle IAC est rectangle isocèle en I.

## Une affirmation à réfuter

Pour $2z^2+2z+1=0$, la solution de partie imaginaire positive est

$$a=-\frac12+\frac12i.$$

Or

$$
\frac{a^3-a}{a^2-a}=a+1=\frac12+\frac12i.
$$

Ce nombre n’a pas pour module 1 : les points d’affixes $a,a^2,a^3$ ne forment donc pas un triangle équilatéral.

> **Astuce mémoire de Davy.** Rectangle → argument ±π/2 ; isocèle → module 1 ; équilatéral → les deux à la fois avec angle ±π/3.`,
    keyPoint: String.raw`$q=\pm i\Longleftrightarrow\text{triangle rectangle isocèle au sommet commun}$`,
    example: String.raw`Si $(z_C-z_A)/(z_B-z_A)=e^{i\pi/3}$, alors AB=AC et l’angle BAC vaut $\pi/3$ : ABC est équilatéral.`,
    methodSteps: [
      "Repère le sommet commun aux deux côtés à comparer.",
      "Forme le quotient des affixes des deux vecteurs issus de ce sommet.",
      "Lis le module pour comparer les longueurs.",
      "Lis l’argument pour reconnaître l’angle, puis combine les deux informations.",
    ],
    timeline: [
      { label: "Sommet", detail: "Les deux différences doivent partir du même point." },
      { label: "Module", detail: "Module 1 : côtés égaux." },
      { label: "Argument", detail: "±π/2 : angle droit ; ±π/3 : angle de 60°." },
      { label: "Nature", detail: "Combine longueur et angle pour nommer le triangle." },
    ],
    interaction: quotientInteraction,
    corrections: [
      "Page 26 : le quotient (zB−zA)/(zC−zA)=1/2−i/2 a pour argument −π/4, et non π/4. Son double vaut −π/2 ; la conclusion de perpendicularité reste correcte.",
    ],
    questions: [
      choice("Quel type de nombre doit être le quotient de quotients pour prouver la cocyclicité ?", ["Un réel non nul", "Un imaginaire pur", "Un entier positif uniquement", "Zéro"], 0, "Deux angles orientés sont égaux modulo π lorsque leur quotient est réel non nul.", "Propriété • page 7"),
      short("Que vaut le quotient de quotients de l’exercice de cocyclicité ?", ["-1/3", "−1/3"], "Le calcul officiel aboutit à −1/3, réel non nul.", "Exercice de fixation • pages 7-8", 3),
      choice("Quelle conclusion en découle ?", ["A, B, C et D sont cocycliques", "A, B, C et D sont alignés", "ABCD est un carré", "AB=CD"], 0, "Le critère de cocyclicité est satisfait.", "Exercice de fixation • page 8"),
      choice(String.raw`Si $(z_C-z_A)/(z_B-z_A)\in i\mathbb R^*$, ABC est :`, ["Rectangle en A", "Isocèle en A", "Équilatéral", "Aligné"], 0, "L’argument vaut ±π/2.", "Propriété • page 8"),
      choice(String.raw`Si $|(z_C-z_A)/(z_B-z_A)|=1$, ABC est :`, ["Isocèle en A", "Rectangle en A", "Toujours équilatéral", "Aligné"], 0, "AC/AB=1.", "Propriété • page 8"),
      choice(String.raw`Si $(z_C-z_A)/(z_B-z_A)=i$, ABC est :`, ["Rectangle isocèle en A", "Équilatéral", "Seulement isocèle", "Plat"], 0, "Le module vaut 1 et l’argument π/2.", "Propriété • page 8", 2),
      choice(String.raw`Dans l’exercice 2, que vaut $(z_A-z_B)/(z_C-z_B)$ ?`, ["i", "−i", "1", String.raw`$e^{i\pi/3}$`], 0, "Le calcul donne exactement i.", "Exercice de fixation 2 • pages 8-9", 2),
      choice("Quelle est alors la nature du triangle ?", ["Rectangle isocèle en B", "Rectangle en A", "Équilatéral", "Isocèle en C"], 0, "Les deux vecteurs comparés partent de B.", "Exercice de fixation 2 • page 9"),
      choice(String.raw`Dans l’exercice 3, le quotient obtenu est :`, [String.raw`$e^{-i\pi/3}$`, String.raw`$e^{i\pi/2}$`, "$2$", "$-1$"], 0, "Son module vaut 1 et son argument −π/3.", "Exercice de fixation 3 • page 9", 2),
      choice("Quelle est la nature du triangle de l’exercice 3 ?", ["Équilatéral", "Rectangle", "Isocèle rectangle", "Quelconque"], 0, "Deux côtés égaux forment un angle de 60°.", "Exercice de fixation 3 • pages 9-10"),
      choice(String.raw`Quelles sont les solutions de $z^2-2z+2=0$ ?`, [String.raw`$1+i$ et $1-i$`, String.raw`$-1+i$ et $-1-i$`, "$1$ et $2$", String.raw`$i$ et $-i$`], 0, String.raw`$(z-1)^2=-1$.`, "Exercice d’approfondissement 4 • page 25", 2),
      choice("Quel est le centre du cercle passant par A, B et C dans cet exercice ?", ["Le point d’affixe 3", "L’origine", "Le point d’affixe 1", "Le point d’affixe i"], 0, "Les trois distances à l’affixe 3 valent √5.", "Exercice d’approfondissement 4 • page 25", 2),
      short("Quel est le rayon de ce cercle ?", ["√5", "sqrt(5)", "racine de 5"], "IA=IB=IC=√5.", "Exercice d’approfondissement 4 • page 25", 2),
      choice(String.raw`Que prouve $(z_C-3)/(z_A-3)=i$ ?`, ["IAC est rectangle isocèle en I", "I,A,C sont alignés", "IA=2IC", "IAC est équilatéral"], 0, "Le quotient i code une égalité de longueurs et un angle droit.", "Exercice d’approfondissement 4 • page 25", 2),
      choice(String.raw`Quelle est la solution de partie imaginaire positive de $2z^2+2z+1=0$ ?`, [String.raw`$-\frac12+\frac12i$`, String.raw`$\frac12+\frac12i$`, String.raw`$-1+i$`, "$i$"], 0, "Le discriminant vaut −4.", "Exercice 5 • page 27", 2),
      truth("Les points d’affixes a, a² et a³ sont équilatéraux.", false, String.raw`Le quotient $a+1=(1+i)/2$ n’a pas le module 1.`, "Exercice 5 • page 27", 3),
    ],
  },
  {
    id: "complex-transformation",
    title: "Écriture complexe des transformations usuelles",
    summary: "Écrire symétries, translation, homothétie et rotation, puis calculer l’image ou l’antécédent d’un point.",
    pages: "11-14 et 22-23",
    section: "III-1 à III-3. Transformations du plan",
    durationMinutes: 34,
    body: String.raw`## De la transformation ponctuelle à l’écriture complexe

Une transformation du plan associe à tout point M d’affixe z un point M' d’affixe z'. Sa formule complexe permet de calculer directement images et antécédents.

## Symétries dans le repère

| Transformation | Écriture complexe |
|---|---|
| symétrie d’axe (OI) | $z'=\overline z$ |
| symétrie d’axe (OJ) | $z'=-\overline z$ |
| symétrie centrale de centre $\Omega(\omega)$ | $z'=2\omega-z$ |

## Translation

La translation de vecteur d’affixe b vérifie

$$z'=z+b.$$

Pour $b=1-2i$, l’image de $A(3-i)$ est $A'(4-3i)$ et celle de $B(5)$ est $B'(6-2i)$.

## Homothétie

L’homothétie de centre $\Omega(\omega)$ et de rapport réel $k\ne0$ vérifie

$$z'=k(z-\omega)+\omega.$$

Pour le centre d’affixe $-2+i$ et le rapport 3,

$$z'=3z+4-2i.$$

## Rotation

La rotation de centre $\Omega(\omega)$ et d’angle $\theta$ vérifie

$$z'=e^{i\theta}(z-\omega)+\omega.$$

Pour $\omega=i\sqrt3$ et $\theta=\pi/3$,

$$z'=e^{i\pi/3}(z-i\sqrt3)+i\sqrt3.$$

> **Astuce mémoire de Davy.** Centre Ω : fais d’abord $z-\omega$, applique le facteur, puis remets $+\omega$.`,
    keyPoint: String.raw`$z'=z+b\quad ;\quad z'=k(z-\omega)+\omega\quad ;\quad z'=e^{i\theta}(z-\omega)+\omega$`,
    example: String.raw`La translation de vecteur $1-2i$ envoie $3-i$ sur $(3-i)+(1-2i)=4-3i$.`,
    methodSteps: [
      "Identifie la nature de la transformation et ses paramètres.",
      "Choisis la formule correspondante.",
      "Remplace z par l’affixe du point pour calculer une image.",
      "Pour un antécédent, pose l’affixe image puis résous l’équation en z.",
    ],
    timeline: [
      { label: "Translation", detail: "Ajoute l’affixe du vecteur : z'=z+b." },
      { label: "Homothétie", detail: "Multiplie z−ω par le rapport réel k." },
      { label: "Rotation", detail: "Multiplie z−ω par e^(iθ)." },
      { label: "Contrôle", detail: "Le centre doit rester fixe pour homothétie et rotation." },
    ],
    corrections: [
      "Page 13 : « rotation de centre de centre Ω » est une répétition typographique ; il faut lire « rotation de centre Ω ».",
    ],
    questions: [
      choice("Quelle est l’écriture de la symétrie d’axe (OI) ?", [String.raw`$z'=\overline z$`, String.raw`$z'=-\overline z$`, String.raw`$z'=-z$`, String.raw`$z'=z+i$`], 0, "La partie réelle reste inchangée et la partie imaginaire change de signe.", "Tableau • pages 11-14"),
      choice("Quelle est l’écriture de la symétrie d’axe (OJ) ?", [String.raw`$z'=-\overline z$`, String.raw`$z'=\overline z$`, String.raw`$z'=-z$`, String.raw`$z'=iz$`], 0, "La partie réelle change de signe, la partie imaginaire reste inchangée.", "Tableau • pages 11-14"),
      choice(String.raw`Quelle est l’écriture de la translation de vecteur $1-2i$ ?`, [String.raw`$z'=z+1-2i$`, String.raw`$z'=z-1+2i$`, String.raw`$z'=(1-2i)z$`, String.raw`$z'=2z+1-i$`], 0, "Une translation ajoute l’affixe du vecteur.", "Exercice • page 12"),
      short(String.raw`Quelle est l’affixe de l’image de $A(3-i)$ par cette translation ?`, ["4-3i", "4 − 3i", "4-3*i"], "(3−i)+(1−2i)=4−3i.", "Exercice • page 12", 2),
      short(String.raw`Quelle est l’affixe de l’image de $B(5)$ ?`, ["6-2i", "6 − 2i", "6-2*i"], "5+(1−2i)=6−2i.", "Exercice • page 12", 2),
      choice(String.raw`Quelle formule décrit l’homothétie de centre $\omega$ et de rapport k ?`, [String.raw`$z'=k(z-\omega)+\omega$`, String.raw`$z'=z+k+\omega$`, String.raw`$z'=e^{ik}z$`, String.raw`$z'=kz-\omega$`], 0, "Le centre reste fixe et le vecteur ΩM est multiplié par k.", "Cours • page 12"),
      choice(String.raw`L’homothétie de centre $-2+i$ et de rapport 3 s’écrit :`, [String.raw`$z'=3z+4-2i$`, String.raw`$z'=3z-2+i$`, String.raw`$z'=3z-4+2i$`, String.raw`$z'=z+3$`], 0, String.raw`$3(z+2-i)-2+i=3z+4-2i$.`, "Exercice de fixation • page 14", 3),
      choice(String.raw`Quelle formule décrit la rotation de centre $\omega$ et d’angle θ ?`, [String.raw`$z'=e^{i\theta}(z-\omega)+\omega$`, String.raw`$z'=\theta z+\omega$`, String.raw`$z'=z+e^{i\theta}$`, String.raw`$z'=|\theta|z$`], 0, "Le facteur e^(iθ) conserve la longueur et ajoute l’angle θ.", "Cours • page 13"),
      choice(String.raw`La rotation de centre $i\sqrt3$ et d’angle $\pi/3$ s’écrit :`, [String.raw`$z'=e^{i\pi/3}(z-i\sqrt3)+i\sqrt3$`, String.raw`$z'=e^{-i\pi/3}z+i\sqrt3$`, String.raw`$z'=\frac\pi3(z-i\sqrt3)$`, String.raw`$z'=z+i\sqrt3$`], 0, "On applique directement la formule centrée.", "Exercice • page 13", 2),
      choice(String.raw`Quelle est l’écriture de la translation de vecteur $1+4i$ ?`, [String.raw`$z'=z+1+4i$`, String.raw`$z'=z-1-4i$`, String.raw`$z'=(1+4i)z$`, String.raw`$z'=4z+i$`], 0, "On ajoute l’affixe du vecteur.", "Exercice de renforcement 2 • page 23"),
    ],
  },
  {
    id: "similarity-elements",
    title: "Reconnaître et caractériser une similitude directe",
    summary: "Lire la nature, le centre, le rapport et l’angle d’une application z'=az+b.",
    pages: "15-17 et 22",
    section: "III-4. Similitudes directes",
    durationMinutes: 34,
    body: String.raw`## Forme générale

Une similitude directe a pour écriture

$$z'=az+b,\qquad a\in\mathbb C^*,\ b\in\mathbb C.$$

Si $a=1$, c’est la translation de vecteur d’affixe b. Si $a\ne1$, elle possède un centre unique, point fixe d’affixe

$$
\omega=\frac{b}{1-a}.
$$

Son rapport est $k=|a|$ et son angle est $\theta=\arg(a)$.

## Arbre de reconnaissance

| Condition sur a | Nature |
|---|---|
| $a=1$ | translation |
| $a\in\mathbb R^*\setminus\{1\}$ | homothétie de rapport a |
| $a\notin\mathbb R$ et $|a|=1$ | rotation |
| $a\notin\mathbb R$ et $|a|\ne1$ | similitude directe générale |

Une homothétie de rapport négatif k peut aussi être décrite comme une similitude de rapport positif $-k$ et d’angle $\pi$.

## Exemple officiel

Pour

$$z'=(1-i)z+i,$$

on trouve

$$
\omega=\frac{i}{1-(1-i)}=1,
\quad k=|1-i|=\sqrt2,
\quad \theta=-\frac\pi4.
$$

## Quatre cas à savoir reconnaître

- $z'=5z+2i$ : homothétie de centre $-i/2$, rapport 5 ;
- $z'=z+1+3i$ : translation de vecteur $1+3i$ ;
- $z'=e^{i\pi/3}z+e^{-i\pi/3}$ : rotation de centre 1, angle $\pi/3$ ;
- $z'=(-1+i)z+2$ : similitude de centre $4/5+2i/5$, rapport $\sqrt2$, angle $3\pi/4$.

> **Astuce mémoire de Davy.** a pilote la forme ; b déplace le centre. Commence toujours par observer a.`,
    keyPoint: String.raw`$\omega=\dfrac b{1-a},\qquad k=|a|,\qquad\theta=\arg(a)$`,
    example: String.raw`Pour $z'=(-1+i)z+2$, le centre vaut $2/(2-i)=4/5+2i/5$, le rapport $\sqrt2$ et l’angle $3\pi/4$.`,
    methodSteps: [
      "Isole les coefficients a et b.",
      "Teste d’abord si a=1, puis s’il est réel, puis si |a|=1.",
      "Si a≠1, résous z=az+b ou utilise b/(1−a) pour le centre.",
      "Calcule enfin |a| et un argument principal de a.",
    ],
    timeline: [
      { label: "Coefficient a", detail: "Il détermine nature, rapport et angle." },
      { label: "Point fixe", detail: "Pour a≠1, ω=b/(1−a)." },
      { label: "Module", detail: "Le rapport positif vaut |a|." },
      { label: "Argument", detail: "L’angle vaut arg(a)." },
    ],
    interaction: similarityInteraction,
    questions: [
      choice("Quelle est la forme générale d’une similitude directe ?", [String.raw`$z'=az+b$ avec $a\ne0$`, String.raw`$z'=a\overline z+b$`, String.raw`$z'=z^2+b$`, String.raw`$z'=|z|+b$`], 0, "Une similitude directe est affine complexe sans conjugaison.", "Définition • page 15"),
      choice("Si a=1, la transformation est :", ["Une translation", "Une rotation non triviale", "Une homothétie de rapport 0", "Une symétrie axiale"], 0, "La formule devient z'=z+b.", "Propriété • page 15"),
      choice(String.raw`Si $a\ne1$, l’affixe du centre vaut :`, [String.raw`$b/(1-a)$`, String.raw`$b/(a-1)$`, String.raw`$a/b$`, String.raw`$1/(a+b)$`], 0, "Le centre résout ω=aω+b.", "Propriété • page 15"),
      choice(String.raw`Pour $z'=(1-i)z+i$, quel est le centre ?`, ["Le point d’affixe 1", "L’origine", "Le point d’affixe i", "Le point d’affixe −1"], 0, "i/(1−1+i)=i/i=1.", "Exercice de fixation • page 15", 2),
      short("Quel est le rapport de cette similitude ?", ["√2", "sqrt(2)", "racine de 2"], "|1−i|=√2.", "Exercice de fixation • page 15", 2),
      short("Quel est son angle principal ?", ["-π/4", "−π/4", "-pi/4", "-45°", "-45"], "arg(1−i)=−π/4.", "Exercice de fixation • page 15", 2),
      choice(String.raw`Quelle est la nature de $z'=5z+2i$ ?`, ["Homothétie", "Translation", "Rotation", "Symétrie"], 0, "a=5 est réel non nul et différent de 1.", "Exercice de fixation • pages 16-17"),
      short(String.raw`Quel est le centre de $z'=5z+2i$ ?`, ["-i/2", "−i/2", "-0.5i"], "ω=2i/(1−5)=−i/2.", "Exercice de fixation • pages 16-17", 2),
      choice(String.raw`Quelle est la nature de $z'=z+1+3i$ ?`, ["Translation", "Rotation", "Homothétie", "Similitude de rapport √2"], 0, "a=1.", "Exercice de fixation • page 16"),
      choice(String.raw`Quelle est la nature de $z'=e^{i\pi/3}z+e^{-i\pi/3}$ ?`, ["Rotation", "Translation", "Homothétie", "Symétrie axiale"], 0, "a n’est pas réel et |a|=1.", "Exercice de fixation • pages 16-17"),
      short("Quel est le centre de cette rotation ?", ["1", "+1"], "Le calcul b/(1−a) donne 1.", "Exercice de fixation • page 17", 2),
      choice(String.raw`Pour $z'=(-1+i)z+2$, quels sont rapport et angle ?`, [String.raw`$\sqrt2$ et $3\pi/4$`, String.raw`$2$ et $\pi/4$`, String.raw`$1$ et $-\pi/4$`, String.raw`$\sqrt2$ et $-3\pi/4$`], 0, "|-1+i|=√2 et son argument principal est 3π/4.", "Exercice de fixation • page 17", 3),
    ],
  },
  {
    id: "similarity-from-data",
    title: "Déterminer une similitude à partir d’images",
    summary: "Retrouver les coefficients a et b grâce aux images de deux points distincts, puis identifier les caractéristiques.",
    pages: "17 et 18-20",
    section: "III-4. Similitude définie par ses données",
    durationMinutes: 34,
    body: String.raw`## Deux points et leurs images suffisent

Si une similitude $s:z'=az+b$ envoie A sur C et B sur D, avec $A\ne B$, alors

$$
\begin{cases}
az_A+b=z_C,\\
az_B+b=z_D.
\end{cases}
$$

En soustrayant les équations,

$$
a=\frac{z_D-z_C}{z_B-z_A},
\qquad
b=z_C-az_A.
$$

## Exercice officiel : deux couples d’images

Avec

$$z_A=2,\ z_B=2+2i,\ z_C=1-3i,\ z_D=-4i,$$

le système donne

$$
a=-\frac12+\frac12i,
\qquad b=2-4i.
$$

La similitude est donc

$$
z'=\left(-\frac12+\frac12i\right)z+2-4i.
$$

Ses caractéristiques sont

$$
\omega=2-2i,
\qquad k=\frac{\sqrt2}{2},
\qquad\theta=\frac{3\pi}{4}.
$$

## Cas : le centre et une image sont connus

Si A est le centre et $s(B)=C$, alors

$$
a=\frac{z_C-z_A}{z_B-z_A}.
$$

Pour $z_A=-2+i$, $z_B=1+2i$, $z_C=2-i$, on obtient $a=1-i$ puis

$$z'=(1-i)z-1-2i.$$

Le rapport vaut $\sqrt2$ et l’angle $-\pi/4$.

> **Astuce mémoire de Davy.** Soustraire les deux équations fait disparaître b : c’est toujours la première opération.`,
    keyPoint: String.raw`$a=\dfrac{z_D-z_C}{z_B-z_A},\qquad b=z_C-az_A$`,
    example: String.raw`Si $s(A)=C$ et $s(B)=D$, soustraire $az_A+b=z_C$ à $az_B+b=z_D$ donne immédiatement a.`,
    methodSteps: [
      "Traduis chaque image par une équation az+b=zimage.",
      "Soustrais les équations pour éliminer b.",
      "Calcule a puis reporte-le dans une équation pour obtenir b.",
      "Vérifie les deux images et déduis centre, rapport et angle.",
    ],
    timeline: [
      { label: "Système", detail: "Une équation par couple point-image." },
      { label: "Soustraction", detail: "Elle élimine b et isole a." },
      { label: "Report", detail: "Remplace a pour calculer b." },
      { label: "Contrôle", detail: "Vérifie les deux images avant de caractériser." },
    ],
    interaction: similarityInteraction,
    questions: [
      choice("Combien de couples point-image distincts déterminent une similitude directe ?", ["Deux", "Un seul", "Trois obligatoirement", "Une infinité"], 0, "Les deux inconnues complexes a et b sont déterminées par deux équations indépendantes.", "Propriété • pages 18-19"),
      choice(String.raw`Si $s(A)=C$ et $s(B)=D$, quelle formule donne a ?`, [String.raw`$(z_D-z_C)/(z_B-z_A)$`, String.raw`$(z_B-z_A)/(z_D-z_C)$`, String.raw`$(z_C+z_D)/(z_A+z_B)$`, String.raw`$z_C/z_A$`], 0, "On soustrait les deux équations d’image.", "Méthode • page 19", 2),
      choice("Pourquoi soustraire les deux équations ?", ["Pour éliminer b", "Pour éliminer a", "Pour calculer directement le centre", "Pour imposer |a|=1"], 0, "Le terme b est identique dans les deux équations.", "Méthode • page 19"),
      choice("Dans l’exercice A→C et B→D, que vaut a ?", [String.raw`$-\frac12+\frac12i$`, String.raw`$\frac12-\frac12i$`, "$1-i$", "$-1+i$"], 0, "Le système donne −2ia=1+i.", "Exercice de fixation • page 19", 3),
      short("Que vaut b dans cet exercice ?", ["2-4i", "2 − 4i", "2-4*i"], "b=1−3i−2a=2−4i.", "Exercice de fixation • page 19", 2),
      short("Quelle est l’affixe du centre ?", ["2-2i", "2 − 2i", "2-2*i"], "ω=b/(1−a)=2−2i.", "Exercice de fixation • page 19", 3),
      choice("Quels sont le rapport et l’angle ?", [String.raw`$\sqrt2/2$ et $3\pi/4$`, String.raw`$\sqrt2$ et $-\pi/4$`, String.raw`$1/2$ et $\pi/2$`, String.raw`$2$ et $\pi/4$`], 0, "On lit module et argument de a=(−1+i)/2.", "Exercice de fixation • page 19", 3),
      choice(String.raw`Si A est le centre et $s(B)=C$, que vaut a ?`, [String.raw`$(z_C-z_A)/(z_B-z_A)$`, String.raw`$(z_C-z_B)/z_A$`, String.raw`$z_C/z_B$`, String.raw`$(z_A-z_C)/(z_B-z_A)$`], 0, "La forme centrée est z'−zA=a(z−zA).", "Cas particulier • pages 19-20"),
      choice("Avec A=−2+i, B=1+2i, C=2−i, que vaut a ?", ["1−i", "1+i", "−1+i", "2−i"], 0, "Le quotient des différences vaut 1−i.", "Exercice • page 20", 3),
      choice("Quelle est alors l’écriture de s ?", [String.raw`$z'=(1-i)z-1-2i$`, String.raw`$z'=(1+i)z-1+2i$`, String.raw`$z'=z+1-i$`, String.raw`$z'=-iz+2$`], 0, "Le centre A doit être fixe, ce qui donne b=−1−2i.", "Exercice • page 20", 3),
    ],
  },
  {
    id: "similarity-decomposition",
    title: "Décomposition canonique et construction",
    summary: "Construire une similitude comme composition commutative d’une rotation et d’une homothétie de même centre.",
    pages: "17-18 et 22",
    section: "III-4. Construction et décomposition canonique",
    durationMinutes: 28,
    body: String.raw`## Écriture centrée

Une similitude directe de centre A, de rapport $k>0$ et d’angle $\theta$ vérifie

$$
z'-z_A=ke^{i\theta}(z-z_A).
$$

Elle se note $s(A;k;\theta)$.

## Décomposition canonique

Si $h(A;k)$ est l’homothétie de centre A et de rapport k, et $r(A;\theta)$ la rotation de même centre, alors

$$
s(A;k;\theta)
=r(A;\theta)\circ h(A;k)
=h(A;k)\circ r(A;\theta).
$$

Les deux transformations commutent parce qu’elles multiplient toutes deux le vecteur issu de A par un facteur : k pour l’homothétie, $e^{i\theta}$ pour la rotation.

## Exercice officiel de décomposition

$$
s\left(A;2;\frac{3\pi}{2}\right)
=r\left(A;\frac{3\pi}{2}\right)\circ h(A;2)
=h(A;2)\circ r\left(A;\frac{3\pi}{2}\right).
$$

## Construire l’image d’un point

Pour construire $M'=s(A;3;\pi/6)(M)$ :

1. construis N, image de M par la rotation de centre A et d’angle $\pi/6$ ;
2. sur la demi-droite [AN), place M' tel que $AM'=3AN$.

On peut aussi effectuer d’abord l’homothétie, puis la rotation.

## Écrire une similitude à partir de ses éléments

Pour le centre d’affixe i, le rapport $\sqrt2$ et l’angle $\pi/4$,

$$
ke^{i\theta}=\sqrt2\left(\frac{\sqrt2}{2}+i\frac{\sqrt2}{2}\right)=1+i,
$$

donc

$$
z'=(1+i)(z-i)+i=(1+i)z+1.
$$

> **Astuce mémoire de Davy.** Même centre = rotation et agrandissement peuvent être permutés.`,
    keyPoint: String.raw`$s(A;k;\theta)=r(A;\theta)\circ h(A;k)=h(A;k)\circ r(A;\theta)$`,
    example: String.raw`$s(A;3;\pi/6)$ se construit par une rotation de $\pi/6$ puis une homothétie de rapport 3, toutes deux centrées en A.`,
    methodSteps: [
      "Place le centre et le point à transformer.",
      "Construis l’angle θ autour du centre.",
      "Multiplie la distance au centre par k.",
      "Contrôle l’orientation, le rapport des distances et le point fixe.",
    ],
    timeline: [
      { label: "Centrer", detail: "Travaille sur le vecteur AM." },
      { label: "Tourner", detail: "Applique l’angle orienté θ." },
      { label: "Agrandir", detail: "Multiplie la longueur par k." },
      { label: "Permuter", detail: "Avec le même centre, les deux ordres donnent M'." },
    ],
    interaction: similarityInteraction,
    questions: [
      choice("Une similitude directe se décompose en :", ["Une rotation et une homothétie de même centre", "Deux translations quelconques", "Une symétrie et une projection", "Deux homothéties de centres distincts"], 0, "C’est la décomposition canonique.", "Propriété • page 18"),
      truth("Dans la décomposition canonique, rotation et homothétie peuvent être permutées.", true, "Elles ont le même centre et leurs facteurs complexes commutent.", "Propriété • page 18"),
      choice(String.raw`Quelle décomposition de $s(A;2;3\pi/2)$ est correcte ?`, [String.raw`$r(A;3\pi/2)\circ h(A;2)$`, String.raw`$r(A;2)\circ h(A;3\pi/2)$`, String.raw`$h(A;3\pi/2)\circ r(A;2)$`, String.raw`$t\circ r$`], 0, "La rotation porte l’angle, l’homothétie porte le rapport.", "Exercice de fixation 1 • page 18", 2),
      choice(String.raw`Pour construire $s(A;3;\pi/6)(M)$, on peut d’abord :`, [String.raw`Tourner AM de $\pi/6$ autour de A`, "Multiplier les coordonnées de A par 3", "Tracer la médiatrice de [AM]", "Réfléchir M sur un axe"], 0, "On réalise d’abord la rotation, puis l’homothétie.", "Exercice de fixation 2 • page 18"),
      short("Par quel nombre la distance AM est-elle multipliée ?", ["3", "+3"], "Le rapport de la similitude est 3.", "Exercice de fixation 2 • page 18"),
      choice(String.raw`Quel est le coefficient complexe d’une similitude de rapport $\sqrt2$ et d’angle $\pi/4$ ?`, ["1+i", "1−i", String.raw`$\sqrt2+i$`, "i"], 0, "√2 e^(iπ/4)=1+i.", "Exercice de fixation • page 17", 2),
      choice("Quelle est l’écriture de la similitude de centre i, rapport √2, angle π/4 ?", [String.raw`$z'=(1+i)z+1$`, String.raw`$z'=(1-i)z-1$`, String.raw`$z'=\sqrt2z+i$`, String.raw`$z'=iz+1$`], 0, "La forme centrée se développe en (1+i)z+1.", "Exercice de fixation • page 17", 3),
      choice(String.raw`Si $k=1$, la composante homothétie est :`, ["L’identité", "Une symétrie centrale", "Une translation", "Une rotation de π"], 0, "L’homothétie de rapport 1 ne déplace aucun point.", "Conséquence • page 18"),
      choice(String.raw`Si $\theta=0$, la composante rotation est :`, ["L’identité", "Une demi-tour", "Une translation", "Une symétrie"], 0, "Une rotation d’angle nul est l’identité.", "Conséquence • page 18"),
    ],
  },
  {
    id: "similarity-images",
    title: "Images de figures et mission de synthèse",
    summary: "Transporter longueurs, angles, aires, droites et cercles, puis résoudre les problèmes de synthèse officiels.",
    pages: "20-27",
    section: "III-4. Images et situation complexe",
    durationMinutes: 44,
    kind: "challenge",
    body: String.raw`## Ce que conserve une similitude directe

Une similitude directe de rapport k conserve l’alignement et les angles orientés. Elle multiplie :

- toutes les longueurs par k ;
- les périmètres par k ;
- les aires par $k^2$.

L’image d’une droite est une droite. L’image d’un cercle de centre I et de rayon r est le cercle de centre $s(I)$ et de rayon kr.

## Application officielle

Considérons

$$S:z'=(1+i)z-1-2i.$$

Son rapport est $\sqrt2$.

- l’image du triangle OIJ, d’aire $1/2$, a pour aire $2\times1/2=1$ ;
- l’image d’un cercle de centre I et de rayon 2 a pour centre $S(I)$ et rayon $2\sqrt2$ ;
- l’image de la droite (OI) est la droite $(O'I')$, avec $z_{I'}=-i$.

## Mission finale : les quatre triangles rectangles isocèles

Autour d’un quadrilatère direct ABCD, on construit extérieurement les triangles rectangles isocèles $AM_1B$, $BM_2C$, $CM_3D$ et $DM_4A$.

Les relations de triangle rectangle isocèle permettent d’exprimer

$$
z_1=\frac{(1-i)z_A+(1+i)z_B}{2},
$$

et de même $z_2,z_3,z_4$ par permutation cyclique de A, B, C, D. Après simplification,

$$
\frac{z_4-z_2}{z_3-z_1}=-i.
$$

Le module vaut 1 : $M_2M_4=M_1M_3$. L’argument vaut $-\pi/2$ : les supports de $[M_2M_4]$ et $[M_1M_3]$ sont perpendiculaires. L’affirmation de l’élève est donc vraie.

## Exercice officiel : construire un carré

On donne $z_A=-1+3i$, $z_B=-2$, $z_D=2+2i$ et la rotation de centre J d’affixe i et d’angle $\pi/2$ :

$$z'=iz+1+i.$$

Elle envoie A sur B et D sur A. Le symétrique C de A par rapport à J a pour affixe $1-i$. Les quatre côtés ont la même longueur et deux côtés consécutifs sont perpendiculaires : ABCD est un carré.

> **Astuce mémoire de Davy.** Pour l’image d’une figure, transforme un point repère puis applique le facteur k aux longueurs et $k^2$ aux aires.`,
    keyPoint: String.raw`$A'B'=kAB,\qquad \mathcal A'=k^2\mathcal A$`,
    example: String.raw`Une similitude de rapport $\sqrt2$ multiplie les rayons par $\sqrt2$ et les aires par 2.`,
    methodSteps: [
      "Détermine le rapport k et, si nécessaire, l’image d’un point repère.",
      "Pour une droite, transforme deux points distincts ; pour un cercle, transforme le centre.",
      "Multiplie longueurs et rayons par k, aires par k².",
      "Dans une mission, cherche un quotient dont module et argument donnent simultanément les deux conclusions.",
    ],
    timeline: [
      { label: "Repères", detail: "Transforme les points qui déterminent la figure." },
      { label: "Longueurs", detail: "Multiplie par k." },
      { label: "Aires", detail: "Multiplie par k²." },
      { label: "Synthèse", detail: "Un quotient de module 1 et d’argument ±π/2 prouve égalité et perpendicularité." },
    ],
    interaction: similarityInteraction,
    corrections: [
      "Page 22 : la dernière égalité imprimée est tautologique, |z4−z2|=|z4−z2|. La conséquence correcte de (z4−z2)/(z3−z1)=−i est |z4−z2|=|z3−z1|.",
    ],
    questions: [
      choice("Par quoi une similitude de rapport k multiplie-t-elle les longueurs ?", ["k", "k²", "1/k", "Elle les conserve toujours"], 0, "C’est la définition métrique du rapport.", "Propriété • pages 20-21"),
      choice("Par quoi multiplie-t-elle les aires ?", ["k²", "k", "2k", "1/k²"], 0, "Une aire dépend de deux dimensions.", "Application • page 20"),
      short(String.raw`Quel est le rapport de $S:z'=(1+i)z-1-2i$ ?`, ["√2", "sqrt(2)", "racine de 2"], "|1+i|=√2.", "Application • page 20"),
      short("Quelle est l’aire de l’image du triangle OIJ d’aire 1/2 ?", ["1", "+1"], "Le facteur d’aire vaut (√2)²=2, donc 2×1/2=1.", "Application • page 20", 2),
      short("Quel est le rayon image d’un cercle de rayon 2 ?", ["2√2", "2sqrt(2)", "2*sqrt(2)"], "Le rayon est multiplié par √2.", "Application • pages 20-21", 2),
      short("Quelle est l’affixe de I' dans l’image de la droite (OI) ?", ["-i", "−i"], "Le document calcule S(i)=−i.", "Application • page 21", 2),
      choice(String.raw`Dans la mission, que vaut $(z_4-z_2)/(z_3-z_1)$ ?`, ["−i", "i", "1", "−1"], 0, "La simplification par le conjugué donne −i.", "Situation complexe • pages 21-22", 3),
      choice("Que donne le module de ce quotient ?", ["M2M4=M1M3", "M2M4=2M1M3", "Les segments sont parallèles", "Les quatre points sont alignés"], 0, "|−i|=1 : le rapport des deux longueurs vaut 1.", "Situation complexe corrigée • page 22", 2),
      choice("Que donne son argument ?", ["Les supports sont perpendiculaires", "Les supports sont parallèles", "Les segments ont même milieu", "Les points sont cocycliques"], 0, "arg(−i)=−π/2.", "Situation complexe • page 22", 2),
      choice(String.raw`Quelle est l’écriture de la rotation de centre $i$ et d’angle $\pi/2$ ?`, [String.raw`$z'=iz+1+i$`, String.raw`$z'=-iz+1-i$`, String.raw`$z'=iz+i$`, String.raw`$z'=z+1+i$`], 0, String.raw`$i(z-i)+i=iz+1+i$.`, "Exercice d’approfondissement 5 • page 26", 2),
      short("Quelle est l’affixe du symétrique C de A par rapport à J ?", ["1-i", "1 − i", "1-i*1"], "zC=2zJ−zA=2i−(−1+3i)=1−i.", "Exercice d’approfondissement 5 • page 26", 2),
      choice("Pourquoi ABCD est-il un carré ?", ["Ses quatre côtés sont égaux et deux côtés consécutifs sont perpendiculaires", "Ses diagonales sont seulement égales", "Il possède trois côtés égaux", "Parce que A et C sont opposés"], 0, "Le document établit le losange puis l’angle droit.", "Exercice d’approfondissement 5 • page 26", 3),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCComplexGeometryPath: LearningPath = {
  id: "terminale-c-math-l13-complex-geometry",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Géométrie complexe" },
  chapterNumber: 13,
  title: "Nombres complexes et géométrie du plan",
  description: "Angles, distances, lieux, configurations et similitudes directes traités par les nombres complexes.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Interpréter le module et l’argument d’un quotient de différences d’affixes",
    "Déterminer un lieu géométrique à partir d’une condition complexe",
    "Démontrer parallélisme, perpendicularité, cocyclicité ou nature d’un triangle",
    "Écrire et reconnaître les transformations usuelles du plan",
    "Déterminer, construire et décomposer une similitude directe",
    "Transporter droites, cercles et figures par une similitude",
  ],
  modules: [
    {
      id: "terminale-c-math-l13-complex-geometry-mastery",
      title: "Maîtriser la géométrie complexe",
      description: `Dix niveaux progressifs, ${builtLevels.reduce((sum, lesson) => sum + (lesson.questions?.length ?? 0), 0)} questions guidées, trois schémas interactifs et les corrections explicites des coquilles du document.`,
      lessons: builtLevels,
    },
  ],
};
