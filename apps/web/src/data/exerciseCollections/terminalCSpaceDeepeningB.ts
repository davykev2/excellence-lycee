import { spaceExercise as ex,written as w } from "./terminalCSpaceBuilders";
export const spaceDeepeningB=[
  ex(21,"Plans et droite d’intersection",String.raw`$A(-1;2;0)$, $B(1;2;4)$ et $C(-1;1;1)$.`,[
    w("1.a",String.raw`Démontrer que $\vec u=(2;-1;-1)$ est normal au plan $(ABC)$.`,String.raw`$\overrightarrow{AB}=(2;0;4)$ et $\overrightarrow{AC}=(0;-1;1)$ ne sont pas colinéaires. Les produits scalaires sont $2(2)+(-1)(0)+(-1)(4)=0$ et $2(0)+(-1)(-1)+(-1)(1)=0$. Le vecteur $\vec u\ne\vec0$ est orthogonal à deux directions non colinéaires de $(ABC)$ : il lui est normal.`),
    w("1.b",String.raw`Déterminer une équation de $(ABC)$.`,String.raw`Une équation est $2x-y-z+d=0$. En $A$, $-2-2+d=0$, donc $d=4$ :
$$\boxed{2x-y-z+4=0.}$$`),
    w("2.a",String.raw`$(P_1):3x+y-2z+3=0$. Déterminer l’équation du plan $(P_2)$ passant par $O$ et parallèle au plan d’équation $x-2z+6=0$.`,String.raw`Le plan donné a pour normale $(1;0;-2)$. Un plan parallèle s’écrit $x-2z+d=0$. Puisqu’il contient $O$, $d=0$. Ainsi $\boxed{(P_2):x-2z=0}$.`),
    w("2.b",String.raw`Démontrer que $(P_1)$ et $(P_2)$ sont sécants.`,String.raw`Leurs normales $(3;1;-2)$ et $(1;0;-2)$ ne sont pas colinéaires : la deuxième coordonnée vaut respectivement $1$ et $0$, alors que les deux vecteurs sont non nuls. Les plans sont donc sécants suivant une droite.`),
    w("3.a",String.raw`Montrer que la droite $(D):x=2t,\ y=-4t-3,\ z=t$ est leur intersection.`,String.raw`En remplaçant dans $(P_1)$ : $3(2t)+(-4t-3)-2t+3=0$. Dans $(P_2)$ : $2t-2t=0$. Toute la droite est incluse dans les deux plans.

Réciproquement, un point commun vérifie $x=2z$, puis $6z+y-2z+3=0$, donc $y=-4z-3$. En posant $t=z$, on retrouve exactement la représentation donnée. C’est bien toute l’intersection.`),
    w("3.b",String.raw`Déterminer le point commun à $(D)$ et au plan $(ABC)$.`,String.raw`Dans $2x-y-z+4=0$, remplaçons $(x;y;z)$ par $(2t;-4t-3;t)$ :
$$4t-(-4t-3)-t+4=7t+7=0.$$
Donc $t=-1$, puis $\boxed{I(-2;1;-1)}$. Vérification : $2(-2)-1-(-1)+4=0$.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(22,"Plan déterminé par un point et une droite",String.raw`$(D):x=1+2\lambda,\ y=-3+\lambda,\ z=-2+3\lambda$, avec $\lambda\in\mathbb R$, et $A(1;0;1)$.`,[
    w("1.",String.raw`Démontrer que $A$ et $(D)$ déterminent un unique plan.`,String.raw`Si $A\in(D)$, la première coordonnée imposerait $\lambda=0$, mais la deuxième serait alors $-3\ne0$. Ainsi $A\notin(D)$. Une droite et un point extérieur déterminent un unique plan.`),
    w("2.",String.raw`Déterminer un vecteur normal à ce plan.`,String.raw`Le point $B(1;-3;-2)$ appartient à $(D)$, dont un directeur est $\vec u=(2;1;3)$. Le vecteur $\overrightarrow{BA}=(0;3;3)$ n’est pas colinéaire à $\vec u$.

La normale $(a;b;c)$ vérifie $2a+b+3c=0$ et $3b+3c=0$. Donc $b=-c$, puis $a=-c$. Prenons $\boxed{(1;1;-1)}$.

Vérification : $2+1-3=0$ et $0+3-3=0$. On peut également obtenir l’équation $x+y-z=0$, vérifiée par $A$ et toute la droite.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(23,"Paramétrer une intersection",String.raw`$(P):x-2y+z-1=0$ et $(P'):2x-y+z-2=0$.`,[
    w("1.",String.raw`Démontrer que les deux plans sont sécants suivant une droite $(D)$.`,String.raw`Les normales $(1;-2;1)$ et $(2;-1;1)$ ne sont pas colinéaires : la dernière coordonnée imposerait un facteur $1$, mais les premières coordonnées diffèrent. Les plans sont donc sécants et leur intersection est une droite $(D)$.`),
    w("2.",String.raw`Déterminer une représentation paramétrique de $(D)$.`,String.raw`Un point de $(D)$ vérifie les deux équations. Soustraire la première à la seconde donne $x+y-1=0$, soit $x=1-y$. La première devient $1-y-2y+z-1=0$, donc $z=3y$.

En posant $y=t$ :
$$\boxed{x=1-t,\quad y=t,\quad z=3t,\quad t\in\mathbb R.}$$
Réciproquement, ces coordonnées vérifient les deux équations. Aucun point commun n’a été oublié.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(24,"Passer d’égalités à un paramètre",String.raw`$(D)$ est l’ensemble des points $M(x;y;z)$ tels que $\frac{2x-1}3=\frac{y+1}4=\frac{3-4z}4$.`,[
    w("1.",String.raw`Démontrer que $(D)$ est une droite.`,String.raw`Notons $t$ la valeur commune. Les égalités équivalent à $x=\frac12+\frac32t$, $y=-1+4t$, $z=\frac34-t$. L’ensemble s’écrit donc $A+t\vec u$, avec $A(\frac12;-1;\frac34)$ et $\vec u=(\frac32;4;-1)\ne\vec0$. Comme $t$ parcourt tous les réels, c’est bien une droite.`),
    w("2.",String.raw`Déterminer une représentation paramétrique de $(D)$.`,String.raw`Appelons $t$ la valeur commune aux trois quotients. Alors $2x-1=3t$, $y+1=4t$ et $3-4z=4t$. On isole chaque coordonnée :
$$\boxed{x=\frac12+\frac32t,\quad y=-1+4t,\quad z=\frac34-t,\quad t\in\mathbb R.}$$
Le directeur $(\frac32;4;-1)$ est non nul. Réciproquement, ces coordonnées redonnent les trois quotients égaux à $t$, ce qui prouve l’équivalence.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(25,"Reconnaître une représentation de plan",String.raw`$(P)$ est l’ensemble des points de coordonnées $x=3+2\lambda-4\mu$, $y=2+\lambda-\mu$, $z=5\lambda-5\mu$, où $\lambda,\mu\in\mathbb R$.`,[
    w("1.",String.raw`Démontrer que $(P)$ est un plan.`,String.raw`La représentation s’écrit $A+\lambda\vec u+\mu\vec v$, avec $A(3;2;0)$, $\vec u=(2;1;5)$ et $\vec v=(-4;-1;-5)$.

Si $\vec v=k\vec u$, la première coordonnée donnerait $k=-2$, mais la deuxième donnerait $k=-1$. Les deux directions ne sont donc pas colinéaires. L’ensemble est bien le plan passant par $A$ et dirigé par $\vec u,\vec v$.`),
    w("2.",String.raw`Déterminer une équation cartésienne de ce plan.`,String.raw`Le vecteur $(0;-5;1)$ est orthogonal à $\vec u$ car $-5+5=0$, et à $\vec v$ car $5-5=0$. Une équation est donc $-5y+z+d=0$. Avec $A$, $-10+d=0$ :
$$\boxed{z-5y+10=0.}$$
La représentation donne en effet $z=5(y-2)$. Réciproquement, si $z=5(y-2)$, poser $\mu=y-2-\frac{x-3}2$ et $\lambda=2(y-2)-\frac{x-3}2$ retrouve les trois coordonnées. L’équation décrit tout le plan.`),
  ],{figureKey:"tc-t2-l3-space"}),
];
