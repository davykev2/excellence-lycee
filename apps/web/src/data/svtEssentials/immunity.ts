import { cd, section, sheet } from "./types";

export default sheet("immune-defense", "La défense de l’organisme", cd, [
  section("svt-immune-barriers", "Les premières lignes de défense", [600,601,602], String.raw`
Un agent **pathogène** peut provoquer une maladie. Tous les micro-organismes ne sont pas pathogènes ; certains participent au fonctionnement normal des microbiotes. Un virus n’est pas une cellule et ne se multiplie qu’en utilisant une cellule hôte.

| Barrière | Exemples de protection |
| --- | --- |
| Mécanique | Épiderme, mucus, mouvements ciliaires, écoulements |
| Chimique | Acidité gastrique, substances antimicrobiennes telles que le lysozyme |
| Biologique | Compétition exercée par les microbiotes |

Si un agent franchit ces barrières, les cellules sentinelles peuvent déclencher une réponse locale. L’immunité **innée** agit rapidement, à partir de mécanismes de reconnaissance partagés ; l’immunité **adaptative** mobilise des lymphocytes spécifiques et peut installer une mémoire.

Ces défenses coopèrent : elles ne sont pas trois compartiments qui attendent obligatoirement l’échec complet du précédent.`),
  section("svt-inflammation", "Inflammation et phagocytose", [602,603,604], String.raw`
La réaction inflammatoire associe souvent **rougeur, chaleur, gonflement et douleur**. Des médiateurs favorisent la vasodilatation, la perméabilité des petits vaisseaux et le recrutement de leucocytes.

Les leucocytes peuvent adhérer à la paroi puis la traverser par **diapédèse**. Les neutrophiles, les macrophages et d’autres cellules participent à la défense.

**Phagocytose : reconnaissance/adhérence → englobement dans un phagosome → fusion avec des lysosomes → phagolysosome → digestion et élimination des résidus.**

Le phagocyte peut être aidé par des molécules fixées sur la cible : c’est l’**opsonisation**. Certaines cellules phagocytaires présentent ensuite des peptides antigéniques aux lymphocytes T.

Une infection qui se généralise n’est pas définie par la seule présence de microbes dans le sang. Le sepsis correspond à une réaction dérégulée à une infection, avec atteinte d’organes : il ne doit pas être réduit au simple déplacement de bactéries.`, "phagocytosis"),
  section("svt-self-grafts", "Soi, antigènes et greffes", [604,605,606], String.raw`
Un **antigène** possède des motifs susceptibles d’être reconnus par des récepteurs de l’immunité adaptative. Le **soi** correspond aux constituants de l’organisme ; leur tolérance dépend de mécanismes d’apprentissage et de régulation.

| Greffe | Donneur et receveur |
| --- | --- |
| Autogreffe | Même individu |
| Isogreffe | Individus génétiquement identiques |
| Allogreffe | Individus différents d’une même espèce |
| Xénogreffe | Espèces différentes |

Chez l’être humain, les molécules **HLA** interviennent dans la présentation de peptides. Les molécules de classe I sont portées par la plupart des cellules nucléées ; celles de classe II sont notamment portées par les cellules présentatrices d’antigènes.

Le récepteur d’un lymphocyte T reconnaît un complexe **peptide–HLA**, avec l’aide de CD4 ou de CD8 selon le cas. Les molécules HLA ne sont pas des récepteurs qui décideraient seules de détruire un greffon.

La compatibilité diminue certains risques mais ne garantit pas, à elle seule, l’absence de rejet. Des mécanismes cellulaires et humoraux peuvent participer au rejet.`),
  section("svt-immune-transfer", "Ce que montrent les transferts de sérum ou de cellules", [606,607,608], String.raw`
Pour identifier un mécanisme de défense, on compare des lots témoins et des lots recevant un élément provenant d’un animal immunisé.

| Résultat expérimental | Interprétation dans le modèle |
| --- | --- |
| Le sérum d’un donneur immunisé transfère la protection | Une substance soluble, notamment un anticorps, intervient |
| Le transfert de lymphocytes assure une protection que le sérum ne transmet pas | Une composante cellulaire intervient |
| Une protection acquise contre A ne protège pas contre B | La réponse étudiée est spécifique |
| Le second contact produit une réponse plus rapide et plus forte | Des cellules mémoires interviennent |

La défense antitétanique illustre une protection humorale par des anticorps neutralisant une toxine. Une **anatoxine** est une toxine rendue non toxique tout en conservant des propriétés antigéniques.

Les expériences portant sur des agents intracellulaires illustrent notamment le rôle des lymphocytes T et de l’activation des phagocytes. Ces modèles n’autorisent pas à conclure qu’une maladie réelle dépend exclusivement d’un seul mécanisme.

Un transfert d’anticorps procure une protection **passive**, sans créer chez le receveur la même mémoire qu’une immunisation active.`),
  section("svt-lymphocytes", "Cellules et organes de l’immunité adaptative", [608,609], String.raw`
Les cellules sanguines dérivent de précurseurs de la moelle osseuse. Les lymphocytes B y accomplissent leur maturation ; les précurseurs des lymphocytes T poursuivent leur maturation dans le thymus.

| Organe ou tissu | Fonction majeure |
| --- | --- |
| Moelle osseuse | Production des cellules sanguines ; maturation B |
| Thymus | Maturation et sélection T |
| Ganglions lymphatiques | Rencontre entre antigènes, cellules présentatrices et lymphocytes |
| Rate | Surveillance des antigènes apportés par le sang |
| Tissus lymphoïdes des muqueuses | Surveillance des portes d’entrée muqueuses |

Un lymphocyte porte des récepteurs spécifiques. L’organisme dispose de nombreux clones différents avant la rencontre de l’antigène. L’antigène **sélectionne** les clones capables de le reconnaître ; il ne fabrique pas sur commande un récepteur entièrement nouveau.`),
  section("svt-antibodies", "Anticorps et complément", [609,610], String.raw`
Un anticorps est une **immunoglobuline** produite par des plasmocytes issus de lymphocytes B. Le modèle monomérique comporte deux chaînes lourdes et deux chaînes légères ; ses régions variables participent à la reconnaissance de l’antigène.

| Élément | Rôle |
| --- | --- |
| Régions de liaison à l’antigène | Reconnaissance spécifique |
| Région constante | Interactions avec d’autres acteurs de la défense |
| IgG, IgM, IgA, IgE, IgD | Cinq classes aux distributions et fonctions différentes |

Les anticorps peuvent neutraliser une toxine ou un virus, favoriser l’opsonisation et, pour certaines classes, activer la voie classique du complément.

Le **complément** regroupe des protéines solubles. Ses voies d’activation convergent vers des mécanismes d’opsonisation, d’inflammation et, pour certaines cibles, de formation d’un complexe d’attaque membranaire. Son activation ne nécessite pas toujours un anticorps : les voies alternative et des lectines sont aussi possibles.

**À retenir :** fixer un antigène, le neutraliser et détruire la cible sont des étapes différentes. Un anticorps ne « mange » pas directement un microbe.`),
  section("svt-adaptive-cooperation", "Sélection, multiplication et coopération", [610,611,612], String.raw`
Une cellule dendritique peut présenter des peptides et fournir les signaux nécessaires à l’activation d’un lymphocyte T naïf. La reconnaissance seule ne résume donc pas toute l’activation.

**Reconnaissance → activation → multiplication clonale → différenciation en effecteurs et cellules mémoires.**

| Acteur | Contribution |
| --- | --- |
| Lymphocyte T CD4 auxiliaire | Coordonne par ses interactions et ses cytokines |
| Lymphocyte B | Reconnaît l’antigène ; peut présenter des peptides et devenir plasmocyte |
| Plasmocyte | Sécrète des anticorps |
| Lymphocyte T CD8 effecteur | Reconnaît des cellules cibles et peut déclencher leur apoptose |
| Lymphocytes régulateurs | Participent à la limitation des réponses et à la tolérance |

Dans de nombreuses réponses humorales, l’aide T CD4 au lymphocyte B associe reconnaissance, contacts cellulaires et cytokines. Pour les cellules infectées, un T CD8 effecteur peut utiliser notamment les mécanismes perforine–granzymes.

La réponse cesse progressivement lorsque le stimulus disparaît, tandis qu’une partie des cellules mémoires persiste.`, "immune-cooperation"),
  section("svt-immune-memory", "Mémoire, vaccination et protection passive", [611,612], String.raw`
Au premier contact, la réponse spécifique nécessite un délai d’activation et de multiplication. Au contact suivant avec le même antigène, les cellules mémoires permettent généralement une réponse **plus rapide et plus importante**.

La vaccination vise à installer une mémoire protectrice sans faire subir les risques de la maladie naturelle. Selon le vaccin, le support antigénique et le nombre de doses diffèrent ; un résultat expérimental n’est pas une garantie absolue de protection pour toute personne.

| Protection | Origine | Mémoire propre au receveur |
| --- | --- | --- |
| Active | Réponse de ses lymphocytes après immunisation | Oui, selon l’immunisation |
| Passive | Anticorps reçus d’une autre source | Pas par le seul transfert d’anticorps |

Les IgG maternelles peuvent traverser le placenta. Les IgA du lait contribuent notamment à la protection des muqueuses du nourrisson. Ces apports ne remplacent pas la mise en place progressive de ses propres défenses.

**BCG :** le vaccin utilise une souche atténuée de *Mycobacterium bovis*. Il ne s’agit pas simplement d’un bacille humain rendu inoffensif.`, "immune-memory"),
], [
  "Cours pages 600–612, sans recopier les exercices corrigés. Révision partagée C5/D11, sans ajout de questions ni changement de progression.",
  "Allogreffe/xénogreffe, nature de l’anatoxine, maturation des lymphocytes, HLA, complément, coopération T/B et origine du BCG rétablis.",
  "Les expériences de protection sont interprétées dans leur modèle : pas de promesse clinique universelle, de protocole animal à reproduire ou de recommandation personnalisée.",
]);
