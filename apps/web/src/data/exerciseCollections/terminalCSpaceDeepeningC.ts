import { spaceExercise as ex,written as w } from "./terminalCSpaceBuilders";
export const spaceDeepeningC=[
  ex(26,"Plan contenant deux droites",String.raw`$(D):x=-2+\lambda,\ y=2-2\lambda,\ z=4+\lambda$ et $(\Delta):x=-1-\mu,\ y=2\mu,\ z=1+\mu$, avec $\lambda,\mu\in\mathbb R$.`,[
    w("1.",String.raw`Étudier la position relative de $(D)$ et $(\Delta)$.`,String.raw`Les directeurs $(1;-2;1)$ et $(-1;2;1)$ ne sont pas colinéaires : le facteur $-1$ donné par la première coordonnée ne convient pas à la troisième.

Les égalités donnent $\lambda+\mu=1$ et $\lambda-\mu=-3$. Donc $\lambda=-1$, $\mu=2$. La deuxième coordonnée vaut $4$ dans les deux représentations. Les trois égalités sont vérifiées, d’où $\boxed{D\cap\Delta=\{I(-3;4;3)\}}$.`),
    w("2.",String.raw`Déterminer une équation du plan contenant ces deux droites.`,String.raw`Deux droites sécantes déterminent un unique plan. Sa normale $(a;b;c)$ vérifie $a-2b+c=0$ et $-a+2b+c=0$. En ajoutant, $2c=0$, puis $a=2b$. Prenons $(2;1;0)$.

Avec $I$, l’équation $2x+y+d=0$ donne $-6+4+d=0$, donc :
$$\boxed{2x+y+2=0.}$$
En remplaçant avec chaque représentation, le membre de gauche vaut identiquement $0$. Les deux droites sont entièrement dans ce plan.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(27,"Droites gauches et plan par un point",String.raw`$(D):x=1+k,\ y=-2-k,\ z=2+3k$ et $(\Delta):x=2t,\ y=1-t,\ z=3+t$. On donne aussi $A(2;1;4)$.`,[
    w("1.",String.raw`Étudier la position relative de $(D)$ et $(\Delta)$.`,String.raw`Les directeurs $(1;-1;3)$ et $(2;-1;1)$ ne sont pas colinéaires. Pour une intersection, les deux premières coordonnées donnent $1+k=2t$ et $-2-k=1-t$, soit $t=3+k$. On obtient $k=-5$, puis $t=-2$.

Mais les troisièmes coordonnées valent $2+3(-5)=-13$ et $3-2=1$. Elles sont différentes. Les droites sont donc **non coplanaires**.`),
    w("2.",String.raw`Démontrer que $A$ n’appartient pas à $(D)$.`,String.raw`La première coordonnée imposerait $k=1$, mais la deuxième serait $-2-1=-3\ne1$. Ainsi $\boxed{A\notin(D)}$.`),
    w("3.",String.raw`Déterminer une équation du plan passant par $A$ et contenant $(\Delta)$.`,String.raw`Vérifions aussi $A\notin\Delta$ : $x=2$ imposerait $t=1$, mais $y=0\ne1$. Le plan demandé est bien unique.

Le point $B(0;1;3)$ est dans $\Delta$, qui a pour directeur $(2;-1;1)$. On a $\overrightarrow{BA}=(2;0;1)$. Le vecteur $(1;0;-2)$ est orthogonal à ces deux directions, car $2-2=0$ dans les deux cas.

Le plan s’écrit $x-2z+d=0$. Avec $A$, $2-8+d=0$, d’où :
$$\boxed{x-2z+6=0.}$$
Sur $\Delta$, $2t-2(3+t)+6=0$ pour tout $t$.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(28,"Barycentre, sphère et section plane",String.raw`$A(1;2;-1)$, $B(-3;-2;3)$, $C(0;-2;-3)$ et $(P):x+y-z+2=0$.`,[
    w("1.a",String.raw`Démontrer que $A,B,C$ ne sont pas alignés.`,String.raw`$\overrightarrow{AB}=(-4;-4;4)$ et $\overrightarrow{AC}=(-1;-4;-2)$ ne sont pas colinéaires : les deux premières coordonnées imposeraient respectivement les facteurs $4$ et $1$. Le plan $(ABC)$ est donc défini.`),
    w("1.b",String.raw`Démontrer que $\vec n=(2;-1;1)$ est normal à $(ABC)$.`,String.raw`$\vec n\cdot\overrightarrow{AB}=-8+4+4=0$ et $\vec n\cdot\overrightarrow{AC}=-2+4-2=0$. Le vecteur $\vec n$ est non nul et orthogonal à deux directions non colinéaires du plan ; il est donc normal. Avec $A$, on obtient aussi $\boxed{(ABC):2x-y+z+1=0}$.`),
    w("2.",String.raw`Démontrer que $(P)$ et $(ABC)$ sont perpendiculaires.`,String.raw`Une normale de $(P)$ est $\vec m=(1;1;-1)$. Le produit scalaire $\vec n\cdot\vec m=2-1-1=0$. Les deux normales étant non nulles, les plans sont **perpendiculaires**.`),
    w("3.a",String.raw`$G$ est le barycentre de $(A,1)$, $(B,-1)$ et $(C,2)$. Calculer ses coordonnées.`,String.raw`La somme des coefficients vaut $1-1+2=2\ne0$. Donc :
$$\overrightarrow{OG}=\frac{\overrightarrow{OA}-\overrightarrow{OB}+2\overrightarrow{OC}}2.$$
Coordonnée par coordonnée :
$$x_G=\frac{1-(-3)+0}2=2,\quad y_G=\frac{2-(-2)+2(-2)}2=0,$$
$$z_G=\frac{-1-3+2(-3)}2=-5.$$
Ainsi $\boxed{G(2;0;-5)}$.`),
    w("3.b",String.raw`Démontrer que $(CG)$ est orthogonale à $(P)$.`,String.raw`$\overrightarrow{CG}=(2;2;-2)=2(1;1;-1)=2\vec m$. Un directeur de $(CG)$ est donc normal à $(P)$. La droite est **orthogonale au plan**.`),
    w("3.c",String.raw`Déterminer $H=(CG)\cap(P)$.`,String.raw`Une représentation de $(CG)$ est $x=t,\ y=-2+t,\ z=-3-t$. Dans $(P)$ :
$$t+(-2+t)-(-3-t)+2=3t+3=0.$$
Donc $t=-1$ et $\boxed{H(-1;-3;-2)}$. Comme $(CG)\perp(P)$, $H$ est le projeté orthogonal de $G$ sur $(P)$.`),
    w("4.a",String.raw`Déterminer l’ensemble $(S)$ des points $M$ tels que $\|\overrightarrow{MA}-\overrightarrow{MB}+2\overrightarrow{MC}\|=12$.`,String.raw`Par la propriété du barycentre :
$$\overrightarrow{MA}-\overrightarrow{MB}+2\overrightarrow{MC}=2\overrightarrow{MG}.$$
La condition devient $2MG=12$, soit $MG=6$. Ainsi $(S)$ est $\boxed{\text{la sphère de centre }G(2;0;-5)\text{ et de rayon }6}$.`),
    w("4.b",String.raw`Déterminer la nature et les éléments caractéristiques de l’intersection de $(S)$ et $(P)$.`,String.raw`La distance du centre au plan vaut :
$$GH=d(G,P)=\frac{|2+0-(-5)+2|}{\sqrt3}
=\frac9{\sqrt3}=3\sqrt3<6.$$
Le plan coupe donc la sphère suivant un cercle de centre $H$, projeté orthogonal de $G$.

Pour un point $M$ de ce cercle, le triangle $GHM$ est rectangle en $H$. Par Pythagore :
$$HM^2=GM^2-GH^2=36-27=9.$$
L’intersection est $\boxed{\text{le cercle de centre }H(-1;-3;-2)\text{ et de rayon }3}$.`),
  ],{figureKey:"tc-t2-l3-space"}),
];
