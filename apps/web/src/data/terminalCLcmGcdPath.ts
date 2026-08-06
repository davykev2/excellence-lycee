import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 11 PPCM et PGCD de deux entiers relatifs.pdf";

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
      title: "Construis le raisonnement",
      instruction: "Sélectionne chaque étape pour retrouver la logique de la méthode.",
      observation: "En arithmétique, une condition de divisibilité bien vérifiée évite souvent de longs calculs.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Suis les étapes dans l’ordre, justifie chaque divisibilité et vérifie le résultat obtenu.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : commence toujours par identifier ce qui doit diviser quoi.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const questionsByLevel = {
  "common-multiples-lcm": [
    choice(
      String.raw`Détermine l’intersection $4\mathbb Z\cap6\mathbb Z$.`,
      [String.raw`$2\mathbb Z$`, String.raw`$10\mathbb Z$`, String.raw`$12\mathbb Z$`, String.raw`$24\mathbb Z$`],
      2,
      String.raw`Les multiples communs à $4$ et $6$ sont exactement les multiples de leur PPCM. Or $\operatorname{PPCM}(4,6)=12$, donc $4\mathbb Z\cap6\mathbb Z=12\mathbb Z$.`,
      "Fixation 1 • page 2",
    ),
    short(
      String.raw`Calcule $\operatorname{PPCM}(40,60)$.`,
      ["120"],
      String.raw`$40=2^3\times5$ et $60=2^2\times3\times5$. On retient les exposants maximaux : $2^3\times3\times5=120$.`,
      "Exemple du cours • page 2",
    ),
    short(
      String.raw`Détermine $\operatorname{PPCM}(-3,8)$.`,
      ["24"],
      String.raw`Le signe ne change pas le PPCM : $\operatorname{PPCM}(-3,8)=\operatorname{PPCM}(3,8)$. Comme $3$ et $8$ sont premiers entre eux, le résultat vaut $3\times8=24$.`,
      "Exercice 1 • page 11",
    ),
    short(
      String.raw`Détermine $\operatorname{PPCM}(48,12)$.`,
      ["48"],
      String.raw`Comme $12\mid48$, tout multiple de $48$ est aussi multiple de $12$ et le plus petit multiple commun positif est $48$.`,
      "Exercice 1 • page 11",
    ),
    short(
      String.raw`Détermine $\operatorname{PPCM}(160,200)$.`,
      ["800"],
      String.raw`$160=2^5\times5$ et $200=2^3\times5^2$. Le PPCM retient $2^5$ et $5^2$ : $32\times25=800$. La valeur $40$ imprimée dans le corrigé source est le PGCD, pas le PPCM.`,
      "Exercice 1 • page 11",
      2,
    ),
  ],
  "common-divisors-gcd": [
    short(
      String.raw`Calcule $\operatorname{PGCD}(18,15)$.`,
      ["3"],
      String.raw`Les diviseurs positifs communs à $18$ et $15$ sont $1$ et $3$ ; le plus grand est $3$.`,
      "Exemple du cours • page 3",
    ),
    choice(
      String.raw`Complète correctement l’ensemble des diviseurs communs de $18$ et $15$.`,
      [String.raw`$D(18,15)=D(1)$`, String.raw`$D(18,15)=D(3)$`, String.raw`$D(18,15)=D(5)$`, String.raw`$D(18,15)=D(45)$`],
      1,
      String.raw`Les diviseurs communs de deux entiers sont exactement les diviseurs de leur PGCD. Ici $\operatorname{PGCD}(18,15)=3$, donc $D(18,15)=D(3)$.`,
      "Fixation 2 • page 3",
    ),
    short(
      String.raw`Calcule $\operatorname{PGCD}(36,30)$.`,
      ["6"],
      String.raw`$36=2^2\times3^2$ et $30=2\times3\times5$. Les facteurs communs avec les exposants minimaux donnent $2\times3=6$.`,
      "Exemple du cours • page 3",
    ),
    short(
      String.raw`Détermine $\operatorname{PGCD}(-75,-25)$.`,
      ["25"],
      String.raw`Le PGCD est positif et ne dépend pas des signes : $\operatorname{PGCD}(-75,-25)=\operatorname{PGCD}(75,25)=25$.`,
      "Exercice 2 • page 11",
    ),
    short(
      String.raw`Détermine $\operatorname{PGCD}(24,24)$.`,
      ["24"],
      String.raw`Pour tout entier non nul $a$, $\operatorname{PGCD}(a,a)=|a|$. Le résultat est donc $24$.`,
      "Exercice 2 • page 11",
    ),
    short(
      String.raw`Détermine $\operatorname{PGCD}(132,-96)$.`,
      ["12"],
      String.raw`On travaille avec $132$ et $96$. Les divisions $132=96+36$, $96=2\times36+24$ et $36=24+12$ donnent le dernier reste non nul $12$.`,
      "Exercice 2 • page 11",
      2,
    ),
    choice(
      String.raw`Résous dans $\mathbb N^2$ le système $\operatorname{PGCD}(x,y)=354$ et $x+y=5664$. Quelle liste est complète ?`,
      [
        String.raw`$(354;5310),(1062;4602),(1770;3894),(2478;3186),(3186;2478),(3894;1770),(4602;1062),(5310;354)$`,
        String.raw`$(354;5310),(1062;4602),(1770;3894),(2478;3186),(3186;2478),(5310;354)$`,
        String.raw`$(354;5310)$ seulement`,
        String.raw`Aucun couple`,
      ],
      0,
      String.raw`Écris $x=354x'$ et $y=354y'$ avec $\operatorname{PGCD}(x',y')=1$. La somme donne $x'+y'=16$, donc $\operatorname{PGCD}(x',y')=\operatorname{PGCD}(x',16)$. Il faut choisir $x'$ premier avec $16$, soit $x'\in\{1,3,5,7,9,11,13,15\}$, puis poser $y'=16-x'$. On obtient les huit couples affichés.`,
      "Exercice 4 • pages 11-12",
      3,
    ),
    choice(
      String.raw`Résous dans $\mathbb N^2$ le système $\operatorname{PGCD}(x,y)=28$ et $xy=8624$.`,
      [String.raw`$(28;308)$ et $(308;28)$`, String.raw`$(56;280)$ et $(280;56)$`, String.raw`$(28;308)$ seulement`, String.raw`$(140;196)$ et $(196;140)$`],
      0,
      String.raw`Pose $x=28x'$ et $y=28y'$ avec $\operatorname{PGCD}(x',y')=1$. Alors $784x'y'=8624$, donc $x'y'=11$. Comme $11$ est premier, $(x',y')=(1,11)$ ou $(11,1)$, d’où $(x,y)=(28,308)$ ou $(308,28)$.`,
      "Exercice 5 • page 12",
      2,
    ),
  ],
  "euclidean-algorithm": [
    short(
      String.raw`Utilise l’algorithme d’Euclide pour calculer $\operatorname{PGCD}(2016,1188)$.`,
      ["36"],
      String.raw`$2016=1188+828$, $1188=828+360$, $828=2\times360+108$, $360=3\times108+36$ et $108=3\times36$. Le dernier reste non nul est $36$.`,
      "Exemple du cours • page 4",
      2,
    ),
    short(
      String.raw`Dans l’équation $13x+47y=1$, vérifie que $(x_0,y_0)=(-18,5)$ est une solution particulière. Saisis le couple.`,
      ["(-18;5)", "-18;5", "(-18,5)", "x=-18;y=5", "x0=-18;y0=5"],
      String.raw`$13(-18)+47(5)=-234+235=1$. Le couple $(-18,5)$ est donc bien une solution particulière.`,
      "Exercice 8 • page 14",
      2,
    ),
  ],
  "bezout-identity": [
    short(
      String.raw`Trouve un couple $(u,v)$ tel que $144=18u+15v$.`,
      ["(3;6)", "3;6", "(3,6)", "u=3;v=6"],
      String.raw`$18\times3+15\times6=54+90=144$. Ainsi $(u,v)=(3,6)$ convient. Cette combinaison est distincte de la remarque du cours où la coquille $144=3\times18$ doit être corrigée en $144=3\times48$.`,
      "Fixation 3 • page 4",
      2,
    ),
    short(
      String.raw`Donne un couple de coefficients de Bézout $(u,v)$ vérifiant $2016u+1188v=36$.`,
      ["(-10;17)", "-10;17", "(-10,17)", "(23;-39)", "23;-39", "u=-10;v=17", "u=23;v=-39"],
      String.raw`La remontée de l’algorithme d’Euclide donne $36=-10\times2016+17\times1188$. Le couple $(-10,17)$ convient ; $(23,-39)$ est une autre solution.`,
      "Exemple du cours • page 5",
      3,
    ),
    choice(
      String.raw`Quelle égalité prouve immédiatement que $25$ et $7$ sont premiers entre eux ?`,
      [String.raw`$25=3\times7+4$`, String.raw`$25\times2+7\times(-7)=1$`, String.raw`$25+7=32$`, String.raw`$25\times7=175$`],
      1,
      String.raw`Le théorème de Bézout affirme que deux entiers sont premiers entre eux si et seulement si une combinaison entière de ces deux nombres vaut $1$. Or $50-49=1$.`,
      "Exemple du cours • page 6",
      2,
    ),
  ],
  "gauss-theorem": [
    choice(
      String.raw`Résous dans $\mathbb Z\times\mathbb Z$ l’équation $2x-5y=0$.`,
      [String.raw`$(x,y)=(2k,5k)$`, String.raw`$(x,y)=(5k,2k)$`, String.raw`$(x,y)=(5k,-2k)$`, String.raw`Une seule solution : $(0,0)$`],
      1,
      String.raw`$2x=5y$. Comme $2$ et $5$ sont premiers entre eux, Gauss donne $2\mid y$ : $y=2k$. Alors $x=5k$. Ainsi $S=\{(5k,2k),\ k\in\mathbb Z\}$.`,
      "Fixation 4 • page 6",
      2,
    ),
    choice(
      String.raw`Résous la congruence $25a\equiv100\pmod 7$.`,
      [String.raw`$a\equiv0\pmod7$`, String.raw`$a\equiv2\pmod7$`, String.raw`$a\equiv4\pmod7$`, String.raw`$a\equiv6\pmod7$`],
      2,
      String.raw`Comme $25\equiv4$ et $100\equiv2\pmod7$, on a $4a\equiv2$. L’inverse de $4$ modulo $7$ est $2$, donc $a\equiv4\pmod7$.`,
      "Conséquence de Gauss • page 7",
      2,
    ),
    choice(
      String.raw`Résous dans $\mathbb Z\times\mathbb Z$ l’équation $2x-5y=0$.`,
      [String.raw`$\{(5k,2k),\ k\in\mathbb Z\}$`, String.raw`$\{(2k,5k),\ k\in\mathbb Z\}$`, String.raw`$\{(5k,-2k),\ k\in\mathbb Z\}$`, String.raw`$\varnothing$`],
      0,
      String.raw`Le raisonnement de Gauss conduit à $y=2k$ puis $x=5k$. Toutes les solutions, et seulement elles, sont $(5k,2k)$.`,
      "Exercice 6 • page 12",
      2,
    ),
  ],
  "gcd-lcm-relation": [
    short(
      String.raw`Calcule $\operatorname{PPCM}(4,3)$.`,
      ["12"],
      String.raw`Comme $\operatorname{PGCD}(4,3)=1$, la relation fondamentale donne $\operatorname{PPCM}(4,3)=4\times3=12$.`,
      "Conséquence du cours • page 7",
    ),
    short(
      String.raw`Sachant que $\operatorname{PGCD}(18,15)=3$, calcule $\operatorname{PPCM}(18,15)$.`,
      ["90"],
      String.raw`$\operatorname{PGCD}(18,15)\times\operatorname{PPCM}(18,15)=18\times15$. Donc le PPCM vaut $270/3=90$.`,
      "Fixation 5 • page 7",
      2,
    ),
  ],
  "diophantine-solvability": [
    choice(
      String.raw`L’équation $(E):4x-6y=1$ admet-elle des solutions entières ?`,
      ["Oui, une seule", "Oui, une infinité", String.raw`Non, car $\operatorname{PGCD}(4,6)\nmid1$`, "Non, car 4 et 6 sont pairs"],
      2,
      String.raw`Une équation $ax+by=c$ est soluble dans $\mathbb Z^2$ si et seulement si $\operatorname{PGCD}(a,b)$ divise $c$. Ici le PGCD vaut $2$ et $2\nmid1$ : aucune solution.`,
      "Fixation 6 • page 7",
      2,
    ),
    choice(
      String.raw`L’équation $(F):3x-5y=-2$ admet-elle des solutions entières ?`,
      [String.raw`Oui, par exemple $(1,1)$`, String.raw`Oui, seulement $(1,1)$`, String.raw`Non, car $-2<0$`, String.raw`Non, car $3<5$`],
      0,
      String.raw`$\operatorname{PGCD}(3,5)=1$ divise $-2$. De plus $3\times1-5\times1=-2$, donc $(1,1)$ est une solution particulière et il existe une infinité de solutions.`,
      "Fixation 6 • page 7",
      2,
    ),
    choice(
      String.raw`L’équation $(E):4x-6y=1$ admet-elle une solution dans $\mathbb Z^2$ ?`,
      ["Oui", String.raw`Non, parce que $2\nmid1$`, String.raw`Non, parce que $6\nmid4$`, "On ne peut pas décider"],
      1,
      String.raw`Le PGCD de $4$ et $6$ est $2$. Comme $2$ ne divise pas $1$, le critère de solvabilité exclut toute solution entière.`,
      "Exercice 7 • page 13",
      2,
    ),
    choice(
      String.raw`Pourquoi existe-t-il des entiers $x$ et $y$ tels que $13x+47y=1$ ?`,
      [String.raw`Parce que $13+47=60$`, String.raw`Parce que $\operatorname{PGCD}(13,47)=1$`, String.raw`Parce que $47>13$`, String.raw`Parce que $13\mid47$`],
      1,
      String.raw`L’algorithme d’Euclide donne $\operatorname{PGCD}(13,47)=1$. Le théorème de Bézout garantit donc une combinaison entière de $13$ et $47$ égale à $1$.`,
      "Exercice 8 • page 14",
      2,
    ),
  ],
  "diophantine-congruences": [
    short(
      String.raw`Résous dans $\mathbb Z^2$ l’équation $3x-5y=-2$. Donne la solution générale avec $k\in\mathbb Z$.`,
      ["x=1+5k;y=1+3k", "(1+5k;1+3k)", "(1+5k,1+3k)"],
      String.raw`À partir de $(1,1)$, deux solutions diffèrent de $(5k,3k)$. Ainsi $S=\{(1+5k,1+3k),\ k\in\mathbb Z\}$.`,
      "Cours • page 8",
      3,
    ),
    short(
      String.raw`Résous $2x\equiv3\pmod5$.`,
      ["x=4+5k", "4+5k", "x≡4[5]", "x=4[5]", "4"],
      String.raw`L’inverse de $2$ modulo $5$ est $3$. En multipliant par $3$, $x\equiv9\equiv4\pmod5$, soit $x=4+5k$.`,
      "Exemple du cours • page 8",
      2,
    ),
    choice(
      String.raw`La congruence $8x\equiv1\pmod4$ admet-elle une solution ?`,
      [String.raw`Oui, $x\equiv0\pmod4$`, String.raw`Oui, $x\equiv1\pmod4$`, String.raw`Oui, toutes les classes`, String.raw`Non, car $\operatorname{PGCD}(8,4)=4\nmid1$`],
      3,
      String.raw`Une congruence $ax\equiv b\pmod n$ est soluble si et seulement si $\operatorname{PGCD}(a,n)$ divise $b$. Ici $4$ ne divise pas $1$.`,
      "Exemple du cours • page 8",
      2,
    ),
    short(
      String.raw`Avec $A=0,B=1,\ldots,Z=25$ et le chiffrement $f(x)\equiv29x+13\pmod{26}$, décode le mot NWXLP.`,
      ["ADMIS"],
      String.raw`Comme $29\equiv3\pmod{26}$ et $3^{-1}\equiv9\pmod{26}$, la fonction de décodage est $g(y)\equiv9(y-13)\equiv9y+13\pmod{26}$. Elle transforme NWXLP en ADMIS.`,
      "Situation d’évaluation • pages 9-10",
      3,
    ),
    short(
      String.raw`Résous à nouveau $3x-5y=-2$ et donne l’ensemble des solutions.`,
      ["x=1+5k;y=1+3k", "(1+5k;1+3k)", "(1+5k,1+3k)"],
      String.raw`La solution particulière $(1,1)$ conduit à $x=1+5k$ et $y=1+3k$, pour tout $k\in\mathbb Z$.`,
      "Exercice 7 • page 13",
      3,
    ),
    choice(
      String.raw`Dans la résolution de $13x+47y=1$, pourquoi obtient-on $8y\equiv1\pmod{13}$ ?`,
      [String.raw`Parce que $47\equiv8\pmod{13}$ et $13x\equiv0\pmod{13}$`, String.raw`Parce que $47\equiv1\pmod{13}$`, String.raw`Parce que $13\equiv8\pmod{47}$`, String.raw`Parce que $8$ divise $13$`],
      0,
      String.raw`En réduisant $13x+47y=1$ modulo $13$, le terme $13x$ disparaît et $47$ est congru à $8$. Il reste donc $8y\equiv1\pmod{13}$.`,
      "Exercice 8 • page 14",
      2,
    ),
    short(
      String.raw`Résous $8y\equiv1\pmod{13}$.`,
      ["y=5+13k", "y=13k+5", "5+13k", "13k+5", "y≡5[13]", "5"],
      String.raw`L’inverse de $8$ modulo $13$ est $5$, car $8\times5=40\equiv1\pmod{13}$. Ainsi $y\equiv5\pmod{13}$, soit $y=5+13k$.`,
      "Exercice 8 • page 14",
      2,
    ),
    short(
      String.raw`Donne la solution générale de $13x+47y=1$ à partir de $(-18,5)$.`,
      ["x=47k-18;y=-13k+5", "x=-18+47k;y=5-13k", "(47k-18;-13k+5)", "(-18+47k;5-13k)"],
      String.raw`Pour $13x+47y=1$, toutes les solutions sont $x=x_0+47k$ et $y=y_0-13k$. Avec $(-18,5)$ : $(x,y)=(47k-18,-13k+5)$.`,
      "Exercice 8 • page 15",
      3,
    ),
    short(
      String.raw`Pendant son séjour, M. Chaukaud paie $13\,000$ F par nuit en chambre A et $47\,000$ F par nuit en chambre B, pour un total de $524\,000$ F. Donne le nombre de nuitées $(x,y)$ dans les chambres A et B.`,
      ["(15;7)", "15;7", "(15,7)", "x=15;y=7", "15,7"],
      String.raw`En milliers de francs, il faut résoudre $13x+47y=524$ dans $\mathbb N^2$. Comme $13(-18)+47(5)=1$, une solution particulière est $(-9432,2620)$. Les solutions entières sont $x=47k-9432$ et $y=-13k+2620$. Les contraintes $x\geq0$ et $y\geq0$ imposent $200{,}68\ldots\leq k\leq201{,}53\ldots$ ; donc $k=201$, puis $(x,y)=(15,7)$.`,
      "Problème de synthèse • pages 15-16",
      3,
    ),
  ],
} satisfies Record<string, LessonQuestion[]>;

