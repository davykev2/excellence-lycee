import { spaceExercise as ex,written as w,short as s } from "./terminalCSpaceBuilders";
export const spaceFixationB=[
  ex(7,"Droites non coplanaires",String.raw`$(D):(x;y;z)=(-2;2;1)+\lambda(1;-1;4)$ et $(D'):(x;y;z)=(3;-2;1)+\mu(1;3;1)$, avec $\lambda,\mu\in\mathbb R$.`,[
    w("1.",String.raw`Démontrer que $(D)$ et $(D')$ ne sont pas coplanaires.`,String.raw`Les directeurs $(1;-1;4)$ et $(1;3;1)$ ne sont pas colinéaires : les premières coordonnées imposeraient un facteur $1$, incompatible avec les deuxièmes.

Pour une intersection, les deux premières coordonnées donneraient $\lambda-\mu=5$ et $\lambda+3\mu=4$. D’où $4\mu=-1$, $\mu=-\frac14$, puis $\lambda=\frac{19}4$.

Mais les troisièmes coordonnées seraient $1+4(\frac{19}4)=20$ et $1-\frac14=\frac34$. Elles ne sont pas égales. Les droites n’ont pas de point commun et ne sont pas parallèles : elles sont donc **non coplanaires**.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(8,"Droite orthogonale à un plan",String.raw`$A(-1;1;2)$, $B(0;0;1)$, $C(0;-1;-2)$ et $M(8;10;5)$.`,[
    w("1.",String.raw`Vérifier que $A,B,C$ ne sont pas alignés.`,String.raw`$\overrightarrow{AB}=(1;-1;-1)$ et $\overrightarrow{AC}=(1;-2;-4)$. S’ils étaient colinéaires, la première coordonnée imposerait un facteur $1$, mais les deuxièmes coordonnées seraient différentes. Donc les points ne sont pas alignés et définissent un plan.`),
    w("2.",String.raw`Déterminer une représentation de la droite passant par $M$ et orthogonale à $(ABC)$.`,String.raw`Une normale $(a;b;c)$ vérifie $a-b-c=0$ et $a-2b-4c=0$. En soustrayant : $b+3c=0$. Prenons $c=-1$, alors $b=3$ et $a=2$.

Le vecteur $(2;3;-1)$ est normal à $(ABC)$, donc directeur de la droite demandée :
$$\boxed{x=8+2t,\quad y=10+3t,\quad z=5-t,\quad t\in\mathbb R.}$$
Vérification des produits scalaires : $2-3+1=0$ et $2-6+4=0$.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(9,"Intersection de deux plans",String.raw`$(P):2x-y+5z+7=0$ et $(P'):-3x+4y+2z-1=0$.`,[
    w("1.",String.raw`Démontrer que ces plans sont sécants.`,String.raw`Leurs normales sont $(2;-1;5)$ et $(-3;4;2)$. Elles ne sont pas colinéaires : les deux premières coordonnées demanderaient à la fois un facteur $-\frac32$ et un facteur $-4$. Les plans sont donc sécants suivant une droite.`),
    w("2.",String.raw`Donner une représentation de leur droite d’intersection.`,String.raw`Éliminons $y$ : quatre fois la première équation, ajoutée à la seconde, donne $5x+22z+27=0$. Puis $y=2x+5z+7$.

Pour éviter les fractions, posons $z=-1+5t$. Alors $x=-1-22t$, puis $y=-19t$ :
$$\boxed{x=-1-22t,\quad y=-19t,\quad z=-1+5t.}$$
Réciproquement, ces coordonnées vérifient les deux équations pour tout réel $t$. Toute solution du système s’obtient en prenant $t=\frac{z+1}5$ : il s’agit bien de toute la droite, pas seulement d’un sous-ensemble.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(10,"Plans strictement parallèles",String.raw`$(P):2x-y+3z+4=0$ et $(P'):-4x+2y-6z+1=0$.`,[
    w("1.",String.raw`Donner une normale de chaque plan.`,String.raw`En lisant les coefficients : $\boxed{\vec n=(2;-1;3)}$ et $\boxed{\vec n'=(-4;2;-6)}$. Ils sont non nuls, et $\vec n'=-2\vec n$.`),
    w("2.",String.raw`Démontrer que les plans sont strictement parallèles.`,String.raw`Les normales colinéaires donnent des plans parallèles. Divisons l’équation de $(P')$ par $-2$ :
$$2x-y+3z-\tfrac12=0.$$
Les constantes $4$ et $-\frac12$ diffèrent alors que les trois autres coefficients sont identiques. Aucun point ne peut vérifier les deux équations ; les plans sont **strictement parallèles**.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(11,"Distance d’un point à un plan",String.raw`$E(4;2;-1)$ et $(Q):3x-4y+6=0$.`,[
    s("1.",String.raw`Calculer $d(E,Q)$.`,"$2$",["2"],String.raw`La normale est $(3;-4;0)$, de norme $\sqrt{9+16}=5$. Le numérateur est $|3(4)-4(2)+6|=|10|=10$.
$$\boxed{d(E,Q)=\frac{10}5=2.}$$
L’absence de $z$ signifie que son coefficient est nul ; la coordonnée $-1$ ne contribue donc pas au calcul.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(12,"Distance entre deux plans parallèles",String.raw`$(P):x+y-2z-3=0$ et $(P'):-2x-2y+4z+1=0$.`,[
    w("1.",String.raw`Démontrer que les plans sont strictement parallèles.`,String.raw`Les normales $(1;1;-2)$ et $(-2;-2;4)$ sont colinéaires. En divisant la seconde équation par $-2$, elle devient $x+y-2z-\frac12=0$. Les constantes $-3$ et $-\frac12$ sont différentes : les plans sont strictement parallèles.`),
    s("2.",String.raw`Calculer leur distance.`,String.raw`$\frac5{2\sqrt6}=\frac{5\sqrt6}{12}$`,["5/(2*sqrt(6))","5sqrt(6)/12","5*sqrt(6)/12"],String.raw`Pour des plans parallèles, la distance est celle de n’importe quel point de l’un à l’autre. Choisissons $A(3;0;0)\in(P)$.

Dans l’équation normalisée de $(P')$ :
$$d(P,P')=\frac{|3-\frac12|}{\sqrt{1+1+4}}
=\frac{5/2}{\sqrt6}.$$
Ainsi $\boxed{d(P,P')=\frac5{2\sqrt6}=\frac{5\sqrt6}{12}}$. Il fallait d’abord rendre les coefficients des normales identiques avant de comparer les constantes.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(13,"Plan orthogonal à une droite",String.raw`$A(5;2;3)$, $B(4;-2;1)$ et $C(2;4;-5)$.`,[
    w("1.",String.raw`Déterminer une équation du plan passant par $C$ et orthogonal à $(AB)$.`,String.raw`Un directeur de $(AB)$ est $\overrightarrow{AB}=(-1;-4;-2)$. Son opposé $(1;4;2)$ peut servir de normale au plan demandé.

Le plan passant par $C$ s’écrit $(x-2)+4(y-4)+2(z+5)=0$. Après développement :
$$\boxed{x+4y+2z-8=0.}$$
Vérification : en $C$, $2+16-10-8=0$.`),
  ],{figureKey:"tc-t2-l3-space"}),
];
