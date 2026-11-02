import type { CourseDocumentSection } from "../../domain/courseDocument";
export const divisibilitySummaryB:CourseDocumentSection[]=[{
  id:"div-integers",numeral:"II",title:"L’ensemble des entiers relatifs",topics:[
    {id:"div-relative-order",title:"Opérations, opposés et ordre dans ℤ",pages:[53,54,55],legacyLessonIds:[],
      body:String.raw`L’addition et la multiplication de deux relatifs donnent encore des relatifs. Dans $\mathbb Z$, elles sont associatives et commutatives, ont pour neutres $0$ et $1$, et la multiplication est distributive sur l’addition.

Tout $a\in\mathbb Z$ possède un unique opposé $-a\in\mathbb Z$, caractérisé par $a+(-a)=0$. Par exemple, l’opposé de $2$ est $-2$, celui de $-5$ est $5$, et celui de $0$ est $0$.

La soustraction s’écrit avec l’opposé : $a-b=a+(-b)$. Ainsi $60-45=60+(-45)$.

Pour $a,b\in\mathbb Z$ :
$$a\le b\iff b-a\in\mathbb N.$$
Par exemple, $-12\le14$ car $14-(-12)=26\in\mathbb N$. Les relatifs positifs ou nuls sont les naturels ; les négatifs ou nuls vérifient $a\le0$. On écrit $a<b$ si $a\le b$ et $a\ne b$.

L’ordre est réflexif, antisymétrique, transitif et total, comme dans $\mathbb N$.

Pour tout $c\in\mathbb Z$, $a\le b\iff a+c\le b+c$.

- Si $c>0$, $a\le b\iff ac\le bc$.
- Si $c<0$, $a\le b\iff bc\le ac$ : **le sens de l’inégalité s’inverse**.`,
      examples:[
        {id:"div-opposite-example",title:"Opposé d’un entier négatif ou nul",prompt:String.raw`Montrer que $a\le0$ entraîne $-a\ge0$.`,solution:String.raw`On ajoute $-a$ aux deux membres de $a\le0$ : $0\le-a$. Ainsi l’opposé d’un relatif négatif ou nul est un naturel. Pour $a=0$, cet opposé est bien nul.`},
        {id:"div-order-product",title:"Comparer pa et qb",prompt:String.raw`$a,b\in\mathbb Z$, $p,q\in\mathbb N$, $a\le b$, $b\ge0$ et $p\le q$. Démontrer $pa\le qb$.`,solution:String.raw`Comme $p\ge0$, la multiplication de $a\le b$ par $p$ donne $pa\le pb$.

Comme $b\ge0$, la multiplication de $p\le q$ par $b$ donne $pb\le qb$.

Donc $\boxed{pa\le qb}$. On peut aussi calculer $qb-pa=(q-p)b+p(b-a)\ge0$ : chaque produit est positif ou nul.`},
      ],
    },
    {id:"div-euclid-z",title:"Division euclidienne dans ℤ",pages:[55],legacyLessonIds:["euclidean-division-z"],
      body:String.raw`Pour $a\in\mathbb Z$ et $b\in\mathbb Z\setminus\{0\}$, il existe un unique couple d’entiers $(q,r)$ tel que :
$$\boxed{a=bq+r,\qquad0\le r<|b|.}$$
Le **reste est toujours positif ou nul**, même si $a$ ou $b$ est négatif.

Pour retrouver les signes sans apprendre quatre formules, poser $B=|b|$ et effectuer la division par $B>0$. Si $|a|=BQ+R$, $0\le R<B$ :

| Signe de $a$ | Division de $a$ par $B$ |
|---|---|
| $a\ge0$ | $a=BQ+R$ |
| $a<0$, $R=0$ | $a=B(-Q)+0$ |
| $a<0$, $R>0$ | $a=B(-Q-1)+(B-R)$ |

Si le diviseur demandé est $b=-B$, on **change seulement le signe du quotient** obtenu. On garde le même reste. Toujours vérifier l’égalité finale et $0\le r<|b|$.`,
      nativeFigure:{kind:"arithmetic",preset:"euclid"},
      examples:[{id:"div-signed-examples",title:"Deux divisions avec des signes",prompt:"Déterminer le quotient et le reste.",parts:[
        {id:"div-minus43",label:"a)",prompt:String.raw`Diviser $-43$ par $7$.`,solution:String.raw`On part de $43=7\times6+1$. En changeant les signes, $-43=7(-6)-1$, mais $-1$ n’est pas un reste admissible.

On retire une unité au quotient et on ajoute $7$ au reste :
$$-43=7(-7)+6,\qquad0\le6<7.$$
Donc $\boxed{q=-7,\ r=6}$.`},
        {id:"div-minus13",label:"b)",prompt:String.raw`Diviser $94$ par $-13$.`,solution:String.raw`On a $94=13\times7+3=(-13)(-7)+3$. Comme $0\le3<13=|-13|$, le couple demandé est $\boxed{(-7;3)}$.`},
      ]}],
    },
    {id:"div-divisors",title:"Diviseurs et combinaisons linéaires",pages:[56],legacyLessonIds:["integer-divisibility"],
      body:String.raw`Pour $b\ne0$, dire que **b divise a** signifie qu’il existe $k\in\mathbb Z$ tel que $a=bk$. On note $b\mid a$ ; $a$ est alors un multiple de $b$.

Par exemple, $4\mid12$ car $12=4\times3$, et $-6\mid42$ car $42=(-6)(-7)$.

Si $a,b\ne0$ et $b\mid a$, alors $|b|\le|a|$ : en effet, $a=bk$ avec $k\ne0$, donc $|k|\ge1$. Les diviseurs d’un entier non nul sont donc en nombre fini. Ceux de $16$ appartiennent à $[-16;16]\cap\mathbb Z$.

**Combinaison linéaire.** Si $d\ne0$ divise $a$ et $b$, alors, pour tous $p,q\in\mathbb Z$ :
$$\boxed{d\mid(pa+qb).}$$
En écrivant $a=du$ et $b=dv$, on obtient $pa+qb=d(pu+qv)$.
En particulier, $d$ divise $a+b$ et $a-b$.

Pour des expressions en $n$, on choisit souvent $p,q$ de manière à **éliminer n**.`,
      examples:[{id:"div-common-example",title:"Un diviseur commun nécessairement égal à 1",prompt:String.raw`$n\in\mathbb Z$ et $d\in\mathbb N^\ast$. Si $d$ divise $5n+8$ et $7n+11$, démontrer $d=1$.`,solution:String.raw`Le diviseur commun $d$ divise toute combinaison entière des deux nombres, donc :
$$7(5n+8)-5(7n+11)=35n+56-35n-55=1.$$
Ainsi $d\mid1$. Le seul diviseur **positif** de $1$ est $1$, donc $\boxed{d=1}$. La condition $d>0$ élimine $-1$.`}],
    },
    {id:"div-congruences",title:"Congruences et calcul de restes",pages:[57,58],legacyLessonIds:["congruences","modular-strategy-mission","affine-coding-mission","exponential-coding-mission"],
      body:String.raw`Pour un entier $n\ne0$, on dit que $a$ et $b$ sont congrus modulo $n$ lorsque $n$ divise leur différence :
$$\boxed{a\equiv b\pmod n\iff a-b=kn\quad(k\in\mathbb Z).}$$
On peut aussi noter $a\equiv b\ [n]$. Par exemple, $7-(-6)=13$ donne $7\equiv-6\pmod{13}$.

Pour chercher des restes, on prend $n>0$. Tout entier est congru à son reste dans la division par $n$. Deux entiers sont congrus modulo $n$ **si et seulement s’ils ont le même reste**.

La congruence est réflexive ($a\equiv a$), symétrique ($a\equiv b\Rightarrow b\equiv a$) et transitive ($a\equiv b$, $b\equiv c\Rightarrow a\equiv c$), pour un même modulo. C’est une relation d’équivalence.

**Calculer avec les congruences.** Si $a\equiv a'\pmod n$ et $b\equiv b'\pmod n$, alors :
$$a+b\equiv a'+b'\pmod n,\qquad ab\equiv a'b'\pmod n.$$
On peut aussi soustraire et, pour tout entier $k\ge1$, écrire $a^k\equiv(a')^k\pmod n$.

Une congruence ne permet pas de diviser n’importe comment : de $2a\equiv4\pmod8$, on déduit $a\equiv2\pmod4$, **pas forcément modulo 8**.

Pour une grande puissance, chercher une répétition des restes, puis diviser l’exposant par la longueur du cycle. La valeur finale doit appartenir à $\{0,\ldots,n-1\}$.`,
      nativeFigure:{kind:"arithmetic",preset:"power"},
      examples:[
        {id:"div-negative-residue",title:"Transformer un représentant négatif en reste",prompt:String.raw`$a\equiv-2\pmod7$. Quel est le reste de $a$ par $7$ ?`,solution:String.raw`Puisque $-2=7(-1)+5$, on a $-2\equiv5\pmod7$. Donc $a\equiv5\pmod7$. Comme $0\le5<7$, le reste est $\boxed5$.`},
        {id:"div-same-remainder",title:"Comparer deux entiers",prompt:String.raw`Justifier $1489\equiv159\pmod7$.`,solution:String.raw`Les divisions donnent $1489=7\times212+5$ et $159=7\times22+5$. Leurs restes sont identiques, donc les deux nombres sont congrus modulo $7$. On vérifie aussi $1489-159=1330=7\times190$.`},
        {id:"div-difference-residue",title:"Démontrer une divisibilité",prompt:String.raw`$a\equiv4\pmod7$ et $b\equiv-3\pmod7$. Montrer que $7$ divise $a-b$.`,solution:String.raw`En soustrayant les congruences, $a-b\equiv4-(-3)=7\equiv0\pmod7$. Ainsi $a-b$ est un multiple de $7$.`},
        {id:"div-power-2023",title:"Reste d’une grande puissance",prompt:String.raw`Déterminer le reste de $2^{2023}$ par $5$.`,solution:String.raw`Les premières puissances donnent les restes $1,2,4,3,1$ pour les exposants $0,1,2,3,4$. En particulier $2^4\equiv1\pmod5$.

Divisons l’exposant : $2023=4\times505+3$. Ainsi :
$$2^{2023}=(2^4)^{505}2^3\equiv1^{505}\times8\equiv3\pmod5.$$
Comme $0\le3<5$, le reste est $\boxed3$.`},
      ],
    },
    {id:"div-criteria",title:"Critères de divisibilité en base 10",pages:[58,59],legacyLessonIds:["divisibility-tests"],
      body:String.raw`Ces critères sont des **équivalences** : chaque condition est nécessaire et suffisante.

| Diviseur | Test sur l’écriture décimale |
|---|---|
| $2$ | Le dernier chiffre est $0,2,4,6$ ou $8$. |
| $3$ | La somme des chiffres est divisible par $3$. |
| $9$ | La somme des chiffres est divisible par $9$. |
| $11$ | La différence entre les sommes des chiffres de rang pair et de rang impair est divisible par $11$. |
| $5$ | Le dernier chiffre est $0$ ou $5$. |
| $10$ | Le dernier chiffre est $0$. |
| $4$ | Le nombre formé des deux derniers chiffres est divisible par $4$. |
| $25$ | Les deux derniers chiffres sont $00,25,50$ ou $75$. |

Pour $11$, on peut faire une somme alternée des chiffres en partant de n’importe quel côté : changer son signe ne change pas la divisibilité par $11$. Le résultat $0$ est un multiple de $11$.`,
      examples:[{id:"div-tests-worked",title:"Appliquer deux critères",prompt:"Justifier les divisibilités.",parts:[
        {id:"div-198",label:"a)",prompt:String.raw`$198$ par $3$.`,solution:String.raw`La somme des chiffres vaut $1+9+8=18=3\times6$. Donc $3\mid198$. On vérifie $198=3\times66$.`},
        {id:"div-6875",label:"b)",prompt:String.raw`$6875$ par $11$.`,solution:String.raw`La somme alternée vaut $5-7+8-6=0$, multiple de $11$. Donc $11\mid6875$. En effet $6875=11\times625$.`},
      ]}],
    },
  ],
}];
