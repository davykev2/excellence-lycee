import { conicsExercise as ex,written,tf } from "./terminalCConicsBuilders";
import { parabolaConicDetails,centralConicDetails } from "./conicSolutions";
import { plotSteps } from "./terminalCConicsBuilders";
export const conicsFixationA=[
  ex(1,"Reconnaître les coniques","Pour chaque équation, indiquer si elle est une équation de conique.",[
    tf("C₁",String.raw`$e^{2x}+y^2-3x+4y-7=0$ est une équation de conique.`,false,String.raw`Le terme $e^{2x}$ n’est pas un terme polynomial du second degré. Cette équation n’est donc pas une équation de conique.`),
    tf("C₂",String.raw`$x^2+y^2-2x+3y-1=0$ est une équation de conique.`,true,"Les termes sont de degré au plus 2 et des termes carrés sont présents. Ici les coefficients de x² et y² sont égaux : après réduction, on obtient un cercle."),
    tf("C₃",String.raw`$x^2+5y-4=0$ est une équation de conique.`,true,"Un seul carré suffit. On peut écrire x²=−5(y−4/5), forme d’une parabole."),
    tf("C₄",String.raw`$2x^2+3y^2-6x+7y-8=0$ est une équation de conique.`,true,"Tous les termes sont de degré au plus 2 et les deux coefficients quadratiques sont non nuls."),
    tf("C₅",String.raw`$6x^2-5y^2+50x-49y+81=0$ est une équation de conique.`,true,"Les carrés ont des signes opposés. Il s’agit bien d’une équation du second degré, même si son centre n’est pas l’origine."),
  ]),
  ex(2,"Reconnaître et normaliser une forme réduite","Parmi les écritures suivantes, relever les formes réduites et, si nécessaire, normaliser l’équation ou préciser l’ensemble obtenu.",[
    written("E₁",String.raw`$x^2+5y-4=0$.`,String.raw`On isole $x^2$ : $x^2=-5(y-4/5)$. Ce n’est pas une forme réduite centrée en $O$ telle qu’elle est écrite, mais une translation de sommet $(0;4/5)$ donne $X^2=-5Y$.`),
    written("E₂",String.raw`$y^2+2x^2+1=0$.`,String.raw`Les carrés sont positifs ou nuls, donc $y^2+2x^2+1\ge1$. L’équation n’a aucun point réel : c’est **l’ensemble vide**, pas une ellipse réelle.`),
    written("E₃",String.raw`$x^2-6y=0$.`,String.raw`On écrit $x^2=6y=2\times3y$. C’est déjà une forme réduite de parabole, de sommet $O$ et de paramètre positif $3$.`),
    written("E₄",String.raw`$\dfrac{x^2}{19}+\dfrac{y^2}{80}=1$.`,String.raw`C’est directement une forme réduite d’ellipse. Le grand axe est vertical car $80>19$.`),
    written("E₅",String.raw`$\dfrac{x^2}{36}-\dfrac{y^2}{49}=-1$.`,String.raw`En multipliant toute l’équation par $-1$, on obtient $-\frac{x^2}{36}+\frac{y^2}{49}=1$. C’est une hyperbole verticale déjà centrée en $O$ ; seule la normalisation du membre droit était nécessaire.`),
    written("E₆",String.raw`$x^2+y^2=36$.`,String.raw`C’est l’équation d’un cercle de centre $O$ et de rayon $6$. En divisant par $36$, on retrouve la forme d’ellipse $\frac{x^2}{36}+\frac{y^2}{36}=1$.`),
  ]),
  ex(3,"Déterminer l’ensemble réel","Déterminer précisément l’ensemble défini par chaque équation.",[
    written("a)",String.raw`$4x^2+y^2-12x+9=0$.`,String.raw`$4x^2-12x+9=4(x-\frac32)^2$. L’équation devient $4(x-\frac32)^2+y^2=0$. La somme de deux carrés s’annule seulement si chacun s’annule : $x=\frac32$ et $y=0$. L’ensemble est le point $\boxed{(3/2;0)}$.`),
    written("b)",String.raw`$4x^2+y^2-4x+1=0$.`,String.raw`On obtient $4(x-\frac12)^2+y^2=0$. Les deux carrés doivent être nuls. L’ensemble est $\boxed{\{(1/2;0)\}}$.`),
    written("c)",String.raw`$9x^2+y^2-6x+5=0$.`,String.raw`$9x^2-6x+5=9(x-\frac13)^2+4$. L’équation demanderait $9(x-\frac13)^2+y^2=-4$, impossible. L’ensemble est $\boxed{\varnothing}$.`),
    written("d)",String.raw`$x^2+3y^2+4x-8=0$.`,String.raw`On complète le carré : $(x+2)^2+3y^2=12$, donc :
$$\frac{(x+2)^2}{12}+\frac{y^2}{4}=1.$$
`+centralConicDetails({kind:"ellipse",axis:"x",h:-2,k:0,a2:12,b2:4})),
  ],true),
  ex(4,"Réduire une équation","Donner une équation réduite et préciser la nature de chaque ensemble.",[
    written("C₁",String.raw`$4x^2+y^2-8x-4y+7=0$.`,String.raw`On remplace $4x^2-8x$ par $4(x-1)^2-4$ et $y^2-4y$ par $(y-2)^2-4$. Ainsi :
$$4(x-1)^2+(y-2)^2=1,$$
soit $\boxed{\frac{(x-1)^2}{1/4}+(y-2)^2=1}$. C’est une ellipse de centre $(1;2)$, de grand axe vertical.`),
    written("C₂",String.raw`$y^2-2x+4=0$.`,String.raw`On isole $y^2$ : $\boxed{y^2=2(x-2)}$. Dans le repère de sommet $(2;0)$, $Y^2=2X$. C’est une parabole ouverte vers la droite.`),
    written("C₃",String.raw`$3x^2-y^2-6x=0$.`,String.raw`$3x^2-6x=3(x-1)^2-3$. On a donc $3(x-1)^2-y^2=3$, soit $\boxed{(x-1)^2-\frac{y^2}{3}=1}$. C’est une hyperbole de centre $(1;0)$ et d’axe focal horizontal.`),
    written("C₄",String.raw`$2x^2-y^2-4x+3=0$.`,String.raw`On obtient $2(x-1)^2-y^2=-1$. On multiplie par $-1$ :
$$\boxed{-\frac{(x-1)^2}{1/2}+y^2=1.}$$
C’est une hyperbole de centre $(1;0)$ et d’axe focal vertical.`),
  ],true),
  ex(5,"Construire deux paraboles","Construire les paraboles suivantes dans un repère orthonormé.",[
    written("a)",String.raw`$x^2=3y$.`,parabolaConicDetails("y",1.5)+String.raw`

On calcule $y=x^2/3$ : pour $x=0,\pm1,\pm3$, on obtient $y=0,1/3,3$. On place ces points puis on utilise la symétrie par rapport à $(Oy)$.`+plotSteps),
    written("b)",String.raw`$y^2=-\frac12x$.`,parabolaConicDetails("x",-.25)+String.raw`

On isole $x=-2y^2$. Pour $y=0,\pm1,\pm2$, on trouve $x=0,-2,-8$. Les points de même abscisse sont symétriques par rapport à $(Ox)$.`+plotSteps),
  ],true),
  ex(6,"Éléments d’une parabole","Pour chaque équation, donner le sommet, le paramètre, le foyer, la directrice et l’axe.",[
    written("a)",String.raw`$x^2-2y=0$.`,parabolaConicDetails("y",1)),
    written("b)",String.raw`$y^2+3x=0$.`,parabolaConicDetails("x",-1.5)),
    written("c)",String.raw`$x^2+4y=0$.`,parabolaConicDetails("y",-2)),
  ],true),
];
