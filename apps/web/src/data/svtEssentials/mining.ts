import { d, section, sheet } from "./types";

export const miningFoundations = [
  section("svt-mineral-vocabulary", "Ressource, gîte, gisement et minerai", [726,727], String.raw`
Une **ressource minérale** est une concentration de matière présentant un intérêt pour les usages humains. Un **gîte** désigne une occurrence ou une concentration minérale identifiée. Son existence ne suffit pas à prouver sa rentabilité.

Un **gisement exploitable** présente des caractéristiques permettant d’envisager une exploitation dans des conditions techniques, économiques, sociales et environnementales données. Un **minerai** est une matière dont on peut extraire une substance utile dans ces conditions.

La **teneur** mesure la quantité de substance utile par masse ou par volume. Une forte teneur ne suffit pas : il faut aussi connaître le volume, l’accessibilité, les coûts et les contraintes.

La **roche encaissante** est la roche qui contient la minéralisation.

| Famille de roches | Formation générale |
| --- | --- |
| Magmatiques | Solidification d’un magma ou d’une lave |
| Métamorphiques | Transformation de roches préexistantes sous de nouvelles conditions, notamment de pression et de température |
| Sédimentaires | Accumulation et consolidation de matériaux, ou précipitation chimique/biologique |

Les ressources géologiques incluent aussi des fluides, mais un hydrocarbure n’est pas un minéral au même sens qu’un cristal de quartz.`),
  section("svt-ivorian-minerals", "Des ressources variées en Côte d’Ivoire", [726,727], String.raw`
| Substance utile | Exemples de formes ou minéraux associés | Repères de localisation |
| --- | --- | --- |
| Or | Or natif | Ity, Aféma, Kokoumbo, Angovia, Agbaou |
| Diamant | Carbone cristallisé | Séguéla, Tortiya |
| Fer | Magnétite $Fe_3O_4$, hématite $Fe_2O_3$ | Région de Man : Klahoyo, Tia, Nimba ; Monogaga |
| Manganèse | Pyrolusite $MnO_2$, manganite $MnO(OH)$ | Mokta, Ziemougoula, Mboussou |
| Nickel | Sulfures nickélifères | Sipilou, Samapleu |
| Cuivre | Cuprite $Cu_2O$, chalcopyrite $CuFeS_2$ | Samapleu, région de Toulepleu |
| Aluminium | Bauxite, roche riche en minéraux d’aluminium | Béné, Élinzué, régions de Bondoukou et Sinfra |
| Étain | Cassitérite $SnO_2$ | Régions de Man et de Toulepleu |
| Molybdène | Molybdénite $MoS_2$ | Guéhiebly, Monogaga |
| Titane | Ilménite $FeTiO_3$ | Sangouiné, Bâvé, Jacqueville |
| Silice | Quartz $SiO_2$ | Anyama, Grand-Bassam, Port-Bouët |

Ces localisations sont des repères de répartition géologique. **Une occurrence ne signifie pas qu’une mine y est actuellement en production.**

Les ressources sont dispersées et associées à des contextes géologiques différents. Leur identification demande de relier la substance, sa roche encaissante et son mode de formation.`),
  section("svt-primary-deposits", "La formation des concentrations primaires", [727,728], String.raw`
Les concentrations **primaires** se mettent en place dans leur contexte géologique de formation, avant un éventuel remaniement par l’altération et le transport.

Le refroidissement d’un magma peut provoquer une **cristallisation fractionnée** : tous les minéraux ne cristallisent pas au même moment, et les éléments se répartissent entre cristaux et liquide résiduel.

Des fluides chauds peuvent aussi transporter des éléments dans les fractures. Une variation de température, de pression ou de composition chimique favorise leur précipitation : des concentrations **hydrothermales**, notamment des filons minéralisés, peuvent ainsi se former.

**À retenir :** une minéralisation aurifère primaire ne résulte pas obligatoirement d’une simple accumulation d’or au fond d’un magma. Les circulations de fluides et l’histoire de la roche encaissante comptent aussi.`),
  section("svt-secondary-deposits", "Altération et concentrations secondaires", [728], String.raw`
L’altération et l’érosion peuvent libérer les minéraux contenus dans une roche. Leur devenir permet de distinguer deux situations :

| Type | Mécanisme |
| --- | --- |
| Résiduel | Concentration sur place, après transformation ou départ d’autres constituants |
| Alluvionnaire, ou placer | Transport de grains par les eaux puis concentration lors de leur dépôt |

Dans un placer aurifère, la densité élevée des grains d’or favorise leur concentration dans certains dépôts. Il s’agit principalement d’un **tri de particules**, pas d’or qui serait nécessairement entièrement dissous puis transporté par le vent.

**Roche minéralisée → altération → libération des grains → maintien sur place ou transport → concentration secondaire.**

La position d’une concentration secondaire peut renseigner sur une source primaire située en amont, sans en prouver à elle seule la taille ni la rentabilité.`, "mineral-deposits"),
];

