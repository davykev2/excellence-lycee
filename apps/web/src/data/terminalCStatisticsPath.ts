import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 19 Statistiques.pdf";

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
      eyebrow: "Niveau " + (index + 1) + " • Cours officiel",
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      notationTex: seed.keyPoint,
      example: "$$" + seed.example + "$$",
    },
    interaction: seed.interaction ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Reconstruis la démarche",
      instruction: "Parcours les étapes dans l’ordre avant de lancer les exercices officiels.",
      observation:
        "Une étude statistique fiable sépare toujours les données, les calculs, l’interprétation et la prévision.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: "Réussir : " + seed.title.toLocaleLowerCase("fr"),
      introduction:
        "Organise les données dans un tableau, conserve les valeurs exactes dans la calculatrice et n’arrondis qu’à la fin.",
      steps: seed.methodSteps,
      example: {
        prompt: "Exemple guidé du document",
        work: "$$" + seed.example + "$$",
        result: "$$" + seed.keyPoint + "$$",
      },
      tip:
        seed.tip ??
        "Astuce mémoire de Davy : données, formule, calcul sans arrondir, puis phrase de conclusion — toujours dans cet ordre.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const scatterInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Nuage interactif",
  title: "Huit exploitations, huit points",
  instruction: "Sélectionne les repères pour lire la forme du nuage officiel.",
  observation:
    "Les points montent globalement de gauche à droite. Cette forme suggère une relation croissante et rend pertinent un ajustement affine.",
  viewBox: "0 0 640 360",
  caption: "Nuage redessiné d’après le tableau officiel des pages 3 et 4.",
  shapes: [
    { shape: "line", x1: 70, y1: 310, x2: 600, y2: 310, tone: "outline" },
    { shape: "line", x1: 70, y1: 310, x2: 70, y2: 28, tone: "outline" },
    { shape: "text", x: 604, y: 330, content: "X (ha)", anchor: "end" },
    { shape: "text", x: 82, y: 24, content: "Y", anchor: "start" },
    { shape: "circle", cx: 190, cy: 247, r: 7, tone: "accent" },
    { shape: "circle", cx: 190, cy: 193, r: 7, tone: "accent" },
    { shape: "circle", cx: 250, cy: 171, r: 7, tone: "fill" },
    { shape: "circle", cx: 310, cy: 180, r: 7, tone: "fill" },
    { shape: "circle", cx: 370, cy: 112, r: 7, tone: "fill" },
    { shape: "circle", cx: 430, cy: 130, r: 7, tone: "fill" },
    { shape: "circle", cx: 490, cy: 67, r: 7, tone: "fill" },
    { shape: "circle", cx: 526, cy: 85, r: 7, tone: "fill" },
    { shape: "line", x1: 172, y1: 231, x2: 538, y2: 66, tone: "soft" },
  ],
  hotspots: [
    {
      id: "same-x",
      number: 1,
      label: "Même abscisse",
      detail:
        "Les couples (2 ; 14) et (2 ; 26) donnent deux points distincts. Une valeur de X répétée ne supprime aucun individu.",
      x: 190,
      y: 220,
      highlight: [
        { shape: "circle", cx: 190, cy: 247, r: 12, tone: "accent" },
        { shape: "circle", cx: 190, cy: 193, r: 12, tone: "accent" },
      ],
    },
    {
      id: "trend",
      number: 2,
      label: "Tendance croissante",
      detail:
        "Le nuage est allongé selon une direction ascendante : quand X augmente, Y tend aussi à augmenter.",
      x: 430,
      y: 118,
      highlight: [{ shape: "line", x1: 172, y1: 231, x2: 538, y2: 66, tone: "accent" }],
    },
  ],
};

const meanPointInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Centre du nuage",
  title: "Construire le point moyen",
  instruction: "Explore les trois cartes puis vérifie les deux coordonnées séparément.",
  observation:
    "Le point moyen G est le centre de gravité du nuage. Toute droite de régression du cours passe par lui.",
  rootLabel: String.raw`$G(\overline X;\overline Y)$`,
  rootDetail: "Une moyenne pour les abscisses, une moyenne pour les ordonnées.",
  nodes: [
    {
      id: "x-mean",
      label: String.raw`$\overline X$`,
      role: "Moyenne des abscisses",
      detail: "Additionner tous les xᵢ, puis diviser par le nombre n de couples.",
      group: "Coordonnées",
    },
    {
      id: "y-mean",
      label: String.raw`$\overline Y$`,
      role: "Moyenne des ordonnées",
      detail: "Additionner tous les yᵢ, puis diviser par le même effectif n.",
      group: "Coordonnées",
    },
    {
      id: "check",
      label: "Contrôle",
      role: "La droite passe par G",
      detail: "Dans une équation y=ax+b, remplacer x par X̄ doit redonner Ȳ.",
      group: "Vérification",
    },
  ],
};

const covarianceInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Sens de variation",
  title: "Lire la covariance",
  instruction: "Sélectionne chaque cas et relie le signe à la forme du nuage.",
  observation:
    "La covariance donne le sens global de la relation, mais sa valeur dépend des unités : elle ne mesure pas seule l’intensité du lien.",
  rootLabel: String.raw`$\operatorname{Cov}(X,Y)$`,
  rootDetail: "Moyenne des produits moins produit des moyennes.",
  nodes: [
    {
      id: "positive",
      label: String.raw`$\operatorname{Cov}>0$`,
      role: "Variation dans le même sens",
      detail: "Quand X augmente, Y tend à augmenter : nuage globalement ascendant.",
      group: "Signe",
    },
    {
      id: "negative",
      label: String.raw`$\operatorname{Cov}<0$`,
      role: "Variation en sens contraire",
      detail: "Quand X augmente, Y tend à diminuer : nuage globalement descendant.",
      group: "Signe",
    },
    {
      id: "zero",
      label: String.raw`$\operatorname{Cov}\approx0$`,
      role: "Pas de tendance linéaire nette",
      detail: "Cela n’exclut pas une relation non linéaire : il faut toujours observer le nuage.",
      group: "Prudence",
    },
  ],
};

const correlationInteraction: LessonInteraction = {
  kind: "diagram",
  eyebrow: "Échelle de corrélation",
  title: "Interpréter le coefficient r",
  instruction: "Explore le signe, la valeur absolue et le seuil pratique utilisé dans le document.",
  observation:
    "Le signe indique le sens de la relation ; la valeur absolue indique sa force. On compare donc |r| au seuil, jamais r seul.",
  rootLabel: String.raw`$-1\le r\le1$`,
  rootDetail: "Coefficient sans unité, de même signe que la covariance.",
  nodes: [
    {
      id: "sign",
      label: "Signe de r",
      role: "Sens de la relation",
      detail: "r positif : tendance croissante ; r négatif : tendance décroissante.",
      group: "Lecture",
    },
    {
      id: "absolute",
      label: "$|r|$",
      role: "Force de la relation",
      detail: "Plus |r| est proche de 1, plus les points sont proches d’une droite.",
      group: "Lecture",
    },
    {
      id: "threshold",
      label: String.raw`$|r|\ge0{,}87$`,
      role: "Forte corrélation",
      detail: "C’est le seuil pratique retenu par le document pour autoriser un ajustement linéaire.",
      group: "Décision",
    },
  ],
};

