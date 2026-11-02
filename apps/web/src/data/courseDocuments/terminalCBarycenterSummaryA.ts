import type { CourseDocumentSection } from "../../domain/courseDocument";
export const barycenterSummaryA: CourseDocumentSection[] = [{
  id:"barycenters",numeral:"I",title:"Barycentre de n points pondérés",topics:[
    {id:"bary-definition",title:"Existence et définition",pages:[19],legacyLessonIds:["weighted-barycenter"],
      body:String.raw`On associe aux points $A_1,\ldots,A_n$ des coefficients réels $\alpha_1,\ldots,\alpha_n$. Posons $S=\alpha_1+\cdots+\alpha_n$.

**Si $S\ne0$**, il existe un unique point $G$ tel que :
$$\boxed{\alpha_1\overrightarrow{GA_1}+\cdots+\alpha_n\overrightarrow{GA_n}=\vec0.}$$
Ce point est le **barycentre** du système $(A_1,\alpha_1),\ldots,(A_n,\alpha_n)$. On écrit :
$$G=\operatorname{bar}\{(A_1,\alpha_1),\ldots,(A_n,\alpha_n)\}.$$
Les coefficients peuvent être positifs, négatifs ou nuls. On vérifie leur **somme avant tout calcul**.

Lorsque $S=0$, ce système ne définit pas de barycentre unique. On ne peut donc pas diviser par $S$.`,
      examples:[{id:"bary-existence-example",title:"Deux systèmes de cinq points",prompt:"Les points A, B, C, D et E sont fixés.",parts:[
        {id:"bary-existence-f",label:"1.",prompt:String.raw`$F=\{(A,1),(B,-4),(C,-2),(D,3),(E,-5)\}$.`,
          solution:String.raw`La somme vaut $1-4-2+3-5=-7\ne0$. Le système possède donc un unique barycentre $G$, caractérisé par :
$$\overrightarrow{GA}-4\overrightarrow{GB}-2\overrightarrow{GC}+3\overrightarrow{GD}-5\overrightarrow{GE}=\vec0.$$`},
        {id:"bary-existence-k",label:"2.",prompt:String.raw`$K=\{(A,-1),(B,-4),(C,-2),(D,2),(E,5)\}$.`,
          solution:String.raw`Cette fois $-1-4-2+2+5=0$. **Ce système ne définit pas de barycentre.** La condition de somme non nulle n’est pas satisfaite.`},
      ]}],
    },
    {id:"bary-homogeneity",title:"Homogénéité : changer les coefficients sans déplacer G",pages:[19,20],legacyLessonIds:["isobarycenter-homogeneity"],
      body:String.raw`Multiplier **tous** les coefficients par le même réel $\delta\ne0$ ne change pas le barycentre :
$$\operatorname{bar}\{(A_i,\alpha_i)\}=\operatorname{bar}\{(A_i,\delta\alpha_i)\}.$$
En effet, la relation vectorielle est simplement multipliée par $\delta$. Les rapports entre les coefficients restent les mêmes.

On peut en particulier **diviser chaque coefficient par $S$** : leur nouvelle somme vaut alors $1$.

Lorsque tous les coefficients sont égaux et non nuls, le barycentre est l’**isobarycentre**. Pour deux points, c’est le milieu ; pour trois sommets d’un triangle, le centre de gravité. `,
      examples:[{id:"bary-homogeneity-example",title:"Reprendre le système F",prompt:"Donner deux autres écritures du même barycentre.",parts:[
        {id:"bary-homogeneity-double",label:"1.",prompt:"Multiplier tous les coefficients par 2.",solution:String.raw`On obtient $(A,2),(B,-8),(C,-4),(D,6),(E,-10)$. Leur somme vaut $-14\ne0$ et le barycentre reste $G$.`},
        {id:"bary-homogeneity-one",label:"2.",prompt:"Obtenir une somme égale à 1.",solution:String.raw`La somme initiale étant $-7$, on divise **chaque** coefficient par $-7$ :
$$G=\operatorname{bar}\left\{\left(A,-\frac17\right),\left(B,\frac47\right),\left(C,\frac27\right),\left(D,-\frac37\right),\left(E,\frac57\right)\right\}.$$
Vérification : $(-1+4+2-3+5)/7=1$.`},
      ]}],
    },
    {id:"bary-reduction",title:"Réduire une somme vectorielle",pages:[20],legacyLessonIds:["weighted-vector-reduction"],
      body:String.raw`Si $S\ne0$ et $G$ est le barycentre du système, alors, **pour tout point $M$** :
$$\boxed{\sum_{i=1}^n\alpha_i\overrightarrow{MA_i}=S\overrightarrow{MG}.}$$
Pour le retrouver, écrire $\overrightarrow{MA_i}=\overrightarrow{MG}+\overrightarrow{GA_i}$. Les termes en $\overrightarrow{GA_i}$ s’annulent.

**Si $S=0$**, la somme vectorielle ne dépend pas de $M$. Pour calculer cette constante, on peut remplacer $M$ par l’un des points du système. Il n’y a alors pas de barycentre à introduire.`,
      examples:[{id:"bary-reduction-example",title:"Deux réductions",prompt:"Les points A, B et C sont fixés.",parts:[
        {id:"bary-reduction-nonzero",label:"1.",prompt:String.raw`Réduire $2\overrightarrow{MA}-3\overrightarrow{MB}-\overrightarrow{MC}$.`,
          solution:String.raw`La somme des coefficients vaut $2-3-1=-2\ne0$. Posons $G=\operatorname{bar}\{(A,2),(B,-3),(C,-1)\}$. Alors :
$$2\overrightarrow{MA}-3\overrightarrow{MB}-\overrightarrow{MC}=-2\overrightarrow{MG}.$$`},
        {id:"bary-reduction-zero",label:"2.",prompt:String.raw`Réduire $2\overrightarrow{MA}-3\overrightarrow{MB}+\overrightarrow{MC}$.`,
          solution:String.raw`Ici $2-3+1=0$ : la somme est constante. En prenant $M=A$, on obtient :
$$2\overrightarrow{MA}-3\overrightarrow{MB}+\overrightarrow{MC}=-3\overrightarrow{AB}+\overrightarrow{AC}.$$
On peut aussi écrire $3\overrightarrow{BA}-\overrightarrow{CA}$.`},
      ]}],
    },
    {id:"bary-coordinates",title:"Coordonnées dans le plan ou dans l’espace",pages:[20,21],legacyLessonIds:["barycenter-coordinates"],
      body:String.raw`Dans un repère, si $A_i(x_i;y_i)$ et $S\ne0$, alors :
$$\boxed{x_G=\frac{\sum_i\alpha_i x_i}{S},\qquad y_G=\frac{\sum_i\alpha_i y_i}{S}.}$$
Dans l’espace, on ajoute :
$$\boxed{z_G=\frac{\sum_i\alpha_i z_i}{S}.}$$
On utilise les **mêmes coefficients et le même dénominateur** pour chaque coordonnée. Un coefficient négatif doit conserver son signe dans tous les calculs.`,
      examples:[{id:"bary-coordinate-example",title:"Calculer G",prompt:String.raw`$A(-2;3)$, $B(1;5)$, $C(0;-7)$ et $G=\operatorname{bar}\{(A,1),(B,3),(C,-2)\}$.`,
        solution:String.raw`La somme vaut $1+3-2=2\ne0$. Ainsi :
$$x_G=\frac{1(-2)+3(1)-2(0)}2=\frac12,$$
$$y_G=\frac{1(3)+3(5)-2(-7)}2=\frac{3+15+14}2=16.$$
Donc $\boxed{G(\frac12;16)}$. Le résultat peut être extérieur au triangle : l’un des coefficients est négatif.`}],
    },
    {id:"bary-partial",title:"Regrouper des points : barycentres partiels",pages:[21],legacyLessonIds:["partial-barycenter"],
      body:String.raw`Dans un système de somme non nulle, on peut remplacer un groupe de points par :

- son barycentre $H$ ;
- affecté de la **somme des coefficients du groupe**.

La somme de ce groupe doit elle aussi être **non nulle**. Par exemple, si $a+b\ne0$ et $a+b+c\ne0$ :
$$H=\operatorname{bar}\{(A,a),(B,b)\}\ \Longrightarrow\
G=\operatorname{bar}\{(A,a),(B,b),(C,c)\}=\operatorname{bar}\{(H,a+b),(C,c)\}.$$
Cette propriété sert à construire un barycentre, ou à prouver un alignement et une concurrence.`,
      nativeFigure:{kind:"barycenter",preset:"partial"},
      examples:[{id:"bary-tetrahedron-example",title:"Isobarycentre d’un tétraèdre",prompt:"K est le milieu de [AB], L celui de [CD], et G l’isobarycentre de A, B, C, D.",
        solution:String.raw`On regroupe $(A,1),(B,1)$ en $(K,2)$, puis $(C,1),(D,1)$ en $(L,2)$. Les sommes partielles valent $2\ne0$.

Ainsi $G=\operatorname{bar}\{(K,2),(L,2)\}=\operatorname{bar}\{(K,1),(L,1)\}$.

**G est donc le milieu de [KL].**`}],
    },
    {id:"bary-affine-locus",title:"Ensemble de tous les barycentres",pages:[21],
      body:String.raw`Les coefficients parcourent ici **tous les réels**, avec une somme non nulle.

| Points fixés | Ensemble de leurs barycentres |
|---|---|
| Deux points distincts $A,B$ | La droite $(AB)$ |
| Trois points non alignés $A,B,C$ | Le plan $(ABC)$ |
| Quatre points non coplanaires | L’espace tout entier |

Pour deux points, $\overrightarrow{AG}=\frac{b}{a+b}\overrightarrow{AB}$. Ce quotient peut être n’importe quel réel.

Si les coefficients sont tous positifs, on reste dans le segment, le triangle ou le tétraèdre. **Sans cette restriction**, un barycentre peut être extérieur. La droite entière ne doit donc pas être confondue avec le segment.`,nativeFigure:{kind:"barycenter",preset:"weights"},
    },
  ],
}];
