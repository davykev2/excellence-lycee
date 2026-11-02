import { section, sheet } from "./types";

export default sheet("operational-amplifier", "Montages dérivateur et intégrateur", [316,317], [
  section("pc-aop-model", "I", "L’amplificateur opérationnel idéal", [316], String.raw`
Un amplificateur opérationnel, ou AOP, possède deux entrées : l’entrée inverseuse $E^-$ et l’entrée non inverseuse $E^+$. Il possède aussi une sortie $S$ et des bornes d’alimentation. Le circuit intégré à huit broches est un exemple courant, pas la définition de tous les AOP.

| Fonctionnement | Propriétés du modèle idéal |
|---|---|
| Entrées | $i^+=i^-=0$ |
| Régime linéaire avec contre-réaction adaptée | $V_{E^+}=V_{E^-}$ et $\lvert u_s\rvert<V_{\mathrm{sat}}$ |
| Régime saturé | $u_s=+V_{\mathrm{sat}}$ ou $-V_{\mathrm{sat}}$ |

Les égalités de potentiel des entrées ne doivent pas être appliquées en saturation.

Dans les deux montages suivants, $E^+$ est reliée à la masse et la contre-réaction permet le régime linéaire. Ainsi $V_{E^-}=0$ : c’est une masse **virtuelle**, sans liaison conductrice directe à la masse.
`),
  section("pc-aop-derivative", "II", "Montage dérivateur", [316,317], String.raw`
Le condensateur $C$ se trouve entre l’entrée du montage et $E^-$. La résistance $R$ est placée en contre-réaction entre $E^-$ et la sortie.

**1. Courant dans le condensateur.** Avec l’orientation allant de l’entrée vers $E^-$ :
$$u_C=u_e,\qquad q=Cu_e,\qquad i=C\frac{du_e}{dt}.$$

**2. Passage dans la résistance.** Comme l’entrée de l’AOP n’absorbe aucun courant, le même courant traverse $R$ :
$$Ri=-u_s.$$

**3. Relation du montage.**
$$u_s=-RC\frac{du_e}{dt}.$$
La sortie est donc proportionnelle à l’opposé de la dérivée de l’entrée.

Une entrée triangulaire donne une sortie rectangulaire : une pente positive produit un palier négatif ; une pente négative produit un palier positif. La relation vaut sur les portions où la dérivée existe et tant que la sortie ne sature pas.
`, "aop"),
  section("pc-aop-integral", "III", "Montage intégrateur", [317], String.raw`
La résistance $R$ se trouve maintenant à l’entrée ; le condensateur $C$ est en contre-réaction.

**1. Courant dans la résistance.**
$$i=\frac{u_e}{R}.$$

**2. Condensateur.** La tension entre $E^-$ et la sortie est $u_C=-u_s$. Donc :
$$i=C\frac{du_C}{dt}=-C\frac{du_s}{dt}.$$

**3. Relation du montage.**
$$\frac{du_s}{dt}=-\frac{u_e}{RC},\qquad
u_s(t)=u_s(t_0)-\frac1{RC}\int_{t_0}^{t}u_e(\tau)\,d\tau.$$
Il faut garder la valeur initiale $u_s(t_0)$, sauf si elle est donnée nulle.

Une entrée rectangulaire alternée donne une sortie triangulaire : un palier positif fait décroître la sortie linéairement ; un palier négatif la fait croître. Une entrée de moyenne non nulle peut entraîner une dérive puis la saturation.
`),
  section("pc-aop-method", "IV", "Lire ou calculer les signaux", [317], String.raw`
| Montage | Grandeur à calculer | Relation |
|---|---|---|
| Dérivateur | Pente $\Delta u_e/\Delta t$ | $u_s=-RC\,\Delta u_e/\Delta t$ |
| Intégrateur | Aire algébrique sous $u_e(t)$ | $\Delta u_s=-\frac1{RC}\int u_e\,dt$ |

$R$ est en ohms, $C$ en farads, $RC$ en secondes et les tensions en volts. On découpe le signal par intervalles, puis on vérifie le signe et l’amplitude de chaque portion de la sortie.
`),
], [
  "Cours316–317 seulement, pas les exercices318 et suivants.",
  "Huit broches réservé à l’exemple de composant et non à tous les AOP ; régime linéaire conditionné à la contre-réaction/absence de saturation.",
  "Intégrateur : constante initiale conservée et temps d’intégration muet distinct de la borne.",
]);