const regressionInteraction: LessonInteraction = {
  kind: "curve",
  eyebrow: "Droite de régression",
  title: "La tendance des exploitations agricoles",
  instruction: "Déplace le point et vérifie que la droite passe par G(4,575 ; 36).",
  observation:
    "Avec les valeurs exactes, la droite de Y en X est y ≈ 5,685x + 9,991. Le document arrondit la pente avant de calculer b et affiche y = 5,69x + 9,97.",
  formula: "y ≈ 5,685x + 9,991",
  formulaTex: String.raw`y\approx5{,}685x+9{,}991`,
  rule: { kind: "linear", coefficient: 5.6851268, constant: 9.9905448 },
  window: { xMin: 0, xMax: 11, yMin: 0, yMax: 75 },
  guides: [
    { kind: "vertical", value: 4.575, label: "x = X̄" },
    { kind: "horizontal", value: 36, label: "y = Ȳ" },
  ],
  marker: { min: 0, max: 11, step: 0.05, initial: 4.575 },
};

const estimationInteraction: LessonInteraction = {
  kind: "curve",
  eyebrow: "Mission d’estimation",
  title: "Combien de travailleurs pour 16 hectares ?",
  instruction: "Déplace le point vers y = 16 : lis l’abscisse x correspondant au nombre de travailleurs.",
  observation:
    "La droite corrigée y ≈ 1,277x + 0,568 atteint 16 ha pour x ≈ 12,09. On prévoit donc environ 12 travailleurs.",
  formula: "y ≈ 1,277x + 0,568",
  formulaTex: String.raw`y\approx1{,}277x+0{,}568`,
  rule: { kind: "linear", coefficient: 1.2767528, constant: 0.5682657 },
  window: { xMin: 0, xMax: 15, yMin: 0, yMax: 20 },
  guides: [
    { kind: "horizontal", value: 16, label: "y = 16 ha" },
    { kind: "vertical", value: 12.09, label: "x ≈ 12,09" },
  ],
  marker: { min: 0, max: 15, step: 0.05, initial: 12.1 },
};

