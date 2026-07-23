import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 04 Fonction exponnentielle.pdf";

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
    id: "exp-definition-properties",
    title: "Définition et notation de la fonction exponentielle",
    summary: "Relier exponentielle et logarithme, puis utiliser leurs identités réciproques.",
    pages: "1-2",
    section: "I-1. Définition et notation",
    durationMinutes: 15,
    xp: 50,
    body: String.raw`## Définition

La fonction **exponentielle népérienne**, notée $\exp$, est la fonction **réciproque** de la fonction logarithme népérien.

**Autre notation.** Pour tout réel $x$, $\exp(x)$ se note également $e^x$ : $\exp(x)=e^x$.

## Conséquences de la définition

| Conséquence | Énoncé |
|---|---|
| Domaine | l'ensemble de définition de $\exp$ est $\mathbb R$ |
| Lien avec $\ln$ | pour $a>0$ et $b$ réel : $\ln(a)=b\iff a=e^b$ |
| Valeurs clés | $e^0=1$ et $e^1=e$ |
| Positivité | pour tout réel $a$ : $e^a>0$ |
| Réciprocité | $\ln(e^a)=a$ pour tout réel $a$ ; $e^{\ln a}=a$ pour $a>0$ |

### Exercice de fixation 1 entièrement rédigé

| Affirmation | Réponse | Pourquoi |
|---|---|---|
| L'ensemble de définition de $x\mapsto e^x$ est $\mathbb R$ | **Vrai** | l'exponentielle accepte tout réel |
| Le nombre $e^{-10}$ est négatif | **Faux** | $e^a>0$ pour tout réel $a$ |
| Le nombre $e^0$ est égal à $0$ | **Faux** | $e^0=1$ |
| Le nombre $e^{\ln(12)}$ est égal à $\ln12$ | **Faux** | $e^{\ln a}=a$, donc il vaut $12$ |
| Le nombre $\ln(e^{51})$ est égal à $51$ | **Vrai** | $\ln(e^a)=a$ |

### Exercice de fixation 2 entièrement rédigé

$$A=\ln(e^8)=8\qquad B=\ln(e^{-5})=-5$$

$$C=e^{\ln3}=3\qquad D=e^{-\ln2}=e^{\ln\frac12}=\frac12$$

> **Erreur fréquente.** $e^{\ln a}$ et $\ln(e^a)$ « s'effacent » mutuellement, mais dans $e^{-\ln2}$ le signe moins passe **dans** le logarithme : $-\ln2=\ln\frac12$, d'où $e^{-\ln2}=\frac12$ et non $-2$.

> **Astuce mémoire de Davy.** « $\exp$ et $\ln$ sont deux miroirs : l'un défait ce que l'autre fait. » Retiens le triangle : $e^0=1$, $e^1=e$, $e^a>0$ toujours — une exponentielle n'est jamais nulle ni négative.`,
    keyPoint: "Pour tout réel x, e^x > 0 ; ln(e^x)=x et e^(ln a)=a pour a>0.",
    example: "$\\ln(e^8)=8$, $e^{\\ln3}=3$ et $e^{-\\ln2}=1/2$.",
    methodSteps: [
      "Repère une composition ln(e^x) ou e^(ln a).",
      "Vérifie a > 0 lorsque nécessaire.",
      "Applique directement l'identité réciproque.",
    ],
    timeline: [
      { label: "Réciproque", detail: "exp défait ln, et ln défait exp." },
      { label: "Positivité", detail: "e^x est strictement positif pour tout réel x." },
      { label: "Valeurs clés", detail: "e⁰ = 1 et e¹ = e." },
    ],
    questions: [
      choice("L'ensemble de définition de $x\\mapsto e^x$ est $\\mathbb R$.", ["Vrai", "Faux"], 0, "L'exponentielle est définie pour tout réel.", "Exercice de fixation 1, page 2"),
      choice("Le nombre $e^{-10}$ est négatif.", ["Vrai", "Faux"], 1, "$e^x$ est toujours strictement positif.", "Exercice de fixation 1, page 2"),
      short("Calcule $\\ln(e^{-5})$.", ["-5"], "$\\ln(e^a)=a$.", "Exercice de fixation 2-B, page 2"),
      short("Calcule $e^{-\\ln2}$.", ["1/2", "0,5", "0.5"], "$e^{-\\ln2}=e^{\\ln(1/2)}=1/2$.", "Exercice de fixation 2-D, page 2"),
      short("Calcule $\\ln(e^{8})$.", ["8"], "$\\ln(e^a)=a$.", "Exercice de fixation 2-A, page 2"),
      choice("Le nombre $e^0$ est égal à 0.", ["Vrai", "Faux"], 1, "$e^0=1$ : une exponentielle ne s'annule jamais.", "Exercice de fixation 1, page 2"),
      choice("Le nombre $e^{\\ln(12)}$ est égal à $\\ln12$.", ["Vrai", "Faux"], 1, "$e^{\\ln a}=a$ : il vaut 12.", "Exercice de fixation 1, page 2"),
    ],
  },
  {
    id: "exp-algebraic-properties",
    title: "Propriétés algébriques de l'exponentielle",
    summary: "Transformer produits, quotients, puissances et inverses d'exponentielles.",
    pages: "2, 7-8",
    section: "I-2. Propriétés algébriques",
    durationMinutes: 20,
    xp: 55,
    body: String.raw`## Les quatre propriétés

Pour tous réels $a$ et $b$, et $r$ un nombre rationnel :

| Propriété | Formule |
|---|---|
| Produit | $e^a\times e^b=e^{a+b}$ |
| Quotient | $\dfrac{e^a}{e^b}=e^{a-b}$ |
| Puissance | $(e^a)^r=e^{a\times r}$ |
| Inverse | $\dfrac1{e^a}=e^{-a}$ |

### Exercice de fixation entièrement rédigé

$$E=e^6\times e^{-4}=e^{6+(-4)}=e^2$$

$$F=(e^{-2})^4=e^{-2\times4}=e^{-8}$$

$$G=\frac{e^4}{e^{-5}}=e^{4-(-5)}=e^{9}$$

### Exercice d'application rédigé (exercice 1)

$$A=\frac{e^{5x}\times e^{-2x}}{e^{-x+2}}=\frac{e^{5x-2x}}{e^{-x+2}}=e^{3x-(-x+2)}=e^{4x-2}$$

### Exercice de renforcement rédigé (exercice 7)

**a)** $(e^{2x})^2\times(e^{-x})^2=e^{4x}\times e^{-2x}=e^{2x}$

**b)** En utilisant l'identité $a^2-b^2=(a-b)(a+b)$ :

$$(e^x+e^{-x})^2-(e^x-e^{-x})^2=(2e^{-x})(2e^x)=4e^{-x}e^x=4$$

> **Erreur fréquente.** $e^a\times e^b$ n'est pas $e^{ab}$ : le produit **additionne** les exposants. La multiplication des exposants n'apparaît que pour la puissance $(e^a)^r$.

> **Astuce mémoire de Davy.** « L'exponentielle monte d'un étage : produit → somme d'exposants, quotient → différence, puissance → produit. » C'est exactement le miroir des propriétés de $\ln$.`,
    keyPoint: "Produit → addition des exposants ; quotient → soustraction.",
    example: "$e^6e^{-4}=e^2$, $(e^{-2})^4=e^{-8}$ et $e^4/e^{-5}=e^9$.",
    methodSteps: [
      "Identifie l'opération entre les exponentielles.",
      "Transforme les exposants.",
      "Réduis l'expression finale sous la forme e^k.",
    ],
    timeline: [
      { label: "Identifier", detail: "Produit, quotient, puissance ou inverse ?" },
      { label: "Transformer", detail: "Opérer sur les exposants, pas sur les exponentielles." },
      { label: "Réduire", detail: "Tout regrouper sous une seule écriture e^k." },
    ],
    questions: [
      choice("Écris $e^6e^{-4}$ sous la forme $e^k$.", ["$e^{-24}$", "$e^{10}$", "$e^2$", "$e^{-2}$"], 2, "$6+(-4)=2$.", "Exercice de fixation E, page 2"),
      choice("Écris $(e^{-2})^4$ sous la forme $e^k$.", ["$e^{-8}$", "$e^8$", "$e^{-6}$", "$e^2$"], 0, "$-2\\times4=-8$.", "Exercice de fixation F, page 2"),
      choice("Écris $e^4/e^{-5}$ sous la forme $e^k$.", ["$e^{-1}$", "$e^9$", "$e^{-9}$", "$e^{20}$"], 1, "$4-(-5)=9$.", "Exercice de fixation G, page 2"),
      short("Simplifie $A=\\dfrac{e^{5x}\\times e^{-2x}}{e^{-x+2}}$ sous la forme $e^k$.", ["e^(4x-2)", "e^{4x-2}", "e4x-2"], "$5x-2x-(-x+2)=4x-2$.", "Exercice d'application 1, page 7", 2),
      short("Calcule $(e^x+e^{-x})^2-(e^x-e^{-x})^2$.", ["4"], "L'identité remarquable donne $(2e^{-x})(2e^x)=4$.", "Exercice de renforcement 7-b, page 9", 2),
      choice("Pour $x\\neq0$, $\\dfrac{e^{2x}-e^x}{e^x+1}$ est égal à :", ["$\\dfrac{e^x-1}{1-e^{-x}}$", "$\\dfrac{e^x-1}{1+e^{-x}}$", "$\\dfrac{e^x-e^{-x}}{1-e^{-x}}$"], 1, "En factorisant par $e^x$ en haut et en bas : $\\frac{e^x(e^x-1)}{e^x(1+e^{-x})}$.", "Exercice de renforcement 6, affirmation 1, page 8", 2),
    ],
  },
  {
    id: "exp-limits-variations",
    title: "Limites de référence de l'exponentielle",
    summary: "Utiliser les limites de e^x, e^x/x et xe^x aux infinis.",
    pages: "2-3, 8, 10",
    section: "II-1. Limites de référence",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Les quatre limites de référence

| Limite | Valeur |
|---|---|
| $\displaystyle\lim_{x\to+\infty}e^x$ | $+\infty$ |
| $\displaystyle\lim_{x\to-\infty}e^x$ | $0$ |
| $\displaystyle\lim_{x\to+\infty}\frac{e^x}{x}$ | $+\infty$ |
| $\displaystyle\lim_{x\to-\infty}xe^x$ | $0$ |

À $+\infty$, l'exponentielle **domine** toute expression affine ou polynomiale ; à $-\infty$, elle s'écrase vers $0$ plus vite que $x$ ne grandit.

### Exercice de fixation entièrement rédigé

**a)** $\displaystyle\lim_{x\to-\infty}(e^x+3)=3$ car $\lim_{x\to-\infty}e^x=0$.

