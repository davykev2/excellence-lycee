import type { CourseDocumentSection } from "../../domain/courseDocument";

/** Pyramide Terminale C, tome 1 : folios 57–62, pages PDF 59–64. */
export const terminalCDerivativesSummary: CourseDocumentSection[] = [
  {
    id: "lateral-differentiability", numeral: "I", title: "Dérivabilité à gauche et à droite",
    topics: [
      {
        id: "lateral-derivatives", title: "Nombres dérivés et demi-tangentes", pages: [59],
        legacyLessonIds: ["one-sided-derivatives", "derivative-at-junction"],
        body: String.raw`### Définitions

Soit $f$ une fonction définie sur un intervalle ouvert $I$ et $a\in I$.

- $f$ est **dérivable à gauche en $a$** si la limite ci-dessous existe et est un nombre réel. On l’appelle le nombre dérivé à gauche :

$$f'_g(a)=\lim_{x\to a^-}\frac{f(x)-f(a)}{x-a}.$$

- $f$ est **dérivable à droite en $a$** si la limite ci-dessous existe et est un nombre réel. C’est le nombre dérivé à droite :

$$f'_d(a)=\lim_{x\to a^+}\frac{f(x)-f(a)}{x-a}.$$

La **demi-tangente** correspondante passe par $A(a;f(a))$ et a pour coefficient directeur le nombre dérivé du côté étudié. Sa droite support a donc pour équation :

$$y=f(a)+f'_g(a)(x-a)$$

à gauche, ou $y=f(a)+f'_d(a)(x-a)$ à droite.

### Propriété

$f$ est dérivable en $a$ **si et seulement si** ses deux nombres dérivés latéraux existent, sont **finis** et sont **égaux**. Dans ce cas :

$$f'(a)=f'_g(a)=f'_d(a).$$

Si les deux valeurs sont différentes, $f$ n’est pas dérivable en $a$. Une limite infinie n’est pas un nombre dérivé.`,
        examples: [{
          id: "matching-derivatives", title: "Deux expressions raccordées en 1",
          prompt: String.raw`Soit $f$ définie sur $\mathbb R$ par $f(x)=2x$ si $x<1$, et $f(x)=x^2+1$ si $x\ge1$. Étudions sa dérivabilité en $1$ et déterminons la tangente.`,
          parts: [
            { id: "matching-left", label: "a)", prompt: "Calcul à gauche de 1.", solution: String.raw`On a $f(1)=2$. Pour $x<1$ :

$$\frac{f(x)-f(1)}{x-1}=\frac{2x-2}{x-1}=2.$$

Donc $f'_g(1)=2$.` },
            { id: "matching-right", label: "b)", prompt: "Calcul à droite de 1.", solution: String.raw`Pour $x>1$, on utilise l’expression $x^2+1$ :

$$\frac{f(x)-f(1)}{x-1}=\frac{x^2-1}{x-1}=x+1.$$

La simplification est permise car $x\ne1$. Lorsque $x\to1^+$, $x+1\to2$. Donc $f'_d(1)=2$.` },
            { id: "matching-conclusion", label: "c)", prompt: "Conclusion et tangente.", solution: String.raw`Les deux nombres dérivés sont finis et égaux. **Donc $f$ est dérivable en $1$ et $f'(1)=2$.**

La tangente en $A(1;2)$ a pour équation :

$$y=f(1)+f'(1)(x-1)=2+2(x-1)=2x.$$` },
          ],
        }],
        detail: String.raw`Dans une fonction par morceaux, commence par repérer **la formule qui donne $f(a)$**, puis la formule valable à chaque côté. Les deux taux d’accroissement utilisent la même valeur $f(a)$. On ne remplace pas le nombre dérivé par la limite de $f'(x)$ sans justification.`,
      },
      {
        id: "vertical-tangent", title: "Tangente verticale", pages: [59, 60],
        legacyLessonIds: ["vertical-half-tangent"],
        body: String.raw`### Propriété

Soit $f$ définie sur un intervalle ouvert contenant $a$, et **continue en $a$**. Si :

$$\lim_{x\to a}\frac{f(x)-f(a)}{x-a}=+\infty$$

ou si cette limite vaut $-\infty$, sa courbe admet en $A(a;f(a))$ une **tangente verticale**, d’équation $x=a$.

La courbe possède une tangente, mais $f$ **n’est pas dérivable en $a$ au sens d’un nombre dérivé réel**.`,
        examples: [{
          id: "signed-root-tangent", title: "Une tangente verticale en l’origine",
          prompt: String.raw`Soit $f(x)=\sqrt x$ pour $x\ge0$, et $f(x)=-\sqrt{-x}$ pour $x<0$. Justifions que sa courbe admet une tangente verticale en $O$.`,
          parts: [
            { id: "signed-root-continuity", label: "a)", prompt: "Vérifier la continuité en 0.", solution: String.raw`On a $f(0)=0$. À droite, $\sqrt x\to0$. À gauche, $-\sqrt{-x}\to0$. Les deux limites sont égales à $f(0)$ : **$f$ est continue en $0$**.` },
            { id: "signed-root-right", label: "b)", prompt: "Calculer le taux à droite.", solution: String.raw`Pour $x>0$ :

$$\frac{f(x)-f(0)}{x-0}=\frac{\sqrt x}{x}=\frac1{\sqrt x}.$$

Le dénominateur tend vers $0$ en restant positif. Le taux tend donc vers $+\infty$.` },
            { id: "signed-root-left", label: "c)", prompt: "Calculer le taux à gauche et conclure.", solution: String.raw`Pour $x<0$, on a $x=-(\sqrt{-x})^2$, donc :

$$\frac{-\sqrt{-x}}x=\frac1{\sqrt{-x}}\longrightarrow+\infty.$$

Le taux d’accroissement tend vers $+\infty$ des deux côtés et $f$ est continue en $0$. **La droite $x=0$ est donc tangente à la courbe en $O$.**` },
          ],
        }],
        interaction: {
          kind: "curve", eyebrow: "Observer", title: "Une pente qui devient verticale",
          instruction: "Rapproche le point de l’origine, à gauche puis à droite.",
          observation: "Le taux d’accroissement augmente sans borne des deux côtés ; la tangente en O est l’axe vertical.",
          formula: "f(x) = signe(x) × √|x|", formulaTex: String.raw`f(x)=\begin{cases}\sqrt x&x\ge0\\-\sqrt{-x}&x<0\end{cases}`,
          rule: { kind: "samples", points: Array.from({ length: 161 }, (_, index): [number, number] => {
            const t = (index - 80) / 40;
            return [Math.sign(t) * t * t, t];
          }) },
          window: { xMin: -4, xMax: 4, yMin: -2.5, yMax: 2.5 },
          guides: [{ kind: "vertical", value: 0, label: "Tangente x = 0" }],
          marker: { min: -4, max: 4, step: 0.01, initial: 1 },
        },
      },
      {
        id: "vertical-half-tangents-summary", title: "Demi-tangentes verticales", pages: [60],
        body: String.raw`### Propriétés

On étudie la limite du taux $\dfrac{f(x)-f(a)}{x-a}$ **du côté où la fonction est définie**, en vérifiant sa continuité de ce côté.

| Côté étudié | Limite du taux | Sens de la demi-tangente verticale |
| --- | --- | --- |
| À gauche de $a$ | $+\infty$ | Vers le bas |
| À gauche de $a$ | $-\infty$ | Vers le haut |
| À droite de $a$ | $+\infty$ | Vers le haut |
| À droite de $a$ | $-\infty$ | Vers le bas |

Dans les quatre cas, la droite support a pour équation $x=a$.`,
        examples: [{
          id: "negative-root-half-tangent", title: "Une demi-tangente dirigée vers le bas",
          prompt: String.raw`Étudions en $0$ la courbe de $f(x)=-\sqrt x$, définie sur $[0;+\infty[$.`,
          solution: String.raw`La fonction est continue à droite en $0$ et $f(0)=0$. Pour $x>0$ :

$$\frac{f(x)-f(0)}{x}=-\frac1{\sqrt x}\longrightarrow-\infty.$$

On est **à droite** et le taux tend vers **$-\infty$**. La courbe admet donc en $O$ une **demi-tangente verticale dirigée vers le bas**.`,
        }],
        detail: String.raw`Pour retenir le sens, regarde $f(x)-f(a)$. À droite, $x-a>0$ : son signe est celui du taux. À gauche, $x-a<0$ : il est de signe contraire. Une ordonnée inférieure à $f(a)$ correspond au bas, une ordonnée supérieure au haut.`,
      },
      {
        id: "closed-interval-derivative", title: "Dérivabilité sur un intervalle fermé", pages: [61],
        legacyLessonIds: ["derivative-on-interval-and-rules"],
        body: String.raw`### Définitions

Soit $f$ définie sur $[a;b]$, avec $a<b$.

- $f$ est **dérivable sur $]a;b[$** si elle est dérivable en chaque point de cet intervalle ouvert.
- $f$ est **dérivable sur $[a;b]$** si elle est dérivable sur $]a;b[$, dérivable **à droite en $a$** et dérivable **à gauche en $b$**.

On ne demande pas de valeurs à l’extérieur de l’intervalle aux deux extrémités.`,
        examples: [{
          id: "closed-interval-example", title: "Étudier les deux extrémités séparément",
          prompt: String.raw`Soit $f(x)=(x-1)\sqrt{x-1}$ pour $x\in[1;2]$. Justifions sa dérivabilité sur $[1;2]$.`,
          parts: [
            { id: "closed-right-one", label: "a)", prompt: "À droite de 1.", solution: String.raw`On a $f(1)=0$. Pour $x>1$ :

$$\frac{f(x)-f(1)}{x-1}=\sqrt{x-1}\longrightarrow0.$$

Donc $f'_d(1)=0$.` },
            { id: "closed-left-two", label: "b)", prompt: "À gauche de 2.", solution: String.raw`On a $f(2)=1$. Pour $1<x<2$, multiplions par la conjuguée :

$$\frac{(x-1)\sqrt{x-1}-1}{x-2}
=\frac{(x-1)^3-1}{(x-2)((x-1)\sqrt{x-1}+1)}.$$

Or $u^3-1=(u-1)(u^2+u+1)$ avec $u=x-1$. Ainsi :

$$(x-1)^3-1=(x-2)(x^2-x+1).$$

Après simplification par $x-2\ne0$, le taux devient :

$$\frac{x^2-x+1}{(x-1)\sqrt{x-1}+1}\longrightarrow\frac32.$$

Donc $f'_g(2)=3/2$.` },
            { id: "closed-interior", label: "c)", prompt: "Sur tout l’intervalle.", solution: String.raw`Sur $]1;2[$, $f$ est un produit de deux fonctions dérivables. Elle est aussi dérivable à droite en $1$ et à gauche en $2$. **Donc $f$ est dérivable sur $[1;2]$.**` },
          ],
        }],
      },
    ],
  },
  {
    id: "composed-inverse-derivatives", numeral: "II", title: "Dérivée d’une fonction composée",
    topics: [
      {
        id: "chain-rule", title: "Dérivée de la composée de deux fonctions", pages: [61],
        legacyLessonIds: ["derivative-composition"],
        body: String.raw`### Propriété en un point

Soit $f$ définie sur $I$ et $g$ définie sur un intervalle $J$ contenant $f(I)$.

Si $f$ est dérivable en $a\in I$ et $g$ est dérivable en $f(a)$, alors $g\circ f$ est dérivable en $a$ et :

$$(g\circ f)'(a)=f'(a)\,g'(f(a)).$$

### Propriété sur un intervalle

Si $f$ est dérivable sur $I$ et $g$ sur $J$, alors $g\circ f$ est dérivable sur $I$ et :

$$(g\circ f)'=f'\times(g'\circ f).$$

On dérive la fonction extérieure **en conservant l’expression intérieure**, puis on multiplie par la dérivée de cette expression.`,
        examples: [{
          id: "cos-reciprocal-example", title: "Dériver un cosinus composé",
          prompt: String.raw`Pour $x>0$, on pose $h(x)=\cos\!\left(\dfrac2x\right)$. Calculons $h'(x)$.`,
          solution: String.raw`L’expression intérieure est $u(x)=2/x$, dérivable sur $]0;+\infty[$, avec $u'(x)=-2/x^2$. La fonction extérieure est le cosinus, dérivable sur $\mathbb R$.

Par la propriété de dérivation d’une composée :

$$h'(x)=u'(x)\bigl(-\sin(u(x))\bigr).$$

On remplace chaque terme :

$$h'(x)=\left(-\frac2{x^2}\right)\left(-\sin\frac2x\right).$$

Les deux signes moins se compensent. Donc :

$$\boxed{h'(x)=\frac2{x^2}\sin\frac2x\quad(x>0).}$$`,
        }],
      },
      {
        id: "usual-composites", title: "Racine, puissance, sinus et cosinus d’une fonction", pages: [62],
        body: String.raw`### Propriétés

Soit $u$ une fonction dérivable sur un intervalle $I$.

| Fonction | Hypothèses supplémentaires | Dérivée |
| --- | --- | --- |
| $u^r$, avec $r\in\mathbb Q\setminus\{0;1\}$ | $u(x)>0$ sur $I$ | $r\,u'(x)\,u(x)^{r-1}$ |
| $\sqrt u$ | $u(x)>0$ sur $I$ | $\dfrac{u'(x)}{2\sqrt{u(x)}}$ |
| $\sin u$ | — | $u'(x)\cos(u(x))$ |
| $\cos u$ | — | $-u'(x)\sin(u(x))$ |

La condition $u>0$ permet d’appliquer les formules de la racine et des puissances rationnelles sans difficulté de domaine. Pour une puissance entière, des domaines plus larges peuvent être possibles.`,
        examples: [{
          id: "root-composite-example", title: "Dériver une racine composée",
          prompt: String.raw`Soit $f(x)=\sqrt{4-x^2}$ sur $]-2;2[$. Calculons $f'(x)$.`,
          solution: String.raw`Posons $u(x)=4-x^2$. Sur $]-2;2[$, $u(x)>0$, $u$ est dérivable et $u'(x)=-2x$. Son image est $]0;4]$, un intervalle où la racine carrée est dérivable.

La formule de la racine composée donne :

$$f'(x)=\frac{u'(x)}{2\sqrt{u(x)}}=\frac{-2x}{2\sqrt{4-x^2}}.$$

Donc :

$$\boxed{f'(x)=-\frac{x}{\sqrt{4-x^2}}\quad(-2<x<2).}$$`,
        }],
        detail: String.raw`Le domaine de définition n’est pas toujours le domaine de dérivabilité. Ici $\sqrt{4-x^2}$ existe aussi en $-2$ et $2$, mais la formule de sa dérivée contient un dénominateur nul à ces deux points. On les étudie séparément avec les taux latéraux.`,
      },
      {
        id: "inverse-derivative-summary", title: "Nombre dérivé d’une bijection réciproque", pages: [62],
        legacyLessonIds: ["inverse-function-derivative"],
        body: String.raw`### Propriété

Soit $f$ une fonction dérivable sur un intervalle $I$, bijective de $I$ sur un intervalle $J$. On note $f^{-1}$ sa réciproque.

Pour $b\in J$, si $f'(f^{-1}(b))\ne0$, alors $f^{-1}$ est dérivable en $b$ et :

$$\boxed{(f^{-1})'(b)=\frac1{f'(f^{-1}(b))}.}$$

### Remarque

On l’applique notamment lorsque $f$ est continue et strictement monotone sur $I$ : elle réalise alors une bijection de $I$ sur $f(I)$.

**Attention :** $f^{-1}$ désigne la fonction réciproque, pas la fonction $1/f$. Il faut d’abord retrouver l’antécédent de $b$.`,
        examples: [{
          id: "inverse-sine-half", title: "Calculer une dérivée sans exprimer la réciproque",
          prompt: String.raw`Soit $f:x\mapsto\sin x$ de $]-\pi/2;\pi/2[$ sur $]-1;1[$. Justifions la dérivabilité de $f^{-1}$ en $1/2$ et calculons son nombre dérivé.`,
          parts: [
            { id: "inverse-sine-bijection", label: "a)", prompt: "Justifier la bijection.", solution: String.raw`Sur $]-\pi/2;\pi/2[$, le sinus est continu et strictement croissant, car $f'(x)=\cos x>0$. Son image est $]-1;1[$. Il réalise donc la bijection annoncée.` },
            { id: "inverse-sine-antecedent", label: "b)", prompt: "Chercher l’antécédent de 1/2.", solution: String.raw`Dans l’intervalle considéré, $\sin x=1/2$ a pour unique solution $x=\pi/6$. Ainsi $f^{-1}(1/2)=\pi/6$.` },
            { id: "inverse-sine-calculation", label: "c)", prompt: "Appliquer la formule.", solution: String.raw`On calcule $f'(\pi/6)=\cos(\pi/6)=\sqrt3/2\ne0$. La réciproque est donc dérivable en $1/2$ et :

$$(f^{-1})'(1/2)=\frac1{\sqrt3/2}=\boxed{\frac{2\sqrt3}{3}}.$$` },
          ],
        }],
      },
    ],
  },
  {
    id: "successive-derivatives-summary", numeral: "III", title: "Dérivées successives",
    topics: [
      {
        id: "successive-derivatives-summary", title: "Dérivées première, seconde et d’ordre n", pages: [63],
        legacyLessonIds: ["successive-derivatives"],
        body: String.raw`### Définitions

Soit $f$ définie sur un intervalle $I$.

- Si $f$ est dérivable sur $I$, sa dérivée est sa **dérivée première**, notée $f'$ ou $\dfrac{df}{dx}$.
- Si $f'$ est à son tour dérivable, sa dérivée est la **dérivée seconde**, notée $f''$, $f^{(2)}$ ou $\dfrac{d^2f}{dx^2}$.
- Plus généralement, si $f^{(n-1)}$ est dérivable, sa dérivée est la **dérivée d’ordre $n$**, notée $f^{(n)}$ ou $\dfrac{d^nf}{dx^n}$.

On dérive donc **le résultat de la dérivation précédente**, pas plusieurs fois l’expression initiale.`,
        examples: [{
          id: "successive-polynomial", title: "Dériver deux fois un polynôme",
          prompt: String.raw`Soit $f(x)=2x^6+3x^2-5$ sur $\mathbb R$. Calculons $f'$ puis $f''$.`,
          parts: [
            { id: "successive-first", label: "a)", prompt: "Dérivée première.", solution: String.raw`On dérive chaque terme : $(2x^6)'=12x^5$, $(3x^2)'=6x$ et $(-5)'=0$. Donc $\boxed{f'(x)=12x^5+6x}$.` },
            { id: "successive-second", label: "b)", prompt: "Dérivée seconde.", solution: String.raw`On dérive maintenant **$f'$** :

$$f''(x)=(12x^5+6x)'=\boxed{60x^4+6}.$$` },
          ],
        }],
      },
      {
        id: "inflection-point", title: "Point d’inflexion", pages: [63],
        body: String.raw`### Présentation

Soit $f$ dérivable sur un intervalle et $a$ un point intérieur de cet intervalle. Le point $A(a;f(a))$ est un **point d’inflexion** lorsque la courbe traverse sa tangente en $A$.

### Propriété

Si $f$ est deux fois dérivable et si $f''$ **s’annule en $a$ en changeant de signe**, alors $A(a;f(a))$ est un point d’inflexion.

L’égalité $f''(a)=0$ seule ne suffit pas : le **changement de signe** est essentiel.`,
        examples: [{
          id: "cubic-inflection", title: "Le point d’inflexion de la fonction cube",
          prompt: String.raw`Justifions que la courbe de $f(x)=x^3$ possède un point d’inflexion en $O$.`,
          solution: String.raw`La fonction est deux fois dérivable sur $\mathbb R$ : $f'(x)=3x^2$, puis $f''(x)=6x$.

| $x$ | $]-\infty;0[$ | $0$ | $]0;+\infty[$ |
| --- | --- | --- | --- |
| $f''(x)=6x$ | $-$ | $0$ | $+$ |

$f''$ s’annule en $0$ en passant du signe moins au signe plus. Comme $f(0)=0$, **$O(0;0)$ est un point d’inflexion**.

La tangente en $O$ est $y=0$, car $f'(0)=0$. Pour $x<0$, $x^3<0$ ; pour $x>0$, $x^3>0$ : la courbe traverse bien cette tangente.`,
        }],
        interaction: {
          kind: "curve", eyebrow: "Observer", title: "La courbe traverse sa tangente",
          instruction: "Déplace le point de part et d’autre de 0 et compare sa position à la tangente.",
          observation: "La courbe est sous la tangente pour x < 0, puis au-dessus pour x > 0.",
          formula: "f(x) = x³", formulaTex: "f(x)=x^3",
          rule: { kind: "polynomial", coefficients: [0, 0, 0, 1] },
          window: { xMin: -2, xMax: 2, yMin: -5, yMax: 5 },
          guides: [{ kind: "horizontal", value: 0, label: "Tangente y = 0" }],
          marker: { min: -1.7, max: 1.7, step: 0.01, initial: -1 },
        },
        detail: String.raw`Par exemple, pour $f(x)=x^4$, on a $f''(0)=0$, mais $f''(x)=12x^2$ reste positif de chaque côté. La courbe reste au-dessus de sa tangente $y=0$ : **ce n’est pas un point d’inflexion**.`,
      },
    ],
  },
  {
    id: "finite-increments-summary", numeral: "IV", title: "Inégalité des accroissements finis",
    topics: [
      {
        id: "finite-increments-summary", title: "Encadrer un accroissement", pages: [64],
        legacyLessonIds: ["finite-increments", "lipschitz-bound", "complete-piecewise-function-study", "radical-function-study", "periodic-tangent-study", "cocoa-profit-mission", "corrected-exercises-workshop", "reinforcement-exercises-mission"],
        body: String.raw`### Propriété 1

Soit $f$ dérivable sur un intervalle $I$, et $a,b\in I$ avec $a<b$. S’il existe deux réels $m$ et $M$ tels que :

$$m\le f'(x)\le M\quad\text{pour tout }x\in[a;b],$$

alors :

$$\boxed{m(b-a)\le f(b)-f(a)\le M(b-a).}$$

### Propriété 2

Sous les mêmes hypothèses, s’il existe un réel $M\ge0$ tel que $|f'(x)|\le M$ pour tout $x\in[a;b]$, alors :

$$\boxed{|f(b)-f(a)|\le M|b-a|.}$$

Cette dernière écriture s’utilise aussi quel que soit l’ordre de $a$ et $b$, en prenant l’intervalle compris entre les deux.`,
        examples: [{
          id: "cosine-increments", title: "Majorer une différence de cosinus",
          prompt: String.raw`Démontrons que, pour tout réel $x$, $|\cos x-1|\le|x|$.`,
          solution: String.raw`Posons $f(t)=\cos t$. Elle est dérivable sur $\mathbb R$ et :

$$f'(t)=-\sin t,\qquad |f'(t)|\le1.$$

Si $x>0$, appliquons la propriété 2 sur $[0;x]$ ; si $x<0$, appliquons-la sur $[x;0]$. Dans les deux cas :

$$|f(x)-f(0)|\le1\times|x-0|.$$

Comme $f(0)=\cos0=1$, on obtient $\boxed{|\cos x-1|\le|x|}$. Pour $x=0$, les deux membres sont nuls : l’inégalité reste vraie.`,
        }],
        detail: String.raw`Un majorant de $|f'|$ contrôle la variation de $f$. Pour encadrer $f(b)$, on commence par encadrer $f'$ sur l’intervalle, on multiplie par la longueur positive $b-a$, puis on ajoute $f(a)$.`,
      },
    ],
  },
];