export const formationSheet = sheet("mining-formation", "La formation des ressources minières", d, miningFoundations, [
  "Cours pages 726–728 ; inventaire du support reformulé en repères géologiques, jamais en liste de mines actuellement actives.",
  "Gîte/gisement exploitabilité distingués ; bauxite roche sans formule moléculaire unique ; magnétite et manganite rétablies. Voies magmatiques/hydrothermales et tri alluvial distingués.",
  "La fiche porte sur les ressources solides du chapitre ; elle ne remplace pas les cours C de formation et exploitation du pétrole.",
]);

export const exploitationSheet = sheet("mining-exploitation", "L’exploitation des ressources minières", d, [
  section("svt-prospecting-direct", "Prospecter : recueillir des indices", [729], String.raw`
La **prospection** recherche et caractérise une concentration utile, depuis les premiers indices jusqu’aux investigations permettant son évaluation.

| Méthode directe | Information recherchée |
| --- | --- |
| Géologique | Affleurements, structures, nature des roches et minéraux |
| Alluvionnaire | Minéraux lourds dans les sédiments ; le tri repose notamment sur les différences de densité |
| Géochimique | Concentrations mesurées dans les sols, alluvions ou roches |

Une étude géochimique suit une chaîne : **plan de prélèvement → échantillonnage → préparation contrôlée → analyse → carte des teneurs → interprétation**.

Des prélèvements à 30–40 cm de profondeur, espacés de 200 m dans les sols, ou d’environ 2 km dans des alluvions, illustrent des plans possibles. Ces valeurs ne sont pas des règles universelles.

Une **anomalie** est un écart au niveau de référence du milieu. Elle oriente la recherche ; elle n’est ni une preuve automatique de gisement rentable, ni une réserve déjà quantifiée.`),
  section("svt-prospecting-indirect", "Prospection indirecte et géophysique", [730], String.raw`
| Méthode | Propriété ou information exploitée |
| --- | --- |
| Électrique | Conductivité, résistivité et réponses électriques des terrains |
| Magnétique | Contrastes de propriétés magnétiques |
| Radiométrique | Rayonnements associés à certains éléments naturellement radioactifs |
| Sismique | Propagation et réflexion/réfraction des ondes aux interfaces |
| Télédétection | Informations de surface obtenues à distance, notamment structures et signatures des terrains |

Une réponse géophysique n’identifie pas toujours une substance unique. **Tous les métaux ne sont pas ferromagnétiques.** Les interprétations sont confrontées à la géologie, aux analyses et, si nécessaire, aux sondages.

Les sondages peuvent préciser la profondeur, la géométrie et les teneurs. Avant d’extraire, on évalue la ressource et les conditions permettant éventuellement de définir une réserve exploitable.`),
  section("svt-mining-extraction", "Choisir une méthode d’extraction", [730,731], String.raw`
| Méthode | Principe |
| --- | --- |
| À ciel ouvert | Enlever les terrains de couverture et extraire depuis une excavation de surface |
| Souterraine | Accéder au minerai par puits, rampes ou galeries |
| Par puits ou forage | Accéder notamment à des fluides ; le forage sert aussi à explorer |

Le choix dépend de la profondeur, de la forme du corps minéralisé, de la stabilité des terrains, des coûts et des impacts. Il n’existe pas un seuil de profondeur unique valable pour toutes les mines.

Dans le modèle volumique du cours, le taux de découverture vaut :

$$d=\frac{V_T}{V_M},\qquad V_M>0,$$

où $V_T$ est le volume de terrains à enlever et $V_M$ le volume de minerai, exprimés dans la même unité. Si $d=3$, il faut retirer trois volumes de couverture pour un volume de minerai.

Un taux plus élevé peut augmenter le **coût d’extraction**, mais ne fixe pas à lui seul le prix de vente de la substance sur le marché.`, "mining-methods"),
  section("svt-mining-impacts", "Bénéfices, risques et gestion", [731], String.raw`
| Retombées possibles | Risques à anticiper |
| --- | --- |
| Emplois et revenus | Accidents, exposition aux poussières et substances dangereuses |
| Infrastructures et activités locales | Déplacement d’activités ou de populations, inégalités de retombées |
| Recettes et approvisionnement en matières | Dégradation des sols, habitats et paysages |
| Développement de compétences | Pollution de l’eau ou de l’air, sédiments, déchets et résidus |

Les effets dépendent du projet et de sa gestion. La déforestation n’entraîne pas automatiquement une désertification, et **réchauffement climatique et appauvrissement de l’ozone sont des phénomènes distincts**.

La prévention associe études préalables, réduction des rejets, sécurité, suivi des eaux, gestion des déchets et préparation de la remise en état. Les terrains stériles extraits ne sont pas la même chose que les résidus issus du traitement du minerai.

Une exploitation responsable se raisonne sur l’ensemble de son cycle, y compris la fermeture et le suivi après exploitation.`),
], [
  "Cours pages 729–731 ; chiffres d’échantillonnage présentés comme exemples de protocole, sans procédure chimique dangereuse à reproduire.",
  "Magnétisme non généralisé à tous les métaux ; anomalie distincte d’une réserve. Taux volumique de découverture relié au coût, non au prix mondial.",
  "Pas de seuil universel de profondeur ; climat/ozone, stériles/résidus et impacts conditionnels distingués.",
]);
