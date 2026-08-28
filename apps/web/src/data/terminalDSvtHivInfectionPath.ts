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

const sourceDocument = "SVT TD_L7_Linfection de lorganisme pâr le VIH.pdf";

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
      introduction: "Observe les données, distingue le virus de la maladie, ordonne le mécanisme puis justifie chaque conclusion avec un indice précis.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : structure, étape, conséquence. Ces trois mots évitent presque toutes les confusions sur le VIH.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const hivShapes: SchemaShape[] = [
  { shape: "circle", cx: 360, cy: 205, r: 142, tone: "soft" },
  { shape: "circle", cx: 360, cy: 205, r: 126, tone: "fill" },
  { shape: "ellipse", cx: 360, cy: 210, rx: 70, ry: 96, tone: "outline" },
  { shape: "path", d: "M330 155 C300 185, 355 205, 320 245 C300 270, 348 285, 335 305", tone: "accent" },
  { shape: "path", d: "M386 155 C420 185, 365 210, 402 245 C424 268, 375 288, 392 306", tone: "accent" },
  { shape: "circle", cx: 345, cy: 230, r: 13, tone: "muted" },
  { shape: "circle", cx: 390, cy: 250, r: 13, tone: "muted" },
  { shape: "circle", cx: 370, cy: 285, r: 13, tone: "muted" },
  { shape: "line", x1: 360, y1: 63, x2: 360, y2: 28, tone: "outline" },
  { shape: "circle", cx: 360, cy: 20, r: 11, tone: "accent" },
  { shape: "line", x1: 460, y1: 105, x2: 487, y2: 78, tone: "outline" },
  { shape: "circle", cx: 494, cy: 71, r: 11, tone: "accent" },
  { shape: "line", x1: 502, y1: 205, x2: 540, y2: 205, tone: "outline" },
  { shape: "circle", cx: 550, cy: 205, r: 11, tone: "accent" },
  { shape: "line", x1: 460, y1: 305, x2: 487, y2: 332, tone: "outline" },
  { shape: "circle", cx: 494, cy: 339, r: 11, tone: "accent" },
  { shape: "line", x1: 260, y1: 305, x2: 233, y2: 332, tone: "outline" },
  { shape: "circle", cx: 226, cy: 339, r: 11, tone: "accent" },
  { shape: "line", x1: 218, y1: 205, x2: 180, y2: 205, tone: "outline" },
  { shape: "circle", cx: 170, cy: 205, r: 11, tone: "accent" },
  { shape: "line", x1: 260, y1: 105, x2: 233, y2: 78, tone: "outline" },
  { shape: "circle", cx: 226, cy: 71, r: 11, tone: "accent" },
  { shape: "text", x: 360, y: 388, content: "VIH - coupe pédagogique originale", anchor: "middle" },
];

const hivHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "envelope", number: 1, label: "Enveloppe lipidique", x: 500, y: 260, detail: "Elle provient en partie de la membrane de la cellule hôte lors du bourgeonnement et porte les glycoprotéines virales." },
  { id: "gp120", number: 2, label: "gp120", x: 550, y: 205, detail: "Cette glycoprotéine reconnaît CD4 puis un corécepteur ; elle participe à l’attachement du VIH." },
  { id: "gp41", number: 3, label: "gp41", x: 487, y: 118, detail: "Ancrée dans l’enveloppe, elle rapproche puis fusionne les membranes virale et cellulaire." },
  { id: "capsid", number: 4, label: "Capside p24", x: 430, y: 120, detail: "La capside protéique protège le génome et les enzymes transportées par le virion." },
  { id: "rna", number: 5, label: "Deux copies d’ARN", x: 320, y: 210, detail: "Le VIH est un rétrovirus à ARN : le virion contient deux copies apparentées de son génome." },
  { id: "enzymes", number: 6, label: "Enzymes virales", x: 390, y: 270, detail: "Transcriptase inverse, intégrase et protéase interviennent à des moments différents du cycle viral." },
];

