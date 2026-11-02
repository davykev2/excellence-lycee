import type { CourseDocumentSection } from "../../domain/courseDocument";
export const complexSummaryC:CourseDocumentSection[]=[
 {id:"complex-equations-section",numeral:"III",title:"Résolution d’équations dans ℂ",topics:[
 {id:"complex-square-roots",title:"Racines carrées d’un complexe",pages:[134],legacyLessonIds:["complex-equations"],
 body:String.raw`Une racine carrée de $Z$ est un complexe $\delta$ tel que $\delta^2=Z$. Si $Z\ne0$, il possède exactement deux racines carrées opposées.
Poser $\delta=x+iy$, avec $x,y$ réels, puis utiliser :
$$\delta^2=x^2-y^2+2xyi,\qquad|\delta|^2=x^2+y^2=|Z|.$$
On résout le système :
$$\boxed{\begin{cases}x^2+y^2=|Z|\\x^2-y^2=\operatorname{Re}(Z)\\2xy=\operatorname{Im}(Z).\end{cases}}$$
Les deux premières équations donnent $x^2,y^2$ ; la troisième associe correctement les signes. Ne pas prendre indépendamment tous les signes $\pm$.`,
 examples:[{id:"complex-square-roots-worked",title:"Associer les bons signes",prompt:String.raw`Déterminer les racines carrées de $-3+4i$.`,
 solution:String.raw`$|-3+4i|=5$. On a :
$$x^2+y^2=5,\quad x^2-y^2=-3,\quad xy=2.$$
En additionnant les deux premières équations : $2x^2=2$, donc $x=\pm1$. Puis $y^2=4$. Comme $xy=2>0$, les signes sont les mêmes.
Les racines sont donc $\boxed{1+2i\ \text{et}\ -1-2i}$. On vérifie $(1+2i)^2=-3+4i$.`}]},
 {id:"complex-nth-roots",title:"Racines n-ièmes et racines de l’unité",pages:[135],legacyLessonIds:["roots-of-unity"],
 body:String.raw`Pour $n\ge1$, une racine $n$-ième de $Z$ est un complexe $z$ tel que $z^n=Z$. La seule racine $n$-ième de $0$ est $0$.
Si $Z=re^{i\theta}\ne0$, les **n solutions distinctes** sont :
$$\boxed{z_k=\sqrt[n]r\,e^{i(\theta+2k\pi)/n},\qquad k=0,\ldots,n-1.}$$
Leurs points-images sont sur le cercle de centre $O$ et de rayon $\sqrt[n]r$. Pour $n=2$, ils sont diamétralement opposés ; pour $n>2$, ils forment un polygone régulier.
Avec $j=-\frac12+i\frac{\sqrt3}2$, les racines cubiques de l’unité sont $1,j,\bar j=j^2$ et :
$$\boxed{j^3=1,\quad1+j+j^2=0.}$$
Pour $n\ge2$, la somme des $n$ racines $n$-ièmes d’un complexe non nul vaut $0$. L’isobarycentre de leurs points-images est donc $O$.`,
 nativeFigure:{kind:"complex",preset:"roots"},
 examples:[{id:"complex-roots-worked",title:"Racines et somme géométrique",prompt:"Résoudre les équations et interpréter la somme.",parts:[
 {id:"complex-roots-fifth",label:"1.a)",prompt:String.raw`$z^5=1$.`,solution:String.raw`Le module vaut $1$. Les solutions sont $\boxed{e^{2ik\pi/5},\ k=0,1,2,3,4}$. On peut choisir les angles $0,2\pi/5,4\pi/5,-4\pi/5,-2\pi/5$.`},
 {id:"complex-roots-sum",label:"1.b)",prompt:"Montrer que leur somme est nulle.",solution:String.raw`Avec $q=e^{2i\pi/5}$, on a $q\ne1$ et $q^5=1$. Donc $1+q+q^2+q^3+q^4=(q^5-1)/(q-1)=\boxed0$.`},
 {id:"complex-roots-minus-i",label:"2.",prompt:String.raw`$z^5=-i$.`,solution:String.raw`On prend $-i=e^{-i\pi/2}$. Les cinq solutions sont :
$$\boxed{z_k=e^{i(-\pi/10+2k\pi/5)},\quad k=0,\ldots,4.}$$
Leurs angles peuvent être $-\pi/10,3\pi/10,7\pi/10,11\pi/10,3\pi/2$.`},
 {id:"complex-roots-barycentre",label:"3.",prompt:"Calculer la somme de ces cinq racines et l’interpréter.",solution:String.raw`La somme est $e^{-i\pi/10}(1+q+q^2+q^3+q^4)=0$. L’affixe de l’isobarycentre est cette somme divisée par $5$ : il s’agit de $O$.`},
 {id:"complex-roots-polynomial",label:"4.",prompt:String.raw`$1+iz-z^2-iz^3+z^4=0$.`,solution:String.raw`Posons $w=iz$. L’équation devient $1+w+w^2+w^3+w^4=0$. Pour $w=1$, cette somme vaut $5$ : ce cas n’est pas solution. Si $w\ne1$, elle s’annule si et seulement si $w^5=1$.
Comme $w^5=iz^5$, on obtient $z^5=-i$ en excluant $z=-i$ qui donne $w=1$.
Il reste **quatre** solutions :
$$\boxed{e^{-i\pi/10},\quad e^{3i\pi/10},\quad e^{7i\pi/10},\quad e^{11i\pi/10}.}$$`}]},
 {id:"complex-j-worked",title:"Utiliser les racines cubiques de l’unité",prompt:String.raw`Vérifier $1+j+\bar j=0$.`,solution:String.raw`$\bar j=j^2$ et $j\ne1$, donc $1+j+\bar j=1+j+j^2=(j^3-1)/(j-1)=\boxed0$.`}]}
 ]},
 {id:"complex-geometry-section",numeral:"IV",title:"Nombres complexes et configurations du plan",topics:[
 {id:"complex-geometric-criteria",title:"Angles, alignement, orthogonalité, cercles et médiatrices",pages:[135],
 body:String.raw`Dans un repère orthonormé direct, les affixes transforment des configurations du plan en relations de nombres.
Pour $A\ne B$ et $C\ne D$ :
$$\operatorname{mes}(\overrightarrow{AB};\overrightarrow{CD})
\equiv\arg\left(\frac{z_D-z_C}{z_B-z_A}\right)\pmod{2\pi}.$$
$$AB=CD\iff|z_B-z_A|=|z_D-z_C|.$$
Pour $A\ne B$, les points $A,B,M$ sont alignés si et seulement si $(z_M-z_A)/(z_B-z_A)$ est **réel**, zéro compris si $M=A$.
Les droites $(AB)$ et $(CD)$ sont perpendiculaires si et seulement si leur quotient de directions est imaginaire pur non nul.
$$M\in\text{médiatrice de }[AB]\iff|z_M-z_A|=|z_M-z_B|\quad(A\ne B).$$
$$M\in\mathcal C(A;r)\iff |z_M-z_A|=r\quad(r>0).$$
Pour un **argument** d’un quotient, ni le numérateur ni le dénominateur ne doit être nul. Ne pas oublier les points à exclure dans une caractérisation par un angle.`,
 nativeFigure:{kind:"complex",preset:"geometry"},
 }],
 },
];
