import { cd, section, sheet } from "./types";
import { reflexSections } from "./reflexes";
import { synapseSections } from "./synapses";

const anatomy = section("svt-nerve-organization", "Du système nerveux au neurone", [507,508], String.raw`
Le **système nerveux central** réunit l’encéphale et la moelle épinière ; les nerfs constituent une grande partie du système nerveux périphérique. L’encéphale comprend notamment le cerveau, le cervelet et le tronc cérébral, dont le bulbe rachidien.

Dans la moelle épinière, la **substance grise**, centrale, contient notamment les corps cellulaires et des connexions ; la **substance blanche**, périphérique, contient surtout des faisceaux d’axones. La moelle est un centre de nombreux réflexes et une voie de passage des messages sensitifs et moteurs. La commande volontaire implique également l’encéphale.

Un **nerf** rassemble des faisceaux de fibres nerveuses, avec des enveloppes conjonctives et des vaisseaux. Une fibre nerveuse est un axone accompagné, selon le cas, de ses gaines ; ce n’est pas un neurone entier.

| Partie du neurone | Caractéristiques |
|---|---|
| Corps cellulaire, ou soma | Noyau et organites ; entretient la cellule et participe à l’intégration |
| Dendrites | Prolongements généralement courts et ramifiés recevant des informations |
| Axone | Prolongement conduisant les potentiels d’action vers les terminaisons |
| Myéline et nœuds de Ranvier | Gaine isolante discontinue, présente sur certains axones |
| Arborisation terminale | Terminaisons établissant des synapses avec d’autres cellules |

Le neurone est une unité structurale et fonctionnelle essentielle du système nerveux, qui comporte aussi des cellules gliales. Il dépend fortement de son approvisionnement énergétique et peut être lésé par une interruption d’oxygénation. Sa réparation est limitée et dépend du contexte ; on ne fixe pas un délai universel de destruction à trois minutes.
`, "neuron");

const recording = section("svt-nerve-recording", "Enregistrer une différence de potentiel", [508,509], String.raw`
Le dispositif expérimental comprend un **stimulateur**, une préparation nerveuse maintenue dans un milieu physiologique, des électrodes de stimulation, des électrodes de réception, un amplificateur et un oscilloscope.

Le stimulateur règle l’intensité, la durée et la fréquence des stimulations. L’oscilloscope représente une tension en fonction du temps : l’axe horizontal correspond au temps ; l’axe vertical à la différence de potentiel mesurée. L’amplificateur rend perceptibles les très faibles tensions biologiques.

- Deux électrodes à la surface d’une fibre au repos donnent une différence proche de **0 mV** : les deux points ont sensiblement le même potentiel. Cela ne signifie pas que le potentiel transmembranaire est nul.
- Si une électrode est dans l’axone et l’autre à l’extérieur, on mesure le **potentiel de membrane**, par convention :

$$V_m=V_{\mathrm{int}}-V_{\mathrm{ext}}.$$

Au repos, il est souvent voisin de **−70 mV** dans l’exemple étudié. L’intérieur est donc négatif **par rapport à l’extérieur**, au voisinage de la membrane. Les deux milieux restent globalement presque électroneutres.
`);

const resting = section("svt-nerve-resting", "Pourquoi la membrane est-elle polarisée ?", [510], String.raw`
La répartition des ions et la perméabilité sélective de la membrane expliquent le potentiel de repos. Voici les concentrations de l’exemple d’axone marin étudié, en $\mathrm{mmol\,L^{-1}}$ ; elles ne représentent pas des valeurs normales du sang humain.

| Milieu | $\mathrm{Na^+}$ | $\mathrm{K^+}$ | $\mathrm{Cl^-}$ |
|---|---|---|---|
| Intracellulaire | 49 | 410 | 40 |
| Extracellulaire | 440 | 22 | 560 |

Le potassium est plus concentré **à l’intérieur** ; le sodium et le chlorure le sont davantage à l’extérieur. Les ions traversent des canaux selon leur **gradient électrochimique**, qui tient compte à la fois de la concentration et de la tension électrique.

Les canaux de fuite, notamment potassiques, contribuent au potentiel de repos. La **pompe sodium-potassium**, ou Na⁺/K⁺-ATPase, entretient les gradients : pour un cycle consommant de l’ATP, elle fait sortir **3 Na⁺** et entrer **2 K⁺**, contre leurs gradients.

**À distinguer :** les canaux permettent des flux passifs ; la pompe réalise un transport actif. La pompe entretient les conditions du fonctionnement électrique, mais n’est pas le mécanisme rapide qui produit chaque repolarisation.
`);

const action = section("svt-nerve-action-potential", "Comprendre un potentiel d’action", [511,512,513], String.raw`
Une stimulation efficace peut déclencher une variation brève du potentiel de membrane : le **potentiel d’action**, ou PA.

| Phase | Variation électrique | Mécanisme principal dans l’axone étudié |
|---|---|---|
| Repos | Potentiel négatif stable | Perméabilités de repos et gradients ioniques entretenus |
| Dépolarisation | Le potentiel devient moins négatif puis peut devenir positif | Ouverture rapide de canaux Na⁺ voltage-dépendants et entrée de Na⁺ |
| Repolarisation | Retour vers des valeurs négatives | Inactivation des canaux Na⁺ et augmentation de la sortie de K⁺ |
| Hyperpolarisation transitoire | Potentiel plus négatif qu’au repos | Fermeture retardée de certains canaux K⁺ |
| Retour au repos | Récupération des perméabilités de repos | Fermeture des canaux activés ; gradients entretenus dans la durée |

L’**artefact de stimulation** indique l’instant de la stimulation ; ce n’est pas un PA. La latence mesurée avant le signal peut comprendre un temps de conduction.

**Le tracé dépend du montage :**

- Deux électrodes extracellulaires rencontrées successivement par l’onde peuvent donner un signal **diphasique** : on compare leurs potentiels à deux moments successifs.
- Un montage à une zone active et une référence non active donne un signal extracellulaire **monophasique**.
- Une électrode intracellulaire avec une référence extérieure suit directement le potentiel transmembranaire, y compris sa valeur de repos.

Un tracé diphasique n’indique donc pas que la fibre émet deux PA successifs. Les signes du tracé dépendent aussi du branchement des électrodes.
`, "action-potential");

