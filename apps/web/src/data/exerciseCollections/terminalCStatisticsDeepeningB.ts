import { statisticsExercise as E,written as W,short,statQuestion as N,statisticsData as d,tableFor,meanSolution,varianceSolution,covarianceSolution,regressionSolution,correlationSolution } from "./terminalCStatisticsBuilders";
export const statisticsDeepeningB=[
  E(21,"Forfaits de soins et clientèle","Une esthéticienne propose des forfaits de dix séances. Le montant est exprimé en centaines de francs CFA. Les résultats sont demandés à deux décimales, sauf la dernière estimation.\n\n"+tableFor("21"),[
    W("1.","Représenter le nuage : intersection (20 ; 0), 1 cm pour 400 F en abscisse et 4 clients en ordonnée.",String.raw`Le tableau donne le prix en **centaines** de F : $400$ F correspondent à $4$ unités de $x$.

Avec l’intersection des axes en $(20;0)$, le point $(28;47)$ se place à $(28-20)/4=2$ cm à droite et $47/4=11{,}75$ cm vers le haut. Placer de même les neuf autres couples, sans les relier.`),
    W("2.","Déterminer le point moyen G et le placer.",meanSolution(d["21"])),
    W("3.","Calculer V(X), V(Y) et Cov(X,Y).",varianceSolution(d["21"])+"\n\n"+covarianceSolution(d["21"],false)),
    W("4.","Calculer r et l’interpréter.",correlationSolution(d["21"])+String.raw`

À deux décimales $r\approx-1{,}00$, mais la valeur non arrondie est environ $-0{,}996275$ : le nuage n’est pas parfaitement aligné.`),
    W("5.","Déterminer une équation de la droite de régression de Y en X.",regressionSolution(d["21"],"y")+String.raw`

À deux décimales : $\boxed{Y\approx-1{,}44X+87{,}35}$.`),
    short("6.","Si cette tendance se prolonge jusqu’à un forfait de 6000 F, estimer le nombre de clients. Arrondir à l’unité.","1",["1"],String.raw`Puisque $x$ est exprimé en centaines de F, $6000$ F correspond à $X=60$.

Avec les coefficients non arrondis :
$$\widehat Y=-\frac{406}{281}\times60+\frac{24545}{281}=\frac{185}{281}\approx0{,}658.$$
L’arrondi à l’unité donne $\boxed{1\text{ client}}$.

Cette estimation suppose le prolongement du modèle, en dehors des prix observés $[2800;5100]$ F. Elle n’est pas un effectif réellement garanti.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(22,"Ancienneté et primes","Les primes de sept cadres sont exprimées en euros. Donner les résultats à deux décimales lorsque nécessaire.\n\n"+tableFor("22"),[
    W("1.","Représenter le nuage : intersection (0 ; 250), 1 cm pour 2 ans en abscisse et 50 € en ordonnée.",String.raw`L’axe horizontal représente l’ancienneté ; l’axe vertical la prime. L’intersection porte la valeur $(0;250)$.

Le premier cadre, $(2;270)$, se place à $1$ cm à droite et $(270-250)/50=0{,}4$ cm vers le haut. Placer les six autres couples selon les mêmes échelles.`),
    W("2.","Calculer G et le placer.",meanSolution(d["22"])+String.raw`

À deux décimales : $\boxed{G(15{,}14;557{,}14)}$.`),
    W("3.","Justifier les valeurs V(X) ≈ 61,84 et V(Y) ≈ 32477,55.",varianceSolution(d["22"])+String.raw`

Les valeurs exactes sont $V(X)=3030/49$ et $V(Y)=1591400/49$. À deux décimales : $61{,}84$ et $32477{,}55$.`),
    N("4.a","22","r","Déterminer le coefficient de corrélation.",correlationSolution(d["22"]),2),
    W("4.b","Interpréter le coefficient.",String.raw`$r\approx0{,}997261$ : il est positif et très proche de $1$. La corrélation linéaire est forte et croissante selon le repère du chapitre.

L’arrondi $1{,}00$ à deux décimales n’autorise pas à affirmer un alignement parfait. La prime d’un autre cadre n’est pas déterminée avec certitude par son ancienneté.`),
    W("5.a","Déterminer la régression de Y en X par les moindres carrés.",regressionSolution(d["22"],"y")+String.raw`

À deux décimales : $\boxed{Y\approx22{,}85X+211{,}06}$.`),
    short("5.b","Estimer la prime en euros pour 30 ans d’ancienneté. Arrondir à deux décimales.","896,70",["896.7"],String.raw`On connaît l’ancienneté, donc on emploie $Y$ en $X$, avec les coefficients non arrondis :
$$\widehat Y=\frac{6925}{303}\times30+\frac{63950}{303}\approx\boxed{896{,}70\text{ euros}}.$$
On peut aussi calculer directement $a=6925/303$ et $b=63950/303$. L’ancienneté $30$ dépasse les $26$ ans observés : c’est une extrapolation.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(23,"Lire un nuage et construire sa régression","Le graphique représente une série statistique double.",[
    W("1.","Dresser le tableau statistique à partir du graphique.",tableFor("23")+String.raw`

Lire d’abord l’abscisse de chaque point, puis son ordonnée. Le point sur l’axe horizontal a les coordonnées $(1;0)$ ; celui d’abscisse $8$ a pour ordonnée $4{,}5$.`),
    W("2.","Déterminer les coordonnées de G.",meanSolution(d["23"])),
    W("3.","Justifier qu’à deux décimales, la droite de Y en X a pour équation y ≈ 0,59x − 0,60.",regressionSolution(d["23"],"y")+String.raw`

Les coefficients exacts sont $a=203/346$ et $b=-104/173$. D’où $\boxed{y\approx0{,}59x-0{,}60}$ à deux décimales.`),
    W("4.","Placer G et construire la droite dans le même repère.",String.raw`Placer $G(37/7;5/2)\approx(5{,}286;2{,}5)$.

Calculer un second point de la droite exacte, par exemple pour $x=1$ : $y=-5/346\approx-0{,}014$. Tracer la droite passant par ces deux points. Elle n’est pas tenue de passer par chaque observation.`),
  ],{figureKey:"tc-l10-scatter-blank",correctionFigureKey:"tc-l10-statistics"}),
  E(24,"Départs à la retraite","Dans une entreprise à effectif stable, le rang 0 correspond à 2007. Pour la question 2, donner les valeurs à deux décimales **par défaut**.\n\n"+tableFor("24"),[
    W("1.","Représenter le nuage, intersection (0 ; 50), 1 cm par unité sur chaque axe.",String.raw`Placer $(0;50)$, $(1;53)$, $(2;53)$, $(3;58)$, $(4;57)$, $(5;59)$, $(6;63)$ et $(7;64)$.

La graduation verticale commence à $50$ à l’intersection des axes. Les unités physiques sont les mêmes sur les deux axes ; le graphique respecte ce rapport.`),
    W("2.a","Déterminer G et le placer, coordonnées à deux décimales par défaut.",meanSolution(d["24"])+String.raw`

Les valeurs exactes sont $3{,}5$ et $57{,}125$. À deux décimales **par défaut**, on retient $\boxed{G(3{,}50;57{,}12)}$, et non l’arrondi au plus proche $57{,}13$.`),
    short("2.b","Calculer r et donner sa valeur à deux décimales par défaut.","0,97",["0.97"],correlationSolution(d["24"])+String.raw`

Comme $r\approx0{,}973845$, la valeur à deux décimales par défaut est $\boxed{0{,}97}$.`),
    W("2.c","Peut-on envisager un ajustement affine ? Justifier.",String.raw`Le nuage est assez allongé et $r\approx0{,}974$ est positif, proche de $1$ et supérieur au repère $0{,}87$. Un ajustement affine est donc raisonnable sur l’intervalle observé.

Une extrapolation ultérieure resterait incertaine : l’effectif stable de l’entreprise ne suffit pas à garantir que les départs suivront cette droite.`),
    W("3.","Justifier qu’une équation de la régression de Y en X est Y = (55/28)X + 50,25.",regressionSolution(d["24"],"y")+String.raw`

Exactement $a=(165/16)/(21/4)=55/28$ et $b=457/8-(55/28)(7/2)=201/4$.
$$\boxed{Y=\frac{55}{28}X+50{,}25.}$$`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
];
