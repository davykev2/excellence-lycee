import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 10 Fonction exponentielle et fonction puissance.pdf";

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
  curve?: CurveLessonInteraction;
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
    interaction: seed.curve ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Construis le raisonnement",
      instruction: "Sélectionne chaque étape pour retrouver la logique de la méthode.",
      observation: "Avec une exponentielle, la positivité et le sens de variation de la base donnent souvent le signe ou le sens de l’inégalité.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Suis les étapes dans l’ordre et écris les transformations intermédiaires avant de conclure.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : une exponentielle est toujours strictement positive ; le signe vient donc des autres facteurs.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const expCurve: CurveLessonInteraction = {
  kind: "curve",
  eyebrow: "Courbe interactive",
  title: "L’exponentielle et sa tangente en zéro",
  instruction: "Déplace le point pour observer la croissance de $e^x$ et son rapprochement de l’axe des abscisses à gauche.",
  observation: "La courbe reste au-dessus de l’axe, passe par $(0;1)$ et sa tangente en $0$ est $y=x+1$.",
  formula: "f(x) = e^x",
  formulaTex: String.raw`f(x)=e^x`,
  rule: { kind: "affine-plus-exp", slope: 0, intercept: 0, coefficient: 1, rate: 1 },
  window: { xMin: -5, xMax: 3, yMin: -1, yMax: 10 },
  guides: [
    { kind: "horizontal", value: 0, label: "Asymptote $y=0$" },
    { kind: "oblique", slope: 1, intercept: 1, label: "Tangente $y=x+1$" },
  ],
  marker: { min: -5, max: 2.2, step: 0.1, initial: 0 },
};

const halfPowerCurve: CurveLessonInteraction = {
  kind: "curve",
  eyebrow: "Comparer les bases",
  title: "Une base comprise entre zéro et un décroît",
  instruction: "Déplace le point sur la courbe de $(1/2)^x$ et observe le sens de variation.",
  observation: String.raw`Comme $\ln(1/2)<0$, la dérivée est négative : la courbe descend tout en restant strictement positive.`,
  formula: "f(x) = (1/2)^x",
  formulaTex: String.raw`f(x)=\left(\frac12\right)^x`,
  rule: { kind: "affine-plus-exp", slope: 0, intercept: 0, coefficient: 1, rate: Math.log(0.5) },
  window: { xMin: -4, xMax: 6, yMin: -1, yMax: 17 },
  guides: [{ kind: "horizontal", value: 0, label: "Asymptote $y=0$" }],
  marker: { min: -4, max: 6, step: 0.25, initial: 0 },
};

const advertisingCurve: CurveLessonInteraction = {
  kind: "curve",
  eyebrow: "Mission finale",
  title: "Quand la population informée atteint-elle 90 % ?",
  instruction: "Déplace le curseur jusqu’à ce que $P(t)$ franchisse le seuil $0{,}9$.",
  observation: "Le seuil est franchi après environ $10{,}96$ jours : il faut donc prévoir 11 jours entiers.",
  formula: "P(t) = 1 - e^(-0,21t)",
  formulaTex: String.raw`P(t)=1-e^{-0{,}21t}`,
  rule: { kind: "affine-plus-exp", slope: 0, intercept: 1, coefficient: -1, rate: -0.21 },
  window: { xMin: 0, xMax: 25, yMin: -0.1, yMax: 1.1 },
  guides: [
    { kind: "horizontal", value: 0.9, label: String.raw`Seuil $90\%$` },
    { kind: "vertical", value: 11, label: "$t=11$ jours" },
  ],
  marker: { min: 0, max: 25, step: 1, initial: 7 },
};

