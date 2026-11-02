import { conicsExercise as ex,written,centralTask,plotSteps } from "./terminalCConicsBuilders";
import { parabolaConicDetails,centralConicDetails } from "./conicSolutions";
export const conicsDeepeningA=[
  ex(14,"Paraboles d’axes horizontaux","Déterminer la nature, le sommet, l’axe et le foyer. Préciser l’existence éventuelle d’un centre.",[
    written("a)",String.raw`$y^2=16x$.`,parabolaConicDetails("x",8)),
    written("b)",String.raw`$y^2=-16x$.`,parabolaConicDetails("x",-8)),
  ],true),
  ex(15,"Paraboles d’axes verticaux","Déterminer la nature, le sommet, l’axe et le foyer. Préciser l’existence éventuelle d’un centre.",[
    written("a)",String.raw`$x^2=10y$.`,parabolaConicDetails("y",5)),
    written("b)",String.raw`$x^2=-5y$.`,parabolaConicDetails("y",-2.5)),
  ],true),
  ex(16,"Étudier deux ellipses","Préciser la nature, le centre, les axes, les sommets, les foyers et les éventuelles asymptotes.",[
    centralTask("a)",{kind:"ellipse",axis:"y",h:0,k:0,a2:25,b2:9}),
    centralTask("b)",{kind:"ellipse",axis:"x",h:0,k:0,a2:4,b2:1}),
  ],true),
  ex(17,"Étudier deux hyperboles","Préciser la nature, le centre, les axes, les sommets, les foyers et les asymptotes.",[
    centralTask("a)",{kind:"hyperbola",axis:"y",h:0,k:0,a2:9,b2:25}),
    centralTask("b)",{kind:"hyperbola",axis:"x",h:0,k:0,a2:9,b2:1}),
  ],true),
  ex(18,"Ne pas confondre ellipse et hyperbole","Déterminer la nature, les éléments et les éventuelles asymptotes de chaque courbe.",[
    centralTask("a)",{kind:"ellipse",axis:"x",h:0,k:0,a2:25,b2:9}),
    centralTask("b)",{kind:"hyperbola",axis:"x",h:0,k:0,a2:4,b2:1}),
  ],true),
  ex(19,"Paramètre et directrice","Déterminer les éléments caractéristiques de la parabole.",[
    written("1.",String.raw`$y^2+4x=0$.`,String.raw`On isole le carré : $y^2=-4x$. En comparant à $y^2=2ax$, on a $2a=-4$, soit $a=-2$.

`+parabolaConicDetails("x",-2)),
  ],true),
  ex(20,"Une parabole verticale","Déterminer les éléments caractéristiques de la parabole.",[
    written("1.",String.raw`$x^2-3y=0$.`,String.raw`L’équation devient $x^2=3y$. Donc $2a=3$, soit $a=3/2$.

`+parabolaConicDetails("y",1.5)),
  ],true),
  ex(21,"Déplacer le sommet d’une parabole","Déterminer les éléments caractéristiques après réduction.",[
    written("a)",String.raw`$y^2+16x-4y=12$.`,String.raw`On complète $y^2-4y=(y-2)^2-4$. Donc :
$$ (y-2)^2+16x=16,\qquad\boxed{(y-2)^2=-16(x-1).}$$
`+parabolaConicDetails("x",-8,1,2)),
    written("b)",String.raw`$x^2+2x-6y=0$.`,String.raw`Comme $x^2+2x=(x+1)^2-1$, on obtient :
$$ (x+1)^2=6y+1=6\left(y+\frac16\right).$$
`+parabolaConicDetails("y",3,-1,-1/6)),
  ],true),
  ex(22,"Deux ellipses de mêmes demi-axes","Déterminer les éléments caractéristiques.",[
    centralTask("a)",{kind:"ellipse",axis:"x",h:0,k:0,a2:16,b2:9}),
    centralTask("b)",{kind:"ellipse",axis:"y",h:0,k:0,a2:16,b2:9}),
  ],true),
  ex(23,"Deux orientations d’une hyperbole","Déterminer les éléments et les asymptotes.",[
    centralTask("a)",{kind:"hyperbola",axis:"x",h:0,k:0,a2:16,b2:9}),
    centralTask("b)",{kind:"hyperbola",axis:"y",h:0,k:0,a2:16,b2:9}),
  ],true),
  ex(24,"Deux familles, deux centres","Déterminer les éléments caractéristiques des deux courbes.",[
    centralTask("a)",{kind:"ellipse",axis:"y",h:0,k:0,a2:16,b2:9}),
    centralTask("b)",{kind:"hyperbola",axis:"y",h:1,k:-2,a2:9,b2:4}),
  ],true),
  ex(25,"Trouver le bon coefficient de parabole","Déterminer les éléments caractéristiques.",[
    written("a)",String.raw`$2y^2+3x=0$.`,String.raw`On divise par 2 : $y^2=-\frac32x$. Donc $2a=-3/2$ et $a=-3/4$.

`+parabolaConicDetails("x",-.75)),
    written("b)",String.raw`$x^2=-3y$.`,parabolaConicDetails("y",-1.5)),
  ],true),
  ex(26,"Réduire avant de lire le paramètre","Déterminer les éléments caractéristiques.",[
    written("a)",String.raw`$y^2+4x=0$.`,parabolaConicDetails("x",-2)),
    written("b)",String.raw`$2x^2-5y=0$.`,String.raw`On isole $x^2$ : $x^2=\frac52y$. Donc $2a=5/2$ et $a=5/4$.

`+parabolaConicDetails("y",1.25)),
  ],true),
  ex(27,"Un coefficient fractionnaire","Déterminer les éléments caractéristiques.",[
    written("a)",String.raw`$2y^2+7x=0$.`,String.raw`On obtient $y^2=-\frac72x$. Ainsi $a=-7/4$.

`+parabolaConicDetails("x",-1.75)),
    written("b)",String.raw`$x^2=3y$.`,parabolaConicDetails("y",1.5)),
  ],true),
  ex(28,"Réduire et construire une hyperbole",String.raw`On considère $9x^2-16y^2+18x-32y-151=0$.`,[
    written("1.","Donner une équation réduite.",String.raw`On regroupe :
$$9(x^2+2x)-16(y^2+2y)-151=0.$$
Avec $x^2+2x=(x+1)^2-1$ et $y^2+2y=(y+1)^2-1$ :
$$9(x+1)^2-9-16(y+1)^2+16-151=0.$$
Donc $9(x+1)^2-16(y+1)^2=144$ et :
$$\boxed{\frac{(x+1)^2}{16}-\frac{(y+1)^2}{9}=1.}$$`),
    written("2.","Déterminer les éléments caractéristiques.",centralConicDetails({kind:"hyperbola",axis:"x",h:-1,k:-1,a2:16,b2:9})),
    written("3.","Construire la courbe.",String.raw`On place le centre $\Omega(-1;-1)$, puis les sommets $(3;-1)$ et $(-5;-1)$. On trace les asymptotes $y+1=\pm\frac34(x+1)$. Pour $x+1=\pm8$, on trouve $y+1=\pm3\sqrt3$. On complète les deux branches par symétrie de centre $\Omega$.`+plotSteps),
  ],true),
];
