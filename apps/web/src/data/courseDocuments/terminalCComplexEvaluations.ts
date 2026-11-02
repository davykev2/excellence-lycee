import type { CourseEvaluationGroup } from "../../domain/courseDocument";
export const complexEvaluations:CourseEvaluationGroup[]=[
 {id:"complex-evaluation-quadratic",title:"Résoudre une équation du second degré dans ℂ",pages:[136],
 method:String.raw`Pour $az^2+bz+c=0$, avec $a\ne0$, calculer $\Delta=b^2-4ac$. Chercher $\delta$ tel que $\delta^2=\Delta$. Les solutions sont $(-b-\delta)/(2a)$ et $(-b+\delta)/(2a)$. Si $\Delta=0$, elles sont confondues. Pour un polynôme de degré supérieur, chercher une factorisation avant d’utiliser cette méthode.`,
 examples:[{id:"complex-eval-quadratic-model",title:"Un discriminant non réel",prompt:String.raw`Résoudre $z^2+(3i-4)z+1-7i=0$.`,
 solution:String.raw`**1. Calculer le discriminant.**
$$\Delta=(3i-4)^2-4(1-7i)=7-24i-4+28i=3+4i.$$

**2. Déterminer une racine carrée.** Pour $\delta=x+iy$, on a $x^2+y^2=5$, $x^2-y^2=3$ et $xy=2$. Donc $x^2=4$, $y^2=1$ et les signes sont les mêmes : $\delta=2+i$ convient.

**3. Calculer les solutions.**
$$z_1=\frac{4-3i-(2+i)}2=1-2i,$$
$$z_2=\frac{4-3i+(2+i)}2=3-i.$$
Ainsi $\boxed{S=\{1-2i;\ 3-i\}}$.`}],
 questions:[],writtenTasks:[
 {id:"complex-eval-quartic",topicId:"complex-square-roots",prompt:String.raw`On pose $P(z)=z^4+z^3+5z^2+2z+6$. a) Justifier que $i\sqrt2$ est une racine. b) Trouver $a,b,c$ tels que $P(z)=(z^2+2)(az^2+bz+c)$. c) Résoudre $P(z)=0$.`,
 model:String.raw`**a)** Pour $z=i\sqrt2$, on a $z^2=-2$, $z^3=-2i\sqrt2$, $z^4=4$. Ainsi $P(z)=4-2i\sqrt2-10+2i\sqrt2+6=0$.

**b)** En développant :
$$(z^2+2)(az^2+bz+c)=az^4+bz^3+(c+2a)z^2+2bz+2c.$$
L’identification donne $a=1$, $b=1$, $c=3$. On retrouve bien les coefficients $5,2,6$.

**c)** $P(z)=(z^2+2)(z^2+z+3)$. Le premier facteur donne $z=\pm i\sqrt2$. Pour le second, $\Delta=1-12=-11$ et $\delta=i\sqrt{11}$ :
$$\boxed{S=\left\{i\sqrt2;-i\sqrt2;\frac{-1+i\sqrt{11}}2;\frac{-1-i\sqrt{11}}2\right\}.}$$`,
 criteria:["Je vérifie la racine par substitution.","Je développe et identifie les coefficients.","Je résous les deux facteurs et donne les quatre racines."],nativeFigure:{kind:"complex",preset:"eval-quartic"}}
 ]},
 {id:"complex-evaluation-linearization",title:"Linéariser une expression trigonométrique",pages:[136,137],
 method:String.raw`Remplacer cosinus et sinus par leurs expressions d’Euler. Élever à la puissance puis développer avec le binôme. Regrouper les exponentielles opposées pour retrouver des cosinus ou sinus d’angles multiples. Conserver le facteur $(2i)^n$ avec son signe. Vérifier le résultat en une valeur simple de $x$.`,
 examples:[{id:"complex-eval-linearization-model",title:"Un produit de puissances",prompt:String.raw`Linéariser $\cos^3x\sin^2x$.`,
 solution:String.raw`On utilise $\cos^3x=(3\cos x+\cos3x)/4$ et $\sin^2x=(1-\cos2x)/2$.
$$\cos^3x\sin^2x=\frac{3\cos x+\cos3x-3\cos x\cos2x-\cos3x\cos2x}8.$$
Or $2\cos x\cos2x=\cos3x+\cos x$ et $2\cos3x\cos2x=\cos5x+\cos x$. Après regroupement :
$$\boxed{\cos^3x\sin^2x=\frac{2\cos x-\cos3x-\cos5x}{16}.}$$
Pour $x=0$, les deux membres valent $0$, ce qui vérifie au moins les constantes et les signes de ce cas. Ces deux formules de produit découlent aussi d’Euler.`}],
 questions:[],writtenTasks:[
 {id:"complex-eval-linearization-1",topicId:"complex-euler-linearization",prompt:String.raw`1) Linéariser $\cos^3x$.`,model:String.raw`Par Euler :
$$8\cos^3x=e^{3ix}+3e^{ix}+3e^{-ix}+e^{-3ix}.$$
On regroupe les termes conjugués : $8\cos^3x=2\cos3x+6\cos x$. Donc $\boxed{\cos^3x=(\cos3x+3\cos x)/4}$.`,criteria:["Je développe le cube.","Je regroupe les termes opposés.","Je conserve le facteur 1/4."]},
 {id:"complex-eval-linearization-2",topicId:"complex-euler-linearization",prompt:String.raw`2) Linéariser $\sin^2x\cos^3x$.`,model:String.raw`Le produit est le même que dans l’exemple, car la multiplication est commutative. Avec les formules de réduction :
$$\sin^2x\cos^3x=\frac{(1-\cos2x)(3\cos x+\cos3x)}8.$$
Puis $2\cos a\cos b=\cos(a+b)+\cos(a-b)$ :
$$\boxed{\sin^2x\cos^3x=\frac{2\cos x-\cos3x-\cos5x}{16}.}$$`,criteria:["Je reconnais le même produit que dans l’exemple.","Je justifie les regroupements."]},
 {id:"complex-eval-linearization-3",topicId:"complex-euler-linearization",prompt:String.raw`3) Linéariser $\cos^4x$.`,model:String.raw`$\cos^4x=(\frac{1+\cos2x}{2})^2$. En développant et en utilisant $\cos^2(2x)=(1+\cos4x)/2$ :
$$\cos^4x=\frac14\left(1+2\cos2x+\frac{1+\cos4x}2\right)
=\boxed{\frac{3+4\cos2x+\cos4x}{8}}.$$`,criteria:["Je réduis d’abord une puissance paire.","Je remplace encore le carré restant."]},
 {id:"complex-eval-linearization-4",topicId:"complex-euler-linearization",prompt:String.raw`4) Linéariser $\sin^5x$.`,model:String.raw`Le développement d’Euler donne :
$$32i\sin^5x=(e^{5ix}-e^{-5ix})-5(e^{3ix}-e^{-3ix})+10(e^{ix}-e^{-ix}).$$
On remplace chaque différence par $2i$ fois un sinus et on divise par $32i$ :
$$\boxed{\sin^5x=\frac{\sin5x-5\sin3x+10\sin x}{16}.}$$`,criteria:["Je tiens compte de (2i)^5=32i.","Je conserve les signes alternés."]}
 ]},
 {id:"complex-evaluation-geometry",title:"Étudier une configuration géométrique",pages:[137,138],
 method:String.raw`Choisir la propriété correspondant à la question : différence d’affixes pour un vecteur, module pour une distance, quotient pour un angle, réel pour l’alignement, imaginaire pur pour l’orthogonalité, égalité des distances pour une médiatrice ou un cercle. Vérifier les points distincts et les dénominateurs avant de diviser.`,
 statement:String.raw`Pour l’exemple, on donne $A(2)$, $B(5)$, $C(5+3i)$, $D(2+3i)$, $E(\frac72+\frac{3\sqrt3}2i)$ et $F(\frac{11}4+i(\frac32+\frac{3\sqrt3}4))$.`,
 examples:[{id:"complex-eval-geometry-model",title:"Carré, triangle et alignement",prompt:"1) Justifier que ABCD est un carré. 2) Déterminer la nature de AEB. 3) Montrer que D,E,F sont alignés.",parts:[
 {id:"complex-eval-square",label:"1.",prompt:"ABCD est un carré.",solution:String.raw`$z_B-z_A=3=z_C-z_D$ : les côtés opposés ont le même vecteur, donc ABCD est un parallélogramme. Ensuite $z_D-z_A=3i$ : les deux côtés issus de A ont même longueur $3$ et sont perpendiculaires, car $3/(3i)=-i$. C’est donc un **carré**. L’angle orienté $(\overrightarrow{AB};\overrightarrow{AD})$ vaut $+\pi/2$.`},
 {id:"complex-eval-equilateral",label:"2.",prompt:"Nature de AEB.",solution:String.raw`$\frac{z_E-z_A}{z_B-z_A}=\frac12+i\frac{\sqrt3}2=e^{i\pi/3}$. Le module vaut $1$, donc $AE=AB$, et l’angle en A vaut $60^\circ$. Ainsi AEB est **équilatéral**.`},
 {id:"complex-eval-aligned",label:"3.",prompt:"D,E,F sont alignés.",solution:String.raw`On calcule :
$$z_D-z_E=-\frac32+i\left(3-\frac{3\sqrt3}2\right),$$
$$z_F-z_E=-\frac34+i\left(\frac32-\frac{3\sqrt3}4\right)=\frac12(z_D-z_E).$$
Ce dernier vecteur est un multiple réel de l’autre : les points sont alignés. Plus précisément, F est le milieu de [ED].`}
 ],nativeFigure:{kind:"complex",preset:"eval-geometry"}}],questions:[],writtenTasks:[
 {id:"complex-eval-geometry-application",topicId:"complex-geometric-criteria",prompt:String.raw`On donne $z_A=3+6i$, $z_B=-1-2i$, $z_C=-3+4i$. 1) Justifier que O,A,B sont alignés. 2) Montrer que A,B,C sont sur un cercle de centre E(1;2), et calculer son rayon. 3) Trouver D tel que B soit le symétrique de D par rapport à A. 4) Déterminer le lieu $\arg((z-1+2i)/(z-2))=\pi/2+k\pi$.`,
 model:String.raw`**1.** $z_B=-z_A/3$ : les vecteurs $\overrightarrow{OA}$ et $\overrightarrow{OB}$ sont colinéaires.

**2.** Les vecteurs depuis E ont pour affixes $2+4i$, $-2-4i$ et $-4+2i$. Leurs modules valent tous $\sqrt{20}=2\sqrt5$. Les trois points appartiennent donc au cercle $\boxed{\mathcal C(E;2\sqrt5)}$.

**3.** A est le milieu de [BD], donc $z_D=2z_A-z_B=6+12i+1+2i=\boxed{7+14i}$.

**4.** L’argument impose $z\ne2$ et $z\ne1-2i$. Le quotient doit être imaginaire pur non nul. Les directions de M vers les points d’affixes $1-2i$ et $2$ sont donc perpendiculaires : M décrit le cercle de ce diamètre, privé des deux extrémités.
Son centre est $(3/2;-1)$ et son rayon $\sqrt5/2$ :
$$\boxed{(x-\tfrac32)^2+(y+1)^2=\tfrac54,\quad M\notin\{(1;-2),(2;0)\}.}$$`,
 criteria:["Je justifie les trois distances au centre E.","Je traduis correctement la symétrie centrale.","Je distingue angle modulo π et modulo 2π.","J’exclus les deux points où le quotient ou son argument n’est pas défini."],nativeFigure:{kind:"complex",preset:"eval-application"}}
 ]},
];
