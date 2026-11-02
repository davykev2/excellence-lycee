import { statisticsExercise as E,written as W,choice,short,statQuestion as N,statisticsData as d,tableFor,meanSolution,covarianceSolution,regressionSolution,correlationSolution } from "./terminalCStatisticsBuilders";
export const statisticsFixation=[
  E(1,"Reconnaître une série statistique double",String.raw`Indiquer les tableaux qui définissent une série statistique double.

**Tableau 1**
| Notes | 10 | 11 | 14 | 16 |
|---|---|---|---|---|
| Effectif | 4 | 7 | 5 | 12 |

**Tableau 2**
| Poids (kg) | 59 | 74 | 84 | 89 |
|---|---|---|---|---|
| Taille (cm) | 154 | 144 | 174 | 184 |

**Tableau 3**
| Notes | 6 | 7 | 9 | 10 |
|---|---|---|---|---|
| Effectif | 8 | 6 | 7 | 5 |

**Tableau 4**
| Poids (kg) | 15 | 20 | 25 | 30 |
|---|---|---|---|---|
| Âge (ans) | 7 | 3 | 12 | 8 |`,[
    W("1.","Indiquer les numéros des tableaux et justifier.",String.raw`Les tableaux **2 et 4** associent à chaque individu deux caractères : poids/taille pour le 2, poids/âge pour le 4. Ce sont donc des séries doubles.

Les tableaux 1 et 3 donnent les valeurs d’un seul caractère, la note, et leurs effectifs. L’effectif n’est pas ici un deuxième caractère mesuré sur le même individu.`),
  ]),
  E(2,"Distributions marginales d’un tableau",String.raw`On considère le tableau d’effectifs suivant.
| $Z\backslash T$ | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|
| 13 | 2 | 3 | 5 | 1 | 2 |
| 14 | 1 | 1 | 2 | 1 | 3 |
| 15 | 4 | 2 | 1 | 5 | 2 |
| 16 | 3 | 4 | 3 | 2 | 1 |`,[
    W("1.","Déterminer les tableaux des fréquences marginales.",String.raw`Additionnons d’abord les colonnes : $10,10,11,9,8$. Les lignes totalisent $13,8,14,13$. Dans les deux cas, le total est $N=48$.

| $T$ | 14 | 15 | 16 | 17 | 18 |
|---|---|---|---|---|---|
| Effectif | 10 | 10 | 11 | 9 | 8 |
| Fréquence | $5/24$ | $5/24$ | $11/48$ | $3/16$ | $1/6$ |

| $Z$ | 13 | 14 | 15 | 16 |
|---|---|---|---|---|
| Effectif | 13 | 8 | 14 | 13 |
| Fréquence | $13/48$ | $1/6$ | $7/24$ | $13/48$ |

Chaque fréquence est un effectif marginal divisé par **48**, et non par le total d’une ligne particulière.`),
  ]),
  E(3,"Fréquences à partir de quatre couples",String.raw`
| $X$ | 15 | 20 | 25 | 30 |
|---|---|---|---|---|
| $Y$ | 7 | 3 | 12 | 8 |`,[
    W("1.","Déterminer les deux tableaux des fréquences marginales.",String.raw`Le tableau donne quatre couples, chacun observé une fois. Les quatre valeurs de $X$ sont distinctes ; celles de $Y$ le sont aussi.

| $X$ | 15 | 20 | 25 | 30 |
|---|---|---|---|---|
| Fréquence | $1/4$ | $1/4$ | $1/4$ | $1/4$ |

| $Y$ | 3 | 7 | 8 | 12 |
|---|---|---|---|---|
| Fréquence | $1/4$ | $1/4$ | $1/4$ | $1/4$ |

On peut ordonner les valeurs dans une distribution marginale. Il ne faut pas réordonner séparément les deux lignes lorsque l’on veut conserver les couples du tableau initial.`),
  ]),
  E(4,"Salaires horaires et jours de travail","Six employés d’une entreprise :\n\n"+tableFor("4"),[
    W("1.","Représenter le nuage de points de cette série.",String.raw`L’axe horizontal indique le salaire horaire, en francs CFA ; l’axe vertical indique le nombre de jours travaillés dans le mois.

Les six points sont $(1000;24)$, $(1250;20)$, $(1450;18)$, $(1650;16)$, $(1850;14)$ et $(2150;12)$.

Choisir des graduations lisibles, placer ces six couples, puis laisser les points séparés. Le nuage a une tendance décroissante.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(5,"Reconnaître le point moyen",String.raw`Une série double $(X,Y)$ vérifie $\bar X=4$ et $\bar Y=6$.`,[
    choice("1.","Choisir le point moyen.",["G(6 ; 5)","G(6 ; 4)","G(4 ; 5,5)","G(4 ; 6)"],3,String.raw`Par définition, $G(\bar X;\bar Y)$. On place la moyenne de $X$ en abscisse, celle de $Y$ en ordonnée. Donc $\boxed{G(4;6)}$ : réponse d.`),
  ]),
  E(6,"Vitesse et consommation","Consommation de quatre voitures parcourant une même distance.\n\n"+tableFor("6"),[
    W("1.","Calculer les coordonnées du point moyen G.",meanSolution(d["6"])),
  ]),
  E(7,"Chiffre d’affaires et bénéfice","Quatre entreprises d’une zone industrielle :\n\n"+tableFor("7"),[
    W("1.","Représenter le nuage dans un repère orthogonal.",String.raw`Placer $(4;3)$, $(6;2)$, $(8;5)$ et $(12;4)$. Les deux axes sont exprimés en millions de francs CFA. On ne relie pas les points.`),
    W("2.a","Calculer les coordonnées du point moyen G.",meanSolution(d["7"])),
    W("2.b","Placer G sur le graphique.",String.raw`Le calcul donne $G(7{,}5;3{,}5)$. Sur le graphique, repérer $7{,}5$ sur l’axe horizontal et $3{,}5$ sur l’axe vertical ; leur intersection est $G$. Il ne s’agit pas nécessairement d’un point du tableau.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(8,"Point moyen et covariance",tableFor("8"),[
    W("1.","Calculer les coordonnées du point moyen.",meanSolution(d["8"])),
    N("2.","8","covariance","Calculer la covariance de la série.",covarianceSolution(d["8"])),
  ]),
  E(9,"Salaire et personnes à charge","Enquête auprès de cinq techniciens de surface :\n\n"+tableFor("9"),[
    N("1.","9","covariance","Calculer la covariance.",covarianceSolution(d["9"])),
  ]),
  E(10,"Une régression passe par G",String.raw`Le point moyen est $G(6;9)$. Parmi les équations suivantes, choisir celle qui peut être la droite de régression de $Y$ en $X$. Les lettres du support sont conservées.`,[
    choice("1.","Quelle équation passe par G ?",[String.raw`c. $Y=-2X-3$`,String.raw`d. $Y=2X-3$`,String.raw`e. $Y=3X-2$`,String.raw`f. $Y=-3X+2$`],1,String.raw`Les deux régressions passent par le point moyen. Remplaçons $X$ par $6$ :

c donne $-15$ ; d donne $12-3=9$ ; e donne $16$ ; f donne $-16$.

Seule **d**, $\boxed{Y=2X-3}$, contient $G(6;9)$. Cela sélectionne l’unique proposition compatible ; le point moyen seul ne permettrait pas de calculer une régression sans cette liste.`),
  ]),
  E(11,"Production et achat d’engrais","Production de six planteurs et dépenses d’engrais pendant une campagne.\n\n"+tableFor("11"),[
    W("1.","Déterminer une équation de la droite de régression de y en x.",regressionSolution(d["11"],"y")),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(12,"Télévision et déplacements","Données hebdomadaires de cinq habitants :\n\n"+tableFor("12"),[
    W("1.","Déterminer la droite de régression de x en y par les moindres carrés.",regressionSolution(d["12"],"x")+String.raw`

Les coefficients exacts sont $a'=-1/2$ et $b'=44/5$. Ainsi $\boxed{x=-0{,}5y+8{,}8}$.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(13,"Calcul direct d’une corrélation",String.raw`On donne $\operatorname{Cov}(S,T)=120$, $V(S)=109$ et $V(T)=225$.`,[
    choice("1.","Choisir la valeur approchée de r.",["a. 0,766","b. 0,051","c. 0,066","d. 1,305"],0,String.raw`
$$r=\frac{120}{\sqrt{109\times225}}=\frac8{\sqrt{109}}\approx0{,}766261.$$
La bonne proposition est **a**. La valeur $1{,}305$ est impossible, car un coefficient de corrélation appartient à $[-1;1]$.`),
  ]),
  E(14,"Température et jours de pluie","Données de quatre villes pendant un mois :\n\n"+tableFor("14"),[
    N("1.","14","r","Calculer le coefficient de corrélation.",correlationSolution(d["14"])),
  ]),
];
