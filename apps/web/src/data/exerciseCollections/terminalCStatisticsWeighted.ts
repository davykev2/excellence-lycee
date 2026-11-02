import { statisticsExercise as E,written as W,statisticsData as d,meanSolution,varianceSolution,covarianceSolution,regressionSolution,correlationSolution } from "./terminalCStatisticsBuilders";
const table=String.raw`
| Puissance $X$ (cv) \ Durée $Y$ (milliers km) | 2 | 3 | 4 | Total |
|---|---|---|---|---|
| 20 | 0 | 8 | 30 | 38 |
| 25 | 5 | 20 | 7 | 32 |
| 30 | 25 | 3 | 2 | 30 |
| Total | 30 | 31 | 39 | 100 |`;
export const statisticsWeighted=[
  E(35,"Ne pas perdre les poids d’un tableau de fréquences","Puissance de petites voitures et durée des pneus, les durées étant les centres de classes. Toutes les fréquences du tableau sont des **pourcentages**.\n"+table,[
    W("1.","Interpréter le nombre 7 du tableau.",String.raw`La case $7$ est à l’intersection de $X=25$ cv et de $Y=4$ milliers de km. Elle signifie que **7 % des voitures** appartiennent simultanément à ces deux catégories.

Ce n’est ni $7\,\%$ parmi les seules voitures de 25 cv, ni un effectif de 7 voitures sans connaître la taille de la population.`),
    W("2.a","Extraire les distributions marginales X et Y puis calculer leurs moyennes.",String.raw`
| Puissance X | 20 | 25 | 30 |
|---|---|---|---|
| Fréquence | 38 % | 32 % | 30 % |

| Durée Y | 2 | 3 | 4 |
|---|---|---|---|
| Fréquence | 30 % | 31 % | 39 % |

Les pourcentages totalisent $100$. Les moyennes pondérées sont :
$$\bar x=\frac{20\times38+25\times32+30\times30}{100}=\boxed{24{,}6\text{ cv}},$$
$$\bar y=\frac{2\times30+3\times31+4\times39}{100}=\boxed{3{,}09}.$$
La durée moyenne estimée à partir des centres de classes vaut $3090$ km.`),
    W("2.b","Représenter les neuf couples possibles (xᵢ,yⱼ) sans tenir compte de leurs poids.",String.raw`Former les neuf couples du produit cartésien $\{20;25;30\}\times\{2;3;4\}$ et les placer.

Ils forment une grille de trois colonnes et trois lignes. Le couple $(20;2)$ a une fréquence nulle : ce n’est pas une observation présente dans le tableau. Il est dessiné par un cercle vide dans la vue pondérée.

La représentation des neuf couples **avec le même poids**, demandée ici, ne décrit donc pas correctement la répartition des voitures.`),
    W("2.c","Tracer une droite proche des neuf couples non pondérés et déterminer une équation.",String.raw`Si l’on donne réellement le même poids aux neuf couples possibles, leur point moyen est $(25;3)$ et leur covariance vaut $0$ : chaque abscisse est associée aux trois ordonnées de manière identique.

La droite horizontale $\boxed{Y=3}$ est alors l’ajustement des moindres carrés de ces neuf couples non pondérés. Une droite tracée à l’œil n’est pas unique ; ce choix a un critère précis.

Elle n’est **pas** la régression de la distribution pondérée des voitures, qui doit utiliser les pourcentages.`),
    W("3.a","Donner le point moyen de la distribution pondérée.",meanSolution(d["35"])+String.raw`

L’effectif de calcul $100$ représente ici $100\,\%$, pas nécessairement cent voitures réellement interrogées. Le point moyen pondéré est $\boxed{G(24{,}6;3{,}09)}$.`),
    W("3.b","Calculer V(X) et V(Y) avec les fréquences.",varianceSolution(d["35"])+String.raw`

Les moyennes des carrés sont $62200/100=622$ et $1023/100=10{,}23$.
Donc $V(X)=622-24{,}6^2=\boxed{16{,}84}$ et $V(Y)=10{,}23-3{,}09^2=\boxed{0{,}6819}$.`),
    W("3.c","Calculer la covariance pondérée.",covarianceSolution(d["35"])+String.raw`

La somme pondérée des produits est $7340$. Ainsi :
$$\operatorname{Cov}(X,Y)=7340/100-24{,}6\times3{,}09=\boxed{-2{,}614}.$$`),
    W("3.d","Déterminer la régression de Y en X.",regressionSolution(d["35"],"y")),
    W("3.e","Déterminer la régression de X en Y.",regressionSolution(d["35"],"x")),
    W("4.","Calculer le coefficient de corrélation et l’interpréter.",correlationSolution(d["35"])+String.raw`

La distribution pondérée donne $r\approx-0{,}771390$, très différent du $r=0$ de la grille non pondérée. **Oublier les fréquences change la série étudiée et donc la conclusion.**`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
];
