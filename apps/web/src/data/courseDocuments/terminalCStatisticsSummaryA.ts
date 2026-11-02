import type { CourseDocumentSection } from "../../domain/courseDocument";
import { tableFor, meanSolution, covarianceSolution } from "./statisticsWriting";
import { statisticsData } from "../../features/mathematics/statisticsModels";
export const statisticsSummaryA: CourseDocumentSection[] = [
  {id:"stats-series-section",numeral:"I",title:"Série statistique double",topics:[
    {id:"stats-series",title:"Deux caractères observés sur les mêmes individus",pages:[248],
      body:String.raw`Une population contient $n$ individus. Sur chacun, on observe deux caractères $X$ et $Y$. L’individu de rang $i$ fournit le couple $(x_i;y_i)$.

L’ensemble des $n$ couples constitue une **série statistique double**. Pour les calculs de ce chapitre, les deux caractères sont quantitatifs. Les deux nombres d’une colonne doivent toujours concerner **le même individu**.

Un tableau « valeurs / effectifs » d’un seul caractère n’est pas, à lui seul, une série double.`,
      examples:[{id:"stats-workers-example",title:"Cinq employés",prompt:"On relève les heures de travail et le salaire de LIAM, AMINE, YVAN, YANIS et ALVINE, dans cet ordre.",
        solution:tableFor("salary")+String.raw`

La population est l’ensemble des **cinq employés**. Le premier caractère est le nombre d’heures de travail ; le second est le salaire, en francs CFA.

Par exemple, YVAN fournit le couple $(145;217000)$. Les cinq colonnes donnent cinq couples, et non dix observations indépendantes.`}],
    },
  ]},
  {id:"stats-marginal-section",numeral:"II",title:"Fréquences marginales",topics:[
    {id:"stats-marginals",title:"Retrouver la distribution de chaque caractère",pages:[248],
      body:String.raw`Dans un tableau à double entrée, une case contient l’effectif $n_{ij}$ des individus qui possèdent **à la fois** les deux valeurs correspondantes.

Pour retrouver la série de $X$, on additionne les effectifs dans chaque colonne de $X$. Pour celle de $Y$, on additionne les effectifs dans chaque ligne de $Y$.

La fréquence marginale d’une valeur est :
$$\boxed{\text{fréquence}=\frac{\text{effectif marginal}}{\text{effectif total}}.}$$
Pour un pourcentage, on multiplie cette fréquence par $100$. Le dénominateur reste l’effectif **total de la population**, pas celui d’une seule ligne.`,
      examples:[{id:"stats-marginal-example",title:"Un tableau de 30 observations",prompt:"Déterminer les deux distributions marginales.",parts:[
        {id:"stats-marginal-data",label:"1.",prompt:"Additionner les effectifs.",solution:String.raw`
| $Y\backslash X$ | $4$ | $9$ | $14$ | $19$ | Total |
|---|---|---|---|---|---|
| $1$ | 2 | 5 | 3 | 2 | **12** |
| $7$ | 1 | 2 | 2 | 1 | **6** |
| $13$ | 4 | 6 | 1 | 1 | **12** |
| **Total** | **7** | **13** | **6** | **4** | **30** |

Ainsi $N=12+6+12=30$. On retrouve aussi $7+13+6+4=30$.`},
        {id:"stats-marginal-x",label:"2.",prompt:"Calculer les fréquences marginales de X.",solution:String.raw`
| $X$ | $4$ | $9$ | $14$ | $19$ |
|---|---|---|---|---|
| Effectif | 7 | 13 | 6 | 4 |
| Fréquence | $7/30$ | $13/30$ | $1/5$ | $2/15$ |
| Pourcentage arrondi | 23,33 % | 43,33 % | 20 % | 13,33 % |

Par exemple $100\times7/30\approx23{,}33$. Les fréquences exactes s’additionnent à $1$ ; les pourcentages arrondis séparément peuvent totaliser $99{,}99\,\%$.`},
        {id:"stats-marginal-y",label:"3.",prompt:"Calculer les fréquences marginales de Y.",solution:String.raw`
| $Y$ | $1$ | $7$ | $13$ |
|---|---|---|---|
| Effectif | 12 | 6 | 12 |
| Fréquence | $2/5$ | $1/5$ | $2/5$ |
| Pourcentage | 40 % | 20 % | 40 % |

On a bien $40+20+40=100$.`},
      ]}],
    },
  ]},
  {id:"stats-scatter-section",numeral:"III",title:"Nuage de points",topics:[
    {id:"stats-scatter",title:"Représenter les couples dans un repère",pages:[248,249],legacyLessonIds:["scatter-plot"],
      body:String.raw`Dans un repère orthogonal, à chaque couple $(x_i;y_i)$ on associe le point $M_i(x_i;y_i)$. L’ensemble de ces points est le **nuage de points** de la série.

On choisit une échelle adaptée sur chaque axe, on nomme les axes et leurs unités, puis on place chaque couple. **On ne relie pas les points dans l’ordre du tableau.**

Si plusieurs individus ont le même couple, ils sont représentés au même endroit. Un effectif peut être indiqué à côté du point ou par sa taille.`,
      examples:[{id:"stats-advertising-example",title:"Budget publicitaire et ventes",prompt:"Les deux montants sont exprimés en millions de francs CFA.",
        solution:tableFor("advertising")+String.raw`

Le premier point est $(2;50)$, le deuxième $(4;70)$, puis $(5;80)$, $(6;100)$, $(8;110)$, $(9;120)$ et $(10;150)$.

L’axe horizontal représente le budget publicitaire ; l’axe vertical représente les ventes. Le nuage présente ici une tendance croissante, sans suffire à prouver un lien de cause à effet.`,
        nativeFigure:{kind:"statistics",preset:"advertising"}}],
    },
  ]},
  {id:"stats-mean-section",numeral:"IV",title:"Point moyen",topics:[
    {id:"stats-mean",title:"Les moyennes donnent les coordonnées de G",pages:[249],legacyLessonIds:["mean-point"],
      body:String.raw`Le **point moyen** du nuage est $G(\bar x;\bar y)$, où :
$$\boxed{\bar x=\frac{x_1+\cdots+x_n}{n},\qquad \bar y=\frac{y_1+\cdots+y_n}{n}.}$$
On ne mélange pas les deux lignes du tableau. Avec des effectifs, on calcule chaque moyenne en utilisant la distribution marginale correspondante :
$$\bar x=\frac{\sum_j n_{\cdot j}x_j}{N},\qquad \bar y=\frac{\sum_i n_{i\cdot}y_i}{N}.$$
Le point moyen peut ne pas être un point observé.`,
      examples:[{id:"stats-mean-example",title:"Quatre couples",prompt:"Déterminer le point moyen.",
        solution:tableFor("mean")+"\n\n"+meanSolution(statisticsData.mean),nativeFigure:{kind:"statistics",preset:"mean"}}],
    },
  ]},
  {id:"stats-covariance-section",numeral:"V",title:"Covariance",topics:[
    {id:"stats-covariance",title:"Mesurer les variations conjointes",pages:[249,250],legacyLessonIds:["covariance"],
      body:String.raw`La covariance d’une série de $n$ couples est :
$$\boxed{\operatorname{Cov}(X,Y)=\frac1n\sum_{i=1}^{n}(x_i-\bar x)(y_i-\bar y).}$$
Un produit est positif lorsque les deux valeurs sont du même côté de leur moyenne ; il est négatif lorsqu’elles sont de côtés opposés.

Pour calculer plus rapidement, on utilise :
$$\boxed{\operatorname{Cov}(X,Y)=\frac1n\sum_{i=1}^{n}x_iy_i-\bar x\bar y.}$$
On a $\operatorname{Cov}(X,Y)=\operatorname{Cov}(Y,X)$.

Un signe positif correspond à une tendance linéaire croissante ; un signe négatif à une tendance décroissante. Une covariance nulle n’exclut pas un lien non linéaire. Sa valeur dépend des unités.

Avec un tableau d’effectifs, remplacer $\sum x_iy_i$ par $\sum_{i,j}n_{ij}x_jy_i$ et diviser par l’effectif total $N$.`,
      examples:[{id:"stats-height-example",title:"Âge et taille de quatre enfants",prompt:"Calculer la covariance.",parts:[
        {id:"stats-height-mean",label:"1.",prompt:"Calculer les deux moyennes.",solution:tableFor("height")+"\n\n"+meanSolution(statisticsData.height)},
        {id:"stats-height-cov",label:"2.",prompt:"Calculer la covariance.",solution:covarianceSolution(statisticsData.height,false)+String.raw`

En valeurs exactes : $940/4-2{,}5\times89{,}25=\boxed{11{,}875}$.`},
      ]}],
      detail:String.raw`En développant $(x_i-\bar x)(y_i-\bar y)$ puis en sommant, on obtient :
$$\frac1n\sum x_iy_i-\bar y\frac1n\sum x_i-\bar x\frac1n\sum y_i+\bar x\bar y.$$
Or $\sum x_i/n=\bar x$ et $\sum y_i/n=\bar y$. Les trois derniers termes se réduisent à $-\bar x\bar y$, d’où la formule de calcul.`,
    },
  ]},
];
