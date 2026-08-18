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

const sourceDocument = "SVT TD_L4_Le fonctionnement du coeur.pdf";

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
  eyebrow: "Démarche à dérouler",
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
      eyebrow: "Méthode expérimentale",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Décris d’abord le dispositif ou le tracé, relève l’indice utile, puis distingue l’événement électrique, l’effet mécanique et le mécanisme de régulation.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : le cœur possède son propre automatisme. Les nerfs et les médiateurs règlent ce rythme ; ils ne le créent pas.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const conductionShapes: SchemaShape[] = [
  { shape: "path", d: "M330 72 C230 30 105 112 105 245 C105 370 250 430 360 350 C470 430 615 370 615 245 C615 112 490 30 390 72 C370 84 350 84 330 72 Z", tone: "soft" },
  { shape: "path", d: "M360 105 L360 370", tone: "muted" },
  { shape: "circle", cx: 235, cy: 145, r: 20, tone: "accent" },
  { shape: "circle", cx: 330, cy: 235, r: 17, tone: "accent" },
  { shape: "path", d: "M248 154 C278 174 307 198 325 220", tone: "outline" },
  { shape: "path", d: "M330 252 L360 284 L360 340", tone: "outline" },
  { shape: "path", d: "M360 284 L300 345 M360 284 L420 345", tone: "outline" },
  { shape: "path", d: "M300 345 C250 370 215 360 180 335 M420 345 C470 370 505 360 540 335", tone: "outline" },
  { shape: "text", x: 360, y: 465, content: "Système cardionecteur — figure pédagogique originale", anchor: "middle" },
];

const conductionHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "sa", number: 1, label: "Nœud sinusal", x: 235, y: 145, detail: "Pacemaker dominant situé dans la paroi de l’atrium droit. Sa dépolarisation diastolique spontanée impose normalement le rythme." },
  { id: "av", number: 2, label: "Nœud atrioventriculaire", x: 330, y: 235, detail: "Le nœud AV, appelé « nœud septal » dans la source, ralentit la conduction avant l’activation ventriculaire." },
  { id: "his", number: 3, label: "Faisceau de His", x: 360, y: 292, detail: "Il constitue la voie électrique normale entre atria et ventricules. Sa section crée une dissociation atrioventriculaire." },
  { id: "purkinje", number: 4, label: "Réseau de Purkinje", x: 505, y: 365, detail: "Ses fibres conduisent rapidement l’activation dans le myocarde ventriculaire, de l’apex vers les régions supérieures." },
  { id: "atria", number: 5, label: "Myocarde atrial", x: 286, y: 175, detail: "Repère d’enrichissement : l’activation se propage dans les atria et produit l’onde P avant leur contraction." },
  { id: "branches", number: 6, label: "Branches droite et gauche", x: 410, y: 330, detail: "Repère d’enrichissement : elles cheminent dans le septum vers l’apex et distribuent rapidement l’activation aux deux ventricules." },
];

const missionShapes: SchemaShape[] = [
  { shape: "path", d: "M55 110 L105 110 C118 110 123 94 135 94 C147 94 152 110 168 110 L218 110 L229 121 L241 54 L253 135 L267 110 L314 110 C333 110 343 82 364 82 C386 82 400 110 423 110 L545 110 C558 110 563 94 575 94 C587 94 592 110 608 110 L658 110 L669 121 L681 54 L693 135 L707 110 L754 110 C773 110 783 82 804 82 C826 82 840 110 863 110 L945 110", tone: "outline" },
  { shape: "path", d: "M55 255 L270 255 C285 255 296 224 306 192 C318 158 343 156 375 160 C405 164 425 197 438 225 C447 244 462 255 488 255 L710 255 C725 255 736 224 746 192 C758 158 783 156 815 160 C845 164 865 197 878 225 C887 244 902 255 945 255", tone: "accent" },
  { shape: "line", x1: 55, y1: 320, x2: 945, y2: 320, tone: "muted" },
  { shape: "text", x: 135, y: 80, content: "P", anchor: "middle" },
  { shape: "text", x: 241, y: 42, content: "QRS", anchor: "middle" },
  { shape: "text", x: 364, y: 70, content: "T", anchor: "middle" },
  { shape: "text", x: 520, y: 350, content: "Temps : les événements électriques précèdent les événements mécaniques", anchor: "middle" },
];

const missionHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "p", number: 1, label: "Onde P", x: 135, y: 94, detail: "Dépolarisation atriale ; la systole atriale commence après ce signal électrique." },
  { id: "pr", number: 2, label: "Intervalle PR", x: 190, y: 126, detail: "Conduction des atria vers le nœud AV puis le faisceau de His. Un allongement traduit un retard de conduction." },
  { id: "qrs", number: 3, label: "Complexe QRS", x: 241, y: 54, detail: "Dépolarisation ventriculaire ; la montée de pression commence ensuite, après un court délai électromécanique." },
  { id: "pressure", number: 4, label: "Pression ventriculaire", x: 330, y: 158, detail: "La pression augmente après QRS, pendant la contraction isovolumétrique puis l’éjection ; elle ne constitue pas une onde de l’ECG." },
  { id: "t", number: 5, label: "Onde T", x: 364, y: 82, detail: "Repolarisation ventriculaire ; la relaxation mécanique suit sans correspondance instantanée stricte." },
  { id: "cycle", number: 6, label: "Cycle suivant", x: 681, y: 54, detail: "La répétition régulière permet d’estimer la fréquence. Un intervalle R–R de 0,8 s correspond à environ 75 battements par minute." },
];

