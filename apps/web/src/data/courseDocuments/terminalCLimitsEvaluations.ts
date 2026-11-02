import type { CourseEvaluationGroup } from "../../domain/courseDocument";

/** Actual questions from L1.pdf, pages PDF 15–17, with fully worked solutions. */
export const terminalCLimitsEvaluations: CourseEvaluationGroup[] = [
  {
    id: "indeterminate-forms", pages: [15],
    title: "Lever une forme indéterminée",
    method: String.raw`Quand les opérations sur les limites conduisent à une forme indéterminée, on peut :

1. **Factoriser** pour simplifier ou faire apparaître un facteur dominant.
2. Multiplier par une **expression conjuguée**.
3. Reconnaître un **nombre dérivé** : $\dfrac{u(x)-u(a)}{x-a}\to u'(a)$.
4. **Changer d’écriture** pour retrouver une limite de référence.

On commence toujours par identifier la difficulté, puis on transforme l’expression sur son domaine avant de calculer sa limite.`,
    examples: [
      {
        id: "indeterminate-worked-a", title: "a · Factorisation",
        prompt: String.raw`Calcule $\lim_{x\to+\infty}(x-2\sqrt x)$.`,
        solution: String.raw`**Utilisons une factorisation.** Les termes $x$ et $-2\sqrt x$ ont pour limites $+\infty$ et $-\infty$ : on ne peut pas conclure directement.

Pour $x\ge0$, on écrit :

$$x-2\sqrt x=\sqrt x(\sqrt x-2).$$

On a :

$$\lim_{x\to+\infty}\sqrt x=+\infty,\qquad
\lim_{x\to+\infty}(\sqrt x-2)=+\infty.$$

Par la règle du produit :

$$\boxed{\lim_{x\to+\infty}(x-2\sqrt x)=+\infty.}$$
`,
      },
      {
        id: "indeterminate-worked-b", title: "b · Expression conjuguée",
        prompt: String.raw`Calcule $\lim_{x\to-\infty}(2x+\sqrt{4x^2+5})$.`,
        solution: String.raw`**Utilisons l’expression conjuguée.** On note $A(x)=2x+\sqrt{4x^2+5}$.

Pour $x<0$, on multiplie et on divise par $2x-\sqrt{4x^2+5}$. L’identité $(u+v)(u-v)=u^2-v^2$ donne :

$$A(x)=\frac{(2x)^2-(4x^2+5)}{2x-\sqrt{4x^2+5}}.$$

Au numérateur, $4x^2-4x^2-5=-5$. Donc :

$$A(x)=\frac{-5}{2x-\sqrt{4x^2+5}}.$$

Or :

$$\lim_{x\to-\infty}\left(2x-\sqrt{4x^2+5}\right)=-\infty.$$

Le numérateur est constant et le dénominateur tend vers $-\infty$. **Donc la limite de $A$ en $-\infty$ est $0$.**`,
      },
      {
        id: "indeterminate-worked-c", title: "c · Nombre dérivé",
        prompt: String.raw`Calcule $\lim_{x\to\pi}\dfrac{\cos x+1}{x-\pi}$.`,
        solution: String.raw`**Utilisons la définition du nombre dérivé.** Comme $\cos\pi=-1$, on écrit :

$$\frac{\cos x+1}{x-\pi}=\frac{\cos x-\cos\pi}{x-\pi}.$$

La fonction cosinus est dérivable en $\pi$. Par définition :

$$\lim_{x\to\pi}\frac{\cos x-\cos\pi}{x-\pi}=\cos'(\pi).$$

Or $\cos'(\pi)=-\sin\pi=0$. **Donc la limite demandée vaut $0$.**`,
      },
      {
        id: "indeterminate-worked-d", title: "d · Changement d’écriture",
        prompt: String.raw`Calcule $\lim_{x\to0}\dfrac{\sin x}{x^5}$.`,
        solution: String.raw`**Utilisons un changement d’écriture.** Pour $x\ne0$ :

$$\frac{\sin x}{x^5}=\frac{\sin x}{x}\times\frac1{x^4}.$$

On a :

$$\lim_{x\to0}\frac{\sin x}{x}=1,\qquad
\lim_{x\to0}\frac1{x^4}=+\infty.$$

Par la règle du produit :

$$\boxed{\lim_{x\to0}\frac{\sin x}{x^5}=+\infty.}$$
`,
      },
    ],
    questions: [
      {
        id: "indeterminate-a", label: "1.a", points: 1, topicId: "reference-limits",
        prompt: String.raw`Calcule $\displaystyle\lim_{x\to0}\frac{x}{\tan x}$.`,
        answer: { kind: "short", accepted: ["1"] }, expected: "$1$",
        correction: String.raw`**Utilisons un changement d’écriture**, afin de faire apparaître la limite de référence $\sin x/x$.

Au voisinage de $0$, pour $x\ne0$ :

$$\frac{x}{\tan x}=\frac{x\cos x}{\sin x}=\frac{\cos x}{\sin x/x}.$$

Or $\lim_{x\to0}\cos x=1$ et $\lim_{x\to0}\frac{\sin x}{x}=1$. La limite du dénominateur est non nulle.

Par la règle du quotient :

$$\boxed{\lim_{x\to0}\frac{x}{\tan x}=\frac11=1.}$$
`,
      },
      {
        id: "indeterminate-b", label: "1.b", points: 1, topicId: "limit-operations",
        prompt: String.raw`Calcule $\displaystyle\lim_{x\to\pi/2}\frac{1-\sin x}{x-\pi/2}$.`,
        answer: { kind: "short", accepted: ["0"] }, expected: "$0$",
        correction: String.raw`**Utilisons la définition du nombre dérivé**, comme dans l’exemple avec le cosinus.

Comme $\sin(\pi/2)=1$, on écrit :

$$\frac{1-\sin x}{x-\pi/2}=-\frac{\sin x-\sin(\pi/2)}{x-\pi/2}.$$

La fonction sinus est dérivable en $\pi/2$. La limite du quotient de droite est donc l’opposé de son nombre dérivé en ce point :

$$-\sin'(\pi/2)=-\cos(\pi/2)=0.$$

**Donc la limite demandée est $0$.**`,
      },
      {
        id: "indeterminate-c", label: "1.c", points: 1, topicId: "composition-limit",
        prompt: String.raw`Calcule $\displaystyle\lim_{x\to-\infty}\frac{2x+\sqrt{1+x^2}}x$.`,
        answer: { kind: "short", accepted: ["1"] }, expected: "$1$",
        correction: String.raw`**Mettons $x^2$ en facteur sous la racine.** Pour $x<0$ :

$$\sqrt{1+x^2}=\sqrt{x^2\left(1+\frac1{x^2}\right)}
=-x\sqrt{1+\frac1{x^2}},$$

car $\sqrt{x^2}=\lvert x\rvert=-x$.

Le quotient devient alors :

$$\frac{2x+\sqrt{1+x^2}}x=2-\sqrt{1+\frac1{x^2}}.$$

Comme $1/x^2\to0$ en $-\infty$, la racine tend vers $1$.

**Donc la limite cherchée est $2-1=1$.**`,
      },
    ],
  },
  {
    id: "radicals-at-infinity", pages: [16],
    title: "Calculer une limite avec des radicaux",
    method: String.raw`Pour une limite en $+\infty$ ou $-\infty$ contenant des radicaux :

1. Mets en facteur la puissance dominante sous le radical.
2. Utilise $\sqrt{x^2}=\lvert x\rvert$ : $\lvert x\rvert=x$ si $x>0$, et $\lvert x\rvert=-x$ si $x<0$.
3. Si une différence de deux termes dominants reste indéterminée, utilise l’expression conjuguée.

On peut combiner factorisation et conjuguée.`,
    examples: [{
      id: "radicals-worked", title: String.raw`Tenir compte du signe en $-\infty$`,
      prompt: String.raw`Calcule $\lim_{x\to-\infty}(\sqrt{2x^2-1}+x)$.`,
      solution: String.raw`**Mettons $x^2$ en facteur sous le radical.** Pour $x<-\sqrt2/2$, on a :

$$\sqrt{2x^2-1}=\lvert x\rvert\sqrt{2-\frac1{x^2}}.$$

Comme $x<0$, $\lvert x\rvert=-x$. Ainsi :

$$\sqrt{2x^2-1}+x
=x\left(1-\sqrt{2-\frac1{x^2}}\right).$$

Or :

$$\lim_{x\to-\infty}\left(1-\sqrt{2-\frac1{x^2}}\right)
=1-\sqrt2<0.$$

Le facteur $x$ tend vers $-\infty$ et l’autre facteur a une limite strictement négative. Par la règle du produit :

$$\boxed{\lim_{x\to-\infty}\left(\sqrt{2x^2-1}+x\right)=+\infty.}$$
`,
    }],
    questions: [
      {
        id: "radicals-a", label: "2.a", points: 1, topicId: "composition-limit",
        prompt: String.raw`Calcule $\displaystyle\lim_{x\to+\infty}(\sqrt{4x^2+3}-5x)$.`,
        answer: { kind: "short", accepted: ["-∞", "-infini", "-infinity"] }, expected: "$-\\infty$",
        correction: String.raw`**Mettons $x^2$ en facteur sous le radical.** En $+\infty$, on travaille avec $x>0$, donc $\sqrt{x^2}=x$.

On obtient :

$$\sqrt{4x^2+3}-5x=x\left(\sqrt{4+\frac3{x^2}}-5\right).$$

Or $\lim_{x\to+\infty}x=+\infty$ et :

$$\lim_{x\to+\infty}\left(\sqrt{4+\frac3{x^2}}-5\right)=2-5=-3<0.$$

Par la règle du produit :

$$\boxed{\lim_{x\to+\infty}\left(\sqrt{4x^2+3}-5x\right)=-\infty.}$$
`,
      },
      {
        id: "radicals-b", label: "2.b", points: 1, topicId: "limit-operations",
        prompt: String.raw`Calcule $\displaystyle\lim_{x\to-\infty}(\sqrt{9x^2-2}+3x)$.`,
        answer: { kind: "short", accepted: ["0"] }, expected: "$0$",
        correction: String.raw`Les deux termes ont pour limites $+\infty$ et $-\infty$. **Utilisons l’expression conjuguée.**

Notons $B(x)=\sqrt{9x^2-2}+3x$. Pour $x$ négatif assez grand en valeur absolue, on multiplie et on divise par $\sqrt{9x^2-2}-3x$ :

$$B(x)=\frac{9x^2-2-(3x)^2}{\sqrt{9x^2-2}-3x}
=\frac{-2}{\sqrt{9x^2-2}-3x}.$$

Or, en $-\infty$, $\sqrt{9x^2-2}\to+\infty$ et $-3x\to+\infty$. Le dénominateur tend donc vers $+\infty$.

**Par la règle du quotient, la limite de $B$ en $-\infty$ est $0$.**`,
      },
    ],
  },
  {
    id: "root-bracketing", pages: [16, 17],
    title: "Encadrer une solution de f(x) = 0",
    method: String.raw`On vérifie d’abord que $f$ est continue sur $[a;b]$, que $f(a)$ et $f(b)$ sont de signes contraires, puis que $f$ est strictement monotone si l’on veut prouver l’unicité de la solution.

### Balayage

On calcule successivement $f(a+0{,}1)$, $f(a+0{,}2)$, etc. On s’arrête dès que le signe change entre deux valeurs consécutives. Pour des centièmes, on recommence avec un pas de $0{,}01$ dans le dixième trouvé.

### Dichotomie

1. Calcule le milieu $m=(a+b)/2$ et $f(m)$.
2. Si $f(m)=0$, la solution est exactement $m$.
3. Sinon, garde la moitié où les valeurs aux bornes sont de signes contraires.
4. Répète jusqu’à obtenir la précision souhaitée.

À chaque étape, la largeur de l’intervalle est divisée par deux. Pour annoncer des décimaux consécutifs, vérifie ensuite le changement de signe aux deux décimaux demandés.`,
    examples: [{
      id: "bracketing-worked", title: "Deux méthodes pour la même racine",
      prompt: String.raw`L’équation $x^3+2x+2=0$ admet une solution unique $\alpha\in]-1;0[$. Détermine un encadrement par deux dixièmes consécutifs.`,
      parts: [
        {
          id: "bracketing-by-sweep", label: "1)", prompt: "Méthode de balayage.",
          solution: String.raw`Posons $f(x)=x^3+2x+2$. Calculons ses valeurs par pas de $0{,}1$ à partir de $-1$ :

| $x$ | $-0{,}9$ | $-0{,}8$ | $-0{,}7$ |
| --- | --- | --- | --- |
| $f(x)$ | $-0{,}529$ | $-0{,}112$ | $0{,}257$ |

On s’arrête car $f(-0{,}8)$ et $f(-0{,}7)$ sont de signes contraires. Comme la solution est unique et $f$ est continue :

$$\boxed{-0{,}8<\alpha<-0{,}7.}$$

Les bornes sont bien deux dixièmes consécutifs.`,
        },
        {
          id: "bracketing-by-bisection", label: "2)", prompt: "Méthode de dichotomie.",
          solution: String.raw`Posons à nouveau $f(x)=x^3+2x+2$. On part de $]-1;0[$, avec $f(-1)=-1<0$ et $f(0)=2>0$.

À chaque étape, on calcule le milieu et on garde la moitié où le signe change :

| Intervalle de départ | Milieu | Signe de $f$ au milieu | Intervalle conservé |
| --- | --- | --- | --- |
| $]-1;0[$ | $-0{,}5$ | $+$ | $]-1;-0{,}5[$ |
| $]-1;-0{,}5[$ | $-0{,}75$ | $+$ | $]-1;-0{,}75[$ |
| $]-1;-0{,}75[$ | $-0{,}875$ | $-$ | $]-0{,}875;-0{,}75[$ |
| $]-0{,}875;-0{,}75[$ | $-0{,}8125$ | $-$ | $]-0{,}8125;-0{,}75[$ |
| $]-0{,}8125;-0{,}75[$ | $-0{,}78125$ | $-$ | $]-0{,}78125;-0{,}75[$ |

Par exemple, le premier milieu est $m=(-1+0)/2=-0{,}5$. On a $f(-0{,}5)=0{,}875>0$ : la solution reste donc entre $-1$ et $-0{,}5$.

Après les cinq étapes du tableau, on obtient $-0{,}78125<\alpha<-0{,}75$. Cet intervalle est inclus dans $]-0{,}8;-0{,}7[$.

**On conclut donc, là encore :**

$$\boxed{-0{,}8<\alpha<-0{,}7.}$$
`,
        },
      ],
    }],
    questions: [
      {
        id: "bracketing-beta", label: "3.1", points: 2, topicId: "intermediate-value",
        prompt: String.raw`L’équation $\frac65x^5-4x^3+1=0$ admet une solution unique $\beta\in]0;1[$. Encadre $\beta$ par deux dixièmes consécutifs.`,
        answer: { kind: "interval", lower: 0.6, upper: 0.7, variable: "β" },
        expected: "$0{,}6<\\beta<0{,}7$",
        correction: String.raw`### a) Vérifier l’existence et l’unicité

Posons $h(x)=\frac65x^5-4x^3+1$. C’est une fonction polynôme, donc elle est continue sur $[0;1]$. On a :

$$h(0)=1>0,\qquad h(1)=\frac65-4+1=-1{,}8<0.$$

Par le théorème des valeurs intermédiaires, $h$ s’annule au moins une fois dans $]0;1[$. De plus, pour $0<x<1$ :

$$h'(x)=6x^4-12x^2=6x^2(x^2-2)<0.$$

En effet, $x^2>0$ et $x^2-2<0$. La fonction est donc strictement décroissante : **la solution $\beta$ est unique**.

### b) Encadrer par deux dixièmes consécutifs

Calculons les valeurs aux bornes $0{,}6$ et $0{,}7$ :

$$h(0{,}6)=\frac65\times(0{,}6)^5-4\times(0{,}6)^3+1
=0{,}229312>0.$$

$$h(0{,}7)=\frac65\times(0{,}7)^5-4\times(0{,}7)^3+1
=-0{,}170316<0.$$

Le signe change entre $0{,}6$ et $0{,}7$. Par continuité et unicité :

$$\boxed{0{,}6<\beta<0{,}7.}$$

Les deux bornes sont bien deux dixièmes consécutifs.`,
      },
      {
        id: "bracketing-alpha", label: "3.2.b", points: 2, topicId: "intermediate-value",
        prompt: String.raw`Pour l’unique solution $\alpha\in]0;1[$ de $2x^3+5x-1=0$, donne un encadrement par deux centièmes consécutifs.`,
        answer: { kind: "interval", lower: 0.19, upper: 0.2, variable: "α" },
        expected: "$0{,}19<\\alpha<0{,}20$",
        correction: String.raw`### a) Vérifier l’existence et l’unicité

Posons $g(x)=2x^3+5x-1$. C’est une fonction polynôme, donc elle est continue sur $[0;1]$. On a $g(0)=-1<0$ et $g(1)=6>0$ : le théorème des valeurs intermédiaires donne l’existence d’une solution dans $]0;1[$.

Pour tout réel $x$, $g'(x)=6x^2+5>0$. La fonction est strictement croissante, donc cette solution est unique.

### b) Encadrer par deux centièmes consécutifs

Calculons les valeurs aux bornes $0{,}19$ et $0{,}20$ en remplaçant $x$ dans l’expression de $g$ :

$$g(0{,}19)=2\times(0{,}19)^3+5\times0{,}19-1
=-0{,}036282<0.$$

$$g(0{,}20)=2\times(0{,}20)^3+5\times0{,}20-1
=0{,}016>0.$$

Le signe change entre les deux bornes. Par continuité et unicité :

$$\boxed{0{,}19<\alpha<0{,}20.}$$

Ce sont bien deux centièmes consécutifs.`,
      },
    ],
    writtenTasks: [{
      id: "alpha-existence-uniqueness",
      beforeQuestionId: "bracketing-alpha",
      topicId: "intermediate-value",
      prompt: String.raw`3.2.a · Justifie que l’équation $2x^3+5x-1=0$ possède une solution unique $\alpha\in]0;1[$.`,
      criteria: [
        "Justifier la continuité de la fonction sur [0 ; 1].",
        "Calculer les valeurs aux bornes et constater le changement de signe.",
        "Appliquer le théorème des valeurs intermédiaires pour l’existence.",
        "Prouver la stricte croissance pour l’unicité.",
      ],
      model: String.raw`Soit $g(x)=2x^3+5x-1$. C’est une fonction polynôme, donc elle est continue sur $[0;1]$.

On a $g(0)=-1<0$ et $g(1)=6>0$. D’après le théorème des valeurs intermédiaires, il existe au moins un $\alpha\in]0;1[$ tel que $g(\alpha)=0$.

Pour tout $x\in\mathbb R$, $g'(x)=6x^2+5>0$. La fonction est donc strictement croissante : elle s’annule au plus une fois.

Il existe ainsi **une unique solution $\alpha\in]0;1[$**.`,
    }],
  },
];
