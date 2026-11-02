import { d, section, sheet } from "./types";

export default sheet("gamete-fate", "Le devenir des cellules sexuelles chez l’Homme", d, [
  section("svt-gametes-meeting", "De l’émission des gamètes à leur rencontre", [638,639], String.raw`
L’ovulation libère normalement un **ovocyte II**, entouré de cellules folliculaires, dans le voisinage de la trompe. Les spermatozoïdes déposés dans les voies génitales féminines sont soumis à une sélection importante au cours de leur progression.

| Cellule | Particularités utiles |
| --- | --- |
| Spermatozoïde | Petite cellule mobile ; tête contenant le noyau et l’acrosome, pièce intermédiaire, flagelle |
| Ovocyte II | Cellule de l’ordre de $0{,}1\ \text{mm}$ ; réserves cytoplasmiques ; méiose arrêtée en métaphase II |

La **capacitation** correspond à des transformations fonctionnelles des spermatozoïdes dans les voies génitales féminines. Elle les prépare à participer à la fécondation ; elle n’est pas la simple disparition anticipée de l’acrosome.

La fécondation a normalement lieu dans la région ampullaire de la trompe. La capacité de l’ovocyte à être fécondé dure approximativement **12 à 24 heures** après l’ovulation ; les spermatozoïdes peuvent survivre plusieurs jours dans des conditions favorables.

Ces durées sont variables : elles ne permettent pas de déterminer avec certitude des jours sans risque de grossesse.`),
  section("svt-fertilization", "La fécondation : deux lots haploïdes, un zygote diploïde", [639,640], String.raw`
1. **Reconnaissance et traversée des enveloppes :** les interactions avec les enveloppes ovocytaires et la réaction acrosomiale participent à l’accès au contact de l’ovocyte.
2. **Fusion des membranes :** le contenu du spermatozoïde pénètre dans l’ovocyte.
3. **Activation ovocytaire :** la réaction corticale modifie notamment la zone pellucide et contribue à empêcher la polyspermie.
4. **Achèvement de la méiose II :** l’ovocyte forme le lot chromosomique femelle et émet le deuxième globule polaire.
5. **Réunion des patrimoines :** les chromosomes maternels et paternels participent à la première division du zygote.

$$n+n=2n.$$

Chez l’être humain, cela correspond normalement à **23 chromosomes d’origine maternelle et 23 d’origine paternelle**. La fécondation rétablit la diploïdie et combine deux patrimoines génétiques.

Le pronoyau mâle et le pronoyau femelle se rapprochent ; leurs enveloppes se désorganisent avant la mise en place de la première division. On ne doit pas imaginer obligatoirement deux noyaux qui fusionnent comme deux gouttes.`, "fertilization"),
  section("svt-cleavage-implantation", "Segmentation, migration et nidation", [640,641], String.raw`
Le zygote réalise une succession de divisions : **2 cellules → 4 → 8 → morula → blastocyste**. Les premières divisions répartissent le cytoplasme ; elles ne produisent pas immédiatement un embryon de plus en plus volumineux.

| Repère approximatif après fécondation | Événement |
| --- | --- |
| Premiers jours | Segmentation pendant la progression dans la trompe |
| Vers les jours 3–4 | Morula et arrivée dans la cavité utérine |
| Vers les jours 5–6 | Blastocyste |
| Vers les jours 6–7 | Début habituel de l’implantation |

Le blastocyste comprend notamment un **embryoblaste**, à l’origine de l’embryon, et un **trophoblaste**, qui participe aux annexes et aux échanges avec l’organisme maternel.

La **nidation** est l’implantation dans l’endomètre, préparé par les hormones ovariennes. Le trophoblaste produit ensuite de l’hCG, qui participe au maintien du corps jaune en début de grossesse.

Ces dates sont des repères de développement, non un outil de datation individuel exact.`, "implantation"),
  section("svt-twins", "Les deux origines principales des jumeaux", [641], String.raw`
| Origine | Mécanisme |
| --- | --- |
| Jumeaux dizygotes | Deux ovocytes fécondés par deux spermatozoïdes : deux zygotes différents |
| Jumeaux monozygotes | Séparation précoce d’un même embryon issu d’un zygote |

Les jumeaux dizygotes ont une parenté génétique comparable à celle d’une fratrie. Les monozygotes ont des génomes initialement très proches, mais leur développement et leur environnement peuvent conduire à des différences.

L’origine monozygote ne signifie donc pas que tous les caractères observables seront strictement identiques pendant toute la vie.`),
], [
  "Cours pages 638–641 ; durée ovocytaire, diamètre de l’ovocyte, réaction acrosomiale et étapes de nidation clarifiés.",
  "La réaction corticale est distinguée d’un hypothétique bloc électrique universel chez l’Homme. Le schéma des pronoyaux n’impose pas leur fusion nucléaire littérale.",
  "Aucune méthode de contraception fondée sur un calcul de calendrier n’est recommandée.",
]);
