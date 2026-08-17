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

const sourceDocument = "SVT Tle C_L5_Le système de défense de lorganisme.pdf";

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
      introduction: "Observe, identifie les acteurs immunitaires, ordonne le mécanisme puis formule une conclusion précise avec le vocabulaire du programme.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : une bonne réponse distingue toujours ce qui reconnaît, ce qui agit et ce qui reste en mémoire.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const antibodyShapes: SchemaShape[] = [
  { shape: "line", x1: 360, y1: 315, x2: 360, y2: 205, tone: "fill" },
  { shape: "line", x1: 360, y1: 205, x2: 245, y2: 85, tone: "fill" },
  { shape: "line", x1: 360, y1: 205, x2: 475, y2: 85, tone: "fill" },
  { shape: "line", x1: 385, y1: 315, x2: 385, y2: 205, tone: "outline" },
  { shape: "line", x1: 385, y1: 205, x2: 500, y2: 85, tone: "outline" },
  { shape: "line", x1: 335, y1: 205, x2: 220, y2: 85, tone: "outline" },
  { shape: "circle", cx: 232, cy: 74, r: 19, tone: "accent" },
  { shape: "circle", cx: 488, cy: 74, r: 19, tone: "accent" },
  { shape: "text", x: 360, y: 355, content: "fragment Fc", anchor: "middle" },
  { shape: "text", x: 188, y: 46, content: "site antigène", anchor: "middle" },
  { shape: "text", x: 532, y: 46, content: "site antigène", anchor: "middle" },
];

const antibodyHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "binding-sites", number: 1, label: "Sites de liaison", x: 232, y: 74, detail: "Les extrémités variables reconnaissent des épitopes dont la forme chimique est complémentaire.", highlight: [{ shape: "circle", cx: 232, cy: 74, r: 24, tone: "accent" }, { shape: "circle", cx: 488, cy: 74, r: 24, tone: "accent" }] },
  { id: "variable", number: 2, label: "Régions variables", x: 500, y: 115, detail: "Elles diffèrent d’un clone de lymphocytes B à l’autre et déterminent la spécificité de l’anticorps." },
  { id: "constant", number: 3, label: "Région constante", x: 385, y: 270, detail: "Elle définit la classe d’immunoglobuline et peut recruter des effecteurs comme les phagocytes ou le complément." },
  { id: "heavy", number: 4, label: "Chaînes lourdes", x: 360, y: 185, detail: "Deux chaînes lourdes identiques forment l’axe du Y et une partie de chacun de ses bras." },
  { id: "light", number: 5, label: "Chaînes légères", x: 445, y: 145, detail: "Deux chaînes légères identiques complètent les bras de l’anticorps." },
];