const levels: LevelSeed[] = [
  {
    id: "heart-isolated-automaticity",
    title: "Démontrer l’automatisme cardiaque",
    summary: "Exploiter les expériences sur le cœur de batracien pour distinguer automaticité myogène, autonomie expérimentale et modulation nerveuse.",
    pages: "1-2 et 13",
    section: "I-A. Mise en évidence de l’automatisme cardiaque",
    durationMinutes: 26,
    xp: 45,
    body: String.raw`
## Une activité qui persiste sans commande cérébrale

Le document compare plusieurs situations expérimentales chez le batracien. Après destruction de l’encéphale et de la moelle épinière, le cœur continue de battre. Prélevé puis placé dans un liquide de Ringer adapté, il peut encore présenter des contractions rythmiques. Ces résultats écartent l’hypothèse selon laquelle chaque battement serait déclenché par un ordre venu du cerveau.

On parle d’**automaticité cardiaque myogène** : l’impulsion rythmique normale naît dans le tissu cardiaque lui-même. « Autonome » ne veut pas dire indépendant de toute condition. Un cœur isolé exige un milieu oxygéné, une température convenable et des concentrations ioniques adaptées ; sans apport énergétique ni homéostasie, son activité finit par cesser.

| Manipulation | Résultat attendu | Déduction rigoureuse |
|---|---|---|
| suppression des centres nerveux | battements maintenus un temps | les centres nerveux ne déclenchent pas chaque cycle |
| isolement dans le Ringer | activité rythmique persistante | le générateur se trouve dans le cœur |
| destruction étendue du tissu nodal | arrêt de la préparation | le tissu cardionecteur organise l’automatisme |
| section du faisceau de His | atria et ventricules dissociés | His transmet normalement l’activation atriale aux ventricules |

## Hiérarchie des pacemakers

Dans l’expérience du PDF, le nœud sinusal, le nœud AV et le faisceau de His sont détruits ensemble : cette destruction étendue du système cardionecteur arrête la préparation. Ce résultat ne doit pas être confondu avec la lésion isolée du seul nœud sinusal. Le nœud sinusal possède normalement la fréquence spontanée la plus élevée et impose son rythme ; s’il défaille seul, le nœud AV ou le réseau ventriculaire peut parfois produire un **rythme d’échappement**, plus lent.

La section du faisceau de His ne supprime pas forcément toute contraction ventriculaire. Elle produit un **bloc atrioventriculaire complet** : les atria suivent le nœud sinusal tandis qu’un foyer inférieur entraîne les ventricules plus lentement. C’est une dissociation, pas une simple irrégularité indéfinie.

> **Correction scientifique.** L’automatisme est intrinsèque, mais il dépend d’un milieu physiologique. La disparition du pacemaker dominant peut révéler des pacemakers secondaires ; la section de His provoque une dissociation atrioventriculaire avec échappement lent.

> **Astuce mémoire — isolé ne signifie pas immortel :** le cœur porte son rythme, le milieu lui fournit les conditions pour l’entretenir.
`,
    keyPoint: "Le cœur est un effecteur automatique myogène : son tissu cardionecteur produit spontanément des impulsions, tandis que les nerfs modulent leur fréquence.",
    example: "Un cœur isolé bat dans le Ringer : l’expérience localise le générateur dans le cœur, sans prouver qu’il fonctionnerait sans oxygène ni ions.",
    methodSteps: [
      "Décris séparément chaque manipulation et son résultat.",
      "Élimine seulement l’hypothèse réellement testée par l’expérience.",
      "Localise l’origine du rythme dans le tissu cardiaque spécialisé.",
      "Nuance avec les conditions du milieu et la hiérarchie des pacemakers.",
    ],
    interaction: diagram(
      "Construire la preuve de l’automatisme",
      "Ouvre chaque branche et distingue observation, conclusion et limite expérimentale.",
      "Le cœur possède son propre générateur rythmique",
      "La persistance des battements hors des centres nerveux révèle une automaticité myogène entretenue par le tissu cardionecteur.",
      [
        { id: "centers", label: "Centres supprimés", role: "Le cœur bat encore", detail: "La décérébration et la démédullation montrent que le cerveau et la moelle ne déclenchent pas chaque battement.", group: "Observer" },
        { id: "ringer", label: "Cœur isolé", role: "Rythme dans le Ringer", detail: "L’organe prélevé conserve transitoirement son activité si le milieu apporte des conditions ioniques, thermiques et énergétiques compatibles.", group: "Observer" },
        { id: "nodal", label: "Tissu nodal", role: "Générateur spécialisé", detail: "Sa destruction étendue arrête la préparation ; une lésion partielle peut laisser apparaître un pacemaker secondaire plus lent.", group: "Localiser" },
        { id: "his", label: "Faisceau de His", role: "Couplage atria-ventricules", detail: "Sa section dissocie le rythme atrial du rythme ventriculaire d’échappement.", group: "Tester" },
        { id: "limits", label: "Conditions", role: "O₂, ions, température", detail: "L’automatisme ne rend pas le cœur indépendant du métabolisme ni du milieu intérieur.", group: "Nuancer" },
      ],
      "Le système nerveux règle une activité déjà présente : l’expérience ne transforme pas le cœur en organe indépendant de toute condition physiologique.",
    ),
    questions: [
      choice("Que montre la persistance des battements après suppression de l’encéphale et de la moelle ?", ["Le rythme ne dépend pas de chaque ordre central", "Le rythme est imposé par la moelle seule", "Le cœur devient indépendant de son milieu", "Les nerfs cardiaques n’ont aucun effet"], 0, "Les centres nerveux modulent le cœur mais ne déclenchent pas chaque cycle.", "Expérience 1 • page 1"),
      choice("Pourquoi place-t-on le cœur isolé dans un liquide de Ringer adapté ?", ["Pour détruire le tissu nodal", "Pour maintenir des conditions ioniques compatibles", "Pour mesurer la glycémie", "Pour bloquer le faisceau de His"], 1, "Le milieu de Ringer remplace provisoirement une partie des conditions du milieu intérieur.", "Expérience 2 • page 1"),
      choice("Quel terme décrit l’origine du rythme dans le muscle cardiaque spécialisé ?", ["Automatisme neurogène obligatoire", "Réflexe conditionné", "Automaticité myogène", "Tétanos musculaire"], 2, "Le tissu cardiaque spécialisé génère spontanément l’activité rythmique."),
      choice("Quel résultat suit typiquement une section complète du faisceau de His ?", ["Une fusion des quatre cavités", "Une disparition de l’onde P seule", "Un rythme ventriculaire plus rapide que tout rythme atrial", "Une dissociation atrioventriculaire"], 3, "Les atria et les ventricules sont alors entraînés par des pacemakers différents.", "Expérience 4 • pages 1-2"),
      trueFalse("Un cœur automatique peut battre indéfiniment sans oxygène, sans substrat énergétique et sans ions adaptés.", false, "L’automatisme exige des conditions métaboliques et ioniques compatibles."),
      choice("Quel pacemaker impose normalement le rythme le plus rapide ?", ["Le nœud sinusal", "Le nœud AV", "Le réseau de Purkinje", "Un foyer ventriculaire d’échappement"], 0, "Le nœud sinusal est le pacemaker dominant normal."),
      choice("Que peut-il se produire après défaillance du nœud sinusal ?", ["Le rythme s’accélère nécessairement", "Un pacemaker secondaire plus lent peut émerger", "Le nœud AV impose un rythme plus rapide", "Toute activité ventriculaire cesse définitivement"], 1, "La hiérarchie cardionectrice permet des rythmes d’échappement."),
      choice("Quel rôle l’expérience attribue-t-elle principalement aux nerfs cardiaques ?", ["Déclencher chaque potentiel sinusal", "Imposer seuls le rythme ventriculaire", "Moduler une activité intrinsèque", "Commander directement l’ouverture valvulaire"], 2, "Les voies autonomes accélèrent ou ralentissent un rythme déjà généré dans le cœur."),
      choice("Quelle conclusion serait excessive après l’expérience du Ringer ?", ["Le cœur possède une automaticité", "Le rythme peut persister hors du corps", "Le tissu cardiaque est excitable", "Le cœur isolé est indépendant de toute condition"], 3, "Le résultat dépend précisément du maintien de conditions expérimentales favorables."),
      short("Donne le nom du rythme lent produit sous le nœud sinusal quand le pacemaker dominant défaille.", ["rythme d’échappement", "un rythme d’échappement", "rythme d'echappement", "échappement"], "Un pacemaker secondaire peut prendre le relais à une fréquence plus basse."),
    ],
    corrections: [
      "Le nœud sinusal reste le pacemaker dominant ; l’automatisme cardiaque est myogène mais dépend d’un milieu oxygéné, ioniquement adapté et énergétiquement viable.",
      "La destruction conjointe du nœud sinusal, du nœud AV et de His décrite par la source est distinguée d’une lésion sinusale isolée, qui peut révéler un rythme d’échappement.",
      "La section du faisceau de His est interprétée comme un bloc complet avec dissociation atrioventriculaire et rythme ventriculaire lent.",
    ],
  },
  {
    id: "heart-conduction-system",
    title: "Suivre le système cardionecteur",
    summary: "Situer le nœud sinusal, le nœud atrioventriculaire, le faisceau de His, ses branches et le réseau de Purkinje.",
    pages: "2, 4, 11 et 13",
    section: "I-B. Tissu nodal et propagation de l’excitation",
    durationMinutes: 28,
    xp: 55,
    body: String.raw`
## Un réseau hiérarchisé

Le système cardionecteur est constitué de cellules myocardiques spécialisées capables de générer ou de conduire l’excitation. La séquence normale commence au **nœud sinusal** dans la paroi supérieure de l’atrium droit. L’activation gagne les deux atria, puis atteint le **nœud atrioventriculaire**.

Le document emploie l’expression historique « nœud septal ». On retient le nom anatomique moderne **nœud atrioventriculaire (AV)**. Ce relais introduit un délai : les atria disposent ainsi du temps nécessaire pour terminer leur contraction avant le début de la systole ventriculaire.

Après ce relais, l’impulsion suit :

$$\text{nœud sinusal}\rightarrow\text{myocarde atrial}\rightarrow\text{nœud AV}\rightarrow\text{faisceau de His}\rightarrow\text{branches}\rightarrow\text{Purkinje}$$

Le faisceau de His traverse le squelette fibreux qui isole électriquement atria et ventricules. Ses branches droite et gauche descendent dans le septum. Les fibres de Purkinje distribuent rapidement l’activation au myocarde ventriculaire, notamment depuis l’apex vers la base, ce qui favorise une éjection efficace vers les artères.

## Un gradient de fréquence spontanée

Les cellules du nœud sinusal déchargent normalement plus vite que celles du nœud AV ou du réseau de Purkinje. Elles les activent avant que leurs propres dépolarisations spontanées n’atteignent le seuil. On obtient une hiérarchie fonctionnelle : pacemaker sinusal rapide, pacemaker jonctionnel plus lent, pacemaker ventriculaire encore plus lent.

Une lésion ou un bloc ne signifie donc pas nécessairement silence de tout le cœur. Dans un bloc AV complet, les ondes P peuvent conserver leur régularité alors que les complexes QRS suivent un autre rythme, plus lent. Cette indépendance des deux séries constitue la dissociation atrioventriculaire.

## Ne pas confondre conduction et contraction

Le système cardionecteur **conduit un signal électrique**. Le myocarde de travail transforme ensuite cette activation en tension mécanique. Le trajet électrique précède toujours la hausse de pression ; il ne correspond ni au trajet du sang ni à l’ouverture directe des valves.

> **Correction terminologique.** « Nœud septal » est conservé comme terme de la source, mais le cours emploie nœud atrioventriculaire. Les branches droite et gauche sont distinguées du faisceau commun de His.

> **Astuce mémoire — S-A-H-P :** **S**inusal, **A**V, **H**is, **P**urkinje.
`,
    keyPoint: "L’activation normale suit nœud sinusal → atria → nœud AV → His → branches → Purkinje, avant la contraction du myocarde.",
    example: "Des ondes P régulières et des QRS lents sans relation fixe suggèrent un bloc AV complet avec deux pacemakers dissociés.",
    methodSteps: [
      "Place le nœud sinusal dans l’atrium droit.",
      "Suis l’activation dans les atria jusqu’au nœud AV.",
      "Traverse le faisceau de His puis sépare les branches droite et gauche.",
      "Termine par Purkinje et distingue propagation électrique et contraction mécanique.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original annoté",
      title: "Explorer le système cardionecteur",
      instruction: "Sélectionne les six repères : les numéros 1 à 4 reprennent exactement l’exercice officiel, puis 5 et 6 enrichissent le trajet.",
      viewBox: "0 0 720 500",
      caption: "Figure pédagogique originale redessinée d’après les repères des pages 2, 4, 11 et 13 : 1 sinusal, 2 AV, 3 His, 4 Purkinje ; aucune image du PDF n’est republiée.",
      shapes: conductionShapes,
      hotspots: conductionHotspots,
      observation: "Le nœud AV et le faisceau de His constituent la jonction électrique normale entre activation atriale et activation ventriculaire.",
    },
    questions: [
      choice("Où débute normalement l’activation de chaque cycle ?", ["Au nœud sinusal", "Dans l’aorte", "Dans la valve tricuspide", "Dans le nerf de Cyon"], 0, "Le nœud sinusal est le pacemaker dominant.", "Exercice 1 • page 11"),
      choice("Quel nom moderne remplace le plus précisément « nœud septal » ?", ["Nœud lymphatique", "Nœud atrioventriculaire", "Ganglion spinal", "Bulbe rachidien"], 1, "Le nœud AV se situe à la jonction entre atria et ventricules."),
      choice("Quelle structure suit immédiatement le nœud AV dans la voie normale ?", ["Le nerf vague", "La valve aortique", "Le faisceau de His", "La veine cave"], 2, "Le faisceau de His transmet l’activation vers les branches ventriculaires."),
      choice("Quel réseau distribue rapidement l’excitation au myocarde ventriculaire ?", ["Le réseau capillaire", "Le réseau lymphatique", "Le plexus choroïde", "Le réseau de Purkinje"], 3, "Purkinje assure la distribution terminale de l’activation.", "Figure • page 4"),
      trueFalse("Le système cardionecteur décrit le trajet du sang depuis les veines jusqu’aux artères.", false, "Il décrit la génération et la conduction de l’activation électrique."),
      choice("Quel effet fonctionnel a le délai du nœud AV ?", ["Il laisse aux atria le temps de compléter leur contraction", "Il empêche toute contraction atriale", "Il ouvre directement l’aorte", "Il fabrique l’acétylcholine"], 0, "Ce délai coordonne le remplissage ventriculaire avant la systole."),
      choice("Dans quel sens général l’activation ventriculaire est-elle distribuée ?", ["Uniquement de la base vers les atria", "Des branches vers l’apex puis le myocarde", "Du sang vers le péricarde", "Des valves vers le cerveau"], 1, "Les branches descendent et le réseau de Purkinje active efficacement le myocarde."),
      choice("Quelle structure présente normalement la fréquence spontanée la plus élevée ?", ["Purkinje", "Le nœud AV", "Le nœud sinusal", "Le ventricule gauche"], 2, "Cette fréquence plus élevée impose le rythme aux pacemakers secondaires."),
      choice("Quel tracé évoque une dissociation atrioventriculaire ?", ["Une seule onde P", "Aucune activité électrique", "Un QRS après chaque P avec délai fixe", "Des ondes P et QRS réguliers mais indépendants"], 3, "Deux rythmes sans relation fixe traduisent un bloc complet."),
      short("Écris le sigle usuel du nœud atrioventriculaire.", ["AV", "nœud AV", "noeud AV", "NAV"], "Le sigle AV signifie atrioventriculaire.", "Exercice d’annotation • page 11"),
    ],
    corrections: [
      "Le terme scolaire « nœud septal » est modernisé en nœud atrioventriculaire sans masquer le vocabulaire de la source.",
      "La voie de conduction inclut explicitement les branches droite et gauche entre le faisceau de His et le réseau de Purkinje.",
      "Le système cardionecteur est distingué du trajet sanguin et la conduction électrique est distinguée de la contraction mécanique.",
    ],
  },
  {
    id: "pacemaker-myocyte-potentials",
    title: "Comparer les potentiels d’action cardiaques",
    summary: "Relier la dépolarisation spontanée du pacemaker et le plateau du myocyte ventriculaire aux courants ioniques et à la période réfractaire.",
    pages: "2, 4 et 13",
    section: "I-C. Activité électrique des cellules nodales et myocardiques",
    durationMinutes: 32,
    xp: 65,
    kind: "graph",
    body: String.raw`
## Le pacemaker ne possède pas de repos stable

Entre deux potentiels d’action, une cellule du nœud sinusal se dépolarise lentement : c’est la **dépolarisation diastolique spontanée** ou potentiel pacemaker. Le courant « funny » $I_f$ laisse passer un courant entrant mixte, principalement sodique dans ces conditions. La diminution progressive de la sortie de K⁺ et l’ouverture successive de canaux Ca²⁺ de type T puis L rapprochent la membrane du seuil.

La montée du potentiel d’action nodal dépend surtout de l’entrée de Ca²⁺ par les canaux de type L. La repolarisation vient ensuite de la fermeture des courants calciques et de l’augmentation des courants potassiques sortants. La pente de la dépolarisation diastolique aide à fixer la fréquence : plus le seuil est atteint vite, plus le rythme est élevé.

La source parle d’une entrée « massive et transitoire » de calcium. Cette formule est trop vague : les courants se succèdent, et le pacemaker associe $I_f$, diminution du courant K⁺, Ca²⁺ de type T puis Ca²⁺ de type L.

## Le myocyte ventriculaire possède un plateau

Le myocyte de travail part d’un potentiel stable proche de $-90\ \mathrm{mV}$. Son potentiel d’action comporte :

1. une dépolarisation rapide par ouverture des canaux Na⁺ rapides ;
2. une brève repolarisation initiale ;
3. un **plateau** où l’entrée de Ca²⁺ de type L équilibre partiellement la sortie de K⁺ ;
4. une repolarisation dominée par les courants K⁺ ;
5. un retour au potentiel de repos.

Le calcium entrant pendant le plateau participe au déclenchement de la libération de Ca²⁺ par le réticulum sarcoplasmique et donc à la contraction. Le tracé du PDF appelle parfois « latence » une portion du potentiel ventriculaire ; ce n’est pas une phase standard du potentiel d’action. La latence décrit plutôt un délai avant une réponse enregistrée.

## Pourquoi le cœur ne se tétanise pas

Le plateau allonge fortement le potentiel d’action et la **période réfractaire absolue**. Une nouvelle excitation efficace ne peut pas survenir pendant l’essentiel de la contraction. Les secousses ne se somment donc pas comme dans un muscle squelettique stimulé rapidement : le myocarde doit se relâcher et se remplir entre deux systoles.

> **Correction ionique.** Pacemaker et myocyte n’utilisent pas exactement les mêmes courants. Dans le nœud sinusal, la montée dépend surtout de Ca²⁺ ; dans le ventricule, elle dépend surtout de Na⁺ rapide, puis le plateau associe Ca²⁺ entrant et K⁺ sortant.

> **Astuce mémoire :** pacemaker = **pente spontanée** ; ventricule = **pic rapide + plateau protecteur**.
`,
    keyPoint: "Le pacemaker atteint spontanément le seuil grâce à $I_f$ et aux courants calciques ; le myocyte ventriculaire présente un plateau Ca²⁺/K⁺ et une longue réfractarité.",
    example: "Une courbe sans repos stable qui remonte lentement entre deux pics correspond au nœud sinusal ; une courbe à repos stable et plateau correspond au myocyte ventriculaire.",
    methodSteps: [
      "Observe d’abord si la ligne de base est stable ou spontanément ascendante.",
      "Associe la montée nodale au Ca²⁺ et la montée ventriculaire au Na⁺ rapide.",
      "Repère le plateau et l’équilibre transitoire Ca²⁺ entrant/K⁺ sortant.",
      "Relie la durée du potentiel ventriculaire à la réfractarité et à l’absence de tétanos.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Enregistrements redessinés",
      title: "Explorer le potentiel pacemaker",
      instruction: "Déplace le repère sur deux cycles et observe l’absence de potentiel de repos stable.",
      formula: "Potentiel nodal Vₘ(t), en mV",
      formulaTex: "V_m(t)",
      rule: { kind: "samples", points: [[0, -62], [0.2, -58], [0.4, -52], [0.58, -42], [0.7, -10], [0.78, 12], [0.9, -18], [1.05, -60], [1.25, -57], [1.48, -50], [1.65, -42], [1.78, -8], [1.86, 12], [2, -20], [2.15, -61], [2.4, -55]] },
      window: { xMin: 0, xMax: 2.4, yMin: -80, yMax: 30 },
      guides: [
        { kind: "horizontal", value: -40, label: "seuil indicatif" },
        { kind: "horizontal", value: -60, label: "potentiel diastolique maximal" },
      ],
      marker: { min: 0, max: 2.4, step: 0.05, initial: 0.4 },
      observation: "Après chaque repolarisation, la courbe repart spontanément vers le seuil : c’est la signature d’une cellule pacemaker.",
    },
    questions: [
      choice("Quel courant participe au début de la dépolarisation diastolique spontanée ?", ["Le courant funny $I_f$", "Le courant Na⁺ rapide ventriculaire", "Le courant Ca²⁺ du plateau ventriculaire", "Un courant K⁺ sortant croissant"], 0, "$I_f$ contribue au courant entrant qui rapproche progressivement la membrane du seuil."),
      choice("Quel ion porte principalement la montée du potentiel d’action du nœud sinusal ?", ["Le Na⁺ rapide", "Le Ca²⁺", "Le K⁺ sortant", "Le Cl⁻ entrant"], 1, "Les canaux Ca²⁺ de type L assurent l’essentiel de la phase ascendante nodale.", "Courbe nodale • pages 2 et 4"),
      choice("Quel ion produit la montée rapide du potentiel d’action ventriculaire ?", ["Le Ca²⁺ lent entrant", "Le K⁺ sortant", "Le Na⁺ entrant", "Le Cl⁻ entrant"], 2, "Les canaux Na⁺ rapides s’ouvrent au début du potentiel ventriculaire."),
      choice("Quelle combinaison maintient principalement le plateau ventriculaire ?", ["Na⁺ entrant et K⁺ entrant", "Ca²⁺ sortant et K⁺ entrant", "Cl⁻ entrant et Na⁺ sortant", "Ca²⁺ entrant et K⁺ sortant"], 3, "L’équilibre transitoire entre ces courants produit le plateau."),
      trueFalse("Une cellule du nœud sinusal possède normalement une ligne de repos parfaitement stable entre deux potentiels d’action.", false, "Elle présente une dépolarisation diastolique spontanée."),
      choice("Que provoque une pente pacemaker plus forte, toutes choses égales ?", ["Le seuil est atteint plus vite", "La repolarisation devient impossible", "La période réfractaire s’allonge nécessairement", "Le plateau ventriculaire disparaît directement"], 0, "Atteindre plus vite le seuil augmente la fréquence spontanée."),
      choice("Quel courant domine la repolarisation des deux types de cellules ?", ["Une entrée persistante de Na⁺", "Une sortie de K⁺", "Une entrée prolongée de Ca²⁺", "Une diminution de la sortie de K⁺"], 1, "Les courants potassiques sortants ramènent le potentiel vers des valeurs négatives."),
      choice("Quel événement relie le plateau électrique à la contraction ?", ["Une sortie rapide du Ca²⁺ cytosolique", "L’ouverture du courant $I_f$ ventriculaire", "L’entrée de Ca²⁺ puis la libération de Ca²⁺ interne", "Une augmentation isolée du courant K⁺"], 2, "Le calcium déclenche le couplage excitation-contraction."),
      choice("Pourquoi une longue période réfractaire est-elle vitale pour le cœur ?", ["Elle autorise une fréquence sans limite", "Elle maintient les canaux Na⁺ toujours ouverts", "Elle prolonge chaque systole jusqu’au cycle suivant", "Elle empêche la sommation et le tétanos"], 3, "Le relâchement et le remplissage doivent alterner avec la contraction."),
      choice("Quelle courbe correspond le mieux à un myocyte ventriculaire ?", ["Repos stable, pic rapide puis plateau", "Dépolarisation diastolique lente sans repos stable", "Pic calcique lent sans plateau", "Variation de pression exprimée en kPa"], 0, "Le potentiel ventriculaire a une phase 0 rapide et un plateau prolongé."),
      short("Donne le nom de la phase prolongée du potentiel d’action ventriculaire.", ["plateau", "le plateau", "phase plateau", "phase 2"], "Le plateau correspond à la phase 2 du potentiel d’action ventriculaire.", "Courbe myocardique • page 4"),
    ],
    corrections: [
      "Le prépotentiel est décrit comme une dépolarisation diastolique spontanée impliquant le courant $I_f$, la diminution du courant K⁺ et les canaux Ca²⁺ T puis L.",
      "La montée du potentiel nodal par Ca²⁺ est distinguée de la montée rapide du potentiel ventriculaire par Na⁺.",
      "Le terme « latence » n’est pas conservé comme phase du potentiel ventriculaire ; la longue période réfractaire empêche la sommation et le tétanos.",
    ],
  },
  {
    id: "cardiac-cycle-mechanics",
    title: "Décomposer la révolution cardiaque",
    summary: "Ordonner systole atriale, systole ventriculaire et diastole, puis relier pressions, volumes et mouvements valvulaires.",
    pages: "3-4 et 13-14",
    section: "II-A. Phénomènes mécaniques et cardiogramme",
    durationMinutes: 30,
    xp: 70,
    kind: "practice",
    body: String.raw`
## Une succession qui se chevauche

La **révolution cardiaque** ou cycle cardiaque est l’ensemble des événements compris entre le début d’un battement et le début du suivant. Le document distingue systole atriale, systole ventriculaire et diastole générale. Ce découpage est utile, mais il ne faut pas imaginer trois blocs où les quatre cavités changeraient d’état exactement au même instant.

La systole atriale termine le remplissage des ventricules. Les valves atrioventriculaires sont ouvertes et les valves artérielles fermées. Puis les atria se relâchent : leur diastole se poursuit pendant la systole ventriculaire.

Au début de la systole ventriculaire, la pression augmente alors que toutes les valves sont fermées : c’est la **contraction isovolumétrique**. Lorsque la pression ventriculaire dépasse celle de l’aorte ou de l’artère pulmonaire, les valves artérielles s’ouvrent et l’éjection commence. Le volume ventriculaire diminue.

Après l’éjection, les ventricules se relâchent. Les valves artérielles se ferment lorsque la pression artérielle redevient supérieure. Toutes les valves sont brièvement fermées pendant la **relaxation isovolumétrique**. Quand la pression ventriculaire devient inférieure à la pression atriale, les valves atrioventriculaires s’ouvrent et le remplissage reprend.

## Pression, volume et valves

| Phase | Pression ventriculaire | Volume ventriculaire | Valves dominantes |
|---|---|---|---|
| remplissage | basse | augmente | AV ouvertes, artérielles fermées |
| contraction isovolumétrique | augmente vite | constant | toutes fermées |
| éjection | élevée puis décroît | diminue | artérielles ouvertes |
| relaxation isovolumétrique | diminue vite | constant | toutes fermées |

Le cardiographe du batracien enregistre un mouvement mécanique. Un cardiogramme de pression ou de déplacement n’est donc pas un électrocardiogramme. La lettre d’un segment ABCDE doit être interprétée à partir de la montée, du sommet et de la descente du tracé, pas mémorisée sans regarder l’axe et le dispositif.

Dans la lecture scolaire explicite du document 3 : **AB** correspond à la systole atriale, **BC** à la diastole atriale, **CD** à la systole ventriculaire et **DE** à la diastole générale. Cette correspondance restitue la correction officielle ; la physiologie moderne ajoute que la diastole atriale se poursuit pendant CD et qu’une phase globale ne résume pas toute la diastole de chaque cavité.

Les bruits cardiaques usuels viennent principalement de vibrations associées à la fermeture des valves : premier bruit autour de la fermeture atrioventriculaire, second bruit autour de la fermeture aortique et pulmonaire. Ce ne sont pas les valves « qui claquent » seules comme deux plaques rigides.

> **Précision.** La diastole atriale se prolonge pendant la systole ventriculaire. « Diastole générale » désigne la période où atria et ventricules sont simultanément relâchés, mais elle ne résume pas toute la diastole de chaque cavité.

> **Astuce mémoire :** pression qui monte à volume constant = toutes les portes sont fermées.
`,
    keyPoint: "Le cycle alterne remplissage, contraction isovolumétrique, éjection et relaxation isovolumétrique ; les gradients de pression commandent l’ouverture passive des valves.",
    example: "Si la pression ventriculaire augmente mais que le volume reste constant, les valves AV viennent de se fermer et les valves artérielles ne sont pas encore ouvertes.",
    methodSteps: [
      "Identifie la cavité et la grandeur portée par l’axe vertical.",
      "Repère d’abord les phases à volume constant et les phases où le volume change.",
      "Déduis l’état des valves à partir des différences de pression.",
      "Replace la systole atriale sans interrompre artificiellement la diastole des atria.",
    ],
    interaction: timeline(
      "Parcourir un cycle mécanique",
      "Ouvre les étapes dans l’ordre et vérifie à chaque fois pression, volume et état des valves.",
      [
        { label: "Remplissage", shortLabel: "Diastole", detail: "Les valves AV sont ouvertes ; le volume ventriculaire augmente passivement tandis que les valves artérielles restent fermées." },
        { label: "Systole atriale", shortLabel: "Fin du remplissage", detail: "La contraction atriale complète le remplissage. Elle ne fournit qu’une partie du volume et est précédée par l’onde P." },
        { label: "Contraction isovolumétrique", shortLabel: "Toutes fermées", detail: "Les valves AV se ferment ; la pression monte rapidement sans changement de volume." },
        { label: "Éjection", shortLabel: "Systole", detail: "La pression ventriculaire dépasse la pression artérielle ; les valves aortique et pulmonaire s’ouvrent et le volume diminue." },
        { label: "Relaxation isovolumétrique", shortLabel: "Toutes fermées", detail: "Les valves artérielles se ferment ; la pression chute alors que le volume reste brièvement constant." },
        { label: "Réouverture AV", shortLabel: "Cycle suivant", detail: "La pression ventriculaire passe sous la pression atriale ; un nouveau remplissage commence." },
      ],
      "Les valves ne sont pas ouvertes par un ordre nerveux : elles répondent passivement aux gradients de pression.",
    ),
    questions: [
      choice("Quelle phase complète le remplissage ventriculaire ?", ["La systole atriale", "La fibrillation", "La contraction de l’aorte", "La repolarisation seule"], 0, "La systole atriale pousse le dernier volume vers les ventricules.", "Cardiogramme • pages 3-4"),
      choice("Quand débute la contraction isovolumétrique ?", ["Quand toutes les valves sont ouvertes", "Après la fermeture des valves AV", "Après l’ouverture des valves artérielles", "Pendant l’arrêt définitif"], 1, "Le volume reste constant tant que toutes les valves sont fermées."),
      choice("Qu’est-ce qui ouvre les valves artérielles ?", ["Une commande consciente", "La baisse de pression atriale", "Une pression ventriculaire supérieure à la pression artérielle", "L’onde P directement"], 2, "Le gradient de pression pousse passivement les valvules."),
      choice("Quel couple décrit la phase d’éjection ?", ["Volume constant et pression nulle", "Volume croissant et valves artérielles fermées", "Volume constant et valves AV ouvertes", "Volume décroissant et valves artérielles ouvertes"], 3, "Le sang quitte les ventricules pendant l’éjection."),
      trueFalse("Les atria restent en systole pendant toute la systole ventriculaire.", false, "Ils sont déjà revenus en diastole pendant l’essentiel de la systole ventriculaire."),
      choice("Que se passe-t-il pendant la relaxation isovolumétrique ?", ["La pression chute à volume constant", "Le volume augmente alors que les valves artérielles restent ouvertes", "La pression augmente à volume constant", "Le volume diminue pendant l’éjection"], 0, "Toutes les valves sont brièvement fermées."),
      choice("Quand les valves AV se rouvrent-elles ?", ["Quand la pression aortique est nulle", "Quand la pression ventriculaire devient inférieure à la pression atriale", "Dès l’onde T sans délai", "Quand le nerf vague est sectionné"], 1, "Le gradient atrium-vers-ventricule permet leur ouverture."),
      choice("Que mesure directement un cardiographe mécanique de grenouille ?", ["Un potentiel électrique extracellulaire", "Une pression artérielle en kPa", "Un mouvement ou une tension mécanique du cœur", "Une concentration ionique intracellulaire"], 2, "Le levier transforme le mouvement du cœur en tracé.", "Dispositif • page 3"),
      choice("Quelle formule décrit le mieux la révolution cardiaque ?", ["Une contraction ventriculaire isolée", "Une seule onde P", "Une pression fixe", "L’ensemble des événements d’un cycle à l’autre"], 3, "Le cycle inclut événements électriques, mécaniques et valvulaires."),
      short("Donne le nom de la phase où la pression augmente sans changement de volume.", ["contraction isovolumétrique", "la contraction isovolumétrique", "contraction isovolumique"], "Toutes les valves sont fermées pendant cette montée de pression."),
    ],
    corrections: [
      "La diastole atriale est maintenue pendant la systole ventriculaire au lieu de présenter les trois phases comme des blocs exclusifs.",
      "Les phases isovolumétriques et l’état des quatre groupes valvulaires sont ajoutés pour expliquer les variations de pression et de volume.",
      "Le cardiogramme mécanique est distingué de l’électrocardiogramme et les lettres ABCDE ne sont pas interprétées hors de leur dispositif.",
    ],
  },
  {
    id: "ecg-electromechanical-coupling",
    title: "Relier ECG et activité mécanique",
    summary: "Identifier P, QRS, T et les intervalles, puis expliquer pourquoi les événements électriques précèdent les contractions et les variations de pression.",
    pages: "3-4, 11 et 14",
    section: "II-B. Électrocardiogramme et couplage électromécanique",
    durationMinutes: 32,
    xp: 75,
    kind: "graph",
    body: String.raw`
## Ce que mesure un ECG

Un électrocardiogramme enregistre à la surface du corps des différences de potentiel produites par l’activation électrique du cœur. Il ne dessine ni la contraction elle-même, ni la pression, ni le trajet du sang. Les principales ondes sont :

- **P** : dépolarisation des atria ;
- **QRS** : dépolarisation des ventricules ;
- **T** : repolarisation des ventricules.

La repolarisation atriale existe, mais son signal est généralement masqué par le complexe QRS. L’intervalle **PR** — parfois appelé PQ lorsque la petite onde Q est prise comme borne — mesure le temps entre le début de l’activation atriale et le début de l’activation ventriculaire. Ce n’est pas un « courant PR » : c’est une durée de conduction, notamment à travers le nœud AV et His.

## L’électricité précède la mécanique

L’onde P survient avant la systole atriale. Le complexe QRS précède la montée de pression ventriculaire et l’éjection. L’onde T indique la repolarisation ventriculaire ; la relaxation mécanique suit avec un délai et dépend aussi de la recapture du Ca²⁺. Une onde électrique ne « provoque » donc pas instantanément une phase mécanique portant le même nom.

On peut écrire la chaîne causale générale :

$$\text{dépolarisation}\rightarrow\text{entrée et libération de }Ca^{2+}\rightarrow\text{interaction actine-myosine}\rightarrow\text{tension}\rightarrow\text{variation de pression}$$

Cette succession explique le petit décalage entre QRS et la hausse du tracé de pression présenté dans la situation d’évaluation.

## Mesurer une fréquence

Si deux pics R successifs sont séparés par une durée $T_{RR}$ exprimée en secondes :

$$f_{\text{cardiaque}}=\frac{60}{T_{RR}}\quad\text{en battements par minute}$$

Dans le document, l’intervalle graphique proche de $0{,}8\ \mathrm{s}$ donne environ $60/0{,}8=75\ \mathrm{bpm}$. Cette valeur est une lecture approchée du dessin, pas une mesure clinique précise.

## Lire la situation officielle

Le tracé A de la page 11 correspond à une pression intraventriculaire graduée en kilopascals ; le tracé B est un ECG. On commence par identifier les axes et les unités. On décrit ensuite la montée et la baisse de pression entre a et g. Enfin seulement, on superpose mentalement P, QRS et T aux événements mécaniques avec le délai électromécanique.

> **Correction de la source.** Associer mécaniquement P à « systole atriale », QRS à « systole ventriculaire » et T à « diastole générale » est trop strict. Les ondes décrivent des événements électriques qui précèdent et chevauchent les phases mécaniques.

> **Astuce mémoire :** ECG = **électricité** ; pression = **mécanique**. La première lance la seconde, elle ne la reproduit pas.
`,
    keyPoint: "P = dépolarisation atriale, QRS = dépolarisation ventriculaire, T = repolarisation ventriculaire ; l’effet mécanique suit après un délai électromécanique.",
    example: "Un QRS à $t=0{,}20$ s suivi d’une montée de pression à $t=0{,}24$ s illustre le couplage excitation-contraction, pas une erreur d’alignement.",
    methodSteps: [
      "Identifie chaque tracé par son axe et son unité.",
      "Nomme P, QRS et T comme événements électriques.",
      "Décris séparément la pression avant de superposer les deux documents.",
      "Respecte le délai électromécanique et calcule la fréquence avec l’intervalle R–R.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "ECG redessiné",
      title: "Explorer deux cycles électriques",
      instruction: "Déplace le repère et identifie P, QRS, T ou la ligne isoélectrique.",
      formula: "Amplitude relative de l’ECG E(t)",
      formulaTex: "E(t)",
      rule: { kind: "samples", points: [[0, 0], [0.08, 0], [0.12, 0.18], [0.17, 0], [0.25, 0], [0.28, -0.15], [0.3, 1], [0.33, -0.35], [0.38, 0], [0.52, 0.28], [0.64, 0], [0.8, 0], [0.92, 0.18], [0.97, 0], [1.05, 0], [1.08, -0.15], [1.1, 1], [1.13, -0.35], [1.18, 0], [1.32, 0.28], [1.44, 0], [1.6, 0]] },
      window: { xMin: 0, xMax: 1.6, yMin: -0.5, yMax: 1.2 },
      guides: [
        { kind: "vertical", value: 0.3, label: "R₁" },
        { kind: "vertical", value: 1.1, label: "R₂ : Δt ≈ 0,8 s" },
      ],
      marker: { min: 0, max: 1.6, step: 0.02, initial: 0.3 },
      observation: "Les pics R sont distants d’environ 0,8 s : la fréquence graphique est proche de 75 battements par minute.",
    },
    questions: [
      choice("Que représente l’onde P ?", ["La dépolarisation atriale", "La pression aortique", "La fermeture de His", "La repolarisation ventriculaire"], 0, "P correspond à l’activation électrique des atria.", "Exercice 2 • page 12"),
      choice("Que représente le complexe QRS ?", ["Le remplissage passif seul", "La dépolarisation ventriculaire", "La repolarisation atriale isolée visible", "La concentration de Ca²⁺"], 1, "QRS correspond à l’activation rapide des ventricules."),
      choice("Que représente l’onde T ?", ["La systole atriale", "Le délai du nœud AV", "La repolarisation ventriculaire", "La contraction du diaphragme"], 2, "T est un signal électrique de récupération ventriculaire."),
      choice("Pourquoi la repolarisation atriale est-elle rarement distinguée ?", ["Elle n’existe pas", "Elle survient après plusieurs jours", "Elle est identique à P", "Elle est généralement masquée par QRS"], 3, "Le signal ventriculaire de grande amplitude la recouvre."),
      trueFalse("L’intervalle PR est un courant électrique continu qui ouvre les valves.", false, "PR est une durée de conduction entre activation atriale et ventriculaire."),
      choice("Quel événement suit normalement le complexe QRS ?", ["Une hausse différée de la pression ventriculaire", "Une disparition du calcium", "Une systole atriale unique", "Une baisse immédiate du sang artériel"], 0, "La dépolarisation déclenche le couplage excitation-contraction."),
      choice("Pourquoi l’onde T et la relaxation ne sont-elles pas parfaitement simultanées ?", ["L’ECG mesure le volume sanguin", "La mécanique et la recapture du Ca²⁺ prennent un délai", "Le cœur cesse d’être automatique", "P réapparaît toujours"], 1, "La récupération électrique précède en partie la relaxation mécanique."),
      choice("Si $T_{RR}=0{,}8$ s, quelle fréquence obtient-on environ ?", ["48 bpm", "60 bpm", "75 bpm", "120 bpm"], 2, "$60/0{,}8=75$ bpm.", "Situation d’évaluation • page 11"),
      choice("Quel tracé de la page 11 est mécanique ?", ["Le tracé B seulement car il contient QRS", "Les deux sont des ECG", "Aucun", "Le tracé A de pression intraventriculaire"], 3, "L’axe en kPa identifie la pression."),
      choice("Quelle chaîne est correcte ?", ["Dépolarisation → Ca²⁺ → tension → pression", "Pression → ADN → onde P", "T → nœud sinusal → sang", "Valve → QRS → cerveau"], 0, "L’activation électrique déclenche le couplage calcique puis la force mécanique."),
      short("Donne le nom de l’intervalle entre deux pics R successifs.", ["intervalle RR", "intervalle R-R", "R-R", "RR"], "L’intervalle R–R permet d’estimer la durée du cycle.", "Tracé B • page 11"),
    ],
    corrections: [
      "Chaque événement électrique précède l’événement mécanique associé : les ondes P, QRS et T ne sont pas confondues avec les contractions.",
      "L’intervalle PR/PQ est identifié comme une durée de conduction et non comme un courant.",
      "La repolarisation atriale masquée par QRS, le délai électromécanique et l’estimation à environ 75 bpm sont explicités.",
    ],
  },
  {
    id: "autonomic-efferent-control",
    title: "Analyser le contrôle autonome efférent",
    summary: "Interpréter section et stimulation des nerfs vagues et sympathiques pour distinguer tonus, chronotropie, dromotropie et inotropie.",
    pages: "5-7 et 14",
    section: "III-A. Action des nerfs cardiaques",
    durationMinutes: 30,
    xp: 85,
    kind: "practice",
    body: String.raw`
## Deux voies antagonistes, pas deux interrupteurs absolus

Le cœur reçoit des fibres du système nerveux autonome. Les nerfs vagues appartiennent au **parasympathique** ; les fibres cardiaques sympathiques appartiennent au système **sympathique**, appelé aussi orthosympathique dans la source. Ces voies modulent un automatisme déjà présent.

La stimulation vagale ralentit le nœud sinusal (**effet chronotrope négatif**) et ralentit la conduction au nœud AV (**effet dromotrope négatif**). Une stimulation forte peut provoquer un arrêt transitoire, puis un **échappement vagal**. La section des vagues supprime une partie du tonus parasympathique de repos et tend donc à accélérer le cœur.

La stimulation sympathique accélère le rythme (**chronotrope positif**), facilite la conduction (**dromotrope positif**) et augmente la force de contraction (**inotrope positif**). Sa section peut ralentir le cœur si un tonus sympathique était présent, sans abolir l’automatisme.

## Lire section et stimulation

Une stimulation teste l’effet de l’activité accrue d’une voie ; une section révèle l’effet du **tonus basal** qu’elle exerçait avant la coupure. Les deux manipulations ne sont pas symétriques : après section, stimuler le bout relié à l’organe peut encore agir, tandis que stimuler le bout séparé de l’organe ne transmet plus directement un message efférent.

| Manipulation | Résultat principal | Déduction |
|---|---|---|
| stimulation du vague | ralentissement, parfois arrêt bref | voie cardio-inhibitrice |
| section du vague | accélération | tonus vagal au repos |
| stimulation sympathique | accélération et force accrue | voie cardio-accélératrice |
| section sympathique | effet variable, souvent ralentissement modéré | tonus sympathique possible |

## L’échappement vagal

Le PDF attribue surtout la reprise des battements à la destruction de l’acétylcholine par l’acétylcholinestérase. Cette enzyme limite effectivement l’action de l’ACh, mais elle n’explique pas seule l’échappement. Des pacemakers inférieurs, moins soumis au vague, peuvent prendre le relais ; l’influence vagale directe sur les ventricules est plus faible que sur les nœuds ; des mécanismes réflexes et sympathiques peuvent aussi intervenir selon la préparation.

Le parasympathique n’est donc pas un « nerf d’arrêt » permanent, et le sympathique n’est pas le générateur du rythme. Ils déplacent la pente pacemaker, la conduction et la disponibilité calcique.

> **Correction de mécanisme.** L’échappement vagal est multifactoriel : dégradation de l’ACh, pacemakers d’échappement et moindre action vagale ventriculaire. Il ne faut pas l’attribuer uniquement à l’acétylcholinestérase.

> **Astuce mémoire :** vague = frein modulable ; sympathique = accélérateur modulable ; moteur = tissu cardionecteur.
`,
    keyPoint: "Le vague ralentit surtout nœuds sinusal et AV ; le sympathique accélère rythme, conduction et force, sans créer l’automatisme cardiaque.",
    example: "Une accélération après section bilatérale des vagues révèle qu’un tonus parasympathique ralentissait le cœur avant la coupure.",
    methodSteps: [
      "Identifie si l’expérience stimule ou sectionne la voie.",
      "Distingue le bout central du bout périphérique après section.",
      "Décris fréquence, conduction et force séparément.",
      "Interprète l’échappement sans invoquer une seule cause.",
    ],
    interaction: diagram(
      "Comparer les commandes efférentes",
      "Choisis une manipulation et prédis son effet sur le pacemaker, le nœud AV et le myocarde.",
      "Modulation autonome du cœur",
      "Les voies parasympathique et sympathique déplacent l’activité spontanée dans des sens opposés, avec des cibles et intensités différentes.",
      [
        { id: "vagus-stim", label: "Stimuler le vague", role: "Ralentir", detail: "ACh sur récepteurs muscariniques M2 : pente pacemaker réduite et conduction AV ralentie.", group: "Parasympathique" },
        { id: "vagus-cut", label: "Sectionner le vague", role: "Accélérer", detail: "La perte du tonus vagal permet au nœud sinusal de retrouver une fréquence intrinsèque plus élevée.", group: "Parasympathique" },
        { id: "symp-stim", label: "Stimuler le sympathique", role: "Accélérer et renforcer", detail: "Noradrénaline sur récepteurs β1 : fréquence, conduction et disponibilité du Ca²⁺ augmentent.", group: "Sympathique" },
        { id: "symp-cut", label: "Sectionner le sympathique", role: "Retirer un tonus", detail: "Le rythme peut diminuer, mais l’automatisme persiste puisque son générateur est cardiaque.", group: "Sympathique" },
        { id: "escape", label: "Échappement vagal", role: "Reprise sous stimulation", detail: "Pacemakers inférieurs, faible influence vagale ventriculaire et fin de l’action de l’ACh participent à la reprise.", group: "Nuancer" },
      ],
      "Une même fréquence peut résulter de niveaux différents de tonus vagal et sympathique : le résultat final est une balance, pas un interrupteur binaire.",
    ),
    questions: [
      choice("Quel effet produit normalement une stimulation vagale ?", ["Un ralentissement cardiaque", "Une augmentation obligatoire de la force", "Une destruction du nœud sinusal", "Une hausse de la pression par réflexe direct"], 0, "Le vague exerce des effets chronotrope et dromotrope négatifs.", "Tracé I • page 6"),
      choice("Pourquoi la section des vagues accélère-t-elle souvent le cœur ?", ["Elle stimule Purkinje mécaniquement", "Elle retire un tonus parasympathique de repos", "Elle injecte de l’adrénaline", "Elle ferme l’aorte"], 1, "Le vague freine continuellement le nœud sinusal au repos."),
      choice("Quel effet appartient au sympathique cardiaque ?", ["Arrêt définitif du pacemaker", "Diminution de toute conduction", "Augmentation de la fréquence et de la force", "Transformation de P en T"], 2, "Le sympathique a des effets chronotrope, dromotrope et inotrope positifs."),
      choice("Que signifie « chronotrope » ?", ["Relatif au volume sanguin", "Relatif aux valves", "Relatif au trajet nerveux", "Relatif à la fréquence cardiaque"], 3, "La chronotropie décrit la fréquence des battements."),
      trueFalse("La section des nerfs sympathiques supprime nécessairement toute activité cardiaque.", false, "L’automatisme est intrinsèque au cœur."),
      choice("Que signifie un effet dromotrope négatif ?", ["Une conduction ralentie, notamment au nœud AV", "Une force accrue", "Une pression artérielle toujours nulle", "Une contraction tétanique"], 0, "La dromotropie concerne la vitesse de conduction."),
      choice("Quel mécanisme contribue à l’échappement vagal ?", ["La disparition du tissu nodal", "Un pacemaker inférieur moins soumis au vague", "La fusion des valves", "Une onde P transformée en hormone"], 1, "Un foyer d’échappement peut reprendre les ventricules."),
      choice("Après section d’un nerf efférent, quel bout peut encore agir directement sur le cœur s’il est stimulé ?", ["Le bout central seulement", "Aucun bout dans tous les cas", "Le bout périphérique relié au cœur", "Le bout relié à la peau"], 2, "Le message doit pouvoir atteindre l’organe effecteur."),
      choice("Quelle phrase est la plus exacte ?", ["Le sympathique fabrique le rythme", "Le vague arrête toujours le cœur", "Les deux nerfs sont sensitifs", "Les voies autonomes modulent un rythme intrinsèque"], 3, "Le tissu cardionecteur reste le générateur."),
      short("Donne le terme pour l’augmentation de la force de contraction.", ["effet inotrope positif", "inotropie positive", "inotrope positif"], "Le sympathique augmente l’inotropie, surtout ventriculaire."),
    ],
    corrections: [
      "Le sympathique et le parasympathique sont décrits comme modulateurs d’un automatisme intrinsèque, non comme ses générateurs.",
      "L’analyse distingue stimulation, section, bout central, bout périphérique et mise en évidence d’un tonus basal.",
      "L’échappement vagal est expliqué par plusieurs mécanismes au lieu d’être attribué uniquement à l’acétylcholinestérase.",
    ],
  },
  {
    id: "baroreflex-sino-aortic",
    title: "Reconstruire le baroréflexe sino-aortique",
    summary: "Relier étirement artériel, nerfs de Hering et de Cyon, centres bulbaires et commandes autonomes dans une boucle de rétroaction négative.",
    pages: "5, 7-8, 10 et 12",
    section: "III-B. Voies afférentes et centres du baroréflexe",
    durationMinutes: 32,
    xp: 90,
    kind: "practice",
    body: String.raw`
## Les capteurs mesurent une pression, pas une fréquence

Des **barorécepteurs** sont situés dans la paroi du sinus carotidien et de la crosse aortique. Ils répondent à l’étirement de la paroi, donc aux variations de pression artérielle. Une hausse de pression augmente leur fréquence de décharge ; une baisse la diminue. Ils ne mesurent pas directement la fréquence cardiaque, même si cette fréquence contribue, avec le volume d’éjection et les résistances vasculaires, à la pression.

Les informations du sinus carotidien empruntent le nerf de Hering, branche du nerf glossopharyngien. Celles de la crosse aortique empruntent le nerf de Cyon, rattaché au vague dans le modèle scolaire. Ce sont des voies **afférentes** : elles vont des récepteurs vers les centres cardiovasculaires du bulbe rachidien.

## Une boucle de rétroaction négative

Lorsque la pression augmente :

$$\uparrow P_{\text{artérielle}}\rightarrow\uparrow\text{étirement}\rightarrow\uparrow\text{messages afférents}\rightarrow\uparrow\text{vague et}\downarrow\text{sympathique}\rightarrow\downarrow\text{débit cardiaque}$$

La fréquence diminue, la conduction AV ralentit, la contractilité et le tonus vasculaire sympathique baissent. La pression est ainsi ramenée vers sa zone de fonctionnement. En cas de baisse de pression, la séquence s’inverse : moindre décharge baroréceptrice, retrait vagal et augmentation sympathique.

Le débit cardiaque vérifie :

$$D_c=f_c\times VES$$

et la pression artérielle moyenne dépend schématiquement de ce débit et des résistances périphériques :

$$PAM\approx D_c\times R_{\text{périphériques}}$$

Une fréquence élevée n’implique donc pas mécaniquement une hypertension : le volume d’éjection, les résistances, la volémie et l’adaptation réflexe comptent aussi.

## Interpréter section et stimulation d’un nerf sensitif

Après section d’un nerf afférent, stimuler le **bout central** envoie des messages vers le bulbe et peut déclencher une réponse réflexe. Stimuler le **bout périphérique**, séparé du centre, n’informe plus le bulbe. Pour les nerfs de Hering et de Cyon, la stimulation centrale mime généralement une forte pression et provoque une bradycardie réflexe.

Les centres intégrateurs se trouvent principalement dans le bulbe. La moelle thoracique contient notamment les neurones sympathiques préganglionnaires ; parler d’un unique « centre cardioaccélérateur cervico-dorsal » est une simplification scolaire qu’il faut replacer dans cette organisation.

> **Correction physiologique.** Le baroréflexe répond à l’étirement artériel et tamponne rapidement la pression. Il ne fonctionne pas selon la règle simpliste « fréquence basse → pression haute » ou l’inverse.

> **Astuce mémoire :** **Hering/Cyon montent l’information ; vague/sympathique descendent la réponse.**
`,
    keyPoint: "Une hausse de pression étire les barorécepteurs, augmente les messages de Hering/Cyon vers le bulbe, renforce le vague et réduit le sympathique.",
    example: "La stimulation du bout central du nerf de Cyon après section provoque une bradycardie : elle active le centre comme le ferait une hausse de pression aortique.",
    methodSteps: [
      "Repère le récepteur et la variable qu’il détecte : l’étirement artériel.",
      "Suis la voie afférente vers le bulbe avant de chercher la réponse.",
      "Déduis les variations opposées du vague et du sympathique.",
      "Ferme la boucle en vérifiant que la réponse corrige la variation initiale de pression.",
    ],
    interaction: timeline(
      "Dérouler une correction de pression",
      "Suis une hausse de pression depuis la paroi artérielle jusqu’au retour vers la valeur de départ.",
      [
        { label: "Pression en hausse", shortLabel: "Perturbation", detail: "La paroi du sinus carotidien et de la crosse aortique est davantage étirée." },
        { label: "Barorécepteurs activés", shortLabel: "Capteurs", detail: "Leur fréquence de décharge augmente proportionnellement à l’étirement dans leur plage de réponse." },
        { label: "Hering et Cyon", shortLabel: "Voies sensitives", detail: "Les messages afférents gagnent les réseaux cardiovasculaires bulbaires." },
        { label: "Intégration bulbaire", shortLabel: "Centre", detail: "L’activité parasympathique augmente tandis que la commande sympathique diminue." },
        { label: "Cœur et vaisseaux", shortLabel: "Effecteurs", detail: "Fréquence, conduction, contractilité et vasoconstriction sympathique diminuent." },
        { label: "Pression corrigée", shortLabel: "Rétroaction −", detail: "Le débit cardiaque et les résistances baissent : la variation initiale est amortie." },
      ],
      "Le baroréflexe stabilise rapidement la pression mais ne remplace pas les mécanismes rénaux et hormonaux de contrôle à long terme.",
    ),
    questions: [
      choice("À quelle variable les barorécepteurs répondent-ils directement ?", ["À l’étirement de la paroi artérielle", "À la fréquence cardiaque mesurée directement", "À la concentration artérielle en O₂ uniquement", "Au volume sanguin total mesuré directement"], 0, "L’étirement reflète la pression dans le sinus carotidien et la crosse aortique.", "Nerfs de Hering et de Cyon • pages 5 et 7"),
      choice("Quel nerf transmet l’information du sinus carotidien ?", ["Le nerf de Cyon", "Le nerf de Hering", "Le nerf vague efférent", "Le faisceau sympathique cardiaque"], 1, "Hering est la voie afférente carotidienne dans le modèle scolaire."),
      choice("Où sont principalement intégrés ces messages cardiovasculaires ?", ["Dans la moelle thoracique seule", "Dans le nœud sinusal", "Dans le bulbe rachidien", "Dans le sinus carotidien"], 2, "Les réseaux bulbaires organisent la réponse autonome."),
      choice("Quelle réponse suit une hausse de pression ?", ["Vague diminué et sympathique augmenté", "Vague et sympathique augmentés", "Vague et sympathique diminués", "Vague augmenté et sympathique diminué"], 3, "La boucle abaisse débit et résistances pour corriger la hausse."),
      trueFalse("Les barorécepteurs mesurent directement le nombre de battements par minute.", false, "Ils détectent l’étirement artériel ; fréquence et pression sont liées mais distinctes."),
      choice("Que produit la stimulation du bout central du nerf de Cyon sectionné ?", ["Un message vers le centre et une bradycardie réflexe", "Une action directe sur le nœud sinusal", "Une accélération sans relais central", "Aucun effet car ce bout est séparé du récepteur"], 0, "Le bout central reste relié au système nerveux central."),
      choice("Quelle relation définit le débit cardiaque ?", ["$D_c=PAM/RR$", "$D_c=f_c\\times VES$", "$D_c=PR+QRS$", "$D_c=Ca^{2+}/K^+$"], 1, "Le débit est le produit de la fréquence par le volume éjecté à chaque cycle."),
      choice("Pourquoi une tachycardie n’implique-t-elle pas toujours une hypertension ?", ["La pression ne dépend jamais du cœur", "Le sang n’a pas de volume", "Volume d’éjection et résistances comptent aussi", "Les barorécepteurs produisent l’ECG"], 2, "La pression résulte de plusieurs variables couplées."),
      choice("Quel énoncé décrit une rétroaction négative ?", ["La réponse renforce l’écart à la consigne", "Le capteur cesse d’émettre malgré la variation", "L’effecteur maintient la perturbation initiale", "La réponse s’oppose à la variation initiale"], 3, "Le baroréflexe amortit les changements rapides de pression."),
      short("Donne le nom du réflexe rapide qui stabilise la pression artérielle.", ["baroréflexe", "le baroréflexe", "réflexe barorécepteur", "réflexe sino-aortique"], "Le baroréflexe utilise les récepteurs sino-aortiques."),
    ],
    corrections: [
      "Les barorécepteurs sont reliés à la pression et à l’étirement artériel, non à une mesure directe de la fréquence cardiaque.",
      "Le débit, le volume d’éjection et les résistances périphériques empêchent toute relation inverse simpliste entre fréquence et pression.",
      "L’intégration bulbaire est distinguée des neurones sympathiques préganglionnaires de la moelle thoracique.",
    ],
  },
  {
    id: "loewi-chemical-mediation",
    title: "Interpréter l’expérience de Loewi",
    summary: "Démontrer par transfert de perfusat qu’une stimulation nerveuse libère une substance diffusible agissant sur un second cœur.",
    pages: "8-10 et 15",
    section: "IV-A. Expérience de Loewi et médiation chimique",
    durationMinutes: 30,
    xp: 95,
    kind: "practice",
    body: String.raw`
## Deux cœurs, un liquide transféré

L’expérience historique de Loewi utilise deux cœurs de batracien perfusés. Le premier cœur conserve ses nerfs ; le liquide qui l’a baigné peut être transféré vers un second cœur dépourvu de liaison nerveuse directe avec le premier.

Lorsque le nerf vague du cœur 1 est stimulé, ce cœur ralentit. Le perfusat recueilli puis envoyé au cœur 2 le ralentit à son tour. Or aucun axone ne relie les deux préparations : l’effet a donc été transporté par une **substance diffusible** libérée dans le liquide.

Le médiateur vagal historique, appelé *Vagusstoff*, a ensuite été identifié comme l’**acétylcholine (ACh)**. L’expérience est un raisonnement de causalité :

$$\text{stimulation du vague}\rightarrow\text{libération d’ACh}\rightarrow\text{transfert du perfusat}\rightarrow\text{ralentissement du cœur 2}$$

Une expérience analogue après stimulation sympathique produit un effet accélérateur transférable, historiquement appelé « sympathine ». Dans le cœur, les fibres sympathiques postganglionnaires libèrent principalement de la **noradrénaline**. L’adrénaline agit également sur le cœur, mais elle est surtout sécrétée dans le sang par la médullosurrénale : c’est principalement une hormone circulante.

## Les contrôles indispensables

Un bon protocole compare un perfusat témoin, recueilli sans stimulation, au perfusat recueilli pendant ou juste après la stimulation. Il garde stables température, composition ionique, oxygénation et débit de perfusion. Sans ces contrôles, un changement du cœur 2 pourrait venir du milieu lui-même.

L’atropine bloque les récepteurs muscariniques cardiaques de l’ACh. Elle ne détruit pas l’acétylcholine et ne bloque pas sa synthèse. Si l’atropine empêche l’effet du perfusat vagal sur le cœur 2, elle situe l’action au niveau des récepteurs.

L’« ergotoxine » du document est un outil pharmacologique historique aux actions complexes, notamment alpha-adrénergiques. Elle ne constitue pas le bloqueur moderne de référence des effets cardiaques $\beta_1$. Le **propranolol**, bêtabloquant non sélectif $\beta_1/\beta_2$, illustre un blocage bêta moderne ; un agent comme le métoprolol illustre une sélectivité relative pour $\beta_1$.

## Ce que l’expérience prouve — et ne prouve pas

Le transfert prouve l’existence d’un signal chimique diffusible et l’absence de nécessité d’une connexion nerveuse entre les deux cœurs. Il ne montre pas que tous les neurotransmetteurs sont détruits par une enzyme : l’ACh est hydrolysée par l’acétylcholinestérase, alors que la noradrénaline est surtout recaptée puis métabolisée.

> **Précision historique.** Les mots *Vagusstoff* et « sympathine » appartiennent à l’histoire de la découverte. On utilise aujourd’hui ACh et noradrénaline pour les médiateurs postganglionnaires cardiaques.

> **Astuce mémoire :** si le second cœur répond sans nerf commun, le message a voyagé dans le liquide.
`,
    keyPoint: "Le transfert du perfusat du cœur 1 stimulé vers le cœur 2 reproduit l’effet : une substance diffusible, ACh ou noradrénaline selon la voie, assure la médiation.",
    example: "Le cœur 2 ralentit après réception du liquide du cœur 1 stimulé par le vague ; le témoin sans stimulation ne le ralentit pas.",
    methodSteps: [
      "Décris l’état des deux cœurs et l’absence de connexion nerveuse entre eux.",
      "Compare perfusat témoin et perfusat après stimulation.",
      "Relie la réponse du cœur 2 au transport d’un médiateur diffusible.",
      "Utilise un antagoniste de récepteur pour localiser l’action sans prétendre qu’il détruit le médiateur.",
    ],
    interaction: timeline(
      "Rejouer le transfert de Loewi",
      "Déroule les étapes et repère le moment où l’hypothèse chimique devient nécessaire.",
      [
        { label: "Deux rythmes de référence", shortLabel: "Contrôle", detail: "Les deux cœurs sont perfusés dans des conditions comparables ; le second n’est pas relié au nerf du premier." },
        { label: "Vague du cœur 1 stimulé", shortLabel: "Manipulation", detail: "Le cœur 1 ralentit : l’effet vagal attendu est observé." },
        { label: "Perfusat recueilli", shortLabel: "Prélèvement", detail: "Le liquide qui a baigné le cœur 1 est collecté sans transférer de nerf ni d’électrode." },
        { label: "Liquide vers le cœur 2", shortLabel: "Transfert", detail: "Le perfusat est appliqué au second cœur dans les mêmes conditions de température et de débit." },
        { label: "Cœur 2 ralenti", shortLabel: "Résultat", detail: "La reproduction de l’effet exige un signal diffusible présent dans le liquide." },
        { label: "Médiateur identifié", shortLabel: "Conclusion", detail: "Le Vagusstoff est l’acétylcholine ; l’atropine bloque ses récepteurs muscariniques cardiaques." },
      ],
      "Le témoin sans stimulation protège le raisonnement : un simple changement de milieu ne doit pas être confondu avec le médiateur nerveux.",
    ),
    questions: [
      choice("Quel résultat constitue la preuve centrale de Loewi ?", ["Le cœur 2 répond au perfusat du cœur 1 stimulé", "Le cœur 1 ralentit sous stimulation directe sans transfert", "Les deux cœurs ralentissent avant tout transfert", "Le cœur 2 répond pareil au perfusat témoin"], 0, "L’effet traverse le liquide sans connexion nerveuse.", "Tableau et montage • pages 8-9"),
      choice("Quel médiateur correspond au Vagusstoff ?", ["L’adrénaline", "L’acétylcholine", "La noradrénaline", "La dopamine"], 1, "L’ACh est le médiateur postganglionnaire parasympathique cardiaque."),
      choice("Que libèrent principalement les fibres sympathiques postganglionnaires cardiaques ?", ["De l’adrénaline circulante", "De l’acétylcholine", "De la noradrénaline", "Du cortisol"], 2, "La noradrénaline agit notamment sur les récepteurs β1."),
      choice("Quelle est la principale origine de l’adrénaline circulante ?", ["Le nœud sinusal", "Le nerf de Hering", "Le réseau de Purkinje", "La médullosurrénale"], 3, "L’adrénaline est surtout une hormone sécrétée par la médullosurrénale."),
      trueFalse("L’atropine détruit chimiquement toute l’acétylcholine présente dans le perfusat.", false, "Elle bloque les récepteurs muscariniques ; elle n’hydrolyse pas l’ACh."),
      choice("À quoi sert un perfusat témoin sans stimulation ?", ["À vérifier que le transfert seul ne produit pas l’effet", "À montrer que toute solution ralentit le cœur", "À remplacer la stimulation vagale par l’atropine", "À prouver que le cœur 2 répond sans médiateur"], 0, "Le témoin isole l’effet lié à la stimulation nerveuse."),
      choice("Quel médicament cité est un bêtabloquant non sélectif ?", ["L’atropine", "Le propranolol", "Le métoprolol", "L’acétylcholine"], 1, "Le propranolol bloque β1 et β2 ; l’ergotoxine a un profil historique complexe."),
      choice("Que prouve le transfert du liquide ?", ["Le médiateur agit seulement comme hormone", "Le cœur 2 reçoit une connexion nerveuse", "Un signal diffusible a été libéré", "L’automatisme disparaît sans innervation"], 2, "La réponse du second cœur exige une substance transportée par le perfusat."),
      choice("Comment la noradrénaline est-elle surtout retirée de la synapse ?", ["Par hydrolyse exclusive dans la fente", "Par diffusion seule vers le sang", "Par fixation définitive aux récepteurs", "Par recapture puis métabolisme"], 3, "La recapture présynaptique joue un rôle majeur."),
      short("Donne l’abréviation de l’acétylcholine.", ["ACh", "ACH", "Ach", "ach"], "ACh est l’abréviation standard.", "Interprétation • page 9"),
    ],
    corrections: [
      "Le Vagusstoff et la sympathine sont présentés comme des termes historiques, remplacés par ACh et noradrénaline pour les médiateurs cardiaques.",
      "L’adrénaline est située principalement dans la médullosurrénale comme hormone circulante, non comme médiateur exclusif des fibres sympathiques cardiaques.",
      "L’ergotoxine est contextualisée comme outil historique ; le propranolol illustre plus précisément le blocage bêta cardiaque moderne.",
    ],
  },
  {
    id: "cardiac-mediators-pharmacology",
    title: "Relier médiateurs, récepteurs et effets",
    summary: "Comparer ACh–M2 et noradrénaline–β1, puis raisonner sur l’atropine, les bêtabloquants et la terminaison des signaux.",
    pages: "8-10 et 15",
    section: "IV-B. Médiateurs chimiques et pharmacologie cardiaque",
    durationMinutes: 30,
    xp: 105,
    kind: "practice",
    body: String.raw`
## Acétylcholine et récepteur M2

Les fibres parasympathiques postganglionnaires libèrent de l’**acétylcholine**. Sur les cellules du nœud sinusal et du nœud AV, l’ACh active surtout des récepteurs muscariniques **M2**. La signalisation réduit l’AMP cyclique, diminue des courants entrant dans la dépolarisation diastolique et augmente une conductance potassique.

Le potentiel diastolique devient plus négatif, la pente pacemaker diminue et le seuil est atteint plus tard. Le rythme ralentit et la conduction AV est freinée. L’acétylcholinestérase hydrolyse rapidement l’ACh dans l’environnement synaptique, ce qui limite la durée du signal.

L’**atropine** est un antagoniste muscarinique : elle occupe les récepteurs sans les activer et empêche l’ACh d’y produire son effet. Elle ne « détruit » pas le neurotransmetteur. En retirant le tonus vagal, elle peut augmenter la fréquence cardiaque.

## Noradrénaline et récepteur β1

Les fibres sympathiques cardiaques libèrent principalement de la **noradrénaline**. Les récepteurs adrénergiques **β1** augmentent la production d’AMP cyclique et facilitent les courants calciques. Les cellules pacemaker atteignent le seuil plus vite ; la conduction AV et la disponibilité du Ca²⁺ dans le myocarde augmentent.

On observe donc des effets :

- chronotrope positif : fréquence accrue ;
- dromotrope positif : conduction accélérée ;
- inotrope positif : contraction plus forte ;
- lusitrope positif : relaxation facilitée par une gestion plus rapide du Ca²⁺.

La noradrénaline est surtout retirée par **recapture** dans la terminaison nerveuse, puis réutilisée ou métabolisée. Cette terminaison diffère de l’hydrolyse rapide de l’ACh par une enzyme extracellulaire.

## Neurotransmetteur et hormone

Un neurotransmetteur est libéré localement par une terminaison nerveuse et agit à proximité. Une hormone est libérée dans le sang et agit à distance. Une même famille chimique peut participer aux deux modes : la noradrénaline est surtout neurotransmetteur cardiaque sympathique ; l’adrénaline sécrétée par la **médullosurrénale** est surtout hormone circulante.

Le propranolol antagonise les récepteurs β et réduit les effets sympathiques sur la fréquence et la force, mais il est **non sélectif** : il bloque β1 et β2. Le métoprolol est relativement plus sélectif de β1. Le mot « ergotoxine » de la source doit rester dans son contexte historique : ses actions ne correspondent pas à un blocage sélectif moderne de β1.

## Raisonner sans faire de prescription

Le cours permet de prévoir qualitativement un effet expérimental, pas de recommander un médicament à une personne. Atropine et bêtabloquants ont des indications, contre-indications et effets indésirables qui relèvent d’une décision médicale.

> **Correction pharmacologique.** Atropine = antagoniste muscarinique ; propranolol = bêtabloquant non sélectif β1/β2. Ni l’un ni l’autre ne détruit le neurotransmetteur. L’ergotoxine n’est pas un substitut sélectif de β1.

> **Astuce mémoire :** **M2 met le frein ; β1 donne l’élan.**
`,
    keyPoint: "ACh–M2 ralentit pacemaker et conduction ; noradrénaline–β1 accélère rythme, conduction et force. Atropine et propranolol bloquent des récepteurs distincts.",
    example: "Après atropine, une stimulation vagale perd une grande part de son effet : le résultat localise l’action de l’ACh sur les récepteurs muscariniques.",
    methodSteps: [
      "Identifie d’abord la voie nerveuse et le médiateur libéré.",
      "Associe le médiateur à son récepteur cardiaque principal.",
      "Déduis l’effet sur pente pacemaker, conduction et calcium.",
      "Distingue antagonisme du récepteur, dégradation enzymatique et recapture.",
    ],
    interaction: diagram(
      "Classer les signaux cardiaques",
      "Ouvre chaque branche et relie voie, médiateur, récepteur, mécanisme de fin et effet mesurable.",
      "Deux commandes chimiques antagonistes",
      "Le cœur reçoit localement ACh et noradrénaline, tandis que l’adrénaline circulante ajoute une modulation endocrine.",
      [
        { id: "ach", label: "ACh", role: "Parasympathique → M2", detail: "Pente pacemaker et conduction AV diminuent ; l’acétylcholinestérase termine rapidement le signal.", group: "Freiner" },
        { id: "atropine", label: "Atropine", role: "Antagoniste muscarinique", detail: "Elle empêche l’ACh d’activer M2 sans détruire l’ACh elle-même.", group: "Bloquer le frein" },
        { id: "ne", label: "Noradrénaline", role: "Sympathique → β1", detail: "AMPc, fréquence, conduction, disponibilité calcique et force augmentent ; la recapture termine surtout le signal.", group: "Accélérer" },
        { id: "adrenaline", label: "Adrénaline", role: "Médullosurrénale → sang", detail: "Hormone circulante pouvant activer les récepteurs adrénergiques cardiaques.", group: "Hormone" },
        { id: "beta-blocker", label: "Propranolol", role: "Antagoniste β1/β2", detail: "Ce bêtabloquant non sélectif réduit les effets adrénergiques ; il illustre mieux le blocage bêta moderne que l’ergotoxine historique.", group: "Bloquer l’élan" },
      ],
      "Un antagoniste bloque une cible ; une enzyme transforme une molécule ; un transporteur la recapture. Ces trois mécanismes ne sont pas interchangeables.",
    ),
    questions: [
      choice("Quel récepteur cardiaque médie principalement l’effet vagal ?", ["Le récepteur muscarinique M2", "Le récepteur β1", "Le récepteur nicotinique musculaire uniquement", "Le récepteur à l’insuline"], 0, "M2 ralentit surtout les nœuds sinusal et AV."),
      choice("Quel effet l’ACh exerce-t-elle sur la pente pacemaker ?", ["Elle la rend toujours verticale", "Elle la diminue", "Elle supprime tout K⁺", "Elle la transforme en pression"], 1, "Le seuil est atteint plus tard et la fréquence diminue."),
      choice("Quel récepteur médie principalement les effets sympathiques cardiaques ?", ["M2", "Un récepteur à l’ADN", "β1", "Un récepteur rénal"], 2, "β1 augmente notamment l’AMPc et les courants calciques."),
      choice("Quel mécanisme termine surtout le signal noradrénergique ?", ["La fermeture d’une valve", "La disparition du sang", "L’hydrolyse par l’acétylcholinestérase uniquement", "La recapture présynaptique"], 3, "La noradrénaline est surtout recaptée puis réutilisée ou métabolisée."),
      trueFalse("L’atropine est une enzyme qui hydrolyse l’acétylcholine.", false, "L’atropine est un antagoniste des récepteurs muscariniques."),
      choice("Quel effet est chronotrope positif ?", ["Une fréquence plus élevée", "Une conduction plus lente", "Une force plus faible", "Une pression toujours nulle"], 0, "Chronotrope concerne la fréquence."),
      choice("Quel effet est inotrope positif ?", ["Un intervalle PR allongé", "Une force de contraction accrue", "Une disparition de P", "Un ralentissement obligatoire"], 1, "Inotrope concerne la force de contraction."),
      choice("Quelle glande libère principalement l’adrénaline circulante ?", ["La thyroïde", "Le pancréas", "La médullosurrénale", "L’hypophyse postérieure"], 2, "La médullosurrénale sécrète l’adrénaline dans le sang."),
      choice("Pourquoi l’ergotoxine doit-elle être contextualisée ?", ["Elle n’a jamais existé", "Elle est une onde ECG", "Elle est identique à l’ACh", "Elle n’est pas un bloqueur β1 sélectif moderne"], 3, "Ses effets historiques et pharmacologiques sont plus complexes."),
      short("Donne le nom d’un bêtabloquant cité dans ce cours.", ["propranolol", "le propranolol"], "Le propranolol antagonise les récepteurs β.", "Tableau pharmacologique • page 8"),
    ],
    corrections: [
      "L’atropine est décrite comme antagoniste muscarinique et non comme une substance qui détruit ou inhibe directement l’acétylcholine.",
      "La fin du signal ACh par acétylcholinestérase est distinguée de la fin du signal noradrénergique principalement par recapture.",
      "Noradrénaline neurotransmetteur et adrénaline surtout endocrine sont distinguées ; l’ergotoxine est replacée dans son contexte historique.",
    ],
  },
  {
    id: "heart-function-final-mission",
    title: "Mission finale — cœur, ECG et pression",
    summary: "Mobiliser automatisme, conduction, cycle, ECG, voies autonomes et baroréflexe pour résoudre la situation d’évaluation officielle.",
    pages: "11-12 et annexes 13-15",
    section: "Situation d’évaluation et exercices de consolidation",
    durationMinutes: 38,
    xp: 130,
    kind: "challenge",
    body: String.raw`
## Dossier 1 — identifier les deux enregistrements

Le document officiel juxtapose un tracé A gradué en kilopascals et un tracé B comportant les ondes P, QRS et T. Le tracé A est une **pression intraventriculaire** ; le tracé B est un **électrocardiogramme**. L’axe de pression atteint graphiquement un maximum voisin de $10$ à $12\ \mathrm{kPa}$, mais la figure ne justifie pas une précision supérieure.

Pour analyser A entre les repères a et g, on décrit d’abord une pression basse pendant le remplissage, une montée rapide lors de la contraction isovolumétrique, une pression élevée pendant l’éjection, puis une chute lors de la relaxation. On n’associe les valves qu’après cette description.

La lecture segmentée demandée par la consigne est :

- **a–b** : faible hausse liée à la systole atriale et à la fin du remplissage ;
- **b–c** : montée rapide de la pression ventriculaire après QRS, correspondant surtout à la contraction isovolumétrique ;
- **c–d** : pression élevée pendant l’éjection, avec un sommet graphique voisin de 10 à 12 kPa ;
- **d–e** : chute rapide de pression au cours de la relaxation ventriculaire ;
- **e–f** : pression basse pendant la diastole et le remplissage ;
- **f–g** : nouvelle petite hausse atriale, avant le QRS qui ouvre le cycle ventriculaire suivant.

Ces frontières sont des repères de lecture du dessin : les transitions physiologiques ne sont pas toutes instantanées.

## Dossier 2 — superposer sans confondre

L’onde P précède la contraction atriale. Le complexe QRS précède la contraction ventriculaire et la montée de pression. L’onde T correspond à la repolarisation ventriculaire ; la pression commence à baisser et la relaxation suit avec un délai. La relation correcte est donc une **succession causale décalée**, non une correspondance point pour point.

Avec deux pics R séparés d’environ $0{,}8\ \mathrm{s}$ :

$$f_c\approx\frac{60}{0{,}8}=75\ \mathrm{bpm}$$

Si des ondes P régulières apparaissent à une fréquence supérieure à des complexes QRS réguliers, sans intervalle PR fixe, on soupçonne un bloc AV complet. Le nœud sinusal continue d’entraîner les atria tandis qu’un pacemaker d’échappement entraîne les ventricules.

## Dossier 3 — annoter le système cardionecteur

L’exercice 1 demande de placer nœud sinusal, nœud atrioventriculaire, faisceau de His et réseau de Purkinje. On complète la voie en ajoutant les branches droite et gauche. La règle de trajet est :

$$SA\rightarrow\text{atria}\rightarrow AV\rightarrow His\rightarrow\text{branches}\rightarrow Purkinje$$

Le signal électrique précède l’augmentation de tension myocardique. Une anomalie de conduction modifie donc l’ECG avant de modifier l’efficacité mécanique.

## Dossier 4 — expliquer une réponse réflexe

L’exercice 3 compare section et stimulation du nerf X — le vague — et du nerf de Cyon. Le vague est efférent cardio-inhibiteur : stimuler son bout périphérique relié au cœur ralentit directement le pacemaker et la conduction AV. Le nerf de Cyon est afférent : stimuler son bout central relié au bulbe mime une hausse de pression aortique et déclenche un ralentissement réflexe.

La correction complète des annotations de la figure est : **A = nerf X ou vague**, **C = nerf de Cyon**, **B = nerf de Hering**, **1 = sinus carotidien**, **2 = voie orthosympathique cardiaque**, **3 = ganglion étoilé**. Les repères A et C sont déjà nommés dans l’énoncé ; B relie le sinus carotidien au bulbe, tandis que la voie sympathique descend depuis la région médullaire et relaie par le ganglion étoilé avant le cœur.

Dans un scénario où la pression chute brutalement, la décharge baroréceptrice baisse, le tonus vagal diminue et le sympathique augmente. Fréquence, contractilité et vasoconstriction progressent pour soutenir la pression. Cette réponse ne signifie pas que le sympathique a créé l’automatisme.

## Réponse modèle

« Le tracé électrique précède le tracé mécanique : P annonce la systole atriale, QRS annonce la systole ventriculaire et T reflète la repolarisation avant la relaxation. Le délai vient du couplage Ca²⁺–contraction. La pression dépend ensuite des valves et des gradients. Le rythme naît dans le nœud sinusal, gagne le nœud AV, His et Purkinje ; les nerfs vague et sympathique ainsi que le baroréflexe le modulent. »

> **Précision finale.** Les quatre événements mécaniques proposés dans l’exercice 2 ne peuvent pas être mis en bijection stricte avec seulement P, QRS et T. La diastole générale est une période mécanique qui suit la repolarisation ; ce n’est pas une quatrième onde ECG.

> **Astuce mémoire — E-M-R :** **É**lectricité, puis **M**écanique, le tout ajusté par la **R**égulation.
`,
    keyPoint: "Identifier les axes, décrire séparément ECG et pression, puis les relier par le délai électromécanique avant d’intégrer conduction et baroréflexe.",
    example: "QRS précède la hausse de pression ; des P et QRS indépendants indiquent une dissociation AV, tandis qu’une stimulation centrale de Cyon déclenche une bradycardie réflexe.",
    methodSteps: [
      "Identifie les tracés et leurs unités sans interprétation prématurée.",
      "Décris les phases de pression puis les ondes électriques séparément.",
      "Superpose-les en respectant le délai excitation-contraction.",
      "Termine par le trajet cardionecteur et la boucle autonome adaptée au scénario.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Tableau de bord original",
      title: "Relier ECG, pression et conduction",
      instruction: "Sélectionne les six repères, puis raconte un cycle complet avec un vocabulaire électrique et mécanique distinct.",
      viewBox: "0 0 1000 390",
      caption: "Synthèse pédagogique originale inspirée de la situation d’évaluation des pages 11-12 ; aucun tracé scanné n’est republié.",
      shapes: missionShapes,
      hotspots: missionHotspots,
      observation: "Le délai entre QRS et la montée de pression matérialise le couplage excitation-contraction ; il ne faut jamais aligner les deux phénomènes comme s’ils étaient identiques.",
    },
    questions: [
      choice("Comment identifier le tracé A de la situation officielle ?", ["Comme une pression intraventriculaire", "Comme un électrocardiogramme de surface", "Comme un cardiogramme mécanique sans unité", "Comme un débit artériel"], 0, "L’axe vertical est gradué en kPa.", "Situation d’évaluation • page 11", 2),
      choice("Quel événement électrique précède la montée de pression ventriculaire ?", ["L’onde P seule", "Le complexe QRS", "L’intervalle RR seul", "Le silence électrique"], 1, "QRS dépolarise les ventricules avant leur contraction.", "Superposition • page 11", 2),
      choice("Quelle structure retarde normalement la conduction entre atria et ventricules ?", ["La valve pulmonaire", "Le nerf de Cyon", "Le nœud AV", "L’aorte"], 2, "Le délai AV permet la coordination du remplissage.", "Exercice 1 • page 11"),
      choice("Quel profil évoque un bloc AV complet ?", ["Un seul QRS après chaque P avec PR fixe", "Aucune onde P", "Une tachycardie toujours sinusale", "Des P et QRS réguliers mais indépendants"], 3, "La dissociation révèle deux pacemakers.", "Analyse du bloc AV", 2),
      trueFalse("La diastole générale possède sa propre onde ECG distincte après T.", false, "La diastole est une période mécanique, pas une onde électrique supplémentaire.", "Exercice 2 • page 12"),
      choice("Quel trajet du système cardionecteur est correct ?", ["Sinusal → AV → His → Purkinje", "AV → sinusal → Purkinje → His", "Sinusal → Purkinje → AV → His", "His → sinusal → AV → Purkinje"], 0, "On ajoute le myocarde atrial et les branches pour le trajet complet."),
      choice("Après section du vague, quel bout stimulé ralentit directement le cœur ?", ["Le bout central séparé du cœur", "Le bout périphérique relié au cœur", "Le nerf de Hering non sectionné", "Aucun dans toute préparation"], 1, "Le message efférent doit atteindre l’organe.", "Exercice 3 • page 12"),
      choice("Après section de Cyon, quel bout stimulé déclenche le réflexe central ?", ["Le bout périphérique seulement", "Le myocarde", "Le bout central relié au bulbe", "La valve mitrale"], 2, "Cyon est afférent : la stimulation doit atteindre le centre."),
      choice("Quelle réponse accompagne une chute de pression ?", ["Vague augmenté, sympathique diminué", "Vague et sympathique augmentés", "Vague et sympathique diminués", "Vague diminué, sympathique augmenté"], 3, "La réponse soutient débit et résistances."),
      choice("Si deux R sont espacés de 0,8 s, quelle fréquence est la plus proche ?", ["75 bpm", "48 bpm", "60 bpm", "100 bpm"], 0, "$60/0{,}8=75$ bpm.", "Échelle temporelle • page 11"),
      short("Nomme l’onde de repolarisation ventriculaire.", ["onde T", "T", "l’onde T"], "L’onde T traduit la repolarisation ventriculaire.", "ECG • pages 11-12"),
      short("Nomme le nerf afférent issu de la crosse aortique utilisé dans l’exercice.", ["nerf de Cyon", "Cyon", "le nerf de Cyon"], "Le nerf de Cyon transporte l’information baroréceptrice aortique vers le bulbe.", "Exercice 3 • page 12"),
    ],
    corrections: [
      "Les tracés de pression et d’ECG sont reliés par un délai électromécanique et non superposés comme des phénomènes identiques.",
      "La diastole générale n’est pas transformée en quatrième onde ECG ; l’exercice de correspondance strictement biunivoque est explicitement corrigé.",
      "Les effets de la stimulation des bouts central et périphérique sont distingués selon le caractère afférent de Cyon et efférent du vague.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalDSvtHeartPath: LearningPath = {
  id: "terminale-d-svt-l4-heart",
  subjectId: "svt",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "La communication dans l’organisme" },
  chapterNumber: 4,
  title: "Le fonctionnement du cœur",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, de l’automatisme cardiaque au baroréflexe et à la médiation chimique, avec tracés et schémas originaux ainsi que des corrections scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Démontrer l’automatisme cardiaque et suivre le système cardionecteur",
    "Comparer potentiels pacemaker et ventriculaire puis décrire le cycle mécanique",
    "Interpréter ECG, pression, nerfs cardiaques et baroréflexe sino-aortique",
    "Expliquer l’expérience de Loewi et relier médiateurs, récepteurs et effets",
  ],
  modules: [
    {
      id: "heart-function-mastery",
      title: "Maîtriser le fonctionnement du cœur",
      description: "Dix niveaux progressifs, de l’automatisme intrinsèque à la mission intégrée ECG–pression–régulation.",
      lessons: builtLevels,
    },
  ],
};
