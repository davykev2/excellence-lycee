import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 04 DERIVABILITE ET ETUDE DE FONCTIONS.pdf";

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
      title: "Construire le raisonnement",
      instruction: "Parcours les étapes dans l’ordre avant de passer à la méthode.",
      observation: "Chaque repère reprend le cours officiel et prépare les exercices du niveau.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Écris d’abord les conditions de validité, puis déroule le calcul sans sauter l’interprétation graphique.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: "Astuce mémoire de Davy : une dérivée donne une pente locale ; son signe raconte ensuite le mouvement global de la courbe.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "one-sided-derivatives",
    title: "Dérivées à gauche et à droite",
    summary: "Calculer les deux taux d’accroissement latéraux et lire les pentes des demi-tangentes.",
    pages: "1-2",
    section: "I-1-a. Dérivabilité à gauche et à droite",
    durationMinutes: 28,
    body: String.raw`## Définitions

$f$ est **dérivable à gauche** en $x_0$ lorsque la limite finie

$$f'_g(x_0)=\lim_{x\to x_0^-}\frac{f(x)-f(x_0)}{x-x_0}$$

existe. De même, elle est **dérivable à droite** lorsque

$$f'_d(x_0)=\lim_{x\to x_0^+}\frac{f(x)-f(x_0)}{x-x_0}$$

existe et est finie. Ces nombres sont les coefficients directeurs des demi-tangentes gauche et droite.

## Exemple officiel

$$
f(x)=
\begin{cases}
\dfrac1{x-2},&x\in]-\infty;0[\cup]0;1],\\[3pt]
-\dfrac1x,&x\in[1;2[\cup]2;+\infty[.
\end{cases}
$$

On a $f(1)=-1$, puis

$$f'_g(1)=-1,\qquad f'_d(1)=1.$$

Au point $A(1;-1)$, les deux demi-tangentes sont donc

$$T_g:y=-x,\qquad T_d:y=x-2.$$

> **Astuce mémoire de Davy.** Le signe $-$ ou $+$ placé sur la flèche indique le **côté d’où arrive $x$**, pas le signe de la limite.

> **Point de vigilance.** Une limite latérale doit être finie pour être une dérivée réelle.`,
    keyPoint: "f’g(a) et f’d(a) sont les limites latérales du même taux d’accroissement.",
    example: "$f'_g(1)=-1$ donne $T_g:y=-x$ et $f'_d(1)=1$ donne $T_d:y=x-2$.",
    methodSteps: [
      "Calcule exactement f(a).",
      "Choisis la branche valable du côté étudié.",
      "Simplifie le quotient avant le passage à la limite.",
      "Donne la dérivée latérale puis l’équation de la demi-tangente.",
    ],
    timeline: [
      { label: "Point", detail: "Calculer f(a), utilisé dans les deux quotients." },
      { label: "Gauche", detail: "Employer la branche valable pour x<a." },
      { label: "Droite", detail: "Employer la branche valable pour x>a." },
      { label: "Tangentes", detail: "Chaque valeur finie fournit une pente." },
    ],
    corrections: [
      "La couverture du PDF porte « Leçon 3 », alors que le fichier officiel et le catalogue fourni classent ce contenu comme leçon 04 de Terminale C.",
    ],
    questions: [
      short("Dans l’exemple officiel, calcule $f(1)$.", ["-1"], "Les deux expressions donnent $-1$ au raccord.", "Exemple • pages 1-2"),
      short("Donne $f'_g(1)$.", ["-1"], "Le taux d’accroissement à gauche tend vers $-1$.", "Exercice de fixation • page 2"),
      short("Donne $f'_d(1)$.", ["1", "+1"], "Le taux d’accroissement à droite tend vers $1$.", "Exercice de fixation • page 2"),
      choice("Quelle est l’équation de la demi-tangente gauche en $A(1;-1)$ ?", ["$y=-x$", "$y=x-2$", "$x=1$"], 0, "La droite de pente $-1$ passant par $A$ est $y=-x$.", "Exercice de fixation • page 2", 2),
      choice("Deux dérivées latérales finies mais différentes donnent…", ["deux demi-tangentes distinctes", "une tangente verticale unique", "aucune demi-tangente"], 0, "Chaque limite latérale fournit sa demi-tangente.", "Interprétation • page 2", 2),
    ],
  },
  {
    id: "derivative-at-junction",
    title: "Dérivabilité en un point de raccord",
    summary: "Vérifier la continuité, calculer les deux dérivées latérales et exiger leur égalité.",
    pages: "2-3",
    section: "I-1-b. Dérivabilité en un point",
    durationMinutes: 30,
    body: String.raw`## Critère complet

$f$ est dérivable en $x_0$ si elle est dérivable à gauche et à droite, avec

$$f'_g(x_0)=f'_d(x_0)=f'(x_0).$$

La dérivabilité entraîne la continuité. Pour une fonction par morceaux, on vérifie donc d’abord que les branches se rejoignent.

## Exemple officiel

$$
f(x)=
\begin{cases}
x^2,&x<0,\\
x^3,&x\ge0.
\end{cases}
$$

Les deux limites valent $f(0)=0$ : $f$ est continue en $0$.

$$\frac{x^2}{x}=x\to0\quad(x\to0^-),\qquad
\frac{x^3}{x}=x^2\to0\quad(x\to0^+).$$

Ainsi $f'_g(0)=f'_d(0)=0$. La fonction est dérivable en $0$ et sa tangente est horizontale :

$$T:y=0.$$

> **Astuce mémoire de Davy.** Au raccord, applique la règle **C-G-D** : Continuité, Gauche, Droite.

> **Erreur fréquente.** Deux formules dérivables séparément ne suffisent pas : leurs valeurs et leurs pentes doivent se raccorder.`,
    keyPoint: "Au raccord : continuité, puis f’g(a)=f’d(a).",
    example: "Pour $x^2$ à gauche et $x^3$ à droite en $0$, les deux dérivées valent $0$.",
    methodSteps: [
      "Vérifie que les deux limites de f valent f(a).",
      "Calcule le taux d’accroissement à gauche.",
      "Calcule le taux d’accroissement à droite.",
      "Compare et conclus avec une phrase complète.",
    ],
    timeline: [
      { label: "Continuité", detail: "Les deux morceaux doivent se rejoindre." },
      { label: "Pente gauche", detail: "Calculer la limite pour x<a." },
      { label: "Pente droite", detail: "Calculer la limite pour x>a." },
      { label: "Égalité", detail: "Une tangente unique exige les mêmes pentes." },
    ],
    questions: [
      choice("La dérivabilité en $a$ implique-t-elle la continuité ?", ["Oui, toujours", "Non, jamais", "Seulement si $f(a)=1$"], 0, "Toute fonction dérivable en un point y est continue.", "Propriété • page 2"),
      short("Pour la fonction officielle, calcule $f'_g(0)$.", ["0"], "$x^2/x=x$ tend vers $0$.", "Exercice de fixation • page 3"),
      short("Calcule $f'_d(0)$.", ["0"], "$x^3/x=x^2$ tend vers $0$.", "Exercice de fixation • page 3"),
      choice("Quelle conclusion est correcte ?", ["$f$ est dérivable en $0$", "$f$ est discontinue en $0$", "$f$ a deux tangentes verticales"], 0, "Continuité et égalité des dérivées latérales.", "Exercice de fixation • page 3", 2),
      short("Donne l’équation de la tangente en $0$.", ["y=0", "y = 0"], "Elle passe par l’origine avec une pente nulle.", "Exercice de fixation • page 3"),
    ],
  },
  {
    id: "vertical-half-tangent",
    title: "Demi-tangente verticale",
    summary: "Reconnaître une limite infinie du taux d’accroissement et l’interpréter correctement.",
    pages: "3 et 21-23",
    section: "I-1-c. Demi-tangente verticale",
    durationMinutes: 30,
    body: String.raw`## Critère

Si

$$\lim_{x\to a^\pm}\frac{f(x)-f(a)}{x-a}=\pm\infty,$$

alors $f$ n’est pas dérivable de ce côté au sens usuel, mais la courbe admet une **demi-tangente verticale** d’équation $x=a$.

## Exemple officiel

Pour $f(x)=\sqrt{x}-x$ sur $\mathbb R_+$, $f(0)=0$ et

$$\frac{f(x)-f(0)}x=\frac1{\sqrt{x}}-1\longrightarrow+\infty
\quad(x\to0^+).$$

La fonction n’est pas dérivable à droite en $0$ et la courbe admet la demi-tangente $x=0$.

Des racines produisent souvent ce comportement aux bornes :

- $\sqrt{x^2+x-2}$ en $-2$ et $1$ ;
- $\sqrt{\dfrac{1-x}{1+x}}$ en $1$ ;
- $x^2-2\sqrt{x}$ en $0$ ;
- $(2-x)\sqrt{4-x^2}$ en $-2$ ou $2$.

> **Astuce mémoire de Davy.** Pente finie : tangente inclinée. Pente infinie : tangente verticale.

> **Point de vigilance.** N’écris pas $f'(a)=+\infty$ : une dérivée réelle doit être finie.`,
    keyPoint: "Taux d’accroissement → ±∞ ⇒ demi-tangente verticale x=a.",
    example: "Pour $f(x)=\\sqrt{x}-x$, le quotient vaut $1/\\sqrt{x}-1\\to+\\infty$.",
    methodSteps: [
      "Repère le côté autorisé par le domaine.",
      "Forme exactement le taux d’accroissement.",
      "Rationalise ou factorise pour isoler le terme infini.",
      "Conclue à la non-dérivabilité et écris x=a.",
    ],
    timeline: [
      { label: "Domaine", detail: "Une racine impose souvent un seul côté." },
      { label: "Quotient", detail: "Former [f(x)-f(a)]/(x-a)." },
      { label: "Infini", detail: "Déterminer le signe de la limite." },
      { label: "Géométrie", detail: "Écrire l’équation verticale x=a." },
    ],
    questions: [
      short("Pour $f(x)=\\sqrt{x}-x$, donne $f(0)$.", ["0"], "Les deux termes valent $0$.", "Exemple • page 3"),
      choice("Vers quoi tend $1/\\sqrt{x}-1$ lorsque $x\\to0^+$ ?", ["$+\\infty$", "$0$", "$-1$"], 0, "$1/\\sqrt{x}$ devient arbitrairement grand.", "Exemple • page 3"),
      choice("Quelle est l’équation de la demi-tangente ?", ["$x=0$", "$y=0$", "$y=x$"], 0, "Une verticale passant par l’abscisse $0$ a pour équation $x=0$.", "Exemple • page 3", 2),
      choice("Peut-on écrire $f'_d(0)=+\\infty$ comme une dérivée réelle ?", ["Non", "Oui", "Seulement sur $\\mathbb R_+$"], 0, "La limite infinie indique que la dérivée réelle n’existe pas.", "Interprétation • page 3"),
      choice("Pour $x^2-2\\sqrt{x}$ en $0$, quel phénomène recherche-t-on ?", ["Une demi-tangente verticale à droite", "Une asymptote horizontale", "Une période"], 0, "Le taux contient un terme en $1/\\sqrt x$.", "Exercice 6 • pages 21-22", 2),
    ],
  },
  {
    id: "derivative-on-interval-and-rules",
    title: "Dérivabilité sur un intervalle et règles usuelles",
    summary: "Étendre la dérivabilité aux bornes et dériver puissances, racines et fonctions trigonométriques composées.",
    pages: "4-5 et 21",
    section: "I-2 et I-3-b. Dérivabilité sur un intervalle",
    durationMinutes: 38,
    body: String.raw`## Sur un intervalle

$f$ est dérivable sur $[a;b]$ si elle est dérivable sur $]a;b[$, dérivable à droite en $a$ et dérivable à gauche en $b$.

## Formules

| Fonction | Dérivée |
|---|---|
| $u^n$ | $nu'u^{n-1}$ |
| $\sqrt u$, avec $u>0$ | $\dfrac{u'}{2\sqrt u}$ |
| $\cos u$ | $-u'\sin u$ |
| $\sin u$ | $u'\cos u$ |
| $\tan u$ | $u'(1+\tan^2u)=\dfrac{u'}{\cos^2u}$ |

Le cours obtient :

$$[(x^2-3x+1)^5]'=5(2x-3)(x^2-3x+1)^4,$$
$$[\sqrt{x^2+3x+5}]'=\frac{2x+3}{2\sqrt{x^2+3x+5}},$$
$$[\cos(x^2)]'=-2x\sin(x^2),$$
$$[\sin(\sin x)]'=\cos x\cos(\sin x),$$
$$\left[\frac{x}{\sqrt{x^2+1}}\right]'=\frac1{(x^2+1)^{3/2}}.$$

Enfin, $f(x)=(4x-1)\sqrt{4x-1}$ est définie sur $[1/4;+\infty[$. On trouve

$$f'_d(1/4)=0,\qquad f'(x)=6\sqrt{4x-1}\quad(x>1/4).$$

> **Astuce mémoire de Davy.** Dérive l’enveloppe extérieure, garde l’intérieur, puis multiplie par la dérivée intérieure.`,
    keyPoint: "Dérivée composée = dérivée extérieure × dérivée intérieure, avec contrôle du domaine.",
    example: "$[\\sin(\\sin x)]'=\\cos x\\cos(\\sin x)$.",
    methodSteps: [
      "Détermine le domaine et les bornes.",
      "Identifie la fonction extérieure et l’intérieur u.",
      "Applique la formule puis multiplie par u’.",
      "À une borne, reviens au taux latéral.",
    ],
    timeline: [
      { label: "Domaine", detail: "Racine et tangente imposent des conditions." },
      { label: "Enveloppe", detail: "Repérer puissance, racine, sinus ou cosinus." },
      { label: "Chaîne", detail: "Multiplier par la dérivée intérieure." },
      { label: "Borne", detail: "Vérifier la dérivabilité latérale." },
    ],
    questions: [
      short("Dérive $(x^2-3x+1)^5$.", ["5(2x-3)(x^2-3x+1)^4", "5(2x - 3)(x^2 - 3x + 1)^4"], "La dérivée extérieure est $5u^4$ et $u'=2x-3$.", "Exercice de fixation • page 5", 2),
      short("Dérive $\\cos(x^2)$.", ["-2x sin(x^2)", "-2xsin(x^2)", "-2x\\sin(x^2)"], "On multiplie $-\\sin(x^2)$ par $2x$.", "Exercice de fixation • page 5"),
      choice("Quelle est la dérivée de $\\sin(\\sin x)$ ?", ["$\\cos x\\cos(\\sin x)$", "$\\sin x\\cos(\\sin x)$", "$\\cos(\\cos x)$"], 0, "La dérivée de l’intérieur est $\\cos x$.", "Exercice de fixation • page 5", 2),
      choice("Où $(4x-1)\\sqrt{4x-1}$ est-elle définie ?", ["$[1/4;+\\infty[$", "$]-\\infty;1/4]$", "$\\mathbb R$"], 0, "Il faut $4x-1\\ge0$.", "Exercice de fixation • page 5"),
      short("Calcule $f'_d(1/4)$.", ["0"], "Le taux se simplifie et tend vers $0$.", "Exercice de fixation • page 5", 2),
      short("Pour $x>1/4$, donne $f'(x)$.", ["6sqrt(4x-1)", "6√(4x-1)", "6\\sqrt(4x-1)"], "La dérivée de $(4x-1)^{3/2}$ vaut $6\\sqrt{4x-1}$.", "Exercice de fixation • page 5", 2),
    ],
  },
  {
    id: "derivative-composition",
    title: "Dérivée d’une fonction composée",
    summary: "Appliquer la règle de la chaîne au bon point et dans le bon ordre.",
    pages: "4-5",
    section: "I-3-a. Dérivabilité et dérivée d’une composée",
    durationMinutes: 30,
    body: String.raw`## Propriété

Si $g$ est dérivable en $x_0$ et $f$ en $g(x_0)$, alors

$$(f\circ g)'(x_0)=g'(x_0)f'(g(x_0)).$$

## Exemple officiel

$$f(x)=\frac{3-x}{x-2},\qquad g(x)=x-\frac1x+2.$$

Pour calculer $(f\circ g)'(3)$ :

$$g(3)=\frac{14}{3},\qquad g'(3)=\frac{10}{9}.$$

Comme

$$f'(x)=-\frac1{(x-2)^2},\qquad f'\left(\frac{14}{3}\right)=-\frac9{64},$$

on obtient

$$(f\circ g)'(3)=\frac{10}{9}\times\left(-\frac9{64}\right)=-\frac5{32}.$$

> **Astuce mémoire de Davy.** Écris trois cases : $g(x_0)$, $g'(x_0)$, $f'(g(x_0))$. Multiplie les deux dernières.`,
    keyPoint: "(f∘g)’(x0)=g’(x0)f’(g(x0)).",
    example: "$g(3)=14/3$, $g'(3)=10/9$, $f'(14/3)=-9/64$, donc $-5/32$.",
    methodSteps: [
      "Vérifie les conditions de dérivabilité.",
      "Calcule g(x0).",
      "Calcule g’(x0) et f’(g(x0)).",
      "Multiplie et simplifie.",
    ],
    timeline: [
      { label: "Entrée", detail: "Partir de x0 dans g." },
      { label: "Image", detail: "Calculer g(x0)." },
      { label: "Pentes", detail: "Trouver g’(x0) et f’(g(x0))." },
      { label: "Produit", detail: "Multiplier les facteurs." },
    ],
    questions: [
      short("Calcule $g(3)$.", ["14/3"], "$3-1/3+2=14/3$.", "Exercice de fixation • page 4"),
      short("Calcule $g'(3)$.", ["10/9"], "$g'(x)=1+1/x^2$.", "Exercice de fixation • page 4"),
      short("Calcule $f'(14/3)$.", ["-9/64"], "$f'(x)=-1/(x-2)^2$.", "Exercice de fixation • page 4", 2),
      short("Donne $(f\\circ g)'(3)$.", ["-5/32"], "Le produit vaut $-5/32$.", "Exercice de fixation • page 4", 2),
      choice("Où évalue-t-on $f'$ dans $(f\\circ g)'(a)$ ?", ["En $g(a)$", "En $a$", "En $f(a)$"], 0, "La fonction extérieure reçoit l’image produite par g.", "Propriété • page 4"),
    ],
  },
  {
    id: "inverse-function-derivative",
    title: "Dérivée d’une bijection réciproque",
    summary: "Retrouver l’antécédent, contrôler que la dérivée ne s’annule pas, puis inverser la pente.",
    pages: "5-6 et 18-20",
    section: "I-4. Dérivabilité d’une bijection réciproque",
    durationMinutes: 38,
    body: String.raw`## Propriété

Soit $f$ une bijection d’un intervalle $K$ sur $J$. Si $f$ est dérivable en $x_0$ et $f'(x_0)\ne0$, alors $f^{-1}$ est dérivable en $y_0=f(x_0)$ et

$$(f^{-1})'(y_0)=\frac1{f'(x_0)}.$$

La première difficulté est de trouver le bon antécédent $x_0=f^{-1}(y_0)$.

## Exemple officiel

On restreint $f(x)=x^2-x$ à $]-\infty;1/2]$. Comme $f'(x)=2x-1<0$ sur cette branche, $f$ est strictement décroissante et bijective vers $[-1/4;+\infty[$.

Pour calculer $(f^{-1})'(2)$, on résout

$$x^2-x=2\iff(x+1)(x-2)=0.$$

La restriction impose $x_0=-1$. Comme $f'(-1)=-3\ne0$ :

$$(f^{-1})'(2)=-\frac13.$$

## Prolongements du PDF

La réciproque de $\tan$ sur $]-\pi/2;\pi/2[$ est $\varphi=\arctan$, avec

$$\varphi'(x)=\frac1{1+x^2}.$$

Pour $f(x)=\sqrt{\dfrac{1-x}{1+x}}$, le PDF établit $f(0)=1$ et $f'(0)=-1$, d’où

$$(f^{-1})'(1)=-1.$$

> **Astuce mémoire de Davy.** On inverse la pente, pas le point : cherche d’abord l’antécédent.`,
    keyPoint: "(f⁻¹)’(y0)=1/f’(x0), avec y0=f(x0) et f’(x0)≠0.",
    example: "$f(-1)=2$ et $f'(-1)=-3$, donc $(f^{-1})'(2)=-1/3$.",
    methodSteps: [
      "Justifie que la restriction est bijective.",
      "Résous f(x0)=y0 dans l’intervalle imposé.",
      "Calcule f’(x0) et vérifie qu’elle n’est pas nulle.",
      "Prends le réciproque de la dérivée.",
    ],
    timeline: [
      { label: "Bijection", detail: "Continuité et stricte monotonie donnent une bijection sur l’image." },
      { label: "Antécédent", detail: "Résoudre f(x0)=y0 dans la bonne branche." },
      { label: "Pente", detail: "Vérifier f’(x0)≠0." },
      { label: "Inverse", detail: "Calculer 1/f’(x0)." },
    ],
    questions: [
      choice("Pourquoi restreint-on $x^2-x$ à $]-\\infty;1/2]$ ?", ["Pour obtenir une bijection", "Pour la rendre constante", "Pour supprimer toute racine"], 0, "La fonction y est strictement décroissante.", "Exemple • page 6"),
      short("Quel est l’antécédent de $2$ dans cette restriction ?", ["-1"], "Les solutions sont $-1$ et $2$, mais seule $-1$ appartient à la branche.", "Exercice de fixation • page 6", 2),
      short("Calcule $f'(-1)$.", ["-3"], "$2(-1)-1=-3$.", "Exercice de fixation • page 6"),
      short("Donne $(f^{-1})'(2)$.", ["-1/3"], "On inverse $f'(-1)=-3$.", "Exercice de fixation • page 6", 2),
      short("Si $\\varphi=\\arctan$, donne $\\varphi'(x)$.", ["1/(1+x^2)", "1/(x^2+1)"], "La formule officielle donne $1/(1+x^2)$.", "Exercice corrigé 4 • page 18", 2),
      short("Pour $f(x)=\\sqrt{(1-x)/(1+x)}$, donne $(f^{-1})'(1)$.", ["-1"], "$f(0)=1$ et $f'(0)=-1$.", "Exercice corrigé 5 • pages 18-20", 2),
    ],
  },
  {
    id: "successive-derivatives",
    title: "Dérivées successives",
    summary: "Calculer une dérivée d’ordre n et reconnaître les cycles ou l’annulation des dérivées.",
    pages: "6-7 et 17-18",
    section: "I-5. Dérivées successives",
    durationMinutes: 30,
    body: String.raw`## Définition

Lorsque $f'$ est dérivable, sa dérivée est $f''=f^{(2)}$. On poursuit :

$$f^{(n+1)}=(f^{(n)})'.$$

## Exemple polynomial

Pour $f(x)=x^3-2x^2+3$ :

$$f'(x)=3x^2-4x,$$
$$f''(x)=6x-4,$$
$$f^{(3)}(x)=6,$$
$$f^{(4)}(x)=0.$$

Toutes les dérivées suivantes sont nulles. Un polynôme de degré $p$ possède une dérivée d’ordre $p+1$ identiquement nulle.

## Cycle du cosinus

Les dérivées suivent le cycle

$$\cos x,\ -\sin x,\ -\cos x,\ \sin x,\ \cos x,\ldots$$

Le PDF démontre par récurrence :

$$\cos^{(n)}(x)=\cos\left(x+n\frac\pi2\right).$$

> **Astuce mémoire de Davy.** Pour sinus et cosinus, réduis $n$ modulo $4$. Pour un polynôme, compare $n$ au degré.`,
    keyPoint: "f⁽ⁿ⁺¹⁾=(f⁽ⁿ⁾)’ ; cos⁽ⁿ⁾(x)=cos(x+nπ/2).",
    example: "Pour $x^3-2x^2+3$, la troisième dérivée vaut $6$ et la quatrième vaut $0$.",
    methodSteps: [
      "Écris chaque ordre sur une ligne.",
      "Dérive le résultat précédent.",
      "Repère l’annulation ou le cycle.",
      "Pour une preuve générale, utilise une récurrence.",
    ],
    timeline: [
      { label: "Ordre 1", detail: "Calculer f’." },
      { label: "Itérer", detail: "Dériver le résultat précédent." },
      { label: "Structure", detail: "Repérer annulation ou cycle." },
      { label: "Généraliser", detail: "Exprimer l’ordre n." },
    ],
    questions: [
      short("Donne $f'(x)$ pour $f(x)=x^3-2x^2+3$.", ["3x^2-4x", "3x²-4x"], "On dérive terme à terme.", "Exemple • page 7"),
      short("Donne $f''(x)$.", ["6x-4"], "La dérivée de $3x^2-4x$ est $6x-4$.", "Exemple • page 7"),
      short("Donne $f^{(3)}(x)$.", ["6"], "La dérivée de $6x-4$ est $6$.", "Exemple • page 7"),
      short("Donne $f^{(4)}(x)$.", ["0"], "La dérivée d’une constante est nulle.", "Exemple • page 7"),
      choice("Quelle formule est démontrée pour le cosinus ?", ["$\\cos^{(n)}(x)=\\cos(x+n\\pi/2)$", "$\\cos^{(n)}(x)=n\\cos x$", "$\\cos^{(n)}(x)=0$"], 0, "La translation de phase reproduit le cycle.", "Exercice corrigé 3 • pages 17-18", 2),
      short("Calcule $\\cos^{(6)}(0)$.", ["-1"], "$6\\equiv2\\pmod4$, donc la dérivée est $-\\cos x$.", "Adaptation de l’exercice corrigé 3", 2),
    ],
  },
  {
    id: "finite-increments",
    title: "Inégalité des accroissements finis",
    summary: "Transformer un encadrement de la dérivée en encadrement d’une différence de valeurs.",
    pages: "7 et 21",
    section: "I-6. Propriété 1",
    durationMinutes: 34,
    body: String.raw`## Propriété

Si $f$ est continue sur $[a;b]$, dérivable sur $]a;b[$ et

$$m\le f'(x)\le M,$$

alors

$$m(b-a)\le f(b)-f(a)\le M(b-a).$$

## Encadrer $\sqrt{19}-\sqrt{17}$

On choisit $f(t)=\sqrt t$, donc $f'(t)=1/(2\sqrt t)$. Sur le bon intervalle $[17;19]$ :

$$\frac1{2\sqrt{19}}\le f'(t)\le\frac1{2\sqrt{17}}.$$

Comme $19-17=2$ :

$$\frac1{\sqrt{19}}\le\sqrt{19}-\sqrt{17}\le\frac1{\sqrt{17}}.$$

Pour tout $x>0$, la même démarche sur $[x;x+1]$ donne

$$\frac1{2\sqrt{x+1}}\le\sqrt{x+1}-\sqrt x\le\frac1{2\sqrt x}.$$

> **Astuce mémoire de Davy.** Dérivée encadrée × longueur de l’intervalle = accroissement encadré.

> **Correction.** Une ligne du PDF indique $[\sqrt{17};\sqrt{19}]$ : l’intervalle de la variable $t$ est bien $[17;19]$.`,
    keyPoint: "m≤f’≤M ⇒ m(b-a)≤f(b)-f(a)≤M(b-a).",
    example: "Sur $[17;19]$, $1/(2\\sqrt{19})\\le f'\\le1/(2\\sqrt{17})$.",
    methodSteps: [
      "Choisis f pour que f(b)-f(a) soit l’expression visée.",
      "Calcule et encadre f’ sur [a;b].",
      "Multiplie par b-a.",
      "Reviens à l’expression demandée.",
    ],
    timeline: [
      { label: "Reconnaître", detail: "Écrire l’expression comme f(b)-f(a)." },
      { label: "Dériver", detail: "Borner f’ sur le bon intervalle." },
      { label: "Longueur", detail: "Multiplier par b-a." },
      { label: "Traduire", detail: "Revenir à l’expression initiale." },
    ],
    corrections: [
      "Page 7, l’intervalle d’étude de f(t)=√t doit être [17;19], et non [√17;√19] comme l’indique une ligne du PDF.",
    ],
    questions: [
      choice("Quelle fonction choisit-on pour $\\sqrt{19}-\\sqrt{17}$ ?", ["$f(t)=\\sqrt t$", "$f(t)=t^2$", "$f(t)=1/t$"], 0, "La différence devient $f(19)-f(17)$.", "Exemple • page 7"),
      short("Donne $f'(t)$.", ["1/(2sqrt(t))", "1/(2√t)", "1/(2\\sqrt(t))", "1/(2\\sqrt t)"], "La dérivée de la racine est $1/(2\\sqrt t)$.", "Exemple • page 7"),
      choice("Quel est le bon intervalle ?", ["$[17;19]$", "$[\\sqrt{17};\\sqrt{19}]$", "$[0;2]$"], 0, "t parcourt les arguments des racines.", "Correction raisonnée • page 7", 2),
      choice("Quelle borne finale est correcte ?", ["$\\frac1{\\sqrt{19}}\\le\\sqrt{19}-\\sqrt{17}\\le\\frac1{\\sqrt{17}}$", "$17\\le\\sqrt{19}-\\sqrt{17}\\le19$", "$\\sqrt{19}-\\sqrt{17}=2$"], 0, "On multiplie par $2$.", "Exemple • page 7", 2),
      choice("Pour $x>0$, quelle inégalité est correcte ?", ["$\\frac1{2\\sqrt{x+1}}\\le\\sqrt{x+1}-\\sqrt x\\le\\frac1{2\\sqrt x}$", "$\\sqrt{x+1}-\\sqrt x\\ge1$", "$\\sqrt{x+1}-\\sqrt x=0$"], 0, "C’est l’IAF sur $[x;x+1]$.", "Exercice 3 • page 21", 2),
    ],
  },
  {
    id: "lipschitz-bound",
    title: "Majoration d’un accroissement",
    summary: "Contrôler l’écart entre deux images à partir d’une borne sur la valeur absolue de la dérivée.",
    pages: "7-8 et 17",
    section: "I-6. Propriété 2",
    durationMinutes: 30,
    body: String.raw`## Propriété

Si $f$ est continue sur $[a;b]$, dérivable sur $]a;b[$ et $|f'(x)|\le M$, alors

$$|f(b)-f(a)|\le M|b-a|.$$

## Exemple officiel

Pour $f(t)=\cos t$ :

$$f'(t)=-\sin t,\qquad |f'(t)|\le1.$$

Donc, pour tous réels $x,y$ :

$$|\cos x-\cos y|\le|x-y|.$$

## Exercice corrigé

Si $|k'(x)|<0,2$ sur $[a;b]$, alors

$$|k(b)-k(a)|<0,2(b-a),$$

donc

$$k(b)\in]k(a)-0,2(b-a);\,k(a)+0,2(b-a)[.$$

> **Astuce mémoire de Davy.** Une petite dérivée interdit à la fonction de changer trop vite.`,
    keyPoint: "|f’|≤M ⇒ |f(b)-f(a)|≤M|b-a|.",
    example: "$|(-\\sin t)|\\le1$ entraîne $|\\cos x-\\cos y|\\le|x-y|$.",
    methodSteps: [
      "Calcule f’ et sa valeur absolue.",
      "Trouve une borne M valable partout.",
      "Applique l’inégalité.",
      "Retire la valeur absolue si nécessaire.",
    ],
    timeline: [
      { label: "Pente", detail: "La valeur absolue de f’ mesure la vitesse." },
      { label: "Maximum", detail: "Choisir une borne M." },
      { label: "Distance", detail: "Comparer les écarts." },
      { label: "Intervalle", detail: "Transformer en double inégalité." },
    ],
    questions: [
      choice("Quelle borne utilise-t-on pour le cosinus ?", ["$|\\sin t|\\le1$", "$|\\sin t|\\ge1$", "$\\sin t=1$"], 0, "$|(-\\sin t)|=|\\sin t|$.", "Exemple • page 8"),
      choice("Quelle conclusion obtient-on ?", ["$|\\cos x-\\cos y|\\le|x-y|$", "$|\\cos x-\\cos y|=1$", "$\\cos x=\\cos y$"], 0, "La constante vaut $M=1$.", "Exemple • page 8", 2),
      short("Si $|k'|<0,2$, complète $|k(b)-k(a)|<\\dots$.", ["0,2(b-a)", "0.2(b-a)", "0,2*(b-a)", "0.2*(b-a)"], "On applique l’inégalité avec $M=0,2$.", "Exercice corrigé 2 • page 17"),
      choice("Où se trouve $k(b)$ ?", ["$]k(a)-0,2(b-a);k(a)+0,2(b-a)[$", "$]k(a);k(a)+b[$", "$]-\\infty;+\\infty[$ seulement"], 0, "On retire la valeur absolue.", "Exercice corrigé 2 • page 17", 2),
    ],
  },
  {
    id: "complete-piecewise-function-study",
    title: "Étude complète d’une fonction par morceaux",
    summary: "Enchaîner continuité, dérivabilité, branches infinies, variations et tracé pour une fonction mixte.",
    pages: "8-10",
    section: "II. Applications - Exercice 1",
    durationMinutes: 45,
    kind: "challenge",
    body: String.raw`## Fonction officielle

$$
f(x)=
\begin{cases}
x^2+x,&x<0,\\
\sqrt x-x,&x\ge0.
\end{cases}
$$

Les deux branches tendent vers $f(0)=0$ : $f$ est continue en $0$.

À gauche,

$$\frac{x^2+x}{x}=x+1\to1.$$

À droite,

$$\frac{\sqrt x-x}{x}=\frac1{\sqrt x}-1\to+\infty.$$

La fonction n’est pas dérivable en $0$. Elle possède la demi-tangente $y=x$ à gauche et la demi-tangente verticale $x=0$ à droite.

## Limites et variations

$$\lim_{x\to-\infty}f(x)=+\infty,\qquad
\lim_{x\to+\infty}f(x)=-\infty.$$

En $-\infty$, $f(x)/x=x+1\to-\infty$ : branche parabolique de direction $(OJ)$.

Pour $x<0$, $f'(x)=2x+1$ : minimum en $x=-1/2$, de valeur $-1/4$.

Pour $x>0$, $f'(x)=1/(2\sqrt x)-1$ : maximum en $x=1/4$, de valeur $1/4$.

Ainsi $f$ décroît sur $]-\infty;-1/2]$, croît jusqu’à $1/4$, puis décroît sur $[1/4;+\infty[$.

> **Méthode Bac.** Travaille chaque branche dans une colonne, puis raccorde les résultats au point commun.`,
    keyPoint: "Étude complète = raccord, limites, dérivées, variations, tangentes et tracé.",
    example: "En $0$, pente gauche $1$ mais taux droit $+\\infty$.",
    methodSteps: [
      "Étudie chaque branche séparément.",
      "Au raccord, vérifie continuité et dérivabilité latérale.",
      "Calcule les limites et branches infinies.",
      "Étudie les signes des dérivées puis réunis les tableaux.",
    ],
    timeline: [
      { label: "Raccord", detail: "Continuité puis taux latéraux en 0." },
      { label: "Infini", detail: "Étudier les extrémités." },
      { label: "Signes", detail: "Résoudre les équations f’=0." },
      { label: "Courbe", detail: "Placer extrema et demi-tangentes." },
    ],
    questions: [
      short("Calcule $f'_g(0)$.", ["1", "+1"], "$x+1$ tend vers $1$.", "Application - Exercice 1 • page 8"),
      choice("Que vaut le taux droit en $0$ ?", ["$+\\infty$", "$1$", "$0$"], 0, "$1/\\sqrt x-1$ tend vers $+\\infty$.", "Application - Exercice 1 • page 8"),
      choice("La fonction est-elle dérivable en $0$ ?", ["Non", "Oui, avec $f'(0)=1$", "Oui, avec $f'(0)=0$"], 0, "Le taux droit n’est pas fini.", "Application - Exercice 1 • page 8", 2),
      short("Donne l’abscisse du minimum de $x^2+x$.", ["-1/2", "-0,5", "-0.5"], "$2x+1=0$.", "Application - Exercice 1 • page 9"),
      short("Donne la valeur de ce minimum.", ["-1/4", "-0,25", "-0.25"], "$f(-1/2)=-1/4$.", "Application - Exercice 1 • page 9"),
      short("Donne l’abscisse du maximum de $\\sqrt x-x$.", ["1/4", "0,25", "0.25"], "$1/(2\\sqrt x)-1=0$.", "Application - Exercice 1 • page 9"),
      short("Donne la valeur de ce maximum.", ["1/4", "0,25", "0.25"], "$1/2-1/4=1/4$.", "Application - Exercice 1 • page 9"),
      choice("Quelle branche apparaît en $-\\infty$ ?", ["Une branche parabolique de direction $(OJ)$", "Une asymptote $y=0$", "Une asymptote $x=0$"], 0, "$f(x)/x$ devient infini.", "Application - Exercice 1 • page 9", 2),
    ],
  },
  {
    id: "radical-function-study",
    title: "Valeur absolue, asymptotes et réciproque",
    summary: "Conduire l’étude complète de $h(x)=x+\\sqrt{|x^2-1|}$ et exploiter une restriction bijective.",
    pages: "10-13",
    section: "II. Applications - Exercice 2",
    durationMinutes: 55,
    kind: "challenge",
    body: String.raw`## Décomposer la valeur absolue

$$h(x)=x+\sqrt{|x^2-1|}
=
\begin{cases}
x+\sqrt{x^2-1},&x\in]-\infty;-1]\cup[1;+\infty[,\\[3pt]
x+\sqrt{1-x^2},&x\in[-1;1].
\end{cases}$$

Aux abscisses $-1$ et $1$, des taux latéraux deviennent infinis : la courbe possède des demi-tangentes verticales.

## Asymptotes

Pour $x<-1$, la forme conjuguée donne

$$h(x)=\frac1{x-\sqrt{x^2-1}}\longrightarrow0.$$

La droite $y=0$ est asymptote en $-\infty$.

Pour $x>1$ :

$$h(x)-2x=-\frac1{x+\sqrt{x^2-1}}\longrightarrow0.$$

La droite $y=2x$ est asymptote en $+\infty$. La courbe est sous cette droite sur $]\sqrt2/2;+\infty[$.

## Variations

Pour $|x|>1$ :

$$h'(x)=1+\frac{x}{\sqrt{x^2-1}}.$$

$h$ décroît sur $]-\infty;-1[$ et croît sur $]1;+\infty[$.

Pour $|x|<1$ :

$$h'(x)=1-\frac{x}{\sqrt{1-x^2}}.$$

$h$ croît jusqu’à $x=\sqrt2/2$, où $h=\sqrt2$, puis décroît jusqu’à $1$.

## Restriction bijective

La restriction $k$ à $]-\infty;-1]$ réalise une bijection sur $[-1;0[$.

$$k(-\sqrt2)=1-\sqrt2,\qquad k'(-\sqrt2)=1-\sqrt2,$$

donc

$$(k^{-1})'(1-\sqrt2)=\frac1{1-\sqrt2}=-1-\sqrt2.$$

> **Astuce mémoire de Davy.** Valeur absolue : découper. Racine : rationaliser. Réciproque : retrouver l’antécédent.`,
    keyPoint: "Découpage, formes conjuguées, variations par morceaux, puis dérivée réciproque.",
    example: "$h(x)-2x=-1/(x+\\sqrt{x^2-1})\\to0$ en $+\\infty$.",
    methodSteps: [
      "Étudie le signe sous la valeur absolue.",
      "Calcule les taux latéraux aux raccords.",
      "Soustrais l’asymptote pressentie et rationalise.",
      "Étudie les dérivées avant la restriction réciproque.",
    ],
    timeline: [
      { label: "Découper", detail: "Le signe de x²-1 donne trois intervalles." },
      { label: "Rationaliser", detail: "Révéler y=0 et y=2x." },
      { label: "Varier", detail: "Étudier deux formules de dérivée." },
      { label: "Inverser", detail: "Restreindre puis appliquer la formule réciproque." },
    ],
    questions: [
      choice("Sur $[-1;1]$, quelle expression utilise-t-on ?", ["$x+\\sqrt{1-x^2}$", "$x+\\sqrt{x^2-1}$", "$x-\\sqrt{1-x^2}$"], 0, "$x^2-1\\le0$.", "Application - Exercice 2 • page 10"),
      short("Donne l’asymptote en $-\\infty$.", ["y=0", "y = 0", "(OI)"], "$h(x)$ tend vers $0$.", "Application - Exercice 2 • page 11", 2),
      short("Donne l’asymptote en $+\\infty$.", ["y=2x", "y = 2x"], "$h(x)-2x$ tend vers $0$.", "Application - Exercice 2 • page 11", 2),
      choice("Pour $x>1$, la courbe est…", ["en dessous de $y=2x$", "au-dessus de $y=2x$", "confondue avec $y=2x$"], 0, "$h(x)-2x<0$.", "Application - Exercice 2 • pages 11-12"),
      short("Où la branche intérieure atteint-elle son maximum ?", ["sqrt(2)/2", "√2/2", "\\sqrt2/2", "1/sqrt(2)"], "$h'(x)=0$ donne $x=\\sqrt2/2$.", "Application - Exercice 2 • page 12"),
      short("Quelle est la valeur du maximum ?", ["sqrt(2)", "√2", "\\sqrt2"], "Les deux termes valent $\\sqrt2/2$.", "Application - Exercice 2 • page 13"),
      short("Calcule $k(-\\sqrt2)$.", ["1-sqrt(2)", "1-√2", "1 - sqrt(2)", "1-\\sqrt2"], "On utilise la branche extérieure.", "Application - Exercice 2 • page 13"),
      short("Donne $(k^{-1})'(1-\\sqrt2)$.", ["-1-sqrt(2)", "-1-√2", "-1 - sqrt(2)", "-1-\\sqrt2"], "$1/(1-\\sqrt2)=-1-\\sqrt2$.", "Application - Exercice 2 • page 13", 3),
    ],
  },
  {
    id: "periodic-tangent-study",
    title: "Étude d’une fonction périodique",
    summary: "Déterminer domaine, période, parité, asymptotes et variations de $\\tan(\\pi x/2)$.",
    pages: "13-15",
    section: "II. Applications - Exercice 3",
    durationMinutes: 42,
    kind: "graph",
    body: String.raw`## Fonction officielle

$$f(x)=\tan\left(\frac\pi2x\right).$$

La tangente n’est pas définie lorsque

$$\frac\pi2x=\frac\pi2+k\pi\iff x=1+2k.$$

Ainsi

$$D_f=\mathbb R\setminus\{1+2k\mid k\in\mathbb Z\}.$$

## Période et parité

Comme $\tan(u+\pi)=\tan u$ :

$$f(x+2)=f(x).$$

La fonction est de période $2$. Elle est impaire :

$$f(-x)=-f(x).$$

## Asymptotes et variations

$$\lim_{x\to1^-}f(x)=+\infty,\qquad
\lim_{x\to1^+}f(x)=-\infty.$$

$x=1$ est une asymptote verticale, et par périodicité toutes les droites $x=1+2k$ le sont.

$$f'(x)=\frac\pi2\left[1+\tan^2\left(\frac\pi2x\right)\right]>0.$$

$f$ est strictement croissante sur chaque branche. Pour construire la courbe, on trace $[0;1[$, on utilise l’imparité, puis on translate de $2$.

> **Astuce mémoire de Davy.** Une branche + symétrie + translation suffit pour reconstruire toute la courbe.`,
    keyPoint: "Df=ℝ\\{1+2k}; période 2; impaire; asymptotes x=1+2k; f’>0.",
    example: "$f'(x)=\\frac\\pi2(1+\\tan^2(\\pi x/2))>0$.",
    methodSteps: [
      "Résous l’équation qui annule le cosinus.",
      "Teste f(x+T), puis f(-x).",
      "Calcule les limites latérales aux valeurs exclues.",
      "Étudie une branche et utilise les symétries.",
    ],
    timeline: [
      { label: "Domaine", detail: "Exclure 1+2k." },
      { label: "Répéter", detail: "Période 2." },
      { label: "Symétrie", detail: "Imparité autour de l’origine." },
      { label: "Croître", detail: "Dérivée strictement positive." },
    ],
    questions: [
      choice("Quel est le domaine ?", ["$\\mathbb R\\setminus\\{1+2k;k\\in\\mathbb Z\\}$", "$\\mathbb R$", "$\\mathbb R\\setminus\\{2k\\}$"], 0, "La tangente est exclue pour $x=1+2k$.", "Application - Exercice 3 • page 14", 2),
      short("Donne la période.", ["2"], "$f(x+2)=f(x)$.", "Application - Exercice 3 • page 14"),
      choice("Quelle est la parité ?", ["Impaire", "Paire", "Aucune"], 0, "La tangente est impaire.", "Application - Exercice 3 • page 14"),
      short("Donne l’asymptote étudiée dans le cours.", ["x=1", "x = 1"], "Les limites latérales en $1$ sont infinies.", "Application - Exercice 3 • page 14", 2),
      choice("Quel est le signe de $f'$ ?", ["Strictement positif", "Toujours négatif", "Nul"], 0, "$1+\\tan^2$ est positif.", "Application - Exercice 3 • pages 14-15"),
      choice("Comment obtenir la courbe sur $]-3;3[$ ?", ["Symétrie puis translations de période 2", "Avec une seule droite", "En remplaçant la tangente par un polynôme"], 0, "Le PDF combine imparité et périodicité.", "Application - Exercice 3 • page 15", 2),
    ],
  },
  {
    id: "cocoa-profit-mission",
    title: "Mission : maximiser le bénéfice de l’usine",
    summary: "Modéliser une décision de production par l’étude des variations d’une fonction cubique.",
    pages: "15-16",
    section: "C. Situation complexe 1",
    durationMinutes: 38,
    kind: "challenge",
    body: String.raw`## Situation

Une usine produit entre $1\,000$ et $5\,000$ sachets de cacao par jour. Si $x$ désigne le nombre de **milliers** de sachets, le bénéfice en millions de FCFA est

$$B(x)=-\frac13x^3+9x+2,\qquad x\in[1;5].$$

## Dérivée et variations

$$B'(x)=-x^2+9=-(x-3)(x+3).$$

Sur $[1;5]$, $x+3>0$. Donc :

- $B'(x)>0$ pour $1\le x<3$ ;
- $B'(3)=0$ ;
- $B'(x)<0$ pour $3<x\le5$.

$B$ croît sur $[1;3]$, puis décroît sur $[3;5]$. Son maximum est atteint en $x=3$ :

$$B(3)=-9+27+2=20.$$

L’usine doit donc produire **3 000 sachets** pour un bénéfice maximal d’environ **20 millions de FCFA**.

> **Astuce mémoire de Davy.** Après l’optimisation, reviens toujours à l’unité réelle.

> **Correction.** Le tableau imprimé page 16 inverse les signes. Le texte et le calcul sont corrects : $B'$ est positif avant $3$ et négatif après.`,
    keyPoint: "Maximum en x=3 : 3 000 sachets et 20 millions de FCFA.",
    example: "$B'(x)=-(x-3)(x+3)$ et $x+3>0$ sur $[1;5]$.",
    methodSteps: [
      "Identifie variable, unité et intervalle.",
      "Calcule et factorise la dérivée.",
      "Étudie son signe sur l’intervalle.",
      "Lis le maximum et reconvertis l’unité.",
    ],
    timeline: [
      { label: "Modèle", detail: "x en milliers, B en millions." },
      { label: "Dérivée", detail: "Factoriser B’." },
      { label: "Maximum", detail: "Passage de + à - en 3." },
      { label: "Décision", detail: "3 signifie 3 000 sachets." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Où le bénéfice est-il maximal ?",
      instruction: "Déplace le point entre 1 et 5 et repère le sommet.",
      observation: "La courbe monte jusqu’à (3;20), puis redescend.",
      formula: "B(x) = -x³/3 + 9x + 2",
      formulaTex: "B(x)=-\\frac13x^3+9x+2",
      rule: { kind: "polynomial", coefficients: [2, 9, 0, -1 / 3] },
      window: { xMin: 1, xMax: 5, yMin: 0, yMax: 22 },
      guides: [
        { kind: "vertical", value: 3, label: "x = 3" },
        { kind: "horizontal", value: 20, label: "B = 20" },
      ],
      marker: { min: 1, max: 5, step: 0.1, initial: 3 },
    },
    corrections: [
      "Page 16, le tableau imprimé inverse les signes de B’. Le calcul et le texte donnent la bonne lecture : B’≥0 sur [1;3] et B’≤0 sur [3;5].",
    ],
    questions: [
      short("Donne $B'(x)$.", ["-x^2+9", "9-x^2", "-x²+9"], "La dérivée est $-x^2+9$.", "Situation complexe 1 • page 16"),
      short("Factorise $B'(x)$.", ["-(x-3)(x+3)", "(3-x)(x+3)", "-(x - 3)(x + 3)"], "Différence de deux carrés.", "Situation complexe 1 • page 16", 2),
      short("À quelle valeur de $x$ le bénéfice est-il maximal ?", ["3"], "La dérivée passe de positive à négative.", "Situation complexe 1 • page 16"),
      short("Combien de sachets faut-il produire ?", ["3000", "3 000"], "$x$ est en milliers.", "Situation complexe 1 • page 16", 2),
      short("Quel est le bénéfice maximal, en millions de FCFA ?", ["20"], "$B(3)=20$.", "Situation complexe 1 • page 16", 2),
      choice("Quels signes corrige-t-on dans le tableau ?", ["$+$ avant 3, puis $-$ après 3", "$-$ avant 3, puis $+$ après 3", "$+$ partout"], 0, "$B'(2)>0$ et $B'(4)<0$.", "Correction raisonnée • page 16", 2),
    ],
  },
  {
    id: "corrected-exercises-workshop",
    title: "Atelier des cinq exercices corrigés",
    summary: "Réinvestir raccords, IAF, dérivées d’ordre n, réciproque de tangente et étude avec racine.",
    pages: "17-20",
    section: "D. Exercices corrigés 1 à 5",
    durationMinutes: 50,
    kind: "practice",
    body: String.raw`## Exercice 1 - Raccord en $-1$

$$
f(x)=
\begin{cases}
1-x^2,&x<-1,\\
\dfrac{2x+2}{x+2},&x\ge-1.
\end{cases}
$$

Les deux taux d’accroissement tendent vers $2$ : $f$ est dérivable en $-1$ et $f'(-1)=2$.

## Exercice 2 - Accroissement contrôlé

Si $|k'(x)|<0,2$ sur $[a;b]$, alors

$$k(b)\in]k(a)-0,2(b-a);\,k(a)+0,2(b-a)[.$$

## Exercice 3 - Dérivée n-ième

$$\cos^{(n)}(x)=\cos\left(x+n\frac\pi2\right).$$

## Exercice 4 - Réciproque de la tangente

Pour $\varphi=\arctan$ :

$$\varphi'(x)=\frac1{1+x^2}$$

et

$$
\varphi(x)+\varphi(1/x)=
\begin{cases}
\pi/2,&x>0,\\
-\pi/2,&x<0.
\end{cases}
$$

## Exercice 5 - Racine rationnelle

$$f(x)=\sqrt{\frac{1-x}{1+x}},\qquad D_f=]-1;1].$$

La courbe a l’asymptote $x=-1$ et une demi-tangente verticale en $x=1$. $f$ décroît de $+\infty$ vers $0$ et réalise une bijection sur $[0;+\infty[$. Comme $f(0)=1$ et $f'(0)=-1$ :

$$(f^{-1})'(1)=-1.$$

Les courbes de $f$ et $f^{-1}$ sont symétriques par rapport à $y=x$.

> **Astuce mémoire de Davy.** Ces cinq exercices forment une fiche de diagnostic de toute la leçon.`,
    keyPoint: "Chaque exercice corrigé associe une propriété à une interprétation.",
    example: "$f'_g(-1)=f'_d(-1)=2$ dans l’exercice 1.",
    methodSteps: [
      "Identifie la notion principale.",
      "Écris la propriété exacte.",
      "Rédige chaque conclusion graphique ou algébrique.",
      "Compare avec la correction et explique l’erreur éventuelle.",
    ],
    timeline: [
      { label: "Raccord", detail: "Exercice 1." },
      { label: "Bornes", detail: "Exercices 2 et 3." },
      { label: "Réciproque", detail: "Exercice 4." },
      { label: "Étude", detail: "Exercice 5." },
    ],
    questions: [
      short("Exercice 1 : donne $f'_g(-1)$.", ["2"], "$(1-x^2)/(x+1)=1-x$.", "Exercice corrigé 1 • page 17"),
      short("Donne $f'_d(-1)$.", ["2"], "Le quotient se simplifie en $2/(x+2)$.", "Exercice corrigé 1 • page 17"),
      choice("Quelle conclusion ?", ["$f$ est dérivable en $-1$ et $f'(-1)=2$", "$f$ est discontinue", "La tangente est verticale"], 0, "Les dérivées latérales sont égales.", "Exercice corrigé 1 • page 17", 2),
      choice("Si $|k'|<0,2$, qu’est-ce qui borne $|k(b)-k(a)|$ ?", ["$0,2(b-a)$", "$2(b+a)$", "$0,2$ seulement"], 0, "IAF.", "Exercice corrigé 2 • page 17"),
      short("Complète $\\cos^{(n)}(x)=\\cos(x+\\dots)$.", ["n*pi/2", "nπ/2", "n\\pi/2"], "Chaque dérivation ajoute $\\pi/2$.", "Exercice corrigé 3 • pages 17-18"),
      short("Donne $\\varphi'(x)$ pour $\\varphi=\\arctan$.", ["1/(1+x^2)", "1/(x^2+1)"], "Formule réciproque.", "Exercice corrigé 4 • page 18"),
      short("Pour $x>0$, calcule $\\varphi(x)+\\varphi(1/x)$.", ["pi/2", "π/2", "\\pi/2"], "La somme est constante.", "Exercice corrigé 4 • page 18", 2),
      choice("Quel est le domaine de $\\sqrt{(1-x)/(1+x)}$ ?", ["$]-1;1]$", "$\\mathbb R$", "$[-1;1]$"], 0, "Quotient positif, dénominateur non nul.", "Exercice corrigé 5 • pages 18-19"),
      short("Donne son asymptote verticale.", ["x=-1", "x = -1"], "$f(x)\\to+\\infty$ en $-1^+$.", "Exercice corrigé 5 • page 19"),
      short("Donne $(f^{-1})'(1)$.", ["-1"], "$f(0)=1$ et $f'(0)=-1$.", "Exercice corrigé 5 • page 20", 2),
    ],
  },
  {
    id: "reinforcement-exercises-mission",
    title: "Mission finale : exercices de renforcement",
    summary: "Mobiliser toutes les méthodes sur les quatorze familles d’exercices officiels.",
    pages: "20-24",
    section: "IV. Exercices de fixation et de renforcement",
    durationMinutes: 70,
    kind: "challenge",
    body: String.raw`## Banque officielle

| Exercice | Fonction ou objectif | Compétence |
|---:|---|---|
| 1 | 16 fonctions usuelles | calcul de dérivées |
| 2 | $\sqrt{x^2+x-2}$ | dérivabilité en $-2$ et $1$ |
| 3 | $\tan x\ge x$ et encadrement de racines | accroissements finis |
| 4 | réciproque de $\sin$ | dérivée d’une réciproque |
| 5 | $x|x-3|+2$ | raccord en $3$ |
| 6 | $x^2-2\sqrt x$ | demi-tangente en $0$ |
| 7 | $\dfrac{x}{|x|+1}$ | parité, tangente et asymptote |
| 8 | $\dfrac{x^2+|x-2|}{x+1}$ | raccord et asymptotes |
| 9 | $\sqrt{x^2+3x+2}$ | deux branches, symétrie, inverse |
| 10 | $1+\dfrac{x}{\sqrt{1+x^2}}$ | bijection et courbe réciproque |
| 11 | $x-2\sqrt x+1$ | involution sur $[0;1]$ |
| 12 | $(2-x)\sqrt{4-x^2}$ | dérivabilité aux bornes |
| 13 | $\sqrt{x^2+1}-x$ | asymptote en $-\infty$ |
| 14 | $-\dfrac x2+\dfrac{\sqrt{x^2-1}}x$ | fonction auxiliaire et racine $\alpha$ |

## Stratégie commune

1. domaine ;
2. continuité et raccords ;
3. limites aux bornes ;
4. demi-tangentes et asymptotes ;
5. dérivée, signe et variations ;
6. parité, symétrie ou bijection ;
7. tracé.

## Résultats repères

- $x|x-3|+2$ a un point anguleux en $3$ ;
- $x/(|x|+1)$ est impaire et tend vers $1$ en $+\infty$ ;
- $\sqrt{x^2+3x+2}$ a pour domaine $]-\infty;-2]\cup[-1;+\infty[$ et pour axe $x=-3/2$ ;
- $\sqrt{x^2+1}-x=1/(\sqrt{x^2+1}+x)$ en $+\infty$ ;
- dans l’exercice 14, $g(x)=2-x^2\sqrt{x^2-1}$ possède une unique racine $\alpha\in]1;2[$.

> **Astuce mémoire de Davy.** Ne commence jamais par la dérivée : domaine et limites déterminent déjà la moitié du dessin.`,
    keyPoint: "Domaine → raccords → limites → asymptotes → dérivée → variations → symétries → tracé.",
    example: "Pour $\\sqrt{x^2+3x+2}$, $(x+1)(x+2)\\ge0$ donne le domaine.",
    methodSteps: [
      "Écris la fiche d’identité de la fonction.",
      "Traite les bornes avant les points intérieurs.",
      "Construis le tableau de signes de la dérivée.",
      "Regroupe extrema, tangentes et asymptotes.",
    ],
    timeline: [
      { label: "Fixation", detail: "Exercices 1 à 4." },
      { label: "Raccords", detail: "Exercices 5 à 8." },
      { label: "Bijections", detail: "Exercices 9 à 11." },
      { label: "Synthèse", detail: "Exercices 12 à 14." },
    ],
    questions: [
      short("Exercice 1 : dérive $-3x^3+4x^2-7x+2$.", ["-9x^2+8x-7", "-9x²+8x-7"], "Dérivation terme à terme.", "Exercice 1 • page 21", 2),
      choice("Exercice 2 : domaine de $\\sqrt{x^2+x-2}$ ?", ["$]-\\infty;-2]\\cup[1;+\\infty[$", "$[-2;1]$", "$\\mathbb R$"], 0, "$(x+2)(x-1)\\ge0$.", "Exercice 2 • page 21", 2),
      choice("Exercice 3 : inégalité demandée ?", ["$\\tan x\\ge x$", "$\\tan x\\le0$", "$\\tan x=x$ partout"], 0, "La dérivée de $\\tan x-x$ vaut $\\tan^2x$.", "Exercice 3 • page 21"),
      short("Exercice 4 : dérivée de la réciproque de $\\sin$.", ["1/sqrt(1-x^2)", "1/√(1-x^2)", "1/\\sqrt(1-x^2)"], "Dérivée de l’arcsinus.", "Exercice 4 • page 21", 2),
      choice("Exercice 5 : phénomène en $3$ ?", ["Un point anguleux", "Une asymptote horizontale", "Une période 3"], 0, "Pentes latérales différentes.", "Exercice 5 • page 21"),
      choice("Exercice 6 : phénomène en $0$ ?", ["Une demi-tangente verticale à droite", "Une asymptote horizontale", "Une bijection trigonométrique"], 0, "Le taux contient $-2/\\sqrt x$.", "Exercice 6 • pages 21-22"),
      choice("Exercice 7 : parité de $x/(|x|+1)$ ?", ["Impaire", "Paire", "Aucune"], 0, "Le numérateur change de signe.", "Exercice 7 • page 22"),
      short("Exercice 8 : asymptote verticale ?", ["x=-1", "x = -1"], "Le dénominateur s’annule en $-1$.", "Exercice 8 • page 22", 2),
      choice("Exercice 9 : domaine ?", ["$]-\\infty;-2]\\cup[-1;+\\infty[$", "$[-2;-1]$", "$\\mathbb R$"], 0, "$(x+1)(x+2)\\ge0$.", "Exercice 9 • page 22", 2),
      short("Exercice 9 : axe de symétrie ?", ["x=-3/2", "x = -3/2", "x=-1,5", "x=-1.5"], "Le trinôme est centré en $-3/2$.", "Exercice 9 • page 22"),
      short("Exercice 10 : limite en $+\\infty$ ?", ["2"], "$x/\\sqrt{1+x^2}\\to1$.", "Exercice 10 • page 23"),
      choice("Exercice 11 : $f\\circ f(x)=x$ signifie…", ["$f$ est sa propre réciproque", "$f$ est constante", "$f$ n’est pas bijective"], 0, "C’est une involution.", "Exercice 11 • page 23", 2),
      choice("Exercice 12 : domaine ?", ["$[-2;2]$", "$]-\\infty;-2]\\cup[2;+\\infty[$", "$\\mathbb R$"], 0, "$4-x^2\\ge0$.", "Exercice 12 • page 23"),
      short("Exercice 13 : limite en $+\\infty$ ?", ["0"], "La forme conjuguée tend vers $0$.", "Exercice 13 • page 23", 2),
      short("Exercice 13 : asymptote en $-\\infty$ ?", ["y=-2x", "y = -2x"], "$f(x)+2x\\to0$.", "Exercice 13 • page 23", 2),
      choice("Exercice 14 : où se trouve $\\alpha$ ?", ["$1<\\alpha<2$", "$\\alpha<0$", "$\\alpha=1$"], 0, "L’étude de $g$ l’établit.", "Exercice 14 • pages 23-24", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCDerivativesPath: LearningPath = {
  id: "terminale-c-math-l04-derivatives-functions",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 4,
  title: "Dérivabilité et étude de fonctions",
  description: "Le cours officiel intégral, sans les activités introductives, enrichi avec ses applications et exercices.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Étudier la dérivabilité latérale, les raccords et les demi-tangentes",
    "Dériver les fonctions composées, réciproques et les dérivées successives",
    "Appliquer les inégalités des accroissements finis",
    "Conduire une étude complète avec asymptotes, variations et symétries",
    "Résoudre une situation d’optimisation et des exercices de niveau Bac",
  ],
  modules: [{
    id: "official-course",
    title: "Leçon officielle",
    description: "Progression fidèle au document source, des notions aux missions de synthèse.",
    lessons: builtLevels,
  }],
};
