import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
} from "../domain/paths";

const sourceUrl = "https://dpfc-ci.net/";
const curriculumLabel = "Programme ivoirien • Terminale A • Cours officiel fourni";

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

interface FaithfulLevelSeed {
  id: string;
  title: string;
  summary: string;
  pages: string;
  section: string;
  body: string;
  keyPoint: string;
  example: string;
  steps: string[];
  questions: LessonQuestion[];
  weight?: number;
  durationMinutes?: number;
  kind?: LessonKind;
  corrections?: string[];
}

function faithfulLevel(index: number, sourceDocument: string, seed: FaithfulLevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes ?? 18,
    xp: seed.weight ?? 60,
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
    interaction: {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Suivre le raisonnement",
      instruction: "Parcours les trois repères avant de passer à la méthode.",
      observation: "Les définitions, propriétés et exemples proviennent du cours fourni ; les activités d’introduction ne sont pas intégrées.",
      items: [
        { label: "Comprendre", detail: seed.summary },
        { label: "Retenir", detail: seed.keyPoint },
        { label: "Appliquer", detail: seed.example },
      ],
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Suis cette démarche sur les exercices officiels associés à cette partie.",
      steps: seed.steps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "Justifie chaque transformation par la définition ou la propriété correspondante.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

interface PathSeed {
  id: string;
  levelIds?: string[];
  chapterNumber: number;
  themeNumber: number;
  themeTitle: string;
  title: string;
  description: string;
  outcomes: string[];
  moduleTitle: string;
  sourceDocument: string;
  levels: FaithfulLevelSeed[];
}

function buildPath(seed: PathSeed): LearningPath {
  const lessons = seed.levels.map((item, index) => faithfulLevel(index + 1, seed.sourceDocument, item));
  return {
    id: seed.id,
    subjectId: "mathematics",
    levelIds: seed.levelIds ?? ["terminale-a"],
    curriculumLabel,
    curriculumSourceUrl: sourceUrl,
    theme: { number: seed.themeNumber, title: seed.themeTitle },
    chapterNumber: seed.chapterNumber,
    title: seed.title,
    description: seed.description,
    estimatedMinutes: lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
    outcomes: seed.outcomes,
    modules: [{
      id: `${seed.id}-mastery`,
      title: seed.moduleTitle,
      description: "Le cours est découpé selon les blocs officiels placés avant chaque exercice de fixation.",
      lessons,
    }],
  };
}

const probabilityDocument = "TA Maths leçon 02 Probabilité.pdf";

const probabilityLevels: FaithfulLevelSeed[] = [
  {
    id: "random-experiments-events",
    title: "Expérience aléatoire, éventualités et univers",
    summary: "Reconnaître une expérience aléatoire, nommer ses résultats possibles et écrire son univers.",
    pages: "1-2",
    section: "I-1-a. Expérience aléatoire",
    body: String.raw`## Expérience aléatoire

Une expérience est **aléatoire** lorsque ses résultats possibles sont connus, mais que son issue ne peut pas être prévue à l’avance. Chaque résultat possible est une **éventualité**.

L’ensemble de toutes les éventualités est appelé **univers** et se note généralement $\Omega$.

Pour un dé équilibré à six faces : $\Omega=\{1;2;3;4;5;6\}$. Le nombre $6$ est une éventualité.`,
    keyPoint: "Une éventualité appartient à Ω ; Ω rassemble toutes les issues possibles.",
    example: "Deux lancers d’une pièce donnent $\Omega=\{(P,P),(P,F),(F,P),(F,F)\}$.",
    steps: ["Décris l’expérience et l’ordre des tirages.", "Liste toutes les issues sans oubli ni doublon.", "Regroupe-les entre accolades pour écrire $\Omega$."],
    questions: [
      choice("Quel est l’univers de deux lancers successifs d’une pièce ?", ["$\{P,F\}$", "$\{(P,P),(P,F),(F,P),(F,F)\}$", "$\{(P,P),(F,F)\}$", "$\{P,P,F,F\}$"], 1, "Chaque lancer a deux issues et l’ordre compte : il y a quatre couples.", "Exercice de fixation, page 2"),
      short("Combien d’éventualités contient cet univers ?", ["4", "quatre"], "Les quatre couples sont PP, PF, FP et FF.", "Exercice de fixation, page 2"),
    ],
    weight: 45,
  },
  {
    id: "probability-events-subsets",
    title: "Événement et réalisation d’un événement",
    summary: "Décrire un événement comme une partie de l’univers et déterminer quand il est réalisé.",
    pages: "2",
    section: "I-1-b. Événement",
    body: String.raw`## Définition

Un **événement** est tout sous-ensemble de l’univers. Une éventualité $\omega$ appartient à $\Omega$, tandis qu’un événement $A$ est inclus dans $\Omega$.

On écrit $\omega\in\Omega$ et $A\subseteq\Omega$. L’événement $A$ est réalisé lorsque l’issue obtenue appartient à $A$.

Pour un dé, l’événement « obtenir un nombre pair » est $A=\{2;4;6\}$.`,
    keyPoint: "A est réalisé si et seulement si l’issue obtenue appartient à A.",
    example: "Pour deux lancers, « face au premier lancer » donne $B=\{(F,P),(F,F)\}$.",
    steps: ["Écris d’abord l’univers.", "Traduis la phrase de l’événement.", "Garde uniquement les issues qui vérifient cette phrase."],
    questions: [
      choice("Lors de deux lancers, quel événement représente « face au premier lancer » ?", ["$\{(P,F),(F,F)\}$", "$\{(F,P),(F,F)\}$", "$\{(F,P),(P,F)\}$", "$\{(P,P),(P,F)\}$"], 1, "Le premier symbole doit être F ; le second peut être P ou F.", "Exercice de fixation, page 2"),
      choice("Un événement d’univers $\Omega$ est :", ["Une valeur hors de $\Omega$", "Une partie de $\Omega$", "Toujours égal à $\Omega$", "Toujours impossible"], 1, "Par définition, un événement est un sous-ensemble de l’univers.", "Définition, page 2"),
    ],
    weight: 45,
  },
  {
    id: "event-operations",
    title: "Vocabulaire et opérations sur les événements",
    summary: "Traduire les mots « et », « ou », « contraire », « impossible » et « incompatible ».",
    pages: "2-4",
    section: "I-2. Vocabulaire des probabilités",
    body: String.raw`## Vocabulaire essentiel

- $A\cap B$ est l’événement « $A$ **et** $B$ ».
- $A\cup B$ est l’événement « $A$ **ou** $B$ », au sens d’au moins un des deux.
- $\overline A$ est l’événement contraire de $A$.
- $A\cap B=\varnothing$ signifie que $A$ et $B$ sont incompatibles.
- $\varnothing$ est l’événement impossible et $\Omega$ l’événement certain.

Deux événements contraires sont incompatibles, mais deux événements incompatibles ne sont pas nécessairement contraires.`,
    keyPoint: "« et » → intersection ; « ou » → réunion ; « non » → événement contraire.",
    example: "Avec $A=\{2,4,6\}$ et $B=\{3,6\}$ : $A\cap B=\{6\}$ et $A\cup B=\{2,3,4,6\}$.",
    steps: ["Repère le connecteur logique de la phrase.", "Choisis intersection, réunion ou contraire.", "Vérifie le résultat dans l’univers."],
    questions: [
      choice("Deux événements contraires sont incompatibles.", ["Vrai", "Faux"], 0, "Ils ne peuvent pas se réaliser ensemble.", "Exercice de fixation, affirmation 1, page 4"),
      choice("Un événement qui ne se réalise jamais est certain.", ["Vrai", "Faux"], 1, "Il est impossible, donc égal à l’ensemble vide.", "Exercice de fixation, affirmation 2, page 4"),
      choice("Deux événements incompatibles sont toujours contraires.", ["Vrai", "Faux"], 1, "Ils peuvent être disjoints sans couvrir tout l’univers.", "Exercice de fixation, affirmation 3, page 4"),
      choice("Le nombre d’éléments d’un ensemble fini est son cardinal.", ["Vrai", "Faux"], 0, "C’est la définition du cardinal.", "Exercice de fixation, affirmation 4, page 4"),
    ],
    weight: 55,
  },
  {
    id: "finite-probability",
    title: "Probabilité sur un ensemble fini",
    summary: "Définir une loi de probabilité et calculer la probabilité d’un événement.",
    pages: "5",
    section: "II-1. Définition",
    body: String.raw`## Loi de probabilité

Définir une probabilité sur $\Omega=\{\omega_1,\ldots,\omega_n\}$ consiste à associer à chaque issue $\omega_i$ un nombre $p_i\ge0$ tel que $p_1+\cdots+p_n=1$.

La probabilité d’un événement $A$ est la somme des probabilités des éventualités qui constituent $A$. Toute probabilité vérifie $0\le P(A)\le1$.`,
    keyPoint: "La somme des probabilités de toutes les issues vaut 1.",
    example: "Si cinq probabilités sont connues, la sixième s’obtient en retranchant leur somme à 1.",
    steps: ["Écris la somme de toutes les probabilités.", "Remplace les valeurs connues.", "Isole la probabilité inconnue et vérifie qu’elle est entre 0 et 1."],
    questions: [
      short("Un dé pipé vérifie $P(1)=P(3)=P(4)=\frac18$ et $P(2)=P(6)=\frac14$. Calcule $P(5)$.", ["1/8", "0,125", "0.125"], "$3\times\frac18+2\times\frac14=\frac78$, donc $P(5)=\frac18$.", "Exercice de fixation, page 5", 2),
      choice("Quelle relation doit vérifier une loi sur six issues ?", ["$\sum p_i=0$", "$\sum p_i=1$", "$\sum p_i=6$", "$\sum p_i=-1$"], 1, "La masse totale de probabilité vaut toujours 1.", "Définition, page 5"),
    ],
    weight: 60,
  },
  {
    id: "probability-event-properties",
    title: "Propriétés des probabilités",
    summary: "Calculer réunion, événement contraire et cas incompatibles.",
    pages: "5-6",
    section: "II-2. Propriétés",
    body: String.raw`## Propriétés

$P(\Omega)=1$, $P(\varnothing)=0$ et, si $A\subseteq B$, alors $P(A)\le P(B)$.

Pour deux événements :

$P(A\cup B)=P(A)+P(B)-P(A\cap B)$.

S’ils sont incompatibles, $P(A\cap B)=0$. Enfin, $P(\overline A)=1-P(A)$.`,
    keyPoint: "Soustraire l’intersection évite de compter deux fois les issues communes.",
    example: "Si $P(A)=0,3$, $P(B)=0,5$ et $P(A\cap B)=0,1$, alors $P(A\cup B)=0,7$.",
    steps: ["Identifie les données $P(A)$, $P(B)$ et $P(A\cap B)$.", "Applique la formule de la réunion.", "Utilise $1-P(A)$ pour un contraire."],
    questions: [
      short("Avec $P(A)=0,3$, $P(B)=0,5$ et $P(A\cap B)=0,1$, calcule $P(A\cup B)$.", ["0,7", "0.7", "7/10"], "$0,3+0,5-0,1=0,7$.", "Exercice de fixation, question 1, page 5"),
      short("Calcule $P(\overline A)$.", ["0,7", "0.7", "7/10"], "$1-0,3=0,7$.", "Exercice de fixation, question 2, page 5"),
      short("Calcule $P(\overline{A\cup B})$.", ["0,3", "0.3", "3/10"], "$1-P(A\cup B)=1-0,7=0,3$.", "Exercice de fixation, question 2, page 6"),
    ],
    weight: 60,
  },
  {
    id: "probability-equiprobability",
    title: "Équiprobabilité et dénombrement",
    summary: "Reconnaître l’équiprobabilité et utiliser le quotient cas favorables sur cas possibles.",
    pages: "6",
    section: "II-3. Équiprobabilité",
    body: String.raw`## Équiprobabilité

Lorsque toutes les issues ont la même probabilité, il y a équiprobabilité. Si $\Omega$ contient $n$ issues, chaque événement élémentaire a pour probabilité $\frac1n$ et

$P(A)=\dfrac{\operatorname{card}(A)}{\operatorname{card}(\Omega)}=\dfrac{\text{cas favorables}}{\text{cas possibles}}$.

Les expressions « dé équilibré », « au hasard » ou « indiscernables au toucher » signalent généralement ce modèle.`,
    keyPoint: "En équiprobabilité : P(A) = nombre de cas favorables / nombre de cas possibles.",
    example: "Tirer simultanément 4 pièces parmi 30 donne $\binom{30}{4}=27\,405$ choix possibles.",
    steps: ["Vérifie l’équiprobabilité.", "Compte les cas possibles avec les combinaisons.", "Compte les cas favorables puis simplifie le quotient."],
    questions: [
      short("Dans le sac de l’exercice officiel, combien existe-t-il de tirages simultanés de 4 pièces parmi 30 ?", ["27405", "27 405"], "$\binom{30}{4}=27\,405$.", "Exercice de fixation, page 6"),
      short("Quelle est la probabilité de n’obtenir que des pièces de 250 F ?", ["2/261", "210/27405"], "$\binom{10}{4}/\binom{30}{4}=210/27405=2/261$.", "Exercice de fixation, question 2, page 6", 2),
      short("Quelle est la probabilité d’obtenir au moins une pièce de 500 F ?", ["2951/5481", "14755/27405"], "On passe par le contraire : $1-\binom{25}{4}/\binom{30}{4}=2951/5481$.", "Exercice de fixation, question 3, page 6", 2),
    ],
    weight: 75,
  },
  {
    id: "random-variable-law",
    title: "Variable aléatoire, loi, espérance et variance",
    summary: "Associer une valeur réelle aux issues, construire la loi et mesurer moyenne et dispersion.",
    pages: "7-9",
    section: "III. Variables aléatoires - série A1 seulement",
    body: String.raw`## Variable aléatoire

Une variable aléatoire $X$ est une fonction de $\Omega$ vers $\mathbb R$. L’événement $\{X=x\}$ rassemble les issues dont l’image est $x$. La loi de $X$ associe à chaque valeur $x_i$ la probabilité $p_i=P(X=x_i)$, avec $\sum p_i=1$.

## Indicateurs

$E(X)=\sum x_ip_i$, $V(X)=\sum x_i^2p_i-[E(X)]^2$ et $\sigma(X)=\sqrt{V(X)}$.

Pour un gain : $E(X)=0$ signifie jeu équitable ; $E(X)>0$ jeu favorable ; $E(X)<0$ jeu défavorable.`,
    keyPoint: "E(X) mesure le gain moyen ; σ(X) mesure la dispersion autour de cette moyenne.",
    example: "Avec 2 boules noires et 3 rouges, en tirant 2 boules, $X$ peut valoir $0$, $1$ ou $2$.",
    steps: ["Liste les valeurs prises par $X$.", "Calcule chaque $P(X=x_i)$ et vérifie que leur somme vaut 1.", "Calcule successivement $E(X)$, $V(X)$ puis $\sigma(X)$."],
    questions: [
      choice("Dans l’exercice des 2 boules noires et 3 rouges, quelles valeurs peut prendre $X$ ?", ["$\{0,1\}$", "$\{1,2\}$", "$\{0,1,2\}$", "$\{0,2,3\}$"], 2, "On peut tirer zéro, une ou deux boules noires.", "Exercice de fixation, question 1, page 8"),
      short("Calcule $E(X)$ pour la loi $P(X=0)=3/10$, $P(X=1)=6/10$, $P(X=2)=1/10$.", ["4/5", "0,8", "0.8"], "$0\times3/10+1\times6/10+2\times1/10=4/5$.", "Exercice de fixation, question 3-a, pages 8-9", 2),
      short("Calcule la variance $V(X)$.", ["9/25", "0,36", "0.36"], "Le calcul officiel donne $V(X)=9/25$.", "Exercice de fixation, question 3-b, page 9", 2),
      short("Calcule l’écart type $\sigma(X)$.", ["3/5", "0,6", "0.6"], "$\sigma(X)=\sqrt{9/25}=3/5$.", "Exercice de fixation, question 3-b, page 9"),
    ],
    weight: 85,
    kind: "challenge",
  },
];

const logarithmDocument = "TA Maths leçon 03 fonction logarithme neperien.pdf";

const logarithmLevels: FaithfulLevelSeed[] = [
  {
    id: "log-definition-properties",
    title: "Définition et domaine du logarithme népérien",
    summary: "Définir $\ln$, connaître son domaine, sa dérivée et sa valeur en 1.",
    pages: "1-2",
    section: "I-1. Définition et notation",
    body: String.raw`La fonction logarithme népérien, notée $\ln$, est définie sur $]0;+\infty[$. Sa dérivée est la fonction $x\mapsto\frac1x$ et elle s’annule en $1$.

Ainsi, $\ln(1)=0$ et, pour tout $x>0$, $(\ln x)'=\frac1x$. Un réel négatif ou nul n’a pas d’image par $\ln$ dans $\mathbb R$.`,
    keyPoint: "Domaine : ]0 ; +∞[ ; ln(1)=0 ; (ln x)'=1/x.",
    example: "La fonction $x\mapsto\ln(x)$ n’est pas définie pour $x=-2$.",
    steps: ["Impose toujours l’argument strictement positif.", "Utilise $\ln(1)=0$.", "Pour dériver $\ln x$, écris $1/x$."],
    questions: [
      choice("L’ensemble de définition de $x\mapsto\ln x$ est $\mathbb R$.", ["Vrai", "Faux"], 1, "Il est $]0;+\infty[$.", "Exercice de fixation, affirmation 1, page 1"),
      choice("$\ln(1)=0$.", ["Vrai", "Faux"], 0, "C’est une conséquence de la définition.", "Exercice de fixation, affirmation 2, page 1"),
      choice("Pour $x>0$, $(\ln x)'=1/x$.", ["Vrai", "Faux"], 0, "C’est la dérivée de référence.", "Exercice de fixation, affirmation 3, page 1"),
      choice("L’image d’un nombre négatif par $\ln$ existe dans $\mathbb R$.", ["Vrai", "Faux"], 1, "Le logarithme réel exige un argument strictement positif.", "Exercice de fixation, affirmation 5, page 2"),
    ],
    weight: 50,
  },
  {
    id: "log-algebraic-properties",
    title: "Propriétés algébriques du logarithme",
    summary: "Transformer produits, quotients, inverses, racines et puissances.",
    pages: "2",
    section: "I-2. Propriétés algébriques",
    body: String.raw`Pour $a>0$ et $b>0$ :

$\ln(ab)=\ln a+\ln b$, $\ln\left(\frac ab\right)=\ln a-\ln b$, $\ln(1/b)=-\ln b$.

De plus, $\ln(\sqrt a)=\frac12\ln a$ et, pour $n\in\mathbb Z$, $\ln(a^n)=n\ln a$.`,
    keyPoint: "Un produit devient une somme ; un quotient devient une différence.",
    example: "$\ln(24)=\ln(2^3\times3)=3\ln2+\ln3$.",
    steps: ["Factorise l’argument en produits ou quotients.", "Applique la propriété adaptée.", "Regroupe les coefficients de mêmes logarithmes."],
    questions: [
      choice("Exprime $\ln(24)$ avec $\ln2$ et $\ln3$.", ["$2\ln2+3\ln3$", "$3\ln2+\ln3$", "$\ln2+3\ln3$", "$24\ln6$"], 1, "$24=2^3\times3$.", "Exercice de fixation 1-A, page 2"),
      choice("Écris $\ln5+\ln3$ sous la forme $\ln k$.", ["$\ln8$", "$\ln15$", "$\ln(5/3)$", "$\ln2$"], 1, "$\ln a+\ln b=\ln(ab)$.", "Exercice de fixation 2-D, page 2"),
      short("Dans $4\ln5=\ln k$, calcule $k$.", ["625"], "$4\ln5=\ln(5^4)=\ln625$.", "Exercice de fixation 2-F, page 2"),
    ],
    weight: 55,
  },
  {
    id: "log-limits-variations",
    title: "Limites de référence du logarithme",
    summary: "Utiliser les quatre limites de référence de $\ln$ en 0 et à l’infini.",
    pages: "3",
    section: "II-1. Limites de référence",
    body: String.raw`Les limites fondamentales sont :

$\lim_{x\to+\infty}\ln x=+\infty$, $\lim_{x\to0^+}\ln x=-\infty$,

$\lim_{x\to0^+}x\ln x=0$ et $\lim_{x\to+\infty}\frac{\ln x}{x}=0$.

Ces deux dernières formes montrent que $\ln x$ croît moins vite que $x$ à l’infini.`,
    keyPoint: "À droite de 0, ln x → −∞ ; à +∞, ln x → +∞ mais ln x / x → 0.",
    example: "$x(1+\ln x)=x+x\ln x\to0$ lorsque $x\to0^+$.",
    steps: ["Identifie la limite de référence utile.", "Réécris le produit ou le quotient si nécessaire.", "Combine les limites puis conclus."],
    questions: [
      short("Calcule $\lim_{x\to0^+}(x+\ln x)$.", ["-∞", "-infini"], "$x\to0$ et $\ln x\to-\infty$.", "Exercice de fixation, question 1, page 3"),
      short("Calcule $\lim_{x\to+\infty}(x+\ln x)$.", ["+∞", "∞", "+infini", "infini"], "Les deux termes tendent vers $+\infty$.", "Exercice de fixation, question 2, page 3"),
      short("Calcule $\lim_{x\to0^+}x(1+\ln x)$.", ["0"], "$x+x\ln x\to0+0$.", "Exercice de fixation, question 4, page 3"),
    ],
    weight: 60,
  },
  {
    id: "log-derivative-variation",
    title: "Dérivée, variations et courbe de ln",
    summary: "Justifier que $\ln$ est strictement croissante et étudier une fonction contenant $\ln x$.",
    pages: "3-4",
    section: "II-2. Dérivée et sens de variation",
    body: String.raw`Pour $x>0$, $(\ln x)'=\frac1x>0$. La fonction $\ln$ est donc strictement croissante sur $]0;+\infty[$, de $-\infty$ vers $+\infty$.

Pour une fonction contenant $\ln x$, on commence toujours par imposer $x>0$, puis on calcule la dérivée sur ce domaine.`,
    keyPoint: "Sur ]0 ; +∞[, 1/x > 0 : ln est strictement croissante.",
    example: "$f(x)=2x+\ln x$ a pour dérivée $f'(x)=2+1/x>0$.",
    steps: ["Détermine le domaine avec $x>0$.", "Calcule la dérivée.", "Étudie son signe puis dresse les variations."],
    questions: [
      choice("Quel est le domaine de $f(x)=2x+\ln x$ ?", ["$\mathbb R$", "$]-\infty;0[$", "$]0;+\infty[$", "$[0;+\infty[$"], 2, "La présence de $\ln x$ impose $x>0$.", "Exercice de fixation, question 1, page 4"),
      choice("Quelle est la dérivée de $f(x)=2x+\ln x$ ?", ["$2+\ln x$", "$2+1/x$", "$2x+1/x$", "$1/x$"], 1, "On dérive séparément les deux termes.", "Exercice de fixation, question 2, page 4"),
      choice("Quel est le sens de variation de $f$ sur son domaine ?", ["Décroissante", "Constante", "Strictement croissante", "Non monotone"], 2, "$2+1/x>0$ pour $x>0$.", "Exercice de fixation, question 3, page 4"),
    ],
    weight: 65,
  },
  {
    id: "log-equations-inequalities",
    title: "Équations comportant ln",
    summary: "Résoudre une équation logarithmique après avoir déterminé son ensemble de validité.",
    pages: "4-5",
    section: "III-1 et III-2. Propriété et équations",
    body: String.raw`Pour $a>0$ et $b>0$, $\ln a=\ln b\iff a=b$. De plus, $\ln x=0\iff x=1$ et $\ln x=1\iff x=e$.

Toute résolution commence par les contraintes de positivité. Pour une équation polynomiale en $\ln x$, on pose $X=\ln x$, on résout en $X$, puis on revient à $x$.`,
    keyPoint: "Domaine d’abord, équation ensuite, vérification des solutions à la fin.",
    example: "$\ln(2x-1)=\ln(x+5)$ donne $x=6$, après vérification de $x>1/2$.",
    steps: ["Écris l’ensemble de validité.", "Utilise l’injectivité de $\ln$ ou pose $X=\ln x$.", "Résous puis conserve seulement les solutions valides."],
    questions: [
      short("Résous $\ln(2x-1)=\ln(x+5)$.", ["6", "{6}"], "Sur $x>1/2$, l’égalité équivaut à $2x-1=x+5$.", "Exemple officiel 1, pages 4-5"),
      choice("Résous $\ln(x-2)=1$.", ["$x=e-2$", "$x=e+2$", "$x=3$", "$x=2e$"], 1, "$\ln(x-2)=\ln e$ donne $x-2=e$.", "Exemple officiel 2, pages 4-5"),
      choice("Résous $(\ln x)^2+\ln x-6=0$.", ["$\{e^{-3},e^2\}$", "$\{-3,2\}$", "$\{e^{-2},e^3\}$", "$\{3,-2\}$"], 0, "Avec $X=\ln x$, les racines sont $-3$ et $2$.", "Exemple officiel 3, pages 4-5", 2),
    ],
    weight: 75,
  },
  {
    id: "log-inequalities",
    title: "Inéquations comportant ln",
    summary: "Exploiter la stricte croissance de $\ln$ et résoudre des inéquations en $\ln x$.",
    pages: "5",
    section: "III-3. Inéquations",
    body: String.raw`Pour $a>0$ et $b>0$, $\ln a<\ln b\iff a<b$ car $\ln$ est strictement croissante.

On a aussi $\ln x<0\iff0<x<1$ et $\ln x>0\iff x>1$. Pour une expression du second degré en $\ln x$, on pose $X=\ln x$, on étudie le signe en $X$, puis on revient à $x$ avec l’exponentielle.`,
    keyPoint: "Le sens de l’inégalité est conservé par ln sur les réels strictement positifs.",
    example: "$\ln(2x-3)<1$ donne $3/2<x<(3+e)/2$.",
    steps: ["Détermine l’ensemble de validité.", "Compare les arguments ou pose $X=\ln x$.", "Intersecte le résultat avec le domaine."],
    questions: [
      choice("Résous $\ln x-3\ge0$.", ["$x\ge3$", "$x\ge e^3$", "$0<x\le e^3$", "$x\le3$"], 1, "$\ln x\ge3$ équivaut à $x\ge e^3$.", "Exercice de maison a, page 5"),
      choice("La solution de $\ln(2x-3)<1$ est :", ["$]3/2;(3+e)/2[$", "$]-\infty;(3+e)/2[$", "$]0;e[$", "$[(3+e)/2;+\infty[$"], 0, "Il faut conserver la contrainte $2x-3>0$.", "Exemple officiel 1, page 5", 2),
    ],
    weight: 75,
  },
  {
    id: "log-composite-derivatives",
    title: "Dérivée d’un logarithme composé",
    summary: "Dériver $\ln(u)$ sur un intervalle où $u$ est strictement positive.",
    pages: "5-6",
    section: "IV-1. Dérivée",
    body: String.raw`Si $u$ est dérivable et strictement positive sur un intervalle $K$, alors $\ln(u)$ est dérivable sur $K$ et

$(\ln u)'=\dfrac{u'}u$.

La condition $u>0$ n’est pas facultative : elle définit l’intervalle sur lequel la formule a un sens.`,
    keyPoint: "(ln u)' = u'/u, sur un intervalle où u > 0.",
    example: "Si $f(x)=\ln(5x+2)$, alors $f'(x)=5/(5x+2)$.",
    steps: ["Identifie $u(x)$ et vérifie $u(x)>0$ sur l’intervalle.", "Calcule $u'(x)$.", "Écris $u'(x)/u(x)$ et simplifie."],
    questions: [
      choice("Dérive $f(x)=\ln(5x+2)$.", ["$1/(5x+2)$", "$5/(5x+2)$", "$5\ln(5x+2)$", "$5x+2$"], 1, "$u'=5$, donc $(\ln u)'=u'/u$.", "Exercice de fixation 1, page 5"),
      choice("Dérive $f(x)=\ln(2x^2-x-1)$.", ["$1/(2x^2-x-1)$", "$(4x-1)/(2x^2-x-1)$", "$(2x-1)/(2x^2-x-1)$", "$4x-1$"], 1, "La dérivée de $2x^2-x-1$ est $4x-1$.", "Exercice de fixation 2, page 6"),
    ],
    weight: 70,
  },
  {
    id: "log-primitives",
    title: "Primitives de la forme u′/u",
    summary: "Reconnaître une dérivée logarithmique et déterminer toutes ses primitives.",
    pages: "6",
    section: "IV-2. Primitives",
    body: String.raw`Si $u$ est dérivable et strictement positive sur un intervalle $K$, alors les primitives de $u'/u$ sont

$x\mapsto\ln(u(x))+\alpha$, avec $\alpha\in\mathbb R$.

Un coefficient multiplicatif devant $u'/u$ se conserve devant le logarithme.`,
    keyPoint: "∫ u'/u = ln(u) + constante, lorsque u > 0.",
    example: "Une primitive de $(2x+1)/(x^2+x+3)$ est $\ln(x^2+x+3)$.",
    steps: ["Repère le dénominateur $u$.", "Vérifie que le numérateur est $u'$ ou un multiple de $u'$.", "Écris le logarithme avec le coefficient et la constante."],
    questions: [
      choice("Les primitives de $1/x$ sur $]0;+\infty[$ sont :", ["$x^2/2+c$", "$\ln x+c$", "$1/x+c$", "$e^x+c$"], 1, "La dérivée de $\ln x$ vaut $1/x$.", "Exercice de fixation a, page 6"),
      choice("Une primitive de $(2x+1)/(x^2+x+3)$ est :", ["$\ln(x^2+x+3)$", "$1/(x^2+x+3)$", "$(2x+1)\ln x$", "$e^{x^2+x+3}$"], 0, "Le numérateur est la dérivée du dénominateur.", "Exercice de fixation c, page 6"),
    ],
    weight: 75,
  },
];

const exponentialDocument = "TA Maths leçon 04 Fonction exponnentielle.pdf";

const exponentialLevels: FaithfulLevelSeed[] = [
  {
    id: "exp-definition-properties",
    title: "Définition et notation de la fonction exponentielle",
    summary: "Relier exponentielle et logarithme, puis utiliser leurs identités réciproques.",
    pages: "1-2",
    section: "I-1. Définition et notation",
    body: String.raw`La fonction exponentielle népérienne, notée $\exp$, est la fonction réciproque du logarithme népérien. On écrit $\exp(x)=e^x$.

Elle est définie sur $\mathbb R$ et reste strictement positive. On a $e^0=1$, $e^1=e$, $\ln(e^a)=a$ pour tout réel $a$, et $e^{\ln a}=a$ pour $a>0$.

Ainsi, pour $a>0$, $\ln a=b\iff a=e^b$.`,
    keyPoint: "Pour tout réel x, e^x > 0 ; ln(e^x)=x et e^(ln a)=a pour a>0.",
    example: "$\ln(e^8)=8$, $e^{\ln3}=3$ et $e^{-\ln2}=1/2$.",
    steps: ["Repère une composition $\ln(e^x)$ ou $e^{\ln a}$.", "Vérifie $a>0$ lorsque nécessaire.", "Applique directement l’identité réciproque."],
    questions: [
      choice("L’ensemble de définition de $x\mapsto e^x$ est $\mathbb R$.", ["Vrai", "Faux"], 0, "L’exponentielle est définie pour tout réel.", "Exercice de fixation 1, page 2"),
      choice("Le nombre $e^{-10}$ est négatif.", ["Vrai", "Faux"], 1, "$e^x$ est toujours strictement positif.", "Exercice de fixation 1, page 2"),
      short("Calcule $\ln(e^{-5})$.", ["-5"], "$\ln(e^a)=a$.", "Exercice de fixation 2-B, page 2"),
      short("Calcule $e^{-\ln2}$.", ["1/2", "0,5", "0.5"], "$e^{-\ln2}=e^{\ln(1/2)}=1/2$.", "Exercice de fixation 2-D, page 2"),
    ],
    weight: 50,
  },
  {
    id: "exp-algebraic-properties",
    title: "Propriétés algébriques de l’exponentielle",
    summary: "Transformer produits, quotients, puissances et inverses d’exponentielles.",
    pages: "2",
    section: "I-2. Propriétés algébriques",
    body: String.raw`Pour tous réels $a$ et $b$ et tout rationnel $r$ :

$e^ae^b=e^{a+b}$, $\dfrac{e^a}{e^b}=e^{a-b}$, $(e^a)^r=e^{ar}$ et $\dfrac1{e^a}=e^{-a}$.

On simplifie donc les exponentielles en travaillant d’abord sur leurs exposants.`,
    keyPoint: "Produit → addition des exposants ; quotient → soustraction.",
    example: "$e^6e^{-4}=e^2$, $(e^{-2})^4=e^{-8}$ et $e^4/e^{-5}=e^9$.",
    steps: ["Identifie l’opération entre les exponentielles.", "Transforme les exposants.", "Réduis l’expression finale sous la forme $e^k$."],
    questions: [
      choice("Écris $e^6e^{-4}$ sous la forme $e^k$.", ["$e^{-24}$", "$e^{10}$", "$e^2$", "$e^{-2}$"], 2, "$6+(-4)=2$.", "Exercice de fixation E, page 2"),
      choice("Écris $(e^{-2})^4$ sous la forme $e^k$.", ["$e^{-8}$", "$e^8$", "$e^{-6}$", "$e^2$"], 0, "$-2\times4=-8$.", "Exercice de fixation F, page 2"),
      choice("Écris $e^4/e^{-5}$ sous la forme $e^k$.", ["$e^{-1}$", "$e^9$", "$e^{-9}$", "$e^{20}$"], 1, "$4-(-5)=9$.", "Exercice de fixation G, page 2"),
    ],
    weight: 55,
  },
  {
    id: "exp-limits-variations",
    title: "Limites de référence de l’exponentielle",
    summary: "Utiliser les limites de $e^x$, $e^x/x$ et $xe^x$ aux infinis.",
    pages: "2-3",
    section: "II-1. Limites de référence",
    body: String.raw`Les limites fondamentales sont :

$\lim_{x\to+\infty}e^x=+\infty$, $\lim_{x\to-\infty}e^x=0$,

$\lim_{x\to+\infty}\dfrac{e^x}{x}=+\infty$ et $\lim_{x\to-\infty}xe^x=0$.

L’exponentielle domine toute expression affine lorsque $x\to+\infty$.`,
    keyPoint: "À −∞, e^x → 0 ; à +∞, e^x domine x.",
    example: "$\lim_{x\to-\infty}(e^x+3)=3$ et $\lim_{x\to-\infty}2xe^x=0$.",
    steps: ["Repère la limite de référence.", "Factorise par $x$ ou $e^x$ si nécessaire.", "Combine les facteurs et conclus."],
    questions: [
      short("Calcule $\lim_{x\to-\infty}(e^x+3)$.", ["3"], "$e^x\to0$, donc la somme tend vers 3.", "Exercice de fixation a, page 3"),
      short("Calcule $\lim_{x\to-\infty}2xe^x$.", ["0"], "$xe^x\to0$ à $-\infty$.", "Exercice de fixation b, page 3"),
      short("Calcule $\lim_{x\to+\infty}(2x-1-e^x)$.", ["-∞", "-infini"], "$e^x$ domine le terme affine et porte un signe négatif.", "Exercice de fixation c, page 3", 2),
    ],
    weight: 65,
  },
  {
    id: "exp-derivative-variation",
    title: "Dérivée, variations et courbe de l’exponentielle",
    summary: "Montrer que l’exponentielle est strictement croissante et reconnaître son asymptote.",
    pages: "3-4",
    section: "II-2 et II-3. Dérivée, variations, représentation",
    body: String.raw`La fonction exponentielle est dérivable sur $\mathbb R$ et $(e^x)'=e^x$. Comme $e^x>0$, elle est strictement croissante sur $\mathbb R$, de $0$ vers $+\infty$.

Lorsque $x\to-\infty$, $e^x\to0$ : l’axe des abscisses, d’équation $y=0$, est une asymptote horizontale à sa courbe.`,
    keyPoint: "(e^x)' = e^x > 0 : exp est strictement croissante sur ℝ.",
    example: "$f(x)=2x+e^x$ vérifie $f'(x)=2+e^x>0$.",
    steps: ["Dérive chaque terme.", "Utilise la positivité de $e^x$.", "Conclue sur les variations et l’asymptote si demandée."],
    questions: [
      choice("Quelle est la dérivée de $f(x)=2x+e^x$ ?", ["$2+e^x$", "$2x+e^x$", "$2+xe^{x-1}$", "$e^x$"], 0, "La dérivée de $2x$ est 2 et celle de $e^x$ est $e^x$.", "Exercice de fixation, question 1, page 3"),
      choice("Quel est le sens de variation de cette fonction ?", ["Strictement décroissante", "Strictement croissante", "Constante", "Variable selon x"], 1, "$2+e^x>0$ sur $\mathbb R$.", "Exercice de fixation, question 2, page 3"),
      choice("Quelle droite est asymptote à $y=e^x$ en $-\infty$ ?", ["$x=0$", "$y=1$", "$y=0$", "$y=x$"], 2, "$e^x\to0$ lorsque $x\to-\infty$.", "Représentation graphique, page 4"),
    ],
    weight: 65,
  },
  {
    id: "exp-equations-inequalities",
    title: "Équations exponentielles",
    summary: "Résoudre une égalité d’exponentielles ou une équation polynomiale en $e^x$.",
    pages: "4-5",
    section: "III-1 et III-2. Propriété et équations",
    body: String.raw`Pour tous réels $a$ et $b$, $e^a=e^b\iff a=b$. Pour une équation contenant $e^{2x}$ et $e^x$, on pose $X=e^x$ en gardant la contrainte $X>0$.

Si $e^u=k$ avec $k>0$, alors $u=\ln k$.`,
    keyPoint: "Poser X=e^x impose toujours X>0.",
    example: "$e^{2x-1}=e^{x+5}$ donne $x=6$.",
    steps: ["Mets les deux membres sous forme exponentielle ou pose $X=e^x$.", "Résous l’équation obtenue.", "Élimine toute valeur $X\le0$ puis reviens à $x$."],
    questions: [
      short("Résous $e^{2x-1}=e^{x+5}$.", ["6", "{6}"], "L’injectivité donne $2x-1=x+5$.", "Exemple officiel 1, pages 4-5"),
      choice("Résous $e^{x-2}=5$.", ["$x=\ln5-2$", "$x=2+\ln5$", "$x=5e^2$", "$x=7$"], 1, "$x-2=\ln5$.", "Exemple officiel 2, pages 4-5"),
      choice("Résous $e^{2x}+e^x-6=0$.", ["$x=\ln2$", "$x=\ln3$", "$x=2$", "$x=-3$"], 0, "Avec $X=e^x>0$, $X^2+X-6=0$ ne conserve que $X=2$.", "Exemple officiel 3, page 5", 2),
    ],
    weight: 75,
  },
  {
    id: "exp-inequalities",
    title: "Inéquations exponentielles",
    summary: "Comparer des exponentielles et résoudre une inéquation polynomiale en $e^x$.",
    pages: "5",
    section: "III-3. Inéquations",
    body: String.raw`La fonction exponentielle étant strictement croissante, $e^a<e^b\iff a<b$ ; les relations $\le$, $>$ et $\ge$ sont également conservées.

Pour un trinôme en $e^x$, on pose $X=e^x>0$, on étudie son signe, puis on revient à $x$ avec le logarithme.`,
    keyPoint: "L’exponentielle conserve l’ordre et reste strictement positive.",
    example: "$e^{2x}-5e^x+6\ge0$ donne $x\le\ln2$ ou $x\ge\ln3$.",
    steps: ["Pose $X=e^x>0$ si l’expression est quadratique.", "Résous l’inéquation en $X$.", "Traduis les intervalles retenus en intervalles de $x$."],
    questions: [
      choice("Résous $e^{2x-1}<8$.", ["$x<(1+\ln8)/2$", "$x>\ln8$", "$x<8$", "$x>(1+\ln8)/2$"], 0, "On prend le logarithme puis on isole $x$.", "Exemple officiel 1, page 5"),
      choice("Résous $e^{2x}-5e^x+6\ge0$.", ["$[\ln2;\ln3]$", "$]-\infty;\ln2]\cup[\ln3;+\infty[$", "$]0;2]\cup[3;+\infty[$", "$]2;3[$"], 1, "Le trinôme $(X-2)(X-3)$ est positif à l’extérieur des racines.", "Exemple officiel 2, page 5", 2),
    ],
    weight: 75,
  },
  {
    id: "exp-composite-derivatives",
    title: "Dérivée d’une exponentielle composée",
    summary: "Dériver $e^{u(x)}$ puis combiner avec les règles de somme et de produit.",
    pages: "5-6",
    section: "IV-1. Dérivée",
    body: String.raw`Si $u$ est dérivable sur un intervalle $K$, alors $e^u$ est dérivable et

$(e^u)'=u'e^u$.

Pour une expression comme $(2x+1)e^x$, on applique aussi la règle de dérivation d’un produit.`,
    keyPoint: "(e^u)' = u'e^u.",
    example: "Si $f(x)=e^{-4x+3}$, alors $f'(x)=-4e^{-4x+3}$.",
    steps: ["Identifie l’exposant $u(x)$.", "Calcule $u'(x)$.", "Multiplie par $e^{u(x)}$ et applique les autres règles éventuelles."],
    questions: [
      choice("Dérive $e^{-4x+3}$.", ["$e^{-4x+3}$", "$-4e^{-4x+3}$", "$(-4x+3)e^{-4x+3}$", "$4e^{-4x+3}$"], 1, "La dérivée de l’exposant est $-4$.", "Exercice de fixation 1, page 6"),
      choice("Dérive $(2x+1)e^x$.", ["$(2x+1)e^x$", "$(2x+2)e^x$", "$(2x+3)e^x$", "$2e^x$"], 2, "$2e^x+(2x+1)e^x=(2x+3)e^x$.", "Exercice de fixation 3, page 6", 2),
    ],
    weight: 75,
  },
  {
    id: "exp-primitives-a1",
    title: "Primitives exponentielles - extension A1",
    summary: "Déterminer les primitives de $u'e^u$ ; cette partie du document est réservée à la Terminale A1.",
    pages: "6",
    section: "IV-2. Primitives - Terminale A1 uniquement",
    body: String.raw`Si $u$ est dérivable sur $K$, la fonction $e^u$ est une primitive de $u'e^u$. Ainsi,

$\int u'(x)e^{u(x)}\,dx=e^{u(x)}+\alpha$.

En particulier, une primitive de $e^{ax+b}$, avec $a\ne0$, est $\frac1a e^{ax+b}$.`,
    keyPoint: "∫u'e^u = e^u + constante.",
    example: "Les primitives de $e^{-3x+7}$ sont $-\frac13e^{-3x+7}+\alpha$.",
    steps: ["Identifie $u$ et $u'$.", "Ajuste le coefficient pour obtenir exactement $u'e^u$.", "Écris $e^u$ avec la constante d’intégration."],
    questions: [
      choice("Une primitive de $e^x$ est :", ["$xe^x$", "$e^x$", "$\ln x$", "$e^{x+1}$ uniquement"], 1, "La dérivée de $e^x$ est elle-même.", "Exercice de fixation a, page 6"),
      choice("Une primitive de $e^{-3x+7}$ est :", ["$-3e^{-3x+7}$", "$-\frac13e^{-3x+7}$", "$\frac13e^{-3x+7}$", "$e^{-3x+7}$"], 1, "Le facteur $1/(-3)$ compense la dérivée de l’exposant.", "Exercice de fixation b, page 6"),
      choice("Une primitive de $xe^{x^2}$ est :", ["$e^{x^2}$", "$\frac12e^{x^2}$", "$x^2e^{x^2}$", "$2e^{x^2}$"], 1, "$u=x^2$ et $u'=2x$, donc $xe^{x^2}=\frac12u'e^u$.", "Exercice de fixation c, page 6", 2),
    ],
    weight: 80,
    kind: "challenge",
  },
];

const sequencesDocument = "TA Maths leçon 05 Suites numériques.pdf";

const sequenceLevels: FaithfulLevelSeed[] = [
  {
    id: "arithmetic-sequences",
    title: "Définition d’une suite arithmétique",
    summary: "Reconnaître une relation de récurrence à différence constante.",
    pages: "1-2",
    section: "I-1. Définition",
    body: String.raw`Une suite $(u_n)$ est arithmétique lorsqu’il existe un réel $r$ tel que $u_{n+1}=u_n+r$. Le nombre $r$ est la **raison**.

On peut aussi vérifier que $u_{n+1}-u_n=r$ pour tout rang considéré. La suite peut commencer à un rang $n_0>0$.`,
    keyPoint: "Suite arithmétique : u_(n+1) = u_n + r.",
    example: "$u_3=2$ et $u_{n+1}=u_n+7$ donnent $u_4=9$ et $u_5=16$.",
    steps: ["Repère le premier terme donné.", "Calcule les termes suivants avec la récurrence.", "Identifie la raison constante."],
    questions: [
      short("Avec $u_3=2$ et $u_{n+1}=u_n+7$, calcule $u_4$.", ["9"], "$2+7=9$.", "Exercice de fixation, question 1, page 1"),
      short("Calcule $u_5$.", ["16"], "$u_5=u_4+7=16$.", "Exercice de fixation, question 1, pages 1-2"),
      short("Quelle est la raison de cette suite ?", ["7"], "Le nombre ajouté à chaque étape est 7.", "Exercice de fixation, question 2, page 2"),
    ],
    weight: 50,
  },
  {
    id: "arithmetic-general-term",
    title: "Terme général d’une suite arithmétique",
    summary: "Exprimer un terme en fonction du rang à partir d’un terme connu.",
    pages: "2",
    section: "I-2. Expression du terme général",
    body: String.raw`Si $(u_n)$ est arithmétique de premier terme $u_0$ et de raison $r$, alors $u_n=u_0+nr$.

Plus généralement, pour tous rangs $p\le n$ : $u_n=u_p+(n-p)r$.`,
    keyPoint: "u_n = u_p + (n-p)r.",
    example: "$v_1=1350$, $r=200$ : $v_n=1350+(n-1)200=1150+200n$.",
    steps: ["Choisis le terme connu $u_p$.", "Compte $n-p$ pas de raison.", "Applique $u_n=u_p+(n-p)r$."],
    questions: [
      choice("Pour $v_1=1350$ et $r=200$, quelle expression donne $v_n$ ?", ["$1350+200n$", "$1150+200n$", "$1550+200n$", "$1350n+200$"], 1, "$v_n=1350+(n-1)200$.", "Exercice de fixation, page 2"),
      short("Calcule $v_{21}$.", ["5350", "5 350"], "$1150+200\times21=5350$.", "Exercice de fixation, page 2"),
    ],
    weight: 55,
  },
  {
    id: "arithmetic-variation",
    title: "Sens de variation d’une suite arithmétique",
    summary: "Déduire les variations du signe de la raison.",
    pages: "2",
    section: "I-3. Sens de variation",
    body: String.raw`Une suite arithmétique est croissante si $r>0$, décroissante si $r<0$ et constante si $r=0$.

Cette conclusion vient de $u_{n+1}-u_n=r$.`,
    keyPoint: "Le signe de r détermine entièrement les variations.",
    example: "$r=-2$ : décroissante ; $r=0$ : constante ; $r=10$ : croissante.",
    steps: ["Identifie la raison.", "Compare-la à zéro.", "Annonce le sens de variation."],
    questions: [
      choice("Si $r=-2$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 1, "Une raison négative donne une suite décroissante.", "Exercice de fixation a, page 2"),
      choice("Si $r=0$, la suite est :", ["Croissante", "Décroissante", "Constante", "Non définie"], 2, "Tous les termes sont égaux.", "Exercice de fixation b, page 2"),
      choice("Si $r=10$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 0, "La raison est positive.", "Exercice de fixation c, page 2"),
    ],
    weight: 45,
  },
  {
    id: "arithmetic-sums",
    title: "Somme de termes arithmétiques consécutifs",
    summary: "Calculer une somme avec le nombre de termes et la moyenne du premier et du dernier.",
    pages: "2-3",
    section: "I-4. Somme de termes consécutifs",
    body: String.raw`Pour $n\ge p$ :

$u_p+u_{p+1}+\cdots+u_n=(n-p+1)\dfrac{u_p+u_n}{2}$.

Il faut donc déterminer le nombre de termes, le premier et le dernier.`,
    keyPoint: "Somme = nombre de termes × (premier + dernier)/2.",
    example: "$u_1=-1$, $r=3$ donnent $u_{26}=74$ et $u_1+\cdots+u_{26}=949$.",
    steps: ["Calcule le dernier terme.", "Compte les termes avec $n-p+1$.", "Multiplie par la demi-somme des extrêmes."],
    questions: [
      short("Avec $u_1=-1$ et $r=3$, calcule $u_{26}$.", ["74"], "$-1+25\times3=74$.", "Exercice de fixation, page 3"),
      short("Calcule $u_1+u_2+\cdots+u_{26}$.", ["949"], "$26\times(-1+74)/2=949$.", "Exercice de fixation, page 3", 2),
    ],
    weight: 65,
  },
  {
    id: "geometric-sequences",
    title: "Définition d’une suite géométrique",
    summary: "Reconnaître une relation de récurrence à quotient constant.",
    pages: "3",
    section: "II-1. Définition",
    body: String.raw`Une suite $(v_n)$ est géométrique lorsqu’il existe un réel $q$ tel que $v_{n+1}=qv_n$. Le nombre $q$ est la **raison**.

Lorsque les termes ne sont pas nuls, on peut vérifier $v_{n+1}/v_n=q$.`,
    keyPoint: "Suite géométrique : v_(n+1) = q v_n.",
    example: "$t_0=1\,000\,000$ et $t_{n+1}=0,9t_n$ donnent $t_1=900\,000$, $t_2=810\,000$.",
    steps: ["Repère le premier terme.", "Multiplie par $q$ pour avancer d’un rang.", "Identifie la raison constante."],
    questions: [
      short("Avec $t_0=1\,000\,000$ et $q=0,9$, calcule $t_1$.", ["900000", "900 000"], "$0,9\times1\,000\,000=900\,000$.", "Exercice de fixation, question 1, page 3"),
      short("Calcule $t_2$.", ["810000", "810 000"], "$0,9\times900\,000=810\,000$.", "Exercice de fixation, question 1, page 3"),
      short("Quelle est la raison de cette suite ?", ["0,9", "0.9"], "Chaque terme est multiplié par 0,9.", "Exercice de fixation, question 2, page 3"),
    ],
    weight: 50,
  },
  {
    id: "geometric-general-term",
    title: "Terme général d’une suite géométrique",
    summary: "Exprimer un terme à partir d’un terme connu et de la raison.",
    pages: "3-4",
    section: "II-2. Expression du terme général",
    body: String.raw`Si $(v_n)$ est géométrique de premier terme $v_0$ et de raison $q$, alors $v_n=v_0q^n$.

Plus généralement, $v_n=v_pq^{n-p}$.`,
    keyPoint: "v_n = v_p q^(n-p).",
    example: "Si $q=1/2$ et $v_3=12$, alors $v_7=12(1/2)^4=3/4$.",
    steps: ["Repère $v_p$, $q$, $p$ et $n$.", "Calcule l’exposant $n-p$.", "Applique puis simplifie."],
    questions: [
      short("Si $q=1/2$ et $v_3=12$, calcule $v_7$.", ["3/4", "0,75", "0.75"], "$12(1/2)^{7-3}=12/16=3/4$.", "Exercice de fixation, pages 3-4", 2),
      choice("Quelle formule générale est correcte ?", ["$v_n=v_p+q^{n-p}$", "$v_n=v_pq^{n-p}$", "$v_n=qv_p+n-p$", "$v_n=v_p(n-p)q$"], 1, "Chaque pas multiplie par $q$.", "Propriété, page 3"),
    ],
    weight: 55,
  },
  {
    id: "geometric-variation",
    title: "Sens de variation d’une suite géométrique positive",
    summary: "Étudier les variations selon la position de la raison positive par rapport à 1.",
    pages: "4",
    section: "II-3. Sens de variation",
    body: String.raw`Pour une suite géométrique à termes positifs :

- si $0<q<1$, elle est décroissante ;
- si $q>1$, elle est croissante ;
- si $q=1$, elle est constante.

Si $q<0$, elle n’est en général ni croissante, ni décroissante, ni constante.`,
    keyPoint: "Pour des termes positifs, comparer q à 1.",
    example: "$q=7$ : croissante ; $q=0,6$ : décroissante ; $q=1$ : constante.",
    steps: ["Vérifie que les termes sont positifs.", "Compare $q$ à 0 et à 1.", "Conclue sans oublier le cas $q<0$."],
    questions: [
      choice("Avec $v_0=0,5$ et $q=7$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 0, "$q>1$ et les termes sont positifs.", "Exercice de fixation a, page 4"),
      choice("Avec $v_0=21$ et $q=0,6$, la suite est :", ["Croissante", "Décroissante", "Constante", "Alternée"], 1, "$0<q<1$.", "Exercice de fixation b, page 4"),
      choice("Avec $q=1$, la suite est :", ["Croissante", "Décroissante", "Constante", "Impossible"], 2, "Multiplier par 1 ne change pas les termes.", "Exercice de fixation c, page 4"),
    ],
    weight: 45,
  },
  {
    id: "geometric-sums-modeling",
    title: "Somme de termes géométriques consécutifs",
    summary: "Calculer une somme géométrique finie et reconnaître le nombre de termes.",
    pages: "4-5",
    section: "II-4. Somme de termes consécutifs",
    body: String.raw`Pour $q\ne1$ :

$v_p+\cdots+v_n=v_p\dfrac{1-q^{n-p+1}}{1-q}$.

Le nombre de termes est $n-p+1$. Si la somme commence à $v_0$, on obtient $v_0(1-q^{n+1})/(1-q)$.`,
    keyPoint: "Somme géométrique = premier terme × (1-q^nombre de termes)/(1-q).",
    example: "Avec $q=1/2$ et $v_3=12$, on obtient $v_1=48$ puis $S_n=96(1-(1/2)^n)$.",
    steps: ["Détermine le premier terme de la somme.", "Compte les termes.", "Applique la formule et simplifie."],
    questions: [
      short("Avec $q=1/2$ et $v_3=12$, calcule $v_1$.", ["48"], "$v_3=v_1(1/2)^2$, donc $v_1=48$.", "Exercice de fixation, question 1, page 5"),
      choice("Quelle expression donne $S_n=v_1+\cdots+v_n$ ?", ["$48(1-(1/2)^n)$", "$96(1-(1/2)^n)$", "$96(1+(1/2)^n)$", "$48/(1-(1/2)^n)$"], 1, "$48\,(1-(1/2)^n)/(1-1/2)=96(1-(1/2)^n)$.", "Exercice de fixation, question 2, page 5", 2),
    ],
    weight: 70,
    kind: "challenge",
  },
];

const statisticsDocument = "TA Maths leçon 06 Statistiques.pdf";

const statisticsLevels: FaithfulLevelSeed[] = [
  {
    id: "statistical-series-scatterplot",
    title: "Série statistique double et tableau de contingence",
    summary: "Lire les couples de modalités et leurs effectifs dans un tableau à double entrée.",
    pages: "1-2",
    section: "I-1. Définition",
    body: String.raw`On étudie deux caractères quantitatifs $X$ et $Y$ sur une même population. Une série statistique double est l’ensemble des triplets $(x_i,y_j,n_{ij})$, où $n_{ij}$ est l’effectif du couple $(x_i,y_j)$.

Le tableau qui place les valeurs de $X$ en lignes, celles de $Y$ en colonnes et les effectifs aux intersections est un **tableau de contingence**.`,
    keyPoint: "n_ij est l’effectif du couple (x_i ; y_j).",
    example: "Dans le tableau du cours, l’intersection de $X=2$ enfants et $Y=3$ pièces contient 16 ménages.",
    steps: ["Repère la ligne de la modalité de $X$.", "Repère la colonne de la modalité de $Y$.", "Lis l’effectif à leur intersection."],
    questions: [
      short("Combien de ménages ont 2 enfants et occupent 3 pièces dans le tableau officiel ?", ["16", "seize"], "La case à l’intersection de la ligne 2 et de la colonne 3 contient 16.", "Exemple du tableau de contingence, page 2"),
      choice("Comment appelle-t-on ce tableau à double entrée ?", ["Tableau de variations", "Tableau de contingence", "Tableau de signes", "Matrice identité"], 1, "C’est le nom donné dans le cours.", "Définition, page 2"),
    ],
    weight: 45,
  },
  {
    id: "mean-point-marginals",
    title: "Séries et fréquences marginales - extension A1",
    summary: "Additionner lignes et colonnes pour obtenir les distributions marginales.",
    pages: "2-3",
    section: "I-2. Tableaux de séries marginales - A1 seulement",
    body: String.raw`La série marginale de $X$ s’obtient en additionnant les effectifs de chaque ligne ; celle de $Y$ en additionnant les effectifs de chaque colonne.

Une fréquence marginale est le quotient de l’effectif marginal par l’effectif total. Dans l’exemple, les effectifs marginaux de $X$ sont $10,19,30,23,13,5$ et ceux de $Y$ sont $11,30,38,21$.`,
    keyPoint: "Ligne → marginale de X ; colonne → marginale de Y ; fréquence = effectif / total.",
    example: "Pour $X=3$, $0+5+13+5=23$ ménages.",
    steps: ["Additionne chaque ligne pour $X$.", "Additionne chaque colonne pour $Y$.", "Divise par l’effectif total pour les fréquences."],
    questions: [
      short("Quel est l’effectif marginal de $X=3$ dans le tableau officiel ?", ["23"], "$0+5+13+5=23$.", "Calcul guidé, page 3"),
      short("Quel est l’effectif marginal de $Y=1$ ?", ["11"], "$6+4+1+0+0+0=11$.", "Calcul guidé, page 3"),
    ],
    weight: 50,
  },
  {
    id: "statistical-scatterplot",
    title: "Nuage de points",
    summary: "Représenter les couples observés dans un repère orthogonal.",
    pages: "3-4",
    section: "I-3. Nuage de points",
    body: String.raw`Le nuage associé à une série double est la représentation, dans un repère orthogonal, des points de coordonnées $(x_i,y_i)$ dont les effectifs sont non nuls.

Dans la suite du document, chaque couple considéré a un effectif égal à 1.`,
    keyPoint: "À chaque couple (x_i ; y_i) correspond un point du nuage.",
    example: "La série des superficies commence par les points $(2,14)$, $(2,26)$, $(3,31)$ et $(4,29)$.",
    steps: ["Choisis des échelles adaptées.", "Place chaque abscisse $x_i$.", "Monte jusqu’à l’ordonnée $y_i$ et marque le point."],
    questions: [
      choice("Quel point appartient au nuage de la série officielle ?", ["$(14,2)$ uniquement", "$(2,14)$", "$(3,14)$", "$(7,31)$"], 1, "La première observation est $X=2$, $Y=14$.", "Exercice de fixation, page 3"),
      short("Combien de points contient le nuage de la série officielle ?", ["8", "huit"], "Le tableau présente huit couples $(x_i,y_i)$.", "Exercice de fixation, pages 3-4"),
    ],
    weight: 50,
  },
  {
    id: "statistical-mean-point",
    title: "Point moyen d’un nuage",
    summary: "Calculer les moyennes des abscisses et des ordonnées.",
    pages: "4-5",
    section: "I-4. Point moyen",
    body: String.raw`Le point moyen $G$ d’un nuage de $n$ points $M_i(x_i,y_i)$ a pour coordonnées

$G(\overline X,\overline Y)$ avec $\overline X=\frac{x_1+\cdots+x_n}{n}$ et $\overline Y=\frac{y_1+\cdots+y_n}{n}$.`,
    keyPoint: "G a pour coordonnées les deux moyennes : (X̄ ; Ȳ).",
    example: "Pour la série des superficies, $G(4,575;36)$.",
    steps: ["Calcule la moyenne des $x_i$.", "Calcule la moyenne des $y_i$.", "Écris les coordonnées de $G$."],
    questions: [
      short("Calcule $\overline X$ pour la série officielle.", ["4,575", "4.575"], "$36,6/8=4,575$.", "Exercice de fixation, page 4"),
      short("Calcule $\overline Y$.", ["36"], "$288/8=36$.", "Exercice de fixation, page 4"),
      choice("Quelles sont les coordonnées du point moyen ?", ["$(36;4,575)$", "$(4,575;36)$", "$(8;288)$", "$(2;14)$"], 1, "On place la moyenne de X en abscisse et celle de Y en ordonnée.", "Exercice de fixation, pages 4-5"),
    ],
    weight: 55,
  },
  {
    id: "mayer-adjustment",
    title: "Méthode de Mayer : partage et points moyens",
    summary: "Partager le nuage en deux sous-nuages et déterminer la droite passant par leurs points moyens.",
    pages: "5-6",
    section: "II-2-a. Droite d’ajustement de Mayer",
    body: String.raw`On range les couples selon les $x_i$ croissants puis on partage la série en deux groupes d’effectifs aussi proches que possible. On calcule les points moyens $G_1$ et $G_2$ de ces groupes.

La droite $(G_1G_2)$ est la droite d’ajustement linéaire par la méthode de Mayer. Elle passe aussi par le point moyen global $G$.`,
    keyPoint: "Mayer : ordonner, partager, calculer G1 et G2, tracer (G1G2).",
    example: "Le cours obtient $G_1(2,75;25)$ et $G_2(6,4;47)$.",
    steps: ["Range les observations selon $X$.", "Partage-les en deux groupes.", "Calcule les deux points moyens."],
    questions: [
      choice("Quels sont les points moyens obtenus dans l’exercice officiel ?", ["$G_1(2,75;25)$ et $G_2(6,4;47)$", "$G_1(25;2,75)$ et $G_2(47;6,4)$", "$G_1(4,575;36)$ et $G_2(8;100)$", "$G_1(2;14)$ et $G_2(7,6;50)$"], 0, "Ce sont les moyennes des deux sous-séries de quatre couples.", "Exercice de fixation, pages 5-6", 2),
      short("Quel est l’effectif de chacun des deux groupes ?", ["4", "quatre"], "La série de huit couples est partagée en deux séries de quatre.", "Exercice de fixation, page 6"),
    ],
    weight: 60,
  },
  {
    id: "mayer-equation",
    title: "Équation de la droite de Mayer",
    summary: "Calculer le coefficient directeur et l’ordonnée à l’origine de $(G_1G_2)$.",
    pages: "6",
    section: "II-2-b. Équation",
    body: String.raw`Pour $G_1(X_1,Y_1)$ et $G_2(X_2,Y_2)$, la droite de Mayer a une équation $y=ax+b$ avec

$a=\frac{Y_2-Y_1}{X_2-X_1}$ et $b=Y_1-aX_1$.

On peut ensuite la tracer en utilisant $G_1$ et $G_2$.`,
    keyPoint: "a = (Y2-Y1)/(X2-X1), puis b = Y1-aX1.",
    example: "Le document obtient $y=\frac{440}{73}x+\frac{615}{73}$, soit environ $y=6x+8,4$.",
    steps: ["Calcule le coefficient directeur avec les deux points.", "Calcule $b$ avec l’un des points.", "Écris l’équation puis vérifie les deux points."],
    questions: [
      choice("Quel est le coefficient directeur exact de la droite officielle ?", ["$73/440$", "$440/73$", "$615/73$", "$47/25$"], 1, "$(47-25)/(6,4-2,75)=440/73$.", "Exercice de fixation, page 6"),
      choice("Quelle est l’équation obtenue ?", ["$y=440x+615$", "$y=\frac{440}{73}x+\frac{615}{73}$", "$x=6y+8,4$", "$y=4,575x+36$"], 1, "C’est l’équation calculée dans la solution officielle.", "Exercice de fixation, page 6", 2),
    ],
    weight: 65,
  },
  {
    id: "covariance-correlation-regression",
    title: "Covariance - extension A1",
    summary: "Mesurer le sens de la liaison entre deux caractères.",
    pages: "7",
    section: "II-3-a. Covariance - A1 seulement",
    body: String.raw`La covariance d’une série double est

$\operatorname{Cov}(X,Y)=\frac1n\sum(x_i-\overline X)(y_i-\overline Y)=\frac{\sum x_iy_i}{n}-\overline X\,\overline Y$.

Son signe indique le sens global de la liaison linéaire.`,
    keyPoint: "Cov(X,Y) = moyenne des produits - produit des moyennes.",
    example: "Pour la série officielle, $\operatorname{Cov}(X,Y)=23,675$.",
    steps: ["Calcule $\sum x_iy_i$.", "Divise par $n$.", "Soustrais $\overline X\,\overline Y$."],
    questions: [
      short("Calcule la covariance de la série officielle.", ["23,675", "23.675"], "$1503/8-4,575\times36=23,675$.", "Exercice de fixation, page 7", 2),
      choice("Quelle formule est correcte ?", ["$Cov=\sum x_i+\sum y_i$", "$Cov=\frac{\sum x_iy_i}{n}-\overline X\overline Y$", "$Cov=V(X)+V(Y)$", "$Cov=\sqrt{V(X)V(Y)}$"], 1, "C’est la seconde forme de la définition officielle.", "Définition, page 7"),
    ],
    weight: 65,
  },
  {
    id: "correlation-regression-a1",
    title: "Corrélation et droites de régression - extension A1",
    summary: "Calculer $r$, interpréter sa force et déterminer les deux droites de régression.",
    pages: "7-9",
    section: "II-3-b et II-3-c. Corrélation et régressions",
    body: String.raw`Le coefficient de corrélation est

$r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)V(Y)}}$, avec $-1\le r\le1$.

En pratique, $|r|\ge0,87$ indique une forte corrélation linéaire. La régression de $Y$ en $X$ a pour pente $a=Cov(X,Y)/V(X)$ ; celle de $X$ en $Y$ a pour pente $a'=Cov(X,Y)/V(Y)$. Les deux droites passent par $G$.`,
    keyPoint: "|r| proche de 1 signifie forte corrélation ; les régressions passent par G.",
    example: "Le cours obtient $r\approx0,92$, $y=5,69x+9,97$ et $x=0,15y-0,83$.",
    steps: ["Calcule les variances et $r$.", "Interprète $|r|$.", "Calcule les coefficients des droites puis leurs constantes."],
    questions: [
      short("Calcule le coefficient de corrélation de la série officielle.", ["0,92", "0.92"], "Avec $Cov=23,675$, $V(X)\approx4,16$ et $V(Y)=157,25$, on trouve 0,92.", "Exercice de fixation, page 8", 2),
      choice("Comment interpréter $r=0,92$ ?", ["Absence de liaison", "Forte corrélation linéaire positive", "Forte corrélation négative", "Valeur impossible"], 1, "$0,87\le r\le1$.", "Exercice de fixation, page 8"),
      choice("Quelle droite est la régression de $Y$ en $X$ ?", ["$y=5,69x+9,97$", "$x=5,69y+9,97$", "$y=0,15x-0,83$", "$y=6,4x+47$"], 0, "C’est l’équation obtenue dans la solution officielle.", "Exercice de fixation, page 9", 2),
    ],
    weight: 80,
  },
  {
    id: "statistical-estimation",
    title: "Estimation à partir d’une droite d’ajustement",
    summary: "Estimer une variable connaissant l’autre, graphiquement ou par l’équation.",
    pages: "9-10",
    section: "III. Estimation",
    body: String.raw`Une droite d’ajustement permet d’estimer $y$ connaissant $x$, ou inversement. Avec une équation $y=ax+b$, on remplace $x$ par la valeur donnée puis on arrondit selon le contexte.

Une estimation reste une prolongation de tendance : elle n’est pas une valeur certaine.`,
    keyPoint: "Remplacer la variable connue dans l’équation puis interpréter et arrondir.",
    example: "Pour $x=9$, Mayer donne $y=62,4$, soit environ 63 exploitations ; les moindres carrés donnent environ 62.",
    steps: ["Choisis la droite d’ajustement demandée.", "Remplace la variable connue.", "Calcule, arrondis et formule l’estimation."],
    questions: [
      short("Avec la droite de Mayer $y=6x+8,4$, estime $y$ pour $x=9$ avant arrondi.", ["62,4", "62.4"], "$6\times9+8,4=62,4$.", "Exercice de fixation, pages 9-10"),
      short("Quel nombre entier d’exploitations le cours retient-il avec Mayer ?", ["63"], "On arrondit 62,4 à 63 exploitations.", "Exercice de fixation, page 10"),
      short("Quel nombre entier obtient-on par les moindres carrés ?", ["62"], "$5,69\times9+9,97=61,18$ environ, arrondi dans le document à 62.", "Exercice de fixation - A1, page 10", 2),
    ],
    weight: 75,
    kind: "challenge",
    corrections: ["Le texte extrait indique 61,8 ; le calcul exact avec les coefficients affichés donne 61,18. L’arrondi final officiel 62 est conservé."],
  },
];

const systemsDocument = "TA Maths leçon 07 Systèmes linéaires.pdf";

const systemLevels: FaithfulLevelSeed[] = [
  {
    id: "substitution-elimination",
    title: "Systèmes linéaires : substitution et combinaison",
    summary: "Résoudre un système de deux équations à deux inconnues par deux méthodes classiques.",
    pages: "1",
    section: "B-1. Systèmes d’équations linéaires",
    body: String.raw`La **substitution** consiste à isoler une inconnue dans une équation puis à la remplacer dans l’autre. La **combinaison** consiste à multiplier éventuellement une équation puis à additionner membre à membre pour éliminer une inconnue.

Une solution est un couple $(x,y)$ qui vérifie simultanément les deux équations.`,
    keyPoint: "Éliminer une inconnue, calculer l’autre, puis remplacer et vérifier.",
    example: "$\{x-2y=3;\ x+y=-3\}$ a pour solution $(-1,-2)$.",
    steps: ["Choisis substitution ou combinaison.", "Détermine une première inconnue.", "Remplace pour trouver la seconde puis vérifie le couple."],
    questions: [
      short("Pour le système officiel, calcule $y$.", ["-2"], "La combinaison donne $3y=-6$.", "Exemple officiel, page 1"),
      short("Calcule $x$.", ["-1"], "Dans $x+y=-3$, remplacer $y$ par $-2$ donne $x=-1$.", "Exemple officiel, page 1"),
      choice("Quel est l’ensemble solution ?", ["$\{(-2,-1)\}$", "$\{(-1,-2)\}$", "$\{(1,2)\}$", "$\varnothing$"], 1, "Le couple est écrit dans l’ordre $(x,y)$.", "Exemple officiel, page 1"),
    ],
    weight: 60,
  },
  {
    id: "log-exp-systems",
    title: "Systèmes logarithmiques et exponentiels",
    summary: "Linéariser le système par un changement de variables, puis revenir aux inconnues initiales.",
    pages: "1-2",
    section: "B-2. Systèmes de type logarithmique ou exponentiel",
    body: String.raw`Pour un système en $\ln x$ et $\ln y$, on impose $x>0$, $y>0$, puis on pose $X=\ln x$, $Y=\ln y$.

Pour un système en $e^x$ et $e^y$, on pose $X=e^x>0$, $Y=e^y>0$. On résout le système linéaire obtenu avant de revenir avec $x=e^X$ ou $x=\ln X$ selon le cas.`,
    keyPoint: "Changer de variables, résoudre, vérifier la positivité, revenir à x et y.",
    example: "$2\ln x-\ln y=-2$, $4\ln x+\ln y=5$ donnent $(x,y)=(e^{1/2},e^3)$.",
    steps: ["Écris les contraintes.", "Pose les nouvelles variables et résous le système linéaire.", "Reviens aux inconnues et vérifie la positivité."],
    questions: [
      choice("Dans le premier système officiel, quelles nouvelles variables utilise-t-on ?", ["$X=x^2$, $Y=y^2$", "$X=\ln x$, $Y=\ln y$", "$X=e^x$, $Y=e^y$", "$X=x+y$, $Y=x-y$"], 1, "Le système est linéaire en $\ln x$ et $\ln y$.", "Exemple S1, page 2"),
      choice("Quelle solution obtient-on pour ce système ?", ["$(e^2,e^3)$", "$(e^{1/2},e^3)$", "$(1/2,3)$", "$(\ln2,0)$"], 1, "$X=1/2$ et $Y=3$.", "Exemple S1, page 2", 2),
      choice("Quelle est la solution du système exponentiel officiel ?", ["$(2,1)$", "$(\ln2,0)$", "$(e^2,e)$", "$(0,\ln2)$"], 1, "$e^x=2$ et $e^y=1$ donnent $x=\ln2$, $y=0$.", "Exemple S2, page 2", 2),
    ],
    weight: 70,
  },
  {
    id: "linear-inequalities-halfplanes",
    title: "Inéquation linéaire et demi-plan",
    summary: "Construire la frontière et sélectionner le demi-plan solution avec un point test.",
    pages: "3-4",
    section: "B-3-a. Inéquation dans R × R",
    body: String.raw`La droite $D:ax+by+c=0$ partage le plan en deux demi-plans. Pour $ax+by+c>0$, la frontière n’est pas incluse ; pour $ax+by+c\ge0$, elle l’est.

On choisit un point test qui n’appartient pas à $D$, souvent $O(0,0)$, puis on calcule $ax_A+by_A+c$ pour sélectionner le bon côté.`,
    keyPoint: "Strict : frontière exclue ; large : frontière incluse.",
    example: "$x+y+1>0$ contient l’origine car $0+0+1>0$ ; la droite $x+y+1=0$ est exclue.",
    steps: ["Trace la droite frontière.", "Teste un point hors de la droite.", "Choisis le demi-plan et précise si la frontière est incluse."],
    questions: [
      choice("L’origine vérifie-t-elle $x+y+1>0$ ?", ["Oui", "Non"], 0, "$0+0+1=1>0$.", "Exercice de fixation, page 4"),
      choice("La droite $x+y+1=0$ appartient-elle à la solution de $x+y+1>0$ ?", ["Oui", "Non"], 1, "L’inégalité est stricte : le demi-plan est ouvert.", "Exercice de fixation, page 4"),
    ],
    weight: 65,
  },
  {
    id: "inequality-systems-modeling",
    title: "Systèmes d’inéquations dans le plan",
    summary: "Résoudre chaque inéquation puis prendre l’intersection des demi-plans.",
    pages: "4-5",
    section: "B-3-b. Systèmes d’inéquations",
    body: String.raw`Pour un système de plusieurs inéquations, on détermine l’ensemble solution de chacune, puis on conserve leur **intersection**.

Chaque frontière doit être tracée correctement : trait interrompu pour une inégalité stricte, trait continu pour une inégalité large.`,
    keyPoint: "Solution du système = intersection de tous les demi-plans solutions.",
    example: "Le système $2x-y+1<0$ et $x-2y+4\ge0$ combine un demi-plan ouvert et un demi-plan fermé.",
    steps: ["Résous graphiquement chaque inéquation.", "Hachure ou colore chaque demi-plan.", "Garde uniquement leur zone commune."],
    questions: [
      choice("Pour $2x-y+1<0$, l’origine est-elle solution ?", ["Oui", "Non"], 1, "$2\times0-0+1=1$, qui n’est pas inférieur à 0.", "Exercice de fixation, page 5"),
      choice("Pour $x-2y+4\ge0$, l’origine est-elle solution ?", ["Oui", "Non"], 0, "$4\ge0$.", "Exercice de fixation, page 5"),
      choice("L’ensemble solution du système est :", ["La réunion des demi-plans", "L’intersection des demi-plans", "Uniquement les frontières", "Toujours vide"], 1, "Les deux inéquations doivent être vérifiées simultanément.", "Méthode, page 4"),
    ],
    weight: 75,
    kind: "challenge",
  },
];

const primitivesDocument = "TA Maths leçon 08 Primitives et Calcul integral.pdf";

const primitivesLevels: FaithfulLevelSeed[] = [
  {
    id: "primitive-definition-usual-functions",
    title: "Définition et famille des primitives",
    summary: "Reconnaître une primitive par dérivation et décrire toutes les primitives d’une fonction.",
    pages: "1-2",
    section: "I-1. Primitives d’une fonction",
    body: String.raw`Soit $f$ une fonction définie sur un intervalle $I$. On appelle **primitive de $f$ sur $I$** toute fonction $F$ dérivable sur $I$ telle que, pour tout $x\in I$,

$$F'(x)=f(x).$$

Si $F$ est une primitive de $f$ sur $I$, alors toutes les primitives de $f$ sont les fonctions $x\mapsto F(x)+c$, où $c\in\mathbb R$. En effet, ajouter une constante ne change pas la dérivée.`,
    keyPoint: "Pour vérifier qu’une fonction est une primitive, on la dérive et on compare le résultat à f.",
    example: "Pour $f(x)=2x+5$, $G(x)=x^2+5x-7$ et $H(x)=x^2+5x$ sont des primitives de $f$.",
    steps: ["Dérive chacune des fonctions proposées.", "Compare chaque dérivée à $f(x)$ sur tout l’intervalle.", "Garde les fonctions dont la dérivée est exactement $f$."],
    questions: [
      choice("Parmi les fonctions du cours, lesquelles sont des primitives de $f(x)=2x+5$ ?", ["F seulement", "G et H", "G et P", "F, G, H et P"], 1, "$G'(x)=H'(x)=2x+5$ ; les dérivées de $F$ et $P$ sont différentes.", "Exercice de fixation, pages 1-2", 2),
      choice("Pourquoi $G$ et $H$ peuvent-elles être deux primitives de la même fonction ?", ["Elles sont égales", "Elles diffèrent d’une constante", "Leur somme est nulle", "Elles ne sont pas dérivables"], 1, "$G(x)-H(x)=-7$, une constante.", "Exercice de fixation, pages 1-2"),
    ],
    corrections: ["La conclusion imprimée « G et F » est une coquille : les calculs de dérivées montrent qu’il faut lire « G et H »."],
    weight: 50,
  },
  {
    id: "primitive-initial-condition",
    title: "Primitive prenant une valeur donnée",
    summary: "Utiliser une condition en un point pour déterminer l’unique constante d’intégration.",
    pages: "2",
    section: "I-2. Primitive prenant une valeur donnée",
    body: String.raw`Si $f$ admet une primitive $F$ sur un intervalle $I$, alors, pour $x_0\in I$ et $y_0\in\mathbb R$, il existe une primitive de $f$ et une seule qui prend la valeur $y_0$ en $x_0$.

On écrit d’abord la famille $H(x)=F(x)+c$, puis la condition $H(x_0)=y_0$ donne une équation qui détermine $c$.`,
    keyPoint: "La condition H(x₀)=y₀ sélectionne une seule fonction dans la famille F+c.",
    example: "$G(x)=x^2-x$ et $H(-1)=5$ donnent $2+c=5$, donc $H(x)=x^2-x+3$.",
    steps: ["Écris $H(x)=F(x)+c$.", "Remplace $x$ par $x_0$ et $H(x_0)$ par $y_0$.", "Calcule $c$, puis vérifie la valeur imposée."],
    questions: [
      short("Dans l’exercice officiel, quelle est la valeur de $c$ ?", ["3"], "$H(-1)=(-1)^2-(-1)+c=2+c=5$.", "Exercice de fixation, page 2"),
      short("Écris la primitive particulière demandée, sans espaces.", ["x^2-x+3", "x²-x+3"], "La famille est $x^2-x+c$ et la condition impose $c=3$.", "Exercice de fixation, page 2", 2),
    ],
    weight: 55,
  },
  {
    id: "primitive-usual-functions",
    title: "Primitives des fonctions usuelles",
    summary: "Lire à l’envers les formules de dérivation des constantes, puissances entières et puissances rationnelles.",
    pages: "2",
    section: "I-3. Primitives des fonctions usuelles",
    body: String.raw`Les formules du cours donnent notamment :

- une primitive de $a$ est $ax$ ;
- une primitive de $x^n$ est $\dfrac{x^{n+1}}{n+1}$ pour $n\in\mathbb N$ ;
- une primitive de $\dfrac1{x^n}$ est $-\dfrac1{(n-1)x^{n-1}}$ pour $n\ge2$, sur un intervalle ne contenant pas $0$ ;
- une primitive de $x^r$ est $\dfrac{x^{r+1}}{r+1}$ lorsque $r\ne-1$, sur l’intervalle où la puissance est définie.

À chaque formule, on ajoute une constante réelle $c$.`,
    keyPoint: "Augmente l’exposant de 1 puis divise par ce nouvel exposant, sauf pour l’exposant −1.",
    example: "Sur $]0;+\infty[$, les primitives de $x^2$ sont $x^3/3+c$ et celles de $1/x^5$ sont $-1/(4x^4)+c$.",
    steps: ["Écris chaque terme sous la forme $ax^r$.", "Applique la formule adaptée et respecte l’intervalle.", "Ajoute la constante $c$ puis dérive pour contrôler."],
    questions: [
      choice("Quelles sont les primitives de $f(x)=x^2$ ?", ["$2x+c$", "$x^3/3+c$", "$x^2/2+c$", "$3x^2+c$"], 1, "La dérivée de $x^3/3$ est $x^2$.", "Exercice de fixation, page 2"),
      choice("Quelles sont les primitives de $f(x)=1/x^5$ sur $]0;+\infty[$ ?", ["$1/(4x^4)+c$", "$-1/(4x^4)+c$", "$\ln x+c$", "$-5/x^6+c$"], 1, "$x^{-5}$ a pour primitive $x^{-4}/(-4)$.", "Exercice de fixation, page 2"),
      choice("Quelles sont les primitives de la fonction constante $-3$ ?", ["$-3x+c$", "$-3+c$", "$3x+c$", "$-x^3+c$"], 0, "La dérivée de $-3x+c$ vaut $-3$.", "Exercice de fixation, page 2"),
    ],
    weight: 60,
  },
  {
    id: "primitive-sum",
    title: "Primitive d’une somme",
    summary: "Additionner des primitives terme à terme.",
    pages: "2-3",
    section: "I-6-a. Primitives de u + v",
    body: String.raw`Si $U$ et $V$ sont des primitives respectives de $u$ et $v$ sur un intervalle $K$, alors $U+V$ est une primitive de $u+v$ sur $K$.

Cette propriété permet de décomposer un polynôme ou une expression en termes simples, puis de primitiver chaque terme séparément.`,
    keyPoint: "La primitive d’une somme s’obtient en additionnant une primitive de chaque terme.",
    example: "Une primitive de $x^4+x^3$ est $x^5/5+x^4/4$.",
    steps: ["Décompose la fonction en somme.", "Trouve une primitive de chaque terme.", "Additionne les résultats et vérifie par dérivation."],
    questions: [
      choice("Une primitive de $x^4+x^3$ est :", ["$4x^3+3x^2$", "$x^5/5+x^4/4$", "$x^5+x^4$", "$x^3/3+x^2/2$"], 1, "On primitive séparément $x^4$ et $x^3$.", "Exercice de fixation, page 3", 2),
    ],
    weight: 60,
  },
  {
    id: "primitive-scalar-multiple",
    title: "Primitive d’un multiple au",
    summary: "Sortir une constante multiplicative avant de chercher une primitive.",
    pages: "3",
    section: "I-6-b. Primitives de au",
    body: String.raw`Si $U$ est une primitive de $u$ sur un intervalle $K$, alors, pour tout réel $a$, la fonction $aU$ est une primitive de $au$ sur $K$.

Autrement dit, une constante multiplicative est conservée lorsque l’on primitive.`,
    keyPoint: "Si U'=u, alors (aU)'=au.",
    example: "Une primitive de $-5/(2x^2)$ sur $\mathbb R^*$ est $5/(2x)$.",
    steps: ["Isole la constante $a$.", "Trouve une primitive de la fonction restante.", "Multiplie cette primitive par $a$ et vérifie."],
    questions: [
      choice("Une primitive de $-5/(2x^2)$ est :", ["$-5/(2x)$", "$5/(2x)$", "$5x/2$", "$-5/(4x^2)$"], 1, "La dérivée de $5/(2x)$ vaut $-5/(2x^2)$.", "Exercice de fixation, page 3", 2),
    ],
    weight: 60,
  },
  {
    id: "composite-primitives",
    title: "Primitive de la forme u′uᵐ",
    summary: "Reconnaître une fonction intérieure positive et sa dérivée.",
    pages: "3",
    section: "I-6-c. Primitives de u′ × uᵐ",
    body: String.raw`Soit $m\in\mathbb Q\setminus\{-1\}$. Si $u$ est dérivable et strictement positive sur $K$, alors une primitive de $u'u^m$ est

$$\frac{u^{m+1}}{m+1}.$$

Le point décisif est de repérer dans l’expression le facteur $u'(x)$, éventuellement à une constante multiplicative près.`,
    keyPoint: "Repère u, contrôle u′, augmente l’exposant de 1 puis divise par m+1.",
    example: "Pour $u(x)=x^2+1$, une primitive de $2x(x^2+1)^8$ est $(x^2+1)^9/9$.",
    steps: ["Choisis $u(x)$ et calcule $u'(x)$.", "Vérifie que le facteur extérieur est bien $u'$.", "Applique $u^{m+1}/(m+1)$ puis dérive pour contrôler."],
    questions: [
      choice("Une primitive de $2x(x^2+1)^8$ est :", ["$2(x^2+1)^9$", "$(x^2+1)^9/9$", "$(x^2+1)^7/7$", "$x^2(x^2+1)^9$"], 1, "La fonction est de la forme $u'u^8$ avec $u=x^2+1$.", "Exercice de fixation, page 3", 2),
    ],
    weight: 70,
  },
  {
    id: "primitive-logarithmic-form",
    title: "Primitive de la forme u′/u",
    summary: "Utiliser le logarithme du module lorsque le dénominateur ne s’annule pas.",
    pages: "3-4",
    section: "I-5. Primitives de u′/u",
    body: String.raw`Si $u$ est dérivable et ne s’annule pas sur un intervalle $K$, alors une primitive de $u'/u$ est $\ln|u|$.

Le cours distingue $\ln u$ lorsque $u>0$ et $\ln(-u)$ lorsque $u<0$. Ces deux écritures sont réunies par $\ln|u|$. Une constante multiplicative peut être ajustée avant d’appliquer la formule.`,
    keyPoint: "Sur un intervalle sans zéro de u : ∫u′/u = ln|u| + c.",
    example: "Sur $]3;+\infty[$, les primitives de $5/(3-x)$ sont $-5\ln(x-3)+c$.",
    steps: ["Pose $u$ égal au dénominateur.", "Compare le numérateur à $u'$ et ajuste la constante.", "Vérifie le signe de $u$ sur l’intervalle puis écris le logarithme."],
    questions: [
      choice("Les primitives de $1/x$ sur $]0;+\infty[$ sont :", ["$1/x+c$", "$\ln x+c$", "$x\ln x+c$", "$e^x+c$"], 1, "$u=x$ et $u'=1$.", "Exercice de fixation, page 4"),
      choice("Une primitive de $(2x+3)/(x^2+3x+5)$ est :", ["$2\ln(x^2+3x+5)$", "$\ln(x^2+3x+5)$", "$1/(x^2+3x+5)$", "$e^{x^2+3x+5}$"], 1, "Le numérateur est la dérivée exacte du dénominateur.", "Exercice de fixation, page 4", 2),
    ],
    weight: 75,
  },
  {
    id: "primitive-exponential-form",
    title: "Primitive de la forme u′eᵘ",
    summary: "Reconnaître la dérivée intérieure qui accompagne une exponentielle composée.",
    pages: "4-5",
    section: "I-6. Primitives de u′eᵘ",
    body: String.raw`Si $u$ est dérivable sur un intervalle $K$, alors $e^u$ est une primitive de $u'e^u$, car

$$(e^u)'=u'e^u.$$

Il faut donc identifier l’exposant $u(x)$ puis vérifier que son dérivé $u'(x)$ est présent comme facteur.`,
    keyPoint: "La primitive de u′eᵘ est eᵘ + c.",
    example: "Une primitive de $(2x+3)e^{x^2+3x-1}$ est $e^{x^2+3x-1}$.",
    steps: ["Lis l’exposant et pose-le égal à $u(x)$.", "Calcule $u'(x)$.", "Vérifie le facteur extérieur puis conserve $e^{u(x)}$ comme primitive."],
    questions: [
      choice("Une primitive de $e^x$ est :", ["$xe^x$", "$e^x$", "$e^{x+1}/2$", "$\ln x$"], 1, "La dérivée de $e^x$ est $e^x$.", "Exercice de fixation, page 4"),
      choice("Une primitive de $4e^{4x+5}$ est :", ["$4e^{4x+5}$", "$e^{4x+5}$", "$e^{4x+5}/4$", "$e^{x+5}$"], 1, "La dérivée de $4x+5$ vaut 4.", "Exercice de fixation, pages 4-5", 2),
    ],
    weight: 75,
  },
  {
    id: "definite-integral",
    title: "Définition et notation de l’intégrale",
    summary: "Calculer une intégrale comme une différence de valeurs d’une primitive.",
    pages: "5",
    section: "II-1. Définition et notation",
    body: String.raw`Soit $f$ continue sur un intervalle $K$, $a,b\in K$ et $F$ une primitive de $f$. Le nombre $F(b)-F(a)$ ne dépend pas de la primitive choisie et s’appelle l’intégrale de $a$ à $b$ de $f$ :

$$\int_a^b f(x)\,dx=[F(x)]_a^b=F(b)-F(a).$$

La lettre $x$ est une **variable muette** : $\int_0^1x^2dx$ et $\int_0^1z^2dz$ ont la même valeur.`,
    keyPoint: "Toujours calculer borne supérieure moins borne inférieure : F(b)−F(a).",
    example: "$\int_0^1x^2dx=[x^3/3]_0^1=1/3$.",
    steps: ["Trouve une primitive $F$ de l’intégrande.", "Calcule $F(b)$ puis $F(a)$.", "Effectue $F(b)-F(a)$ et simplifie la valeur exacte."],
    questions: [
      choice("Quelle est la valeur de $I=\int_0^1x^2dx$ ?", ["$1/2$", "$1/3$", "$1$", "$3$"], 1, "Une primitive de $x^2$ est $x^3/3$.", "Exercice officiel, page 5"),
      choice("Quelle est la valeur de $P=\int_0^1z^2dz$ ?", ["$0$", "$1/3$", "$1/2$", "Elle dépend de la lettre z"], 1, "$z$ est une variable muette : $P=I=1/3$.", "Exercice officiel, page 5"),
    ],
    weight: 70,
  },
  {
    id: "integral-positive-area",
    title: "Intégrale d’une fonction positive et unité d’aire",
    summary: "Relier l’intégrale à l’aire sous une courbe et convertir l’unité d’aire en cm².",
    pages: "5-6",
    section: "II-2. Interprétation graphique",
    body: String.raw`Si $f$ est continue et positive sur $[a;b]$, $\int_a^bf(x)dx$ est l’aire, en unités d’aire, de la partie limitée par sa courbe, l’axe des abscisses et les droites $x=a$ et $x=b$.

Dans un repère orthogonal, une unité d’aire vaut $OI\times OJ$. Si une unité sur l’axe des abscisses représente 2 cm et une unité sur l’axe des ordonnées 3 cm, alors $1\,u.a.=6\,cm^2$.`,
    keyPoint: "Aire réelle = intégrale en u.a. × produit des deux unités graphiques.",
    example: "Pour $f(x)=2x+1$ sur $[0;5]$, l’intégrale vaut 30 u.a., donc l’aire vaut $30\times6=180\,cm^2$.",
    steps: ["Vérifie que $f$ est positive sur l’intervalle.", "Calcule l’intégrale en unités d’aire.", "Multiplie par l’unité horizontale puis par l’unité verticale."],
    questions: [
      short("Dans l’exercice officiel, combien vaut une unité d’aire en cm² ?", ["6", "6cm2", "6cm²"], "$2\,cm\times3\,cm=6\,cm^2$.", "Exercice de fixation, page 6"),
      short("Quelle aire obtient-on pour $f(x)=2x+1$ entre 0 et 5, en cm² ?", ["180", "180cm2", "180cm²"], "$\int_0^5(2x+1)dx=30$ puis $30\times6=180$.", "Exercice de fixation, page 6", 2),
    ],
    weight: 75,
  },
  {
    id: "integral-area",
    title: "Aire sous une courbe et entre deux courbes",
    summary: "Choisir l’intégrande positive puis calculer l’aire géométrique dans les unités demandées.",
    pages: "6-7",
    section: "II-3. Calcul d’aire",
    body: String.raw`Pour une fonction continue positive sur $[a;b]$ :

$$\mathcal A=\int_a^bf(x)\,dx\quad\text{en unités d’aire}.$$

Pour deux fonctions continues avec $f\ge g$ sur $[a;b]$, l’aire comprise entre leurs courbes est

$$\mathcal A=\int_a^b\bigl(f(x)-g(x)\bigr)dx.$$

Il faut donc étudier l’ordre des courbes avant d’intégrer, puis appliquer le facteur de conversion des unités graphiques.`,
    keyPoint: "Entre deux courbes, on intègre toujours fonction supérieure − fonction inférieure.",
    example: "Pour $f=x+2$ et $g=x^2$ sur $[-1;2]$, $f\ge g$ et l’intégrale vaut $9/2$ u.a. ; avec une unité de 2 cm sur chaque axe, l’aire vaut 18 cm².",
    steps: ["Détermine les bornes et la fonction supérieure.", "Intègre la différence positive.", "Calcule la valeur exacte puis convertis les unités d’aire."],
    questions: [
      choice("Pour $f(x)=x^2$ sur $[1;3]$, l’intégrale en unités d’aire vaut :", ["$8/3$", "$26/3$", "$208/3$", "$9$"], 1, "$[x^3/3]_1^3=9-1/3=26/3$.", "Exercice de fixation, pages 6-7"),
      choice("Avec les unités 2 cm et 4 cm, quelle aire obtient-on ?", ["$26/3\,cm^2$", "$52/3\,cm^2$", "$104/3\,cm^2$", "$208/3\,cm^2$"], 3, "Une unité d’aire vaut $2\times4=8\,cm^2$ ; $(26/3)\times8=208/3$.", "Exercice de fixation, pages 6-7", 2),
      short("Quelle est l’aire entre $x+2$ et $x^2$ sur $[-1;2]$, en cm², avec une unité graphique de 2 cm ?", ["18", "18cm2", "18cm²"], "L’intégrale de $x+2-x^2$ vaut $9/2$ et une u.a. vaut $4\,cm^2$.", "Exercice de fixation, page 7", 2),
    ],
    weight: 85,
    kind: "challenge",
  },
];

export const terminalA1ProbabilityPath = buildPath({
  id: "terminale-a1-probability-random-variable",
  chapterNumber: 2,
  themeNumber: 2,
  themeTitle: "Modélisation d’un phénomène aléatoire",
  title: "Probabilité et variable aléatoire",
  description: "Univers, événements, calculs de probabilités et loi d’une variable aléatoire pour la Terminale A1.",
  outcomes: ["Décrire une expérience aléatoire", "Calculer la probabilité d’un événement", "Déterminer la loi d’une variable aléatoire"],
  moduleTitle: "Maîtriser la probabilité et la variable aléatoire",
  sourceDocument: probabilityDocument,
  levels: probabilityLevels,
});

export const terminalA2ProbabilityPath = buildPath({
  id: "terminale-a2-probability",
  chapterNumber: 2,
  themeNumber: 2,
  themeTitle: "Modélisation d’un phénomène aléatoire",
  title: "Probabilité",
  description: "Univers, événements et calculs de probabilités du programme de Terminale A2.",
  outcomes: ["Décrire une expérience aléatoire", "Combiner des événements", "Calculer une probabilité en situation d’équiprobabilité"],
  moduleTitle: "Maîtriser les probabilités",
  sourceDocument: probabilityDocument,
  levels: probabilityLevels.slice(0, -1),
});

export const terminalANaturalLogPath = buildPath({
  id: "terminale-a-natural-logarithm",
  chapterNumber: 3,
  themeNumber: 1,
  themeTitle: "Fonctions numériques",
  title: "Fonction logarithme népérien",
  description: "Définition, propriétés algébriques, limites, dérivation, équations, inéquations et primitives logarithmiques.",
  outcomes: ["Utiliser les propriétés de ln", "Étudier une fonction logarithmique", "Résoudre des équations et inéquations"],
  moduleTitle: "Maîtriser le logarithme népérien",
  sourceDocument: logarithmDocument,
  levels: logarithmLevels,
});

export const terminalAExponentialPath = buildPath({
  id: "terminale-a-exponential",
  chapterNumber: 4,
  themeNumber: 1,
  themeTitle: "Fonctions numériques",
  title: "Fonction exponentielle",
  description: "Définition, propriétés, limites, dérivation, équations, inéquations et primitives exponentielles.",
  outcomes: ["Utiliser les propriétés de exp", "Étudier une fonction exponentielle", "Résoudre des équations et inéquations"],
  moduleTitle: "Maîtriser la fonction exponentielle",
  sourceDocument: exponentialDocument,
  levels: exponentialLevels,
});

export const terminalASequencesPath = buildPath({
  id: "terminale-a-sequences",
  chapterNumber: 5,
  themeNumber: 1,
  themeTitle: "Fonctions numériques",
  title: "Suites numériques",
  description: "Suites arithmétiques et géométriques : termes généraux, variations, sommes et modélisation.",
  outcomes: ["Reconnaître une suite arithmétique", "Reconnaître une suite géométrique", "Calculer un terme et une somme"],
  moduleTitle: "Maîtriser les suites numériques",
  sourceDocument: sequencesDocument,
  levels: sequenceLevels,
});

export const terminalABivariateStatisticsPath = buildPath({
  id: "terminale-a-bivariate-statistics",
  chapterNumber: 6,
  themeNumber: 3,
  themeTitle: "Organisation et traitement des données",
  title: "Statistique à deux variables",
  description: "Séries doubles, nuage de points, point moyen, ajustement de Mayer, corrélation, régression et estimation.",
  outcomes: ["Construire un nuage de points", "Calculer un ajustement affine", "Interpréter une corrélation et estimer une valeur"],
  moduleTitle: "Maîtriser la statistique à deux variables",
  sourceDocument: statisticsDocument,
  levels: statisticsLevels,
});

export const terminalALinearSystemsPath = buildPath({
  id: "terminale-a-linear-systems",
  chapterNumber: 7,
  themeNumber: 1,
  themeTitle: "Fonctions numériques",
  title: "Systèmes linéaires",
  description: "Systèmes de deux équations, changements de variables, demi-plans et systèmes d’inéquations.",
  outcomes: ["Résoudre un système linéaire", "Linéariser un système logarithmique ou exponentiel", "Résoudre graphiquement des inéquations"],
  moduleTitle: "Maîtriser les systèmes linéaires",
  sourceDocument: systemsDocument,
  levels: systemLevels,
});

export const terminalAPrimitivesIntegralsPath = buildPath({
  id: "terminale-a-primitives-integrals",
  chapterNumber: 8,
  themeNumber: 1,
  themeTitle: "Fonctions numériques",
  title: "Primitives et calcul intégral",
  description: "Primitives usuelles et composées, intégrales et calcul d’aires selon le cours officiel.",
  outcomes: ["Déterminer des primitives", "Calculer une intégrale", "Calculer une aire sous ou entre des courbes"],
  moduleTitle: "Maîtriser les primitives et le calcul intégral",
  sourceDocument: primitivesDocument,
  levels: primitivesLevels,
});

export const terminalAAdditionalMathPaths: LearningPath[] = [
  terminalA1ProbabilityPath,
  terminalA2ProbabilityPath,
  terminalANaturalLogPath,
  terminalAExponentialPath,
  terminalASequencesPath,
  terminalABivariateStatisticsPath,
  terminalALinearSystemsPath,
  terminalAPrimitivesIntegralsPath,
];
