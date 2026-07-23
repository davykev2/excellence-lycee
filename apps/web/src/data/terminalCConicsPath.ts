import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 07 Coniques.pdf";

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
      eyebrow: "Construction",
      title: "Construis la conique pas à pas",
      instruction: "Sélectionne chaque repère dans l’ordre pour relier l’équation à la figure géométrique.",
      observation: "Une conique devient beaucoup plus simple dès que son centre ou son sommet, son axe focal et ses paramètres sont identifiés.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Identifie d’abord la famille, mets l’équation sous forme réduite, puis lis les éléments géométriques sans mélanger les axes.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: "Astuce mémoire de Davy : le signe et le plus grand dénominateur indiquent la forme et la direction de l’axe focal.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "conic-focus-directrix",
    title: "Reconnaître une conique par foyer et directrice",
    summary: "Comparer la distance au foyer à la distance à la directrice grâce à l’excentricité $e$.",
    pages: "1-2",
    section: "I-1. Définition foyer-directrice, axe focal et exercice de fixation",
    durationMinutes: 30,
    body: String.raw`## Définition

Soient une droite $(\mathcal D)$, un point $F\notin(\mathcal D)$ et un réel $e>0$.

On appelle **conique de foyer $F$, de directrice $(\mathcal D)$ et d’excentricité $e$** l’ensemble $(\Gamma)$ des points $M$ du plan tels que

$$
\frac{MF}{MH}=e
\qquad\Longleftrightarrow\qquad
MF=e\,MH,
$$

où $H$ est le projeté orthogonal de $M$ sur $(\mathcal D)$. La longueur $MH$ est donc exactement la distance $d(M,(\mathcal D))$.

## Les trois familles

| Valeur de $e$ | Nature de la conique | Image mentale |
|---|---|---|
| $0<e<1$ | ellipse | le point reste relativement proche du foyer |
| $e=1$ | parabole | les deux distances sont égales |
| $e>1$ | hyperbole | la distance au foyer est la plus grande |

Les exemples du cours correspondent à $e=\frac13$, $e=1$ et $e=2$.

## Premier axe de symétrie

La droite $(\Delta)$ passant par $F$ et perpendiculaire à $(\mathcal D)$ est un axe de symétrie de la conique. Elle est appelée **axe focal**.

Si $M'$ est l’image d’un point $M\in(\Gamma)$ par la symétrie d’axe $(\Delta)$ :

- $M'F=MF$, car $F$ appartient à l’axe de symétrie ;
- $d(M',(\mathcal D))=d(M,(\mathcal D))$, car $(\mathcal D)$ est perpendiculaire à l’axe et reste inchangée ;
- donc $M'F=e\,d(M',(\mathcal D))$.

Ainsi, $M'\in(\Gamma)$.

> **Astuce mémoire de Davy.** « Petit $e$ : ellipse ; $e=1$ : parabole ; grand $e$ : hyperbole. »

> **Erreur fréquente.** $MH$ n’est pas une distance choisie au hasard : $H$ doit être le projeté orthogonal de $M$ sur la directrice.`,
    keyPoint: "Une conique vérifie $MF=e\,d(M,(\mathcal D))$ : ellipse si $e<1$, parabole si $e=1$, hyperbole si $e>1$.",
    example: "Si $MF=\\frac13 MH$, la conique est une ellipse d’excentricité $1/3$.",
    methodSteps: [
      "Repère le foyer F, la directrice et le projeté orthogonal H.",
      "Écris la relation MF=e·MH.",
      "Compare e à 1 pour identifier la famille.",
      "Trace mentalement l’axe focal : il passe par F et est perpendiculaire à la directrice.",
    ],
    timeline: [
      { label: "Foyer", detail: "Le point fixe F sert à mesurer la première distance MF." },
      { label: "Directrice", detail: "La droite fixe fournit la distance perpendiculaire MH." },
      { label: "Excentricité", detail: "Le rapport MF/MH classe la conique." },
      { label: "Symétrie", detail: "L’axe focal conserve les deux distances et donc toute la conique." },
    ],
    questions: [
      choice("Quelle relation définit une conique de foyer $F$, de directrice $(\\mathcal D)$ et d’excentricité $e$ ?", ["$MF=e\\,MH$", "$MF+MH=e$", "$MF=MH/e^2$", "$MF\\times MH=e$"], 0, "$H$ est le projeté orthogonal de $M$ sur la directrice et le rapport $MF/MH$ vaut $e$.", "Définition • page 1", 2),
      choice("Une conique d’excentricité $1/3$ est :", ["une ellipse", "une parabole", "une hyperbole", "un cercle dans tous les cas"], 0, "$0<1/3<1$ : il s’agit d’une ellipse.", "Exemple • page 1"),
      choice("Une conique d’excentricité $1$ est :", ["une ellipse", "une parabole", "une hyperbole", "une droite"], 1, "$e=1$ caractérise la parabole.", "Définition • page 1"),
      choice("Une conique d’excentricité $2$ est :", ["une ellipse", "une parabole", "une hyperbole", "un cercle"], 2, "$2>1$ : il s’agit d’une hyperbole.", "Exemple • page 1"),
      choice("Comment construit-on l’axe focal $(\\Delta)$ ?", ["Il passe par $F$ et est perpendiculaire à $(\\mathcal D)$", "Il est parallèle à $(\\mathcal D)$", "Il passe par l’origine", "Il est confondu avec $(\\mathcal D)$"], 0, "C’est la propriété 1 du cours.", "Propriété 1 • pages 1-2", 2),
      choice("Pourquoi le symétrique $M'$ de $M\\in(\\Gamma)$ par rapport à $(\\Delta)$ appartient-il aussi à $(\\Gamma)$ ?", ["Les distances à $F$ et à $(\\mathcal D)$ sont conservées", "Toute symétrie conserve les coordonnées", "$M'=F$", "$(\\mathcal D)$ disparaît"], 0, "La symétrie conserve $MF$ et la distance à la directrice, donc la relation caractéristique reste vraie.", "Exercice de fixation • page 2", 3),
    ],
  },
  {
    id: "conic-axis-vertices",
    title: "Déterminer l’axe focal et les sommets",
    summary: "Projeter le foyer sur la directrice puis utiliser le milieu ou les barycentres du cours.",
    pages: "2-3",
    section: "I-1. Sommets, barycentres et exercice de fixation",
    durationMinutes: 34,
    body: String.raw`## Le projeté $K$

On note $K$ le projeté orthogonal du foyer $F$ sur la directrice $(\mathcal D)$. Les points $F$ et $K$ appartiennent à l’axe focal.

## Cas de la parabole

Lorsque $e=1$, la conique coupe son axe focal en un seul sommet $S$. Ce sommet est le milieu de $[FK]$ :

$$
S=\operatorname{mil}(F,K).
$$

## Cas des coniques à deux sommets focaux

Lorsque $e\ne1$, les deux sommets $A$ et $A'$ situés sur l’axe focal sont

$$
A=\operatorname{bar}\{(F,1),(K,e)\},
\qquad
A'=\operatorname{bar}\{(F,1),(K,-e)\}.
$$

Sur l’axe orienté, cela revient à

$$
A=\frac{F+eK}{1+e},
\qquad
A'=\frac{F-eK}{1-e}.
$$

## Exemple officiel

On donne $F(2;3)$, $(\mathcal D):x=-4$ et $e=\frac13$.

La directrice est verticale. L’axe focal est donc horizontal et passe par $F$ :

$$
(\Delta):y=3.
$$

Le projeté est $K(-4;3)$. Alors

$$
A=\frac{F+\frac13K}{1+\frac13}
=\frac{3F+K}{4}
=\left(\frac12;3\right),
$$

et

$$
A'=\frac{F-\frac13K}{1-\frac13}
=\frac{3F-K}{2}
=(5;3).
$$

> **Point difficile.** Le coefficient de $K$ change de signe pour $A'$, mais le dénominateur devient aussi $1-e$.

> **Astuce mémoire de Davy.** Commence toujours par $K$. Sans le projeté du foyer, les formules de sommet restent abstraites.`,
    keyPoint: "$S$ est le milieu de $[FK]$ si $e=1$ ; sinon $A=(F+eK)/(1+e)$ et $A'=(F-eK)/(1-e)$.",
    example: "Pour $F(2;3)$, $K(-4;3)$ et $e=1/3$, on obtient $A(1/2;3)$ et $A'(5;3)$.",
    methodSteps: [
      "Construis le projeté orthogonal K de F sur la directrice.",
      "Écris l’équation de l’axe focal passant par F et K.",
      "Si e=1, prends le milieu de [FK].",
      "Si e≠1, applique séparément les deux formules barycentriques.",
      "Vérifie que les sommets obtenus appartiennent bien à l’axe focal.",
    ],
    timeline: [
      { label: "Projeter", detail: "Trouver K sur la directrice à la verticale ou à l’horizontale de F." },
      { label: "Tracer l’axe", detail: "La droite FK est l’axe focal." },
      { label: "Choisir le cas", detail: "Milieu pour e=1, deux barycentres pour e≠1." },
      { label: "Contrôler", detail: "Les deux sommets doivent être alignés avec F et K." },
    ],
    questions: [
      choice("Lorsque $e=1$, le sommet $S$ est :", ["le milieu de $[FK]$", "le point $F$", "le point $K$", "le barycentre de coefficients $1$ et $-1$"], 0, "C’est la remarque qui suit la propriété 2.", "Propriété 2 • page 2"),
      choice("Lorsque $e\\ne1$, combien de sommets la conique possède-t-elle sur l’axe focal ?", ["un", "deux", "trois", "aucun"], 1, "Le cours les note $A$ et $A'$.", "Propriété 2 • page 2"),
      choice("Pour $F(2;3)$ et $(\\mathcal D):x=-4$, quel est le projeté $K$ ?", ["$K(-4;3)$", "$K(2;-4)$", "$K(-4;0)$", "$K(2;3)$"], 0, "La projection sur la droite verticale conserve l’ordonnée et impose $x=-4$.", "Exercice de fixation • pages 2-3", 2),
      choice("Quelle est l’équation de l’axe focal dans cet exemple ?", ["$y=3$", "$x=2$", "$x=-4$", "$y=-4$"], 0, "Il est horizontal, passe par $F$ et est perpendiculaire à la directrice verticale.", "Exercice de fixation • page 3", 2),
      choice("Quel est le sommet $A$ pour $e=1/3$ ?", ["$(1/2;3)$", "$(5;3)$", "$(-1/2;3)$", "$(1/2;-3)$"], 0, "$A=(3F+K)/4=(1/2;3)$.", "Exercice de fixation • page 3", 3),
      choice("Quel est le second sommet $A'$ ?", ["$(5;3)$", "$(1/2;3)$", "$(-5;3)$", "$(5;-3)$"], 0, "$A'=(3F-K)/2=(5;3)$.", "Exercice de fixation • page 3", 3),
      short("Donne l’ordonnée commune de $F$, $K$, $A$ et $A'$.", ["3", "+3"], "Tous ces points appartiennent à l’axe focal $y=3$.", "Exercice de fixation • page 3"),
    ],
  },
  {
    id: "conic-region",
    title: "Distinguer l’intérieur et l’extérieur",
    summary: "Comparer $MF$ à $e\\,MH$ pour situer un point par rapport à une conique.",
    pages: "3",
    section: "I-2. Régionnement du plan par une conique",
    durationMinutes: 22,
    body: String.raw`## Le test de position

Pour un point $M$ du plan, on note $H$ son projeté orthogonal sur la directrice. Trois cas sont possibles :

$$
\begin{array}{c|c}
\text{Comparaison} & \text{Position de }M\\
\hline
MF<e\,MH & M\text{ est intérieur à }(\Gamma)\\
MF=e\,MH & M\text{ appartient à }(\Gamma)\\
MF>e\,MH & M\text{ est extérieur à }(\Gamma)
\end{array}
$$

On peut aussi étudier le signe de

$$
\Phi(M)=MF-e\,d(M,(\mathcal D)).
$$

- $\Phi(M)<0$ : intérieur ;
- $\Phi(M)=0$ : sur la conique ;
- $\Phi(M)>0$ : extérieur.

## Deux repères immédiats

Le foyer $F$ est intérieur : $FF=0$, alors que sa distance à la directrice est strictement positive.

Tout point $M$ de la directrice est extérieur : $MH=0$, tandis que $MF>0$ puisque le foyer n’appartient pas à la directrice.

## Exemple guidé

Si $e=\frac12$, $MF=3$ et $MH=8$, alors

$$
e\,MH=\frac12\times8=4.
$$

Comme $3<4$, le point est intérieur.

> **Astuce mémoire de Davy.** La gauche de la comparaison est toujours la distance au foyer ; la droite est la distance à la directrice multipliée par $e$.`,
    keyPoint: "$MF<eMH$ : intérieur ; $MF=eMH$ : sur la conique ; $MF>eMH$ : extérieur.",
    example: "Avec $e=1/2$, $MF=3$ et $MH=8$, on a $3<4$ : le point est intérieur.",
    methodSteps: [
      "Calcule la distance MF.",
      "Calcule la distance MH à la directrice.",
      "Multiplie MH par l’excentricité e.",
      "Compare les deux nombres et annonce la position du point.",
    ],
    timeline: [
      { label: "Distance au foyer", detail: "Mesurer MF." },
      { label: "Distance à la droite", detail: "Projeter M sur la directrice pour obtenir MH." },
      { label: "Pondération", detail: "Calculer e·MH." },
      { label: "Position", detail: "Lire intérieur, frontière ou extérieur avec le signe de MF-eMH." },
    ],
    questions: [
      choice("Quelle inégalité caractérise un point intérieur à la conique ?", ["$MF<e\\,MH$", "$MF>e\\,MH$", "$MF=e\\,MH$", "$MF+MH=e$"], 0, "C’est la définition du régionnement donnée par le cours.", "Régionnement • page 3"),
      choice("Quelle égalité caractérise un point situé sur la conique ?", ["$MF=e\\,MH$", "$MF<e\\,MH$", "$MF>e\\,MH$", "$MF=0$"], 0, "C’est la relation foyer-directrice elle-même.", "Régionnement • page 3"),
      choice("Le foyer $F$ est toujours :", ["intérieur", "extérieur", "sur la directrice", "sur la conique"], 0, "$FF=0<e\\,d(F,(\\mathcal D))$.", "Remarque • page 3", 2),
      choice("Un point de la directrice est toujours :", ["extérieur", "intérieur", "sur la conique", "le foyer"], 0, "Sa distance à la directrice vaut $0$ tandis que sa distance au foyer est positive.", "Remarque • page 3", 2),
      choice("Pour $e=1/2$, $MF=3$ et $MH=8$, le point est :", ["intérieur", "extérieur", "sur la conique", "impossible à classer"], 0, "$eMH=4$ et $3<4$.", "Application guidée • page 3", 2),
    ],
  },
  {
    id: "parabola-reduced-equation",
    title: "Maîtriser l’équation réduite d’une parabole",
    summary: "Lire le sommet, l’axe focal, le foyer et la directrice dans $y^2=2ax$ ou $x^2=2ay$.",
    pages: "3-4 et 6",
    section: "II-1 et III-1. Équation réduite et éléments caractéristiques de la parabole",
    durationMinutes: 44,
    body: String.raw`## Repère adapté

Dans un repère orthonormé d’origine le sommet $S$, dont le premier axe est dirigé vers le foyer, une parabole admet l’équation

$$
y^2=2px,\qquad p=KF>0.
$$

Le foyer et la directrice sont alors

$$
F\left(\frac p2;0\right),
\qquad
(\mathcal D):x=-\frac p2.
$$

## Repère fixé et coefficient signé

Dans un repère déjà orienté, le cours écrit plus généralement

$$
y^2=2ax,\qquad a\ne0.
$$

Le signe de $a$ indique le sens d’ouverture :

| Équation | Axe focal | Foyer | Directrice |
|---|---|---|---|
| $y^2=2ax$ | axe horizontal | $F(a/2;0)$ | $x=-a/2$ |
| $x^2=2ay$ | axe vertical | $F(0;a/2)$ | $y=-a/2$ |

Le **paramètre géométrique** est $|a|$.

- $a>0$ : ouverture vers les coordonnées positives de l’axe focal ;
- $a<0$ : ouverture vers les coordonnées négatives.

## Exercice de fixation officiel

$$
y^2+4x=0
\quad\Longleftrightarrow\quad
y^2=-4x=2(-2)x.
$$

Ainsi $a=-2$. La parabole a pour :

$$
S=O,\qquad
\text{axe focal }(O,\vec i),\qquad
F(-1;0),\qquad
(\mathcal D):x=1.
$$

> **Astuce mémoire de Davy.** Le foyer prend la moitié du coefficient signé $a$ ; la directrice prend son opposé.`,
    keyPoint: "$y^2=2ax\\Rightarrow F(a/2;0)$ et $x=-a/2$ ; $x^2=2ay\\Rightarrow F(0;a/2)$ et $y=-a/2$.",
    example: "$y^2=-4x$ donne $a=-2$, donc $F(-1;0)$ et la directrice $x=1$.",
    methodSteps: [
      "Mets le carré seul dans un membre.",
      "Identifie si la variable au carré est x ou y.",
      "Compare le coefficient à 2a.",
      "Lis le sommet et l’axe focal.",
      "Place le foyer à a/2 et la directrice à -a/2.",
    ],
    timeline: [
      { label: "Sommet", detail: "Dans la forme réduite non translatée, le sommet est l’origine." },
      { label: "Axe focal", detail: "La variable non carrée indique l’axe d’ouverture." },
      { label: "Foyer", detail: "La coordonnée focale vaut a/2." },
      { label: "Directrice", detail: "Elle est perpendiculaire à l’axe et placée en -a/2." },
    ],
    questions: [
      choice("Dans $y^2=2ax$, l’axe focal est :", ["horizontal", "vertical", "la droite $y=x$", "indéterminé"], 0, "La parabole se déplace selon la variable non carrée $x$.", "Propriété • pages 3-4"),
      choice("Dans $x^2=2ay$, le foyer est :", ["$(0;a/2)$", "$(a/2;0)$", "$(0;-a/2)$", "$(a;a)$"], 0, "L’axe focal est vertical.", "Remarque • page 3"),
      choice("Quel est le paramètre géométrique de $y^2=2ax$ ?", ["$|a|$", "$a^2$", "$2a$", "$1/a$"], 0, "Le tableau récapitulatif donne $|a|$.", "Tableau • page 6"),
      choice("La parabole $y^2=-4x$ s’ouvre :", ["vers la gauche", "vers la droite", "vers le haut", "vers le bas"], 0, "Le coefficient signé $a=-2$ est négatif.", "Exercice de fixation • page 4"),
      short("Dans $y^2=-4x=2ax$, quelle est la valeur de $a$ ?", ["-2"], "On résout $2a=-4$.", "Exercice de fixation • page 4"),
      choice("Quel est le foyer de $y^2+4x=0$ ?", ["$F(-1;0)$", "$F(1;0)$", "$F(-2;0)$", "$F(0;-1)$"], 0, "$a/2=-1$.", "Exercice de fixation • page 4", 2),
      choice("Quelle est sa directrice ?", ["$x=1$", "$x=-1$", "$y=1$", "$y=-1$"], 0, "La directrice est $x=-a/2=1$.", "Exercice de fixation • page 4", 2),
      choice("Quelle équation décrit une parabole de sommet $O$, d’axe vertical et ouverte vers le bas ?", ["$x^2=-4y$", "$y^2=-4x$", "$x^2=4y$", "$y^2=4x$"], 0, "L’axe vertical impose $x^2=2ay$ et l’ouverture vers le bas impose $a<0$.", "Tableau • page 6", 2),
    ],
  },
  {
    id: "ellipse-reduced-equation",
    title: "Lire tous les éléments d’une ellipse",
    summary: "Repérer le grand axe, calculer $c$, l’excentricité, les foyers, les sommets et les directrices.",
    pages: "4-5 et 7",
    section: "II-2 et III-2. Coniques à centre et ellipse",
    durationMinutes: 50,
    body: String.raw`## Conique à centre

Pour une conique d’excentricité $e\ne1$, les sommets focaux $A$ et $A'$ ont pour milieu le centre $O$. La médiatrice de $[AA']$ est un second axe de symétrie.

Les deux foyers $F$ et $F'$ sont symétriques par rapport à $O$, de même que les directrices $(\mathcal D)$ et $(\mathcal D')$.

La distance focale est

$$
FF'=2c.
$$

## Ellipse horizontale

Si $a>b>0$ :

$$
\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,
\qquad
c=\sqrt{a^2-b^2},
\qquad
e=\frac ca<1.
$$

| Élément | Valeur |
|---|---|
| centre | $O$ |
| axe focal et grand axe | horizontal |
| sommets focaux | $A(\pm a;0)$ |
| autres sommets | $B(0;\pm b)$ |
| foyers | $F(\pm c;0)$ |
| directrices | $x=\pm a^2/c$ |

## Ellipse verticale

Si le plus grand dénominateur est sous $y^2$, l’axe focal est vertical :

$$
\frac{x^2}{a^2}+\frac{y^2}{b^2}=1,\quad b>a,
\qquad
c=\sqrt{b^2-a^2},\quad e=\frac cb.
$$

Les foyers sont $(0;\pm c)$ et les directrices $y=\pm b^2/c$.

Lorsque les deux dénominateurs sont égaux, l’ellipse est un cercle.

## Exercice de fixation officiel

Pour

$$
\frac{x^2}{25}+\frac{y^2}{9}=1,
$$

on a $a=5$, $b=3$ et

$$
c=\sqrt{25-9}=4,\qquad e=\frac45.
$$

Donc :

$$
F(4;0),\;F'(-4;0),\quad
A(5;0),\;A'(-5;0),\quad
x=\pm\frac{25}{4}.
$$

> **Astuce mémoire de Davy.** Pour une ellipse, le plus grand dénominateur montre le grand axe ; on **soustrait** les carrés pour calculer $c$.`,
    keyPoint: "Ellipse : $c^2=(\\text{grand demi-axe})^2-(\\text{petit demi-axe})^2$ et $0<e<1$.",
    example: "$x^2/25+y^2/9=1$ donne $c=4$, $e=4/5$, les foyers $(\\pm4;0)$ et les directrices $x=\\pm25/4$.",
    methodSteps: [
      "Vérifie que les deux termes carrés sont additionnés.",
      "Repère le plus grand dénominateur : il porte l’axe focal.",
      "Calcule c par différence des carrés.",
      "Place les sommets, puis les foyers à distance c du centre.",
      "Calcule les directrices avec le carré du grand demi-axe divisé par c.",
    ],
    timeline: [
      { label: "Centre", detail: "Lire la translation éventuelle puis repérer le centre de symétrie." },
      { label: "Grand axe", detail: "Chercher le plus grand dénominateur." },
      { label: "Foyers", detail: "Calculer c par différence des carrés." },
      { label: "Directrices", detail: "Placer les deux droites symétriques à distance grand²/c." },
    ],
    corrections: [
      "Dans le tableau de la page 7, la seconde directrice de l’ellipse verticale est encore notée (D). Elle doit être notée (D′), car les deux directrices sont symétriques.",
    ],
    questions: [
      choice("Quel signe sépare les deux termes carrés d’une ellipse réduite ?", ["un signe $+$", "un signe $-$", "un signe $\\times$", "aucun signe"], 0, "Une ellipse centrée possède deux termes carrés positifs additionnés.", "Équation réduite • pages 4 et 7"),
      choice("Pour $x^2/25+y^2/9=1$, quel est le grand axe ?", ["l’axe horizontal", "l’axe vertical", "la droite $y=x$", "aucun"], 0, "$25>9$ : le plus grand dénominateur est sous $x^2$.", "Exercice de fixation • page 5"),
      short("Calcule $c$ pour $a=5$ et $b=3$.", ["4", "+4"], "$c=\\sqrt{25-9}=4$.", "Exercice de fixation • page 5", 2),
      choice("Quelle est l’excentricité de cette ellipse ?", ["$4/5$", "$5/4$", "$3/5$", "$1$"], 0, "$e=c/a=4/5$.", "Exercice de fixation • page 5", 2),
      choice("Quels sont ses foyers ?", ["$(4;0)$ et $(-4;0)$", "$(5;0)$ et $(-5;0)$", "$(0;4)$ et $(0;-4)$", "$(3;0)$ et $(-3;0)$"], 0, "L’axe focal est horizontal et la demi-distance focale vaut $4$.", "Exercice de fixation • page 5", 2),
      choice("Quelles sont ses directrices ?", ["$x=\\pm25/4$", "$x=\\pm4/25$", "$y=\\pm25/4$", "$x=\\pm5$"], 0, "Pour une ellipse horizontale, les directrices sont $x=\\pm a^2/c$.", "Exercice de fixation • page 5", 3),
      choice("Si le plus grand dénominateur est sous $y^2$, les foyers sont de la forme :", ["$(0;\\pm c)$", "$(\\pm c;0)$", "$(\\pm a;\\pm b)$", "$(c;c)$"], 0, "L’axe focal est alors vertical.", "Tableau • page 7"),
      choice("Que devient l’ellipse lorsque les deux demi-axes sont égaux ?", ["un cercle", "une parabole", "une hyperbole", "une droite"], 0, "Le cours précise que $a=b$ donne un cercle.", "Remarque • page 7"),
      choice("La distance focale $FF'$ vaut :", ["$2c$", "$c/2$", "$a+b$", "$2a$"], 0, "Les foyers sont situés à distance $c$ de part et d’autre du centre.", "Coniques à centre • page 5"),
    ],
  },
  {
    id: "hyperbola-reduced-equation",
    title: "Lire tous les éléments d’une hyperbole",
    summary: "Reconnaître le terme positif, calculer $c$, placer les foyers et tracer les asymptotes.",
    pages: "4-5 et 8",
    section: "II-2 et III-3. Hyperbole et éléments caractéristiques",
    durationMinutes: 52,
    body: String.raw`## Hyperbole horizontale

$$
\frac{x^2}{a^2}-\frac{y^2}{b^2}=1,
\qquad
c=\sqrt{a^2+b^2},
\qquad
e=\frac ca>1.
$$

Le terme positif $x^2/a^2$ montre que l’axe focal est horizontal.

| Élément | Valeur |
|---|---|
| sommets | $(\pm a;0)$ |
| foyers | $(\pm c;0)$ |
| directrices | $x=\pm a^2/c$ |
| asymptotes | $y=\pm(b/a)x$ |

## Hyperbole verticale

$$
-\frac{x^2}{a^2}+\frac{y^2}{b^2}=1.
$$

Le terme positif est maintenant celui en $y^2$ :

- sommets $(0;\pm b)$ ;
- foyers $(0;\pm c)$ ;
- directrices $y=\pm b^2/c$ ;
- asymptotes $y=\pm(b/a)x$.

Dans les deux cas,

$$
c^2=a^2+b^2.
$$

Si les deux demi-axes ont la même longueur, l’hyperbole est dite **équilatère**.

## Exercice de fixation officiel

Pour

$$
\frac{x^2}{4}-y^2=1,
$$

on a $a=2$, $b=1$ et $c=\sqrt5$. La conique est une hyperbole horizontale :

$$
\begin{aligned}
&A(2;0),\quad A'(-2;0),\\
&F(\sqrt5;0),\quad F'(-\sqrt5;0),\\
&(\mathcal D):x=\frac{4}{\sqrt5}=\frac{4\sqrt5}{5},\\
&(\mathcal D'):x=-\frac{4\sqrt5}{5},\\
&y=\frac12x\quad\text{et}\quad y=-\frac12x.
\end{aligned}
$$

> **Correction de source importante.** La page 5 imprime un signe moins devant les **deux** directrices. Elles doivent avoir des signes opposés.

> **Astuce mémoire de Davy.** Pour l’hyperbole, le terme positif donne l’axe focal et on **additionne** les carrés pour calculer $c$.`,
    keyPoint: "Hyperbole : le terme positif donne l’axe focal, $c^2=a^2+b^2$ et les asymptotes viennent du rectangle des demi-axes.",
    example: "$x^2/4-y^2=1$ donne $c=\\sqrt5$, les foyers $(\\pm\\sqrt5;0)$ et les asymptotes $y=\\pm x/2$.",
    methodSteps: [
      "Vérifie que les deux termes carrés ont des signes opposés.",
      "Repère le terme positif : il porte l’axe focal.",
      "Calcule c par somme des carrés.",
      "Place sommets, foyers et directrices sur l’axe focal.",
      "Écris les deux asymptotes avec les rapports des demi-axes.",
    ],
    timeline: [
      { label: "Signe positif", detail: "Il indique la direction des deux branches." },
      { label: "Somme des carrés", detail: "Calculer c²=a²+b²." },
      { label: "Éléments focaux", detail: "Placer sommets, foyers et directrices." },
      { label: "Asymptotes", detail: "Tracer les diagonales du rectangle caractéristique." },
    ],
    corrections: [
      "Dans la solution de la page 5 pour x²/4−y²=1, les deux directrices sont imprimées avec un signe moins. Les équations correctes sont x=4√5/5 et x=−4√5/5.",
    ],
    questions: [
      choice("Quel signe sépare les deux termes carrés d’une hyperbole ?", ["un signe $-$", "un signe $+$ seulement", "un signe $\\times$", "aucun"], 0, "Une hyperbole réduite possède un terme carré positif et l’autre négatif.", "Équation réduite • pages 4 et 8"),
      choice("Dans $x^2/4-y^2=1$, quel est l’axe focal ?", ["horizontal", "vertical", "la droite $y=x$", "aucun"], 0, "Le terme positif est celui en $x^2$.", "Exercice de fixation • page 5"),
      short("Calcule $c^2$ lorsque $a=2$ et $b=1$.", ["5", "+5"], "$c^2=a^2+b^2=4+1=5$.", "Exercice de fixation • page 5"),
      choice("Quels sont les foyers ?", ["$(\\pm\\sqrt5;0)$", "$(\\pm2;0)$", "$(0;\\pm\\sqrt5)$", "$(\\pm1;0)$"], 0, "La demi-distance focale vaut $\\sqrt5$ sur l’axe horizontal.", "Exercice de fixation • page 5", 2),
      choice("Quelles sont les directrices corrigées ?", ["$x=\\pm4\\sqrt5/5$", "$x=-4\\sqrt5/5$ deux fois", "$y=\\pm4\\sqrt5/5$", "$x=\\pm2$"], 0, "Elles sont symétriques par rapport au centre.", "Exercice corrigé • page 5", 3),
      choice("Quelles sont les asymptotes de $x^2/4-y^2=1$ ?", ["$y=\\pm x/2$", "$y=\\pm2x$", "$x=\\pm2$", "$y=\\pm\\sqrt5$"], 0, "$b/a=1/2$.", "Tableau • page 8", 2),
      choice("Pour $-x^2/a^2+y^2/b^2=1$, les sommets sont :", ["$(0;\\pm b)$", "$(\\pm a;0)$", "$(0;\\pm a)$", "$(\\pm b;0)$"], 0, "Le terme positif est vertical.", "Tableau • page 8"),
      choice("Une hyperbole avec $a=b$ est dite :", ["équilatère", "circulaire", "dégénérée", "parabolique"], 0, "C’est la remarque du cours.", "Remarque • page 8"),
      choice("Pour une hyperbole, l’excentricité vérifie :", ["$e>1$", "$0<e<1$", "$e=1$", "$e=0$"], 0, "C’est la classification foyer-directrice.", "Rappel • pages 1 et 4"),
    ],
  },
  {
    id: "pool-ellipse-mission",
    title: "Mission : construire la piscine elliptique",
    summary: "Réduire une équation translatée, retrouver tous ses éléments et convertir le dessin à l’échelle.",
    pages: "8-10",
    section: "C. Situation complexe : piscine de Monsieur Coulibaly",
    durationMinutes: 52,
    kind: "challenge",
    body: String.raw`## Situation

Le bord de la piscine doit être deux fois plus proche de la pompe $F$ que du mur $(\mathcal D)$ :

$$
MF=\frac12\,d(M,(\mathcal D))
$$

La conique est donc une ellipse d’excentricité $e=\frac12$.

Dans le repère du jardin, d’unité $2$ mètres, son équation est

$$
3x^2+4y^2+6x-9=0.
$$

## 1. Réduire l’équation

On complète le carré :

$$
\begin{aligned}
3x^2+4y^2+6x-9&=0\\
3(x^2+2x)+4y^2&=9\\
3\big((x+1)^2-1\big)+4y^2&=9\\
3(x+1)^2+4y^2&=12.
\end{aligned}
$$

Donc

$$
\frac{(x+1)^2}{4}+\frac{y^2}{3}=1.
$$

## 2. Lire les éléments caractéristiques

Le centre est $\Omega(-1;0)$, avec

$$
a=2,\qquad b=\sqrt3,\qquad c=\sqrt{4-3}=1,\qquad e=\frac12.
$$

Dans le repère d’origine $O$ :

| Élément | Coordonnées ou équations |
|---|---|
| sommets focaux | $A(1;0)$ et $A'(-3;0)$ |
| autres sommets | $B(-1;\sqrt3)$ et $B'(-1;-\sqrt3)$ |
| foyers | $F(0;0)$ et $F'(-2;0)$ |
| directrices | $x=3$ et $x=-5$ |

Le premier foyer est bien la pompe placée à l’origine.

## 3. Dimensions réelles et dessin

Une unité du repère vaut $2$ m.

- grand diamètre : $4$ unités, donc $8$ m ;
- petit diamètre : $2\sqrt3$ unités, donc $4\sqrt3\approx6{,}93$ m.

À l’échelle $1/100$, ces dimensions deviennent $8$ cm et environ $6{,}93$ cm.

> **Astuce mémoire de Davy.** Avant de chercher les foyers, fais apparaître les carrés parfaits : le centre se lit dans $(x-\alpha)^2$ et $(y-\beta)^2$.`,
    keyPoint: "$3x^2+4y^2+6x-9=0\\iff (x+1)^2/4+y^2/3=1$.",
    example: "Le bord est une ellipse de centre $(-1;0)$, de foyers $(0;0)$ et $(-2;0)$, longue de $8$ m.",
    methodSteps: [
      "Regroupe les termes en x et complète le carré.",
      "Divise pour obtenir un membre de droite égal à 1.",
      "Lis le centre et les deux demi-axes.",
      "Calcule c, puis place sommets, foyers et directrices.",
      "Convertis les unités du repère en mètres puis à l’échelle du dessin.",
    ],
    timeline: [
      { label: "Compléter le carré", detail: "Transformer x²+2x en (x+1)²−1." },
      { label: "Réduire", detail: "Obtenir (x+1)²/4+y²/3=1." },
      { label: "Construire", detail: "Placer le centre, les sommets, les foyers et les directrices." },
      { label: "Mettre à l’échelle", detail: "Deux mètres réels correspondent à deux centimètres sur le plan au 1/100." },
    ],
    questions: [
      choice("Quelle est la nature de la conique puisque $e=1/2$ ?", ["une ellipse", "une parabole", "une hyperbole", "une droite"], 0, "$0<1/2<1$.", "Situation complexe • page 8"),
      choice("Quelle identité complète le carré de $x^2+2x$ ?", ["$(x+1)^2-1$", "$(x-1)^2+1$", "$(x+2)^2-4$", "$(x+1)^2+1$"], 0, "$(x+1)^2=x^2+2x+1$.", "Solution • page 9"),
      choice("Quelle est l’équation réduite ?", ["$(x+1)^2/4+y^2/3=1$", "$(x-1)^2/4+y^2/3=1$", "$(x+1)^2/3-y^2/4=1$", "$x^2/4+y^2/3=1$"], 0, "On obtient $3(x+1)^2+4y^2=12$.", "Solution • page 9", 3),
      choice("Quel est le centre de l’ellipse ?", ["$(-1;0)$", "$(1;0)$", "$(0;-1)$", "$(0;0)$"], 0, "La translation est donnée par $(x+1)^2=(x-(-1))^2$.", "Solution • page 9", 2),
      short("Calcule la demi-distance focale $c$.", ["1", "+1"], "$c=\\sqrt{4-3}=1$.", "Solution • page 9", 2),
      choice("Quels sont les foyers dans le repère du jardin ?", ["$(0;0)$ et $(-2;0)$", "$(1;0)$ et $(-3;0)$", "$(-1;\\pm1)$", "$(0;0)$ et $(2;0)$"], 0, "On ajoute $\\pm c$ à l’abscisse du centre $-1$.", "Solution • page 9", 2),
      choice("Quels sont les sommets focaux ?", ["$(1;0)$ et $(-3;0)$", "$(0;0)$ et $(-2;0)$", "$(-1;\\pm\\sqrt3)$", "$(2;0)$ et $(-2;0)$"], 0, "On ajoute $\\pm a=\\pm2$ à l’abscisse du centre.", "Solution • page 9", 2),
      choice("Quelles sont les directrices ?", ["$x=3$ et $x=-5$", "$x=4$ et $x=-4$", "$y=3$ et $y=-5$", "$x=1$ et $x=-3$"], 0, "Dans le repère centré elles valent $X=\\pm4$, puis $x=-1+X$.", "Solution • page 9", 3),
      choice("Quelle est la longueur réelle du grand diamètre ?", ["$8$ m", "$4$ m", "$2$ m", "$16$ m"], 0, "Le diamètre vaut $4$ unités et une unité représente $2$ m.", "Mise à l’échelle • pages 8-10", 2),
    ],
  },
  {
    id: "official-fixation-workshop",
    title: "Atelier des exercices de fixation",
    summary: "Résoudre les exercices officiels 1 et 2 sur les paraboles, ellipses et hyperboles translatées.",
    pages: "10-11",
    section: "D-1. Exercices de fixation 1 et 2",
    durationMinutes: 56,
    kind: "practice",
    body: String.raw`## Exercice 1 : deux paraboles

### 1. $2y^2+3x=0$

$$
y^2=-\frac32x=2\left(-\frac34\right)x.
$$

Ainsi $a=-\frac34$ :

$$
S=O,\qquad
\text{axe focal horizontal},\qquad
F\left(-\frac38;0\right),\qquad
x=\frac38.
$$

### 2. $x^2-2x=-3y-1$

$$
x^2-2x+1=-3y
\quad\Longleftrightarrow\quad
(x-1)^2=-3y.
$$

Le sommet est $S(1;0)$. Dans le repère centré en $S$, $2a=-3$, donc

$$
F\left(1;-\frac34\right),
\qquad
(\mathcal D):y=\frac34.
$$

## Exercice 2 : ellipse et hyperbole

### 1. $\dfrac{x^2}{9}+\dfrac{y^2}{16}=1$

L’ellipse est verticale car $16>9$ :

$$
c=\sqrt{16-9}=\sqrt7,
\qquad
F(0;\sqrt7),\quad F'(0;-\sqrt7).
$$

### 2. $-\dfrac{(x-1)^2}{4}+\dfrac{(y+2)^2}{9}=1$

L’hyperbole a pour centre $\Omega(1;-2)$ et pour axe focal la verticale. Comme

$$
c=\sqrt{4+9}=\sqrt{13},
$$

ses foyers dans le repère initial sont

$$
F(1;-2+\sqrt{13}),
\qquad
F'(1;-2-\sqrt{13}).
$$

> **Corrections de source.** La page 10 utilise le vecteur $\overrightarrow{O\Omega}$ lors de la translation de la parabole, alors que le centre local est $S$ : il faut lire $\overrightarrow{OS}$. La page 11 remplace ensuite $\sqrt{13}$ par $\sqrt3$ dans les deux coordonnées finales des foyers de l’hyperbole ; $\sqrt{13}$ est la valeur correcte.`,
    keyPoint: "Une translation déplace le sommet ou le centre, mais ne change ni les demi-axes ni la valeur de $c$.",
    example: "$-(x-1)^2/4+(y+2)^2/9=1$ a pour foyers $(1;-2\\pm\\sqrt{13})$.",
    methodSteps: [
      "Complète les carrés avant de lire la conique.",
      "Identifie le sommet ou le centre translaté.",
      "Travaille d’abord dans le repère centré.",
      "Retraduis les coordonnées dans le repère d’origine.",
      "Contrôle la valeur de c avec une différence pour l’ellipse et une somme pour l’hyperbole.",
    ],
    timeline: [
      { label: "Réduire", detail: "Isoler ou compléter le carré." },
      { label: "Identifier", detail: "Parabole, ellipse ou hyperbole." },
      { label: "Calculer", detail: "Trouver le coefficient a ou la demi-distance c." },
      { label: "Retranslater", detail: "Ajouter les coordonnées du sommet ou du centre." },
    ],
    corrections: [
      "Dans l’exercice 1.2 page 10, la relation de changement de repère doit utiliser le sommet S, donc OM=OS+SM, et non le point Ω.",
      "Dans l’exercice 2.2 page 11, les foyers finaux sont F(1;−2+√13) et F′(1;−2−√13). Le PDF imprime √3 alors qu’il calcule correctement c=√13 juste au-dessus.",
    ],
    questions: [
      short("Dans $2y^2+3x=0$, quelle est la valeur du coefficient signé $a$ de $y^2=2ax$ ?", ["-3/4", "-0.75"], "$2a=-3/2$, donc $a=-3/4$.", "Exercice 1.1 • page 10", 2),
      choice("Quel est le foyer de cette première parabole ?", ["$(-3/8;0)$", "$(3/8;0)$", "$(-3/4;0)$", "$(0;-3/8)$"], 0, "Le foyer est $(a/2;0)$.", "Exercice 1.1 • page 10", 2),
      choice("Quelle est sa directrice ?", ["$x=3/8$", "$x=-3/8$", "$y=3/8$", "$x=3/4$"], 0, "La directrice vaut $x=-a/2$.", "Exercice 1.1 • page 10", 2),
      choice("Quelle forme réduite obtient-on dans l’exercice 1.2 ?", ["$(x-1)^2=-3y$", "$(x+1)^2=-3y$", "$(x-1)^2=3(y-1)$", "$x^2=-3(y+1)$"], 0, "On ajoute $1$ aux deux membres après avoir regroupé $x^2-2x$.", "Exercice 1.2 • page 10", 2),
      choice("Quel est son sommet ?", ["$(1;0)$", "$(-1;0)$", "$(0;1)$", "$(1;-1)$"], 0, "La forme est $(x-1)^2=-3(y-0)$.", "Exercice 1.2 • page 10"),
      choice("Quel est son foyer dans le repère initial ?", ["$(1;-3/4)$", "$(0;-3/4)$", "$(1;3/4)$", "$(-1;-3/4)$"], 0, "Le foyer est situé sous le sommet sur l’axe vertical.", "Exercice 1.2 • page 10", 2),
      choice("Quelle est la nature de $x^2/9+y^2/16=1$ ?", ["une ellipse", "une hyperbole", "une parabole", "un cercle"], 0, "Les deux termes sont positifs et additionnés.", "Exercice 2.1 • page 11"),
      choice("Quel est son axe focal ?", ["vertical", "horizontal", "la droite $y=x$", "aucun"], 0, "Le plus grand dénominateur $16$ est sous $y^2$.", "Exercice 2.1 • page 11"),
      choice("Quels sont ses foyers ?", ["$(0;\\pm\\sqrt7)$", "$(\\pm\\sqrt7;0)$", "$(0;\\pm4)$", "$(\\pm3;0)$"], 0, "$c=\\sqrt{16-9}=\\sqrt7$ sur l’axe vertical.", "Exercice 2.1 • page 11", 2),
      choice("Quel est le centre de $-(x-1)^2/4+(y+2)^2/9=1$ ?", ["$(1;-2)$", "$(-1;2)$", "$(1;2)$", "$(-1;-2)$"], 0, "Les formes sont $(x-1)^2$ et $(y-(-2))^2$.", "Exercice 2.2 • page 11"),
      short("Calcule $c^2$ pour cette hyperbole.", ["13", "+13"], "$c^2=4+9=13$.", "Exercice 2.2 • page 11", 2),
      choice("Quels foyers corrigent la coquille du PDF ?", ["$(1;-2\\pm\\sqrt{13})$", "$(1;-2\\pm\\sqrt3)$", "$(-1;2\\pm\\sqrt{13})$", "$(1;\\pm\\sqrt{13})$"], 0, "La translation ajoute le centre $(1;-2)$ aux coordonnées centrées $(0;\\pm\\sqrt{13})$.", "Exercice 2.2 corrigé • page 11", 3),
    ],
  },
  {
    id: "parabola-construction-reinforcement",
    title: "Construire une parabole à partir du foyer",
    summary: "Retrouver le sommet et l’équation d’une parabole à partir du foyer et de la directrice.",
    pages: "11-12",
    section: "D-2. Exercice de renforcement 3",
    durationMinutes: 40,
    kind: "practice",
    body: String.raw`## Méthode générale

Une parabole vérifie $e=1$. Si $K$ est le projeté orthogonal du foyer $F$ sur la directrice, alors :

1. le sommet $S$ est le milieu de $[FK]$ ;
2. la distance $KF$ est le paramètre positif $p$ ;
3. l’axe focal est la droite $(FK)$ ;
4. dans le repère centré en $S$, l’équation est $Y^2=2pX$ ou $X^2=2pY$ selon l’orientation.

## Cas 1 : $F(3;2)$ et $(\mathcal D):x=1$

$$
K(1;2),\qquad KF=2,\qquad S(2;2).
$$

L’axe focal est horizontal et orienté vers la droite :

$$
Y^2=4X.
$$

Dans le repère initial :

$$
(y-2)^2=4(x-2).
$$

## Cas 2 : $F(1;4)$ et $(\mathcal D):y=2$

$$
K(1;2),\qquad KF=2,\qquad S(1;3).
$$

L’axe focal est vertical et orienté vers le haut :

$$
X^2=4Y,
$$

d’où

$$
(x-1)^2=4(y-3).
$$

> **Astuce mémoire de Davy.** Le sommet est exactement à mi-chemin entre le foyer et la directrice, sur leur perpendiculaire commune.`,
    keyPoint: "Foyer et directrice donnent $K$, puis $S=\\operatorname{mil}(F,K)$ et une équation translatée de parabole.",
    example: "$F(3;2)$ et $x=1$ donnent $S(2;2)$ puis $(y-2)^2=4(x-2)$.",
    methodSteps: [
      "Projette le foyer F sur la directrice pour obtenir K.",
      "Calcule le milieu S de [FK].",
      "Repère l’orientation de l’axe focal.",
      "Écris l’équation réduite dans le repère centré en S.",
      "Remplace X et Y par x−xS et y−yS.",
    ],
    timeline: [
      { label: "Projeté K", detail: "Même ordonnée pour une directrice verticale, même abscisse pour une horizontale." },
      { label: "Sommet S", detail: "Milieu de F et K." },
      { label: "Paramètre", detail: "La distance KF donne le coefficient 2p." },
      { label: "Translation", detail: "Remplacer les coordonnées centrées par x−xS et y−yS." },
    ],
    questions: [
      choice("Pour $F(3;2)$ et $x=1$, quel est le projeté $K$ ?", ["$(1;2)$", "$(3;1)$", "$(1;0)$", "$(3;2)$"], 0, "La projection sur la verticale $x=1$ conserve l’ordonnée $2$.", "Exercice 3.1 • page 11"),
      choice("Quel est le sommet ?", ["$(2;2)$", "$(1;2)$", "$(3;2)$", "$(2;1)$"], 0, "C’est le milieu de $(3;2)$ et $(1;2)$.", "Exercice 3.1 • page 11", 2),
      choice("Quelle est l’équation obtenue ?", ["$(y-2)^2=4(x-2)$", "$(x-2)^2=4(y-2)$", "$(y+2)^2=4(x+2)$", "$(y-2)^2=-4(x-2)$"], 0, "La parabole est horizontale et s’ouvre vers le foyer situé à droite.", "Exercice 3.1 • pages 11-12", 3),
      choice("Pour $F(1;4)$ et $y=2$, quel est le projeté $K$ ?", ["$(1;2)$", "$(2;4)$", "$(1;4)$", "$(0;2)$"], 0, "La projection sur l’horizontale $y=2$ conserve l’abscisse $1$.", "Exercice 3.2 • page 12"),
      choice("Quel est le sommet du second cas ?", ["$(1;3)$", "$(1;2)$", "$(1;4)$", "$(3;1)$"], 0, "C’est le milieu de $(1;4)$ et $(1;2)$.", "Exercice 3.2 • page 12", 2),
      choice("Quelle est l’équation obtenue ?", ["$(x-1)^2=4(y-3)$", "$(y-3)^2=4(x-1)$", "$(x+1)^2=-4(y+3)$", "$(x-1)^2=-4(y-3)$"], 0, "La parabole est verticale et s’ouvre vers le haut.", "Exercice 3.2 • page 12", 3),
      short("Quelle est la distance $KF$ dans les deux cas ?", ["2", "+2"], "Les coordonnées du foyer et du projeté diffèrent de deux unités.", "Exercice 3 • pages 11-12"),
      choice("Pourquoi le coefficient devant la coordonnée non carrée vaut-il $4$ ?", ["Parce que $2p=2\\times2$", "Parce que le sommet vaut $2$", "Parce que $e=4$", "Parce que le foyer a deux coordonnées"], 0, "Le paramètre $p=KF=2$.", "Exercice 3 • pages 11-12", 2),
    ],
  },
  {
    id: "conic-from-focus-directrix-reinforcement",
    title: "Retrouver une conique depuis son foyer et sa directrice",
    summary: "Combiner barycentres, centre, demi-axes et translation dans l’exercice officiel 4.",
    pages: "12-13",
    section: "D-2. Exercice de renforcement 4",
    durationMinutes: 60,
    kind: "challenge",
    body: String.raw`## Cas 1 : ellipse

On donne

$$
F(1;0),\qquad (\mathcal D):x=10,\qquad e=\frac45.
$$

Le projeté est $K(10;0)$. Les sommets focaux sont

$$
A=\frac{F+eK}{1+e}=(5;0),
\qquad
A'=\frac{F-eK}{1-e}=(-35;0).
$$

Leur distance vaut

$$
AA'=40=2a,
$$

donc $a=20$ et le centre est $S(-15;0)$. Comme le foyer $F(1;0)$ est à $16$ unités du centre :

$$
c=16,\qquad b^2=a^2-c^2=400-256=144.
$$

L’équation correcte est

$$
\boxed{\frac{(x+15)^2}{400}+\frac{y^2}{144}=1.}
$$

> **Correction de source majeure.** La page 12 affirme $AA'=20$ alors que $5-(-35)=40$. Elle obtient donc à tort $a=10$, $c=8$, $b^2=36$ et les dénominateurs $100$ et $36$. Toutes ces valeurs doivent être doublées pour les longueurs et multipliées par $4$ pour leurs carrés.

## Cas 2 : hyperbole

On donne

$$
F(4;-1),\qquad (\mathcal D):y=0,\qquad e=3.
$$

Le projeté est $K(4;0)$. Les sommets focaux verticaux sont

$$
B\left(4;-\frac14\right),
\qquad
B'\left(4;\frac12\right).
$$

Le centre est

$$
S\left(4;\frac18\right),
$$

et

$$
b=\frac38,\qquad c=\frac98,\qquad a^2=c^2-b^2=\frac98.
$$

L’équation est

$$
\boxed{
-\frac{(x-4)^2}{9/8}
+\frac{(y-1/8)^2}{9/64}
=1.
}
$$

> **Astuce mémoire de Davy.** Les barycentres donnent d’abord les sommets. Le centre et les demi-axes viennent ensuite : ne saute pas directement à l’équation.`,
    keyPoint: "À partir de $F$, $(D)$ et $e$, calcule $K$, les deux sommets, leur milieu, puis $a$, $b$ et $c$.",
    example: "$F(1;0)$, $x=10$, $e=4/5$ donnent l’ellipse corrigée $(x+15)^2/400+y^2/144=1$.",
    methodSteps: [
      "Projette F sur la directrice pour obtenir K.",
      "Calcule les deux sommets avec les barycentres.",
      "Prends leur milieu pour obtenir le centre.",
      "Mesure le demi-grand axe et la demi-distance focale.",
      "Déduis le dernier demi-axe puis écris l’équation translatée.",
      "Vérifie que le foyer fourni est bien à distance c du centre.",
    ],
    timeline: [
      { label: "Barycentres", detail: "Déterminer les deux sommets focaux." },
      { label: "Centre", detail: "Prendre le milieu des sommets." },
      { label: "Demi-axes", detail: "Calculer a, b et c sans confondre distance et demi-distance." },
      { label: "Équation", detail: "Choisir le signe selon ellipse ou hyperbole et retranslater." },
    ],
    corrections: [
      "Dans l’exercice 4.1 page 12, A(5;0) et A′(−35;0) donnent AA′=40, et non 20. Les valeurs correctes sont a=20, c=16, b²=144 et l’équation (x+15)²/400+y²/144=1.",
    ],
    questions: [
      choice("Dans le premier cas, quelle est la nature de la conique ?", ["une ellipse", "une parabole", "une hyperbole", "un cercle"], 0, "$e=4/5<1$.", "Exercice 4.1 • page 12"),
      choice("Quels sont les sommets focaux calculés par barycentre ?", ["$(5;0)$ et $(-35;0)$", "$(5;0)$ et $(-15;0)$", "$(10;0)$ et $(1;0)$", "$(20;0)$ et $(-20;0)$"], 0, "Ce sont les valeurs correctement calculées dans le PDF.", "Exercice 4.1 • page 12", 2),
      short("Quelle est la distance correcte $AA'$ ?", ["40", "+40"], "$5-(-35)=40$.", "Exercice 4.1 corrigé • page 12", 3),
      short("Quelle est la valeur correcte du demi-grand axe $a$ ?", ["20", "+20"], "$2a=40$.", "Exercice 4.1 corrigé • page 12", 2),
      choice("Quel est le centre de l’ellipse ?", ["$(-15;0)$", "$(15;0)$", "$(-10;0)$", "$(0;0)$"], 0, "Le milieu de $5$ et $-35$ vaut $-15$.", "Exercice 4.1 • page 12", 2),
      short("Quelle est la demi-distance focale $c$ ?", ["16", "+16"], "Le foyer $(1;0)$ est à $16$ unités du centre $(-15;0)$.", "Exercice 4.1 corrigé • page 12", 2),
      short("Quelle est la valeur correcte de $b^2$ ?", ["144", "+144"], "$b^2=20^2-16^2=400-256=144$.", "Exercice 4.1 corrigé • page 12", 3),
      choice("Quelle équation corrige la solution du PDF ?", ["$(x+15)^2/400+y^2/144=1$", "$(x+15)^2/100+y^2/36=1$", "$(x-15)^2/400-y^2/144=1$", "$(x+15)^2/20+y^2/12=1$"], 0, "Les dénominateurs sont les carrés des demi-axes corrects $20$ et $12$.", "Exercice 4.1 corrigé • page 12", 4),
      choice("Dans le second cas, quelle est la nature de la conique ?", ["une hyperbole", "une ellipse", "une parabole", "un cercle"], 0, "$e=3>1$.", "Exercice 4.2 • pages 12-13"),
      choice("Quel est son centre ?", ["$(4;1/8)$", "$(4;-1/8)$", "$(1/8;4)$", "$(4;0)$"], 0, "C’est le milieu des sommets d’ordonnées $-1/4$ et $1/2$.", "Exercice 4.2 • page 13", 2),
      choice("Quelle est l’équation finale de l’hyperbole ?", ["$-(x-4)^2/(9/8)+(y-1/8)^2/(9/64)=1$", "$(x-4)^2/(9/8)+(y-1/8)^2/(9/64)=1$", "$(x+4)^2/(9/8)-(y+1/8)^2/(9/64)=1$", "$-(x-4)^2/(9/64)+(y-1/8)^2/(9/8)=1$"], 0, "L’axe focal est vertical : le terme positif porte $(y-1/8)^2$.", "Exercice 4.2 • page 13", 4),
    ],
  },
  {
    id: "complex-hyperbola-mission",
    title: "Mission finale : nombres complexes et hyperbole",
    summary: "Relier un critère d’alignement complexe à l’équation d’une hyperbole et à l’axe réel.",
    pages: "13-14",
    section: "D-3. Exercice d’approfondissement 5",
    durationMinutes: 66,
    kind: "challenge",
    body: String.raw`## 1. Étudier la conique

On considère

$$
3x^2-y^2+2x+1=0.
$$

Complétons le carré :

$$
\begin{aligned}
3x^2+2x-y^2+1&=0\\
3\left(x+\frac13\right)^2-y^2+\frac23&=0.
\end{aligned}
$$

Ainsi

$$
-\frac{(x+1/3)^2}{2/9}
+\frac{y^2}{2/3}
=1.
$$

C’est une hyperbole de centre $\Omega(-1/3;0)$ et d’axe focal vertical.

$$
a^2=\frac29,\qquad
b^2=\frac23,\qquad
c^2=\frac89,\qquad
e=\frac{2\sqrt3}{3}.
$$

Dans le repère initial :

$$
\begin{aligned}
B&\left(-\frac13;\sqrt{\frac23}\right),
&B'&\left(-\frac13;-\sqrt{\frac23}\right),\\
F&\left(-\frac13;\frac{\sqrt8}{3}\right),
&F'&\left(-\frac13;-\frac{\sqrt8}{3}\right).
\end{aligned}
$$

Les directrices et asymptotes sont

$$
y=\pm\frac{\sqrt2}{2},
\qquad
y=\pm\sqrt3\left(x+\frac13\right).
$$

## 2. Traduire l’alignement complexe

Les points $A$, $M$ et $M'$ ont pour affixes $1$, $z$ et $z^4$.

Pour $z\ne1$, ils sont alignés si et seulement si

$$
\frac{z^4-1}{z-1}
=1+z+z^2+z^3
$$

est réel. Le cas $z=1$ vérifie aussi directement l’alignement et la somme vaut $4$, donc l’équivalence reste vraie sur l’ensemble des points.

Posons $z=x+iy$. Un développement correct donne

$$
\begin{aligned}
1+z+z^2+z^3
=&\left(1+x+x^2-y^2+x^3-3xy^2\right)\\
&+y\left(3x^2-y^2+2x+1\right)i.
\end{aligned}
$$

Cette expression est réelle si et seulement si

$$
y\left(3x^2-y^2+2x+1\right)=0.
$$

Donc

$$
y=0
\qquad\text{ou}\qquad
3x^2-y^2+2x+1=0.
$$

Le lieu cherché est la réunion de l’axe réel et de l’hyperbole étudiée.

> **Corrections de source.** La page 14 imprime $-y$ au lieu de $-y^2$ dans la partie réelle. Cette coquille ne change pas la partie imaginaire ni le lieu final. La division par $z-1$ exige aussi de traiter séparément $z=1$, qui appartient bien au lieu.

> **Astuce mémoire de Davy.** Un complexe est réel exactement quand sa partie imaginaire est nulle : toute la géométrie du lieu vient ici d’une factorisation.`,
    keyPoint: "$A,M,M'$ alignés $\\Longleftrightarrow y(3x^2-y^2+2x+1)=0$ : axe réel $\\cup$ hyperbole.",
    example: "Le lieu est $(O,\\vec e_1)\\cup\\mathcal H$, avec $\\mathcal H:3x^2-y^2+2x+1=0$.",
    methodSteps: [
      "Réduis d’abord l’équation réelle de la conique.",
      "Lis son centre, son axe focal et ses demi-axes.",
      "Traduis l’alignement par un quotient réel, en isolant le cas où le dénominateur s’annule.",
      "Développe l’expression complexe en partie réelle et partie imaginaire.",
      "Annule puis factorise la partie imaginaire.",
      "Interprète chaque facteur nul comme un lieu géométrique.",
    ],
    timeline: [
      { label: "Réduire l’hyperbole", detail: "Compléter le carré en x." },
      { label: "Critère complexe", detail: "Transformer l’alignement en condition de réalité." },
      { label: "Partie imaginaire", detail: "Faire apparaître y(3x²−y²+2x+1)." },
      { label: "Réunion des lieux", detail: "Associer y=0 à l’axe réel et l’autre facteur à l’hyperbole." },
    ],
    corrections: [
      "Dans le développement de la page 14, la partie réelle doit contenir x²−y² et non x²−y. La partie réelle correcte est 1+x+x²−y²+x³−3xy².",
      "La preuve divise par z−1 sans isoler z=1. Ce cas doit être vérifié directement : A=M=M′ et 1+z+z²+z³=4, donc il appartient bien au lieu.",
    ],
    questions: [
      choice("Quelle est la forme réduite de l’hyperbole ?", ["$-(x+1/3)^2/(2/9)+y^2/(2/3)=1$", "$(x+1/3)^2/(2/9)+y^2/(2/3)=1$", "$(x-1/3)^2/(2/3)-y^2/(2/9)=1$", "$-(x+1)^2/2+y^2/3=1$"], 0, "La complétion du carré donne $3(x+1/3)^2-y^2+2/3=0$.", "Exercice 5.1 • page 13", 3),
      choice("Quel est le centre ?", ["$(-1/3;0)$", "$(1/3;0)$", "$(0;-1/3)$", "$(0;0)$"], 0, "Il se lit dans $(x+1/3)^2$.", "Exercice 5.1 • page 13"),
      short("Quelle est la valeur de $c^2$ ?", ["8/9"], "$c^2=2/9+2/3=8/9$.", "Exercice 5.1 • page 13", 2),
      choice("Quelles sont les asymptotes dans le repère initial ?", ["$y=\\pm\\sqrt3(x+1/3)$", "$y=\\pm(x-1/3)/\\sqrt3$", "$x=\\pm\\sqrt3y$", "$y=\\pm\\sqrt3x$"], 0, "Il faut translater les asymptotes centrées $Y=\\pm\\sqrt3X$.", "Exercice 5.1 • page 14", 3),
      choice("Pour $z\\ne1$, à quelle expression est égal $(z^4-1)/(z-1)$ ?", ["$1+z+z^2+z^3$", "$z^3$", "$1-z+z^2-z^3$", "$z^4+1$"], 0, "C’est la somme géométrique associée à $z^4-1$.", "Exercice 5.2a • page 14"),
      choice("Quel cas doit être vérifié séparément avant cette division ?", ["$z=1$", "$z=0$", "$z=i$", "$z=-1$"], 0, "Le dénominateur $z-1$ s’annule en $1$.", "Correction pédagogique • page 14", 2),
      choice("Quelle est la partie imaginaire de $1+z+z^2+z^3$ ?", ["$y(3x^2-y^2+2x+1)$", "$x(3y^2-x^2+1)$", "$3x^2-y^2+2x+1$", "$y(x^2+y^2)$"], 0, "Le développement puis la factorisation par $y$ donnent cette expression.", "Exercice 5.2b • page 14", 3),
      choice("Quelle coquille apparaît dans la partie réelle imprimée ?", ["$-y$ au lieu de $-y^2$", "$x^3$ au lieu de $x^2$", "$+y^2$ au lieu de $-y^2$", "$3xy$ au lieu de $3xy^2$"], 0, "$(x+iy)^2$ a pour partie réelle $x^2-y^2$.", "Correction de source • page 14", 2),
      choice("L’expression complexe est réelle lorsque :", ["sa partie imaginaire est nulle", "sa partie réelle est nulle", "son module vaut $1$", "son argument vaut toujours $\\pi/2$"], 0, "C’est le critère fondamental utilisé dans la solution.", "Exercice 5.2b • page 14"),
      choice("Quel est le lieu final des points $M$ ?", ["l’axe réel réuni à l’hyperbole", "l’hyperbole seulement", "l’axe imaginaire", "une ellipse"], 0, "La factorisation donne $y=0$ ou l’équation de l’hyperbole.", "Exercice 5.2b • page 14", 3),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCConicsPath: LearningPath = {
  id: "terminale-c-math-l07-conics",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Géométrie du plan" },
  chapterNumber: 7,
  title: "Coniques",
  description: "Foyer, directrice, excentricité, équations réduites, éléments caractéristiques et problèmes officiels sur les paraboles, ellipses et hyperboles.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Caractériser une conique par un foyer, une directrice et une excentricité",
    "Déterminer l’axe focal, les sommets et le régionnement du plan",
    "Lire tous les éléments d’une parabole, d’une ellipse ou d’une hyperbole",
    "Construire une équation réduite à partir de données géométriques",
    "Résoudre les exercices officiels, la piscine elliptique et le lieu complexe",
  ],
  modules: [
    {
      id: "terminale-c-math-l07-conics-mastery",
      title: "Maîtriser les coniques",
      description: "De la définition foyer-directrice aux constructions, corrections de source et lieux complexes.",
      lessons: builtLevels,
    },
  ],
};
