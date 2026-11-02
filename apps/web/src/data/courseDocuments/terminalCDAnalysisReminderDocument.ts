import type { CourseDocument } from "../../domain/courseDocument";

export const terminalCDAnalysisReminderDocument: CourseDocument = {
  id: "terminal-cd-analysis-reminder",
  version: 1,
  levelIds: ["terminale-c", "terminale-d"],
  source: {
    title: "Coefficient 12 · édition 2022–2023 · Rappel de mathématiques",
    lessonLabel: "Leçon 00",
    pageCount: 740,
    summaryPages: [9, 10],
    evaluationPages: [],
    sha256: "59886C625771AD627E104FAB36C52927DCA046FE6083AAD9791927C7923F2362",
    editorialNotes: [
      "Rappel des pages imprimées et PDF 9–10, inspectées visuellement. Les trois ensembles de notions, huit tableaux de signes et neuf identités sont conservés dans une rédaction originale. Aucun scan ni mise en page reproduite.",
      "Le fascicule annonce Terminale D ; ces prérequis communs sont publiés en C et D à la demande explicite du porteur, sans étendre d’autres chapitres du fascicule.",
      "Hypothèses a non nul et recherche dans R explicitées. Les deux racines sont ordonnées avant les tableaux, indépendamment du signe de a. Avec un a négatif, la formule portant −sqrt(Delta) n’est pas automatiquement la plus petite.",
      "La relation imprimée x2 × x2 = c/a devient x1 × x2 = c/a. Les zéros sont inscrits dans les tableaux du cas Delta=0. La non-factorisation du cas Delta<0 signifie absence de facteurs linéaires réels.",
      "Document de lecture hors moteur de progression : aucune question ou évaluation inventée, aucun niveau historique, aucun XP ou faux feedback serveur. L’essentiel reste en attente du contenu du porteur.",
    ],
  },
  sections: [
    {
      id: "reminder-affine",
      numeral: "I",
      title: "Signe d’une expression du premier degré",
      topics: [{
        id: "reminder-affine-sign",
        title: "Reconnaître le signe de $ax+b$",
        pages: [9],
        body: String.raw`On considère deux réels $a$ et $b$, avec **$a\ne0$**.

L’expression $ax+b$ s’annule une seule fois :

$$ax+b=0\quad\Longleftrightarrow\quad x=x_0=-\frac ba.$$

### Si $a>0$

Avant $x_0$, l’expression est négative. Après $x_0$, elle est positive.

| $x$ | $]-\infty;x_0[$ | $x_0$ | $]x_0;+\infty[$ |
| --- | --- | --- | --- |
| $ax+b$ | $-$ | $0$ | $+$ |

### Si $a<0$

Les signes s’inversent : l’expression est positive avant $x_0$ et négative après.

| $x$ | $]-\infty;x_0[$ | $x_0$ | $]x_0;+\infty[$ |
| --- | --- | --- | --- |
| $ax+b$ | $+$ | $0$ | $-$ |

**À retenir :** à droite de sa racine, $ax+b$ a le signe de $a$ ; à gauche, il a le signe contraire.`,
      }],
    },
    {
      id: "reminder-quadratic",
      numeral: "II",
      title: "Équations et signes du second degré",
      topics: [
        {
          id: "reminder-quadratic-discriminant",
          title: "Commencer par le discriminant",
          pages: [9],
          body: String.raw`Pour résoudre dans $\mathbb R$ l’équation

$$ax^2+bx+c=0,$$

on vérifie que **$a\ne0$**, puis on calcule :

$$\boxed{\Delta=b^2-4ac}.$$

Le signe de $\Delta$ indique combien de racines réelles existent :

| Discriminant | Solutions réelles |
| --- | --- |
| $\Delta>0$ | Deux racines distinctes |
| $\Delta=0$ | Une racine double |
| $\Delta<0$ | Aucune racine réelle |`,
        },
        {
          id: "reminder-quadratic-positive",
          title: String.raw`Deux racines distinctes : $\Delta>0$`,
          pages: [9],
          body: String.raw`Les deux solutions sont :

$$\frac{-b-\sqrt{\Delta}}{2a}\qquad\text{et}\qquad\frac{-b+\sqrt{\Delta}}{2a}.$$

On les range dans l’ordre croissant et on les note **$x_1<x_2$**. Cet ordre doit être vérifié, surtout lorsque $a<0$.

### Factorisation

$$ax^2+bx+c=a(x-x_1)(x-x_2).$$

### Signe du trinôme

Il a **le signe de $a$ à l’extérieur des racines** et **le signe contraire entre les deux racines**. Il est nul en $x_1$ et en $x_2$.

**Si $a>0$ :**

| $x$ | $]-\infty;x_1[$ | $x_1$ | $]x_1;x_2[$ | $x_2$ | $]x_2;+\infty[$ |
| --- | --- | --- | --- | --- | --- |
| $ax^2+bx+c$ | $+$ | $0$ | $-$ | $0$ | $+$ |

**Si $a<0$ :**

| $x$ | $]-\infty;x_1[$ | $x_1$ | $]x_1;x_2[$ | $x_2$ | $]x_2;+\infty[$ |
| --- | --- | --- | --- | --- | --- |
| $ax^2+bx+c$ | $-$ | $0$ | $+$ | $0$ | $-$ |`,
        },
        {
          id: "reminder-quadratic-zero",
          title: String.raw`Une racine double : $\Delta=0$`,
          pages: [9, 10],
          body: String.raw`L’unique racine est :

$$x_0=-\frac b{2a}.$$

### Factorisation

$$ax^2+bx+c=a(x-x_0)^2.$$

Comme un carré est positif ou nul, le trinôme garde **le signe de $a$ pour $x\ne x_0$** et s’annule en $x_0$.

**Si $a>0$ :**

| $x$ | $]-\infty;x_0[$ | $x_0$ | $]x_0;+\infty[$ |
| --- | --- | --- | --- |
| $ax^2+bx+c$ | $+$ | $0$ | $+$ |

**Si $a<0$ :**

| $x$ | $]-\infty;x_0[$ | $x_0$ | $]x_0;+\infty[$ |
| --- | --- | --- | --- |
| $ax^2+bx+c$ | $-$ | $0$ | $-$ |`,
        },
        {
          id: "reminder-quadratic-negative",
          title: String.raw`Aucune racine réelle : $\Delta<0$`,
          pages: [9, 10],
          body: String.raw`L’équation $ax^2+bx+c=0$ n’a **aucune solution dans $\mathbb R$**.

Le trinôme ne peut donc pas se décomposer en produit de deux facteurs du premier degré à coefficients réels.

Il ne s’annule jamais et garde **le signe de $a$ sur tout $\mathbb R$**.

**Si $a>0$ :**

| $x$ | $]-\infty;+\infty[$ |
| --- | --- |
| $ax^2+bx+c$ | $+$ |

**Si $a<0$ :**

| $x$ | $]-\infty;+\infty[$ |
| --- | --- |
| $ax^2+bx+c$ | $-$ |`,
        },
        {
          id: "reminder-quadratic-sum-product",
          title: "Somme et produit des racines",
          pages: [9],
          body: String.raw`Lorsque le trinôme possède deux racines réelles $x_1$ et $x_2$, éventuellement confondues :

$$\boxed{x_1+x_2=-\frac ba}\qquad\boxed{x_1x_2=\frac ca}.$$

Ces deux relations permettent de contrôler des racines déjà trouvées ou de reconnaître leur somme et leur produit.

Si $\Delta=0$, on prend $x_1=x_2=x_0$.`,
        },
      ],
    },
    {
      id: "reminder-identities",
      numeral: "III",
      title: "Identités remarquables",
      topics: [
        {
          id: "reminder-identities-squares",
          title: "Carrés et différence de deux carrés",
          pages: [10],
          body: String.raw`Pour tous réels $a$ et $b$ :

### Carré d’une différence

$$(a-b)^2=a^2-2ab+b^2.$$

### Carré d’une somme

$$(a+b)^2=a^2+2ab+b^2.$$

### Différence de deux carrés

$$a^2-b^2=(a-b)(a+b).$$

Les deux premières identités servent à développer ou à reconnaître un carré. La troisième donne directement une factorisation.`,
        },
        {
          id: "reminder-identities-cubes",
          title: "Développer et factoriser avec les cubes",
          pages: [10],
          body: String.raw`Pour tous réels $a$ et $b$ :

### Cube d’une somme

$$(a+b)^3=a^3+3a^2b+3ab^2+b^3.$$

### Cube d’une différence

$$(a-b)^3=a^3-3a^2b+3ab^2-b^3.$$

### Différence de deux cubes

$$a^3-b^3=(a-b)(a^2+ab+b^2).$$

### Somme de deux cubes

$$a^3+b^3=(a+b)(a^2-ab+b^2).$$

Dans une factorisation de cubes, le signe du terme $ab$ dans la parenthèse du second degré est opposé à celui du facteur $a\pm b$.`,
        },
        {
          id: "reminder-identities-unit-cubes",
          title: "Les formes $a^3-1$ et $a^3+1$",
          pages: [10],
          body: String.raw`En remplaçant $b$ par $1$ dans les deux factorisations précédentes, on obtient :

$$a^3-1=(a-1)(a^2+a+1),$$

$$a^3+1=(a+1)(a^2-a+1).$$

Ces écritures permettent de faire apparaître le facteur $a-1$ ou $a+1$.`,
        },
      ],
    },
  ],
  evaluations: [],
  legacyAnchors: {},
};
