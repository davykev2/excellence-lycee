import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, tf, written } from "./builders";
import { primitiveExercise as ex, primitivePart as part } from "./terminalCPrimitivesBuilders";

export const primitivesDeepeningA: ArenaExerciseItem[] = [
  ex(13, "Vrai ou faux", "Réponds par Vrai ou Faux à chaque affirmation.", [
    tf("1", String.raw`$F(x)=x^3-x^2/2+7x-2$ est une primitive de $f(x)=5x^2-x+7$ sur $\mathbb R$.`, false, String.raw`$F'(x)=3x^2-x+7$, qui est différent de $5x^2-x+7$. **Faux.** Pour primitiver $5x^2$, il faudrait $5x^3/3$.`),
    tf("2", String.raw`Une fonction continue sur un intervalle $I$ admet des primitives sur $I$.`, true, String.raw`**Vrai.** C’est la propriété d’existence des primitives : la continuité sur un intervalle suffit.`),
    tf("3", String.raw`Si $F$ est une primitive de $f$ sur un intervalle $I$ et $F(a)=b$, avec $a\in I$, elle est l’unique primitive sur $I$ satisfaisant cette même condition $F(a)=b$.`, true, String.raw`**Vrai.** Si $G$ est une autre primitive sur $I$, $G-F$ est constante. Si $G(a)=F(a)=b$, cette constante vaut zéro ; donc $G=F$. L’unicité porte bien sur la valeur imposée, pas sur toutes les primitives sans condition.`),
    tf("4", String.raw`Si $F$ est une primitive de $f$ sur $\mathbb R$, alors $G(x)=F(x)+5$ en est aussi une.`, true, String.raw`**Vrai.** La dérivée de $5$ est nulle : $G'(x)=F'(x)+0=f(x)$.`),
  ]),
  ex(14, "Primitives usuelles et racine cubique", "Détermine une primitive F sur l’intervalle I dans chaque cas.", [
    part("1", String.raw`$f(x)=x^2$, $I=\mathbb R$.`, String.raw`\frac{x^3}3`, String.raw`La règle des puissances donne $x^{2+1}/(2+1)=x^3/3$. Sa dérivée est $x^2$.`, String.raw`\mathbb R`),
    part("2", String.raw`$f(x)=1/\sqrt x$, $I=]0;+\infty[$.`, String.raw`2\sqrt x`, String.raw`Pour $x>0$, $(\sqrt x)'=1/(2\sqrt x)$. On multiplie donc par $2$ pour obtenir exactement $1/\sqrt x$.`, String.raw`]0;+\infty[`),
    part("3", String.raw`$f(x)=1/x^2$, $I=]0;+\infty[$.`, String.raw`-\frac1x`, String.raw`On écrit $f(x)=x^{-2}$. Une primitive est $x^{-1}/(-1)=-1/x$, dont la dérivée vaut $1/x^2$.`, String.raw`]0;+\infty[`),
    part("4", String.raw`$f(x)=\sqrt[3]x=x^{1/3}$, $I=]0;+\infty[$.`, String.raw`\frac34x^{4/3}`, String.raw`L’exposant devient $1/3+1=4/3$. Diviser par $4/3$ revient à multiplier par $3/4$. Vérification : $(3/4)\times(4/3)x^{1/3}=x^{1/3}$.`, String.raw`]0;+\infty[`),
    part("5", String.raw`$f(x)=1/x^3$, $I=]0;+\infty[$.`, String.raw`-\frac1{2x^2}`, String.raw`$x^{-3}$ a pour primitive $x^{-2}/(-2)=-1/(2x^2)$. Le signe moins disparaît à la dérivation car $(-1/2)\times(-2)=1$.`, String.raw`]0;+\infty[`),
    part("6", String.raw`$f(x)=\sin x$, $I=\mathbb R$.`, String.raw`-\cos x`, String.raw`La dérivée de $-\cos x$ est $\sin x$. Il faut conserver le signe moins.`, String.raw`\mathbb R`),
  ]),
  ex(15, "Ajuster les coefficients", "Détermine une primitive F sur l’intervalle I dans chaque cas.", [
    part("1", String.raw`$f(x)=-9{,}8x+5$, $I=\mathbb R$.`, String.raw`-4{,}9x^2+5x`, String.raw`Une primitive de $-9{,}8x$ est $-9{,}8x^2/2=-4{,}9x^2$, et une primitive de $5$ est $5x$. Leur somme a pour dérivée $-9{,}8x+5$.`, String.raw`\mathbb R`),
    part("2", String.raw`$f(x)=3/(3x+1)^2$, $I=]-1/3;+\infty[$.`, String.raw`-\frac1{3x+1}`, String.raw`Posons $u=3x+1$, donc $u'=3$ et $u>0$ sur $I$. La dérivée de $-1/u$ vaut $u'/u^2=3/(3x+1)^2$.`, String.raw`]-1/3;+\infty[`),
    part("3", String.raw`$f(x)=5/\sqrt{2x-1}$, $I=]1/2;+\infty[$.`, String.raw`5\sqrt{2x-1}`, String.raw`Posons $u=2x-1>0$ ; $u'=2$. Comme $f=(5/2)u'/\sqrt u$, une primitive est $(5/2)\times2\sqrt u=5\sqrt u$. Sa dérivée vaut $5\times2/(2\sqrt{2x-1})=f(x)$.`, String.raw`]1/2;+\infty[`),
    part("4", String.raw`$f(x)=2x\cos(x^2-1)$, $I=\mathbb R$.`, String.raw`\sin(x^2-1)`, String.raw`Posons $u=x^2-1$, donc $u'=2x$. La fonction est $u'\cos u$, de primitive $\sin u$. En dérivant, on retrouve $2x\cos(x^2-1)$.`, String.raw`\mathbb R`),
    part("5", String.raw`$f(x)=(2x-1)\sqrt{x^2-x+5}$, $I=\mathbb R$.`, String.raw`\frac23(x^2-x+5)^{3/2}`, String.raw`Posons $u=x^2-x+5=(x-1/2)^2+19/4>0$, donc $u'=2x-1$. On primitive $u'u^{1/2}$ : $u^{3/2}/(3/2)=(2/3)u^{3/2}$. Sa dérivée est bien $u'\sqrt u$.`, String.raw`\mathbb R`),
  ]),
  ex(16, "Une condition initiale polynomiale", String.raw`Soit $g(x)=3x^2-4x+7$ sur $\mathbb R$. Détermine sa primitive $G$ telle que $G(1)=3$.`, [
    short("1.a", String.raw`Dans $G(x)=x^3-2x^2+7x+C$, calcule $C$.`, "$-3$", ["-3"], String.raw`$G(1)=1-2+7+C=6+C$. L’égalité $6+C=3$ donne **$C=-3$**.`),
    written("1.b", "Rédige la détermination de G.", String.raw`$g$ est continue sur $\mathbb R$. En primitivant chaque terme, $G(x)=x^3-2x^2+7x+C$. La condition donne $1-2+7+C=3$, donc $C=-3$.

$$\boxed{G(x)=x^3-2x^2+7x-3.}$$

Vérification : $G'(x)=3x^2-4x+7$ et $G(1)=1-2+7-3=3$.`),
  ]),
  ex(17, "Une condition initiale trigonométrique", String.raw`Soit $g(x)=\cos(3x)-\dfrac12\cos x$ sur $\mathbb R$. Détermine sa primitive $G$ telle que $G(\pi/4)=0$.`, [
    written("1", "Détermine et vérifie G.", String.raw`La dérivée de $\sin(3x)$ est $3\cos(3x)$ : il faut diviser par $3$. Toutes les primitives sont donc :

$$G(x)=\frac{\sin(3x)}3-\frac{\sin x}2+C.$$

Or $\sin(3\pi/4)=\sin(\pi/4)=\sqrt2/2$. En remplaçant $x$ par $\pi/4$ :

$$G(\pi/4)=\frac{\sqrt2}6-\frac{\sqrt2}4+C=-\frac{\sqrt2}{12}+C.$$

La condition impose $C=\sqrt2/12$. **Ainsi :**

$$\boxed{G(x)=\frac{\sin(3x)}3-\frac{\sin x}2+\frac{\sqrt2}{12}.}$$

Sa dérivée est $g$ et les deux termes en $\sqrt2/12$ se compensent en $\pi/4$.`),
  ]),
  ex(18, "Décomposer une fraction rationnelle", String.raw`Sur $]1;+\infty[$, on donne $h(x)=\dfrac{2x^3-7x^2+8x-1}{(x-1)^2}$.`, [
    short("1.a", String.raw`Dans $h(x)=ax+b+c/(x-1)^2$, détermine $a$.`, "$2$", ["2"], String.raw`Après mise au même dénominateur, le terme de degré $3$ du numérateur est $ax^3$. Il doit être égal à $2x^3$, donc **$a=2$**.`),
    short("1.b", String.raw`Détermine $b$.`, "$-3$", ["-3"], String.raw`Le coefficient de $x^2$ est $b-2a=-7$. Avec $a=2$, on a $b-4=-7$, donc **$b=-3$**.`),
    short("1.c", String.raw`Détermine $c$.`, "$2$", ["2"], String.raw`Le terme constant est $b+c=-1$. Avec $b=-3$, on trouve $-3+c=-1$, donc **$c=2$**.`),
    written("1.d", "Justifie la décomposition par un calcul.", String.raw`Pour $x>1$, on peut mettre au même dénominateur :

$$ax+b+\frac c{(x-1)^2}=\frac{(ax+b)(x-1)^2+c}{(x-1)^2}.$$

Le numérateur développé est $ax^3+(b-2a)x^2+(a-2b)x+b+c$. L’identification donne $a=2$, $b=-3$, $c=2$ ; on vérifie aussi $a-2b=8$.

**Donc $h(x)=2x-3+2/(x-1)^2$.**`),
    written("2", String.raw`Détermine la primitive $H$ telle que $H(2)=0$.`, String.raw`On primitive la décomposition :

$$H(x)=x^2-3x-\frac2{x-1}+C.$$

En $2$, $H(2)=4-6-2+C=-4+C$. La condition donne $C=4$.

$$\boxed{H(x)=x^2-3x-\frac2{x-1}+4.}$$

Vérification : $H'(x)=2x-3+2/(x-1)^2=h(x)$ et $H(2)=0$.`),
  ]),
  ex(19, "Une primitive avec un radical", String.raw`Soit $f(x)=x\sqrt{3-x}$ sur son domaine réel.`, [
    written("1", String.raw`Détermine $D_f$.`, String.raw`La racine existe si et seulement si $3-x\ge0$, soit $x\le3$. **Ainsi $D_f=]-\infty;3]$.** Pour la dérivation demandée ensuite, on travaille sur $D_f\setminus\{3\}=]-\infty;3[$.`),
    short("2.a", String.raw`Pour que $F(x)=(ax^2+bx+c)\sqrt{3-x}$ soit une primitive sur $]-\infty;3[$, calcule $a$.`, String.raw`$\dfrac25$`, ["2/5", "0,4"], String.raw`La dérivation donne un coefficient de $x^2$ égal à $-5a/2$ au numérateur sur $\sqrt{3-x}$. Il faut $-5a/2=-1$, donc **$a=2/5$**.`),
    short("2.b", "Calcule b.", String.raw`$-\dfrac25$`, ["-2/5", "-0,4"], String.raw`L’identification du coefficient de $x$ donne $6a-3b/2=3$. Avec $a=2/5$, $12/5-3b/2=3$, d’où **$b=-2/5$**.`),
    short("2.c", "Calcule c.", String.raw`$-\dfrac{12}5$`, ["-12/5", "-2,4"], String.raw`Le terme constant doit être nul : $3b-c/2=0$, donc $c=6b$. Avec $b=-2/5$, **$c=-12/5$**.`),
    written("2.d", "Détaille la dérivation et l’identification.", String.raw`Pour $x<3$, on dérive le produit, avec $(\sqrt{3-x})'=-1/(2\sqrt{3-x})$ :

$$F'(x)=(2ax+b)\sqrt{3-x}-\frac{ax^2+bx+c}{2\sqrt{3-x}}.$$

Au même dénominateur, le numérateur est :

$$-\frac{5a}2x^2+\left(6a-\frac{3b}2\right)x+3b-\frac c2.$$

Or $f(x)=x(3-x)/\sqrt{3-x}$. On identifie avec $-x^2+3x$, ce qui donne $a=2/5$, $b=-2/5$, $c=-12/5$. Une primitive est donc :

$$F_0(x)=\frac25(x^2-x-6)\sqrt{3-x}.$$`),
    written("3", String.raw`Déduis-en la primitive qui s’annule en $-1$.`, String.raw`Toutes les primitives sur $]-\infty;3[$ sont $F_0+C$. En $-1$ :

$$F_0(-1)=\frac25(1+1-6)\sqrt4=-\frac{16}5.$$

On impose $-16/5+C=0$, donc $C=16/5$.

$$\boxed{F(x)=\frac25(x^2-x-6)\sqrt{3-x}+\frac{16}5.}$$

Sa dérivée est $f$ et sa valeur en $-1$ est nulle.`),
  ]),
  ex(20, "Primitiver le cube du sinus", String.raw`On étudie $h(x)=\sin^3x$ sur $\mathbb R$.`, [
    written("1", String.raw`Démontre que $\sin^3x=\sin x-\sin x\cos^2x$.`, String.raw`L’identité $\sin^2x+\cos^2x=1$ donne $\sin^2x=1-\cos^2x$. On multiplie par $\sin x$ :

$$\sin^3x=\sin x(1-\cos^2x)=\sin x-\sin x\cos^2x.$$`),
    written("2", String.raw`Détermine toutes les primitives de $h$.`, String.raw`On utilise la décomposition précédente. Une primitive de $\sin x$ est $-\cos x$.

Pour $-\sin x\cos^2x$, posons $u=\cos x$, $u'=-\sin x$. Une primitive de $u'u^2$ est $u^3/3$.

**Toutes les primitives sont donc :**

$$H(x)=-\cos x+\frac{\cos^3x}3+C.$$

La dérivée est $\sin x-\sin x\cos^2x=\sin^3x$.`),
    written("3", String.raw`Déduis-en la primitive de $h$ prenant la valeur $2/3$ en $\pi$.`, String.raw`Comme $\cos\pi=-1$, on a $H(\pi)=1-1/3+C=2/3+C$. La condition impose $C=0$.

$$\boxed{H(x)=-\cos x+\frac{\cos^3x}3.}$$`),
  ]),
  ex(21, "Associer deux puissances trigonométriques", String.raw`Soit $f(x)=\cos^3x\sin^6x$ sur $\mathbb R$.`, [
    part("1", "Détermine une primitive de f.", String.raw`\frac{\sin^7x}7-\frac{\sin^9x}9`, String.raw`On garde un facteur $\cos x$ pour obtenir la dérivée du sinus, puis on remplace $\cos^2x$ par $1-\sin^2x$ :

$$f(x)=\cos x(1-\sin^2x)\sin^6x.$$

Avec $u=\sin x$ et $u'=\cos x$, cela donne $u'(u^6-u^8)$. On primitive les deux termes : $u^7/7-u^9/9$. Sa dérivée est $\cos x(\sin^6x-\sin^8x)=f(x)$.`, String.raw`\mathbb R`),
  ]),
  ex(22, "Une fonction sans primitive sur l’intervalle", String.raw`Soit $f(x)=E(x)$ sur $[0;1]$, où $E(x)$ est la partie entière de $x$. On a donc $f(x)=0$ pour $0\le x<1$ et $f(1)=1$. À l’extrémité $1$, la dérivée est entendue à gauche.`, [
    written("1", String.raw`Justifie que $f$ n’admet pas de primitive sur $[0;1]$.`, String.raw`Raisonnons par l’absurde. Supposons qu’une primitive $F$ existe sur $[0;1]$.

Sur $]0;1[$, $F'(x)=f(x)=0$. Donc $F$ est constante sur cet intervalle, et aussi sur $[0;1[$ par continuité. Notons sa valeur $k$.

Comme $F$ serait dérivable à gauche en $1$, elle y serait continue : $F(1)=k$. Pour $x<1$, le taux à gauche vaudrait alors :

$$\frac{F(x)-F(1)}{x-1}=\frac{k-k}{x-1}=0.$$

On aurait $F'_g(1)=0$, alors qu’il faudrait $F'_g(1)=f(1)=1$. **C’est impossible : $f$ n’a pas de primitive sur $[0;1]$.**

La simple absence de continuité de $f$ ne suffirait pas comme preuve : la propriété du cours donne une condition suffisante, pas une équivalence.`),
  ]),
  ex(23, "Une primitive au point de raccord", String.raw`Soient $F(x)=x|x|$ et $f(x)=2|x|$ sur $\mathbb R$.`, [
    written("1", String.raw`Justifie que $F$ est une primitive de $f$ sur $\mathbb R$.`, String.raw`**Pour $x>0$**, $F(x)=x^2$, donc $F'(x)=2x=2|x|$.

**Pour $x<0$**, $F(x)=-x^2$, donc $F'(x)=-2x=2|x|$.

**En $0$**, $F(0)=0$ et, pour $x\ne0$ :

$$\frac{F(x)-F(0)}{x}=\frac{x|x|}{x}=|x|\longrightarrow0.$$

Ainsi $F$ est dérivable en $0$ avec $F'(0)=0=2|0|$. **On a donc $F'=f$ sur tout $\mathbb R$ ; $F$ est bien une primitive.**`),
  ]),
  ex(24, "Quatre primitives avec une valeur imposée", "Dans chaque cas, détermine la primitive F sur I telle que F(a) = b.", [
    written("a", String.raw`$f(x)=\dfrac{x^5+x^4+3x^2}{x^2}$, $I=]0;+\infty[$, $a=1$, $b=0$.`, String.raw`Pour $x>0$, on simplifie par $x^2\ne0$ : $f(x)=x^3+x^2+3$. Ainsi :

$$F(x)=\frac{x^4}4+\frac{x^3}3+3x+C.$$

En $1$, $F(1)=1/4+1/3+3+C=43/12+C$. Donc $C=-43/12$.

$$\boxed{F(x)=\frac{x^4}4+\frac{x^3}3+3x-\frac{43}{12}.}$$

Sa dérivée est $f$ et $F(1)=0$.`),
    written("b", String.raw`$f(x)=2x(x^3+2x)$, $I=\mathbb R$, $a=0$, $b=0$.`, String.raw`On développe : $f(x)=2x^4+4x^2$. Ses primitives sont $F(x)=2x^5/5+4x^3/3+C$. En $0$, $F(0)=C$, donc $C=0$.

$$\boxed{F(x)=\frac25x^5+\frac43x^3.}$$

On vérifie $F'=2x^4+4x^2=f$ et $F(0)=0$.`),
    written("c", String.raw`$f(x)=\dfrac{\cos x}{\sin^2x}$, $I=]0;\pi/2[$, $a=\pi/4$, $b=1$.`, String.raw`Sur $I$, $\sin x>0$. En posant $u=\sin x$, $u'=\cos x$, une primitive est $-1/u$. Ainsi $F(x)=-1/\sin x+C$.

Or $\sin(\pi/4)=\sqrt2/2$, donc $F(\pi/4)=-\sqrt2+C=1$. D’où $C=1+\sqrt2$.

$$\boxed{F(x)=-\frac1{\sin x}+1+\sqrt2.}$$

La dérivée est $f$ et $F(\pi/4)=-\sqrt2+1+\sqrt2=1$.`),
    written("d", String.raw`$f(x)=\cos x\sin^3x$, $I=\mathbb R$, $a=\pi$, $b=0$.`, String.raw`Posons $u=\sin x$, donc $u'=\cos x$. La fonction est $u'u^3$, d’où $F(x)=\sin^4x/4+C$.

Comme $\sin\pi=0$, $F(\pi)=C=0$. **La primitive cherchée est $F(x)=\sin^4x/4$.** Sa dérivée est $\cos x\sin^3x$.`),
  ]),
];
