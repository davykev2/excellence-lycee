import { baryExercise as E,written as W } from "./terminalCBarycenterBuilders";
export const barycenterFixationB=[
 E(11,"Changer de repère et regrouper",String.raw`$ABC$ est un triangle. On pose $H=\operatorname{bar}\{(A,2),(B,1)\}$ et $G=\operatorname{bar}\{(H,3),(C,4)\}$.`,[
 W("1.",String.raw`Déterminer les coordonnées de $H$ dans le repère $(C;\overrightarrow{CA},\overrightarrow{CB})$.`,String.raw`Dans ce repère, $C(0;0)$, $A(1;0)$ et $B(0;1)$. Donc :
$$x_H=\frac{2(1)+1(0)}3=\frac23,\qquad y_H=\frac{2(0)+1(1)}3=\frac13.$$
Ainsi $\boxed{H(\frac23;\frac13)}$.`),
 W("2.",String.raw`Déterminer les coordonnées de $G$ dans le repère $(A;\overrightarrow{AH},\overrightarrow{AC})$.`,String.raw`Dans ce nouveau repère, $H(1;0)$ et $C(0;1)$. Les coefficients de $G$ sont $3,4$, de somme $7$ :
$$\boxed{G(\frac37;\frac47)}.$$
Les coordonnées de $H$ obtenues à la question 1 ne s’utilisent pas ici : le repère a changé. Le repère est bien défini car $H\in(AB)$ et $C\notin(AB)$.`),
 W("3.","Écrire G comme barycentre de A, B et C.",String.raw`Le groupe $(A,2),(B,1)$ a pour somme $3$ et pour barycentre $H$. On peut donc remplacer $(H,3)$ :
$$\boxed{G=\operatorname{bar}\{(A,2),(B,1),(C,4)\}.}$$`),
 ]),
 E(12,"Écrire un point comme barycentre",String.raw`Dans le repère $(A;\overrightarrow{AB},\overrightarrow{AC})$, le point $M$ vérifie $\overrightarrow{AM}=-2\overrightarrow{AB}+7\overrightarrow{AC}$.`,[
 W("1.","Écrire M comme barycentre de A, B et C.",String.raw`Cherchons des coefficients de somme $1$. Le coefficient de $B$ est $-2$, celui de $C$ est $7$ ; celui de $A$ doit donc être $1-(-2)-7=-4$.

On a $\boxed{M=\operatorname{bar}\{(A,-4),(B,-2),(C,7)\}}$. Vérification : la somme vaut $1$ et la réduction en $A$ redonne exactement la relation donnée.`),
 ]),
 E(13,"Une identité avec un milieu","I est le milieu du segment [AB].",[
 W("1.",String.raw`Démontrer que $MA^2+MB^2=2MI^2+\frac12AB^2$ pour tout point $M$.`,String.raw`Écrivons $\overrightarrow{MA}=\overrightarrow{MI}+\overrightarrow{IA}$ et $\overrightarrow{MB}=\overrightarrow{MI}+\overrightarrow{IB}$. En développant :
$$MA^2+MB^2=2MI^2+IA^2+IB^2+2\overrightarrow{MI}\cdot(\overrightarrow{IA}+\overrightarrow{IB}).$$
Comme $I$ est le milieu, $\overrightarrow{IA}+\overrightarrow{IB}=\vec0$ et $IA=IB=AB/2$. Ainsi :
$$IA^2+IB^2=2(AB/2)^2=AB^2/2.$$
On obtient bien $\boxed{MA^2+MB^2=2MI^2+\frac12AB^2}$.`),
 ]),
 E(14,"Un cercle dans un triangle rectangle",String.raw`$ABC$ est rectangle en $A$, $BC=a>0$, et $G=\operatorname{bar}\{(A,4),(B,-1),(C,-1)\}$. On cherche les points $M$ tels que $4MA^2-MB^2-MC^2=-a^2$.`,[
 W("1.","Construire G.",String.raw`Soit $I$ le milieu de $[BC]$. Le groupe $(B,-1),(C,-1)$ se remplace par $(I,-2)$ :
$$G=\operatorname{bar}\{(A,4),(I,-2)\}.$$
La somme vaut $2$ et $2\overrightarrow{AG}=-2\overrightarrow{AI}$, donc $\overrightarrow{AG}=-\overrightarrow{AI}$.

**G est le symétrique de I par rapport à A.** Dans un triangle rectangle, $AI=BC/2=a/2$ ; ainsi $AG=a/2$.`),
 W("2.a","Vérifier que A appartient à l’ensemble.",String.raw`Pour $M=A$, le membre de gauche vaut $-AB^2-AC^2$. Par Pythagore, $AB^2+AC^2=BC^2=a^2$. On trouve bien $-a^2$.`),
 W("2.b","Déterminer et construire l’ensemble.",String.raw`La somme des coefficients vaut $2$. La réduction quadratique donne $f(M)=2MG^2+f(G)$.

Comme $f(A)=-a^2$ et $AG^2=a^2/4$, on a :
$$-a^2=2(a^2/4)+f(G),\qquad f(G)=-3a^2/2.$$
La condition devient $2MG^2-3a^2/2=-a^2$, donc $MG^2=a^2/4$.

C’est le **cercle de centre G, de rayon $a/2$, passant par A**.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(15,"Somme de carrés avec trois points alignés",String.raw`On donne trois points $A,B,C$ tels que $AB=2$, $AC=1$ et $BC=1$.`,[
 W("1.",String.raw`Construire $G=\operatorname{bar}\{(A,-1),(B,1),(C,1)\}$.`,String.raw`Comme $AC+CB=AB$, le point $C$ est le milieu de $[AB]$. Sur l’axe d’origine $A$ orienté vers $B$, on a $x_A=0,x_C=1,x_B=2$.

La somme des coefficients vaut $1$, donc $x_G=-0+2+1=3$. **G est au-delà de B et BG = 1.**`),
 W("2.",String.raw`Déterminer les points du plan vérifiant $-MA^2+MB^2+MC^2=0$.`,String.raw`La somme vaut $1$, donc $f(M)=MG^2+f(G)$. Puisque $GA=3$, $GB=1$, $GC=2$ :
$$f(G)=-3^2+1^2+2^2=-4.$$
L’équation équivaut à $MG^2-4=0$. L’ensemble est le **cercle de centre G et de rayon 2**. L’alignement des trois points ne gêne pas la réduction. `),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(16,"Une droite de niveau",String.raw`Les points $A,B,C$ sont fixés avec $AB=4$ et $AC=2$. Déterminer les points $M$ du plan tels que $-2MA^2+MB^2+MC^2=5$.`,[
 W("1.","Déterminer et construire l’ensemble.",String.raw`La somme des coefficients vaut $-2+1+1=0$. Prenons $A$ pour origine et posons :
$$\vec u=\overrightarrow{AB}+\overrightarrow{AC}=2\overrightarrow{AI},$$
où $I$ est le milieu de $[BC]$. Ce vecteur est non nul : sinon $\overrightarrow{AB}=-\overrightarrow{AC}$ imposerait $AB=AC$, alors que $4\ne2$.

La valeur en $A$ est $AB^2+AC^2=16+4=20$. Ainsi :
$$f(M)=20-2\overrightarrow{AM}\cdot\vec u=20-4\overrightarrow{AM}\cdot\overrightarrow{AI}.$$
La condition $f(M)=5$ équivaut à $\overrightarrow{AM}\cdot\overrightarrow{AI}=15/4$.

Plaçons $H$ sur $(AI)$ avec $\overrightarrow{AH}=\frac{15}{4AI^2}\overrightarrow{AI}$. Pour tout $M$ :
$$\overrightarrow{AM}\cdot\overrightarrow{AI}=15/4
\iff\overrightarrow{HM}\cdot\overrightarrow{AI}=0.$$
L’ensemble est la **droite perpendiculaire à (AI), passant par H**. Les seules longueurs $AB,AC$ ne fixent pas l’angle du triangle ; on conserve donc cette construction relative aux points donnés.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(17,"Un niveau vide et un point",String.raw`On donne trois points $A,B,C$ tels que $AB=2$, $AC=1$ et $BC=1$.`,[
 W("1.",String.raw`Déterminer $MA^2+MB^2-MC^2=0$.`,String.raw`L’égalité $AC+CB=AB$ montre que $C$ est le milieu de $[AB]$. L’identité du milieu donne :
$$MA^2+MB^2=2MC^2+AB^2/2=2MC^2+2.$$
Ainsi $MA^2+MB^2-MC^2=MC^2+2$. Cette quantité est au moins $2$, jamais $0$ : **l’ensemble est vide**. `),
 W("2.",String.raw`Déterminer $MA^2+MB^2-MC^2=2\overrightarrow{AC}\cdot\overrightarrow{CB}$.`,String.raw`Les vecteurs $\overrightarrow{AC}$ et $\overrightarrow{CB}$ ont même sens et norme $1$. Leur produit scalaire vaut $1$, donc le membre de droite vaut $2$.

La condition devient $MC^2+2=2$, soit $MC=0$. **L’ensemble est le seul point C.**`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(18,"Une sphère d’Apollonius",String.raw`Dans l’espace, $[AB]$ a pour longueur $9$. Déterminer et construire l’ensemble des points tels que $\frac{MA}{MB}=9$.`,[
 W("1.","Identifier l’ensemble, son centre et son rayon.",String.raw`Le point $B$ est exclu. Comme $k=9\ne1$, c’est une sphère de centre $G=\operatorname{bar}\{(A,1),(B,-81)\}$ et de rayon $R=9GB$.

Sur l’axe d’origine $A$ avec $x_B=9$ :
$$x_G=\frac{-81\times9}{1-81}=\frac{729}{80},\qquad GB=\frac{729}{80}-9=\frac9{80}.$$
Donc $\boxed{R=\frac{81}{80}}$. Le centre est légèrement au-delà de $B$.`),
 W("2.","Donner une construction à partir d’un diamètre.",String.raw`On construit :
$$I=\operatorname{bar}\{(A,1),(B,9)\},\quad
J=\operatorname{bar}\{(A,1),(B,-9)\}.$$
Leurs abscisses sont $x_I=81/10$ et $x_J=81/8$.

La sphère a pour diamètre $[IJ]$. Le milieu a pour abscisse $\frac12(81/10+81/8)=729/80$, et le demi-diamètre vaut $\frac12(81/8-81/10)=81/80$, ce qui confirme la première méthode.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(19,"Sélectionner un arc orienté",String.raw`Dans un plan orienté, $A\ne B$. Déterminer et construire les points $M$ tels que $(\overrightarrow{MA},\overrightarrow{MB})=-2\pi/3\pmod{2\pi}$.`,[
 W("1.","Déterminer l’ensemble.",String.raw`Les points $A,B$ sont exclus. Le centre $O$ est sur la médiatrice de $[AB]$ et vérifie $(\overrightarrow{OA},\overrightarrow{OB})=-4\pi/3\pmod{2\pi}$, soit $2\pi/3$.

Avec $A$ à gauche de $B$ dans un repère direct, $O$ est au-dessus de $(AB)$. Le cercle a pour rayon $AB/(2\sin(2\pi/3))=AB/\sqrt3$.

On conserve **le petit arc situé au-dessous de (AB)**, sans ses extrémités. Un point de cet arc voit le segment sous l’angle orienté $-2\pi/3$. L’autre arc donne $\pi/3$ : il ne convient pas.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
];
