import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 17 Probabilité.pdf";

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

const truth = (
  prompt: string,
  isTrue: boolean,
  explanation: string,
  sourceLabel: string,
  points = 1,
) => choice(prompt, ["Vrai", "Faux"], isTrue ? 0 : 1, explanation, sourceLabel, points);

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
  interaction?: LessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
  tip?: string;
}

const texSlash = String.fromCharCode(92);
const recoverableTexCommands = [
  "Longleftrightarrow",
  "operatorname",
  "overline",
  "varnothing",
  "mathbb",
  "mathcal",
  "binom",
  "notin",
  "subset",
  "infty",
  "qquad",
  "equiv",
  "sqrt",
  "sigma",
  "Omega",
  "omega",
  "times",
  "cdot",
  "left",
  "right",
  "text",
  "quad",
  "overline",
  "sum",
  "cap",
  "cup",
  "bar",
] as const;

/**
 * Les questions utilisent des chaînes JavaScript ordinaires. Ce garde-fou
 * restaure uniquement, à l'intérieur de $...$ et $$...$$, les commandes TeX
 * dont l'antislash aurait été interprété comme une séquence d'échappement.
 */
function repairMathText(text: string) {
  return text.replace(/\$\$([\s\S]+?)\$\$|\$([^$]+)\$/g, (formula) => {
    let repaired = formula
      .replace(/\u0008ar/g, texSlash + "bar")
      .replace(/\u0008inom/g, texSlash + "binom")
      .replace(/\u000crac/g, texSlash + "frac")
      .replace(/\u0009imes/g, texSlash + "times")
      .replace(/\u0009ext/g, texSlash + "text")
      .replace(/\u0009o/g, texSlash + "to")
      .replace(/\u000dight/g, texSlash + "right")
      .replace(/\u000ae/g, texSlash + "ne")
      .replace(/\u000aotin/g, texSlash + "notin")
      .replace(/\u000barnothing/g, texSlash + "varnothing");

    for (const command of recoverableTexCommands) {
      let cursor = 0;
      while ((cursor = repaired.indexOf(command, cursor)) >= 0) {
        const precedingSlash = repaired.lastIndexOf(texSlash, cursor - 1);
        const insidePrefixedCommand =
          precedingSlash >= 0 && /^[A-Za-z]+$/.test(repaired.slice(precedingSlash + 1, cursor));
        if ((cursor === 0 || repaired[cursor - 1] !== texSlash) && !insidePrefixedCommand) {
          repaired = repaired.slice(0, cursor) + texSlash + repaired.slice(cursor);
          cursor += command.length + 1;
        } else {
          cursor += command.length;
        }
      }
    }

    return repaired
      .replace(/(^|[^A-Za-z])([A-Za-z0-9})\]])le([A-Za-z0-9({\[])/g, "$1$2" + texSlash + "le $3")
      .replace(/(^|[^A-Za-z])([A-Za-z0-9})\]])ge([A-Za-z0-9({\[])/g, "$1$2" + texSlash + "ge $3")
      .replace(/(^|[^A-Za-z])([A-Za-z0-9})\]])ne([A-Za-z0-9({\[])/g, "$1$2" + texSlash + "ne $3");
  });
}

function repairPedagogicalText<T>(value: T): T {
  if (typeof value === "string") return repairMathText(value) as T;
  if (Array.isArray(value)) return value.map((item) => repairPedagogicalText(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, repairPedagogicalText(item)]),
    ) as T;
  }
  return value;
}

function progressionWeight(index: number) {
  return 50 + Math.min(index, 7) * 5;
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
  return repairPedagogicalText({
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
      notationTex: seed.keyPoint,
      example: `$${seed.example}$`,
    },
    interaction: seed.interaction ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Suivre le raisonnement",
      instruction: "Parcours les étapes dans l'ordre avant de passer à la méthode.",
      observation: "Chaque repère reprend le cours et prépare les exercices officiels.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique cette démarche en écrivant la formule avant les nombres.",
      steps: seed.methodSteps,
      example: {
        prompt: "Exemple du document",
        work: `$${seed.example}$`,
        result: `$${seed.keyPoint}$`,
      },
      tip:
        seed.tip ??
        "Astuce mémoire de Davy : dessine l'expérience avant de calculer ; l'arbre ou le tableau révèle presque toujours la bonne formule.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  });
}

const conditionalInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Univers restreint",
  title: "Qui conditionne qui ?",
  instruction: "Sélectionne les trois éléments de la formule pour comprendre le rôle du dénominateur.",
  observation:
    "Dans $P_B(A)$, on sait que B est réalisé : B devient le nouvel univers et seule la partie $A\\cap B$ convient.",
  rootLabel: "$P_B(A)$",
  rootDetail: "Probabilité que A se réalise lorsque B est déjà réalisé.",
  nodes: [
    {
      id: "condition",
      label: "La condition B",
      role: "Le nouvel univers",
      detail: "$P(B)$ est le dénominateur et doit être strictement positif.",
      group: "Lecture",
    },
    {
      id: "intersection",
      label: "$A\\cap B$",
      role: "Les cas favorables dans B",
      detail: "Le numérateur compte les issues où A et B se réalisent ensemble.",
      group: "Lecture",
    },
    {
      id: "product",
      label: "Formule du produit",
      role: "Revenir à l'intersection",
      detail: "$P(A\\cap B)=P(B)P_B(A)=P(A)P_A(B)$.",
      group: "Calcul",
    },
  ],
};

const independenceInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Comparer les notions",
  title: "Indépendance ou incompatibilité ?",
  instruction: "Explore les cartes pour éviter la confusion la plus fréquente du chapitre.",
  observation:
    "Deux événements indépendants peuvent se réaliser ensemble. Deux événements incompatibles de probabilités non nulles ne le peuvent pas.",
  rootLabel: "Deux événements A et B",
  rootDetail: "La relation entre A et B dépend de l'intersection et de l'influence du conditionnement.",
  nodes: [
    {
      id: "independent",
      label: "Indépendants",
      role: "A n'influence pas B",
      detail: "$P(A\\cap B)=P(A)P(B)$ et, si les probabilités sont non nulles, $P_A(B)=P(B)$.",
      group: "Indépendance",
    },
    {
      id: "complements",
      label: "Complémentaires",
      role: "L'indépendance se propage",
      detail: "Si A et B sont indépendants, alors A et $\\overline B$, $\\overline A$ et B, puis $\\overline A$ et $\\overline B$ le sont aussi.",
      group: "Indépendance",
    },
    {
      id: "incompatible",
      label: "Incompatibles",
      role: "Intersection vide",
      detail: "$A\\cap B=\\varnothing$. Si $P(A)>0$ et $P(B)>0$, ils ne sont pas indépendants.",
      group: "À distinguer",
    },
  ],
};

const weightedTreeInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Arbre pondéré",
  title: "Multiplier sur une branche, additionner les chemins",
  instruction: "Sélectionne les repères pour lire la construction d'un arbre de probabilités.",
  observation:
    "À chaque nœud, les probabilités des branches issues de ce nœud totalisent 1. Un chemin complet donne une intersection.",
  caption: "Arbre générique associé à la partition $\\{A,\\overline A\\}$.",
  viewBox: "0 0 470 280",
  shapes: [
    { shape: "circle", cx: 42, cy: 140, r: 5, tone: "fill" },
    { shape: "line", x1: 47, y1: 138, x2: 160, y2: 70, tone: "outline" },
    { shape: "line", x1: 47, y1: 142, x2: 160, y2: 210, tone: "outline" },
    { shape: "line", x1: 165, y1: 70, x2: 340, y2: 35, tone: "accent" },
    { shape: "line", x1: 165, y1: 70, x2: 340, y2: 105, tone: "muted" },
    { shape: "line", x1: 165, y1: 210, x2: 340, y2: 175, tone: "accent" },
    { shape: "line", x1: 165, y1: 210, x2: 340, y2: 245, tone: "muted" },
    { shape: "text", x: 150, y: 58, content: "A", anchor: "middle" },
    { shape: "text", x: 150, y: 232, content: "A contraire", anchor: "middle" },
    { shape: "text", x: 360, y: 40, content: "B", anchor: "middle" },
    { shape: "text", x: 380, y: 110, content: "B contraire", anchor: "middle" },
    { shape: "text", x: 360, y: 180, content: "B", anchor: "middle" },
    { shape: "text", x: 380, y: 250, content: "B contraire", anchor: "middle" },
    { shape: "text", x: 92, y: 92, content: "P(A)", anchor: "middle" },
    { shape: "text", x: 92, y: 205, content: "P(A contraire)", anchor: "middle" },
    { shape: "text", x: 250, y: 40, content: "P_A(B)", anchor: "middle" },
    { shape: "text", x: 260, y: 232, content: "P_Ac(Bc)", anchor: "middle" },
  ],
  hotspots: [
    {
      id: "first-level",
      number: 1,
      label: "Premier niveau",
      detail: "$P(A)+P(\\overline A)=1$.",
      x: 105,
      y: 140,
    },
    {
      id: "second-level",
      number: 2,
      label: "Deuxième niveau",
      detail: "$P_A(B)+P_A(\\overline B)=1$, et la même règle vaut après $\\overline A$.",
      x: 255,
      y: 85,
    },
    {
      id: "branch",
      number: 3,
      label: "Une branche complète",
      detail: "$P(A\\cap B)=P(A)P_A(B)$.",
      x: 330,
      y: 58,
    },
    {
      id: "total",
      number: 4,
      label: "Tous les chemins vers B",
      detail: "$P(B)=P(A\\cap B)+P(\\overline A\\cap B)$.",
      x: 405,
      y: 140,
    },
  ],
};

const randomVariableInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "De l'issue au nombre",
  title: "Construire une loi de probabilité",
  instruction: "Suis le trajet d'une issue jusqu'au tableau de la loi.",
  observation:
    "Plusieurs issues peuvent recevoir la même valeur. Leur probabilités doivent alors être additionnées.",
  rootLabel: "$X:\\Omega\\to\\mathbb R$",
  rootDetail: "La variable aléatoire associe un nombre réel à chaque issue.",
  nodes: [
    {
      id: "image",
      label: "$X(\\Omega)$",
      role: "Lister les valeurs distinctes",
      detail: "On ne répète pas une valeur même si plusieurs issues la produisent.",
      group: "Construction",
    },
    {
      id: "events",
      label: "$(X=x_i)$",
      role: "Regrouper les issues",
      detail: "$(X=x_i)=\\{\\omega\\in\\Omega\,;\,X(\\omega)=x_i\\}$.",
      group: "Construction",
    },
    {
      id: "law",
      label: "$P(X=x_i)$",
      role: "Former le tableau",
      detail: "Les valeurs sont rangées dans l'ordre croissant et la somme des probabilités vaut 1.",
      group: "Vérification",
    },
  ],
};

const dispersionInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Trois indicateurs",
  title: "Moyenne, dispersion et unité",
  instruction: "Explore ce que mesure chaque paramètre avant de calculer.",
  observation:
    "L'espérance garde l'unité de X, la variance porte son carré et l'écart type revient à l'unité de X.",
  rootLabel: "Loi de X",
  rootDetail: "Une loi complète permet de calculer ses paramètres numériques.",
  nodes: [
    {
      id: "expectation",
      label: "$E(X)$",
      role: "La moyenne théorique",
      detail: "$E(X)=\\sum x_ip_i$. Pour un gain, son signe indique à qui le jeu est favorable.",
      group: "Position",
    },
    {
      id: "variance",
      label: "$V(X)$",
      role: "La dispersion quadratique",
      detail: "$V(X)=E(X^2)-[E(X)]^2$ et $V(X)\\ge0$.",
      group: "Dispersion",
    },
    {
      id: "standard-deviation",
      label: "$\\sigma(X)$",
      role: "La dispersion lisible",
      detail: "$\\sigma(X)=\\sqrt{V(X)}$ et s'exprime dans la même unité que X.",
      group: "Dispersion",
    },
  ],
};

const bernoulliInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Deux issues",
  title: "De l'épreuve au schéma de Bernoulli",
  instruction: "Sélectionne chaque ingrédient nécessaire avant d'utiliser la formule.",
  observation:
    "La répétition doit porter sur la même épreuve, avec la même probabilité p et de façon indépendante.",
  rootLabel: "Épreuve de Bernoulli",
  rootDetail: "Deux issues exclusives : succès S de probabilité p et échec de probabilité 1-p.",
  nodes: [
    {
      id: "repeat",
      label: "$n$ répétitions",
      role: "Même épreuve",
      detail: "Le succès est défini de la même manière à chaque répétition.",
      group: "Schéma",
    },
    {
      id: "independent",
      label: "Indépendance",
      role: "Une répétition n'influence pas l'autre",
      detail: "Sans indépendance, la formule binomiale n'est pas justifiée.",
      group: "Schéma",
    },
    {
      id: "exactly-k",
      label: "$k$ succès",
      role: "Choisir les positions",
      detail: "$\\binom nk$ choisit les positions des succès et $p^k(1-p)^{n-k}$ donne une configuration.",
      group: "Calcul",
    },
  ],
};

const binomialInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Loi de comptage",
  title: "Lire $X\\sim\\mathcal B(n,p)$",
  instruction: "Explore les paramètres puis la formule et son interprétation.",
  observation:
    "X compte le nombre de succès : ses valeurs sont toujours les entiers de 0 à n.",
  rootLabel: "$X\\sim\\mathcal B(n,p)$",
  rootDetail: "X compte les succès dans un schéma de Bernoulli à n répétitions.",
  nodes: [
    {
      id: "parameters",
      label: "$n$ et $p$",
      role: "Les deux paramètres",
      detail: "n est le nombre d'épreuves et p la probabilité constante du succès.",
      group: "Lecture",
    },
    {
      id: "probability",
      label: "$P(X=k)$",
      role: "Exactement k succès",
      detail: "$P(X=k)=\\binom nkp^k(1-p)^{n-k}$.",
      group: "Calcul",
    },
    {
      id: "moments",
      label: "$E(X)$ et $V(X)$",
      role: "Les paramètres numériques",
      detail: "$E(X)=np$ et $V(X)=np(1-p)$.",
      group: "Interprétation",
    },
    {
      id: "at-least-one",
      label: "Au moins un succès",
      role: "Passer par le contraire",
      detail: "$P(X\\ge1)=1-P(X=0)=1-(1-p)^n$.",
      group: "Méthode",
    },
  ],
};

const cumulativeInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Courbe en escalier",
  title: "Cumuler les probabilités de gauche à droite",
  instruction: "Sélectionne chaque saut de la fonction de répartition officielle.",
  observation:
    "La hauteur après une valeur $x_i$ est la somme de toutes les probabilités des valeurs inférieures ou égales à $x_i$.",
  caption: "Fonction de répartition de la loi $(-1000,100,300,600)$ de probabilités $(1,3,3,1)/8$.",
  viewBox: "0 0 500 300",
  shapes: [
    { shape: "line", x1: 45, y1: 252, x2: 470, y2: 252, tone: "outline" },
    { shape: "line", x1: 90, y1: 270, x2: 90, y2: 25, tone: "outline" },
    { shape: "line", x1: 45, y1: 252, x2: 150, y2: 252, tone: "muted" },
    { shape: "line", x1: 150, y1: 225, x2: 250, y2: 225, tone: "accent" },
    { shape: "line", x1: 250, y1: 145, x2: 335, y2: 145, tone: "accent" },
    { shape: "line", x1: 335, y1: 65, x2: 415, y2: 65, tone: "accent" },
    { shape: "line", x1: 415, y1: 35, x2: 470, y2: 35, tone: "accent" },
    { shape: "circle", cx: 150, cy: 225, r: 5, tone: "fill" },
    { shape: "circle", cx: 250, cy: 145, r: 5, tone: "fill" },
    { shape: "circle", cx: 335, cy: 65, r: 5, tone: "fill" },
    { shape: "circle", cx: 415, cy: 35, r: 5, tone: "fill" },
    { shape: "text", x: 150, y: 275, content: "-1000", anchor: "middle" },
    { shape: "text", x: 250, y: 275, content: "100", anchor: "middle" },
    { shape: "text", x: 335, y: 275, content: "300", anchor: "middle" },
    { shape: "text", x: 415, y: 275, content: "600", anchor: "middle" },
    { shape: "text", x: 77, y: 230, content: "1/8", anchor: "end" },
    { shape: "text", x: 77, y: 150, content: "1/2", anchor: "end" },
    { shape: "text", x: 77, y: 70, content: "7/8", anchor: "end" },
    { shape: "text", x: 77, y: 40, content: "1", anchor: "end" },
  ],
  hotspots: [
    {
      id: "first-jump",
      number: 1,
      label: "Premier saut",
      detail: "$F(-1000)=P(X=-1000)=1/8$.",
      x: 150,
      y: 225,
    },
    {
      id: "second-jump",
      number: 2,
      label: "Deuxième saut",
      detail: "$F(100)=1/8+3/8=1/2$.",
      x: 250,
      y: 145,
    },
    {
      id: "third-jump",
      number: 3,
      label: "Troisième saut",
      detail: "$F(300)=1/2+3/8=7/8$.",
      x: 335,
      y: 65,
    },
    {
      id: "last-jump",
      number: 4,
      label: "La totalité",
      detail: "$F(600)=7/8+1/8=1$.",
      x: 415,
      y: 35,
    },
  ],
};