**b)** $\displaystyle\lim_{x\to-\infty}2xe^x=2\times0=0$ car $\lim_{x\to-\infty}xe^x=0$.

**c)** $\displaystyle\lim_{x\to+\infty}(2x-1-e^x)=\lim_{x\to+\infty}x\left(2-\frac1x-\frac{e^x}{x}\right)=-\infty$ car $\lim_{x\to+\infty}\left(2-\frac1x-\frac{e^x}{x}\right)=-\infty$.

### Exercice d'application rédigé (exercice 4)

**a)** $\displaystyle\lim_{x\to+\infty}\left[(2x+1)e^x+\frac1x\right]=+\infty$ car $(2x+1)e^x\to+\infty$ et $\frac1x\to0$.

**b)** $\displaystyle\lim_{x\to0}\left(2\times\frac{e^x-1}{x}+x^2\right)=2$ car le corrigé utilise la limite admise $\lim_{x\to0}\frac{e^x-1}{x}=1$.

### Exercice d'approfondissement rédigé (exercice 9, série A1)

**a)** Pour $f(x)=\dfrac{e^x+1}{e^x+2}$ : en $+\infty$, on factorise par $e^x$ : $f(x)=\dfrac{1+e^{-x}}{1+2e^{-x}}\to1$ ; en $-\infty$, $e^x\to0$ donne $f(x)\to\dfrac{0+1}{0+2}=\dfrac12$.

