import { short, written } from "./builders";
import { exponentialExercise as ex } from "./terminalCExponentialPowerBuilders";

export const exponentialComplex = [
  ex(40, "Le développement d’un réseau de boutiques", String.raw`En 2010, un styliste ouvre des boutiques dans son pays, puis en Europe et dans le monde. Il utilise sur $[0;20]$ le modèle $f(x)=5+xe^{0,2x-1}$ pour le nombre de magasins en $2010+x$. Chaque magasin réalise un chiffre d’affaires journalier moyen de **164 000 F CFA** et ouvre **300 jours par an**. L’objectif annuel de l’ensemble des magasins est **3 936 000 000 F CFA**. À partir de quelle année sera-t-il atteint ? On privilégiera une approche graphique.`, [
    short("Seuil", "Combien de magasins le seuil de chiffre d’affaires représente-t-il ?", "$80$", ["80"], String.raw`Un magasin réalise $164000\times300=49200000$ F CFA par an. Le seuil est donc $3936000000/49200000=\boxed{80}$ magasins, dans le modèle.`),
    written("Étude et lecture", "Justifie la lecture du premier dépassement sur le graphique.", String.raw`La dérivée est $f'(x)=(1+0{,}2x)e^{0,2x-1}>0$ sur $[0;20]$. La fonction est donc continue et strictement croissante. On trace sa courbe avec **la droite y=80**.

L’intersection a pour abscisse $x_0\approx13{,}554$. Pour les années entières, $f(13)\approx69{,}39<80$ et $f(14)\approx89{,}70>80$. Le modèle ne donne pas littéralement un nombre entier de magasins : ces valeurs servent à situer le seuil.`),
    short("Année", "Quelle est la première année entière atteignant l’objectif ?", "$2024$", ["2024"], String.raw`La première valeur entière de x au moins égale à $13{,}554$ est $14$. **L’objectif est atteint à partir de $2010+14=2024$**, dans ce modèle de prévision.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(41, "Déterminer une heure par un modèle de refroidissement", String.raw`Un crime a été commis dans un hôtel. L’inspecteur et le médecin légiste arrivent le **mercredi 2 août 2023 à 10 h**. La chambre est à **20 °C**, le corps à **32 °C**. Une demi-heure plus tard, le corps est à **31 °C**. On modélise sa température t heures après le décès par $T(t)=Ae^{-kt}+20$, avec $A,k>0$, et $T(0)=37$. Détermine l’heure du décès en justifiant tes calculs.`, [
    short("Constante A", "Détermine A.", "$17$", ["17"], String.raw`À $t=0$, $e^0=1$, donc $37=A+20$. **$A=17$**, d’où $T(t)=17e^{-kt}+20$.`),
    written("Constante k", "Exploite les deux mesures espacées d’une demi-heure.", String.raw`Notons $t_1$ le temps écoulé entre le décès et 10 h. Les mesures donnent

$$17e^{-kt_1}=12,\qquad17e^{-k(t_1+1/2)}=11.$$

En divisant la seconde égalité par la première, on élimine $t_1$ : $e^{-k/2}=11/12$. En prenant $\ln$ :

$$\boxed{k=2\ln(12/11)\approx0{,}174023\ \mathrm{h}^{-1}.}$$`),
    written("Temps écoulé", "Calcule t₁.", String.raw`De $17e^{-kt_1}=12$, on obtient $e^{-kt_1}=12/17$, puis $kt_1=\ln(17/12)$. Ainsi

$$t_1=\frac{\ln(17/12)}{2\ln(12/11)}\approx2{,}0015\text{ h}.$$

Cela représente environ **2 h et 5 s**, et non 2 h 15 min : la partie décimale d’une heure doit être multipliée par 60 pour obtenir des minutes.`),
    written("Conclusion", "Donne l’heure et précise la portée de la réponse.", String.raw`On retranche le temps écoulé à 10 h : $10-2{,}0015=7{,}9985$ heures, soit environ **7 h 59 min 55 s**, donc **8 h le 2 août 2023** à la précision des données.

Cette estimation est celle du modèle à température ambiante constante et refroidissement exponentiel. Les données arrondies à un degré ne justifient pas une précision réelle à la seconde ; le calcul n’est pas, à lui seul, une datation médico-légale certaine.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
];
