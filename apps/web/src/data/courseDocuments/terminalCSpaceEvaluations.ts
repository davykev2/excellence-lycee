import type { CourseEvaluationGroup } from "../../domain/courseDocument";
export const spaceEvaluations:CourseEvaluationGroup[]=[
  {id:"space-eval-line-plane",title:"Comment étudier la position d’une droite et d’un plan ?",pages:[76],
    method:String.raw`1. Relever un vecteur directeur $\vec u$ de la droite et une normale $\vec n$ du plan.
2. Calculer $\vec u\cdot\vec n$.
3. S’il est non nul, la droite coupe le plan en un point ; remplacer ses coordonnées paramétriques dans l’équation du plan pour le trouver.
4. S’il est nul, tester un point de la droite : il appartient au plan ⇒ droite incluse ; sinon ⇒ droite strictement parallèle.`,
    examples:[{id:"space-eval-line-plane-worked",title:"Deux droites et un plan",prompt:String.raw`$A(1;2;-3)$, $B(0;1;-2)$ et $(P):2x-y+z+5=0$. La droite $(D)$ a pour représentation $x=-2+t$, $y=2-t$, $z=1+4t$, $t\in\mathbb R$.`,
      parts:[
        {id:"space-eval-abp",label:"1.",prompt:String.raw`Étudier la position de $(AB)$ et de $(P)$.`,solution:String.raw`$\overrightarrow{AB}=(-1;-1;1)$ et $\vec n=(2;-1;1)$. Leur produit scalaire vaut $-2+1+1=0$. La direction de $(AB)$ est donc parallèle au plan.

Testons $A$ : $2(1)-2-3+5=2\ne0$. Donc $A\notin(P)$, et $\boxed{(AB)\text{ est strictement parallèle à }(P)}$.`},
        {id:"space-eval-dp",label:"2.",prompt:String.raw`Étudier la position de $(D)$ et de $(P)$.`,solution:String.raw`Un directeur de $(D)$ est $(1;-1;4)$. Son produit scalaire avec $\vec n$ vaut $2+1+4=7\ne0$. La droite est sécante au plan.

En remplaçant dans l’équation :
$$2(-2+t)-(2-t)+(1+4t)+5=7t.$$
Le point d’intersection correspond à $t=0$, donc $\boxed{I(-2;2;1)}$.`},
      ],nativeFigure:{kind:"space",preset:"eval-line-plane"}}],
    questions:[],writtenTasks:[{id:"space-eval-line-plane-apply",topicId:"space-line-plane",
      prompt:String.raw`Étudier la position de $(D):x=2+t,\ y=5-t,\ z=1+3t$, $t\in\mathbb R$, et de $(P):3x-2y-z=3$. Préciser leur intersection.`,
      model:String.raw`$\vec u=(1;-1;3)$ dirige $(D)$ et $\vec n=(3;-2;-1)$ est normal à $(P)$. Comme $\vec u\cdot\vec n=3+2-3=2\ne0$, ils sont sécants.

Un point de $(D)$ appartient à $(P)$ si :
$$3(2+t)-2(5-t)-(1+3t)=3.$$
Après réduction, $-5+2t=3$, soit $t=4$. On obtient $x=6$, $y=1$, $z=13$.
$$\boxed{D\cap P=\{(6;1;13)\}.}$$
Vérification : $3(6)-2(1)-13=3$.`,
      nativeFigure:{kind:"space",preset:"apply-line-plane"},criteria:["Je relève un directeur et une normale.","Je justifie la position avec leur produit scalaire.","Je remplace les trois coordonnées et vérifie l’intersection."]}],
  },
  {id:"space-eval-three-points",title:"Comment déterminer le plan passant par trois points ?",pages:[77],
    method:String.raw`1. Vérifier que deux vecteurs formés avec les trois points ne sont pas colinéaires : le plan est alors bien défini.
2. Chercher un vecteur non nul $(a;b;c)$ orthogonal à ces deux vecteurs.
3. Écrire $ax+by+cz+d=0$ et utiliser un des points pour trouver $d$.
4. Vérifier que les trois points appartiennent au plan obtenu.`,
    examples:[{id:"space-eval-plane-worked",title:"Plan (ABC)",prompt:String.raw`Déterminer une équation de $(ABC)$ avec $A(1;2;-3)$, $B(0;1;-2)$ et $C(1;-1;0)$.`,
      solution:String.raw`$\overrightarrow{AB}=(-1;-1;1)$ et $\overrightarrow{AC}=(0;-3;3)$. Ils ne sont pas colinéaires : le premier a une première coordonnée non nulle et le second une première coordonnée nulle, sans être nul.

Une normale $(a;b;c)$ vérifie $-a-b+c=0$ et $-3b+3c=0$. La seconde donne $b=c$, puis la première $a=0$. Prenons $\vec n=(0;1;1)$.

Le plan s’écrit $y+z+d=0$. Avec $A$, $2-3+d=0$, donc $d=1$ :
$$\boxed{(ABC):y+z+1=0.}$$
Les coordonnées de $B$ et $C$ vérifient respectivement $1-2+1=0$ et $-1+0+1=0$.`,
      nativeFigure:{kind:"space",preset:"eval-three-points"}}],
    questions:[],writtenTasks:[{id:"space-eval-plane-apply",topicId:"space-plane-equation",
      prompt:String.raw`Déterminer une équation du plan passant par $A(2;1;3)$, $B(-1;2;-3)$ et $C(3;-2;-1)$.`,
      model:String.raw`$\overrightarrow{AB}=(-3;1;-6)$ et $\overrightarrow{AC}=(1;-3;-4)$ ne sont pas colinéaires : le rapport des premières coordonnées serait $-3$, mais celui des deuxièmes serait $-\frac13$.

Cherchons une normale $(a;b;c)$ :
$$-3a+b-6c=0,\qquad a-3b-4c=0.$$
La première donne $b=3a+6c$. Dans la seconde : $a-9a-18c-4c=0$, donc $4a+11c=0$. Prenons $c=-4$ : $a=11$, puis $b=9$.

Le plan s’écrit $11x+9y-4z+d=0$. Avec $A$, $22+9-12+d=0$, donc $d=-19$ :
$$\boxed{11x+9y-4z-19=0.}$$
Pour $B$ : $-11+18+12-19=0$ ; pour $C$ : $33-18+4-19=0$. Les trois points conviennent.`,
      nativeFigure:{kind:"space",preset:"apply-three-points"},criteria:["Je prouve que les trois points ne sont pas alignés.","Je calcule une normale non nulle.","Je vérifie les trois appartenances."]}],
  },
  {id:"space-eval-two-lines",title:"Comment étudier la position de deux droites ?",pages:[78],
    method:String.raw`1. Comparer deux vecteurs directeurs.
2. S’ils sont colinéaires, tester un point pour distinguer droites confondues et strictement parallèles.
3. Sinon, utiliser **deux paramètres indépendants**, puis résoudre les trois égalités de coordonnées.
4. Une solution donne l’intersection. Une incompatibilité signifie que les droites sont non coplanaires, pas parallèles.`,
    examples:[{id:"space-eval-lines-worked",title:"Comparer trois droites",prompt:String.raw`
$(D_1):(x;y;z)=(3;1;0)+\lambda(1;2;3)$ ;

$(D_2):(x;y;z)=(1;4;-2)+\mu(-2;-4;-6)$ ;

$(D_3):(x;y;z)=(0;-2;7)+\nu(3;1;-2)$.
Tous les paramètres sont réels.`,
      parts:[
        {id:"space-eval-d1d2",label:"1.",prompt:String.raw`Comparer $(D_1)$ et $(D_2)$.`,solution:String.raw`$\vec u_2=-2\vec u_1$ : les directions sont parallèles. Le point $(1;4;-2)$ de $(D_2)$ n’appartient pas à $(D_1)$ : sa première coordonnée imposerait $\lambda=-2$, mais la deuxième serait alors $1+2(-2)=-3\ne4$.

Les droites sont donc **strictement parallèles**.`},
        {id:"space-eval-d1d3",label:"2.",prompt:String.raw`Comparer $(D_1)$ et $(D_3)$.`,solution:String.raw`Les directeurs $(1;2;3)$ et $(3;1;-2)$ ne sont pas colinéaires. Pour une intersection, il faudrait :
$$3+\lambda=3\nu,\quad1+2\lambda=-2+\nu,\quad3\lambda=7-2\nu.$$
Les deux premières équations donnent $\lambda=-\frac65$ et $\nu=\frac35$.

Or la troisième donnerait $-\frac{18}5=\frac{29}5$, ce qui est impossible. Il n’y a pas d’intersection et les directions ne sont pas parallèles : les droites sont **non coplanaires**.`},
      ],nativeFigure:{kind:"space",preset:"eval-two-lines"}}],
    questions:[],writtenTasks:[
      {id:"space-eval-lines-apply1",topicId:"space-two-lines",prompt:String.raw`Comparer $(D_1):(4;-1;3)+\lambda(1;1;5)$ et $(D_2):(2;7;2)+\mu(4;-6;3)$.`,
        model:String.raw`Les directeurs ne sont pas colinéaires. Les deux premières égalités donnent :
$$4+\lambda=2+4\mu,\qquad-1+\lambda=7-6\mu.$$
Ainsi $\lambda=4\mu-2=8-6\mu$, donc $\mu=1$, puis $\lambda=2$.

Les troisièmes coordonnées seraient $3+5(2)=13$ et $2+3(1)=5$. Elles sont différentes. Les droites sont donc $\boxed{\text{non coplanaires}}$.`,
        nativeFigure:{kind:"space",preset:"apply-two-lines"},criteria:["J’utilise deux paramètres.","Je vérifie les trois coordonnées, pas seulement deux.","Je distingue non coplanaires et parallèles."]},
      {id:"space-eval-lines-apply2",topicId:"space-two-lines",prompt:String.raw`Comparer le même $(D_2)$ et $(D_3):(-5;3;8)+t(-2;3;\frac32)$.`,
        model:String.raw`Les deux premières coordonnées des directeurs semblent proportionnelles, avec un facteur $-\frac12$. Mais $3(-\frac12)=-\frac32\ne\frac32$ : les directeurs ne sont pas colinéaires.

Une intersection exigerait $2+4\mu=-5-2t$ et $7-6\mu=3+3t$. Soit :
$$4\mu+2t=-7,\qquad6\mu+3t=4.$$
Multiplier la première par $\frac32$ donnerait $6\mu+3t=-\frac{21}2$, incompatible avec la seconde. Il n’existe donc aucun point commun. Les droites sont $\boxed{\text{non coplanaires}}$.`,
        criteria:["Je conserve le signe positif de 3/2.","Je repère l’incompatibilité des deux équations.","Je conclus avec les directions non colinéaires."]},
    ],
  },
  {id:"space-eval-two-planes",title:"Comment étudier la position de deux plans ?",pages:[79],
    method:String.raw`Comparer leurs vecteurs normaux : non colinéaires ⇒ plans sécants ; colinéaires ⇒ plans parallèles. Dans ce dernier cas, comparer **tous** les coefficients, constante comprise, ou tester un point pour distinguer plans confondus et strictement parallèles. Un produit scalaire nul de deux normales non nulles caractérise des plans perpendiculaires.`,
    examples:[{id:"space-eval-planes-worked",title:"Comparer trois plans",prompt:String.raw`$(P_1):x+y+z+1=0$, $(P_2):2x-y+z-4=0$, $(P_3):-x+\frac12y-\frac12z+5=0$.`,
      parts:[
        {id:"space-eval-p1p2",label:"1.",prompt:String.raw`Comparer $(P_1)$ et $(P_2)$.`,solution:String.raw`Leurs normales $(1;1;1)$ et $(2;-1;1)$ ne sont pas colinéaires : le facteur donné par la première coordonnée serait $2$, mais celui de la deuxième serait $-1$. Les plans sont donc **sécants suivant une droite**.`},
        {id:"space-eval-p2p3",label:"2.",prompt:String.raw`Comparer $(P_2)$ et $(P_3)$.`,solution:String.raw`$\vec n_3=-\frac12\vec n_2$ : les plans sont parallèles. Multiplions toute l’équation de $(P_3)$ par $-2$ :
$$2x-y+z-10=0.$$
La partie $2x-y+z$ est la même, mais les constantes $-10$ et $-4$ diffèrent. Les plans sont donc **strictement parallèles**.`},
      ],nativeFigure:{kind:"space",preset:"eval-two-planes"}}],
    questions:[],writtenTasks:[{id:"space-eval-planes-apply",topicId:"space-two-planes",
      prompt:String.raw`Étudier la position de $(P):3x+y-4z+7=0$ et $(Q):x-3y+1=0$.`,
      model:String.raw`Leurs normales sont $\vec n=(3;1;-4)$ et $\vec n'=(1;-3;0)$. Elles ne sont pas colinéaires : la troisième coordonnée empêcherait un facteur non nul commun. Les plans sont donc sécants.

De plus :
$$\vec n\cdot\vec n'=3(1)+1(-3)+(-4)(0)=0.$$
Ainsi $\boxed{P\perp Q}$ : ces deux plans sécants sont perpendiculaires.`,
      nativeFigure:{kind:"space",preset:"apply-two-planes"},criteria:["Je relève correctement les deux normales.","Je justifie qu’elles ne sont pas colinéaires.","Je calcule leur produit scalaire."]}],
  },
];
