import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 08 FONCTIONS LOGARITHMES.pdf";

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
      instruction: "Sélectionne chaque étape pour relier le domaine, la transformation et la conclusion.",
      observation: "Avec un logarithme, la première vérification reste toujours la stricte positivité de son argument.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique cette démarche aux exercices du document, en écrivant les conditions d’existence avant les calculs.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: "Astuce mémoire de Davy : argument positif d’abord, propriété ensuite, vérification à la fin.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "natural-log-definition",
    title: "Définir le logarithme népérien et le nombre $e$",
    summary: "Connaître le domaine de $\ln$, sa dérivée, sa croissance, sa valeur en $1$ et le nombre $e$.",
    pages: "1-2",
    section: "I-1, I-2 et I-4. Définition, conséquences et nombre e",
    durationMinutes: 30,
    body: String.raw`## Définition

La fonction **logarithme népérien**, notée $\ln$, est la primitive de la fonction

$$
x\longmapsto\frac1x
$$

sur $]0;+\infty[$ qui s’annule en $1$.

## Conséquences immédiates

| Propriété | Signification |
|---|---|
| Domaine | $\ln x$ existe exactement lorsque $x>0$ |
| Valeur remarquable | $\ln 1=0$ |
| Dérivée | $(\ln x)'=\dfrac1x$ pour $x>0$ |
| Variation | $\ln$ est strictement croissante sur $]0;+\infty[$ |

En effet, pour tout $x>0$, on a $\dfrac1x>0$.

## Le nombre réel $e$

La fonction $\ln$ est continue et strictement croissante. Comme

$$
\ln2\approx0{,}69<1<1{,}09\approx\ln3,
$$

il existe un unique réel $e\in]2;3[$ tel que

$$
\ln e=1.
$$

On retient $e\approx2{,}718$. Pour tout rationnel $r$ :

$$
\ln(e^r)=r.
$$

> **Astuce mémoire de Davy.** Les trois réflexes de départ sont : « argument strictement positif », « $\ln1=0$ », « dérivée $1/x$ ».`,
    keyPoint: "$D_{\\ln}=]0;+\\infty[$, $\\ln1=0$, $(\\ln x)'=1/x$ et $\\ln e=1$.",
    example: "$\\ln(2x-3)$ existe lorsque $2x-3>0$, donc pour $x>3/2$.",
    methodSteps: [
      "Repère l’argument placé dans le logarithme.",
      "Impose que cet argument soit strictement positif.",
      "Utilise ln(1)=0, ln(e)=1 ou la dérivée 1/x selon la question.",
      "Vérifie que la réponse reste dans le domaine.",
    ],
    timeline: [
      { label: "Domaine", detail: "Un logarithme réel n’accepte qu’un argument strictement positif." },
      { label: "Point repère", detail: "La courbe passe par (1 ; 0), car ln(1)=0." },
      { label: "Croissance", detail: "Sa dérivée 1/x est positive sur tout son domaine." },
      { label: "Nombre e", detail: "e est l’unique nombre tel que ln(e)=1." },
    ],
    questions: [
      choice("Quel est l’ensemble de définition de $x\\mapsto\\ln x$ ?", ["$\\mathbb R$", "$[0;+\\infty[$", "$]0;+\\infty[$", "$]-\\infty;0[$"], 2, "L’argument du logarithme doit être strictement positif.", "Cours • page 1"),
      short("Calcule $\\ln1$.", ["0", "+0", "0.0"], "La fonction $\\ln$ est définie comme la primitive de $1/x$ qui s’annule en $1$.", "Cours • page 1"),
      choice("Pour $x>0$, quelle est la dérivée de $\\ln x$ ?", ["$x$", "$1/x$", "$-1/x^2$", "$\\ln x$"], 1, "C’est la dérivée de référence du logarithme népérien.", "Cours • page 1"),
      choice("Pourquoi $\\ln$ est-elle strictement croissante ?", ["Parce que $1/x>0$ pour $x>0$", "Parce que $\\ln1=0$", "Parce que $e>2$", "Parce que son domaine est borné"], 0, "Le signe positif de la dérivée impose la croissance.", "Cours • page 1", 2),
      choice("Quel intervalle contient $e$ ?", ["$]0;1[$", "$]1;2[$", "$]2;3[$", "$]3;4[$"], 2, "$\\ln2<1<\\ln3$ et $\\ln$ est strictement croissante.", "Cours • page 2"),
      short("À trois décimales, donne une valeur approchée de $e$.", ["2,718", "2.718"], "$e\\approx2{,}718$.", "Cours • page 2"),
      short("Calcule $\\ln(e^4)$.", ["4", "+4"], "Pour tout rationnel $r$, $\\ln(e^r)=r$.", "Cours • page 2"),
      choice("Quel est le domaine de $\\ln(2x-3)$ ?", ["$]3/2;+\\infty[$", "$]-\\infty;3/2[$", "$[3/2;+\\infty[$", "$\\mathbb R$"], 0, "$2x-3>0\\iff x>3/2$.", "Application du cours • pages 1-2", 2),
    ],
  },
  {
    id: "log-algebra",
    title: "Calculer avec les propriétés algébriques de $\ln$",
    summary: "Transformer produits, quotients, inverses, racines et puissances sans oublier les conditions de positivité.",
    pages: "1-2",
    section: "I-3. Propriétés algébriques et exercice de fixation",
    durationMinutes: 42,
    kind: "practice",
    body: String.raw`## Propriété fondamentale

Pour tous réels $a>0$ et $b>0$ :

$$
\ln(ab)=\ln a+\ln b.
$$

On en déduit :

| Forme | Transformation |
|---|---|
| Inverse | $\ln\left(\dfrac1b\right)=-\ln b$ |
| Quotient | $\ln\left(\dfrac ab\right)=\ln a-\ln b$ |
| Puissance | $\ln(a^r)=r\ln a$, pour $r\in\mathbb Q$ |
| Racine | $\ln(\sqrt a)=\dfrac12\ln a$ |

## Exercice de fixation corrigé

$$
\begin{aligned}
A&=\ln8+\ln10+\ln\frac1{40}
=\ln\left(8\times10\times\frac1{40}\right)=\ln2,\\
B&=\ln(3x)-\ln3=\ln x\qquad(x>0),\\
C&=\ln\frac34+\ln\frac83-\ln(2^3)
=\ln2-\ln8=\ln\frac14,\\
D&=\ln(7^{-3})+2\ln49
=-3\ln7+4\ln7=\ln7,\\
E&=4\ln25-2\ln\sqrt5
=8\ln5-\ln5=\ln(5^7).
\end{aligned}
$$

> **Erreur fréquente.** Il n’existe aucune formule transformant $\ln(a+b)$ en $\ln a+\ln b$. Le logarithme transforme les **produits**, jamais les sommes.

> **Astuce mémoire de Davy.** Produit $\to$ somme ; quotient $\to$ différence ; puissance $\to$ coefficient.`,
    keyPoint: "$\\ln(ab)=\\ln a+\\ln b$, $\\ln(a/b)=\\ln a-\\ln b$ et $\\ln(a^r)=r\\ln a$.",
    example: "$4\\ln25-2\\ln\\sqrt5=8\\ln5-\\ln5=\\ln(5^7)$.",
    methodSteps: [
      "Vérifie que chaque argument est strictement positif.",
      "Décompose les nombres en produits, quotients ou puissances.",
      "Applique une seule propriété à la fois.",
      "Regroupe les logarithmes puis contrôle le résultat.",
    ],
    timeline: [
      { label: "Valider", detail: "Tous les arguments doivent être strictement positifs." },
      { label: "Décomposer", detail: "Faire apparaître produit, quotient, inverse ou puissance." },
      { label: "Transformer", detail: "Produit en somme, quotient en différence, puissance en coefficient." },
      { label: "Regrouper", detail: "Réunir le résultat sous la forme demandée." },
    ],
    questions: [
      choice("$\\ln8+\\ln10+\\ln(1/40)$ vaut :", ["$\\ln2$", "$\\ln18$", "$\\ln(1/22)$", "$2\\ln40$"], 0, "$8\\times10/40=2$.", "Exercice de fixation A • pages 1-2", 2),
      choice("Pour $x>0$, $\\ln(3x)-\\ln3$ vaut :", ["$\\ln x$", "$3\\ln x$", "$\\ln(3-x)$", "$0$"], 0, "$\\ln(3x/3)=\\ln x$.", "Exercice de fixation B • page 2"),
      short("Dans $\\ln(3/4)+\\ln(8/3)-\\ln(2^3)=\\ln k$, donne $k$.", ["1/4", "0,25", "0.25"], "Le produit des deux premières fractions vaut $2$, puis $2/8=1/4$.", "Exercice de fixation C • page 2", 2),
      choice("$\\ln(7^{-3})+2\\ln49$ vaut :", ["$\\ln7$", "$-\\ln7$", "$\\ln49$", "$7\\ln7$"], 0, "$-3\\ln7+2\\times2\\ln7=\\ln7$.", "Exercice de fixation D • page 2", 2),
      short("Dans $4\\ln25-2\\ln\\sqrt5=\\ln(5^n)$, calcule $n$.", ["7", "+7"], "$4\\ln25=8\\ln5$ et $2\\ln\\sqrt5=\\ln5$.", "Exercice de fixation E • page 2", 2),
      choice("$\\ln(a/b)$ est égal à :", ["$\\ln a-\\ln b$", "$\\ln a+\\ln b$", "$\\ln a/\\ln b$", "$a\\ln b$"], 0, "Le logarithme d’un quotient devient une différence.", "Cours • page 1"),
      choice("$\\ln(\\sqrt a)$ est égal à :", ["$2\\ln a$", "$\\ln a/2$", "$\\sqrt{\\ln a}$", "$\\ln(a/2)$"], 1, "$\\sqrt a=a^{1/2}$.", "Cours • page 1"),
      choice("Quelle égalité est fausse ?", ["$\\ln(ab)=\\ln a+\\ln b$", "$\\ln(a+b)=\\ln a+\\ln b$", "$\\ln(a^r)=r\\ln a$", "$\\ln(1/a)=-\\ln a$"], 1, "Il n’existe pas de règle analogue pour une somme.", "Approfondissement pédagogique • pages 1-2", 2),
      short("Écris $8\\ln5-\\ln5$ sous la forme $n\\ln5$.", ["7ln5", "7 ln5", "7ln(5)", "7 ln(5)"], "On soustrait les coefficients : $8-1=7$.", "Exercice de fixation E • page 2"),
    ],
  },
  {
    id: "log-equations",
    title: "Résoudre équations et inéquations logarithmiques",
    summary: "Poser le domaine, utiliser la croissance de $\ln$, résoudre l’équation algébrique puis filtrer les solutions.",
    pages: "2-4",
    section: "I-4. Équations, inéquations et exercices de fixation",
    durationMinutes: 62,
    kind: "practice",
    body: String.raw`## Comparer deux logarithmes

Pour $a>0$ et $b>0$ :

$$
\ln a=\ln b\Longleftrightarrow a=b,
\qquad
\ln a>\ln b\Longleftrightarrow a>b.
$$

En particulier :

$$
\ln x=0\Longleftrightarrow x=1,
\quad
\ln x<0\Longleftrightarrow0<x<1,
\quad
\ln x\geq0\Longleftrightarrow x\geq1.
$$

## Équations du type $\ln u(x)=m$

$$
\ln x=3\Longleftrightarrow x=e^3.
$$

Pour $\ln(2x-1)=-5$, le domaine impose $x>\frac12$, puis :

$$
2x-1=e^{-5}
\Longrightarrow
x=\frac{e^{-5}+1}{2}.
$$

## Inéquations du type $\ln u(x)\leq m$

$$
\begin{aligned}
\ln(x+1)\leq2
&\Longleftrightarrow 0<x+1\leq e^2\\
&\Longleftrightarrow -1<x\leq e^2-1.
\end{aligned}
$$

Donc

$$
S=]-1;e^2-1].
$$

## Équation du second degré en $\ln x$

Pour

$$
(\ln x)^2-3\ln x-4=0,
$$

on pose $X=\ln x$. Alors $X^2-3X-4=0$, d’où $X=-1$ ou $X=4$, puis

$$
S=\{e^{-1};e^4\}.
$$

## Même logarithme des deux côtés

Pour résoudre $\ln u(x)=\ln v(x)$ :

1. déterminer $u(x)>0$ et $v(x)>0$ ;
2. résoudre $u(x)=v(x)$ dans ce domaine ;
3. supprimer toute solution hors domaine.

Exemple :

$$
\ln(x^2-4)=\ln(3x)
$$

est défini lorsque $x>2$. L’équation $x^2-4=3x$ donne $x=-1$ ou $x=4$ ; seule la valeur $4$ est admise.

## Exercices de fixation

$$
\ln(2x-4)=0
\Longleftrightarrow
2x-4=1
\Longleftrightarrow
x=\frac52.
$$

Et

$$
\ln(x-10)<0
\Longleftrightarrow
0<x-10<1
\Longleftrightarrow
10<x<11.
$$

> **Correction de source.** La borne $e^2-1$ doit être incluse dans la solution de $\ln(x+1)\leq2$ ; le PDF imprime une borne ouverte.`,
    keyPoint: "Domaine positif, comparaison des arguments, résolution algébrique, puis filtrage.",
    example: "$\\ln(x^2-4)=\\ln(3x)$ se résout sur $]2;+\\infty[$ et donne uniquement $x=4$.",
    methodSteps: [
      "Détermine l’ensemble de validité de tous les logarithmes.",
      "Remplace m par ln(e^m) ou compare directement les arguments.",
      "Résous l’équation ou l’inéquation algébrique.",
      "Intersecte le résultat avec le domaine.",
      "Vérifie les bornes ouvertes ou fermées selon le symbole.",
    ],
    timeline: [
      { label: "Domaine", detail: "Imposer chaque argument strictement positif." },
      { label: "Transformer", detail: "Utiliser l’injectivité et la croissance de ln." },
      { label: "Résoudre", detail: "Traiter l’équation ou l’inéquation obtenue." },
      { label: "Filtrer", detail: "Conserver uniquement les solutions du domaine." },
    ],
    corrections: [
      "Dans l’exemple ln(x+1)≤2 de la page 3, la borne supérieure doit être fermée : S=]-1;e²−1], et non ]-1;e²−1[.",
      "La page 3 laisse vide le calcul du domaine de ln(x²−4)=ln(3x). Les conditions x²−4>0 et 3x>0 donnent bien x>2.",
    ],
    questions: [
      short("Résous $\\ln x=3$.", ["e^3", "e3", "exp(3)"], "$x=e^3$.", "Exemple de résolution • page 2"),
      choice("Résous $\\ln(2x-1)=-5$.", ["$(e^{-5}+1)/2$", "$(e^5+1)/2$", "$e^{-5}/2$", "$-5$"], 0, "On impose $2x-1>0$, puis $2x-1=e^{-5}$.", "Exemple de résolution • page 2", 2),
      choice("Quelle est la solution corrigée de $\\ln(x+1)\\leq2$ ?", ["$]-1;e^2-1]$", "$]-1;e^2-1[$", "$[-1;e^2-1]$", "$]0;e^2[$"], 0, "L’égalité est autorisée à droite, mais $x=-1$ annule l’argument.", "Exemple corrigé • pages 2-3", 3),
      choice("Pour résoudre $(\\ln x)^2-3\\ln x-4=0$, quelle substitution utilise-t-on ?", ["$X=\\ln x$", "$X=e^x$", "$X=x^2$", "$X=1/x$"], 0, "L’équation devient un trinôme en $X$.", "Cours • page 3"),
      choice("Quelles sont les solutions de $(\\ln x)^2-3\\ln x-4=0$ ?", ["$e^{-1}$ et $e^4$", "$-1$ et $4$", "$e$ et $e^3$", "$1/e^4$ et $e$"], 0, "$\\ln x=-1$ ou $\\ln x=4$.", "Cours • page 3", 2),
      choice("Quel est le domaine commun de $\\ln(x^2-4)=\\ln(3x)$ ?", ["$]2;+\\infty[$", "$]-\\infty;-2[$", "$]-2;0[$", "$\\mathbb R$"], 0, "$x^2-4>0$ et $x>0$ donnent $x>2$.", "Exemple complété • page 3", 2),
      short("Résous $\\ln(x^2-4)=\\ln(3x)$.", ["4", "+4"], "Les racines algébriques sont $-1$ et $4$, mais seule $4$ appartient au domaine.", "Exemple • page 3", 2),
      choice("Résous $\\ln(2x+4)\\geq\\ln(6-2x)$.", ["$[1/2;3[$", "$]-2;1/2]$", "$[1/2;+\\infty[$", "$]-2;3[$"], 0, "Le domaine est $]-2;3[$ et la comparaison donne $x\\geq1/2$.", "Exemple • page 3", 2),
      short("Résous $\\ln(2x-4)=0$.", ["5/2", "2,5", "2.5"], "$\\ln u=0\\iff u=1$, donc $2x-4=1$.", "Exercice de fixation 1 • page 3", 2),
      choice("Résous $\\ln(x-10)<0$.", ["$]10;11[$", "$]-\\infty;11[$", "$]10;+\\infty[$", "$[10;11]$"], 0, "$0<x-10<1$.", "Exercice de fixation 2 • page 4", 2),
      choice("$\\ln x<0$ équivaut à :", ["$0<x<1$", "$x<0$", "$x>1$", "$x=1$"], 0, "$\\ln$ est croissante et $\\ln1=0$.", "Conséquence • page 2"),
      choice("$\\ln x\\geq0$ équivaut à :", ["$x\\geq1$", "$x>0$", "$x\\leq1$", "$x<0$"], 0, "Sur le domaine, $\\ln$ est croissante et s’annule en $1$.", "Conséquence • page 2"),
    ],
  },
  {
    id: "log-limits",
    title: "Étudier la fonction $\ln$, ses limites et sa tangente",
    summary: "Lire les variations de $\ln$, son asymptote, sa tangente en $1$ et les limites de référence.",
    pages: "4-5",
    section: "I-5. Étude de la fonction ln",
    durationMinutes: 48,
    body: String.raw`## Limites et variation

$$
\lim_{x\to0^+}\ln x=-\infty,
\qquad
\lim_{x\to+\infty}\ln x=+\infty.
$$

L’axe des ordonnées, d’équation $x=0$, est donc une asymptote verticale à la courbe de $\ln$.

Comme

$$
(\ln x)'=\frac1x>0,
$$

la fonction $\ln$ est strictement croissante sur $]0;+\infty[$.

## Tangente au point d’abscisse $1$

La courbe passe par $A(1;0)$ et sa pente vaut

$$
(\ln x)'_{\,x=1}=1.
$$

La tangente $(T)$ a donc pour équation :

$$
y=x-1.
$$

La courbe reste sous cette tangente :

$$
\forall x>0,\qquad \ln x\leq x-1.
$$

## Croissance comparée

$$
\lim_{x\to+\infty}\frac{\ln x}{x}=0.
$$

Le logarithme tend vers $+\infty$, mais beaucoup plus lentement que $x$.

## Trois autres limites à connaître

$$
\lim_{x\to0^+}x\ln x=0,
\qquad
\lim_{x\to0}\frac{\ln(1+x)}x=1,
\qquad
\lim_{x\to1}\frac{\ln x}{x-1}=1.
$$

> **Astuce mémoire de Davy.** À l’infini, $x$ domine $\ln x$. Près de $1$, $\ln x$ ressemble à $x-1$.`,
    keyPoint: "$\\ln x\\to-\\infty$ en $0^+$, $\\ln x/x\\to0$ en $+\\infty$ et $\\ln x\\leq x-1$.",
    example: "La tangente à la courbe de $\\ln$ en $(1;0)$ est $y=x-1$.",
    methodSteps: [
      "Identifie la borne : 0+, 1 ou +∞.",
      "Choisis la limite de référence correspondante.",
      "Factorise par x si une forme ∞−∞ apparaît.",
      "Interprète une limite infinie comme une asymptote quand c’est pertinent.",
    ],
    timeline: [
      { label: "Près de 0", detail: "ln x plonge vers −∞ : x=0 est asymptote verticale." },
      { label: "Au point 1", detail: "ln(1)=0 et la pente vaut 1." },
      { label: "À l’infini", detail: "ln x monte vers +∞ mais ln x/x tend vers 0." },
      { label: "Comparaison", detail: "La courbe reste sous la droite y=x−1." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Explore la courbe de $\\ln$ et sa tangente",
      instruction: "Déplace le point pour observer l’asymptote $x=0$, le passage par $(1;0)$ et la tangente $y=x-1$.",
      observation: "La courbe monte sans cesse, reste sous sa tangente en 1 et se rapproche de l’axe des ordonnées sans jamais le toucher.",
      formula: "f(x)=ln(x)",
      formulaTex: "f(x)=\\ln x",
      rule: { kind: "affine-plus-log", slope: 0, intercept: 0, coefficient: 1 },
      window: { xMin: -0.5, xMax: 8, yMin: -3, yMax: 4 },
      guides: [
        { kind: "vertical", value: 0, label: "x = 0" },
        { kind: "oblique", slope: 1, intercept: -1, label: "tangente : y = x − 1" },
      ],
      marker: { min: 0.05, max: 8, step: 0.05, initial: 1 },
    },
    questions: [
      short("Calcule $\\lim_{x\\to0^+}\\ln x$.", ["-∞", "-infini"], "Le logarithme plonge vers $-\\infty$ à droite de $0$.", "Cours • page 4"),
      short("Calcule $\\lim_{x\\to+\\infty}\\ln x$.", ["+∞", "∞", "+infini", "infini"], "La fonction $\\ln$ croît sans borne.", "Cours • page 4"),
      choice("Quelle droite est asymptote verticale à la courbe de $\\ln$ ?", ["$x=0$", "$y=0$", "$x=1$", "$y=x-1$"], 0, "$\\ln x\\to-\\infty$ lorsque $x\\to0^+$.", "Cours • page 4"),
      choice("Quelle est l’équation de la tangente en $x=1$ ?", ["$y=x-1$", "$y=x+1$", "$y=1/x$", "$y=0$"], 0, "Le point est $(1;0)$ et la pente vaut $1$.", "Cours • page 4", 2),
      choice("Pour tout $x>0$, quelle inégalité est vraie ?", ["$\\ln x\\leq x-1$", "$\\ln x\\geq x-1$", "$\\ln x=x$", "$\\ln x\\leq0$"], 0, "La courbe est sous sa tangente en $1$.", "Cours • page 4", 2),
      short("Calcule $\\lim_{x\\to+\\infty}\\ln x/x$.", ["0", "+0"], "$x$ croît plus vite que $\\ln x$.", "Cours • page 4"),
      short("Calcule $\\lim_{x\\to0^+}x\\ln x$.", ["0", "+0"], "C’est une limite de référence.", "Cours • page 4"),
      short("Calcule $\\lim_{x\\to0}\\ln(1+x)/x$.", ["1", "+1"], "C’est le taux d’accroissement de $\\ln$ en $1$.", "Cours • page 4"),
      short("Calcule $\\lim_{x\\to1}\\ln x/(x-1)$.", ["1", "+1"], "C’est également le nombre dérivé de $\\ln$ en $1$.", "Cours • page 4"),
      choice("Quel est le sens de variation de $\\ln$ ?", ["Strictement croissante", "Strictement décroissante", "Constante", "Croissante puis décroissante"], 0, "$1/x>0$ pour tout $x>0$.", "Cours • page 4"),
    ],
  },
  {
    id: "log-limit-fixation-workshop",
    title: "Appliquer les limites de référence",
    summary: "Lever les formes indéterminées des exercices de fixation en factorisant ou en composant correctement.",
    pages: "5",
    section: "I-5. Exercices de fixation sur les limites",
    durationMinutes: 36,
    kind: "practice",
    body: String.raw`## Exercice de fixation 1

Calculons

$$
\lim_{x\to+\infty}(2x-3-\ln x).
$$

On factorise par $x$ :

$$
2x-3-\ln x
=x\left(2-\frac3x-\frac{\ln x}{x}\right).
$$

Le facteur entre parenthèses tend vers $2>0$, donc :

$$
\boxed{\lim_{x\to+\infty}(2x-3-\ln x)=+\infty.}
$$

## Exercice de fixation 2-a

$$
x^3\ln x=x^2(x\ln x).
$$

Lorsque $x\to0^+$, les deux facteurs tendent vers $0$, donc :

$$
\boxed{\lim_{x\to0^+}x^3\ln x=0.}
$$

## Exercice de fixation 2-b

Pour

$$
x\ln\left(1+\frac2x\right),
$$

on pose $u=\dfrac2x$. Alors $u\to0$ et :

$$
x\ln\left(1+\frac2x\right)
=2\frac{\ln(1+u)}u
\longrightarrow2.
$$

> **Erreur fréquente.** N’écris pas « $+\infty-\infty$ ». C’est seulement une forme indéterminée : il faut transformer l’expression avant de conclure.`,
    keyPoint: "Factoriser par $x$ ou faire apparaître $\\ln(1+u)/u$ permet de lever l’indétermination.",
    example: "$x\\ln(1+2/x)=2\\,\\ln(1+2/x)/(2/x)\\to2$.",
    methodSteps: [
      "Repère la forme indéterminée.",
      "Factorise par le terme dominant ou effectue un changement de variable.",
      "Fais apparaître une limite de référence.",
      "Combine les facteurs et conclus.",
    ],
    timeline: [
      { label: "Repérer", detail: "∞−∞ ou 0×∞ n’est pas encore une réponse." },
      { label: "Transformer", detail: "Factoriser par x ou poser u=2/x." },
      { label: "Référence", detail: "Utiliser ln x/x→0, x ln x→0 ou ln(1+u)/u→1." },
      { label: "Conclure", detail: "Combiner seulement après la transformation." },
    ],
    questions: [
      choice("Quelle factorisation convient à $2x-3-\\ln x$ ?", ["$x(2-3/x-\\ln x/x)$", "$x(2-3-\\ln x)$", "$2(x-3-\\ln x)$", "$\\ln(x(2x-3))$"], 0, "Elle fait apparaître $3/x$ et $\\ln x/x$.", "Exercice de fixation 1 • page 5"),
      short("Calcule $\\lim_{x\\to+\\infty}(2x-3-\\ln x)$.", ["+∞", "∞", "+infini", "infini"], "Le terme en $x$ domine le logarithme.", "Exercice de fixation 1 • page 5", 2),
      choice("$x^3\\ln x$ se réécrit utilement :", ["$x^2(x\\ln x)$", "$3x\\ln x$", "$\\ln(x^3)$", "$x^3/\\ln x$"], 0, "On fait apparaître la limite $x\\ln x\\to0$.", "Exercice de fixation 2-a • page 5"),
      short("Calcule $\\lim_{x\\to0^+}x^3\\ln x$.", ["0", "+0"], "$x^2\\to0$ et $x\\ln x\\to0$.", "Exercice de fixation 2-a • page 5", 2),
      choice("Pour $x\\ln(1+2/x)$, quel changement de variable convient ?", ["$u=2/x$", "$u=x/2$", "$u=\\ln x$", "$u=x^2$"], 0, "$2/x\\to0$ en $+\\infty$.", "Exercice de fixation 2-b • page 5"),
      short("Calcule $\\lim_{x\\to+\\infty}x\\ln(1+2/x)$.", ["2", "+2"], "L’expression vaut $2\\,\\ln(1+u)/u$ avec $u\\to0$.", "Exercice de fixation 2-b • page 5", 2),
      choice("La forme $+\\infty-\\infty$ est :", ["une forme indéterminée", "$0$", "$+\\infty$", "$-\\infty$"], 0, "Elle impose une transformation avant de conclure.", "Méthode • page 5"),
    ],
  },
  {
    id: "log-derivative",
    title: "Dériver $\ln u$ et $\ln|u|$",
    summary: "Déterminer le bon domaine puis appliquer la formule $u'/u$.",
    pages: "5-6",
    section: "I-4-1. Dérivées de ln u et ln|u|",
    durationMinutes: 38,
    body: String.raw`## Deux formules, deux conditions

Si $u$ est dérivable et **strictement positive** sur un intervalle $I$ :

$$
(\ln u)'=\frac{u'}u.
$$

Si $u$ est dérivable et **ne s’annule pas** sur $I$ :

$$
(\ln|u|)'=\frac{u'}u.
$$

## Exercice de fixation a

Pour

$$
f(x)=\ln(x^2+1),
$$

on a $x^2+1>0$ pour tout réel $x$. La fonction est donc dérivable sur $\mathbb R$ et :

$$
f'(x)=\frac{2x}{x^2+1}.
$$

## Exercice de fixation b

Pour

$$
f(x)=\ln|2x-1|,
$$

on exclut $2x-1=0$, donc $x\neq\frac12$. Sur $\mathbb R\setminus\{\frac12\}$ :

$$
f'(x)=\frac2{2x-1}.
$$

> **Astuce mémoire de Davy.** « Dérivée du dedans sur le dedans » : le numérateur est $u'$, le dénominateur est $u$.`,
    keyPoint: "$(\\ln u)'=(\\ln|u|)'=u'/u$, avec les conditions de domaine adaptées.",
    example: "$(\\ln(x^2+1))'=2x/(x^2+1)$ sur $\\mathbb R$.",
    methodSteps: [
      "Identifie la fonction intérieure u.",
      "Résous u>0 pour ln u, ou u≠0 pour ln|u|.",
      "Calcule u’ sans dériver le logarithme trop tôt.",
      "Écris u’/u puis simplifie.",
    ],
    timeline: [
      { label: "Intérieur", detail: "Repérer u(x)." },
      { label: "Domaine", detail: "u>0 pour ln u ; u≠0 pour ln|u|." },
      { label: "Dérivée", detail: "Calculer u’ puis former u’/u." },
      { label: "Contrôle", detail: "La formule n’est valable que sur le domaine trouvé." },
    ],
    questions: [
      choice("Si $u>0$, $(\\ln u)'$ vaut :", ["$u'/u$", "$u/u'$", "$\\ln u'$", "$1/u'$"], 0, "C’est la formule de composition.", "Cours • page 5"),
      choice("Pour dériver $\\ln|u|$, quelle condition suffit sur un intervalle ?", ["$u\\neq0$", "$u>1$", "$u'=0$", "$u<0$ uniquement"], 0, "La valeur absolue est positive dès que $u$ ne s’annule pas.", "Cours • page 6"),
      choice("Quel est le domaine de dérivabilité de $\\ln(x^2+1)$ ?", ["$\\mathbb R$", "$]0;+\\infty[$", "$\\mathbb R\\setminus\\{0\\}$", "$]-1;1[$"], 0, "$x^2+1$ est toujours strictement positif.", "Exercice de fixation a • page 6"),
      choice("Quelle est la dérivée de $\\ln(x^2+1)$ ?", ["$2x/(x^2+1)$", "$1/(x^2+1)$", "$2x\\ln x$", "$x/(x^2+1)^2$"], 0, "$u'=2x$ et $u=x^2+1$.", "Exercice de fixation a • page 6", 2),
      choice("Quel réel faut-il exclure pour $\\ln|2x-1|$ ?", ["$1/2$", "$-1/2$", "$1$", "$0$"], 0, "$2x-1=0$ pour $x=1/2$.", "Exercice de fixation b • page 6"),
      choice("Quelle est la dérivée de $\\ln|2x-1|$ ?", ["$2/(2x-1)$", "$1/(2x-1)$", "$2/|2x-1|$", "$\\ln2$"], 0, "$u'=2$ et $u=2x-1$.", "Exercice de fixation b • page 6", 2),
      choice("Quelle phrase est correcte ?", ["$\\ln|u|=\\ln(-u)$ lorsque $u<0$", "$\\ln|u|=\\ln(-u)$ lorsque $u>0$", "$\\ln|u|=\\ln u$ pour tout réel u", "$\\ln|u|=|\\ln u|$"], 0, "Si $u<0$, alors $|u|=-u>0$.", "Remarque corrigée • page 6", 2),
    ],
    corrections: [
      "Dans la remarque de la page 6, ln|u|=ln(−u) vaut lorsque u<0 sur I, et non lorsque u>0.",
    ],
  },
  {
    id: "log-primitives",
    title: "Primitiver une expression de la forme $u'/u$",
    summary: "Reconnaître la dérivée du dénominateur, ajuster le coefficient et écrire $\ln|u|$.",
    pages: "6 et 8",
    section: "I-4-2. Primitive de u'/u et exercice d’application 2",
    durationMinutes: 44,
    kind: "practice",
    body: String.raw`## Propriété

Si $u$ est dérivable et ne s’annule pas sur un intervalle $I$, une primitive de $\dfrac{u'}u$ est :

$$
\ln|u|.
$$

Si $u>0$, on peut écrire $\ln u$. Si $u<0$, on écrit $\ln(-u)$.

## Exercice de fixation a

Sur $]-\infty;0[$ :

$$
\int\frac1x\,dx=\ln|x|=\ln(-x)+C.
$$

## Exercice de fixation b

Comme $(x^4+2)'=4x^3$ et $x^4+2>0$ :

$$
\int\frac{4x^3}{x^4+2}\,dx=\ln(x^4+2)+C.
$$

## Exercice d’application 2-a corrigé

Pour

$$
f(x)=\frac1{1-3x},
$$

la dérivée du dénominateur vaut $-3$. On ajuste :

$$
\int\frac1{1-3x}\,dx
=-\frac13\ln|1-3x|+C.
$$

## Exercice d’application 2-b

Sur $]9;+\infty[$ :

$$
\int\left(2x-7+\frac4{x-9}\right)\,dx
=x^2-7x+4\ln(x-9)+C.
$$

> **Correction de source majeure.** La page 8 propose $\ln|1-2x|$ pour $1/(1-3x)$ : l’intérieur et le coefficient sont tous deux incorrects.`,
    keyPoint: "$\\int u'/u=\\ln|u|+C$ ; si le numérateur diffère de $u'$, ajuste le coefficient.",
    example: "$\\int dx/(1-3x)=-(1/3)\\ln|1-3x|+C$.",
    methodSteps: [
      "Choisis u comme le dénominateur ou l’expression intérieure.",
      "Calcule u’ et compare-le au numérateur.",
      "Multiplie par le coefficient d’ajustement nécessaire.",
      "Écris ln|u|+C et vérifie en dérivant.",
    ],
    timeline: [
      { label: "Choisir u", detail: "Le dénominateur est souvent le bon candidat." },
      { label: "Comparer", detail: "Vérifier si le numérateur est exactement u’." },
      { label: "Ajuster", detail: "Introduire le coefficient manquant." },
      { label: "Vérifier", detail: "La dérivée de la réponse doit rendre l’intégrande." },
    ],
    corrections: [
      "Dans l’exercice 2-a page 8, une primitive de 1/(1−3x) est −(1/3)ln|1−3x|. Le PDF imprime ln|1−2x|, dont la dérivée ne convient pas.",
    ],
    questions: [
      choice("Une primitive de $u'/u$ est :", ["$\\ln|u|$", "$u/u'$", "$e^u$", "$1/u$"], 0, "C’est la propriété de référence.", "Cours • page 6"),
      choice("Sur $]-\\infty;0[$, une primitive de $1/x$ est :", ["$\\ln(-x)$", "$-\\ln(-x)$", "$x^2/2$", "$1/x^2$"], 0, "$|x|=-x$ sur cet intervalle.", "Exercice de fixation a • page 6"),
      choice("Une primitive de $4x^3/(x^4+2)$ est :", ["$\\ln(x^4+2)$", "$4\\ln(x^4+2)$", "$x^4/(x^4+2)$", "$1/(x^4+2)$"], 0, "Le numérateur est la dérivée du dénominateur.", "Exercice de fixation b • page 6", 2),
      choice("Quel coefficient corrige $\\int dx/(1-3x)$ ?", ["$-1/3$", "$1/3$", "$-3$", "$1$"], 0, "$(1-3x)'=-3$.", "Exercice d’application 2-a corrigé • page 8", 2),
      choice("Quelle est la primitive correcte de $1/(1-3x)$ ?", ["$-(1/3)\\ln|1-3x|$", "$\\ln|1-2x|$", "$3\\ln|1-3x|$", "$1/(1-3x)^2$"], 0, "Sa dérivée redonne exactement $1/(1-3x)$.", "Exercice d’application 2-a corrigé • page 8", 3),
      choice("Une primitive de $2x-7$ est :", ["$x^2-7x$", "$2x^2-7$", "$x^2/2-7x$", "$2-7x$"], 0, "On primitive terme à terme.", "Exercice d’application 2-b • page 8"),
      choice("Sur $]9;+\\infty[$, une primitive de $4/(x-9)$ est :", ["$4\\ln(x-9)$", "$\\ln(x-9)/4$", "$4/(x-9)^2$", "$\\ln(9-x)$"], 0, "$x-9>0$ sur l’intervalle.", "Exercice d’application 2-b • page 8", 2),
      choice("Quelle primitive complète convient à $2x-7+4/(x-9)$ ?", ["$x^2-7x+4\\ln(x-9)$", "$2x^2-7x+\\ln(x-9)$", "$x^2-7+4/(x-9)$", "$x^2-7x-4\\ln(x-9)$"], 0, "On additionne les primitives des trois termes.", "Exercice d’application 2-b • page 8", 2),
    ],
  },
  {
    id: "other-log-bases",
    title: "Changer de base logarithmique",
    summary: "Définir $\log_a$, reconnaître le logarithme décimal et exploiter les puissances de la base.",
    pages: "6",
    section: "II. Fonction logarithme de base a",
    durationMinutes: 26,
    body: String.raw`## Définition

Pour $a>0$ et $a\neq1$, le logarithme de base $a$ est défini sur $]0;+\infty[$ par :

$$
\log_a(x)=\frac{\ln x}{\ln a}.
$$

On en déduit :

$$
\log_a(a)=1
\qquad\text{et}\qquad
\log_a(a^n)=n.
$$

## Logarithme décimal

La notation $\log$ sans indice désigne le logarithme de base $10$ :

$$
\log x=\frac{\ln x}{\ln10}.
$$

Ainsi :

$$
\log1=0,\qquad
\log10=1,\qquad
\log(10^n)=n.
$$

> **Astuce mémoire de Davy.** La base descend au dénominateur : $\log_a x=\ln x/\ln a$.`,
    keyPoint: "$\\log_a x=\\ln x/\\ln a$ pour $a>0$, $a\\neq1$ et $x>0$.",
    example: "$\\log_2 8=\\ln8/\\ln2=3$.",
    methodSteps: [
      "Vérifie que la base est positive et différente de 1.",
      "Vérifie que l’argument est strictement positif.",
      "Remplace log_a(x) par ln(x)/ln(a).",
      "Utilise les puissances de la base quand elles apparaissent.",
    ],
    timeline: [
      { label: "Base valide", detail: "a>0 et a≠1." },
      { label: "Argument valide", detail: "x>0." },
      { label: "Changement de base", detail: "Diviser ln x par ln a." },
      { label: "Puissance", detail: "log_a(a^n)=n." },
    ],
    questions: [
      choice("$\\log_a x$ vaut :", ["$\\ln x/\\ln a$", "$\\ln a/\\ln x$", "$a\\ln x$", "$\\ln(ax)$"], 0, "C’est la formule de changement de base.", "Définition • page 6"),
      choice("Quelles conditions portent sur la base $a$ ?", ["$a>0$ et $a\\neq1$", "$a>1$ seulement", "$a<0$", "$a\\neq0$ seulement"], 0, "Ce sont les conditions de définition données dans le cours.", "Définition • page 6"),
      short("Calcule $\\log_2 8$.", ["3", "+3"], "$8=2^3$.", "Application directe • page 6"),
      short("Calcule $\\log10$.", ["1", "+1"], "Le logarithme décimal est de base $10$.", "Remarque • page 6"),
      short("Calcule $\\log(10^{-4})$.", ["-4", "−4"], "$\\log(10^n)=n$ pour tout entier relatif $n$.", "Remarque • page 6", 2),
      short("Calcule $\\log_a a$.", ["1", "+1"], "$\\ln a/\\ln a=1$.", "Remarque • page 6"),
    ],
  },
  {
    id: "revenue-log-mission",
    title: "Mission : prévoir la baisse des recettes",
    summary: "Étudier une recette logarithmique, distinguer le maximum continu du premier mois réellement en baisse.",
    pages: "7",
    section: "C. Situation complexe",
    durationMinutes: 52,
    kind: "challenge",
    body: String.raw`## Modèle financier

Pour $x\geq1$, les recettes mensuelles, en millions de francs CFA, sont modélisées par :

$$
r(x)=3x-x\ln\left(\frac x2\right).
$$

## Dérivée

Comme

$$
\left[x\ln\left(\frac x2\right)\right]'
=\ln\left(\frac x2\right)+1,
$$

on obtient :

$$
r'(x)=2-\ln\left(\frac x2\right).
$$

Ainsi :

$$
r'(x)>0
\Longleftrightarrow
\ln\left(\frac x2\right)<2
\Longleftrightarrow
x<2e^2.
$$

La fonction est donc croissante jusqu’à $2e^2\approx14{,}78$, puis décroissante.

## Interprétation en mois entiers

Le maximum continu est atteint entre les mois $14$ et $15$. Pour savoir quand le bilan mensuel baisse réellement, on compare :

$$
\begin{aligned}
r(14)&\approx14{,}757,\\
r(15)&\approx14{,}776,\\
r(16)&\approx14{,}729.
\end{aligned}
$$

La recette du mois $15$ dépasse encore celle du mois $14$. La **première baisse observée** est celle du mois $16$ par rapport au mois $15$.

> **Correction de source.** Le PDF conclut « à partir du 15e mois ». Cela décrit approximativement le début de la décroissance continue après $14{,}78$, mais la première baisse entre deux bilans mensuels apparaît au 16e mois.

> **Astuce mémoire de Davy.** Un seuil continu entre deux entiers doit être traduit dans le contexte : compare les deux mois voisins avant de répondre.`,
    keyPoint: "$r$ atteint son maximum continu en $2e^2\\approx14{,}78$ ; la première baisse mensuelle est observée au mois 16.",
    example: "$r(15)>r(14)$ mais $r(16)<r(15)$.",
    methodSteps: [
      "Écris clairement la fonction et son domaine.",
      "Dérive le produit x ln(x/2).",
      "Résous r’(x)>0 puis repère le maximum continu.",
      "Encadre le seuil entre deux mois entiers.",
      "Compare les recettes des mois voisins avant la conclusion.",
    ],
    timeline: [
      { label: "Modèle", detail: "r(x)=3x−x ln(x/2), pour x≥1." },
      { label: "Dérivée", detail: "r’(x)=2−ln(x/2)." },
      { label: "Seuil continu", detail: "Le maximum est atteint en 2e²≈14,78." },
      { label: "Décision mensuelle", detail: "La première baisse de bilan apparaît entre les mois 15 et 16." },
    ],
    corrections: [
      "La page 7 conclut à une baisse « à partir du 15e mois ». Or r(15)>r(14) et r(16)<r(15) : le maximum continu est vers 14,78, mais la première baisse entre deux mois entiers est observée au 16e mois.",
    ],
    questions: [
      choice("Quelle fonction modélise les recettes ?", ["$r(x)=3x-x\\ln(x/2)$", "$r(x)=3x-\\ln(x/2)$", "$r(x)=x\\ln(3x/2)$", "$r(x)=3-x\\ln x$"], 0, "C’est le modèle donné dans la situation complexe.", "Situation complexe • page 7"),
      choice("Quelle est la dérivée de $x\\ln(x/2)$ ?", ["$\\ln(x/2)+1$", "$1/x$", "$x\\ln(x/2)$", "$\\ln(x/2)$"], 0, "On applique la dérivée d’un produit.", "Situation complexe • page 7", 2),
      choice("Quelle est la dérivée de $r$ ?", ["$2-\\ln(x/2)$", "$3-\\ln(x/2)$", "$2-1/x$", "$-\\ln(x/2)$"], 0, "$3-[\\ln(x/2)+1]=2-\\ln(x/2)$.", "Situation complexe • page 7", 2),
      choice("$r'(x)>0$ équivaut à :", ["$x<2e^2$", "$x>2e^2$", "$x<e^2/2$", "$x<2e$"], 0, "$\\ln(x/2)<2\\iff x/2<e^2$.", "Situation complexe • page 7", 2),
      short("À deux décimales, donne la valeur de $2e^2$.", ["14,78", "14.78"], "$2e^2\\approx14{,}78$.", "Situation complexe • page 7"),
      choice("Quel mois a la plus grande recette parmi 14, 15 et 16 ?", ["Le mois 15", "Le mois 14", "Le mois 16", "Les trois sont égaux"], 0, "$r(15)\\approx14{,}776$ est la plus grande des trois valeurs.", "Situation corrigée • page 7", 2),
      choice("Quand apparaît la première baisse entre deux bilans mensuels ?", ["Au 16e mois", "Au 15e mois", "Au 14e mois", "Au 17e mois"], 0, "$r(16)<r(15)$ alors que $r(15)>r(14)$.", "Situation corrigée • page 7", 3),
      choice("Pourquoi ne suffit-il pas d’arrondir $14{,}78$ à $15$ ?", ["Parce qu’il faut comparer les valeurs mensuelles voisines", "Parce que e est irrationnel", "Parce que ln n’est pas croissante", "Parce que le domaine commence à 1"], 0, "La question porte sur une baisse entre deux bilans discrets.", "Interprétation pédagogique • page 7", 2),
    ],
  },
  {
    id: "official-log-workshop",
    title: "Atelier des exercices d’application et de renforcement",
    summary: "Résoudre fidèlement les exercices 1 à 4, avec les corrections des limites, de la primitive et du domaine.",
    pages: "8-9",
    section: "D-1 et D-2. Exercices 1 à 4",
    durationMinutes: 74,
    kind: "practice",
    body: String.raw`## Exercice 1 : limites

$$
\begin{array}{c|c}
\text{Expression} & \text{Limite}\\ \hline
\ln(7x),\ x\to+\infty & +\infty\\
\dfrac{x}{\ln x},\ x\to+\infty & +\infty\\
x-\ln x,\ x\to+\infty & +\infty\\
\ln(4-3x),\ x\to-\infty & +\infty\\
\ln(x\sqrt2),\ x\to0^+ & -\infty\\
\ln(-x/3),\ x\to-\infty & +\infty\\
\dfrac{\ln(0{,}8x)}x,\ x\to+\infty & 0
\end{array}
$$

Les deux dernières valeurs corrigent les résultats imprimés dans le document.

## Exercice 2 : primitives

$$
\int\frac{dx}{1-3x}
=-\frac13\ln|1-3x|+C.
$$

Et, sur $]9;+\infty[$ :

$$
\int\left(2x-7+\frac4{x-9}\right)dx
=x^2-7x+4\ln(x-9)+C.
$$

## Exercice 3 : fonction homographique en $\ln x$

Soit

$$
f(x)=\frac{1+\ln x}{1-\ln x}.
$$

Son domaine est

$$
D_f=]0;e[\cup]e;+\infty[.
$$

Et

$$
f'(x)=\frac2{x(1-\ln x)^2}>0.
$$

La fonction est strictement croissante sur chacun des deux intervalles de son domaine.

## Exercice 4-a : équation

Le domaine de

$$
\ln(2x-3)=2\ln(6-x)-\ln x
$$

est $]3/2;6[$. Après transformation :

$$
x(2x-3)=(6-x)^2,
$$

dont les racines sont $3$ et $-12$. Seule $3$ appartient au domaine.

## Exercice 4-b : inéquation

Le domaine est $]49/25;3[$. L’inéquation devient :

$$
24(3-x)<(x+1)(25x-49)
\Longleftrightarrow
25x^2-121>0.
$$

Après intersection avec le domaine :

$$
S=]11/5;3[.
$$

> **Corrections de source.** La limite de $\ln(x\sqrt2)$ en $0^+$ vaut $-\infty$, celle de $\ln(0{,}8x)/x$ vaut $0$, la primitive de $1/(1-3x)$ porte le facteur $-1/3$, et $f$ n’est pas définie en $x=e$.`,
    keyPoint: "Chaque exercice commence par le domaine ; les trois résultats corrigés sont $-\\infty$, $0$ et $-(1/3)\\ln|1-3x|$.",
    example: "$\\ln(0{,}8x)/x=0{,}8\\,\\ln(0{,}8x)/(0{,}8x)\\to0$.",
    methodSteps: [
      "Détermine le domaine avant toute limite, dérivée ou équation.",
      "Transforme l’expression pour faire apparaître une limite ou une formule connue.",
      "Résous l’équation algébrique obtenue.",
      "Intersecte avec le domaine.",
      "Contrôle le résultat en dérivant ou en estimant numériquement.",
    ],
    timeline: [
      { label: "Exercice 1", detail: "Composer et comparer les croissances." },
      { label: "Exercice 2", detail: "Reconnaître u’/u et ajuster le coefficient." },
      { label: "Exercice 3", detail: "Exclure x=e puis étudier la dérivée." },
      { label: "Exercice 4", detail: "Domaine, transformation algébrique et intersection." },
    ],
    corrections: [
      "Dans l’exercice 1-e page 8, lim[x→0+] ln(x√2)=−∞, et non 0.",
      "Dans l’exercice 1-g page 8, lim[x→+∞] ln(0,8x)/x=0, et non 0,8.",
      "Dans l’exercice 2-a page 8, la primitive correcte est −(1/3)ln|1−3x|, et non ln|1−2x|.",
      "Dans l’exercice 3 page 8, la fonction (1+ln x)/(1−ln x) n’est pas dérivable sur tout ]0;+∞[ : x=e doit être exclu.",
    ],
    questions: [
      short("Calcule $\\lim_{x\\to+\\infty}\\ln(7x)$.", ["+∞", "∞", "+infini", "infini"], "$7x\\to+\\infty$.", "Exercice 1-a • page 8"),
      short("Calcule $\\lim_{x\\to+\\infty}x/\\ln x$.", ["+∞", "∞", "+infini", "infini"], "C’est l’inverse de $\\ln x/x\\to0^+$.", "Exercice 1-b • page 8"),
      short("Calcule $\\lim_{x\\to+\\infty}(x-\\ln x)$.", ["+∞", "∞", "+infini", "infini"], "$x(1-\\ln x/x)$ et le second facteur tend vers $1$.", "Exercice 1-c • page 8"),
      short("Calcule $\\lim_{x\\to-\\infty}\\ln(4-3x)$.", ["+∞", "∞", "+infini", "infini"], "$4-3x\\to+\\infty$.", "Exercice 1-d • page 8"),
      short("Calcule la limite corrigée de $\\ln(x\\sqrt2)$ en $0^+$.", ["-∞", "-infini"], "L’argument tend vers $0^+$, donc le logarithme tend vers $-\\infty$.", "Exercice 1-e corrigé • page 8", 3),
      short("Calcule $\\lim_{x\\to-\\infty}\\ln(-x/3)$.", ["+∞", "∞", "+infini", "infini"], "$-x/3\\to+\\infty$.", "Exercice 1-f • page 8"),
      short("Calcule la limite corrigée de $\\ln(0{,}8x)/x$ en $+\\infty$.", ["0", "+0"], "Après $X=0{,}8x$, l’expression vaut $0{,}8\\ln X/X\\to0$.", "Exercice 1-g corrigé • page 8", 3),
      choice("Quelle primitive corrige l’exercice 2-a ?", ["$-(1/3)\\ln|1-3x|$", "$\\ln|1-2x|$", "$3\\ln|1-3x|$", "$\\ln|1-3x|$"], 0, "La dérivée de $1-3x$ vaut $-3$.", "Exercice 2-a corrigé • page 8", 3),
      choice("Quel réel est exclu du domaine de $(1+\\ln x)/(1-\\ln x)$ ?", ["$e$", "$1$", "$0$ seulement", "$-e$"], 0, "$1-\\ln x=0\\iff x=e$.", "Exercice 3 corrigé • page 8", 2),
      choice("Quel est le signe de $f'(x)=2/[x(1-\\ln x)^2]$ sur son domaine ?", ["Strictement positif", "Strictement négatif", "Nul", "Variable"], 0, "Tous les facteurs du dénominateur sont positifs.", "Exercice 3 • page 8"),
      choice("Quelle est la solution de l’exercice 4-a ?", ["$\\{3\\}$", "$\\{-12;3\\}$", "$\\{-12\\}$", "$]3/2;6[$"], 0, "$-12$ est hors du domaine $]3/2;6[$.", "Exercice 4-a • page 9", 2),
      choice("Quel est le domaine de l’inéquation de l’exercice 4-b ?", ["$]49/25;3[$", "$]-1;3[$", "$]11/5;3[$", "$\\mathbb R$"], 0, "Il faut simultanément $3-x>0$, $x+1>0$ et $25x-49>0$.", "Exercice 4-b • page 9", 2),
      choice("Quelle inéquation algébrique obtient-on dans l’exercice 4-b ?", ["$25x^2-121>0$", "$25x^2-121<0$", "$25x-121>0$", "$x^2-25>0$"], 0, "On développe $24(3-x)<(x+1)(25x-49)$.", "Exercice 4-b • page 9", 2),
      choice("Quelle est la solution finale de l’exercice 4-b ?", ["$]11/5;3[$", "$]49/25;11/5[$", "$]49/25;3[$", "$]-\\infty;-11/5[$"], 0, "On intersecte $x>11/5$ avec le domaine $]49/25;3[$.", "Exercice 4-b • page 9", 3),
    ],
  },
  {
    id: "log-rational-function-mission",
    title: "Mission finale : étudier $g(x)=\\ln x/(x-2)^2$",
    summary: "Mener une étude complète : fonction auxiliaire, limites, asymptotes, dérivée, variations et tangente.",
    pages: "9-11",
    section: "D-3. Exercice d’approfondissement 5",
    durationMinutes: 76,
    kind: "challenge",
    body: String.raw`## 1. Fonction auxiliaire

On définit

$$
f(x)=x-2-2x\ln x
$$

sur $]0;+\infty[$. Sa dérivée est :

$$
f'(x)=-1-2\ln x.
$$

Ainsi :

$$
f'(x)>0
\Longleftrightarrow
x<e^{-1/2}.
$$

La fonction $f$ croît puis décroît. Son maximum vaut :

$$
f(e^{-1/2})=\frac2{\sqrt e}-2<0.
$$

Donc :

$$
\forall x>0,\qquad f(x)<0.
$$

Au bord gauche :

$$
\lim_{x\to0^+}f(x)=-2.
$$

## 2. Domaine et limites de $g$

On définit

$$
g(x)=\frac{\ln x}{(x-2)^2}
$$

sur

$$
D_g=]0;2[\cup]2;+\infty[.
$$

Les limites sont :

$$
\begin{aligned}
\lim_{x\to0^+}g(x)&=-\infty,\\
\lim_{x\to2^-}g(x)&=+\infty,\\
\lim_{x\to2^+}g(x)&=+\infty,\\
\lim_{x\to+\infty}g(x)&=0.
\end{aligned}
$$

Ainsi $x=0$ et $x=2$ sont des asymptotes verticales ; $y=0$ est asymptote horizontale en $+\infty$.

## 3. Dérivée et variations

$$
g'(x)=\frac{f(x)}{x(x-2)^3}.
$$

Comme $f(x)<0$ et $x>0$ :

- sur $]0;2[$, $(x-2)^3<0$, donc $g'(x)>0$ ;
- sur $]2;+\infty[$, $(x-2)^3>0$, donc $g'(x)<0$.

La fonction $g$ est croissante sur $]0;2[$ puis décroissante sur $]2;+\infty[$.

## 4. Tangente en $x=1$

$$
g(1)=0,
\qquad
g'(1)=1.
$$

La tangente $(T)$ a pour équation :

$$
y=x-1.
$$

> **Corrections de source.** Le tableau de $f$ doit commencer à $-2$, pas à $0$. La phrase « le signe de $g$ » de la page 10 doit lire « le signe de $g'$ ».

> **Astuce mémoire de Davy.** Dans une étude complète : domaine, limites, dérivée, signe, variations, tangente, tracé. Garde cet ordre pour ne rien oublier.`,
    keyPoint: "$g$ croît sur $]0;2[$, décroît sur $]2;+\\infty[$, avec asymptotes $x=0$, $x=2$, $y=0$ et tangente $y=x-1$.",
    example: "$g'(x)=f(x)/[x(x-2)^3]$ et $f(x)<0$ sur $]0;+\\infty[$.",
    methodSteps: [
      "Étudie la fonction auxiliaire f et établis son signe.",
      "Détermine le domaine de g.",
      "Calcule toutes les limites aux bornes du domaine.",
      "Interprète les limites en asymptotes.",
      "Calcule g’ et combine les signes des facteurs.",
      "Dresse les variations puis calcule la tangente.",
    ],
    timeline: [
      { label: "Auxiliaire f", detail: "Son maximum reste négatif, donc f<0 partout." },
      { label: "Limites", detail: "Deux asymptotes verticales et une horizontale apparaissent." },
      { label: "Dérivée", detail: "Le signe change uniquement à cause de (x−2)³." },
      { label: "Tangente", detail: "Au point (1 ; 0), la pente vaut 1." },
    ],
    corrections: [
      "Dans le tableau de variation de f page 10, lim[x→0+] f(x)=−2 et non 0, car x ln x→0.",
      "À la page 10, la phrase « le signe de g(x) est celui de f(x)/(x−2)³ » doit porter sur g′(x), pas sur g(x).",
    ],
    questions: [
      choice("Quelle est la dérivée de $f(x)=x-2-2x\\ln x$ ?", ["$-1-2\\ln x$", "$1-2\\ln x$", "$-2/x$", "$x-2\\ln x$"], 0, "$(2x\\ln x)'=2\\ln x+2$.", "Exercice 5.1-a • pages 9-10", 2),
      choice("$f'(x)>0$ équivaut à :", ["$x<e^{-1/2}$", "$x>e^{-1/2}$", "$x<e^{1/2}$", "$x>2$"], 0, "$-1-2\\ln x>0\\iff\\ln x<-1/2$.", "Exercice 5.1-a • page 10", 2),
      choice("Quelle est la valeur maximale de $f$ ?", ["$2/\\sqrt e-2$", "$2/\\sqrt e+2$", "$-2\\sqrt e$", "$0$"], 0, "Elle est atteinte en $e^{-1/2}$.", "Exercice 5.1-b • page 10", 2),
      choice("Quel est le signe de $f$ sur $]0;+\\infty[$ ?", ["Strictement négatif", "Strictement positif", "Nul", "Variable"], 0, "Même son maximum $2/\\sqrt e-2$ est négatif.", "Exercice 5.1-b • page 10", 2),
      short("Calcule la limite corrigée de $f(x)$ en $0^+$.", ["-2", "−2"], "$x\\to0$ et $x\\ln x\\to0$, donc $f(x)\\to-2$.", "Exercice 5.1 corrigé • page 10", 3),
      choice("Quel est le domaine de $g(x)=\\ln x/(x-2)^2$ ?", ["$]0;2[\\cup]2;+\\infty[$", "$\\mathbb R\\setminus\\{2\\}$", "$]0;+\\infty[$", "$]-\\infty;2[$"], 0, "Il faut $x>0$ et $x\\neq2$.", "Exercice 5.2 • page 9"),
      short("Calcule $\\lim_{x\\to0^+}g(x)$.", ["-∞", "-infini"], "Le numérateur tend vers $-\\infty$ et le dénominateur vers $4$.", "Exercice 5.2-a • page 10"),
      short("Calcule la limite de $g$ en $2^-$ ou en $2^+$.", ["+∞", "∞", "+infini", "infini"], "$\\ln2>0$ et $(x-2)^2\\to0^+$.", "Exercice 5.2-a • page 10", 2),
      short("Calcule $\\lim_{x\\to+\\infty}g(x)$.", ["0", "+0"], "$g=(\\ln x/x)\\times1/(x-4+4/x)$, produit de deux termes tendant vers $0$.", "Exercice 5.2-a • page 10", 2),
      choice("Quelles sont les asymptotes verticales ?", ["$x=0$ et $x=2$", "$y=0$ et $y=2$", "$x=2$ seulement", "$x=0$ seulement"], 0, "Les limites y sont infinies.", "Exercice 5.2-a • page 10"),
      choice("Quelle est l’asymptote horizontale en $+\\infty$ ?", ["$y=0$", "$x=0$", "$y=2$", "$y=x-1$"], 0, "$g(x)\\to0$.", "Exercice 5.2-a • page 10"),
      choice("Quelle est la dérivée de $g$ ?", ["$f(x)/[x(x-2)^3]$", "$f(x)/(x-2)^2$", "$1/[x(x-2)]$", "$-f(x)/x$"], 0, "Le calcul du quotient se factorise avec la fonction auxiliaire.", "Exercice 5.2-b • page 10", 2),
      choice("Quel est le sens de variation de $g$ ?", ["Croissante sur $]0;2[$ puis décroissante sur $]2;+\\infty[$", "Décroissante partout", "Croissante partout", "Décroissante puis croissante"], 0, "$f<0$ et le signe de $(x-2)^3$ change en $2$.", "Exercice 5.2-c • pages 10-11", 2),
      short("Calcule $g(1)$.", ["0", "+0"], "$\\ln1=0$.", "Exercice 5.2-d • page 11"),
      short("Calcule $g'(1)$.", ["1", "+1"], "La formule de la dérivée donne $1$.", "Exercice 5.2-d • page 11"),
      choice("Quelle est la tangente à $(C)$ au point d’abscisse $1$ ?", ["$y=x-1$", "$y=x+1$", "$y=1/x$", "$y=0$"], 0, "Elle passe par $(1;0)$ et a pour pente $1$.", "Exercice 5.2-d • page 11", 2),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCLogarithmsPath: LearningPath = {
  id: "terminale-c-math-l08-logarithms",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 8,
  title: "Fonctions logarithmes",
  description: "Logarithme népérien, propriétés algébriques, équations, limites, dérivation, primitives, autres bases et études complètes.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Définir et calculer avec le logarithme népérien",
    "Résoudre des équations et inéquations logarithmiques",
    "Maîtriser les limites, variations et comparaisons de croissance",
    "Dériver ln u et primitiver u’/u",
    "Utiliser les logarithmes de base quelconque",
    "Résoudre la mission financière et l’étude complète de g",
  ],
  modules: [
    {
      id: "terminale-c-math-l08-logarithms-mastery",
      title: "Maîtriser les fonctions logarithmes",
      description: "Du domaine de ln aux études de fonctions, avec exercices officiels, corrections de source et mission finale.",
      lessons: builtLevels,
    },
  ],
};
