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

const sourceDocument = "SVT Tle C_L9_La mise en place des gisements pétrolifères.pdf";

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
  eyebrow: "Système pétrolier",
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
      introduction: "En géologie pétrolière, une bonne réponse relie toujours un lieu, une roche, un fluide et un processus. Une liste de mots sans relation causale ne suffit pas.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : roche mère, roche réservoir et roche couverture désignent trois fonctions différentes ; une même roche ne reçoit pas automatiquement les trois rôles.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const basinShapes: SchemaShape[] = [
  { shape: "path", d: "M92 54 C160 38 255 58 315 45 C390 30 480 48 575 72 L628 112 L602 188 C570 235 520 270 450 286 C365 306 265 296 188 274 C130 258 92 226 72 180 Z", tone: "soft" },
  { shape: "path", d: "M72 180 C150 205 240 214 325 207 C410 201 502 190 602 188", tone: "accent" },
  { shape: "path", d: "M78 204 C165 230 255 239 338 231 C425 223 520 211 612 207", tone: "muted" },
  { shape: "path", d: "M82 227 C170 253 263 262 350 254 C438 246 530 235 619 230", tone: "muted" },
  { shape: "text", x: 330, y: 112, content: "Côte d’Ivoire", anchor: "middle" },
  { shape: "text", x: 355, y: 345, content: "Océan Atlantique — domaine offshore", anchor: "middle" },
  { shape: "circle", cx: 126, cy: 202, r: 7, tone: "accent" },
  { shape: "circle", cx: 335, cy: 207, r: 7, tone: "accent" },
  { shape: "circle", cx: 444, cy: 201, r: 7, tone: "accent" },
  { shape: "circle", cx: 548, cy: 193, r: 7, tone: "accent" },
];

const basinHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "sassandra", number: 1, label: "Sassandra", x: 126, y: 202, detail: "Le document fait commencer vers Sassandra la bande sédimentaire côtière terrestre. Ce repère indique une limite pédagogique, pas un gisement unique." },
  { id: "jacqueville", number: 2, label: "Jacqueville", x: 335, y: 207, detail: "La carte scolaire situe plusieurs anciens champs au large de Jacqueville. Ils appartiennent au bassin sédimentaire ivoirien offshore." },
  { id: "abidjan", number: 3, label: "Abidjan", x: 444, y: 201, detail: "Abidjan est un repère côtier ; un bloc pétrolier ou un champ se situe en mer par des coordonnées et ne se confond pas avec la ville voisine." },
  { id: "assouinde", number: 4, label: "Assouindé / sud-est", x: 548, y: 193, detail: "Le champ Baleine, au large d’Assouindé, rappelle que le sud-est offshore contient aujourd’hui pétrole et gaz : la carte du support n’est pas un inventaire actuel exhaustif." },
  { id: "offshore", number: 5, label: "Bassin offshore", x: 410, y: 266, detail: "La plus grande partie de l’exploration représentée se trouve sous la mer, dans des séries sédimentaires du plateau continental jusqu’aux eaux profondes." },
];

const anticlineShapes: SchemaShape[] = [
  { shape: "path", d: "M70 330 Q360 42 650 330 L650 366 Q360 92 70 366 Z", tone: "fill" },
  { shape: "path", d: "M95 335 Q360 105 625 335 L625 392 Q360 168 95 392 Z", tone: "soft" },
  { shape: "path", d: "M155 337 Q360 170 565 337 L540 358 Q360 220 180 358 Z", tone: "accent" },
  { shape: "path", d: "M180 358 Q360 220 540 358 L516 380 Q360 274 204 380 Z", tone: "fill" },
  { shape: "path", d: "M204 380 Q360 274 516 380 L493 407 Q360 328 227 407 Z", tone: "muted" },
  { shape: "line", x1: 360, y1: 28, x2: 360, y2: 210, tone: "accent" },
  { shape: "text", x: 360, y: 24, content: "Puits", anchor: "middle" },
  { shape: "text", x: 360, y: 200, content: "gaz", anchor: "middle" },
  { shape: "text", x: 360, y: 257, content: "pétrole", anchor: "middle" },
  { shape: "text", x: 360, y: 318, content: "eau", anchor: "middle" },
];

const anticlineHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "seal", number: 1, label: "Roche couverture", x: 124, y: 300, detail: "Couche peu perméable qui ferme le piège et freine la remontée des hydrocarbures." },
  { id: "gas", number: 2, label: "Gaz", x: 360, y: 183, detail: "Le gaz, moins dense, occupe normalement la partie la plus haute du piège." },
  { id: "oil", number: 3, label: "Pétrole", x: 360, y: 243, detail: "Le pétrole se place sous le gaz et au-dessus de l’eau dans les pores du réservoir." },
  { id: "water", number: 4, label: "Eau de formation", x: 360, y: 304, detail: "L’eau, plus dense, occupe la partie basse de la roche réservoir." },
  { id: "reservoir", number: 5, label: "Roche réservoir", x: 590, y: 350, detail: "Roche poreuse et suffisamment perméable contenant les fluides ; elle n’est ni une cavité vide ni une citerne souterraine." },
];

const missionShapes: SchemaShape[] = [
  { shape: "path", d: "M40 145 Q210 22 380 145 T720 145", tone: "soft" },
  { shape: "path", d: "M40 190 Q210 62 380 190 T720 190", tone: "fill" },
  { shape: "path", d: "M40 242 Q210 110 380 242 T720 242", tone: "soft" },
  { shape: "path", d: "M40 294 Q210 164 380 294 T720 294", tone: "muted" },
  { shape: "path", d: "M112 171 Q210 92 308 171 L294 190 Q210 126 126 190 Z", tone: "accent" },
  { shape: "path", d: "M126 190 Q210 126 294 190 L282 216 Q210 166 138 216 Z", tone: "fill" },
  { shape: "line", x1: 184, y1: 32, x2: 184, y2: 156, tone: "accent" },
  { shape: "line", x1: 238, y1: 32, x2: 238, y2: 201, tone: "accent" },
  { shape: "text", x: 184, y: 25, content: "Puits A", anchor: "middle" },
  { shape: "text", x: 238, y: 25, content: "Puits B", anchor: "middle" },
  { shape: "text", x: 210, y: 142, content: "gaz", anchor: "middle" },
  { shape: "text", x: 210, y: 191, content: "pétrole", anchor: "middle" },
];

const missionHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "mission-seal", number: 1, label: "Roche couverture", x: 520, y: 132, detail: "Couche imperméable plissée qui ferme le piège structural. La légende du support doit être comprise comme roche couverture, pas roche mère." },
  { id: "mission-reservoir", number: 2, label: "Roche réservoir", x: 650, y: 220, detail: "Couche poreuse et perméable où migrent puis s’accumulent gaz, pétrole et eau." },
  { id: "mission-source", number: 3, label: "Roche mère", x: 560, y: 300, detail: "Couche riche en matière organique ayant produit les hydrocarbures après enfouissement et maturation." },
  { id: "well-a", number: 4, label: "Puits A : gaz", x: 184, y: 92, detail: "Le puits A atteint la partie sommitale du réservoir, occupée par le gaz moins dense." },
  { id: "well-b", number: 5, label: "Puits B : pétrole", x: 238, y: 115, detail: "Le puits B descend dans la zone pétrolifère située sous le gaz et au-dessus de l’eau." },
];

