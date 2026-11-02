import { differentialExercise as ex, written as w } from "./terminalCDifferentialBuilders";

export const differentialFixationA = [
  ex(1, "Vérifier une solution exponentielle", String.raw`$(E):y'=\sqrt2y$. La fonction $f$ est définie sur $\mathbb R$ par $f(x)=2e^{\sqrt2x}$.`, [
    w("1.", "Justifie que f est une solution de (E).", String.raw`La fonction est dérivable sur $\mathbb R$. La dérivée de $e^{\sqrt2x}$ est $\sqrt2e^{\sqrt2x}$ :
$$f'(x)=2\sqrt2e^{\sqrt2x}.$$
D’autre part, $\sqrt2f(x)=\sqrt2(2e^{\sqrt2x})=2\sqrt2e^{\sqrt2x}$. Ainsi **$f'=\sqrt2f$**, donc $f$ est solution de $(E)$.`),
  ]),
  ex(2, "Vérifier une solution avec un second membre constant", String.raw`$(E):y'=5y+3$, $g(x)=2e^{1+5x}-3/5$ sur $\mathbb R$.`, [
    w("1.", "Justifie que g est une solution de (E).", String.raw`La dérivée de $1+5x$ vaut $5$ :
$$g'(x)=10e^{1+5x}.$$
Calculons aussi le membre de droite :
$$5g(x)+3=10e^{1+5x}-3+3=10e^{1+5x}.$$
On retrouve $g'$ : **$g$ est solution** sur $\mathbb R$.`),
  ]),
  ex(3, "Vérifier une solution affine", String.raw`$(E):y''=0$ et $d(x)=x\sqrt5+\ln3$ sur $\mathbb R$.`, [
    w("1.", "Justifie que d est une solution de (E).", String.raw`Les nombres $\sqrt5$ et $\ln3$ sont constants. On obtient $d'(x)=\sqrt5$, puis $d''(x)=0$ pour tout réel $x$. La fonction $d$ est donc solution de **$y''=0$**.`),
  ]),
  ex(4, "Vérifier une solution du second ordre", String.raw`$(E):y''=8y$ et $h(x)=2e^{2\sqrt2x}-3e^{-2\sqrt2x}$ sur $\mathbb R$.`, [
    w("1.", "Justifie que h est une solution de (E).", String.raw`Dérivons deux fois, en gardant le signe du second exposant :
$$h'(x)=4\sqrt2e^{2\sqrt2x}+6\sqrt2e^{-2\sqrt2x},$$
$$h''(x)=16e^{2\sqrt2x}-24e^{-2\sqrt2x}.$$
Or $8h(x)=16e^{2\sqrt2x}-24e^{-2\sqrt2x}$. Ainsi **$h''=8h$**, donc $h$ est solution.`),
  ]),
  ex(5, "Vérifier une solution trigonométrique", String.raw`$(E):y''=-169y$ et $\ell(x)=\pi\cos13x+\sqrt2\sin13x$ sur $\mathbb R$.`, [
    w("1.", String.raw`Justifie que $\ell$ est une solution de $(E)$.`, String.raw`La dérivée de l’angle $13x$ vaut $13$ :
$$\ell'(x)=-13\pi\sin13x+13\sqrt2\cos13x.$$
En dérivant encore :
$$\ell''(x)=-169\pi\cos13x-169\sqrt2\sin13x=-169\ell(x).$$
Donc **$\ell$ est solution** sur $\mathbb R$.`),
  ]),
  ex(6, "Une famille exponentielle croissante", "", [
    w("1.", String.raw`Résous $y'=3y$.`, String.raw`On reconnaît $y'=ay$ avec $a=3$. Toutes les solutions sont $\boxed{y(x)=Ce^{3x}}$, $C\in\mathbb R$. La constante n’est pas fixée sans condition supplémentaire ; $C=0$ donne aussi une solution.`),
  ]),
  ex(7, "Une famille exponentielle décroissante", "", [
    w("1.", String.raw`Résous $y'=-4y$.`, String.raw`Le coefficient est $a=-4$. La propriété donne $\boxed{y(x)=Ce^{-4x}}$, $C\in\mathbb R$. En dérivant, $y'=-4Ce^{-4x}=-4y$, ce qui vérifie le signe de l’exposant.`),
  ]),
  ex(8, "Condition en 1", String.raw`$y'=2y$.`, [
    w("1.", String.raw`Détermine la solution $f$ telle que $f(1)=e$.`, String.raw`La forme générale est $f(x)=Ce^{2x}$. La condition $Ce^2=e$ donne $C=e^{-1}$. Donc $\boxed{f(x)=e^{2x-1}}$. En $1$, $f(1)=e$ ; de plus $f'=2f$.`),
  ]),
  ex(9, "Condition en 3", String.raw`$(E):y'=-\frac23y$.`, [
    w("1.", String.raw`Détermine la solution $g$ telle que $g(3)=5$.`, String.raw`On a $g(x)=Ce^{-2x/3}$. En $3$ : $Ce^{-2}=5$, donc $C=5e^2$. La solution est $\boxed{g(x)=5e^{2-2x/3}}$. L’exposant s’annule en $3$, d’où $g(3)=5$.`),
  ]),
  ex(10, "Un équilibre positif", "", [
    w("1.", String.raw`Résous $y'=2y-5$.`, String.raw`Ici $a=2$, $b=-5$. Le terme constant de la solution est $-b/a=5/2$. Donc :
$$\boxed{y(x)=Ce^{2x}+\frac52,\quad C\in\mathbb R.}$$
En remplaçant : $2y-5=2Ce^{2x}+5-5=y'$.`),
  ]),
  ex(11, "Un équilibre négatif", "", [
    w("1.", String.raw`Résous $y'=4y+3$.`, String.raw`Avec $a=4$, $b=3$, on a $-b/a=-3/4$. Les solutions sont $\boxed{y(x)=Ce^{4x}-3/4}$, $C\in\mathbb R$. En effet, $4y+3=4Ce^{4x}-3+3=4Ce^{4x}=y'$.`),
  ]),
  ex(12, "Second membre constant et valeur négative", String.raw`$y'=5y-2$.`, [
    w("1.", String.raw`Détermine la solution $f$ telle que $f(0)=-2/5$.`, String.raw`La forme générale est $f(x)=Ce^{5x}+2/5$. La condition en $0$ donne $C+2/5=-2/5$, donc $C=-4/5$.
$$\boxed{f(x)=\frac25-\frac45e^{5x}.}$$
Pour vérifier, $f'=-4e^{5x}$ et $5f-2=2-4e^{5x}-2=-4e^{5x}$.`),
  ]),
  ex(13, "Condition en une abscisse fractionnaire", String.raw`$(E):y'=-3y+4$.`, [
    w("1.", String.raw`Détermine la solution $g$ telle que $g(-1/3)=1$.`, String.raw`Ici $a=-3$, $b=4$, donc $-b/a=4/3$ :
$$g(x)=Ce^{-3x}+\frac43.$$
En $x=-1/3$, $Ce+4/3=1$, donc $Ce=-1/3$ et $C=-1/(3e)$.
$$\boxed{g(x)=\frac43-\frac13e^{-3x-1}.}$$
En $-1/3$, l’exponentielle vaut $1$, donc $g=1$.`),
  ]),
];