const levels: OfficialLevelSeed[] = [
  {
    id: "common-multiples-lcm",
    title: "Multiples communs et PPCM",
    summary: String.raw`Définir le PPCM, caractériser tous les multiples communs et le calculer sans confondre exposants minimaux et maximaux.`,
    pages: "1-2 et 11",
    section: "I. Plus petit commun multiple • Exercices 1",
    durationMinutes: 50,
    body: String.raw`## Partir des ensembles de multiples

Pour un entier relatif $a$, l’ensemble de ses multiples est

$$
a\mathbb Z=\{ak\mid k\in\mathbb Z\}.
$$

Si $a$ et $b$ sont deux entiers relatifs **non nuls**, leurs multiples communs appartiennent à l’intersection $a\mathbb Z\cap b\mathbb Z$. Le plus petit élément strictement positif de cette intersection est le **plus petit commun multiple** de $a$ et $b$, noté $\operatorname{PPCM}(a,b)$.

### Exemple fondamental

Les multiples positifs de $4$ commencent par $4,8,12,16,20,24,\ldots$ ; ceux de $6$ par $6,12,18,24,\ldots$. Le premier rendez-vous commun est $12$ :

$$
\operatorname{PPCM}(4,6)=12
\quad\text{et}\quad
4\mathbb Z\cap6\mathbb Z=12\mathbb Z.
$$

> **Image mentale de Davy.** Deux bus passent à des rythmes différents. Le PPCM est le premier instant positif où ils reviennent ensemble.

## Propriétés à connaître

En posant $\mu=\operatorname{PPCM}(a,b)$ :

| Propriété | Écriture |
|---|---|
| Les signes ne comptent pas | $\operatorname{PPCM}(a,b)=\operatorname{PPCM}(\lvert a\rvert,\lvert b\rvert)$ |
| Symétrie | $\operatorname{PPCM}(a,b)=\operatorname{PPCM}(b,a)$ |
| Tous les multiples communs | $a\mathbb Z\cap b\mathbb Z=\mu\mathbb Z$ |
| Cas d’une divisibilité | $a\mid b\Longrightarrow\operatorname{PPCM}(a,b)=\lvert b\rvert$ |
| Homogénéité | $\operatorname{PPCM}(ka,kb)=\lvert k\rvert\operatorname{PPCM}(a,b)$ |

Comme $\mu$ est lui-même un multiple positif de $|a|$ et de $|b|$, et que $|ab|$ est aussi un multiple commun :

$$
\max(|a|,|b|)\leq\mu\leq|ab|.
$$

## Trois méthodes de calcul

### 1. Énumérer les multiples

Cette méthode est efficace pour de petits nombres : on écrit les premiers multiples jusqu’au premier commun.

### 2. Décomposer en facteurs premiers

Si

$$
a=\prod p^{\alpha_p}
\quad\text{et}\quad
b=\prod p^{\beta_p},
$$

alors le PPCM retient, pour chaque nombre premier, **le plus grand exposant** :

$$
\operatorname{PPCM}(a,b)=\prod p^{\max(\alpha_p,\beta_p)}.
$$

Par exemple :

$$
40=2^3\times5,\qquad60=2^2\times3\times5,
$$

donc

$$
\operatorname{PPCM}(40,60)=2^3\times3\times5=120.
$$

### 3. Extraire un facteur commun

Si $a=ka'$ et $b=kb'$, alors

$$
\operatorname{PPCM}(a,b)=|k|\operatorname{PPCM}(a',b').
$$

> **Piège classique.** Les exposants **maximaux** donnent le PPCM. Les exposants minimaux donneront le PGCD au niveau suivant.

## Contrôle rapide du résultat

Un PPCM annoncé doit être divisible par chacun des deux nombres. Ainsi $40$ ne peut pas être le PPCM de $160$ et $200$, puisqu’il n’est multiple d’aucun des deux. Le bon résultat est $800$.`,
    keyPoint: String.raw`$a\mathbb Z\cap b\mathbb Z=\operatorname{PPCM}(a,b)\mathbb Z$ et, par facteurs premiers, on retient les exposants maximaux.`,
    example: String.raw`$160=2^5\times5$ et $200=2^3\times5^2$, donc $\operatorname{PPCM}(160,200)=2^5\times5^2=800$.`,
    methodSteps: [
      "Remplace d’abord les entiers par leurs valeurs absolues.",
      "Choisis l’énumération, la décomposition première ou l’extraction d’un facteur commun.",
      "Avec les facteurs premiers, conserve chaque facteur avec son exposant maximal.",
      "Vérifie que le résultat est positif et divisible par chacun des deux entiers.",
    ],
    timeline: [
      { label: "Multiples", detail: "Repère les nombres présents dans les deux ensembles de multiples." },
      { label: "Premier positif", detail: "Choisis le plus petit multiple commun strictement positif." },
      { label: "Tous les autres", detail: "Ils sont exactement les multiples du PPCM." },
      { label: "Contrôle", detail: "Le résultat doit être divisible par les deux nombres de départ." },
    ],
    questions: questionsByLevel["common-multiples-lcm"],
    corrections: [
      "La définition est précisée pour deux entiers non nuls afin que le plus petit multiple commun strictement positif existe dans le cadre du cours.",
      "Page 2 : la lettre isolée M est explicitée comme le PPCM dans la propriété sur les multiples communs.",
      "Page 11 : le corrigé imprimé donne 40 pour PPCM(160,200). Cette valeur est leur PGCD ; le PPCM correct est 800.",
    ],
    tip: "Astuce mémoire de Davy : PPCM = premier rendez-vous commun ; dans les facteurs premiers, prends les plus grands exposants.",
  },
  {
    id: "common-divisors-gcd",
    title: "Diviseurs communs et PGCD",
    summary: String.raw`Définir le PGCD, décrire tous les diviseurs communs et réduire deux entiers à une paire première entre elle.`,
    pages: "2-3 et 11-12",
    section: "II-1. Plus grand commun diviseur • Exercices 2 à 5",
    durationMinutes: 55,
    body: String.raw`## Le plus grand partage exact

Pour un entier non nul $a$, notons $D(a)$ l’ensemble de ses diviseurs positifs. Le **plus grand commun diviseur** de deux entiers relatifs non nuls $a$ et $b$ est le plus grand élément de $D(a)\cap D(b)$. On le note $\operatorname{PGCD}(a,b)$.

### Exemple

$$
D(18)=\{1,2,3,6,9,18\},\qquad
D(15)=\{1,3,5,15\}.
$$

Les diviseurs positifs communs sont $1$ et $3$, donc

$$
\operatorname{PGCD}(18,15)=3.
$$

> **Image mentale de Davy.** Le PGCD est le plus grand format de paquet permettant de partager les deux quantités sans aucun reste.

## Toutes les propriétés utiles

En posant $d=\operatorname{PGCD}(a,b)$ :

| Propriété | Écriture |
|---|---|
| Les signes ne comptent pas | $\operatorname{PGCD}(a,b)=\operatorname{PGCD}(\lvert a\rvert,\lvert b\rvert)$ |
| Symétrie | $\operatorname{PGCD}(a,b)=\operatorname{PGCD}(b,a)$ |
| Tous les diviseurs communs | $D(a)\cap D(b)=D(d)$ |
| Cas d’une divisibilité | $a\mid b\Longrightarrow\operatorname{PGCD}(a,b)=\lvert a\rvert$ |
| Homogénéité | $\operatorname{PGCD}(ka,kb)=\lvert k\rvert\operatorname{PGCD}(a,b)$ |

Le PGCD est positif et vérifie

$$
1\leq d\leq\min(|a|,|b|).
$$

## Calcul par facteurs premiers

Le PGCD retient les facteurs premiers communs avec leurs **plus petits exposants** :

$$
\operatorname{PGCD}(a,b)=\prod p^{\min(\alpha_p,\beta_p)}.
$$

Ainsi

$$
36=2^2\times3^2,\qquad30=2\times3\times5,
$$

et

$$
\operatorname{PGCD}(36,30)=2\times3=6.
$$

## Réduire une paire par son PGCD

Si $d=\operatorname{PGCD}(a,b)$, alors il existe des entiers $a'$ et $b'$ tels que

$$
a=da',\qquad b=db',\qquad\operatorname{PGCD}(a',b')=1.
$$

Autrement dit, après avoir divisé les deux nombres par leur PGCD, les deux quotients sont premiers entre eux.

### Résoudre un problème de couples

Si l’on impose $\operatorname{PGCD}(a,b)=d$, commence par écrire $a=dm$ et $b=dn$ avec $\operatorname{PGCD}(m,n)=1$. Les autres contraintes portent alors sur $m$ et $n$ et deviennent beaucoup plus simples.

Pour $\operatorname{PGCD}(x,y)=354$ et $x+y=5664$ :

$$
x=354x',\qquad y=354y',\qquad x'+y'=16.
$$

Comme $\operatorname{PGCD}(x',16-x')=\operatorname{PGCD}(x',16)$, $x'$ doit être impair. Les huit valeurs $1,3,5,7,9,11,13,15$ donnent tous les couples officiels.

Pour $\operatorname{PGCD}(x,y)=28$ et $xy=8624$ :

$$
x=28x',\qquad y=28y',\qquad x'y'=\frac{8624}{28^2}=11.
$$

Le nombre $11$ étant premier, $(x',y')=(1,11)$ ou $(11,1)$, donc $(x,y)=(28,308)$ ou $(308,28)$.

> **Piège classique.** Une liste de couples doit respecter l’ordre demandé et être complète : si $(a,b)$ convient, vérifie séparément si $(b,a)$ convient aussi.`,
    keyPoint: String.raw`$D(a)\cap D(b)=D(\operatorname{PGCD}(a,b))$ et les facteurs premiers sont pris avec leurs exposants minimaux.`,
    example: String.raw`$132=96+36$, $96=2\times36+24$, $36=24+12$ : ainsi $\operatorname{PGCD}(132,-96)=12$.`,
    methodSteps: [
      "Ignore les signes en travaillant avec les valeurs absolues.",
      "Pour de petits nombres, liste les diviseurs ; sinon utilise les facteurs premiers ou Euclide.",
      "Dans une décomposition première, conserve les exposants minimaux communs.",
      "Dans un problème de couples, pose a = dm et b = dn avec m et n premiers entre eux.",
    ],
    timeline: [
      { label: "Diviseurs", detail: "Cherche ce qui divise exactement les deux nombres." },
      { label: "Le plus grand", detail: "Le PGCD est le plus grand diviseur positif commun." },
      { label: "Réduction", detail: "Divise les deux entiers par leur PGCD." },
      { label: "Coprimalité", detail: "Les deux quotients obtenus sont premiers entre eux." },
    ],
    questions: questionsByLevel["common-divisors-gcd"],
    corrections: [
      "Page 3 : la notation D isolée dans la propriété est explicitée comme PGCD.",
      "Page 11 : le produit de la décomposition de 132 est rétabli avec ses signes de multiplication.",
      "Page 12 : la liste publiée pour l’exercice 4 est complétée avec les huit couples ordonnés valides, obtenus à partir des entiers impairs premiers avec 16.",
      "La répétition du titre de l’exercice 2 dans le corrigé source est supprimée sans modifier son contenu mathématique.",
    ],
    tip: "Astuce mémoire de Davy : PGCD = plus grand partage sans reste ; dans les facteurs premiers, prends les plus petits exposants.",
  },
  {
    id: "euclidean-algorithm",
    title: "Algorithme d’Euclide",
    summary: String.raw`Calculer rapidement un PGCD par divisions successives et reconnaître le dernier reste non nul.`,
    pages: "4-5 et 14",
    section: "II-2. Algorithme d’Euclide • Exercice 8",
    durationMinutes: 60,
    body: String.raw`## Pourquoi le reste suffit

Soient $a$ et $b$ deux entiers avec $b\neq0$. La division euclidienne de $a$ par $b$ s’écrit

$$
a=bq+r,\qquad0\leq r<|b|.
$$

Un entier divise à la fois $a$ et $b$ si et seulement s’il divise à la fois $b$ et $r=a-bq$. Les ensembles de diviseurs communs sont donc identiques :

$$
\operatorname{PGCD}(a,b)=\operatorname{PGCD}(b,r).
$$

Cette égalité permet de remplacer progressivement un grand nombre par un reste plus petit.

## L’algorithme pas à pas

Pour calculer $\operatorname{PGCD}(2016,1188)$ :

$$
\begin{aligned}
2016&=1\times1188+828,\\
1188&=1\times828+360,\\
828&=2\times360+108,\\
360&=3\times108+36,\\
108&=3\times36+0.
\end{aligned}
$$

Le dernier reste non nul est $36$ :

$$
\operatorname{PGCD}(2016,1188)=36.
$$

> **Rythme à retenir.** Dividende, diviseur, reste ; puis diviseur, reste. On recommence jusqu’au reste nul.

## Un second exemple plus court

$$
47=3\times13+8,\qquad
13=1\times8+5,\qquad
8=1\times5+3,
$$

$$
5=1\times3+2,\qquad
3=1\times2+1,\qquad
2=2\times1+0.
$$

Ainsi $\operatorname{PGCD}(47,13)=1$ : les nombres $47$ et $13$ sont premiers entre eux.

## Préparer la remontée de Bézout

Ne jette pas les quotients ni les égalités obtenues. En isolant chaque reste, on pourra remonter les divisions et écrire le PGCD comme combinaison des deux nombres de départ. C’est précisément le travail du niveau suivant.

> **Vérification.** Le PGCD final doit diviser exactement les deux entiers de départ.`,
    keyPoint: String.raw`Si $a=bq+r$, alors $\operatorname{PGCD}(a,b)=\operatorname{PGCD}(b,r)$ ; le PGCD est le dernier reste non nul.`,
    example: String.raw`$47=3\times13+8$, puis $13=8+5$, $8=5+3$, $5=3+2$, $3=2+1$ : le PGCD vaut $1$.`,
    methodSteps: [
      "Place le plus grand nombre comme dividende et le plus petit comme diviseur.",
      "Effectue la division euclidienne et note clairement quotient et reste.",
      "Remplace le couple par (diviseur, reste) et recommence.",
      "Arrête-toi au reste nul : le reste précédent est le PGCD.",
    ],
    timeline: [
      { label: "Diviser", detail: "Écris a = bq + r avec un reste positif plus petit que le diviseur." },
      { label: "Décaler", detail: "Le nouveau couple est formé du diviseur et du reste." },
      { label: "Répéter", detail: "Les restes diminuent strictement, donc l’algorithme finit." },
      { label: "Conclure", detail: "Le dernier reste non nul est le PGCD." },
    ],
    questions: questionsByLevel["euclidean-algorithm"],
    corrections: [
      "Page 14 : dans la remontée associée à 13 et 47, le terme intermédiaire correct est (47 − 13×3)×5 ; la copie source ajoute par erreur un second terme −13×5.",
      "La numérotation incohérente des exercices et corrigés des pages 14-15 est remplacée par leur intitulé réel.",
    ],
    tip: "Astuce mémoire de Davy : dividende, diviseur, reste ; puis diviseur, reste — jusqu’à zéro.",
  },
  {
    id: "bezout-identity",
    title: "Identité et théorème de Bézout",
    summary: String.raw`Écrire un PGCD comme combinaison entière et reconnaître immédiatement deux entiers premiers entre eux.`,
    pages: "3-6",
    section: "II-3. Nombres premiers entre eux • III-1. Théorème de Bézout",
    durationMinutes: 65,
    body: String.raw`## Les multiples du PGCD sont des combinaisons

Une **combinaison linéaire entière** de $a$ et $b$ est un nombre de la forme

$$
au+bv,\qquad u,v\in\mathbb Z.
$$

Si $d=\operatorname{PGCD}(a,b)$, alors $d$ divise $a$ et $b$ ; il divise donc toute combinaison $au+bv$. Réciproquement, les multiples de $d$ sont exactement les combinaisons entières de $a$ et $b$.

En particulier, il existe des entiers $u$ et $v$ tels que

$$
\operatorname{PGCD}(a,b)=au+bv.
$$

Cette égalité est appelée **identité de Bézout**.

### Exemple immédiat

$$
144=18\times3+15\times6.
$$

Le nombre $144$ est donc une combinaison entière de $18$ et $15$.

## Trouver les coefficients par remontée

L’algorithme d’Euclide a donné $\operatorname{PGCD}(2016,1188)=36$. En remontant les égalités :

$$
36=-10\times2016+17\times1188.
$$

Ainsi $u=-10$ et $v=17$ constituent un couple de coefficients de Bézout. Ils ne sont pas uniques : $(23,-39)$ convient également.

## Nombres premiers entre eux

Deux entiers $a$ et $b$ sont **premiers entre eux** lorsque

$$
\operatorname{PGCD}(a,b)=1.
$$

Le théorème de Bézout donne le test fondamental :

$$
\operatorname{PGCD}(a,b)=1
\iff
\exists(u,v)\in\mathbb Z^2, au+bv=1.
$$

Par exemple,

$$
25\times2+7\times(-7)=50-49=1,
$$

donc $25$ et $7$ sont premiers entre eux.

## Réduire par un diviseur commun

Si $d$ divise $a$ et $b$, alors

$$
\operatorname{PGCD}\left(\frac ad,\frac bd\right)
=\frac{\operatorname{PGCD}(a,b)}{|d|}.
$$

En particulier, si $d=\operatorname{PGCD}(a,b)$, les quotients $a/d$ et $b/d$ sont premiers entre eux.

> **Attention au sens logique.** Une égalité $au+bv=1$ prouve la coprimalité. Une combinaison donnant un autre nombre ne suffit pas, à elle seule, pour conclure que le PGCD vaut ce nombre.`,
    keyPoint: String.raw`$\operatorname{PGCD}(a,b)=1\iff\exists(u,v)\in\mathbb Z^2:\ au+bv=1$.`,
    example: String.raw`$25\times2+7\times(-7)=1$ ; le théorème de Bézout prouve donc que $25$ et $7$ sont premiers entre eux.`,
    methodSteps: [
      "Calcule le PGCD par l’algorithme d’Euclide.",
      "Isole chaque reste dans les divisions successives.",
      "Remonte les égalités en remplaçant chaque reste par son expression précédente.",
      "Regroupe les coefficients des deux entiers de départ et vérifie la combinaison.",
    ],
    timeline: [
      { label: "Euclide", detail: "Les divisions successives fournissent le PGCD." },
      { label: "Isoler", detail: "Écris chaque reste comme différence." },
      { label: "Remonter", detail: "Substitue les restes du bas vers le haut." },
      { label: "Vérifier", detail: "La combinaison finale doit redonner exactement le PGCD." },
    ],
    questions: questionsByLevel["bezout-identity"],
    corrections: [
      "Page 4 : dans la remarque sur les multiples, 144 = 3×18 est corrigé en 144 = 3×48. L’exercice de combinaison conserve séparément 144 = 18×3 + 15×6.",
      "Les conditions de non-nullité et de divisibilité sont précisées lorsque des quotients par un diviseur commun sont utilisés.",
    ],
    tip: "Astuce mémoire de Davy : Bézout transforme le PGCD en recette — un morceau de a plus un morceau de b.",
  },
  {
    id: "gauss-theorem",
    title: "Théorème de Gauss",
    summary: String.raw`Simplifier une divisibilité ou une congruence lorsque le facteur supprimé est premier avec le diviseur.`,
    pages: "6-7 et 12-15",
    section: "III-2. Théorème de Gauss et conséquences • Exercices 6 et 8",
    durationMinutes: 60,
    body: String.raw`## Le théorème qui autorise une simplification

Soient $a$, $b$ et $c$ des entiers relatifs. Si

$$
a\mid bc
\quad\text{et}\quad
\operatorname{PGCD}(a,b)=1,
$$

alors

$$
a\mid c.
$$

C’est le **théorème de Gauss**. La condition de coprimalité est indispensable : on ne supprime jamais un facteur dans une divisibilité sans la vérifier.

## Pourquoi le théorème est vrai

Comme $a$ et $b$ sont premiers entre eux, Bézout fournit des entiers $u$ et $v$ tels que

$$
au+bv=1.
$$

En multipliant par $c$ :

$$
acu+bcv=c.
$$

Or $a\mid acu$ et, par hypothèse, $a\mid bcv$. Donc $a$ divise leur somme $c$.

## Résoudre $2x-5y=0$

L’équation donne

$$
2x=5y.
$$

Ainsi $2\mid5y$. Comme $\operatorname{PGCD}(2,5)=1$, Gauss donne $2\mid y$. Il existe donc $k\in\mathbb Z$ tel que $y=2k$, puis $x=5k$ :

$$
S=\{(5k,2k)\mid k\in\mathbb Z\}.
$$

## Conséquences à maîtriser

| Hypothèses | Conclusion |
|---|---|
| $a\mid c$, $b\mid c$ et $\operatorname{PGCD}(a,b)=1$ | $ab\mid c$ |
| $\operatorname{PGCD}(a,b)=1$ et $\operatorname{PGCD}(a,c)=1$ | $\operatorname{PGCD}(a,bc)=1$ |
| $a$ et $b$ premiers entre eux | $\operatorname{PPCM}(a,b)=|ab|$ |

## Simplifier une congruence

Pour résoudre

$$
25a\equiv100\pmod7,
$$

on réduit d’abord les coefficients :

$$
4a\equiv2\pmod7.
$$

L’inverse de $4$ modulo $7$ vaut $2$, car $4\times2\equiv1\pmod7$. En multipliant les deux membres par $2$ :

$$
a\equiv4\pmod7.
$$

> **Piège classique.** Dans $ac\equiv bc\pmod n$, on peut simplifier par $c$ sans changer le module seulement lorsque $c$ est premier avec $n$.`,
    keyPoint: String.raw`$a\mid bc$ et $\operatorname{PGCD}(a,b)=1\Longrightarrow a\mid c$.`,
    example: String.raw`$2\mid5y$ et $\operatorname{PGCD}(2,5)=1$ donnent $2\mid y$ ; ainsi $2x-5y=0$ a pour solutions $(5k,2k)$.`,
    methodSteps: [
      "Repère le diviseur, le produit et le facteur que tu souhaites supprimer.",
      "Calcule ou justifie le PGCD entre ce facteur et le diviseur.",
      "Applique Gauss uniquement si ce PGCD vaut 1.",
      "Paramètre l’entier obtenu, puis remplace-le dans l’égalité de départ.",
    ],
    timeline: [
      { label: "Divisibilité", detail: "Mets l’énoncé sous la forme a divise un produit bc." },
      { label: "Coprimalité", detail: "Vérifie que a et le facteur b sont premiers entre eux." },
      { label: "Gauss", detail: "Déduis que a divise l’autre facteur c." },
      { label: "Paramètre", detail: "Écris c = ak et termine le calcul." },
    ],
    questions: questionsByLevel["gauss-theorem"],
    corrections: [
      "Page 6 : la coquille « divse » est corrigée en « divise » et les accords du théorème sont rétablis.",
      "Page 7 : les conditions de coprimalité nécessaires à la simplification d’une congruence sont rendues explicites.",
      "Page 12 : la paramétrisation de l’exercice 6 est uniformisée sous la forme (5k,2k), k entier relatif.",
    ],
    tip: "Astuce mémoire de Davy : Gauss donne le droit de simplifier, mais le ticket d’entrée est un PGCD égal à 1.",
  },
  {
    id: "gcd-lcm-relation",
    title: "Relation entre PGCD et PPCM",
    summary: String.raw`Passer rapidement du PGCD au PPCM grâce à une relation unique entre le produit et le partage.`,
    pages: "6-7",
    section: "III-2. Conséquences du théorème de Gauss",
    durationMinutes: 35,
    body: String.raw`## Le cas de deux entiers premiers entre eux

Si $a$ et $b$ sont premiers entre eux, chacun divise le produit $ab$ et aucun facteur commun ne peut réduire le premier multiple commun. Ainsi

$$
\operatorname{PPCM}(a,b)=|ab|.
$$

Par exemple, $4$ et $3$ sont premiers entre eux :

$$
\operatorname{PPCM}(4,3)=4\times3=12.
$$

## La relation fondamentale

Pour deux entiers relatifs non nuls $a$ et $b$ :

$$
\boxed{\operatorname{PGCD}(a,b)\times\operatorname{PPCM}(a,b)=|ab|}.
$$

Dans le cadre des entiers naturels positifs du document, le membre de droite s’écrit simplement $ab$. La valeur absolue permet d’étendre correctement la relation aux entiers relatifs.

### Exemple

Comme


$$
\operatorname{PGCD}(18,15)=3,
$$

alors

$$
\operatorname{PPCM}(18,15)
=\frac{18\times15}{3}
=90.
$$

## Pourquoi la formule fonctionne

Écris

$$
a=da',\qquad b=db',\qquad d=\operatorname{PGCD}(a,b),
$$

avec $a'$ et $b'$ premiers entre eux. Leur PPCM vaut $|a'b'|$. Par homogénéité :

$$
\operatorname{PPCM}(a,b)=d|a'b'|.
$$

Alors

$$
d\times\operatorname{PPCM}(a,b)
=d^2|a'b'|
=|ab|.
$$

> **Contrôle éclair.** Si tu connais trois des quatre valeurs PGCD, PPCM, $a$ et $b$, la relation détermine la quatrième.`,
    keyPoint: String.raw`$\operatorname{PGCD}(a,b)\operatorname{PPCM}(a,b)=|ab|$.`,
    example: String.raw`$\operatorname{PPCM}(18,15)=\dfrac{18\times15}{\operatorname{PGCD}(18,15)}=\dfrac{270}{3}=90$.`,
    methodSteps: [
      "Calcule d’abord le PGCD si celui-ci n’est pas fourni.",
      "Écris la relation PGCD × PPCM = valeur absolue du produit.",
      "Isole la quantité cherchée avant de remplacer les valeurs.",
      "Vérifie qu’un PPCM obtenu est divisible par chacun des deux nombres.",
    ],
    timeline: [
      { label: "PGCD", detail: "Il mesure la partie commune des deux entiers." },
      { label: "Produit", detail: "Calcule la valeur absolue du produit ab." },
      { label: "Quotient", detail: "Divise ce produit par le PGCD pour obtenir le PPCM." },
    ],
    questions: questionsByLevel["gcd-lcm-relation"],
    tip: "Astuce mémoire de Davy : PGCD fois PPCM remet exactement tous les facteurs du produit, sans oubli ni doublon.",
  },
  {
    id: "diophantine-solvability",
    title: "Existence des solutions diophantiennes",
    summary: String.raw`Décider avant tout calcul si une équation $ax+by=c$ peut posséder des solutions entières.`,
    pages: "7 et 13-14",
    section: "IV-1. Équations diophantiennes : condition d’existence • Exercices 7 et 8",
    durationMinutes: 45,
    body: String.raw`## Une équation dans les entiers

Une équation diophantienne linéaire à deux inconnues est une équation

$$
ax+by=c,
$$

où $a$, $b$ et $c$ sont des entiers donnés et où l’on cherche uniquement des couples $(x,y)\in\mathbb Z^2$.

## Le critère de solvabilité

En posant $d=\operatorname{PGCD}(a,b)$ :

$$
\boxed{ax+by=c\text{ admet une solution entière}\iff d\mid c.}
$$

### Pourquoi la condition est nécessaire

Le nombre $d$ divise $a$ et $b$. Il divise donc toute combinaison $ax+by$. Si cette combinaison vaut $c$, alors nécessairement $d\mid c$.

### Pourquoi elle est suffisante

Bézout fournit des entiers $u$ et $v$ tels que

$$
au+bv=d.
$$

Si $c=dq$, alors

$$
a(qu)+b(qv)=c,
$$

ce qui construit une solution entière.

## Deux décisions rapides

Pour

$$
(E):4x-6y=1,
$$

le PGCD de $4$ et $6$ vaut $2$, mais $2\nmid1$. L’équation n’a donc aucune solution entière.

Pour

$$
(F):3x-5y=-2,
$$

le PGCD de $3$ et $5$ vaut $1$, qui divise $-2$. L’équation est soluble ; le couple $(1,1)$ est une solution particulière puisque $3-5=-2$.

## Le bon réflexe en situation-problème

Avant de chercher des valeurs de $x$ et $y$ :

1. traduis la situation par une équation entière ;
2. calcule $d=\operatorname{PGCD}(a,b)$ ;
3. teste $d\mid c$ ;
4. seulement si le test réussit, cherche une solution particulière.

> **Gain de temps.** Le test du PGCD peut prouver en une ligne qu’un problème n’a aucune solution, sans essais inutiles.`,
    keyPoint: String.raw`$ax+by=c$ est soluble dans $\mathbb Z^2$ si et seulement si $\operatorname{PGCD}(a,b)\mid c$.`,
    example: String.raw`$4x-6y=1$ n’a pas de solution entière car $\operatorname{PGCD}(4,6)=2$ et $2\nmid1$.`,
    methodSteps: [
      "Identifie les coefficients a, b et le second membre c.",
      "Calcule d = PGCD(a,b), sans tenir compte des signes.",
      "Teste si d divise exactement c.",
      "Conclue : aucune solution si le test échoue ; recherche d’une solution particulière s’il réussit.",
    ],
    timeline: [
      { label: "Modéliser", detail: "Mets le problème sous la forme ax + by = c." },
      { label: "Calculer d", detail: "Trouve le PGCD des deux coefficients." },
      { label: "Demander la permission", detail: "Vérifie si d divise c." },
      { label: "Décider", detail: "Le test donne immédiatement l’existence ou l’impossibilité." },
    ],
    questions: questionsByLevel["diophantine-solvability"],
    corrections: [
      "Les hypothèses a et b non tous deux nuls sont précisées pour le critère de solvabilité.",
      "Pages 13-14 : les doublons de titre et les renvois de correction mal numérotés sont remplacés par les exercices réellement traités.",
    ],
    tip: "Astuce mémoire de Davy : avant de résoudre, demande la permission au PGCD — doit-il diviser le second membre ?",
  },
  {
    id: "diophantine-congruences",
    title: "Équations diophantiennes, congruences et codage",
    summary: String.raw`Paramétrer toutes les solutions, résoudre une congruence linéaire et décoder un message par arithmétique modulaire.`,
    pages: "8-10 et 13-16",
    section: "IV-2. Résolution • V. Congruences • Situation d’évaluation et problème de synthèse",
    durationMinutes: 90,
    kind: "challenge",
    body: String.raw`## De la solution particulière à toutes les solutions

Supposons que $d=\operatorname{PGCD}(a,b)$ divise $c$ et qu’un couple $(x_0,y_0)$ vérifie

$$
ax_0+by_0=c.
$$

Toutes les solutions de $ax+by=c$ sont alors

$$
\boxed{x=x_0+\frac bd k,\qquad y=y_0-\frac ad k,\qquad k\in\mathbb Z.}
$$

Le signe peut sembler différent si l’on remplace $k$ par $-k$ : les deux paramétrisations décrivent le même ensemble.

### Exemple : $3x-5y=-2$

Le couple $(1,1)$ est une solution particulière. Ici $a=3$, $b=-5$ et $d=1$. Une écriture pratique est

$$
x=1+5k,\qquad y=1+3k,\qquad k\in\mathbb Z.
$$

La vérification est immédiate :

$$
3(1+5k)-5(1+3k)=-2.
$$

## Congruence linéaire et équation cachée

La congruence

$$
ax\equiv b\pmod n
$$

signifie qu’il existe un entier $y$ tel que

$$
ax-ny=b.
$$

C’est donc une équation diophantienne. Elle est soluble si et seulement si

$$
\operatorname{PGCD}(a,n)\mid b.
$$

### Exemple soluble

$$
2x\equiv3\pmod5.
$$

L’inverse de $2$ modulo $5$ est $3$. Ainsi

$$
x\equiv9\equiv4\pmod5,
$$

soit $x=4+5k$.

### Exemple impossible

$$
8x\equiv1\pmod4
$$

n’a pas de solution, car $\operatorname{PGCD}(8,4)=4$ ne divise pas $1$.

## Résoudre $13x+47y=1$

Euclide montre que $\operatorname{PGCD}(13,47)=1$. En réduisant l’équation modulo $13$ :

$$
47y\equiv1\pmod{13}
\iff
8y\equiv1\pmod{13}.
$$

Comme $8\times5=40\equiv1\pmod{13}$ :

$$
y\equiv5\pmod{13},\qquad y=5-13k.
$$

On obtient alors $x=47k-18$. Toutes les solutions sont

$$
(x,y)=(47k-18,-13k+5),\qquad k\in\mathbb Z.
$$

## Application : répartir des nuitées

M. Chaukaud paie $13\,000$ F par nuit en chambre A et $47\,000$ F par nuit en chambre B, pour un coût total de $524\,000$ F. En notant $x$ et $y$ les nombres de nuitées, on doit résoudre dans $\mathbb N^2$ :

$$
13x+47y=524.
$$

Comme $13(-18)+47(5)=1$, la multiplication par $524$ fournit une solution particulière $(-9432,2620)$. Toutes les solutions entières sont donc

$$
x=47k-9432,\qquad y=-13k+2620,\qquad k\in\mathbb Z.
$$

Les contraintes $x\geq0$ et $y\geq0$ donnent

$$
\frac{9432}{47}\leq k\leq\frac{2620}{13}.
$$

Le seul entier de cet intervalle est $k=201$. Ainsi $x=15$ et $y=7$. Vérification : $13\times15+47\times7=524$. La répartition est donc **15 nuitées à 13 000 F et 7 nuitées à 47 000 F**.

## Mission codage : de NWXLP à ADMIS

On associe $A=0,B=1,\ldots,Z=25$ et on chiffre avec

$$
f(x)\equiv29x+13\pmod{26}.
$$

Comme $29\equiv3\pmod{26}$ et

$$
3\times9=27\equiv1\pmod{26},
$$

l’inverse de $29$ modulo $26$ est $9$. Pour décoder $y$ :

$$
x\equiv9(y-13)\equiv9y+13\pmod{26}.
$$

| Lettre codée | Nombre $y$ | $9y+13\pmod{26}$ | Lettre décodée |
|---|---:|---:|---|
| N | 13 | 0 | A |
| W | 22 | 3 | D |
| X | 23 | 12 | M |
| L | 11 | 8 | I |
| P | 15 | 18 | S |

Le message **NWXLP** devient **ADMIS**.

> **Contrôle indispensable.** Après une paramétrisation, remplace toujours $x$ et $y$ dans l’équation initiale. Après un décodage, rechiffre une lettre pour contrôler l’inverse.`,
    keyPoint: String.raw`$x=x_0+\dfrac bd k$, $y=y_0-\dfrac ad k$ ; et $ax\equiv b\pmod n$ est soluble si $\operatorname{PGCD}(a,n)\mid b$.`,
    example: String.raw`$13x+47y=1$ a pour solutions $(x,y)=(47k-18,-13k+5)$ ; pour $k=0$, on retrouve $(-18,5)$.`,
    methodSteps: [
      "Vérifie la solvabilité avec le PGCD et trouve une solution particulière.",
      "Ajoute les pas b/d sur x et −a/d sur y, avec un paramètre entier.",
      "Pour une congruence, transforme-la en équation ax − ny = b ou utilise un inverse modulo n.",
      "Applique les contraintes du problème au paramètre puis vérifie la solution dans l’énoncé initial.",
    ],
    timeline: [
      { label: "Solution particulière", detail: "Trouve un premier couple, souvent grâce à Bézout ou à une congruence." },
      { label: "Direction", detail: "Les solutions se déplacent par pas de b/d et −a/d." },
      { label: "Paramètre", detail: "Fais varier k dans tous les entiers relatifs." },
      { label: "Contraintes", detail: "Dans un problème concret, ne conserve que les valeurs admissibles." },
      { label: "Vérification", detail: "Remplace dans l’équation et contrôle chaque condition du contexte." },
    ],
    questions: questionsByLevel["diophantine-congruences"],
    corrections: [
      "Pages 8-10 : la numérotation, les accords et les notations modulaires du passage sur le codage sont harmonisés sans changer la méthode.",
      "Le décodage est recalculé avec l’inverse correct de 29 modulo 26, égal à 9 ; la fonction inverse est g(y) ≡ 9y + 13 modulo 26 et donne ADMIS.",
      "Pages 14-15 : les étapes algébriques et les intitulés de l’exercice 8 sont remis dans l’ordre ; la solution particulière correcte est (−18,5).",
      "Les répétitions et renvois de corrigés contradictoires des pages 13 à 16 sont rattachés à l’exercice réellement résolu.",
    ],
    tip: "Astuce mémoire de Davy : une congruence est une équation diophantienne cachée derrière un multiple du module.",
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCLcmGcdPath: LearningPath = {
  id: "terminale-c-math-l11-lcm-gcd",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 3, title: "Arithmétique" },
  chapterNumber: 11,
  title: "PPCM et PGCD de deux entiers relatifs",
  description: "PPCM, PGCD, algorithme d’Euclide, Bézout, Gauss, équations diophantiennes, congruences et codage, avec les 36 questions officielles réparties en huit niveaux.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer et interpréter un PGCD et un PPCM",
    "Mettre en œuvre l’algorithme d’Euclide et une identité de Bézout",
    "Utiliser le théorème de Gauss dans une divisibilité ou une congruence",
    "Décider si une équation diophantienne est soluble puis paramétrer toutes ses solutions",
    "Résoudre une congruence et appliquer l’arithmétique modulaire à un codage affine",
  ],
  modules: [
    {
      id: "terminale-c-math-l11-lcm-gcd-mastery",
      title: "Maîtriser le PPCM, le PGCD et les équations entières",
      description: "Du premier multiple commun au décodage affine, avec les 25 groupes d’exercices du document officiel décomposés en 36 réponses évaluables.",
      lessons: builtLevels,
    },
  ],
};
