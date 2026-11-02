import { section, sheet } from "./types";
export default sheet("kinematics", "Cinématique du point", [177,178,179,180,181], [
  section("pc-kin-position", "I", "Repérer un mobile et sa trajectoire", [177,178], String.raw`
Un **référentiel** associe un repère d’espace à une mesure du temps. Il faut préciser l’origine des positions et l’origine des dates.

| Déplacement étudié | Vecteur-position | Distance à l’origine |
|---|---|---|
| Sur une droite | $\overrightarrow{OM}=x\vec i$ | $OM=\lvert x\rvert$ |
| Dans un plan orthonormé | $\overrightarrow{OM}=x\vec i+y\vec j$ | $OM=\sqrt{x^2+y^2}$ |
| Dans l’espace orthonormé | $\overrightarrow{OM}=x\vec i+y\vec j+z\vec k$ | $OM=\sqrt{x^2+y^2+z^2}$ |

Les fonctions $x(t)$, $y(t)$ et $z(t)$ sont les **équations horaires**. La trajectoire est l’ensemble des positions occupées : droite, parabole, cercle ou autre courbe. Pour trouver son équation, on élimine $t$.

**Exemple 1.** Pour $x=2t-1$, $y=0$, $z=3t^2+t-5$, on obtient $t=(x+1)/2$, puis
$$z=\frac34(x+1)^2+\frac{x+1}{2}-5
=\frac34x^2+2x-\frac{15}{4}.$$
La trajectoire se trouve dans le plan $y=0$ et elle est parabolique.

**Exemple 2.** Si $x=3\cos(5t)$ et $y=3\sin(5t)$, alors
$$x^2+y^2=9\bigl(\cos^2(5t)+\sin^2(5t)\bigr)=9.$$
Le mobile décrit un cercle de centre $O$ et de rayon $3$.

Sur une trajectoire orientée, on peut utiliser l’**abscisse curviligne** $s$, mesurée le long de la courbe. Sur un cercle de rayon $R$, $s-s_0=R(\theta-\theta_0)$, avec les angles en radians. Une longueur d’arc ne doit pas être confondue avec le vecteur-position.
`, "position"),
  section("pc-kin-velocity", "II", "Vitesse moyenne et vitesse instantanée", [179], String.raw`
Entre deux dates $t_1<t_2$, le vecteur vitesse moyenne est
$$\vec v_{\mathrm{moy}}=\frac{\overrightarrow{OM_2}-\overrightarrow{OM_1}}{t_2-t_1}
=\frac{\overrightarrow{M_1M_2}}{t_2-t_1}.$$
La **vitesse moyenne de parcours** est, elle, la distance réellement parcourue divisée par la durée. Elle n’est pas toujours égale à la norme du vecteur précédent.

**Exemple.** Un cycliste parcourt $90\,\mathrm{km}$ en $1\,\mathrm h\,20\,\mathrm{min}=4/3\,\mathrm h$ :
$$v_{\mathrm{moy}}=\frac{90}{4/3}=67{,}5\,\mathrm{km\,h^{-1}}
=18{,}75\,\mathrm{m\,s^{-1}}.$$

Le vecteur vitesse instantanée est la dérivée du vecteur-position :
$$\vec v=\frac{\mathrm d\overrightarrow{OM}}{\mathrm dt}
=\dot x\vec i+\dot y\vec j+\dot z\vec k,\qquad
v=\|\vec v\|=\sqrt{\dot x^2+\dot y^2+\dot z^2}.$$
Il est appliqué au mobile, tangent à la trajectoire et orienté dans le sens du mouvement. Son unité est $\mathrm{m\,s^{-1}}$.

Pour $x=2t-1$, $y=0$, $z=3t^2+t-5$ :
$$\vec v=2\vec i+(6t+1)\vec k.$$
À $t=0$, $\vec v_0=2\vec i+\vec k$ et $v_0=\sqrt5\simeq2{,}24\,\mathrm{m\,s^{-1}}$.
`),
  section("pc-kin-acceleration", "III", "Accélération et repère de Frenet", [179,180], String.raw`
L’accélération décrit la variation du **vecteur** vitesse, donc un changement de valeur, de direction, ou des deux :
$$\vec a_{\mathrm{moy}}=\frac{\vec v_2-\vec v_1}{t_2-t_1},\qquad
\vec a=\frac{\mathrm d\vec v}{\mathrm dt}
=\ddot x\vec i+\ddot y\vec j+\ddot z\vec k.$$
$$a=\sqrt{\ddot x^2+\ddot y^2+\ddot z^2}\quad\text{en }\mathrm{m\,s^{-2}}.$$
Dans l’exemple précédent, $\vec a=6\vec k$ : sa norme vaut $6\,\mathrm{m\,s^{-2}}$.

Dans la base de **Frenet**, $\vec\tau$ est tangent dans le sens du mouvement et $\vec n$ est normal, dirigé vers l’intérieur de la courbure. Ces deux vecteurs sont unitaires et perpendiculaires.
$$\vec v=v\vec\tau,\qquad
\vec a=\underbrace{\frac{\mathrm dv}{\mathrm dt}\vec\tau}_{\vec a_t}
+\underbrace{\frac{v^2}{R}\vec n}_{\vec a_n}.$$
L’accélération tangentielle change la valeur de la vitesse ; l’accélération normale change sa direction. $R$ est le rayon de courbure. Un mouvement peut donc être accéléré au sens vectoriel même si la valeur de sa vitesse reste constante.
`, "frenet"),
  section("pc-kin-straight", "IV", "Mouvements rectilignes", [180,181], String.raw`
Sur l’axe choisi, $x_0$ et $v_0$ sont les valeurs à la date initiale $t_0$. Les composantes $v_x$ et $a_x$ sont **algébriques** : elles peuvent être négatives.

| Mouvement | Accélération et vitesse | Équation horaire |
|---|---|---|
| Rectiligne uniforme (MRU) | $a_x=0$, $v_x=v_0$ constant | $x=x_0+v_0(t-t_0)$ |
| Rectiligne uniformément varié (MRUV) | $a_x=a$ constant, $v_x=v_0+a(t-t_0)$ | $x=x_0+v_0(t-t_0)+\frac12a(t-t_0)^2$ |

Pour un MRUV, entre deux positions :
$$v_{x2}-v_{x1}=a(t_2-t_1),\qquad
v_{x2}^{\,2}-v_{x1}^{\,2}=2a(x_2-x_1).$$
La seconde relation est utile lorsque la durée est inconnue. Si $t_0=0$, il suffit de remplacer $t-t_0$ par $t$.
`),
  section("pc-kin-circle", "V", "Mouvement circulaire uniforme", [181], String.raw`
Le mobile décrit un cercle de rayon $R$ à vitesse de valeur constante. En choisissant le sens positif de rotation dans le sens du mouvement :
$$\theta=\theta_0+\omega(t-t_0),\qquad
s=s_0+v(t-t_0),\qquad v=R\omega.$$
La vitesse angulaire $\omega$ est constante et s’exprime en $\mathrm{rad\,s^{-1}}$.

Pour un tour complet :
$$\omega=\frac{2\pi}{T}=2\pi f,\qquad f=N=\frac1T.$$
$T$ est la période en secondes ; $f$ ou $N$ est la fréquence en hertz.

La direction du vecteur vitesse change continuellement : l’accélération n’est **pas nulle**.
$$a_t=0,\qquad \vec a=\frac{v^2}{R}\vec n=R\omega^2\vec n.$$
Si l’on garde une orientation angulaire quelconque, la vitesse de valeur positive s’écrit $v=R|\omega|$.
`),
], [
  "Les seules pages de rappel 177–181 sont intégrées ; les exercices corrigés à partir de182 et la banque à partir de184 sont hors de cette fiche.",
  "MRUV : la constante finale est x0, pas v0 ; différencier vitesse scalaire de parcours et vecteur vitesse moyenne ; ne pas identifier l’arc à un vecteur.",
  "Exemple v0=√5 arrondi à2,24m/s ; normes des deux vecteurs de Frenet unitaires. Le MCU possède une accélération normale, même à vitesse scalaire constante.",
]);
