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

const sourceDocument = "SVT Tle C_L7_Les cycles sexuels  chez la femme.pdf";

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
      introduction: "Repère d’abord l’organe, la phase et l’hormone concernés ; décris ensuite la variation observée avant d’en expliquer le mécanisme.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : organe → phase → hormone → effet. Cette chaîne transforme une courbe compliquée en raisonnement simple.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const ovaryShapes: SchemaShape[] = [
  { shape: "path", d: "M85 215 C125 95, 270 60, 420 105 C545 145, 620 235, 575 310 C525 392, 355 390, 210 350 C95 318, 55 275, 85 215 Z", tone: "soft" },
  { shape: "circle", cx: 180, cy: 225, r: 22, tone: "outline" },
  { shape: "circle", cx: 265, cy: 205, r: 38, tone: "fill" },
  { shape: "circle", cx: 370, cy: 195, r: 58, tone: "outline" },
  { shape: "circle", cx: 390, cy: 190, r: 15, tone: "accent" },
  { shape: "line", x1: 430, y1: 170, x2: 500, y2: 130, tone: "accent" },
  { shape: "circle", cx: 515, cy: 122, r: 13, tone: "accent" },
  { shape: "path", d: "M470 255 C500 215, 555 230, 565 275 C570 320, 520 340, 480 315 C455 300, 450 275, 470 255 Z", tone: "fill" },
  { shape: "text", x: 350, y: 420, content: "Cycle ovarien — dessin pédagogique original", anchor: "middle" },
];

const ovaryHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "growing", number: 1, label: "Follicules en croissance", x: 180, y: 225, detail: "Sous l’action principale de la FSH, une cohorte de follicules commence sa croissance pendant la phase folliculaire." },
  { id: "dominant", number: 2, label: "Follicule dominant", x: 265, y: 205, detail: "Le follicule dominant poursuit sa maturation tandis que les autres régressent par atrésie." },
  { id: "mature", number: 3, label: "Follicule mûr", x: 370, y: 195, detail: "Le follicule préovulatoire sécrète beaucoup d’estradiol et prépare le rétrocontrôle positif." },
  { id: "ovulation", number: 4, label: "Ovulation", x: 515, y: 122, detail: "Le pic de LH déclenche la rupture folliculaire et la libération de l’ovocyte II." },
  { id: "corpus-luteum", number: 5, label: "Corps jaune", x: 520, y: 280, detail: "Après l’ovulation, le follicule rompu devient un corps jaune qui sécrète surtout la progestérone." },
];

