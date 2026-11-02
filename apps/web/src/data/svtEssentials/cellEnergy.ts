import { c, section, sheet } from "./types";

export const energySections = [
  section("svt-energy-atp", "L’ATP est utilisée et régénérée en permanence", [531], String.raw`
La cellule musculaire convertit l’énergie chimique en travail mécanique et en chaleur. La molécule immédiatement utilisée pour de nombreux couplages énergétiques est l’**ATP**, adénosine triphosphate.

$$\mathrm{ATP+H_2O\longrightarrow ADP+P_i}+\text{énergie utilisable}.$$

$P_i$ représente le phosphate inorganique. Cette hydrolyse peut être couplée à l’activité des têtes de myosine, aux pompes à calcium ou à d’autres transports actifs.

Le stock cellulaire d’ATP est faible, de l’ordre de **quelques micromoles par gramme** de muscle. S’il reste relativement stable pendant un effort, cela ne veut pas dire que le muscle n’en consomme pas : **la synthèse compense la consommation**.

Les voies énergétiques fonctionnent simultanément, avec des contributions variables selon l’intensité et la durée de l’effort. Les réactions rapides commencent dès le besoin énergétique ; elles n’attendent pas nécessairement trente secondes.
`),
  section("svt-energy-fast", "Deux réactions rapides de phosphorylation", [531,532], String.raw`
La **phosphocréatine** est une réserve rapidement mobilisable de groupements phosphate. La créatine kinase catalyse :

$$\mathrm{phosphocreatine+ADP\rightleftharpoons creatine+ATP}.$$

L’adénylate kinase, également appelée **myokinase**, catalyse :

$$\mathrm{2\,ADP\rightleftharpoons ATP+AMP}.$$

Ces réactions ne consomment pas directement d’oxygène. Elles apportent rapidement de l’ATP, mais les réserves disponibles sont limitées. Après l’effort, la phosphocréatine est reconstituée grâce à de l’ATP fourni notamment par le métabolisme aérobie.

Dans l’expérience comparant trois muscles, les quantités suivantes sont mesurées en **mg par gramme de muscle** :

| Molécule | Avant contraction, pour les trois muscles | Après : muscle 1, contraction maintenue | Après : muscle 2, contraction maintenue | Après : muscle 3, arrêt |
|---|---|---|---|---|
| ATP | 2 | 2 | 2 | 0 |
| Phosphocréatine | 1,5 | 1,5 | 0,4 | 1,5 |
| Glycogène | 1,62 | 0,9 | 1,62 | 1,62 |
| Lactate | 1 | 1,30 | 1 | 1 |

**Lecture :** le muscle 2 maintient son ATP en utilisant sa phosphocréatine ; le muscle 1 mobilise le glycogène avec augmentation du lactate ; le muscle 3 s’arrête lorsque l’ATP disponible n’est plus maintenue. On distingue ainsi plusieurs voies de régénération.
`),
  section("svt-energy-glycolysis", "Glycolyse et fermentation lactique", [532], String.raw`
La **glycolyse** se déroule dans le cytosol, ou hyaloplasme. Une molécule de glucose à six carbones donne deux molécules de pyruvate à trois carbones. Son bilan net, à partir d’un glucose libre, est de **2 ATP**, avec formation de transporteurs réduits.

Lorsque l’oxydation mitochondriale ne couvre pas les besoins, la réduction du pyruvate en **lactate** régénère le NAD⁺ indispensable à la poursuite de la glycolyse :

$$\mathrm{pyruvate+NADH+H^+\longrightarrow lactate+NAD^+}.$$

Le passage pyruvate → lactate ne fabrique pas lui-même d’ATP supplémentaire ; **l’ensemble glycolyse–fermentation fournit les 2 ATP nets de la glycolyse**.

Un bilan simplifié met donc en relation un glucose et deux lactates. Les étapes du métabolisme contribuent aux variations de pH, mais la fatigue musculaire et les crampes ne se résument pas à « de l’acide lactique qui empoisonne le muscle ». Elles font intervenir plusieurs mécanismes.
`),
  section("svt-energy-respiration", "Respiration et organisation de la mitochondrie", [532,533], String.raw`
En conditions aérobies, le pyruvate est oxydé dans la mitochondrie. La transformation en acétyl-CoA, le **cycle de Krebs** et la chaîne respiratoire permettent une production importante d’ATP.

Le bilan matériel global de l’oxydation complète du glucose est :

$$\mathrm{C_6H_{12}O_6+6\,O_2\longrightarrow6\,CO_2+6\,H_2O}.$$

L’énergie libérée est en partie transférée à l’ATP et en partie dissipée en chaleur. Un bilan scolaire conventionnel peut retenir **36 ATP par glucose** ; le rendement réel dépend des navettes, des couplages et des conditions, et se situe couramment autour d’une trentaine. Ce nombre n’est donc pas une constante universelle.

| Compartiment | Rôle |
|---|---|
| Cytosol | Glycolyse |
| Matrice mitochondriale | Transformation du pyruvate et cycle de Krebs |
| Membrane interne et crêtes | Chaîne respiratoire et ATP synthase |
| Espace intermembranaire | Accumulation de protons participant au couplage énergétique |
| Membrane externe | Délimite l’organite |

Les crêtes sont des **replis de la membrane interne vers la matrice**. L’oxygène est l’accepteur final des électrons de la chaîne respiratoire. La respiration régénère beaucoup plus d’ATP par glucose que la seule glycolyse fermentaire.
`, "energy-pathways"),
];
export default sheet("cell-energy", "La production d’énergie par la cellule", c, energySections, [
  "Cours531–533 et tableau20 lus visuellement ; aucun exercice538–560 ajouté.",
  "Unité mol/g impossible remplacée par l’ordre de grandeur micromolaire ; les données expérimentales enmg/g du tableau20 sont conservées.",
  "Réactions rapides sans délai obligatoire30s ; ATP régénérée pendant l’effort ; glycolyse cytosolique et fermentation régénérantNAD+ distinguées.",
  "Respiration équilibrée avec6O2 ;36ATP identifié comme bilan conventionnel nonuniversel ; fatigue/crampes non attribuées au lactate seul ; crêtes vers la matrice.",
  "Vérification : https://openstax.org/books/anatomy-and-physiology-2e/pages/10-3-muscle-fiber-contraction-and-relaxation",
]);
