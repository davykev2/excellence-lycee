import { section, sheet } from "./types";
export default sheet("inertia", "Mouvement du centre d’inertie d’un solide", [196,197,198], [
  section("pc-inertia-work", "I", "Travail des forces", [196,197], String.raw`
Pour une force constante pendant le déplacement de $A$ à $B$ :
$$W_{A\to B}(\vec F)=\vec F\cdot\overrightarrow{AB}
=F\,AB\cos\alpha.$$
Le travail est une énergie, exprimée en joules : $F$ est en newtons et $AB$ en mètres. L’angle $\alpha$ est celui entre la force et le déplacement.

| Situation | Travail |
|---|---|
| Force parallèle, dans le sens du déplacement | $W=F\,AB>0$ : travail moteur |
| Frottement constant, opposé au déplacement | $W=-f\,AB<0$ : travail résistant |
| Force perpendiculaire au déplacement | $W=0$ |
| Poids, de l’altitude $z_A$ à $z_B$ | $W(\vec P)=mg(z_A-z_B)$ |

Pour une montée de hauteur $h$, $W(\vec P)=-mgh$ ; pour une descente, $W(\vec P)=mgh$. Sur un plan incliné d’angle $\alpha$, $h=AB\sin\alpha$. Sur un trajet horizontal, le travail du poids est nul.

La réaction normale $\vec R_n$ ne travaille pas sur un support fixe puisque $\vec R_n$ est perpendiculaire au déplacement. Si le support exerce aussi des frottements, la réaction totale est $\vec R=\vec R_n+\vec f$ : son travail n’est alors plus nécessairement nul.

Sur une piste circulaire, on dessine la normale selon la surface en contact : vers le centre à l’intérieur d’une piste, vers l’extérieur si le mobile repose sur la face extérieure. Ce dessin ne dispense jamais du bilan des forces.
`, "forces"),
  section("pc-inertia-power", "II", "Puissance mécanique", [197], String.raw`
La puissance indique à quel rythme une force échange de l’énergie :
$$\mathcal P_{\mathrm{moy}}=\frac{W}{\Delta t},\qquad
\mathcal P(t)=\vec F\cdot\vec v=Fv\cos(\vec F,\vec v).$$
L’unité est le watt : $1\,\mathrm W=1\,\mathrm{J\,s^{-1}}$. Une force perpendiculaire à la vitesse a une puissance instantanée nulle.
`),
  section("pc-inertia-newton", "III", "Théorème du centre d’inertie", [197], String.raw`
Dans un **référentiel galiléen**, pour un système de masse constante :
$$\sum\vec F_{\mathrm{ext}}=m\vec a_G.$$
On additionne uniquement les forces extérieures appliquées au système choisi. Après avoir écrit la relation vectorielle, on la projette sur les axes adaptés au mouvement.

**Principe d’inertie.** Si le système est isolé ou pseudo-isolé, la résultante extérieure est nulle :
$$\sum\vec F_{\mathrm{ext}}=\vec0
\ \Longrightarrow\ \vec a_G=\vec0
\ \Longrightarrow\ \vec v_G=\text{constante}.$$
Le centre d’inertie reste au repos ou se déplace en ligne droite à vitesse constante.

**Quantité de mouvement.** Pour un système de masse totale $m$ :
$$\vec p=m\vec v_G,\qquad \frac{\mathrm d\vec p}{\mathrm dt}=\sum\vec F_{\mathrm{ext}}.$$
Si la résultante extérieure est nulle, le vecteur quantité de mouvement est conservé.
`),
  section("pc-inertia-energy", "IV", "Théorème de l’énergie cinétique", [197], String.raw`
Pour un point matériel ou un solide en translation :
$$E_c=\frac12mv_G^2.$$
Dans un référentiel galiléen, entre deux positions :
$$E_{cB}-E_{cA}=\sum W_{A\to B}(\vec F_{\mathrm{ext}}).$$
Le théorème relie directement les vitesses et les travaux. Il est particulièrement utile lorsque la durée du mouvement n’est pas recherchée. Chaque travail garde son signe ; on ne transforme pas un frottement en travail positif.
`),
  section("pc-inertia-method", "V", "Construire une étude mécanique", [198], String.raw`
1. **Définir le système** : objet, air dans un ballon, eau dans un récipient… On précise ce qui appartient au système et ce qui est extérieur.
2. **Choisir le référentiel**, supposé galiléen dans le modèle étudié.
3. **Faire le bilan des actions extérieures** et représenter leurs forces.
4. **Choisir la relation adaptée** : centre d’inertie pour l’accélération et les équations horaires ; énergie cinétique pour une relation entre vitesses et déplacements.
5. **Projeter et calculer**, dans un repère cartésien pour une translation ou dans la base de Frenet pour une trajectoire courbe. Vérifier les unités et le signe du résultat.

| Type d’action | Exemples |
|---|---|
| À distance | Gravitation, interaction électrique, interaction magnétique |
| Contact réparti | Réaction d’un support, frottement, pression, poussée d’Archimède |
| Contact modélisé en un point | Tension d’un fil, action d’un ressort, action locale d’un autre objet |
`),
], [
  "Cours196–198 uniquement ; les exercices corrigés199 et suivants restent hors de cette fiche.",
  "Puissance instantanée : facteur cos de l’angle rétabli. Distinguer réaction normale et réaction totale avec frottement ; pas de force centrifuge réelle ajoutée.",
  "TEC avec Ec=mvG²/2 borné au point matériel/solide en translation ; hypothèse masse constante explicitée pour Newton.",
]);
