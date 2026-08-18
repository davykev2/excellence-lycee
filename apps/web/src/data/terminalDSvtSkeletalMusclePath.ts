import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  LessonSourceMetadata,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "SVT TD_L3_Le fonctionnement du muscle strié squelettique.pdf";

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

const source = (pages: string, section: string, corrections: string[]): LessonSourceMetadata => ({
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
  eyebrow: "Schéma original à explorer",
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
  eyebrow: "Mécanisme à dérouler",
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
      introduction: "Observe d’abord la structure ou le tracé, nomme le résultat mesurable, puis relie-le au mécanisme sans confondre observation et interprétation.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : une réponse de SVT solide enchaîne indice observé, mécanisme biologique et conclusion précise.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: LevelSeed[] = [
  {
    id: "muscle-organ-to-fiber",
    title: "Du muscle à la fibre musculaire",
    summary: "Changer d’échelle du muscle entier jusqu’à la cellule musculaire et identifier les enveloppes, faisceaux, vaisseaux et myofibrilles.",
    pages: "1-2",
    section: "I-A. Structure du muscle strié squelettique",
    durationMinutes: 24,
    xp: 45,
    body: String.raw`
## Un organe construit pour produire une force

Un **muscle strié squelettique** est un organe fixé au squelette par des tendons. Il transforme l’énergie chimique en travail mécanique : sa tension déplace un segment osseux ou stabilise une articulation. Il ne faut pas le réduire à un paquet de cellules. Il contient des fibres musculaires, du tissu conjonctif, des vaisseaux sanguins et des nerfs moteurs et sensitifs.

L’organisation est emboîtée. Le muscle entier est enveloppé par l’**épimysium**. Il est divisé en **faisceaux** entourés de périmysium. Chaque faisceau contient de longues **fibres musculaires** enveloppées d’endomysium. Une fibre est une cellule cylindrique plurinucléée ; sa membrane est le **sarcolemme** et son cytoplasme le **sarcoplasme**. Elle renferme de nombreuses **myofibrilles** parallèles, responsables de l’aspect strié.

| Échelle | Objet observé | Élément caractéristique |
|---|---|---|
| organe | muscle entier | tendon, épimysium, nerfs et vaisseaux |
| faisceau | groupe de fibres | périmysium |
| cellule | fibre musculaire | sarcolemme, noyaux périphériques, sarcoplasme |
| organite contractile | myofibrille | succession régulière de sarcomères |

## Pourquoi les vaisseaux et les nerfs sont indispensables

Le sang apporte le dioxygène et les nutriments, puis emporte le dioxyde de carbone et une partie des métabolites. Le **motoneurone** commande la fibre au niveau de la plaque motrice. Un même motoneurone et toutes les fibres qu’il innerve forment une unité motrice. Le recrutement progressif de plusieurs unités motrices permettra plus loin d’expliquer pourquoi la réponse d’un muscle entier peut augmenter avec l’intensité de la stimulation.

Une fibre contient aussi un réticulum sarcoplasmique, des mitochondries, du glycogène et de la myoglobine. Le réticulum stocke le calcium ; les mitochondries participent à la production durable d’ATP. Ces deux fonctions relient déjà structure, commande et énergie.

## Lire une coupe sans changer d’échelle par erreur

Sur une coupe transversale, un faisceau apparaît comme un territoire contenant plusieurs profils de fibres. Sur une coupe longitudinale, les fibres et myofibrilles sont parallèles. Une **fibre** n’est donc pas un faisceau, et une **myofibrille** n’est pas une cellule. La longueur exceptionnelle de la fibre explique la présence de plusieurs noyaux, situés surtout en périphérie sous le sarcolemme.

> **Précision scientifique.** Le document source montre correctement l’emboîtement général mais nomme peu les enveloppes conjonctives. Les termes épimysium, périmysium et endomysium rendent la hiérarchie explicite sans modifier le programme.

> **Astuce mémoire — M-F-F-M :** **M**uscle → **F**aisceau → **F**ibre → **M**yofibrille. À chaque flèche, on change d’échelle.
`,
    keyPoint: "Muscle → faisceau → fibre musculaire → myofibrille ; la fibre est une cellule et la myofibrille son appareil contractile.",
    example: "Si une coupe montre plusieurs cellules rassemblées dans une même gaine, on observe un faisceau ; si une cellule contient de nombreux cylindres fins, ces cylindres sont des myofibrilles.",
    methodSteps: [
      "Repère d’abord l’échelle : organe, faisceau, cellule ou myofibrille.",
      "Nomme l’enveloppe correspondante et les structures visibles.",
      "Associe les vaisseaux à l’approvisionnement et les nerfs à la commande.",
      "Conclue en replaçant l’objet dans la hiérarchie M-F-F-M.",
    ],
    interaction: diagram(
      "Quatre zooms dans le muscle",
      "Ouvre chaque niveau d’organisation puis reconstruis le trajet du tendon au sarcomère.",
      "Muscle strié squelettique",
      "Organe vascularisé et innervé, fixé au squelette et composé de faisceaux.",
      [
        { id: "organ", label: "Muscle entier", role: "Organe", detail: "L’épimysium entoure l’organe ; le tendon transmet sa force à l’os.", group: "Échelle 1" },
        { id: "bundle", label: "Faisceau", role: "Groupe de fibres", detail: "Le périmysium délimite un ensemble de fibres parcouru par des vaisseaux et des nerfs.", group: "Échelle 2" },
        { id: "cell", label: "Fibre musculaire", role: "Cellule plurinucléée", detail: "Le sarcolemme entoure le sarcoplasme ; les noyaux sont surtout périphériques.", group: "Échelle 3" },
        { id: "myofibril", label: "Myofibrille", role: "Cylindre contractile", detail: "Elle est faite d’une succession de sarcomères alignés.", group: "Échelle 4" },
        { id: "blood", label: "Capillaire", role: "Approvisionnement", detail: "Il apporte O₂ et substrats puis reprend CO₂ et métabolites.", group: "Fonction" },
        { id: "motor", label: "Motoneurone", role: "Commande", detail: "Sa terminaison forme une plaque motrice sur la fibre.", group: "Fonction" },
      ],
      "La force macroscopique dépend de structures microscopiques alignées, alimentées par le sang et commandées par les motoneurones.",
    ),
    questions: [
      choice("Quel ordre va du plus grand au plus petit ?", ["Muscle → faisceau → fibre → myofibrille", "Fibre → muscle → tendon → faisceau", "Myofibrille → faisceau → muscle → fibre", "Faisceau → noyau → muscle → tendon"], 0, "Le muscle contient des faisceaux, eux-mêmes faits de fibres contenant des myofibrilles.", "Figure 1 • page 1"),
      choice("La fibre musculaire est…", ["un tendon", "une cellule plurinucléée", "un vaisseau", "un faisceau complet"], 1, "La fibre est une longue cellule musculaire contenant des myofibrilles."),
      choice("Quelle enveloppe entoure un faisceau ?", ["Épimysium", "Sarcolemme", "Périmysium", "Périoste"], 2, "Le périmysium entoure chaque faisceau."),
      choice("Quel terme désigne la membrane de la fibre ?", ["Sarcoplasme", "Myoglobine", "Endomysium", "Sarcolemme"], 3, "Le sarcolemme est la membrane plasmique spécialisée de la fibre."),
      trueFalse("Une myofibrille est une cellule musculaire complète.", false, "C’est une structure contractile située à l’intérieur de la fibre."),
      choice("Pourquoi le muscle est-il richement vascularisé ?", ["Pour recevoir O₂ et nutriments et évacuer des métabolites", "Pour fabriquer des os", "Pour empêcher tout échange", "Pour remplacer les nerfs"], 0, "Son activité énergétique exige des échanges sanguins rapides."),
      choice("Quelle structure transmet la force du muscle à l’os ?", ["La myéline", "Le tendon", "Le noyau", "Le capillaire"], 1, "Le tendon prolonge le tissu conjonctif du muscle et transmet la traction."),
      choice("Quel organite contractile contient une succession de sarcomères ?", ["Le lysosome", "Le noyau", "La myofibrille", "Le ribosome"], 2, "Les myofibrilles sont constituées de sarcomères répétés."),
      trueFalse("Les noyaux d’une fibre squelettique sont généralement nombreux et périphériques.", true, "La fibre mature est plurinucléée et ses noyaux se trouvent sous le sarcolemme."),
      choice("Un motoneurone et toutes les fibres qu’il commande forment…", ["un sarcomère", "un tendon", "un périmysium", "une unité motrice"], 3, "Cette unité sera recrutée avec d’autres pour moduler la force."),
      short("Complète la chaîne : muscle → faisceau → … → myofibrille.", ["fibre", "fibre musculaire", "cellule musculaire"], "L’étape manquante est la fibre musculaire.", "Figure 1 • page 1"),
    ],
    corrections: [
      "Les enveloppes épimysium, périmysium et endomysium sont précisées pour lever l’ambiguïté entre muscle, faisceau et fibre.",
      "La fibre musculaire est explicitement identifiée comme une cellule plurinucléée, et non comme un faisceau.",
      "Les rôles distincts des vaisseaux, du motoneurone, du réticulum sarcoplasmique et des mitochondries sont explicités au lieu de réduire le muscle à ses seules myofibrilles.",
    ],
  },
  {
    id: "actomyosin-cross-bridge-cycle",
    title: "Faire tourner le cycle actomyosine",
    summary: "Ordonner attachement, coup de force, détachement et réarmement en attribuant à l’ATP son rôle exact.",
    pages: "3-4 et 10-11",
    section: "II-C. Cycle des ponts actomyosine",
    durationMinutes: 30,
    xp: 75,
    body: String.raw`
## Un moteur cyclique, pas un crochet permanent

Une tête de myosine ne reste pas fixée à l’actine pendant toute la contraction. Elle parcourt un **cycle** répété tant que le Ca²⁺ maintient les sites accessibles et que l’ATP est disponible. Des têtes voisines ne sont pas toutes au même stade ; cette désynchronisation maintient une traction régulière.

Le point de départ le plus clair est une tête fortement liée après son coup de force. Une nouvelle molécule d’**ATP se fixe à la myosine et provoque son détachement** de l’actine. La myosine hydrolyse ensuite ATP en ADP + Pi ; l’énergie libérée arme la tête dans une conformation à haute énergie. Si le site de l’actine est exposé, la tête s’y lie faiblement puis plus fortement. La libération de Pi déclenche le **coup de force** : la tête pivote et entraîne l’actine vers la ligne M. L’ADP est libéré à la fin.

| Étape | Nucléotide sur la myosine | Événement |
|---|---|---|
| détachement | ATP vient de se fixer | affinité actine-myosine réduite |
| réarmement | ADP + Pi | hydrolyse, tête énergisée |
| attachement | ADP + Pi puis Pi libéré | site de l’actine accessible |
| coup de force | ADP puis aucun | pivotement et traction |

## Deux conditions simultanées

Le **calcium** contrôle l’accès au rail d’actine ; l’**ATP** commande les changements d’état de la tête. Un manque de Ca²⁺ empêche l’attachement efficace. Un manque d’ATP empêche surtout le détachement : les ponts restent bloqués, ce qui explique la rigidité cadavérique après épuisement des réserves.

L’ATP alimente également SERCA pendant la relaxation et d’autres pompes qui restaurent les gradients ioniques. Dire seulement qu’il « donne l’énergie au pivotement » est incomplet : sa **fixation** détache la tête, son **hydrolyse** réarme le moteur, et les libérations de Pi/ADP accompagnent la production de force.

## Corriger l’ordre du texte officiel

Le texte à trous de l’exercice 1 enchaîne « la tête fixe une molécule d’ATP et se fixe à l’actine », puis place l’hydrolyse avant le pivotement. La deuxième moitié est utile, mais la première inverse un point essentiel : une tête portant un ATP fraîchement lié se **détache**. Elle s’attache à nouveau après hydrolyse, sous forme myosine-ADP-Pi, lorsque Ca²⁺ a exposé le site.

Le mot « site d’attachement » de la banque correspond au site de l’actine normalement masqué par la tropomyosine. Les expressions « phase d’attachement », « état initial » et « phase de détachement » sont conservées pour reconnaître l’exercice, mais replacées dans le cycle biochimique correct.

## Raisonnement expérimental

Si une préparation contient Ca²⁺ mais aucun ATP, les sites sont ouverts mais les têtes déjà liées ne peuvent pas se libérer. Si elle contient ATP mais que le calcium reste stocké, le détachement et l’armement moléculaire sont possibles, mais les sites d’actine restent masqués. La force durable exige donc les deux signaux.

> **Astuce mémoire — ATP : Arrache, Tensionne, Puis tire.** La fixation **arrache** la tête à l’actine ; l’hydrolyse la **tensionne** ; la libération de Pi accompagne la traction.
`,
    keyPoint: "ATP fixé détache la myosine ; ATP hydrolysé réarme la tête ; Pi libéré déclenche le coup de force ; Ca²⁺ rend l’actine accessible.",
    example: "Dans un muscle privé d’ATP, ajouter Ca²⁺ ne suffit pas : les têtes ne peuvent plus accomplir un nouveau détachement, donc le cycle se bloque.",
    methodSteps: [
      "Commence par la fixation d’un nouvel ATP et le détachement.",
      "Place ensuite l’hydrolyse en ADP + Pi et le réarmement.",
      "Autorise l’attachement seulement si Ca²⁺ expose le site.",
      "Associe la libération de Pi au coup de force puis recommence.",
    ],
    interaction: timeline(
      "Une tête, quatre états",
      "Déroule le cycle puis vérifie ce qui se bloque si ATP ou Ca²⁺ manque.",
      [
        { label: "1. ATP se fixe", shortLabel: "Détachement", detail: "La fixation d’ATP réduit l’affinité de la myosine pour l’actine : la tête devient libre." },
        { label: "2. ATP hydrolysé", shortLabel: "Réarmement", detail: "La tête conserve ADP + Pi et prend une conformation à haute énergie : le moteur est prêt." },
        { label: "3. Site exposé", shortLabel: "Attachement", detail: "Grâce à Ca²⁺-troponine, la myosine atteint l’actine et forme un pont." },
        { label: "4. Pi libéré", shortLabel: "Coup de force", detail: "La tête pivote et tire l’actine vers la ligne M : c’est le glissement." },
        { label: "5. ADP libéré", shortLabel: "État fortement lié", detail: "Un nouvel ATP doit maintenant se fixer pour séparer les protéines et relancer le cycle." },
        { label: "6. Répétition", shortLabel: "Têtes désynchronisées", detail: "Des milliers de cycles décalés maintiennent une force continue." },
      ],
      "L’ATP ne colle pas la myosine à l’actine : il est précisément la clé qui permet d’abord leur séparation.",
    ),
    questions: [
      choice("Quel effet produit la fixation d’un nouvel ATP sur la myosine ?", ["Elle détache la tête de l’actine", "Elle fixe irréversiblement la tête", "Elle libère Ca²⁺ du sang", "Elle raccourcit l’actine"], 0, "La fixation d’ATP réduit l’affinité actine-myosine."),
      choice("Que produit l’hydrolyse de l’ATP sur la tête ?", ["Sa destruction", "Son réarmement énergétique", "La fermeture du tendon", "La synthèse d’actine"], 1, "La tête porte alors ADP + Pi et une conformation énergisée."),
      choice("Quel événement accompagne directement le coup de force ?", ["L’entrée de glucose", "La fixation de l’ATP", "La libération de Pi", "La mitose"], 2, "La libération de phosphate déclenche le changement de conformation."),
      choice("À la fin du coup de force, quel produit est libéré ?", ["O₂", "Actine", "Troponine", "ADP"], 3, "L’ADP quitte la tête à la fin du cycle mécanique."),
      trueFalse("Une tête privée d’ATP peut rester fortement attachée à l’actine.", true, "Sans nouvel ATP, le détachement est bloqué."),
      choice("Quel ion rend le site de l’actine accessible ?", ["Ca²⁺", "Cl⁻", "Fe³⁺", "I⁻"], 0, "Ca²⁺ agit via la troponine-tropomyosine."),
      choice("Quel état porte ADP + Pi ?", ["La tête détruite", "La tête réarmée", "La ligne Z", "Le tendon relâché"], 1, "L’ATP hydrolysé reste provisoirement lié sous forme ADP + Pi."),
      choice("Quelle affirmation du texte source doit être corrigée ?", ["La myosine hydrolyse l’ATP", "L’actine glisse", "ATP se fixe puis la tête s’attache immédiatement", "Le muscle consomme de l’énergie"], 2, "ATP fixé entraîne d’abord le détachement."),
      trueFalse("Toutes les têtes de myosine doivent pivoter exactement au même instant.", false, "Leur fonctionnement décalé maintient une traction plus régulière."),
      choice("Pourquoi la rigidité apparaît-elle quand l’ATP est épuisé ?", ["Le calcium devient un sucre", "L’actine disparaît", "Les sarcomères font une mitose", "Les ponts ne peuvent plus se détacher"], 3, "Le nouvel ATP est requis pour séparer la tête de l’actine."),
      short("Quel produit de l’hydrolyse, libéré avant l’ADP, accompagne le coup de force ?", ["Pi", "phosphate inorganique", "phosphate", "P_i"], "La libération de Pi déclenche le coup de force.", "Mécanisme • page 4"),
    ],
    corrections: [
      "L’ordre biochimique du texte à trous est rectifié : la fixation d’ATP détache la tête ; l’hydrolyse précède le nouvel attachement.",
      "Le rôle de la libération de Pi dans le coup de force et celui de l’ADP en fin de cycle sont explicités.",
      "Les rôles complémentaires du Ca²⁺ et de l’ATP sont séparés.",
    ],
  },
  {
    id: "action-potential-muscle-twitch",
    title: "Comparer potentiel d’action et secousse",
    summary: "Lire sur le même axe le signal électrique bref, le temps de latence et la réponse mécanique plus lente.",
    pages: "4-6",
    section: "III-A. Manifestations électrique et mécanique",
    durationMinutes: 28,
    xp: 80,
    body: String.raw`
## Deux enregistrements, deux phénomènes

Après stimulation, une électrode peut enregistrer le **potentiel d’action musculaire** tandis qu’un myographe enregistre la tension ou le raccourcissement. Le signal électrique est bref et précède la réponse mécanique. Il ne faut pas appeler ces deux tracés « contraction » : le premier traduit des flux ioniques à travers le sarcolemme ; le second traduit la force développée par les sarcomères.

Au repos, le potentiel de membrane d’une fibre squelettique se situe typiquement autour de **−85 à −90 mV**. Une excitation supraliminaire déclenche une dépolarisation rapide, un dépassement transitoire de 0 mV, puis une repolarisation. Le document source note une variation de −85 à −20 mV ; le tracé et la physiologie d’un potentiel d’action complet indiquent plutôt un dépassement positif. L’amplitude exacte dépend du dispositif, mais il ne faut pas transformer un potentiel extracellulaire en valeur intracellulaire sans précision.

## Les trois phases d’une secousse isolée

1. **Temps de latence** : après le stimulus, le PA se propage, Ca²⁺ est libéré et les premiers ponts se forment ; la force externe n’est pas encore nettement visible.
2. **Phase de contraction** : la tension ou le raccourcissement augmente, car de nombreux cycles actomyosine produisent une force.
3. **Phase de relaxation** : Ca²⁺ est recapté, les sites se remasquent et la tension revient progressivement vers la ligne de base.

| Tracé | Durée relative | Origine principale |
|---|---|---|
| potentiel d’action d’une fibre | très brève | conductances Na⁺ puis K⁺ du sarcolemme |
| latence mécanique | intermédiaire | couplage et mise en tension des éléments élastiques |
| secousse | plus longue | cycle des ponts et recapture de Ca²⁺ |

## PA d’une fibre et électromyogramme ne sont pas synonymes

Un **potentiel d’action musculaire** est l’événement électrique d’une membrane excitable. Un **électromyogramme (EMG)** est un signal extracellulaire composé, résultant de l’activité de nombreuses fibres et unités motrices. Le document les associe comme s’il s’agissait du même objet. Pour une lecture rigoureuse, on nomme le type d’électrode et l’échelle observée.

## Pourquoi la réponse mécanique vient après

La contraction attend les étapes du couplage : conduction dans les tubules T, libération de Ca²⁺, déplacement de la tropomyosine, formation des ponts et transmission de la tension aux structures élastiques. L’électricité ne « devient » donc pas mécaniquement force en un instant ; elle déclenche une chaîne moléculaire mesurable pendant la latence.

> **Astuce mémoire — E avant M :** l’**É**lectricité est brève et vient avant la réponse **M**écanique.
`,
    keyPoint: "Le PA musculaire bref précède la secousse : latence de couplage, contraction, puis relaxation ; un PA de fibre n’est pas un EMG composé.",
    example: "Si le PA culmine à 2 ms et la tension à 45 ms, ce décalage n’est pas un retard de l’appareil : il correspond au couplage et aux cycles mécaniques.",
    methodSteps: [
      "Identifie les unités de chaque axe et la grandeur enregistrée.",
      "Place le stimulus puis le PA avant le début de la tension.",
      "Délimite latence, contraction et relaxation sur le myogramme.",
      "Explique le décalage par le couplage Ca²⁺ et la mécanique des ponts.",
    ],
    interaction: timeline(
      "Une secousse en six temps",
      "Avance du stimulus au retour au repos et compare durée électrique et durée mécanique.",
      [
        { label: "Stimulus", shortLabel: "Excitation", detail: "La membrane atteint son seuil et déclenche un PA au temps zéro." },
        { label: "PA", shortLabel: "Signal bref", detail: "Na⁺ puis K⁺ modifient rapidement le potentiel membranaire." },
        { label: "Latence", shortLabel: "Couplage", detail: "Tubules T, réticulum, Ca²⁺ et éléments élastiques préparent la force sans tension encore nettement visible." },
        { label: "Contraction", shortLabel: "Montée", detail: "Les ponts produisent une force et les sarcomères raccourcissent jusqu’au pic mécanique." },
        { label: "Relaxation", shortLabel: "Descente", detail: "SERCA abaisse Ca²⁺, les ponts actifs diminuent et la tension décroît." },
        { label: "Repos", shortLabel: "Ligne de base", detail: "Les gradients sont restaurés et la fibre est prête pour une nouvelle excitation." },
      ],
      "Le signal électrique finit avant que la secousse n’atteigne son maximum.",
    ),
    questions: [
      choice("Quel phénomène apparaît en premier après le stimulus ?", ["Le potentiel d’action musculaire", "Le maximum de tension", "La fatigue", "La synthèse du tendon"], 0, "Le signal électrique précède la réponse mécanique.", "Courbes • page 5"),
      choice("Quelle valeur décrit le mieux le potentiel de repos d’une fibre ?", ["+85 mV", "Environ −85 à −90 mV", "0 V en permanence", "+200 mV"], 1, "L’intérieur est négatif au repos."),
      choice("Quelle phase se situe entre le stimulus et la montée visible de tension ?", ["Tétanos", "Fatigue", "Latence", "Recrutement maximal"], 2, "Le couplage excitation-contraction occupe ce délai."),
      choice("Quelle phase suit le pic de tension ?", ["Dépolarisation initiale", "Latence", "Seuil", "Relaxation"], 3, "La tension décroît pendant la relaxation."),
      trueFalse("Le potentiel d’action dure généralement plus longtemps que la secousse entière.", false, "Il est beaucoup plus bref."),
      choice("Quel ion porte surtout la phase ascendante du PA musculaire ?", ["Na⁺", "Ca²⁺ mitochondrial", "Fe²⁺", "I⁻"], 0, "Une entrée de Na⁺ dépolarise rapidement le sarcolemme."),
      choice("Quel ion contribue principalement à la repolarisation ?", ["Na⁺ entrant", "K⁺ sortant", "Glucose", "Actine"], 1, "L’augmentation de conductance K⁺ ramène le potentiel vers le repos."),
      choice("Qu’est-ce qu’un EMG ?", ["Le PA intracellulaire d’une seule molécule", "Une coupe de sarcomère", "Un signal extracellulaire composé de nombreuses fibres", "Une réserve d’ATP"], 2, "L’EMG somme une activité musculaire collective."),
      trueFalse("La latence inclut des événements invisibles comme la libération de Ca²⁺.", true, "Le mécanisme interne commence avant la force externe."),
      choice("Quelle donnée de la source est signalée comme probablement incomplète ?", ["La présence de K⁺", "Le temps de relaxation", "Le potentiel de repos négatif", "Le pic limité à −20 mV pour un PA intracellulaire complet"], 3, "Un PA musculaire intracellulaire dépasse habituellement 0 mV."),
      short("Nomme les trois phases mécaniques d’une secousse.", ["latence contraction relaxation", "latence, contraction et relaxation", "temps de latence, contraction, relaxation"], "La secousse comprend latence, montée de tension et retour au repos.", "Courbe • page 5"),
    ],
    corrections: [
      "La variation −85 à −20 mV du PDF est contextualisée : un PA intracellulaire complet dépasse normalement 0 mV ; une mesure extracellulaire ne se lit pas comme un potentiel absolu.",
      "Le potentiel d’action d’une fibre est distingué de l’électromyogramme composé.",
      "Le temps de latence est relié au couplage excitation-contraction et aux éléments élastiques.",
    ],
  },
  {
    id: "summation-tetanus-fatigue",
    title: "Moduler la force : sommation, tétanos et fatigue",
    summary: "Interpréter secousse isolée, sommation temporelle, tétanos fusionné ou non, recrutement et diminution de la performance.",
    pages: "5-7 et 11",
    section: "III-B-C. Stimulations successives et fatigue",
    durationMinutes: 31,
    xp: 90,
    body: String.raw`
## Deux manières différentes d’augmenter la force

La **sommation temporelle** concerne des stimulations rapprochées d’une même préparation : la seconde survient avant la relaxation complète. Le Ca²⁺ cytosolique reste élevé, davantage de ponts sont actifs et les tensions s’additionnent. Le **recrutement**, lui, concerne le muscle entier : une stimulation plus intense active progressivement davantage d’unités motrices.

Ces mécanismes ne doivent pas être confondus. Une fibre isolée répond au potentiel d’action selon la loi du tout ou rien, mais la force d’un muscle entier est graduée par fréquence des messages et nombre d’unités recrutées.

## Des secousses au tétanos

Si les stimulations sont suffisamment espacées, on observe des **secousses isolées**. Si elles arrivent pendant la relaxation, les tensions se somment. À fréquence élevée, le tracé conserve de petites oscillations : c’est un **tétanos imparfait**, non fusionné. À fréquence encore plus forte, les oscillations disparaissent et la tension forme un plateau : c’est un **tétanos parfait**, fusionné.

| Tracé | Aspect | Interprétation |
|---|---|---|
| A de l’exercice 2 | une montée et un retour | secousse isolée |
| C | plateau ondulé | tétanos imparfait/non fusionné |
| B | plateau lisse | tétanos parfait/fusionné |

Le document source attribue la sommation à l’activation de « différentes fibres » lors de stimulations rapprochées. Dans le protocole de fréquence, l’explication principale est la persistance du Ca²⁺ et la **sommation temporelle**. L’activation de nouvelles fibres explique plutôt le recrutement observé quand l’intensité augmente dans l’exercice 3.

## Lire l’expérience d’intensité croissante

Les quinze excitations valent 11,9 ; 12,1 ; 12,5 ; 13 ; 14 ; 15 ; 18 ; 19 ; 21 ; 22,2 ; 24,5 ; 27 ; 29 ; 30 et 35 mV. Les premières intensités sont infraliminaires ou trop faibles pour une réponse globale visible. Vers **13 mV**, la réponse apparaît. Elle augmente ensuite par recrutement d’unités motrices jusqu’à un maximum voisin de **29 mV**, puis atteint un plateau de 29 à 35 mV quand les unités disponibles sont recrutées.

## La fatigue n’est pas « le lactate qui empoisonne »

Lors de stimulations prolongées, la tension maximale peut diminuer et la relaxation se modifier : c’est une **fatigue musculaire**, phénomène multifactoriel. Elle associe selon l’effort disponibilité énergétique, accumulation de phosphate inorganique et d’ions H⁺, perturbations du Ca²⁺, modifications de l’excitabilité et facteurs nerveux. Le lactate n’est pas un simple déchet responsable à lui seul de la douleur ; il peut être transporté et réutilisé comme carburant. Les crampes et douleurs différées ont aussi des causes multiples.

> **Astuce mémoire — fréquence = fusion ; intensité = recrutement.** Cette opposition évite l’erreur la plus fréquente de la leçon.
`,
    keyPoint: "La fréquence produit sommation et tétanos ; l’intensité recrute des unités motrices ; la fatigue est multifactorielle et ne se réduit pas au lactate.",
    example: "Un plateau ondulé sous stimulations rapides est un tétanos imparfait ; un plateau lisse est un tétanos parfait ; une amplitude croissante avec l’intensité indique un recrutement.",
    methodSteps: [
      "Repère si la variable expérimentale est la fréquence ou l’intensité.",
      "Décris le tracé : secousse, oscillations, plateau lisse ou amplitude graduée.",
      "Relie fréquence à Ca²⁺ persistant et intensité à unités motrices recrutées.",
      "Explique la baisse tardive par plusieurs facteurs de fatigue, sans cause unique abusive.",
    ],
    interaction: diagram(
      "Quatre signatures mécaniques",
      "Choisis un tracé pour découvrir la stimulation et le mécanisme correspondant.",
      "Réponse mécanique du muscle",
      "La forme du myogramme révèle fréquence, recrutement et état métabolique.",
      [
        { id: "twitch", label: "Secousse isolée", role: "Stimulus unique", detail: "Latence, contraction puis relaxation complète.", group: "Fréquence" },
        { id: "sum", label: "Sommation", role: "Stimulus avant relaxation", detail: "Ca²⁺ reste élevé et la seconde tension s’ajoute à la première.", group: "Fréquence" },
        { id: "unfused", label: "Tétanos imparfait", role: "Plateau ondulé", detail: "Des relaxations partielles subsistent entre les stimulations.", group: "Fréquence" },
        { id: "fused", label: "Tétanos parfait", role: "Plateau lisse", detail: "La fréquence ne permet plus de relaxation visible.", group: "Fréquence" },
        { id: "recruit", label: "Recrutement", role: "Intensité croissante", detail: "Davantage d’unités motrices contribuent jusqu’au maximum.", group: "Intensité" },
        { id: "fatigue", label: "Fatigue", role: "Tension décroissante", detail: "La performance baisse sous l’effet combiné de facteurs ioniques, énergétiques et nerveux.", group: "Durée" },
      ],
      "Fréquence, intensité et durée modifient le tracé par trois mécanismes distincts.",
    ),
    questions: [
      choice("Que montre la figure A de l’exercice 2 ?", ["Une secousse isolée", "Un tétanos parfait", "Un tétanos imparfait", "Une coupe de sarcomère"], 0, "A montre une réponse unique suivie d’une relaxation.", "Exercice 2 • page 11"),
      choice("Que montre la figure B ?", ["Une fatigue seule", "Un tétanos parfait", "Une secousse", "Un PA"], 1, "Le plateau lisse correspond à une fusion complète."),
      choice("Que montre la figure C ?", ["Un recrutement spatial", "Une coupe H", "Un tétanos imparfait", "Un repos"], 2, "Les oscillations du plateau témoignent de relaxations partielles."),
      choice("Quelle variable produit surtout la sommation temporelle ?", ["Le nombre de noyaux", "La longueur du tendon", "Le diamètre du capillaire", "La fréquence des stimulations"], 3, "Des messages rapprochés maintiennent Ca²⁺ élevé."),
      trueFalse("Le recrutement correspond à l’activation progressive d’unités motrices supplémentaires.", true, "Il explique la gradation de force du muscle entier."),
      choice("Vers quelle intensité une réponse visible apparaît-elle dans l’exercice 3 ?", ["Environ 13 mV", "35 V", "0,13 µV", "90 mV exactement"], 0, "Les premières réponses visibles commencent autour de la quatrième excitation.", "Exercice 3 • page 11"),
      choice("Vers quelle intensité le maximum est-il pratiquement atteint ?", ["11,9 mV", "Environ 29 mV", "13 V", "5,207 mV"], 1, "Le tracé plafonne approximativement de 29 à 35 mV."),
      choice("Quelle propriété décrit le mieux la réponse du muscle entier ?", ["Une réponse toujours nulle", "Une réponse uniquement électrique", "Une réponse graduée par recrutement", "Une réponse sans seuil"], 2, "Les unités motrices s’ajoutent à mesure que l’intensité croît."),
      trueFalse("Le lactate est l’unique cause de la fatigue, des crampes et de toute douleur musculaire.", false, "La fatigue et les douleurs sont multifactorielles, et le lactate peut être réutilisé."),
      choice("Quel mécanisme explique surtout la sommation dans une même fibre ?", ["Une nouvelle mitose", "La disparition de l’actine", "Une baisse immédiate de Ca²⁺", "La persistance d’un Ca²⁺ cytosolique élevé"], 3, "Le calcium n’est pas totalement recapté avant le stimulus suivant."),
      short("Associe B et C de l’exercice 2, dans cet ordre.", ["tétanos parfait, tétanos imparfait", "tétanos fusionné puis non fusionné", "parfait et imparfait"], "B est fusionné/parfait ; C est non fusionné/imparfait.", "Exercice 2 • page 11"),
    ],
    corrections: [
      "La sommation temporelle par persistance de Ca²⁺ est séparée du recrutement spatial d’unités motrices.",
      "Les figures de l’exercice 2 sont identifiées A = secousse, B = tétanos parfait, C = tétanos imparfait.",
      "La fatigue, les crampes et les douleurs ne sont pas attribuées au seul lactate ; la physiologie multifactorielle est explicitée.",
    ],
  },
  {
    id: "sarcomere-sliding-contraction",
    title: "Prouver le glissement des filaments",
    summary: "Comparer sarcomère relâché et contracté pour démontrer que les filaments glissent sans raccourcir.",
    pages: "3-4",
    section: "II-A. Modifications structurales pendant la contraction",
    durationMinutes: 25,
    xp: 65,
    body: String.raw`
## Deux états à comparer, une seule conclusion solide

Le document juxtapose un sarcomère au repos et un sarcomère contracté. La bonne méthode consiste à comparer les mêmes repères dans les deux états. Pendant la contraction, les lignes Z se rapprochent : le **sarcomère raccourcit**. La bande I et la zone H diminuent, tandis que la largeur de la bande A reste constante.

Cette dernière observation est décisive. La bande A représente la longueur des filaments épais ; si elle ne change pas, les filaments de myosine ne raccourcissent pas. Les filaments fins gardent eux aussi leur longueur. Le raccourcissement provient donc d’un **glissement relatif** : l’actine pénètre davantage entre les filaments de myosine et la zone de chevauchement augmente.

| Indice observé | Interprétation |
|---|---|
| lignes Z rapprochées | sarcomère plus court |
| bande I réduite | l’actine seule occupe moins d’espace visible |
| zone H réduite | la myosine seule occupe moins d’espace visible |
| bande A constante | la longueur des filaments épais ne change pas |

## De la tête de myosine au raccourcissement global

Les têtes de myosine forment temporairement des **ponts actomyosine** avec les sites exposés de l’actine. Leur changement de conformation tire le filament fin vers la ligne M. Comme des millions de têtes agissent de manière décalée dans des sarcomères disposés en série et en parallèle, une petite translation moléculaire devient une force mesurable à l’échelle du muscle.

Le modèle exclut deux idées fausses fréquentes. Premièrement, les filaments ne sont pas consommés ni froissés à chaque secousse. Deuxièmement, les lignes Z ne tirent pas activement : elles se rapprochent parce que l’actine qui y est ancrée glisse vers le centre.

## Une démonstration en quatre phrases

1. Je constate que les lignes Z se rapprochent et que le sarcomère raccourcit.
2. Je constate que I et H diminuent mais que A reste constante.
3. J’en déduis que les filaments conservent leur longueur et que leur chevauchement augmente.
4. Je conclus que la contraction résulte du glissement des filaments fins entre les filaments épais.

## Relaxation

Quand la concentration cytosolique de Ca²⁺ diminue, la tropomyosine remasque les sites de l’actine. Les ponts cessent de se renouveler ; l’élasticité des structures musculaires et les forces externes ramènent le sarcomère vers sa longueur de repos. La relaxation n’est donc pas une « contraction inverse » produite par les têtes.

> **Précision.** Le document source décrit correctement le raccourcissement du sarcomère, mais parle d’une « bande claire A » et d’une « bande sombre B ». Les observations sont conservées avec la nomenclature corrigée A sombre/I claire.

> **Astuce mémoire :** le sarcomère **se serre**, les filaments **se superposent** davantage, mais leur taille reste stable.
`,
    keyPoint: "La contraction raccourcit le sarcomère par glissement : I et H diminuent, A reste constante et le chevauchement actine-myosine augmente.",
    example: "Si A mesure 1,6 µm avant et après, mais H passe de 0,4 à 0,1 µm, les filaments épais n’ont pas raccourci : l’actine a avancé vers M.",
    methodSteps: [
      "Compare la distance Z–Z dans les deux états.",
      "Relève séparément les changements de A, I et H.",
      "Utilise A constante pour exclure le raccourcissement des filaments.",
      "Conclue par l’augmentation du chevauchement actine-myosine.",
    ],
    interaction: timeline(
      "Du repos au raccourcissement",
      "Déroule les indices dans l’ordre et distingue toujours ce qui est observé de ce qui est déduit.",
      [
        { label: "Sarcomère au repos", shortLabel: "Repos", detail: "Le chevauchement est modéré : I et H sont visibles et les lignes Z éloignées." },
        { label: "Ponts", shortLabel: "Actomyosine", detail: "Des têtes de myosine se lient aux sites accessibles de l’actine et produisent une force moléculaire." },
        { label: "Glissement", shortLabel: "Actine vers M", detail: "Le filament fin avance entre les filaments épais sans changer de longueur ; le chevauchement croît." },
        { label: "Bandes", shortLabel: "I et H diminuent", detail: "A reste constante car elle correspond à la longueur de la myosine : c’est la preuve structurale." },
        { label: "Sarcomère contracté", shortLabel: "Z rapprochées", detail: "La somme de nombreux sarcomères raccourcis produit une force macroscopique." },
        { label: "Relaxation", shortLabel: "Ca²⁺ abaissé", detail: "Les sites se remasquent, les ponts actifs cessent de se renouveler et le muscle retourne au repos." },
      ],
      "La constance de A est la preuve la plus rapide que les filaments glissent au lieu de raccourcir.",
    ),
    questions: [
      choice("Quel indice montre directement le raccourcissement du sarcomère ?", ["Le rapprochement des lignes Z", "L’augmentation de A", "La disparition du noyau", "La rupture du tendon"], 0, "La distance Z–Z diminue.", "Figure 3 • page 3"),
      choice("Quelle zone diminue parce que le chevauchement augmente ?", ["La ligne M", "La zone H", "Le sarcolemme", "Le tendon"], 1, "La partie de myosine seule devient plus étroite."),
      choice("Que prouve la constance de la bande A ?", ["L’actine disparaît", "Le calcium est absent", "Les filaments épais ne raccourcissent pas", "Le muscle ne produit aucune force"], 2, "A correspond à toute la longueur de la myosine."),
      choice("Dans quelle direction l’actine glisse-t-elle lors de la contraction ?", ["Vers le tendon seulement", "Hors de la fibre", "Vers les noyaux", "Vers la ligne M"], 3, "Les filaments fins avancent vers le centre du sarcomère."),
      trueFalse("Le filament fin devient plus court à chaque contraction.", false, "Sa longueur reste stable ; son chevauchement avec la myosine augmente."),
      choice("Quel complexe temporaire transmet la force ?", ["Le pont actomyosine", "Le complexe ADN-ARN", "Le périmysium", "Le capillaire"], 0, "Une tête de myosine liée à l’actine forme un pont."),
      choice("Pourquoi la bande I diminue-t-elle ?", ["La ligne Z est détruite", "La zone d’actine sans myosine se réduit", "La myosine se dissout", "Le sarcolemme raccourcit seul"], 1, "L’actine pénètre davantage dans A."),
      choice("Quelle phrase est une interprétation et non une observation brute ?", ["Les lignes Z sont plus proches", "H est plus petite", "Les filaments glissent les uns par rapport aux autres", "A a la même largeur"], 2, "Le glissement est le mécanisme déduit de plusieurs mesures."),
      trueFalse("La relaxation exige que les ponts actifs cessent de se renouveler.", true, "La baisse de Ca²⁺ remasque les sites de l’actine."),
      choice("Quelle conclusion est incompatible avec les données ?", ["I diminue", "H diminue", "Le chevauchement augmente", "Les filaments de myosine raccourcissent fortement"], 3, "A constante exclut cette hypothèse."),
      short("Quelle bande garde une largeur constante ?", ["A", "bande A", "la bande A"], "La bande A correspond à la longueur des filaments épais.", "Figure 3 • page 3"),
    ],
    corrections: [
      "Les observations de raccourcissement sont reformulées avec la nomenclature A/I standard.",
      "La relaxation est distinguée d’une prétendue contraction inverse : elle suit surtout la baisse du Ca²⁺ cytosolique et l’arrêt des ponts actifs.",
      "La constance de longueur des filaments fins et épais est rendue explicite : seul leur degré de chevauchement change.",
    ],
  },
  {
    id: "excitation-calcium-coupling",
    title: "Relier excitation et libération de calcium",
    summary: "Suivre le message de la plaque motrice aux tubules T puis au réticulum sarcoplasmique pour expliquer le déclenchement de la contraction.",
    pages: "4-5 et 10-11",
    section: "II-B. Couplage excitation-contraction",
    durationMinutes: 29,
    xp: 70,
    body: String.raw`
## De l’influx nerveux au potentiel d’action musculaire

Le message du motoneurone atteint son bouton terminal. L’arrivée du potentiel d’action ouvre des canaux Ca²⁺ présynaptiques ; l’entrée de calcium déclenche l’exocytose d’**acétylcholine**. Le neuromédiateur diffuse dans la fente, se fixe sur les récepteurs nicotiniques de la plaque motrice et provoque un potentiel de plaque. Si le seuil est atteint, un **potentiel d’action musculaire** se propage sur le sarcolemme.

La membrane s’enfonce dans la fibre sous forme de **tubules T**. Le potentiel d’action atteint ainsi presque simultanément l’intérieur de la cellule. Des capteurs de voltage membranaires commandent l’ouverture des canaux du **réticulum sarcoplasmique**, vaste réseau qui stocke Ca²⁺ autour des myofibrilles.

## Le calcium libère les sites, il ne fournit pas l’énergie

La concentration de Ca²⁺ dans le sarcoplasme augmente rapidement. Le calcium se lie à la **troponine C** ; la tropomyosine se déplace et découvre les sites de liaison de la myosine sur l’actine. Les têtes peuvent alors enchaîner leur cycle à condition de disposer d’ATP.

| Signal | Compartiment | Conséquence immédiate |
|---|---|---|
| PA du motoneurone | bouton synaptique | entrée de Ca²⁺ et libération d’ACh |
| ACh | fente/plaque motrice | dépolarisation de la fibre |
| PA musculaire | sarcolemme et tubules T | activation des capteurs de voltage |
| Ca²⁺ libéré | sarcoplasme | fixation à la troponine C |
| tropomyosine déplacée | filament fin | sites de l’actine accessibles |

Le Ca²⁺ est donc un **signal de couplage**. Il ne remplace ni l’ATP ni la myosine. Dire qu’il « se fixe sur l’actine » est trop vague : son récepteur fonctionnel principal dans le filament fin est la troponine C.

## La relaxation est un processus actif

Lorsque les potentiels d’action cessent, des pompes **SERCA** utilisent de l’ATP pour ramener activement le Ca²⁺ dans le réticulum. La concentration cytosolique baisse ; la troponine reprend sa conformation de repos et la tropomyosine remasque les sites. Les ponts cessent de se former et la fibre se relâche.

L’acétylcholinestérase hydrolyse parallèlement l’ACh dans la fente synaptique. Ces deux arrêts — fin du message à la plaque et recapture du Ca²⁺ — empêchent une contraction permanente.

## Corriger le texte à trous de la source

La liste de mots officielle permet de reconstruire la succession générale, mais sa phrase « les ions se fixent sur l’actine, au niveau des troponines » doit devenir « les ions se fixent sur la troponine C associée à l’actine ». De même, le réticulum ne repompe pas le calcium « spontanément » : les pompes SERCA le font **activement** grâce à l’ATP.

> **Astuce mémoire — Nerf, membrane, calcium, ponts :** N → M → Ca²⁺ → P. Le message ouvre l’accès ; l’ATP fait tourner le moteur.
`,
    keyPoint: "PA musculaire → tubules T → libération de Ca²⁺ → troponine C → sites de l’actine exposés ; SERCA repompe ensuite Ca²⁺ avec de l’ATP.",
    example: "Bloquer les canaux de libération du réticulum laisse le PA musculaire se propager, mais empêche l’élévation de Ca²⁺ et donc la force.",
    methodSteps: [
      "Sépare la transmission neuromusculaire du couplage interne à la fibre.",
      "Fais suivre le PA sur le sarcolemme et dans les tubules T.",
      "Place la libération de Ca²⁺ avant l’exposition des sites de l’actine.",
      "Explique la relaxation par SERCA et la baisse du Ca²⁺ cytosolique.",
    ],
    interaction: timeline(
      "Le relais nerveux devient force",
      "Déroule chaque relais puis identifie où agit un blocage proposé.",
      [
        { label: "1. PA nerveux", shortLabel: "Bouton", detail: "Le voltage ouvre des canaux Ca²⁺ présynaptiques et déclenche l’exocytose d’ACh." },
        { label: "2. Plaque motrice", shortLabel: "ACh", detail: "Le potentiel de plaque déclenche un PA musculaire s’il atteint le seuil : la fibre se dépolarise." },
        { label: "3. Tubules T", shortLabel: "Signal interne", detail: "Le PA est conduit près de chaque myofibrille et active les capteurs de voltage." },
        { label: "4. Réticulum", shortLabel: "Ca²⁺ libéré", detail: "Le stock intracellulaire passe transitoirement dans le sarcoplasme." },
        { label: "5. Troponine C", shortLabel: "Frein levé", detail: "La tropomyosine quitte les sites de liaison de la myosine et les ponts deviennent possibles." },
        { label: "6. SERCA", shortLabel: "Recapture", detail: "Les pompes consomment de l’ATP pour réaccumuler Ca²⁺ dans le réticulum et permettre la relaxation." },
      ],
      "Le calcium est l’intermédiaire rapide entre l’électricité membranaire et le moteur actomyosine.",
    ),
    questions: [
      choice("Quel neuromédiateur commande la plaque motrice ?", ["L’acétylcholine", "Le lactate", "Le glycogène", "L’actine"], 0, "L’ACh est libérée par le motoneurone.", "Exercice 1 • pages 10-11"),
      choice("Quel événement présynaptique déclenche l’exocytose ?", ["Une sortie d’ATP", "Une entrée de Ca²⁺", "Une perte de myosine", "Une synthèse d’ADN"], 1, "Le PA ouvre des canaux Ca²⁺ dans le bouton."),
      choice("Quelle structure conduit le PA vers l’intérieur de la fibre ?", ["Le tendon", "Le périmysium", "Les tubules T", "La zone H"], 2, "Les tubules T sont des invaginations du sarcolemme."),
      choice("Quel compartiment libère le calcium contractile ?", ["Le noyau", "Le sang directement", "La mitochondrie seule", "Le réticulum sarcoplasmique"], 3, "Il constitue le principal stock rapidement mobilisable."),
      trueFalse("Le calcium fournit directement l’énergie du pivotement de la myosine.", false, "Il lève le frein régulateur ; l’énergie vient de l’ATP."),
      choice("À quelle protéine régulatrice Ca²⁺ se lie-t-il ?", ["Troponine C", "Collagène", "Élastine", "Hémoglobine"], 0, "Cette liaison déplace indirectement la tropomyosine."),
      choice("Que fait alors la tropomyosine ?", ["Elle détruit l’actine", "Elle libère les sites de liaison de la myosine", "Elle devient du glycogène", "Elle ferme les tubules T"], 1, "Son déplacement rend les sites accessibles."),
      choice("Quelle pompe assure la recapture active du Ca²⁺ ?", ["ATP synthase", "Pompe Na⁺/K⁺ seule", "SERCA", "Myokinase"], 2, "SERCA transporte Ca²⁺ dans le réticulum."),
      trueFalse("La relaxation peut consommer de l’ATP.", true, "SERCA utilise de l’ATP et le détachement des têtes en exige aussi."),
      choice("Quel blocage empêcherait la contraction malgré un PA musculaire normal ?", ["Plus de noyaux périphériques", "Davantage de glycogène", "Un tendon plus long", "Absence de libération de Ca²⁺ du réticulum"], 3, "Sans Ca²⁺ cytosolique, les sites restent masqués."),
      short("Nomme la protéine qui reçoit Ca²⁺ sur le filament fin.", ["troponine C", "la troponine C", "TnC"], "Le calcium se fixe à TnC, pas directement à une tête de myosine.", "Exercice 1 • page 10"),
    ],
    corrections: [
      "La formulation source « Ca²⁺ se fixe sur l’actine au niveau des troponines » est précisée : Ca²⁺ se lie à la troponine C.",
      "La recapture du calcium est attribuée aux pompes SERCA et explicitement reconnue comme active et consommatrice d’ATP.",
      "Le potentiel de plaque et le potentiel d’action musculaire sont distingués.",
    ],
  },
  {
    id: "sarcomere-bands-myofilaments",
    title: "Décoder le sarcomère et ses bandes",
    summary: "Repérer lignes Z, bandes A et I, zone H, filaments fins et épais en corrigeant la nomenclature inversée de la source.",
    pages: "2-3",
    section: "I-B. Ultrastructure de la myofibrille",
    durationMinutes: 27,
    xp: 55,
    body: String.raw`
## Le sarcomère, unité répétée de la myofibrille

Au microscope, une myofibrille présente une alternance régulière de zones claires et sombres. L’unité comprise entre deux **lignes Z** successives est le **sarcomère**. Tous les sarcomères d’une même myofibrille sont alignés bout à bout ; l’alignement transversal de nombreuses myofibrilles produit les stries visibles dans la fibre.

La nomenclature standard est essentielle. La **bande A** est sombre et correspond à toute la longueur des filaments épais de myosine. La **bande I** est claire et ne contient que des filaments fins d’actine ; une ligne Z la traverse. Au centre de la bande A, la **zone H** ne contient que de la myosine. La **ligne M** se situe au centre et organise les filaments épais.

| Région | Filaments présents | Évolution pendant la contraction |
|---|---|---|
| bande I | actine seule | diminue |
| zone de chevauchement | actine + myosine | augmente |
| zone H | myosine seule | diminue, parfois disparaît |
| bande A | toute la longueur de la myosine | reste constante |

## Les protéines des myofilaments

Le filament fin comprend principalement de l’**actine F**, polymère d’actine G, et deux protéines régulatrices : la **tropomyosine** et le complexe de **troponine**. Au repos, la tropomyosine masque les sites de liaison de la myosine sur l’actine. Le calcium se lie surtout à la sous-unité C de la troponine ; le complexe change alors de forme et déplace la tropomyosine.

Le filament épais est formé de molécules de **myosine II**. Chaque tête possède un site de liaison à l’actine et une activité ATPasique. La myosine peut donc transformer l’énergie chimique de l’ATP en changement de conformation mécanique.

## Corriger la légende avant de raisonner

Le document source appelle « bande B sombre » et « bande A claire » les deux zones. Cette désignation est inversée par rapport à la nomenclature internationale utilisée en physiologie : **A = sombre**, **I = claire**. L’erreur n’est pas recopiée silencieusement, car elle ferait échouer toute localisation des coupes X, Y et Z de l’évaluation finale.

La source regroupe aussi actine, tropomyosine et troponine sous l’expression « protéines contractiles ». L’actine et la myosine produisent directement l’interaction mécanique ; troponine et tropomyosine sont surtout **régulatrices**. Cette distinction explique pourquoi le calcium déclenche la contraction sans pousser lui-même les filaments.

## Une carte mentale simple

Imagine le sarcomère comme une salle entre deux murs Z. Les rails d’actine partent des murs vers le centre ; les filaments de myosine sont centrés sur la ligne M. La contraction rapproche les murs parce que les rails glissent, pas parce qu’ils raccourcissent.

> **Astuce mémoire — A reste À longueur constante ; I devient plus étroIte.** La zone H se ferme à mesure que le chevauchement augmente.
`,
    keyPoint: "Entre deux lignes Z se trouve un sarcomère : la bande A sombre reste constante, tandis que la bande I claire et la zone H diminuent.",
    example: "Une coupe située dans la zone H montre seulement des filaments épais ; une coupe dans la bande I montre seulement des filaments fins ; une coupe dans le chevauchement montre les deux.",
    methodSteps: [
      "Délimite d’abord le sarcomère entre deux lignes Z.",
      "Place la bande A sur toute la longueur des filaments épais.",
      "Réserve la bande I à l’actine seule et la zone H à la myosine seule.",
      "Vérifie ta légende avec la règle A constante, I et H variables.",
    ],
    interaction: diagram(
      "Voyage dans un sarcomère",
      "Sélectionne chaque région et prédis ce qu’une coupe transversale y rencontre.",
      "Sarcomère Z–Z",
      "L’actine part des lignes Z ; la myosine reste centrée autour de la ligne M.",
      [
        { id: "z", label: "Ligne Z", role: "Limite et ancrage", detail: "Elle limite le sarcomère et ancre les filaments fins.", group: "Repères" },
        { id: "i", label: "Bande I", role: "Actine seule", detail: "Zone claire traversée par Z ; elle raccourcit pendant la contraction.", group: "Bandes" },
        { id: "a", label: "Bande A", role: "Longueur de la myosine", detail: "Zone sombre ; sa largeur reste constante car les filaments épais ne raccourcissent pas.", group: "Bandes" },
        { id: "h", label: "Zone H", role: "Myosine seule", detail: "Partie centrale de A sans actine au repos ; elle diminue lorsque le chevauchement augmente.", group: "Bandes" },
        { id: "m", label: "Ligne M", role: "Centre", detail: "Elle organise et aligne les filaments épais au milieu du sarcomère.", group: "Repères" },
        { id: "thin", label: "Filament fin", role: "Actine + régulation", detail: "Actine F, tropomyosine et troponine portent le système régulé par Ca²⁺.", group: "Molécules" },
        { id: "thick", label: "Filament épais", role: "Myosine II", detail: "Ses têtes lient l’actine et hydrolysent l’ATP.", group: "Molécules" },
      ],
      "La nomenclature standard A/I transforme le motif strié en carte précise des filaments.",
    ),
    questions: [
      choice("Quelles structures délimitent un sarcomère ?", ["Deux lignes Z", "Deux lignes M", "Deux noyaux", "Deux tendons"], 0, "Le sarcomère s’étend d’une ligne Z à la suivante.", "Figure 2 • page 2"),
      choice("Quelle bande est sombre dans la nomenclature standard ?", ["I", "A", "Z", "H seule"], 1, "A est la bande anisotrope sombre."),
      choice("Quelle région ne contient que des filaments fins ?", ["Zone H", "Ligne M", "Bande I", "Toute la bande A"], 2, "La bande I contient l’actine sans myosine."),
      choice("Quelle région ne contient que des filaments épais au repos ?", ["Bande I", "Ligne Z", "Zone de chevauchement", "Zone H"], 3, "La zone H est la partie centrale de A sans actine."),
      trueFalse("La largeur de la bande A diminue fortement pendant une contraction normale.", false, "La longueur des filaments épais reste constante, donc A reste constante."),
      choice("À quoi se lie directement Ca²⁺ pour lever l’inhibition ?", ["À la troponine C", "Au collagène", "À la ligne Z", "À l’ATP"], 0, "Le calcium modifie la troponine et déplace la tropomyosine."),
      choice("Quelle protéine masque les sites de liaison de la myosine au repos ?", ["La titine uniquement", "La tropomyosine", "L’hémoglobine", "La kératine"], 1, "La tropomyosine couvre les sites de l’actine en absence de Ca²⁺."),
      choice("Quelle molécule forme le filament épais ?", ["Troponine", "Actine G", "Myosine II", "Glycogène"], 2, "Les molécules de myosine s’assemblent en filaments épais."),
      trueFalse("Troponine et tropomyosine sont principalement des protéines régulatrices.", true, "Elles contrôlent l’accès de la myosine à l’actine."),
      choice("Quelle légende du PDF doit être corrigée ?", ["Z limite le sarcomère", "H est centrale", "La myosine est épaisse", "B sombre/A claire au lieu de A sombre/I claire"], 3, "La source inverse la nomenclature standard des bandes."),
      short("Donne les deux régions qui diminuent pendant la contraction.", ["bande I et zone H", "I et H", "la bande I et la zone H"], "I et H diminuent ; la bande A reste constante.", "Figure 3 • page 3"),
    ],
    corrections: [
      "La nomenclature inversée du PDF est corrigée : bande A sombre et bande I claire, conformément à l’usage standard.",
      "Troponine et tropomyosine sont distinguées comme protéines régulatrices, tandis qu’actine et myosine portent directement l’interaction mécanique.",
      "Le calcium est situé sur la troponine C et non vaguement sur l’actine.",
    ],
  },
  {
    id: "rapid-atp-regeneration",
    title: "Régénérer rapidement l’ATP",
    summary: "Expliquer pourquoi le stock d’ATP reste faible et comment adénylate kinase et phosphocréatine soutiennent les premières secondes.",
    pages: "7-9",
    section: "IV-A-B. Besoins et voies anaérobies alactiques",
    durationMinutes: 28,
    xp: 100,
    body: String.raw`
## Une monnaie énergétique à renouveler sans cesse

L’ATP est directement utilisé par la myosine, par les pompes SERCA et par les pompes ioniques. Pourtant, le muscle n’en stocke qu’une petite quantité. Le tableau du document indique une valeur de **4 à 6 mg·g⁻¹** au repos comme en activité. Cette constance apparente ne signifie pas que l’ATP n’est pas consommé : elle signifie que sa **concentration ou son pool est maintenu près d’un état stationnaire** grâce à une resynthèse rapide.

Sans régénération, le stock disponible ne soutiendrait que quelques secondes d’activité intense. Plusieurs voies se superposent au lieu de s’allumer comme des interrupteurs exclusifs.

## Première voie : l’adénylate kinase

L’enzyme aussi appelée **myokinase** catalyse :

$$2\,ADP \rightleftharpoons ATP + AMP$$

Cette réaction fournit rapidement une molécule d’ATP à partir de deux ADP. Elle aide à amortir une demande brusque, mais sa capacité est limitée et l’AMP formé devient aussi un signal de déficit énergétique.

## Deuxième voie : la phosphocréatine

La **créatine kinase** transfère le phosphate de la phosphocréatine à l’ADP :

$$PCr + ADP + H^+ \rightleftharpoons Cr + ATP$$

La phosphocréatine sert de tampon énergétique proche des myofibrilles. Elle peut régénérer l’ATP très rapidement sans utiliser directement le dioxygène et sans produire directement de lactate : on parle de système phosphagène ou anaérobie alactique. Sa puissance est élevée mais sa réserve est faible.

## Corriger le vocabulaire enzymatique

Le document emploie le terme **« phosphocréatinase »**. Le nom physiologique attendu pour la réaction est **créatine kinase**. Le mot source est conservé dans l’historique des corrections pour que l’élève reconnaisse la page, mais il ne doit pas devenir une fausse enzyme apprise par cœur.

| Système | Réaction utile | Vitesse | Capacité |
|---|---|---|---|
| ATP déjà présent | ATP → ADP + Pi | immédiate | très faible |
| adénylate kinase | 2 ADP → ATP + AMP | très rapide | faible |
| créatine kinase | PCr + ADP → Cr + ATP | très rapide | limitée par PCr |

## Aucun système ne travaille seul

Dès le début de l’effort, glycolyse et respiration augmentent aussi. Le classement « immédiat, puis glycolytique, puis oxydatif » décrit leur contribution dominante, pas une succession totalement étanche. Pendant la récupération, le métabolisme oxydatif aide à restaurer la phosphocréatine et les gradients ioniques.

> **Astuce mémoire — P-C-R :** **P**hosphocréatine cède son phosphate grâce à la **C**réatine kinase pour **R**égénérer l’ATP.

> **Lecture critique du tableau.** Les conditions de mesure, la durée et l’intensité de l’effort ne sont pas précisées. Les nombres illustrent une demande accrue, mais ne permettent pas de calculer une puissance universelle.
`,
    keyPoint: "Le faible pool d’ATP est maintenu par resynthèse ; 2 ADP donnent ATP + AMP et la créatine kinase transfère le phosphate de PCr à l’ADP.",
    example: "Au départ d’un sprint, la phosphocréatine maintient brièvement l’ATP près de sa valeur de repos malgré une hydrolyse très rapide.",
    methodSteps: [
      "Distingue stock d’ATP et quantité d’ATP renouvelée pendant l’effort.",
      "Écris sans erreur la réaction de l’adénylate kinase.",
      "Écris la réaction PCr + ADP et nomme la créatine kinase.",
      "Compare puissance et capacité, puis rappelle que les voies se chevauchent.",
    ],
    interaction: diagram(
      "Les tampons de l’ATP",
      "Explore chaque réserve et classe-la selon sa vitesse et sa capacité.",
      "ATP musculaire",
      "La concentration reste proche de 4 à 6 mg·g⁻¹ seulement parce que plusieurs voies régénèrent l’ATP consommé.",
      [
        { id: "atp", label: "ATP présent", role: "Usage immédiat", detail: "Myosine, SERCA et pompes ioniques l’hydrolysent directement.", group: "Dépense" },
        { id: "adp", label: "ADP", role: "Substrat à recycler", detail: "Deux ADP peuvent donner ATP + AMP via l’adénylate kinase.", group: "Tampon" },
        { id: "amp", label: "AMP", role: "Signal énergétique", detail: "Il augmente lorsque la demande dépasse la disponibilité énergétique.", group: "Signal" },
        { id: "pcr", label: "Phosphocréatine", role: "Réserve de phosphate", detail: "Elle transfère rapidement son phosphate à l’ADP.", group: "Tampon" },
        { id: "ck", label: "Créatine kinase", role: "Enzyme correcte", detail: "Elle remplace le terme impropre « phosphocréatinase » du document.", group: "Enzyme" },
        { id: "recovery", label: "Récupération", role: "Réserve restaurée", detail: "L’énergie oxydative reconstitue notamment la phosphocréatine.", group: "Après effort" },
      ],
      "Un ATP stable dans un prélèvement actif témoigne d’un renouvellement intense, pas d’une absence de consommation.",
    ),
    questions: [
      choice("Que signifie un pool d’ATP voisin de 4 à 6 mg·g⁻¹ au repos et en activité ?", ["L’ATP consommé est rapidement resynthétisé", "Le muscle n’utilise jamais d’ATP", "La myosine fabrique du glucose", "Le calcium remplace tout ATP"], 0, "Une concentration stable peut cacher un flux très élevé.", "Tableau • page 7"),
      choice("Quelle enzyme catalyse 2 ADP ⇌ ATP + AMP ?", ["Troponine", "Adénylate kinase", "Myosine II", "Lactase"], 1, "La myokinase est un autre nom de l’adénylate kinase."),
      choice("Quel produit accompagne ATP dans cette réaction ?", ["O₂", "Créatine", "AMP", "Lactate"], 2, "Deux ADP donnent un ATP et un AMP."),
      choice("Quelle enzyme transfère le phosphate de PCr à l’ADP ?", ["Phosphatase osseuse", "SERCA", "ATP synthase seulement", "Créatine kinase"], 3, "Créatine kinase est le nom correct."),
      trueFalse("La phosphocréatine constitue une réserve illimitée.", false, "Elle est très rapide mais de capacité limitée."),
      choice("Quel système est dit anaérobie alactique ?", ["Le système phosphagène", "La fermentation seule", "La respiration mitochondriale", "La synthèse protéique"], 0, "Il n’exige pas directement O₂ et ne produit pas directement de lactate."),
      choice("Quel terme du PDF est remplacé par créatine kinase ?", ["Myoglobine", "Phosphocréatinase", "Troponine", "Sarcolemme"], 1, "Le terme source n’est pas la dénomination enzymatique attendue."),
      choice("Qui utilise de l’ATP pendant la relaxation ?", ["La ligne Z", "Le tendon seul", "La pompe SERCA", "Le lactate uniquement"], 2, "SERCA repompe activement Ca²⁺."),
      trueFalse("Les voies énergétiques démarrent de façon strictement successive, sans aucun chevauchement.", false, "Elles contribuent simultanément avec des proportions variables."),
      choice("Que reconstitue notamment le métabolisme oxydatif pendant la récupération ?", ["Les lignes Z détruites", "Un nouveau squelette", "Les noyaux", "La phosphocréatine"], 3, "La récupération restaure les réserves rapides."),
      short("Écris le nom moderne de la « phosphocréatinase » de la source.", ["créatine kinase", "la créatine kinase", "CK"], "L’enzyme du système phosphagène est la créatine kinase.", "Page 8"),
    ],
    corrections: [
      "Le tableau 4 à 6 mg·g⁻¹ est interprété comme pool/concentration quasi stationnaire, non comme quantité totale d’ATP consommée.",
      "Le terme « phosphocréatinase » est corrigé en créatine kinase.",
      "Les voies énergétiques sont présentées comme simultanées avec contributions variables, non comme interrupteurs successifs.",
    ],
  },
  {
    id: "glycolysis-respiration-energy",
    title: "Comparer glycolyse, lactate et respiration",
    summary: "Relier les échanges mesurés aux voies de resynthèse de l’ATP et distinguer bilan scolaire historique et rendement moderne.",
    pages: "7-9",
    section: "IV-C-D. Glycolyse, fermentation lactique et respiration",
    durationMinutes: 32,
    xp: 110,
    body: String.raw`
## Ce que révèle le tableau métabolique

Le document compare repos et activité : O₂ utilisé **0,307 puis 5,207 L** ; CO₂ produit **0,220 puis 5,950 L** ; glucides ou glycogène utilisés **0,307 puis 8,432 g** ; lactate **0 puis 1,958 g** ; protéines **0 dans les deux colonnes** ; pool d’ATP **4 à 6 mg·g⁻¹**. Les conditions exactes manquent, mais la tendance est nette : l’effort augmente fortement l’utilisation de substrats, les échanges gazeux et la production de lactate, tandis que l’ATP est continuellement régénéré.

## Glycolyse et fermentation lactique

Dans le cytosol, la glycolyse transforme un glucose en deux pyruvates. Elle produit quatre ATP mais en investit deux : son **gain net est 2 ATP** par glucose, ainsi que deux NADH. Lorsque la réoxydation mitochondriale du NADH ne suffit pas à la vitesse demandée, la lactate déshydrogénase réduit le pyruvate en lactate et régénère NAD⁺ :

$$glucose + 2\,ADP + 2\,P_i \rightarrow 2\,lactate + 2\,ATP + 2\,H_2O$$

Le lactate n’est pas seulement un déchet. Il peut quitter la fibre, être oxydé par d’autres fibres ou organes, ou servir à reformer du glucose dans le foie. Sa présence indique un flux glycolytique important, mais ne suffit pas à expliquer à elle seule fatigue ou douleur.

## Respiration mitochondriale

En présence d’une capacité oxydative suffisante, le pyruvate devient acétyl-CoA, entre dans le cycle de Krebs et fournit des coenzymes réduits à la chaîne respiratoire. Le dioxygène est l’accepteur final d’électrons ; l’ATP synthase utilise le gradient de protons pour phosphoryler l’ADP. Cette voie est plus lente à atteindre une forte contribution, mais sa capacité est grande.

Le bilan scolaire ancien du document attribue **38 ATP** à l’oxydation complète d’un glucose. Ce modèle historique facilite certains calculs mais les estimations biochimiques modernes chez les cellules eucaryotes sont plus souvent d’environ **30 à 32 ATP**, selon les navettes et les fuites de protons. Pour répondre à un exercice explicitement construit sur le modèle du PDF, on peut reconnaître 38 comme convention ; pour comprendre la physiologie actuelle, on retient un rendement variable proche de 30–32.

| Voie | Lieu | O₂ direct ? | ATP net/capacité | Produit carboné principal |
|---|---|---|---|---|
| glycolyse + lactate | cytosol | non | 2 ATP/glucose, rapide | lactate |
| oxydation mitochondriale | mitochondrie | oui à la chaîne | environ 30–32 ATP/glucose au total | CO₂ |

## Construire une conclusion prudente

L’augmentation simultanée d’O₂, CO₂, glucides et lactate montre que voies oxydatives et glycolytiques contribuent ensemble. L’absence de protéines dans ce tableau ne prouve pas que les acides aminés ne participent jamais au métabolisme ; elle concerne seulement les conditions rapportées. Sans durée, masse musculaire et protocole, les valeurs ne doivent pas être généralisées à tous les efforts.

> **Astuce mémoire :** glycolyse = rapide, petit gain ; mitochondrie = durable, grand gain ; lactate = carrefour recyclable.
`,
    keyPoint: "La glycolyse fournit 2 ATP nets et peut régénérer NAD⁺ via le lactate ; l’oxydation complète donne aujourd’hui environ 30–32 ATP, contre 38 dans l’ancien modèle scolaire.",
    example: "Une hausse conjointe de consommation d’O₂ et de production de lactate prouve que les voies oxydative et glycolytique peuvent fonctionner en même temps.",
    methodSteps: [
      "Décris séparément chaque variation du tableau sans inventer les conditions.",
      "Calcule le gain net glycolytique : 4 produits moins 2 investis.",
      "Explique la formation de lactate par la régénération de NAD⁺.",
      "Distingue convention scolaire de 38 ATP et estimation moderne de 30 à 32.",
    ],
    interaction: diagram(
      "Le carrefour énergétique du glucose",
      "Pars du glucose puis compare la branche lactate à la branche mitochondriale.",
      "Glucose musculaire",
      "La glycolyse alimente deux voies dont la contribution varie avec la puissance demandée et la capacité oxydative.",
      [
        { id: "glycolysis", label: "Glycolyse", role: "Cytosol", detail: "Un glucose donne deux pyruvates, 2 ATP nets et 2 NADH.", group: "Étape commune" },
        { id: "lactate", label: "Lactate", role: "NAD⁺ régénéré", detail: "La réduction du pyruvate permet à la glycolyse rapide de continuer.", group: "Branche rapide" },
        { id: "shuttle", label: "Navette du lactate", role: "Carburant transportable", detail: "Le lactate peut être oxydé ailleurs ou reconverti en glucose.", group: "Recyclage" },
        { id: "acetyl", label: "Acétyl-CoA", role: "Entrée mitochondriale", detail: "Le pyruvate oxydé alimente le cycle de Krebs.", group: "Branche durable" },
        { id: "etc", label: "Chaîne respiratoire", role: "O₂ accepteur final", detail: "Le transfert d’électrons crée un gradient de protons.", group: "Branche durable" },
        { id: "atps", label: "ATP synthase", role: "Phosphorylation oxydative", detail: "Le gradient permet un rendement total moderne souvent voisin de 30 à 32 ATP.", group: "Branche durable" },
      ],
      "Lactate et consommation d’O₂ peuvent augmenter ensemble : le muscle ne choisit pas nécessairement une seule voie.",
    ),
    questions: [
      choice("Quelle valeur d’O₂ est donnée pendant l’activité ?", ["5,207 L", "0 L", "1,958 L", "38 L"], 0, "Le tableau passe de 0,307 à 5,207 L.", "Tableau • page 7"),
      choice("Quelle masse de glucides/glycogène est indiquée pendant l’activité ?", ["0,307 g", "8,432 g", "5,950 g", "4 à 6 g"], 1, "La colonne activité indique 8,432 g."),
      choice("Quel est le gain net de la glycolyse par glucose ?", ["38 ATP", "4 ATP nets", "2 ATP", "0 ATP"], 2, "Quatre sont produits mais deux ont été investis."),
      choice("Pourquoi le pyruvate est-il réduit en lactate ?", ["Pour fabriquer de l’O₂", "Pour détruire tout NAD⁺", "Pour former des protéines", "Pour régénérer NAD⁺"], 3, "Cela permet à la glycolyse de continuer."),
      trueFalse("Le lactate est nécessairement un déchet inutilisable.", false, "Il peut être oxydé ou contribuer à la néoglucogenèse."),
      choice("Quel est l’accepteur final d’électrons de la chaîne respiratoire ?", ["O₂", "Actine", "Créatine", "Troponine"], 0, "Le dioxygène est réduit à l’extrémité de la chaîne."),
      choice("Quelle estimation moderne convient au total d’ATP par glucose eucaryote ?", ["Toujours exactement 2", "Environ 30 à 32", "Toujours exactement 100", "Aucun ATP"], 1, "Le rendement varie selon les navettes et les fuites."),
      choice("À quoi correspond 38 ATP dans la source ?", ["À la glycolyse nette", "À la phosphocréatine", "À un ancien modèle scolaire", "À la masse d’ATP en mg"], 2, "C’est une convention historique, pas un rendement universel moderne."),
      trueFalse("L’augmentation simultanée d’O₂ et de lactate est possible.", true, "Les voies contribuent simultanément dans des proportions différentes."),
      choice("Quelle limite empêche de généraliser les nombres du tableau ?", ["Le glucose n’existe pas", "Le muscle n’a pas de mitochondries", "Le CO₂ n’est jamais produit", "Durée, intensité et protocole ne sont pas précisés"], 3, "Les valeurs doivent rester liées aux conditions de l’expérience."),
      short("Quelle masse de lactate est indiquée en activité ?", ["1,958 g", "1.958 g", "1,958", "1.958"], "Le tableau indique 1,958 g contre 0 au repos.", "Tableau • page 7"),
    ],
    corrections: [
      "Les valeurs du tableau métabolique sont conservées, avec la limite explicite que durée, intensité et conditions expérimentales ne sont pas données.",
      "Le bilan glycolytique est exprimé en gain net de 2 ATP, plutôt qu’en production brute de 4 ou ancien compte 8 moins 6.",
      "Le rendement ancien de 38 ATP est contextualisé face à l’estimation moderne d’environ 30 à 32 ATP.",
      "Le lactate est présenté comme métabolite recyclable et non comme unique déchet responsable de la fatigue.",
    ],
  },
  {
    id: "official-muscle-assessment-mission",
    title: "Mission officielle : expliquer le muscle du document au résultat",
    summary: "Résoudre la situation d’évaluation et les trois exercices officiels sur ultrastructure, plaque motrice, tétanos et recrutement.",
    pages: "10-11",
    section: "Situation d’évaluation et consolidation des acquis",
    durationMinutes: 45,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## Mission 1 — exploiter l’ultrastructure

Le document 1 représente une portion de fibre musculaire en coupe longitudinale : sarcolemme, noyau périphérique, sarcoplasme, réticulum sarcoplasmique, mitochondries et myofibrilles y sont juxtaposés. L’élément **4 est une mitochondrie**. Sa double membrane, ses crêtes internes, sa matrice et son espace intermembranaire l’adaptent à la respiration et à la phosphorylation oxydative. Elle régénère une grande part de l’ATP nécessaire pendant un effort soutenu.

Une myofibrille est délimitée comme un cylindre strié ; à l’intérieur, les lignes Z encadrent les sarcomères. La bande A sombre contient les filaments épais et les zones de chevauchement ; la bande I claire contient les filaments fins seuls ; la zone H contient les filaments épais seuls.

Les coupes transversales du document 2 se localisent ainsi :

| Figure | Nature biochimique visible | Niveau longitudinal |
|---|---|---|
| **c** | filaments fins seuls, actine et protéines régulatrices | **X**, bande I |
| **b** | filaments épais seuls, myosine | **Y**, zone H |
| **a** | filaments fins et épais, actine + myosine | **Z**, zone de chevauchement de A |

Cette lecture conserve le principe de l’épreuve tout en corrigeant la nomenclature inversée des bandes dans le cours. Le rôle de la mitochondrie ne doit pas être formulé « elle fabrique l’énergie » : elle convertit l’énergie des nutriments en gradient électrochimique puis en ATP.

## Mission 2 — reconstruire le texte à trous

L’ordre attendu par la banque de mots est : **du nerf ; plaque motrice ; influx nerveux ; entrée d’ions Ca²⁺ ; neuromédiateurs ; dépolarisation ; cytoplasme ; site d’attachement ; phase d’attachement ; ATP ; myofilaments épais ; état initial ; activement ; phase de détachement**.

Une rédaction scientifiquement corrigée devient : le message arrive par le nerf à la plaque motrice. L’influx nerveux déclenche une entrée de Ca²⁺ dans le bouton et l’exocytose des neuromédiateurs. L’ACh dépolarise la membrane et déclenche un PA musculaire. Le réticulum libère Ca²⁺ dans le **sarcoplasme** — terme musculaire plus précis que « cytoplasme ». Ca²⁺ se fixe à la troponine C et découvre le site d’attachement. Une tête réarmée portant ADP + Pi se lie à l’actine ; la libération de Pi accompagne le coup de force. Un nouvel ATP entraîne ensuite la phase de détachement. SERCA repompe activement Ca²⁺ et la fibre se relâche.

Le texte source place « ATP se fixe » juste avant la phase d’attachement. Pour respecter la banque tout en évitant une erreur durable, il faut signaler que la **fixation d’ATP produit en réalité le détachement** ; l’hydrolyse réarme la tête avant son prochain attachement.

## Mission 3 — identifier les réponses mécaniques

Dans l’exercice 2, la figure **A** est une secousse isolée. La figure **B** est un tétanos parfait ou fusionné, reconnaissable à son plateau lisse. La figure **C** est un tétanos imparfait ou non fusionné, reconnaissable aux oscillations encore visibles.

Dans l’exercice 3 sur la grenouille, les intensités en mV sont : 11,9 ; 12,1 ; 12,5 ; 13 ; 14 ; 15 ; 18 ; 19 ; 21 ; 22,2 ; 24,5 ; 27 ; 29 ; 30 ; 35. La réponse apparaît vers 13 mV, croît jusqu’à environ 29 mV puis plafonne de 29 à 35 mV. L’intensification du stimulus recrute progressivement des axones moteurs et donc des unités motrices supplémentaires. Une fois toutes les unités accessibles recrutées, l’amplitude maximale ne croît plus.

## Rédaction finale type examen

« Les premières excitations sont infraliminaires. À partir d’environ 13 mV, une secousse apparaît et son amplitude augmente avec l’intensité. Cette gradation s’explique par le recrutement progressif d’unités motrices dont les axones n’ont pas tous le même seuil. Vers 29 mV, la réponse atteint un maximum et reste en plateau jusqu’à 35 mV : les unités motrices disponibles sont recrutées. Le muscle entier présente donc une réponse mécanique graduée, même si chaque fibre déclenche un potentiel d’action selon la loi du tout ou rien. »

> **Méthode de mission :** annote → justifie par la structure → compare les tracés → explique le mécanisme → déduis la propriété. Une simple liste de noms ne suffit pas.

> **Fidélité corrigée.** Toutes les tâches officielles des pages 10 et 11 sont reprises après le cours. Les réponses utilisent la science actuelle lorsque la banque ou la légende source est ambiguë.
`,
    keyPoint: "c = actine seule/X ; b = myosine seule/Y ; a = chevauchement/Z ; A = secousse, B = tétanos parfait, C = imparfait ; intensité croissante = recrutement.",
    example: "Une réponse absente à 12,5 mV, visible vers 13 mV puis maximale vers 29 mV met en évidence un seuil global suivi d’un recrutement jusqu’au plateau.",
    methodSteps: [
      "Sur l’ultrastructure, identifie l’échelle et relie chaque coupe aux filaments présents.",
      "Dans le texte à trous, replace la banque puis corrige explicitement sarcoplasme et rôle de l’ATP.",
      "Associe chaque myogramme à secousse, tétanos imparfait ou tétanos parfait.",
      "Sur l’intensité croissante, repère seuil, croissance et plateau avant d’expliquer le recrutement.",
      "Termine par une conclusion qui distingue fibre tout-ou-rien et muscle entier gradué.",
    ],
    interaction: diagram(
      "Le grand oral du muscle",
      "Choisis une station, formule ta réponse, puis ouvre la correction raisonnée.",
      "Épreuve officielle pages 10-11",
      "Trois documents mobilisent structure, mécanisme, tracés et propriété du muscle entier.",
      [
        { id: "ultra", label: "Ultrastructure", role: "13 repères + mitochondrie", detail: "Hiérarchise sarcolemme, sarcoplasme, réticulum, mitochondries et myofibrilles.", group: "Situation" },
        { id: "cross-x", label: "Coupe X / c", role: "Actine seule", detail: "La coupe dans la bande I montre des filaments fins et leurs protéines régulatrices.", group: "Situation" },
        { id: "cross-y", label: "Coupe Y / b", role: "Myosine seule", detail: "La zone H contient seulement les filaments épais.", group: "Situation" },
        { id: "cross-z", label: "Coupe Z / a", role: "Chevauchement", detail: "Dans A hors H, actine et myosine sont visibles ensemble.", group: "Situation" },
        { id: "fill", label: "Texte à trous", role: "14 expressions", detail: "Reconstruis la plaque motrice puis rectifie l’ordre ATP-attachement.", group: "Exercice 1" },
        { id: "traces", label: "A, B, C", role: "Secousse et tétanos", detail: "A isolée, B fusionné/parfait, C non fusionné/imparfait.", group: "Exercice 2" },
        { id: "threshold", label: "13 mV", role: "Seuil observable", detail: "La première réponse mécanique globale devient visible autour de cette intensité.", group: "Exercice 3" },
        { id: "plateau", label: "29 à 35 mV", role: "Recrutement maximal", detail: "Le plateau traduit l’activation de toutes les unités motrices accessibles.", group: "Exercice 3" },
      ],
      "Une même leçon relie l’organisation subcellulaire, la commande nerveuse, la force enregistrée et l’énergie qui renouvelle l’ATP.",
    ),
    questions: [
      choice("Quel est l’élément 4 du document 1 ?", ["Une mitochondrie", "Un tendon", "Une ligne Z", "Un motoneurone entier"], 0, "Sa double membrane et ses crêtes l’identifient.", "Situation d’évaluation • page 10"),
      choice("Quel rôle principal faut-il lui attribuer ?", ["Masquer l’actine", "Participer à la phosphorylation oxydative et à la régénération d’ATP", "Former le périmysium", "Déclencher directement un PA nerveux"], 1, "La mitochondrie couple oxydation et synthèse d’ATP."),
      choice("Quelle figure montre les filaments fins seuls ?", ["a", "b", "c", "aucune"], 2, "La figure c se place dans la bande I au niveau X."),
      choice("Quelle figure montre les filaments épais seuls ?", ["a", "c", "les trois", "b"], 3, "La figure b correspond à la zone H au niveau Y."),
      choice("Quelle figure montre actine et myosine ensemble ?", ["a", "b", "c", "aucune"], 0, "La figure a correspond à la zone de chevauchement au niveau Z."),
      choice("Quel premier mot complète le texte officiel : “par l’intermédiaire …” ?", ["de l’ATP", "du nerf", "du lactate", "de la myosine"], 1, "Le message arrive au muscle par le nerf.", "Exercice 1 • pages 10-11"),
      choice("Quel groupe complète “Le contact nerf-muscle forme la…” ?", ["zone H", "bande A", "plaque motrice", "créatine kinase"], 2, "La jonction neuromusculaire forme la plaque motrice."),
      choice("Quel événement suit l’arrivée de l’influx au bouton dans la banque ?", ["Une sortie de glucose", "Une contraction du tendon", "Une disparition des canaux", "Une entrée d’ions Ca²⁺"], 3, "L’entrée présynaptique de Ca²⁺ déclenche l’exocytose."),
      choice("Quel mot officiel doit être précisé en “sarcoplasme” ?", ["Cytoplasme", "Nerf", "ATP", "Neuromédiateur"], 0, "Le sarcoplasme est le cytoplasme spécialisé de la fibre."),
      choice("Quelle correction faut-il apporter à l’ordre source ?", ["Ca²⁺ est un glucide", "ATP fixé détache la tête avant le prochain attachement", "La myosine est un filament fin", "SERCA libère toujours Ca²⁺"], 1, "La fixation d’un nouvel ATP sépare actine et myosine."),
      choice("À quoi correspond A dans l’exercice 2 ?", ["Tétanos parfait", "Tétanos imparfait", "Secousse isolée", "Fatigue complète"], 2, "A montre une seule réponse avec retour au repos.", "Exercice 2 • page 11"),
      choice("À quoi correspond B ?", ["Secousse", "Potentiel de repos", "Tétanos imparfait", "Tétanos parfait"], 3, "B présente un plateau lisse fusionné."),
      choice("À quoi correspond C ?", ["Tétanos imparfait", "Tétanos parfait", "Coupe I", "Respiration"], 0, "C conserve des oscillations, donc la fusion est incomplète."),
      choice("Quelle est approximativement l’intensité seuil observable de l’exercice 3 ?", ["35 V", "13 mV", "0,307 mV", "5,950 V"], 1, "La réponse globale apparaît vers la quatrième stimulation.", "Exercice 3 • page 11"),
      choice("Que traduit l’augmentation de la réponse entre 13 et environ 29 mV ?", ["Le raccourcissement des filaments", "La disparition de l’ATP", "Le recrutement d’unités motrices", "Une baisse de fréquence"], 2, "Des axones moteurs de seuils différents sont progressivement activés."),
      choice("Que traduit le plateau de 29 à 35 mV ?", ["Aucune fibre activée", "Une stimulation infraliminaire", "Une fatigue certaine", "Le recrutement maximal des unités accessibles"], 3, "Augmenter encore l’intensité n’ajoute plus d’unités."),
      trueFalse("Le muscle entier doit produire une réponse mécanique strictement tout-ou-rien.", false, "La réponse globale est graduée par recrutement, même si chaque fibre déclenche son PA selon tout ou rien."),
      short("Associe dans l’ordre les figures c, b et a aux niveaux X, Y et Z.", ["c-X, b-Y, a-Z", "c x b y a z", "c correspond à X, b à Y et a à Z"], "c : fins seuls/X ; b : épais seuls/Y ; a : chevauchement/Z.", "Situation d’évaluation • page 10"),
    ],
    corrections: [
      "La mitochondrie est identifiée comme élément 4 et son rôle est formulé en termes de respiration/phosphorylation oxydative, non d’une vague « fabrication d’énergie ».",
      "Les coupes sont rattachées à la nomenclature corrigée : c/X = fins seuls/bande I ; b/Y = épais seuls/zone H ; a/Z = chevauchement dans A.",
      "Les quatorze expressions de l’exercice 1 sont conservées dans leur ordre, avec « cytoplasme » précisé en sarcoplasme.",
      "L’ordre moléculaire erroné du texte à trous est annoté : ATP fixé détache la tête ; hydrolyse puis Ca²⁺ autorisent le prochain attachement.",
      "Les figures A, B et C sont respectivement secousse isolée, tétanos parfait et tétanos imparfait.",
      "L’expérience d’intensité croissante est interprétée par seuil vers 13 mV, recrutement jusqu’à environ 29 mV puis plateau.",
    ],
  },
];

const orderedLevelIds = [
  "muscle-organ-to-fiber",
  "sarcomere-bands-myofilaments",
  "sarcomere-sliding-contraction",
  "excitation-calcium-coupling",
  "actomyosin-cross-bridge-cycle",
  "action-potential-muscle-twitch",
  "summation-tetanus-fatigue",
  "rapid-atp-regeneration",
  "glycolysis-respiration-energy",
  "official-muscle-assessment-mission",
] as const;

const seedById = new Map(levels.map((seed) => [seed.id, seed]));
const builtLevels = orderedLevelIds.map((id, index) => {
  const seed = seedById.get(id);
  if (!seed) throw new Error(`Niveau musculaire introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalDSvtSkeletalMusclePath: LearningPath = {
  id: "terminale-d-svt-l3-skeletal-muscle",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "La communication dans l’organisme" },
  chapterNumber: 3,
  title: "Le fonctionnement du muscle strié squelettique",
  description: "Le cours officiel intégral hors situation d’apprentissage, de l’organisation du muscle aux voies énergétiques, avec schémas originaux, exercices des pages 10-11 et corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Relier muscle, faisceau, fibre, myofibrille et sarcomère",
    "Expliquer le glissement des filaments, le couplage par Ca²⁺ et le cycle actomyosine",
    "Interpréter secousse, sommation, tétanos, recrutement et fatigue",
    "Comparer les systèmes de régénération de l’ATP et résoudre les exercices officiels",
  ],
  modules: [
    {
      id: "skeletal-muscle-mastery",
      title: "Maîtriser le fonctionnement du muscle strié squelettique",
      description: "Dix niveaux progressifs, de l’architecture musculaire à la mission officielle sur ultrastructure, tétanos et recrutement.",
      lessons: builtLevels,
    },
  ],
};
