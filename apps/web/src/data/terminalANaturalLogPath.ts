import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 03 fonction logarithme neperien.pdf";

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
    id: "log-definition-properties",
    title: "Définition et domaine du logarithme népérien",
    summary: "Définir ln, connaître son domaine, sa dérivée et sa valeur en 1.",
    pages: "1-2",
    section: "I-1. Définition et notation",
    durationMinutes: 15,
    xp: 50,
    body: String.raw`## Définition

La fonction **logarithme népérien**, notée $\ln$, est la fonction dont la dérivée sur $]0;+\infty[$ est la fonction $x\mapsto\dfrac1x$ et qui s'annule en $1$.

## Conséquences de la définition

- L'ensemble de définition de la fonction $x\mapsto\ln(x)$ est $]0;+\infty[$.
- $\ln(1)=0$ : l'image de $1$ par la fonction $\ln$ est $0$.
- La fonction $\ln$ est dérivable sur $]0;+\infty[$ et, pour tout $x>0$ : $$(\ln x)'=\frac1x$$

### Exercice de fixation entièrement rédigé

| Affirmation | Réponse | Pourquoi |
|---|---|---|
| L'ensemble de définition de $x\mapsto\ln(x)$ est $\mathbb R$ | **Faux** | il est $]0;+\infty[$ |
| $\ln(1)=0$ | **Vrai** | conséquence directe de la définition |
| Pour tout $x>0$, $(\ln x)'=\dfrac1x$ | **Vrai** | c'est la dérivée de référence |
| $\ln$ est la dérivée sur $]0;+\infty[$ de $x\mapsto\dfrac1x$ | **Faux** | c'est l'inverse : $\dfrac1x$ est la dérivée de $\ln$ |
| L'image d'un nombre réel négatif par $\ln$ existe | **Faux** | l'argument doit être strictement positif |

> **Erreur fréquente.** Ne retourne pas la définition : $\ln$ est la fonction **dont la dérivée est** $\dfrac1x$, et non la dérivée de $x\mapsto\dfrac1x$. L'ordre des mots change tout.

> **Astuce mémoire de Davy.** Trois réflexes à graver : « **argument strictement positif**, $\ln(1)=0$, dérivée $\dfrac1x$ ». Avant tout calcul avec $\ln$, vérifie d'abord que ce qu'il y a dans le logarithme est $>0$.`,
    keyPoint: "Domaine : ]0 ; +∞[ ; ln(1)=0 ; (ln x)'=1/x.",
    example: "La fonction $x\\mapsto\\ln(x)$ n'est pas définie pour $x=-2$.",
    methodSteps: [
      "Impose toujours l'argument strictement positif.",
      "Utilise ln(1) = 0.",
      "Pour dériver ln x, écris 1/x.",
    ],
    timeline: [
      { label: "Domaine", detail: "ln n'accepte que des arguments strictement positifs." },
      { label: "Point fixe", detail: "ln s'annule en 1 : ln(1) = 0." },
      { label: "Dérivée", detail: "Sur ]0 ; +∞[, la dérivée de ln est 1/x." },
    ],
    questions: [
      choice("L'ensemble de définition de $x\\mapsto\\ln x$ est $\\mathbb R$.", ["Vrai", "Faux"], 1, "Il est $]0;+\\infty[$.", "Exercice de fixation, affirmation 1, page 1"),
      choice("$\\ln(1)=0$.", ["Vrai", "Faux"], 0, "C'est une conséquence de la définition.", "Exercice de fixation, affirmation 2, page 1"),
      choice("Pour $x>0$, $(\\ln x)'=1/x$.", ["Vrai", "Faux"], 0, "C'est la dérivée de référence.", "Exercice de fixation, affirmation 3, page 1"),
      choice("La fonction $\\ln$ est la dérivée sur $]0;+\\infty[$ de la fonction $x\\mapsto1/x$.", ["Vrai", "Faux"], 1, "C'est l'inverse : $1/x$ est la dérivée de $\\ln$.", "Exercice de fixation, affirmation 4, page 1"),
      choice("L'image d'un nombre négatif par $\\ln$ existe dans $\\mathbb R$.", ["Vrai", "Faux"], 1, "Le logarithme réel exige un argument strictement positif.", "Exercice de fixation, affirmation 5, page 2"),
    ],
  },
  {
    id: "log-algebraic-properties",
    title: "Propriétés algébriques du logarithme",
    summary: "Transformer produits, quotients, inverses, racines et puissances.",
    pages: "2",
    section: "I-2. Propriétés algébriques",
    durationMinutes: 20,
    xp: 55,
    body: String.raw`## Les cinq propriétés

Pour tous nombres réels $a$ et $b$ strictement positifs :

| Propriété | Formule |
|---|---|
| Produit | $\ln(a\times b)=\ln a+\ln b$ |
| Inverse | $\ln\left(\dfrac1b\right)=-\ln b$ |
| Quotient | $\ln\left(\dfrac ab\right)=\ln a-\ln b$ |
| Puissance | pour tout $n\in\mathbb Z$, $\ln(a^n)=n\ln a$ |
| Racine carrée | $\ln(\sqrt a)=\dfrac12\ln a$ |

### Exercice de fixation 1 entièrement rédigé

Exprimons en fonction de $\ln2$ et $\ln3$ :

$$A=\ln(24)=\ln(2^3\times3)=\ln(2^3)+\ln3=3\ln2+\ln3$$

$$B=\ln\left(\frac23\right)=\ln2-\ln3$$

$$C=\ln(3^5)-\ln(2^4)=5\ln3-4\ln2$$

### Exercice de fixation 2 entièrement rédigé

Écrivons sous la forme $\ln(k)$ avec $k>0$ :

$$D=\ln(5)+\ln(3)=\ln(5\times3)=\ln(15)$$

$$E=\ln(2)-\ln(0{,}1)=\ln\left(\frac{2}{0{,}1}\right)=\ln(20)$$

$$F=4\ln5=\ln(5^4)=\ln(625)$$

### Exercice de renforcement rédigé

Pour tout réel $x>1$, les nombres $x+1$ et $x-1$ sont strictement positifs, donc :

$$\ln(x+1)+\ln(x-1)=\ln\big((x+1)(x-1)\big)=\ln(x^2-1)$$

> **Erreur fréquente.** $\ln(a+b)$ n'est **pas** $\ln a+\ln b$ : le logarithme transforme les **produits** en sommes, pas les sommes. De même, $\dfrac{\ln a}{\ln b}$ n'est pas $\ln\left(\dfrac ab\right)$.

> **Astuce mémoire de Davy.** « Le logarithme descend d'un étage : produit → somme, quotient → différence, puissance → multiple. » Commence toujours par factoriser l'argument avant d'appliquer les propriétés.`,
    keyPoint: "Un produit devient une somme ; un quotient devient une différence.",
    example: "$\\ln(24)=\\ln(2^3\\times3)=3\\ln2+\\ln3$.",
    methodSteps: [
      "Factorise l'argument en produits ou quotients.",
      "Applique la propriété adaptée.",
      "Regroupe les coefficients de mêmes logarithmes.",
    ],
    timeline: [
      { label: "Factoriser", detail: "Décomposer l'argument en produit, quotient ou puissance." },
      { label: "Transformer", detail: "Produit → somme ; quotient → différence ; puissance → multiple." },
      { label: "Regrouper", detail: "Rassembler les ln2, ln3… et simplifier." },
    ],
    questions: [
      choice("Exprime $\\ln(24)$ avec $\\ln2$ et $\\ln3$.", ["$2\\ln2+3\\ln3$", "$3\\ln2+\\ln3$", "$\\ln2+3\\ln3$", "$24\\ln6$"], 1, "$24=2^3\\times3$.", "Exercice de fixation 1-A, page 2"),
      choice("Écris $\\ln5+\\ln3$ sous la forme $\\ln k$.", ["$\\ln8$", "$\\ln15$", "$\\ln(5/3)$", "$\\ln2$"], 1, "$\\ln a+\\ln b=\\ln(ab)$.", "Exercice de fixation 2-D, page 2"),
      short("Dans $4\\ln5=\\ln k$, calcule $k$.", ["625"], "$4\\ln5=\\ln(5^4)=\\ln625$.", "Exercice de fixation 2-F, page 2"),
      choice("Exprime $B=\\ln(2/3)$ avec $\\ln2$ et $\\ln3$.", ["$\\ln2+\\ln3$", "$\\ln2-\\ln3$", "$\\ln3-\\ln2$", "$\\ln2\\times\\ln3$"], 1, "Le quotient devient une différence.", "Exercice de fixation 1-B, page 2"),
      choice("Exprime $C=\\ln(3^5)-\\ln(2^4)$.", ["$5\\ln3-4\\ln2$", "$4\\ln3-5\\ln2$", "$15\\ln3-8\\ln2$", "$\\ln(3^5/2^4)$ ne se simplifie pas"], 0, "Chaque puissance descend en coefficient.", "Exercice de fixation 1-C, page 2"),
      short("Dans $\\ln(2)-\\ln(0{,}1)=\\ln k$, calcule $k$.", ["20"], "$2/0{,}1=20$.", "Exercice de fixation 2-E, page 2"),
      choice("Pour $x>1$, $\\ln(x+1)+\\ln(x-1)$ vaut :", ["$\\ln(2x)$", "$\\ln(x^2-1)$", "$\\ln(x^2+1)$", "$2\\ln x$"], 1, "La somme des logarithmes est le logarithme du produit $(x+1)(x-1)=x^2-1$.", "Exercice de renforcement 1, page 7", 2),
    ],
  },
  {
    id: "log-limits-variations",
    title: "Limites de référence du logarithme",
    summary: "Utiliser les quatre limites de référence de ln en 0 et à l'infini.",
    pages: "3, 7-8",
    section: "II-1. Limites de référence",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## Les quatre limites de référence

| Limite | Valeur |
|---|---|
| $\displaystyle\lim_{x\to+\infty}\ln x$ | $+\infty$ |
| $\displaystyle\lim_{x\to0^+}\ln x$ | $-\infty$ |
| $\displaystyle\lim_{x\to0^+}x\ln x$ | $0$ |
| $\displaystyle\lim_{x\to+\infty}\frac{\ln x}{x}$ | $0$ |

Les deux dernières formes montrent que $\ln x$ croît **moins vite** que $x$ : à l'infini comme en zéro, c'est $x$ qui impose sa loi au produit et au quotient.

### Exercice de fixation entièrement rédigé

**1)** $\displaystyle\lim_{x\to0^+}(x+\ln x)=-\infty$ car $\lim_{x\to0}x=0$ et $\lim_{x\to0^+}\ln x=-\infty$.

