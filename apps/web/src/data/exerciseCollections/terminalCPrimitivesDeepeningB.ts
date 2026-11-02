import type { ArenaExerciseItem } from "../../domain/arenaExercises";
import { short, written } from "./builders";
import { primitiveExercise as ex, primitivePart as part } from "./terminalCPrimitivesBuilders";

export const primitivesDeepeningB: ArenaExerciseItem[] = [
  ex(25, "Linéariser des puissances quatrièmes", String.raw`Sur $\mathbb R$, $f(x)=\cos^4x$, $g(x)=\sin^4x$ et $h(x)=2\cos^2x\sin^2x$.`, [
    written("1.a", String.raw`On pose $m=f-g$. Détermine ses primitives $M$.`, String.raw`On factorise une différence de carrés :

$$m(x)=(\cos^2x-\sin^2x)(\cos^2x+\sin^2x)=\cos(2x).$$

La dérivée de $\sin(2x)$ est $2\cos(2x)$. Il faut donc diviser par $2$ : **$M(x)=\sin(2x)/2+C$.**`),
    written("1.b", String.raw`On pose $n=f+g+h$. Détermine ses primitives $N$.`, String.raw`On reconnaît le carré d’une somme :

$$n(x)=\cos^4x+\sin^4x+2\cos^2x\sin^2x=(\cos^2x+\sin^2x)^2=1.$$

**Les primitives sont $N(x)=x+C$.**`),
    written("2.a", String.raw`Exprime $\cos(4x)$ en fonction de $\cos x$ et de $\sin x$.`, String.raw`La formule de l’angle double donne $\cos(4x)=\cos^2(2x)-\sin^2(2x)$. Avec $\cos(2x)=\cos^2x-\sin^2x$ et $\sin(2x)=2\sin x\cos x$ :

$$\cos(4x)=(\cos^2x-\sin^2x)^2-4\sin^2x\cos^2x.$$

On développe le carré, puis regroupe :

$$\boxed{\cos(4x)=\cos^4x+\sin^4x-6\cos^2x\sin^2x.}$$`),
    written("2.b", String.raw`On pose $t=f+g-3h$. Détermine une primitive $T$ de $t$.`, String.raw`Puisque $3h(x)=6\cos^2x\sin^2x$, le résultat précédent donne $t(x)=\cos(4x)$. **Une primitive est $T(x)=\sin(4x)/4$**, car sa dérivée est $\cos(4x)$.`),
    written("3.a", "Déduis-en toutes les primitives F de f.", String.raw`On a $n=f+g+h$, $t=f+g-3h$ et $m=f-g$. En soustrayant, $h=(n-t)/4$, puis $f+g=(3n+t)/4$.

Donc $f=(3n+t+4m)/8$, soit :

$$f(x)=\frac38+\frac18\cos(4x)+\frac12\cos(2x).$$

On primitive terme à terme en divisant aussi par les coefficients $4$ et $2$ des angles :

$$\boxed{F(x)=\frac{3x}8+\frac{\sin(4x)}{32}+\frac{\sin(2x)}4+C.}$$`),
    written("3.b", "Déduis-en toutes les primitives G de g.", String.raw`On utilise $g=(3n+t-4m)/8$, donc $g(x)=3/8+\cos(4x)/8-\cos(2x)/2$.

**Ses primitives sont :**

$$\boxed{G(x)=\frac{3x}8+\frac{\sin(4x)}{32}-\frac{\sin(2x)}4+C.}$$

La dérivation redonne les trois termes de $g$.`),
    written("3.c", "Déduis-en toutes les primitives H de h.", String.raw`Comme $h=(n-t)/4$, on a $h(x)=1/4-\cos(4x)/4$. **Ses primitives sont :**

$$\boxed{H(x)=\frac x4-\frac{\sin(4x)}{16}+C.}$$

En dérivant, on retrouve $(1-\cos(4x))/4=2\cos^2x\sin^2x$. Dans les trois familles, les constantes sont indépendantes.`),
  ]),
  ex(26, "Puissances de fonctions composées", "Dans chaque cas, détermine une primitive de f.", [
    part("1", String.raw`$f(x)=3(3x+1)^4$.`, String.raw`\frac{(3x+1)^5}5`, String.raw`Posons $u=3x+1$, donc $u'=3$. Une primitive de $u'u^4$ est $u^5/5$, dont la dérivée est bien $3(3x+1)^4$.`, String.raw`\mathbb R`),
    part("2", String.raw`$f(x)=(2x+7)^6$.`, String.raw`\frac{(2x+7)^7}{14}`, String.raw`Avec $u=2x+7$, $u'=2$, on écrit $f=(1/2)u'u^6$. Une primitive est donc $(1/2)u^7/7=u^7/14$. Vérification : $7\times2/14=1$.`, String.raw`\mathbb R`),
    part("3", String.raw`$f(x)=(6x-2)(3x^2-2x+3)^5$.`, String.raw`\frac{(3x^2-2x+3)^6}6`, String.raw`Posons $u=3x^2-2x+3$, donc $u'=6x-2$. On reconnaît $u'u^5$, de primitive $u^6/6$. Le facteur $6$ se simplifie à la dérivation.`, String.raw`\mathbb R`),
    part("4", String.raw`$f(x)=\sin x\cos x$.`, String.raw`\frac{\sin^2x}2`, String.raw`Avec $u=\sin x$, $u'=\cos x$, on reconnaît $u'u$. Une primitive est $u^2/2$. Sa dérivée est $\sin x\cos x$. Une autre réponse correcte est $-\cos^2x/2$, qui en diffère d’une constante.`, String.raw`\mathbb R`),
  ]),
  ex(27, "Fractions et puissances négatives", "Détermine une primitive dans chaque cas, sur chacun des intervalles de définition.", [
    part("1", String.raw`$f(x)=4/(1+4x)^2$.`, String.raw`-\frac1{1+4x}`, String.raw`Posons $u=1+4x$, donc $u'=4$. La dérivée de $-1/u$ vaut $u'/u^2=f$. Le point $-1/4$ est exclu.`, String.raw`]-\infty;-1/4[\ \text{ou}\ ]-1/4;+\infty[`),
    part("2", String.raw`$f(x)=2/(4-3x)^2$.`, String.raw`\frac2{3(4-3x)}`, String.raw`Posons $u=4-3x$, donc $u'=-3$. Comme $(1/u)'=-u'/u^2=3/u^2$, on multiplie par $2/3$. On obtient $2/(3u)$, dont la dérivée vaut $2/u^2$. Le point $4/3$ est exclu.`, String.raw`]-\infty;4/3[\ \text{ou}\ ]4/3;+\infty[`),
    part("3", String.raw`$f(x)=\dfrac{4x-10}{(x^2-5x+6)^3}$.`, String.raw`-\frac1{(x^2-5x+6)^2}`, String.raw`Posons $u=x^2-5x+6=(x-2)(x-3)$, donc $u'=2x-5$. Le numérateur vaut $2u'$. Une primitive de $2u'/u^3$ est $-1/u^2$, car $(-u^{-2})'=2u'u^{-3}$. On exclut $2$ et $3$.`, String.raw`]-\infty;2[,\ ]2;3[\ \text{ou}\ ]3;+\infty[`),
  ]),
  ex(28, "Radicaux composés", "Détermine une primitive de f sur son intervalle de définition dans chaque cas.", [
    part("1", String.raw`$f(x)=4/\sqrt{4x+1}$.`, String.raw`2\sqrt{4x+1}`, String.raw`Il faut $4x+1>0$, soit $x>-1/4$. Avec $u=4x+1$, $u'=4$, on reconnaît $u'/\sqrt u$. Une primitive est $2\sqrt u$, dont la dérivée est $4/\sqrt{4x+1}$.`, String.raw`]-1/4;+\infty[`),
    part("2", String.raw`$f(x)=1/\sqrt{2-7x}$.`, String.raw`-\frac27\sqrt{2-7x}`, String.raw`Il faut $2-7x>0$, soit $x<2/7$. Posons $u=2-7x$, donc $u'=-7$. On écrit $f=-(1/7)u'/\sqrt u$, de primitive $-(2/7)\sqrt u$. Vérification : $(-2/7)\times(-7)/(2\sqrt u)=1/\sqrt u$.`, String.raw`]-\infty;2/7[`),
    part("3", String.raw`$f(x)=\dfrac{2x+1}{\sqrt{x^2+x+1}}$.`, String.raw`2\sqrt{x^2+x+1}`, String.raw`$u=x^2+x+1=(x+1/2)^2+3/4>0$ et $u'=2x+1$. La fonction est $u'/\sqrt u$, de primitive $2\sqrt u$. Le domaine est tout $\mathbb R$.`, String.raw`\mathbb R`),
    part("4", String.raw`$f(x)=\dfrac{\cos x}{\sqrt{2+\sin x}}$.`, String.raw`2\sqrt{2+\sin x}`, String.raw`Puisque $-1\le\sin x\le1$, $2+\sin x\ge1>0$. Avec $u=2+\sin x$, $u'=\cos x$, on applique la formule $u'/\sqrt u\longmapsto2\sqrt u$.`, String.raw`\mathbb R`),
  ]),
  ex(29, "Retrouver une primitive par dérivation", String.raw`Soit $g(x)=x\sqrt x$ sur $]0;+\infty[$.`, [
    written("1", String.raw`Détermine $g'$.`, String.raw`On peut écrire $g(x)=x^{3/2}$. Donc $g'(x)=(3/2)x^{1/2}$, soit **$g'(x)=3\sqrt x/2$**.

Avec la règle du produit, on retrouve $g'(x)=\sqrt x+x/(2\sqrt x)=3\sqrt x/2$.`),
    written("2", String.raw`Déduis-en une primitive de $f(x)=\sqrt x$ sur $]0;+\infty[$.`, String.raw`Puisque $g'=(3/2)f$, on a $f=(2/3)g'$. **Une primitive est donc :**

$$\boxed{F(x)=\frac23x\sqrt x.}$$

En dérivant, $F'=(2/3)\times(3/2)\sqrt x=\sqrt x=f(x)$.`),
  ]),
  ex(30, "Décomposer autour de x + 1", String.raw`Soit $f(x)=\dfrac{3x+4}{(x+1)^3}$, définie pour $x\ne-1$.`, [
    short("1.a", String.raw`Dans $f(x)=a/(x+1)^2+b/(x+1)^3$, calcule $a$.`, "$3$", ["3"], String.raw`Le numérateur devient $a(x+1)+b=ax+a+b$. En identifiant le coefficient de $x$ avec $3x+4$, **$a=3$**.`),
    short("1.b", "Calcule b.", "$1$", ["1"], String.raw`Les termes constants donnent $a+b=4$. Avec $a=3$, on obtient **$b=1$**.`),
    written("1.c", "Justifie la décomposition.", String.raw`Pour $x\ne-1$ :

$$\frac3{(x+1)^2}+\frac1{(x+1)^3}=\frac{3(x+1)+1}{(x+1)^3}=\frac{3x+4}{(x+1)^3}=f(x).$$`),
    written("2", String.raw`Déduis-en une primitive de $f$ sur $]-1;+\infty[$.`, String.raw`On primitive les deux termes de la décomposition :

$$\boxed{F(x)=-\frac3{x+1}-\frac1{2(x+1)^2}.}$$

En effet, $(-3/(x+1))'=3/(x+1)^2$ et $(-1/(2(x+1)^2))'=1/(x+1)^3$. Leur somme vaut $f$.`),
  ]),
  ex(31, "Une fraction avec un pôle en −2", String.raw`Soit $f(x)=\dfrac{2x^3+5x^2-4x-7}{(x+2)^2}$, définie pour $x\ne-2$.`, [
    short("1.a", String.raw`Dans $f(x)=ax+b+c/(x+2)^2$, calcule $a$.`, "$2$", ["2"], String.raw`Après mise au même dénominateur, le coefficient de $x^3$ est $a$. L’identification avec le numérateur donne **$a=2$**.`),
    short("1.b", "Calcule b.", "$-3$", ["-3"], String.raw`Le coefficient de $x^2$ vaut $4a+b=5$. Avec $a=2$, $8+b=5$, donc **$b=-3$**.`),
    short("1.c", "Calcule c.", "$5$", ["5"], String.raw`Le terme constant est $4b+c=-7$. Avec $b=-3$, $-12+c=-7$, donc **$c=5$**.`),
    written("1.d", "Justifie l’identification.", String.raw`On développe $(ax+b)(x+2)^2+c$ :

$$ax^3+(4a+b)x^2+(4a+4b)x+4b+c.$$

Avec $a=2$, $b=-3$, $c=5$, les coefficients sont $2$, $5$, $-4$ et $-7$. **Donc $f(x)=2x-3+5/(x+2)^2$.**`),
    written("2", String.raw`Détermine la primitive $F$ sur $]-2;+\infty[$ telle que $F(0)=3$.`, String.raw`On travaille sur l’intervalle contenant $0$. Toutes les primitives y sont :

$$F(x)=x^2-3x-\frac5{x+2}+C.$$

En $0$, $F(0)=-5/2+C=3$, donc $C=11/2$. **Ainsi :**

$$\boxed{F(x)=x^2-3x-\frac5{x+2}+\frac{11}2.}$$

Sa dérivée est $f$ et $F(0)=3$. La condition en $0$ ne détermine pas une constante sur l’autre intervalle $]-\infty;-2[$.`),
  ]),
  ex(32, "Simplifier avant de primitiver", String.raw`Soit $f(x)=\dfrac{3x^2+6x+4}{(x+1)^2}$, pour $x\ne-1$.`, [
    short("1.a", String.raw`Dans $f(x)=a+b/(x+1)^2$, calcule $a$.`, "$3$", ["3"], String.raw`Le numérateur est $a(x+1)^2+b=ax^2+2ax+a+b$. Le coefficient de $x^2$ donne **$a=3$**.`),
    short("1.b", "Calcule b.", "$1$", ["1"], String.raw`Le terme constant donne $a+b=4$. Avec $a=3$, **$b=1$**. On vérifie $2a=6$ pour le coefficient de $x$.`),
    written("1.c", "Vérifie la décomposition.", String.raw`On a $3x^2+6x+4=3(x+1)^2+1$. En divisant par $(x+1)^2\ne0$, on obtient **$f(x)=3+1/(x+1)^2$**.`),
    written("2", String.raw`Détermine la primitive $F$ sur $]-1;+\infty[$ telle que $F(2)=-1$.`, String.raw`Les primitives sont $F(x)=3x-1/(x+1)+C$. En $2$ :

$$F(2)=6-\frac13+C=\frac{17}3+C.$$

La condition $F(2)=-1$ donne $C=-1-17/3=-20/3$.

$$\boxed{F(x)=3x-\frac1{x+1}-\frac{20}3.}$$

Sa dérivée est $f$ et $F(2)=18/3-1/3-20/3=-1$.`),
  ]),
  ex(33, "Une somme qui se simplifie", String.raw`Sur $\mathbb R$, $f(x)=(2x+1)\cos^2x$, $g(x)=(2x+1)\sin^2x$ et $h=f+g$.`, [
    written("1", String.raw`Détermine la primitive $H$ de $h$ telle que $H(-1)=0$.`, String.raw`On factorise $2x+1$, puis on utilise $\cos^2x+\sin^2x=1$ :

$$h(x)=(2x+1)(\cos^2x+\sin^2x)=2x+1.$$

Ainsi $H(x)=x^2+x+C$. Comme $H(-1)=1-1+C=C=0$, on obtient :

$$\boxed{H(x)=x^2+x.}$$

Sa dérivée vaut $2x+1=h(x)$ et $H(-1)=0$. Il n’était pas utile de primitiver $f$ et $g$ séparément.`),
  ]),
  ex(34, "Une décomposition à vérifier", String.raw`Soit $g(x)=\dfrac{3x^2+12x-1}{(x+2)^2}$ sur $]-2;+\infty[$.`, [
    written("1", String.raw`Vérifie que $g(x)=3-13/(x+2)^2$.`, String.raw`On met au même dénominateur :

$$3-\frac{13}{(x+2)^2}=\frac{3(x+2)^2-13}{(x+2)^2}.$$

Or $3(x+2)^2-13=3x^2+12x+12-13=3x^2+12x-1$. **La décomposition est vérifiée.**`),
    written("2", String.raw`Déduis-en la primitive $G$ telle que $G(1)=4$.`, String.raw`La primitive de $-13/(x+2)^2$ est $13/(x+2)$. Donc $G(x)=3x+13/(x+2)+C$.

En $1$, $G(1)=3+13/3+C=22/3+C=4$. Ainsi $C=4-22/3=-10/3$.

$$\boxed{G(x)=3x+\frac{13}{x+2}-\frac{10}3.}$$

Vérification : $G'(x)=3-13/(x+2)^2=g(x)$ et $G(1)=9/3+13/3-10/3=4$.`),
  ]),
  ex(35, "Primitives de cosinus carré et sinus carré", String.raw`Sur $\mathbb R$, $f(x)=\cos^2x$, $g(x)=\sin^2x$, $m=f-g$ et $n=f+g$.`, [
    written("1.a", "Détermine les primitives M de m.", String.raw`L’identité de l’angle double donne $m(x)=\cos^2x-\sin^2x=\cos(2x)$. **Ses primitives sont $M(x)=\sin(2x)/2+C$.** La division par $2$ compense la dérivée de $2x$.`),
    written("1.b", "Détermine les primitives N de n.", String.raw`$n(x)=\cos^2x+\sin^2x=1$. **Ses primitives sont $N(x)=x+C$.**`),
    written("2.a", "Déduis-en les primitives F de f.", String.raw`Comme $m=f-g$ et $n=f+g$, on additionne : $m+n=2f$. Donc $f(x)=(1+\cos(2x))/2$.

En primitivant les deux termes :

$$\boxed{F(x)=\frac x2+\frac{\sin(2x)}4+C.}$$

Sa dérivée est $1/2+\cos(2x)/2=\cos^2x$.`),
    written("2.b", "Déduis-en les primitives G de g.", String.raw`Cette fois $n-m=2g$, donc $g(x)=(1-\cos(2x))/2$. **Ses primitives sont :**

$$\boxed{G(x)=\frac x2-\frac{\sin(2x)}4+C.}$$

Sa dérivée est $1/2-\cos(2x)/2=\sin^2x$. Les constantes des deux familles sont indépendantes.`),
  ]),
  ex(36, "Une division polynomiale utile", String.raw`Soit $f(x)=\dfrac{x^3+5x^2+7x+4}{x^2+2x+1}$, définie pour $x\ne-1$.`, [
    written("1", String.raw`Justifie l’identité $x^3+5x^2+7x+4=(x+3)(x^2+2x+1)+1$.`, String.raw`On développe le membre de droite :

$$x(x^2+2x+1)+3(x^2+2x+1)+1$$
$$=x^3+2x^2+x+3x^2+6x+3+1$$
$$=x^3+5x^2+7x+4.$$

**L’identité est vérifiée pour tout réel $x$.**`),
    written("2", String.raw`Déduis-en une primitive $F$ de $f$ sur $]-\infty;-1[$.`, String.raw`Sur cet intervalle, $x^2+2x+1=(x+1)^2\ne0$. L’identité donne $f(x)=x+3+1/(x+1)^2$. En primitivant terme à terme :

$$\boxed{F(x)=\frac{x^2}2+3x-\frac1{x+1}.}$$

Sa dérivée est $x+3+1/(x+1)^2=f(x)$.`),
    written("3", String.raw`Détermine la primitive $G$ sur $]-\infty;-1[$ telle que $G(-2)=5$.`, String.raw`On écrit $G=F+C$. En $-2$ :

$$F(-2)=\frac42-6-\frac1{-1}=2-6+1=-3.$$

Donc $G(-2)=-3+C=5$, d’où $C=8$.

$$\boxed{G(x)=\frac{x^2}2+3x-\frac1{x+1}+8.}$$`),
  ]),
  ex(37, "Deux pôles et deux carrés", String.raw`Soit $f(x)=\dfrac{x^2+x+1}{(x^2-1)^2}$ sur $]1;+\infty[$.`, [
    short("1.a", String.raw`Dans $f(x)=a/(x-1)^2+b/(x+1)^2$, calcule $a$.`, String.raw`$\dfrac34$`, ["3/4", "0,75"], String.raw`Le numérateur commun est $a(x+1)^2+b(x-1)^2$. On identifie $a+b=1$ et $2(a-b)=1$. En additionnant $a+b=1$ et $a-b=1/2$, **$a=3/4$**.`),
    short("1.b", "Calcule b.", String.raw`$\dfrac14$`, ["1/4", "0,25"], String.raw`Avec $a+b=1$ et $a=3/4$, on trouve **$b=1/4$**. On vérifie $2(a-b)=1$.`),
    written("1.c", "Justifie la décomposition.", String.raw`Comme $(x^2-1)^2=(x-1)^2(x+1)^2$, le numérateur commun est :

$$a(x+1)^2+b(x-1)^2=(a+b)x^2+2(a-b)x+(a+b).$$

Pour $a=3/4$ et $b=1/4$, on retrouve $x^2+x+1$. **Donc $f(x)=3/[4(x-1)^2]+1/[4(x+1)^2]$.**`),
    written("2", String.raw`Déduis-en la primitive $F$ telle que $F(2)=0$.`, String.raw`On primitive chaque fraction :

$$F(x)=-\frac3{4(x-1)}-\frac1{4(x+1)}+C.$$

En $2$, $F(2)=-3/4-1/12+C=-5/6+C$. Donc $C=5/6$.

$$\boxed{F(x)=-\frac3{4(x-1)}-\frac1{4(x+1)}+\frac56.}$$

La dérivation redonne $f$ et $F(2)=0$. L’intervalle $]1;+\infty[$ ne contient aucun pôle.`),
  ]),
];
