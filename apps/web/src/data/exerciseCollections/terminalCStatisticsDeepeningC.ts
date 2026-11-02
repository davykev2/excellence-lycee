import { statisticsExercise as E,written as W,short,statQuestion as N,statisticsData as d,tableFor,meanSolution,varianceSolution,covarianceSolution,regressionSolution,correlationSolution } from "./terminalCStatisticsBuilders";
export const statisticsDeepeningC=[
  E(25,"Âge et tension systolique",String.raw`On mesure l’âge, la tension artérielle systolique (TAS) et la tension diastolique (TAD) de six personnes.
| Âge (ans) | 26 | 39 | 40 | 50 | 53 | 56 |
|---|---|---|---|---|---|---|
| TAS (mm Hg) | 128 | 126 | 118 | 136 | 142 | 145 |
| TAD (mm Hg) | 80 | 83 | 92 | 91 | 87 | 93 |

Dans les questions suivantes, $X$ est l’âge et $Y$ est la **TAS**, non la TAD.`,[
    W("1.","Déterminer les coordonnées de G.",meanSolution(d["25"])),
    W("2.","Déterminer r et interpréter le résultat.",correlationSolution(d["25"])+String.raw`

On utilise seulement les lignes âge et TAS. $r\approx0{,}742$ n’indique pas une forte corrélation linéaire selon le repère du chapitre. Ces six mesures ne constituent ni un diagnostic ni un modèle médical individuel.`),
  ]),
  E(26,"Comparer les deux régressions",tableFor("26"),[
    N("1.","26","covariance","Déterminer la covariance.",covarianceSolution(d["26"])),
    W("2.","Déterminer r et l’interpréter.",correlationSolution(d["26"])),
    W("3.","Déterminer la droite de Y en X par les moindres carrés.",regressionSolution(d["26"],"y")+String.raw`

Les valeurs donnent exactement $\boxed{Y=-18{,}85X+135{,}4}$.`),
    W("4.","Déterminer la droite de X en Y.",regressionSolution(d["26"],"x")+String.raw`

La forme exacte est $\boxed{X=-\frac{377}{7710}Y+\frac{1782}{257}}$. Elle n’est pas l’équation précédente simplement inversée.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(27,"Personnel nécessaire pour une plantation","Un recensement de huit exploitations d’hévéa doit aider à estimer le nombre de travailleurs pour 16 ha. X désigne le nombre de travailleurs et Y la superficie.\n\n"+tableFor("27")+"\n\nPour les questions 2 à 5, arrondir les résultats à deux décimales.",[
    W("1.","Représenter le nuage : 1 cm pour un travailleur et 1 cm pour un hectare.",String.raw`Les huit points sont $(2;3)$, $(4;5)$, $(4;6)$, $(5;7)$, $(7;10)$, $(7;11)$, $(8;8)$ et $(8;12)$.

Les abscisses répétées ne signifient pas qu’il faut supprimer des points : les exploitations sont distinctes. Le repère respecte des échelles de même longueur pour une unité de chaque axe.`),
    W("2.","Justifier que G a pour coordonnées (5,63 ; 7,75) à deux décimales.",meanSolution(d["27"])+String.raw`

$\bar x=45/8=5{,}625$ s’arrondit à $5{,}63$ ; $\bar y=62/8=7{,}75$ est exact.`),
    W("3.","Justifier V(X) ≈ 4,23 et Cov(X,Y) ≈ 5,41.",varianceSolution(d["27"])+"\n\n"+covarianceSolution(d["27"],false)+String.raw`

Les valeurs exactes sont $V(X)=271/64$ et $\operatorname{Cov}(X,Y)=173/32$. À deux décimales, elles valent $4{,}23$ et $5{,}41$.`),
    N("4.a","27","r","Calculer le coefficient de corrélation.",correlationSolution(d["27"]),2),
    W("4.b","Interpréter le coefficient.",String.raw`$r\approx0{,}904471$ : la tendance est croissante et la corrélation linéaire forte selon le repère du chapitre. Un ajustement affine peut servir à une estimation prudente, sans prévoir exactement le personnel de chaque exploitation.`),
    W("5.a","Déterminer la droite d’ajustement de X en Y par les moindres carrés.",regressionSolution(d["27"],"x")+String.raw`

Ici on souhaite estimer les **travailleurs X à partir de la superficie Y**. Les coefficients exacts sont :
$$a'=\frac{173}{270},\qquad b'=\frac{89}{135}.$$
D’où $\boxed{X=\frac{173}{270}Y+\frac{89}{135}}$.`),
    W("5.b","Tracer cette droite sur le graphique.",String.raw`Utiliser $G(5{,}625;7{,}75)$, puis par exemple $Y=3$ :
$$X=(173/270)\times3+89/135\approx2{,}581.$$
Dans le repère où $X$ est horizontal, placer le point $(2{,}581;3)$ et tracer sa droite avec $G$. L’ordre des coordonnées reste toujours $(X;Y)$.`),
    short("6.","Estimer le nombre de travailleurs pour 16 ha. Donner l’arrondi à l’unité.","11",["11"],String.raw`La superficie connue est $Y=16$. On emploie la droite de **X en Y** :
$$\widehat X=\frac{173}{270}\times16+\frac{89}{135}=\frac{491}{45}\approx10{,}911.$$
À l’unité, l’estimation est $\boxed{11\text{ travailleurs}}$.

Les exploitations observées vont jusqu’à $12$ ha. Cette extrapolation ne remplace pas une étude réelle des besoins de l’exploitation.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(28,"Âges et salaires de cinq employés",tableFor("28"),[
    W("1.a","Représenter le nuage.",String.raw`Placer $(25;600)$, $(30;750)$, $(35;820)$, $(40;1075)$ et $(50;910)$, avec l’âge horizontalement et le salaire, en milliers de F CFA, verticalement. Ne pas trier séparément les salaires et les âges.`),
    W("1.b","Déterminer G puis le placer.",meanSolution(d["28"])),
    N("2.","28","covariance","Déterminer la covariance.",covarianceSolution(d["28"])),
    W("3.","Calculer r et interpréter.",correlationSolution(d["28"])),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(29,"Écarts-types et prévision",tableFor("29"),[
    W("1.","Représenter le nuage dans un repère orthogonal.",String.raw`Placer les cinq couples $(8{,}1;9{,}7)$, $(11;12{,}8)$, $(14{,}4;18{,}5)$, $(15{,}2;22{,}8)$ et $(21{,}5;31{,}5)$. Nommer les axes $x$ et $y$ et choisir des graduations adaptées.`),
    W("2.","Déterminer les moyennes et les écarts-types des deux caractères.",varianceSolution(d["29"])),
    W("3.","Déterminer la régression de Y en X puis la construire.",regressionSolution(d["29"],"y")+String.raw`

Pour la construction, utiliser $G(14{,}04;19{,}06)$ et un second point calculé sur la droite, par exemple $(11;13{,}929)$ environ. Les points observés ne sont pas à relier entre eux.`),
    short("4.","Estimer y pour x = 23,2. Arrondir à trois décimales.","34,520",["34.52"],String.raw`Avec $a\approx1{,}687797584$ et $b\approx-4{,}636678078$ non arrondis :
$$\widehat y=a\times23{,}2+b\approx\boxed{34{,}520}.$$
La valeur $23{,}2$ dépasse la plus grande abscisse observée $21{,}5$ : c’est une extrapolation.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
];