const levels: LevelSeed[] = [
  {
    id: "cycle-landmarks-menarche",
    title: "Poser les repères du cycle sexuel",
    summary: "Distinguer menarche, cycle ovarien et cycle utérin sans transformer le modèle de 28 jours en règle absolue.",
    pages: "1 et 5",
    section: "Situation d’apprentissage, problématique et conclusion générale",
    durationMinutes: 24,
    xp: 45,
    body: `
## 1. Un fonctionnement cyclique à partir de la puberté

La **menarche** désigne les premières menstruations. Elle marque une étape de la puberté, mais les premiers cycles peuvent être irréguliers. Le cours cherche à expliquer comment les ovaires et l’utérus changent au fil du temps et comment ces changements sont coordonnés par des hormones.

Deux cycles se déroulent en parallèle :

| Cycle | Organe observé | Événements majeurs |
|---|---|---|
| ovarien | ovaire | croissance folliculaire, ovulation, corps jaune |
| utérin | utérus, surtout endomètre | menstruation, reconstruction, transformation sécrétoire |

Le **jour 1** correspond au premier jour des menstruations. Le schéma officiel utilise un cycle modèle de 28 jours et place l’ovulation près du jour 14. Ce modèle aide à comprendre l’ordre des événements ; il ne permet pas de prédire exactement le cycle de chaque personne. La phase folliculaire est la plus variable, alors que la phase lutéale dure souvent autour de deux semaines.

## 2. Une chronologie, pas deux histoires séparées

Les transformations de l’ovaire et de l’endomètre sont synchronisées. Le follicule produit de l’estradiol, qui favorise la prolifération de l’endomètre. Après l’ovulation, le corps jaune produit surtout de la progestérone, qui transforme l’endomètre en muqueuse sécrétoire prête à accueillir un embryon.

En l’absence de grossesse, le corps jaune régresse, les concentrations d’estradiol et de progestérone chutent et une nouvelle menstruation commence.

> **Repère santé :** le scénario du PDF présente des premières règles à 16 ans. Cette situation ne doit pas être banalisée : lorsqu’une adolescente n’a pas encore eu ses premières règles à 15 ans, une évaluation par un professionnel de santé est recommandée. Ce repère informe sans poser de diagnostic individuel.

> **Astuce mémoire — O-U-H :** **O**vaire produit, **U**térus répond, les **H**ormones coordonnent.
`,
    keyPoint: "Le jour 1 est le début des menstruations ; le cycle ovarien et le cycle utérin sont synchronisés, mais un cycle réel n’est pas obligatoirement de 28 jours.",
    example: "Dans un cycle de 32 jours, on ne place pas automatiquement l’ovulation au jour 14 : on cherche d’abord les indices hormonaux ou biologiques.",
    methodSteps: [
      "Fixe le jour 1 au premier jour des menstruations.",
      "Sépare sur ton brouillon la ligne de l’ovaire et celle de l’utérus.",
      "Relie chaque transformation à l’hormone dominante.",
      "Présente 28 jours et le jour 14 comme un modèle, pas comme une horloge universelle.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Frise synchronisée",
      title: "Un cycle modèle en quatre temps",
      instruction: "Avance dans la frise et repère ce qui change simultanément dans l’ovaire et l’utérus.",
      items: [
        { label: "Début du cycle", shortLabel: "J1", detail: "Les menstruations commencent ; plusieurs follicules entrent en croissance." },
        { label: "Phase folliculaire", shortLabel: "Follicule", detail: "Le follicule dominant mûrit et l’endomètre prolifère sous l’influence croissante de l’estradiol." },
        { label: "Ovulation", shortLabel: "Ovulation", detail: "Le pic de LH provoque la libération de l’ovocyte II ; la date varie avec la durée du cycle." },
        { label: "Phase lutéale", shortLabel: "Corps jaune", detail: "Le corps jaune sécrète surtout la progestérone ; l’endomètre devient sécrétoire." },
        { label: "Sans grossesse", shortLabel: "Nouveau cycle", detail: "Le corps jaune régresse, les stéroïdes ovariens chutent et les menstruations recommencent." },
      ],
      observation: "La menstruation appartient au début de la phase folliculaire ovarienne : les deux découpages se superposent sans porter les mêmes noms.",
    },
    questions: [
      choice("Quel événement définit le jour 1 du cycle menstruel ?", ["Le début des menstruations", "Le pic de progestérone", "La fécondation", "La fin de l’ovulation"], 0, "Le jour 1 est le premier jour du saignement menstruel.", "Figure 2 • page 1"),
      choice("Quel organe est directement suivi dans le cycle ovarien ?", ["L’utérus", "L’ovaire", "L’hypophyse seule", "Le vagin seul"], 1, "Le cycle ovarien décrit les transformations des follicules et du corps jaune."),
      choice("Quel tissu varie fortement pendant le cycle utérin ?", ["Le cartilage", "La rétine", "L’endomètre", "L’émail dentaire"], 2, "L’endomètre se desquame, prolifère puis devient sécrétoire."),
      choice("Que faut-il retenir du cycle de 28 jours ?", ["Il est identique chez toutes les personnes", "Il exclut toute irrégularité", "Il impose toujours une ovulation au jour 14", "C’est un modèle pédagogique utile, pas une durée universelle"], 3, "La durée du cycle et la date d’ovulation peuvent varier."),
      trueFalse("Les cycles ovarien et utérin sont indépendants l’un de l’autre.", false, "Les hormones ovariennes coordonnent les transformations de l’endomètre."),
      choice("Comment nomme-t-on les premières menstruations ?", ["La menarche", "La ménopause", "La nidation", "La fécondation"], 0, "La menarche est la survenue des premières règles."),
      choice("Quelle phase varie généralement le plus en durée ?", ["La phase lutéale uniquement", "La phase folliculaire", "La menstruation est toujours fixe", "La grossesse"], 1, "La phase folliculaire explique une grande part des variations de longueur du cycle."),
      choice("Quel conseil prudent accompagne l’absence de premières règles à 15 ans ?", ["Attendre toujours sans en parler", "Prendre des hormones seul", "Consulter un professionnel de santé", "Conclure à une maladie précise"], 2, "Une évaluation professionnelle est recommandée, sans autodiagnostic."),
      short("Nomme les deux organes dont les cycles sont comparés dans le PDF.", ["ovaire et utérus", "l’ovaire et l’utérus", "ovaires et utérus", "les ovaires et l’utérus"], "Le document met en parallèle le cycle ovarien et le cycle utérin."),
      trueFalse("Dans le modèle du cours, l’ovulation sépare les phases folliculaire et lutéale.", true, "Elle termine la phase folliculaire et ouvre la phase lutéale."),
    ],
    corrections: [
      "Le cycle de 28 jours et l’ovulation au jour 14 sont présentés comme un modèle et non comme une règle universelle.",
      "La situation de premières règles à 16 ans est accompagnée du repère clinique de consultation en l’absence de menarche à 15 ans.",
      "La menstruation est replacée au début de la phase folliculaire, et non entre deux cycles indépendants.",
    ],
  },
  {
    id: "ovarian-cycle-follicle-ovulation",
    title: "Suivre le cycle ovarien",
    summary: "Décrire la maturation folliculaire, l’ovulation, la formation du corps jaune et leur devenir selon qu’une grossesse débute ou non.",
    pages: "1-2 et 7",
    section: "Figure 1 et analyse du cycle ovarien",
    durationMinutes: 28,
    xp: 55,
    body: `
## 1. La phase folliculaire : sélectionner un follicule dominant

Au début du cycle, plusieurs follicules ovariens poursuivent leur croissance. La **FSH** soutient cette croissance. Un follicule devient généralement dominant ; il produit de plus en plus d’estradiol et atteint le stade préovulatoire. Les autres follicules de la cohorte régressent : c’est l’**atrésie**.

Le terme scolaire « follicule de De Graaf » désigne le follicule mûr. Il contient l’ovocyte entouré de cellules folliculaires et d’une cavité remplie de liquide. L’ovaire ne fabrique donc pas un ovocyte neuf au jour 14 : il conduit à maturité un follicule contenant un ovocyte.

## 2. L’ovulation : libérer l’ovocyte II

Quand l’estradiol reste élevé avant l’ovulation, le rétrocontrôle devient positif et provoque une forte décharge de LH. Le **début** de cette décharge précède généralement l’ovulation d’environ 36 heures ; le **maximum** du pic la précède plutôt de 10 à 12 heures. Le PDF indique « environ 37 h plus tard » sans distinguer début et maximum : cette distinction évite une fausse précision.

L’ovulation correspond à la rupture du follicule mûr et à la libération de l’**ovocyte II**, entouré de cellules du cumulus. Elle se situe vers le milieu d’un cycle modèle, pas nécessairement au jour 14 de chaque cycle réel.

## 3. La phase lutéale : un organe endocrinien temporaire

Après l’ovulation, les cellules du follicule rompu se transforment en **corps jaune**. Celui-ci sécrète surtout de la progestérone et aussi de l’estradiol. Sans grossesse, il régresse en fin de phase lutéale. Si une grossesse commence, ce n’est pas la fécondation seule qui le maintient : l’embryon en développement produit de l’**hCG**, hormone qui soutient le corps jaune au début de la grossesse.

| Structure | Moment dominant | Produit ou événement |
|---|---|---|
| follicules en croissance | phase folliculaire | estradiol croissant |
| follicule mûr | avant ovulation | estradiol élevé |
| ovulation | transition | libération de l’ovocyte II |
| corps jaune | phase lutéale | surtout progestérone |

> **Astuce mémoire — F-O-J :** **F**ollicule, **O**vulation, corps **J**aune.
`,
    keyPoint: "La phase folliculaire construit un follicule dominant, le pic de LH déclenche l’ovulation et le follicule rompu devient un corps jaune sécréteur de progestérone.",
    example: "Un taux élevé de progestérone avec un corps jaune visible situe l’observation après l’ovulation, pendant la phase lutéale.",
    methodSteps: [
      "Ordonne follicules en croissance, follicule dominant, ovulation puis corps jaune.",
      "Associe FSH à la croissance folliculaire et le pic de LH à l’ovulation.",
      "Nomme précisément la cellule libérée : ovocyte II.",
      "En cas de grossesse, ajoute l’hCG pour expliquer le maintien du corps jaune.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Explorer les transformations de l’ovaire",
      instruction: "Appuie sur les cinq repères dans l’ordre du cycle.",
      viewBox: "0 0 700 450",
      caption: "Représentation pédagogique originale inspirée de la succession décrite par la figure 1 ; les tailles ne sont pas à l’échelle.",
      shapes: ovaryShapes,
      hotspots: ovaryHotspots,
      observation: "Le corps jaune dérive du follicule rompu : il n’apparaît pas comme une structure indépendante de l’ovulation.",
    },
    questions: [
      choice("Quel phénomène élimine les follicules non dominants ?", ["L’atrésie", "La nidation", "La menstruation", "La fécondation"], 0, "Les follicules non sélectionnés régressent par atrésie.", "Analyse du cycle ovarien • page 2"),
      choice("Quelle hormone soutient principalement la croissance folliculaire ?", ["L’hCG", "La FSH", "L’adrénaline", "L’insuline"], 1, "FSH signifie hormone folliculo-stimulante."),
      choice("Quelle cellule est libérée lors de l’ovulation humaine ?", ["Un spermatozoïde", "Un embryon", "Un ovocyte II", "Un globule rouge"], 2, "Le follicule mûr libère un ovocyte II."),
      choice("Que devient le follicule rompu après l’ovulation ?", ["Un neurone", "L’endomètre", "Un placenta immédiat", "Un corps jaune"], 3, "La lutéinisation transforme le follicule rompu en corps jaune."),
      trueFalse("Tous les follicules qui commencent leur croissance ovulent pendant le même cycle.", false, "Un follicule devient généralement dominant ; les autres subissent l’atrésie."),
      choice("Quelle hormone domine la sécrétion du corps jaune ?", ["La progestérone", "La FSH", "La GnRH", "La thyroxine"], 0, "Le corps jaune sécrète surtout de la progestérone."),
      choice("Quel événement déclenche directement l’ovulation ?", ["La chute de l’hCG", "Le pic de LH", "Le pic d’insuline", "La menstruation seule"], 1, "La décharge préovulatoire de LH provoque la rupture folliculaire."),
      choice("Combien de temps environ sépare le maximum du pic de LH de l’ovulation ?", ["36 jours", "14 semaines", "10 à 12 heures", "Une minute"], 2, "Le début du surge précède d’environ 36 h ; son maximum précède l’ovulation d’environ 10 à 12 h."),
      choice("Qu’est-ce qui maintient le corps jaune au début d’une grossesse ?", ["Le saignement", "L’atrésie", "La FSH seule", "L’hCG produite après le début du développement embryonnaire"], 3, "L’hCG exerce une action lutéotrope au début de la grossesse."),
      short("Écris le nom de la structure endocrine formée après l’ovulation.", ["corps jaune", "le corps jaune", "corpus luteum"], "Le follicule rompu se lutéinise en corps jaune."),
    ],
    corrections: [
      "La date d’ovulation n’est pas figée au jour 14 hors du modèle de 28 jours.",
      "Le délai est précisé : environ 36 h après le début de la décharge de LH, mais 10 à 12 h après son maximum.",
      "Le maintien du corps jaune en début de grossesse est attribué à l’hCG, pas à la fécondation seule.",
      "La croissance folliculaire est principalement reliée à la FSH ; la LH participe à la stéroïdogenèse et son pic déclenche l’ovulation.",
    ],
  },
  {
    id: "uterine-cycle-endometrium",
    title: "Lire les transformations de l’endomètre",
    summary: "Relier menstruation, phase proliférative et phase sécrétoire aux variations des hormones ovariennes.",
    pages: "1-2 et 7",
    section: "Figure 2 et analyse du cycle utérin",
    durationMinutes: 27,
    xp: 60,
    body: `
## 1. Les menstruations : conséquence d’une chute hormonale

L’**endomètre** est la muqueuse interne de l’utérus. En fin de cycle sans grossesse, le corps jaune régresse. Les concentrations de progestérone et d’estradiol chutent. La couche fonctionnelle de l’endomètre n’est plus maintenue : elle se désagrège partiellement et s’élimine avec du sang. Ce sont les **menstruations**.

Le myomètre, couche musculaire de l’utérus, n’est pas éliminé. La couche basale de l’endomètre persiste et permet la reconstruction de la muqueuse.

## 2. La phase proliférative : reconstruire

Pendant la phase folliculaire ovarienne, le follicule dominant sécrète de plus en plus d’estradiol. L’endomètre se reconstruit et s’épaissit :

- les cellules prolifèrent ;
- les glandes utérines s’allongent ;
- les artères spiralées se développent ;
- la muqueuse redevient progressivement fonctionnelle.

Cette **phase proliférative** utérine s’achève autour de l’ovulation.

## 3. La phase sécrétoire : préparer l’accueil

Pendant la phase lutéale ovarienne, la progestérone du corps jaune agit sur un endomètre déjà préparé par l’estradiol. Les glandes deviennent tortueuses et sécrètent ; la vascularisation augmente et la muqueuse prend l’aspect scolaire de « dentelle utérine ». Cette transformation prépare une éventuelle implantation.

| Ovaire | Hormone dominante | Utérus |
|---|---|---|
| follicule en croissance | estradiol | prolifération de l’endomètre |
| corps jaune | progestérone | maturation sécrétoire |
| régression du corps jaune | chute des deux hormones | menstruation |

La progestérone seule n’agit pas de la même façon sur un endomètre non préparé : l’estradiol induit notamment la prolifération et rend le tissu réceptif à l’action progestative. Cette idée sera démontrée dans la situation d’évaluation.

> **Astuce mémoire — M-P-S :** **M**enstruation, **P**rolifération, **S**écrétion.
`,
    keyPoint: "L’estradiol reconstruit l’endomètre pendant la phase proliférative ; la progestérone transforme ensuite cette muqueuse en endomètre sécrétoire.",
    example: "Des glandes très sinueuses et riches en sécrétions indiquent une phase lutéale avec progestérone élevée.",
    methodSteps: [
      "Repère d’abord l’épaisseur et l’aspect des glandes de l’endomètre.",
      "Associe reconstruction à l’estradiol et sécrétion à la progestérone.",
      "Distingue endomètre et myomètre.",
      "Explique les règles par la chute hormonale de fin de cycle.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Muqueuse en transformation",
      title: "De la desquamation à la dentelle utérine",
      instruction: "Sélectionne une phase pour relier l’aspect de l’endomètre à l’état de l’ovaire.",
      items: [
        { label: "Menstruation", shortLabel: "Règles", detail: "La chute d’estradiol et de progestérone entraîne la désorganisation et l’élimination de la couche fonctionnelle." },
        { label: "Début de prolifération", shortLabel: "Reconstruire", detail: "La couche basale régénère l’endomètre pendant que l’estradiol augmente." },
        { label: "Fin de prolifération", shortLabel: "Épaissir", detail: "Les glandes et les artères s’allongent ; la muqueuse s’épaissit jusqu’à l’ovulation." },
        { label: "Phase sécrétoire", shortLabel: "Sécréter", detail: "Sous progestérone, les glandes deviennent tortueuses et l’endomètre se prépare à l’implantation." },
        { label: "Fin sans grossesse", shortLabel: "Chute", detail: "La régression du corps jaune fait chuter les stéroïdes et prépare de nouvelles menstruations." },
      ],
      observation: "Les phases utérines et ovariennes sont simultanées : proliférative avec folliculaire, sécrétoire avec lutéale.",
    },
    questions: [
      choice("Quelle couche de l’utérus est principalement éliminée pendant les règles ?", ["La couche fonctionnelle de l’endomètre", "Tout le myomètre", "Le péritoine entier", "Le col entier"], 0, "La couche fonctionnelle se desquame tandis que la couche basale persiste.", "Analyse du cycle utérin • page 2"),
      choice("Quelle hormone stimule surtout la phase proliférative ?", ["La mélatonine", "L’estradiol", "L’adrénaline", "L’hémoglobine"], 1, "L’estradiol folliculaire favorise la reconstruction de l’endomètre."),
      choice("Quelle hormone domine la transformation sécrétoire ?", ["La FSH seule", "La GnRH seule", "La progestérone", "L’insuline"], 2, "La progestérone du corps jaune transforme l’endomètre préparé."),
      choice("Quel aspect caractérise les glandes en phase sécrétoire ?", ["Elles disparaissent définitivement", "Elles deviennent osseuses", "Elles restent parfaitement droites", "Elles deviennent tortueuses et sécrétrices"], 3, "Le PDF décrit une dentelle utérine riche en glandes sinueuses."),
      trueFalse("Le myomètre est entièrement éliminé à chaque menstruation.", false, "La menstruation touche surtout la couche fonctionnelle de l’endomètre."),
      choice("Quelle succession est correcte ?", ["Menstruation → prolifération → sécrétion", "Sécrétion → fécondation obligatoire → menstruation", "Ovulation → disparition permanente de l’utérus", "Prolifération → menstruation → puberté"], 0, "Le cycle utérin enchaîne ces trois états principaux."),
      choice("À quelle phase ovarienne correspond la phase sécrétoire utérine ?", ["À l’atrésie fœtale", "À la phase lutéale", "À la phase folliculaire uniquement", "À la ménopause"], 1, "Le corps jaune lutéal fournit la progestérone."),
      choice("Pourquoi l’endomètre se détache-t-il en fin de cycle sans grossesse ?", ["La FSH détruit le myomètre", "L’ovocyte le coupe", "Estradiol et progestérone chutent", "L’hCG augmente fortement"], 2, "La régression du corps jaune retire le soutien hormonal."),
      choice("Quelle structure persiste pour régénérer la muqueuse ?", ["Le follicule mûr", "Le placenta", "Le corps jaune pour toujours", "La couche basale de l’endomètre"], 3, "La couche basale assure la reconstruction cyclique."),
      short("Donne le nom de la muqueuse interne de l’utérus.", ["endomètre", "l’endomètre", "endometre", "l’endometre"], "Cette muqueuse est l’endomètre."),
    ],
    corrections: [
      "Les menstruations sont expliquées par la chute d’estradiol et de progestérone après la régression du corps jaune.",
      "La couche fonctionnelle de l’endomètre est distinguée de sa couche basale et du myomètre.",
      "L’action sécrétoire de la progestérone est replacée sur un endomètre préalablement préparé par l’estradiol.",
    ],
  },
  {
    id: "pituitary-ovarian-hormone-curves",
    title: "Interpréter les courbes hormonales",
    summary: "Lire ensemble FSH, LH, estradiol et progestérone pour retrouver les phases du cycle et l’ovulation.",
    pages: "3-4 et 7-8",
    section: "Courbes des hormones hypophysaires et ovariennes",
    durationMinutes: 30,
    xp: 65,
    kind: "graph",
    body: `
## 1. Quatre courbes, deux organes producteurs

Le document superpose deux familles d’hormones :

| Hormone | Origine principale | Indice fourni par la courbe |
|---|---|---|
| FSH | antéhypophyse | recrutement et croissance folliculaire |
| LH | antéhypophyse | pic préovulatoire puis soutien du corps jaune |
| estradiol | follicule puis corps jaune | croissance avant l’ovulation, second plateau plus faible après |
| progestérone | corps jaune | élévation caractéristique de la phase lutéale |

Pour lire correctement les graphiques, il faut d’abord regarder le titre et les axes. Les deux hormones ovariennes du PDF ne partagent pas la même échelle verticale : comparer directement la hauteur en millimètres des tracés serait trompeur. On compare surtout **la date des variations**, pas la hauteur graphique brute de deux unités différentes.

## 2. Reconstituer la chronologie

Au début du cycle, la FSH augmente suffisamment pour soutenir la croissance folliculaire. Le follicule dominant produit davantage d’estradiol. Quand ce taux élevé se maintient, le rétrocontrôle devient positif : une forte décharge de LH apparaît, accompagnée d’une élévation plus modeste de FSH. L’ovulation survient peu après.

Après l’ovulation, le corps jaune fait monter la progestérone et produit aussi de l’estradiol. Ces hormones exercent un rétrocontrôle négatif ; FSH et LH restent relativement basses. En fin de cycle sans grossesse, le corps jaune régresse et les hormones ovariennes chutent.

## 3. Une courbe est un faisceau d’indices

On ne doit pas conclure sur un seul point. Un **pic bref de LH** localise la période ovulatoire. Une **progestérone durablement élevée** identifie la phase lutéale. Une **chute simultanée de progestérone et d’estradiol** annonce les menstruations. L’interaction ci-dessous redessine la dynamique de la LH en **indice relatif** : elle reproduit la forme et l’ordre des événements, sans prétendre reprendre les unités illisibles de la source.

> **Astuce mémoire — LH = Libération à Haute intensité :** le grand pic de LH annonce la libération de l’ovocyte.
`,
    keyPoint: "Le pic bref de LH repère l’ovulation ; la montée de progestérone repère la phase lutéale et la chute des stéroïdes annonce les menstruations.",
    example: "Une courbe montre un pic aigu de LH puis, quelques jours après, un plateau de progestérone : on place l’ovulation juste après le pic et le plateau dans la phase lutéale.",
    methodSteps: [
      "Lis le titre, l’unité et l’échelle de chaque axe avant de comparer.",
      "Cherche le pic le plus aigu : il correspond généralement à la LH préovulatoire.",
      "Repère ensuite le plateau postovulatoire de progestérone.",
      "Relie enfin les chutes hormonales au début des menstruations.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe redessinée",
      title: "Déplacer le repère sur la dynamique de la LH",
      instruction: "Fais varier le jour et observe le contraste entre le niveau basal et la décharge préovulatoire.",
      formula: "LH en indice relatif selon le jour du cycle",
      rule: {
        kind: "samples",
        points: [[1, 3], [4, 4], [7, 3.5], [10, 4], [12, 8], [13, 15], [14, 24], [15, 8], [18, 3], [21, 2.5], [24, 2], [28, 3]],
      },
      window: { xMin: 1, xMax: 28, yMin: 0, yMax: 26 },
      guides: [
        { kind: "vertical", value: 14, label: "période ovulatoire du modèle" },
        { kind: "horizontal", value: 4, label: "niveau basal relatif" },
      ],
      marker: { min: 1, max: 28, step: 1, initial: 14 },
      observation: "Courbe originale en indice relatif : le pic est bref ; il ne signifie pas que la LH est absente pendant le reste du cycle.",
    },
    questions: [
      choice("Quelle hormone présente le pic préovulatoire le plus marqué ?", ["La LH", "La progestérone", "L’insuline", "La thyroxine"], 0, "Le document montre un pic aigu de LH autour de l’ovulation.", "Courbes hypophysaires • pages 4 et 7"),
      choice("Quelle hormone ovarienne s’élève fortement après l’ovulation ?", ["La FSH", "La progestérone", "La GnRH", "L’adrénaline"], 1, "Le corps jaune produit surtout la progestérone."),
      choice("Quelle structure produit le premier grand accroissement d’estradiol ?", ["Le myomètre", "L’hypothalamus", "Le follicule dominant", "Le globule rouge"], 2, "Le follicule dominant sécrète de plus en plus d’estradiol."),
      choice("Que signifie la chute simultanée d’estradiol et de progestérone en fin de cycle ?", ["Une ovulation certaine le même jour", "Une grossesse toujours confirmée", "Une hausse de l’hCG", "La régression du corps jaune et l’approche des règles"], 3, "Sans grossesse, la lutéolyse entraîne la chute des stéroïdes."),
      trueFalse("La LH est totalement absente en dehors de son pic.", false, "Elle reste présente à un niveau basal et sa sécrétion est pulsatile."),
      choice("Quelle hormone peut présenter une petite élévation en même temps que le pic de LH ?", ["La FSH", "La testostérone uniquement", "L’hormone de croissance uniquement", "Le cortisol uniquement"], 0, "Le milieu du cycle comporte aussi une élévation plus modeste de FSH."),
      choice("Pourquoi ne faut-il pas comparer directement la hauteur graphique de l’estradiol et de la progestérone ?", ["Les courbes sont invisibles", "Les axes utilisent des unités et échelles différentes", "Les hormones sont identiques", "Le jour 1 est inconnu"], 1, "La double échelle impose de lire chaque axe séparément."),
      choice("Quel indice localise le mieux la phase lutéale ?", ["Un pic isolé de FSH au jour 1", "Une chute de LH seule", "Une progestérone durablement élevée", "Une absence de toute hormone"], 2, "La progestérone élevée traduit l’activité du corps jaune."),
      choice("Quel est le meilleur ordre des événements ?", ["Progestérone haute → follicule dominant → LH", "Menstruation → grossesse obligatoire → LH", "Corps jaune → follicule dominant → ovulation", "Estradiol préovulatoire élevé → pic de LH → ovulation"], 3, "L’estradiol soutenu déclenche le rétrocontrôle positif puis le pic de LH."),
      short("Donne le sigle de l’hormone dont le grand pic déclenche l’ovulation.", ["LH", "lh", "L.H."], "Il s’agit de l’hormone lutéinisante, LH."),
    ],
    corrections: [
      "Les deux axes des hormones ovariennes sont distingués pour éviter une comparaison directe de hauteurs exprimées dans des unités différentes.",
      "La LH est décrite comme basale et pulsatile hors du pic, non comme absente.",
      "Les courbes sont redessinées en indices relatifs sans inventer des mesures exactes illisibles dans le PDF.",
    ],
  },
  {
    id: "experimental-control-ovary-pituitary",
    title: "Raisonner à partir des expériences",
    summary: "Interpréter hypophysectomie, greffe, ovariectomie, injections hormonales et stimulation de l’hypothalamus.",
    pages: "2-3",
    section: "Présentation, résultats et analyse des expériences 1 à 3",
    durationMinutes: 32,
    xp: 70,
    kind: "practice",
    body: `
## 1. Expérience 1 : retirer puis restaurer l’hypophyse

Une **hypophysectomie** est l’ablation de l’hypophyse. Après cette opération, les ovaires s’atrophient, les œstrogènes diminuent et la progestérone n’est plus détectée. Lorsque la greffe d’hypophyse rétablit les effets normaux, on déduit que l’hypophyse fournit des signaux nécessaires au fonctionnement ovarien.

Le raisonnement ne consiste pas à réciter l’opération :

1. on modifie un organe ;
2. on observe les conséquences en aval ;
3. on restaure l’organe ou son signal ;
4. la restauration renforce le lien causal.

## 2. Expérience 2 : retirer les ovaires puis injecter des œstrogènes

Après **ovariectomie**, les hormones ovariennes disparaissent. L’endomètre s’atrophie et les règles s’arrêtent. La FSH et la LH augmentent fortement, car le rétrocontrôle négatif ovarien a disparu. Des injections d’œstrogènes bien dosées peuvent reconstruire l’endomètre et ramener FSH/LH vers une valeur plus basse ou voisine de la normale.

Le texte source juxtapose les résultats sans préciser clairement ce qui suit l’ablation et ce qui suit l’injection. La séparation ci-dessus rend l’expérience interprétable sans changer son intention.

## 3. Expérience 3 : stimuler l’hypothalamus

Une stimulation localisée de l’hypothalamus augmente la sécrétion hypophysaire. On en déduit que l’hypothalamus commande l’antéhypophyse. Le médiateur physiologique est la **GnRH**, normalement libérée de façon pulsatile. Une stimulation électrique expérimentale démontre une relation ; elle ne signifie pas que le cerveau fonctionne normalement par un courant appliqué de l’extérieur.

## 4. Les conclusions croisées

| Manipulation | Résultat clé | Déduction |
|---|---|---|
| ablation hypophyse | ovaires atrophiés, stéroïdes bas | l’hypophyse stimule les ovaires |
| greffe hypophyse | fonctions restaurées | le lien est causal et réversible |
| ovariectomie | FSH/LH élevées, endomètre atrophié | les ovaires agissent sur utérus et freinent l’axe |
| œstrogènes dosés | endomètre et FSH/LH se modifient | l’estradiol agit sur plusieurs cibles |
| stimulation hypothalamique | gonadostimulines augmentées | l’hypothalamus contrôle l’hypophyse |

> **Astuce mémoire — Retirer, observer, restaurer, conclure.** C’est la charpente de toute expérience d’ablation-greffe.
`,
    keyPoint: "Les expériences démontrent une commande hypothalamus → hypophyse → ovaires et un retour des hormones ovariennes sur l’axe et l’utérus.",
    example: "Après ovariectomie, FSH et LH augmentent : la disparition du frein ovarien révèle un rétrocontrôle négatif.",
    methodSteps: [
      "Identifie la variable manipulée : organe retiré, greffé, hormone injectée ou région stimulée.",
      "Sépare les résultats obtenus avant et après restauration.",
      "Compare avec la situation témoin implicite ou explicite.",
      "Formule la relation causale la plus courte compatible avec tous les résultats.",
    ],
    interaction: diagram(
      "Relier chaque manipulation à sa conclusion",
      "Sélectionne une expérience et retrouve le signal biologique mis en évidence.",
      "Trois expériences complémentaires",
      "Une seule expérience ne suffit pas à construire tout l’axe : ablation, restauration et stimulation se complètent.",
      [
        { id: "hypophysectomy", label: "Hypophysectomie", role: "Supprimer la commande", detail: "L’atrophie ovarienne et la chute des stéroïdes montrent que l’hypophyse stimule l’ovaire." },
        { id: "pituitary-graft", label: "Greffe d’hypophyse", role: "Restaurer", detail: "La correction des effets renforce l’interprétation causale de l’ablation." },
        { id: "ovariectomy", label: "Ovariectomie", role: "Supprimer le retour", detail: "FSH/LH augmentent et l’endomètre s’atrophie : l’ovaire agit à la fois sur l’axe et l’utérus." },
        { id: "estrogen", label: "Œstrogènes dosés", role: "Remplacer un signal", detail: "Ils reconstruisent l’endomètre et rétablissent un frein sur les gonadostimulines selon la dose." },
        { id: "hypothalamus", label: "Stimulation hypothalamique", role: "Activer l’amont", detail: "L’hypersécrétion hypophysaire révèle la commande de l’hypothalamus." },
      ],
      "Le même estradiol peut agir sur l’utérus et sur le complexe hypothalamo-hypophysaire : une hormone possède plusieurs organes cibles.",
    ),
    questions: [
      choice("Quel résultat suit l’ablation de l’hypophyse dans le document ?", ["Une atrophie des ovaires", "Une ovulation permanente", "Une hausse certaine de progestérone", "Une grossesse"], 0, "Sans gonadostimulines hypophysaires, les ovaires régressent.", "Expérience 1 • pages 2-3"),
      choice("Que montre la correction obtenue après greffe d’hypophyse ?", ["L’ovaire commande seul le cerveau", "L’hypophyse est nécessaire au fonctionnement ovarien", "L’utérus produit la FSH", "La LH est une hormone ovarienne"], 1, "La restauration renforce le lien causal entre hypophyse et activité ovarienne."),
      choice("Quel changement suit l’ovariectomie ?", ["La FSH et la LH disparaissent toujours", "L’endomètre devient sécrétoire sans hormone", "FSH et LH augmentent", "L’hCG augmente obligatoirement"], 2, "La disparition du rétrocontrôle ovarien libère la sécrétion de gonadostimulines."),
      choice("Quel tissu s’atrophie en l’absence d’hormones ovariennes ?", ["La rétine", "Le cartilage", "La peau entière", "L’endomètre"], 3, "L’endomètre dépend notamment de l’estradiol et de la progestérone."),
      trueFalse("Une greffe qui restaure la fonction renforce l’interprétation de l’ablation.", true, "L’aller-retour suppression-restauration est un argument causal puissant."),
      choice("Quelle hormone est remplacée dans l’expérience 2 du PDF ?", ["Un œstrogène, notamment l’estradiol", "L’adrénaline", "L’insuline", "La thyroxine"], 0, "Le document décrit des injections d’œstrogènes."),
      choice("Quel effet révèle la stimulation de l’hypothalamus ?", ["Une disparition du cerveau", "Une hypersécrétion d’hormones hypophysaires", "Une absence de FSH et LH", "Une transformation de l’utérus en ovaire"], 1, "L’hypothalamus commande la sécrétion hypophysaire."),
      choice("Quelle variable faut-il distinguer dans l’expérience d’ovariectomie ?", ["La couleur de l’animal", "Le nom du laboratoire", "Avant et après l’injection d’œstrogènes", "Le nombre de pages"], 2, "La chronologie permet d’attribuer chaque résultat à la bonne étape."),
      choice("Quelle conclusion globale est correcte ?", ["L’utérus commande directement tout le cycle", "Les ovaires ne répondent à aucune hormone", "L’hypophyse agit sans hypothalamus", "L’axe et les ovaires agissent dans les deux sens par commande et rétrocontrôle"], 3, "L’axe stimule les ovaires et les hormones ovariennes agissent en retour."),
      short("Nomme l’ablation chirurgicale des ovaires.", ["ovariectomie", "l’ovariectomie", "castration", "castration ovarienne"], "Cette intervention est l’ovariectomie."),
    ],
    corrections: [
      "Les effets de l’ovariectomie sont séparés de ceux des injections d’œstrogènes, que le texte source juxtapose sans chronologie claire.",
      "L’augmentation de FSH/LH après ovariectomie est expliquée par la suppression du rétrocontrôle négatif.",
      "La stimulation électrique expérimentale de l’hypothalamus est distinguée de la libération physiologique pulsatile de GnRH.",
    ],
  },
  {
    id: "hypothalamic-pituitary-ovarian-axis",
    title: "Construire l’axe hypothalamo-hypophyso-ovarien",
    summary: "Ordonner GnRH, FSH, LH, hormones ovariennes et organes cibles dans une même chaîne fonctionnelle.",
    pages: "3-4 et 8",
    section: "Interprétation et schéma de régulation du cycle sexuel",
    durationMinutes: 30,
    xp: 75,
    body: `
## 1. L’hypothalamus donne le rythme

L’**hypothalamus** libère la GnRH par bouffées. Cette sécrétion **pulsatile** est essentielle : la fréquence et l’amplitude des pulses changent au cours du cycle et pilotent la réponse de l’antéhypophyse. Dans le modèle de Terminale, on retient surtout que la GnRH stimule la libération de FSH et de LH.

## 2. L’antéhypophyse transmet la commande

La **FSH** et la **LH** sont des gonadostimulines, encore appelées gonadotropines :

- la FSH stimule la croissance folliculaire et l’activité des cellules de la granulosa ;
- la LH stimule notamment les cellules de la thèque, participe à la production de stéroïdes, déclenche l’ovulation lors de son pic et soutient le corps jaune.

Dire que « la FSH fait tout le follicule » et « la LH ne sert qu’au jour 14 » serait trop simplificateur. Les deux hormones coopèrent, avec des rôles dominants différents.

## 3. L’ovaire répond puis renvoie une information

Le follicule sécrète surtout de l’**estradiol**. Le corps jaune sécrète surtout de la **progestérone** et aussi de l’estradiol. Ces hormones ont deux catégories de cibles :

1. l’utérus, où elles transforment l’endomètre ;
2. le complexe hypothalamo-hypophysaire, où elles exercent un rétrocontrôle.

La régulation est donc une **boucle**, pas une simple flèche descendante.

## 4. Lire un schéma de régulation

Une flèche positive signifie stimulation ; une barre ou un signe négatif signifie inhibition. Il faut toujours préciser la molécule qui transporte l’information. L’hypothalamus ne touche pas physiquement l’ovaire : il commande l’hypophyse par GnRH, puis FSH/LH circulent dans le sang jusqu’aux ovaires.

| Niveau | Signal | Cible immédiate |
|---|---|---|
| hypothalamus | GnRH | antéhypophyse |
| antéhypophyse | FSH et LH | ovaires |
| ovaires | estradiol, progestérone | utérus et axe de commande |

> **Astuce mémoire — G-FL-EP :** **G**nRH → **F**SH/**L**H → **E**stradiol/**P**rogestérone.
`,
    keyPoint: "La GnRH stimule l’antéhypophyse, FSH/LH stimulent les ovaires, puis estradiol et progestérone agissent sur l’utérus et rétrocontrôlent l’axe.",
    example: "Si la GnRH efficace disparaît, FSH/LH diminuent, l’ovaire n’est plus correctement stimulé et le cycle est perturbé.",
    methodSteps: [
      "Commence toujours le schéma par l’hypothalamus.",
      "Écris le nom du signal sur chaque flèche.",
      "Sépare hormones hypophysaires et hormones ovariennes.",
      "Ferme la boucle en ajoutant le rétrocontrôle ovarien sur l’axe.",
    ],
    interaction: diagram(
      "Parcourir la boucle hormonale",
      "Sélectionne chaque niveau de commande et lis son signal, sa cible et son effet.",
      "Axe hypothalamo-hypophyso-ovarien",
      "Une commande descendante organise le cycle ; les hormones ovariennes renvoient en permanence une information vers l’amont.",
      [
        { id: "hypothalamus", label: "Hypothalamus", role: "Donner le rythme", detail: "Il libère la GnRH de façon pulsatile vers l’antéhypophyse." },
        { id: "pituitary", label: "Antéhypophyse", role: "Relayer", detail: "Sous GnRH, elle sécrète les gonadostimulines FSH et LH." },
        { id: "fsh", label: "FSH", role: "Faire croître", detail: "Elle soutient la croissance folliculaire et la synthèse d’estradiol par la granulosa." },
        { id: "lh", label: "LH", role: "Ovuler et lutéiniser", detail: "Son pic déclenche l’ovulation ; elle soutient ensuite le corps jaune." },
        { id: "ovary", label: "Ovaire", role: "Répondre et informer", detail: "Follicule et corps jaune produisent estradiol, progestérone et autres signaux." },
        { id: "uterus", label: "Utérus", role: "Organe cible", detail: "Son endomètre prolifère puis devient sécrétoire selon les hormones reçues." },
        { id: "feedback", label: "Rétrocontrôle", role: "Fermer la boucle", detail: "Les stéroïdes ovariens modulent GnRH, FSH et LH négativement ou, avant l’ovulation, positivement." },
      ],
      "Le mot « axe » ne décrit pas une ligne rigide : c’est un réseau de signaux circulants et de boucles de retour.",
    ),
    questions: [
      choice("Quelle hormone est libérée par l’hypothalamus ?", ["La GnRH", "La progestérone", "L’hCG", "L’estradiol"], 0, "La GnRH commande l’antéhypophyse.", "Interprétation • page 3"),
      choice("Quelle structure libère FSH et LH ?", ["L’endomètre", "L’antéhypophyse", "Le corps jaune", "Le follicule uniquement"], 1, "FSH et LH sont des hormones hypophysaires."),
      choice("Quel couple correspond aux principales hormones ovariennes du graphique ?", ["FSH et LH", "GnRH et hCG", "Estradiol et progestérone", "Insuline et glucagon"], 2, "Le follicule et le corps jaune produisent ces stéroïdes."),
      choice("Quelle cible répond directement à l’estradiol et à la progestérone dans le cycle utérin ?", ["La rétine", "La moelle osseuse", "Le cartilage", "L’endomètre"], 3, "Les stéroïdes modifient la muqueuse utérine."),
      trueFalse("La GnRH est normalement sécrétée de façon pulsatile.", true, "Les pulses de GnRH organisent la réponse gonadotrope."),
      choice("Comment nomme-t-on FSH et LH ensemble ?", ["Des gonadostimulines", "Des anticorps", "Des enzymes digestives", "Des neurotransmetteurs synaptiques uniquement"], 0, "Ce sont des gonadotropines hypophysaires."),
      choice("Quelle action appartient à la LH ?", ["Éliminer le myomètre", "Déclencher l’ovulation lors de son pic", "Former directement l’endomètre sans ovaire", "Produire l’ovocyte dans l’utérus"], 1, "La décharge de LH déclenche la rupture folliculaire."),
      choice("Pourquoi la régulation forme-t-elle une boucle ?", ["Le sang tourne en cercle", "Le jour 28 précède toujours le jour 1", "Les hormones ovariennes agissent en retour sur l’axe", "L’utérus sécrète la GnRH"], 2, "Le rétrocontrôle ferme la boucle fonctionnelle."),
      choice("Quelle succession est exacte ?", ["LH → GnRH → FSH → utérus", "Utérus → ovaire → GnRH → peau", "Estradiol → hypothalamus → absence d’hypophyse", "GnRH → FSH/LH → ovaire → estradiol/progestérone"], 3, "Cette chaîne résume la commande descendante."),
      short("Écris les deux sigles des gonadostimulines hypophysaires.", ["FSH et LH", "LH et FSH", "FSH/LH", "LH/FSH"], "Les deux gonadostimulines sont FSH et LH."),
    ],
    corrections: [
      "La GnRH est précisée comme pulsatile, propriété absente du schéma statique du PDF.",
      "FSH et LH sont présentées comme coopérantes, sans réduire la maturation folliculaire à une action exclusive d’une seule hormone.",
      "L’antéhypophyse est distinguée de l’ensemble de l’hypophyse pour localiser la sécrétion de FSH/LH.",
    ],
  },
  {
    id: "negative-positive-feedback",
    title: "Expliquer les rétrocontrôles négatif et positif",
    summary: "Comprendre pourquoi les hormones ovariennes freinent généralement l’axe mais provoquent le pic de LH juste avant l’ovulation.",
    pages: "3-4 et 8",
    section: "Interprétation des rétrocontrôles et schéma de régulation",
    durationMinutes: 31,
    xp: 85,
    body: `
## 1. Le rétrocontrôle négatif domine la plus grande partie du cycle

Un **rétrocontrôle négatif** signifie que la réponse produite en aval réduit l’activité de la commande en amont. Au début et au milieu de la phase folliculaire, l’estradiol et l’inhibine produits par les follicules limitent notamment la FSH. Cette baisse aide à sélectionner le follicule dominant, mieux équipé pour poursuivre sa croissance.

Après l’ovulation, le corps jaune sécrète progestérone, estradiol et inhibine A. L’ensemble freine GnRH, FSH et LH. Ce frein évite normalement le recrutement immédiat d’une nouvelle ovulation au cours de la même phase lutéale.

## 2. L’exception préovulatoire : un rétrocontrôle positif

Lorsque le follicule dominant produit un taux d’estradiol **élevé et maintenu** pendant une durée suffisante, l’effet sur l’axe s’inverse. La fréquence et la réponse de l’axe changent ; une décharge massive de LH apparaît. C’est le **rétrocontrôle positif préovulatoire**.

Il ne suffit donc pas de mémoriser « estradiol = positif ». Selon sa concentration, sa durée d’élévation et le moment du cycle, l’estradiol peut exercer un effet négatif ou positif. Le contexte physiologique décide du signe.

## 3. Revenir au rétrocontrôle négatif

Après l’ovulation, la progestérone élevée ralentit l’activité de l’axe et le rétrocontrôle redevient négatif. Sans grossesse, le corps jaune régresse ; estradiol et progestérone chutent, le frein se lève progressivement et la FSH peut recommencer à augmenter pour le cycle suivant.

Si une grossesse débute, l’hCG maintient d’abord le corps jaune. Les concentrations de progestérone restent élevées et l’endomètre est maintenu. Ce mécanisme ne correspond pas à un nouveau cycle menstruel normal : la grossesse suspend la cyclicité habituelle.

| Situation | Signal ovarien | Effet sur l’axe |
|---|---|---|
| phase folliculaire ordinaire | estradiol faible à modéré + inhibine | rétrocontrôle négatif |
| fin de phase folliculaire | estradiol élevé et maintenu | rétrocontrôle positif, pic de LH |
| phase lutéale | progestérone + estradiol + inhibine | rétrocontrôle négatif |
| fin de cycle sans grossesse | chute des stéroïdes | levée du frein et nouveau recrutement |

> **Astuce mémoire — presque toujours moins, une fois plus :** le rétrocontrôle est surtout négatif ; l’exception positive prépare l’ovulation.
`,
    keyPoint: "Les stéroïdes ovariens exercent surtout un rétrocontrôle négatif ; un estradiol élevé et maintenu avant l’ovulation déclenche exceptionnellement le rétrocontrôle positif et le pic de LH.",
    example: "Estradiol haut plusieurs heures, progestérone encore basse et LH qui s’envole : c’est la transition positive préovulatoire.",
    methodSteps: [
      "Identifie d’abord la phase du cycle.",
      "Observe ensemble estradiol, progestérone, FSH et LH.",
      "N’attribue le signe positif qu’à l’estradiol préovulatoire élevé et maintenu.",
      "Après l’ovulation, reviens au frein lutéal dominé par la progestérone.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe redessinée",
      title: "Suivre la progestérone après l’ovulation",
      instruction: "Déplace le repère pour voir apparaître puis disparaître le signal du corps jaune.",
      formula: "Progestérone en indice relatif selon le jour du cycle",
      rule: {
        kind: "samples",
        points: [[1, 0.5], [5, 0.4], [9, 0.5], [13, 0.7], [14, 1], [16, 4], [18, 9], [21, 14], [24, 13], [26, 7], [28, 1]],
      },
      window: { xMin: 1, xMax: 28, yMin: 0, yMax: 16 },
      guides: [
        { kind: "vertical", value: 14, label: "ovulation du modèle" },
        { kind: "vertical", value: 21, label: "activité lutéale forte" },
      ],
      marker: { min: 1, max: 28, step: 1, initial: 21 },
      observation: "Courbe originale en indice relatif : la montée postovulatoire traduit l’activité du corps jaune ; sa chute retire le soutien de l’endomètre.",
    },
    questions: [
      choice("Quel type de rétrocontrôle domine la majeure partie du cycle ?", ["Le rétrocontrôle négatif", "Le rétrocontrôle positif permanent", "Aucun rétrocontrôle", "Un réflexe nerveux uniquement"], 0, "Les hormones ovariennes freinent généralement l’axe.", "Interprétation • page 3"),
      choice("Quelle situation déclenche le rétrocontrôle positif préovulatoire ?", ["Une progestérone basse isolée", "Un estradiol élevé et maintenu", "Une FSH absente", "Une chute d’hCG"], 1, "L’estradiol préovulatoire soutenu provoque la décharge de LH."),
      choice("Quelle conséquence majeure suit le rétrocontrôle positif ?", ["L’atrophie immédiate de l’utérus", "La disparition de tout follicule", "Le pic de LH", "La menstruation instantanée"], 2, "Le pic de LH déclenche l’ovulation."),
      choice("Quel ensemble freine l’axe pendant la phase lutéale ?", ["FSH seule", "GnRH seule", "hCG chez toute personne", "Progestérone, estradiol et inhibine du corps jaune"], 3, "Les produits lutéaux exercent un rétrocontrôle négatif."),
      trueFalse("L’estradiol exerce toujours un rétrocontrôle positif.", false, "Son effet est le plus souvent négatif et ne devient positif que dans le contexte préovulatoire adapté."),
      choice("Que permet la baisse de FSH pendant la sélection folliculaire ?", ["Favoriser le follicule dominant et l’atrésie des autres", "Déclencher les règles à elle seule", "Créer un deuxième utérus", "Maintenir une grossesse"], 0, "Le follicule dominant reste sensible malgré la diminution de FSH."),
      choice("Que provoque la chute des stéroïdes en fin de cycle sans grossesse ?", ["Un pic permanent de progestérone", "La levée progressive du frein sur l’axe", "L’arrêt définitif de tout cycle", "Une hCG élevée"], 1, "La levée du rétrocontrôle permet le recrutement du cycle suivant."),
      choice("Quel signal soutient le corps jaune au début d’une grossesse ?", ["La FSH seule", "L’adrénaline", "L’hCG", "La TSH"], 2, "L’hCG maintient temporairement la fonction lutéale."),
      choice("Quel profil correspond à la phase lutéale ?", ["LH au pic et progestérone nulle pendant 14 jours", "Estradiol toujours nul", "FSH très haute sans ovaire", "Progestérone élevée et gonadostimulines plutôt freinées"], 3, "Le corps jaune produit la progestérone et freine l’axe."),
      short("Donne le signe du rétrocontrôle juste avant le pic de LH.", ["positif", "rétrocontrôle positif", "retrocontrole positif", "+"], "L’estradiol élevé et maintenu exerce alors un rétrocontrôle positif."),
    ],
    corrections: [
      "L’effet de l’estradiol est contextualisé : négatif à taux faible ou modéré, positif lorsqu’il est élevé et maintenu avant l’ovulation.",
      "L’inhibine est ajoutée pour expliquer plus complètement la régulation de la FSH.",
      "La progestérone n’est pas présentée comme l’unique signal lutéal : estradiol et inhibine participent aussi au frein.",
      "La courbe est redessinée en indice relatif, sans recopier l’image source ni inventer d’unité clinique.",
    ],
  },
  {
    id: "rabbit-endometrium-assessment",
    title: "Résoudre l’évaluation des quatre lots de lapines",
    summary: "Analyser le tableau officiel pour démontrer l’action séquentielle de l’estradiol puis de la progestérone sur l’endomètre.",
    pages: "6",
    section: "Situation d’évaluation : déterminisme du développement de l’endomètre",
    durationMinutes: 38,
    xp: 100,
    kind: "challenge",
    body: `
## 1. Traduire le tableau en quatre expériences simples

Les quatre lots de lapines impubères reçoivent ou non deux hormones. L’estradiol est injecté au temps $t_1$ ; la progestérone au temps $t_2$, avec $t_2 > t_1$. Les coupes d’utérus sont annoncées à la même échelle : on peut donc comparer l’épaisseur de l’endomètre.

| Lot | Estradiol à $t_1$ | Progestérone à $t_2$ | Observation essentielle |
|---|---:|---:|---|
| 1 | non | non | endomètre très peu développé |
| 2 | non | oui | développement faible, proche du lot 1 |
| 3 | oui | non | endomètre épaissi par prolifération |
| 4 | oui | oui | endomètre très développé et glandulaire |

## 2. Analyser avant d’expliquer

Une **analyse** compare les résultats sans encore raconter le mécanisme :

- lot 2 ≈ lot 1 : la progestérone seule a peu d’effet sur l’endomètre immature ;
- lot 3 > lot 1 : l’estradiol provoque le développement de l’endomètre ;
- lot 4 > lot 3 : après préparation par l’estradiol, la progestérone accentue et transforme le développement.

Le lot 1 joue le rôle de **témoin négatif**. Les comparaisons les plus informatives ne sont pas « lot 1 contre tout », mais les couples qui ne diffèrent que par une hormone : 1/2 pour la progestérone seule, 1/3 pour l’estradiol, 3/4 pour la progestérone après imprégnation œstrogénique.

## 3. Expliquer le mécanisme

L’estradiol stimule la prolifération des cellules endométriales et favorise l’expression de récepteurs à la progestérone. Il **prépare** donc l’endomètre. Administrée ensuite, la progestérone transforme cette muqueuse proliférative en muqueuse sécrétoire, avec des glandes développées. L’ordre $t_1$ puis $t_2$ est donc biologiquement important.

## 4. Déduire le contrôle du cycle utérin

Dans un cycle naturel, le follicule produit d’abord l’estradiol pendant la phase folliculaire ; après l’ovulation, le corps jaune produit surtout la progestérone. L’utérus suit ainsi l’ordre hormonal imposé par l’ovaire. La situation démontre que le cycle utérin est contrôlé par les hormones ovariennes, elles-mêmes sous la commande de l’axe hypothalamo-hypophysaire.

> **Méthode d’évaluation — A-E-D :** **A**nalyser les comparaisons, **E**xpliquer par les hormones, **D**éduire le mécanisme général.
`,
    keyPoint: "L’estradiol fait proliférer et prépare l’endomètre ; la progestérone agit efficacement ensuite pour le rendre sécrétoire.",
    example: "Comparer les lots 3 et 4 isole l’effet ajouté de la progestérone sur un endomètre déjà préparé par l’estradiol.",
    methodSteps: [
      "Réécris chaque lot avec + ou − pour les deux hormones.",
      "Identifie le témoin sans hormone.",
      "Compare deux lots qui ne diffèrent que par un seul traitement.",
      "Sépare l’analyse des résultats, leur explication et la déduction générale.",
      "Conclue sur l’ordre estradiol puis progestérone.",
    ],
    interaction: diagram(
      "Comparer les quatre lots sans se perdre",
      "Choisis un lot puis confronte-le au témoin ou au lot qui ne diffère que par une hormone.",
      "Endomètre de lapines impubères",
      "Les traitements séquentiels permettent d’isoler la prolifération œstrogénique puis la transformation progestative.",
      [
        { id: "lot1", label: "Lot 1 : E− / P−", role: "Témoin", detail: "Sans estradiol ni progestérone, l’endomètre reste très peu développé." },
        { id: "lot2", label: "Lot 2 : E− / P+", role: "Tester P seule", detail: "La progestérone seule produit peu de développement sur cet endomètre non préparé." },
        { id: "lot3", label: "Lot 3 : E+ / P−", role: "Tester E", detail: "L’estradiol provoque la prolifération et l’épaississement de l’endomètre." },
        { id: "lot4", label: "Lot 4 : E+ puis P+", role: "Tester la séquence", detail: "Après l’estradiol, la progestérone conduit à un endomètre très développé et sécrétoire." },
        { id: "comparison", label: "Comparaison 3 → 4", role: "Isoler P après E", detail: "Le seul ajout est la progestérone : la différence lui est attribuée sur un tissu préparé." },
      ],
      "Le résultat le plus fort ne signifie pas « deux hormones font toujours plus » : il révèle surtout une action séquentielle et une préparation du tissu.",
    ),
    questions: [
      choice("Quel lot est le témoin sans hormone ?", ["Le lot 1", "Le lot 2", "Le lot 3", "Le lot 4"], 0, "Le lot 1 ne reçoit ni estradiol ni progestérone.", "Situation d’évaluation • page 6"),
      choice("Quel traitement reçoit le lot 2 ?", ["Estradiol seul", "Progestérone seule", "Les deux hormones", "Aucune hormone"], 1, "Le tableau indique non pour l’estradiol et oui pour la progestérone."),
      choice("Quel lot isole l’effet de l’estradiol par comparaison au témoin ?", ["Le lot 4", "Le lot 2", "Le lot 3", "Aucun lot"], 2, "Le lot 3 reçoit l’estradiol seul."),
      choice("Quel lot possède l’endomètre le plus développé ?", ["Le lot 1", "Le lot 2", "Le lot 3", "Le lot 4"], 3, "La succession estradiol puis progestérone produit l’aspect le plus développé."),
      trueFalse("Les schémas étant à la même échelle, leur épaisseur peut être comparée.", true, "Cette précision du document autorise la comparaison morphologique."),
      choice("Que montre la comparaison des lots 1 et 2 ?", ["La progestérone seule agit peu sur l’endomètre immature", "La progestérone détruit toujours l’utérus", "L’estradiol est présent dans les deux lots", "Le lot 2 ovule"], 0, "Les deux aspects restent proches malgré l’ajout de progestérone seule."),
      choice("Que montre la comparaison des lots 1 et 3 ?", ["La progestérone déclenche la prolifération", "L’estradiol développe l’endomètre", "Aucune hormone n’agit", "La FSH est injectée"], 1, "Le seul traitement ajouté au lot 3 est l’estradiol."),
      choice("Quelle comparaison isole l’effet de la progestérone après estradiol ?", ["Lots 1 et 4", "Lots 1 et 2", "Lots 3 et 4", "Lots 2 et 3"], 2, "Les lots 3 et 4 ont tous deux reçu l’estradiol ; seul le lot 4 reçoit ensuite la progestérone."),
      choice("Pourquoi $t_2 > t_1$ est-il important ?", ["Pour rendre les lapines plus âgées d’un an", "Pour supprimer l’estradiol", "Pour injecter les hormones au hasard", "Pour laisser l’estradiol préparer l’endomètre avant la progestérone"], 3, "L’ordre reproduit la succession folliculaire puis lutéale."),
      trueFalse("L’analyse doit immédiatement confondre observation et mécanisme moléculaire.", false, "On décrit d’abord les différences, puis on les explique."),
      choice("Quelle hormone induit la phase proliférative ?", ["L’estradiol", "La progestérone seule", "La LH injectée dans ce tableau", "L’hCG"], 0, "Le lot 3 démontre l’effet prolifératif de l’estradiol."),
      choice("Quelle hormone transforme ensuite l’endomètre en muqueuse sécrétoire ?", ["La GnRH", "La progestérone", "La FSH seule", "L’insuline"], 1, "La progestérone agit après préparation œstrogénique."),
      short("Donne la succession hormonale démontrée par les lots 3 et 4.", ["estradiol puis progestérone", "œstrogène puis progestérone", "oestrogene puis progesterone", "E puis P"], "L’estradiol prépare puis la progestérone transforme l’endomètre."),
    ],
    corrections: [
      "La faute « préaparation » de l’énoncé est corrigée en « préparation ».",
      "L’analyse, l’explication et la déduction sont distinguées conformément aux trois consignes officielles.",
      "Le rôle de préparation œstrogénique et l’ordre t₁ puis t₂ sont explicités au lieu d’une simple addition d’effets.",
      "Le lot 1 est identifié comme témoin négatif et les comparaisons contrôlées 1/2, 1/3 et 3/4 sont justifiées.",
    ],
  },
  {
    id: "integrated-cycle-final-mission",
    title: "Mission finale : diagnostiquer une phase du cycle",
    summary: "Mobiliser organes, hormones, rétrocontrôles, courbes et expériences, puis traiter fidèlement l’exercice de transfert du PDF.",
    pages: "1-8",
    section: "Synthèse de la leçon et consolidation-approfondissement",
    durationMinutes: 42,
    xp: 120,
    kind: "challenge",
    body: `
## Mission — préparer un exposé fiable

Ton groupe reçoit trois dossiers anonymes décrivant des moments différents d’un cycle :

- **Dossier A :** endomètre en reconstruction, estradiol en hausse, progestérone basse ;
- **Dossier B :** pic bref de LH, follicule mûr et progestérone encore basse ;
- **Dossier C :** corps jaune actif, progestérone élevée et glandes utérines très sinueuses.

Pour chaque dossier, il faut nommer la phase, identifier la structure ovarienne, expliquer l’état de l’endomètre et prévoir le rétrocontrôle dominant.

| Dossier | Phase | Ovaire | Utérus | Rétrocontrôle |
|---|---|---|---|---|
| A | folliculaire / proliférative | follicule dominant en croissance | prolifération | surtout négatif avant le seuil préovulatoire |
| B | période ovulatoire | follicule mûr puis rupture | fin de prolifération | positif juste avant, puis transition |
| C | lutéale / sécrétoire | corps jaune | dentelle sécrétoire | négatif |

## Si aucune grossesse ne débute

Le corps jaune du dossier C régresse. La progestérone et l’estradiol chutent ; les artères spiralées et la couche fonctionnelle de l’endomètre se désorganisent ; les menstruations marquent un nouveau jour 1. FSH peut alors remonter et soutenir une nouvelle cohorte folliculaire.

## Si une grossesse débute

Après fécondation puis début du développement, l’embryon produit de l’hCG. Cette hormone maintient temporairement le corps jaune et sa production de progestérone. L’endomètre n’est pas éliminé. Il ne faut donc pas écrire « la fécondation empêche immédiatement les règles » sans expliquer le relais hormonal.

## Exercice de transfert conservé fidèlement

La page 6 propose ensuite un exercice sur les testicules, hors du thème féminin. Il sert ici de **transfert sur la logique FSH/LH**. Parmi les six affirmations de la source, les exactes sont :

2. les cellules **interstitielles** de Leydig produisent la testostérone ;
3. les spermatozoïdes sont produits dans les tubes séminifères ;
4. la FSH participe au contrôle de la spermatogenèse via les cellules de Sertoli ;
6. FSH et LH sont des gonadostimulines.

L’affirmation 1 est fausse : les cellules de Leydig ne produisent pas les spermatozoïdes. L’affirmation 5 est trop directe dans le modèle scolaire : la LH stimule les cellules de Leydig et la testostérone, qui soutient ensuite la spermatogenèse avec la FSH.

> **Carte mentale finale :** GnRH → FSH/LH → follicule/corps jaune → estradiol/progestérone → endomètre, avec rétrocontrôles vers l’axe.
`,
    keyPoint: "Une phase du cycle se diagnostique par un faisceau concordant : structure ovarienne, hormones, aspect de l’endomètre et signe du rétrocontrôle.",
    example: "Progestérone haute + corps jaune + glandes tortueuses = phase lutéale ovarienne et phase sécrétoire utérine, avec rétrocontrôle négatif.",
    methodSteps: [
      "Classe les indices dans quatre colonnes : ovaire, hypophyse, hormones ovariennes, utérus.",
      "Cherche l’indice le plus discriminant : pic de LH ou progestérone élevée.",
      "Vérifie que la phase ovarienne et l’aspect utérin sont compatibles.",
      "Ajoute le signe du rétrocontrôle et justifie-le.",
      "Pour le transfert masculin, distingue action directe de LH et action indirecte via la testostérone.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Mission de synthèse",
      title: "Retrouver la phase à partir d’un indice",
      instruction: "Parcours les dossiers et construis à chaque étape une justification complète.",
      items: [
        { label: "Dossier A", shortLabel: "Estradiol ↑", detail: "Phase folliculaire et proliférative : follicule en croissance, endomètre qui se reconstruit, progestérone basse." },
        { label: "Dossier B", shortLabel: "LH ↑↑", detail: "Période ovulatoire : estradiol préovulatoire élevé, rétrocontrôle positif puis rupture folliculaire." },
        { label: "Dossier C", shortLabel: "Progestérone ↑", detail: "Phase lutéale et sécrétoire : corps jaune, glandes tortueuses et rétrocontrôle négatif." },
        { label: "Sans grossesse", shortLabel: "Chute", detail: "Lutéolyse, chute des stéroïdes, menstruation et levée du frein sur la FSH." },
        { label: "Avec grossesse", shortLabel: "hCG", detail: "L’hCG soutient le corps jaune et maintient la progestérone au début de la grossesse." },
        { label: "Transfert", shortLabel: "FSH/LH", detail: "Chez l’homme aussi, FSH et LH sont hypophysaires mais leurs cellules cibles et leurs effets doivent être distingués." },
      ],
      observation: "Une réponse excellente ne récite pas une date : elle fait converger plusieurs indices biologiques.",
    },
    questions: [
      choice("Quel dossier correspond à la phase folliculaire et proliférative ?", ["Le dossier A", "Le dossier B", "Le dossier C", "Aucun"], 0, "Estradiol en hausse et progestérone basse accompagnent la prolifération."),
      choice("Quel indice du dossier B est le plus discriminant ?", ["Une progestérone très haute", "Le pic bref de LH", "L’absence d’ovaire", "Une hCG élevée"], 1, "Le pic de LH situe la période ovulatoire."),
      choice("Quel dossier correspond à un corps jaune actif ?", ["Le dossier A", "Le dossier B avant tout pic", "Le dossier C", "Aucun"], 2, "La progestérone haute et l’endomètre sécrétoire indiquent le corps jaune."),
      choice("Que se passe-t-il sans grossesse après le dossier C ?", ["La progestérone monte indéfiniment", "Deux ovulations surviennent forcément", "L’hCG maintient le corps jaune", "Le corps jaune régresse et les stéroïdes chutent"], 3, "La lutéolyse conduit vers les menstruations."),
      trueFalse("Un seul jour du calendrier suffit toujours à prouver l’ovulation.", false, "La durée varie ; on utilise un faisceau d’indices."),
      choice("Quel signal maintient le corps jaune au début d’une grossesse ?", ["L’hCG", "La FSH seule", "La testostérone", "L’insuline"], 0, "L’hCG soutient la sécrétion lutéale."),
      choice("Quelle affirmation masculine de la source est exacte ?", ["Les cellules de Leydig produisent les spermatozoïdes", "Les cellules de Leydig produisent la testostérone", "La LH produit directement les spermatozoïdes", "FSH et LH sont ovariennes"], 1, "Les cellules interstitielles de Leydig sécrètent la testostérone.", "Exercice 1 • page 6"),
      choice("Où sont produits les spermatozoïdes ?", ["Dans l’hypophyse", "Dans l’endomètre", "Dans les tubes séminifères", "Dans les cellules de Leydig"], 2, "La spermatogenèse se déroule dans l’épithélium des tubes séminifères."),
      choice("Quel ensemble donne les numéros exacts de l’exercice source ?", ["1, 2 et 5", "1, 3 et 5", "2, 4 et 5", "2, 3, 4 et 6"], 3, "Les affirmations exactes sont 2, 3, 4 et 6."),
      trueFalse("FSH et LH sont des gonadostimulines chez la femme comme chez l’homme.", true, "Ce sont les deux gonadotropines de l’antéhypophyse."),
      short("Donne la phase ovarienne associée à une progestérone élevée.", ["phase lutéale", "phase luteale", "phase lutéinique", "phase luteinique"], "Une progestérone élevée traduit l’activité du corps jaune."),
      short("Écris les numéros des affirmations exactes de l’exercice 1, dans l’ordre.", ["2, 3, 4, 6", "2-3-4-6", "2 3 4 6", "2;3;4;6"], "La réponse fidèle est 2, 3, 4 et 6."),
    ],
    corrections: [
      "L’exercice masculin de la page 6 est conservé comme transfert et identifié comme hors du cœur thématique de la leçon.",
      "Le mot source « intestitielles » est corrigé en « interstitielles » pour les cellules de Leydig.",
      "La LH est reliée directement aux cellules de Leydig et indirectement à la spermatogenèse via la testostérone ; la proposition 5 reste fausse dans la formulation scolaire donnée.",
      "Le maintien du corps jaune en début de grossesse est expliqué par l’hCG.",
      "La réponse officielle attendue pour l’exercice de consolidation est explicitée : 2, 3, 4 et 6.",
    ],
  },
];

