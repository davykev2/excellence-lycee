import { conicsExercise as ex,written } from "./terminalCConicsBuilders";
export const conicsComplex=[
  ex(41,"Agrandir une salle elliptique",String.raw`Un architecte prépare une salle de conférence de forme elliptique dans un bâtiment de l’ONU, au Plateau. Dans un repère orthonormé d’unité le mètre, la salle $E_1$ a pour équation :
$$400x^2+169y^2+1600x-338y-65831=0.$$
Le projet prévoit d’augmenter de 4 m la longueur du grand axe pour obtenir une nouvelle ellipse $E_2$. Deux piliers principaux sont placés aux foyers. L’architecte veut recalculer leurs positions ; le maître d’ouvrage affirme que leur écartement augmentera lui aussi de 4 m. Le responsable du projet te demande de déterminer les positions exactes des piliers avant et après l’agrandissement.`,[
    written("1.","Déterminer les positions des piliers dans les deux cas et examiner l’affirmation du maître d’ouvrage.",String.raw`**1. Réduire l’équation de la salle initiale.**

On complète les carrés :
$$400[(x+2)^2-4]+169[(y-1)^2-1]-65831=0.$$
La constante à transférer vaut $1600+169+65831=67600$. Donc :
$$400(x+2)^2+169(y-1)^2=67600,$$
$$\boxed{\frac{(x+2)^2}{169}+\frac{(y-1)^2}{400}=1.}$$
Le centre est $\Omega(-2;1)$, le demi-grand axe vertical vaut 20 m et le demi-petit axe vaut 13 m. Ainsi :
$$c^2=20^2-13^2=231,\qquad c=\sqrt{231}.$$
Les piliers initiaux sont donc placés en :
$$\boxed{F_1(-2;1+\sqrt{231}),\quad F'_1(-2;1-\sqrt{231}).}$$

**2. Distinguer ce que l’agrandissement impose.**

Le grand axe initial mesure 40 m ; il devient 44 m, donc le nouveau demi-grand axe vaut 22 m. Pour connaître les nouveaux foyers, il faut aussi connaître le nouveau petit axe et le centre.

Si le projet **conserve le centre, l’orientation et le petit axe**, la nouvelle équation est :
$$\frac{(x+2)^2}{169}+\frac{(y-1)^2}{484}=1.$$
Alors $c_2^2=22^2-13^2=315$, soit $c_2=3\sqrt{35}$. Les nouvelles positions sont :
$$\boxed{F_2(-2;1+3\sqrt{35}),\quad F'_2(-2;1-3\sqrt{35}).}$$

**3. Comparer l’écartement des piliers.**

L’écartement passe de $2\sqrt{231}$ à $6\sqrt{35}$ mètres. Son augmentation est :
$$6\sqrt{35}-2\sqrt{231}\approx\boxed{5,10\ \text{m}},$$
et non 4 m. Chaque pilier s’éloigne du centre d’environ 2,55 m.

**Conclusion.** Sous l’hypothèse du petit axe et du centre conservés, les positions ci-dessus répondent au projet et l’affirmation du maître d’ouvrage est fausse. Si le petit axe ou le centre change aussi, leur nouvelle valeur doit être précisée : le seul grand axe de 44 m ne fixe pas les nouveaux foyers. Le calcul géométrique ne constitue pas une validation de structure du bâtiment.`),
  ],true),
  ex(42,"Dessiner une piscine près d’un mur",String.raw`Monsieur Kouabenan souhaite construire une piscine près d’un mur de son jardin et d’une pompe à eau. Il veut que chaque point du bord soit à une distance de la pompe égale à la moitié de sa distance au mur.

Un professeur choisit un repère orthonormé d’unité **2 m**, représente la pompe par un point $F$ et le mur par une droite $D$. Ses calculs donnent, pour le bord de la piscine :
$$3x^2+4y^2+6x-9=0.$$
Appelé chez lui, il remet ce résultat à Monsieur Kouabenan, qui sollicite son fils de TerminaleC. Aider le fils à réaliser le schéma de la piscine, de la pompe et du mur.`,[
    written("1.","Construire le schéma et expliquer les dimensions ainsi que les positions possibles de la pompe et du mur.",String.raw`**1. Utiliser la condition sur les distances.**

Le bord vérifie $MF=\frac12d(M,D)$. L’excentricité est donc $e=1/2$ : c’est une ellipse.

**2. Réduire l’équation.**

Comme $3x^2+6x=3(x+1)^2-3$, on obtient :
$$3(x+1)^2+4y^2=12,\qquad
\boxed{\frac{(x+1)^2}{4}+\frac{y^2}{3}=1.}$$
Le centre est $\Omega(-1;0)$, le demi-grand axe horizontal vaut 2 unités et le demi-petit axe $\sqrt3$ unités.

**3. Placer les points utiles.**

Les quatre sommets sont $(1;0)$, $(-3;0)$, $(-1;\sqrt3)$ et $(-1;-\sqrt3)$. On a $c^2=4-3=1$, donc les foyers sont $(0;0)$ et $(-2;0)$.

Les directrices sont $x=-1\pm a/e=-1\pm4$, soit $x=3$ et $x=-5$. Les deux couples possibles sont donc :

| Pompe $F$ | Mur associé $D$ |
| --- | --- |
| $(0;0)$ | $x=3$ |
| $(-2;0)$ | $x=-5$ |

Le contexte ne précise pas lequel est retenu. On peut représenter le premier couple : pompe à l’origine et mur à droite. Il ne faut pas associer un foyer à la directrice de signe opposé.

**4. Passer des unités aux mètres.**

Une unité vaut 2 m. La piscine mesure donc $4\times2=\boxed{8\text{ m}}$ sur le grand axe et $2\sqrt3\times2=\boxed{4\sqrt3\text{ m}}\approx6,93\text{ m}$ sur le petit axe. Pour le premier couple, le centre est 2 m à gauche de la pompe et le mur est 6 m à droite de celle-ci.

**Vérification sur un sommet.** Pour $A(1;0)$ et $F(0;0)$, on a $AF=1$ unité et $d(A,D)=2$ unités. La distance à la pompe est bien la moitié de la distance au mur. On trace l’ellipse fermée par les quatre sommets.`),
  ],true),
];
