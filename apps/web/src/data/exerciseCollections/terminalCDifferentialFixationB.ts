import { differentialExercise as ex, written as w } from "./terminalCDifferentialBuilders";

export const differentialFixationB = [
  ex(14, "Trois fonctions affines", String.raw`$(E):y''=0$.`, [
    w("1.", String.raw`Détermine $f$ telle que $f(1)=3$ et $f(2)=1$.`, String.raw`Écrivons $f(x)=Ax+B$. Alors $A+B=3$ et $2A+B=1$. Par soustraction, $A=-2$, puis $B=5$. Donc $\boxed{f(x)=-2x+5}$. On vérifie les deux valeurs et $f''=0$.`),
    w("2.", String.raw`Détermine $g$ telle que $g(1)=1$ et $g(2)=2$.`, String.raw`Dans $g(x)=Ax+B$, les conditions donnent $A+B=1$ et $2A+B=2$. Donc $A=1$, $B=0$ et $\boxed{g(x)=x}$. Sa dérivée seconde est nulle.`),
    w("3.", String.raw`Détermine $h$ telle que $h(-1)=2$ et $h(5)=2$.`, String.raw`Dans $h(x)=Ax+B$, $-A+B=2$ et $5A+B=2$. En soustrayant : $6A=0$, donc $A=0$ et $B=2$. Ainsi $\boxed{h(x)=2}$ : une fonction constante est bien affine et vérifie $h''=0$.`),
  ]),
  ex(15, "Deux exponentielles de paramètres opposés", "", [
    w("1.", String.raw`Résous $y''=4y$.`, String.raw`$4=2^2>0$, donc $\omega=2$. Les solutions sur $\mathbb R$ sont $\boxed{y(x)=Ae^{2x}+Be^{-2x}}$, $A,B\in\mathbb R$. Les deux constantes sont indépendantes ; la dérivée seconde vaut $4y$.`),
  ]),
  ex(16, "Une pulsation irrationnelle", "", [
    w("1.", String.raw`Résous $y''=5y$.`, String.raw`Le coefficient est positif et $5=(\sqrt5)^2$. Les solutions sont donc $\boxed{y(x)=Ae^{\sqrt5x}+Be^{-\sqrt5x}}$, $A,B\in\mathbb R$. Dériver deux fois multiplie chaque terme par $(\sqrt5)^2=5$.`),
  ]),
  ex(17, "Une valeur et une dérivée en 0", String.raw`$y''=\frac14y$.`, [
    w("1.", String.raw`Détermine $f$ telle que $f(0)=4$ et $f'(0)=1$.`, String.raw`Avec $\omega=1/2$ :
$$f(x)=Ae^{x/2}+Be^{-x/2},\qquad f'(x)=\frac A2e^{x/2}-\frac B2e^{-x/2}.$$
En $0$, $A+B=4$ et $(A-B)/2=1$, soit $A-B=2$. En additionnant, $2A=6$, donc $A=3$ et $B=1$.
$$\boxed{f(x)=3e^{x/2}+e^{-x/2}.}$$`),
  ]),
  ex(18, "Une dérivée nulle en √2", String.raw`$(E):y''=\frac92y$.`, [
    w("1.", String.raw`Détermine $g$ telle que $g(\sqrt2)=1$ et $g'(\sqrt2)=0$.`, String.raw`$\omega=\sqrt{9/2}=3/\sqrt2$. Écrivons :
$$g(x)=Ae^{3x/\sqrt2}+Be^{-3x/\sqrt2}.$$
Sa dérivée est $\frac3{\sqrt2}(Ae^{3x/\sqrt2}-Be^{-3x/\sqrt2})$. En $\sqrt2$, l’angle exponentiel vaut $3$ :
$$Ae^3+Be^{-3}=1,\qquad Ae^3-Be^{-3}=0.$$
Donc $Ae^3=Be^{-3}=1/2$ : $A=e^{-3}/2$, $B=e^3/2$.
$$\boxed{g(x)=\frac12\left(e^{3x/\sqrt2-3}+e^{-3x/\sqrt2+3}\right).}$$`),
  ]),
  ex(19, "Oscillations de pulsation √3", "", [
    w("1.", String.raw`Résous $y''=-3y$.`, String.raw`$-3=-(\sqrt3)^2$, donc $\omega=\sqrt3$. Les solutions sont $\boxed{y(x)=A\cos(\sqrt3x)+B\sin(\sqrt3x)}$, $A,B\in\mathbb R$. La dérivée seconde est bien $-3y$.`),
  ]),
  ex(20, "Oscillations de pulsation 7", "", [
    w("1.", String.raw`Résous $y''=-49y$.`, String.raw`$-49=-7^2$. La propriété donne $\boxed{y(x)=A\cos7x+B\sin7x}$, $A,B\in\mathbb R$. Il faut prendre $\omega=7$, et non $49$, car $\omega^2=49$.`),
  ]),
  ex(21, "Conditions trigonométriques en π/3", String.raw`$y''=-9y$.`, [
    w("1.", String.raw`Détermine $f$ telle que $f(\pi/3)=1$ et $f'(\pi/3)=-6$.`, String.raw`La forme générale est $f(x)=A\cos3x+B\sin3x$, donc $f'(x)=-3A\sin3x+3B\cos3x$.

En $\pi/3$, l’angle vaut $\pi$ : $\cos\pi=-1$ et $\sin\pi=0$. Ainsi $-A=1$ et $-3B=-6$, d’où $A=-1$ et $B=2$.
$$\boxed{f(x)=-\cos3x+2\sin3x.}$$`),
  ]),
  ex(22, "Conditions trigonométriques en π/6", String.raw`$(E):y''=-y$.`, [
    w("1.", String.raw`Détermine $g$ telle que $g(\pi/6)=1$ et $g'(\pi/6)=\sqrt3$.`, String.raw`Écrivons $g(x)=A\cos x+B\sin x$, puis $g'(x)=-A\sin x+B\cos x$.

En $\pi/6$, $\cos(\pi/6)=\sqrt3/2$ et $\sin(\pi/6)=1/2$. Les conditions deviennent :
$$\sqrt3A+B=2,\qquad -A+\sqrt3B=2\sqrt3.$$
La première donne $B=2-\sqrt3A$. Dans la seconde, $-4A+2\sqrt3=2\sqrt3$, donc $A=0$ et $B=2$.
$$\boxed{g(x)=2\sin x.}$$`),
  ]),
];
