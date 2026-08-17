import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { q, choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const proteinBiosynthesisSource = createSvtSource("SVT TA_L7_La biosynthèse des protéines.pdf");

const course: SvtCourseSeed = {
    id: "terminale-svt-l7-protein-biosynthesis",
    chapterNumber: 7,
    themeNumber: 4,
    themeTitle: "Expression de l’information génétique",
    title: "La biosynthèse des protéines",
    description: "Identifier les acteurs, lire le code génétique et suivre transcription puis traduction jusqu’à la chaîne polypeptidique.",
    centralQuestion: "Comment l’information portée par l’ADN détermine-t-elle l’ordre des acides aminés d’une protéine ?",
    memorySentence: "ADN — transcription → ARNm — traduction au ribosome avec ARNt → chaîne polypeptidique.",
    overviewBodyMarkdown: `
## Une protéine n’est jamais assemblée au hasard

Une **protéine** est une molécule constituée d’une ou plusieurs chaînes d’**acides aminés**. L’ordre de ces acides aminés dépend d’une information portée par un gène de l’ADN. Dans une cellule eucaryote, l’ADN reste principalement dans le noyau : une copie temporaire, l’**ARN messager** ou ARNm, transporte l’information vers les ribosomes du cytoplasme.

Le passage de l’information à la protéine se fait en deux grandes étapes :

$$
\\mathrm{ADN} \\xrightarrow[\\mathrm{noyau}]{\\mathrm{transcription}} \\mathrm{ARNm}
\\xrightarrow[\\mathrm{ribosome}]{\\mathrm{traduction}} \\mathrm{polypeptide}
$$

| Étape | Lieu simplifié | Molécule lue | Produit obtenu | Acteur central |
|---|---|---|---|---|
| **Transcription** | noyau | un brin matrice d’ADN | un ARNm complémentaire | ARN polymérase |
| **Traduction** | cytoplasme, sur un ribosome | l’ARNm par groupes de trois nucléotides | une chaîne d’acides aminés | ribosome et ARNt |

## Les quatre questions du cours

1. **Quels sont les acteurs ?** ADN, trois catégories d’ARN, ribosome et acides aminés.
2. **Comment lire le message ?** Le code génétique associe chaque codon de l’ARNm à un acide aminé ou à un signal d’arrêt.
3. **Comment copier un gène ?** L’ARN polymérase synthétise un ARNm complémentaire du brin matrice.
4. **Comment assembler la protéine ?** Le ribosome lit l’ARNm de 5′ vers 3′ ; les ARNt apportent les acides aminés dans l’ordre des codons.

## Le vocabulaire qui évite les confusions

| Mot | Définition précise |
|---|---|
| **gène** | portion d’ADN dont l’information contribue à la production d’un ARN fonctionnel et, pour un gène codant, d’une protéine |
| **codon** | triplet de **nucléotides de l’ARNm** |
| **anticodon** | triplet de l’ARNt complémentaire d’un codon |
| **polypeptide** | chaîne d’acides aminés reliés par des liaisons peptidiques |
| **protéine** | molécule fonctionnelle issue d’une ou plusieurs chaînes polypeptidiques repliées et parfois modifiées |

> **Astuce mémoire — CCT :** **C**opier le gène, **C**ouper le message en codons, **T**raduire en acides aminés.

La situation d’apprentissage introductive du PDF n’est pas reproduite. Ses objectifs sont transformés ici en une carte claire, tandis que les activités d’application et les situations d’évaluation sont conservées après les parties de cours.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte interactive",
      title: "De l’information génétique à la protéine",
      instruction: "Ouvre les cartes dans l’ordre pour suivre le trajet de l’information.",
      rootLabel: "Expression d’un gène",
      rootDetail: "Une information de l’ADN est copiée en ARNm puis traduite en une séquence précise d’acides aminés.",
      nodes: [
        { id: "gene", label: "1. Gène dans l’ADN", role: "Information", detail: "Une portion d’ADN contient une séquence de nucléotides dont l’ordre porte l’information.", group: "Noyau" },
        { id: "rna-polymerase", label: "2. ARN polymérase", role: "Copier", detail: "Elle lit le brin matrice et assemble un ARN complémentaire dans le sens 5’ vers 3’.", group: "Noyau" },
        { id: "mrna", label: "3. ARNm", role: "Message", detail: "Il transporte une copie lisible de l’information vers le cytoplasme.", group: "Passage" },
        { id: "ribosome", label: "4. Ribosome", role: "Lire", detail: "Il avance sur l’ARNm codon après codon et organise l’assemblage.", group: "Cytoplasme" },
        { id: "trna", label: "5. ARNt", role: "Adapter", detail: "Son anticodon reconnaît un codon et il apporte l’acide aminé correspondant.", group: "Cytoplasme" },
        { id: "protein", label: "6. Polypeptide", role: "Produit", detail: "Les acides aminés sont reliés dans un ordre déterminé par la séquence de l’ARNm.", group: "Cytoplasme" },
      ],
      observation: "L’ADN ne se transforme pas en protéine : l’information change de support, d’abord vers l’ARNm puis vers l’ordre des acides aminés.",
    },
    overviewExtraQuestions: [
      choice("Quel enchaînement résume l’expression d’un gène codant ?", ["ARNm → ADN → protéine", "ADN → ARNm → chaîne polypeptidique", "Protéine → ARNt → ADN", "Ribosome → ADN → ARNm"], 1, "La transcription produit l’ARNm, puis la traduction produit la chaîne polypeptidique."),
      choice("Où se déroule la transcription dans le modèle de cellule eucaryote du cours ?", ["Dans le noyau", "Dans le site A du ribosome", "Dans la membrane plasmique", "Dans les globules rouges uniquement"], 0, "L’ADN nucléaire sert de matrice à l’ARN polymérase."),
      choice("Où se déroule la traduction ?", ["Sur l’ADN dans le noyau", "Dans le nucléole uniquement", "Sur les ribosomes du cytoplasme", "Dans les chromosomes"], 2, "Les ribosomes lisent l’ARNm dans le cytoplasme, libres ou associés au réticulum endoplasmique rugueux."),
      choice("Quelle molécule sert d’intermédiaire entre l’ADN et le ribosome ?", ["Le glucose", "L’ARNm", "Le glycogène", "Le cholestérol"], 1, "L’ARNm porte la copie du message génétique utilisable par le ribosome."),
      trueFalse("Un codon est un triplet de nucléotides de l’ARNm.", true, "Le PDF parle à tort de trois « acides nucléiques » ; un codon réunit trois nucléotides."),
      choice("Qu’est-ce qui détermine directement l’ordre des acides aminés ?", ["La taille du noyau", "La couleur du ribosome", "Le nombre de chromosomes seulement", "L’ordre des codons dans le cadre de lecture de l’ARNm"], 3, "Chaque codon lu dans le bon cadre correspond à un acide aminé ou à un signal stop."),
      choice("Quelle formule mémoire permet de retrouver le raisonnement ?", ["CCT : copier, couper en codons, traduire", "RAT : respirer, absorber, transpirer", "MCR : muscle, cœur, rein", "ABO : ADN, base, organe"], 0, "CCT résume les trois opérations à appliquer à une séquence."),
    ],
    overviewSource: proteinBiosynthesisSource(
      "1-8",
      "Problématique, acteurs, code génétique, mécanisme et conclusion générale",
      [
        "La situation d’apprentissage introductive est retirée ; ses objectifs deviennent la carte de la leçon.",
        "La formule « associations de 3 acides nucléiques » est corrigée en triplets de nucléotides de l’ARNm.",
        "Le code génétique est présenté comme quasi universel, car quelques exceptions existent notamment dans certains génomes mitochondriaux.",
        "Le passage ADN → ARNm → polypeptide est distingué d’une transformation matérielle de l’ADN en protéine.",
      ],
    ),
    sections: [
      {
        id: "molecular-actors",
        title: "Identifier les acteurs",
        summary: "Distinguer ADN, ARNm, ARNt, ARNr, ribosome et acides aminés par leur rôle.",
        conceptTitle: "Chaque acteur transporte une partie de l’information ou réalise une étape",
        explanation: "L’ADN bicaténaire conserve l’information dans le noyau. L’ARNm en porte une copie vers le cytoplasme. L’ARNt associe un anticodon à un acide aminé. L’ARNr, avec des protéines, constitue le ribosome, machine qui lit l’ARNm et assemble les acides aminés.",
        keyPoint: "ADN = information ; ARNm = message ; ARNt = adaptateur ; ribosome = lecture et assemblage ; acides aminés = unités de la protéine.",
        example: "Un ARNt portant l’anticodon complémentaire du codon AUG apporte la méthionine au début de la traduction.",
        bodyMarkdown: `
## 1. L’ADN conserve l’information

L’**acide désoxyribonucléique** est constitué de deux brins complémentaires et antiparallèles. Dans la cellule eucaryote étudiée, il est contenu principalement dans le noyau. Ses nucléotides portent les bases A, T, C et G.

Un **gène** est une portion d’ADN. Pour fabriquer une protéine, la cellule n’envoie pas la molécule d’ADN entière au ribosome : elle en produit une copie sous forme d’ARN messager.

## 2. Trois ARN, trois fonctions complémentaires

| Molécule | Structure utile | Fonction dans la synthèse |
|---|---|---|
| **ARNm** | brin portant des codons | transporte la copie du message et sert de matrice au ribosome |
| **ARNt** | ARN replié avec un anticodon et un site de fixation | reconnaît un codon et apporte l’acide aminé correspondant |
| **ARNr** | ARN associé à des protéines | forme l’essentiel de la structure et du centre catalytique du ribosome |

Les ARN contiennent A, U, C et G : l’**uracile U** remplace la thymine T de l’ADN. Dire que tout ARN est toujours un simple fil rectiligne serait trompeur : il est monocaténaire au sens où il ne forme pas une double hélice régulière comme l’ADN, mais il peut se replier sur lui-même, en particulier l’ARNt et l’ARNr.

## 3. Le ribosome organise la traduction

Le ribosome possède une **petite sous-unité** et une **grande sous-unité**. Il maintient ensemble l’ARNm et les ARNt, vérifie la reconnaissance codon-anticodon et facilite la formation des liaisons peptidiques.

Le ribosome n’est donc ni un entrepôt de gènes ni le transporteur des acides aminés. Ces rôles appartiennent respectivement à l’ADN et aux ARNt.

## 4. Les acides aminés deviennent un polypeptide

Les acides aminés sont les unités assemblées. Une **liaison peptidique** se forme entre deux acides aminés successifs. La chaîne ainsi obtenue est un polypeptide ; elle doit ensuite se replier et peut subir des modifications pour devenir une protéine fonctionnelle.

| Compartiment | Événement majeur du modèle scolaire |
|---|---|
| noyau | conservation de l’ADN et transcription du gène |
| pore nucléaire | passage de l’ARNm vers le cytoplasme |
| cytoplasme | traduction par les ribosomes avec les ARNt |

> **Astuce mémoire — MTR :** **M**essager = message ; **T**ransfert = transport de l’acide aminé ; **R**ibosomal = ribosome.

> **Point de précision :** le schéma du PDF représente l’ARNm sortant directement après sa synthèse. Dans une cellule eucaryote, le transcrit subit normalement une maturation avant d’être exporté ; ce détail n’est pas exigé par l’activité, mais il évite de confondre transcrit initial et ARNm utilisable.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Cellule redessinée",
          title: "Situer les acteurs de la biosynthèse",
          instruction: "Sélectionne les repères pour suivre le message du noyau jusqu’au polypeptide.",
          viewBox: "0 0 760 440",
          caption: "Figure originale inspirée du schéma des acteurs de la page 2 ; aucune image du PDF n’est republiée.",
          shapes: [
            { shape: "ellipse", cx: 380, cy: 230, rx: 330, ry: 175, tone: "outline" },
            { shape: "ellipse", cx: 235, cy: 220, rx: 120, ry: 105, tone: "soft" },
            { shape: "path", d: "M155 220 C175 150 205 290 225 220 C245 150 275 290 300 220", tone: "accent" },
            { shape: "path", d: "M275 245 C330 245 340 180 405 180 C455 180 470 225 515 225", tone: "outline" },
            { shape: "ellipse", cx: 545, cy: 225, rx: 76, ry: 43, tone: "soft" },
            { shape: "ellipse", cx: 545, cy: 215, rx: 52, ry: 28, tone: "accent" },
            { shape: "path", d: "M430 315 C448 280 465 350 482 315 C500 280 518 350 535 315", tone: "outline" },
            { shape: "circle", cx: 580, cy: 320, r: 15, tone: "accent" },
            { shape: "circle", cx: 615, cy: 335, r: 15, tone: "soft" },
            { shape: "circle", cx: 647, cy: 314, r: 15, tone: "accent" },
            { shape: "line", x1: 590, y1: 327, x2: 604, y2: 333, tone: "outline" },
            { shape: "line", x1: 630, y1: 329, x2: 637, y2: 319, tone: "outline" },
            { shape: "text", x: 235, y: 105, content: "NOYAU", anchor: "middle" },
            { shape: "text", x: 515, y: 105, content: "CYTOPLASME", anchor: "middle" },
            { shape: "text", x: 225, y: 345, content: "ADN", anchor: "middle" },
            { shape: "text", x: 400, y: 160, content: "ARNm", anchor: "middle" },
            { shape: "text", x: 545, y: 175, content: "ribosome", anchor: "middle" },
            { shape: "text", x: 478, y: 375, content: "ARNt", anchor: "middle" },
            { shape: "text", x: 615, y: 375, content: "polypeptide", anchor: "middle" },
          ],
          hotspots: [
            { id: "dna", number: 1, label: "ADN", detail: "Deux brins complémentaires conservent les gènes dans le noyau.", x: 225, y: 220, highlight: [{ shape: "ellipse", cx: 225, cy: 220, rx: 88, ry: 82, tone: "accent" }] },
            { id: "mrna", number: 2, label: "ARN messager", detail: "Copie transitoire du gène, il sort du noyau et présente ses codons au ribosome.", x: 390, y: 180, highlight: [{ shape: "ellipse", cx: 394, cy: 204, rx: 108, ry: 48, tone: "accent" }] },
            { id: "ribosome", number: 3, label: "Ribosome", detail: "Ses deux sous-unités maintiennent l’ARNm et les ARNt pendant l’assemblage.", x: 545, y: 225, highlight: [{ shape: "ellipse", cx: 545, cy: 225, rx: 86, ry: 55, tone: "accent" }] },
            { id: "trna", number: 4, label: "ARN de transfert", detail: "Il porte un acide aminé et reconnaît un codon grâce à son anticodon.", x: 480, y: 315, highlight: [{ shape: "ellipse", cx: 480, cy: 315, rx: 68, ry: 48, tone: "accent" }] },
            { id: "chain", number: 5, label: "Chaîne polypeptidique", detail: "Les acides aminés sont reliés dans l’ordre imposé par les codons de l’ARNm.", x: 615, y: 320, highlight: [{ shape: "ellipse", cx: 615, cy: 323, rx: 75, ry: 42, tone: "accent" }] },
          ],
          observation: "Chaque acteur a un rôle distinct : conserver, copier, transporter, lire ou assembler.",
        },
        processTitle: "Qui fait quoi ?",
        processInstruction: "Associe chaque molécule à sa fonction principale.",
        process: [
          { label: "ADN", detail: "Support stable des gènes ; deux brins complémentaires dans le noyau." },
          { label: "ARN messager", shortLabel: "ARNm", detail: "Copie temporaire d’un gène, lue par codons." },
          { label: "ARN de transfert", shortLabel: "ARNt", detail: "Porte un acide aminé et reconnaît un codon grâce à son anticodon." },
          { label: "Ribosome", detail: "Associe ARNr et protéines, positionne ARNm et ARNt et catalyse l’assemblage." },
        ],
        observation: "L’information ne passe pas directement de l’ADN à la protéine : l’ARNm sert d’intermédiaire.",
        check: q("Quel ARN porte un anticodon et un acide aminé ?", "L’ARNt", "L’ARNm", "L’ARNr seul", "L’ADN"),
        extraQuestions: [
          choice("Quel acteur conserve durablement les gènes dans le noyau ?", ["L’ARNt", "Le ribosome", "L’ADN", "Un acide aminé"], 2, "L’ADN est le support stable de l’information génétique.", "Acteurs • pages 1-2"),
          choice("Quel est le rôle principal de l’ARNm ?", ["Transporter une copie du message vers le ribosome", "Apporter directement l’énergie lumineuse", "Constituer la membrane", "Répliquer tout le chromosome"], 0, "L’ARNm sert de matrice à la traduction.", "Acteurs • page 2"),
          choice("À quoi participe directement l’ARNr ?", ["À la formation du glucose", "À la constitution et à l’activité du ribosome", "Au stockage des lipides", "À la duplication des centrioles"], 1, "L’ARN ribosomal, associé à des protéines, constitue le ribosome.", "Acteurs • page 2"),
          choice("De combien de sous-unités le ribosome du schéma est-il formé ?", ["Une seule", "Trois identiques", "Quatre membranes", "Une grande et une petite"], 3, "Le cours distingue une grande et une petite sous-unité.", "Acteurs • page 2"),
          choice("Quelles sont les unités d’une chaîne polypeptidique ?", ["Les nucléotides", "Les acides aminés", "Les acides gras", "Les oses"], 1, "Les acides aminés sont reliés par des liaisons peptidiques.", "Exercice 2, item 2 • page 10"),
          choice("Quelles bases trouve-t-on dans l’ARN ?", ["A, U, C et G", "A, T, C et G uniquement", "A, U, T et G", "U, T, C et G"], 0, "L’ARN contient de l’uracile à la place de la thymine.", "Exercice 3, item 1 • page 11"),
          choice("Quelle association est incorrecte ?", ["ARNm — message", "ARNt — adaptateur", "ARNr — composant du ribosome", "ADN — transporteur de chaque acide aminé"], 3, "Ce sont les ARNt qui apportent les acides aminés ; l’ADN conserve l’information."),
          trueFalse("L’ARNt peut se replier même s’il est constitué d’un seul brin.", true, "Monocaténaire ne signifie pas rectiligne : des portions complémentaires peuvent s’apparier dans la même molécule."),
        ],
        source: proteinBiosynthesisSource(
          "1-2 et 10-11",
          "Acteurs de la biosynthèse, exercices 2 et 3",
          [
            "Les indices m, t et r, mal détachés dans le PDF, sont rétablis dans ARNm, ARNt et ARNr.",
            "Le caractère monocaténaire des ARN est distingué de leur repliement tridimensionnel.",
            "Le rôle catalytique et structural de l’ARNr dans le ribosome est explicité.",
          ],
        ),
        distractors: ["Le ribosome stocke durablement les gènes.", "L’ARNm apporte directement tous les acides aminés.", "L’ADN quitte normalement le noyau pour être lu par chaque ribosome."],
      },
      {
        id: "genetic-code",
        title: "Décoder le code génétique",
        summary: "Lire un codon de l’ARNm, reconnaître AUG et les codons stop, puis expliquer redondance et universalité.",
        conceptTitle: "Un codon est un triplet de nucléotides de l’ARNm",
        explanation: "Avec quatre nucléotides pris par groupes de trois, il existe 64 codons. Parmi eux, 61 correspondent à des acides aminés et UAA, UAG, UGA sont des signaux stop. AUG code la méthionine et sert généralement de codon initiateur. Plusieurs codons peuvent coder le même acide aminé : le code est redondant, mais chaque codon a une seule signification dans le tableau.",
        keyPoint: "64 codons : 61 codants, 3 stop ; AUG initie généralement ; le code est redondant, non ambigu et quasi universel.",
        example: "UUU et UUC codent tous deux la phénylalanine : redondance ; UUU ne code cependant qu’un seul acide aminé : non-ambiguïté.",
        bodyMarkdown: `
## 1. Le codon est l’unité de lecture

Le ribosome lit l’ARNm par groupes de **trois nucléotides consécutifs** appelés **codons**. Avec quatre nucléotides possibles à chacune des trois positions, le nombre de combinaisons est :

$$
4^3 = 64\\ \\text{codons}
$$

Le PDF parle de « trois acides nucléiques » : c’est une coquille. L’ARNm est un acide nucléique ; ses unités sont les **nucléotides** A, U, C et G.

## 2. Lire correctement le tableau du code génétique

Le tableau se lit toujours à partir d’un **codon d’ARNm écrit de 5′ vers 3′**.

1. repérer la première base ;
2. croiser avec la deuxième base ;
3. choisir la ligne correspondant à la troisième base ;
4. relever l’acide aminé ou le signal stop.

| Codon d’ARNm | Signification |
|---|---|
| UUU ou UUC | phénylalanine |
| UGC | cystéine |
| AUG | méthionine ; codon initiateur habituel |
| UAA, UAG ou UGA | arrêt de la traduction |

Un triplet d’ADN contient T et ne se lit pas directement dans ce tableau. Il faut d’abord écrire l’ARNm correspondant, donc remplacer T par U si l’on part du brin codant, ou appliquer la complémentarité si l’on part du brin matrice.

## 3. Quatre propriétés à maîtriser

| Propriété | Signification | Exemple |
|---|---|---|
| **redondant** ou dégénéré | plusieurs codons peuvent désigner le même acide aminé | UUU et UUC → phénylalanine |
| **non ambigu** | un codon donné ne désigne qu’un seul acide aminé ou un seul signal | UGC → cystéine uniquement |
| **quasi universel** | la grande majorité des organismes utilisent les mêmes correspondances | quelques exceptions existent, notamment dans des mitochondries |
| **ponctué** | un codon initiateur fixe le départ et un codon stop marque la fin | AUG … UGA |

La redondance explique qu’une substitution puisse parfois produire un autre codon donnant **le même acide aminé** : on parle alors de mutation synonyme ou silencieuse.

## 4. Codon et anticodon ne sont pas synonymes

- le **codon** appartient à l’ARNm et est lu de 5′ vers 3′ ;
- l’**anticodon** appartient à un ARNt et s’apparie de façon complémentaire et antiparallèle ;
- par exemple, le codon $5^{\\prime}\\text{-AUG-}3^{\\prime}$ peut être reconnu par l’anticodon $3^{\\prime}\\text{-UAC-}5^{\\prime}$.

## 5. Départ et arrêt

Dans le modèle scolaire, la traduction commence habituellement à **AUG**, qui code la méthionine et place le ribosome dans le bon cadre de lecture. Un AUG situé au milieu d’une séquence peut simplement coder une méthionine : ce n’est pas automatiquement le départ d’une nouvelle protéine.

Les codons **UAA, UAG et UGA** ne correspondent à aucun acide aminé dans le code standard. Ils sont reconnus par des facteurs de libération et déclenchent l’arrêt.

> **Astuce mémoire — AUG allume ; UAA, UAG, UGA arrêtent.** Pour les trois stops, retiens qu’ils commencent tous par U et contiennent A ou G.
`,
        interaction: {
          kind: "diagram",
          eyebrow: "Décodeur interactif",
          title: "Lire un codon sans se tromper de support",
          instruction: "Ouvre les cartes dans l’ordre, du support jusqu’à la propriété du code.",
          rootLabel: "Codon d’ARNm : 5’-AUG-3’",
          rootDetail: "Le tableau du code génétique reçoit un triplet d’ARNm orienté 5’ vers 3’.",
          nodes: [
            { id: "first", label: "1re base : A", role: "Entrée 1", detail: "Choisir le secteur ou la ligne A correspondant à la première position.", group: "Lecture" },
            { id: "second", label: "2e base : U", role: "Entrée 2", detail: "Croiser avec la deuxième position U.", group: "Lecture" },
            { id: "third", label: "3e base : G", role: "Entrée 3", detail: "La troisième base G précise le codon AUG.", group: "Lecture" },
            { id: "meaning", label: "Méthionine", role: "Résultat", detail: "AUG code la méthionine et sert habituellement de codon initiateur.", group: "Sens" },
            { id: "anticodon", label: "Anticodon 3’-UAC-5’", role: "Complément", detail: "Il appartient à l’ARNt et s’apparie de façon antiparallèle avec AUG.", group: "Sens" },
            { id: "stop", label: "UAA · UAG · UGA", role: "Arrêt", detail: "Ces codons sont des signaux de terminaison ; aucun acide aminé « stop » n’est ajouté.", group: "Ponctuation" },
          ],
          observation: "Le support et le sens comptent autant que les lettres : un codon est un triplet d’ARNm lu de 5’ vers 3’.",
        },
        processTitle: "Lire un codon dans le tableau",
        processInstruction: "Utilise toujours l’ARNm dans le sens 5’ vers 3’.",
        process: [
          { label: "Première base", detail: "Choisir la ligne correspondant au premier nucléotide du codon." },
          { label: "Deuxième base", detail: "Choisir la colonne correspondant au deuxième nucléotide." },
          { label: "Troisième base", detail: "Affiner avec le troisième nucléotide pour trouver l’acide aminé." },
          { label: "Signal", detail: "Vérifier si le codon est AUG, un codon d’acide aminé courant ou un codon stop." },
        ],
        observation: "Le tableau se lit avec des codons d’ARNm contenant U ; une séquence d’ADN contenant T doit d’abord être transcrite.",
        check: q("Quels sont les trois codons stop de l’ARNm ?", "UAA, UAG et UGA", "AUG, UGG et UUU", "TAA, TAG et TGA", "AAA, CCC et GGG"),
        extraQuestions: [
          choice("Activité d’application — Quelle définition correspond à un codon ?", ["Un triplet de l’ARNt", "Un acide aminé du ribosome", "Un triplet de bases de l’ARNm", "Une paire de chromosomes"], 2, "Le codon est un triplet de nucléotides de l’ARNm.", "Activité d’application • page 9"),
          choice("Activité d’application — Qu’est-ce qu’un anticodon ?", ["Un triplet complémentaire porté par un ARNt", "Un codon stop de l’ADN", "Une protéine du noyau", "Un triplet de glucose"], 0, "L’anticodon de l’ARNt reconnaît un codon de l’ARNm.", "Activité d’application • page 9"),
          choice("Que signifie « code génétique redondant » ?", ["Un codon possède plusieurs sens", "Plusieurs codons peuvent coder le même acide aminé", "Tous les codons sont stop", "Les protéines contiennent trois bases"], 1, "La redondance porte sur plusieurs codons synonymes pour un même acide aminé.", "Activité d’application • page 9"),
          choice("Pourquoi le code est-il dit non ambigu ?", ["Chaque acide aminé a un seul codon", "Il ne contient aucun signal stop", "Un codon donné a une seule signification", "Il change dans chaque cellule"], 2, "Un codon code un acide aminé précis ou un signal stop, jamais plusieurs sens simultanés.", "Exercice 1, blanc 7 • page 10"),
          choice("Combien de codons du code standard désignent un acide aminé ?", ["20", "61", "3", "64 acides aminés différents"], 1, "Sur 64 codons, 61 sont des codons de sens et 3 sont des codons stop.", "Code génétique • page 3"),
          choice("Quel codon sert habituellement de signal d’initiation dans le modèle étudié ?", ["UAA", "UGA", "AUG", "UAG"], 2, "AUG code la méthionine et fixe habituellement le départ de la traduction.", "Code génétique • pages 3 et 10"),
          choice("Exercice 3 — Dans quelle molécule trouve-t-on un codon ?", ["L’ARNm", "L’ARNt uniquement", "Le brin matrice d’ADN par définition", "Une protéine"], 0, "Le codon est une séquence de trois nucléotides de l’ARN messager.", "Exercice 3, item 2 • page 11"),
          choice("Exercice 3 — Dans quelle molécule trouve-t-on un anticodon ?", ["L’ARNr", "L’ADN", "L’ARNm", "L’ARNt"], 3, "L’anticodon est porté par l’ARN de transfert.", "Exercice 3, item 3 • page 11"),
          choice("Pendant la traduction, quelles propositions du PDF sont justes si l’on parle des codons de sens ?", ["a uniquement", "b uniquement", "a et c", "b et c"], 2, "Un codon de sens a une seule signification et plusieurs codons peuvent être synonymes ; chaque acide aminé n’a pas forcément un seul codon.", "Exercice 2, item 4 • pages 10-11"),
          trueFalse("Le code génétique est absolument identique sans aucune exception dans tous les systèmes vivants.", false, "Il est quasi universel : de rares variantes existent, notamment dans certains génomes mitochondriaux."),
        ],
        source: proteinBiosynthesisSource(
          "3, 9-11",
          "Code génétique, activité d’association et exercices 1 à 3",
          [
            "Les « associations de 3 acides nucléiques » sont corrigées en triplets de nucléotides.",
            "La propriété « universel » est précisée en quasi universel afin de signaler les rares variantes du code.",
            "La phrase « un seul codon peut correspondre à un seul acide aminé (méthionine) » est reformulée : tout codon de sens est non ambigu, tandis que certains acides aminés ont plusieurs codons.",
            "La règle « toutes les synthèses commencent par AUG » est ramenée au modèle canonique : AUG est le codon initiateur habituel et peut aussi coder une méthionine interne.",
          ],
        ),
        distractors: ["Chaque acide aminé possède obligatoirement un seul codon.", "Un même codon code plusieurs acides aminés différents.", "Le code génétique se lit directement sur n’importe quel brin d’ADN sans transcription."],
      },
      {
        id: "transcription",
        title: "Transcrire l’ADN en ARNm",
        summary: "Choisir le brin matrice, appliquer la complémentarité et produire un ARNm orienté.",
        conceptTitle: "L’ARN polymérase copie un gène dans le noyau",
        explanation: "L’ARN polymérase ouvre localement l’ADN et utilise un brin matrice. Elle assemble un ARNm complémentaire et antiparallèle : A de l’ADN appelle U dans l’ARN, T appelle A, C appelle G et G appelle C. L’ARNm obtenu quitte ensuite le noyau vers le cytoplasme.",
        keyPoint: "Brin matrice d’ADN — ARN polymérase et complémentarité → ARNm synthétisé dans le sens 5’ vers 3’.",
        example: "Pour le brin matrice 3’-TAC CCG ATT-5’, l’ARNm est 5’-AUG GGC UAA-3’.",
        bodyMarkdown: `
## 1. La transcription copie une portion d’ADN

Dans le noyau, l’**ARN polymérase** reconnaît une région du gène, ouvre localement la double hélice et utilise un seul brin comme matrice. Elle ne copie pas le chromosome entier pour fabriquer chaque ARNm.

> **Correction essentielle du PDF :** la page 6 cite d’abord l’« ADN polymérase ». Cette enzyme assure principalement la réplication de l’ADN. La transcription est catalysée par une **ARN polymérase**, comme le PDF l’écrit d’ailleurs dans la phrase suivante.

## 2. Brin matrice et brin codant

Les deux brins d’ADN ont des rôles et des orientations différentes.

| Brin | Autres noms utiles | Relation avec l’ARNm |
|---|---|---|
| **brin matrice** | brin transcrit, brin antisens, brin non codant | complémentaire et antiparallèle à l’ARNm |
| **brin codant** | brin non transcrit, brin sens | même séquence que l’ARNm dans le sens 5′ → 3′, avec T à la place de U |

Le PDF appelle le brin matrice « brin codant ou brin transcrit ». Cette juxtaposition est contradictoire dans la nomenclature moderne. Ici, on emploie systématiquement **brin matrice/transcrit** et **brin codant/non transcrit**.

## 3. Les règles de complémentarité

Pendant la transcription :

| Base du brin matrice d’ADN | Base ajoutée dans l’ARN |
|---|---|
| A | U |
| T | A |
| C | G |
| G | C |

L’ARN polymérase lit le brin matrice de 3′ vers 5′ et synthétise l’ARN dans le sens 5′ vers 3′.

### Exemple complet

$$
\\begin{aligned}
\\text{brin codant} &: 5^{\\prime}\\text{-ATG\\ GGC\\ TAA-}3^{\\prime} \\\\
\\text{brin matrice} &: 3^{\\prime}\\text{-TAC\\ CCG\\ ATT-}5^{\\prime} \\\\
\\text{ARNm} &: 5^{\\prime}\\text{-AUG\\ GGC\\ UAA-}3^{\\prime}
\\end{aligned}
$$

Deux chemins donnent le même ARNm :

- depuis le brin matrice, appliquer la complémentarité ;
- depuis le brin codant écrit de 5′ vers 3′, conserver les lettres et remplacer T par U.

## 4. Les étapes du mécanisme

1. **initiation :** l’ARN polymérase se fixe et ouvre localement l’ADN ;
2. **élongation :** elle ajoute les ribonucléotides complémentaires ;
3. **terminaison :** elle libère le transcrit à la fin de la région copiée ;
4. **maturation et export, chez les eucaryotes :** le transcrit est préparé puis l’ARNm rejoint le cytoplasme.

Le cours représente directement l’ARNm exporté. Cette simplification suffit pour les exercices, mais la maturation explique pourquoi le produit immédiatement synthétisé n’est pas toujours encore l’ARNm final.

## 5. Contrôle rapide d’une réponse

Avant de valider une séquence, vérifie :

- les deux extrémités 5′ et 3′ sont écrites ;
- les deux molécules sont antiparallèles lorsqu’elles s’apparient ;
- aucun T ne subsiste dans l’ARNm ;
- l’ARNm ressemble au brin codant, pas au brin matrice ;
- les triplets restent séparés dans le même cadre de lecture.

> **Astuce mémoire — MaCo :** **Ma**trice = **Co**mplémentaire ; **Co**dant = **Co**pie de l’ARNm avec T au lieu de U.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Transcription redessinée",
          title: "Suivre les deux brins et l’ARNm",
          instruction: "Sélectionne les repères pour contrôler support, orientation et enzyme.",
          viewBox: "0 0 760 430",
          caption: "Figure originale inspirée du mécanisme des pages 5-6 ; la nomenclature des brins est corrigée.",
          shapes: [
            { shape: "path", d: "M80 145 C150 95 220 195 290 145 C360 95 430 195 500 145 C570 95 640 195 700 145", tone: "accent" },
            { shape: "path", d: "M80 235 C150 285 220 185 290 235 C360 285 430 185 500 235 C570 285 640 185 700 235", tone: "outline" },
            { shape: "line", x1: 120, y1: 128, x2: 120, y2: 252, tone: "muted" },
            { shape: "line", x1: 205, y1: 153, x2: 205, y2: 227, tone: "muted" },
            { shape: "line", x1: 550, y1: 132, x2: 550, y2: 248, tone: "muted" },
            { shape: "line", x1: 635, y1: 158, x2: 635, y2: 222, tone: "muted" },
            { shape: "ellipse", cx: 380, cy: 190, rx: 112, ry: 84, tone: "soft" },
            { shape: "path", d: "M360 210 C410 255 465 275 535 300 C585 318 625 325 682 330", tone: "accent" },
            { shape: "path", d: "M438 280 L466 278 L450 302 Z", tone: "accent" },
            { shape: "text", x: 180, y: 95, content: "brin codant 5’ → 3’", anchor: "middle" },
            { shape: "text", x: 180, y: 300, content: "brin matrice 3’ → 5’", anchor: "middle" },
            { shape: "text", x: 380, y: 190, content: "ARN polymérase", anchor: "middle" },
            { shape: "text", x: 590, y: 365, content: "ARNm 5’ → 3’", anchor: "middle" },
          ],
          zones: [
            { label: "ADN fermé", xStart: 45, xEnd: 250 },
            { label: "bulle de transcription", xStart: 250, xEnd: 515 },
            { label: "ADN refermé", xStart: 515, xEnd: 720 },
          ],
          hotspots: [
            { id: "coding", number: 1, label: "Brin codant", detail: "Il n’est pas lu par l’enzyme dans ce modèle et possède la séquence de l’ARNm, T remplaçant U.", x: 185, y: 145, highlight: [{ shape: "path", d: "M80 145 C150 95 220 195 290 145", tone: "accent" }] },
            { id: "template", number: 2, label: "Brin matrice", detail: "L’ARN polymérase le lit de 3’ vers 5’ ; il est complémentaire de l’ARNm.", x: 185, y: 235, highlight: [{ shape: "path", d: "M80 235 C150 285 220 185 290 235", tone: "accent" }] },
            { id: "polymerase", number: 3, label: "ARN polymérase", detail: "Elle ouvre localement l’ADN et assemble les ribonucléotides complémentaires.", x: 380, y: 190, highlight: [{ shape: "ellipse", cx: 380, cy: 190, rx: 122, ry: 92, tone: "accent" }] },
            { id: "mrna", number: 4, label: "ARNm naissant", detail: "Il s’allonge dans le sens 5’ vers 3’ et contient U à la place de T.", x: 535, y: 300, highlight: [{ shape: "ellipse", cx: 555, cy: 308, rx: 115, ry: 44, tone: "accent" }] },
          ],
          observation: "Écrire les orientations suffit souvent à éviter l’erreur la plus fréquente : recopier le brin matrice comme s’il était codant.",
        },
        processTitle: "Fabriquer le message",
        processInstruction: "Suis l’ouverture du gène puis la complémentarité des nucléotides.",
        process: [
          { label: "Ouverture", detail: "L’ARN polymérase ouvre localement la portion d’ADN correspondant au gène." },
          { label: "Lecture", detail: "Elle progresse sur le brin matrice dans le sens 3’ vers 5’." },
          { label: "Élongation", detail: "Elle ajoute les ribonucléotides complémentaires et synthétise l’ARNm 5’ vers 3’." },
          { label: "Sortie", detail: "L’ARNm mature rejoint le cytoplasme où les ribosomes pourront le lire." },
        ],
        observation: "L’enzyme correcte de la transcription est l’ARN polymérase ; l’ADN polymérase sert principalement à répliquer l’ADN.",
        check: q("Quelle enzyme synthétise l’ARNm à partir de l’ADN ?", "L’ARN polymérase", "L’ADN ligase seule", "Le ribosome", "L’amylase"),
        extraQuestions: [
          choice("Dans quel sens l’ARN polymérase synthétise-t-elle l’ARN ?", ["3’ vers 5’", "5’ vers 3’", "Dans les deux sens à la fois", "Sans orientation"], 1, "Toute chaîne d’ARN est allongée dans le sens 5’ vers 3’."),
          choice("Quel brin d’ADN est directement lu pendant la transcription ?", ["Le brin matrice", "Le brin codant uniquement", "Les deux brins simultanément pour le même ARNm", "Aucun brin"], 0, "L’ARNm est complémentaire du brin matrice.", "Mécanisme • page 6"),
          choice("Quelle relation unit le brin codant et l’ARNm ?", ["Ils sont complémentaires base à base", "Ils sont antiparallèles et différents partout", "Ils ont la même séquence 5’→3’, sauf T remplacé par U", "L’ARNm contient T à la place de U"], 2, "Le brin codant a la même succession de bases que l’ARNm, avec T dans l’ADN et U dans l’ARN."),
          choice("Quel ARNm correspond au brin matrice 3’-TAC CCG ATT-5’ ?", ["5’-UAC CCG AUU-3’", "3’-AUG GGC UAA-5’", "5’-TAC CCG ATT-3’", "5’-AUG GGC UAA-3’"], 3, "La complémentarité et l’antiparallélisme donnent AUG GGC UAA."),
          choice("Quel est le brin codant correspondant à cet ARNm 5’-AUG GGC UAA-3’ ?", ["5’-ATG GGC TAA-3’", "3’-TAC CCG ATT-5’", "5’-TAC CCG ATT-3’", "3’-AUG GGC UAA-5’"], 0, "Le brin codant reprend la séquence de l’ARNm avec T à la place de U."),
          choice("Quel appariement est correct pendant la transcription ?", ["A de l’ADN avec T de l’ARN", "A de l’ADN avec U de l’ARN", "C de l’ADN avec U de l’ARN", "G de l’ADN avec T de l’ARN"], 1, "Dans l’ARN, U s’apparie avec A du brin matrice."),
          trueFalse("L’ADN polymérase est l’enzyme responsable de la transcription de l’ARNm.", false, "La transcription utilise une ARN polymérase ; l’ADN polymérase intervient principalement dans la réplication.", "Interprétation corrigée • page 6"),
          choice("Pourquoi l’ADN s’ouvre-t-il localement ?", ["Pour quitter le noyau", "Pour devenir une protéine", "Pour rendre accessible la portion matrice du gène", "Pour supprimer tous les nucléotides"], 2, "L’ouverture locale permet à l’ARN polymérase de lire le brin matrice.", "Interprétation • page 6"),
          choice("Quelle molécule quitte le noyau dans le schéma du cours ?", ["Le chromosome entier", "L’ARNm", "Le ribosome complet avec l’ADN", "La membrane nucléaire"], 1, "L’ARNm exporté apporte le message au cytoplasme.", "Résultats • pages 5-6"),
          choice("Quelle affirmation distingue correctement matrice et codant ?", ["Le brin matrice est aussi appelé non transcrit", "Le brin codant est complémentaire de l’ARNm", "Le brin matrice contient de l’uracile", "Le brin matrice est transcrit ; le brin codant est non transcrit"], 3, "Cette nomenclature corrige la confusion présente à la page 6."),
          choice("Quel contrôle révèle immédiatement qu’une séquence n’est pas un ARNm ?", ["Elle contient la base T", "Elle contient la base A", "Elle est écrite en triplets", "Elle possède une extrémité 5’"], 0, "L’ARN utilise U et non T."),
        ],
        source: proteinBiosynthesisSource(
          "4-6 et 11-12",
          "Transcription, orientation des brins et exercices de séquences",
          [
            "L’« ADN polymérase » citée au début de l’interprétation est corrigée en ARN polymérase.",
            "Le « brin codant ou brin transcrit » est corrigé : le brin transcrit est le brin matrice/non codant ; le brin codant est non transcrit.",
            "Les orientations 3’→5’ du brin matrice et 5’→3’ de l’ARN synthétisé sont ajoutées aux séquences pour lever les ambiguïtés.",
            "La maturation de l’ARNm eucaryote est signalée comme précision, sans remplacer le mécanisme simplifié demandé par le PDF.",
          ],
        ),
        distractors: ["La transcription se déroule sur le ribosome dans le cytoplasme.", "L’uracile de l’ARN s’apparie avec la guanine de l’ADN.", "L’ARNm est identique au brin matrice et orienté dans le même sens."],
      },
      {
        id: "translation",
        title: "Traduire l’ARNm en protéine",
        summary: "Suivre initiation, élongation et terminaison au niveau du ribosome.",
        conceptTitle: "Le ribosome transforme une suite de codons en suite d’acides aminés",
        explanation: "À l’initiation, le ribosome se place sur l’ARNm et un ARNt chargé de méthionine reconnaît AUG. Pendant l’élongation, des ARNt successifs apportent les acides aminés correspondant aux codons et des liaisons peptidiques se forment. À un codon stop, aucun ARNt chargé ne correspond : la chaîne est libérée et le complexe se dissocie.",
        keyPoint: "Initiation sur AUG → élongation codon par codon avec les ARNt → terminaison sur UAA, UAG ou UGA.",
        example: "L’ARNm 5’-AUG GGC UAA-3’ produit une chaîne méthionine-glycine, puis la traduction s’arrête.",
        bodyMarkdown: `
## 1. Traduire, c’est changer de langage

La **traduction** convertit l’ordre des nucléotides de l’ARNm en ordre des acides aminés d’un polypeptide. Le ribosome lit l’ARNm dans le sens 5′ → 3′ et la chaîne s’allonge de son extrémité N-terminale vers son extrémité C-terminale.

Trois éléments travaillent ensemble :

- l’**ARNm** présente les codons ;
- les **ARNt chargés** apportent chacun un acide aminé et portent un anticodon ;
- le **ribosome** aligne les partenaires et catalyse les liaisons peptidiques.

Avant la traduction, une enzyme spécifique appelée aminoacyl-ARNt synthétase fixe le bon acide aminé sur son ARNt. Cette étape assure que l’anticodon et l’acide aminé transporté correspondent au code.

## 2. Initiation : placer le cadre de lecture

Dans le modèle canonique du cours :

1. la petite sous-unité du ribosome s’associe à l’ARNm ;
2. l’ARNt initiateur reconnaît le codon AUG et apporte une méthionine ;
3. cet ARNt occupe le **site P** ;
4. la grande sous-unité complète le ribosome.

Le départ fixe le **cadre de lecture**. Décaler le découpage d’un seul nucléotide change tous les codons situés après ce décalage.

## 3. Élongation : répéter trois opérations

| Opération | Ce qui se produit |
|---|---|
| **reconnaissance** | un ARNt chargé entre au site A et son anticodon s’apparie au codon |
| **liaison peptidique** | la chaîne portée au site P est reliée à l’acide aminé du site A |
| **translocation** | le ribosome avance d’un codon ; l’ARNt vide sort et le site A se libère |

Le PDF décrit principalement les sites P et A. On peut aussi nommer le **site E**, par lequel l’ARNt déchargé quitte le ribosome.

## 4. Terminaison : aucun acide aminé « stop »

Quand UAA, UAG ou UGA arrive au site A, aucun ARNt chargé ne possède l’anticodon destiné à y ajouter un acide aminé. Un **facteur de libération** reconnaît le signal, libère la chaîne puis permet la dissociation des sous-unités ribosomiques et de l’ARNm.

> **Correction de précision :** le PDF indique seulement une dissociation entre l’ARNm et la chaîne. La chaîne est en réalité libérée de l’ARNt qui la porte, sous l’action d’un facteur de libération ; le complexe est ensuite recyclé.

## 5. Exemple guidé

Pour l’ARNm :

$$
5^{\\prime}\\text{-AUG\\ GGC\\ UAA-}3^{\\prime}
$$

| Codon | Rôle | Résultat |
|---|---|---|
| AUG | initiation et codon de sens | méthionine |
| GGC | codon de sens | glycine |
| UAA | terminaison | aucun acide aminé ajouté |

La chaîne obtenue est donc **méthionine–glycine**, puis arrêt.

## 6. Lire une séquence plus longue sans dépasser le stop

La séquence corrigée de l’exercice 2 de la page 12 est interprétée comme un ARNm :

$$
5^{\\prime}\\text{-AUG\\ UGC\\ GCU\\ AAA\\ AUA\\ CAU\\ CCG\\ ACG\\ UGA\\ UGC\\ AUG\\ UCA-}3^{\\prime}
$$

La traduction donne : **Met–Cys–Ala–Lys–Ile–His–Pro–Thr**, puis s’arrête à UGA. Les codons placés après ce stop ne sont pas traduits dans ce cadre.

> **Astuce mémoire — RLT :** **R**econnaître, former la **L**iaison, **T**ransloquer. Cette boucle se répète pendant l’élongation.
`,
        interaction: {
          kind: "schema",
          eyebrow: "Ribosome redessiné",
          title: "Observer initiation, élongation et terminaison",
          instruction: "Sélectionne les repères du ribosome puis ouvre le signal d’arrêt.",
          viewBox: "0 0 760 460",
          caption: "Figure originale inspirée des schémas des pages 5 et 7 ; aucun scan n’est intégré.",
          shapes: [
            { shape: "path", d: "M80 330 C190 300 285 352 390 325 C500 295 600 350 690 320", tone: "outline" },
            { shape: "ellipse", cx: 380, cy: 265, rx: 235, ry: 110, tone: "soft" },
            { shape: "ellipse", cx: 380, cy: 315, rx: 185, ry: 65, tone: "accent" },
            { shape: "line", x1: 300, y1: 205, x2: 300, y2: 335, tone: "muted" },
            { shape: "line", x1: 390, y1: 195, x2: 390, y2: 335, tone: "muted" },
            { shape: "line", x1: 480, y1: 205, x2: 480, y2: 335, tone: "muted" },
            { shape: "path", d: "M390 235 C365 180 330 150 320 95", tone: "accent" },
            { shape: "path", d: "M480 235 C500 180 535 150 548 95", tone: "outline" },
            { shape: "circle", cx: 320, cy: 82, r: 17, tone: "accent" },
            { shape: "circle", cx: 548, cy: 82, r: 17, tone: "soft" },
            { shape: "path", d: "M320 82 C350 35 380 58 405 35 C430 12 465 58 495 35", tone: "accent" },
            { shape: "text", x: 300, y: 245, content: "E", anchor: "middle" },
            { shape: "text", x: 390, y: 245, content: "P", anchor: "middle" },
            { shape: "text", x: 480, y: 245, content: "A", anchor: "middle" },
            { shape: "text", x: 205, y: 390, content: "5’", anchor: "middle" },
            { shape: "text", x: 555, y: 390, content: "3’", anchor: "middle" },
            { shape: "text", x: 390, y: 362, content: "ARNm : AUG  GGC  UAA", anchor: "middle" },
            { shape: "text", x: 405, y: 30, content: "chaîne polypeptidique", anchor: "middle" },
          ],
          hotspots: [
            { id: "mrna", number: 1, label: "ARNm", detail: "Le ribosome le parcourt de 5’ vers 3’, trois nucléotides à la fois.", x: 205, y: 330, highlight: [{ shape: "ellipse", cx: 380, cy: 330, rx: 310, ry: 36, tone: "accent" }] },
            { id: "p-site", number: 2, label: "Site P", detail: "Il porte l’ARNt lié à la chaîne en cours d’allongement ; l’ARNt initiateur y débute.", x: 390, y: 265, highlight: [{ shape: "ellipse", cx: 390, cy: 260, rx: 45, ry: 72, tone: "accent" }] },
            { id: "a-site", number: 3, label: "Site A", detail: "Il reçoit le prochain ARNt chargé dont l’anticodon correspond au codon exposé.", x: 480, y: 265, highlight: [{ shape: "ellipse", cx: 480, cy: 260, rx: 45, ry: 72, tone: "accent" }] },
            { id: "trna", number: 4, label: "ARNt chargé", detail: "L’anticodon reconnaît le codon et l’extrémité opposée porte l’acide aminé.", x: 548, y: 145, highlight: [{ shape: "ellipse", cx: 530, cy: 150, rx: 62, ry: 83, tone: "accent" }] },
            { id: "peptide", number: 5, label: "Polypeptide", detail: "Les liaisons peptidiques relient les acides aminés dans l’ordre imposé par les codons.", x: 405, y: 62, highlight: [{ shape: "ellipse", cx: 405, cy: 55, rx: 118, ry: 42, tone: "accent" }] },
            { id: "stop", number: 6, label: "Codon stop", detail: "Un facteur de libération reconnaît UAA, UAG ou UGA ; aucun acide aminé stop n’existe.", x: 600, y: 330, highlight: [{ shape: "ellipse", cx: 590, cy: 330, rx: 72, ry: 40, tone: "accent" }] },
          ],
          observation: "La répétition entrée au site A → liaison → déplacement explique comment l’ordre des codons devient l’ordre des acides aminés.",
        },
        processTitle: "Les trois phases de la traduction",
        processInstruction: "Observe comment le ribosome avance sur l’ARNm dans le sens 5’ vers 3’.",
        process: [
          { label: "Initiation", detail: "Assemblage du ribosome et reconnaissance du codon AUG par l’ARNt initiateur." },
          { label: "Élongation", detail: "Entrée d’un ARNt complémentaire, liaison peptidique puis translocation du ribosome." },
          { label: "Terminaison", detail: "Un codon stop recrute un facteur de libération et la chaîne polypeptidique est libérée." },
        ],
        observation: "La complémentarité codon-anticodon garantit l’ordre des acides aminés, tandis que le code génétique donne leur identité.",
        check: q("Que se passe-t-il lorsqu’un codon stop entre dans le site de lecture ?", "La chaîne polypeptidique est libérée et le ribosome se dissocie", "Un nouvel acide aminé stop est ajouté", "L’ADN quitte le noyau", "La transcription recommence"),
        extraQuestions: [
          choice("Dans quel sens le ribosome lit-il l’ARNm ?", ["3’ vers 5’", "Dans les deux sens", "5’ vers 3’", "Du stop vers AUG"], 2, "La lecture progresse dans le sens 5’ vers 3’."),
          choice("Quel ARNt occupe d’abord le site P dans le modèle canonique ?", ["L’ARNt initiateur chargé de méthionine", "Un ARNt portant un acide aminé stop", "L’ARNr libre", "Un fragment d’ADN"], 0, "L’ARNt initiateur reconnaît AUG et s’installe au site P.", "Initiation • page 6"),
          choice("Que se place-t-il au site A pendant l’élongation ?", ["Le chromosome", "Un nouvel ARNt chargé complémentaire du codon", "La membrane nucléaire", "L’ARN polymérase"], 1, "L’ARNt entrant apporte l’acide aminé suivant.", "Élongation • pages 6-7"),
          choice("Quelle liaison unit deux acides aminés successifs ?", ["Une liaison glycosidique", "Une liaison phosphodiester", "Une liaison hydrogène uniquement", "Une liaison peptidique"], 3, "Le ribosome catalyse la formation de la liaison peptidique.", "Élongation • page 6"),
          choice("Qu’est-ce que la translocation ?", ["La sortie de l’ADN du noyau", "La copie de l’ARNm", "L’avancée du ribosome d’un codon", "La destruction immédiate de la protéine"], 2, "Après la liaison peptidique, le ribosome avance et libère le site A.", "Élongation • page 7"),
          choice("Qui reconnaît directement un codon stop ?", ["Un facteur de libération", "Un ARNt chargé d’un acide aminé stop", "L’ADN polymérase", "Un glucose"], 0, "Les codons stop sont reconnus par des facteurs protéiques de libération."),
          choice("Quelle chaîne donne 5’-AUG GGC UAA-3’ ?", ["Met–Gly–Stop comme troisième acide aminé", "Met–Gly puis arrêt", "Tyr–Pro–Leu", "Aucune chaîne"], 1, "UAA arrête la traduction sans être incorporé à la chaîne."),
          choice("Dans la séquence corrigée de l’exercice 2, quel codon arrête la traduction ?", ["AUG", "UGC", "ACG", "UGA"], 3, "UGA est le neuvième codon et termine la lecture.", "Situation d’évaluation 2 corrigée • page 12"),
          choice("Quelle chaîne précède ce stop ?", ["Met–Cys–Ala–Lys–Ile–His–Pro–Thr", "Met–Cys–Ala–Lys–Ile–His–Pro–Thr–Stop–Cys", "Tyr–Thr–Arg uniquement", "Cys–Tyr–Phe–Gln"], 0, "La lecture s’arrête avant les codons placés après UGA.", "Situation d’évaluation 2 corrigée • page 12"),
          trueFalse("Un AUG situé dans n’importe quelle position déclenche forcément une nouvelle traduction.", false, "AUG sert de départ dans un contexte d’initiation ; à l’intérieur du cadre déjà lu, il code simplement une méthionine."),
          choice("Quelle proposition remet les phases dans l’ordre ?", ["Terminaison → initiation → élongation", "Initiation → élongation → terminaison", "Élongation → transcription → initiation", "Transcription → terminaison → réplication"], 1, "La traduction commence, allonge la chaîne puis s’arrête.", "Analyse • pages 6-7"),
        ],
        source: proteinBiosynthesisSource(
          "5-7 et 10-12",
          "Traduction, initiation, élongation, terminaison et exercices",
          [
            "L’expression « le premier codon est toujours AUG » est précisée : AUG est le codon initiateur habituel du modèle canonique, mais un AUG interne code une méthionine.",
            "La terminaison est complétée par le rôle du facteur de libération ; aucun ARNt ne porte un acide aminé stop.",
            "La séquence de l’exercice 2 page 12, qui mélange T et U, est normalisée en ARNm et la lecture s’arrête au premier UGA du cadre.",
            "L’expression « acide animé » est corrigée en acide aminé et le site de sortie E est ajouté comme précision.",
          ],
        ),
        distractors: ["La traduction se déroule dans le noyau sur l’ADN.", "Le ribosome lit l’ARNm dans les deux sens simultanément.", "Un codon stop code un acide aminé nommé stop."],
      },
    ],
    mission: {
      title: "Comparer deux hormones à partir de leurs séquences d’ADN",
      scenario: "Un groupe compare des portions de gènes de l’ocytocine et de la vasopressine. Il doit construire l’ARNm, utiliser le code génétique et expliquer pourquoi quelques changements de nucléotides modifient certains acides aminés.",
      problem: "Comment passer rigoureusement d’un brin d’ADN à une chaîne polypeptidique et comparer deux protéines ?",
      bodyMarkdown: `
## Dossier A — Ocytocine et vasopressine

Le PDF fournit les deux séquences suivantes sans orientation et les appelle « brins non codants » :

$$
\\begin{aligned}
\\text{Ocytocine} &: \\text{TGC TAC ATC CAG AAC TGC CCC CTG GGC} \\\\
\\text{Vasopressine} &: \\text{TGC TAC TTC CAG AAC TGC CCA AGA GGA}
\\end{aligned}
$$

Or, lues comme des **brins codants de 5′ vers 3′**, ces séquences donnent exactement les deux nonapeptides annoncés. Le mot « non codant » est donc corrigé en **codant**. Il suffit alors de remplacer T par U pour écrire les ARNm.

| Molécule | ARNm 5′ → 3′ | Chaîne obtenue |
|---|---|---|
| ocytocine | UGC UAC AUC CAG AAC UGC CCC CUG GGC | Cys–Tyr–Ile–Gln–Asn–Cys–Pro–Leu–Gly |
| vasopressine | UGC UAC UUC CAG AAC UGC CCA AGA GGA | Cys–Tyr–Phe–Gln–Asn–Cys–Pro–Arg–Gly |

Les deux chaînes diffèrent aux positions **3** et **8** : isoleucine/phénylalanine, puis leucine/arginine. Les codons diffèrent aussi parfois sans changer l’acide aminé : CCC et CCA codent tous deux la proline, GGC et GGA la glycine.

> **Méthode :** identifier le brin → orienter 5′/3′ → écrire l’ARNm → séparer en codons → traduire → comparer position par position.

## Dossier B — Séquence associée à l’albinisme dans l’exercice

L’énoncé page 11 appelle « brin codant 5′→3′ » la séquence TAC ACG CGA TTT TAT GTA, mais les questions attendent manifestement un ARNm commençant par AUG. Pour rendre l’exercice cohérent, on la traite comme le **brin matrice écrit de 3′ vers 5′** :

$$
\\begin{aligned}
\\text{matrice} &: 3^{\\prime}\\text{-TAC\\ ACG\\ CGA\\ TTT\\ TAT\\ GTA-}5^{\\prime} \\\\
\\text{codant} &: 5^{\\prime}\\text{-ATG\\ TGC\\ GCT\\ AAA\\ ATA\\ CAT-}3^{\\prime} \\\\
\\text{ARNm} &: 5^{\\prime}\\text{-AUG\\ UGC\\ GCU\\ AAA\\ AUA\\ CAU-}3^{\\prime} \\\\
\\text{polypeptide} &: \\text{Met–Cys–Ala–Lys–Ile–His}
\\end{aligned}
$$

Deux substitutions du deuxième triplet permettent d’étudier la redondance :

- matrice ACG → ACA, donc ARNm UGC → UGU : cystéine dans les deux cas, mutation **silencieuse** ;
- matrice ACG → ACC, donc ARNm UGC → UGG : cystéine → tryptophane, mutation **faux-sens**.

Ce petit fragment illustre l’effet d’une substitution, mais ne suffit pas à diagnostiquer à lui seul une cause d’albinisme : le contexte clinique et le gène réellement étudié seraient nécessaires.

## Dossier C — La séquence mixte de la page 12

Le document mélange T et U dans une même séquence, ce qui ne correspond ni à un ADN ni à un ARN. On la normalise comme un ARNm :

$$
5^{\\prime}\\text{-AUG\\ UGC\\ GCU\\ AAA\\ AUA\\ CAU\\ CCG\\ ACG\\ UGA\\ UGC\\ AUG\\ UCA-}3^{\\prime}
$$

Le brin codant d’ADN est :

$$
5^{\\prime}\\text{-ATG\\ TGC\\ GCT\\ AAA\\ ATA\\ CAT\\ CCG\\ ACG\\ TGA\\ TGC\\ ATG\\ TCA-}3^{\\prime}
$$

La chaîne traduite avant UGA est **Met–Cys–Ala–Lys–Ile–His–Pro–Thr**. Une mutation TGC → TAC change Cys en Tyr ; une mutation CCG → CCC reste Pro et est silencieuse.

## La réponse parfaite au devoir

Une excellente copie ne donne pas seulement la chaîne finale. Elle annonce le type de brin, écrit les orientations, montre l’ARNm, encadre AUG et le premier codon stop, puis explique chaque différence par les codons concernés.

> **Davy te rappelle :** une lettre peut changer, mais la protéine ne change que si le nouveau codon n’est pas synonyme — ou s’il modifie le départ, l’arrêt ou le cadre de lecture.
`,
      investigation: [
        { label: "Orienter", detail: "Identifier le brin fourni et écrire clairement ses extrémités 5’ et 3’." },
        { label: "Transcrire", detail: "Construire l’ARNm par complémentarité avec le brin matrice ou par remplacement T → U depuis le brin codant." },
        { label: "Découper", detail: "Repérer AUG puis séparer l’ARNm en codons dans le bon cadre de lecture." },
        { label: "Traduire et comparer", shortLabel: "Comparer", detail: "Associer chaque codon à un acide aminé, s’arrêter au codon stop puis relever les substitutions." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Mission comparative",
        title: "Deux séquences proches, deux hormones différentes",
        instruction: "Ouvre les cartes de la méthode puis compare les positions 3 et 8.",
        rootLabel: "Deux brins codants d’ADN",
        rootDetail: "Les séquences officielles sont réinterprétées comme codantes, car elles produisent exactement les nonapeptides annoncés.",
        nodes: [
          { id: "orient", label: "1. Orienter 5’→3’", role: "Préparer", detail: "Le brin fourni est identifié comme codant et écrit dans le même sens que l’ARNm.", group: "Méthode" },
          { id: "transcribe", label: "2. Remplacer T par U", role: "Transcrire", detail: "Depuis un brin codant, l’ARNm conserve les lettres et remplace simplement T par U.", group: "Méthode" },
          { id: "frame", label: "3. Garder les triplets", role: "Cadrer", detail: "Les neuf codons doivent rester alignés position par position.", group: "Méthode" },
          { id: "position3", label: "Position 3", role: "Ile ↔ Phe", detail: "AUC donne isoleucine dans l’ocytocine ; UUC donne phénylalanine dans la vasopressine.", group: "Différences" },
          { id: "position8", label: "Position 8", role: "Leu ↔ Arg", detail: "CUG donne leucine ; AGA donne arginine.", group: "Différences" },
          { id: "synonyms", label: "Positions 7 et 9", role: "Codons synonymes", detail: "CCC/CCA donnent proline et GGC/GGA donnent glycine : les lettres diffèrent sans changer ces acides aminés.", group: "Ressemblances" },
        ],
        observation: "Comparer codon par codon distingue une substitution qui change l’acide aminé d’une substitution synonyme.",
      },
      modelAnswer: "L’ARN polymérase produit un ARNm complémentaire du brin matrice. Le ribosome le lit par codons ; les ARNt apportent les acides aminés correspondants. Des différences de nucléotides peuvent donc changer certains codons et la séquence de la protéine.",
      questions: [
        choice("Situation officielle — Comment faut-il interpréter les séquences TGC TAC… pour retrouver les hormones annoncées ?", ["Comme des brins matrices 5’→3’", "Comme des brins codants 5’→3’", "Comme des ARNt", "Comme des protéines"], 1, "Le remplacement T→U donne directement les ARNm des nonapeptides ; l’étiquette « non codant » du PDF est donc corrigée.", "Situation d’évaluation • page 9"),
        choice("Situation officielle — Quelle chaîne correspond à l’ocytocine ?", ["Cys–Tyr–Ile–Gln–Asn–Cys–Pro–Leu–Gly", "Cys–Tyr–Phe–Gln–Asn–Cys–Pro–Arg–Gly", "Met–Cys–Ala–Lys–Ile–His", "Tyr–Thr–Arg–Phe–Tyr–Val"], 0, "UGC UAC AUC CAG AAC UGC CCC CUG GGC se traduit dans cet ordre.", "Situation d’évaluation, consigne 2 • page 9"),
        choice("Situation officielle — À quelles positions les deux hormones diffèrent-elles ?", ["1 et 2", "4 et 6", "3 et 8", "7 et 9"], 2, "Ile/Phe diffèrent en position 3 et Leu/Arg en position 8.", "Situation d’évaluation, consigne 3 • page 9"),
      ],
      extraQuestions: [
        choice("Quel ARNm correspond au brin codant de l’ocytocine ?", ["ACG AUG UAG GUC UUG ACG GGG GAC CCG", "UGC UAC AUC CAG AAC UGC CCC CUG GGC", "TGC TAC ATC CAG AAC TGC CCC CTG GGC", "UGC UAC UUC CAG AAC UGC CCA AGA GGA"], 1, "Depuis le brin codant, on remplace T par U sans inverser l’ordre.", "Situation d’évaluation • page 9"),
        choice("Quels codons expliquent la différence en position 8 ?", ["AUC et UUC", "CCC et CCA", "GGC et GGA", "CUG et AGA"], 3, "CUG code la leucine et AGA l’arginine.", "Situation d’évaluation • page 9"),
        choice("Pourquoi CCC et CCA ne créent-ils pas de différence à la position 7 ?", ["Ils codent tous deux la proline", "Ils sont tous deux des stops", "Ils appartiennent à l’ADN uniquement", "Ils codent tous deux la glycine"], 0, "La redondance du code rend ces deux codons synonymes.", "Situation d’évaluation • page 9"),
        choice("Activité d’application — Quelle association est juste ?", ["Codon stop — anticodon porté par l’ARNt", "Anticodon — triplet complémentaire porté par l’ARNt", "Code redondant — un codon a plusieurs acides aminés", "Codon initiateur — UAA"], 1, "L’anticodon est le triplet de l’ARNt complémentaire du codon.", "Activité d’application • page 9"),
        choice("Situation albinisme corrigée — Quel ARNm vient de 3’-TAC ACG CGA TTT TAT GTA-5’ ?", ["5’-TAC ACG CGA TTT TAT GTA-3’", "3’-AUG UGC GCU AAA AUA CAU-5’", "5’-AUG UGC GCU AAA AUA CAU-3’", "5’-UAC ACG CGA UUU UAU GUA-3’"], 2, "La complémentarité avec le brin matrice donne AUG UGC GCU AAA AUA CAU.", "Situation d’évaluation 1, consignes 1-2 • pages 11-12"),
        choice("Quelle chaîne donne cet ARNm ?", ["Met–Cys–Ala–Lys–Ile–His", "Tyr–Thr–Arg–Phe–Tyr–Val", "Met–Gly puis arrêt", "Cys–Tyr–Ile–Gln–Asn–Cys"], 0, "Chaque codon est traduit dans l’ordre à partir d’AUG.", "Situation d’évaluation 1, consigne 3 • page 12"),
        choice("Dans le brin matrice, ACG devient ACA. Quel est l’effet ?", ["Un stop prématuré", "Cys devient Trp", "Le cadre est décalé", "UGC devient UGU, mais les deux codent Cys"], 3, "La substitution est silencieuse grâce à la redondance.", "Situation d’évaluation 1, consigne 4 • page 12"),
        choice("Dans le brin matrice, ACG devient ACC. Quel est l’effet ?", ["Aucun changement", "L’ARNm UGC devient UGG : Cys devient Trp", "Met devient stop", "Le ribosome disparaît"], 1, "Le nouveau codon UGG code le tryptophane : c’est une mutation faux-sens.", "Situation d’évaluation 1, consigne 5 • page 12"),
        choice("Situation 2 corrigée — Quel brin codant correspond à l’ARNm AUG UGC GCU ?", ["ATG TGC GCT", "TAC ACG CGA", "AUG UGC GCU", "UAC ACG CGA"], 0, "Le brin codant d’ADN reprend la séquence avec T à la place de U.", "Situation d’évaluation 2, consigne 1 • page 12"),
        choice("Dans l’ARNm de la situation 2, CCG devient CCC. Quel est l’effet ?", ["Pro devient stop", "Cys devient Tyr", "Pro reste Pro : mutation silencieuse", "Le cadre change"], 2, "CCG et CCC codent tous deux la proline.", "Situation d’évaluation 2, consigne 4 • page 12"),
        choice("Quelle présentation mérite tous les points pour une traduction ?", ["Écrire seulement le nom de la protéine", "Donner uniquement le nombre de codons", "Recopier l’ADN sans orientation", "Identifier le brin, orienter, écrire l’ARNm, cadrer, traduire et s’arrêter au stop"], 3, "Cette chaîne d’étapes rend le raisonnement vérifiable."),
      ],
      source: proteinBiosynthesisSource(
        "9-12",
        "Activité d’application et situations d’évaluation sur les hormones, l’albinisme et les substitutions",
        [
          "Les portions d’ocytocine et de vasopressine étiquetées « brin non codant » sont rétablies comme brins codants 5’→3’, seule lecture donnant les nonapeptides annoncés.",
          "La séquence TAC ACG… de l’exercice sur l’albinisme est réorientée comme brin matrice 3’→5’ afin de produire l’ARNm AUG UGC… attendu par les substitutions proposées.",
          "La séquence de l’exercice 2, qui mélange thymine et uracile, est normalisée en ARNm ; la traduction s’arrête au premier UGA.",
          "Les substitutions sont qualifiées : UGC→UGU silencieuse, UGC→UGG faux-sens, TGC→TAC faux-sens et CCG→CCC silencieuse.",
          "Le lien entre une courte séquence et l’albinisme est présenté comme modèle pédagogique, non comme diagnostic clinique complet.",
        ],
      ),
    },
  };

export const terminalASvtProteinBiosynthesisPath = createSvtPath(course);