const levels: LevelSeed[] = [
  {
    id: "ivorian-sedimentary-basin-location",
    title: "Localiser le bassin pétrolier ivoirien",
    summary: "Lire la carte du support sans confondre côte, bassin sédimentaire, bloc d’exploration et gisement.",
    pages: "1-2",
    section: "Localisation des gisements pétrolifères en Côte d’Ivoire",
    durationMinutes: 15,
    xp: 45,
    body: `
## Ce que montre réellement la carte

Les gisements d’hydrocarbures ivoiriens appartiennent au **bassin sédimentaire côtier**, prolongé sous l’océan Atlantique. Le document distingue deux domaines :

| Domaine | Position | Idée essentielle |
|---|---|---|
| terrestre ou onshore | bande côtière au sud | des couches sédimentaires existent sous les terres ; elles peuvent être explorées |
| marin ou offshore | sous la mer, du plateau continental aux eaux profondes | une grande partie des champs et des blocs pétroliers se trouve en mer |

Le support cite surtout **Jacqueville** et **Grand-Bassam** et présente une bande terrestre allant de Sassandra à la frontière ivoiro-ghanéenne. Ces repères aident à lire la carte, mais ils ne doivent pas être récités comme un inventaire définitif. Un **bassin** est une vaste zone d’accumulation de sédiments ; un **bloc** est un périmètre administratif d’exploration ; un **champ** ou gisement est une accumulation découverte et délimitée.

## Une carte scolaire datée n’est pas une photographie du présent

La page 2 affirme que Grand-Bassam fournirait « exclusivement le gaz ». Cette formule n’est plus défendable comme vérité générale. Le ministère ivoirien décrit aujourd’hui un bassin comprenant des blocs onshore, offshore peu profond et offshore profond. Il indique aussi que le champ **Baleine**, au large d’Assouindé dans le sud-est, produit du pétrole brut et du gaz naturel. La bonne connaissance à retenir est donc : **le sud du pays possède un bassin sédimentaire où plusieurs secteurs offshore renferment du pétrole et/ou du gaz**.

- [Présentation officielle du secteur pétrole et gaz](https://energie.gouv.ci/petrole/petrole-et-gaz)
- [Démarrage officiel du champ Baleine](https://www.energie.gouv.ci/actualite/demarrage-de-la-production-du-champ-baleine)

> **Précision :** la largeur de 30 km attribuée au plateau continental dans le support est un repère simplifié. Le bassin exploré moderne dépasse cette bande et atteint les eaux profondes.

> **Astuce mémoire — B-B-G :** **B**assin = domaine géologique ; **B**loc = permis ; **G**isement = accumulation démontrée.
`,
    keyPoint: "Les hydrocarbures ivoiriens sont recherchés dans le bassin sédimentaire côtier, surtout offshore ; bassin, bloc et gisement ne sont pas synonymes.",
    example: "Dire « le bloc CI-101 contient le champ Baleine dans le bassin sédimentaire ivoirien » emploie correctement les trois échelles.",
    methodSteps: [
      "Repère d’abord le littoral et le domaine sédimentaire.",
      "Distingue la bande terrestre du prolongement marin.",
      "Utilise les villes seulement comme repères, sans placer un champ dans la ville.",
      "Distingue bassin géologique, bloc administratif et gisement découvert.",
      "Date toute information qui prétend dresser une liste actuelle de champs.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Croquis original",
      title: "Parcourir le littoral sédimentaire ivoirien",
      instruction: "Sélectionne les cinq repères du croquis pour passer de la côte au domaine offshore.",
      viewBox: "0 0 700 390",
      caption: "Croquis pédagogique original, non cartographique et non à l’échelle, inspiré de la page 2 ; aucun scan n’est intégré.",
      shapes: basinShapes,
      hotspots: basinHotspots,
      observation: "La carte du support localise un domaine sédimentaire ; elle ne permet ni de fixer les limites exactes des blocs actuels ni de conclure qu’une localité ne contient qu’un seul type d’hydrocarbure.",
    },
    questions: [
      choice("Dans quel ensemble géologique se trouvent les principaux gisements ivoiriens du cours ?", ["Le bassin sédimentaire côtier", "Le socle cristallin du nord uniquement", "Une chaîne volcanique récente", "Le bassin du Niger intérieur"], 0, "Le cours relie les hydrocarbures aux séries sédimentaires du sud.", "Analyse de la carte • page 2"),
      choice("Que désigne un bloc pétrolier ?", ["Une roche réservoir isolée", "Un périmètre administratif d’exploration ou d’exploitation", "Une ville côtière", "Une poche de gaz pure"], 1, "Un bloc organise les droits d’exploration ; il peut contenir zéro, un ou plusieurs prospects et champs."),
      choice("Quel domaine prolonge le bassin sous l’océan ?", ["Le domaine désertique", "Le socle archéen", "Le domaine offshore", "La haute montagne"], 2, "Offshore signifie en mer."),
      choice("Quelle phrase est scientifiquement prudente ?", ["Toute la Côte d’Ivoire contient du pétrole", "Grand-Bassam ne contiendra jamais de pétrole", "Chaque bloc est déjà un gisement", "La carte scolaire donne des repères historiques, pas un inventaire actuel exhaustif"], 3, "Les découvertes et les périmètres évoluent ; il faut dater la carte."),
      trueFalse("Un bassin sédimentaire et un gisement sont exactement la même chose.", false, "Le bassin est vaste ; le gisement est une accumulation localisée dans ce bassin."),
      choice("Quel couple distingue correctement les deux domaines ?", ["onshore = terrestre ; offshore = marin", "onshore = gaz ; offshore = pétrole", "onshore = ancien ; offshore = futur", "onshore = imperméable ; offshore = poreux"], 0, "Les termes décrivent une position par rapport au rivage."),
      choice("Pourquoi le socle du nord n’est-il pas le domaine principal de cette leçon ?", ["Il est toujours liquide", "Le système étudié exige surtout de puissantes séries sédimentaires riches en matière organique", "Il ne contient aucune roche", "Il est sous l’océan"], 1, "La genèse et le piégeage décrits se déroulent dans un bassin sédimentaire."),
      choice("Quelle information récente corrige l’idée d’une zone sud-est exclusivement gazière ?", ["L’absence de toute exploration", "La disparition du bassin", "La production de pétrole et de gaz du champ Baleine", "La transformation du pétrole en charbon"], 2, "Baleine est officiellement décrit comme un champ pétrolier et gazier du sud-est offshore."),
      choice("Que faut-il faire d’une largeur unique de 30 km donnée pour le plateau continental ?", ["La transformer en loi mondiale", "L’appliquer à tous les littoraux", "La confondre avec la profondeur", "La traiter comme un repère simplifié du support"], 3, "La largeur réelle varie et l’exploration s’étend en eaux profondes."),
      short("Écris le mot qui signifie « en mer » dans le vocabulaire pétrolier.", ["offshore", "off shore"], "Le domaine marin est appelé offshore.", "Analyse de la carte • page 2"),
    ],
    corrections: [
      "La couverture interne annonce « Leçon 1 » alors que le fichier transmis et le catalogue Terminale C placent ce contenu en leçon 9.",
      "La carte de la page 2 est traitée comme une carte scolaire historique et non comme l’inventaire actuel exhaustif des champs ou blocs.",
      "La formule « Grand-Bassam exclusivement gaz » est contextualisée : le champ Baleine, au large d’Assouindé dans le sud-est, produit officiellement pétrole et gaz.",
      "La largeur de 30 km du plateau continental est présentée comme une simplification locale du support, non comme une limite du bassin offshore moderne.",
    ],
  },
  {
    id: "source-reservoir-seal-rocks",
    title: "Attribuer un rôle à chaque roche",
    summary: "Distinguer roche mère, roche réservoir et roche couverture par leur fonction, leur porosité et leur perméabilité.",
    pages: "2-4",
    section: "Roches du bassin, migration et accumulation",
    durationMinutes: 16,
    xp: 55,
    body: `
## Trois fonctions, pas trois noms interchangeables

Un gisement ne dépend pas d’une seule « roche à pétrole ». Il résulte d’un **système pétrolier** dans lequel plusieurs roches jouent des rôles complémentaires.

| Élément | Propriété décisive | Fonction |
|---|---|---|
| roche mère | riche en matière organique enfouie et maturée | produit les hydrocarbures |
| roche réservoir ou roche magasin | poreuse et suffisamment perméable | reçoit, laisse circuler et stocke les fluides |
| roche couverture | très peu perméable | freine la fuite verticale et ferme le piège |
| piège | géométrie fermée ou terminaison de couche | concentre les hydrocarbures dans une partie du réservoir |

La **porosité** mesure la place disponible dans les pores. La **perméabilité** traduit leur connexion et donc la possibilité de circulation. Une roche peut être poreuse mais peu perméable si ses pores sont très fins ou mal reliés. Une argile peut ainsi contenir beaucoup de micropores tout en laissant très difficilement circuler les fluides.

## Corriger le mot « encaissante »

Le support regroupe sable, grès et argile parmi les « roches encaissantes ». Le terme reste trop vague pour résoudre un exercice. Un **grès poreux et perméable** peut jouer le rôle de réservoir ; une **argile riche en matière organique** peut être roche mère ; une argile très peu perméable peut aussi servir de couverture. C’est donc la **fonction dans le système** qu’il faut nommer.

Un réservoir n’est pas une grotte pleine d’un lac de pétrole. Les fluides occupent les pores microscopiques de la roche, comme l’eau dans une éponge. Pour former un gisement exploitable, il faut en plus un volume, une saturation, une pression et une continuité suffisants.

> **Erreur fréquente :** « imperméable » ne signifie pas qu’aucune molécule ne traversera jamais la roche ; cela signifie ici que le débit est assez faible pour assurer le confinement à l’échelle géologique.

> **Astuce mémoire — M-R-C :** la **M**ère produit, le **R**éservoir reçoit, la **C**ouverture confine.
`,
    keyPoint: "La roche mère produit, la roche réservoir poreuse et perméable stocke, et la roche couverture peu perméable confine les hydrocarbures.",
    example: "Une argile organique profonde peut produire du pétrole, un grès voisin le recevoir et une autre couche argileuse supérieure empêcher sa fuite.",
    methodSteps: [
      "Cherche d’abord si la roche produit, reçoit ou bloque les hydrocarbures.",
      "Distingue porosité, qui offre du volume, et perméabilité, qui permet la circulation.",
      "Nomme roche mère, réservoir et couverture dans cet ordre fonctionnel.",
      "Ajoute la géométrie du piège pour expliquer l’accumulation.",
      "Évite l’image d’une cavité vide : parle de pores remplis de fluides.",
    ],
    interaction: diagram(
      "Construire un système pétrolier complet",
      "Ouvre chaque carte et relie propriété de la roche, mouvement du fluide et fonction géologique.",
      "Gisement d’hydrocarbures",
      "Une accumulation exploitable exige une source, un chemin de migration, un réservoir, une fermeture et une conservation suffisante.",
      [
        { id: "organic-source", label: "Roche mère", role: "Produire", detail: "Sédiment fin enrichi en matière organique ; l’enfouissement et la maturation y engendrent pétrole et gaz." },
        { id: "migration-route", label: "Voie de migration", role: "Transférer", detail: "Pores, couches perméables et parfois fractures permettent aux hydrocarbures de quitter la roche mère." },
        { id: "porous-reservoir", label: "Roche réservoir", role: "Recevoir et stocker", detail: "La porosité fournit le volume ; la perméabilité relie les pores et autorise les écoulements." },
        { id: "impermeable-seal", label: "Roche couverture", role: "Confiner", detail: "Une couche à très faible perméabilité ferme le réservoir vers le haut." },
        { id: "geometric-trap", label: "Piège", role: "Concentrer", detail: "Un pli, une faille ou une variation de couche crée une fermeture dans laquelle les fluides s’accumulent." },
        { id: "preservation", label: "Conservation", role: "Maintenir", detail: "Le piège et la couverture doivent rester efficaces assez longtemps ; sinon les hydrocarbures s’échappent." },
      ],
      "Une bonne roche réservoir sans roche mère ne reçoit rien ; une source et un réservoir sans couverture peuvent perdre les hydrocarbures.",
    ),
    questions: [
      choice("Quelle roche produit les hydrocarbures après maturation ?", ["La roche mère", "La roche couverture", "Le socle sain", "Le minerai de fer"], 0, "La matière organique est transformée dans la roche mère."),
      choice("Quelle propriété décrit le volume des vides d’une roche ?", ["La densité", "La porosité", "La couleur", "La dureté seulement"], 1, "La porosité mesure la fraction de volume occupée par les pores."),
      choice("Quelle roche doit être poreuse et suffisamment perméable ?", ["La couverture", "Le socle", "La roche réservoir", "Le magma"], 2, "Le réservoir doit recevoir et laisser circuler les fluides."),
      choice("Quel élément ferme le piège vers le haut ?", ["Une source chaude", "Une couche très poreuse", "Une rivière", "Une roche couverture peu perméable"], 3, "La couverture limite la fuite verticale."),
      trueFalse("Un gisement est nécessairement une grande cavité souterraine vide remplie de pétrole.", false, "Les hydrocarbures occupent surtout les pores d’une roche réservoir."),
      choice("Quelle association est correcte ?", ["mère-produit ; réservoir-stocke ; couverture-confine", "mère-confine ; réservoir-produit ; couverture-stocke", "mère-stocke seulement ; réservoir-bloque ; couverture-produit", "les trois termes sont synonymes"], 0, "Chaque terme correspond à une fonction distincte."),
      choice("Pourquoi une argile peut-elle servir de couverture malgré sa porosité ?", ["Elle fond à faible température", "Ses pores très fins sont peu connectés, donc sa perméabilité est faible", "Elle contient toujours du gaz", "Elle est obligatoirement fracturée"], 1, "Porosité et perméabilité ne se confondent pas."),
      choice("Dans quel cas un grès joue-t-il bien le rôle de réservoir ?", ["S’il est totalement compact sans pores", "S’il produit du magma", "S’il possède des pores connectés", "S’il dissout la couverture"], 2, "Des pores connectés autorisent stockage et circulation."),
      choice("Quel terme du support est trop vague pour attribuer une fonction précise ?", ["bassin", "offshore", "migration", "roche encaissante"], 3, "Il faut préciser mère, réservoir ou couverture."),
      short("Écris le nom de la propriété qui décrit la connexion des pores et la circulation des fluides.", ["perméabilité", "permeabilite", "la perméabilité"], "La perméabilité gouverne la facilité d’écoulement."),
    ],
    corrections: [
      "Le terme général « roches encaissantes » de la page 2 est remplacé par les fonctions précises roche mère, roche réservoir et roche couverture.",
      "Le sable, le grès et l’argile ne sont pas présentés comme des réservoirs équivalents : porosité et perméabilité déterminent leur rôle.",
      "Le gisement est décrit comme des fluides occupant les pores d’une roche et non comme une cavité souterraine vide.",
    ],
  },
  {
    id: "organic-deposition-kerogen",
    title: "Du dépôt organique au kérogène",
    summary: "Expliquer comment une matière organique préservée, enfouie avec les sédiments, devient du kérogène dans une roche mère.",
    pages: "3",
    section: "Dépôt de matière organique et formation du kérogène",
    durationMinutes: 16,
    xp: 60,
    body: `
## Première condition : accumuler et préserver la matière organique

La matière à l’origine de nombreux hydrocarbures provient surtout d’organismes microscopiques, d’algues, de plancton et de débris végétaux transportés vers un bassin lacustre ou marin. Après leur mort, ces restes se déposent avec des particules minérales fines.

Une forte production biologique ne suffit pas. Si le fond est très oxygéné, une grande partie de la matière organique est respirée ou décomposée jusqu’au dioxyde de carbone. Sa conservation est favorisée par un enfouissement rapide et un milieu pauvre en dioxygène, appelé **milieu réducteur** ou anoxique.

## Diagenèse et kérogène

Les nouvelles couches compriment les dépôts plus anciens. À faible profondeur relative, des transformations physiques, chimiques et microbiennes transforment le sédiment en roche et la matière organique dispersée en un matériau macromoléculaire insoluble : le **kérogène**.

| Étape | Transformation dominante | Produit |
|---|---|---|
| dépôt | mélange de débris organiques, boues et eau | sédiment organique |
| préservation | manque d’oxygène et enfouissement rapide | dégradation limitée |
| compaction | expulsion d’une partie de l’eau et rapprochement des grains | sédiment consolidé |
| diagenèse | action microbienne et réactions à basse température | kérogène dans la roche mère |

Le kérogène **n’est pas encore le pétrole du gisement**. Il est le précurseur solide qui pourra produire pétrole et gaz si l’enfouissement fournit une maturation thermique suffisante pendant une longue durée.

> **Précision :** le dessin du support montre des « organismes animaux et végétaux ». Cette représentation résume la matière organique ; elle ne signifie pas que les gisements proviennent principalement de grands animaux entiers.

> **Astuce mémoire — D-P-K :** **D**épôt, **P**réservation, **K**érogène.
`,
    keyPoint: "Des débris organiques préservés en milieu pauvre en dioxygène sont enfouis avec les sédiments puis transformés par diagenèse en kérogène dans la roche mère.",
    example: "Un fond marin riche en plancton, peu oxygéné et rapidement recouvert conserve davantage de matière organique qu’un fond brassé et oxygéné.",
    methodSteps: [
      "Nomme l’origine organique et le milieu de dépôt.",
      "Explique pourquoi le manque de dioxygène favorise la préservation.",
      "Ajoute l’enfouissement, la compaction et la diagenèse.",
      "Place le kérogène dans la roche mère.",
      "Précise que le kérogène précède pétrole et gaz.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Chronologie géologique",
      title: "Former une roche mère riche en kérogène",
      instruction: "Parcours les étapes du milieu vivant jusqu’au précurseur solide des hydrocarbures.",
      items: [
        { label: "Production biologique", shortLabel: "Organismes", detail: "Plancton, algues et autres organismes fournissent de la matière organique au bassin." },
        { label: "Dépôt avec les sédiments", shortLabel: "Dépôt", detail: "Les restes organiques se mélangent aux boues minérales sur le fond." },
        { label: "Milieu pauvre en dioxygène", shortLabel: "Préservation", detail: "La dégradation complète est limitée ; une fraction organique échappe au recyclage rapide." },
        { label: "Enfouissement et compaction", shortLabel: "Enfouissement", detail: "De nouvelles couches augmentent la pression, expulsent de l’eau et consolident le sédiment." },
        { label: "Diagenèse", shortLabel: "Kérogène", detail: "Les transformations microbiennes et chimiques produisent du kérogène dispersé dans la roche mère." },
      ],
      observation: "Sans conservation initiale, l’enfouissement chauffe surtout une roche pauvre en matière organique et ne construit pas une source pétrolière efficace.",
    },
    questions: [
      choice("Quel matériau solide précède la formation du pétrole et du gaz ?", ["Le kérogène", "Le granite", "Le quartz pur", "Le sel marin uniquement"], 0, "Le kérogène est le précurseur organique de la roche mère.", "Interprétation • page 3"),
      choice("Quel milieu favorise la conservation de matière organique ?", ["Un milieu toujours très oxygéné", "Un fond pauvre en dioxygène rapidement enfoui", "Une lave en fusion", "Un sommet érodé"], 1, "Une faible oxygénation limite la dégradation complète."),
      choice("Dans quelle roche trouve-t-on le kérogène producteur ?", ["La couverture uniquement", "Le socle cristallin obligatoire", "La roche mère", "La cheminée du puits"], 2, "Le kérogène est dispersé dans la roche mère."),
      choice("Quel enchaînement est correct ?", ["gaz → organisme → kérogène", "pétrole → dioxygène → dépôt", "couverture → magma → pétrole", "matière organique → kérogène → hydrocarbures"], 3, "Le kérogène est intermédiaire entre matière organique et pétrole/gaz."),
      trueFalse("Le kérogène est déjà un lac souterrain de pétrole liquide.", false, "C’est une matière organique solide et insoluble dispersée dans la roche mère."),
      choice("Quel groupe fournit souvent une part importante de la matière organique marine ?", ["Le plancton et les algues", "Les cristaux de quartz", "Le fer métallique", "Les nuages"], 0, "Les organismes microscopiques contribuent fortement aux sédiments organiques."),
      choice("Que produit la compaction des sédiments ?", ["Une arrivée massive d’oxygène", "L’expulsion d’eau et le rapprochement des grains", "La disparition de toute pression", "Une fusion immédiate"], 1, "La charge des couches supérieures compacte les dépôts."),
      choice("Comment nomme-t-on les transformations précoces qui forment le kérogène ?", ["Fusion", "Photosynthèse", "Diagenèse", "Cristallisation magmatique"], 2, "La diagenèse intervient avant la maturation thermique profonde."),
      choice("Pourquoi une forte production biologique ne suffit-elle pas ?", ["Le bassin doit être volcanique", "Il faut supprimer les sédiments", "Le pétrole se forme en surface", "La matière doit aussi être préservée de la dégradation complète"], 3, "Production et préservation sont deux conditions distinctes."),
      short("Écris le terme qui signifie « milieu sans dioxygène ».", ["anoxique", "milieu anoxique", "anaérobie", "milieu anaérobie"], "Un milieu anoxique est dépourvu de dioxygène disponible."),
    ],
    corrections: [
      "Le dessin général « organismes animaux et végétaux » est précisé par le rôle fréquent du plancton, des algues et des microorganismes, sans inventer une origine par de grands animaux entiers.",
      "La conservation en milieu pauvre en dioxygène et l’enfouissement rapide sont explicités ; l’action de bactéries anaérobies ne suffit pas seule à expliquer une roche mère riche.",
      "Le kérogène est distingué du pétrole liquide et replacé dans la diagenèse de la roche mère.",
    ],
  },
  {
    id: "thermal-maturation-hydrocarbons",
    title: "Transformer le kérogène en hydrocarbures",
    summary: "Relier durée, enfouissement et température à la maturation thermique qui produit successivement pétrole et gaz.",
    pages: "3-4",
    section: "Formation des hydrocarbures par maturation du kérogène",
    durationMinutes: 17,
    xp: 70,
    body: `
## L’enfouissement fournit de la chaleur pendant très longtemps

À mesure que le bassin s’enfonce et reçoit de nouveaux sédiments, la température et la pression augmentent. Le kérogène de la roche mère subit alors une **maturation thermique**. La durée compte autant que la température : il s’agit d’un processus géologique qui se déroule sur des millions d’années.

La transformation n’est pas instantanée et ne produit pas toujours le même fluide.

| Maturité relative | Transformation dominante | Produit principal du modèle scolaire |
|---|---|---|
| faible | diagenèse, kérogène encore immature | peu d’hydrocarbures mobiles |
| suffisante | craquage thermique progressif du kérogène | davantage de pétrole liquide |
| plus élevée | craquage du kérogène et d’une partie du pétrole | proportion de gaz croissante |
| excessive | surmaturation | hydrocarbures légers puis résidu carboné |

On parle souvent de **fenêtre à huile** puis de **fenêtre à gaz**. Ces expressions désignent des domaines de maturité et non deux couches fixes identiques dans tous les bassins. Leur profondeur varie avec le gradient géothermique, la durée d’enfouissement et la nature du kérogène.

## Ce que signifie le craquage thermique

Le support écrit que le kérogène « perd l’azote et l’oxygène » puis qu’il « ne reste que des carbones et des hydrogènes ». Cette phrase donne une intuition, mais elle est chimiquement trop absolue. Le **craquage** rompt et réorganise de grandes structures organiques en molécules plus petites. Le pétrole est un mélange complexe d’hydrocarbures et contient aussi de faibles proportions de composés soufrés, azotés ou oxygénés.

La pression accompagne l’enfouissement et intervient dans l’expulsion des fluides, mais la maturation organique est gouvernée surtout par l’histoire **temps–température**. Une roche très chaude trop peu de temps et une roche moins chaude très longtemps peuvent connaître des maturités différentes.

> **Erreur fréquente :** le pétrole ne se forme pas par fusion de cadavres ; il résulte de transformations moléculaires d’une matière organique dispersée.

> **Astuce mémoire — K-H :** le **K**érogène chauffé donne des **H**ydrocarbures.
`,
    keyPoint: "L’histoire temps–température de la roche mère fait mûrir puis craquer le kérogène : une maturité suffisante produit surtout du pétrole, une maturité plus forte favorise le gaz.",
    example: "Deux roches mères à la même profondeur peuvent être différemment matures si leur gradient géothermique ou leur durée d’enfouissement diffère.",
    methodSteps: [
      "Pars du kérogène déjà formé dans la roche mère.",
      "Relie l’enfouissement à l’augmentation de température sur une longue durée.",
      "Nomme maturation puis craquage thermique.",
      "Distingue domaine favorable au pétrole et domaine plus mature favorable au gaz.",
      "Évite toute profondeur universelle sans données sur le bassin.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Thermomètre géologique",
      title: "Suivre la maturation de la roche mère",
      instruction: "Parcours les cinq états et observe comment le produit dominant change avec la maturité.",
      items: [
        { label: "Sédiment organique", shortLabel: "Dépôt", detail: "La matière organique vient d’être enfouie ; aucune accumulation pétrolière n’existe encore." },
        { label: "Kérogène immature", shortLabel: "Diagenèse", detail: "La diagenèse forme le précurseur solide, mais la maturation est encore insuffisante." },
        { label: "Maturation à huile", shortLabel: "Pétrole", detail: "Le craquage du kérogène génère une proportion importante de molécules liquides." },
        { label: "Maturation plus poussée", shortLabel: "Gaz", detail: "Des molécules plus petites et gazeuses deviennent relativement plus abondantes." },
        { label: "Surmaturation", shortLabel: "Résidu", detail: "Une histoire thermique excessive peut dégrader une partie du potentiel pétrolier et laisser un résidu carboné." },
      ],
      observation: "La profondeur seule ne suffit pas : le type de kérogène, le temps d’enfouissement et le gradient géothermique contrôlent la maturité.",
    },
    questions: [
      choice("Quel facteur pilote principalement la maturation avec la durée ?", ["La température", "La couleur de la roche", "La latitude seule", "La marée quotidienne"], 0, "La maturité dépend fortement de l’histoire temps–température."),
      choice("Comment nomme-t-on la rupture thermique de grandes structures organiques ?", ["Compaction", "Craquage thermique", "Photosynthèse", "Érosion"], 1, "Le craquage produit des molécules organiques plus petites.", "Formation des hydrocarbures • pages 3-4"),
      choice("Que produit surtout une maturité plus poussée dans le modèle scolaire ?", ["Du granite", "De l’oxygène pur", "Une proportion croissante de gaz", "Du minerai de fer"], 2, "Les produits légers deviennent plus abondants lorsque la maturation progresse."),
      choice("Quelle proposition décrit correctement une fenêtre à huile ?", ["Une cavité vitrée", "Une couche toujours située à 2 km", "Un permis administratif", "Un domaine de maturité favorable à la génération de pétrole"], 3, "La fenêtre dépend de l’histoire thermique du bassin."),
      trueFalse("Une profondeur unique permet de fixer la fenêtre à huile dans tous les bassins du monde.", false, "Le gradient géothermique, le temps et la nature du kérogène varient."),
      choice("Quel matériau subit d’abord la maturation pétrolière ?", ["Le kérogène", "La roche couverture uniquement", "L’eau de mer pure", "Le tubage du puits"], 0, "Le kérogène est le précurseur contenu dans la roche mère."),
      choice("Pourquoi la phrase « il ne reste que carbone et hydrogène » est-elle trop absolue ?", ["Le pétrole ne contient jamais de carbone", "Le pétrole réel peut aussi contenir de faibles proportions de composés soufrés, azotés ou oxygénés", "Le gaz est uniquement de l’eau", "Le kérogène est un minéral pur"], 1, "Le pétrole est un mélange organique complexe."),
      choice("Quel couple doit figurer dans une explication rigoureuse de la maturité ?", ["couleur–altitude", "ville–frontière", "temps–température", "marée–vent"], 2, "La maturation intègre l’intensité thermique et sa durée."),
      choice("Que peut provoquer une surmaturation ?", ["Une création illimitée d’huile", "Un retour aux organismes vivants", "La formation immédiate d’une couverture", "La dégradation du potentiel liquide et un résidu plus carboné"], 3, "Une maturité excessive ne produit pas indéfiniment plus de pétrole."),
      short("Écris le nom du précurseur solide qui mûrit dans la roche mère.", ["kérogène", "kerogene", "le kérogène"], "Le kérogène est transformé thermiquement en hydrocarbures."),
    ],
    corrections: [
      "La pyrolyse du support est reformulée comme une maturation et un craquage progressifs gouvernés par l’histoire temps–température.",
      "L’affirmation selon laquelle il ne resterait « que des carbones et des hydrogènes » est nuancée : les mélanges pétroliers réels conservent aussi des hétéroatomes en faibles proportions.",
      "Les fenêtres à huile et à gaz sont présentées comme des domaines de maturité variables, sans profondeur universelle inventée.",
    ],
  },
  {
    id: "primary-secondary-migration",
    title: "Suivre les migrations des hydrocarbures",
    summary: "Distinguer l’expulsion hors de la roche mère de la circulation ultérieure dans les couches perméables.",
    pages: "4",
    section: "Migration primaire et migration secondaire",
    durationMinutes: 16,
    xp: 75,
    body: `
## Pourquoi les hydrocarbures quittent-ils la roche mère ?

La roche mère est souvent fine et peu perméable. Les molécules générées y augmentent le volume des fluides et la pression interne ; des pores connectés, des microfractures ou des contacts avec une couche perméable permettent leur **expulsion**. Le passage de la roche mère vers une roche conductrice voisine est appelé **migration primaire**.

Une fois dans une couche poreuse et perméable, les hydrocarbures se déplacent sur des distances parfois importantes : c’est la **migration secondaire**. Ils empruntent une roche porteuse ou le futur réservoir, guidés par les différences de pression, la flottabilité et la géométrie des couches.

| Migration | Départ | Trajet dominant | Arrivée possible |
|---|---|---|---|
| primaire | roche mère | sortie de la matrice fine, microfractures et interfaces | roche poreuse voisine |
| secondaire | roche porteuse ou réservoir | pores connectés et fractures perméables | piège, surface ou fond marin |

## La flottabilité n’agit pas dans le vide

Le pétrole et le gaz sont généralement moins denses que l’eau salée contenue dans les pores. Ils ont donc tendance à gagner les parties hautes d’une couche perméable. Ils ne montent toutefois pas verticalement à travers n’importe quelle roche : ils suivent les **chemins disponibles**. Une faille peut être conductrice ou, au contraire, mettre en contact une roche réservoir avec une couche qui la bouche.

Si aucun piège efficace n’intercepte la migration, les hydrocarbures peuvent atteindre la surface, se disperser, être biodégradés ou former un indice naturel. Une fuite n’est pas un gisement exploitable.

> **Erreur fréquente :** « primaire » ne signifie pas le premier pétrole produit ; le mot désigne le premier transfert, hors de la roche mère.

> **Astuce mémoire — P sort, S suit :** la migration **P**rimaire fait **sortir** de la mère ; la **S**econdaire **suit** le réservoir.
`,
    keyPoint: "La migration primaire expulse les hydrocarbures de la roche mère vers une roche perméable ; la migration secondaire les fait circuler dans cette roche vers un piège ou une fuite.",
    example: "Une huile quitte une argile mère fracturée, entre dans un grès incliné puis remonte dans ses pores jusqu’à un pli fermé par une couverture.",
    methodSteps: [
      "Identifie le point de départ : roche mère ou roche perméable.",
      "Nomme primaire pour la sortie de la mère.",
      "Nomme secondaire pour le trajet dans le réseau poreux.",
      "Ajoute flottabilité, pression et géométrie comme moteurs ou guides.",
      "Termine par le devenir : piège efficace ou fuite.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Trajet des fluides",
      title: "De la roche mère au piège",
      instruction: "Sélectionne chaque étape et repère la frontière entre migration primaire et secondaire.",
      items: [
        { label: "Génération dans la roche mère", shortLabel: "Source", detail: "Le kérogène mûr produit des fluides dans une roche souvent fine et peu perméable." },
        { label: "Expulsion", shortLabel: "Primaire", detail: "Les hydrocarbures quittent la roche mère par les voies disponibles : c’est la migration primaire." },
        { label: "Entrée dans une roche perméable", shortLabel: "Porteuse", detail: "Un grès ou une autre couche connectée offre un réseau de pores où les fluides circulent mieux." },
        { label: "Remontée dans le réservoir", shortLabel: "Secondaire", detail: "La migration secondaire suit la couche, sous l’effet des gradients de pression et de la flottabilité." },
        { label: "Piège ou fuite", shortLabel: "Destin", detail: "Une fermeture et une couverture donnent une accumulation ; sans elles, les fluides se dispersent." },
      ],
      observation: "Les deux migrations décrivent des portions différentes d’un même transfert ; les confondre fait perdre le rôle spécifique de la roche mère.",
    },
    questions: [
      choice("D’où part la migration primaire ?", ["De la roche mère", "Du réservoir vers le puits uniquement", "De la raffinerie", "De l’atmosphère"], 0, "Elle correspond à l’expulsion hors de la roche mère.", "Migration • page 4"),
      choice("Où se déroule surtout la migration secondaire ?", ["Dans le magma", "Dans une roche poreuse et perméable", "Dans un organisme vivant", "Dans le tubage fermé"], 1, "Elle suit les pores connectés d’une roche porteuse ou réservoir."),
      choice("Quel facteur favorise la remontée relative du pétrole dans l’eau de formation ?", ["Sa radioactivité", "Sa couleur", "Sa flottabilité liée à sa densité plus faible", "La photosynthèse"], 2, "La différence de densité crée une force de flottabilité."),
      choice("Que devient un hydrocarbure sans piège efficace ?", ["Il devient automatiquement exploitable", "Il retourne toujours au kérogène", "Il fabrique une couverture", "Il peut fuir et se disperser"], 3, "La migration seule ne garantit pas l’accumulation."),
      trueFalse("La migration secondaire désigne la circulation des hydrocarbures dans une roche perméable après leur sortie de la roche mère.", true, "C’est la définition utilisée dans le support."),
      choice("Quelle phrase résume la migration primaire ?", ["Sortie de la roche mère vers une voie perméable", "Séparation du pétrole à la raffinerie", "Forage du puits", "Transport par navire"], 0, "Il s’agit d’un processus géologique avant l’exploitation."),
      choice("Pourquoi les fluides ne montent-ils pas verticalement à travers toutes les couches ?", ["Ils n’ont aucune densité", "La circulation dépend de la perméabilité et des chemins connectés", "Ils restent toujours immobiles", "La gravité n’existe pas sous terre"], 1, "Une roche peu perméable peut bloquer ou détourner le trajet."),
      choice("Quel élément peut être conducteur ou étanche selon sa géométrie et ses matériaux ?", ["Une ville", "Une carte", "Une faille", "Un fossile isolé"], 2, "Une faille peut ouvrir un chemin ou juxtaposer des couches qui ferment le réservoir."),
      choice("Quel résultat marque la réussite du trajet pétrolier ?", ["Une dispersion en mer", "Une oxydation complète", "Un retour à la surface sans obstacle", "Une accumulation conservée dans un piège"], 3, "Le gisement exige piégeage et conservation."),
      short("Écris le type de migration qui se déroule à l’intérieur d’une roche poreuse après l’expulsion.", ["migration secondaire", "secondaire", "la migration secondaire"], "La migration secondaire suit la roche porteuse ou réservoir."),
    ],
    corrections: [
      "La migration primaire n’est pas attribuée à la seule pression des sédiments : génération, surpression, microfractures, interfaces et propriétés capillaires sont prises en compte.",
      "La migration secondaire est distinguée du simple classement vertical des fluides dans un piège.",
      "Une fuite vers la surface ou la mer est présentée comme une perte ou un indice, pas comme un gisement exploitable.",
    ],
  },
  {
    id: "fluid-sorting-reservoir-trap",
    title: "Classer gaz, pétrole et eau dans le piège",
    summary: "Expliquer l’accumulation dans les pores du réservoir et l’ordre vertical des fluides sous une couverture étanche.",
    pages: "3-5",
    section: "Accumulation et séparation des fluides dans un piège",
    durationMinutes: 16,
    xp: 85,
    body: `
## L’accumulation exige une fermeture

Lorsque la migration secondaire rencontre une géométrie fermée surmontée d’une roche couverture peu perméable, les hydrocarbures cessent de poursuivre librement leur remontée. Ils s’accumulent dans les pores de la **roche réservoir**. L’ensemble réservoir + fermeture + couverture constitue le piège.

Dans le modèle simple du cours, les fluides se rangent suivant leur densité moyenne :

$$\\rho_{gaz} < \\rho_{pétrole} < \\rho_{eau}$$

Le **gaz** occupe la partie sommitale, le **pétrole** se place en dessous et l’**eau de formation** reste dans la partie basse. Les limites sont appelées contact gaz–huile et contact huile–eau.

| Zone du piège | Fluide dominant | Justification |
|---|---|---|
| sommet | gaz | densité moyenne la plus faible |
| milieu | pétrole | plus dense que le gaz, moins dense que l’eau |
| base | eau de formation | densité moyenne la plus élevée |

## Un modèle à nuancer sans le casser

Les contacts ne sont pas toujours des lignes parfaitement nettes. Les forces capillaires créent des zones de transition ; la composition des fluides, la pression et la taille des pores modifient leur répartition. Mais pour annoter le schéma officiel, l’ordre **gaz – pétrole – eau** reste la réponse attendue.

Le support dit que « l’eau plus dense se dépose d’abord ». Il vaut mieux parler d’une **ségrégation verticale à l’équilibre** : les fluides déjà présents dans les pores se répartissent sous l’effet de la gravité et des forces capillaires. Ils ne tombent pas dans une cuve vide.

Enfin, une couverture efficace ne suffit pas si la structure est ouverte latéralement. La fermeture doit empêcher les hydrocarbures de contourner le sommet du piège.

> **Astuce mémoire — GPE du haut vers le bas :** **G**az, **P**étrole, **E**au.
`,
    keyPoint: "Dans un piège simple, le gaz occupe le sommet, le pétrole le milieu et l’eau la base des pores du réservoir ; une couverture et une fermeture retiennent l’ensemble.",
    example: "Un puits traversant une fermeture anticlinale peut rencontrer d’abord le gaz, puis l’huile, puis l’eau s’il descend assez profondément dans le réservoir.",
    methodSteps: [
      "Repère la roche réservoir et la couverture.",
      "Vérifie que la structure possède une fermeture.",
      "Classe les fluides du moins dense au plus dense.",
      "Place gaz au sommet, pétrole au milieu et eau à la base.",
      "Précise que les fluides remplissent des pores et que les contacts peuvent être transitionnels.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Coupe originale",
      title: "Explorer un piège anticlinal",
      instruction: "Sélectionne les cinq repères pour identifier la couverture, le réservoir et l’ordre des fluides.",
      viewBox: "0 0 720 450",
      caption: "Coupe pédagogique originale inspirée des pages 3 et 4 ; aucun schéma du PDF n’est republié et les proportions ne sont pas à l’échelle.",
      shapes: anticlineShapes,
      hotspots: anticlineHotspots,
      observation: "Le pétrole et le gaz ne forment pas un lac libre : ils occupent la partie supérieure d’une roche poreuse déjà imbibée d’eau de formation.",
    },
    questions: [
      choice("Quel fluide occupe normalement le sommet d’un piège simple ?", ["Le gaz", "L’eau", "Le pétrole lourd uniquement", "Le sable"], 0, "Le gaz possède la densité moyenne la plus faible.", "Schémas d’accumulation • pages 3-4"),
      choice("Quel fluide se place entre gaz et eau ?", ["Le kérogène solide", "Le pétrole", "La roche couverture", "Le quartz"], 1, "L’huile est plus dense que le gaz et moins dense que l’eau."),
      choice("Où se trouve l’eau de formation ?", ["Toujours au-dessus du gaz", "Dans la couverture uniquement", "Dans la partie basse du réservoir", "Hors du bassin"], 2, "L’eau plus dense occupe la base du piège."),
      choice("Quelle condition s’ajoute à la couverture pour former un piège ?", ["Une source de lumière", "Une ville voisine", "Un forage préalable", "Une fermeture géométrique"], 3, "Sans fermeture, les hydrocarbures peuvent contourner la couverture."),
      trueFalse("Les contacts gaz–huile et huile–eau sont toujours des surfaces mathématiques parfaitement nettes.", false, "Les effets capillaires créent souvent des zones de transition."),
      choice("Quel ordre lit-on du haut vers le bas ?", ["gaz → pétrole → eau", "eau → gaz → pétrole", "pétrole → eau → gaz", "gaz → eau → pétrole"], 0, "C’est l’ordre du modèle scolaire fondé sur la densité."),
      choice("Où les hydrocarbures sont-ils stockés ?", ["Dans une cavité artificielle obligatoire", "Dans les pores connectés de la roche réservoir", "Dans la roche couverture seulement", "Dans l’atmosphère"], 1, "Le réservoir est une roche poreuse et perméable."),
      choice("Quel nom donne-t-on à la limite entre pétrole et eau ?", ["Fenêtre à gaz", "Faille inverse", "Contact huile–eau", "Socle"], 2, "Ce contact sépare les zones dominées par l’huile et l’eau."),
      choice("Quelle reformulation corrige « l’eau se dépose d’abord » ?", ["L’eau est créée après le gaz", "L’eau tombe dans une citerne vide", "Le pétrole détruit l’eau", "Les fluides se ségrègent verticalement dans les pores"], 3, "La séparation se produit dans le réseau poreux sous l’effet de la gravité et de la capillarité."),
      short("Donne les trois fluides dans l’ordre du sommet vers la base.", ["gaz pétrole eau", "gaz, pétrole, eau", "gaz-pétrole-eau", "gaz huile eau", "gaz, huile, eau"], "Le classement attendu est gaz, pétrole puis eau."),
    ],
    corrections: [
      "La phrase « l’eau plus dense se dépose d’abord » est remplacée par une ségrégation gravitaire et capillaire des fluides dans les pores.",
      "Les contacts gaz–huile et huile–eau sont présentés comme des limites pouvant comporter des zones de transition.",
      "Le schéma original conserve l’ordre scolaire gaz–pétrole–eau sans représenter le réservoir comme une cavité vide.",
    ],
  },
  {
    id: "stratigraphic-structural-mixed-traps",
    title: "Reconnaître les trois familles de pièges",
    summary: "Identifier un piège stratigraphique, structural ou mixte à partir de la cause de la fermeture du réservoir.",
    pages: "4-5",
    section: "Pièges stratigraphiques, structuraux et mixtes",
    durationMinutes: 16,
    xp: 95,
    body: `
## Un piège se classe par l’origine de sa fermeture

La migration secondaire ne forme une accumulation que si la couche réservoir est fermée. Le support distingue trois grandes familles.

| Famille | Cause principale | Indices sur une coupe |
|---|---|---|
| stratigraphique | variation du dépôt, de la continuité ou des propriétés de la couche | biseau, disparition latérale, discordance, changement de faciès |
| structural | déformation tectonique postérieure ou contemporaine | pli anticlinal, faille, dôme |
| mixte | combinaison des deux mécanismes | couche en biseau déformée ou fermée contre une faille |

### Le piège stratigraphique

Une couche sableuse poreuse peut s’amincir puis disparaître latéralement dans une roche fine peu perméable. Les hydrocarbures qui remontent dans le sable sont bloqués au **biseau**. Une discordance recouverte par une couverture ou un changement de faciès peut produire le même type de fermeture.

### Le piège structural

Dans un **anticlinal**, les couches sont bombées vers le haut. Le gaz et le pétrole gagnent la voûte du réservoir et sont retenus sous la couverture. Une **faille** peut aussi juxtaposer le réservoir à une roche étanche ; mais une faille ouverte peut au contraire favoriser une fuite. Il faut donc lire les contacts, pas réciter « faille = piège ».

### Le piège mixte

De nombreux gisements réels combinent une architecture sédimentaire et une déformation. Le classement « mixte » est justifié quand aucune des deux composantes ne suffit seule à expliquer la fermeture.

## Correction du schéma officiel

Sur les dessins de la page 4, la couche placée directement au-dessus de l’accumulation est légendée **roche mère**. Dans cette position et pour la fonction décrite, elle doit être lue comme **roche couverture imperméable**. La roche mère se situe ailleurs dans le système et alimente le réservoir par migration.

> **Astuce mémoire — Sédiments, Structure, Somme :** stratigraphique, structural, mixte.
`,
    keyPoint: "Un piège stratigraphique vient d’une variation de couche, un piège structural d’un pli ou d’une faille, et un piège mixte combine stratigraphie et tectonique.",
    example: "Un grès qui disparaît en biseau sous une argile forme un piège stratigraphique ; le même grès bombé dans un anticlinal forme un piège structural.",
    methodSteps: [
      "Repère d’abord la roche réservoir et sa couverture.",
      "Cherche si la fermeture vient d’une variation de dépôt ou d’une déformation.",
      "Nomme stratigraphique pour biseau, discordance ou changement de faciès.",
      "Nomme structural pour pli, dôme ou faille étanche.",
      "Retient mixte si les deux mécanismes coopèrent.",
      "Vérifie que la couche supérieure est une couverture et non la roche mère.",
    ],
    interaction: diagram(
      "Comparer les architectures de pièges",
      "Sélectionne une famille puis justifie-la par la cause exacte de la fermeture.",
      "Piège pétrolier",
      "Une portion de roche réservoir poreuse est fermée vers le haut et latéralement par une architecture qui empêche la poursuite de la migration.",
      [
        { id: "pinchout", label: "Biseau", role: "Stratigraphique", detail: "Le réservoir s’amincit puis disparaît dans une couche peu perméable : la fermeture vient du dépôt." },
        { id: "unconformity", label: "Discordance", role: "Stratigraphique", detail: "Une ancienne couche réservoir tronquée est recouverte par une unité qui assure la fermeture." },
        { id: "facies-change", label: "Changement de faciès", role: "Stratigraphique", detail: "Une couche poreuse passe latéralement à une roche fine peu perméable." },
        { id: "anticline", label: "Anticlinal", role: "Structural", detail: "Le pli crée une voûte fermée où le gaz et le pétrole s’accumulent sous la couverture." },
        { id: "sealing-fault", label: "Faille étanche", role: "Structural", detail: "Le déplacement juxtapose le réservoir à une roche peu perméable ou une zone de faille colmatée." },
        { id: "combined-trap", label: "Faille + biseau", role: "Mixte", detail: "La variation stratigraphique et la déformation contribuent ensemble à la fermeture." },
      ],
      "La forme seule ne suffit pas : la classification dépend du mécanisme qui ferme réellement le trajet des hydrocarbures.",
    ),
    questions: [
      choice("Quel piège résulte d’un biseau de la roche réservoir ?", ["Un piège stratigraphique", "Un piège magmatique", "Un piège biologique", "Un piège artificiel"], 0, "Le biseau provient d’une variation de dépôt ou de faciès.", "Types de pièges • pages 4-5"),
      choice("Quel piège est formé par un anticlinal ?", ["Stratigraphique uniquement", "Structural", "Climatique", "Fluvial"], 1, "L’anticlinal est une déformation tectonique."),
      choice("Comment classer une fermeture due à une faille et à un biseau ?", ["Biologique", "Uniquement thermique", "Mixte", "Sans piège"], 2, "Elle combine structure et stratigraphie."),
      choice("Quelle couche doit surmonter l’accumulation dans les schémas de la page 4 ?", ["La roche mère obligatoire", "Une deuxième roche réservoir ouverte", "Le socle fracturé", "La roche couverture imperméable"], 3, "La fonction représentée est celle du confinement."),
      trueFalse("Toute faille constitue automatiquement un piège étanche.", false, "Une faille peut sceller ou conduire les fluides selon ses propriétés et les couches mises en contact."),
      choice("Quel indice signale un piège structural ?", ["Un pli anticlinal", "La disparition progressive d’un sable sans déformation", "Un changement de granulométrie seul", "Une couche horizontale ouverte"], 0, "Le pli est une structure tectonique."),
      choice("Qu’est-ce qu’un changement de faciès ?", ["Une variation de température du pétrole", "Le passage latéral d’un type de roche à un autre", "La rotation d’un puits", "Le classement des fluides"], 1, "Le faciès traduit les caractères du dépôt et peut modifier porosité et perméabilité."),
      choice("Quel mécanisme crée un piège stratigraphique sans pli ?", ["Une fusion", "Une évaporation du pétrole", "La disparition latérale du réservoir dans une roche étanche", "Le forage"], 2, "La terminaison latérale ferme le chemin perméable."),
      choice("Pourquoi la légende « roche mère » au-dessus du gaz est-elle incohérente ?", ["Une roche mère est toujours liquide", "Le gaz ne peut jamais être sous une roche", "La roche mère doit être dans le puits", "La couche dessinée joue la fonction de couverture"], 3, "La position et le rôle indiquent une roche couverture peu perméable."),
      short("Nomme le pli bombé vers le haut qui peut former un piège structural.", ["anticlinal", "un anticlinal", "pli anticlinal"], "La voûte anticlinale crée une fermeture structurale."),
    ],
    corrections: [
      "Dans les deux schémas de pièges de la page 4, l’étiquette « roche mère » placée au-dessus de l’accumulation est corrigée en « roche couverture imperméable ».",
      "Une faille n’est pas présentée comme étanche par définition : elle peut sceller ou conduire selon sa géométrie et son remplissage.",
      "Les pièges stratigraphiques sont expliqués par biseau, discordance ou changement de faciès plutôt que par le seul mot « stratigraphie » du support.",
    ],
  },
  {
    id: "official-gap-order-exercises",
    title: "Résoudre les exercices officiels 1 et 2",
    summary: "Compléter le texte de migration avec dix termes précis puis remettre quatre étapes de formation dans l’ordre.",
    pages: "5-6",
    section: "Évaluation — exercices 1 et 2",
    durationMinutes: 18,
    xp: 110,
    kind: "practice",
    body: `
## Exercice 1 — reconstruire le raisonnement avant de placer les mots

Le texte à trous ne doit pas être rempli par voisinage grammatical seulement. Il raconte un trajet complet :

1. le pétrole formé dans une roche mère fine subit une **pression** et gagne des **roches poreuses** ;
2. sa sortie de la roche mère est la **migration primaire** ;
3. sa circulation dans la roche poreuse est la **migration secondaire** ;
4. cette roche poreuse est la **roche réservoir** ;
5. sans obstacle, le fluide poursuit sa migration et peut fuir ;
6. une roche **imperméable** l’arrête ; il **s’emmagasine** dans le réservoir : c’est le **piégeage** ;
7. l’obstacle est la **roche couverture** ;
8. le pétrole peut être associé au **gaz** et à l’eau de formation.

| Trou | Réponse | Indice de raisonnement |
|---:|---|---|
| 1 | pression | effet lié à l’enfouissement et à la génération |
| 2 | roches poreuses | destination perméable |
| 3 | migration primaire | sortie de la mère |
| 4 | migration secondaire | circulation dans le réservoir |
| 5 | roche réservoir | nom de la roche poreuse |
| 6 | imperméable | propriété de l’obstacle |
| 7 | s’emmagasine | résultat de l’arrêt |
| 8 | piégeage | nom de l’accumulation fermée |
| 9 | roche couverture | nom de l’obstacle |
| 10 | gaz | fluide associé au pétrole et à l’eau |

## Exercice 2 — ordonner par dépendance

Les propositions du support sont numérotées dans le désordre :

- **3** : dépôt ou accumulation de matière organique en milieu réducteur ;
- **2** : maturation et formation du kérogène ;
- **4** : formation puis migration des hydrocarbures ;
- **1** : accumulation dans les pièges.

L’ordre attendu est donc **3 → 2 → 4 → 1**. Chaque étape exige la précédente : aucun piégeage n’est possible avant la génération et la migration.

> **Correction de langue :** « Si aucune entrave n’est pas faite » contient une double négation. Il faut lire **« Si aucune entrave n’est rencontrée »** ou **« Si aucune entrave n’est faite »**.

> **Astuce mémoire — D-K-M-P :** **D**épôt, **K**érogène, **M**igration, **P**iégeage.
`,
    keyPoint: "Le texte officiel conduit à pression, roches poreuses, migrations primaire puis secondaire, réservoir, imperméable, emmagasinage, piégeage, couverture et gaz ; la chronologie vaut 3–2–4–1.",
    example: "Pour départager « primaire » et « secondaire », demande : le fluide sort-il de la roche mère ou circule-t-il déjà dans la roche poreuse ?",
    methodSteps: [
      "Lis tout le texte avant de placer un mot.",
      "Repère le sujet de chaque phrase : roche mère, roche poreuse, obstacle ou fluide.",
      "Utilise la définition exacte de chaque migration.",
      "Vérifie les accords grammaticaux après le raisonnement.",
      "Pour la chronologie, cherche la dépendance causale entre les étapes.",
      "Relis l’ensemble comme une explication continue.",
    ],
    interaction: diagram(
      "Relier chaque terme à sa place",
      "Ouvre les cartes dans l’ordre du trajet, puis reconstruis la chronologie de l’exercice 2.",
      "Texte officiel à trous",
      "Le pétrole quitte une roche mère, circule dans une roche réservoir et s’accumule sous une roche couverture avec gaz et eau.",
      [
        { id: "gap-1-2", label: "Trous 1–2", role: "pression → roches poreuses", detail: "La pression accompagne l’expulsion vers des couches offrant des pores connectés." },
        { id: "gap-3", label: "Trou 3", role: "migration primaire", detail: "C’est le passage hors de la roche mère." },
        { id: "gap-4-5", label: "Trous 4–5", role: "secondaire → réservoir", detail: "Le pétrole circule dans la roche poreuse appelée roche réservoir." },
        { id: "gap-6-7", label: "Trous 6–7", role: "imperméable → s’emmagasine", detail: "Un obstacle peu perméable arrête la migration et provoque l’accumulation." },
        { id: "gap-8-9", label: "Trous 8–9", role: "piégeage → couverture", detail: "Le phénomène est le piégeage ; la roche obstacle est la couverture." },
        { id: "gap-10", label: "Trou 10", role: "gaz", detail: "Le réservoir peut contenir eau, pétrole et gaz classés par densité." },
        { id: "order", label: "Exercice 2", role: "3 → 2 → 4 → 1", detail: "Dépôt organique, maturation, formation-migration, puis accumulation." },
      ],
      "Le vocabulaire devient facile lorsque le texte est compris comme un trajet causal plutôt que comme dix définitions isolées.",
    ),
    questions: [
      choice("Quel mot complète le trou 1 ?", ["pression", "gaz", "piégeage", "roche couverture"], 0, "Le texte précise entre parenthèses le poids des sédiments.", "Exercice 1 • page 5"),
      choice("Quel groupe complète le trou 2 ?", ["roches magmatiques", "roches poreuses", "roches métamorphiques", "roches fondues"], 1, "Grès et sables sont donnés comme exemples de destination poreuse.", "Exercice 1 • page 5"),
      choice("Quel terme complète le trou 3 ?", ["piégeage", "migration secondaire", "migration primaire", "raffinage"], 2, "Il s’agit de la sortie de la roche mère.", "Exercice 1 • page 5"),
      choice("Quel terme complète le trou 4 ?", ["compaction", "diagenèse", "migration primaire", "migration secondaire"], 3, "Le pétrole circule déjà dans la roche poreuse.", "Exercice 1 • page 5"),
      choice("Quel nom complète le trou 5 ?", ["roche réservoir", "roche mère", "roche magmatique", "socle"], 0, "La roche poreuse qui reçoit les fluides est le réservoir.", "Exercice 1 • page 5"),
      choice("Quel adjectif complète le trou 6 ?", ["soluble", "imperméable", "organique", "volcanique"], 1, "L’obstacle doit freiner fortement le mouvement du fluide.", "Exercice 1 • page 5"),
      choice("Quel verbe complète le trou 7 ?", ["s’évapore", "se cristallise", "s’emmagasine", "photosynthétise"], 2, "Le pétrole s’accumule dans le réservoir.", "Exercice 1 • page 5"),
      choice("Quel mot complète le trou 8 ?", ["érosion", "fusion", "sédimentation", "piégeage"], 3, "L’accumulation fermée est le piégeage.", "Exercice 1 • page 5"),
      choice("Quel terme complète le trou 9 ?", ["roche couverture", "kérogène", "eau de mer", "bloc pétrolier"], 0, "La roche obstacle est la couverture.", "Exercice 1 • page 5"),
      choice("Quel fluide complète le trou 10 ?", ["oxygène", "gaz", "magma", "mercure"], 1, "Le pétrole est associé au gaz et à l’eau de formation.", "Exercice 1 • page 5"),
      choice("Quel ordre répond à l’exercice 2 ?", ["1 → 4 → 2 → 3", "2 → 3 → 1 → 4", "3 → 2 → 4 → 1", "4 → 1 → 3 → 2"], 2, "Le dépôt précède le kérogène, puis viennent génération-migration et accumulation.", "Exercice 2 • pages 5-6"),
      short("Écris la suite des quatre chiffres sans mots.", ["3 2 4 1", "3-2-4-1", "3→2→4→1", "3241"], "L’ordre chronologique est 3, 2, 4, 1."),
    ],
    corrections: [
      "La double négation « Si aucune entrave n’est pas faite » est corrigée en « Si aucune entrave n’est rencontrée ».",
      "La tournure « associé au gaz et de l’eau » est rétablie en « associé au gaz et à l’eau de formation ».",
      "Le mot exact de la liste pour le trou 7 est conservé : « s’emmagasine ».",
      "La chronologie de l’exercice 2 est explicitée comme 3 → 2 → 4 → 1.",
    ],
  },
  {
    id: "anticline-wells-final-mission",
    title: "Expertiser le gisement des puits A et B",
    summary: "Résoudre l’exercice officiel 3 : nommer le piège, annoter trois roches, identifier les fluides des deux puits et expliquer toute la mise en place.",
    pages: "6",
    section: "Exercice 3 — coupe plissée et puits A-B",
    durationMinutes: 22,
    xp: 135,
    kind: "challenge",
    body: `
## 1. Nommer le piège

Les couches sont plissées et la roche réservoir forme une voûte fermée sous une couverture. La fermeture vient d’une déformation tectonique : il s’agit d’un **piège structural anticlinal**. La présence d’un synclinal voisin ne change pas le nom de la fermeture exploitée sur la voûte gauche.

## 2. Annoter les trois repères

Le scan de la page 6 est peu contrasté, mais la fonction des couches permet une annotation cohérente :

| Repère | Annotation | Justification |
|---:|---|---|
| 1 | roche couverture imperméable | couche qui surmonte et ferme le réservoir |
| 2 | roche réservoir poreuse et perméable | couche claire ponctuée qui contient et conduit les fluides |
| 3 | roche mère | couche profonde qui a généré les hydrocarbures |

Le repère 1 doit être lu par sa **fonction de couverture**. Cette lecture corrige la confusion de la page 4, où une couche équivalente au-dessus du piège était appelée roche mère.

## 3. Identifier les produits des puits

Dans la voûte, le gaz moins dense est au sommet et le pétrole se situe en dessous :

- le **puits A** atteint la zone supérieure : il extrait du **gaz** ;
- le **puits B** descend dans la zone inférieure : il extrait du **pétrole**.

Dans un champ réel, un puits peut produire plusieurs fluides et de l’eau ; la réponse ci-dessus correspond à la représentation scolaire et à la profondeur dessinée.

## 4. Expliquer la mise en place

Une réponse complète enchaîne les causes :

1. dépôt de matière organique avec les sédiments dans un bassin pauvre en dioxygène ;
2. enfouissement, diagenèse et formation du kérogène dans la roche mère ;
3. maturation thermique puis génération de pétrole et de gaz ;
4. migration primaire hors de la roche mère ;
5. migration secondaire dans la roche réservoir ;
6. arrivée dans le pli anticlinal fermé par une roche couverture ;
7. ségrégation gaz–pétrole–eau et conservation de l’accumulation.

> **Astuce mémoire — Source, Route, Réservoir, Serrure :** la mère est la **source**, la migration suit une **route**, le fluide entre dans le **réservoir**, la couverture ferme la **serrure**.
`,
    keyPoint: "Le document montre un piège structural anticlinal : 1 couverture, 2 réservoir, 3 roche mère ; A atteint le gaz et B le pétrole après génération, migrations et piégeage.",
    example: "Une copie forte ne répond pas seulement « A gaz, B pétrole » : elle justifie cet ordre par la densité et relie les fluides à la roche réservoir fermée par la couverture.",
    methodSteps: [
      "Décris d’abord la forme des couches pour nommer le piège.",
      "Annote chaque roche par sa fonction, pas par sa teinte sur le scan.",
      "Classe gaz, pétrole et eau du haut vers le bas.",
      "Suis la profondeur atteinte par chaque puits.",
      "Explique ensuite dépôt, kérogène, maturation, migrations et piégeage.",
      "Conclue par le rôle conjoint du réservoir et de la couverture.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Mission officielle redessinée",
      title: "Inspecter la coupe des puits A et B",
      instruction: "Sélectionne les cinq repères, puis formule une expertise complète du gisement.",
      viewBox: "0 0 760 360",
      caption: "Coupe pédagogique originale inspirée de l’exercice 3, page 6 ; aucun scan n’est intégré et les épaisseurs ne sont pas à l’échelle.",
      shapes: missionShapes,
      hotspots: missionHotspots,
      observation: "La fonction des couches lève l’ambiguïté du document : couverture au-dessus, réservoir poreux au milieu, roche mère en profondeur ; le puits le plus haut rencontre le gaz.",
    },
    questions: [
      choice("Quel type de piège montre la voûte exploitée ?", ["Un piège structural anticlinal", "Un piège volcanique", "Un piège artificiel", "Un piège sans fermeture"], 0, "Le pli bombé crée une fermeture structurale.", "Exercice 3, question 1 • page 6"),
      choice("Que désigne le repère 2 ?", ["La roche couverture", "La roche réservoir", "Le puits A", "Le socle magmatique"], 1, "La couche poreuse contient les fluides.", "Exercice 3, question 2 • page 6"),
      choice("Que désigne le repère 3 dans la lecture fonctionnelle ?", ["Le gaz", "La couverture", "La roche mère", "La ville de Jacqueville"], 2, "La couche profonde est la source des hydrocarbures.", "Exercice 3, question 2 • page 6"),
      choice("Que désigne le repère 1 ?", ["L’eau de formation", "Le kérogène liquide", "Le pétrole", "La roche couverture"], 3, "La couche supérieure peu perméable ferme le piège.", "Exercice 3, question 2 • page 6"),
      trueFalse("Le piège est nommé structural parce que les couches sont plissées.", true, "La déformation tectonique crée l’anticlinal."),
      choice("Quel produit le puits A atteint-il dans le modèle ?", ["Le gaz", "L’eau uniquement", "Le kérogène", "Le charbon"], 0, "A atteint la partie la plus haute de l’accumulation.", "Exercice 3, question 3 • page 6"),
      choice("Quel produit le puits B atteint-il dans le modèle ?", ["La couverture", "Le pétrole", "Le magma", "L’air atmosphérique"], 1, "B descend dans la zone pétrolifère sous le gaz.", "Exercice 3, question 3 • page 6"),
      choice("Quelle étape vient immédiatement après la formation du kérogène dans l’explication ?", ["Le raffinage", "Le forage", "La maturation thermique et la génération d’hydrocarbures", "La vente du pétrole"], 2, "Le kérogène doit mûrir avant l’expulsion."),
      choice("Quelle étape précède le piégeage ?", ["La photosynthèse du pétrole", "La construction du puits", "Le raffinage", "La migration secondaire dans le réservoir"], 3, "Les fluides doivent parvenir au piège par la roche perméable."),
      trueFalse("Le puits B extrait le pétrole parce que le pétrole est moins dense que le gaz.", false, "Le pétrole est plus dense que le gaz ; il se situe donc sous lui."),
      choice("Quel ordre vertical justifie les produits A et B ?", ["gaz puis pétrole puis eau", "eau puis gaz puis pétrole", "pétrole puis gaz puis eau", "couverture puis mère puis gaz"], 0, "Le gaz est au sommet, le pétrole au milieu et l’eau à la base."),
      choice("Quelle phrase relie correctement génération et accumulation ?", ["La couverture produit puis raffine le pétrole", "La roche mère génère ; le réservoir reçoit ; la couverture confine", "Le réservoir génère et la mère bloque", "Le puits crée le gisement"], 1, "Les trois fonctions sont complémentaires."),
      short("Écris les deux produits sous la forme A = … ; B = …", ["A = gaz ; B = pétrole", "A=gaz;B=pétrole", "A gaz B pétrole", "A : gaz ; B : pétrole", "A=gas;B=petrole"], "Le puits A atteint le gaz et le puits B le pétrole.", "Exercice 3, question 3 • page 6", 2),
    ],
    corrections: [
      "Le scan final peu contrasté est redessiné ; les annotations sont fixées fonctionnellement à 1 roche couverture, 2 roche réservoir et 3 roche mère.",
      "Les produits des puits sont explicités comme A gaz et B pétrole conformément à leur profondeur dans la voûte.",
      "Le piège est nommé précisément « structural anticlinal » plutôt que seulement « piège à pétrole ».",
      "La phrase introductive attribuée à un élève de Seconde A est conservée comme contexte de transfert, sans modifier la portée Terminale C du parcours.",
    ],
  },
];

