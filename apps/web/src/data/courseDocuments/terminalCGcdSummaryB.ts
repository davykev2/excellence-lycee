import type {CourseDocumentTopic,CourseDocumentSection} from "../../domain/courseDocument";
import{ex,diophantineSolution}from"./gcdWriting";
export const gcdSummaryB:CourseDocumentTopic[]=[
 {id:"gcd-coprime",title:"Nombres premiers entre eux",pages:[165,166],body:String.raw`Deux entiers non nuls sont **premiers entre eux** lorsque leur PGCD vaut $1$. On dit aussi qu’ils sont étrangers. Cela ne signifie pas qu’ils sont tous deux des nombres premiers : $42$ et $25$ sont premiers entre eux, alors que $135$ et $120$ ne le sont pas, car leur PGCD vaut $15$.

Si $d>0$ est un diviseur commun de $a$ et $b$, alors :
$$d=\operatorname{PGCD}(a;b)\iff\operatorname{PGCD}(a/d;b/d)=1.$$`,
 examples:[ex("gcd-reduced-pair","Réduire par le PGCD",String.raw`Déterminer les couples d’entiers positifs de somme $24$ et de PGCD $6$.`,String.raw`On pose $a=6r$, $b=6s$, avec $r,s>0$ premiers entre eux. Alors $r+s=4$. Les couples positifs possibles sont $(1;3),(2;2),(3;1)$. On écarte $(2;2)$, dont le PGCD n’est pas $1$. En multipliant par $6$, on obtient $\boxed{(a;b)\in\{(6;18),(18;6)\}}$.`)]},
 {id:"gcd-bezout",title:"Théorème de Bézout",pages:[166,167],legacyLessonIds:["bezout-identity"],nativeFigure:{kind:"gcd",preset:"bezout"},body:String.raw`Pour deux entiers non nuls $a,b$, les affirmations suivantes sont équivalentes :

- les seuls diviseurs communs sont $1$ et $-1$ ;
- $\operatorname{PGCD}(a;b)=1$ ;
- $a$ et $b$ sont premiers entre eux ;
- il existe $u,v\in\mathbb Z$ tels que $au+bv=1$.

Cette dernière égalité est une **identité de Bézout**. Pour trouver les coefficients, on peut repérer deux multiples consécutifs ou remonter les divisions de l’algorithme d’Euclide. Les coefficients ne sont pas uniques.`,
 examples:[
 ex("gcd-bezout-parametric","Utiliser une combinaison égale à 1",String.raw`Montrer que $7n+3$ et $5n+2$ sont premiers entre eux, pour tout $n\in\mathbb Z$.`,String.raw`On élimine le terme en $n$ :
$$5(7n+3)-7(5n+2)=35n+15-35n-14=1.$$
Cette identité de Bézout montre que le PGCD vaut $1$. De même, deux entiers consécutifs sont premiers entre eux car $(n+1)-n=1$.`),
 ex("gcd-bezout-small","Repérer des multiples consécutifs",String.raw`Donner une solution particulière de $4x-9y=1$.`,String.raw`Parmi les multiples de $4$ et de $9$, on repère $28$ et $27$. Leur différence vaut $1$ :
$$4\times7-9\times3=28-27=1.$$
Ainsi $\boxed{(x;y)=(7;3)}$ convient.`),
 ex("gcd-bezout-backwards","Remonter les divisions",String.raw`Donner une solution particulière de $51x-43y=1$.`,String.raw`Les divisions donnent $51=43+8$, $43=5\times8+3$, $8=2\times3+2$, $3=2+1$.

On part du reste $1$ et on remplace progressivement :
$$1=3-2=3-(8-2\times3)=3\times3-8,$$
$$1=3(43-5\times8)-8=3\times43-16\times8,$$
$$1=3\times43-16(51-43)=-16\times51+19\times43.$$
Donc $51(-16)-43(-19)=1$ : $\boxed{(x;y)=(-16;-19)}$.`),
 ]},
 {id:"gcd-coprime-products",title:"Propriétés des entiers premiers entre eux",pages:[168],body:String.raw`**1.** Si $p$ est premier et $n\ne0$, alors $p$ et $n$ sont premiers entre eux si et seulement si $p$ ne divise pas $n$.

**2.** Si $a$ est premier avec $b$ et avec $c$, il est premier avec $bc$.

**3.** Si $a$ et $b$ sont premiers entre eux, alors $a^p$ et $b^q$ le sont pour tous entiers $p,q\geq1$.`,
 examples:[ex("gcd-coprime-powers","Passer aux puissances",String.raw`Justifier que $3^{76}$ et $20^{94}$ sont premiers entre eux.`,String.raw`$3$ est premier et ne divise pas $20$ : $\operatorname{PGCD}(3;20)=1$. La propriété sur les puissances s’applique avec $p=76$, $q=94$. Ainsi $\boxed{\operatorname{PGCD}(3^{76};20^{94})=1}$.`)]},
 {id:"gcd-gauss",title:"Théorème de Gauss et produit divisible",pages:[168,169],legacyLessonIds:["gauss-theorem"],body:String.raw`Si $a\mid bc$ et $\operatorname{PGCD}(a;b)=1$, alors $a\mid c$.

**Conséquence 1.** Un nombre premier $p$ divise $ab$ si et seulement s’il divise $a$ **ou** $b$. S’il divise un produit de nombres premiers, il est égal à l’un d’eux. En congruences :
$$ab\equiv0\pmod p\iff a\equiv0\pmod p\ \text{ou}\ b\equiv0\pmod p.$$
**Conséquence 2.** Si $a\mid c$, $b\mid c$ et $\operatorname{PGCD}(a;b)=1$, alors $ab\mid c$. Pour deux entiers non nuls premiers entre eux, $\operatorname{PPCM}(a;b)=|ab|$.

**Conséquence 3.** Pour $n>0$, si $\operatorname{PGCD}(a;n)=1$, alors :
$$ab\equiv ac\pmod n\iff b\equiv c\pmod n.$$
On ne simplifie donc pas un facteur dans une congruence sans vérifier cette hypothèse.`,
 examples:[
 ex("gcd-gauss-equation","Résoudre une équation homogène",String.raw`Résoudre $8x+11y=0$ dans $\mathbb Z^2$.`,String.raw`$8x=-11y$ : $8$ divise $11y$. Comme $8$ et $11$ sont premiers entre eux, Gauss donne $8\mid y$. Posons $y=8k$ ; alors $x=-11k$.

Réciproquement, $8(-11k)+11(8k)=0$ pour tout entier $k$.
$$\boxed{S=\{(-11k;8k)\mid k\in\mathbb Z\}.}$$`),
 ex("gcd-gauss-congruences","Trois applications aux congruences",String.raw`1) Résoudre $3x\equiv0\pmod5$. 2) Résoudre $x\equiv0\pmod3$, $x\equiv0\pmod8$. 3) Résoudre $3x\equiv1\pmod8$.`,String.raw`**1.** $5\mid3x$ et $\operatorname{PGCD}(5;3)=1$, donc $5\mid x$. Les solutions sont $x=5k$.

**2.** $3$ et $8$ sont premiers entre eux : les deux divisibilités équivalent à $24\mid x$. Les solutions sont $x=24k$. La réciproque serait vraie même sans l’hypothèse de coprimalité ; c’est le sens direct qui l’exige.

**3.** $1\equiv9=3\times3\pmod8$. On peut simplifier par $3$, premier avec $8$, et obtenir $x\equiv3\pmod8$. Les solutions sont $\boxed{x=8k+3}$, $k\in\mathbb Z$.`),
 ]},
 {id:"gcd-lcm-relation",title:"Relation entre PGCD et PPCM",pages:[169,170],legacyLessonIds:["gcd-lcm-relation"],body:String.raw`Pour deux entiers non nuls :
$$\boxed{\operatorname{PGCD}(a;b)\operatorname{PPCM}(a;b)=|ab|.}$$
Pour $a,b>0$, posons $a=dr$, $b=ds$, où $d=\operatorname{PGCD}(a;b)$. Alors $r,s$ sont premiers entre eux et $\operatorname{PPCM}(a;b)=drs$. En particulier, le PGCD divise le PPCM.`,
 examples:[
 ex("gcd-lcm-product-model","Déduire le PPCM",String.raw`Sachant $\operatorname{PGCD}(360;21)=3$, calculer $\operatorname{PPCM}(360;21)$.`,String.raw`On utilise la relation de produit :
$$\operatorname{PPCM}(360;21)=\frac{360\times21}{3}=120\times21=\boxed{2520}.$$`),
 ex("gcd-lcm-pairs-model","Chercher deux entiers",String.raw`Trouver les couples positifs tels que $1<d<13$ et $2m+d=39$, où $d$ est le PGCD et $m$ le PPCM.`,String.raw`Posons $a=dr$, $b=ds$, $\operatorname{PGCD}(r;s)=1$. Alors $m=drs$ et $d(2rs+1)=39$. Ainsi $d$ divise $39$ ; avec $1<d<13$, seule la valeur $d=3$ convient.

On obtient $2rs+1=13$, donc $rs=6$. Les couples premiers entre eux sont $(1;6),(2;3),(3;2),(6;1)$. On multiplie par $3$ :
$$\boxed{(a;b)\in\{(3;18),(6;9),(9;6),(18;3)\}.}$$`),
 ]},
 {id:"gcd-prime-factors",title:"Décompositions en facteurs premiers et diviseurs",pages:[170,171],nativeFigure:{kind:"gcd",preset:"factors"},body:String.raw`On utilise la **même liste de nombres premiers** pour les deux décompositions ; un facteur absent a un exposant nul. Si
$$a=\prod_{i=1}^r p_i^{\alpha_i},\qquad b=\prod_{i=1}^r p_i^{\beta_i},$$
alors :
$$\operatorname{PGCD}(a;b)=\prod_{i=1}^r p_i^{\min(\alpha_i,\beta_i)},$$
$$\operatorname{PPCM}(a;b)=\prod_{i=1}^r p_i^{\max(\alpha_i,\beta_i)}.$$
Un diviseur positif de $a$ est de la forme $\prod p_i^{e_i}$ avec $0\leq e_i\leq\alpha_i$. Le nombre de diviseurs positifs est donc $\prod(\alpha_i+1)$ ; celui des diviseurs entiers est le double.`,
 examples:[
 ex("gcd-factors-model","Choisir les bons exposants",String.raw`Calculer le PGCD et le PPCM de $2^2\times7$ et $3^3\times7^2$.`,String.raw`La liste commune est $2,3,7$. Les exposants sont $(2,0,1)$ et $(0,3,2)$.

Pour le PGCD, on prend les minima : $2^0 3^0 7^1=\boxed7$.

Pour le PPCM, on prend les maxima : $2^2 3^3 7^2=4\times27\times49=\boxed{5292}$.`),
 ex("gcd-divisor-count-model","Compter puis lister les diviseurs",String.raw`Déterminer le nombre et la liste des diviseurs positifs de $2^3\times3^2=72$.`,String.raw`Un diviseur positif s’écrit $2^i3^j$, avec $i\in\{0,1,2,3\}$ et $j\in\{0,1,2\}$. Il y a $4\times3=\boxed{12}$ possibilités distinctes.

En combinant $1,2,4,8$ avec $1,3,9$, puis en classant les produits, on trouve :
$$\boxed{1,2,3,4,6,8,9,12,18,24,36,72.}$$`),
 ]},
];
export const gcdSummaryC:CourseDocumentSection[]=[
{id:"gcd-equations-section",numeral:"III",title:"Équations à inconnues entières",topics:[
 {id:"gcd-diophantine",title:String.raw`Équation $ax+by=c$`,pages:[171],legacyLessonIds:["diophantine-solvability"],nativeFigure:{kind:"gcd",preset:"equation"},body:String.raw`Soient $a,b\ne0$, $c\in\mathbb Z$ et $d=\operatorname{PGCD}(a;b)$. L’équation $ax+by=c$ admet une solution entière **si et seulement si** $d\mid c$.

Si cette condition est remplie, on cherche une solution particulière $(x_0;y_0)$, puis on applique Gauss après soustraction. Toutes les solutions sont :
$$x=x_0+\frac bd k,\qquad y=y_0-\frac ad k,\qquad k\in\mathbb Z.$$
L’équation homogène $ax+by=0$ admet toujours des solutions. Si $au+bv=1$, alors $(cu;cv)$ est une solution particulière de $ax+by=c$.`,
 examples:[ex("gcd-diophantine-model","Existence, solution particulière et réciproque",String.raw`Résoudre $10x+4y=18$ dans $\mathbb Z^2$.`,diophantineSolution(10,4,18))]},
 {id:"gcd-congruence",title:String.raw`Équations $ax\equiv b\pmod n$`,pages:[171,172],legacyLessonIds:["diophantine-congruences"],nativeFigure:{kind:"gcd",preset:"congruence"},body:String.raw`Pour $n\geq1$, l’équation $ax\equiv1\pmod n$ possède une solution si et seulement si $\operatorname{PGCD}(a;n)=1$.

Plus généralement, $ax\equiv b\pmod n$ possède une solution si et seulement si $d=\operatorname{PGCD}(a;n)$ divise $b$. Si $d\mid b$, on réduit :
$$\frac ad x\equiv\frac bd\pmod{n/d}.$$
Le coefficient $a/d$ est premier avec $n/d$. On peut donc trouver son inverse. Les solutions forment une classe modulo $n/d$ ; il y en a $d$ distinctes modulo $n$. Dans $\mathbb Z$, toute équation soluble en admet une infinité.`,
 examples:[
 ex("gcd-inverse-model","Trouver un inverse",String.raw`Résoudre $5x\equiv1\pmod8$.`,String.raw`$5$ et $8$ sont premiers entre eux. Or $5\times5=25\equiv1\pmod8$ ; l’inverse de $5$ est donc $5$. On obtient $\boxed{x=5+8k,\ k\in\mathbb Z}$.`),
 ex("gcd-congruence-model","Deux méthodes",String.raw`Résoudre $5x\equiv7\pmod{11}$.`,String.raw`**Avec un inverse.** $5\times9=45\equiv1\pmod{11}$. On multiplie par $9$ : $x\equiv63\equiv8\pmod{11}$.

**En repérant un multiple.** $5\times8=40\equiv7\pmod{11}$. L’équation devient $5x\equiv5\times8\pmod{11}$. Comme $5$ est premier avec $11$, on simplifie : $x\equiv8\pmod{11}$.

Les deux méthodes donnent $\boxed{x=8+11k,\ k\in\mathbb Z}$.`),
 ]},
]},
];