const levels: LevelSeed[] = [
  {
    id: "hiv-virion-architecture",
    title: "La structure du VIH",
    summary: "Identifier l’enveloppe, les glycoprotéines, la capside, le génome ARN et les enzymes indispensables au cycle viral.",
    pages: "1-2",
    section: "Structure particulière du VIH - document 1",
    durationMinutes: 25,
    xp: 45,
    body: `
## 1. VIH et SIDA ne désignent pas la même chose

Le **VIH** est le virus de l’immunodéficience humaine. Le **SIDA** est le stade avancé que l’infection peut atteindre lorsque les défenses immunitaires sont fortement altérées. On peut donc vivre avec le VIH sans être au stade SIDA, notamment grâce au traitement antirétroviral.

Le VIH est un **rétrovirus enveloppé**. Il ne possède pas l’organisation d’une cellule et ne peut pas se multiplier seul : il doit utiliser une cellule hôte.

## 2. Lire le document 1 de l’extérieur vers l’intérieur

| Élément | Description | Rôle essentiel |
|---|---|---|
| enveloppe lipidique | bicouche acquise lors du bourgeonnement | porte les protéines d’entrée et entoure le virion |
| gp120 | glycoprotéine externe | reconnaît le récepteur CD4 puis un corécepteur |
| gp41 | glycoprotéine transmembranaire | permet la fusion des membranes |
| protéines internes | notamment matrice virale | stabilisent la particule et organisent son assemblage |
| capside p24 | coque protéique interne | protège le génome et les enzymes |
| génome | deux copies d’ARN viral | porte l’information génétique du VIH |
| enzymes | transcriptase inverse, intégrase, protéase | copient, intègrent puis maturent les constituants viraux |

Le document représente correctement une enveloppe, une capside, deux molécules d’ARN et des enzymes. Pour comprendre tout le cycle, il faut toutefois distinguer **trois enzymes majeures** :

- la **transcriptase inverse** fabrique un ADN viral à partir de l’ARN ;
- l’**intégrase** insère cet ADN dans l’ADN de la cellule ;
- la **protéase** découpe les longues protéines virales pendant la maturation.

## 3. Pourquoi cette structure est-elle fonctionnelle ?

Chaque constituant prépare une étape du cycle. Les glycoprotéines sélectionnent certaines cellules. L’ARN transporte le programme viral. Les enzymes accompagnent le génome car la cellule humaine ne possède pas spontanément tout le matériel nécessaire pour effectuer ces opérations virales.

> **Correction de classement :** le nom de fichier porte « L7 » et la couverture interne « Leçon 15 ». Dans la progression de Terminale D utilisée par la plateforme, ce contenu occupe la **carte 12**. Cette divergence de numérotation est documentée sans déplacer le catalogue.

> **Astuce mémoire - E C A :** **E**nveloppe pour entrer, **C**apside pour protéger, **A**RN et enzymes pour agir.
`,
    keyPoint: "Le VIH est un rétrovirus enveloppé contenant deux copies d’ARN, une capside et les enzymes transcriptase inverse, intégrase et protéase.",
    example: "Si une légende pointe les spicules externes, on répond gp120/gp41 et on précise : attachement à CD4 puis fusion des membranes.",
    methodSteps: [
      "Parcours le virion de l’extérieur vers l’intérieur.",
      "Nomme la structure avant d’indiquer sa fonction.",
      "Associe gp120 à l’attachement et gp41 à la fusion.",
      "Distingue transcriptase inverse, intégrase et protéase.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure originale annotée",
      title: "Explorer la particule de VIH",
      instruction: "Appuie sur chaque repère pour relier un constituant du virion à son rôle dans l’infection.",
      viewBox: "0 0 720 410",
      caption: "Figure pédagogique originale redessinée d’après le document officiel ; les proportions ne sont pas à l’échelle moléculaire.",
      shapes: hivShapes,
      hotspots: hivHotspots,
      observation: "La structure n’est pas une simple liste : chaque élément prépare une étape précise du cycle viral.",
    },
    questions: [
      choice("Que signifie le sigle VIH ?", ["Virus de l’immunodéficience humaine", "Vaccin immunitaire humain", "Virémie interne héréditaire", "Virus intestinal hépatique"], 0, "VIH signifie virus de l’immunodéficience humaine.", "Document 1 • pages 1-2"),
      choice("Quelle structure entoure directement le génome et les enzymes ?", ["La peau", "La capside protéique", "Le noyau cellulaire", "Un anticorps"], 1, "La capside p24 forme la coque protéique interne."),
      choice("Sous quelle forme se trouve le génome du VIH dans le virion ?", ["Un chromosome humain", "Une protéine", "Deux copies d’ARN", "Un polysaccharide"], 2, "Le VIH transporte deux copies apparentées d’ARN viral."),
      choice("Quelle glycoprotéine participe directement à la fusion des membranes ?", ["p24", "CD8", "Une immunoglobuline", "gp41"], 3, "gp41 rapproche et fusionne les membranes virale et cellulaire."),
      trueFalse("Le VIH est une cellule capable de se reproduire seule.", false, "C’est un virus : il dépend d’une cellule hôte."),
      choice("Quelle glycoprotéine reconnaît d’abord CD4 ?", ["gp120", "p24", "Actine", "Hémoglobine"], 0, "gp120 participe à l’attachement au récepteur CD4."),
      choice("Quelle enzyme permet ensuite l’intégration de l’ADN viral ?", ["La pepsine", "L’intégrase", "La myosine", "L’amylase"], 1, "L’intégrase insère l’ADN viral dans l’ADN cellulaire."),
      choice("Quelle enzyme assure la maturation des protéines virales ?", ["L’ARN polymérase humaine seule", "La catalase", "La protéase virale", "L’insuline"], 2, "La protéase découpe les précurseurs protéiques viraux."),
      choice("Quelle différence est correcte ?", ["Le SIDA est un virus différent", "VIH et SIDA sont deux bactéries", "Toute personne vivant avec le VIH est immédiatement au stade SIDA", "Le VIH est le virus ; le SIDA est un stade avancé de l’infection"], 3, "Le stade SIDA n’est pas synonyme de toute infection par le VIH."),
      trueFalse("L’enveloppe lipidique porte les glycoprotéines gp120 et gp41.", true, "Ces glycoprotéines d’enveloppe interviennent dans l’entrée virale."),
      short("Nomme l’enzyme qui fabrique l’ADN viral à partir de l’ARN.", ["transcriptase inverse", "la transcriptase inverse", "transcriptase reverse", "rétrotranscriptase", "retrotranscriptase"], "Il s’agit de la transcriptase inverse."),
    ],
    corrections: [
      "Le nom de fichier « L7 » et la couverture interne « Leçon 15 » sont alignés sur la carte 12 du catalogue Terminale D, source de vérité de la progression.",
      "La liste du document est complétée par l’intégrase et la protéase, indispensables pour comprendre les étapes suivantes.",
      "La mention de « deux transcriptases reverses » n’est pas figée à une molécule par ARN : le virion transporte plusieurs molécules d’enzymes virales.",
      "VIH et SIDA sont distingués : le premier est le virus, le second un stade avancé de l’infection.",
    ],
  },
  {
    id: "hiv-cd4-coreceptor-entry",
    title: "La cellule cible et l’entrée du VIH",
    summary: "Comprendre comment gp120, CD4, un corécepteur et gp41 permettent au VIH d’entrer dans une cellule sensible.",
    pages: "2-3",
    section: "Début de l’infection du lymphocyte T4 - document 2",
    durationMinutes: 27,
    xp: 55,
    body: `
## 1. Une reconnaissance en plusieurs verrous

Le document présente le **lymphocyte T4**, aujourd’hui nommé plus précisément **lymphocyte T CD4**. Cette cellule participe à la coordination de la réponse immunitaire. Le VIH peut aussi infecter d’autres cellules portant CD4 et les corécepteurs adaptés, notamment certains macrophages et certaines cellules dendritiques.

L’entrée ne dépend pas de CD4 seul. Elle suit plusieurs étapes :

1. **attachement** : gp120 reconnaît CD4 ;
2. **engagement d’un corécepteur** : le plus souvent CCR5 ou CXCR4 selon le variant viral ;
3. **changement de forme des protéines d’enveloppe** ;
4. **fusion** : gp41 rapproche l’enveloppe virale et la membrane cellulaire ;
5. **décapsidation** : le contenu viral devient accessible dans le cytoplasme.

| Acteur | Où se trouve-t-il ? | Fonction dans l’entrée |
|---|---|---|
| gp120 | surface du VIH | reconnaît CD4 puis le corécepteur |
| gp41 | ancrée dans l’enveloppe virale | provoque la fusion des membranes |
| CD4 | surface de la cellule cible | récepteur principal d’attachement |
| CCR5 ou CXCR4 | surface de certaines cellules | corécepteur nécessaire à l’entrée de nombreux variants |

## 2. La fusion n’est pas une « perforation »

Le texte source indique que gp120 se décroche et que gp41 devient un élément perforateur. Cette image aide à pressentir un changement, mais elle est trop brutale. gp120 reste associée au complexe d’enveloppe et change de conformation ; gp41 expose alors son peptide de fusion et **rapproche les deux membranes jusqu’à leur fusion**. Le virus n’injecte donc pas son ARN comme une seringue rigide : son enveloppe fusionne avec la membrane de la cellule.

## 3. Pourquoi parle-t-on de tropisme ?

Le **tropisme viral** est la capacité d’un virus à infecter certains types cellulaires plutôt que d’autres. Une cellule ne devient une cible efficace que si elle présente les récepteurs compatibles et permet la suite du cycle. CD4 explique une grande partie du ciblage immunitaire, mais les corécepteurs et l’état de la cellule comptent aussi.

> **Astuce mémoire - 120 reconnaît, 41 fusionne :** gp**120** trouve la porte ; gp**41** rapproche les membranes.
`,
    keyPoint: "Le VIH entre après liaison de gp120 à CD4 et à un corécepteur, puis fusion des membranes conduite par gp41.",
    example: "Une cellule porte CD4 mais aucun corécepteur utilisable : l’attachement peut commencer, mais l’entrée complète du variant viral est fortement empêchée.",
    methodSteps: [
      "Repère la glycoprotéine virale et le récepteur cellulaire.",
      "Ajoute le corécepteur CCR5 ou CXCR4 à l’explication.",
      "Décris la fusion des membranes sans parler d’une seringue ou d’un trou permanent.",
      "Conclue sur le tropisme pour les cellules compatibles.",
    ],
    interaction: diagram(
      "Ouvrir les verrous de la cellule cible",
      "Sélectionne chaque acteur et reconstitue l’entrée sans sauter le corécepteur.",
      "Entrée du VIH",
      "L’attachement et la fusion forment une chaîne : si un verrou manque, l’entrée est bloquée.",
      [
        { id: "gp120", label: "gp120", role: "Reconnaître", detail: "Elle se lie d’abord à CD4 puis facilite la rencontre avec CCR5 ou CXCR4." },
        { id: "cd4", label: "CD4", role: "Récepteur principal", detail: "Il est abondant sur les lymphocytes T CD4 et présent sur certaines autres cellules immunitaires." },
        { id: "coreceptor", label: "CCR5 / CXCR4", role: "Second verrou", detail: "Le corécepteur utilisé dépend du tropisme du variant viral." },
        { id: "gp41", label: "gp41", role: "Fusionner", detail: "Son changement de conformation rapproche les deux membranes jusqu’à leur fusion." },
        { id: "uncoating", label: "Décapsidation", role: "Libérer le contenu", detail: "Après l’entrée, le génome et les enzymes deviennent accessibles dans le cytoplasme." },
      ],
      "CD4 est nécessaire au modèle scolaire, mais il n’explique pas seul l’entrée : le corécepteur complète la reconnaissance.",
    ),
    questions: [
      choice("Quelle cellule est la cible principale mise en avant dans le document 2 ?", ["Le lymphocyte T CD4", "Le globule rouge", "La fibre musculaire", "Le neurone moteur"], 0, "Le document suit l’infection d’un lymphocyte T4, aujourd’hui appelé T CD4.", "Document 2 • pages 2-3"),
      choice("Quel élément cellulaire est reconnu en premier par gp120 ?", ["p24", "CD4", "L’ARN viral", "La protéase"], 1, "gp120 se lie au récepteur CD4."),
      choice("Quel couple peut servir de corécepteur au VIH ?", ["IgG ou IgM", "Actine ou myosine", "CCR5 ou CXCR4", "ADN ou ARN"], 2, "CCR5 et CXCR4 sont des corécepteurs majeurs."),
      choice("Quelle protéine virale conduit directement la fusion ?", ["p24", "CD4", "CCR5", "gp41"], 3, "gp41 rapproche et fusionne les membranes."),
      trueFalse("La présence de CD4 suffit toujours, à elle seule, pour permettre l’entrée de tout variant du VIH.", false, "Un corécepteur compatible et d’autres conditions cellulaires sont nécessaires."),
      choice("Quel terme désigne la préférence d’un virus pour certains types cellulaires ?", ["Tropisme", "Osmose", "Mitose", "Coagulation"], 0, "Cette préférence est le tropisme viral."),
      choice("Quelle description remplace correctement l’idée de perforation par gp41 ?", ["Le noyau explose", "Les membranes virale et cellulaire fusionnent", "CD4 devient de l’ARN", "La capside fabrique un anticorps"], 1, "gp41 rapproche les bicouches jusqu’à leur fusion."),
      choice("Quelle autre cellule peut être infectée par certains variants du VIH ?", ["Un globule rouge mature", "Un spermatozoïde", "Un macrophage portant les récepteurs adaptés", "Une cellule végétale"], 2, "Certains macrophages expriment CD4 et un corécepteur compatible."),
      choice("Que se passe-t-il juste après la fusion dans le modèle simplifié ?", ["Le SIDA est immédiatement déclaré", "Les anticorps disparaissent", "La cellule devient un globule rouge", "Le contenu viral entre et la capside se désassemble progressivement"], 3, "L’entrée est suivie de la décapsidation."),
      trueFalse("gp120 et gp41 sont des glycoprotéines de l’enveloppe virale.", true, "Elles forment le complexe d’entrée du VIH."),
      short("Nomme le récepteur principal qui donne son nom aux lymphocytes T ciblés.", ["CD4", "cd4", "récepteur CD4", "le récepteur CD4", "protéine CD4", "la protéine CD4"], "Il s’agit du récepteur CD4."),
    ],
    corrections: [
      "Le lymphocyte T4 est nommé lymphocyte T CD4 selon la terminologie actuelle.",
      "CCR5 et CXCR4 sont ajoutés : CD4 seul ne suffit pas à expliquer l’entrée du VIH.",
      "gp120 ne « se décroche » pas simplement et gp41 ne perfore pas la membrane ; le complexe change de conformation et provoque une fusion membranaire.",
      "Le mot « injection » du document est remplacé par entrée, fusion puis décapsidation.",
    ],
  },
  {
    id: "hiv-reverse-transcription-integration",
    title: "De l’ARN viral au provirus intégré",
    summary: "Distinguer rétrotranscription, ADN viral double brin, entrée dans le noyau et intégration dans le génome cellulaire.",
    pages: "3",
    section: "Étapes 2 à 4 du processus d’infection - document 2",
    durationMinutes: 29,
    xp: 65,
    body: `
## 1. Une copie dans le sens inhabituel

Après l’entrée et la décapsidation, la **transcriptase inverse** utilise l’ARN viral comme matrice pour fabriquer un ADN complémentaire. Une seconde synthèse conduit à un **ADN viral double brin**. Cette opération est appelée **rétrotranscription** ou transcription inverse.

Elle ne doit pas être confondue avec la transcription cellulaire classique :

| Opération | Matrice | Produit | Enzyme clé |
|---|---|---|---|
| transcription classique | ADN | ARN | ARN polymérase |
| rétrotranscription du VIH | ARN viral | ADN viral | transcriptase inverse |

La transcriptase inverse commet relativement souvent des erreurs de copie. Cette variabilité favorise l’apparition de nombreux variants et peut contribuer aux résistances si la réplication n’est pas correctement bloquée.

## 2. L’intégration dans le noyau

L’ADN viral associé à des protéines gagne le noyau. L’**intégrase** coupe puis raccorde cet ADN à un chromosome de la cellule hôte. L’ADN viral intégré porte le nom de **provirus**.

Le provirus peut rester peu actif pendant un temps ou servir de matrice à la production d’ARN viraux. Son intégration explique pourquoi un traitement antirétroviral efficace bloque la multiplication sans éliminer instantanément toutes les copies virales intégrées.

## 3. Trois mots à ne pas intervertir

- **ADN viral** : copie ADN fabriquée à partir de l’ARN du VIH ;
- **intégrase** : enzyme qui insère cette copie dans l’ADN cellulaire ;
- **provirus** : ADN viral lorsqu’il est intégré au chromosome de la cellule.

Le document emploie l’expression « transcription de l’ARN proviral en ADN proviral ». La formulation correcte est **rétrotranscription de l’ARN viral en ADN viral**, puis intégration de cet ADN sous forme de provirus.

## 4. Des cibles thérapeutiques logiques

Les inhibiteurs de la transcriptase inverse empêchent ou perturbent la copie ARN vers ADN. Les inhibiteurs de l’intégrase bloquent l’insertion de l’ADN viral. Une association de molécules visant plusieurs étapes réduit fortement la réplication et le risque de sélection de résistances.

> **Astuce mémoire - R I P :** **R**étrotranscription, **I**ntégration, **P**rovirus.
`,
    keyPoint: "La transcriptase inverse convertit l’ARN viral en ADN ; l’intégrase insère cet ADN dans le génome cellulaire, où il devient un provirus.",
    example: "Une molécule bloque l’intégrase : l’ADN viral peut avoir été fabriqué, mais son insertion stable dans le chromosome est empêchée.",
    methodSteps: [
      "Identifie d’abord la nature de la matrice : ici l’ARN viral.",
      "Nomme la transcriptase inverse et le produit ADN viral.",
      "Place l’intégrase seulement à l’étape d’insertion nucléaire.",
      "Réserve le mot provirus à l’ADN viral intégré.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Chronologie interactive",
      title: "Construire puis intégrer le provirus",
      instruction: "Avance dans l’ordre et dis, à chaque étape, quelle molécule sert de matrice et quelle enzyme agit.",
      items: [
        { label: "Décapsidation", shortLabel: "ARN libéré", detail: "L’ARN viral et les enzymes deviennent accessibles dans le cytoplasme." },
        { label: "Premier brin d’ADN", shortLabel: "ARN vers ADN", detail: "La transcriptase inverse copie l’ARN viral en ADN complémentaire." },
        { label: "ADN double brin", shortLabel: "Copie achevée", detail: "La synthèse se complète pour produire un ADN viral double brin." },
        { label: "Entrée nucléaire", shortLabel: "Noyau", detail: "Le complexe viral contenant l’ADN gagne le noyau de la cellule cible." },
        { label: "Intégration", shortLabel: "Intégrase", detail: "L’intégrase insère l’ADN viral dans un chromosome cellulaire." },
        { label: "Provirus", shortLabel: "ADN intégré", detail: "L’information virale peut persister puis être exprimée par la cellule." },
      ],
      observation: "La rétrotranscription fabrique l’ADN ; l’intégration l’insère. Ce sont deux opérations et deux cibles thérapeutiques différentes.",
    },
    questions: [
      choice("Quel est le produit direct de la rétrotranscription ?", ["Un ADN viral", "Un anticorps", "Une membrane", "Un lymphocyte"], 0, "La transcriptase inverse convertit l’information ARN en ADN.", "Document 2 • page 3"),
      choice("Quelle enzyme catalyse cette copie ARN vers ADN ?", ["La protéase", "La transcriptase inverse", "L’intégrase", "La pepsine"], 1, "C’est la fonction de la transcriptase inverse."),
      choice("Où se déroule l’intégration du génome viral ?", ["Dans le plasma sanguin", "À la surface de gp120", "Dans le noyau de la cellule", "Dans un anticorps"], 2, "L’ADN viral est inséré dans un chromosome du noyau."),
      choice("Comment nomme-t-on l’ADN viral intégré ?", ["Capside", "Corécepteur", "Virémie", "Provirus"], 3, "Le provirus est la forme intégrée de l’ADN viral."),
      trueFalse("Rétrotranscription et intégration désignent exactement la même réaction.", false, "La première fabrique l’ADN ; la seconde l’insère."),
      choice("Quelle enzyme insère l’ADN viral dans le chromosome ?", ["L’intégrase", "gp120", "CD4", "La myosine"], 0, "L’intégrase catalyse cette insertion."),
      choice("Pourquoi la transcriptase inverse favorise-t-elle la diversité virale ?", ["Elle détruit tous les ARN", "Elle commet relativement souvent des erreurs de copie", "Elle fabrique CD4", "Elle empêche toute mutation"], 1, "Sa fidélité de copie est limitée."),
      choice("Quelle classe de médicaments bloque l’insertion chromosomique ?", ["Les antibiotiques antibactériens", "Les anticorps maternels", "Les inhibiteurs de l’intégrase", "Les antalgiques"], 2, "Ils ciblent l’étape d’intégration."),
      choice("Quelle phrase est correcte ?", ["Le provirus est une bactérie", "L’ARN viral est intégré tel quel par gp41", "La capside devient un chromosome humain", "Le provirus peut persister dans l’ADN cellulaire"], 3, "La persistance du provirus contribue aux réservoirs viraux."),
      trueFalse("La cellule humaine transforme normalement tout ARN cytoplasmique en ADN.", false, "Cette conversion dépend ici de la transcriptase inverse virale."),
      short("Nomme l’ADN viral lorsqu’il est inséré dans l’ADN de la cellule hôte.", ["provirus", "le provirus", "ADN proviral", "l’ADN proviral", "adn proviral"], "La forme intégrée est le provirus."),
    ],
    corrections: [
      "« Transcription de l’ARN proviral en ADN proviral » est corrigé en rétrotranscription de l’ARN viral en ADN viral.",
      "La formation d’un ADN viral double brin est explicitée avant l’intégration.",
      "La persistance du provirus est expliquée sans affirmer qu’une cellule intégrée produit continuellement des virions.",
      "Les cibles antirétrovirales sont ajoutées pour relier précisément enzyme et étape du cycle.",
    ],
  },
  {
    id: "hiv-expression-assembly-maturation",
    title: "La production et la maturation des virions",
    summary: "Suivre l’expression du provirus, la synthèse des constituants, leur assemblage, le bourgeonnement et la maturation.",
    pages: "3-4",
    section: "Étapes 5 à 10 du processus d’infection - document 2",
    durationMinutes: 30,
    xp: 70,
    body: `
## 1. Le provirus devient une source d’ARN viraux

Lorsque le provirus est actif, la machinerie cellulaire transcrit son ADN en **ARN viraux**. Certains servent d’ARN messagers pour fabriquer les protéines ; d’autres seront incorporés comme génomes dans les nouvelles particules.

La cellule produit d’abord de longues chaînes de protéines virales. Elles doivent être transportées, modifiées et découpées. Les glycoprotéines d’enveloppe suivent la voie de synthèse et de maturation des protéines membranaires ; d’autres constituants rejoignent la face interne de la membrane plasmique.

## 2. Assemblage, bourgeonnement, maturation

| Étape | Ce qui se passe | Résultat |
|---|---|---|
| transcription | l’ADN proviral sert de matrice | ARN viraux |
| traduction | les ribosomes lisent les ARN messagers | précurseurs protéiques viraux |
| assemblage | ARN et protéines se regroupent près de la membrane | particule immature |
| bourgeonnement | la particule sort en emportant une portion de membrane | virion enveloppé immature |
| maturation | la protéase découpe les précurseurs | virion organisé et infectieux |

Le **bourgeonnement** explique l’origine de l’enveloppe lipidique. Une particule qui vient de bourgeonner n’est pas encore pleinement mature : l’action de la protéase réorganise ses protéines.

## 3. Pourquoi les lymphocytes T CD4 diminuent-ils ?

Le document relie directement la sortie de nouveaux virus à la destruction du lymphocyte. Cette relation est utile mais trop simple. La diminution des T CD4 résulte de plusieurs mécanismes : effets toxiques de la réplication, fusion ou mort de cellules infectées, reconnaissance par les cellules immunitaires, inflammation chronique, perturbation de la production et de la survie des lymphocytes.

Ainsi, le VIH affaiblit la coordination immunitaire en réduisant progressivement le nombre et la qualité fonctionnelle des cellules T CD4, mais chaque bourgeonnement n’équivaut pas automatiquement à une lyse immédiate.

## 4. Les médicaments révèlent la logique du cycle

Un **inhibiteur de protéase** laisse produire des particules mal maturées et peu infectieuses. D’autres classes bloquent l’attachement, la fusion, la transcriptase inverse ou l’intégrase. L’association de plusieurs antirétroviraux cible donc plusieurs maillons d’une même chaîne.

> **Astuce mémoire - T A B M :** **T**ranscrire, **A**ssembler, **B**ourgeonner, **M**aturer.
`,
    keyPoint: "Le provirus est transcrit ; ARN et protéines s’assemblent, bourgeonnent puis la protéase rend les nouveaux virions matures.",
    example: "Si la protéase est bloquée, des particules peuvent sortir de la cellule mais leurs protéines restent mal découpées : elles ne mûrissent pas correctement.",
    methodSteps: [
      "Pars de l’ADN proviral intégré.",
      "Sépare transcription des ARN et traduction des protéines.",
      "Place l’assemblage avant le bourgeonnement.",
      "Termine par la maturation due à la protéase.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Cycle interactif",
      title: "De la cellule intégrée au virion mature",
      instruction: "Parcours la chaîne et repère l’étape ciblée par chaque famille d’antirétroviraux.",
      items: [
        { label: "Transcription du provirus", shortLabel: "ARN", detail: "La cellule fabrique des ARN messagers et des ARN génomiques viraux." },
        { label: "Traduction", shortLabel: "Protéines", detail: "Les ribosomes synthétisent des précurseurs protéiques viraux." },
        { label: "Trafic et modifications", shortLabel: "Adressage", detail: "Les glycoprotéines gagnent la membrane et les autres constituants rejoignent la zone d’assemblage." },
        { label: "Assemblage", shortLabel: "Particule", detail: "Deux copies d’ARN et les protéines virales se regroupent en particule immature." },
        { label: "Bourgeonnement", shortLabel: "Sortie", detail: "La particule acquiert une enveloppe issue de la membrane cellulaire." },
        { label: "Maturation", shortLabel: "Protéase", detail: "Le découpage des précurseurs réorganise le cœur viral et rend le virion infectieux." },
      ],
      observation: "Le document s’arrête à l’apparition de nouveaux virus ; la maturation par la protéase complète l’étape décisive qui suit le bourgeonnement.",
    },
    questions: [
      choice("Quelle molécule intégrée sert de matrice au début de cette phase ?", ["Le provirus", "Un anticorps", "Le collagène", "Le glycogène"], 0, "L’ADN proviral peut être transcrit en ARN viraux.", "Document 2 • pages 3-4"),
      choice("Quelle opération produit les protéines virales à partir des ARN messagers ?", ["L’intégration", "La traduction", "La phagocytose", "La fécondation"], 1, "Les ribosomes réalisent la traduction."),
      choice("À quel moment les constituants se regroupent-ils en particule immature ?", ["Pendant la séroconversion", "Pendant la mitose seulement", "Lors de l’assemblage", "Lors d’un test ELISA"], 2, "L’assemblage réunit ARN et protéines."),
      choice("D’où vient principalement l’enveloppe lipidique d’un nouveau virion ?", ["Du noyau", "D’un anticorps", "De la capside d’un autre virus", "D’une portion de membrane cellulaire emportée au bourgeonnement"], 3, "Le bourgeonnement fournit l’enveloppe lipidique."),
      trueFalse("Un virion venant de bourgeonner est nécessairement déjà pleinement mature.", false, "La protéase doit encore réorganiser les protéines virales."),
      choice("Quelle enzyme assure cette maturation ?", ["La protéase virale", "CD4", "CCR5", "L’hémoglobine"], 0, "La protéase découpe les précurseurs viraux."),
      choice("Quel médicament cible directement cette dernière étape ?", ["Un antibiotique contre toutes les bactéries", "Un inhibiteur de protéase", "Une hormone", "Un vaccin antitétanique"], 1, "Il empêche la maturation correcte des virions."),
      choice("Quelle affirmation sur les T CD4 est la plus juste ?", ["Ils ne sont jamais altérés", "Ils disparaissent uniquement parce que les anticorps les mangent", "Leur diminution résulte de plusieurs mécanismes directs et immunitaires", "Ils se changent en virions"], 2, "La déplétion ne se réduit pas à une seule lyse mécanique."),
      choice("Quel ordre est correct ?", ["Maturation - traduction - intégration", "Bourgeonnement - provirus - attachement", "Traduction - rétrotranscription - fusion", "Transcription - traduction - assemblage - bourgeonnement - maturation"], 3, "Cet ordre suit la production d’un nouveau virion."),
      trueFalse("Le traitement antirétroviral combine généralement des molécules ciblant plusieurs étapes.", true, "L’association renforce le blocage de la réplication et limite les résistances."),
      short("Nomme la sortie d’une particule virale qui emporte une portion de membrane cellulaire.", ["bourgeonnement", "le bourgeonnement", "bourgeonnement viral", "le bourgeonnement viral"], "Ce mode de sortie est le bourgeonnement."),
    ],
    corrections: [
      "La transcription du provirus est distinguée de la traduction des protéines et de l’encapsidation de l’ARN génomique.",
      "La maturation par la protéase, absente de la liste du document, est ajoutée après le bourgeonnement.",
      "Le bourgeonnement n’est pas présenté comme une lyse instantanée obligatoire de chaque cellule infectée.",
      "La baisse des T CD4 est expliquée comme un phénomène multifactoriel et non comme une simple perforation répétée.",
    ],
  },
  {
    id: "hiv-acute-infection-seroconversion",
    title: "Primo-infection, charge virale et séroconversion",
    summary: "Lire le début des courbes et distinguer virémie, lymphocytes T CD4, anticorps, fenêtre sérologique et séropositivité.",
    pages: "4-5",
    section: "Phase I de l’évolution de l’infection - document 3",
    durationMinutes: 29,
    xp: 75,
    body: `
## 1. Trois grandeurs, trois questions

Le document 3 superpose trois courbes. Elles ne mesurent pas la même chose :

| Grandeur | Ce qu’elle renseigne | Exemple de mesure |
|---|---|---|
| charge virale ou virémie | quantité de VIH circulant | ARN viral dans le plasma |
| nombre de T CD4 | état d’une partie centrale du système immunitaire | cellules par millimètre cube de sang |
| anticorps anti-VIH | réponse humorale détectable | test sérologique |

## 2. Le modèle moderne de la primo-infection

Après l’acquisition du VIH, la réplication virale provoque une **hausse rapide de la charge virale**. Le nombre de T CD4 chute souvent, puis remonte partiellement lorsque les réponses immunitaires se mettent en place. La charge virale redescend vers un niveau appelé **point d’équilibre viral** ou set point, sans signifier que le virus a disparu.

Les anticorps anti-VIH deviennent détectables après un délai : c’est la **séroconversion**. La période située entre l’infection et la détection fiable par un test fondé sur les anticorps constitue une **fenêtre sérologique**. Une personne peut donc être infectée et transmettre le VIH alors qu’un test trop précoce reste négatif.

## 3. Corriger la lecture trop littérale de la courbe

Le graphique scolaire indique une hausse initiale des T4. En réalité, la phase aiguë comporte généralement une baisse précoce des T CD4, suivie d’un rebond partiel. Les trois courbes imprimées utilisent aussi des unités et une chronologie schématiques : elles servent à raisonner sur les tendances, pas à poser un calendrier universel.

Le test **ELISA** mentionné plus loin révèle des anticorps anti-VIH dans le cadre du document. Les stratégies actuelles peuvent associer antigène et anticorps, puis confirmer le résultat. La **charge virale**, elle, recherche directement l’ARN viral et sert notamment au suivi du traitement.

## 4. Une sérologie positive ne signifie pas « SIDA déclaré »

Chez un adulte, être **séropositif** signifie qu’une infection par le VIH a été mise en évidence selon l’algorithme diagnostique approprié. Un seul ELISA réactif, un test rapide isolé ou un autotest réactif constitue un résultat de dépistage, pas encore un diagnostic positif. L’algorithme national doit être suivi ; la stratégie recommandée par l’OMS conclut sur **trois tests distincts consécutivement réactifs**.

Tout dépistage respecte les **5 C** : consentement, confidentialité, conseil, résultat correct et connexion aux services de prévention ou de soins. Le résultat sérologique ne renseigne pas, à lui seul, sur le stade clinique : le nombre de T CD4, la charge virale, les symptômes et les maladies associées sont évalués séparément.

> **Astuce mémoire - V C A :** **V**irus monte tôt, **C**D4 chutent puis rebondissent partiellement, **A**nticorps apparaissent après un délai.
`,
    keyPoint: "La primo-infection associe un pic précoce de charge virale, une perturbation des T CD4 et une séroconversion retardée qui crée une fenêtre de dépistage.",
    example: "Un test d’anticorps négatif quelques jours après une exposition ne suffit pas à exclure l’infection : la réponse peut ne pas être encore détectable.",
    methodSteps: [
      "Identifie l’axe, l’unité et la courbe avant de la décrire.",
      "Décris le pic de charge virale puis sa baisse partielle.",
      "Repère le délai d’apparition des anticorps.",
      "Distingue séropositivité, charge virale et stade clinique.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe expérimentale redessinée",
      title: "Suivre la charge virale au début de l’infection",
      instruction: "Déplace le point du jour 0 vers la phase chronique et repère le pic aigu puis le point d’équilibre relatif.",
      formula: "Indice relatif de charge virale",
      rule: { kind: "samples", points: [[0, 0.2], [1, 1.2], [2, 5.8], [3, 9.6], [4, 7.2], [5, 4.1], [6, 2.6], [7, 2.0], [8, 1.8], [9, 1.9], [10, 2.1], [11, 2.3], [12, 2.5]] },
      window: { xMin: 0, xMax: 12, yMin: 0, yMax: 10.5 },
      guides: [
        { kind: "vertical", value: 3, label: "pic aigu" },
        { kind: "horizontal", value: 2.2, label: "niveau chronique relatif" },
      ],
      marker: { min: 0, max: 12, step: 1, initial: 3 },
      observation: "Courbe originale en indice relatif : elle montre la forme générale du phénomène sans transformer les mois du document en calendrier obligatoire.",
    },
    questions: [
      choice("Quelle grandeur mesure directement la quantité de VIH circulant ?", ["La charge virale", "Le groupe sanguin", "La masse osseuse", "La glycémie"], 0, "La charge virale quantifie le matériel viral dans le plasma.", "Document 3 • pages 4-5"),
      choice("Que désigne la séroconversion ?", ["La disparition de tout virus", "Le moment où les anticorps anti-VIH deviennent détectables", "La fusion membranaire", "La fabrication d’un globule rouge"], 1, "La séroconversion correspond à l’apparition détectable des anticorps."),
      choice("Quelle période peut donner un test d’anticorps négatif malgré une infection récente ?", ["La phase musculaire", "La mitose", "La fenêtre sérologique", "La diapédèse"], 2, "Les anticorps ne sont pas toujours détectables immédiatement."),
      choice("Quel profil est attendu pendant la phase aiguë non traitée ?", ["Aucun virus dans le sang", "Uniquement des anticorps sans virus", "Des T CD4 transformés en anticorps", "Un pic de charge virale"], 3, "La réplication produit un pic viral précoce."),
      trueFalse("Une charge virale qui baisse après le pic signifie que le VIH a forcément disparu.", false, "Le virus persiste et atteint un niveau chronique relatif."),
      choice("Comment évoluent généralement les T CD4 au début ?", ["Ils chutent puis peuvent remonter partiellement", "Ils augmentent sans jamais varier", "Ils deviennent des virions", "Ils sont toujours à zéro"], 0, "Le rebond partiel ne restaure pas forcément le niveau initial."),
      choice("À quoi sert principalement le nombre de T CD4 ?", ["À connaître le groupe ABO", "À apprécier l’état immunitaire", "À mesurer une tension électrique", "À dater une roche"], 1, "Il renseigne sur une composante majeure de l’immunité."),
      choice("Que détecte le test ELISA simplifié du document ?", ["La capside dans une image", "Le nombre de chromosomes", "Les anticorps anti-VIH", "La force musculaire"], 2, "La note du document précise la détection d’anticorps."),
      choice("Quelle phrase est correcte ?", ["Séropositif signifie toujours SIDA", "Un test trop précoce est toujours définitif", "Les anticorps détruisent instantanément tout provirus", "Séropositivité et stade SIDA sont deux informations différentes"], 3, "Le stade dépend de critères immunitaires et cliniques supplémentaires."),
      trueFalse("Une personne peut transmettre le VIH pendant la fenêtre sérologique.", true, "Le virus peut être présent avant la détection des anticorps."),
      choice("Dans la stratégie diagnostique recommandée par l’OMS chez les personnes d’au moins 18 mois, quelle suite permet de conclure VIH positif ?", ["Un seul autotest réactif", "Deux symptômes évocateurs", "Trois tests distincts consécutivement réactifs", "Une charge virale supposée d’après une courbe"], 2, "Un résultat réactif isolé doit être poursuivi selon l’algorithme national ; trois tests consécutivement réactifs fondent le diagnostic positif."),
      short("Nomme l’apparition détectable des anticorps anti-VIH après l’infection.", ["séroconversion", "la séroconversion", "seroconversion"], "Cette étape est la séroconversion."),
    ],
    corrections: [
      "La hausse initiale des LT4 du graphique est corrigée : la phase aiguë comporte généralement une baisse, puis un rebond partiel.",
      "Les limites fixes 0-6 mois sont présentées comme un schéma du document, non comme une durée universelle.",
      "La fenêtre sérologique est explicitée : un test d’anticorps trop précoce peut être négatif malgré l’infection.",
      "Séropositivité, charge virale et stade SIDA sont clairement distingués.",
      "Un résultat réactif isolé n’est plus assimilé à un diagnostic : la stratégie à trois tests et les 5 C du dépistage sont explicités.",
    ],
  },
  {
    id: "hiv-chronic-phase-immune-depletion",
    title: "Phase chronique, immunodéficience et SIDA",
    summary: "Expliquer la progression non traitée, le rôle central des T CD4 et l’apparition de maladies opportunistes.",
    pages: "4-5",
    section: "Phases II et III de l’évolution de l’infection - document 3",
    durationMinutes: 30,
    xp: 85,
    body: `
## 1. Une phase chronique qui n’est pas une absence d’activité

Après la primo-infection, une personne peut rester longtemps sans symptôme visible. Cette phase est dite **chronique**, **asymptomatique** ou de **latence clinique**. Le mot latence ne signifie pas que tous les provirus dorment ni que le VIH a disparu : une réplication et un renouvellement des cellules infectées persistent.

Sans traitement efficace, le nombre de T CD4 tend à diminuer au fil du temps tandis que la charge virale peut remonter. La durée varie fortement d’une personne à l’autre ; le repère de 56 mois du document est un découpage graphique, pas une échéance biologique obligatoire.

## 2. Pourquoi la perte des T CD4 désorganise-t-elle les défenses ?

Les T CD4 activés fournissent des signaux qui soutiennent plusieurs partenaires : lymphocytes B, macrophages et lymphocytes T CD8. Leur diminution ne supprime pas toutes les défenses d’un seul coup, mais elle rend la coordination de plus en plus insuffisante.

| Évolution | Conséquence possible |
|---|---|
| réplication persistante | entretien de l’inflammation et de la virémie |
| baisse des T CD4 | coordination moins efficace des réponses adaptatives |
| immunodéficience avancée | risque accru d’infections et de cancers opportunistes |

## 3. Infection par le VIH, maladie avancée et SIDA

Le **SIDA** est le stade le plus avancé de l’infection. Chez les adultes et adolescents, un nombre de T CD4 inférieur à environ **200 cellules par millimètre cube** est un repère d’immunodéficience avancée employé par certaines classifications ; l’appellation SIDA dépend aussi des affections définissant ce stade et du référentiel clinique national. Une seule sérologie positive ne suffit donc pas à conclure que ce stade est atteint.

Les maladies **opportunistes** profitent de l’affaiblissement des défenses. Le document cite la tuberculose et le sarcome de Kaposi. D’autres infections graves peuvent apparaître selon le contexte. Le mot opportuniste ne signifie pas que l’agent est inoffensif ; il indique que le risque ou la gravité augmente quand l’immunité est compromise.

## 4. Les anticorps ne « tendent pas nécessairement vers zéro »

Le document représente une chute presque complète des anticorps à la phase finale. En pratique, des anticorps anti-VIH restent généralement détectables. Ils ne suffisent pas à éliminer les cellules portant un provirus ni à contrôler toute la diversité virale. Le marqueur le plus utile pour suivre la réplication est la charge virale, et le nombre de T CD4 renseigne sur l’état immunitaire.

Le traitement antirétroviral peut bloquer durablement la réplication, permettre la remontée des T CD4 et empêcher la progression vers le SIDA. La courbe naturelle du document décrit surtout une infection **non traitée**.

> **Astuce mémoire - C V O :** **C**D4 baissent, **V**irémie remonte, maladies **O**pportunistes apparaissent.
`,
    keyPoint: "Sans traitement, la réplication persistante peut faire chuter les T CD4 jusqu’à une immunodéficience avancée favorisant les maladies opportunistes et le stade SIDA.",
    example: "Une personne séropositive sans symptôme et avec un nombre élevé de T CD4 vit avec le VIH, mais on ne peut pas la qualifier de personne au stade SIDA sur la seule sérologie.",
    methodSteps: [
      "Décris séparément la charge virale et le nombre de T CD4.",
      "Explique que l’absence de symptôme n’est pas l’absence de réplication.",
      "Relie la baisse des T CD4 au défaut de coordination immunitaire.",
      "Conclue au stade SIDA seulement avec des critères immunitaires ou cliniques adaptés.",
    ],
    interaction: diagram(
      "Relier les trois phases sans figer leur durée",
      "Choisis une phase et relie charge virale, T CD4, symptômes et risque infectieux.",
      "Évolution non traitée",
      "La progression résulte d’un équilibre qui se dégrade entre réplication virale et réponses immunitaires.",
      [
        { id: "acute", label: "Primo-infection", role: "Pic viral", detail: "La charge virale augmente fortement ; les T CD4 sont perturbés et les anticorps apparaissent après un délai." },
        { id: "chronic", label: "Phase chronique", role: "Équilibre fragile", detail: "Le VIH reste actif malgré l’absence possible de symptômes ; les T CD4 diminuent progressivement sans traitement." },
        { id: "advanced", label: "Maladie avancée", role: "Défenses fragilisées", detail: "La baisse importante des T CD4 accroît le risque d’affections graves." },
        { id: "aids", label: "Stade SIDA", role: "Critères précis", detail: "Il correspond à une immunodéficience sévère ou à certaines maladies définissant ce stade." },
        { id: "art", label: "Traitement", role: "Changer la trajectoire", detail: "Les antirétroviraux peuvent rendre la charge virale indétectable et empêcher la progression." },
      ],
      "Le graphique du PDF illustre l’histoire naturelle sans traitement ; il ne prédit pas le calendrier d’une personne prise en charge.",
    ),
    questions: [
      choice("Que signifie phase chronique asymptomatique ?", ["Le VIH peut rester actif sans symptôme visible", "Le VIH a forcément disparu", "La personne n’a jamais été infectée", "Les T CD4 deviennent des anticorps"], 0, "L’absence de symptôme n’est pas l’absence de réplication.", "Document 3 • pages 4-5"),
      choice("Quelle tendance est attendue sans traitement au cours du temps ?", ["Les T CD4 augmentent toujours", "Les T CD4 diminuent progressivement", "La charge virale reste toujours nulle", "Le provirus sort du chromosome"], 1, "La déplétion des T CD4 fragilise l’immunité."),
      choice("Pourquoi les T CD4 sont-ils centraux ?", ["Ils transportent l’oxygène", "Ils forment les os", "Ils coordonnent plusieurs acteurs immunitaires", "Ils fabriquent directement tous les médicaments"], 2, "Ils soutiennent notamment B, macrophages et T CD8."),
      choice("Quelle affection citée dans le document est opportuniste ?", ["Une fracture", "Une carie isolée", "La myopie", "La tuberculose"], 3, "La tuberculose est un exemple majeur chez les personnes immunodéprimées."),
      trueFalse("Une sérologie positive suffit à prouver que la personne est au stade SIDA.", false, "Il faut des critères immunitaires ou cliniques supplémentaires."),
      choice("Quel seuil est classiquement associé à une immunodéficience très avancée ?", ["Moins de 200 T CD4 par mm³", "Plus de 10 000 globules rouges", "Une température de 37 °C", "Un anticorps unique"], 0, "Le seuil de 200 T CD4/mm³ est un repère diagnostique courant."),
      choice("Que signifie maladie opportuniste ?", ["Une maladie qui n’existe jamais", "Une affection favorisée ou aggravée par l’immunodéficience", "Une maladie uniquement génétique", "Une réaction musculaire"], 1, "Elle profite de défenses insuffisantes."),
      choice("Quelle affirmation sur les anticorps est correcte ?", ["Ils disparaissent obligatoirement tous", "Ils transforment le VIH en bactérie", "Ils restent souvent détectables mais ne contrôlent pas seuls l’infection", "Ils remplacent les T CD4"], 2, "Une sérologie peut rester positive même à un stade avancé."),
      choice("Quel couple suit le mieux l’infection ?", ["Taille et poids", "Pouls et couleur des yeux", "Nombre de dents et glycémie", "Charge virale et nombre de T CD4"], 3, "Ces deux marqueurs renseignent sur réplication et état immunitaire."),
      trueFalse("Le repère de 56 mois du document est une durée universelle avant le SIDA.", false, "La progression varie largement et le traitement la modifie."),
      short("Nomme le déficit des défenses qui favorise les maladies opportunistes.", ["immunodéficience", "l’immunodéficience", "déficience immunitaire", "une déficience immunitaire", "immunodépression", "l’immunodépression"], "Il s’agit d’une immunodéficience ou immunodépression."),
    ],
    corrections: [
      "La phase asymptomatique n’est pas décrite comme une disparition ou une inactivité totale du VIH.",
      "Le seuil de 56 mois est signalé comme schématique : la progression non traitée varie fortement.",
      "Les anticorps anti-VIH ne sont pas présentés comme tendant nécessairement vers zéro au stade avancé.",
      "Le stade SIDA est distingué de la simple séropositivité et relié à des critères immunitaires ou cliniques.",
      "La trajectoire du document est explicitement celle d’une infection non traitée ; l’effet transformateur des antirétroviraux est ajouté.",
    ],
  },
  {
    id: "hiv-transmission-prevention-treatment",
    title: "Transmission, prévention et traitement",
    summary: "Transformer la conclusion du cours en décisions justes : connaître les voies réelles, prévenir une exposition et comprendre le rôle du traitement.",
    pages: "5-6",
    section: "Conclusion générale et transmission évoquée dans l’exercice 2",
    durationMinutes: 28,
    xp: 90,
    body: `
## 1. Une transmission exige un liquide et une porte d’entrée compatibles

Le VIH peut être transmis par certains liquides biologiques lorsqu’ils atteignent une muqueuse, une plaie ou directement le sang. Les principales situations concernent :

- les rapports sexuels sans moyen de prévention adapté ;
- le partage de matériel d’injection ou l’utilisation d’instruments non stériles ;
- la transmission pendant la grossesse, l’accouchement ou l’allaitement en l’absence de prise en charge efficace ;
- exceptionnellement, des produits sanguins non sécurisés là où le dépistage n’est pas garanti.

Le VIH **ne se transmet pas** par une poignée de main, une accolade, le partage d’un repas, les toilettes, la salive ordinaire, la toux ou les moustiques. Connaître ces non-voies combat la peur et la stigmatisation.

## 2. La prévention combinée

| Mesure | Moment | Principe |
|---|---|---|
| préservatif interne ou externe | pendant le rapport | réduit l’exposition sexuelle au VIH et à d’autres infections |
| dépistage | régulièrement et après un risque selon le conseil reçu | connaître son statut et accéder rapidement aux soins |
| matériel stérile | avant toute injection ou acte percutané | éviter le contact sanguin partagé |
| PrEP | avant et pendant une période d’exposition possible | prévention antirétrovirale après vérification du statut VIH négatif et avec suivi régulier |
| PEP | après une exposition potentielle | traitement d’urgence commencé le plus vite possible, idéalement en 24 h et au plus tard en 72 h, généralement pendant 28 jours |
| prise en charge périnatale | grossesse, naissance, allaitement | traitement et suivi maternels, puis prophylaxie antirétrovirale postnatale du nourrisson exposé, renforcée selon le risque |

Une exposition récente nécessite une orientation rapide vers un service de santé. L’élève ne doit pas s’automédiquer ni attendre l’apparition de symptômes. Les formes de PrEP disponibles, orales ou à longue durée d’action, dépendent des protocoles et de l’accès local ; leur suivi évite de commencer une prévention pré-exposition pendant une infection non diagnostiquée.

## 3. Le traitement change la vie et la transmission

Le **traitement antirétroviral** associe des médicaments qui bloquent plusieurs étapes du cycle. Après un diagnostic confirmé, il est proposé rapidement, indépendamment du nombre initial de T CD4, selon l’évaluation clinique. Il ne retire pas tous les provirus, mais il peut abaisser durablement la charge virale jusqu’à un niveau indétectable, favoriser une reconstitution immunitaire parfois incomplète et éviter la progression vers le SIDA.

Lorsque la suppression virale est confirmée et maintenue grâce à un traitement bien suivi, **indétectable = intransmissible par voie sexuelle**. Cette règle, souvent résumée par I = I, concerne la transmission sexuelle et suppose le suivi de la charge virale. Elle n’efface pas l’intérêt du préservatif pour les autres infections sexuellement transmissibles ni des mesures de prévention dans d’autres contextes.

## 4. Prévenir sans juger

La formule du document « mener une vie saine et responsable » est trop vague si elle laisse entendre qu’une infection serait une faute. La prévention efficace repose sur l’information, le consentement, l’accès au matériel, au dépistage, à la PrEP, à la PEP et au traitement. Une personne vivant avec le VIH doit être respectée et peut vivre longtemps en bonne santé avec une prise en charge adaptée.

> **Astuce mémoire - A P T :** **A**vant = PrEP, a**P**rès = PEP, VIH présent = **T**raitement.
`,
    keyPoint: "La prévention combine préservatif, matériel stérile, dépistage, PrEP, PEP et traitement ; une charge virale durablement indétectable empêche la transmission sexuelle.",
    example: "Après une exposition potentielle récente, la bonne décision est de consulter immédiatement pour évaluer une PEP, sans attendre un symptôme ou un test d’anticorps tardif.",
    methodSteps: [
      "Identifie d’abord s’il existe une voie réelle d’exposition.",
      "Choisis la mesure selon le moment : avant, juste après ou après diagnostic.",
      "Précise que dépistage et traitement nécessitent un accompagnement sanitaire.",
      "Formule la réponse sans jugement ni stigmatisation.",
    ],
    interaction: diagram(
      "Choisir une protection adaptée au moment",
      "Explore chaque situation et associe-la à la mesure qui agit au bon moment.",
      "Prévention combinée",
      "Aucune mesure isolée ne répond à toutes les situations ; les outils se complètent.",
      [
        { id: "before", label: "Avant", role: "Réduire le risque", detail: "Information, préservatif, matériel stérile et PrEP selon l’évaluation individuelle." },
        { id: "after", label: "Après une exposition", role: "Agir en urgence", detail: "La PEP doit commencer au plus vite, idéalement dans les 24 heures et au plus tard dans les 72 heures." },
        { id: "testing", label: "Dépistage", role: "Connaître son statut", detail: "Le calendrier et le type de test dépendent du délai depuis l’exposition." },
        { id: "treatment", label: "Après diagnostic", role: "Bloquer la réplication", detail: "Le traitement protège la santé et peut rendre la charge virale indétectable." },
        { id: "perinatal", label: "Grossesse et allaitement", role: "Prévenir la transmission", detail: "Traitement, suivi de la charge virale et prise en charge de l’enfant réduisent fortement le risque." },
        { id: "respect", label: "Dans tous les cas", role: "Respecter", detail: "Aucun contact social ordinaire ne justifie l’exclusion d’une personne vivant avec le VIH." },
      ],
      "La prévention est une suite de choix concrets et accessibles, pas une étiquette morale portée par la personne.",
    ),
    questions: [
      choice("Quelle situation peut transmettre le VIH ?", ["Le partage de matériel d’injection contaminé", "Une poignée de main", "Un repas partagé", "Une piqûre de moustique"], 0, "Le sang partagé par du matériel non stérile constitue une voie réelle.", "Conclusion et exercice 2 • pages 5-6"),
      choice("Quelle mesure est prise avant une période d’exposition possible ?", ["La PEP", "La PrEP", "Une antibiothérapie", "Un rappel antitétanique"], 1, "PrEP signifie prophylaxie pré-exposition."),
      choice("Quelle mesure doit être évaluée en urgence après une exposition récente ?", ["Un traitement contre la grippe", "Une attente de plusieurs mois", "La PEP", "Une radiographie"], 2, "La prophylaxie post-exposition doit commencer rapidement."),
      choice("Quel délai maximal est recommandé pour débuter une PEP ?", ["Un an", "Un mois", "Deux semaines", "72 heures"], 3, "Elle doit commencer idéalement dans les 24 h, au plus tard dans les 72 h."),
      trueFalse("Le VIH peut se transmettre par les toilettes ou une accolade.", false, "Les contacts sociaux ordinaires ne transmettent pas le VIH."),
      choice("Quel outil réduit l’exposition sexuelle et protège aussi contre d’autres IST ?", ["Le préservatif", "Le test ELISA seul", "La radiographie", "La température"], 0, "Le préservatif reste un outil important de prévention combinée."),
      choice("Que signifie I = I dans ce contexte ?", ["Infection égale immunité", "Indétectable égale intransmissible par voie sexuelle", "Intégrase égale intégration", "Injection égale incubation"], 1, "La suppression virale maintenue empêche la transmission sexuelle."),
      choice("Quel est l’effet principal du traitement antirétroviral ?", ["Éliminer instantanément tout provirus", "Transformer le virus en bactérie", "Bloquer fortement la réplication et favoriser la reconstitution immunitaire", "Créer le groupe sanguin"], 2, "Le traitement contrôle le virus sans supprimer immédiatement tous les réservoirs ni garantir une restauration immunitaire complète."),
      choice("Quelle action est adaptée pendant la grossesse chez une personne vivant avec le VIH ?", ["Arrêter tout suivi", "Attendre le SIDA", "Éviter tout soin", "Prendre le traitement et suivre la charge virale avec l’équipe de santé"], 3, "La prise en charge réduit fortement la transmission périnatale."),
      trueFalse("Une personne vivant avec le VIH peut mener une vie longue et en bonne santé sous traitement efficace.", true, "Le traitement précoce et bien suivi transforme le pronostic."),
      short("Nomme le traitement préventif d’urgence après une exposition potentielle.", ["PEP", "pep", "prophylaxie post-exposition", "la prophylaxie post-exposition", "traitement post-exposition"], "Il s’agit de la PEP."),
    ],
    corrections: [
      "La formule vague « vie saine et responsable » est remplacée par des mesures concrètes et non stigmatisantes.",
      "PrEP, PEP, matériel stérile, prévention périnatale et dépistage sont ajoutés pour compléter la prévention absente du développement.",
      "La PEP est précisée : le plus tôt possible, idéalement dans les 24 heures et au plus tard dans les 72 heures, avec une prescription complète de 28 jours selon l’OMS.",
      "La PrEP suppose un statut VIH négatif vérifié, un suivi régulier et un choix de forme conforme au protocole disponible.",
      "Le traitement antirétroviral est proposé rapidement après diagnostic confirmé, indépendamment du nombre initial de T CD4 ; la reconstitution immunitaire peut rester incomplète.",
      "La prévention périnatale inclut la prophylaxie postnatale du nourrisson exposé, renforcée selon le niveau de risque.",
      "Le principe indétectable = intransmissible est expliqué avec sa portée sexuelle et la nécessité d’une suppression virale confirmée et maintenue.",
    ],
  },
  {
    id: "hiv-official-cycle-exercises",
    title: "Exercices officiels : ordonner et compléter le cycle",
    summary: "Résoudre fidèlement les exercices 1 et 2 en utilisant le vocabulaire corrigé du cycle viral.",
    pages: "5-6",
    section: "Évaluations - exercices 1 et 2",
    durationMinutes: 31,
    xp: 100,
    kind: "challenge",
    body: `
## Exercice 1 - retrouver la chronologie

Le document propose cinq événements dans le désordre :

1. multiplication du VIH dans le lymphocyte T4 ;
2. adsorption du VIH au lymphocyte T4 ;
3. transformation de l’ARN viral en ADN viral ;
4. entrée de l’ARN viral et de la transcriptase inverse ;
5. intégration de l’ADN viral à l’ADN du lymphocyte T4.

La bonne démarche consiste à rechercher les dépendances : le virus doit se **fixer** avant d’entrer ; l’ARN doit entrer avant d’être copié ; l’ADN doit être formé avant d’être intégré ; le provirus intégré peut ensuite être exprimé et conduire à de nouveaux virions.

$$2 \\rightarrow 4 \\rightarrow 3 \\rightarrow 5 \\rightarrow 1$$

## Exercice 2 - compléter sans réciter au hasard

| Lacune | Mot attendu | Indice logique |
|---|---|---|
| récepteur de la cellule | protéine CD4 | le VIH cible certains lymphocytes T |
| rapprochement des membranes | fusion | gp41 permet l’entrée |
| cellule recevant le virus | cellule-cible | elle porte les récepteurs adaptés |
| enzyme de copie | transcriptase reverse | ARN viral vers ADN viral |
| support d’intégration | ADN | le provirus rejoint un chromosome cellulaire |
| résultat du test | séropositif | des anticorps anti-VIH sont détectés |
| forme intégrée | provirus | ADN viral intégré |
| produits du cycle | nouveaux virus | ils s’assemblent puis bourgeonnent |
| état du lymphocyte | infecté | il porte et exprime le matériel viral |

Texte complété : le virus se fixe sur les cellules possédant la **protéine CD4**. La fixation conduit à la **fusion** de l’enveloppe virale et de la membrane de la **cellule-cible**. L’ADN viral produit grâce à la **transcriptase reverse** s’incorpore à **l’ADN** de la cellule hôte. Le sujet est dit **séropositif** lorsque l’infection est mise en évidence par le dépistage adapté. Le **provirus** peut ensuite être transcrit pour produire de **nouveaux virus** qui bourgeonnent à la surface du lymphocyte T4 **infecté**.

## Deux précisions indispensables

Une personne asymptomatique n’est pas immunologiquement « sans perturbation » : le VIH peut rester actif. De plus, le provirus n’emploie pas lui-même une machinerie ; c’est la **cellule hôte** qui transcrit et traduit l’information virale intégrée.

> **Astuce mémoire - F E C I P :** **F**ixation, **E**ntrée, **C**opie, **I**ntégration, **P**roduction.
`,
    keyPoint: "L’ordre officiel est 2 - 4 - 3 - 5 - 1 ; les lacunes suivent la chaîne CD4, fusion, cellule-cible, transcriptase inverse, ADN, séropositif, provirus, nouveaux virus, infecté.",
    example: "Pour placer « intégration », vérifie qu’un ADN viral existe déjà ; l’étape de rétrotranscription doit donc la précéder.",
    methodSteps: [
      "Souligne le verbe de chaque événement.",
      "Repère ce qui doit exister avant l’étape suivante.",
      "Pour un texte à trous, vérifie la grammaire puis le sens scientifique.",
      "Relis la chaîne entière et corrige les mots anciens sans changer la réponse attendue.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Exercice officiel guidé",
      title: "Remettre les cinq cartes dans l’ordre mental",
      instruction: "Parcours l’ordre correct puis explique pourquoi chaque carte dépend de la précédente.",
      items: [
        { label: "2 - Adsorption", shortLabel: "Fixation", detail: "gp120 reconnaît CD4 et le corécepteur." },
        { label: "4 - Entrée du contenu viral", shortLabel: "Fusion", detail: "Les membranes fusionnent et le contenu viral gagne le cytoplasme." },
        { label: "3 - ARN vers ADN", shortLabel: "Copie", detail: "La transcriptase inverse produit l’ADN viral." },
        { label: "5 - ADN viral intégré", shortLabel: "Provirus", detail: "L’intégrase insère l’ADN viral dans un chromosome." },
        { label: "1 - Multiplication", shortLabel: "Production", detail: "La cellule exprime le provirus puis assemble de nouveaux virions." },
      ],
      observation: "L’ordre n’est pas appris comme un code arbitraire : chaque produit devient la condition de l’étape suivante.",
    },
    questions: [
      choice("Quel ordre résout l’exercice 1 ?", ["2 - 4 - 3 - 5 - 1", "1 - 2 - 3 - 4 - 5", "4 - 2 - 5 - 3 - 1", "3 - 5 - 2 - 1 - 4"], 0, "Fixation, entrée, rétrotranscription, intégration puis multiplication.", "Exercice 1 • page 5"),
      choice("Quelle étape vient immédiatement après l’adsorption dans cette liste ?", ["La multiplication", "L’entrée de l’ARN viral et de la transcriptase inverse", "L’intégration", "La maturation des anticorps"], 1, "Le contenu viral doit entrer avant d’être copié."),
      choice("Quelle étape doit précéder l’intégration ?", ["Le stade SIDA", "La séroconversion", "La fabrication de l’ADN viral", "La disparition des T CD4"], 2, "L’intégrase ne peut insérer qu’un ADN viral déjà formé."),
      choice("Quelle étape ferme la liste simplifiée de l’exercice 1 ?", ["La fixation", "La fusion", "La rétrotranscription", "La multiplication du VIH"], 3, "La production de nouveaux virions vient après l’intégration."),
      choice("Quel mot complète la première lacune de l’exercice 2 ?", ["protéine CD4", "protéase", "capside p24", "IgG"], 0, "Le virus cible les cellules portant CD4.", "Exercice 2 • pages 5-6"),
      choice("Quel mot décrit l’union des membranes ?", ["Intégration", "Fusion", "Traduction", "Séroconversion"], 1, "L’entrée se fait par fusion des membranes."),
      choice("Comment nomme-t-on la cellule qui reçoit le virus ?", ["Provirus", "Anticorps", "Cellule-cible", "Virémie"], 2, "La cellule-cible porte les récepteurs compatibles."),
      choice("Quelle enzyme complète la lacune sur la production de l’ADN viral ?", ["Intégrase", "Protéase", "ARN polymérase seule", "Transcriptase reverse"], 3, "La transcriptase inverse ou reverse copie ARN vers ADN."),
      choice("Dans quelle molécule cellulaire l’ADN proviral s’insère-t-il ?", ["L’ADN", "Le glucose", "Un anticorps", "Le cholestérol"], 0, "L’ADN viral s’intègre à l’ADN chromosomique."),
      choice("Quel mot du document décrit le sujet chez qui les anticorps anti-VIH sont détectés ?", ["Vacciné", "Séropositif", "Isogénique", "Immunisé contre tout"], 1, "Le mot attendu est séropositif."),
      choice("Quel mot désigne l’ADN viral intégré ?", ["Capside", "Virémie", "Provirus", "Corécepteur"], 2, "Le provirus est la forme intégrée."),
      choice("Quel groupe de mots complète la production finale ?", ["Nouveaux anticorps maternels", "Nouveaux globules rouges", "Nouveaux chromosomes humains", "Nouveaux virus"], 3, "L’expression du provirus conduit à de nouveaux virions."),
      short("Complète la fin : le bourgeonnement se fait à la surface du lymphocyte T4 ...", ["infecté", "infecte", "infectée", "infectee", "lymphocyte infecté", "lymphocyte T4 infecté"], "Le dernier mot proposé et attendu est « infecté »."),
    ],
    corrections: [
      "L’ordre officiel 2-4-3-5-1 est conservé et expliqué par les dépendances entre étapes.",
      "« Injection » est reformulé en entrée après fusion, sans modifier la position attendue dans l’exercice.",
      "« Transcriptase reverse » est conservé comme mot proposé, avec la forme actuelle transcriptase inverse.",
      "La phrase « le virus n’entraîne pas de perturbation » est corrigée : asymptomatique ne signifie pas absence d’activité virale ou immunitaire.",
      "Le provirus ne manipule pas seul la cellule ; la machinerie de la cellule hôte exprime l’information virale intégrée.",
    ],
  },
  {
    id: "hiv-diagnosis-final-mission",
    title: "Mission finale : interpréter les résultats mère-enfant",
    summary: "Exploiter ELISA, charge virale et évolution des anticorps pour distinguer exposition maternelle et infection du nouveau-né.",
    pages: "6-7",
    section: "Évaluation - exercice 3 sur les mères M1/M2 et les enfants E1/E2",
    durationMinutes: 36,
    xp: 120,
    kind: "challenge",
    body: `
## 1. Reconstituer les données du tableau

| Sujet | ELISA anti-VIH | Charge virale à la mesure | Première interprétation |
|---|---:|---:|---|
| I1, témoin non contaminé | négatif | 0 | témoin séronégatif et sans virémie détectée |
| I2, témoin infecté | positif | comprise entre $10^1$ et $10^8$ | infection connue, charge variable |
| M1, mère de E1 | positif | $10^4$ | mère vivant avec le VIH |
| E1 à la naissance | positif | 0 dans le tableau | anticorps détectés ; ARN VIH non détecté à ce prélèvement |
| M2, mère de E2 | positif | $10^4$ | mère vivant avec le VIH |
| E2 à la naissance | positif | $5 \\times 10^2$ | matériel viral détecté ; second prélèvement de confirmation requis |

## 2. Pourquoi les deux enfants ont-ils un ELISA positif ?

Les **IgG maternelles** traversent le placenta. Un nouveau-né peut donc avoir des anticorps anti-VIH reçus de sa mère sans être lui-même infecté. Le test d’anticorps prouve ici l’**exposition aux anticorps maternels**, pas à lui seul l’infection de l’enfant.

Chez un enfant de moins de 18 mois exposé pendant la période périnatale, le diagnostic repose sur des tests **virologiques** qui détectent directement l’ARN ou l’ADN du VIH. Un résultat positif doit être confirmé sur un second prélèvement, sans retarder la prise en charge prescrite. Un résultat négatif unique à la naissance n’exclut pas une infection : le calendrier national prévoit des contrôles répétés, notamment après la fin d’une éventuelle exposition par l’allaitement.

## 3. Lire les deux courbes d’anticorps

### Enfant E1

Le taux d’anticorps est élevé à la naissance puis diminue régulièrement jusqu’à devenir presque nul. Cette évolution correspond à la disparition progressive des IgG maternelles, sans production durable propre visible. Avec « 0 » dans la case de charge virale, l’exercice oriente vers une **infection non mise en évidence chez E1 à ce prélèvement**. En pratique, on ne transforme pas ce seul résultat en preuve définitive : le suivi virologique doit être poursuivi.

### Enfant E2

Le taux d’anticorps baisse d’abord : les IgG maternelles disparaissent. Il remonte ensuite : l’enfant produit ses propres anticorps en réponse à une infection persistante. La mesure de $5 \\times 10^2$ copies d’ARN par millilitre est compatible avec une infection chez E2. En situation clinique, ce résultat virologique positif doit être confirmé sur un second prélèvement ; la prise en charge ne doit pas attendre ce résultat confirmatoire.

## 4. Rédiger la réponse en trois temps

1. **analyser** : comparer ELISA et charge virale de chaque sujet ;
2. **expliquer** : mobiliser le passage placentaire des IgG et la production propre d’anticorps ;
3. **déduire avec prudence** : infection non mise en évidence chez E1 mais suivi requis ; infection mise en évidence chez E2 dans l’exercice, à confirmer sur un second prélèvement en situation réelle.

> **Erreur fréquente :** « ELISA positif à la naissance = enfant infecté ». Faux : les anticorps peuvent être maternels.

> **Astuce mémoire - E1 s’éteint, E2 repart :** chez E1 la courbe s’éteint ; chez E2 elle repart parce que l’enfant produit ses anticorps.
`,
    keyPoint: "Chez le nouveau-né, les IgG maternelles rendent l’ELISA non conclusif : E1 nécessite un suivi virologique malgré un prélèvement négatif, tandis que E2 présente un résultat virologique positif à confirmer.",
    example: "E1 : ELISA positif, ARN VIH non détecté à la naissance puis anticorps en diminution. On attribue la sérologie initiale aux IgG maternelles et on poursuit les tests virologiques selon le calendrier national.",
    methodSteps: [
      "Compare d’abord les témoins I1 et I2 pour valider le sens des tests.",
      "Sépare anticorps détectés et virus directement détecté.",
      "Analyse la tendance de chaque courbe avant de l’interpréter.",
      "Formule une conclusion provisoire pour E1, confirme E2 sur un second prélèvement et rappelle le suivi virologique.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mission graphique interactive",
      title: "Comprendre la courbe de l’enfant E2",
      instruction: "Déplace le point de la naissance au dixième mois et repère le passage des anticorps maternels à la production propre de l’enfant.",
      formula: "Indice relatif d’anticorps anti-VIH chez E2",
      rule: { kind: "samples", points: [[0, 6.2], [1, 5.0], [2, 3.8], [3, 2.7], [4, 1.9], [5, 2.1], [6, 3.0], [7, 4.0], [8, 5.0], [9, 6.0], [10, 7.0]] },
      window: { xMin: 0, xMax: 10, yMin: 0, yMax: 8 },
      guides: [
        { kind: "vertical", value: 4, label: "minimum" },
        { kind: "vertical", value: 6, label: "production propre visible" },
      ],
      marker: { min: 0, max: 10, step: 1, initial: 4 },
      observation: "Courbe originale en unités relatives : la baisse initiale correspond aux IgG maternelles ; la remontée indique une réponse propre de l’enfant E2.",
    },
    questions: [
      choice("Quel profil possède le témoin I1 ?", ["ELISA négatif et charge virale nulle", "ELISA positif et charge élevée", "ELISA négatif et charge maximale", "Aucune donnée"], 0, "I1 est le témoin non contaminé.", "Exercice 3 • pages 6-7"),
      choice("Quel profil confirme que I2 est infecté ?", ["ELISA négatif seul", "ELISA positif avec charge virale détectable", "Charge virale nulle", "Disparition des IgG maternelles"], 1, "I2 associe anticorps détectés et virémie."),
      choice("Pourquoi E1 et E2 ont-ils un ELISA positif à la naissance ?", ["Ils sont forcément tous les deux au stade SIDA", "Leurs globules rouges produisent gp120", "Des IgG maternelles anti-VIH ont traversé le placenta", "Le test mesure leur groupe ABO"], 2, "Les anticorps maternels peuvent persister chez l’enfant."),
      choice("Quel résultat distingue immédiatement E2 de E1 dans le tableau ?", ["Le nom de la mère", "L’âge de dix mois", "La présence de CD4", "Une charge virale de $5 \\times 10^2$ chez E2 contre 0 chez E1"], 3, "Le virus est directement détecté chez E2 dans les données."),
      trueFalse("Un ELISA positif à la naissance suffit à diagnostiquer l’infection de l’enfant.", false, "Les anticorps maternels rendent ce résultat non spécifique de l’infection du nouveau-né."),
      choice("Comment évoluent les anticorps chez E1 ?", ["Ils diminuent continuellement vers un niveau presque nul", "Ils augmentent sans arrêt", "Ils restent exactement constants", "Ils deviennent une charge virale"], 0, "La courbe E1 montre la disparition des anticorps maternels."),
      choice("Comment interpréter la remontée tardive chez E2 ?", ["Les IgG maternelles reviennent du placenta après la naissance", "E2 produit ses propres anticorps en réponse à l’infection", "Le VIH devient un anticorps", "La charge virale est forcément nulle"], 1, "La production propre de l’enfant explique la remontée."),
      choice("Quel test est adapté au diagnostic d’un enfant exposé de moins de 18 mois ?", ["Le groupe sanguin", "Une radiographie", "Un test virologique ARN ou ADN du VIH", "La taille"], 2, "Il faut rechercher directement le virus ou son matériel génétique."),
      choice("Quelle conclusion prudente correspond à E1 ?", ["SIDA déclaré", "Infection prouvée par ELISA seul", "Aucun suivi nécessaire", "Infection non mise en évidence à ce prélèvement ; suivi virologique requis"], 3, "Un résultat virologique négatif à la naissance n’exclut pas définitivement l’infection."),
      trueFalse("En situation réelle, un test virologique positif chez un nourrisson doit être confirmé selon le protocole médical.", true, "La confirmation évite de conclure sur un résultat isolé."),
      choice("Quelle immunoglobuline traverse principalement le placenta ?", ["IgG", "IgM", "IgA sécrétoire", "IgE uniquement"], 0, "Les IgG maternelles assurent ce transfert passif."),
      choice("Que prouve surtout l’ELISA positif de E1 à la naissance ?", ["Une maladie opportuniste", "La présence d’anticorps anti-VIH, probablement maternels", "Une charge virale élevée", "Un nombre de T CD4 inférieur à 200"], 1, "Le test détecte les anticorps, pas leur origine."),
      choice("Quelle conclusion correspond à E2 dans l’exercice ?", ["Non exposé", "Simple transfert d’anticorps sans virus", "Infection mise en évidence, à confirmer sur un second prélèvement", "Guérison sans traitement"], 2, "La virémie détectable et la remontée des anticorps indiquent une infection ; le résultat virologique doit être confirmé sur un second prélèvement."),
      short("Formule la conclusion prudente pour E1.", ["infection non mise en évidence", "infection non mise en evidence", "ARN VIH non détecté, suivi requis", "arn vih non detecte suivi requis", "suivi virologique requis", "test virologique à répéter", "test virologique a repeter"], "L’infection n’est pas mise en évidence à ce prélèvement ; le suivi virologique reste nécessaire."),
      short("Formule la conclusion prudente pour E2.", ["infection mise en évidence à confirmer", "infection mise en evidence a confirmer", "infecté, confirmation requise", "infecte confirmation requise", "résultat virologique positif à confirmer", "resultat virologique positif a confirmer", "vit avec le VIH, confirmation requise"], "Les données indiquent une infection, à confirmer sur un second prélèvement sans retarder la prise en charge."),
    ],
    corrections: [
      "L’ELISA positif du nouveau-né est interprété comme détection possible d’IgG maternelles, non comme preuve suffisante d’infection.",
      "Le diagnostic moderne avant 18 mois est relié à un test virologique ARN ou ADN, avec confirmation d’un résultat positif.",
      "Le « 0 » de charge virale chez E1 est reformulé en ARN VIH non détecté à ce prélèvement ; un résultat négatif unique à la naissance n’exclut pas définitivement l’infection.",
      "Le résultat virologique positif de E2 doit être confirmé sur un second prélèvement, sans retarder la prise en charge prescrite.",
      "La baisse puis la remontée des anticorps chez E2 est explicitée comme disparition des IgG maternelles puis production propre.",
      "Les graphiques sont redessinés en unités relatives sans inventer des valeurs exactes absentes des axes source.",
    ],
  },
];

