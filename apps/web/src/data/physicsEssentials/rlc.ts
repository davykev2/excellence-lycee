import { section, sheet } from "./types";

const sinusoidal = section("pc-rlc-sinusoidal", "I", "Écritures et lecture des phases", [334,335], String.raw`
Un générateur sinusoïdal alimente un circuit série comportant $R$, $L$ et $C$. Après le régime transitoire, le courant et la tension ont la même fréquence $N$ imposée par le générateur, avec $\omega=2\pi N$.

On note $\varphi$ la phase de la tension **par rapport au courant** :
$$i=I_m\cos(\omega t),\qquad u=U_m\cos(\omega t+\varphi).$$
Si l’on choisit plutôt la tension comme référence :
$$u=U_m\cos(\omega t),\qquad i=I_m\cos(\omega t-\varphi).$$

| Signe de $\varphi$ | Position de la tension par rapport au courant |
|---|---|
| $\varphi>0$ | En avance |
| $\varphi<0$ | En retard |
| $\varphi=0$ | En phase |

À l’oscilloscope, $u_R=Ri$ permet de suivre le courant. On compare deux maxima correspondants, ou deux passages par zéro **de même sens** :
$$|\varphi|=2\pi\frac{\Delta t}{T}=2\pi\frac dD.$$
$d$ est le décalage en divisions et $D$ le nombre de divisions d’une période. Le signe se lit en recherchant quelle courbe atteint son maximum en premier.
`);

const effective = section("pc-rlc-effective", "II", "Valeurs efficaces et impédance", [335,336], String.raw`
Pour des signaux sinusoïdaux :
$$U=\frac{U_m}{\sqrt2},\qquad I=\frac{I_m}{\sqrt2}.$$
L’impédance, exprimée en ohms, est :
$$Z=\frac UI=\frac{U_m}{I_m}.$$
Si $R_t$ désigne toute la résistance série, y compris la résistance interne de la bobine :
$$Z=\sqrt{R_t^2+\left(L\omega-\frac1{C\omega}\right)^2},\qquad I=\frac UZ.$$
Le déphasage vérifie :
$$\tan\varphi=\frac{L\omega-1/(C\omega)}{R_t},\qquad
\cos\varphi=\frac{R_t}{Z}.$$
Pour $R_t>0$, $\varphi$ est compris entre $-\pi/2$ et $\pi/2$.
`);

const fresnel = section("pc-rlc-fresnel", "III", "Dipôles et diagramme de Fresnel", [336,337], String.raw`
On prend le courant comme référence horizontale.

| Dipôle idéal | Relation instantanée | Valeur efficace | Phase de sa tension |
|---|---|---|---|
| Résistance $R_t$ | $u_{R_t}=R_ti$ | $U_{R_t}=R_tI$ | $0$ |
| Inductance $L$ | $u_L=L\,di/dt$ | $U_L=L\omega I$ | $+\pi/2$ |
| Condensateur $C$ | $i=C\,du_C/dt$ | $U_C=I/(C\omega)$ | $-\pi/2$ |

Les vecteurs de Fresnel s’additionnent : la composante horizontale vaut $R_tI$ et la composante verticale $U_L-U_C$.
$$U^2=(R_tI)^2+(U_L-U_C)^2.$$

- $L\omega>1/(C\omega)$ : circuit inductif, $\varphi>0$.
- $L\omega<1/(C\omega)$ : circuit capacitif, $\varphi<0$.
- $L\omega=1/(C\omega)$ : résonance d’intensité, $\varphi=0$.

On n’additionne pas arithmétiquement les valeurs efficaces $U_R$, $U_L$, $U_C$, ni les modules des impédances. On utilise leur représentation vectorielle.
`, "fresnel");