const excitability = section("svt-nerve-excitability", "Seuil, tout ou rien et recrutement", [513,514,515], String.raw`
L’**excitabilité** est l’aptitude à répondre à une stimulation. Elle dépend de l’intensité, de la durée d’application, de l’intervalle entre les stimulations et de l’état de la préparation.

| Préparation | Quand l’intensité augmente |
|---|---|
| Fibre isolée | Pas de PA sous le seuil ; au-delà, PA d’amplitude sensiblement constante : **loi du tout ou rien** |
| Nerf entier | De plus en plus de fibres sont recrutées ; le potentiel global augmente, puis atteint un maximum |

L’intensité d’une information peut être codée par la **fréquence des PA** et le nombre de fibres recrutées, pas par une augmentation indéfinie de l’amplitude d’un PA isolé.

- **Rhéobase :** intensité minimale efficace pour une stimulation suffisamment longue.
- **Temps utile :** durée minimale efficace pour une stimulation rhéobasique dans le protocole étudié.
- **Chronaxie :** durée minimale efficace pour une intensité égale à **deux fois la rhéobase**.

Une faible chronaxie traduit, dans des conditions comparables, une grande excitabilité.

Après un PA, la **période réfractaire absolue** empêche le déclenchement d’un second PA, principalement parce que les canaux Na⁺ sont inactivés. Pendant la **période réfractaire relative**, une stimulation plus forte peut être nécessaire. Il ne faut pas l’expliquer par l’attente d’un rétablissement complet des concentrations par la pompe.
`, "recruitment");

const conduction = section("svt-nerve-conduction", "Propager le message et mesurer sa vitesse", [515,516,517], String.raw`
La **conductibilité** est l’aptitude à propager le message nerveux.

- Dans un axone **amyélinisé**, les courants locaux dépolarisent successivement les régions voisines : conduction continue.
- Dans un axone **myélinisé**, la myéline limite les pertes et le PA se régénère aux **nœuds de Ranvier** : conduction saltatoire, généralement plus rapide.

Une stimulation au milieu d’un axone isolé peut provoquer une propagation dans les deux directions. Dans un circuit physiologique, l’organisation du neurone, la zone de déclenchement et le sens des synapses déterminent le trajet fonctionnel. Les messages sensitifs peuvent aller de la périphérie vers les centres : tous les messages ne vont pas « du corps cellulaire vers le muscle ».

Pour comparer deux enregistrements du même trajet :

$$v=\frac{\Delta d}{\Delta t}=\frac{d_2-d_1}{t_2-t_1}.$$

On convertit les distances en mètres et les durées en secondes pour obtenir $v$ en $\mathrm{m\,s^{-1}}$. Le décalage des signaux se mesure par rapport au même repère de stimulation.

À température comparable, un plus grand diamètre conduit généralement plus vite ; la myéline augmente fortement la vitesse. La température influence aussi les échanges et les réactions, dans les limites compatibles avec la vie de la préparation.

| Préparation expérimentale | Diamètre | Température | Vitesse |
|---|---|---|---|
| Fibre myélinisée de grenouille | 10µm | 20°C | 17m/s |
| Fibre myélinisée de grenouille | 20µm | 20°C | 30m/s |
| Fibre myélinisée de grenouille | 20µm | 30°C | 80m/s |
| Axone géant amyélinisé de calmar | 1000µm | 23°C | 35m/s |

Le refroidissement important, certains anesthésiques ou une lésion peuvent diminuer ou bloquer le signal. L’effet dépend de la substance, de sa concentration et des conditions ; ce ne sont pas des essais à reproduire sur soi.
`);

export default sheet("nervous-communication", "Communication et tissu nerveux", cd, [anatomy,recording,resting,action,excitability,conduction,...synapseSections,...reflexSections], [
  "Cours505–520 vérifiés à l’image ; exercices538 et suivants exclus. Rubriques communes partagées par référence entre cartes.",
  "Moelle : centre réflexe et relais des commandes volontaires ; nerf ≠ neurone entier.",
  "Potentiel transmembranaire et signal extracellulaire distingués ; gradients électrochimiques, 3Na sortent/2K entrent ; réfractarité liée aux canaux, non à la pompe.",
  "Pas de délai universel de mort neuronale ; synapses électriques et chimiques établies, pas deux hypothèses concurrentes.",
  "La ligne mammifère12m/s du tableau517 contredit le commentaire : elle n’est pas transformée en une nouvelle donnée prétendument mesurée ; quatre autres mesures conservées.",
  "Vérification : https://openstax.org/books/anatomy-and-physiology/pages/12-4-the-action-potential",
]);