const levels: OfficialLevelSeed[] = [
  {
    id: "exp-properties",
    title: "Définition et propriétés algébriques de l’exponentielle",
    summary: String.raw`Relier $\exp$ et $\ln$, puis simplifier produits, quotients et puissances d’exponentielles.`,
    pages: "1-2 et 7",
    section: "I-1. Définition, conséquences et propriétés algébriques • Exercices 1 et 2",
    durationMinutes: 42,
    body: String.raw`## Une fonction réciproque du logarithme

La fonction **exponentielle népérienne**, notée $\exp$, est la bijection réciproque de $\ln$ :

$$
\exp:\mathbb R\longrightarrow]0;+\infty[,
\qquad x\longmapsto e^x.
$$

Pour $x\in\mathbb R$ et $y>0$ :

$$
e^x=y\iff x=\ln y.
$$

| Repère | Propriété |
|---|---|
| Domaine | $e^x$ existe pour tout $x\in\mathbb R$ |
| Positivité | $e^x>0$ : une exponentielle n’est jamais nulle |
| Valeurs clés | $e^0=1$ et $e^1=e$ |
| Réciprocité | $e^{\ln y}=y$ pour $y>0$ et $\ln(e^x)=x$ |
| Variation | $x\mapsto e^x$ est strictement croissante |

> **Image mentale de Davy.** Les courbes de $\ln$ et de $\exp$ sont les reflets l’une de l’autre par rapport à la droite $y=x$.

## Calculer avec les exposants

Pour $a,b\in\mathbb R$ et $r\in\mathbb Q$ :

$$
e^ae^b=e^{a+b},\qquad \frac{e^a}{e^b}=e^{a-b},\qquad e^{-b}=\frac1{e^b},\qquad (e^a)^r=e^{ar}.
$$

### Fixation du cours

$$
\ln\sqrt e=\ln(e^{1/2})=\frac12,
$$

$$
e^{x+\ln3}=e^xe^{\ln3}=3e^x,
\qquad
\frac{e^{2x}}{e^x}=e^x.
$$

### Exercices 1 et 2 rédigés

$$
A=\frac{e^6}{e^3}=e^3,
\quad B=\frac{e^{-3}}{e^{-7}}=e^4,
\quad C=\frac{e^5e^{-2}}{e^3}=1,
$$

$$
D=e^6e^{-4}=e^2,
\qquad E=(e^{-4})^3=e^{-12}.
$$

Pour les expressions littérales :

$$
(e^x)^3e^{2x}=e^{5x},
\quad \frac{e^{3x}}{(e^{-x})^2}=e^{5x},
\quad \frac{e^xe^y}{e^{x-y}}=e^{2y}.
$$

> **Erreur fréquente.** Dans un produit, on **additionne** les exposants ; dans un quotient, on les **soustrait** ; dans une puissance, on les **multiplie**.` ,
    keyPoint: String.raw`$e^ae^b=e^{a+b},\quad \frac{e^a}{e^b}=e^{a-b},\quad e^x>0.$`,
    example: String.raw`$\dfrac{e^{3x}}{(e^{-x})^2}=e^{3x-(-2x)}=e^{5x}.$`,
    methodSteps: [
      "Repère si l’expression est un produit, un quotient ou une puissance.",
      "Effectue l’opération correspondante sur les exposants.",
      "Réduis l’exposant et contrôle que le résultat reste strictement positif.",
    ],
    timeline: [
      { label: "Réciproques", detail: "e^(ln y) = y et ln(e^x) = x." },
      { label: "Produit", detail: "Le produit d’exponentielles additionne les exposants." },
      { label: "Quotient", detail: "Le quotient soustrait l’exposant du dénominateur." },
      { label: "Puissance", detail: "Une puissance multiplie les exposants." },
    ],
    corrections: [
      "La première page du document porte la mention « Tle D — Leçon 7 », alors que le fichier officiel fourni et la progression de Terminale C classent ce contenu comme leçon 10. Le contenu mathématique est conservé et partagé avec le parcours miroir de Terminale D.",
    ],
    questions: [
      choice(String.raw`Quel est l’ensemble de définition de $x\mapsto e^x$ ?`, [String.raw`$\mathbb R$`, String.raw`$]0;+\infty[$`, String.raw`$\mathbb R\setminus\{0\}$`, String.raw`$[0;+\infty[$`], 0, "L’exponentielle est définie pour tout réel.", "Cours • page 1"),
      choice("Quelle affirmation est toujours vraie ?", ["$e^x<0$", "$e^x=0$", "$e^x>0$", String.raw`$e^x\leq0$`], 2, String.raw`L’image de l’exponentielle est $]0;+\infty[$.`, "Cours • page 1"),
      short("Calcule $e^0$.", ["1", "+1"], "$e^0=1$.", "Cours • page 1"),
      short(String.raw`Calcule $\ln(e^{-7})$.`, ["-7", "−7"], String.raw`$\ln(e^x)=x$.`, "Cours • page 1"),
      short(String.raw`Calcule $e^{\ln12}$.`, ["12", "+12"], String.raw`$e^{\ln y}=y$ pour $y>0$.`, "Cours • page 1"),
      short(String.raw`Simplifie $\ln\sqrt e$.`, ["1/2", "0,5", "0.5"], String.raw`$\sqrt e=e^{1/2}$.`, "Exercice de fixation • page 2"),
      choice(String.raw`Simplifie $e^{x+\ln3}$.`, ["$3e^x$", "$e^{3x}$", "$x+3$", "$e^x+3$"], 0, String.raw`$e^{x+\ln3}=e^xe^{\ln3}=3e^x$.`, "Exercice de fixation • page 2"),
      choice("Exercice 1-A : simplifie $e^6/e^3$.", ["$e^2$", "$e^3$", "$e^9$", "$1$"], 1, "$6-3=3$.", "Exercice 1-A • page 7"),
      choice("Exercice 1-B : simplifie $e^{-3}/e^{-7}$.", ["$e^{-10}$", "$e^{-4}$", "$e^4$", "$e^{10}$"], 2, "$-3-(-7)=4$.", "Exercice 1-B • page 7"),
      short(String.raw`Exercice 1-C : calcule $\dfrac{e^5e^{-2}}{e^3}$.`, ["1", "e^0", "e^{0}"], "L’exposant total vaut $5-2-3=0$.", "Exercice 1-C • page 7"),
      choice("Exercice 1-E : simplifie $(e^{-4})^3$.", ["$e^{-12}$", "$e^{-1}$", "$e^{12}$", "$e^{-7}$"], 0, String.raw`$-4\times3=-12$.`, "Exercice 1-E • page 7"),
      choice(String.raw`Exercice 2-C : simplifie $\dfrac{e^xe^y}{e^{x-y}}$.`, ["$e^{2y}$", "$e^{2x}$", "$e^{x+y}$", "$1$"], 0, "$x+y-(x-y)=2y$.", "Exercice 2-C • page 7", 2),
    ],
  },
  {
    id: "exp-equations",
    title: "Équations et inéquations exponentielles",
    summary: "Identifier les exposants, prendre le logarithme ou poser $X=e^x>0$ pour résoudre.",
    pages: "2-3, 7 et 8-9",
    section: "I-1-d. Équations et inéquations • Exercices 3 et 11 à 16",
    durationMinutes: 62,
    body: String.raw`## Trois stratégies à reconnaître

### 1. Même base

La fonction exponentielle est strictement croissante, donc :

$$
e^u=e^v\iff u=v,
\qquad
e^u<e^v\iff u<v.
$$

Exemple : $e^{2x-1}=e^{x+5}\iff2x-1=x+5\iff x=6$.

### 2. Un nombre positif isolé

$$
e^{x-2}=5\iff x-2=\ln5\iff x=2+\ln5.
$$

### 3. Un trinôme en $e^x$

On pose

$$
X=e^x\quad\text{avec}\quad X>0.
$$

Ainsi :

$$
e^{2x}+e^x-6=0
\iff X^2+X-6=0
\iff X\in\{-3;2\}.
$$

La condition $X>0$ élimine $-3$ ; il reste $e^x=2$, donc $x=\ln2$.

## Inéquations

Pour $e^{2x}-5e^x+6\geq0$, la substitution donne

$$
X^2-5X+6=(X-2)(X-3)\geq0.
$$

Comme $X>0$, on obtient $0<X\leq2$ ou $X\geq3$, donc

$$
x\leq\ln2\quad\text{ou}\quad x\geq\ln3.
$$

## Exercices de renforcement : ce qu’il faut voir

- $e^{2x}+e^x+3=0$ n’a pas de solution : le trinôme $X^2+X+3$ n’a aucune racine réelle.
- $2^x+1+2^{-x}=0$ n’a pas de solution : chacun des trois termes est strictement positif.
- Pour $p(X)=2X^3-7X^2-5X+4=(X+1)(2X-1)(X-4)$, la condition $X=e^x>0$ élimine toute partie située à gauche de zéro.

> **Astuce mémoire de Davy.** Dès que tu vois à la fois $e^{2x}$ et $e^x$, pose $X=e^x$ et écris immédiatement **$X>0$**. C’est cette condition qui élimine les fausses solutions.

> **Correction de source.** Dans le corrigé de la page 3, l’inéquation est recopiée avec $-6$ alors que l’énoncé, le trinôme et les racines utilisent bien $+6$. La résolution correcte porte sur $e^{2x}-5e^x+6\geq0$.`,
    keyPoint: String.raw`$X=e^x>0\quad\text{et}\quad e^u=e^v\iff u=v.$`,
    example: String.raw`$e^{2x}-3e^x+2=0\iff X^2-3X+2=0\iff x\in\{0;\ln2\}.$`,
    methodSteps: [
      "Cherche d’abord si les deux membres peuvent être écrits avec la même base.",
      "Si une exponentielle est isolée face à un nombre positif, applique le logarithme.",
      "Si plusieurs puissances de e^x apparaissent, pose X=e^x et note X>0.",
      "Résous l’équation ou l’inéquation en X, élimine X≤0, puis reviens à x avec le logarithme.",
      "Vérifie les bornes et le sens des inégalités.",
    ],
    timeline: [
      { label: "Même base", detail: "Identifie directement les exposants." },
      { label: "Isoler", detail: "Face à un nombre positif, applique ln." },
      { label: "Substituer", detail: "Pose X=e^x>0 pour obtenir un polynôme." },
      { label: "Filtrer", detail: "Supprime les racines X≤0 avant de revenir à x." },
    ],
    corrections: [
      "À la page 3, le corrigé recopie par erreur e^{2x}−5e^x−6≥0. L’énoncé et toute la factorisation correcte portent sur e^{2x}−5e^x+6≥0.",
      "Le corrigé imprimé de l’exercice 11 s’arrête avant la résolution du trinôme de la première équation. Les deux solutions complètes sont 1−√(5−ln5) et 1+√(5−ln5).",
    ],
    questions: [
      short("Résous $e^{2x-1}=e^{x+5}$.", ["6", "x=6", "{6}"], "L’injectivité donne $2x-1=x+5$.", "Fixation 1 • page 2"),
      short("Résous $e^{x-2}=5$.", ["2+ln5", "2+ln(5)", "x=2+ln5", "2 + ln 5"], String.raw`$x-2=\ln5$.`, "Fixation 2 • page 2"),
      short("Résous $e^{2x}+e^x-6=0$.", ["ln2", "ln(2)", "x=ln2", "{ln2}"], "Avec $X=e^x>0$, seule la racine $X=2$ convient.", "Fixation 3 • page 2", 2),
      choice("Résous $e^{2x-1}<8$.", [String.raw`$x<(1+\ln8)/2$`, String.raw`$x>\ln8$`, String.raw`$x<\ln8/2$`, String.raw`$x> (1+\ln8)/2$`], 0, String.raw`$2x-1<\ln8$.`, "Fixation • page 3", 2),
      choice(String.raw`Résous $e^{2x}-5e^x+6\geq0$.`, [String.raw`$x\in[\ln2;\ln3]$`, String.raw`$x\leq\ln2$ ou $x\geq\ln3$`, String.raw`$x>\ln3$`, String.raw`$x<\ln2$`], 1, "Le trinôme est positif à l’extérieur de ses racines 2 et 3.", "Fixation corrigée • page 3", 2),
      short("Exercice 3-a : résous $e^{3-x}=1$.", ["3", "x=3", "{3}"], "$1=e^0$, donc $3-x=0$.", "Exercice 3-a • page 7"),
      choice("Exercice 3-b : résous $e^{2x^2+3}=e^{7x}$.", [String.raw`$\{1/2;3\}$`, String.raw`$\{-1/2;3\}$`, String.raw`$\{0;7/2\}$`, String.raw`$\{3\}$`], 0, "$2x^2-7x+3=0$ a pour racines $1/2$ et $3$.", "Exercice 3-b • page 7", 2),
      short("Exercice 3-c : résous $(e^x-2)(e^{-x}+1)=0$.", ["ln2", "ln(2)", "x=ln2"], "$e^{-x}+1>0$, donc seul $e^x=2$ convient.", "Exercice 3-c • page 7", 2),
      choice("Exercice 11-1 : quelles sont les solutions de $e^{-x^2+2x+4}=5$ ?", [String.raw`$1\pm\sqrt{5-\ln5}$`, String.raw`$1\pm\sqrt{5+\ln5}$`, String.raw`$-1\pm\sqrt5$`, String.raw`$\ln5$`], 0, String.raw`On résout $x^2-2x+\ln5-4=0$.`, "Exercice 11-1 corrigé • pages 8 et 13", 3),
      choice("Exercice 11-2 : résous $e^{2x}-3e^x+2=0$.", [String.raw`$\{0;\ln2\}$`, String.raw`$\{1;2\}$`, String.raw`$\{\ln2\}$`, String.raw`$\varnothing$`], 0, "$X^2-3X+2=0$ donne $X=1$ ou $X=2$.", "Exercice 11-2 • pages 8 et 13", 2),
      choice("Exercice 12-1 : résous $e^{2x}-3e^x+2<0$.", [String.raw`$]0;\ln2[$`, String.raw`$]-\infty;0[$`, "$]1;2[$", String.raw`$]0;+\infty[$`], 0, "$1<e^x<2$.", "Exercice 12-1 • page 9", 2),
      choice("Exercice 12-2 : résous $e^{-x^2+2x+4}>1$.", [String.raw`$]1-\sqrt5;1+\sqrt5[$`, String.raw`$]-\infty;1-\sqrt5[$`, "$]0;2[$", String.raw`$\mathbb R$`], 0, "$-x^2+2x+4>0$.", "Exercice 12-2 • page 9", 2),
      choice("Exercice 13-a : $e^{2x}+e^x+3=0$ possède :", ["Aucune solution", "Une solution", "Deux solutions", "La solution $0$"], 0, "$X^2+X+3$ a un discriminant négatif.", "Exercice 13-a • page 9"),
      short("Exercice 13-b : résous $e^{2x}+e^x-2=0$.", ["0", "x=0", "{0}"], "$X=1$ est la seule racine positive.", "Exercice 13-b • page 9"),
      short("Exercice 13-c : résous $e^{2x}-2e^x+1=0$.", ["0", "x=0", "{0}"], "$(e^x-1)^2=0$.", "Exercice 13-c • page 9"),
      short("Exercice 13-d : résous $-3e^{2x}-9e^x+12=0$.", ["0", "x=0", "{0}"], "La seule racine positive du trinôme est $X=1$.", "Exercice 13-d • page 9", 2),
      choice(String.raw`Exercice 14-a : résous $2e^{2x}-3e^x-2\leq0$.`, [String.raw`$x\leq\ln2$`, String.raw`$x\geq\ln2$`, String.raw`$x\in[-1/2;2]$`, "$x<0$"], 0, String.raw`$0<e^x\leq2$.`, "Exercice 14-a • page 9", 2),
      choice(String.raw`Exercice 14-b : résous $(e^x+1)(e^{-x}-1)\leq0$.`, [String.raw`$x\geq0$`, String.raw`$x\leq0$`, "$x>1$", String.raw`$\mathbb R$`], 0, String.raw`$e^x+1>0$ et $e^{-x}-1\leq0\iff x\geq0$.`, "Exercice 14-b • page 9", 2),
      choice(String.raw`Exercice 14-c : résous $\dfrac{e^x+1}{x+2}\geq0$.`, [String.raw`$]-2;+\infty[$`, String.raw`$[-2;+\infty[$`, String.raw`$]-\infty;-2[$`, String.raw`$\mathbb R$`], 0, "Le numérateur est positif ; il faut $x+2>0$.", "Exercice 14-c • page 9", 2),
      choice(String.raw`Exercice 14-d : résous $\dfrac{x(e^{-x}-1)}{x-3}\geq0$.`, [String.raw`$]-\infty;3[$`, "$]0;3[$", String.raw`$]3;+\infty[$`, String.raw`$\mathbb R\setminus\{3\}$`], 0, "Le numérateur est négatif ou nul et le dénominateur est négatif pour $x<3$.", "Exercice 14-d • page 9", 3),
      choice("Exercice 15 : l’équation $2^x+1+2^{-x}=0$ possède :", ["Aucune solution", "$x=0$", "$x=1$", "Deux solutions"], 0, "Les trois termes sont strictement positifs.", "Exercice 15 • page 9"),
      choice("Exercice 16 : résous $2e^{3x}-7e^{2x}-5e^x+4<0$.", [String.raw`$]-\ln2;\ln4[$`, String.raw`$]-\infty;-\ln2[$`, String.raw`$]0;\ln4[$`, "$]1/2;4[$"], 0, "$p(X)=(X+1)(2X-1)(X-4)$ et $X=e^x>0$.", "Exercice 16 • page 9", 3),
    ],
  },
  {
    id: "exp-limits",
    title: "Limites, variation et courbe de l’exponentielle",
    summary: "Maîtriser les cinq limites de référence et reconnaître les formes dominées par l’exponentielle.",
    pages: "3-4 et 8-9",
    section: "I-2. Étude de la fonction exponentielle • Exercices 4 à 6 et 18",
    durationMinutes: 54,
    kind: "graph",
    body: String.raw`## Les cinq limites de référence

$$
\lim_{x\to-\infty}e^x=0,
\qquad
\lim_{x\to+\infty}e^x=+\infty,
$$

$$
\lim_{x\to-\infty}xe^x=0,
\qquad
\lim_{x\to+\infty}\frac{e^x}{x}=+\infty,
\qquad
\lim_{x\to0}\frac{e^x-1}{x}=1.
$$

La fonction $e^x$ est dérivable sur $\mathbb R$ et $(e^x)'=e^x>0$ : elle est donc strictement croissante.

## Lire la courbe

- elle passe par $(0;1)$ ;
- l’axe des abscisses, $y=0$, est asymptote horizontale en $-\infty$ ;
- la tangente au point d’abscisse $0$ est $y=x+1$ ;
- la courbe reste strictement au-dessus de cette tangente, ce qui donne $e^x\geq x+1$.

## Transformer avant de conclure

$$
\lim_{x\to-\infty}(x+1)e^x
=\lim_{x\to-\infty}(xe^x+e^x)=0.
$$

Et, en $+\infty$ :

$$
x(e^{-x}+1)=x\left(\frac1{e^x}+1\right)\longrightarrow+\infty.
$$

## Résultats des exercices officiels

| Expression | Limite demandée | Résultat |
|---|---:|---:|
| $e^x-2x+1$ | $x\to-\infty$ | $+\infty$ |
| $-e^x-x-3$ | $x\to+\infty$ | $-\infty$ |
| $xe^x-x^2-2x+2$ | $x\to0$ | $2$ |
| $(2x+1)e^x+1/x$ | $x\to+\infty$ | $+\infty$ |
| $(2x-3)e^{-x}$ | $x\to-\infty$ | $-\infty$ |

> **Astuce mémoire de Davy.** À droite, $e^x$ gagne contre toute puissance de $x$. À gauche, $e^x$ s’écrase vers zéro, même lorsqu’il est multiplié par $x$.`,
    keyPoint: String.raw`$\lim_{x\to-\infty}xe^x=0,\qquad \lim_{x\to+\infty}\frac{e^x}{x}=+\infty.$`,
    example: String.raw`$(x+1)e^x=xe^x+e^x\longrightarrow0\quad(x\to-\infty).$`,
    methodSteps: [
      "Identifie la borne et la limite de référence la plus proche.",
      "Factorise ou divise pour faire apparaître e^x/x, xe^x ou une fraction en e^x.",
      "Traite séparément chaque terme lorsque la somme ne présente pas de forme indéterminée.",
      "Interprète une limite finie à l’infini comme une asymptote horizontale si nécessaire.",
    ],
    timeline: [
      { label: "À gauche", detail: "$e^x$ et $xe^x$ tendent vers zéro." },
      { label: "À droite", detail: "$e^x$ domine les puissances de x." },
      { label: "En zéro", detail: "$(e^x-1)/x$ tend vers 1." },
      { label: "Géométrie", detail: "y = 0 est asymptote en moins l’infini." },
    ],
    curve: expCurve,
    questions: [
      short(String.raw`Calcule $\lim_{x\to-\infty}e^x$.`, ["0", "+0"], "C’est une limite de référence.", "Cours • page 3"),
      short(String.raw`Calcule $\lim_{x\to+\infty}e^x$.`, ["+∞", "∞", "+infini", "infini"], "L’exponentielle croît sans borne.", "Cours • page 3"),
      short(String.raw`Calcule $\lim_{x\to-\infty}xe^x$.`, ["0", "-0", "+0"], "L’exponentielle l’emporte sur la croissance de $|x|$.", "Cours • page 3"),
      short(String.raw`Calcule $\lim_{x\to0}\dfrac{e^x-1}{x}$.`, ["1", "+1"], "C’est la pente de la tangente à l’exponentielle en zéro.", "Cours • page 3"),
      short(String.raw`Calcule $\lim_{x\to-\infty}(x+1)e^x$.`, ["0", "+0"], "La somme $xe^x+e^x$ tend vers zéro.", "Fixation • page 3", 2),
      choice("Quelle est la tangente à $y=e^x$ en $x=0$ ?", ["$y=x+1$", "$y=x$", "$y=1$", "$y=e x$"], 0, "$f(0)=1$ et $f'(0)=1$.", "Étude de la courbe • page 4", 2),
      short(String.raw`Exercice 4-a : $\lim_{x\to-\infty}(e^x-2x+1)$.`, ["+∞", "∞", "+infini", "infini"], String.raw`$e^x\to0$ et $-2x\to+\infty$.`, "Exercice 4-a • page 8"),
      short(String.raw`Exercice 4-b : $\lim_{x\to+\infty}(-e^x-x-3)$.`, ["-∞", "-infini"], String.raw`Le terme $-e^x$ tend vers $-\infty$.`, "Exercice 4-b • page 8"),
      short(String.raw`Exercice 4-c : $\lim_{x\to0}(xe^x-x^2-2x+2)$.`, ["2", "+2"], "La fonction est continue en zéro.", "Exercice 4-c • page 8"),
      short(String.raw`Exercice 5-a : $\lim_{x\to+\infty}((2x+1)e^x+1/x)$.`, ["+∞", "∞", "+infini", "infini"], String.raw`Le produit positif $(2x+1)e^x$ tend vers $+\infty$.`, "Exercice 5-a • page 8"),
      short(String.raw`Exercice 5-b : $\lim_{x\to-\infty}(2x-3)e^{-x}$.`, ["-∞", "-infini"], String.raw`Le premier facteur est négatif et $e^{-x}$ tend vers $+\infty$.`, "Exercice 5-b • page 8", 2),
      choice(String.raw`Exercice 6-a : limites de $(2-3x)e^x$ en $+\infty$ puis $-\infty$.`, [String.raw`$(-\infty;0)$`, String.raw`$(+\infty;0)$`, String.raw`$(0;-\infty)$`, String.raw`$(-\infty;+\infty)$`], 0, String.raw`À droite le facteur affine est négatif ; à gauche $xe^x\to0$.`, "Exercice 6-a • page 8", 2),
      choice(String.raw`Exercice 6-b : limites de $(x+1)e^{-x}$ en $+\infty$ puis $-\infty$.`, [String.raw`$(0;-\infty)$`, String.raw`$(-\infty;0)$`, String.raw`$(+\infty;0)$`, String.raw`$(0;+\infty)$`], 0, String.raw`$xe^{-x}\to0$ à droite ; à gauche le produit est négatif et non borné.`, "Exercice 6-b • page 8", 2),
      choice(String.raw`Exercice 6-c : limites de $3-2x+e^x$ en $+\infty$ puis $-\infty$.`, [String.raw`$(+\infty;+\infty)$`, String.raw`$(-\infty;+\infty)$`, String.raw`$(+\infty;0)$`, String.raw`$(0;+\infty)$`], 0, String.raw`$e^x$ domine à droite et $-2x$ tend vers $+\infty$ à gauche.`, "Exercice 6-c • page 8", 2),
      choice(String.raw`Exercice 18-a : limites de $\dfrac{e^x+1}{e^x+2}$ en $+\infty$ puis $-\infty$.`, ["$(1;1/2)$", "$(1;0)$", String.raw`$(+\infty;1/2)$`, "$(1/2;1)$"], 0, String.raw`À droite on divise par $e^x$ ; à gauche $e^x\to0$.`, "Exercice 18-a • page 9", 2),
      choice(String.raw`Exercice 18-b : limites de $\dfrac{e^x+2}{x+2}$ en $+\infty$ puis $-\infty$.`, [String.raw`$(+\infty;0)$`, "$(1;0)$", String.raw`$(0;+\infty)$`, String.raw`$(-\infty;0)$`], 0, "$e^x$ domine x à droite ; à gauche le numérateur tend vers 2.", "Exercice 18-b • page 9", 2),
      choice(String.raw`Exercice 18-c : limites de $\dfrac{xe^x}{x+1}$ en $+\infty$ puis $-\infty$.`, [String.raw`$(+\infty;0)$`, String.raw`$(0;+\infty)$`, "$(1;0)$", String.raw`$(+\infty;1)$`], 0, String.raw`$x/(x+1)\to1$ aux deux infinis.`, "Exercice 18-c • page 9", 2),
    ],
  },
  {
    id: "exp-derivative",
    title: "Dérivées composées et études de variations",
    summary: "Dériver $e^{u(x)}$, des produits et des quotients, puis exploiter la positivité de l’exponentielle.",
    pages: "3-4 et 8-10, 13-14",
    section: "I-3-a. Dérivées • Exercices 7, 8, 17, 19, 21 et 22",
    durationMinutes: 74,
    body: String.raw`## Dérivée d’une exponentielle composée

Si $u$ est dérivable sur un intervalle $K$, alors

$$
(e^u)'=u'e^u.
$$

L’exponentielle étant strictement positive, le signe de $(e^u)'$ est exactement celui de $u'$.

### Fixation

$$
f(x)=e^{2\cos x}\quad\Longrightarrow\quad f'(x)=-2\sin x\,e^{2\cos x}.
$$

Pour $g(x)=e^{x^3-4x-1}$ :

$$
g'(x)=(3x^2-4)e^{x^3-4x-1}.
$$

## Produit d’une affine par $e^x$

Pour $f(x)=(ax+b)e^x$ :

$$
f'(x)=a e^x+(ax+b)e^x=(ax+a+b)e^x.
$$

Le facteur $e^x$ ne change jamais le signe : on étudie seulement l’affine $ax+a+b$.

### Étude officielle : $f(x)=(x-2)e^x$

$$
f'(x)=(x-1)e^x.
$$

La fonction décroît sur $]-\infty;1]$, puis croît sur $[1;+\infty[$. Son minimum vaut

$$
f(1)=-e.
$$

### Étude officielle : $f(x)=(-2x+3)e^x$ sur $]-\infty;2]$

$$
f'(x)=(-2x+1)e^x.
$$

La fonction croît jusqu’à $x=1/2$, puis décroît. Elle coupe les axes en

$$
A\left(\frac32;0\right),\qquad B(0;3),
$$

et admet $y=0$ comme asymptote horizontale en $-\infty$.

> **Correction de source.** Le corrigé de la dérivée de $e^{x^3-4x-1}$ imprime $(-3x^2-4)e^{x^3-4x-1}$. La dérivée de $x^3$ est $3x^2$ : le bon facteur est donc $3x^2-4$.`,
    keyPoint: String.raw`$(e^u)'=u'e^u\quad\text{et}\quad e^u>0.$`,
    example: String.raw`$[(1-x)e^x]'=-e^x+(1-x)e^x=-xe^x.$`,
    methodSteps: [
      "Repère la fonction intérieure u et calcule u’.",
      "Écris (e^u)’=u’e^u sans oublier le facteur intérieur.",
      "Pour un produit ou un quotient, applique la règle correspondante avant de factoriser par l’exponentielle.",
      "Pour les variations, retire mentalement le facteur exponentiel positif et étudie le facteur restant.",
      "Calcule les valeurs aux points critiques et aux bornes du domaine.",
    ],
    timeline: [
      { label: "Intérieur", detail: "Calcule d’abord u’." },
      { label: "Chaîne", detail: "Multiplie u’ par e^u." },
      { label: "Factoriser", detail: "Fais apparaître un facteur exponentiel positif." },
      { label: "Variations", detail: "Étudie uniquement le signe du facteur restant." },
    ],
    corrections: [
      "À la page 4, la dérivée de e^{x³−4x−1} est (3x²−4)e^{x³−4x−1}, et non (−3x²−4)e^{x³−4x−1}.",
      "Dans l’énoncé de l’exercice 21, la valeur de la limite en −∞ est déjà imprimée. Elle est traitée ici comme un résultat à démontrer, sans dévoilement préalable.",
    ],
    questions: [
      choice(String.raw`Dérive $e^{2\cos x}$.`, [String.raw`$-2\sin x\,e^{2\cos x}$`, String.raw`$2\cos x\,e^{2\cos x}$`, String.raw`$-2\sin x$`, String.raw`$e^{-2\sin x}$`], 0, String.raw`La dérivée de $2\cos x$ est $-2\sin x$.`, "Fixation • page 4", 2),
      choice("Dérive correctement $e^{x^3-4x-1}$.", ["$(3x^2-4)e^{x^3-4x-1}$", "$(-3x^2-4)e^{x^3-4x-1}$", "$(x^2-4)e^{x^3-4x-1}$", "$e^{3x^2-4}$"], 0, "$(x^3-4x-1)'=3x^2-4$.", "Fixation corrigée • page 4", 2),
      choice("Exercice 7-a : dérive $e^{-2x+1}$.", ["$-2e^{-2x+1}$", "$2e^{-2x+1}$", "$e^{-2x+1}$", "$(-2x+1)e^{-2x+1}$"], 0, "La dérivée de $-2x+1$ vaut $-2$.", "Exercice 7-a • page 8"),
      choice("Exercice 7-b : dérive $x+2-e^x$.", ["$1-e^x$", "$1+e^x$", "$-e^x$", "$x+1-e^x$"], 0, "La dérivée de $x+2$ vaut 1.", "Exercice 7-b • page 8"),
      choice("Exercice 7-c : dérive $(1-x)e^x$.", ["$-xe^x$", "$(2-x)e^x$", "$(1-x)e^x$", "$-e^x$"], 0, "La règle du produit donne $-e^x+(1-x)e^x$.", "Exercice 7-c • page 8", 2),
      choice("Exercice 8-f : dérive $(-2x+5)e^x$.", ["$(3-2x)e^x$", "$(-2x+5)e^x$", "$(-2x+3)e^x$", "$-2e^x$"], 0, "$-2+(-2x+5)=3-2x$.", "Exercice 8 • page 8"),
      choice("Exercice 8-g : dérive $(-3x^2+5)e^x$.", ["$(-3x^2-6x+5)e^x$", "$(-6x+5)e^x$", "$(3x^2-6x+5)e^x$", "$(-3x^2+5)e^x$"], 0, "On additionne la dérivée du polynôme au polynôme lui-même.", "Exercice 8 • page 8", 2),
      choice(String.raw`Exercice 8-h : dérive $\dfrac{e^x-1}{x+1}$.`, [String.raw`$\dfrac{xe^x+1}{(x+1)^2}$`, String.raw`$\dfrac{e^x}{x+1}$`, String.raw`$\dfrac{xe^x-1}{(x+1)^2}$`, String.raw`$\dfrac{e^x-x}{(x+1)^2}$`], 0, "Le numérateur après quotient est $e^x(x+1)-(e^x-1)=xe^x+1$.", "Exercice 8 • page 8", 3),
      choice(String.raw`Exercice 8-k : dérive $\dfrac{e^x+2}{e^{x-1}}$.`, ["$-2e^{1-x}$", "$2e^{1-x}$", "$e^{x-1}$", "$-2e^{x-1}$"], 0, "La fonction se simplifie en $e+2e^{1-x}$.", "Exercice 8 • page 8", 3),
      choice("Exercice 17-f : dérive $xe^{2x}-1$.", ["$(2x+1)e^{2x}$", "$2xe^{2x}$", "$(x+1)e^{2x}$", "$e^{2x}-1$"], 0, "Règle du produit.", "Exercice 17 • page 9", 2),
      choice("Où $f(x)=xe^{2x}-1$ atteint-elle son minimum ?", ["$x=-1/2$", "$x=0$", "$x=1/2$", "$x=-1$"], 0, "Le signe de $(2x+1)e^{2x}$ change en $-1/2$.", "Exercice 17 • page 9", 2),
      choice("Quel est le sens de variation de $g(x)=x-1+e^x$ ?", [String.raw`Strictement croissante sur $\mathbb R$`, "Strictement décroissante", "Décroissante puis croissante", "Constante"], 0, "$g'(x)=1+e^x>0$.", "Exercice 17 • page 9", 2),
      choice("Exercice 19 : dérive $(x-2)e^x$.", ["$(x-1)e^x$", "$(x-2)e^x$", "$(x-3)e^x$", "$e^x$"], 0, "$1+(x-2)=x-1$.", "Exercice 19 • page 9"),
      short("À quelle abscisse $(x-2)e^x$ atteint-elle son minimum ?", ["1", "x=1"], "La dérivée s’annule en 1.", "Exercice 19 • page 9"),
      short("Quelle est la valeur minimale de $(x-2)e^x$ ?", ["-e", "−e"], "$f(1)=-e$.", "Exercice 19 • page 9", 2),
      short(String.raw`Exercice 21 : calcule $\lim_{x\to-\infty}(-2x+3)e^x$.`, ["0", "+0"], "$xe^x$ et $e^x$ tendent vers zéro.", "Exercice 21.1 • pages 10 et 13"),
      choice(String.raw`Exercice 21 : sur $]-\infty;2]$, $(-2x+3)e^x$ est :`, ["Croissante jusqu’à $1/2$, puis décroissante", "Décroissante partout", "Croissante partout", "Décroissante puis croissante"], 0, "Le signe de $(1-2x)e^x$ est celui de $1-2x$.", "Exercice 21.2 • pages 10, 13-14", 2),
      choice("Exercice 21 : quels sont les points d’intersection avec les axes ?", ["$A(3/2;0)$ et $B(0;3)$", "$A(2;0)$ et $B(0;1)$", "$A(1/2;0)$ et $B(0;3)$", "$A(3;0)$ et $B(0;2)$"], 0, "On résout $-2x+3=0$ et on calcule $f(0)$.", "Exercice 21.3 • pages 10 et 14", 2),
      short(String.raw`Exercice 22 : calcule la limite de $(2-x)e^x$ en $+\infty$.`, ["-∞", "-infini"], "$-xe^x$ domine.", "Exercice 22-a • page 10"),
      choice(String.raw`Exercice 22 : variations de $(2-x)e^x$ sur $[0;+\infty[$.`, ["Croissante sur $[0;1]$, puis décroissante", "Décroissante partout", "Croissante partout", "Décroissante puis croissante"], 0, "$f'(x)=(1-x)e^x$.", "Exercice 22-b-d • page 10", 2),
      short("Exercice 22 : quelle est l’unique solution de $(2-x)e^x=0$ ?", ["2", "x=2", "{2}"], "$e^x>0$, donc $2-x=0$.", "Exercice 22-f • page 10"),
    ],
  },
  {
    id: "exp-primitives",
    title: "Primitives faisant intervenir l’exponentielle",
    summary: "Reconnaître $u'e^u$, ajuster un coefficient et traiter les primitives polynôme-exponentielle.",
    pages: "4-5, 8 et 10-13",
    section: "I-3-b. Primitives • Exercices 9, 10, 20 et parties C des exercices 24-25",
    durationMinutes: 65,
    body: String.raw`## Forme de référence

Si $u$ est dérivable sur un intervalle $K$, alors

$$
u'e^u
$$

admet pour primitives

$$
e^u+C,
\qquad C\in\mathbb R.
$$

Lorsqu’un coefficient manque, on le fait apparaître :

$$
\sin(2x)e^{\cos(2x)}
=-\frac12\big(-2\sin(2x)e^{\cos(2x)}\big),
$$

d’où

$$
F(x)=-\frac12e^{\cos(2x)}+C.
$$

De même :

$$
xe^{x^2}=\frac12(2x)e^{x^2}
\quad\Longrightarrow\quad
F(x)=\frac12e^{x^2}+C.
$$

## Exercices 9 et 10

| Fonction | Une primitive |
|---|---|
| $e^{-4x}+2x$ | $-\frac14e^{-4x}+x^2$ |
| $2xe^{x^2}$ | $e^{x^2}$ |
| $\dfrac{e^{2x}}{1+e^{2x}}$ | $\frac12\ln(1+e^{2x})$ |
| $x-5+3e^{-2x+1}$ | $\frac{x^2}{2}-5x-\frac32e^{-2x+1}$ |
| $3x^2e^{x^3}$ | $e^{x^3}$ |
| $e^x+1$ | $e^x+x$ |
| $2xe^{x^2-1}$ | $e^{x^2-1}$ |

## Primitive de $(x^2-4)e^{2x}$

On cherche

$$
F(x)=(\alpha x^2+\beta x+\gamma)e^{2x}.
$$

Après dérivation et identification :

$$
\alpha=\frac12,\qquad \beta=-\frac12,\qquad \gamma=-\frac74.
$$

La primitive qui s’annule en $0$ est donc

$$
F(x)=\left(\frac12x^2-\frac12x-\frac74\right)e^{2x}+\frac74.
$$

> **Astuce mémoire de Davy.** Pour vérifier une primitive, ne fais pas confiance à sa forme : dérive-la. En dix secondes, tu confirmes le coefficient et le signe.` ,
    keyPoint: String.raw`$\int u'e^u\,dx=e^u+C.$`,
    example: String.raw`$\int xe^{x^2}\,dx=\frac12e^{x^2}+C.$`,
    methodSteps: [
      "Choisis la fonction intérieure u dans l’exposant.",
      "Calcule u’ et compare-la au facteur placé devant l’exponentielle.",
      "Ajuste par une constante si nécessaire.",
      "Pour un polynôme multiplié par une exponentielle, propose un polynôme de même degré et identifie les coefficients.",
      "Détermine la constante avec la condition initiale, puis dérive pour vérifier.",
    ],
    timeline: [
      { label: "Intérieur u", detail: "Lis l’exposant." },
      { label: "Facteur u’", detail: "Cherche sa dérivée devant e^u." },
      { label: "Ajuster", detail: "Compense le coefficient manquant." },
      { label: "Vérifier", detail: "Dérive la primitive trouvée." },
    ],
    questions: [
      choice("Une primitive de $e^x$ est :", ["$e^x$", "$xe^x$", "$e^{x+1}$", String.raw`$\ln(e^x)$`], 0, "La dérivée de $e^x$ est $e^x$.", "Fixation a • page 4"),
      choice(String.raw`Une primitive de $\sin(2x)e^{\cos(2x)}$ est :`, [String.raw`$-\frac12e^{\cos(2x)}$`, String.raw`$\frac12e^{\cos(2x)}$`, String.raw`$e^{\sin(2x)}$`, String.raw`$-2e^{\cos(2x)}$`], 0, String.raw`$(\cos2x)'=-2\sin2x$.`, "Fixation b • pages 4-5", 2),
      choice("Une primitive de $xe^{x^2}$ est :", [String.raw`$\frac12e^{x^2}$`, "$e^{x^2}$", "$x^2e^{x^2}$", "$2e^{x^2}$"], 0, "$(x^2)'=2x$.", "Fixation c • pages 4-5", 2),
      choice("Exercice 9-a : une primitive de $e^{-4x}+2x$ est :", [String.raw`$-\frac14e^{-4x}+x^2$`, "$4e^{-4x}+x^2$", "$-4e^{-4x}+2x$", "$e^{-4x}+x^2$"], 0, "La dérivée de $-4x$ vaut $-4$.", "Exercice 9-a • page 8", 2),
      choice("Exercice 9-b : une primitive de $2xe^{x^2}$ est :", ["$e^{x^2}$", "$2e^{x^2}$", "$xe^{x^2}$", "$e^{2x}$"], 0, "C’est exactement la forme $u'e^u$.", "Exercice 9-b • page 8"),
      choice(String.raw`Exercice 9-c : une primitive de $\dfrac{e^{2x}}{1+e^{2x}}$ est :`, [String.raw`$\frac12\ln(1+e^{2x})$`, String.raw`$\ln(e^{2x})$`, "$e^{2x}/2$", String.raw`$\ln(1+e^x)$`], 0, "La dérivée du dénominateur intérieur vaut $2e^{2x}$.", "Exercice 9-c • page 8", 3),
      choice("Exercice 9-d : une primitive de $x-5+3e^{-2x+1}$ est :", [String.raw`$\frac{x^2}{2}-5x-\frac32e^{-2x+1}$`, "$x^2-5-6e^{-2x+1}$", String.raw`$\frac{x^2}{2}-5x+\frac32e^{-2x+1}$`, "$x-5+e^{-2x+1}$"], 0, "Le coefficient de $e^{-2x+1}$ doit être $-3/2$.", "Exercice 9-d • page 8", 3),
      short("Exercice 10-f : donne une primitive de $3x^2e^{x^3}$ sans la constante.", ["e^(x^3)", "e^{x^3}", "exp(x^3)"], "La dérivée de $x^3$ est $3x^2$.", "Exercice 10 • pages 8 et 13"),
      choice("Exercice 10-g : une primitive de $e^x+1$ est :", ["$e^x+x$", "$e^x+1$", "$xe^x$", "$e^{x+1}$"], 0, "On primitive terme à terme.", "Exercice 10 • pages 8 et 13"),
      short("Exercice 10-h : donne une primitive de $2xe^{x^2-1}$ sans la constante.", ["e^(x^2-1)", "e^{x^2-1}", "exp(x^2-1)"], "La dérivée de $x^2-1$ est $2x$.", "Exercice 10 • pages 8 et 13"),
      choice(String.raw`Exercice 20 : quelle est la valeur de $\alpha$ ?`, ["$1/2$", "$-1/2$", "$1$", "$2$"], 0, String.raw`L’identification du coefficient de $x^2$ donne $2\alpha=1$.`, "Exercice 20 • pages 10 et 13", 2),
      choice(String.raw`Exercice 20 : quelles sont les valeurs de $(\beta;\gamma)$ ?`, ["$(-1/2;-7/4)$", "$(1/2;7/4)$", "$(-1;-4)$", "$(0;-2)$"], 0, "On identifie successivement les coefficients de x et la constante.", "Exercice 20 • pages 10 et 13", 2),
      choice("Exercice 20 : quelle constante faut-il ajouter pour que la primitive s’annule en 0 ?", ["$7/4$", "$-7/4$", "$1/2$", "$0$"], 0, "La partie polynôme-exponentielle vaut $-7/4$ en zéro.", "Exercice 20 • page 13", 2),
      choice("Exercice 24-C : pour $f(x)=e^{-x}(x+e^{-x})$, quels coefficients rendent $e^{-x}(ax+b+ce^{-x})$ primitive de f ?", ["$a=-1,b=-1,c=-1/2$", "$a=1,b=1,c=1/2$", "$a=-1,b=0,c=-1$", "$a=1,b=-1,c=1/2$"], 0, "Après dérivation : $-a=1$, $a-b=0$, $-2c=1$.", "Exercice 24-C • page 11", 3),
      choice("Exercice 25-C : quelle fonction est déjà une primitive de $f(x)=(2-x)e^x+2-x$ ?", ["$g(x)=(3-x)e^x+2x-x^2/2$", "$g(x)=(2-x)e^x+x^2$", "$g(x)=(3+x)e^x-2x$", "$g(x)=e^x+2-x$"], 0, "Sa dérivée vaut $(2-x)e^x+2-x$.", "Exercice 25-C • page 12", 2),
      choice("Pour obtenir la primitive de l’exercice 25 qui vaut $3/2$ en 0, il faut écrire :", ["$F=g-3/2$", "$F=g+3/2$", "$F=g-3$", "$F=g$"], 0, "$g(0)=3$, donc $g(0)-3/2=3/2$.", "Exercice 25-C • page 12", 2),
    ],
  },
  {
    id: "real-powers",
    title: "Exponentielles de base a et puissances réelles",
    summary: String.raw`Définir $a^x$ et $x^\alpha$ avec l’exponentielle, puis lire dérivée, variation et limites.`,
    pages: "5-6",
    section: "II-1. Exponentielle de base a • II-2. Puissances d’exposant réel",
    durationMinutes: 48,
    body: String.raw`## Exponentielle de base $a$

Pour $a>0$, on définit sur $\mathbb R$ :

$$
a^x=e^{x\ln a}.
$$

Donc $a^x>0$ pour tout réel $x$. Deux cas particuliers :

- $1^x=1$ : la fonction est constante ;
- $e^x$ redonne l’exponentielle népérienne.

Par exemple :

$$
5^x=e^{x\ln5},
\qquad
12^x=e^{x\ln12}.
$$

## Dérivée et variation

Pour $a>0$ et $a\neq1$ :

$$
(a^x)'=\ln(a)a^x.
$$

| Base | Signe de $\ln a$ | Variation | Limite en $+\infty$ | Limite en $-\infty$ |
|---|---:|---|---:|---:|
| $0<a<1$ | négatif | strictement décroissante | $0$ | $+\infty$ |
| $a>1$ | positif | strictement croissante | $+\infty$ | $0$ |

## Fonction puissance d’exposant réel

Pour $\alpha\neq0$, on définit sur $]0;+\infty[$ :

$$
x^\alpha=e^{\alpha\ln x}.
$$

Le domaine $x>0$ est essentiel lorsque $\alpha$ est un réel quelconque. Les règles usuelles des puissances rationnelles restent valables sur ce domaine.

> **Astuce mémoire de Davy.** Pour connaître la variation de $a^x$, demande-toi seulement où se trouve la base par rapport à 1 : au-dessus de 1, ça monte ; entre 0 et 1, ça descend.` ,
    keyPoint: String.raw`$a^x=e^{x\ln a},\qquad (a^x)'=\ln(a)a^x.$`,
    example: String.raw`$\left(\frac12\right)^x=e^{x\ln(1/2)}\text{ décroît car }\ln(1/2)<0.$`,
    methodSteps: [
      "Vérifie que la base a est strictement positive.",
      "Réécris a^x sous la forme e^{x ln a} si une dérivée ou une limite est demandée.",
      "Compare a à 1 pour connaître le signe de ln a et le sens de variation.",
      "Pour x^α avec α réel, impose x>0 avant tout calcul.",
    ],
    timeline: [
      { label: "Base positive", detail: "La définition réelle exige a>0." },
      { label: "Passage à e", detail: "a^x = e^(x ln a)." },
      { label: "Comparer à 1", detail: "Le signe de ln a fixe la variation." },
      { label: "Puissance réelle", detail: "x^α est définie par e^(α ln x) pour x > 0." },
    ],
    curve: halfPowerCurve,
    questions: [
      choice("Pour $a>0$, comment définit-on $a^x$ ?", [String.raw`$e^{x\ln a}$`, String.raw`$e^{a\ln x}$`, String.raw`$x^{\ln a}$`, String.raw`$\ln(e^{ax})$`], 0, "C’est la définition d’une exponentielle de base a.", "Cours • page 5"),
      choice("Quelle affirmation est vraie pour tout $a>0$ et tout réel x ?", ["$a^x>0$", "$a^x<0$", "$a^x=0$", String.raw`$a^x\geq1$`], 0, "$a^x$ est une exponentielle.", "Cours • page 5"),
      choice("Réécris $5^x$ avec la base e.", [String.raw`$e^{x\ln5}$`, String.raw`$e^{5\ln x}$`, "$5e^x$", "$e^{x+5}$"], 0, "On applique directement la définition.", "Fixation • page 5"),
      choice("Quelle est la dérivée de $a^x$ ?", [String.raw`$\ln(a)a^x$`, "$xa^{x-1}$", "$a^x$", String.raw`$a\ln x$`], 0, String.raw`On dérive $e^{x\ln a}$.`, "Cours • page 5"),
      choice(String.raw`Si $0<a<1$, la fonction $x\mapsto a^x$ est :`, ["Strictement décroissante", "Strictement croissante", "Constante", "Non définie"], 0, String.raw`$\ln a<0$.`, "Cours • page 5"),
      choice(String.raw`Si $a>1$, $\lim_{x\to-\infty}a^x$ vaut :`, ["$0$", "$1$", String.raw`$+\infty$`, String.raw`$-\infty$`], 0, "C’est la limite de référence d’une base supérieure à 1.", "Cours • page 5"),
      choice(String.raw`Si $0<a<1$, $\lim_{x\to-\infty}a^x$ vaut :`, [String.raw`$+\infty$`, "$0$", "$1$", String.raw`$-\infty$`], 0, "Le sens des limites est inversé.", "Cours • page 5"),
      choice(String.raw`Sur quel intervalle le cours définit-il $x^\alpha$ pour un réel $\alpha\neq0$ ?`, [String.raw`$]0;+\infty[$`, String.raw`$\mathbb R$`, String.raw`$[0;+\infty[$`, String.raw`$\mathbb R\setminus\{0\}$`], 0, String.raw`La définition utilise $\ln x$.`, "Cours • page 6"),
      choice(String.raw`Quelle définition correspond à $x^\alpha$ ?`, [String.raw`$e^{\alpha\ln x}$`, String.raw`$e^{x\ln\alpha}$`, String.raw`$\alpha^{\ln x}$`, String.raw`$\ln(e^{\alpha x})$`], 0, "C’est la définition des puissances réelles.", "Cours • page 6"),
      short("Calcule $1^x$ pour n’importe quel réel x.", ["1", "+1"], "La base 1 donne la fonction constante 1.", "Remarque • page 5"),
      choice("La courbe de $(1/2)^x$ est :", ["Décroissante et strictement positive", "Croissante et positive", "Décroissante et négative", "Constante"], 0, "$0<1/2<1$.", "Interprétation du cours • pages 5-6", 2),
      choice(String.raw`Pourquoi peut-on dériver $x^\alpha=e^{\alpha\ln x}$ seulement pour $x>0$ dans ce cadre ?`, [String.raw`Parce que $\ln x$ exige $x>0$`, "Parce que $e^x$ exige $x>0$", String.raw`Parce que $\alpha>1$`, "Parce que la dérivée est nulle ailleurs"], 0, "La restriction vient du logarithme.", "Cours • page 6", 2),
    ],
  },
  {
    id: "power-equations",
    title: "Équations et inéquations avec une base quelconque",
    summary: "Comparer des puissances de même base et inverser le sens lorsque la base appartient à $]0;1[$.",
    pages: "5-6 et 12",
    section: "II-1-b. Conséquences • Fixation • Exercice 28",
    durationMinutes: 44,
    body: String.raw`## Même base, mêmes exposants

Pour $a>0$ et $a\neq1$ :

$$
a^u=a^v\iff u=v.
$$

Pour les inégalités, le sens dépend de la base :

$$
a>1\implies a^u<a^v\iff u<v,
$$

$$
0<a<1\implies a^u<a^v\iff u>v.
$$

## Fixation 1

$$
2^{x-9}=8^{3x+1}=2^{3(3x+1)}.
$$

On identifie les exposants :

$$
x-9=9x+3\iff x=-\frac32.
$$

## Fixation 2

Comme $0<0{,}7<1$, la fonction $x\mapsto(0{,}7)^x$ est décroissante :

$$
(0{,}7)^{-x}<(0{,}7)^{-5x+1}
\iff -x>-5x+1
\iff x>\frac14.
$$

## Pouvoir d’achat : exercice 28

On cherche le premier nombre entier d’années $t$ tel que

$$
0{,}95^t\leq\frac12.
$$

En appliquant le logarithme :

$$
t\ln(0{,}95)\leq\ln(0{,}5).
$$

Comme $\ln(0{,}95)<0$, la division **inverse le sens** :

$$
t\geq\frac{\ln(0{,}5)}{\ln(0{,}95)}\approx13{,}51.
$$

Le pouvoir d’achat devient au plus égal à la moitié après **14 années entières**.

> **Astuce mémoire de Davy.** Une base entre 0 et 1 agit comme un miroir : plus l’exposant augmente, plus la puissance diminue, et les inégalités s’inversent.` ,
    keyPoint: String.raw`$0<a<1\implies a^u<a^v\iff u>v.$`,
    example: String.raw`$(0{,}7)^{-x}<(0{,}7)^{-5x+1}\iff x>\frac14.$`,
    methodSteps: [
      "Vérifie que les deux membres ont la même base ou transforme-les pour l’obtenir.",
      "Compare la base à 1.",
      "Identifie les exposants ; inverse le sens de l’inégalité si 0<a<1.",
      "Si les bases ne se ramènent pas l’une à l’autre, applique le logarithme.",
      "Pour une durée, arrondis au premier entier qui satisfait réellement la condition.",
    ],
    timeline: [
      { label: "Même base", detail: "Réécris 8 comme 2³ par exemple." },
      { label: "Position de a", detail: "Base au-dessus ou en dessous de 1 ?" },
      { label: "Comparer", detail: "Conserve ou inverse le sens." },
      { label: "Durée entière", detail: "Teste l’entier suivant après le calcul logarithmique." },
    ],
    questions: [
      choice("Pour $a>1$, $a^u<a^v$ équivaut à :", ["$u<v$", "$u>v$", "$u=v$", "$uv<0$"], 0, "La fonction de base a>1 est croissante.", "Cours • page 5"),
      choice("Pour $0<a<1$, $a^u<a^v$ équivaut à :", ["$u>v$", "$u<v$", "$u=v$", "$u+v<0$"], 0, "La fonction de base comprise entre 0 et 1 est décroissante.", "Cours • page 5"),
      short("Résous $2^{x-9}=8^{3x+1}$.", ["-3/2", "-1,5", "-1.5", "x=-3/2"], "$8^{3x+1}=2^{9x+3}$, donc $x-9=9x+3$.", "Fixation 1 • page 6", 2),
      choice("Résous $(0{,}7)^{-x}<(0{,}7)^{-5x+1}$.", ["$x>1/4$", "$x<1/4$", "$x>4$", "$x<4$"], 0, "La base 0,7 est inférieure à 1, donc le sens s’inverse.", "Fixation 2 • page 6", 2),
      choice("Exercice 28 : quelle équation réelle repère le moment où le pouvoir d’achat vaut exactement la moitié ?", ["$0{,}95^t=0{,}5$", "$0{,}5^t=0{,}95$", "$0{,}95t=0{,}5$", "$t^{0{,}95}=0{,}5$"], 0, "On égalise directement $A(t)$ à $1/2$.", "Exercice 28 • page 12"),
      choice("Exercice 28 : quelle valeur réelle obtient-on ?", [String.raw`$t=\ln(0{,}5)/\ln(0{,}95)\approx13{,}51$`, String.raw`$t\approx0{,}51$`, String.raw`$t\approx6{,}5$`, String.raw`$t=\ln(0{,}95)/\ln(0{,}5)$`], 0, "On prend le logarithme des deux membres.", "Exercice 28 • page 12", 2),
      short("Exercice 28 : après combien d’années entières le pouvoir d’achat est-il au plus égal à la moitié ?", ["14", "14 ans", "14 années"], "Le premier entier supérieur à 13,51 est 14.", "Exercice 28 • page 12", 2),
      choice(String.raw`Pourquoi le sens s’inverse-t-il après division par $\ln(0{,}95)$ ?`, [String.raw`Parce que $\ln(0{,}95)<0$`, String.raw`Parce que $\ln(0{,}95)>0$`, "Parce que t est entier", "Parce que 0,95 est proche de 1"], 0, "Une division par un nombre négatif inverse une inégalité.", "Méthode de l’exercice 28 • page 12", 2),
    ],
  },
  {
    id: "growth-comparison",
    title: "Croissances comparées et missions de synthèse",
    summary: "Comparer logarithme, puissances et exponentielle, puis résoudre les études et situations complexes du document.",
    pages: "6-7 et 10-14",
    section: "II-3. Croissances comparées • Exercices 23 à 27",
    durationMinutes: 86,
    kind: "challenge",
    body: String.raw`## Hiérarchie des croissances

Pour $\alpha>0$ :

$$
\lim_{x\to+\infty}\frac{\ln x}{x^\alpha}=0,
\qquad
\lim_{x\to0^+}x^\alpha\ln x=0,
$$

$$
\lim_{x\to+\infty}\frac{e^x}{x^\alpha}=+\infty,
\qquad
\lim_{x\to+\infty}x^\alpha e^{-x}=0.
$$

On résume :

$$
\ln x\ll x^\alpha\ll e^x
\qquad(x\to+\infty).
$$

## Étude de $f(x)=1-x+e^x$ — exercice 23

En $-\infty$, $e^x\to0$, donc $f(x)-(-x+1)=e^x\to0$. La droite

$$
\Delta:y=-x+1
$$

est asymptote oblique, et la courbe reste au-dessus car $e^x>0$.

$$
f'(x)=e^x-1.
$$

La fonction décroît sur $]-\infty;0]$, croît sur $[0;+\infty[$ et atteint son minimum $f(0)=2$.

## Étude de l’exercice 24

Pour $g(x)=1-x-2e^{-x}$ :

$$
g'(x)=-1+2e^{-x}.
$$

Le maximum est atteint en $x=\ln2$ et vaut

$$
g(\ln2)=-\ln2<0.
$$

Ainsi $g(x)<0$ pour tout réel. Pour

$$
f(x)=e^{-x}(x+e^{-x}),
$$

on a $f'(x)=e^{-x}g(x)<0$ : $f$ est strictement décroissante de $+\infty$ vers $0$, donc bijective de $\mathbb R$ sur $]0;+\infty[$. En outre $f(0)=1$ et

$$
(f^{-1})'(1)=\frac1{f'(0)}=-1.
$$

## Étude de l’exercice 25

Pour $f(x)=(2-x)e^x+2-x$, on utilise

$$
h(x)=(1-x)e^x-1=f'(x).
$$

La fonction $h$ atteint son maximum $0$ en $x=0$ et reste négative ailleurs : $f$ est strictement décroissante. La droite $y=2-x$ est asymptote en $-\infty$. La tangente parallèle à cette droite est obtenue en $x=1$, au point

$$
K(1;e+1).
$$

La courbe coupe les axes en $A(2;0)$ et $B(0;4)$.

## Mission publicitaire — exercice 26

Le seuil de $90\%$ impose

$$
1-e^{-0{,}21t}\geq0{,}9
\iff
t\geq\frac{\ln(0{,}1)}{-0{,}21}\approx10{,}96.
$$

Il faut **11 jours** : l’affirmation « une semaine suffit » est fausse.

## Mission démographique — exercice 27

$$
10200e^{0{,}5n}>20000
\iff
n>\frac{\ln(20000/10200)}{0{,}5}\approx1{,}35.
$$

Le premier nombre entier d’années convenable est donc **2 ans**.

> **Correction de source.** L’énoncé de l’exercice 24 imprime un facteur $e^{-x}$ supplémentaire après $e^{-x}(x+e^{-x})$. La ligne suivante impose sans ambiguïté $f(x)=e^{-2x}(xe^x+1)=e^{-x}(x+e^{-x})$ : c’est cette expression cohérente qui est utilisée.` ,
    keyPoint: String.raw`$\ln x\ll x^\alpha\ll e^x\quad(x\to+\infty,\ \alpha>0).$`,
    example: String.raw`$\lim_{x\to+\infty}x^8e^{-x}=0.$`,
    methodSteps: [
      "Réécris l’expression pour faire apparaître une limite de croissance comparée.",
      "Dans une étude complète, suis l’ordre : domaine, limites, asymptotes, dérivée, signe, variations, points remarquables.",
      "Pour une situation concrète, traduis le seuil par une équation ou une inéquation.",
      "Isole l’exponentielle, applique ln et contrôle le sens de l’inégalité.",
      "Transforme la valeur réelle obtenue en durée entière et formule une conclusion dans le contexte.",
    ],
    timeline: [
      { label: "Comparer", detail: "ln est dominé par les puissances, elles-mêmes dominées par exp." },
      { label: "Étudier", detail: "Limites, asymptotes, dérivée, variations et points." },
      { label: "Modéliser", detail: "Traduis le pourcentage ou la population par une inéquation." },
      { label: "Conclure", detail: "Arrondis au premier entier qui satisfait le seuil." },
    ],
    curve: advertisingCurve,
    corrections: [
      "Dans l’exercice 24 page 11, un facteur e^{-x} est dupliqué après la définition de f. L’identité demandée juste après confirme que la fonction cohérente est f(x)=e^{-x}(x+e^{-x}).",
      "La situation publicitaire apparaît d’abord comme situation complexe aux pages 6-7 puis comme exercice 26 dans le corrigé page 14. Elle est regroupée ici en une seule mission complète, sans duplication artificielle.",
    ],
    questions: [
      short(String.raw`Calcule $\lim_{x\to+\infty}\dfrac{\ln x}{x^5}$.`, ["0", "+0"], "Toute puissance positive domine le logarithme.", "Fixation 1 • page 6"),
      short(String.raw`Calcule $\lim_{x\to0^+}x^2\ln x$.`, ["0", "-0", "+0"], "C’est une croissance comparée au voisinage de zéro.", "Fixation 2 • page 6"),
      short(String.raw`Calcule $\lim_{x\to+\infty}\dfrac{e^x}{x^3}$.`, ["+∞", "∞", "+infini", "infini"], "L’exponentielle domine toute puissance positive.", "Fixation 3 • page 6"),
      short(String.raw`Calcule $\lim_{x\to+\infty}x^8e^{-x}$.`, ["0", "+0"], String.raw`$x^8/e^x\to0$.`, "Fixation 4 • page 6"),
      choice(String.raw`Exercice 23 : quelle est l’asymptote de $f(x)=1-x+e^x$ en $-\infty$ ?`, ["$y=-x+1$", "$y=0$", "$x=1$", "$y=x+1$"], 0, String.raw`$f(x)-(-x+1)=e^x\to0$.`, "Exercice 23.4 • pages 10-11", 2),
      choice("Exercice 23 : où la courbe est-elle placée par rapport à cette asymptote ?", ["Toujours au-dessus", "Toujours au-dessous", "Elle la coupe en 0", "Cela dépend de x"], 0, "La différence est $e^x>0$.", "Exercice 23.4-b • page 11", 2),
      choice("Exercice 23 : quelles sont les variations de $1-x+e^x$ ?", ["Décroissante jusqu’à 0, puis croissante", "Croissante partout", "Décroissante partout", "Croissante puis décroissante"], 0, "$f'(x)=e^x-1$ change de signe en zéro.", "Exercice 23.5 • page 11", 2),
      short(String.raw`Exercice 24-A : calcule $g(\ln2)$ pour $g(x)=1-x-2e^{-x}$.`, ["-ln2", "−ln2", "-ln(2)"], String.raw`$e^{-\ln2}=1/2$, donc $g(\ln2)=-\ln2$.`, "Exercice 24-A • page 11", 2),
      choice("Quel est le signe de $g$ dans l’exercice 24 ?", ["$g(x)<0$ pour tout réel x", "$g(x)>0$", "$g$ change de signe en ln2", "$g(x)=0$"], 0, String.raw`Son maximum est $-\ln2<0$.`, "Exercice 24-A • page 11", 2),
      choice("Exercice 24-B : quel est le sens de variation de $f(x)=e^{-x}(x+e^{-x})$ ?", ["Strictement décroissante", "Strictement croissante", "Constante", "Croissante puis décroissante"], 0, "$f'(x)=e^{-x}g(x)<0$.", "Exercice 24-B • page 11", 2),
      short("Exercice 24-B : calcule $(f^{-1})'(1)$.", ["-1", "−1"], "$f(0)=1$ et $f'(0)=-1$.", "Exercice 24-B • page 11", 3),
      choice(String.raw`Exercice 25 : quelle est l’asymptote de $f(x)=(2-x)e^x+2-x$ en $-\infty$ ?`, ["$y=2-x$", "$y=0$", "$y=x-2$", "$x=2$"], 0, String.raw`$f(x)-(2-x)=(2-x)e^x\to0$.`, "Exercice 25-B • page 12", 2),
      choice("Exercice 25 : donne le point où la tangente est parallèle à $y=2-x$.", ["$K(1;e+1)$", "$K(0;4)$", "$K(2;0)$", "$K(1;e)$"], 0, "La pente -1 impose $(1-x)e^x=0$, donc x=1.", "Exercice 25-B • page 12", 3),
      choice("Exercice 25 : quels sont les points d’intersection avec les axes ?", ["$A(2;0)$ et $B(0;4)$", "$A(1;0)$ et $B(0;2)$", "$A(0;4)$ et $B(2;0)$", "$A(2;0)$ et $B(0;2)$"], 0, "On calcule $f(2)=0$ et $f(0)=4$.", "Exercice 25-B • page 12", 2),
      choice("Mission publicitaire : quelle inéquation traduit « au moins 90 % » ?", [String.raw`$1-e^{-0{,}21t}\geq0{,}9$`, String.raw`$e^{-0{,}21t}\geq0{,}9$`, String.raw`$1-e^{-0{,}21t}\leq0{,}1$`, String.raw`$0{,}21t\geq0{,}9$`], 0, "On compare directement P(t) à 0,9.", "Situation complexe / exercice 26 • pages 6-7 et 14"),
      short("Combien de jours entiers faut-il pour atteindre 90 % ?", ["11", "11 jours"], String.raw`$\ln(0,1)/(-0,21)\approx10,96$.`, "Situation complexe / exercice 26 • pages 6-7 et 14", 2),
      choice("L’affirmation « la publicité n’excédera pas une semaine » est :", ["Fausse", "Vraie"], 0, "Il faut 11 jours, donc plus de 7.", "Situation complexe / exercice 26 • pages 6-7 et 14"),
      choice("Exercice 27 : quelle inéquation traduit le dépassement de 20 000 habitants ?", ["$10200e^{0{,}5n}>20000$", "$10200e^{0{,}5n}<20000$", "$10200+0{,}5n>20000$", "$e^{10200n}>20000$"], 0, "On compare le modèle de population au seuil demandé.", "Exercice 27 • page 12"),
      choice("Exercice 27 : quelle borne réelle obtient-on pour n ?", [String.raw`$n>\ln(20000/10200)/0{,}5\approx1{,}35$`, "$n>0{,}5$", "$n>20/10{,}2$", String.raw`$n>\ln(10200)/20000$`], 0, "On divise après avoir appliqué le logarithme.", "Exercice 27 • page 12", 2),
      short("Après combien d’années entières la population dépasse-t-elle 20 000 habitants ?", ["2", "2 ans", "2 années"], "Le premier entier strictement supérieur à environ 1,35 est 2.", "Exercice 27 • page 12", 2),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCExponentialPowerPath: LearningPath = {
  id: "terminale-c-math-l10-exponential-power",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 10,
  title: "Fonction exponentielle et fonction puissance",
  description: "Exponentielle népérienne, équations, limites, dérivation, primitives, bases quelconques, puissances réelles, croissances comparées et missions de synthèse.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer avec l’exponentielle et utiliser sa réciprocité avec le logarithme",
    "Résoudre des équations et inéquations exponentielles",
    "Maîtriser les limites, les dérivées et les primitives exponentielles",
    "Étudier les exponentielles de base a et les puissances réelles",
    "Comparer les croissances de ln, des puissances et de l’exponentielle",
    "Résoudre les études complètes et les situations complexes du document officiel",
  ],
  modules: [
    {
      id: "terminale-c-math-l10-exponential-power-mastery",
      title: "Maîtriser les fonctions exponentielles et puissances",
      description: "Du lien avec le logarithme aux missions de modélisation, avec les 28 exercices officiels répartis dans huit niveaux progressifs.",
      lessons: builtLevels,
    },
  ],
};
