import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 02 Probabilité.pdf";

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
    id: "random-experiments-events",
    title: "Expérience aléatoire, éventualités et univers",
    summary: "Reconnaître une expérience aléatoire, nommer ses résultats possibles et écrire son univers.",
    pages: "1-2",
    section: "I-1-a. Expérience aléatoire",
    durationMinutes: 15,
    xp: 45,
    body: String.raw`## Expérience aléatoire

On lance un dé non truqué à six faces numérotées de 1 à 6 et on note le nombre figurant sur la face supérieure.

- Les résultats possibles sont **finis et connus** : 1, 2, 3, 4, 5 ou 6.
- On ne peut pas prévoir d'avance le résultat qui sera obtenu.

Une telle expérience est appelée **expérience aléatoire** : une expérience dont l'issue ne peut être connue d'avance.

## Éventualité et univers

- Chaque résultat possible est appelé **éventualité**.
- L'ensemble de toutes les éventualités d'une expérience aléatoire est appelé **univers**. En général, on le note $\Omega$ (oméga).

### Exemple du cours

Pour le lancer d'un dé à six faces non truqué numéroté de 1 à 6 :

- $6$ est une éventualité ;
- $\Omega=\{1;2;3;4;5;6\}$ est l'univers.

### Exercice de fixation entièrement rédigé

On lance deux fois de suite une pièce de monnaie. Écris en extension l'univers $\Omega$ des éventualités.

En notant $P$ pour pile et $F$ pour face, chaque issue est un **couple ordonné** : le premier symbole donne le résultat du premier lancer, le second celui du deuxième lancer.

$$\Omega=\{(P,P);(P,F);(F,P);(F,F)\}$$

| Expérience | Une éventualité | Univers $\Omega$ | $\operatorname{card}(\Omega)$ |
|---|---|---|---|
| Lancer d'un dé à six faces | $3$ | $\{1;2;3;4;5;6\}$ | $6$ |
| Deux lancers d'une pièce | $(P,F)$ | $\{(P,P);(P,F);(F,P);(F,F)\}$ | $4$ |

> **Erreur fréquente.** Pour deux lancers successifs, l'ordre compte : $(P,F)$ et $(F,P)$ sont deux éventualités différentes. L'univers n'est pas $\{P;F\}$ mais bien l'ensemble des quatre couples.

> **Astuce mémoire de Davy.** « Une éventualité = un résultat possible ; l'univers = tous les résultats possibles. » $\Omega$ est la boîte qui contient toutes les issues : toute question de probabilité commence par écrire cette boîte.`,
    keyPoint: "Une éventualité appartient à Ω ; Ω rassemble toutes les issues possibles.",
    example: "Deux lancers d'une pièce donnent $\\Omega=\\{(P,P),(P,F),(F,P),(F,F)\\}$.",
    methodSteps: [
      "Décris l'expérience et l'ordre des tirages.",
      "Liste toutes les issues sans oubli ni doublon.",
      "Regroupe-les entre accolades pour écrire l'univers Ω.",
    ],
    timeline: [
      { label: "Observer", detail: "Résultats possibles connus, issue imprévisible : l'expérience est aléatoire." },
      { label: "Nommer", detail: "Chaque résultat possible est une éventualité." },
      { label: "Écrire", detail: "Ω regroupe toutes les éventualités entre accolades." },
    ],
    questions: [
      choice("Quel est l'univers de deux lancers successifs d'une pièce ?", ["$\\{P,F\\}$", "$\\{(P,P),(P,F),(F,P),(F,F)\\}$", "$\\{(P,P),(F,F)\\}$", "$\\{P,P,F,F\\}$"], 1, "Chaque lancer a deux issues et l'ordre compte : il y a quatre couples.", "Exercice de fixation, page 2"),
      short("Combien d'éventualités contient cet univers ?", ["4", "quatre"], "Les quatre couples sont PP, PF, FP et FF.", "Exercice de fixation, page 2"),
      choice("Lancer un dé équilibré et noter la face supérieure est une expérience aléatoire.", ["Vrai", "Faux"], 0, "Les résultats possibles sont connus mais l'issue est imprévisible : c'est la définition.", "Présentation, page 1"),
      short("Quel est le cardinal de l'univers d'un lancer d'un dé à six faces ?", ["6", "six"], "$\\Omega=\\{1;2;3;4;5;6\\}$ contient six éventualités.", "Exemple du cours, page 2"),
      choice("Dans le lancer d'un dé, que représente le nombre 6 ?", ["Une éventualité", "Un univers", "Un événement impossible", "Une probabilité"], 0, "6 est un résultat possible : une éventualité de l'univers Ω.", "Exemple du cours, page 2"),
    ],
  },
  {
    id: "probability-events-subsets",
    title: "Événement et réalisation d'un événement",
    summary: "Décrire un événement comme une partie de l'univers et déterminer quand il est réalisé.",
    pages: "2",
    section: "I-1-b. Événement",
    durationMinutes: 15,
    xp: 45,
    body: String.raw`## Définition

On appelle **événement** tout sous-ensemble de l'univers.

**Remarque.** Une éventualité $\omega$ **appartient** à l'univers ($\omega\in\Omega$), tandis qu'un événement $A$ est **inclus** dans l'univers ($A\subset\Omega$).

| Objet | Nature | Notation |
|---|---|---|
| Éventualité $\omega$ | un élément de $\Omega$ | $\omega\in\Omega$ |
| Événement $A$ | une partie de $\Omega$ | $A\subset\Omega$ |

### Exemple du cours

Pour le lancer d'un dé non truqué à six faces, on peut considérer l'événement $A$ : « obtenir un nombre pair ». On a :

$$A=\{2;4;6\}$$

## Réalisation d'un événement

Un événement $A$ est **réalisé** si l'issue de l'expérience appartient à $A$.

- On obtient $4$ : comme $4\in A$, l'événement $A$ est réalisé.
- On obtient $3$ : comme $3\notin A$, l'événement $A$ n'est pas réalisé.

### Exercice de fixation entièrement rédigé

On lance deux fois de suite une pièce de monnaie. Écris en extension l'événement $B$ : « obtenir face au premier lancer ».

Le premier symbole du couple doit être $F$ ; le second peut être $P$ ou $F$ :

$$B=\{(F,P);(F,F)\}$$

> **Erreur fréquente.** Ne confonds pas $\in$ et $\subset$ : on écrit $2\in\Omega$ pour une éventualité, mais $\{2\}\subset\Omega$ pour un événement. Écrire $A\in\Omega$ pour un événement est une faute de notation.

> **Astuce mémoire de Davy.** « Un événement, c'est une phrase traduite en ensemble. » Écris d'abord $\Omega$, lis la phrase, puis garde uniquement les issues qui la vérifient.`,
    keyPoint: "A est réalisé si et seulement si l'issue obtenue appartient à A.",
    example: "Pour deux lancers, « face au premier lancer » donne $B=\\{(F,P),(F,F)\\}$.",
    methodSteps: [
      "Écris d'abord l'univers.",
      "Traduis la phrase de l'événement.",
      "Garde uniquement les issues qui vérifient cette phrase.",
    ],
    timeline: [
      { label: "Univers", detail: "Poser Ω avant toute chose." },
      { label: "Phrase", detail: "Lire la description de l'événement." },
      { label: "Tri", detail: "Sélectionner les issues qui la vérifient." },
    ],
    questions: [
      choice("Lors de deux lancers, quel événement représente « face au premier lancer » ?", ["$\\{(P,F),(F,F)\\}$", "$\\{(F,P),(F,F)\\}$", "$\\{(F,P),(P,F)\\}$", "$\\{(P,P),(P,F)\\}$"], 1, "Le premier symbole doit être F ; le second peut être P ou F.", "Exercice de fixation, page 2"),
      choice("Un événement d'univers $\\Omega$ est :", ["Une valeur hors de $\\Omega$", "Une partie de $\\Omega$", "Toujours égal à $\\Omega$", "Toujours impossible"], 1, "Par définition, un événement est un sous-ensemble de l'univers.", "Définition, page 2"),
      short("Écris en extension l'événement « obtenir un nombre pair » au lancer d'un dé.", ["{2;4;6}", "{2,4,6}", "2;4;6", "2,4,6"], "Les nombres pairs de l'univers sont 2, 4 et 6.", "Exemple du cours, page 2"),
      choice("On obtient 3 au lancer du dé. L'événement A : « obtenir un nombre pair » est-il réalisé ?", ["Oui", "Non"], 1, "3 n'appartient pas à A = {2;4;6} : A n'est pas réalisé.", "Remarque, page 2"),
      choice("Quelle écriture est correcte pour une éventualité $\\omega$ et un événement $A$ ?", ["$\\omega\\subset\\Omega$ et $A\\in\\Omega$", "$\\omega\\in\\Omega$ et $A\\subset\\Omega$", "$\\omega\\in\\Omega$ et $A\\in\\Omega$", "$\\omega\\subset\\Omega$ et $A\\subset\\Omega$"], 1, "Une éventualité appartient à l'univers ; un événement y est inclus.", "Remarque, page 2"),
    ],
  },
  {
    id: "event-operations",
    title: "Vocabulaire et opérations sur les événements",
    summary: "Traduire les mots « et », « ou », « contraire », « impossible » et « incompatible ».",
    pages: "2-4",
    section: "I-2. Vocabulaire des probabilités",
    durationMinutes: 20,
    xp: 55,
    body: String.raw`## Le tableau du vocabulaire

$A$, $B$ et $C$ représentent des événements d'un univers $\Omega$ lié à une expérience aléatoire. Les exemples utilisent le lancer d'un dé cubique dont les faces sont numérotées de 1 à 6.

| Notation | Vocabulaire ensembliste | Vocabulaire probabiliste | Exemple avec le dé |
|---|---|---|---|
| $\Omega$ | ensemble de référence | univers | $\Omega=\{1;2;3;4;5;6\}$ |
| $\varnothing$ | ensemble vide | événement impossible | $C$ : « multiple de 3 inférieur ou égal à 2 » ; $C=\varnothing$ |
| $\omega\in\Omega$ | $\omega$ appartient à $\Omega$ | $\omega$ est une éventualité, un résultat, une issue | $3$ est un résultat du lancer |
| $A\subset\Omega$ | $A$ est un sous-ensemble de $\Omega$ | $A$ est un événement | « obtenir un multiple de 3 » |
| $\omega\in A$ | $\omega$ appartient à $A$ | $\omega$ réalise $A$ | $2$ réalise $A$ : « nombre pair » |
| $A\subset B$ | $A$ est inclus dans $B$ | $A$ implique $B$ | « multiple de 6 » implique « nombre pair » |
| $A\cap B$ | intersection de $A$ et $B$ | événement « $A$ **et** $B$ » | pair **et** multiple de 3 : $A\cap B=\{6\}$ |
| $A\cup B$ | réunion de $A$ et $B$ | événement « $A$ **ou** $B$ » | pair **ou** multiple de 3 : $A\cup B=\{2;3;4;6\}$ |
| $A\cap B=\varnothing$ | $A$ et $B$ sont disjoints | $A$ et $B$ sont incompatibles | « pair » et « impair » |
| $\overline A$ | complémentaire de $A$ | événement contraire de $A$ | le contraire de « pair » est « impair » |

- $A\cap B$ ne se réalise que si $A$ et $B$ se réalisent **à la fois**.
- $A\cup B$ se réalise dès que **l'un au moins** des deux événements se réalise.
- $A$ se réalise si et seulement si $\overline A$ ne se réalise pas.

## Contraires et incompatibles : attention !

Deux événements **contraires** sont toujours incompatibles… mais deux événements **incompatibles** ne sont pas nécessairement contraires : « obtenir 1 » et « obtenir 2 » sont incompatibles sans être contraires, car on peut n'obtenir ni l'un ni l'autre.

### Exercice de fixation entièrement rédigé

Réponds par vrai ou faux :

1. Deux événements contraires sont incompatibles. → **Vrai** : ils ne peuvent pas se réaliser ensemble.
2. Un événement qui ne se réalise jamais est appelé événement certain. → **Faux** : c'est l'événement impossible $\varnothing$.
3. Deux événements incompatibles sont contraires. → **Faux** : voir le contre-exemple ci-dessus.
4. Le nombre d'éléments d'un ensemble fini est appelé cardinal. → **Vrai** : c'est la définition.

> **Erreur fréquente.** Le « ou » des probabilités est **inclusif** : $A\cup B$ se réalise aussi lorsque $A$ et $B$ se réalisent tous les deux en même temps.

> **Astuce mémoire de Davy.** « **et** → $\cap$ ; **ou** → $\cup$ ; **non** → barre. » Incompatibles : jamais ensemble. Contraires : jamais ensemble **et** toujours l'un des deux.`,
    keyPoint: "« et » → intersection ; « ou » → réunion ; « non » → événement contraire.",
    example: "Avec $A=\\{2,4,6\\}$ et $B=\\{3,6\\}$ : $A\\cap B=\\{6\\}$ et $A\\cup B=\\{2,3,4,6\\}$.",
    methodSteps: [
      "Repère le connecteur logique de la phrase.",
      "Choisis intersection, réunion ou contraire.",
      "Vérifie le résultat dans l'univers.",
    ],
    timeline: [
      { label: "Connecteur", detail: "Repérer « et », « ou », « non » dans la phrase." },
      { label: "Traduction", detail: "∩ pour « et », ∪ pour « ou », barre pour « non »." },
      { label: "Vérification", detail: "Contrôler le résultat issue par issue dans Ω." },
    ],
    questions: [
      choice("Deux événements contraires sont incompatibles.", ["Vrai", "Faux"], 0, "Ils ne peuvent pas se réaliser ensemble.", "Exercice de fixation, affirmation 1, page 4"),
      choice("Un événement qui ne se réalise jamais est certain.", ["Vrai", "Faux"], 1, "Il est impossible, donc égal à l'ensemble vide.", "Exercice de fixation, affirmation 2, page 4"),
      choice("Deux événements incompatibles sont toujours contraires.", ["Vrai", "Faux"], 1, "Ils peuvent être disjoints sans couvrir tout l'univers.", "Exercice de fixation, affirmation 3, page 4"),
      choice("Le nombre d'éléments d'un ensemble fini est son cardinal.", ["Vrai", "Faux"], 0, "C'est la définition du cardinal.", "Exercice de fixation, affirmation 4, page 4"),
      short("Au lancer d'un dé, avec A : « nombre pair » et B : « multiple de 3 », écris $A\\cap B$.", ["{6}", "6"], "Le seul nombre à la fois pair et multiple de 3 entre 1 et 6 est 6.", "Exemples du tableau, page 4"),
      short("Écris $A\\cup B$ pour ces mêmes événements.", ["{2;3;4;6}", "{2,3,4,6}", "2;3;4;6", "2,3,4,6"], "On réunit les nombres pairs et les multiples de 3 : 2, 3, 4 et 6.", "Exemples du tableau, page 4"),
      choice("Quel est l'événement contraire de A : « obtenir un nombre pair » ?", ["« Obtenir un multiple de 3 »", "« Obtenir un nombre impair »", "« Obtenir 6 »", "L'événement impossible"], 1, "Ā se réalise exactement quand A ne se réalise pas.", "Exemples du tableau, page 4"),
    ],
  },
  {
    id: "finite-probability",
    title: "Probabilité sur un ensemble fini",
    summary: "Définir une loi de probabilité et calculer la probabilité d'un événement.",
    pages: "5",
    section: "II-1. Définition",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## Définir une loi de probabilité

On note $\Omega=\{\omega_1,\omega_2,\ldots,\omega_n\}$ l'ensemble des éventualités d'une expérience aléatoire.

Définir une **probabilité** sur $\Omega$, c'est associer à chaque résultat $\omega_i$ un nombre $P_i$ (appelé probabilité de l'issue $\omega_i$), positif ou nul, de telle façon que :

