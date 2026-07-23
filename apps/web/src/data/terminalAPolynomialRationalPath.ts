import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 01 fonctions polynôme et fonctions rationnelles.pdf";

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
  xp: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  timeline: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  /** Quand une figure aide à comprendre, la courbe interactive remplace la frise de repères. */
  curve?: CurveLessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
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
      eyebrow: `Niveau ${index} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.curve ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Suivre le raisonnement",
      instruction: "Parcours les étapes essentielles de cette partie avant de passer à la méthode.",
      observation: "Chaque repère reprend le contenu du cours sans remplacer les définitions et propriétés.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique cette démarche aux exercices du document source.",
      steps: seed.methodSteps,
      example: {
        prompt: "Exemple du cours",
        work: seed.example,
        result: seed.keyPoint,
      },
      tip: "Écris toujours la propriété utilisée avant le calcul lorsque la consigne demande de justifier.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "polynomial-limit-at-point",
    title: "Limite d’une fonction polynôme en un point",
    summary: "Comprendre l’unicité d’une limite et calculer la limite d’un polynôme en remplaçant directement la variable.",
    pages: "1-3",
    section: "I-1. Limite d’une fonction polynôme en un point",
    durationMinutes: 18,
    xp: 50,
    body: String.raw`## Notion de limite en un point

Lorsque les valeurs de $f(x)$ se rapprochent d’un nombre $L$ lorsque $x$ prend des valeurs suffisamment proches de $a$, on dit que $L$ est la **limite** de $f$ en $a$.

On note : $$\lim_{x\to a}f(x)=L$$

### Observer une limite sur un exemple

Pour $P(x)=2x+1$, observe les images lorsque $x$ se rapproche de $4$ :

| $x$ | 3,9 | 3,99 | 3,999 | 4 | 4,001 | 4,01 | 4,1 |
|---|---|---|---|---|---|---|---|
| $P(x)$ | 8,8 | 8,98 | 8,998 | **9** | 9,002 | 9,02 | 9,2 |

Les images se resserrent autour de $9=P(4)$ : c’est exactement l’idée de limite en un point.

## Propriété 1 - Unicité

Lorsqu’une fonction admet une limite en un point ou à l’infini, cette limite est unique.

## Propriété 2 - Polynôme en un réel

La limite d’une fonction polynôme $P$ en un réel $a$ est égale à l’image de $a$ par $P$ :

$$\lim_{x\to a}P(x)=P(a)$$

En particulier, si $k$ est une constante réelle : $\lim_{x\to a}k=k$.

> **Pourquoi ?** Un polynôme est continu sur $\mathbb{R}$. Il ne présente ni rupture ni valeur interdite : au voisinage de $a$, ses images se rapprochent donc de $P(a)$.

> **Erreur fréquente.** Ne confonds pas « limite en un réel $a$ » et « limite à l’infini » : ici $x$ se rapproche d’un nombre fixé, et aucun tableau n’est nécessaire — on remplace simplement $x$ par $a$.`,
    keyPoint: "Pour un polynôme en un réel : on remplace x par a. La limite, si elle existe, est unique.",
    example: "Pour $P(x)=2x+1$, $\\lim_{x\\to4}P(x)=P(4)=9$.",
    methodSteps: [
      "Vérifie que l’expression est un polynôme ou une constante.",
      "Remplace x par la valeur a indiquée sous la limite.",
      "Effectue le calcul puis écris la conclusion avec la notation de limite.",
    ],
    timeline: [
      { label: "Repérer", detail: "Identifier la valeur a vers laquelle tend x." },
      { label: "Remplacer", detail: "Calculer directement P(a)." },
      { label: "Conclure", detail: "Écrire la limite obtenue, qui est unique." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Approche x de 4 sur la courbe",
      instruction: "Déplace le point sur la droite et rapproche x de 4 : que devient f(x) ?",
      observation: "Plus x est proche de 4, plus f(x) est proche de 9 = P(4) : la limite d’un polynôme en un réel est son image.",
      formula: "f(x) = 2x + 1",
      formulaTex: "f(x)=2x+1",
      rule: { kind: "linear", coefficient: 2, constant: 1 },
      window: { xMin: -1, xMax: 8, yMin: -2, yMax: 18 },
      guides: [
        { kind: "vertical", value: 4, label: "x = 4" },
        { kind: "horizontal", value: 9, label: "y = 9" },
      ],
      marker: { min: 0, max: 8, step: 0.1, initial: 1 },
    },
    questions: [
      choice("La limite d’une fonction en un réel peut prendre deux valeurs différentes.", ["Vrai", "Faux"], 1, "Lorsqu’elle existe, une limite est unique.", "Exercice de fixation 1 - affirmation 1"),
      choice("La limite d’une fonction en un réel ne peut prendre qu’une seule valeur.", ["Vrai", "Faux"], 0, "C’est la propriété d’unicité de la limite.", "Exercice de fixation 1 - affirmation 2"),
      short("Calcule $\\lim_{x\\to4}(2x+1)$.", ["9"], "On remplace x par 4 : $2\\times4+1=9$.", "Exercice de fixation 2 - question 1"),
      short("Calcule $\\lim_{x\\to3}(x-3)(3x+8)$.", ["0"], "Le facteur $x-3$ vaut 0 en 3, donc le produit vaut 0.", "Exercice de fixation 2 - question 2"),
      short("Calcule $\\lim_{x\\to-1}(-13)$.", ["-13"], "La limite d’une constante est cette constante.", "Exercice de fixation 2 - question 3"),
      short("Détermine $\\lim_{x\\to4}(-2x+10x^3)$.", ["632"], "$-2(4)+10(4^3)=-8+640=632$.", "Exercice de maison", 2),
      short("Détermine $\\lim_{x\\to5}(2x+1)$.", ["11"], "$2(5)+1=11$.", "D-Exercice 2 - question 1"),
      short("Détermine $\\lim_{x\\to-53}2020$.", ["2020"], "La limite d’une constante est la constante.", "D-Exercice 2 - question 2"),
      short("Détermine $\\lim_{x\\to4}(-x+10x^3)$.", ["636"], "$-4+10(4^3)=-4+640=636$.", "D-Exercice 2 - question 3"),
      short("Détermine $\\lim_{x\\to-2}(3x^3-x^2+2x-1)$.", ["-33"], "La substitution donne $3(-8)-4-4-1=-33$.", "D-Exercice 2 - question 4"),
      short("Détermine $\\lim_{x\\to0}(x^2-3x^2+2x+2021)$.", ["2021"], "Tous les termes contenant x s’annulent en 0.", "D-Exercice 2 - question 5"),
    ],
  },
  {
    id: "polynomial-limit-at-infinity",
    title: "Limite d’une fonction polynôme à l’infini",
    summary: "Déterminer le comportement d’un monôme puis utiliser le terme de plus haut degré d’un polynôme.",
    pages: "3-4",
    section: "I-2. Limite d’une fonction polynôme à l’infini",
    durationMinutes: 22,
    xp: 55,
    body: String.raw`## Limite infinie

Dire que $f(x)$ tend vers $+\infty$ lorsque $x$ tend vers $+\infty$ signifie que les valeurs de $f(x)$ deviennent aussi grandes que l’on veut lorsque $x$ prend des valeurs suffisamment grandes.

On note : $$\lim_{x\to+\infty}f(x)=+\infty$$

## Limite d’un monôme $ax^n$

Soient $a\neq0$ et $n$ un entier naturel non nul.

### Cas où $n$ est pair ($x^n$ positif aux deux infinis)

| | $x\to+\infty$ | $x\to-\infty$ |
|---|---|---|
| $a>0$ | $+\infty$ | $+\infty$ |
| $a<0$ | $-\infty$ | $-\infty$ |

### Cas où $n$ est impair ($x^n$ change de signe)

| | $x\to+\infty$ | $x\to-\infty$ |
|---|---|---|
| $a>0$ | $+\infty$ | $-\infty$ |
| $a<0$ | $-\infty$ | $+\infty$ |

Une constante $k$ garde pour limite $k$, aussi bien en $+\infty$ qu’en $-\infty$ : $\lim_{x\to+\infty}k=\lim_{x\to-\infty}k=k$.

## Propriété fondamentale

La limite d’une fonction polynôme à l’infini est égale à la limite de son monôme de plus haut degré.

### Pourquoi le terme dominant gagne

Compare les termes de $-3x^3+2x$ pour $x=100$ : $-3x^3=-3\,000\,000$ tandis que $2x=200$ seulement. Dès que $x$ devient grand, le monôme de plus haut degré écrase tous les autres.

> **Erreur fréquente.** N’additionne pas les limites de chaque terme — tu tomberais sur la forme indéterminée $+\infty-\infty$. Remplace directement le polynôme par son monôme dominant.`,
    keyPoint: "À l’infini, conserve uniquement le monôme de plus haut degré puis étudie son signe.",
    example: "Pour $P(x)=-3x^2+10$, le terme dominant est $-3x^2$ ; ainsi $P(x)\\to-\\infty$ quand $x\\to+\\infty$.",
    methodSteps: [
      "Repère le monôme dont le degré est le plus élevé.",
      "Observe si le degré est pair ou impair.",
      "Combine le signe du coefficient et le sens de l’infini.",
    ],
    timeline: [
      { label: "Degré", detail: "Choisir le plus grand exposant." },
      { label: "Parité", detail: "Un degré pair garde le même signe aux deux infinis." },
      { label: "Coefficient", detail: "Le signe du coefficient confirme ou inverse le résultat." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Le monôme dominant impose la direction",
      instruction: "Pousse x vers les bords de la fenêtre : dans quelle direction part la courbe ?",
      observation: "Aux extrémités, la courbe suit son monôme dominant -3x³ : il monte vers +∞ en -∞ et plonge vers -∞ en +∞.",
      formula: "f(x) = -3x³ + 2x",
      formulaTex: "f(x)=-3x^3+2x",
      rule: { kind: "polynomial", coefficients: [0, 2, 0, -3] },
      window: { xMin: -3, xMax: 3, yMin: -70, yMax: 70 },
      marker: { min: -3, max: 3, step: 0.1, initial: 0.5 },
    },
    questions: [
      choice("$\\lim_{x\\to+\\infty}(-3x^3)=-\\infty$.", ["Vrai", "Faux"], 0, "Un cube tend vers +∞ en +∞ ; multiplié par -3, il tend vers -∞.", "Exercice de fixation 1 - affirmation 1"),
      choice("$\\lim_{x\\to+\\infty}(-4x^2)=+\\infty$.", ["Vrai", "Faux"], 1, "$x^2$ est positif et le coefficient -4 impose -∞.", "Exercice de fixation 1 - affirmation 2"),
      choice("$\\lim_{x\\to-\\infty}(-x^3)=-\\infty$.", ["Vrai", "Faux"], 1, "$x^3\\to-\\infty$ ; son opposé tend vers +∞.", "Exercice de fixation 1 - affirmation 3"),
      choice("$\\lim_{x\\to-\\infty}(-x)=-\\infty$.", ["Vrai", "Faux"], 1, "Quand x tend vers -∞, -x tend vers +∞.", "Exercice de fixation 1 - affirmation 4"),
      short("Détermine $\\lim_{x\\to-\\infty}(-3x^3+2x)$.", ["+∞", "+infini"], "Le terme dominant $-3x^3$ tend vers +∞ en -∞.", "Exercice de fixation 2 - question 1"),
      short("Détermine $\\lim_{x\\to+\\infty}(-3x^2+10)$.", ["-∞", "-infini"], "Le terme dominant $-3x^2$ tend vers -∞.", "Exercice de fixation 2 - question 2"),
      short("Détermine $\\lim_{x\\to-\\infty}(-3x^3+2x+x^5)$.", ["-∞", "-infini"], "Le terme dominant $x^5$ tend vers -∞.", "Exercice de maison - question 1", 2),
      short("Détermine $\\lim_{x\\to+\\infty}(2x-100)$.", ["+∞", "+infini"], "Le terme dominant 2x tend vers +∞.", "Exercice de maison - question 2"),
      short("Détermine $\\lim_{x\\to-\\infty}(-x^4-6x^3+1)$.", ["-∞", "-infini"], "Le terme dominant $-x^4$ tend vers -∞.", "D-Exercice non numéroté - question 3"),
      short("Détermine $\\lim_{x\\to+\\infty}(-3x^2+x^3-99x+7)$.", ["+∞", "+infini"], "Le terme dominant $x^3$ tend vers +∞.", "D-Exercice non numéroté - question 4"),
    ],
  },
  {
    id: "rational-limit-defined-point",
    title: "Limite d’une fonction rationnelle en un point de son domaine",
    summary: "Calculer une limite par substitution lorsque le dénominateur ne s’annule pas.",
    pages: "5",
    section: "II-1.1. Limite en un nombre où la fonction est définie",
    durationMinutes: 12,
    xp: 40,
    body: String.raw`## Qu’est-ce qu’une fonction rationnelle ?