const levelOrder = [
  "hiv-virion-architecture",
  "hiv-cd4-coreceptor-entry",
  "hiv-reverse-transcription-integration",
  "hiv-expression-assembly-maturation",
  "hiv-acute-infection-seroconversion",
  "hiv-chronic-phase-immune-depletion",
  "hiv-transmission-prevention-treatment",
  "hiv-official-cycle-exercises",
  "hiv-diagnosis-final-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau VIH introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalDSvtHivInfectionPath: LearningPath = {
  id: "terminale-d-svt-l12-hiv-infection",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "La défense de l’organisme et son dysfonctionnement" },
  chapterNumber: 12,
  title: "L’infection de l’organisme par le VIH",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, restructuré en neuf niveaux interactifs avec ses trois évaluations et des mises à jour scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire la structure du VIH et relier chaque constituant à sa fonction",
    "Ordonner l’entrée, la rétrotranscription, l’intégration et la production de nouveaux virions",
    "Interpréter charge virale, anticorps anti-VIH et évolution des lymphocytes T CD4",
    "Distinguer infection par le VIH, phase chronique, SIDA et maladies opportunistes",
    "Expliquer dépistage, prévention, traitement et diagnostic virologique du nouveau-né",
  ],
  modules: [
    {
      id: "terminal-d-hiv-infection-mastery",
      title: "Maîtriser l’infection de l’organisme par le VIH",
      description: "Neuf niveaux progressifs, de la particule virale à la mission officielle sur le diagnostic des enfants E1 et E2.",
      lessons: builtLevels,
    },
  ],
};