const levels: OfficialLevelSeed[] = [
  {
    id: "scatter-plot",
    title: "Série double, marges et nuage de points",
    summary:
      "Lire un tableau de contingence, calculer ses séries marginales et représenter chaque couple par un point.",
    pages: "1-4",
    section: "I-1 à I-3. Série statistique double, séries marginales et nuage de points",
    durationMinutes: 28,
    body: String.raw`## 1. Série statistique double

On observe deux caractères **quantitatifs** $X$ et $Y$ sur une même population de $n$ individus.

- $x_1,x_2,\ldots,x_p$ sont les modalités de $X$ ;
- $y_1,y_2,\ldots,y_q$ sont les modalités de $Y$ ;
- $n_{ij}$ est l’**effectif du couple** $(x_i,y_j)$.

Une série statistique double est l’ensemble des triplets :

$$\left(x_i,y_j,n_{ij}\right).$$

## 2. Tableau de contingence

Le document étudie 100 ménages. $X$ désigne le nombre d’enfants et $Y$ le nombre de pièces du logement.

| $Y\backslash X$ | 0 | 1 | 2 | 3 | 4 | 5 | **Total** |
|---|---:|---:|---:|---:|---:|---:|---:|
| **1** | 6 | 4 | 1 | 0 | 0 | 0 | **11** |
| **2** | 3 | 11 | 10 | 5 | 1 | 0 | **30** |
| **3** | 1 | 3 | 16 | 13 | 4 | 1 | **38** |
| **4** | 0 | 1 | 3 | 5 | 8 | 4 | **21** |
| **Total** | **10** | **19** | **30** | **23** | **13** | **5** | **100** |

Par exemple, $n_{21}=4$ : quatre ménages ont un enfant et occupent un logement d’une pièce. À l’intersection de $X=2$ et $Y=4$, on lit $3$ ménages.

## 3. Séries et fréquences marginales

La **série marginale de $X$** s’obtient en totalisant les colonnes :

| $x_i$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---:|---:|---:|---:|---:|---:|
| $n_i$ | 10 | 19 | 30 | 23 | 13 | 5 |

La **série marginale de $Y$** s’obtient en totalisant les lignes :

| $y_j$ | 1 | 2 | 3 | 4 |
|---|---:|---:|---:|---:|
| $n_j$ | 11 | 30 | 38 | 21 |

Une fréquence marginale vaut l’effectif de la modalité divisé par l’effectif total : $f_i=n_i/n$. Ainsi, la fréquence de $X=2$ vaut $30/100=0{,}30$.

## 4. Nuage de points

Lorsque chaque couple a pour effectif $1$, chaque couple $(x_i,y_i)$ devient un point $M_i(x_i;y_i)$ du repère.

Le tableau officiel des exploitations est :

| Superficie $X$ | 2 | 2 | 3 | 4 | 5 | 6 | 7 | 7,6 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Nombre d’exploitations $Y$ | 14 | 26 | 31 | 29 | 44 | 40 | 54 | 50 |

Il produit les huit points $(2;14)$, $(2;26)$, $(3;31)$, $(4;29)$, $(5;44)$, $(6;40)$, $(7;54)$ et $(7{,}6;50)$.

> **Erreur fréquente.** Deux points peuvent avoir la même abscisse. Ici $(2;14)$ et $(2;26)$ sont deux observations distinctes : il ne faut pas les fusionner.

> **Astuce mémoire de Davy.** « Tableau → couples → points. » Une colonne du tableau devient un point du nuage ; la forme générale du nuage indique ensuite si une droite peut résumer la tendance.`,
    keyPoint: String.raw`f_i=\frac{n_i}{n}\qquad M_i(x_i;y_i)`,
    example: String.raw`n(X=2,Y=4)=3\qquad f(X=2)=\frac{30}{100}=0{,}30`,
    methodSteps: [
      "Repère la ligne et la colonne du couple demandé dans le tableau de contingence.",
      "Additionne les colonnes pour la marge de X et les lignes pour la marge de Y.",
      "Place un point par couple, avec X en abscisse et Y en ordonnée.",
      "Décris la direction et la dispersion du nuage sans encore conclure à une causalité.",
    ],
    timeline: [
      { label: "Contingence", detail: "Chaque case contient l’effectif d’un couple de modalités." },
      { label: "Marges", detail: "Les totaux du bord donnent les séries marginales." },
      { label: "Nuage", detail: "Chaque couple d’effectif 1 devient un point du repère." },
    ],
    interaction: scatterInteraction,
    corrections: [
      "La couverture du PDF porte « Leçon 11 » alors que le fichier et le catalogue officiel du projet classent ce document en leçon 19. Le contenu est conservé sous l’identifiant stable de la leçon 19.",
    ],
    questions: [
      choice("Une série statistique double est l’ensemble :", ["des valeurs de X seulement", "des triplets $(x_i,y_j,n_{ij})$", "des effectifs seulement", "des moyennes de X et Y"], 1, "La définition associe les deux modalités et l’effectif du couple.", "Définition • page 1"),
      short("Quel est l’effectif du couple $(X=1;Y=1)$ dans le tableau des ménages ?", ["4"], "À l’intersection de la colonne X=1 et de la ligne Y=1, on lit 4.", "Exemple • page 2"),
      short("Combien de ménages ont deux enfants et occupent un logement de quatre pièces ?", ["3"], "La case X=2, Y=4 contient 3.", "Exemple • page 2"),
      choice("Comment appelle-t-on le tableau à double entrée du document ?", ["Tableau de variations", "Tableau de contingence", "Tableau de signes", "Histogramme"], 1, "C’est le nom donné juste après la lecture des couples.", "Définition • page 2"),
      short("Quel est l’effectif marginal de la modalité $X=0$ ?", ["10"], "$6+3+1+0=10$.", "Série marginale de X • page 2"),
      short("Quel est l’effectif marginal de la modalité $X=4$ ?", ["13"], "$0+1+4+8=13$.", "Série marginale de X • page 2"),
      short("Quel est l’effectif marginal de la modalité $Y=1$ ?", ["11"], "$6+4+1+0+0+0=11$.", "Série marginale de Y • pages 2-3"),
      short("Quel est l’effectif total de la population étudiée ?", ["100"], "La somme de chaque série marginale vaut 100.", "Tableau de contingence • page 2"),
      short("Donne la fréquence marginale de $X=2$ sous forme décimale.", ["0,3", "0.3", "0,30", "0.30"], "$30/100=0{,}30$.", "Fréquences marginales • page 3"),
      short("Donne la fréquence marginale de $Y=3$ sous forme décimale.", ["0,38", "0.38"], "$38/100=0{,}38$.", "Fréquences marginales • page 3"),
      short("Combien de points comporte le nuage des exploitations agricoles ?", ["8", "huit"], "Le tableau contient huit couples.", "Exercice de fixation • page 3"),
      choice("Que faut-il faire des deux couples ayant $X=2$ ?", ["Les remplacer par leur moyenne", "Ne garder que le premier", "Placer les deux points", "Les supprimer"], 2, "Les points (2;14) et (2;26) représentent deux observations distinctes.", "Exercice de fixation • pages 3-4", 2),
      truth("Dans la suite du document, chaque couple $(x_i,y_i)$ a pour effectif 1.", true, "C’est la remarque explicite de la page 4.", "Remarque • page 4"),
      choice("La forme du nuage officiel suggère une tendance :", ["globalement croissante", "globalement décroissante", "parfaitement horizontale", "sans aucun point"], 0, "Les points montent globalement de gauche à droite.", "Lecture du nuage • pages 3-4"),
    ],
  },
  {
    id: "mean-point",
    title: "Point moyen du nuage",
    summary: "Calculer séparément la moyenne des abscisses et celle des ordonnées pour obtenir G.",
    pages: "4, 9-10",
    section: "I-4. Point moyen ; exercices 1 et 3",
    durationMinutes: 24,
    body: String.raw`## Définition

Pour un nuage de $n$ points $M_i(x_i;y_i)$, le **point moyen** est :

$$G(\overline X;\overline Y)$$

avec

$$\overline X=\frac{x_1+x_2+\cdots+x_n}{n}\qquad\text{et}\qquad\overline Y=\frac{y_1+y_2+\cdots+y_n}{n}.$$

Pour les huit exploitations agricoles :

$$\overline X=\frac{36{,}6}{8}=4{,}575\qquad\overline Y=\frac{288}{8}=36.$$

Ainsi :

$$G(4{,}575;36).$$

## Deux exercices officiels à maîtriser

L’exercice 1 demande le point moyen de :

| $x_i$ | 1 | 4 | 7 | 8 | 10 |
|---|---:|---:|---:|---:|---:|
| $y_i$ | 2 | 7 | 8 | 10 | 13 |

L’exercice 3 partage six patients selon leur âge et leur tension artérielle systolique (TAS) :

| Âge | 26 | 39 | 40 | 50 | 53 | 56 |
|---|---:|---:|---:|---:|---:|---:|
| TAS | 128 | 126 | 118 | 136 | 142 | 145 |

Le premier groupe donne $G_1(35;124)$ et le second $G_2(53;141)$.

> **Erreur fréquente.** Le dénominateur est le nombre de couples, pas le nombre de valeurs distinctes. Dans la série principale, $X=2$ apparaît deux fois, mais il y a bien huit observations.

> **Astuce mémoire de Davy.** « G prend la moyenne de chaque axe. » Moyenne des x pour l’abscisse, moyenne des y pour l’ordonnée — ne les mélange jamais.`,
    keyPoint: String.raw`G\left(\overline X;\overline Y\right)`,
    example: String.raw`G\left(\frac{36{,}6}{8};\frac{288}{8}\right)=G(4{,}575;36)`,
    methodSteps: [
      "Compte le nombre n de couples.",
      "Additionne les abscisses et divise par n.",
      "Additionne les ordonnées et divise par n.",
      "Écris G(X̄ ; Ȳ) et contrôle l’ordre des coordonnées.",
    ],
    timeline: [
      { label: "Effectif", detail: "Compter tous les couples, répétitions comprises." },
      { label: "Deux moyennes", detail: "Calculer X̄ et Ȳ séparément." },
      { label: "Point G", detail: "Assembler les deux résultats dans le bon ordre." },
    ],
    interaction: meanPointInteraction,
    questions: [
      short("Pour les exploitations agricoles, calcule $\\overline X$.", ["4,575", "4.575"], "$36{,}6/8=4{,}575$.", "Exercice de fixation • page 4"),
      short("Pour la même série, calcule $\\overline Y$.", ["36"], "$288/8=36$.", "Exercice de fixation • page 4"),
      choice("Quel est le point moyen du nuage principal ?", ["$G(36;4{,}575)$", "$G(4{,}575;36)$", "$G(8;288)$", "$G(2;14)$"], 1, "L’abscisse est X̄ et l’ordonnée est Ȳ.", "Exercice de fixation • page 4"),
      short("Exercice 1 : calcule $\\overline X$ pour $1,4,7,8,10$.", ["6"], "$30/5=6$.", "Exercice 1 • page 9"),
      short("Exercice 1 : calcule $\\overline Y$ pour $2,7,8,10,13$.", ["8"], "$40/5=8$.", "Exercice 1 • page 9"),
      choice("Exercice 1 : quelles sont les coordonnées de G ?", ["$(8;6)$", "$(6;8)$", "$(5;40)$", "$(30;40)$"], 1, "On assemble les deux moyennes dans l’ordre X puis Y.", "Exercice 1 • page 9"),
      short("Exercice 3 : donne l’abscisse de $G_1$ pour les âges 26, 39 et 40.", ["35"], "$(26+39+40)/3=35$.", "Exercice 3 • page 9"),
      short("Exercice 3 : donne l’ordonnée de $G_1$ pour les TAS 128, 126 et 118.", ["124"], "$(128+126+118)/3=124$.", "Exercice 3 • page 9"),
      short("Exercice 3 : donne l’abscisse de $G_2$ pour les âges 50, 53 et 56.", ["53"], "$(50+53+56)/3=53$.", "Exercice 3 • pages 9-10"),
      short("Exercice 3 : donne l’ordonnée de $G_2$ pour les TAS 136, 142 et 145.", ["141"], "$(136+142+145)/3=141$.", "Exercice 3 • pages 9-10"),
      truth("Toute droite de régression calculée dans ce cours passe par le point moyen G.", true, "C’est une propriété de contrôle essentielle rappelée page 6.", "Remarques • page 6", 2),
    ],
  },
  {
    id: "covariance",
    title: "Covariance et sens de la relation",
    summary: "Calculer la moyenne des produits, retrancher le produit des moyennes et interpréter le signe.",
    pages: "4-5, 9-12",
    section: "II-1. Covariance ; exercices 2, 4 et 5",
    durationMinutes: 28,
    body: String.raw`## Ajustement linéaire

Faire un **ajustement** d’un nuage consiste à trouver une courbe qui passe le plus près possible du maximum de points. Lorsque cette courbe est une droite, l’ajustement est **affine** ou **linéaire**.

## Définition de la covariance

$$\operatorname{Cov}(X,Y)=\frac1n\sum_{i=1}^{n}(x_i-\overline X)(y_i-\overline Y)$$

La formule de calcul la plus pratique est :

$$\operatorname{Cov}(X,Y)=\frac{\sum x_iy_i}{n}-\overline X\,\overline Y.$$

Pour la série principale :

$$\sum x_iy_i=1503$$

donc

$$\operatorname{Cov}(X,Y)=\frac{1503}{8}-4{,}575\times36=23{,}675.$$

## Interpréter le signe

- covariance **positive** : $X$ et $Y$ tendent à varier dans le même sens ;
- covariance **négative** : ils tendent à varier en sens contraire ;
- covariance proche de zéro : pas de tendance linéaire nette.

La covariance n’est pas bornée et dépend des unités. Pour mesurer la force de la relation, il faudra la normaliser avec le coefficient $r$.

## Calcul exact dans l’exercice 5

Pour les travailleurs $X=(2,4,4,5,7,7,8,8)$ et les superficies $Y=(3,5,6,7,10,11,8,12)$ :

$$\overline X=5{,}625,\qquad \overline Y=7{,}75,\qquad \frac{\sum x_iy_i}{8}=49.$$

Ainsi :

$$\operatorname{Cov}(X,Y)=49-5{,}625\times7{,}75=5{,}40625\approx5{,}41.$$

> **Erreur fréquente.** Arrondir $\overline X$ à $5{,}63$ avant de calculer produit une covariance de $5{,}37$. Il faut garder $5{,}625$ dans la calculatrice et n’arrondir que le résultat final.

> **Astuce mémoire de Davy.** « Moyenne des produits moins produit des moyennes. » Cette phrase redonne directement la formule pratique.`,
    keyPoint: String.raw`\operatorname{Cov}(X,Y)=\frac{\sum x_iy_i}{n}-\overline X\,\overline Y`,
    example: String.raw`\operatorname{Cov}(X,Y)=\frac{1503}{8}-4{,}575\times36=23{,}675`,
    methodSteps: [
      "Calcule chaque produit xᵢyᵢ et leur somme.",
      "Divise cette somme par n.",
      "Retranche le produit exact X̄·Ȳ.",
      "Interprète seulement le signe, puis utilise r pour la force du lien.",
    ],
    timeline: [
      { label: "Produits", detail: "Former puis additionner tous les xᵢyᵢ." },
      { label: "Deux moyennes", detail: "Conserver X̄ et Ȳ sans arrondi prématuré." },
      { label: "Signe", detail: "Positif : même sens ; négatif : sens contraires." },
    ],
    interaction: covarianceInteraction,
    corrections: [
      "Dans l’exercice 5, l’énoncé annonce Cov(X,Y)=5,57, puis la correction affiche 5,37 après avoir arrondi X̄ à 5,63. Le calcul exact donne 5,40625, soit 5,41 à l’ordre 2.",
    ],
    questions: [
      choice("Quelle formule pratique donne la covariance ?", ["$\\frac{\\sum x_iy_i}{n}-\\overline X\\,\\overline Y$", "$\\frac{\\sum x_iy_i}{n}+\\overline X\\,\\overline Y$", "$\\overline X+\\overline Y$", "$\\frac{\\overline X}{\\overline Y}$"], 0, "C’est la seconde formule de la définition.", "Définition • page 5"),
      short("Pour la série principale, calcule $\\sum x_iy_i$.", ["1503"], "$2\\times14+\\cdots+7{,}6\\times50=1503$.", "Exercice de fixation • page 5", 2),
      short("Calcule la covariance de la série principale.", ["23,675", "23.675"], "$1503/8-4{,}575\\times36=23{,}675$.", "Exercice de fixation • page 5", 2),
      choice("Une covariance positive indique une tendance :", ["croissante", "décroissante", "toujours nulle", "sans aucun lien possible"], 0, "Les deux caractères tendent à augmenter ensemble.", "Interprétation du signe"),
      truth("La covariance est toujours comprise entre -1 et 1.", false, "C’est le coefficient r qui est borné entre -1 et 1.", "Précision de méthode"),
      short("Exercice 2 : calcule $\\sum x_iy_i$ pour les couples $(1;2),(4;7),(7;8),(8;10),(10;13)$.", ["296"], "$2+28+56+80+130=296$.", "Exercice 2 • page 9"),
      short("Exercice 2 : calcule la covariance sachant $\\overline X=6$ et $\\overline Y=8$.", ["11,2", "11.2"], "$296/5-6\\times8=11{,}2$.", "Exercice 2 • page 9", 2),
      short("Exercice 4 : calcule $\\overline X$ pour $X=0,1,\\ldots,8$.", ["4"], "$36/9=4$.", "Exercice 4 • page 10"),
      short("Exercice 4 : calcule $\\overline Y$.", ["60"], "$540/9=60$.", "Exercice 4 • page 10"),
      short("Exercice 4 : calcule $\\operatorname{Cov}(X,Y)$ à l’ordre 2.", ["-125,67", "-125.67", "−125,67"], "La valeur exacte est $-377/3\\approx-125{,}67$.", "Exercice 4 • page 10", 2),
      short("Exercice 5 : calcule la covariance exacte arrondie au centième.", ["5,41", "5.41"], "$49-5{,}625\\times7{,}75=5{,}40625\\approx5{,}41$.", "Exercice 5 • pages 11-12", 3),
      choice("Pourquoi la valeur 5,37 imprimée dans l’exercice 5 est-elle imprécise ?", ["La somme des produits est fausse", "La moyenne X̄ a été arrondie trop tôt", "Le nombre de couples vaut 9", "La covariance ne se calcule pas"], 1, "Le calcul remplace 5,625 par 5,63 avant la fin.", "Correction de calcul • page 12", 2),
    ],
  },
  {
    id: "correlation",
    title: "Coefficient de corrélation linéaire",
    summary: "Normaliser la covariance, interpréter le signe de r et mesurer la force de la liaison linéaire.",
    pages: "5-6, 10-12",
    section: "II-2. Coefficient de corrélation ; exercices 4 et 5",
    durationMinutes: 28,
    body: String.raw`## Variances

Les deux variances mesurent la dispersion de chaque caractère :

$$V(X)=\frac{\sum x_i^2}{n}-\overline X^2\qquad\text{et}\qquad V(Y)=\frac{\sum y_i^2}{n}-\overline Y^2.$$

## Coefficient de corrélation

$$r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)}\sqrt{V(Y)}}.$$

Propriétés du document :

- $-1\le r\le1$ ;
- $r$ a le même signe que la covariance ;
- plus $|r|$ est proche de $1$, plus le nuage est proche d’une droite ;
- le cours retient une **forte corrélation** lorsque $|r|\ge0{,}87$.

## Série principale

$$V(X)=\frac{200{,}76}{8}-4{,}575^2=4{,}164375$$

$$V(Y)=\frac{11626}{8}-36^2=157{,}25$$

$$r=\frac{23{,}675}{\sqrt{4{,}164375\times157{,}25}}\approx0{,}925.$$

Le document donne $r\approx0{,}92$ ; à l’ordre 2 avec les valeurs exactes, on obtient $0{,}93$. Dans les deux cas, la conclusion est la même : **forte corrélation positive**.

## Série décroissante de l’exercice 4

Pour $X=0,1,\ldots,8$ et $Y=(160,110,100,72,36,29,20,10,3)$ :

$$V(X)=\frac{20}{3}\approx6{,}67,\quad V(Y)=2570,\quad r\approx-0{,}96.$$

La relation est forte et **décroissante**.

## Exercice 5 — calcul sans arrondi prématuré

$$V(X)=4{,}234375\approx4{,}23,\qquad V(Y)=8{,}4375\approx8{,}44$$

$$r=\frac{5{,}40625}{\sqrt{4{,}234375\times8{,}4375}}\approx0{,}904\approx0{,}90.$$

> **Erreur fréquente.** Un coefficient négatif ne signifie pas « absence de corrélation ». On regarde $|r|$ pour la force, et le signe pour le sens.

> **Astuce mémoire de Davy.** « Le signe donne le sens ; la distance à 1 donne la force. »`,
    keyPoint: String.raw`r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)V(Y)}}\qquad -1\le r\le1`,
    example: String.raw`r\approx0{,}925\Rightarrow |r|\ge0{,}87\Rightarrow\text{forte corrélation}`,
    methodSteps: [
      "Calcule V(X), V(Y) et la covariance avec les valeurs exactes.",
      "Forme r et vérifie qu’il appartient à [-1;1].",
      "Lis le signe pour le sens de la relation.",
      "Compare |r| à 0,87 pour conclure sur la force de la corrélation.",
    ],
    timeline: [
      { label: "Dispersion", detail: "Calculer les deux variances." },
      { label: "Normalisation", detail: "Diviser la covariance par √V(X)V(Y)." },
      { label: "Conclusion", detail: "Signe = sens ; |r| = force." },
    ],
    interaction: correlationInteraction,
    corrections: [
      "Pour la série principale, le document affiche r≈0,92. Le calcul avec V(X)=4,164375 donne r≈0,9252, soit 0,93 à l’ordre 2 ; la conclusion de forte corrélation reste inchangée.",
      "Dans l’exercice 5, V(X)=4,18 provient de X̄=5,63 arrondi trop tôt. La valeur exacte est 4,234375, soit 4,23 à l’ordre 2. Le coefficient r reste 0,90 à l’ordre 2.",
    ],
    questions: [
      choice("Quelle formule définit r ?", ["$\\frac{\\operatorname{Cov}(X,Y)}{\\sqrt{V(X)V(Y)}}$", "$\\operatorname{Cov}(X,Y)\\sqrt{V(X)V(Y)}$", "$V(X)+V(Y)$", "$\\frac{V(X)}{V(Y)}$"], 0, "La covariance est normalisée par les deux écarts-types.", "Définition • page 5"),
      truth("Le coefficient r a le même signe que la covariance.", true, "Le dénominateur est positif.", "Remarques • page 5"),
      choice("Le cours parle de forte corrélation lorsque :", ["$|r|\\ge0{,}87$", "$r=0$", "$|r|<0{,}1$", "$r>1$"], 0, "C’est le seuil pratique retenu page 6.", "Remarques • pages 5-6"),
      short("Pour la série principale, calcule $V(X)$ à l’ordre 2.", ["4,16", "4.16"], "$200{,}76/8-4{,}575^2\\approx4{,}16$.", "Exercice de fixation • page 5", 2),
      short("Pour la série principale, calcule $V(Y)$.", ["157,25", "157.25"], "$11626/8-36^2=157{,}25$.", "Exercice de fixation • page 5", 2),
      short("Donne r pour la série principale à deux décimales avec les valeurs exactes.", ["0,93", "0.93", "0,92", "0.92"], "$r\\approx0{,}925$ ; l’arrondi exact donne 0,93, tandis que le document affiche 0,92.", "Exercice de fixation • pages 5-6", 2),
      choice("Comment interpréter le coefficient précédent ?", ["Forte corrélation positive", "Forte corrélation négative", "Aucune corrélation", "Coefficient impossible"], 0, "$r>0$ et $|r|\\ge0{,}87$.", "Exemple • page 6"),
      short("Exercice 4 : donne $V(X)$ à l’ordre 2.", ["6,67", "6.67"], "$V(X)=20/3\\approx6{,}67$.", "Exercice 4 • page 10"),
      short("Exercice 4 : donne $V(Y)$.", ["2570"], "Le calcul du document donne exactement 2570.", "Exercice 4 • page 10"),
      short("Exercice 4 : calcule r à l’ordre 2.", ["-0,96", "-0.96", "−0,96"], "$r\\approx-0{,}9601$.", "Exercice 4 • page 10", 2),
      choice("Comment interpréter $r=-0{,}96$ ?", ["Forte corrélation décroissante", "Forte corrélation croissante", "Aucun lien", "r est hors de [-1;1]"], 0, "$|r|=0{,}96$ est proche de 1 et le signe est négatif.", "Exercice 4 • page 10", 2),
      short("Exercice 5 : calcule $V(X)$ à l’ordre 2 sans arrondir X̄ avant la fin.", ["4,23", "4.23"], "$287/8-5{,}625^2=4{,}234375$.", "Exercice 5 • pages 11-12", 3),
      short("Exercice 5 : calcule $V(Y)$ à l’ordre 2.", ["8,44", "8.44"], "$545/8-7{,}75^2=8{,}4375$.", "Exercice 5 • page 12", 2),
      short("Exercice 5 : calcule r à l’ordre 2.", ["0,90", "0.90", "0,9", "0.9"], "$r\\approx0{,}9045$.", "Exercice 5 • page 12", 2),
    ],
  },
  {
    id: "regression-lines",
    title: "Droites de régression par les moindres carrés",
    summary: "Choisir le sens de la régression, calculer pente et ordonnée à l’origine, puis contrôler avec G.",
    pages: "6, 10-12",
    section: "II-3-a. Droites de régression ; exercices 4 et 5",
    durationMinutes: 32,
    body: String.raw`## Les deux régressions

Lorsque la corrélation linéaire est forte, on peut calculer deux droites différentes.

| Objectif | Équation | Pente | Ordonnée à l’origine |
|---|---|---|---|
| Estimer $Y$ connaissant $X$ | $(D):y=ax+b$ | $a=\dfrac{\operatorname{Cov}(X,Y)}{V(X)}$ | $b=\overline Y-a\overline X$ |
| Estimer $X$ connaissant $Y$ | $(D'):x=a'y+b'$ | $a'=\dfrac{\operatorname{Cov}(X,Y)}{V(Y)}$ | $b'=\overline X-a'\overline Y$ |

Les deux droites passent par $G(\overline X;\overline Y)$.

## Série principale — calcul avec précision gardée

$$a=\frac{23{,}675}{4{,}164375}\approx5{,}6851,\qquad b=36-a\times4{,}575\approx9{,}9905.$$

À l’ordre 2 :

$$(D):y\approx5{,}69x+9{,}99.$$

Pour l’autre sens :

$$a'=\frac{23{,}675}{157{,}25}\approx0{,}15056,\qquad b'=4{,}575-a'\times36\approx-0{,}8450.$$

$$(D'):x\approx0{,}15y-0{,}85.$$

Le document arrondit les pentes avant de calculer $b$ et $b'$, d’où $9{,}97$ et $-0{,}825$. Les deux écritures sont proches, mais la bonne pratique est de **garder la précision interne**.

## Propriétés de contrôle

$$aa'=r^2\qquad\text{et}\qquad |r|=\sqrt{aa'}.$$

Si les deux pentes sont positives, $r=\sqrt{aa'}$ ; si elles sont négatives, $r=-\sqrt{aa'}$. Si $r^2=1$, les deux droites sont confondues.

## Exercice 4 — liaison décroissante

Avec les valeurs exactes :

$$(D):y=-18{,}85x+135{,}40$$

$$(D'):x\approx-0{,}0489y+6{,}9339.$$

## Exercice 5 — travailleurs et superficie

La droite permettant d’estimer la superficie $Y$ à partir du nombre de travailleurs $X$ est :

$$y\approx1{,}2768x+0{,}5683,$$

soit, à l’ordre 2, $y\approx1{,}28x+0{,}57$.

> **Erreur fréquente.** « Régression de Y en X » signifie que $Y$ est à gauche de l’équation : $y=ax+b$. Le dénominateur de la pente est donc $V(X)$.

> **Astuce mémoire de Davy.** « La variable connue va au dénominateur. » Pour prévoir Y à partir de X, la pente contient V(X).`,
    keyPoint: String.raw`a=\frac{\operatorname{Cov}(X,Y)}{V(X)},\quad b=\overline Y-a\overline X`,
    example: String.raw`(D):y\approx5{,}69x+9{,}99\qquad (D'):x\approx0{,}15y-0{,}85`,
    methodSteps: [
      "Décide quelle variable est connue et laquelle doit être estimée.",
      "Calcule la pente avec la variance de la variable connue au dénominateur.",
      "Calcule l’ordonnée à l’origine sans arrondir la pente dans la calculatrice.",
      "Vérifie que la droite passe par G et que le produit des pentes est proche de r².",
    ],
    timeline: [
      { label: "Sens", detail: "Y en X pour prévoir y à partir de x ; X en Y pour l’inverse." },
      { label: "Coefficients", detail: "Calculer a puis b en gardant toute la précision." },
      { label: "Contrôle", detail: "La droite doit passer par G et vérifier aa′=r²." },
    ],
    interaction: regressionInteraction,
    corrections: [
      "Pour la série principale, le document calcule b après avoir arrondi a à 5,69 et obtient 9,97. En conservant a=23,675/4,164375, on obtient b≈9,9905, soit 9,99 à l’ordre 2.",
      "Pour la droite de X en Y, le document obtient b′=-0,825 après avoir remplacé a′ par 0,15. Avec la pente exacte, b′≈-0,8450, soit -0,85 à l’ordre 2.",
      "Dans l’exercice 5, l’énoncé parle d’une « droite d’ajustement de X en Y » mais écrit y=ax+b : il s’agit de la régression de Y en X. Le calcul exact donne b≈0,57 et non 0,54, autre effet de l’arrondi prématuré.",
    ],
    questions: [
      choice("Pour estimer Y connaissant X, quelle pente utilise-t-on ?", ["$\\operatorname{Cov}(X,Y)/V(X)$", "$\\operatorname{Cov}(X,Y)/V(Y)$", "$V(X)/V(Y)$", "$r/V(X)$"], 0, "La variable explicative X donne la variance au dénominateur.", "Propriété • page 6"),
      choice("Pour estimer X connaissant Y, quelle pente utilise-t-on ?", ["$\\operatorname{Cov}(X,Y)/V(X)$", "$\\operatorname{Cov}(X,Y)/V(Y)$", "$V(Y)/V(X)$", "$1/r$"], 1, "La variable connue est Y.", "Propriété • page 6"),
      short("Série principale : calcule la pente a à l’ordre 2.", ["5,69", "5.69"], "$23{,}675/4{,}164375\\approx5{,}69$.", "Exercice de fixation • page 6", 2),
      short("Série principale : calcule b à l’ordre 2 sans arrondir a avant la fin.", ["9,99", "9.99", "9,97", "9.97"], "Le calcul précis donne 9,99 ; le document affiche 9,97 après arrondi intermédiaire.", "Exercice de fixation • page 6", 2),
      short("Série principale : calcule $a'$ à l’ordre 2.", ["0,15", "0.15"], "$23{,}675/157{,}25\\approx0{,}15$.", "Exercice de fixation • page 6", 2),
      short("Série principale : calcule $b'$ à l’ordre 2 sans arrondi prématuré.", ["-0,85", "-0.85", "−0,85", "-0,83", "-0.83", "−0,83"], "Le calcul exact donne -0,85 ; la valeur issue des coefficients déjà arrondis est voisine de -0,83.", "Exercice de fixation • page 6", 2),
      truth("Les deux droites de régression passent par le point moyen G.", true, "C’est la première remarque du document.", "Remarques • page 6"),
      choice("Quelle relation lie les deux pentes et r ?", ["$aa'=r^2$", "$a+a'=r$", "$a-a'=r$", "$a/a'=r$"], 0, "C’est la propriété de contrôle donnée page 6.", "Remarques • page 6", 2),
      choice("Si $r^2=1$, les deux droites sont :", ["confondues", "perpendiculaires", "parallèles distinctes", "sans point commun"], 0, "Une liaison affine parfaite donne une seule droite.", "Remarques • page 6"),
      short("Exercice 4 : calcule la pente de Y en X à l’ordre 2.", ["-18,85", "-18.85", "−18,85", "-18,84", "-18.84"], "$(-377/3)/(20/3)=-18{,}85$ ; le document affiche -18,84 avec ses arrondis.", "Exercice 4 • page 10", 2),
      short("Exercice 4 : calcule b à l’ordre 2 avec la pente exacte.", ["135,4", "135.4", "135,40", "135.40", "135,36", "135.36"], "$60-(-18{,}85)\\times4=135{,}40$.", "Exercice 4 • page 10", 2),
      short("Exercice 4 : calcule $a'$ à l’ordre 3.", ["-0,049", "-0.049", "−0,049"], "$(-125{,}666\\ldots)/2570\\approx-0{,}049$.", "Exercice 4 • page 10", 2),
      short("Exercice 4 : calcule $b'$ à l’ordre 2.", ["6,93", "6.93", "6,94", "6.94"], "La valeur exacte est environ 6,93 ; le document obtient 6,94 après arrondi de a′.", "Exercice 4 • page 10", 2),
      short("Exercice 5 : donne la pente de Y en X à l’ordre 2.", ["1,28", "1.28"], "$5{,}40625/4{,}234375\\approx1{,}28$.", "Exercice 5 • page 12", 2),
      short("Exercice 5 : donne b à l’ordre 2 sans arrondi intermédiaire.", ["0,57", "0.57", "0,54", "0.54"], "$7{,}75-1{,}276752\\ldots\\times5{,}625\\approx0{,}57$.", "Exercice 5 • page 12", 2),
    ],
  },
  {
    id: "statistical-estimation",
    title: "Estimer et interpréter une prévision",
    summary: "Utiliser la bonne droite dans les deux sens, arrondir selon le contexte et reconnaître les limites du modèle.",
    pages: "7-8, 11-12",
    section: "II-3-b. Estimation ; situation complexe ; exercice 5",
    durationMinutes: 38,
    kind: "challenge",
    body: String.raw`## 1. Principe de l’estimation

Une droite d’ajustement permet :

- une estimation **graphique** en lisant les coordonnées d’un point de la droite ;
- une estimation **numérique** en remplaçant la valeur connue dans l’équation.

Une estimation suppose que la tendance observée se poursuit. Plus on s’éloigne des données du tableau, plus l’**extrapolation** est incertaine.

## 2. Exploitations agricoles — 9 hectares

Avec la droite précise :

$$y\approx5{,}6851\times9+9{,}9905\approx61{,}16.$$

On estime donc environ **61 exploitations**.

Le document utilise $y=5{,}69x+9{,}97$, puis écrit $61{,}8$. Or :

$$5{,}69\times9+9{,}97=61{,}18,$$

et non $61{,}8$. La conclusion « 62 » du document vient de cette virgule déplacée ; le calcul exact conduit à 61 à l’unité la plus proche.

## 3. Situation complexe — le club littéraire

Les rangs $x_i=1,2,\ldots,12$ représentent les mois de janvier à décembre 2020, et les nombres d’adhérents sont :

$$1100,1160,1220,1370,1620,1550,1600,1500,1790,1940,2060,1980.$$

En conservant les valeurs exactes :

$$\overline X=6{,}5,\qquad \overline Y=\frac{18890}{12}\approx1574{,}167,$$

$$V(X)=\frac{143}{12}\approx11{,}917,$$

$$\operatorname{Cov}(X,Y)=\frac{12305}{12}\approx1025{,}417.$$

La droite de Y en X est :

$$y\approx86{,}049x+1014{,}848.$$

Pour atteindre $3000$ adhérents :

$$x=\frac{3000-1014{,}848}{86{,}049}\approx23{,}07.$$

Le seuil n’est pas encore franchi au rang 23 ; on prend le rang **24**, soit **décembre 2021**.

## 4. Exercice d’approfondissement — 16 hectares d’hévéa

| Travailleurs $X$ | 2 | 4 | 4 | 5 | 7 | 7 | 8 | 8 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Superficie $Y$ (ha) | 3 | 5 | 6 | 7 | 10 | 11 | 8 | 12 |

Les calculs exacts donnent :

$$G(5{,}625;7{,}75),\quad V(X)=4{,}234375,\quad V(Y)=8{,}4375,$$

$$\operatorname{Cov}(X,Y)=5{,}40625,\quad r\approx0{,}904.$$

La corrélation est forte et la droite utile est :

$$y\approx1{,}2768x+0{,}5683.$$

Pour une exploitation de $16$ ha :

$$x=\frac{16-0{,}5683}{1{,}2768}\approx12{,}09.$$

On estime donc **12 travailleurs**.

> **Erreur fréquente.** Quand le résultat représente un premier mois où un seuil est dépassé, on arrondit au rang supérieur. Quand il représente un effectif estimé, on arrondit à l’entier le plus pertinent dans le contexte.

> **Astuce mémoire de Davy.** « Je connais x : je remplace. Je connais y : je résous. » Puis je termine toujours par une phrase avec l’unité et le contexte.`,
    keyPoint: String.raw`\widehat y=ax_0+b\qquad\text{ou}\qquad \widehat x=\frac{y_0-b}{a}`,
    example: String.raw`x=\frac{16-0{,}5683}{1{,}2768}\approx12{,}09\Rightarrow12\text{ travailleurs}`,
    methodSteps: [
      "Choisis la droite qui place la variable inconnue à gauche de l’équation.",
      "Remplace la valeur connue ou résous l’équation pour l’inconnue.",
      "Garde les coefficients complets pendant le calcul.",
      "Arrondis selon le contexte, indique l’unité et précise qu’il s’agit d’une estimation.",
      "Vérifie que la valeur demandée n’est pas trop éloignée de la plage observée.",
    ],
    timeline: [
      { label: "Variable inconnue", detail: "Identifier si l’on cherche x ou y." },
      { label: "Calcul", detail: "Substituer ou isoler l’inconnue sans arrondi prématuré." },
      { label: "Contexte", detail: "Arrondir, donner l’unité et signaler une extrapolation." },
    ],
    interaction: estimationInteraction,
    corrections: [
      "Page 7, 5,69×9+9,97 vaut 61,18 et non 61,8. Avec la droite exacte, l’estimation vaut environ 61,16 : à l’unité la plus proche, 61 exploitations, et non 62.",
      "Page 7, la situation du club mentionne « l’élève de la Terminale A » dans un document de Terminale C. Le contexte mathématique est conservé sans attribuer la série à l’élève.",
      "Page 8, V(Y), Cov(X,Y), a et b sont légèrement décalés par l’emploi de Ȳ=1574,167 arrondi. Les valeurs exactes sont V(Y)≈96124,306, Cov≈1025,417, a≈86,049 et b≈1014,848 ; la date finale reste décembre 2021.",
      "Le PDF s’arrête à la question 5-a de l’exercice 5 : le tracé demandé en 5-b et l’estimation demandée en 6 ne sont pas corrigés dans la source. Ils sont complétés ici avec la droite exacte, donnant environ 12 travailleurs pour 16 ha.",
    ],
    questions: [
      short("Série principale : calcule $5{,}69\\times9+9{,}97$.", ["61,18", "61.18"], "Le produit vaut 51,21 puis on ajoute 9,97.", "Exercice de fixation • page 7", 2),
      short("Avec la droite précise, combien d’exploitations prévoit-on à l’unité la plus proche pour 9 ha ?", ["61", "61 exploitations"], "$y\\approx61{,}16$, donc 61 à l’unité la plus proche.", "Exercice de fixation corrigé • page 7", 2),
      choice("Une valeur estimée très loin de la plage observée est :", ["une extrapolation à interpréter avec prudence", "toujours exacte", "une moyenne", "une variance"], 0, "La droite résume les données observées, pas tous les cas possibles.", "Principe d’estimation • page 7"),
      short("Club littéraire : calcule $\\overline X$.", ["6,5", "6.5"], "$78/12=6{,}5$.", "Situation complexe • pages 7-8"),
      short("Club littéraire : calcule $\\overline Y$ à l’ordre 3.", ["1574,167", "1574.167"], "$18890/12\\approx1574{,}167$.", "Situation complexe • page 8"),
      short("Club littéraire : calcule $V(X)$ à l’ordre 3.", ["11,917", "11.917"], "$650/12-6{,}5^2\\approx11{,}917$.", "Situation complexe • page 8", 2),
      short("Club littéraire : calcule la covariance à l’ordre 3.", ["1025,417", "1025.417", "1025,414", "1025.414"], "Le calcul exact donne environ 1025,417 ; le document affiche 1025,414 avec Ȳ arrondi.", "Situation complexe • page 8", 2),
      short("Club littéraire : donne la pente a à l’ordre 3.", ["86,049", "86.049", "86,046", "86.046"], "$a\\approx86{,}049$ avec les valeurs exactes.", "Situation complexe • page 8", 2),
      short("Club littéraire : résous $86{,}049x+1014{,}848=3000$ à l’ordre 2.", ["23,07", "23.07"], "$x\\approx23{,}07$.", "Situation complexe • page 8", 2),
      choice("Quel rang faut-il retenir pour que le nombre dépasse 3000 ?", ["23", "24", "22", "30"], 1, "Le seuil n’est franchi qu’au rang entier suivant.", "Situation complexe • page 8", 2),
      choice("À quelle date correspond le rang 24 si le rang 1 est janvier 2020 ?", ["Décembre 2020", "Janvier 2021", "Décembre 2021", "Janvier 2022"], 2, "Douze mois forment une année ; le rang 24 est décembre de l’année suivante.", "Situation complexe • page 8", 2),
      choice("Exercice 5 : quel couple appartient au nuage ?", ["$(2;3)$", "$(3;2)$", "$(16;12)$", "$(5;16)$"], 0, "La première colonne du tableau donne 2 travailleurs pour 3 ha.", "Exercice 5, question 1 • page 11"),
      short("Exercice 5 : donne le point moyen exact G.", ["(5,625;7,75)", "5,625;7,75", "(5.625;7.75)"], "$G(5{,}625;7{,}75)$.", "Exercice 5, question 2 • pages 11-12", 2),
      short("Exercice 5 : donne r à l’ordre 2.", ["0,90", "0.90", "0,9", "0.9"], "$r\\approx0{,}904$ : la corrélation est forte.", "Exercice 5, question 4 • page 12", 2),
      choice("Exercice 5 : quelle équation corrigée convient à l’ordre 2 ?", ["$y=1{,}28x+0{,}57$", "$x=1{,}28y+0{,}57$", "$y=-1{,}28x+0{,}57$", "$y=5{,}69x+9{,}99$"], 0, "On estime la superficie Y à partir du nombre de travailleurs X.", "Exercice 5, question 5 • page 12", 2),
      short("Exercice 5 : estime le nombre de travailleurs pour 16 ha à l’unité la plus proche.", ["12", "12 travailleurs"], "$x=(16-0{,}5683)/1{,}2768\\approx12{,}09$.", "Exercice 5, question 6 complétée", 3),
      truth("Une forte corrélation prouve que l’augmentation de X cause celle de Y.", false, "Corrélation ne signifie pas causalité.", "Précision d’interprétation", 2),
    ],
  },
];

