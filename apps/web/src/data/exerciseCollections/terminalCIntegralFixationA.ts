import { integralExercise as ex, integralCalculation as calc, tf, short, choice, written } from "./terminalCIntegralBuilders";

export const integralFixationA = [
  ex(1, "Primitives et intégrales", "Réponds par Vrai ou Faux.", [
    tf("1.", String.raw`Si $F_1=F_2+8$ sont deux primitives sur $[a;b]$, alors $[F_1]_a^b\ne[F_2]_a^b$.`, false, String.raw`$F_1(b)-F_1(a)=F_2(b)+8-F_2(a)-8=F_2(b)-F_2(a)$. La constante disparaît : **les deux crochets sont égaux**.`),
    tf("2.", String.raw`Si $F$ est une primitive de $f$ et $\int_{-1}^3f=5$, alors $F(-1)=5-F(3)$.`, false, String.raw`La définition donne $F(3)-F(-1)=5$. En isolant $F(-1)$ : **$F(-1)=F(3)-5$**. Ce n’est pas la formule proposée.`),
    tf("3.", String.raw`$\int_4^9\frac{dt}{2\sqrt t}=1$.`, true, String.raw`Une primitive est $\sqrt t$. Le crochet vaut $\sqrt9-\sqrt4=3-2=1$. **Vrai.**`),
    tf("4.", String.raw`$\int_0^1e^x\,dx=1-e$.`, false, String.raw`Une primitive de $e^x$ est $e^x$. On obtient $e^1-e^0=e-1$, **pas $1-e$**.`),
  ]),
  ex(2, "Calculer à l’aide d’une primitive", "Calcule chaque intégrale.", [
    calc("1.", String.raw`$\int_{-1}^{-2}\frac{dt}{t^4}$.`, "La fonction est continue entre −2 et −1. Les bornes sont dans l’ordre décroissant.", String.raw`-\frac1{3x^3}`, String.raw`F(-2)-F(-1)=\frac1{24}-\frac13=-\frac7{24}`, String.raw`-\frac7{24}`),
    calc("2.", String.raw`$\int_1^2\sqrt t\,dt$.`, String.raw`On écrit $\sqrt t=t^{1/2}$ et on utilise la primitive d’une puissance.`, String.raw`\frac23x^{3/2}`, String.raw`F(2)-F(1)=\frac23(2\sqrt2-1)`, String.raw`\frac{4\sqrt2-2}3`),
    short("3.", String.raw`$\int_{-1}^1(x+1)\,dx$.`, "$2$", ["2"], String.raw`Une primitive est $x^2/2+x$. Aux bornes, elle vaut $3/2$ et $-1/2$. Leur différence est **$2$**.`),
    short("4.", String.raw`$\int_0^{\ln3}e^{2x}\,dx$.`, "$4$", ["4"], String.raw`La primitive est $e^{2x}/2$. Comme $e^{2\ln3}=9$, le résultat est $(9-1)/2=\boxed4$.`),
    calc("5.", String.raw`$\int_1^e\frac2{2u-1}\,du$.`, String.raw`$2u-1>0$ ; on reconnaît $v'/v$ avec $v=2u-1$.`, String.raw`\ln(2x-1)`, String.raw`F(e)-F(1)=\ln(2e-1)-\ln1`, String.raw`\ln(2e-1)`),
    calc("6.", String.raw`$\int_0^{\pi/3}\cos u\,du$.`, "On utilise la dérivée du sinus.", String.raw`\sin x`, String.raw`\sin(\pi/3)-\sin0=\sqrt3/2`, String.raw`\frac{\sqrt3}2`),
    calc("7.", String.raw`$\int_0^{\pi/2}\sin(3v-\pi/6)\,dv$.`, "La dérivée de l’angle est 3 ; il faut diviser la primitive par 3.", String.raw`-\frac13\cos(3x-\pi/6)`, String.raw`-\frac13\cos(4\pi/3)+\frac13\cos(-\pi/6)=\frac16+\frac{\sqrt3}6`, String.raw`\frac{1+\sqrt3}6`),
    calc("8.", String.raw`$\int_{\pi/6}^{\pi/4}\frac{dv}{\cos^2v}$.`, "Le cosinus ne s’annule pas sur l’intervalle ; on reconnaît la dérivée de la tangente.", String.raw`\tan x`, String.raw`\tan(\pi/4)-\tan(\pi/6)=1-\frac1{\sqrt3}`, String.raw`1-\frac1{\sqrt3}`),
  ]),
  ex(3, "Reconnaître une égalité", "Réponds par Vrai ou Faux.", [
    tf("1.", String.raw`Pour $f$ continue sur $[-3;3]$, $\int_1^{-1}f(3x)\,dx=3\int_1^{-1}f(x)\,dx$.`, false, String.raw`Avec $u=3x$, $dx=du/3$ : le membre de gauche est $\frac13\int_3^{-3}f(u)\,du$. Il ne correspond pas au membre proposé. Par exemple $f=1$ donne $-2$ à gauche et $-6$ à droite.`),
    tf("2.", String.raw`$\int_0^\pi\sin2x\,dx=2\int_0^\pi\sin x\cos x\,dx$.`, true, String.raw`L’identité $\sin2x=2\sin x\cos x$ est vraie pour tout $x$. On l’intègre sur les mêmes bornes. **Vrai.**`),
    tf("3.", String.raw`Si $\int_1^3f=2$, alors $\int_1^3(\frac32f(x)-x)\,dx=-1$.`, true, String.raw`Par linéarité, le résultat vaut $\frac32(2)-[x^2/2]_1^3=3-(9-1)/2=3-4=-1$.`),
    tf("4.", String.raw`$\int_{\ln3}^{\ln2}\frac{2e^{2x}}{\ln x+2}\,dx+\int_{\ln3}^{\ln2}\frac{e^{2x}\ln x}{\ln x+2}\,dx=\frac52$.`, false, String.raw`Les dénominateurs ne s’annulent pas sur cet intervalle. La somme des intégrandes est $e^{2x}(2+\ln x)/(2+\ln x)=e^{2x}$. Les bornes sont inversées :
$$\left[\frac{e^{2x}}2\right]_{\ln3}^{\ln2}=\frac{4-9}2=-\frac52.$$
**Faux.**`),
  ]),
  ex(4, "Combinaison de deux intégrales", String.raw`On sait que $\int_1^4f(t)\,dt=2$ et $\int_1^4g(t)\,dt=-1$.`, [
    short("1.", String.raw`Calcule $\int_1^4(-4f+5g)(t)\,dt$.`, "$-13$", ["-13"], String.raw`Par linéarité : $-4\int f+5\int g=-4(2)+5(-1)=-8-5=\boxed{-13}$.`),
  ]),
  ex(5, "Utiliser la linéarité", "Calcule les intégrales.", [
    calc("1.", String.raw`$\int_0^{\pi/6}(2\cos x-3\sin x)\,dx$.`, "On intègre les deux termes séparément.", String.raw`2\sin x+3\cos x`, String.raw`(1+3\sqrt3/2)-3`, String.raw`\frac{3\sqrt3}2-2`),
    short("2.", String.raw`$\int_1^4(\frac5{2\sqrt x}+4x)\,dx$.`, "$35$", ["35"], String.raw`Une primitive est $5\sqrt x+2x^2$. Le crochet donne $(10+32)-(5+2)=42-7=\boxed{35}$.`),
    calc("3.", String.raw`$\int_{-\pi/6}^{\pi/2}\sin^2x\,dx$.`, String.raw`On utilise $\sin^2x=(1-\cos2x)/2$.`, String.raw`\frac x2-\frac{\sin2x}4`, String.raw`\frac\pi4-\left(-\frac\pi{12}+\frac{\sqrt3}8\right)`, String.raw`\frac\pi3-\frac{\sqrt3}8`),
    short("4.", String.raw`$\int_0^{\pi/2}\cos^2x\,dx-\int_0^{\pi/2}\sin^2x\,dx$.`, "$0$", ["0"], String.raw`La différence est $\int_0^{\pi/2}\cos2x\,dx=[\sin2x/2]_0^{\pi/2}=0$.`),
  ]),
  ex(6, "Chasles et signes", "Choisis la seule égalité valable dans le cas général.", [
    choice("1.", String.raw`$g$ est continue sur $\mathbb R$. Pour $m,n,p\in\mathbb R$, $-\int_m^ng-\int_p^mg$ vaut :`,
      [String.raw`$\int_p^ng$`,String.raw`$\int_{-n}^{-p}g$`,String.raw`$\int_p^n(-g)$`,String.raw`$\int_{-p}^{-n}g$`], 2,
      String.raw`On met le signe moins en facteur puis on applique Chasles : $-(\int_p^mg+\int_m^ng)=-\int_p^ng=\int_p^n(-g)$. **Réponse C.**`),
    choice("2.", String.raw`$\int_{-1}^1-|x|\,dx$ vaut :`, [
      String.raw`$\int_{-1}^0x\,dx-\int_0^1(-x)\,dx$`,
      String.raw`$\int_{-1}^0x\,dx+\int_0^1(-x)\,dx$`,
      String.raw`$-\int_{-1}^0x\,dx-\int_0^1x\,dx$`,
      String.raw`$\int_{-1}^0(-x)\,dx-\int_0^1(-x)\,dx$`,
    ], 1, String.raw`Pour $x\le0$, $-|x|=x$ ; pour $x\ge0$, $-|x|=-x$. En coupant en $0$, on obtient **la réponse B**, dont la valeur est $-1$.`),
  ]),
  ex(7, "Une autre écriture de Chasles", String.raw`$f$ est continue sur un intervalle $K$ et $a,b,c\in K$.`, [
    written("1.", String.raw`Justifie $\int_a^bf=\int_c^bf-\int_c^af$.`, String.raw`Chasles donne $\int_c^bf=\int_c^af+\int_a^bf$. On soustrait $\int_c^af$ aux deux membres ; on obtient exactement **$\int_a^bf=\int_c^bf-\int_c^af$**. L’ordre relatif des trois points n’a pas d’importance.`),
  ]),
  ex(8, "Une fonction donnée par morceaux", String.raw`$f(x)=e^x$ si $x\le1$ et $f(x)=e/x$ si $x>1$.`, [
    written("1.", String.raw`Calcule $\int_0^{e^2}f(x)\,dx$.`, String.raw`Les formules se raccordent en $1$ : $e^1=e/1=e$. La fonction est continue.

On coupe à $1$ :
$$I=\int_0^1e^x\,dx+\int_1^{e^2}\frac e x\,dx.$$
$$I=(e-1)+e[\ln x]_1^{e^2}=(e-1)+2e=\boxed{3e-1}.$$`),
  ]),
  ex(9, "Intégrer des valeurs absolues", "Calcule en séparant les intervalles utiles.", [
    written("1.", String.raw`$\int_{-\pi/3}^{\pi/2}|\sin x|\,dx$.`, String.raw`Le sinus est négatif sur $[-\pi/3;0]$ puis positif sur $[0;\pi/2]$.
$$I=-\int_{-\pi/3}^0\sin x\,dx+\int_0^{\pi/2}\sin x\,dx.$$
$$I=[\cos x]_{-\pi/3}^0+[-\cos x]_0^{\pi/2}=(1-\tfrac12)+1=\boxed{\tfrac32}.$$`),
    written("2.", String.raw`$\int_{-1}^1(1-|1-e^{-x}|)\,dx$.`, String.raw`Pour $x\le0$, $e^{-x}\ge1$ : l’intégrande vaut $2-e^{-x}$. Pour $x\ge0$, il vaut $e^{-x}$.
$$I=\int_{-1}^0(2-e^{-x})\,dx+\int_0^1e^{-x}\,dx.$$
Le premier terme vaut $[2x+e^{-x}]_{-1}^0=3-e$ ; le second vaut $1-e^{-1}$. **Résultat : $4-e-e^{-1}$.**`),
    short("3.", String.raw`$\int_1^3\sqrt{x^2-4x+4}\,dx$.`, "$1$", ["1"], String.raw`La racine vaut $|x-2|$, et non toujours $x-2$. Donc :
$$I=\int_1^2(2-x)\,dx+\int_2^3(x-2)\,dx=\frac12+\frac12=\boxed1.$$`),
  ]),
  ex(10, "Intégrales et inégalités", String.raw`On suppose $a<b$. Réponds par Vrai ou Faux.`, [
    tf("1.", String.raw`Si $f\le0$ sur $[a;b]$, alors $\int_b^af\le0$.`, false, String.raw`Avec les bornes croissantes, $\int_a^bf\le0$. En les inversant, $\int_b^af=-\int_a^bf\ge0$. Le signe proposé est donc faux en général, par exemple pour $f=-1$.`),
    tf("2.", String.raw`Si $f+g\ge0$ sur $[a;b]$, alors $\int_b^ag\le\int_a^bf$.`, true, String.raw`La positivité donne $\int_a^bf+\int_a^bg\ge0$. Donc $-\int_a^bg\le\int_a^bf$, et $-\int_a^bg=\int_b^ag$. **Vrai : attention aux bornes inversées.**`),
    tf("3.", String.raw`Si $f\le2$ sur $[-1;1]$, alors $\int_{-1}^1(4-2f)\ge0$.`, true, String.raw`Multiplier $f\le2$ par $-2$ inverse le sens : $-2f\ge-4$. Ainsi $4-2f\ge0$ ; son intégrale sur les bornes croissantes est positive ou nulle.`),
    tf("4.", String.raw`$\int_0^1x^2\,dx\ge\int_0^1|x|\,dx$.`, false, String.raw`Sur $[0;1]$, $x^2\le x=|x|$. Les intégrales valent $1/3$ et $1/2$ : $1/3<1/2$. **Faux.**`),
  ]),
  ex(11, "Comparer deux intégrales", "", [
    written("1.", String.raw`Démontre $\int_2^5x\,dx\ge\int_2^5(6x-9)/x\,dx$.`, String.raw`Sur $[2;5]$, $x>0$. Comparons les intégrandes :
$$x-\frac{6x-9}x=\frac{x^2-6x+9}x=\frac{(x-3)^2}x\ge0.$$
Donc $x\ge(6x-9)/x$ partout sur l’intervalle. En intégrant entre **les mêmes bornes croissantes**, on obtient l’inégalité demandée.`),
  ]),
  ex(12, "Intégrer un encadrement", String.raw`Sur $[\pi/6;\pi/2]$, on sait que $4\cos x/\pi^2\le\cos x/x^2\le36\cos x/\pi^2$.`, [
    written("1.", String.raw`Encadre $I=\int_{\pi/6}^{\pi/2}\cos x/x^2\,dx$.`, String.raw`On intègre les trois expressions entre $\pi/6$ et $\pi/2$. Or :
$$\int_{\pi/6}^{\pi/2}\cos x\,dx=\sin(\pi/2)-\sin(\pi/6)=\frac12.$$
Ainsi $\frac4{\pi^2}\times\frac12\le I\le\frac{36}{\pi^2}\times\frac12$, soit **$2/\pi^2\le I\le18/\pi^2$**.`),
  ]),
  ex(13, "Inégalité de la moyenne", String.raw`$I=\int_2^3\ln x/x\,dx$. On admet $\ln2/3\le\ln x/x\le\ln3/2$ sur $[2;3]$.`, [
    written("1.", String.raw`Justifie $1/6\le I\le\ln2$.`, String.raw`La longueur de l’intervalle vaut $1$. L’inégalité de la moyenne donne $\ln2/3\le I\le\ln3/2$.

Pour comparer les bornes, $\ln2=\int_1^2dt/t\ge1/2$, car $1/t\ge1/2$ sur $[1;2]$. Donc $\ln2/3\ge1/6$.

De plus $3<4$, donc $\ln3<\ln4=2\ln2$ et $\ln3/2<\ln2$. **Ainsi $1/6\le I\le\ln2$.**`),
  ]),
  ex(14, "Encadrer une intégrale avec une racine", "", [
    written("1.", String.raw`Démontre $\frac12\le\int_0^{1/2}\frac{dx}{\sqrt{1-x^2}}\le\frac{\sqrt3}2$.`, String.raw`Pour $0\le x\le1/2$, $3/4\le1-x^2\le1$, puis $\sqrt3/2\le\sqrt{1-x^2}\le1$. En inversant :
$$1\le\frac1{\sqrt{1-x^2}}\le\frac2{\sqrt3}.$$
L’inégalité de la moyenne, sur un intervalle de longueur $1/2$, donne $1/2\le I\le1/\sqrt3$. Enfin $1/\sqrt3\le\sqrt3/2$ car $2\le3$. L’encadrement demandé suit.`),
  ]),
  ex(15, "Formule de la valeur moyenne", String.raw`$f$ est continue sur $[c;d]$, $c<d$. Choisis l’expression de sa valeur moyenne $m$.`, [
    choice("1.", "Quelle formule est correcte ?", [
      String.raw`$\frac1{c-d}\int_c^df$`,
      String.raw`$\frac1{d-c}\int_d^cf$`,
      String.raw`$-\frac1{c-d}\int_c^df$`,
      String.raw`$-\frac1{d-c}\int_c^df$`,
    ], 2, String.raw`Par définition, $m=\frac1{d-c}\int_c^df$. Comme $-(c-d)=d-c$, **la troisième formule est correcte**. Dans la deuxième, les bornes sont inversées : elle donne $-m$.`),
  ]),
  ex(16, "Calculer cinq valeurs moyennes", "Calcule la valeur moyenne de f sur K.", [
    calc("1.", String.raw`$f(x)=e^{x/3}$, $K=[0;3]$.`, String.raw`Une primitive de $f$ est $3e^{x/3}$. La valeur moyenne est l’intégrale divisée par $3$.`, String.raw`3e^{x/3}`, String.raw`\mu=\frac{F(3)-F(0)}3=\frac{3e-3}3`, "e-1"),
    calc("2.", String.raw`$f(x)=\cos(\pi x)/2$, $K=[-1/2;1/2]$.`, "La longueur de K vaut 1 ; la moyenne est donc directement l’intégrale.", String.raw`\frac{\sin(\pi x)}{2\pi}`, String.raw`\mu=\frac{1-(-1)}{2\pi}`, String.raw`\frac1\pi`),
    calc("3.", String.raw`$f(x)=\tan x$, $K=[0;\pi/3]$.`, String.raw`Sur K, $\cos x>0$ ; la moyenne est $(3/\pi)\int_K\tan x$.`, String.raw`-\ln(\cos x)`, String.raw`\mu=\frac3\pi(-\ln(1/2)+\ln1)`, String.raw`\frac{3\ln2}\pi`),
    calc("4.", String.raw`$f(x)=1/(x-3)^2$, $K=[-1;1]$.`, "La longueur de K vaut 2.", String.raw`-\frac1{x-3}`, String.raw`\mu=\frac12\left(\frac12-\frac14\right)`, String.raw`\frac18`),
    calc("5.", String.raw`$f(x)=1/\sqrt{x-1}$, $K=[10;17]$.`, "La longueur de K vaut 7.", String.raw`2\sqrt{x-1}`, String.raw`\mu=\frac17(2\sqrt{16}-2\sqrt9)=\frac{8-6}7`, String.raw`\frac27`),
  ]),
];
