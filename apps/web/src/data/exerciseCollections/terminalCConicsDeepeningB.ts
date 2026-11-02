import { conicsExercise as ex,written,plotSteps } from "./terminalCConicsBuilders";
import { centralConicDetails } from "./conicSolutions";
export const conicsDeepeningB=[
  ex(29,"Tester l’existence d’une courbe réelle",String.raw`On considère l’ensemble $(\Gamma):x^2+\frac12y^2+\frac14=0$.`,[
    written("1.","Donner une équation réduite.",String.raw`On passe la constante à droite :
$$x^2+\frac12y^2=-\frac14.$$
En multipliant par 4, on obtient $\boxed{4x^2+2y^2=-1}$. Le repère initial suffit pour lire les signes.`),
    written("2.","Préciser ses éléments caractéristiques.",String.raw`Pour tout point réel, $4x^2+2y^2\ge0$. Cette expression ne peut pas valoir $-1$. Ainsi $\boxed{\Gamma=\varnothing}$. Il n’y a donc ni foyer, ni directrice, ni sommet réel à déterminer.`),
    written("3.","Représenter l’ensemble.",String.raw`L’ensemble est vide : aucun point du repère n’en fait partie. On ne trace ni ellipse ni hyperbole ; le repère reste sans courbe représentant $\Gamma$.`),
  ],true),
  ex(30,"Réduction et représentation de deux coniques",String.raw`a) $25x^2-16y^2-250x-64y+161=0$ ; b) $4x^2+y^2+8x+4y-8=0$.`,[
    written("a.1","Déterminer la nature et les éléments de la première courbe.",String.raw`On écrit :
$$25[(x-5)^2-25]-16[(y+2)^2-4]+161=0.$$
La constante vaut $-625+64+161=-400$. Ainsi :
$$25(x-5)^2-16(y+2)^2=400,$$
$$\boxed{\frac{(x-5)^2}{16}-\frac{(y+2)^2}{25}=1.}$$
`+centralConicDetails({kind:"hyperbola",axis:"x",h:5,k:-2,a2:16,b2:25})),
    written("a.2","Construire la première courbe.",String.raw`On place $\Omega(5;-2)$, les sommets $(9;-2)$ et $(1;-2)$, puis les asymptotes $y+2=\pm\frac54(x-5)$. Pour $x-5=\pm8$, on obtient $y+2=\pm5\sqrt3$. Les symétries par rapport à $x=5$, $y=-2$ et au centre complètent les branches.`+plotSteps),
    written("b.1","Déterminer la nature et les éléments de la seconde courbe.",String.raw`En complétant les carrés :
$$4[(x+1)^2-1]+[(y+2)^2-4]-8=0.$$
Donc $4(x+1)^2+(y+2)^2=16$, puis :
$$\boxed{\frac{(x+1)^2}{4}+\frac{(y+2)^2}{16}=1.}$$
`+centralConicDetails({kind:"ellipse",axis:"y",h:-1,k:-2,a2:16,b2:4})),
    written("b.2","Construire la seconde courbe.",String.raw`Le centre est $(-1;-2)$. Les sommets sont $(-1;2)$, $(-1;-6)$, $(1;-2)$ et $(-3;-2)$. À $y+2=\pm2$, on a $x+1=\pm\sqrt3$. On place ces points et on trace l’ellipse avec ses deux symétries axiales.`+plotSteps),
  ],true),
  ex(31,"Conique et lieu d’affixes",String.raw`On considère $(H):3x^2-y^2+2x+1=0$ et les points $A,M,M'$ d’affixes respectives $1,z,z^4$.`,[
    written("1.","Déterminer la nature et les éléments de H.",String.raw`On complète le carré :
$$3\left(x+\frac13\right)^2-y^2+\frac23=0.$$
Ainsi :
$$\boxed{\frac{y^2}{2/3}-\frac{(x+1/3)^2}{2/9}=1.}$$
`+centralConicDetails({kind:"hyperbola",axis:"y",h:-1/3,k:0,a2:2/3,b2:2/9})),
    written("2.a",String.raw`Montrer que $A,M,M'$ sont alignés si et seulement si $1+z+z^2+z^3$ est réel.`,String.raw`Si $z\ne1$, les points $A$ et $M$ sont distincts. Le critère d’alignement donne :
$$A,M,M'\text{ alignés}\iff\frac{z^4-1}{z-1}\in\mathbb R.$$
Or $z^4-1=(z-1)(1+z+z^2+z^3)$, donc le quotient vaut $1+z+z^2+z^3$.

Si $z=1$, les trois points sont confondus en $A$ et ils appartiennent à une même droite ; la somme vaut 4, qui est réelle. Le cas exclu du quotient satisfait lui aussi l’équivalence.`),
    written("2.b",String.raw`Déterminer l’ensemble des points $M(z)$ tels que $1+z+z^2+z^3$ soit réel.`,String.raw`Posons $z=x+iy$. Les parties imaginaires sont :
$$\operatorname{Im}(z)=y,\quad\operatorname{Im}(z^2)=2xy,\quad
\operatorname{Im}(z^3)=3x^2y-y^3.$$
La somme est réelle si et seulement si :
$$y+2xy+3x^2y-y^3
=y(1+2x+3x^2-y^2)=0.$$
Un produit est nul si l’un de ses facteurs l’est. On obtient donc $y=0$ **ou** $3x^2-y^2+2x+1=0$.

L’ensemble cherché est $\boxed{(Ox)\cup H}$. Le point d’affixe 1 appartient bien à $(Ox)$.`),
  ],true),
  ex(32,"Retrouver une équation réduite",String.raw`L’équation est de la forme $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$, $\frac{x^2}{a^2}-\frac{y^2}{b^2}=1$ ou $-\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$, avec $a,b>0$. Ici $a$ désigne toujours le demi-axe porté par $(Ox)$.`,[
    written("1.",String.raw`Axe focal $(Ox)$, $a=4$ et $e=1/2$.`,String.raw`Comme $e<1$, c’est une ellipse horizontale. On a $c=ae=2$, puis $b^2=a^2-c^2=16-4=12$. Donc :
$$\boxed{\frac{x^2}{16}+\frac{y^2}{12}=1.}$$`),
    written("2.",String.raw`Axe focal $(Oy)$, $a=4$ et $e=1/2$.`,String.raw`C’est une ellipse verticale : son demi-grand axe est $b$. Ainsi $e^2=1-a^2/b^2$, soit :
$$\frac14=1-\frac{16}{b^2},\qquad\frac{16}{b^2}=\frac34,\qquad b^2=\frac{64}{3}.$$
Donc $\boxed{\frac{x^2}{16}+\frac{y^2}{64/3}=1}$.`),
    written("3.",String.raw`Axe focal $(Ox)$, $a=4$ et $e=3$.`,String.raw`Comme $e>1$, c’est une hyperbole horizontale. On a $c=ae=12$, puis $b^2=c^2-a^2=144-16=128$. Donc $\boxed{\frac{x^2}{16}-\frac{y^2}{128}=1}$.`),
    written("4.",String.raw`Axe focal $(Oy)$, $a=4$ et $e=3$.`,String.raw`Le demi-axe focal est $b$, donc $e^2=1+a^2/b^2$. Ainsi :
$$9=1+\frac{16}{b^2},\qquad b^2=2.$$
L’équation est $\boxed{-\frac{x^2}{16}+\frac{y^2}{2}=1}$.`),
  ],true),
  ex(33,"Une directrice connue",String.raw`Déterminer une équation réduite d’une conique ayant pour directrice $x=1$ et l’excentricité indiquée. « Réduite » signifie ici que le sommet ou le centre est $O$.`,[
    written("a)",String.raw`$e=1$.`,String.raw`Il s’agit d’une parabole d’axe $(Ox)$, d’équation $y^2=2ax$. Sa directrice est $x=-a/2$. Donc $-a/2=1$, d’où $a=-2$.
$$\boxed{y^2=-4x.}$$
Le foyer est $(-1;0)$ et la directrice est bien $x=1$.`),
    written("b)",String.raw`$e=1/3$.`,String.raw`C’est une ellipse horizontale. Si $A$ est le demi-grand axe, la directrice positive est $x=A/e=1$. Donc $A=e=1/3$ et $A^2=1/9$. Puis :
$$c=eA=\frac19,\qquad B^2=A^2-c^2=\frac19-\frac1{81}=\frac8{81}.$$
Ainsi $\boxed{\frac{x^2}{1/9}+\frac{y^2}{8/81}=1}$.`),
    written("c)",String.raw`$e=3$.`,String.raw`C’est une hyperbole horizontale. La directrice positive donne $A/e=1$, donc $A=3$. Alors $c=eA=9$ et $B^2=c^2-A^2=81-9=72$. L’équation est :
$$\boxed{\frac{x^2}{9}-\frac{y^2}{72}=1.}$$`),
  ],true),
  ex(34,"Directrice confondue avec Ox",String.raw`Déterminer les coniques de directrice $(Ox)$ pour chaque excentricité. On peut noter le foyer $F(u;v)$, avec $v\ne0$, pour décrire les possibilités.`,[
    written("1.",String.raw`$e=1$.`,String.raw`La directrice $y=0$ et l’excentricité ne fixent pas le foyer : il existe une famille de solutions. Pour $F(u;v)$, $v\ne0$, la définition donne :
$$(x-u)^2+(y-v)^2=y^2.$$
En développant le second carré, puis en simplifiant $y^2$ :
$$\boxed{(x-u)^2=2v\left(y-\frac v2\right).}$$
C’est une parabole de sommet $(u;v/2)$. Dans le repère de ce sommet, l’équation réduite est $X^2=2vY$. Par exemple, $F(0;1)$ donne $x^2=2(y-1/2)$.`),
    written("2.",String.raw`$e=1/\sqrt2$.`,String.raw`Avec $F(u;v)$, $v\ne0$, on a $(x-u)^2+(y-v)^2=\frac12y^2$. En complétant le carré en $y$ :
$$(x-u)^2+\frac12(y-2v)^2=v^2.$$
Donc :
$$\boxed{\frac{(x-u)^2}{v^2}+\frac{(y-2v)^2}{2v^2}=1.}$$
Le centre est $(u;2v)$ ; dans son repère, c’est une ellipse verticale. Chaque choix de $u$ et de $v\ne0$ fournit une solution ; sans foyer donné, il n’y a pas une équation unique.`),
    written("3.",String.raw`$e=\sqrt2$.`,String.raw`La définition donne $(x-u)^2+(y-v)^2=2y^2$. Après développement :
$$ (y+v)^2-(x-u)^2=2v^2.$$
Donc :
$$\boxed{\frac{(y+v)^2}{2v^2}-\frac{(x-u)^2}{2v^2}=1.}$$
C’est une hyperbole équilatère verticale de centre $(u;-v)$. Pour le foyer choisi $F(u;v)$, la directrice associée est bien $y=0$.`),
    written("4.",String.raw`$e=\sqrt3$.`,String.raw`On écrit $(x-u)^2+(y-v)^2=3y^2$, puis :
$$2\left(y+\frac v2\right)^2-(x-u)^2=\frac32v^2.$$
Ainsi :
$$\boxed{\frac{(y+v/2)^2}{3v^2/4}-\frac{(x-u)^2}{3v^2/2}=1.}$$
Le centre est $(u;-v/2)$ et l’axe focal est vertical. Les deux nombres $u$ et $v\ne0$ restent libres puisque le foyer n’était pas imposé.`),
  ],true),
];
