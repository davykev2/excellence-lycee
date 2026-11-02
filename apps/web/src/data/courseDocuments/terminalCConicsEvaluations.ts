import type { CourseEvaluationGroup } from "../../domain/courseDocument";
import { centralConicDetails,parabolaConicDetails } from "../exerciseCollections/conicSolutions";
export const conicsEvaluations:CourseEvaluationGroup[]=[
  {id:"conics-evaluation-elements",title:"Déterminer les éléments d’une conique",pages:[103,104],
    method:String.raw`Je regroupe les termes d’une même variable et je complète les carrés. Je divise par la constante non nulle pour obtenir une forme réduite. Je distingue le centre du sommet, puis je calcule l’axe, les foyers, les directrices et, pour l’hyperbole, les asymptotes. Chaque résultat est remis dans le repère initial.`,
    examples:[{id:"conics-evaluation-elements-examples",title:"Trois équations, trois réductions",prompt:"Déterminer la nature et les éléments caractéristiques.",parts:[
      {id:"conics-method-1a",label:"a)",prompt:String.raw`$x^2-4y^2-4x-8y-100=0$.`,solution:String.raw`On regroupe :
$$x^2-4x-4(y^2+2y)-100=0.$$
Puis $x^2-4x=(x-2)^2-4$ et $y^2+2y=(y+1)^2-1$, d’où :
$$ (x-2)^2-4-4(y+1)^2+4-100=0.$$
Ainsi $(x-2)^2-4(y+1)^2=100$, soit :
$$\boxed{\frac{(x-2)^2}{100}-\frac{(y+1)^2}{25}=1.}$$
`+centralConicDetails({kind:"hyperbola",axis:"x",h:2,k:-1,a2:100,b2:25})},
      {id:"conics-method-1b",label:"b)",prompt:String.raw`$\dfrac{x^2}{25}-\dfrac{y^2}{16}=1$.`,solution:String.raw`L’équation est déjà réduite. Le signe moins entre les carrés indique une hyperbole ; le terme positif en $x^2$ fixe l’axe focal horizontal.

`+centralConicDetails({kind:"hyperbola",axis:"x",h:0,k:0,a2:25,b2:16})},
      {id:"conics-method-1c",label:"c)",prompt:String.raw`$y^2-4x-8y+12=0$.`,solution:String.raw`On complète le carré en $y$ :
$$y^2-8y=(y-4)^2-16.$$
Donc $(y-4)^2-16-4x+12=0$, puis :
$$\boxed{(y-4)^2=4(x+1).}$$
`+parabolaConicDetails("x",2,-1,4)},
    ],nativeFigure:{kind:"conic",preset:"evaluation-elements"}}],
    questions:[],writtenTasks:[
      {id:"conics-application-1a",topicId:"conics-parabola-elements",prompt:String.raw`a) Déterminer les éléments de $x^2-6x-4y+13=0$.`,
        model:String.raw`On écrit $x^2-6x=(x-3)^2-9$. L’équation devient $(x-3)^2-4y+4=0$, soit :
$$\boxed{(x-3)^2=4(y-1).}$$
`+parabolaConicDetails("y",2,3,1),criteria:["Je complète le carré sans oublier la constante −9.","Je trouve le sommet (3;1), non le centre.","Je place le foyer (3;2) et la directrice y=0."],nativeFigure:{kind:"conic",preset:"application-1a"}},
      {id:"conics-application-1b",topicId:"conics-hyperbola-elements",prompt:String.raw`b) Déterminer les éléments de $-x^2+\dfrac{y^2}{4}=1$.`,
        model:String.raw`Le terme positif est $y^2/4$ : l’axe focal est vertical et son demi-axe mesure $2$. L’autre demi-axe mesure $1$.

`+centralConicDetails({kind:"hyperbola",axis:"y",h:0,k:0,a2:4,b2:1}),criteria:["Je reconnais l’orientation verticale.","Je calcule c²=4+1 et e=√5/2.","Je donne les asymptotes y=±2x."],nativeFigure:{kind:"conic",preset:"application-1b"}},
      {id:"conics-application-1c",topicId:"conics-hyperbola-elements",prompt:String.raw`c) Déterminer les éléments de $-2x^2+5y^2-10y+15=0$.`,
        model:String.raw`On regroupe $5y^2-10y=5(y-1)^2-5$. Ainsi :
$$-2x^2+5(y-1)^2+10=0.$$
On passe les termes pour obtenir $2x^2-5(y-1)^2=10$, puis :
$$\boxed{\frac{x^2}{5}-\frac{(y-1)^2}{2}=1.}$$
`+centralConicDetails({kind:"hyperbola",axis:"x",h:0,k:1,a2:5,b2:2}),criteria:["Je conserve le signe de la constante lors du passage à droite.","Je trouve le centre (0;1).","Je décale foyers, directrices et asymptotes dans le repère initial."],nativeFigure:{kind:"conic",preset:"application-1c"}},
    ],
  },
  {id:"conics-evaluation-plot",title:"Construire une conique",pages:[104,105,106],
    method:String.raw`Je réduis l’équation. Je place le centre ou le sommet et les axes. Je place les sommets, les foyers et les directrices ; pour une hyperbole, j’ajoute les asymptotes. Je calcule quelques points puis j’utilise les symétries. L’échelle doit être la même horizontalement et verticalement.`,
    examples:[
      {id:"conics-plot-ellipse",title:"Construire une ellipse",prompt:String.raw`Construire $\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$.`,
        solution:centralConicDetails({kind:"ellipse",axis:"x",h:0,k:0,a2:25,b2:16})+String.raw`

Pour obtenir des points supplémentaires, on isole $x^2$ :
$$x^2=25\left(1-\frac{y^2}{16}\right),\qquad x=\pm5\sqrt{1-\frac{y^2}{16}}.$$
Il faut $|y|\le4$. Quelques valeurs exactes :

| $y$ | $0$ | $1$ | $2$ | $3$ | $4$ |
| --- | --- | --- | --- | --- | --- |
| $x$ | $\pm5$ | $\pm5\sqrt{15}/4$ | $\pm5\sqrt3/2$ | $\pm5\sqrt7/4$ | $0$ |

On reporte les points et leurs symétriques par rapport aux axes, puis on trace une courbe fermée régulière passant par les quatre sommets. Les foyers sont des repères de construction, **pas des points de la courbe**.`,
        nativeFigure:{kind:"conic",preset:"evaluation-plot-ellipse"}},
      {id:"conics-plot-parabola",title:"Construire une parabole translatée",prompt:String.raw`Construire $y^2-4x+8y+12=0$.`,
        solution:String.raw`On conserve le $+8y$ de l’équation :
$$y^2+8y=(y+4)^2-16.$$
Donc $(y+4)^2-16-4x+12=0$, d’où :
$$\boxed{(y+4)^2=4(x+1).}$$
`+parabolaConicDetails("x",2,-1,-4)+String.raw`

On calcule $x=(y+4)^2/4-1$ :

| $y$ | $-8$ | $-7$ | $-6$ | $-5$ | $-4$ | $-3$ | $-2$ | $-1$ | $0$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $x$ | $3$ | $5/4$ | $0$ | $-3/4$ | $-1$ | $-3/4$ | $0$ | $5/4$ | $3$ |

Les points de même abscisse sont symétriques par rapport à $y=-4$. On trace la parabole vers la droite, en passant par le sommet $(-1;-4)$.`,
        nativeFigure:{kind:"conic",preset:"evaluation-plot-parabola"}},
    ],questions:[],writtenTasks:[
      {id:"conics-application-plot-p",topicId:"conics-hyperbola-form",prompt:String.raw`Construire $(P):4x^2-9y^2=-36$.`,
        model:String.raw`En divisant par $-36$, on trouve :
$$\boxed{-\frac{x^2}{9}+\frac{y^2}{4}=1.}$$
`+centralConicDetails({kind:"hyperbola",axis:"y",h:0,k:0,a2:4,b2:9})+String.raw`

On place les sommets $(0;2)$ et $(0;-2)$, puis les asymptotes $y=\pm(2/3)x$. Pour $y=\pm4$, on obtient $x^2=27$, donc $x=\pm3\sqrt3$. On utilise les symétries et on trace deux branches, l’une au-dessus de $y=2$, l’autre au-dessous de $y=-2$.`,
        criteria:["Je divise par une constante négative en changeant les deux signes.","Je place les deux sommets et les deux asymptotes.","Je trace deux branches verticales."],nativeFigure:{kind:"conic",preset:"application-plot-p"}},
      {id:"conics-application-plot-q",topicId:"conics-ellipse-form",prompt:String.raw`Construire $(Q):x^2+5y^2-10y=0$.`,
        model:String.raw`On complète le carré : $5y^2-10y=5(y-1)^2-5$. Donc :
$$x^2+5(y-1)^2=5,\qquad
\boxed{\frac{x^2}{5}+(y-1)^2=1.}$$
`+centralConicDetails({kind:"ellipse",axis:"x",h:0,k:1,a2:5,b2:1})+String.raw`

On place les quatre sommets $(\sqrt5;1)$, $(-\sqrt5;1)$, $(0;0)$ et $(0;2)$. On complète par symétrie par rapport à $x=0$ et $y=1$, puis on trace la courbe fermée. Les deux foyers sont $(2;1)$ et $(-2;1)$.`,
        criteria:["Je trouve le centre (0;1).","Je distingue les demi-axes √5 et 1.","Je construis les quatre sommets et une ellipse régulière."],nativeFigure:{kind:"conic",preset:"application-plot-q"}},
    ],
  },
];
