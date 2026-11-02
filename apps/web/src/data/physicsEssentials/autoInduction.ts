import { section, sheet } from "./types";

export default sheet("auto-induction", "Auto-induction", [304,305,306], [
  section("pc-auto-observation", "I", "Une bobine s’oppose aux variations du courant", [304,305], String.raw`
Dans deux branches de même résistance totale, l’une résistive et l’autre contenant une bobine, l’établissement du courant est retardé dans la branche inductive. Une lampe de cette branche s’allume progressivement.

La bobine s’oppose à une **variation** du courant, et non au courant permanent lui-même. Cette propriété est l’auto-induction.

| Régime | Intensité |
|---|---|
| Transitoire | $i$ varie au cours du temps |
| Permanent continu | $i$ est constante |

Dans un circuit comportant un chemin de décharge, le courant peut décroître progressivement après coupure de l’alimentation. Une ouverture brusque sans chemin adapté peut au contraire produire une forte tension aux bornes de la bobine.

À l’oscilloscope, une résistance $R$ permet de suivre le courant puisque $u_R=Ri$ : les courbes de $u_R(t)$ et $i(t)$ ont la même forme.
`),
  section("pc-auto-inductance", "II", "Flux propre et inductance", [305], String.raw`
Le courant de la bobine crée lui-même un champ magnétique. Le flux total de ce champ à travers ses spires est le **flux propre**.

Pour une bobine linéaire à géométrie fixe :
$$\Phi_p=Li.$$
L’inductance $L$ est le coefficient de proportionnalité. Elle s’exprime en henrys ($\mathrm H$) ; le flux est en webers et le courant en ampères.

Pour un solénoïde long à noyau d’air, de $N$ spires, longueur $\ell$ et section $S$ :
$$B=\mu_0\frac N\ell i,\qquad
\Phi_p=NBS=\mu_0\frac{N^2S}{\ell}i,$$
donc :
$$L=\mu_0\frac{N^2S}{\ell}=\mu_0n^2\ell S,\qquad n=\frac N\ell.$$
Pour une section circulaire de rayon $r$, $S=\pi r^2$. Le flux total comporte bien le facteur $N$ ; il ne faut pas le confondre avec le flux d’une seule spire.
`),
  section("pc-auto-voltage", "III", "Force électromotrice et tension aux bornes", [305,306], String.raw`
La force électromotrice induite s’oppose à la variation de flux :
$$e=-\frac{d\Phi_p}{dt}=-L\frac{di}{dt}.$$
La seconde égalité suppose $L$ constante. Si le courant augmente dans le sens choisi, $e<0$ ; s’il diminue, $e>0$.

En convention récepteur, le courant entre par la borne $A$ et $u_{AB}=V_A-V_B$. Pour une bobine d’inductance $L$ et de résistance interne $r$ :
$$u_{AB}=ri-e=ri+L\frac{di}{dt}.$$

| Situation | Relation |
|---|---|
| Bobine idéale, $r=0$ | $u_{AB}=L\,di/dt=-e$ |
| Courant constant | $u_{AB}=ri$ |
| Variation linéaire du courant | $u_{AB}=ri+L\,\Delta i/\Delta t$ sur chaque intervalle |

Sur un graphique, on calcule d’abord la pente de $i(t)$, en convertissant les millisecondes en secondes avant de multiplier par $L$.
`, "induction"),
  section("pc-auto-energy", "IV", "Énergie magnétique et pertes", [306], String.raw`
L’énergie magnétique stockée dans une bobine vaut :
$$E_{\mathrm{mag}}=\frac12Li^2.$$
Elle est positive ou nulle, quel que soit le signe de $i$.

La puissance reçue se partage entre chaleur et stockage :
$$p=ui=ri^2+Li\frac{di}{dt}
=ri^2+\frac{d}{dt}\left(\frac12Li^2\right).$$
Entre $t_1$ et $t_2$ :
$$E_{\text{reçue}}=\int_{t_1}^{t_2}ri^2\,dt
+\frac12L\left(i_2^2-i_1^2\right).$$
L’énergie dissipée par effet Joule est donc $\int ri^2dt$. On peut l’écrire $rI^2\Delta t$ uniquement si l’intensité $I$ reste constante pendant l’intervalle.
`),
], [
  "Fiches304–306 uniquement ; exercices307 et suivants exclus.",
  "Observation d’extinction contradictoire L2 avant L2 remplacée par une distinction physique entre décharge en circuit fermé et surtension d’ouverture.",
  "Flux lié total distingué du flux d’une spire ; bobine linéaire/L constant précisés.",
  "Énergie reçue rétablie avec intégrale Joule et variation d’énergie magnétique ; ri²t non utilisé pour un courant variable.",
]);
