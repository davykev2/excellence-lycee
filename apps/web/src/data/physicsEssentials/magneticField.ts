import { section, sheet } from "./types";

export default sheet("magnetic-field", "Champ magnétique", [257,258], [
  section("pc-mag-vector", "I", "Reconnaître et représenter un champ magnétique", [257], String.raw`
Un aimant ou un conducteur parcouru par un courant modifie l’espace autour de lui : une petite aiguille aimantée peut s’y orienter. Cette action est décrite par le vecteur champ magnétique $\vec B$.

- Sa direction est celle d’une petite aiguille aimantée à l’équilibre.
- Son sens va du pôle sud vers le pôle nord de **cette aiguille**.
- Sa valeur $B$ se mesure avec un teslamètre et s’exprime en teslas ($\mathrm T$).

Une ligne de champ est une courbe tangente à $\vec B$ en chacun de ses points, orientée dans le sens du champ. L’ensemble des lignes constitue le spectre magnétique.

À l’extérieur d’un aimant droit, les lignes vont du pôle nord vers le pôle sud. Dans l’entrefer d’un aimant en U, elles sont approximativement parallèles : le champ y est presque uniforme.
`, "magnetic"),
  section("pc-mag-solenoid", "II", "Champ créé par un solénoïde", [257,258], String.raw`
Un solénoïde est un enroulement de $N$ spires sur une longueur $\ell$. Son nombre de spires par mètre est :
$$n=\frac{N}{\ell}.$$
Pour un solénoïde long, loin des extrémités, le champ intérieur est sensiblement uniforme :
$$B=\mu_0nI=\mu_0\frac{N}{\ell}I,\qquad
\mu_0\simeq4\pi\times10^{-7}\ \mathrm{H\,m^{-1}}.$$
$I$ est en ampères et $\ell$ en mètres. Le modèle de solénoïde long est utilisé lorsque la longueur est grande devant le rayon, par exemple $\ell\ge10r$.

**Sens du champ :** on enroule les doigts de la main droite dans le sens du courant ; le pouce indique le sens de $\vec B$ à l’intérieur, donc vers la face nord. Vue de face, une circulation antihoraire correspond à une face nord ; une circulation horaire, à une face sud.

À l’intérieur, le champ est dirigé de la face sud vers la face nord. Il se referme à l’extérieur dans l’autre sens.

Pour un bobinage régulier à spires jointives, comportant $p$ couches et un fil de diamètre $d$, on peut estimer $n\simeq p/d$. Cette estimation suppose des spires effectivement jointives ; la définition générale reste $n=N/\ell$.
`),
  section("pc-mag-superposition", "III", "Additionner plusieurs champs", [258], String.raw`
Au même point, les champs s’additionnent **vectoriellement** :
$$\vec B=\vec B_1+\vec B_2.$$

| Disposition de $\vec B_1$ et $\vec B_2$ | Valeur du champ résultant |
|---|---|
| Même direction et même sens | $B=B_1+B_2$ |
| Même direction et sens opposés | $B=\lvert B_1-B_2\rvert$, dans le sens du plus grand |
| Directions perpendiculaires | $B=\sqrt{B_1^2+B_2^2}$ |

Dans le cas perpendiculaire, si $\theta$ est l’angle entre le champ résultant et $\vec B_1$, alors $\tan\theta=B_2/B_1$ pour $B_1>0$.

Pour vérifier expérimentalement $B\propto I$ à l’intérieur d’un solénoïde, on place la sonde du teslamètre sur son axe, on mesure l’intensité avec un ampèremètre et on fait varier $I$ sans déplacer la sonde.
`, "superposition"),
], [
  "Fiches257–258 uniquement ; exercices259 et suivants exclus.",
  "Le sens S→N d’une aiguille ne doit pas être confondu avec N→S hors d’un aimant.",
  "Superposition opposée exprimée avec une valeur absolue ; estimation multicouche limitée aux spires jointives.",
]);