$$P_1+P_2+\cdots+P_n=1$$

La probabilité d'un événement $A$, notée $P(A)$, est la **somme** des probabilités $P_i$ des éventualités qui constituent $A$.

**Remarque.** La probabilité de tout événement $A$ vérifie : $0\le P(A)\le1$.

### Exercice de fixation entièrement rédigé

On lance un dé pipé tel que $P(1)=P(3)=P(4)=\dfrac18$ et $P(2)=P(6)=\dfrac14$. Calcule $P(5)$.

La somme de toutes les probabilités vaut $1$ :

$$P(1)+P(2)+P(3)+P(4)+P(5)+P(6)=1$$

D'où $3P(1)+2P(2)+P(5)=1$, donc :

$$P(5)=1-3\times\frac18-2\times\frac14=1-\frac38-\frac48=\frac18$$

### Exercice d'application entièrement rédigé

On lance un dé pipé tel que $P(1)=P(2)=P(3)=P(4)=P(5)$ et $P(6)=3P(1)$. Calcule la probabilité d'apparition de chaque face.

La somme vaut $1$ : $5P(1)+3P(1)=1$, d'où $8P(1)=1$ et $P(1)=\dfrac18$.

Par suite :

$$P(1)=P(2)=P(3)=P(4)=P(5)=\frac18\qquad\text{et}\qquad P(6)=\frac38$$

