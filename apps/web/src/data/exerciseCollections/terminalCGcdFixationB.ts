import{gcdExercise as e,proof,written,numberAnswer as num,particularSolution,diophantineSolution,congruenceSolution}from"./terminalCGcdBuilders";
export const gcdFixationB=[
...[ [25,29,-11,1],[26,324,-245,7],[27,1048,-543,5] ].map(([n,a,b,c])=>e(n,"Solution particulière par Bézout",String.raw`Déterminer une solution particulière de $${a}x+(${b})y=${c}$ dans $\mathbb Z^2$.`,[proof("Donner un couple entier et vérifier.",particularSolution(a,b,c))],true)),
e(28,"Équation avec un couple connu",String.raw`Résoudre $1048x-543y=5$, sachant que $(-43;-83)$ est une solution particulière.`,[proof("Donner toutes les solutions dans ℤ².",String.raw`On vérifie $1048(-43)-543(-83)=5$. Comme le PGCD de $1048$ et $543$ vaut $1$, on soustrait cette identité :
$$1048(x+43)=543(y+83).$$
Gauss donne $543\mid x+43$. Posons $x=-43+543k$ ; alors $y=-83+1048k$. La substitution vérifie la réciproque :
$$\boxed{S=\{(-43+543k;-83+1048k)\mid k\in\mathbb Z\}.}$$`)],true),
e(29,"Équation avec un PGCD non trivial",String.raw`Résoudre $323x+589y=38$, sachant que $(-9;5)$ est une solution particulière.`,[proof("Donner toutes les solutions dans ℤ².",String.raw`$323(-9)+589(5)=-2907+2945=38$. Le PGCD vaut $19$, avec $323=19\times17$, $589=19\times31$. On réduit donc à $17x+31y=2$.

Après soustraction : $17(x+9)=-31(y-5)$. Les coefficients $17,31$ sont premiers entre eux, donc $31\mid x+9$. En posant $x=-9+31k$, on obtient $y=5-17k$.

Réciproquement, la substitution donne bien $38$ dans l’équation initiale.
$$\boxed{S=\{(-9+31k;5-17k)\mid k\in\mathbb Z\}.}$$`)],true),
e(30,"Coprimalité de 5 et 12","Démontrer que 5 et 12 sont premiers entre eux.",[proof("Justifier.",String.raw`$5$ est premier et ne divise pas $12$. Donc le PGCD vaut $1$. On peut aussi écrire l’identité $5\times5-12\times2=1$ et appliquer Bézout.`)]),
e(31,"Coprimalité avec un produit",String.raw`Démontrer que $9$ et $4\times14$ sont premiers entre eux.`,[proof("Justifier.",String.raw`Les facteurs premiers de $9$ se limitent à $3$. Or $4$ et $14$ ne sont pas divisibles par $3$. Ainsi $9$ est premier avec chacun, donc avec leur produit $56$. On vérifie aussi $56=6\times9+2$, $9=4\times2+1$ : le PGCD est $1$.`)]),
e(32,"Équation homogène",String.raw`Résoudre $3x-8y=0$ dans $\mathbb Z^2$.`,[proof("Déterminer tous les couples.",String.raw`$3x=8y$. Comme $3$ et $8$ sont premiers entre eux, Gauss donne $8\mid x$. Posons $x=8k$ ; alors $y=3k$.

Réciproquement, $3(8k)-8(3k)=0$. Ainsi $\boxed{S=\{(8k;3k)\mid k\in\mathbb Z\}}$.`)]),
e(33,"Produit nul modulo un nombre premier",String.raw`Résoudre $(x-1)(x+3)\equiv0\pmod5$ dans $\mathbb Z$.`,[proof("Déterminer toutes les classes solutions.",String.raw`Comme $5$ est premier, il divise le produit si et seulement s’il divise l’un des facteurs. Ainsi $x\equiv1\pmod5$ ou $x\equiv-3\equiv2\pmod5$.
$$\boxed{x=1+5k\ \text{ou}\ x=2+5k,\quad k\in\mathbb Z.}$$`)]),
e(34,"Factoriser avant de résoudre",String.raw`Résoudre $x^2-x-2\equiv0\pmod7$.`,[proof("Déterminer les classes solutions.",String.raw`$x^2-x-2=(x-2)(x+1)$. Le nombre $7$ est premier : $x\equiv2\pmod7$ ou $x\equiv-1\equiv6\pmod7$. Les solutions sont $\boxed{x=2+7k\ \text{ou}\ x=6+7k}$, $k\in\mathbb Z$.`)]),
e(35,"Réduire le polynôme modulo 13",String.raw`Résoudre $x^2-x-7\equiv0\pmod{13}$.`,[proof("Déterminer les classes solutions.",String.raw`On multiplie par $4$ : $4(x^2-x-7)=(2x-1)^2-29$. Comme $29\equiv3\pmod{13}$ et $4^2\equiv3$, on a $(2x-1)^2-4^2\equiv0$.

Donc $(2x-5)(2x+3)\equiv0\pmod{13}$. Puisque $13$ est premier, $2x\equiv5$ ou $2x\equiv-3$. L’inverse de $2$ est $7$, d’où $\boxed{x\equiv9\ \text{ou}\ 5\pmod{13}}$. La substitution confirme les deux classes.`)]),
e(36,"Deux divisibilités",String.raw`Résoudre $x\equiv0\pmod5$ et $x\equiv0\pmod9$.`,[proof("Déterminer les entiers solutions.",String.raw`$5$ et $9$ sont premiers entre eux. Un entier divisible par les deux est donc divisible par leur produit $45$. Réciproquement, tout multiple de $45$ convient. Ainsi $\boxed{x=45k,\ k\in\mathbb Z}$.`)]),
e(37,"Inverse modulo 5",String.raw`Résoudre $2x\equiv-1\pmod5$.`,[proof("Déterminer les solutions.",congruenceSolution(2,-1,5))],true),
e(38,"Relation produit–PGCD–PPCM",String.raw`Sachant que $\operatorname{PPCM}(108;150)=2700$, calculer $\operatorname{PGCD}(108;150)$.`,[num("Résultat","PGCD(108;150)",6,String.raw`La relation de produit donne
$$\operatorname{PGCD}(108;150)=\frac{108\times150}{2700}=\boxed6.$$
Vérification : $108=2^2 3^3$, $150=2\times3\times5^2$ ; les minima donnent $2\times3=6$.`)]),
e(39,"Produit et PPCM imposés",String.raw`Déterminer les couples d’entiers positifs tels que $ab=350$ et $\operatorname{PPCM}(a;b)=70$.`,[proof("Chercher tous les couples.",String.raw`Le PGCD vaut $d=350/70=5$. Posons $a=5r$, $b=5s$, avec $\operatorname{PGCD}(r;s)=1$. Alors $25rs=350$, donc $rs=14$.

Les couples de facteurs premiers entre eux sont $(1;14),(2;7),(7;2),(14;1)$. Après multiplication par $5$ :
$$\boxed{(a;b)\in\{(5;70),(10;35),(35;10),(70;5)\}.}$$`)]),
e(40,"Minima et maxima des exposants","Calculer le PGCD et le PPCM dans chaque cas.",[
num("1. PGCD",String.raw`$a=2^2\times5^3\times7,\ b=3^2\times5^2$.`,25,String.raw`Pour les premiers $2,3,5,7$, les minima sont $0,0,2,0$, donc PGCD$=5^2=\boxed{25}$.`),
num("1. PPCM","Même couple.",31500,String.raw`Les maxima sont $2,2,3,1$. Le PPCM vaut $2^2 3^2 5^3 7=4\times9\times125\times7=\boxed{31500}$.`),
num("2. PGCD",String.raw`$a=2^3\times11,\ b=3^2\times5^4$.`,1,"Aucun facteur premier commun : le PGCD vaut 1."),
num("2. PPCM","Même couple.",495000,String.raw`Les entiers sont premiers entre eux, donc le PPCM est leur produit : $88\times5625=\boxed{495000}$.`),
num("3. PGCD",String.raw`$a=2^2\times3,\ b=3^2$.`,3,String.raw`Le seul facteur commun est $3$ à la puissance minimale1 : PGCD$=\boxed3$.`),
num("3. PPCM","Même couple.",36,String.raw`On prend $2^2$ et $3^2$ : PPCM$=4\times9=\boxed{36}$.`)],true),
e(41,"Nombre de diviseurs positifs",String.raw`Déterminer le nombre de diviseurs positifs de $3^5\times7^3\times13$.`,[num("Nombre","Combien y a-t-il de diviseurs ?",48,String.raw`Un diviseur s’écrit $3^i7^j13^k$, avec $0\leq i\leq5$, $0\leq j\leq3$ et $0\leq k\leq1$. Il y a $(5+1)(3+1)(1+1)=\boxed{48}$ choix. `)]),
e(42,"Liste des diviseurs",String.raw`Déterminer les diviseurs positifs de $3^2\times13$.`,[proof("Donner la liste complète.",String.raw`On multiplie chaque élément de $\{1,3,9\}$ par chaque élément de $\{1,13\}$. Les six produits classés sont $\boxed{1,3,9,13,39,117}$. Ils sont distincts par unicité de la décomposition en facteurs premiers.`)]),
e(43,"Gauss après soustraction",String.raw`Résoudre $7x-22y=-1$, sachant que $(3;1)$ est une solution particulière.`,[proof("Donner toutes les solutions.",String.raw`$7\times3-22\times1=-1$. En soustrayant, $7(x-3)=22(y-1)$. Le PGCD de $7$ et $22$ vaut 1, donc $22\mid x-3$. On obtient $x=3+22k$, $y=1+7k$. La substitution vérifie la réciproque :
$$\boxed{S=\{(3+22k;1+7k)\mid k\in\mathbb Z\}.}$$`)]),
e(44,"Adapter la constante",String.raw`Résoudre $6x+23y=8$, sachant que $(4;-1)$ résout $6x+23y=1$.`,[proof("Donner toutes les solutions.",String.raw`En multipliant par 8, $(32;-8)$ est une solution particulière. Après soustraction : $6(x-32)=-23(y+8)$. Comme le PGCD vaut 1, Gauss donne $x=32+23k$, $y=-8-6k$. Réciproquement, la substitution donne 8 :
$$\boxed{S=\{(32+23k;-8-6k)\mid k\in\mathbb Z\}.}$$`)]),
e(45,"Existence d’un inverse",String.raw`Montrer que $4x\equiv1\pmod9$ admet une solution.`,[proof("Justifier l’existence.",String.raw`$9=2\times4+1$, donc le PGCD vaut 1. La condition d’existence d’un inverse est remplie. On peut déjà vérifier que $4\times7=28\equiv1\pmod9$.`)]),
e(46,"Résoudre avec un inverse",String.raw`Résoudre $4x\equiv1\pmod9$.`,[proof("Donner toutes les solutions.",congruenceSolution(4,1,9))],true),
e(47,"Congruence avec coefficient non inversible",String.raw`Montrer que $8x\equiv6\pmod{10}$ admet une solution.`,[proof("Vérifier la condition d’existence.",String.raw`$\operatorname{PGCD}(8;10)=2$, et $2$ divise $6$. La congruence est donc soluble, même si $8$ n’est pas inversible modulo 10. Elle se réduit à $4x\equiv3\pmod5$.`)]),
e(48,"Réduire aussi le modulo",String.raw`Résoudre $8x\equiv6\pmod{10}$.`,[proof("Donner toutes les solutions.",congruenceSolution(8,6,10))],true),
];
