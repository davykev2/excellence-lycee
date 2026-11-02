import type { CourseDocumentSection } from "../../domain/courseDocument";
export const conicsSummaryA:CourseDocumentSection[]=[
  {id:"conics-general",numeral:"I",title:"Généralités sur les coniques",topics:[
    {id:"conics-equation",title:"Reconnaître une équation de conique",pages:[92],legacyLessonIds:["official-fixation-workshop"],
      body:String.raw`Dans ce chapitre, le plan est muni d’un **repère orthonormé**. Une conique est une courbe définie par une équation du second degré. Nous étudions d’abord les équations sans terme en $xy$ :
$$\boxed{Ax^2+By^2+2Cx+2Dy+E=0,}$$
où $A,B,C,D,E$ sont réels et où $A$ et $B$ ne sont pas tous les deux nuls.

Les coniques non dégénérées étudiées sont les **paraboles, ellipses et hyperboles**. Un cercle est un cas particulier d’ellipse. Selon les coefficients, l’ensemble obtenu peut aussi être vide, un point ou un ensemble de droites.

Une équation du second degré peut comporter un terme en $xy$. Un changement de repère par rotation permet parfois de retrouver une forme sans ce terme ; les exercices 37 et 38 en donnent des exemples.`,
      examples:[{id:"conics-recognize",title:"Quatre équations du second degré",prompt:"Reconnaître les coefficients avant de chercher la nature de la courbe.",parts:[
        {id:"conics-recognize-a",label:"a)",prompt:String.raw`$4x^2+y^2-8x-4y+7=0$.`,solution:String.raw`On lit $A=4$, $B=1$, $2C=-8$, $2D=-4$ et $E=7$. Ainsi $C=-4$ et $D=-2$. Comme $A$ et $B$ ne sont pas tous deux nuls, c’est une équation de conique.`},
        {id:"conics-recognize-b",label:"b)",prompt:String.raw`$2x^2-y^2-4x+3=0$.`,solution:String.raw`Ici $A=2$, $B=-1$, $C=-2$, $D=0$ et $E=3$. L’absence de terme en $y$ signifie simplement $2D=0$.`},
        {id:"conics-recognize-c",label:"c)",prompt:String.raw`$x^2-2y+6x-1=0$.`,solution:String.raw`Ici $A=1$, $B=0$, $C=3$, $D=-1$ et $E=-1$. Un seul terme carré suffit : $A\ne0$.`},
        {id:"conics-recognize-d",label:"d)",prompt:String.raw`$y^2+4y-2x+3=0$.`,solution:String.raw`Ici $A=0$, $B=1$, $C=-1$, $D=2$ et $E=3$. Le terme carré est maintenant $y^2$.`},
      ]}],
    },
    {id:"conics-reduction",title:"Réduire une équation et vérifier l’existence de points",pages:[92,93],
      body:String.raw`Les principales formes réduites, avec $a,b>0$, sont :

| Courbe | Formes réduites |
| --- | --- |
| Parabole | $x^2=2py$ ou $y^2=2px$, avec $p\ne0$ |
| Ellipse | $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ |
| Hyperbole | $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$ ou $-\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$ |

La lettre du paramètre est libre : le support utilise aussi $a$ au lieu de $p$ pour les paraboles.

Pour réduire une équation, on **complète les carrés**, puis on effectue une translation :
$$x^2-2hx=(x-h)^2-h^2.$$
Avec $X=x-h$ et $Y=y-k$, on travaille dans le repère de nouvelle origine $\Omega(h;k)$ et de mêmes directions.

Il faut toujours vérifier le signe du membre droit. Par exemple, $X^2+Y^2=-1$ donne l’ensemble vide ; $X^2+Y^2=0$ donne un point ; $X^2-Y^2=0$ donne deux droites. Une équation comme $X^2=0$ donne une seule droite.`,
      nativeFigure:{kind:"conic",preset:"reduction"},
      examples:[
        {id:"conics-reduced-examples",title:"Lire cinq formes réduites",prompt:"Identifier la famille sans confondre les signes.",parts:[
          {id:"conics-reduced-1",label:"1.",prompt:String.raw`$\dfrac{x^2}{2}+\dfrac{y^2}{3}=1$.`,solution:String.raw`Les deux carrés sont additionnés et les dénominateurs sont positifs : c’est une ellipse de centre $O$. Son grand axe est vertical car $3>2$.`},
          {id:"conics-reduced-2",label:"2.",prompt:String.raw`$\dfrac{x^2}{7}-\dfrac{y^2}{5}=1$.`,solution:String.raw`Les carrés ont des signes opposés. Le terme positif est en $x^2$ : c’est une hyperbole d’axe focal $(Ox)$.`},
          {id:"conics-reduced-3",label:"3.",prompt:String.raw`$-\dfrac{x^2}{10}+\dfrac{y^2}{14}=1$.`,solution:String.raw`Le terme positif est en $y^2$ : c’est une hyperbole d’axe focal $(Oy)$.`},
          {id:"conics-reduced-4",label:"4.",prompt:String.raw`$y^2=3x$.`,solution:String.raw`On compare à $y^2=2px$ : $2p=3$, donc $p=3/2$. La parabole a pour sommet $O$ et s’ouvre vers la droite.`},
          {id:"conics-reduced-5",label:"5.",prompt:String.raw`$x^2=-4y$.`,solution:String.raw`On compare à $x^2=2py$ : $p=-2$. La parabole a pour sommet $O$, pour axe $(Oy)$ et s’ouvre vers le bas.`},
        ]},
        {id:"conics-complete-squares",title:"Faire apparaître le centre",prompt:String.raw`Réduire $4x^2+y^2-8x-4y-8=0$.`,solution:String.raw`On regroupe les termes en $x$, puis ceux en $y$ :
$$4(x^2-2x)+(y^2-4y)-8=0.$$
On utilise $x^2-2x=(x-1)^2-1$ et $y^2-4y=(y-2)^2-4$ :
$$4(x-1)^2-4+(y-2)^2-4-8=0.$$
Ainsi $4(x-1)^2+(y-2)^2=16$, puis :
$$\boxed{\frac{(x-1)^2}{4}+\frac{(y-2)^2}{16}=1.}$$
Avec $X=x-1$ et $Y=y-2$, c’est une ellipse de centre $\Omega(1;2)$ et de grand axe vertical. Les demi-axes mesurent $2$ horizontalement et $4$ verticalement.`},
      ],
    },
  ]},
  {id:"conics-parabola-section",numeral:"II",title:"Parabole",topics:[
    {id:"conics-parabola-definition",title:"Forme, sommet et ouverture",pages:[93,94],legacyLessonIds:["conic-axis-vertices","parabola-construction-reinforcement"],
      body:String.raw`Une parabole de sommet $O$ a l’une des formes :
$$\boxed{y^2=2ax\quad\text{ou}\quad x^2=2ay,\qquad a\ne0.}$$
Le coefficient $a$ est **signé** ; le paramètre positif vaut $|a|$.

| Équation | Axe de symétrie | Sens d’ouverture |
| --- | --- | --- |
| $y^2=2ax$, $a>0$ | $(Ox)$ | vers la droite |
| $y^2=2ax$, $a<0$ | $(Ox)$ | vers la gauche |
| $x^2=2ay$, $a>0$ | $(Oy)$ | vers le haut |
| $x^2=2ay$, $a<0$ | $(Oy)$ | vers le bas |

Le sommet est le point où l’axe rencontre la parabole. **Une parabole n’a pas de centre de symétrie.** Dans une forme translatée, on remplace $x,y$ par $x-h,y-k$ et le sommet devient $S(h;k)$.`,
      nativeFigure:{kind:"conic",preset:"parabola"},
      examples:[{id:"conics-parabola-shape",title:"Lire une ouverture",prompt:String.raw`Étudier $x^2=y$.`,solution:String.raw`On écrit $x^2=2\times\frac12\,y$. Ainsi $a=\frac12>0$. Le sommet est $O$, l’axe est $(Oy)$ et la parabole s’ouvre vers le haut. Les points $(1;1)$ et $(-1;1)$ sont symétriques par rapport à cet axe.`}],
    },
    {id:"conics-parabola-elements",title:"Foyer, directrice et paramètre",pages:[94],legacyLessonIds:["parabola-reduced-equation"],
      body:String.raw`Pour une parabole de sommet $O$, les éléments sont :

| Équation | Foyer $F$ | Directrice $D$ | Axe |
| --- | --- | --- | --- |
| $y^2=2ax$ | $(a/2;0)$ | $x=-a/2$ | $(Ox)$ |
| $x^2=2ay$ | $(0;a/2)$ | $y=-a/2$ | $(Oy)$ |

Le paramètre positif est $|a|$, tandis que **la distance du sommet au foyer vaut $|a|/2$**. Le sommet est le milieu du segment joignant le foyer à son projeté sur la directrice.

La définition géométrique est :
$$\boxed{M\in\mathcal P\iff MF=d(M,D).}$$
Un point de la parabole est donc aussi loin du foyer que de la directrice. Le foyer n’appartient pas à la directrice ; aucun point de la parabole n’appartient à celle-ci.`,
      examples:[{id:"conics-parabola-element-examples",title:"Bien lire le facteur 2",prompt:"Déterminer les éléments de chaque parabole.",parts:[
        {id:"conics-parabola-x2",label:"1.",prompt:String.raw`$x^2=2y$.`,solution:String.raw`On compare à $x^2=2ay$ : $2a=2$, donc $a=1$. Le sommet est $O$, l’axe est $(Oy)$, le foyer est $F(0;1/2)$ et la directrice $y=-1/2$. Le paramètre vaut $1$ et $OF=1/2$.`},
        {id:"conics-parabola-y2",label:"2.",prompt:String.raw`$y^2=x$.`,solution:String.raw`On compare à $y^2=2ax$ : $2a=1$, donc $a=1/2$. Le sommet est $O$, l’axe est $(Ox)$, le foyer est $F(1/4;0)$ et la directrice $x=-1/4$. Le paramètre vaut $1/2$ et $OF=1/4$.`},
      ],nativeFigure:{kind:"conic",preset:"parabola-elements"}}],
    },
  ]},
];