> **Erreur fréquente.** Vérifie toujours ton résultat : chaque $P_i$ doit rester entre $0$ et $1$, et la somme de toutes les probabilités doit redonner exactement $1$.

> **Astuce mémoire de Davy.** « La masse totale vaut 1. » Quand une probabilité manque, écris la somme complète, remplace ce que tu connais et isole l'inconnue — exactement comme une équation.`,
    keyPoint: "La somme des probabilités de toutes les issues vaut 1.",
    example: "Pour le dé pipé du cours, $P(5)=1-3\\times\\frac18-2\\times\\frac14=\\frac18$.",
    methodSteps: [
      "Écris la somme de toutes les probabilités.",
      "Remplace les valeurs connues.",
      "Isole la probabilité inconnue et vérifie qu'elle est entre 0 et 1.",
    ],
    timeline: [
      { label: "Somme = 1", detail: "La masse totale de probabilité vaut toujours 1." },
      { label: "Addition", detail: "P(A) s'obtient en additionnant les probabilités des issues de A." },
      { label: "Encadrement", detail: "Toute probabilité reste entre 0 et 1." },
    ],
    questions: [
      short("Un dé pipé vérifie $P(1)=P(3)=P(4)=\\frac18$ et $P(2)=P(6)=\\frac14$. Calcule $P(5)$.", ["1/8", "0,125", "0.125"], "$3\\times\\frac18+2\\times\\frac14=\\frac78$, donc $P(5)=\\frac18$.", "Exercice de fixation, page 5", 2),
      choice("Quelle relation doit vérifier une loi sur six issues ?", ["$\\sum p_i=0$", "$\\sum p_i=1$", "$\\sum p_i=6$", "$\\sum p_i=-1$"], 1, "La masse totale de probabilité vaut toujours 1.", "Définition, page 5"),
      short("Un dé pipé vérifie $P(1)=P(2)=P(3)=P(4)=P(5)$ et $P(6)=3P(1)$. Calcule $P(1)$.", ["1/8", "0,125", "0.125"], "$5P(1)+3P(1)=1$ donne $8P(1)=1$, donc $P(1)=\\frac18$.", "Exercice d'application 1, page 10", 2),
      short("Calcule $P(6)$ pour ce même dé.", ["3/8", "0,375", "0.375"], "$P(6)=3P(1)=\\frac38$.", "Exercice d'application 1, page 11"),
      choice("Une loi de probabilité peut-elle donner $P(A)=1{,}2$ ?", ["Oui", "Non"], 1, "Toute probabilité vérifie 0 ≤ P(A) ≤ 1.", "Remarque, page 5"),
    ],
  },
  {
    id: "probability-event-properties",
    title: "Propriétés des probabilités",
    summary: "Calculer réunion, événement contraire et cas incompatibles.",
    pages: "5-6",
    section: "II-2. Propriétés",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## Les propriétés à connaître

Soit $A$ et $B$ deux événements de $\Omega$.

| Propriété | Énoncé |
|---|---|
| Événement certain | $P(\Omega)=1$ |
| Événement impossible | $P(\varnothing)=0$ |
| Croissance | si $A\subset B$, alors $P(A)\le P(B)$ |
| Réunion | $P(A\cup B)=P(A)+P(B)-P(A\cap B)$ |
| Événements incompatibles | si $A\cap B=\varnothing$, alors $P(A\cup B)=P(A)+P(B)$ |
| Événement contraire | $P(\overline A)=1-P(A)$ |

> **Pourquoi soustraire $P(A\cap B)$ ?** Dans $P(A)+P(B)$, les issues communes à $A$ et $B$ sont comptées deux fois — une fois dans chaque événement. On retranche donc $P(A\cap B)$ pour ne les compter qu'une seule fois.

### Exercice de fixation entièrement rédigé

Soit $\Omega$ l'univers d'une expérience aléatoire et deux événements $A$ et $B$ tels que $P(A)=0{,}3$, $P(B)=0{,}5$ et $P(A\cap B)=0{,}1$.

**1) Calcul de $P(A\cup B)$.**

