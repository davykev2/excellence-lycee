import { d, section, sheet } from "./types";

export default sheet("heart", "Le fonctionnement du cœur", d, [
  section("svt-heart-circulation", "Une pompe à deux circuits", [575,576], String.raw`
Chez les mammifères, le cœur possède **deux oreillettes et deux ventricules**. Les côtés droit et gauche sont séparés : le sang circule successivement dans les poumons puis dans les organes.

**Organes → veines caves → oreillette droite → ventricule droit → artères pulmonaires → poumons → veines pulmonaires → oreillette gauche → ventricule gauche → aorte → organes.**

Les valves imposent un sens au déplacement du sang. Elles s’ouvrent ou se ferment selon les différences de pression ; elles ne propulsent pas activement le sang.

| Circuit | Trajet simplifié | Fonction |
| --- | --- | --- |
| Pulmonaire | Cœur droit → poumons → cœur gauche | Échanges gazeux |
| Systémique | Cœur gauche → organes → cœur droit | Distribution et récupération |

Le cœur de grenouille utilisé dans certaines expériences possède deux oreillettes mais un seul ventricule : on ne transpose pas son anatomie telle quelle au cœur humain.`, "heart-circuit"),
  section("svt-heart-automaticity", "L’automatisme cardiaque", [576,577,578], String.raw`
Un cœur isolé peut continuer à battre pendant un temps si les conditions nécessaires à sa survie sont maintenues. **L’origine du rythme est donc cardiaque** ; les nerfs modulent ce rythme, ils ne déclenchent pas obligatoirement chaque battement.

Les expériences de ligatures et de séparation des régions cardiaques localisent des tissus capables d’activité rythmique. Chez les mammifères, le tissu nodal organise normalement la séquence :

**Nœud sinusal → oreillettes → nœud atrioventriculaire → faisceau de His → branches → réseau de Purkinje → ventricules.**

Le ralentissement de la conduction dans la région atrioventriculaire laisse aux oreillettes le temps de participer au remplissage ventriculaire. Le réseau de conduction distribue ensuite rapidement l’excitation dans les ventricules.

Les cellules pacemakers se dépolarisent spontanément entre deux potentiels d’action. Leur activité diffère de celle d’une fibre musculaire squelettique ou d’un neurone.`),
  section("svt-heart-electrical", "Du potentiel d’action à l’ECG", [578,579,580], String.raw`
Dans une cellule musculaire ventriculaire, le potentiel d’action comporte une dépolarisation rapide, un **plateau** auquel participent les courants calciques et potassiques, puis une repolarisation. Les mécanismes ioniques des cellules nodales ne sont pas identiques à ceux des cellules ventriculaires.

La période réfractaire relativement longue limite la sommation des contractions : le cœur ne réalise pas un tétanos comparable à celui d’un muscle squelettique.

L’**électrocardiogramme** enregistre depuis la surface du corps les variations électriques globales associées à l’activité cardiaque.

| Onde | Événement électrique principal |
| --- | --- |
| P | Dépolarisation des oreillettes |
| QRS | Dépolarisation des ventricules ; la repolarisation atriale est habituellement masquée |
| T | Repolarisation des ventricules |

**Électricité puis mécanique :** une onde d’ECG n’est pas directement une contraction. La dépolarisation précède la contraction du territoire concerné.

Une stimulation peut provoquer une extrasystole lorsqu’elle atteint le tissu hors de sa période réfractaire. Une extrasystole ventriculaire peut être suivie d’une pause compensatrice ; ce n’est pas une règle applicable à toutes les perturbations du rythme.`),
  section("svt-cardiac-cycle", "Les phases de la révolution cardiaque", [580,581], String.raw`
Une révolution cardiaque correspond à un cycle de remplissage et d’éjection. **Systole = contraction ; diastole = relâchement.**

| Phase | Mécanisme essentiel |
| --- | --- |
| Remplissage ventriculaire | Ventricules relâchés ; valves atrioventriculaires ouvertes |
| Systole atriale | Les oreillettes complètent le remplissage |
| Début de systole ventriculaire | Pression ventriculaire en hausse ; fermeture des valves atrioventriculaires |
| Éjection | Pression ventriculaire supérieure à celle des artères ; ouverture des valves aortique et pulmonaire |
| Début de diastole ventriculaire | Fermeture des valves artérielles, puis reprise du remplissage |

Le **premier bruit**, B1, accompagne la fermeture des valves atrioventriculaires au début de la systole ventriculaire. Le **deuxième bruit**, B2, accompagne la fermeture des valves aortique et pulmonaire en fin de systole ventriculaire.

$$\text{Débit cardiaque}=\text{fréquence cardiaque}\times\text{volume d’éjection systolique}.$$

Par exemple, $70\ \text{battements/min}\times70\ \text{mL/battement}=4{,}9\ \text{L/min}$. La fréquence et le volume éjecté peuvent tous deux varier selon les besoins.`, "cardiac-cycle"),
  section("svt-heart-nervous-control", "La modulation nerveuse", [581,582,583], String.raw`
L’innervation végétative adapte l’activité de la pompe :

| Voie efférente | Médiateur principal au cœur | Effet habituel |
| --- | --- | --- |
| Parasympathique, notamment nerf vague | Acétylcholine | Ralentissement de la fréquence et de la conduction nodale |
| Sympathique | Noradrénaline | Augmentation de la fréquence, de la conduction et de la force de contraction |

L’expérience historique des deux cœurs de Loewi montre qu’une stimulation nerveuse peut libérer une substance diffusible qui modifie le rythme du second cœur. Elle soutient une transmission chimique, et non une action à distance du nerf sur les deux cœurs.

L’effet dépend du récepteur et du tissu. Il ne faut pas présenter l’acétylcholine comme inhibitrice dans toutes les synapses du corps.

Les centres nerveux reçoivent aussi des informations sensorielles et intègrent les besoins de l’organisme. Les nerfs afférents qui transportent l’information vers ces centres se distinguent des nerfs efférents qui agissent sur le cœur.`),
  section("svt-baroreflex", "Le réflexe de régulation de la pression", [583,584], String.raw`
Les barorécepteurs carotidiens et aortiques détectent l’étirement de la paroi artérielle. Leurs messages rejoignent les centres bulbaires par des voies afférentes, notamment les nerfs de Hering et les afférences aortiques.

**Pression qui augmente → étirement plus important → activité des barorécepteurs accrue → frein parasympathique renforcé et activité sympathique réduite → fréquence et débit diminués, adaptation vasculaire → pression ramenée vers sa valeur habituelle.**

Si la pression baisse, la réponse s’inverse : diminution du frein vagal et augmentation de l’activité sympathique participent à son rétablissement.

Ce **rétrocontrôle négatif** agit rapidement. D’autres mécanismes, dont la régulation rénale du volume et les hormones, interviennent sur des durées différentes.`, "baroreflex"),
], [
  "Cours pages 575–584 ; expériences analysées sans protocole d’expérimentation animale à reproduire.",
  "Distinction cœur de grenouille/cœur humain et cellules nodales/ventriculaires conservée. QRS : pas de durée 0,7 s ; repolarisation atriale masquée, B1/B2 et circuits afférents/efférents corrigés.",
  "Référence de vérification : OpenStax Anatomy and Physiology 2e, Cardiac Cycle. Aucune interprétation médicale personnalisée d’ECG.",
]);
