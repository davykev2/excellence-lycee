import { sequenceExercise as ex, seqWritten as w } from "./terminalCSequencesBuilders";

export const sequencesFixationA = [
  ex(1, "Cinq termes sur un axe", String.raw`$u_0=1$ et, pour $n\ge0$, $u_{n+1}=\frac12u_n+3$.`, [
    w("1.", "Représente les cinq premiers termes sur l’axe (OI).", String.raw`Les cinq premiers termes commencent au rang $0$ : il faut donc calculer jusqu’à $u_4$.

$$u_0=1,\qquad u_1=\frac12\times1+3=\frac72.$$
$$u_2=\frac12\times\frac72+3=\frac{19}4.$$
$$u_3=\frac12\times\frac{19}4+3=\frac{43}8.$$
$$u_4=\frac12\times\frac{43}8+3=\frac{91}{16}.$$

Place sur l’axe les abscisses **$1$ ; $3{,}5$ ; $4{,}75$ ; $5{,}375$ ; $5{,}6875$**, en les nommant $u_0,u_1,u_2,u_3,u_4$. Il ne s’agit pas des points $(n;u_n)$ : ici tous les points sont sur l’axe des abscisses.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(2, "Deux constructions sur un axe", "Représente les quatre premiers termes de chacune des suites sur (OI).", [
    w("a)", String.raw`$u_0=2$, $u_{n+1}=u_n+1$.`, String.raw`On ajoute $1$ à chaque étape : **$u_0=2$, $u_1=3$, $u_2=4$, $u_3=5$**. Place ces quatre nombres sur l’axe, avec leur indice.`),
    w("b)", String.raw`$v_0=-2$, $v_{n+1}=\frac13v_n+2$.`, String.raw`Calculons chaque terme à partir du précédent :

$$v_1=-\frac23+2=\frac43,\qquad v_2=\frac49+2=\frac{22}9.$$
$$v_3=\frac{22}{27}+2=\frac{76}{27}.$$

Place **$-2$, $4/3$, $22/9$ et $76/27$**, soit environ $-2$ ; $1{,}333$ ; $2{,}444$ ; $2{,}815$, avec les noms $v_0$ à $v_3$.`),
  ], { correctionFigureKey: "tc-l6-sequences" }),
  ex(3, "Formule d’une suite géométrique", String.raw`$u_0=5$ et $u_{n+1}=\frac43u_n$.`, [
    w("1.", String.raw`Démontre par récurrence que $u_n=5(4/3)^n$ pour tout $n\ge0$.`, String.raw`**Initialisation.** Pour $n=0$, $5(4/3)^0=5=u_0$.

**Hérédité.** Supposons $u_k=5(4/3)^k$. Alors :

$$u_{k+1}=\frac43u_k=\frac43\times5\left(\frac43\right)^k=5\left(\frac43\right)^{k+1}.$$

La propriété est vraie au rang $0$ et se transmet. **La formule est donc vraie pour tout entier $n\ge0$.**`),
  ]),
  ex(4, "Un encadrement par récurrence", String.raw`$u_0=0$ et $u_{n+1}=2+\frac12u_n$.`, [
    w("1.", String.raw`Démontre que $2\le u_n<4$ pour tout $n\ge1$.`, String.raw`**Initialisation au rang $1$.** $u_1=2+u_0/2=2$, donc $2\le u_1<4$.

**Hérédité.** Supposons $2\le u_k<4$. Alors $1\le u_k/2<2$, puis :

$$3\le 2+\frac12u_k<4.$$

Ainsi $2\le u_{k+1}<4$. Par récurrence, **l’encadrement vaut pour tous les rangs $n\ge1$**. Le terme $u_0=0$ reste le terme initial donné.`),
  ]),
  ex(5, "Une récurrence avec une racine", String.raw`$U_0=2$ et $U_{n+1}=\sqrt{U_n+2}$.`, [
    w("1.", String.raw`Démontre par récurrence que $U_n\le2$ pour tout $n\ge0$.`, String.raw`On prouve l’encadrement plus précis $0\le U_n\le2$, afin de garantir que la racine est définie.

**Initialisation.** $U_0=2$ convient.

**Hérédité.** Si $0\le U_k\le2$, alors $2\le U_k+2\le4$. La racine carrée étant croissante, $0\le\sqrt{U_k+2}\le2$.

Donc **$0\le U_n\le2$ à tout rang**. Ici on peut même constater que $U_n=2$ à chaque étape, car $\sqrt{2+2}=2$.`),
  ]),
  ex(6, "Formule d’une suite affine", String.raw`$U_0=2$ et $U_{n+1}=2U_n-3$.`, [
    w("1.", String.raw`Démontre que $U_n=3-2^n$ pour tout $n\ge0$.`, String.raw`**Initialisation.** $3-2^0=2=U_0$.

**Hérédité.** Si $U_k=3-2^k$, alors :

$$U_{k+1}=2(3-2^k)-3=6-2^{k+1}-3=3-2^{k+1}.$$

Par récurrence, **$U_n=3-2^n$ pour tout $n\ge0$**.`),
  ]),
  ex(7, "Trouver un minorant", String.raw`Pour $n\ge1$, $u_n=(2n-3)/(5n-1)$.`, [
    w("1.", String.raw`Montre que $-1/4$ minore la suite.`, String.raw`Pour comparer $u_n$ à $-1/4$, calculons leur différence :

$$u_n+\frac14=\frac{4(2n-3)+(5n-1)}{4(5n-1)}=\frac{13(n-1)}{4(5n-1)}.$$

Pour $n\ge1$, le numérateur est positif ou nul et le dénominateur est strictement positif. Ainsi **$u_n\ge-1/4$**. Au rang $1$, on a exactement $u_1=-1/4$.`),
  ]),
  ex(8, "Une suite périodique majorée", String.raw`$u_0=2$ et $u_{n+1}=1-1/u_n$.`, [
    w("1.", "Démontre par récurrence que la suite est définie et majorée par 2.", String.raw`Une simple hypothèse $u_n\le2$ ne contrôle pas le signe du dénominateur. On démontre plutôt le cycle :

$$u_{3k}=2,\qquad u_{3k+1}=\frac12,\qquad u_{3k+2}=-1.$$

**Initialisation.** $u_0=2$, $u_1=1-1/2=1/2$, puis $u_2=1-2=-1$.

**Hérédité par blocs de trois.** À partir de $u_{3k+2}=-1$, le terme suivant vaut $1-1/(-1)=2$, puis on retrouve $1/2$ et $-1$. Aucun de ces trois nombres n’est nul : la récurrence reste toujours définie.

Le cycle est donc vrai pour tout $k\ge0$. Tous les termes appartiennent à $\{-1;1/2;2\}$, donc **$u_n\le2$ à tout rang**. Cette suite bornée n’a pas de limite.`),
  ]),
  ex(9, "Deux bornes fixes", String.raw`Pour $n\ge0$, $u_n=3n/(n+1)$.`, [
    w("1.", "Démontre que la suite est bornée.", String.raw`Le numérateur est positif ou nul et le dénominateur est positif, donc $u_n\ge0$.

$$3-u_n=\frac{3(n+1)-3n}{n+1}=\frac3{n+1}>0.$$

Ainsi **$0\le u_n<3$** à tous les rangs. La suite est minorée par $0$ et majorée par $3$ : elle est bornée.`),
  ]),
  ex(10, "Une différence d’exponentielles", String.raw`Pour $n\ge1$, $u_n=2^n-3^n$.`, [
    w("1.", "Démontre que la suite est majorée.", String.raw`Puisque $2<3$ et $n\ge1$, on a $2^n<3^n$. En soustrayant $3^n$, on obtient **$u_n<0$**. Le nombre fixe $0$ est donc un majorant de la suite.`),
  ]),
  ex(11, "Étudier quatre variations", String.raw`Pour $n\ge1$, étudie le sens de variation de chaque suite.`, [
    w("a)", String.raw`$u_n=(n+2)/(2n+1)$.`, String.raw`$$u_{n+1}-u_n=\frac{n+3}{2n+3}-\frac{n+2}{2n+1}=\frac{-3}{(2n+3)(2n+1)}.$$

Le dénominateur est positif. **La suite est strictement décroissante.**`),
    w("b)", String.raw`$u_n=(n^2-4)/(n^2+1)$.`, String.raw`Écrivons $u_n=1-5/(n^2+1)$. Alors :

$$u_{n+1}-u_n=\frac{5(2n+1)}{(n^2+1)((n+1)^2+1)}>0.$$

Tous les facteurs sont positifs pour $n\ge1$. **La suite est strictement croissante.**`),
    w("c)", String.raw`$u_n=(n^2+2n+3)/(n+1)$.`, String.raw`La division donne $u_n=n+1+2/(n+1)$. Ainsi :

$$u_{n+1}-u_n=1-\frac2{(n+1)(n+2)}.$$

Pour $n\ge1$, $(n+1)(n+2)\ge6$, donc la différence est au moins $1-2/6=2/3>0$. **La suite est strictement croissante.**`),
    w("d)", String.raw`$u_n=n!/n^n$.`, String.raw`Tous les termes sont strictement positifs. Le quotient se simplifie :

$$\frac{u_{n+1}}{u_n}=\frac{(n+1)!}{(n+1)^{n+1}}\frac{n^n}{n!}=\left(\frac n{n+1}\right)^n.$$

Pour $n\ge1$, $0<n/(n+1)<1$ ; le quotient est donc strictement inférieur à $1$. **La suite est strictement décroissante.**`),
  ]),
  ex(12, "Utiliser la fonction associée", String.raw`Pour $n\ge2$, détermine une fonction associée et étudie les variations de la suite.`, [
    w("a)", String.raw`$u_n=\ln n/n^2$.`, String.raw`Prenons $f(x)=\ln x/x^2$ sur $[2;+\infty[$. Sa dérivée est :

$$f'(x)=\frac{1-2\ln x}{x^3}.$$

Pour $x\ge2$, $\ln x\ge\ln2>1/2$, donc $f'(x)<0$. **$f$, puis $(u_n)$, sont strictement décroissantes sur les rangs $n\ge2$.**`),
    w("b)", String.raw`$u_n=e^n/(n+3)$.`, String.raw`Sur $[2;+\infty[$, prenons $f(x)=e^x/(x+3)$. Alors :

$$f'(x)=\frac{e^x(x+3)-e^x}{(x+3)^2}=\frac{e^x(x+2)}{(x+3)^2}>0.$$

**La fonction associée et la suite sont strictement croissantes.**`),
    w("c)", String.raw`$u_n=3^n/n$.`, String.raw`Prenons $f(x)=3^x/x$ sur $[2;+\infty[$. Comme $(3^x)'=(\ln3)3^x$ :

$$f'(x)=\frac{3^x(x\ln3-1)}{x^2}.$$

Pour $x\ge2$, $x\ln3-1\ge2\ln3-1>0$. **La fonction et la suite sont strictement croissantes.**`),
  ]),
  ex(13, "Le produit de deux suites croissantes", String.raw`Pour $n\ge1$, $u_n=-1/n$ et $v_n=-1/n^2$.`, [
    w("a)", "Démontre que les deux suites sont croissantes.", String.raw`$$u_{n+1}-u_n=-\frac1{n+1}+\frac1n=\frac1{n(n+1)}>0.$$
$$v_{n+1}-v_n=-\frac1{(n+1)^2}+\frac1{n^2}=\frac{2n+1}{n^2(n+1)^2}>0.$$

**Les deux suites sont strictement croissantes.**`),
    w("b)", "Étudie le sens de variation de leur produit.", String.raw`Le produit vaut $u_nv_n=1/n^3$. Comme $n+1>n>0$, on a $(n+1)^3>n^3$, puis :

$$\frac1{(n+1)^3}<\frac1{n^3}.$$

**Le produit est strictement décroissant.** Deux suites croissantes ne donnent donc pas nécessairement un produit croissant, notamment quand leurs termes sont négatifs.`),
  ]),
];
