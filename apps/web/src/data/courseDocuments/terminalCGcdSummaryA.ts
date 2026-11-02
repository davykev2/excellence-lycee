import type {CourseDocumentSection} from "../../domain/courseDocument";
import{ex,euclidSolution}from"./gcdWriting";
export const gcdSummaryA:CourseDocumentSection[]=[
{id:"gcd-multiples-section",numeral:"I",title:"Multiples d’un entier relatif",topics:[
 {id:"gcd-multiples",title:"Définition et ensemble des multiples",pages:[162],body:String.raw`Un entier $a$ est un **multiple** de l’entier $b$ lorsqu’il existe un entier relatif $k$ tel que $a=kb$. On dit aussi que $b$ divise $a$ et on écrit $b\mid a$.
$$n\mathbb Z=\{nk\mid k\in\mathbb Z\}.$$
Par exemple, $-52=(-2)\times26$ : $-52$ est un multiple de $26$. Zéro est un multiple de tout entier. Si $a$ et $b$ sont non nuls et $b\mid a$, alors $|b|\leq|a|$.`,
 examples:[ex("gcd-inclusion-model","Divisibilité et inclusion",String.raw`Montrer que $b\mid a$ implique $a\mathbb Z\subset b\mathbb Z$.`,String.raw`Puisque $b\mid a$, on écrit $a=kb$, avec $k\in\mathbb Z$. Un élément $x$ de $a\mathbb Z$ s’écrit $x=pa$, où $p\in\mathbb Z$. Donc $x=p(kb)=(pk)b$. Comme $pk$ est entier, $x\in b\mathbb Z$. Ainsi $\boxed{a\mathbb Z\subset b\mathbb Z}$.`)]},
 {id:"gcd-multiple-properties",title:"Sommes, différences et combinaisons entières",pages:[162],body:String.raw`Si $a$ et $b$ sont des multiples de $n$, alors, pour tous $u,v\in\mathbb Z$, $au+bv$ est un multiple de $n$.
$$n\mathbb Z=(-n)\mathbb Z.$$
Pour tout $a\in n\mathbb Z$ et tout $p\in\mathbb Z$, on a $pa\in n\mathbb Z$. Le signe de $n$ ne change donc pas l’ensemble de ses multiples ; on peut le choisir naturel.`,
 examples:[ex("gcd-linear-combination-model","Justifier la stabilité",String.raw`Justifier que $a+b$ et $a-b$ sont multiples de $n$, puis que tout multiple entier d’un nombre pair est pair.`,String.raw`Écrivons $a=nr$ et $b=ns$, avec $r,s\in\mathbb Z$. Alors $a+b=n(r+s)$ et $a-b=n(r-s)$ : les coefficients entre parenthèses sont entiers.

Si $a$ est pair, $a=2r$. Pour tout entier $p$, $pa=2(pr)$ est donc encore pair.`)]},
]},
{id:"gcd-definitions-section",numeral:"II",title:"PPCM et PGCD de deux entiers non nuls",topics:[
 {id:"gcd-lcm-definition",title:"Plus petit commun multiple",pages:[162,163],legacyLessonIds:["common-multiples-lcm"],nativeFigure:{kind:"gcd",preset:"multiples"},body:String.raw`Le **PPCM** de deux entiers non nuls $a$ et $b$ est le plus petit de leurs multiples communs strictement positifs. On le note $\operatorname{PPCM}(a;b)$.
$$\operatorname{PPCM}(a;b)=\operatorname{PPCM}(|a|;|b|).$$
Pour $a,b\in\mathbb N^*$ :
$$\max(a,b)\leq\operatorname{PPCM}(a;b)\leq ab,$$
$$\operatorname{PPCM}(a;b)=b\iff a\mid b.$$
Les multiples communs sont exactement les multiples du PPCM :
$$a\mathbb Z\cap b\mathbb Z=\operatorname{PPCM}(a;b)\mathbb Z.$$
Pour $k\in\mathbb N^*$ :
$$\operatorname{PPCM}(ka;kb)=k\operatorname{PPCM}(a;b).$$`,
 examples:[
 ex("gcd-lcm-small","Chercher le premier multiple commun",String.raw`Calculer $\operatorname{PPCM}(2;3)$.`,String.raw`Les multiples strictement positifs de $2$ commencent par $2,4,6,8,\ldots$ ; ceux de $3$ par $3,6,9,\ldots$. Le premier nombre commun est $6$, donc $\boxed{\operatorname{PPCM}(2;3)=6}$. Les multiples communs, y compris négatifs et nul, forment $6\mathbb Z$.`),
 ex("gcd-lcm-bounds","Justifier l’encadrement",String.raw`Montrer $\max(a,b)\leq\operatorname{PPCM}(a;b)\leq ab$ pour $a,b>0$.`,String.raw`Le PPCM est un multiple positif de $a$, donc il est au moins égal à $a$. De même, il est au moins égal à $b$ : il est donc au moins $\max(a,b)$. D’autre part, $ab$ est un multiple commun positif. Le **plus petit** de ces multiples ne peut pas dépasser $ab$.`),
 ex("gcd-lcm-scaling","Utiliser un facteur commun",String.raw`Sachant que $\operatorname{PPCM}(8;12)=24$, calculer $\operatorname{PPCM}(24;36)$.`,String.raw`$24=3\times8$ et $36=3\times12$. On applique la propriété avec $k=3$ :
$$\operatorname{PPCM}(24;36)=3\operatorname{PPCM}(8;12)=3\times24=\boxed{72}.$$`),
 ]},
 {id:"gcd-definition",title:"Plus grand commun diviseur",pages:[164],legacyLessonIds:["common-divisors-gcd"],body:String.raw`Le **PGCD** de deux entiers non nuls $a$ et $b$ est le plus grand de leurs diviseurs communs. Il est strictement positif et se note $\operatorname{PGCD}(a;b)$.
$$\operatorname{PGCD}(a;b)=\operatorname{PGCD}(|a|;|b|).$$
Pour $a,b\in\mathbb N^*$ :
$$1\leq\operatorname{PGCD}(a;b)\leq\min(a,b),$$
$$\operatorname{PGCD}(a;b)=b\iff b\mid a.$$
Pour $a>0$, $\operatorname{PGCD}(a;0)=a$. Si $D_a$ désigne l’ensemble des diviseurs entiers de $a$ et $d=\operatorname{PGCD}(a;b)$, alors $D_a\cap D_b=D_d$.
Pour $k\in\mathbb N^*$ :
$$\operatorname{PGCD}(ka;kb)=k\operatorname{PGCD}(a;b).$$`,
 examples:[
 ex("gcd-divisors-model","Comparer les diviseurs",String.raw`Calculer le PGCD de $16$ et $24$, puis leurs diviseurs communs. Déduire aussi $\operatorname{PGCD}(72;108)$ de $\operatorname{PGCD}(2;3)=1$.`,String.raw`**1.** Les diviseurs positifs de $16$ sont $1,2,4,8,16$ ; ceux de $24$ sont $1,2,3,4,6,8,12,24$. Les diviseurs positifs communs sont $1,2,4,8$. Leur plus grand élément est $\boxed{8}$.

**2.** Les diviseurs communs entiers sont ceux de $8$, soit $\boxed{\{-8,-4,-2,-1,1,2,4,8\}}$.

**3.** $72=36\times2$ et $108=36\times3$. Donc $\operatorname{PGCD}(72;108)=36\operatorname{PGCD}(2;3)=\boxed{36}$.`),
 ex("gcd-divisibility-model","Reconnaître le PGCD",String.raw`Démontrer que $\operatorname{PGCD}(a;b)=b$ équivaut à $b\mid a$, pour $a,b>0$.`,String.raw`Si le PGCD vaut $b$, alors $b$ est un diviseur de $a$. Réciproquement, si $b\mid a$, $b$ divise aussi lui-même : c’est un diviseur commun. Tout diviseur positif de $b$ est inférieur ou égal à $b$. Ainsi aucun diviseur commun n’est plus grand que $b$, qui est donc le PGCD.`),
 ]},
 {id:"gcd-euclid",title:"Combinaisons entières et algorithme d’Euclide",pages:[165],legacyLessonIds:["euclidean-algorithm"],nativeFigure:{kind:"gcd",preset:"euclid"},body:String.raw`Pour $a,b>0$ et $d=\operatorname{PGCD}(a;b)$ :
$$d\mid m\iff\exists(u,v)\in\mathbb Z^2,\quad m=au+bv.$$
En particulier, $d$ s’écrit comme une combinaison entière de $a$ et $b$.

Si $a=bq+r$, avec $0\leq r<b$, alors :
$$\operatorname{PGCD}(a;b)=\operatorname{PGCD}(b;r).$$
Si $r=0$, le PGCD est $b$. Sinon, on poursuit les divisions jusqu’au premier reste nul : **le dernier reste non nul est le PGCD**.`,
 examples:[
 ex("gcd-combination-model","Trouver une combinaison",String.raw`Justifier l’existence de $u,v\in\mathbb Z$ tels que $3=13u-6v$, puis en donner un couple.`,String.raw`$13=2\times6+1$, donc $\operatorname{PGCD}(13;6)=1$. Puisque $1$ divise $3$, le couple existe. De $1=13-2\times6$, on déduit $3=13\times3-6\times6$. Ainsi $\boxed{(u;v)=(3;6)}$ convient, sans être le seul couple possible.`),
 ex("gcd-euclid-model","Divisions successives",String.raw`Calculer $\operatorname{PGCD}(92276;30621)$.`,euclidSolution(92276,30621)),
 ]},
]},
];
