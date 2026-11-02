import { integralExercise as ex, written, short } from "./terminalCIntegralBuilders";

export const integralDeepeningB = [
  ex(50, "Une suite d’intégrales exponentielles", String.raw`Pour $n\ge0$, $I_n=\int_0^1x^ne^x\,dx$.`, [
    written("1.", "Calcule I₀ et I₁.", String.raw`$I_0=[e^x]_0^1=e-1$. Pour $I_1$, posons $u=x$, $v'=e^x$ :
$$I_1=[xe^x]_0^1-\int_0^1e^x\,dx=e-(e-1)=\boxed1.$$`),
    written("2.", String.raw`Démontre $I_{n+1}=e-(n+1)I_n$.`, String.raw`Prenons $u=x^{n+1}$ et $v'=e^x$. Alors $u'=(n+1)x^n$ et $v=e^x$ :
$$I_{n+1}=[x^{n+1}e^x]_0^1-(n+1)\int_0^1x^ne^x\,dx.$$
Le crochet vaut $e$ pour tout $n\ge0$. D’où **$I_{n+1}=e-(n+1)I_n$**.`),
    written("3.", String.raw`Calcule $J=\int_0^1(x^3+2x^2-2x+1)e^x\,dx$.`, String.raw`La relation donne $I_2=e-2$ et $I_3=e-3(e-2)=6-2e$. Par linéarité :
$$J=I_3+2I_2-2I_1+I_0.$$
$$J=(6-2e)+2(e-2)-2+(e-1)=\boxed{e-1}.$$`),
  ]),
  ex(51, "Deux produits trigonométriques", String.raw`$I=\int_{-\pi}^{\pi}\cos2x\cos4x\,dx$, $K=\int_{-\pi}^{\pi}\sin2x\sin4x\,dx$.`, [
    written("1.", "Calcule I + K et I − K.", String.raw`Avec $\cos(A-B)=\cos A\cos B+\sin A\sin B$, on obtient :
$$I+K=\int_{-\pi}^{\pi}\cos2x\,dx=[\sin2x/2]_{-\pi}^{\pi}=0.$$
Avec $\cos(A+B)=\cos A\cos B-\sin A\sin B$ :
$$I-K=\int_{-\pi}^{\pi}\cos6x\,dx=[\sin6x/6]_{-\pi}^{\pi}=0.$$`),
    written("2.", "Déduis les valeurs de I et K.", String.raw`En additionnant les deux égalités : $2I=0$, donc $I=0$. Puis $K=(I+K)-I=0$. **Les deux intégrales sont nulles.**`),
  ]),
  ex(52, "Étude complète d’une fonction intégrale", String.raw`Pour $x>0$, $F(x)=\int_1^x e^t/t\,dt$. Le repère est orthonormé.`, [
    written("1.a", "Étudie les variations de F.", String.raw`L’intégrande est continue sur $]0;+\infty[$. Le théorème de la borne variable donne $F'(x)=e^x/x>0$. **F est strictement croissante** sur tout son domaine.`),
    written("1.b", "Déduis le signe de F.", String.raw`$F(1)=0$. Par croissance stricte, **$F(x)<0$ pour $0<x<1$ et $F(x)>0$ pour $x>1$**.`),
    written("2.a", String.raw`Étudie le signe de $f(x)=F(x)-\ln x$.`, String.raw`$f'(x)=(e^x-1)/x>0$ pour $x>0$, et $f(1)=0$. La fonction est strictement croissante : **elle est négative avant1, nulle en1, positive après1**.`),
    written("2.b", "Déduis les limites de F en 0 et en +∞.", String.raw`Pour $0<x<1$, la question précédente donne $F(x)<\ln x$. Comme $\ln x\to-\infty$ en $0^+$, **$F(x)\to-\infty$**.

Pour $x>1$, $F(x)>\ln x$. Comme $\ln x\to+\infty$, **$F(x)\to+\infty$**.`),
    written("3.a", "Détermine la tangente T au point d’abscisse1.", String.raw`$F(1)=0$ et $F'(1)=e$. La formule de la tangente donne **$T:y=e(x-1)$**.`),
    written("3.b", "Précise la position de T par rapport à la courbe.", String.raw`Posons $D(x)=F(x)-e(x-1)$. Alors $D'(x)=e^x/x-e$.

La fonction $x-1-\ln x$ a pour dérivée $1-1/x$ et pour minimum0 en1. Donc $x-1\ge\ln x$, puis $e^x/x\ge e$ ; ainsi $D'\ge0$. L’égalité n’a lieu qu’en1 et $D(1)=0$.

**La courbe est sous T pour $0<x<1$ et au-dessus pour $x>1$ ; elles se touchent en $(1;0)$.**`),
    written("4.a", String.raw`Démontre $e^t>t e^{t/2}$ pour $t>1$.`, String.raw`La fonction $q(t)=t/2-\ln t$ a pour dérivée $1/2-1/t$. Elle décroît jusqu’à2 puis croît ; son minimum vaut $1-\ln2>0$.

Donc $t/2>\ln t$, puis $e^{t/2}>t$. En multipliant par $e^{t/2}>0$, on trouve **$e^t>t e^{t/2}$**.`),
    written("4.b", String.raw`Déduis $\lim_{x\to+\infty}F(x)/x$.`, String.raw`Pour $t>1$, $e^t/t>e^{t/2}$. En intégrant entre1 et $x>1$ :
$$F(x)\ge\int_1^xe^{t/2}\,dt=2(e^{x/2}-e^{1/2}).$$
Après division par $x>0$, le membre de droite tend vers $+\infty$ par croissance comparée. **Donc $F(x)/x\to+\infty$.**`),
    written("4.c", "Interprète graphiquement les deux limites en +∞.", String.raw`Puisque $F(x)\to+\infty$ et $F(x)/x\to+\infty$, la courbe a une **branche parabolique de direction l’axe des ordonnées** en $+\infty$. Elle n’y possède pas d’asymptote affine.`),
    written("5.", "Construis T et la courbe de F.", String.raw`Place $(1;0)$, trace $T:y=e(x-1)$ et l’asymptote verticale $x=0$. La courbe monte de $-\infty$ à $+\infty$.

Pour préciser la forme, $F''(x)=e^x(x-1)/x^2$ : elle est concave avant1 et convexe après1, avec inflexion en1. Respecte les positions par rapport à T démontrées en3.b et la branche de direction verticale à droite. La figure utilise une intégration numérique seulement pour le tracé, pas pour les preuves.`),
  ], { correctionFigureKey: "tc-l7-integrals" }),
  ex(53, "Une valeur moyenne sur un demi-cercle", String.raw`Un cercle a pour diamètre $[AB]$ et rayon $R>0$. Le point $M$ décrit un demi-cercle ; $H$ est son projeté orthogonal sur $(AB)$.`, [
    written("a)", String.raw`Calcule la valeur moyenne de $AM^2$ lorsque la position de $M$ est paramétrée par $\theta=\widehat{BAM}\in[0;\pi/2]$.`, String.raw`Le triangle $AMB$ est rectangle en $M$ car $AB$ est un diamètre. Avec $AB=2R$, $\cos\theta=AM/(2R)$, donc $AM^2=4R^2\cos^2\theta$.
$$\mu_\theta=\frac2\pi\int_0^{\pi/2}4R^2\cos^2\theta\,d\theta.$$
Or $\int_0^{\pi/2}\cos^2\theta\,d\theta=\pi/4$. **Ainsi $\mu_\theta=2R^2$.**`),
    written("b)", "Calcule la valeur moyenne de AM² lorsque le paramètre est x = AH.", String.raw`Dans le triangle rectangle, la projection donne $AM^2=AB\cdot AH=2Rx$, avec $x\in[0;2R]$.
$$\mu_x=\frac1{2R}\int_0^{2R}2Rx\,dx=\left[\frac{x^2}2\right]_0^{2R}=\boxed{2R^2}.$$
Les deux paramétrages donnent ici le même résultat ; ce n’est pas une règle générale pour n’importe quelle moyenne.`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(54, "Somme et différence de deux intégrales", String.raw`$I=\int_0^\pi(x-1)\cos^2x\,dx$ et $J=\int_0^\pi(x-1)\sin^2x\,dx$.`, [
    written("1.a", "Calcule I + J.", String.raw`$\cos^2x+\sin^2x=1$. Donc :
$$I+J=\int_0^\pi(x-1)\,dx=\left[\frac{x^2}2-x\right]_0^\pi=\frac{\pi^2}2-\pi.$$`),
    written("1.b", "Calcule I − J par parties.", String.raw`$\cos^2x-\sin^2x=\cos2x$. Posons $u=x-1$, $v'=\cos2x$, donc $v=\sin2x/2$ :
$$I-J=\left[\frac{(x-1)\sin2x}2\right]_0^\pi-\frac12\int_0^\pi\sin2x\,dx=0.$$
Le crochet est nul et l’intégrale vaut $[-\cos2x/2]_0^\pi=0$.`),
    written("2.", "Déduis les valeurs de I et J.", String.raw`$I-J=0$, donc $I=J$. Chacune est la moitié de la somme :
$$\boxed{I=J=\frac{\pi^2}4-\frac\pi2.}$$`),
  ]),
  ex(55, "Déterminer toutes les primitives", String.raw`$f(x)=x\sqrt{3-x}$ sur $]-\infty;3]$.`, [
    written("1.", "Détermine les primitives de f.", String.raw`Posons $u=3-x$, donc $x=3-u$ et $dx=-du$. On obtient :
$$\int x\sqrt{3-x}\,dx=-\int(3-u)\sqrt u\,du.$$
$$\int x\sqrt{3-x}\,dx=-2u^{3/2}+\frac25u^{5/2}+C.$$
Ainsi **$F(x)=-2(3-x)^{3/2}+\frac25(3-x)^{5/2}+C$**, $C\in\mathbb R$. La dérivation sur $x<3$ redonne $f$ ; l’expression et sa dérivée à gauche se prolongent en3.`),
  ]),
  ex(56, "Une décomposition utile à une intégration par parties", String.raw`$K=\int_1^2dx/[x(x+2)^2]$ et $L=\int_1^2\ln x/(x+2)^3\,dx$. On admet $\frac1{x(x+2)^2}=\frac1{4x}-\frac1{4(x+2)}-\frac1{2(x+2)^2}$.`, [
    written("1.", String.raw`Justifie $K=\ln3/4-\ln2/4-1/24$.`, String.raw`Intégrons les trois termes :
$$K=\left[\frac14\ln x-\frac14\ln(x+2)+\frac1{2(x+2)}\right]_1^2.$$
Les logarithmes donnent $\frac14(\ln2-\ln4+\ln3)=\frac14(\ln3-\ln2)$. Les fractions donnent $1/8-1/6=-1/24$. D’où le résultat demandé.`),
    written("2.a", String.raw`Par parties, justifie $L=-\ln2/32+K/2$.`, String.raw`Prenons $u=\ln x$, $u'=1/x$, $v'=1/(x+2)^3$ et $v=-1/[2(x+2)^2]$ :
$$L=\left[-\frac{\ln x}{2(x+2)^2}\right]_1^2+\frac12\int_1^2\frac{dx}{x(x+2)^2}.$$
Le crochet vaut $-\ln2/32$ ; la dernière intégrale est $K$.`),
    written("2.b", "Déduis la valeur de L.", String.raw`En remplaçant $K$ :
$$L=-\frac{\ln2}{32}+\frac{\ln3}8-\frac{\ln2}8-\frac1{48}.$$
**Donc $L=\ln3/8-5\ln2/32-1/48$.**`),
  ]),
  ex(57, "Majorer l’erreur de la méthode des rectangles", String.raw`$a<b$, $f$ est dérivable sur $[a;b]$ et $f'$ est continue. Pour $n\ge2$, $h=(b-a)/n$, $x_i=a+ih$, $R_n=h\sum_{i=0}^{n-1}f(x_i)$ et $E_n=\int_a^bf-R_n$.`, [
    written("1.", String.raw`Justifie l’existence d’un réel $M>0$ tel que $|f'|\le M$.`, String.raw`$|f'|$ est continue sur le segment $[a;b]$, donc elle y atteint un maximum fini $m\ge0$. On peut prendre **$M=m+1$**, ce qui donne même $|f'|<M$ et assurera l’inégalité stricte de la question2.`),
    written("2.", String.raw`Démontre $\int_a^b|f(x)-f(a)|\,dx<M(b-a)^2/2$.`, String.raw`Par l’inégalité des accroissements finis, pour $x>a$ :
$$|f(x)-f(a)|\le m(x-a)<M(x-a).$$
En intégrant, on obtient :
$$\int_a^b|f(x)-f(a)|\,dx<M\int_a^b(x-a)\,dx=\frac{M(b-a)^2}2.$$
Le choix strictement plus grand que le maximum justifie le signe strict.`),
    written("3.a", String.raw`Écris $E_n$ comme somme de $\int_{x_i}^{x_{i+1}}(f(x)-f(x_i))\,dx$.`, String.raw`Par Chasles, $\int_a^bf=\sum_i\int_{x_i}^{x_{i+1}}f$. Comme chaque intervalle a longueur $h$, $hf(x_i)=\int_{x_i}^{x_{i+1}}f(x_i)\,dx$. En soustrayant terme à terme :
$$\boxed{E_n=\sum_{i=0}^{n-1}\int_{x_i}^{x_{i+1}}(f(x)-f(x_i))\,dx.}$$`),
    written("3.b", String.raw`Déduis $|E_n|\le M(b-a)^2/(2n)$.`, String.raw`L’inégalité triangulaire et $|f(x)-f(x_i)|\le M(x-x_i)$ donnent :
$$|E_n|\le\sum_{i=0}^{n-1}\int_{x_i}^{x_{i+1}}M(x-x_i)\,dx.$$
Chaque terme vaut $Mh^2/2$. La somme vaut $nMh^2/2=M(b-a)^2/(2n)$, comme demandé.`),
    written("4–5.", String.raw`Application à $f(x)=e^{-x^2}$ sur $[0;1]$ : trouve une borne de $|f'|$.`, String.raw`$f'(x)=-2xe^{-x^2}$ ; sur $[0;1]$, $|f'|=2xe^{-x^2}$. Sa dérivée est $2e^{-x^2}(1-2x^2)$ : le maximum est atteint en $1/\sqrt2$ et vaut **$M_0=\sqrt{2/e}$**.

La démonstration avec des signes larges reste valable avec ce maximum, et donne $|E_n|\le M_0/(2n)$.`),
    short("6.", String.raw`Donne le plus petit entier $n$ que cette borne garantit pour une erreur au plus $10^{-4}$.`, "$4289$", ["4289"], String.raw`Il faut $\sqrt{2/e}/(2n)\le10^{-4}$, soit $n\ge5000\sqrt{2/e}\approx4288,8194$. **Le premier entier garanti est $4289$**. C’est une garantie par la borne, pas la preuve qu’un nombre inférieur échouerait réellement.`),
  ]),
  ex(58, "Fonction bornée et aire", String.raw`$f(x)=x/\sqrt{x^2+1}$. Le repère est orthogonal avec $OI=2$ cm et $OJ=3$ cm.`, [
    written("1.a", "Calcule les limites en +∞ et −∞.", String.raw`Pour $x\ne0$, $f(x)=\frac{x}{|x|}\frac1{\sqrt{1+1/x^2}}$. Donc **$f\to1$ en $+\infty$ et $f\to-1$ en $-\infty$** ; les deux droites horizontales sont des asymptotes.`),
    written("1.b", String.raw`Justifie $f'(x)=1/[(x^2+1)\sqrt{x^2+1}]$.`, String.raw`En écrivant $f=x(x^2+1)^{-1/2}$ :
$$f'=(x^2+1)^{-1/2}-x^2(x^2+1)^{-3/2}=\frac{(x^2+1)-x^2}{(x^2+1)^{3/2}}.$$
On obtient bien **$f'=1/(x^2+1)^{3/2}$**.`),
    written("1.c", "Dresse le tableau de variation.", String.raw`La dérivée est strictement positive sur $\mathbb R$. **f croît strictement de −1 à1**, en passant par $f(0)=0$. Les valeurs −1 et1 ne sont jamais atteintes.`),
    written("2.", "Trace la courbe dans le repère donné.", String.raw`La fonction est impaire, donc la courbe est symétrique par rapport à O. Place O, les asymptotes $y=\pm1$ et les points $(\pm\sqrt3;\pm\sqrt3/2)$. Respecte l’échelle : **un pas horizontal représente2cm, un pas vertical3cm**.`),
    written("3.", String.raw`Calcule l’aire entre la courbe, l’axe et $x=0$, $x=\sqrt3$.`, String.raw`Sur $[0;\sqrt3]$, $f\ge0$. Une primitive est $\sqrt{x^2+1}$ :
$$\mathcal A_{\text{unités}}=[\sqrt{x^2+1}]_0^{\sqrt3}=2-1=1.$$
Une unité vaut $2\times3=6$ cm². **Donc $\mathcal A=6$ cm².**`),
  ], { correctionFigureKey: "tc-l7-integrals" }),
  ex(59, "Un système d’intégrales avec une exponentielle", String.raw`$I=\int_0^\pi e^x\cos^2x\,dx$, $J=\int_0^\pi e^x\sin^2x\,dx$, $K=\int_0^\pi e^x\cos2x\,dx$.`, [
    written("1.", String.raw`Par deux intégrations par parties, démontre $K=(e^\pi-1)/5$.`, String.raw`Posons $L=\int_0^\pi e^x\sin2x\,dx$. Une intégration avec $u=\cos2x$, $v'=e^x$ donne $K=e^\pi-1+2L$.

Une seconde, avec $u=\sin2x$, donne $L=[e^x\sin2x]_0^\pi-2K=-2K$.

Donc $K=e^\pi-1-4K$, soit **$K=(e^\pi-1)/5$**.`),
    written("2.a", "Calcule I + J et I − J.", String.raw`Avec les identités $\cos^2+\sin^2=1$ et $\cos^2-\sin^2=\cos2x$ :
$$I+J=\int_0^\pi e^x\,dx=e^\pi-1,\qquad I-J=K=\frac{e^\pi-1}5.$$`),
    written("2.b", "Déduis I et J.", String.raw`On additionne pour obtenir $2I=6(e^\pi-1)/5$, puis on soustrait pour obtenir $2J=4(e^\pi-1)/5$.
$$\boxed{I=\frac{3(e^\pi-1)}5,\qquad J=\frac{2(e^\pi-1)}5.}$$`),
  ]),
];