const levels: OfficialLevelSeed[] = [
  {
    id: "conditional-probability",
    title: "Calculer une probabilité conditionnelle",
    summary:
      "Restreindre l'univers à l'événement connu, lire correctement la notation et passer de la conditionnelle à l'intersection.",
    pages: "1-2",
    section: "I-1 et I-2. Définition et conséquence",
    durationMinutes: 34,
    body: String.raw`## 1. L'idée : changer d'univers

Soit $B$ un événement d'un univers $Omega$ tel que $P(B)\ne0$. Lorsque l'on sait que **B est réalisé**, on ne regarde plus toutes les issues de $Omega$ : on ne garde que celles de $B$.

La **probabilité de A sachant B** est alors la proportion des issues de $B$ qui appartiennent aussi à $A$ :

$$P_B(A)=P(A\mid B)=\frac{P(A\cap B)}{P(B)}$$

Le document emploie les deux écritures $P_B(A)$ et $P(A/B)$. Dans l'application, la barre verticale est préférée : $P(A\mid B)$.

| Élément | Question à se poser | Rôle |
|---|---|---|
| $B$ | Qu'est-ce que je sais déjà ? | nouvel univers, donc dénominateur |
| $A\cap B$ | Parmi les cas de B, lesquels réalisent A ? | cas favorables, donc numérateur |
| $P_B(A)$ | Quelle part des cas de B réalise A ? | résultat compris entre 0 et 1 |

> **Erreur fréquente.** Dans $P_B(A)$, l'indice **B** est la condition. Le dénominateur est donc $P(B)$, pas $P(A)$.

## 2. Revenir à l'intersection : formule du produit

En multipliant la définition par $P(B)$, on obtient :

$$P(A\cap B)=P(B)P_B(A)$$

Si $P(A)\ne0$, le même événement peut aussi être calculé dans l'autre sens :

$$P(A\cap B)=P(A)P_A(B)$$

Ces deux chemins doivent donner le même nombre.

## 3. Exercice de fixation du document

On connaît $P(E)=\frac12$, $P(F)=\frac34$ et $P(E\cap F)=\frac25$.

$$P_E(F)=\frac{P(E\cap F)}{P(E)}=\frac{2/5}{1/2}=\frac45$$

$$P_F(E)=\frac{P(E\cap F)}{P(F)}=\frac{2/5}{3/4}=\frac8{15}$$

Autre exercice : $P(F)=0{,}75$ et $P_F(I)=0{,}45$. Alors :

$$P(F\cap I)=P(F)P_F(I)=0{,}75\times0{,}45=0{,}3375$$

> **Contrôle de vraisemblance.** Une intersection ne peut pas être plus probable que chacun des événements : $P(A\cap B)\le P(A)$ et $P(A\cap B)\le P(B)$.

> **Astuce mémoire de Davy.** « Ce qui est **sachant** va **dessous**. » Dans $P(A\mid B)$, B est connu : on divise par $P(B)$.`,
    keyPoint: String.raw`P_B(A)=\frac{P(A\cap B)}{P(B)}\quad\text{et}\quad P(A\cap B)=P(B)P_B(A).`,
    example: String.raw`P(F\cap I)=0{,}75\times0{,}45=0{,}3375.`,
    methodSteps: [
      "Repère l'événement placé après « sachant » : il sera au dénominateur.",
      "Écris la définition avant de remplacer par les valeurs.",
      "Simplifie la fraction ou effectue le produit, puis vérifie que le résultat appartient à [0;1].",
    ],
    timeline: [
      { label: "Condition", detail: "B est réalisé : l'univers est restreint à B." },
      { label: "Intersection", detail: "A∩B représente les cas de B qui réalisent aussi A." },
      { label: "Quotient", detail: "Diviser P(A∩B) par P(B)." },
      { label: "Produit", detail: "Inverser la formule pour retrouver P(A∩B)." },
    ],
    interaction: conditionalInteraction,
    questions: [
      choice("Dans $P_B(A)$, quel événement constitue le nouvel univers ?", ["A", "B", "$A\\cap B$", "$\\Omega$ sans B"], 1, "L'indice B indique que B est réalisé : on raisonne à l'intérieur de B.", "Définition • page 1"),
      choice("Quelle formule définit $P_B(A)$ ?", ["$P(A\\cap B)/P(B)$", "$P(A\\cup B)/P(B)$", "$P(A)/P(B)$", "$P(B)/P(A)$"], 0, "Les cas favorables sont A∩B et le nouvel univers est B.", "Définition • page 1", 2),
      short("Avec $P(E)=1/2$ et $P(E\\cap F)=2/5$, calcule $P_E(F)$.", ["4/5", "0,8", "0.8"], "$P_E(F)=(2/5)/(1/2)=4/5$.", "Exercice de fixation • page 1", 2),
      short("Avec $P(F)=3/4$ et $P(E\\cap F)=2/5$, calcule $P_F(E)$.", ["8/15", "0,533333", "0.533333"], "$P_F(E)=(2/5)/(3/4)=8/15$.", "Exercice de fixation • page 1", 2),
      choice("Pour calculer $P(A\\cap B)$ à partir de $P(B)$ et $P_B(A)$, il faut :", ["les multiplier", "les additionner", "les soustraire", "diviser P(B) par la conditionnelle"], 0, "$P(A\\cap B)=P(B)P_B(A)$.", "Conséquence • page 2"),
      short("$P(F)=0{,}75$ et $P_F(I)=0{,}45$. Calcule $P(F\\cap I)$.", ["0,3375", "0.3375", "3375/10000", "27/80"], "$0{,}75\\times0{,}45=0{,}3375=27/80$.", "Exercice de fixation • page 2", 2),
      truth("En général, $P_A(B)=P_B(A)$.", false, "Les dénominateurs diffèrent : P(A) d'un côté et P(B) de l'autre.", "Compréhension de la définition"),
      choice("Pour que $P_B(A)$ soit définie, il faut :", ["$P(B)>0$", "$P(A)>0$", "$P(A)=P(B)$", "$A\\cap B=\\varnothing$"], 0, "P(B) est le dénominateur ; il doit être non nul.", "Définition • page 1"),
      short("Si $P(B)=0{,}4$ et $P_B(A)=0{,}25$, calcule $P(A\\cap B)$.", ["0,1", "0.1", "1/10"], "$0{,}4\\times0{,}25=0{,}1$.", "Application de la formule du produit"),
      truth("Si $B\\subset A$ et $P(B)>0$, alors $P_B(A)=1$.", true, "Dans l'univers B, toutes les issues appartiennent à A.", "Approfondissement de la définition"),
      short("Calcule $P_B(B)$ lorsque $P(B)>0$.", ["1", "+1"], "$P_B(B)=P(B)/P(B)=1$.", "Approfondissement de la définition"),
      choice("Quel contrôle est toujours vrai ?", ["$P(A\\cap B)\\le P(A)$", "$P(A\\cap B)\\ge P(A)$", "$P_B(A)>1$", "$P(A\\cap B)=P(A)+P(B)$"], 0, "L'intersection est incluse dans A, donc sa probabilité ne peut pas dépasser P(A).", "Contrôle de vraisemblance"),
    ],
  },
  {
    id: "product-independence",
    title: "Distinguer indépendance et incompatibilité",
    summary:
      "Reconnaître deux événements indépendants, exploiter les événements contraires et ne pas confondre absence d'influence et impossibilité simultanée.",
    pages: "2-3",
    section: "I-3. Événements indépendants",
    durationMinutes: 40,
    body: String.raw`## 1. Définition de l'indépendance

Deux événements $A$ et $B$ d'un même univers sont **indépendants** lorsque :

$$P(A\cap B)=P(A)P(B)$$

Lorsque $P(A)>0$ et $P(B)>0$, cette égalité équivaut à :

$$P_B(A)=P(A)\qquad\text{ou}\qquad P_A(B)=P(B)$$

**Interprétation :** apprendre que l'un des événements est réalisé ne change pas la probabilité de l'autre.

## 2. Les événements contraires

Si $A$ et $B$ sont indépendants, alors les trois couples suivants le sont aussi :

- $\overline A$ et $B$ ;
- $A$ et $\overline B$ ;
- $\overline A$ et $\overline B$.

Par exemple :

$$P(A\cap\overline B)=P(A)[1-P(B)]$$

## 3. Indépendance n'est pas incompatibilité

| Notion | Traduction | Peuvent-ils se réaliser ensemble ? |
|---|---|---|
| indépendants | $P(A\cap B)=P(A)P(B)$ | oui, en général |
| incompatibles | $A\cap B=\varnothing$ | non |

Si $A$ et $B$ sont incompatibles et de probabilités non nulles, alors $P(A\cap B)=0$ mais $P(A)P(B)>0$ : ils **ne sont donc pas indépendants**.

## 4. Exercice de la pièce équilibrée

On lance deux fois une pièce équilibrée. En notant $P$ pour pile et $F$ pour face :

$$\Omega=\{(P,P);(P,F);(F,P);(F,F)\}$$

Soit $A$ : « face au premier lancer » et $B$ : « face au second lancer ».

$$A=\{(F,P);(F,F)\},\quad B=\{(P,F);(F,F)\}$$

$$A\cap B=\{(F,F)\}$$

Ainsi $P(A)=P(B)=1/2$ et $P(A\cap B)=1/4=(1/2)(1/2)$ : A et B sont indépendants.

> **Erreur fréquente.** « Indépendants » ne signifie pas « sans point commun ». L'indépendance compare une probabilité ; l'incompatibilité regarde si l'intersection est vide.

> **Astuce mémoire de Davy.** **IN**dépendants : aucune **IN**fluence. **IN**compatibles : aucune issue **IN**ter commune.` ,
    keyPoint: String.raw`A\perp B\Longleftrightarrow P(A\cap B)=P(A)P(B).`,
    example: String.raw`P(A\cap B)=1/4=P(A)P(B)`,
    methodSteps: [
      "Calcule séparément P(A), P(B) et P(A∩B).",
      "Compare P(A∩B) au produit P(A)P(B).",
      "Conclue par une phrase : égalité donc indépendance, ou inégalité donc dépendance.",
    ],
    timeline: [
      { label: "Trois nombres", detail: "Calculer P(A), P(B) et P(A∩B)." },
      { label: "Produit", detail: "Former P(A)P(B)." },
      { label: "Comparer", detail: "L'égalité caractérise l'indépendance." },
      { label: "Contraires", detail: "L'indépendance se transmet aux événements contraires." },
    ],
    interaction: independenceInteraction,
    questions: [
      choice("Quelle égalité caractérise l'indépendance de A et B ?", ["$P(A\\cap B)=P(A)P(B)$", "$P(A\\cap B)=0$", "$P(A)=P(B)$", "$P(A\\cup B)=1$"], 0, "C'est la définition de deux événements indépendants.", "Définition • page 2", 2),
      choice("Dans l'exercice de la pièce, quel est l'univers ?", ["$\\{P,F\\}$", "$\\{(P,P),(P,F),(F,P),(F,F)\\}$", "$\\{(P,P),(F,F)\\}$", "$\\{(P,F),(F,P)\\}$"], 1, "Deux lancers ordonnés donnent quatre couples.", "Exercice de fixation • pages 2-3"),
      short("Quel est le cardinal de cet univers ?", ["4", "quatre"], "Il contient PP, PF, FP et FF.", "Exercice de fixation • page 2"),
      choice("Quel ensemble représente A : « face au premier lancer » ?", ["$\\{(F,P),(F,F)\\}$", "$\\{(P,F),(F,F)\\}$", "$\\{(F,P),(P,F)\\}$", "$\\{(P,P),(P,F)\\}$"], 0, "Le premier symbole doit être F.", "Exercice de fixation • page 2"),
      choice("Quel ensemble représente B : « face au second lancer » ?", ["$\\{(P,F),(F,F)\\}$", "$\\{(F,P),(F,F)\\}$", "$\\{(P,P),(F,P)\\}$", "$\\{(P,F),(F,P)\\}$"], 0, "Le second symbole doit être F.", "Exercice de fixation • page 2"),
      short("Calcule $P(A)$.", ["1/2", "0,5", "0.5"], "Deux issues sur quatre réalisent A.", "Exercice de fixation • page 3"),
      short("Calcule $P(B)$.", ["1/2", "0,5", "0.5"], "Deux issues sur quatre réalisent B.", "Exercice de fixation • page 3"),
      short("Calcule $P(A\\cap B)$.", ["1/4", "0,25", "0.25"], "Seule l'issue (F,F) réalise A et B.", "Exercice de fixation • page 3", 2),
      truth("Les événements A et B de l'exercice sont indépendants.", true, "$1/4=(1/2)(1/2)$.", "Exercice de fixation • page 3", 2),
      truth("Deux événements indépendants de probabilités non nulles sont incompatibles.", false, "Leur intersection a la probabilité positive P(A)P(B).", "Remarque • page 2"),
      truth("Si A et B sont indépendants, alors A et $\\overline B$ sont indépendants.", true, "C'est l'une des propriétés du cours.", "Propriété • page 2"),
      short("Si $P(A)=0{,}4$ et $P(B)=0{,}5$ avec A et B indépendants, calcule $P(A\\cap B)$.", ["0,2", "0.2", "1/5"], "$0{,}4\\times0{,}5=0{,}2$.", "Application de l'indépendance"),
      short("Dans la même situation, calcule $P(A\\cup B)$.", ["0,7", "0.7", "7/10"], "$0{,}4+0{,}5-0{,}2=0{,}7$.", "Application de l'indépendance", 2),
      choice("Si $P(A)>0$ et A, B sont indépendants, alors $P_A(B)$ vaut :", ["$P(B)$", "$P(A)$", "$P(A\\cap B)$", "0"], 0, "Le conditionnement par A ne modifie pas la probabilité de B.", "Conséquence de la définition • page 2"),
    ],
  },
  {
    id: "partition-total-probability",
    title: "Construire un arbre et utiliser les probabilités totales",
    summary:
      "Décomposer l'univers en une partition, multiplier les branches, additionner les chemins et remonter une probabilité conditionnelle.",
    pages: "3-4, 8-9 et 11-13",
    section: "I-4. Partition, probabilités totales et arbres",
    durationMinutes: 55,
    body: String.raw`## 1. Partition d'un univers

Des événements $B_1,B_2,\ldots,B_n$ forment une **partition** de $Omega$ lorsque :

1. ils sont deux à deux disjoints : $B_i\cap B_j=\varnothing$ si $i\ne j$ ;
2. ils couvrent tout l'univers : $B_1\cup\cdots\cup B_n=\Omega$.

Le document vérifie par exemple que $\{1,2\}$, $\{3,4,5\}$, $\{6,7\}$ et $\{8\}$ partitionnent $\{1,\ldots,8\}$.

## 2. Formule des probabilités totales

Si $B_1,\ldots,B_n$ forment une partition et ont des probabilités non nulles, alors, pour tout événement A :

$$P(A)=\sum_{i=1}^{n}P(A\cap B_i)=\sum_{i=1}^{n}P(B_i)P_{B_i}(A)$$

Pour la partition la plus fréquente $\{B,\overline B\}$ :

$$P(A)=P(B)P_B(A)+P(\overline B)P_{\overline B}(A)$$

## 3. Lire un arbre pondéré

- À un même nœud, la somme des branches vaut 1.
- Le produit le long d'un chemin donne une intersection.
- L'addition des chemins qui arrivent au même événement donne sa probabilité totale.

### Magasin d'ordinateurs

La marque A représente 64 % des ventes et N 36 %. Sont soldés 30 % des A et 60 % des N.

$$P(S)=0{,}64\times0{,}30+0{,}36\times0{,}60=0{,}408$$

## 4. Situation complexe de Dago

Soit $E$ : « l'élève est en Terminale D » et $R$ : « l'élève aime le damier ». On connaît :

$$P_E(R)=\frac13,\qquad P_{\overline E}(R)=\frac14,\qquad P(R)=\frac3{10}$$

Posons $x=P(E)$. Alors :

$$\frac3{10}=\frac13x+\frac14(1-x)$$

On obtient $x=3/5=0{,}60$ : les élèves de Terminale D représentent **60 %** de l'échantillon.

## 5. Deux applications du document

### Barrage

65 % de la population s'oppose au barrage ; 70 % de ces opposants sont écologistes. Parmi les non-opposants, 20 % sont écologistes.

$$P(C\cap E)=0{,}65\times0{,}70=0{,}455$$

$$P(\overline C\cap E)=0{,}35\times0{,}20=0{,}07$$

$$P(E)=0{,}455+0{,}07=0{,}525$$

### Restaurant de Mariam

$P(A)=0{,}6$, $P_A(B)=0{,}7$ et $P_{\overline A}(B)=0{,}4$.

$$P(A\cap B)=0{,}42,\qquad P(B)=0{,}42+0{,}16=0{,}58$$

Sachant qu'il y a eu bénéfice :

$$P_B(A)=\frac{0{,}42}{0{,}58}=\frac{21}{29}$$

> **Astuce mémoire de Davy.** Sur un arbre : **multiplie en descendant, additionne en remontant**. Pour « sachant », divise le chemin commun par la probabilité d'arrivée.`,
    keyPoint: String.raw`P(A)=\sum_iP(B_i)P_{B_i}(A).`,
    example: String.raw`P(S)=0{,}64(0{,}30)+0{,}36(0{,}60)=0{,}408.`,
    methodSteps: [
      "Choisis la partition qui décrit les premiers cas de l'expérience.",
      "Complète chaque paire de branches à 1 et multiplie le long des chemins.",
      "Additionne les chemins qui conduisent à l'événement demandé.",
      "Si la question contient « sachant », divise l'intersection par la probabilité de la condition.",
    ],
    timeline: [
      { label: "Partition", detail: "Cas incompatibles couvrant tout l'univers." },
      { label: "Branches", detail: "Chaque embranchement totalise 1." },
      { label: "Chemin", detail: "Multiplier donne une intersection." },
      { label: "Total", detail: "Additionner les chemins menant à l'événement." },
      { label: "Retour", detail: "Diviser pour une probabilité sachant un résultat." },
    ],
    interaction: weightedTreeInteraction,
    questions: [
      choice("Pour former une partition, les parties doivent être :", ["deux à deux disjointes et de réunion $\\Omega$", "toutes égales", "toutes de même probabilité", "deux à deux indépendantes"], 0, "Une partition découpe l'univers sans chevauchement ni oubli.", "Définition • page 3", 2),
      truth("Les ensembles $\\{1,2\\}$, $\\{3,4,5\\}$, $\\{6,7\\}$ et $\\{8\\}$ sont deux à deux disjoints.", true, "Aucun nombre n'appartient à deux de ces ensembles.", "Exercice de fixation • page 3"),
      choice("Quelle est leur réunion ?", ["$\\{1,2,3,4,5,6,7,8\\}$", "$\\varnothing$", "$\\{1,8\\}$", "$\\{2,4,6,8\\}$"], 0, "Tous les éléments de A sont couverts.", "Exercice de fixation • page 3"),
      choice("Sur une branche complète d'un arbre, on :", ["multiplie les probabilités", "additionne les probabilités", "soustrait les probabilités", "prend la moyenne"], 0, "Le produit donne la probabilité de l'intersection associée au chemin.", "Arbre pondéré • page 3"),
      choice("Pour réunir plusieurs chemins menant tous à S, on :", ["additionne leurs probabilités", "les multiplie encore", "garde le plus grand", "divise par deux"], 0, "Les chemins sont incompatibles et leurs probabilités s'additionnent.", "Probabilités totales • page 3"),
      short("Magasin : calcule $P(A\\cap S)$ avec $P(A)=0{,}64$ et $P_A(S)=0{,}30$.", ["0,192", "0.192", "192/1000", "24/125"], "$0{,}64\\times0{,}30=0{,}192$.", "Exercice de fixation • pages 3-4", 2),
      short("Calcule $P(N\\cap S)$ avec $P(N)=0{,}36$ et $P_N(S)=0{,}60$.", ["0,216", "0.216", "216/1000", "27/125"], "$0{,}36\\times0{,}60=0{,}216$.", "Exercice de fixation • pages 3-4", 2),
      short("Déduis $P(S)$.", ["0,408", "0.408", "51/125"], "$0{,}192+0{,}216=0{,}408$.", "Exercice de fixation prolongé • pages 3-4", 2),
      short("Déduis la probabilité qu'un ordinateur ne soit pas soldé.", ["0,592", "0.592", "74/125"], "$1-0{,}408=0{,}592$.", "Exercice de fixation prolongé • pages 3-4"),
      choice("Dans la situation de Dago, l'équation correcte est :", ["$3/10=x/3+(1-x)/4$", "$3/10=x/4+(1-x)/3$", "$3/10=x+1/3+1/4$", "$x=3/10+1/3$"], 0, "Terminale D a la proportion x et Terminale C la proportion 1-x.", "Situation complexe • pages 8-9", 2),
      short("Résous cette équation et donne $P(E)$.", ["3/5", "0,6", "0.6", "60%", "60 %"], "$x=3/5=60\\%$.", "Situation complexe • page 9", 3),
      short("Barrage : calcule $P(C\\cap E)$.", ["0,455", "0.455", "455/1000", "91/200"], "$0{,}65\\times0{,}70=0{,}455$.", "Renforcement 4 • page 11", 2),
      short("Calcule $P(\\overline C\\cap E)$.", ["0,07", "0.07", "7/100"], "$0{,}35\\times0{,}20=0{,}07$.", "Renforcement 4 • page 11", 2),
      short("Déduis la probabilité qu'une personne soit écologiste.", ["0,525", "0.525", "21/40", "52,5%", "52,5 %"], "$0{,}455+0{,}07=0{,}525$.", "Renforcement 4 • page 11", 2),
      short("Mariam : calcule $P(A\\cap B)$.", ["0,42", "0.42", "21/50"], "$0{,}6\\times0{,}7=0{,}42$.", "Approfondissement • pages 11-12", 2),
      short("Calcule $P(\\overline A\\cap B)$.", ["0,16", "0.16", "4/25"], "$0{,}4\\times0{,}4=0{,}16$.", "Approfondissement • page 12", 2),
      short("Déduis $P(B)$.", ["0,58", "0.58", "29/50"], "$0{,}42+0{,}16=0{,}58$.", "Approfondissement • page 12", 2),
      short("Sachant que Mariam a réalisé un bénéfice, calcule la probabilité qu'il y ait eu affluence.", ["21/29", "0,7241", "0.7241"], "$P_B(A)=0{,}42/0{,}58=21/29$.", "Approfondissement • page 12", 3),
      truth("À un même nœud d'un arbre pondéré, la somme des branches vaut 1.", true, "Ces branches décrivent des cas incompatibles et exhaustifs.", "Arbre pondéré • pages 3-4"),
      choice("La formule des probabilités totales pour la partition $\\{B,\\overline B\\}$ est :", ["$P(A)=P(B)P_B(A)+P(\\overline B)P_{\\overline B}(A)$", "$P(A)=P_B(A)+P_{\\overline B}(A)$", "$P(A)=P(A\\cap B)P(A\\cap\\overline B)$", "$P(A)=P(B)+P(\\overline B)$"], 0, "On additionne les deux intersections obtenues par produit de branches.", "Formule • page 3", 2),
    ],
  },
  {
    id: "random-variable-law",
    title: "Construire la loi d'une variable aléatoire",
    summary:
      "Associer un nombre à chaque issue, regrouper les issues de même valeur et établir un tableau dont les probabilités totalisent 1.",
    pages: "4-5 et 10-11",
    section: "II-1. Variable aléatoire et loi de probabilité",
    durationMinutes: 45,
    body: String.raw`## 1. Variable aléatoire

Dans cette partie, l'univers $Omega$ est fini. Une **variable aléatoire** est une application :

$$X:\Omega\longrightarrow\mathbb R$$

Elle associe un nombre réel $X(\omega)$ à chaque issue $\omega$. L'ensemble des valeurs prises est :

$$X(\Omega)=\{x_1;x_2;\ldots;x_n\}$$

L'événement $(X=x_i)$ regroupe toutes les issues auxquelles X associe $x_i$ :

$$ (X=x_i)=\{\omega\in\Omega\,;\,X(\omega)=x_i\} $$

## 2. Loi de probabilité

La loi de X associe à chaque valeur $x_i$ la probabilité $P(X=x_i)$. On range les $x_i$ dans l'ordre croissant et l'on vérifie :

$$\sum_iP(X=x_i)=1$$

## 3. Tirage de trois boules parmi six

L'urne contient 2 boules blanches et 4 rouges. On tire simultanément 3 boules et X compte les blanches.

$$X(\Omega)=\{0;1;2\},\qquad \operatorname{card}(\Omega)=\binom63=20$$

| $x_i$ | 0 | 1 | 2 |
|---|---:|---:|---:|
| $P(X=x_i)$ | $\binom43/20=1/5$ | $\binom21\binom42/20=3/5$ | $\binom22\binom41/20=1/5$ |

## 4. Exercice de renforcement : points blancs et noirs

Une autre urne contient 3 boules blanches et 5 noires. Une blanche vaut +1 point, une noire -1 point ; on en tire 3.

| Composition | X | Nombre de tirages | Probabilité correcte |
|---|---:|---:|---:|
| NNN | -3 | $\binom53=10$ | $10/56$ |
| BNN | -1 | $\binom31\binom52=30$ | $30/56$ |
| BBN | 1 | $\binom32\binom51=15$ | $15/56$ |
| BBB | 3 | $\binom33=1$ | $1/56$ |

> **Correction du document.** La solution de la page 10 inverse les choix dans les urnes blanche et noire : elle attribue $1/56$ à trois noires et $10/56$ à trois blanches, puis échange aussi les probabilités de $X=-1$ et $X=1$. Le tableau ci-dessus respecte l'énoncé.

## 5. Dix morceaux équiprobables

Les durées sont 200 s (2 morceaux), 240 s (3), 260 s (1) et 280 s (4). Puisque les dix morceaux ont **la même probabilité**, la loi correcte est :

| Durée $x_i$ | 200 | 240 | 260 | 280 |
|---|---:|---:|---:|---:|
| $P(X=x_i)$ | $2/10$ | $3/10$ | $1/10$ | $4/10$ |

> **Erreur fréquente.** La valeur associée à une issue n'est pas sa probabilité. Une durée de 280 secondes n'est pas « plus probable » parce qu'elle est plus grande.` ,
    keyPoint: String.raw`\sum_iP(X=x_i)=1.`,
    example: String.raw`P(X=1)=\frac{\binom21\binom42}{\binom63}=\frac35.`,
    methodSteps: [
      "Liste les valeurs distinctes de X dans l'ordre croissant.",
      "Pour chaque valeur, compte les issues qui la produisent.",
      "Calcule chaque probabilité puis vérifie que la somme vaut 1.",
    ],
    timeline: [
      { label: "Issues", detail: "Partir de l'expérience et de son univers." },
      { label: "Valeurs", detail: "Calculer X(ω) et garder les valeurs distinctes." },
      { label: "Regroupement", detail: "Former les événements (X=xᵢ)." },
      { label: "Loi", detail: "Associer les probabilités et vérifier leur somme." },
    ],
    interaction: randomVariableInteraction,
    corrections: [
      "Dans l'exercice 2 de renforcement, page 10, le corrigé inverse les boules blanches et noires dans les quatre dénombrements. La loi correcte est P(-3)=10/56, P(-1)=30/56, P(1)=15/56 et P(3)=1/56.",
      "Dans l'exercice des morceaux, page 11, le corrigé transforme les durées en poids de sélection alors que l'énoncé impose l'équiprobabilité. Chaque morceau a la probabilité 1/10.",
    ],
    questions: [
      choice("Une variable aléatoire X associe à chaque issue :", ["un nombre réel", "un événement impossible", "toujours une probabilité", "un nouvel univers infini"], 0, "C'est une application de Ω dans ℝ.", "Définition • page 4"),
      choice("Dans l'urne à 2 blanches et 4 rouges, quelles valeurs peut prendre le nombre X de blanches parmi 3 boules ?", ["$\\{0,1,2\\}$", "$\\{0,1,2,3\\}$", "$\\{1,2\\}$", "$\\{2,4\\}$"], 0, "Il est impossible d'en tirer trois puisqu'il n'y en a que deux.", "Exercice de fixation • page 4", 2),
      short("Calcule $\\binom63$, le nombre total de tirages.", ["20", "+20"], "$\\binom63=20$.", "Exercice de fixation • page 4"),
      short("Calcule $P(X=0)$.", ["1/5", "0,2", "0.2"], "Il faut choisir 3 rouges parmi 4 : $\\binom43/20=4/20=1/5$.", "Exercice de fixation • page 5", 2),
      short("Calcule $P(X=1)$.", ["3/5", "0,6", "0.6"], "$\\binom21\\binom42/20=12/20=3/5$.", "Exercice de fixation • page 5", 2),
      short("Calcule $P(X=2)$.", ["1/5", "0,2", "0.2"], "$\\binom22\\binom41/20=4/20=1/5$.", "Exercice de fixation • page 5", 2),
      choice("Quelle valeur de X est la plus probable ?", ["1", "0", "2", "Les trois sont équiprobables"], 0, "$P(X=1)=3/5$ est la plus grande probabilité.", "Exercice de fixation • page 5"),
      short("Renforcement 2 : combien y a-t-il de tirages simultanés de 3 boules parmi 8 ?", ["56", "+56"], "$\\binom83=56$.", "Renforcement 2 • page 10"),
      short("Donne la probabilité correcte de $X=-3$ (trois boules noires).", ["10/56", "5/28", "0,178571", "0.178571"], "$\\binom53/\\binom83=10/56=5/28$.", "Renforcement 2 corrigé • page 10", 2),
      short("Donne la probabilité correcte de $X=-1$ (une blanche, deux noires).", ["30/56", "15/28", "0,535714", "0.535714"], "$\\binom31\\binom52/56=30/56$.", "Renforcement 2 corrigé • page 10", 2),
      short("Donne la probabilité correcte de $X=1$ (deux blanches, une noire).", ["15/56", "0,267857", "0.267857"], "$\\binom32\\binom51/56=15/56$.", "Renforcement 2 corrigé • page 10", 2),
      short("Donne la probabilité correcte de $X=3$ (trois blanches).", ["1/56", "0,017857", "0.017857"], "$\\binom33/56=1/56$.", "Renforcement 2 corrigé • page 10", 2),
      choice("Dans cette loi corrigée, la valeur la plus probable est :", ["$-1$", "$1$", "$-3$", "$3$"], 0, "$30/56$ est la probabilité la plus forte.", "Renforcement 2 corrigé • page 10"),
      short("Exercice des morceaux : quelle est la probabilité de sélectionner le morceau A ?", ["1/10", "0,1", "0.1"], "Les dix morceaux sont explicitement équiprobables.", "Renforcement 3 corrigé • pages 10-11", 2),
      short("Donne $P(X=200)$ pour la durée du morceau.", ["1/5", "2/10", "0,2", "0.2"], "Deux morceaux sur dix durent 200 secondes.", "Renforcement 3 corrigé • pages 10-11"),
      short("Donne $P(X=240)$.", ["3/10", "0,3", "0.3"], "Trois morceaux sur dix durent 240 secondes.", "Renforcement 3 corrigé • pages 10-11"),
      short("Donne $P(X=260)$.", ["1/10", "0,1", "0.1"], "Un seul morceau sur dix dure 260 secondes.", "Renforcement 3 corrigé • pages 10-11"),
      short("Donne $P(X=280)$.", ["2/5", "4/10", "0,4", "0.4"], "Quatre morceaux sur dix durent 280 secondes.", "Renforcement 3 corrigé • pages 10-11"),
      truth("Pour toute loi finie, la somme des probabilités doit valoir 1.", true, "C'est le contrôle indispensable d'une loi de probabilité.", "Remarque • page 4"),
    ],
  },
  {
    id: "expectation-variance",
    title: "Interpréter l'espérance, la variance et l'écart type",
    summary:
      "Calculer les trois paramètres d'une loi, interpréter un gain moyen et corriger les résultats incohérents du document.",
    pages: "5 et 9-11",
    section: "II-2. Espérance, variance et écart type",
    durationMinutes: 55,
    body: String.raw`## 1. Les trois paramètres

Pour une variable X prenant les valeurs $x_1,\ldots,x_n$ avec les probabilités $p_1,\ldots,p_n$ :

$$E(X)=\sum_{i=1}^{n}x_ip_i$$

$$V(X)=\sum_{i=1}^{n}(x_i-E(X))^2p_i$$

La formule de calcul la plus rapide est souvent :

$$V(X)=E(X^2)-[E(X)]^2=\sum_{i=1}^{n}x_i^2p_i-[E(X)]^2$$

Enfin :

$$\sigma(X)=\sqrt{V(X)}$$

| Paramètre | Sens | Unité |
|---|---|---|
| $E(X)$ | valeur moyenne théorique | unité de X |
| $V(X)$ | dispersion quadratique | unité de X au carré |
| $\sigma(X)$ | dispersion autour de la moyenne | unité de X |

## 2. Jeu : favorable, défavorable ou équitable

Lorsque X désigne un gain algébrique :

- $E(X)>0$ : jeu avantageux pour le joueur ;
- $E(X)<0$ : jeu désavantageux pour le joueur ;
- $E(X)=0$ : jeu équitable.

## 3. Exercice de fixation complété

La loi est $x_i=-1000,100,300,600$ avec les probabilités $1/8,3/8,3/8,1/8$.

$$E(X)=100$$

Le document s'arrête ici alors qu'il demande aussi l'écart type. Complétons :

$$E(X^2)=\frac{1000000+3(10000)+3(90000)+360000}{8}=207500$$

$$V(X)=207500-100^2=197500$$

$$\sigma(X)=\sqrt{197500}=50\sqrt{79}\approx444{,}41$$

## 4. Renforcement : trois lancers d'une pièce

| Gain X | -1000 | 100 | 300 | 600 |
|---|---:|---:|---:|---:|
| Probabilité | $1/8$ | $3/8$ | $3/8$ | $1/8$ |

Le document obtient $P(X<300)=1/2$ et $E(X)=100$ : le jeu favorise le joueur. Si la perte en cas de trois piles devient $S$, l'équité impose :

$$\frac{-S+3(100)+3(300)+600}{8}=0\Longrightarrow S=1800$$

## 5. Morceaux équiprobables : résultat corrigé

La loi correcte des durées est $1/5,3/10,1/10,2/5$. Ainsi :

$$E(X)=200\left(\frac15\right)+240\left(\frac3{10}\right)+260\left(\frac1{10}\right)+280\left(\frac25\right)=250\text{ s}$$

> **Correction majeure.** La solution de la page 11 pondère chaque morceau par sa durée sur 2500, en contradiction avec l'équiprobabilité annoncée. Le résultat $1268/5=253{,}6$ s est donc faux ; l'espérance correcte est 250 s.

> **Astuce mémoire de Davy.** Espérance = « centre » ; variance = « carré des écarts » ; écart type = « retour à l'unité de départ » grâce à la racine carrée.` ,
    keyPoint: String.raw`E(X)=\sum x_ip_i,\quad V(X)=E(X^2)-E(X)^2,\quad\sigma(X)=\sqrt{V(X)}.`,
    example: String.raw`E(X)=100,\;V(X)=197500,\;\sigma(X)=50\sqrt{79}\approx444{,}41.`,
    methodSteps: [
      "Vérifie d'abord la loi : probabilités positives et somme égale à 1.",
      "Calcule E(X), puis E(X²) en utilisant les carrés des valeurs.",
      "Soustrais [E(X)]² pour obtenir V(X), puis prends la racine pour σ(X).",
      "Interprète le signe de E(X) si X représente un gain.",
    ],
    timeline: [
      { label: "Moyenne", detail: "E(X)=Σxᵢpᵢ." },
      { label: "Carrés", detail: "Calculer E(X²)=Σxᵢ²pᵢ." },
      { label: "Variance", detail: "V(X)=E(X²)-E(X)²." },
      { label: "Écart type", detail: "σ(X)=√V(X)." },
      { label: "Sens", detail: "Interpréter la moyenne dans le contexte." },
    ],
    interaction: dispersionInteraction,
    corrections: [
      "La solution de l'exercice de fixation, page 5, calcule seulement E(X)=100 alors que l'énoncé demande aussi l'écart type. Le calcul complet donne V(X)=197500 et σ(X)=50√79≈444,41.",
      "La dernière phrase de l'exercice 1, page 10, est tronquée après « Le joueur doit payer 1800 F lors ». Il faut lire « lorsqu'il n'obtient que des PILE ».",
      "Dans l'exercice des morceaux, page 11, les probabilités doivent compter les morceaux équiprobables, pas utiliser leur durée comme poids. L'espérance correcte est 250 s, non 1268/5 s.",
    ],
    questions: [
      choice("Quelle formule calcule l'espérance ?", ["$E(X)=\\sum x_ip_i$", "$E(X)=\\sum p_i^2$", "$E(X)=\\sqrt{V(X)}$", "$E(X)=\\sum(x_i-E(X))$"], 0, "L'espérance est la somme des valeurs pondérées par leurs probabilités.", "Définition • page 5"),
      choice("Quelle formule rapide calcule la variance ?", ["$V(X)=E(X^2)-E(X)^2$", "$V(X)=E(X^2)+E(X)^2$", "$V(X)=\\sqrt{E(X)}$", "$V(X)=E(X)$"], 0, "C'est la formule donnée dans la remarque du cours.", "Remarque • page 5", 2),
      short("Pour la loi officielle $(-1000,100,300,600)$, calcule $E(X)$.", ["100", "+100", "100F", "100 F"], "La somme pondérée vaut 100.", "Exercice de fixation • page 5", 2),
      short("Calcule $E(X^2)$ pour cette loi.", ["207500", "+207500"], "On pondère les carrés des quatre valeurs : le résultat est 207500.", "Exercice de fixation complété • page 5", 3),
      short("Déduis $V(X)$.", ["197500", "+197500"], "$207500-100^2=197500$.", "Exercice de fixation complété • page 5", 3),
      short("Donne l'écart type exact.", ["50sqrt79", "50√79", "sqrt197500", "√197500"], "$\\sqrt{197500}=50\\sqrt{79}$.", "Exercice de fixation complété • page 5", 3),
      short("Donne l'écart type arrondi au centième.", ["444,41", "444.41"], "$50\\sqrt{79}\\approx444{,}41$.", "Exercice de fixation complété • page 5", 2),
      choice("Si X est un gain et $E(X)>0$, le jeu est :", ["avantageux pour le joueur", "équitable", "désavantageux pour le joueur", "impossible"], 0, "Le gain moyen est positif.", "Interprétation • page 5"),
      short("Renforcement 1 : calcule $P(X<300)$.", ["1/2", "0,5", "0.5"], "$P(X=-1000)+P(X=100)=1/8+3/8=1/2$.", "Renforcement 1 • page 9", 2),
      short("Quelle est l'espérance du gain dans ce jeu ?", ["100", "+100", "100F", "100 F"], "Le calcul officiel donne 100 F.", "Renforcement 1 • page 9", 2),
      truth("Ce jeu est favorable au joueur.", true, "$E(X)=100>0$.", "Renforcement 1 • page 9"),
      short("Quelle perte S rend le jeu équitable en cas de trois PILE ?", ["1800", "1800F", "1800 F"], "L'équation $(-S+1800)/8=0$ donne S=1800.", "Renforcement 1 • pages 9-10", 3),
      short("Morceaux : calcule la probabilité correcte d'une durée de 240 s.", ["3/10", "0,3", "0.3"], "Trois morceaux sur dix durent 240 secondes.", "Renforcement 3 corrigé • pages 10-11"),
      short("Calcule la probabilité correcte d'une durée supérieure à 220 s.", ["4/5", "0,8", "0.8", "8/10"], "Seuls les deux morceaux de 200 s sont exclus : 8/10=4/5.", "Renforcement 3 corrigé • pages 10-11", 2),
      short("Calcule l'espérance correcte de la durée.", ["250", "250s", "250 s"], "La somme des dix durées vaut 2500 s, donc la moyenne équiprobable vaut 250 s.", "Renforcement 3 corrigé • page 11", 3),
      choice("Pourquoi le calcul $P(A)=280/2500$ est-il incorrect ?", ["Parce que les morceaux, et non les secondes, sont équiprobables", "Parce que 280 est trop grand", "Parce qu'une probabilité doit dépasser 1", "Parce que les durées sont toutes égales"], 0, "Chaque code A à J a la probabilité 1/10 ; la durée est la valeur de X.", "Renforcement 3 corrigé • page 11", 2),
      truth("L'écart type s'exprime dans la même unité que X.", true, "La racine carrée de la variance ramène à l'unité initiale.", "Interprétation des paramètres"),
      truth("Une variance peut être négative.", false, "C'est une somme pondérée de carrés, donc V(X)≥0.", "Définition • page 5"),
    ],
  },
  {
    id: "bernoulli-binomial",
    title: "Modéliser un schéma de Bernoulli",
    summary:
      "Identifier succès et échec, vérifier la répétition indépendante puis calculer la probabilité d'exactement k succès.",
    pages: "6",
    section: "II-3. Schéma de Bernoulli",
    durationMinutes: 35,
    body: String.raw`## 1. Épreuve de Bernoulli

Une **épreuve de Bernoulli** est une expérience aléatoire qui ne conduit qu'à deux résultats exclusifs :

- le **succès** S, de probabilité $p$ ;
- l'**échec** $\overline S$, de probabilité $1-p$.

Le mot « succès » est un choix de modélisation : il peut désigner « obtenir 6 », « rencontrer un feu vert » ou « réaliser un bénéfice ».

## 2. Schéma de Bernoulli

Un schéma de Bernoulli répète $n$ fois la **même** épreuve :

- avec la même définition du succès ;
- avec la même probabilité $p$ ;
- de façon indépendante.

Le document pose $n\ge2$. Les paramètres du schéma sont $n$ et $p$.

## 3. Exactement k succès

Pour obtenir exactement $k$ succès parmi $n$ épreuves :

$$P(\text{exactement }k\text{ succès})=\binom nkp^k(1-p)^{n-k}$$

Le coefficient $\binom nk$ choisit les positions des $k$ succès. Le produit $p^k(1-p)^{n-k}$ est la probabilité d'une disposition donnée.

## 4. Les deux exercices de fixation

### Un lancer de dé

Le succès « obtenir 6 » a la probabilité $p=1/6$ et l'échec $5/6$ : c'est une épreuve de Bernoulli.

### Cinq lancers

Le succès devient « obtenir 2 », toujours de probabilité $1/6$. Obtenir exactement quatre fois 2 parmi cinq lancers a pour probabilité :

$$\binom54\left(\frac16\right)^4\left(\frac56\right)=\frac{25}{7776}$$

> **Erreur fréquente.** $p^k(1-p)^{n-k}$ décrit une disposition précise. Sans $\binom nk$, on oublie toutes les autres positions possibles des succès.

> **Astuce mémoire de Davy.** **Choisir, réussir, échouer** : $\binom nk$ choisit les places, $p^k$ paie les succès, $(1-p)^{n-k}$ paie les échecs.` ,
    keyPoint: String.raw`P(K=k)=\binom nkp^k(1-p)^{n-k}.`,
    example: String.raw`\binom54(1/6)^4(5/6)=25/7776.`,
    methodSteps: [
      "Définis clairement le succès S et calcule p.",
      "Vérifie que les n répétitions sont identiques et indépendantes.",
      "Repère k, puis remplace dans la formule en contrôlant l'exposant n-k.",
    ],
    timeline: [
      { label: "Succès", detail: "Choisir S et sa probabilité p." },
      { label: "Échec", detail: "Sa probabilité vaut 1-p." },
      { label: "Répéter", detail: "Même épreuve, n fois, indépendamment." },
      { label: "Compter", detail: "Le coefficient binomial place les k succès." },
    ],
    interaction: bernoulliInteraction,
    questions: [
      choice("Une épreuve de Bernoulli comporte :", ["deux issues exclusives", "trois issues équiprobables", "une infinité d'issues", "toujours un dé"], 0, "Elle oppose un succès et un échec.", "Définition • page 6"),
      short("Pour le succès « obtenir 6 » avec un dé équilibré, donne p.", ["1/6", "0,1667", "0.1667"], "Une face favorable sur six.", "Exercice de fixation • page 6"),
      short("Donne la probabilité de l'échec.", ["5/6", "0,8333", "0.8333"], "$1-1/6=5/6$.", "Exercice de fixation • page 6"),
      truth("Le lancer d'un dé, lorsqu'on distingue « obtenir 6 » et « ne pas obtenir 6 », est une épreuve de Bernoulli.", true, "On a exactement deux résultats exclusifs dans cette modélisation.", "Exercice de fixation • page 6"),
      choice("Pour former un schéma de Bernoulli, les répétitions doivent être :", ["identiques et indépendantes", "toutes différentes", "sans échec", "de probabilités croissantes"], 0, "Ce sont les deux conditions essentielles.", "Définition • page 6", 2),
      choice("Dans cinq lancers, combien de positions possibles pour quatre succès ?", ["$\\binom54=5$", "$4^5$", "$5^4$", "$\\binom45=0$"], 0, "L'unique échec peut occuper l'une des cinq positions.", "Exercice de fixation • page 6", 2),
      choice("Quelle formule correspond à exactement quatre fois le chiffre 2 ?", ["$\\binom54(1/6)^4(5/6)$", "$(1/6)^5$", "$4(1/6)(5/6)$", "$\\binom54(5/6)^4(1/6)$"], 0, "Il y a quatre succès de probabilité 1/6 et un échec.", "Exercice de fixation • page 6", 2),
      short("Calcule la valeur exacte de cette probabilité.", ["25/7776", "0,003215", "0.003215"], "$5\\times(1/6)^4\\times(5/6)=25/7776$.", "Exercice de fixation • page 6", 3),
      choice("Dans $\\binom nkp^k(1-p)^{n-k}$, l'exposant de la probabilité d'échec est :", ["$n-k$", "$k$", "$n$", "$n+k$"], 0, "Sur n épreuves, les n-k restantes sont des échecs.", "Propriété • page 6"),
      truth("Le mot succès désigne nécessairement un résultat favorable au joueur.", false, "C'est seulement l'événement que l'on décide de compter.", "Interprétation de Bernoulli"),
      short("Pour $n=6$ et $k=2$, combien vaut $n-k$ ?", ["4", "+4"], "Il y a quatre échecs.", "Application de la propriété"),
      choice("Pourquoi multiplie-t-on par $\\binom nk$ ?", ["Pour compter les positions possibles des succès", "Pour rendre la probabilité supérieure à 1", "Pour calculer l'espérance", "Pour supprimer les échecs"], 0, "Chaque choix de k positions produit une disposition de même probabilité.", "Méthode • page 6", 2),
      truth("Si la probabilité du succès change d'une répétition à l'autre, la formule binomiale du cours ne s'applique pas directement.", true, "Les épreuves ne sont plus identiques de paramètre p constant.", "Condition d'application"),
    ],
  },
  {
    id: "binomial-parameters",
    title: "Calculer avec une loi binomiale",
    summary:
      "Reconnaître une loi binomiale, calculer ses probabilités et paramètres, puis traiter « au moins un » par l'événement contraire.",
    pages: "6-7 et 11-13",
    section: "II-4. Loi binomiale et applications",
    durationMinutes: 55,
    body: String.raw`## 1. Définition

Dans un schéma de Bernoulli à $n$ épreuves de paramètre $p$, soit X le **nombre de succès**. Alors X suit la loi binomiale de paramètres $n$ et $p$ :

$$X\sim\mathcal B(n,p)$$

Ses valeurs sont $0,1,\ldots,n$ et :

$$P(X=k)=\binom nkp^k(1-p)^{n-k}$$

## 2. Espérance et variance

$$E(X)=np\qquad\text{et}\qquad V(X)=np(1-p)$$

L'espérance est le nombre moyen de succès sur un grand nombre de séries de n épreuves.

## 3. Feu tricolore

La probabilité de rencontrer le feu vert est $p=3/4$ et l'automobiliste passe cinq fois. Donc :

$$X\sim\mathcal B\left(5,\frac34\right)$$

$$P(X=3)=\binom53\left(\frac34\right)^3\left(\frac14\right)^2=\frac{270}{1024}\approx0{,}26$$

$$E(X)=\frac{15}{4}=3{,}75\approx4,\qquad V(X)=\frac{15}{16}$$

L'arrondi signifie qu'il rencontre en moyenne environ 4 feux verts sur 5 passages.

## 4. Restaurant de Mariam

Le niveau précédent a établi $P(B)=0{,}58$. En supposant les résultats des jours **indépendants** et cette probabilité stable, le nombre X de jours bénéficiaires parmi trois suit :

$$X\sim\mathcal B(3,0{,}58)$$

| k | 0 | 1 | 2 | 3 |
|---:|---:|---:|---:|---:|
| $P(X=k)$ | 0,074088 | 0,306936 | 0,423864 | 0,195112 |
| arrondi à $10^{-3}$ | 0,074 | 0,307 | 0,424 | 0,195 |

$$E(X)=3\times0{,}58=1{,}74$$

## 5. Au moins un bénéfice en n jours

Il est plus rapide de passer par l'événement contraire « aucun bénéfice » :

$$P_n=1-P(X=0)=1-(1-0{,}58)^n=1-(0{,}42)^n$$

La condition $P_n\ge0{,}9999$ équivaut à $(0{,}42)^n\le0{,}0001$, donc :

$$n\ge\frac{\ln(0{,}0001)}{\ln(0{,}42)}\approx10{,}61$$

Le plus petit entier est $n=11$.

> **Précision nécessaire.** Le document utilise une loi binomiale pour les jours successifs sans énoncer l'indépendance des bénéfices. Cette hypothèse est indispensable et est donc rendue explicite ici.

> **Astuce mémoire de Davy.** « Au moins un » se calcule souvent plus vite par **1 - aucun**.` ,
    keyPoint: String.raw`X\sim\mathcal B(n,p):\quad E(X)=np,\quad V(X)=np(1-p).`,
    example: String.raw`X\sim\mathcal B(5,3/4)\Longrightarrow E(X)=15/4,\;V(X)=15/16.`,
    methodSteps: [
      "Définis le succès et vérifie indépendance et probabilité constante.",
      "Identifie n, p et la variable X qui compte les succès.",
      "Utilise la formule de P(X=k), ou l'événement contraire pour « au moins un ».",
      "Calcule E(X)=np et V(X)=np(1-p), puis interprète dans le contexte.",
    ],
    timeline: [
      { label: "Reconnaître", detail: "n épreuves identiques et indépendantes." },
      { label: "Paramétrer", detail: "Écrire X~B(n,p)." },
      { label: "Calculer", detail: "P(X=k) avec le coefficient binomial." },
      { label: "Résumer", detail: "E=np et V=np(1-p)." },
      { label: "Complément", detail: "Au moins un = 1 - aucun." },
    ],
    interaction: binomialInteraction,
    corrections: [
      "Dans l'exercice d'approfondissement, pages 12-13, l'emploi d'une loi binomiale suppose que les résultats des jours successifs sont indépendants et que P(B)=0,58 reste constante. Cette hypothèse n'est pas écrite dans l'énoncé source ; elle est explicitée dans la leçon.",
    ],
    questions: [
      choice("Le nombre de feux verts rencontrés en cinq passages suit :", ["$\\mathcal B(5,3/4)$", "$\\mathcal B(3/4,5)$", "$\\mathcal B(5,1/4)$", "une loi uniforme"], 0, "Il y a cinq épreuves et le succès « feu vert » a la probabilité 3/4.", "Exercice de fixation • page 7", 2),
      choice("Quelle formule donne $P(X=3)$ ?", ["$\\binom53(3/4)^3(1/4)^2$", "$\\binom53(1/4)^3(3/4)^2$", "$(3/4)^5$", "$3(3/4)(1/4)$"], 0, "Trois succès et deux échecs parmi cinq passages.", "Exercice de fixation • page 7", 2),
      short("Donne la valeur exacte de $P(X=3)$ utilisée par le document.", ["270/1024", "135/512"], "Le produit vaut 270/1024, soit 135/512 après simplification.", "Exercice de fixation • page 7", 3),
      short("Donne son approximation au centième.", ["0,26", "0.26"], "$270/1024\\approx0{,}2637$.", "Exercice de fixation • page 7"),
      short("Calcule $E(X)$.", ["15/4", "3,75", "3.75"], "$5\\times3/4=15/4$.", "Exercice de fixation • page 7", 2),
      short("Calcule $V(X)$.", ["15/16", "0,9375", "0.9375"], "$5\\times(3/4)\\times(1/4)=15/16$.", "Exercice de fixation • page 7", 2),
      short("Quel entier obtient-on en arrondissant l'espérance à l'ordre zéro ?", ["4", "+4"], "$3{,}75$ s'arrondit à 4.", "Exercice de fixation • page 7"),
      choice("Que signifie cet arrondi ?", ["En moyenne environ 4 feux verts sur 5", "Toujours exactement 4 feux verts", "La probabilité du vert vaut 4", "Il y a 4 carrefours"], 0, "L'espérance est une moyenne, pas une certitude à chaque série.", "Exercice de fixation • page 7", 2),
      choice("Mariam : sous l'hypothèse d'indépendance, X suit :", ["$\\mathcal B(3,0{,}58)$", "$\\mathcal B(0{,}58,3)$", "$\\mathcal B(3,0{,}42)$", "une loi uniforme"], 0, "X compte les bénéfices sur trois jours, de probabilité 0,58 chacun.", "Approfondissement • pages 12-13", 2),
      choice("Quelles valeurs X peut-elle prendre ?", ["$\\{0,1,2,3\\}$", "$\\{1,2,3\\}$", "$\\{0,58;0,42\\}$", "$\\{0,1\\}$"], 0, "Elle peut réaliser un bénéfice zéro, une, deux ou trois fois.", "Approfondissement • page 13"),
      short("Calcule $P(X=0)$ avant arrondi.", ["0,074088", "0.074088"], "$(0{,}42)^3=0{,}074088$.", "Approfondissement • page 13", 2),
      short("Calcule $P(X=1)$ avant arrondi.", ["0,306936", "0.306936"], "$3(0{,}58)(0{,}42)^2=0{,}306936$.", "Approfondissement • page 13", 2),
      short("Calcule $P(X=2)$ avant arrondi.", ["0,423864", "0.423864"], "$3(0{,}58)^2(0{,}42)=0{,}423864$.", "Approfondissement • page 13", 2),
      short("Calcule $P(X=3)$ avant arrondi.", ["0,195112", "0.195112"], "$(0{,}58)^3=0{,}195112$.", "Approfondissement • page 13", 2),
      short("Donne $E(X)$.", ["1,74", "1.74"], "$3\\times0{,}58=1{,}74$.", "Approfondissement • page 13", 2),
      choice("La formule de la probabilité d'au moins un bénéfice en n jours est :", ["$1-(0{,}42)^n$", "$(0{,}58)^n$", "$1-(0{,}58)^n$", "$n(0{,}42)$"], 0, "On retranche la probabilité d'aucun bénéfice.", "Approfondissement • page 13", 2),
      short("Quel est le plus petit n tel que cette probabilité soit au moins 0,9999 ?", ["11", "+11"], "Le seuil logarithmique vaut environ 10,61 ; le plus petit entier est 11.", "Approfondissement • page 13", 3),
      truth("L'indépendance des jours est nécessaire pour appliquer la loi binomiale.", true, "Sans elle, le produit des probabilités et la formule binomiale ne sont pas justifiés.", "Précision sur l'approfondissement"),
      choice("Pour une loi $\\mathcal B(n,p)$, l'ensemble des valeurs possibles est :", ["$\\{0,1,\\ldots,n\\}$", "$\\{p,1-p\\}$", "$\\mathbb R$", "$\\{1,\\ldots,n-1\\}$"], 0, "X compte le nombre de succès parmi n épreuves.", "Définition • page 6"),
      choice("Pour calculer « au moins un succès », la méthode la plus rapide est :", ["$1-P(X=0)$", "$P(X=1)$", "$1-P(X=n)$", "$np$"], 0, "Le contraire de « au moins un » est « aucun ».", "Méthode de l'approfondissement", 2),
    ],
  },
  {
    id: "cumulative-distribution",
    title: "Lire et tracer une fonction de répartition",
    summary:
      "Cumuler les probabilités d'une loi discrète, écrire la fonction par intervalles et interpréter ses sauts.",
    pages: "7-8",
    section: "II-5. Fonction de répartition",
    durationMinutes: 38,
    kind: "challenge",
    body: String.raw`## 1. Définition

Soit X une variable aléatoire. Sa **fonction de répartition** est l'application $F:\mathbb R\to[0,1]$ définie par :

$$F(x)=P(X\le x)$$

Elle cumule les probabilités de toutes les valeurs de X inférieures ou égales à x.

## 2. Propriétés d'une loi discrète

- $F$ est croissante ;
- $0\le F(x)\le1$ ;
- $F$ est constante entre deux valeurs possibles de X ;
- à chaque valeur $x_i$, elle effectue un saut de hauteur $P(X=x_i)$ ;
- elle est continue à droite : la valeur du saut appartient au palier situé à droite.

## 3. Exercice du document

La loi est :

| $x_i$ | -1000 | 100 | 300 | 600 |
|---|---:|---:|---:|---:|
| $P(X=x_i)$ | $1/8$ | $3/8$ | $3/8$ | $1/8$ |

Les cumuls successifs sont $1/8$, $1/2$, $7/8$ puis 1. Ainsi :

$$F(x)=
\begin{cases}
0&\text{si }x<-1000,\\
\frac18&\text{si }-1000\le x<100,\\
\frac12&\text{si }100\le x<300,\\
\frac78&\text{si }300\le x<600,\\
1&\text{si }x\ge600.
\end{cases}$$

Le graphique est une fonction en escalier. Le point de gauche d'un palier est inclus, le point de droite appartient au palier suivant.

## 4. Retrouver des probabilités avec F

La fonction de répartition ne sert pas seulement à tracer. Elle permet par exemple :

$$P(a<X\le b)=F(b)-F(a)$$

Dans la loi du document :

$$P(100<X\le600)=F(600)-F(100)=1-\frac12=\frac12$$

et la hauteur d'un saut redonne la masse ponctuelle :

$$P(X=300)=F(300)-\lim_{x\to300^-}F(x)=\frac78-\frac12=\frac38$$

> **Correction de structure.** Le titre « 2.5 Fonction de répartition » de la page 7 est une numérotation accidentelle. Il s'agit de la cinquième sous-partie de la partie II : « 5. Fonction de répartition ».

> **Astuce mémoire de Davy.** F signifie **Foule cumulée** : en avançant de gauche à droite, personne ne sort de la somme, donc F ne peut que monter.` ,
    keyPoint: String.raw`F(x)=P(X\le x).`,
    example: String.raw`F(300)=1/8+3/8+3/8=7/8.`,
    methodSteps: [
      "Range les valeurs de X dans l'ordre croissant.",
      "Calcule les sommes cumulées des probabilités.",
      "Écris un intervalle par palier, avec la borne gauche incluse.",
      "Trace les segments horizontaux et place les sauts aux valeurs de X.",
    ],
    timeline: [
      { label: "Trier", detail: "Ordonner les valeurs possibles de X." },
      { label: "Cumuler", detail: "Ajouter successivement les probabilités." },
      { label: "Découper", detail: "Un intervalle constant entre deux valeurs." },
      { label: "Tracer", detail: "Fonction croissante en escalier." },
      { label: "Relire", detail: "Une différence de cumuls redonne une probabilité." },
    ],
    interaction: cumulativeInteraction,
    corrections: [
      "Le titre « 2.5 Fonction de répartition » de la page 7 est une erreur de numérotation ; la structure du cours appelle « 5. Fonction de répartition ».",
    ],
    questions: [
      choice("Quelle est la définition de F ?", ["$F(x)=P(X\\le x)$", "$F(x)=P(X=x)$", "$F(x)=P(X>x)$", "$F(x)=E(X)$"], 0, "F cumule toutes les probabilités jusqu'à x inclus.", "Définition • page 7", 2),
      short("Calcule $F(-1200)$.", ["0", "+0"], "Aucune valeur de X n'est inférieure ou égale à -1200.", "Exercice de fixation • pages 7-8"),
      short("Calcule $F(-1000)$.", ["1/8", "0,125", "0.125"], "Le premier saut vaut P(X=-1000)=1/8.", "Exercice de fixation • pages 7-8", 2),
      short("Calcule $F(99)$.", ["1/8", "0,125", "0.125"], "99 appartient au palier [-1000,100[.", "Exercice de fixation • pages 7-8"),
      short("Calcule $F(100)$.", ["1/2", "0,5", "0.5"], "On ajoute la masse 3/8 au cumul 1/8.", "Exercice de fixation • pages 7-8", 2),
      short("Calcule $F(299)$.", ["1/2", "0,5", "0.5"], "299 appartient au palier [100,300[.", "Exercice de fixation • pages 7-8"),
      short("Calcule $F(300)$.", ["7/8", "0,875", "0.875"], "$1/8+3/8+3/8=7/8$.", "Exercice de fixation • pages 7-8", 2),
      short("Calcule $F(599)$.", ["7/8", "0,875", "0.875"], "599 appartient au palier [300,600[.", "Exercice de fixation • pages 7-8"),
      short("Calcule $F(600)$.", ["1", "+1"], "Toutes les probabilités ont été cumulées.", "Exercice de fixation • page 8", 2),
      truth("Une fonction de répartition est croissante.", true, "Lorsque x augmente, l'événement (X≤x) ne peut que gagner des issues.", "Remarque • page 8"),
      truth("Pour une loi discrète finie, F est une fonction en escalier.", true, "Elle reste constante entre deux valeurs prises par X.", "Remarque • page 8"),
      choice("La hauteur du saut en 300 vaut :", ["$3/8$", "$7/8$", "$1/2$", "$1/8$"], 0, "$F(300)-F(300^-)=7/8-1/2=3/8$.", "Lecture du graphique • page 8", 2),
      short("Calcule $P(100<X\\le600)$ avec F.", ["1/2", "0,5", "0.5"], "$F(600)-F(100)=1-1/2=1/2$.", "Prolongement pédagogique du graphique", 2),
      choice("Sur quel intervalle F vaut-elle $7/8$ ?", ["$[300;600[$", "$[100;300[$", "$[-1000;100[$", "$[600;+\\infty[$"], 0, "Le cumul atteint 7/8 en 300 et change de nouveau en 600.", "Exercice de fixation • pages 7-8", 2),
      choice("Quelle écriture traduit la continuité à droite en 100 ?", ["$F(100)=1/2$", "$F(100)=1/8$", "$F(100)=0$", "$F(100)=1$"], 0, "La masse en 100 est déjà incluse dans P(X≤100).", "Lecture correcte des paliers"),
      short("Quelle est la limite de F lorsque $x\\to+\\infty$ ?", ["1", "+1"], "À droite de toutes les valeurs, toutes les issues sont cumulées.", "Propriété de la fonction de répartition"),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCProbabilityPath: LearningPath = {
  id: "terminale-c-math-l17-probability",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 5, title: "Modélisation d'un phénomène aléatoire" },
  chapterNumber: 17,
  title: "Probabilité conditionnelle et variable aléatoire",
  description:
    "Conditionnement, indépendance, arbres pondérés, probabilités totales, variables aléatoires, paramètres, Bernoulli, loi binomiale et fonction de répartition.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer une probabilité conditionnelle et une intersection",
    "Tester l'indépendance de deux événements",
    "Construire un arbre pondéré et appliquer les probabilités totales",
    "Établir la loi d'une variable aléatoire finie",
    "Calculer et interpréter espérance, variance et écart type",
    "Reconnaître un schéma de Bernoulli et une loi binomiale",
    "Calculer une probabilité binomiale et ses paramètres",
    "Déterminer et représenter une fonction de répartition",
  ],
  modules: [
    {
      id: "terminale-c-math-l17-probability-mastery",
      title: "Maîtriser la probabilité conditionnelle et la variable aléatoire",
      description:
        "Huit niveaux progressifs, " +
        builtLevels.reduce((sum, lesson) => sum + (lesson.questions?.length ?? 0), 0) +
        " réponses évaluables, des arbres et schémas interactifs, et les corrections explicites des erreurs du document.",
      lessons: builtLevels,
    },
  ],
};