**b)** Pour $f(x)=\dfrac{xe^x}{x+1}$ : en $+\infty$, $f(x)=\dfrac{e^x}{1+\frac1x}\to+\infty$ ; en $-\infty$, $xe^x\to0$ et $x+1\to-\infty$, donc $f(x)\to0$.

> **Erreur fréquente.** $2x-1-e^x$ en $+\infty$ est une forme indéterminée $\infty-\infty$ : ne conclus pas terme à terme. Factorise par $x$ (ou par $e^x$) pour faire apparaître $\dfrac{e^x}{x}\to+\infty$.

> **Astuce mémoire de Davy.** « À $+\infty$, l'exponentielle gagne toujours ; à $-\infty$, elle disparaît. » Face à un quotient d'exponentielles, factorise par $e^x$ en haut et en bas : les $e^{-x}$ restants s'évanouissent.`,
    keyPoint: "À −∞, e^x → 0 ; à +∞, e^x domine x.",
    example: "$\\lim_{x\\to-\\infty}(e^x+3)=3$ et $\\lim_{x\\to-\\infty}2xe^x=0$.",
    methodSteps: [
      "Repère la limite de référence.",
      "Factorise par x ou e^x si nécessaire.",
      "Combine les facteurs et conclus.",
    ],
    timeline: [
      { label: "Référence", detail: "Choisir la bonne limite parmi les quatre." },
      { label: "Factorisation", detail: "Par x ou par e^x pour lever l'indétermination." },
      { label: "Conclusion", detail: "Combiner les limites et rédiger." },
    ],
    questions: [
      short("Calcule $\\lim_{x\\to-\\infty}(e^x+3)$.", ["3"], "$e^x\\to0$, donc la somme tend vers 3.", "Exercice de fixation a, page 3"),
      short("Calcule $\\lim_{x\\to-\\infty}2xe^x$.", ["0"], "$xe^x\\to0$ à $-\\infty$.", "Exercice de fixation b, page 3"),
      short("Calcule $\\lim_{x\\to+\\infty}(2x-1-e^x)$.", ["-∞", "-infini"], "$e^x$ domine le terme affine et porte un signe négatif.", "Exercice de fixation c, page 3", 2),
      choice("La limite de $e^x-2x$ en $+\\infty$ est :", ["$+\\infty$", "$-\\infty$", "$0$"], 0, "L'exponentielle domine le terme affine.", "Exercice de renforcement 6, affirmation 3, page 8"),
      short("Calcule $\\lim_{x\\to+\\infty}\\left[(2x+1)e^x+\\frac1x\\right]$.", ["+∞", "+infini"], "Le produit $(2x+1)e^x$ tend vers $+\\infty$ et $1/x$ vers 0.", "Exercice d'application 4-a, page 8"),
      short("Calcule $\\lim_{x\\to0}\\left(2\\times\\frac{e^x-1}{x}+x^2\\right)$.", ["2"], "La limite admise $\\frac{e^x-1}{x}\\to1$ donne $2\\times1+0=2$.", "Exercice d'application 4-b, page 8", 2),
      short("Pour $f(x)=\\frac{e^x+1}{e^x+2}$, calcule la limite en $-\\infty$.", ["1/2", "0,5", "0.5"], "$e^x\\to0$ donne $\\frac{0+1}{0+2}=\\frac12$.", "Exercice d'approfondissement 9-a, page 10", 2),
    ],
  },
  {
    id: "exp-derivative-variation",
    title: "Dérivée, variations et courbe de l'exponentielle",
    summary: "Montrer que l'exponentielle est strictement croissante et reconnaître son asymptote.",
    pages: "3-4",
    section: "II-2 et II-3. Dérivée, variations, représentation",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Dérivée et sens de variation

La fonction exponentielle népérienne est dérivable sur $\mathbb R$ et, pour tout réel $x$ :

$$(e^x)'=e^x\qquad\text{avec}\qquad e^x>0$$

La fonction exponentielle est donc **strictement croissante** sur $\mathbb R$.

### Tableau de variation

| $x$ | $-\infty$ | | $+\infty$ |
|---|---|---|---|
| $(e^x)'$ | | $+$ | |
| $e^x$ | $0$ | $\nearrow$ | $+\infty$ |

### Représentation graphique

Comme $\displaystyle\lim_{x\to-\infty}e^x=0$, la droite d'équation $y=0$ — l'axe $(OI)$ — est **asymptote horizontale** à la courbe en $-\infty$. La courbe passe par $(0;1)$ et par $(1;e)$ avec $e\approx2{,}718$.

### Exercice de fixation entièrement rédigé

Soit $f(x)=2x+e^x$ sur $\mathbb R$.

**1)** Pour tout réel $x$ : $f'(x)=2+e^x$.

**2)** Pour tout réel $x$, $f'(x)>0$ : la fonction $f$ est **strictement croissante** sur $\mathbb R$.

