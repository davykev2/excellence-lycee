import { statisticsExercise as E,written as W,statisticsData as d,tableFor,correlationSolution,regressionSolution } from "./terminalCStatisticsBuilders";
export const statisticsComplex=[
  E(36,"Une campagne de sensibilisation","Après une campagne contre l’obésité, l’ONG « La santé, ma priorité » observe cinq personnes.\n\n"+tableFor("36")+String.raw`

Le président choisit le critère suivant pour l’exercice : la campagne sera déclarée réussie si le modèle estime une masse inférieure à 90 kg pour une taille de 185 cm. Exploiter les données pour discuter ce critère.`,[
    W("1.","Choisir et justifier un ajustement adapté.",correlationSolution(d["36"])+String.raw`

On souhaite estimer la **masse Y à partir de la taille X**, donc on choisit la régression de Y en X. Le coefficient $r\approx0{,}971$ et le nuage allongé rendent l’ajustement affine possible dans ce petit échantillon.`),
    W("2.","Construire le modèle et estimer la masse à 185 cm.",regressionSolution(d["36"],"y")+String.raw`

Pour $X=185$ :
$$\widehat Y=\frac{1567}{2354}\times185-\frac{60384}{1177}\approx\boxed{71{,}847\text{ kg}}.$$
On conserve les coefficients non arrondis pour obtenir cette valeur.`),
    W("3.","Répondre au président en distinguant le critère du modèle et une conclusion réelle.",String.raw`Selon le modèle, la masse estimée est environ $71{,}85$ kg, donc inférieure à $90$ kg. **Le critère numérique choisi par le président est satisfait.**

Mais $185$ cm dépasse la taille maximale observée de $179$ cm : c’est une extrapolation sur cinq personnes seulement. Surtout, une relation taille/masse après une campagne, sans comparaison avant/après ni groupe comparable, ne prouve pas l’efficacité de cette campagne.

On peut donc conclure « critère satisfait selon ce modèle », **pas** « efficacité réelle démontrée » ni diagnostic individuel.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
  E(37,"Quand le club pourrait-il recevoir son aide ?","Le club de mathématiques relève ses adhérents en 2018 :\n\n"+tableFor("37")+String.raw`

Une fondation proposerait une aide lorsque le nombre d’adhérents **dépasserait strictement 3000**. Proposer, selon un ajustement affine, le mois et l’année auxquels ce seuil pourrait être franchi.`,[
    W("1.","Justifier le modèle et déterminer la droite d’ajustement.",correlationSolution(d["37"])+"\n\n"+regressionSolution(d["37"],"y")+String.raw`

Les coefficients exacts sont $a=12305/143$ et $b=33490/33$. Le numéro $1$ correspond à janvier 2018.`),
    W("2.","Résoudre la condition de franchissement du seuil.",String.raw`On utilise les coefficients non arrondis et l’inégalité stricte :
$$\frac{12305}{143}x+\frac{33490}{33}>3000.$$
Comme la pente est positive :
$$x>\frac{3000-33490/33}{12305/143}\approx23{,}070026.$$
Le premier numéro de mois entier admissible est donc $\boxed{x=24}$.

Vérification : au mois $23$, le modèle donne environ $2993{,}97$, encore sous le seuil ; au mois $24$, il donne environ $3080{,}02$, au-dessus.`),
    W("3.","Convertir le numéro en date et conclure.",String.raw`Les mois $1$ à $12$ sont ceux de 2018. Le mois $13$ est janvier 2019, et le mois $24$ est donc **décembre 2019**.

Le modèle prévoit un franchissement du seuil en $\boxed{\text{décembre 2019}}$. Il extrapole toutefois jusqu’à un an après les observations : l’aide dépendra du nombre d’adhérents réellement constaté et des conditions de la fondation, pas seulement de la droite.`),
  ],{correctionFigureKey:"tc-l10-statistics"}),
];
