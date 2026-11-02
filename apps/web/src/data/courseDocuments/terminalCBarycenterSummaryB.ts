import type { CourseDocumentSection } from "../../domain/courseDocument";
export const barycenterSummaryB:CourseDocumentSection[]=[{
  id:"level-sets",numeral:"II",title:"Lignes et surfaces de niveau",topics:[
    {id:"bary-level-definition",title:"Traduire une condition en ensemble de points",pages:[22],legacyLessonIds:["barycenter-level-set-mission"],
      body:String.raw`Une fonction $f$ associe un réel à chaque point $M$. Chercher le niveau $k$, c’est déterminer **tous les points** qui vérifient $f(M)=k$.

Dans le plan, on parle de **ligne de niveau** ; dans l’espace, de **surface de niveau**. Le résultat peut aussi être vide, réduit à un point, ou égal au plan ou à l’espace entier.

La démarche est : transformer l’expression, reconnaître une condition géométrique, puis annoncer précisément l’ensemble obtenu. Il ne suffit pas d’écrire une équation intermédiaire.`,
    },
    {id:"bary-quadratic",title:"Somme de carrés : somme des coefficients non nulle",pages:[22,23],legacyLessonIds:["quadratic-level-sets"],
      body:String.raw`Posons $f(M)=\sum_i\alpha_i MA_i^2$ et $S=\sum_i\alpha_i\ne0$. Si $G$ est le barycentre du système, alors :
$$\boxed{f(M)=S\,MG^2+c,\qquad c=\sum_i\alpha_i GA_i^2=f(G).}$$
En développant $\overrightarrow{MA_i}=\overrightarrow{MG}+\overrightarrow{GA_i}$, les termes croisés s’annulent car $\sum_i\alpha_i\overrightarrow{GA_i}=\vec0$.

Ainsi $f(M)=k$ équivaut à :
$$MG^2=\frac{k-c}{S}=R^2.$$

| Valeur de $(k-c)/S$ | Dans le plan | Dans l’espace |
|---|---|---|
| Négative | Ensemble vide | Ensemble vide |
| Nulle | Le seul point $G$ | Le seul point $G$ |
| Positive | Cercle de centre $G$, rayon $R$ | Sphère de centre $G$, rayon $R$ |

On étudie **le signe du quotient**, pas seulement celui de $k-c$ : $S$ peut être négatif.`,
      nativeFigure:{kind:"barycenter",preset:"quadratic"},
      examples:[{id:"bary-equilateral-example",title:"Triangle équilatéral de côté a",prompt:String.raw`Déterminer les points du plan tels que $MA^2+MB^2+MC^2=5a^2$, avec $a>0$.`,parts:[
        {id:"bary-equilateral-center",label:"1.",prompt:"Choisir le point G.",solution:String.raw`Les trois coefficients valent $1$. Leur barycentre $G$ est le centre de gravité du triangle.

Si $I$ est le milieu de $[BC]$, alors $AI^2=a^2-(a/2)^2=3a^2/4$, puis :
$$AG^2=\left(\frac23AI\right)^2=\frac{a^2}{3}.$$
Par symétrie, $BG^2=CG^2=a^2/3$, donc $c=a^2$.`},
        {id:"bary-equilateral-circle",label:"2.",prompt:"Identifier l’ensemble.",solution:String.raw`La formule devient :
$$MA^2+MB^2+MC^2=3MG^2+a^2.$$
Ainsi $3MG^2+a^2=5a^2$, donc $MG^2=4a^2/3$.

L’ensemble est le **cercle de centre G et de rayon $\frac{2a\sqrt3}{3}$**.`},
      ]},
      {id:"bary-space-example",title:"Une surface de niveau dans l’espace",prompt:String.raw`Discuter $2MA^2+3MB^2+MC^2=k$.`,
        solution:String.raw`Posons $G=\operatorname{bar}\{(A,2),(B,3),(C,1)\}$ et $c=2GA^2+3GB^2+GC^2$. La somme vaut $6$ et :
$$2MA^2+3MB^2+MC^2=6MG^2+c.$$
Si $k<c$, l’ensemble est vide ; si $k=c$, c’est $\{G\}$ ; si $k>c$, c’est la sphère de centre $G$ et de rayon $\sqrt{(k-c)/6}$.`}],
    },
    {id:"bary-zero-quadratic",title:"Somme de carrés : somme des coefficients nulle",pages:[23],
      body:String.raw`Supposons maintenant $S=0$. Choisissons un point $O$ et posons :
$$\vec u=\sum_i\alpha_i\overrightarrow{OA_i}.$$
Ce vecteur ne dépend pas du point $O$ choisi. En développant les carrés :
$$\boxed{f(M)=f(O)-2\overrightarrow{OM}\cdot\vec u.}$$

**Si $\vec u=\vec0$**, la fonction est constante : le niveau $k=f(O)$ est le plan entier (ou l’espace entier) ; les autres niveaux sont vides.

**Si $\vec u\ne\vec0$**, la condition $f(M)=k$ donne :
$$\overrightarrow{OM}\cdot\vec u=\frac{f(O)-k}{2}.$$
Dans le plan, c’est une **droite perpendiculaire à $\vec u$**. Dans l’espace, c’est un **plan de vecteur normal $\vec u$**.

Pour construire cette droite ou ce plan, on peut chercher un point $H$ de la droite passant par $O$ et dirigée par $\vec u$, puis tracer la perpendiculaire en $H$.`,
      nativeFigure:{kind:"barycenter",preset:"zero-sum"},
    },
    {id:"bary-apollonius",title:"Rapport de distances : MA / MB = k",pages:[24],legacyLessonIds:["apollonius-level-set"],
      body:String.raw`Les points $A,B$ sont distincts, $k>0$, et le point $B$ est exclu puisque $MB$ est au dénominateur.

**Pour $k=1$**, on cherche $MA=MB$ : c’est la médiatrice de $[AB]$ dans le plan, le plan médiateur dans l’espace.

**Pour $k\ne1$**, l’ensemble est un cercle dans le plan, une sphère dans l’espace. On peut le déterminer de deux façons.

**Par son centre et son rayon :**
$$G=\operatorname{bar}\{(A,1),(B,-k^2)\},\qquad R=k\,GB.$$

**Par un diamètre $[IJ]$ :**
$$I=\operatorname{bar}\{(A,1),(B,k)\},\qquad J=\operatorname{bar}\{(A,1),(B,-k)\}.$$
Le centre est le milieu de $[IJ]$ et le rayon vaut $IJ/2$.

Pour le retrouver, élever au carré : $MA^2-k^2MB^2=0$. Les deux distances étant positives ou nulles et $k>0$, cette transformation conserve l’équivalence.`,
      nativeFigure:{kind:"barycenter",preset:"ratio"},
      examples:[{id:"bary-ratio-example",title:"AB = 3 et MA / MB = 2",prompt:"Déterminer le cercle par les deux méthodes.",parts:[
        {id:"bary-ratio-center",label:"1.",prompt:"Centre et rayon.",solution:String.raw`Choisissons sur $(AB)$ l’origine $A$ et une unité telle que $x_B=3$. Alors :
$$x_G=\frac{0-4\times3}{1-4}=4,\qquad GB=|4-3|=1.$$
Le rayon vaut $R=2GB=2$. C’est le cercle de centre $G$, situé au-delà de $B$, et de rayon $2$.`},
        {id:"bary-ratio-diameter",label:"2.",prompt:"Extrémités d’un diamètre.",solution:String.raw`On a :
$$x_I=\frac{0+2\times3}{1+2}=2,\qquad x_J=\frac{0-2\times3}{1-2}=6.$$
Le milieu de $[IJ]$ a pour abscisse $(2+6)/2=4$ et le rayon vaut $(6-2)/2=2$. On retrouve le même cercle.`},
      ]}],
    },
    {id:"bary-oriented-angles",title:"Angle orienté : choisir le bon arc",pages:[25],legacyLessonIds:["oriented-angle-level-set"],
      body:String.raw`Dans un plan orienté, on fixe $A\ne B$ et on cherche :
$$\left(\overrightarrow{MA},\overrightarrow{MB}\right)=\alpha\pmod{2\pi}.$$
Les points $A$ et $B$ sont exclus : l’un des deux vecteurs y serait nul.

**Si $\alpha=0$**, les vecteurs ont le même sens : on obtient la droite $(AB)$ privée du segment fermé $[AB]$.

**Si $\alpha=\pi$**, ils sont de sens opposés : on obtient le segment ouvert $]A;B[$.

**Si $-\pi<\alpha<0$ ou $0<\alpha<\pi$**, on obtient un **arc de cercle d’extrémités A et B, sans ces extrémités**. Le centre $O$ est sur la médiatrice de $[AB]$ et vérifie :
$$\left(\overrightarrow{OA},\overrightarrow{OB}\right)=2\alpha\pmod{2\pi}.$$
On ne garde pas tout le cercle : on choisit l’arc dont l’angle orienté vaut bien $\alpha$. Pour $A$ à gauche de $B$ dans un repère direct, $\alpha>0$ sélectionne l’arc au-dessus de $(AB)$ et $\alpha<0$ celui au-dessous.

Ne pas confondre une égalité **modulo $2\pi$**, qui choisit un arc, et une égalité **modulo $\pi$**, qui peut réunir les deux arcs.`,nativeFigure:{kind:"barycenter",preset:"angle"},
      examples:[{id:"bary-angle-example",title:"Un angle de −π/3",prompt:String.raw`Déterminer $\left(\overrightarrow{MA},\overrightarrow{MB}\right)=-\pi/3\pmod{2\pi}$.`,
        solution:String.raw`On construit sur la médiatrice de $[AB]$ le centre $O$ tel que $(\overrightarrow{OA},\overrightarrow{OB})=-2\pi/3\pmod{2\pi}$.

Avec $A$ à gauche de $B$, le centre est au-dessous de la droite. On trace le cercle passant par $A,B$, puis on conserve **le grand arc situé au-dessous de $(AB)$**, sans $A$ ni $B$.

Un point de l’autre arc donnerait $2\pi/3$, pas $-\pi/3$. Le signe de l’angle permet de lever l’ambiguïté.`,nativeFigure:{kind:"barycenter",preset:"angle-example"}},
      ],
    },
  ],
}];