> **Erreur fréquente.** L'asymptote $y=0$ ne vaut qu'en $-\infty$ : à droite, la courbe s'envole vers $+\infty$ sans aucune asymptote. Et ne confonds pas l'asymptote horizontale $y=0$ de $e^x$ avec l'asymptote verticale $x=0$ de $\ln x$.

> **Astuce mémoire de Davy.** « L'exponentielle est sa propre dérivée. » C'est la seule fonction du programme qui a ce privilège : dériver $e^x$ ne coûte rien, et comme $e^x>0$, toute somme $ax+e^x$ avec $a\ge0$ est automatiquement croissante.`,
    keyPoint: "(e^x)' = e^x > 0 : exp est strictement croissante sur ℝ.",
    example: "$f(x)=2x+e^x$ vérifie $f'(x)=2+e^x>0$.",
    methodSteps: [
      "Dérive chaque terme.",
      "Utilise la positivité de e^x.",
      "Conclus sur les variations et l'asymptote si demandée.",
    ],
    timeline: [
      { label: "Dérivée", detail: "(e^x)' = e^x : elle est sa propre dérivée." },
      { label: "Signe", detail: "e^x > 0 pour tout réel : croissance stricte." },
      { label: "Asymptote", detail: "y = 0 en −∞ ; envol vers +∞ à droite." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Parcours la courbe de l'exponentielle",
      instruction: "Déplace le point : repère le passage par (0 ; 1), le point (1 ; e) et l'écrasement sur l'axe des abscisses à gauche.",
      observation: "La courbe monte sans cesse : exp est strictement croissante. Elle passe par (0 ; 1) et (1 ; e ≈ 2,72). Vers −∞, elle se colle à l'axe des abscisses : y = 0 est asymptote horizontale.",
      formula: "f(x) = e^x",
      formulaTex: "f(x)=e^{x}",
      rule: { kind: "affine-plus-exp", slope: 0, intercept: 0, coefficient: 1, rate: 1 },
      window: { xMin: -7, xMax: 3, yMin: -1, yMax: 7 },
      guides: [
        { kind: "horizontal", value: 2.718, label: "y = e" },
        { kind: "vertical", value: 1, label: "x = 1" },
      ],
      marker: { min: -7, max: 3, step: 0.05, initial: 0 },
    },
    questions: [
      choice("Quelle est la dérivée de $f(x)=2x+e^x$ ?", ["$2+e^x$", "$2x+e^x$", "$2+xe^{x-1}$", "$e^x$"], 0, "La dérivée de $2x$ est 2 et celle de $e^x$ est $e^x$.", "Exercice de fixation, question 1, page 3"),
      choice("Quel est le sens de variation de cette fonction ?", ["Strictement décroissante", "Strictement croissante", "Constante", "Variable selon x"], 1, "$2+e^x>0$ sur $\\mathbb R$.", "Exercice de fixation, question 2, page 3"),
      choice("Quelle droite est asymptote à $y=e^x$ en $-\\infty$ ?", ["$x=0$", "$y=1$", "$y=0$", "$y=x$"], 2, "$e^x\\to0$ lorsque $x\\to-\\infty$.", "Représentation graphique, page 4"),
      choice("Par quels points remarquables passe la courbe de $e^x$ ?", ["$(0;0)$ et $(1;1)$", "$(0;1)$ et $(1;e)$", "$(1;0)$ et $(e;1)$", "$(0;e)$ et $(1;1)$"], 1, "$e^0=1$ et $e^1=e$.", "Représentation graphique, page 4"),
      choice("Quelle est la dérivée de $f(x)=x+2-e^x$ ?", ["$1-e^x$", "$1+e^x$", "$x-e^x$", "$2-e^x$"], 0, "On dérive terme à terme.", "Exercice de renforcement 3-b, page 8"),
    ],
  },
  {
    id: "exp-equations-inequalities",
    title: "Équations exponentielles",
    summary: "Résoudre une égalité d'exponentielles ou une équation polynomiale en e^x.",
    pages: "4-5, 7-8",
    section: "III-1 et III-2. Propriété et équations",
    durationMinutes: 25,
    xp: 75,
    body: String.raw`## Propriété fondamentale

Pour tous nombres réels $a$ et $b$ :

| Relation | Équivaut à |
|---|---|
| $e^a=e^b$ | $a=b$ |
| $e^a<e^b$ | $a<b$ |
| $e^a\le e^b$ | $a\le b$ |
| $e^a>e^b$ | $a>b$ |
| $e^a\ge e^b$ | $a\ge b$ |

Contrairement au logarithme, l'ensemble de validité est toujours $V=\mathbb R$ : une exponentielle est définie partout.

## Les trois exemples officiels entièrement rédigés

### 1) $e^{2x-1}=e^{x+5}$

$$e^{2x-1}=e^{x+5}\iff2x-1=x+5\iff x=6\qquad S_{\mathbb R}=\{6\}$$

### 2) $e^{x-2}=5$

$$e^{x-2}=5\iff e^{x-2}=e^{\ln5}\iff x-2=\ln5\iff x=2+\ln5\qquad S_{\mathbb R}=\{2+\ln5\}$$

### 3) $e^{2x}+e^x-6=0$

On pose $X=e^x$, donc $X>0$. L'équation devient :

$$X^2+X-6=0\qquad\Delta=25\qquad X=-3\ \text{ou}\ X=2$$

$e^x=-3$ est **impossible** car $e^x>0$ pour tout réel $x$. Reste :

$$e^x=2\iff x=\ln2\qquad S_{\mathbb R}=\{\ln2\}$$

### Exercice d'application rédigé (exercice 2, équation E)

