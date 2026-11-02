import { spaceExercise as ex,written as w,choice as c } from "./terminalCSpaceBuilders";
export const spaceFixationA=[
  ex(1,"Normale à une face","ABCDEFGH est un pavé droit. E, F, G et H sont au-dessus de A, B, C et D.",[
    w("1.",String.raw`Donner un vecteur normal au plan $(ABC)$.`,String.raw`L’arête $(AE)$ est perpendiculaire aux deux arêtes sécantes $(AB)$ et $(AD)$ de la face inférieure. Donc $\overrightarrow{AE}$, non nul, est orthogonal à deux directions non colinéaires de $(ABC)$. Un vecteur normal est $\boxed{\overrightarrow{AE}}$. Son opposé convient également.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(2,"Plans déterminés dans un cube","ABCDEFGH est un cube, avec le même ordre des sommets.",[
    w("1.",String.raw`Trouver l’unique plan passant par $A$ et de normale $\overrightarrow{CD}$.`,String.raw`$(CD)$ est parallèle à $(AB)$. Or $(AB)$ est perpendiculaire à $(AD)$ et à $(AE)$ : le vecteur $\overrightarrow{CD}$ est donc normal à la face $(ADHE)$. Elle passe par $A$.

L’unique plan demandé est $\boxed{(ADH)}$, c’est-à-dire le plan de la face $ADHE$.`),
    w("2.",String.raw`Trouver l’unique plan passant par $H$ et de normale $\overrightarrow{FG}$.`,String.raw`$(FG)$ est parallèle à $(AD)$. Cette direction est perpendiculaire aux deux directions $(DC)$ et $(DH)$ de la face $DCGH$. Comme cette face contient $H$, le plan demandé est $\boxed{(DCG)}$, le plan de la face $DCGH$.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(3,"Un point et deux normales",String.raw`$A(2;0;3)$ et $\vec u=\vec i+2\vec j-3\vec k$.`,[
    w("1.",String.raw`Déterminer une équation du plan $(P)$ passant par $A$ et de normale $\vec i$.`,String.raw`$\vec i=(1;0;0)$, donc l’équation est de la forme $x+d=0$. En utilisant $A$, $2+d=0$. Ainsi $\boxed{x-2=0}$. Les coefficients de $y$ et $z$ sont nuls.`),
    w("2.",String.raw`Déterminer une équation du plan $(Q)$ passant par $A$ et de normale $\vec u$.`,String.raw`L’équation est $x+2y-3z+d=0$. Avec $A$ : $2+2(0)-3(3)+d=0$, donc $d=7$.
$$\boxed{x+2y-3z+7=0.}$$
Le point $A$ vérifie bien $2-9+7=0$.`),
  ]),
  ...[4,5].map(n=>ex(n,"Reconnaître l’équation d’un plan",String.raw`$A(1;1;0)$, $B(-1;0;4)$ et $C(2;2;-1)$.`,[
    c("1.",String.raw`Quelle équation définit le plan $(ABC)$ ?`,[String.raw`$3x-2y+z-1=0$`,String.raw`$2x+z-2=0$`,String.raw`$3x+2y-z=0$`],0,String.raw`$\overrightarrow{AB}=(-2;-1;4)$ et $\overrightarrow{AC}=(1;1;-1)$ ne sont pas colinéaires : les deux premières coordonnées ne donnent pas le même facteur. Il existe donc un unique plan $(ABC)$.

Dans la première équation :
- $A$ donne $3-2-1=0$ ;
- $B$ donne $-3+4-1=0$ ;
- $C$ donne $6-4-1-1=0$.

Les trois points la vérifient, donc c’est l’équation demandée. La deuxième échoue en $C$ : $4-1-2=1$ ; la troisième échoue déjà en $A$ : $3+2=5$.`),
  ])),
  ex(6,"Reconnaître une représentation paramétrique",String.raw`$A(1;1;0)$ et $B(-1;0;4)$.`,[
    c("1.",String.raw`Quelle représentation définit la droite $(AB)$ ? Tous les paramètres sont réels.`,[
      String.raw`$x=1-2\lambda,\ y=1-\lambda,\ z=4\lambda$`,
      String.raw`$x=-1-\mu,\ y=1-2\mu,\ z=1+2\mu$`,
      String.raw`$x=1-2t,\ y=-t,\ z=4+4t$`,
    ],0,String.raw`$\overrightarrow{AB}=(-2;-1;4)$. La première représentation s’écrit $A+\lambda\overrightarrow{AB}$ ; elle donne $A$ pour $\lambda=0$ et $B$ pour $\lambda=1$.

La deuxième a un directeur $(-1;-2;2)$ non colinéaire à $\overrightarrow{AB}$. La troisième a le bon directeur, mais ne passe pas par $A$ : $x=1$ impose $t=0$, puis $y=0\ne1$. Seule la première convient.`),
  ]),
];
