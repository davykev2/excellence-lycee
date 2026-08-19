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
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "SVT TD_L8_Le devenir des cellules sexuelles chez les mammifères.pdf";

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
  options: [],
  correctIndex: 0,
  prompt,
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
  corrections: string[],
): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages,
  section,
  fidelity: "faithful-corrected",
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

const timeline = (
  title: string,
  instruction: string,
  items: TimelineInteractionItem[],
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Chronologie à dérouler",
  title,
  instruction,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
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
      eyebrow: "Méthode scientifique",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Situe d’abord la structure dans l’appareil génital, ordonne les événements, puis relie chaque transformation cellulaire à son rôle sans confondre observation et mécanisme.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : rencontre, activation, cellule-œuf, segmentation, blastocyste puis implantation. Un mot précis pour chaque étape évite les raccourcis.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const ovocyteShapes: SchemaShape[] = [
  { shape: "circle", cx: 360, cy: 225, r: 154, tone: "soft" },
  { shape: "circle", cx: 360, cy: 225, r: 132, tone: "outline" },
  { shape: "circle", cx: 360, cy: 225, r: 115, tone: "fill" },
  { shape: "circle", cx: 360, cy: 225, r: 101, tone: "muted" },
  { shape: "circle", cx: 326, cy: 113, r: 10, tone: "accent" },
  { shape: "circle", cx: 305, cy: 119, r: 6, tone: "accent" },
  { shape: "circle", cx: 252, cy: 165, r: 5, tone: "accent" },
  { shape: "circle", cx: 246, cy: 194, r: 5, tone: "accent" },
  { shape: "circle", cx: 246, cy: 224, r: 5, tone: "accent" },
  { shape: "circle", cx: 250, cy: 253, r: 5, tone: "accent" },
  { shape: "circle", cx: 260, cy: 282, r: 5, tone: "accent" },
  { shape: "line", x1: 410, y1: 205, x2: 450, y2: 245, tone: "outline" },
  { shape: "line", x1: 450, y1: 205, x2: 410, y2: 245, tone: "outline" },
  { shape: "line", x1: 417, y1: 214, x2: 443, y2: 236, tone: "accent" },
  { shape: "line", x1: 443, y1: 214, x2: 417, y2: 236, tone: "accent" },
  { shape: "ellipse", cx: 155, cy: 220, rx: 23, ry: 10, rotate: -8, tone: "accent" },
  { shape: "path", d: "M132 220 C92 188 75 250 34 212", tone: "outline" },
  { shape: "text", x: 360, y: 414, content: "Ovocyte II — schéma pédagogique original", anchor: "middle" },
];

const ovocyteHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "corona", number: 1, label: "Corona radiata", x: 490, y: 120, detail: "Couche de cellules folliculaires du cumulus qui accompagne l’ovocyte après l’ovulation." },
  { id: "zona", number: 2, label: "Zone pellucide", x: 500, y: 183, detail: "Enveloppe glycoprotéique située sous la corona radiata ; elle participe aux interactions gamétiques et reste autour de l’embryon précoce." },
  { id: "space", number: 3, label: "Espace périvitellin", x: 500, y: 242, detail: "Espace entre zone pellucide et membrane ovocytaire ; il contient le premier globule polaire." },
  { id: "membrane", number: 4, label: "Membrane ovocytaire", x: 485, y: 300, detail: "Membrane plasmique de l’ovocyte ; sa fusion avec celle du spermatozoïde déclenche l’activation." },
  { id: "polar", number: 5, label: "Premier globule polaire", x: 300, y: 92, detail: "Petite cellule issue de la première division méiotique, visible dans l’espace périvitellin." },
  { id: "metaphase", number: 6, label: "Fuseau de métaphase II", x: 430, y: 225, detail: "L’ovocyte II est bloqué en métaphase II jusqu’au signal d’activation associé à la fécondation." },
  { id: "cortical", number: 7, label: "Granules corticaux", x: 244, y: 225, detail: "Vésicules sous-membranaires exocytées après l’élévation du calcium ; elles modifient la zone pellucide." },
  { id: "sperm", number: 8, label: "Spermatozoïde capacité", x: 155, y: 220, detail: "Gamète mâle ayant acquis dans les voies génitales femelles la compétence fonctionnelle nécessaire à la fécondation." },
];

const pronuclearShapes: SchemaShape[] = [
  { shape: "circle", cx: 360, cy: 220, r: 155, tone: "soft" },
  { shape: "circle", cx: 360, cy: 220, r: 132, tone: "outline" },
  { shape: "circle", cx: 360, cy: 220, r: 118, tone: "fill" },
  { shape: "circle", cx: 310, cy: 225, r: 38, tone: "accent" },
  { shape: "circle", cx: 410, cy: 225, r: 38, tone: "accent" },
  { shape: "circle", cx: 310, cy: 225, r: 8, tone: "muted" },
  { shape: "circle", cx: 410, cy: 225, r: 8, tone: "muted" },
  { shape: "circle", cx: 330, cy: 82, r: 10, tone: "accent" },
  { shape: "circle", cx: 356, cy: 83, r: 8, tone: "accent" },
  { shape: "line", x1: 285, y1: 315, x2: 435, y2: 315, tone: "muted" },
  { shape: "line", x1: 360, y1: 292, x2: 360, y2: 340, tone: "outline" },
  { shape: "text", x: 360, y: 416, content: "Deux pronoyaux avant la première mitose", anchor: "middle" },
];

const pronuclearHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "female", number: 1, label: "Pronoyau femelle", x: 310, y: 225, detail: "Il provient du matériel chromosomique maternel après achèvement de la méiose II." },
  { id: "male", number: 2, label: "Pronoyau mâle", x: 410, y: 225, detail: "Il résulte de la décondensation du noyau spermatique dans le cytoplasme ovocytaire." },
  { id: "polar-bodies", number: 3, label: "Globules polaires", x: 343, y: 82, detail: "Le premier puis le deuxième globule polaire témoignent des deux divisions méiotiques ovocytaires." },
  { id: "zona-pronuclear", number: 4, label: "Zone pellucide", x: 505, y: 220, detail: "Elle entoure encore le zygote et les premiers blastomères jusqu’à l’éclosion du blastocyste." },
  { id: "centrosomes", number: 5, label: "Organisation du premier fuseau", x: 360, y: 315, detail: "Après réplication, les deux lots parentaux seront réunis sur un fuseau mitotique commun." },
  { id: "zygote", number: 6, label: "Cellule-œuf ou zygote", x: 215, y: 350, detail: "Une cellule unique porte désormais les deux patrimoines haploïdes ; la diploïdie sera organisée dans les chromosomes du premier cycle mitotique." },
];

const blastocystShapes: SchemaShape[] = [
  { shape: "path", d: "M205 220 C205 125 280 65 380 65 C486 65 560 130 560 222 C560 314 485 380 380 380 C276 380 205 315 205 220 Z", tone: "outline" },
  { shape: "ellipse", cx: 396, cy: 222, rx: 135, ry: 110, tone: "soft" },
  { shape: "circle", cx: 285, cy: 153, r: 24, tone: "accent" },
  { shape: "circle", cx: 313, cy: 136, r: 23, tone: "accent" },
  { shape: "circle", cx: 336, cy: 160, r: 22, tone: "accent" },
  { shape: "circle", cx: 297, cy: 182, r: 22, tone: "accent" },
  { shape: "circle", cx: 330, cy: 190, r: 20, tone: "accent" },
  { shape: "path", d: "M188 110 C150 132 148 178 165 199 M165 241 C148 270 153 315 193 337", tone: "muted" },
  { shape: "path", d: "M570 132 C620 148 626 182 601 205 M601 238 C626 265 620 302 570 318", tone: "muted" },
  { shape: "text", x: 380, y: 424, content: "Blastocyste en éclosion — figure originale", anchor: "middle" },
];

const blastocystHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "trophoblast", number: 1, label: "Trophoblaste", x: 520, y: 142, detail: "Couche cellulaire externe du blastocyste ; elle participe ensuite aux tissus fœtaux du placenta et à l’invasion de l’endomètre." },
  { id: "blastocoel", number: 2, label: "Blastocèle", x: 430, y: 245, detail: "Cavité remplie de liquide apparue lors de la cavitation de la morula." },
  { id: "embryoblast", number: 3, label: "Embryoblaste", x: 310, y: 163, detail: "Masse cellulaire interne située au pôle embryonnaire ; elle donnera l’embryon proprement dit." },
  { id: "pole", number: 4, label: "Pôle embryonnaire", x: 245, y: 115, detail: "Côté portant l’embryoblaste, généralement orienté vers l’endomètre lors de l’apposition." },
  { id: "zona-opening", number: 5, label: "Éclosion de la zone pellucide", x: 590, y: 220, detail: "Le blastocyste sort de la zone pellucide vers J5-J6 ; cette éclosion est nécessaire avant l’adhésion à l’endomètre." },
  { id: "uterine", number: 6, label: "Cavité utérine", x: 150, y: 220, detail: "Le blastocyste y séjourne librement brièvement avant l’apposition puis l’implantation." },
];

const assessmentShapes: SchemaShape[] = [
  { shape: "circle", cx: 145, cy: 195, r: 92, tone: "soft" },
  { shape: "circle", cx: 145, cy: 195, r: 79, tone: "outline" },
  { shape: "line", x1: 123, y1: 178, x2: 166, y2: 214, tone: "accent" },
  { shape: "line", x1: 166, y1: 178, x2: 123, y2: 214, tone: "accent" },
  { shape: "ellipse", cx: 82, cy: 171, rx: 15, ry: 7, rotate: -18, tone: "accent" },
  { shape: "circle", cx: 355, cy: 195, r: 92, tone: "soft" },
  { shape: "circle", cx: 355, cy: 195, r: 79, tone: "outline" },
  { shape: "circle", cx: 323, cy: 195, r: 23, tone: "accent" },
  { shape: "circle", cx: 390, cy: 195, r: 23, tone: "accent" },
  { shape: "circle", cx: 565, cy: 195, r: 92, tone: "soft" },
  { shape: "circle", cx: 565, cy: 195, r: 79, tone: "outline" },
  { shape: "circle", cx: 548, cy: 195, r: 24, tone: "accent" },
  { shape: "circle", cx: 582, cy: 195, r: 24, tone: "accent" },
  { shape: "circle", cx: 775, cy: 195, r: 92, tone: "soft" },
  { shape: "circle", cx: 775, cy: 195, r: 79, tone: "outline" },
  { shape: "line", x1: 730, y1: 170, x2: 820, y2: 220, tone: "accent" },
  { shape: "line", x1: 820, y1: 170, x2: 730, y2: 220, tone: "accent" },
  { shape: "text", x: 145, y: 322, content: "A — activation", anchor: "middle" },
  { shape: "text", x: 355, y: 322, content: "B — pronoyaux", anchor: "middle" },
  { shape: "text", x: 565, y: 322, content: "C — rapprochement", anchor: "middle" },
  { shape: "text", x: 775, y: 322, content: "D — première mitose", anchor: "middle" },
];

const assessmentHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "official-1", number: 1, label: "Zone pellucide", x: 220, y: 120, detail: "Enveloppe glycoprotéique autour de l’ovocyte ; la flèche 1 du scan est peu nette, ce repère original la localise sans ambiguïté." },
  { id: "official-2", number: 2, label: "Spermatozoïde", x: 82, y: 171, detail: "Le gamète mâle a franchi les enveloppes et apporte le noyau paternel." },
  { id: "official-3", number: 3, label: "Premier globule polaire", x: 125, y: 104, detail: "Il témoigne de l’achèvement de la première division méiotique avant l’ovulation." },
  { id: "official-4", number: 4, label: "Fuseau et chromosomes d’anaphase II", x: 145, y: 195, detail: "L’activation fait reprendre la méiose II et sépare le lot destiné au deuxième globule polaire." },
  { id: "official-5", number: 5, label: "Granules corticaux en exocytose", x: 190, y: 238, detail: "Leur contenu modifie la zone pellucide lors de la réaction corticale." },
  { id: "official-6", number: 6, label: "Corona radiata", x: 70, y: 260, detail: "Cellules folliculaires externes encore visibles autour de l’ovocyte dans la figure A." },
  { id: "official-7", number: 7, label: "Zone pellucide modifiée", x: 430, y: 120, detail: "La réaction de la zone réduit la fixation et la pénétration d’autres spermatozoïdes ; la flèche 7 du scan est ambiguë, le redessin clarifie l’enveloppe visée." },
  { id: "official-8", number: 8, label: "Pronoyau mâle", x: 390, y: 195, detail: "Il résulte de la décondensation du noyau spermatique." },
  { id: "official-9", number: 9, label: "Deux globules polaires", x: 340, y: 104, detail: "Le deuxième apparaît à l’achèvement de la méiose II et rejoint le premier dans l’espace périvitellin." },
  { id: "official-10", number: 10, label: "Corona radiata", x: 280, y: 260, detail: "Le repère replace la couche folliculaire externe de la figure B." },
  { id: "official-11", number: 11, label: "Pronoyau femelle", x: 323, y: 195, detail: "Il contient le lot haploïde maternel après émission du deuxième globule polaire." },
  { id: "official-12", number: 12, label: "Pronoyau mâle rapproché", x: 582, y: 195, detail: "Le pronoyau paternel migre vers le pronoyau maternel tout en préparant la première mitose." },
  { id: "official-13", number: 13, label: "Pronoyau femelle rapproché", x: 548, y: 195, detail: "Les deux pronoyaux sont voisins, mais leurs enveloppes n’ont pas fusionné en un noyau unique." },
  { id: "official-14", number: 14, label: "Corona radiata", x: 490, y: 260, detail: "La couche folliculaire externe est encore représentée autour de la figure C." },
  { id: "official-15", number: 15, label: "Chromosomes parentaux sur le premier fuseau", x: 775, y: 195, detail: "Après désassemblage des enveloppes pronucléaires, les deux lots s’organisent sur un fuseau mitotique commun." },
];

