import type { CourseDocumentSection } from "../../domain/courseDocument";

/** Pyramide TC, tome 1, folios 81–83 ; pages PDF 83–85. */
export const terminalCPrimitivesSummary: CourseDocumentSection[] = [
  {
    id: "primitive-definition-section", numeral: "I", title: "Primitive d’une fonction",
    topics: [
      {
        id: "primitive-definition-summary", title: "Définition", pages: [83],
        legacyLessonIds: ["primitive-definition"],
        body: String.raw`Soit $f$ une fonction définie sur un intervalle $I$. Une fonction $F$ est une **primitive de $f$ sur $I$** lorsque $F$ est dérivable sur $I$ et que :

$$\boxed{F'(x)=f(x)\quad\text{pour tout }x\in I.}$$

Chercher une primitive revient à remonter une dérivation. Pour vérifier une réponse, on **dérive la fonction proposée**, puis on compare avec $f$.

L’intervalle fait partie de la réponse : la formule doit y être définie et dérivable. À une extrémité incluse, la dérivée est comprise du côté de l’intervalle.`,
        examples: [{ id: "primitive-two-candidates", title: "Deux primitives d’une même fonction",
          prompt: String.raw`Soit $f(x)=8x-5$. Vérifions que $F(x)=4x^2-5x$ et $G(x)=4x^2-5x+7$ sont des primitives de $f$ sur $\mathbb R$.`,
          parts: [
            { id: "primitive-candidate-f", label: "a)", prompt: String.raw`Vérifier la fonction $F$.`, solution: String.raw`$F$ est un polynôme, donc elle est dérivable sur $\mathbb R$. On dérive terme à terme :

$$F'(x)=4\times2x-5=8x-5=f(x).$$

**Donc $F$ est une primitive de $f$ sur $\mathbb R$.**` },
            { id: "primitive-candidate-g", label: "b)", prompt: String.raw`Vérifier la fonction $G$.`, solution: String.raw`$G$ est également dérivable sur $\mathbb R$. La dérivée de la constante $7$ est nulle, donc :

$$G'(x)=8x-5+0=f(x).$$

**Donc $G$ est aussi une primitive de $f$ sur $\mathbb R$.** Les deux primitives diffèrent d’une constante.` },
          ],
        }],
      },
      {
        id: "primitive-existence-summary", title: "Existence d’une primitive", pages: [83],
        legacyLessonIds: ["primitive-existence"],
        body: String.raw`### Propriété

Toute fonction **continue sur un intervalle $I$** admet des primitives sur cet intervalle.

Pour appliquer cette propriété, on indique l’intervalle, puis on justifie la continuité : fonction polynomiale, somme, produit, quotient à dénominateur non nul ou composée de fonctions continues.

Cette propriété suffit à prouver l’existence, mais ne donne pas à elle seule une formule de primitive.`,
        examples: [{ id: "primitive-polynomial-existence", title: "Une fonction polynomiale",
          prompt: String.raw`Justifions que $f(x)=x^4+1$ admet des primitives sur $\mathbb R$.`,
          solution: String.raw`$f$ est une fonction polynomiale. Elle est donc continue sur $\mathbb R$, qui est un intervalle. **Elle admet des primitives sur $\mathbb R$.**

On peut d’ailleurs vérifier que $F(x)=x^5/5+x$ convient :

$$F'(x)=\frac55x^4+1=x^4+1=f(x).$$`,
        }],
      },
      {
        id: "primitive-family-summary", title: "Toutes les primitives", pages: [83],
        legacyLessonIds: ["primitive-family"],
        body: String.raw`### Propriété

Soit $f$ continue sur un intervalle $I$ et $F$ l’une de ses primitives. **Toutes** ses primitives sur $I$ sont les fonctions :

$$\boxed{x\longmapsto F(x)+C,\qquad C\in\mathbb R.}$$

Autrement dit, deux primitives d’une même fonction sur un **même intervalle** diffèrent d’une constante. La dérivée de $C$ vaut zéro.

Sur un domaine constitué de plusieurs intervalles séparés, la constante peut être différente sur chaque intervalle.`,
        examples: [{ id: "primitive-affine-family", title: "La constante d’intégration",
          prompt: String.raw`Déterminons toutes les primitives de $f(x)=2x+1$ sur $\mathbb R$.`,
          solution: String.raw`Une primitive de $2x$ est $x^2$ et une primitive de $1$ est $x$. Ainsi $F_0(x)=x^2+x$ vérifie $F_0'(x)=2x+1$.

**Toutes les primitives sont donc :**

$$\boxed{F(x)=x^2+x+C,\quad C\in\mathbb R.}$$

Dire « une primitive » permet de choisir $C=0$. Dire « toutes les primitives » demande de conserver $C$.`,
        }],
      },
    ],
  },
  {
    id: "primitive-initial-section", numeral: "II", title: "Primitive prenant une valeur donnée",
    topics: [{
      id: "primitive-initial-summary", title: "Existence et unicité", pages: [83, 84],
      legacyLessonIds: ["primitive-initial-value"],
      body: String.raw`### Propriété

Soit $f$ continue sur un intervalle $I$, $a\in I$ et $b\in\mathbb R$. Il existe **une unique primitive $F$ de $f$ sur $I$ telle que $F(a)=b$**.

Si $F_0$ est une primitive connue, on écrit $F=F_0+C$, puis :

$$F_0(a)+C=b\quad\Longrightarrow\quad C=b-F_0(a).$$

On remplace ensuite $C$ par sa valeur et on vérifie la condition.`,
      examples: [{ id: "primitive-initial-affine", title: "Une primitive qui s’annule en 1",
        prompt: String.raw`Déterminons la primitive de $f(x)=2x-5$ sur $\mathbb R$ vérifiant $F(1)=0$.`,
        parts: [
          { id: "primitive-initial-family", label: "a)", prompt: "Écrire la famille des primitives.", solution: String.raw`$f$ est continue sur $\mathbb R$. Comme $(x^2-5x)'=2x-5$, toutes ses primitives sont $F(x)=x^2-5x+C$.` },
          { id: "primitive-initial-constant", label: "b)", prompt: "Utiliser la valeur imposée.", solution: String.raw`On remplace $x$ par $1$ :

$$F(1)=1-5+C=-4+C.$$

La condition $F(1)=0$ donne $-4+C=0$, donc $C=4$. **La primitive cherchée est :**

$$\boxed{F(x)=x^2-5x+4.}$$

Vérification : $F'(x)=2x-5$ et $F(1)=1-5+4=0$.` },
        ],
      }],
    }],
  },
  {
    id: "primitive-usual-section", numeral: "III", title: "Primitives des fonctions usuelles",
    topics: [{
      id: "primitive-usual-summary", title: "Tableau des primitives usuelles", pages: [84],
      legacyLessonIds: ["usual-primitives"],
      body: String.raw`Dans ce tableau, $C$ désigne une constante réelle. Chaque formule est valable sur **un intervalle du domaine indiqué**.

| Fonction $f(x)$ | Primitives $F(x)$ | Domaine ou condition |
| --- | --- | --- |
| $a$, avec $a\in\mathbb R$ | $ax+C$ | $\mathbb R$ |
| $x^n$, $n\in\mathbb N^*$ | $\dfrac{x^{n+1}}{n+1}+C$ | $\mathbb R$ |
| $\dfrac1{x^n}$, $n\ge2$ entier | $-\dfrac1{(n-1)x^{n-1}}+C$ | $]-\infty;0[$ ou $]0;+\infty[$ |
| $\dfrac1{\sqrt x}$ | $2\sqrt x+C$ | $]0;+\infty[$ |
| $x^r$, $r\in\mathbb Q$, $r\ne-1$ | $\dfrac{x^{r+1}}{r+1}+C$ | $]0;+\infty[$ ; extension en $0$ si $r>0$ |
| $\sin x$ | $-\cos x+C$ | $\mathbb R$ |
| $\cos x$ | $\sin x+C$ | $\mathbb R$ |
| $1+\tan^2x=\dfrac1{\cos^2x}$ | $\tan x+C$ | $]-\pi/2+k\pi;\pi/2+k\pi[$, $k\in\mathbb Z$ |

Pour une puissance, on **augmente l’exposant de 1, puis on divise par le nouvel exposant**. Il faut donc exclure $r=-1$ de cette formule.

Par exemple, pour $1/x^3=x^{-3}$ :

$$\frac{x^{-2}}{-2}=-\frac1{2x^2}.$$

On contrôle le signe en dérivant : $(-x^{-2}/2)'=x^{-3}$.`,
    }],
  },
  {
    id: "primitive-operations-section", numeral: "IV", title: "Opérations sur les primitives",
    topics: [
      {
        id: "primitive-linearity-summary", title: "Somme et multiplication par un réel", pages: [84],
        legacyLessonIds: ["primitive-linearity"],
        body: String.raw`Soient $F$ une primitive de $f$ et $G$ une primitive de $g$ sur un même intervalle $I$.

- **Somme :** $F+G$ est une primitive de $f+g$, car $(F+G)'=F'+G'=f+g$.
- **Multiplication par un réel :** pour $k\in\mathbb R$, $kF$ est une primitive de $kf$, car $(kF)'=kF'=kf$.

On peut donc calculer la primitive d’une somme **terme à terme**. Pour donner toutes les primitives de la somme, une seule constante finale $C$ suffit.`,
      },
      {
        id: "primitive-composites-summary", title: "Reconnaître une dérivée composée", pages: [85],
        legacyLessonIds: ["composite-primitives", "bus-cost-mission", "official-applications-workshop", "radical-coefficients-reinforcement", "derivative-links-reinforcement", "composite-reinforcement-workshop", "advanced-primitives-mission"],
        body: String.raw`Soit $u$ une fonction dérivable sur l’intervalle $I$. On reconnaît **une expression en $u$ accompagnée de sa dérivée $u'$**.

| Fonction à primitiver | Une primitive | Conditions sur $I$ |
| --- | --- | --- |
| $u'u^n$, $n\ge1$ entier | $\dfrac{u^{n+1}}{n+1}$ | $u$ dérivable |
| $\dfrac{u'}{\sqrt u}$ | $2\sqrt u$ | $u>0$ |
| $u'u^r$, $r\in\mathbb Q$, $r\ne-1$ | $\dfrac{u^{r+1}}{r+1}$ | $u>0$ pour cette formule générale |
| $u'\cos u$ | $\sin u$ | $u$ dérivable |
| $u'\sin u$ | $-\cos u$ | $u$ dérivable |
| $u'(1+\tan^2u)=\dfrac{u'}{\cos^2u}$ | $\tan u$ | $\cos u\ne0$ |
| $\dfrac{u'}{u^n}$, $n\ge2$ entier | $-\dfrac1{(n-1)u^{n-1}}$ | $u\ne0$ |

Pour obtenir toutes les primitives, on ajoute $C\in\mathbb R$.

**Méthode :** nommer $u$, calculer $u'$, ajuster si nécessaire un coefficient constant, puis utiliser le tableau. On ne peut pas oublier $u'$ : une primitive de $\cos(3x)$ est $\sin(3x)/3$, car la dérivée de $3x$ vaut $3$.`,
        examples: [{ id: "primitive-composite-examples", title: "Trois applications du tableau",
          prompt: "Déterminons les primitives sur les intervalles indiqués.",
          parts: [
            { id: "primitive-power-example", label: "a)", prompt: String.raw`$f(x)=2x(1+x^2)^3$ sur $\mathbb R$.`, solution: String.raw`Posons $u(x)=1+x^2$. Alors $u'(x)=2x$ et $f=u'u^3$. Le tableau donne :

$$\boxed{F(x)=\frac{(1+x^2)^4}{4}+C.}$$

Vérification : $F'(x)=\frac14\times4(1+x^2)^3\times2x=2x(1+x^2)^3$.` },
            { id: "primitive-sine-denominator-example", label: "b)", prompt: String.raw`$f(x)=\dfrac{\cos x}{\sin^2x}$ sur $]-\pi/2;0[$.`, solution: String.raw`Posons $u(x)=\sin x$, donc $u'(x)=\cos x$. Sur cet intervalle, $\sin x$ n’est jamais nul. On reconnaît $u'/u^2$, dont une primitive est $-1/u$ :

$$\boxed{F(x)=-\frac1{\sin x}+C.}$$

En effet, $(-1/u)'=u'/u^2$.` },
            { id: "primitive-root-example", label: "c)", prompt: String.raw`$f(x)=\dfrac3{\sqrt{3x+5}}$ sur $]-5/3;+\infty[$.`, solution: String.raw`Posons $u(x)=3x+5$. Alors $u'(x)=3$ et $u(x)>0$ sur l’intervalle. On reconnaît $u'/\sqrt u$ :

$$\boxed{F(x)=2\sqrt{3x+5}+C.}$$

Vérifions bien le coefficient $2$ :

$$F'(x)=2\times\frac3{2\sqrt{3x+5}}=\frac3{\sqrt{3x+5}}=f(x).$$` },
          ],
        }],
      },
    ],
  },
];
