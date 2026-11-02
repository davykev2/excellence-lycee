import { cd, section, sheet } from "./types";

export default sheet("soil-fertility", "La fertilité et la protection des sols", cd, [
  section("svt-soil-properties", "Les dimensions de la fertilité", [710,711], String.raw`
La fertilité est l’aptitude d’un sol à fournir aux plantes un milieu physique, chimique et biologique adapté.

| Dimension | Propriétés |
| --- | --- |
| Physique | Texture, structure, porosité, aération, circulation et rétention de l’eau |
| Chimique | Nutriments disponibles, pH, rétention des ions, salinité |
| Biologique | Matière organique, racines, faune et micro-organismes |

La **texture** dépend des proportions des particules minérales. La **structure** décrit leur organisation en agrégats. Une structure grumeleuse stable favorise généralement l’aération et la circulation de l’eau, tout en permettant une réserve utile.

Il n’existe pas un pH idéal pour toutes les espèces. La fertilité se juge selon la culture, le climat et les pratiques, pas à partir d’un seul indicateur.`, "soil"),
  section("svt-soil-nutrition", "Humus et éléments minéraux", [711,712], String.raw`
Les plantes prélèvent les éléments minéraux sous des formes assimilables. Azote, phosphore et potassium sont majeurs dans la fertilisation, mais les autres éléments et l’eau sont aussi nécessaires.

| Transformation | Résultat |
| --- | --- |
| Décomposition | Fragmentation et transformation des résidus organiques |
| Humification | Formation de composés organiques relativement stables |
| Minéralisation | Libération de formes minérales à partir de matière organique |
| Fixation biologique | Transformation du $N_2$ atmosphérique par certains micro-organismes |

Les symbioses entre certaines légumineuses et des bactéries fixatrices participent à l’entrée d’azote dans le système. La plante ne transforme pas seule tout l’azote de l’air en nitrate.

Le complexe argilo-humique retient des cations échangeables et contribue à la structure. La réserve totale se distingue de la fraction immédiatement accessible aux racines.`),
  section("svt-fertilization", "Engrais et amendements", [712,713], String.raw`
Un **engrais** apporte des nutriments ; un **amendement** améliore surtout les propriétés du sol. Certains apports assurent les deux fonctions.

| Apport | Objectif |
| --- | --- |
| Compost, fumier | Matière organique et nutriments |
| Engrais minéral | Complément nutritif identifié |
| Engrais vert | Biomasse ensuite restituée au sol |
| Amendement calcaire adapté | Réduction d’une acidité excessive et apport notamment de calcium |

Les carbonates consomment des ions $H^+$ :

$$CaCO_3+2H^+\longrightarrow Ca^{2+}+CO_2+H_2O.$$

Le calcium participe aussi à l’agrégation. Ce n’est pas l’ion $Ca^{2+}$ seul qui neutralise l’acidité. Le gypse n’a pas le même pouvoir neutralisant qu’un carbonate.

Une fertilisation raisonnée tient compte des besoins, des analyses du sol et des pertes possibles. Un excès peut contaminer l’eau et déséquilibrer le milieu.`),
  section("svt-crop-rotation", "Rotation et assolement", [713,714], String.raw`
La **rotation** est une succession de cultures dans le temps sur une parcelle. L’**assolement** répartit les cultures entre les parcelles à un moment donné.

| Sole | Année 1 | Année 2 | Année 3 | Année 4 | Année 5 |
| --- | --- | --- | --- | --- | --- |
| 1 | Patate | Manioc | Pailles et engrais verts | Arachide | Patate |
| 2 | Manioc | Légumineuse de couverture | Maïs | Patate | Manioc |
| 3 | Maïs | Arachide | Patate | Jachère | Maïs |
| 4 | Arachide | Patate | Manioc | Pailles et engrais verts | Arachide |

L’alternance peut diversifier les prélèvements, couvrir le sol et interrompre certains cycles de ravageurs. Le bilan dépend aussi des exportations de récolte et des résidus restitués.

Le tableau illustre une organisation ; il n’est pas une prescription valable pour toute parcelle.`),
  section("svt-soil-erosion", "Limiter l’érosion", [714,715], String.raw`
L’eau et le vent déplacent les particules. Un sol dénudé, tassé ou déstructuré peut perdre plus facilement sa couche superficielle.

| Pratique | Effet recherché |
| --- | --- |
| Couverture végétale, paillage | Limiter l’impact des pluies et l’évaporation |
| Culture suivant les courbes de niveau | Ralentir le ruissellement |
| Haies, bandes enherbées | Freiner les écoulements et retenir les particules |
| Terrasses adaptées | Réduire la longueur ou la pente des écoulements |
| Gestion du pâturage | Conserver une couverture et limiter le tassement |
| Irrigation et drainage maîtrisés | Éviter engorgement et accumulation de sels |

Protéger un sol, c’est conserver sa matière, sa structure, son eau et son activité biologique. La technique dépend du relief, des pluies et du sol.`, "soil-protection"),
], [
  "Cours pages 710–715 partagés C11/D15 ; tableau de succession conservé, rotation/assolement distingués.",
  "Neutralisation carbonatée équilibrée, calcium structural et base neutralisante distingués ; gypse non assimilé au calcaire. Pas de dose universelle ajoutée.",
]);
