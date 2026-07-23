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
  terminalALinearSystemsPath,
  terminalAPrimitivesIntegralsPath,
];
