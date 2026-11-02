import { differentialExercise as ex, written as w, short } from "./terminalCDifferentialBuilders";

export const differentialDeepeningB = [
  ex(31, "Une équation dépendant d’un entier n", String.raw`Dans tout l’exercice, $n$ est un entier naturel avec $n\ge2$. On note $(1):y'-\frac1ny=0$ et $(2):y'-\frac1ny=-\frac{x+1}{n(n+1)}$.`, [
    w("1.", "Résous l’équation (1).", String.raw`L’équation est $y'=\frac1ny$. Avec $a=1/n$, les solutions sont $\boxed{y(x)=Ce^{x/n}}$, $C\in\mathbb R$. L’hypothèse $n\ge2$ garantit notamment que les dénominateurs sont non nuls.`),
    w("2.", String.raw`Détermine $a,b$ pour que $g(x)=ax+b$ soit solution de $(2)$.`, String.raw`On a $g'=a$, donc :
$$g'-\frac gn=-\frac an x+a-\frac bn.$$
On identifie les coefficients avec $-\frac{x+1}{n(n+1)}$ :
$$-\frac an=-\frac1{n(n+1)},\qquad a-\frac bn=-\frac1{n(n+1)}.$$
La première égalité donne $a=1/(n+1)$. En multipliant la seconde par $n$ : $na-b=-1/(n+1)$, donc $b=na+1/(n+1)=1$.
$$\boxed{g(x)=\frac{x}{n+1}+1.}$$`),
    w("3.a)", String.raw`Démontre que $h$ est solution de $(2)$ si et seulement si $h-g$ est solution de $(1)$.`, String.raw`Posons $u=h-g$. Puisque $g$ est solution de $(2)$ :
$$u'-\frac un=\left(h'-\frac hn\right)-\left(g'-\frac gn\right)
=h'-\frac hn+\frac{x+1}{n(n+1)}.$$
Cette expression est nulle exactement lorsque $h$ vérifie $(2)$. L’équivalence est donc démontrée dans les deux sens.`),
    w("3.b)", "Déduis-en toutes les solutions de (2).", String.raw`On a $h-g=Ce^{x/n}$, donc :
$$\boxed{h(x)=Ce^{x/n}+\frac{x}{n+1}+1,\qquad C\in\mathbb R.}$$
La partie exponentielle résout $(1)$ et la partie affine fournit le second membre de $(2)$.`),
  ]),
  ex(32, "Un second membre trigonométrique", String.raw`$(E):y'=2y+\cos x$ et $(E_0):y'=2y$.`, [
    w("1.", String.raw`Détermine $a,b$ pour que $u(x)=a\cos x+b\sin x$ soit solution de $(E)$.`, String.raw`$u'=-a\sin x+b\cos x$. Alors :
$$u'-2u=(b-2a)\cos x+(-a-2b)\sin x.$$
Pour obtenir $\cos x$ pour tout $x$, il faut $b-2a=1$ et $-a-2b=0$. La seconde donne $a=-2b$, puis $5b=1$.
$$\boxed{a=-\frac25,\quad b=\frac15,\quad u(x)=-\frac25\cos x+\frac15\sin x.}$$`),
    w("2.", "Résous (E₀).", String.raw`L’équation homogène est $y'=2y$. Ses solutions sont $\boxed{y(x)=Ce^{2x}}$, $C\in\mathbb R$.`),
    w("3.", String.raw`Démontre que $f$ est solution de $(E)$ si et seulement si $f-u$ est solution de $(E_0)$.`, String.raw`Comme $u'-2u=\cos x$, on a :
$$(f-u)'-2(f-u)=f'-2f-\cos x.$$
Le membre de gauche est nul si et seulement si $f'-2f=\cos x$. C’est exactement l’équivalence demandée.`),
    w("4.", "Déduis-en toutes les solutions de (E).", String.raw`On ajoute la solution particulière $u$ à toute solution homogène :
$$\boxed{f(x)=Ce^{2x}-\frac25\cos x+\frac15\sin x,\quad C\in\mathbb R.}$$`),
    w("5.", String.raw`Détermine la solution qui s’annule en $\pi/2$.`, String.raw`En $\pi/2$, $\cos=0$ et $\sin=1$. Donc $0=Ce^\pi+1/5$, d’où $C=-e^{-\pi}/5$.
$$\boxed{f(x)=-\frac15e^{2x-\pi}-\frac25\cos x+\frac15\sin x.}$$
En remplaçant $x$ par $\pi/2$, les deux termes non nuls se compensent.`),
  ]),
  ex(33, "Un second membre polynomial", String.raw`$(E):2y'+6y=2x^2-6x+8$.`, [
    w("1.", String.raw`Détermine $a,b,c$ pour que $v(x)=ax^2+bx+c$ soit solution de $(E)$.`, String.raw`Divisons l’équation par $2$ : $y'+3y=x^2-3x+4$.
$$v'+3v=3ax^2+(2a+3b)x+(b+3c).$$
L’identification donne $3a=1$, $2a+3b=-3$ et $b+3c=4$. Donc :
$$a=\frac13,\qquad b=\frac{-3-2/3}{3}=-\frac{11}{9},\qquad c=\frac{4+11/9}{3}=\frac{47}{27}.$$
Ainsi $\boxed{v(x)=x^2/3-11x/9+47/27}$.`),
    w("2.", String.raw`Résous $(E_0):2y'+6y=0$.`, String.raw`Après division par $2$, $y'=-3y$. Les solutions sont $\boxed{y(x)=Ce^{-3x}}$, $C\in\mathbb R$.`),
    w("3.", String.raw`Démontre que $g$ est solution de $(E)$ si et seulement si $g-v$ est solution de $(E_0)$.`, String.raw`En utilisant $2v'+6v=2x^2-6x+8$ :
$$2(g-v)'+6(g-v)=2g'+6g-(2x^2-6x+8).$$
Le membre de gauche est nul si et seulement si $g$ vérifie $(E)$. On a bien les deux sens.`),
    w("4.", "Déduis-en toutes les solutions de (E).", String.raw`Puisque $g-v=Ce^{-3x}$ :
$$\boxed{g(x)=Ce^{-3x}+\frac{x^2}{3}-\frac{11x}{9}+\frac{47}{27},\quad C\in\mathbb R.}$$`),
    w("5.", "Détermine la solution dont la courbe passe par l’origine.", String.raw`Passer par l’origine signifie $g(0)=0$, donc $C+47/27=0$. Ainsi $C=-47/27$ :
$$\boxed{g(x)=\frac{x^2}{3}-\frac{11x}{9}+\frac{47}{27}(1-e^{-3x}).}$$`),
  ]),
  ex(34, "Refroidissement d’un corps", String.raw`La température $q(t)$ est en degrés Celsius, $t$ en **heures**. Au temps $0$, le corps à $80\,^\circ\mathrm C$ est placé dans une salle à $15\,^\circ\mathrm C$. Le modèle donne $q'(t)=-2(q(t)-15)$, avec $q(0)=80$.`, [
    w("1.", String.raw`Justifie que $q'(t)=-2q(t)+30$.`, String.raw`Le coefficient $-2$ multiplie la différence entre la température du corps et celle de la salle. En développant : $-2(q-15)=-2q+30$. Ainsi **$q'=-2q+30$**. Le signe négatif traduit ici une baisse lorsque $q>15$.`),
    w("2.", "Déduis-en q(t) avec la condition initiale.", String.raw`Pour $y'=-2y+30$, la famille est $Ce^{-2t}+15$. En $0$, $C+15=80$, donc $C=65$.
$$\boxed{q(t)=15+65e^{-2t},\qquad t\ge0.}$$
Sa dérivée vaut $-130e^{-2t}$, égale à $-2q+30$.`),
    short("3.", "Température au bout de 30 minutes, arrondie à l’unité (en °C).", "$39$", ["39","39°C","39 °C"], String.raw`Il faut convertir **$30$ minutes en $0,5$ heure** :
$$q(0,5)=15+65e^{-1}=15+\frac{65}{e}\simeq38,91.$$
La température arrondie à l’unité est **$39\,^\circ\mathrm C$**.`),
    w("4.", String.raw`Détermine le temps pour atteindre $45\,^\circ\mathrm C$. Donne-le en minutes et secondes.`, String.raw`Résolvons :
$$15+65e^{-2t}=45\quad\Longleftrightarrow\quad e^{-2t}=\frac{30}{65}=\frac6{13}.$$
Le logarithme donne $-2t=\ln(6/13)$, donc :
$$t=\frac12\ln\frac{13}{6}\ \text{heure}.$$
En minutes, $60t=30\ln(13/6)\simeq23,1957$. La partie décimale vaut environ $0,1957\times60=11,74$ secondes.

**Le corps atteint $45\,^\circ\mathrm C$ au bout d’environ 23 min 12 s**, à la seconde près.`),
    short("5.a)", String.raw`Calcule $\lim_{t\to+\infty}q(t)$.`, "$15$", ["15","15°C","15 °C"], String.raw`Comme $e^{-2t}\to0$ lorsque $t\to+\infty$, la formule donne $q(t)=15+65e^{-2t}\to\boxed{15}$.`),
    w("5.b)", "Interprète le résultat.", String.raw`Dans ce modèle, la température du corps se rapproche de celle de la salle, **$15\,^\circ\mathrm C$**, par valeurs supérieures. Elle ne passe pas en dessous, car $65e^{-2t}>0$ pour tout temps fini.`),
  ], { correctionFigureKey: "tc-l8-differential" }),
  ex(35, "Une solution et une écriture déphasée", String.raw`$(E):y''+\frac{\pi^2}{9}y=0$.`, [
    w("1.", String.raw`Justifie que $(E)$ est du type $y''=-\omega^2y$.`, String.raw`On isole $y''$ : $y''=-(\pi^2/9)y=-(\pi/3)^2y$. Ainsi $\omega=\pi/3$.`),
    w("2.", "Déduis-en les solutions.", String.raw`La famille oscillatoire est $\boxed{y(x)=A\cos(\pi x/3)+B\sin(\pi x/3)}$, $A,B\in\mathbb R$.`),
    w("3.a)", String.raw`Détermine $f$ avec $f(3)=-3$ et $f'(3)=\pi/\sqrt3$.`, String.raw`La dérivée est $f'=-(\pi A/3)\sin(\pi x/3)+(\pi B/3)\cos(\pi x/3)$.

En $3$, l’angle vaut $\pi$, donc $-A=-3$, d’où $A=3$. Puis $-\pi B/3=\pi/\sqrt3$, donc $B=-\sqrt3$.
$$\boxed{f(x)=3\cos(\pi x/3)-\sqrt3\sin(\pi x/3).}$$`),
    w("3.b)", String.raw`Justifie que $f(x)=2\sqrt3\cos\left(\frac\pi3(x+\frac12)\right)$.`, String.raw`Posons $u=\pi x/3$. Avec $\cos(u+v)=\cos u\cos v-\sin u\sin v$ :
$$2\sqrt3\cos(u+\pi/6)=2\sqrt3\left(\frac{\sqrt3}{2}\cos u-\frac12\sin u\right).$$
Cela vaut $3\cos u-\sqrt3\sin u$, exactement la fonction de la question précédente. Le **signe plus dans l’angle** correspond au signe moins devant le sinus.`),
  ]),
];