$$P(A\cup B)=P(A)+P(B)-P(A\cap B)=0{,}3+0{,}5-0{,}1=0{,}7$$

**2) Calcul de $P(\overline A)$, $P(\overline B)$ et $P(\overline{A\cup B})$.**

$$P(\overline A)=1-P(A)=1-0{,}3=0{,}7\qquad P(\overline B)=1-P(B)=1-0{,}5=0{,}5$$

$$P(\overline{A\cup B})=1-P(A\cup B)=1-0{,}7=0{,}3$$

> **Erreur fréquente.** $P(\overline{A\cup B})$ n'est pas $P(\overline A)+P(\overline B)$ : la barre s'applique à l'événement **tout entier**. Calcule d'abord $P(A\cup B)$, puis complète à $1$.

> **Astuce mémoire de Davy.** « Certain vaut 1, impossible vaut 0, le contraire complète à 1. » Et pour la réunion : « j'ajoute, puis j'enlève ce que j'ai compté deux fois. »`,
    keyPoint: "Soustraire l'intersection évite de compter deux fois les issues communes.",
    example: "Si $P(A)=0{,}3$, $P(B)=0{,}5$ et $P(A\\cap B)=0{,}1$, alors $P(A\\cup B)=0{,}7$.",
    methodSteps: [
      "Identifie les données P(A), P(B) et P(A∩B).",
      "Applique la formule de la réunion.",
      "Utilise 1−P(A) pour un événement contraire.",
    ],
    timeline: [
      { label: "Données", detail: "Relever P(A), P(B) et P(A∩B) dans l'énoncé." },
      { label: "Formule", detail: "P(A∪B) = P(A) + P(B) − P(A∩B)." },
      { label: "Contraire", detail: "P(Ā) = 1 − P(A) pour conclure." },
    ],
    questions: [
      short("Avec $P(A)=0{,}3$, $P(B)=0{,}5$ et $P(A\\cap B)=0{,}1$, calcule $P(A\\cup B)$.", ["0,7", "0.7", "7/10"], "$0{,}3+0{,}5-0{,}1=0{,}7$.", "Exercice de fixation, question 1, page 5"),
      short("Calcule $P(\\overline A)$.", ["0,7", "0.7", "7/10"], "$1-0{,}3=0{,}7$.", "Exercice de fixation, question 2, page 5"),
      short("Calcule $P(\\overline{A\\cup B})$.", ["0,3", "0.3", "3/10"], "$1-P(A\\cup B)=1-0{,}7=0{,}3$.", "Exercice de fixation, question 2, page 6"),
      short("Calcule $P(\\overline B)$.", ["0,5", "0.5", "1/2", "5/10"], "$1-P(B)=1-0{,}5=0{,}5$.", "Exercice de fixation, question 2, page 6"),
      choice("Si $A$ et $B$ sont incompatibles, alors $P(A\\cup B)$ vaut :", ["$P(A)+P(B)$", "$P(A)\\times P(B)$", "$P(A)+P(B)-1$", "$1$"], 0, "P(A∩B) = 0 : la formule de la réunion se simplifie.", "Propriétés, page 5"),
      choice("Si $A\\subset B$, alors :", ["$P(A)\\ge P(B)$", "$P(A)\\le P(B)$", "$P(A)=P(B)$", "$P(A)=1-P(B)$"], 1, "Toute issue de A est aussi dans B : la probabilité croît avec l'inclusion.", "Propriétés, page 5"),
    ],
  },
  {
    id: "probability-equiprobability",
    title: "Équiprobabilité et dénombrement",
    summary: "Reconnaître l'équiprobabilité et utiliser le quotient cas favorables sur cas possibles.",
    pages: "6, 11-12",
    section: "II-3. Équiprobabilité",
    durationMinutes: 28,
    xp: 75,
    body: String.raw`## Équiprobabilité

Lorsque tous les événements élémentaires d'un univers ont la même probabilité, on dit qu'il y a **équiprobabilité**.

Dans ce cas, si l'univers $\Omega$ est composé de $n$ éventualités $\omega_i$ :

$$P_i=P(\{\omega_i\})=\frac{1}{\operatorname{card}(\Omega)}=\frac1n$$

On a alors, pour tout événement $A$ :

$$P(A)=\frac{\operatorname{card}(A)}{\operatorname{card}(\Omega)}=\frac{\text{nombre de cas favorables}}{\text{nombre de cas possibles}}$$

**Remarque.** Les expressions « dé parfait ou équilibré », « boule tirée de l'urne au hasard », « boules indiscernables au toucher »… indiquent que le modèle associé est l'équiprobabilité.

**Notation.** Le cours note $C_n^p$ le nombre de choix de $p$ objets parmi $n$ (tirage simultané, sans ordre) ; on rencontre aussi l'écriture $\binom{n}{p}$, qui désigne exactement le même nombre.

### Exercice de fixation entièrement rédigé

On place dans un sac 5 pièces de 500 F, 10 pièces de 250 F et 15 pièces de 25 F, indiscernables au toucher. On tire **simultanément** 4 pièces du sac.

Le nombre de tirages possibles est :

$$\operatorname{card}(\Omega)=C_{30}^{4}=27\,405$$

**1) $C$ : « n'avoir choisi aucune pièce de 25 F ».** On tire les 4 pièces parmi les $5+10=15$ pièces qui ne sont pas de 25 F :

$$P(C)=\frac{C_{15}^{4}}{C_{30}^{4}}=\frac{1365}{27\,405}=\frac{13}{261}$$

**2) $D$ : « avoir obtenu uniquement des pièces de 250 F ».**

$$P(D)=\frac{C_{10}^{4}}{C_{30}^{4}}=\frac{210}{27\,405}=\frac{2}{261}$$

**3) $E$ : « avoir obtenu au moins une pièce de 500 F ».** On passe par l'événement contraire $\overline E$ : « aucune pièce de 500 F » :

$$P(E)=1-P(\overline E)=1-\frac{C_{25}^{4}}{C_{30}^{4}}=1-\frac{12\,650}{27\,405}=\frac{14\,755}{27\,405}=\frac{2951}{5481}$$

**4) $F$ : « avoir obtenu au moins une pièce de chaque valeur ».** Avec 4 pièces et 3 valeurs, une valeur apparaît deux fois et chacune des deux autres une fois :

$$P(F)=\frac{C_5^2C_{10}^1C_{15}^1+C_{10}^2C_5^1C_{15}^1+C_{15}^2C_5^1C_{10}^1}{C_{30}^{4}}=\frac{10\,125}{27\,405}=\frac{75}{203}$$

> **Erreur fréquente.** « Au moins un… » se traduit presque toujours par le passage au contraire « aucun… ». Compter directement tous les cas favorables d'un « au moins » est long et source d'oublis.

> **Astuce mémoire de Davy.** « Favorables sur possibles. » Trois réflexes dans l'ordre : vérifier l'équiprobabilité, compter les cas possibles, compter les cas favorables. Et dès que tu lis « au moins », pense au contraire.`,
    keyPoint: "En équiprobabilité : P(A) = nombre de cas favorables / nombre de cas possibles.",
    example: "Tirer simultanément 4 pièces parmi 30 donne $C_{30}^{4}=27\\,405$ tirages possibles.",
    methodSteps: [
      "Vérifie l'équiprobabilité grâce aux mots de l'énoncé.",
      "Compte les cas possibles avec les combinaisons.",
      "Compte les cas favorables puis simplifie le quotient.",
    ],
    timeline: [
      { label: "Modèle", detail: "« Au hasard », « équilibré », « indiscernables » : équiprobabilité." },
      { label: "Dénombrer", detail: "card(Ω) puis card(A) avec les combinaisons." },
      { label: "Quotient", detail: "P(A) = card(A) / card(Ω), à simplifier." },
    ],
    corrections: [
      "La solution de l'exercice 4 (renforcement) affiche par endroits 20 474 et 20 457 comme nombre de choix ; la valeur correcte C(28,4) = 20 475 est utilisée dans tous les calculs.",
    ],
    questions: [
      short("Dans le sac de l'exercice officiel, combien existe-t-il de tirages simultanés de 4 pièces parmi 30 ?", ["27405", "27 405"], "$\\binom{30}{4}=27\\,405$.", "Exercice de fixation, page 6"),
      short("Quelle est la probabilité de n'obtenir que des pièces de 250 F ?", ["2/261", "210/27405"], "$\\binom{10}{4}/\\binom{30}{4}=210/27405=2/261$.", "Exercice de fixation, question 2, page 6", 2),
      short("Quelle est la probabilité d'obtenir au moins une pièce de 500 F ?", ["2951/5481", "14755/27405"], "On passe par le contraire : $1-\\binom{25}{4}/\\binom{30}{4}=2951/5481$.", "Exercice de fixation, question 3, page 6", 2),
      short("Yasmine tire simultanément 3 boules parmi 5 noires et 15 rouges. Combien de tirages possibles ?", ["1140", "1 140"], "$C_{20}^{3}=1140$.", "Exercice de renforcement 3, question 1"),
      short("Calcule P(A) : « exactement une boule noire ».", ["35/76", "105/228", "525/1140"], "$C_5^1\\times C_{15}^2/1140=525/1140=35/76$.", "Exercice de renforcement 3, question 2a", 2),
      short("Calcule P(B) : « exactement deux boules noires ».", ["5/38", "15/114", "150/1140"], "$C_5^2\\times C_{15}^1/1140=150/1140=5/38$.", "Exercice de renforcement 3, question 2a", 2),
      short("Calcule P(C) : « exactement trois boules noires ».", ["1/114", "10/1140"], "$C_5^3/1140=10/1140=1/114$.", "Exercice de renforcement 3, question 2a"),
      short("Calcule P(D) : « au moins une boule noire ».", ["137/228"], "$P(\\overline D)=C_{15}^3/1140=91/228$, donc $P(D)=1-91/228=137/228$.", "Exercice de renforcement 3, question 2b", 2),
      short("Un chariot compte 28 desserts. Combien de choix de 4 gâteaux sont possibles ?", ["20475", "20 475"], "$C_{28}^{4}=20\\,475$.", "Exercice de renforcement 4"),
      short("Calcule la probabilité de choisir au moins un gâteau à la vanille (10 vanille sur 28).", ["1161/1365", "387/455"], "$P(\\overline D)=C_{18}^4/C_{28}^4=3060/20475=204/1365$, donc $P(D)=1161/1365$.", "Exercice de renforcement 4, question 4", 2),
    ],
  },
  {
    id: "random-variable-law",
    title: "Variable aléatoire, loi, espérance et variance",
    summary: "Associer une valeur réelle aux issues, construire la loi, mesurer moyenne et dispersion, puis résoudre la mission de la kermesse.",
    pages: "7-10, 11-13",
    section: "III. Variables aléatoires — série A1 seulement",
    durationMinutes: 35,
    xp: 85,
    kind: "challenge",
    body: String.raw`## Variable aléatoire

Soit $\Omega$ l'ensemble des résultats d'une expérience aléatoire.

- On appelle **variable aléatoire** toute fonction $X$ de $\Omega$ dans $\mathbb R$ qui, à tout élément de $\Omega$, fait correspondre un nombre réel $x$.
- L'événement noté $\{X=x\}$ est l'ensemble des éléments de $\Omega$ qui ont pour image $x$ par $X$.
- L'ensemble des valeurs prises par $X$ est noté $\Omega'$.

### Exemple du cours

Pour un lancer de dé, on définit $X=0$ si le nombre obtenu est pair et $X=1$ s'il est impair. L'ensemble des valeurs prises par $X$ est $\Omega'=\{0;1\}$.

## Loi de probabilité d'une variable aléatoire (loi image)

Soit $\Omega'=\{x_1,x_2,\ldots,x_m\}$ l'ensemble des valeurs prises par $X$. La **loi de probabilité** de $X$ est la fonction qui, à chaque $x_i$, fait correspondre le nombre $p_i=P(X=x_i)$. La somme de ces probabilités vaut $1$.

| $x_i$ | $0$ | $1$ |
|---|---|---|
| $P(X=x_i)$ | $\dfrac12$ | $\dfrac12$ |

## Espérance, variance et écart type

| Indicateur | Formule | Ce qu'il mesure |
|---|---|---|
| Espérance | $E(X)=p_1x_1+p_2x_2+\cdots+p_nx_n$ | la moyenne des valeurs de $X$ sur un grand nombre de parties |
| Variance | $V(X)=p_1x_1^2+p_2x_2^2+\cdots+p_nx_n^2-\left(E(X)\right)^2$ | la dispersion autour de cette moyenne |
| Écart type | $\sigma=\sqrt{V(X)}$ | la dispersion, dans la même unité que $X$ |

Lorsque $X$ représente le gain algébrique d'un joueur :

- $E(X)=0$ : le jeu est **équitable** ;
- $E(X)>0$ : le jeu est **favorable** au joueur ;
- $E(X)<0$ : le jeu est **défavorable** au joueur.

### Exercice de fixation entièrement rédigé

Une urne contient 5 boules : 2 noires et 3 rouges. On tire simultanément 2 boules. $X$ est le nombre de boules noires tirées.

**1)** On peut tirer zéro, une ou deux boules noires : $\Omega'=\{0;1;2\}$.

**2)** $\operatorname{card}(\Omega)=C_5^2=10$, puis :

$$P(X=0)=\frac{C_3^2}{C_5^2}=\frac{3}{10}\qquad P(X=1)=\frac{C_2^1\times C_3^1}{C_5^2}=\frac{6}{10}\qquad P(X=2)=\frac{C_2^2}{C_5^2}=\frac{1}{10}$$

| $x_i$ | $0$ | $1$ | $2$ | total |
|---|---|---|---|---|
| $P(X=x_i)$ | $\dfrac3{10}$ | $\dfrac6{10}$ | $\dfrac1{10}$ | $1$ |

**3)**

$$E(X)=0\times\frac3{10}+1\times\frac6{10}+2\times\frac1{10}=\frac8{10}=\frac45$$

$$V(X)=0^2\times\frac3{10}+1^2\times\frac6{10}+2^2\times\frac1{10}-\left(\frac8{10}\right)^2=\frac{100}{100}-\frac{64}{100}=\frac{9}{25}\qquad\sigma=\sqrt{\frac{9}{25}}=\frac35$$

## Mission finale — la kermesse de Mariam (situation complexe)

Une urne contient 3 boules jaunes, 2 bleues, 1 rouge et 4 vertes, toutes indiscernables au toucher. On tire une boule au hasard. Si elle est rouge, le joueur gagne 100 F ; verte, 20 F ; jaune, 30 F ; bleue, $m$ F avec $m>0$. Mariam veut être sûre de gagner en moyenne au moins 45 F.

Soit $X$ le gain du joueur. Sa loi de probabilité est :

| $x_i$ | $20$ | $30$ | $m$ | $100$ |
|---|---|---|---|---|
| $P(X=x_i)$ | $\dfrac4{10}$ | $\dfrac3{10}$ | $\dfrac2{10}$ | $\dfrac1{10}$ |

$$E(X)=\frac4{10}\times20+\frac3{10}\times30+\frac2{10}\times m+\frac1{10}\times100=\frac{270+2m}{10}$$

$$E(X)\ge45\iff\frac{270+2m}{10}\ge45\iff2m\ge180\iff m\ge90$$

La valeur minimale de $m$ est donc **90 F**.

## Exercice d'approfondissement — fiabilité d'un test de dépistage

Dans une population, la proportion de malades est $x$. Sur 100 personnes malades, 98 ont un test positif ; sur 100 personnes saines, 1 seule a un test positif. La probabilité qu'une personne au test positif soit réellement malade est :

$$f(x)=\frac{98x}{97x+1}\quad\text{pour }x\in[0;1]$$

Le test est jugé **fiable** lorsque $f(x)\ge0{,}95$.

- $f(0{,}05)=\dfrac{98\times0{,}05}{97\times0{,}05+1}=\dfrac{4{,}9}{5{,}85}\approx0{,}84<0{,}95$ : si 5 % de la population est malade, le test n'est **pas** fiable.
- $f(x)\ge0{,}95\iff98x\ge0{,}95(97x+1)\iff5{,}85x\ge0{,}95\iff x\ge\dfrac{19}{117}\approx0{,}162$.

Le test devient fiable dès que la proportion de malades atteint $\dfrac{19}{117}$, soit environ 16,3 %.

> **Erreur fréquente.** Dans la variance, ce sont les **valeurs** $x_i$ que l'on élève au carré, jamais les probabilités — et il ne faut pas oublier de retrancher $\left(E(X)\right)^2$ à la fin.

> **Astuce mémoire de Davy.** « L'espérance, c'est la moyenne pondérée des gains ; la variance, c'est la moyenne des carrés moins le carré de la moyenne. » Et pour un jeu, le signe de $E(X)$ désigne le camp avantagé.`,
    keyPoint: "E(X) mesure le gain moyen ; σ(X) mesure la dispersion autour de cette moyenne.",
    example: "À la kermesse de Mariam, $E(X)=\\frac{270+2m}{10}\\ge45$ impose $m\\ge90$.",
    methodSteps: [
      "Liste les valeurs prises par X.",
      "Calcule chaque P(X = xᵢ) et vérifie que leur somme vaut 1.",
      "Calcule successivement E(X), V(X) puis σ(X), et interprète le signe de E(X).",
    ],
    timeline: [
      { label: "Valeurs", detail: "Déterminer Ω′, l'ensemble des valeurs prises par X." },
      { label: "Loi", detail: "Associer sa probabilité à chaque valeur ; la somme vaut 1." },
      { label: "Indicateurs", detail: "E(X) pour la moyenne, V(X) et σ pour la dispersion." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La fiabilité du test grimpe avec la proportion de malades",
      instruction: "Déplace x, la proportion de malades : à partir de quand la courbe dépasse-t-elle le seuil 0,95 ?",
      observation: "f(0,05) ≈ 0,84 : sous le seuil. La courbe franchit y = 0,95 en x = 19/117 ≈ 0,162 : le test devient fiable à partir d'environ 16,3 % de malades.",
      formula: "f(x) = 98x/(97x + 1)",
      formulaTex: "f(x)=\\frac{98x}{97x+1}",
      rule: { kind: "rational-linear", numerator: [98, 0], denominator: [97, 1] },
      window: { xMin: -0.05, xMax: 1.05, yMin: -0.05, yMax: 1.1 },
      guides: [
        { kind: "horizontal", value: 0.95, label: "y = 0,95" },
        { kind: "vertical", value: 0.162, label: "x = 19/117" },
      ],
      marker: { min: 0, max: 1, step: 0.005, initial: 0.05 },
    },
    corrections: [
      "Le tableau général de la loi, page 8, répète w₁ en tête de deux colonnes ; il faut lire x₁, x₂, …, xₙ.",
      "La solution de l'exercice 5 conclut « fiable si au moins 17 % de la population est malade » ; le seuil exact est 19/117 ≈ 16,3 %, arrondi au pourcent supérieur dans le PDF.",
    ],
    questions: [
      choice("Dans l'exercice des 2 boules noires et 3 rouges, quelles valeurs peut prendre $X$ ?", ["$\\{0,1\\}$", "$\\{1,2\\}$", "$\\{0,1,2\\}$", "$\\{0,2,3\\}$"], 2, "On peut tirer zéro, une ou deux boules noires.", "Exercice de fixation, question 1, page 8"),
      short("Calcule $E(X)$ pour la loi $P(X=0)=3/10$, $P(X=1)=6/10$, $P(X=2)=1/10$.", ["4/5", "0,8", "0.8"], "$0\\times3/10+1\\times6/10+2\\times1/10=4/5$.", "Exercice de fixation, question 3-a, pages 8-9", 2),
      short("Calcule la variance $V(X)$.", ["9/25", "0,36", "0.36"], "Le calcul officiel donne $V(X)=9/25$.", "Exercice de fixation, question 3-b, page 9", 2),
      short("Calcule l'écart type $\\sigma(X)$.", ["3/5", "0,6", "0.6"], "$\\sigma(X)=\\sqrt{9/25}=3/5$.", "Exercice de fixation, question 3-b, page 9"),
      short("Loi : $x_i=-15;0;15;30$ avec $p_i=\\frac18;\\frac38;\\frac38;\\frac18$. Calcule $E(X)$.", ["15/2", "7,5", "7.5", "60/8"], "$E(X)=(-15+45+30)/8=60/8=15/2$.", "Exercice d'application 2, question 1", 2),
      short("Calcule $V(X)$ pour cette même loi.", ["675/4", "1350/8", "168,75", "168.75"], "$V(X)=1800/8-(15/2)^2=225-56{,}25=168{,}75$.", "Exercice d'application 2, question 2", 2),
      choice("Kermesse de Mariam : quelle est la probabilité de gagner 20 F ?", ["$\\frac1{10}$", "$\\frac2{10}$", "$\\frac3{10}$", "$\\frac4{10}$"], 3, "Le gain 20 F correspond aux 4 boules vertes parmi 10 boules.", "C-Situation complexe, page 10"),
      short("Exprime $E(X)$ en fonction de $m$ (kermesse de Mariam).", ["(270+2m)/10", "(2m+270)/10", "27+0,2m", "27+0.2m"], "$E(X)=8+9+0{,}2m+10=\\frac{270+2m}{10}$.", "C-Situation complexe, page 10", 2),
      short("Quelle valeur minimale de $m$ assure un gain moyen d'au moins 45 F ?", ["90", "90 F", "m=90"], "$\\frac{270+2m}{10}\\ge45$ équivaut à $m\\ge90$.", "C-Situation complexe, page 10", 2),
      short("Test de dépistage : calcule $f(0{,}05)$ arrondi au centième.", ["0,84", "0.84"], "$f(0{,}05)=4{,}9/5{,}85\\approx0{,}8376\\approx0{,}84$.", "Exercice d'approfondissement 5, question 1"),
      choice("Le test est-il fiable lorsque 5 % de la population est malade ?", ["Oui", "Non"], 1, "0,84 < 0,95 : le test n'est pas fiable à ce niveau.", "Exercice d'approfondissement 5, question 1"),
      short("À partir de quelle proportion $x$ le test devient-il fiable ?", ["19/117", "0,162", "0.162"], "$f(x)\\ge0{,}95$ équivaut à $x\\ge19/117\\approx0{,}162$.", "Exercice d'approfondissement 5, question 2", 2),
    ],
  },
];

