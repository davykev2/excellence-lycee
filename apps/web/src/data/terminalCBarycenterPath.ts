import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 02 Barycentre.pdf";

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
  questions: LessonQuestion[];
  corrections?: string[];
}

/**
 * Poids identiques au générateur historique et au registre API.
 * Les huit identifiants existants conservent leur ordre ; la mission finale
 * reçoit le poids maximal prévu par la formule.
 */
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
    interaction: {
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
      introduction: "Applique cette démarche aux exercices officiels après avoir vérifié les conditions de la propriété.",
      steps: seed.methodSteps,
      example: {
        prompt: "Mini-exemple guidé",
        work: seed.example,
        result: seed.keyPoint,
      },
      tip: "Écris la somme des coefficients avant toute manipulation : elle décide presque toujours de la méthode.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "weighted-barycenter",
    title: "Barycentre de points pondérés",
    summary: "Définir le barycentre, vérifier son existence et exprimer sa position à partir des points pondérés.",
    pages: "1-2",
    section: "I-1. Propriété et définition",
    durationMinutes: 28,
    body: String.raw`## Points pondérés et condition d’existence

Dans toute la leçon, on considère $n$ points pondérés

$$(A_1,\alpha_1),(A_2,\alpha_2),\ldots,(A_n,\alpha_n),\qquad n\in\mathbb{N}\setminus\{0;1\}.$$

Si

$$\alpha_1+\alpha_2+\cdots+\alpha_n\ne0,$$

alors il existe un **unique** point $G$ tel que

$$\alpha_1\overrightarrow{GA_1}+\alpha_2\overrightarrow{GA_2}+\cdots+\alpha_n\overrightarrow{GA_n}=\vec 0.$$

Ce point $G$ est le **barycentre** des points pondérés. On note :

$$G=\operatorname{bar}\{(A_1,\alpha_1),(A_2,\alpha_2),\ldots,(A_n,\alpha_n)\}.$$

Si la somme des coefficients est nulle, le barycentre n’existe pas.

### Exprimer la position de $G$ depuis un point du système

En prenant $A_1$ comme origine des vecteurs, la relation barycentrique donne :

$$\overrightarrow{A_1G}
=\frac{\alpha_2}{\sum_{i=1}^{n}\alpha_i}\overrightarrow{A_1A_2}
+\frac{\alpha_3}{\sum_{i=1}^{n}\alpha_i}\overrightarrow{A_1A_3}
+\cdots+
\frac{\alpha_n}{\sum_{i=1}^{n}\alpha_i}\overrightarrow{A_1A_n}.$$

La même démarche peut partir de n’importe quel point $A_k$.

### Cas de deux points

Si $G=\operatorname{bar}\{(A,\alpha),(B,\beta)\}$ avec $\alpha+\beta\ne0$, alors :

$$\overrightarrow{AG}=\frac{\beta}{\alpha+\beta}\overrightarrow{AB}.$$

| Somme $\alpha+\beta$ | Position de $G$ |
|---|---|
| coefficients de même signe | $G$ se trouve entre $A$ et $B$ |
| coefficients de signes contraires | $G$ peut se trouver à l’extérieur de $[AB]$ |
| somme nulle | aucun barycentre |

> **Astuce mémoire de Davy.** Commence toujours par la **somme des poids**. Si elle vaut zéro, arrête : aucun barycentre. Sinon, la somme devient le dénominateur de toutes les formules.

> **Erreur fréquente.** Dans la relation de définition, les vecteurs partent tous de $G$. Mélanger $\overrightarrow{GA_i}$ et $\overrightarrow{A_iG}$ change les signes.`,
    keyPoint: "Σαᵢ ≠ 0 et Σαᵢ·GAᵢ = 0 définissent l’unique barycentre G.",
    example: "Pour $(A,2)$ et $(B,3)$, la somme vaut $5$ et $\\overrightarrow{AG}=\\frac35\\overrightarrow{AB}$.",
    methodSteps: [
      "Calcule la somme s des coefficients.",
      "Si s=0, conclus que le barycentre n’existe pas.",
      "Choisis un point de départ pratique, souvent A₁ ou un sommet du parallélogramme.",
      "Décompose les vecteurs avec Chasles, regroupe les termes en G puis divise par s.",
    ],
    timeline: [
      { label: "Additionner", detail: "Calculer la somme des coefficients avant tout autre travail." },
      { label: "Décider", detail: "Somme non nulle : barycentre unique ; somme nulle : aucun barycentre." },
      { label: "Décomposer", detail: "Utiliser Chasles pour exprimer tous les vecteurs depuis un même point." },
      { label: "Isoler G", detail: "Diviser par la somme des coefficients et interpréter la position obtenue." },
    ],
    questions: [
      short("Dans le parallélogramme $ABCD$, calcule la somme des coefficients de $(A,-1),(B,1),(C,1),(D,4)$.", ["5"], "$-1+1+1+4=5$.", "Exercice de fixation • page 2"),
      choice("Ces quatre points pondérés admettent-ils un barycentre ?", ["Oui, car la somme vaut 5", "Non, car un coefficient est négatif", "Non, car il y a quatre points"], 0, "Un coefficient peut être négatif ; seule la somme non nulle est indispensable.", "Exercice de fixation • page 2"),
      choice("Quelle relation définit leur barycentre $G$ ?", [
        "$-\\overrightarrow{GA}+\\overrightarrow{GB}+\\overrightarrow{GC}+4\\overrightarrow{GD}=\\vec0$",
        "$\\overrightarrow{AG}+\\overrightarrow{BG}+\\overrightarrow{CG}+\\overrightarrow{DG}=\\vec0$",
        "$-\\overrightarrow{AG}+\\overrightarrow{BG}+\\overrightarrow{CG}+4\\overrightarrow{DG}=\\vec0$",
      ], 0, "Les vecteurs partent tous de $G$ et conservent les coefficients.", "Exercice de fixation • page 2", 2),
      choice("Dans un parallélogramme, quelle identité permet de simplifier $\\overrightarrow{AC}$ ?", [
        "$\\overrightarrow{AC}=\\overrightarrow{AB}+\\overrightarrow{AD}$",
        "$\\overrightarrow{AC}=\\overrightarrow{AB}-\\overrightarrow{AD}$",
        "$\\overrightarrow{AC}=2\\overrightarrow{AB}$",
      ], 0, "La règle du parallélogramme donne la somme des deux côtés issus de $A$.", "Exercice de fixation • page 2"),
      choice("Quelle expression finale obtient-on ?", [
        "$\\overrightarrow{AG}=\\frac15(2\\overrightarrow{AB}+5\\overrightarrow{AD})$",
        "$\\overrightarrow{AG}=2\\overrightarrow{AB}+5\\overrightarrow{AD}$",
        "$\\overrightarrow{AG}=\\frac15(\\overrightarrow{AB}+4\\overrightarrow{AD})$",
      ], 0, "On obtient d’abord $\\frac15(\\overrightarrow{AB}+\\overrightarrow{AC}+4\\overrightarrow{AD})$, puis on remplace $\\overrightarrow{AC}$.", "Exercice de fixation • page 2", 3),
      choice("Si la somme des coefficients vaut zéro, quelle conclusion est correcte ?", ["Le barycentre n’existe pas", "Le barycentre est l’origine", "Tous les points conviennent"], 0, "La définition exige une somme non nulle.", "Propriété • page 1"),
      short("Pour $G=\\operatorname{bar}\\{(A,2),(B,3)\\}$, quel nombre multiplie $\\overrightarrow{AB}$ dans $\\overrightarrow{AG}$ ?", ["3/5", "0,6", "0.6"], "$\\frac{\\beta}{\\alpha+\\beta}=\\frac35$.", "Propriété • page 2", 2),
    ],
  },
  {
    id: "isobarycenter-homogeneity",
    title: "Isobarycentre et homogénéité",
    summary: "Reconnaître les isobarycentres usuels et utiliser la proportionnalité des coefficients.",
    pages: "3",
    section: "I-2 et I-3-a. Isobarycentre et homogénéité",
    durationMinutes: 24,
    body: String.raw`## Isobarycentre

Lorsque tous les coefficients sont égaux à un même réel non nul $\alpha$, le barycentre est appelé **isobarycentre** des points $A_1,A_2,\ldots,A_n$.

$$G=\operatorname{bar}\{(A_1,\alpha),(A_2,\alpha),\ldots,(A_n,\alpha)\}.$$

Dans ce cas :

$$\sum_{i=1}^{n}\overrightarrow{GA_i}=\vec0.$$

### Trois figures à connaître

| Points | Isobarycentre |
|---|---|
| deux points $A$ et $B$ | le milieu de $[AB]$ |
| trois points non alignés | le centre de gravité du triangle |
| quatre sommets d’un parallélogramme | le centre du parallélogramme |

Ainsi, si $O$ est le centre du parallélogramme $ABCD$ :

$$\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC}+\overrightarrow{OD}=\vec0.$$

## Homogénéité

Le barycentre ne change pas lorsque l’on multiplie **tous** les coefficients par un même réel $k\ne0$ :

$$\operatorname{bar}\{(A_i,\alpha_i)\}
=\operatorname{bar}\{(A_i,k\alpha_i)\}.$$

Seuls les **rapports** entre les coefficients comptent.

### Retrouver des coefficients à partir d’une position

Pour deux points :

$$\overrightarrow{AG}=\frac{\beta}{\alpha+\beta}\overrightarrow{AB}.$$

Si $\overrightarrow{AG}=\dfrac34\overrightarrow{AB}$, alors on cherche

$$\frac{\beta}{\alpha+\beta}=\frac34,$$

d’où $\beta=3\alpha$. Tous les couples proportionnels à $(1,3)$ conviennent.

> **Astuce mémoire de Davy.** **Iso** signifie « égal » : coefficients égaux. **Homogène** signifie « même proportion » : on peut agrandir ou réduire tous les poids ensemble.

> **Erreur fréquente.** Multiplier un seul coefficient déplace le barycentre. L’homogénéité exige le même multiplicateur pour tous les coefficients.`,
    keyPoint: "Coefficients égaux : isobarycentre ; coefficients proportionnels : même barycentre.",
    example: "$(A,1),(B,3)$ et $(A,2),(B,6)$ ont le même barycentre, situé aux trois quarts de $[AB]$ depuis $A$.",
    methodSteps: [
      "Repère si tous les coefficients sont égaux : utilise alors une figure usuelle.",
      "Pour deux points, traduis la position par β/(α+β).",
      "Résous la proportion entre α et β.",
      "Utilise l’homogénéité pour reconnaître tous les couples équivalents.",
    ],
    timeline: [
      { label: "Reconnaître", detail: "Deux points : milieu ; trois sommets : centre de gravité." },
      { label: "Traduire", detail: "Passer de la position de G au quotient β/(α+β)." },
      { label: "Proportionner", detail: "Déterminer le rapport entre les coefficients." },
      { label: "Simplifier", detail: "Diviser ou multiplier tous les coefficients par un même réel non nul." },
    ],
    questions: [
      choice("L’isobarycentre de deux points distincts $A$ et $B$ est…", ["le milieu de $[AB]$", "le point $A$", "un point extérieur à $[AB]$"], 0, "Deux coefficients égaux donnent $\\overrightarrow{AG}=\\frac12\\overrightarrow{AB}$.", "Définition • page 3"),
      choice("L’isobarycentre des sommets d’un triangle non aplati est…", ["son centre de gravité", "son orthocentre", "le milieu d’un côté"], 0, "C’est le barycentre des trois sommets affectés du même coefficient.", "Remarque • page 3"),
      choice("Dans un parallélogramme $ABCD$ de centre $O$, quelle somme est nulle ?", [
        "$\\overrightarrow{OA}+\\overrightarrow{OB}+\\overrightarrow{OC}+\\overrightarrow{OD}$",
        "$\\overrightarrow{AO}+\\overrightarrow{BO}$",
        "$\\overrightarrow{AB}+\\overrightarrow{BC}$",
      ], 0, "$O$ est l’isobarycentre des quatre sommets.", "Exemple • page 3", 2),
      short("Si $\\overrightarrow{AG}=\\frac34\\overrightarrow{AB}$, quel rapport $\\beta/\\alpha$ faut-il avoir ?", ["3", "3/1"], "L’équation $\\frac{\\beta}{\\alpha+\\beta}=\\frac34$ donne $\\beta=3\\alpha$.", "Exercice de fixation • page 3", 2),
      choice("Parmi les propositions du PDF, quels couples conviennent ?", [
        "b) $(A,2),(B,6)$ et e) $(A,-\\frac12),(B,-\\frac32)$",
        "a) $(A,1),(B,2)$ uniquement",
        "c) $(A,-2),(B,2)$ uniquement",
      ], 0, "Les deux couples sont proportionnels à $(1,3)$.", "Exercice de fixation • page 3", 3),
      choice("Pourquoi le cas $(A,-2),(B,2)$ ne convient-il pas ?", ["La somme des coefficients vaut zéro", "Les coefficients sont trop grands", "Les coefficients sont entiers"], 0, "$-2+2=0$ : le barycentre n’existe pas.", "Exercice de fixation • page 3"),
      choice("Multiplier tous les coefficients par $-5$ change-t-il le barycentre ?", ["Non", "Oui", "Seulement pour deux points"], 0, "Le multiplicateur est non nul et commun à tous les coefficients.", "Homogénéité • page 3"),
    ],
  },
  {
    id: "weighted-vector-reduction",
    title: "Réduction d’une somme vectorielle",
    summary: "Réduire une somme pondérée de vecteurs selon que la somme des coefficients est nulle ou non.",
    pages: "3-4",
    section: "I-3-b. Réduction d’une somme vectorielle",
    durationMinutes: 28,
    body: String.raw`## Le cas où la somme des coefficients est non nulle

Soient $(A_i,\alpha_i)$ des points pondérés et $M$ un point quelconque. Si

$$s=\sum_{i=1}^{n}\alpha_i\ne0,$$

et si $G$ est leur barycentre, alors :

$$\sum_{i=1}^{n}\alpha_i\overrightarrow{MA_i}
=s\overrightarrow{MG}.$$

### Pourquoi ?

Par Chasles,

$$\overrightarrow{MA_i}=\overrightarrow{MG}+\overrightarrow{GA_i}.$$

Donc

$$\sum\alpha_i\overrightarrow{MA_i}
=\left(\sum\alpha_i\right)\overrightarrow{MG}
+\underbrace{\sum\alpha_i\overrightarrow{GA_i}}_{\vec0}.$$

## Le cas où la somme vaut zéro

Si

$$\sum_{i=1}^{n}\alpha_i=0,$$

alors la somme vectorielle $\sum\alpha_i\overrightarrow{MA_i}$ est **indépendante de $M$** : c’est un vecteur constant.

Pour le calculer, choisis le point $M$ qui annule le plus de vecteurs, par exemple $M=A$ si $A$ figure dans la somme.

| Somme des coefficients | Réduction |
|---|---|
| $s\ne0$ | $s\overrightarrow{MG}$ |
| $s=0$ | vecteur constant, indépendant de $M$ |

> **Astuce mémoire de Davy.** **Somme non nulle : un point $G$ apparaît. Somme nulle : le point $M$ disparaît.**

> **Erreur fréquente.** Lorsque la somme vaut zéro, n’écris pas $0\overrightarrow{MG}=\vec0$. La somme est constante, mais elle n’est pas forcément nulle.`,
    keyPoint: "Σαᵢ·MAᵢ = (Σαᵢ)·MG si la somme est non nulle ; si elle vaut 0, le vecteur est constant.",
    example: "$2\\overrightarrow{MA}+\\overrightarrow{MB}$ se réduit à $3\\overrightarrow{MG}$, avec $G=\\operatorname{bar}\\{(A,2),(B,1)\\}$.",
    methodSteps: [
      "Additionne les coefficients.",
      "Si la somme est non nulle, définis le barycentre G et remplace la somme par s·MG.",
      "Si la somme est nulle, choisis M égal à un point de la figure pour simplifier.",
      "Utilise les relations de la figure, comme AC=AB+AD dans un parallélogramme.",
    ],
    timeline: [
      { label: "Sommer", detail: "La somme des coefficients choisit l’une des deux propriétés." },
      { label: "Barycentrer", detail: "Si elle est non nulle, introduire G et obtenir s·MG." },
      { label: "Fixer M", detail: "Si elle est nulle, remplacer M par un point pratique." },
      { label: "Simplifier", detail: "Exploiter Chasles et les relations géométriques." },
    ],
    questions: [
      short("Calcule la somme des coefficients de $3\\overrightarrow{MA}+\\overrightarrow{MB}+\\overrightarrow{MC}-2\\overrightarrow{MD}$.", ["3"], "$3+1+1-2=3$.", "Exercice de fixation • page 4"),
      choice("Cette somme vectorielle se réduit à…", ["$3\\overrightarrow{MG}$", "$\\overrightarrow{MG}$", "$\\vec0$"], 0, "$G$ est le barycentre de $(A,3),(B,1),(C,1),(D,-2)$.", "Exercice de fixation • page 4", 2),
      short("Calcule la somme des coefficients de $4\\overrightarrow{MA}-5\\overrightarrow{MB}+2\\overrightarrow{MC}-\\overrightarrow{MD}$.", ["0"], "$4-5+2-1=0$.", "Exercice de fixation • page 4"),
      choice("Que peut-on alors affirmer ?", ["La somme est indépendante de $M$", "La somme est forcément nulle", "Un barycentre $G$ existe"], 0, "Une somme nulle de coefficients produit un vecteur constant.", "Exercice de fixation • page 4", 2),
      choice("Quel choix de $M$ simplifie immédiatement le calcul du PDF ?", ["$M=A$", "$M=G$", "$M=O$ obligatoirement"], 0, "$\\overrightarrow{AA}=\\vec0$ et les autres vecteurs partent alors de $A$.", "Exercice de fixation • page 4"),
      choice("Dans le parallélogramme, quel vecteur constant obtient-on ?", [
        "$-3\\overrightarrow{AB}+\\overrightarrow{AD}$",
        "$3\\overrightarrow{AB}-\\overrightarrow{AD}$",
        "$-5\\overrightarrow{AB}+2\\overrightarrow{AD}$",
      ], 0, "$-5\\overrightarrow{AB}+2\\overrightarrow{AC}-\\overrightarrow{AD}$ devient $-3\\overrightarrow{AB}+\\overrightarrow{AD}$.", "Exercice de fixation • page 4", 3),
      choice("Si $\\sum\\alpha_i=0$, peut-on introduire le barycentre des $(A_i,\\alpha_i)$ ?", ["Non", "Oui, il est égal à $M$", "Oui, il est quelconque"], 0, "La condition d’existence du barycentre n’est pas satisfaite.", "Propriété • page 4"),
    ],
  },
  {
    id: "barycenter-coordinates",
    title: "Coordonnées du barycentre",
    summary: "Calculer séparément les coordonnées d’un barycentre dans le plan ou dans l’espace.",
    pages: "4-5",
    section: "I-3-c. Coordonnées du barycentre",
    durationMinutes: 24,
    body: String.raw`## Formule dans l’espace

Dans un repère $(O;\vec i,\vec j,\vec k)$, soient des points

$$A_i(x_i;y_i;z_i)$$

affectés des coefficients $\alpha_i$, avec $\sum\alpha_i\ne0$. Les coordonnées de leur barycentre $G$ sont :

$$x_G=\frac{\sum_{i=1}^{n}\alpha_i x_i}{\sum_{i=1}^{n}\alpha_i},\qquad
y_G=\frac{\sum_{i=1}^{n}\alpha_i y_i}{\sum_{i=1}^{n}\alpha_i},\qquad
z_G=\frac{\sum_{i=1}^{n}\alpha_i z_i}{\sum_{i=1}^{n}\alpha_i}.$$

Dans le plan, on utilise simplement les deux premières formules.

### Tableau de calcul conseillé

| Point | coefficient | $\alpha_i x_i$ | $\alpha_i y_i$ | $\alpha_i z_i$ |
|---|---:|---:|---:|---:|
| $A_i$ | $\alpha_i$ | produit | produit | produit |
| Total | $\sum\alpha_i$ | $\sum\alpha_i x_i$ | $\sum\alpha_i y_i$ | $\sum\alpha_i z_i$ |

Cette organisation évite de perdre un signe négatif.

### Exemple guidé

Pour $A(0;-1;2)$, $B(8;5;-1)$ et $C(8;-5;-2)$ affectés des coefficients $-1$, $1$ et $-1$ :

$$s=-1+1-1=-1.$$

Puis :

$$x_G=\frac{-1\times0+1\times8-1\times8}{-1}=0,$$

$$y_G=\frac{-1\times(-1)+1\times5-1\times(-5)}{-1}=-11,$$

$$z_G=\frac{-1\times2+1\times(-1)-1\times(-2)}{-1}=1.$$

Ainsi $G(0;-11;1)$.

> **Astuce mémoire de Davy.** Une coordonnée à la fois, mais **toujours le même dénominateur** : la somme des coefficients.

> **Erreur fréquente.** Le coefficient négatif multiplie toute la coordonnée. Écris des parenthèses autour des nombres négatifs avant de calculer.`,
    keyPoint: "Chaque coordonnée de G est la moyenne pondérée correspondante, divisée par Σαᵢ.",
    example: "Pour $(A,1)$ et $(B,3)$ sur une droite avec $x_A=0$, $x_B=4$, on obtient $x_G=(0+12)/4=3$.",
    methodSteps: [
      "Calcule le dénominateur s=Σαᵢ et vérifie qu’il est non nul.",
      "Calcule séparément Σαᵢxᵢ, Σαᵢyᵢ et, dans l’espace, Σαᵢzᵢ.",
      "Divise chaque numérateur par le même nombre s.",
      "Contrôle les signes et écris le point avec toutes ses coordonnées.",
    ],
    timeline: [
      { label: "Dénominateur", detail: "Additionner les coefficients une seule fois." },
      { label: "Produits", detail: "Multiplier chaque coordonnée par son coefficient." },
      { label: "Colonnes", detail: "Additionner séparément les produits en x, y et z." },
      { label: "Coordonnées", detail: "Diviser chaque total par la même somme." },
    ],
    questions: [
      short("Pour les points du PDF affectés de $-1$, $1$ et $-1$, calcule $s=\\sum\\alpha_i$.", ["-1"], "$-1+1-1=-1$.", "Exercice de fixation • page 5"),
      short("Calcule l’abscisse $x_G$.", ["0"], "Le numérateur vaut $-1\\times0+1\\times8-1\\times8=0$.", "Exercice de fixation • page 5"),
      short("Calcule l’ordonnée $y_G$.", ["-11"], "Le numérateur vaut $1+5+5=11$, puis $11/(-1)=-11$.", "Exercice de fixation • page 5", 2),
      short("Calcule la cote $z_G$.", ["1"], "Le numérateur vaut $-2-1+2=-1$, puis $(-1)/(-1)=1$.", "Exercice de fixation • page 5", 2),
      choice("Quel triplet est celui de $G$ ?", ["$(0;-11;1)$", "$(-11;1;2)$", "$(8;5;0)$"], 0, "Les trois calculs donnent respectivement 0, -11 et 1.", "Exercice de fixation • page 5", 3),
      choice("Dans toutes les coordonnées, quel dénominateur utilise-t-on ?", ["$\\sum\\alpha_i$", "$n$", "$\\sum x_i$"], 0, "C’est la somme commune des coefficients.", "Propriété • page 4"),
    ],
  },
  {
    id: "partial-barycenter",
    title: "Barycentre partiel et construction",
    summary: "Regrouper plusieurs points pondérés en un barycentre intermédiaire pour simplifier une construction.",
    pages: "5",
    section: "I-3-d. Barycentre partiel",
    durationMinutes: 27,
    body: String.raw`## Propriété du barycentre partiel

Soit

$$G=\operatorname{bar}\{(A_1,\alpha_1),\ldots,(A_n,\alpha_n)\},\qquad n\ge3.$$

On peut remplacer $p$ de ces points, avec $1<p<n$, par leur barycentre $H$, à condition que la somme de leurs coefficients soit non nulle.

Si

$$H=\operatorname{bar}\{(A_1,\alpha_1),\ldots,(A_p,\alpha_p)\},$$

alors :

$$G=\operatorname{bar}\{(H,\alpha_1+\cdots+\alpha_p),(A_{p+1},\alpha_{p+1}),\ldots,(A_n,\alpha_n)\}.$$

Le point $H$ est appelé **barycentre partiel**.

### Pourquoi cette propriété est puissante

Elle remplace une construction à plusieurs points par une succession de constructions à **deux points** :

1. construire le barycentre partiel $H$ ;
2. remplacer le groupe par $(H,\text{somme des poids})$ ;
3. construire le barycentre final.

### Construction officielle

Dans un triangle $ABC$ tel que $AB=3$ cm et $AC=2$ cm, on cherche

$$G=\operatorname{bar}\{(A,-2),(B,1),(C,3)\}.$$

On regroupe $A$ et $C$ :

$$-2+3=1\ne0,\qquad I=\operatorname{bar}\{(A,-2),(C,3)\}.$$

La formule à deux points donne :

$$\overrightarrow{AI}=3\overrightarrow{AC}.$$

Puis

$$G=\operatorname{bar}\{(I,1),(B,1)\}.$$

Les coefficients de $I$ et $B$ étant égaux, $G$ est le **milieu de $[IB]$**.

> **Astuce mémoire de Davy.** Regroupe d’abord les points dont la construction est facile. Leur nouveau coefficient est la **somme** de leurs anciens coefficients.

> **Erreur fréquente.** Ne remplace pas un groupe dont la somme des coefficients vaut zéro : son barycentre partiel n’existe pas.`,
    keyPoint: "Un groupe de points peut être remplacé par son barycentre, affecté de la somme de ses coefficients.",
    example: "Si $H=\\operatorname{bar}\\{(A,2),(B,3)\\}$, alors $(A,2),(B,3)$ peuvent être remplacés par $(H,5)$.",
    methodSteps: [
      "Choisis un sous-groupe dont la somme des coefficients est non nulle.",
      "Construis son barycentre partiel avec la formule de deux points.",
      "Affecte au barycentre partiel la somme des coefficients regroupés.",
      "Construis le barycentre final avec les points restants.",
    ],
    timeline: [
      { label: "Regrouper", detail: "Choisir deux ou plusieurs points faciles à associer." },
      { label: "Construire I", detail: "Calculer la position du barycentre partiel." },
      { label: "Remplacer", detail: "Affecter à I la somme des coefficients du groupe." },
      { label: "Finir", detail: "Construire le barycentre final, souvent comme milieu." },
    ],
    questions: [
      short("Dans le groupe $(A,-2),(C,3)$, quelle est la somme des coefficients ?", ["1"], "$-2+3=1$.", "Exercice de fixation • page 5"),
      choice("Peut-on donc définir le barycentre partiel $I$ ?", ["Oui", "Non", "Seulement si $AB=AC$"], 0, "La somme du sous-groupe est non nulle.", "Exercice de fixation • page 5"),
      choice("Quelle relation construit $I$ ?", [
        "$\\overrightarrow{AI}=3\\overrightarrow{AC}$",
        "$\\overrightarrow{AI}=\\frac13\\overrightarrow{AC}$",
        "$\\overrightarrow{AI}=\\overrightarrow{AB}$",
      ], 0, "$\\overrightarrow{AI}=\\frac{3}{-2+3}\\overrightarrow{AC}=3\\overrightarrow{AC}$.", "Exercice de fixation • page 5", 3),
      choice("Après regroupement, quelle écriture obtient-on ?", [
        "$G=\\operatorname{bar}\\{(I,1),(B,1)\\}$",
        "$G=\\operatorname{bar}\\{(I,-2),(B,1)\\}$",
        "$G=\\operatorname{bar}\\{(I,3),(B,1)\\}$",
      ], 0, "Le coefficient de $I$ est $-2+3=1$.", "Exercice de fixation • page 5", 2),
      choice("Quelle est alors la position de $G$ ?", ["Le milieu de $[IB]$", "Le point $I$", "Le milieu de $[AC]$"], 0, "Les deux coefficients de $I$ et $B$ sont égaux.", "Exercice de fixation • page 5"),
      choice("Quelle condition doit satisfaire tout groupe remplacé ?", ["La somme de ses coefficients doit être non nulle", "Tous ses coefficients doivent être positifs", "Il doit contenir exactement deux points"], 0, "Le barycentre partiel doit exister.", "Propriété • page 5"),
      short("Si un groupe a pour coefficients $2$, $-1$ et $4$, quel coefficient affecte-t-on à son barycentre partiel ?", ["5"], "$2-1+4=5$.", "Application directe • page 5"),
    ],
  },
  {
    id: "quadratic-level-sets",
    title: "Lignes de niveau de sommes de carrés",
    summary: "Réduire une somme pondérée de distances au carré et identifier le lieu obtenu.",
    pages: "6-8",
    section: "II-1 et II-2-a. Lignes de niveau et sommes de carrés",
    durationMinutes: 36,
    kind: "graph",
    body: String.raw`## Définition d’une ligne de niveau

Soit $f$ une application du plan $\mathcal P$ dans $\mathbb R$ et $k\in\mathbb R$. La **ligne de niveau $k$** de $f$ est l’ensemble des points $M$ tels que :

$$f(M)=k.$$

## Réduction d’une somme de distances au carré

On considère

$$f(M)=\sum_{i=1}^{n}\alpha_iMA_i^2.$$

### Si la somme des coefficients est non nulle

Si $s=\sum\alpha_i\ne0$ et si $G$ est le barycentre des $(A_i,\alpha_i)$ :

$$\sum_{i=1}^{n}\alpha_iMA_i^2
=sMG^2+\sum_{i=1}^{n}\alpha_iGA_i^2.$$

Le second terme est une constante. Une équation $f(M)=k$ devient donc une équation en $MG^2$.

Dans le plan, la ligne de niveau est :

- l’ensemble vide $\varnothing$ si le rayon au carré obtenu est négatif ;
- le singleton $\{G\}$ si ce rayon vaut zéro ;
- un cercle de centre $G$ s’il est strictement positif.

Dans l’espace, on obtient respectivement $\varnothing$, $\{G\}$ ou une sphère de centre $G$.

### Si la somme des coefficients vaut zéro

Pour un point fixe $O$ :

$$\sum_{i=1}^{n}\alpha_iMA_i^2
=\sum_{i=1}^{n}\alpha_iOA_i^2
-2\left(\sum_{i=1}^{n}\alpha_i\overrightarrow{OA_i}\right)\cdot\overrightarrow{OM}.$$

L’expression devient affine en $\overrightarrow{OM}$.

Dans le plan :

- si $\sum\alpha_i\overrightarrow{OA_i}=\vec0$, la ligne de niveau est $\varnothing$ ou tout le plan ;
- sinon, c’est une droite normale au vecteur $\sum\alpha_i\overrightarrow{OA_i}$.

Dans l’espace, le dernier lieu est un **plan** normal à ce vecteur.

### Premier cas officiel : $MA^2-2MB^2=4$, avec $AB=2$

La somme $1-2=-1$ est non nulle. Posons

$$G=\operatorname{bar}\{(A,1),(B,-2)\}.$$

La réduction donne :

$$MA^2-2MB^2=-MG^2+GA^2-2GB^2.$$

Avec $AG=2AB$ et $BG=BA$, l’équation devient $MG^2=4$. Le lieu est donc le cercle de centre $G$ et de rayon $2$.

### Deuxième cas officiel : $MA^2-MB^2=16$, avec $AB=4$

La somme vaut zéro. Si $I$ est le milieu de $[AB]$ :

$$MA^2-MB^2=2\overrightarrow{MI}\cdot\overrightarrow{BA}.$$

En projetant $M$ orthogonalement sur $(AB)$ en $H$, l’équation impose $H=B$. Le lieu est donc la droite perpendiculaire à $(AB)$ passant par $B$.

> **Astuce mémoire de Davy.** Pour une somme de carrés : **somme non nulle → cercle autour de $G$ ; somme nulle → droite** dans le plan.

> **Erreur fréquente.** Le signe du coefficient de $MG^2$ compte. Une valeur négative du « rayon au carré » ne donne pas un cercle imaginaire : elle donne l’ensemble vide.`,
    keyPoint: "Σαᵢ ≠ 0 : équation en MG² ; Σαᵢ = 0 : équation affine donnant souvent une droite.",
    example: "$MA^2+MB^2=AB^2/2+2MI^2$ si $I$ est le milieu de $[AB]$.",
    methodSteps: [
      "Identifie la fonction de niveau et additionne les coefficients des carrés.",
      "Si la somme est non nulle, construis G puis réduis en s·MG² + constante.",
      "Si la somme est nulle, transforme l’expression en produit scalaire affine.",
      "Mets l’équation sous une forme géométrique et nomme précisément le lieu.",
    ],
    timeline: [
      { label: "Niveau", detail: "Écrire l’équation f(M)=k qui définit le lieu." },
      { label: "Somme", detail: "La somme des coefficients choisit cercle ou droite." },
      { label: "Réduire", detail: "Faire apparaître MG² ou un produit scalaire." },
      { label: "Identifier", detail: "Contrôler le rayon ou le vecteur normal avant de conclure." },
    ],
    corrections: [
      "Page 7 : dans l’espace, lorsque la somme des coefficients est nulle et que le vecteur constant est non nul, le PDF écrit « une droite de vecteur normal ». Le lieu correct est un plan de vecteur normal donné.",
    ],
    questions: [
      choice("Une ligne de niveau $k$ de $f$ est l’ensemble des points $M$ tels que…", ["$f(M)=k$", "$f(M)>k$", "$f(M)=0$ uniquement"], 0, "C’est la définition exacte.", "Définition • page 6"),
      short("Dans $MA^2-2MB^2$, quelle est la somme des coefficients ?", ["-1"], "$1-2=-1$.", "Exercice de fixation • page 7"),
      choice("Quel barycentre introduit-on ?", [
        "$G=\\operatorname{bar}\\{(A,1),(B,-2)\\}$",
        "$G=\\operatorname{bar}\\{(A,1),(B,2)\\}$",
        "Aucun, car la somme vaut zéro",
      ], 0, "La somme vaut -1, donc le barycentre existe.", "Exercice de fixation • page 7", 2),
      short("Avec $AB=2$, quelle équation en $MG$ obtient-on ?", ["MG²=4", "MG^2=4", "MG=2"], "La réduction de l’équation donne $MG^2=4$.", "Exercice de fixation • page 7", 2),
      choice("Quel est le premier lieu ?", ["Le cercle de centre $G$ et de rayon 2", "La droite $(AB)$", "L’ensemble vide"], 0, "$MG=2$ décrit ce cercle.", "Exercice de fixation • page 7", 2),
      short("Dans $MA^2-MB^2$, quelle est la somme des coefficients ?", ["0"], "$1-1=0$.", "Exercice de fixation • pages 7-8"),
      choice("Quel est le lieu lorsque $MA^2-MB^2=16$ et $AB=4$ ?", [
        "La droite perpendiculaire à $(AB)$ passant par $B$",
        "Le cercle de centre $B$ et de rayon 4",
        "La médiatrice de $[AB]$",
      ], 0, "La projection $H$ de $M$ sur $(AB)$ est imposée au point $B$.", "Exercice de fixation • pages 7-8", 3),
      choice("Dans le plan, si $\\sum\\alpha_i=0$ et le vecteur constant est non nul, le lieu est généralement…", ["une droite", "une sphère", "un point unique"], 0, "L’équation obtenue est affine en $\\overrightarrow{OM}$.", "Propriété • pages 6-7"),
      choice("Dans l’espace, le lieu analogue est…", ["un plan", "une droite obligatoirement", "un cercle"], 0, "Une équation affine à trois variables décrit un plan.", "Propriété corrigée • page 7", 2),
    ],
  },
  {
    id: "apollonius-level-set",
    title: "Ligne de niveau d’un rapport de distances",
    summary: "Reconnaître et construire un cercle d’Apollonius ou une médiatrice à partir du rapport MA/MB.",
    pages: "8",
    section: "II-2-b. Ligne de niveau M ↦ MA/MB",
    durationMinutes: 28,
    kind: "graph",
    body: String.raw`## Le rapport de deux distances

Soient $A$ et $B$ deux points distincts et $k>0$. On cherche les points $M$ tels que :

$$\frac{MA}{MB}=k.$$

Les points $A$ et $B$ sont exclus chaque fois que le quotient n’a pas de sens.

### Cas $k\ne1$ : cercle d’Apollonius

On définit :

$$G_1=\operatorname{bar}\{(A,1),(B,k)\},$$

$$G_2=\operatorname{bar}\{(A,1),(B,-k)\}.$$

Lorsque $k\ne1$, les deux barycentres existent et le lieu est le **cercle de diamètre $[G_1G_2]$**.

### Cas $k=1$ : médiatrice

$$\frac{MA}{MB}=1\iff MA=MB.$$

Le lieu est alors la **médiatrice de $[AB]$**.

### Autre méthode

On peut mettre l’égalité au carré :

$$MA^2=k^2MB^2,$$

puis appliquer la réduction des sommes de carrés du niveau précédent.

### Construction officielle pour $k=\dfrac12$

Par homogénéité :

$$G_1=\operatorname{bar}\{(A,2),(B,1)\},$$

$$G_2=\operatorname{bar}\{(A,2),(B,-1)\}.$$

L’ensemble recherché est le cercle de diamètre $[G_1G_2]$.

> **Astuce mémoire de Davy.** Rapport égal à **1** : médiatrice. Rapport différent de **1** : cercle d’Apollonius.

> **Erreur fréquente.** Le cercle n’a pas pour diamètre $[AB]$, mais $[G_1G_2]$, construit avec les coefficients $k$ et $-k$.`,
    keyPoint: "MA/MB = 1 donne la médiatrice ; MA/MB = k ≠ 1 donne le cercle de diamètre [G₁G₂].",
    example: "Pour $MA/MB=2$, construis $G_1=\\operatorname{bar}\\{(A,1),(B,2)\\}$ et $G_2=\\operatorname{bar}\\{(A,1),(B,-2)\\}$.",
    methodSteps: [
      "Vérifie que k est strictement positif.",
      "Si k=1, conclus immédiatement à la médiatrice.",
      "Si k≠1, construis G₁ avec les poids 1 et k, puis G₂ avec 1 et -k.",
      "Trace le cercle de diamètre [G₁G₂] et exclue les points où le quotient n’est pas défini.",
    ],
    timeline: [
      { label: "Comparer à 1", detail: "Le cas k=1 est particulier et donne MA=MB." },
      { label: "Construire G₁", detail: "Utiliser les coefficients (1,k)." },
      { label: "Construire G₂", detail: "Changer seulement le signe de k." },
      { label: "Tracer", detail: "Le cercle recherché a [G₁G₂] pour diamètre." },
    ],
    questions: [
      choice("Si $MA/MB=1$, quel est le lieu ?", ["La médiatrice de $[AB]$", "Le cercle de diamètre $[AB]$", "La droite $(AB)$"], 0, "$MA=MB$ caractérise la médiatrice.", "Propriété • page 8"),
      choice("Si $k>0$ et $k\\ne1$, le lieu $MA/MB=k$ est…", ["un cercle d’Apollonius", "une droite parallèle à $(AB)$", "un point"], 0, "C’est le cercle de diamètre $[G_1G_2]$.", "Propriété • page 8"),
      short("Dans l’exercice officiel, quelle est la valeur de $k$ ?", ["1/2", "0,5", "0.5"], "L’équation est $MA/MB=1/2$.", "Exercice de fixation • page 8"),
      choice("Quels coefficients proportionnels définissent $G_1$ ?", ["$(A,2),(B,1)$", "$(A,1),(B,2)$", "$(A,2),(B,-1)$"], 0, "$(1,1/2)$ est proportionnel à $(2,1)$.", "Exercice de fixation • page 8", 2),
      choice("Quels coefficients proportionnels définissent $G_2$ ?", ["$(A,2),(B,-1)$", "$(A,2),(B,1)$", "$(A,-2),(B,1)$"], 0, "$(1,-1/2)$ est proportionnel à $(2,-1)$.", "Exercice de fixation • page 8", 2),
      choice("Quel ensemble faut-il finalement construire ?", ["Le cercle de diamètre $[G_1G_2]$", "La médiatrice de $[G_1G_2]$", "Le segment $[G_1G_2]$"], 0, "C’est exactement la propriété pour $k\\ne1$.", "Exercice de fixation • page 8", 3),
    ],
  },
  {
    id: "oriented-angle-level-set",
    title: "Lignes de niveau d’un angle orienté",
    summary: "Identifier une droite privée d’un segment, un segment ouvert ou un arc capable selon l’angle fixé.",
    pages: "8-10",
    section: "II-2-c. Ligne de niveau d’un angle orienté",
    durationMinutes: 32,
    kind: "graph",
    body: String.raw`## Angle orienté sous lequel on voit $[AB]$

Soient $A$ et $B$ deux points distincts. On étudie :

$$M\longmapsto\operatorname{Mes}\left(\overrightarrow{MA},\overrightarrow{MB}\right).$$

Les points $A$ et $B$ sont toujours exclus, car l’un des deux vecteurs y serait nul.

### Angle nul

$$\operatorname{Mes}\left(\overrightarrow{MA},\overrightarrow{MB}\right)=0$$

signifie que les deux vecteurs sont de même direction. Le lieu est la droite $(AB)$ **privée du segment $[AB]$**.

### Angle égal à $\pi$

$$\operatorname{Mes}\left(\overrightarrow{MA},\overrightarrow{MB}\right)=\pi$$

signifie que les deux vecteurs sont de directions opposées. Le lieu est le segment $[AB]$ **privé de $A$ et $B$**.

### Angle $\alpha\in]-\pi;0[\cup]0;\pi[$

On choisit sur la médiatrice de $[AB]$ un point $O$ tel que :

$$\operatorname{Mes}\left(\overrightarrow{OA},\overrightarrow{OB}\right)=2\alpha.$$

Le cercle $(\mathcal C)$ de centre $O$ passant par $A$ et $B$ permet alors de construire le lieu :

$$\operatorname{Mes}\left(\overrightarrow{MA},\overrightarrow{MB}\right)=\alpha.$$

Ce lieu est un **arc du cercle** d’extrémités $A$ et $B$, sans les deux extrémités.

Le point $M$ se situe dans le demi-plan de bord $(AB)$ contenant $O$ si et seulement si :

$$-\frac{\pi}{2}\le\alpha\le\frac{\pi}{2}.$$

| Valeur de l’angle | Lieu |
|---|---|
| $0$ | droite $(AB)$ privée de $[AB]$ |
| $\pi$ | segment $[AB]$ privé de $A$ et $B$ |
| autre angle non nul modulo $\pi$ | arc capable d’extrémités $A$ et $B$ |

> **Astuce mémoire de Davy.** Angle **0** : les vecteurs regardent dans le même sens, donc $M$ est à l’extérieur du segment. Angle **π** : ils regardent en sens opposés, donc $M$ est entre $A$ et $B$.

> **Erreur fréquente.** N’oublie jamais d’exclure $A$ et $B$ : $\overrightarrow{MA}$ ou $\overrightarrow{MB}$ y devient le vecteur nul, dont l’angle n’est pas défini.`,
    keyPoint: "Angle 0 : droite hors segment ; angle π : segment ouvert ; autre angle fixé : arc capable.",
    example: "Dans un triangle rectangle en $C$, les points du même arc capable que $C$ voient $[AB]$ sous le même angle droit orienté.",
    methodSteps: [
      "Exclus d’abord les points A et B.",
      "Traite séparément les cas particuliers 0 et π.",
      "Pour un autre angle α, construis le centre O sur la médiatrice grâce à l’angle 2α.",
      "Choisis le bon arc en contrôlant l’orientation et le demi-plan.",
    ],
    timeline: [
      { label: "Exclure A et B", detail: "Les vecteurs définissant l’angle doivent être non nuls." },
      { label: "Tester 0 ou π", detail: "Ces deux valeurs donnent des parties de la droite (AB)." },
      { label: "Construire O", detail: "Placer O sur la médiatrice avec l’angle au centre 2α." },
      { label: "Choisir l’arc", detail: "L’orientation de α détermine le bon côté de (AB)." },
    ],
    corrections: [
      "Page 9 : la propriété 2 répète par erreur l’angle Mes(OA,OB) dans la description du lieu. Le point variable est M ; l’expression correcte du niveau est Mes(MA,MB)=α.",
    ],
    questions: [
      choice("Pour l’angle $0$, quel est le lieu ?", ["La droite $(AB)$ privée du segment $[AB]$", "Le segment $[AB]$", "Un cercle"], 0, "Les deux vecteurs ont la même direction : $M$ est à l’extérieur du segment.", "Exercice de fixation 1 • page 9"),
      choice("Pour l’angle $\\pi$, quel est le lieu ?", ["Le segment $[AB]$ privé de $A$ et $B$", "La droite $(AB)$ privée de $[AB]$", "La médiatrice"], 0, "Les vecteurs sont opposés lorsque $M$ est entre $A$ et $B$.", "Exercice de fixation 2 • page 9"),
      choice("L’affirmation 1 du vrai/faux officiel est…", ["Vraie", "Fausse"], 0, "Elle reprend exactement la propriété de l’angle nul.", "Exercice de fixation • pages 9-10"),
      choice("L’affirmation 2 du vrai/faux officiel est…", ["Vraie", "Fausse"], 0, "Elle reprend la propriété de l’angle $\\pi$.", "Exercice de fixation • pages 9-10"),
      choice("Dans le triangle rectangle isocèle direct en $C$, l’arc $\\wideparen{AB}$ contenant $C$ correspond à l’angle…", ["$\\pi/2$", "$\\pi/4$", "$\\pi$"], 0, "L’angle $\\widehat{ACB}$ est droit.", "Exercice de fixation 3 • page 9", 2),
      choice("L’affirmation 3 du PDF est donc…", ["Vraie", "Fausse"], 0, "L’arc considéré est bien la ligne de niveau $\\pi/2$.", "Exercice de fixation • pages 9-10"),
      choice("Le point $C$ appartient-il à la ligne de niveau $\\pi/4$ ?", ["Non", "Oui"], 0, "Depuis $C$, le segment $[AB]$ est vu sous l’angle orienté $\\pi/2$, pas $\\pi/4$.", "Exercice de fixation 4 • page 9", 2),
      choice("Quelle suite de réponses donne le PDF ?", ["V, V, V, F", "V, F, V, F", "F, V, F, V"], 0, "Les trois premières propriétés sont vérifiées et la quatrième confond $\\pi/2$ avec $\\pi/4$.", "Réponse • page 10", 3),
    ],
  },
  {
    id: "barycenter-level-set-mission",
    title: "Mission finale : barycentres et lieux géométriques",
    summary: "Mobiliser toute la leçon sur un centre de gravité, des constructions et des lignes de niveau de type BAC.",
    pages: "10-14",
    section: "C. Situation complexe et IV. Exercices",
    durationMinutes: 50,
    kind: "challenge",
    body: String.raw`## Ta stratégie de synthèse

Dans une situation complexe sur les barycentres, suis toujours cet ordre :

1. traduire chaque objet ou chaque masse par un point pondéré ;
2. vérifier la somme des coefficients ;
3. réduire la relation vectorielle ou métrique ;
4. construire les barycentres partiels utiles ;
5. identifier précisément le lieu obtenu ;
6. contrôler la cohérence géométrique de la réponse.

> **Astuce mémoire de Davy.** Retiens **P-S-R-C-L** : **P**ondérer, **S**ommer, **R**éduire, **C**onstruire, nommer le **L**ieu.

## Situation complexe officielle : le cube amputé

Un grand cube homogène de centre $O$ est amputé d’un petit cube dont l’arête est la moitié de celle du grand cube. Le centre du petit cube retiré est $K$. Il faut déterminer si le centre de gravité du solide restant est toujours $O$.

### Modélisation physique correcte

Si l’arête du grand cube vaut $a$ et sa masse volumique $\rho$ :

- masse du grand cube complet : $a^3\rho$ ;
- masse du petit cube retiré : $\dfrac{a^3\rho}{8}$.

Une masse retirée se représente par un coefficient négatif. Après homogénéité :

$$G=\operatorname{bar}\{(O,8),(K,-1)\}.$$

La formule à deux points donne :

$$\overrightarrow{OG}=-\frac17\overrightarrow{OK}.$$

Avec la relation géométrique de la figure $\overrightarrow{OK}=-\dfrac12\overrightarrow{OD}$ :

$$\overrightarrow{OG}=\frac1{14}\overrightarrow{OD}.$$

Le centre de gravité s’est donc déplacé vers la matière restante : il n’est plus en $O$.

## Exercices de synthèse du document

Les exercices finaux vérifient cinq compétences :

| Exercice | Compétence principale |
|---|---|
| 1 | reconnaître rapidement la nature d’une ligne de niveau |
| 2 | construire un barycentre dans un triangle équilatéral |
| 3 | prouver la concurrence de trois droites par barycentres partiels |
| 4 | combiner projection parallèle, barycentres et alignement |
| 5 | déterminer et construire des cercles définis par des relations vectorielles ou métriques |

### Point de vigilance sur l’exercice 5

La première norme se réduit à $MG$ car $1-1+1=1$. La seconde est un vecteur constant de norme $2IC$. L’égalité correcte devient :

$$MG=2IC.$$

Le lieu est donc le cercle de centre $G$ et de rayon $2IC$.

> **Erreur fréquente.** Une construction dessinée dans une correction ne remplace jamais la réduction algébrique. Vérifie la somme des coefficients avant de reprendre un rayon indiqué par la source.`,
    keyPoint: "Synthèse : traduire en points pondérés, réduire, construire puis identifier le lieu avec ses exclusions.",
    example: "Une masse retirée porte un coefficient négatif : cube complet en $O$ avec poids $8$, petit cube retiré en $K$ avec poids $-1$.",
    methodSteps: [
      "Traduis les masses, vecteurs ou distances avec des coefficients signés.",
      "Choisis entre barycentre, vecteur constant et réduction quadratique grâce à leur somme.",
      "Utilise les barycentres partiels pour prouver appartenance, concurrence ou alignement.",
      "Termine par une phrase géométrique complète : nature, centre ou direction, rayon et points exclus.",
    ],
    timeline: [
      { label: "Modéliser", detail: "Associer à chaque masse ou point son coefficient, négatif en cas de retrait." },
      { label: "Réduire", detail: "Faire apparaître MG, MG² ou un vecteur constant." },
      { label: "Démontrer", detail: "Utiliser barycentres partiels, projection et Chasles." },
      { label: "Conclure", detail: "Nommer et construire précisément le point ou le lieu." },
    ],
    corrections: [
      "Page 10 : la correction affecte au centre O la masse 7a³ρ/8 du solide déjà évidé, puis retranche encore le petit cube. Pour une soustraction de solides, il faut utiliser le cube complet (poids 8) et le cube retiré (poids -1). On obtient OG=-1/7 OK=1/14 OD, et non 1/12 OD.",
      "Page 13, exercice 5-1-b : la correction réduit à tort la première somme vectorielle à 3MG. La somme des coefficients vaut 1, donc elle se réduit à MG. L’égalité correcte est MG=2IC ; le rayon est 2IC, et non 2IC/3.",
    ],
    questions: [
      choice("Le petit cube a une arête deux fois plus petite. Quel est le rapport de ses volumes au grand cube ?", ["$1/8$", "$1/2$", "$1/4$"], 0, "Le volume varie comme le cube du rapport : $(1/2)^3=1/8$.", "C-Situation complexe • page 10", 2),
      choice("Quels poids modélisent correctement le solide restant ?", ["$(O,8)$ et $(K,-1)$", "$(O,7)$ et $(K,-1)$", "$(O,8)$ et $(K,1)$"], 0, "On prend le cube complet avec un poids positif 8 et le cube retiré avec un poids négatif -1.", "C-Situation complexe • page 10", 3),
      choice("Quelle relation donne le barycentre corrigé ?", [
        "$\\overrightarrow{OG}=-\\frac17\\overrightarrow{OK}$",
        "$\\overrightarrow{OG}=-\\frac16\\overrightarrow{OK}$",
        "$\\overrightarrow{OG}=\\frac17\\overrightarrow{OK}$",
      ], 0, "Pour les poids 8 et -1, $\\overrightarrow{OG}=\\frac{-1}{8-1}\\overrightarrow{OK}$.", "C-Situation complexe corrigée • page 10", 3),
      short("Avec $\\overrightarrow{OK}=-\\frac12\\overrightarrow{OD}$, complète $\\overrightarrow{OG}=\\dots\\overrightarrow{OD}$.", ["1/14", "0,0714"], "$-\\frac17\\times-\\frac12=\\frac1{14}$.", "C-Situation complexe corrigée • page 10", 3),
      choice("L’affirmation « le centre de gravité n’a pas changé » est-elle exacte ?", ["Non", "Oui"], 0, "$G\\ne O$ puisque $\\overrightarrow{OG}=\\frac1{14}\\overrightarrow{OD}$.", "C-Situation complexe • page 10"),
      choice("Exercice 1-1 : le lieu $MA^2+MB^2=8$ dans le triangle équilatéral de côté 4 est…", ["$\\{P\\}$", "un cercle", "$\\varnothing$"], 0, "$MA^2+MB^2=2MP^2+AB^2/2=2MP^2+8$, donc $M=P$.", "IV-Exercice 1 • pages 10-11", 2),
      choice("Exercice 1-2 : le lieu $MA^2+MB^2+MC^2=0$ est…", ["$\\varnothing$", "$\\{K\\}$", "un cercle"], 0, "Une somme de trois carrés de distances ne peut être nulle pour trois sommets distincts.", "IV-Exercice 1 • page 11"),
      choice("Exercice 1-3 : le lieu de l’angle $\\pi$ est…", ["le segment $[AB]$ privé de $A$ et $B$", "un arc de cercle", "une demi-droite"], 0, "C’est le cas particulier de deux vecteurs opposés.", "IV-Exercice 1 • page 11"),
      choice("Exercice 1-4 : le lieu $MB^2-MC^2=8$ est…", ["une droite", "un segment", "un cercle"], 0, "La somme des coefficients vaut zéro : la différence de carrés se réduit à une équation de droite.", "IV-Exercice 1 • page 11"),
      choice("Exercice 1-5 : le lieu $MA^2+MB^2+MC^2=32$ est…", ["un cercle", "$\\{K\\}$", "$\\varnothing$"], 0, "La somme se réduit à $3MK^2$ plus une constante ; le rayon obtenu est strictement positif.", "IV-Exercice 1 • page 11", 2),
      choice("Exercice 2 : pour $G=\\operatorname{bar}\\{(A,-2),(B,1),(C,3)\\}$, quelle relation construit $G$ ?", [
        "$\\overrightarrow{AG}=\\frac12\\overrightarrow{AB}+\\frac32\\overrightarrow{AC}$",
        "$\\overrightarrow{AG}=\\overrightarrow{AB}+3\\overrightarrow{AC}$",
        "$\\overrightarrow{AG}=-2\\overrightarrow{AB}+\\overrightarrow{AC}$",
      ], 0, "La somme vaut 2, donc les coefficients de $\\overrightarrow{AB}$ et $\\overrightarrow{AC}$ sont $1/2$ et $3/2$.", "IV-Exercice 2 • page 11", 3),
      choice("Exercice 3 : quelle écriture convient pour le milieu $I$ de $[AB]$ ?", [
        "$I=\\operatorname{bar}\\{(A,1),(B,1)\\}$",
        "$I=\\operatorname{bar}\\{(A,1),(B,-1)\\}$",
        "$I=\\operatorname{bar}\\{(A,2),(B,1)\\}$",
      ], 0, "Un milieu est l’isobarycentre de ses extrémités.", "IV-Exercice 3 • pages 11-12"),
      choice("Dans ce même exercice, quelle écriture convient pour $J$ ?", [
        "$J=\\operatorname{bar}\\{(A,2),(C,-3)\\}$",
        "$J=\\operatorname{bar}\\{(A,2),(C,3)\\}$",
        "$J=\\operatorname{bar}\\{(A,1),(C,1)\\}$",
      ], 0, "La relation $\\overrightarrow{JC}=\\frac23\\overrightarrow{JA}$ conduit aux poids 2 et -3.", "IV-Exercice 3 • pages 11-12", 2),
      choice("Pourquoi les droites $(AK)$, $(BJ)$ et $(CI)$ sont-elles concourantes ?", [
        "Le même barycentre $G$ appartient aux trois droites par regroupements partiels",
        "Elles sont toutes perpendiculaires",
        "Le triangle est équilatéral",
      ], 0, "Chaque regroupement partiel exprime $G$ comme barycentre d’un point du côté opposé et du troisième sommet.", "IV-Exercice 3 • page 12", 3),
      choice("Exercice 4 : quel barycentre représente $J$ si $\\overrightarrow{AJ}=\\frac25\\overrightarrow{AB}$ ?", [
        "$J=\\operatorname{bar}\\{(A,3),(B,2)\\}$",
        "$J=\\operatorname{bar}\\{(A,2),(B,3)\\}$",
        "$J=\\operatorname{bar}\\{(A,1),(B,1)\\}$",
      ], 0, "$\\frac{\\beta}{\\alpha+\\beta}=\\frac25$ donne le rapport $\\alpha:\\beta=3:2$.", "IV-Exercice 4 • page 12", 2),
      choice("La projection parallèle à $(AC)$ donne…", [
        "$K=\\operatorname{bar}\\{(C,3),(B,2)\\}$",
        "$K=\\operatorname{bar}\\{(C,2),(B,3)\\}$",
        "$K=\\operatorname{bar}\\{(A,3),(B,2)\\}$",
      ], 0, "Une projection affine conserve les barycentres et envoie $A,B,J$ sur $C,B,K$.", "IV-Exercice 4 • page 12", 3),
      choice("Quelle relation prouve l’alignement de $I$, $K$ et $L$ ?", [
        "$\\overrightarrow{IL}=-5\\overrightarrow{KI}$",
        "$\\overrightarrow{IL}=5\\overrightarrow{KI}$",
        "$\\overrightarrow{IL}=\\overrightarrow{KL}$",
      ], 0, "Les vecteurs sont colinéaires ; le coefficient négatif précise que leurs directions sont opposées.", "IV-Exercice 4 • page 12", 3),
      choice("Exercice 5-1-a : quelle relation définit le barycentre $G$ ?", [
        "$\\overrightarrow{AG}=-\\overrightarrow{AB}+\\overrightarrow{AC}$",
        "$\\overrightarrow{AG}=\\overrightarrow{AB}+\\overrightarrow{AC}$",
        "$\\overrightarrow{AG}=\\frac12\\overrightarrow{AB}$",
      ], 0, "La somme des poids $1-1+1$ vaut 1.", "IV-Exercice 5 • pages 12-13", 2),
      choice("Après correction de la réduction, quel est le lieu de l’exercice 5-1-b ?", [
        "Le cercle de centre $G$ et de rayon $2IC$",
        "Le cercle de centre $G$ et de rayon $\\frac23IC$",
        "La médiatrice de $[AB]$",
      ], 0, "La première somme vaut $\\overrightarrow{MG}$ et la seconde a pour norme $2IC$.", "IV-Exercice 5 corrigé • page 13", 3),
      choice("Quel barycentre représente le point $H$ ?", [
        "$H=\\operatorname{bar}\\{(A,3),(B,1),(C,-2)\\}$",
        "$H=\\operatorname{bar}\\{(A,3),(B,-1),(C,2)\\}$",
        "$H=\\operatorname{bar}\\{(A,1),(B,1),(C,1)\\}$",
      ], 0, "La relation $2\\overrightarrow{AH}=\\overrightarrow{AB}-2\\overrightarrow{AC}$ conduit à ces poids.", "IV-Exercice 5 • page 13", 2),
      short("Pour quelle valeur de $k$ l’ensemble $E_k$ contient-il $C$ ?", ["8"], "En remplaçant $M$ par $C$, on obtient $3CA^2+CB^2=8a^2$.", "IV-Exercice 5 • page 13", 2),
      choice("Quel est finalement l’ensemble $(\\Gamma)$ ?", ["Le cercle de centre $H$ passant par $C$", "La droite $(HC)$", "Le cercle de centre $C$ passant par $H$"], 0, "La réduction donne une équation en $MH^2$ et $C$ vérifie l’équation.", "IV-Exercice 5 • page 13", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCBarycenterPath: LearningPath = {
  id: "terminale-c-math-l02-barycenter",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Géométrie du plan" },
  chapterNumber: 2,
  title: "Barycentre et lignes de niveau",
  description: "Le cours officiel intégral, sans l’activité d’introduction, enrichi de méthodes, constructions et corrections expliquées.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Construire et calculer le barycentre de points pondérés",
    "Réduire des sommes vectorielles et des sommes de distances au carré",
    "Déterminer et construire des lignes de niveau",
    "Résoudre des situations complexes de centre de gravité et de lieux géométriques",
  ],
  modules: [{
    id: "official-course",
    title: "Leçon officielle",
    description: "Huit niveaux de cours suivis d’une mission finale fondée sur les exercices du document.",
    lessons: builtLevels,
  }],
};
