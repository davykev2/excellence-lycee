import type { CourseDocumentSection } from "../../domain/courseDocument";
import { tableFor,meanSolution,varianceSolution,covarianceSolution } from "./statisticsWriting";
import { statisticsData } from "../../features/mathematics/statisticsModels";
export const statisticsSummaryB:CourseDocumentSection[]=[
  {id:"stats-regression-section",numeral:"VI",title:"Ajustement affine",topics:[
    {id:"stats-adjustment",title:"Choisir un modèle, puis la variable à estimer",pages:[250],legacyLessonIds:["statistical-estimation"],
      body:String.raw`Lorsque le nuage est suffisamment allongé autour d’une droite, on peut chercher un **ajustement affine**. La droite approche les points ; elle ne passe pas forcément par chacun d’eux.

Avant tout calcul, pose la question : « Quelle variable est connue ? Quelle variable veut-on estimer ? »

- Pour estimer $Y$ à partir de $X$, on utilise la droite de **$Y$ en $X$**.
- Pour estimer $X$ à partir de $Y$, on calcule la droite de **$X$ en $Y$**.

Une estimation à l’intérieur des valeurs observées est une interpolation. Au-delà, c’est une **extrapolation** : le modèle peut cesser de décrire la situation. Un résultat prédit n’est jamais une garantie.`,
    },
    {id:"stats-regressions",title:"Les deux droites des moindres carrés",pages:[250,251],legacyLessonIds:["regression-lines"],
      body:String.raw`Rappelons les variances :
$$V(X)=\frac1n\sum x_i^2-\bar x^2,\qquad V(Y)=\frac1n\sum y_i^2-\bar y^2.$$
La droite $(D)$ de régression de $Y$ en $X$ minimise la somme des **carrés des écarts verticaux** entre les points et la droite. Si $V(X)>0$ :
$$\boxed{Y=aX+b,\quad a=\frac{\operatorname{Cov}(X,Y)}{V(X)},\quad b=\bar y-a\bar x.}$$
La droite $(D')$ de régression de $X$ en $Y$ minimise les carrés des **écarts horizontaux**. Si $V(Y)>0$ :
$$\boxed{X=a'Y+b',\quad a'=\frac{\operatorname{Cov}(X,Y)}{V(Y)},\quad b'=\bar x-a'\bar y.}$$
Les deux droites passent par le point moyen $G(\bar x;\bar y)$.

**Attention :** on ne trouve pas la droite de $X$ en $Y$ en isolant simplement $X$ dans l’équation de $Y$ en $X$. Les deux ajustements ne minimisent pas les mêmes écarts. Si une variance est nulle, la formule correspondante ne s’applique pas.`,
      examples:[{id:"stats-regression-example",title:"Un même tableau, deux ajustements",prompt:"Déterminer les deux droites de régression.",parts:[
        {id:"stats-regression-means",label:"1.",prompt:"Calculer les moyennes.",solution:tableFor("regression")+"\n\n"+meanSolution(statisticsData.regression)},
        {id:"stats-regression-parameters",label:"2.",prompt:"Calculer les variances et la covariance.",solution:varianceSolution(statisticsData.regression)+"\n\n"+covarianceSolution(statisticsData.regression,false)+String.raw`

Les valeurs exactes utiles sont $V(X)=17/3$ et :
$$V(Y)=\frac{2358125}{6}-\left(\frac{3465}{6}\right)^2=\frac{714175}{12}.$$
Et $\operatorname{Cov}(X,Y)=3475/6$.`},
        {id:"stats-regression-y",label:"3.",prompt:"Déterminer la droite de Y en X.",solution:String.raw`
$$a=\frac{3475/6}{17/3}=\frac{3475}{34}.$$
$$b=\frac{1155}{2}-\frac{3475}{34}\times7=-\frac{2345}{17}.$$
Ainsi :
$$\boxed{Y=\frac{3475}{34}X-\frac{2345}{17}.}$$
En remplaçant $X$ par $7$, on retrouve $Y=577{,}5$ : la droite passe bien par $G$.`},
        {id:"stats-regression-x",label:"4.",prompt:"Déterminer la droite de X en Y.",solution:String.raw`
$$a'=\frac{3475/6}{714175/12}=\frac{278}{28567}.$$
$$b'=7-\frac{278}{28567}\times\frac{1155}{2}=\frac{39424}{28567}.$$
D’où :
$$\boxed{X=\frac{278}{28567}Y+\frac{39424}{28567}.}$$
On retrouve $X=7$ lorsque $Y=577{,}5$. La pente $a'$ n’est pas l’inverse de $a$.`},
      ],nativeFigure:{kind:"statistics",preset:"regression"}}],
      nativeFigure:{kind:"statistics",preset:"residuals"},
    },
  ]},
  {id:"stats-correlation-section",numeral:"VII",title:"Coefficient de corrélation linéaire",topics:[
    {id:"stats-correlation",title:"Calculer r et interpréter son signe et sa valeur",pages:[252],legacyLessonIds:["correlation"],
      body:String.raw`Si $V(X)>0$ et $V(Y)>0$, le coefficient de corrélation linéaire est :
$$\boxed{r=\frac{\operatorname{Cov}(X,Y)}{\sqrt{V(X)V(Y)}}.}$$
On a toujours $-1\le r\le1$ et, pour les coefficients des deux régressions, $aa'=r^2$.

- $r>0$ : tendance linéaire croissante.
- $r<0$ : tendance linéaire décroissante.
- $|r|=1$ : tous les points sont exactement alignés sur une droite non verticale et non horizontale.
- $|r|$ proche de $1$ : les points sont proches d’une droite.

Le support retient $|r|\ge0{,}87$ comme **repère de forte corrélation** : $r\ge0{,}87$ ou $r\le-0{,}87$. Ce seuil est un repère du chapitre, pas une règle universelle.

Une corrélation proche de zéro signifie qu’il y a peu de lien **linéaire**, mais ne prouve ni indépendance ni absence de relation. Une forte corrélation ne prouve pas une causalité.

Garde suffisamment de décimales : une valeur arrondie à $1{,}00$ n’implique pas que $r=1$ exactement.`,
      examples:[{id:"stats-correlation-example",title:"Ne pas arrondir trop tôt",prompt:String.raw`On donne $\operatorname{Cov}(X,Y)=21{,}5$, $V(X)=11{,}6$ et $V(Y)=40{,}2$.`,
        solution:String.raw`Les deux variances sont positives, donc :
$$r=\frac{21{,}5}{\sqrt{11{,}6\times40{,}2}}\approx0{,}9956.$$
Le coefficient est positif et très proche de $1$ : la corrélation linéaire est forte et croissante.

Il n’est cependant pas exactement égal à $1$. On ne peut donc pas affirmer un alignement parfait à partir d’un arrondi à deux décimales.`}],
      nativeFigure:{kind:"statistics",preset:"correlation"},
    },
  ]},
];
