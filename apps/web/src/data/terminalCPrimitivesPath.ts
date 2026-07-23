import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 06 PRIMITIVES.pdf";

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
      title: "Lire la dérivation à l’envers",
      instruction: "Parcours les étapes dans l’ordre, puis vérifie chaque primitive en la dérivant.",
      observation: "Une primitive proposée n’est jamais une devinette : sa dérivée doit redonner exactement la fonction de départ.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Précise l’intervalle, reconnais la forme, ajuste le coefficient puis contrôle ta réponse par dérivation.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: "Astuce mémoire de Davy : primitiver, c’est dériver à l’envers. La dérivation finale est ton détecteur d’erreur.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "primitive-definition",
    title: "Reconnaître une primitive",
    summary: "Utiliser la définition $F'=f$ et vérifier une candidate en la dérivant.",
    pages: "1-2",
    section: "I-1. Définition et exercice de fixation",
    durationMinutes: 24,
    body: String.raw`## Définition

Soit $f$ une fonction définie sur un intervalle $I$. On appelle **primitive de $f$ sur $I$** toute fonction $F$ dérivable sur $I$ telle que

$$
\forall x\in I,\qquad F'(x)=f(x).
$$

Pour reconnaître une primitive, on ne se fie donc pas à son apparence : on la **dérive**.

## Exemple du cours

Soient

$$
f(x)=3x^2+1
\qquad\text{et}\qquad
F(x)=x^3+x-9.
$$

Alors

$$
F'(x)=3x^2+1=f(x).
$$

Ainsi, $F$ est une primitive de $f$ sur $\mathbb R$.

## Exercice de fixation préparé

Le PDF propose $f(x)=2x+5$ et quatre candidates :

$$
\begin{aligned}
F(x)&=x^2,\\
G(x)&=x^2+5x-7,\\
H(x)&=x^2+5x,\\
P(x)&=x^2+5x+\frac1x.
\end{aligned}
$$

La fonction $P$ n’est définie que sur $\mathbb R\setminus\{0\}$. Pour être une primitive de $f$ **sur $\mathbb R$**, une candidate doit elle-même être définie et dérivable sur tout $\mathbb R$.

> **Astuce mémoire de Davy.** « Candidate $F$ ? Je calcule $F'$. » Si le résultat est exactement $f$, la preuve est terminée.

> **Erreur fréquente.** Deux fonctions qui se ressemblent ne sont pas forcément primitives de la même fonction. Seule la dérivée tranche.`,
    keyPoint: "F est une primitive de f sur I ⇔ F est dérivable sur I et F′ = f.",
    example: "$F(x)=x^3+x-9$ vérifie $F'(x)=3x^2+1$ : c’est une primitive de $f(x)=3x^2+1$.",
    methodSteps: [
      "Vérifie que la candidate est définie et dérivable sur tout l’intervalle demandé.",
      "Calcule sa dérivée terme à terme.",
      "Compare la dérivée obtenue à f(x), sans oublier le domaine.",
      "Conclue par une phrase : « F′=f sur I, donc F est une primitive de f sur I ».",
    ],
    timeline: [
      { label: "Domaine", detail: "La candidate doit être définie sur tout l’intervalle I." },
      { label: "Dérivée", detail: "Calculer F′ sans chercher directement une intégrale." },
      { label: "Comparaison", detail: "Vérifier l’égalité exacte F′=f." },
      { label: "Conclusion", detail: "Nommer la fonction, l’intervalle et la propriété." },
    ],
    corrections: [
      "La couverture du PDF porte « Leçon 4 », tandis que le fichier fourni et le catalogue officiel de la plateforme classent ce contenu comme leçon 06 de Terminale C.",
    ],
    questions: [
      choice("Quelle égalité définit une primitive $F$ de $f$ sur $I$ ?", ["$F=f$", "$F'=f$", "$f'=F$", "$F'=f'$"], 1, "C’est exactement la définition d’une primitive.", "Définition • page 1"),
      choice("$F(x)=x^3+x-9$ est-elle une primitive de $f(x)=3x^2+1$ ?", ["Oui", "Non"], 0, "$F'(x)=3x^2+1=f(x)$.", "Exemple • page 1", 2),
      choice("Parmi les candidates du PDF, lesquelles sont des primitives de $2x+5$ sur $\\mathbb R$ ?", ["$F$ seulement", "$G$ et $H$", "$G$ et $P$", "Les quatre"], 1, "$G'(x)=H'(x)=2x+5$. $F'=2x$ et $P$ n’est pas définie en $0$.", "Exercice de fixation • pages 1-2", 2),
      choice("Pourquoi $P(x)=x^2+5x+1/x$ ne convient-elle pas sur $\\mathbb R$ ?", ["Sa dérivée est constante", "Elle n’est pas définie en $0$", "Elle est toujours négative", "Elle vaut $0$ en $1$"], 1, "Une primitive sur $\\mathbb R$ doit être définie et dérivable sur tout $\\mathbb R$.", "Exercice de fixation • page 2"),
      short("Calcule $G'(x)$ pour $G(x)=x^2+5x-7$.", ["2x+5", "5+2x"], "La constante $-7$ disparaît à la dérivation.", "Exercice de fixation • page 2"),
    ],
  },
  {
    id: "primitive-existence",
    title: "Savoir quand une primitive existe",
    summary: "Appliquer le théorème d’existence aux fonctions continues sur un intervalle.",
    pages: "2",
    section: "I-2. Existence des primitives",
    durationMinutes: 22,
    body: String.raw`## Théorème d’existence

**Toute fonction continue sur un intervalle $I$ admet des primitives sur $I$.**

Ce théorème garantit l’existence ; il ne donne pas encore la formule de la primitive.

$$
f\text{ continue sur }I
\quad\Longrightarrow\quad
\exists F\text{ dérivable sur }I,\;F'=f.
$$

## Fonctions de l’exercice officiel

Le cours considère les fonctions suivantes, annoncées de $\mathbb R$ vers $\mathbb R$ :

$$
f(x)=x^3-1,\qquad
g(x)=\frac1x,\qquad
h(x)=\sqrt x,\qquad
u(x)=\frac{x}{x^2+1}.
$$

- $f$ est un polynôme : elle est continue sur $\mathbb R$.
- $u$ est un quotient dont le dénominateur $x^2+1$ ne s’annule jamais : elle est continue sur $\mathbb R$.
- $g$ n’est pas définie en $0$ : elle n’est pas une fonction de $\mathbb R$ vers $\mathbb R$.
- $h$ n’est définie sur $\mathbb R$ que pour $x\ge0$ : elle n’est pas une fonction de $\mathbb R$ vers $\mathbb R$.

Ainsi, le théorème garantit directement des primitives de $f$ et de $u$ sur $\mathbb R$.

> **Point difficile.** Une fonction peut ne pas avoir de primitive sur $\mathbb R$ tout en en ayant sur des intervalles plus petits. Par exemple, $1/x$ est continue sur $]-\infty;0[$ et sur $]0;+\infty[$.

> **Astuce mémoire de Davy.** Avant le calcul, demande-toi : « Sur quel intervalle ma fonction est-elle continue ? »`,
    keyPoint: "Continuité sur un intervalle ⇒ existence d’au moins une primitive sur cet intervalle.",
    example: "$u(x)=x/(x^2+1)$ est continue sur $\\mathbb R$ car $x^2+1>0$, donc elle y admet des primitives.",
    methodSteps: [
      "Détermine l’ensemble de définition de la fonction.",
      "Choisis un intervalle inclus dans cet ensemble.",
      "Justifie la continuité sur cet intervalle.",
      "Applique le théorème pour conclure à l’existence de primitives.",
    ],
    timeline: [
      { label: "Définition", detail: "Repérer les valeurs interdites ou les contraintes de racine." },
      { label: "Intervalle", detail: "Ne pas traverser un point où la fonction n’est pas définie." },
      { label: "Continuité", detail: "Polynômes, quotients valides et racines sur leur domaine." },
      { label: "Existence", detail: "La continuité suffit à garantir une primitive." },
    ],
    questions: [
      choice("Quelle hypothèse suffit à garantir l’existence de primitives sur $I$ ?", ["$f$ est positive", "$f$ est continue sur $I$", "$f$ est paire", "$f$ est bornée"], 1, "C’est le théorème d’existence du cours.", "Propriété • page 2"),
      choice("Parmi les fonctions annoncées de $\\mathbb R$ vers $\\mathbb R$, lesquelles admettent des primitives sur $\\mathbb R$ par le théorème ?", ["$f$ et $u$", "$g$ et $h$", "$f$ et $g$", "Les quatre"], 0, "$f$ et $u$ sont continues sur tout $\\mathbb R$.", "Exercice de fixation • page 2", 2),
      choice("Pourquoi $g(x)=1/x$ ne convient-elle pas comme fonction continue sur $\\mathbb R$ ?", ["Elle est impaire", "Elle n’est pas définie en $0$", "Elle vaut $1$ en $1$", "Elle décroît"], 1, "Le point $0$ coupe son domaine en deux intervalles.", "Exercice de fixation • page 2"),
      choice("$1/x$ admet-elle néanmoins des primitives sur $]0,+\\infty[$ ?", ["Oui", "Non"], 0, "Elle est continue sur cet intervalle.", "Clarification du domaine"),
      choice("Pourquoi $u(x)=x/(x^2+1)$ est-elle continue sur $\\mathbb R$ ?", ["Parce que $x^2+1>0$", "Parce que son numérateur est nul en $0$", "Parce qu’elle est paire", "Parce qu’elle est affine"], 0, "Le dénominateur ne s’annule jamais.", "Exercice de fixation • page 2"),
    ],
  },
  {
    id: "primitive-family",
    title: "Décrire toute la famille des primitives",
    summary: "Comprendre pourquoi deux primitives sur un même intervalle diffèrent d’une constante.",
    pages: "2-3",
    section: "I-3. Ensemble des primitives d’une fonction",
    durationMinutes: 24,
    body: String.raw`## Propriété

Soit $f$ une fonction admettant une primitive $F$ sur un intervalle $I$.

Alors toutes les primitives de $f$ sur $I$ sont les fonctions

$$
x\longmapsto F(x)+c,\qquad c\in\mathbb R.
$$

La raison est simple :

$$
(F+c)'=F'=f.
$$

Réciproquement, si $G'=F'$ sur un intervalle, alors $(G-F)'=0$ ; la fonction $G-F$ est donc constante.

## Exercice de fixation 1

Pour

$$
f(x)=x^2-x,
\qquad
F(x)=\frac{x^3}{3}-\frac{x^2}{2},
$$

on vérifie

$$
F'(x)=x^2-x=f(x).
$$

Deux autres primitives sont, par exemple,

$$
G(x)=F(x)-29
\qquad\text{et}\qquad
H(x)=F(x)+546.
$$

## Exercice de fixation 2

Sur $]0;+\infty[$,

$$
f(x)=-\frac1{x^2}.
$$

Comme

$$
\left(\frac1x\right)'=-\frac1{x^2},
$$

toutes les primitives sont

$$
F(x)=\frac1x+c,\qquad c\in\mathbb R.
$$

> **Astuce mémoire de Davy.** Les primitives d’une même fonction sont des « courbes jumelles » translatées verticalement : même pente partout, hauteur différente.`,
    keyPoint: "Si F est une primitive de f sur I, toutes les primitives sont F+c, avec c∈ℝ.",
    example: "Les primitives de $-1/x^2$ sur $]0,+\\infty[$ sont $1/x+c$.",
    methodSteps: [
      "Trouve ou reconnais une primitive particulière F.",
      "Ajoute la constante réelle c.",
      "Précise l’intervalle sur lequel la formule est valable.",
      "Dérive F+c pour contrôler que la constante disparaît.",
    ],
    timeline: [
      { label: "Une primitive", detail: "Trouver une fonction F telle que F′=f." },
      { label: "Constante", detail: "Écrire F+c avec c réel." },
      { label: "Intervalle", detail: "Conserver le domaine où f et F sont définies." },
      { label: "Contrôle", detail: "La dérivée de c vaut zéro." },
    ],
    questions: [
      choice("Si $F$ est une primitive de $f$, quelle forme décrit toutes les primitives ?", ["$F+c$", "$cF$", "$F/c$", "$F'+c$"], 0, "Deux primitives d’une même fonction diffèrent d’une constante.", "Propriété • page 2"),
      choice("$F(x)=x^3/3-x^2/2$ est-elle une primitive de $f(x)=x^2-x$ ?", ["Oui", "Non"], 0, "$F'(x)=x^2-x$.", "Exercice de fixation 1 • page 2"),
      choice("Laquelle est une autre primitive de $f(x)=x^2-x$ ?", ["$F(x)-29$", "$29F(x)$", "$F(x)-29x$", "$F'(x)-29$"], 0, "Ajouter une constante ne change pas la dérivée.", "Exercice de fixation 1 • page 2", 2),
      choice("Toutes les primitives de $-1/x^2$ sur $]0,+\\infty[$ sont :", ["$1/x+c$", "$-1/x+c$", "$1/x^2+c$", "$-2/x^3+c$"], 0, "$(1/x)'=-1/x^2$.", "Exercice de fixation 2 • page 3", 2),
      short("Quelle est la dérivée de la constante $546$ ?", ["0"], "La constante disparaît à la dérivation.", "Propriété • pages 2-3"),
    ],
  },
  {
    id: "primitive-initial-value",
    title: "Imposer une valeur à une primitive",
    summary: "Déterminer l’unique constante qui satisfait une condition initiale.",
    pages: "3",
    section: "I-4. Primitive prenant une valeur donnée",
    durationMinutes: 24,
    body: String.raw`## Propriété d’unicité

Soit $f$ une fonction admettant une primitive $F$ sur un intervalle $I$. Soient $x_0\in I$ et $y_0\in\mathbb R$.

Il existe **une primitive et une seule** de $f$ sur $I$ qui prend la valeur $y_0$ en $x_0$.

La famille des primitives est

$$
H(x)=F(x)+c.
$$

La condition

$$
H(x_0)=y_0
$$

détermine l’unique constante $c$.

## Exercice de fixation

Soit $g(x)=2x-1$. Une primitive est

$$
G(x)=x^2-x.
$$

Cherchons la primitive $H$ telle que $H(-1)=5$ :

$$
H(x)=x^2-x+c.
$$

Alors

$$
H(-1)=(-1)^2-(-1)+c=2+c=5,
$$

d’où

$$
c=3
\qquad\text{et}\qquad
H(x)=x^2-x+3.
$$

Vérification :

$$
H(-1)=1+1+3=5.
$$

> **Astuce mémoire de Davy.** « Une condition, une constante. » Écris d’abord $F+c$, puis seulement après remplace $x$ par $x_0$.`,
    keyPoint: "La condition H(x₀)=y₀ sélectionne une unique primitive dans la famille F+c.",
    example: "$H(-1)=5$ dans la famille $x^2-x+c$ donne $2+c=5$, donc $c=3$.",
    methodSteps: [
      "Écris la famille complète H(x)=F(x)+c.",
      "Remplace x par la valeur imposée x₀.",
      "Résous l’équation H(x₀)=y₀ pour trouver c.",
      "Vérifie la condition dans la formule finale.",
    ],
    timeline: [
      { label: "Famille", detail: "Conserver la constante c dès le départ." },
      { label: "Valeur", detail: "Remplacer x par x₀." },
      { label: "Équation", detail: "Résoudre pour obtenir c." },
      { label: "Vérification", detail: "Recalculer H(x₀)." },
    ],
    questions: [
      choice("Combien de primitives prennent une valeur donnée en un point donné ?", ["Aucune", "Une seule", "Deux", "Une infinité"], 1, "La condition fixe l’unique constante de la famille.", "Propriété • page 3"),
      short("Pour $H(x)=x^2-x+c$ et $H(-1)=5$, calcule $c$.", ["3", "+3"], "$H(-1)=2+c=5$.", "Exercice de fixation • page 3", 2),
      choice("Quelle est la primitive demandée dans le PDF ?", ["$x^2-x+3$", "$x^2-x-3$", "$2x-1+3$", "$x^2+x+3$"], 0, "La constante trouvée vaut $3$.", "Exercice de fixation • page 3", 2),
      choice("Quelle vérification termine correctement le calcul ?", ["$H(-1)=5$", "$H(5)=-1$", "$H'(3)=5$", "$H(0)=5$"], 0, "Il faut contrôler la condition initiale donnée.", "Exercice de fixation • page 3"),
    ],
  },
  {
    id: "usual-primitives",
    title: "Maîtriser les primitives usuelles",
    summary: "Lire à l’envers les dérivées des constantes, puissances, racines et fonctions trigonométriques.",
    pages: "3-4",
    section: "II-1. Primitives des fonctions usuelles",
    durationMinutes: 38,
    body: String.raw`## Tableau des primitives usuelles

Dans chaque ligne, $c\in\mathbb R$.

| Fonction $f(x)$ | Primitives $F(x)$ | Intervalle |
|---|---|---|
| $a$ | $ax+c$ | $\mathbb R$ |
| $x^r$, $r\ne-1$ | $\dfrac{x^{r+1}}{r+1}+c$ | intervalle où la puissance est définie |
| $\dfrac1{x^r}$, $r\ne1$ | $-\dfrac1{(r-1)x^{r-1}}+c$ | $]-\infty;0[$ ou $]0;+\infty[$ |
| $\dfrac1{\sqrt x}$ | $2\sqrt x+c$ | $]0;+\infty[$ |
| $\cos x$ | $\sin x+c$ | $\mathbb R$ |
| $\sin x$ | $-\cos x+c$ | $\mathbb R$ |
| $\dfrac1{\cos^2x}$ | $\tan x+c$ | intervalle ne contenant aucun $\dfrac\pi2+k\pi$ |
| $\dfrac1{\sin^2x}$ | $-\operatorname{cotan}x+c$ | intervalle ne contenant aucun $k\pi$ |

## Règle des puissances

Pour $r\ne-1$ :

$$
\int x^r\,dx=\frac{x^{r+1}}{r+1}+c.
$$

On **ajoute $1$ à l’exposant**, puis on divise par ce nouvel exposant.

## Exercice de fixation

Sur les intervalles appropriés :

$$
\int x^3\,dx=\frac{x^4}{4}+c,
$$

$$
\int\frac1{x^5}\,dx=-\frac1{4x^4}+c,
$$

et

$$
\int x^{2/3}\,dx=\frac35x^{5/3}+c.
$$

> **Correction de source importante.** Le PDF imprime $-3x^{-1/3}+c$ pour $x^{2/3}$. Cette formule dérive en $x^{-4/3}$ et ne convient pas. La primitive correcte est $\dfrac35x^{5/3}+c$.

> **Astuce mémoire de Davy.** Puissance : « exposant $+1$, puis division ». Inverse de puissance : réécris d’abord avec un exposant négatif.`,
    keyPoint: "Pour r≠−1 : ∫x^r dx = x^(r+1)/(r+1)+c, sur un intervalle adapté.",
    example: "$x^{2/3}$ a pour primitives $\\frac35x^{5/3}+c$, car la dérivée redonne $x^{2/3}$.",
    methodSteps: [
      "Réécris les quotients comme des puissances négatives.",
      "Ajoute 1 à l’exposant et vérifie qu’il n’est pas nul.",
      "Divise par le nouvel exposant.",
      "Ajoute c, précise l’intervalle et dérive pour contrôler.",
    ],
    timeline: [
      { label: "Identifier", detail: "Constante, puissance, racine ou trigonométrie." },
      { label: "Transformer", detail: "Réécrire 1/x^r sous la forme x^(-r)." },
      { label: "Primitiver", detail: "Appliquer la ligne exacte du tableau." },
      { label: "Dériver", detail: "Le contrôle détecte immédiatement un signe faux." },
    ],
    corrections: [
      "Dans l’exercice de fixation de la page 4, la primitive imprimée pour x^(2/3) est fausse. La primitive correcte est (3/5)x^(5/3)+c, obtenue par la règle des puissances.",
    ],
    questions: [
      choice("Une primitive de $x^3$ est :", ["$3x^2$", "$x^4/4$", "$x^4$", "$x^2/2$"], 1, "On ajoute $1$ à l’exposant puis on divise par $4$.", "Exercice de fixation • page 4", 2),
      choice("Une primitive de $1/x^5$ est :", ["$1/(4x^4)$", "$-1/(4x^4)$", "$-5/x^6$", "$\\ln x$"], 1, "Écrire $x^{-5}$ donne $x^{-4}/(-4)$.", "Exercice de fixation • page 4", 2),
      choice("Une primitive correcte de $x^{2/3}$ est :", ["$-3x^{-1/3}$", "$(3/5)x^{5/3}$", "$(2/3)x^{-1/3}$", "$x^{3/2}$"], 1, "La dérivée de $(3/5)x^{5/3}$ vaut $x^{2/3}$.", "Exercice corrigé • page 4", 2),
      choice("Une primitive de $\\cos x$ est :", ["$-\\sin x$", "$\\sin x$", "$\\cos x$", "$-\\cos x$"], 1, "$(\\sin x)'=\\cos x$.", "Tableau • pages 3-4"),
      choice("Une primitive de $\\sin x$ est :", ["$\\cos x$", "$-\\cos x$", "$\\tan x$", "$-\\sin x$"], 1, "$(-\\cos x)'=\\sin x$.", "Tableau • pages 3-4"),
      choice("Une primitive de $1/\\cos^2x$ est :", ["$\\tan x$", "$-\\tan x$", "$\\cos x$", "$\\sin x$"], 0, "$(\\tan x)'=1/\\cos^2x$ sur chaque intervalle de définition.", "Tableau • page 4"),
      choice("Pourquoi précise-t-on un intervalle pour $1/x^5$ ?", ["La fonction est périodique", "Le point $0$ est interdit", "La fonction est constante", "L’exposant est positif"], 1, "Le domaine est séparé par $0$.", "Tableau • pages 3-4"),
      short("Dérive $(3/5)x^{5/3}$.", ["x^(2/3)", "x^2/3", "x²/³"], "Le facteur $(3/5)(5/3)$ vaut $1$.", "Contrôle de la correction • page 4"),
    ],
  },
  {
    id: "primitive-linearity",
    title: "Primitiver une somme ou un multiple",
    summary: "Utiliser la linéarité pour décomposer une fonction et primitiver terme à terme.",
    pages: "4",
    section: "II-2. Opérations sur les primitives",
    durationMinutes: 28,
    body: String.raw`## Propriétés de linéarité

Soient $u$ et $v$ deux fonctions admettant respectivement pour primitives $U$ et $V$ sur un intervalle $I$.

- $U+V$ est une primitive de $u+v$.
- Pour tout réel $k$, $kU$ est une primitive de $ku$.

En écriture compacte :

$$
\int(au+bv)\,dx
=a\int u\,dx+b\int v\,dx.
$$

On ajoute **une seule constante** à la fin.

## Exercice de fixation

**a)** Pour $f(x)=x+\sin x$ :

$$
F(x)=\frac{x^2}{2}-\cos x+c.
$$

**b)** Pour $f(x)=\sin x+\cos x$ :

$$
F(x)=-\cos x+\sin x+c.
$$

**c)** Pour $f(x)=8x^2+5x-9$ :

$$
F(x)=\frac83x^3+\frac52x^2-9x+c.
$$

> **Erreur fréquente.** N’ajoute pas une constante différente à chaque terme. Leur somme est encore une seule constante réelle.

> **Astuce mémoire de Davy.** « Je découpe, je primitive, je rassemble, puis je dérive pour vérifier. »`,
    keyPoint: "La primitive d’une combinaison linéaire est la même combinaison linéaire des primitives.",
    example: "$8x^2+5x-9$ a pour primitives $\\frac83x^3+\\frac52x^2-9x+c$.",
    methodSteps: [
      "Sépare la fonction en termes usuels.",
      "Garde chaque coefficient devant son terme.",
      "Primitive chaque terme avec la bonne formule.",
      "Ajoute une seule constante c et vérifie par dérivation.",
    ],
    timeline: [
      { label: "Découper", detail: "Repérer chaque terme de la somme." },
      { label: "Coefficients", detail: "Conserver les facteurs constants." },
      { label: "Primitives", detail: "Appliquer les formules usuelles terme à terme." },
      { label: "Rassembler", detail: "Ajouter une seule constante." },
    ],
    questions: [
      choice("Une primitive de $x+\\sin x$ est :", ["$x^2/2-\\cos x$", "$1+\\cos x$", "$x^2+\\cos x$", "$x-\\sin x$"], 0, "$(x^2/2)'=x$ et $(-\\cos x)'=\\sin x$.", "Exercice de fixation a • page 4", 2),
      choice("Une primitive de $\\sin x+\\cos x$ est :", ["$\\cos x-\\sin x$", "$-\\cos x+\\sin x$", "$\\sin x+\\cos x$", "$-\\sin x-\\cos x$"], 1, "On lit les deux dérivées trigonométriques à l’envers.", "Exercice de fixation b • page 4", 2),
      choice("Une primitive de $8x^2+5x-9$ est :", ["$16x+5-9x$", "$(8/3)x^3+(5/2)x^2-9x$", "$8x^3+5x^2-9$", "$(4/3)x^3+5x^2-9x$"], 1, "Chaque terme est primitivé séparément.", "Exercice de fixation c • page 4", 2),
      short("Quel est le coefficient de $x^3$ dans une primitive de $8x^2$ ?", ["8/3", "8÷3"], "La primitive de $x^2$ est $x^3/3$.", "Exercice de fixation c • page 4"),
      choice("Combien de constantes ajoute-t-on à la fin ?", ["Aucune", "Une seule", "Une par terme", "Deux"], 1, "La somme de plusieurs constantes reste une constante.", "Méthode de linéarité"),
      choice("La dérivée de $(8/3)x^3+(5/2)x^2-9x$ vaut :", ["$8x^2+5x-9$", "$8x^3+5x^2-9x$", "$8x+5-9$", "$24x^2+10x-9$"], 0, "Cette vérification confirme toute la primitive.", "Exercice de fixation c • page 4"),
    ],
  },
  {
    id: "composite-primitives",
    title: "Reconnaître les formes composées",
    summary: "Identifier une fonction intérieure $u$ et sa dérivée $u'$ pour appliquer les formules composées.",
    pages: "4-5",
    section: "II-3. Primitives des fonctions composées",
    durationMinutes: 46,
    body: String.raw`## Propriété de composition

Si $U$ est dérivable sur $I$ et si $V$ est une primitive de $v$, alors une primitive de

$$
x\longmapsto U'(x)\,v(U(x))
$$

est

$$
x\longmapsto V(U(x)).
$$

## Tableau des formes à reconnaître

| Fonction | Une primitive |
|---|---|
| $u'u^r$, $r\ne-1$ | $\dfrac{u^{r+1}}{r+1}$ |
| $\dfrac{u'}{u^r}$, $r\ne1$ | $-\dfrac1{(r-1)u^{r-1}}$ |
| $\dfrac{u'}{\sqrt u}$ | $2\sqrt u$ |
| $u'\cos u$ | $\sin u$ |
| $\cos(ax+b)$, $a\ne0$ | $\dfrac1a\sin(ax+b)$ |
| $u'\sin u$ | $-\cos u$ |
| $\sin(ax+b)$, $a\ne0$ | $-\dfrac1a\cos(ax+b)$ |

Les domaines doivent rendre les expressions définies, en particulier $u>0$ lorsqu’une racine ou une puissance négative l’exige.

## Fixation 1

$$
\int 3\sin(2x)\,dx=-\frac32\cos(2x)+c,
$$

$$
\int 2\sqrt{2x+1}\,dx=\frac23(2x+1)^{3/2}+c,
$$

$$
\int\frac3{(3x+5)^2}\,dx=-\frac1{3x+5}+c.
$$

## Fixation 2

$$
\int(2x+1)(x^2+x+6)^3\,dx
=\frac14(x^2+x+6)^4+c,
$$

$$
\int\frac{2x+3}{(x^2+3x+3)^4}\,dx
=-\frac1{3(x^2+3x+3)^3}+c,
$$

$$
\int\sin x\cos^5x\,dx=-\frac16\cos^6x+c,
$$

$$
\int\frac{2x+1}{\sqrt{x^2+x+1}}\,dx
=2\sqrt{x^2+x+1}+c.
$$

> **Astuce mémoire de Davy.** Encercle l’intérieur $u$, puis cherche sa dérivée juste devant. Si elle n’est présente qu’à un facteur constant près, ajuste ce facteur.`,
    keyPoint: "Repérer u et u′ transforme une forme composée en primitive usuelle.",
    example: "Avec $u=x^2+x+6$, $u'=2x+1$ et $\\int u'u^3=\\frac14u^4+c$.",
    methodSteps: [
      "Choisis l’expression intérieure u(x).",
      "Calcule u′(x) et compare-la au facteur présent.",
      "Ajuste le coefficient constant manquant.",
      "Applique la formule composée, puis dérive pour contrôler.",
    ],
    timeline: [
      { label: "Intérieur", detail: "Encadrer l’expression répétée u(x)." },
      { label: "Dérivée", detail: "Calculer u′ et la rechercher dans l’intégrande." },
      { label: "Coefficient", detail: "Compenser seulement par un facteur constant." },
      { label: "Composition", detail: "Appliquer la primitive usuelle à u." },
    ],
    questions: [
      choice("Une primitive de $3\\sin(2x)$ est :", ["$6\\cos(2x)$", "$-(3/2)\\cos(2x)$", "$(3/2)\\cos(2x)$", "$-3\\cos x$"], 1, "La dérivée de $\\cos(2x)$ vaut $-2\\sin(2x)$.", "Fixation 1a • page 5", 2),
      choice("Une primitive de $2\\sqrt{2x+1}$ est :", ["$(2x+1)^{3/2}$", "$(2/3)(2x+1)^{3/2}$", "$2/(\\sqrt{2x+1})$", "$(4/3)(2x+1)^{3/2}$"], 1, "La dérivation produit le facteur $3$ puis le facteur intérieur $2$.", "Fixation 1b • page 5", 2),
      choice("Une primitive de $3/(3x+5)^2$ est :", ["$-1/(3x+5)$", "$1/(3x+5)$", "$-3/(3x+5)$", "$\\ln(3x+5)$"], 0, "La dérivée de $-(3x+5)^{-1}$ vaut $3(3x+5)^{-2}$.", "Fixation 1c • page 5", 2),
      choice("Pour $(2x+1)(x^2+x+6)^3$, quel choix convient pour $u$ ?", ["$u=2x+1$", "$u=x^2+x+6$", "$u=x^3$", "$u=6$"], 1, "Sa dérivée est exactement $2x+1$.", "Fixation 2a • page 5"),
      choice("Une primitive de $(2x+1)(x^2+x+6)^3$ est :", ["$(x^2+x+6)^4/4$", "$(x^2+x+6)^2/2$", "$(2x+1)^4/4$", "$3(x^2+x+6)^2$"], 0, "C’est la forme $u'u^3$.", "Fixation 2a • page 5", 2),
      choice("Une primitive de $(2x+3)/(x^2+3x+3)^4$ est :", ["$-1/[3(x^2+3x+3)^3]$", "$1/[4(x^2+3x+3)^4]$", "$\\ln(x^2+3x+3)$", "$-3/(x^2+3x+3)$"], 0, "La dérivée intérieure est $2x+3$ et l’exposant passe de $-4$ à $-3$.", "Fixation 2b • page 5", 2),
      choice("Une primitive de $\\sin x\\cos^5x$ est :", ["$\\cos^6x/6$", "$-\\cos^6x/6$", "$\\sin^6x/6$", "$-\\sin^6x/6$"], 1, "Avec $u=\\cos x$, $u'=-\\sin x$ : un signe moins est nécessaire.", "Fixation 2c • page 5", 2),
      choice("Une primitive de $(2x+1)/\\sqrt{x^2+x+1}$ est :", ["$\\sqrt{x^2+x+1}$", "$2\\sqrt{x^2+x+1}$", "$1/\\sqrt{x^2+x+1}$", "$\\ln(x^2+x+1)$"], 1, "La forme $u'/\\sqrt u$ a pour primitive $2\\sqrt u$.", "Fixation 2d • page 5", 2),
      choice("Quel contrôle sécurise le résultat final ?", ["Développer au hasard", "Dériver la primitive proposée", "Changer l’intervalle", "Supprimer la constante"], 1, "La dérivée doit redonner exactement la fonction.", "Méthode • pages 4-5"),
    ],
  },
  {
    id: "bus-cost-mission",
    title: "Mission : minimiser le coût d’un voyage",
    summary: "Construire une fonction de coût à partir d’une dérivée et déterminer la vitesse la plus économique.",
    pages: "6-7",
    section: "Situation complexe : car Abidjan–Dakar",
    durationMinutes: 48,
    kind: "challenge",
    body: String.raw`## Situation

Un car doit parcourir $1\,500$ km. Pour une vitesse constante $v$ exprimée en km/h, sa consommation pour $100$ km est $C(v)$ litres, avec

$$
C'(v)=-\frac{300}{v^2}+\frac13
\qquad\text{et}\qquad
C(60)=25.
$$

Le chauffeur est payé $900$ F CFA par heure et le carburant coûte $600$ F CFA par litre.

## 1. Retrouver la consommation

Une primitive de $C'$ est

$$
C(v)=\frac{300}{v}+\frac v3+k.
$$

La condition $C(60)=25$ donne

$$
\frac{300}{60}+\frac{60}{3}+k=25
\Longleftrightarrow
5+20+k=25,
$$

donc $k=0$ :

$$
C(v)=\frac{300}{v}+\frac v3.
$$

## 2. Construire le prix du voyage

La durée du voyage est $1\,500/v$ heures. Le salaire vaut donc

$$
\frac{1\,350\,000}{v}.
$$

Le trajet représente $15$ fois $100$ km. Il faut $15C(v)$ litres, soit un coût de carburant

$$
600\times15C(v)
=\frac{2\,700\,000}{v}+3\,000v.
$$

Le prix total est alors

$$
P(v)=\frac{4\,050\,000}{v}+3\,000v.
$$

## 3. Minimiser

$$
P'(v)=-\frac{4\,050\,000}{v^2}+3\,000.
$$

L’équation $P'(v)=0$ donne

$$
v^2=1\,350
\qquad\Longrightarrow\qquad
v=\sqrt{1\,350}\approx36{,}74.
$$

La vitesse entière la plus économique est donc environ

$$
37\ \text{km/h}.
$$

Le coût minimal est voisin de

$$
P(\sqrt{1\,350})\approx220\,454\ \text{F CFA},
$$

soit environ $220\,500$ F CFA.

> **Astuce mémoire de Davy.** Dans un problème économique : retrouve d’abord la fonction avec la condition, traduis chaque coût dans la même unité, puis seulement dérive.`,
    keyPoint: "P(v)=4 050 000/v+3 000v est minimale pour v=√1 350≈36,74 km/h.",
    example: "La condition $C(60)=25$ annule la constante et conduit à $C(v)=300/v+v/3$.",
    methodSteps: [
      "Primitive C′ et utilise C(60)=25 pour déterminer la constante.",
      "Exprime séparément la durée, le salaire et le coût du carburant.",
      "Additionne les coûts pour obtenir P(v).",
      "Étudie le signe de P′ et arrondis la vitesse selon la consigne.",
    ],
    timeline: [
      { label: "Consommation", detail: "Retrouver C à partir de C′ et de la valeur à 60 km/h." },
      { label: "Durée", detail: "Utiliser temps = distance / vitesse." },
      { label: "Prix", detail: "Additionner salaire et carburant." },
      { label: "Minimum", detail: "Résoudre P′(v)=0 puis interpréter." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Coût interactif",
      title: "Déplace la vitesse du car",
      instruction: "Fais varier v et observe le creux de la courbe du coût total.",
      observation: "Le coût baisse d’abord parce que le temps de trajet diminue, puis remonte parce que la consommation liée à la vitesse augmente.",
      formula: "P(v) = 4 050 000/v + 3 000v",
      formulaTex: String.raw`P(v)=\frac{4\,050\,000}{v}+3\,000v`,
      rule: { kind: "affine-plus-reciprocal", slope: 3000, intercept: 0, coefficient: 4050000, shift: 0 },
      window: { xMin: 20, xMax: 100, yMin: 200000, yMax: 520000 },
      guides: [
        { kind: "vertical", value: Math.sqrt(1350), label: "v = √1 350" },
        { kind: "horizontal", value: 220454, label: "coût minimal ≈ 220 454" },
      ],
      marker: { min: 20, max: 100, step: 1, initial: 37 },
    },
    questions: [
      choice("Quelle famille de fonctions obtient-on en primitivant $C'(v)$ ?", ["$300/v+v/3+k$", "$-300/v+v/3+k$", "$300v+v^2/6+k$", "$300/v-v/3+k$"], 0, "$(300/v)'=-300/v^2$.", "Situation complexe • page 6", 2),
      short("Quelle constante impose $C(60)=25$ ?", ["0"], "$300/60+60/3=25$, donc $k=0$.", "Situation complexe • page 6", 2),
      choice("Quelle est la durée du voyage en heures ?", ["$1500v$", "$1500/v$", "$v/1500$", "$100/v$"], 1, "Le temps est la distance divisée par la vitesse.", "Situation complexe • page 6"),
      choice("Quel est le salaire total du chauffeur ?", ["$900v$", "$1\\,350\\,000/v$", "$1\\,500/v$", "$600C(v)$"], 1, "$900\\times1500/v=1\\,350\\,000/v$.", "Situation complexe • page 6", 2),
      choice("Quel est le coût du carburant pour le trajet ?", ["$2\\,700\\,000/v+3\\,000v$", "$300/v+v/3$", "$1\\,350\\,000/v$", "$600v$"], 0, "Le trajet consomme $15C(v)$ litres, multipliés par $600$ F.", "Situation complexe • pages 6-7", 2),
      choice("Quelle expression donne le coût total ?", ["$4\\,050\\,000/v+3\\,000v$", "$2\\,700\\,000/v+3\\,000v$", "$4\\,050\\,000v+3\\,000/v$", "$1\\,350\\,000/v$"], 0, "On additionne salaire et carburant.", "Situation complexe • page 7", 2),
      choice("$P'(v)=0$ conduit à :", ["$v^2=1350$", "$v=1350$", "$v^2=3000$", "$v=25$"], 0, "$3\\,000=4\\,050\\,000/v^2$.", "Situation complexe • page 7", 2),
      choice("Quelle vitesse entière minimise approximativement le coût ?", ["$25$ km/h", "$37$ km/h", "$60$ km/h", "$100$ km/h"], 1, "$\\sqrt{1350}\\approx36,74$.", "Situation complexe • page 7", 2),
      choice("Quel est le coût minimal approximatif ?", ["$25\\,000$ F", "$135\\,000$ F", "$220\\,500$ F", "$4\\,050\\,000$ F"], 2, "On évalue P à la vitesse critique.", "Situation complexe • page 7", 2),
    ],
  },
  {
    id: "official-applications-workshop",
    title: "Atelier des applications officielles",
    summary: "Résoudre les exercices d’application 1 à 4 en justifiant chaque primitive par dérivation.",
    pages: "7-8",
    section: "Exercices d’application 1 à 4",
    durationMinutes: 54,
    kind: "practice",
    body: String.raw`## Stratégie de l’atelier

Les exercices d’application du PDF mobilisent quatre réflexes :

1. dériver une fonction proposée pour décider si elle est primitive ;
2. reconnaître une forme composée $u'u^r$ ;
3. développer ou réécrire une expression avant de primitiver ;
4. contrôler systématiquement la réponse.

## Résultats à savoir reconstruire

### Exercice 1

- $F(x)=x^3-2x^2+x-\pi$ est bien une primitive de $3x^2-4x+1$.
- La fonction

$$
P(x)=\frac12x^2+\frac1x-2\sqrt x+1
$$

ne vérifie pas $P(1)=-\frac12$ : elle vaut en réalité $\frac12$ en $1$.
- Une primitive de $u'v+uv'$ est $uv$.

### Exercice 2

Sur les intervalles indiqués :

$$
\int\frac1{(2x+5)^2}\,dx
=-\frac1{2(2x+5)}+c,
$$

$$
\int(3x+2)(3x^2+4x+7)^3\,dx
=\frac18(3x^2+4x+7)^4+c,
$$

$$
\int\frac{4x^3}{\sqrt{x^4+1}}\,dx
=2\sqrt{x^4+1}+c.
$$

### Exercice 3

Pour $x>0$,

$$
f(x)=x(5\sqrt x+4)
$$

et

$$
F(x)=2x^2(\sqrt x+1).
$$

En développant $F(x)=2x^{5/2}+2x^2$, on obtient

$$
F'(x)=5x^{3/2}+4x=x(5\sqrt x+4)=f(x).
$$

### Exercice 4

Les primitives attendues sont détaillées dans la correction après validation.

> **Astuce mémoire de Davy.** Si une forme n’est pas immédiatement reconnaissable, simplifie-la avant de chercher la primitive.`,
    keyPoint: "Dériver la réponse finale reste la preuve commune à tous les exercices d’application.",
    example: "$F(x)=2x^2(\\sqrt x+1)$ se développe en $2x^{5/2}+2x^2$, puis $F'=x(5\\sqrt x+4)$.",
    methodSteps: [
      "Lis l’intervalle et les contraintes de domaine.",
      "Développe, factorise ou pose u selon la forme.",
      "Calcule la primitive avec une seule constante.",
      "Dérive la réponse et vérifie la condition éventuelle.",
    ],
    timeline: [
      { label: "Vrai/Faux", detail: "Dériver chaque fonction proposée." },
      { label: "Composition", detail: "Repérer u et u′." },
      { label: "Réécriture", detail: "Transformer les racines et quotients." },
      { label: "Validation", detail: "Contrôler par dérivation." },
    ],
    questions: [
      choice("$F(x)=x^3-2x^2+x-\\pi$ est-elle une primitive de $3x^2-4x+1$ ?", ["Vrai", "Faux"], 0, "$F'(x)=3x^2-4x+1$ ; la constante $-\\pi$ disparaît.", "Exercice d’application 1 • page 7", 2),
      choice("La fonction $P(x)=x^2/2+1/x-2\\sqrt x+1$ vérifie-t-elle $P(1)=-1/2$ ?", ["Vrai", "Faux"], 1, "$P(1)=1/2+1-2+1=1/2$.", "Exercice d’application 1 • page 7", 2),
      choice("Une primitive de $u'v+uv'$ est :", ["$uv$", "$u+v$", "$u/v$", "$u'v'$"], 0, "$(uv)'=u'v+uv'$.", "Exercice d’application 1 • page 7", 2),
      choice("Une primitive de $1/(2x+5)^2$ est :", ["$-1/[2(2x+5)]$", "$1/(2x+5)$", "$-2/(2x+5)$", "$\\ln(2x+5)$"], 0, "La dérivée de $-[2(2x+5)]^{-1}$ redonne l’intégrande.", "Exercice d’application 2.1 • page 7", 2),
      choice("Une primitive de $(3x+2)(3x^2+4x+7)^3$ est :", ["$(3x^2+4x+7)^4/8$", "$(3x^2+4x+7)^4/4$", "$(3x+2)^4/4$", "$\\ln(3x^2+4x+7)$"], 0, "La dérivée intérieure vaut $6x+4=2(3x+2)$.", "Exercice d’application 2.2 • page 7", 2),
      choice("Une primitive de $4x^3/\\sqrt{x^4+1}$ est :", ["$\\sqrt{x^4+1}$", "$2\\sqrt{x^4+1}$", "$4\\sqrt{x^4+1}$", "$(x^4+1)^{3/2}$"], 1, "Avec $u=x^4+1$, on a $u'=4x^3$ et $\\int u'/\\sqrt u=2\\sqrt u$.", "Exercice d’application 2.3 • page 8", 2),
      choice("Pour vérifier $F(x)=2x^2(\\sqrt x+1)$, quelle réécriture est utile ?", ["$2x^{5/2}+2x^2$", "$2x^3+2x$", "$x^{3/2}+1$", "$2x^2\\sqrt{x+1}$"], 0, "$x^2\\sqrt x=x^{5/2}$.", "Exercice d’application 3 • page 8"),
      choice("Une primitive de $(2x^6-3x+8)/(2x^4)$ sur $]0,+\\infty[$ est :", ["$x^3/3+3/(4x^2)-4/(3x^3)$", "$x^3/3-3/(4x^2)+4/(3x^3)$", "$x^2-3/(2x^3)+4/x^4$", "$\\ln x$"], 0, "On simplifie en $x^2-(3/2)x^{-3}+4x^{-4}$ avant de primitiver.", "Exercice d’application 4.1 • page 8", 3),
      choice("Une primitive de $2x/\\sqrt{x^2-9}$ sur $]3,+\\infty[$ est :", ["$\\sqrt{x^2-9}$", "$2\\sqrt{x^2-9}$", "$1/\\sqrt{x^2-9}$", "$\\ln(x^2-9)$"], 1, "Avec $u=x^2-9$, $u'=2x$ et la primitive est $2\\sqrt u$.", "Exercice d’application 4.2 • page 8", 2),
      choice("Une primitive de $(x-1)(x^2-2x+5)^3$ est :", ["$(x^2-2x+5)^4/8$", "$(x^2-2x+5)^4/4$", "$(x-1)^4/4$", "$\\ln(x^2-2x+5)$"], 0, "La dérivée intérieure vaut $2(x-1)$, d’où le facteur $1/8$.", "Exercice d’application 4.3 • page 8", 2),
      choice("Une primitive de $\\sin(3x-\\pi/5)$ est :", ["$-(1/3)\\cos(3x-\\pi/5)$", "$(1/3)\\cos(3x-\\pi/5)$", "$-3\\cos(3x-\\pi/5)$", "$\\cos(3x-\\pi/5)$"], 0, "La dérivée du cosinus composé apporte le facteur $-3$.", "Exercice d’application 4.4 • page 8", 2),
    ],
  },
  {
    id: "radical-coefficients-reinforcement",
    title: "Renforcement : retrouver trois coefficients",
    summary: "Identifier une primitive de la forme polynôme × racine en égalant les coefficients.",
    pages: "8-9",
    section: "Exercice de renforcement 5",
    durationMinutes: 34,
    kind: "practice",
    body: String.raw`## Énoncé officiel

Sur $]-\infty;3/2[$, on considère

$$
f(x)=x\sqrt{3-2x}
$$

et l’on cherche une primitive de la forme

$$
F(x)=(ax^2+bx+c)\sqrt{3-2x}.
$$

## Dérivation structurée

Posons $Q(x)=ax^2+bx+c$. Alors

$$
F'(x)=Q'(x)\sqrt{3-2x}
-\frac{Q(x)}{\sqrt{3-2x}}.
$$

En mettant au même dénominateur :

$$
F'(x)
=\frac{(2ax+b)(3-2x)-(ax^2+bx+c)}
{\sqrt{3-2x}}.
$$

Pour imposer $F'(x)=x\sqrt{3-2x}$, on écrit aussi

$$
x\sqrt{3-2x}
=\frac{x(3-2x)}{\sqrt{3-2x}}.
$$

L’identification des coefficients conduit au système du PDF :

$$
\begin{cases}
-5a=-2,\\
6a-3b=3,\\
3b-c=0.
\end{cases}
$$

On obtient

$$
a=\frac25,\qquad
b=-\frac15,\qquad
c=-\frac35.
$$

Ainsi, une primitive est

$$
F(x)=\left(\frac25x^2-\frac15x-\frac35\right)\sqrt{3-2x}.
$$

> **Astuce mémoire de Davy.** Quand l’énoncé impose une forme, ne cherche pas une autre primitive : dérive la forme proposée, réduis au même dénominateur et identifie les coefficients.`,
    keyPoint: "L’égalité F′=f se transforme en une identité polynomiale, puis en un système sur a, b et c.",
    example: "Le système $-5a=-2$, $6a-3b=3$, $3b-c=0$ donne $(a,b,c)=(2/5,-1/5,-3/5)$.",
    methodSteps: [
      "Pose Q(x)=ax²+bx+c et dérive le produit Q(x)√(3−2x).",
      "Mets les termes au même dénominateur.",
      "Compare le numérateur à celui de f(x).",
      "Résous le système puis vérifie au moins un coefficient.",
    ],
    timeline: [
      { label: "Produit", detail: "Appliquer la dérivée d’un produit." },
      { label: "Racine", detail: "La dérivée de √(3−2x) vaut −1/√(3−2x)." },
      { label: "Identifier", detail: "Égaler les coefficients des mêmes puissances de x." },
      { label: "Résoudre", detail: "Trouver a, b et c." },
    ],
    questions: [
      choice("Pourquoi travaille-t-on sur $]-\\infty,3/2[$ ?", ["Pour que $3-2x>0$", "Pour que $x>0$", "Pour annuler la racine", "Pour rendre f constante"], 0, "La racine et sa dérivée exigent ici $3-2x>0$.", "Exercice 5 • page 8"),
      choice("Quel système est obtenu dans le PDF ?", ["$-5a=-2$, $6a-3b=3$, $3b-c=0$", "$5a=-2$, $6a+3b=3$, $3b+c=0$", "$a=0$, $b=0$, $c=0$", "$2a=5$, $b=1$, $c=3$"], 0, "Il résulte de l’identification des coefficients.", "Exercice 5 • pages 8-9", 2),
      short("Calcule $a$ à partir de $-5a=-2$.", ["2/5", "0.4", "0,4"], "On divise les deux membres par $-5$.", "Exercice 5 • page 9"),
      short("Calcule $b$.", ["-1/5", "-0.2", "-0,2"], "Avec $a=2/5$, l’équation $6a-3b=3$ donne $b=-1/5$.", "Exercice 5 • page 9", 2),
      short("Calcule $c$.", ["-3/5", "-0.6", "-0,6"], "$3b-c=0$ donne $c=3b=-3/5$.", "Exercice 5 • page 9", 2),
      choice("Quelle primitive est obtenue ?", ["$(2x^2/5-x/5-3/5)\\sqrt{3-2x}$", "$(2x^2/5+x/5+3/5)\\sqrt{3-2x}$", "$(2x^2-x-3)\\sqrt{3-2x}$", "$(x^2-x-3)/(5\\sqrt{3-2x})$"], 0, "On remplace a, b et c dans la forme imposée.", "Exercice 5 • page 9", 3),
    ],
  },
  {
    id: "derivative-links-reinforcement",
    title: "Renforcement : exploiter une dérivée cachée",
    summary: "Transformer les exercices 6 à 8 en dérivées de quotients ou de produits déjà connus.",
    pages: "9",
    section: "Exercices de renforcement 6 à 8",
    durationMinutes: 42,
    kind: "practice",
    body: String.raw`## Exercice 6 : construire une primitive avec une identité

Sur $\mathbb R$ :

$$
f(x)=\frac{-x^3+2x^2+2}{x^2+1},
\qquad
h(x)=\frac{x^4+3x^2-4x}{(x^2+1)^2}.
$$

Le calcul du PDF établit

$$
h(x)=-f'(x)-\frac{4x}{(x^2+1)^2}.
$$

Or

$$
\left(\frac2{x^2+1}\right)'
=-\frac{4x}{(x^2+1)^2}.
$$

Ainsi, les primitives de $h$ sont

$$
H(x)=-f(x)+\frac2{x^2+1}+c.
$$

La condition $H(0)=2$ donne $c=2$, donc

$$
H(x)=-f(x)+\frac2{x^2+1}+2.
$$

## Exercice 7 : produit trigonométrique

Pour $f(x)=x\cos x$, posons $g(x)=x\sin x$. Alors

$$
g'(x)=\sin x+x\cos x.
$$

Donc

$$
(x\sin x+\cos x)'=x\cos x,
$$

et une primitive de $f$ est

$$
x\sin x+\cos x.
$$

## Exercice 8 : quotients à reconnaître

Sur $]0,+\infty[$ :

$$
\left(-\frac{\cos x}{x}\right)'
=\frac{x\sin x+\cos x}{x^2},
$$

$$
\left(-\frac{\sin x}{x}\right)'
=\frac{\sin x-x\cos x}{x^2}.
$$

> **Astuce mémoire de Davy.** Si un numérateur ressemble à la formule $(u/v)'$, essaie de reconstruire le quotient avant de développer davantage.`,
    keyPoint: "Une identité de dérivées permet de primitiver terme à terme sans recommencer tout le calcul.",
    example: "$h=-f'-4x/(x^2+1)^2$ conduit à $H=-f+2/(x^2+1)+c$.",
    methodSteps: [
      "Repère la dérivée déjà présente dans l’énoncé.",
      "Réécris les termes restants comme dérivées usuelles.",
      "Assemble la primitive et ajoute c.",
      "Utilise la condition éventuelle puis dérive l’expression finale.",
    ],
    timeline: [
      { label: "Identité", detail: "Exploiter la relation donnée entre h et f′." },
      { label: "Complément", detail: "Reconnaître une dérivée de quotient." },
      { label: "Primitive", detail: "Lire chaque dérivée à l’envers." },
      { label: "Condition", detail: "Déterminer la constante si nécessaire." },
    ],
    questions: [
      choice("Quelle identité établit l’exercice 6 ?", ["$h=-f'-4x/(x^2+1)^2$", "$h=f'+4x/(x^2+1)$", "$h=-f+2/(x^2+1)$", "$h=f''$"], 0, "C’est le résultat du calcul de $f'$ donné dans la correction.", "Exercice 6.1 • page 9", 2),
      choice("Une primitive de $-4x/(x^2+1)^2$ est :", ["$2/(x^2+1)$", "$-2/(x^2+1)$", "$\\ln(x^2+1)$", "$-4/(x^2+1)$"], 0, "La dérivée de $2(x^2+1)^{-1}$ vaut le terme demandé.", "Exercice 6 • page 9", 2),
      choice("Quelle famille de primitives obtient-on pour $h$ ?", ["$-f+2/(x^2+1)+c$", "$f+2/(x^2+1)+c$", "$-f-2/(x^2+1)+c$", "$h'+c$"], 0, "On primitive les deux termes de l’identité.", "Exercice 6.2 • page 9", 2),
      short("Quelle constante impose $H(0)=2$ ?", ["2", "+2"], "$f(0)=2$, donc $H(0)=-2+2+c=c$.", "Exercice 6.2 • page 9", 2),
      choice("Si $g(x)=x\\sin x$, alors $g'(x)$ vaut :", ["$\\sin x+x\\cos x$", "$x\\cos x$", "$\\cos x+x\\sin x$", "$\\sin x-x\\cos x$"], 0, "On applique la dérivée d’un produit.", "Exercice 7.1 • page 9"),
      choice("Une primitive de $x\\cos x$ est :", ["$x\\sin x+\\cos x$", "$x\\sin x-\\cos x$", "$\\sin x+x\\cos x$", "$x^2\\sin x$"], 0, "La dérivée des deux termes fait disparaître les $\\sin x$.", "Exercice 7.2 • page 9", 2),
      choice("Une primitive de $(x\\sin x+\\cos x)/x^2$ est :", ["$-\\cos x/x$", "$\\cos x/x$", "$-\\sin x/x$", "$\\ln x$"], 0, "On reconnaît la dérivée du quotient $-\\cos x/x$.", "Exercice 8.1 • page 9", 2),
      choice("Une primitive de $(\\sin x-x\\cos x)/x^2$ est :", ["$-\\sin x/x$", "$\\sin x/x$", "$-\\cos x/x$", "$\\tan x$"], 0, "La dérivée de $\\sin x/x$ est l’opposé de la fonction donnée.", "Exercice 8.2 • page 9", 2),
    ],
  },
  {
    id: "composite-reinforcement-workshop",
    title: "Renforcement : compositions et trigonométrie",
    summary: "Résoudre les exercices 9 à 11 par changement de forme, identité trigonométrique ou quotient.",
    pages: "9-10",
    section: "Exercices de renforcement 9 à 11",
    durationMinutes: 58,
    kind: "practice",
    body: String.raw`## Exercice 9 : six formes composées

Les substitutions utiles sont indiquées ici ; les réponses sont vérifiées dans les exercices.

1. $u=3x^2-2x-1$ et $-3x+1=-u'/2$.
2. $\cos^3x=(1-\sin^2x)\cos x$.
3. $u=x^2-3x+1$ et $3-2x=-u'$.
4. $\cos(3x-\pi/5)$ est une forme affine composée.
5. $u=\sin2x$ et $u'=2\cos2x$.
6. $u=x^2-1$ et $u'=2x$.

On obtient notamment :

$$
\int\frac{-3x+1}{(3x^2-2x-1)^4}\,dx
=\frac1{6(3x^2-2x-1)^3}+c,
$$

$$
\int\sin^7x\cos^3x\,dx
=\frac{\sin^8x}{8}-\frac{\sin^{10}x}{10}+c,
$$

$$
\int(3-2x)\sin(x^2-3x+1)\,dx
=\cos(x^2-3x+1)+c.
$$

## Exercice 10 : transformer avant de primitiver

Sur $]-\pi/2,\pi/2[$ :

$$
\frac1{1-\sin x}
=\frac{1+\sin x}{\cos^2x}
=\frac1{\cos^2x}+\frac{\sin x}{\cos^2x}.
$$

Une primitive est donc

$$
\tan x+\frac1{\cos x}+c.
$$

## Exercice 11 : sans linéariser

$$
\cos^3x\sin^3x
=\cos^3x(1-\cos^2x)\sin x.
$$

Avec $u=\cos x$ :

$$
\int\cos^3x\sin^3x\,dx
=-\frac{\cos^4x}{4}+\frac{\cos^6x}{6}+c.
$$

> **Astuce mémoire de Davy.** Pour une puissance impaire de sinus ou cosinus, garde un facteur pour fabriquer $u'$ et transforme le reste avec $\sin^2x+\cos^2x=1$.`,
    keyPoint: "Avant de primitiver, la bonne identité fait apparaître u′ et une puissance de u.",
    example: "$\\cos^3x\\sin^3x=\\cos^3x(1-\\cos^2x)\\sin x$ prépare la substitution $u=\\cos x$.",
    methodSteps: [
      "Choisis l’expression u qui concentre la composition.",
      "Fabrique u′ avec le facteur disponible.",
      "Pour la trigonométrie, garde un facteur impair puis utilise sin²+cos²=1.",
      "Primitive en u, remplace u par son expression et vérifie.",
    ],
    timeline: [
      { label: "Forme", detail: "Repérer composition, quotient ou puissance trigonométrique." },
      { label: "Identité", detail: "Transformer sans modifier la fonction." },
      { label: "Substitution", detail: "Faire apparaître u′." },
      { label: "Contrôle", detail: "Dériver la primitive obtenue." },
    ],
    questions: [
      choice("Une primitive de $(-3x+1)/(3x^2-2x-1)^4$ est :", ["$1/[6(3x^2-2x-1)^3]$", "$-1/[3(3x^2-2x-1)^3]$", "$\\ln(3x^2-2x-1)$", "$(3x^2-2x-1)^5$"], 0, "Le numérateur vaut $-u'/2$ et $\\int u^{-4}=u^{-3}/(-3)$.", "Exercice 9.1 • page 9", 3),
      choice("Une primitive de $\\sin^7x\\cos^3x$ est :", ["$\\sin^8x/8-\\sin^{10}x/10$", "$\\sin^8x/8+\\sin^{10}x/10$", "$\\cos^8x/8$", "$\\sin^7x\\cos^4x/4$"], 0, "Écrire $\\cos^3x=(1-\\sin^2x)\\cos x$.", "Exercice 9.2 • page 9", 3),
      choice("Une primitive de $(3-2x)\\sin(x^2-3x+1)$ est :", ["$\\cos(x^2-3x+1)$", "$-\\cos(x^2-3x+1)$", "$\\sin(x^2-3x+1)$", "$\\tan(x^2-3x+1)$"], 0, "Le facteur $3-2x$ est l’opposé de la dérivée intérieure.", "Exercice 9.3 • page 9", 2),
      choice("Une primitive de $\\cos(3x-\\pi/5)$ est :", ["$(1/3)\\sin(3x-\\pi/5)$", "$3\\sin(3x-\\pi/5)$", "$-(1/3)\\sin(3x-\\pi/5)$", "$\\cos(3x-\\pi/5)$"], 0, "On compense la dérivée intérieure $3$.", "Exercice 9.4 • page 9", 2),
      choice("Une primitive de $\\cos2x/\\sqrt{\\sin2x}$ est :", ["$\\sqrt{\\sin2x}$", "$2\\sqrt{\\sin2x}$", "$1/\\sqrt{\\sin2x}$", "$\\sin2x$"], 0, "Avec $u=\\sin2x$, $du=2\\cos2x\,dx$ : les facteurs se compensent.", "Exercice 9.5 • page 9", 2),
      choice("Une primitive de $x/\\sqrt[3]{x^2-1}$ est :", ["$(3/4)(x^2-1)^{2/3}$", "$(3/2)(x^2-1)^{2/3}$", "$\\sqrt[3]{x^2-1}$", "$(x^2-1)^{4/3}$"], 0, "Le facteur $x$ représente la moitié de $u'=2x$.", "Exercice 9.6 • page 9", 3),
      choice("Quelle identité transforme $1/(1-\\sin x)$ ?", ["$(1+\\sin x)/\\cos^2x$", "$(1-\\sin x)/\\cos^2x$", "$1/\\cos x$", "$\\tan x$"], 0, "On multiplie par $1+\\sin x$ et utilise $1-\\sin^2x=\\cos^2x$.", "Exercice 10.1 • page 9", 2),
      choice("Les primitives de $1/(1-\\sin x)$ sont :", ["$\\tan x+1/\\cos x+c$", "$\\tan x-1/\\cos x+c$", "$\\ln(1-\\sin x)+c$", "$-\\cos x+c$"], 0, "$(\\tan x)'=1/\\cos^2x$ et $(1/\\cos x)'=\\sin x/\\cos^2x$.", "Exercice 10.2 • page 9", 3),
      choice("Pour primitiver $\\cos^3x\\sin^3x$ sans linéariser, quelle substitution est naturelle ?", ["$u=\\cos x$", "$u=x^3$", "$u=\\tan x$", "$u=\\pi$"], 0, "On garde un facteur $\\sin x\,dx$ et on transforme $\\sin^2x$.", "Exercice 11 • page 10"),
      choice("Une primitive de $\\cos^3x\\sin^3x$ est :", ["$-\\cos^4x/4+\\cos^6x/6$", "$\\cos^4x/4+\\cos^6x/6$", "$\\sin^4x/4$", "$-\\cos^6x/6$"], 0, "Avec $u=\\cos x$, l’intégrale devient $-\\int(u^3-u^5)du$.", "Exercice 11 • page 10", 3),
    ],
  },
  {
    id: "advanced-primitives-mission",
    title: "Mission finale : exercices d’approfondissement",
    summary: "Combiner linéarisation, décomposition, sommes trigonométriques et fractions rationnelles.",
    pages: "10-11",
    section: "Exercices d’approfondissement 12 à 16",
    durationMinutes: 68,
    kind: "challenge",
    body: String.raw`## Exercice 12 : linéariser $\cos^4x$

À partir de

$$
\cos^2x=\frac{1+\cos2x}{2},
$$

on obtient

$$
\cos^4x
=\frac38+\frac12\cos2x+\frac18\cos4x.
$$

Ainsi, les primitives sur $\mathbb R$ sont

$$
\frac38x+\frac14\sin2x+\frac1{32}\sin4x+c.
$$

## Exercice 13 : division euclidienne

Sur $]2,+\infty[$ :

$$
f(x)=\frac{x^3-x^2-8x+8}{(x-2)^2}
=x+3-\frac4{(x-2)^2}.
$$

Les primitives sont donc

$$
F(x)=\frac12x^2+3x+\frac4{x-2}+c.
$$

> **Correction de source importante.** La page 10 imprime $\frac13x^2$ dans la réponse finale. La primitive de $x$ est $\frac12x^2$ ; le coefficient correct est donc $\frac12$.

## Exercice 14 : somme composée

Sur $]1/3,+\infty[$ :

$$
\int\left(\sin3x-\frac2{(3x-1)^2}\right)dx
=-\frac13\cos3x+\frac2{3(3x-1)}+c.
$$

## Exercice 15 : retrouver séparément deux primitives

Avec $h(x)=\cos^2x$ et $g(x)=\sin^2x$ :

$$
h+g=1,\qquad h-g=\cos2x.
$$

Les primitives qui s’annulent en $0$ sont

$$
S(x)=x,\qquad D(x)=\frac12\sin2x.
$$

Comme $h=(S'+D')/2$ et $g=(S'-D')/2$, on peut choisir

$$
H(x)=\frac x2+\frac14\sin2x,
\qquad
G(x)=\frac x2-\frac14\sin2x.
$$

## Exercice 16 : décomposer avant de primitiver

Sur $]-1/2,+\infty[$ :

$$
h(x)=\frac{x}{(2x+1)^3}
=\frac{1/2}{(2x+1)^2}-\frac{1/2}{(2x+1)^3}.
$$

Une primitive est

$$
H(x)=-\frac1{4(2x+1)}
+\frac1{8(2x+1)^2}+c.
$$

> **Astuce mémoire de Davy.** L’approfondissement ne demande pas une nouvelle formule : il demande souvent la bonne réécriture avant d’appliquer les formules déjà connues.`,
    keyPoint: "Réécrire correctement la fonction réduit chaque exercice avancé à des primitives usuelles ou composées.",
    example: "$f=x+3-4/(x-2)^2$ conduit à $F=x^2/2+3x+4/(x-2)+c$.",
    methodSteps: [
      "Choisis l’outil de réécriture : identité, division ou décomposition.",
      "Vérifie l’égalité obtenue avant de primitiver.",
      "Primitive chaque terme en respectant les coefficients intérieurs.",
      "Dérive la réponse finale et contrôle le domaine.",
    ],
    timeline: [
      { label: "Linéariser", detail: "Transformer une puissance trigonométrique en somme." },
      { label: "Diviser", detail: "Séparer partie polynomiale et fraction simple." },
      { label: "Combiner", detail: "Utiliser somme et différence de fonctions." },
      { label: "Décomposer", detail: "Faire apparaître des puissances composées usuelles." },
    ],
    corrections: [
      "Dans la réponse de l’exercice 13, la page 10 imprime (1/3)x². Comme la décomposition donne f(x)=x+3−4/(x−2)², le terme correct de la primitive est (1/2)x².",
    ],
    questions: [
      choice("Quelle est la linéarisation correcte de $\\cos^4x$ ?", ["$3/8+(1/2)\\cos2x+(1/8)\\cos4x$", "$1/2+(1/2)\\cos4x$", "$1+\\cos2x$", "$3/8+\\cos4x$"], 0, "Elle résulte de deux applications de la formule de l’angle double.", "Exercice 12.1 • page 10", 2),
      choice("Une primitive de $\\cos^4x$ est :", ["$3x/8+\\sin2x/4+\\sin4x/32$", "$3x/8+\\sin2x/2+\\sin4x/8$", "$\\sin^4x/4$", "$x\\cos^4x$"], 0, "Les facteurs $2$ et $4$ des angles doivent être compensés.", "Exercice 12.2 • page 10", 3),
      choice("Quelle décomposition donne l’exercice 13 ?", ["$x+3-4/(x-2)^2$", "$x-3+4/(x-2)^2$", "$x^2+3$", "$x+3-4/(x-2)$"], 0, "La division euclidienne donne $a=1$, $b=3$, $c=-4$.", "Exercice 13.1 • page 10", 2),
      short("Dans la décomposition $ax+b+c/(x-2)^2$, quelle est la valeur de $a$ ?", ["1", "+1"], "Le quotient polynomial commence par $x$.", "Exercice 13.1 • page 10"),
      short("Quelle est la valeur de $b$ ?", ["3", "+3"], "La division donne $x+3$.", "Exercice 13.1 • page 10"),
      short("Quelle est la valeur de $c$ ?", ["-4"], "Le reste constant vaut $-4$.", "Exercice 13.1 • page 10"),
      choice("Quelle primitive corrige la coquille du PDF dans l’exercice 13 ?", ["$x^2/2+3x+4/(x-2)+c$", "$x^2/3+3x+4/(x-2)+c$", "$x^2/2+3x-4/(x-2)+c$", "$x+3-4/(x-2)^2+c$"], 0, "La primitive de $x$ est $x^2/2$, pas $x^2/3$.", "Exercice 13.2 corrigé • page 10", 3),
      choice("Une primitive de $\\sin3x-2/(3x-1)^2$ est :", ["$-(1/3)\\cos3x+2/[3(3x-1)]$", "$(1/3)\\cos3x-2/[3(3x-1)]$", "$-3\\cos3x+2/(3x-1)$", "$\\sin3x+2/(3x-1)$"], 0, "Chaque dérivée intérieure vaut $3$ et doit être compensée.", "Exercice 14 • page 10", 3),
      choice("$h(x)+g(x)$ pour $h=\\cos^2x$ et $g=\\sin^2x$ vaut :", ["$1$", "$0$", "$\\cos2x$", "$\\sin2x$"], 0, "C’est l’identité trigonométrique fondamentale.", "Exercice 15.1 • pages 10-11"),
      choice("La primitive de $h+g$ qui s’annule en $0$ est :", ["$S(x)=x$", "$S(x)=x+1$", "$S(x)=0$", "$S(x)=\\sin x$"], 0, "Une primitive de $1$ est $x+c$ et la condition donne $c=0$.", "Exercice 15.1 • pages 10-11", 2),
      choice("$h(x)-g(x)$ vaut :", ["$\\cos2x$", "$1$", "$\\sin2x$", "$-\\cos2x$"], 0, "$\\cos^2x-\\sin^2x=\\cos2x$.", "Exercice 15.2 • page 11"),
      choice("La primitive de $h-g$ qui s’annule en $0$ est :", ["$D(x)=\\sin2x/2$", "$D(x)=\\sin2x$", "$D(x)=\\cos2x/2$", "$D(x)=x$"], 0, "La dérivée de $\\sin2x/2$ vaut $\\cos2x$.", "Exercice 15.2 • page 11", 2),
      choice("Quelles primitives peut-on choisir pour $h$ et $g$ ?", ["$H=x/2+\\sin2x/4$, $G=x/2-\\sin2x/4$", "$H=x+\\sin2x$, $G=x-\\sin2x$", "$H=\\cos x$, $G=\\sin x$", "$H=G=x/2$"], 0, "On prend $(S+D)/2$ et $(S-D)/2$.", "Exercice 15.3 • page 11", 3),
      choice("Dans l’exercice 16, quelles valeurs conviennent dans $h=a/(2x+1)^2+b/(2x+1)^3$ ?", ["$a=1/2$, $b=-1/2$", "$a=1$, $b=-1$", "$a=-1/2$, $b=1/2$", "$a=2$, $b=1$"], 0, "$x=a(2x+1)+b$ impose $2a=1$ et $a+b=0$.", "Exercice 16.1 • page 11", 2),
      choice("Une primitive de $x/(2x+1)^3$ est :", ["$-1/[4(2x+1)]+1/[8(2x+1)^2]+c$", "$1/[4(2x+1)]-1/[8(2x+1)^2]+c$", "$\\ln(2x+1)+c$", "$x^2/[2(2x+1)^3]+c$"], 0, "On primitive séparément les deux termes de la décomposition.", "Exercice 16.2 • page 11", 3),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCPrimitivesPath: LearningPath = {
  id: "terminale-c-math-l06-primitives",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Analyse" },
  chapterNumber: 6,
  title: "Primitives",
  description: "Définition, existence, familles, primitives usuelles et composées, optimisation et exercices officiels d’approfondissement.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître et vérifier une primitive par dérivation",
    "Déterminer toutes les primitives ou celle qui satisfait une condition",
    "Calculer des primitives usuelles, linéaires et composées",
    "Résoudre les applications, renforcements et approfondissements officiels",
  ],
  modules: [
    {
      id: "terminale-c-math-l06-primitives-mastery",
      title: "Maîtriser les primitives",
      description: "Du sens de F′=f jusqu’aux décompositions et à la mission économique.",
      lessons: builtLevels,
    },
  ],
};
