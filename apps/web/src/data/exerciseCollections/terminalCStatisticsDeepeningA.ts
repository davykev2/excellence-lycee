import { statisticsExercise as E,written as W,short,statQuestion as N,statisticsData as d,tableFor,meanSolution,varianceSolution,regressionSolution,correlationSolution } from "./terminalCStatisticsBuilders";
export const statisticsDeepeningA=[
  E(15,"Reconstituer un chiffre d’affaires",String.raw`De 2017 à 2021 :
| Année | 2017 | 2018 | 2019 | 2020 | 2021 |
|---|---|---|---|---|---|
| Rang $x$ | 0 | 1 | 2 | 3 | 4 |
| Chiffre d’affaires $y$ (millions F) | 504 | 580 | 644 | $\alpha$ | 735 |

Une équation de la régression de $Y$ en $X$ est $Y=57{,}3X+516{,}2$.`,[
    W("1.","Calculer les coordonnées de G.",String.raw`$\bar x=(0+1+2+3+4)/5=2$. La droite de régression passe par $G$, donc :
$$\bar y=57{,}3\times2+516{,}2=630{,}8.$$
Ainsi $\boxed{G(2;630{,}8)}$.`),
    short("2.","En déduire α.","691",["691"],String.raw`La moyenne des cinq chiffres d’affaires vaut $630{,}8$ :
$$\frac{504+580+644+\alpha+735}{5}=630{,}8.$$
$$2463+\alpha=3154,\qquad\boxed{\alpha=691}.$$
Il s’agit de $691$ millions de francs CFA.`),
    short("3.","Selon ce modèle, en quelle année le chiffre d’affaires atteindrait-il 1 milliard 433 millions de F CFA ?","2033",["2033"],String.raw`Convertissons le montant : $1$ milliard $433$ millions vaut $1433$ millions.
$$57{,}3x+516{,}2=1433,$$
$$x=\frac{1433-516{,}2}{57{,}3}=16.$$
Le rang $0$ correspond à 2017, donc le rang $16$ à $\boxed{2033}$.

C’est une extrapolation lointaine des données 2017–2021, pas une garantie d’évolution de l’entreprise.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(16,"Notes manquantes à une audition",String.raw`Quatre candidats obtiennent les notes suivantes sur 20 :
| Musique $x$ | $\alpha$ | 6 | 12 | 18 |
|---|---|---|---|---|
| Dessin $y$ | 4 | 8 | 10 | $\beta$ |

On sait que $\bar x=10$ et $\bar y=9$.`,[
    short("2.α","Déterminer α.","4",["4"],String.raw`
$$\frac{\alpha+6+12+18}{4}=10\quad\Longrightarrow\quad \alpha+36=40.$$
Donc $\boxed{\alpha=4}$.`),
    short("2.β","Déterminer β.","14",["14"],String.raw`
$$\frac{4+8+10+\beta}{4}=9\quad\Longrightarrow\quad22+\beta=36.$$
Ainsi $\boxed{\beta=14}$. Les deux notes appartiennent bien à $[0;20]$.`),
    W("2. suite","Calculer le coefficient de corrélation et l’interpréter.",correlationSolution(d["16"])),
    W("3.","Déterminer la droite de régression de Y en X.",regressionSolution(d["16"],"y")+String.raw`

En valeurs exactes, $\boxed{Y=\frac{19}{30}X+\frac83}$.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(17,"Masse et taille de nouveau-nés","Dix observations relevées par une sage-femme :\n\n"+tableFor("17"),[
    W("1.","Représenter le nuage (M,T) dans un repère orthogonal.",String.raw`Placer les dix couples en prenant la masse en abscisse et la taille en ordonnée. Notamment, le quatrième couple est $(3;80)$ ; il doit être représenté tel qu’il est donné.

Ce point est très éloigné du reste du nuage. On ne le supprime ni ne le remplace sans vérification des mesures.`),
    N("2.a","17","meanX","Calculer la masse moyenne en kg.",meanSolution(d["17"])),
    N("2.b","17","meanY","Calculer la taille moyenne en cm.",meanSolution(d["17"])),
    W("3.","Déterminer une droite d’ajustement par la méthode de Mayer.",String.raw`Les masses sont ordonnées. Séparons les observations en deux groupes de cinq.

Premier groupe : sommes $13{,}9$ kg et $271$ cm, donc $G_1(2{,}78;54{,}2)$.

Second groupe : sommes $18{,}2$ kg et $270$ cm, donc $G_2(3{,}64;54)$.

La droite de Mayer est celle qui passe par ces deux points :
$$a_M=\frac{54-54{,}2}{3{,}64-2{,}78}=-\frac{10}{43}.$$
$$b_M=54{,}2-a_M\times2{,}78=\frac{11792}{215}.$$
Ainsi $\boxed{T=-\frac{10}{43}M+\frac{11792}{215}}$. Cette méthode ne minimise pas les mêmes écarts que les moindres carrés ; le point $(3;80)$ influence fortement son résultat.`),
    W("4.a","Calculer r et interpréter le résultat.",correlationSolution(d["17"])+String.raw`

Ici $r\approx0{,}232$. Une relation linéaire décrit mal ce petit échantillon. Les valeurs atypiques doivent être vérifiées avant toute interprétation réelle.`),
    W("4.b","Déterminer la droite de Y en X par les moindres carrés.",regressionSolution(d["17"],"y")),
    short("5.a","Avec le modèle de 4.b, estimer la taille en cm pour une masse de 4,7 kg. Arrondir à trois décimales.","60,466",["60.466"],String.raw`Le modèle de 4.b est
$$T=\frac{10890}{2549}M+\frac{102944}{2549}.$$
Pour $M=4{,}7$ :
$$\widehat T\approx4{,}272263633\times4{,}7+40{,}386033739\approx\boxed{60{,}466\text{ cm}}.$$
C’est une extrapolation, car la masse maximale observée est $4$ kg. Le faible coefficient $r$ rend cette estimation peu fiable.`),
    short("5.b","Avec la même équation, à quelle masse en kg correspondrait une taille de 60 cm ? Arrondir à trois décimales.","4,591",["4.591"],String.raw`On résout l’équation du modèle demandé, sans la confondre avec une nouvelle régression de $M$ en $T$ :
$$60=aM+b,\qquad M=\frac{60-b}{a}\approx\boxed{4{,}591\text{ kg}}.$$
Les coefficients $a,b$ de 4.b sont conservés non arrondis. Ce résultat reste une extrapolation très incertaine, et non une estimation clinique.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(18,"Prix et ventes de colliers","Après six mois, une entrepreneuse compare quatre modèles : AMOUR, PAIX, UNION et COHÉSION, dans cet ordre.\n\n"+tableFor("18"),[
    W("1.","Représenter le nuage : intersection des axes (1900 ; 160), 1 cm pour 100 F en abscisse et 10 exemplaires en ordonnée.",String.raw`Placer $(2500;200)$, $(1900;240)$, $(2300;220)$ et $(3000;160)$.

À partir de l’intersection $(1900;160)$, le premier point est à $6$ cm vers la droite et $4$ cm vers le haut. L’intersection des axes est décalée : il ne faut pas la renommer $(0;0)$ dans les valeurs du tableau.`),
    W("2.","Déterminer G et le placer sur la figure.",meanSolution(d["18"])),
    W("3.a","Déterminer Y en X par les moindres carrés, coefficients à trois décimales.",regressionSolution(d["18"],"y")+String.raw`

À trois décimales : $\boxed{Y\approx-0{,}074X+384{,}701}$. Pour une estimation, conserver plutôt $a=-93/1255$ et $b=96560/251$.`),
    W("3.b","Tracer la droite D.",String.raw`La droite passe par $G(2425;205)$. Un second point se calcule avec l’équation non arrondie, par exemple pour $X=1900$ : $Y\approx243{,}904$.

Placer ces deux points puis tracer leur droite. Elle ne doit pas être confondue avec une ligne reliant successivement les quatre observations.`),
    W("4.","Calculer et interpréter r.",correlationSolution(d["18"])),
    short("5.","Selon cet ajustement, estimer le prix unitaire pour 300 exemplaires vendus. Arrondir au franc.","1143",["1143"],String.raw`La quantité vendue est $Y=300$. Dans le modèle de 3.a :
$$300=aX+b,\qquad X=\frac{300-b}{a}\approx1143{,}011.$$
Le prix serait donc d’environ $\boxed{1143\text{ F CFA}}$.

On résout ici le modèle précédent : ce n’est pas une régression de $X$ en $Y$. Ce prix est inférieur aux prix observés : la prévision est une extrapolation, et ne prouve pas qu’une baisse de prix provoquerait cette demande.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(19,"Dimensions de troncs d’iroko",tableFor("19"),[
    W("1.","Déterminer le point moyen.",meanSolution(d["19"])),
    W("2.","Déterminer la régression de Y en X par les moindres carrés.",regressionSolution(d["19"],"y")),
    short("3.a","Avec ce modèle, estimer le diamètre en cm pour une taille de 47 m. Arrondir à trois décimales.","151,270",["151.27"],String.raw`On utilise $a=35/74$ et $b=9549/74$ :
$$\widehat y=\frac{35}{74}\times47+\frac{9549}{74}=\frac{5597}{37}\approx\boxed{151{,}270\text{ cm}}.$$
$47$ m dépasse l’intervalle observé $[40;45]$ : il s’agit d’une extrapolation.`),
    short("3.b","Dans la même équation, à quelle taille en m correspondrait un diamètre de 170 cm ? Arrondir à trois décimales.","86,6",["86.6"],String.raw`
$$170=\frac{35}{74}x+\frac{9549}{74}.$$
En multipliant par $74$ puis en isolant $x$ :
$$35x=12580-9549=3031,\qquad x=\boxed{86{,}6\text{ m}}.$$
Cette valeur est très éloignée des tailles observées et la corrélation est seulement $r\approx0{,}575$ : cette extrapolation ne doit pas être présentée comme fiable.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(20,"Évolution mensuelle d’un magasin","X désigne le numéro du mois après l’ouverture, Y le chiffre d’affaires en milliers de francs CFA.\n\n"+tableFor("20"),[
    N("1.","20","covariance","Déterminer Cov(X,Y).",String.raw`$\bar x=3{,}5$, $\bar y=170$ et $\sum x_iy_i=3960$.
$$\operatorname{Cov}(X,Y)=3960/6-3{,}5\times170=660-595=\boxed{65}.$$`),
    W("2.","Déterminer V(X) puis V(Y).",varianceSolution(d["20"])),
    W("3.","Déterminer r puis l’interpréter.",correlationSolution(d["20"])),
    W("4.a","Déterminer la régression de Y en X.",regressionSolution(d["20"],"y")),
    W("4.b","Déterminer la régression de X en Y.",regressionSolution(d["20"],"x")),
    short("5.","Estimer le chiffre d’affaires au 8e mois, en milliers de francs CFA. Arrondir à trois décimales.","270,286",["270.286"],String.raw`On connaît le mois $X=8$ ; on utilise donc **Y en X** :
$$\widehat Y=\frac{156}{7}\times8+92=\frac{1892}{7}\approx270{,}286.$$
L’estimation est $\boxed{270{,}286}$ milliers de F CFA, soit environ $270286$ F CFA. C’est une extrapolation de deux mois.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
];
