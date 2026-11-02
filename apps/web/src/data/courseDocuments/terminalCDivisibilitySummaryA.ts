import type { CourseDocumentSection } from "../../domain/courseDocument";
export const divisibilitySummaryA:CourseDocumentSection[]=[{
  id:"div-natural",numeral:"I",title:"L’ensemble des entiers naturels",topics:[
    {id:"div-natural-order",title:"Opérations et ordre dans ℕ",pages:[49,50],legacyLessonIds:[],
      body:String.raw`L’ensemble $\mathbb N=\{0,1,2,\ldots\}$ contient $0$ ; $\mathbb N^\ast=\{1,2,\ldots\}$ ne le contient pas.

Pour $a,b,c\in\mathbb N$, l’addition et la multiplication restent dans $\mathbb N$. Elles sont :

| Propriété | Addition | Multiplication |
|---|---|---|
| Élément neutre | $a+0=a$ | $a\times1=a$ |
| Associativité | $(a+b)+c=a+(b+c)$ | $(ab)c=a(bc)$ |
| Commutativité | $a+b=b+a$ | $ab=ba$ |

La multiplication est distributive sur l’addition : $a(b+c)=ab+ac$.
De plus :
$$a+b=0\iff a=b=0,\qquad ab=1\iff a=b=1.$$
Ces deux équivalences concernent des **entiers naturels**.

**Comparer deux naturels.** $a\le b$ signifie qu’il existe $c\in\mathbb N$ tel que $a+c=b$ ; ce naturel est $c=b-a$. On écrit $a<b$ lorsque $a\le b$ et $a\ne b$.

La relation $\le$ est réflexive ($a\le a$), antisymétrique ($a\le b$ et $b\le a$ donnent $a=b$) et transitive ($a\le b\le c$ donne $a\le c$). Elle est totale : deux naturels sont toujours comparables.

Pour $c\in\mathbb N$ :
$$a\le b\iff a+c\le b+c.$$
Pour $c\in\mathbb N^\ast$ :
$$a\le b\iff ac\le bc.$$
La condition $c\ne0$ est indispensable pour cette dernière équivalence.

**Bornes dans $\mathbb N$.** Toute partie non vide de $\mathbb N$ a un plus petit élément. Si elle est en plus majorée, elle a un plus grand élément. Ainsi $\mathbb N$ a pour minimum $0$, et $\{0,1,2,4,34,100\}$ a pour maximum $100$.

Il n’existe pas de naturel strictement entre deux naturels consécutifs :
$$]n;n+1[\cap\mathbb N=\varnothing.$$
En particulier, pour $n,x\in\mathbb N$ :
$$n<x\iff n+1\le x.$$
Par exemple, $0<n$ entraîne $1\le n$. L’intervalle $]0;1[$ ne contient aucun naturel.`,
      examples:[{id:"div-order-example",title:"Additionner deux inégalités",prompt:String.raw`$a,b,c,d\in\mathbb N$, $a\le b$ et $c\le d$. Démontrer $a+c\le b+d$.`,
        solution:String.raw`En ajoutant $c$ à $a\le b$, on obtient $a+c\le b+c$.

En ajoutant $b$ à $c\le d$, on obtient $b+c\le b+d$.

La transitivité donne donc $\boxed{a+c\le b+d}$. Par ailleurs, $4\le7$ car $4+3=7$, et $7\le15$ car $7+8=15$.`}],
    },
    {id:"div-induction",title:"Démontrer par récurrence",pages:[50,51],legacyLessonIds:[],
      body:String.raw`Une récurrence sert à établir une propriété $P(n)$ pour **tous** les entiers à partir d’un rang $n_0$.

1. **Initialisation :** vérifier $P(n_0)$.
2. **Hérédité :** fixer un entier $n\ge n_0$, supposer $P(n)$ vraie et démontrer $P(n+1)$.
3. **Conclusion :** le principe de récurrence donne $P(n)$ pour tout $n\ge n_0$.

L’hypothèse $P(n)$ ne doit pas être supposée vraie pour tous les rangs : elle est utilisée uniquement pour établir le passage au rang suivant. Vérifier quelques valeurs peut suggérer une propriété, **mais ne la démontre pas**.

Formulation ensembliste : si $X\subset\mathbb N$, $0\in X$ et $n\in X\Rightarrow n+1\in X$ pour tout $n$, alors $X=\mathbb N$.

**Récurrence sur un intervalle fini.** Pour des naturels $a<b$, on peut initialiser à $a$, prouver l’hérédité seulement pour $a\le n<b$, puis conclure pour tous les entiers de $[a;b]$.`,
      examples:[{id:"div-induction-sum",title:"Somme des premiers entiers",prompt:String.raw`Démontrer, pour tout $n\ge1$, $1+2+\cdots+n=\frac{n(n+1)}2$.`,
        parts:[
          {id:"div-induction-init",label:"1.",prompt:"Initialiser au rang 1.",solution:String.raw`Pour $n=1$, le membre de gauche vaut $1$ et $\frac{1(1+1)}2=1$. La propriété est vraie au premier rang.`},
          {id:"div-induction-step",label:"2.",prompt:"Établir l’hérédité.",solution:String.raw`Fixons $n\ge1$ et supposons $1+\cdots+n=\frac{n(n+1)}2$. Alors :
$$1+\cdots+n+(n+1)=\frac{n(n+1)}2+(n+1).$$
En mettant au même dénominateur puis en factorisant :
$$\frac{n(n+1)+2(n+1)}2=\frac{(n+1)(n+2)}2.$$
C’est exactement la formule au rang $n+1$.`},
          {id:"div-induction-end",label:"3.",prompt:"Conclure.",solution:String.raw`L’initialisation et l’hérédité étant établies, le principe de récurrence donne $\boxed{1+\cdots+n=\frac{n(n+1)}2}$ pour tout entier $n\ge1$.`},
        ]}],
    },
    {id:"div-euclid-natural",title:"Division euclidienne dans ℕ",pages:[51],legacyLessonIds:["remainders-operations"],
      body:String.raw`Pour $a\in\mathbb N$ et $b\in\mathbb N^\ast$, il existe un **unique** couple $(q,r)\in\mathbb N^2$ tel que :
$$\boxed{a=bq+r,\qquad0\le r<b.}$$
$q$ est le quotient et $r$ le reste. Les deux conditions doivent être vérifiées : une égalité $a=bq+r$ ne suffit pas si le reste est négatif ou trop grand.

Comme $b>0$, on a $bq\le a<b(q+1)$, donc :
$$q=\left\lfloor\frac ab\right\rfloor,\qquad r=a-bq.$$
Si $a<b$, le quotient vaut $0$ et le reste vaut $a$. Si $b$ divise $a$, le reste est nul.`,
      examples:[{id:"div-euclid-89",title:"Diviser 89 par 3",prompt:"Déterminer le quotient et le reste.",
        solution:String.raw`Les multiples consécutifs $3\times29=87$ et $3\times30=90$ encadrent $89$.
$$89=3\times29+2,\qquad0\le2<3.$$
Ainsi $\boxed{q=29,\ r=2}$.`}],
    },
    {id:"div-bases",title:"Écritures en base b",pages:[52,53],legacyLessonIds:["numeration-divisibility-tests"],
      body:String.raw`Une base est un entier $b\ge2$. Tout entier $x>0$ s’écrit de façon unique :
$$x=a_0+a_1b+\cdots+a_nb^n,$$
avec $0\le a_i<b$ et $a_n\ne0$. On note cette écriture $\overline{a_n\ldots a_0}_{\,b}$. Le dernier chiffre multiplie $b^0=1$ ; le premier chiffre n’est pas nul. Le nombre $0$ s’écrit simplement $0$.

| Base | Chiffres disponibles |
|---|---|
| $2$ | $0,1$ |
| $10$ | $0,1,\ldots,9$ |
| $16$ | $0,\ldots,9,A,B,C,D,E,F$ |

En base $16$, $A=10$, $B=11$, …, $F=15$. Sans indication de base, une écriture est décimale.

**Vers la base 10 :** développer suivant les puissances de la base.

**De la base 10 vers une base $b$ :** faire des divisions euclidiennes successives par $b$ jusqu’au quotient nul ; lire les restes **du dernier au premier**.

**Entre deux autres bases :** passer par la valeur en base $10$, puis effectuer la conversion demandée.`,
      nativeFigure:{kind:"arithmetic",preset:"base"},
      examples:[
        {id:"div-base-decimal",title:"Décomposer 1924",prompt:"Écrire 1924 suivant les puissances de 10.",solution:String.raw`Chaque chiffre est multiplié par la puissance de $10$ correspondant à son rang :
$$\boxed{1924=1\times10^3+9\times10^2+2\times10+4.}$$`},
        {id:"div-base-six",title:"De la base 6 à la base 10",prompt:String.raw`Calculer $\overline{20145}_{\,6}$ en base $10$.`,solution:String.raw`Les cinq chiffres multiplient successivement $6^4,6^3,6^2,6,1$ :
$$2(6^4)+0(6^3)+1(6^2)+4(6)+5.$$
Comme $6^4=1296$ et $6^2=36$, la valeur est $2592+36+24+5=\boxed{2657}$.`},
        {id:"div-base-three",title:"De la base 10 à la base 3",prompt:"Écrire 61 en base 3.",solution:String.raw`Effectuons les divisions :
$$61=3\times20+1,\qquad20=3\times6+2,$$
$$6=3\times2+0,\qquad2=3\times0+2.$$
La lecture des restes de bas en haut donne $\boxed{61=\overline{2021}_{\,3}}$.
Vérification : $2(27)+0(9)+2(3)+1=61$.`},
        {id:"div-base-seven-eight",title:"De la base 7 à la base 8",prompt:String.raw`Écrire $\overline{2015}_{\,7}$ en base $8$.`,solution:String.raw`Calculons d’abord sa valeur décimale :
$$2(7^3)+0(7^2)+1(7)+5=686+7+5=698.$$
Puis :
$$698=8\times87+2,\qquad87=8\times10+7,$$
$$10=8\times1+2,\qquad1=8\times0+1.$$
En lisant les restes du dernier au premier :
$$\boxed{\overline{2015}_{\,7}=\overline{1272}_{\,8}.}$$`},
      ],
    },
  ],
}];
