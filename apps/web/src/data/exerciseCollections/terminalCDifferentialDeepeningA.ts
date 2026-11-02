import { differentialExercise as ex, written as w } from "./terminalCDifferentialBuilders";

export const differentialDeepeningA = [
  ex(23, "Reconnaître une équation et imposer un point", String.raw`$(E):3y'+2y=0$.`, [
    w("1.", String.raw`Justifie que $(E)$ est du type $y'=ay$.`, String.raw`On déplace $2y$, puis on divise par $3$ : $3y'=-2y\Longleftrightarrow y'=-\frac23y$. Le coefficient $a=-2/3$ est bien une constante réelle.`),
    w("2.", "Déduis-en toutes les solutions de (E).", String.raw`Pour $y'=ay$, la famille est $Ce^{ax}$. Ici $a=-2/3$, donc $\boxed{y(x)=Ce^{-2x/3}}$ avec $C\in\mathbb R$.`),
    w("3.", String.raw`Détermine la solution dont la courbe passe par $(0;2)$.`, String.raw`Passer par $(0;2)$ signifie $y(0)=2$. Dans $y(x)=Ce^{-2x/3}$, on obtient $y(0)=C$. Ainsi $C=2$ et $\boxed{y(x)=2e^{-2x/3}}$.`),
  ]),
  ex(24, "Une condition sur le nombre dérivé", String.raw`$(E):4y'-3y+8=0$.`, [
    w("1.", String.raw`Justifie que $(E)$ est du type $y'=ay+b$.`, String.raw`$4y'=3y-8$, donc $y'=\frac34y-2$. Ainsi $a=3/4$ et $b=-2$ ; le coefficient $a$ est non nul, comme requis.`),
    w("2.", "Déduis-en toutes les solutions.", String.raw`Le terme constant est $-b/a=2/(3/4)=8/3$. Les solutions sont donc $\boxed{y(x)=Ce^{3x/4}+\frac83}$, $C\in\mathbb R$.`),
    w("3.", String.raw`Détermine la solution $g$ dont le nombre dérivé en $0$ vaut $4$.`, String.raw`La condition est **$g'(0)=4$**, pas $g(0)=4$. Pour $g(x)=Ce^{3x/4}+8/3$, on a $g'(x)=(3C/4)e^{3x/4}$. Donc $3C/4=4$, soit $C=16/3$.
$$\boxed{g(x)=\frac{16}{3}e^{3x/4}+\frac83.}$$`),
  ]),
  ex(25, "Une courbe qui est une droite parallèle", String.raw`$(E):y''=0$. La courbe de $h$ passe par $A(3;0)$ et n’a aucun point commun avec $(D):2x+3y+1=0$.`, [
    w("1.", "Détermine h.", String.raw`Une solution de $y''=0$ est affine : $h(x)=Ax+B$. Sa courbe est une droite.

La droite $(D)$ a pour équation $y=-\frac23x-\frac13$. Deux droites sans point commun sont **parallèles et distinctes** : il faut donc $A=-2/3$.

Le point $(3;0)$ impose $0=-2+B$, d’où $B=2$.
$$\boxed{h(x)=-\frac23x+2.}$$
Les ordonnées à l’origine $2$ et $-1/3$ sont différentes ; les deux droites sont bien distinctes et n’ont aucun point commun.`),
  ]),
  ex(26, "Une tangente de pente imposée", String.raw`$(E):\frac1{15}y''+\frac53y=0$.`, [
    w("1.", String.raw`Justifie que $(E)$ est du type $y''=-\omega^2y$.`, String.raw`Multiplions par $15$ : $y''+25y=0$, soit $y''=-25y=-5^2y$. On a donc $\omega=5$.`),
    w("2.", "Déduis-en les solutions.", String.raw`La famille oscillatoire de pulsation $5$ est $\boxed{y(x)=A\cos5x+B\sin5x}$, avec $A,B\in\mathbb R$.`),
    w("3.", String.raw`Détermine $f$ dont la courbe admet une tangente de coefficient directeur $5$ au point $(\pi/15;3)$.`, String.raw`**Traduction.** Le point donne $f(\pi/15)=3$ ; la pente donne $f'(\pi/15)=5$.

Avec $f=A\cos5x+B\sin5x$, on a $f'=-5A\sin5x+5B\cos5x$. En $\pi/15$, l’angle est $\pi/3$ :
$$A+\sqrt3B=6,\qquad -\sqrt3A+B=2.$$
La seconde donne $B=2+\sqrt3A$. Dans la première, $4A=6-2\sqrt3$ :
$$A=\frac{3-\sqrt3}{2},\qquad B=\frac{1+3\sqrt3}{2}.$$
**Conclusion :**
$$\boxed{f(x)=\frac{3-\sqrt3}{2}\cos5x+\frac{1+3\sqrt3}{2}\sin5x.}$$
Pour contrôler les conditions, on peut écrire la même fonction $3\cos(5(x-\pi/15))+\sin(5(x-\pi/15))$.`),
  ]),
  ex(27, "Une tangente perpendiculaire", String.raw`$(E):4y''-9y=0$.`, [
    w("1.", String.raw`Justifie que $(E)$ est du type $y''=\omega^2y$.`, String.raw`On obtient $y''=(9/4)y=(3/2)^2y$. Le coefficient est positif : $\omega=3/2$.`),
    w("2.", "Déduis-en les solutions.", String.raw`La propriété donne $\boxed{y(x)=Ae^{3x/2}+Be^{-3x/2}}$, avec $A,B\in\mathbb R$.`),
    w("3.", String.raw`Détermine $f$ dont la courbe admet en $B(0;2)$ une tangente perpendiculaire à $(D):x-2y-1=0$.`, String.raw`La droite $(D)$ s’écrit $y=x/2-1/2$ : sa pente est $1/2$. La pente de la tangente perpendiculaire est donc $-2$, car $(1/2)(-2)=-1$.

Ainsi $f(0)=2$ et $f'(0)=-2$. Avec $f=Ae^{3x/2}+Be^{-3x/2}$ :
$$A+B=2,\qquad \frac32(A-B)=-2.$$
Donc $A-B=-4/3$, puis $A=1/3$ et $B=5/3$.
$$\boxed{f(x)=\frac13e^{3x/2}+\frac53e^{-3x/2}.}$$`),
  ]),
  ex(28, "Dériver une famille de solutions", String.raw`On considère sur $\mathbb R$ l’équation $(E):3y''+12y=0$.`, [
    w("1.", String.raw`Résous $(E)$ puis détermine $f'(x)$ pour une solution $f$.`, String.raw`Après division par $3$, $y''=-4y$. Les solutions sont $f(x)=A\cos2x+B\sin2x$, $A,B\in\mathbb R$.

En dérivant chaque terme avec le facteur $2$ :
$$\boxed{f'(x)=-2A\sin2x+2B\cos2x.}$$`),
    w("2.", String.raw`Détermine $f$ telle que $f(\pi/4)=2$ et $f'(\pi/4)=-1$.`, String.raw`En $\pi/4$, l’angle $2x$ vaut $\pi/2$, de cosinus $0$ et de sinus $1$. La première condition donne $B=2$ ; la seconde $-2A=-1$, donc $A=1/2$.
$$\boxed{f(x)=\frac12\cos2x+2\sin2x.}$$`),
  ]),
  ex(29, "Passage par un point et tangente horizontale", String.raw`$(E):4y''+9y=0$, où $y$ est une fonction de la variable $t$.`, [
    w("1.", "Résous l’équation (E).", String.raw`$y''=-\frac94y$, avec $\omega=3/2$. Les solutions sont $\boxed{y(t)=A\cos(3t/2)+B\sin(3t/2)}$, $A,B\in\mathbb R$.`),
    w("2.a)", String.raw`La fonction $f$ est solution de $(E)$. Sa courbe passe par $(0;1)$ et a une tangente horizontale en $t=\pi/6$. Traduis ces informations.`, String.raw`Le point $(0;1)$ donne **$f(0)=1$**. Une tangente horizontale a une pente nulle : **$f'(\pi/6)=0$**. Les deux informations ne sont pas au même instant ; on les utilise dans les deux formules correspondantes.`),
    w("2.b)", "Détermine l’expression de f.", String.raw`Dans $f(t)=A\cos(3t/2)+B\sin(3t/2)$, la première condition donne $A=1$.
$$f'(t)=-\frac32\sin(3t/2)+\frac32B\cos(3t/2).$$
En $t=\pi/6$, l’angle vaut $\pi/4$ : $-\frac{3\sqrt2}{4}+\frac{3\sqrt2}{4}B=0$, donc $B=1$.
$$\boxed{f(t)=\cos(3t/2)+\sin(3t/2).}$$`),
    w("3.", String.raw`Vérifie que $f(t)=\sqrt2\cos(3t/2-\pi/4)$.`, String.raw`Utilisons $\cos(u-v)=\cos u\cos v+\sin u\sin v$. Avec $u=3t/2$, $v=\pi/4$ :
$$\sqrt2\cos(u-\pi/4)=\sqrt2\left(\frac{\sqrt2}{2}\cos u+\frac{\sqrt2}{2}\sin u\right)=\cos u+\sin u.$$
C’est exactement l’expression obtenue : les deux écritures représentent la même fonction.`),
  ]),
  ex(30, "Une solution particulière de type xe²ˣ", String.raw`$(E):y'-2y=e^{2x}$, $g(x)=xe^{2x}$ et $(G):y'=2y$.`, [
    w("1.", "Démontre que g est solution de (E).", String.raw`Par la dérivée d’un produit, $g'=e^{2x}+2xe^{2x}$. Alors $g'-2g=e^{2x}+2xe^{2x}-2xe^{2x}=e^{2x}$. Donc $g$ est une solution particulière de $(E)$.`),
    w("2.", "Résous (G).", String.raw`$(G)$ est $y'=ay$ avec $a=2$. Ses solutions sont $\boxed{u(x)=Ce^{2x}}$, $C\in\mathbb R$.`),
    w("3.", String.raw`Démontre que $f$ est solution de $(E)$ si et seulement si $f-g$ est solution de $(G)$.`, String.raw`Posons $u=f-g$. Comme $g'-2g=e^{2x}$ :
$$u'-2u=(f'-2f)-(g'-2g)=f'-2f-e^{2x}.$$
Ainsi $u'-2u=0$ **équivaut** à $f'-2f=e^{2x}$. Cela prouve les deux sens de l’équivalence.`),
    w("4.", "Déduis-en toutes les solutions de (E).", String.raw`La question précédente donne $f-g=Ce^{2x}$. En ajoutant $g=xe^{2x}$ :
$$\boxed{f(x)=(x+C)e^{2x},\quad C\in\mathbb R.}$$`),
    w("5.", "Détermine la solution qui s’annule en 1.", String.raw`Dans $f(x)=(x+C)e^{2x}$, $f(1)=0$ donne $(1+C)e^2=0$. L’exponentielle n’est pas nulle, donc $C=-1$.
$$\boxed{f(x)=(x-1)e^{2x}.}$$`),
  ]),
];