**2)** $\displaystyle\lim_{x\to+\infty}(x+\ln x)=+\infty$ car les deux termes tendent vers $+\infty$.

**3)** $\displaystyle\lim_{x\to+\infty}x\left(1-\frac{\ln x}{x}\right)=+\infty$ car $\lim_{x\to+\infty}x=+\infty$ et $\lim_{x\to+\infty}\left(1-\frac{\ln x}{x}\right)=1$.

**4)** $\displaystyle\lim_{x\to0^+}x(1+\ln x)=\lim_{x\to0^+}(x+x\ln x)=0$ car $\lim_{x\to0}x=0$ et $\lim_{x\to0^+}x\ln x=0$.

### Exercice d'application rédigé (exercice 7)

Pour $f(x)=-3x+\ln x$ :

- en $+\infty$ : $f(x)=x\left(-3+\dfrac{\ln x}{x}\right)$ et $-3+\dfrac{\ln x}{x}\to-3$, donc $\lim_{x\to+\infty}f(x)=-\infty$ ;
- en $0^+$ : $-3x\to0$ et $\ln x\to-\infty$, donc $\lim_{x\to0^+}f(x)=-\infty$.

> **Erreur fréquente.** En $+\infty$, la somme $x+\ln x$ ne pose pas de problème, mais $x-\ln x$ ou $-3x+\ln x$ donnent la forme indéterminée $\infty-\infty$. Le bon réflexe : **factoriser par $x$** pour faire apparaître $\dfrac{\ln x}{x}\to0$.

