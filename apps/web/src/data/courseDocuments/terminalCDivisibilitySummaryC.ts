import type { CourseDocumentSection } from "../../domain/courseDocument";
export const divisibilitySummaryC:CourseDocumentSection[]=[{
  id:"div-prime",numeral:"III",title:"Nombres premiers",topics:[
    {id:"div-prime-definition",title:"Définition et existence de diviseurs premiers",pages:[59],legacyLessonIds:["prime-numbers"],
      body:String.raw`Un entier naturel est **premier** lorsqu’il possède exactement deux diviseurs positifs : $1$ et lui-même.

- $5$ est premier : ses diviseurs positifs sont $1,5$.
- $15$ ne l’est pas : $3$ le divise sans être égal à $1$ ou $15$.
- $0$ n’est pas premier : tous les naturels non nuls le divisent.
- $1$ n’est pas premier : il n’a qu’un seul diviseur positif.

**Tout entier $n>1$ possède au moins un diviseur premier.** En effet, son plus petit diviseur $d>1$ est premier : si $d$ était composé, il aurait un diviseur strictement compris entre $1$ et $d$, qui diviserait aussi $n$.

Par exemple, $12$ a pour diviseur premier $2$.

**Il existe une infinité de nombres premiers.** S’ils étaient en nombre fini $p_1,\ldots,p_k$, le nombre $p_1\cdots p_k+1>1$ aurait un diviseur premier parmi eux. Celui-ci diviserait alors le produit et le nombre, donc leur différence $1$ : impossible.

Les nombres premiers inférieurs à $100$ sont :
$$2,3,5,7,11,13,17,19,23,29,31,37,41,$$
$$43,47,53,59,61,67,71,73,79,83,89,97.$$`,
    },
    {id:"div-prime-test",title:"Reconnaître un nombre premier",pages:[59,60,61],legacyLessonIds:[],
      body:String.raw`Si $n>1$ n’est pas premier, il possède un diviseur premier $p$ tel que :
$$2\le p\le\sqrt n\qquad\text{ou encore}\qquad1<p^2\le n.$$
Ainsi, pour tester $n$, il suffit d’essayer les nombres premiers **inférieurs ou égaux à $\sqrt n$**.

- Si l’un divise $n$, avec $1<p<n$, le nombre est composé.
- Si aucun ne divise $n$, le nombre est premier.

On peut éviter l’approximation de la racine : effectuer les divisions par les premiers successifs $p$, dans l’ordre. Si tous les restes sont non nuls et qu’on atteint un quotient $q<p$, on a dépassé les diviseurs à tester.

Attention : $n$ est toujours divisible par lui-même. Ce fait ne prouve pas qu’il est composé.`,
      examples:[
        {id:"div-101",title:"101 est-il premier ?",prompt:"Justifier par les deux méthodes.",parts:[
          {id:"div-101-root",label:"1.",prompt:"Utiliser la racine carrée.",solution:String.raw`On a $10<\sqrt{101}<11$. Il suffit donc de tester $2,3,5,7$. Les trois premiers ne divisent pas $101$ (parité, somme des chiffres $2$, dernier chiffre $1$). Enfin $101=7\times14+3$. Aucun reste n’est nul : $\boxed{101\text{ est premier}}$.`},
          {id:"div-101-quotient",label:"2.",prompt:"Utiliser les quotients successifs.",solution:String.raw`Les divisions donnent :

| $p$ | Quotient $q$ | Reste $r$ |
|---|---|---|
| $2$ | $50$ | $1$ |
| $3$ | $33$ | $2$ |
| $5$ | $20$ | $1$ |
| $7$ | $14$ | $3$ |
| $11$ | $9$ | $2$ |

Tous les restes sont non nuls et, à la dernière ligne, $q=9<11=p$. On peut donc conclure que $101$ est premier.`},
        ]},
        {id:"div-161",title:"161 est-il premier ?",prompt:"Justifier la réponse.",solution:String.raw`Comme $12<\sqrt{161}<13$, on teste $2,3,5,7,11$. Les divisions par $2,3,5$ donnent respectivement les couples $(80;1)$, $(53;2)$ et $(32;1)$. Mais :
$$161=7\times23+0.$$
Ainsi $7$ est un diviseur différent de $1$ et de $161$ : $\boxed{161\text{ n’est pas premier}}$. Il est inutile de poursuivre les divisions.`},
      ],
    },
    {id:"div-factorization",title:"Décomposer en produit de facteurs premiers",pages:[61],legacyLessonIds:["prime-factorization","number-of-divisors"],
      body:String.raw`**Théorème fondamental de l’arithmétique.** Tout entier naturel $n>1$ s’écrit :
$$\boxed{n=p_1^{\alpha_1}\cdots p_k^{\alpha_k},}$$
où $p_1<\cdots<p_k$ sont des nombres premiers et les exposants $\alpha_i$ sont des entiers naturels non nuls.

Cette décomposition est **unique** lorsque les premiers sont rangés dans l’ordre croissant.

Pour l’obtenir, diviser successivement par les premiers $2,3,5,7,\ldots$. On garde un même diviseur tant qu’il convient, puis on passe au suivant. Le calcul s’arrête lorsque le quotient vaut $1$. Regrouper ensuite les facteurs identiques sous forme de puissances.`,
      examples:[{id:"div-84",title:"Décomposer 84",prompt:"Écrire 84 comme produit de facteurs premiers.",solution:String.raw`Les divisions successives sont :
$$84=2\times42,\quad42=2\times21,\quad21=3\times7,\quad7=7\times1.$$
On relève les diviseurs $2,2,3,7$, tous premiers :
$$\boxed{84=2^2\times3\times7.}$$
Vérification : $4\times3\times7=84$.`}],
    },
  ],
}];
