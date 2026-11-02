import { section, sheet } from "./types";

export default sheet("laplace", "Loi de Laplace", [292,293,294,295,296], [
  section("pc-laplace-law", "I", "Action du champ sur un conducteur", [292], String.raw`
Dans l’expérience des rails de Laplace, une tige conductrice mobile est placée dans un champ magnétique. Lorsqu’un courant la traverse, elle se déplace. Inverser le courant ou le champ inverse le sens de la force.

Pour une portion rectiligne de longueur $\ell$ entièrement plongée dans un champ uniforme :
$$\vec F=I\,\vec\ell\wedge\vec B,\qquad F=I\ell B|\sin\alpha|.$$
$\vec\ell$ est orienté dans le sens du courant conventionnel ; $\alpha$ est l’angle entre $\vec\ell$ et $\vec B$. Seule la longueur effectivement située dans le champ est à prendre en compte.

- La force est perpendiculaire au conducteur et au champ.
- Son sens suit la règle du produit vectoriel $\vec\ell\wedge\vec B$.
- Si le conducteur est perpendiculaire au champ, $F=I\ell B$ ; s’il lui est parallèle, $F=0$.

La force de Laplace est l’action macroscopique liée aux forces magnétiques exercées sur les porteurs de charge dans le conducteur.
`, "laplace"),
  section("pc-laplace-applications", "II", "Roue de Barlow, balance et haut-parleur", [292,293], String.raw`
**Roue de Barlow.** Dans ce dispositif historique, un courant traverse un rayon conducteur d’une roue, dans un champ perpendiculaire à son plan. La force répartie entraîne la rotation. Pour un rayon de longueur $\ell$ entièrement dans un champ uniforme :
$$F=IB\ell,\qquad |\mathcal M|=\frac12IB\ell^2,\qquad
|\mathcal P|=|\mathcal M\omega|.$$
Le facteur $\ell/2$ vient de la répartition uniforme de la force sur le rayon.

**Balance de Cotton.** La force magnétique sur une portion de fil équilibre l’effet d’une masse ajoutée. Pour des bras de levier égaux :
$$I\ell B=mg\quad\Longrightarrow\quad B=\frac{mg}{I\ell}.$$
Si les bras sont différents, on écrit d’abord l’équilibre des moments : $I\ell B\,d_1=mg\,d_2$.

**Haut-parleur électrodynamique.** Une bobine solidaire d’une membrane se trouve dans un champ radial. Le courant alternatif produit une force axiale alternativement dirigée dans un sens puis dans l’autre. La membrane vibre et émet un son.

**Moteur à courant continu.** Des forces sur les côtés de la bobine produisent un couple. Le collecteur inverse le courant à chaque demi-tour afin de maintenir le couple moteur dans le même sens.
`),
  section("pc-laplace-wires", "III", "Interaction entre deux fils parallèles", [294], String.raw`
Deux longs conducteurs rectilignes parallèles, distants de $d$, exercent l’un sur l’autre une action magnétique.

- Courants de même sens : attraction.
- Courants de sens opposés : répulsion.

Le champ créé par le premier fil au niveau du second vaut :
$$B_1=\frac{\mu_0I_1}{2\pi d}.$$
La force sur une longueur $\ell$ du second fil est :
$$F=\frac{\mu_0I_1I_2\ell}{2\pi d},\qquad
\frac F\ell=\frac{\mu_0I_1I_2}{2\pi d}.$$
Le modèle suppose des fils suffisamment longs pour négliger les effets des extrémités.

Avec $I_1=I_2=1\ \mathrm A$, $d=1\ \mathrm m$ et $\mu_0\simeq4\pi\times10^{-7}\ \mathrm{H\,m^{-1}}$, on obtient $F/\ell\simeq2\times10^{-7}\ \mathrm{N\,m^{-1}}$.
`),
  section("pc-laplace-frame", "IV", "Couple sur un cadre et positions d’équilibre", [294,295], String.raw`
Un cadre plan de surface $S$ est orienté par sa normale unitaire $\vec n$. Les doigts de la main droite suivent le courant ; le pouce donne le sens de $\vec n$.

Dans un champ uniforme, les forces opposées sur les côtés du cadre ont une résultante nulle mais peuvent former un couple. Pour $N$ spires :
$$|\mathcal M|=NIBS|\sin\theta|,\qquad \theta=(\vec n,\vec B).$$
Pour une seule spire, on pose $N=1$.

| Orientation | Couple | Nature de l’équilibre, si le cadre est libre |
|---|---|---|
| $\vec n$ et $\vec B$ de même sens, $\theta=0$ | Nul | Stable |
| $\vec n$ et $\vec B$ de sens opposés, $\theta=\pi$ | Nul | Instable |
| $\theta=\pi/2$ | Valeur maximale $NIBS$ | Le cadre tend à s’orienter |

« Stable » signifie qu’après un petit écart, le couple tend à ramener le cadre vers cette orientation.
`),
  section("pc-laplace-flux", "V", "Flux magnétique", [295,296], String.raw`
Pour une surface plane orientée $\vec S=S\vec n$ dans un champ uniforme :
$$\Phi_1=\vec B\cdot\vec S=BS\cos\theta.$$
Pour $N$ spires identiques traversées par le même champ :
$$\Phi=NBS\cos\theta.$$
Le flux est une grandeur algébrique exprimée en webers ($\mathrm{Wb}$).

| Angle avec la normale | Flux d’une spire |
|---|---|
| $\theta=0$ | $+BS$, maximal |
| $\theta=\pi/2$ | $0$ |
| $\theta=\pi$ | $-BS$ |

Attention : $\theta$ est l’angle du champ avec la **normale**, pas avec le plan de la spire.

Un cadre parcouru par un courant maintenu et libre de tourner tend vers l’orientation où le flux orienté dans le sens du courant est maximal : $\vec n$ s’aligne sur $\vec B$. C’est la règle du flux maximal.
`, "flux"),
], [
  "Cours292–296 repris, exercice297 exclu. Figures originales, pas de photographie ni procédure de manipulation au mercure.",
  "Force sur un côté donnée avec son sinus ; cadre traité par le couple NIBSsinθ, non par la formule perpendiculaire appliquée à tous les côtés.",
  "L’ancienne définition légale de l’ampère de la source est remplacée par son exemple numérique de force, sans présenter cette définition historique comme actuelle.",
  "Flux défini comme produit scalaire et non comme comptage littéral de lignes.",
]);
