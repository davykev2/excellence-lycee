import { integralExercise as ex, integralCalculation as calc, tf, choice, short, written } from "./terminalCIntegralBuilders";

export const integralFixationB = [
  ex(17, "Reconnaître l’intégration par parties", String.raw`$f,g$ sont dérivables sur $[a;b]$, leurs dérivées sont continues. Choisis la bonne égalité.`, [
    choice("1.", "Quelle égalité est correcte ?", [
      String.raw`$\int_a^bf'g=[fg]_a^b-\int_a^bf'g$`,
      String.raw`$\int_a^bf'g=[fg]_a^b-\int_a^bfg'$`,
      String.raw`$\int_a^bfg'=[fg]_a^b-\int_a^bfg'$`,
      String.raw`$\int_a^bf'g=[fg]_b^a-\int_a^bf'g$`,
    ], 1, String.raw`On intègre $(fg)'=f'g+fg'$ : $\int_a^bf'g+\int_a^bfg'=[fg]_a^b$. En isolant le premier terme, on obtient **B**. Dans le terme restant, c’est bien $g$ qui est dérivée, pas $f$.`),
  ]),
  ex(18, "Vérifier des résultats d’intégration", "Réponds par Vrai ou Faux.", [
    tf("1.", String.raw`$\int_0^{\pi/6}x\cos x\,dx=0$.`, false, String.raw`Avec $u=x$, $v'=\cos x$, une primitive est $x\sin x+\cos x$. Le résultat vaut $\pi/12+\sqrt3/2-1>0$. On peut aussi voir que $x\cos x>0$ à l’intérieur de l’intervalle : **ce n’est pas zéro**.`),
    tf("2.", String.raw`$\int_0^{-1}x/e^x\,dx=-1$.`, false, String.raw`Une primitive de $xe^{-x}$ est $-(x+1)e^{-x}$. Entre $0$ et $-1$, le crochet vaut $0-(-1)=1$. **Faux : les bornes sont décroissantes.**`),
    tf("3.", String.raw`$\int_1^e\ln x\,dx=1$.`, true, String.raw`Par parties, une primitive est $x\ln x-x$. Sa valeur en $e$ est $0$, et en $1$ elle est $-1$. Le résultat est bien $1$.`),
    tf("4.", String.raw`$\int_{1/e}^13x^2\ln x\,dx=\frac4{3e^3}-\frac13$.`, true, String.raw`Prenons $u=\ln x$, $v'=3x^2$. Une primitive est $x^3\ln x-x^3/3$. Sa valeur en $1$ est $-1/3$ et en $1/e$ elle est $-4/(3e^3)$. Le crochet donne l’égalité proposée.`),
  ]),
  ex(19, "Une intégration par parties", "Calcule chaque intégrale en précisant les fonctions choisies.", [
    calc("1.", String.raw`$\int_{1/e}^e\ln(2x)\,dx$.`, String.raw`$u=\ln(2x)$, $u'=1/x$, $v'=1$, $v=x$. Ainsi $\int\ln(2x)=x\ln(2x)-\int1$.`, "x\\ln(2x)-x", String.raw`e\ln2-\frac{\ln2-2}e`, String.raw`e\ln2-\frac{\ln2-2}e`),
    calc("2.", String.raw`$\int_2^1(x-1)\ln x\,dx$.`, String.raw`$u=\ln x$, $u'=1/x$, $v'=x-1$, $v=x^2/2-x$. Il reste à intégrer $x/2-1$.`, String.raw`\left(\frac{x^2}2-x\right)\ln x-\frac{x^2}4+x`, String.raw`F(1)-F(2)=\frac34-1`, String.raw`-\frac14`),
    calc("3.", String.raw`$\int_3^8\frac{x}{\sqrt{x+1}}\,dx$.`, String.raw`$u=x$, $u'=1$, $v'=1/\sqrt{x+1}$, $v=2\sqrt{x+1}$. On obtient $2x\sqrt{x+1}-\frac43(x+1)^{3/2}$.`, String.raw`\frac23(x+1)^{3/2}-2\sqrt{x+1}`, String.raw`F(8)-F(3)=12-\frac43`, String.raw`\frac{32}3`),
    calc("4.", String.raw`$\int_0^{\pi/4}\frac{x}{\cos^2x}\,dx$.`, String.raw`$u=x$, $u'=1$, $v'=1/\cos^2x$, $v=\tan x$. Il reste $-\int\tan x=\ln(\cos x)$.`, String.raw`x\tan x+\ln(\cos x)`, String.raw`\frac\pi4+\ln(\sqrt2/2)-0`, String.raw`\frac\pi4-\frac{\ln2}2`),
    calc("5.", String.raw`$\int_0^{\pi/2}(1-x)\cos4x\,dx$.`, String.raw`$u=1-x$, $u'=-1$, $v'=\cos4x$, $v=\sin4x/4$.`, String.raw`\frac{(1-x)\sin4x}4-\frac{\cos4x}{16}`, String.raw`F(\pi/2)-F(0)=-\frac1{16}-(-\frac1{16})`, "0"),
    calc("6.", String.raw`$\int_e^{e^2}\frac{\ln x}{x^2}\,dx$.`, String.raw`$u=\ln x$, $u'=1/x$, $v'=x^{-2}$, $v=-1/x$.`, String.raw`-\frac{\ln x+1}x`, String.raw`-\frac3{e^2}-(-\frac2e)`, String.raw`\frac2e-\frac3{e^2}`),
    calc("7.", String.raw`$\int_{-1}^1(x+1)e^{2x}\,dx$.`, String.raw`$u=x+1$, $u'=1$, $v'=e^{2x}$, $v=e^{2x}/2$. Il reste $\frac12\int e^{2x}=e^{2x}/4$.`, String.raw`e^{2x}\left(\frac x2+\frac14\right)`, String.raw`\frac34e^2-(-\frac14e^{-2})`, String.raw`\frac{3e^2+e^{-2}}4`),
  ]),
  ex(20, "Deux intégrations par parties", "Calcule en détaillant les deux passages.", [
    calc("1.", String.raw`$\int_0^\pi x^2\sin x\,dx$.`, String.raw`Première fois : $u=x^2$, $v'=\sin x$, donc $I=[-x^2\cos x]_0^\pi+2\int_0^\pi x\cos x\,dx$. Deuxième fois : $u=x$, $v'=\cos x$ ; $\int x\cos x=x\sin x+\cos x$.`, String.raw`-x^2\cos x+2x\sin x+2\cos x`, String.raw`(\pi^2-2)-2`, String.raw`\pi^2-4`),
    calc("2.", String.raw`$\int_{-1}^0(x+1)^2e^{-x}\,dx$.`, String.raw`D’abord $u=(x+1)^2$, $v' =e^{-x}$, $v=-e^{-x}$. Il reste $2\int(x+1)e^{-x}$. Une seconde intégration avec $u=x+1$ donne $\int(x+1)e^{-x}=-(x+2)e^{-x}$.`, String.raw`-e^{-x}(x^2+4x+5)`, String.raw`-5-(-2e)`, "2e-5"),
    calc("3.", String.raw`$\int_1^e x(\ln x)^2\,dx$.`, String.raw`Posons $u=\ln^2x$, $v'=x$. On obtient $I=[x^2\ln^2x/2]_1^e-\int_1^ex\ln x\,dx$. Pour la dernière intégrale, $u=\ln x$, $v'=x$, d’où $\int_1^ex\ln x=(e^2+1)/4$.`, String.raw`\frac{x^2}2\ln^2x-\frac{x^2}2\ln x+\frac{x^2}4`, String.raw`\frac{e^2}4-\frac14`, String.raw`\frac{e^2-1}4`),
    written("4.", String.raw`$\int_0^\pi e^x\cos x\,dx$.`, String.raw`Notons cette intégrale $I$. Une première intégration ($u=\cos x$, $v'=e^x$) donne $I=[e^x\cos x]_0^\pi+\int_0^\pi e^x\sin x\,dx$.

Une seconde ($u=\sin x$, $v'=e^x$) donne $\int_0^\pi e^x\sin x=[e^x\sin x]_0^\pi-I=-I$.

Ainsi $I=-(e^\pi+1)-I$, donc $2I=-(e^\pi+1)$ et **$I=-(e^\pi+1)/2$**.`),
  ]),
  ex(21, "Changements de variable affines", "Transforme l’intégrande et les deux bornes avant de calculer.", [
    written("1.", String.raw`$\int_0^1\frac{t}{(2t+1)^4}\,dt$.`, String.raw`Posons $u=2t+1$ : $t=(u-1)/2$, $dt=du/2$, bornes $1$ et $3$.
$$I=\frac14\int_1^3(u^{-3}-u^{-4})\,du=\left[-\frac1{8u^2}+\frac1{12u^3}\right]_1^3.$$
Le crochet vaut $-7/648+1/24=20/648=\boxed{5/162}$.`),
    written("2.", String.raw`$\int_1^2t(4-t)^5\,dt$.`, String.raw`Posons $u=4-t$ : $dt=-du$, $t=4-u$ ; les bornes deviennent $3$ puis $2$. En inversant les bornes, le signe moins disparaît :
$$I=\int_2^3(4-u)u^5\,du=\left[\frac23u^6-\frac17u^7\right]_2^3.$$
$$I=\left(486-\frac{2187}7\right)-\left(\frac{128}3-\frac{128}7\right)=\boxed{\frac{3133}{21}}.$$`),
    written("3.", String.raw`$\int_{-1}^0t\sqrt{1+t}\,dt$.`, String.raw`Posons $u=1+t$. Alors $t=u-1$, $dt=du$ et les bornes deviennent $0$ et $1$.
$$I=\int_0^1(u^{3/2}-u^{1/2})\,du=\left[\frac25u^{5/2}-\frac23u^{3/2}\right]_0^1=\boxed{-\frac4{15}}.$$`),
    written("4.", String.raw`$\int_0^1\frac{t}{\sqrt{1+2t}}\,dt$.`, String.raw`Posons $u=1+2t$, $t=(u-1)/2$, $dt=du/2$, bornes $1$ et $3$.
$$I=\frac14\int_1^3(u^{1/2}-u^{-1/2})\,du=\left[\frac{u^{3/2}}6-\frac{\sqrt u}2\right]_1^3.$$
La valeur en $3$ vaut $0$, celle en $1$ vaut $-1/3$. **Donc $I=1/3$.**`),
  ]),
  ex(22, "Conserver un quotient de bornes", String.raw`Soient $a,b>0$.`, [
    written("1.", String.raw`Avec un changement affine, démontre $\int_a^b dt/t=\int_{a^2}^{ab}dt/t$.`, String.raw`Dans la première intégrale, posons $u=at$. Alors $dt=du/a$, $t=u/a$, donc $dt/t=du/u$.

Pour $t=a$, $u=a^2$ ; pour $t=b$, $u=ab$. On obtient exactement :
$$\int_a^b\frac{dt}t=\int_{a^2}^{ab}\frac{du}u.$$
La lettre d’intégration étant muette, c’est l’égalité demandée, même lorsque $a>b$.`),
  ]),
  ex(23, "Parité et intégrales", String.raw`$a>0$ ; $g$ est continue sur $[-a;a]$. Réponds par Vrai ou Faux.`, [
    tf("1.", String.raw`Si $g$ est paire, $\int_{-a}^ag=2\int_a^0g$.`, false, String.raw`Pour une fonction paire, $\int_{-a}^ag=2\int_0^ag$. Les bornes proposées à droite sont inversées : le membre droit est l’opposé. Avec $g=1$, on aurait $2a=-2a$, ce qui est faux.`),
    tf("2.", String.raw`Si $g$ est paire, $\int_{-a}^0g=\int_0^ag$.`, true, "Les contributions symétriques d’une fonction paire sont égales. Le changement u = −x donne cette égalité."),
    tf("3.", String.raw`Si $g$ est impaire, $\int_{-a}^a(g-1)=a$.`, false, String.raw`L’intégrale de $g$ est nulle et $\int_{-a}^a1=2a$. Le résultat est donc **$-2a$**, pas $a$.`),
    tf("4.", String.raw`$\int_{-\pi/4}^{\pi/4}\tan x\,dx=0$.`, true, String.raw`La tangente est continue et impaire sur cet intervalle symétrique. Son intégrale est **nulle**.`),
  ]),
  ex(24, "Utiliser la parité pour calculer", "Justifie la symétrie avant de calculer.", [
    short("1.", String.raw`$\int_{-2}^2\frac{3x}{\sqrt{x^4+1}}\,dx$.`, "$0$", ["0"], String.raw`Le dénominateur est positif et pair, le numérateur est impair. Le quotient est continu et impair ; l’intégrale sur $[-2;2]$ vaut **$0$**.`),
    short("2.", String.raw`$\int_{-\pi/6}^{\pi/6}(|x|-5)\sin x\,dx$.`, "$0$", ["0"], String.raw`$|x|-5$ est paire, $\sin x$ est impaire. Leur produit est impair et continu, donc **l’intégrale vaut $0$**.`),
    short("3.", String.raw`$\int_{-\pi/4}^{\pi/4}(\sin7x-\cos2x)\,dx$.`, "$-1$", ["-1"], String.raw`Le terme $\sin7x$ est impair, donc sa contribution est nulle. Le cosinus est pair :
$$I=-2\int_0^{\pi/4}\cos2x\,dx=-[\sin2x]_0^{\pi/4}=\boxed{-1}.$$`),
    short("4.", String.raw`$\int_{-\pi/8}^{\pi/8}\frac{\tan2x}{x^6+3}\,dx$.`, "$0$", ["0"], String.raw`$\tan2x$ est continue et impaire sur l’intervalle ; $x^6+3$ est pair et strictement positif. Le quotient est impair : **résultat $0$**.`),
    short("5.", String.raw`$\int_{-1}^1\frac{1-e^{2x}}{1+e^{2x}}\,dx$.`, "$0$", ["0"], String.raw`Le dénominateur est positif. En multipliant haut et bas par $e^{2x}$ :
$$f(-x)=\frac{e^{2x}-1}{e^{2x}+1}=-f(x).$$
Le quotient est impair ; **l’intégrale est nulle**.`),
    written("6.", String.raw`$\int_{-1}^3\frac{x|x|}{|x|+1}\,dx$.`, String.raw`L’intégrande est continue et impaire. La partie sur $[-1;1]$ vaut donc $0$. Il reste l’intervalle $[1;3]$, où $|x|=x$ :
$$I=\int_1^3\frac{x^2}{x+1}\,dx=\int_1^3\left(x-1+\frac1{x+1}\right)dx.$$
$$I=\left[\frac{x^2}2-x+\ln(x+1)\right]_1^3=\boxed{2+\ln2}.$$`),
  ]),
  ex(25, "Parité et angle double", "", [
    written("1.", String.raw`Démontre $\int_{-\pi/8}^{\pi/8}\ln(\cos2x)\,dx=\int_0^{\pi/8}\ln((1+\cos4x)/2)\,dx$.`, String.raw`Sur l’intervalle, $\cos2x>0$. La fonction $\ln(\cos2x)$ est paire, donc le membre gauche vaut $2\int_0^{\pi/8}\ln(\cos2x)\,dx$.

Puis $2\ln(\cos2x)=\ln(\cos^22x)$ et $\cos^22x=(1+\cos4x)/2$. En remplaçant l’intégrande, on obtient exactement le membre droit.`),
  ]),
  ex(26, "Déplacer l’intervalle d’intégration", "Justifie les égalités sans calculer les valeurs des intégrales.", [
    written("1.", String.raw`$\int_{\pi/2}^{3\pi/2}\cos2x\,dx=\int_0^\pi\cos2x\,dx$.`, String.raw`La fonction $\cos2x$ est de période $\pi$. Les deux intervalles ont une longueur égale à une période. L’intégrale sur une période entière est indépendante du point de départ : les deux membres sont égaux.`),
    written("2.", String.raw`$\int_{2\pi/3}^{4\pi/3}(\sin2x-\cos2x)\,dx=-2\int_0^{\pi/3}\cos2x\,dx$.`, String.raw`L’intégrande est de période $\pi$. Le changement $u=x-\pi$ ramène les bornes à $-\pi/3$ et $\pi/3$ sans changer l’expression.

Sur cet intervalle symétrique, $\sin2u$ est impair et son intégrale est nulle ; $\cos2u$ est pair. Il reste donc **$-2\int_0^{\pi/3}\cos2u\,du$**, comme demandé.`),
  ]),
  ex(27, "Intégrer sur une période entière", String.raw`$K=\int_{-5\pi/6}^{-\pi/3}\cos4x\,dx$.`, [
    written("1.", String.raw`Justifie $K=\int_{-\pi/3}^{\pi/6}\cos4x\,dx$.`, String.raw`La période de $\cos4x$ vaut $2\pi/4=\pi/2$. Décaler les deux bornes de $+\pi/2$ donne $-5\pi/6+\pi/2=-\pi/3$ et $-\pi/3+\pi/2=\pi/6$. L’intégrale est inchangée.`),
    written("2.", String.raw`Déduis $K=\int_0^{\pi/2}\cos4x\,dx$.`, String.raw`Les deux intervalles ont pour longueur $\pi/2$, une période entière. L’intégrale ne dépend donc pas du début de l’intervalle. En complément, sa valeur est $[\sin4x/4]_0^{\pi/2}=0$.`),
  ]),
  ex(28, "Écrire une primitive à l’aide d’une intégrale", String.raw`$f(x)=e^{-x^2/2}$ sur $\mathbb R$.`, [
    written("1.", "Donne sous forme d’intégrale la primitive F qui s’annule en 1.", String.raw`La fonction $f$ est continue sur $\mathbb R$. Le théorème de la borne variable donne :
$$\boxed{F(x)=\int_1^xe^{-t^2/2}\,dt.}$$
On vérifie $F'(x)=e^{-x^2/2}$ et $F(1)=0$. Il n’est pas nécessaire d’inventer une formule élémentaire pour cette primitive.`),
  ]),
  ex(29, "Dériver une intégrale à borne variable", String.raw`Sur $]-1;1[$, $g(x)=\int_0^x\frac{dt}{1-t^2}$.`, [
    written("1.", "Détermine g′.", String.raw`L’intégrande est continue sur $]-1;1[$, car $1-t^2>0$. Ainsi **$g'(x)=1/(1-x^2)$**, directement par le théorème de la borne variable.`),
    short("2.", "Calcule g(0).", "$0$", ["0"], String.raw`$g(0)=\int_0^0dt/(1-t^2)=\boxed0$, puisque les deux bornes sont égales.`),
  ]),
];