const levels: LevelSeed[] = [
  {
    id: "barriers-innate-immunity",
    title: "Les barrières de l’immunité innée",
    summary: "Comprendre comment peau, muqueuses, sécrétions et microbiote limitent l’entrée des agents infectieux.",
    pages: "1-2",
    section: "Défenses non spécifiques : barrières naturelles",
    durationMinutes: 24,
    xp: 45,
    body: `
## 1. Défendre avant même l’infection

L’organisme est continuellement exposé à des microorganismes. La première protection est constituée par des **barrières naturelles**. Elles appartiennent à l’**immunité innée** : elles sont présentes avant la rencontre avec un agent donné, agissent rapidement et ne reconnaissent pas un antigène unique comme le ferait un clone lymphocytaire.

| Type de barrière | Exemples | Effet protecteur |
|---|---|---|
| physique ou mécanique | peau intacte, mucus, cils respiratoires, écoulement des larmes et de l’urine | bloque, piège ou évacue les microbes |
| chimique | acidité de la peau et de l’estomac, lysozyme des larmes et de la salive, molécules antimicrobiennes | rend le milieu défavorable ou endommage certains microbes |
| biologique | microbiote cutané, intestinal et vaginal | occupe l’espace et les ressources, limite l’installation d’espèces pathogènes |

La **peau** possède un épithélium kératinisé difficile à franchir lorsqu’il est intact. Les **muqueuses** tapissent les voies respiratoires, digestives et uro-génitales. Elles ne sont pas de simples parois : mucus, mouvements ciliaires et renouvellement cellulaire participent aussi à la défense.

## 2. Une protection efficace, mais non absolue

Une coupure, une brûlure, une piqûre ou une altération de la muqueuse ouvre une porte d’entrée. Des microbes peuvent alors atteindre le tissu sous-jacent. L’organisme déclenche une réaction inflammatoire locale et mobilise des cellules capables de phagocytose.

> **Précision scientifique :** le document donne des valeurs de pH très fixes et qualifie certaines sécrétions d’« antibiotiques ». En réalité, leur composition et leur acidité varient. On retient l’idée essentielle : ces milieux possèdent des propriétés **antimicrobiennes**, sans attribuer toute la protection à une valeur unique.

> **Astuce mémoire — M-C-B :** barrières **M**écaniques, **C**himiques et **B**iologiques. Elles coopèrent à la même frontière.
`,
    keyPoint: "Les barrières mécaniques, chimiques et biologiques constituent une défense innée immédiate qui empêche ou limite l’entrée des microbes.",
    example: "Les cils respiratoires remontent le mucus chargé de particules : c’est une barrière mécanique, renforcée par des molécules antimicrobiennes.",
    methodSteps: [
      "Repère la surface exposée : peau ou muqueuse.",
      "Classe le mécanisme en barrière mécanique, chimique ou biologique.",
      "Explique comment il bloque, évacue ou concurrence les microbes.",
      "Précise qu’une lésion peut permettre le franchissement de la barrière.",
    ],
    interaction: diagram(
      "Explorer les premières lignes de défense",
      "Sélectionne chaque barrière et explique son action sans la confondre avec une réponse spécifique.",
      "Frontières de l’organisme",
      "La peau et les muqueuses associent plusieurs mécanismes qui agissent avant l’installation de l’infection.",
      [
        { id: "skin", label: "Peau", role: "Paroi kératinisée", detail: "Une peau intacte oppose une barrière physique et porte un microbiote protecteur." },
        { id: "mucus", label: "Mucus et cils", role: "Piéger puis évacuer", detail: "Dans les voies respiratoires, le mucus capture des particules et les cils les déplacent vers l’extérieur." },
        { id: "secretions", label: "Sécrétions", role: "Milieu antimicrobien", detail: "Larmes, salive, suc gastrique et autres sécrétions contiennent ou créent des facteurs défavorables à certains microbes." },
        { id: "microbiota", label: "Microbiote", role: "Occuper le terrain", detail: "Les microorganismes commensaux concurrencent les espèces potentiellement pathogènes." },
      ],
      "Une même zone peut réunir les trois types de protection : la peau est à la fois physique, chimique et biologique.",
    ),
    questions: [
      choice("Quelle défense agit avant la reconnaissance d’un antigène précis ?", ["L’immunité innée", "Un clone mémoire", "Une greffe", "Un plasmocyte seul"], 0, "Les barrières relèvent de l’immunité innée.", "Barrières naturelles • pages 1-2"),
      choice("Quel exemple est une barrière mécanique ?", ["Un anticorps", "Le mouvement des cils respiratoires", "Un lymphocyte mémoire", "Le CMH"], 1, "Les cils évacuent le mucus et ce qu’il a piégé."),
      choice("Quel rôle joue principalement le microbiote commensal ?", ["Produire des lymphocytes", "Former le thymus", "Limiter l’installation de microbes concurrents", "Fabriquer le CMH"], 2, "Le microbiote occupe les niches et les ressources."),
      choice("Quelle situation facilite le franchissement de la peau ?", ["Une peau intacte", "Le clignement", "Un microbiote équilibré", "Une piqûre"], 3, "La piqûre rompt la continuité de la barrière."),
      trueFalse("Les barrières naturelles sont spécifiques d’un seul antigène.", false, "Elles ont une action large et non spécifique."),
      choice("Quelle molécule antimicrobienne est présente notamment dans les larmes ?", ["Le lysozyme", "L’hémoglobine", "L’ADN", "L’insuline"], 0, "Le lysozyme peut dégrader la paroi de certaines bactéries."),
      choice("Quelle structure protège les voies respiratoires ?", ["Le greffon", "Le couple mucus–cils", "Le chromosome 6 seul", "Le plasma cellulaire"], 1, "Le mucus piège et les cils évacuent."),
      choice("Comment faut-il interpréter l’acidité d’une sécrétion ?", ["Elle est toujours exactement identique", "Elle remplace toutes les cellules immunitaires", "Elle peut rendre le milieu défavorable à certains microbes", "Elle crée un antigène"], 2, "L’acidité contribue à la protection sans être une valeur universelle."),
      choice("Quel ensemble tapisse les cavités ouvertes sur l’extérieur ?", ["Les tendons", "Les os", "Les ganglions", "Les muqueuses"], 3, "Les muqueuses bordent notamment les voies digestives et respiratoires."),
      short("Nomme les microorganismes commensaux qui occupent normalement une surface du corps.", ["microbiote", "le microbiote", "flore microbienne", "la flore microbienne"], "Cet ensemble est appelé microbiote."),
    ],
    corrections: [
      "Les pH très fixes du document sont remplacés par l’idée scientifiquement juste d’une acidité variable selon le site et les conditions.",
      "Le terme imprécis « sécrétion antibiotique » est remplacé par « propriétés antimicrobiennes ».",
      "Le microbiote est présenté comme une barrière biologique dynamique et non comme une simple liste de microbes.",
    ],
  },
  {
    id: "adaptive-specificity-experiments",
    title: "Prouver la spécificité et le transfert de l’immunité",
    summary: "Exploiter les expériences sur tétanos, diphtérie et bacille de Koch pour distinguer immunité active, passive, humorale et cellulaire.",
    pages: "4-6",
    section: "Expériences de protection spécifique et de transfert",
    durationMinutes: 31,
    xp: 70,
    body: `
## 1. Première preuve : une protection dirigée

Le document compare plusieurs souris. Une souris reçoit d’abord une **anatoxine tétanique**, puis résiste à une injection ultérieure de toxine tétanique. Si cette même préparation est suivie de toxine diphtérique, elle ne protège pas. La souris témoin non immunisée meurt après la toxine tétanique.

La variable importante est l’identité de l’antigène : la protection acquise contre le tétanos ne protège pas automatiquement contre la diphtérie. La réponse adaptative est donc **spécifique**.

Une **anatoxine** est une toxine rendue non toxique tout en conservant des structures capables de déclencher une réponse immunitaire. Il est préférable de parler de toxine **inactivée** plutôt que de toxine « atténuée », expression habituellement réservée à un microorganisme vivant dont la virulence a été réduite.

## 2. Immunité active ou passive

| Situation | Ce qui est transféré ou injecté | Type de protection | Mémoire chez le receveur |
|---|---|---|---|
| vaccination par anatoxine | antigène non toxique | active, plus lente à s’installer | oui |
| sérum d’un animal immunisé | anticorps déjà formés | passive, rapide mais temporaire | non |

Le sérum d’une souris immunisée protège immédiatement une souris naïve contre la toxine correspondante : le facteur protecteur est soluble. Cette expérience révèle une **immunité humorale**. Un sérum témoin dépourvu des anticorps adaptés ne protège pas.

## 3. Quand les cellules portent la protection

Dans l’expérience utilisant le bacille de Koch, le transfert de sérum ne suffit pas, alors que le transfert de lymphocytes vivants d’un animal immunisé protège le receveur. Le support principal de la protection observée est donc **cellulaire**.

Ces expériences ne disent pas que les branches humorale et cellulaire fonctionnent toujours isolément. Dans un organisme réel, cellules présentatrices, lymphocytes T, lymphocytes B, anticorps et phagocytes coopèrent.

> **Précision tétanos :** contracter le tétanos ne garantit pas une immunité durable, car une quantité infime de toxine peut provoquer la maladie sans stimuler suffisamment la mémoire. La vaccination par anatoxine reste nécessaire selon les recommandations sanitaires.

> **Astuce mémoire — A fabrique, P reçoit :** en immunité **A**ctive, le sujet fabrique sa réponse ; en immunité **P**assive, il reçoit des effecteurs déjà prêts.
`,
    keyPoint: "La protection adaptative est spécifique ; la vaccination produit une immunité active et mémorisée, tandis que le sérum apporte une protection passive, immédiate et temporaire.",
    example: "Si seul le sérum d’un animal immunisé protège un receveur, on conclut à un facteur soluble spécifique, le plus souvent des anticorps : c’est un transfert passif humoral.",
    methodSteps: [
      "Identifie le traitement initial, l’épreuve finale et le résultat de chaque lot.",
      "Compare toujours un lot expérimental au témoin pertinent.",
      "Teste la spécificité en changeant l’antigène de l’épreuve.",
      "Distingue support soluble du sérum et support cellulaire des lymphocytes.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Expérience interactive",
      title: "Lire les transferts sans sauter d’étape",
      instruction: "Parcours les expériences et formule une seule conclusion appuyée par la comparaison affichée.",
      items: [
        { label: "Anatoxine puis toxine tétanique", shortLabel: "Même cible", detail: "La souris survit : une protection active contre le tétanos a été induite." },
        { label: "Anatoxine tétanique puis toxine diphtérique", shortLabel: "Autre cible", detail: "La souris n’est pas protégée : la réponse est spécifique de l’antigène." },
        { label: "Sérum immunisé puis toxine", shortLabel: "Sérum +", detail: "La protection est transférée rapidement par des molécules solubles : immunité passive humorale." },
        { label: "Sérum témoin puis toxine", shortLabel: "Sérum −", detail: "L’absence de protection montre qu’un sérum quelconque ne suffit pas." },
        { label: "Lymphocytes immunisés et bacille de Koch", shortLabel: "Cellules +", detail: "La protection transférée avec des cellules vivantes met en évidence une immunité à médiation cellulaire." },
      ],
      observation: "Une survie isolée ne suffit pas : c’est la comparaison entre lots ne différant que par une variable qui permet de conclure.",
    },
    questions: [
      choice("Que montre l’absence de protection contre la diphtérie après anatoxine tétanique ?", ["La spécificité de la réponse", "L’absence de toute immunité", "La formation d’un greffon", "La disparition du sérum"], 0, "La protection vise l’antigène tétanique et non tout antigène.", "Expériences souris • pages 4-6"),
      choice("Qu’est-ce qu’une anatoxine ?", ["Une bactérie vivante très virulente", "Une toxine inactivée qui conserve son pouvoir antigénique", "Un globule rouge", "Un antibiotique"], 1, "L’anatoxine ne doit plus être toxique mais reste immunogène."),
      choice("Quel élément protecteur est transféré par le sérum immunisé ?", ["Des os", "Des chromosomes", "Des anticorps", "Des neurones"], 2, "Les anticorps sont des effecteurs solubles du sérum."),
      choice("Quel qualificatif décrit la séroprotection du receveur ?", ["Active et durable", "Cellulaire et génétique", "Innée et héréditaire", "Passive et temporaire"], 3, "Le receveur reçoit des anticorps déjà formés."),
      trueFalse("La vaccination par anatoxine crée normalement une mémoire immunitaire.", true, "L’immunité active sélectionne des clones et génère des cellules mémoire."),
      choice("Quel support protège dans l’expérience du bacille de Koch présentée ?", ["Les lymphocytes vivants", "Le sérum témoin", "L’eau", "Les globules rouges"], 0, "Le transfert cellulaire, et non le sérum, transmet la protection observée."),
      choice("Pourquoi faut-il un lot témoin ?", ["Pour ajouter une seconde maladie", "Pour attribuer le résultat à la variable étudiée", "Pour supprimer les comparaisons", "Pour garantir toujours la survie"], 1, "Le témoin établit ce qui se passe sans le facteur testé."),
      choice("Quelle protection s’installe généralement le plus vite ?", ["Une mémoire encore inexistante", "Une vaccination primaire", "Une immunité passive par anticorps prêts", "Une greffe"], 2, "Les anticorps transférés agissent immédiatement."),
      choice("Quelle affirmation sur le tétanos est correcte ?", ["La maladie protège toujours à vie", "La toxine n’a aucun antigène", "Les rappels sont inutiles", "La maladie ne garantit pas une immunité suffisante"], 3, "La dose pathogène peut être trop faible pour induire une mémoire protectrice."),
      trueFalse("Humoral signifie que toute la réponse se déroule sans aucune cellule.", false, "Les anticorps sont solubles, mais leur production et leur action impliquent des cellules."),
      short("Nomme l’immunité obtenue lorsque le sujet fabrique lui-même sa réponse après vaccination.", ["immunité active", "l’immunité active", "active"], "La vaccination déclenche une immunité active."),
    ],
    corrections: [
      "L’anatoxine est définie comme une toxine inactivée et non comme une toxine simplement « atténuée ».",
      "Le transfert sérique est qualifié d’immunité passive, immédiate et temporaire ; la vaccination est active et productrice de mémoire.",
      "Il est précisé que la maladie tétanique ne garantit pas une immunité durable et ne remplace pas la vaccination.",
    ],
  },
  {
    id: "antibodies-humoral-immunity",
    title: "Les anticorps et la réponse humorale",
    summary: "Lire la structure d’un anticorps, distinguer les classes d’immunoglobulines et expliquer neutralisation, opsonisation et activation du complément.",
    pages: "5-8 et 21-22",
    section: "Structure, classes et rôles des anticorps",
    durationMinutes: 33,
    xp: 75,
    body: `
## 1. Une molécule en Y, spécifique d’un épitope

Un **anticorps** ou immunoglobuline est une protéine produite sous forme sécrétée par les **plasmocytes**. Il est formé de deux chaînes lourdes identiques et de deux chaînes légères identiques. Les extrémités des bras comportent des **régions variables** qui forment deux sites de liaison à l’antigène. La partie constante recrute d’autres acteurs.

Un anticorps ne reconnaît pas nécessairement un microbe entier : il se lie à une petite région moléculaire appelée **épitope**. Des anticorps différents peuvent donc reconnaître des épitopes différents du même agent.

## 2. Les cinq grandes classes

| Classe | Repère fonctionnel utile |
|---|---|
| IgM | souvent produite tôt lors d’une première réponse ; forme sécrétée généralement pentamérique |
| IgG | principale immunoglobuline du sang ; opsonisation, neutralisation, certaines activent le complément ; traverse le placenta |
| IgA | protège surtout les muqueuses et se retrouve dans des sécrétions, dont le lait |
| IgE | impliquée dans la défense contre certains parasites et dans les réactions allergiques |
| IgD | surtout récepteur à la surface de lymphocytes B naïfs |

Les pourcentages et durées indiqués dans les tableaux scolaires sont des ordres de grandeur variables, pas des constantes universelles à apprendre au chiffre près.

## 3. L’anticorps marque, bloque ou recrute

- **neutralisation** : il empêche une toxine ou un virus de se fixer à sa cible ;
- **agglutination** : il relie plusieurs particules et facilite leur élimination ;
- **opsonisation** : son fragment constant est reconnu par des récepteurs de phagocytes ;
- **activation du complément** : certains complexes avec IgM ou certaines IgG déclenchent la voie classique ;
- **cytotoxicité dépendante des anticorps** : des cellules effectrices peuvent reconnaître la région constante d’anticorps fixés à une cible.

Le complexe antigène–anticorps ne « digère » pas directement l’antigène : il le neutralise ou le rend plus facile à éliminer par d’autres effecteurs.

> **Astuce mémoire — M-G-A-E-D :** **M**atin (IgM arrive tôt), **G**rossesse (IgG traverse le placenta), **A**ccès muqueux (IgA), **E**xagération allergique (IgE), **D**étection du B naïf (IgD).
`,
    keyPoint: "Les régions variables assurent la spécificité ; la région constante détermine la classe et recrute des effecteurs pour neutraliser ou éliminer la cible.",
    example: "Un anticorps antitétanique se fixe à la toxine et bloque son interaction avec les cellules nerveuses : c’est une neutralisation spécifique.",
    methodSteps: [
      "Repère les deux sites de liaison aux extrémités du Y.",
      "Distingue région variable de région constante.",
      "Identifie la classe à partir du lieu ou de la fonction indiquée.",
      "Nomme l’effet de l’anticorps sans lui attribuer seul toute la destruction.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure originale annotée",
      title: "Anatomie fonctionnelle d’un anticorps",
      instruction: "Appuie sur chaque repère pour relier une partie du Y à sa fonction.",
      viewBox: "0 0 720 390",
      caption: "Schéma pédagogique original ; l’épaisseur et les angles ne représentent pas l’échelle moléculaire réelle.",
      shapes: antibodyShapes,
      hotspots: antibodyHotspots,
      observation: "Les deux bras portent la même spécificité dans une molécule donnée ; la région constante communique avec les effecteurs.",
    },
    questions: [
      choice("Quelles régions déterminent directement la spécificité d’un anticorps ?", ["Les régions variables", "Les globules rouges", "Les chromosomes sexuels", "Les lysosomes seuls"], 0, "Elles forment les sites de liaison à l’épitope.", "Anticorps • pages 5-8"),
      choice("Quelle cellule sécrète de grandes quantités d’anticorps ?", ["Le neutrophile", "Le plasmocyte", "Le neurone", "Le globule rouge"], 1, "Le plasmocyte dérive d’un lymphocyte B activé."),
      choice("Quelle immunoglobuline domine dans les sécrétions muqueuses ?", ["IgD", "IgE", "IgA", "IgM uniquement"], 2, "IgA est la classe majeure des sécrétions."),
      choice("Quelle classe traverse le placenta ?", ["IgE", "IgM", "IgA sécrétoire", "IgG"], 3, "IgG est transportée activement à travers le placenta."),
      trueFalse("Un anticorps possède habituellement deux sites de liaison de même spécificité.", true, "Les deux bras d’un anticorps donné ont la même région variable."),
      choice("Quelle classe apparaît souvent tôt dans une première réponse ?", ["IgM", "IgD uniquement", "IgE uniquement", "Aucune"], 0, "IgM est souvent la première classe sécrétée en quantité."),
      choice("Quel mécanisme empêche une toxine de se fixer à sa cellule cible ?", ["La greffe", "La neutralisation", "La diapédèse", "La maturation thymique"], 1, "L’anticorps neutralisant bloque l’interaction toxine–récepteur."),
      choice("Quel terme désigne le regroupement de particules par des anticorps ?", ["Apoptose", "Transcription", "Agglutination", "Mitose"], 2, "Un anticorps peut relier plusieurs particules."),
      choice("Quelle classe est fortement associée aux allergies immédiates ?", ["IgG", "IgA", "IgD", "IgE"], 3, "IgE se fixe notamment sur les mastocytes."),
      trueFalse("Tous les anticorps activent de manière identique la voie classique du complément.", false, "IgM et certaines IgG l’activent particulièrement ; les classes diffèrent."),
      short("Nomme la petite région d’un antigène reconnue par un anticorps.", ["épitope", "un épitope", "l’épitope", "epitope", "déterminant antigénique", "le déterminant antigénique"], "Cette région moléculaire est l’épitope."),
    ],
    corrections: [
      "Les fonctions des cinq classes sont actualisées sans figer les pourcentages et demi-vies du tableau source.",
      "La voie classique du complément est reliée à IgM et à certaines IgG, non à IgG seulement.",
      "Le complexe immun est présenté comme neutralisant ou facilitant l’élimination, sans lui attribuer une digestion autonome de l’antigène.",
    ],
  },
  {
    id: "cellular-immunity-lymphoid-organs",
    title: "Lymphocytes, organes lymphoïdes et immunité cellulaire",
    summary: "Situer l’origine et la maturation des lymphocytes puis relier les organes lymphoïdes secondaires à leur activation.",
    pages: "6-8 et 11-13",
    section: "Origine des lymphocytes, organes lymphoïdes et protection cellulaire",
    durationMinutes: 30,
    xp: 75,
    body: `
## 1. Une origine commune, deux lieux de maturation

Les cellules immunitaires proviennent de cellules souches hématopoïétiques de la **moelle osseuse**. Les lymphocytes B y poursuivent leur maturation. Les précurseurs des lymphocytes T migrent vers le **thymus**, où ils mûrissent et sont sélectionnés.

| Organe | Catégorie | Rôle principal |
|---|---|---|
| moelle osseuse | lymphoïde primaire | production des cellules sanguines et maturation des B |
| thymus | lymphoïde primaire | maturation et sélection des T |
| ganglions lymphatiques | lymphoïde secondaire | rencontre entre antigènes drainés, cellules présentatrices et lymphocytes |
| rate | lymphoïde secondaire | surveillance des antigènes présents dans le sang |

La **bourse de Fabricius** citée dans le document est un organe propre aux oiseaux. Chez les mammifères, la maturation des lymphocytes B se fait dans la moelle osseuse.

## 2. Les organes secondaires ne sont pas de simples réserves

Un ganglion reçoit la lymphe d’un territoire. Les cellules dendritiques porteuses d’antigènes et les lymphocytes qui circulent peuvent s’y rencontrer. Un clone rare dont le récepteur correspond à l’antigène est activé, prolifère et se différencie. Cette forte activité explique l’augmentation de volume d’un ganglion lors de certaines infections.

La rate joue un rôle comparable pour les antigènes transportés par le sang. Ces organes organisent donc la réponse ; ils ne stockent pas seulement des cellules inactives.

## 3. Le support cellulaire de la protection

L’expérience du bacille de Koch montre que la protection peut être transférée par des **lymphocytes vivants** alors que le sérum est insuffisant. Une réponse à médiation cellulaire est particulièrement adaptée aux cellules infectées par des agents intracellulaires et à certaines cellules étrangères.

Les lymphocytes T CD4 auxiliaires coordonnent la réponse par contact et cytokines. Les lymphocytes T CD8 cytotoxiques reconnaissent certaines cellules porteuses de peptides anormaux et peuvent déclencher leur apoptose. Des lymphocytes mémoire persistent après la réponse.

> **Astuce mémoire — B dans Bone, T dans Thymus :** la moelle est « bone marrow » et garde les B ; le thymus accueille les T.
`,
    keyPoint: "B et T proviennent de la moelle ; les B mûrissent dans la moelle, les T dans le thymus, puis leur activation se déroule surtout dans ganglions et rate.",
    example: "Un antigène venant d’une plaie est drainé vers un ganglion : il y rencontre des lymphocytes rares, dont les clones spécifiques prolifèrent.",
    methodSteps: [
      "Distingue origine dans la moelle et lieu de maturation.",
      "Classe moelle et thymus comme organes primaires.",
      "Classe ganglions et rate comme organes secondaires.",
      "Relie un transfert protecteur de lymphocytes à une médiation cellulaire.",
    ],
    interaction: diagram(
      "Explorer le trajet des lymphocytes",
      "Sélectionne chaque organe et précise s’il produit, fait mûrir ou active les lymphocytes.",
      "Cellule souche de la moelle osseuse",
      "Une origine commune donne des lignées différentes, ensuite organisées dans les organes lymphoïdes.",
      [
        { id: "marrow", label: "Moelle osseuse", role: "Produire et mûrir les B", detail: "La moelle produit les précurseurs immunitaires et assure la maturation des lymphocytes B chez les mammifères." },
        { id: "thymus", label: "Thymus", role: "Mûrir les T", detail: "Les précurseurs T y apprennent à reconnaître le CMH tout en limitant la forte autoréactivité." },
        { id: "nodes", label: "Ganglions", role: "Surveiller la lymphe", detail: "Ils organisent la rencontre entre antigènes drainés, cellules présentatrices et lymphocytes." },
        { id: "spleen", label: "Rate", role: "Surveiller le sang", detail: "Elle concentre les rencontres immunitaires pour des antigènes présents dans la circulation sanguine." },
        { id: "memory", label: "Cellules mémoire", role: "Persister", detail: "Une fraction des clones activés demeure et accélère une réponse ultérieure contre le même antigène." },
      ],
      "Primaire signifie ici maturation ; secondaire signifie activation organisée, pas importance moindre.",
    ),
    questions: [
      choice("Où naissent les précurseurs des lymphocytes B et T ?", ["Dans la moelle osseuse", "Dans le tendon", "Dans la peau uniquement", "Dans l’estomac"], 0, "Ils dérivent de cellules souches hématopoïétiques de la moelle.", "Organes lymphoïdes • pages 6-8 et 12"),
      choice("Où mûrissent les lymphocytes T ?", ["Dans la rate", "Dans le thymus", "Dans le foie uniquement", "Dans le muscle"], 1, "Le thymus assure leur maturation et leur sélection."),
      choice("Quel organe surveille surtout les antigènes transportés par le sang ?", ["Le ganglion seul", "Le pancréas", "La rate", "Le tendon"], 2, "La rate est un organe lymphoïde secondaire lié au sang."),
      choice("Quel organe est propre aux oiseaux dans ce contexte ?", ["La moelle", "Le thymus", "La rate", "La bourse de Fabricius"], 3, "La bourse de Fabricius intervient dans la maturation B des oiseaux."),
      trueFalse("Un ganglion lymphatique est uniquement un entrepôt de lymphocytes inactifs.", false, "Il organise présentation, activation et prolifération."),
      choice("Quel organe draine la lymphe d’un territoire ?", ["Un ganglion lymphatique", "Une strie Z", "Un alvéole seul", "Le chromosome 6"], 0, "Les ganglions filtrent la lymphe régionale."),
      choice("Que montre une protection transférée par des lymphocytes vivants ?", ["Une immunité exclusivement mécanique", "Une médiation cellulaire", "Une absence de spécificité", "Une transformation en globules rouges"], 1, "Les cellules sont ici le support essentiel de la protection."),
      choice("Quel lymphocyte coordonne notamment la réponse par des cytokines ?", ["Le globule rouge", "Le plasmocyte seul", "Le lymphocyte T CD4 auxiliaire", "Le neutrophile uniquement"], 2, "Les T CD4 auxiliaires activés coordonnent plusieurs partenaires."),
      choice("Quel lymphocyte peut tuer une cellule infectée ?", ["Le lymphocyte B naïf uniquement", "Le globule rouge", "La plaquette", "Le lymphocyte T CD8 cytotoxique"], 3, "Le T CD8 cytotoxique peut déclencher l’apoptose de sa cible."),
      short("Nomme l’organe où mûrissent les lymphocytes B chez les mammifères.", ["moelle osseuse", "la moelle osseuse", "moelle", "la moelle"], "Les lymphocytes B mûrissent dans la moelle osseuse."),
    ],
    corrections: [
      "La bourse de Fabricius est clairement réservée aux oiseaux ; la maturation B des mammifères est située dans la moelle osseuse.",
      "Ganglions et rate sont décrits comme des lieux d’activation organisée, pas comme de simples organes de stockage.",
      "La nomenclature moderne CD4/CD8 remplace progressivement T4/T8 sans perdre le vocabulaire du programme.",
    ],
  },
  {
    id: "inflammation-recruitment",
    title: "La réaction inflammatoire locale",
    summary: "Relier rougeur, chaleur, gonflement et douleur aux modifications vasculaires et au recrutement des leucocytes.",
    pages: "1-3",
    section: "Piqûre, inflammation et arrivée des phagocytes",
    durationMinutes: 27,
    xp: 50,
    body: `
## 1. Le signal d’alarme du tissu lésé

Après une piqûre contaminée, des cellules du tissu et des cellules sentinelles détectent la lésion et des motifs microbiens. Elles libèrent des **médiateurs inflammatoires**. Ces signaux provoquent rapidement des transformations locales.

Les quatre signes classiques sont :

- **rougeur** et **chaleur**, liées surtout à la vasodilatation et à l’augmentation du débit sanguin ;
- **gonflement** ou œdème, lié à l’augmentation de la perméabilité des capillaires et à la sortie de liquide ;
- **douleur**, favorisée par les médiateurs et la pression exercée dans le tissu.

Une perte temporaire de fonction peut s’ajouter à ces quatre signes. Elle n’est pas nécessaire pour reconnaître une inflammation.

## 2. Faire venir les cellules utiles

L’endothélium vasculaire devient plus adhésif et plus perméable. Des leucocytes ralentissent, adhèrent à la paroi puis la traversent : c’est la **diapédèse**. Ils suivent ensuite des gradients de signaux chimiques vers le foyer : c’est le **chimiotactisme**.

Les **neutrophiles** arrivent souvent très tôt. Les monocytes quittent aussi le sang et peuvent se différencier en macrophages dans les tissus. Ces phagocytes reconnaissent, engloutissent et détruisent de nombreux microbes sans exiger la sélection préalable d’un clone spécifique.

## 3. Une réponse utile qu’il faut réguler

L’inflammation isole le danger, apporte des protéines plasmatiques et recrute des cellules de défense. Elle prépare aussi l’activation de l’immunité adaptative. Cependant, une inflammation excessive ou prolongée peut endommager les tissus : elle doit être contrôlée puis résolue.

> **Astuce mémoire — R-C-G-D :** **R**ougeur, **C**haleur, **G**onflement, **D**ouleur. Pour expliquer, pense ensuite aux vaisseaux, au liquide et aux médiateurs.
`,
    keyPoint: "L’inflammation est une réponse innée locale : vasodilatation et perméabilité expliquent ses signes, tandis que diapédèse et chimiotactisme recrutent les phagocytes.",
    example: "Une zone piquée devient rouge et gonflée : le débit sanguin augmente, la paroi capillaire laisse sortir du liquide et des leucocytes gagnent le foyer.",
    methodSteps: [
      "Décris d’abord les signes visibles sans les interpréter.",
      "Relie rougeur et chaleur à la vasodilatation.",
      "Relie le gonflement à la perméabilité vasculaire et à l’œdème.",
      "Explique l’arrivée des leucocytes par adhérence, diapédèse puis chimiotactisme.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Chronologie interactive",
      title: "De la piqûre au foyer inflammatoire",
      instruction: "Avance étape par étape et associe chaque observation au mécanisme correspondant.",
      items: [
        { label: "Franchissement", shortLabel: "0 min", detail: "La piqûre rompt la barrière et peut déposer des microbes dans le tissu." },
        { label: "Détection", shortLabel: "Alerte", detail: "Des cellules sentinelles reconnaissent la lésion ou des motifs microbiens et libèrent des médiateurs." },
        { label: "Vaisseaux", shortLabel: "Rougeur", detail: "Vasodilatation et perméabilité augmentent : chaleur, rougeur et œdème apparaissent." },
        { label: "Recrutement", shortLabel: "Diapédèse", detail: "Neutrophiles et monocytes adhèrent à l’endothélium puis traversent la paroi." },
        { label: "Action locale", shortLabel: "Phagocytes", detail: "Les cellules migrent par chimiotactisme, phagocytent et contribuent à contrôler le foyer." },
        { label: "Résolution", shortLabel: "Retour", detail: "Si le danger est maîtrisé, les signaux diminuent et le tissu entre en réparation." },
      ],
      observation: "Le gonflement ne signifie pas que le microbe grossit : il vient surtout du liquide et des cellules sortis des vaisseaux.",
    },
    questions: [
      choice("Quel phénomène explique surtout rougeur et chaleur ?", ["La vasodilatation", "La mémoire B", "La mitose du greffon", "La fermeture des capillaires"], 0, "La vasodilatation augmente l’afflux sanguin.", "Inflammation après piqûre • pages 1-3"),
      choice("Quel phénomène contribue au gonflement ?", ["La baisse de tout débit", "La sortie de liquide liée à la perméabilité vasculaire", "La production d’os", "La disparition du tissu"], 1, "L’exsudation de liquide produit un œdème."),
      choice("Comment nomme-t-on la traversée de la paroi vasculaire par un leucocyte ?", ["Opsonisation", "Transcription", "Diapédèse", "Agglutination"], 2, "La diapédèse permet au leucocyte de rejoindre le tissu."),
      choice("Quel leucocyte est souvent recruté très tôt ?", ["Le globule rouge", "Le spermatozoïde", "Le neurone", "Le neutrophile"], 3, "Les neutrophiles sont des acteurs précoces majeurs."),
      trueFalse("L’inflammation appartient uniquement à l’immunité adaptative.", false, "C’est d’abord une réponse innée."),
      choice("Quel terme désigne la migration orientée par des signaux chimiques ?", ["Chimiotactisme", "Isogreffe", "Tolérance centrale", "Osmose seule"], 0, "Le chimiotactisme guide les cellules vers le foyer."),
      choice("Pourquoi la zone peut-elle être douloureuse ?", ["Les anticorps deviennent des os", "Des médiateurs et la pression tissulaire stimulent les terminaisons sensitives", "Le CMH disparaît", "Les lymphocytes sécrètent toujours du pus"], 1, "Médiateurs et pression participent à la douleur."),
      choice("Quel rôle utile joue l’inflammation ?", ["Elle garantit toujours l’absence de lésion", "Elle remplace la peau", "Elle recrute des effecteurs au foyer", "Elle fabrique le chromosome 6"], 2, "Elle concentre cellules et molécules de défense."),
      choice("Quel signe est additionnel aux quatre signes classiques ?", ["L’hérédité", "La photosynthèse", "La fécondation", "La perte de fonction"], 3, "Une perte de fonction peut accompagner l’inflammation."),
      short("Nomme le gonflement produit par l’accumulation de liquide dans le tissu.", ["œdème", "oedème", "l’œdème", "l'oedème", "oedeme"], "Ce gonflement est un œdème inflammatoire."),
    ],
    corrections: [
      "Les quatre signes cardinaux sont distingués de la perte de fonction, signe supplémentaire.",
      "Le terme ancien « polynucléaire microphage » est remplacé par neutrophile, avec le vocabulaire moderne de diapédèse et chimiotactisme.",
      "L’inflammation est présentée comme utile mais régulée, et non comme une simple conséquence mécanique de la blessure.",
    ],
  },
  {
    id: "phagocytosis-infection-spread",
    title: "La phagocytose et l’évolution de l’infection",
    summary: "Ordonner les étapes de la phagocytose, comparer ses issues et interpréter une extension locale ou systémique de l’infection.",
    pages: "2-4",
    section: "Phagocytose, pus, voies lymphatiques et diffusion",
    durationMinutes: 29,
    xp: 55,
    body: `
## 1. Une ingestion suivie d’une destruction

La **phagocytose** ne se réduit pas au fait d’« avaler » un microbe. Elle suit une suite logique :

1. **reconnaissance et adhérence** du microbe à la membrane du phagocyte ;
2. **englobement** par des prolongements membranaires et formation d’un phagosome ;
3. fusion avec des lysosomes pour former un **phagolysosome** ;
4. destruction et digestion grâce à des enzymes et à des molécules toxiques pour le microbe ;
5. élimination de débris ou conservation de fragments utiles à la présentation antigénique.

Les neutrophiles et les macrophages sont deux grands phagocytes. Dans le modèle scolaire, les macrophages tissulaires sont souvent présentés comme issus de monocytes sanguins. C’est vrai pour beaucoup d’entre eux, même si certains macrophages résidents ont une origine plus précoce au cours du développement.

## 2. Trois issues possibles dans le document

| Observation | Interprétation prudente |
|---|---|
| microbes détruits et recul de l’infection | la réponse locale contrôle le foyer |
| microbes encore intacts dans des cellules | la destruction est incomplète ou certains microbes résistent |
| accumulation de cellules mortes, débris et microbes | formation possible de pus et poursuite du foyer |

Le **pus** est un liquide riche en neutrophiles morts ou mourants, microbes, débris cellulaires et liquide inflammatoire. Ce n’est pas un amas de « globules de graisse ».

## 3. Quand le foyer s’étend

Des microbes ou antigènes peuvent gagner les vaisseaux lymphatiques puis un ganglion drainant. L’augmentation d’activité du ganglion peut produire une **adénite** ; l’inflammation d’un vaisseau lymphatique est une **lymphangite**. Une infection mal contrôlée peut se généraliser.

> **Urgence à ne pas simplifier :** le **sepsis** est une dysfonction d’organe menaçant la vie, causée par une réponse dérégulée à une infection. Il ne correspond pas simplement à une succession de « barrières vaincues » ni à un foie qui aurait échoué. Une suspicion de sepsis relève d’une prise en charge médicale urgente.

> **Astuce mémoire — R-E-F-D :** **R**econnaître, **E**nglober, **F**usionner, **D**étruire.
`,
    keyPoint: "La phagocytose associe reconnaissance, phagosome, phagolysosome et digestion ; son efficacité influence le contrôle ou l’extension du foyer infectieux.",
    example: "Voir une bactérie dans une vacuole ne prouve pas qu’elle est déjà détruite : il faut distinguer l’englobement de la digestion dans le phagolysosome.",
    methodSteps: [
      "Replace les images ou verbes dans l’ordre reconnaissance–englobement–digestion.",
      "Nomme phagosome puis phagolysosome au bon moment.",
      "Décris l’état des microbes avant de conclure sur l’issue.",
      "Distingue extension lymphatique, infection généralisée et sepsis.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Mécanisme à remettre en ordre",
      title: "Suivre une phagocytose complète",
      instruction: "Sélectionne les étapes et vérifie ce qui est déjà accompli à chacune d’elles.",
      items: [
        { label: "Reconnaissance", shortLabel: "1", detail: "Des récepteurs du phagocyte se lient directement ou indirectement à la surface microbienne." },
        { label: "Englobement", shortLabel: "2", detail: "La membrane entoure la particule et forme un phagosome intracellulaire." },
        { label: "Fusion", shortLabel: "3", detail: "Le phagosome fusionne avec des lysosomes : le phagolysosome se forme." },
        { label: "Destruction", shortLabel: "4", detail: "Enzymes, acidification et molécules réactives attaquent le microbe." },
        { label: "Après-coup", shortLabel: "5", detail: "Les débris sont évacués ; certaines cellules peuvent présenter des peptides antigéniques." },
      ],
      observation: "Englobé ne veut pas dire détruit : la fusion avec les lysosomes et les mécanismes microbicides sont indispensables.",
    },
    questions: [
      choice("Quelle étape vient avant l’englobement ?", ["La reconnaissance et l’adhérence", "La mémoire", "La greffe", "La production d’IgG placentaire"], 0, "Le phagocyte doit d’abord reconnaître et fixer sa cible.", "Phagocytose • pages 2-3"),
      choice("Quelle structure contient d’abord le microbe englouti ?", ["Le thymus", "Le phagosome", "Le chromosome", "Le tendon"], 1, "L’englobement produit un phagosome."),
      choice("Que forme la fusion d’un phagosome avec des lysosomes ?", ["Un anticorps", "Un greffon", "Un phagolysosome", "Un neurone"], 2, "La digestion se déroule dans le phagolysosome."),
      choice("De quoi le pus est-il principalement constitué ?", ["Uniquement de graisse", "Uniquement d’anticorps", "Uniquement d’eau", "Cellules mortes, microbes, débris et liquide"], 3, "Le pus résulte de l’accumulation d’éléments inflammatoires."),
      trueFalse("Un microbe simplement englobé est nécessairement déjà détruit.", false, "La digestion peut être incomplète et certains microbes résistent."),
      choice("Quels leucocytes sont de grands phagocytes précoces ?", ["Les neutrophiles", "Les globules rouges", "Les plaquettes seules", "Les plasmocytes uniquement"], 0, "Les neutrophiles phagocytent rapidement au foyer."),
      choice("Quel organe peut gonfler lorsqu’il draine un foyer infectieux ?", ["Le sarcomère", "Le ganglion lymphatique", "Le cristallin", "Le cheveu"], 1, "L’activité immunitaire augmente dans le ganglion drainant."),
      choice("Qu’est-ce qu’une lymphangite ?", ["Une classe d’anticorps", "Une greffe identique", "Une inflammation d’un vaisseau lymphatique", "Une maturation du lymphocyte B"], 2, "Le suffixe -ite indique une inflammation."),
      choice("Quelle définition moderne du sepsis est correcte ?", ["Toute rougeur locale", "Un simple ganglion gonflé", "La présence d’un anticorps", "Une dysfonction d’organe menaçant la vie liée à une réponse dérégulée à l’infection"], 3, "Le sepsis est une urgence médicale systémique."),
      short("Nomme la vacuole issue de la fusion du phagosome et des lysosomes.", ["phagolysosome", "le phagolysosome", "phago-lysosome", "le phago-lysosome"], "Cette vacuole réalise l’essentiel de la digestion microbienne."),
    ],
    corrections: [
      "Le terme « absorption » est remplacé par les étapes précises reconnaissance, englobement, phagosome, phagolysosome et digestion.",
      "Le pus n’est pas assimilé à des globules de graisse : sa composition cellulaire et tissulaire est rétablie.",
      "Le sepsis est défini comme une dysfonction d’organe liée à une réponse dérégulée à l’infection, sans modèle erroné de « barrières successives ».",
    ],
  },
  {
    id: "complement-innate-effectors",
    title: "Le système du complément",
    summary: "Relier activation en cascade, opsonisation, inflammation et complexe d’attaque membranaire.",
    pages: "3-4 et 18-19",
    section: "Actions du complément et documents annexes",
    durationMinutes: 27,
    xp: 65,
    body: `
## 1. Un réseau de protéines plasmatiques

Le **complément** est un ensemble de protéines circulantes, produites notamment par le foie, qui s’activent en cascade. Il participe à l’immunité innée et renforce certaines réponses adaptatives. Le mot « complément » ne signifie donc pas qu’il dépend toujours d’un anticorps.

Trois voies peuvent déclencher la cascade :

- la **voie classique**, souvent activée par des complexes antigène–anticorps, en particulier avec IgM ou certaines IgG ;
- la **voie des lectines**, déclenchée par la reconnaissance de motifs glucidiques microbiens ;
- la **voie alternative**, activée et amplifiée sur certaines surfaces microbiennes.

Ces voies convergent vers l’activation de C3.

## 2. Trois conséquences à savoir expliquer

| Fragment ou ensemble | Action essentielle |
|---|---|
| C3b | se fixe à la cible et facilite sa phagocytose : **opsonisation** |
| C3a et surtout C5a | favorisent inflammation et recrutement cellulaire |
| C5b à C9 | assemblent un **complexe d’attaque membranaire** qui peut perforer certaines cibles |

L’opsonisation peut être comparée à une étiquette : le microbe recouvert de C3b est mieux saisi par des phagocytes possédant les récepteurs appropriés. Le complexe terminal forme des pores, mais ce mécanisme n’est pas l’unique ni toujours le principal effet protecteur du complément.

## 3. Une cascade sous contrôle

Les cellules de l’organisme portent des protéines régulatrices qui limitent l’activation du complément sur le « soi ». Sans régulation, cette cascade puissante pourrait léser les tissus.

> **Correction du document :** la voie classique n’est pas réservée à IgG. IgM et certaines sous-classes d’IgG peuvent l’activer. Les voies des lectines et alternative peuvent démarrer sans anticorps.

> **Astuce mémoire — O-I-P :** **O**psoniser avec C3b, **I**nflammer avec C3a/C5a, **P**erforer avec C5b–C9.
`,
    keyPoint: "Les voies du complément convergent vers C3 et produisent surtout opsonisation, inflammation et, pour certaines cibles, pores membranaires.",
    example: "Une bactérie recouverte de C3b est mieux reconnue par un neutrophile : le complément facilite ici la phagocytose par opsonisation.",
    methodSteps: [
      "Identifie si la question porte sur le déclenchement ou sur l’effet final.",
      "Place C3 au point de convergence des trois voies.",
      "Associe C3b à l’opsonisation et C3a/C5a à l’inflammation.",
      "Réserve C5b–C9 au complexe d’attaque membranaire.",
    ],
    interaction: diagram(
      "Explorer la cascade du complément",
      "Choisis une branche puis repère le point de convergence et ses trois grandes sorties.",
      "Activation du complément",
      "Voies classique, des lectines et alternative produisent des convertases qui convergent vers le clivage de C3.",
      [
        { id: "classical", label: "Voie classique", role: "Complexes immunitaires", detail: "Elle peut être déclenchée notamment par IgM ou certaines IgG liées à leur antigène." },
        { id: "lectin", label: "Voie des lectines", role: "Sucres microbiens", detail: "Des protéines de reconnaissance se lient à certains motifs glucidiques des microbes." },
        { id: "alternative", label: "Voie alternative", role: "Surface microbienne", detail: "Elle s’amplifie sur des surfaces insuffisamment protégées par les régulateurs du soi." },
        { id: "c3b", label: "C3b", role: "Opsonisation", detail: "C3b déposé sur la cible favorise sa capture par les phagocytes." },
        { id: "c3a-c5a", label: "C3a et C5a", role: "Inflammation", detail: "Ces fragments contribuent au recrutement et à l’activation de cellules inflammatoires." },
        { id: "mac", label: "C5b–C9", role: "Pore terminal", detail: "Le complexe d’attaque membranaire perturbe la membrane de certaines cibles." },
      ],
      "Les trois voies convergent, mais leurs effets ne se réduisent pas à la lyse : l’opsonisation est un résultat majeur.",
    ),
    questions: [
      choice("Quel fragment est un grand opsonisant ?", ["C3b", "ADN", "ATP", "HLA seul"], 0, "C3b se dépose sur la cible et facilite sa phagocytose.", "Complément • pages 3-4 et 18-19"),
      choice("Quel fragment favorise fortement le recrutement inflammatoire ?", ["IgD seule", "C5a", "Une strie Z", "L’insuline"], 1, "C5a est un puissant médiateur inflammatoire."),
      choice("Quels composants assemblent le complexe terminal ?", ["C1–C3 seulement", "IgA–IgE", "C5b–C9", "TCR–BCR"], 2, "C5b initie l’assemblage avec C6 à C9."),
      choice("Quelle voie reconnaît certains motifs glucidiques microbiens ?", ["La voie musculaire", "La voie lymphatique seule", "La voie génétique", "La voie des lectines"], 3, "La voie des lectines reconnaît des glucides caractéristiques."),
      trueFalse("Toutes les voies du complément ont besoin d’un anticorps pour commencer.", false, "Les voies alternative et des lectines peuvent démarrer sans anticorps."),
      choice("À quel composant convergent les trois voies ?", ["C3", "Une IgE", "Un plasmocyte", "Le thymus"], 0, "La formation d’une C3 convertase est centrale."),
      choice("Qu’est-ce que l’opsonisation ?", ["La destruction d’un chromosome", "Le marquage d’une cible facilitant sa phagocytose", "La formation d’un fœtus", "La maturation thymique"], 1, "L’opsonine rend la cible plus facile à capturer."),
      choice("Quel anticorps peut activer efficacement la voie classique ?", ["Aucun anticorps", "Seulement IgE", "IgM", "Seulement IgD"], 2, "IgM est un activateur efficace de la voie classique."),
      choice("Pourquoi faut-il réguler le complément ?", ["Pour créer des os", "Pour rendre tous les microbes identiques", "Pour supprimer la mémoire", "Pour éviter des lésions du soi"], 3, "Des régulateurs protègent les cellules de l’organisme."),
      short("Nomme le complexe formé par C5b à C9.", ["complexe d’attaque membranaire", "le complexe d’attaque membranaire", "complexe terminal", "le complexe terminal", "MAC"], "Il forme un pore dans la membrane de certaines cibles."),
    ],
    corrections: [
      "L’activation du complément n’est pas attribuée aux seuls anticorps : voies classique, des lectines et alternative sont distinguées.",
      "La voie classique est associée à IgM et à certaines IgG, et non à IgG uniquement.",
      "Les fonctions sont précisées par C3b, C3a/C5a et C5b–C9 au lieu d’une notion vague de « lyse directe ».",
    ],
  },
  {
    id: "grafts-self-nonself-hla",
    title: "Greffes, soi, non-soi et système HLA",
    summary: "Comparer autogreffe, isogreffe, allogreffe et xénogreffe puis expliquer le rôle des molécules HLA dans la compatibilité.",
    pages: "8-10 et 20",
    section: "Expériences de greffe et complexe majeur d’histocompatibilité",
    durationMinutes: 31,
    xp: 85,
    body: `
## 1. Quatre situations de greffe

Une **greffe** transfère un tissu ou un fragment d’organe. Une transplantation concerne généralement un organe entier. Le devenir du greffon dépend notamment de la distance génétique entre donneur et receveur et du contrôle médical de la réponse immunitaire.

| Type | Donneur et receveur | Résultat général sans traitement particulier |
|---|---|---|
| autogreffe | même individu | acceptation |
| isogreffe | individus génétiquement identiques | acceptation habituelle |
| allogreffe | individus différents de la même espèce | risque de rejet |
| xénogreffe | espèces différentes | très fort risque de rejet |

Le terme ancien **homogreffe** utilisé dans le document correspond à l’allogreffe. Le terme ancien **hétérogreffe** correspond à la xénogreffe.

## 2. L’identité biologique portée par HLA

Chez l’être humain, le complexe majeur d’histocompatibilité est appelé système **HLA**. Ses principaux gènes se trouvent sur le chromosome 6. Comme ces gènes possèdent de nombreux allèles, deux individus non apparentés ont rarement exactement le même ensemble HLA.

- le **CMH de classe I** est présent sur presque toutes les cellules nucléées et présente des peptides intracellulaires aux lymphocytes T CD8 ;
- le **CMH de classe II** est surtout exprimé par les cellules présentatrices professionnelles et présente des peptides aux lymphocytes T CD4.

Le « soi » désigne l’ensemble des caractéristiques moléculaires reconnues comme appartenant à l’individu. Le « non-soi » inclut des molécules étrangères susceptibles d’activer une réponse. Cette distinction est utile, mais le système immunitaire ne fonctionne pas comme un seul récepteur CMH qui déciderait à lui seul de tout.

## 3. Pourquoi une allogreffe peut être rejetée

Les lymphocytes T du receveur peuvent reconnaître comme étrangères les molécules HLA du donneur ou des peptides du donneur présentés par le HLA du receveur. Ils activent alors plusieurs mécanismes inflammatoires et cytotoxiques qui endommagent le greffon. Une bonne compatibilité HLA et des traitements immunosuppresseurs réduisent ce risque sans le supprimer totalement.

> **Correction du document :** ce n’est pas le CMH du receveur qui « ne reconnaît pas » le greffon comme le ferait un capteur autonome. Ce sont surtout des lymphocytes et d’autres effecteurs qui reconnaissent des différences moléculaires liées au HLA.

> **Astuce mémoire — Auto, Iso, Allo, Xéno :** **moi-même**, **identique**, **autre humain**, **autre espèce**.
`,
    keyPoint: "La compatibilité dépend fortement des molécules HLA ; les lymphocytes du receveur, et non un CMH agissant seul, peuvent déclencher le rejet d’un allogreffon.",
    example: "Une peau déplacée sur le même patient est une autogreffe ; une peau venant d’un autre humain non identique est une allogreffe à risque de rejet.",
    methodSteps: [
      "Identifie le lien génétique entre donneur et receveur.",
      "Nomme le type de greffe avec le vocabulaire moderne.",
      "Précise acceptation habituelle ou risque de rejet.",
      "Explique le rejet par la reconnaissance lymphocytaire de différences HLA.",
    ],
    interaction: diagram(
      "Comparer les greffes",
      "Sélectionne un transfert et vérifie l’identité du donneur avant de prévoir son devenir.",
      "Receveur d’un greffon",
      "Le risque immunologique augmente généralement lorsque la distance génétique entre donneur et receveur s’accroît.",
      [
        { id: "autograft", label: "Autogreffe", role: "Même individu", detail: "Le tissu porte le même HLA que le receveur ; l’acceptation est attendue." },
        { id: "isograft", label: "Isogreffe", role: "Génétiquement identique", detail: "Entre vrais jumeaux monozygotes, le HLA est normalement identique et le rejet adaptatif est très limité." },
        { id: "allograft", label: "Allogreffe", role: "Même espèce, individus différents", detail: "Des différences HLA peuvent activer les lymphocytes du receveur et provoquer un rejet." },
        { id: "xenograft", label: "Xénogreffe", role: "Espèces différentes", detail: "Les différences antigéniques sont nombreuses et le risque de rejet est particulièrement élevé." },
        { id: "hla-i", label: "HLA classe I", role: "Peptides → T CD8", detail: "La classe I est présente sur presque toutes les cellules nucléées et informe les T CD8 du contenu intracellulaire." },
        { id: "hla-ii", label: "HLA classe II", role: "Peptides → T CD4", detail: "La classe II est surtout portée par les cellules présentatrices professionnelles." },
      ],
      "Le classement de la greffe décrit la relation donneur–receveur ; HLA aide ensuite à comprendre le risque de rejet.",
    ),
    questions: [
      choice("Quel transfert est une autogreffe ?", ["Un tissu déplacé sur le même individu", "Un rein entre deux espèces", "Une peau entre inconnus", "Un sérum"], 0, "Auto signifie que donneur et receveur sont la même personne.", "Greffes • pages 8-10"),
      choice("Comment nomme-t-on une greffe entre individus non identiques de la même espèce ?", ["Autogreffe", "Allogreffe", "Xénogreffe", "Phagocytose"], 1, "Allo indique un autre individu de la même espèce."),
      choice("Comment nomme-t-on une greffe entre espèces différentes ?", ["Isogreffe", "Autogreffe", "Xénogreffe", "Vaccination"], 2, "Xéno indique une autre espèce."),
      choice("Sur quel chromosome se trouve la région HLA principale ?", ["1", "21", "X uniquement", "6"], 3, "La région HLA majeure se trouve sur le chromosome 6."),
      trueFalse("Une isogreffe entre vrais jumeaux monozygotes est généralement acceptée.", true, "Ils partagent normalement le même patrimoine génétique et le même HLA."),
      choice("Où trouve-t-on le CMH I ?", ["Sur presque toutes les cellules nucléées", "Seulement dans le sérum", "Seulement sur les globules rouges", "Sur aucun leucocyte"], 0, "La classe I est largement exprimée par les cellules nucléées."),
      choice("À quel lymphocyte le CMH II présente-t-il des peptides ?", ["T CD8 uniquement", "T CD4", "Globule rouge", "Plaquette"], 1, "Le corécepteur CD4 reconnaît le CMH II."),
      choice("Qui reconnaît principalement les différences responsables du rejet ?", ["Le CMH seul comme une cellule", "Les os", "Des lymphocytes et autres effecteurs du receveur", "Le tendon"], 2, "Les molécules HLA sont des signaux ; les cellules immunitaires réalisent la reconnaissance et l’attaque."),
      choice("Quel facteur réduit le risque d’allorejet ?", ["Une incompatibilité maximale", "L’absence de suivi", "Une infection du greffon", "Une meilleure compatibilité HLA"], 3, "La compatibilité limite les différences reconnues."),
      short("Donne le sigle humain du complexe majeur d’histocompatibilité.", ["HLA", "hla", "système HLA", "le système HLA"], "Chez l’être humain, le CMH est appelé HLA."),
    ],
    corrections: [
      "Les termes actuels allogreffe et xénogreffe accompagnent les appellations anciennes homogreffe et hétérogreffe.",
      "Le rôle de HLA I et HLA II est précisé avec les partenaires CD8 et CD4.",
      "Le rejet n’est plus attribué à une prétendue « non-reconnaissance par le CMH » : la reconnaissance lymphocytaire des différences HLA est explicitée.",
    ],
  },
  {
    id: "antigen-presentation-clonal-selection",
    title: "Présenter l’antigène et sélectionner les clones",
    summary: "Expliquer comment un peptide présenté avec le CMH, la co-stimulation et les cytokines activent les rares lymphocytes spécifiques.",
    pages: "9-11 et 20",
    section: "Antigène, épitope, cellules présentatrices et phase d’induction",
    durationMinutes: 33,
    xp: 90,
    body: `
## 1. Antigène, épitope et récepteur

Un **antigène** est une molécule ou structure capable d’être reconnue spécifiquement par le système immunitaire adaptatif. Un **épitope** est la petite partie reconnue par un anticorps, un récepteur B ou, après traitement et présentation, un récepteur T.

Les lymphocytes B reconnaissent des antigènes sous leur forme native grâce à leur **BCR**. Les lymphocytes T ne reconnaissent pas directement un antigène libre : leur **TCR** reconnaît un peptide présenté par une molécule de CMH.

## 2. Le rôle des cellules présentatrices

Les cellules dendritiques, macrophages et lymphocytes B peuvent présenter des antigènes. Les **cellules dendritiques** sont particulièrement efficaces pour activer des lymphocytes T naïfs.

1. la cellule capte un antigène ;
2. elle le découpe en peptides dans des compartiments cellulaires ;
3. un peptide est chargé sur une molécule de CMH ;
4. le complexe peptide–CMH apparaît à la surface ;
5. un lymphocyte T dont le TCR est compatible peut recevoir le signal.

Le CMH I présente surtout des peptides produits dans le cytoplasme aux T CD8. Le CMH II présente surtout des peptides provenant de matériel internalisé aux T CD4.

## 3. Trois catégories de signaux

La liaison TCR–peptide–CMH ne suffit généralement pas à elle seule. Une activation efficace d’un lymphocyte T naïf requiert aussi une **co-stimulation** et des **cytokines** qui orientent sa différenciation. Cela évite d’activer n’importe quelle cellule au moindre contact.

Le clone dont le récepteur correspond est **sélectionné**, se multiplie par mitoses puis se différencie en cellules effectrices et mémoire. La spécificité existait avant l’antigène ; l’antigène ne fabrique pas le bon récepteur, il sélectionne le clone qui le porte.

Un lymphocyte B ayant fixé son antigène peut l’internaliser, présenter un peptide sur CMH II et recevoir l’aide d’un T CD4 compatible. Il prolifère alors et donne plasmocytes et B mémoire.

> **Correction du document :** les macrophages ne « déposent » pas simplement des déterminants antigéniques intacts sur leur membrane. Ils présentent surtout des **peptides liés au CMH**. Le « facteur H » isolé du schéma scolaire est remplacé par l’ensemble co-stimulation, contacts et cytokines.

> **Astuce mémoire — 3 S :** **S**pécificité du récepteur, **S**econd signal de co-stimulation, **S**ignaux cytokiniques.
`,
    keyPoint: "Le TCR reconnaît un peptide présenté par le CMH ; co-stimulation et cytokines permettent ensuite sélection, amplification et différenciation du clone spécifique.",
    example: "Une cellule dendritique ayant capté une bactérie présente un peptide sur CMH II ; seul un T CD4 au TCR compatible peut être sélectionné et activé avec les signaux associés.",
    methodSteps: [
      "Précise si l’antigène est libre ou transformé en peptide présenté.",
      "Associe CMH I à CD8 et CMH II à CD4.",
      "Ajoute la co-stimulation et les cytokines au signal du TCR.",
      "Termine par expansion clonale, effecteurs et mémoire.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Mécanisme interactif",
      title: "De la capture à l’expansion clonale",
      instruction: "Avance dans la séquence et vérifie l’identité de la cellule, de la molécule présentée et du récepteur.",
      items: [
        { label: "Capture", shortLabel: "Antigène", detail: "Une cellule présentatrice internalise du matériel étranger ou reçoit des peptides intracellulaires." },
        { label: "Traitement", shortLabel: "Peptide", detail: "Les protéines sont découpées en fragments peptidiques." },
        { label: "Présentation", shortLabel: "Peptide–CMH", detail: "Le peptide est affiché à la surface avec CMH I ou CMH II." },
        { label: "Reconnaissance", shortLabel: "TCR", detail: "Un rare lymphocyte T possède un TCR compatible et le corécepteur CD8 ou CD4 approprié." },
        { label: "Co-stimulation", shortLabel: "Signal 2", detail: "Des molécules de co-stimulation confirment le contexte d’activation." },
        { label: "Expansion", shortLabel: "Clone", detail: "Le lymphocyte activé prolifère et produit des cellules effectrices et mémoire." },
      ],
      observation: "L’antigène sélectionne un clone déjà spécifique ; il ne transforme pas au hasard tous les lymphocytes en cellules identiques.",
    },
    questions: [
      choice("Que reconnaît le TCR d’un lymphocyte T ?", ["Un complexe peptide–CMH", "Une toxine libre sans présentation dans tous les cas", "Un globule rouge au hasard", "Le glucose"], 0, "Le TCR reconnaît un peptide présenté par le CMH.", "Présentation antigénique • pages 9-11"),
      choice("Quelle cellule active très efficacement les lymphocytes T naïfs ?", ["Le globule rouge", "La cellule dendritique", "La fibre musculaire seule", "La plaquette"], 1, "Les cellules dendritiques sont des présentatrices professionnelles majeures."),
      choice("Quel couple est correct ?", ["CMH I–CD4", "CMH II–CD8", "CMH I–CD8", "IgG–sarcomère"], 2, "Le CMH I présente aux lymphocytes T CD8."),
      choice("Quel récepteur reconnaît directement un antigène natif sur un lymphocyte B ?", ["TCR uniquement", "Hémoglobine", "Récepteur du complément seulement", "BCR"], 3, "Le BCR lie directement son antigène spécifique."),
      trueFalse("Le signal TCR–peptide–CMH suffit toujours à activer correctement un T naïf.", false, "La co-stimulation et les cytokines sont généralement nécessaires."),
      choice("Que devient le clone sélectionné ?", ["Il prolifère et se différencie", "Il devient un os", "Il perd tout récepteur", "Il se transforme en microbe"], 0, "L’expansion clonale produit effecteurs et mémoire."),
      choice("Quelle molécule présente surtout des peptides internalisés aux T CD4 ?", ["IgE", "CMH II", "C9 seul", "Actine"], 1, "Le CMH II est spécialisé dans cette voie."),
      choice("Quel rôle peut jouer un lymphocyte B après fixation de son antigène ?", ["Former une barrière de kératine", "Devenir un neutrophile", "Présenter un peptide sur CMH II", "Produire des globules rouges"], 2, "Il internalise l’antigène et le présente à un T CD4 compatible."),
      choice("Quelle affirmation sur la sélection clonale est juste ?", ["L’antigène invente un nouveau récepteur", "Tous les clones répondent pareil", "Aucun clone ne prolifère", "L’antigène sélectionne un clone dont le récepteur préexiste"], 3, "La diversité des récepteurs existe avant la rencontre."),
      short("Nomme le signal qui confirme l’activation en plus du TCR.", ["co-stimulation", "la co-stimulation", "costimulation", "signal de co-stimulation", "second signal"], "La co-stimulation est indispensable à une activation naïve efficace."),
    ],
    corrections: [
      "La présentation est décrite comme un peptide lié au CMH, non comme un épitope intact simplement posé sur la membrane du macrophage.",
      "Les cellules dendritiques sont ajoutées parmi les présentatrices majeures, absentes du récit source.",
      "Le vague « facteur H » est remplacé par la co-stimulation, les contacts CD4 et les cytokines.",
    ],
  },
  {
    id: "adaptive-effectors-memory",
    title: "Réponses effectrices, coopération et mémoire",
    summary: "Comparer médiations humorale et cellulaire, expliquer perforine–granzymes et construire une réponse primaire puis secondaire.",
    pages: "11-13 et 22-23",
    section: "Amplification, différenciation et phase effectrice",
    durationMinutes: 34,
    xp: 100,
    body: `
## 1. Une réponse en trois grandes phases

Le document ordonne justement la réponse adaptative en trois temps :

1. **reconnaissance ou induction** : l’antigène est reconnu, souvent après présentation ;
2. **activation, expansion et différenciation** : les clones spécifiques prolifèrent ;
3. **phase effectrice** : anticorps, phagocytes et lymphocytes cytotoxiques éliminent la cible ou limitent sa propagation.

Une fraction des clones devient **mémoire**. Lors d’une nouvelle rencontre avec le même antigène, la réponse secondaire est généralement plus rapide, plus forte et souvent plus efficace.

## 2. Médiation humorale

Un lymphocyte B activé se différencie en plasmocytes sécréteurs et en B mémoire. Le plasmocyte développe un réticulum endoplasmique granuleux et un appareil de Golgi abondants, car il fabrique et exporte beaucoup de protéines. Les anticorps circulants neutralisent, agglutinent, opsonisent ou activent certains effecteurs.

Cette branche est particulièrement adaptée aux toxines et microorganismes extracellulaires. Elle coopère avec le complément et les phagocytes.

## 3. Médiation cellulaire

Un lymphocyte T CD8 cytotoxique reconnaît une cellule cible présentant le peptide approprié sur CMH I. Il établit un contact organisé puis libère notamment :

- de la **perforine**, qui facilite la formation de pores transitoires ;
- des **granzymes**, qui pénètrent dans la cible et déclenchent un programme d’**apoptose**.

La cible n’est donc pas simplement remplie d’eau jusqu’à « éclater » comme le suggère le schéma source. La mort programmée limite souvent la libération désordonnée du contenu cellulaire.

Les T CD4 auxiliaires coordonnent de nombreuses activations. Les **T régulateurs** freinent et contrôlent la réponse ; ils ne sont pas de simples « T suppresseurs » opposés mécaniquement aux helpers. Les cytokines sont des messages produits par plusieurs cellules : il n’existe pas une catégorie autonome de « lymphocytes à lymphokine ».

## 4. La coopération est la règle

Une cellule dendritique active un T ; un T CD4 aide un B ; le plasmocyte sécrète un anticorps ; l’anticorps et C3b facilitent la capture par un phagocyte. Humoral et cellulaire sont deux dominantes d’un réseau coopératif, pas deux armées hermétiques.

> **Astuce mémoire — P-G-A :** **P**erforine prépare le passage, **G**ranzymes entrent, **A**poptose est déclenchée.
`,
    keyPoint: "Après sélection et expansion, plasmocytes/anticorps agissent dans l’humoral, T CD8/perforine–granzymes dans le cellulaire, tandis que des cellules mémoire accélèrent la réponse suivante.",
    example: "Face à une cellule infectée par un virus, un T CD8 compatible reconnaît peptide–CMH I puis délivre perforine et granzymes, ce qui déclenche l’apoptose.",
    methodSteps: [
      "Identifie si la cible est libre/extracellulaire ou portée par une cellule.",
      "Choisis la dominante humorale ou cellulaire sans oublier la coopération.",
      "Nomme précisément l’effecteur et son mécanisme.",
      "Ajoute l’existence de cellules mémoire et l’effet sur la réponse secondaire.",
    ],
    interaction: diagram(
      "Relier les acteurs de la réponse adaptative",
      "Sélectionne une branche et suis la coopération jusqu’à l’effet final.",
      "Clone lymphocytaire activé",
      "Reconnaissance, co-stimulation et cytokines déclenchent expansion, différenciation puis action effectrice.",
      [
        { id: "plasma", label: "Plasmocyte", role: "Sécréter des anticorps", detail: "Son REG et son Golgi abondants soutiennent une production massive d’immunoglobulines." },
        { id: "antibody", label: "Anticorps", role: "Neutraliser et marquer", detail: "Il agit sur des antigènes extracellulaires et recrute complément ou phagocytes selon sa classe." },
        { id: "helper", label: "T CD4 auxiliaire", role: "Coordonner", detail: "Contacts et cytokines aident notamment les B et d’autres lymphocytes T." },
        { id: "cytotoxic", label: "T CD8 cytotoxique", role: "Déclencher l’apoptose", detail: "Il cible des cellules présentant le peptide reconnu sur CMH I." },
        { id: "regulatory", label: "T régulateur", role: "Freiner et tolérer", detail: "Il limite les réponses excessives et participe à la tolérance immunitaire." },
        { id: "memory", label: "Cellules mémoire", role: "Accélérer la suite", detail: "Elles persistent et réagissent rapidement lors d’une nouvelle exposition au même antigène." },
      ],
      "Le type de cible oriente la branche dominante, mais plusieurs acteurs coopèrent presque toujours.",
    ),
    questions: [
      choice("Quelle cellule produit les anticorps sécrétés ?", ["Le plasmocyte", "Le globule rouge", "Le neurone", "Le tendon"], 0, "Le plasmocyte est une cellule B différenciée.", "Réponses effectrices • pages 11-13"),
      choice("Quel organite est très développé dans un plasmocyte ?", ["Le centriole uniquement", "Le réticulum endoplasmique granuleux", "Le sarcomère", "La chlorophylle"], 1, "Il synthétise de grandes quantités de protéines."),
      choice("Quelle cible convient particulièrement à une réponse humorale ?", ["Un os intact", "Un chromosome normal", "Une toxine extracellulaire", "Un tendon"], 2, "Les anticorps peuvent neutraliser une toxine libre."),
      choice("Quel mécanisme tue principalement la cible d’un T CD8 ?", ["Une fermentation", "Une agglutination du sang", "Une greffe", "Une apoptose induite par perforine et granzymes"], 3, "Les granzymes activent un programme de mort cellulaire."),
      trueFalse("La perforine seule remplit toujours la cellule d’eau jusqu’à son explosion.", false, "Le modèle actuel met surtout en avant l’entrée de granzymes et l’apoptose."),
      choice("Quel lymphocyte coordonne souvent l’aide aux B ?", ["Le T CD4 auxiliaire", "Le globule rouge", "La plaquette", "Le spermatozoïde"], 0, "Le T CD4 fournit des signaux d’aide."),
      choice("Quel est le rôle des T régulateurs ?", ["Fabriquer l’hémoglobine", "Limiter et contrôler les réponses", "Créer tous les antigènes", "Former la peau"], 1, "Ils participent à la tolérance et au contrôle."),
      choice("Comment est généralement la réponse secondaire ?", ["Toujours absente", "Plus lente", "Plus rapide et souvent plus forte", "Non spécifique"], 2, "Les cellules mémoire accélèrent la mobilisation."),
      choice("Quel énoncé décrit la coopération ?", ["Chaque branche agit sans cellule partenaire", "Les anticorps fabriquent les lymphocytes", "Le CMH est un anticorps", "T CD4, B, anticorps et phagocytes peuvent agir en réseau"], 3, "La réponse implique de nombreux échanges entre acteurs."),
      short("Nomme les enzymes qui entrent dans la cellule cible et déclenchent son apoptose.", ["granzymes", "les granzymes", "granzyme", "les enzymes granzymes"], "Les granzymes activent des voies de mort programmée."),
    ],
    corrections: [
      "La nomenclature T4/T8 est modernisée en T CD4/T CD8, avec maintien du lien pédagogique.",
      "Les T suppresseurs sont remplacés par les T régulateurs et la catégorie obsolète « lymphocytes à lymphokine » est supprimée.",
      "L’action perforine–granzymes conduit à l’apoptose plutôt qu’à une simple entrée d’eau et explosion de la cellule.",
    ],
  },
  {
    id: "newborn-immunity-final-mission",
    title: "Mission finale : protéger le nouveau-né",
    summary: "Analyser les courbes d’anticorps maternels et infantiles, résoudre les exercices officiels et justifier la fenêtre de vulnérabilité.",
    pages: "14-16",
    section: "Situation d’évaluation et consolidation",
    durationMinutes: 38,
    xp: 120,
    kind: "challenge",
    body: `
## 1. Lire les trois courbes du document

Le graphique suit des anticorps chez le fœtus puis chez l’enfant jusqu’à huit mois.

- **courbe A :** les anticorps maternels augmentent pendant la grossesse, sont élevés à la naissance puis diminuent ; il s’agit principalement d’**IgG maternelles** transférées à travers le placenta ;
- **courbe B :** les anticorps produits par l’enfant sont faibles au départ puis augmentent progressivement avec la maturation et les stimulations de son système immunitaire ;
- **courbe C :** les agglutinines de groupes sanguins apparaissent progressivement selon le modèle simplifié du document.

Il faut distinguer **décrire** et **interpréter**. Décrire : « la courbe A augmente puis diminue ». Interpréter : « les IgG maternelles traversent le placenta, puis sont progressivement éliminées après la naissance ».

## 2. La fenêtre de vulnérabilité

Après la naissance, les IgG maternelles diminuent. Les propres réponses de l’enfant augmentent, mais ne compensent pas immédiatement cette perte pour toutes les infections. Le total protecteur peut donc atteindre une zone basse pendant quelques mois : c’est une **fenêtre de vulnérabilité**.

Cette idée ne signifie pas que l’enfant est sans défense. L’immunité innée fonctionne, les vaccinations construisent une protection active et le lait maternel apporte notamment des IgA et d’autres facteurs protecteurs aux muqueuses. Ces IgA du lait ne sont pas représentées par la courbe des IgG sanguines placentaires.

## 3. Reprendre l’exercice vrai/faux avec précision

| Affirmation source | Réponse scientifiquement rigoureuse |
|---|---|
| les lymphocytes T produisent les anticorps | faux : les plasmocytes les sécrètent |
| une cellule portant un CMH différent est reconnue comme soi | faux dans le contexte de l’allogreffe |
| macrophages, T et B coopèrent | vrai |
| les substances du sérum participant à la défense sont des anticorps | faux si « toutes » est sous-entendu : le sérum contient aussi le complément et d’autres molécules |

Le corrigé source marque la dernière phrase « vrai ». Cette réponse n’est acceptable que si la phrase veut dire « **certaines** substances protectrices du sérum sont des anticorps ». Formulée comme une généralité, elle est fausse.

## 4. Lymphocyte B, plasmocyte et courbe antitétanique

La petite cellule à grand noyau de la figure 1 correspond à un lymphocyte B ; la cellule riche en REG de la figure 2 est un plasmocyte. Après activation spécifique, les clones B prolifèrent et une partie se différencie en plasmocytes. Le taux d’anticorps antitétaniques augmente, atteint un maximum puis diminue lorsque la stimulation et les plasmocytes à courte vie décroissent.

> **Prudence :** ce graphique est un modèle pédagogique. Une infection tétanique ne doit pas être présentée comme une méthode d’immunisation ; la maladie elle-même n’assure pas une mémoire protectrice fiable.

## 5. Méthode de rédaction de la mission

1. annonce chaque courbe et ses phases ;
2. donne des valeurs seulement si l’échelle les rend lisibles et utilise « environ » ;
3. interprète A par le transfert placentaire d’IgG et leur disparition progressive ;
4. interprète B par la production propre de l’enfant ;
5. justifie la protection fœtale puis la fenêtre de vulnérabilité ;
6. ajoute que vaccination et protection muqueuse complètent le modèle.

> **Astuce mémoire — M baisse, E monte :** les anticorps de la **M**ère baissent après la naissance ; ceux de l’**E**nfant montent progressivement. Leur croisement crée la période sensible.
`,
    keyPoint: "Les IgG maternelles protègent passivement le fœtus puis diminuent ; la production de l’enfant augmente progressivement, créant entre les deux une fenêtre relative de vulnérabilité.",
    example: "Courbe A : elle augmente avant la naissance puis décroît. Interprétation : les IgG maternelles traversent le placenta, puis leur concentration baisse quand elles sont éliminées sans être renouvelées par la mère.",
    methodSteps: [
      "Décris séparément A, B et C avec leurs tendances.",
      "Interprète A par le transfert placentaire d’IgG et B par la production de l’enfant.",
      "Justifie la protection fœtale puis le minimum relatif après la naissance.",
      "Mobilise plasmocyte, anticorps, mémoire et limites du modèle pour la synthèse.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mission graphique interactive",
      title: "Suivre les IgG maternelles autour de la naissance",
      instruction: "Déplace le point de la fin de grossesse au huitième mois de vie et observe le changement de tendance à la naissance.",
      formula: "Indice relatif d’IgG maternelles",
      rule: { kind: "samples", points: [[-7, 0.4], [-6, 0.8], [-5, 1.4], [-4, 2.4], [-3, 3.8], [-2, 5.7], [-1, 7.8], [0, 10], [1, 8.3], [2, 6.7], [3, 5.2], [4, 3.8], [5, 2.7], [6, 1.7], [7, 0.9], [8, 0.3]] },
      window: { xMin: -7, xMax: 8, yMin: 0, yMax: 11 },
      guides: [
        { kind: "vertical", value: 0, label: "naissance" },
        { kind: "vertical", value: 5, label: "période sensible" },
      ],
      marker: { min: -7, max: 8, step: 1, initial: 0 },
      observation: "Courbe originale en indice relatif : elle restitue la tendance du document sans prétendre numériser exactement ses valeurs imprimées.",
    },
    questions: [
      choice("Quelle immunoglobuline traverse principalement le placenta ?", ["IgG", "IgM", "IgA sécrétoire", "IgE uniquement"], 0, "Les IgG maternelles sont transportées vers le fœtus.", "Situation d’évaluation • pages 14-15"),
      choice("Que représente la courbe B du document ?", ["Les anticorps du père", "Les anticorps produits par l’enfant", "Le nombre de globules rouges", "La température"], 1, "La courbe B suit la production propre de l’enfant."),
      choice("Pourquoi une période de vulnérabilité relative apparaît-elle ?", ["Le thymus disparaît", "Tous les leucocytes meurent", "Les anticorps maternels baissent avant que la production propre soit pleinement suffisante", "Le placenta continue d’augmenter"], 2, "Les deux sources de protection sanguine se croisent à un niveau bas."),
      choice("Quelle cellule sécrète les anticorps ?", ["Le lymphocyte T", "Le neutrophile", "Le globule rouge", "Le plasmocyte"], 3, "Le plasmocyte est la forme sécrétrice du clone B."),
      trueFalse("Les lymphocytes T sécrètent les immunoglobulines circulantes.", false, "Ils coordonnent ou tuent, mais les plasmocytes sécrètent les anticorps."),
      choice("Quelle affirmation de l’exercice 1 est vraie sans réserve ?", ["Macrophages, lymphocytes T et B coopèrent", "Tous les éléments sériques sont des anticorps", "Tout CMH différent est du soi", "Les T fabriquent les anticorps"], 0, "La coopération cellulaire est centrale."),
      choice("Pourquoi la phrase « les substances du sérum qui défendent sont des anticorps » est-elle trop générale ?", ["Le sérum ne contient aucune protéine", "Le complément participe aussi à la défense", "Les anticorps sont des cellules", "Le sérum est un os"], 1, "Le sérum contient plusieurs effecteurs, dont les protéines du complément."),
      choice("Quelle cellule correspond à la figure 2 riche en organites de synthèse ?", ["Un globule rouge", "Un neutrophile", "Un plasmocyte", "Un neurone"], 2, "La richesse en REG/Golgi correspond à une forte sécrétion protéique."),
      choice("Comment évoluent les anticorps antitétaniques dans le modèle de l’individu exposé ?", ["Ils restent toujours nuls", "Ils disparaissent avant l’exposition", "Ils deviennent des lymphocytes", "Ils augmentent puis diminuent"], 3, "Le document montre une montée, un maximum puis une baisse."),
      trueFalse("Une infection tétanique est une méthode sûre pour acquérir une immunité durable.", false, "Le tétanos ne confère pas nécessairement une immunité et constitue une maladie grave."),
      choice("Quel terme complète : « Un microbe qui déclenche une maladie est … » ?", ["pathogène", "isogénique", "placentaire", "contractile"], 0, "Pathogène signifie capable de provoquer une maladie.", "Exercice 2 • page 15"),
      choice("Quel mécanisme aide à éliminer un complexe antigène–anticorps ?", ["La photosynthèse", "La phagocytose", "La contraction", "La fécondation"], 1, "Les phagocytes capturent plus facilement les cibles opsonisées ou agrégées."),
      short("Nomme la protection reçue de la mère sans production propre du fœtus.", ["immunité passive", "l’immunité passive", "protection passive", "une immunité passive"], "Le transfert d’IgG maternelles constitue une immunité passive naturelle."),
      short("Nomme la cellule B différenciée spécialisée dans la sécrétion d’anticorps.", ["plasmocyte", "le plasmocyte", "cellule plasmique", "une cellule plasmique"], "Le plasmocyte sécrète de grandes quantités d’immunoglobulines."),
    ],
    corrections: [
      "Les anticorps placentaires sont identifiés comme des IgG et la protection muqueuse par les IgA du lait est distinguée du graphique sanguin.",
      "La dernière proposition vrai/faux du document est corrigée : toutes les substances immunitaires du sérum ne sont pas des anticorps, puisque le complément y participe aussi.",
      "La numérotation contradictoire des deux « exercices 3 » est réorganisée en une mission finale unique sans supprimer leurs questions.",
      "Le modèle antitétanique est exploité sans laisser croire que contracter le tétanos remplace la vaccination.",
    ],
  },
];

