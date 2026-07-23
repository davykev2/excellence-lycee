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
  terminalASequencesPath,
  terminalABivariateStatisticsPath,
  terminalALinearSystemsPath,
  terminalAPrimitivesIntegralsPath,
];
