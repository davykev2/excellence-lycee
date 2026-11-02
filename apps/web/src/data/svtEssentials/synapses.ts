import { c, section, sheet } from "./types";

export const synapseSections = [
  section("svt-nerve-synapses", "Transmettre l’information à une autre cellule", [517,518,519], String.raw`
Une **synapse** est une jonction fonctionnelle entre un neurone et une autre cellule : synapse neuro-neuronique, neuromusculaire ou neuroglandulaire. Les contacts neuro-neuroniques peuvent être axo-dendritiques, axo-somatiques ou axo-axoniques.

Les **synapses électriques** font passer directement des courants par des jonctions communicantes. Les **synapses chimiques** utilisent un neurotransmetteur à travers une fente de quelques dizaines de nanomètres.

**Dans une synapse chimique :**

1. Un PA arrive à la terminaison présynaptique.
2. L’ouverture de canaux Ca²⁺ fait entrer du calcium.
3. Des vésicules fusionnent avec la membrane : **exocytose** du neurotransmetteur.
4. Le neurotransmetteur diffuse et se fixe à des récepteurs postsynaptiques.
5. Les propriétés électriques de la membrane postsynaptique changent.
6. Le neurotransmetteur est éliminé par dégradation, recapture ou diffusion, selon sa nature.

Le délai synaptique est de l’ordre de **0,5ms** dans l’exemple. La transmission chimique est normalement orientée du côté qui libère le neurotransmetteur vers celui qui porte les récepteurs correspondants.

À la plaque motrice, l’**acétylcholine** active des récepteurs provoquant une dépolarisation. L’acétylcholinestérase l’hydrolyse en **choline et acétate**, ce qui limite son action. La choline peut être recaptée.
`, "synapse"),
  section("svt-nerve-integration", "PPSE, PPSI et intégration", [519,520], String.raw`
Un potentiel postsynaptique est une variation locale et graduée, à distinguer d’un PA.

| Message postsynaptique | Conséquence habituelle |
|---|---|
| **PPSE**, excitateur | Rapproche la membrane du seuil de déclenchement |
| **PPSI**, inhibiteur | Éloigne du seuil ou limite l’effet des messages excitateurs |

L’inhibition peut notamment mettre en jeu une entrée de Cl⁻ ou une sortie de K⁺. Le **GABA** est un neurotransmetteur inhibiteur important du système nerveux central adulte. L’effet d’un neurotransmetteur dépend de son récepteur et des gradients : il ne se déduit pas de son nom seul.

- **Sommation temporelle :** des messages rapprochés arrivent par une même connexion.
- **Sommation spatiale :** des messages arrivent par plusieurs connexions.

L’intégration combine les influences excitatrices et inhibitrices. Si la dépolarisation au segment initial de l’axone atteint le seuil, un train de PA est déclenché. Un PPSE isolé ne déclenche donc pas nécessairement un PA.
`),
];
const substances = section("svt-nerve-substances", "Comment une substance peut-elle modifier un message ?", [520], String.raw`
Une substance peut agir sur la synthèse, la libération, la réception ou l’élimination d’un neurotransmetteur, ou directement sur des canaux ioniques.

| Cible | Exemple et conséquence |
|---|---|
| Libération et disponibilité des monoamines | Certaines amphétamines augmentent leur présence et perturbent la transmission |
| Récepteurs opioïdes | La morphine est un agoniste de récepteurs normalement activés par des peptides endogènes, dont les endorphines |
| Récepteurs nicotiniques de l’acétylcholine | Des curares les bloquent à la plaque motrice : la commande peut ne plus provoquer la contraction |
| Acétylcholinestérase | L’ésérine et la néostigmine, appelée aussi prostigmine, prolongent l’action de l’acétylcholine |
| Canaux K⁺ | Le tétraéthylammonium, ou TEA, bloque certains canaux potassiques |
| Canaux Na⁺ | La tétrodotoxine bloque certains canaux sodiques voltage-dépendants : le PA peut être empêché |

**Pour raisonner :** identifier la cible, préciser ce qui augmente ou diminue, puis relier cette modification au signal et à l’effet sur l’organe. « Plus de neurotransmetteur » ne signifie pas toujours « plus de contraction » : l’effet dépend du récepteur et du circuit.

Une perturbation de la dopamine participe à la maladie de Parkinson, mais elle est notamment liée à la dégénérescence de neurones dopaminergiques : ce n’est pas simplement un manque alimentaire ou une absence d’enzyme. Le GABA est un médiateur naturel, pas une drogue par définition.
`);
export default sheet("drugs", "Substances et transmission nerveuse", c, [...synapseSections,substances], [
  "Pages517–520 seulement : mécanisme synaptique nécessaire à l’explication des substances ; pas d’exercice importé.",
  "L’acétylcholine donne choline/acétate ; effets dépendant du récepteur ; Parkinson non réduit à un déficit enzymatique ; pas de posologie ou procédure d’usage.",
]);
