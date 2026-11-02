import { section, sheet } from "./types";

export default sheet("ph", "Solutions aqueuses et pH", [433,434], [
  section("pc-ph-concentrations", "I", "Solvant, soluté et concentrations", [433], String.raw`
Une solution est un mélange homogène de solvant et de solutés. Elle est **aqueuse** lorsque le solvant est l’eau. Un soluté peut être initialement solide, liquide ou gazeux.

| Grandeur | Relation | Unité usuelle |
|---|---|---|
| Quantité de matière | $n=m/M$ | $\mathrm{mol}$ |
| Concentration molaire | $C=n/V=m/(MV)$ | $\mathrm{mol\,L^{-1}}$ |
| Concentration massique | $C_m=m/V=CM$ | $\mathrm{g\,L^{-1}}$ |
| Gaz dissous entièrement | $n=V_g/V_m$, puis $C=V_g/(V_mV_s)$ | $V_g$ et $V_m$ dans les mêmes conditions |

$V$ ou $V_s$ désigne le volume **final de solution**, non le volume initial d’eau. $V_g$ est le volume de gaz et $V_m$ son volume molaire.

La concentration apportée d’un composé n’est pas nécessairement la concentration de chaque ion formé. Par exemple :
$$\mathrm{CaCl_2\to Ca^{2+}+2Cl^-}
\quad\Longrightarrow\quad [\mathrm{Ca^{2+}}]=C,\quad[\mathrm{Cl^-}]=2C$$
si la dissolution est totale.

Une dissolution peut être exothermique, endothermique ou pratiquement athermique, selon qu’elle libère, absorbe ou échange très peu de chaleur.
`),
  section("pc-ph-commercial", "II", "Concentration d’une solution commerciale", [433,434], String.raw`
On note $\rho$ la masse volumique de la **solution** en $\mathrm{g\,L^{-1}}$, $M$ la masse molaire du soluté et $p$ le pourcentage massique indiqué sur l’étiquette.

La fraction massique est $w=p/100$ :
$$C=\frac{w\rho}{M}=\frac{p\rho}{100M}.$$
Si la densité par rapport à l’eau est $d$, alors $\rho\simeq1000d\ \mathrm{g\,L^{-1}}$ :
$$C=\frac{1000wd}{M}=\frac{10pd}{M}.$$
Il faut distinguer par exemple20 % et la fraction0,20 pour éviter une erreur de facteur100.
`),
  section("pc-ph-dilution", "III", "Dilution", [434], String.raw`
Diluer consiste à ajouter du solvant sans changer la quantité de soluté du prélèvement. Si aucune réaction ne consomme ce soluté :
$$n_i=n_f\quad\Longrightarrow\quad C_iV_i=C_fV_f.$$
Le facteur de dilution vaut :
$$F=\frac{V_f}{V_i}=\frac{C_i}{C_f}\ge1.$$
$V_i$ est le volume prélevé et $V_f$ le volume final. On ajuste le volume final dans la fiole, plutôt que de supposer les volumes parfaitement additifs.
`),
  section("pc-ph-water", "IV", "Autoprotolyse de l’eau et pH", [434], String.raw`
Deux molécules d’eau peuvent échanger un proton :
$$\mathrm{2H_2O\rightleftharpoons H_3O^++OH^-}.$$
Dans l’approximation des solutions diluées, les concentrations étant prises numériquement en $\mathrm{mol\,L^{-1}}$ :
$$K_e=[\mathrm{H_3O^+}][\mathrm{OH^-}],\qquad pK_e=-\log K_e.$$
À $25\,^\circ\mathrm C$, $K_e=10^{-14}$ et $pK_e=14$.
$$pH=-\log[\mathrm{H_3O^+}],\qquad
[\mathrm{H_3O^+}]=10^{-pH}.$$
Le pH est lié rigoureusement à l’activité chimique ; l’écriture avec les concentrations est le modèle usuel des solutions suffisamment diluées.

| Nature | Comparaison des concentrations | pH |
|---|---|---|
| Acide | $[\mathrm{H_3O^+}]>[\mathrm{OH^-}]$ | $pH<pK_e/2$ |
| Neutre | $[\mathrm{H_3O^+}]=[\mathrm{OH^-}]=10^{-pK_e/2}$ | $pH=pK_e/2$ |
| Basique | $[\mathrm{H_3O^+}]<[\mathrm{OH^-}]$ | $pH>pK_e/2$ |

À25°C, la neutralité correspond donc à pH 7 et à $10^{-7}\ \mathrm{mol\,L^{-1}}$ pour chacun des deux ions. La valeur neutre change avec la température.
`, "ph"),
  section("pc-ph-electroneutrality", "V", "Électroneutralité", [434], String.raw`
La charge totale d’une solution est nulle. On multiplie la concentration de chaque ion par la valeur de sa charge :
$$[\mathrm{H_3O^+}]+n[\mathrm{B^{n+}}]
=[\mathrm{OH^-}]+m[\mathrm{A^{m-}}].$$
Avec plusieurs cations et anions, on additionne tous les termes. Les molécules neutres n’interviennent pas dans cette relation.
`),
], [
  "Cours433–434 uniquement, exercice435 exclu.",
  "Cm=CM rétabli ; Vgaz/Vm distinct du volume de solution. Étiquette : masse volumique de solution, fraction w et pourcentage p distingués.",
  "Neutralité : concentration10^(−pKe/2), non10^(−pKe). pH dépend de la température et modèle d’activité/concentration explicité.",
]);