Une fonction rationnelle est un quotient de deux fonctions polynômes : $f(x)=\frac{P(x)}{Q(x)}$. Elle est définie pour tous les réels qui n’annulent pas son dénominateur $Q$.

## Propriété admise

Soit $f$ une fonction rationnelle et $a$ un élément de son ensemble de définition. Alors :

$$\lim_{x\to a}f(x)=f(a)$$

Pour une écriture $f(x)=\frac{P(x)}{Q(x)}$, la condition essentielle est $Q(a)\neq0$.

### Exemple détaillé

$$\lim_{x\to1}\frac{x}{x+2}=\frac{1}{1+2}=\frac13$$

Le dénominateur vaut $3\neq0$ en $1$ : la substitution directe suffit, exactement comme pour un polynôme.

> Si le dénominateur ne s’annule pas en $a$, aucune étude de signe à gauche et à droite n’est nécessaire. C’est seulement lorsque $Q(a)=0$ que le niveau suivant entre en jeu.`,
    keyPoint: "Si le dénominateur est non nul en a, la limite du quotient est sa valeur f(a).",
    example: "Pour $f(x)=\\frac{x}{x+2}$, le dénominateur vaut 3 en 1, donc la limite vaut $\\frac13$.",
    methodSteps: ["Calcule le dénominateur en a.", "S’il est non nul, remplace x par a au numérateur et au dénominateur.", "Simplifie la fraction obtenue."],
    timeline: [
      { label: "Domaine", detail: "Vérifier que a n’est pas une valeur interdite." },
      { label: "Substitution", detail: "Calculer P(a) et Q(a)." },
      { label: "Simplification", detail: "Réduire la fraction finale." },
    ],
    questions: [
      short("Détermine $\\lim_{x\\to1}\\frac{x}{x+2}$.", ["1/3", "0,333", "0.333"], "Le dénominateur vaut 3 et le numérateur vaut 1.", "Exercice de fixation - question 1"),
      short("Détermine $\\lim_{x\\to-1}\\frac{x^2}{x-2}$.", ["-1/3", "-0,333", "-0.333"], "$(-1)^2=1$ et $-1-2=-3$, donc la limite vaut $-\\frac13$.", "Exercice de fixation - question 2"),
    ],
  },
  {
    id: "one-sided-rational-limits",
    title: "Limites à gauche et à droite d’une valeur interdite",
    summary: "Distinguer les deux côtés d’un réel où le dénominateur s’annule et conclure grâce au signe.",
    pages: "5-7",
    section: "II-1.2.a. Limites latérales de 1/(x-a)",
    durationMinutes: 22,
    xp: 60,
    kind: "graph",
    body: String.raw`## Limite à gauche

Lorsque $x<a$ et se rapproche de $a$, $x-a$ est négatif et se rapproche de zéro. Ainsi :

$$\lim_{x\to a^-}\frac{1}{x-a}=-\infty$$

## Limite à droite

Lorsque $x>a$ et se rapproche de $a$, $x-a$ est positif et se rapproche de zéro. Ainsi :

$$\lim_{x\to a^+}\frac{1}{x-a}=+\infty$$

La notation $a^-$ signifie « vers $a$ avec $x<a$ » ; la notation $a^+$ signifie « vers $a$ avec $x>a$ ».

### Résumé sur l’exemple $a=1$

| $x$ | à gauche de 1 ($x<1$) | $1$ | à droite de 1 ($x>1$) |
|---|---|---|---|
| Signe de $x-1$ | $-$ | $0$ | $+$ |
| $\frac1{x-1}$ | tend vers $-\infty$ | non définie | tend vers $+\infty$ |

