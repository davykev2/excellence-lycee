import { short, written } from "./builders";
import { derivativeExercise as ex } from "./terminalCDerivativesBuilders";
const r = String.raw;
const graph = { correctionFigureKey: "tc-l2-functions" as const };

export const derivativesDeepeningA = [
  ex(26, "Dérivées successives et formule d’ordre n", r`Sur $]-1;1[$, on considère $f(x)=1/(1-x)$ et $g(x)=1/(1+x)$. Calcule leurs trois premières dérivées, puis déduis une formule des dérivées d’ordre $n$.`, [
    written("1.a)", r`Calcule $f'$, $f''$ et $f'''$.`, r`On écrit $f(x)=(1-x)^{-1}$. À chaque dérivation, la règle de la composée apporte le facteur $-1$ venant de $1-x$ :

$$f'(x)=-(1-x)^{-2}(-1)=\frac1{(1-x)^2}.$$

$$f''(x)=-2(1-x)^{-3}(-1)=\frac2{(1-x)^3}.$$

$$f'''(x)=-6(1-x)^{-4}(-1)=\frac6{(1-x)^4}.$$`),
    written("1.b)", r`Calcule $g'$, $g''$ et $g'''$.`, r`Cette fois, la dérivée de l’expression intérieure $1+x$ vaut $1$ :

$$g'(x)=-\frac1{(1+x)^2},\qquad g''(x)=\frac2{(1+x)^3}.$$

Une troisième dérivation donne **$g'''(x)=-6/(1+x)^4$**. Les signes alternent.`),
    written("2.a)", r`Donne et justifie $f^{(n)}(x)$ pour $n\ge0$.`, r`Les coefficients $1,1,2,6$ sont les factorielles successives. On propose :

$$\boxed{f^{(n)}(x)=\frac{n!}{(1-x)^{n+1}}.}$$

Pour $n=0$, on retrouve $f$. Si la formule est vraie à l’ordre $n$, sa dérivée est $n!(n+1)(1-x)^{-n-2}$, donc $(n+1)!/(1-x)^{n+2}$. **La récurrence prouve la formule.**`),
    written("2.b)", r`Donne et justifie $g^{(n)}(x)$ pour $n\ge0$.`, r`La formule qui tient compte de l’alternance est :

$$\boxed{g^{(n)}(x)=\frac{(-1)^n n!}{(1+x)^{n+1}}.}$$

Elle est vraie pour $n=0$. En dérivant le membre de droite, on multiplie par $-(n+1)$ et on augmente la puissance du dénominateur d’une unité. On obtient exactement la formule à l’ordre $n+1$.`),
  ]),
  ex(27, "Déterminer un polynôme par ses tangentes", r`Soit $f(x)=x^3+ax^2+bx+1$. La tangente à sa courbe au point d’abscisse $0$ a pour équation $y=-3x+1$, et $f'(1)=f'(-1)$.`, [
    short("1.a)", "Détermine a.", "$0$", ["0"], r`On a $f'(x)=3x^2+2ax+b$. L’égalité $f'(1)=f'(-1)$ donne $3+2a+b=3-2a+b$, donc $4a=0$. **Ainsi $a=0$.**`),
    short("1.b)", "Détermine b.", "$-3$", ["-3"], r`Le coefficient directeur de la tangente en $0$ est $f'(0)=b$. L’équation donnée a pour pente $-3$, donc **$b=-3$**. Son ordonnée à l’origine $1$ est bien $f(0)$.`),
    written("2.", "Étudie les variations de f.", r`On obtient $f(x)=x^3-3x+1$, puis :

$$f'(x)=3x^2-3=3(x-1)(x+1).$$

Le signe est positif hors de $[-1;1]$ et négatif entre les deux racines. On calcule $f(-1)=3$ et $f(1)=-1$.

| $x$ | $-\infty$ | | $-1$ | | $1$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |
| $f(x)$ | $-\infty$ | $\nearrow$ | $3$ | $\searrow$ | $-1$ | $\nearrow$ | $+\infty$ |`),
    written("3.", "Construis la courbe dans un repère.", r`Place les extremums $(-1;3)$ et $(1;-1)$, ainsi que $(0;1)$. Trace en ce dernier point la tangente $y=-3x+1$. Relie les branches en respectant les trois variations ; les limites sont celles de $x^3$. La courbe de correction permet de contrôler la construction.`),
  ], graph),
  ex(28, "Régler un paramètre pour imposer une pente", r`Soit $f(x)=(ax+2)/(2x+1)$, avec $x\ne-1/2$.`, [
    short("1.", r`Détermine $a$ pour que la tangente en $0$ soit parallèle à $y=-5x+2$.`, "$-1$", ["-1"], r`La dérivée d’un quotient donne :

$$f'(x)=\frac{a(2x+1)-2(ax+2)}{(2x+1)^2}=\frac{a-4}{(2x+1)^2}.$$

La pente en $0$ est $a-4$. Le parallélisme impose $a-4=-5$, donc **$a=-1$**.`),
    written("2.", r`Dresse le tableau de variation pour $a=-1$.`, r`On a $f'(x)=-5/(2x+1)^2<0$ sur chacun des deux intervalles de définition. Pour calculer les limites, on écrit :

$$f(x)=-\frac12+\frac{5}{4(x+1/2)}.$$

| $x$ | $-\infty$ | | $-1/2^-$ | $-1/2^+$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $-$ | | | $-$ | |
| $f(x)$ | $-1/2$ | $\searrow$ | $-\infty$ | $+\infty$ | $\searrow$ | $-1/2$ |

La valeur $-1/2$ est exclue du domaine. Les asymptotes sont $x=-1/2$ et $y=-1/2$.`),
  ], graph),
  ex(29, "Imposer un point et une tangente horizontale", r`Sur $\mathbb R\setminus\{1\}$, on pose $f(x)=(x^2+ax+b)/(x-1)$. Sa courbe doit passer par $(-3;1)$ avec une tangente horizontale.`, [
    short("1.a)", "Détermine a.", "$7$", ["7"], r`La condition $f(-3)=1$ donne $9-3a+b=-4$, soit $b-3a=-13$.

On calcule $f'(x)=(x^2-2x-a-b)/(x-1)^2$. La tangente horizontale impose $f'(-3)=0$, donc $a+b=15$.

En remplaçant $b$ par $15-a$ dans la première relation, on obtient $15-4a=-13$, donc **$a=7$**.`),
    short("1.b)", "Détermine b.", "$8$", ["8"], r`Puisque $a+b=15$ et $a=7$, **$b=8$**.`),
    written("2.", "Dresse le tableau de variation.", r`La division du numérateur donne :

$$f(x)=x+8+\frac{16}{x-1}.$$

Donc $f'(x)=1-16/(x-1)^2=(x+3)(x-5)/(x-1)^2$. Le dénominateur est positif ; on étudie le signe des deux facteurs du numérateur.

| $x$ | $-\infty$ | | $-3$ | | $1^-$ | $1^+$ | | $5$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | $0$ | $-$ | | | $-$ | $0$ | $+$ | |
| $f(x)$ | $-\infty$ | $\nearrow$ | $1$ | $\searrow$ | $-\infty$ | $+\infty$ | $\searrow$ | $17$ | $\nearrow$ | $+\infty$ |`),
    written("3.", "Trace la courbe.", r`Trace les asymptotes $x=1$ et $y=x+8$, puis place $(-3;1)$ et $(5;17)$, où les tangentes sont horizontales. Le terme $16/(x-1)$ montre que la courbe est sous l’asymptote oblique pour $x<1$, et au-dessus pour $x>1$. Respecte le tableau de variation.`),
  ], graph),
  ex(30, "Étude complète d’une fraction rationnelle", r`Soit $f(x)=(x^2-2x+3)/(2x(x-2))$. On note $(C)$ sa courbe.`, [
    written("1.a)", "Détermine l’ensemble de définition.", r`Le dénominateur est nul exactement pour $x=0$ et $x=2$. **$D_f=\mathbb R\setminus\{0;2\}$.**`),
    written("1.b)", "Calcule les limites aux bornes du domaine.", r`On utilise l’écriture :

$$f(x)=\frac12+\frac3{2x(x-2)}.$$

Aux deux infinis, le second terme tend vers $0$, donc $f(x)\to1/2$.

Près de $0$, $x-2$ reste négatif : le produit $x(x-2)$ est positif à gauche et négatif à droite. Près de $2$, $x$ est positif : le signe est celui de $x-2$.

$$\lim_{x\to0^-}f(x)=+\infty,\quad\lim_{x\to0^+}f(x)=-\infty.$$

$$\lim_{x\to2^-}f(x)=-\infty,\quad\lim_{x\to2^+}f(x)=+\infty.$$`),
    written("1.c)", "Détermine les asymptotes.", r`Les limites infinies donnent les asymptotes verticales **$x=0$ et $x=2$**. La limite finie aux deux infinis donne l’asymptote horizontale **$y=1/2$**.`),
    written("2.", r`Calcule $f'(x)$.`, r`On dérive l’écriture simplifiée. Avec $u(x)=2x(x-2)$, $u'(x)=4(x-1)$, donc :

$$f'(x)=-\frac{3u'(x)}{u(x)^2}
=-\frac{3(x-1)}{x^2(x-2)^2}.$$`),
    written("3.a)", "Étudie les variations.", r`Le dénominateur de $f'$ est strictement positif sur $D_f$. Son signe est donc celui de $-(x-1)$ : positif pour $x<1$ et négatif pour $x>1$. On sépare toujours les intervalles aux valeurs interdites $0$ et $2$.`),
    written("3.b)", "Dresse le tableau de variation.", r`On calcule $f(1)=-1$.

| $x$ | $-\infty$ | | $0^-$ | $0^+$ | | $1$ | | $2^-$ | $2^+$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | | | $+$ | $0$ | $-$ | | | $-$ | |
| $f(x)$ | $1/2$ | $\nearrow$ | $+\infty$ | $-\infty$ | $\nearrow$ | $-1$ | $\searrow$ | $-\infty$ | $+\infty$ | $\searrow$ | $1/2$ |`),
    written("4.", "Représente graphiquement la courbe.", r`Trace les trois asymptotes, puis le point $(1;-1)$ avec sa tangente horizontale. La branche centrale est sous l’axe des abscisses ; les branches extérieures sont au-dessus de $y=1/2$. La courbe est symétrique par rapport à $x=1$, car $f(2-x)=f(x)$.`),
  ], graph),
  ex(31, "Valeur absolue et asymptotes obliques", r`Soit $f(x)=|x-3|+1/(x-2)$.`, [
    written("1.a)", "Détermine le domaine.", r`La valeur absolue existe pour tout réel, tandis que la fraction impose $x\ne2$. **$D_f=\mathbb R\setminus\{2\}$.**`),
    written("1.b)", "Calcule les limites aux bornes du domaine.", r`En $-\infty$, $|x-3|=3-x\to+\infty$ et la fraction tend vers $0$. En $+\infty$, $|x-3|=x-3\to+\infty$.

Près de $2$, la valeur absolue tend vers $1$, tandis que $1/(x-2)$ tend vers $-\infty$ à gauche et $+\infty$ à droite.

**Les limites sont donc $+\infty$ aux deux infinis, $-\infty$ en $2^-$ et $+\infty$ en $2^+$.**`),
    written("1.c)", "Justifie les deux asymptotes obliques.", r`Pour $x<3$, $f(x)-(-x+3)=1/(x-2)\to0$ en $-\infty$. Pour $x>3$, $f(x)-(x-3)=1/(x-2)\to0$ en $+\infty$.

**Les asymptotes sont $y=-x+3$ en $-\infty$ et $y=x-3$ en $+\infty$.**`),
    written("2.a)", "Étudie la dérivabilité en 3.", r`On a $f(3)=1$. Pour $x<3$, l’expression est $3-x+1/(x-2)$, de dérivée $-1-1/(x-2)^2$ ; pour $x>3$, elle est $x-3+1/(x-2)$, de dérivée $1-1/(x-2)^2$.

Les expressions sont dérivables de leur côté jusqu’en $3$. Elles donnent les nombres dérivés latéraux **$f'_g(3)=-2$ et $f'_d(3)=0$**. Ils diffèrent : $f$ n’est pas dérivable en $3$.`),
    written("2.b)", "Donne l’expression de la dérivée sur l’ensemble de dérivabilité.", r`L’ensemble de dérivabilité est $\mathbb R\setminus\{2;3\}$ et :

$$f'(x)=\begin{cases}-1-\dfrac1{(x-2)^2}&x<3,\ x\ne2,\\1-\dfrac1{(x-2)^2}&x>3.\end{cases}$$`),
    written("2.c)", "Étudie le sens de variation.", r`Pour $x<3$, $f'(x)<0$. Pour $x>3$, on a $(x-2)^2>1$, donc $f'(x)>0$. La fonction décroît sur $]-\infty;2[$ puis sur $]2;3]$, et croît sur $[3;+\infty[$.`),
    written("2.d)", "Dresse le tableau de variation.", r`| $x$ | $-\infty$ | | $2^-$ | $2^+$ | | $3$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $f(x)$ | $+\infty$ | $\searrow$ | $-\infty$ | $+\infty$ | $\searrow$ | $1$ | $\nearrow$ | $+\infty$ |

Le point $(3;1)$ est un minimum local, bien que la fonction n’y soit pas dérivable.`),
    written("3.", "Construis la courbe.", r`Trace les asymptotes $x=2$, $y=-x+3$ et $y=x-3$. Place $(3;1)$ : la demi-tangente à gauche a la pente $-2$, celle à droite est horizontale. Dessine les trois portions en respectant les limites et les variations.`),
  ], graph),
  ex(32, "Une valeur absolue au dénominateur", r`Soit $f(x)=x-3+1/|x-2|$.`, [
    written("1.a)", "Détermine le domaine.", r`Le dénominateur $|x-2|$ s’annule seulement en $2$. **$D_f=\mathbb R\setminus\{2\}$.**`),
    written("1.b)", "Calcule les limites aux bornes du domaine.", r`Aux deux infinis, $1/|x-2|\to0$, donc $f(x)$ a les mêmes limites que $x-3$ : $-\infty$ à gauche et $+\infty$ à droite.

En $2$, le dénominateur tend vers $0$ en restant positif des deux côtés : **$f(x)\to+\infty$ en $2^-$ et en $2^+$.**`),
    written("2.a)", "Étudie les variations.", r`Pour $x<2$, $f(x)=x-3+1/(2-x)$, donc $f'(x)=1+1/(2-x)^2>0$.

Pour $x>2$, $f(x)=x-3+1/(x-2)$, donc :

$$f'(x)=1-\frac1{(x-2)^2}=\frac{(x-3)(x-1)}{(x-2)^2}.$$

Sur $]2;+\infty[$, le facteur $x-1$ est positif. La dérivée est négative entre $2$ et $3$, nulle en $3$, positive après $3$.`),
    written("2.b)", "Dresse le tableau de variation.", r`On calcule $f(3)=1$.

| $x$ | $-\infty$ | | $2^-$ | $2^+$ | | $3$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $f'(x)$ | | $+$ | | | $-$ | $0$ | $+$ | |
| $f(x)$ | $-\infty$ | $\nearrow$ | $+\infty$ | $+\infty$ | $\searrow$ | $1$ | $\nearrow$ | $+\infty$ |`),
    written("3.", "Construis la courbe.", r`Trace $x=2$ et l’asymptote $y=x-3$. La courbe reste **au-dessus** de cette dernière, car $1/|x-2|>0$. Place le minimum $(3;1)$ avec sa tangente horizontale et respecte les variations.`),
  ], graph),
  ex(33, "Nombres dérivés latéraux avec valeurs absolues", "Calcule, lorsqu’ils existent comme réels, les nombres dérivés à gauche et à droite au point indiqué.", [
    written("1.", r`$f(x)=-3x^2+7|x|$ en $0$.`, r`On a $f(0)=0$. Pour $x<0$, le taux vaut $-3x-7$, qui tend vers $-7$. Pour $x>0$, il vaut $-3x+7$, qui tend vers $7$.

**$f'_g(0)=-7$ et $f'_d(0)=7$** ; la fonction n’est pas dérivable en $0$.`),
    written("2.", r`$f(x)=|x+2|/(x-1)$ en $-2$.`, r`On a $f(-2)=0$. Le taux est $|x+2|/((x-1)(x+2))$.

À gauche, $|x+2|=-(x+2)$ : le taux devient $-1/(x-1)\to1/3$.

À droite, $|x+2|=x+2$ : il devient $1/(x-1)\to-1/3$.

**$f'_g(-2)=1/3$ et $f'_d(-2)=-1/3$** ; ils sont différents.`),
    written("3.", r`$f(x)=\sqrt{x|x-1|}$ en $1$.`, r`La fonction est définie sur $[0;+\infty[$ et $f(1)=0$.

Pour $0<x<1$, on a $f(x)=\sqrt{x(1-x)}$ et :

$$\frac{f(x)}{x-1}=-\frac{\sqrt x}{\sqrt{1-x}}\longrightarrow-\infty.$$

Pour $x>1$ :

$$\frac{f(x)}{x-1}=\frac{\sqrt x}{\sqrt{x-1}}\longrightarrow+\infty.$$

**Aucun des deux nombres dérivés n’existe comme réel.** La courbe possède deux demi-tangentes verticales vers le haut en $(1;0)$.`),
  ]),
  ex(34, "Justifier la dérivabilité et construire une tangente", r`Soit $f(x)=3x^2+5$. On appelle $A$ le point de la courbe d’abscisse $1$.`, [
    written("1.", "Démontre que f est dérivable en 1 et calcule son nombre dérivé.", r`On a $f(1)=8$. Pour $x\ne1$ :

$$\frac{f(x)-f(1)}{x-1}=\frac{3x^2-3}{x-1}=3(x+1).$$

Ce taux tend vers $6$ quand $x\to1$. **$f$ est dérivable en $1$ et $f'(1)=6$.**`),
    written("2.", "Détermine l’équation de la tangente en A.", r`La tangente a pour équation $y=f(1)+f'(1)(x-1)$. En remplaçant les deux valeurs :

$$y=8+6(x-1)=\boxed{6x+2}.$$`),
    written("3.", "Construis la courbe et sa tangente.", r`La courbe est une parabole de sommet $(0;5)$ et d’axe vertical. Place $(1;8)$ et son symétrique $(-1;8)$. Trace la droite $y=6x+2$ ; la différence $f(x)-(6x+2)=3(x-1)^2\ge0$ confirme que la parabole reste au-dessus de la tangente.`),
  ], graph),
  ex(35, "Dérivabilité en zéro : trois comportements", r`Étudie la dérivabilité en $0$ des fonctions $f(x)=|x^3|$, $g(x)=x|x|$ et $h(x)=\sqrt x+x$, chacune sur son domaine naturel.`, [
    written("1.", r`Étudie $f(x)=|x^3|$.`, r`On a $f(0)=0$. À droite, le taux vaut $x^2$ ; à gauche, il vaut $-x^2$. Les deux expressions tendent vers $0$. **La fonction est dérivable en $0$ et $f'(0)=0$.**`),
    written("2.", r`Étudie $g(x)=x|x|$.`, r`On a $g(0)=0$. Pour $x\ne0$, le taux est $x|x|/x=|x|$, qui tend vers $0$ des deux côtés. **$g$ est dérivable en $0$ et $g'(0)=0$.**`),
    written("3.", r`Étudie $h(x)=\sqrt x+x$.`, r`La fonction est définie sur $[0;+\infty[$ : il n’y a pas d’étude à gauche de $0$ dans ce domaine. Pour $x>0$ :

$$\frac{h(x)-h(0)}x=\frac1{\sqrt x}+1\longrightarrow+\infty.$$

La limite n’est pas finie : **il n’existe pas de nombre dérivé réel à droite en $0$**. La courbe admet une demi-tangente verticale vers le haut.`),
  ]),
];
