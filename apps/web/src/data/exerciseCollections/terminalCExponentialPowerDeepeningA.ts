import { short, written } from "./builders";
import { exponentialExercise as ex, expLimit } from "./terminalCExponentialPowerBuilders";

export const exponentialDeepeningA = [
  ex(14, "Un polynôme puis une équation exponentielle", String.raw`On donne $P(x)=x^4+7x^3-7x^2-43x+42$.`, [
    written("1.", String.raw`Vérifie que $1$ et $-3$ sont des racines.`, String.raw`$P(1)=1+7-7-43+42=0$. Puis $P(-3)=81-189-63+129+42=0$. **Les deux nombres sont bien racines.**`),
    written("2.a", "Factorise P.", String.raw`Puisque $1$ et $-3$ sont racines, $P$ est divisible par $(x-1)(x+3)=x^2+2x-3$. La division donne $x^2+5x-14=(x+7)(x-2)$.

$$\boxed{P(x)=(x-1)(x+3)(x+7)(x-2).}$$

Le développement permet de vérifier chacun des coefficients.`),
    written("2.b", String.raw`Résous $P(x)=0$ dans $\mathbb R$.`, String.raw`Un produit est nul si l’un de ses facteurs est nul : **$S=\{-7;-3;1;2\}$.**`),
    written("3.", String.raw`Déduis-en les solutions de $e^{4x}+7e^{3x}-7e^{2x}-43e^x+42=0$.`, String.raw`Posons $X=e^x>0$. L’équation devient $P(X)=0$. Parmi $-7,-3,1,2$, seules **$1$ et $2$** sont positives. On obtient $e^x=1$ ou $e^x=2$, donc **$S=\{0;\ln2\}$.**`),
  ]),
  ex(15, "Un prolongement en zéro", String.raw`$f(x)=\dfrac{x^2}{1-e^x}$ pour $x\ne0$, et $f(0)=0$.`, [
    written("a)", "Démontre que f est continue en 0.", String.raw`Pour $x\ne0$, $f(x)=-x\,x/(e^x-1)$. Lorsque $x\to0$, $x/(e^x-1)\to1$, donc $f(x)\to0=f(0)$. **Ainsi f est continue en 0.**`),
    written("b)", "Étudie la dérivabilité en 0 et interprète graphiquement.", String.raw`Le taux d’accroissement est

$$\frac{f(x)-f(0)}{x-0}=\frac{x}{1-e^x}=-\frac{x}{e^x-1}.$$

Il tend vers $-1$ par la limite de référence. **$f'(0)=-1$** et la tangente en $O(0;0)$ a pour équation **$y=-x$**.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(16, "Équations et inéquations en bases différentes", String.raw`Résous dans les domaines réels de définition.`, [
    short("1.", String.raw`$3^x=1$`, "$0$", ["0"], String.raw`$1=3^0$ et la base $3\ne1$. Par injectivité, **$x=0$.**`),
    short("2.", String.raw`$2^{x+1}=8$`, "$2$", ["2"], String.raw`$8=2^3$, donc $x+1=3$ et **$x=2$.**`),
    written("3.", String.raw`$2^x=3^{x+1}$`, String.raw`Les deux membres sont positifs. En prenant $\ln$ : $x\ln2=(x+1)\ln3$. Ainsi $x\ln(2/3)=\ln3$, donc **$x=\ln3/\ln(2/3)$**. Le dénominateur est non nul.`),
    short("4.", String.raw`$3^{2x}=2^{3x}$`, "$0$", ["0"], String.raw`Le logarithme donne $x(2\ln3-3\ln2)=x\ln(9/8)=0$. Comme $9/8\ne1$, son logarithme n’est pas nul. **$x=0$.**`),
    written("5.", String.raw`$3+2/3^x=9^x$`, String.raw`Posons $X=3^x>0$. L’équation est $3+2/X=X^2$, soit $X^3-3X-2=0$. On factorise : $(X-2)(X+1)^2=0$. La seule racine positive est $2$. **$x=\ln2/\ln3$.**`),
    written("6.", String.raw`$(x+3)^x=1$`, String.raw`La puissance réelle par logarithme exige $x+3>0$, soit $x>-3$. Alors $(x+3)^x=e^{x\ln(x+3)}$, donc $x\ln(x+3)=0$. Il vient $x=0$ ou $x+3=1$. **Les solutions sont $-2$ et $0$**, toutes deux dans le domaine.`),
    written("7.", String.raw`$4^{3+x}\ge3^{5x}$`, String.raw`En prenant $\ln$, on obtient $(3+x)\ln4\ge5x\ln3$, soit $3\ln4\ge x(5\ln3-\ln4)$. Comme $5\ln3-\ln4=\ln(243/4)>0$ :

$$\boxed{S=\left]-\infty;\frac{3\ln4}{5\ln3-\ln4}\right].}$$`),
    written("8.", String.raw`$2^x<2^{-x}$`, String.raw`La base $2>1$ donne $x<-x$, donc **$S=]-\infty;0[$.**`),
    short("9.", String.raw`$2\times10^{2x}+3\times10^x-5=0$`, "$0$", ["0"], String.raw`Avec $X=10^x>0$, $2X^2+3X-5=(X-1)(2X+5)=0$. Seule $X=1$ est admise. **$x=0$.**`),
    written("10.", String.raw`$2^{2x+3}-3\times2^{x+1}+1=0$`, String.raw`Avec $X=2^x>0$, l’équation devient $8X^2-6X+1=(4X-1)(2X-1)=0$. Donc $X=1/4=2^{-2}$ ou $X=1/2=2^{-1}$. **$S=\{-2;-1\}$.**`),
  ]),
  ex(17, "Limites en bases quelconques", "Calcule les limites.", [
    expLimit("a)", String.raw`$\lim_{x\to+\infty}\pi^x$`, "+infini", String.raw`La base $\pi>1$, donc **$\pi^x\to+\infty$**.`),
    expLimit("b)", String.raw`$\lim_{x\to+\infty}10^{-2x}$`, "0", String.raw`$10^{-2x}=e^{-2x\ln10}$. Son exposant tend vers $-\infty$, donc **la limite est $0$**.`),
    expLimit("c)", String.raw`$\lim_{x\to-\infty}5^{x^2}$`, "+infini", String.raw`Lorsque $x\to-\infty$, $x^2\to+\infty$. Comme $5>1$, **la limite est $+\infty$**, et non zéro.`),
    expLimit("d)", String.raw`$\lim_{x\to-\infty}3^{1/x}$`, "1", String.raw`$1/x\to0$. Par continuité de la puissance de base $3$, **$3^{1/x}\to3^0=1$**.`),
    expLimit("e)", String.raw`$\lim_{x\to+\infty}\dfrac{xe^x}{5^x}$`, "0", String.raw`Le quotient est $xe^{-(\ln5-1)x}$. Posons $t=(\ln5-1)x$, avec $\ln5-1>0$. Alors $t\to+\infty$ et l’expression vaut $te^{-t}/(\ln5-1)$. Par croissance comparée, **elle tend vers $0$**.`),
  ]),
  ex(18, "Primitives d’exponentielles en base a", "Détermine une primitive sur R dans chaque cas.", [
    written("1.", String.raw`$f(x)=5^x+2x$`, String.raw`Puisque $(5^x)'=(\ln5)5^x$, une primitive est **$F(x)=5^x/\ln5+x^2$**. Dériver chaque terme redonne $5^x+2x$.`),
    written("2.", String.raw`$f(x)=(\sqrt5)^x$`, String.raw`La base est positive et différente de $1$. **$F(x)=(\sqrt5)^x/\ln\sqrt5=2(\sqrt5)^x/\ln5$** convient.`),
    written("3.", String.raw`$f(x)=1/3^x$`, String.raw`$f(x)=e^{-x\ln3}$. Pour compenser la dérivée $-\ln3$ de l’exposant, on prend **$F(x)=-3^{-x}/\ln3$**.`),
    written("4.", String.raw`$f(x)=3^x/2^{x+1}$`, String.raw`$2^{x+1}=2\times2^x$, donc $f(x)=\frac12(3/2)^x$. Une primitive est **$F(x)=(3/2)^x/(2\ln(3/2))$**. La constante $1/2$ ne doit pas disparaître.`),
  ]),
  ex(19, "Étudier x divisé par 3 puissance x", String.raw`Étudie et représente $f(x)=x/3^x$ sur $\mathbb R$.`, [
    written("Domaine et dérivée", "Précise le domaine et calcule f′.", String.raw`$3^x>0$, donc $D_f=\mathbb R$. Écrivons $f(x)=xe^{-x\ln3}$. La règle du produit donne **$f'(x)=3^{-x}(1-x\ln3)$.**`),
    written("Variation et limites", "Dresse le tableau de variation avec les limites.", String.raw`La dérivée a le signe de $1-x\ln3$, positif avant $a=1/\ln3$, nul en $a$, négatif après. Le maximum est $f(a)=1/(e\ln3)$. En $-\infty$, $x<0$ et $3^{-x}\to+\infty$, donc $f\to-\infty$. En $+\infty$, la croissance comparée donne $f\to0$.

| $x$ | $-\infty$ | $1/\ln3$ | $+\infty$ |
| --- | --- | --- | --- |
| $f$ | $-\infty$ | $\nearrow\ 1/(e\ln3)\ \searrow$ | $0$ |`),
    written("Tracé", "Précise les repères utiles au tracé.", String.raw`La courbe passe par $O(0;0)$, avec une tangente de pente $f'(0)=1$, donc $y=x$. Elle est négative pour $x<0$, positive pour $x>0$, atteint le maximum indiqué puis se rapproche de **$y=0$ en $+\infty$**.`),
  ], { correctionFigureKey: "tc-l5-functions" }),
  ex(20, "Dériver des racines", "Calcule les dérivées en précisant leurs domaines.", [
    written("1.", String.raw`$f(x)=x\sqrt x$`, String.raw`$f$ est définie pour $x\ge0$. Pour $x>0$, $f=x^{3/2}$, donc **$f'(x)=\frac32\sqrt x$**. En $0$, le taux à droite $f(h)/h=\sqrt h$ tend vers $0$ : la dérivée droite vaut $0$.`),
    written("2.", String.raw`$f(x)=\sqrt[3]x$`, String.raw`La racine cubique existe sur $\mathbb R$. Pour $x\ne0$, **$f'(x)=1/(3\sqrt[3]{x^2})$**. En $0$, le taux vaut $1/\sqrt[3]{h^2}$ et tend vers $+\infty$ : **pas de dérivée finie en 0**, mais une tangente verticale.`),
    written("3.", String.raw`$f(x)=1/\sqrt[3]x$`, String.raw`Le domaine est $\mathbb R\setminus\{0\}$. Dérivons l’inverse de $u=\sqrt[3]x$ : $f'=-u'/u^2$. Ainsi **$f'(x)=-1/(3\sqrt[3]{x^4})$** pour $x\ne0$.`),
    written("4.", String.raw`$f(x)=\sqrt[3]{1+\sin x}$`, String.raw`La fonction est définie sur $\mathbb R$. Si $1+\sin x>0$, la dérivée composée est

$$f'(x)=\frac{\cos x}{3(1+\sin x)^{2/3}}.$$

Les zéros de la base sont $x_0=-\pi/2+2k\pi$. Près de $x_0$, $1+\sin(x_0+h)=1-\cos h=2\sin^2(h/2)$. Le taux est un facteur tendant vers $2^{-1/3}>0$, multiplié par $|h|^{2/3}/h$. Il tend vers $-\infty$ à gauche et $+\infty$ à droite. **Il n’y a pas de dérivée finie en ces points.**`),
    written("5.", String.raw`$f(x)=\sqrt[4]{1+x^2}$`, String.raw`$1+x^2>0$ partout, donc $f$ est dérivable sur $\mathbb R$. Avec $u=1+x^2$, $u'=2x$ et $\alpha=1/4$ : **$f'(x)=x/(2(1+x^2)^{3/4})$.**`),
  ]),
  ex(21, "Réduire à une puissance réelle", String.raw`Sur $]0;+\infty[$, écris $f(x)=x^\alpha$, puis calcule sa dérivée.`, [
    written("1.", String.raw`$f(x)=\sqrt[3]{x^2}$`, String.raw`$f=x^{2/3}$, donc **$f'=(2/3)x^{-1/3}$** pour $x>0$. L’expression originale a aussi un sens pour $x<0$ ; ce prolongement n’est pas obtenu en prenant $\ln x$. En $0$, il n’a pas de dérivée finie.`),
    written("2.", String.raw`$f(x)=x^e\sqrt x$`, String.raw`Les exposants s’additionnent : $f=x^{e+1/2}$. **$f'=(e+1/2)x^{e-1/2}$** pour $x>0$.`),
    written("3.", String.raw`$f(x)=\dfrac{x^{0,5}}{\sqrt[4]{x^3}}$`, String.raw`$0{,}5=1/2$ et la racine vaut $x^{3/4}$. Ainsi $f=x^{1/2-3/4}=x^{-1/4}$. **$f'=-\frac14x^{-5/4}$**, avec $x>0$.`),
    written("4.", String.raw`$f(x)=\dfrac{x^{-\ln3}}{x^{1-e}}$`, String.raw`On soustrait les exposants : $f=x^{e-1-\ln3}$. **$f'=(e-1-\ln3)x^{e-2-\ln3}$** sur $]0;+\infty[$.`),
  ]),
  ex(22, "Primitives de puissances et de composées", "Trouve les primitives sur chaque intervalle du domaine.", [
    written("1.", String.raw`$f(x)=\sqrt x/x^5$`, String.raw`Il faut $x>0$. On écrit $f=x^{-9/2}$. Puis $\alpha+1=-7/2$, donc **$F(x)=-\frac27x^{-7/2}+C$**. Sa dérivée est bien $x^{-9/2}$.`),
    written("2.", String.raw`$f(x)=1/\sqrt[3]{1-x}$`, String.raw`Le domaine est $\mathbb R\setminus\{1\}$. Sur chacun des intervalles séparés par $1$, on peut prendre

$$\boxed{F(x)=-\frac32\bigl(\sqrt[3]{1-x}\bigr)^2+C.}$$

La règle de composition fait apparaître le facteur $-1$ ; la dérivation donne $1/\sqrt[3]{1-x}$. Les constantes peuvent être **différentes sur les deux intervalles**.`),
    written("3.", String.raw`$f(x)=x\sqrt{(x^2-1)^5}$`, String.raw`La racine impose $x^2-1\ge0$, donc $|x|\ge1$. Sur $]-\infty;-1[$ et $]1;+\infty[$, posons $u=x^2-1>0$, $u'=2x$. Alors $f=\frac12u'u^{5/2}$, donc **$F(x)=(x^2-1)^{7/2}/7+C$**. La fonction se prolonge aux bornes et le calcul y possède un sens unilatéral.`),
    written("4.", String.raw`$f(x)=\dfrac{x^2}{\sqrt{(x^3-1)^3}}$`, String.raw`Le dénominateur exige $x^3-1>0$, donc $x>1$. Avec $u=x^3-1$, $u'=3x^2$ : $f=\frac13u'u^{-3/2}$. Ainsi **$F(x)=-2/(3\sqrt{x^3-1})+C$**.`),
    written("5.", String.raw`$f(x)=1/(x\sqrt x)$`, String.raw`$x>0$ et $f=x^{-3/2}$. On augmente l’exposant d’une unité et divise par $-1/2$ : **$F(x)=-2/\sqrt x+C$**.`),
  ]),
  ex(23, "Croissances comparées", "Calcule les neuf limites.", [
    expLimit("1.", String.raw`$\lim_{x\to+\infty}x^3/e^x$`, "0", String.raw`$x^3/e^x=x^3e^{-x}$. La croissance comparée avec l’exposant $3>0$ donne **$0$**.`),
    expLimit("2.", String.raw`$\lim_{x\to+\infty}(e^x-x^2)$`, "+infini", String.raw`Factorisons par $e^x$ : $e^x(1-x^2e^{-x})$. La parenthèse tend vers $1>0$, donc **le produit tend vers $+\infty$**.`),
    expLimit("3.", String.raw`$\lim_{x\to+\infty}(\ln x-x^2)$`, "-infini", String.raw`On écrit $x^2((\ln x)/x^2-1)$. Le quotient tend vers $0$ ; la parenthèse vers $-1$. **La limite vaut $-\infty$.**`),
    expLimit("4.", String.raw`$\lim_{x\to+\infty}2^x/x$`, "+infini", String.raw`Posons $t=x\ln2\to+\infty$. $2^x/x=(\ln2)e^t/t$, qui tend vers **$+\infty$**.`),
    expLimit("5.", String.raw`$\lim_{x\to+\infty}e^{2x}/\ln x$`, "+infini", String.raw`Pour $x$ assez grand, le quotient est positif. Écrivons $(e^{2x}/x)(x/\ln x)$. Les deux facteurs tendent vers $+\infty$, par croissance comparée et par inverse d’un quotient tendant vers $0^+$. **Limite : $+\infty$.**`),
    expLimit("6.", String.raw`$\lim_{x\to+\infty}(x+1)^2e^x$`, "+infini", String.raw`Les deux facteurs sont positifs et tendent vers $+\infty$. **La limite est $+\infty$.**`),
    expLimit("7.", String.raw`$\lim_{x\to+\infty}x(\ln x)^3$`, "+infini", String.raw`Pour $x>1$, les deux facteurs sont positifs. $x\to+\infty$ et $(\ln x)^3\to+\infty$, donc **le produit tend vers $+\infty$**.`),
    expLimit("8.", String.raw`$\lim_{x\to+\infty}x^3e^x$`, "+infini", String.raw`Lorsque $x\to+\infty$, les deux facteurs $x^3$ et $e^x$ sont positifs et tendent vers $+\infty$. **Le produit tend vers $+\infty$.**`),
    expLimit("9.", String.raw`$\lim_{x\to+\infty}e^x/(x^3+1)$`, "+infini", String.raw`Divisons par $x^3$ : $(e^x/x^3)/(1+1/x^3)$. Le numérateur tend vers $+\infty$, le dénominateur vers $1$. **La limite est $+\infty$.**`),
  ]),
];
