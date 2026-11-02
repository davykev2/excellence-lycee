import { section, sheet } from "./types";

export default sheet("statistics", "Statistique à deux variables", [165], [
  section("essential-statistics-cloud", "I", "Nuage de points et point moyen", [165], String.raw`
Une série à deux caractères associe des couples $(x_i;y_i)$. Son nuage est l’ensemble des points $M_i(x_i;y_i)$ dans un repère orthogonal.

Pour $N$ couples de même poids, le **point moyen** est $G(\overline x;\overline y)$, avec

$$\overline x=\frac1N\sum_{i=1}^N x_i,\qquad
\overline y=\frac1N\sum_{i=1}^N y_i.$$

Si un couple se répète avec un effectif $n_i$, utiliser les moyennes pondérées et $N=\sum n_i$.
`),
  section("essential-statistics-covariance", "II", "Variance et covariance", [165], String.raw`
Pour des couples pondérés $(x_i;y_i)$ d’effectifs $n_i$ et d’effectif total $N$ :

$$\operatorname{Cov}(X,Y)=\frac1N\sum_i n_i(x_i-\overline x)(y_i-\overline y).$$

La formule développée facilite les calculs :

$$\operatorname{Cov}(X,Y)=\frac1N\sum_i n_ix_iy_i-\overline x\,\overline y.$$

De même,

$$V(X)=\frac1N\sum_i n_ix_i^2-\overline x^2,\qquad
V(Y)=\frac1N\sum_i n_iy_i^2-\overline y^2.$$

Si tous les couples ont le même poids, prendre $n_i=1$. Dans un tableau à double entrée, sommer avec les effectifs $n_{ij}$ correspondants.
`),
  section("essential-statistics-regression", "III", "Les deux droites de régression", [165], String.raw`
**Régression de $Y$ en $X$**, si $V(X)>0$ :

$$y=ax+b,\qquad
a=\frac{\operatorname{Cov}(X,Y)}{V(X)},\qquad
b=\overline y-a\overline x.$$

Elle sert à estimer $Y$ connaissant $X$.

**Régression de $X$ en $Y$**, si $V(Y)>0$ :

$$x=a'y+b',\qquad
a'=\frac{\operatorname{Cov}(X,Y)}{V(Y)},\qquad
b'=\overline x-a'\overline y.$$

Elle sert à estimer $X$ connaissant $Y$. En général, ce n’est pas la droite précédente simplement réécrite.

Les deux droites passent par $G(\overline x;\overline y)$. Pour les tracer, utiliser $G$ et un second point satisfaisant leur équation.
`),
  section("essential-statistics-correlation", "IV", "Corrélation et estimation", [165], String.raw`
Si $V(X)>0$ et $V(Y)>0$, le coefficient de corrélation linéaire est

$$r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)V(Y)}},\qquad -1\le r\le1.$$

- Le signe de $r$ indique le sens de la liaison linéaire.
- Plus $\lvert r\rvert$ est proche de $1$, plus les points sont proches d’une droite.
- $\lvert r\rvert=1$ correspond à une liaison linéaire parfaite, croissante si $r=1$, décroissante si $r=-1$.
- Le repère $0{,}87\le\lvert r\rvert\le1$ peut servir à qualifier une liaison forte dans un exercice ; ce seuil n’est pas une règle universelle.

Pour une estimation, choisir la droite correspondant à la variable à prévoir, remplacer la valeur connue, puis indiquer l’unité et un arrondi adapté. Une extrapolation hors des valeurs observées reste incertaine.

Une forte corrélation ne prouve pas une relation de cause à effet.
`),
], [
  "P165 : effectifs pondérés cohérents ; b'=xbar−a' ybar, et non xbar−a ybar.",
  "Corrélation parfaite aussi pour r=−1 ; seuil0,87 conservé comme repère contextuel, pas définition générale.",
]);
