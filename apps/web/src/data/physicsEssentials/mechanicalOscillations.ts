import { section, sheet } from "./types";

export default sheet("mechanical-oscillations", "Oscillations mécaniques libres", [242,243,244,245], [
  section("pc-osc-model", "I", "Le système solide–ressort", [242], String.raw`
Un solide de masse $m$ est attaché à un ressort de raideur $k$. Il glisse horizontalement sans frottement. On repère son centre d’inertie par l’abscisse $x$, mesurée depuis la position d’équilibre.

Le poids et la réaction normale se compensent. La force de rappel du ressort vaut :
$$F_x=-kx.$$
Le signe « moins » signifie que le ressort ramène toujours le solide vers l’équilibre : si $x>0$, la force est dirigée vers les $x$ décroissants, et inversement.

La deuxième loi de Newton donne :
$$m\ddot x=-kx\quad\Longleftrightarrow\quad
\ddot x+\frac{k}{m}x=0.$$
$m$ est en $\mathrm{kg}$, $k$ en $\mathrm{N\,m^{-1}}$, $x$ en $\mathrm m$ et le temps en secondes.
`, "oscillator"),
  section("pc-osc-solution", "II", "Équation horaire, période et fréquence", [242,243], String.raw`
En posant $\omega_0=\sqrt{k/m}$, une solution s’écrit :
$$x(t)=X_m\cos(\omega_0t+\varphi).$$
On peut aussi utiliser un sinus, à condition d’adapter la phase initiale.

| Grandeur | Relation | Unité |
|---|---|---|
| Amplitude | $X_m\ge0$ | $\mathrm m$ |
| Pulsation propre | $\omega_0=\sqrt{k/m}$ | $\mathrm{rad\,s^{-1}}$ |
| Période propre | $T_0=2\pi/\omega_0=2\pi\sqrt{m/k}$ | $\mathrm s$ |
| Fréquence propre | $N_0=1/T_0=\omega_0/(2\pi)$ | $\mathrm{Hz}$ |
| Phase initiale | $\varphi$ définie modulo $2\pi$ | $\mathrm{rad}$ |

Pour vérifier la solution, on dérive deux fois :
$$\dot x=-X_m\omega_0\sin(\omega_0t+\varphi),\qquad
\ddot x=-X_m\omega_0^2\cos(\omega_0t+\varphi)=-\omega_0^2x.$$
On retrouve bien $\ddot x+\omega_0^2x=0$.
`),
  section("pc-osc-initial", "III", "Utiliser les conditions initiales", [243,244], String.raw`
Avec la convention $x=X_m\cos(\omega_0t+\varphi)$, à $t=0$ :
$$x_0=X_m\cos\varphi,\qquad v_0=-X_m\omega_0\sin\varphi.$$
En élevant ces relations au carré puis en les additionnant :
$$X_m=\sqrt{x_0^2+\left(\frac{v_0}{\omega_0}\right)^2}.$$
Pour $X_m>0$, on détermine ensuite la phase grâce aux **deux** relations :
$$\cos\varphi=\frac{x_0}{X_m},\qquad
\sin\varphi=-\frac{v_0}{X_m\omega_0}.$$
Leur signe permet de choisir le bon quadrant ; une tangente seule ne suffit pas.

| Conditions à $t=0$ | Une phase possible |
|---|---|
| $x_0>0$, $v_0=0$ | $\varphi=0$ |
| $x_0<0$, $v_0=0$ | $\varphi=\pi$ |
| $x_0=0$, $v_0>0$ | $\varphi=-\pi/2$ |
| $x_0=0$, $v_0<0$ | $\varphi=\pi/2$ |

Si le solide est écarté de $a$ puis lâché sans vitesse, alors $X_m=|a|$. Ce résultat ne s’applique pas si on lui communique aussi une vitesse initiale.
`),
  section("pc-osc-energy", "IV", "Échange entre énergie cinétique et énergie élastique", [244,245], String.raw`
L’origine de l’énergie potentielle élastique est choisie à l’équilibre :
$$E_p=\frac12kx^2,\qquad E_c=\frac12mv^2.$$
Sans frottement, l’énergie mécanique reste constante :
$$E_m=E_c+E_p=\frac12kX_m^2=\frac12mV_m^2,\qquad V_m=\omega_0X_m.$$

| Position | Vitesse | Énergie cinétique | Énergie potentielle |
|---|---|---|---|
| Extrémités $x=\pm X_m$ | $v=0$ | $0$ | $E_m$ |
| Équilibre $x=0$ | $\lvert v\rvert=V_m$ | $E_m$ | $0$ |
| Entre les deux | $v^2=\omega_0^2(X_m^2-x^2)$ | $\frac12mv^2$ | $\frac12kx^2$ |

L’énergie passe donc continuellement d’une forme à l’autre. La vitesse est maximale en valeur absolue à l’équilibre, pas aux extrémités.

En dérivant $E_m$ :
$$\frac{dE_m}{dt}=v\left(m\ddot x+kx\right)=0.$$
L’équation du mouvement assure cette conservation même aux instants où $v=0$ ; il n’est pas nécessaire de diviser par la vitesse.
`),
], [
  "Cours242–245 uniquement ; aucune importation des exercices corrigés246 et suivants.",
  "Rétablissement du facteur x dans l’équation différentielle et du sinus dans la dérivée du cosinus.",
  "Amplitude générale avec vitesse initiale ; |a| réservé au lâcher sans vitesse. Phase déterminée par sinus et cosinus.",
  "La démonstration énergétique ne divise pas par une vitesse qui s’annule aux extrémités.",
]);
