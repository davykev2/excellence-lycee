import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, written } from "./builders";
import { logarithmExercise as ex, limitAnswer as limit } from "./terminalCLogarithmsBuilders";

export const logarithmsDeepeningC: ArenaExerciseItem[] = [
  ex(34, "Fonction auxiliaire et approximation d’une solution", String.raw`Le plan est muni d’un repère orthonormal, d’unité graphique $2$ cm.

**Partie I.** $g(x)=x\ln x-x+1$ sur $]0;+\infty[$.

**Partie II.** $f(x)=\ln x/(x-1)$ sur $]1;+\infty[$.

**Partie III.** On étudie $f(x)=1/2$, puis $h(x)=\ln x+x/2+1/2$ et la suite $u_0=3$, $u_{n+1}=h(u_n)$.`, [
    limit("I.1.a", String.raw`Calcule $\displaystyle\lim_{x\to0^+}g(x)$.`, "1", String.raw`$x\ln x\to0$ et $x\to0$. Donc $x\ln x-x+1\to0-0+1=\boxed1$.`),
    limit("I.1.b", String.raw`Calcule $\displaystyle\lim_{x\to+\infty}g(x)$.`, "+infini", String.raw`On écrit $g(x)=x(\ln x-1)+1$. Les deux facteurs du produit tendent vers $+\infty$. **La limite est $+\infty$.**`),
    written("I.2.a", "Étudie les variations de g.", String.raw`$g'(x)=\ln x+1-1=\ln x$. Cette dérivée est négative sur $]0;1[$, nulle en $1$, positive sur $]1;+\infty[$.

**$g$ décroît jusqu’à $1$, puis croît.** Son minimum est $g(1)=0$.`),
    written("I.2.b", "Déduis-en le signe de g.", String.raw`Le minimum de $g$ est $0$, atteint seulement en $1$. **Donc $g(x)\ge0$ pour $x>0$, avec égalité uniquement pour $x=1$.** En particulier, $g(x)>0$ si $x>1$.`),
    limit("II.1.a", String.raw`Calcule $\displaystyle\lim_{x\to+\infty}f(x)$.`, "0", String.raw`$f(x)=((\ln x)/x)\times(x/(x-1))$. Le premier facteur tend vers $0$, le second vers $1$. **La limite est $0$.**`),
    limit("II.1.b", String.raw`Calcule $\displaystyle\lim_{x\to1^+}f(x)$.`, "1", String.raw`$f(x)=\ln x/(x-1)$ est le taux d’accroissement de $\ln$ en $1$. Sa limite à droite est $\ln'(1)=\boxed1$.`),
    written("II.2", "Dresse le tableau de variation de f en utilisant g.", String.raw`Par quotient :

$$f'(x)=\frac{(x-1)/x-\ln x}{(x-1)^2}=-\frac{g(x)}{x(x-1)^2}.$$

Pour $x>1$, le dénominateur est positif et $g(x)>0$, donc $f'(x)<0$.

| $x$ | $1^+$ | $]1;+\infty[$ | $+\infty$ |
| --- | --- | --- | --- |
| $f'(x)$ | | $-$ | |
| $f(x)$ | $1$ | strictement décroissante | $0$ |`),
    written("II.3", "Trace la courbe de f.", String.raw`La courbe est au-dessus de l’axe des abscisses et strictement décroissante pour $x>1$. Elle s’approche du point $(1;1)$ sans l’inclure dans son domaine et possède l’asymptote horizontale $y=0$ en $+\infty$. Place notamment $(2;\ln2)$ et $(4;\ln4/3)$.`),
    written("III.1", String.raw`Démontre que $f(x)=1/2$ possède une unique solution $\alpha$, avec $3{,}5<\alpha<3{,}6$.`, String.raw`$f$ est continue et strictement décroissante sur $]1;+\infty[$, de limite $1$ à droite de $1$ et de limite $0$ en l’infini. Comme $1/2\in]0;1[$, le théorème des valeurs intermédiaires et la stricte décroissance donnent **une unique solution $\alpha$**.

À la calculatrice, $f(3{,}5)\approx0{,}501105>1/2$ et $f(3{,}6)\approx0{,}492667<1/2$. Donc **$3{,}5<\alpha<3{,}6$**.`),
    written("III.2.a", String.raw`Démontre que $h(\alpha)=\alpha$.`, String.raw`L’équation $f(\alpha)=1/2$ donne $\ln\alpha=(\alpha-1)/2$. On remplace dans $h$ :

$$h(\alpha)=\frac{\alpha-1}2+\frac\alpha2+\frac12=\alpha.$$`),
    written("III.2.b", "Étudie le sens de variation de h.", String.raw`Pour $x>1$, $h'(x)=1/x+1/2>0$. **$h$ est donc strictement croissante sur $]1;+\infty[$.**`),
    written("III.2.c", String.raw`Pour $I=[3;4]$, démontre $h(x)\in I$ et $|h'(x)|\le5/6$ pour $x\in I$.`, String.raw`Comme $h$ est croissante, $h(3)\le h(x)\le h(4)$. Or $h(3)=\ln3+2\approx3{,}099\ge3$ et $h(4)=\ln4+5/2\approx3{,}886\le4$. Donc **$h(I)\subset I$**.

Sur $I$, $1/4\le1/x\le1/3$. Ainsi $3/4\le h'(x)\le5/6$. La dérivée étant positive, **$|h'(x)|\le5/6$**.`),
    written("III.3.a", String.raw`Justifie $|u_{n+1}-\alpha|\le(5/6)|u_n-\alpha|$.`, String.raw`D’abord, $u_0=3\in I$ et $h(I)\subset I$, donc tous les $u_n$ restent dans $I$ par récurrence. On a aussi $\alpha\in I$.

L’inégalité des accroissements finis, avec $|h'|\le5/6$ sur $I$, donne :

$$|u_{n+1}-\alpha|=|h(u_n)-h(\alpha)|\le\frac56|u_n-\alpha|.$$`),
    written("III.3.b", String.raw`Justifie $|u_n-\alpha|\le(5/6)^n$.`, String.raw`En répétant l’inégalité précédente, on obtient $|u_n-\alpha|\le(5/6)^n|u_0-\alpha|$. Comme $u_0=3$ et $3{,}5<\alpha<3{,}6$, $|u_0-\alpha|<1$. **Donc $|u_n-\alpha|\le(5/6)^n$.**`),
    written("III.3.c", String.raw`Déduis-en la convergence de $(u_n)$.`, String.raw`Comme $0<5/6<1$, $(5/6)^n\to0$. L’encadrement $0\le|u_n-\alpha|\le(5/6)^n$ donne $|u_n-\alpha|\to0$. **Ainsi $u_n\to\alpha$.**`),
    short("III.4.a", String.raw`Quel est le premier entier $p$ pour lequel la majoration $(5/6)^p\le10^{-3}$ garantit la précision demandée ?`, "$38$", ["38"], String.raw`On prend le logarithme : $p\ln(5/6)\le\ln(10^{-3})$. Comme $\ln(5/6)<0$, on inverse le sens en divisant : $p\ge\ln(10^{-3})/\ln(5/6)\approx37{,}89$. **Le premier entier est $38$.**`),
    written("III.4.b", String.raw`Donne une valeur décimale de $\alpha$ à $10^{-3}$ près.`, String.raw`En calculant la suite jusqu’à $u_{38}$, on obtient $u_{38}\approx3{,}512804$. La majoration garantit déjà une erreur inférieure à $10^{-3}$.

Un balayage complémentaire donne $3{,}5128<\alpha<3{,}5129$. **Une valeur décimale à $10^{-3}$ près est $\alpha\approx3{,}513$.** On distingue la borne d’erreur théorique de l’arrondi final.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(35, "Continuité sans dérivabilité", String.raw`Soit $g(x)=\ln(-x)$ si $x<-1$, et $g(x)=(x+1)^2$ si $x\ge-1$.`, [
    written("1", "Détermine le domaine de g.", String.raw`Sur la première branche, $x<-1$ entraîne $-x>0$, donc le logarithme existe. Sur la seconde, le polynôme existe pour tout $x\ge-1$. Les deux parties couvrent $\mathbb R$. **$D_g=\mathbb R$.**`),
    written("2", String.raw`Démontre que $g$ est continue en $-1$.`, String.raw`$g(-1)=0$. À gauche, $\ln(-x)\to\ln1=0$. À droite, $(x+1)^2\to0$. Les deux limites sont égales à $g(-1)$ : **$g$ est continue en $-1$.**`),
    written("3.a", String.raw`Étudie sa dérivabilité en $-1$.`, String.raw`À gauche, le taux est $\ln(-x)/(x+1)$. Posons $t=-x\to1^+$ : il devient $-\ln t/(t-1)\to-1$.

À droite, le taux vaut $(x+1)^2/(x+1)=x+1\to0$.

Les nombres dérivés latéraux sont donc **$-1$ et $0$**, différents. **$g$ n’est pas dérivable en $-1$.**`),
    written("3.b", "Interprète graphiquement le résultat.", String.raw`La courbe possède en $A(-1;0)$ deux demi-tangentes distinctes : à gauche $y=-(x+1)$, à droite $y=0$. Elles forment un **point anguleux**. La continuité ne suffit pas à assurer une tangente unique.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(36, "Étude de (1 + ln x) / x", String.raw`Sur $]0;+\infty[$, $f(x)=(1+\ln x)/x$. On note $(C)$ sa courbe dans un repère orthonormal d’unité graphique $1$ cm.`, [
    limit("1.a", String.raw`Calcule $\displaystyle\lim_{x\to+\infty}f(x)$.`, "0", String.raw`$f(x)=1/x+(\ln x)/x$. Les deux termes tendent vers $0$. **La limite est $0$.**`),
    limit("1.b", String.raw`Calcule $\displaystyle\lim_{x\to0^+}f(x)$.`, "-infini", String.raw`$1/x\to+\infty$ et $1+\ln x\to-\infty$. Comme $f=(1/x)(1+\ln x)$, **la limite est $-\infty$**.`),
    written("2.a", "Détermine la dérivée de f.", String.raw`Par quotient :

$$f'(x)=\frac{(1/x)x-(1+\ln x)}{x^2}=\boxed{-\frac{\ln x}{x^2}}.$$`),
    written("2.b", "Étudie les variations et dresse le tableau.", String.raw`$x^2>0$, donc le signe de $f'$ est l’opposé de celui de $\ln x$. **$f$ croît sur $]0;1]$ puis décroît sur $[1;+\infty[$**, avec $f(1)=1$.

| $x$ | $0^+$ | $]0;1[$ | $1$ | $]1;+\infty[$ | $+\infty$ |
| --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | $0$ | $-$ | |
| $f(x)$ | $-\infty$ | croît | $1$ | décroît | $0$ |`),
    written("3", String.raw`Détermine la tangente $(T)$ au point d’abscisse $e^{-1}$.`, String.raw`Avec $a=1/e$, $\ln a=-1$, donc $f(a)=0$ et $f'(a)=1/a^2=e^2$. La tangente est $y=e^2(x-1/e)$ :

$$\boxed{y=e^2x-e.}$$`),
    written("4", "Trace la tangente et la courbe dans le même repère.", String.raw`Place $A(1/e;0)$ et le maximum $B(1;1)$. Trace en $A$ la droite $y=e^2x-e$. La courbe descend sans borne près de $0$, croît jusqu’à $B$, puis décroît vers l’asymptote $y=0$. Le point $x=0$ reste exclu.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(37, "Un prolongement et des encadrements", String.raw`Sur $[0;+\infty[$, on pose $f(x)=\ln(1+x)/x$ si $x>0$ et $f(0)=1$. Le repère est orthonormal, d’unité graphique $3$ cm.`, [
    written("1", String.raw`Démontre que $f$ est continue en $0$.`, String.raw`La limite de référence donne $\lim_{x\to0^+}\ln(1+x)/x=1$. Cette limite est égale à $f(0)$. **Donc $f$ est continue en $0$.**`),
    written("2.a", String.raw`Étudie $g(x)=\ln(1+x)-(x-x^2/2+x^3/3)$ sur $[0;+\infty[$. Calcule $g(0)$ et déduis un majorant de $\ln(1+x)$.`, String.raw`On dérive :

$$g'(x)=\frac1{1+x}-(1-x+x^2)=-\frac{x^3}{1+x}\le0.$$

Donc $g$ est décroissante, et $g(0)=0$. Ainsi $g(x)\le0$, d’où :

$$\boxed{\ln(1+x)\le x-\frac{x^2}2+\frac{x^3}3\quad(x\ge0).}$$`),
    written("2.b", String.raw`Par une étude analogue, démontre $\ln(1+x)\ge x-x^2/2$ pour $x\ge0$.`, String.raw`Posons $q(x)=\ln(1+x)-x+x^2/2$. Alors :

$$q'(x)=\frac1{1+x}-1+x=\frac{x^2}{1+x}\ge0.$$

Donc $q$ est croissante et $q(0)=0$, d’où $q(x)\ge0$. **On obtient bien $\ln(1+x)\ge x-x^2/2$.**`),
    written("2.c", String.raw`Établis $-1/2\le(\ln(1+x)-x)/x^2\le-1/2+x/3$ pour $x>0$, puis déduis-en $f'_d(0)$.`, String.raw`Les deux résultats précédents donnent :

$$x-\frac{x^2}2\le\ln(1+x)\le x-\frac{x^2}2+\frac{x^3}3.$$

On soustrait $x$, puis on divise par $x^2>0$, sans changer le sens :

$$-\frac12\le\frac{\ln(1+x)-x}{x^2}\le-\frac12+\frac x3.$$

Les deux bornes tendent vers $-1/2$ en $0^+$. Or le quotient central est $(f(x)-f(0))/x$. **Donc $f$ est dérivable à droite en $0$ et $f'_d(0)=-1/2$.**`),
    written("3.a", String.raw`Étudie le sens de variation et le signe de $h(x)=x/(x+1)-\ln(1+x)$.`, String.raw`Pour $x\ge0$, $h'(x)=1/(x+1)^2-1/(x+1)=-x/(x+1)^2\le0$. Donc $h$ est décroissante et $h(0)=0$.

**$h(x)\le0$ sur $[0;+\infty[$ et $h(x)<0$ pour $x>0$.**`),
    written("3.b", String.raw`Démontre que $f'(x)=h(x)/x^2$ pour $x>0$.`, String.raw`Par quotient :

$$f'(x)=\frac{x/(1+x)-\ln(1+x)}{x^2}=\boxed{\frac{h(x)}{x^2}}.$$

Cette formule est donnée pour $x>0$ ; la dérivée à droite en $0$ a déjà été calculée séparément.`),
    written("3.c", "Dresse le tableau de variation de f, avec sa limite en l’infini.", String.raw`Pour $x>0$, $h(x)<0$ et $x^2>0$, donc $f'(x)<0$. De plus $\ln(1+x)/x\to0$ en $+\infty$, par comparaison à $\ln u/u$ avec $u=1+x$.

**$f$ est strictement décroissante de $f(0)=1$ vers $0$ sur $[0;+\infty[$.**

| $x$ | $0$ | $]0;+\infty[$ | $+\infty$ |
| --- | --- | --- | --- |
| $f'(x)$ | $-1/2$ à droite | $-$ | |
| $f(x)$ | $1$ | décroît | $0$ |`),
    written("4.a", String.raw`Construis la tangente $(T)$ au point d’abscisse $0$.`, String.raw`Le point de contact est $(0;1)$ et la pente à droite vaut $-1/2$. **La demi-tangente est supportée par $y=1-x/2$.**`),
    written("4.b", "Donne une asymptote à la courbe.", String.raw`Comme $\lim_{x\to+\infty}f(x)=0$, **la droite $y=0$ est une asymptote horizontale en $+\infty$**.`),
    written("4.c", "Trace la courbe.", String.raw`Place $(0;1)$ et la demi-tangente $y=1-x/2$, puis quelques points comme $(1;\ln2)$. La courbe reste positive, descend strictement et se rapproche de $y=0$. Il n’y a pas d’asymptote verticale en $0$, puisque la fonction y est prolongée continûment.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(38, "Logarithme, tangente et aire", String.raw`Sur $I=]4;+\infty[$, $f(x)=-2x+5+3\ln\left((x+1)/(x-4)\right)$. On note $(C)$ sa courbe dans un repère orthonormal d’unité graphique $1$ cm et $(D)$ la droite $y=-2x+5$.`, [
    limit("1.a.1", String.raw`Calcule $\displaystyle\lim_{x\to4^+}f(x)$.`, "+infini", String.raw`$(x+1)/(x-4)\to+\infty$ avec un dénominateur positif. Son logarithme tend vers $+\infty$, tandis que $-2x+5\to-3$. **La limite est $+\infty$.**`),
    limit("1.a.2", String.raw`Calcule $\displaystyle\lim_{x\to+\infty}f(x)$.`, "-infini", String.raw`Le quotient $(x+1)/(x-4)\to1$, donc son logarithme tend vers $0$. Comme $-2x+5\to-\infty$, **la limite de $f$ est $-\infty$**.`),
    written("1.b", "Étudie les variations et dresse le tableau.", String.raw`On dérive $\ln(x+1)-\ln(x-4)$ :

$$f'(x)=-2+3\left(\frac1{x+1}-\frac1{x-4}\right)=-2-\frac{15}{(x+1)(x-4)}.$$

Sur $I$, le dénominateur est positif, donc $f'(x)<0$. **$f$ est strictement décroissante de $+\infty$ en $4^+$ vers $-\infty$ en l’infini.**`),
    written("1.c", String.raw`Démontre que $(D)$ est une asymptote à $(C)$.`, String.raw`La différence vaut $f(x)-(-2x+5)=3\ln((x+1)/(x-4))$. Le quotient tend vers $1$, donc cette différence tend vers $3\ln1=0$. **$(D)$ est une asymptote oblique en $+\infty$.**`),
    written("1.d", String.raw`Précise la position de $(C)$ par rapport à $(D)$.`, String.raw`Pour $x>4$, $(x+1)/(x-4)=1+5/(x-4)>1$. Son logarithme est positif, donc $f(x)-(-2x+5)>0$. **$(C)$ est strictement au-dessus de $(D)$ sur $I$.**`),
    short("2.a", String.raw`Quelle est l’abscisse du point où la tangente a pour coefficient directeur $-9/2$ ?`, "$5$", ["5"], String.raw`Résoudre $-2-15/((x+1)(x-4))=-9/2$ donne $(x+1)(x-4)=6$, donc $(x-5)(x+2)=0$. Seule **$x=5$** appartient à $I$. Le point est $(5;-5+3\ln6)$.`),
    written("2.b", "Détermine une équation de cette tangente.", String.raw`Au point d’abscisse $5$, $f(5)=-5+3\ln6$ et la pente est $-9/2$. Donc :

$$y=-5+3\ln6-\frac92(x-5).$$

**La tangente est $y=-9x/2+35/2+3\ln6$.**`),
    written("3", "Trace les deux droites et la courbe.", String.raw`Trace l’asymptote verticale $x=4$, l’asymptote oblique $y=-2x+5$ et la tangente trouvée en $5$. La courbe est strictement décroissante, descend de $+\infty$ et reste au-dessus de l’asymptote oblique.`),
    written("4.a", String.raw`Détermine par intégration par parties les primitives de $k(x)=\ln x$ sur $]0;+\infty[$.`, String.raw`On prend $u=\ln x$, $v'=1$, donc $u'=1/x$ et $v=x$. L’intégration par parties donne une primitive :

$$x\ln x-\int x\frac1x\,dx=x\ln x-x.$$

**Toutes les primitives sont $x\ln x-x+C$.** Vérification par dérivation : $\ln x+1-1=\ln x$.`),
    written("4.b", String.raw`Vérifie que $G(x)=(x+1)\ln(x+1)-x$ est une primitive de $\ln(x+1)$ sur $I$.`, String.raw`Sur $I$, $x+1>0$. Par la règle du produit, $G'(x)=\ln(x+1)+(x+1)/(x+1)-1=\ln(x+1)$. **La primitive est vérifiée.**`),
    written("4.c", String.raw`Vérifie que $H(x)=(x-4)\ln(x-4)-x$ est une primitive de $\ln(x-4)$ sur $I$.`, String.raw`Sur $I$, $x-4>0$. On calcule $H'(x)=\ln(x-4)+(x-4)/(x-4)-1=\ln(x-4)$. **La primitive est vérifiée.**`),
    written("4.d", String.raw`Calcule l’aire entre $(C)$, $(D)$ et les droites $x=5$, $x=6$ ; donne une valeur exacte puis à $10^{-2}$ près.`, String.raw`$(C)$ est au-dessus de $(D)$, donc l’aire, en $\mathrm{cm^2}$, est :

$$\mathcal A=3\int_5^6\bigl(\ln(x+1)-\ln(x-4)\bigr)\,dx.$$

Les primitives vérifiées donnent $G-H=(x+1)\ln(x+1)-(x-4)\ln(x-4)$. En $6$, cette expression vaut $7\ln7-2\ln2$. En $5$, elle vaut $6\ln6$, car $\ln1=0$.

$$\boxed{\mathcal A=3(7\ln7-2\ln2-6\ln6)\approx4{,}45\ \mathrm{cm^2}.}$$`),
    written("5.a", String.raw`Démontre que $f(x)=0$ possède une unique solution $x_0$ sur $I$.`, String.raw`$f$ est continue, strictement décroissante sur $I$, et ses limites sont $+\infty$ et $-\infty$. Elle prend donc la valeur $0$ **une fois et une seule**, par le théorème des valeurs intermédiaires et la stricte monotonie.`),
    written("5.b", String.raw`Donne graphiquement un encadrement d’amplitude $0{,}5$ de $x_0$.`, String.raw`La courbe coupe l’axe entre $5$ et $5{,}5$. On peut confirmer $f(5)\approx0{,}3753>0$ et $f(5{,}5)\approx-1{,}6010<0$. **$5<x_0<5{,}5$**, d’amplitude $0{,}5$.`),
    written("5.c", String.raw`À la calculatrice, donne un encadrement d’amplitude $10^{-2}$ en précisant la méthode.`, String.raw`On effectue un balayage par pas de $0{,}01$ entre $5$ et $5{,}5$. On trouve $f(5{,}08)>0$ et $f(5{,}09)<0$. Comme $f$ est strictement décroissante :

$$\boxed{5{,}08<x_0<5{,}09.}$$

L’amplitude vaut $0{,}01$ ; une recherche plus fine donne $x_0\approx5{,}085642$.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
  ex(39, "Une famille de fonctions logarithmiques", String.raw`Soit $n\ge1$ un entier et $f_n(x)=(1+n\ln x)/x^2$ sur $]0;+\infty[$. On note $(C_n)$ sa courbe dans un repère orthonormal d’unité graphique $3$ cm.`, [
    written("1.a", String.raw`Justifie $\lim_{x\to0^+}f_n(x)=-\infty$.`, String.raw`Comme $n>0$, $1+n\ln x\to-\infty$. Le facteur $1/x^2$ est positif et tend vers $+\infty$. **Le produit tend donc vers $-\infty$.**`),
    written("1.b", String.raw`Justifie $\lim_{x\to+\infty}f_n(x)=0$.`, String.raw`On sépare : $f_n(x)=1/x^2+n((\ln x)/x)(1/x)$. Chaque terme tend vers $0$. **La limite est $0$.**`),
    written("1.c", "Interprète graphiquement les deux limites.", String.raw`Pour chaque $n\ge1$, **$x=0$ est une asymptote verticale**, et **$y=0$ une asymptote horizontale en $+\infty$**. Les points $x=0$ ne sont pas inclus dans les courbes.`),
    written("2.a", String.raw`Justifie $f'_n(x)=(n-2-2n\ln x)/x^3$.`, String.raw`Le numérateur a pour dérivée $n/x$. Par quotient :

$$f'_n(x)=\frac{(n/x)x^2-2x(1+n\ln x)}{x^4}.$$

On simplifie un facteur $x>0$ : **$f'_n(x)=(n-2-2n\ln x)/x^3$.**`),
    written("2.b", String.raw`Détermine les variations de $f_n$.`, String.raw`Le dénominateur est positif. Le numérateur s’annule pour $\ln x=(n-2)/(2n)$, soit $a_n=e^{(n-2)/(2n)}$.

Comme $n>0$, $n-2-2n\ln x$ est positif pour $x<a_n$ et négatif pour $x>a_n$. **$f_n$ croît jusqu’à $a_n$, puis décroît.**`),
    written("2.c", String.raw`Vérifie $f_n(a_n)=\dfrac n2e^{2/n-1}$.`, String.raw`$\ln a_n=(n-2)/(2n)$, donc $1+n\ln a_n=1+(n-2)/2=n/2$. De plus $a_n^2=e^{(n-2)/n}$.

Ainsi $f_n(a_n)=(n/2)e^{-(n-2)/n}=\boxed{(n/2)e^{2/n-1}}$.`),
    written("2.d", "Dresse le tableau de variation.", String.raw`| $x$ | $0^+$ | $]0;a_n[$ | $a_n=e^{(n-2)/(2n)}$ | $]a_n;+\infty[$ | $+\infty$ |
| --- | --- | --- | --- | --- | --- |
| $f'_n(x)$ | | $+$ | $0$ | $-$ | |
| $f_n(x)$ | $-\infty$ | croît | $(n/2)e^{2/n-1}$ | décroît | $0$ |`),
    written("3.a", String.raw`Justifie $f_{n+1}(x)-f_n(x)=\ln x/x^2$.`, String.raw`Les dénominateurs sont les mêmes. En soustrayant les numérateurs :

$$f_{n+1}(x)-f_n(x)=\frac{1+(n+1)\ln x-(1+n\ln x)}{x^2}=\boxed{\frac{\ln x}{x^2}}.$$`),
    written("3.b", String.raw`Déduis-en la position relative de $(C_n)$ et $(C_{n+1})$.`, String.raw`Le dénominateur $x^2$ est positif. Le signe de la différence est donc celui de $\ln x$.

- Pour $0<x<1$, $f_{n+1}<f_n$ : **$(C_{n+1})$ est en dessous de $(C_n)$**.
- En $1$, toutes les courbes passent par **$(1;1)$**.
- Pour $x>1$, $f_{n+1}>f_n$ : **$(C_{n+1})$ est au-dessus de $(C_n)$**.`),
  ], { correctionFigureKey: "tc-l4-functions" }),
];