> **Astuce mémoire de Davy.** « À l'infini, $x$ écrase $\ln x$. » Dès que $x$ et $\ln x$ se disputent, factorise par $x$ : le quotient $\dfrac{\ln x}{x}$ disparaît et le terme en $x$ décide du résultat.`,
    keyPoint: "À droite de 0, ln x → −∞ ; à +∞, ln x → +∞ mais ln x / x → 0.",
    example: "$x(1+\\ln x)=x+x\\ln x\\to0$ lorsque $x\\to0^+$.",
    methodSteps: [
      "Identifie la limite de référence utile.",
      "Réécris le produit ou le quotient si nécessaire (factorise par x).",
      "Combine les limites puis conclus.",
    ],
    timeline: [
      { label: "Référence", detail: "Repérer laquelle des quatre limites s'applique." },
      { label: "Réécriture", detail: "Factoriser par x pour lever une indétermination." },
      { label: "Conclusion", detail: "Combiner les limites et rédiger le résultat." },
    ],
    questions: [
      short("Calcule $\\lim_{x\\to0^+}(x+\\ln x)$.", ["-∞", "-infini"], "$x\\to0$ et $\\ln x\\to-\\infty$.", "Exercice de fixation, question 1, page 3"),
      short("Calcule $\\lim_{x\\to+\\infty}(x+\\ln x)$.", ["+∞", "∞", "+infini", "infini"], "Les deux termes tendent vers $+\\infty$.", "Exercice de fixation, question 2, page 3"),
      short("Calcule $\\lim_{x\\to0^+}x(1+\\ln x)$.", ["0"], "$x+x\\ln x\\to0+0$.", "Exercice de fixation, question 4, page 3"),
      short("Calcule $\\lim_{x\\to+\\infty}x\\left(1-\\frac{\\ln x}{x}\\right)$.", ["+∞", "+infini"], "Le facteur entre parenthèses tend vers 1 et $x$ vers $+\\infty$.", "Exercice de fixation, question 3, page 3"),
      short("Calcule $\\lim_{x\\to0^+}(\\ln x-3x)$.", ["-∞", "-infini"], "$\\ln x\\to-\\infty$ et $-3x\\to0$.", "Exercice de renforcement 4-a, page 7"),
      short("Calcule $\\lim_{x\\to+\\infty}(-x-3-\\ln x)$.", ["-∞", "-infini"], "Les deux termes variables tendent vers $-\\infty$.", "Exercice de renforcement 4-b, page 7"),
      short("Calcule $\\lim_{x\\to+\\infty}(x-2-\\ln x)$.", ["+∞", "+infini"], "$x\\left(1-\\frac2x-\\frac{\\ln x}{x}\\right)\\to+\\infty\\times1$.", "Exercice de renforcement 4-c, page 7", 2),
    ],
  },
  {
    id: "log-derivative-variation",
    title: "Dérivée, variations et courbe de ln",
    summary: "Justifier que ln est strictement croissante et étudier une fonction contenant ln x.",
    pages: "3-4, 8",
    section: "II-2. Dérivée et sens de variation",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Sens de variation de ln

Pour tout $x>0$, $(\ln x)'=\dfrac1x$ et $\dfrac1x>0$ : la fonction $\ln$ est donc **strictement croissante** sur $]0;+\infty[$.

### Tableau de variation

| $x$ | $0$ | | $+\infty$ |
|---|---|---|---|
| $(\ln x)'$ | $\|$ | $+$ | |
| $\ln(x)$ | $\|$ $-\infty$ | $\nearrow$ | $+\infty$ |

La courbe passe par $(1;0)$ et par $(e;1)$ avec $e\approx2{,}718$ ; l'axe des ordonnées est asymptote verticale.

### Exercice de fixation entièrement rédigé

Soit $f(x)=2x+\ln x$.

**1)** $x\in D_f\iff x>0$, donc $D_f=]0;+\infty[$.

**2)** Pour tout $x\in]0;+\infty[$ : $f'(x)=2+\dfrac1x$.

**3)** Pour tout $x\in]0;+\infty[$, $2+\dfrac1x>0$ donc $f'(x)>0$ : $f$ est **strictement croissante** sur $]0;+\infty[$.

### Exercice de maison rédigé

Soit $f(x)=1-x+\ln x$ sur $D_f=]0;+\infty[$ :

$$f'(x)=-1+\frac1x=\frac{1-x}{x}$$

Sur $]0;+\infty[$, le signe de $f'(x)$ est celui de $1-x$ : $f$ est **croissante sur $]0;1]$** puis **décroissante sur $[1;+\infty[$**, avec un maximum en $x=1$ valant $f(1)=0$.

> **Erreur fréquente.** N'étudie jamais une fonction contenant $\ln x$ sans avoir posé $x>0$ d'abord : le domaine conditionne le signe de la dérivée (sur $]0;+\infty[$, $x>0$, donc seul le numérateur décide).

> **Astuce mémoire de Davy.** « $\dfrac1x$ est positif, donc $\ln$ monte — toujours. » Et pour $a x+\ln x$ : dérive terme à terme, mets au même dénominateur, le signe du numérateur donne les variations.`,
    keyPoint: "Sur ]0 ; +∞[, 1/x > 0 : ln est strictement croissante.",
    example: "$f(x)=2x+\\ln x$ a pour dérivée $f'(x)=2+1/x>0$.",
    methodSteps: [
      "Détermine le domaine avec x > 0.",
      "Calcule la dérivée et mets-la au même dénominateur.",
      "Étudie le signe du numérateur puis dresse les variations.",
    ],
    timeline: [
      { label: "Domaine", detail: "Poser x > 0 avant tout calcul." },
      { label: "Dérivée", detail: "Dériver terme à terme, réduire au même dénominateur." },
      { label: "Variations", detail: "Le signe du numérateur donne le sens de variation." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Parcours la courbe du logarithme népérien",
      instruction: "Déplace le point : repère le passage par (1 ; 0), le point (e ; 1) et la chute vers −∞ près de 0.",
      observation: "La courbe monte sans cesse : ln est strictement croissante. Elle traverse l'axe des abscisses en x = 1, atteint 1 en x = e ≈ 2,72 et plonge vers −∞ contre l'axe des ordonnées.",
      formula: "f(x) = ln(x)",
      formulaTex: "f(x)=\\ln x",
      rule: { kind: "affine-plus-log", slope: 0, intercept: 0, coefficient: 1 },
      window: { xMin: -0.5, xMax: 8, yMin: -3, yMax: 3 },
      guides: [
        { kind: "horizontal", value: 1, label: "y = 1" },
        { kind: "vertical", value: 2.718, label: "x = e" },
      ],
      marker: { min: 0.05, max: 8, step: 0.05, initial: 1 },
    },
    questions: [
      choice("Quel est le domaine de $f(x)=2x+\\ln x$ ?", ["$\\mathbb R$", "$]-\\infty;0[$", "$]0;+\\infty[$", "$[0;+\\infty[$"], 2, "La présence de $\\ln x$ impose $x>0$.", "Exercice de fixation, question 1, page 4"),
      choice("Quelle est la dérivée de $f(x)=2x+\\ln x$ ?", ["$2+\\ln x$", "$2+1/x$", "$2x+1/x$", "$1/x$"], 1, "On dérive séparément les deux termes.", "Exercice de fixation, question 2, page 4"),
      choice("Quel est le sens de variation de $f$ sur son domaine ?", ["Décroissante", "Constante", "Strictement croissante", "Non monotone"], 2, "$2+1/x>0$ pour $x>0$.", "Exercice de fixation, question 3, page 4"),
      choice("Quelle est la dérivée de $f(x)=1-x+\\ln x$ ?", ["$-1+1/x$", "$1+1/x$", "$-x+1/x$", "$-1+\\ln x$"], 0, "On dérive terme à terme : $(1)'=0$, $(-x)'=-1$, $(\\ln x)'=1/x$.", "Exercice de maison, page 4"),
      choice("Les variations de $f(x)=1-x+\\ln x$ sur $]0;+\\infty[$ sont :", ["Croissante partout", "Décroissante partout", "Croissante sur $]0;1]$ puis décroissante", "Décroissante sur $]0;1]$ puis croissante"], 2, "$f'(x)=(1-x)/x$ change de signe en $x=1$.", "Exercice de maison, page 4", 2),
      choice("Le sens de variation de $h(x)=-3x-1-\\ln x$ sur $]0;+\\infty[$ est :", ["Strictement croissante", "Strictement décroissante", "Croissante puis décroissante", "Constante"], 1, "$h'(x)=-3-1/x<0$ pour tout $x>0$.", "Exercice de renforcement 8, page 8"),
      choice("Pour $f(x)=3-x-\\ln x$, la limite en $0^+$ est :", ["$-\\infty$", "$0$", "$3$", "$+\\infty$"], 3, "$-\\ln x\\to+\\infty$ et $3-x\\to3$.", "Exercice de renforcement 9-a, page 8", 2),
    ],
  },
  {
    id: "log-equations-inequalities",
    title: "Équations comportant ln",
    summary: "Résoudre une équation logarithmique après avoir déterminé son ensemble de validité.",
    pages: "4-5, 7",
    section: "III-1 et III-2. Propriété et équations",
    durationMinutes: 25,
    xp: 75,
    body: String.raw`## Propriété fondamentale

Pour tous réels $a$ et $b$ strictement positifs :

- $\ln a>\ln b$ équivaut à $a>b$ ;
- $\ln a=\ln b$ équivaut à $a=b$.

### Conséquences

Pour tout réel $x$ strictement positif :

| Équation ou signe | Équivaut à |
|---|---|
| $\ln x=0$ | $x=1$ |
| $\ln x<0$ | $0<x<1$ |
| $\ln x>0$ | $x>1$ |

**Remarque.** Il existe un seul réel noté $e$, appartenant à $]2;3[$, tel que $\ln(e)=1$, avec $e\approx2{,}718$.

## Les trois exemples officiels entièrement rédigés

### 1) $\ln(2x-1)=\ln(x+5)$

Ensemble de validité : $2x-1>0$ **et** $x+5>0$, soit $V=\left]\frac12;+\infty\right[$.

$$\ln(2x-1)=\ln(x+5)\iff2x-1=x+5\iff x=6$$

Comme $6\in V$ : $S_{\mathbb R}=\{6\}$.

### 2) $\ln(x-2)=1$

Validité : $x>2$, soit $V=]2;+\infty[$.

$$\ln(x-2)=1\iff\ln(x-2)=\ln e\iff x-2=e\iff x=e+2$$

Comme $e+2\in V$ : $S_{\mathbb R}=\{e+2\}$.

### 3) $(\ln x)^2+\ln x-6=0$

Validité : $V=]0;+\infty[$. On pose $X=\ln x$ ; l'équation devient :

$$X^2+X-6=0\qquad\Delta=1+24=25\qquad X=-3\ \text{ou}\ X=2$$

$$\ln x=-3\ \text{ou}\ \ln x=2\iff x=e^{-3}\ \text{ou}\ x=e^{2}$$

Les deux valeurs sont dans $V$ : $S_{\mathbb R}=\{e^{-3};e^{2}\}$.

> **Erreur fréquente.** Résoudre sans écrire l'**ensemble de validité** conduit à garder des solutions interdites. La règle : validité d'abord, transformation ensuite, vérification des solutions à la fin.

> **Astuce mémoire de Davy.** « Validité, transformation, vérification » — toujours dans cet ordre. Et quand l'équation est du second degré en $\ln x$, pose $X=\ln x$ : tu retrouves un terrain connu.`,
    keyPoint: "Domaine d'abord, équation ensuite, vérification des solutions à la fin.",
    example: "$\\ln(2x-1)=\\ln(x+5)$ donne $x=6$, après vérification de $x>1/2$.",
    methodSteps: [
      "Écris l'ensemble de validité.",
      "Utilise l'injectivité de ln ou pose X = ln x.",
      "Résous puis conserve seulement les solutions valides.",
    ],
    timeline: [
      { label: "Validité", detail: "Chaque argument de ln doit être strictement positif." },
      { label: "Transformation", detail: "ln a = ln b ⟺ a = b, ou changement d'inconnue X = ln x." },
      { label: "Vérification", detail: "Ne garder que les solutions appartenant à V." },
    ],
    questions: [
      short("Résous $\\ln(2x-1)=\\ln(x+5)$.", ["6", "{6}", "x=6"], "Sur $x>1/2$, l'égalité équivaut à $2x-1=x+5$.", "Exemple officiel 1, pages 4-5"),
      choice("Résous $\\ln(x-2)=1$.", ["$x=e-2$", "$x=e+2$", "$x=3$", "$x=2e$"], 1, "$\\ln(x-2)=\\ln e$ donne $x-2=e$.", "Exemple officiel 2, pages 4-5"),
      choice("Résous $(\\ln x)^2+\\ln x-6=0$.", ["$\\{e^{-3},e^2\\}$", "$\\{-3,2\\}$", "$\\{e^{-2},e^3\\}$", "$\\{3,-2\\}$"], 0, "Avec $X=\\ln x$, les racines sont $-3$ et $2$.", "Exemple officiel 3, pages 4-5", 2),
      short("Résous $\\ln(2-x)=0$.", ["1", "x=1", "{1}"], "$2-x=1$ donne $x=1$, qui vérifie bien $x<2$.", "Exercice de maison a, page 5"),
      short("Résous $2-\\ln x=0$.", ["e²", "e^2", "e2"], "$\\ln x=2$ équivaut à $x=e^2$.", "Exercice de maison c, page 5"),
      choice("Résous $\\ln(x^2-6)=\\ln(5x)$.", ["$\\{6;-1\\}$", "$\\{6\\}$", "$\\{-1\\}$", "$\\{5;6\\}$"], 1, "$x^2-5x-6=0$ donne 6 et $-1$, mais la validité impose $x>\\sqrt6$ : seule 6 convient.", "Exercice de renforcement 2-b, page 7", 2),
      short("Résous $1-\\ln x=0$.", ["e", "x=e"], "$\\ln x=1$ équivaut à $x=e$.", "Exercice de renforcement 2-c, page 7"),
    ],
  },
  {
    id: "log-inequalities",
    title: "Inéquations comportant ln",
    summary: "Exploiter la stricte croissance de ln et résoudre des inéquations en ln x.",
    pages: "5, 7",
    section: "III-3. Inéquations",
    durationMinutes: 25,
    xp: 75,
    body: String.raw`## Le principe

Pour $a>0$ et $b>0$ : $\ln a<\ln b\iff a<b$, car $\ln$ est **strictement croissante**. Le sens de l'inégalité est conservé.

## Les deux exemples officiels entièrement rédigés

### 1) $\ln(2x-3)<1$

Validité : $2x-3>0$, soit $V=\left]\frac32;+\infty\right[$.

$$\ln(2x-3)<1\iff\ln(2x-3)<\ln e\iff2x-3<e\iff x<\frac{3+e}{2}$$

$$S_{\mathbb R}=V\cap\left]-\infty;\frac{3+e}{2}\right[=\left]\frac32;\frac{3+e}{2}\right[$$

### 2) $(\ln x)^2-5\ln x+6\ge0$

Validité : $V=]0;+\infty[$. On pose $X=\ln x$ :

$$X^2-5X+6\ge0\qquad\Delta=25-24=1\qquad X=2\ \text{ou}\ X=3$$

| $X$ | $-\infty$ | | $2$ | | $3$ | | $+\infty$ |
|---|---|---|---|---|---|---|---|
| $X^2-5X+6$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |

$$X\le2\ \text{ou}\ X\ge3\iff\ln x\le2\ \text{ou}\ \ln x\ge3\iff x\le e^2\ \text{ou}\ x\ge e^3$$

$$S_{\mathbb R}=V\cap\big(]-\infty;e^2]\cup[e^3;+\infty[\big)=\;]0;e^2]\cup[e^3;+\infty[$$

### Exercice de maison rédigé

$2(\ln x)^2-3\ln x-2\le0$ : avec $X=\ln x$, $\Delta=9+16=25$, racines $X=2$ et $X=-\frac12$.

$$-\frac12\le\ln x\le2\iff e^{-1/2}\le x\le e^2\qquad S_{\mathbb R}=\left[e^{-1/2};e^2\right]$$

> **Erreur fréquente.** N'oublie jamais d'**intersecter** le résultat avec l'ensemble de validité : $\ln x\le2$ ne donne pas $x\le e^2$ tout seul, mais $0<x\le e^2$.

> **Astuce mémoire de Davy.** « $\ln$ monte, donc l'inégalité ne se retourne jamais » — comparer les logarithmes revient à comparer les arguments. Second degré en $\ln x$ ? Pose $X$, fais ton tableau de signe, puis reviens à $x$ avec $e$.`,
    keyPoint: "Le sens de l'inégalité est conservé par ln sur les réels strictement positifs.",
    example: "$\\ln(2x-3)<1$ donne $3/2<x<(3+e)/2$.",
    methodSteps: [
      "Détermine l'ensemble de validité.",
      "Compare les arguments ou pose X = ln x.",
      "Intersecte le résultat avec le domaine.",
    ],
    timeline: [
      { label: "Validité", detail: "Arguments strictement positifs : écrire V." },
      { label: "Comparaison", detail: "ln a < ln b ⟺ a < b ; ou tableau de signe en X." },
      { label: "Intersection", detail: "S = V ∩ (solutions trouvées)." },
    ],
    corrections: [
      "L'énoncé officiel de l'inéquation 2 écrit (ln x)² − 5 ln x − 6 ≥ 0, mais la résolution officielle traite X² − 5X + 6 (racines 2 et 3) et conclut ]0 ; e²] ∪ [e³ ; +∞[. Le niveau suit la résolution en corrigeant l'énoncé en (ln x)² − 5 ln x + 6 ≥ 0.",
    ],
    questions: [
      choice("Résous $\\ln x-3\\ge0$.", ["$x\\ge3$", "$x\\ge e^3$", "$0<x\\le e^3$", "$x\\le3$"], 1, "$\\ln x\\ge3$ équivaut à $x\\ge e^3$.", "Exercice de maison a, page 5"),
      choice("La solution de $\\ln(2x-3)<1$ est :", ["$]3/2;(3+e)/2[$", "$]-\\infty;(3+e)/2[$", "$]0;e[$", "$[(3+e)/2;+\\infty[$"], 0, "Il faut conserver la contrainte $2x-3>0$.", "Exemple officiel 1, page 5", 2),
      choice("Résous $2(\\ln x)^2-3\\ln x-2\\le0$.", ["$[e^{-1/2};e^2]$", "$[-1/2;2]$", "$]0;e^2]$", "$[e^2;+\\infty[$"], 0, "Les racines en $X$ sont $-1/2$ et $2$, puis on revient à $x$.", "Exercice de maison b, page 5", 2),
      choice("Résous $\\ln(x+1)\\ge1$.", ["$x\\ge e-1$", "$x\\ge e+1$", "$x\\ge1$", "$x>-1$"], 0, "$x+1\\ge e$ donne $x\\ge e-1$.", "Exercice de renforcement 3-a, page 7"),
      choice("Résous $\\ln(-x+2)\\le0$.", ["$[1;2[$", "$]-\\infty;1]$", "$]0;2[$", "$[2;+\\infty[$"], 0, "$0<-x+2\\le1$ donne $1\\le x<2$.", "Exercice de renforcement 3-b, page 7", 2),
      choice("Résous $(\\ln x-2)(\\ln x-1)\\le0$.", ["$[e;e^2]$", "$[1;2]$", "$]0;e]$", "$[e^2;+\\infty[$"], 0, "Le produit est négatif entre les racines : $1\\le\\ln x\\le2$.", "Exercice de renforcement 3-f, page 7", 2),
    ],
  },
  {
    id: "log-composite-derivatives",
    title: "Dérivée d'un logarithme composé",
    summary: "Dériver ln(u) sur un intervalle où u est strictement positive.",
    pages: "5-6, 8",
    section: "IV-1. Dérivée",
    durationMinutes: 20,
    xp: 70,
    body: String.raw`## Propriété

Si $u$ est une fonction dérivable et **strictement positive** sur un intervalle $K$, alors $\ln(u)$ est dérivable sur $K$ et :

$$\big(\ln(u)\big)'=\frac{u'}{u}$$

La condition $u>0$ n'est pas décorative : elle définit l'intervalle sur lequel la formule a un sens.

### Exercice de fixation entièrement rédigé

**1)** $f(x)=\ln(5x+2)$ sur $I=]0;13[$ : ici $u(x)=5x+2$ et $u'(x)=5$, donc

$$f'(x)=\frac{5}{5x+2}$$

**2)** $f(x)=\ln(2x^2-x-1)$ sur $I=\left]-\infty;-\frac12\right[$ : ici $u'(x)=4x-1$, donc

$$f'(x)=\frac{4x-1}{2x^2-x-1}$$

### Exercice de maison rédigé

| Fonction | Intervalle | Dérivée |
|---|---|---|
| $\ln(x^2+2)$ | $\mathbb R$ | $\dfrac{2x}{x^2+2}$ |
| $\ln(-3x)$ | $]-2;-1[$ | $\dfrac{-3}{-3x}=\dfrac1x$ |
| $\ln(-3x^2+5x-2)$ | $\left]\frac23;1\right[$ | $\dfrac{-6x+5}{-3x^2+5x-2}$ |

### Exercice de renforcement rédigé (exercice 8-g)

$g(x)=\ln(-3x^2-2x+5)$ : le trinôme $-3x^2-2x+5$ s'annule en $x=-\frac53$ et $x=1$, il est strictement positif sur $\left]-\frac53;1\right[$. Sur cet intervalle :

$$g'(x)=\frac{-6x-2}{-3x^2-2x+5}$$

Le signe de $g'(x)$ est celui de $-6x-2$ : $g$ est croissante sur $\left]-\frac53;-\frac13\right]$ puis décroissante sur $\left[-\frac13;1\right[$.

> **Erreur fréquente.** $(\ln u)'$ n'est pas $\dfrac1u$ : le numérateur est $u'$, pas $1$. Oublier $u'$ est l'erreur la plus fréquente de tout le chapitre.

> **Astuce mémoire de Davy.** « Le haut, c'est la dérivée du bas. » Identifie $u$, calcule $u'$, empile : $\dfrac{u'}{u}$. Et vérifie toujours que $u>0$ sur l'intervalle donné.`,
    keyPoint: "(ln u)' = u'/u, sur un intervalle où u > 0.",
    example: "Si $f(x)=\\ln(5x+2)$, alors $f'(x)=5/(5x+2)$.",
    methodSteps: [
      "Identifie u(x) et vérifie u(x) > 0 sur l'intervalle.",
      "Calcule u'(x).",
      "Écris u'(x)/u(x) et simplifie.",
    ],
    timeline: [
      { label: "Identifier", detail: "Repérer la fonction u à l'intérieur du logarithme." },
      { label: "Dériver", detail: "Calculer u′ séparément." },
      { label: "Empiler", detail: "Écrire u′/u puis simplifier si possible." },
    ],
    corrections: [
      "L'exercice 5-e demande de dériver f(x) = ln(−x² + 2x − 1) ; or −x² + 2x − 1 = −(x−1)² est négatif ou nul pour tout réel : la fonction n'est définie sur aucun intervalle. La coquille est signalée et l'exercice écarté.",
    ],
    questions: [
      choice("Dérive $f(x)=\\ln(5x+2)$.", ["$1/(5x+2)$", "$5/(5x+2)$", "$5\\ln(5x+2)$", "$5x+2$"], 1, "$u'=5$, donc $(\\ln u)'=u'/u$.", "Exercice de fixation 1, page 5"),
      choice("Dérive $f(x)=\\ln(2x^2-x-1)$.", ["$1/(2x^2-x-1)$", "$(4x-1)/(2x^2-x-1)$", "$(2x-1)/(2x^2-x-1)$", "$4x-1$"], 1, "La dérivée de $2x^2-x-1$ est $4x-1$.", "Exercice de fixation 2, page 6"),
      choice("Dérive $f(x)=\\ln(x^2+2)$ sur $\\mathbb R$.", ["$2x/(x^2+2)$", "$1/(x^2+2)$", "$2x\\ln(x^2+2)$", "$x/(x^2+2)$"], 0, "$u'=2x$ et $x^2+2>0$ partout.", "Exercice de maison 1, page 6"),
      choice("Dérive $f(x)=\\ln(-3x)$ sur $]-2;-1[$.", ["$-3/x$", "$1/x$", "$-1/x$", "$-3/(-3x^2)$"], 1, "$\\frac{-3}{-3x}=\\frac1x$.", "Exercice de maison 2, page 6", 2),
      choice("Dérive $f(x)=x-3-\\ln x$.", ["$1-1/x$", "$1+1/x$", "$x-1/x$", "$-1/x$"], 0, "On dérive terme à terme.", "Exercice de renforcement 5-a, page 8"),
      choice("Dérive $f(x)=\\ln(-3x+4)$.", ["$-3/(-3x+4)$", "$1/(-3x+4)$", "$3/(-3x+4)$", "$-3\\ln(-3x+4)$"], 0, "$u'=-3$ reste au numérateur.", "Exercice de renforcement 5-c, page 8"),
      short("Donne la dérivée de $g(x)=\\ln(-3x^2-2x+5)$.", ["(-6x-2)/(-3x^2-2x+5)", "(-6x-2)/(-3x²-2x+5)", "(6x+2)/(3x^2+2x-5)"], "$u'(x)=-6x-2$ au numérateur, le trinôme au dénominateur.", "Exercice de renforcement 8, page 8", 2),
    ],
  },
  {
    id: "log-primitives",
    title: "Primitives, mission du dépistage et défi type Bac",
    summary: "Déterminer les primitives en u′/u, résoudre la situation complexe du dépistage et mener l'étude type Bac.",
    pages: "6-7, 9-10",
    section: "IV-2. Primitives, C-Situation complexe et exercice type Bac",
    durationMinutes: 30,
    xp: 75,
    kind: "challenge",
    body: String.raw`## Primitives et logarithme

Si $u$ est dérivable et **strictement positive** sur un intervalle $K$, alors la fonction $\dfrac{u'}{u}$ a pour primitives sur $K$ les fonctions $\ln(u)+\alpha$, avec $\alpha\in\mathbb R$.

### Point méthode

| Fonction | Primitives |
|---|---|
| $f:x\mapsto\dfrac1x$ $(x>0)$ | $F:x\mapsto\ln(x)+k$, $k\in\mathbb R$ |
| $f:x\mapsto\dfrac{a}{cx+d}$, $c\neq0$ et $cx+d>0$ | $F:x\mapsto\dfrac ac\ln(cx+d)+k$, $k\in\mathbb R$ |
| $f:x\mapsto\dfrac{u'(x)}{u(x)}$, $u(x)>0$ | $F:x\mapsto\ln(u(x))+k$, $k\in\mathbb R$ |

### Exercice de fixation entièrement rédigé

**a)** $f(x)=\dfrac1x$ sur $]0;+\infty[$ : $F(x)=\ln(x)+\alpha$.

**b)** $f(x)=\dfrac{2}{-3x+7}$ sur $\left]-\infty;\frac73\right[$ : $F(x)=-\dfrac23\ln(-3x+7)+\alpha$.

**c)** $f(x)=\dfrac{2x+1}{x^2+x+3}$ sur $]0;+\infty[$ : avec $u(x)=x^2+x+3$, $u'(x)=2x+1$ et $u>0$, donc $F(x)=\ln(x^2+x+3)+\alpha$.

## Mission finale — le dépistage de la fièvre typhoïde (situation complexe)

Après l'examen de $n$ élèves pris au hasard, la probabilité d'avoir au moins un élève non atteint est $1-(0{,}325)^n$. Quel est le nombre minimum d'élèves pour que cette probabilité dépasse $98\,\%$ ?

Résolvons dans $\mathbb N$ l'inéquation $1-(0{,}325)^n\ge0{,}98$ :

$$1-(0{,}325)^n\ge0{,}98\iff(0{,}325)^n\le0{,}02\iff\ln\big((0{,}325)^n\big)\le\ln(0{,}02)$$

$$\iff n\ln(0{,}325)\le\ln(0{,}02)\iff n\ge\frac{\ln(0{,}02)}{\ln(0{,}325)}\approx3{,}48$$

**Attention au retournement** : $\ln(0{,}325)<0$, la division change le sens de l'inégalité. La valeur minimale de $n$ est donc $\boxed{4}$.

## Défi type Bac — étude de $f(x)=-2x+1+\ln x$

Sur $]0;+\infty[$ :

- $\displaystyle\lim_{x\to0^+}f(x)=-\infty$ (car $-2x+1\to1$ et $\ln x\to-\infty$) : la droite $x=0$ est **asymptote verticale** ;
- $\displaystyle\lim_{x\to+\infty}f(x)=\lim_{x\to+\infty}x\left(-2+\frac1x+\frac{\ln x}{x}\right)=-\infty$ ;
- $f'(x)=-2+\dfrac1x=\dfrac{-2x+1}{x}$ : positif sur $\left]0;\frac12\right[$, négatif sur $\left]\frac12;+\infty\right[$ ;
- $f$ est croissante puis décroissante, avec un **maximum** en $x=\frac12$ valant $f\left(\frac12\right)=-\ln2\approx-0{,}69$.

### Tableau de valeurs (corrigé)

| $x$ | $0{,}25$ | $0{,}5$ | $1$ | $1{,}5$ | $2$ | $2{,}5$ | $3$ | $3{,}5$ | $4$ |
|---|---|---|---|---|---|---|---|---|---|
| $f(x)$ | $-0{,}9$ | $-0{,}7$ | $-1$ | $-1{,}6$ | $-2{,}3$ | $-3{,}1$ | $-3{,}9$ | $-4{,}7$ | $-5{,}6$ |

> **Erreur fréquente.** Diviser une inégalité par $\ln(0{,}325)$ **sans retourner le sens** : un logarithme d'un nombre entre 0 et 1 est négatif. C'est le piège central de la mission.

> **Astuce mémoire de Davy.** Pour les primitives : « le haut est la dérivée du bas → réponse en $\ln(\text{bas})$, coefficient ajusté devant ». Pour les inéquations en puissance : « $\ln$ fait descendre l'exposant, mais gare au signe du logarithme qui divise ».`,
    keyPoint: "∫ u'/u = ln(u) + constante, lorsque u > 0.",
    example: "Une primitive de $(2x+1)/(x^2+x+3)$ est $\\ln(x^2+x+3)$.",
    methodSteps: [
      "Repère le dénominateur u et vérifie u > 0.",
      "Vérifie que le numérateur est u′ ou un multiple de u′.",
      "Écris le logarithme avec le coefficient ajusté et la constante.",
    ],
    timeline: [
      { label: "Repérer", detail: "Le dénominateur u doit être strictement positif." },
      { label: "Comparer", detail: "Le numérateur est-il u′ ou un multiple de u′ ?" },
      { label: "Conclure", detail: "Primitive en ln(u) + constante, coefficient devant." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Explore la courbe du défi type Bac",
      instruction: "Déplace le point : trouve le maximum en x = 1/2, la chute vers −∞ près de 0 et la descente vers −∞ à droite.",
      observation: "La courbe de f(x) = −2x + 1 + ln x monte jusqu'à son sommet (1/2 ; −ln 2 ≈ −0,69) puis redescend sans fin. Contre l'axe des ordonnées, elle plonge vers −∞ : x = 0 est asymptote verticale.",
      formula: "f(x) = -2x + 1 + ln(x)",
      formulaTex: "f(x)=-2x+1+\\ln x",
      rule: { kind: "affine-plus-log", slope: -2, intercept: 1, coefficient: 1 },
      window: { xMin: -0.3, xMax: 4.2, yMin: -6, yMax: 1.5 },
      guides: [
        { kind: "vertical", value: 0.5, label: "x = 1/2" },
        { kind: "horizontal", value: -0.693, label: "y = -ln 2" },
      ],
      marker: { min: 0.05, max: 4, step: 0.05, initial: 0.5 },
    },
    corrections: [
      "Dans le tableau de valeurs de l'exercice type Bac, trois arrondis du PDF sont erronés : f(0,25) vaut −0,9 (et non −3,2), f(1) vaut −1 (et non 1) et f(3) vaut −3,9 (et non −4).",
    ],
    questions: [
      choice("Les primitives de $1/x$ sur $]0;+\\infty[$ sont :", ["$x^2/2+c$", "$\\ln x+c$", "$1/x+c$", "$e^x+c$"], 1, "La dérivée de $\\ln x$ vaut $1/x$.", "Exercice de fixation a, page 6"),
      choice("Une primitive de $(2x+1)/(x^2+x+3)$ est :", ["$\\ln(x^2+x+3)$", "$1/(x^2+x+3)$", "$(2x+1)\\ln x$", "$e^{x^2+x+3}$"], 0, "Le numérateur est la dérivée du dénominateur.", "Exercice de fixation c, page 6"),
      choice("Une primitive de $\\dfrac{2}{-3x+7}$ sur $]-\\infty;7/3[$ est :", ["$-\\frac23\\ln(-3x+7)$", "$\\frac23\\ln(-3x+7)$", "$2\\ln(-3x+7)$", "$-\\frac32\\ln(-3x+7)$"], 0, "Le coefficient est $a/c=2/(-3)$.", "Exercice de fixation b, page 6", 2),
      choice("Une primitive de $\\dfrac{3}{2x-1}$ sur $]1;+\\infty[$ est :", ["$\\frac32\\ln(2x-1)$", "$3\\ln(2x-1)$", "$\\frac23\\ln(2x-1)$", "$\\ln(6x-3)$"], 0, "Le coefficient est $a/c=3/2$.", "Exercice de renforcement 6-b, page 8"),
      choice("Une primitive de $-5+\\dfrac1x$ sur $]0;+\\infty[$ est :", ["$-5x+\\ln x$", "$-5+\\ln x$", "$-5x+1/x$", "$\\ln(-5x)$"], 0, "On intègre terme à terme.", "Exercice de renforcement 6-d, page 8"),
      short("Mission du dépistage : quel est le nombre minimum d'élèves à examiner ?", ["4", "n=4", "quatre"], "$n\\ge\\ln(0{,}02)/\\ln(0{,}325)\\approx3{,}48$, donc $n=4$.", "C-Situation complexe, page 7", 2),
      choice("Pourquoi l'inégalité se retourne-t-elle en divisant par $\\ln(0{,}325)$ ?", ["Parce que $\\ln(0{,}325)<0$", "Parce que $n$ est entier", "Parce que $0{,}325<1$ mais $\\ln$ ne change rien", "Elle ne se retourne pas"], 0, "Le logarithme d'un nombre entre 0 et 1 est strictement négatif.", "C-Situation complexe, page 7", 2),
      short("Défi type Bac : donne $f'(x)$ pour $f(x)=-2x+1+\\ln x$.", ["(-2x+1)/x", "(1-2x)/x", "-2+1/x"], "$f'(x)=-2+\\frac1x=\\frac{-2x+1}{x}$.", "Exercice type Bac, question 2-a, page 9", 2),
      short("En quelle valeur de $x$ le maximum de $f$ est-il atteint ?", ["1/2", "0,5", "0.5"], "$f'$ s'annule en changeant de signe en $x=1/2$.", "Exercice type Bac, question 2-b, pages 9-10"),
      short("Quelle est la valeur exacte de ce maximum ?", ["-ln2", "-ln(2)", "−ln2", "-0,69", "-0.69"], "$f(1/2)=-1+1+\\ln(1/2)=-\\ln2$.", "Exercice type Bac, tableau de variation, page 10", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalANaturalLogPath: LearningPath = {
  id: "terminale-a-natural-logarithm",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 3,
  title: "Fonction logarithme népérien",
  description: "Le cours officiel intégral : définition, propriétés algébriques, limites, variations, équations, inéquations, dérivées composées, primitives, mission du dépistage et défi type Bac.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Utiliser les propriétés de ln",
    "Étudier une fonction logarithmique",
    "Résoudre des équations et inéquations",
  ],
  modules: [{
    id: "terminale-a-natural-logarithm-mastery",
    title: "Maîtriser le logarithme népérien",
    description: "Progression fidèle au document source ; la situation d'apprentissage du dépistage n'apparaît que comme mission finale, en contexte d'évaluation.",
    lessons: builtLevels,
  }],
};
