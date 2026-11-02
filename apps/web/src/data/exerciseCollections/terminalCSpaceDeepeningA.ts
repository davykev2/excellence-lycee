import { spaceExercise as ex,written as w,tf } from "./terminalCSpaceBuilders";
export const spaceDeepeningA=[
  ex(14,"Deux normales d’un même plan",String.raw`$\vec n$ et $\vec n'$ sont des vecteurs normaux à un même plan $(P)$. Répondre par Vrai ou Faux.`,[
    tf("1.",String.raw`$\vec n$ et $\vec n'$ sont orthogonaux.`,false,String.raw`Deux normales au même plan sont colinéaires et non nulles. Si $\vec n'=k\vec n$, avec $k\ne0$, alors $\vec n\cdot\vec n'=k\|\vec n\|^2\ne0$. Elles ne sont pas orthogonales.`),
    tf("2.",String.raw`$\vec n$ et $\vec n'$ sont colinéaires.`,true,String.raw`Toutes les droites orthogonales à un même plan ont la même direction. Les deux vecteurs normaux sont donc colinéaires.`),
    tf("3.",String.raw`$\vec n$ et $\vec n'$ ne sont ni colinéaires ni orthogonaux.`,false,String.raw`Ils sont nécessairement colinéaires. Cette affirmation est donc fausse.`),
  ]),
  ex(15,"Normales et positions de deux plans",String.raw`$\vec n$ et $\vec n'$ sont respectivement normaux aux plans $(P)$ et $(Q)$. Répondre par Vrai ou Faux. Le mot « parallèles » inclut les plans confondus.`,[
    tf("1.",String.raw`Si $\vec n$ et $\vec n'$ sont colinéaires, alors $(P)$ et $(Q)$ sont parallèles.`,true,String.raw`Les normales colinéaires déterminent la même direction orthogonale. Les plans sont parallèles, éventuellement confondus.`),
    tf("2.",String.raw`Si $\vec n$ et $\vec n'$ sont orthogonaux, alors $(P)$ et $(Q)$ sont perpendiculaires.`,true,String.raw`C’est la caractérisation de deux plans perpendiculaires par leurs normales non nulles : $\vec n\cdot\vec n'=0$.`),
    tf("3.",String.raw`Si $(P)$ et $(Q)$ sont parallèles, alors $\vec n$ et $\vec n'$ sont orthogonaux.`,false,String.raw`Leurs normales sont colinéaires, pas orthogonales. Par exemple $z=0$ et $z=1$ ont tous deux la normale $(0;0;1)$, dont le produit scalaire avec elle-même vaut $1$.`),
  ]),
  ex(16,"Plans du repère","Déterminer une équation cartésienne de chacun des plans suivants.",[
    w("1.",String.raw`Le plan passant par $O$ et de normale $\vec i$.`,String.raw`Une normale $(1;0;0)$ donne $x+d=0$. Le point $O(0;0;0)$ impose $d=0$. Le plan est donc $\boxed{x=0}$, c’est le plan $(O;\vec j,\vec k)$.`),
    w("2.",String.raw`Le plan passant par $O$ et de normale $\vec k$.`,String.raw`Avec la normale $(0;0;1)$, l’équation est $z+d=0$. Comme $O$ appartient au plan, $d=0$. Ainsi $\boxed{z=0}$.`),
    w("3.",String.raw`Le plan muni du repère $(O;\vec i,\vec j)$.`,String.raw`Un point du plan s’écrit $O+x\vec i+y\vec j$ ; sa troisième coordonnée est nulle. Réciproquement, tout $(x;y;0)$ est dans ce plan. Son équation est $\boxed{z=0}$.`),
  ]),
  ex(17,"Plan défini par trois points",String.raw`$A(0;1;1)$, $B(2;3;-1)$ et $C(-3;4;1)$.`,[
    w("1.",String.raw`Démontrer que les trois points ne sont pas alignés.`,String.raw`$\overrightarrow{AB}=(2;2;-2)$ et $\overrightarrow{AC}=(-3;3;0)$. Le premier a une troisième coordonnée non nulle et le second nulle, sans être nul : ils ne peuvent pas être colinéaires. Les trois points ne sont pas alignés.`),
    w("2.",String.raw`Déterminer une équation de $(ABC)$.`,String.raw`Cherchons une normale $(a;b;c)$. Les deux orthogonalités s’écrivent $2a+2b-2c=0$ et $-3a+3b=0$. Donc $a=b$, puis $c=2a$. Prenons $(1;1;2)$.

Le plan a pour équation $x+y+2z+d=0$. Avec $A$, $1+2+d=0$, donc $d=-3$ :
$$\boxed{x+y+2z-3=0.}$$
Vérification en $B$ : $2+3-2-3=0$ ; en $C$ : $-3+4+2-3=0$.`),
    w("3.",String.raw`Donner un vecteur normal à ce plan.`,String.raw`Les coefficients de l’équation obtenue donnent directement $\boxed{(1;1;2)}$. Tout multiple non nul convient également.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(18,"Deux plans perpendiculaires",String.raw`$A(-2;0;0)$, $B(0;3;0)$ et $C(0;0;-4)$.`,[
    w("1.",String.raw`Déterminer une équation du plan $(ABC)$.`,String.raw`$\overrightarrow{AB}=(2;3;0)$ et $\overrightarrow{AC}=(2;0;-4)$ sont non colinéaires. La normale $(a;b;c)$ doit vérifier $2a+3b=0$ et $2a-4c=0$. Choisissons $a=6$, donc $b=-4$ et $c=3$.

L’équation $6x-4y+3z+d=0$ donne, avec $A$, $-12+d=0$, donc :
$$\boxed{6x-4y+3z+12=0.}$$
Les points $B$ et $C$ vérifient aussi cette équation.`),
    w("2.",String.raw`Déterminer une équation d’un plan passant par $A$ et orthogonal au plan $(ABC)$.`,String.raw`Il suffit de trouver une normale $\vec m$ orthogonale à $(6;-4;3)$. Le choix $\vec m=(2;3;0)$ convient car $6(2)-4(3)+3(0)=0$.

Le plan de normale $\vec m$ passant par $A$ est :
$$\boxed{2(x+2)+3y=0,\quad\text{soit }2x+3y+4=0.}$$
Il passe bien par $A$ et ses normales sont orthogonales. Plusieurs plans satisfont ces deux conditions ; on a donné l’un d’eux.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(19,"Plan contenant une droite",String.raw`$(P):x-y+3=0$. La droite $(D)$ est l’intersection de $(Q):x-z-2=0$ et $(Q'):2x+y-3z+1=0$.`,[
    w("1.",String.raw`Démontrer que $(D)$ est strictement parallèle à $(P)$.`,String.raw`Posons $z=t$. La première équation donne $x=t+2$, puis la seconde donne $y=t-5$. Donc $(D):(2;-5;0)+t(1;1;1)$.

Le directeur $(1;1;1)$ est orthogonal à la normale $(1;-1;0)$ de $(P)$, car $1-1=0$. Le point $(2;-5;0)$ n’appartient pas à $(P)$ : $2-(-5)+3=10\ne0$. Ainsi $(D)$ est strictement parallèle à $(P)$.`),
    w("2.",String.raw`Déterminer une équation du plan contenant $(D)$ et perpendiculaire à $(P)$.`,String.raw`Sa normale $(a;b;c)$ doit être orthogonale au directeur de $(D)$ et à la normale de $(P)$ :
$$a+b+c=0,\qquad a-b=0.$$
Prenons $(a;b;c)=(1;1;-2)$. Le plan s’écrit $x+y-2z+d=0$. Comme il contient $(2;-5;0)$, $2-5+d=0$, donc $d=3$ :
$$\boxed{x+y-2z+3=0.}$$
Pour tout point de $(D)$, $(t+2)+(t-5)-2t+3=0$ : toute la droite est bien incluse.`),
  ],{figureKey:"tc-t2-l3-space"}),
  ex(20,"Plans dépendant de paramètres",String.raw`$(P):x+y+z=0$ et $(Q):ax+y+z+b=0$, où $a,b\in\mathbb R$.`,[
    w("1.",String.raw`Pour quelles valeurs de $a,b$ les plans sont-ils sécants ?`,String.raw`Leurs normales sont $(1;1;1)$ et $(a;1;1)$. Elles sont colinéaires exactement lorsque $a=1$, car les deux dernières coordonnées imposent un facteur $1$.

Les plans sont donc $\boxed{\text{sécants si et seulement si }a\ne1}$, quel que soit $b$. Pour $a=1$, ils sont confondus si $b=0$ et strictement parallèles sinon.`),
    w("2.",String.raw`Dans le cas sécant, déterminer $a,b$ pour que la droite d’intersection $(D)$ soit orthogonale à la droite $(D'):x=1,\ y=-3+b\lambda,\ z=-1+\lambda$.`,String.raw`Soustraire les équations de plans donne $(a-1)x+b=0$, donc $x=-\frac b{a-1}$. L’équation de $(P)$ impose seulement $y+z=\frac b{a-1}$. Un directeur de leur intersection est ainsi $(0;1;-1)$.

Un directeur de $(D')$ est $(0;b;1)$. Leur produit scalaire vaut $b-1$. Les directions sont orthogonales si et seulement si $b=1$.
$$\boxed{a\ne1,\quad b=1.}$$
Le mot « orthogonales » porte sur leurs directions ; on ne demande pas qu’elles soient sécantes.`),
  ],{figureKey:"tc-t2-l3-space"}),
];
