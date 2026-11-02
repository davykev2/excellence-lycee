import { integralExercise as ex, written } from "./terminalCIntegralBuilders";

export const integralComplex = [
  ex(65, "Couvrir la surface sous un pont", String.raw`Une entreprise construit un pont reliant deux quartiers distants de $550$ m. Pour une position $\ell\in[0;550]$, la hauteur, en mètres, est $h(\ell)=\ell^2/1600-\ell/4+125$.

Pour empêcher le passage sous le pont pendant les travaux, un ouvrier doit couvrir de grillage la surface $OABC$, comprise entre la courbe, le sol et les deux extrémités. Propose une solution argumentée pour déterminer la surface nécessaire.`, [
    written("1.", "Détermine la quantité de grillage nécessaire, en m².", String.raw`**1. Reconnaître l’aire.** On cherche la surface sous la courbe, pas la longueur de l’arche. $h$ a pour minimum $h(200)=100>0$ ; l’aire vaut donc :
$$\mathcal A=\int_0^{550}\left(\frac{\ell^2}{1600}-\frac\ell4+125\right)d\ell.$$
**2. Calculer.** Une primitive est $\ell^3/4800-\ell^2/8+125\ell$.
$$\mathcal A=\frac{550^3}{4800}-\frac{550^2}8+125(550)=\frac{3\,148\,750}{48}\ {\rm m}^2.$$
**3. Conclure.** L’aire vaut environ **$65\,598,96$ m²**, soit **$65\,599$ m²** au mètre carré supérieur pour couvrir toute la surface. Ce calcul géométrique n’inclut pas de marge de pose ou de découpe non donnée dans l’énoncé.`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(66, "Retrouver la superficie cultivable", String.raw`Un cultivateur dispose d’une parcelle rectangulaire. Le maïs occupe le rectangle $[0;e]\times[0;1]$ ; l’igname occupait le rectangle $[e;e^2]\times[0;1]$.

Un glissement de terrain réduit la parcelle d’igname : sa nouvelle frontière supérieure est $y=2-\ln x$, de $A(e;1)$ à $B(e^2;0)$. Le repère est orthonormé d’unité $1$ hm.

Détermine la nouvelle superficie totale. On peut prendre $e^2\approx7,4$ ; donne un résultat arrondi à l’unité.`, [
    written("1.", "Calcule la nouvelle superficie disponible pour les cultures.", String.raw`**1. Séparer les cultures.** Le maïs conserve son rectangle d’aire $e\times1=e$ hm². L’igname occupe l’aire sous $2-\ln x$, positive entre $e$ et $e^2$.
$$\mathcal A=e+\int_e^{e^2}(2-\ln x)\,dx.$$
**2. Trouver une primitive.** Par parties, $\int\ln x=x\ln x-x$. Une primitive de $2-\ln x$ est donc $3x-x\ln x$.
$$\int_e^{e^2}(2-\ln x)\,dx=(3e^2-2e^2)-(3e-e)=e^2-2e.$$
**3. Conclure avec les unités.** L’aire totale vaut **$e^2-e$ hm²**. Comme $1$ hm² $=1$ hectare, cela représente environ $7,4-2,72=4,68$ hectares, soit **$5$ hectares à l’unité la plus proche**.

Cette valeur arrondie est une estimation ; la superficie exacte est $e^2-e$ hectares.`),
  ], { figureKey: "tc-l7-integrals" }),
  ex(67, "Nombre moyen sur les trente premiers jours", String.raw`Dans un modèle d’une maladie apparue au début de2021, le nombre de personnes atteintes au bout de $x$ jours est représenté par $f(x)=x^2e^{x/30}$, pour $0\le x\le30$.

Les responsables souhaitent calculer le nombre moyen de personnes atteintes sur les trente premiers jours. Utilise le calcul intégral pour obtenir cette moyenne dans le modèle.`, [
    written("1.", "Calcule le nombre moyen de personnes sur l’intervalle.", String.raw`**1. Écrire la moyenne.** Le modèle est continu ; on calcule une moyenne intégrale :
$$\mu=\frac1{30}\int_0^{30}x^2e^{x/30}\,dx.$$
**2. Première intégration par parties.** Avec $u=x^2$, $v'=e^{x/30}$, $v=30e^{x/30}$ :
$$I=[30x^2e^{x/30}]_0^{30}-60\int_0^{30}xe^{x/30}\,dx.$$
**3. Deuxième intégration.** Pour $J=\int_0^{30}xe^{x/30}$, on prend $u=x$, $v'=e^{x/30}$ :
$$J=[30xe^{x/30}]_0^{30}-30\int_0^{30}e^{x/30}\,dx=900e-900(e-1)=900.$$
Donc $I=27\,000e-54\,000$.

**4. Conclure.** Après division par30 :
$$\boxed{\mu=900e-1800\approx646,45.}$$
Le modèle donne donc environ **646 personnes en moyenne**, sans interpréter cet arrondi comme un décompte exact ni comme une prévision sanitaire réelle.`),
  ], { correctionFigureKey: "tc-l7-integrals" }),
];
