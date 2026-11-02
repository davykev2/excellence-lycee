import { statisticsExercise as E,written as W,short,statQuestion as N,statisticsData as d,tableFor,statisticsTable,meanSolution,varianceSolution,covarianceSolution,regressionSolution,correlationSolution } from "./terminalCStatisticsBuilders";
import { bivariateStatistics,transformedStatistics,statsTex as t } from "../../features/mathematics/statisticsModels";
const log32=transformedStatistics("32"),log33=transformedStatistics("33"),s32=bivariateStatistics(log32),s33=bivariateStatistics(log33);
export const statisticsDeepeningD=[
  E(30,"Dépenses scolaires et nombre d’enfants",String.raw`Enquête auprès de 248 ménages. X représente les dépenses annuelles en fournitures scolaires, en milliers de F CFA, et Y le nombre d’enfants.
| $X\backslash Y$ | 1 | 2 | 3 |
|---|---|---|---|
| Entre 0 et 100 | 71 | 24 | 37 |
| Entre 100 et 200 | 37 | 4 | 12 |
| Entre 200 et 300 | 36 | 11 | 16 |`,[
    W("1.","Établir la distribution marginale du nombre d’enfants en pourcentage.",String.raw`Additionnons chaque colonne : $144$, $39$ et $65$ ménages. Leur somme vaut $248$.

| Nombre d’enfants | 1 | 2 | 3 |
|---|---|---|---|
| Effectif | 144 | 39 | 65 |
| Pourcentage | $100\times144/248\approx58{,}06$ | $100\times39/248\approx15{,}73$ | $100\times65/248\approx26{,}21$ |

Les dénominateurs sont tous $248$, car il s’agit de fréquences marginales dans l’ensemble de l’enquête.`),
    W("2.","Établir la distribution marginale des dépenses.",String.raw`Les lignes totalisent $132$, $53$ et $63$ ménages, soit $248$.

| Dépense (milliers F) | 0 à 100 | 100 à 200 | 200 à 300 |
|---|---|---|---|
| Effectif | 132 | 53 | 63 |
| Fréquence | $33/62$ | $53/248$ | $63/248$ |
| Pourcentage arrondi | 53,23 % | 21,37 % | 25,40 % |

Le tableau ne permet pas de retrouver les dépenses exactes de chaque ménage à l’intérieur d’une classe.`),
    short("3.a","Quelle est la proportion de ménages d’un enfant ? Donner un pourcentage à deux décimales.","58,06",["58.06"],String.raw`Il y a $144$ ménages d’un enfant parmi $248$ :
$$p=\frac{144}{248}=\frac{18}{31}\approx0{,}580645.$$
En pourcentage, $\boxed{58{,}06\,\%}$.`),
    short("3.b","Quelle proportion dépense entre 100000 et 200000 F ? Donner un pourcentage à deux décimales.","21,37",["21.37"],String.raw`La classe $[100;200]$ milliers de F compte $37+4+12=53$ ménages :
$$100\times\frac{53}{248}\approx\boxed{21{,}37\,\%}.$$
Il s’agit de la proportion dans l’ensemble des ménages, sans condition sur le nombre d’enfants.`),
  ]),
  E(31,"Une ordonnée inconnue",String.raw`
| $x$ | 1,2 | 1,4 | 1,6 | 1,8 | 2 |
|---|---|---|---|---|---|
| $y$ | 13 | 12 | 14 | 16 | $\alpha$ |

La régression de Y en X a pour équation $y=9x+0{,}6$.`,[
    short("1.","Déterminer α.","20",["20"],String.raw`La moyenne des abscisses est $\bar x=8/5=1{,}6$. Puisque la droite passe par $G$ :
$$\bar y=9\times1{,}6+0{,}6=15.$$
Donc $(13+12+14+16+\alpha)/5=15$, soit $55+\alpha=75$.
Ainsi $\boxed{\alpha=20}$.`),
    N("2.","31","r","En déduire le coefficient de corrélation.",correlationSolution(d["31"])+String.raw`

Les valeurs exactes sont $V(X)=0{,}08$, $V(Y)=8$ et Cov $=0{,}72$ :
$$r=\frac{0{,}72}{\sqrt{0{,}08\times8}}=\frac{0{,}72}{0{,}8}=\boxed{0{,}9}.$$`),
  ]),
  E(32,"Un modèle puissance pour les dépenses alimentaires","Données de ménages de trois personnes avec un enfant mineur, en 1989.\n\n"+tableFor("32")+String.raw`

On pose $t_i=\ln x_i$ et $z_i=\ln y_i$. Afficher les logarithmes à deux décimales ; conserver leur précision complète pour les calculs de régression.`,[
    W("1.","Établir le tableau des logarithmes.",statisticsTable({...log32,x:log32.x.map(v=>Number(v.toFixed(2))),y:log32.y.map(v=>Number(v.toFixed(2)))},"$t=\\ln x$","$z=\\ln y$")+String.raw`

Par exemple $\ln39800\approx10{,}59$ et $\ln30000\approx10{,}31$. Les logarithmes ne s’appliquent qu’à des nombres strictement positifs, ce qui est le cas ici.`),
    W("2.","Représenter le nuage (t,z) dans un repère orthonormé.",String.raw`Placer les sept couples du tableau logarithmique. Le premier est environ $(10{,}59;10{,}31)$ et le dernier $(12{,}89;11{,}37)$.

Dans un repère orthonormé, la même longueur représente une unité sur les deux axes. Le nuage transformé est presque aligné.`),
    W("3.","Déterminer la régression de Z en T.",regressionSolution(log32,"y")+String.raw`

Avec les logarithmes non arrondis : $\boxed{z\approx0{,}459058t+5{,}453909}$.`),
    W("4.","En déduire un modèle de la forme y = axᵇ.",String.raw`Puisque $z=\ln y$ et $t=\ln x$, le modèle est $\ln y\approx bt+c$, avec $b\approx0{,}459058$ et $c\approx5{,}453909$.

En prenant l’exponentielle :
$$y\approx e^{c+b\ln x}=e^c x^b.$$
Ainsi $\boxed{y\approx233{,}669910\,x^{0{,}459058}}$ pour $x>0$.

Dans l’écriture $y=ax^b$, $a=e^c$ : le coefficient $a$ ne désigne pas ici la pente de la droite logarithmique.`),
    short("5.","Selon ce modèle, estimer les dépenses en F CFA pour un revenu mensuel de 20000 F en 1989. Arrondir au franc.","22031",["22031"],String.raw`On remplace $x$ par $20000$ en conservant les coefficients non arrondis :
$$\widehat y=e^{${t(s32.b!)}}\times20000^{${t(s32.a!)}}\approx22030{,}565.$$
L’arrondi est $\boxed{22031\text{ F CFA}}$.

Le revenu $20000$ F est inférieur au minimum observé, $39800$ F. Le modèle extrapolé prédit même des dépenses supérieures au revenu : il est inadapté pour conclure à un budget réel à ce niveau. Ce résultat n’est pas un conseil financier.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(33,"Un ajustement logarithmique",tableFor("33"),[
    W("1.","Représenter le nuage (x,y).",String.raw`Placer les douze couples du tableau. Les abscisses sont $1,2,\ldots,11,13$ : il n’y a pas de donnée pour $x=12$ et il ne faut pas l’inventer. Le nuage croît en s’aplatissant.`),
    W("2.","Poser x′ = ln x et représenter (x′,y).",statisticsTable(log33,"$x'=\\ln x$","$y$")+String.raw`

Pour $x=1$, on obtient $x'=0$, donc le premier point est $(0;198)$. Les autres abscisses sont calculées de la même manière. La transformation logarithmique rend ici le nuage presque rectiligne.`),
    short("3.","Calculer le coefficient de corrélation de (X′,Y). Arrondir à trois décimales.","0,999",["0.999"],correlationSolution(log33)+String.raw`

Il faut utiliser les **logarithmes des abscisses**, pas les abscisses initiales. À trois décimales, $\boxed{r\approx0{,}999}$.`),
    W("4.","Déterminer la régression de Y en X′.",regressionSolution(log33,"y")),
    W("5.","En déduire un modèle y = a ln x + b.",String.raw`On remplace $X'$ par $\ln x$ dans la droite obtenue :
$$\boxed{y\approx(${t(s33.a!)})\ln x+${t(s33.b!)}}.$$
Le domaine est $x>0$. Il s’agit d’un ajustement des observations, pas d’une identité exacte vérifiée par chaque couple.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(34,"Notes d’un élève pendant cinq mois",tableFor("34"),[
    W("1.","Représenter le nuage.",String.raw`Placer $(1;8)$, $(2;9)$, $(3;9)$, $(4;12)$ et $(5;13)$ ; le mois est en abscisse et la note sur 20 en ordonnée. Les deux notes égales à $9$ correspondent à deux mois distincts.`),
    W("2.","Déterminer le point moyen.",meanSolution(d["34"])),
    W("3.","Déterminer les moyennes et les écarts-types.",varianceSolution(d["34"])),
    N("4.a","34","covariance","Calculer la covariance.",covarianceSolution(d["34"])),
    N("4.b","34","r","Calculer le coefficient de corrélation.",correlationSolution(d["34"])),
    W("5.","Déterminer la régression de Y en X et la construire.",regressionSolution(d["34"],"y")+String.raw`

L’équation exacte est $\boxed{Y=1{,}3X+6{,}3}$. Pour tracer la droite, utiliser $G(3;10{,}2)$ et par exemple $(1;7{,}6)$, qui appartient à la droite, même si ce n’est pas une observation.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
];
