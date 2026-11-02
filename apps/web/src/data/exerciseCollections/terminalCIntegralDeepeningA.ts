import { integralExercise as ex, integralCalculation as calc, written, short } from "./terminalCIntegralBuilders";

export const integralDeepeningA = [
  ex(38, "Vérifier une primitive", String.raw`$f(x)=x^2e^x$ et $F(x)=(x^2-2x+2)e^x$.`, [
    written("1.", "Justifie que F est une primitive de f sur ℝ.", String.raw`Par dérivation d’un produit :
$$F'(x)=(2x-2)e^x+(x^2-2x+2)e^x=x^2e^x=f(x).$$
La fonction $F$ est donc bien une primitive de $f$ sur $\mathbb R$.`),
    written("2.", String.raw`Calcule $\int_{-1}^0x^2e^x\,dx$.`, String.raw`On utilise la primitive vérifiée : $F(0)=2$ et $F(-1)=(1+2+2)e^{-1}=5/e$. **L’intégrale vaut $2-5/e$.**`),
  ]),
  ex(39, "Reconnaître une dérivée composée", "Calcule chacune des dix-huit intégrales.", [
    calc("1.", String.raw`$\int_e^{e^2}\frac{dt}{t(\ln t)^3}$.`, String.raw`Avec $u=\ln x$, $u'=1/x$, on reconnaît $u'u^{-3}$.`, String.raw`-\frac1{2(\ln x)^2}`, String.raw`-\frac18-(-\frac12)=\frac38`, String.raw`\frac38`),
    calc("2.", String.raw`$\int_0^1(x^2-1)(3x-x^3+1)^6\,dx$.`, String.raw`Posons $u=3x-x^3+1$ ; $u'=3(1-x^2)$. L’intégrande est $-u'u^6/3$.`, String.raw`-\frac{(3x-x^3+1)^7}{21}`, String.raw`-\frac{3^7}{21}+\frac1{21}`, String.raw`-\frac{2186}{21}`),
    calc("3.", String.raw`$\int_0^2\frac{2x}{\sqrt[3]{(x^2+1)^2}}\,dx$.`, String.raw`$x^2+1>0$ ; on reconnaît $u'u^{-2/3}$ avec $u=x^2+1$.`, String.raw`3(x^2+1)^{1/3}`, String.raw`3\sqrt[3]5-3`, String.raw`3(\sqrt[3]5-1)`),
    calc("4.", String.raw`$\int_{-1}^0(2x+1)\sin(x(x+1))\,dx$.`, String.raw`L’angle est $u=x(x+1)$, de dérivée $2x+1$. Une primitive de $u'\sin u$ est $-\cos u$.`, String.raw`-\cos(x^2+x)`, String.raw`-\cos0-(-\cos0)=0`, "0"),
    calc("5.", String.raw`$\int_{1/2}^1\frac1{x^2}e^{1/x}\,dx$.`, String.raw`$(1/x)'=-1/x^2$ ; le signe moins est donc indispensable.`, String.raw`-e^{1/x}`, String.raw`-e-(-e^2)`, "e^2-e"),
    calc("6.", String.raw`$\int_0^2\frac{e^x}{e^x+1}\,dx$.`, "Le dénominateur est positif ; son numérateur est sa dérivée.", String.raw`\ln(e^x+1)`, String.raw`\ln(e^2+1)-\ln2`, String.raw`\ln\left(\frac{e^2+1}2\right)`),
    calc("7.", String.raw`$\int_{-1}^12x^2(1-x^3)^2\,dx$.`, String.raw`$u=1-x^3$, $u'=-3x^2$. On reconnaît $-(2/3)u'u^2$.`, String.raw`-\frac29(1-x^3)^3`, String.raw`0-(-\frac29\cdot8)=\frac{16}9`, String.raw`\frac{16}9`),
    calc("8.", String.raw`$\int_1^e\frac{(\ln x)^2}x\,dx$.`, "On reconnaît la dérivée du logarithme multipliée par son carré.", String.raw`\frac{(\ln x)^3}3`, String.raw`\frac13-0`, String.raw`\frac13`),
    calc("9.", String.raw`$\int_0^2(x+1)\sqrt{x^2+2x}\,dx$.`, String.raw`Sur $[0;2]$, $u=x^2+2x\ge0$ et $u'=2(x+1)$. L’intégrande est $(1/2)u'\sqrt u$.`, String.raw`\frac13(x^2+2x)^{3/2}`, String.raw`\frac13\cdot8^{3/2}-0`, String.raw`\frac{16\sqrt2}3`),
    calc("10.", String.raw`$\int_3^5\frac{dx}{\sqrt{x-1}+\sqrt{x+1}}$.`, String.raw`On multiplie haut et bas par $\sqrt{x+1}-\sqrt{x-1}$. Le dénominateur devient $(x+1)-(x-1)=2$ ; l’intégrande vaut $(\sqrt{x+1}-\sqrt{x-1})/2$.`, String.raw`\frac{(x+1)^{3/2}-(x-1)^{3/2}}3`, String.raw`\frac{6\sqrt6-8-(8-2\sqrt2)}3`, String.raw`\frac{6\sqrt6+2\sqrt2-16}3`),
    calc("11.", String.raw`$\int_0^2\frac{e^{-t}}{(e^{-t}+2)^4}\,dt$.`, String.raw`$u=e^{-x}+2$ a pour dérivée $-e^{-x}$ ; l’intégrande est $-u'u^{-4}$.`, String.raw`\frac1{3(e^{-x}+2)^3}`, String.raw`\frac1{3(e^{-2}+2)^3}-\frac1{81}`, String.raw`\frac1{3(e^{-2}+2)^3}-\frac1{81}`),
    calc("12.", String.raw`$\int_0^{\pi/4}\cos2t\sin^4(2t)\,dt$.`, String.raw`$u=\sin2x$ a pour dérivée $2\cos2x$. On intègre $(1/2)u'u^4$.`, String.raw`\frac{\sin^5(2x)}{10}`, String.raw`\frac1{10}-0`, String.raw`\frac1{10}`),
    calc("13.", String.raw`$\int_{e^2}^{e^5}\frac{dt}{t\sqrt{\ln t-1}}$.`, String.raw`$\ln t-1\ge1$ sur l’intervalle. On reconnaît $u'/\sqrt u$ avec $u=\ln t-1$.`, String.raw`2\sqrt{\ln x-1}`, String.raw`2\sqrt4-2\sqrt1=2`, "2"),
    calc("14.", String.raw`$\int_0^1\frac{x+1}{2x^2+4x+3}\,dx$.`, String.raw`Le dénominateur est positif et sa dérivée est $4(x+1)$.`, String.raw`\frac14\ln(2x^2+4x+3)`, String.raw`\frac14(\ln9-\ln3)`, String.raw`\frac{\ln3}4`),
    calc("15.", String.raw`$\int_{\pi/2}^{\pi/4}\frac{\cos x}{e^{2\sin x}}\,dx$.`, String.raw`La dérivée de $e^{-2\sin x}$ est $-2\cos x\,e^{-2\sin x}$. Attention à l’ordre des bornes.`, String.raw`-\frac12e^{-2\sin x}`, String.raw`-\frac12e^{-\sqrt2}+\frac12e^{-2}`, String.raw`\frac{e^{-2}-e^{-\sqrt2}}2`),
    calc("16.", String.raw`$\int_{\ln3}^{\ln5}\frac{e^x-e^{-x}}{e^{-x}+e^x}\,dx$.`, String.raw`Le numérateur est la dérivée du dénominateur, qui reste positif.`, String.raw`\ln(e^x+e^{-x})`, String.raw`\ln(5+1/5)-\ln(3+1/3)`, String.raw`\ln\left(\frac{39}{25}\right)`),
    calc("17.", String.raw`$\int_e^{e^2}\frac{dx}{x\ln x}$.`, String.raw`Sur l’intervalle, $\ln x>0$. On utilise $u'/u$ avec $u=\ln x$.`, String.raw`\ln(\ln x)`, String.raw`\ln2-\ln1`, String.raw`\ln2`),
    calc("18.", String.raw`$\int_{\pi/4}^{\pi/2}\frac{\sin2x}{1+\cos^2x}\,dx$.`, String.raw`$(1+\cos^2x)'=-2\sin x\cos x=-\sin2x$.`, String.raw`-\ln(1+\cos^2x)`, String.raw`-\ln1+\ln(3/2)`, String.raw`\ln(3/2)`),
  ]),
  ex(40, "Encadrer une différence de tangentes", String.raw`$0\le x<y\le\pi/4$.`, [
    written("1.", String.raw`Par l’inégalité de la moyenne, démontre $(\tan y-\tan x)/2\le y-x$.`, String.raw`Sur $[x;y]\subset[0;\pi/4]$, $1\le1/\cos^2t\le2$. En intégrant :
$$\int_x^y\frac{dt}{\cos^2t}\le2(y-x).$$
L’intégrale vaut $\tan y-\tan x$. En divisant par $2>0$, on obtient **$(\tan y-\tan x)/2\le y-x$**.`),
  ]),
  ex(41, "Choisir une intégration par parties", "Calcule les quatre intégrales.", [
    calc("1.", String.raw`$\int_0^1x\sqrt{1-x}\,dx$.`, String.raw`$u=x$, $u'=1$, $v'=\sqrt{1-x}$, $v=-\frac23(1-x)^{3/2}$. Le crochet $[uv]_0^1$ est nul ; il reste $\frac23\int_0^1(1-x)^{3/2}dx$.`, String.raw`-\frac23x(1-x)^{3/2}-\frac4{15}(1-x)^{5/2}`, String.raw`0-(-\frac4{15})`, String.raw`\frac4{15}`),
    calc("2.", String.raw`$\int_0^{\pi/2}e^{-2x}\cos x\,dx$.`, String.raw`Notons $I$ cette intégrale et $J=\int_0^{\pi/2}e^{-2x}\sin x\,dx$. Deux intégrations par parties donnent $I=\frac12-\frac12J$ et $J=-e^{-\pi}/2+\frac12I$. On peut résoudre ce système, ou utiliser la primitive obtenue ci-dessous.`, String.raw`\frac{e^{-2x}(-2\cos x+\sin x)}5`, String.raw`\frac{e^{-\pi}}5-(-\frac25)`, String.raw`\frac{2+e^{-\pi}}5`),
    calc("3.", String.raw`$\int_1^ex^2\ln x\,dx$.`, String.raw`$u=\ln x$, $u'=1/x$, $v'=x^2$, $v=x^3/3$. Il reste $(1/3)\int x^2dx=x^3/9$.`, String.raw`\frac{x^3}3\ln x-\frac{x^3}9`, String.raw`(\frac{e^3}3-\frac{e^3}9)-(-\frac19)`, String.raw`\frac{2e^3+1}9`),
    calc("4.", String.raw`$\int_1^e\frac{\ln(1+u)}{(1+u)^2}\,du$.`, String.raw`$u_1=\ln(1+x)$, $u_1'=1/(1+x)$, $v'=1/(1+x)^2$, $v=-1/(1+x)$.`, String.raw`-\frac{\ln(1+x)+1}{1+x}`, String.raw`-\frac{\ln(1+e)+1}{1+e}+\frac{\ln2+1}2`, String.raw`\frac{\ln2+1}2-\frac{\ln(1+e)+1}{1+e}`),
  ]),
  ex(42, "Un changement affine pour une puissance", String.raw`Dans la deuxième question, $n$ est un entier naturel non nul.`, [
    written("1.", String.raw`Calcule $\int_0^1x\sqrt{1-x}\,dx$.`, String.raw`Posons $u=1-x$, donc $x=1-u$, $dx=-du$. Les bornes $0,1$ deviennent $1,0$ :
$$I=\int_0^1(1-u)\sqrt u\,du=\left[\frac23u^{3/2}-\frac25u^{5/2}\right]_0^1=\boxed{\frac4{15}}.$$`),
    written("2.", String.raw`Calcule $\int_0^1x(1-x)^n\,dx$.`, String.raw`Le même changement donne :
$$I_n=\int_0^1(1-u)u^n\,du=\left[\frac{u^{n+1}}{n+1}-\frac{u^{n+2}}{n+2}\right]_0^1.$$
$$I_n=\frac1{n+1}-\frac1{n+2}=\boxed{\frac1{(n+1)(n+2)}}.$$`),
  ]),
  ex(43, "Variations d’une fonction intégrale", String.raw`Pour $x>0$, $\varphi(x)=\int_1^x\frac{\ln t}{t+1}\,dt$.`, [
    written("1.", "Détermine φ′ et dresse le tableau de variation ; les limites ne sont pas demandées.", String.raw`L’intégrande est continue sur $]0;+\infty[$, donc $\varphi'(x)=\ln x/(x+1)$. Le dénominateur est positif ; le signe est celui de $\ln x$ :

| $x$ | $]0;1[$ | $1$ | $]1;+\infty[$ |
|---|---|---|---|
| $\varphi'(x)$ | − | 0 | + |
| Variation | décroît | minimum $0$ | croît |

$\varphi(1)=0$ car les bornes sont égales. **La fonction décroît jusqu’à $0$, puis croît à partir de $0$.** Aucune valeur de limite n’est nécessaire pour ce tableau.`),
  ]),
  ex(44, "Retrouver un encadrement du logarithme", "", [
    written("1.", String.raw`Démontre $1-t\le1/(1+t)\le1$ pour $t\ge0$.`, String.raw`Comme $1+t\ge1$, son inverse est au plus $1$. Pour l’autre inégalité :
$$\frac1{1+t}-(1-t)=\frac{1-(1-t)(1+t)}{1+t}=\frac{t^2}{1+t}\ge0.$$
Les deux comparaisons sont donc démontrées.`),
    written("2.", String.raw`Déduis $x-x^2/2\le\ln(1+x)\le x$ pour $x\ge0$.`, String.raw`On intègre la première question entre $0$ et $x$ ; les bornes sont croissantes :
$$\int_0^x(1-t)\,dt\le\int_0^x\frac{dt}{1+t}\le\int_0^x1\,dt.$$
Les trois valeurs sont $x-x^2/2$, $\ln(1+x)-\ln1=\ln(1+x)$ et $x$. D’où **l’encadrement demandé**.`),
  ]),
  ex(45, "Linéarisation puis intégration par parties", "", [
    written("1.", String.raw`Linéarise $\cos^4(2x)$.`, String.raw`$\cos^22x=(1+\cos4x)/2$. On élève au carré puis on utilise $\cos^24x=(1+\cos8x)/2$ :
$$\boxed{\cos^42x=\frac{3+4\cos4x+\cos8x}8.}$$`),
    written("2.", String.raw`Calcule $\int_0^{\pi/4}(1-x)\sin2x\cos^32x\,dx$ par parties.`, String.raw`Comme $(\cos^42x)'=-8\sin2x\cos^32x$, choisissons $u=1-x$, $v=-\cos^42x/8$ :
$$I=\left[-\frac{(1-x)\cos^42x}8\right]_0^{\pi/4}-\frac18\int_0^{\pi/4}\cos^42x\,dx.$$
Le crochet vaut $1/8$. Avec la question1, les termes en sinus s’annulent aux bornes et l’intégrale restante vaut $3\pi/32$.
$$\boxed{I=\frac18-\frac{3\pi}{256}.}$$`),
  ]),
  ex(46, "Quatre intégrales trigonométriques", "Utilise une linéarisation.", [
    calc("1.", String.raw`$\int_0^{2\pi}\cos^4x\,dx$.`, String.raw`$\cos^4x=(3+4\cos2x+\cos4x)/8$. Les termes oscillants auront des sinus nuls aux bornes.`, String.raw`\frac{3x}8+\frac{\sin2x}4+\frac{\sin4x}{32}`, String.raw`\frac{3(2\pi)}8-0`, String.raw`\frac{3\pi}4`),
    calc("2.", String.raw`$\int_0^{2\pi}\sin^2x\cos^2x\,dx$.`, String.raw`$\sin^2x\cos^2x=(1/4)\sin^22x=(1-\cos4x)/8$.`, String.raw`\frac x8-\frac{\sin4x}{32}`, String.raw`\frac{2\pi}8-0`, String.raw`\frac\pi4`),
    calc("3.", String.raw`$\int_0^{\pi/2}\sin^2x\cos^2x\,dx$.`, "On reprend exactement la même primitive, avec les nouvelles bornes.", String.raw`\frac x8-\frac{\sin4x}{32}`, String.raw`\frac{\pi/2}8-0`, String.raw`\frac\pi{16}`),
    written("4.", String.raw`$\int_0^{\pi/2}\sin^5(2x)\,dx$.`, String.raw`L’identité $\sin^5u=(10\sin u-5\sin3u+\sin5u)/16$ donne :
$$I=\frac1{16}\int_0^{\pi/2}(10\sin2x-5\sin6x+\sin10x)\,dx.$$
Une primitive est $(-5\cos2x+\frac56\cos6x-\frac1{10}\cos10x)/16$. Entre $0$ et $\pi/2$, chacun des trois cosinus passe de $1$ à $-1$ :
$$I=\frac1{16}\left(10-\frac53+\frac15\right)=\boxed{\frac8{15}}.$$`),
  ]),
  ex(47, "Relier deux intégrales", String.raw`$f(x)=\cos x/\sin^3x$ sur $[\pi/6;\pi/2]$. On pose $I=\int_{\pi/6}^{\pi/2}dx/\sin^2x$ et $J=\int_{\pi/6}^{\pi/2}dx/\sin^4x$.`, [
    written("1.", String.raw`Démontre $f'(x)=2/\sin^2x-3/\sin^4x$.`, String.raw`En écrivant $f=\cos x(\sin x)^{-3}$ :
$$f'=-\frac1{\sin^2x}-\frac{3\cos^2x}{\sin^4x}.$$
Remplaçons $\cos^2x$ par $1-\sin^2x$ : $f'=-1/\sin^2x-3/\sin^4x+3/\sin^2x$, d’où **la formule demandée**.`),
    written("2.a", "Établis une relation entre I et J.", String.raw`En intégrant la première question : $f(\pi/2)-f(\pi/6)=2I-3J$. Or $f(\pi/2)=0$ et $f(\pi/6)=(\sqrt3/2)/(1/8)=4\sqrt3$. Donc **$2I-3J=-4\sqrt3$**.`),
    written("2.b", "Calcule I.", String.raw`Une primitive de $1/\sin^2x$ est $-\cos x/\sin x$ :
$$I=\left[-\frac{\cos x}{\sin x}\right]_{\pi/6}^{\pi/2}=0-(-\sqrt3)=\boxed{\sqrt3}.$$`),
    written("2.c", "Déduis la valeur de J.", String.raw`Dans $2I-3J=-4\sqrt3$, remplaçons $I$ par $\sqrt3$. Il vient $-3J=-6\sqrt3$, donc **$J=2\sqrt3$**.`),
  ]),
  ex(48, "Décomposer une fonction rationnelle", String.raw`$g(x)=(x^2-1)/(x(x^2+1))$ pour $x\ne0$.`, [
    written("1.", String.raw`Détermine $a,b,c$ tels que $g(x)=a/x+(bx+c)/(x^2+1)$.`, String.raw`En réduisant au même dénominateur, le numérateur devient $(a+b)x^2+cx+a$. Par identification avec $x^2-1$ : $a=-1$, $c=0$, $a+b=1$. **Donc $(a,b,c)=(-1,2,0)$.**`),
    written("2.", String.raw`Calcule $\int_1^3g(x)\,dx$.`, String.raw`Sur $[1;3]$, une primitive de $-1/x+2x/(x^2+1)$ est $-\ln x+\ln(x^2+1)$.
$$I=(-\ln3+\ln10)-\ln2=\boxed{\ln(5/3)}.$$`),
  ]),
  ex(49, "Une partie polynomiale et un quotient", String.raw`$h(x)=(x^3-x^2-8x+8)/(x-2)^2$ pour $x>2$.`, [
    written("1.", String.raw`Détermine $a,b,c$ tels que $h(x)=ax+b+c/(x-2)^2$.`, String.raw`En multipliant par $(x-2)^2$, on doit avoir :
$$x^3-x^2-8x+8=(ax+b)(x^2-4x+4)+c.$$
Les coefficients donnent $a=1$, $b-4=-1$, donc $b=3$, puis $4b+c=8$, donc $c=-4$. Le coefficient de $x$ est bien $4-12=-8$.`),
    written("2.", String.raw`Calcule $\int_3^5h(x)\,dx$.`, String.raw`Une primitive est $F(x)=x^2/2+3x+4/(x-2)$.
$$I=F(5)-F(3)=\frac{25-9}2+3(5-3)+\frac43-4=\boxed{\frac{34}3}.$$`),
  ]),
];