const levelOrder = [
  "barriers-innate-immunity",
  "inflammation-recruitment",
  "phagocytosis-infection-spread",
  "complement-innate-effectors",
  "adaptive-specificity-experiments",
  "antibodies-humoral-immunity",
  "cellular-immunity-lymphoid-organs",
  "grafts-self-nonself-hla",
  "antigen-presentation-clonal-selection",
  "adaptive-effectors-memory",
  "newborn-immunity-final-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau immunitaire introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalCSvtImmuneDefensePath: LearningPath = {
  id: "terminale-c-svt-l5-immune-defense",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "La défense de l’organisme et son dysfonctionnement" },
  chapterNumber: 5,
  title: "Le système de défense de l’organisme",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, restructuré en onze niveaux interactifs avec les exercices du document, une mission finale et des corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Distinguer barrières, inflammation, phagocytose et complément dans l’immunité innée",
    "Prouver la spécificité et différencier immunités active, passive, humorale et cellulaire",
    "Relier anticorps, lymphocytes et organes lymphoïdes à leurs fonctions",
    "Expliquer compatibilité HLA, présentation antigénique, sélection clonale et coopération",
    "Interpréter les courbes d’immunité maternelle et résoudre les évaluations officielles",
  ],
  modules: [
    {
      id: "immune-defense-mastery",
      title: "Maîtriser le système de défense de l’organisme",
      description: "Onze niveaux progressifs, des barrières naturelles à la mission d’évaluation sur l’immunité du nouveau-né.",
      lessons: builtLevels,
    },
  ],
};
