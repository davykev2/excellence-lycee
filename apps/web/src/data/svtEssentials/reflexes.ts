import { d, section, sheet } from "./types";

export const reflexSections = [
  section("svt-reflex-innate", "Un réflexe : du stimulus à la réponse", [505], String.raw`
Un **réflexe inné** est une réponse automatique à une stimulation déterminée, sans apprentissage préalable. Il est rapide, involontaire et relativement stéréotypé : à conditions comparables, un même stimulus produit une réponse comparable. Son expression peut néanmoins être modulée par les centres nerveux.

Le trajet fonctionnel forme un **arc réflexe** :

| Élément | Rôle |
|---|---|
| Récepteur sensoriel | Détecte le stimulus et le convertit en message nerveux |
| Voie sensitive, ou afférente | Conduit le message vers le centre nerveux |
| Centre nerveux | Intègre l’information et élabore la commande |
| Voie motrice, ou efférente | Conduit la commande jusqu’à l’effecteur |
| Effecteur : muscle ou glande | Produit la réponse |

Ainsi, **afférent = vers le centre** ; **efférent = en sortant**. Le récepteur ne reçoit pas nécessairement un message nerveux : il reçoit d’abord une stimulation, par exemple lumineuse, mécanique ou chimique.
`, "reflex"),
  section("svt-reflex-learning", "Acquérir et entretenir un réflexe conditionnel", [505,506], String.raw`
Un **réflexe conditionnel**, ou conditionné, est une réponse acquise par apprentissage. Un stimulus initialement neutre devient capable de déclencher une réponse après avoir été associé, de façon répétée, à un stimulus qui la provoquait naturellement.

**Exemple classique :**

1. La nourriture, stimulus inconditionnel, provoque naturellement la salivation.
2. Un son présenté seul ne provoque pas initialement cette salivation.
3. On fait précéder la nourriture par ce son, au cours de plusieurs associations.
4. Le son seul peut ensuite provoquer la salivation : il est devenu le stimulus conditionnel.

L’apprentissage suppose des voies sensorielles et des centres nerveux fonctionnels, ainsi qu’un état de vigilance adapté. Dans le protocole classique, le signal neutre **précède de peu** le stimulus inconditionnel. Le renforcement entretient l’association.

Si l’on présente plusieurs fois le signal sans le renforcement attendu, la réponse diminue : c’est **l’extinction**. Elle ne correspond pas forcément à l’effacement définitif de l’apprentissage.

Le schéma scolaire d’une « nouvelle liaison » entre centres sensoriels traduit une **modification fonctionnelle des connexions nerveuses**, et non l’apparition obligatoire d’un nouveau nerf.
`),
];
export default sheet("conditioned-reflex", "Le réflexe conditionnel", d, reflexSections, [
  "Cours505–506 vérifié à l’image ; schémas fonctionnels reconstruits, sans scan ni exercice.",
  "Réflexe inné modulable, apprentissage fonctionnel non réduit à l’apparition d’un nouveau nerf ; extinction distincte d’un effacement définitif.",
]);
