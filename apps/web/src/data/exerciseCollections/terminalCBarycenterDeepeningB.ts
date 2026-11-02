import { baryExercise as E,written as W,short as S } from "./terminalCBarycenterBuilders";
export const barycenterDeepeningB=[
 E(32,"Intersection de deux droites",String.raw`$ABCD$ est un parallélogramme. $I$ est le milieu de $[BC]$, $J$ celui de $[CD]$, et $K=(AJ)\cap(DI)$.`,[
 S("1.a",String.raw`Calculer $\frac{AK}{KJ}$.`,"4",["4"],String.raw`Dans le repère $(A;\overrightarrow{AB},\overrightarrow{AD})$, on a $I(1;\frac12)$ et $J(\frac12;1)$.

Un point de $(AJ)$ s’écrit $(t/2;t)$ ; un point de $(DI)$ s’écrit $(s;1-s/2)$. À l’intersection :
$$t/2=s,\qquad t=1-s/2.$$
Ainsi $t=1-t/4$, donc $t=4/5$ et $s=2/5$. Le point $K$ est intérieur à $[AJ]$ et $\frac{AK}{KJ}=\frac{4/5}{1/5}=\boxed4$.`),
 S("1.b",String.raw`Calculer $\frac{DK}{KI}$.`,String.raw`$\frac23$`,["2/3"],String.raw`Le paramètre sur $[DI]$ vaut $s=2/5$, donc :
$$\frac{DK}{KI}=\frac{2/5}{1-2/5}=\boxed{\frac23}.$$`),
 W("2.","Écrire K comme barycentre de A, B, C, D.",String.raw`Le paramètre $t=4/5$ donne $K=\operatorname{bar}\{(A,1),(J,4)\}$.

Comme $J$ est le milieu de $[CD]$, le groupe $(C,2),(D,2)$ a pour barycentre $J$ et pour somme $4$. On obtient :
$$\boxed{K=\operatorname{bar}\{(A,1),(B,0),(C,2),(D,2)\}.}$$
Le coefficient nul de $B$ est autorisé et la somme vaut $5$. Vérification : $K(2/5;4/5)$. Une autre écriture, à coefficients tous non nuls, est $(A,2),(B,-1),(C,3),(D,1)$.`),
 ],{figureKey:"tc-t2-l1-source",correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(33,"Un barycentre et une sphère",String.raw`Dans l’espace, $A,B,C$ sont non alignés et $\overrightarrow{AI}=\overrightarrow{AB}+\frac12\overrightarrow{AC}$.`,[
 W("1.","Exprimer I comme barycentre de A, B, C.",String.raw`On cherche des coefficients de somme $2$ afin d’obtenir $2\overrightarrow{AI}=2\overrightarrow{AB}+\overrightarrow{AC}$. Le coefficient de $A$ est alors $2-2-1=-1$ :
$$\boxed{I=\operatorname{bar}\{(A,-1),(B,2),(C,1)\}.}$$`),
 W("2.",String.raw`Si $ABC$ est rectangle en $A$, $AB=2$, $AC=1$, déterminer $MA^2-2MB^2-MC^2=-3$.`,String.raw`La somme des coefficients vaut $-2$. Par homogénéité, leur barycentre est bien $I$.

La réduction donne $f(M)=-2MI^2+c$. Comme $\overrightarrow{AB}\perp\overrightarrow{AC}$ :
$$AI^2=\left\|\overrightarrow{AB}+\tfrac12\overrightarrow{AC}\right\|^2=4+\tfrac14=\tfrac{17}{4}.$$
En $A$, $f(A)=-2AB^2-AC^2=-9$. Donc $-9=-2(17/4)+c$, d’où $c=-1/2$.

Ainsi :
$$-2MI^2-\frac12=-3\iff MI^2=\frac54.$$
L’ensemble, dans **l’espace**, est la **sphère de centre I et de rayon $\sqrt5/2$**, et non un simple cercle du plan $(ABC)$.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(34,"Un alignement de milieux",String.raw`$ABC$ est un triangle. $I,J,K$ sont les milieux respectifs de $[BC],[CA],[AB]$. $L$ est le milieu de $[JC]$ et $M$ est le symétrique de $K$ par rapport à $B$.`,[
 W("1.","Démontrer que I, L et M sont alignés.",String.raw`Avec l’origine $A$, notons $\vec b=\overrightarrow{AB}$ et $\vec c=\overrightarrow{AC}$.
$$\overrightarrow{AI}=\frac{\vec b+\vec c}{2},\quad
\overrightarrow{AL}=\frac{\frac12\vec c+\vec c}{2}=\frac34\vec c.$$
La symétrie donne :
$$\overrightarrow{AM}=2\overrightarrow{AB}-\overrightarrow{AK}
=2\vec b-\frac12\vec b=\frac32\vec b.$$
Alors $2\overrightarrow{AL}+\overrightarrow{AM}=\frac32(\vec b+\vec c)=3\overrightarrow{AI}$.

Donc $I=\operatorname{bar}\{(L,2),(M,1)\}$ et **I, L, M sont alignés**. Plus précisément $\overrightarrow{LI}=\frac13\overrightarrow{LM}$.`),
 ],{figureKey:"tc-t2-l1-source",correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(35,"Un cercle dans un triangle équilatéral",String.raw`$ABC$ est équilatéral de côté $1$. $A'$ est le milieu de $[BC]$ et $G$ celui de $[AA']$.`,[
 W("1.","Exprimer G comme barycentre de A, B, C.",String.raw`Le milieu $G$ est le barycentre de $(A,2),(A',2)$. Comme $(B,1),(C,1)$ a pour barycentre $A'$ et pour somme $2$ :
$$\boxed{G=\operatorname{bar}\{(A,2),(B,1),(C,1)\}.}$$`),
 W("2.",String.raw`Déterminer $2MA^2+MB^2+MC^2=2$.`,String.raw`Dans un repère orthonormé, choisissons $A(0;0),B(1;0),C(\frac12;\frac{\sqrt3}{2})$. Alors $G(\frac38;\frac{\sqrt3}{8})$.
$$GA^2=\frac{3}{16},\qquad GB^2=GC^2=\frac7{16}.$$
La constante est donc $c=2GA^2+GB^2+GC^2=5/4$. La somme des coefficients vaut $4$ :
$$2MA^2+MB^2+MC^2=4MG^2+\frac54.$$
L’équation donne $MG^2=3/16$. C’est le **cercle de centre G et de rayon $\sqrt3/4$**.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(36,"Les tiers des côtés d’un triangle",String.raw`Les points partagent les côtés de $ABC$ en trois segments égaux, dans les ordres $A,I,J,B$ ; $B,K,L,C$ ; $C,M,N,A$. Démontrer que $(IL),(JM),(KN)$ sont concourantes.`,[
 W("1.","Démontrer la concurrence.",String.raw`Soit $G$ le centre de gravité de $ABC$. Pour une origine $O$, les relations de partage donnent :
$$I=\frac{2A+B}{3},\ J=\frac{A+2B}{3},\ K=\frac{2B+C}{3},$$
$$L=\frac{B+2C}{3},\ M=\frac{A+2C}{3},\ N=\frac{2A+C}{3}.$$
Ces écritures abrègent les mêmes égalités entre vecteurs d’origine $O$.

En additionnant par paires :
$$I+L=J+M=K+N=\frac{2(A+B+C)}3=2G.$$
Ainsi $G$ est simultanément le milieu de $[IL]$, de $[JM]$ et de $[KN]$.

**Les trois droites sont concourantes en G.** Il suffit ici d’un même milieu ; aucune intersection compliquée n’est à calculer.`),
 ],{figureKey:"tc-t2-l1-source",correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(37,"Deux alignements dans un parallélogramme",String.raw`$ABCD$ est un parallélogramme, $K$ le milieu de $[AD]$. Les points $I,J$ partagent $[AB]$ en trois segments égaux dans l’ordre $A,I,J,B$. On pose $G=(DJ)\cap(KB)$ et on construit $M$ tel que $KMJA$ soit un parallélogramme.`,[
 W("1.","Démontrer que C, G et I sont alignés.",String.raw`Dans le repère $(A;\overrightarrow{AB},\overrightarrow{AD})$ :
$$C(1;1),\quad I(\tfrac13;0),\quad J(\tfrac23;0),\quad K(0;\tfrac12).$$
Sur $(DJ)$, un point est $(2t/3;1-t)$. Sur $(KB)$, il est $(s;(1-s)/2)$. Les équations donnent $s=2t/3$ puis $1-t=1/2-t/3$, donc $t=3/4,s=1/2$.

Ainsi $G(1/2;1/4)$. Or :
$$\overrightarrow{IG}=(\tfrac16;\tfrac14)=\frac14(\tfrac23;1)=\frac14\overrightarrow{IC}.$$
**C, G et I sont alignés.**`),
 W("2.","Démontrer que C, G et M sont alignés.",String.raw`Dans le parallélogramme $KMJA$, les diagonales ont le même milieu, donc $K+J=M+A$. On obtient $M(2/3;1/2)$.

Or le milieu de $[IC]$ est $(\frac{1/3+1}{2};\frac{0+1}{2})=(2/3;1/2)$. Donc **M est le milieu de [IC]**.

Puisque $C,G,I$ sont alignés à la question 1, les points **C, G, M sont eux aussi alignés**.`),
 ],{figureKey:"tc-t2-l1-source",correctionFigureKey:"tc-t2-l1-barycenter"}),
];
