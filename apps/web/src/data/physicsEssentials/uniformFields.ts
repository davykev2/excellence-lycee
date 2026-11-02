import { section, sheet } from "./types";
export default sheet("uniform-fields", "Mouvements dans les champs g et E uniformes", [211,212,213,214,215], [
  section("pc-fields-gravity", "I", "Projectile dans un champ de pesanteur uniforme", [211,212], String.raw`
On étudie un projectile de masse $m$ dans le référentiel terrestre supposé galiléen. On néglige la résistance de l’air : le poids est la seule force.
$$m\vec a=m\vec g\quad\Longrightarrow\quad\vec a=\vec g.$$
L’axe $x$ est horizontal et l’axe $z$ vertical vers le haut. À $t=0$, le projectile part de $O$ avec une vitesse $v_0$ faisant l’angle $\alpha$ avec l’horizontale.

| Grandeur | Selon $x$ | Selon $y$ | Selon $z$ |
|---|---|---|---|
| Accélération | $0$ | $0$ | $-g$ |
| Vitesse | $v_0\cos\alpha$ | $0$ | $v_0\sin\alpha-gt$ |
| Position | $v_0t\cos\alpha$ | $0$ | $v_0t\sin\alpha-\frac12gt^2$ |

Comme $y=0$ à tout instant, la trajectoire est dans le plan $(Oxz)$.

- Si $v_0=0$, on a une chute verticale sans vitesse initiale : $z=-gt^2/2$.
- Si $\alpha=\pi/2$, le tir est vertical vers le haut : $z=v_0t-gt^2/2$.
- Si $\alpha=-\pi/2$, le tir est vertical vers le bas : $z=-v_0t-gt^2/2$.
- Si $v_0\cos\alpha\ne0$, on élimine $t=x/(v_0\cos\alpha)$ :
$$z=x\tan\alpha-\frac{g}{2v_0^2\cos^2\alpha}x^2.$$
La trajectoire est alors une parabole.
`, "projectile"),
  section("pc-fields-range", "II", "Portée et hauteur maximale", [212], String.raw`
Ces relations supposent un départ et une arrivée **à la même altitude**, sans frottement, avec $0<\alpha<\pi/2$.

**Portée.** On cherche la seconde position où $z=0$ :
$$L=\frac{v_0^2\sin(2\alpha)}g.$$
À vitesse initiale fixée, la portée est maximale pour $\alpha=\pi/4=45^\circ$ :
$$L_{\max}=\frac{v_0^2}{g}.$$

**Sommet.** Au point le plus haut, seule la composante verticale de la vitesse s’annule :
$$v_z(t_S)=0\quad\Longrightarrow\quad t_S=\frac{v_0\sin\alpha}{g}.$$
La vitesse au sommet reste horizontale, de valeur $v_0\cos\alpha$. En remplaçant $t_S$ dans $z(t)$ :
$$H=z_S=\frac{v_0^2\sin^2\alpha}{2g}.$$
Si l’altitude d’arrivée diffère de celle du départ, il faut revenir à l’équation horaire plutôt qu’utiliser directement la formule de portée.
`),
  section("pc-fields-electric", "III", "Champ électrostatique, force et travail", [213], String.raw`
Entre deux plaques parallèles distantes de $d$, loin des bords, le champ est uniforme. Pour $U_{PN}=V_P-V_N>0$ :
$$E=\frac{U_{PN}}d.$$
Le vecteur $\vec E$ est perpendiculaire aux plaques et orienté de la plaque positive $P$ vers la plaque négative $N$, donc vers les potentiels décroissants. $E$ s’exprime en $\mathrm{V\,m^{-1}}$.

Une charge $q$ subit :
$$\vec F_e=q\vec E,\qquad F_e=|q|E.$$
La force a le même sens que $\vec E$ si $q>0$, le sens opposé si $q<0$. Elle est appliquée à la particule.

Entre $A$ et $B$ :
$$W_{A\to B}(\vec F_e)=q(V_A-V_B).$$
Le travail est en joules, la charge en coulombs et la différence de potentiel en volts.
`, "electric-field"),
  section("pc-fields-electric-motion", "IV", "Trajectoire d’une particule dans un champ électrique", [214], String.raw`
On néglige le poids devant la force électrique et on prend $\vec E=E\vec j$, avec $E>0$. La particule entre en $O$ à $t=0$ avec $\vec v_0=v_0\cos\alpha\,\vec i+v_0\sin\alpha\,\vec j$.
$$m\vec a=q\vec E\quad\Longrightarrow\quad
a_x=0,\quad a_y=\frac{qE}{m}.$$

| Grandeur | Selon $x$ | Selon $y$ |
|---|---|---|
| Vitesse | $v_0\cos\alpha$ | $v_0\sin\alpha+\frac{qE}{m}t$ |
| Position | $v_0t\cos\alpha$ | $v_0t\sin\alpha+\frac{qE}{2m}t^2$ |

Si $v_0\cos\alpha\ne0$, la trajectoire est :
$$y=x\tan\alpha+\frac{qE}{2mv_0^2\cos^2\alpha}x^2.$$
Le signe de $q$ détermine le sens de la déviation ; il ne faut pas remplacer $q$ par $|q|$ dans une équation algébrique.
`),
  section("pc-fields-deflection", "V", "Entrée horizontale et déviation sur un écran", [214,215], String.raw`
Pour $\alpha=0$, entre les plaques :
$$x=v_0t,\qquad y=\frac{qE}{2m}t^2
\quad\Longrightarrow\quad y=\frac{qE}{2mv_0^2}x^2.$$
Si les plaques ont une longueur $\ell$, la sortie a lieu à $t_S=\ell/v_0$ :
$$y_S=\frac{qE\ell^2}{2mv_0^2},\qquad
v_{yS}=\frac{qE\ell}{mv_0},\qquad
\tan\theta=\frac{v_{yS}}{v_0}=\frac{qE\ell}{mv_0^2}.$$
Hors des plaques, le champ est négligé : le mouvement devient rectiligne uniforme, suivant la tangente à la parabole au point de sortie.

Si $D$ est la distance entre le **milieu des plaques** et l’écran, la déviation algébrique est :
$$Y=\frac{qE\ell D}{mv_0^2}.$$
Si l’on connaît plutôt la distance $L$ entre la sortie des plaques et l’écran, alors $D=L+\ell/2$. Les deux distances ne doivent pas être confondues.
`),
], [
  "Seules les fiches211–215 sont reprises, pas les exercices corrigés216 et suivants.",
  "Plan de tir Oxz, non Oxy, puisque y=0 ; composante initiale vx=v0cosα sans addition parasite.",
  "Formules de portée/hauteur limitées aux hypothèses correspondantes. Déviation sur écran : D mesuré depuis le milieu des plaques, conformément au dessin source.",
]);
