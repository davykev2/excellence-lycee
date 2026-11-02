import type { CourseEvaluationGroup } from "../../domain/courseDocument";
export const divisibilityEvaluations:CourseEvaluationGroup[]=[
  {id:"div-eval-induction",title:"Comment faire une démonstration par récurrence ?",pages:[62],
    method:String.raw`1. Énoncer précisément $P(n)$ et le premier rang $n_0$.
2. Vérifier $P(n_0)$.
3. Fixer $n\ge n_0$, supposer $P(n)$ et établir $P(n+1)$.
4. Conclure pour tous les rangs concernés, par récurrence.`,
    examples:[{id:"div-eval-odds",title:"Somme des entiers impairs",prompt:String.raw`Démontrer, pour tout $n\in\mathbb N$, $\sum_{k=0}^n(2k+1)=(n+1)^2$.`,
      parts:[
        {id:"div-eval-odds-init",label:"1.",prompt:"Initialisation.",solution:String.raw`Au rang $0$, la somme comporte le seul terme $1$, et $(0+1)^2=1$. La propriété est vraie au premier rang.`},
        {id:"div-eval-odds-step",label:"2.",prompt:"Hérédité.",solution:String.raw`Fixons $n\ge0$ et supposons $\sum_{k=0}^n(2k+1)=(n+1)^2$. Le terme ajouté au rang suivant est $2(n+1)+1=2n+3$. Ainsi :
$$\sum_{k=0}^{n+1}(2k+1)=(n+1)^2+2n+3.$$
Or $(n+1)^2+2n+3=n^2+4n+4=(n+2)^2$. La propriété est donc vraie au rang $n+1$.`},
        {id:"div-eval-odds-end",label:"3.",prompt:"Conclusion.",solution:String.raw`L’initialisation et l’hérédité étant démontrées, $\boxed{\sum_{k=0}^n(2k+1)=(n+1)^2}$ pour tout $n\in\mathbb N$.`},
      ]}],
    questions:[],writtenTasks:[{
      id:"div-eval-seven",topicId:"div-induction",prompt:String.raw`Démontrer par récurrence que, pour tout $n\in\mathbb N$, $3^{2n}-2^n$ est divisible par $7$.`,
      model:String.raw`Posons $A_n=3^{2n}-2^n=9^n-2^n$.

**Initialisation.** $A_0=1-1=0=7\times0$ : la propriété est vraie.

**Hérédité.** Fixons $n\ge0$ et supposons $A_n=7k$ avec $k\in\mathbb Z$. Alors :
$$A_{n+1}=9^{n+1}-2^{n+1}=9(9^n-2^n)+(9-2)2^n.$$
Donc $A_{n+1}=9A_n+7\times2^n=7(9k+2^n)$, qui est un multiple de $7$.

**Conclusion.** Par récurrence, $\boxed{7\mid(3^{2n}-2^n)}$ pour tout naturel $n$.`,
      criteria:["J’initialise au rang 0.","J’exprime le terme suivant à l’aide du précédent et d’un multiple de 7.","Je conclus pour tous les naturels."],
    }],
  },
  {id:"div-eval-remainders",title:"Comment déterminer les restes avec les congruences ?",pages:[62,63],
    method:String.raw`1. Calculer quelques puissances modulo le diviseur.
2. Trouver une puissance congrue à $1$, lorsqu’elle existe.
3. Diviser l’exposant par la période obtenue.
4. Donner un reste compris entre $0$ et le diviseur moins $1$.`,
    examples:[{id:"div-eval-two-nine",title:"Restes de 2ⁿ par 9",prompt:String.raw`Déterminer, suivant $n\in\mathbb N$, le reste de $2^n$ dans la division par $9$.`,
      solution:String.raw`Pour les exposants $0,1,\ldots,6$, les restes successifs sont :

| Exposant | $0$ | $1$ | $2$ | $3$ | $4$ | $5$ | $6$ |
|---|---|---|---|---|---|---|---|
| Reste modulo $9$ | $1$ | $2$ | $4$ | $8$ | $7$ | $5$ | $1$ |

Écrivons $n=6k+r$, $k\in\mathbb N$, $0\le r<6$. Comme $2^6\equiv1\pmod9$ :
$$2^n=(2^6)^k2^r\equiv2^r\pmod9.$$
Le reste vaut donc **1, 2, 4, 8, 7 ou 5** suivant que $n$ est congru à $0,1,2,3,4$ ou $5$ modulo $6$. Le cas $n=0$ est inclus. Toutes les valeurs obtenues sont comprises entre $0$ et $8$.`,
      nativeFigure:{kind:"arithmetic",preset:"power-nine"}}],
    questions:[],writtenTasks:[{
      id:"div-eval-seven-ten",topicId:"div-congruences",prompt:String.raw`Déterminer, suivant $n\in\mathbb N$, le reste de $7^n$ dans la division par $10$.`,
      model:String.raw`On calcule $7^0\equiv1$, $7^1\equiv7$, $7^2=49\equiv9$, $7^3\equiv9\times7=63\equiv3$ et $7^4\equiv3\times7=21\equiv1\pmod{10}$.

Écrivons $n=4k+r$, $0\le r<4$. Alors $7^n=(7^4)^k7^r\equiv7^r\pmod{10}$.

| $n$ modulo $4$ | $0$ | $1$ | $2$ | $3$ |
|---|---|---|---|---|
| Reste de $7^n$ par $10$ | $1$ | $7$ | $9$ | $3$ |

Ces valeurs sont les chiffres des unités de $7^n$, et appartiennent bien à $\{0,\ldots,9\}$.`,
      criteria:["Je calcule le cycle des restes sans oublier l’exposant 0.","Je justifie la réduction de l’exposant modulo 4.","Je présente les quatre cas."],
    }],
  },
  {id:"div-eval-sieve",title:"Comment obtenir une liste de nombres premiers ?",pages:[63],
    method:String.raw`Le **crible d’Ératosthène** :

1. Écrire les entiers de $1$ à $N$ et écarter $1$.
2. Garder $2$, puis éliminer ses multiples autres que lui.
3. Garder le prochain nombre non éliminé, puis éliminer ses multiples autres que lui.
4. Recommencer. Pour éliminer tous les composés, il suffit de traiter les premiers $p$ vérifiant $p^2\le N$.`,
    examples:[{id:"div-eval-primes50",title:"Nombres premiers inférieurs à 50",prompt:"Établir la liste avec un crible.",
      solution:String.raw`On écarte $1$, puis les multiples de $2$ à partir de $4$, ceux de $3$ à partir de $9$, ceux de $5$ à partir de $25$ et ceux de $7$ à partir de $49$. Les multiples plus petits ont déjà été traités.

Comme $\sqrt{50}<8$, aucun autre premier n’est nécessaire. Il reste :
$$\boxed{2,3,5,7,11,13,17,19,23,29,31,37,41,43,47.}$$
Chaque nombre éliminé a un diviseur propre ; les nombres conservés n’ont aucun diviseur premier inférieur ou égal à leur racine carrée.`,
      nativeFigure:{kind:"arithmetic",preset:"sieve-50"}}],
    questions:[],writtenTasks:[{
      id:"div-eval-primes100",topicId:"div-prime-test",prompt:"Déterminer la liste des nombres premiers compris entre 1 et 100.",
      model:String.raw`On barre $1$. On traite les multiples de $2,3,5,7$, en conservant chacun de ces nombres premiers. Cela suffit : tout composé inférieur ou égal à $100$ a un diviseur premier inférieur ou égal à $10$.

La liste obtenue est :
$$2,3,5,7,11,13,17,19,23,29,31,37,41,$$
$$43,47,53,59,61,67,71,73,79,83,89,97.$$
Il y a **25 nombres premiers**. Ni $1$ ni $100$ n’en font partie. Les bornes de l’intervalle ne créent donc pas d’ambiguïté ici.`,
      nativeFigure:{kind:"arithmetic",preset:"sieve-100"},
      criteria:["J’écarte 1.","J’élimine les multiples sans supprimer le premier lui-même.","Ma liste comporte les 25 nombres premiers."],
    }],
  },
];
