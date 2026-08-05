import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 09 Nombres complexes.pdf";

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
      title: "Construis le raisonnement",
      instruction: "Sélectionne chaque étape pour retrouver l’ordre des calculs.",
      observation: "Dans les nombres complexes, séparer module, argument, partie réelle et partie imaginaire évite la plupart des erreurs.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Suis les étapes dans l’ordre, écris les formes intermédiaires et vérifie le résultat obtenu.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : choisis la forme du nombre complexe qui rend le calcul le plus court.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const complexPlaneInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Plan complexe",
  title: "Lire une affixe, un module et un argument",
  instruction: "Sélectionne les repères pour relier l’écriture $a+ib$ à sa figure géométrique.",
  observation: "L’affixe donne les coordonnées, le module donne la distance à l’origine et l’argument donne la direction.",
  caption: "Figure originale redessinée d’après le document officiel : un nombre complexe dans le plan d’Argand.",
  viewBox: "0 0 340 230",
  shapes: [
    { shape: "line", x1: 30, y1: 180, x2: 315, y2: 180, tone: "outline" },
    { shape: "line", x1: 95, y1: 205, x2: 95, y2: 25, tone: "outline" },
    { shape: "path", d: "M95 180 L245 70", tone: "accent" },
    { shape: "path", d: "M236 71 L246 70 L242 80 Z", tone: "accent" },
    { shape: "line", x1: 245, y1: 70, x2: 245, y2: 180, tone: "muted" },
    { shape: "line", x1: 95, y1: 70, x2: 245, y2: 70, tone: "muted" },
    { shape: "circle", cx: 245, cy: 70, r: 5, tone: "fill" },
    { shape: "path", d: "M126 180 A31 31 0 0 0 120 162", tone: "soft" },
    { shape: "text", x: 252, y: 66, content: "M(a ; b)", anchor: "start" },
    { shape: "text", x: 247, y: 198, content: "a", anchor: "middle" },
    { shape: "text", x: 80, y: 73, content: "b", anchor: "end" },
    { shape: "text", x: 158, y: 116, content: "|z|", anchor: "middle" },
    { shape: "text", x: 124, y: 168, content: "θ", anchor: "middle" },
    { shape: "text", x: 84, y: 197, content: "O", anchor: "middle" },
    { shape: "text", x: 309, y: 198, content: "Re", anchor: "middle" },
    { shape: "text", x: 75, y: 32, content: "Im", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "affix",
      number: 1,
      label: "L’affixe $a+ib$",
      detail: "Le point image de z=a+ib a pour coordonnées M(a;b). La partie réelle se lit horizontalement et la partie imaginaire verticalement.",
      x: 245,
      y: 70,
      highlight: [{ shape: "circle", cx: 245, cy: 70, r: 9, tone: "accent" }],
    },
    {
      id: "modulus",
      number: 2,
      label: "Le module $|z|$",
      detail: "Le module est la longueur OM : |z|=√(a²+b²). Pour deux points A et B, AB=|z_B−z_A|.",
      x: 165,
      y: 122,
      highlight: [{ shape: "path", d: "M95 180 L245 70", tone: "accent" }],
    },
    {
      id: "argument",
      number: 3,
      label: "L’argument $\\theta$",
      detail: "Un argument de z est une mesure de l’angle orienté entre l’axe réel positif et le vecteur OM. Il est défini modulo 2π.",
      x: 126,
      y: 166,
      highlight: [{ shape: "path", d: "M126 180 A31 31 0 0 0 120 162", tone: "soft" }],
    },
    {
      id: "projections",
      number: 4,
      label: "Les projections $a$ et $b$",
      detail: "Dans le triangle rectangle associé : a=|z|cosθ et b=|z|sinθ.",
      x: 245,
      y: 180,
      highlight: [
        { shape: "line", x1: 245, y1: 70, x2: 245, y2: 180, tone: "soft" },
        { shape: "line", x1: 95, y1: 70, x2: 245, y2: 70, tone: "soft" },
      ],
    },
  ],
};

const rootsInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Racines et géométrie",
  title: "Des solutions régulièrement réparties",
  instruction: "Sélectionne un repère pour comprendre la construction des racines quatrièmes de l’unité.",
  observation: "Toutes les racines ont le même module et deux racines consécutives sont séparées par le même angle $2\\pi/n$.",
  caption: "Figure originale : les quatre racines de l’unité forment un carré inscrit dans le cercle trigonométrique.",
  viewBox: "0 0 340 230",
  shapes: [
    { shape: "line", x1: 35, y1: 115, x2: 305, y2: 115, tone: "outline" },
    { shape: "line", x1: 170, y1: 20, x2: 170, y2: 210, tone: "outline" },
    { shape: "circle", cx: 170, cy: 115, r: 78, tone: "muted" },
    { shape: "path", d: "M248 115 L170 37 L92 115 L170 193 Z", tone: "accent" },
    { shape: "circle", cx: 248, cy: 115, r: 5, tone: "fill" },
    { shape: "circle", cx: 170, cy: 37, r: 5, tone: "fill" },
    { shape: "circle", cx: 92, cy: 115, r: 5, tone: "fill" },
    { shape: "circle", cx: 170, cy: 193, r: 5, tone: "fill" },
    { shape: "text", x: 259, y: 111, content: "1", anchor: "start" },
    { shape: "text", x: 181, y: 34, content: "i", anchor: "start" },
    { shape: "text", x: 80, y: 111, content: "−1", anchor: "end" },
    { shape: "text", x: 181, y: 205, content: "−i", anchor: "start" },
    { shape: "text", x: 160, y: 132, content: "O", anchor: "middle" },
  ],
  hotspots: [
    { id: "radius", number: 1, label: "Même module", detail: "Pour z⁴=1, chaque solution a le module 1 : les quatre points sont sur le cercle trigonométrique.", x: 220, y: 72 },
    { id: "angle", number: 2, label: "Pas angulaire", detail: "Le pas est 2π/4=π/2. On ajoute π/2 à l’argument pour passer à la racine suivante.", x: 202, y: 82 },
    { id: "polygon", number: 3, label: "Polygone régulier", detail: "Les quatre points forment un carré. Plus généralement, les racines n-ièmes forment un polygone régulier à n côtés.", x: 130, y: 76 },
    { id: "sum", number: 4, label: "Somme nulle", detail: "Par symétrie — et par les coefficients du polynôme zⁿ−1 — la somme des n racines de l’unité vaut 0 pour n≥2.", x: 170, y: 193 },
  ],
};