const resonance = section("pc-rlc-resonance", "IV", "Résonance d’intensité", [337,338], String.raw`
On fait varier la fréquence en gardant la tension efficace $U$ constante. Le courant est maximal lorsque l’impédance est minimale :
$$L\omega_0=\frac1{C\omega_0},\quad
\omega_0=\frac1{\sqrt{LC}},\quad N_0=\frac1{2\pi\sqrt{LC}}.$$
À cette fréquence :
$$Z_{\min}=R_t,\qquad I_0=\frac U{R_t},\qquad\varphi=0.$$
$I_0$ est la valeur efficace maximale **quand on fait varier la fréquence** ; l’amplitude instantanée du courant correspondant est $\sqrt2I_0$.

**Mesures de la fiche :**

| $N$ en $\mathrm{Hz}$ | 0 | 100 | 160 | 180 | 185 | 200 | 202 | 206 | 210 | 220 | 260 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| $I$ en $\mathrm{mA}$ | 0 | 16 | 50 | 90 | 107 | 150 | 107 | 100 | 80 | 50 | 30 |

Le maximum mesuré est $I_0=150\ \mathrm{mA}$ à $N_0=200\ \mathrm{Hz}$. En dessous de la résonance, le circuit est capacitif ; au-dessus, il est inductif.
`, "resonance");

const bandwidth = section("pc-rlc-bandwidth", "V", "Bande passante, qualité et surtensions", [338], String.raw`
La bande passante à $-3\ \mathrm{dB}$ est l’intervalle $[N_1,N_2]$ pour lequel :
$$I\ge\frac{I_0}{\sqrt2},\qquad
I(N_1)=I(N_2)=\frac{I_0}{\sqrt2}.$$
Sa largeur et le facteur de qualité sont :
$$\Delta N=N_2-N_1=\frac{R_t}{2\pi L},\qquad
Q=\frac{N_0}{\Delta N}=\frac{L\omega_0}{R_t}
=\frac1{R_tC\omega_0}.$$
$Q$ est sans unité. Une grande valeur correspond à une résonance plus sélective, donc une bande plus étroite.

Pour les mesures précédentes, le niveau à rechercher est $150/\sqrt2\simeq106\ \mathrm{mA}$ ; les fréquences limites se lisent aux intersections avec cette horizontale.

À la résonance, les tensions efficaces sur les parties idéales $L$ et $C$ sont :
$$U_L=U_C=QU.$$
Elles peuvent être supérieures à la tension du générateur lorsque $Q>1$. Elles se compensent dans la somme vectorielle, pas en valeur absolue.
`);

const power = section("pc-rlc-power", "VI", "Puissance moyenne en régime sinusoïdal", [339], String.raw`
Pour une tension et un courant sinusoïdaux, en convention récepteur :
$$P=UI\cos\varphi.$$
$U$ et $I$ sont les valeurs **efficaces**. $\cos\varphi$ est le facteur de puissance.

| Dipôle | Déphasage | Puissance moyenne |
|---|---|---|
| Résistance | $0$ | $P_R=RI^2$ |
| Bobine idéale | $+\pi/2$ | $P_L=0$ |
| Condensateur idéal | $-\pi/2$ | $P_C=0$ |
| Circuit RLC série réel | $\cos\varphi=R_t/Z$ | $P=R_tI^2$ |

Une bobine ou un condensateur idéal échange de l’énergie avec le circuit, mais sa puissance **moyenne sur une période** est nulle. Une bobine réelle dissipe $rI^2$ dans sa résistance interne.

Dans le circuit série :
$$P=UI\frac{R_t}{Z}=R_tI^2.$$
À la résonance, $\cos\varphi=1$ et $P=UI=U^2/R_t$.
`);

const notes = [
  "Cours334–339 uniquement ; exercice340 exclu. Même base de sections partagée entre les trois cartes RLC, résonance et puissance.",
  "Réactance capacitive rétablie 1/(Cω), largeur de bande N2−N1 et distinction I0 efficace / Im amplitude.",
  "R_t inclut toutes les résistances ; L est une inductance, C une capacité. Comparaison des passages par zéro limitée au même sens.",
  "La puissance des réactances idéales est nulle en moyenne, non à chaque instant.",
];

export default sheet("rlc-forced", "Circuit RLC en régime sinusoïdal forcé", [334,335,336,337], [sinusoidal,effective,fresnel], notes);
export const resonanceSheet = sheet("rlc-resonance", "Résonance d’intensité", [335,336,337,338], [effective,resonance,bandwidth], notes);
export const powerSheet = sheet("ac-power", "Puissance en régime sinusoïdal", [335,336,339], [effective,power], notes);
