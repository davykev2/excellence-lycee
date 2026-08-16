import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  LessonSourceMetadata,
  SchemaHotspot,
  SchemaShape,
} from "../domain/paths";

const sourceDocument = "SVT Tle C_L4_Lutilisation de lénergie par la cellule musculaire.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel?: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel?: string,
  points = 1,
): LessonQuestion => ({
  type: "short-answer",
  prompt,
  options: [],
  correctIndex: 0,
  acceptedAnswers,
  explanation,
  sourceLabel,
  points,
});

const trueFalse = (
  prompt: string,
  answer: boolean,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], answer ? 0 : 1, explanation, sourceLabel);

const source = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages,
  section,
  fidelity: corrections.length ? "faithful-corrected" : "faithful",
  corrections,
});

const diagram = (
  title: string,
  instruction: string,
  rootLabel: string,
  rootDetail: string,
  nodes: DiagramNodeItem[],
  observation: string,
): LessonInteraction => ({
  kind: "diagram",
  eyebrow: "Carte à explorer",
  title,
  instruction,
  rootLabel,
  rootDetail,
  nodes: nodes as [DiagramNodeItem, DiagramNodeItem, ...DiagramNodeItem[]],
  observation,
});

interface LevelSeed {
  id: string;
  title: string;
  summary: string;
  pages: string;
  section: string;
  durationMinutes: number;
  xp: number;
  kind?: LessonKind;
  body: string;
  keyPoint: string;
  example: string;
  methodSteps: string[];
  interaction: LessonInteraction;
  questions: LessonQuestion[];
  corrections: string[];
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed.pages, seed.section, seed.corrections),
    concept: {
      eyebrow: `Niveau ${index + 1} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Décris précisément le document, relie les observations au fonctionnement du muscle, puis conclus avec le vocabulaire scientifique attendu.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : structure, mécanisme et énergie doivent toujours être reliés dans ta réponse.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const sarcomereShapes: SchemaShape[] = [
  { shape: "line", x1: 90, y1: 95, x2: 90, y2: 320, tone: "accent" },
  { shape: "line", x1: 670, y1: 95, x2: 670, y2: 320, tone: "accent" },
  { shape: "line", x1: 90, y1: 180, x2: 330, y2: 180, tone: "outline" },
  { shape: "line", x1: 90, y1: 235, x2: 330, y2: 235, tone: "outline" },
  { shape: "line", x1: 670, y1: 180, x2: 430, y2: 180, tone: "outline" },
  { shape: "line", x1: 670, y1: 235, x2: 430, y2: 235, tone: "outline" },
  { shape: "line", x1: 245, y1: 208, x2: 515, y2: 208, tone: "fill" },
  { shape: "line", x1: 380, y1: 155, x2: 380, y2: 260, tone: "muted" },
  { shape: "path", d: "M90 72 L670 72 M90 65 L90 79 M670 65 L670 79", tone: "soft" },
  { shape: "text", x: 380, y: 50, content: "sarcomère", anchor: "middle" },
  { shape: "text", x: 145, y: 350, content: "bande I", anchor: "middle" },
  { shape: "text", x: 380, y: 350, content: "bande A", anchor: "middle" },
  { shape: "text", x: 615, y: 350, content: "bande I", anchor: "middle" },
];

const sarcomereHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "z-left", number: 1, label: "Strie Z", x: 90, y: 110, detail: "Une strie Z limite chaque extrémité du sarcomère et ancre les filaments fins d’actine." },
  { id: "actin", number: 2, label: "Filament fin d’actine", x: 235, y: 180, detail: "L’actine part de la strie Z et pénètre dans la bande A. Sa longueur ne diminue pas pendant la contraction.", highlight: [{ shape: "line", x1: 90, y1: 180, x2: 330, y2: 180, tone: "accent" }] },
  { id: "myosin", number: 3, label: "Filament épais de myosine", x: 380, y: 208, detail: "La myosine occupe la bande A. Ses têtes forment temporairement des ponts avec l’actine.", highlight: [{ shape: "line", x1: 245, y1: 208, x2: 515, y2: 208, tone: "accent" }] },
  { id: "m-line", number: 4, label: "Ligne M", x: 380, y: 265, detail: "La ligne M constitue le centre du sarcomère et organise les filaments épais." },
  { id: "i-band", number: 5, label: "Bande I", x: 145, y: 305, detail: "Elle ne contient que des filaments fins. Elle se raccourcit lorsque le sarcomère se contracte." },
  { id: "a-band", number: 6, label: "Bande A", x: 515, y: 305, detail: "Sa largeur correspond à la longueur des filaments épais et reste pratiquement constante pendant la contraction." },
];

const levels: LevelSeed[] = [
  {
    id: "muscle-fiber-organization",
    title: "De l’organe à la fibre musculaire",
    summary: "Situer muscle, faisceau, fibre, myofibrille et sarcomère dans une organisation emboîtée.",
    pages: "1-2 et 10",
    section: "Organisation du muscle strié squelettique et exercice de vocabulaire",
    durationMinutes: 24,
    xp: 45,
    body: `
## 1. Une organisation à plusieurs échelles

Un **muscle strié squelettique** est un organe relié aux os par des tendons. Il est entouré d’une enveloppe conjonctive et formé de nombreux **faisceaux**. Chaque faisceau réunit de longues cellules cylindriques : les **fibres musculaires**.

| Échelle | Structure | Fonction ou caractéristique |
|---|---|---|
| organe | muscle | produit une force transmise au squelette |
| tissu | faisceau | regroupe plusieurs fibres musculaires |
| cellule | fibre musculaire | cellule allongée, plurinucléée et excitable |
| organite contractile | myofibrille | succession régulière de zones claires et sombres |
| unité répétée | sarcomère | portion comprise entre deux stries Z |
| moléculaire | myofilaments | actine fine et myosine épaisse |

Cette hiérarchie explique l’aspect strié : les sarcomères des myofibrilles sont alignés. La répétition ordonnée des bandes claires et sombres devient visible dans toute la fibre.

## 2. Les éléments d’une fibre

La membrane plasmique de la fibre est le **sarcolemme** ; son cytoplasme est le **sarcoplasme**. Le sarcoplasme contient notamment des myofibrilles, des mitochondries, des réserves de glycogène et de la myoglobine. Autour des myofibrilles, le **réticulum sarcoplasmique** stocke les ions calcium nécessaires au déclenchement de la contraction.

> **Précision :** sur une coupe de muscle entier, l’enveloppe visible autour du muscle est un tissu conjonctif. Le sarcolemme, lui, entoure chaque fibre musculaire ; ce ne sont pas deux noms pour la même structure.

## 3. Du nerf au mouvement

Un nerf moteur commande plusieurs fibres. À la jonction neuromusculaire, le message nerveux déclenche un potentiel d’action dans le sarcolemme. Le signal atteint ensuite l’intérieur de la fibre par les tubules transverses et provoque la libération de calcium. Les myofibrilles convertissent enfin l’énergie chimique de l’ATP en travail mécanique.

> **Astuce mémoire — M-F-F-M-S :** **M**uscle → **F**aisceau → **F**ibre → **M**yofibrille → **S**arcomère. Du plus grand au plus petit, tu peux reconstruire toute la chaîne.
`,
    keyPoint: "Un muscle contient des faisceaux de fibres ; chaque fibre contient des myofibrilles formées d’une succession de sarcomères.",
    example: "Si l’on observe une striation dans une fibre, on l’explique par l’alignement régulier des sarcomères de ses myofibrilles.",
    methodSteps: [
      "Classe les structures de la plus grande à la plus petite.",
      "Identifie la fibre musculaire comme une cellule et non comme un faisceau.",
      "Associe la myofibrille à la striation et le sarcomère à l’unité contractile.",
      "Relie le réticulum sarcoplasmique au stockage du calcium.",
    ],
    interaction: diagram(
      "Explorer les échelles du muscle",
      "Sélectionne chaque niveau d’organisation et repère ce qu’il contient.",
      "Muscle strié squelettique",
      "L’organe produit une force grâce à l’action coordonnée de milliers de sarcomères.",
      [
        { id: "bundle", label: "Faisceau", role: "Regroupe les fibres", detail: "Un faisceau est une portion du tissu musculaire entourée de tissu conjonctif." },
        { id: "fiber", label: "Fibre musculaire", role: "Cellule plurinucléée", detail: "La fibre possède un sarcolemme, un sarcoplasme et de nombreuses myofibrilles." },
        { id: "myofibril", label: "Myofibrille", role: "Élément strié", detail: "Elle traverse presque toute la fibre et rassemble les sarcomères en série." },
        { id: "sarcomere", label: "Sarcomère", role: "Unité contractile", detail: "Il s’étend d’une strie Z à la suivante et se raccourcit pendant la contraction." },
        { id: "filaments", label: "Myofilaments", role: "Actine + myosine", detail: "Le glissement relatif des filaments raccourcit le sarcomère sans raccourcir les filaments eux-mêmes." },
      ],
      "Ne confonds pas fibre et myofibrille : la fibre est la cellule ; les myofibrilles sont des structures contractiles à l’intérieur de cette cellule.",
    ),
    questions: [
      choice("Quelle structure correspond à une cellule musculaire ?", ["La fibre musculaire", "Le faisceau", "Le tendon", "Le sarcomère"], 0, "La fibre est une cellule longue et plurinucléée.", "Figure d’organisation • pages 1-2"),
      choice("Qu’est-ce qu’un faisceau musculaire ?", ["Une protéine", "Un regroupement de fibres", "Une membrane cellulaire", "Un ion"], 1, "Le faisceau rassemble plusieurs fibres musculaires."),
      choice("Quelle structure présente une succession de stries ?", ["Le noyau", "Le tendon", "La myofibrille", "Le sang"], 2, "L’organisation répétée des sarcomères strie la myofibrille."),
      choice("Entre quelles limites se trouve un sarcomère ?", ["Deux lignes M", "Deux membranes", "Deux tendons", "Deux stries Z"], 3, "Le sarcomère est défini par deux stries Z successives."),
      trueFalse("Le sarcolemme est la membrane plasmique de la fibre musculaire.", true, "Le terme sarcolemme désigne bien la membrane de la fibre."),
      choice("Quel compartiment stocke principalement le calcium mobilisé pour la contraction ?", ["Le réticulum sarcoplasmique", "Le noyau", "Le tendon", "Le faisceau"], 0, "Le réticulum sarcoplasmique libère puis récupère les ions Ca²⁺."),
      choice("Quel ordre va du plus grand au plus petit ?", ["Sarcomère–fibre–muscle", "Muscle–faisceau–fibre–myofibrille", "Fibre–muscle–actine", "Myofibrille–faisceau–muscle"], 1, "C’est l’ordre hiérarchique attendu."),
      choice("Quelles protéines forment les deux grands types de myofilaments ?", ["Kératine et collagène", "ADN et ARN", "Actine et myosine", "Insuline et glucagon"], 2, "L’actine forme les filaments fins et la myosine les filaments épais."),
      choice("Quelle structure relie généralement le muscle à l’os ?", ["Le sarcoplasme", "La strie Z", "La mitochondrie", "Le tendon"], 3, "Le tendon transmet la force produite par le muscle à l’os."),
      short("Nomme l’unité contractile comprise entre deux stries Z.", ["sarcomère", "le sarcomère", "sarcomere", "le sarcomere"], "L’unité répétée des myofibrilles est le sarcomère.", "Vocabulaire • page 10"),
    ],
    corrections: [
      "L’enveloppe externe du muscle entier est distinguée du sarcolemme propre à chaque fibre.",
      "La hiérarchie muscle–faisceau–fibre–myofibrille–sarcomère est explicitée à partir des figures du document.",
      "Le rôle du réticulum sarcoplasmique est ajouté pour préparer le mécanisme calcique développé plus loin.",
    ],
  },
  {
    id: "sarcomere-bands-filaments",
    title: "Lire l’organisation d’un sarcomère",
    summary: "Identifier stries Z, bandes I et A, zone H, ligne M ainsi que la disposition de l’actine et de la myosine.",
    pages: "2-4",
    section: "Ultrastructure de la myofibrille et état du sarcomère au repos",
    durationMinutes: 27,
    xp: 50,
    body: `
## 1. L’unité répétée de la myofibrille

Le **sarcomère** va d’une strie Z à la strie Z suivante. Il contient deux catégories de filaments qui se chevauchent partiellement :

- les filaments fins, principalement formés d’**actine**, partent des stries Z ;
- les filaments épais, principalement formés de **myosine**, occupent la région centrale et sont organisés autour de la ligne M.

Les filaments ne sont pas distribués au hasard. Leur disposition crée plusieurs zones visibles en microscopie.

| Repère | Contenu principal | Évolution pendant la contraction |
|---|---|---|
| strie Z | limite et ancrage de l’actine | les deux stries Z se rapprochent |
| bande I | actine seule | se raccourcit |
| bande A | longueur totale des filaments de myosine | reste pratiquement constante |
| zone H | myosine seule, au centre | diminue ou disparaît |
| ligne M | centre et organisation des filaments épais | reste au centre |

## 2. Chevauchement et striation

La partie sombre de la bande A inclut les zones où actine et myosine se chevauchent. La zone H est plus claire parce qu’elle ne contient que les filaments épais. La bande I est claire parce qu’elle ne contient que des filaments fins.

La longueur de la bande A sert de repère crucial : si elle reste constante alors que le sarcomère raccourcit, les filaments ne sont pas détruits ni raccourcis. Ils **glissent** les uns par rapport aux autres.

## 3. Lire un schéma sans se tromper

Commence toujours par repérer les deux stries Z, puis le centre M. Situe ensuite la bande A autour de la myosine. Les bandes I sont aux extrémités du sarcomère et la zone H au milieu de la bande A.

> **Astuce mémoire — I = actIne seule ; A = toute la myosine :** la bande I contient l’actine sans myosine, tandis que la bande A couvre toute la longueur des filaments épais.

> **Attention :** la bande A ne signifie pas « bande d’actine ». Son nom historique ne décrit pas la protéine qu’elle contient.
`,
    keyPoint: "La bande A correspond à la longueur des filaments épais ; les bandes I et la zone H diminuent lorsque l’actine glisse vers la ligne M.",
    example: "Sur une micrographie, une zone claire à côté d’une strie Z correspond à une bande I ; une zone claire au centre de la bande A correspond à la zone H.",
    methodSteps: [
      "Délimite d’abord le sarcomère entre deux stries Z.",
      "Repère la ligne M au centre et la bande A autour des filaments épais.",
      "Situe les bandes I près des stries Z et la zone H au centre.",
      "Associe chaque variation de largeur au glissement des filaments.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure originale annotée",
      title: "Anatomie fonctionnelle du sarcomère",
      instruction: "Appuie sur chaque repère pour faire apparaître sa fonction et son évolution pendant la contraction.",
      viewBox: "0 0 760 390",
      caption: "Schéma pédagogique original inspiré des figures des pages 2 à 4 ; proportions volontairement simplifiées.",
      shapes: sarcomereShapes,
      hotspots: sarcomereHotspots,
      observation: "La bande A suit la longueur de la myosine ; le rapprochement des stries Z réduit surtout les bandes I et la zone H.",
    },
    questions: [
      choice("Quelle structure limite un sarcomère ?", ["Deux stries Z", "Deux lignes M", "Deux noyaux", "Deux tendons"], 0, "Le sarcomère s’étend entre deux stries Z.", "Figure du sarcomère • pages 2-3"),
      choice("Quelle bande contient uniquement des filaments fins ?", ["La bande A", "La bande I", "La ligne M", "La zone de jonction"], 1, "La bande I ne contient que l’actine."),
      choice("Quelle zone contient uniquement de la myosine ?", ["La strie Z", "La bande I", "La zone H", "Le tendon"], 2, "La zone H est la partie centrale sans chevauchement avec l’actine."),
      choice("Quelle structure se trouve au centre du sarcomère ?", ["Le sarcolemme", "La strie Z", "Le noyau", "La ligne M"], 3, "La ligne M organise la région centrale des filaments épais."),
      trueFalse("La largeur de la bande A diminue fortement pendant une contraction normale.", false, "Elle reste pratiquement constante car la myosine ne raccourcit pas."),
      choice("À quoi sont ancrés les filaments fins ?", ["Aux stries Z", "À la membrane nucléaire", "Au tendon uniquement", "À la ligne H"], 0, "L’actine part des stries Z."),
      choice("Quel filament est le plus épais ?", ["L’actine", "La myosine", "La troponine", "Le collagène"], 1, "La myosine forme les filaments épais."),
      choice("Qu’est-ce qui produit l’aspect strié de la fibre ?", ["Des noyaux alternés", "Des vaisseaux alignés", "L’alternance régulière des bandes", "Des tendons microscopiques"], 2, "Les bandes des sarcomères alignés produisent la striation."),
      choice("Quelle zone peut disparaître lors d’une forte contraction ?", ["La ligne M", "La bande A", "La strie Z", "La zone H"], 3, "L’augmentation du chevauchement peut réduire fortement la zone H."),
      short("Nomme la bande dont la largeur correspond à la longueur des filaments épais.", ["bande A", "la bande A", "A"], "La bande A couvre toute la longueur de la myosine."),
      short("Nomme les filaments fins du sarcomère.", ["actine", "l’actine", "filaments d’actine", "les filaments d’actine"], "Les filaments fins sont principalement constitués d’actine."),
    ],
    corrections: [
      "La bande A est explicitement définie par la longueur des filaments épais afin d’éviter l’association trompeuse entre A et actine.",
      "Les variations des bandes sont reliées au glissement, sans prétendre que les filaments se raccourcissent.",
      "Le schéma est une reconstruction originale et non une reproduction des figures protégées du PDF.",
    ],
  },
  {
    id: "sarcomere-shortening-evidence",
    title: "Démontrer le glissement des filaments",
    summary: "Comparer un sarcomère relâché et un sarcomère contracté pour expliquer son raccourcissement.",
    pages: "3-5",
    section: "Modifications du sarcomère au cours de la contraction",
    durationMinutes: 25,
    xp: 55,
    body: `
## 1. Les faits observables

Le document compare une myofibrille au repos et une myofibrille contractée. Plusieurs changements sont simultanés :

- les stries Z se rapprochent ;
- la longueur du sarcomère diminue ;
- les bandes I deviennent plus étroites ;
- la zone H diminue, voire disparaît ;
- la bande A conserve sensiblement la même largeur.

Ces observations éliminent l’idée d’un raccourcissement des protéines. Si les filaments épais devenaient plus courts, la bande A diminuerait. Or elle reste stable.

## 2. Le modèle du glissement

Les têtes de myosine se lient cycliquement à l’actine et la tirent vers la ligne M. Les filaments fins s’enfoncent donc davantage entre les filaments épais. Le chevauchement augmente, sans modification importante de la longueur de l’actine ni de la myosine.

On peut résumer la relation par :

$$\\text{raccourcissement du sarcomère} = \\text{rapprochement des stries Z par glissement}$$

Le raccourcissement simultané de milliers de sarcomères placés en série raccourcit la myofibrille ; l’action coordonnée des myofibrilles produit la contraction de la fibre puis celle du muscle.

## 3. Une preuve construite, pas récitée

Pour démontrer le modèle, il faut articuler **observation → déduction → conclusion** :

1. la bande A est constante : la longueur de la myosine est constante ;
2. I et H diminuent : les zones sans chevauchement se réduisent ;
3. les stries Z se rapprochent : l’actine avance vers le centre ;
4. donc les filaments glissent sans se raccourcir.

> **Astuce mémoire — A reste, I et H diminuent :** si tu retiens cette phrase, tu peux reconstruire la preuve du glissement.

> **Précision :** à une longueur trop courte, les filaments peuvent se gêner ; plus de chevauchement ne signifie donc pas toujours plus de force.
`,
    keyPoint: "La contraction raccourcit le sarcomère par glissement de l’actine entre les filaments de myosine ; la longueur des deux filaments reste constante.",
    example: "Bande A identique, bandes I plus petites et stries Z rapprochées : ce trio d’indices prouve un glissement vers la ligne M.",
    methodSteps: [
      "Compare les mêmes repères dans l’état relâché et l’état contracté.",
      "Distingue ce qui diminue de ce qui reste constant.",
      "Relie la diminution de I et H à l’augmentation du chevauchement.",
      "Conclue que les filaments glissent sans changer de longueur.",
    ],
    interaction: diagram(
      "Comparer repos et contraction",
      "Explore les repères qui fournissent la preuve expérimentale du glissement.",
      "Deux états du même sarcomère",
      "La comparaison porte sur les stries Z, les bandes I et A et la zone H.",
      [
        { id: "z", label: "Distance Z–Z", role: "Diminue", detail: "Le rapprochement des stries Z mesure directement le raccourcissement du sarcomère." },
        { id: "i", label: "Bandes I", role: "Diminuent", detail: "Les zones d’actine seule se réduisent car l’actine pénètre davantage dans la bande A." },
        { id: "h", label: "Zone H", role: "Diminue", detail: "La zone de myosine seule se rétrécit à mesure que le chevauchement augmente." },
        { id: "a", label: "Bande A", role: "Reste constante", detail: "La longueur du filament épais ne change pratiquement pas." },
        { id: "sliding", label: "Conclusion", role: "Glissement", detail: "Les filaments conservent leur longueur et se déplacent les uns par rapport aux autres." },
      ],
      "La constance de la bande A est l’indice décisif qui réfute le raccourcissement des filaments épais.",
    ),
    questions: [
      choice("Que deviennent les stries Z pendant la contraction ?", ["Elles se rapprochent", "Elles disparaissent", "Elles s’éloignent", "Elles deviennent des noyaux"], 0, "Leur rapprochement raccourcit le sarcomère.", "Comparaison des états • pages 3-4"),
      choice("Quelle zone diminue parce que le chevauchement augmente au centre ?", ["La bande A", "La zone H", "La ligne M", "La membrane"], 1, "La zone H correspond à la myosine seule."),
      choice("Quelle propriété de la bande A appuie le modèle du glissement ?", ["Elle disparaît", "Elle double", "Sa largeur reste constante", "Elle devient une strie Z"], 2, "La myosine conserve sa longueur."),
      choice("Dans quelle direction l’actine glisse-t-elle ?", ["Vers le tendon", "Vers le noyau", "Vers le sarcolemme", "Vers la ligne M"], 3, "Les filaments fins sont tirés vers le centre du sarcomère."),
      trueFalse("Les filaments d’actine raccourcissent chimiquement au cours de la contraction.", false, "Ils glissent sans raccourcir."),
      choice("Quelle bande se réduit près des stries Z ?", ["La bande I", "La bande A", "La ligne M", "Le tendon"], 0, "La bande I contient l’actine seule et diminue."),
      choice("Qu’est-ce qui augmente pendant la contraction ?", ["La longueur de la myosine", "Le chevauchement actine–myosine", "La distance Z–Z", "La largeur de la zone H"], 1, "Le glissement augmente le chevauchement."),
      choice("Quel enchaînement est correct ?", ["A diminue donc myosine raccourcie", "Z s’éloignent donc contraction", "I et H diminuent, A stable, donc glissement", "Tout reste constant"], 2, "C’est la preuve structurée attendue."),
      choice("À quelle échelle le raccourcissement élémentaire se produit-il ?", ["Au tendon", "Au noyau", "Au sang", "Au sarcomère"], 3, "Le sarcomère est l’unité contractile élémentaire."),
      short("Complète : pendant la contraction, les filaments … les uns par rapport aux autres.", ["glissent", "glisser", "se déplacent", "coulissent"], "Le modèle est celui du glissement des filaments."),
    ],
    corrections: [
      "La démonstration explicite la constance de la bande A, souvent visible mais insuffisamment exploitée dans le document.",
      "Le texte précise que ni l’actine ni la myosine ne se raccourcissent pendant une contraction normale.",
      "La relation entre sarcomère, myofibrille, fibre et muscle est rendue causale.",
    ],
  },
  {
    id: "excitation-calcium-coupling",
    title: "Du message nerveux au calcium",
    summary: "Expliquer comment l’excitation de la fibre libère le calcium et rend les sites de l’actine accessibles.",
    pages: "4-6 et 12-13",
    section: "Couplage excitation–contraction et exercice sur l’injection de calcium",
    durationMinutes: 29,
    xp: 65,
    body: `
## 1. Le signal atteint toute la fibre

À la jonction neuromusculaire, l’arrivée d’un message dans le neurone moteur provoque la libération d’un neurotransmetteur. Celui-ci déclenche un potentiel d’action dans le **sarcolemme**. Le signal se propage à la surface puis pénètre au cœur de la fibre grâce aux tubules transverses, ou **tubules T**.

Les tubules T sont étroitement associés au réticulum sarcoplasmique. Le changement électrique entraîne l’ouverture coordonnée de canaux et la libération d’ions calcium dans le sarcoplasme :

$$\\mathrm{Ca^{2+}_{RS} \\longrightarrow Ca^{2+}_{cytosol}}$$

## 2. Le calcium lève le verrou

Au repos, la **tropomyosine** masque une grande partie des sites de liaison de la myosine sur l’actine. Lorsque la concentration cytosolique en $\\mathrm{Ca^{2+}}$ augmente, le calcium se fixe sur la **troponine C**. Le complexe change de forme et déplace la tropomyosine. Les sites de l’actine deviennent accessibles : les têtes de myosine peuvent former des ponts.

La chaîne exacte est donc :

$$\\text{excitation} \\rightarrow \\mathrm{Ca^{2+}} \\rightarrow \\text{troponine} \\rightarrow \\text{déplacement de la tropomyosine} \\rightarrow \\text{ponts actine–myosine}$$

## 3. Pourquoi le muscle se relâche

Après l’excitation, des pompes **SERCA** utilisent de l’ATP pour ramener le calcium dans le réticulum sarcoplasmique. La concentration cytosolique baisse, la troponine reprend sa conformation de repos, la tropomyosine masque les sites et les ponts cessent de se former.

L’ATP intervient donc à deux endroits essentiels : dans le cycle des têtes de myosine et dans la recapture du calcium.

## 4. L’expérience d’injection

L’exercice du document décrit l’injection de calcium dans une fibre. Une contraction apparaît parce que le calcium joue le rôle de signal intracellulaire immédiat. Cependant, du calcium seul ne suffit pas durablement : il faut aussi de l’ATP et un appareil contractile intact.

> **Correction scientifique :** le calcium ne se fixe pas directement à la tropomyosine. Il se fixe à la **troponine C**, qui déplace ensuite la tropomyosine.

> **Astuce mémoire — C-C-C :** **C**alcium → **C** sur la troponine → **C**ontraction autorisée.
`,
    keyPoint: "Le calcium libéré par le réticulum se fixe à la troponine C, déplace la tropomyosine et autorise les ponts actine–myosine.",
    example: "Une injection de Ca²⁺ provoque une contraction si l’ATP est disponible : le calcium découvre les sites de l’actine, puis les têtes de myosine peuvent cycler.",
    methodSteps: [
      "Pars du potentiel d’action qui se propage sur le sarcolemme et les tubules T.",
      "Place la libération de Ca²⁺ depuis le réticulum sarcoplasmique.",
      "Nomme la troponine C avant le déplacement de la tropomyosine.",
      "Explique enfin la recapture du calcium et le relâchement.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Chronologie interactive",
      title: "Dérouler le couplage excitation–contraction",
      instruction: "Avance étape par étape et repère le rôle du calcium avant celui de l’ATP.",
      items: [
        { label: "Excitation", shortLabel: "PA", detail: "Le potentiel d’action parcourt le sarcolemme puis les tubules T." },
        { label: "Libération", shortLabel: "Ca²⁺", detail: "Le réticulum sarcoplasmique libère rapidement du calcium dans le cytosol." },
        { label: "Troponine", shortLabel: "TnC", detail: "Ca²⁺ se fixe à la troponine C et modifie la conformation du complexe régulateur." },
        { label: "Déverrouillage", shortLabel: "Sites", detail: "La tropomyosine se déplace et les sites de liaison de la myosine deviennent accessibles." },
        { label: "Contraction", shortLabel: "Ponts", detail: "Les ponts actine–myosine cyclent tant que Ca²⁺ et ATP sont disponibles." },
        { label: "Relaxation", shortLabel: "SERCA", detail: "Les pompes SERCA consomment de l’ATP pour réaccumuler Ca²⁺ dans le réticulum." },
      ],
      observation: "Le calcium est le signal qui autorise la contraction ; il n’est ni le carburant chimique du pont ni une protéine contractile.",
    },
    questions: [
      choice("Par quelle structure le potentiel d’action pénètre-t-il au cœur de la fibre ?", ["Les tubules T", "Les tendons", "Les stries Z", "Les ribosomes"], 0, "Les tubules transverses conduisent le signal près du réticulum.", "Mécanisme • pages 4-6"),
      choice("Quel compartiment libère le calcium ?", ["Le noyau", "Le réticulum sarcoplasmique", "Le tendon", "Le sang uniquement"], 1, "Le réticulum est la réserve intracellulaire principale."),
      choice("Sur quelle protéine le calcium se fixe-t-il directement ?", ["La myosine", "La tropomyosine", "La troponine C", "Le collagène"], 2, "Ca²⁺ se lie à la troponine C."),
      choice("Que fait alors la tropomyosine ?", ["Elle fabrique de l’ATP", "Elle détruit l’actine", "Elle libère du glucose", "Elle se déplace et découvre les sites"], 3, "Le déplacement de la tropomyosine autorise la liaison de la myosine."),
      trueFalse("Le calcium fournit directement l’énergie du coup de force de la myosine.", false, "L’énergie provient du cycle de l’ATP ; Ca²⁺ régule l’accès aux sites."),
      choice("Quelle pompe ramène le calcium dans le réticulum ?", ["SERCA", "ATP synthase", "Pompe à glucose", "Myokinase"], 0, "SERCA est la Ca²⁺-ATPase du réticulum."),
      choice("Pourquoi la recapture du calcium favorise-t-elle le relâchement ?", ["Elle coupe l’actine", "Les sites sont de nouveau masqués", "Elle forme du lactate", "Elle augmente la température"], 1, "Sans Ca²⁺ sur la troponine, la tropomyosine bloque de nouveau les sites."),
      choice("Quel résultat suit normalement une injection de Ca²⁺ dans une fibre fonctionnelle avec ATP ?", ["Une réplication", "Une digestion", "Une contraction", "Une photosynthèse"], 2, "Le calcium rend possibles les ponts actine–myosine.", "Exercice • pages 12-13"),
      choice("Quel ordre est correct ?", ["Ponts–PA–Ca²⁺", "Ca²⁺–PA–troponine", "ATP–tendon–noyau", "PA–Ca²⁺–troponine–ponts"], 3, "Cet ordre restitue le couplage."),
      short("Nomme la protéine régulatrice sur laquelle se fixe Ca²⁺.", ["troponine", "la troponine", "troponine C", "la troponine C", "TnC"], "La sous-unité directement liée au calcium est la troponine C."),
      short("Nomme la structure qui stocke le calcium dans la fibre.", ["réticulum sarcoplasmique", "le réticulum sarcoplasmique", "reticulum sarcoplasmique", "RS"], "Le réticulum sarcoplasmique constitue la réserve intracellulaire de Ca²⁺."),
    ],
    corrections: [
      "Le calcium est corrigé comme ligand de la troponine C, et non de la tropomyosine directement.",
      "La recapture par SERCA et sa consommation d’ATP sont ajoutées pour expliquer réellement le relâchement.",
      "L’effet d’une injection de calcium est conditionné à la présence d’ATP et d’un appareil contractile fonctionnel.",
    ],
  },
  {
    id: "actomyosin-cross-bridge-cycle",
    title: "Suivre le cycle actine–myosine",
    summary: "Ordonner fixation, coup de force, détachement par l’ATP et réarmement de la tête de myosine.",
    pages: "5-7 et 13",
    section: "Mécanisme moléculaire de la contraction et correction de l’exercice 4",
    durationMinutes: 31,
    xp: 75,
    body: `
## 1. La tête de myosine est un moteur moléculaire

Chaque tête de myosine possède un site de liaison à l’actine et une activité **ATPase**. Lorsque le calcium a découvert les sites de l’actine, la tête peut effectuer un cycle en plusieurs étapes.

1. **Fixation :** une tête portant $\\mathrm{ADP + P_i}$ se lie à l’actine.
2. **Coup de force :** la libération de $\\mathrm{P_i}$, puis d’ADP, accompagne le pivotement de la tête et le déplacement de l’actine vers la ligne M.
3. **Détachement :** une nouvelle molécule d’ATP se fixe à la myosine et diminue son affinité pour l’actine ; le pont se rompt.
4. **Réarmement :** l’ATP est hydrolysé en $\\mathrm{ADP + P_i}$ ; l’énergie remet la tête dans une position prête pour un nouveau cycle.

Le bilan énergétique élémentaire est :

$$\\mathrm{ATP + H_2O \\longrightarrow ADP + P_i} + \\text{énergie}$$

## 2. Ce que fait réellement l’ATP

Il faut distinguer trois fonctions :

- la **fixation de l’ATP** détache la myosine de l’actine ;
- l’**hydrolyse de l’ATP** réarme la tête ;
- l’ATP fournit aussi l’énergie à SERCA pour la recapture du calcium.

En absence d’ATP, les ponts déjà formés restent bloqués. C’est l’une des bases moléculaires de la rigidité cadavérique.

## 3. Des cycles non synchrones

Toutes les têtes ne se détachent pas en même temps. Leur fonctionnement décalé maintient la tension et permet un glissement continu. Tant que le calcium cytosolique reste élevé et que l’ATP est disponible, les cycles peuvent se répéter.

> **Correction du document :** ce n’est pas une nouvelle hydrolyse d’ATP qui provoque directement la dissociation du complexe actine–myosine. C’est d’abord la **fixation de l’ATP** sur la myosine ; l’hydrolyse vient ensuite pour réarmer la tête.

> **Astuce mémoire — F-C-D-R :** **F**ixation à l’actine, **C**oup de force, **D**étachement par ATP, **R**éarmement par hydrolyse.
`,
    keyPoint: "L’ATP se fixe pour détacher la myosine ; son hydrolyse réarme la tête, puis la libération de Pi participe au coup de force suivant.",
    example: "Si l’ATP manque, la myosine ne peut plus se détacher de l’actine : les ponts restent verrouillés malgré l’arrêt du renouvellement énergétique.",
    methodSteps: [
      "Vérifie d’abord que Ca²⁺ a rendu les sites de l’actine accessibles.",
      "Place la tête chargée en ADP + Pi avant le coup de force.",
      "Associe la fixation d’un nouvel ATP au détachement.",
      "Associe ensuite l’hydrolyse au réarmement de la tête.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Cycle moléculaire interactif",
      title: "Faire tourner une tête de myosine",
      instruction: "Avance dans le cycle et surveille la forme nucléotidique portée par la tête.",
      items: [
        { label: "Tête armée", shortLabel: "ADP + Pi", detail: "L’hydrolyse de l’ATP a placé la tête dans une conformation riche en énergie." },
        { label: "Pont formé", shortLabel: "Actine", detail: "La tête se fixe sur un site d’actine découvert par le calcium." },
        { label: "Coup de force", shortLabel: "Pi ↓", detail: "La libération de Pi déclenche le pivotement et tire le filament fin vers la ligne M." },
        { label: "État fortement lié", shortLabel: "ADP ↓", detail: "L’ADP est libéré ; la tête reste momentanément liée à l’actine." },
        { label: "Détachement", shortLabel: "ATP ↑", detail: "La fixation d’une nouvelle molécule d’ATP rompt l’interaction actine–myosine." },
        { label: "Réarmement", shortLabel: "Hydrolyse", detail: "ATP devient ADP + Pi ; la tête reprend sa position de départ." },
      ],
      observation: "Le mot décisif est fixation : l’ATP doit d’abord se fixer pour détacher la tête, puis être hydrolysé pour la réarmer.",
    },
    questions: [
      choice("Quel événement détache directement la myosine de l’actine ?", ["La fixation d’un ATP", "La fixation du glucose", "La libération du calcium", "La synthèse d’actine"], 0, "L’ATP réduit l’affinité de la myosine pour l’actine.", "Cycle contractile • pages 5-7"),
      choice("Que porte une tête armée avant sa fixation ?", ["ATP intact uniquement", "ADP + Pi", "Glucose + O₂", "Lactate + CO₂"], 1, "L’hydrolyse a laissé ADP et Pi liés à la tête."),
      choice("Quel événement accompagne le déclenchement du coup de force ?", ["La fixation du calcium sur la myosine", "L’entrée du glucose", "La libération de Pi", "La synthèse d’ADN"], 2, "La sortie de Pi est étroitement couplée au pivotement."),
      choice("Quelle activité enzymatique possède la tête de myosine ?", ["ADN polymérase", "Lipase", "Peptidase", "ATPase"], 3, "La tête hydrolyse l’ATP."),
      trueFalse("L’hydrolyse de l’ATP précède le réarmement de la tête.", true, "L’énergie de l’hydrolyse remet la tête en position armée."),
      choice("Pourquoi les ponts restent-ils bloqués sans ATP ?", ["La myosine ne peut plus se détacher", "L’actine disparaît", "Le calcium devient du glucose", "La bande A double"], 0, "Le détachement exige la fixation d’un ATP."),
      choice("Dans quelle direction la tête déplace-t-elle l’actine ?", ["Vers la strie Z opposée", "Vers la ligne M", "Vers le noyau", "Vers le tendon directement"], 1, "Le coup de force tire l’actine vers le centre."),
      choice("Quelle condition régulatrice est nécessaire en plus de l’ATP ?", ["Du CO₂ élevé", "De l’éthanol", "Du Ca²⁺ cytosolique", "Une réplication"], 2, "Ca²⁺ découvre les sites de l’actine."),
      choice("Quel phénomène explique un glissement continu ?", ["La rupture de tous les filaments", "La synchronisation parfaite de toutes les têtes", "L’absence de calcium", "Le décalage des cycles entre les têtes"], 3, "Les têtes cyclent de façon non parfaitement synchrone."),
      trueFalse("La fixation de l’ATP et son hydrolyse désignent exactement le même instant du cycle.", false, "La fixation détache ; l’hydrolyse vient ensuite et réarme."),
      short("Écris le sigle du phosphate inorganique libéré pendant le cycle.", ["Pi", "P_i", "phosphate inorganique", "le phosphate inorganique"], "Le phosphate inorganique est noté Pi."),
      short("Nomme le mouvement mécanique de la tête qui déplace l’actine.", ["coup de force", "le coup de force", "pivotement", "le pivotement"], "Le pivotement est appelé coup de force."),
    ],
    corrections: [
      "La page 13 attribue la dissociation à une nouvelle hydrolyse ; la séquence moderne est corrigée : fixation de l’ATP, détachement, puis hydrolyse et réarmement.",
      "La régulation par phosphorylation de la myosine n’est pas retenue pour le muscle strié squelettique ; elle concerne surtout le muscle lisse.",
      "Le rôle de la libération de Pi dans le coup de force est précisé sans surcharger le modèle scolaire.",
    ],
  },
  {
    id: "immediate-atp-regeneration",
    title: "Régénérer immédiatement l’ATP",
    summary: "Comparer ATP stocké, adénylate kinase et phosphocréatine dans les premières secondes d’un effort.",
    pages: "7-9 et 15",
    section: "Composition chimique du muscle et voies rapides de renouvellement de l’ATP",
    durationMinutes: 28,
    xp: 80,
    body: `
## 1. Une réserve d’ATP très limitée

La cellule musculaire contient de l’ATP, mais cette quantité permet seulement quelques secondes d’effort intense. Pour poursuivre la contraction, l’ATP doit être **resynthétisé** à partir de l’ADP. Les premières voies mobilisées ne nécessitent pas immédiatement de dégrader une grande quantité de glucose.

## 2. L’adénylate kinase

L’enzyme historiquement appelée **myokinase** est aujourd’hui nommée adénylate kinase. Elle transfère un phosphate entre deux ADP :

$$\\mathrm{2\\,ADP \\rightleftharpoons ATP + AMP}$$

Cette réaction fournit rapidement un ATP, mais sa capacité est faible. L’AMP produit sert aussi de signal d’un état énergétique bas.

## 3. La phosphocréatine

La phosphocréatine transfère son groupement phosphate à l’ADP grâce à la **créatine kinase** :

$$\\mathrm{phosphocréatine + ADP + H^+ \\rightleftharpoons créatine + ATP}$$

Le système phosphocréatine tamponne la concentration d’ATP pendant les premières secondes d’un sprint, d’un saut ou d’un effort explosif. Il est très rapide mais limité par la petite réserve de phosphocréatine.

| Système | Vitesse | Capacité | Rôle principal |
|---|---|---|---|
| ATP déjà présent | immédiate | très faible | premiers cycles contractiles |
| adénylate kinase | très rapide | faible | récupérer un ATP à partir de deux ADP |
| phosphocréatine | très rapide | faible à modérée | tampon énergétique des premières secondes |
| glycolyse et respiration | plus progressives | plus élevée | soutenir la poursuite de l’effort |

## 4. Classer correctement les voies

L’activité du document inverse les intitulés de vitesse dans son corrigé. L’adénylate kinase et la phosphocréatine sont les voies les plus rapides ; glycolyse lactique et respiration fournissent une capacité plus longue, avec des cinétiques et rendements différents.

> **Astuce mémoire — PCr = Paiement Cash rapide :** la phosphocréatine « paie » immédiatement un phosphate à l’ADP, mais la réserve s’épuise vite.
`,
    keyPoint: "Dans les premières secondes, l’adénylate kinase et surtout la phosphocréatine régénèrent très rapidement l’ATP, mais leurs réserves sont limitées.",
    example: "Lors d’un départ de sprint, ATP stocké puis phosphocréatine soutiennent l’effort avant que la glycolyse et la respiration prennent une part plus importante.",
    methodSteps: [
      "Distingue ATP disponible et mécanismes de resynthèse.",
      "Écris les réactifs et produits des deux réactions rapides.",
      "Compare vitesse et capacité sans dire qu’une voie rapide dure longtemps.",
      "Replace ensuite glycolyse et respiration dans la continuité de l’effort.",
    ],
    interaction: diagram(
      "Les relais énergétiques des premières secondes",
      "Explore les systèmes et classe-les par disponibilité, vitesse et capacité.",
      "Maintenir la concentration d’ATP",
      "Plusieurs voies se chevauchent ; leur contribution relative change avec la durée et l’intensité de l’effort.",
      [
        { id: "stored-atp", label: "ATP stocké", role: "Immédiat", detail: "Déjà disponible, mais suffisant seulement pour un très bref effort maximal." },
        { id: "adenylate", label: "Adénylate kinase", role: "2 ADP → ATP + AMP", detail: "Réaction très rapide, aussi appelée myokinase dans l’ancien vocabulaire." },
        { id: "pcr", label: "Phosphocréatine", role: "Tampon phosphate", detail: "La créatine kinase transfère rapidement un phosphate de PCr à l’ADP." },
        { id: "glycolysis", label: "Glycolyse", role: "Relais cytosolique", detail: "Elle utilise le glucose ou le glycogène et peut accélérer rapidement quand la demande augmente." },
        { id: "respiration", label: "Respiration", role: "Grande capacité", detail: "Elle soutient durablement l’effort grâce aux mitochondries et au dioxygène." },
      ],
      "Les voies ne s’allument pas comme des interrupteurs successifs : elles fonctionnent ensemble, mais leur importance relative se déplace.",
    ),
    questions: [
      choice("Quelle réserve alimente directement les tout premiers cycles ?", ["L’ATP déjà présent", "Le lactate", "Le CO₂", "L’ADN"], 0, "L’ATP stocké est immédiatement hydrolysable.", "Composition et voies • pages 7-9"),
      choice("Quelle enzyme catalyse 2 ADP ⇌ ATP + AMP ?", ["Créatine kinase", "Adénylate kinase", "ATP synthase", "Pepsine"], 1, "L’adénylate kinase est aussi appelée myokinase."),
      choice("Quelle molécule donne rapidement un phosphate à l’ADP ?", ["L’actine", "Le glucose directement", "La phosphocréatine", "Le calcium"], 2, "PCr constitue un tampon phosphate."),
      choice("Quelle enzyme remplace le terme ancien « phosphocréatinase » ?", ["Myosine", "Troponine", "Amylase", "Créatine kinase"], 3, "Le terme moderne est créatine kinase."),
      trueFalse("La réserve de phosphocréatine peut soutenir plusieurs heures d’effort maximal.", false, "Elle est rapide mais très limitée."),
      choice("Quel produit accompagne l’ATP dans la réaction de l’adénylate kinase ?", ["AMP", "O₂", "Lactate", "Glycogène"], 0, "Deux ADP donnent un ATP et un AMP."),
      choice("Quel système possède la plus grande capacité durable ?", ["ATP stocké", "Respiration aérobie", "Adénylate kinase", "Un seul pont actine–myosine"], 1, "La respiration peut soutenir longtemps un effort adapté."),
      choice("Quelles voies sont correctement classées comme très rapides ?", ["Respiration seulement", "Cycle de Krebs et transcription", "Adénylate kinase et phosphocréatine", "Photosynthèse et digestion"], 2, "Elles régénèrent immédiatement l’ATP."),
      choice("Que signifie AMP dans cette réaction ?", ["Actine musculaire phosphorylée", "Acide myosinique", "Adénosine multiphosphate", "Adénosine monophosphate"], 3, "AMP porte un seul phosphate."),
      short("Nomme l’enzyme qui transfère le phosphate de la phosphocréatine à l’ADP.", ["créatine kinase", "la créatine kinase", "creatine kinase", "CK"], "La créatine kinase catalyse cette réaction réversible."),
    ],
    corrections: [
      "Les catégories de l’activité 1 sont corrigées : adénylate kinase et phosphocréatine sont rapides ; la source les place sous un intitulé lent contradictoire.",
      "Le terme ancien « myokinase » est relié au nom moderne adénylate kinase.",
      "Le terme « phosphocréatinase » est modernisé en créatine kinase.",
      "Les voies sont présentées comme simultanées avec contributions variables, et non comme des interrupteurs strictement successifs.",
    ],
  },
  {
    id: "glycolysis-lactate-respiration",
    title: "Mobiliser glucose, glycogène et dioxygène",
    summary: "Relier glycogénolyse, glycolyse, voie lactique et respiration au renouvellement de l’ATP musculaire.",
    pages: "7-10 et 15-16",
    section: "Voies métaboliques du muscle et exercices de fixation 1-2",
    durationMinutes: 32,
    xp: 85,
    body: `
## 1. D’où vient le glucose utilisé ?

La fibre peut capter du glucose sanguin ou mobiliser son **glycogène**. La glycogénolyse libère des unités qui rejoignent la glycolyse. Cette réserve locale est rapidement accessible et évite d’attendre un nouvel apport digestif.

## 2. La glycolyse, carrefour cytosolique

Dans le cytosol, la glycolyse transforme une molécule de glucose en deux pyruvates :

$$\\mathrm{glucose \\longrightarrow 2\\,pyruvates + 2\\,ATP\\ nets + 2\\,NADH}$$

Le gain **direct net** est de 2 ATP par glucose libre. À partir d’une unité de glycogène déjà phosphorylée, le bilan peut être légèrement différent, mais le cours retient le modèle simple du glucose.

## 3. Deux destins du pyruvate

### Effort intense : voie lactique

Lorsque le renouvellement aérobie ne suit pas immédiatement la demande, le pyruvate reçoit les électrons du NADH et devient lactate :

$$\\mathrm{pyruvate + NADH + H^+ \\rightleftharpoons lactate + NAD^+}$$

La réaction régénère $\\mathrm{NAD^+}$ et permet à la glycolyse de continuer. Elle ne crée pas d’ATP supplémentaire au-delà de celui produit par la glycolyse.

### Effort soutenu : respiration

Dans les mitochondries, le pyruvate est oxydé et ses électrons alimentent la chaîne respiratoire. Avec le dioxygène, la dégradation est complète et le rendement est bien supérieur. Le document utilise la convention historique de **38 ATP** ; les estimations actuelles chez l’eucaryote sont plutôt d’environ **30 à 32 ATP** par glucose.

## 4. Interpréter sans accuser le lactate de tout

Une hausse du lactate sanguin traduit une production glycolytique importante et un équilibre momentané entre production, transport et utilisation. Le lactate peut être réutilisé comme combustible. Il n’est pas à lui seul la cause unique de la fatigue, des crampes ou des douleurs musculaires retardées.

| Voie | Lieu principal | O₂ | Rapidité/capacité | Produits marquants |
|---|---|---|---|---|
| glycolyse lactique | cytosol | non directement requis | rapide, capacité limitée | lactate + 2 ATP nets |
| respiration | mitochondrie après glycolyse | requis à la chaîne | plus grande capacité | CO₂ + H₂O + beaucoup d’ATP |

> **Correction majeure :** les « 8 ATP » parfois attribués directement à la glycolyse dans l’ancien bilan mélangent le gain direct et la valorisation ultérieure du NADH. La glycolyse fournit **2 ATP nets directement**.

> **Astuce mémoire — G-P-L ou G-P-M :** **G**lucose → **P**yruvate → **L**actate dans le cytosol, ou → **M**itochondrie si la respiration prend le relais.
`,
    keyPoint: "La glycolyse fournit directement 2 ATP nets ; elle mène au lactate pour régénérer le NAD⁺ ou à la respiration mitochondriale pour un rendement élevé.",
    example: "Dans un sprint, la glycolyse s’accélère et le lactate augmente ; dans un effort d’endurance adapté, la respiration mitochondriale prend une part dominante.",
    methodSteps: [
      "Identifie d’abord la source : glucose sanguin ou glycogène musculaire.",
      "Place la glycolyse dans le cytosol et écris son gain net direct.",
      "Choisis le destin du pyruvate selon les conditions de l’effort.",
      "Interprète le lactate comme un indicateur métabolique, pas comme une cause universelle.",
    ],
    interaction: diagram(
      "Choisir le destin du pyruvate musculaire",
      "Explore chaque branche et retrouve son lieu, son bilan et son rôle.",
      "Glucose ou glycogène → glycolyse",
      "La glycolyse cytosolique produit pyruvate, NADH et un gain direct net de 2 ATP par glucose libre.",
      [
        { id: "glycogen", label: "Glycogène", role: "Réserve locale", detail: "La fibre mobilise rapidement ses unités glucidiques par glycogénolyse." },
        { id: "glycolysis", label: "Glycolyse", role: "2 ATP nets", detail: "Elle se déroule dans le cytosol et produit deux pyruvates par glucose." },
        { id: "lactate", label: "Lactate", role: "Régénère NAD⁺", detail: "La lactate déshydrogénase maintient la glycolyse quand le flux pyruvate/NADH est élevé." },
        { id: "mitochondria", label: "Respiration", role: "Grande capacité", detail: "Le pyruvate est complètement oxydé ; O₂ accepte les électrons en fin de chaîne." },
        { id: "recovery", label: "Récupération", role: "Réutilisation", detail: "Le lactate peut circuler et être oxydé par d’autres fibres, le cœur ou d’autres tissus." },
      ],
      "Les deux voies ne s’excluent pas totalement : elles contribuent simultanément, dans des proportions variables selon intensité, durée et entraînement.",
    ),
    questions: [
      choice("Quelle réserve glucidique se trouve dans le muscle ?", ["Le glycogène", "L’amidon", "La cellulose", "Le saccharose uniquement"], 0, "Le muscle stocke le glucose sous forme de glycogène.", "Voies énergétiques • pages 7-9"),
      choice("Où se déroule la glycolyse ?", ["Dans le noyau", "Dans le cytosol", "Dans le tendon", "Dans le sang"], 1, "La glycolyse est une voie cytosolique."),
      choice("Quel est le gain direct net de la glycolyse par glucose libre ?", ["38 ATP", "8 ATP", "2 ATP", "0 ATP"], 2, "Deux ATP nets sont formés directement."),
      choice("Quel composé reçoit les électrons du NADH dans la voie lactique ?", ["L’oxygène", "Le glucose", "L’ATP", "Le pyruvate"], 3, "Le pyruvate est réduit en lactate."),
      trueFalse("La formation du lactate régénère le NAD⁺ nécessaire à la glycolyse.", true, "C’est le rôle biochimique immédiat de cette réaction."),
      choice("Quel organite accueille la suite aérobie de l’oxydation ?", ["La mitochondrie", "Le ribosome", "Le centrosome", "Le lysosome"], 0, "La mitochondrie réalise l’oxydation du pyruvate et la phosphorylation oxydative."),
      choice("Quel accepteur intervient en fin de chaîne respiratoire ?", ["Le lactate", "Le dioxygène", "Le glycogène", "L’actine"], 1, "O₂ accepte les électrons et participe à la formation d’eau."),
      choice("Quel bilan moderne est un ordre de grandeur respiratoire eucaryote ?", ["2 ATP", "100 ATP", "Environ 30 à 32 ATP", "Aucun ATP"], 2, "Les bilans modernes sont souvent proches de 30–32 ATP."),
      choice("Quelle phrase sur le lactate est la plus juste ?", ["Il est toujours un déchet inutile", "Il cause seul toutes les douleurs", "Il bloque nécessairement le cœur", "Il peut être transporté et réutilisé"], 3, "Le lactate est aussi un substrat métabolique."),
      trueFalse("Respiration et voie lactique peuvent contribuer en même temps à un effort.", true, "Leur contribution relative varie ; elles ne sont pas deux interrupteurs exclusifs."),
      short("Nomme l’enzyme qui interconvertit pyruvate et lactate.", ["lactate déshydrogénase", "la lactate déshydrogénase", "lactate deshydrogenase", "LDH"], "La LDH couple pyruvate/lactate et NADH/NAD⁺."),
      short("Complète : glucose → deux molécules de …", ["pyruvate", "pyruvates", "deux pyruvates", "acide pyruvique"], "La glycolyse scinde un glucose en deux pyruvates."),
    ],
    corrections: [
      "Le gain direct net de la glycolyse est corrigé à 2 ATP ; la valeur 8 mélange le gain direct et une ancienne valorisation des NADH.",
      "Le bilan respiratoire 38 ATP est conservé comme convention scolaire et accompagné de l’ordre de grandeur moderne 30 à 32 ATP.",
      "Le lactate n’est pas présenté comme cause unique de fatigue, crampes ou douleurs retardées ; son rôle de navette et de substrat est précisé.",
    ],
  },
  {
    id: "muscle-heat-production",
    title: "Interpréter la chaleur musculaire",
    summary: "Distinguer chaleur initiale, chaleur retardée et énergie convertie en travail pendant puis après la contraction.",
    pages: "9 et 14-15",
    section: "Production de chaleur par le muscle et documents annexes",
    durationMinutes: 24,
    xp: 70,
    body: `
## 1. Toute l’énergie ne devient pas mouvement

L’énergie chimique libérée par le métabolisme n’est jamais intégralement convertie en travail mécanique. Une fraction devient mouvement et tension ; une autre est dissipée sous forme de **chaleur**. La température du muscle peut donc augmenter pendant l’activité.

On représente qualitativement le bilan par :

$$\\text{énergie chimique} = \\text{travail mécanique} + \\text{chaleur} + \\text{énergie stockée ou transférée}$$

## 2. Deux moments thermiques

Les documents annexes distinguent :

- une **chaleur initiale**, produite pendant l’activation et la contraction, liée notamment aux cycles actine–myosine et aux transports ioniques ;
- une **chaleur retardée**, produite pendant la récupération, lorsque le muscle restaure ses réserves, rétablit les gradients ioniques et oxyde des substrats.

La chaleur retardée ne signifie pas que le muscle se contracte encore avec la même force. Elle révèle des réactions de récupération qui continuent après le mouvement visible.

## 3. Lire une courbe de chaleur

Une courbe expérimentale présente d’abord une montée rapide au voisinage de la secousse, puis une composante plus lente. Pour l’expliquer, il faut séparer le temps mécanique du temps métabolique :

1. l’activation et le raccourcissement consomment de l’ATP ;
2. les pompes ioniques rétablissent les concentrations ;
3. phosphocréatine et autres réserves sont reconstituées ;
4. la respiration de récupération dissipe encore de la chaleur.

> **Astuce mémoire — Initiale = Immédiate ; Retardée = Récupération.**

> **Précision :** « chaleur » ne signifie pas gaspillage total. La dissipation thermique participe aussi à la thermorégulation de l’organisme, mais une élévation excessive doit être contrôlée.
`,
    keyPoint: "Le muscle libère une chaleur initiale pendant l’activité et une chaleur retardée pendant la restauration métabolique et ionique.",
    example: "Si la force est revenue à zéro mais que la chaleur continue d’augmenter lentement, on l’attribue à la récupération énergétique et aux transports actifs.",
    methodSteps: [
      "Repère le moment de la stimulation et celui de la réponse mécanique.",
      "Sépare la phase rapide de la composante thermique retardée.",
      "Relie la phase initiale à l’activation et aux ponts actine–myosine.",
      "Relie la phase retardée à la restauration des réserves et des gradients.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale reconstruite",
      title: "Suivre la chaleur après une secousse",
      instruction: "Déplace le point mobile et distingue la montée initiale de la récupération lente.",
      formula: "Chaleur musculaire relative",
      rule: { kind: "samples", points: [[0, 0], [0.1, 0.4], [0.2, 1.5], [0.4, 3.3], [0.7, 4.2], [1.2, 4.8], [2, 5.4], [3, 5.9], [4, 6.2]] },
      window: { xMin: 0, xMax: 4, yMin: 0, yMax: 7 },
      guides: [{ kind: "vertical", value: 0.1, label: "stimulation" }],
      marker: { min: 0, max: 4, step: 0.1, initial: 0.4 },
      observation: "Le tracé est une reconstruction pédagogique qualitative des documents annexes, pas une numérisation des valeurs du PDF.",
    },
    questions: [
      choice("Quelle forme d’énergie accompagne toujours le travail musculaire ?", ["De la chaleur", "De la lumière visible", "Du son uniquement", "De l’énergie nucléaire"], 0, "Une partie de l’énergie est dissipée en chaleur.", "Documents annexes • pages 14-15"),
      choice("Quand la chaleur initiale apparaît-elle principalement ?", ["Plusieurs jours avant", "Pendant l’activation et la contraction", "Seulement pendant le sommeil", "Avant toute stimulation"], 1, "Elle accompagne les phénomènes immédiats de la contraction."),
      choice("À quoi la chaleur retardée est-elle surtout liée ?", ["À la photosynthèse", "À la réplication", "À la récupération métabolique", "À la formation des os"], 2, "Le muscle restaure réserves et gradients."),
      choice("Quel transport consomme de l’ATP pendant la récupération ?", ["La diffusion du CO₂ seule", "Le passage passif de l’eau", "La sortie de chaleur", "La recapture de Ca²⁺ par SERCA"], 3, "SERCA est une pompe ATP-dépendante."),
      trueFalse("Quand la force mécanique revient à zéro, toute activité métabolique cesse immédiatement.", false, "La récupération se poursuit et peut encore produire de la chaleur."),
      choice("Quelle réserve rapide doit être reconstituée après l’effort ?", ["La phosphocréatine", "La cellulose", "L’ADN", "La bile"], 0, "La phosphocréatine est renouvelée pendant la récupération."),
      choice("Quelle lecture d’une montée rapide puis lente est correcte ?", ["Deux muscles différents obligatoirement", "Composante initiale puis composante retardée", "Erreur certaine de la sonde", "Absence de métabolisme"], 1, "Les deux phases correspondent à des processus temporellement distincts."),
      choice("Quel bilan est cohérent ?", ["Chaleur = toute l’énergie", "Travail = aucune énergie", "Énergie chimique répartie entre travail et chaleur", "ATP créé par la chaleur seule"], 2, "La conversion énergétique produit travail et chaleur."),
      short("Comment nomme-t-on la chaleur produite pendant la récupération ?", ["chaleur retardée", "la chaleur retardée", "chaleur de récupération", "la chaleur de récupération"], "La composante lente après la contraction est la chaleur retardée."),
    ],
    corrections: [
      "La figure annexe sans échelle exploitable est reconstruite qualitativement et clairement signalée comme telle.",
      "Chaleur initiale et chaleur retardée sont reliées à des mécanismes distincts plutôt que simplement nommées.",
      "La thermogenèse est intégrée dans un bilan énergétique qui ne confond pas chaleur et travail mécanique.",
    ],
  },
  {
    id: "trained-untrained-lactate-assessment",
    title: "Comparer un sujet entraîné et non entraîné",
    summary: "Exploiter les valeurs de lactate de l’évaluation officielle et relier les écarts aux adaptations de l’entraînement.",
    pages: "10-12",
    section: "Situation d’évaluation sur le lactate sanguin après un effort",
    durationMinutes: 30,
    xp: 95,
    body: `
## 1. Le protocole de l’évaluation

Deux sujets réalisent un effort comparable : l’un est entraîné, l’autre non. Le document suit leur lactatémie au cours du temps. Il faut d’abord lire les valeurs, puis seulement proposer une interprétation physiologique.

| Temps (min) | Sujet entraîné | Sujet non entraîné |
|---:|---:|---:|
| 0 | environ 1 mmol/L | environ 1 mmol/L |
| 2 | environ 4 mmol/L | environ 7 mmol/L |
| 6 | environ 6 mmol/L | environ 10 mmol/L |
| 10 | environ 5 mmol/L | environ 9 mmol/L |
| 14 | environ 4 mmol/L | environ 7 mmol/L |
| 18 | environ 3 mmol/L | environ 5 mmol/L |
| 22 | arrêt / retour proche de la base | valeur encore supérieure à la base |

Les valeurs doivent être présentées comme approximatives lorsque le tableau ou la figure ne donne pas une précision suffisante.

## 2. Décrire avant d’expliquer

Chez les deux sujets, la lactatémie augmente pendant ou juste après l’effort puis diminue en récupération. À temps comparable, elle est plus élevée chez le sujet non entraîné et son retour vers la valeur initiale est plus lent.

L’observation ne suffit pas à conclure que l’entraîné « ne produit pas de lactate ». Il en produit aussi, mais son équilibre entre production, transport et utilisation diffère.

## 3. Effets possibles de l’entraînement

L’entraînement d’endurance peut augmenter la densité mitochondriale, la capillarisation, l’apport en dioxygène et la capacité d’oxyder pyruvate et lactate. Pour un même effort absolu, la contribution aérobie peut donc être plus grande et l’accumulation sanguine de lactate plus faible.

## 4. Une interprétation prudente

La lactatémie dépend de la production, du passage dans le sang, de la distribution et de l’élimination/utilisation. À partir de ce seul tableau, on peut conclure à une différence de réponse et de récupération ; on ne peut pas isoler une enzyme unique comme cause certaine.

> **Astuce mémoire — D-A-I-C :** **D**écrire les courbes, **A**nalyser l’écart, **I**nterpréter par les adaptations, **C**onclure sans exagérer.
`,
    keyPoint: "À effort comparable, le sujet entraîné présente ici une lactatémie plus faible et un retour plus rapide, compatibles avec une meilleure capacité oxydative.",
    example: "À 6 min, environ 6 contre 10 mmol/L : décris l’écart de 4 mmol/L, puis relie-le prudemment à une contribution aérobie plus efficace chez l’entraîné.",
    methodSteps: [
      "Identifie les deux sujets, la grandeur mesurée, l’unité et les temps.",
      "Décris hausse, maximum et récupération pour chacun.",
      "Compare les valeurs au même instant avec un écart chiffré.",
      "Relie prudemment les différences aux adaptations aérobies de l’entraînement.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Lecture chronologique",
      title: "Suivre la lactatémie et la récupération",
      instruction: "Avance dans le temps et compare toujours les deux sujets au même instant.",
      items: [
        { label: "Départ", shortLabel: "0 min", detail: "Les deux sujets commencent près de leur valeur de base, autour de 1 mmol/L." },
        { label: "Montée", shortLabel: "2 min", detail: "La lactatémie augmente chez les deux sujets, davantage chez le non-entraîné." },
        { label: "Pic observé", shortLabel: "6 min", detail: "Environ 6 mmol/L chez l’entraîné contre 10 mmol/L chez le non-entraîné." },
        { label: "Récupération", shortLabel: "10–18", detail: "Les deux valeurs baissent, mais l’écart persiste et le retour est plus rapide chez l’entraîné." },
        { label: "Fin du suivi", shortLabel: "22 min", detail: "L’indication « arrêt » est lue à 22 min ; aucune valeur indépendante n’est inventée à 24 min." },
      ],
      observation: "Comparer à temps égal évite d’attribuer à l’entraînement une différence qui viendrait seulement d’un décalage temporel.",
    },
    questions: [
      choice("Quelle grandeur est suivie dans l’évaluation ?", ["La lactatémie", "La taille du muscle", "La quantité d’ADN", "La glycémie uniquement"], 0, "Le document suit le lactate sanguin.", "Situation d’évaluation • pages 10-12"),
      choice("Quel sujet atteint ici la valeur la plus élevée ?", ["Le sujet entraîné", "Le sujet non entraîné", "Les deux sont toujours identiques", "Aucun"], 1, "Le non-entraîné atteint environ 10 mmol/L."),
      choice("Vers quel temps le maximum lu est-il observé ?", ["0 min", "22 min", "6 min", "48 h"], 2, "Le tableau donne les valeurs maximales vers 6 min."),
      choice("Quelle valeur approximative correspond au non-entraîné à 6 min ?", ["1 mmol/L", "4 mmol/L", "6 mmol/L", "10 mmol/L"], 3, "La valeur lue est proche de 10 mmol/L."),
      trueFalse("Le sujet entraîné ne produit absolument aucun lactate.", false, "Sa lactatémie augmente elle aussi."),
      choice("Quelle adaptation favorise la capacité aérobie ?", ["Une densité mitochondriale accrue", "La disparition des capillaires", "L’arrêt de la respiration", "La destruction du glycogène au repos"], 0, "Davantage de mitochondries peut soutenir l’oxydation."),
      choice("Quelle comparaison est méthodologiquement correcte ?", ["Des temps différents", "Les deux sujets au même temps", "Une valeur sans unité", "Un sujet sans témoin"], 1, "Une comparaison valide conserve le même instant."),
      choice("Que mesure l’écart entre 10 et 6 mmol/L à 6 min ?", ["2 mmol/L", "10 mmol/L", "4 mmol/L", "16 mmol/L"], 2, "10 − 6 = 4 mmol/L."),
      choice("Quelle conclusion reste prudente ?", ["Une enzyme unique est certaine", "Le lactate cause toutes les douleurs", "L’entraîné n’utilise pas de glucose", "L’entraînement est compatible avec une meilleure capacité oxydative"], 3, "C’est une interprétation compatible avec les données sans dépasser leur portée."),
      short("Donne l’unité utilisée pour la lactatémie du tableau.", ["mmol/L", "mmol.l-1", "mmol L-1", "millimole par litre", "millimoles par litre"], "La concentration est exprimée en millimoles par litre."),
    ],
    corrections: [
      "La cellule « arrêt » visuellement étendue est interprétée à 22 min ; aucune valeur à 24 min n’est inventée.",
      "Les valeurs lues sont annoncées comme approximatives lorsqu’elles proviennent d’un tracé peu précis.",
      "Le lactate est expliqué comme le résultat d’un équilibre production–transport–utilisation, pas comme un simple déchet.",
      "L’interprétation de l’entraînement est formulée comme compatible avec les données, sans causalité enzymatique non démontrée.",
    ],
  },
  {
    id: "muscle-response-fatigue-mission",
    title: "Mission : de la secousse à la fatigue",
    summary: "Combiner recrutement, sommation, tétanos, fatigue et métabolisme dans les exercices et figures de synthèse.",
    pages: "12-16",
    section: "Exercices sur le nerf sciatique, le calcium et figures annexes de synthèse",
    durationMinutes: 35,
    xp: 115,
    kind: "challenge",
    body: `
## 1. Une stimulation unique : la secousse musculaire

L’exercice sur le muscle de grenouille stimule le nerf sciatique et enregistre la réponse mécanique. Une stimulation efficace unique produit une **secousse musculaire** avec trois phases :

1. un temps de latence entre stimulation et début de la tension ;
2. une phase de contraction où la tension augmente ;
3. une phase de relaxation où la tension revient vers la base.

Le temps de latence correspond notamment à la propagation du signal, à la libération de calcium et au début des cycles moléculaires ; ce n’est pas un temps « sans événement ».

## 2. Intensité et recrutement

Une fibre isolée répond selon le principe du **tout ou rien** lorsque son seuil est atteint. En revanche, un muscle entier contient plusieurs unités motrices dont les seuils diffèrent. Quand l’intensité de stimulation augmente, davantage d’unités sont recrutées et la réponse globale augmente jusqu’à une valeur maximale.

Il faut donc distinguer :

- **fibre isolée :** tout ou rien ;
- **muscle entier :** réponse graduée par recrutement.

## 3. Fréquence, sommation et tétanos

Si une nouvelle stimulation arrive avant la relaxation complète, les réponses se **somment** parce que le calcium cytosolique n’est pas encore totalement revenu au niveau de repos. Quand les stimulations deviennent suffisamment rapprochées, la tension peut former un plateau : c’est le **tétanos** incomplet puis complet.

## 4. Fatigue musculaire

Lors de stimulations répétées, la force peut diminuer malgré la poursuite des signaux. La fatigue est multifactorielle : disponibilité des substrats, accumulation de métabolites, changements ioniques, libération/recapture du calcium et facteurs nerveux peuvent contribuer. Le lactate seul n’explique pas toute la fatigue.

## 5. Exploiter les figures annexes

Les pages 14 à 16 fournissent des enregistrements et schémas sans énoncé complet associé. La plateforme les transforme en mission de synthèse clairement identifiée : il ne s’agit pas de prétendre qu’un exercice absent figurait dans le PDF, mais d’utiliser fidèlement les informations visibles pour entraîner la démarche scientifique.

> **Astuce mémoire — I recrute, F additionne :** augmenter l’**I**ntensité recrute plus d’unités ; augmenter la **F**réquence additionne les secousses.

> **Mission finale :** pour expliquer une baisse de force après des stimulations répétées, décris la courbe, distingue recrutement et sommation, puis mobilise calcium, ATP et voies de renouvellement énergétique.
`,
    keyPoint: "L’intensité gradue la réponse du muscle par recrutement ; la fréquence provoque sommation puis tétanos ; la fatigue combine plusieurs limites énergétiques, ioniques et nerveuses.",
    example: "Deux chocs rapprochés donnent une tension supérieure à une secousse car la seconde arrive avant la recapture complète du calcium : les réponses se somment.",
    methodSteps: [
      "Identifie si le document fait varier l’intensité, la fréquence ou la durée de stimulation.",
      "Décris latence, contraction, relaxation et évolution de l’amplitude.",
      "Choisis le mécanisme : recrutement pour l’intensité, sommation pour la fréquence.",
      "Explique la fatigue avec plusieurs facteurs et relie-les au calcium et à l’ATP.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mission expérimentale interactive",
      title: "Reconnaître une secousse musculaire",
      instruction: "Déplace le point mobile et repère latence, montée de tension puis relaxation.",
      formula: "Tension musculaire relative",
      rule: { kind: "samples", points: [[0, 0], [0.05, 0], [0.1, 0.1], [0.15, 1.4], [0.25, 4], [0.35, 6], [0.45, 5.2], [0.6, 3], [0.8, 1], [1, 0.1], [1.2, 0]] },
      window: { xMin: 0, xMax: 1.2, yMin: 0, yMax: 7 },
      guides: [{ kind: "vertical", value: 0.05, label: "stimulation" }],
      marker: { min: 0, max: 1.2, step: 0.05, initial: 0.25 },
      observation: "Cette courbe pédagogique originale synthétise la forme de la secousse visible dans les figures annexes ; ses valeurs ne prétendent pas reproduire une échelle absente.",
    },
    questions: [
      choice("Comment nomme-t-on la réponse mécanique à une stimulation unique efficace ?", ["Une secousse musculaire", "Une fermentation", "Une synapse", "Une mitose"], 0, "Une stimulation unique donne une secousse.", "Exercice grenouille • pages 12-13"),
      choice("Quelle phase précède la montée de tension ?", ["La fatigue", "Le temps de latence", "Le tétanos", "La glycogénolyse seule"], 1, "La latence sépare le choc du début de la contraction."),
      choice("Pourquoi la réponse d’un muscle entier augmente-t-elle avec l’intensité ?", ["Chaque fibre répond à moitié", "La myosine s’allonge", "Davantage d’unités motrices sont recrutées", "Le tendon fabrique de l’ATP"], 2, "Le recrutement explique la gradation globale."),
      choice("Quelle loi décrit la réponse d’une fibre isolée au-dessus du seuil ?", ["La loi de diffusion", "La loi de Mendel", "La loi d’Ohm", "Le tout ou rien"], 3, "Une fibre isolée déclenche un potentiel d’action complet."),
      trueFalse("Une hausse de fréquence et une hausse d’intensité agissent par exactement le même mécanisme.", false, "La fréquence favorise la sommation ; l’intensité favorise le recrutement."),
      choice("Que produit une deuxième stimulation avant relaxation complète ?", ["Une sommation", "Une réplication", "Une disparition du calcium", "Un os"], 0, "La tension de la seconde réponse s’ajoute à la première."),
      choice("Comment nomme-t-on un plateau de tension sous stimulations très rapprochées ?", ["Une onde de repos", "Un tétanos", "Une glycolyse", "Une mutation"], 1, "Le tétanos résulte de la fusion des secousses."),
      choice("Quel ion reste plus élevé lors d’une sommation rapprochée ?", ["Fe³⁺", "NaCl solide", "Ca²⁺ cytosolique", "Iode moléculaire"], 2, "La recapture du calcium n’est pas achevée."),
      choice("Quelle explication de la fatigue est correcte ?", ["Le lactate seul explique tout", "La fibre manque toujours d’ADN", "La myosine est définitivement détruite", "Plusieurs facteurs énergétiques, ioniques et nerveux contribuent"], 3, "La fatigue musculaire est multifactorielle."),
      trueFalse("Le temps de latence est dépourvu de tout événement cellulaire.", false, "Propagation, libération de Ca²⁺ et activation moléculaire s’y déroulent."),
      short("Nomme le mécanisme qui augmente le nombre d’unités motrices actives.", ["recrutement", "le recrutement", "recrutement moteur", "le recrutement moteur"], "L’augmentation d’intensité recrute davantage d’unités."),
      short("Nomme la fusion soutenue de secousses à haute fréquence.", ["tétanos", "le tétanos", "tetanos", "tétanisation", "tetanisation"], "La sommation maximale conduit au tétanos."),
    ],
    corrections: [
      "La réponse à une excitation unique est nommée précisément « secousse musculaire », là où le corrigé source reste vague.",
      "Le tout-ou-rien de la fibre est distingué de la réponse graduée du muscle entier par recrutement.",
      "La fatigue est traitée comme multifactorielle et non attribuée au seul lactate.",
      "Les pages 14 à 16 n’offrent pas un énoncé complet : leur exploitation est explicitement présentée comme une mission de synthèse reconstruite.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCSvtMuscleEnergyPath: LearningPath = {
  id: "terminale-c-svt-l4-muscle-energy-use",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Le métabolisme énergétique et l’activité musculaire" },
  chapterNumber: 4,
  title: "L’utilisation de l’énergie par la cellule musculaire",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, enrichi par dix niveaux interactifs, les exercices du document, une mission de synthèse et des corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire l’organisation emboîtée du muscle jusqu’au sarcomère",
    "Démontrer le glissement des filaments à partir des bandes du sarcomère",
    "Expliquer le couplage excitation–calcium–contraction et le cycle actine–myosine",
    "Comparer les voies immédiates, glycolytiques et respiratoires de renouvellement de l’ATP",
    "Interpréter chaleur, lactatémie, recrutement, sommation, tétanos et fatigue",
  ],
  modules: [
    {
      id: "muscle-energy-use-mastery",
      title: "Maîtriser l’utilisation de l’énergie musculaire",
      description: "Dix niveaux progressifs, de l’organisation du sarcomère à la mission expérimentale sur la fatigue.",
      lessons: builtLevels,
    },
  ],
};