$$\frac{x(e^x-1)}{x^2+1}=0\iff x(e^x-1)=0\iff x=0\ \text{ou}\ e^x=1\iff x=0\qquad S_{\mathbb R}=\{0\}$$

Le dénominateur $x^2+1$ ne s'annule jamais, et $e^x=1$ redonne exactement $x=0$.

### Exercice de renforcement rédigé (exercice 6, affirmation 2)

$$e^{x^2-x-1}=e^{3x-4}\iff x^2-x-1=3x-4\iff x^2-4x+3=0\iff x=1\ \text{ou}\ x=3$$

> **Erreur fréquente.** Après le changement d'inconnue $X=e^x$, toute racine négative ou nulle doit être **éliminée** : $e^x=-3$ n'a aucune solution. Oublier ce tri fait apparaître de fausses solutions.

> **Astuce mémoire de Davy.** « Exponentielles égales, exposants égaux. » Et si un nombre isolé apparaît (comme 5), écris-le $e^{\ln5}$ pour retrouver deux exponentielles à comparer.`,
    keyPoint: "Poser X=e^x impose toujours X>0.",
    example: "$e^{2x-1}=e^{x+5}$ donne $x=6$.",
    methodSteps: [
      "Mets les deux membres sous forme exponentielle ou pose X = e^x.",
      "Résous l'équation obtenue.",
      "Élimine toute valeur X ≤ 0 puis reviens à x.",
    ],
    timeline: [
      { label: "Forme", detail: "Deux exponentielles face à face, ou trinôme en e^x." },
      { label: "Résolution", detail: "Comparer les exposants ou résoudre en X." },
      { label: "Tri", detail: "Écarter X ≤ 0 puis revenir à x avec ln." },
    ],
    questions: [
      short("Résous $e^{2x-1}=e^{x+5}$.", ["6", "{6}", "x=6"], "L'injectivité donne $2x-1=x+5$.", "Exemple officiel 1, pages 4-5"),
      choice("Résous $e^{x-2}=5$.", ["$x=\\ln5-2$", "$x=2+\\ln5$", "$x=5e^2$", "$x=7$"], 1, "$x-2=\\ln5$.", "Exemple officiel 2, pages 4-5"),
      choice("Résous $e^{2x}+e^x-6=0$.", ["$x=\\ln2$", "$x=\\ln3$", "$x=2$", "$x=-3$"], 0, "Avec $X=e^x>0$, $X^2+X-6=0$ ne conserve que $X=2$.", "Exemple officiel 3, page 5", 2),
      short("Résous $\\dfrac{x(e^x-1)}{x^2+1}=0$.", ["0", "{0}", "x=0"], "$x=0$ ou $e^x=1$, qui redonne $x=0$.", "Exercice d'application 2, page 7", 2),
      choice("L'équation $e^{x^2-x-1}=e^{3x-4}$ a pour solutions :", ["$x=1$ et $x=-3$", "$x=-1$ et $x=3$", "$x=1$ et $x=3$"], 2, "$x^2-4x+3=0$ a pour racines 1 et 3.", "Exercice de renforcement 6, affirmation 2, page 8", 2),
    ],
  },
  {
    id: "exp-inequalities",
    title: "Inéquations exponentielles",
    summary: "Comparer des exponentielles et résoudre une inéquation polynomiale en e^x.",
    pages: "5, 7, 9-10",
    section: "III-3. Inéquations",
    durationMinutes: 25,
    xp: 75,
    body: String.raw`## Les deux exemples officiels entièrement rédigés

### 1) $e^{2x-1}<8$

L'ensemble de validité est $V=\mathbb R$.

$$e^{2x-1}<8\iff\ln(e^{2x-1})<\ln8\iff2x-1<\ln8\iff x<\frac{1+\ln8}{2}$$

