import { d, section, sheet } from "./types";

export default sheet("spermaphytes", "La reproduction chez les spermaphytes", d, [
  section("svt-flower", "Des plantes à graines au modèle de la fleur", [656,657], String.raw`
Les **spermaphytes** sont les plantes à graines. Le modèle de la fleur, de l’ovaire puis du fruit décrit ici concerne les **angiospermes** ; les gymnospermes ne possèdent pas d’ovaire formant un fruit.

| Pièce florale | Organisation ou rôle |
| --- | --- |
| Sépales | Forment le calice |
| Pétales | Forment la corolle |
| Étamines | Filet et anthère ; production du pollen |
| Carpelles | Ovaires contenant les ovules, style et stigmate |

Une anthère typique présente deux thèques, chacune avec deux sacs polliniques. L’ovule est relié au placenta par un funicule. Il comporte notamment des téguments, un nucelle et un sac embryonnaire ; le micropyle est une ouverture des téguments.

**Un ovule n’est pas un gamète.** Il abrite les structures au sein desquelles le gamète femelle se forme.`, "flower"),
  section("svt-plant-male", "De la cellule mère au pollen", [657,658], String.raw`
Dans les sacs polliniques, une cellule mère diploïde subit une **méiose** :

$$\text{cellule mère }(2n)\longrightarrow4\ \text{microspores }(n).$$

Chaque microspore se développe en grain de pollen. Une mitose asymétrique distingue une cellule végétative et une cellule génératrice ; cette dernière donne les deux gamètes mâles par mitose. Selon l’espèce, cette division intervient avant ou après la dispersion du pollen.

Le grain de pollen possède une paroi externe, l’exine, et une paroi interne, l’intine. Il correspond au gamétophyte mâle, et non au gamète mâle lui-même.

La **déhiscence** de l’anthère libère le pollen. Sa dispersion peut être assurée notamment par le vent ou par des animaux.`, "plant-gametophytes"),
  section("svt-plant-female", "De la mégaspore au sac embryonnaire", [658,659], String.raw`
Dans le nucelle, une cellule mère diploïde subit une méiose et donne quatre mégaspores haploïdes. Dans le modèle courant présenté, une seule reste fonctionnelle.

Cette mégaspore réalise **trois mitoses successives**, conduisant à huit noyaux. Leur organisation aboutit généralement à un sac embryonnaire de **sept cellules** :

| Position | Éléments du modèle courant |
| --- | --- |
| Pôle micropylaire | Une oosphère et deux synergides |
| Centre | Une cellule centrale contenant deux noyaux polaires, ou leur noyau issu de fusion |
| Pôle opposé | Trois antipodes |

L’oosphère est le gamète femelle. Les deux noyaux polaires ne constituent pas deux oosphères supplémentaires.

**Bilan :** méiose pour produire les mégaspores, puis mitoses pour développer le gamétophyte femelle. On ne remplace pas ces mitoses par une seconde méiose.`),
  section("svt-pollination", "Pollinisation et croissance du tube pollinique", [659,660], String.raw`
La **pollinisation** est le transfert du pollen vers le stigmate. Elle peut être directe ou croisée selon l’origine du pollen et l’organisation de l’espèce.

Sur un stigmate compatible, le pollen germe et émet un **tube pollinique**. Celui-ci progresse dans le style vers l’ovule, puis permet l’acheminement des gamètes mâles jusqu’au sac embryonnaire.

Des signaux guident cette croissance : c’est un **chimiotropisme du tube**. Il ne s’agit pas de spermatozoïdes flagellés nageant librement dans tout le style dans le modèle des angiospermes.

La pollinisation n’est pas encore la fécondation : elle rend possible le rapprochement ultérieur des gamètes.`),
  section("svt-double-fertilization", "La double fécondation", [660], String.raw`
Chez les angiospermes, les deux gamètes mâles participent à deux fusions différentes :

$$\text{gamète mâle }(n)+\text{oosphère }(n)\longrightarrow\text{zygote }(2n).$$

$$\text{gamète mâle }(n)+\text{deux noyaux polaires }(n+n)\longrightarrow\text{noyau d’albumen }(3n).$$

Le zygote donne l’embryon. Le tissu issu de la seconde fusion forme l’albumen, réserve nutritive qui peut persister ou être consommée pendant le développement de la graine.

**Deux fécondations, deux devenirs : embryon diploïde et albumen généralement triploïde.** Ce mécanisme ne doit pas être attribué sans distinction à toutes les plantes à graines.`, "double-fertilization"),
  section("svt-seed-fruit", "De l’ovule à la graine, de l’ovaire au fruit", [660,661], String.raw`
| Structure avant transformation | Devenir principal |
| --- | --- |
| Ovule | Graine |
| Téguments de l’ovule | Téguments de la graine |
| Zygote | Embryon |
| Paroi de l’ovaire | Péricarpe du fruit |

Les graines **albuminées** conservent un albumen important, comme celles du maïs ou du blé. Dans les graines **exalbuminées**, comme celles du haricot ou de l’arachide, les réserves se trouvent surtout dans les cotylédons après consommation de l’albumen.

Un fruit peut être sec ou charnu, déhiscent ou indéhiscent. La tomate, le piment et l’aubergine sont des fruits charnus de type baie ; la mangue est une drupe.

Des organes autres que l’ovaire peuvent participer à la structure consommée : chez l’anacardier, la « pomme de cajou » provient d’un pédoncule développé, tandis que la noix correspond au véritable fruit.

La germination nécessite des conditions favorables, notamment une disponibilité en eau, de l’oxygène et une température adaptée. La dormance et la tolérance à la dessiccation varient selon les espèces ; elles ne sont pas identiques pour toutes les graines.`),
], [
  "Cours pages 656–661 ; titre catalogue spermaphytes conservé, périmètre angiospermes explicitement délimité.",
  "Microspore/pollen/gamète et ovule/oosphère distingués ; trois mitoses du sac embryonnaire, deux fécondations et ploïdies rétablies.",
  "Tomate/piment/aubergine non classés comme fruits secs ; pomme de cajou, téguments, germination et dessiccation clarifiés. Aucune figure scannée.",
]);
