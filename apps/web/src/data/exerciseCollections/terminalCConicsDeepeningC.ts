import { conicsExercise as ex,written,plotSteps } from "./terminalCConicsBuilders";
export const conicsDeepeningC=[
  ex(35,"Une famille à paramètre",String.raw`$(C_m):(m-1)x^2+(m+1)y^2+(2m-2)x-(4m+4)y-4m-3=0$, où $m\in\mathbb R$.`,[
    written("1.","Déterminer la nature de Cₘ suivant m.",String.raw`On complète les carrés sans diviser par $m-1$ ni $m+1$ :
$$\boxed{(m-1)(x+1)^2+(m+1)(y-2)^2=9m+6.}$$
Posons $X=x+1$ et $Y=y-2$.

**1. Les valeurs qui annulent un coefficient.**

Pour $m=-1$, on a $-2X^2=-3$, donc $X=\pm\sqrt{3/2}$. Ce sont les deux droites $x=-1\pm\sqrt{3/2}$.

Pour $m=1$, on a $2Y^2=15$, donc $y=2\pm\sqrt{15/2}$ : deux droites horizontales.

**2. Les autres valeurs.**

Si $m<-1$, les deux coefficients et $9m+6$ sont négatifs. En divisant, les deux carrés ont des coefficients positifs et leur somme vaut 1 : c’est une ellipse.

Si $m>1$, les trois nombres sont positifs : c’est encore une ellipse.

Si $-1<m<1$, les coefficients des carrés sont de signes contraires. Lorsque $9m+6\ne0$, on obtient une hyperbole. Si $m=-2/3$, le membre droit est nul :
$$-\frac53X^2+\frac13Y^2=0
\iff Y=\pm\sqrt5X.$$
Ce sont deux droites sécantes $y-2=\pm\sqrt5(x+1)$.

| Valeurs de $m$ | Nature |
| --- | --- |
| $m<-1$ ou $m>1$ | ellipse |
| $m=-1$ ou $m=1$ | deux droites parallèles distinctes |
| $-1<m<1$, $m\ne-2/3$ | hyperbole |
| $m=-2/3$ | deux droites sécantes |

Il n’y a ici ni ensemble vide ni point isolé.`),
  ],true),
  ex(36,"Une famille avec une parabole particulière",String.raw`$(C_m):mx^2+(m+2)y^2+2mx-(4m+4)y-2=0$, où $m\in\mathbb R$.`,[
    written("1.","Déterminer la nature de Cₘ suivant m.",String.raw`**1. On traite d’abord $m=0$ et $m=-2$.**

Pour $m=0$, $2y^2-4y-2=0$, donc $(y-1)^2=2$. On obtient les deux droites $y=1\pm\sqrt2$.

Pour $m=-2$, $-2x^2-4x+4y-2=0$, donc :
$$\boxed{(x+1)^2=2y.}$$
C’est une parabole de sommet $(-1;0)$.

**2. Supposons $m\ne0,-2$.** En complétant les carrés :
$$m(x+1)^2+(m+2)\left(y-\frac{2(m+1)}{m+2}\right)^2=R,$$
avec
$$R=m+2+\frac{4(m+1)^2}{m+2}
=\frac{5m^2+12m+8}{m+2}.$$
Le numérateur est strictement positif, car :
$$5m^2+12m+8=5\left(m+\frac65\right)^2+\frac45>0.$$
Ainsi $R$ a le signe de $m+2$.

Pour $m>0$, tous les signes sont positifs : ellipse. Pour $m<-2$, les deux coefficients et $R$ sont négatifs : ellipse aussi. Pour $-2<m<0$, les coefficients ont des signes opposés et $R>0$ : hyperbole verticale.

| Valeurs de $m$ | Nature |
| --- | --- |
| $m<-2$ ou $m>0$ | ellipse |
| $m=-2$ | parabole |
| $-2<m<0$ | hyperbole |
| $m=0$ | deux droites parallèles |

Le centre des coniques centrales est $\left(-1;\frac{2(m+1)}{m+2}\right)$. Cette formule ne s’utilise pas pour la parabole $m=-2$.`),
  ],true),
  ex(37,"Réduire par une rotation",String.raw`$(C):x^2+6\sqrt3xy-5y^2-24=0$. On donne $\vec u=\frac{\sqrt3}{2}\vec i+\frac12\vec j$ et $\vec v=-\frac12\vec i+\frac{\sqrt3}{2}\vec j$.`,[
    written("1.",String.raw`Donner une équation réduite dans le repère $(O;\vec u,\vec v)$.`,String.raw`Les normes de $\vec u,\vec v$ valent 1 et leur produit scalaire vaut 0 : le repère est orthonormé. Sa rotation est d’angle $\pi/6$.

Si $(X;Y)$ sont les nouvelles coordonnées :
$$x=\frac{\sqrt3}{2}X-\frac12Y,\qquad
y=\frac12X+\frac{\sqrt3}{2}Y.$$
En développant, les coefficients sont :

| Terme | Contribution totale |
| --- | --- |
| $X^2$ | $3/4+9/2-5/4=4$ |
| $Y^2$ | $1/4-9/2-15/4=-8$ |
| $XY$ | $-\sqrt3/2+3\sqrt3+(-5\sqrt3/2)=0$ |

On obtient $4X^2-8Y^2=24$, donc :
$$\boxed{\frac{X^2}{6}-\frac{Y^2}{3}=1.}$$`),
    written("2.","Déterminer la nature de C.",String.raw`La forme réduite contient deux carrés de signes opposés : c’est une hyperbole de centre $O$ et d’axe focal dirigé par $\vec u$. On a $a=\sqrt6$, $b=\sqrt3$, $c=\sqrt{6+3}=3$ et $e=3/\sqrt6=\sqrt6/2$. Les asymptotes sont $Y=\pm X/\sqrt2$.`),
    written("3.","Construire C.",String.raw`On trace les nouveaux axes selon $\vec u$ et $\vec v$, inclinés de 30° par rapport aux anciens. On place les sommets $\pm\sqrt6\,\vec u$ et les foyers $\pm3\vec u$. Les diagonales du rectangle de demi-côtés $\sqrt6$ et $\sqrt3$ donnent les asymptotes. On trace deux branches autour de l’axe dirigé par $\vec u$. On ne dessine pas une hyperbole horizontale dans l’ancien repère.`+plotSteps),
  ],true),
  ex(38,"Utiliser une similitude",String.raw`$(C):5x^2+6xy+5y^2-8x+8y=0$. Soient $h$ l’homothétie de centre $O$ et de rapport $\sqrt2$, $r$ la rotation de centre $O$ et d’angle $\pi/4$, $s=h\circ r$, et $(C')=s(C)$.`,[
    written("1.",String.raw`Pour $M'=s(M)$, montrer $2x=x'+y'$ et $2y=-x'+y'$.`,String.raw`La rotation donne $\bigl((x-y)/\sqrt2;(x+y)/\sqrt2\bigr)$. L’homothétie multiplie ces deux coordonnées par $\sqrt2$, donc :
$$x'=x-y,\qquad y'=x+y.$$
En additionnant puis en soustrayant, on obtient :
$$\boxed{2x=x'+y',\qquad2y=-x'+y'.}$$`),
    written("2.","Donner l’équation réduite de C′ et en déduire la nature de C.",String.raw`On remplace $x$ par $(x'+y')/2$ et $y$ par $(-x'+y')/2$.
Les termes quadratiques deviennent :
$$5x^2+6xy+5y^2=x'^2+4y'^2.$$
Les termes linéaires donnent $-8x+8y=-8x'$. Ainsi :
$$x'^2+4y'^2-8x'=0
\iff (x'-4)^2+4y'^2=16.$$
D’où $\boxed{\frac{(x'-4)^2}{16}+\frac{y'^2}{4}=1}$.

C’est une ellipse de centre $(4;0)$, de demi-axes 4 et 2. Une similitude conserve la nature d’une ellipse : $C$ est donc une ellipse. Son centre est l’image inverse de $(4;0)$, soit $\boxed{(2;-2)}$. Les longueurs de $C$ sont celles de $C'$ divisées par $\sqrt2$ : demi-axes $2\sqrt2$ et $\sqrt2$.`),
    written("3.","Construire C.",String.raw`On peut construire $C'$ puis appliquer la similitude inverse : rotation de $-\pi/4$ et homothétie de rapport $1/\sqrt2$.

Dans le repère initial, le grand axe de $C$ est dirigé par $(1;-1)$ et le petit axe par $(1;1)$. Les sommets sont :
$$ (4;-4),\quad(0;0),\quad(3;-1),\quad(1;-3).$$
Le centre est $(2;-2)$. On place ces quatre points puis on trace l’ellipse inclinée. Les foyers sont $(2+\sqrt3;-2-\sqrt3)$ et $(2-\sqrt3;-2+\sqrt3)$.`),
  ],true),
  ex(39,"Foyer et directrice oblique",String.raw`La conique $\Gamma$ a pour foyer $F(4;0)$, directrice $D:y=x-1$ et excentricité $2$.`,[
    written("1.a","Calculer le projeté orthogonal K de F sur D.",String.raw`On écrit $D:x-y-1=0$, de normale $(1;-1)$. Le projeté vérifie :
$$K=F-\frac{4-0-1}{1^2+(-1)^2}(1;-1)
=(4;0)-\frac32(1;-1).$$
Donc $\boxed{K(5/2;3/2)}$. Vérification : $3/2=5/2-1$ et $\overrightarrow{FK}=(-3/2;3/2)$ est normal à $D$.`),
    written("1.b","Donner une équation de Γ.",String.raw`La définition est $MF=2d(M,D)$. On utilise :
$$MF^2=(x-4)^2+y^2,\qquad d(M,D)^2=\frac{(x-y-1)^2}{2}.$$
Donc $(x-4)^2+y^2=2(x-y-1)^2$. Après développement et multiplication par $-1$ :
$$\boxed{x^2+y^2-4xy+4x+4y-14=0.}$$`),
    written("2.","Déterminer les deux sommets A et A′ sur l’axe focal.",String.raw`L’axe focal $(FK)$ est $y=-x+4$. Écrivons $M=K+t(F-K)$, soit :
$$M\left(\frac52+\frac32t;\frac32-\frac32t\right).$$
Sur cet axe, $MF=|t-1|KF$ et $d(M,D)=|t|KF$, avec $KF=3/\sqrt2>0$. La relation devient $|t-1|=2|t|$.

En élevant au carré : $(t-1)^2=4t^2$, soit $3t^2+2t-1=0$. Les solutions sont $t=1/3$ et $t=-1$.
$$\boxed{A(3;1),\qquad A'(1;3).}$$`),
    written("3.","Déterminer le centre G.",String.raw`L’excentricité vaut 2 : c’est une hyperbole. Son centre est le milieu des deux sommets :
$$G\left(\frac{3+1}{2};\frac{1+3}{2}\right)=\boxed{(2;2)}.$$
Le demi-axe focal vaut $GA=\sqrt2$. La distance au foyer est $GF=2\sqrt2$, ce qui vérifie $e=GF/GA=2$.`),
    written("4.","Tracer Γ et ses asymptotes.",String.raw`Posons $X=x-2$ et $Y=y-2$. L’équation devient $X^2+Y^2-4XY=6$.
Dans le repère d’axe focal $\vec u=(1;-1)/\sqrt2$ et d’autre axe $\vec v=(1;1)/\sqrt2$, on a :
$$\boxed{\frac{U^2}{2}-\frac{V^2}{6}=1.}$$
Les asymptotes dans le repère initial vérifient $X^2+Y^2-4XY=0$. En écrivant $Y=tX$, on trouve $t^2-4t+1=0$, donc :
$$\boxed{y-2=(2+\sqrt3)(x-2),}$$
$$\boxed{y-2=(2-\sqrt3)(x-2).}$$
On place $G,A,A'$ puis on trace les branches autour de l’axe $y=-x+4$, en s’approchant des asymptotes.`),
    written("5.","Déterminer le second foyer F′.",String.raw`Les foyers sont symétriques par rapport au centre. Donc $F'=2G-F$ :
$$F'=(4;4)-(4;0)=\boxed{(0;4)}.$$`),
    written("6.","Déterminer la seconde directrice D′.",String.raw`Les directrices sont symétriques par rapport à $G$. Le point $K(5/2;3/2)$ de $D$ a pour symétrique $K'(3/2;5/2)$. La droite $D'$ est parallèle à $D$, donc de la forme $y=x+b$. En utilisant $K'$ :
$$\frac52=\frac32+b\implies b=1.$$
Ainsi $\boxed{D':y=x+1}$. Elle est associée à $F'(0;4)$.`),
  ],true),
  ex(40,"Lire une distance dans une écriture complexe",String.raw`Le point $F$ a pour affixe $2+3i$ et $D:x+2y-3=0$. On considère les points $M(z)$ tels que :
$$|(1-2i)z+(1+2i)\overline z-6|=2\sqrt5\,|z-2-3i|.$$`,[
    written("1.",String.raw`Justifier $d(M,D)=\dfrac{|(1-2i)z+(1+2i)\overline z-6|}{2\sqrt5}$.`,String.raw`Posons $z=x+iy$ et $\overline z=x-iy$. On développe :
$$(1-2i)z=(x+2y)+i(y-2x),$$
$$(1+2i)\overline z=(x+2y)-i(y-2x).$$
La somme vaut $2x+4y$, donc le module demandé vaut $2|x+2y-3|$. Or :
$$d(M,D)=\frac{|x+2y-3|}{\sqrt{1^2+2^2}}
=\frac{2|x+2y-3|}{2\sqrt5}.$$
C’est bien l’égalité voulue.`),
    written("2.","Déterminer Γ et ses éléments caractéristiques.",String.raw`On divise la relation par $2\sqrt5$. Le premier membre devient $d(M,D)$ et le second $|z-(2+3i)|=MF$. Ainsi $\boxed{MF=d(M,D)}$ : c’est une parabole d’excentricité 1.

On projette $F(2;3)$ sur $D$ :
$$K=(2;3)-\frac{2+6-3}{5}(1;2)=\boxed{(1;1)}.$$
Le sommet est le milieu de $[FK]$ :
$$\boxed{S(3/2;2).}$$
L’axe est $(FK)$, de direction $(1;2)$ et d’équation $y=2x-1$. Le foyer est $F(2;3)$, la directrice est $D$ et le paramètre positif vaut $FK=\sqrt5$. Il n’y a pas de centre.`),
    written("3.","Construire Γ.",String.raw`On trace $D$, puis son axe perpendiculaire passant par $F$. On place $K(1;1)$ et $S(3/2;2)$. Dans le repère de sommet $S$, de vecteurs unitaires $\vec u=(1;2)/\sqrt5$ et $\vec v=(-2;1)/\sqrt5$, la parabole s’écrit :
$$\boxed{V^2=2\sqrt5\,U.}$$
Pour $V=\pm\sqrt5$, on obtient $U=\sqrt5/2$. Dans le repère initial, le point est $S+\frac12(1;2)\pm(-2;1)$, ce qui donne $(0;4)$ et $(4;2)$. On trace la parabole ouverte dans le sens de $\vec u$, avec la symétrie par rapport à l’axe $y=2x-1$.

Dans le repère initial, l’équation équivalente est :
$$\boxed{4x^2-4xy+y^2-14x-18y+56=0.}$$`),
  ],true),
];
