import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, written } from "./builders";
import { logarithmExercise as ex, limitAnswer as limit } from "./terminalCLogarithmsBuilders";

export const logarithmsDeepeningA: ArenaExerciseItem[] = [
  ex(18, "Simplifier des sommes", "Simplifie les expressions suivantes.", [
    written("a", String.raw`$\ln(1+\sqrt3)+\ln(\sqrt3-1)$.`, String.raw`Les deux arguments sont positifs. On regroupe en un seul logarithme :

$$\ln((1+\sqrt3)(\sqrt3-1)).$$

Le produit vaut $3-1=2$. **Le résultat est $\ln2$.**`),
    written("b", String.raw`$\ln(2+\sqrt3)+\ln(2-\sqrt3)$.`, String.raw`Comme $\sqrt3<2$, les deux arguments sont positifs. Leur produit vaut $(2+\sqrt3)(2-\sqrt3)=4-3=1$. La somme vaut donc **$\ln1=0$**.`),
    written("c", String.raw`$\ln2+\ln(2+\sqrt2)+\ln\left(2+\sqrt{2+\sqrt2}\right)+\ln\left(2-\sqrt{2+\sqrt2}\right)$.`, String.raw`Tous les arguments sont positifs : en particulier $2+\sqrt2<4$, donc $\sqrt{2+\sqrt2}<2$.

Regroupons d’abord les deux derniers logarithmes. Le produit des arguments vaut :

$$\left(2+\sqrt{2+\sqrt2}\right)\left(2-\sqrt{2+\sqrt2}\right)=2-\sqrt2.$$

La somme entière est donc $\ln(2(2+\sqrt2)(2-\sqrt2))=\ln(2(4-2))$. **Elle vaut $\ln4=2\ln2$.**`),
  ]),
  ex(19, "Calculs avec e", "Calcule ou simplifie chaque expression.", [
    short("1.a", String.raw`$\ln(1/e)$.`, "$-1$", ["-1"], String.raw`La propriété de l’inverse donne $\ln(1/e)=-\ln e=-1$.`),
    short("1.b", String.raw`$\ln(\sqrt e)$.`, "$1/2$", ["1/2", "0,5"], String.raw`$\sqrt e=e^{1/2}$, donc $\ln(\sqrt e)=\frac12\ln e=1/2$.`),
    short("1.c", String.raw`$\ln(e\sqrt e)$.`, "$3/2$", ["3/2", "1,5"], String.raw`$e\sqrt e=e^{3/2}$. Donc $\ln(e\sqrt e)=\frac32\ln e=3/2$.`),
    short("1.d", String.raw`$\ln\left(\dfrac{e\sqrt e}{e}\right)$.`, "$1/2$", ["1/2", "0,5"], String.raw`On simplifie d’abord le quotient par $e\ne0$ : il reste $\sqrt e$. Son logarithme est $1/2$.`),
    short("2.a", String.raw`$\ln(e^3)-\ln(e^2)$.`, "$1$", ["1"], String.raw`$\ln(e^3)=3$ et $\ln(e^2)=2$. La différence vaut $3-2=1$.`),
    short("2.b", String.raw`$5\ln(1/e)+4\ln(e\sqrt e)$.`, "$1$", ["1"], String.raw`On utilise les résultats précédents : $5\times(-1)+4\times(3/2)=-5+6=1$.`),
  ]),
  ex(20, "Limites et transformations", "Calcule les limites suivantes.", [
    limit("1.a", String.raw`$\displaystyle\lim_{x\to+\infty}\frac{x\ln x}{x+1}$.`, "+infini", String.raw`On écrit $x\ln x/(x+1)=(x/(x+1))\ln x$. Le premier facteur tend vers $1>0$ et le second vers $+\infty$. **La limite est $+\infty$.**`),
    limit("1.b", String.raw`$\displaystyle\lim_{x\to+\infty}\frac{\ln x}{\sqrt x}$.`, "0", String.raw`Posons $t=\sqrt x$, donc $x=t^2$ et $t\to+\infty$. L’expression devient $2\ln t/t$, qui tend vers **$0$**.`),
    limit("1.c", String.raw`$\displaystyle\lim_{x\to+\infty}x\ln(1+1/x)$.`, "1", String.raw`Posons $h=1/x$. Alors $h\to0^+$ et $x\ln(1+1/x)=\ln(1+h)/h$. Par la limite de référence, **la limite est $1$**.`),
    limit("1.d", String.raw`$\displaystyle\lim_{x\to+\infty}\frac{\ln(1+x^2)}{x^2}$.`, "0", String.raw`Posons $u=1+x^2\to+\infty$. On écrit $\ln(1+x^2)/x^2=(\ln u/u)(u/(u-1))$. Le premier facteur tend vers $0$ et le second vers $1$. **La limite est $0$.**`),
    limit("2.a", String.raw`$\displaystyle\lim_{x\to0^+}\frac{\ln x-2}{\ln x+1}$.`, "1", String.raw`On divise le numérateur et le dénominateur par $\ln x$, non nul près de $0$ :

$$\frac{1-2/\ln x}{1+1/\ln x}.$$

Puisque $1/\ln x\to0$, **la limite vaut $1$**.`),
    limit("2.b", String.raw`$\displaystyle\lim_{x\to0^+}x\ln(1+1/x)$.`, "0", String.raw`Pour $x>0$, $1+1/x=(1+x)/x$, donc $x\ln(1+1/x)=x\ln(1+x)-x\ln x$. Le premier terme tend vers $0$ car $\ln(1+x)\to0$, et le second tend vers $0$ par référence. **La limite est $0$.**`),
    limit("2.c", String.raw`$\displaystyle\lim_{x\to0^+}\frac{\ln(1+x)}{x^2}$.`, "+infini", String.raw`On écrit $\ln(1+x)/x^2=(\ln(1+x)/x)\times(1/x)$. Le premier facteur tend vers $1>0$ et le second vers $+\infty$. **La limite est $+\infty$.**`),
  ]),
  ex(21, "Un polynôme au service des logarithmes", String.raw`On utilise le polynôme $P(X)=2X^3-3X^2-3X+2$.`, [
    written("1", String.raw`Justifie $P(X)=(X+1)(2X^2-5X+2)$.`, String.raw`En développant :

$$(X+1)(2X^2-5X+2)=2X^3-5X^2+2X+2X^2-5X+2$$
$$=2X^3-3X^2-3X+2.$$

De plus $2X^2-5X+2=(2X-1)(X-2)$. Les zéros de $P$ sont donc **$-1$, $1/2$ et $2$**.`),
    written("2.a", String.raw`Résous $2\ln^3(x-1)-3\ln^2(x-1)-3\ln(x-1)+2=0$.`, String.raw`Il faut $x>1$. Posons $X=\ln(x-1)$. L’équation devient $P(X)=0$, donc $X=-1$, $X=1/2$ ou $X=2$.

On revient à $x$ : $x-1=e^{-1}$, $x-1=\sqrt e$ ou $x-1=e^2$. Les trois valeurs sont supérieures à $1$.

**$S=\{1+e^{-1};\ 1+\sqrt e;\ 1+e^2\}$.**`),
    written("2.b", String.raw`Résous $\ln(3x-2)-\ln(2x-3)\le2\ln x$.`, String.raw`Le domaine commun est $x>3/2$. Les arguments sont alors positifs et $2\ln x=\ln(x^2)$. L’inégalité équivaut à :

$$\frac{3x-2}{2x-3}\le x^2.$$

On multiplie par $2x-3>0$ sans changer le sens : $2x^3-3x^2-3x+2\ge0$. La factorisation donne $(x+1)(2x-1)(x-2)\ge0$.

Sur $x>3/2$, les deux premiers facteurs sont positifs. Il reste $x-2\ge0$. **$S=[2;+\infty[$.**`),
  ]),
  ex(22, "Systèmes logarithmiques", String.raw`Résous les systèmes dans $\mathbb R^2$.`, [
    written("a", String.raw`$\begin{cases}-\ln x+2\ln y=4,\\3\ln x+\ln y=-5.\end{cases}$`, String.raw`Il faut $x>0$ et $y>0$. Posons $X=\ln x$ et $Y=\ln y$. Le système devient $-X+2Y=4$ et $3X+Y=-5$.

De la première équation, $X=2Y-4$. Dans la seconde : $6Y-12+Y=-5$, donc $Y=1$ et $X=-2$.

On revient aux inconnues : **$(x;y)=(e^{-2};e)$**. Les deux coordonnées sont positives et vérifient les équations.`),
    written("b", String.raw`$\begin{cases}\ln(x+y)=0,\\xy=-2.\end{cases}$`, String.raw`Le logarithme impose seulement $x+y>0$, pas la positivité séparée de $x$ et $y$. La première équation donne $x+y=1$.

Deux nombres de somme $1$ et de produit $-2$ sont les racines de $T^2-T-2=0$, soit $(T-2)(T+1)=0$. **Les solutions sont $(2;-1)$ et $(-1;2)$.** Leur somme vaut bien $1>0$.`),
    written("c", String.raw`$\begin{cases}\dfrac1{\ln x}-\dfrac1{\ln y}=\dfrac73,\\\ln(x/y)=\dfrac72.\end{cases}$`, String.raw`Il faut $x,y>0$ et $x,y\ne1$. Posons $X=\ln x\ne0$ et $Y=\ln y\ne0$.

La seconde équation donne $X-Y=7/2$. La première devient $(Y-X)/(XY)=7/3$, donc $XY=-3/2$.

Avec $Y=X-7/2$, on obtient $2X^2-7X+3=0$, soit $(2X-1)(X-3)=0$.

- Si $X=1/2$, alors $Y=-3$ : $(x;y)=(\sqrt e;e^{-3})$.
- Si $X=3$, alors $Y=-1/2$ : $(x;y)=(e^3;e^{-1/2})$.

**Ces deux couples sont les solutions** et respectent les exclusions.`),
  ]),
  ex(23, "Équations et valeurs absolues", String.raw`Résous les équations dans $\mathbb R$.`, [
    written("a", String.raw`$(x-2)\ln(x-2)=0$.`, String.raw`Le domaine est $x>2$, donc $x-2$ n’est pas nul. Il reste $\ln(x-2)=0$, soit $x-2=1$. **$S=\{3\}$.** La valeur $2$ n’est pas une solution, car le logarithme y est interdit.`),
    written("b", String.raw`$\ln(x+2)+\ln(x-2)=\ln45$.`, String.raw`Le domaine est $x>2$. On regroupe : $\ln((x+2)(x-2))=\ln45$, donc $x^2-4=45$. Les racines sont $-7$ et $7$, mais seule $7$ appartient au domaine. **$S=\{7\}$.**`),
    written("c", String.raw`$\ln(x+4)+\ln(x-2)=\ln(5x-4)$.`, String.raw`Le domaine commun est $x>2$. On égalise les arguments après regroupement : $(x+4)(x-2)=5x-4$, soit $x^2-3x-4=0$.

La factorisation $(x-4)(x+1)=0$ donne $4$ et $-1$. Seul $4$ est permis. **$S=\{4\}$.**`),
    written("d", String.raw`$\ln|x+1|+\ln|x+5|=\ln15$.`, String.raw`Il faut $x\ne-1$ et $x\ne-5$. On regroupe : $\ln|(x+1)(x+5)|=\ln15$, donc $|x^2+6x+5|=15$.

Deux cas :

- $x^2+6x+5=15$ donne $(x+3)^2=19$, donc $x=-3\pm\sqrt{19}$.
- $x^2+6x+5=-15$ donne $(x+3)^2+11=0$, impossible dans $\mathbb R$.

Les deux valeurs du premier cas ne sont ni $-1$ ni $-5$. **$S=\{-3-\sqrt{19};-3+\sqrt{19}\}$.**`),
  ]),
  ex(24, "Inéquations à plusieurs logarithmes", String.raw`Résous dans $\mathbb R$.`, [
    written("a", String.raw`$\ln(2-3x)\ge0$.`, String.raw`Le domaine est $x<2/3$. En comparant à $\ln1=0$, l’inégalité équivaut à $2-3x\ge1$, donc $x\le1/3$. Ces valeurs respectent le domaine. **$S=]-\infty;1/3]$.**`),
    written("b", String.raw`$\ln(2x-e)>1$.`, String.raw`Il faut $x>e/2$. Comme $1=\ln e$, la croissance du logarithme donne $2x-e>e$, soit $x>e$. **$S=]e;+\infty[$.**`),
    written("c", String.raw`$\ln(2-x)+\ln(x+4)>\ln(3x+2)$.`, String.raw`Les trois conditions de définition donnent $-2/3<x<2$. Sur ce domaine, on regroupe les logarithmes puis on compare les arguments :

$$(2-x)(x+4)>3x+2\iff x^2+5x-6<0.$$

Comme $x^2+5x-6=(x+6)(x-1)$, cette inégalité donne $-6<x<1$. En tenant compte du domaine : **$S=]-2/3;1[$.**`),
    written("d", String.raw`$\ln(x+2)\le\ln(x^2-4)$.`, String.raw`Le domaine commun est $x>2$. La croissance de $\ln$ donne $x+2\le(x-2)(x+2)$. Comme $x+2>0$, on divise sans changer le sens : $1\le x-2$, soit $x\ge3$. **$S=[3;+\infty[$.**`),
  ]),
  ex(25, "Dériver des expressions logarithmiques", "Détermine le domaine de dérivabilité puis la dérivée de f dans chaque cas.", [
    written("a", String.raw`$f(x)=\ln\left(\dfrac{\ln(2x)}x\right)$.`, String.raw`Il faut $x>0$ pour $\ln(2x)$, puis $\ln(2x)/x>0$. Comme $x>0$, cela impose $\ln(2x)>0$, donc $x>1/2$.

Sur ce domaine, $f(x)=\ln(\ln(2x))-\ln x$. Comme $(\ln(2x))'=1/x$ :

$$f'(x)=\frac1{x\ln(2x)}-\frac1x=\boxed{\frac{1-\ln(2x)}{x\ln(2x)}}.$$`),
    written("b", String.raw`$f(x)=2/\sqrt x-\ln(\sqrt x)$.`, String.raw`Le domaine est $x>0$. On écrit $f(x)=2x^{-1/2}-(1/2)\ln x$. Donc :

$$\boxed{f'(x)=-x^{-3/2}-\frac1{2x}=-\frac1{x\sqrt x}-\frac1{2x}.}$$`),
    written("c", String.raw`$f(x)=(1-x)\ln(1-x)$.`, String.raw`Il faut $x<1$. On dérive le produit :

$$f'(x)=-\ln(1-x)+(1-x)\frac{-1}{1-x}.$$

**Ainsi $f'(x)=-\ln(1-x)-1$.**`),
    written("d", String.raw`$f(x)=x^2+(2+\ln x)/x$.`, String.raw`Le domaine est $x>0$. Pour le quotient, le numérateur a pour dérivée $1/x$. Ainsi :

$$f'(x)=2x+\frac{(1/x)x-(2+\ln x)}{x^2}.$$

On simplifie le numérateur $1-2-\ln x=-1-\ln x$ : **$f'(x)=2x-(1+\ln x)/x^2$.**`),
    written("e", String.raw`$f(x)=(\ln x)^2/x$.`, String.raw`Le domaine est $x>0$. La dérivée du numérateur est $2\ln x/x$. Par quotient :

$$f'(x)=\frac{(2\ln x/x)x-(\ln x)^2}{x^2}.$$

On factorise le numérateur : **$f'(x)=\ln x(2-\ln x)/x^2$.**`),
  ]),
  ex(26, "Une primitive passant par un point", String.raw`Dans chaque cas, détermine la primitive $F$ de $f$ sur $K$ vérifiant $F(x_0)=y_0$.`, [
    written("a", String.raw`$f(x)=5/(3-2x)$, $K=]3/2;+\infty[$, $x_0=2$, $y_0=3$.`, String.raw`Avec $u=3-2x$, $u'=-2$, on écrit $f=-(5/2)u'/u$. Sur $K$, $u<0$, donc les primitives sont $F(x)=-(5/2)\ln(2x-3)+C$.

La condition $F(2)=3$ donne $-(5/2)\ln1+C=3$, donc $C=3$.

$$\boxed{F(x)=-\frac52\ln(2x-3)+3.}$$

Sa dérivée est $-5/(2x-3)=f(x)$ et $F(2)=3$.`),
    written("b", String.raw`$f(x)=1/(x\ln x)$, $K=]1;+\infty[$, $x_0=e^2$, $y_0=2\ln2$.`, String.raw`Posons $u=\ln x>0$ sur $K$, donc $u'=1/x$. Une primitive de $u'/u$ est $\ln(\ln x)$. Ainsi $F(x)=\ln(\ln x)+C$.

En $e^2$, $\ln(e^2)=2$, donc $F(e^2)=\ln2+C=2\ln2$. D’où $C=\ln2$.

$$\boxed{F(x)=\ln(\ln x)+\ln2.}$$

La dérivation redonne $1/(x\ln x)$.`),
    written("c", String.raw`$f(x)=(\ln x)/x$, $K=]0;+\infty[$, $x_0=e$, $y_0=3/2$.`, String.raw`Avec $u=\ln x$, $u'=1/x$, la forme $u'u$ donne $F(x)=(\ln x)^2/2+C$. En $e$ : $F(e)=1/2+C=3/2$, donc $C=1$.

$$\boxed{F(x)=\frac{(\ln x)^2}2+1.}$$

Sa dérivée est $f$ et $F(e)=3/2$.`),
  ]),
  ex(27, "Décomposer avant de primitiver", String.raw`Sur $K=]1;+\infty[$, $f(x)=\dfrac{-3x^2+17x-4}{3x^2-4x+1}$.`, [
    short("1.a", String.raw`Dans $f(x)=a+b/(1-3x)-c/(1-x)$, calcule $a$.`, "$-1$", ["-1"], String.raw`Le dénominateur est $(3x-1)(x-1)$. Après réduction, le coefficient de $x^2$ est $3a=-3$, donc **$a=-1$**.`),
    short("1.b", "Calcule b.", "$2$", ["2"], String.raw`L’identification des autres coefficients donne $-b+3c=13$ et $b-c=-3$. On obtient $c=5$, puis **$b=2$**.`),
    short("1.c", "Calcule c.", "$5$", ["5"], String.raw`Avec $b=c-3$ et $-b+3c=13$, on a $-(c-3)+3c=13$, donc $2c=10$ et **$c=5$**.`),
    written("1.d", "Vérifie la décomposition.", String.raw`On a $3x^2-4x+1=(3x-1)(x-1)$. En mettant $-1+2/(1-3x)-5/(1-x)$ au même dénominateur, le numérateur devient :

$$-(3x-1)(x-1)-2(x-1)+5(3x-1)$$
$$=-3x^2+17x-4.$$

**La décomposition est donc vérifiée.**`),
    written("2", String.raw`Détermine la primitive $F$ sur $K$ telle que $F(2)=\ln(25)/3$.`, String.raw`Sur $K$, $3x-1>0$ et $x-1>0$. On primitive la décomposition :

$$F(x)=-x-\frac23\ln(3x-1)+5\ln(x-1)+C.$$

En $2$, $F(2)=-2-\frac23\ln5+C$. Or $\ln25/3=\frac23\ln5$. La condition donne donc $C=2+\frac43\ln5$.

$$\boxed{F(x)=-x-\frac23\ln(3x-1)+5\ln(x-1)+2+\frac43\ln5.}$$

La dérivation redonne $f$ et la substitution $x=2$ redonne la valeur imposée.`),
  ]),
];