> Une très petite quantité négative a un inverse très grand en valeur absolue et négatif ; une très petite quantité positive a un inverse très grand et positif. Par exemple $\frac1{-0{,}001}=-1000$ et $\frac1{0{,}001}=1000$.`,
    keyPoint: "Pour 1/(x-a) : à gauche la limite vaut -∞ ; à droite elle vaut +∞.",
    example: "Pour $\\frac1{x-1}$ : la limite en $1^-$ vaut $-\\infty$ et la limite en $1^+$ vaut $+\\infty$.",
    methodSteps: ["Repère la valeur interdite a.", "Détermine le signe de x-a à gauche puis à droite.", "Utilise le signe du numérateur et celui du dénominateur pour conclure."],
    timeline: [
      { label: "À gauche", detail: "x-a<0 et se rapproche de 0." },
      { label: "Point interdit", detail: "La fonction n’est pas définie en a." },
      { label: "À droite", detail: "x-a>0 et se rapproche de 0." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Traverse la valeur interdite x = 1",
      instruction: "Fais glisser le point de gauche à droite de la valeur interdite : observe le saut de -∞ à +∞.",
      observation: "À gauche de 1 la courbe plonge vers -∞ ; à droite elle redescend de +∞. En x = 1, f n’est pas définie : c’est le mur vertical.",
      formula: "f(x) = 1/(x - 1)",
      formulaTex: "f(x)=\\frac{1}{x-1}",
      rule: { kind: "reciprocal", shift: 1 },
      window: { xMin: -2, xMax: 4, yMin: -8, yMax: 8 },
      guides: [{ kind: "vertical", value: 1, label: "x = 1" }],
      marker: { min: -1.95, max: 3.95, step: 0.05, initial: 0 },
    },
    corrections: ["La conclusion du PDF affichait -∞ pour la limite à droite ; le signe correct est +∞."],
    questions: [
      choice("$\\lim_{x\\to3^-}\\frac1{x-3}=-\\infty$.", ["Vrai", "Faux"], 0, "À gauche de 3, x-3 est négatif.", "Exercice de fixation 1 - a"),
      choice("$\\lim_{x\\to4^-}\\frac1{x-4}=+\\infty$.", ["Vrai", "Faux"], 1, "À gauche de 4, x-4 est négatif : la limite vaut -∞.", "Exercice de fixation 1 - b"),
      choice("$\\lim_{x\\to5^+}\\frac1{x-5}=-\\infty$.", ["Vrai", "Faux"], 1, "À droite de 5, x-5 est positif : la limite vaut +∞.", "Exercice de fixation 1 - c"),
      short("Détermine $\\lim_{x\\to7^+}\\frac1{x-7}$.", ["+∞", "+infini"], "À droite de 7, le dénominateur est positif et proche de zéro.", "Exercice de fixation 2 - a"),
      short("Détermine $\\lim_{x\\to-2^-}\\frac1{x+2}$.", ["-∞", "-infini"], "À gauche de -2, x+2 est négatif et proche de zéro.", "Exercice de fixation 2 - b"),
      short("Détermine $\\lim_{x\\to2^-}\\frac{x^3}{x-2}$.", ["-∞", "-infini"], "Le numérateur tend vers 8>0 et le dénominateur vers 0 par valeurs négatives.", "D-Exercice 3 - question 1"),
      short("Détermine $\\lim_{x\\to5^-}\\frac1{x-5}$.", ["-∞", "-infini"], "Le dénominateur est négatif et proche de zéro.", "D-Exercice 3 - question 2"),
      short("Détermine $\\lim_{x\\to-4^+}\\frac1{x+4}$.", ["+∞", "+infini"], "Le dénominateur est positif et proche de zéro.", "D-Exercice 3 - question 3"),
    ],
  },
  {
    id: "rational-limit-at-infinity",
    title: "Limite d’une fonction rationnelle à l’infini",
    summary: "Comparer les monômes de plus haut degré du numérateur et du dénominateur.",
    pages: "7",
    section: "II-1.2.b. Limite à l’infini d’une fonction rationnelle",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Propriété admise

La limite à l’infini d’une fonction rationnelle est égale à la limite du quotient des monômes de plus haut degré.

Pour $f(x)=\frac{P(x)}{Q(x)}$, on conserve le monôme dominant de $P$ et celui de $Q$.

### Les trois situations possibles

| Comparaison des degrés | Limite à l’infini |
|---|---|
| degré de $P$ < degré de $Q$ | $0$ |
| degré de $P$ = degré de $Q$ | quotient des coefficients dominants |
| degré de $P$ > degré de $Q$ | $+\infty$ ou $-\infty$ selon le signe du monôme quotient |

### Exemple du cours entièrement rédigé

$$\lim_{x\to-\infty}\frac{7x^3-x^2+5}{4x^2-2x+3}=\lim_{x\to-\infty}\frac{7x^3}{4x^2}=\lim_{x\to-\infty}\frac{7x}{4}=-\infty$$

On simplifie le quotient des monômes dominants avant de conclure : $\frac{7x^3}{4x^2}=\frac{7x}{4}$, puis on étudie son signe en $-\infty$.

> Cette présentation détaille les trois situations contenues dans la propriété générale du PDF.`,
    keyPoint: "À l’infini, remplace le numérateur et le dénominateur par leurs monômes dominants.",
    example: "Pour $\\frac{7x^3-x^2+5}{4x^2-2x+3}$, le quotient dominant est $\\frac74x$, qui tend vers $-\\infty$ quand $x\\to-\\infty$.",
    methodSteps: ["Repère les deux monômes dominants.", "Simplifie leur quotient.", "Calcule la limite du monôme ou de la constante restante."],
    timeline: [
      { label: "Numérateur", detail: "Choisir son monôme de plus haut degré." },
      { label: "Dénominateur", detail: "Choisir son monôme de plus haut degré." },
      { label: "Quotient", detail: "Simplifier puis étudier le signe à l’infini." },
    ],
    questions: [
      short("Détermine $\\lim_{x\\to-\\infty}\\frac{7x^3-x^2+5}{4x^2-2x+3}$.", ["-∞", "-infini"], "Le quotient dominant vaut $\\frac74x$, donc la limite est -∞.", "Exercice de fixation", 2),
      short("Détermine $\\lim_{x\\to+\\infty}\\frac{7x^3-x^2+5}{4x^2-2x+3}$.", ["+∞", "+infini"], "Le quotient dominant vaut $\\frac74x$.", "Exercice de maison - question 1"),
      short("Détermine $\\lim_{x\\to-\\infty}\\frac{7x^3-x^2+5}{4x^3-2x+3}$.", ["7/4", "1,75", "1.75"], "Les degrés sont égaux : la limite est le quotient 7/4.", "Exercice de maison - question 2"),
      short("Détermine $\\lim_{x\\to+\\infty}\\frac{17x^2-x^2+5}{4x^3-2x+3}$.", ["0"], "Le degré du numérateur est inférieur à celui du dénominateur.", "Exercice de maison - question 3"),
      short("Détermine $\\lim_{x\\to+\\infty}\\frac{-3x^3+x^2-1}{x^2-5x-3}$.", ["-∞", "-infini"], "Le quotient dominant vaut -3x.", "D-Exercice 4 - question 1"),
      short("Détermine $\\lim_{x\\to-\\infty}\\frac{-20x^3+75}{4x^3-2x-90}$.", ["-5"], "Les degrés sont égaux : -20/4=-5.", "D-Exercice 4 - question 2"),
      short("Détermine $\\lim_{x\\to+\\infty}\\frac{5x^4-x^2+5}{-4x^5+2x-7}$.", ["0"], "Le degré du numérateur est inférieur à celui du dénominateur.", "D-Exercice 4 - question 3"),
      short("Détermine $\\lim_{x\\to-\\infty}\\frac{x^4-x^2+5}{-2x-1}$.", ["+∞", "+infini"], "Le quotient dominant est $-\\frac12x^3$, qui tend vers +∞ en -∞.", "D-Exercice 4 - question 4"),
    ],
  },
  {
    id: "sum-of-limits",
    title: "Limite d’une somme de fonctions",
    summary: "Additionner les limites compatibles et reconnaître la forme indéterminée $+\\infty-\\infty$.",
    pages: "7-8",
    section: "III-1. Limite d’une somme de fonctions",
    durationMinutes: 16,
    xp: 45,
    body: String.raw`## Propriété

Soient $\lim f(x)=L$ et $\lim g(x)=L'$ au même point.

| Limite de $f$ | Limite de $g$ | Limite de $f+g$ |
|---|---|---|
| $L$ | $L'$ | $L+L'$ |
| $L$ | $+\infty$ | $+\infty$ |
| $L$ | $-\infty$ | $-\infty$ |
| $+\infty$ | $+\infty$ | $+\infty$ |
| $-\infty$ | $-\infty$ | $-\infty$ |
| $+\infty$ | $-\infty$ | on ne peut pas conclure |

L’écriture $+\infty-\infty$ est une **forme indéterminée**. Elle ne vaut pas automatiquement zéro : il faut transformer l’expression.

### Lever la forme indéterminée sur un exemple

Pour $\lim_{x\to+\infty}(x^2-x)$, l’écriture $+\infty-\infty$ ne permet pas de conclure. Mais $x^2-x$ est un polynôme : son monôme dominant $x^2$ donne directement

$$\lim_{x\to+\infty}(x^2-x)=\lim_{x\to+\infty}x^2=+\infty$$

> Retiens le réflexe : face à $+\infty-\infty$, transforme l’expression (monôme dominant, factorisation…) avant de conclure.`,
    keyPoint: "+∞ + (-∞) est indéterminé ; toutes les autres sommes du tableau se calculent directement.",
    example: "Si $f(x)\\to L$ et $h(x)\\to-\\infty$, alors $f(x)+h(x)\\to-\\infty$.",
    methodSteps: ["Calcule séparément chaque limite.", "Reporte-les dans le tableau des sommes.", "Si tu obtiens +∞-∞, transforme l’expression avant de conclure."],
    timeline: [
      { label: "Séparer", detail: "Calculer la limite de chaque terme." },
      { label: "Combiner", detail: "Appliquer la ligne correspondante du tableau." },
      { label: "Vérifier", detail: "Détecter la forme indéterminée +∞-∞." },
    ],
    questions: [
      choice("Si $g(x)\\to+\\infty$ et $h(x)\\to-\\infty$, alors $g(x)+h(x)\\to0$.", ["Vrai", "Faux"], 1, "Il s’agit de la forme indéterminée +∞-∞.", "Exercice de fixation 1 - a"),
      choice("Si $f(x)\\to L$ et $h(x)\\to-\\infty$, alors $f(x)+h(x)\\to L$.", ["Vrai", "Faux"], 1, "Une limite finie ajoutée à -∞ donne -∞.", "Exercice de fixation 1 - b"),
      choice("Si $f(x)\\to L$ et $h(x)\\to-\\infty$, alors $f(x)+h(x)\\to-\\infty$.", ["Vrai", "Faux"], 0, "C’est la règle de somme d’une limite finie et de -∞.", "Exercice de fixation 1 - c"),
      short("Détermine $\\lim_{x\\to-2}\\left(\\frac{2x+3}{x+1}+x-8\\right)$.", ["-9"], "Le quotient tend vers 1 et x-8 vers -10 ; la somme vaut -9.", "Exercice de fixation 2 - a", 2),
      short("Détermine $\\lim_{x\\to+\\infty}\\left(x^2+2x+5+\\frac1x\\right)$.", ["+∞", "+infini"], "Le polynôme tend vers +∞ et 1/x tend vers 0.", "Exercice de fixation 2 - b", 2),
    ],
  },
  {
    id: "product-of-limits",
    title: "Limite d’un produit de fonctions",
    summary: "Déterminer le signe d’un produit de limites et reconnaître la forme indéterminée $0\\times\\infty$.",
    pages: "8-9",
    section: "III-2. Limite d’un produit de fonctions",
    durationMinutes: 16,
    xp: 45,
    body: String.raw`## Propriété

Le tableau du cours rassemble tous les cas du produit $f\times g$ :

| Limite de $f$ | Limite de $g$ | Limite de $f\times g$ |
|---|---|---|
| $L$ | $L'$ | $L\times L'$ |
| $L>0$ | $+\infty$ | $+\infty$ |
| $L<0$ | $+\infty$ | $-\infty$ |
| $L>0$ | $-\infty$ | $-\infty$ |
| $L<0$ | $-\infty$ | $+\infty$ |
| $+\infty$ | $+\infty$ | $+\infty$ |
| $-\infty$ | $-\infty$ | $+\infty$ |
| $+\infty$ | $-\infty$ | $-\infty$ |
| $0$ | $+\infty$ ou $-\infty$ | on ne peut pas conclure |

> **Astuce mémoire.** C’est la règle des signes de la multiplication : deux facteurs de même signe donnent $+\infty$, deux facteurs de signes contraires donnent $-\infty$.

## Forme indéterminée

L’écriture $0\times\infty$ ne permet pas de conclure. Il faut transformer l’expression avant de calculer sa limite.

### Exemple du cours entièrement rédigé

$$\lim_{x\to+\infty}\left[\frac{x+6}{x-4}\times(6-x)\right]=-\infty$$

car $\lim_{x\to+\infty}\frac{x+6}{x-4}=1$ (degrés égaux, quotient $\frac11$) et $\lim_{x\to+\infty}(6-x)=-\infty$ : un facteur positif multiplié par $-\infty$ donne $-\infty$.`,
    keyPoint: "Pour un produit, combine les signes ; 0×∞ est une forme indéterminée.",
    example: "Si $\\frac{x+6}{x-4}\\to1$ et $6-x\\to-\\infty$, leur produit tend vers $-\\infty$.",
    methodSteps: ["Calcule les limites des deux facteurs.", "Si aucune forme indéterminée n’apparaît, applique la règle des signes.", "Si tu obtiens 0×∞, transforme ou simplifie l’expression."],
    timeline: [
      { label: "Facteur 1", detail: "Calculer sa limite et son signe." },
      { label: "Facteur 2", detail: "Calculer sa limite et son signe." },
      { label: "Produit", detail: "Appliquer la règle des signes ou détecter 0×∞." },
    ],
    questions: [
      choice("Si $f(x)\\to0$ et $g(x)\\to+\\infty$, on ne peut pas conclure directement pour $f(x)g(x)$.", ["Vrai", "Faux"], 0, "$0\\times\\infty$ est une forme indéterminée.", "Exercice de fixation 1 - a"),
      choice("Si $f(x)\\to0$ et $h(x)\\to L$ avec L réel, on ne peut pas conclure pour $f(x)h(x)$.", ["Vrai", "Faux"], 1, "Le produit tend vers $0\\times L=0$.", "Exercice de fixation 1 - b"),
      choice("Si $f(x)\\to0$ et $h(x)\\to L$, alors $f(x)h(x)\\to0$.", ["Vrai", "Faux"], 0, "Le produit d’une limite nulle par une limite finie vaut 0.", "Exercice de fixation 1 - c"),
      choice("Si $g(x)\\to+\\infty$ et $h(x)\\to L$, alors $g(x)h(x)$ tend toujours vers $+\\infty$.", ["Vrai", "Faux"], 1, "Le résultat dépend du signe de L, et L peut aussi être nul.", "Exercice de fixation 1 - d"),
      short("Détermine $\\lim_{x\\to+\\infty}\\left(\\frac{x+6}{x-4}(6-x)\\right)$.", ["-∞", "-infini"], "Le quotient tend vers 1 et 6-x vers -∞.", "Exercice de fixation 2", 2),
      short("Pour $f(x)=\\frac{x^2+6}{x-4}$ et $g(x)=\\frac{-x^3+6x+4}{x+2}$, calcule $\\lim_{x\\to+\\infty}f(x)g(x)$.", ["-∞", "-infini"], "$f(x)\\to+\\infty$ et $g(x)\\to-\\infty$, donc le produit tend vers -∞.", "Exercice de maison et D-Exercice 5", 3),
    ],
  },
  {
    id: "inverse-and-quotient-limits",
    title: "Limite d’un inverse et d’un quotient",
    summary: "Passer d’une limite de fonction à celle de son inverse, puis traiter un quotient dont le dénominateur tend vers zéro.",
    pages: "9-10",
    section: "III-3 et III-4. Limite d’un inverse et d’un quotient",
    durationMinutes: 24,
    xp: 60,
    body: String.raw`## Limite de l’inverse

| Limite de $g$ | Limite de $\dfrac1g$ |
|---|---|
| $L\neq0$ | $\dfrac1L$ |
| $+\infty$ ou $-\infty$ | $0$ |
| $0$ avec $g(x)>0$ | $+\infty$ |
| $0$ avec $g(x)<0$ | $-\infty$ |

> Quand $g$ tend vers $0$, tout dépend du **signe** de $g$ près du point étudié : c’est pour cela que les limites à gauche et à droite du niveau 4 sont indispensables ici.

## Limite d’un quotient lorsque le dénominateur tend vers zéro

Pour étudier $\frac{f(x)}{g(x)}$ lorsque $g(x)\to0$ et $f(x)\to L\neq0$ :

1. écrire $\frac{f(x)}{g(x)}=f(x)\times\frac1{g(x)}$ ;
2. calculer séparément la limite de $f(x)$ ;
3. déterminer le signe de $g(x)$ et la limite de son inverse ;
4. appliquer la règle du produit.

### Exemple du cours entièrement rédigé

$$\lim_{x\to6^+}\frac{x-8}{x-6}=\lim_{x\to6^+}(x-8)\times\frac{1}{x-6}=-\infty$$

car $\lim_{x\to6^+}(x-8)=-2$ et $\lim_{x\to6^+}\frac1{x-6}=+\infty$ : un facteur négatif multiplié par $+\infty$ donne $-\infty$.

> Les formes $\frac00$ et $\frac\infty\infty$ sont indéterminées et demandent une transformation.`,
    keyPoint: "Un quotient s’étudie comme le produit du numérateur par l’inverse du dénominateur.",
    example: "Quand $x\\to6^+$, $x-8\\to-2$ et $\\frac1{x-6}\\to+\\infty$ ; ainsi $\\frac{x-8}{x-6}\\to-\\infty$.",
    methodSteps: ["Calcule la limite du numérateur.", "Étudie le signe du dénominateur du côté indiqué.", "Inverse le dénominateur puis utilise la règle du produit."],
    timeline: [
      { label: "Numérateur", detail: "Trouver sa limite et son signe." },
      { label: "Inverse", detail: "Déterminer la limite de 1/g(x)." },
      { label: "Produit", detail: "Conclure pour f(x)×1/g(x)." },
    ],
    questions: [
      choice("Si $f(x)\\to0$ et $g(x)\\to+\\infty$, on ne peut pas conclure directement pour $g(x)/f(x)$.", ["Vrai", "Faux"], 0, "Le signe de f près de zéro doit être connu.", "Exercice de fixation 1 - a"),
      choice("Si $f(x)\\to0$ et $g(x)\\to+\\infty$, on ne peut pas conclure pour $f(x)/g(x)$.", ["Vrai", "Faux"], 1, "$1/g(x)\\to0$, donc $f(x)/g(x)\\to0$.", "Exercice de fixation 1 - b"),
      choice("Si $h(x)\\to L\\neq0$ et $g(x)\\to+\\infty$, alors $h(x)/g(x)\\to0$.", ["Vrai", "Faux"], 0, "Une limite finie divisée par une quantité infinie tend vers 0.", "Exercice de fixation 1 - c"),
      choice("Si $g(x)\\to+\\infty$ et $h(x)\\to L\\neq0$, alors $g(x)/h(x)$ tend toujours vers +∞.", ["Vrai", "Faux"], 1, "Si L<0, le quotient tend vers -∞.", "Exercice de fixation 1 - d"),
      short("Détermine $\\lim_{x\\to6^+}\\frac{x-8}{x-6}$.", ["-∞", "-infini"], "Le numérateur tend vers -2 et l’inverse du dénominateur vers +∞.", "Exercice de fixation 2", 2),
      short("Détermine $\\lim_{x\\to-4^+}\\frac{x^2+6x-10}{x+4}$.", ["-∞", "-infini"], "Le numérateur tend vers -18 et le dénominateur vers 0 par valeurs positives.", "Exercice de maison et D-Exercice 6 - question 1", 2),
      short("Détermine $\\lim_{x\\to2^+}\\frac{x^2-5x+7}{x-2}$.", ["+∞", "+infini"], "Le numérateur tend vers 1>0 et le dénominateur vers 0+.", "D-Exercice 6 - question 2"),
      short("Détermine $\\lim_{x\\to2^-}\\frac{x^2-5x+7}{x-2}$.", ["-∞", "-infini"], "Le numérateur tend vers 1>0 et le dénominateur vers 0-.", "D-Exercice 6 - question 3"),
      short("Détermine $\\lim_{x\\to5^+}\\frac{2x^2-x+1}{x-5}$.", ["+∞", "+infini"], "Le numérateur tend vers 46>0 et le dénominateur vers 0+.", "D-Exercice 6 - question 4"),
      short("Détermine $\\lim_{x\\to-1^+}\\frac{x^2-x-1}{x+1}$.", ["+∞", "+infini"], "Le numérateur tend vers 1>0 et le dénominateur vers 0+.", "D-Exercice 6 - question 5"),
      short("Détermine $\\lim_{x\\to-1^-}\\frac{x^2-x-1}{x+1}$.", ["-∞", "-infini"], "Le numérateur tend vers 1>0 et le dénominateur vers 0-.", "D-Exercice 6 - question 6"),
    ],
  },
  {
    id: "horizontal-asymptote",
    title: "Asymptote horizontale",
    summary: "Traduire une limite finie à l’infini par une droite horizontale approchée par la courbe.",
    pages: "10-11",
    section: "III-4.a. Asymptote horizontale",
    durationMinutes: 14,
    xp: 45,
    kind: "graph",
    body: String.raw`## Définition

Lorsque la fonction $f$ admet une limite finie $b$ en $+\infty$ ou en $-\infty$, la droite d’équation $y=b$ est une asymptote horizontale à la courbe représentative de $f$ du côté considéré.

- si $\lim_{x\to+\infty}f(x)=b$, la droite $y=b$ est asymptote en $+\infty$ ;
- si $\lim_{x\to-\infty}f(x)=b$, la droite $y=b$ est asymptote en $-\infty$.

Une même droite peut être asymptote aux deux infinis.

### Lire l’asymptote sur la courbe

Pour $f(x)=\frac{3x-2}{x-1}$ : les degrés du numérateur et du dénominateur sont égaux, donc $\lim_{x\to+\infty}f(x)=\lim_{x\to-\infty}f(x)=\frac31=3$. La droite $y=3$ est asymptote horizontale aux deux infinis : plus $|x|$ grandit, plus la courbe se colle à cette droite sans l’atteindre.

> Une asymptote horizontale concerne le comportement de la courbe lorsque l’abscisse devient très grande en valeur absolue.`,
    keyPoint: "Limite finie b à l’infini ⇔ asymptote horizontale d’équation y=b.",
    example: "Si $\\lim_{x\\to+\\infty}f(x)=3$, alors $y=3$ est asymptote horizontale en +∞.",
    methodSteps: ["Vérifie que x tend vers +∞ ou -∞.", "Lis la limite finie b.", "Écris l’équation horizontale y=b et précise le côté."],
    timeline: [
      { label: "Infini", detail: "x doit tendre vers +∞ ou -∞." },
      { label: "Limite finie", detail: "Repérer la valeur b." },
      { label: "Droite", detail: "Conclure avec y=b." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La courbe se colle à la droite y = 3",
      instruction: "Éloigne le point vers la droite ou vers la gauche : que devient l’écart entre la courbe et la droite rouge ?",
      observation: "Quand |x| grandit, f(x) se rapproche de 3 sans jamais l’atteindre : c’est l’asymptote horizontale y = 3.",
      formula: "f(x) = (3x - 2)/(x - 1)",
      formulaTex: "f(x)=\\frac{3x-2}{x-1}",
      rule: { kind: "rational-linear", numerator: [3, -2], denominator: [1, -1] },
      window: { xMin: -7, xMax: 9, yMin: -3, yMax: 9 },
      guides: [
        { kind: "horizontal", value: 3, label: "y = 3" },
        { kind: "vertical", value: 1, label: "x = 1" },
      ],
      marker: { min: -6.9, max: 8.9, step: 0.1, initial: 4 },
    },
    questions: [
      choice("Pour $f(x)=\\frac{3x-2}{x-1}$ et $\\lim_{x\\to+\\infty}f(x)=3$, la courbe n’admet aucune asymptote horizontale en +∞.", ["Vrai", "Faux"], 1, "La droite y=3 est asymptote horizontale.", "Exercice de fixation - affirmation 1"),
      choice("La droite $y=3$ est asymptote horizontale à la courbe de $f$ en +∞.", ["Vrai", "Faux"], 0, "Une limite finie égale à 3 donne l’asymptote y=3.", "Exercice de fixation - affirmation 2"),
      choice("La droite $x=1$ est une asymptote horizontale en +∞.", ["Vrai", "Faux"], 1, "Une droite x=1 est verticale, pas horizontale.", "Exercice de fixation - affirmation 3"),
      short("Si $\\lim_{x\\to-\\infty}f(x)=4$, donne l’équation de l’asymptote horizontale.", ["y=4", "y = 4"], "La limite finie est 4, donc l’asymptote est y=4.", "D-Exercice 1"),
    ],
  },
  {
    id: "vertical-asymptote",
    title: "Asymptote verticale",
    summary: "Reconnaître une droite verticale lorsqu’une fonction possède une limite infinie en un réel.",
    pages: "11-12",
    section: "III-4.b. Asymptote verticale",
    durationMinutes: 14,
    xp: 45,
    kind: "graph",
    body: String.raw`## Définition

Lorsque la fonction $f$ admet une limite infinie, $+\infty$ ou $-\infty$, en un réel $a$, la droite d’équation $x=a$ est une asymptote verticale à sa courbe.

Il suffit qu’au moins une limite latérale soit infinie :

$\lim_{x\to a^-}f(x)=\pm\infty$ ou $\lim_{x\to a^+}f(x)=\pm\infty$.

### Exemple du cours

Pour $f(x)=\frac{3x-4}{x-5}$, définie sur $\mathbb{R}\setminus\{5\}$ : on admet que $\lim_{x\to5^-}f(x)=-\infty$ et $\lim_{x\to5^+}f(x)=+\infty$. La droite d’équation $x=5$ est donc asymptote verticale à la courbe.

> La droite verticale passe par la valeur interdite a sur l’axe des abscisses ; son équation commence donc par x, jamais par y.`,
    keyPoint: "Limite infinie en a ⇔ asymptote verticale d’équation x=a.",
    example: "Si les limites à gauche et à droite en 5 sont infinies, la droite $x=5$ est asymptote verticale.",
    methodSteps: ["Repère le réel a vers lequel tend x.", "Vérifie que la limite est infinie au moins d’un côté.", "Écris l’équation x=a."],
    timeline: [
      { label: "Réel a", detail: "Identifier la valeur approchée." },
      { label: "Limite infinie", detail: "Observer +∞ ou -∞ au moins d’un côté." },
      { label: "Droite", detail: "Conclure avec x=a." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Le mur vertical en x = 5",
      instruction: "Rapproche le point de la valeur interdite 5, par la gauche puis par la droite.",
      observation: "La courbe longe la droite rouge x = 5 sans jamais la toucher : limite -∞ à gauche, +∞ à droite.",
      formula: "f(x) = (3x - 4)/(x - 5)",
      formulaTex: "f(x)=\\frac{3x-4}{x-5}",
      rule: { kind: "rational-linear", numerator: [3, -4], denominator: [1, -5] },
      window: { xMin: -2, xMax: 12, yMin: -8, yMax: 14 },
      guides: [
        { kind: "vertical", value: 5, label: "x = 5" },
        { kind: "horizontal", value: 3, label: "y = 3" },
      ],
      marker: { min: -1.9, max: 11.9, step: 0.05, initial: 3 },
    },
    corrections: ["L’énoncé de fixation du PDF écrit « définie sur ℝ∖{1} » pour f(x)=(3x-4)/(x-5) ; le domaine correct est ℝ∖{5}."],
    questions: [
      choice("Si $f(x)\\to-\\infty$ lorsque $x\\to5^-$ et $x\\to5^+$, la droite $x=5$ est asymptote verticale.", ["Vrai", "Faux"], 0, "La limite infinie en 5 donne x=5.", "Exercice de fixation - affirmation 1"),
      choice("Dans la situation précédente, la droite $y=3$ est l’asymptote verticale.", ["Vrai", "Faux"], 1, "Une asymptote verticale a une équation x=a.", "Exercice de fixation - affirmation 2"),
      choice("La courbe n’admet aucune asymptote verticale en 5.", ["Vrai", "Faux"], 1, "Les limites infinies confirment l’asymptote x=5.", "Exercice de fixation - affirmation 3"),
      short("Si $\\lim_{x\\to-3}f(x)=+\\infty$, donne l’équation de l’asymptote verticale.", ["x=-3", "x = -3"], "Le réel approché est -3, donc l’asymptote est x=-3.", "D-Exercice 1"),
    ],
  },
  {
    id: "oblique-asymptote",
    title: "Asymptote oblique et position relative",
    summary: "Prouver qu’une droite $y=ax+b$ est asymptote et situer la courbe par rapport à elle.",
    pages: "12-13",
    section: "III-4.c. Asymptote oblique",
    durationMinutes: 24,
    xp: 65,
    kind: "graph",
    body: String.raw`## Propriété admise

La droite d’équation $y=ax+b$, avec $a\neq0$, est asymptote oblique à la courbe de $f$ en $+\infty$ si et seulement si :

$$\lim_{x\to+\infty}[f(x)-(ax+b)]=0$$

La même propriété s’applique en $-\infty$.

## Vérification pratique

Lorsqu’une fraction rationnelle peut s’écrire $f(x)=ax+b+r(x)$ avec $r(x)\to0$, la droite $y=ax+b$ est asymptote oblique.

### Faire apparaître la forme $ax+b+r(x)$

Pour $f(x)=\frac{2x^2+3x-1}{x+2}$, on vérifie que $2x^2+3x-1=(x+2)(2x-1)+1$. En divisant par $x+2$ :

$$f(x)=2x-1+\frac{1}{x+2}\quad\text{pour }x\neq-2$$

Le reste $\frac1{x+2}$ tend vers $0$ aux deux infinis : la droite $y=2x-1$ est asymptote oblique en $-\infty$ et en $+\infty$.

## Position relative

Le signe de $f(x)-(ax+b)$ indique la position de la courbe :

- différence positive : la courbe est au-dessus de la droite ;
- différence négative : la courbe est en dessous.

> La division euclidienne du numérateur par le dénominateur permet souvent de faire apparaître $ax+b$.`,
    keyPoint: "f(x)-(ax+b)→0 donne l’asymptote ; son signe donne la position de la courbe.",
    example: "$\\frac{2x^2+3x-1}{x+2}=2x-1+\\frac1{x+2}$ : la droite $y=2x-1$ est asymptote aux deux infinis.",
    methodSteps: ["Réécris f sous la forme ax+b+r(x).", "Montre que r(x) tend vers 0 à l’infini considéré.", "Étudie le signe de r(x) pour positionner la courbe."],
    timeline: [
      { label: "Décomposer", detail: "Faire apparaître ax+b et un reste." },
      { label: "Limite du reste", detail: "Vérifier que le reste tend vers 0." },
      { label: "Position", detail: "Étudier le signe du reste." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La courbe épouse la droite y = 2x − 1",
      instruction: "Éloigne le point vers les infinis, puis reviens près de la valeur interdite -2.",
      observation: "Loin de -2, la courbe se confond presque avec la droite oblique : l’écart 1/(x+2) tend vers 0. Près de -2, le mur vertical reprend le dessus.",
      formula: "f(x) = (2x² + 3x - 1)/(x + 2)",
      formulaTex: "f(x)=\\frac{2x^2+3x-1}{x+2}",
      rule: { kind: "affine-plus-reciprocal", slope: 2, intercept: -1, coefficient: 1, shift: -2 },
      window: { xMin: -9, xMax: 5, yMin: -24, yMax: 12 },
      guides: [
        { kind: "oblique", slope: 2, intercept: -1, label: "y = 2x − 1" },
        { kind: "vertical", value: -2, label: "x = −2" },
      ],
      marker: { min: -8.9, max: 4.9, step: 0.1, initial: 2 },
    },
    corrections: ["Dans la solution finale du PDF, la valeur 3 était parfois remplacée par -3 et les positions au-dessus/en dessous étaient inversées ; elles sont corrigées ici."],
    questions: [
      short("Pour $f(x)=\\frac{2x^2+3x-1}{x+2}=2x-1+\\frac1{x+2}$, donne l’asymptote oblique.", ["y=2x-1", "y = 2x - 1"], "Le reste 1/(x+2) tend vers 0 aux deux infinis.", "Exercice de fixation", 2),
      short("Pour $f(x)=x-8+\\frac1{x-3}$, calcule $\\lim_{x\\to3^-}f(x)$.", ["-∞", "-infini"], "Le terme 1/(x-3) tend vers -∞ à gauche.", "Exercice de maison et D-Exercice 9 - question 1"),
      short("Pour la même fonction, calcule $\\lim_{x\\to3^+}f(x)$.", ["+∞", "+infini"], "Le terme 1/(x-3) tend vers +∞ à droite.", "Exercice de maison et D-Exercice 9 - question 1"),
      short("Donne l’asymptote verticale de $f(x)=x-8+\\frac1{x-3}$.", ["x=3", "x = 3"], "Les limites en 3 sont infinies : l’asymptote est x=3.", "D-Exercice 9"),
      short("Donne l’asymptote oblique de $f(x)=x-8+\\frac1{x-3}$.", ["y=x-8", "y = x - 8"], "La différence avec x-8 est 1/(x-3), qui tend vers 0.", "Exercice de maison et D-Exercice 9"),
      choice("Sur $]-\\infty,3[$, la courbe de $f(x)=x-8+\\frac1{x-3}$ est située…", ["au-dessus de y=x-8", "en dessous de y=x-8"], 1, "Pour x<3, 1/(x-3)<0.", "D-Exercice 9 - position relative"),
      choice("Sur $]3,+\\infty[$, la même courbe est située…", ["au-dessus de y=x-8", "en dessous de y=x-8"], 0, "Pour x>3, 1/(x-3)>0.", "D-Exercice 9 - position relative"),
    ],
  },
  {
    id: "elementary-derivatives",
    title: "Dérivées des fonctions élémentaires",
    summary: "Mémoriser et utiliser les formules de dérivation des constantes, puissances et fonctions inverses.",
    pages: "13-14",
    section: "IV-1. Dérivée de fonctions élémentaires",
    durationMinutes: 20,
    xp: 50,
    body: String.raw`## À quoi sert la dérivée ?

La dérivée mesure la **vitesse de variation** d’une fonction : le nombre dérivé $f'(a)$ est le coefficient directeur de la tangente à la courbe au point d’abscisse $a$. Toute la fin de la leçon — variations, extremums, tangente — repose sur elle.

## Tableau des dérivées élémentaires

| Fonction $f(x)$ | Définie sur | Dérivée $f'(x)$ | Dérivable sur |
|---|---|---|---|
| $a$ (constante) | $\mathbb{R}$ | $0$ | $\mathbb{R}$ |
| $ax$ | $\mathbb{R}$ | $a$ | $\mathbb{R}$ |
| $x^2$ | $\mathbb{R}$ | $2x$ | $\mathbb{R}$ |
| $x^n$, $n\ge1$ | $\mathbb{R}$ | $nx^{n-1}$ | $\mathbb{R}$ |
| $\frac1x$ | $\mathbb{R}\setminus\{0\}$ | $-\frac1{x^2}$ | $\mathbb{R}\setminus\{0\}$ |
| $\frac1{x^n}$, $n\ge1$ | $\mathbb{R}\setminus\{0\}$ | $-\frac{n}{x^{n+1}}$ | $\mathbb{R}\setminus\{0\}$ |

Il faut toujours préciser l’ensemble sur lequel la fonction est dérivable, en particulier pour les fonctions contenant une puissance de $x$ au dénominateur.

> **Astuce mémoire.** Pour $x^n$ : « l’exposant descend devant, puis perd 1 » — c’est la même formule qui donne $(x^2)'=2x$ et $(x^3)'=3x^2$.`,
    keyPoint: "$(x^n)'=nx^{n-1}$ et $(1/x^n)'=-n/x^{n+1}$.",
    example: "Si $l(x)=x^3$, alors $l'(x)=3x^2$ ; si $k(x)=1/x^3$, alors $k'(x)=-3/x^4$.",
    methodSteps: ["Identifie la forme élémentaire.", "Applique la formule correspondante.", "Précise le domaine de dérivabilité si la fonction possède un dénominateur."],
    timeline: [
      { label: "Reconnaître", detail: "Constante, fonction linéaire, puissance ou inverse." },
      { label: "Dériver", detail: "Appliquer la formule du tableau." },
      { label: "Domaine", detail: "Exclure 0 pour les fonctions inverses." },
    ],
    questions: [
      short("Calcule la dérivée de $f(x)=-6$.", ["0", "f'(x)=0"], "La dérivée d’une constante est nulle.", "Exercice de fixation - f"),
      short("Calcule la dérivée de $g(x)=8x$.", ["8", "g'(x)=8"], "La dérivée de ax est a.", "Exercice de fixation - g"),
      short("Calcule la dérivée de $h(x)=x^2$.", ["2x", "h'(x)=2x"], "La formule donne 2x.", "Exercice de fixation - h"),
      short("Calcule la dérivée de $l(x)=x^3$.", ["3x^2", "3x²", "l'(x)=3x^2"], "La formule $(x^n)'=nx^{n-1}$ donne $3x^2$.", "Exercice de fixation - l"),
      short("Calcule la dérivée de $m(x)=1/x$.", ["-1/x^2", "-1/x²", "m'(x)=-1/x^2"], "La dérivée de 1/x est -1/x².", "Exercice de fixation - m"),
      short("Calcule la dérivée de $k(x)=1/x^3$.", ["-3/x^4", "-3/x⁴", "k'(x)=-3/x^4"], "La formule donne -3/x⁴.", "Exercice de fixation - k"),
    ],
  },
  {
    id: "derivative-operations",
    title: "Opérations sur les fonctions dérivées",
    summary: "Dériver une somme, un multiple, un produit, une puissance, un inverse ou un quotient.",
    pages: "14-15",
    section: "IV-2. Dérivées et opérations sur les fonctions",
    durationMinutes: 24,
    xp: 60,
    body: String.raw`## Propriété

Soient $u$ et $v$ deux fonctions dérivables sur un intervalle ouvert $I$, et $n$ un entier naturel non nul.

| Fonction | Dérivée | Condition |
|---|---|---|
| $u+v$ | $u'+v'$ | — |
| $ku$, $k$ constante | $ku'$ | — |
| $u\times v$ | $u'v+uv'$ | — |
| $u^n$ | $nu'u^{n-1}$ | — |
| $\dfrac1u$ | $-\dfrac{u'}{u^2}$ | $u$ ne s’annule pas sur $I$ |
| $\dfrac uv$ | $\dfrac{u'v-uv'}{v^2}$ | $v$ ne s’annule pas sur $I$ |

Le domaine de dérivabilité doit être compatible avec les dénominateurs présents dans l’expression.

### Exemple du cours entièrement rédigé

Pour $g(x)=\frac{x-4}{5x+3}$ avec $u(x)=x-4$ et $v(x)=5x+3$ :

$$g'(x)=\frac{1\times(5x+3)-5\times(x-4)}{(5x+3)^2}=\frac{5x+3-5x+20}{(5x+3)^2}=\frac{23}{(5x+3)^2}$$

> **Astuce mémoire pour le quotient.** « Dérivée du haut × bas, moins haut × dérivée du bas, le tout sur bas au carré. » L’ordre des deux termes du numérateur ne se change jamais.`,
    keyPoint: "Pour un quotient : dérivée du haut × bas - haut × dérivée du bas, le tout sur bas².",
    example: "Pour $g(x)=\\frac{x-4}{5x+3}$, $g'(x)=\\frac{(5x+3)-5(x-4)}{(5x+3)^2}=\\frac{23}{(5x+3)^2}$.",
    methodSteps: ["Identifie l’opération principale de l’expression.", "Écris la formule de dérivation avant de remplacer u et v.", "Simplifie le numérateur et conserve le carré du dénominateur pour un quotient."],
    timeline: [
      { label: "Décomposer", detail: "Nommer u et v dans l’expression." },
      { label: "Formule", detail: "Choisir somme, produit, puissance, inverse ou quotient." },
      { label: "Simplifier", detail: "Développer et réduire sans perdre le domaine." },
    ],
    corrections: ["Le résultat numérique de la dérivée de (x-4)/(5x+3) est 23/(5x+3)² ; le PDF affiche 20 dans une ligne."],
    questions: [
      short("Calcule la dérivée de $f(x)=-5x^3+7x^2-8$.", ["-15x^2+14x", "-15x²+14x", "f'(x)=-15x^2+14x"], "On dérive terme à terme.", "Exercice de fixation - f", 2),
      short("Calcule la dérivée de $g(x)=\\frac{x-4}{5x+3}$.", ["23/(5x+3)^2", "23/(5x+3)²", "g'(x)=23/(5x+3)^2"], "La formule du quotient donne 23/(5x+3)².", "Exercice de fixation - g", 2),
      short("Donne l’ensemble de définition de $f(x)=\\frac{2x^2+3x}{x+1}$.", ["R\\{-1}", "R\\{-1}", "]-∞;-1[∪]-1;+∞[", "x≠-1"], "Le dénominateur impose x+1≠0.", "Exercice de maison - question 1"),
      short("Pour $f(x)=\\frac{2x^2+3x}{x+1}$, donne $f'(x)$.", ["(2x^2+4x+3)/(x+1)^2", "(2x²+4x+3)/(x+1)²"], "La formule du quotient conduit au numérateur $2x^2+4x+3$.", "Exercice de maison - question 2", 3),
    ],
  },
  {
    id: "variations-and-relative-extrema",
    title: "Dérivée, sens de variation et extremum relatif",
    summary: "Déduire les variations d’une fonction du signe de sa dérivée et reconnaître ses extrema relatifs.",
    pages: "15-17",
    section: "V. Dérivée, sens de variation et extremum relatif",
    durationMinutes: 32,
    xp: 75,
    kind: "practice",
    body: String.raw`## Dérivée et sens de variation

Soit $f$ une fonction dérivable sur un intervalle ouvert $K$.

- $f'$ est positive sur $K$ si et seulement si $f$ est croissante sur $K$ ;
- $f'$ est négative sur $K$ si et seulement si $f$ est décroissante sur $K$ ;
- $f'$ est nulle sur $K$ si et seulement si $f$ est constante sur $K$.

## Extremum relatif

Soit $x_0\in K$. La valeur $f(x_0)$ est un extremum relatif lorsque $f'$ s’annule en $x_0$ en changeant de signe.

- passage de $+$ à $-$ : maximum relatif ;
- passage de $-$ à $+$ : minimum relatif.

## Étude de $f(x)=x-2+\frac1x$

Le domaine est $\mathbb{R}\setminus\{0\}$ et
$$f'(x)=\frac{(x-1)(x+1)}{x^2}$$

Comme $x^2>0$ pour $x\neq0$, le signe de $f'$ est celui de $(x-1)(x+1)$ :

| Intervalle | $]-\infty,-1[$ | $]-1,0[$ | $]0,1[$ | $]1,+\infty[$ |
|---|---|---|---|---|
| Signe de $f'$ | $+$ | $-$ | $-$ | $+$ |
| Variation de $f$ | croissante | décroissante | décroissante | croissante |

### Tableau de variation

Aux bornes : $\lim_{x\to-\infty}f(x)=-\infty$, $\lim_{x\to0^-}f(x)=-\infty$, $\lim_{x\to0^+}f(x)=+\infty$ et $\lim_{x\to+\infty}f(x)=+\infty$.

| $x$ | $-\infty\to-1$ | $-1$ | $-1\to0$ | $0$ | $0\to1$ | $1$ | $1\to+\infty$ |
|---|---|---|---|---|---|---|---|
| $f'(x)$ | $+$ | $0$ | $-$ | ‖ | $-$ | $0$ | $+$ |
| $f$ | ↗ | $-4$ | ↘ vers $-\infty$ | ‖ | $+\infty$ ↘ | $0$ | ↗ |

La double barre ‖ marque la valeur interdite $0$ : la fonction n’y est pas définie.

Ainsi $f(-1)=-4$ est un maximum relatif sur la branche gauche et $f(1)=0$ un minimum relatif sur la branche droite.

> **Lecture du tableau.** Chaque flèche ↗ ou ↘ traduit le signe de $f'$ juste au-dessus ; les valeurs $-4$ et $0$ aux changements de flèche sont les extremums relatifs.`,
    keyPoint: "Le signe de f' donne les variations ; un changement +→- donne un maximum et -→+ un minimum.",
    example: "Pour $f(x)=x-2+1/x$, la dérivée s’annule en -1 et 1 ; elle change de signe à ces deux points.",
    methodSteps: ["Détermine le domaine et les limites aux bornes.", "Calcule puis factorise f'.", "Étudie le signe de f' et place ses zéros.", "Construis le tableau et lis les extrema."],
    timeline: [
      { label: "Dérivée", detail: "Calculer et factoriser f'." },
      { label: "Signe", detail: "Construire les intervalles séparés par les zéros et valeurs interdites." },
      { label: "Variations", detail: "Traduire + par croissante et - par décroissante." },
      { label: "Extrema", detail: "Repérer les changements de signe." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Visualise les deux branches de f(x) = x − 2 + 1/x",
      instruction: "Parcours la courbe : repère le sommet de la branche gauche et le creux de la branche droite.",
      observation: "Le sommet (-1 ; -4) est le maximum relatif, le creux (1 ; 0) le minimum relatif : exactement les changements de signe de f'.",
      formula: "f(x) = x - 2 + 1/x",
      formulaTex: "f(x)=x-2+\\frac1x",
      rule: { kind: "affine-plus-reciprocal", slope: 1, intercept: -2, coefficient: 1, shift: 0 },
      window: { xMin: -5, xMax: 6, yMin: -10, yMax: 7 },
      guides: [
        { kind: "vertical", value: 0, label: "x = 0" },
        { kind: "oblique", slope: 1, intercept: -2, label: "y = x − 2" },
      ],
      marker: { min: -4.9, max: 5.9, step: 0.05, initial: -2 },
    },
    corrections: ["La propriété d’extremum est formulée avec la condition correcte de changement de signe de la dérivée."],
    questions: [
      short("Pour $f(x)=x-2+1/x$, donne son ensemble de définition.", ["R\\{0}", "R\\{0}", "]-∞;0[∪]0;+∞[", "x≠0"], "Le dénominateur x ne doit pas être nul.", "Exercice de fixation - question 1"),
      short("Calcule $\\lim_{x\\to0^-}f(x)$.", ["-∞", "-infini"], "Le terme 1/x domine et tend vers -∞ à gauche.", "Exercice de fixation - question 2"),
      short("Calcule $\\lim_{x\\to0^+}f(x)$.", ["+∞", "+infini"], "Le terme 1/x domine et tend vers +∞ à droite.", "Exercice de fixation - question 2"),
      short("Donne $f'(x)$ sous forme factorisée.", ["(x-1)(x+1)/x^2", "(x-1)(x+1)/x²"], "On obtient $1-1/x^2=(x^2-1)/x^2$.", "Exercice de fixation - question 3", 2),
      choice("Sur $]-\\infty,-1[$, la fonction f est…", ["croissante", "décroissante", "constante"], 0, "La dérivée y est positive.", "Exercice de fixation - questions 4-5"),
      choice("Sur $]-1,0[$, la fonction f est…", ["croissante", "décroissante", "constante"], 1, "La dérivée y est négative.", "Exercice de fixation - questions 4-5"),
      short("Donne le maximum relatif de f sur la branche gauche.", ["-4", "f(-1)=-4"], "La dérivée passe de + à - en -1 et f(-1)=-4.", "Exercice de fixation - question 6"),
      short("Donne le minimum relatif de f sur la branche droite.", ["0", "f(1)=0"], "La dérivée passe de - à + en 1 et f(1)=0.", "Exercice de fixation - question 6"),
      short("Dans le D-Exercice 7, donne le centre de symétrie lu sur la courbe.", ["(-2;1)", "(-2,1)", "A(-2;1)"], "Le centre indiqué par la lecture graphique est (-2;1).", "D-Exercice 7 - question 3", 2),
      short("Dans le D-Exercice 7, donne le maximum relatif sur $]-\\infty,-1[$.", ["2"], "La fonction croît puis décroît : le maximum relatif vaut 2.", "D-Exercice 7 - question 4"),
      short("Dans le D-Exercice 7, donne le minimum relatif sur $]-3,+\\infty[$.", ["0"], "La fonction décroît puis croît : le minimum relatif vaut 0.", "D-Exercice 7 - question 4"),
    ],
  },
  {
    id: "tangent-equation",
    title: "Équation de la tangente à une courbe",
    summary: "Utiliser la valeur de la fonction et le nombre dérivé pour écrire l’équation de la tangente.",
    pages: "17",
    section: "VI-1. Équation de la tangente à une courbe en un point",
    durationMinutes: 14,
    xp: 45,
    body: String.raw`## Définition

La tangente à la courbe $(C_f)$ d’une fonction $f$ au point $A$ d’abscisse $a$ est la droite :

- qui passe par le point $A(a;f(a))$ ;
- dont le coefficient directeur est le nombre dérivé $f'(a)$.

## Conséquence

Une équation de cette tangente est :

$$y=f'(a)(x-a)+f(a)$$

Pour développer l’équation, distribue $f'(a)$ dans la parenthèse puis réduis les termes constants.

### Exemple du cours corrigé, pas à pas

Pour $f(x)=-x^2-2$ au point d’abscisse $1$ : $f'(x)=-2x$ donc $f'(1)=-2$, et $f(1)=-1-2=-3$.

$$y=f'(1)(x-1)+f(1)=-2(x-1)+(-3)=-2x+2-3=-2x-1$$

La tangente est la droite $y=-2x-1$ : elle touche la courbe en $A(1;-3)$ et sa pente $-2$ traduit la descente de la parabole en ce point.`,
    keyPoint: "Tangente en a : y=f'(a)(x-a)+f(a).",
    example: "Pour $f(x)=-x^2-2$, $f'(1)=-2$ et $f(1)=-3$ ; la tangente est $y=-2(x-1)-3=-2x-1$.",
    methodSteps: ["Calcule f(a), l’ordonnée du point de contact.", "Calcule f'(a), le coefficient directeur.", "Remplace dans y=f'(a)(x-a)+f(a), puis développe."],
    timeline: [
      { label: "Point", detail: "A possède les coordonnées (a;f(a))." },
      { label: "Pente", detail: "La pente de la tangente vaut f'(a)." },
      { label: "Équation", detail: "Remplacer dans la formule et réduire." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La tangente touche la parabole en A(1 ; −3)",
      instruction: "Place le point en x = 1 : la droite rouge frôle la courbe exactement là, avec la pente f'(1) = −2.",
      observation: "En x = 1, la tangente et la parabole se confondent localement : c’est la meilleure approximation de la courbe par une droite.",
      formula: "f(x) = -x² - 2",
      formulaTex: "f(x)=-x^2-2",
      rule: { kind: "polynomial", coefficients: [-2, 0, -1] },
      window: { xMin: -3.5, xMax: 3.5, yMin: -13, yMax: 2 },
      guides: [{ kind: "oblique", slope: -2, intercept: -1, label: "tangente : y = −2x − 1" }],
      marker: { min: -3.4, max: 3.4, step: 0.05, initial: 1 },
    },
    corrections: ["Le PDF indique f'(1)=2 pour f(x)=-x²-2 ; la dérivée correcte vaut f'(1)=-2, et l’équation est corrigée en conséquence."],
    questions: [
      short("Pour $f(x)=-x^2-2$, détermine une équation de la tangente au point d’abscisse 1.", ["y=-2x-1", "y = -2x - 1"], "$f'(x)=-2x$, donc $f'(1)=-2$ et $f(1)=-3$.", "Exercice de fixation corrigé", 3),
    ],
  },
  {
    id: "intermediate-value-theorem",
    title: "Théorème des valeurs intermédiaires",
    summary: "Justifier l’existence d’une solution, puis son unicité lorsque la fonction est strictement monotone.",
    pages: "17-18",
    section: "VI-2. Théorème des valeurs intermédiaires",
    durationMinutes: 22,
    xp: 60,
    body: String.raw`## Existence d’une solution

Soit $f$ une fonction continue sur un intervalle $[a,b]$.

Si $f(a)$ et $f(b)$ sont de signes contraires, c’est-à-dire $f(a)f(b)<0$, alors l’équation $f(x)=0$ admet **au moins une solution** $\alpha$ comprise entre $a$ et $b$.

## Unicité

Pour pouvoir affirmer que cette solution est unique, il faut en plus que $f$ soit strictement monotone sur $[a,b]$.

Ainsi, si $f$ est continue et strictement croissante ou décroissante sur $[a,b]$, et si $f(a)f(b)<0$, alors l’équation $f(x)=0$ admet une unique solution $\alpha\in]a,b[$.

## Affiner l’encadrement

Pour prouver $u<\alpha<v$, vérifie que $u$ et $v$ appartiennent à l’intervalle étudié et que $f(u)f(v)<0$.

### Application du cours : $f(x)=x^3-12x+10$ sur $[0;1]$

| $x$ | $0$ | $0{,}8$ | $0{,}9$ | $1$ |
|---|---|---|---|---|
| $f(x)$ | $10$ | $0{,}912$ | $-0{,}071$ | $-1$ |
| Signe | $+$ | $+$ | $-$ | $-$ |

$f$ est continue et strictement décroissante sur $[0;1]$, avec $f(0)f(1)<0$ : l’équation $f(x)=0$ admet une **unique** solution $\alpha$, et comme $f(0{,}8)f(0{,}9)<0$, on conclut $0{,}8<\alpha<0{,}9$.`,
    keyPoint: "Continuité + changement de signe donnent l’existence ; la stricte monotonie ajoute l’unicité.",
    example: "Pour $f(x)=x^3-12x+10$ sur [0;1], $f(0)=10>0$, $f(1)=-1<0$ et f est strictement décroissante : il existe une unique racine.",
    methodSteps: ["Vérifie la continuité sur l’intervalle.", "Calcule f(a) et f(b) et montre que leur produit est négatif.", "Ajoute la stricte monotonie pour conclure à l’unicité.", "Teste deux nouvelles bornes pour affiner l’encadrement."],
    timeline: [
      { label: "Continuité", detail: "Aucune rupture sur [a,b]." },
      { label: "Signes contraires", detail: "Vérifier f(a)f(b)<0." },
      { label: "Monotonie", detail: "Elle garantit l’unicité de la racine." },
      { label: "Encadrement", detail: "Tester des bornes plus proches." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La courbe traverse l’axe des abscisses",
      instruction: "Déplace le point entre 0 et 1 : repère l’endroit exact où f(x) change de signe.",
      observation: "f(0) = 10 > 0 et f(1) = -1 < 0 : la courbe est obligée de couper l’axe entre les deux. Cette traversée est la solution α.",
      formula: "f(x) = x³ - 12x + 10",
      formulaTex: "f(x)=x^3-12x+10",
      rule: { kind: "polynomial", coefficients: [10, -12, 0, 1] },
      window: { xMin: -4.5, xMax: 4.5, yMin: -16, yMax: 28 },
      marker: { min: -4.4, max: 4.4, step: 0.05, initial: 0 },
    },
    corrections: ["Le PDF attribue l’unicité à la seule continuité et au changement de signe ; la stricte monotonie est ajoutée comme condition nécessaire."],
    questions: [
      choice("La continuité et un changement de signe suffisent toujours à garantir l’unicité de la solution.", ["Vrai", "Faux"], 1, "Ces conditions garantissent l’existence ; l’unicité demande ici la stricte monotonie.", "Contrôle de la propriété corrigée"),
      short("Pour $f(x)=x^3-12x+10$, calcule $f(0)$.", ["10"], "On obtient 0-0+10=10.", "Exercice de fixation", 1),
      short("Pour la même fonction, calcule $f(1)$.", ["-1"], "$1-12+10=-1$.", "Exercice de fixation", 1),
      short("Calcule $f(0,8)$.", ["0,912", "0.912"], "$0,8^3-12(0,8)+10=0,912$.", "Exercice de fixation", 2),
      short("Calcule $f(0,9)$.", ["-0,071", "-0.071"], "$0,9^3-12(0,9)+10=-0,071$.", "Exercice de fixation", 2),
      short("Déduis un encadrement de la solution α.", ["0,8<α<0,9", "0.8<alpha<0.9", "0,8<alpha<0,9"], "Les images en 0,8 et 0,9 sont de signes contraires.", "Exercice de fixation", 2),
    ],
  },
  {
    id: "bisection-method",
    title: "Encadrement d’une solution par dichotomie",
    summary: "Réduire progressivement un intervalle contenant une racine en le divisant en deux.",
    pages: "18-19",
    section: "VI-3.a. Méthode de dichotomie",
    durationMinutes: 22,
    xp: 55,
    kind: "practice",
    body: String.raw`## Principe

Soit $f$ continue sur $[a,b]$, avec $f(a)$ et $f(b)$ de signes contraires. On cherche $\alpha\in[a,b]$ tel que $f(\alpha)=0$.

1. calculer le milieu $m=\frac{a+b}{2}$ ;
2. calculer $f(a)$, $f(m)$ et $f(b)$ ;
3. si $f(a)f(m)<0$, conserver $[a,m]$ ;
4. sinon, si $f(m)f(b)<0$, conserver $[m,b]$ ;
5. recommencer sur le nouvel intervalle jusqu’à la précision demandée.

À chaque étape, la longueur de l’intervalle est divisée par deux.

### L’exemple du cours en tableau

Pour $f(x)=x^3-12x+10$ sur $[0;1]$, avec $f(0)=10$ et $f(1)=-1$ :

| Étape | Intervalle | Milieu $m$ | $f(m)$ | Conclusion |
|---|---|---|---|---|
| 1 | $[0;1]$ | $0{,}5$ | $4{,}125>0$ | $\alpha\in\left]0{,}5;1\right[$ |

### Pour aller plus loin (étape supplémentaire)

| Étape | Intervalle | Milieu $m$ | $f(m)$ | Conclusion |
|---|---|---|---|---|
| 2 | $[0{,}5;1]$ | $0{,}75$ | $1{,}42>0$ | $\alpha\in\left]0{,}75;1\right[$ |

En répétant, l’encadrement se resserre : chaque étape divise l’incertitude par deux.`,
    keyPoint: "La dichotomie conserve toujours la moitié d’intervalle dont les images aux extrémités sont de signes contraires.",
    example: "Pour $f(x)=x^3-12x+10$ sur [0;1], $m=0,5$ et $f(0,5)=4,125>0$ ; comme $f(1)<0$, la racine est dans ]0,5;1[.",
    methodSteps: ["Calcule le milieu de l’intervalle.", "Évalue la fonction aux extrémités et au milieu.", "Conserve la moitié où le produit des images est négatif.", "Répète jusqu’à obtenir la précision voulue."],
    timeline: [
      { label: "Milieu", detail: "m=(a+b)/2." },
      { label: "Signes", detail: "Comparer f(a), f(m) et f(b)." },
      { label: "Moitié utile", detail: "Conserver l’intervalle avec changement de signe." },
      { label: "Répéter", detail: "Recommencer sur l’intervalle réduit." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Zoom sur [0 ; 1] : coince la racine",
      instruction: "Teste le milieu 0,5 puis 0,75 : de quel côté la courbe change-t-elle de signe ?",
      observation: "f(0,5) = 4,125 > 0 et f(1) = -1 < 0 : la racine se cache dans la moitié droite ]0,5 ; 1[. Chaque coup de ciseaux divise l’intervalle par deux.",
      formula: "f(x) = x³ - 12x + 10",
      formulaTex: "f(x)=x^3-12x+10",
      rule: { kind: "polynomial", coefficients: [10, -12, 0, 1] },
      window: { xMin: -0.2, xMax: 1.3, yMin: -3, yMax: 11 },
      marker: { min: 0, max: 1.25, step: 0.025, initial: 0.5 },
    },
    corrections: ["La valeur f(0) indiquée 12 dans la solution du PDF est corrigée en 10."],
    questions: [
      short("Pour $f(x)=x^3-12x+10$ sur [0;1], calcule le premier milieu.", ["0,5", "0.5", "1/2"], "Le milieu est (0+1)/2=0,5.", "Exercice de fixation - étape 1"),
      short("Calcule $f(0,5)$.", ["4,125", "4.125"], "$0,5^3-12(0,5)+10=4,125$.", "Exercice de fixation - étape 2"),
      short("Après cette première étape, donne l’encadrement de α.", ["0,5<α<1", "0.5<alpha<1", "0,5<alpha<1"], "$f(0,5)>0$ et $f(1)<0$.", "Exercice de fixation - conclusion", 2),
    ],
  },
  {
    id: "scanning-method",
    title: "Encadrement d’une solution par balayage",
    summary: "Tester régulièrement des valeurs jusqu’à repérer deux images consécutives de signes contraires.",
    pages: "19",
    section: "VI-3.b. Méthode par balayage",
    durationMinutes: 18,
    xp: 50,
    kind: "practice",
    body: String.raw`## Principe

Soit $f$ continue sur $[a,b]$ avec $f(a)f(b)<0$.

La méthode par balayage consiste à choisir un pas, par exemple $0,1$, puis à calculer successivement :

$f(a)$, $f(a+0,1)$, $f(a+0,2)$, $f(a+0,3)$, etc.

On s’arrête lorsque deux résultats consécutifs sont de signes contraires. Si $f(u)f(u+0,1)<0$, alors :

$u<\alpha<u+0,1$.

Un pas plus petit permet d’obtenir un encadrement plus précis, mais demande davantage de calculs.

### Le tableau du cours pour $f(x)=x^3-3x$ sur $[1;2]$

| $x$ | 1,1 | 1,2 | 1,3 | 1,4 | 1,5 | 1,6 | 1,7 | 1,8 |
|---|---|---|---|---|---|---|---|---|
| Signe de $f(x)$ | $-$ | $-$ | $-$ | $-$ | $-$ | $-$ | $-$ | $+$ |

Le premier changement de signe apparaît entre $1{,}7$ et $1{,}8$ : comme $f(1{,}7)f(1{,}8)<0$, on conclut $1{,}7<\alpha<1{,}8$.

> **Dichotomie ou balayage ?** La dichotomie coupe l’intervalle en deux à chaque étape ; le balayage avance régulièrement d’un pas fixe. Les deux s’appuient sur le même principe : encadrer le changement de signe.`,
    keyPoint: "Au balayage, la racine est comprise entre les deux valeurs consécutives dont les images changent de signe.",
    example: "Pour $f(x)=x^3-3x$, $f(1,7)<0$ et $f(1,8)>0$, donc $1,7<\\alpha<1,8$.",
    methodSteps: ["Choisis le pas demandé.", "Calcule les images dans l’ordre croissant.", "Repère le premier changement de signe entre deux valeurs consécutives.", "Écris l’encadrement correspondant."],
    timeline: [
      { label: "Pas", detail: "Choisir 0,1 ou la précision demandée." },
      { label: "Valeurs", detail: "Calculer les images successives." },
      { label: "Changement", detail: "Repérer deux signes consécutifs opposés." },
      { label: "Encadrement", detail: "Placer α entre ces deux abscisses." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Balaye [1 ; 2] au pas de 0,1",
      instruction: "Le curseur avance exactement de 0,1 en 0,1, comme la méthode : trouve les deux positions où f(x) change de signe.",
      observation: "De 1,0 à 1,7 les images restent négatives ; en 1,8 elles deviennent positives. La racine α = √3 ≈ 1,73 est coincée entre 1,7 et 1,8.",
      formula: "f(x) = x³ - 3x",
      formulaTex: "f(x)=x^3-3x",
      rule: { kind: "polynomial", coefficients: [0, -3, 0, 1] },
      window: { xMin: -2.6, xMax: 2.6, yMin: -4.5, yMax: 4.5 },
      marker: { min: 1, max: 2, step: 0.1, initial: 1 },
    },
    corrections: ["La répétition de f(a+0,1) dans le PDF est détaillée en f(a+0,1), f(a+0,2), f(a+0,3), etc."],
    questions: [
      short("Pour $f(x)=x^3-3x$, sachant que $f(1,7)<0$ et $f(1,8)>0$, donne un encadrement de α.", ["1,7<α<1,8", "1.7<alpha<1.8", "1,7<alpha<1,8"], "Le changement de signe se produit entre 1,7 et 1,8.", "Exercice de fixation", 3),
    ],
  },
  {
    id: "complete-function-study-mission",
    title: "Mission finale : conduire une étude complète de fonction",
    summary: "Mobiliser limites, asymptotes, dérivée, variations et extremum dans les situations complexes du document.",
    pages: "20-28",
    section: "C. Situation complexe et D. Exercices 8-9",
    durationMinutes: 45,
    xp: 100,
    kind: "challenge",
    body: String.raw`## Méthode complète d’étude

Pour étudier une fonction rationnelle et représenter sa courbe :

1. déterminer son ensemble de définition ;
2. calculer les limites aux bornes du domaine ;
3. interpréter les limites en termes d’asymptotes ;
4. chercher une écriture faisant apparaître une asymptote oblique ;
5. étudier la position relative de la courbe et de l’asymptote ;
6. calculer et factoriser la dérivée ;
7. étudier son signe et construire le tableau de variations ;
8. calculer des points remarquables, rechercher une éventuelle symétrie et tracer la courbe.

## Situation complexe du COGES

Le bénéfice après six mois est modélisé par
$$B(x)=-x^2+7200x-7\,760\,000$$

Sa dérivée est $B'(x)=-2x+7200$. Elle est positive avant $3600$, nulle en $3600$, puis négative après $3600$. La fonction croît donc jusqu’à $3600$ puis décroît.

| $x$ | $0\to3600$ | $3600$ | $3600\to+\infty$ |
|---|---|---|---|
| $B'(x)$ | $+$ | $0$ | $-$ |
| $B$ | ↗ | $5\,200\,000$ | ↘ |

Le bénéfice maximal est $B(3600)=5\,200\,000$ F CFA. Il dépasse le coût de construction annoncé de $5\,179\,000$ F CFA : le projet peut être financé selon le modèle proposé.

## Fonction rationnelle de synthèse

Pour $f(x)=\frac{x^2+3x+3}{x+1}$ :

- $D_f=\mathbb{R}\setminus\{-1\}$ ;
- $f(x)=x+2+\frac1{x+1}$ ;
- $x=-1$ est asymptote verticale ;
- $y=x+2$ est asymptote oblique aux deux infinis ;
- $f'(x)=\frac{x(x+2)}{(x+1)^2}$ ;
- le point $A(-1;1)$ est centre de symétrie.

> Cette mission rassemble sans les supprimer les longues applications de fin de document.`,
    keyPoint: "Une étude complète suit toujours l’ordre : domaine, limites, asymptotes, dérivée, variations, points et courbe.",
    example: "Le changement de signe de $B'(x)$ de + à - en 3600 prouve que $B(3600)$ est le bénéfice maximal.",
    methodSteps: ["Écris le domaine et les limites.", "Détermine les asymptotes et la position de la courbe.", "Calcule la dérivée, son signe et les variations.", "Termine par les valeurs remarquables, la symétrie et le tracé."],
    timeline: [
      { label: "Domaine-limites", detail: "Préparer les bornes et le comportement de la courbe." },
      { label: "Asymptotes", detail: "Interpréter les limites et comparer la courbe aux droites." },
      { label: "Dérivée", detail: "Déterminer les variations et extrema." },
      { label: "Synthèse", detail: "Placer les points, la symétrie et conclure dans le contexte." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Trouve le bénéfice maximal du COGES",
      instruction: "Fais varier le nombre d’articles vendus : où le bénéfice dépasse-t-il la ligne rouge du coût, et où culmine-t-il ?",
      observation: "Le sommet de la parabole est atteint en x = 3600 articles : le bénéfice maximal de 5 200 000 F dépasse le coût de construction de 5 179 000 F. Le projet est finançable.",
      formula: "B(x) = -x² + 7200x - 7 760 000",
      formulaTex: "B(x)=-x^2+7200x-7\\,760\\,000",
      rule: { kind: "polynomial", coefficients: [-7760000, 7200, -1] },
      window: { xMin: 0, xMax: 7200, yMin: -8000000, yMax: 6500000 },
      guides: [
        { kind: "horizontal", value: 5179000, label: "coût : 5 179 000 F" },
        { kind: "vertical", value: 3600, label: "x = 3600" },
      ],
      marker: { min: 0, max: 7200, step: 50, initial: 800 },
    },
    corrections: ["Le coût de construction est repris à 5 179 000 F CFA conformément à l’énoncé, malgré une écriture 5 170 000 dans la dernière comparaison."],
    questions: [
      short("Pour $B(x)=-x^2+7200x-7\\,760\\,000$, donne $B'(x)$.", ["-2x+7200", "B'(x)=-2x+7200"], "On dérive le polynôme terme à terme.", "C-Situation complexe", 1),
      short("Quel nombre d’articles maximise le bénéfice B ?", ["3600", "3600 articles"], "B' s’annule en 3600 en passant de positive à négative.", "C-Situation complexe", 2),
      short("Quel est le bénéfice maximal en F CFA ?", ["5200000", "5 200 000", "5200000 F CFA"], "$B(3600)=5\\,200\\,000$.", "C-Situation complexe", 2),
      choice("Ce bénéfice permet-il de financer une construction estimée à 5 179 000 F CFA ?", ["Oui", "Non"], 0, "5 200 000 est supérieur à 5 179 000.", "C-Situation complexe", 1),
      short("Pour $f(x)=\\frac{x^2+3x+3}{x+1}$, donne son ensemble de définition.", ["R\\{-1}", "R\\{-1}", "]-∞;-1[∪]-1;+∞[", "x≠-1"], "Le dénominateur x+1 ne doit pas être nul.", "D-Exercice 8 - question 1"),
      short("Calcule $\\lim_{x\\to-1^-}f(x)$.", ["-∞", "-infini"], "Le numérateur tend vers 1 et le dénominateur vers 0-.", "D-Exercice 8 - question 2a"),
      short("Calcule $\\lim_{x\\to-1^+}f(x)$.", ["+∞", "+infini"], "Le numérateur tend vers 1 et le dénominateur vers 0+.", "D-Exercice 8 - question 2a"),
      short("Donne l’asymptote verticale de cette fonction.", ["x=-1", "x = -1"], "Les limites en -1 sont infinies.", "D-Exercice 8 - question 2b"),
      short("Complète l’écriture $f(x)=x+2+\\dots$.", ["1/(x+1)", "1 / (x + 1)"], "La division donne le reste 1/(x+1).", "D-Exercice 8 - question 4"),
      short("Donne l’asymptote oblique de f.", ["y=x+2", "y = x + 2"], "La différence f(x)-(x+2)=1/(x+1) tend vers 0.", "D-Exercice 8 - question 5a"),
      short("Donne $f'(x)$ sous forme factorisée.", ["x(x+2)/(x+1)^2", "x(x+2)/(x+1)²"], "La formule du quotient conduit à cette expression.", "D-Exercice 8 - question 6a", 2),
      short("Donne les coordonnées du centre de symétrie de la courbe.", ["(-1;1)", "(-1,1)", "A(-1;1)"], "On vérifie $f(-1+x)+f(-1-x)=2$.", "D-Exercice 8 - question 7", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalAPolynomialRationalPath: LearningPath = {
  id: "terminale-a-polynomial-rational-functions",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 1,
  title: "Étude de fonctions polynômes et de fonctions rationnelles",
  description: "Le cours officiel intégral, sans les activités, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer et interpréter les limites d’une fonction polynôme ou rationnelle",
    "Exploiter les opérations sur les limites et déterminer les asymptotes",
    "Calculer une dérivée et conduire une étude complète de fonction",
    "Utiliser la tangente, le théorème des valeurs intermédiaires, la dichotomie et le balayage",
  ],
  modules: [
    { id: "official-course", title: "Leçon officielle", description: "Progression fidèle au document source.", lessons: builtLevels },
  ],
};
