import { spaceExercise as ex,written as w } from "./terminalCSpaceBuilders";
export const spaceComplex=[
  ex(29,"Un câble et une plaque métallique",String.raw`Pour étudier une installation, les élèves modélisent une plaque métallique par le plan passant par $A(1;0;5)$, $B(0;2;6)$ et $C(3;7;0)$, et un câble par la droite passant par $U(-5;3;2)$ et $V(-3;4;-1)$. Le repère est orthonormé, l’unité est le mètre.

Ils veulent déterminer la distance minimale entre cette droite et ce plan, puis la comparer au seuil de $2$ mètres retenu dans l’exercice.`,[
    w("1.",String.raw`Rédiger un raisonnement permettant de déterminer cette distance et d’interpréter le résultat dans le modèle donné.`,String.raw`**1. Déterminons le plan de la plaque.**

$\overrightarrow{AB}=(-1;2;1)$ et $\overrightarrow{AC}=(2;7;-5)$ ne sont pas colinéaires. Le vecteur $\vec n=(17;3;11)$ leur est orthogonal :
$$-17+6+11=0,\qquad34+21-55=0.$$
L’équation est $17x+3y+11z+d=0$. En $A$, $17+55+d=0$, donc :
$$\boxed{(P):17x+3y+11z-72=0.}$$

**2. Étudions la droite représentant le câble.**

$\overrightarrow{UV}=(2;1;-3)$, donc une représentation est :
$$x=-5+2t,\quad y=3+t,\quad z=2-3t.$$
Le produit scalaire $\vec n\cdot\overrightarrow{UV}=34+3-33=4\ne0$. La droite n’est pas parallèle au plan : elle le coupe.

**3. Calculons leur intersection.**

Remplaçons les coordonnées dans $17x+3y+11z-72=0$ :
$$17x=-85+34t,\quad3y=9+3t,$$
$$11z=22-33t.$$
Les constantes donnent $-85+9+22-72=-126$ ; les coefficients de $t$ donnent $34+3-33=4$. L’équation devient :
$$-126+4t=0.$$
On trouve $t=\frac{63}2$, puis :
$$\boxed{I\left(58;\frac{69}2;-\frac{185}2\right).}$$
Le point $I$ est commun à la droite et au plan. Leur distance minimale est donc $\boxed{0\ \text{m}}$, inférieure à $2$ mètres.

**Conclusion.** Dans le modèle mathématique donné, la droite et le plan se rencontrent : la séparation minimale de $2$ mètres n’est pas satisfaite.

Le calcul concerne une **droite et un plan entiers**. Sans les limites de la plaque et du câble réels, on ne peut pas en déduire la distance entre ces objets finis ni certifier une sécurité électrique réelle. Le dessin ne remplace pas les données et ne permet pas de supposer le parallélisme.`),
  ],{figureKey:"tc-t2-l3-space"}),
];
