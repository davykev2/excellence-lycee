import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const sexBloodHereditySource = createSvtSource("SVT TA_L5_Lhérédité du sexe et du groupe sanguin chez lHomme.pdf");

const course: SvtCourseSeed = {
    id: "terminale-svt-l5-sex-blood-heredity",
    chapterNumber: 5,
    themeNumber: 3,
    themeTitle: "Génétique humaine",
    title: "L’hérédité du sexe et du groupe sanguin chez l’Homme",
    description: "Lire un arbre généalogique, relier les génotypes ABO aux groupes sanguins et utiliser la méiose puis la fécondation pour expliquer le modèle chromosomique XX-XY.",
    centralQuestion: "Comment deux mécanismes héréditaires distincts transmettent-ils le groupe sanguin ABO et le sexe chromosomique ?",
    memorySentence: "ABO : phénotype → génotypes → gamètes → échiquier ; XX-XY : méiose → gamètes X ou Y → fécondation aléatoire.",
    overviewBodyMarkdown: `
## Deux caractères, deux modèles à ne pas mélanger

Cette leçon étudie deux caractères héréditaires. Ils sont tous deux transmis lors de la fécondation, mais ils ne reposent pas sur le même support chromosomique.

| Caractère étudié | Support principal | Ce que reçoit l’enfant |
|---|---|---|
| **Groupe sanguin ABO** | le gène **ABO**, situé sur un autosome | un allèle maternel et un allèle paternel parmi $I^A$, $I^B$ et $i$ |
| **Sexe chromosomique dans le modèle XX-XY** | les chromosomes sexuels X et Y | un X ovulaire et, le plus souvent, un X ou un Y spermatique |

Le système ABO produit **quatre phénotypes usuels** — A, B, AB et O — à partir de **six génotypes**. Le modèle XX-XY explique pourquoi l’ovule apporte presque toujours X alors que les spermatozoïdes se répartissent en deux catégories, X ou Y.

## Le vocabulaire indispensable

| Mot | Sens dans cette leçon |
|---|---|
| **gène** | portion d’ADN dont différentes versions participent ici au caractère ABO |
| **allèle** | version d’un gène : $I^A$, $I^B$ ou $i$ pour le modèle ABO scolaire |
| **génotype** | paire d’allèles portée par un individu, par exemple $I^A i$ |
| **phénotype** | caractère observable, par exemple le groupe A |
| **autosome** | chromosome qui n’est pas X ou Y ; le gène ABO est situé sur le chromosome 9 |
| **gamète** | cellule haploïde ne recevant qu’un chromosome de chaque paire et qu’un allèle du gène ABO |

> **Astuce mémoire — GPGÉ :** **G**ène, **P**hénotype, **G**amètes, **É**chiquier. On identifie d’abord le gène et les génotypes possibles, puis les gamètes, enfin l’échiquier.

## Deux précautions scientifiques et humaines

Le groupe ABO peut parfois **exclure** une filiation incompatible, mais il ne prouve pas à lui seul une paternité : une expertise de parenté repose aujourd’hui sur de nombreux marqueurs ADN. De même, dire que le spermatozoïde apporte X ou Y décrit une contribution chromosomique aléatoire ; cela n’attribue au père ni décision, ni faute, ni mérite.

Enfin, connaître le seul groupe ABO ne suffit pas à garantir une transfusion « sans danger ». Les professionnels vérifient aussi le RhD, recherchent d’autres anticorps et réalisent une épreuve de compatibilité.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte comparative",
      title: "Deux transmissions, une même fécondation",
      instruction: "Ouvre chaque carte pour distinguer ce qui est commun et ce qui change.",
      rootLabel: "Hérédité humaine",
      rootDetail: "Chaque parent transmet un lot haploïde de chromosomes, mais les deux caractères étudiés utilisent des règles différentes.",
      nodes: [
        { id: "abo-gene", label: "Gène ABO", role: "Support autosomal", detail: "Il se situe sur le chromosome 9 et possède plusieurs allèles dans la population.", group: "Groupe sanguin" },
        { id: "abo-expression", label: "A, B, AB ou O", role: "Phénotypes", detail: "Les allèles $I^A$ et $I^B$ sont codominants ; $i$ est récessif dans le modèle usuel.", group: "Groupe sanguin" },
        { id: "sex-chromosomes", label: "Chromosomes X et Y", role: "Support chromosomique", detail: "La paire sexuelle est typiquement XX ou XY dans le modèle étudié.", group: "Sexe chromosomique" },
        { id: "gametes", label: "Gamètes", role: "Méiose", detail: "L’ovule apporte presque toujours X ; un spermatozoïde apporte X ou Y.", group: "Sexe chromosomique" },
        { id: "fertilization", label: "Fécondation", role: "Rencontre aléatoire", detail: "Elle réunit un allèle ABO et un chromosome sexuel de chaque parent.", group: "Point commun" },
        { id: "probability", label: "Probabilités", role: "Prévoir sans promettre", detail: "Un échiquier donne les chances à chaque conception, jamais l’ordre certain des naissances.", group: "Point commun" },
      ],
      observation: "Un même enfant reçoit simultanément les deux patrimoines ; il faut pourtant construire un raisonnement séparé pour ABO et pour XX-XY.",
    },
    overviewExtraQuestions: [
      choice("Sur quel type de chromosome se situe le gène ABO ?", ["Un chromosome sexuel Y", "Un autosome", "L’ADN mitochondrial uniquement", "Aucun chromosome"], 1, "Le locus ABO est situé sur le chromosome 9, qui est un autosome."),
      choice("Quelle distinction est correcte ?", ["Le phénotype est la paire d’allèles et le génotype le groupe visible", "Phénotype et génotype sont toujours identiques", "Le génotype est la paire d’allèles ; le phénotype est le caractère exprimé", "Un génotype ne contient aucun allèle"], 2, "Le génotype $I^A i$ produit par exemple le phénotype A."),
      choice("Que transmet chaque parent pour le gène ABO ?", ["Deux groupes sanguins complets", "Seulement un antigène", "Aucun allèle", "Un allèle dans chaque gamète"], 3, "La méiose ne place qu’un des deux allèles parentaux dans chaque gamète."),
      choice("Pourquoi faut-il séparer les deux échiquiers de la leçon ?", ["Ils n’étudient pas le même caractère ni le même support chromosomique", "Le groupe ABO détermine toujours XX ou XY", "Le chromosome Y porte le gène ABO", "Les ovules ne contiennent pas d’autosomes"], 0, "ABO est autosomal, tandis que le second modèle porte sur X et Y."),
      trueFalse("Un groupe ABO compatible suffit à lui seul à garantir une transfusion sans risque.", false, "Le RhD, les autres anticorps, le dépistage infectieux et l’épreuve de compatibilité font aussi partie de la sécurité transfusionnelle."),
      trueFalse("Le groupe sanguin ABO d’un enfant peut prouver à lui seul l’identité de son père biologique.", false, "ABO peut exclure certains cas incompatibles, mais ne suffit pas à établir une paternité."),
      choice("Que signifie une probabilité de 1/2 à chaque fécondation dans le modèle XX-XY ?", ["Une famille doit avoir exactement autant de filles que de garçons", "Après une fille, un garçon devient obligatoire", "Chaque nouvelle fécondation conserve les deux possibilités", "Les parents choisissent la prochaine possibilité"], 2, "Les conceptions successives sont des événements indépendants dans ce modèle simple."),
    ],
    overviewSource: sexBloodHereditySource(
      "1-8",
      "Problématique, conclusion générale et documentation",
      [
        "La couverture interne classe le document comme « leçon 3 » ; le catalogue de la plateforme le conserve à sa position officielle actuelle de leçon 5.",
        "La situation d’apprentissage introductive et menaçante est retirée ; ses deux problèmes biologiques sont repris sans mettre en scène un conflit familial.",
        "La page 8 ne contient qu’un titre sans arbre généalogique supplémentaire ; aucun contenu absent n’est inventé.",
        "La transfusion est présentée avec ses contrôles ABO, RhD, anticorps et compatibilité ; le groupe ABO seul ne garantit pas l’absence de danger.",
        "Le groupe ABO peut contribuer à une exclusion de parenté, mais ne suffit pas à prouver une paternité.",
      ],
    ),
    sections: [
      {
        id: "abo-alleles",
        title: "Comprendre le système ABO",
        summary: "Lire l’arbre officiel, distinguer allèles, génotypes, antigènes et anticorps, puis expliquer codominance et récessivité.",
        conceptTitle: "Trois allèles principaux produisent quatre groupes ABO usuels",
        explanation: "Le gène ABO est polyallélique dans la population. Chaque personne n’en porte pourtant que deux copies : $I^A$ permet l’expression de l’antigène A, $I^B$ celle de l’antigène B et $i$ ne produit pas de transférase A ou B fonctionnelle dans le modèle courant.",
        keyPoint: "$I^A$ et $I^B$ sont codominants ; $i$ est récessif : six génotypes usuels correspondent à quatre phénotypes ABO.",
        example: "$I^A I^B$ donne AB ; $I^A i$ donne A ; $I^B i$ donne B ; $ii$ donne O.",
        bodyMarkdown: `
## 1. Ce que montre l’arbre généalogique officiel

Le document présente une mère de groupe A et un père de groupe B avec quatre enfants de groupes AB, O, A et B. Les cercles représentent les femmes, les carrés les hommes, la ligne horizontale un couple et la ligne de descendance leurs enfants.

La présence d’un enfant O montre que **chaque parent possède un allèle $i$ masqué**. La mère est donc $I^A i$ et le père $I^B i$. L’enfant AB a reçu $I^A$ de sa mère et $I^B$ de son père : les deux allèles s’expriment ensemble.

> **Correction de raisonnement :** le fait qu’une fille et son père aient le même groupe B ne prouve pas, à lui seul, que le gène est autosomal. La localisation du gène ABO sur le chromosome 9 est établie indépendamment ; l’arbre est compatible avec cette transmission.

## 2. Du gène aux antigènes

| Génotype | Phénotype | Antigène(s) des globules rouges | Anticorps ABO usuels du plasma |
|---|---|---|---|
| $I^A I^A$ ou $I^A i$ | A | A | anti-B |
| $I^B I^B$ ou $I^B i$ | B | B | anti-A |
| $I^A I^B$ | AB | A et B | ni anti-A ni anti-B |
| $ii$ | O | ni A ni B | anti-A et anti-B |

Le mot **codominance** signifie que $I^A$ et $I^B$ s’expriment simultanément chez l’hétérozygote $I^A I^B$. L’allèle $i$ est dit **récessif** parce qu’il ne détermine le phénotype O que chez l’homozygote $ii$.

Le gène est **polyallélique** parce qu’il existe au moins trois formes principales dans la population. Un individu diploïde n’en reçoit toutefois que **deux**, une de chaque parent.

> **Astuce mémoire — A fait A, B fait B, AB fait les deux, O n’ajoute ni A ni B.**

## 3. Ce que le modèle scolaire simplifie

La notation moderne $I^A$, $I^B$, $i$ évite de confondre l’allèle avec le phénotype. Il existe des sous-groupes et de rares phénotypes particuliers ; les exercices du document utilisent le modèle ABO usuel à trois allèles principaux.
`,
        processTitle: "Du génotype au groupe sanguin",
        processInstruction: "Associe génotype, antigènes et anticorps avant de conclure sur le phénotype.",
        process: [
          { label: "Groupe A", detail: "$I^A I^A$ ou $I^A i$ ; antigène A et anticorps anti-B." },
          { label: "Groupe B", detail: "$I^B I^B$ ou $I^B i$ ; antigène B et anticorps anti-A." },
          { label: "Groupe AB", detail: "$I^A I^B$ ; antigènes A et B exprimés ensemble par codominance." },
          { label: "Groupe O", detail: "$ii$ ; aucun antigène A/B et anticorps anti-A/anti-B." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Membranes interactives",
          title: "Quatre phénotypes, quatre signatures antigéniques",
          instruction: "Sélectionne un globule rouge pour relier surface, génotype et plasma.",
          viewBox: "0 0 760 420",
          caption: "Figure originale et simplifiée des antigènes ABO à la surface des globules rouges.",
          zones: [
            { label: "Groupe A", xStart: 0, xEnd: 190 },
            { label: "Groupe B", xStart: 190, xEnd: 380 },
            { label: "Groupe AB", xStart: 380, xEnd: 570 },
            { label: "Groupe O", xStart: 570, xEnd: 760 },
          ],
          shapes: [
            { shape: "circle", cx: 95, cy: 190, r: 70, tone: "soft" },
            { shape: "circle", cx: 285, cy: 190, r: 70, tone: "soft" },
            { shape: "circle", cx: 475, cy: 190, r: 70, tone: "soft" },
            { shape: "circle", cx: 665, cy: 190, r: 70, tone: "soft" },
            { shape: "text", x: 95, y: 196, content: "A", anchor: "middle" },
            { shape: "text", x: 285, y: 196, content: "B", anchor: "middle" },
            { shape: "text", x: 475, y: 196, content: "A + B", anchor: "middle" },
            { shape: "text", x: 665, y: 196, content: "aucun A/B", anchor: "middle" },
            { shape: "line", x1: 60, y1: 122, x2: 60, y2: 99, tone: "accent" },
            { shape: "line", x1: 95, y1: 116, x2: 95, y2: 91, tone: "accent" },
            { shape: "line", x1: 130, y1: 122, x2: 130, y2: 99, tone: "accent" },
            { shape: "line", x1: 250, y1: 122, x2: 238, y2: 101, tone: "outline" },
            { shape: "line", x1: 285, y1: 116, x2: 273, y2: 93, tone: "outline" },
            { shape: "line", x1: 320, y1: 122, x2: 308, y2: 101, tone: "outline" },
            { shape: "line", x1: 440, y1: 122, x2: 440, y2: 99, tone: "accent" },
            { shape: "line", x1: 470, y1: 116, x2: 458, y2: 93, tone: "outline" },
            { shape: "line", x1: 500, y1: 116, x2: 500, y2: 91, tone: "accent" },
            { shape: "line", x1: 530, y1: 122, x2: 518, y2: 101, tone: "outline" },
            { shape: "text", x: 95, y: 305, content: "IᴬIᴬ ou Iᴬi", anchor: "middle" },
            { shape: "text", x: 285, y: 305, content: "IᴮIᴮ ou Iᴮi", anchor: "middle" },
            { shape: "text", x: 475, y: 305, content: "IᴬIᴮ", anchor: "middle" },
            { shape: "text", x: 665, y: 305, content: "ii", anchor: "middle" },
          ],
          hotspots: [
            { id: "group-a", number: 1, label: "Groupe A", detail: "L’antigène A est présent ; le génotype peut être $I^A I^A$ ou $I^A i$.", x: 95, y: 190, highlight: [{ shape: "circle", cx: 95, cy: 190, r: 76, tone: "accent" }] },
            { id: "group-b", number: 2, label: "Groupe B", detail: "L’antigène B est présent ; le génotype peut être $I^B I^B$ ou $I^B i$.", x: 285, y: 190, highlight: [{ shape: "circle", cx: 285, cy: 190, r: 76, tone: "accent" }] },
            { id: "group-ab", number: 3, label: "Groupe AB", detail: "Les antigènes A et B sont présents : c’est l’expression de la codominance.", x: 475, y: 190, highlight: [{ shape: "circle", cx: 475, cy: 190, r: 76, tone: "accent" }] },
            { id: "group-o", number: 4, label: "Groupe O", detail: "Aucun antigène A/B n’est produit dans le modèle usuel ; le génotype est $ii$.", x: 665, y: 190, highlight: [{ shape: "circle", cx: 665, cy: 190, r: 76, tone: "accent" }] },
          ],
          observation: "Les phénotypes A et B ne révèlent pas toujours le génotype ; AB et O, eux, correspondent chacun à une seule combinaison usuelle.",
        },
        observation: "Un même phénotype A ou B peut cacher deux génotypes différents, alors que AB et O sont non ambigus dans le modèle étudié.",
        check: choice(
          "Quel génotype correspond obligatoirement au groupe O ?",
          ["$ii$", "$I^A I^B$", "$I^A I^A$", "$I^B I^B$"],
          0,
          "Le phénotype O n’apparaît que si les deux copies sont l’allèle récessif $i$ dans le modèle ABO usuel.",
        ),
        extraQuestions: [
          trueFalse("Activité officielle, affirmation 1 — « Un phénotype récessif n’apparaît jamais dans la descendance. »", false, "Deux parents porteurs peuvent transmettre chacun l’allèle récessif ; le phénotype O apparaît alors chez l’enfant $ii$.", "Activité d’application, affirmation 1 • page 3"),
          trueFalse("Activité officielle, affirmation 2 — « Dans le système ABO, les phénotypes A et B sont codominants. »", true, "Plus précisément, les allèles $I^A$ et $I^B$ sont codominants et s’expriment ensemble chez $I^A I^B$.", "Activité d’application, affirmation 2 • page 3"),
          trueFalse("Activité officielle, affirmation 3 — « Un gène polyallélique est un gène qui a plusieurs formes alléliques. »", true, "Le locus ABO possède plusieurs allèles dans la population.", "Activité d’application, affirmation 3 • page 3"),
          trueFalse("Activité officielle, affirmation 4 — « Dans le système ABO, un individu de groupe AB est hétérozygote. »", true, "Il porte deux allèles différents, $I^A$ et $I^B$.", "Activité d’application, affirmation 4 • page 3"),
          trueFalse("Activité officielle, affirmation 5 — « Dans le système ABO, l’allèle O est dominant. »", false, "L’allèle $i$ est récessif devant $I^A$ et $I^B$ dans le modèle usuel.", "Activité d’application, affirmation 5 • page 3"),
          choice("Combien d’allèles ABO un individu diploïde porte-t-il normalement ?", ["Trois, puisqu’il existe trois allèles dans la population", "Un seul dans toutes ses cellules", "Deux, un hérité de chaque parent", "Quatre, un par groupe"], 2, "Polyallélique décrit la population ; chaque individu diploïde possède deux copies du locus."),
          choice("Quel couple génotype-phénotype est correct ?", ["$I^A i$ → groupe O", "$I^B i$ → groupe B", "$ii$ → groupe AB", "$I^A I^B$ → groupe A uniquement"], 1, "$I^B$ s’exprime devant $i$, donc $I^B i$ donne le groupe B."),
          choice("Pourquoi un individu AB n’a-t-il habituellement ni anti-A ni anti-B dans son plasma ?", ["Il ne possède aucun antigène", "Ses globules rouges sont absents", "Il est toujours donneur universel de plasma et de globules rouges", "Son système immunitaire reconnaît ses antigènes A et B comme propres"], 3, "Il ne produit normalement pas d’anticorps ABO contre ses propres antigènes."),
        ],
        source: sexBloodHereditySource(
          "1-3 et 7-8",
          "Enquête familiale, arbre généalogique, interprétation ABO et activité d’application",
          [
            "L’allèle noté « O » dans le PDF est normalisé en $i$ ; les allèles fonctionnels sont notés $I^A$ et $I^B$.",
            "Le partage d’un même groupe sanguin entre un père et sa fille n’établit pas à lui seul la localisation autosomale ; le gène ABO est situé sur le chromosome 9.",
            "La codominance concerne rigoureusement les allèles $I^A$ et $I^B$, même si l’activité source parle des phénotypes A et B.",
          ],
        ),
        distractors: ["$I^A$ domine toujours $I^B$.", "Le groupe AB correspond au génotype $ii$.", "Le système ABO est porté par les chromosomes sexuels."],
      },
      {
        id: "abo-crosses",
        title: "Résoudre un croisement ABO",
        summary: "Déduire les génotypes parentaux à partir des enfants, construire l’échiquier $I^A i × I^B i$ et interpréter l’arbre officiel.",
        conceptTitle: "Les phénotypes des enfants révèlent les allèles masqués des parents",
        explanation: "Un parent de groupe A peut être $I^A I^A$ ou $I^A i$ et un parent B, $I^B I^B$ ou $I^B i$. Dans la famille officielle, l’enfant O a nécessairement reçu $i$ de chacun : les parents sont donc $I^A i$ et $I^B i$.",
        keyPoint: "Phénotypes → génotypes possibles → indices familiaux → gamètes → échiquier → probabilités.",
        example: "$I^A i × I^B i$ produit $I^A I^B$, $I^A i$, $I^B i$ ou $ii$, chacun avec une probabilité théorique de $1/4$.",
        bodyMarkdown: `
## 1. Ne pas choisir le génotype au hasard

Le phénotype A correspond à $I^A I^A$ **ou** $I^A i$. Le phénotype B correspond à $I^B I^B$ **ou** $I^B i$. Il faut donc exploiter les descendants avant de dresser l’échiquier.

Dans les deux arbres des pages 2 et 7, un couple A × B possède au moins un enfant O. Puisque cet enfant est $ii$, sa mère a transmis $i$ et son père aussi :

$$I^A i × I^B i$$

## 2. Construire l’échiquier complet

| Gamète maternel / Gamète paternel | $I^B$ | $i$ |
|---|---|---|
| $I^A$ | $I^A I^B$ → **AB** | $I^A i$ → **A** |
| $i$ | $I^B i$ → **B** | $ii$ → **O** |

Chaque case représente ici $1/2 × 1/2 = 1/4$. Le bilan théorique est donc 25 % A, 25 % B, 25 % AB et 25 % O **pour chaque conception**.

> **Erreur fréquente :** quatre enfants dans une famille ne doivent pas obligatoirement représenter une fois chaque case. L’échiquier donne des probabilités ; le hasard peut produire plusieurs enfants du même groupe.

## 3. Expliquer chaque enfant de l’exercice officiel

- La fille **AB** reçoit $I^A$ de sa mère et $I^B$ de son père.
- Le garçon **B** reçoit $i$ de sa mère et $I^B$ de son père ; son génotype est donc $I^B i$.
- Chacune des deux filles **O** reçoit $i$ de la mère et $i$ du père ; son génotype est $ii$.

L’arbre de la page 2 ajoute un enfant A, compatible avec $I^A i$.

## 4. Ce que l’arbre autorise — et ce qu’il n’autorise pas

Un groupe impossible dans un modèle bien établi peut **exclure** une hypothèse de parenté. En revanche, beaucoup de personnes partagent les mêmes groupes : un groupe compatible ne prouve jamais à lui seul une paternité. Une expertise moderne utilise plusieurs marqueurs ADN.

> **Astuce mémoire — PIGÉ :** **P**hénotypes, **I**ndices, **G**amètes, **É**chiquier.
`,
        processTitle: "Construire l’échiquier",
        processInstruction: "Pars des phénotypes, exploite l’enfant O, puis combine les gamètes.",
        process: [
          { label: "Génotypes possibles", shortLabel: "Génotypes", detail: "A peut cacher $I^A i$ et B peut cacher $I^B i$." },
          { label: "Indice O", shortLabel: "Indice", detail: "Un enfant $ii$ prouve que chacun des deux parents a transmis $i$." },
          { label: "Gamètes", detail: "La mère produit $I^A$ ou $i$ ; le père $I^B$ ou $i$." },
          { label: "Descendance", detail: "Les quatre combinaisons donnent AB, A, B et O avec $1/4$ chacune." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Échiquier interactif",
          title: "Le croisement $I^A i × I^B i$",
          instruction: "Ouvre chaque case pour identifier l’allèle maternel, l’allèle paternel et le groupe obtenu.",
          viewBox: "0 0 720 440",
          caption: "Figure originale de l’échiquier ABO reconstitué d’après la vérification chromosomique du document.",
          shapes: [
            { shape: "text", x: 365, y: 42, content: "gamètes du père", anchor: "middle" },
            { shape: "text", x: 74, y: 246, content: "gamètes", anchor: "middle" },
            { shape: "text", x: 74, y: 270, content: "de la mère", anchor: "middle" },
            { shape: "line", x1: 170, y1: 90, x2: 650, y2: 90, tone: "outline" },
            { shape: "line", x1: 170, y1: 200, x2: 650, y2: 200, tone: "outline" },
            { shape: "line", x1: 170, y1: 320, x2: 650, y2: 320, tone: "outline" },
            { shape: "line", x1: 170, y1: 420, x2: 650, y2: 420, tone: "outline" },
            { shape: "line", x1: 170, y1: 90, x2: 170, y2: 420, tone: "outline" },
            { shape: "line", x1: 410, y1: 90, x2: 410, y2: 420, tone: "outline" },
            { shape: "line", x1: 650, y1: 90, x2: 650, y2: 420, tone: "outline" },
            { shape: "text", x: 290, y: 150, content: "Iᴮ", anchor: "middle" },
            { shape: "text", x: 530, y: 150, content: "i", anchor: "middle" },
            { shape: "text", x: 135, y: 258, content: "Iᴬ", anchor: "middle" },
            { shape: "text", x: 135, y: 372, content: "i", anchor: "middle" },
            { shape: "text", x: 290, y: 252, content: "IᴬIᴮ → AB", anchor: "middle" },
            { shape: "text", x: 530, y: 252, content: "Iᴬi → A", anchor: "middle" },
            { shape: "text", x: 290, y: 372, content: "Iᴮi → B", anchor: "middle" },
            { shape: "text", x: 530, y: 372, content: "ii → O", anchor: "middle" },
          ],
          hotspots: [
            { id: "ab-cell", number: 1, label: "Groupe AB", detail: "$I^A$ maternel et $I^B$ paternel s’expriment ensemble : probabilité $1/4$.", x: 290, y: 252, highlight: [{ shape: "path", d: "M178 208 L402 208 L402 312 L178 312 Z", tone: "accent" }] },
            { id: "a-cell", number: 2, label: "Groupe A", detail: "$I^A$ maternel domine $i$ paternel : probabilité $1/4$.", x: 530, y: 252, highlight: [{ shape: "path", d: "M418 208 L642 208 L642 312 L418 312 Z", tone: "accent" }] },
            { id: "b-cell", number: 3, label: "Groupe B", detail: "$i$ maternel est masqué par $I^B$ paternel : probabilité $1/4$.", x: 290, y: 372, highlight: [{ shape: "path", d: "M178 328 L402 328 L402 412 L178 412 Z", tone: "accent" }] },
            { id: "o-cell", number: 4, label: "Groupe O", detail: "Chaque parent transmet $i$ ; le génotype $ii$ s’exprime : probabilité $1/4$.", x: 530, y: 372, highlight: [{ shape: "path", d: "M418 328 L642 328 L642 412 L418 412 Z", tone: "accent" }] },
          ],
          observation: "L’enfant O est l’indice qui révèle les allèles $i$ cachés chez les deux parents.",
        },
        observation: "Les probabilités s’appliquent à chaque conception indépendamment ; elles ne garantissent pas une répartition exacte dans une petite famille.",
        check: choice(
          "Deux parents A et B ont un enfant O. Quels génotypes doivent-ils porter dans le modèle usuel ?",
          ["$I^A i$ et $I^B i$", "$I^A I^A$ et $I^B I^B$", "$I^A I^B$ et $ii$", "$ii$ et $ii$"],
          0,
          "L’enfant $ii$ a nécessairement reçu un allèle $i$ de chacun ; les phénotypes parentaux imposent alors $I^A i$ et $I^B i$.",
        ),
        extraQuestions: [
          choice("Exercice officiel 1, consigne 1 — Quels groupes sanguins apparaissent dans la famille ?", ["A et B seulement", "AB et O seulement", "A, B, AB et O", "Aucun groupe n’est indiqué"], 2, "Le texte cite la mère A, le père B et des enfants AB, B et O.", "Exercice 1, consigne 1 • pages 6-7"),
          choice("Exercice officiel 1 — Quel indice impose le génotype $I^A i$ à la mère de groupe A ?", ["La présence d’un enfant O", "La forme circulaire de son symbole", "Le sexe de l’enfant AB", "Le nombre de filles"], 0, "L’enfant O a reçu $i$ de sa mère et $i$ de son père.", "Exercice 1, consignes 2-3 • pages 6-7"),
          choice("Exercice officiel 1 — Quel génotype doit avoir le père de groupe B ?", ["$I^B I^B$", "$I^A I^B$", "$ii$", "$I^B i$"], 3, "Il doit pouvoir transmettre $i$ aux enfants O.", "Exercice 1, consigne 3 • pages 6-7"),
          choice("Exercice officiel 1 — Quels allèles reçoit la fille AB ?", ["$i$ et $i$", "$I^A$ de la mère et $I^B$ du père", "$I^B$ des deux parents", "$I^A$ des deux parents"], 1, "Son génotype est $I^A I^B$.", "Exercice 1, consigne 3 • page 7"),
          choice("Exercice officiel 1 — Quel génotype explique le garçon de groupe B dans cette famille ?", ["$I^B I^B$", "$I^A i$", "$I^B i$", "$ii$"], 2, "La mère A ne possède pas $I^B$ ; elle transmet donc $i$, tandis que le père transmet $I^B$.", "Exercice 1, consigne 3 • page 7"),
          choice("Exercice officiel 1 — Que reçoivent les deux filles O ?", ["$I^A$ de la mère et $I^B$ du père", "$I^B$ des deux parents", "Un chromosome Y", "$i$ de chacun des deux parents"], 3, "Leur génotype est $ii$.", "Exercice 1, consigne 3 • page 7"),
          choice("Quelle est la probabilité théorique d’un enfant O pour $I^A i × I^B i$ ?", ["0 %", "25 %", "50 %", "100 %"], 1, "Une seule des quatre cases de l’échiquier est $ii$."),
          choice("Dans un pedigree, quel symbole représente traditionnellement un homme ?", ["Un carré", "Un cercle", "Une flèche", "Une lettre sans contour"], 0, "Le document utilise un carré pour les hommes et un cercle pour les femmes.", "Légende de l’arbre généalogique • page 2"),
        ],
        source: sexBloodHereditySource(
          "2-3 et 6-8",
          "Vérification chromosomique, arbre généalogique et exercice officiel 1",
          [
            "La notation manuscrite A/O et B/O est normalisée en $I^A i$ et $I^B i$.",
            "La probabilité de 25 % est rattachée à chaque conception et non à un quota obligatoire dans une fratrie.",
            "Le groupe ABO est présenté comme un outil d’exclusion limitée, jamais comme une preuve suffisante de paternité.",
          ],
        ),
        distractors: ["Le groupe sanguin suffit toujours à connaître un génotype unique.", "Deux parents A et B ne peuvent jamais avoir d’enfant O.", "Une probabilité de 25 % impose exactement un enfant sur quatre dans toute famille."],
      },
      {
        id: "sex-chromosomes",
        title: "Former les gamètes X et Y",
        summary: "Comparer X et Y, repérer leurs régions communes et expliquer comment la méiose répartit les chromosomes sexuels dans les gamètes.",
        conceptTitle: "La méiose sépare X et Y avant la fécondation",
        explanation: "Dans le modèle chromosomique usuel, une cellule XX forme des ovules portant X, tandis qu’une cellule XY forme des spermatozoïdes portant X ou Y. Chaque gamète est haploïde et ne contient qu’un chromosome sexuel.",
        keyPoint: "Par rapport aux chromosomes sexuels : ovules presque toujours X ; spermatozoïdes X ou Y en proportions voisines.",
        example: "Une cellule germinale XY sépare X et Y pendant la méiose ; les spermatozoïdes obtenus ne sont donc pas XY.",
        bodyMarkdown: `
## 1. Situer X et Y dans le caryotype

La plupart des cellules somatiques humaines possèdent **46 chromosomes** : 22 paires d’autosomes et une paire de chromosomes sexuels. Le document compare le modèle typique **XX** et le modèle typique **XY**.

Le chromosome X est nettement plus grand que Y. X et Y ne sont pas entièrement homologues : ils partagent seulement de petites **régions pseudoautosomales**, notamment à leurs extrémités, qui peuvent s’apparier pendant la méiose. Le reste de leurs séquences et de leurs gènes diffère fortement.

> **Précision :** X et Y jouent un rôle central dans le développement sexuel, mais ils ne constituent pas à eux seuls toute la biologie du sexe. D’autres gènes, les hormones et le développement interviennent, et il existe des variations chromosomiques ou du développement sexuel.

## 2. La méiose fabrique des gamètes haploïdes

| Cellule germinale de départ | Séparation pendant la méiose | Gamètes obtenus pour la paire sexuelle |
|---|---|---|
| XX | un chromosome X dans chaque gamète | ovules portant X |
| XY | X et Y se séparent | spermatozoïdes portant X ou spermatozoïdes portant Y |

Le PDF dit que la femme produit « un type de gamète ». Cette phrase signifie **un seul type relativement au chromosome sexuel** : X. Les ovules restent génétiquement différents pour de nombreux autosomes à cause de la répartition des chromosomes et des recombinaisons.

De même, les deux catégories X et Y sont produites en proportions **approximativement** voisines ; on ne doit pas exiger exactement 50 % dans chaque petit échantillon de spermatozoïdes.

## 3. Le réflexe de copie

1. Identifier la cellule diploïde : XX ou XY dans le modèle.
2. Faire séparer les deux chromosomes par méiose.
3. Écrire un seul chromosome sexuel dans chaque gamète.
4. Réserver l’association XX ou XY à la fécondation.

> **Astuce mémoire — XX : une seule lettre possible ; XY : deux lettres possibles.**
`,
        processTitle: "Des cellules parentales aux gamètes",
        processInstruction: "Observe la paire diploïde, puis le seul chromosome sexuel reçu par chaque gamète.",
        process: [
          { label: "Cellule XX", detail: "Les deux chromosomes sexuels sont X dans le modèle typique étudié." },
          { label: "Ovules", detail: "Après méiose, chaque ovule reçoit un X relativement à cette paire." },
          { label: "Cellule XY", detail: "X et Y possèdent de petites régions communes mais diffèrent largement." },
          { label: "Spermatozoïdes", detail: "Après méiose, une catégorie porte X et l’autre Y." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Chromosomes interactifs",
          title: "X et Y : ressemblances limitées, destins séparés",
          instruction: "Sélectionne les repères avant de suivre leur séparation méiotique.",
          viewBox: "0 0 740 430",
          caption: "Figure originale et simplifiée des chromosomes sexuels et de leur répartition dans les gamètes.",
          zones: [
            { label: "Cellule XX", xStart: 0, xEnd: 245 },
            { label: "Cellule XY", xStart: 245, xEnd: 500 },
            { label: "Après méiose", xStart: 500, xEnd: 740 },
          ],
          shapes: [
            { shape: "path", d: "M78 82 C55 118 64 155 100 190 C64 225 55 264 78 302", tone: "outline" },
            { shape: "path", d: "M146 82 C169 118 160 155 124 190 C160 225 169 264 146 302", tone: "outline" },
            { shape: "path", d: "M285 82 C262 118 271 155 307 190 C271 225 262 264 285 302", tone: "outline" },
            { shape: "path", d: "M353 82 C376 118 367 155 331 190 C367 225 376 264 353 302", tone: "outline" },
            { shape: "path", d: "M421 130 C405 152 411 176 435 198 C411 220 405 244 421 266", tone: "soft" },
            { shape: "path", d: "M467 130 C483 152 477 176 453 198 C477 220 483 244 467 266", tone: "soft" },
            { shape: "line", x1: 87, y1: 95, x2: 137, y2: 95, tone: "accent" },
            { shape: "line", x1: 294, y1: 95, x2: 344, y2: 95, tone: "accent" },
            { shape: "line", x1: 427, y1: 141, x2: 461, y2: 141, tone: "accent" },
            { shape: "line", x1: 486, y1: 190, x2: 545, y2: 145, tone: "muted" },
            { shape: "line", x1: 486, y1: 205, x2: 545, y2: 260, tone: "muted" },
            { shape: "circle", cx: 605, cy: 132, r: 47, tone: "soft" },
            { shape: "circle", cx: 605, cy: 276, r: 47, tone: "soft" },
            { shape: "text", x: 112, y: 343, content: "X + X", anchor: "middle" },
            { shape: "text", x: 365, y: 343, content: "X + Y", anchor: "middle" },
            { shape: "text", x: 605, y: 139, content: "X", anchor: "middle" },
            { shape: "text", x: 605, y: 283, content: "Y", anchor: "middle" },
            { shape: "text", x: 605, y: 360, content: "un chromosome par gamète", anchor: "middle" },
          ],
          hotspots: [
            { id: "x-size", number: 1, label: "Chromosome X", detail: "Il est plus grand que Y et porte de nombreux gènes qui ne sont pas présents sur Y.", x: 307, y: 190, highlight: [{ shape: "ellipse", cx: 319, cy: 192, rx: 64, ry: 127, tone: "accent" }] },
            { id: "y-size", number: 2, label: "Chromosome Y", detail: "Il est plus petit ; certaines régions et certains gènes lui sont propres.", x: 444, y: 198, highlight: [{ shape: "ellipse", cx: 444, cy: 198, rx: 52, ry: 84, tone: "accent" }] },
            { id: "par", number: 3, label: "Régions communes", detail: "De petites régions pseudoautosomales permettent l’appariement de X et Y pendant la méiose.", x: 446, y: 141, highlight: [{ shape: "line", x1: 427, y1: 141, x2: 461, y2: 141, tone: "accent" }] },
            { id: "separation", number: 4, label: "Séparation méiotique", detail: "X et Y gagnent des gamètes différents ; aucun spermatozoïde normal ne porte les deux à la fois.", x: 545, y: 205, highlight: [{ shape: "path", d: "M486 190 L545 145 M486 205 L545 260", tone: "accent" }] },
          ],
          observation: "Le document montre un petit segment commun ; il ne faut pas en conclure que X et Y sont homologues sur toute leur longueur.",
        },
        observation: "La séparation des chromosomes crée une probabilité biologique ; elle n’est ni un choix conscient ni une action dirigée par le parent.",
        check: choice(
          "Quels types de spermatozoïdes sont produits relativement aux chromosomes sexuels ?",
          ["Des spermatozoïdes X et des spermatozoïdes Y", "Uniquement des spermatozoïdes X", "Uniquement des spermatozoïdes Y", "Des spermatozoïdes XX"],
          0,
          "La méiose sépare X et Y : chaque spermatozoïde haploïde reçoit l’un ou l’autre, jamais les deux dans le cas normal.",
        ),
        extraQuestions: [
          choice("Combien de paires d’autosomes possède typiquement une cellule somatique humaine ?", ["Une", "Vingt-deux", "Vingt-trois chromosomes Y", "Quarante-six paires"], 1, "Les 22 premières paires sont des autosomes ; la 23e est la paire sexuelle."),
          trueFalse("Les chromosomes X et Y sont identiques sur toute leur longueur.", false, "Ils ne partagent que de petites régions pseudoautosomales et diffèrent largement ailleurs.", "Document 1 • pages 4 et 7"),
          choice("Quand le PDF dit que la femme XX produit « un type de gamète », que faut-il comprendre ?", ["Tous ses ovules sont génétiquement identiques", "Ses ovules ne contiennent aucun autosome", "Ses ovules portent X relativement à la paire sexuelle", "Elle produit des ovules Y"], 2, "La formule ne concerne que X/Y ; les autosomes recombinés rendent les ovules génétiquement variés."),
          choice("Quel chromosome sexuel un spermatozoïde haploïde porte-t-il normalement ?", ["Toujours X et Y ensemble", "Deux X", "Aucun", "X ou Y"], 3, "La méiose sépare X et Y dans des gamètes différents."),
          choice("Quel est le rôle général de la méiose ?", ["Doubler le nombre de chromosomes des gamètes", "Réduire de moitié le nombre de chromosomes et créer de la diversité", "Transformer tous les gamètes en cellules XX", "Supprimer les autosomes"], 1, "La méiose produit des gamètes haploïdes et remanie les combinaisons génétiques."),
          choice("À quoi servent les régions pseudoautosomales de X et Y pendant la méiose ?", ["À produire les antigènes ABO", "À choisir le sexe de l’enfant", "À permettre un appariement et une recombinaison limités", "À rendre X et Y entièrement identiques"], 2, "Ces petites régions homologues s’apparient ; le reste des chromosomes diffère."),
          trueFalse("Le modèle XX-XY décrit toutes les variations possibles du développement sexuel humain sans exception.", false, "C’est le modèle central du cours ; des variations chromosomiques, génétiques ou hormonales existent."),
        ],
        source: sexBloodHereditySource(
          "3-4 et 7",
          "Document 1 sur les chromosomes sexuels et interprétation de la méiose",
          [
            "La « partie inexistante sur Y » est explicitée en régions propres à X et en petites régions pseudoautosomales partagées.",
            "La formule « un type de gamète » chez la femme est limitée au chromosome sexuel X ; les ovules restent différents pour de nombreux autosomes.",
            "Le modèle XX-XY est présenté comme le modèle typique étudié et non comme la description exhaustive de toutes les variations du développement sexuel.",
          ],
        ),
        distractors: ["L’ovule porte normalement un chromosome Y.", "Une cellule XX produit des ovules X ou Y.", "Le sexe chromosomique est choisi consciemment avant la méiose."],
      },
      {
        id: "sex-cross",
        title: "Interpréter l’échiquier XX-XY",
        summary: "Construire l’échiquier XX-XY, relier chaque chromosome parental aux deux issues et interpréter correctement la probabilité de 1/2.",
        conceptTitle: "La fécondation réunit au hasard un ovule X et un spermatozoïde X ou Y",
        explanation: "L’ovule apporte presque toujours X ; le spermatozoïde fécondant apporte X ou Y. L’échiquier scolaire donne donc environ $1/2$ XX et $1/2$ XY à chaque conception, sans ordre obligatoire dans une famille.",
        keyPoint: "X ovulaire + X spermatique → XX ; X ovulaire + Y spermatique → XY, avec deux possibilités théoriquement équiprobables.",
        example: "Après trois naissances XX, une nouvelle fécondation conserve environ une chance sur deux de produire XX ou XY dans le modèle simple.",
        bodyMarkdown: `
## 1. Construire l’échiquier

Relativement aux chromosomes sexuels, les ovules portent X. Les spermatozoïdes portent X ou Y en proportions voisines.

| Ovule / Spermatozoïde | X | Y |
|---|---|---|
| X | XX — modèle chromosomique féminin | XY — modèle chromosomique masculin |

Le tableau du PDF duplique la ligne X pour matérialiser deux ovules possibles, mais ces deux lignes donnent le même résultat. Le bilan théorique reste **50 % XX et 50 % XY**.

## 2. Réussir l’activité de reliage

- Le chromosome **X du père** peut conduire à une descendance XX dans le modèle.
- Le chromosome **Y du père** conduit à une descendance XY dans le modèle.
- Le chromosome **X de la mère** intervient dans les deux issues : XX et XY.

La correction source relie donc le X maternel à la fille **et** au garçon. L’ovule n’est pas l’élément variable de cet échiquier.

## 3. Remplacer « responsabilité » par « contribution aléatoire »

La phrase du PDF « c’est au père qu’incombe la responsabilité » peut être mal comprise. Scientifiquement, **le spermatozoïde fécondant apporte le chromosome X ou Y qui différencie les deux cases**. Aucun parent ne choisit quel spermatozoïde féconde l’ovule ; il n’y a donc ni faute, ni volonté, ni mérite.

## 4. Probabilité n’est pas alternance

Les conceptions successives sont indépendantes dans ce modèle. La naissance précédente ne « consomme » pas une case de l’échiquier. Une famille peut avoir plusieurs enfants du même sexe chromosomique sans contredire la probabilité.

À l’échelle d’une petite famille, les proportions peuvent s’écarter fortement de 50/50. L’équiprobabilité est un **modèle de fécondation**, pas la promesse d’une égalité exacte dans chaque fratrie ni dans chaque échantillon biologique.

> **Astuce mémoire — Mère : X fixe ; père : X ou Y ; hasard : nouvelle rencontre à chaque fois.**
`,
        processTitle: "Rencontre aléatoire des gamètes",
        processInstruction: "Pars de l’ovule X puis ouvre les deux branches spermatiques possibles.",
        process: [
          { label: "Ovule X + spermatozoïde X", shortLabel: "X + X", detail: "Le zygote possède la combinaison XX." },
          { label: "Ovule X + spermatozoïde Y", shortLabel: "X + Y", detail: "Le zygote possède la combinaison XY." },
          { label: "Bilan théorique", shortLabel: "Bilan", detail: "Dans l’échiquier simple, les deux possibilités ont une probabilité voisine de $1/2$." },
          { label: "Interprétation", detail: "Le chromosome variable vient du spermatozoïde, sans décision consciente du père." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Échiquier raisonné",
          title: "Un X ovulaire, deux branches spermatiques",
          instruction: "Ouvre les branches dans l’ordre et formule le bilan sans parler de choix parental.",
          rootLabel: "Ovule X",
          rootDetail: "Relativement à la paire sexuelle, l’ovule fournit X aux deux issues du modèle.",
          nodes: [
            { id: "sperm-x", label: "Spermatozoïde X", role: "Première branche", detail: "Sa fusion avec l’ovule X forme un zygote XX.", group: "Fécondation" },
            { id: "zygote-xx", label: "Zygote XX", role: "Issue théorique", detail: "Il correspond au modèle chromosomique féminin présenté dans le document.", group: "Résultat" },
            { id: "sperm-y", label: "Spermatozoïde Y", role: "Deuxième branche", detail: "Sa fusion avec l’ovule X forme un zygote XY.", group: "Fécondation" },
            { id: "zygote-xy", label: "Zygote XY", role: "Issue théorique", detail: "Il correspond au modèle chromosomique masculin présenté dans le document.", group: "Résultat" },
            { id: "equal", label: "Environ 1/2 — 1/2", role: "Bilan", detail: "Les deux catégories spermatiques ont des chances voisines de participer à la fécondation.", group: "Probabilité" },
            { id: "independent", label: "Nouvelle conception", role: "Indépendance", detail: "Le résultat précédent ne modifie pas la probabilité de la rencontre suivante.", group: "Probabilité" },
          ],
          observation: "Le bon vocabulaire est « contribution chromosomique du spermatozoïde fécondant », pas « décision » ou « culpabilité du père ».",
        },
        observation: "Les naissances précédentes ne modifient pas la probabilité chromosomique de la fécondation suivante.",
        check: choice(
          "Quel gamète apporte le chromosome qui différencie XX de XY dans l’échiquier ?",
          ["Le spermatozoïde", "L’ovule", "Le globule rouge", "Le neurone"],
          0,
          "L’ovule apporte X dans les deux issues ; le spermatozoïde fécondant apporte X ou Y.",
        ),
        extraQuestions: [
          choice("Activité officielle — À quelle issue faut-il relier le chromosome X paternel ?", ["À XY uniquement", "À XX", "À aucun zygote", "Au groupe sanguin O"], 1, "X paternel + X maternel donne XX.", "Activité d’application • page 5"),
          choice("Activité officielle — À quelle issue faut-il relier le chromosome Y paternel ?", ["À XX", "Aux groupes A et B", "À XY", "À tous les ovules sans fécondation"], 2, "Y paternel + X maternel donne XY.", "Activité d’application • page 5"),
          choice("Activité officielle — À quelles issues le chromosome X maternel participe-t-il ?", ["À XX seulement", "À XY seulement", "À aucune", "À XX et à XY"], 3, "L’ovule X figure dans les deux rencontres de l’échiquier.", "Activité d’application et corrigé • page 5"),
          choice("Après la naissance de trois enfants XX, quelle est la probabilité théorique de XY à la conception suivante ?", ["Elle reste voisine de 1/2", "Elle devient 100 %", "Elle devient nulle", "Elle dépend du groupe ABO"], 0, "Chaque conception constitue une nouvelle rencontre aléatoire."),
          trueFalse("L’échiquier impose une alternance fille-garçon dans chaque famille.", false, "Il donne des probabilités pour chaque conception, pas un calendrier des naissances."),
          choice("Quelle reformulation scientifique remplace le mieux « le père est responsable du sexe » ?", ["Le père choisit X ou Y", "La mère décide après la fécondation", "Le spermatozoïde fécondant apporte X ou Y sans contrôle volontaire", "Le groupe sanguin du père impose XX ou XY"], 2, "La contribution chromosomique est aléatoire et ne justifie aucun blâme.", "Interprétation et conclusion • pages 4-5"),
          trueFalse("Une proportion proche de 50/50 dans un modèle signifie que chaque petit échantillon doit être exactement équilibré.", false, "Les fluctuations aléatoires sont normales dans une petite famille ou un petit échantillon."),
          choice("Quelle donnée n’intervient pas dans l’échiquier XX-XY étudié ?", ["Le chromosome X de l’ovule", "Le groupe sanguin ABO des parents", "Le chromosome X d’un spermatozoïde", "Le chromosome Y d’un spermatozoïde"], 1, "Le groupe ABO correspond à un autre gène et à un autre échiquier."),
        ],
        source: sexBloodHereditySource(
          "4-5 et 7",
          "Document 2, échiquier XX-XY, interprétation et activité de reliage",
          [
            "La phrase « c’est au père qu’incombe la responsabilité » est reformulée en contribution chromosomique aléatoire du spermatozoïde, sans choix, faute ni mérite.",
            "L’égalité 50/50 est présentée comme probabilité théorique par conception, non comme répartition obligatoire dans chaque famille.",
            "Le mot « garçon » mal orthographié « graçon » dans le tableau source est corrigé.",
          ],
        ),
        distractors: ["Le père décide volontairement du chromosome porté par un spermatozoïde.", "Après deux filles, un garçon devient certain.", "Une fécondation XX nécessite un ovule Y."],
      },
    ],
    mission: {
      title: "Expertiser deux dossiers : échiquier XX-XY et famille ABO",
      scenario: "Pour préparer son concours de sage-femme, une candidate doit expliquer l’échiquier XX-XY de la situation d’évaluation, puis l’arbre d’une famille où une mère A et un père B ont des enfants AB, B et O. Aide-la à produire deux raisonnements complets et prudents.",
      problem: "Comment identifier les gamètes et les génotypes, dresser les bilans puis formuler les limites de chacun des deux modèles ?",
      bodyMarkdown: `
## Dossier A — La situation d’évaluation officielle

Le document est un **échiquier de croisement**. Les colonnes représentent les spermatozoïdes X et Y ; les lignes, des ovules X. Il faut répondre aux quatre consignes dans l’ordre.

1. **Identifier :** un échiquier de croisement des chromosomes sexuels.
2. **Relever les gamètes :** spermatozoïdes X ou Y ; ovules X relativement à cette paire.
3. **Faire le bilan :** deux cases XX et deux cases XY, soit 50 % XX et 50 % XY dans le modèle.
4. **Expliquer :** l’ovule apporte X dans les deux cas ; le chromosome variable X ou Y est apporté par le spermatozoïde fécondant.

> **Correction de consigne :** le PDF demande le « bilan des femmes et des garçons ». Il faut lire le **bilan des filles et des garçons**, ou plus rigoureusement celui des zygotes XX et XY dans le modèle.

Une réponse respectueuse ajoute que cette contribution est aléatoire : aucun parent ne choisit le spermatozoïde fécondant.

## Dossier B — L’exercice familial ABO

La mère est A, le père B ; les enfants sont AB, B, O et O. La présence d’enfants O révèle immédiatement $i$ chez chaque parent :

$$I^A i × I^B i$$

| Enfant | Génotype expliqué | Origine des allèles |
|---|---|---|
| AB | $I^A I^B$ | $I^A$ maternel et $I^B$ paternel |
| B | $I^B i$ | $i$ maternel et $I^B$ paternel |
| O | $ii$ | $i$ maternel et $i$ paternel |

Le pedigree utilise un cercle pour une femme, un carré pour un homme, une ligne horizontale pour le couple et une ligne verticale puis horizontale pour la descendance.

## La conclusion de haut niveau

Les deux dossiers utilisent une méiose, des gamètes et une fécondation, mais ils répondent à des questions différentes. Le premier suit X et Y ; le second suit le locus ABO autosomal. Leurs probabilités ne prédisent jamais l’ordre exact des enfants.

Le groupe ABO ne suffit ni à certifier une transfusion complète ni à prouver une paternité. L’échiquier XX-XY, lui, explique une contribution chromosomique habituelle sans résumer toute la diversité du développement sexuel humain.

> **Davy te donne la phrase de copie :** « J’identifie le document, je relève les gamètes, je combine les allèles ou chromosomes, je fais le bilan, puis j’annonce la portée et la limite du modèle. »
`,
      investigation: [
        { label: "Identifier les documents", shortLabel: "Identifier", detail: "Reconnaître un échiquier XX-XY et un arbre généalogique portant les groupes ABO." },
        { label: "Relever les gamètes", shortLabel: "Gamètes", detail: "X pour l’ovule, X ou Y pour le spermatozoïde ; $I^A$ ou $i$ chez la mère, $I^B$ ou $i$ chez le père." },
        { label: "Combiner", detail: "Construire séparément l’échiquier chromosomique et l’échiquier ABO." },
        { label: "Faire les bilans", shortLabel: "Bilans", detail: "XX/XY à environ 1/2 ; A/B/AB/O à 1/4 dans le croisement familial." },
        { label: "Annoncer les limites", shortLabel: "Limites", detail: "Probabilités sans ordre certain, pas de choix parental, ABO insuffisant pour prouver une paternité ou garantir seul une transfusion." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Double enquête",
        title: "Un protocole commun, deux preuves distinctes",
        instruction: "Ouvre les cartes des deux dossiers puis termine par les limites.",
        rootLabel: "Fécondation",
        rootDetail: "Elle réunit les patrimoines maternel et paternel ; le caractère suivi détermine les symboles et le bilan.",
        nodes: [
          { id: "sex-document", label: "Échiquier XX-XY", role: "Identifier", detail: "Ovule X croisé avec spermatozoïde X ou Y.", group: "Dossier A" },
          { id: "sex-result", label: "1/2 XX — 1/2 XY", role: "Bilan théorique", detail: "Le chromosome variable est apporté aléatoirement par le spermatozoïde.", group: "Dossier A" },
          { id: "abo-document", label: "Pedigree A × B", role: "Identifier", detail: "Les enfants O révèlent $i$ chez les deux parents.", group: "Dossier B" },
          { id: "abo-result", label: "$I^A i × I^B i$", role: "Bilan génétique", detail: "Les quatre phénotypes A, B, AB et O sont possibles avec $1/4$ chacun.", group: "Dossier B" },
          { id: "probability-limit", label: "Hasard à chaque conception", role: "Limite", detail: "Aucune fratrie n’est tenue de reproduire exactement les pourcentages.", group: "Prudence" },
          { id: "social-limit", label: "Ni preuve ni faute", role: "Prudence", detail: "ABO ne prouve pas une paternité ; X/Y ne dépend pas d’un choix du père.", group: "Prudence" },
        ],
        observation: "Une excellente réponse sépare les deux caractères, montre les calculs et annonce explicitement ce que les documents ne permettent pas de conclure.",
      },
      modelAnswer: "Le document A est un échiquier XX-XY : les ovules portent X et les spermatozoïdes X ou Y, d’où environ 50 % XX et 50 % XY sans choix parental. Dans le dossier B, les enfants O imposent $I^A i$ chez la mère et $I^B i$ chez le père ; l’échiquier explique AB, A, B et O avec $1/4$ chacun. Ces probabilités ne fixent pas l’ordre des naissances et le groupe ABO ne prouve pas une paternité.",
      questions: [
        choice("Situation officielle, consigne 1 — Quel est le document présenté à la candidate ?", ["Un dosage hormonal", "Un arbre ABO", "Un échiquier de croisement XX-XY", "Une courbe de croissance"], 2, "Les lignes et colonnes combinent les gamètes X et Y.", "Situation d’évaluation, consigne 1 • pages 5-6"),
        choice("Situation officielle, consigne 2 — Quels gamètes faut-il relever ?", ["Ovules X ; spermatozoïdes X ou Y", "Ovules X ou Y ; spermatozoïdes X seulement", "Ovules et spermatozoïdes XX", "Globules rouges A ou B"], 0, "La méiose produit des ovules X et deux catégories spermatiques, X ou Y.", "Situation d’évaluation, consigne 2 • page 6"),
        choice("Situation officielle, consigne 3 — Quel bilan donne l’échiquier ?", ["100 % XX", "25 % XX et 75 % XY", "Un résultat dépendant du groupe ABO", "Environ 50 % XX et 50 % XY"], 3, "Deux cases sur quatre sont XX et deux sont XY.", "Situation d’évaluation, consigne 3 • page 6"),
      ],
      extraQuestions: [
        choice("Situation officielle, consigne 4 — Pourquoi le spermatozoïde différencie-t-il les deux issues ?", ["Il apporte X ou Y alors que l’ovule apporte X", "Il choisit consciemment le sexe", "Il transmet seul tous les chromosomes", "Il modifie le groupe ABO après la naissance"], 0, "Le chromosome variable de l’échiquier est celui du spermatozoïde fécondant.", "Situation d’évaluation, consigne 4 • page 6"),
        choice("Exercice officiel 1 — Quels sont les quatre groupes révélés par le texte ?", ["A et O seulement", "A, B, AB et O", "X, Y, XX et XY", "Rh+ et Rh− seulement"], 1, "Les quatre phénotypes ABO usuels sont présents dans la famille.", "Exercice 1, consigne 1 • pages 6-7"),
        choice("Quel génotype maternel explique les enfants O ?", ["$I^A I^A$", "$I^A I^B$", "$I^A i$", "$ii$"], 2, "La mère A doit porter $i$ pour le transmettre.", "Exercice 1, consigne 3 • page 7"),
        choice("Quel génotype paternel explique les enfants O ?", ["$I^A i$", "$I^B I^B$", "$ii$", "$I^B i$"], 3, "Le père B doit également porter et transmettre $i$.", "Exercice 1, consigne 3 • page 7"),
        choice("Quel génotype possède l’enfant B de cette famille ?", ["$I^B i$", "$I^B I^B$", "$I^A I^B$", "$ii$"], 0, "La mère A ne peut lui transmettre que $i$ pour obtenir le groupe B.", "Exercice 1, consigne 3 • page 7"),
        trueFalse("Des groupes ABO compatibles suffisent à établir avec certitude une paternité.", false, "Ils peuvent seulement exclure certains cas ; de nombreux marqueurs ADN sont nécessaires pour établir une parenté."),
        choice("Quelle précaution complète le typage ABO avant une transfusion ?", ["Regarder uniquement le sexe du donneur", "Vérifier notamment RhD, anticorps et compatibilité donneur-receveur", "Compter les enfants du donneur", "Construire l’échiquier XX-XY"], 1, "La sécurité transfusionnelle ne repose jamais sur la seule lettre ABO."),
        choice("Quelle conclusion relie correctement les deux dossiers ?", ["Les deux échiquiers donnent un ordre obligatoire des naissances", "Le chromosome Y porte les allèles ABO", "Chaque échiquier prévoit des probabilités pour un caractère distinct", "Le groupe O impose le modèle XX"], 2, "ABO et XX-XY sont des transmissions distinctes réunies lors de la même fécondation."),
      ],
      source: sexBloodHereditySource(
        "5-7",
        "Situation d’évaluation officielle, corrigé et exercice familial 1",
        [
          "La consigne « fait le bilan » est corrigée en « fais le bilan » et « bilan des femmes et des garçons » en « bilan des filles et des garçons », puis précisée en zygotes XX/XY.",
          "La responsabilité attribuée au père est reformulée en contribution chromosomique aléatoire du spermatozoïde.",
          "Les génotypes des parents et des enfants sont explicités avec la notation $I^A$, $I^B$, $i$ afin de compléter le corrigé source.",
        ],
      ),
    },
  };

export const terminalASvtSexBloodHeredityPath = createSvtPath(course);
