import { short, tf, written } from "./builders";
import { exponentialExercise as ex, expLimit } from "./terminalCExponentialPowerBuilders";

export const exponentialFixation = [
  ex(1, "Propriétés de l’exponentielle", "Indique si chaque affirmation est vraie ou fausse.", [
    tf("1.", "La fonction exponentielle népérienne est une bijection de R sur ]0 ; +∞[.", true, String.raw`Tout nombre $b>0$ possède l’unique antécédent $\ln b$ : $e^{\ln b}=b$. C’est bien une bijection **de $\mathbb R$ sur $]0;+\infty[$**, pas de $\mathbb R$ sur $\mathbb R$.`),
    tf("2.", String.raw`L’exponentielle est la réciproque de $x\mapsto1/x$ sur $]0;+\infty[$.`, false, String.raw`La réciproque de l’exponentielle est **$\ln$**, et non la fonction inverse. On a $\ln(e^x)=x$, alors que $1/e^x=e^{-x}$.`),
    tf("3.", "L’ensemble de définition de l’exponentielle est R.", true, String.raw`$e^x$ existe pour tout réel $x$, positif, négatif ou nul. **Son domaine est $\mathbb R$.**`),
    tf("4.", "L’exponentielle est strictement décroissante sur R.", false, String.raw`Sa dérivée vaut $e^x>0$. Elle est donc **strictement croissante** sur $\mathbb R$.`),
    tf("5.", String.raw`$-20<0$, donc $\exp(-20)<0$.`, false, String.raw`Toute exponentielle est strictement positive, même lorsque son exposant est négatif : **$e^{-20}=1/e^{20}>0$**.`),
    tf("6.", String.raw`$\ln(e^{\ln4})=\ln4$.`, true, String.raw`$e^{\ln4}=4$, donc **$\ln(e^{\ln4})=\ln4$**.`),
    tf("7.", String.raw`$e^{\ln2}=2\ln2$.`, false, String.raw`La réciprocité donne **$e^{\ln2}=2$**, pas $2\ln2$.`),
    tf("8.", String.raw`$e^{\ln3}=3$.`, true, String.raw`$3>0$, donc la formule $e^{\ln a}=a$ s’applique et donne bien **$3$**.`),
    tf("9.", String.raw`$y=\ln4\iff e^y=4$.`, true, String.raw`La fonction $\ln$ est la réciproque de $\exp$. Les deux égalités expriment donc **la même relation**.`),
  ]),
  ex(2, "Simplifier avec ln et exp", "Écris plus simplement chaque expression.", [
    short("A", String.raw`$e^{\ln3}$`, "$3$", ["3"], String.raw`$3>0$, donc $e^{\ln3}=\boxed3$.`),
    short("B", String.raw`$e^{-\ln5}$`, "$1/5$", ["1/5"], String.raw`$e^{-\ln5}=1/e^{\ln5}=\boxed{1/5}$.`),
    written("C", String.raw`$e^{2+\ln3}$`, String.raw`Séparons la somme de l’exposant : $e^{2+\ln3}=e^2e^{\ln3}=\boxed{3e^2}$.`),
    short("D", String.raw`$e^{1-\ln2}$`, "$e/2$", ["e/2"], String.raw`$e^{1-\ln2}=e/e^{\ln2}=\boxed{e/2}$.`),
    written("E", String.raw`$e^{1/2-\ln6}$`, String.raw`On obtient $e^{1/2}/e^{\ln6}=\sqrt e/6$. **Le résultat est $\sqrt e/6$.**`),
    short("F", String.raw`$\ln\sqrt{e^5}$`, "$5/2$", ["5/2"], String.raw`$\sqrt{e^5}=e^{5/2}$, donc $\ln\sqrt{e^5}=\boxed{5/2}$.`),
    short("G", String.raw`$e^{3\ln5}$`, "$125$", ["125"], String.raw`$3\ln5=\ln(5^3)$, donc $e^{3\ln5}=5^3=\boxed{125}$.`),
    written("H", String.raw`$\dfrac{e^{1+\ln2}}{e^{2+\ln3}}$`, String.raw`On soustrait les exposants : $e^{-1+\ln2-\ln3}=e^{-1}(2/3)=\boxed{2/(3e)}$.`),
    written("I", String.raw`$e^{\ln(x+1)}e^{-\ln(x-2)}$`, String.raw`Il faut $x+1>0$ et $x-2>0$, donc **$x>2$**. Sur cet intervalle, le produit vaut **$(x+1)/(x-2)$**. La simplification n’autorise pas à élargir le domaine initial.`),
  ]),
  ex(3, "Écrire une seule puissance de e", "Regroupe les exposants.", [
    written("R", String.raw`$e^7/e^2$`, String.raw`Dans un quotient, on soustrait les exposants : $e^{7-2}=\boxed{e^5}$.`),
    written("S", String.raw`$(e^7)^4/e$`, String.raw`$(e^7)^4=e^{28}$ puis $e^{28}/e^1=\boxed{e^{27}}$.`),
    written("T", String.raw`$e^{-x}e^{2x}$`, String.raw`On additionne $-x$ et $2x$ : **$e^{-x+2x}=e^x$**.`),
    written("U", String.raw`$(e^{-2x})^3(e^x)^7$`, String.raw`Les deux puissances sont $e^{-6x}$ et $e^{7x}$. Leur produit est **$e^x$**.`),
    written("V", String.raw`$e^{-4x}/(e^x)^2$`, String.raw`Le dénominateur vaut $e^{2x}>0$. Le quotient est $e^{-4x-2x}=\boxed{e^{-6x}}$.`),
  ]),
  ex(4, "Simplifier chaque nombre", "Utilise la réciprocité entre ln et exp.", [
    short("a)", String.raw`$\ln(e^{-2/3})$`, "$-2/3$", ["-2/3"], String.raw`Pour tout réel $u$, $\ln(e^u)=u$. Ici le résultat est **$-2/3$**.`),
    short("b)", String.raw`$e^{\ln3-1}$`, "$3/e$", ["3/e"], String.raw`$e^{\ln3-1}=e^{\ln3}/e=\boxed{3/e}$.`),
    short("c)", String.raw`$e^{5\ln3}-3e^{\ln7}$`, "$222$", ["222"], String.raw`$e^{5\ln3}=3^5=243$ et $e^{\ln7}=7$. Donc $243-3\times7=\boxed{222}$.`),
    written("d)", String.raw`$e^{\ln(x^2+1)}+\ln(e^{-2x+3})$`, String.raw`$x^2+1>0$ pour tout réel $x$, donc l’expression est définie sur $\mathbb R$. Elle vaut $(x^2+1)+(-2x+3)=\boxed{x^2-2x+4}$.`),
  ]),
  ex(5, "Équations exponentielles simples", String.raw`Résous dans $\mathbb R$.`, [
    short("a)", String.raw`$e^{2x-3}=1$`, "$3/2$", ["3/2"], String.raw`$1=e^0$. Par injectivité, $2x-3=0$, donc **$x=3/2$**.`),
    short("b)", String.raw`$e^x=2$`, String.raw`$\ln2$`, ["ln2", "ln(2)"], String.raw`$2>0$. En appliquant $\ln$, on trouve l’unique solution **$x=\ln2$**.`),
    written("c)", String.raw`$e^{-2x}=-2$`, String.raw`Pour tout réel $x$, $e^{-2x}>0$, alors que $-2<0$. **Aucune solution : $S=\varnothing$.**`),
    short("d)", String.raw`$e^{3x+1}=e^{1-5x}$`, "$0$", ["0"], String.raw`Les bases sont les mêmes : $3x+1=1-5x$, donc $8x=0$ et **$x=0$**.`),
    short("e)", String.raw`$e^{4x+1}=3$`, String.raw`$(\ln3-1)/4$`, ["(ln(3)-1)/4", "(ln3-1)/4"], String.raw`$4x+1=\ln3$, donc **$x=(\ln3-1)/4$**.`),
    short("f)", String.raw`$e^{2x}=e^{-x}$`, "$0$", ["0"], String.raw`$2x=-x$, donc $3x=0$ et **$x=0$**.`),
  ]),
  ex(6, "Équations avec un changement de variable", String.raw`Résous dans $\mathbb R$.`, [
    written("a)", String.raw`$e^{2x}-3e^x+2=0$`, String.raw`Posons $X=e^x>0$. $X^2-3X+2=(X-1)(X-2)=0$. Les deux racines sont positives. **$S=\{0;\ln2\}$.**`),
    short("b)", String.raw`$e^x+e^{-x}-2=0$`, "$0$", ["0"], String.raw`On multiplie par $e^x>0$ : $e^{2x}-2e^x+1=0$, soit $(e^x-1)^2=0$. **$x=0$.**`),
    written("c)", String.raw`$e^x-5+6/e^x=0$`, String.raw`Multiplions par $e^x>0$, puis posons $X=e^x$ : $X^2-5X+6=(X-2)(X-3)=0$. **$S=\{\ln2;\ln3\}$.**`),
    short("d)", String.raw`$2e^x(e^x-6e^{-x})=5e^x$`, String.raw`$\ln4$`, ["ln4", "ln(4)"], String.raw`Le produit à gauche vaut $2e^{2x}-12$. Avec $X=e^x>0$, $2X^2-5X-12=(2X+3)(X-4)=0$. On rejette $-3/2$. **$x=\ln4$.**`),
  ]),
  ex(7, "Inéquations par comparaison des exposants", String.raw`Résous dans $\mathbb R$.`, [
    written("a)", String.raw`$e^{-3x-1}>3$`, String.raw`La croissance de $\exp$ donne $-3x-1>\ln3$. En divisant par $-3$, on inverse le sens : **$S=]-\infty;(-1-\ln3)/3[$**.`),
    written("b)", String.raw`$e^{x-6}>1$`, String.raw`$1=e^0$, donc $x-6>0$. **$S=]6;+\infty[$.**`),
    written("c)", String.raw`$e^{2x+2}-e^{3x-5}<0$`, String.raw`Cela revient à $e^{2x+2}<e^{3x-5}$, puis $2x+2<3x-5$. **$S=]7;+\infty[$.**`),
    written("d)", String.raw`$e^{3x+2}<e$`, String.raw`On compare à $e^1$ : $3x+2<1$, donc **$S=]-\infty;-1/3[$**.`),
  ]),
  ex(8, "Signe d’un polynôme en e puissance x", String.raw`Résous dans $\mathbb R$.`, [
    written("a)", String.raw`$e^{2x}-3e^x+2\ge0$`, String.raw`Avec $X=e^x>0$, on résout $(X-1)(X-2)\ge0$, soit $0<X\le1$ ou $X\ge2$. La croissance de $\ln$ donne **$S=]-\infty;0]\cup[\ln2;+\infty[$**.`),
    written("b)", String.raw`$e^{2x}+3e^x+4<0$`, String.raw`Chacun des trois termes est positif, donc la somme est strictement positive. **$S=\varnothing$.**`),
    written("c)", String.raw`$e^{2x}-9\ge0$`, String.raw`$e^{2x}\ge9=e^{\ln9}$, donc $2x\ge\ln9=2\ln3$. **$S=[\ln3;+\infty[$.**`),
    written("d)", String.raw`$e^{2x}+e^x-6\le0$`, String.raw`$X^2+X-6=(X+3)(X-2)$. Comme $X>0$, le facteur $X+3$ est positif. Il reste $0<X\le2$, donc **$S=]-\infty;\ln2]$.**`),
  ]),
  ex(9, "Systèmes exponentiels", String.raw`Résous dans $\mathbb R\times\mathbb R$.`, [
    written("a)", String.raw`$\begin{cases}e^x+e^y=5,\\e^x-e^y=3.\end{cases}$`, String.raw`En additionnant, $2e^x=8$, donc $e^x=4$. La première égalité donne $e^y=1$. **$(x;y)=(\ln4;0)$.**`),
    written("b)", String.raw`$\begin{cases}e^x+2e^y=3,\\x+y=0.\end{cases}$`, String.raw`$y=-x$, donc $e^y=1/e^x$. Posons $X=e^x>0$ : $X+2/X=3$, soit $(X-1)(X-2)=0$. **Les solutions sont $(0;0)$ et $(\ln2;-\ln2)$.**`),
    written("c)", String.raw`$\begin{cases}xy=-15,\\e^xe^y=e^{-2}.\end{cases}$`, String.raw`La seconde égalité donne $x+y=-2$. Les nombres $x,y$ sont les racines de $T^2+2T-15=(T-3)(T+5)$. **Les couples sont $(3;-5)$ et $(-5;3)$.**`),
  ]),
  ex(10, "Limites d’expressions exponentielles", "Calcule chaque limite.", [
    expLimit("1.", String.raw`$\lim_{x\to+\infty}(x^2+e^x)$`, "+infini", String.raw`$x^2\to+\infty$ et $e^x\to+\infty$. **La somme tend vers $+\infty$.**`),
    expLimit("2.", String.raw`$\lim_{x\to+\infty}(x-4e^x)$`, "-infini", String.raw`On écrit $e^x(xe^{-x}-4)$. Le premier facteur tend vers $+\infty$ et la parenthèse vers $-4$, puisque $xe^{-x}\to0$. **La limite vaut $-\infty$.**`),
    expLimit("3.", String.raw`$\lim_{x\to+\infty}\dfrac{e^{2x}-2}{e^{3x}+1}$`, "0", String.raw`Divisons par $e^{3x}$ : $(e^{-x}-2e^{-3x})/(1+e^{-3x})$. Le numérateur tend vers $0$ et le dénominateur vers $1$. **Limite : $0$.**`),
    expLimit("4.", String.raw`$\lim_{x\to+\infty}(x^2-x+1)e^{-x}$`, "0", String.raw`On développe en $x^2e^{-x}-xe^{-x}+e^{-x}$. Par croissance comparée, chacun des trois termes tend vers $0$. **La limite est $0$.**`),
    expLimit("5.", String.raw`$\lim_{x\to-\infty}\dfrac{5-e^{-x}}{1+2e^x}$`, "-infini", String.raw`Lorsque $x\to-\infty$, $e^{-x}\to+\infty$ et $e^x\to0$. Le numérateur tend vers $-\infty$, le dénominateur vers $1>0$. **Limite : $-\infty$.**`),
    expLimit("6.", String.raw`$\lim_{x\to0}\dfrac{e^{2x}-1}{x}$`, "2", String.raw`Écrivons $2(e^{2x}-1)/(2x)$ et posons $u=2x$. Quand $x\to0$, $u\to0$ et $(e^u-1)/u\to1$. **La limite vaut $2$.**`),
    expLimit("7.", String.raw`$\lim_{x\to0}\dfrac{xe^x}{e^x-1}$`, "1", String.raw`Le quotient est $e^x\,x/(e^x-1)$. Les deux facteurs tendent vers $1$. **La limite vaut $1$.**`),
  ]),
  ex(11, "Dériver des produits et quotients", "Calcule la dérivée sur le domaine approprié.", [
    written("a)", String.raw`$f(x)=(2x+1)e^{-x}$`, String.raw`Les deux facteurs sont dérivables sur $\mathbb R$. Avec la règle du produit : $f'=2e^{-x}-(2x+1)e^{-x}=\boxed{(1-2x)e^{-x}}$.`),
    written("b)", String.raw`$g(x)=\dfrac{e^{2x}-2}{1-e^{2x}}$`, String.raw`Le dénominateur s’annule seulement en $x=0$. Sur $\mathbb R\setminus\{0\}$, la règle du quotient donne

$$g'(x)=\frac{2e^{2x}(1-e^{2x})+2e^{2x}(e^{2x}-2)}{(1-e^{2x})^2}=\boxed{\frac{-2e^{2x}}{(1-e^{2x})^2}}.$$`),
    written("c)", String.raw`$h(x)=\dfrac{x}{1+xe^x}$`, String.raw`$xe^x$ atteint son minimum $-1/e$ en $-1$, donc $1+xe^x\ge1-1/e>0$ : $h$ est définie sur $\mathbb R$. La dérivée du dénominateur est $(1+x)e^x$ :

$$h'(x)=\frac{1+xe^x-x(1+x)e^x}{(1+xe^x)^2}=\boxed{\frac{1-x^2e^x}{(1+xe^x)^2}}.$$`),
  ]),
  ex(12, "Reconnaître une primitive", "Calcule une primitive sur l’intervalle indiqué.", [
    written("a)", String.raw`$f(x)=2xe^{3x^2+1}$ sur $\mathbb R$.`, String.raw`Posons $u=3x^2+1$, donc $u'=6x$. Puisque $2x=u'/3$, **$F(x)=e^{3x^2+1}/3$** convient. Sa dérivée vaut $(1/3)6xe^{3x^2+1}=2xe^{3x^2+1}$.`),
    written("b)", String.raw`$g(x)=\dfrac{1-e^{-2x}}{2x+e^{-2x}}$ sur $]0;+\infty[$.`, String.raw`Posons $u=2x+e^{-2x}>0$ sur cet intervalle. $u'=2-2e^{-2x}$, donc $g=u'/(2u)$. **$G(x)=\frac12\ln(2x+e^{-2x})$** convient.`),
  ]),
  ex(13, "Décomposition et constante d’intégration", String.raw`Soit $f(x)=\dfrac{e^x(e^x-1)}{e^x+3}$ sur $\mathbb R$.`, [
    written("a)", String.raw`Détermine $a,b$ tels que $f(x)=ae^x+\dfrac{be^x}{e^x+3}$.`, String.raw`Après mise au même dénominateur, le numérateur est $ae^{2x}+(3a+b)e^x$. On le compare à $e^{2x}-e^x$ : $a=1$ et $3a+b=-1$, donc **$a=1,b=-4$.**`),
    written("b)", "Calcule la primitive F de f qui s’annule en 0.", String.raw`On intègre $e^x-4e^x/(e^x+3)$. Comme $e^x+3>0$, les primitives sont $e^x-4\ln(e^x+3)+C$. La condition $F(0)=0$ donne $1-4\ln4+C=0$.

$$\boxed{F(x)=e^x-4\ln(e^x+3)-1+4\ln4.}$$

La dérivation redonne $f$ et le remplacement de $x$ par $0$ donne bien $0$.`),
  ]),
];
