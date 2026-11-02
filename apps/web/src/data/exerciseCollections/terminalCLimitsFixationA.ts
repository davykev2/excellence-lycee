import { choice, exercise, short, tf, written } from "./builders";
const r = String.raw;

export const limitsFixationA = [
  exercise(1, "Limites de référence : vrai ou faux", "Indique Vrai si l’affirmation est vraie et Faux dans le cas contraire.", [
    tf("a)", r`$\displaystyle\lim_{x\to+\infty}\frac{2\pi}{3}=0$.`, false, r`Une fonction constante garde la même valeur : $\displaystyle\lim_{x\to+\infty}\frac{2\pi}{3}=\frac{2\pi}{3}$, et non $0$. **L’affirmation est fausse.**`),
    tf("b)", r`$\displaystyle\lim_{x\to0}\frac{3\sin(2x)}{4x}=\frac32$.`, true, r`**Réécrivons l’expression.** Pour $x\ne0$ :

$$\frac{3\sin(2x)}{4x}=\frac32\,\frac{\sin(2x)}{2x}.$$

**Posons $u=2x$.** Lorsque $x\to0$, on a $u\to0$.

**Utilisons la limite de référence**, les angles étant exprimés en radians :

$$\lim_{u\to0}\frac{\sin u}{u}=1.$$

Ainsi, le quotient $\frac{\sin(2x)}{2x}$ tend vers $1$. Par produit :

$$\lim_{x\to0}\frac{3\sin(2x)}{4x}=\frac32\times1.$$

$$\boxed{\lim_{x\to0}\frac{3\sin(2x)}{4x}=\frac32.}$$

**L’affirmation est vraie.**`),
    tf("c)", r`$\displaystyle\lim_{x\to2^-}\frac{1-x}{2-x}=+\infty$.`, false, r`Lorsque $x\to2^-$, $1-x\to-1$ et $2-x\to0^+$. Un nombre strictement négatif divisé par un nombre positif tendant vers zéro tend vers $-\infty$. **Faux.**`),
    tf("d)", r`$\displaystyle\lim_{x\to+\infty}\frac{x-1}{x\sqrt x}=0$.`, true, r`Pour $x>0$, $\frac{x-1}{x\sqrt x}=\frac1{\sqrt x}-\frac1{x\sqrt x}$. Les deux termes tendent vers zéro en $+\infty$ ; la limite est $0$. **Vrai.**`),
  ]),
  exercise(2, "Calculer des limites de référence", "Calcule les limites suivantes.", [
    short("a)", r`$\displaystyle\lim_{x\to-3^-}\frac1{(x+3)^3}$.`, "$-\\infty$", ["-∞", "-infini"], r`Pour $x<-3$, $(x+3)^3<0$ et $(x+3)^3\to0^-$. Ainsi $\boxed{\displaystyle\lim_{x\to-3^-}\frac1{(x+3)^3}=-\infty}$.`),
    short("b)", r`$\displaystyle\lim_{x\to0}\frac{1-\cos x}{2x^2}$.`, "$1/4$", ["1/4"], r`**Faisons apparaître une limite de référence.** Pour $x\ne0$ :

$$\frac{1-\cos x}{2x^2}=\frac12\,\frac{1-\cos x}{x^2}.$$

En radians, on sait que :

$$\lim_{x\to0}\frac{1-\cos x}{x^2}=\frac12.$$

Par produit, la limite cherchée vaut donc $\frac12\times\frac12$ :

$$\boxed{\lim_{x\to0}\frac{1-\cos x}{2x^2}=\frac14.}$$`),
    short("c)", r`$\displaystyle\lim_{x\to0}\frac{x\cos x}{\sin x}$.`, "$1$", ["1"], r`**Réécrivons le quotient** pour retrouver $\frac{\sin x}{x}$. Au voisinage de $0$, pour $x\ne0$ :

$$\frac{x\cos x}{\sin x}=\frac{\cos x}{\dfrac{\sin x}{x}}.$$

**Car :**

$$\begin{cases}
\displaystyle\lim_{x\to0}\cos x=1,\\[5pt]
\displaystyle\lim_{x\to0}\frac{\sin x}{x}=1.
\end{cases}$$

La limite du dénominateur étant non nulle, la règle du quotient s’applique :

$$\boxed{\lim_{x\to0}\frac{x\cos x}{\sin x}=\frac11=1.}$$`),
  ]),
  exercise(3, "Factoriser avant de passer à la limite", "Calcule les limites suivantes.", [
    short("a)", r`$\displaystyle\lim_{x\to-2}\frac{x^4-16}{x+2}$.`, "$-32$", ["-32"], r`**Factorisons le numérateur** afin de simplifier la forme $0/0$ :

$$x^4-16=(x^2-4)(x^2+4).$$

$$x^4-16=(x-2)(x+2)(x^2+4).$$

Pour $x\ne-2$, on peut simplifier par $x+2$ :

$$\frac{x^4-16}{x+2}=(x-2)(x^2+4).$$

Le membre de droite est un polynôme, donc il est continu en $-2$. Ainsi, la limite du quotient est $(-2-2)((-2)^2+4)=(-4)\times8$.

$$\boxed{\lim_{x\to-2}\frac{x^4-16}{x+2}=-32.}$$`),
    short("b)", r`$\displaystyle\lim_{x\to-1}\frac{x+1}{x^3+1}$.`, "$1/3$", ["1/3"], r`**Utilisons l’identité de la somme de deux cubes :**

$$x^3+1=(x+1)(x^2-x+1).$$

Pour $x\ne-1$, on simplifie par $x+1$ :

$$\frac{x+1}{x^3+1}=\frac1{x^2-x+1}.$$

Quand $x\to-1$, le dénominateur tend vers $(-1)^2-(-1)+1=3\ne0$. La règle du quotient donne :

$$\boxed{\lim_{x\to-1}\frac{x+1}{x^3+1}=\frac13.}$$`),
  ]),
  exercise(4, "Valeur absolue et expression conjuguée", "Calcule les limites suivantes.", [
    short("a)", r`$\displaystyle\lim_{x\to0^-}\frac{2x}{|x|}$.`, "$-2$", ["-2"], r`À gauche de zéro, $x<0$, donc $|x|=-x$. Pour ces valeurs, $\frac{2x}{|x|}=-2$. **La limite à gauche vaut $-2$.**`),
    short("b)", r`$\displaystyle\lim_{x\to2}\frac{\sqrt{x+7}-3}{x-2}$.`, "$1/6$", ["1/6"], r`**Utilisons l’expression conjuguée** $\sqrt{x+7}+3$ pour faire disparaître la racine au numérateur.

Pour $x\ne2$, au voisinage de $2$ :

$$\frac{\sqrt{x+7}-3}{x-2}
=\frac{x+7-9}{(x-2)(\sqrt{x+7}+3)}.$$

Le numérateur obtenu est $x-2$. Après simplification :

$$\frac{\sqrt{x+7}-3}{x-2}=\frac1{\sqrt{x+7}+3}.$$

Le nouveau dénominateur tend vers $\sqrt9+3=6\ne0$. Par quotient :

$$\boxed{\lim_{x\to2}\frac{\sqrt{x+7}-3}{x-2}=\frac16.}$$`),
  ]),
  exercise(5, "Repérer la limite juste", "Parmi les quatre limites suivantes, sélectionne le numéro de celle qui est juste.", [
    choice("Choix", "Quelle affirmation est juste ?", [
      r`1) $\displaystyle\lim_{x\to-1^-}\frac{x^3-1}{x+1}=-\infty$`,
      r`2) $\displaystyle\lim_{x\to-1^-}\frac{x^3-1}{x+1}=-2$`,
      r`3) $\displaystyle\lim_{x\to-1^-}\frac{x^3-1}{x+1}=+\infty$`,
      r`4) $\displaystyle\lim_{x\to-1^-}\frac{x^3-1}{x+1}=2$`,
    ], 2, r`À gauche de $-1$, $x+1\to0^-$ tandis que $x^3-1\to-2$. Le quotient de ces deux quantités négatives tend vers $+\infty$. **La proposition 3 est la seule juste.**`),
  ]),
  exercise(6, "Une fonction définie par morceaux en −2", r`On considère $f$ définie par :

$$f(x)=\begin{cases}x^3+8&\text{si }x\le-2,\\ \sqrt{x^2+1}&\text{si }x>-2.\end{cases}$$`, [
    written("Étude", r`Étudie la limite de $f$ en $-2$.`, r`**À gauche :** la branche utilisée est $x^3+8$, donc $\lim_{x\to-2^-}f(x)=(-2)^3+8=0$.

**À droite :** la branche utilisée est $\sqrt{x^2+1}$, donc $\lim_{x\to-2^+}f(x)=\sqrt5$.

Comme $0\ne\sqrt5$, **$f$ n’a pas de limite en $-2$**, même si $f(-2)=0$. La valeur au point ne remplace pas la comparaison des deux limites latérales.`),
  ]),
  exercise(7, "Deux raccordements d’une fonction par morceaux", r`Soit $g$ définie sur $\mathbb R$ par :

$$g(x)=\begin{cases}-2x^2+3&\text{si }x<-1,\\2+x&\text{si }-1\le x<2,\\0&\text{si }x\ge2.\end{cases}$$`, [
    written("1)", r`Étudie la limite de $g$ en $-1$.`, r`À gauche, $-2x^2+3\to-2+3=1$. À droite, $2+x\to1$. Les limites latérales sont égales : **$\lim_{x\to-1}g(x)=1$**. De plus, $g(-1)=1$.`),
    written("2)", r`Étudie la limite de $g$ en $2$.`, r`À gauche, $2+x\to4$. À droite, la fonction est constante et vaut $0$. Puisque $4\ne0$, **$g$ n’a pas de limite en $2$**.`),
  ]),
  exercise(8, "Opérations et signes à l’infini", "Calcule les limites suivantes.", [
    short("1)", r`$\displaystyle\lim_{x\to+\infty}(x^2-|x|+\sqrt x)$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour $x>0$, $|x|=x$. Ainsi $x^2-x+\sqrt x=x^2(1-\frac1x+\frac1{x^{3/2}})$. Le premier facteur tend vers $+\infty$ et le second vers $1>0$. **La limite est $+\infty$.**`),
    short("2)", r`$\displaystyle\lim_{x\to1^-}\frac{\sqrt x+1}{\sqrt{1-x}}$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Le numérateur tend vers $2>0$ et le dénominateur vers $0^+$. Le quotient tend donc vers **$+\infty$**. L’approche par la gauche respecte le domaine $0\le x<1$.`),
  ]),
  exercise(9, "Lever des formes indéterminées", "Calcule les limites suivantes.", [
    short("a)", r`$\displaystyle\lim_{x\to3}\frac{\sqrt{x+1}-2}{x-3}$.`, "$1/4$", ["1/4"], r`**Multiplions par l’expression conjuguée** $\sqrt{x+1}+2$. Pour $x\ne3$, au voisinage de $3$ :

$$\frac{\sqrt{x+1}-2}{x-3}
=\frac{x+1-4}{(x-3)(\sqrt{x+1}+2)}.$$

Comme $x+1-4=x-3$, on simplifie :

$$\frac{\sqrt{x+1}-2}{x-3}=\frac1{\sqrt{x+1}+2}.$$

Quand $x\to3$, le dénominateur tend vers $\sqrt4+2=4\ne0$.

$$\boxed{\lim_{x\to3}\frac{\sqrt{x+1}-2}{x-3}=\frac14.}$$`),
    short("b)", r`$\displaystyle\lim_{x\to-2}\frac{\sqrt{x^2-1}-\sqrt3}{x+2}$.`, r`$-\frac2{\sqrt3}$`, ["-2/√3", "-2sqrt(3)/3", "-2/sqrt(3)"], r`**Multiplions par l’expression conjuguée** $\sqrt{x^2-1}+\sqrt3$ :

$$\frac{\sqrt{x^2-1}-\sqrt3}{x+2}
=\frac{x^2-4}{(x+2)(\sqrt{x^2-1}+\sqrt3)}.$$

Or $x^2-4=(x-2)(x+2)$. Pour $x\ne-2$, au voisinage de $-2$, on obtient :

$$\frac{\sqrt{x^2-1}-\sqrt3}{x+2}
=\frac{x-2}{\sqrt{x^2-1}+\sqrt3}.$$

Le numérateur tend vers $-4$ et le dénominateur vers $2\sqrt3\ne0$. Par quotient :

$$\lim_{x\to-2}\frac{\sqrt{x^2-1}-\sqrt3}{x+2}
=\frac{-4}{2\sqrt3}.$$

$$\boxed{\lim_{x\to-2}\frac{\sqrt{x^2-1}-\sqrt3}{x+2}
=-\frac2{\sqrt3}.}$$`),
    short("c)", r`$\displaystyle\lim_{x\to0}\frac{x}{1-\cos x}$.`, "La limite n’existe pas", ["n'existe pas", "n’existe pas", "pas de limite", "DNE", "aucune limite"], r`**Faisons apparaître une limite de référence.** Pour $x\ne0$ suffisamment proche de $0$ :

$$\frac{x}{1-\cos x}=\frac1x\,\frac{x^2}{1-\cos x}.$$

**Car :** $\frac{1-\cos x}{x^2}$ tend vers $\frac12\ne0$. Par passage à l’inverse :

$$\lim_{x\to0}\frac{x^2}{1-\cos x}=2.$$

Le deuxième facteur tend donc vers un réel strictement positif. Le signe du premier dépend du côté de l’approche :

$$\lim_{x\to0^+}\frac{x}{1-\cos x}=+\infty.$$

$$\lim_{x\to0^-}\frac{x}{1-\cos x}=-\infty.$$

**Les limites à droite et à gauche sont différentes : la limite bilatérale en $0$ n’existe pas.**`),
  ]),
  exercise(10, "Vérifier des limites calculées", "Indique si chacune des limites annoncées est vraie ou fausse.", [
    tf("1)", r`$\displaystyle\lim_{x\to-\infty}(\sqrt{2x^2+1}+x)=+\infty$.`, true, r`Lorsque $x<0$, $\sqrt{2x^2+1}+x=(-x)(\sqrt{2+1/x^2}-1)$. Les facteurs tendent respectivement vers $+\infty$ et $\sqrt2-1>0$. **La limite est $+\infty$ : vrai.**`),
    tf("2)", r`$\displaystyle\lim_{x\to+\infty}(\sqrt{x^2+1}-\sqrt{x^2-1})=0$.`, true, r`La conjugaison donne $\frac2{\sqrt{x^2+1}+\sqrt{x^2-1}}$. Le dénominateur tend vers $+\infty$, donc la limite est $0$. **Vrai.**`),
    tf("3)", r`$\displaystyle\lim_{x\to-\infty}\frac{\sqrt{x^2+1}}x=1$.`, false, r`Pour $x<0$, $\frac{\sqrt{x^2+1}}x=-\sqrt{1+1/x^2}\to-1$. **Faux : la limite est $-1$.**`),
    tf("4)", r`$\displaystyle\lim_{x\to+\infty}\frac{\sqrt{9x+2}}{\sqrt{4x-1}}=\frac32$.`, true, r`Pour $x$ assez grand, le quotient est $\sqrt{\frac{9+2/x}{4-1/x}}$. La continuité de la racine carrée en $9/4$ donne **$\sqrt{9/4}=\frac32$ : vrai.**`),
  ]),
  exercise(11, "Racines carrées à l’infini", "Calcule les limites suivantes.", [
    short("a)", r`$\displaystyle\lim_{x\to+\infty}\left(\sqrt{x^2+3}-\frac x2\right)$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour $x>0$, l’expression est $x(\sqrt{1+3/x^2}-\frac12)$. La parenthèse tend vers $\frac12>0$ ; le produit tend vers **$+\infty$**.`),
    short("b)", r`$\displaystyle\lim_{x\to-\infty}\frac{\sqrt{x^2+x+1}}{x-2}$.`, "$-1$", ["-1"], r`Pour $x<0$, la racine vaut $-x\sqrt{1+1/x+1/x^2}$. En divisant numérateur et dénominateur par $x$, on obtient $-\frac{\sqrt{1+1/x+1/x^2}}{1-2/x}\to\boxed{-1}$.`),
    short("c)", r`$\displaystyle\lim_{x\to-\infty}(\sqrt{x^2-4}-5x)$.`, "$+\\infty$", ["+∞", "∞", "+infini"], r`Pour $x<0$, $\sqrt{x^2-4}-5x=(-x)(\sqrt{1-4/x^2}+5)$. Les facteurs tendent vers $+\infty$ et $6>0$. **La limite est $+\infty$.**`),
  ]),
  exercise(12, "Limites par composition", "Calcule les limites suivantes.", [
    short("a)", r`$\displaystyle\lim_{x\to0}\frac{\sin(5x)}x$.`, "$5$", ["5"], r`**Faisons apparaître le même argument au numérateur et au dénominateur.** Pour $x\ne0$ :

$$\frac{\sin(5x)}x=5\,\frac{\sin(5x)}{5x}.$$

**Posons $u=5x$.** Lorsque $x\to0$, on a $u\to0$. La limite de référence, en radians, est :

$$\lim_{u\to0}\frac{\sin u}{u}=1.$$

Par composition puis par produit :

$$\boxed{\lim_{x\to0}\frac{\sin(5x)}x=5\times1=5.}$$`),
    short("b)", r`$\displaystyle\lim_{x\to0}\frac{1-\cos(4\pi x)}{x^2}$.`, r`$8\pi^2$`, ["8π²", "8*pi^2", "8pi^2"], r`**Posons $u=4\pi x$.** Lorsque $x\to0$, on a $u\to0$. Pour $x\ne0$, $u^2=16\pi^2x^2$, donc :

$$\frac{1-\cos(4\pi x)}{x^2}
=16\pi^2\,\frac{1-\cos u}{u^2}.$$

**Utilisons la limite de référence**, en radians :

$$\lim_{u\to0}\frac{1-\cos u}{u^2}=\frac12.$$

La constante $16\pi^2$ reste en facteur. La limite cherchée vaut $16\pi^2\times\frac12$ :

$$\boxed{\lim_{x\to0}\frac{1-\cos(4\pi x)}{x^2}=8\pi^2.}$$`),
    short("c)", r`$\displaystyle\lim_{x\to+\infty}\sqrt{\frac{3x-1}{x+2}}$.`, r`$\sqrt3$`, ["√3", "sqrt(3)", "3^(1/2)"], r`Le quotient sous la racine tend vers $3>0$ et il est positif pour $x$ assez grand. La racine carrée est continue en $3$. **La limite vaut $\sqrt3$.**`),
  ]),
  exercise(13, "Composer avec racine et valeur absolue", "Calcule les limites suivantes.", [
    short("1)", r`$\displaystyle\lim_{x\to0}\sqrt{\frac{\sin(8x)}{2x}}$.`, "$2$", ["2"], r`**Étudions d’abord l’expression sous la racine.** Pour $x\ne0$ :

$$\frac{\sin(8x)}{2x}=4\,\frac{\sin(8x)}{8x}.$$

**Posons $u=8x$.** Lorsque $x\to0$, on a $u\to0$. En radians :

$$\lim_{u\to0}\frac{\sin u}{u}=1.$$

On en déduit :

$$\lim_{x\to0}\frac{\sin(8x)}{2x}=4\times1=4.$$

Cette limite est strictement positive : l’expression sous la racine est donc positive pour $x$ non nul suffisamment proche de $0$. La racine carrée est continue en $4$. Par composition :

$$\boxed{\lim_{x\to0}\sqrt{\frac{\sin(8x)}{2x}}=\sqrt4=2.}$$`),
    short("2)", r`$\displaystyle\lim_{x\to+\infty}\left|\frac{2+5x-3x^2}{1+6x^2}\right|$.`, "$1/2$", ["1/2"], r`En divisant par $x^2$, le quotient tend vers $-\frac36=-\frac12$. La valeur absolue est continue sur $\mathbb R$ ; **la limite est $\frac12$**.`),
    short("3)", r`$\displaystyle\lim_{x\to3}\sqrt{4-|x|}$.`, "$1$", ["1"], r`Quand $x\to3$, $4-|x|\to1>0$. Les fonctions valeur absolue et racine sont continues aux points considérés, donc **la limite vaut $\sqrt1=1$**.`),
  ]),
  exercise(14, "Associer une limite à son résultat", "Fais correspondre chaque limite à son résultat. Les résultats proposés sont ceux des deux colonnes du support.", [
    choice("1)", r`$\displaystyle\lim_{x\to0}\sin\left(2x-\frac\pi6\right)$.`, ["−∞", "+∞", "−1/2", "1/2", "1"], 2, r`Par continuité du sinus, la limite est $\sin(-\pi/6)=-\frac12$.`, "select"),
    choice("2)", r`$\displaystyle\lim_{x\to0}\sqrt{\frac{2x+1}{x+4}}$.`, ["−∞", "+∞", "−1/2", "1/2", "1"], 3, r`Le quotient tend vers $\frac14>0$, donc la racine tend vers $\sqrt{1/4}=\frac12$.`, "select"),
    choice("3)", r`$\displaystyle\lim_{x\to-\infty}\frac{-x^2+3}{2(x+1)}$.`, ["−∞", "+∞", "−1/2", "1/2", "1"], 1, r`Le quotient s’écrit $-\frac x2\frac{1-3/x^2}{1+1/x}$. Le premier facteur tend vers $+\infty$ et le second vers $1$ : la limite est $+\infty$.`, "select"),
    choice("4)", r`$\displaystyle\lim_{x\to+\infty}\cos\left(\frac1{2\sqrt x}\right)$.`, ["−∞", "+∞", "−1/2", "1/2", "1"], 4, r`L’argument tend vers $0$. Par continuité du cosinus, la limite est $\cos0=1$.`, "select"),
  ]),
];