const levelOrder = [
  "ivorian-sedimentary-basin-location",
  "source-reservoir-seal-rocks",
  "organic-deposition-kerogen",
  "thermal-maturation-hydrocarbons",
  "primary-secondary-migration",
  "fluid-sorting-reservoir-trap",
  "stratigraphic-structural-mixed-traps",
  "official-gap-order-exercises",
  "anticline-wells-final-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau gisements pétrolifères introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalCSvtPetroleumFormationPath: LearningPath = {
  id: "terminale-c-svt-l9-petroleum-formation",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 5, title: "Les ressources énergétiques" },
  chapterNumber: 9,
  title: "La mise en place des gisements pétrolifères en Côte d’Ivoire",
  description: "Le cours officiel restructuré en neuf niveaux interactifs : bassin sédimentaire ivoirien, fonctions des roches, dépôt organique, kérogène, maturation, migrations, tri des fluides, familles de pièges et trois exercices d’évaluation.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Localiser le bassin sédimentaire ivoirien sans confondre bassin, bloc et gisement",
    "Distinguer les fonctions de la roche mère, de la roche réservoir et de la roche couverture",
    "Expliquer la succession dépôt organique, kérogène, maturation et génération des hydrocarbures",
    "Différencier migration primaire, migration secondaire, ségrégation des fluides et piégeage",
    "Reconnaître un piège stratigraphique, structural ou mixte sur une coupe",
    "Résoudre les trois exercices officiels et justifier les produits des puits A et B",
  ],
  modules: [
    {
      id: "petroleum-formation-mastery",
      title: "Maîtriser la mise en place d’un gisement pétrolifère",
      description: "Neuf niveaux progressifs, du bassin sédimentaire ivoirien à l’expertise finale d’un piège anticlinal.",
      lessons: builtLevels,
    },
  ],
};
