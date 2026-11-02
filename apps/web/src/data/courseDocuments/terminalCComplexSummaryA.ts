import type { CourseDocumentSection } from "../../domain/courseDocument";
import { complexProductSolution } from "./complexWriting";
export const complexSummaryA:CourseDocumentSection[]=[{id:"complex-algebra-section",numeral:"I",title:"Nombres complexes et forme algébrique",topics:[
 {id:"complex-definition",title:"L’ensemble des nombres complexes",pages:[124],legacyLessonIds:["complex-algebra"],
 body:String.raw`Il existe un nombre $i$ tel que $i^2=-1$. Un nombre complexe est un nombre de la forme $a+ib$, où $a,b$ sont réels. Leur ensemble est noté $\mathbb C$.
$$\mathbb N\subset\mathbb Z\subset\mathbb D\subset\mathbb Q\subset\mathbb R\subset\mathbb C.$$
Tout complexe possède une **unique** écriture $z=a+ib$. C’est sa forme algébrique : $a=\operatorname{Re}(z)$ et $b=\operatorname{Im}(z)$. Les deux parties sont des **réels** : la partie imaginaire est $b$, pas $ib$.
$$z\in\mathbb R\iff\operatorname{Im}(z)=0,\qquad z\in i\mathbb R\iff\operatorname{Re}(z)=0.$$
Zéro est à la fois réel et imaginaire pur ; c’est le seul nombre dans ce cas.`,
 examples:[{id:"complex-first-values",title:"Lire les deux parties",prompt:"Déterminer les parties réelle et imaginaire.",parts:[
 {id:"complex-first-1",label:"a)",prompt:String.raw`$-2-5i$.`,solution:String.raw`On écrit $-2+i(-5)$. La partie réelle est $-2$ et la partie imaginaire $-5$.`},
 {id:"complex-first-2",label:"b)",prompt:String.raw`$8i$.`,solution:String.raw`$8i=0+8i$ : partie réelle $0$, partie imaginaire $8$.`},
 {id:"complex-first-3",label:"c)",prompt:String.raw`$-\sqrt7$ et $3$.`,solution:String.raw`Ce sont des réels : leurs parties imaginaires sont nulles. Leurs parties réelles sont respectivement $-\sqrt7$ et $3$.`},
 {id:"complex-first-4",label:"d)",prompt:String.raw`$7+9i$.`,solution:String.raw`On lit directement $\operatorname{Re}(z)=7$ et $\operatorname{Im}(z)=9$.`}]}]},
 {id:"complex-equality",title:"Égalité de deux complexes",pages:[124],
 body:String.raw`Pour $a,b,a',b'$ réels :
$$\boxed{a+ib=a'+ib'\iff a=a'\ \text{et}\ b=b'.}$$
En particulier, $a+ib=0$ si et seulement si $a=b=0$. Pour chercher un paramètre réel, on doit satisfaire **les deux égalités en même temps**.`,
 examples:[{id:"complex-equality-worked",title:"Identifier un paramètre réel",prompt:String.raw`Trouver $x\in\mathbb R$ tel que $-x+(1-x)i=2+3i$.`,
 solution:String.raw`L’égalité des parties réelles donne $-x=2$, donc $x=-2$. Celle des parties imaginaires donne $1-x=3$, donc également $x=-2$.
Les deux conditions sont compatibles. Pour $x=-2$, le premier membre vaut bien $2+3i$. Ainsi $\boxed{x=-2}$.`}]},
 {id:"complex-operations",title:"Addition, opposé, produit et inverse",pages:[125],
 body:String.raw`Avec $z=a+ib$ et $z'=a'+ib'$ :
$$z+z'=(a+a')+i(b+b'),\qquad -z=-a-ib,$$
$$\boxed{zz'=(aa'-bb')+i(ab'+a'b).}$$
Les règles de distributivité et les identités remarquables restent valables. On calcule comme dans $\mathbb R$, puis on remplace $i^2$ par $-1$.
Pour $z\ne0$, donc $a^2+b^2>0$ :
$$\boxed{\frac1{a+ib}=\frac{a-ib}{a^2+b^2}.}$$
Pour enlever $i$ au dénominateur, multiplier numérateur et dénominateur par le conjugué du dénominateur. Une division impose toujours un dénominateur non nul.`,
 examples:[
 {id:"complex-operations-worked",title:"Calculer avec deux complexes",prompt:String.raw`On pose $z=2+3i$ et $z'=i-5$.`,parts:[
 {id:"complex-op-sum",label:"a)",prompt:String.raw`Calculer $z+z'$.`,solution:String.raw`$(2+3i)+(-5+i)=(2-5)+(3+1)i=\boxed{-3+4i}$.`},
 {id:"complex-op-difference",label:"b)",prompt:String.raw`Calculer $z-z'$.`,solution:String.raw`$2+3i-(i-5)=2+3i-i+5=\boxed{7+2i}$. Les deux signes du second complexe changent.`},
 {id:"complex-op-linear",label:"c)",prompt:String.raw`Calculer $2z-3z'$.`,solution:String.raw`$2(2+3i)-3(i-5)=4+6i-3i+15=\boxed{19+3i}$.`},
 {id:"complex-op-product",label:"d)",prompt:String.raw`Calculer $zz'$.`,solution:complexProductSolution([2,3],[-5,1])},
 {id:"complex-op-square",label:"e)",prompt:String.raw`Calculer $z^2$.`,solution:String.raw`$(2+3i)^2=4+12i+9i^2=4+12i-9=\boxed{-5+12i}$.`}]},
 {id:"complex-inverse-worked",title:"Calculer un inverse",prompt:String.raw`Calculer $(3+2i)(3-2i)$ puis $1/(3+2i)$.`,
 solution:String.raw`Le produit de deux conjugués est réel :
$$(3+2i)(3-2i)=3^2-(2i)^2=9+4=13.$$
Ainsi :
$$\frac1{3+2i}=\frac{3-2i}{(3+2i)(3-2i)}
=\boxed{\frac3{13}-\frac2{13}i}.$$`},
 {id:"complex-opposite-worked",title:"Opposé",prompt:String.raw`Déterminer l’opposé de $-9+3i$.`,solution:String.raw`On change les deux signes : $-(-9+3i)=\boxed{9-3i}$. La somme vaut bien $0$.`}]},
 {id:"complex-integer-powers",title:"Puissances entières et produit nul",pages:[126],legacyLessonIds:["complex-powers"],
 body:String.raw`Pour $n\ge1$, $z^{n+1}=z^n z$. Si $z\ne0$, on pose $z^0=1$ et $z^{-n}=1/z^n$.
Les puissances de $i$ suivent un cycle de longueur $4$ :
$$\boxed{i^{4k}=1,\quad i^{4k+1}=i,\quad i^{4k+2}=-1,\quad i^{4k+3}=-i.}$$
Pour un exposant entier, sa division par $4$ donne le bon reste, y compris s’il est négatif.
Enfin :
$$\boxed{zz'=0\iff z=0\ \text{ou}\ z'=0.}$$`,
 examples:[
 {id:"complex-powers-worked",title:"Réduire une puissance",prompt:"Calculer les puissances suivantes.",parts:[
 {id:"complex-power-2020",label:"a)",prompt:String.raw`$i^{2020}$.`,solution:String.raw`$2020=4\times505$, donc $i^{2020}=(i^4)^{505}=\boxed1$.`},
 {id:"complex-power-six",label:"b)",prompt:String.raw`$\left(\frac{\sqrt3}2+\frac i2\right)^6$.`,solution:String.raw`Le carré vaut $\frac12+\frac{\sqrt3}2i$. Son carré vaut $-\frac12+\frac{\sqrt3}2i$. En multipliant ces deux derniers nombres, on obtient $-1$. La puissance sixième vaut donc $\boxed{-1}$.`},
 {id:"complex-power-cycle",label:"c)",prompt:String.raw`$i^{1000},i^{2021},i^{2023},i^{2028}$.`,solution:String.raw`Les restes modulo $4$ sont $0,1,3,0$. Les résultats sont donc, dans l’ordre, $\boxed{1,\ i,\ -i,\ 1}$.`}]},
 {id:"complex-zero-product-worked",title:"Résoudre un produit nul",prompt:String.raw`Résoudre $(2z-3i)(z-6+i)=0$.`,
 solution:String.raw`Un produit est nul si l’un de ses facteurs est nul :
$$2z-3i=0\quad\text{ou}\quad z-6+i=0.$$
On trouve $z=3i/2$ ou $z=6-i$. Ainsi $\boxed{S=\{3i/2;\ 6-i\}}$.`}]},
 {id:"complex-conjugation",title:"Conjugué : définition et propriétés",pages:[126,127],legacyLessonIds:["complex-conjugate"],
 body:String.raw`Si $z=a+ib$, son conjugué est $\bar z=a-ib$. Sa partie réelle ne change pas et sa partie imaginaire change de signe.
$$\overline{\bar z}=z,\quad z+\bar z=2\operatorname{Re}(z),\quad z-\bar z=2i\operatorname{Im}(z),$$
$$z\bar z=[\operatorname{Re}(z)]^2+[\operatorname{Im}(z)]^2.$$
$$z\in\mathbb R\iff\bar z=z,\qquad z\in i\mathbb R\iff\bar z=-z.$$
La conjugaison respecte l’addition et le produit :
$$\overline{z+z'}=\bar z+\bar z',\quad \overline{zz'}=\bar z\,\bar z'.$$
Si $z\ne0$, $\overline{1/z}=1/\bar z$. Si $z'\ne0$, $\overline{z/z'}=\bar z/\bar z'$.`,
 examples:[
 {id:"complex-conjugate-values",title:"Conjuguer quatre nombres",prompt:String.raw`Conjuguer $2-i,\ 1+2i,\ 5,\ -3$.`,
 solution:String.raw`Les conjugués sont respectivement $\boxed{2+i,\ 1-2i,\ 5,\ -3}$. Les réels restent inchangés.`},
 {id:"complex-conjugate-identities",title:"Utiliser les identités",prompt:String.raw`Pour $z=4+3i$, calculer $z+\bar z,z-\bar z,z\bar z$.`,parts:[
 {id:"complex-conjugate-sum",label:"a)",prompt:String.raw`$z+\bar z$.`,solution:String.raw`$z+\bar z=2\operatorname{Re}(z)=2\times4=\boxed8$.`},
 {id:"complex-conjugate-diff",label:"b)",prompt:String.raw`$z-\bar z$.`,solution:String.raw`$z-\bar z=2i\operatorname{Im}(z)=2i\times3=\boxed{6i}$.`},
 {id:"complex-conjugate-product",label:"c)",prompt:String.raw`$z\bar z$.`,solution:String.raw`$z\bar z=4^2+3^2=\boxed{25}$.`}]},
 {id:"complex-conjugate-operations",title:"Conjuguer une expression",prompt:String.raw`On pose $u=2+5i$, $v=1-3i$. Conjuguer les expressions.`,parts:[
 {id:"complex-conjugate-op-sum",label:"a)",prompt:String.raw`$u+v$.`,solution:String.raw`$\overline{u+v}=(2-5i)+(1+3i)=\boxed{3-2i}$.`},
 {id:"complex-conjugate-op-product",label:"b)",prompt:String.raw`$uv$.`,solution:String.raw`$\overline{uv}=(2-5i)(1+3i)=2+6i-5i-15i^2=\boxed{17+i}$.`},
 {id:"complex-conjugate-op-quotient",label:"c)",prompt:String.raw`$u/v$.`,solution:String.raw`$\overline{u/v}=\frac{2-5i}{1+3i}=\frac{(2-5i)(1-3i)}{10}=\boxed{-\frac{13}{10}-\frac{11}{10}i}$.`}]}]},
 {id:"complex-modulus-properties",title:"Module et distances",pages:[127,128],legacyLessonIds:["complex-modulus"],
 body:String.raw`Le module de $z=a+ib$ est le réel **positif ou nul** :
$$\boxed{|z|=\sqrt{z\bar z}=\sqrt{a^2+b^2}.}$$
Pour tous $z,z'$ :
$$|\bar z|=|z|,\quad |z|=0\iff z=0,\quad |\operatorname{Re}(z)|\le|z|,\quad |\operatorname{Im}(z)|\le|z|,$$
$$|z+z'|\le|z|+|z'|,\qquad |zz'|=|z||z'|.$$
Pour $z\ne0$, $|1/z|=1/|z|$ et $1/z=\bar z/|z|^2$.
Pour $z'\ne0$, $|z/z'|=|z|/|z'|$. On peut donc calculer un module de produit ou quotient sans développer sa forme algébrique.`,
 examples:[
 {id:"complex-modules-worked",title:"Calculer quatre modules",prompt:"Utiliser les deux coordonnées.",parts:[
 {id:"complex-modulus-1",label:"a)",prompt:String.raw`$1+i$.`,solution:String.raw`$|1+i|=\sqrt{1^2+1^2}=\boxed{\sqrt2}$.`},
 {id:"complex-modulus-2",label:"b)",prompt:String.raw`$1-\sqrt3i$.`,solution:String.raw`$|1-\sqrt3i|=\sqrt{1+3}=\boxed2$.`},
 {id:"complex-modulus-3",label:"c)",prompt:String.raw`$\sqrt5+3i$.`,solution:String.raw`$|\sqrt5+3i|=\sqrt{5+9}=\boxed{\sqrt{14}}$.`},
 {id:"complex-modulus-4",label:"d)",prompt:String.raw`$2i$.`,solution:String.raw`$|2i|=\sqrt{0+4}=\boxed2$.`}]},
 {id:"complex-modules-products",title:"Éviter des développements inutiles",prompt:"Calculer les modules.",parts:[
 {id:"complex-modprod-1",label:"1.",prompt:String.raw`$(7+35i)(3+2i)$.`,solution:String.raw`$|7+35i|=7\sqrt{26}$ et $|3+2i|=\sqrt{13}$. Leur produit vaut $7\sqrt{338}=\boxed{91\sqrt2}$.`},
 {id:"complex-modprod-2",label:"2.",prompt:String.raw`$(7-35i)/(3-2i)$.`,solution:String.raw`Le module vaut $7\sqrt{26}/\sqrt{13}=\boxed{7\sqrt2}$. Le dénominateur est non nul.`},
 {id:"complex-modprod-3",label:"3.",prompt:String.raw`$(5+3i)(1+i)/(4+i)$.`,solution:String.raw`Le module vaut $\sqrt{34}\sqrt2/\sqrt{17}=\sqrt4=\boxed2$.`}]}]},
 {id:"complex-affixes-vectors",title:"Affixe, point-image et vecteur-image",pages:[128,129],
 body:String.raw`Dans le plan muni d’un **repère orthonormé direct** $(O;\vec u,\vec v)$, le point $M(x;y)$ a pour affixe $z=x+iy$. Réciproquement, $x+iy$ a pour point-image $M(x;y)$. Le vecteur de coordonnées $(x;y)$ a la même affixe.
Pour les points $M(z)$ et $M'(z')$ :
$$\boxed{z_{\overrightarrow{MM'}}=z'-z,\qquad MM'=|z'-z|.}$$
Le milieu $I$ de $[MM']$ a pour affixe $(z+z')/2$. L’affixe de $\overrightarrow{OM}+\overrightarrow{OM'}$ est $z+z'$. Pour un réel $\lambda$, celle de $\lambda\overrightarrow{OM}$ est $\lambda z$.`,
 nativeFigure:{kind:"complex",preset:"affix"},
 examples:[
 {id:"complex-affixes-worked",title:"Passer des coordonnées aux affixes",prompt:"Lire le point ou le vecteur.",parts:[
 {id:"complex-affix-1",label:"a)",prompt:String.raw`Le point $A$ a pour affixe $3i$.`,solution:String.raw`$3i=0+3i$ donne $\boxed{A(0;3)}$.`},
 {id:"complex-affix-2",label:"b)",prompt:String.raw`Le vecteur $\vec w$ a pour coordonnées $(-3;8)$.`,solution:String.raw`Son affixe est $\boxed{-3+8i}$.`},
 {id:"complex-affix-3",label:"c)",prompt:String.raw`$z_A=5i$, $z_B=2-3i$. Calculer l’affixe de $\overrightarrow{AB}$.`,solution:String.raw`$z_B-z_A=2-3i-5i=\boxed{2-8i}$.`}]},
 {id:"complex-distance-midpoint",title:"Distance et milieu",prompt:String.raw`$z_A=2+5i$, $z_B=-4+3i$. Calculer $AB$ et l’affixe du milieu $K$.`,parts:[
 {id:"complex-distance-midpoint-a",label:"a)",prompt:"Calculer AB.",solution:String.raw`$z_B-z_A=-6-2i$, donc $AB=\sqrt{36+4}=\boxed{2\sqrt{10}}$.`},
 {id:"complex-distance-midpoint-b",label:"b)",prompt:"Calculer l’affixe de K.",solution:String.raw`$z_K=\frac{(2+5i)+(-4+3i)}2=\frac{-2+8i}2=\boxed{-1+4i}$.`}]}]},
]}];