const historicalLevelIds = [
  "scatter-plot",
  "mean-point",
  "covariance",
  "correlation",
  "regression-lines",
  "statistical-estimation",
] as const;

const builtLevels = historicalLevelIds.map((id, index) => {
  const level = levels.find((candidate) => candidate.id === id);
  if (!level) throw new Error("Niveau historique introuvable : " + id);
  return officialLevel(index, level);
});

export const terminalCStatisticsPath: LearningPath = {
  id: "terminale-c-math-l19-statistics",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 6, title: "Organisation et traitement des données" },
  chapterNumber: 19,
  title: "Statistique à deux variables",
  description:
    "Séries doubles, tableaux de contingence, nuages de points, point moyen, covariance, corrélation, régressions linéaires et estimations raisonnées.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Lire un tableau de contingence et calculer ses séries marginales",
    "Représenter un nuage et calculer son point moyen",
    "Calculer une covariance et interpréter son signe",
    "Calculer et interpréter un coefficient de corrélation linéaire",
    "Déterminer les deux droites de régression par les moindres carrés",
    "Estimer une valeur, choisir un arrondi pertinent et discuter les limites du modèle",
  ],
  modules: [
    {
      id: "terminale-c-math-l19-statistics-mastery",
      title: "Maîtriser la statistique à deux variables",
      description:
        "Six niveaux progressifs, " +
        builtLevels.reduce((sum, lesson) => sum + (lesson.questions?.length ?? 0), 0) +
        " réponses évaluables, deux figures interactives et toutes les corrections de calcul du document explicitées.",
      lessons: builtLevels,
    },
  ],
};
