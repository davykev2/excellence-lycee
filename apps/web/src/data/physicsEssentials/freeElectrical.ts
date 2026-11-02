import { section, sheet } from "./types";

export default sheet("free-electrical", "Oscillations électriques libres", [321,322,323,324], [
  section("pc-lc-equation", "I", "Circuit LC et équation différentielle", [321,322], String.raw`
On charge un condensateur de capacité $C$, puis on le relie à une bobine idéale d’inductance $L$, sans générateur et sans résistance. Le circuit obtenu est un oscillateur électrique libre.

On note $q$ la charge d’une armature et on choisit le courant entrant sur cette armature : $i=dq/dt$. Avec les orientations récepteur correspondantes :
$$u_C=\frac qC,\qquad u_L=L\frac{di}{dt},\qquad u_C+u_L=0.$$
Ainsi :
$$L\ddot q+\frac qC=0
\quad\Longleftrightarrow\quad \ddot q+\frac1{LC}q=0.$$
Le signe du courant dépend de l’orientation choisie ; on doit garder la même convention pendant tout le calcul.
`, "lc"),
  section("pc-lc-solution", "II", "Charge, intensité et période", [322], String.raw`
Une solution est :
$$q(t)=Q_m\cos(\omega_0t+\varphi),\qquad
i(t)=-\omega_0Q_m\sin(\omega_0t+\varphi).$$
En dérivant encore, $\ddot q=-\omega_0^2q$. La solution vérifie donc l’équation si :
$$\omega_0=\frac1{\sqrt{LC}},\qquad
T_0=2\pi\sqrt{LC},\qquad
N_0=\frac1{2\pi\sqrt{LC}}.$$
$Q_m$ est en coulombs, $I_m=\omega_0Q_m$ en ampères, $L$ en henrys et $C$ en farads.

$Q_m$ et $\varphi$ sont fixés par les conditions initiales. Si $q(0)=Q_m>0$ et $i(0)=0$, on prend $\varphi=0$.
`),
  section("pc-lc-cycle", "III", "Suivre une oscillation complète", [321,322], String.raw`
Pour $q=Q_m\cos(\omega_0t)$ :

| Intervalle | Évolution de la charge | État du condensateur |
|---|---|---|
| $0\to T_0/4$ | $Q_m\to0$ | Décharge |
| $T_0/4\to T_0/2$ | $0\to-Q_m$ | Recharge avec polarité inversée |
| $T_0/2\to3T_0/4$ | $-Q_m\to0$ | Décharge |
| $3T_0/4\to T_0$ | $0\to Q_m$ | Recharge initiale |

Avec $i=dq/dt$, $i<0$ pendant la première demi-période, puis $i>0$ pendant la seconde. Chaque charge ou décharge dure un quart de période.
`),
  section("pc-lc-energy", "IV", "Conservation et échange d’énergie", [323], String.raw`
$$E_e=\frac{q^2}{2C}=\frac12Cu_C^2,\qquad
E_m=\frac12Li^2.$$
Dans le circuit idéal :
$$E=E_e+E_m=\frac{Q_m^2}{2C}=\frac12LI_m^2.$$
En remplaçant $q$ et $i$, on retrouve la conservation grâce à $\cos^2+\sin^2=1$ et $L\omega_0^2=1/C$.

- Quand $|q|=Q_m$, le courant est nul : toute l’énergie est électrique.
- Quand $q=0$, $|i|=I_m$ : toute l’énergie est magnétique.
- Entre ces instants, les deux formes coexistent.
`),
  section("pc-lc-analogy", "V", "Analogie avec l’oscillateur mécanique", [323,324], String.raw`
| Circuit électrique | Système solide–ressort |
|---|---|
| Charge $q$ | Élongation $x$ |
| Courant $i=\dot q$ | Vitesse $v=\dot x$ |
| Inductance $L$ | Masse $m$ |
| Inverse de capacité $1/C$ | Raideur $k$ |
| $\ddot q+q/(LC)=0$ | $\ddot x+(k/m)x=0$ |
| $T_0=2\pi\sqrt{LC}$ | $T_0=2\pi\sqrt{m/k}$ |
| $q^2/(2C)$ | $kx^2/2$ |
| $Li^2/2$ | $mv^2/2$ |
`),
  section("pc-lc-damping", "VI", "Amortissement et entretien", [324], String.raw`
Dans un circuit réel de résistance totale $r$, l’énergie diminue :
$$\frac{dE}{dt}=-ri^2.$$
Une faible résistance donne des oscillations amorties, de pseudo-période $T$ ; une résistance suffisamment grande donne un retour apériodique, sans oscillation.

Un dispositif actif peut compenser les pertes. S’il fournit une tension équivalente à $R_0i$ dans le sens moteur, l’équation devient :
$$L\ddot q+(r-R_0)\dot q+\frac qC=0.$$
Dans ce modèle, $R_0=r$ compense exactement l’amortissement et retrouve l’équation LC. L’énergie nécessaire vient de l’alimentation du dispositif actif.
`),
], [
  "Cours321–324 seulement ; exercice corrigé325 non importé.",
  "Recharge de T/4 à T/2 rétablie 0→−Qm. Convention i=dq/dt explicite et conservée.",
  "Analogie vitesse rétablie v=dx/dt ; distinction énergie/puissance Joule et source d’énergie de l’entretien.",
]);