const curriculumLabel = "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée";
const theme = { number: 2, title: "Modélisation d'un phénomène aléatoire" };

const a1Levels = levels.map((seed, index) => officialLevel(index + 1, seed));
const a2Levels = levels.slice(0, -1).map((seed, index) => officialLevel(index + 1, seed));

export const terminalA1ProbabilityPath: LearningPath = {
  id: "terminale-a1-probability-random-variable",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel,
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme,
  chapterNumber: 2,
  title: "Probabilité et variable aléatoire",
  description: "Le cours officiel intégral : expériences aléatoires, vocabulaire des événements, lois de probabilité, équiprobabilité, variable aléatoire et mission finale de la kermesse.",
  estimatedMinutes: a1Levels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire une expérience aléatoire",
    "Calculer la probabilité d'un événement",
    "Déterminer la loi d'une variable aléatoire",
  ],
  modules: [{
    id: "terminale-a1-probability-random-variable-mastery",
    title: "Maîtriser la probabilité et la variable aléatoire",
    description: "Progression fidèle au document source ; la situation d'apprentissage introductive est retirée et la situation complexe sert de mission finale.",
    lessons: a1Levels,
  }],
};

export const terminalA2ProbabilityPath: LearningPath = {
  id: "terminale-a2-probability",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel,
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme,
  chapterNumber: 2,
  title: "Probabilité",
  description: "Le cours officiel : expériences aléatoires, vocabulaire des événements, lois de probabilité et équiprobabilité pour la Terminale A2.",
  estimatedMinutes: a2Levels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire une expérience aléatoire",
    "Combiner des événements",
    "Calculer une probabilité en situation d'équiprobabilité",
  ],
  modules: [{
    id: "terminale-a2-probability-mastery",
    title: "Maîtriser les probabilités",
    description: "Progression fidèle au document source ; la partie « Variables aléatoires » est réservée à la série A1.",
    lessons: a2Levels,
  }],
};