$$S_{\mathbb R}=\left]-\infty;\frac{1+\ln8}{2}\right[$$

### 2) $e^{2x}-5e^x+6\ge0$

On pose $X=e^x$, donc $X>0$ :

$$X^2-5X+6\ge0\qquad\Delta=1\qquad X=2\ \text{ou}\ X=3$$

| $X$ | $-\infty$ | | $2$ | | $3$ | | $+\infty$ |
|---|---|---|---|---|---|---|---|
| $X^2-5X+6$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |

$$e^x\le2\ \text{ou}\ e^x\ge3\iff x\le\ln2\ \text{ou}\ x\ge\ln3$$

$$S_{\mathbb R}=\;]-\infty;\ln2]\cup[\ln3;+\infty[$$

### Exercice d'application rédigé (exercice 2, inéquation I)

$$\frac{x^2+x-2}{e^{2x}-1}\ge0$$

Le numérateur s'annule en $-2$ et $1$ ; le dénominateur $e^{2x}-1$ est négatif pour $x<0$, nul en $0$, positif pour $x>0$ :

| $x$ | $-\infty$ | $-2$ | | $0$ | | $1$ | $+\infty$ |
|---|---|---|---|---|---|---|---|
| $x^2+x-2$ | $+$ | $0$ | $-$ | $\|$ | $-$ | $0$ | $+$ |
| $e^{2x}-1$ | $-$ | | $-$ | $\|$ | $+$ | | $+$ |
| quotient | $-$ | $0$ | $+$ | $\|$ | $-$ | $0$ | $+$ |

$$S_{\mathbb R}=[-2;0[\;\cup\;[1;+\infty[$$

### Exercice de renforcement rédigé (exercice 8)

Signe de $B=e^{2x}+e^x-2$ : avec $X=e^x>0$, les racines de $X^2+X-2$ sont $-2$ (à écarter) et $1$. Donc $B>0\iff e^x>1\iff x>0$, $B$ s'annule en $x=0$ et $B<0$ pour $x<0$.

Signe de $C=e^x-2e^{-x}+1$ : en multipliant par $e^x>0$, $C=\dfrac{e^{2x}+e^x-2}{e^x}$ a **le même signe que $B$**.

> **Erreur fréquente.** Le dénominateur $e^{2x}-1$ n'est pas toujours positif : il s'annule en $0$ et change de signe. Seule l'exponentielle seule ($e^x$) est strictement positive partout.

> **Astuce mémoire de Davy.** « L'exponentielle conserve l'ordre, comme ln — jamais de retournement. » Trinôme en $e^x$ ? Pose $X>0$, tableau de signe, retour à $x$ par $\ln$ ; et jette sans regret toute racine négative.`,
    keyPoint: "L'exponentielle conserve l'ordre et reste strictement positive.",
    example: "$e^{2x}-5e^x+6\\ge0$ donne $x\\le\\ln2$ ou $x\\ge\\ln3$.",
    methodSteps: [
      "Pose X = e^x > 0 si l'expression est quadratique.",
      "Résous l'inéquation en X.",
      "Traduis les intervalles retenus en intervalles de x.",
    ],
    timeline: [
      { label: "Changement", detail: "X = e^x avec X > 0 obligatoire." },
      { label: "Signe", detail: "Tableau de signe du trinôme en X." },
      { label: "Retour", detail: "Traduire les bornes avec ln." },
    ],
    corrections: [
      "Dans la solution officielle de l'inéquation 2, la première ligne recopie e²ˣ − 5eˣ − 6 ≥ 0 au lieu de e²ˣ − 5eˣ + 6 ≥ 0 ; les calculs traitent bien X² − 5X + 6 conformément à l'énoncé.",
      "Pour le signe de B (exercice 8), le PDF écrit B > 0 sur [0 ; +∞[ et B < 0 sur ]−∞ ; 0] ; or B s'annule en 0 : il faut lire des inégalités strictes de part et d'autre de 0.",
    ],
    questions: [
      choice("Résous $e^{2x-1}<8$.", ["$x<(1+\\ln8)/2$", "$x>\\ln8$", "$x<8$", "$x>(1+\\ln8)/2$"], 0, "On prend le logarithme puis on isole $x$.", "Exemple officiel 1, page 5"),
      choice("Résous $e^{2x}-5e^x+6\\ge0$.", ["$[\\ln2;\\ln3]$", "$]-\\infty;\\ln2]\\cup[\\ln3;+\\infty[$", "$]0;2]\\cup[3;+\\infty[$", "$]2;3[$"], 1, "Le trinôme $(X-2)(X-3)$ est positif à l'extérieur des racines.", "Exemple officiel 2, page 5", 2),
      choice("La solution de $\\dfrac{x^2+x-2}{e^{2x}-1}\\ge0$ est :", ["$[-2;0[\\cup[1;+\\infty[$", "$[-2;1]$", "$]-\\infty;-2]\\cup[1;+\\infty[$", "$]0;1]$"], 0, "Tableau de signe : numérateur nul en −2 et 1, dénominateur nul en 0.", "Exercice d'application 2, page 7", 2),
      choice("Le signe de $B=e^{2x}+e^x-2$ est :", ["$B>0$ pour $x>0$ et $B<0$ pour $x<0$", "$B>0$ pour tout réel", "$B<0$ pour $x>0$", "$B>0$ pour $x<0$"], 0, "$B>0\\iff e^x>1\\iff x>0$, et $B(0)=0$.", "Exercice de renforcement 8, page 9", 2),
    ],
  },
  {
    id: "exp-composite-derivatives",
    title: "Dérivée d'une exponentielle composée",
    summary: "Dériver e^(u(x)) puis combiner avec les règles de somme et de produit.",
    pages: "5-6, 8-9, 12-13",
    section: "IV-1. Dérivée",
    durationMinutes: 20,
    xp: 75,
    body: String.raw`## Propriété

Si $u$ est une fonction dérivable sur un intervalle $K$, alors $e^u$ est dérivable sur $K$ et :

$$\big(e^u\big)'=u'e^u$$

### Exercice de fixation entièrement rédigé

**1)** $f(x)=e^{-4x+3}$ : $f'(x)=-4e^{-4x+3}$.

**2)** $f(x)=e^{x+3}-2x+5$ : $f'(x)=e^{x+3}-2$.

**3)** $f(x)=(2x+1)e^x$ : règle du produit :

$$f'(x)=2e^x+(2x+1)e^x=(2x+3)e^x$$

### Exercice de renforcement rédigé (exercice 3)

| Fonction | Dérivée |
|---|---|
| $e^{-2x+1}$ | $-2e^{-2x+1}$ |
| $x+2-e^x$ | $1-e^x$ |
| $(1-x)e^x$ | $-e^x+(1-x)e^x=-xe^x$ |

### Exercice d'approfondissement rédigé (exercice 12, question 2-a)

Pour $f(x)=(-2x+3)e^x$ sur $]-\infty;2]$ :

$$f'(x)=-2e^x+(-2x+3)e^x=(-2x+3-2)e^x=(-2x+1)e^x$$

Le signe de $f'(x)$ est celui de $-2x+1$ : $f$ est croissante sur $\left]-\infty;\frac12\right]$ puis décroissante — son maximum vaut $f\left(\frac12\right)=2e^{1/2}\approx3{,}3$.

> **Erreur fréquente.** Pour un produit $(2x+1)e^x$, il faut la **règle du produit** : dériver seulement l'exponentielle (ou seulement la parenthèse) oublie un terme. Et le facteur $u'$ de $(e^u)'=u'e^u$ n'est pas optionnel.

> **Astuce mémoire de Davy.** « L'exposant descend en facteur — dérivé. » $(e^u)'=u'e^u$ : recopie l'exponentielle telle quelle, multiplie par la dérivée de l'exposant. Pour un produit, pense « premier dérivé × second + premier × second dérivé », puis factorise par $e^x$.`,
    keyPoint: "(e^u)' = u'e^u.",
    example: "Si $f(x)=e^{-4x+3}$, alors $f'(x)=-4e^{-4x+3}$.",
    methodSteps: [
      "Identifie l'exposant u(x).",
      "Calcule u'(x).",
      "Multiplie par e^(u(x)) et applique les autres règles éventuelles.",
    ],
    timeline: [
      { label: "Exposant", detail: "Repérer u(x) dans e^(u(x))." },
      { label: "Dérivée", detail: "Calculer u′(x) séparément." },
      { label: "Assembler", detail: "u′·e^u, puis règle du produit si besoin." },
    ],
    questions: [
      choice("Dérive $e^{-4x+3}$.", ["$e^{-4x+3}$", "$-4e^{-4x+3}$", "$(-4x+3)e^{-4x+3}$", "$4e^{-4x+3}$"], 1, "La dérivée de l'exposant est $-4$.", "Exercice de fixation 1, page 6"),
      choice("Dérive $(2x+1)e^x$.", ["$(2x+1)e^x$", "$(2x+2)e^x$", "$(2x+3)e^x$", "$2e^x$"], 2, "$2e^x+(2x+1)e^x=(2x+3)e^x$.", "Exercice de fixation 3, page 6", 2),
      choice("Dérive $(1-x)e^x$.", ["$-xe^x$", "$-e^x$", "$(1-x)e^x$", "$(2-x)e^x$"], 0, "$-e^x+(1-x)e^x=-xe^x$.", "Exercice de renforcement 3-c, page 8", 2),
      choice("La dérivée de $f(x)=xe^{-2x}$ est :", ["$2xe^{-2x}$", "$(2x-1)e^{-2x}$", "$(1-2x)e^{-2x}$"], 2, "$e^{-2x}+x(-2)e^{-2x}=(1-2x)e^{-2x}$.", "Exercice de renforcement 6, affirmation 4, page 9", 2),
      short("Donne la dérivée de $f(x)=(-2x+3)e^x$.", ["(-2x+1)e^x", "(-2x+1)ex", "(1-2x)e^x"], "$-2e^x+(-2x+3)e^x=(-2x+1)e^x$.", "Exercice d'approfondissement 12, question 2-a, pages 12-13", 2),
    ],
  },
  {
    id: "exp-primitives-a1",
    title: "Primitives exponentielles et mission publicitaire",
    summary: "Déterminer les primitives de u'e^u (série A1) et résoudre la situation complexe de la campagne publicitaire.",
    pages: "6-7, 8, 10",
    section: "IV-2. Primitives (Terminale A1) et C-Situation complexe",
    durationMinutes: 30,
    xp: 80,
    kind: "challenge",
    body: String.raw`## Primitives (Terminale A1 uniquement)

Si $u$ est une fonction dérivable sur un intervalle $K$, alors la fonction $u'e^u$ a pour primitives sur $K$ les fonctions $e^u+\alpha$, avec $\alpha\in\mathbb R$.

### Point méthode

| Fonction | Primitives |
|---|---|
| $f:x\mapsto e^x$ | $F:x\mapsto e^x+k$, $k\in\mathbb R$ |
| $f:x\mapsto e^{ax+b}$, $a\neq0$ | $F:x\mapsto\dfrac1a e^{ax+b}+k$, $k\in\mathbb R$ |
| $f:x\mapsto u'(x)e^{u(x)}$ | $F:x\mapsto e^{u(x)}+k$, $k\in\mathbb R$ |

### Exercice de fixation entièrement rédigé

**a)** $f(x)=e^x$ : $F(x)=e^x+\alpha$.

**b)** $f(x)=e^{-3x+7}$ : $F(x)=-\dfrac13e^{-3x+7}+\alpha$.

**c)** $f(x)=xe^{x^2}$ : avec $u(x)=x^2$, $u'(x)=2x$, on a $f(x)=\dfrac12u'(x)e^{u(x)}$, donc $F(x)=\dfrac12e^{x^2}+\alpha$.

### Exercice de renforcement rédigé (exercice 10)

**a)** $f(x)=e^{3x}-e^{-\frac12x}+5$ : $F(x)=\dfrac13e^{3x}+2e^{-\frac12x}+5x$.

**b)** $f(x)=\dfrac{e^{2x}}{1+e^{2x}}$ : le numérateur est $\dfrac12$ de la dérivée du dénominateur, donc $F(x)=\dfrac12\ln(1+e^{2x})$ — les primitives en $\dfrac{u'}{u}$ de la leçon 03 reviennent !

**c)** $f(x)=(2x-3)e^{-x^2+3x+1}$ : avec $u(x)=-x^2+3x+1$, $u'(x)=-2x+3$, donc $f=-u'e^u$ et $F(x)=-e^{-x^2+3x+1}$.

## Mission finale — la campagne publicitaire (situation complexe)

La proportion de la population informée après $t$ jours de publicité est $P(t)=1-e^{-0{,}21t}$. Le magasin arrête la publicité quand $90\,\%$ de la population est informée. Combien de jours faut-il ?

On résout $1-e^{-0{,}21t}=\dfrac{90}{100}$ :

$$e^{-0{,}21t}=0{,}1\iff-0{,}21t=\ln(0{,}1)\iff t=\frac{\ln(0{,}1)}{-0{,}21}\approx10{,}96$$

Comme $t$ est un nombre entier de jours, on prend $t=11$ : **le magasin fera la publicité pendant 11 jours**.

> **Erreur fréquente.** Pour la primitive de $e^{ax+b}$, le coefficient est $\dfrac1a$ — pas $a$. Vérifie en dérivant ta réponse : tu dois retomber exactement sur la fonction de départ.

> **Astuce mémoire de Davy.** « Primitive d'exponentielle : recopie l'exponentielle, divise par la dérivée de l'exposant. » Et pour la mission : isole l'exponentielle, prends le logarithme, garde un œil sur le signe du coefficient de $t$.`,
    keyPoint: "∫u'e^u = e^u + constante.",
    example: "Les primitives de $e^{-3x+7}$ sont $-\\frac13e^{-3x+7}+\\alpha$.",
    methodSteps: [
      "Identifie u et u'.",
      "Ajuste le coefficient pour obtenir exactement u'e^u.",
      "Écris e^u avec la constante d'intégration.",
    ],
    timeline: [
      { label: "Identifier", detail: "Repérer u dans l'exposant et calculer u′." },
      { label: "Ajuster", detail: "Compenser le coefficient manquant devant e^u." },
      { label: "Vérifier", detail: "Dériver la primitive pour retrouver f." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La campagne publicitaire sature vers 100 %",
      instruction: "Déplace t, le nombre de jours : quand la courbe P(t) = 1 − e^(−0,21t) franchit-elle le seuil 0,9 ?",
      observation: "La proportion informée grimpe vite puis sature vers 1. Elle franchit y = 0,9 en t ≈ 10,96 : il faut 11 jours entiers de publicité pour dépasser 90 % de la population.",
      formula: "P(t) = 1 - e^(-0,21t)",
      formulaTex: "P(t)=1-e^{-0{,}21t}",
      rule: { kind: "affine-plus-exp", slope: 0, intercept: 1, coefficient: -1, rate: -0.21 },
      window: { xMin: -1, xMax: 26, yMin: -0.1, yMax: 1.15 },
      guides: [
        { kind: "horizontal", value: 0.9, label: "y = 0,9" },
        { kind: "vertical", value: 10.96, label: "t ≈ 10,96" },
      ],
      marker: { min: 0, max: 25, step: 0.25, initial: 5 },
    },
    questions: [
      choice("Une primitive de $e^x$ est :", ["$xe^x$", "$e^x$", "$\\ln x$", "$e^{x+1}$ uniquement"], 1, "La dérivée de $e^x$ est elle-même.", "Exercice de fixation a, page 6"),
      choice("Une primitive de $e^{-3x+7}$ est :", ["$-3e^{-3x+7}$", "$-\\frac13e^{-3x+7}$", "$\\frac13e^{-3x+7}$", "$e^{-3x+7}$"], 1, "Le facteur $1/(-3)$ compense la dérivée de l'exposant.", "Exercice de fixation b, page 6"),
      choice("Une primitive de $xe^{x^2}$ est :", ["$e^{x^2}$", "$\\frac12e^{x^2}$", "$x^2e^{x^2}$", "$2e^{x^2}$"], 1, "$u=x^2$ et $u'=2x$, donc $xe^{x^2}=\\frac12u'e^u$.", "Exercice de fixation c, page 6", 2),
      choice("Une primitive de $e^{4x}$ est :", ["$4e^{4x}$", "$\\frac14e^{4x}$", "$e^{4x}$", "$\\frac14e^{5x}$"], 1, "Le coefficient $1/4$ compense la dérivée de l'exposant.", "Exercice d'application 5-a, page 8"),
      choice("Une primitive de $\\dfrac{e^{2x}}{1+e^{2x}}$ est :", ["$\\frac12\\ln(1+e^{2x})$", "$\\ln(1+e^{2x})$", "$\\frac{e^{2x}}{2}$", "$\\frac12e^{2x}$"], 0, "C'est une forme $\\frac12\\cdot\\frac{u'}{u}$ avec $u=1+e^{2x}$.", "Exercice de renforcement 10-b, page 10", 2),
      choice("Une primitive de $(2x-3)e^{-x^2+3x+1}$ est :", ["$e^{-x^2+3x+1}$", "$-e^{-x^2+3x+1}$", "$(x^2-3x)e^{-x^2+3x+1}$", "$\\frac12e^{-x^2+3x+1}$"], 1, "$u'=-2x+3$, donc $f=-u'e^u$.", "Exercice de renforcement 10-c, page 10", 2),
      short("Mission publicitaire : après combien de jours entiers la campagne peut-elle s'arrêter ?", ["11", "11 jours", "onze"], "$t=\\ln(0{,}1)/(-0{,}21)\\approx10{,}96$, donc 11 jours entiers.", "C-Situation complexe, pages 6-7", 2),
      short("Donne la valeur exacte de $t$ solution de $e^{-0{,}21t}=0{,}1$.", ["ln(0,1)/(-0,21)", "ln(0.1)/(-0.21)", "-ln(0,1)/0,21", "10,96", "10.96"], "$-0{,}21t=\\ln(0{,}1)$ donne $t=\\ln(0{,}1)/(-0{,}21)\\approx10{,}96$.", "C-Situation complexe, page 7", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalAExponentialPath: LearningPath = {
  id: "terminale-a-exponential",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 4,
  title: "Fonction exponentielle",
  description: "Le cours officiel intégral : définition, propriétés algébriques, limites, variations, équations, inéquations, dérivées composées, primitives et mission finale de la campagne publicitaire.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Utiliser les propriétés de exp",
    "Étudier une fonction exponentielle",
    "Résoudre des équations et inéquations",
  ],
  modules: [{
    id: "terminale-a-exponential-mastery",
    title: "Maîtriser la fonction exponentielle",
    description: "Progression fidèle au document source ; la situation d'apprentissage de la campagne publicitaire n'apparaît que comme mission finale, en contexte d'évaluation.",
    lessons: builtLevels,
  }],
};
