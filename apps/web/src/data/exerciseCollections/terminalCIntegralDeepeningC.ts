import { integralExercise as ex, written, short } from "./terminalCIntegralBuilders";

export const integralDeepeningC = [
  ex(60, "Encadrement d’une suite d’intégrales", String.raw`Pour $n\ge1$, $I_n=\int_0^1x^n/(1+x^2)\,dx$.`, [
    written("1.", String.raw`Démontre $I_1=\frac12\ln2$.`, String.raw`On reconnaît la dérivée de $1+x^2$, à un facteur2 près :
$$I_1=\left[\frac12\ln(1+x^2)\right]_0^1=\boxed{\frac12\ln2}.$$`),
    written("2.", "Démontre Iₙ ≥ 0.", String.raw`Pour $0\le x\le1$, $x^n\ge0$ et $1+x^2>0$. L’intégrande est positive ou nulle ; les bornes sont croissantes. Donc **$I_n\ge0$**.`),
    written("3.", String.raw`Démontre $1/[2(n+1)]\le I_n\le1/(n+1)$.`, String.raw`Sur $[0;1]$, $1\le1+x^2\le2$, donc $1/2\le1/(1+x^2)\le1$. En multipliant par $x^n\ge0$ :
$$\frac{x^n}2\le\frac{x^n}{1+x^2}\le x^n.$$
On intègre, et $\int_0^1x^n=1/(n+1)$. On obtient **l’encadrement annoncé**.`),
    written("4.a", "Démontre que la suite est décroissante.", String.raw`Pour $0\le x\le1$, $x^{n+1}\le x^n$. En divisant par $1+x^2>0$ et en intégrant, **$I_{n+1}\le I_n$**. La comparaison est même stricte à l’intérieur de l’intervalle.`),
    written("4.b", "Étudie la convergence et calcule la limite.", String.raw`La suite est décroissante et minorée par0 : elle converge. Plus précisément, $0\le I_n\le1/(n+1)$ et la borne supérieure tend vers0. **Par encadrement, $I_n\to0$.**`),
  ]),
  ex(61, "Intégrales de Wallis", String.raw`Pour $n\ge0$, $I_n=\int_0^{\pi/2}\sin^nx\,dx$.`, [
    written("1.", String.raw`Pour $n\ge2$, démontre $I_n=(n-1)I_{n-2}-(n-1)I_n$.`, String.raw`Écrivons $\sin^nx=\sin^{n-1}x\sin x$. Prenons $u=\sin^{n-1}x$ et $v'=\sin x$, donc $u'=(n-1)\sin^{n-2}x\cos x$ et $v=-\cos x$.

Le crochet $[-\sin^{n-1}x\cos x]_0^{\pi/2}$ est nul, car $n\ge2$. Donc :
$$I_n=(n-1)\int_0^{\pi/2}\sin^{n-2}x\cos^2x\,dx.$$
Avec $\cos^2x=1-\sin^2x$, on trouve exactement **$I_n=(n-1)(I_{n-2}-I_n)$**, soit $I_n=(n-1)I_{n-2}/n$.`),
    written("2.a", "Calcule I₀.", String.raw`Pour $n=0$, on intègre la fonction constante1. Une primitive est $x$, donc $I_0=[x]_0^{\pi/2}=\pi/2-0$. **Ainsi $I_0=\pi/2$.**`),
    written("2.b", "Déduis I₂ et I₄.", String.raw`Avec la relation $I_n=(n-1)I_{n-2}/n$ :
$$I_2=\frac12I_0=\boxed{\frac\pi4},\qquad I_4=\frac34I_2=\boxed{\frac{3\pi}{16}}.$$`),
  ]),
  ex(62, "Une suite d’intégrales logarithmiques", String.raw`Pour $n\ge1$, $I_n=\int_{e^{n-1}}^{e^n}2\ln t/t\,dt$.`, [
    written("1.", String.raw`Démontre $I_n=2n-1$.`, String.raw`Une primitive de $2\ln t/t$ est $(\ln t)^2$. Donc :
$$I_n=(\ln e^n)^2-(\ln e^{n-1})^2=n^2-(n-1)^2=\boxed{2n-1}.$$`),
    written("2.", "Démontre que la suite n’est pas bornée.", String.raw`$I_n=2n-1\to+\infty$. Il n’existe donc pas de majorant réel valable pour tous les termes. **La suite n’est pas bornée.**`),
    written("3.", "Démontre que (Iₙ/n) converge.", String.raw`On divise l’expression obtenue en1 par $n>0$ : $I_n/n=(2n-1)/n=2-1/n$. Comme $1/n\to0$, **la suite des quotients converge vers2**.`),
    written("4.", String.raw`Démontre $I_1+I_2+\cdots+I_n=n^2$.`, String.raw`On somme $I_k=k^2-(k-1)^2$ : les termes intermédiaires s’annulent.
$$\sum_{k=1}^nI_k=(1^2-0^2)+(2^2-1^2)+\cdots+(n^2-(n-1)^2)=\boxed{n^2}.$$`),
  ]),
  ex(63, "Intégrales de puissances du logarithme", String.raw`Pour $n\ge1$, $I_n=\int_1^ex^2(\ln x)^n\,dx$. On utilise aussi $I_0=\int_1^ex^2\,dx$.`, [
    written("1.", "Calcule I₀.", String.raw`L’intégrande est $x^2$, de primitive $x^3/3$. En évaluant en $e$ puis en1 :
$$I_0=\left[\frac{x^3}3\right]_1^e=\frac{e^3}3-\frac13=\boxed{\frac{e^3-1}3}.$$`),
    written("2.", "Calcule I₁ par parties.", String.raw`$u=\ln x$, $u'=1/x$, $v'=x^2$, $v=x^3/3$ :
$$I_1=\left[\frac{x^3}3\ln x\right]_1^e-\frac13I_0=\frac{e^3}3-\frac{e^3-1}9=\boxed{\frac{2e^3+1}9}.$$`),
    written("3.", String.raw`Démontre $3I_{n+1}+(n+1)I_n=e^3$.`, String.raw`Prenons $u=(\ln x)^{n+1}$ et $v'=x^2$. Le crochet vaut $e^3/3$, puisque $\ln e=1$ et $\ln1=0$ :
$$I_{n+1}=\frac{e^3}3-\frac{n+1}3\int_1^ex^2(\ln x)^n\,dx.$$
En multipliant par3 et en déplaçant le terme restant, on obtient la relation demandée.`),
    written("4.", "Déduis I₂.", String.raw`Pour $n=1$, $3I_2+2I_1=e^3$, donc :
$$I_2=\frac{e^3-2(2e^3+1)/9}3=\boxed{\frac{5e^3-2}{27}}.$$`),
    written("5.", "Démontre Iₙ ≥ 0.", String.raw`Sur $[1;e]$, $x^2>0$ et $\ln x\ge0$. L’intégrande est positive ou nulle. **Donc $I_n\ge0$.**`),
    written("6.", String.raw`Déduis de3 que $I_n\le e^3/(n+1)$.`, String.raw`La question5 donne $I_{n+1}\ge0$. Dans $3I_{n+1}+(n+1)I_n=e^3$, on peut donc retirer le premier terme positif : $(n+1)I_n\le e^3$. Comme $n+1>0$, **$I_n\le e^3/(n+1)$**.`),
    short("7.", "Détermine la limite de Iₙ.", "$0$", ["0"], String.raw`$0\le I_n\le e^3/(n+1)$ et la borne supérieure tend vers0. Le théorème d’encadrement donne **$\lim I_n=0$**.`),
  ]),
  ex(64, "Famille de fonctions et limite d’intégrales", String.raw`Pour $n\ge1$, $f_n(x)=(1-x)^n e^{x/2}$ sur $\mathbb R$ ; $(C_n)$ est sa courbe. Le repère est orthonormé d’unité2cm. On pose $S_n=\frac1{n!}\int_0^1f_n(x)\,dx$.`, [
    written("A.1.a", String.raw`Calcule les limites de $f_1(x)$ et $f_1(x)/x$ en $+\infty$.`, String.raw`$f_1(x)=(1-x)e^{x/2}$. Le premier facteur tend vers $-\infty$ et le second vers $+\infty$, donc **$f_1\to-\infty$**.

$f_1(x)/x=(1/x-1)e^{x/2}$, avec $1/x-1\to-1$, donc **$f_1(x)/x\to-\infty$**.`),
    written("A.1.b", "Interprète graphiquement.", String.raw`La courbe possède en $+\infty$ une **branche parabolique de direction l’axe des ordonnées**, descendante. Elle n’a pas d’asymptote affine à droite.`),
    written("A.2.a", "Calcule la limite de f₁ en −∞.", String.raw`Posons $t=-x/2\to+\infty$. Alors $(1-x)e^{x/2}=(1+2t)e^{-t}$. Par croissance comparée, $e^{-t}$ et $te^{-t}$ tendent vers0. **La limite est0, par valeurs positives.**`),
    written("A.2.b", "Interprète graphiquement.", "La droite y = 0 est une asymptote horizontale à gauche. La courbe s’en approche par au-dessus."),
    written("A.3.a", "Démontre le sens de variation annoncé autour de −1.", String.raw`Par produit, $f_1'=-e^{x/2}+(1-x)e^{x/2}/2=-(x+1)e^{x/2}/2$. Son signe est donc celui de $-(x+1)$.

**f₁ est strictement croissante sur $]-\infty;-1]$ puis strictement décroissante sur $[-1;+\infty[$.**`),
    written("A.3.b", "Dresse le tableau de variation de f₁.", String.raw`À gauche, la limite est0. La valeur maximale, en $-1$, est $2e^{-1/2}$. Ensuite la fonction décroît jusqu’à $-\infty$.

| $x$ | $-\infty$ | $-1$ | $+\infty$ |
|---|---|---|---|
| $f_1$ | $0$ | $\nearrow 2e^{-1/2}\searrow$ | $-\infty$ |

Elle passe par $(0;1)$ et $(1;0)$.`),
    written("A.3.c", "Trace C₁ et sa tangente au point d’abscisse0.", String.raw`$f_1(0)=1$ et $f_1'(0)=-1/2$. La tangente est **$y=1-x/2$**, au point $(0;1)$. Place ce point, le maximum et $(1;0)$, puis respecte les limites. Le point de tangence n’est pas O, puisque $f_1(0)=1$.`),
    written("B.1.a", "Détermine la limite de fₙ en +∞ suivant la parité de n.", String.raw`Pour $x>1$, $(1-x)^n=(-1)^n(x-1)^n$. Sa valeur absolue multipliée par $e^{x/2}$ tend vers $+\infty$.

**n pair : limite $+\infty$ ; n impair : limite $-\infty$.**`),
    written("B.1.b", "Détermine la limite de fₙ(x)/x en +∞.", String.raw`Pour $x>1$, $f_n(x)/x=(-1)^n[(x-1)^n/x]e^{x/2}$. Pour $n=1$, le quotient polynomial tend vers1 ; pour $n>1$, il tend vers $+\infty$. Dans tous les cas, sa valeur absolue après multiplication par l’exponentielle tend vers $+\infty$.

**La limite est $+\infty$ si n est pair, $-\infty$ si n est impair.**`),
    written("B.1.c", "Interprète graphiquement.", "Chaque courbe possède à droite une branche parabolique de direction l’axe des ordonnées, montante si n est pair et descendante si n est impair."),
    written("B.2.a", "Calcule la limite de fₙ en −∞.", String.raw`Posons $X=1-x\to+\infty$. Alors $f_n(x)=e^{1/2}X^ne^{-X/2}$. Par croissance comparée, **la limite est0**, par valeurs positives.`),
    written("B.2.b", "Interprète graphiquement.", "La droite y = 0 est une asymptote horizontale à gauche pour toutes les courbes ; elles restent au-dessus à gauche."),
    written("B.3.a", String.raw`Démontre $f_n'(x)=\frac12(1-x-2n)(1-x)^{n-1}e^{x/2}$.`, String.raw`La règle du produit donne :
$$f_n'=-n(1-x)^{n-1}e^{x/2}+\frac12(1-x)^ne^{x/2}.$$
En mettant $(1-x)^{n-1}e^{x/2}/2$ en facteur, on obtient **$(1-x-2n)(1-x)^{n-1}e^{x/2}/2$**. Pour $n=1$, le facteur de puissance0 est1 partout.`),
    written("B.3.b", "Étudie le signe de fₙ′ suivant la parité.", String.raw`Posons $a_n=1-2n<1$.

- Si n est impair, $n-1$ est pair : le signe est positif avant $a_n$ et négatif après. Pour n impair au moins3, la dérivée s’annule aussi en1 mais **ne change pas de signe**.
- Si n est pair, $n-1$ est impair : la dérivée est positive avant $a_n$, négative entre $a_n$ et1, positive après1.

L’exponentielle est toujours strictement positive.`),
    written("B.3.c", "Dresse les tableaux de variation.", String.raw`Dans tous les cas, $f_n(a_n)=(2n)^ne^{(1-2n)/2}$ et $f_n(1)=0$.

**n impair :** la fonction monte de0 jusqu’au maximum en $a_n$, puis descend vers $-\infty$, en passant par0 en1.

**n pair :** elle monte de0 au même maximum, descend jusqu’au minimum0 en1, puis monte vers $+\infty$.

Pour n impair supérieur à1, le point1 a une tangente horizontale, mais ce n’est pas un extremum.`),
    written("B.4.a", String.raw`Résous $f_n(x)=f_{n+1}(x)$.`, String.raw`La différence vaut :
$$f_n-f_{n+1}=x(1-x)^ne^{x/2}.$$
L’exponentielle ne s’annule jamais. Le produit est nul exactement pour **$x=0$ ou $x=1$**.`),
    written("B.4.b", "Précise les deux points communs à toutes les courbes.", String.raw`Pour tout $n\ge1$, $f_n(0)=1$ et $f_n(1)=0$. Les deux points fixes sont donc **$(0;1)$ et $(1;0)$**.`),
    written("B.4.c", "Étudie les positions relatives de Cₙ et Cₙ₊₁.", String.raw`Le signe de $f_n-f_{n+1}$ est celui de $x(1-x)^n$ :

- si $x<0$, il est négatif : $C_n$ est en dessous ;
- si $0<x<1$, il est positif : $C_n$ est au-dessus ;
- si $x>1$, il est positif pour n pair, négatif pour n impair.

Les courbes se rencontrent en0 et1.`),
    written("B.4.d", "Trace C₂ dans le même repère que C₁.", String.raw`Pour n=2, $a_2=-3$, maximum $16e^{-3/2}$ ; le minimum est0 en1. La courbe passe aussi par $(0;1)$ et tend vers $+\infty$ à droite.

Pour comparer à $C_1$, on utilise le cas n=1 de la question précédente : $C_2$ est au-dessus de $C_1$ pour $x<0$ et $x>1$, en dessous pour $0<x<1$. Respecte l’unité2cm sur les deux axes.`),
    written("C.1", "Justifie que fₙ décroît sur [0;1].", String.raw`Sur $[0;1[$, $1-x-2n<0$ et $(1-x)^{n-1}>0$. Donc $f_n'<0$. La continuité jusqu’à1 donne **une fonction décroissante sur $[0;1]$**.`),
    written("C.2", String.raw`Démontre $0\le f_n(x)\le1$ pour $x\in[0;1]$.`, String.raw`La fonction décroît de $f_n(0)=1$ à $f_n(1)=0$. Toutes ses valeurs sur l’intervalle sont donc **comprises entre0 et1**.`),
    written("C.3", String.raw`Déduis $0\le S_n\le1/n$.`, String.raw`En intégrant l’encadrement sur un intervalle de longueur1 :
$$0\le\int_0^1f_n(x)\,dx\le1.$$
Après division par $n!>0$, $0\le S_n\le1/n!$. Comme $n!\ge n$ pour $n\ge1$, **$0\le S_n\le1/n$**.`),
    short("C.4", "Détermine la limite de Sₙ.", "$0$", ["0"], String.raw`La borne inférieure est0 et la borne supérieure $1/n$ tend vers0. **Par encadrement, $S_n\to0$.**`),
  ], { correctionFigureKey: "tc-l7-integrals" }),
];