const levels: OfficialLevelSeed[] = [
  {
    id: "complex-algebra",
    title: "Forme algébrique, opérations et égalité",
    summary: "Définir $\\mathbb C$, identifier les parties réelle et imaginaire, puis calculer sous la forme unique $a+ib$.",
    pages: "1-3",
    section: "I-1. Notion de nombre complexe — définition, opérations et égalité",
    durationMinutes: 55,
    body: String.raw`## Le nouvel ensemble de nombres

On introduit un nombre $i$ tel que

$$
i^2=-1.
$$

Un **nombre complexe** est un nombre qui s’écrit sous la forme $a+ib$, avec $a\in\mathbb R$ et $b\in\mathbb R$. L’ensemble des nombres complexes est noté $\mathbb C$.

Cette écriture est **unique** :

$$
a+ib=a'+ib'\iff a=a'\text{ et }b=b'.
$$

| Écriture | Lecture |
|---|---|
| $z=a+ib$ | forme algébrique |
| $\operatorname{Re}(z)=a$ | partie réelle |
| $\operatorname{Im}(z)=b$ | partie imaginaire |
| $b=0$ | $z$ est réel |
| $a=0$ | $z$ est imaginaire pur |

Ainsi $\mathbb R\subset\mathbb C$ et $i\mathbb R\subset\mathbb C$. Le seul complexe à la fois réel et imaginaire pur est $0$.

## Calculer comme dans $\mathbb R$

Pour $z=a+ib$ et $z'=a'+ib'$ :

$$
z+z'=(a+a')+i(b+b'),
$$

$$
zz'=(aa'-bb')+i(ab'+a'b).
$$

Si $z\neq0$ :

$$
\frac1z=\frac{a-ib}{a^2+b^2}.
$$

Pour un quotient, on multiplie numérateur et dénominateur par le conjugué du dénominateur afin de rendre ce dernier réel.

## Exercices officiels guidés

$$
(2+4i)+(-5+i)=-3+5i,
$$

$$
(2-i)(3+2i)=8+i,
$$

$$
\frac2{1-3i}=\frac{2(1+3i)}{10}=\frac15+\frac35i.
$$

> **Astuce mémoire de Davy.** À la fin d’un calcul, rassemble toujours les termes réels d’un côté et les termes en $i$ de l’autre.` ,
    keyPoint: "$z=a+ib$ est une écriture unique et $i^2=-1$.",
    example: "$(2-i)(3+2i)=6+4i-3i-2i^2=8+i$.",
    methodSteps: [
      "Développe comme avec des expressions réelles.",
      "Remplace chaque i² par −1.",
      "Regroupe la partie réelle et le coefficient de i.",
      "Pour un quotient, multiplie par le conjugué du dénominateur.",
    ],
    timeline: [
      { label: "Développer", detail: "Applique distributivité ou identité remarquable." },
      { label: "Réduire", detail: "Utilise i²=−1 autant de fois que nécessaire." },
      { label: "Regrouper", detail: "Écris le résultat sous la forme a+ib." },
      { label: "Vérifier", detail: "Lis séparément Re(z) et Im(z)." },
    ],
    questions: [
      choice("Quelle relation définit le nombre $i$ ?", ["$i^2=-1$", "$i^2=1$", "$i=-1$", "$i^2=0$"], 0, "Par définition, le carré de i vaut −1.", "Cours • page 1"),
      choice("Pour $z=3-2i$, que vaut $\\operatorname{Im}(z)$ ?", ["$-2$", "$2$", "$3$", "$-2i$"], 0, "La partie imaginaire est le coefficient réel de i.", "Cours • page 2"),
      choice("Quel complexe est imaginaire pur ?", ["$5i$", "$5+i$", "$5$", "$1-i$"], 0, "Un imaginaire pur a une partie réelle nulle.", "Cours • page 2"),
      short("Écris $(2+4i)+(-5+i)$ sous forme algébrique.", ["-3+5i", "-3 + 5i", "5i-3"], "On additionne séparément les parties réelles et imaginaires.", "Exercice de fixation • page 2", 2),
      short("Écris $(2-i)(3+2i)$ sous forme algébrique.", ["8+i", "8 + i", "i+8"], "Le développement donne 6+4i−3i−2i²=8+i.", "Exercice de fixation • page 2", 2),
      choice("Quelle est la forme algébrique de $2/(1-3i)$ ?", ["$1/5+3i/5$", "$1/5-3i/5$", "$2+6i$", "$1+3i$"], 0, "On multiplie par 1+3i et on divise par 10.", "Exercice de fixation • page 2", 2),
      choice("Si $a+2+i(b+5)=-1+3i$, alors :", ["$a=-3$ et $b=-2$", "$a=3$ et $b=2$", "$a=-1$ et $b=3$", "$a=-3$ et $b=8$"], 0, "L’unicité impose a+2=−1 et b+5=3.", "Exercice de fixation • page 3", 2),
      choice("Quelle proposition est vraie ?", ["$\\mathbb R\\subset\\mathbb C$", "$\\mathbb C\\subset\\mathbb R$", "$i\\in\\mathbb R$", "$i^2\\in i\\mathbb R$ seulement"], 0, "Tout réel est un complexe de partie imaginaire nulle.", "Cours • page 2"),
      choice("La forme algébrique de $(1+i)(\\sqrt3+i)$ est :", ["$\\sqrt3-1+i(1+\\sqrt3)$", "$\\sqrt3+1+i(1-\\sqrt3)$", "$1+\\sqrt3 i$", "$\\sqrt3-1-i(1+\\sqrt3)$"], 0, "Développer puis utiliser i²=−1.", "Exercice 1 • page 19", 2),
      choice("La forme algébrique de $(1+i)/(\\sqrt3+i)$ est :", ["$(\\sqrt3+1)/4+i(\\sqrt3-1)/4$", "$(\\sqrt3-1)/4+i(\\sqrt3+1)/4$", "$1/2+i/2$", "$\\sqrt3+i$"], 0, "Multiplier par √3−i ; le dénominateur devient 4.", "Exercice 1 • page 19", 2),
    ],
  },
  {
    id: "complex-powers",
    title: "Puissances de i et formule du binôme",
    summary: "Réduire une grande puissance de $i$ modulo $4$ et développer une puissance de $a+ib$ sans erreur.",
    pages: "3",
    section: "I-1. Remarque sur les puissances de i et exercices de fixation",
    durationMinutes: 45,
    body: String.raw`## Une période de longueur $4$

Les puissances de $i$ tournent toujours dans le même cycle :

| Exposant modulo $4$ | Valeur |
|---|---|
| $4q$ | $1$ |
| $4q+1$ | $i$ |
| $4q+2$ | $-1$ |
| $4q+3$ | $-i$ |

Autrement dit, pour calculer $i^n$, il suffit d’effectuer la division euclidienne de $n$ par $4$.

$$
2019=4\times504+3\quad\Longrightarrow\quad i^{2019}=-i.
$$

$$
1\,000\,000\,000=4\times250\,000\,000\quad\Longrightarrow\quad i^{1\,000\,000\,000}=1.
$$

## Puissance d’un binôme complexe

La formule de Newton reste valable :

$$
(a+b)^n=\sum_{k=0}^{n}\binom nk a^{n-k}b^k.
$$

Avec $a=1$ et $b=-2i$ :

$$
(1-2i)^5
=1-10i-40+80i+80-32i
=41+38i.
$$

> **Erreur fréquente.** Ne remplace pas $i^k$ trop tôt au hasard. Réduis chaque exposant modulo $4$ ou utilise successivement $i^2=-1$.

> **Correction de source.** Dans la première ligne du développement de la page 3, le terme de rang $4$ est imprimé avec $(-2i)^2$. Il faut lire $(-2i)^4$ ; la ligne suivante et le résultat $41+38i$ confirment cette correction.` ,
    keyPoint: "$i^{4q}=1$, $i^{4q+1}=i$, $i^{4q+2}=-1$, $i^{4q+3}=-i$.",
    example: "$i^{2026}=i^{4\\times506+2}=-1$.",
    methodSteps: [
      "Divise l’exposant de i par 4.",
      "Garde uniquement le reste 0, 1, 2 ou 3.",
      "Pour un binôme, écris tous les termes de Newton.",
      "Réduis les puissances de i puis regroupe réel et imaginaire.",
    ],
    timeline: [
      { label: "Division", detail: "Écris n=4q+r avec 0≤r≤3." },
      { label: "Cycle", detail: "Remplace iⁿ par iʳ." },
      { label: "Newton", detail: "Développe chaque terme avec son coefficient binomial." },
      { label: "Forme finale", detail: "Regroupe sous la forme a+ib." },
    ],
    corrections: [
      "Page 3 : dans la première ligne du binôme, le terme C₅⁴·1·(−2i)² est une coquille typographique. L’exposant correct est 4, comme le montre la ligne développée suivante.",
    ],
    questions: [
      short("Calcule $i^{2019}$.", ["-i", "−i"], "2019=4×504+3, donc i²⁰¹⁹=i³=−i.", "Exercice de fixation 1 • page 3", 2),
      short("Calcule $i^{1000000000}$.", ["1", "+1"], "L’exposant est divisible par 4.", "Exercice de fixation 1 • page 3", 2),
      short("Calcule $i^{2026}$.", ["-1", "−1"], "2026 laisse le reste 2 dans la division par 4.", "Application guidée"),
      choice("Si $n\\equiv1\\pmod4$, alors $i^n$ vaut :", ["$i$", "$-i$", "$1$", "$-1$"], 0, "Le cycle est 1, i, −1, −i.", "Cours • page 3"),
      choice("Quelle formule convient pour développer $(1-2i)^5$ ?", ["Le binôme de Newton", "La formule de Moivre uniquement", "L’inégalité triangulaire", "Le théorème de Pythagore"], 0, "Les règles algébriques et le binôme de Newton restent valables dans C.", "Exercice de fixation 2 • page 3"),
      short("Donne la partie réelle de $(1-2i)^5$.", ["41", "+41"], "Le développement complet donne 41+38i.", "Exercice de fixation 2 • page 3", 2),
      short("Donne la partie imaginaire de $(1-2i)^5$.", ["38", "+38"], "Im(41+38i)=38.", "Exercice de fixation 2 • page 3", 2),
      choice("Quel terme correct apparaît au rang $4$ du développement ?", ["$\\binom54(-2i)^4$", "$\\binom54(-2i)^2$", "$\\binom54(-2i)^5$", "$\\binom52(-2i)^4$"], 0, "Le terme général est C₅ᵏ·1⁵⁻ᵏ·(−2i)ᵏ.", "Exercice corrigé • page 3"),
    ],
  },
  {
    id: "complex-conjugate",
    title: "Conjugué, quotient, réel et imaginaire pur",
    summary: "Utiliser $\\overline z$ pour calculer un quotient, extraire les parties de $z$ et caractériser les réels ou imaginaires purs.",
    pages: "3-5",
    section: "I-2. Conjugué d’un nombre complexe",
    durationMinutes: 55,
    body: String.raw`## Définition

Si $z=a+ib$, son **conjugué** est

$$
\overline z=a-ib.
$$

Géométriquement, les images de $z$ et de $\overline z$ sont symétriques par rapport à l’axe réel.

## Propriétés à connaître

Pour $z,z'\in\mathbb C$ et $n\in\mathbb N$ :

$$
\overline{\overline z}=z,
\qquad
\overline{z+z'}=\overline z+\overline{z'},
\qquad
\overline{zz'}=\overline z\,\overline{z'},
$$

$$
\overline{z^n}=\overline z^{,n},
\qquad
\overline{\left(\frac{z'}z\right)}=\frac{\overline{z'}}{\overline z}\quad(z\neq0).
$$

Les trois identités les plus utiles sont :

$$
z+\overline z=2\operatorname{Re}(z),
\qquad
z-\overline z=2i\operatorname{Im}(z),
\qquad
z\overline z=a^2+b^2.
$$

Donc, pour $z\neq0$ :

$$
\frac1z=\frac{\overline z}{z\overline z}.
$$

## Reconnaître un réel ou un imaginaire pur

$$
z\in\mathbb R\iff\overline z=z,
\qquad
z\in i\mathbb R\iff\overline z=-z.
$$

Pour $z=(2-3i)/(x+i)$, avec $x\in\mathbb R$ :

$$
z=\frac{2x-3}{x^2+1}-i\frac{3x+2}{x^2+1}.
$$

Ainsi $z$ est réel pour $x=-2/3$ et imaginaire pur pour $x=3/2$.

> **Astuce mémoire de Davy.** Le conjugué change seulement le signe de la partie imaginaire ; son produit avec le nombre d’origine est toujours réel et positif ou nul.` ,
    keyPoint: "$z\\overline z=|z|^2$ ; $z\\in\\mathbb R\\iff\\overline z=z$ ; $z\\in i\\mathbb R\\iff\\overline z=-z$.",
    example: "Pour $z=1-3i$, $z\\overline z=10$, $z+\\overline z=2$ et $z-\\overline z=-6i$.",
    methodSteps: [
      "Écris le conjugué en changeant le signe devant i.",
      "Développe le produit z·z̄ pour obtenir un réel.",
      "Dans un quotient, multiplie en haut et en bas par le conjugué du dénominateur.",
      "Annule Im(z) pour un réel ou Re(z) pour un imaginaire pur.",
    ],
    timeline: [
      { label: "Conjuguer", detail: "a+ib devient a−ib." },
      { label: "Rationaliser", detail: "Le dénominateur devient a²+b²." },
      { label: "Séparer", detail: "Lis Re(z) et Im(z)." },
      { label: "Caractériser", detail: "Annule la partie demandée." },
    ],
    questions: [
      choice("Quel est le conjugué de $3-4i$ ?", ["$3+4i$", "$-3+4i$", "$3-4i$", "$-3-4i$"], 0, "Seul le signe de la partie imaginaire change.", "Cours • page 4"),
      short("Pour $z=1-3i$, calcule $z\\overline z$.", ["10", "+10"], "1²+(−3)²=10.", "Exercice de fixation 1 • page 4", 2),
      short("Pour $z=1-3i$, calcule $z+\\overline z$.", ["2", "+2"], "La somme vaut 2Re(z)=2.", "Exercice de fixation 1 • page 4"),
      short("Pour $z=1-3i$, calcule $z-\\overline z$.", ["-6i", "−6i"], "La différence vaut 2iIm(z)=−6i.", "Exercice de fixation 1 • page 4", 2),
      choice("Le conjugué de $i(\\sqrt2-3i)$ est :", ["$3-i\\sqrt2$", "$3+i\\sqrt2$", "$-3-i\\sqrt2$", "$-3+i\\sqrt2$"], 0, "Le nombre vaut 3+i√2 ; son conjugué vaut 3−i√2.", "Exercice de fixation 1 • page 4", 2),
      choice("Quel critère caractérise un nombre réel ?", ["$\\overline z=z$", "$\\overline z=-z$", "$|z|=0$", "$\\operatorname{Re}(z)=0$"], 0, "Le conjugué d’un réel est lui-même.", "Propriété 2 • page 4"),
      choice("Quel critère caractérise un imaginaire pur ?", ["$\\overline z=-z$", "$\\overline z=z$", "$\\operatorname{Im}(z)=0$", "$|z|=1$"], 0, "Une partie réelle nulle entraîne z̄=−z.", "Propriété 2 • page 4"),
      short("Pour $z=(2-3i)/(x+i)$, donne $x$ pour que $z$ soit réel.", ["-2/3", "−2/3", "-0,6666667"], "Il faut 3x+2=0.", "Exercice de fixation • page 5", 2),
      short("Pour $z=(2-3i)/(x+i)$, donne $x$ pour que $z$ soit imaginaire pur.", ["3/2", "1,5", "1.5"], "Il faut 2x−3=0.", "Exercice de fixation • page 5", 2),
      choice("Pour $z\\neq0$, quelle formule est correcte ?", ["$1/z=\\overline z/|z|^2$", "$1/z=z/|z|$", "$1/z=-\\overline z$", "$1/z=|z|^2$"], 0, "Comme z·z̄=|z|², on divise le conjugué par |z|².", "Conséquence • page 4"),
    ],
  },
  {
    id: "complex-modulus",
    title: "Module, affixe et distances dans le plan complexe",
    summary: "Calculer $|z|$, interpréter une affixe comme un point ou un vecteur, puis traduire une distance par un module.",
    pages: "5-7",
    section: "I-3. Module et II. Représentation géométrique",
    durationMinutes: 60,
    body: String.raw`## Module d’un nombre complexe

Pour $z=a+ib$ :

$$
|z|=\sqrt{a^2+b^2}=\sqrt{z\overline z}.
$$

Le module est un réel positif. Il généralise la valeur absolue : si $z$ est réel, son module est sa valeur absolue.

## Propriétés

$$
|\overline z|=|-z|=|z|,
\qquad
|zz'|=|z|\,|z'|,
\qquad
|z^n|=|z|^n,
$$

$$
\left|\frac1z\right|=\frac1{|z|},
\qquad
\left|\frac{z'}z\right|=\frac{|z'|}{|z|},
\qquad
|z+z'|\le |z|+|z'|.
$$

La dernière relation est l’**inégalité triangulaire**.

## Le plan complexe

Dans un repère orthonormé direct, au complexe $z=x+iy$ on associe le point $M(x;y)$ : $z$ est l’**affixe** de $M$.

Au vecteur de coordonnées $(a;b)$ on associe l’affixe $a+ib$. Pour deux points $A$ et $B$ :

$$
z_{\overrightarrow{AB}}=z_B-z_A,
\qquad
AB=|z_B-z_A|.
$$

Le module de l’affixe d’un point est donc sa distance à l’origine :

$$
OM=|z_M|.
$$

## Fixation officielle

$$
|(3-i)(3i-2)|=\sqrt{10}\sqrt{13}=\sqrt{130},
$$

$$
|(2+i)+(8-i)|=|10|=10,
$$

$$
\left|\frac{3-i}{4-i\sqrt2}\right|=\frac{\sqrt{10}}{\sqrt{18}}=\frac{\sqrt5}{3},
$$

$$
|(3+i)^3|=(\sqrt{10})^3=10\sqrt{10}.

> **Astuce mémoire de Davy.** Le module transforme les produits en produits et les quotients en quotients ; pour une somme, il donne seulement une inégalité en général.` ,
    keyPoint: "$|a+ib|=\\sqrt{a^2+b^2}$, $OM=|z_M|$ et $AB=|z_B-z_A|$.",
    example: "$|3-4i|=\\sqrt{3^2+(-4)^2}=5$.",
    methodSteps: [
      "Si le nombre est sous forme algébrique, applique √(a²+b²).",
      "Pour un produit, une puissance ou un quotient, utilise les propriétés avant de développer.",
      "Dans le plan, forme la différence des affixes pour une distance.",
      "Vérifie que le résultat est un réel positif.",
    ],
    timeline: [
      { label: "Affixe", detail: "M(a;b) correspond à z=a+ib." },
      { label: "Module", detail: "La longueur OM vaut √(a²+b²)." },
      { label: "Vecteur", detail: "L’affixe de AB est zB−zA." },
      { label: "Distance", detail: "AB est le module de cette différence." },
    ],
    interaction: complexPlaneInteraction,
    questions: [
      short("Calcule $|3-4i|$.", ["5", "+5"], "Le module vaut √(9+16)=5.", "Cours • page 5"),
      choice("Quelle égalité est correcte ?", ["$|zz'|=|z||z'|$", "$|z+z'|=|z|+|z'|$ toujours", "$|z|=z^2$", "$|\\overline z|=-|z|$"], 0, "Le module est multiplicatif ; il n’est pas additif.", "Propriétés • pages 5-6"),
      short("Calcule $|(3-i)(3i-2)|$.", ["√130", "sqrt(130)", "racine de 130"], "Le produit des modules vaut √10×√13=√130.", "Exercice de fixation • page 6", 2),
      short("Calcule $|(2+i)+(8-i)|$.", ["10", "+10"], "La somme vaut 10.", "Exercice de fixation • page 6"),
      choice("Calcule $|(3-i)/(4-i\\sqrt2)|$.", ["$\\sqrt5/3$", "$\\sqrt5$", "$5/3$", "$\\sqrt{18}/\\sqrt{10}$"], 0, "On divise √10 par √18.", "Exercice de fixation • page 6", 2),
      choice("Calcule $|(3+i)^3|$.", ["$10\\sqrt{10}$", "$30$", "$\\sqrt{10}$", "$100$"], 0, "|3+i|³=(√10)³=10√10.", "Exercice de fixation • page 6", 2),
      choice("Si $z_A=2+i$ et $z_B=-4+7i$, l’affixe de $\\overrightarrow{AB}$ est :", ["$-6+6i$", "$6-6i$", "$-2+8i$", "$2-8i$"], 0, "zB−zA=−4+7i−2−i=−6+6i.", "Exemple • page 6"),
      short("Avec les mêmes points, donne l’affixe de $3\\overrightarrow{AB}$.", ["-18+18i", "-18 + 18i", "18i-18"], "On multiplie −6+6i par 3.", "Exemple • page 6", 2),
      choice("Que représente géométriquement $|z_B-z_A|$ ?", ["La distance AB", "L’angle AOB", "Le milieu de AB", "L’aire du triangle OAB"], 0, "Le module de l’affixe du vecteur AB est sa longueur.", "Interprétation • page 7"),
      choice("Quelle inégalité est toujours vraie ?", ["$|z+z'|\\le|z|+|z'|$", "$|z+z'|\\ge|z|+|z'|$", "$|z-z'|=0$", "$|z|<0$"], 0, "C’est l’inégalité triangulaire.", "Propriété • page 5"),
    ],
  },
  {
    id: "complex-arguments",
    title: "Arguments et angles orientés",
    summary: "Déterminer l’argument principal d’un complexe et calculer l’argument d’un produit, quotient ou puissance.",
    pages: "7-9",
    section: "III-1-a. Argument d’un nombre complexe non nul",
    durationMinutes: 60,
    body: String.raw`## Définition géométrique

Soit $z\neq0$ d’image $M$ dans le plan complexe. Un **argument** de $z$ est une mesure en radians de l’angle orienté

$$
(\vec u;\overrightarrow{OM}).
$$

Si $\theta$ est un argument, tous les arguments sont $\theta+2k\pi$, $k\in\mathbb Z$. L’unique argument appartenant à $]-\pi;\pi]$ est l’**argument principal**, noté $\operatorname{Arg}(z)$.

Le nombre $0$ n’a pas d’argument.

## Retrouver un argument depuis $a+ib$

Pour $z=a+ib\neq0$, avec $r=|z|$ :

$$
\cos\theta=\frac ar,
\qquad
\sin\theta=\frac br.
$$

Si $a\neq0$, on peut aussi utiliser $\tan\theta=b/a$, mais la tangente seule ne donne pas le quadrant : il faut regarder les signes de $a$ et $b$.

## Arguments et opérations

Pour $z,z'\neq0$ et $n\in\mathbb N$ :

$$
\arg(zz')\equiv\arg z+\arg z'\pmod{2\pi},
$$

$$
\arg\!\left(\frac{z'}z\right)\equiv\arg z'-\arg z\pmod{2\pi},
$$

$$
\arg(z^n)\equiv n\arg z\pmod{2\pi},
\qquad
\arg(\overline z)\equiv-\arg z\pmod{2\pi}.
$$

## Exemples officiels

$$
\operatorname{Arg}(\sqrt3+i)=\frac\pi6,
\quad
\operatorname{Arg}(1-i\sqrt3)=-\frac\pi3,
\quad
\operatorname{Arg}(1+i)=\frac\pi4.
$$

En posant $z_1=-\sqrt3+i$ et $z_2=1-i$ :

$$
\operatorname{Arg}(z_1)=\frac{5\pi}{6},
\qquad
\operatorname{Arg}(z_2)=-\frac\pi4.
$$

Donc

$$
\arg(z_1z_2)\equiv\frac{7\pi}{12},
\quad
\arg\!\left(\frac{z_2}{z_1}\right)\equiv\frac{11\pi}{12},
\quad
\arg(z_1^2z_2^3)\equiv\frac{11\pi}{12}.
$$

> **Correction de source.** La page 7 imprime $a/(a^2+b^2)$ et $b/(a^2+b^2)$ pour le cosinus et le sinus. Le dénominateur correct est $|z|=\sqrt{a^2+b^2}$.` ,
    keyPoint: "$\\cos\\theta=\\operatorname{Re}(z)/|z|$ et $\\sin\\theta=\\operatorname{Im}(z)/|z|$.",
    example: "Pour $z=-\\sqrt3+i$, $|z|=2$, donc $\\cos\\theta=-\\sqrt3/2$ et $\\sin\\theta=1/2$ : $\\operatorname{Arg}(z)=5\\pi/6$.",
    methodSteps: [
      "Vérifie que z n’est pas nul.",
      "Calcule r=|z|.",
      "Calcule cosθ=a/r et sinθ=b/r.",
      "Choisis l’angle du bon quadrant puis ramène-le dans ]−π;π] si l’argument principal est demandé.",
    ],
    timeline: [
      { label: "Module", detail: "Calcule r=√(a²+b²)." },
      { label: "Rapports", detail: "Forme a/r et b/r." },
      { label: "Quadrant", detail: "Lis les signes de a et b." },
      { label: "Modulo 2π", detail: "Ramène l’angle à l’intervalle principal." },
    ],
    interaction: complexPlaneInteraction,
    corrections: [
      "Page 7 : les formules imprimées cos(φ)=a/(a²+b²) et sin(φ)=b/(a²+b²) oublient la racine carrée. Les bonnes formules sont cos(φ)=a/√(a²+b²) et sin(φ)=b/√(a²+b²).",
    ],
    questions: [
      choice("Quel nombre complexe n’admet aucun argument ?", ["$0$", "$1$", "$i$", "$-1$"], 0, "L’angle d’un vecteur nul n’est pas défini.", "Définition • pages 7-8"),
      choice("Dans quel intervalle choisit-on l’argument principal ?", ["$]-\\pi;\\pi]$", "$[0;2\\pi]$", "$]-\\pi/2;\\pi/2[$", "$\\mathbb R$"], 0, "Le document retient ]−π;π].", "Remarque • page 8"),
      short("Donne l’argument principal de $\\sqrt3+i$.", ["π/6", "pi/6"], "Le point est dans le premier quadrant et ses rapports sont √3/2 et 1/2.", "Exercice de fixation • page 8", 2),
      short("Donne l’argument principal de $1-i\\sqrt3$.", ["-π/3", "−π/3", "-pi/3"], "Le point est dans le quatrième quadrant.", "Exercice de fixation • page 8", 2),
      short("Donne l’argument principal de $1+i$.", ["π/4", "pi/4"], "Les deux coordonnées sont positives et égales.", "Exercice de fixation • page 8"),
      choice("Si $\\arg z=5\\pi/6$ et $\\arg z'=-\\pi/4$, un argument de $zz'$ est :", ["$7\\pi/12$", "$13\\pi/12$", "$\\pi/12$", "$11\\pi/12$"], 0, "On additionne : 10π/12−3π/12=7π/12.", "Exercice de fixation • page 9", 2),
      choice("Avec les mêmes arguments, l’argument principal de $z'/z$ est :", ["$11\\pi/12$", "$-11\\pi/12$", "$7\\pi/12$", "$13\\pi/12$"], 0, "−π/4−5π/6=−13π/12≡11π/12.", "Exercice de fixation • page 9", 2),
      choice("Un argument de $z^n$ est congru à :", ["$n\\arg z$", "$\\arg z/n$", "$\\arg z+n$", "$|z|^n$"], 0, "Les arguments s’additionnent lors des produits répétés.", "Propriété • page 9"),
      choice("Si $z_A$ et $z_B$ sont les affixes de A et B, $\\arg(z_B-z_A)$ mesure :", ["L’angle orienté de l’axe réel vers AB", "La distance AB", "L’aire de OAB", "Le milieu de AB"], 0, "zB−zA est l’affixe du vecteur AB.", "Remarque • page 9"),
      choice("Pourquoi $\\tan\\theta=b/a$ ne suffit-elle pas toujours ?", ["Elle ne distingue pas les quadrants opposés", "Elle ne fonctionne jamais", "Elle donne le module", "Elle exige b=0"], 0, "Deux angles séparés de π ont la même tangente.", "Clarification pédagogique"),
    ],
  },
  {
    id: "trigonometric-form",
    title: "Passer à la forme trigonométrique",
    summary: "Écrire $z=r(\\cos\\theta+i\\sin\\theta)$ et convertir avec sûreté entre les formes algébrique et trigonométrique.",
    pages: "10 et 19-20",
    section: "III-1-b. Forme trigonométrique et exercices 2-3",
    durationMinutes: 55,
    body: String.raw`## Définition

Tout complexe non nul s’écrit sous la forme

$$
z=r(\cos\theta+i\sin\theta),
$$

avec $r=|z|>0$ et $\theta$ un argument de $z$. Cette écriture est la **forme trigonométrique**.

## Convertir dans les deux sens

| Forme algébrique $a+ib$ vers trigonométrique | Forme trigonométrique vers algébrique |
|---|---|
| $r=\sqrt{a^2+b^2}$ | $a=r\cos\theta$ |
| $\cos\theta=a/r$ | $b=r\sin\theta$ |
| $\sin\theta=b/r$ | $z=a+ib$ |

Exemples du cours :

$$
2+2i=2\sqrt2\left(\cos\frac\pi4+i\sin\frac\pi4\right),
$$

$$
4i=4\left(\cos\frac\pi2+i\sin\frac\pi2\right),
\qquad
5=5(\cos0+i\sin0).
$$

Pour $z=-\sqrt3+i$, on a $|z|=2$ et un argument $5\pi/6$ :

$$
z=2\left(\cos\frac{5\pi}{6}+i\sin\frac{5\pi}{6}\right).
$$

## Atelier officiel : obtenir un angle exact

Soit $Z=(1+i)(\sqrt3+i)$. En forme trigonométrique :

$$
1+i=\sqrt2\,\mathrm{cis}\frac\pi4,
\qquad
\sqrt3+i=2\,\mathrm{cis}\frac\pi6,
$$

donc

$$
Z=2\sqrt2\,\mathrm{cis}\frac{5\pi}{12}.
$$

Or, en forme algébrique :

$$
Z=\sqrt3-1+i(1+\sqrt3).
$$

Par identification :

$$
\cos\frac{5\pi}{12}=\frac{\sqrt6-\sqrt2}{4},
\qquad
\sin\frac{5\pi}{12}=\frac{\sqrt6+\sqrt2}{4}.
$$

> **Astuce mémoire de Davy.** Module d’abord, angle ensuite. Une forme trigonométrique qui ne commence pas par un réel strictement positif n’est pas encore normalisée.` ,
    keyPoint: "$z=r(\\cos\\theta+i\\sin\\theta)$ avec $r=|z|>0$.",
    example: "$-\\sqrt3+i=2(\\cos(5\\pi/6)+i\\sin(5\\pi/6))$.",
    methodSteps: [
      "Calcule le module r.",
      "Détermine un argument θ dans le bon quadrant.",
      "Écris r(cosθ+i sinθ).",
      "Pour revenir à a+ib, calcule r cosθ et r sinθ.",
    ],
    timeline: [
      { label: "Module", detail: "r=√(a²+b²)>0." },
      { label: "Angle", detail: "cosθ=a/r et sinθ=b/r." },
      { label: "Écriture", detail: "z=r(cosθ+i sinθ)." },
      { label: "Identification", detail: "a=r cosθ et b=r sinθ." },
    ],
    questions: [
      choice("La forme trigonométrique normalisée de $-\\sqrt3+i$ est :", ["$2(\\cos(5\\pi/6)+i\\sin(5\\pi/6))$", "$2(\\cos(\\pi/6)+i\\sin(\\pi/6))$", "$\\sqrt3(\\cos(5\\pi/6)+i\\sin(5\\pi/6))$", "$-2(\\cos(\\pi/6)+i\\sin(\\pi/6))$"], 0, "Le module est 2 et le point est dans le deuxième quadrant.", "Exercice de fixation • page 10", 2),
      choice("La forme trigonométrique de $1+i$ est :", ["$\\sqrt2(\\cos(\\pi/4)+i\\sin(\\pi/4))$", "$2(\\cos(\\pi/4)+i\\sin(\\pi/4))$", "$\\sqrt2(\\cos(3\\pi/4)+i\\sin(3\\pi/4))$", "$1(\\cos(\\pi/2)+i\\sin(\\pi/2))$"], 0, "Le module vaut √2 et l’argument π/4.", "Exercice 2 • pages 19-20"),
      choice("La forme trigonométrique de $\\sqrt3+i$ est :", ["$2(\\cos(\\pi/6)+i\\sin(\\pi/6))$", "$2(\\cos(\\pi/3)+i\\sin(\\pi/3))$", "$\\sqrt3(\\cos(\\pi/6)+i\\sin(\\pi/6))$", "$2(\\cos(-\\pi/6)+i\\sin(-\\pi/6))$"], 0, "Le module vaut 2 et cosθ=√3/2.", "Exercice 2 • page 20", 2),
      short("Donne le module de $Z=(1+i)(\\sqrt3+i)$.", ["2√2", "2sqrt(2)", "2*√2"], "Le module du produit est √2×2=2√2.", "Exercice 3 • page 20"),
      short("Donne un argument de $Z=(1+i)(\\sqrt3+i)$ dans $]0;\\pi[$.", ["5π/12", "5pi/12"], "π/4+π/6=5π/12.", "Exercice 3 • page 20", 2),
      choice("Quelle est la valeur exacte de $\\cos(5\\pi/12)$ ?", ["$(\\sqrt6-\\sqrt2)/4$", "$(\\sqrt6+\\sqrt2)/4$", "$\\sqrt3/2$", "$1/2$"], 0, "On identifie la partie réelle de Z à 2√2 cos(5π/12).", "Exercice 3 • page 20", 2),
      choice("Quelle est la valeur exacte de $\\sin(5\\pi/12)$ ?", ["$(\\sqrt6+\\sqrt2)/4$", "$(\\sqrt6-\\sqrt2)/4$", "$1/2$", "$\\sqrt2/2$"], 0, "On identifie la partie imaginaire.", "Exercice 3 • page 20", 2),
      choice("Si $z=r(\\cos\\theta+i\\sin\\theta)$, alors $\\operatorname{Re}(z)$ vaut :", ["$r\\cos\\theta$", "$r\\sin\\theta$", "$\\cos\\theta/r$", "$r^2$"], 0, "C’est la conversion vers la forme algébrique.", "Passage d’une forme à l’autre • page 10"),
      choice("Quelle étape vient en premier pour convertir $a+ib$ ?", ["Calculer le module", "Calculer la tangente seulement", "Développer avec Newton", "Chercher le conjugué uniquement"], 0, "Le module normalise ensuite cosθ et sinθ.", "Méthode • page 10"),
    ],
  },
  {
    id: "exponential-form",
    title: "Forme exponentielle et calculs rapides",
    summary: "Utiliser $z=re^{i\\theta}$ pour multiplier, diviser, conjuguer et élever des complexes à une puissance.",
    pages: "10-12",
    section: "III-1-c. Forme exponentielle",
    durationMinutes: 50,
    body: String.raw`## Définition

Pour tout réel $\theta$, on pose

$$
e^{i\theta}=\cos\theta+i\sin\theta.
$$

La **forme exponentielle** d’un complexe non nul de module $r$ et d’argument $\theta$ est

$$
z=re^{i\theta}.
$$

Exemples :

$$
2+2i=2\sqrt2e^{i\pi/4},
\qquad
4i=4e^{i\pi/2},
\qquad
5=5e^{i0}.
$$

## Règles de calcul

Pour $z=re^{i\theta}$ et $z'=r'e^{i\varphi}$ :

$$
\overline z=re^{-i\theta},
\qquad
\frac1z=\frac1r e^{-i\theta},
$$

$$
zz'=rr'e^{i(\theta+\varphi)},
\qquad
\frac{z'}z=\frac{r'}r e^{i(\varphi-\theta)},
\qquad
z^n=r^ne^{in\theta}.
$$

Deux formes exponentielles représentent le même nombre si leurs modules sont égaux et leurs arguments congrus modulo $2\pi$.

## Quotient officiel guidé

$$
1+i=\sqrt2e^{i\pi/4},
\qquad
1+i\sqrt3=2e^{i\pi/3}.
$$

Alors

$$
\frac{1+i}{1+i\sqrt3}
=\frac{\sqrt2}{2}e^{i(\pi/4-\pi/3)}
=\frac{\sqrt2}{2}e^{-i\pi/12}.
$$

> **Astuce mémoire de Davy.** Produit : modules multipliés, angles additionnés. Quotient : modules divisés, angles soustraits.` ,
    keyPoint: "$z=re^{i\\theta}$ ; produit $\\Rightarrow$ addition des arguments, quotient $\\Rightarrow$ soustraction.",
    example: "$(2e^{i\\pi/3})(3e^{-i\\pi/6})=6e^{i\\pi/6}$.",
    methodSteps: [
      "Convertis chaque nombre en module×exponentielle.",
      "Calcule séparément les modules.",
      "Additionne ou soustrais les arguments selon l’opération.",
      "Ramène l’angle modulo 2π si nécessaire.",
    ],
    timeline: [
      { label: "Convertir", detail: "Trouve r et θ." },
      { label: "Modules", detail: "Multiplie ou divise les réels positifs." },
      { label: "Arguments", detail: "Additionne ou soustrais les angles." },
      { label: "Normaliser", detail: "Ramène l’angle dans un intervalle lisible." },
    ],
    questions: [
      choice("Par définition, $e^{i\\theta}$ vaut :", ["$\\cos\\theta+i\\sin\\theta$", "$\\cos\\theta-i\\sin\\theta$", "$\\sin\\theta+i\\cos\\theta$", "$e^\\theta+i$"], 0, "C’est la notation exponentielle complexe.", "Définition • page 10"),
      choice("La forme exponentielle de $1+i$ est :", ["$\\sqrt2e^{i\\pi/4}$", "$2e^{i\\pi/4}$", "$\\sqrt2e^{-i\\pi/4}$", "$e^{i\\pi/2}$"], 0, "Module √2, argument π/4.", "Exercice de fixation • page 11"),
      choice("La forme exponentielle de $1+i\\sqrt3$ est :", ["$2e^{i\\pi/3}$", "$2e^{i\\pi/6}$", "$\\sqrt3e^{i\\pi/3}$", "$2e^{-i\\pi/3}$"], 0, "Module 2, argument π/3.", "Exercice de fixation • page 11"),
      choice("Si $z=re^{i\\theta}$, alors $\\overline z$ vaut :", ["$re^{-i\\theta}$", "$-re^{i\\theta}$", "$r^{-1}e^{i\\theta}$", "$re^{i(\\theta+\\pi)}$"], 0, "La conjugaison change le signe de l’argument.", "Propriété • page 11"),
      choice("La forme exponentielle de $(1+i)/(1+i\\sqrt3)$ est :", ["$\\frac{\\sqrt2}{2}e^{-i\\pi/12}$", "$\\sqrt2e^{i7\\pi/12}$", "$2\\sqrt2e^{-i\\pi/12}$", "$\\frac12e^{i\\pi/12}$"], 0, "On divise les modules et on soustrait les arguments.", "Exercice de fixation • page 12", 2),
      choice("Si $z=re^{i\\theta}$, alors $z^n$ vaut :", ["$r^ne^{in\\theta}$", "$re^{in\\theta}$", "$r^ne^{i\\theta}$", "$nr e^{i\\theta}$"], 0, "La puissance porte sur le module et multiplie l’argument.", "Propriété • page 11"),
      short("Calcule $e^{i\\pi}$.", ["-1", "−1"], "cosπ+i sinπ=−1.", "Conséquence de la définition"),
      short("Donne le module de $4e^{-i\\pi/7}$.", ["4", "+4"], "Dans re^{iθ}, le module est r>0.", "Application guidée"),
    ],
  },
  {
    id: "moivre-linearization",
    title: "Formules de Moivre et d’Euler",
    summary: "Calculer de grandes puissances et linéariser les puissances de sinus ou de cosinus.",
    pages: "12-13",
    section: "III-2. Formule de Moivre et applications",
    durationMinutes: 55,
    body: String.raw`## Formule de Moivre

Pour $\theta\in\mathbb R$ et $n\in\mathbb Z$ :

$$
(\cos\theta+i\sin\theta)^n
=\cos(n\theta)+i\sin(n\theta).
$$

Elle permet de calculer rapidement les puissances d’un complexe de module $1$.

Exemple officiel :

$$
\left(\frac12+i\frac{\sqrt3}{2}\right)^{300}
=\left(\cos\frac\pi3+i\sin\frac\pi3\right)^{300}
=\cos(100\pi)+i\sin(100\pi)=1.
$$

## Formules d’Euler

$$
\cos\theta=\frac{e^{i\theta}+e^{-i\theta}}2,
\qquad
\sin\theta=\frac{e^{i\theta}-e^{-i\theta}}{2i}.
$$

Elles servent à **linéariser** une puissance trigonométrique, c’est-à-dire à la transformer en combinaison de sinus ou cosinus d’angles multiples.

## Exemple officiel : linéariser $\cos^4\alpha$

En développant $((e^{i\alpha}+e^{-i\alpha})/2)^4$ puis en regroupant les termes conjugués :

$$
\cos^4\alpha
=\frac18\cos(4\alpha)
+\frac12\cos(2\alpha)
+\frac38.
$$

Un autre résultat utile, obtenu de la même manière, est :

$$
\sin^3x=\frac{3\sin x-\sin3x}{4}.
$$

> **Astuce mémoire de Davy.** Moivre sert à monter une puissance ; Euler sert souvent à redescendre une puissance de sinus ou cosinus vers des angles multiples.` ,
    keyPoint: "$(\\cos\\theta+i\\sin\\theta)^n=\\cos(n\\theta)+i\\sin(n\\theta)$.",
    example: "$(\\cos(\\pi/3)+i\\sin(\\pi/3))^{300}=1$.",
    methodSteps: [
      "Mets le complexe sous forme trigonométrique.",
      "Élève le module à la puissance n et multiplie l’argument par n.",
      "Pour linéariser, remplace cos et sin par les formules d’Euler.",
      "Développe puis regroupe e^{ikx} avec e^{-ikx}.",
    ],
    timeline: [
      { label: "Forme", detail: "Repère le module et l’argument." },
      { label: "Moivre", detail: "Multiplie l’angle par l’exposant." },
      { label: "Euler", detail: "Écris cos et sin avec les exponentielles." },
      { label: "Regrouper", detail: "Recompose des cosinus ou sinus." },
    ],
    questions: [
      choice("Que vaut $(\\cos\\theta+i\\sin\\theta)^n$ ?", ["$\\cos(n\\theta)+i\\sin(n\\theta)$", "$n\\cos\\theta+in\\sin\\theta$", "$\\cos^n\\theta+i\\sin^n\\theta$", "$e^{n\\theta}$"], 0, "C’est la formule de Moivre.", "Propriété • page 12"),
      short("Calcule $(1/2+i\\sqrt3/2)^{300}$.", ["1", "+1"], "L’argument devient 100π.", "Exercice de fixation • page 12", 2),
      choice("Quelle formule d’Euler est correcte ?", ["$\\cos\\theta=(e^{i\\theta}+e^{-i\\theta})/2$", "$\\cos\\theta=(e^{i\\theta}-e^{-i\\theta})/2$", "$\\cos\\theta=e^{i\\theta}$", "$\\cos\\theta=2e^{i\\theta}$"], 0, "La somme de deux exponentielles conjuguées est réelle.", "Propriété • page 13"),
      choice("Quelle formule d’Euler donne le sinus ?", ["$\\sin\\theta=(e^{i\\theta}-e^{-i\\theta})/(2i)$", "$\\sin\\theta=(e^{i\\theta}+e^{-i\\theta})/(2i)$", "$\\sin\\theta=e^{-i\\theta}$", "$\\sin\\theta=2ie^{i\\theta}$"], 0, "La différence divisée par 2i donne le sinus.", "Propriété • page 13"),
      choice("La linéarisation correcte de $\\cos^4\\alpha$ est :", ["$\\frac18\\cos4\\alpha+\\frac12\\cos2\\alpha+\\frac38$", "$\\cos4\\alpha$", "$\\frac14\\cos4\\alpha+\\frac34$", "$\\frac12\\cos2\\alpha$"], 0, "C’est le résultat du développement officiel.", "Exercice de fixation • page 13", 2),
      choice("Pourquoi regroupe-t-on $e^{ikx}$ et $e^{-ikx}$ ?", ["Pour reconstruire $2\\cos(kx)$", "Pour obtenir zéro", "Pour calculer un module", "Pour changer le domaine"], 0, "Leur somme vaut 2cos(kx).", "Méthode • page 13"),
      choice("La formule correcte pour $\\sin^3x$ est :", ["$(3\\sin x-\\sin3x)/4$", "$(\\sin3x-3\\sin x)/4$", "$\\sin3x$", "$(3\\cos x-\\cos3x)/4$"], 0, "C’est une linéarisation classique obtenue par Euler.", "Enrichissement SPM • page 185"),
      short("Calcule $(\\cos(\\pi/4)+i\\sin(\\pi/4))^4$.", ["-1", "−1"], "Moivre donne cosπ+i sinπ=−1.", "Application guidée", 2),
      choice("Pour calculer une très grande puissance d’un complexe non nul, la forme la plus efficace est souvent :", ["La forme trigonométrique ou exponentielle", "La forme décimale", "La partie réelle seule", "Une inégalité"], 0, "La puissance agit directement sur le module et l’argument.", "Méthode"),
    ],
  },
  {
    id: "complex-equations",
    title: "Racines carrées et équations du second degré",
    summary: "Trouver les deux racines carrées d’un complexe puis résoudre $az^2+bz+c=0$ avec un discriminant complexe.",
    pages: "13-16 et 20-22",
    section: "III-1 et III-2. Équations dans C ; exercices 4-5",
    durationMinutes: 80,
    kind: "challenge",
    body: String.raw`## Racines carrées d’un complexe

Une racine carrée de $z_0$ est un complexe $z$ tel que $z^2=z_0$. En posant $z=x+iy$ :

$$
z^2=(x^2-y^2)+2xyi.
$$

Le système complet est :

$$
\begin{cases}
x^2+y^2=|z_0|,\\
x^2-y^2=\operatorname{Re}(z_0),\\
2xy=\operatorname{Im}(z_0).
\end{cases}
$$

Tout complexe non nul possède exactement deux racines carrées opposées.

### Exemple officiel : $z_0=8-6i$

Comme $|z_0|=10$ :

$$
\begin{cases}
x^2+y^2=10,\\
x^2-y^2=8,\\
2xy=-6.
\end{cases}
$$

On obtient $x=3$, $y=-1$, puis la racine opposée. Les deux racines sont

$$
3-i\quad\text{et}\quad-3+i.
$$

## Équation du second degré

Pour $a\neq0$ et

$$
az^2+bz+c=0,
\qquad
\Delta=b^2-4ac,
$$

on choisit **une** racine carrée $\delta$ de $\Delta$ :

$$
z_1=\frac{-b-\delta}{2a},
\qquad
z_2=\frac{-b+\delta}{2a}.
$$

Il n’est pas nécessaire de recalculer les deux racines carrées de $\Delta$ : elles sont opposées et les deux signes de la formule les utilisent déjà.

## Les quatre équations de fixation

| Équation | Solutions correctes |
|---|---|
| $z^2+5z-14=0$ | $\{-7;2\}$ |
| $z^2-2iz-1=0$ | $\{i\}$ |
| $z^2+2iz+3=0$ | $\{-3i;i\}$ |
| $z^2-(1+i)z+2-i=0$ | $\{-i;1+2i\}$ |

L’exercice de renforcement

$$
(-2+i)z^2+(4-5i)z+3-i=0
$$

a pour discriminant $11-60i=(6-5i)^2$ et pour solutions

$$
3-i\quad\text{et}\quad-\frac25-\frac15i.
$$

> **Corrections de source.** $(i\sqrt5)^2=-5$, pas $-5i$. De plus, $z^2+5z-14=0$ a pour racines $-7$ et $2$ : le signe moins devant $2$ est une coquille.` ,
    keyPoint: "Pour $z=x+iy$, égaler $z^2$ à $z_0$ donne trois relations réelles ; puis $z=(-b\\pm\\delta)/(2a)$.",
    example: "Les racines carrées de $8-6i$ sont $\\pm(3-i)$.",
    methodSteps: [
      "Calcule le discriminant Δ.",
      "Si Δ n’est pas un carré évident, pose δ=x+iy et résous δ²=Δ avec le système réel.",
      "Utilise une racine δ dans les deux formules (−b±δ)/(2a).",
      "Vérifie les solutions par substitution ou par somme et produit.",
    ],
    timeline: [
      { label: "Discriminant", detail: "Calcule Δ=b²−4ac dans C." },
      { label: "Racine de Δ", detail: "Résous δ²=Δ avec x²−y², 2xy et le module." },
      { label: "Deux solutions", detail: "Applique les signes ±." },
      { label: "Contrôle", detail: "Vérifie somme −b/a et produit c/a." },
    ],
    corrections: [
      "Page 14 : le document écrit (i√5)²=−5i. La bonne identité est (i√5)²=i²×5=−5.",
      "Page 15 : pour z²+5z−14=0, le document affiche {−7;−2}. La seconde racine est 2, car (z+7)(z−2)=0.",
    ],
    questions: [
      choice("Quelles sont les racines carrées de $8-6i$ ?", ["$3-i$ et $-3+i$", "$3+i$ et $-3-i$", "$8-6i$ et $-8+6i$", "$2-i$ et $-2+i$"], 0, "(3−i)²=8−6i ; l’autre racine est son opposée.", "Exercice de fixation • page 14", 2),
      choice("Quelles sont les racines carrées de $-5$ ?", ["$i\\sqrt5$ et $-i\\sqrt5$", "$\\sqrt5$ et $-\\sqrt5$", "$5i$ et $-5i$", "$i$ et $-i$"], 0, "(i√5)²=−5.", "Exercice de fixation corrigé • page 14", 2),
      choice("Dans le système pour $(x+iy)^2=z_0$, quelle relation utilise le module ?", ["$x^2+y^2=|z_0|$", "$x+y=|z_0|$", "$x^2-y^2=|z_0|$", "$2xy=|z_0|$"], 0, "|z|²=x²+y² et |z²|=|z₀|.", "Méthode • page 14"),
      choice("Les solutions de $z^2+5z-14=0$ sont :", ["$-7$ et $2$", "$-7$ et $-2$", "$7$ et $-2$", "$7$ et $2$"], 0, "L’équation se factorise en (z+7)(z−2).", "Exercice de fixation corrigé • page 15", 2),
      short("Résous $z^2-2iz-1=0$.", ["i", "{i}", "z=i"], "Le discriminant est nul et la racine double vaut i.", "Exercice de fixation • page 15", 2),
      choice("L’ensemble des solutions de $z^2+2iz+3=0$ est :", ["$\\{-3i;i\\}$", "$\\{-i;3i\\}$", "$\\{-3;1\\}$", "$\\{3i;i\\}$"], 0, "Δ=−16 et une racine carrée est 4i.", "Exercice de fixation • page 15", 2),
      choice("L’ensemble des solutions de $z^2-(1+i)z+2-i=0$ est :", ["$\\{-i;1+2i\\}$", "$\\{i;1-2i\\}$", "$\\{-1;i\\}$", "$\\{1+i;2-i\\}$"], 0, "Δ=−8+6i=(1+3i)².", "Exercice de fixation • pages 15-16", 2),
      choice("Pour résoudre avec Δ≠0, combien de racines carrées de Δ faut-il calculer explicitement ?", ["Une seule", "Deux obligatoirement", "Aucune", "Quatre"], 0, "Les deux racines sont opposées et le ± de la formule suffit.", "Remarque • page 16"),
      choice("Le discriminant de $(-2+i)z^2+(4-5i)z+3-i=0$ est :", ["$11-60i$", "$11+60i$", "$-11-60i$", "$6-5i$"], 0, "b²−4ac=11−60i.", "Exercice 4 • page 20", 2),
      choice("Une racine carrée de $11-60i$ est :", ["$6-5i$", "$5-6i$", "$6+5i$", "$11-60i$"], 0, "(6−5i)²=11−60i.", "Exercice 4 • page 20", 2),
      choice("Les solutions de l’exercice 4 sont :", ["$3-i$ et $-2/5-i/5$", "$3+i$ et $2/5-i/5$", "$-3+i$ et $2/5+i/5$", "$6-5i$ et $-6+5i$"], 0, "Application de la formule avec a=−2+i.", "Exercice 4 • page 20", 3),
      choice("Si les coefficients a,b,c sont réels et Δ<0, les deux solutions sont :", ["Complexes conjuguées", "Réelles égales", "Toujours imaginaires pures", "Toujours nulles"], 0, "Une racine de Δ est i√(−Δ), d’où deux solutions conjuguées.", "Remarque • page 16"),
      short("Quel est le produit des racines de $z^2-(1+i)z+2-i=0$ ?", ["2-i", "2−i", "2 - i"], "Pour une équation unitaire, le produit vaut c=2−i.", "Contrôle de l’exercice • page 15"),
    ],
  },
  {
    id: "roots-of-unity",
    title: "Racines n-ièmes et mission de synthèse",
    summary: "Construire les racines $n$-ièmes sur un cercle, maîtriser les racines de l’unité et résoudre les exercices d’approfondissement.",
    pages: "16-24",
    section: "III-3. Racines n-ièmes, situation complexe et exercices d’approfondissement",
    durationMinutes: 95,
    kind: "challenge",
    body: String.raw`## Racines $n$-ièmes d’un complexe non nul

Soit $Z_0=Re^{i\theta}$ et $n\ge2$. Les solutions de $z^n=Z_0$ sont

$$
z_k=\sqrt[n]{R}\,e^{i(\theta+2k\pi)/n},
\qquad
k\in\{0,1,\ldots,n-1\}.
$$

Elles ont toutes le même module $\sqrt[n]R$ et leurs images sont les sommets d’un polygone régulier à $n$ côtés.

### Exemple officiel

$$
Z=8(1+i\sqrt3)=16e^{i\pi/3}.
$$

Ses racines quatrièmes ont le module $2$ et les arguments

$$
\frac\pi{12},\quad\frac{7\pi}{12},\quad\frac{13\pi}{12},\quad\frac{19\pi}{12}.
$$

## Racines de l’unité

Les solutions de $z^n=1$ sont

$$
z_k=e^{2ik\pi/n},
\qquad
k=0,1,\ldots,n-1.
$$

Cas à connaître :

| $n$ | Racines |
|---|---|
| $2$ | $1,-1$ |
| $3$ | $1,j,\overline j$ avec $j=-\frac12+i\frac{\sqrt3}{2}$ et $1+j+j^2=0$ |
| $4$ | $1,i,-1,-i$ |

Pour $n\ge2$, la somme des $n$ racines de l’unité vaut $0$.

## Mission officielle : une somme de deux carrés

Supposons

$$
A=x^2+y^2,
\qquad x,y\in\mathbb N.
$$

Posons $z=x+iy$. Alors $A=|z|^2$. Comme le produit de deux nombres à coordonnées entières conserve des coordonnées entières, une récurrence donne

$$
z^n=x_n+iy_n,
\qquad x_n,y_n\in\mathbb Z.
$$

Par conséquent :

$$
A^n=(|z|^2)^n=|z^n|^2=x_n^2+y_n^2.
$$

Donc, si $A$ est somme de deux carrés, alors $A^n$ l’est encore pour tout entier $n\ge1$.

## Atelier d’approfondissement du document

Pour

$$
P(z)=z^3+(-1+i)z^2+(2+2i)z+8i,
$$

la racine imaginaire pure est $2i$ et

$$
P(z)=(z-2i)\bigl(z^2+(-1+3i)z-4\bigr).
$$

Ses racines sont $2i$, $2-2i$ et $-1-i$. Avec

$$
z_A=-1-i,\quad z_B=2-2i,\quad z_C=2i,
$$

on trouve

$$
\frac{z_B-z_A}{z_C-z_A}=-i,
$$

donc $ABC$ est rectangle isocèle en $A$. Le quatrième sommet du parallélogramme $ABCD$ a pour affixe $-3+3i$. Le point $E$ d’affixe $2+2i$ appartient, avec $A,B,C$, au cercle de centre d’affixe $1$ et de rayon $\sqrt5$.

Enfin, l’équation

$$
z^3+(-8+i)z^2+(17-8i)z+17i=0
$$

se factorise en

$$
(z+i)(z^2-8z+17)=0,
$$

et ses solutions sont $-i$, $4-i$ et $4+i$.

> **Corrections de source.** Pour $n=3$, l’indice est $k\in\{0,1,2\}$, pas $\{0,1,3\}$. La somme des racines s’écrit $\sum_{k=0}^{n-1}z_k=0$, et non jusqu’à $n$.

> **Astuce mémoire de Davy.** Une racine $n$-ième, c’est deux partages : la racine $n$-ième du module et le partage de l’angle en $n$ directions régulièrement espacées.` ,
    keyPoint: "$z_k=\\sqrt[n]R\\,e^{i(\\theta+2k\\pi)/n}$ pour $k=0,\\ldots,n-1$.",
    example: "Les racines quatrièmes de $16e^{i\\pi/3}$ ont module $2$ et arguments $\\pi/12+k\\pi/2$.",
    methodSteps: [
      "Mets le second membre sous forme exponentielle Re^{iθ}.",
      "Prends la racine n-ième positive du module.",
      "Calcule (θ+2kπ)/n pour k=0,…,n−1.",
      "Contrôle le nombre de solutions et leur répartition régulière sur le cercle.",
    ],
    timeline: [
      { label: "Module", detail: "Chaque racine a le module R^{1/n}." },
      { label: "Premier angle", detail: "Divise un argument θ par n." },
      { label: "Pas", detail: "Ajoute 2π/n pour obtenir la suivante." },
      { label: "Contrôle", detail: "Il faut exactement n solutions distinctes." },
    ],
    interaction: rootsInteraction,
    corrections: [
      "Page 17 : pour les racines cubiques de l’unité, l’ensemble d’indices imprimé {0;1;3} doit être {0;1;2}.",
      "Page 18 : la somme est indexée de k=0 à n dans le document. Comme il y a n racines numérotées de 0 à n−1, la formule correcte est Σ(k=0 à n−1) zₖ=0.",
    ],
    questions: [
      choice("Combien l’équation $z^n=Z_0\\neq0$ possède-t-elle de solutions distinctes ?", ["$n$", "$n-1$", "$2n$", "Une seule"], 0, "Il existe exactement n racines n-ièmes.", "Propriété 1 • page 16"),
      choice("Quel est le module des racines quatrièmes de $16e^{i\\pi/3}$ ?", ["$2$", "$4$", "$16$", "$\\sqrt2$"], 0, "La racine quatrième de 16 vaut 2.", "Exercice de fixation • pages 16-17", 2),
      choice("Quel est le pas angulaire entre deux racines quatrièmes consécutives ?", ["$\\pi/2$", "$\\pi/4$", "$2\\pi$", "$\\pi$"], 0, "Le pas est 2π/4=π/2.", "Exercice de fixation • pages 16-17"),
      choice("Les arguments des racines quatrièmes de $16e^{i\\pi/3}$ sont :", ["$\\pi/12,7\\pi/12,13\\pi/12,19\\pi/12$", "$\\pi/3,2\\pi/3,\\pi,4\\pi/3$", "$\\pi/12,\\pi/6,\\pi/4,\\pi/3$", "$0,\\pi/2,\\pi,3\\pi/2$"], 0, "Ils sont π/12+kπ/2.", "Exercice de fixation • pages 16-17", 3),
      choice("Les racines quatrièmes de l’unité sont :", ["$1,i,-1,-i$", "$1,-1$", "$1,j,j^2$", "$1,i$"], 0, "Elles ont les arguments 0, π/2, π et 3π/2.", "Exercice de fixation • page 17"),
      choice("Pour $j=-1/2+i\\sqrt3/2$, quelle relation est vraie ?", ["$1+j+j^2=0$", "$j^2=1$", "$j^3=-1$", "$j=\\overline j$"], 0, "j est une racine cubique non réelle de l’unité.", "Exercice de fixation • page 17"),
      short("Quelle est la somme des cinq racines de $z^5=1$ ?", ["0", "+0"], "Pour n≥2, la somme des racines n-ièmes de l’unité vaut 0.", "Remarque corrigée • page 18", 2),
      choice("Géométriquement, les racines n-ièmes de $Z_0$ sont :", ["Les sommets d’un polygone régulier", "Toujours alignées", "Toutes confondues", "Les sommets d’un triangle seulement"], 0, "Même rayon et pas angulaire constant.", "Propriété 2 • page 16"),
      choice("Dans la mission, pourquoi $A=x^2+y^2$ s’écrit-il $|x+iy|^2$ ?", ["Parce que $|x+iy|^2=x^2+y^2$", "Parce que $i=1$", "Parce que x=y", "Parce que A est premier"], 0, "C’est l’identité fondamentale du module.", "Situation complexe • pages 18-19"),
      choice("Quelle étape prouve que les coordonnées de $(x+iy)^n$ restent entières ?", ["Une récurrence utilisant le produit complexe", "L’inégalité triangulaire", "La dérivation", "Une limite"], 0, "Le produit de deux complexes à coordonnées entières garde des coordonnées entières.", "Situation complexe • pages 18-19", 2),
      choice("Si $A=x^2+y^2$, la conclusion correcte est :", ["$A^n=x_n^2+y_n^2$ pour tout $n\\ge1$", "$A^n=x+y$", "$A^n$ n’est jamais une somme de carrés", "$A^n=|x+iy|$"], 0, "Aⁿ=|zⁿ|².", "Situation complexe • page 19", 2),
      short("Dans l’exercice 5, quelle est la racine imaginaire pure de $P$ ?", ["2i", "+2i"], "La substitution z=αi donne α=2.", "Exercice 5 • pages 20-21", 2),
      choice("Quelle factorisation de $P$ est correcte ?", ["$(z-2i)(z^2+(-1+3i)z-4)$", "$(z+2i)(z^2-z+4)$", "$(z-2)(z^2+3iz-4)$", "$(z-i)(z^2+z+8)$"], 0, "Identification des coefficients après extraction de z−2i.", "Exercice 5 • pages 21-22", 3),
      choice("Quelles sont les racines de $P$ ?", ["$2i,2-2i,-1-i$", "$-2i,2+2i,-1+i$", "$2i,2+2i,1-i$", "$i,-i,2$"], 0, "Le facteur quadratique utilise les racines de 8−6i.", "Exercice 5 • page 22", 3),
      choice("Quelle est la nature du triangle ABC de l’exercice 5 ?", ["Rectangle isocèle en A", "Équilatéral", "Rectangle en B", "Quelconque"], 0, "Le quotient des affixes de deux côtés vaut −i.", "Exercice 5 • page 22", 2),
      short("Donne l’affixe du point D pour que ABCD soit un parallélogramme.", ["-3+3i", "-3 + 3i", "3i-3"], "zD−zC=zA−zB, donc zD=−3+3i.", "Exercice 5 • page 22", 2),
      choice("Quel est le centre du cercle passant par A, B, C et E ?", ["Le point d’affixe $1$", "L’origine", "Le point d’affixe $i$", "Le point d’affixe $2$"], 0, "C’est le milieu de [BC].", "Exercice 5 • page 23", 2),
      short("Quel est le rayon de ce cercle ?", ["√5", "sqrt(5)", "racine de 5"], "La distance du centre à C vaut |−1+2i|=√5.", "Exercice 5 • page 23", 2),
      choice("Pour les racines quatrièmes de $-i$, quelle est la somme des quatre racines ?", ["$0$", "$1$", "$-i$", "$i$"], 0, "Le coefficient de z³ dans z⁴+i est nul.", "Exercice 6 • page 23", 2),
      choice("Quel est le produit des racines de $z^4=-i$ ?", ["$i$", "$-i$", "$1$", "$-1$"], 0, "L’équation est z⁴+i=0 ; le produit vaut le terme constant i.", "Exercice 6 • page 23", 2),
      short("Quelle est la solution imaginaire pure de $z^3+(-8+i)z^2+(17-8i)z+17i=0$ ?", ["-i", "−i"], "La substitution z=−i annule le polynôme.", "Exercice 7 • pages 23-24", 2),
      choice("Quelle factorisation correspond à l’exercice 7 ?", ["$(z+i)(z^2-8z+17)$", "$(z-i)(z^2+8z+17)$", "$(z+i)(z^2-8z-17)$", "$(z-i)(z^2-8z+17)$"], 0, "La division par z+i donne z²−8z+17.", "Exercice 7 • pages 23-24", 3),
      choice("Quelles sont toutes les solutions de l’exercice 7 ?", ["$-i,4-i,4+i$", "$i,-4-i,-4+i$", "$-i,8-i,8+i$", "$i,4,17$"], 0, "z²−8z+17=0 a pour racines 4±i.", "Exercice 7 • pages 23-24", 3),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCComplexNumbersPath: LearningPath = {
  id: "terminale-c-math-l09-complex-numbers",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 4, title: "Calculs algébriques" },
  chapterNumber: 9,
  title: "Nombres complexes",
  description: "Forme algébrique, conjugué, module, plan complexe, arguments, formes trigonométrique et exponentielle, Moivre, Euler et équations.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer sans erreur dans l’ensemble des nombres complexes",
    "Relier affixe, coordonnées, module, distance et argument",
    "Passer entre les formes algébrique, trigonométrique et exponentielle",
    "Utiliser Moivre et Euler pour les puissances et les linéarisations",
    "Résoudre des équations du second degré et des équations zⁿ=Z₀",
    "Réussir les exercices officiels de fixation, renforcement et approfondissement",
  ],
  modules: [
    {
      id: "terminale-c-math-l09-complex-numbers-mastery",
      title: "Maîtriser les nombres complexes",
      description: "Dix niveaux progressifs, 110 questions guidées, deux figures interactives et les corrections explicites des coquilles du document.",
      lessons: builtLevels,
    },
  ],
};
