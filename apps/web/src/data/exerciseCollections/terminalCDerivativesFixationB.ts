import { choice, short, tf, written } from "./builders";
import { derivativeExercise as ex } from "./terminalCDerivativesBuilders";
const r = String.raw;

export const derivativesFixationB = [
  ex(13, "Compléter l’inégalité des accroissements finis", r`Complète la propriété en choisissant chaque expression manquante.

Soit $f$ une **(1)** sur un intervalle ouvert $I$, **(2)** deux éléments de $I$ tels que **(3)**. S’il existe deux réels **(4)** tels que, pour tout **(5)**, on ait **(6)**, alors **(7)** $\le f(b)-f(a)\le$ **(8)**.`, [
    choice("1.", "Nature de f", ["fonction dérivable", "suite numérique", "fonction constante uniquement"], 0, "La dérivabilité sur l’intervalle est l’hypothèse qui permet d’utiliser la propriété.", "select"),
    choice("2.", "Deux éléments de I", ["a et b", "m et M", "f et f′"], 0, "Les nombres a et b sont les deux points entre lesquels on étudie l’accroissement.", "select"),
    choice("3.", "Ordre des deux points", ["a < b", "a > b", "a = b obligatoirement"], 0, "On choisit a < b pour que b − a soit positif et que l’ordre des bornes soit conservé.", "select"),
    choice("4.", "Noms des deux bornes de la dérivée", ["m et M", "a et b", "f(a) et f(b)"], 0, "Les réels m et M encadrent les valeurs de la dérivée entre a et b.", "select"),
    choice("5.", "Variable et intervalle", ["x appartenant à [a ; b]", "x hors de I", "x = a uniquement"], 0, "Il faut contrôler la dérivée en tout point de l’intervalle étudié, pas seulement aux extrémités.", "select"),
    choice("6.", "Encadrement de la dérivée", ["m ≤ f′(x) ≤ M", "m ≤ f(x) ≤ M", "a ≤ f′(x) ≤ b"], 0, "L’hypothèse porte bien sur f′. Elle donnera un encadrement de l’accroissement de f.", "select"),
    choice("7.", "Borne inférieure de l’accroissement", ["m(b − a)", "m(b + a)", "m/(b − a)"], 0, r`L’inégalité complète est $m(b-a)\le f(b)-f(a)\le M(b-a)$.`, "select"),
    choice("8.", "Borne supérieure de l’accroissement", ["M(b − a)", "M(b + a)", "M/(b − a)"], 0, r`On multiplie les deux bornes de la dérivée par la longueur positive $b-a$.`, "select"),
  ]),
  ex(14, "Appliquer un encadrement de la dérivée", r`Soit $f$ dérivable sur $[0;+\infty[$ et $a>0$. On suppose $f(0)=0$ et :

$$\frac13\le f'(x)\le\frac12\quad\text{pour tout }x\in[0;a].$$

Justifie que $a/3\le f(a)\le a/2$.`, [
    written("Démonstration", "Applique l’inégalité des accroissements finis entre 0 et a.", r`La fonction est dérivable sur l’intervalle étudié et sa dérivée est encadrée par $m=1/3$ et $M=1/2$. L’inégalité des accroissements finis donne :

$$\frac13(a-0)\le f(a)-f(0)\le\frac12(a-0).$$

Comme $f(0)=0$, on obtient directement :

$$\boxed{\frac a3\le f(a)\le\frac a2.}$$`),
  ]),
  ex(15, "Majorer le sinus", r`Démontre, à l’aide de l’inégalité des accroissements finis, que $|\sin x|\le|x|$ pour tout réel $x$.`, [
    written("Démonstration", "Précise la fonction, l’intervalle et la borne de sa dérivée.", r`On choisit $f(t)=\sin t$. Elle est dérivable sur $\mathbb R$ et $f'(t)=\cos t$, donc $|f'(t)|\le1$.

Si $x>0$, on applique l’inégalité sur $[0;x]$. Si $x<0$, on l’applique sur $[x;0]$. Dans les deux cas :

$$|f(x)-f(0)|\le1\times|x-0|.$$

Or $f(0)=0$. **Donc $|\sin x|\le|x|$.** Pour $x=0$, les deux membres sont nuls : l’inégalité est encore vraie.`),
  ]),
  ex(16, "Reconnaître graphiquement un point d’inflexion", r`Parmi les trois figures, identifie celle sur laquelle $A$ est un point d’inflexion de la courbe.`, [
    choice("Réponse", "Choisis la figure.", ["Figure 1", "Figure 2", "Figure 3"], 0, r`Sur la **figure 1**, la courbe traverse sa tangente en $A$ : elle se trouve d’un côté de cette droite avant $A$ et de l’autre après $A$. Sur les figures 2 et 3, la courbe reste du même côté de sa tangente au voisinage de $A$. **La réponse est Figure 1.**`),
  ], { figureKey: "tc-l2-inflection" }),
  ex(17, "Trouver le point d’inflexion d’un polynôme", r`Soit $f(x)=-x^3+3x^2-2$ sur $\mathbb R$. Détermine un point d’inflexion de sa courbe.`, [
    short("a)", "Donne son abscisse.", "$1$", ["1"], r`On calcule $f'(x)=-3x^2+6x$, puis $f''(x)=-6x+6=6(1-x)$. Cette expression s’annule en $x=1$ et change de signe : positive avant $1$, négative après. **L’abscisse est $1$.**`),
    short("b)", "Donne son ordonnée.", "$0$", ["0"], r`On remplace l’abscisse dans la fonction initiale : $f(1)=-1+3-2=0$. **Le point d’inflexion est $A(1;0)$.**`),
    written("c)", "Rédige la justification du changement de signe.", r`La fonction polynôme est deux fois dérivable sur $\mathbb R$.

| $x$ | $]-\infty;1[$ | $1$ | $]1;+\infty[$ |
| --- | --- | --- | --- |
| $f''(x)=6(1-x)$ | $+$ | $0$ | $-$ |

La dérivée seconde s’annule **en changeant de signe**. Comme $f(1)=0$, la courbe possède un point d’inflexion en **$A(1;0)$**.`),
  ]),
  ex(18, "Point d’inflexion : vrai ou faux", r`La fonction $f$ est deux fois dérivable sur un intervalle $I$. Indique Vrai ou Faux.`, [
    tf("1.", r`Si $f''(a)=0$, alors $A(a;f(a))$ est nécessairement un point d’inflexion.`, false, r`L’annulation seule ne suffit pas. Pour $f(x)=x^4$, on a $f''(0)=0$, mais $f''(x)=12x^2$ ne change pas de signe et la courbe ne traverse pas sa tangente. **Faux.**`),
    tf("2.", r`Si $f''<0$ avant $a$, $f''(a)=0$ et $f''>0$ après $a$, alors $A(a;f(a))$ est un point d’inflexion.`, true, r`La dérivée seconde s’annule en changeant de signe. C’est la propriété permettant de conclure à un point d’inflexion. **Vrai.**`),
    tf("3.", r`Si $f''$ s’annule en $a$ et garde un signe constant, alors $A(a;f(a))$ est un point d’inflexion.`, false, r`Il manque justement le changement de signe. Le contre-exemple $x^4$ montre qu’un zéro de $f''$ sans changement de signe ne suffit pas. **Faux.**`),
    tf("4.", r`Si la courbe traverse sa tangente en $A(a;f(a))$, alors $A$ est un point d’inflexion.`, true, r`C’est la caractérisation géométrique du point d’inflexion utilisée dans le cours. **Vrai.**`),
  ]),
  ex(19, "Dérivée de la réciproque : conditions et pièges", r`Soit $g$ dérivable et bijective d’un intervalle $I$ sur $J$. On choisit un point intérieur $x_0\in I$ et l’on pose $y_0=g(x_0)$. La réciproque est notée $g^{-1}$. Indique Vrai ou Faux.`, [
    tf("1.", r`Sans autre condition, $(g^{-1})'(y_0)=1/g'(x_0)$.`, false, r`Il faut vérifier **$g'(x_0)\ne0$**. Par exemple, $g(x)=x^3$ est bijective, mais $g'(0)=0$ et sa réciproque n’a pas de nombre dérivé fini en $0$. **Faux.**`),
    tf("2.", r`Si $(g^{-1})'(y_0)$ existe et n’est pas nul, alors $g'(x_0)=1/(g^{-1})'(y_0)$.`, true, r`En dérivant $g^{-1}\circ g=\operatorname{id}$ en $x_0$, on obtient $(g^{-1})'(y_0)g'(x_0)=1$. On peut diviser par la dérivée inverse non nulle. **Vrai.**`),
    tf("3.", r`Si $g'(x_0)=0$, la réciproque n’a pas de nombre dérivé réel en $y_0$.`, true, r`Si ce nombre dérivé réel existait, la dérivée de $g^{-1}\circ g$ vaudrait $0$, alors que cette composée est l’identité, de dérivée $1$. C’est impossible. **Vrai.**`),
    tf("4.", r`Lorsque $y_0\in I$, la seule condition $g'(y_0)\ne0$ suffit à rendre $g^{-1}$ dérivable en $y_0$.`, false, r`La dérivée à vérifier est celle au point **$x_0=g^{-1}(y_0)$**, pas au point $y_0$. Par exemple, $g(x)=(x-1)^3+2$ : pour $x_0=1$, $y_0=2$ et $g'(2)=3$, mais la réciproque n’a pas de dérivée réelle en $2$, car $g'(1)=0$. **Faux.**`),
  ]),
  ex(20, "Calculer la dérivée inverse avec deux valeurs données", r`La fonction $f$ est une bijection dérivable de $[0;\pi/2]$ sur $[0;1]$. On donne $f(\pi/6)=1/2$ et $f'(\pi/6)=\sqrt3/2$. Justifie la dérivabilité de $f^{-1}$ en $1/2$, puis calcule son nombre dérivé.`, [
    short("Résultat", r`Calcule $(f^{-1})'(1/2)$.`, "$2\\sqrt3/3$", ["2*sqrt(3)/3", "2/sqrt(3)"], r`L’antécédent de $1/2$ est $\pi/6$. La dérivée en cet antécédent vaut $\sqrt3/2\ne0$ : la réciproque est donc dérivable en $1/2$.

$$(f^{-1})'(1/2)=\frac1{f'(\pi/6)}=\frac1{\sqrt3/2}=\frac2{\sqrt3}.$$

En multipliant numérateur et dénominateur par $\sqrt3$, on obtient **$2\sqrt3/3$**.`),
  ]),
  ex(21, "Retrouver l’antécédent avant de dériver la réciproque", r`La fonction $g(x)=(x-1)/(2x+1)$ est bijective de $[0;1]$ sur $[-1;0]$. On admet $g'(x)=3/(2x+1)^2$. Calcule $(g^{-1})'(-1/3)$.`, [
    short("a)", r`Détermine $g^{-1}(-1/3)$.`, "$2/5$", ["2/5", "0,4"], r`On résout $(x-1)/(2x+1)=-1/3$. Sur $[0;1]$, le dénominateur n’est pas nul, donc :

$$3(x-1)=-(2x+1)\iff5x=2\iff x=\frac25.$$

La valeur appartient bien à $[0;1]$. **Donc $g^{-1}(-1/3)=2/5$.**`),
    short("b)", r`Calcule $(g^{-1})'(-1/3)$.`, "$27/25$", ["27/25", "1,08"], r`Au point $2/5$, on a $2x+1=9/5$, donc :

$$g'(2/5)=\frac3{(9/5)^2}=\frac{25}{27}\ne0.$$

La formule de la réciproque donne **$(g^{-1})'(-1/3)=27/25$**.`),
  ]),
  ex(22, "Encadrer une racine par les accroissements finis", r`Détermine un encadrement de $\sqrt{1001}$ à l’aide de l’inégalité des accroissements finis.`, [
    written("Encadrement", "Choisis un intervalle et encadre la dérivée de la racine carrée.", r`On choisit $f(t)=\sqrt t$ sur $[1000;1001]$. Comme $31^2<1000\le t\le1001<32^2$, on a $31<\sqrt t<32$, donc :

$$\frac1{64}<f'(t)=\frac1{2\sqrt t}<\frac1{62}.$$

La longueur de l’intervalle vaut $1$. L’inégalité des accroissements finis entraîne :

$$\frac1{64}\le\sqrt{1001}-\sqrt{1000}\le\frac1{62}.$$

Or $\sqrt{1000}=10\sqrt{10}$. Un encadrement valable est donc :

$$\boxed{10\sqrt{10}+\frac1{64}\le\sqrt{1001}\le10\sqrt{10}+\frac1{62}.}$$

D’autres bornes correctes obtenues par la même méthode sont possibles.`),
  ]),
  ex(23, "Encadrer la tangente sur un petit intervalle", r`Soit $g(x)=\tan x$ sur $[0;\pi/4]$.`, [
    written("1.", r`Démontre que $1\le g'(x)\le2$ sur $[0;\pi/4]$.`, r`On a $g'(x)=1/\cos^2x$. Sur l’intervalle étudié, $\sqrt2/2\le\cos x\le1$. Les nombres étant positifs, on élève au carré : $1/2\le\cos^2x\le1$. En passant aux inverses, on renverse l’ordre : **$1\le g'(x)\le2$**.`),
    written("2.", r`Déduis-en que $x\le\tan x\le2x$ sur $[0;\pi/4]$.`, r`Pour $x>0$, on applique l’inégalité des accroissements finis sur $[0;x]$ avec les bornes $1$ et $2$ :

$$1(x-0)\le g(x)-g(0)\le2(x-0).$$

Comme $g(0)=0$, **$x\le\tan x\le2x$**. En $0$, les trois quantités valent $0$.`),
  ]),
  ex(24, "Encadrer une racine composée", r`Démontre que, pour tout $x\in[0;1/2]$ :

$$1+\frac{x}{\sqrt6}\le\sqrt{1+x}\le1+\frac x2.$$`, [
    written("Démonstration", "Encadre la dérivée, puis applique l’inégalité entre 0 et x.", r`On pose $f(t)=\sqrt{1+t}$, dérivable sur $[0;1/2]$, avec $f'(t)=1/(2\sqrt{1+t})$.

Pour $0\le t\le1/2$, on a $1\le1+t\le3/2$, puis :

$$\frac1{\sqrt6}\le f'(t)\le\frac12.$$

Pour $x>0$, l’inégalité des accroissements finis sur $[0;x]$ donne :

$$\frac{x}{\sqrt6}\le f(x)-f(0)\le\frac x2.$$

Comme $f(0)=1$, on ajoute $1$ aux trois membres pour obtenir l’encadrement demandé. En $x=0$, on a l’égalité.`),
  ]),
  ex(25, "Étudier un point fixe et une contraction", r`Sur $[1;+\infty[$, on définit $h(x)=1+1/\sqrt x$.`, [
    written("1.a)", "Dresse le tableau de variation de h.", r`On dérive $h(x)=1+x^{-1/2}$ :

$$h'(x)=-\frac1{2x^{3/2}}<0.$$

La fonction est strictement décroissante, avec $h(1)=2$ et $\lim_{x\to+\infty}h(x)=1$.

| $x$ | $1$ | | $+\infty$ |
| --- | --- | --- | --- |
| $h'(x)$ | | $-$ | |
| $h(x)$ | $2$ | $\searrow$ | $1$ |`),
    written("1.b)", r`Justifie que $h(x)=x$ admet une unique solution $\alpha$ sur $[1;+\infty[$.`, r`On étudie $k(x)=h(x)-x$, continue et dérivable sur l’intervalle. On a $k'(x)=h'(x)-1<0$ : elle est strictement décroissante.

De plus, $k(1)=1>0$ et $k(2)=-1+1/\sqrt2<0$. Le théorème des valeurs intermédiaires donne une solution dans $]1;2[$ ; la stricte décroissance assure l’unicité sur tout $[1;+\infty[$. **Il existe une unique solution $\alpha\in]1;2[$.**`),
    written("2.a)", r`Démontre que $|h'(x)|\le1/2$ pour $x\ge1$.`, r`Pour $x\ge1$, $x^{3/2}\ge1$. Par conséquent :

$$|h'(x)|=\frac1{2x^{3/2}}\le\frac12.$$`),
    written("2.b)", r`Déduis-en que $|h(x)-\alpha|\le\tfrac12|x-\alpha|$ pour $x\ge1$.`, r`Les deux points $x$ et $\alpha$ appartiennent à $[1;+\infty[$. On applique l’inégalité des accroissements finis sur l’intervalle qui les relie, où $|h'|\le1/2$ :

$$|h(x)-h(\alpha)|\le\frac12|x-\alpha|.$$

La relation de point fixe donne $h(\alpha)=\alpha$. **Donc $|h(x)-\alpha|\le\tfrac12|x-\alpha|$.**`),
  ]),
];
