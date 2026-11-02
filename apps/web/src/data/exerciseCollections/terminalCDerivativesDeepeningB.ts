import { short, written } from "./builders";
import { derivativeExercise as ex } from "./terminalCDerivativesBuilders";
const r = String.raw;
const graph = { correctionFigureKey: "tc-l2-functions" as const };

export const derivativesDeepeningB = [
  ex(36, "Dériver et préciser l’ensemble de dérivabilité", r`Détermine la dérivée de chacune des fonctions suivantes et son ensemble de dérivabilité. Dans le dernier cas, la puissance $u^{2/3}$ est le carré de la racine cubique réelle : $(\sqrt[3]u)^2$ pour $u\in\mathbb R$.`, [
    written("1.", r`$f(x)=\tfrac13x^3+3x^2-\tfrac34x-5$.`, r`C’est un polynôme : il est dérivable sur $\mathbb R$. On dérive chaque terme :

$$\boxed{f'(x)=x^2+6x-\frac34.}$$`),
    written("2.", r`$f(x)=3x-4+2/(2x+7)$.`, r`Il faut $2x+7\ne0$. Sur $\mathbb R\setminus\{-7/2\}$, on utilise $(1/u)'=-u'/u^2$, avec $u'=2$ :

$$\boxed{f'(x)=3-\frac4{(2x+7)^2}.}$$`),
    written("3.", r`$f(x)=2x-\cos x$.`, r`Les deux termes sont dérivables sur $\mathbb R$. Comme $(\cos x)'=-\sin x$, les deux signes moins se compensent : **$f'(x)=2+\sin x$**.`),
    written("4.", r`$f(x)=(3x^2-x+2)/(3x-1)$.`, r`La fonction est dérivable sur $\mathbb R\setminus\{1/3\}$. La règle du quotient donne :

$$f'(x)=\frac{(6x-1)(3x-1)-3(3x^2-x+2)}{(3x-1)^2}.$$

On développe le numérateur : $18x^2-9x+1-9x^2+3x-6=9x^2-6x-5$.

$$\boxed{f'(x)=\frac{9x^2-6x-5}{(3x-1)^2}.}$$`),
    written("5.", r`$f(x)=\sqrt{(2-x)/(2+x)}$.`, r`Le quotient doit être positif ou nul et son dénominateur non nul. Un tableau de signes donne $D_f=]-2;2]$.

Sur $]-2;2[$, on pose $u=(2-x)/(2+x)>0$. On calcule $u'=-4/(2+x)^2$, puis :

$$\boxed{f'(x)=-\frac2{(2+x)^2\sqrt{(2-x)/(2+x)}}.}$$

En $2$, le taux à gauche vaut $-1/(\sqrt{2-x}\sqrt{2+x})$ et tend vers $-\infty$ : il n’y a pas de nombre dérivé réel à cette extrémité. **L’ensemble de dérivabilité est $]-2;2[$.**`),
    written("6.", r`$f(x)=\cos^3(x^2-2x)$.`, r`On dérive deux compositions successives. Posons $u=x^2-2x$, donc $u'=2x-2$. La fonction est dérivable sur $\mathbb R$ et :

$$f'(x)=3\cos^2u\,(-\sin u)\,u'.$$

**Ainsi $f'(x)=-6(x-1)\sin(x^2-2x)\cos^2(x^2-2x)$.**`),
    written("7.", r`$f(x)=x\sqrt{3x-2}$.`, r`Le domaine est $[2/3;+\infty[$. Sur $]2/3;+\infty[$, la règle du produit donne :

$$f'(x)=\sqrt{3x-2}+\frac{3x}{2\sqrt{3x-2}}.$$

En mettant au même dénominateur, on obtient **$f'(x)=(9x-4)/(2\sqrt{3x-2})$**.

Pour l’extrémité, on a $f(2/3)=0$. Pour $x>2/3$, on utilise $3x-2=3(x-2/3)$ :

$$\frac{f(x)-f(2/3)}{x-2/3}=\frac{x\sqrt{3x-2}}{x-2/3}=\frac{3x}{\sqrt{3x-2}}.$$

Le numérateur tend vers $2$ et le dénominateur vers $0$ en restant positif : le taux tend vers $+\infty$. Le nombre dérivé réel n’existe donc pas en $2/3$. **L’ensemble de dérivabilité est $]2/3;+\infty[$.**`),
    written("8.", r`$f(x)=\bigl((2x-1)/(x+1)\bigr)^{2/3}$.`, r`Avec la convention indiquée, la fonction est définie pour tout $x\ne-1$. Posons $u=(2x-1)/(x+1)$ : on obtient $u'=3/(x+1)^2$.

Lorsque $u\ne0$, donc $x\ne1/2$, on a :

$$f'(x)=\frac23u^{-1/3}u'
=\frac2{(x+1)^2\sqrt[3]{(2x-1)/(x+1)}}.$$

En $x=1/2$, posons $t=x-1/2$. Le taux vaut $2^{2/3}|t|^{2/3}/(t(3/2+t)^{2/3})$ : il tend vers $-\infty$ à gauche et $+\infty$ à droite.

**L’ensemble de dérivabilité est $\mathbb R\setminus\{-1;1/2\}$.**`),
  ]),
  ex(37, "Dérivée d’une fraction définie sur R", r`Soit $g(x)=(2x^2+1)/(x^2+3)$.`, [
    written("1.", "Détermine le domaine.", r`Pour tout réel $x$, $x^2+3\ge3>0$. **$D_g=\mathbb R$.**`),
    written("2.", "Calcule la dérivée et précise où elle existe.", r`Un quotient de polynômes est dérivable là où son dénominateur ne s’annule pas, donc ici sur $\mathbb R$.

$$g'(x)=\frac{4x(x^2+3)-2x(2x^2+1)}{(x^2+3)^2}.$$

Le numérateur vaut $4x^3+12x-4x^3-2x=10x$, donc **$g'(x)=10x/(x^2+3)^2$**.`),
    short("3.a)", r`Calcule $g'(-2)$.`, "$-20/49$", ["-20/49"], r`On remplace $x$ par $-2$ : $g'(-2)=10(-2)/(4+3)^2=\boxed{-20/49}$.`),
    short("3.b)", r`Calcule $g'(3)$.`, "$5/24$", ["5/24", "30/144"], r`On remplace $x$ par $3$ : $g'(3)=30/(9+3)^2=30/144=\boxed{5/24}$.`),
    written("4.", "Détermine la tangente au point d’abscisse −2.", r`On calcule $g(-2)=(8+1)/(4+3)=9/7$. La tangente vérifie :

$$y=\frac97-\frac{20}{49}(x+2).$$

Après réduction au dénominateur $49$, **$y=-20x/49+23/49$**.`),
  ], graph),
  ex(38, "Variations et extremums d’un polynôme", r`Soit $f(x)=x^3-\tfrac12x^2-2x+1$.`, [
    written("1.", "Donne le domaine.", r`Un polynôme est défini sur tous les réels. **$D_f=\mathbb R$.**`),
    written("2.", "Calcule les limites aux bornes du domaine.", r`Le terme dominant est $x^3$. On peut écrire $f(x)=x^3(1-1/(2x)-2/x^2+1/x^3)$ pour $x\ne0$ ; le facteur entre parenthèses tend vers $1$.

**Les limites sont $-\infty$ en $-\infty$ et $+\infty$ en $+\infty$.**`),
    written("3.", "Étudie le signe de la dérivée.", r`On calcule :

$$f'(x)=3x^2-x-2=(3x+2)(x-1).$$

Les racines sont $-2/3$ et $1$. Le coefficient dominant est positif : la dérivée est positive à l’extérieur de ces racines et négative entre elles.`),
    written("4.", "Déduis les variations et dresse le tableau.", r`On remplace les deux abscisses dans $f$ : $f(-2/3)=49/27$ et $f(1)=-1/2$.

| $x$ | $-\infty$ | | $-2/3$ | | $1$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |
| $f(x)$ | $-\infty$ | $\nearrow$ | $49/27$ | $\searrow$ | $-1/2$ | $\nearrow$ | $+\infty$ |`),
    written("5.", "Détermine les extremums relatifs.", r`En $-2/3$, la dérivée passe de $+$ à $-$ : **maximum local $49/27$**. En $1$, elle passe de $-$ à $+$ : **minimum local $-1/2$**. Ce ne sont pas des extremums globaux, puisque la fonction est non bornée aux deux infinis.`),
  ], graph),
  ex(39, "Étude d’une courbe avec asymptote et tangente", r`Soit $f(x)=(x^2+x-2)/(x-2)$. On note $(C_f)$ sa courbe.`, [
    written("1.", "Détermine le domaine.", r`Le dénominateur s’annule seulement en $2$. **$D_f=\mathbb R\setminus\{2\}$.**`),
    written("2.a)", "Calcule les limites en 2 et interprète-les.", r`Au voisinage de $2$, le numérateur tend vers $4>0$. Le dénominateur tend vers $0^-$ à gauche et $0^+$ à droite.

**La limite vaut $-\infty$ en $2^-$ et $+\infty$ en $2^+$.** La droite $x=2$ est une asymptote verticale.`),
    written("2.b)", "Calcule les limites aux deux infinis.", r`En divisant les termes dominants, $f(x)$ se comporte comme $x$. **La limite vaut $-\infty$ à gauche et $+\infty$ à droite.** On peut aussi utiliser l’écriture de la question suivante.`),
    written("3.", r`Détermine $a,b,c$ tels que $f(x)=ax+b+c/(x-2)$.`, r`On effectue la division : $x^2+x-2=(x-2)(x+3)+4$. Donc :

$$\boxed{f(x)=x+3+\frac4{x-2}.}$$

**$a=1$, $b=3$ et $c=4$.**`),
    written("4.a)", r`Justifie l’asymptote $(D):y=x+3$.`, r`On soustrait l’équation proposée : $f(x)-(x+3)=4/(x-2)$. Cette différence tend vers $0$ aux deux infinis. **La droite est une asymptote oblique aux deux infinis.**`),
    written("4.b)", "Étudie la position relative de la courbe et de D.", r`La différence $4/(x-2)$ est négative pour $x<2$ et positive pour $x>2$. **La courbe est sous $(D)$ à gauche de $2$, au-dessus à droite.** Elle ne coupe pas cette droite.`),
    written("5.a)", "Calcule la dérivée.", r`On dérive l’écriture simplifiée :

$$f'(x)=1-\frac4{(x-2)^2}
=\frac{(x-2)^2-4}{(x-2)^2}
=\boxed{\frac{x(x-4)}{(x-2)^2}}.$$`),
    written("5.b)", "Étudie son signe.", r`Le dénominateur est positif sur le domaine. Le signe est celui de $x(x-4)$ : positif si $x<0$ ou $x>4$, nul en $0$ et $4$, négatif entre $0$ et $4$ en excluant $2$.`),
    written("5.c)", "Dresse le tableau de variation.", r`On calcule $f(0)=1$ et $f(4)=9$.

| $x$ | $-\infty$ | | $0$ | | $2^-$ | $2^+$ | | $4$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | $0$ | $-$ | | | $-$ | $0$ | $+$ | |
| $f(x)$ | $-\infty$ | $\nearrow$ | $1$ | $\searrow$ | $-\infty$ | $+\infty$ | $\searrow$ | $9$ | $\nearrow$ | $+\infty$ |`),
    written("6.", "Détermine la tangente au point d’abscisse 1.", r`On trouve $f(1)=0$ et $f'(1)=1(1-4)/(1-2)^2=-3$. La tangente est :

$$y=0-3(x-1)=\boxed{-3x+3}.$$`),
    written("7.", "Détermine les extremums relatifs.", r`La dérivée passe de $+$ à $-$ en $0$ : **maximum local $f(0)=1$**. Elle passe de $-$ à $+$ en $4$ : **minimum local $f(4)=9$**. Les valeurs infinies près du pôle interdisent un extremum global.`),
    written("8.", "Construis la courbe, l’asymptote oblique et la tangente.", r`Trace $x=2$, $(D):y=x+3$ et $(T):y=-3x+3$. Place $(0;1)$, $(1;0)$ et $(4;9)$. Les tangentes sont horizontales aux extremums. Respecte la position relative à $(D)$ et les quatre variations.`),
  ], graph),
  ex(40, "Optimiser un rectangle dans un triangle", r`Le triangle $ABC$ est équilatéral de côté $a>0$. Le rectangle $MNPQ$ est inscrit comme sur la figure, avec $Q,P\in[BC]$, $M\in[AB]$ et $N\in[AC]$. Le point $H$ est le pied de la hauteur issue de $A$. On pose $BQ=x$, avec $0\le x\le a/2$.`, [
    written("1.", r`Vérifie $AH=a\sqrt3/2$.`, r`Dans le triangle rectangle $ABH$, on a $AB=a$ et $BH=a/2$. Par Pythagore :

$$AH^2=a^2-(a/2)^2=\frac{3a^2}{4}.$$

Une longueur est positive : **$AH=a\sqrt3/2$.**`),
    written("2.", r`Démontre $MQ=x\sqrt3$.`, r`Les triangles $BQM$ et $BHA$ sont semblables : ils ont l’angle en $B$ commun et chacun un angle droit. Donc $MQ/AH=BQ/BH$.

$$MQ=\frac{x}{a/2}\times\frac{a\sqrt3}{2}=\boxed{x\sqrt3}.$$`),
    written("3.", "Exprime l’aire du rectangle en fonction de x.", r`Par symétrie de la section horizontale du triangle, $CP=BQ=x$, donc $QP=a-2x$. L’aire est le produit de la largeur et de la hauteur :

$$\boxed{\mathcal A(x)=x\sqrt3(a-2x).}$$`),
    written("4.", "Détermine la position de Q qui maximise l’aire.", r`Sur $[0;a/2]$, on dérive $\mathcal A(x)=\sqrt3(ax-2x^2)$ :

$$\mathcal A'(x)=\sqrt3(a-4x).$$

La dérivée est positive avant $a/4$, nulle en $a/4$, négative après. **L’aire est maximale pour $BQ=a/4$.**`),
    written("5.", "Calcule l’aire maximale.", r`On remplace $x$ par $a/4$ :

$$\mathcal A(a/4)=\frac a4\sqrt3\left(a-\frac a2\right)
=\boxed{\frac{a^2\sqrt3}{8}}.$$`),
  ], { figureKey: "tc-l2-triangle" }),
  ex(41, "Une courbe avec point anguleux", r`Soit $f(x)=x|x-3|+2$ sur $\mathbb R$.`, [
    written("1.", "Étudie la continuité en 3.", r`La valeur absolue, les produits et les sommes de fonctions continues sont continus. On peut aussi vérifier que les deux expressions $-x^2+3x+2$ pour $x<3$ et $x^2-3x+2$ pour $x\ge3$ tendent vers $2=f(3)$. **$f$ est continue en $3$.**`),
    written("2.", "Étudie la dérivabilité en 3 et interprète.", r`À gauche, la dérivée de $-x^2+3x+2$ donne la pente $-2\times3+3=-3$. À droite, celle de $x^2-3x+2$ donne $2\times3-3=3$.

**$f'_g(3)=-3\ne3=f'_d(3)$**, donc $f$ n’est pas dérivable en $3$. Les demi-tangentes en $(3;2)$ ont pour supports **$y=-3x+11$** et **$y=3x-7$**.`),
    written("3.", "Étudie les variations et dresse le tableau.", r`Pour $x<3$, $f'(x)=-2x+3$ : positif avant $3/2$, négatif entre $3/2$ et $3$. Pour $x>3$, $f'(x)=2x-3>0$.

On calcule $f(3/2)=17/4$ et $f(3)=2$.

| $x$ | $-\infty$ | | $3/2$ | | $3$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $f(x)$ | $-\infty$ | $\nearrow$ | $17/4$ | $\searrow$ | $2$ | $\nearrow$ | $+\infty$ |`),
    written("4.", "Trace la courbe.", r`Dessine l’arc de parabole $-x^2+3x+2$ jusqu’en $3$, puis celui de $x^2-3x+2$ après $3$. Place $(0;2)$, $(3/2;17/4)$ et $(3;2)$. Au raccord, les deux demi-tangentes distinctes créent un point anguleux.`),
  ], graph),
];
