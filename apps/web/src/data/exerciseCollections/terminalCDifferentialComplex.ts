import { differentialExercise as ex, written as w } from "./terminalCDifferentialBuilders";

export const differentialComplex = [
  ex(39, "Un objet qui refroidit", String.raw`Un objet est retiré d’un four à $100\,^\circ\mathrm C$ puis placé dans une pièce à $10\,^\circ\mathrm C$. Le temps $t$ est en **minutes**. On note $\theta(t)$ l’écart entre sa température et celle de la pièce ; $\theta'=-\theta\ln3$.

Un ami veut retirer l’objet du dispositif dès que sa température est **strictement inférieure à $15\,^\circ\mathrm C$**. Il vérifie chaque minute, la première fois au bout d’une minute. Aide-le à déterminer à quelle vérification il peut le retirer.`, [
    w("1.", "Détermine l’écart θ(t), puis la température de l’objet.", String.raw`À l’instant $0$, l’écart vaut $\theta(0)=100-10=90$.

L’équation est $y'=ay$ avec $a=-\ln3$. Ainsi $\theta(t)=Ce^{-t\ln3}$. La condition initiale donne $C=90$.
$$\boxed{\theta(t)=90\cdot3^{-t},\qquad T(t)=10+90\cdot3^{-t}.}$$
Il faut ajouter les $10\,^\circ\mathrm C$ de la pièce : $\theta$ n’est pas la température totale.`),
    w("2.", String.raw`Résous $T(t)<15$.`, String.raw`En utilisant la formule :
$$10+90\cdot3^{-t}<15
\ \Longleftrightarrow\ 3^{-t}<\frac1{18}.$$
Le logarithme est croissant : $-t\ln3<-\ln18$. Comme $\ln3>0$, on obtient :
$$\boxed{t>\frac{\ln18}{\ln3}\simeq2,631\ \text{minutes}.}$$
L’inégalité est stricte : au seuil lui-même, la température vaut exactement $15\,^\circ\mathrm C$.`),
    w("3.", "Conclue pour les vérifications minute par minute.", String.raw`Le premier entier strictement supérieur à $2,631$ est **$3$**. Contrôlons :

- À $t=2$ : $T(2)=10+90/9=20\,^\circ\mathrm C$, encore trop chaud.
- À $t=3$ : $T(3)=10+90/27=40/3\simeq13,33\,^\circ\mathrm C$.

**Il peut retirer l’objet à la troisième vérification, après 3 minutes.** Le temps de passage continu sous $15\,^\circ\mathrm C$ et l’instant de la première mesure admissible sont différents.`),
  ], { correctionFigureKey: "tc-l8-differential" }),
];
