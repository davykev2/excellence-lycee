import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 05 Géometrie analytique de lespace.pdf";

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
      eyebrow: "Construction spatiale",
      title: "Voir le raisonnement en quatre repères",
      instruction: "Parcours les repères dans l’ordre et visualise chaque objet avant de calculer.",
      observation: "En géométrie analytique, le dessin guide l’idée ; les coordonnées apportent ensuite la preuve.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Nomme d’abord les objets géométriques, traduis-les par des vecteurs ou des équations, puis conclus en français.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: "Astuce mémoire de Davy : normal pour un plan, directeur pour une droite. Le produit scalaire relie les deux.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "plane-normal-vector",
    title: "Vecteur normal à un plan",
    summary: "Reconnaître un vecteur perpendiculaire à deux directions non colinéaires d’un plan.",
    pages: "1-3",
    section: "I-1. Vecteur normal à un plan",
    durationMinutes: 34,
    body: String.raw`## Définition

Dans toute la leçon, l’espace $\mathcal E$ est muni, sauf indication contraire, d’un repère orthonormé $(O;\vec i,\vec j,\vec k)$.

Soit $(P)$ un plan de vecteurs directeurs non colinéaires $\vec u$ et $\vec v$. On appelle **vecteur normal** à $(P)$ tout vecteur non nul $\vec n$ tel que

$$\vec n\cdot\vec u=0\qquad\text{et}\qquad \vec n\cdot\vec v=0.$$

Autrement dit, $\vec n$ est orthogonal à deux directions indépendantes du plan.

## Exemple officiel : le cube $ABCDEFGH$

Les vecteurs $\overrightarrow{AD}$ et $\overrightarrow{DC}$ forment une base du plan $(ABC)$. Le vecteur $\overrightarrow{DH}$ est orthogonal à chacun d’eux. Ainsi,

$$\overrightarrow{DH}\ \text{est un vecteur normal au plan }(ABC).$$

## Propriétés

- Par un point $A$ et avec un vecteur non nul $\vec n$, il passe **un unique plan** de vecteur normal $\vec n$.
- Si $A\in(P)$ et si $\vec n$ est normal à $(P)$, alors

$$M\in(P)\Longleftrightarrow \overrightarrow{AM}\cdot\vec n=0.$$

- Deux plans sont parallèles si et seulement si leurs vecteurs normaux sont colinéaires.
- Deux plans sont perpendiculaires si leurs vecteurs normaux sont orthogonaux.

> **Astuce mémoire de Davy.** Le vecteur normal ne « vit » pas dans le plan : il en sort à angle droit.

> **Erreur fréquente.** Vérifier l’orthogonalité avec une seule direction du plan ne suffit pas. Il en faut deux non colinéaires.`,
    keyPoint: "M∈(P) ⇔ AM·n = 0, lorsque A∈(P) et n est normal à (P).",
    example: "Dans le cube, $\\overrightarrow{DH}\\perp\\overrightarrow{AD}$ et $\\overrightarrow{DH}\\perp\\overrightarrow{DC}$.",
    methodSteps: [
      "Choisis deux vecteurs non colinéaires contenus dans le plan.",
      "Calcule leurs produits scalaires avec le vecteur candidat.",
      "Vérifie que les deux produits sont nuls et que le candidat n’est pas nul.",
      "Conclue explicitement qu’il est normal au plan.",
    ],
    timeline: [
      { label: "Plan", detail: "Repérer deux directions non colinéaires du plan." },
      { label: "Candidat", detail: "Choisir le vecteur supposé normal." },
      { label: "Deux tests", detail: "Calculer deux produits scalaires." },
      { label: "Conclusion", detail: "Deux zéros prouvent la normalité." },
    ],
    corrections: [
      "La couverture du PDF porte « Leçon 6 », tandis que le fichier fourni et le catalogue de la plateforme classent ce contenu comme leçon 05 de Terminale C.",
    ],
    questions: [
      choice("Dans le cube officiel, quels vecteurs forment une base du plan $(ABC)$ ?", ["$\\overrightarrow{AD}$ et $\\overrightarrow{DC}$", "$\\overrightarrow{AB}$ et $\\overrightarrow{BF}$", "$\\overrightarrow{DH}$ et $\\overrightarrow{HG}$"], 0, "Ils sont contenus dans le plan inférieur et ne sont pas colinéaires.", "Exemple • page 2"),
      choice("Quel vecteur est normal au plan $(ABC)$ dans l’exemple ?", ["$\\overrightarrow{DH}$", "$\\overrightarrow{DC}$", "$\\overrightarrow{AB}$"], 0, "$\\overrightarrow{DH}$ est orthogonal à deux directions du plan.", "Exemple • page 2"),
      choice("Dans le cube de l’exercice, quel plan passe par $H$ et a $\\overrightarrow{AB}$ pour vecteur normal ?", ["$(ADE)$", "$(ABC)$", "$(ABF)$"], 0, "Le plan $(ADE)$ contient $H$ et ses directions sont orthogonales à $\\overrightarrow{AB}$.", "Exercice de fixation • pages 2-3", 2),
      choice("Pourquoi $\\overrightarrow{AM}$ et $\\overrightarrow{BF}$ sont-ils orthogonaux ?", ["$M\\in(ABC)$ et $\\overrightarrow{BF}$ est normal à $(ABC)$", "Ils ont la même longueur", "Ils sont deux arêtes parallèles"], 0, "$\\overrightarrow{AM}$ est une direction du plan $(ABC)$.", "Exercice de fixation • page 3", 2),
      choice("Pour prouver qu’un vecteur est normal à un plan, il faut montrer qu’il est orthogonal à…", ["deux directions non colinéaires du plan", "un seul point du plan", "tous les points de l’espace"], 0, "Deux directions indépendantes déterminent les directions du plan.", "Définition • page 1"),
      choice("Si les normales de deux plans sont colinéaires, ces plans sont…", ["parallèles ou confondus", "toujours perpendiculaires", "toujours sécants"], 0, "Des normales colinéaires donnent des directions de plans parallèles.", "Remarque • page 2"),
    ],
  },
  {
    id: "plane-cartesian-equation",
    title: "Équation cartésienne d’un plan",
    summary: "Passer d’un vecteur normal et d’un point à une équation $ax+by+cz+d=0$.",
    pages: "3",
    section: "I-2. Équations cartésiennes du plan",
    durationMinutes: 36,
    body: String.raw`## Propriété fondamentale

Dans un repère orthonormé, tout plan de vecteur normal $\vec n(a;b;c)$ possède une équation cartésienne

$$ax+by+cz+d=0,$$

où $(a,b,c)\ne(0,0,0)$. Réciproquement, une telle équation définit un plan de vecteur normal $(a;b;c)$.

Si le plan passe par $A(x_A;y_A;z_A)$, alors ses points $M(x;y;z)$ vérifient

$$\overrightarrow{AM}\cdot\vec n=0,$$

soit

$$a(x-x_A)+b(y-y_A)+c(z-z_A)=0.$$

## Exemple officiel

Le plan passe par $O(0;0;0)$ et a pour normal $\vec n(1;-2;-3)$. Une équation est d’abord

$$x-2y-3z+d=0.$$

Le passage par $O$ donne $d=0$, donc

$$x-2y-3z=0.$$

## Remarques du cours

- Dans un repère non orthonormé, une équation $ax+by+cz+d=0$ définit toujours un plan, mais $(a;b;c)$ n’est pas nécessairement un vecteur normal.
- Multiplier toute l’équation par un réel non nul ne change pas le plan :

$$ax+by+cz+d=0\Longleftrightarrow kax+kby+kcz+kd=0,\quad k\ne0.$$

> **Astuce mémoire de Davy.** Les trois coefficients de $x,y,z$ forment la carte d’identité du normal.`,
    keyPoint: "(P): ax+by+cz+d=0 possède pour normal n(a;b;c) dans un repère orthonormé.",
    example: "Normal $(1;-2;-3)$ et passage par $O$ donnent $(P):x-2y-3z=0$.",
    methodSteps: [
      "Lis ou calcule un vecteur normal (a;b;c).",
      "Écris ax+by+cz+d=0.",
      "Remplace x, y, z par les coordonnées d’un point connu du plan.",
      "Calcule d puis vérifie le point dans l’équation finale.",
    ],
    timeline: [
      { label: "Normal", detail: "Ses coordonnées donnent a, b et c." },
      { label: "Forme", detail: "Écrire ax+by+cz+d=0." },
      { label: "Point", detail: "Utiliser un point du plan pour déterminer d." },
      { label: "Contrôle", detail: "Substituer à nouveau les coordonnées." },
    ],
    questions: [
      choice("Quel est un vecteur normal au plan $2x-y+3z+5=0$ ?", ["$(2;-1;3)$", "$(2;1;3)$", "$(5;0;0)$"], 0, "Les coefficients de $x,y,z$ donnent le normal.", "Propriété • page 3"),
      short("Dans l’exemple officiel, quelle valeur obtient-on pour $d$ ?", ["0"], "Le plan passe par l’origine.", "Exercice de fixation • page 3"),
      choice("Quelle équation est obtenue dans l’exercice officiel ?", ["$x-2y-3z=0$", "$x+2y+3z=0$", "$x-2y-3z+1=0$"], 0, "On utilise le normal $(1;-2;-3)$ et le point $O$.", "Exercice de fixation • page 3", 2),
      choice("Le plan $x-2y-3z=0$ est-il le même que $-2x+4y+6z=0$ ?", ["Oui", "Non", "Seulement si $z=0$"], 0, "La seconde équation est la première multipliée par $-2$.", "Remarque • page 3"),
      choice("Pour le plan passant par $A(1;2;3)$ et normal à $(2;-1;1)$, que vaut $d$ dans $2x-y+z+d=0$ ?", ["$-3$", "$3$", "$-7$"], 0, "$2-2+3+d=0$, donc $d=-3$.", "Application guidée", 2),
      choice("Pourquoi exige-t-on $(a,b,c)\\ne(0,0,0)$ ?", ["Pour obtenir un véritable plan", "Pour imposer $d=0$", "Pour rendre le repère orthonormé"], 0, "Sans coefficient directeur, l’équation ne décrit pas un plan.", "Propriété • page 3"),
    ],
  },
  {
    id: "point-plane-distance",
    title: "Distance d’un point à un plan",
    summary: "Calculer la longueur du segment perpendiculaire reliant un point à un plan.",
    pages: "4",
    section: "I-3. Distance d’un point à un plan",
    durationMinutes: 34,
    body: String.raw`## Formule

Soit $A(x_0;y_0;z_0)$ et le plan

$$
(P):ax+by+cz+d=0.
$$

La distance de $A$ à $(P)$ vaut

$$
d(A;(P))=
\frac{|ax_0+by_0+cz_0+d|}
{\sqrt{a^2+b^2+c^2}}.
$$

Le numérateur mesure l’écart algébrique à l’équation du plan ; la valeur absolue rend la distance positive. Le dénominateur normalise cet écart par la longueur du vecteur normal.

## Exemple officiel

Pour

$$
(P):2x-y+3z+5=0,\qquad A(3;2;1),
$$

on obtient

$$
d(A;(P))
=\frac{|2\cdot3-2+3\cdot1+5|}{\sqrt{2^2+(-1)^2+3^2}}
=\frac{12}{\sqrt{14}}
=\frac{6\sqrt{14}}7.
$$

> **Astuce mémoire de Davy.** En haut : remplace. En bas : norme du normal.

> **Erreur fréquente.** Ne pas oublier le terme constant $d$ ni la valeur absolue.`,
    keyPoint: "d(A;(P)) = |ax₀+by₀+cz₀+d| / √(a²+b²+c²).",
    example: "$d(A;(P))=12/\\sqrt{14}=6\\sqrt{14}/7$.",
    methodSteps: [
      "Identifie a, b, c et d dans l’équation du plan.",
      "Substitue exactement les coordonnées du point au numérateur.",
      "Prends la valeur absolue du résultat.",
      "Calcule la norme du normal puis simplifie la fraction.",
    ],
    timeline: [
      { label: "Données", detail: "Point A et équation du plan." },
      { label: "Écart", detail: "Calculer ax₀+by₀+cz₀+d." },
      { label: "Norme", detail: "Calculer √(a²+b²+c²)." },
      { label: "Distance", detail: "Diviser les deux quantités positives." },
    ],
    questions: [
      short("Dans l’exemple, combien vaut $2\\cdot3-2+3\\cdot1+5$ ?", ["12"], "Le numérateur avant valeur absolue vaut 12.", "Exercice d’application • page 4"),
      short("Combien vaut $2^2+(-1)^2+3^2$ ?", ["14"], "On additionne les carrés des coefficients du normal.", "Exercice d’application • page 4"),
      choice("Quelle distance donne l’exemple officiel ?", ["$\\dfrac{6\\sqrt{14}}7$", "$\\dfrac{12}{14}$", "$\\sqrt{14}$"], 0, "$12/\\sqrt{14}=6\\sqrt{14}/7$.", "Exercice d’application • page 4", 2),
      choice("Pourquoi utilise-t-on une valeur absolue au numérateur ?", ["Une distance est positive", "Le plan est toujours positif", "Le normal est unitaire"], 0, "Le signe indique seulement de quel côté du plan se trouve le point.", "Propriété • page 4"),
      short("Si $A$ appartient au plan, quelle est sa distance au plan ?", ["0"], "L’équation du plan est alors exactement satisfaite.", "Conséquence"),
      choice("Pour $(P):x+2y-2z+1=0$ et $A(1;0;0)$, la distance vaut…", ["$2/3$", "$2$", "$1/3$"], 0, "Numérateur $|1+1|=2$, dénominateur $\\sqrt9=3$.", "Application guidée", 2),
    ],
  },
  {
    id: "line-parametric-form",
    title: "Représentation paramétrique d’une droite",
    summary: "Décrire tous les points d’une droite avec un point, un vecteur directeur et un paramètre.",
    pages: "4-5",
    section: "II. Représentations paramétriques d’une droite",
    durationMinutes: 36,
    body: String.raw`## Définition

La droite $(D)$ passant par $A(x_0;y_0;z_0)$ et de vecteur directeur $\vec u(a;b;c)$ possède la représentation paramétrique

$$
\begin{cases}
x=x_0+ta,\\
y=y_0+tb,\\
z=z_0+tc,
\end{cases}
\qquad t\in\mathbb R.
$$

Chaque valeur de $t$ fournit un point de la droite. Réciproquement, chaque point de la droite correspond à au moins une valeur du paramètre.

## Exemple officiel

Pour $A(2;3;0)$ et $\vec u(-1;-1;1)$ :

$$
\begin{cases}
x=2-\lambda,\\
y=3-\lambda,\\
z=\lambda,
\end{cases}
\qquad \lambda\in\mathbb R.
$$

Le choix du point et du vecteur directeur n’est pas unique : une même droite admet plusieurs représentations paramétriques.

> **Astuce mémoire de Davy.** Une colonne « point » + le paramètre fois une colonne « direction » :

$$M=A+t\vec u.$$`,
    keyPoint: "M(x;y;z)∈(D) ⇔ M=A+t·u pour un réel t.",
    example: "$A(2;3;0)$ et $\\vec u(-1;-1;1)$ donnent $(2-\\lambda;3-\\lambda;\\lambda)$.",
    methodSteps: [
      "Repère un point A de la droite.",
      "Repère un vecteur directeur non nul u.",
      "Écris M=A+t·u coordonnée par coordonnée.",
      "Précise toujours que t appartient à R.",
    ],
    timeline: [
      { label: "Point", detail: "Il fixe la position initiale sur la droite." },
      { label: "Direction", detail: "Elle fixe le sens de déplacement." },
      { label: "Paramètre", detail: "Il règle l’amplitude du déplacement." },
      { label: "Droite", detail: "Toutes les valeurs réelles sont parcourues." },
    ],
    questions: [
      choice("Dans l’exemple, quel est le point de passage ?", ["$A(2;3;0)$", "$A(-1;-1;1)$", "$A(0;0;0)$"], 0, "Les termes constants donnent le point pour $\\lambda=0$.", "Exercice de fixation • pages 4-5"),
      choice("Quel est le vecteur directeur de la droite de l’exemple ?", ["$(-1;-1;1)$", "$(2;3;0)$", "$(1;1;1)$"], 0, "Les coefficients de $\\lambda$ donnent la direction.", "Exercice de fixation • pages 4-5"),
      choice("Quelle représentation est correcte ?", ["$x=2-\\lambda,\\ y=3-\\lambda,\\ z=\\lambda$", "$x=-1+2\\lambda,\\ y=-1+3\\lambda,\\ z=1$", "$x=2,\\ y=3,\\ z=0$"], 0, "On écrit $A+\\lambda\\vec u$.", "Exercice de fixation • page 5", 2),
      choice("Quel point obtient-on pour $\\lambda=2$ ?", ["$(0;1;2)$", "$(4;5;2)$", "$(0;1;-2)$"], 0, "$(2-2;3-2;2)=(0;1;2)$.", "Exercice de fixation • page 5", 2),
      choice("Les coefficients du paramètre forment…", ["un vecteur directeur", "un vecteur normal à tous les plans", "les coordonnées de l’origine"], 0, "Ils indiquent la variation des trois coordonnées.", "Définition • page 4"),
      choice("Une droite admet-elle une seule représentation paramétrique ?", ["Non", "Oui", "Seulement dans un repère orthonormé"], 0, "On peut changer le point de passage ou multiplier le directeur par un réel non nul.", "Remarque • page 4"),
    ],
  },
  {
    id: "relative-lines-space",
    title: "Positions relatives de deux droites",
    summary: "Distinguer droites parallèles, confondues, sécantes et non coplanaires.",
    pages: "5-7",
    section: "III-1. Positions relatives de deux droites",
    durationMinutes: 48,
    body: String.raw`## Les quatre situations

Soient $(D)=(A;\vec u)$ et $(D')=(B;\vec v)$.

| Directions | Point commun | Position |
|---|---:|---|
| $\vec u$ et $\vec v$ colinéaires | oui | droites confondues |
| $\vec u$ et $\vec v$ colinéaires | non | strictement parallèles |
| $\vec u$ et $\vec v$ non colinéaires | oui | sécantes |
| $\vec u$ et $\vec v$ non colinéaires | non | non coplanaires |

Si $\vec u\cdot\vec v=0$, les deux droites ont des directions orthogonales. Dans l’espace, elles peuvent être orthogonales sans être sécantes.

## Exercice officiel

$$
(D):
\begin{cases}
x=3\\
y=1+\lambda\\
z=-2\lambda
\end{cases}
\quad
(D'):
\begin{cases}
x=2\mu\\
y=2-4\mu\\
z=2-2\mu
\end{cases}
\quad
(D''):
\begin{cases}
x=1\\
y=1-2\nu\\
z=-1+4\nu
\end{cases}
$$

- $\vec u=(0;1;-2)$ et $\vec u''=(0;-2;4)=-2\vec u$. Les abscisses constantes $3$ et $1$ prouvent que $(D)$ et $(D'')$ sont strictement parallèles.
- $(D')$ et $(D'')$ se rencontrent pour $\mu=\nu=\frac12$ au point $A(1;0;1)$.
- $\vec u\cdot\vec u'=0$, mais le système de rencontre de $(D)$ et $(D')$ est impossible : elles sont non coplanaires et orthogonales.

> **Astuce mémoire de Davy.** Directions d’abord, système ensuite.

> **Erreur fréquente.** Deux vecteurs directeurs non colinéaires ne suffisent pas à conclure « sécantes » dans l’espace.`,
    keyPoint: "Comparer les directeurs, puis résoudre le système de rencontre.",
    example: "$(D')\\cap(D'')=\\{A(1;0;1)\\}$ pour $\\mu=\\nu=1/2$.",
    methodSteps: [
      "Extrais les deux vecteurs directeurs.",
      "Teste leur colinéarité.",
      "S’ils sont colinéaires, teste l’appartenance d’un point.",
      "Sinon, résous les trois égalités de coordonnées pour chercher un point commun.",
      "Ajoute le produit scalaire si l’orthogonalité est demandée.",
    ],
    timeline: [
      { label: "Directions", detail: "Colinéaires ou non colinéaires ?" },
      { label: "Système", detail: "Existe-t-il des paramètres compatibles ?" },
      { label: "Point", detail: "Calculer les coordonnées communes." },
      { label: "Position", detail: "Nommer précisément la situation." },
    ],
    questions: [
      choice("Pourquoi $(D)$ et $(D'')$ ont-elles des directions parallèles ?", ["$\\vec u''=-2\\vec u$", "$\\vec u''=\\vec u+(1;0;0)$", "Leurs paramètres ont le même nom"], 0, "Les deux vecteurs directeurs sont colinéaires.", "Exercice de fixation • page 6"),
      choice("Pourquoi ne sont-elles pas confondues ?", ["Leurs abscisses constantes valent 3 et 1", "Leurs directeurs sont colinéaires", "Elles utilisent deux paramètres"], 0, "Aucun point ne peut avoir simultanément $x=3$ et $x=1$.", "Exercice de fixation • page 6", 2),
      short("Quelle valeur commune obtient-on pour $\\mu$ et $\\nu$ lors de l’intersection de $(D')$ et $(D'')$ ?", ["1/2", "0.5", "½"], "Le système donne $\\mu=\\nu=1/2$.", "Exercice de fixation • page 6"),
      choice("Quel est leur point d’intersection ?", ["$A(1;0;1)$", "$A(1;1;0)$", "$A(0;1;1)$"], 0, "On remplace $\\mu=\\nu=1/2$ dans les représentations.", "Exercice de fixation • page 6", 2),
      short("Combien vaut $(0;1;-2)\\cdot(2;-4;-2)$ ?", ["0"], "$0-4+4=0$.", "Exercice de fixation • pages 6-7"),
      choice("Quelle est la position de $(D)$ et $(D')$ ?", ["Non coplanaires mais orthogonales", "Sécantes et perpendiculaires", "Strictement parallèles"], 0, "Le produit scalaire est nul, mais le système de rencontre est impossible.", "Exercice de fixation • page 7", 2),
      choice("Deux droites de directeurs non colinéaires sans point commun sont…", ["non coplanaires", "strictement parallèles", "confondues"], 0, "Deux droites coplanaires non parallèles seraient sécantes.", "Synthèse"),
    ],
  },
  {
    id: "line-plane-position",
    title: "Position d’une droite et d’un plan",
    summary: "Utiliser le produit scalaire entre le directeur de la droite et le normal du plan.",
    pages: "7-8",
    section: "III-2. Positions relatives d’une droite et d’un plan",
    durationMinutes: 44,
    body: String.raw`## Critère directeur-normal

Soit $(D)=(A;\vec u)$ et un plan $(P)$ passant par $B$, de vecteur normal $\vec n$.

| Test | Appartenance d’un point | Conclusion |
|---|---|---|
| $\vec u\cdot\vec n\ne0$ | inutile | $(D)$ coupe $(P)$ en un point unique |
| $\vec u\cdot\vec n=0$ | $A\in(P)$ | $(D)\subset(P)$ |
| $\vec u\cdot\vec n=0$ | $A\notin(P)$ | $(D)$ est strictement parallèle à $(P)$ |

Si $\vec u$ et $\vec n$ sont colinéaires, la droite est orthogonale au plan.

> **Correction du schéma source.** Dans le cas strictement parallèle, le PDF affiche $\overrightarrow{AB}\cdot\vec n=0$. Avec $A\in(D)$ et $B\in(P)$, il faut au contraire $\overrightarrow{AB}\cdot\vec n\ne0$ ; sinon $A$ appartiendrait au plan.

## Exercice officiel

$$
(D):
\begin{cases}
x=2-2\lambda\\
y=2\lambda\\
z=2-3\lambda
\end{cases}
\qquad
(D'):
\begin{cases}
x=1-\mu\\
y=2-2\mu\\
z=1+2\mu
\end{cases}
$$

et

$$
(P):2x+y+2z-4=0.
$$

Pour $(D)$, $\vec u=(-2;2;-3)$ et $\vec n=(2;1;2)$ donnent $\vec u\cdot\vec n=-8\ne0$. En substituant les coordonnées de $(D)$ dans l’équation du plan, on trouve $\lambda=\frac12$, donc

$$A\left(1;1;\frac12\right).$$

Pour $(D')$, $\vec u'=(-1;-2;2)$ vérifie $\vec u'\cdot\vec n=0$, tandis que $B(1;2;1)\notin(P)$. La droite est donc strictement parallèle au plan.`,
    keyPoint: "u·n ≠ 0 : sécante ; u·n = 0 : incluse ou strictement parallèle.",
    example: "$\\lambda=1/2$ donne $A(1;1;1/2)$.",
    methodSteps: [
      "Extrais le directeur u de la droite et le normal n du plan.",
      "Calcule u·n.",
      "S’il est non nul, substitue la paramétrisation dans l’équation du plan.",
      "S’il est nul, teste un point de la droite dans le plan.",
      "Conclue : sécante, incluse ou strictement parallèle.",
    ],
    timeline: [
      { label: "Vecteurs", detail: "Directeur de la droite et normal du plan." },
      { label: "Produit", detail: "Le produit scalaire choisit la branche." },
      { label: "Test", detail: "Substitution du paramètre ou d’un point." },
      { label: "Conclusion", detail: "Nommer la position et le point éventuel." },
    ],
    corrections: [
      "Page 7 : le schéma « droite strictement parallèle au plan » affiche AB·n = 0. Avec A sur la droite et B dans le plan, la condition correcte est AB·n ≠ 0.",
    ],
    questions: [
      short("Quel est un vecteur normal au plan $(P):2x+y+2z-4=0$ ?", ["(2;1;2)", "2;1;2", "(2,1,2)"], "Les coefficients de $x,y,z$ donnent le normal.", "Exercice de fixation • page 8"),
      short("Combien vaut $(-2;2;-3)\\cdot(2;1;2)$ ?", ["-8"], "$-4+2-6=-8$.", "Exercice de fixation • page 8"),
      choice("Quelle est la position de $(D)$ par rapport à $(P)$ ?", ["Sécante", "Incluse", "Strictement parallèle"], 0, "Le produit directeur-normal est non nul.", "Exercice de fixation • page 8"),
      short("Quelle valeur de $\\lambda$ donne le point d’intersection ?", ["1/2", "0.5", "½"], "La substitution dans l’équation du plan donne $\\lambda=1/2$.", "Exercice de fixation • page 8", 2),
      choice("Quel est le point d’intersection ?", ["$A(1;1;1/2)$", "$A(1;1;2)$", "$A(1/2;1;1)$"], 0, "On remplace $\\lambda=1/2$ dans $(D)$.", "Exercice de fixation • page 8", 2),
      short("Combien vaut $(-1;-2;2)\\cdot(2;1;2)$ ?", ["0"], "$-2-2+4=0$.", "Exercice de fixation • page 8"),
      choice("Pourquoi $(D')$ est-elle strictement parallèle à $(P)$ ?", ["Son directeur est orthogonal au normal et $B\\notin(P)$", "Son directeur est colinéaire au normal", "Elle possède un point d’intersection"], 0, "Le produit nul donne le parallélisme, puis le point exclut l’inclusion.", "Exercice de fixation • page 8", 2),
    ],
  },
  {
    id: "relative-planes",
    title: "Positions relatives de deux plans",
    summary: "Comparer les normales et paramétrer la droite d’intersection de deux plans sécants.",
    pages: "9-10",
    section: "III-3. Positions relatives de deux plans",
    durationMinutes: 48,
    body: String.raw`## Comparer deux plans

Soient $(P)$ et $(P')$ de vecteurs normaux respectifs $\vec n$ et $\vec n'$.

- Si $\vec n$ et $\vec n'$ sont colinéaires, les plans sont parallèles ou confondus.
- Si $\vec n$ et $\vec n'$ ne sont pas colinéaires, les plans sont sécants suivant une droite.
- Si $\vec n\cdot\vec n'=0$, les plans sont perpendiculaires.

Pour distinguer des plans parallèles, on teste un point de l’un dans l’équation de l’autre.

## Exercice officiel

$$
(P):2x+y+2z-6=0,\qquad
(P'):2x-2y-z+3=0.
$$

Leurs normales

$$\vec n=(2;1;2),\qquad \vec n'=(2;-2;-1)$$

ne sont pas colinéaires : les plans sont sécants. En posant $z=\lambda$ puis en résolvant les deux équations :

$$
\Delta:
\begin{cases}
x=\dfrac32-\dfrac12\lambda,\\
y=3-\lambda,\\
z=\lambda,
\end{cases}
\qquad\lambda\in\mathbb R.
$$

Enfin,

$$\vec n\cdot\vec n'=4-2-2=0,$$

donc les plans sont perpendiculaires.

> **Astuce mémoire de Davy.** Deux équations de plans + une variable libre = une droite.`,
    keyPoint: "Normales non colinéaires : plans sécants suivant une droite.",
    example: "$\\Delta:(3/2-\\lambda/2;3-\\lambda;\\lambda)$.",
    methodSteps: [
      "Lis les deux vecteurs normaux.",
      "Teste leur colinéarité.",
      "S’ils ne sont pas colinéaires, garde une coordonnée comme paramètre.",
      "Résous le système pour les deux autres coordonnées.",
      "Calcule le produit des normales si la perpendicularité est demandée.",
    ],
    timeline: [
      { label: "Normales", detail: "Colinéaires ou non ?" },
      { label: "Système", detail: "Conserver les deux équations simultanément." },
      { label: "Paramètre", detail: "Poser par exemple z=λ." },
      { label: "Droite", detail: "Exprimer x, y, z avec λ." },
    ],
    questions: [
      choice("Les normales $(2;1;2)$ et $(2;-2;-1)$ sont-elles colinéaires ?", ["Non", "Oui", "Seulement pour $z=0$"], 0, "Les rapports des coordonnées ne sont pas égaux.", "Exercice de fixation • page 10"),
      choice("Quelle est donc la position des deux plans ?", ["Sécants", "Strictement parallèles", "Confondus"], 0, "Des normales non colinéaires donnent deux plans sécants.", "Exercice de fixation • page 10"),
      choice("Quelle variable le cours choisit-il comme paramètre ?", ["$z=\\lambda$", "$x=\\lambda$", "$y=0$"], 0, "Le cours pose explicitement $z=\\lambda$.", "Exercice de fixation • page 10"),
      choice("Quelle expression obtient-on pour $x$ ?", ["$x=3/2-\\lambda/2$", "$x=3-\\lambda$", "$x=2+\\lambda$"], 0, "La résolution du système donne $x=3/2-\\lambda/2$.", "Exercice de fixation • page 10", 2),
      choice("Quelle expression obtient-on pour $y$ ?", ["$y=3-\\lambda$", "$y=3/2-\\lambda/2$", "$y=\\lambda$"], 0, "La seconde coordonnée est $3-\\lambda$.", "Exercice de fixation • page 10", 2),
      short("Combien vaut $(2;1;2)\\cdot(2;-2;-1)$ ?", ["0"], "$4-2-2=0$.", "Exercice de fixation • page 10"),
      choice("Quelle propriété supplémentaire en déduit-on ?", ["Les plans sont perpendiculaires", "Les plans sont confondus", "La droite d’intersection est vide"], 0, "Le produit scalaire des normales est nul.", "Exercice de fixation • page 10", 2),
    ],
  },
  {
    id: "sculpture-orthogonality-mission",
    title: "Mission : stabiliser la sculpture dans le cube",
    summary: "Choisir un repère du cube et prouver qu’une barre est orthogonale à une base triangulaire.",
    pages: "10-11",
    section: "C. Situation complexe",
    durationMinutes: 46,
    kind: "challenge",
    body: String.raw`## La situation

La base $BDE$ de la sculpture de M. Yéo est un triangle équilatéral inscrit dans un cube. Une barre suit la diagonale $(AG)$. Il faut vérifier que

$$
(AG)\perp(BDE).
$$

## Choix du repère

On choisit le repère orthonormé

$$
(A;\overrightarrow{AB},\overrightarrow{AD},\overrightarrow{AE}).
$$

Les sommets utiles ont alors pour coordonnées :

| Point | Coordonnées |
|---|---|
| $A$ | $(0;0;0)$ |
| $B$ | $(1;0;0)$ |
| $D$ | $(0;1;0)$ |
| $E$ | $(0;0;1)$ |
| $G$ | $(1;1;1)$ |

## Trouver un normal au plan $(BDE)$

Deux directions du plan sont

$$
\overrightarrow{BD}=(-1;1;0),\qquad
\overrightarrow{ED}=(0;1;-1).
$$

Si $\vec n=(a;b;c)$ est normal à $(BDE)$, alors

$$
\begin{cases}
-a+b=0,\\
b-c=0.
\end{cases}
$$

On peut choisir $a=1$, d’où

$$\vec n=(1;1;1).$$

Or

$$\overrightarrow{AG}=(1;1;1)=\vec n.$$

Le directeur de $(AG)$ est normal au plan $(BDE)$, donc la barre est effectivement orthogonale à la base.

> **Astuce mémoire de Davy.** Dans un cube unité, la grande diagonale a souvent pour coordonnées $(1;1;1)$.`,
    keyPoint: "AG=(1;1;1) est normal au plan (BDE), donc (AG) ⟂ (BDE).",
    example: "$\\overrightarrow{BD}\\cdot\\overrightarrow{AG}=0$ et $\\overrightarrow{ED}\\cdot\\overrightarrow{AG}=0$.",
    methodSteps: [
      "Choisis le sommet A comme origine et trois arêtes orthogonales comme axes.",
      "Écris les coordonnées des sommets utiles.",
      "Construis deux directions du plan BDE.",
      "Résous les deux équations d’orthogonalité pour obtenir un normal.",
      "Compare ce normal au directeur AG et conclus.",
    ],
    timeline: [
      { label: "Repère", detail: "Transformer le cube en coordonnées 0 et 1." },
      { label: "Plan", detail: "Construire BD et ED." },
      { label: "Normal", detail: "Résoudre deux produits scalaires nuls." },
      { label: "Barre", detail: "Identifier AG au normal obtenu." },
    ],
    questions: [
      choice("Quel repère est choisi dans la solution officielle ?", ["$(A;\\overrightarrow{AB},\\overrightarrow{AD},\\overrightarrow{AE})$", "$(O;\\overrightarrow{AG},\\overrightarrow{BD},\\overrightarrow{ED})$", "$(B;\\overrightarrow{BA},\\overrightarrow{BC},\\overrightarrow{BF})$"], 0, "Les trois arêtes issues de A forment un repère orthonormé.", "Situation complexe • page 11"),
      choice("Quelles sont les coordonnées de $G$ ?", ["$(1;1;1)$", "$(0;1;1)$", "$(1;0;0)$"], 0, "G est le sommet opposé à A dans le cube unité.", "Situation complexe • page 11"),
      choice("Que vaut $\\overrightarrow{BD}$ ?", ["$(-1;1;0)$", "$(1;-1;0)$", "$(0;1;-1)$"], 0, "$D-B=(0;1;0)-(1;0;0)$.", "Situation complexe • page 11"),
      choice("Que vaut $\\overrightarrow{ED}$ ?", ["$(0;1;-1)$", "$(-1;1;0)$", "$(1;1;1)$"], 0, "$D-E=(0;1;0)-(0;0;1)$.", "Situation complexe • page 11"),
      choice("Quel système doit satisfaire un normal $(a;b;c)$ ?", ["$-a+b=0$ et $b-c=0$", "$a+b=0$ et $b+c=0$", "$a=b=0$"], 0, "Il doit être orthogonal à BD et ED.", "Situation complexe • page 11", 2),
      choice("Quel normal simple obtient-on ?", ["$(1;1;1)$", "$(1;-1;1)$", "$(0;1;1)$"], 0, "Les équations imposent $a=b=c$.", "Situation complexe • page 11"),
      choice("Pourquoi $(AG)$ est-elle orthogonale à $(BDE)$ ?", ["Son directeur est normal au plan", "Elle coupe une arête du triangle", "AG et BD ont la même longueur"], 0, "$\\overrightarrow{AG}=(1;1;1)$ est le normal construit.", "Situation complexe • page 11", 2),
    ],
  },
  {
    id: "official-applications-workshop",
    title: "Atelier d’application : distance et plan orthogonal",
    summary: "Appliquer directement les formules à deux exercices officiels, avec correction des coquilles du support.",
    pages: "11-12",
    section: "D-1. Exercices d’application",
    durationMinutes: 42,
    kind: "practice",
    body: String.raw`## Exercice 1 : distance

On considère

$$E(4;2;-1),\qquad (Q):3x-4y+6=0.$$

La formule donne

$$
d(E;(Q))
=\frac{|3\cdot4-4\cdot2+6|}{\sqrt{3^2+(-4)^2}}
=\frac{10}{5}
=2.
$$

> **Correction du PDF.** La solution imprimée affiche $\frac25$. Le calcul fidèle des données donne bien $2$.

## Exercice 2 : plan orthogonal à une droite

$$
A(5;2;3),\quad B(4;-2;1),\quad C(2;4;-5).
$$

Le plan recherché passe par $C$ et est orthogonal à $(AB)$. Son vecteur normal peut donc être

$$
\overrightarrow{AB}=B-A=(-1;-4;-2).
$$

Une équation est

$$
-x-4y-2z+d=0.
$$

Le passage par $C$ donne

$$-2-16+10+d=0,\qquad d=8.$$

Ainsi, une équation correcte est

$$
-x-4y-2z+8=0,
$$

ou, de manière équivalente,

$$
x+4y+2z-8=0.
$$

> **Correction du PDF.** Le support écrit $\overrightarrow{AB}=(1;-4;-2)$ puis $x-4y-2z+4=0$. La première coordonnée de $B-A$ vaut $-1$, ce qui change l’équation.`,
    keyPoint: "Distance : substituer puis normaliser ; plan orthogonal à une droite : son normal est un directeur de la droite.",
    example: "$d(E;(Q))=2$ et le plan par $C$ orthogonal à $(AB)$ peut s’écrire $x+4y+2z-8=0$.",
    methodSteps: [
      "Pour la distance, identifie le normal puis applique la formule sans oublier d.",
      "Pour le plan orthogonal à une droite, calcule précisément le directeur AB.",
      "Utilise ce directeur comme normal du plan.",
      "Détermine le terme constant avec le point imposé.",
      "Vérifie le résultat par substitution et produit scalaire.",
    ],
    timeline: [
      { label: "Distance", detail: "Remplacer E dans l’équation de Q." },
      { label: "Direction", detail: "Calculer B-A dans le bon ordre." },
      { label: "Plan", detail: "Utiliser AB comme normal." },
      { label: "Vérification", detail: "Tester le point C dans l’équation." },
    ],
    corrections: [
      "Page 11 : la distance de E(4;2;-1) au plan 3x-4y+6=0 vaut 2, et non 2/5.",
      "Page 12 : AB=B-A=(-1;-4;-2), et non (1;-4;-2). Une équation correcte du plan demandé est x+4y+2z-8=0.",
    ],
    questions: [
      short("Exercice 1 : combien vaut le numérateur $|3\\cdot4-4\\cdot2+6|$ ?", ["10"], "$|12-8+6|=10$.", "Exercice d’application 1 • page 11"),
      short("Exercice 1 : combien vaut le dénominateur $\\sqrt{3^2+(-4)^2}$ ?", ["5"], "$\\sqrt{9+16}=5$.", "Exercice d’application 1 • page 11"),
      short("Exercice 1 : quelle est la distance correcte ?", ["2"], "$10/5=2$.", "Exercice d’application 1 • page 11", 2),
      choice("Exercice 2 : quel est le vecteur $\\overrightarrow{AB}$ correct ?", ["$(-1;-4;-2)$", "$(1;-4;-2)$", "$(-3;2;6)$"], 0, "$B-A=(4-5;-2-2;1-3)$.", "Exercice d’application 2 • page 12", 2),
      choice("Pourquoi $\\overrightarrow{AB}$ peut-il servir de normal au plan cherché ?", ["Le plan est orthogonal à la droite $(AB)$", "Le point C appartient à AB", "AB est parallèle au plan"], 0, "Le directeur d’une droite orthogonale à un plan est normal à ce plan.", "Exercice d’application 2 • page 12"),
      short("Avec la forme $-x-4y-2z+d=0$, combien vaut $d$ ?", ["8"], "Le passage par $C(2;4;-5)$ donne $d=8$.", "Exercice d’application 2 • page 12", 2),
      choice("Quelle équation est correcte ?", ["$x+4y+2z-8=0$", "$x-4y-2z+4=0$", "$x+4y+2z+8=0$"], 0, "Elle est équivalente à $-x-4y-2z+8=0$.", "Exercice d’application 2 • page 12", 2),
    ],
  },
  {
    id: "orthogonal-planes-reinforcement",
    title: "Renforcement : construire des plans orthogonaux",
    summary: "Déterminer le plan de trois points puis exhiber un autre plan qui lui est orthogonal.",
    pages: "12",
    section: "D-2. Exercice de renforcement 1",
    durationMinutes: 44,
    kind: "practice",
    body: String.raw`## Données

$$
A(-2;0;0),\qquad B(0;3;0),\qquad C(0;0;-4).
$$

## 1. Équation du plan $(ABC)$

On calcule

$$
\overrightarrow{AB}=(2;3;0),\qquad
\overrightarrow{AC}=(2;0;-4).
$$

Un normal $\vec n=(a;b;c)$ vérifie

$$
\begin{cases}
2a+3b=0,\\
2a-4c=0.
\end{cases}
$$

Un choix entier simple est

$$\vec n=(6;-4;3).$$

Le plan a donc une équation $6x-4y+3z+d=0$. Le point $A$ donne $d=12$ :

$$
(ABC):6x-4y+3z+12=0.
$$

## 2. Un plan $(P)$ passant par $A$ et orthogonal à $(ABC)$

Il suffit de choisir un normal $\vec n'$ orthogonal à $\vec n$. Par exemple

$$\vec n'=(0;3;4),\qquad \vec n\cdot\vec n'=0.$$

Le passage par $A(-2;0;0)$ conduit à

$$
(P):3y+4z=0.
$$

Plusieurs réponses sont possibles, car de nombreux vecteurs sont orthogonaux à $\vec n$.

> **Correction de libellé.** La dernière ligne du PDF nomme par erreur cette équation « équation de $(ABC)$ » ; il s’agit de l’équation du plan $(P)$.`,
    keyPoint: "Deux plans sont orthogonaux lorsque l’on peut choisir des normales de produit scalaire nul.",
    example: "$(6;-4;3)\\cdot(0;3;4)=0$, donc $3y+4z=0$ est orthogonal à $(ABC)$.",
    methodSteps: [
      "Calcule deux directions du premier plan.",
      "Résous deux équations pour obtenir un vecteur normal.",
      "Détermine l’équation du premier plan avec un point.",
      "Choisis un second normal orthogonal au premier.",
      "Utilise le point imposé pour obtenir le second plan.",
    ],
    timeline: [
      { label: "Directions", detail: "Construire AB et AC." },
      { label: "Normal 1", detail: "Résoudre n·AB=n·AC=0." },
      { label: "Normal 2", detail: "Choisir n' tel que n·n'=0." },
      { label: "Deux plans", detail: "Déterminer leurs termes constants." },
    ],
    corrections: [
      "Page 12 : la conclusion finale doit lire « une équation cartésienne de (P) est 3y+4z=0 », et non « de (ABC) ».",
    ],
    questions: [
      choice("Que vaut $\\overrightarrow{AB}$ ?", ["$(2;3;0)$", "$(-2;-3;0)$", "$(2;0;-4)$"], 0, "$B-A=(2;3;0)$.", "Renforcement 1 • page 12"),
      choice("Que vaut $\\overrightarrow{AC}$ ?", ["$(2;0;-4)$", "$(0;3;4)$", "$(-2;0;4)$"], 0, "$C-A=(2;0;-4)$.", "Renforcement 1 • page 12"),
      choice("Quel vecteur est normal à $(ABC)$ ?", ["$(6;-4;3)$", "$(2;3;0)$", "$(0;3;4)$"], 0, "Ses produits avec AB et AC sont nuls.", "Renforcement 1 • page 12", 2),
      short("Dans $6x-4y+3z+d=0$, combien vaut $d$ ?", ["12"], "Le point A(-2;0;0) donne $-12+d=0$.", "Renforcement 1 • page 12"),
      choice("Quelle est une équation de $(ABC)$ ?", ["$6x-4y+3z+12=0$", "$6x-4y+3z-12=0$", "$3y+4z=0$"], 0, "Le normal est $(6;-4;3)$ et $d=12$.", "Renforcement 1 • page 12", 2),
      short("Combien vaut $(6;-4;3)\\cdot(0;3;4)$ ?", ["0"], "$0-12+12=0$.", "Renforcement 1 • page 12"),
      choice("Quelle équation convient pour $(P)$ ?", ["$3y+4z=0$", "$6x-4y+3z+12=0$", "$3y-4z=0$"], 0, "Son normal $(0;3;4)$ est orthogonal au normal de $(ABC)$ et A vérifie l’équation.", "Renforcement 1 • page 12", 2),
    ],
  },
  {
    id: "containing-plane-reinforcement",
    title: "Renforcement : un plan contenant une droite",
    summary: "Construire un plan qui contient une droite d’intersection et reste perpendiculaire à un plan donné.",
    pages: "13",
    section: "D-2. Exercice de renforcement 2",
    durationMinutes: 46,
    kind: "practice",
    body: String.raw`## Données

$$
(P):x-y+3=0
$$

et $(D)$ est l’intersection de

$$
(Q):x-z-2=0,\qquad
(Q'):2x+y-3z+1=0.
$$

## 1. Montrer que $(D)\parallel(P)$

En posant $z=t$, on obtient

$$
(D):
\begin{cases}
x=2+t,\\
y=-5+t,\\
z=t,
\end{cases}
\qquad t\in\mathbb R.
$$

Un directeur est $\vec u=(1;1;1)$. Un normal à $(P)$ est $\vec n=(1;-1;0)$. Comme

$$\vec n\cdot\vec u=1-1+0=0,$$

la droite est parallèle au plan.

## 2. Construire le plan $(\Pi)$

Le plan $(\Pi)$ doit contenir $(D)$ et être perpendiculaire à $(P)$. Son normal $\vec n'=(a';b';c')$ doit donc vérifier

$$
\begin{cases}
\vec n'\cdot\vec u=0,\\
\vec n'\cdot\vec n=0.
\end{cases}
$$

soit

$$
\begin{cases}
a'+b'+c'=0,\\
a'-b'=0.
\end{cases}
$$

On peut choisir $\vec n'=(1;1;-2)$. Le point $E(2;-5;0)$ appartient à $(D)$, donc

$$
(\Pi):x+y-2z+3=0.
$$

> **Astuce mémoire de Davy.** « Contenir la droite » impose $n'\perp u$ ; « être perpendiculaire au plan » impose $n'\perp n$.`,
    keyPoint: "Le normal du plan cherché doit être orthogonal au directeur de la droite contenue et au normal de l’autre plan.",
    example: "$n'=(1;1;-2)$ donne $(\\Pi):x+y-2z+3=0$.",
    methodSteps: [
      "Paramètre la droite d’intersection des deux plans.",
      "Lis son vecteur directeur u.",
      "Écris les deux contraintes n'·u=0 et n'·n=0.",
      "Choisis une solution simple pour n'.",
      "Utilise un point de la droite pour déterminer le terme constant.",
    ],
    timeline: [
      { label: "Intersection", detail: "Paramétrer D à partir de Q et Q'." },
      { label: "Parallélisme", detail: "Tester u·n=0." },
      { label: "Double contrainte", detail: "Le nouveau normal est orthogonal à u et n." },
      { label: "Plan", detail: "Utiliser un point de D." },
    ],
    questions: [
      choice("Quelle représentation paramétrique de $(D)$ est correcte ?", ["$(2+t;-5+t;t)$", "$(2-t;5+t;t)$", "$(t;t;t)$"], 0, "On pose $z=t$ dans les deux équations.", "Renforcement 2 • page 13", 2),
      choice("Quel est un vecteur directeur de $(D)$ ?", ["$(1;1;1)$", "$(1;-1;0)$", "$(1;1;-2)$"], 0, "Ce sont les coefficients de $t$.", "Renforcement 2 • page 13"),
      short("Combien vaut $(1;1;1)\\cdot(1;-1;0)$ ?", ["0"], "$1-1+0=0$.", "Renforcement 2 • page 13"),
      choice("Quelle conclusion en tire-t-on ?", ["$(D)$ est parallèle à $(P)$", "$(D)$ est orthogonale à $(P)$", "$(D)$ est incluse dans $(P)$"], 0, "Le directeur de D est orthogonal au normal de P.", "Renforcement 2 • page 13"),
      choice("Quel normal convient pour $(\\Pi)$ ?", ["$(1;1;-2)$", "$(1;1;1)$", "$(1;-1;0)$"], 0, "Il est orthogonal à la fois à u et n.", "Renforcement 2 • page 13", 2),
      short("Avec le point $E(2;-5;0)$, combien vaut le terme constant de $x+y-2z+d=0$ ?", ["3"], "$2-5+d=0$, donc $d=3$.", "Renforcement 2 • page 13"),
      choice("Quelle est l’équation finale ?", ["$x+y-2z+3=0$", "$x-y+3=0$", "$x+y+2z-3=0$"], 0, "Elle contient D et son normal est orthogonal à celui de P.", "Renforcement 2 • page 13", 2),
    ],
  },
  {
    id: "parameterized-planes-mission",
    title: "Mission d’approfondissement : plans à paramètres",
    summary: "Déterminer les valeurs de paramètres qui rendent deux plans sécants puis deux droites orthogonales.",
    pages: "13-14",
    section: "D-3. Exercice d’approfondissement",
    durationMinutes: 48,
    kind: "challenge",
    body: String.raw`## Première condition : plans sécants

On considère

$$
(P):x+y+z=0,\qquad
(Q):ax+y+z+b=0.
$$

Leurs vecteurs normaux sont

$$\vec n=(1;1;1),\qquad \vec n'=(a;1;1).$$

Ils sont colinéaires exactement lorsque $a=1$. Les plans sont donc sécants lorsque

$$a\ne1.$$

## Paramétrer leur droite d’intersection

Sous la condition $a\ne1$, on soustrait les équations ou on pose $z=t$. On obtient

$$
(D):
\begin{cases}
x=-\dfrac{b}{a-1},\\[4pt]
y=-t+\dfrac{b}{a-1},\\[4pt]
z=t,
\end{cases}
\qquad t\in\mathbb R.
$$

Un vecteur directeur de $(D)$ est

$$\vec u=(0;-1;1).$$

## Deuxième condition : droites orthogonales

La droite $(D')$ est donnée par

$$
(D'):
\begin{cases}
x=1,\\
y=-3+b\lambda,\\
z=-1+\lambda,
\end{cases}
$$

et possède pour directeur

$$\vec u'=(0;b;1).$$

Les directions sont orthogonales si

$$
\vec u\cdot\vec u'=-b+1=0,
$$

donc si $b=1$.

La réponse complète est

$$
\boxed{a\ne1\quad\text{et}\quad b=1.}
$$

> **Astuce mémoire de Davy.** Une mission à paramètres demande souvent plusieurs conditions : écris-les séparément, puis réunis-les seulement à la fin.`,
    keyPoint: "Les conditions finales sont a≠1 et b=1.",
    example: "$n$ et $n'$ non colinéaires imposent $a\\ne1$ ; $u\\cdot u'=0$ impose $b=1$.",
    methodSteps: [
      "Traduis la première position géométrique par une condition sur les normales.",
      "Sous cette condition, paramètre proprement la droite d’intersection.",
      "Extrais les deux vecteurs directeurs.",
      "Traduis l’orthogonalité par un produit scalaire nul.",
      "Réunis toutes les restrictions dans la réponse finale.",
    ],
    timeline: [
      { label: "Normales", detail: "Comparer (1;1;1) et (a;1;1)." },
      { label: "Restriction", detail: "Garder a≠1 pour pouvoir diviser." },
      { label: "Directeurs", detail: "Lire u=(0;-1;1) et u'=(0;b;1)." },
      { label: "Synthèse", detail: "Résoudre -b+1=0 puis joindre les conditions." },
    ],
    questions: [
      choice("Quel est un vecteur normal à $(Q)$ ?", ["$(a;1;1)$", "$(1;1;1)$", "$(0;b;1)$"], 0, "On lit les coefficients de $x,y,z$.", "Approfondissement • pages 13-14"),
      choice("Pour quelle valeur les normales sont-elles colinéaires ?", ["$a=1$", "$a=0$", "$b=1$"], 0, "$(a;1;1)$ doit être proportionnel à $(1;1;1)$.", "Approfondissement • page 14", 2),
      choice("Quand les plans sont-ils sécants ?", ["$a\\ne1$", "$a=1$", "$b\\ne1$"], 0, "Leurs normales doivent être non colinéaires.", "Approfondissement • page 14", 2),
      choice("Dans la paramétrisation de $(D)$, que vaut $x$ ?", ["$-b/(a-1)$", "$b/(a+1)$", "$t$"], 0, "La soustraction des équations isole $(a-1)x=-b$.", "Approfondissement • page 14"),
      choice("Quel est un directeur de $(D)$ ?", ["$(0;-1;1)$", "$(1;1;1)$", "$(0;1;1)$"], 0, "Ce sont les coefficients du paramètre $t$.", "Approfondissement • page 14"),
      choice("Quel est un directeur de $(D')$ ?", ["$(0;b;1)$", "$(1;-3;-1)$", "$(a;1;1)$"], 0, "Ce sont les coefficients de $\\lambda$.", "Approfondissement • page 14"),
      choice("Que vaut $\\vec u\\cdot\\vec u'$ ?", ["$1-b$", "$1+b$", "$a-b$"], 0, "$0\\cdot0+(-1)b+1\\cdot1=1-b$.", "Approfondissement • page 14", 2),
      short("Quelle valeur doit prendre $b$ ?", ["1", "+1"], "L’équation $1-b=0$ donne $b=1$.", "Approfondissement • page 14", 2),
      choice("Quelle est la réponse complète ?", ["$a\\ne1$ et $b=1$", "$a=1$ et $b\\ne1$", "$a=b=1$"], 0, "Il faut conserver simultanément la condition de sécance et celle d’orthogonalité.", "Approfondissement • page 14", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCSpaceGeometryPath: LearningPath = {
  id: "terminale-c-math-l05-space-analytic-geometry",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Géométrie" },
  chapterNumber: 5,
  title: "Géométrie analytique de l’espace",
  description: "Le cours officiel intégral, sans la situation d’apprentissage introductive, enrichi avec ses démonstrations et exercices corrigés.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Construire et utiliser un vecteur normal à un plan",
    "Écrire une équation de plan et calculer une distance point-plan",
    "Paramétrer une droite de l’espace",
    "Étudier les positions relatives de droites et de plans",
    "Résoudre des problèmes de perpendicularité et d’intersection avec paramètres",
  ],
  modules: [{
    id: "official-course",
    title: "Leçon officielle",
    description: "Progression fidèle au document source, des notions fondamentales à la mission d’approfondissement.",
    lessons: builtLevels,
  }],
};