const levelOrder = [
  "cycle-landmarks-menarche",
  "ovarian-cycle-follicle-ovulation",
  "uterine-cycle-endometrium",
  "pituitary-ovarian-hormone-curves",
  "experimental-control-ovary-pituitary",
  "hypothalamic-pituitary-ovarian-axis",
  "negative-positive-feedback",
  "rabbit-endometrium-assessment",
  "integrated-cycle-final-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau cycles sexuels introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalCSvtFemaleCyclesPath: LearningPath = {
  id: "terminale-c-svt-l7-female-sexual-cycles",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 3, title: "La reproduction chez l’être humain" },
  chapterNumber: 7,
  title: "Les cycles sexuels chez la femme",
  description: "Le cours officiel intégral restructuré en neuf niveaux interactifs : cycles ovarien et utérin, courbes hormonales, expériences, rétrocontrôles, évaluation des quatre lots et mission de synthèse.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire les phases des cycles ovarien et utérin et les synchroniser",
    "Interpréter les courbes de FSH, LH, estradiol et progestérone",
    "Construire l’axe hypothalamo-hypophyso-ovarien et ses rétrocontrôles",
    "Raisonner à partir d’une ablation, d’une greffe, d’une stimulation ou d’une injection hormonale",
    "Résoudre la situation officielle sur l’action séquentielle de l’estradiol et de la progestérone",
  ],
  modules: [
    {
      id: "female-sexual-cycles-mastery",
      title: "Maîtriser les cycles sexuels chez la femme",
      description: "Neuf niveaux progressifs, des repères du cycle à la mission officielle sur le contrôle hormonal de l’endomètre.",
      lessons: builtLevels,
    },
  ],
};
