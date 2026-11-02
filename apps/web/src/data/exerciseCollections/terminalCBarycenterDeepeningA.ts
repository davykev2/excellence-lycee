import { baryExercise as E,written as W,short as S,choice as C } from "./terminalCBarycenterBuilders";
export const barycenterDeepeningA=[
 E(20,"Choisir la bonne écriture","Pour chaque ligne, choisir la bonne réponse.",[
 C("1.",String.raw`$G=\operatorname{bar}\{(E,1),(F,-2),(K,3)\}$ et $H=\operatorname{bar}\{(E,1),(F,-2)\}$. Alors :`,[
 String.raw`$G=\operatorname{bar}\{(H,1),(K,3)\}$`,String.raw`$G=\operatorname{bar}\{(K,3),(H,-1)\}$`,String.raw`$G=\operatorname{bar}\{(E,1),(H,-1)\}$`],1,
 String.raw`Le groupe $(E,1),(F,-2)$ a pour somme $1-2=-1$, pas $1$. Il se remplace donc par $(H,-1)$. La deuxième proposition est la bonne ; la somme totale $-1+3=2$ reste non nulle.`),
 C("2.",String.raw`$G=\operatorname{bar}\{(E,3),(K,-2)\}$ et $E=\operatorname{bar}\{(I,2),(F,1)\}$. Alors :`,[
 String.raw`$G=\operatorname{bar}\{(I,2),(F,1),(K,-2)\}$`,String.raw`$G=\operatorname{bar}\{(K,-2),(E,3),(F,1)\}$`,String.raw`$G=\operatorname{bar}\{(E,1),(K,-2)\}$`],0,
 String.raw`La somme du groupe $(I,2),(F,1)$ vaut $3$, précisément le coefficient de $E$. On peut donc le substituer à $(E,3)$. La première proposition est correcte.`),
 C("3.",String.raw`Une écriture équivalente à $G=\operatorname{bar}\{(E,1),(F,-2),(K,3)\}$ est :`,[
 String.raw`$\operatorname{bar}\{(E,2),(F,-4),(K,3)\}$`,String.raw`$\operatorname{bar}\{(E,2),(F,3),(K,6)\}$`,String.raw`$\operatorname{bar}\{(E,1{,}5),(F,-3),(K,4{,}5)\}$`],2,
 String.raw`Dans la troisième proposition, les trois coefficients ont tous été multipliés par $1{,}5$. C’est bien l’homogénéité. Les autres propositions ne multiplient pas tous les coefficients par un même nombre.`),
 ]),
 E(21,"Réductions dans un parallélogramme",String.raw`$ABCD$ est un parallélogramme de centre $O$. Pour tout point $M$, on pose $\vec u=\overrightarrow{MA}+\overrightarrow{MB}-\overrightarrow{MC}$ et $\vec v=4\overrightarrow{MD}-2\overrightarrow{MA}-2\overrightarrow{MC}$.`,[
 W("1.a",String.raw`Réduire $\vec u$.`,String.raw`Le parallélogramme vérifie $\overrightarrow{AC}=\overrightarrow{AB}+\overrightarrow{AD}$. En décomposant à partir de $A$ :
$$\vec u=\overrightarrow{MA}+\overrightarrow{AB}-\overrightarrow{AC}
=\overrightarrow{MA}-\overrightarrow{AD}.$$
Si $N$ est le symétrique de $D$ par rapport à $A$, $\overrightarrow{AN}=-\overrightarrow{AD}$ et $\boxed{\vec u=\overrightarrow{MN}}$.`),
 W("1.b",String.raw`Réduire $\vec v$.`,String.raw`La somme des coefficients vaut $0$. Prenons $M=A$ :
$$\vec v=4\overrightarrow{AD}-2\overrightarrow{AC}
=2(\overrightarrow{AD}-\overrightarrow{AB})=\boxed{2\overrightarrow{BD}}.$$`),
 W("2.a",String.raw`Démontrer $\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MC}+\overrightarrow{MD}=4\overrightarrow{MO}$.`,String.raw`Le point $O$ est le milieu de $[AC]$ et de $[BD]$. Donc :
$$\overrightarrow{MA}+\overrightarrow{MC}=2\overrightarrow{MO},\qquad
\overrightarrow{MB}+\overrightarrow{MD}=2\overrightarrow{MO}.$$
En additionnant, on trouve bien $4\overrightarrow{MO}$.`),
 W("2.b",String.raw`Démontrer $-3\overrightarrow{MA}+12\overrightarrow{MD}-6\overrightarrow{MB}-3\overrightarrow{MC}=-9\overrightarrow{DB}$.`,String.raw`La somme vaut $-3+12-6-3=0$. L’expression est donc constante ; prenons $M=D$ :
$$-3\overrightarrow{DA}-6\overrightarrow{DB}-3\overrightarrow{DC}.$$
Or $\overrightarrow{DA}+\overrightarrow{DC}=\overrightarrow{DB}$ dans le parallélogramme. Le résultat est $-3\overrightarrow{DB}-6\overrightarrow{DB}=\boxed{-9\overrightarrow{DB}}$.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(22,"Quatre lieux dans un carré",String.raw`$ABCD$ est un carré de côté $a>0$, de centre $I$. On pose $G=\operatorname{bar}\{(A,-1),(B,1),(C,1)\}$. Déterminer les ensembles suivants. Pour les calculs, on peut choisir $A(0;0),B(a;0),C(a;a),D(0;a)$.`,[
 W("a.",String.raw`$\|\overrightarrow{MA}+\overrightarrow{MB}-\overrightarrow{MD}\|=AB$.`,String.raw`La somme des coefficients vaut $1$. Le barycentre $H=A+B-D$ a pour coordonnées $(a;-a)$. La somme vectorielle est $\overrightarrow{MH}$.

La condition devient $MH=a$ : **cercle de centre H(a;−a), de rayon a**.`),
 W("b.",String.raw`$\|-\overrightarrow{MA}+\overrightarrow{MB}+\overrightarrow{MD}\|=-AB$.`,String.raw`Une norme est toujours positive ou nulle. Or $-AB=-a<0$. Aucune égalité n’est possible : **l’ensemble est vide**. Il est inutile de calculer un barycentre. `),
 W("c.",String.raw`$\|\overrightarrow{MA}-\overrightarrow{MB}-\overrightarrow{MD}\|=\|\overrightarrow{IA}+\overrightarrow{IB}-\overrightarrow{IG}+\overrightarrow{ID}\|$.`,String.raw`Comme $A-B-D=-C$ et que la somme des coefficients est $-1$, le membre de gauche vaut $\|-\overrightarrow{MC}\|=MC$.

Le point $G$ a pour coordonnées $(2a;a)$. Le vecteur de droite vaut :
$$\overrightarrow{IA}+\overrightarrow{IB}+\overrightarrow{ID}-\overrightarrow{IG}
=\overrightarrow{GA}.$$
Sa norme est $GA=\sqrt{(2a)^2+a^2}=a\sqrt5$. L’ensemble est le **cercle de centre C et de rayon $a\sqrt5$**.`),
 W("d.",String.raw`$\|4\overrightarrow{MA}-4\overrightarrow{MB}-4\overrightarrow{MD}\|=\|-\overrightarrow{MA}-\overrightarrow{MB}-\overrightarrow{MG}+\overrightarrow{MD}\|$.`,String.raw`Le membre de gauche vaut $4MC$. À droite, la somme des coefficients est $-2$. Son barycentre est :
$$H=\frac{A+B+G-D}{2}=\left(\frac{3a}{2};0\right).$$
La norme de droite vaut $2MH$. L’équation devient $MH=2MC$.

On élève au carré : $MH^2-4MC^2=0$. Le centre du cercle est :
$$K=\frac{H-4C}{1-4}=\frac{4C-H}{3}=\left(\frac{5a}{6};\frac{4a}{3}\right).$$
Son rayon vaut $2KC$. Or $\overrightarrow{CK}=(-a/6;a/3)$, donc $KC=a\sqrt5/6$.

**Cercle de centre $K(\frac{5a}{6};\frac{4a}{3})$, rayon $\frac{a\sqrt5}{3}$.**`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(23,"Produits scalaires et cercles","ABC est un triangle. Déterminer les ensembles suivants.",[
 W("a.",String.raw`$(\overrightarrow{MA}+\overrightarrow{MB})\cdot(\overrightarrow{MB}+\overrightarrow{MC})=0$.`,String.raw`Soient $I$ le milieu de $[AB]$ et $J$ celui de $[BC]$. Les sommes valent $2\overrightarrow{MI}$ et $2\overrightarrow{MJ}$. La condition équivaut donc à :
$$\overrightarrow{MI}\cdot\overrightarrow{MJ}=0.$$
Cela signifie que l’angle $IMJ$ est droit, avec les extrémités également admises puisque le produit est nul lorsqu’un vecteur est nul.

L’ensemble est le **cercle de diamètre [IJ]**, comprenant $I,J$.`),
 W("b.",String.raw`$(\overrightarrow{MA}-2\overrightarrow{MB})\cdot(\overrightarrow{MB}+2\overrightarrow{MC})=0$.`,String.raw`Posons $P=\operatorname{bar}\{(A,1),(B,-2)\}=2B-A$ et $Q=\operatorname{bar}\{(B,1),(C,2)\}$.

Les deux sommes sont $-\overrightarrow{MP}$ et $3\overrightarrow{MQ}$. Le produit vaut donc $-3\overrightarrow{MP}\cdot\overrightarrow{MQ}$.

Il s’annule exactement sur le **cercle de diamètre [PQ]**, extrémités comprises. Les points sont distincts : sinon $C$ serait sur $(AB)$, contrairement à l’hypothèse de triangle. `),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(24,"Construire sur un quadrillage",String.raw`Les points $A,B,C,D,E$ sont placés sur le quadrillage ci-dessous. Construire le barycentre $G$ de $(A,2),(B,-1),(C,3),(D,1),(E,2)$ par une méthode de son choix. Un grand carreau sert d’unité. `,[
 W("1.","Construire G et expliquer la méthode.",String.raw`Choisissons le repère du quadrillage d’origine $D$. La lecture des grands carreaux donne :
$$A(0;3),\quad B(5;2),\quad C(2;1),\quad D(0;0),\quad E(3;3).$$
La somme des coefficients vaut $2-1+3+1+2=7$.
$$x_G=\frac{2(0)-5+3(2)+0+2(3)}7=1,$$
$$y_G=\frac{2(3)-2+3(1)+0+2(3)}7=\frac{13}{7}.$$
On place donc **G(1;13/7)** : une unité à droite de $D$, puis $13/7$ unité au-dessus. Comme $13/7=2-1/7$, le point est juste sous l’horizontale d’ordonnée $2$.`),
 ],{figureKey:"tc-t2-l1-source",correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(25,"Un cercle et une somme constante",String.raw`$ABC$ est un triangle équilatéral de côté $6$. Déterminer les points $M$ tels que $\|\overrightarrow{MA}-2\overrightarrow{MB}+3\overrightarrow{MC}\|=\|\overrightarrow{MA}+\overrightarrow{MB}-2\overrightarrow{MC}\|$.`,[
 W("1.","Déterminer et construire l’ensemble.",String.raw`À gauche, la somme des coefficients vaut $2$. Si $G=\operatorname{bar}\{(A,1),(B,-2),(C,3)\}$, la norme vaut $2MG$.

À droite, la somme des coefficients vaut $0$ : le vecteur est constant. En prenant $M=A$, il vaut $\overrightarrow{AB}-2\overrightarrow{AC}$. Comme $\widehat{BAC}=60^\circ$ :
$$\|\overrightarrow{AB}-2\overrightarrow{AC}\|^2
=AB^2+4AC^2-4AB\,AC\cos60^\circ
=36+144-72=108.$$
La norme vaut $6\sqrt3$. Ainsi $2MG=6\sqrt3$, soit $MG=3\sqrt3$.

**L’ensemble est le cercle de centre G, de rayon $3\sqrt3$.** Pour construire $G$, on peut utiliser $\overrightarrow{AG}=-\overrightarrow{AB}+\frac32\overrightarrow{AC}$.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(26,"Différence de carrés",String.raw`$A\ne B$. Déterminer les points $M$ du plan tels que $MA^2-MB^2=2AB^2$.`,[
 W("1.","Déterminer l’ensemble.",String.raw`Soit $I$ le milieu de $[AB]$. En développant à partir de $I$ :
$$MA^2-MB^2=2\overrightarrow{IM}\cdot\overrightarrow{AB}.$$
La condition devient $\overrightarrow{IM}\cdot\overrightarrow{AB}=AB^2$.

Plaçons $H$ tel que $\overrightarrow{IH}=\overrightarrow{AB}$. Alors :
$$\overrightarrow{IM}\cdot\overrightarrow{AB}=AB^2
\iff\overrightarrow{HM}\cdot\overrightarrow{AB}=0.$$
On obtient la **droite perpendiculaire à (AB) passant par H**, avec $\overrightarrow{AH}=\frac32\overrightarrow{AB}$. Le point $H$ est au-delà de $B$.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(27,"Un angle défini modulo π",String.raw`$C\ne D$ sont deux points d’un plan orienté. Déterminer les points $M$ tels que $(\overrightarrow{MC},\overrightarrow{MD})=-\pi/3\pmod{\pi}$.`,[
 W("1.","Déterminer l’ensemble en tenant compte du modulo.",String.raw`Une égalité modulo $\pi$ autorise les angles $-\pi/3$ **et** $2\pi/3$ modulo $2\pi$. Les deux arcs du même cercle conviennent.

On construit le centre $O$ sur la médiatrice de $[CD]$ avec $(\overrightarrow{OC},\overrightarrow{OD})=-2\pi/3\pmod{2\pi}$. Le rayon vaut $CD/\sqrt3$.

L’ensemble est **le cercle entier passant par C,D, privé de C et D**. Avec $C$ à gauche de $D$, le centre est au-dessous de $(CD)$. Ne conserver qu’un arc oublierait la moitié des solutions. `),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(28,"Retrouver un barycentre partiel",String.raw`$EFG$ est un triangle. On pose $A=\operatorname{bar}\{(E,1),(F,1)\}$, $B=\operatorname{bar}\{(E,3),(G,-1)\}$, $C=\operatorname{bar}\{(F,3),(G,1)\}$.`,[
 W("1.",String.raw`Démontrer $B=\operatorname{bar}\{(A,3),(C,-2)\}$.`,String.raw`Choisissons une origine $O$. Les définitions donnent :
$$\overrightarrow{OA}=\frac{\overrightarrow{OE}+\overrightarrow{OF}}2,\qquad
\overrightarrow{OC}=\frac{3\overrightarrow{OF}+\overrightarrow{OG}}4.$$
Donc :
$$3\overrightarrow{OA}-2\overrightarrow{OC}
=\frac32\overrightarrow{OE}-\frac12\overrightarrow{OG}
=\overrightarrow{OB}.$$
Comme $3-2=1\ne0$, cette égalité est exactement celle du barycentre $(A,3),(C,-2)$. **B appartient donc aussi à (AC).**`),
 ]),
 E(29,"Projection dans un triangle équilatéral",String.raw`$ABC$ est équilatéral, $I$ est le milieu de $[BC]$, $H$ est le projeté orthogonal de $I$ sur $(AB)$ et $K$ est le milieu de $[IH]$.`,[
 W("1.","Exprimer H comme barycentre de A et B.",String.raw`Soit $a=AB$. La projection de $C$ sur $(AB)$ est le milieu de $[AB]$, d’abscisse $a/2$ à partir de $A$. Celle de $B$ est $B$, d’abscisse $a$.

La projection du milieu $I$ est donc le milieu de ces deux projections : son abscisse vaut $(a+a/2)/2=3a/4$. Ainsi :
$$\overrightarrow{AH}=\frac34\overrightarrow{AB},\qquad
\boxed{H=\operatorname{bar}\{(A,1),(B,3)\}}.$$`),
 W("2.","Exprimer K comme barycentre de A, B, C.",String.raw`Pour une origine $O$, $I=(B+C)/2$, $H=(A+3B)/4$ et $K=(I+H)/2$. En mettant au même dénominateur :
$$K=\frac12\left(\frac{B+C}{2}+\frac{A+3B}{4}\right)=\frac{A+5B+2C}{8}.$$
Cette écriture affine signifie :
$$\boxed{K=\operatorname{bar}\{(A,1),(B,5),(C,2)\}.}$$`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(30,"Calculs et équations cartésiennes",String.raw`Dans un repère orthonormé, $A(3;4)$ et $B(-1;2)$.`,[
 S("1.a",String.raw`Abscisse de $G=\operatorname{bar}\{(A,2),(B,3)\}$ ?`,String.raw`$\frac35$`,["3/5","0.6"],String.raw`La somme des coefficients vaut $2+3=5$. On multiplie chaque abscisse par son coefficient :
$$x_G=\frac{2(3)+3(-1)}{2+3}=\boxed{\frac35}.$$`),
 S("1.b",String.raw`Ordonnée de $G$ ?`,String.raw`$\frac{14}{5}$`,["14/5","2.8"],String.raw`On utilise la même somme $5$, mais cette fois les ordonnées $4$ et $2$ :
$$y_G=\frac{2(4)+3(2)}5=\boxed{\frac{14}{5}}.$$
Les coordonnées de $G$ sont donc $(3/5;14/5)$.`),
 W("2.",String.raw`Donner une équation de $\|4\overrightarrow{MA}+5\overrightarrow{MB}\|=45$.`,String.raw`La somme vaut $9$. Le barycentre $H$ a pour coordonnées :
$$H\left(\frac{4(3)+5(-1)}9;\frac{4(4)+5(2)}9\right)=H\left(\frac79;\frac{26}{9}\right).$$
La norme est $9MH$ ; l’équation devient $MH=5$. Donc :
$$\boxed{\left(x-\frac79\right)^2+\left(y-\frac{26}{9}\right)^2=25.}$$
C’est le cercle de centre $H$, rayon $5$.`),
 W("3.",String.raw`Donner une équation de $\|3\overrightarrow{MA}+2\overrightarrow{MB}\|=\|7\overrightarrow{MA}-2\overrightarrow{MB}\|$.`,String.raw`Les deux sommes de coefficients valent $5$. Posons :
$$U=\frac{3A+2B}{5}=\left(\frac75;\frac{16}{5}\right),\quad
V=\frac{7A-2B}{5}=\left(\frac{23}{5};\frac{24}{5}\right).$$
La condition devient $MU=MV$, donc c’est la médiatrice de $[UV]$. En développant $MU^2=MV^2$ :
$$\frac{32}{5}x+\frac{16}{5}y-32=0.$$
Après division par $16/5$, une équation est $\boxed{2x+y-10=0}$.`),
 ],{correctionFigureKey:"tc-t2-l1-barycenter"}),
 E(31,"Reconnaître le centre de gravité",String.raw`$ABC$ est un triangle. Le point $G$ vérifie $C=\operatorname{bar}\{(A,1),(B,1),(G,-3)\}$.`,[
 W("1.","Montrer que G est le centre de gravité de ABC.",String.raw`La somme vaut $1+1-3=-1$. Pour une origine $O$ :
$$-\overrightarrow{OC}=\overrightarrow{OA}+\overrightarrow{OB}-3\overrightarrow{OG}.$$
On réorganise :
$$3\overrightarrow{OG}=\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC}.$$
Donc $G=\operatorname{bar}\{(A,1),(B,1),(C,1)\}$ : **G est le centre de gravité de ABC**.`),
 ]),
];