const levels: LevelSeed[] = [
  {
    id: "gamete-migration-capacitation",
    title: "Faire migrer les gamètes jusqu’à l’ampoule",
    summary: "Suivre les trajets femelle et mâle, localiser la fécondation et expliquer sélection puis capacitation sans raccourci.",
    pages: "1 et 3",
    section: "I. Migration des gamètes",
    durationMinutes: 26,
    xp: 45,
    body: String.raw`
## Deux trajets qui convergent

Après l’ovulation, l’**ovocyte II** entouré de son cumulus est capté par le pavillon de la trompe. Les battements ciliaires de l’épithélium tubaire et les contractions de la paroi contribuent à son déplacement vers l’ampoule. L’ovocyte ne nage pas et n’est pas « aspiré » activement par l’ovaire.

Chez l’être humain, les spermatozoïdes sont déposés dans le vagin. Ils franchissent successivement la glaire cervicale, la cavité utérine puis la jonction utéro-tubaire. Leur motilité participe au trajet, mais les contractions des voies génitales femelles et les propriétés de la glaire interviennent aussi. Parmi les millions déposés, une très petite fraction atteint la trompe ; cette réduction est un **filtrage physiologique**, pas un concours qui garantirait que le spermatozoïde arrivé soit génétiquement « le meilleur ».

Le fascicule donne l’ordre de grandeur historique de **100 à 400 millions** de spermatozoïdes déposés et résume l’attrition par « 99 % ». Ces valeurs ne constituent pas des constantes humaines : le nombre varie selon l’échantillon et les méthodes de comptage, et la proportion restante dépend du point du trajet observé. On conserve donc la conclusion robuste — une attrition massive avant l’ampoule — tout en datant et nuançant les chiffres de la source.

| Gamète | Point de départ | Facteurs de déplacement | Zone de rencontre habituelle |
|---|---|---|---|
| ovocyte II | ovaire puis pavillon | cils tubaires, contractions, flux local | ampoule tubaire |
| spermatozoïdes | vagin chez l’humain | flagelle, glaire, contractions utérines et tubaires | ampoule tubaire |

## La capacitation : devenir fonctionnellement fécondant

Dans les voies génitales femelles, une sous-population de spermatozoïdes subit la **capacitation**. Il s’agit d’un remodelage fonctionnel de leur membrane : changements de lipides et de protéines, modification des flux ioniques, hyperactivation du mouvement et préparation de la réaction acrosomique. La source résume ce phénomène comme le retrait d’un « enduit protéique » épididymaire ; cette image est insuffisante.

La rencontre se produit habituellement dans la partie ampullaire de la trompe, appelée dans le PDF « tiers supérieur ». Cette localisation doit être reliée au moment de l’ovulation et à une fenêtre de fécondabilité limitée.

> **Correction scientifique — durée.** Le PDF affirme que le gamète femelle serait maintenu environ 72 h dans l’ampoule. Chez l’humain, l’ovocyte ovulé reste généralement fécondable environ **12 à 24 h** ; les durées varient selon les mammifères. Les spermatozoïdes peuvent persister plusieurs jours dans des conditions favorables, ce qui élargit la fenêtre fertile.

> **Astuce mémoire — C comme convergence :** **c**ils et contractions portent l’ovocyte ; **c**apacitation prépare le spermatozoïde ; les deux **c**onvergent dans l’ampoule.
`,
    keyPoint: "La rencontre fécondante exige la convergence d’un ovocyte II viable et de spermatozoïdes capacités dans la région ampullaire de la trompe.",
    example: "Un spermatozoïde mobile arrivé dans l’utérus n’est pas forcément fécondant : il doit encore subir les remaniements membranaires de la capacitation.",
    methodSteps: [
      "Trace séparément le trajet de l’ovocyte II et celui des spermatozoïdes.",
      "Associe à chaque trajet ses mécanismes : cils, contractions et motilité.",
      "Place sélection et capacitation avant la réaction acrosomique.",
      "Termine par l’ampoule et par la fenêtre de viabilité des deux gamètes.",
    ],
    interaction: timeline(
      "Deux routes vers une même ampoule",
      "Déroule les étapes et repère ce qui relève du transport, du filtrage ou de la maturation fonctionnelle.",
      [
        { label: "Ovulation", shortLabel: "Ovocyte II", detail: "L’ovaire expulse un ovocyte II entouré de cellules du cumulus ; le pavillon le recueille." },
        { label: "Transport tubaire", shortLabel: "Cils + contractions", detail: "L’épithélium cilié et la musculature tubaire contribuent au déplacement vers la cavité utérine." },
        { label: "Dépôt des spermatozoïdes", shortLabel: "Vagin", detail: "Chez l’humain, les spermatozoïdes sont déposés dans le vagin puis franchissent col, utérus et jonction utéro-tubaire." },
        { label: "Filtrage", shortLabel: "Sélection", detail: "Glaire, géométrie des voies et conditions locales réduisent fortement le nombre de spermatozoïdes qui progressent." },
        { label: "Remodelage", shortLabel: "Capacitation", detail: "La membrane et la motilité sont remaniées ; le spermatozoïde devient apte à répondre aux enveloppes ovocytaires." },
        { label: "Convergence", shortLabel: "Ampoule", detail: "La rencontre des gamètes se produit habituellement dans la région ampullaire de la trompe." },
      ],
      "La migration n’est pas une simple nage en ligne droite : elle combine propriétés des gamètes et activité des voies génitales femelles.",
    ),
    questions: [
      choice("Quelle cellule est libérée lors de l’ovulation humaine ?", ["Un ovocyte II", "Un zygote", "Un blastocyste", "Une ovogonie"], 0, "L’ovulation libère un ovocyte secondaire bloqué en métaphase II.", "Figure 1 • page 1"),
      choice("Quelle structure recueille l’ovocyte après l’ovulation ?", ["Le col utérin", "Le pavillon de la trompe", "Le placenta", "L’épididyme"], 1, "Les franges du pavillon se trouvent au voisinage de l’ovaire.", "Figure 1 • page 1"),
      choice("Où se déroule habituellement la fécondation humaine ?", ["Dans le vagin", "Dans le corps jaune", "Dans l’ampoule tubaire", "Dans le col"], 2, "La région ampullaire est le lieu habituel de rencontre fécondante.", "Analyse • page 3"),
      choice("Quel énoncé décrit le mieux la capacitation ?", ["Une mitose du spermatozoïde", "La perte obligatoire du flagelle", "Une fusion immédiate des pronoyaux", "Un remodelage membranaire et fonctionnel"], 3, "La capacitation prépare notamment la motilité hyperactivée et la réaction acrosomique."),
      trueFalse("Chez l’humain, l’ovocyte II demeure normalement fécondable pendant 72 heures après l’ovulation.", false, "La fenêtre communément retenue est plutôt de 12 à 24 h ; 72 h ne doit pas devenir une règle humaine."),
      choice("Quel facteur ne participe pas au déplacement tubaire de l’ovocyte ?", ["Son propre flagelle", "Les cils tubaires", "Les contractions de la trompe", "Les mouvements locaux du fluide"], 0, "L’ovocyte n’a pas de flagelle."),
      choice("Dans quel compartiment les spermatozoïdes sont-ils déposés chez l’humain ?", ["L’ovaire", "Le vagin", "L’ampoule directement", "Le corps jaune"], 1, "Le dépôt vaginal humain est distingué du dépôt utérin décrit chez certaines autres espèces."),
      choice("Quelle barrière se situe entre vagin et utérus ?", ["Le blastocèle", "Le trophoblaste", "Le col et sa glaire", "Le pronoyau"], 2, "La glaire cervicale constitue un milieu de passage sélectif."),
      choice("Pourquoi faut-il éviter l’expression « le meilleur spermatozoïde gagne » ?", ["Aucun spermatozoïde ne bouge", "Tous atteignent la trompe", "La fécondation est aléatoire sans interactions", "Le filtrage n’est pas une garantie de supériorité génétique"], 3, "La progression dépend de nombreux filtres physiologiques et interactions moléculaires."),
      short("Nomme le remodelage qui confère le pouvoir fécondant au spermatozoïde dans les voies femelles.", ["capacitation", "la capacitation"], "La capacitation précède normalement la réaction acrosomique.", "Analyse • page 3"),
      short("Donne le nom de la partie élargie de la trompe où les gamètes se rencontrent habituellement.", ["ampoule", "ampoule tubaire", "l’ampoule", "l’ampoule tubaire"], "La fécondation a le plus souvent lieu dans l’ampoule tubaire."),
    ],
    corrections: [
      "Le fichier source porte L8, tandis que le catalogue officiel du produit classe cette leçon en cinquième position de Terminale D ; le parcours conserve chapterNumber 5.",
      "La durée de 72 h attribuée à l’ovocyte dans l’ampoule n’est pas généralisée à l’humain : la fécondabilité est corrigée à environ 12-24 h.",
      "La capacitation est présentée comme un remodelage membranaire, ionique et fonctionnel, et non comme le simple retrait d’un enduit protéique.",
      "Le dépôt vaginal humain est distingué du dépôt utérin observé chez certaines espèces citées dans la source.",
      "Les valeurs source « 100 à 400 millions » et « 99 % » sont conservées comme ordres de grandeur historiques, sans être généralisées en constantes humaines.",
    ],
  },
  {
    id: "ovocyte-encounter",
    title: "Reconnaître l’ovocyte II et la rencontre gamétique",
    summary: "Annoter les enveloppes de l’ovocyte II, son état méiotique et les structures qui préparent l’interaction avec le spermatozoïde.",
    pages: "1-3",
    section: "I. Structure de l’ovocyte II et rencontre des gamètes",
    durationMinutes: 25,
    xp: 55,
    body: String.raw`
## Une cellule prête mais inachevée

Le document de la page 2 représente l’ovocyte au moment où les spermatozoïdes l’entourent. Ce n’est pas encore un zygote. Chez les mammifères étudiés ici, l’ovocyte II est bloqué en **métaphase de la deuxième division méiotique**. La pénétration puis l’activation permettront l’achèvement de cette méiose.

De l’extérieur vers l’intérieur, on repère :

1. la **corona radiata**, couche de cellules folliculaires du cumulus ;
2. la **zone pellucide**, matrice glycoprotéique entourant l’ovocyte ;
3. l’**espace périvitellin**, contenant le premier globule polaire ;
4. la **membrane plasmique ovocytaire** ;
5. le cytoplasme, dont la périphérie contient les **granules corticaux** ;
6. le fuseau méiotique avec les chromosomes bloqués en métaphase II.

| Structure | Indice visuel | Fonction à retenir |
|---|---|---|
| corona radiata | cellules externes | environnement folliculaire et obstacle initial |
| zone pellucide | enveloppe acellulaire épaisse | interactions gamétiques puis protection préimplantatoire |
| granules corticaux | vésicules sous la membrane | modification de la zone après activation |
| premier globule polaire | petite cellule périvitelline | témoin de la première division méiotique |

## Rencontre ne signifie pas encore fécondation achevée

Les spermatozoïdes capacités atteignent le complexe cumulus-ovocyte. Ils traversent d’abord les cellules du cumulus, puis interagissent avec la zone pellucide. Le simple fait d’entourer l’ovocyte correspond à la **rencontre** ; la fécondation comprend encore réaction acrosomique, fusion membranaire, activation ovocytaire et organisation des patrimoines parentaux.

> **Précision de vocabulaire.** Le PDF emploie parfois « gamète femelle » ou « ovule ». Au moment de la rencontre humaine, le terme exact est **ovocyte II**. L’achèvement de la méiose II suit l’activation ; « ovule » peut alors désigner la cellule femelle mature, mais l’usage moderne décrit surtout un ovocyte fécondé en voie de devenir zygote.

> **Astuce mémoire — C-Z-E-M-G :** **C**orona, **z**one pellucide, **e**space périvitellin, **m**embrane, **g**ranules corticaux.
`,
    keyPoint: "L’ovocyte II rencontré dans l’ampoule est entouré par la corona radiata et la zone pellucide, porte un premier globule polaire et reste bloqué en métaphase II.",
    example: "Un fuseau méiotique et un seul globule polaire dans l’espace périvitellin identifient un ovocyte II avant achèvement de la fécondation.",
    methodSteps: [
      "Pars de l’extérieur et nomme les enveloppes dans l’ordre.",
      "Localise les granules corticaux juste sous la membrane plasmique.",
      "Repère le premier globule polaire dans l’espace périvitellin.",
      "Relie le fuseau visible au blocage en métaphase II.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Explorer l’ovocyte II rencontré dans l’ampoule",
      instruction: "Sélectionne les huit repères de l’extérieur vers l’intérieur, puis explique pourquoi cette cellule n’est pas encore un zygote.",
      viewBox: "0 0 720 450",
      caption: "Figure pédagogique originale reconstruite d’après les structures des figures 1 à 3 ; aucune image du PDF n’est republiée.",
      shapes: ovocyteShapes,
      hotspots: ovocyteHotspots,
      observation: "Les enveloppes ne sont pas interchangeables : les cellules de la corona radiata sont externes, la zone pellucide est acellulaire et les granules corticaux sont dans le cytoplasme périphérique.",
    },
    questions: [
      choice("Quelle couche cellulaire entoure extérieurement la zone pellucide ?", ["La corona radiata", "Le blastocèle", "Le syncytiotrophoblaste", "Le pronoyau"], 0, "La corona radiata appartient au cumulus folliculaire.", "Figure 2 • page 2"),
      choice("Où se trouve le premier globule polaire ?", ["Dans le noyau spermatique", "Dans l’espace périvitellin", "Dans le blastocèle", "Dans la trompe"], 1, "L’espace périvitellin se situe entre membrane ovocytaire et zone pellucide.", "Figure 2 • page 2"),
      choice("À quel stade la méiose de l’ovocyte II est-elle bloquée avant activation ?", ["Prophase I", "Anaphase I", "Métaphase II", "Télophase mitotique"], 2, "Le fuseau de métaphase II reprend son activité après le signal d’activation."),
      choice("Où se situent les granules corticaux ?", ["Dans le flagelle", "Au sein de la corona radiata", "Dans la glaire cervicale", "Sous la membrane ovocytaire"], 3, "Ils sont prêts à être exocytés lors de la réaction corticale."),
      trueFalse("La rencontre de spermatozoïdes autour de l’ovocyte suffit à former immédiatement un zygote.", false, "Il reste plusieurs étapes : traversée, fusion, activation et organisation nucléaire."),
      choice("Quelle enveloppe est une matrice glycoprotéique acellulaire ?", ["La zone pellucide", "La corona radiata", "Le trophoblaste", "Le myomètre"], 0, "La zone pellucide n’est pas une couche de cellules."),
      choice("Quel indice atteste que la première division méiotique a déjà eu lieu ?", ["Le blastocèle", "Le premier globule polaire", "La hCG", "Le trophoblaste"], 1, "Le premier globule polaire résulte de la méiose I."),
      choice("Quelle structure modifiera la zone pellucide après activation ?", ["Le corps jaune", "Le pavillon", "Le contenu des granules corticaux", "Le fuseau du spermatozoïde"], 2, "L’exocytose corticale déclenche la réaction de la zone."),
      choice("Quel terme est le plus précis au moment de la rencontre humaine ?", ["Blastomère", "Morula", "Ovogonie", "Ovocyte II"], 3, "La cellule femelle n’a pas encore achevé sa méiose II."),
      short("Nomme l’enveloppe glycoprotéique située sous la corona radiata.", ["zone pellucide", "la zone pellucide"], "La zone pellucide entoure l’ovocyte et les premiers stades embryonnaires.", "Figure 2 • page 2"),
      short("Nomme les vésicules périphériques exocytées après l’entrée du spermatozoïde.", ["granules corticaux", "les granules corticaux", "granules corticales"], "Les granules corticaux participent au blocage de la polyspermie."),
    ],
    corrections: [
      "Le terme ovocyte II est préféré à ovule au moment de la rencontre, car la deuxième division méiotique n’est pas encore achevée.",
      "Corona radiata, zone pellucide, espace périvitellin et membrane plasmique sont distingués explicitement au lieu d’être regroupés en une enveloppe unique.",
      "Les granules corticaux sont localisés dans le cytoplasme périphérique et non dans la zone pellucide.",
    ],
  },
  {
    id: "acrosomal-reaction",
    title: "Franchir les enveloppes et fusionner les membranes",
    summary: "Expliquer la réaction acrosomique, la traversée du cumulus et de la zone pellucide puis la fusion gamétique.",
    pages: "2-3",
    section: "I. Pénétration d’un spermatozoïde",
    durationMinutes: 25,
    xp: 65,
    body: String.raw`
## De la capacitation à la fusion

Le spermatozoïde capacité ne traverse pas l’ovocyte comme une aiguille. Il franchit une succession d’obstacles et d’interactions :

1. il progresse entre les cellules du cumulus et de la corona radiata ;
2. il reconnaît et contacte la zone pellucide ;
3. ce contact, avec l’état de capacitation, permet la **réaction acrosomique** ;
4. la membrane externe de l’acrosome fusionne par endroits avec la membrane plasmique de la tête ;
5. le contenu acrosomial est libéré et expose de nouvelles régions membranaires ;
6. le spermatozoïde traverse localement la zone pellucide ;
7. les membranes du spermatozoïde et de l’ovocyte fusionnent ;
8. le contenu spermatique utile pénètre dans le cytoplasme et déclenche l’activation ovocytaire.

## Ce que fait l’acrosome

L’**acrosome** est une vésicule coiffant l’avant du noyau spermatique. Ses enzymes et les changements de surface associés à la réaction acrosomique facilitent le franchissement de la zone pellucide. La motilité hyperactivée fournit aussi une force mécanique. Le phénomène ne se réduit donc ni à « dissoudre toute la zone » ni à pousser uniquement avec le flagelle.

| Élément du spermatozoïde | Rôle dans cette séquence |
|---|---|
| acrosome | libération de contenu et remaniement de la tête |
| membrane plasmique | interactions puis fusion avec l’ovocyte |
| noyau haploïde | origine du patrimoine chromosomique paternel |
| flagelle | motilité ; il n’entre pas comme un organe fonctionnel du futur embryon |

La fusion membranaire se fait au niveau de la membrane ovocytaire après traversée de la zone pellucide. Elle provoque des signaux intracellulaires, notamment des oscillations de calcium, qui lancent l’activation. « Pénétration » ne signifie donc pas que le spermatozoïde intact nage librement jusqu’au centre de l’ovocyte.

> **Précision scientifique.** Le PDF attribue la traversée à l’action des enzymes et à la propulsion du flagelle. Ces facteurs contribuent, mais la fécondation mammalienne repose aussi sur des reconnaissances moléculaires, des remaniements membranaires et la fusion des deux membranes plasmatiques.

> **Astuce mémoire — A-Z-M :** réaction **a**crosomique, franchissement de la **z**one, fusion des **m**embranes.
`,
    keyPoint: "La réaction acrosomique facilite la traversée locale de la zone pellucide ; la fusion des membranes gamétiques déclenche ensuite l’activation de l’ovocyte.",
    example: "Voir un spermatozoïde dans l’espace périvitellin prouve qu’il a franchi la zone pellucide, mais la fusion avec la membrane ovocytaire reste l’étape décisive suivante.",
    methodSteps: [
      "Vérifie d’abord que le spermatozoïde a subi la capacitation.",
      "Distingue traversée du cumulus, réaction acrosomique et traversée de la zone.",
      "Place la fusion membranaire après l’arrivée dans l’espace périvitellin.",
      "Relie la fusion au signal d’activation ovocytaire.",
    ],
    interaction: timeline(
      "Du cumulus au cytoplasme ovocytaire",
      "Ouvre chaque étape et indique l’enveloppe franchie ou la membrane concernée.",
      [
        { label: "Cumulus", shortLabel: "Cellules externes", detail: "Le spermatozoïde hyperactivé progresse entre les cellules folliculaires entourant l’ovocyte." },
        { label: "Zone pellucide", shortLabel: "Contact", detail: "Des interactions moléculaires avec la matrice glycoprotéique participent à la reconnaissance et à l’engagement." },
        { label: "Réaction acrosomique", shortLabel: "Acrosome", detail: "La tête spermatique libère du contenu acrosomial et expose des domaines nécessaires à la suite." },
        { label: "Traversée locale", shortLabel: "Zone franchie", detail: "Enzymes, remaniements de surface et force motrice contribuent ensemble au passage." },
        { label: "Espace périvitellin", shortLabel: "Dernier espace", detail: "Le spermatozoïde se trouve entre la zone pellucide et la membrane plasmique ovocytaire." },
        { label: "Fusion membranaire", shortLabel: "Activation", detail: "La fusion des membranes gamétiques fait entrer le noyau spermatique et déclenche les signaux d’activation." },
      ],
      "La zone pellucide est franchie avant la membrane ovocytaire : traversée et fusion ne sont pas le même événement.",
    ),
    questions: [
      choice("Quelle structure coiffe la tête du spermatozoïde ?", ["L’acrosome", "Le blastocèle", "Le trophoblaste", "Le corps jaune"], 0, "L’acrosome est une vésicule spécialisée située à l’avant du noyau.", "Figure 7 • page 2"),
      choice("Quel événement suit normalement la capacitation ?", ["La nidation", "La réaction acrosomique au contact des enveloppes", "La segmentation", "La sécrétion de hCG"], 1, "La capacitation rend le spermatozoïde apte à accomplir la réaction acrosomique."),
      choice("Quelle enveloppe est traversée avant la membrane ovocytaire ?", ["L’endomètre", "Le myomètre", "La zone pellucide", "Le placenta"], 2, "Le spermatozoïde gagne d’abord l’espace périvitellin.", "Figure 7 • page 2"),
      choice("Quel événement déclenche directement les signaux d’activation ovocytaire ?", ["Le dépôt vaginal", "L’ovulation seule", "Le passage du col", "La fusion des membranes gamétiques"], 3, "La fusion introduit le facteur spermatique qui déclenche notamment des oscillations de calcium."),
      trueFalse("La réaction acrosomique consiste à faire disparaître toute la zone pellucide autour de l’ovocyte.", false, "Le franchissement est local et résulte de plusieurs mécanismes."),
      choice("À quoi contribue la motilité hyperactivée ?", ["À la progression mécanique dans les enveloppes", "À la production de hCG", "À la formation du blastocèle", "À la sécrétion de progestérone"], 0, "La motilité agit avec les remaniements membranaires et acrosomiaux."),
      choice("Où se trouve le spermatozoïde juste après avoir franchi la zone pellucide ?", ["Dans l’endomètre", "Dans l’espace périvitellin", "Dans le pronoyau femelle", "Dans le corps jaune"], 1, "Il doit encore fusionner avec la membrane ovocytaire."),
      choice("Quel composant spermatique porte l’essentiel du patrimoine chromosomique paternel ?", ["Le flagelle", "L’acrosome", "Le noyau", "La pièce intermédiaire seule"], 2, "Le noyau spermatique haploïde formera le pronoyau mâle."),
      choice("Quelle formulation est la plus complète ?", ["Le flagelle perce seul l’ovocyte", "Les enzymes dissolvent tout", "Le spermatozoïde entre sans reconnaissance", "Enzymes, motilité, interactions et fusion coopèrent"], 3, "La fécondation est une succession coordonnée de phénomènes mécaniques et moléculaires."),
      short("Nomme la libération du contenu de la vésicule située sur la tête spermatique.", ["réaction acrosomique", "la réaction acrosomique", "reaction acrosomique"], "Cette réaction modifie la tête et facilite le franchissement de la zone pellucide."),
      short("Nomme l’espace compris entre zone pellucide et membrane de l’ovocyte.", ["espace périvitellin", "l’espace périvitellin", "espace perivitellin"], "Le spermatozoïde y arrive avant la fusion membranaire."),
    ],
    corrections: [
      "La traversée de la zone pellucide n’est pas attribuée aux seules enzymes acrosomiales et au flagelle : interactions moléculaires, remodelage membranaire et motilité coopèrent.",
      "La fusion des membranes plasmatiques est distinguée de la simple pénétration dans l’espace périvitellin.",
      "Le spermatozoïde n’est pas décrit comme entrant intact et fonctionnel jusqu’au centre de l’ovocyte.",
    ],
  },
  {
    id: "ovocyte-activation",
    title: "Activer l’ovocyte et limiter la polyspermie",
    summary: "Relier signal calcique, réaction corticale, modification de la zone pellucide et achèvement de la méiose II.",
    pages: "2-3",
    section: "I. Activation de l’ovocyte II",
    durationMinutes: 27,
    xp: 70,
    body: String.raw`
## Une cascade déclenchée par la fusion

La fusion avec le spermatozoïde déclenche dans l’ovocyte des oscillations de calcium ($\mathrm{Ca}^{2+}$). Ce signal coordonne plusieurs événements presque simultanés :

- exocytose des **granules corticaux** ;
- modification biochimique et structurale de la **zone pellucide** ;
- réduction de la capacité d’autres spermatozoïdes à la franchir ;
- reprise puis achèvement de la **méiose II** ;
- émission du **deuxième globule polaire** ;
- préparation du matériel chromosomique maternel au pronoyau femelle.

Le PDF nomme l’enveloppe modifiée « membrane de fécondation ». Cette expression convient à certains organismes, mais chez les mammifères on décrit plus précisément une **réaction corticale** suivie d’une **réaction de la zone pellucide**. La zone est durcie et ses propriétés de liaison sont modifiées ; une nouvelle membrane complète ne se dresse pas autour de l’œuf comme chez certains animaux aquatiques.

## Monospermie : un objectif, pas une garantie absolue

La modification de la zone constitue un mécanisme majeur de blocage de la polyspermie. Elle diminue fortement l’entrée d’autres spermatozoïdes, car une fécondation polyspermique produit un nombre anormal de lots chromosomiques et conduit généralement à un développement non viable. Le blocage n’est toutefois pas absolu : des polyspermies pathologiques existent.

| Avant activation | Signal | Après activation |
|---|---|---|
| ovocyte II bloqué en métaphase II | oscillations de Ca²⁺ | méiose II achevée |
| granules corticaux stockés | exocytose | zone pellucide modifiée |
| un premier globule polaire | séparation méiotique finale | deuxième globule polaire |

> **Correction scientifique.** Chez les mammifères, parle de réaction corticale et de réaction de la zone, pas d’une « membrane de fécondation » nouvellement construite. Le mécanisme favorise la monospermie sans rendre toute polyspermie impossible.

> **Astuce mémoire — Ca²⁺ commande C-Z-M :** réaction **c**orticale, modification de la **z**one, reprise de la **m**éiose.
`,
    keyPoint: "L’activation ovocytaire associe oscillations de Ca²⁺, exocytose corticale, réaction de la zone et achèvement de la méiose II avec émission du deuxième globule polaire.",
    example: "Après fusion membranaire, l’apparition d’un deuxième globule polaire montre l’achèvement de la méiose II ; elle ne prouve pas encore la première mitose.",
    methodSteps: [
      "Place la fusion membranaire avant le signal calcique.",
      "Relie le calcium à l’exocytose des granules corticaux.",
      "Nomme la réaction de la zone et son rôle anti-polyspermie.",
      "Termine par l’achèvement de la méiose II et le deuxième globule polaire.",
    ],
    interaction: diagram(
      "Déplier la cascade d’activation",
      "Sélectionne chaque branche et rattache-la soit au cytoplasme, soit aux enveloppes, soit au noyau maternel.",
      "Fusion des membranes gamétiques",
      "La fusion déclenche des oscillations de calcium qui coordonnent les transformations corticales et méiotiques de l’ovocyte.",
      [
        { id: "calcium", label: "Oscillations de Ca²⁺", role: "Signal intracellulaire", detail: "Des hausses répétées de calcium diffusent dans l’ovocyte et synchronisent plusieurs réponses.", group: "Déclencher" },
        { id: "cortical", label: "Exocytose corticale", role: "Granules libérés", detail: "Les granules corticaux fusionnent avec la membrane plasmique et libèrent leur contenu dans l’espace périvitellin.", group: "Enveloppes" },
        { id: "zona", label: "Réaction de la zone", role: "Propriétés modifiées", detail: "La zone pellucide devient beaucoup moins permissive à d’autres spermatozoïdes.", group: "Enveloppes" },
        { id: "meiosis", label: "Méiose II achevée", role: "Séparation maternelle", detail: "Le fuseau méiotique reprend et sépare le lot destiné au deuxième globule polaire.", group: "Noyau" },
        { id: "polar", label: "Deuxième globule polaire", role: "Témoin visible", detail: "Son émission accompagne l’achèvement de la deuxième division méiotique.", group: "Noyau" },
        { id: "monospermy", label: "Monospermie favorisée", role: "Risque réduit", detail: "Le blocage diminue fortement les entrées supplémentaires, sans être une barrière absolue dans tous les cas pathologiques.", group: "Résultat" },
      ],
      "L’activation touche à la fois les enveloppes et le matériel chromosomique : elle ne se résume pas à fermer une porte.",
    ),
    questions: [
      choice("Quel signal intracellulaire coordonne l’activation ovocytaire ?", ["Des oscillations de Ca²⁺", "Une chute absolue d’ATP", "La hCG maternelle", "La progestérone du placenta"], 0, "Les oscillations calciques déclenchent notamment l’exocytose corticale."),
      choice("Que libèrent les granules corticaux ?", ["Des chromosomes", "Leur contenu dans l’espace périvitellin", "Des spermatozoïdes", "Du sang maternel"], 1, "L’exocytose se fait sous la zone pellucide.", "Figure 7 • page 2"),
      choice("Quelle expression est la plus précise chez les mammifères ?", ["Coquille calcaire", "Membrane vitelline végétale", "Réaction de la zone pellucide", "Paroi cellulosique"], 2, "La zone pellucide est modifiée après réaction corticale."),
      choice("Quel événement méiotique suit l’activation ?", ["Le début de la méiose I", "Une nouvelle ovogonie", "Une mitose du globule polaire", "L’achèvement de la méiose II"], 3, "L’ovocyte II termine sa seconde division méiotique."),
      trueFalse("La réaction de la zone rend toute polyspermie biologiquement impossible.", false, "Elle réduit fortement le risque, mais des polyspermies pathologiques existent."),
      choice("Quel élément est émis lors de l’achèvement de la méiose II ?", ["Le deuxième globule polaire", "Le blastocyste", "Le corps jaune", "Le placenta"], 0, "Ce petit produit cellulaire reçoit le lot chromosomique éliminé."),
      choice("Où étaient stockés les granules avant leur exocytose ?", ["Dans la zone pellucide", "Dans le cortex ovocytaire", "Dans le flagelle", "Dans l’endomètre"], 1, "Ils sont disposés sous la membrane plasmique."),
      choice("Pourquoi la polyspermie est-elle problématique ?", ["Elle empêche l’ovulation", "Elle détruit le pavillon", "Elle introduit des lots chromosomiques supplémentaires", "Elle bloque toujours la capacitation"], 2, "Plus d’un noyau spermatique produit une ploïdie anormale."),
      choice("Quel ordre est correct ?", ["Méiose II → fusion → calcium", "Zone modifiée → fusion → calcium", "Globule polaire → capacitation → fusion", "Fusion → Ca²⁺ → réaction corticale"], 3, "La fusion déclenche le signal calcique puis l’exocytose corticale."),
      short("Nomme le petit produit cellulaire émis à la fin de la deuxième division méiotique.", ["deuxième globule polaire", "2e globule polaire", "second globule polaire", "le deuxième globule polaire"], "Son émission marque l’achèvement de la méiose II.", "Analyse • page 3"),
      short("Nomme l’entrée de plusieurs spermatozoïdes dans un même ovocyte.", ["polyspermie", "la polyspermie"], "La réaction de la zone vise à prévenir cette anomalie."),
    ],
    corrections: [
      "La « membrane de fécondation » de la source est corrigée en réaction corticale puis réaction de la zone pellucide, formulation adaptée aux mammifères.",
      "Le blocage de la polyspermie est présenté comme très efficace mais non absolu.",
      "Les oscillations calciques, absentes du résumé source, sont ajoutées pour relier fusion membranaire, exocytose corticale et reprise méiotique.",
    ],
  },
  {
    id: "pronuclei-zygote",
    title: "Former les pronoyaux et organiser le zygote",
    summary: "Suivre la décondensation du noyau spermatique, la formation des deux pronoyaux et leur préparation à la première mitose.",
    pages: "2-3",
    section: "II. Formation des pronoyaux et de la cellule-œuf",
    durationMinutes: 28,
    xp: 75,
    body: String.raw`
## Deux patrimoines encore séparés

Après la fusion des membranes gamétiques, le noyau du spermatozoïde pénètre dans le cytoplasme ovocytaire. Sa chromatine très condensée se décondense et s’entoure d’une enveloppe nucléaire : c’est le **pronoyau mâle**. En parallèle, l’ovocyte achève sa méiose II, émet le deuxième globule polaire et organise son lot haploïde en **pronoyau femelle**.

Chez l’être humain, chaque pronoyau porte un lot haploïde de $n=23$ chromosomes. Leur réunion fonctionnelle rétablit le nombre diploïde $2n=46$ dans la lignée issue du zygote.

Les deux pronoyaux :

- contiennent chacun un lot haploïde de chromosomes ;
- répliquent leur ADN avant la première division ;
- se rapprochent grâce au cytosquelette ;
- restent un temps entourés de deux enveloppes distinctes.

Le cytoplasme provient presque entièrement de l’ovocyte. Chez l’être humain, les mitochondries paternelles apportées par le spermatozoïde sont généralement éliminées ; l’ADN mitochondrial est donc transmis essentiellement par la mère.

## De la « caryogamie » à la première mitose

La source définit la **caryogamie** comme la fusion des deux noyaux. Cette formule scolaire indique correctement la réunion fonctionnelle des patrimoines parentaux, mais elle ne décrit pas précisément la cytologie des mammifères. Les deux pronoyaux ne forment pas d’abord un gros noyau unique par fusion littérale de leurs enveloppes. Leurs enveloppes se désassemblent ; les chromosomes maternels et paternels s’alignent ensuite sur un **premier fuseau mitotique commun**.

| Avant la première mitose | Transformation | Résultat |
|---|---|---|
| pronoyau mâle haploïde | réplication de l’ADN | chromosomes paternels dupliqués |
| pronoyau femelle haploïde | réplication de l’ADN | chromosomes maternels dupliqués |
| deux enveloppes pronucléaires | désassemblage | accès au fuseau commun |
| deux lots parentaux | organisation mitotique | deux cellules filles diploïdes après division |

On nomme **zygote** ou **cellule-œuf** la cellule unique issue de la fécondation. La diploïdie correspond à l’association des deux lots haploïdes parentaux ; elle ne signifie pas que les chromosomes se mélangent ou perdent leur origine.

> **Correction scientifique.** Chez les mammifères, les enveloppes pronucléaires se désassemblent avant la première mitose. Dire que les pronoyaux « fusionnent » est un raccourci ; les chromosomes parentaux se réunissent fonctionnellement sur un fuseau commun.

> **Astuce mémoire — 2P puis 1F :** deux **p**ronoyaux se rapprochent, puis un premier **f**useau organise les deux patrimoines.
`,
    keyPoint: "Le zygote possède deux patrimoines haploïdes dans deux pronoyaux ; après réplication et désassemblage des enveloppes, leurs chromosomes s’organisent sur le premier fuseau mitotique commun.",
    example: "Une cellule contenant deux pronoyaux et deux globules polaires est un zygote avant sa première division, pas encore un embryon à deux cellules.",
    methodSteps: [
      "Relie le pronoyau mâle à la décondensation du noyau spermatique.",
      "Relie le pronoyau femelle à l’achèvement de la méiose II.",
      "Place la réplication de l’ADN avant la première mitose.",
      "Remplace l’idée d’une fusion littérale par le désassemblage des enveloppes et le fuseau commun.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Explorer le zygote au stade pronucléaire",
      instruction: "Sélectionne les repères, puis explique comment deux pronoyaux distincts préparent une division commune.",
      viewBox: "0 0 720 450",
      caption: "Reconstruction pédagogique originale du stade pronucléaire ; aucune figure du document source n’est reproduite.",
      shapes: pronuclearShapes,
      hotspots: pronuclearHotspots,
      observation: "Les deux pronoyaux ne sont pas les deux cellules d’un embryon : ils appartiennent encore à la même cellule-œuf.",
    },
    questions: [
      choice("Que devient le noyau spermatique après son entrée dans l’ovocyte ?", ["Il se décondense et forme le pronoyau mâle", "Il devient le deuxième globule polaire", "Il forme directement le trophoblaste", "Il disparaît avant de transmettre son ADN"], 0, "La chromatine paternelle se décondense et s’entoure d’une enveloppe pronucléaire.", "Figures 4-6 • page 2"),
      choice("Quelle structure contient le lot chromosomique maternel après la méiose II ?", ["L’acrosome", "Le pronoyau femelle", "La corona radiata", "Le blastocèle"], 1, "Le pronoyau femelle est formé à partir du lot maternel conservé dans l’ovocyte."),
      choice("Quel événement doit précéder la première mitose ?", ["La nidation", "La formation du placenta", "La réplication de l’ADN des deux pronoyaux", "L’ovulation suivante"], 2, "Chaque patrimoine parental doit être répliqué avant la séparation mitotique."),
      choice("Que deviennent les enveloppes des pronoyaux avant la première mitose ?", ["Elles forment la zone pellucide", "Elles deviennent les membranes des blastomères", "Elles restent fermées pendant toute la division", "Elles se désassemblent"], 3, "Le désassemblage permet aux chromosomes parentaux de rejoindre le fuseau commun."),
      trueFalse("Les deux pronoyaux constituent déjà deux cellules différentes.", false, "Ils sont deux compartiments nucléaires au sein d’une seule cellule-œuf."),
      choice("Quel terme désigne la cellule unique issue de la fécondation ?", ["Zygote", "Morula", "Blastocyste", "Trophoblaste"], 0, "Le zygote est la cellule-œuf avant sa première segmentation."),
      choice("Quelle origine a l’essentiel du cytoplasme du zygote ?", ["Le spermatozoïde", "L’ovocyte", "Le placenta", "La trompe"], 1, "L’ovocyte fournit presque tout le cytoplasme et les organites initiaux."),
      choice("Comment les patrimoines parentaux sont-ils réunis avec précision chez les mammifères ?", ["Par mélange des chromosomes dans la zone pellucide", "Par fusion des globules polaires", "Par organisation sur un premier fuseau mitotique commun", "Par migration dans l’endomètre"], 2, "Les enveloppes pronucléaires se désassemblent puis les chromosomes partagent un fuseau."),
      choice("Quel héritage est principalement maternel chez l’être humain ?", ["Tous les chromosomes nucléaires", "Le chromosome Y", "L’acrosome", "L’ADN mitochondrial"], 3, "Les mitochondries paternelles sont généralement éliminées."),
      short("Nomme le noyau haploïde issu de la décondensation du noyau spermatique.", ["pronoyau mâle", "le pronoyau mâle", "pronoyau male", "pronucleus mâle"], "Il porte le patrimoine chromosomique paternel."),
      short("Nomme la cellule unique avant sa première division de segmentation.", ["zygote", "le zygote", "cellule-œuf", "cellule oeuf"], "Le zygote contient les deux patrimoines parentaux."),
    ],
    corrections: [
      "La caryogamie est reformulée : les enveloppes des pronoyaux se désassemblent avant que les chromosomes parentaux ne s’organisent sur un fuseau mitotique commun ; il n’y a pas de fusion littérale préalable en un noyau unique.",
      "Deux pronoyaux dans une cellule ne sont pas confondus avec deux blastomères.",
      "La réplication de l’ADN et la contribution cytoplasmique principalement maternelle sont explicitées pour compléter la séquence source.",
    ],
  },
  {
    id: "cleavage-morula",
    title: "Segmenter sans grandir jusqu’à la morula",
    summary: "Relier mitoses, réduction de la taille des blastomères, compaction et migration tubaire jusqu’au stade morula.",
    pages: "4",
    section: "III. Segmentation et migration de l’œuf",
    durationMinutes: 29,
    xp: 80,
    body: String.raw`
## Des mitoses dans une enveloppe de volume presque constant

Après la première mitose, le zygote donne deux **blastomères**, puis 4, 8, 16 cellules et davantage. Dans un modèle de divisions parfaitement synchrones, après $k$ divisions le nombre de cellules serait $N=2^k$ ; en réalité, les divisions peuvent devenir asynchrones. Cette succession de mitoses est appelée **segmentation** ou clivage. Durant ces premières divisions, l’embryon reste dans la zone pellucide et son volume global augmente très peu : chaque blastomère devient donc progressivement plus petit.

| Stade indicatif humain | Nombre de cellules | Transformation dominante |
|---|---:|---|
| J1 environ | 2 | première division de segmentation |
| J2 environ | 4 | divisions asynchrones possibles |
| J3 environ | 8 | début de compaction |
| J3-J4 environ | 16 à 32 | morula compacte |

Ces repères sont des moyennes observées chez l’être humain. Le rythme varie entre embryons et diffère selon les espèces de mammifères. Il faut donc éviter de transformer chaque jour en frontière absolue.

## Compaction et transport tubaire

À partir d’environ huit cellules, les blastomères augmentent leurs contacts, se polarisent et forment une masse plus cohésive : c’est la **compaction**. Le stade compact d’environ 16 à 32 cellules est nommé **morula**, par analogie avec une petite mûre.

Pendant la segmentation, l’embryon migre de l’ampoule vers l’utérus. Les cils de l’épithélium tubaire, les contractions de la trompe et les sécrétions locales participent au transport. Les blastomères ne propulsent pas l’embryon comme des cellules munies d’un appareil locomoteur.

La zone pellucide joue encore un rôle protecteur et empêche une adhésion prématurée à la paroi tubaire. La morula atteint habituellement la cavité utérine vers J3-J4, puis poursuit sa transformation.

> **Correction scientifique.** La segmentation augmente le nombre de cellules **sans croissance globale notable** de l’embryon. La mention « morula au 4e jour » du PDF est un repère approximatif : chez l’humain, elle apparaît généralement vers J3-J4.

> **Astuce mémoire — N augmente, V reste :** le **n**ombre de blastomères augmente tandis que le **v**olume embryonnaire total reste presque stable.
`,
    keyPoint: "La segmentation multiplie les blastomères à volume embryonnaire presque constant ; la compaction conduit à une morula de 16 à 32 cellules vers J3-J4 chez l’humain.",
    example: "Si un embryon passe de 2 à 8 blastomères sans croissance globale, le volume moyen d’un blastomère est approximativement divisé par quatre.",
    methodSteps: [
      "Compte les divisions successives sans supposer une croissance entre elles.",
      "Relie l’augmentation du nombre cellulaire à la diminution de la taille des blastomères.",
      "Place la compaction autour du stade huit cellules.",
      "Associe morula, 16 à 32 cellules, J3-J4 et arrivée dans l’utérus comme repères approximatifs.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Échantillons à explorer",
      title: "Le nombre double, le volume total reste presque stable",
      instruction: "Déplace le curseur entre 1 et 32 cellules et observe le volume embryonnaire total relatif pendant la segmentation.",
      formula: "Volume embryonnaire total relatif selon le nombre de blastomères",
      formulaTex: "V_{\\mathrm{embryon}} \\simeq \\mathrm{constante}",
      rule: { kind: "samples", points: [[1, 1], [2, 1], [4, 1], [8, 1], [16, 1], [32, 1]] },
      window: { xMin: 1, xMax: 32, yMin: 0.75, yMax: 1.25 },
      guides: [{ kind: "horizontal", value: 1, label: "Volume total ≈ constant" }],
      marker: { min: 1, max: 32, step: 1, initial: 8 },
      observation: "Cette représentation conceptuelle ne mesure pas un embryon particulier : elle rend visible le principe du clivage sans croissance globale notable.",
    },
    questions: [
      choice("Comment nomme-t-on les cellules issues des premières divisions du zygote ?", ["Blastomères", "Ovogonies", "Trophoblastes maternels", "Spermatozoïdes"], 0, "Les blastomères sont les cellules du jeune embryon en segmentation.", "Figure 8 • page 4"),
      choice("Que devient la taille moyenne des blastomères pendant les premiers clivages ?", ["Elle double", "Elle diminue", "Elle reste toujours identique à celle du zygote", "Elle devient celle d’un ovocyte"], 1, "Le volume global reste presque constant tandis que le nombre cellulaire augmente."),
      choice("À partir de quel ordre de grandeur la compaction devient-elle nette chez l’humain ?", ["Un pronoyau", "Deux spermatozoïdes", "Environ huit cellules", "Un placenta mature"], 2, "La compaction accompagne le stade d’environ huit cellules."),
      choice("Quel stade compte typiquement 16 à 32 cellules compactées ?", ["Le follicule", "Le pronoyau", "Le blastocèle", "La morula"], 3, "La morula ressemble à une petite mûre compacte.", "Figure 8 • page 4"),
      trueFalse("La segmentation précoce s’accompagne d’une forte augmentation du volume total de l’embryon.", false, "Les cellules deviennent plus nombreuses et plus petites dans la zone pellucide."),
      choice("Quel repère temporel convient le mieux à la morula humaine ?", ["Vers J3-J4", "Toujours exactement J1", "Vers le sixième mois", "Après la naissance"], 0, "La morula apparaît habituellement au cours des troisième et quatrième jours."),
      choice("Quel mécanisme contribue au déplacement tubaire de l’embryon ?", ["La nage des blastomères", "Les cils et contractions de la trompe", "La hCG du placenta mature", "La contraction du cordon ombilical"], 1, "Le transport dépend surtout de l’activité tubaire et des fluides locaux."),
      choice("Quel intérêt présente encore la zone pellucide pendant le transport ?", ["Elle fabrique les chromosomes", "Elle forme l’endomètre", "Elle limite une adhésion tubaire prématurée", "Elle produit la progestérone"], 2, "L’embryon reste enfermé jusqu’à l’éclosion du blastocyste."),
      choice("Quel ordre de nombres cellulaires est cohérent ?", ["8 → 4 → 2 → 1", "1 → 8 → 2 → 16", "32 → 4 → 16 → 2", "1 → 2 → 4 → 8"], 3, "Chaque division accroît progressivement le nombre de blastomères."),
      short("Nomme le phénomène qui rend les blastomères plus cohésifs vers huit cellules.", ["compaction", "la compaction"], "La compaction établit des contacts serrés et une polarisation cellulaire."),
      short("Nomme le clivage mitotique répété du zygote sans croissance globale notable.", ["segmentation", "la segmentation", "clivage", "le clivage"], "Segmentation et clivage désignent les premières divisions embryonnaires."),
    ],
    corrections: [
      "La segmentation est explicitement décrite comme une multiplication cellulaire sans croissance globale notable.",
      "Le stade morula est situé vers J3-J4 chez l’être humain, et non fixé à un instant universel ; le calendrier varie selon l’embryon et l’espèce.",
      "Le transport tubaire est attribué aux cils, aux contractions et au milieu tubaire, pas à une motilité autonome de l’embryon.",
    ],
  },
  {
    id: "blastocyst-hatching",
    title: "Passer de la morula au blastocyste et éclore",
    summary: "Identifier trophoblaste, embryoblaste et blastocèle, puis expliquer l’éclosion préalable à l’implantation.",
    pages: "4-5",
    section: "III. Du stade morula au blastocyste",
    durationMinutes: 28,
    xp: 90,
    body: String.raw`
## Une morula qui se creuse et se spécialise

Dans la cavité utérine, du liquide pénètre entre les cellules de la morula. De petites cavités confluent pour former le **blastocèle** : ce processus est la cavitation. L’embryon devient alors un **blastocyste**, organisé en deux ensembles cellulaires principaux.

| Partie du blastocyste | Position | Devenir général |
|---|---|---|
| trophoblaste | couche cellulaire externe | participation au chorion et à la partie fœtale du placenta |
| embryoblaste | masse cellulaire interne | formation de l’embryon proprement dit et de tissus extraembryonnaires |
| blastocèle | cavité interne liquidienne | organisation spatiale du blastocyste |

L’embryoblaste se concentre à un côté : le **pôle embryonnaire**. C’est habituellement par cette région que le blastocyste s’appose contre l’endomètre.

## Sortir de la zone pellucide

Le blastocyste humain est reconnaissable vers **J5** après la fécondation. Il augmente alors de volume par entrée de liquide et amincit la zone pellucide. Vers **J5-J6**, il s’en libère : c’est l’**éclosion** ou hatching. Tant qu’il reste enfermé, le trophoblaste ne peut pas adhérer directement à l’épithélium utérin.

Après l’éclosion, le blastocyste reste brièvement libre dans la cavité utérine, s’oriente puis entre en apposition avec un endomètre réceptif. L’implantation débute généralement vers **J6-J7**. Les jours indiqués constituent une chronologie humaine moyenne ; les vitesses de développement varient, et les autres mammifères ont leurs propres calendriers.

| J3-J4 | J5 | J5-J6 | J6-J7 |
|---|---|---|---|
| morula compacte | blastocyste cavitaire | éclosion de la zone | début de l’implantation |

> **Correction scientifique.** Le blastocyste ne s’implante pas tout en restant enfermé dans la zone pellucide. L’éclosion vers J5-J6 précède l’adhésion, qui commence habituellement vers J6-J7 chez l’être humain.

> **Astuce mémoire — T-E-B :** **t**rophoblaste dehors, **e**mbryoblaste à un pôle, **b**lastocèle au centre.
`,
    keyPoint: "Vers J5, la cavitation transforme la morula en blastocyste ; l’éclosion de la zone pellucide vers J5-J6 rend possible le début de l’implantation vers J6-J7.",
    example: "Un embryon possédant une cavité, une couche périphérique et une masse cellulaire interne est un blastocyste, même s’il termine encore son éclosion.",
    methodSteps: [
      "Cherche d’abord une cavité pour distinguer blastocyste et morula.",
      "Repère la couche externe et nomme-la trophoblaste.",
      "Localise l’embryoblaste au pôle embryonnaire.",
      "Place l’éclosion avant apposition, adhésion et invasion de l’endomètre.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Explorer un blastocyste en éclosion",
      instruction: "Active chaque repère, puis justifie pourquoi cette organisation est prête à rencontrer l’endomètre.",
      viewBox: "0 0 720 450",
      caption: "Blastocyste schématisé de façon originale à partir des notions du cours ; aucune microphotographie du PDF n’est republiée.",
      shapes: blastocystShapes,
      hotspots: blastocystHotspots,
      observation: "La zone pellucide s’ouvre, mais le blastocyste reste organisé : trophoblaste externe, blastocèle et embryoblaste polaire.",
    },
    questions: [
      choice("Quelle cavité caractérise le blastocyste ?", ["Le blastocèle", "L’acrosome", "L’espace synaptique", "Le canal déférent"], 0, "Le blastocèle apparaît par confluence de cavités liquidiennes.", "Figure 8 • page 4"),
      choice("Quelle couche cellulaire est la plus externe ?", ["L’embryoblaste", "Le trophoblaste", "Le globule polaire", "Le myomètre"], 1, "Le trophoblaste forme l’enveloppe cellulaire du blastocyste."),
      choice("Quelle structure donnera l’essentiel de l’embryon proprement dit ?", ["La zone pellucide", "Le blastocèle", "L’embryoblaste", "La corona radiata"], 2, "La masse cellulaire interne est à l’origine de l’embryon."),
      choice("Quel événement permet le contact direct du trophoblaste avec l’endomètre ?", ["La capacitation", "L’ovulation", "La méiose I", "L’éclosion de la zone pellucide"], 3, "Le blastocyste doit sortir de la zone avant d’adhérer."),
      trueFalse("Une morula possède déjà un grand blastocèle bien individualisé.", false, "Le blastocèle apparaît lors de la transformation en blastocyste."),
      choice("Quel repère temporel convient au blastocyste humain ?", ["Vers J5", "Toujours exactement J1", "Vers le cinquième mois", "Après la placentation complète"], 0, "Le blastocyste se forme habituellement autour du cinquième jour."),
      choice("Quand l’éclosion se produit-elle généralement chez l’humain ?", ["Avant la fécondation", "Vers J5-J6", "Après la naissance", "Uniquement après J30"], 1, "La zone pellucide s’amincit puis s’ouvre avant l’implantation."),
      choice("Où se trouve l’embryoblaste ?", ["Dans la trompe maternelle", "À l’extérieur de la zone", "À un pôle du blastocyste", "Dans le corps jaune"], 2, "Sa position définit le pôle embryonnaire."),
      choice("Quel ordre est correct ?", ["Implantation → morula → fécondation", "Blastocyste → zygote → ovulation", "Éclosion → morula → segmentation", "Morula → blastocyste → éclosion"], 3, "La cavitation précède l’éclosion du blastocyste."),
      short("Nomme la masse cellulaire interne du blastocyste.", ["embryoblaste", "l’embryoblaste", "bouton embryonnaire", "masse cellulaire interne"], "L’embryoblaste se situe au pôle embryonnaire."),
      short("Nomme la sortie du blastocyste hors de la zone pellucide.", ["éclosion", "l’éclosion", "hatching", "eclosion"], "L’éclosion est indispensable au contact trophoblaste-endomètre."),
    ],
    corrections: [
      "La chronologie humaine est précisée : morula vers J3-J4, blastocyste vers J5, éclosion vers J5-J6 et début d’implantation vers J6-J7.",
      "L’éclosion, omise ou peu développée dans la source, est placée comme préalable nécessaire à l’adhésion endométriale.",
      "Les repères humains sont présentés comme des moyennes et non comme un calendrier identique chez tous les mammifères.",
    ],
  },
  {
    id: "implantation-hcg",
    title: "Implanter le blastocyste et établir le dialogue hormonal",
    summary: "Distinguer apposition, adhésion et invasion, expliquer l’action de la hCG et reconnaître les deux composantes du placenta.",
    pages: "4-5",
    section: "III. Nidation et devenir du trophoblaste",
    durationMinutes: 31,
    xp: 100,
    body: String.raw`
## Un endomètre préparé avant l’arrivée de l’embryon

Après l’ovulation, le corps jaune sécrète surtout de la **progestérone**, sous l’influence initiale de la LH. Avec les œstrogènes, cette hormone rend l’endomètre épais, vascularisé, sécrétoire et réceptif. Cette préparation commence donc avant que le blastocyste ne s’implante.

L’implantation, ou **nidation**, suit trois opérations continues :

1. **apposition** du pôle embryonnaire contre l’épithélium utérin ;
2. **adhésion** stable du trophoblaste à l’endomètre ;
3. **invasion** progressive du tissu endométrial.

Le fascicule résume cette invasion par l’action d’« une enzyme ». En réalité, le syncytiotrophoblaste mobilise plusieurs protéases, molécules d’adhérence et remaniements contrôlés de la matrice extracellulaire. Il faut donc retenir un processus cellulaire coordonné, et non l’action isolée d’une enzyme unique.

Chez l’être humain, elle débute habituellement vers **J6-J7** après la fécondation et est en grande partie achevée vers **J10-J12**. Ces dates sont indicatives.

## Le trophoblaste devient invasif et endocrine

Le trophoblaste se différencie notamment en :

- **cytotrophoblaste**, couche interne faite de cellules individualisées et proliférantes ;
- **syncytiotrophoblaste**, masse externe plurinucléée, invasive, qui s’insinue dans l’endomètre.

Très tôt, le syncytiotrophoblaste sécrète la **hCG**, gonadotrophine chorionique humaine. La hCG maintient le corps jaune, qui poursuit la sécrétion de progestérone. L’endomètre est ainsi maintenu et les règles ne surviennent pas. Les tests biologiques de grossesse détectent cette hormone dans le sang puis dans les urines ; ils ne détectent pas directement le blastocyste.

## Le placenta a deux partenaires

Le placenta n’est ni entièrement embryonnaire ni entièrement maternel. Sa composante **fœtale** dérive du chorion et du trophoblaste ; sa composante **maternelle** dérive de l’endomètre transformé, en particulier la décidua basale. Les circulations maternelle et fœtale y sont proches pour les échanges sans se confondre normalement en un même sang.

| Acteur | Signal ou structure | Effet majeur précoce |
|---|---|---|
| corps jaune | progestérone | maintien d’un endomètre sécrétoire |
| syncytiotrophoblaste | hCG | maintien du corps jaune |
| tissu fœtal + tissu maternel | placenta en formation | échanges et fonctions endocrines ultérieures |

> **Corrections scientifiques.** La hCG est sécrétée précocement par le **syncytiotrophoblaste**. Le placenta réunit des composantes fœtale et maternelle. L’implantation est généralement achevée vers J10-J12, mais dire que la « gestation commence au 11e jour » mélange un processus biologique continu avec des conventions : âge embryonnaire, âge gestationnel et définition clinique du début de grossesse ne prennent pas le même point zéro.

> **Astuce mémoire — H-C-P :** **h**CG maintient le **c**orps jaune, qui maintient la **p**rogestérone.
`,
    keyPoint: "L’implantation débute vers J6-J7 ; le syncytiotrophoblaste sécrète la hCG qui maintient le corps jaune et la progestérone, tandis que le placenta associe tissus fœtaux et maternels.",
    example: "Une hCG détectable signale une activité trophoblastique précoce : elle soutient le corps jaune, lequel maintient l’endomètre grâce à la progestérone.",
    methodSteps: [
      "Place la préparation progestative de l’endomètre avant l’arrivée du blastocyste.",
      "Décris apposition, adhésion puis invasion sans en faire trois événements isolés.",
      "Relie syncytiotrophoblaste, hCG, corps jaune et progestérone dans cet ordre.",
      "Distingue la composante fœtale du placenta de sa composante maternelle.",
    ],
    interaction: diagram(
      "Le dialogue blastocyste-endomètre",
      "Sélectionne chaque acteur et reconstruis la chaîne hormonale qui stabilise l’implantation.",
      "Implantation humaine précoce",
      "Un blastocyste éclos adhère à un endomètre déjà préparé ; son trophoblaste envahit le tissu et émet un signal hormonal de maintien.",
      [
        { id: "endometrium", label: "Endomètre réceptif", role: "Tissu maternel préparé", detail: "Sous l’action de la progestérone et des œstrogènes, il devient sécrétoire, vascularisé et apte à accueillir le blastocyste.", group: "Mère" },
        { id: "apposition", label: "Apposition et adhésion", role: "Premier contact", detail: "Le pôle embryonnaire se place contre l’épithélium puis le trophoblaste établit une adhésion stable.", group: "Interface" },
        { id: "cytotrophoblast", label: "Cytotrophoblaste", role: "Couche cellulaire", detail: "Ces cellules prolifèrent et contribuent au renouvellement du compartiment trophoblastique.", group: "Embryon" },
        { id: "syncytiotrophoblast", label: "Syncytiotrophoblaste", role: "Invasion + hCG", detail: "La couche externe plurinucléée envahit l’endomètre et sécrète précocement la hCG.", group: "Embryon" },
        { id: "corpus-luteum", label: "Corps jaune maintenu", role: "Réponse à la hCG", detail: "Il continue à produire de la progestérone au lieu de régresser en fin de cycle.", group: "Mère" },
        { id: "placenta", label: "Placenta en formation", role: "Deux composantes", detail: "Le chorion trophoblastique fœtal s’associe à la décidua maternelle pour construire l’organe d’échanges.", group: "Interface" },
      ],
      "Le signal hCG vient du tissu embryonnaire précoce, mais son effet immédiat s’exerce sur un organe maternel : le corps jaune.",
    ),
    questions: [
      choice("Quelle hormone prépare et maintient principalement l’endomètre sécrétoire après l’ovulation ?", ["La progestérone", "L’insuline", "L’adrénaline", "La thyroxine"], 0, "Le corps jaune sécrète la progestérone pendant la phase lutéale."),
      choice("Quelle étape suit l’apposition du blastocyste ?", ["La capacitation", "L’adhésion", "L’ovulation", "La méiose I"], 1, "L’adhésion stabilise le contact avant l’invasion."),
      choice("Quel tissu trophoblastique est directement invasif et plurinucléé ?", ["L’embryoblaste", "Le cytotrophoblaste seul", "Le syncytiotrophoblaste", "Le myomètre"], 2, "Le syncytiotrophoblaste s’insinue dans l’endomètre."),
      choice("Qui sécrète précocement la hCG ?", ["La corona radiata", "Le globule polaire", "La trompe", "Le syncytiotrophoblaste"], 3, "La hCG est un signal endocrine du trophoblaste implanté."),
      trueFalse("Le placenta est constitué uniquement de tissus provenant de l’embryon.", false, "Il associe une composante fœtale et une composante maternelle."),
      choice("Quel organe la hCG maintient-elle au début de la grossesse ?", ["Le corps jaune", "Le pavillon", "L’acrosome", "Le blastocèle"], 0, "Le corps jaune poursuit ainsi sa sécrétion de progestérone."),
      choice("Quel repère correspond au début habituel de l’implantation humaine ?", ["J1-J2", "J6-J7", "J20-J25 obligatoirement", "Après la naissance"], 1, "L’apposition survient généralement vers le sixième ou le septième jour."),
      choice("Vers quand l’implantation est-elle en grande partie achevée ?", ["Avant la fécondation", "Toujours exactement J5", "Vers J10-J12", "Au deuxième trimestre seulement"], 2, "Le blastocyste est alors inclus dans l’endomètre, avec cicatrisation de surface en cours ou achevée."),
      choice("Quelle composante placentaire est maternelle ?", ["Le chorion", "Le trophoblaste", "L’embryoblaste", "La décidua dérivée de l’endomètre"], 3, "La décidua basale est la composante maternelle en regard du chorion."),
      choice("Que détecte directement un test de grossesse hormonal ?", ["La hCG", "Le blastocèle", "Les chromosomes du zygote", "Les cils tubaires"], 0, "Le test reconnaît l’hormone dans le sang ou les urines."),
      short("Développe le sigle hCG en français.", ["gonadotrophine chorionique humaine", "hormone gonadotrophine chorionique humaine", "gonadotrophine chorionique de l’humain"], "La hCG est le signal trophoblastique qui maintient le corps jaune."),
      short("Nomme la couche trophoblastique externe qui envahit l’endomètre.", ["syncytiotrophoblaste", "le syncytiotrophoblaste", "syncytiotrophoblast"], "Elle est plurinucléée et sécrète précocement la hCG."),
    ],
    corrections: [
      "La hCG est développée en gonadotrophine chorionique humaine et attribuée précocement au syncytiotrophoblaste.",
      "Le placenta est défini comme un organe associant une composante fœtale chorionique et une composante maternelle endométriale.",
      "Le début vers J6-J7 et l’achèvement vers J10-J12 remplacent l’affirmation simplificatrice selon laquelle la gestation commencerait simplement au onzième jour.",
      "La préparation de l’endomètre par la progestérone est placée avant l’implantation ; la hCG maintient ensuite le corps jaune.",
      "L’invasion trophoblastique n’est pas attribuée à une enzyme unique : plusieurs protéases, molécules d’adhérence et remaniements de la matrice extracellulaire coopèrent.",
    ],
  },
  {
    id: "fertilization-official-assessment",
    title: "Résoudre la situation d’évaluation officielle A à D",
    summary: "Nommer, annoter et décrire les quatre figures officielles de fécondation en corrigeant leurs ambiguïtés graphiques et scientifiques.",
    pages: "6",
    section: "Situation d’évaluation — figures A, B, C et D",
    durationMinutes: 36,
    xp: 110,
    kind: "practice",
    body: String.raw`
## Consigne officielle reformulée — page 6

La situation d’évaluation présente quatre figures **A, B, C et D** de la même cellule femelle au cours de la fécondation. Elle demande successivement de :

1. nommer les étapes représentées ;
2. annoter les figures avec les numéros **1 à 15** ;
3. décrire les transformations observées.

La situation d’évaluation est conservée, car elle vérifie les apprentissages du cours. Elle ne doit pas être confondue avec la situation d’apprentissage de la page 1, volontairement exclue de ce parcours.

## 1. Nommer A, B, C et D

| Figure | Étape attendue | Indices décisifs |
|---|---|---|
| **A** | pénétration, activation ovocytaire et reprise de la méiose II | spermatozoïde, fuseau d’anaphase II, exocytose corticale |
| **B** | formation des deux pronoyaux | pronoyaux mâle et femelle, deux globules polaires |
| **C** | rapprochement des pronoyaux et préparation de la première mitose | deux pronoyaux proches, ADN répliqué |
| **D** | organisation des chromosomes parentaux sur le premier fuseau mitotique | enveloppes pronucléaires désassemblées, fuseau commun |

Ces figures montrent une **séquence**, pas quatre cellules différentes. L’expression scolaire « caryogamie » peut désigner C-D, à condition de préciser que les enveloppes pronucléaires ne fusionnent pas littéralement avant la mitose.

## 2. Corrigé des repères 1 à 15

| Repère | Légende reconstruite et clarifiée |
|---:|---|
| **1** | zone pellucide |
| **2** | spermatozoïde |
| **3** | premier globule polaire |
| **4** | fuseau et chromosomes en anaphase II |
| **5** | granules corticaux en exocytose |
| **6** | corona radiata |
| **7** | zone pellucide modifiée par la réaction de la zone |
| **8** | pronoyau mâle |
| **9** | deux globules polaires |
| **10** | corona radiata |
| **11** | pronoyau femelle |
| **12** | pronoyau mâle rapproché |
| **13** | pronoyau femelle rapproché |
| **14** | corona radiata |
| **15** | chromosomes parentaux organisés sur le premier fuseau mitotique |

Les flèches **1** et **7** sont difficiles à distinguer dans le document : le schéma interactif les redessine séparément. Le repère 1 désigne la zone avant sa transformation ; le repère 7 désigne cette même matrice après la réaction corticale. La répétition de « corona radiata » aux repères 6, 10 et 14 correspond à sa présence dans trois figures successives.

## 3. Description modèle complète

En A, un spermatozoïde franchit les enveloppes et fusionne avec la membrane ovocytaire. Le signal calcique déclenche l’exocytose des granules corticaux, modifie la zone pellucide et fait reprendre la méiose II. En B, le deuxième globule polaire est émis ; les lots haploïdes forment un pronoyau mâle et un pronoyau femelle. En C, les pronoyaux répliquent leur ADN et se rapprochent. En D, leurs enveloppes se désassemblent ; les chromosomes maternels et paternels s’ordonnent sur un fuseau commun avant la première division de segmentation.

> **Correction de la source.** « Ovovyte » est corrigé en **ovocyte**. La « membrane de fécondation » est interprétée comme la zone pellucide modifiée. Les pronoyaux ne fusionnent pas littéralement avant la première mitose.

> **Passerelle vers l’exercice 1 de la même page.** L’ordre chronologique officiel des cinq images est **5 → 4 → 2 → 3 → 1**. Il sera démontré dans la mission suivante.
`,
    keyPoint: "A montre l’activation et la méiose II, B les deux pronoyaux, C leur rapprochement, D le premier fuseau ; les repères 1 à 15 doivent être rattachés à ces transformations.",
    example: "Pour expliquer D, écris : les enveloppes pronucléaires se désassemblent, puis les chromosomes parentaux répliqués s’organisent sur le premier fuseau mitotique commun.",
    methodSteps: [
      "Observe d’abord le nombre de pronoyaux et de globules polaires dans chaque figure.",
      "Associe les enveloppes externes aux repères 1, 6, 7, 10 et 14.",
      "Associe les éléments nucléaires et méiotiques aux repères 3, 4, 8, 9, 11, 12, 13 et 15.",
      "Décris A à D avec des verbes causaux : fusionne, déclenche, achève, forme, rapproche, désassemble et sépare.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situation officielle redessinée",
      title: "Annoter A, B, C et D sans dépendre des flèches floues",
      instruction: "Sélectionne les quinze repères, puis restitue oralement la séquence A → B → C → D.",
      viewBox: "0 0 920 360",
      caption: "Redessin pédagogique original des quatre étapes ; les scans officiels ne sont pas republiés et les repères 1 et 7 ont été clarifiés.",
      shapes: assessmentShapes,
      hotspots: assessmentHotspots,
      observation: "Le même ovocyte change d’état : activation en A, deux pronoyaux en B, rapprochement en C, premier fuseau en D.",
    },
    questions: [
      choice("Dans la situation officielle, que représente la figure A ?", ["Pénétration et activation avec reprise de la méiose II", "Morula à 16 cellules", "Blastocyste implanté", "Placenta mature"], 0, "Le spermatozoïde, le fuseau d’anaphase II et les granules corticaux identifient l’activation.", "Situation d’évaluation • page 6"),
      choice("Que représentent les deux structures nucléaires de la figure B ?", ["Deux blastomères", "Les pronoyaux mâle et femelle", "Deux noyaux trophoblastiques", "Deux spermatozoïdes"], 1, "Ils correspondent encore aux patrimoines haploïdes paternel et maternel dans une seule cellule.", "Situation d’évaluation • page 6"),
      choice("Quel phénomène domine dans la figure C ?", ["L’ovulation", "La nidation", "Le rapprochement des deux pronoyaux", "L’éclosion du blastocyste"], 2, "Les pronoyaux se rapprochent après réplication de leur ADN.", "Situation d’évaluation • page 6"),
      choice("Que montre la figure D ?", ["Une zone pellucide vide", "Un deuxième ovocyte", "Le corps jaune", "Les chromosomes parentaux sur le premier fuseau"], 3, "Le désassemblage des enveloppes permet une organisation mitotique commune.", "Situation d’évaluation • page 6"),
      trueFalse("Les figures A à D représentent quatre cellules femelles sans lien chronologique.", false, "La situation précise qu’il s’agit de la même cellule observée à des moments successifs.", "Situation d’évaluation • page 6"),
      choice("Quelle est la légende du repère 1 ?", ["Zone pellucide", "Pronoyau mâle", "Blastocèle", "Endomètre"], 0, "Le redessin place clairement le repère sur la matrice glycoprotéique externe.", "Situation d’évaluation • page 6"),
      choice("Quelle est la légende du repère 5 ?", ["Premier fuseau mitotique", "Granules corticaux en exocytose", "Deuxième pronoyau", "Trophoblaste"], 1, "L’exocytose corticale modifie ensuite la zone pellucide.", "Situation d’évaluation • page 6"),
      choice("Que désigne le repère 7 ?", ["La corona radiata maternelle", "Le premier globule polaire", "La zone pellucide modifiée", "Le noyau de l’endomètre"], 2, "La flèche source est ambiguë ; la reconstruction distingue la zone modifiée de la zone initiale du repère 1.", "Situation d’évaluation • page 6"),
      choice("Que désigne le repère 15 ?", ["Un acrosome intact", "Le pavillon tubaire", "Une morula", "Les chromosomes parentaux sur le premier fuseau"], 3, "Les lots maternel et paternel s’organisent sur un appareil mitotique commun.", "Situation d’évaluation • page 6"),
      choice("Quelle paire associe correctement les repères aux pronoyaux de la figure B ?", ["8 mâle et 11 femelle", "3 mâle et 5 femelle", "6 mâle et 10 femelle", "1 mâle et 7 femelle"], 0, "Le repère 8 correspond au pronoyau paternel et le 11 au pronoyau maternel.", "Situation d’évaluation • page 6"),
      choice("Que signale le repère 9 ?", ["Une corona radiata double", "Les deux globules polaires", "Deux blastocèles", "Deux placentas"], 1, "L’apparition du deuxième globule polaire atteste l’achèvement de la méiose II.", "Situation d’évaluation • page 6"),
      choice("Quelle formulation corrige le mieux la caryogamie mammalienne ?", ["Les globules polaires fusionnent", "La zone entre dans le noyau", "Les enveloppes pronucléaires se désassemblent avant le fuseau commun", "Le spermatozoïde devient un blastomère"], 2, "La réunion des patrimoines se réalise dans l’organisation de la première mitose.", "Situation d’évaluation • page 6"),
      choice("Quel est l’ordre exact des cinq images de l’exercice 1 ?", ["1 → 2 → 3 → 4 → 5", "5 → 2 → 4 → 1 → 3", "4 → 5 → 3 → 2 → 1", "5 → 4 → 2 → 3 → 1"], 3, "L’ordre officiel corrigé est 5 → 4 → 2 → 3 → 1 : rencontre, activation, pronoyaux, premier fuseau, puis deux blastomères.", "Exercice 1 • page 6"),
      short("Corrige le mot mal transcrit « ovovyte » dans l’énoncé officiel.", ["ovocyte", "l’ovocyte"], "La cellule femelle représentée est un ovocyte en cours de fécondation.", "Situation d’évaluation • page 6"),
    ],
    corrections: [
      "Le mot « ovovyte » de l’énoncé est corrigé en « ovocyte ».",
      "Les quinze légendes sont reconstruites explicitement ; les flèches 1 et 7, ambiguës sur le scan, sont séparées en zone pellucide initiale et zone pellucide modifiée.",
      "La figure D est décrite comme l’organisation des chromosomes parentaux sur le premier fuseau après désassemblage des enveloppes pronucléaires, et non comme une fusion nucléaire littérale.",
      "La réponse de l’exercice 1 de la page 6 est fixée sans ambiguïté : 5 → 4 → 2 → 3 → 1.",
    ],
  },
  {
    id: "gamete-fate-final-mission",
    title: "Mission finale : reconstruire tout le devenir des gamètes",
    summary: "Classer l’exercice officiel puis défendre une chronologie complète de l’ampoule à l’implantation avec les mécanismes et hormones attendus.",
    pages: "1-6, hors situation d’apprentissage de la page 1",
    section: "Consolidation et approfondissement — exercice 1",
    durationMinutes: 40,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## Partie 1 — Exercice officiel de classement, page 6

Le document propose cinq images numérotées dans le désordre et demande de les ranger chronologiquement. La réponse est :

### **5 → 4 → 2 → 3 → 1**

| Image | Indice observable | Interprétation |
|---:|---|---|
| **5** | ovocyte II entouré de spermatozoïdes | rencontre des gamètes et engagement d’un spermatozoïde |
| **4** | pénétration puis transformations corticales et méiotiques | fusion, activation, réaction de la zone et achèvement de la méiose II |
| **2** | deux pronoyaux visibles | formation des patrimoines mâle et femelle dans le zygote |
| **3** | matériel parental organisé pour la division | désassemblage pronucléaire et premier fuseau mitotique |
| **1** | deux blastomères | première division de segmentation achevée |

La règle de résolution consiste à rechercher des **marqueurs irréversibles** : le deuxième globule polaire ne peut apparaître avant l’activation ; deux pronoyaux précèdent le premier fuseau ; deux blastomères supposent que la première mitose est terminée.

## Partie 2 — Dossier de synthèse sans images

On observe successivement les indices suivants chez un embryon humain :

- des spermatozoïdes capacités atteignent un ovocyte II dans l’ampoule ;
- la zone pellucide est modifiée et un deuxième globule polaire apparaît ;
- deux pronoyaux se rapprochent ;
- les blastomères deviennent nombreux et plus petits dans une zone de même diamètre ;
- une cavité, un trophoblaste et un embryoblaste apparaissent ;
- l’enveloppe glycoprotéique s’ouvre ;
- un tissu externe plurinucléé envahit l’endomètre et libère une hormone.

### Réponse argumentée attendue

La capacitation rend le spermatozoïde apte à accomplir la réaction acrosomique et à fusionner avec l’ovocyte II. La fusion déclenche les oscillations de calcium, l’exocytose corticale, la réaction de la zone et l’achèvement de la méiose II. Le noyau spermatique se décondense tandis que le lot maternel forme son pronoyau. Après réplication, les enveloppes pronucléaires se désassemblent et les chromosomes parentaux s’organisent sur le premier fuseau. La segmentation produit des blastomères de plus en plus petits, une morula vers J3-J4 puis un blastocyste vers J5. Celui-ci éclot vers J5-J6, s’appose à l’endomètre vers J6-J7 et s’y implante jusqu’à environ J10-J12. Son syncytiotrophoblaste sécrète la hCG, qui maintient le corps jaune et sa progestérone. Le placenta associera ensuite une composante fœtale chorionique à une composante maternelle endométriale.

## Grille d’auto-évaluation

| Critère | Réponse solide |
|---|---|
| ordre | aucune inversion entre activation, pronoyaux, mitose, morula et blastocyste |
| structure | corona, zone, membrane, pronoyaux, trophoblaste et embryoblaste distingués |
| causalité | chaque signal est relié à son effet, notamment Ca²⁺ et hCG |
| chronologie | J3-J4, J5, J5-J6, J6-J7 et J10-J12 présentés comme repères humains moyens |
| précision | pas de membrane de fécondation mammalienne ni de fusion littérale des pronoyaux |

> **Périmètre respecté.** Cette mission réemploie l’exercice officiel et le cours des pages 1 à 6, mais ne reprend pas la situation d’apprentissage introductive de la page 1.
`,
    keyPoint: "La chaîne complète est : migration et capacitation → fusion et activation → pronoyaux → premier fuseau → segmentation → morula → blastocyste → éclosion → implantation et hCG.",
    example: "Pour justifier 5 → 4 → 2 → 3 → 1, repère successivement l’ovocyte rencontré, son activation, les deux pronoyaux, le fuseau commun puis les deux blastomères.",
    methodSteps: [
      "Classe les documents grâce aux structures qui ne peuvent apparaître qu’une fois l’étape précédente achevée.",
      "Ajoute pour chaque transition un mécanisme causal : capacitation, calcium, exocytose, réplication ou cavitation.",
      "Associe les stades préimplantatoires à des repères humains approximatifs, jamais à des dates absolues pour tous les mammifères.",
      "Termine par la chaîne syncytiotrophoblaste → hCG → corps jaune → progestérone et par les deux composantes placentaires.",
    ],
    interaction: timeline(
      "Dérouler les cinq images de l’exercice officiel",
      "Avance dans l’ordre corrigé et nomme l’indice qui rend chaque position nécessaire.",
      [
        { label: "Image 5 — rencontre", shortLabel: "5", detail: "L’ovocyte II est rencontré par des spermatozoïdes capacités ; la fécondation n’est pas encore achevée." },
        { label: "Image 4 — activation", shortLabel: "4", detail: "La fusion déclenche réaction corticale, modification de la zone et achèvement de la méiose II." },
        { label: "Image 2 — pronoyaux", shortLabel: "2", detail: "Les lots paternel et maternel sont visibles dans deux pronoyaux au sein de la cellule-œuf." },
        { label: "Image 3 — premier fuseau", shortLabel: "3", detail: "Les enveloppes pronucléaires disparaissent et les chromosomes rejoignent un fuseau mitotique commun." },
        { label: "Image 1 — deux blastomères", shortLabel: "1", detail: "La première division de segmentation est achevée ; l’embryon comporte désormais deux cellules." },
      ],
      "L’ordre 5 → 4 → 2 → 3 → 1 est imposé par les transformations cellulaires, pas par les numéros attribués aux images.",
    ),
    questions: [
      choice("Quelle image ouvre l’ordre officiel ?", ["L’image 5", "L’image 1", "L’image 3", "L’image 2"], 0, "L’image 5 montre la rencontre de l’ovocyte II avec les spermatozoïdes.", "Exercice 1 • page 6"),
      choice("Quelle image vient immédiatement après l’image 5 ?", ["L’image 1", "L’image 4", "L’image 2", "L’image 3"], 1, "L’image 4 montre l’activation qui suit l’engagement puis la fusion gamétique.", "Exercice 1 • page 6"),
      choice("Quelle image présente les deux pronoyaux ?", ["L’image 5", "L’image 4", "L’image 2", "L’image 1"], 2, "L’image 2 se place après l’activation et avant le premier fuseau.", "Exercice 1 • page 6"),
      choice("Quelle séquence est exacte ?", ["1 → 2 → 3 → 4 → 5", "5 → 2 → 4 → 1 → 3", "4 → 5 → 3 → 2 → 1", "5 → 4 → 2 → 3 → 1"], 3, "La succession corrigée est 5 → 4 → 2 → 3 → 1.", "Exercice 1 • page 6"),
      trueFalse("L’image portant le numéro 1 est nécessairement la première dans le temps.", false, "Les numéros identifient les images, ils n’indiquent pas leur chronologie.", "Exercice 1 • page 6"),
      choice("Quel phénomène rend un spermatozoïde fonctionnellement fécondant ?", ["La capacitation", "La cavitation", "La nidation", "La compaction"], 0, "La capacitation se produit dans les voies génitales femelles avant la réaction acrosomique.", "Cours • pages 1 et 3"),
      choice("Quel événement suit directement le signal calcique ovocytaire ?", ["La naissance", "L’exocytose des granules corticaux", "La formation du placenta mature", "Une nouvelle ovulation"], 1, "Le calcium déclenche notamment la réaction corticale.", "Cours • pages 2-3"),
      choice("Quel indice place une image après l’achèvement de la méiose II ?", ["Un seul premier globule polaire", "Une corona radiata", "Deux globules polaires", "Un spermatozoïde dans le vagin"], 2, "Le deuxième globule polaire est émis lors de la fin de la méiose II.", "Situation d’évaluation • page 6"),
      choice("Quel événement vient juste avant la première segmentation ?", ["L’implantation", "L’éclosion", "La formation de la morula", "L’organisation des chromosomes sur le premier fuseau"], 3, "La mitose du zygote doit s’organiser avant la séparation en deux blastomères.", "Cours • pages 2-4"),
      choice("Quel stade atteint généralement l’utérus vers J3-J4 ?", ["La morula", "Le spermatozoïde non capacité", "Le follicule primordial", "Le placenta mature"], 0, "La morula se forme pendant le transport tubaire.", "Cours • page 4"),
      choice("Quelle transformation produit le blastocèle ?", ["La réaction acrosomique", "La cavitation", "La polyspermie", "La méiose I"], 1, "L’entrée de liquide et la confluence des cavités transforment la morula en blastocyste.", "Cours • page 4"),
      choice("Quel événement doit précéder l’adhésion à l’endomètre ?", ["La première ovulation", "La capacitation du corps jaune", "L’éclosion du blastocyste", "La naissance du placenta"], 2, "Le trophoblaste doit sortir de la zone pellucide pour adhérer.", "Cours • pages 4-5"),
      choice("Quelle chaîne hormonale est correcte ?", ["Progestérone → spermatozoïde → acrosome", "hCG → zona → blastocèle", "LH → embryoblaste → ovocyte II", "Syncytiotrophoblaste → hCG → corps jaune → progestérone"], 3, "La hCG trophoblastique sauve le corps jaune et maintient sa production de progestérone.", "Cours • page 5"),
      short("Nomme la couche externe du blastocyste qui participe à la partie fœtale du placenta.", ["trophoblaste", "le trophoblaste"], "Le trophoblaste se différencie notamment en cytotrophoblaste et syncytiotrophoblaste.", "Cours • pages 4-5"),
      short("Nomme l’hormone humaine précoce détectée par les tests de grossesse.", ["hCG", "la hCG", "gonadotrophine chorionique humaine"], "Le syncytiotrophoblaste sécrète la hCG après le début de l’implantation.", "Cours • page 5"),
    ],
    corrections: [
      "L’ordre de l’exercice officiel est conservé et justifié étape par étape : 5 → 4 → 2 → 3 → 1.",
      "La correction n’interprète pas les numéros comme des dates : elle s’appuie sur les marqueurs biologiques irréversibles visibles dans chaque image.",
      "Le calendrier morula J3-J4, blastocyste J5, éclosion J5-J6, début d’implantation J6-J7 et achèvement J10-J12 est présenté comme une moyenne humaine variable.",
      "La synthèse exclut explicitement la situation d’apprentissage de la page 1 tout en conservant la situation d’évaluation et l’exercice officiel de la page 6.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtGameteFatePath: LearningPath = {
  id: "terminale-d-svt-l5-gamete-fate",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "La reproduction chez les mammifères" },
  chapterNumber: 5,
  title: "Le devenir des cellules sexuelles chez les mammifères",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, de la migration des gamètes à la fécondation, la segmentation, l’éclosion du blastocyste et l’implantation, avec schémas originaux et corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Suivre la migration des gamètes et expliquer la capacitation",
    "Ordonner pénétration, activation ovocytaire et formation du zygote",
    "Décrire segmentation, morula, blastocyste et éclosion sans croissance globale",
    "Relier implantation, hCG, corps jaune et mise en place du placenta",
  ],
  modules: [
    {
      id: "gamete-fate-mastery",
      title: "Maîtriser le devenir des gamètes",
      description: "Dix niveaux progressifs, de la migration gamétique aux deux évaluations officielles corrigées.",
      lessons: builtLevels,
    },
  ],
};
