import { differentialExercise as ex, written as w } from "./terminalCDifferentialBuilders";

export const differentialDeepeningC = [
  ex(36, "Une équation du second ordre avec second membre", String.raw`$(E):\frac13y''-12y-e^{2x}+x-2=0$. On pose $P(x)=-\frac3{32}e^{2x}+\frac{x}{12}-\frac16$ et $(E_0):\frac13y''-12y=0$.`, [
    w("1.", "Justifie que P est une solution de (E).", String.raw`On dérive :
$$P'(x)=-\frac3{16}e^{2x}+\frac1{12},\qquad P''(x)=-\frac38e^{2x}.$$
Alors :
$$\frac13P''-12P=-\frac18e^{2x}+\frac98e^{2x}-x+2=e^{2x}-x+2.$$
Donc $\frac13P''-12P-e^{2x}+x-2=0$ : **$P$ est une solution particulière**.`),
    w("2.a)", String.raw`Justifie que $(E_0)$ est du type $y''=\omega^2y$.`, String.raw`Multiplions par $3$ : $y''-36y=0$, donc $y''=36y=6^2y$. On a $\omega=6$.`),
    w("2.b)", "Déduis-en les solutions de (E₀).", String.raw`La famille exponentielle est $\boxed{y(x)=Ae^{6x}+Be^{-6x}}$, $A,B\in\mathbb R$. Les deux constantes correspondent aux deux conditions nécessaires pour fixer une solution.`),
    w("3.", String.raw`Démontre que $f$ est solution de $(E)$ si et seulement si $f-P$ est solution de $(E_0)$.`, String.raw`Puisque $\frac13P''-12P=e^{2x}-x+2$, on calcule :
$$\frac13(f-P)''-12(f-P)=\frac13f''-12f-e^{2x}+x-2.$$
Le membre de gauche est nul si et seulement si $f$ vérifie $(E)$. Cela établit l’équivalence.`),
    w("4.", "Déduis-en toutes les solutions de (E).", String.raw`Il faut et il suffit que $f-P=Ae^{6x}+Be^{-6x}$. Ainsi :
$$\boxed{f(x)=Ae^{6x}+Be^{-6x}-\frac3{32}e^{2x}+\frac{x}{12}-\frac16,\quad A,B\in\mathbb R.}$$`),
    w("5.", String.raw`Dans un repère orthonormé $(O,I,J)$, détermine $h$ dont la courbe admet en $J$ une tangente de pente $4/3$.`, String.raw`Le point $J$ a pour coordonnées $(0;1)$ : $h(0)=1$ et $h'(0)=4/3$.

La formule précédente donne $h(0)=A+B-3/32-1/6$, donc :
$$A+B=1+\frac3{32}+\frac16=\frac{121}{96}.$$
De plus $h'(x)=6Ae^{6x}-6Be^{-6x}-\frac3{16}e^{2x}+\frac1{12}$, donc :
$$6(A-B)-\frac5{48}=\frac43\quad\Longrightarrow\quad A-B=\frac{23}{96}.$$
En additionnant/soustrayant : $A=3/4$, $B=49/96$.
$$\boxed{h(x)=\frac34e^{6x}+\frac{49}{96}e^{-6x}-\frac3{32}e^{2x}+\frac{x}{12}-\frac16.}$$
En $0$, sa valeur est $1$ et sa dérivée $4/3$.`),
  ]),
  ex(37, "Étudier une fonction issue d’un modèle", String.raw`Dans un modèle d’alcoolémie, $f(t)$ est exprimée en $\mathrm{g\,L^{-1}}$ et $t$ en heures après la consommation. Sur $t\ge0$, $f'+f=\alpha e^{-t}$. On prend $f(0)=0$.`, [
    w("1.", String.raw`Pose $g(t)=e^tf(t)$ et démontre que $g$ est affine.`, String.raw`Par la règle du produit :
$$g'(t)=e^tf(t)+e^tf'(t)=e^t(f+f')=\alpha.$$
La dérivée de $g$ est constante, donc $g(t)=\alpha t+C$ : **$g$ est affine**. La condition $g(0)=f(0)=0$ impose $C=0$.`),
    w("2.", String.raw`Exprime $f(t)$ en fonction de $t$ et de $\alpha$.`, String.raw`On a $e^tf(t)=\alpha t$. L’exponentielle n’est jamais nulle, donc :
$$\boxed{f(t)=\alpha te^{-t},\qquad t\ge0.}$$
Sans la condition initiale $f(0)=0$, la famille serait $(\alpha t+C)e^{-t}$. Ici $C=0$ est fixé.`),
    w("4.a)", String.raw`Pour la suite, on prend $\alpha=4$. Étudie les variations de $f$, dresse le tableau et trace la courbe dans un repère orthonormé d’unité $2,5\,\mathrm{cm}$.`, String.raw`On a $f(t)=4te^{-t}$. Par dérivation :
$$f'(t)=4e^{-t}-4te^{-t}=4e^{-t}(1-t).$$
Comme $4e^{-t}>0$, le signe est celui de $1-t$ : positif pour $t<1$, nul en $1$, négatif pour $t>1$.

| $t$ | $0$ | | $1$ | | $+\infty$ |
| --- | --- | --- | --- | --- | --- |
| $f'(t)$ | | $+$ | $0$ | $-$ | |
| $f(t)$ | $0$ | $\nearrow$ | $4/e$ | $\searrow$ | $0$ |

La limite $te^{-t}\to0$ donne l’asymptote horizontale $y=0$. Pour tracer : $(0;0)$, $(1;4/e)$ et $(2;8/e^2)$ ; la tangente en $0$ a pour pente $4$. Une unité sur chaque axe représente $2,5\,\mathrm{cm}$ sur le dessin papier.`),
    w("4.b)", "Détermine le maximum et le temps auquel il est atteint.", String.raw`Le tableau de variation montre que $f$ augmente jusqu’à $t=1$, puis diminue. Son maximum est donc :
$$\boxed{f(1)=\frac4e\simeq1,47\ \mathrm{g\,L^{-1}},\quad \text{atteint après }1\ \text{heure}.}$$`),
    w("4.c)", String.raw`Détermine graphiquement les temps pour lesquels $f(t)\le0,9\,\mathrm{g\,L^{-1}}$.`, String.raw`La droite horizontale $y=0,9$ coupe la courbe en deux points : l’un avant le maximum, l’autre après.

La lecture donne environ **$t=0,31$ h et $t=2,34$ h**. Une résolution numérique plus précise donne $t_1\simeq0,3053$ et $t_2\simeq2,3432$.

La courbe est sous la droite au début, puis à partir de la seconde intersection :
$$\boxed{t\in[0;t_1]\ \cup\ [t_2;+\infty[.}$$
Il faut donc conserver **les deux intervalles**, et non uniquement la période tardive. Ce modèle mathématique ne permet pas de décider d’une aptitude à conduire ni d’une sécurité médicale.`),
  ], { correctionFigureKey: "tc-l8-differential" }),
  ex(38, "Dissolution d’une substance", String.raw`À $t=0$, on place $50\,\mathrm g$ d’une substance dans une grande quantité d’eau. La vitesse de dissolution est proportionnelle à la quantité non encore dissoute. Les $20$ premiers grammes se dissolvent en $10$ minutes. On note $f(t)$ la masse dissoute, en grammes, au temps $t$ en minutes.`, [
    w("1.", "Donne une expression de f(t).", String.raw`**1. Modéliser la quantité restante.** Posons $r(t)=50-f(t)$. Puisque $f'=kr$ pour une constante $k>0$, $r'=-f'=-kr$.

Au départ $r(0)=50$, donc $r(t)=50e^{-kt}$. Après $10$ minutes, $20$ g sont dissous, donc il reste $30$ g :
$$50e^{-10k}=30\quad\Longrightarrow\quad e^{-10k}=\frac35.$$
Ainsi $k=\ln(5/3)/10$.

**2. Revenir à la masse dissoute.**
$$\boxed{f(t)=50\left(1-e^{-\frac{\ln(5/3)}{10}t}\right)=50\left(1-\left(\frac35\right)^{t/10}\right),\quad t\ge0.}$$
On vérifie $f(0)=0$, $f(10)=20$ et $0\le f(t)<50$. La quantité dissoute augmente ; c’est la quantité restante qui décroît.`),
  ], { correctionFigureKey: "tc-l8-differential" }),
];
