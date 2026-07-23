import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 06 Statistiques.pdf";

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
    id: "statistical-series-scatterplot",
    title: "Série statistique double et tableau de contingence",
    summary: "Lire un tableau à double entrée et y repérer l'effectif d'un couple de modalités.",
    pages: "1-2",
    section: "I-1. Définition",
    durationMinutes: 15,
    xp: 45,
    body: String.raw`## Définition

On considère deux caractères **quantitatifs** $X$ et $Y$ sur une même population de $n$ individus.

- $x_1,x_2,\ldots,x_p$ sont les valeurs (ou modalités) du caractère $X$ ;
- $y_1,y_2,\ldots,y_q$ sont les valeurs du caractère $Y$ ;
- $n_{ij}$ est l'**effectif** du couple $(x_i,y_j)$.

On appelle **série statistique double** de caractère $(X,Y)$ l'ensemble des triplets $(x_i,y_j,n_{ij})$.

## Le tableau de contingence

Une étude porte sur 100 ménages : $X$ est le nombre d'enfants, $Y$ le nombre de pièces du logement.

| $X\backslash Y$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| **0** | 6 | 3 | 1 | 0 |
| **1** | 4 | 11 | 3 | 1 |
| **2** | 1 | 10 | 16 | 3 |
| **3** | 0 | 5 | 13 | 5 |
| **4** | 0 | 1 | 4 | 8 |
| **5** | 0 | 0 | 1 | 4 |

Ce tableau à double entrée s'appelle **tableau de contingence**.

### Comment le lire

Le nombre $6$ est à l'intersection de la ligne $X=0$ et de la colonne $Y=1$ : **6 ménages n'ont aucun enfant et occupent un logement d'une pièce**. On dit que l'effectif du couple $(0;1)$ est $6$.

De même, à l'intersection de la ligne $X=2$ et de la colonne $Y=3$ on lit $16$ : **16 ménages ont deux enfants et occupent un logement de trois pièces**. L'effectif du couple $(2;3)$ est $16$.

> **Erreur fréquente.** Ne confonds pas la **valeur** d'un caractère (0, 1, 2… enfants) avec l'**effectif** $n_{ij}$ (le nombre de ménages). La première ligne et la première colonne portent les valeurs ; tout le reste du tableau porte des effectifs.

> **Astuce mémoire de Davy.** « Ligne pour $X$, colonne pour $Y$, croisement pour l'effectif. » Pour lire une case, pose ton doigt sur la ligne, un autre sur la colonne, et croise-les.`,
    keyPoint: "Une série double est l'ensemble des triplets (xᵢ, yⱼ, nᵢⱼ) ; nᵢⱼ se lit au croisement.",
    example: "Dans le tableau des ménages, l'effectif du couple $(2;3)$ vaut $16$.",
    methodSteps: [
      "Repère la ligne correspondant à la valeur de X.",
      "Repère la colonne correspondant à la valeur de Y.",
      "Lis l'effectif à leur intersection.",
    ],
    timeline: [
      { label: "Deux caractères", detail: "X et Y observés sur la même population." },
      { label: "Croisement", detail: "nᵢⱼ est l'effectif du couple (xᵢ, yⱼ)." },
      { label: "Lecture", detail: "Ligne de X × colonne de Y = effectif." },
    ],
    questions: [
      short("Combien de ménages ont deux enfants et occupent un logement de trois pièces ?", ["16"], "On croise la ligne $X=2$ et la colonne $Y=3$.", "Exemple du cours, page 2"),
      short("Quel est l'effectif du couple $(0;1)$ ?", ["6"], "Ligne $X=0$, colonne $Y=1$ : 6 ménages.", "Exemple du cours, page 2"),
      choice("Comment appelle-t-on ce tableau à double entrée ?", ["Tableau de fréquences", "Tableau de contingence", "Tableau de variation", "Nuage de points"], 1, "C'est la définition donnée par le cours.", "Définition, page 2"),
      choice("Une série statistique double est l'ensemble :", ["des valeurs $x_i$", "des couples $(x_i,y_j)$", "des triplets $(x_i,y_j,n_{ij})$", "des effectifs $n_{ij}$"], 2, "La définition inclut les deux modalités **et** l'effectif.", "Définition, page 1"),
      short("Combien de ménages ont quatre enfants et un logement de quatre pièces ?", ["8"], "Ligne $X=4$, colonne $Y=4$ : 8 ménages.", "Exemple du cours, page 2"),
    ],
  },
  {
    id: "mean-point-marginals",
    title: "Séries marginales et fréquences — série A1",
    summary: "Extraire d'un tableau de contingence les effectifs et fréquences de chaque caractère.",
    pages: "2-3",
    section: "I-2. Tableau de séries marginales (série A1 seulement)",
    durationMinutes: 18,
    xp: 50,
    body: String.raw`## Séries marginales

Reprenons le tableau des 100 ménages, complété par les totaux :

| $X\backslash Y$ | 1 | 2 | 3 | 4 | **Total** |
|---|---|---|---|---|---|
| **0** | 6 | 3 | 1 | 0 | **10** |
| **1** | 4 | 11 | 3 | 1 | **19** |
| **2** | 1 | 10 | 16 | 3 | **30** |
| **3** | 0 | 5 | 13 | 5 | **23** |
| **4** | 0 | 1 | 4 | 8 | **13** |
| **5** | 0 | 0 | 1 | 4 | **5** |
| **Total** | **11** | **30** | **38** | **21** | **100** |

Pour obtenir l'effectif de la valeur $0$ du caractère $X$, on additionne toute sa **ligne** : $6+3+1+0=10$. Pour la valeur $3$ : $0+5+13+5=23$.

D'où le tableau linéaire associé à $X$, appelé **série marginale de $X$** :

| $x_i$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| $n_i$ | 10 | 19 | 30 | 23 | 13 | 5 |

En procédant de même avec les **colonnes**, on obtient la série marginale de $Y$ — par exemple pour $y=1$ : $6+4+1+0+0+0=11$.

| $y_i$ | 1 | 2 | 3 | 4 |
|---|---|---|---|---|
| $n_i$ | 11 | 30 | 38 | 21 |

## Fréquences marginales

La **fréquence** est l'effectif de la modalité divisé par l'effectif total.

| $x_i$ | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| $f_i$ | $\frac{10}{100}$ | $\frac{19}{100}$ | $\frac{30}{100}$ | $\frac{23}{100}$ | $\frac{13}{100}$ | $\frac{5}{100}$ |

> **Erreur fréquente.** Pour la série marginale de $X$, on somme les **lignes** ; pour celle de $Y$, les **colonnes**. Inverser les deux donne des effectifs qui n'ont aucun sens.

> **Astuce mémoire de Davy.** « Marge = bord du tableau. » Les séries marginales sont littéralement les totaux inscrits dans la marge : dernière colonne pour $X$, dernière ligne pour $Y$. Et la somme des deux marges doit redonner l'effectif total.`,
    keyPoint: "Série marginale de X = somme des lignes ; de Y = somme des colonnes ; fréquence = effectif / total.",
    example: "L'effectif de la valeur $3$ de $X$ vaut $0+5+13+5=23$.",
    methodSteps: [
      "Pour X, additionne chaque ligne du tableau.",
      "Pour Y, additionne chaque colonne.",
      "Divise par l'effectif total pour obtenir les fréquences.",
    ],
    timeline: [
      { label: "Lignes", detail: "Sommer une ligne donne l'effectif d'une valeur de X." },
      { label: "Colonnes", detail: "Sommer une colonne donne l'effectif d'une valeur de Y." },
      { label: "Fréquences", detail: "Diviser chaque effectif par l'effectif total." },
    ],
    questions: [
      short("Quel est l'effectif de la valeur 3 du caractère X ?", ["23"], "$0+5+13+5=23$.", "Exercice du cours, page 3"),
      short("Quel est l'effectif de la valeur 1 du caractère Y ?", ["11"], "$6+4+1+0+0+0=11$.", "Exercice du cours, page 3"),
      short("Quel est l'effectif de la valeur 2 du caractère X ?", ["30"], "$1+10+16+3=30$.", "Tableau des séries marginales, page 2"),
      choice("La fréquence marginale de la valeur 0 de X est :", ["$\\frac{10}{100}$", "$\\frac{6}{100}$", "$\\frac{10}{19}$", "$\\frac{100}{10}$"], 0, "Effectif 10 sur un total de 100.", "Tableau des fréquences, page 3"),
      choice("Pour obtenir la série marginale de Y, on additionne :", ["les lignes", "les colonnes", "les diagonales", "les fréquences"], 1, "Les modalités de Y sont en colonnes.", "Cours, page 3"),
    ],
  },
  {
    id: "statistical-scatterplot",
    title: "Nuage de points",
    summary: "Représenter une série statistique double par des points dans un repère.",
    pages: "3-4",
    section: "I-3. Nuage de points",
    durationMinutes: 15,
    xp: 50,
    body: String.raw`## Définition

On appelle **nuage de points** associé à la série statistique double de caractère $(X,Y)$ la représentation, dans un repère orthogonal, des points de coordonnées $(x_i;y_j)$ d'effectifs non nuls.

### Exercice de fixation du cours

Le tableau donne le nombre d'exploitations agricoles d'une région selon leur superficie :

| Superficie $X$ | 2 | 2 | 3 | 4 | 5 | 6 | 7 | 7,6 |
|---|---|---|---|---|---|---|---|---|
| Nombre d'exploitations $Y$ | 14 | 26 | 31 | 29 | 44 | 40 | 54 | 50 |

On place les huit points $(2;14)$, $(2;26)$, $(3;31)$, $(4;29)$, $(5;44)$, $(6;40)$, $(7;54)$ et $(7{,}6;50)$. Les points montent globalement de la gauche vers la droite : **plus la superficie augmente, plus le nombre d'exploitations tend à augmenter**.

**Remarque importante du cours.** Dans toute la suite, les séries doubles considérées sont de ce type : l'effectif $n_i$ de chaque couple $(x_i,y_i)$ vaut $1$.

> **Erreur fréquente.** Deux points peuvent avoir la même abscisse — ici $(2;14)$ et $(2;26)$. Il ne faut surtout pas en supprimer un : chaque individu compte, même si sa valeur de $X$ est déjà présente.

> **Astuce mémoire de Davy.** « Un individu = un point. » Le nuage n'est rien d'autre que le tableau redessiné : chaque colonne du tableau devient un point du repère. Regarde ensuite sa **forme** : s'il s'étire le long d'une droite, un ajustement affine aura du sens.`,
    keyPoint: "Le nuage est l'ensemble des points (xᵢ ; yᵢ) tracés dans un repère orthogonal.",
    example: "Les huit couples du tableau des exploitations donnent huit points, dont $(2;14)$ et $(2;26)$.",
    methodSteps: [
      "Choisis des échelles adaptées aux valeurs de X et de Y.",
      "Place un point par couple (xᵢ ; yᵢ).",
      "Observe la forme du nuage pour juger d'un ajustement affine.",
    ],
    timeline: [
      { label: "Repère", detail: "Choisir des unités adaptées aux données." },
      { label: "Points", detail: "Un point par couple (xᵢ ; yᵢ)." },
      { label: "Forme", detail: "Un nuage allongé suggère un ajustement affine." },
    ],
    questions: [
      choice("Un nuage de points représente :", ["les effectifs seuls", "les points $(x_i;y_j)$ d'effectifs non nuls", "la moyenne de X", "le tableau de contingence"], 1, "C'est exactement la définition du cours.", "Définition, page 3"),
      short("Combien de points comporte le nuage du tableau des exploitations agricoles ?", ["8", "huit"], "Le tableau contient huit couples.", "Exercice de fixation, pages 3-4"),
      choice("Deux exploitations ont une superficie de 2 ha. Sur le nuage :", ["on ne place qu'un point", "on place deux points distincts", "on fait la moyenne des deux", "on les ignore"], 1, "Chaque individu donne son propre point : $(2;14)$ et $(2;26)$.", "Exercice de fixation, page 4", 2),
      choice("Dans la suite du cours, l'effectif de chaque couple $(x_i,y_i)$ vaut :", ["0", "1", "$n$", "variable"], 1, "C'est la remarque explicite du cours page 4.", "Remarque, page 4"),
    ],
  },
  {
    id: "statistical-mean-point",
    title: "Point moyen d'un nuage",
    summary: "Calculer les coordonnées du point moyen G d'une série statistique double.",
    pages: "4-5",
    section: "I-4. Point moyen",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Définition

On appelle **point moyen** d'un nuage de $n$ points $M_i(x_i;y_i)$ le point $G$ de coordonnées $(\overline X;\overline Y)$ telles que :

$$\overline X=\frac{x_1+x_2+\cdots+x_n}{n}\qquad\overline Y=\frac{y_1+y_2+\cdots+y_n}{n}$$

### Exercice de fixation entièrement rédigé

Pour le tableau des exploitations agricoles :

| Superficie $X$ | 2 | 2 | 3 | 4 | 5 | 6 | 7 | 7,6 |
|---|---|---|---|---|---|---|---|---|
| Nombre $Y$ | 14 | 26 | 31 | 29 | 44 | 40 | 54 | 50 |

$$\overline X=\frac{2+2+3+4+5+6+7+7{,}6}{8}=\frac{36{,}6}{8}=4{,}575$$

$$\overline Y=\frac{14+26+31+29+44+40+54+50}{8}=\frac{288}{8}=36$$

Donc $G(4{,}575\,;\,36)$.

> **Erreur fréquente.** Le dénominateur est $n$, le **nombre d'individus** (ici 8), pas le nombre de valeurs distinctes de $X$ (qui serait 7, puisque 2 apparaît deux fois). Compte les colonnes du tableau, pas les valeurs différentes.

> **Astuce mémoire de Davy.** « $G$, c'est le centre de gravité du nuage. » Il tombe toujours au cœur des points — et surtout, **toutes les droites d'ajustement du programme passent par lui**. C'est un excellent moyen de vérifier une équation de droite : remplace $x$ par $\overline X$, tu dois retrouver $\overline Y$.`,
    keyPoint: "G(X̄ ; Ȳ) avec X̄ et Ȳ les moyennes ; toutes les droites d'ajustement passent par G.",
    example: "Pour les exploitations agricoles, $G(4{,}575\\,;\\,36)$.",
    methodSteps: [
      "Additionne toutes les valeurs de X puis divise par n.",
      "Fais de même pour Y.",
      "Écris les coordonnées de G.",
    ],
    timeline: [
      { label: "Moyenne de X", detail: "Somme des xᵢ divisée par n." },
      { label: "Moyenne de Y", detail: "Somme des yᵢ divisée par n." },
      { label: "Point G", detail: "G(X̄ ; Ȳ) est le centre du nuage." },
    ],
    questions: [
      short("Calcule $\\overline X$ pour le tableau des exploitations agricoles.", ["4,575", "4.575"], "$36{,}6/8=4{,}575$.", "Exercice de fixation, page 4"),
      short("Calcule $\\overline Y$.", ["36"], "$288/8=36$.", "Exercice de fixation, page 4"),
      choice("Les coordonnées du point moyen sont :", ["$(36;4{,}575)$", "$(4{,}575;36)$", "$(4{,}575;4{,}575)$", "$(8;288)$"], 1, "L'abscisse est la moyenne de X, l'ordonnée celle de Y.", "Exercice de fixation, pages 4-5"),
      short("Pour la série $x_i$ = 0..8 et $y_i$ = 160, 110, 100, 72, 36, 29, 20, 10, 3, calcule $\\overline X$.", ["4"], "$(0+1+\\cdots+8)/9=36/9=4$.", "Exercice de maison, page 5"),
      short("Calcule $\\overline Y$ pour cette même série.", ["60"], "$(160+110+100+72+36+29+20+10+3)/9=540/9=60$.", "Exercice de maison, page 5", 2),
    ],
  },
  {
    id: "mayer-adjustment",
    title: "Ajustement de Mayer : partage et points moyens",
    summary: "Partager le nuage en deux sous-nuages et calculer leurs points moyens G₁ et G₂.",
    pages: "5-6",
    section: "II-1 et II-2-a. Présentation et droite d'ajustement",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## Qu'est-ce qu'un ajustement ?

Faire un **ajustement** d'un nuage de points, c'est trouver une courbe qui passe le plus près possible du maximum de points du nuage. Lorsque cette courbe est une droite, on dit que l'ajustement est **affine** (ou linéaire).

## La méthode de Mayer

Pour déterminer la droite d'ajustement d'un nuage de points :

1. on range la série double $(X;Y)$ suivant les valeurs **croissantes** des $x_i$ ;
2. si le nombre $n$ de points est **pair**, on partage la série en deux sous-séries de même effectif $p=\dfrac n2$ ;
3. si $n$ est **impair**, on partage en deux sous-nuages d'effectifs $\dfrac{n+1}{2}$ et $\dfrac{n+1}{2}-1$ ;
4. on détermine le point moyen $G_1$ du premier sous-nuage et $G_2$ du second ;
5. la droite $(G_1G_2)$ est la **droite d'ajustement par la méthode de Mayer**.

**Remarque.** La droite $(G_1G_2)$ passe par le point moyen $G$ du nuage complet.

### Exercice de fixation entièrement rédigé

Les valeurs de $X$ sont déjà rangées dans l'ordre croissant, l'effectif total est $8$ : on partage en deux séries de $4$.

**Série 1**

| $X$ | 2 | 2 | 3 | 4 |
|---|---|---|---|---|
| $Y$ | 14 | 26 | 31 | 29 |

$$\overline{X_1}=\frac{2+2+3+4}{4}=2{,}75\qquad\overline{Y_1}=\frac{14+26+31+29}{4}=25$$

Donc $G_1(2{,}75\,;\,25)$.

**Série 2**

| $X$ | 5 | 6 | 7 | 7,6 |
|---|---|---|---|---|
| $Y$ | 44 | 40 | 54 | 50 |

$$\overline{X_2}=\frac{5+6+7+7{,}6}{4}=6{,}4\qquad\overline{Y_2}=\frac{44+40+54+50}{4}=47$$

Donc $G_2(6{,}4\,;\,47)$.

> **Erreur fréquente.** On oublie souvent de **ranger d'abord les $x_i$ par ordre croissant**. Si la série n'est pas triée, le partage n'a aucun sens et la droite obtenue est fausse.

> **Astuce mémoire de Davy.** « Trier, couper en deux, un centre de gravité par moitié. » Mayer, c'est la méthode de la balance : tu remplaces chaque moitié du nuage par son point moyen, et tu relies les deux.`,
    keyPoint: "Mayer : trier les xᵢ, couper en deux, calculer G₁ et G₂ ; la droite (G₁G₂) est l'ajustement.",
    example: "Pour les exploitations : $G_1(2{,}75\\,;\\,25)$ et $G_2(6{,}4\\,;\\,47)$.",
    methodSteps: [
      "Range la série suivant les valeurs croissantes de X.",
      "Partage en deux sous-nuages d'effectifs égaux (ou presque si n est impair).",
      "Calcule le point moyen de chaque sous-nuage.",
    ],
    timeline: [
      { label: "Trier", detail: "Ranger les xᵢ dans l'ordre croissant." },
      { label: "Partager", detail: "Deux sous-nuages d'effectifs égaux si n est pair." },
      { label: "Deux centres", detail: "Calculer G₁ et G₂, un par moitié." },
    ],
    questions: [
      short("Calcule $\\overline{X_1}$ pour la série 1 des exploitations agricoles.", ["2,75", "2.75"], "$(2+2+3+4)/4=2{,}75$.", "Exercice de fixation, page 6"),
      short("Calcule $\\overline{Y_1}$.", ["25"], "$(14+26+31+29)/4=25$.", "Exercice de fixation, page 6"),
      short("Calcule $\\overline{X_2}$ pour la série 2.", ["6,4", "6.4"], "$(5+6+7+7{,}6)/4=6{,}4$.", "Exercice de fixation, page 6"),
      short("Calcule $\\overline{Y_2}$.", ["47"], "$(44+40+54+50)/4=47$.", "Exercice de fixation, page 6"),
      choice("Avant de partager la série, il faut d'abord :", ["calculer la covariance", "ranger les $x_i$ par ordre croissant", "tracer la droite", "calculer les fréquences"], 1, "C'est la première étape de la méthode de Mayer.", "Méthode, page 5"),
      choice("Si le nuage compte 9 points, les deux sous-nuages ont pour effectifs :", ["4 et 5", "5 et 4", "4 et 4", "9 et 0"], 1, "$\\frac{n+1}{2}=5$ puis $5-1=4$.", "Méthode, page 5", 2),
      choice("La droite $(G_1G_2)$ passe nécessairement par :", ["l'origine", "le point moyen G du nuage", "le premier point du nuage", "aucun point particulier"], 1, "C'est la remarque du cours.", "Remarque, page 5"),
    ],
  },
  {
    id: "mayer-equation",
    title: "Équation de la droite de Mayer",
    summary: "Déterminer l'équation réduite de la droite (G₁G₂) et la tracer.",
    pages: "6-7, 12-13",
    section: "II-2-b. Équation",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## Déterminer l'équation

Soit $G_1(\overline{X_1};\overline{Y_1})$ et $G_2(\overline{X_2};\overline{Y_2})$ les points moyens des sous-nuages. La droite $(G_1G_2)$ a une équation de la forme $y=ax+b$ avec :

$$a=\frac{\overline{Y_2}-\overline{Y_1}}{\overline{X_2}-\overline{X_1}}\qquad\text{et}\qquad b=\overline{Y_1}-a\,\overline{X_1}\quad\text{(ou }b=\overline{Y_2}-a\,\overline{X_2}\text{)}$$

### Exercice de fixation entièrement rédigé

Avec $G_1(2{,}75\,;\,25)$ et $G_2(6{,}4\,;\,47)$ :

$$a=\frac{47-25}{6{,}4-2{,}75}=\frac{22}{3{,}65}=\frac{440}{73}\approx6{,}03$$

$$b=25-\frac{440}{73}\times2{,}75=\frac{615}{73}\approx8{,}42$$

$$(G_1G_2):\;y=\frac{440}{73}x+\frac{615}{73}$$

### Exercice de renforcement rédigé (exercice 1 — taille des nouveau-nés)

Pour 16 semaines d'âge gestationnel réparties en deux séries de 8 :

$$\overline{X_1}=33{,}5\quad\overline{Y_1}=49{,}65\qquad\overline{X_2}=41{,}5\quad\overline{Y_2}=52{,}625$$

$$a=\frac{52{,}625-49{,}65}{41{,}5-33{,}5}=0{,}372\qquad b=49{,}65-0{,}372\times33{,}5=37{,}188$$

$$(G_1G_2):\;y=0{,}372x+37{,}188$$

> **Erreur fréquente.** Dans le calcul de $b$, il faut multiplier $a$ par $\overline{X_1}$ (ou $\overline{X_2}$) — **pas** par $\overline{Y_1}$. Vérifie ton résultat : la droite doit repasser par $G_1$ **et** par $G_2$.

> **Astuce mémoire de Davy.** « La pente, c'est la montée divisée par l'avance. » $a=\dfrac{\Delta y}{\Delta x}$ entre les deux centres. Ensuite $b$ se déduit en forçant la droite à passer par l'un des deux points.`,
    keyPoint: "a = (Ȳ₂ − Ȳ₁)/(X̄₂ − X̄₁) puis b = Ȳ₁ − a·X̄₁.",
    example: "$a=\\frac{47-25}{6{,}4-2{,}75}=\\frac{440}{73}$ et $b=\\frac{615}{73}$.",
    methodSteps: [
      "Calcule la pente a comme quotient des différences.",
      "Déduis b en écrivant que la droite passe par G₁ (ou G₂).",
      "Écris l'équation réduite y = ax + b.",
    ],
    timeline: [
      { label: "Pente", detail: "a = (Ȳ₂ − Ȳ₁) / (X̄₂ − X̄₁)." },
      { label: "Ordonnée", detail: "b = Ȳ₁ − a·X̄₁." },
      { label: "Vérification", detail: "La droite doit passer par G₁, G₂ et G." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La droite de Mayer des exploitations agricoles",
      instruction: "Déplace le point le long de la droite : vérifie qu'elle passe bien par G₁(2,75 ; 25) et G₂(6,4 ; 47).",
      observation: "La droite y ≈ 6,03x + 8,42 relie les deux centres de gravité G₁ et G₂. Elle traverse aussi le point moyen G(4,575 ; 36) du nuage complet — c'est la propriété clé de la méthode de Mayer.",
      formula: "y = (440/73)x + 615/73",
      formulaTex: "y=\\frac{440}{73}x+\\frac{615}{73}",
      rule: { kind: "linear", coefficient: 6.0274, constant: 8.4247 },
      window: { xMin: 0, xMax: 10, yMin: 0, yMax: 70 },
      guides: [
        { kind: "vertical", value: 4.575, label: "x = X̄" },
        { kind: "horizontal", value: 36, label: "y = Ȳ" },
      ],
      marker: { min: 0, max: 10, step: 0.05, initial: 4.575 },
    },
    questions: [
      short("Calcule la pente $a$ de la droite de Mayer des exploitations agricoles (arrondi au centième).", ["6,03", "6.03", "440/73"], "$a=(47-25)/(6{,}4-2{,}75)=440/73\\approx6{,}03$.", "Exercice de fixation, page 6", 2),
      short("Calcule $b$ (arrondi au centième).", ["8,42", "8.42", "615/73"], "$b=25-\\frac{440}{73}\\times2{,}75=\\frac{615}{73}\\approx8{,}42$.", "Exercice de fixation, page 6", 2),
      choice("Quelle formule donne l'ordonnée à l'origine ?", ["$b=\\overline{Y_1}-a\\overline{X_1}$", "$b=\\overline{X_1}-a\\overline{Y_1}$", "$b=a\\overline{X_1}-\\overline{Y_1}$", "$b=\\overline{Y_1}+a\\overline{X_1}$"], 0, "On écrit que $G_1$ appartient à la droite.", "Cours, page 6"),
      short("Nouveau-nés : calcule la pente de la droite $(G_1G_2)$ (arrondi au millième).", ["0,372", "0.372"], "$(52{,}625-49{,}65)/(41{,}5-33{,}5)=0{,}372$.", "Exercice de renforcement 1, page 13", 2),
      short("Nouveau-nés : calcule $b$ (arrondi au millième).", ["37,188", "37.188"], "$49{,}65-0{,}372\\times33{,}5=37{,}188$.", "Exercice de renforcement 1, page 13", 2),
    ],
  },
  {
    id: "covariance-correlation-regression",
    title: "Covariance d'une série double — série A1",
    summary: "Calculer la covariance de X et Y à partir des sommes de produits.",
    pages: "7-8",
    section: "II-3-a. Covariance (série A1 seulement)",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## Définition

On appelle **covariance** de la série statistique double $(X;Y)$ le nombre réel noté $\operatorname{Cov}(X,Y)$ tel que :

$$\operatorname{Cov}(X,Y)=\frac1n\sum(x_i-\overline X)(y_i-\overline Y)\qquad\text{ou}\qquad\operatorname{Cov}(X,Y)=\frac{\sum x_iy_i}{n}-\overline X\,\overline Y$$

La seconde écriture est la plus commode en pratique : on calcule d'abord $\sum x_iy_i$, puis on retranche le produit des moyennes.

### Exercice de fixation entièrement rédigé

Pour les exploitations agricoles, sachant que $G(4{,}575\,;\,36)$ :

$$\sum x_iy_i=2(14)+2(26)+3(31)+4(29)+5(44)+6(40)+7(54)+7{,}6(50)=1503$$

$$\operatorname{Cov}(X,Y)=\frac{1503}{8}-4{,}575\times36=187{,}875-164{,}7=23{,}675$$

## Rappel — les variances

$$V(X)=\frac{\sum x_i^2}{n}-\left(\overline X\right)^2\qquad V(Y)=\frac{\sum y_i^2}{n}-\left(\overline Y\right)^2$$

Pour la même série :

$$V(X)=\frac{200{,}76}{8}-4{,}575^2\approx4{,}16\qquad V(Y)=\frac{11\,626}{8}-36^2=157{,}25$$

> **Erreur fréquente.** Dans $\dfrac{\sum x_iy_i}{n}-\overline X\,\overline Y$, on soustrait le **produit des moyennes**, pas la moyenne des produits une seconde fois. Et attention : la covariance peut être **négative** — c'est même ce qui signale une relation décroissante.

> **Astuce mémoire de Davy.** « Moyenne des produits moins produit des moyennes. » La même structure que la variance ($\overline{x^2}-\overline x^2$), avec $y$ à la place du second $x$. D'ailleurs $\operatorname{Cov}(X,X)=V(X)$.`,
    keyPoint: "Cov(X,Y) = (Σxᵢyᵢ)/n − X̄·Ȳ ; elle peut être négative.",
    example: "Pour les exploitations : $\\operatorname{Cov}(X,Y)=\\frac{1503}{8}-164{,}7=23{,}675$.",
    methodSteps: [
      "Calcule la somme des produits Σxᵢyᵢ.",
      "Divise par n.",
      "Retranche le produit des deux moyennes.",
    ],
    timeline: [
      { label: "Produits", detail: "Calculer chaque xᵢyᵢ puis leur somme." },
      { label: "Moyenne", detail: "Diviser la somme par n." },
      { label: "Soustraction", detail: "Retrancher X̄ × Ȳ." },
    ],
    questions: [
      short("Calcule $\\operatorname{Cov}(X,Y)$ pour les exploitations agricoles.", ["23,675", "23.675"], "$1503/8-4{,}575\\times36=23{,}675$.", "Exercice de fixation, page 7", 2),
      short("Calcule $V(Y)$ pour cette série.", ["157,25", "157.25"], "$11\\,626/8-36^2=157{,}25$.", "Exercice de fixation, page 8", 2),
      choice("Quelle formule pratique donne la covariance ?", ["$\\frac{\\sum x_iy_i}{n}-\\overline X\\,\\overline Y$", "$\\frac{\\sum x_iy_i}{n}+\\overline X\\,\\overline Y$", "$\\frac{\\sum x_i\\sum y_i}{n}$", "$\\overline X\\,\\overline Y-\\frac{\\sum x_iy_i}{n}$"], 0, "C'est la seconde écriture de la définition.", "Définition, page 7"),
      choice("La covariance d'une série statistique double :", ["est toujours positive", "peut être négative", "est toujours comprise entre −1 et 1", "vaut toujours 0"], 1, "Son signe indique le sens de la relation entre X et Y.", "Remarques, page 8"),
      short("Site de vente en ligne : calcule la covariance sachant $\\sum x_iy_i=19\\,207\\,375$, $\\overline X=9254{,}17$ et $\\overline Y=337{,}5$.", ["77947,9", "77 947,9", "77947.9"], "$19\\,207\\,375/6-9254{,}17\\times337{,}5=77\\,947{,}9$.", "Exercice de renforcement 2, page 16", 2),
    ],
  },
  {
    id: "correlation-regression-a1",
    title: "Corrélation et droites de régression — série A1",
    summary: "Calculer le coefficient de corrélation, l'interpréter et écrire les droites de régression.",
    pages: "8-9, 16-17",
    section: "II-3-b et II-3-c. Corrélation et régressions (série A1 seulement)",
    durationMinutes: 25,
    xp: 80,
    body: String.raw`## Coefficient de corrélation linéaire

$$r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)}\sqrt{V(Y)}}$$

**Remarques du cours.**

- $r$ mesure la **dépendance linéaire** entre $X$ et $Y$.
- $r$ est de **même signe** que $\operatorname{Cov}(X,Y)$ et vérifie $-1\le r\le1$.
- Si $|r|$ est proche de 1 — en pratique $0{,}87\le r\le1$ ou $-1\le r\le-0{,}87$ — on dit qu'il y a une **forte corrélation linéaire**.

### Exercice de fixation entièrement rédigé

Pour les exploitations agricoles : $\operatorname{Cov}(X,Y)=23{,}675$, $V(X)\approx4{,}16$ et $V(Y)=157{,}25$.

$$r=\frac{23{,}675}{\sqrt{4{,}16\times157{,}25}}\approx0{,}92$$

Comme $0{,}87\le r\le1$, **il y a une forte corrélation** entre la superficie et le nombre d'exploitations.

## Les deux droites de régression

On suppose qu'il y a une forte corrélation entre $X$ et $Y$.

| Droite | Équation | Coefficients |
|---|---|---|
| Régression de $Y$ en $X$ | $(D):y=ax+b$ | $a=\dfrac{\operatorname{Cov}(X,Y)}{V(X)}$ et $b=\overline Y-a\overline X$ |
| Régression de $X$ en $Y$ | $(D'):x=a'y+b'$ | $a'=\dfrac{\operatorname{Cov}(X,Y)}{V(Y)}$ et $b'=\overline X-a'\overline Y$ |

### Exercice de fixation entièrement rédigé

$$a=\frac{23{,}675}{4{,}16}=5{,}69\qquad b=36-5{,}69\times4{,}575=9{,}97\qquad(D):y=5{,}69x+9{,}97$$

$$a'=\frac{23{,}675}{157{,}25}=0{,}15\qquad b'=4{,}575-0{,}15\times36=-0{,}825\qquad(D'):x=0{,}15y-0{,}83$$

**Remarques.** Les droites $(D)$ et $(D')$ passent par le point moyen $G$. De plus :

- $aa'=r^2$ et $|r|=\sqrt{aa'}$ ;
- si $a>0$ et $a'>0$, alors $r=\sqrt{aa'}$ ; si $a<0$ et $a'<0$, alors $r=-\sqrt{aa'}$ ;
- si $r^2=1$, alors $a=\dfrac1{a'}$ et les deux droites sont **confondues**.

> **Erreur fréquente.** Ne mélange pas les deux droites : $(D)$ sert à estimer $y$ **connaissant** $x$, et $(D')$ à estimer $x$ connaissant $y$. Leurs pentes ne sont pas inverses l'une de l'autre (sauf si $r^2=1$).

> **Astuce mémoire de Davy.** « Y en X : on divise par $V(X)$ ; X en Y : on divise par $V(Y)$. » Le dénominateur porte toujours la variable **explicative**. Et pour vérifier : le produit des deux pentes doit redonner $r^2$.`,
    keyPoint: "r = Cov/(√V(X)·√V(Y)) ; forte corrélation si |r| ≥ 0,87 ; a = Cov/V(X), a' = Cov/V(Y).",
    example: "$r=\\frac{23{,}675}{\\sqrt{4{,}16\\times157{,}25}}\\approx0{,}92$ : forte corrélation.",
    methodSteps: [
      "Calcule Cov(X,Y), V(X) et V(Y).",
      "Forme r puis compare |r| au seuil 0,87.",
      "Si la corrélation est forte, écris les droites de régression.",
    ],
    timeline: [
      { label: "Trois ingrédients", detail: "Covariance et les deux variances." },
      { label: "Corrélation", detail: "r = Cov / (√V(X)·√V(Y)), entre −1 et 1." },
      { label: "Régression", detail: "a = Cov/V(X) pour Y en X." },
    ],
    corrections: [
      "L'énoncé de l'exercice de fixation page 9 rappelle « V(X) = 4,6 » alors que la page 8 a calculé V(X) ≈ 4,16 ; c'est bien 4,16 qui est utilisé dans le calcul de a = 5,69.",
      "La formule de b′ écrite page 9 note « b′ = X̄ − aȲ » ; il faut lire b′ = X̄ − a′Ȳ, comme le confirme le calcul (4,575 − 0,15 × 36).",
    ],
    questions: [
      short("Calcule le coefficient de corrélation des exploitations agricoles (arrondi au centième).", ["0,92", "0.92"], "$23{,}675/\\sqrt{4{,}16\\times157{,}25}\\approx0{,}92$.", "Exercice de fixation, page 8", 2),
      choice("Comment interpréter $r=0{,}92$ ?", ["Aucune corrélation", "Corrélation faible", "Forte corrélation linéaire", "Corrélation négative"], 2, "$0{,}87\\le r\\le1$ : la corrélation est forte.", "Exercice de fixation, page 8"),
      short("Calcule la pente $a$ de la droite de régression de Y en X (arrondi au centième).", ["5,69", "5.69"], "$a=23{,}675/4{,}16=5{,}69$.", "Exercice de fixation, page 9", 2),
      short("Calcule $b$ (arrondi au centième).", ["9,97", "9.97"], "$b=36-5{,}69\\times4{,}575=9{,}97$.", "Exercice de fixation, page 9", 2),
      short("Calcule la pente $a'$ de la droite de X en Y (arrondi au centième).", ["0,15", "0.15"], "$a'=23{,}675/157{,}25=0{,}15$.", "Exercice de fixation, page 9", 2),
      choice("Quelle relation lie les deux pentes au coefficient de corrélation ?", ["$a+a'=r$", "$aa'=r^2$", "$a/a'=r$", "$aa'=r$"], 1, "C'est la remarque du cours page 9.", "Remarques, page 9", 2),
      short("Site de vente en ligne : calcule $r$ avec Cov = 77 947,9, V(X) = 2 878 824,8 et V(Y) = 2 181,25 (arrondi au centième).", ["0,98", "0.98"], "$77\\,947{,}9/\\sqrt{2\\,878\\,824{,}8\\times2181{,}25}\\approx0{,}98$.", "Exercice de renforcement 2, page 16", 2),
      choice("Si $r^2=1$, alors les deux droites de régression sont :", ["perpendiculaires", "confondues", "parallèles distinctes", "sécantes en O"], 1, "C'est le cas limite d'une dépendance affine parfaite.", "Remarques, page 9"),
    ],
  },
  {
    id: "statistical-estimation",
    title: "Estimation par la droite d'ajustement",
    summary: "Estimer une valeur manquante à partir de l'équation de la droite d'ajustement.",
    pages: "9-12, 17-18",
    section: "III. Estimation et C-Situation complexe",
    durationMinutes: 22,
    xp: 75,
    body: String.raw`## Le principe

- La droite d'ajustement **tracée** permet une estimation **graphique** de $y$ connaissant $x$ (ou l'inverse).
- L'**équation** de la droite permet de **calculer** cette estimation.

### Exercice de fixation entièrement rédigé

Pour les exploitations agricoles, quelle est l'estimation pour une superficie de 9 ha ?

**Par la méthode de Mayer** — avec $y\approx6x+8{,}4$ :

$$y=6\times9+8{,}4=62{,}4\;\Rightarrow\;\text{environ }63\text{ exploitations}$$

**Par les moindres carrés (série A1)** — avec $(D):y=5{,}69x+9{,}97$ :

$$y=5{,}69\times9+9{,}97=61{,}8\;\Rightarrow\;\text{environ }62\text{ exploitations}$$

Les deux méthodes donnent des résultats voisins : c'est normal, elles ajustent le même nuage.

## Situation du club littéraire

Le nombre d'adhérents d'un club croît de janvier à décembre 2020 (rangs 1 à 12). Une ONG promet une aide si le nombre dépasse **3000 adhérents**. Quand ?

**Résolution série A1 (moindres carrés).** Avec $\overline X=6{,}5$, $\overline Y=1574{,}167$, $V(X)=11{,}917$ et $\operatorname{Cov}(X,Y)=1025{,}414$ :

$$a=\frac{1025{,}414}{11{,}917}=86{,}046\qquad b=1574{,}167-86{,}046\times6{,}5=1014{,}868$$

$$(D):y=86{,}046x+1014{,}868$$

Pour $y=3000$ : $x=\dfrac{3000-1014{,}868}{86{,}046}=23{,}07$, donc le rang cherché est **24**.

Le rang 1 étant janvier 2020, le rang 24 correspond à **décembre 2021**.

> **Erreur fréquente.** Le rang obtenu est presque toujours décimal : il faut l'**arrondir à l'entier supérieur**, puisque le seuil n'est franchi qu'au mois suivant. Et n'oublie pas de retraduire le rang en mois **et année**.

> **Astuce mémoire de Davy.** « L'équation sert dans les deux sens. » Tu connais $x$ ? Tu remplaces. Tu connais $y$ ? Tu résous $ax+b=y$. Une estimation reste une **prévision** : elle suppose que la tendance se poursuit.`,
    keyPoint: "On remplace x dans l'équation pour estimer y — ou on résout ax + b = y pour estimer x.",
    example: "$y=5{,}69\\times9+9{,}97=61{,}8$ : environ 62 exploitations pour 9 ha.",
    methodSteps: [
      "Choisis la droite adaptée au sens de l'estimation.",
      "Remplace la valeur connue dans l'équation.",
      "Arrondis en tenant compte du contexte concret.",
    ],
    timeline: [
      { label: "Droite", detail: "Y en X pour estimer y ; X en Y pour estimer x." },
      { label: "Substitution", detail: "Remplacer la valeur connue dans l'équation." },
      { label: "Interprétation", detail: "Arrondir et retraduire dans le contexte." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Estimer avec la droite de régression",
      instruction: "Place le point sur x = 9 (superficie de 9 ha) : quelle valeur de y la droite prédit-elle ?",
      observation: "En x = 9, la droite (D) : y = 5,69x + 9,97 donne y = 61,8 — soit environ 62 exploitations. La droite passe aussi par le point moyen G(4,575 ; 36), comme toute droite d'ajustement.",
      formula: "(D) : y = 5,69x + 9,97",
      formulaTex: "(D):y=5{,}69x+9{,}97",
      rule: { kind: "linear", coefficient: 5.69, constant: 9.97 },
      window: { xMin: 0, xMax: 11, yMin: 0, yMax: 75 },
      guides: [
        { kind: "vertical", value: 9, label: "x = 9 ha" },
        { kind: "horizontal", value: 61.8, label: "y ≈ 61,8" },
      ],
      marker: { min: 0, max: 11, step: 0.05, initial: 9 },
    },
    corrections: [
      "Dans la résolution TA2 du club littéraire (page 11), la moyenne de la seconde sous-série utilise 1740 au lieu de 1940 — la valeur d'octobre inscrite dans le tableau de la page 10. Avec la valeur correcte, ȳ₂ = 1811,67 (et non 1778,33), la droite de Mayer devient y = 78,89x + 1062,22 et le seuil de 3000 est atteint au rang 25, soit janvier 2022 au lieu de mars 2022. La résolution TA1 par les moindres carrés, elle, utilise bien les douze valeurs exactes.",
    ],
    questions: [
      short("Estime le nombre d'exploitations pour 9 ha avec $(D):y=5{,}69x+9{,}97$.", ["61,8", "61.8", "62"], "$5{,}69\\times9+9{,}97=61{,}8$, soit environ 62.", "Exercice de fixation, page 10", 2),
      short("Estime-le avec la droite de Mayer $y=6x+8{,}4$.", ["62,4", "62.4", "63"], "$6\\times9+8{,}4=62{,}4$, soit environ 63.", "Exercice de fixation, page 10"),
      short("Club littéraire : calcule la pente $a$ de la droite de régression (arrondi au millième).", ["86,046", "86.046"], "$a=1025{,}414/11{,}917=86{,}046$.", "C-Situation complexe, page 12", 2),
      short("Quel rang correspond au seuil de 3000 adhérents ?", ["24", "rang 24"], "$x=(3000-1014{,}868)/86{,}046=23{,}07$, donc le rang 24.", "C-Situation complexe, page 12", 2),
      choice("À quelle date le don pourra-t-il être reçu (résolution A1) ?", ["Décembre 2020", "Décembre 2021", "Mars 2022", "Janvier 2021"], 1, "Le rang 1 est janvier 2020, donc le rang 24 est décembre 2021.", "C-Situation complexe, page 12", 2),
      short("Véhicules : avec $(D):y=0{,}03x+0{,}311$, calcule le PRK d'une voiture de 10 CV.", ["0,611", "0.611", "0,61", "0.61"], "$0{,}03\\times10+0{,}311=0{,}611$.", "Exercice d'approfondissement 1, page 18"),
      short("Véhicules : quelle puissance maximale correspond à un PRK de 0,650 € ?", ["11,3", "11.3"], "$x=(0{,}650-0{,}311)/0{,}03=11{,}3$ CV.", "Exercice d'approfondissement 1, page 18", 2),
    ],
  },
  {
    id: "weather-correlation-mission",
    title: "Mission finale — pluviométrie et température",
    summary: "Mener une étude complète : corrélation, droite de régression et prévision météorologique.",
    pages: "1, 21-22",
    section: "Situation complexe finale",
    durationMinutes: 32,
    xp: 90,
    kind: "challenge",
    body: String.raw`## L'énoncé

Le tableau donne les pluviométries et températures moyennes de septembre 2018 à août 2019 dans une ville :

| Mois | S18 | O18 | N18 | D18 | J19 | F19 | M19 | A19 | M19 | J19 | J19 | A19 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Pluviométrie $x_i$ (mm) | 13 | 23 | 49 | 49 | 50 | 64 | 79 | 48 | 40 | 10 | 5 | 6 |
| Température $y_i$ (°C) | 23 | 17 | 14 | 10 | 10 | 11 | 13 | 15 | 17 | 23 | 27 | 28 |

La température moyenne d'octobre 2019 était de **32 °C**. La pluviométrie est-elle liée à la température ? Si oui, quelle pluviométrie prévoir pour octobre 2019 ?

## 1. Le tableau des calculs

| | Totaux |
|---|---|
| $\sum x_i$ | $436$ |
| $\sum y_i$ | $208$ |
| $\sum x_iy_i$ | $6030$ |
| $\sum x_i^2$ | $22\,402$ |
| $\sum y_i^2$ | $4060$ |

## 2. Le point moyen

$$\overline X=\frac{436}{12}\approx36{,}333\qquad\overline Y=\frac{208}{12}\approx17{,}333\qquad G(36{,}333\,;\,17{,}333)$$

## 3. Variances et covariance

$$V(X)=\frac{22\,402}{12}-36{,}333^2\approx546{,}746$$

$$V(Y)=\frac{4060}{12}-17{,}333^2\approx37{,}9$$

$$\operatorname{Cov}(X,Y)=\frac{6030}{12}-36{,}333\times17{,}333\approx-127{,}26$$

La covariance est **négative** : quand la pluviométrie augmente, la température tend à baisser.

## 4. Le coefficient de corrélation

$$r=\frac{-127{,}26}{\sqrt{546{,}746\times37{,}9}}\approx-0{,}884$$

Comme $0{,}87\le|r|<1$, il y a une **bonne corrélation linéaire**.

> **Conclusion : la pluviométrie est bien liée à la température.**

## 5. La prévision d'octobre 2019

$$a=\frac{-127{,}26}{546{,}746}\approx-0{,}233\qquad b=17{,}333+0{,}233\times36{,}333\approx25{,}798$$

$$(D):y=-0{,}233x+25{,}798$$

Pour $y=32$ :

$$x=\frac{32-25{,}798}{-0{,}233}\approx-26{,}62$$

**Conclusion : pour une température moyenne de 32 °C, la pluviométrie d'octobre 2019 est quasi nulle.**

> **Comment lire un résultat négatif ?** Une pluviométrie ne peut pas être négative : le modèle sort de son domaine de validité. On conclut donc « pluviométrie quasi nulle », et non « −26,62 mm ». C'est un rappel utile : une régression n'est fiable que **dans la plage des données observées** (ici de 5 à 79 mm, pour des températures de 10 à 28 °C).

> **Erreur fréquente.** Un coefficient $r$ négatif ne signifie pas « pas de corrélation » : c'est le **signe** de la relation, et c'est $|r|$ qu'on compare au seuil de 0,87. Ici $|-0{,}884|=0{,}884\ge0{,}87$ : la corrélation est bel et bien forte.

> **Astuce mémoire de Davy.** « Corrélation n'est pas causalité. » Les données montrent que pluie et chaleur varient en sens inverse dans cette ville — pas que l'une cause l'autre. Et une prévision hors plage doit toujours être interprétée avec prudence.`,
    keyPoint: "Cov < 0 → relation décroissante ; on compare |r| au seuil 0,87 ; hors plage, une prévision s'interprète.",
    example: "$r\\approx-0{,}884$ et $(D):y=-0{,}233x+25{,}798$ donnent une pluviométrie quasi nulle pour 32 °C.",
    methodSteps: [
      "Dresse le tableau des sommes : Σxᵢ, Σyᵢ, Σxᵢyᵢ, Σxᵢ², Σyᵢ².",
      "Calcule G, les variances, la covariance puis r.",
      "Si |r| ≥ 0,87, écris la droite de régression et conclus dans le contexte.",
    ],
    timeline: [
      { label: "Sommes", detail: "Un tableau de calculs évite toutes les erreurs." },
      { label: "Corrélation", detail: "Comparer |r| au seuil 0,87 pour valider le lien." },
      { label: "Prévision", detail: "Utiliser (D) puis interpréter dans le contexte réel." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La droite de régression pluviométrie / température",
      instruction: "Déplace le point : où la droite atteint-elle 32 °C ? Que vaut alors la pluviométrie ?",
      observation: "La droite descend : plus il pleut, plus la température baisse. Elle atteint y = 32 °C pour x ≈ −26,6 mm — une valeur impossible pour une pluviométrie. On conclut donc que la pluviométrie d'octobre 2019 est quasi nulle.",
      formula: "(D) : y = -0,233x + 25,798",
      formulaTex: "(D):y=-0{,}233x+25{,}798",
      rule: { kind: "linear", coefficient: -0.233, constant: 25.798 },
      window: { xMin: -30, xMax: 85, yMin: 0, yMax: 36 },
      guides: [
        { kind: "horizontal", value: 32, label: "y = 32 °C" },
        { kind: "vertical", value: 0, label: "x = 0 mm" },
      ],
      marker: { min: -30, max: 85, step: 0.5, initial: 36.5 },
    },
    questions: [
      short("Calcule $\\overline X$, la pluviométrie moyenne (arrondi au millième).", ["36,333", "36.333"], "$436/12\\approx36{,}333$.", "Situation complexe, page 21"),
      short("Calcule $\\overline Y$, la température moyenne (arrondi au millième).", ["17,333", "17.333"], "$208/12\\approx17{,}333$.", "Situation complexe, page 21"),
      short("Calcule $V(X)$ (arrondi au millième).", ["546,746", "546.746"], "$22\\,402/12-36{,}333^2\\approx546{,}746$.", "Situation complexe, page 21", 2),
      short("Calcule $V(Y)$ (arrondi au dixième).", ["37,9", "37.9"], "$4060/12-17{,}333^2\\approx37{,}9$.", "Situation complexe, page 22", 2),
      short("Calcule $\\operatorname{Cov}(X,Y)$ (arrondi au centième).", ["-127,26", "-127.26", "−127,26"], "$6030/12-36{,}333\\times17{,}333\\approx-127{,}26$.", "Situation complexe, page 22", 2),
      short("Calcule le coefficient de corrélation $r$ (arrondi au millième).", ["-0,884", "-0.884", "−0,884"], "$-127{,}26/\\sqrt{546{,}746\\times37{,}9}\\approx-0{,}884$.", "Situation complexe, page 22", 2),
      choice("Que conclure de $r=-0{,}884$ ?", ["Aucun lien entre les deux caractères", "Une bonne corrélation : la pluviométrie est liée à la température", "Une corrélation trop faible pour conclure", "Une erreur de calcul, car r est négatif"], 1, "$|r|=0{,}884\\ge0{,}87$ : la corrélation est forte, et négative.", "Situation complexe, page 22", 2),
      short("Donne la pente $a$ de la droite de régression (arrondi au millième).", ["-0,233", "-0.233", "−0,233"], "$a=-127{,}26/546{,}746\\approx-0{,}233$.", "Situation complexe, page 22", 2),
      short("Donne l'ordonnée à l'origine $b$ (arrondi au millième).", ["25,798", "25.798"], "$b=17{,}333+0{,}233\\times36{,}333\\approx25{,}798$.", "Situation complexe, page 22", 2),
      choice("Quelle pluviométrie prévoir pour octobre 2019 (32 °C) ?", ["Environ 27 mm", "Une pluviométrie quasi nulle", "Environ 32 mm", "On ne peut rien conclure"], 1, "$x\\approx-26{,}62$ : valeur impossible, donc pluviométrie quasi nulle.", "Situation complexe, page 22", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalABivariateStatisticsPath: LearningPath = {
  id: "terminale-a-bivariate-statistics",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 3, title: "Organisation et traitement des données" },
  chapterNumber: 6,
  title: "Statistique à deux variables",
  description: "Le cours officiel intégral : séries doubles, nuage de points, point moyen, ajustement de Mayer, covariance, corrélation, droites de régression, estimation et mission finale de prévision météorologique.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Construire un nuage de points",
    "Calculer un ajustement affine",
    "Interpréter une corrélation et estimer une valeur",
  ],
  modules: [{
    id: "terminale-a-bivariate-statistics-mastery",
    title: "Maîtriser la statistique à deux variables",
    description: "Progression fidèle au document source ; la situation d'apprentissage météorologique n'apparaît que comme mission finale, en contexte d'évaluation.",
    lessons: builtLevels,
  }],
};
