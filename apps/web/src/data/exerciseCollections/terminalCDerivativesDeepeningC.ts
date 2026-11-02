import { short, written } from "./builders";
import { derivativeExercise as ex } from "./terminalCDerivativesBuilders";
const r = String.raw;
const graph = { correctionFigureKey: "tc-l2-functions" as const };

export const derivativesDeepeningC = [
  ex(42, "Racine carrée, demi-tangente et branche parabolique", r`Soit $f(x)=x^2-2\sqrt x$, définie sur $[0;+\infty[$.`, [
    written("1.", "Étudie la dérivabilité en zéro et interprète le résultat.", r`On a $f(0)=0$. Pour $x>0$ :

$$\frac{f(x)-f(0)}x=x-\frac2{\sqrt x}\longrightarrow-\infty.$$

La limite n’est pas un réel : **il n’existe pas de nombre dérivé fini à droite en $0$**. La courbe est continue à droite et admet une demi-tangente verticale **vers le bas** en $O$.`),
    written("2.", r`Calcule les limites de $f(x)$ et de $f(x)/x$ en $+\infty$, puis interprète.`, r`Pour $x>0$, on écrit $f(x)=x^2(1-2/x^{3/2})$, donc $f(x)\to+\infty$.

De plus, $f(x)/x=x-2/\sqrt x\to+\infty$. **La courbe possède une branche parabolique de direction l’axe des ordonnées** en $+\infty$.`),
    written("3.", "Étudie les variations et donne le tableau.", r`Sur $]0;+\infty[$ :

$$f'(x)=2x-\frac1{\sqrt x}=\frac{2x\sqrt x-1}{\sqrt x}.$$

Le dénominateur est positif. L’expression $2x\sqrt x-1$ s’annule une fois en $\alpha=2^{-2/3}$, est négative avant et positive après.

La relation $2\alpha^{3/2}=1$ donne $\sqrt\alpha=2\alpha^2$, donc $f(\alpha)=-3\alpha^2$.

| $x$ | $0$ | | $\alpha=2^{-2/3}$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- |
| $f'(x)$ | non définie | $-$ | $0$ | $+$ | |
| $f(x)$ | $0$ | $\searrow$ | $-3\cdot2^{-4/3}$ | $\nearrow$ | $+\infty$ |`),
    written("4.", "Trace la courbe.", r`Place $O$ et sa demi-tangente verticale vers le bas. Le minimum est environ $(0{,}630;-1{,}191)$. La courbe recoupe l’axe horizontal en $x=2^{2/3}$, car $x^2=2\sqrt x$ pour $x>0$ équivaut à $x^{3/2}=2$. Respecte ensuite la croissance vers $+\infty$.`),
  ], graph),
  ex(43, "Une fonction impaire avec tangente et asymptotes", r`Soit $f(x)=x/(|x|+1)$.`, [
    written("1.", "Détermine le domaine.", r`Pour tout réel $x$, $|x|+1\ge1>0$. **$D_f=\mathbb R$.**`),
    written("2.", "Étudie la continuité en zéro.", r`Quand $x\to0$, le numérateur tend vers $0$ et le dénominateur vers $1$. Ainsi $f(x)\to0=f(0)$. **$f$ est continue en $0$.**`),
    written("3.", "Démontre l’existence d’une tangente en zéro et donne son équation.", r`Pour $x\ne0$, le taux vaut :

$$\frac{f(x)-f(0)}x=\frac1{|x|+1}\longrightarrow1.$$

La limite est finie : $f'(0)=1$. La tangente en $O$ est donc **$y=x$**.`),
    written("4.", "Étudie la parité et interprète.", r`On calcule $f(-x)=-x/(|-x|+1)=-f(x)$. Le domaine est symétrique par rapport à $0$. **$f$ est impaire et sa courbe est symétrique par rapport à l’origine.**`),
    written("5.", "Calcule la limite en +∞ et interprète.", r`Pour $x>0$, $f(x)=x/(x+1)=1-1/(x+1)\to1$. **$y=1$ est une asymptote horizontale en $+\infty$**. Par imparité, $y=-1$ est asymptote en $-\infty$.`),
    written("6.", "Étudie les variations sur [0 ; +∞[ et donne le tableau.", r`Pour $x\ge0$, la restriction est $x/(x+1)$, de dérivée $1/(x+1)^2>0$.

| $x$ | $0$ | | $+\infty$ |
| --- | --- | --- | --- |
| $f'(x)$ | $1$ | $+$ | |
| $f(x)$ | $0$ | $\nearrow$ | $1$ |

La valeur $1$ est une limite, jamais atteinte.`),
    written("7.", "Trace la courbe.", r`Sur la demi-droite positive, place $O$, $(1;1/2)$ et l’asymptote $y=1$. La courbe reste sous cette dernière et est tangente à $y=x$ en $O$. Complète la branche négative par la symétrie de centre $O$.`),
  ], graph),
  ex(44, "Deux asymptotes obliques et un raccord", r`Soit $f(x)=(x^2+|x-2|)/(x+1)$ sur $\mathbb R\setminus\{-1\}$.`, [
    written("1.", "Étudie la continuité en 2.", r`Le numérateur est continu et le dénominateur vaut $3\ne0$ en $2$. Ainsi $f$ est continue et **$f(2)=4/3$**.`),
    written("2.", "Étudie la dérivabilité en 2 et interprète.", r`Pour $x<2$, on écrit :

$$f(x)=\frac{x^2-x+2}{x+1}=x-2+\frac4{x+1}.$$

Cette expression donne la dérivée à gauche $1-4/(2+1)^2=5/9$.

Pour $x>2$, $f(x)=(x^2+x-2)/(x+1)=x-2/(x+1)$, qui donne la dérivée à droite $1+2/(2+1)^2=11/9$.

**La fonction n’est pas dérivable en $2$**, car les pentes $5/9$ et $11/9$ diffèrent. La courbe possède deux demi-tangentes de ces pentes en $(2;4/3)$.`),
    written("3.", "Calcule les limites aux bornes du domaine.", r`L’écriture de gauche donne $f(x)\to-\infty$ en $-\infty$, $f(x)\to-\infty$ en $-1^-$ et $f(x)\to+\infty$ en $-1^+$.

L’écriture de droite donne $f(x)\to+\infty$ en $+\infty$. **La droite $x=-1$ est une asymptote verticale.**`),
    written("4.", "Étudie les variations et donne le tableau.", r`Pour $x<2$, $x\ne-1$ :

$$f'(x)=1-\frac4{(x+1)^2}=\frac{(x-1)(x+3)}{(x+1)^2}.$$

Les zéros sont $-3$ et $1$ ; le signe est positif à l’extérieur et négatif entre eux, en séparant le pôle $-1$.

Pour $x>2$, $f'(x)=1+2/(x+1)^2>0$.

| $x$ | $-\infty$ | | $-3$ | | $-1^-$ | $-1^+$ | | $1$ | | $2$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $f(x)$ | $-\infty$ | $\nearrow$ | $-7$ | $\searrow$ | $-\infty$ | $+\infty$ | $\searrow$ | $1$ | $\nearrow$ | $4/3$ | $\nearrow$ | $+\infty$ |`),
    written("5.a)", r`Justifie les asymptotes $D_1:y=x-2$ et $D_2:y=x$.`, r`En $-\infty$, $f(x)-(x-2)=4/(x+1)\to0$ : **$D_1$ est asymptote à gauche**.

En $+\infty$, $f(x)-x=-2/(x+1)\to0$ : **$D_2$ est asymptote à droite**.`),
    written("5.b)", "Étudie la position relative par rapport à D₁ pour x ≤ 2.", r`La différence est $4/(x+1)$. Elle est négative sur $]-\infty;-1[$ et positive sur $]-1;2]$. **La courbe est sous $D_1$ sur le premier intervalle, au-dessus sur le second.**`),
    written("5.c)", "Étudie la position relative par rapport à D₂ pour x ≥ 2.", r`La différence vaut $-2/(x+1)<0$ pour $x\ge2$. **La courbe est sous $D_2$ sur $[2;+\infty[$.**`),
    written("6.", "Trace les deux asymptotes obliques et la courbe.", r`Ajoute l’asymptote verticale $x=-1$. Place les extremums $(-3;-7)$ et $(1;1)$, puis le raccord $(2;4/3)$ avec ses deux demi-tangentes. Les positions relatives et les variations permettent de contrôler chaque branche.`),
  ], graph),
  ex(45, "Une racine à deux branches et sa restriction bijective", r`Soit $f(x)=\sqrt{x^2+3x+2}$. On note $(C)$ sa courbe.`, [
    written("A.1.", "Justifie l’ensemble de définition.", r`Le radicand doit être positif ou nul. On factorise $x^2+3x+2=(x+1)(x+2)$. Le produit est positif à l’extérieur des racines et négatif entre elles.

**$D_f=]-\infty;-2]\cup[-1;+\infty[$.**`),
    written("A.2.", "Étudie la dérivabilité en −1 et −2 ; interprète.", r`En $-1$, on ne peut approcher que par la droite dans le domaine. Le taux est :

$$\frac{f(x)-f(-1)}{x+1}=\frac{\sqrt{x+2}}{\sqrt{x+1}}\longrightarrow+\infty.$$

En $-2$, on ne peut approcher que par la gauche. En écrivant les deux facteurs positifs $-x-1$ et $-x-2$ :

$$\frac{f(x)-f(-2)}{x+2}=-\frac{\sqrt{-x-1}}{\sqrt{-x-2}}\longrightarrow-\infty.$$

**Il n’existe pas de nombre dérivé réel à ces extrémités.** Les supports des demi-tangentes verticales sont $x=-1$ et $x=-2$, toutes deux orientées vers le haut.`),
    written("A.3.", "Calcule les limites aux deux infinis.", r`On factorise $x^2$ sous la racine :

$$f(x)=|x|\sqrt{1+3/x+2/x^2}.$$

Le second facteur tend vers $1$ et $|x|$ vers $+\infty$. **Les deux limites valent $+\infty$.**`),
    written("A.4.", "Étudie les variations et donne le tableau.", r`À l’intérieur du domaine :

$$f'(x)=\frac{2x+3}{2\sqrt{x^2+3x+2}}.$$

Le dénominateur est positif. Le numérateur est négatif pour $x<-2$ et positif pour $x>-1$.

| Intervalle | $]-\infty;-2]$ | $[-1;+\infty[$ |
| --- | --- | --- |
| Variation | $+\infty\searrow0$ | $0\nearrow+\infty$ |

La fonction n’est pas définie entre $-2$ et $-1$.`),
    written("A.5.", "Justifie les deux asymptotes obliques.", r`Pour $x$ assez grand et positif, on multiplie $f(x)-(x+3/2)$ par sa conjuguée :

$$f(x)-(x+3/2)=\frac{-1/4}{f(x)+x+3/2}\longrightarrow0.$$

Pour $x$ assez négatif, on compare à $-x-3/2$ :

$$f(x)-(-x-3/2)=\frac{-1/4}{f(x)-x-3/2}\longrightarrow0.$$

**Les asymptotes sont $y=-x-3/2$ à gauche et $y=x+3/2$ à droite.**`),
    written("A.6.", "Justifie l’axe de symétrie x = −3/2.", r`Le domaine est stable par $x\mapsto-3-x$. On calcule :

$$(-3-x)^2+3(-3-x)+2=x^2+3x+2.$$

Ainsi $f(-3-x)=f(x)$. Les abscisses $x$ et $-3-x$ ont pour milieu $-3/2$. **L’axe de symétrie est $x=-3/2$.**`),
    written("A.7.", "Détermine la tangente au point d’abscisse zéro.", r`On a $f(0)=\sqrt2$ et $f'(0)=3/(2\sqrt2)$. Donc :

$$\boxed{y=\frac3{2\sqrt2}x+\sqrt2.}$$`),
    written("A.8.", "Trace la courbe, ses asymptotes et la tangente.", r`Place $(-2;0)$ et $(-1;0)$, avec leurs demi-tangentes verticales vers le haut. Ajoute les deux asymptotes obliques et la tangente en $(0;\sqrt2)$. Dessine la branche droite croissante, puis utilise l’axe $x=-3/2$ pour obtenir la branche gauche.`),
    written("B.1.", r`Soit $g=f_{|[-1;+\infty[}$. Justifie que $g$ est une bijection sur $[0;+\infty[$.`, r`La restriction est continue et strictement croissante sur $[-1;+\infty[$, avec $g(-1)=0$ et une limite $+\infty$. Le théorème de la bijection donne **une bijection de $[-1;+\infty[$ sur $[0;+\infty[$**.`),
    short("B.2.", r`Justifie la dérivabilité de $g^{-1}$ en $\sqrt2$ et donne $(g^{-1})'(\sqrt2)$.`, "$2\\sqrt2/3$", ["2*sqrt(2)/3"], r`On a $g(0)=\sqrt2$, donc l’antécédent est $0$. Sa dérivée vaut $g'(0)=3/(2\sqrt2)\ne0$. La réciproque est donc dérivable et :

$$(g^{-1})'(\sqrt2)=\frac1{g'(0)}=\boxed{\frac{2\sqrt2}{3}}.$$`),
  ], graph),
  ex(46, "Construire une courbe et celle de sa réciproque", r`Soit $f(x)=1+x/\sqrt{1+x^2}$ sur $\mathbb R$.`, [
    written("1.", "Démontre que f est bijective et précise son intervalle image.", r`Le dénominateur est toujours positif. La fonction est continue et dérivable sur $\mathbb R$. Avec la règle du quotient :

$$f'(x)=\frac{\sqrt{1+x^2}-x^2/\sqrt{1+x^2}}{1+x^2}
=\frac1{(1+x^2)^{3/2}}>0.$$

Elle est strictement croissante. Comme $x/\sqrt{1+x^2}$ tend vers $-1$ en $-\infty$ et vers $1$ en $+\infty$, les limites de $f$ sont $0$ et $2$.

**$f$ est une bijection de $\mathbb R$ sur $K=]0;2[$.**`),
    short("2.", r`Justifie la dérivabilité de $f^{-1}$ en $1$ et calcule $(f^{-1})'(1)$.`, "$1$", ["1"], r`L’égalité $f(0)=1$ donne $f^{-1}(1)=0$. On calcule $f'(0)=1\ne0$ ; la réciproque est donc dérivable en $1$ et **$(f^{-1})'(1)=1/f'(0)=1$**.`),
    written("3.a)", "Trace la courbe de f.", r`Trace les asymptotes horizontales $y=0$ et $y=2$. Place $(0;1)$ et sa tangente de pente $1$, puis dessine une courbe strictement croissante entre les deux asymptotes.`),
    written("3.b)", "Trace la courbe de la réciproque dans le même repère.", r`Échange les deux coordonnées de chaque point : la courbe de $f^{-1}$ est la **symétrique de celle de $f$ par rapport à $y=x$**. Elle passe par $(1;0)$ et possède les asymptotes verticales $x=0$ et $x=2$. La courbe de correction montre les deux tracés.`),
  ], graph),
  ex(47, "Reconnaître une fonction égale à sa réciproque", r`Soit $f(x)=x-2\sqrt x+1$ sur $[0;1]$. Pour la construction sur papier, l’unité graphique demandée est de $10$ cm.`, [
    written("1.a)", "Étudie la dérivabilité en zéro.", r`On a $f(0)=1$. Pour $x>0$ :

$$\frac{f(x)-f(0)}x=1-\frac2{\sqrt x}\longrightarrow-\infty.$$

**Il n’existe pas de nombre dérivé réel à droite en $0$.**`),
    written("1.b)", "Donne l’interprétation graphique.", r`La fonction est continue à droite en $0$ et le taux tend vers $-\infty$. **La courbe admet en $(0;1)$ une demi-tangente verticale vers le bas**, de support $x=0$.`),
    written("2.", "Démontre que f est une bijection de [0 ; 1] sur [0 ; 1].", r`La fonction est continue sur $[0;1]$. Sur $]0;1[$, $f'(x)=1-1/\sqrt x<0$, donc elle est strictement décroissante. De plus, $f(0)=1$ et $f(1)=0$.

**Le théorème de la bijection donne une bijection de $[0;1]$ sur $[0;1]$.**`),
    written("3.", r`Démontre que $f(f(x))=x$ sur $[0;1]$.`, r`On commence par réécrire $f(x)=(1-\sqrt x)^2$. Comme $0\le\sqrt x\le1$, la quantité $1-\sqrt x$ est positive ou nulle. Donc :

$$\sqrt{f(x)}=|1-\sqrt x|=1-\sqrt x.$$

On applique à nouveau la même écriture :

$$f(f(x))=(1-\sqrt{f(x)})^2=(\sqrt x)^2=\boxed x.$$`),
    written("4.", "Déduis la réciproque.", r`Puisque $f$ est bijective et $f\circ f=\operatorname{id}_{[0;1]}$, **$f^{-1}=f$**. La fonction est sa propre réciproque.`),
    written("5.", "Construis la courbe.", r`Place $(0;1)$, $(1;0)$ et par exemple $(1/4;1/4)$. Respecte la décroissance, la demi-tangente verticale au premier point et la demi-tangente horizontale au second. Comme $f^{-1}=f$, **la courbe est symétrique par rapport à $y=x$**.`),
  ], graph),
];
