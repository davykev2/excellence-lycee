import { conicsExercise as ex,written,choice,centralQuestions,plotSteps } from "./terminalCConicsBuilders";
import { centralConicDetails } from "./conicSolutions";
export const conicsFixationB=[
  ex(7,"Construire deux ellipses","Construire chaque ellipse dans un repère orthonormé.",[
    written("a)",String.raw`$\dfrac{x^2}{36}+\dfrac{y^2}{49}=1$.`,centralConicDetails({kind:"ellipse",axis:"y",h:0,k:0,a2:49,b2:36})+String.raw`

On place $(\pm6;0)$ et $(0;\pm7)$. Pour $x=\pm3$, l’équation donne $y=\pm7\sqrt3/2$. On place ces quatre points puis on utilise les symétries.`+plotSteps),
    written("b)",String.raw`$\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$.`,centralConicDetails({kind:"ellipse",axis:"x",h:0,k:0,a2:25,b2:16})+String.raw`

On place $(\pm5;0)$ et $(0;\pm4)$. Pour $x=\pm3$, on obtient $y=\pm16/5$. Ces points aident à tracer les arcs.`+plotSteps),
  ],true),
  ex(8,"Foyers et directrices d’ellipses","Pour chaque ellipse, calculer c et e, déterminer les foyers et les directrices, puis les associer.",[
    ...centralQuestions("a",{kind:"ellipse",axis:"x",h:0,k:0,a2:9,b2:4}),
    ...centralQuestions("b",{kind:"ellipse",axis:"x",h:0,k:0,a2:25,b2:16}),
  ],true),
  ex(9,"Lire l’axe focal d’une ellipse","Calculer c et e, déterminer et associer les foyers et les directrices de chaque ellipse.",[
    ...centralQuestions("a",{kind:"ellipse",axis:"y",h:0,k:0,a2:9,b2:4}),
    ...centralQuestions("b",{kind:"ellipse",axis:"x",h:0,k:0,a2:25,b2:16}),
  ],true),
  ex(10,"Construire deux hyperboles","Construire chaque hyperbole en traçant d’abord ses asymptotes.",[
    written("a)",String.raw`$\dfrac{x^2}{36}-\dfrac{y^2}{49}=1$.`,centralConicDetails({kind:"hyperbola",axis:"x",h:0,k:0,a2:36,b2:49})+String.raw`

On place les sommets $(\pm6;0)$ et on trace les droites $y=\pm7x/6$. Pour $x=\pm12$, on obtient $y=\pm7\sqrt3$. Les deux branches sont à droite et à gauche des sommets.`+plotSteps),
    written("b)",String.raw`$-\dfrac{x^2}{25}+\dfrac{y^2}{16}=1$.`,centralConicDetails({kind:"hyperbola",axis:"y",h:0,k:0,a2:16,b2:25})+String.raw`

On place les sommets $(0;\pm4)$ et les asymptotes $y=\pm4x/5$. Pour $y=\pm8$, on a $x=\pm5\sqrt3$. Les deux branches sont au-dessus et au-dessous des sommets.`+plotSteps),
  ],true),
  ex(11,"Éléments d’hyperboles horizontales","Pour chaque hyperbole, calculer c et e, donner foyers, directrices et asymptotes, puis associer les couples foyer-directrice.",[
    ...centralQuestions("a",{kind:"hyperbola",axis:"x",h:0,k:0,a2:16,b2:4},true),
    ...centralQuestions("b",{kind:"hyperbola",axis:"x",h:0,k:0,a2:1,b2:4},true),
  ],true),
  ex(12,"Éléments d’hyperboles verticales",String.raw`On donne $-\frac{x^2}{4}+\frac{y^2}{8}=1$ et $\frac{x^2}{12}-\frac{y^2}{8}=-1$. Calculer les mêmes éléments après avoir repéré le terme carré positif.`,[
    ...centralQuestions("a",{kind:"hyperbola",axis:"y",h:0,k:0,a2:8,b2:4},true),
    ...centralQuestions("b",{kind:"hyperbola",axis:"y",h:0,k:0,a2:8,b2:12},true),
  ],true),
  ex(13,"Excentricité et famille","Donner la nature de la conique et le nombre de foyers et de directrices.",[
    choice("a)",String.raw`$e=0,3$.`,["Parabole : un foyer et une directrice","Ellipse : deux foyers et deux directrices","Hyperbole : deux foyers et deux directrices"],1,String.raw`$0<0,3<1$ : c’est une ellipse non circulaire. Elle a deux foyers et deux directrices.`),
    choice("b)",String.raw`$e=12$.`,["Ellipse : deux foyers et deux directrices","Parabole : un foyer et une directrice","Hyperbole : deux foyers et deux directrices"],2,String.raw`$12>1$ : c’est une hyperbole. Elle a deux foyers et deux directrices.`),
    choice("c)",String.raw`$e=1$.`,["Parabole : un foyer et une directrice","Ellipse : deux foyers et deux directrices","Hyperbole : deux foyers et deux directrices"],0,String.raw`L’égalité $e=1$ caractérise une parabole. Elle a un seul foyer et une seule directrice.`),
  ]),
];
