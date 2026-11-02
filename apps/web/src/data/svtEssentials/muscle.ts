import { cd, section, sheet } from "./types";
import { energySections } from "./cellEnergy";

const properties = section("svt-muscle-properties", "Propriétés du muscle et types de contraction", [521,522], String.raw`
Le muscle strié squelettique présente trois propriétés principales :

- **Excitabilité :** il réagit à une stimulation efficace.
- **Contractilité :** il développe une force active, avec ou sans raccourcissement.
- **Élasticité :** après une déformation compatible avec son intégrité, il tend à retrouver sa longueur.

Le **myographe** enregistre la réponse mécanique sous forme de **myogramme**. Un stimulateur applique l’excitation ; un dispositif relié au muscle inscrit la déformation ou la force ; un repère de temps permet de mesurer les durées.

| Contraction | Ce qui est maintenu approximativement | Ce que l’on observe |
|---|---|---|
| Isotonique | La charge, donc la tension dans le modèle simple | La longueur varie |
| Isométrique | La longueur du muscle | La force peut augmenter sans raccourcissement global |

La forme du tracé dépend du montage. Il ne faut pas décider du type de contraction uniquement parce qu’une courbe est « lisse » ou « ondulée ».
`);
const twitch = section("svt-muscle-myogram", "Lire une secousse et comprendre la sommation", [522,523,524,525,526], String.raw`
Une stimulation unique efficace provoque une **secousse musculaire isolée** :

1. **Latence :** intervalle entre stimulation et début de la réponse mécanique. Il comprend le délai d’activation et, en stimulation indirecte, la conduction nerveuse.
2. **Contraction :** la force augmente et le muscle peut se raccourcir selon le montage.
3. **Relâchement :** la force diminue et le muscle retrouve progressivement son état initial.

| Deux stimulations efficaces de même intensité | Résultat |
|---|---|
| Très espacées | Deux secousses séparées |
| Deuxième pendant le relâchement | Sommation avec fusion partielle |
| Deuxième plus rapprochée, après la réfractarité | Fusion plus importante des réponses mécaniques |

À fréquence suffisante, un train de stimulations produit un **tétanos imparfait** avec oscillations, ou **parfait** avec fusion complète et plateau relativement régulier. Ces termes désignent ici un enregistrement physiologique, pas la maladie infectieuse du tétanos.

**Deux sommations à distinguer :** augmenter l’intensité peut recruter davantage d’unités motrices ; rapprocher des stimulations de même intensité additionne surtout leurs effets mécaniques dans le temps. Cela ne prouve pas à lui seul un recrutement de nouvelles fibres.

Une fibre isolée suit le tout ou rien pour son PA ; un muscle entier présente un recrutement progressif. La fatigue peut diminuer l’amplitude, retarder la réponse et ralentir le relâchement. Les durées et les fréquences, dont l’exemple de10à15stimulations/s du protocole, dépendent du muscle et des conditions.
`, "muscle-twitch");
const manifestations = section("svt-muscle-manifestations", "Phénomènes électriques, chimiques et thermiques", [526,527,528,529,530], String.raw`
L’activité du muscle associe plusieurs phénomènes. L’enregistrement électrique et le myogramme montrent l’ordre :

$$\text{PA musculaire}\ \longrightarrow\ \text{libération de Ca}^{2+}\ \longrightarrow\ \text{réponse mécanique}.$$

Le PA de la fibre, de potentiel de repos voisin de **−80 à−85mV** dans l’exemple, précède la contraction. Quand les secousses mécaniques fusionnent, les PA restent distincts. Le calcium vient principalement du **réticulum sarcoplasmique**.

Un **thermocouple** compare la température du muscle à une référence. La chaleur initiale accompagne activation, contraction et relâchement ; une chaleur retardée accompagne la récupération, notamment les processus oxydatifs. La contraction ne transforme pas toute l’énergie chimique en travail utile.

Voici les données du protocole comparant repos et activité :

| Grandeur mesurée | Repos | Activité |
|---|---|---|
| O₂ consommé | 0,307L | 5,207L |
| Sang traversant le muscle | 12,2L | 56,3L |
| CO₂ rejeté | 0,220L | 5,950L |
| Glucose utilisé | 0,307g | 8,432g |
| Protides utilisés dans ce protocole | 0 | 0 |
| Lipides mesurés | 1,830g | 0,755g |
| Glycogène mesuré | 13,1g | 4,7g |
| Lactate mesuré | 1g | 1,30g |
| ATP | 4à6mmol/kg | 4à6mmol/kg |

Ces données ne sont pas des normes par minute ou pour tout muscle : on compare les conditions de l’expérience. Elles montrent une mobilisation des réserves et une régénération d’ATP. Le glycogène est stocké **dans les cellules**, pas dans le sang. Les protéines peuvent contribuer au métabolisme dans d’autres situations : la valeur0 de ce protocole n’est pas une impossibilité biologique.

Les variations de pH reflètent l’équilibre des réactions et des tampons ; l’hydrolyse de l’ATP ne doit pas être assimilée à la libération simple d’une molécule d’acide phosphorique libre.
`);
const structure = section("svt-muscle-structure", "Du muscle au sarcomère", [534,535], String.raw`
Le muscle contient des **faisceaux de fibres musculaires**, séparés par du tissu conjonctif parcouru de nerfs et de vaisseaux. Une fibre musculaire striée est une cellule allongée contenant plusieurs noyaux et de nombreuses **myofibrilles**.

Sa membrane est le **sarcolemme** ; son cytoplasme, le **sarcoplasme**. Les mitochondries fournissent une part importante de l’ATP ; le réticulum sarcoplasmique stocke et libère le calcium.

Une myofibrille est une succession de **sarcomères**, chacun limité par deux striesZ :

| Région | Contenu principal |
|---|---|
| BandeI, claire | Filaments fins d’actine, sans filaments épais |
| BandeA, sombre | Toute la longueur des filaments épais de myosine, avec chevauchement d’actine dans une partie |
| ZoneH, au centre deA | Filaments épais seuls |
| StriesZ | Limites du sarcomère et ancrage des filaments fins |

Les filaments fins comportent actine, tropomyosine et troponine. Les filaments épais sont constitués de myosine dont les têtes peuvent se lier à l’actine et hydrolyser l’ATP.
`, "sarcomere");
const mechanism = section("svt-muscle-crossbridges", "Glissement des filaments et cycle des ponts", [535,536,537], String.raw`
Pendant le raccourcissement, les striesZ se rapprochent ; les bandesI et la zoneH diminuent. La **bandeA reste de longueur constante** : les filaments ne raccourcissent pas, ils glissent les uns par rapport aux autres.

**Le cycle moléculaire :**

1. Le Ca²⁺ se fixe sur la **troponine** ; la tropomyosine se déplace et expose des sites de liaison de l’actine.
2. Une tête de myosine préparée, portant ADP et phosphate, s’attache à l’actine : pont actomyosine.
3. La libération du phosphate accompagne le pivotement de la tête et le déplacement du filament fin ; l’ADP est ensuite libérée.
4. La **fixation d’un nouvel ATP provoque le détachement** de la tête.
5. L’hydrolyse de cet ATP remet la tête dans une configuration prête pour un nouveau cycle.

La répétition dépend de la présence de calcium, d’ATP et de sites accessibles. **Sans ATP, les ponts ne se détachent pas normalement.** Pour le relâchement, le calcium est repompé dans le réticulum par un transport utilisant aussi de l’ATP ; les sites redeviennent masqués.

À retenir : **Ca²⁺ autorise l’interaction ; ATP permet le cycle et la récupération ; actine et myosine réalisent le glissement.**
`);
export default sheet("muscle", "Fonctionnement et énergie du muscle strié", cd, [properties,twitch,manifestations,structure,mechanism,...energySections], [
  "Cours521–537 vérifié intégralement à l’image ; le bloc531–533 est strictement partagé avec la fiche de production d’énergie C.",
  "Contractions isométrique/isotonique distinguées par longueur/tension ; sommation temporelle non confondue avec recrutement spatial.",
  "BandeA constante, filaments non raccourcis ; détachement par fixationATP et non libérationPi ; Ca2+→troponine, recapture active pour relâchement.",
  "Respiration avec6O2 ; glycogène cellulaire, ATPdonnée4–6mmol/kg ; fatigue multifactorielle, pas d’interprétationH3PO4 libre imposée.",
  "Vérification : https://openstax.org/books/anatomy-and-physiology-2e/pages/10-3-muscle-fiber-contraction-and-relaxation",
]);
