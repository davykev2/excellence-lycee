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

const sourceDocument = "SVT Tle C_L3_La production dénergie par la cellule.pdf";

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
      introduction: "Décris d’abord les résultats, relie-les au mécanisme cellulaire, puis rédige une conclusion qui répond exactement au problème.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : une observation décrit ce que montre le document ; une interprétation explique pourquoi.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const mitochondrionShapes: SchemaShape[] = [
  { shape: "path", d: "M95 210 C95 95 205 55 390 62 C575 70 665 118 665 210 C665 307 570 355 385 360 C205 365 95 325 95 210 Z", tone: "soft" },
  { shape: "path", d: "M120 210 C120 112 215 84 390 88 C555 92 635 128 635 210 C635 292 550 327 385 332 C220 337 120 307 120 210 Z", tone: "outline" },
  { shape: "path", d: "M185 91 C180 130 185 170 230 178 C270 185 275 228 238 247 C205 264 205 306 235 330", tone: "outline" },
  { shape: "path", d: "M320 88 C315 132 320 163 360 177 C398 190 400 225 365 242 C330 260 332 298 360 331", tone: "outline" },
  { shape: "path", d: "M470 91 C465 130 472 165 515 180 C552 193 550 230 518 247 C485 265 487 302 515 326", tone: "outline" },
  { shape: "circle", cx: 195, cy: 230, r: 5, tone: "accent" },
  { shape: "circle", cx: 274, cy: 125, r: 5, tone: "accent" },
  { shape: "circle", cx: 405, cy: 283, r: 5, tone: "accent" },
  { shape: "circle", cx: 555, cy: 146, r: 5, tone: "accent" },
  { shape: "path", d: "M430 205 C450 180 486 178 510 205 C488 232 451 232 430 205 Z", tone: "muted" },
  { shape: "text", x: 380, y: 405, content: "Mitochondrie : compartiments et fonctions", anchor: "middle" },
];

const mitochondrionHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "outer", number: 1, label: "Membrane externe", x: 645, y: 118, detail: "Elle délimite l’organite et laisse passer de petites molécules grâce à des protéines de transport.", highlight: [{ shape: "path", d: "M95 210 C95 95 205 55 390 62 C575 70 665 118 665 210 C665 307 570 355 385 360 C205 365 95 325 95 210 Z", tone: "accent" }] },
  { id: "inner", number: 2, label: "Membrane interne", x: 615, y: 270, detail: "Elle porte la chaîne de transport d’électrons et l’ATP synthase. Le dioxygène y intervient comme accepteur final d’électrons.", highlight: [{ shape: "path", d: "M120 210 C120 112 215 84 390 88 C555 92 635 128 635 210 C635 292 550 327 385 332 C220 337 120 307 120 210 Z", tone: "accent" }] },
  { id: "crista", number: 3, label: "Crêtes", x: 360, y: 177, detail: "Les replis de la membrane interne augmentent la surface disponible pour la phosphorylation oxydative.", highlight: [{ shape: "path", d: "M320 88 C315 132 320 163 360 177 C398 190 400 225 365 242 C330 260 332 298 360 331", tone: "accent" }] },
  { id: "matrix", number: 4, label: "Matrice", x: 420, y: 255, detail: "La matrice contient notamment les enzymes de l’oxydation du pyruvate et du cycle de Krebs.", highlight: [{ shape: "ellipse", cx: 430, cy: 250, rx: 150, ry: 65, tone: "accent" }] },
  { id: "space", number: 5, label: "Espace intermembranaire", x: 110, y: 165, detail: "Les protons y sont accumulés par la chaîne respiratoire ; leur retour vers la matrice alimente l’ATP synthase." },
  { id: "dna", number: 6, label: "ADN mitochondrial", x: 470, y: 205, detail: "La mitochondrie possède son propre ADN circulaire, visible ici sous forme d’une boucle schématique.", highlight: [{ shape: "path", d: "M430 205 C450 180 486 178 510 205 C488 232 451 232 430 205 Z", tone: "accent" }] },
  { id: "ribosome", number: 7, label: "Ribosomes", x: 274, y: 125, detail: "Des ribosomes mitochondriaux participent à la synthèse d’une partie des protéines de l’organite.", highlight: [{ shape: "circle", cx: 274, cy: 125, r: 12, tone: "accent" }] },
];

const levels: LevelSeed[] = [
  {
    id: "aerobic-respiration-experiment",
    title: "Mettre en évidence la respiration cellulaire",
    summary: "Exploiter l’expérience EXAO sur des levures alimentées en glucose en présence de dioxygène.",
    pages: "1-3",
    section: "Production d’énergie en présence d’oxygène",
    durationMinutes: 25,
    xp: 45,
    body: `
## 1. Le problème expérimental

Le document place des levures dans une enceinte aérée. Une sonde oxymétrique mesure la proportion de dioxygène tandis qu’un agitateur homogénéise le milieu. Pendant la première minute, les levures sont présentes mais **aucun glucose n’est encore ajouté**. À la minute 1, on injecte 2 mL d’une solution de glucose à 50 g/L.

Le montage comporte donc deux phases comparables :

| Temps | Condition | Résultat lu sur la courbe |
|---|---|---|
| de 0 à 1 min | levures sans glucose ajouté | dioxygène voisin de 23 %, presque stable |
| après 1 min | levures + glucose | diminution rapide jusqu’à environ 0 % vers 2,7 min |

Le glucose est la variable déclenchante. La baisse du dioxygène après son ajout indique que les cellules utilisent simultanément un **substrat organique** et du dioxygène.

## 2. De la donnée à la conclusion

- **Observation :** le taux de dioxygène reste stable avant l’ajout, puis diminue.
- **Analyse :** la consommation de dioxygène débute lorsque le glucose est disponible.
- **Interprétation :** les levures oxydent le glucose en milieu aérobie.
- **Conclusion :** la respiration cellulaire produit de l’ATP grâce à la dégradation complète du glucose.

L’équation-bilan simplifiée est :

$$\\mathrm{C_6H_{12}O_6 + 6\\,O_2 \\longrightarrow 6\\,CO_2 + 6\\,H_2O} + \\text{énergie}$$

Une partie de l’énergie libérée est transférée à l’ATP ; une autre est dissipée sous forme de chaleur. L’ATP n’est donc pas un atome ajouté à l’équation chimique : c’est le produit d’un couplage énergétique avec la phosphorylation de l’ADP.

> **Astuce mémoire — R comme Respiration et Rendement :** avec du dioxygène, l’oxydation du glucose peut être complète et fournit beaucoup plus d’ATP qu’une fermentation.

> **Précision :** le dioxygène n’est pas consommé directement par le cycle de Krebs. Il reçoit les électrons à la fin de la chaîne respiratoire, dans la membrane interne mitochondriale.
`,
    keyPoint: "Après l’ajout de glucose, la consommation de dioxygène révèle une respiration cellulaire aérobie.",
    example: "Avant 1 min : environ 23 % de dioxygène ; après l’ajout : chute jusqu’à 0 % vers 2,7 min. La variable qui déclenche la consommation est le glucose.",
    methodSteps: [
      "Identifie l’organisme, la sonde, la variable ajoutée et le témoin temporel.",
      "Décris séparément la phase avant et la phase après l’ajout.",
      "Associe la baisse du dioxygène à sa consommation par les cellules.",
      "Conclue en nommant la respiration, le glucose et la production d’ATP.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Expérience EXAO redessinée",
      title: "Suivre le dioxygène après l’ajout de glucose",
      instruction: "Déplace le point mobile et compare la phase témoin à la phase de consommation.",
      formula: "Dioxygène du milieu (%)",
      rule: { kind: "samples", points: [[0, 23], [0.5, 23], [1, 22.8], [1.25, 20], [1.6, 15.5], [2, 10], [2.35, 5], [2.7, 0.5], [3.2, 0.4]] },
      window: { xMin: 0, xMax: 3.2, yMin: 0, yMax: 25 },
      guides: [{ kind: "vertical", value: 1, label: "ajout du glucose" }],
      marker: { min: 0, max: 3.2, step: 0.1, initial: 1 },
      observation: "Les points reproduisent la tendance et les valeurs lisibles du document : plateau initial proche de 23 %, puis chute rapide après l’injection.",
    },
    questions: [
      choice("Quelle grandeur mesure la sonde du montage ?", ["La quantité de dioxygène", "La masse des levures", "La concentration d’éthanol", "La quantité d’ADN"], 0, "La sonde oxymétrique suit le dioxygène du milieu.", "Dispositif EXAO • pages 1-2"),
      choice("À quel moment le glucose est-il ajouté ?", ["À 2,7 min", "À 1 min", "À 12 min", "À 0 min"], 1, "La flèche du document indique une injection à la minute 1.", "Courbe • page 2"),
      choice("Que vaut approximativement le dioxygène avant l’ajout ?", ["0 %", "50 %", "23 %", "2 %"], 2, "Le plateau initial est proche de 23 %.", "Analyse • pages 2-3"),
      choice("Quel résultat suit l’ajout du glucose ?", ["Une hausse immédiate du dioxygène", "Une stabilité absolue", "Une disparition des levures", "Une baisse rapide du dioxygène"], 3, "Le dioxygène est consommé après l’apport du substrat.", "Analyse • page 3"),
      trueFalse("La phase de 0 à 1 minute sert de référence avant l’ajout du glucose.", true, "Elle montre le comportement du milieu avant la variable déclenchante.", "Protocole • pages 1-2"),
      choice("Quel mot désigne la voie mise en évidence ?", ["Respiration cellulaire", "Photosynthèse", "Fermentation lactique", "Digestion extracellulaire"], 0, "Le glucose est oxydé en présence de dioxygène."),
      choice("Quels produits carboné et hydrogéné figurent dans l’équation-bilan ?", ["O₂ et ATP", "CO₂ et H₂O", "Éthanol et lactate", "NADH et ADN"], 1, "L’oxydation complète forme du dioxyde de carbone et de l’eau."),
      choice("Quelle phrase est une observation ?", ["La respiration produit de l’ATP", "Le glucose est oxydé", "Le dioxygène passe d’environ 23 % à presque 0 %", "La chaîne respiratoire accepte les électrons"], 2, "Une observation décrit les valeurs sans proposer de mécanisme."),
      choice("Où le dioxygène est-il directement réduit en eau ?", ["Dans le noyau", "Dans le cycle de Krebs", "Dans le cytosol", "À la fin de la chaîne respiratoire"], 3, "Il est l’accepteur final d’électrons de la chaîne respiratoire."),
      short("Écris le nom du substrat ajouté à la minute 1.", ["glucose", "le glucose"], "Le glucose fournit le carbone et les électrons nécessaires à la respiration.", "Protocole • page 1"),
    ],
    corrections: [
      "Le fichier transmis est classé L3 dans la progression globale, bien que sa page de garde affiche « Leçon 2 » à l’intérieur du thème 1 ; la plateforme suit la numérotation globale des fichiers fournis.",
      "L’équation du PDF est reformulée comme bilan chimique et énergétique : l’ATP n’est pas ajouté comme un produit stœchiométrique non quantifié.",
      "La consommation directe du dioxygène est située à la chaîne respiratoire et non au cycle de Krebs.",
      "La courbe interactive reprend des valeurs approximatives, car le graphique source ne fournit pas une table numérique complète.",
    ],
  },
  {
    id: "anaerobic-fermentation-experiment",
    title: "Caractériser la fermentation alcoolique",
    summary: "Relier les tests à l’eau de chaux, au dichromate et à la température aux produits de la fermentation des levures.",
    pages: "3-5 et 14-15",
    section: "Production d’énergie en absence d’oxygène et exercice à trous",
    durationMinutes: 27,
    xp: 55,
    body: `
## 1. Un milieu privé de dioxygène

Le flacon contient des levures et du glucose. Il est fermé afin d’empêcher l’entrée d’air. Trois indices sont recherchés : le gaz libéré passe dans de l’eau de chaux, un prélèvement est testé au dichromate de potassium et un thermomètre suit la température.

| Résultat | Ce qu’il met en évidence |
|---|---|
| l’eau de chaux se trouble | présence de $\\mathrm{CO_2}$ |
| le dichromate acidifié change de couleur | présence d’un composé réducteur ; dans le contexte, de l’éthanol |
| la température augmente légèrement | une partie de l’énergie est dissipée sous forme de chaleur |

Les levures ont donc transformé le glucose sans dioxygène en éthanol et dioxyde de carbone. Cette voie est la **fermentation alcoolique**.

## 2. Une dégradation partielle

Le carbone du glucose n’est pas entièrement oxydé en $\\mathrm{CO_2}$ : une grande partie reste dans l’éthanol. Ce résidu organique conserve donc beaucoup d’énergie chimique. Le rendement en ATP est faible.

L’équation-bilan correctement équilibrée est :

$$\\mathrm{C_6H_{12}O_6 \\longrightarrow 2\\,C_2H_5OH + 2\\,CO_2}$$

Le gain énergétique net associé est de **2 ATP par glucose**, produits pendant la glycolyse :

$$\\mathrm{glucose \\longrightarrow 2\\,pyruvates + 2\\,ATP\\ (nets)}$$

La fermentation transforme ensuite les pyruvates et régénère le $\\mathrm{NAD^+}$ nécessaire à la poursuite de la glycolyse. Elle ne crée pas une réserve supplémentaire massive d’ATP.

## 3. Les mots de l’exercice officiel

Le texte à trous des pages 4-5 et 14-15 impose la chaîne logique suivante : **fermentation → glycolyse → 6 atomes de carbone → deux acides pyruviques → résidus → dégradation partielle → fermentation alcoolique → “acétique” → peu d’énergie**.

> **Précision scientifique :** la production de vinaigre par les bactéries acétiques correspond surtout à l’oxydation aérobie de l’éthanol en acide acétique. Elle ne doit pas être présentée comme une voie anaérobie équivalente à la fermentation alcoolique.

> **Astuce mémoire — F comme Fermentation, Faible et Fractionnée :** sans dioxygène, le glucose est partiellement dégradé et le gain reste faible : 2 ATP.
`,
    keyPoint: "La fermentation alcoolique dégrade partiellement le glucose en éthanol et CO₂ et ne fournit que 2 ATP nets par glucose.",
    example: "Eau de chaux troublée + test compatible avec l’éthanol + échauffement : les levures fermentent le glucose et libèrent CO₂, éthanol et chaleur.",
    methodSteps: [
      "Vérifie que le montage empêche le renouvellement du dioxygène.",
      "Associe chaque test à la substance qu’il révèle.",
      "Distingue produits chimiques et énergie transférée à l’ATP.",
      "Conclue en précisant dégradation partielle, milieu anaérobie et faible rendement.",
    ],
    interaction: diagram(
      "Explorer le montage de fermentation",
      "Sélectionne chaque élément et relie-le à l’indice expérimental attendu.",
      "Levures + glucose sans renouvellement d’air",
      "Le flacon fermé impose un milieu pauvre en dioxygène. Les résultats combinés identifient la fermentation alcoolique.",
      [
        { id: "flask", label: "Flacon fermé", role: "Condition anaérobie", detail: "L’absence de renouvellement d’air limite fortement la disponibilité du dioxygène." },
        { id: "limewater", label: "Eau de chaux", role: "Détecteur de CO₂", detail: "Elle se trouble en présence du dioxyde de carbone dégagé." },
        { id: "dichromate", label: "Dichromate acidifié", role: "Indice d’éthanol", detail: "Le changement de couleur révèle un composé réducteur ; dans cette expérience de levures, il appuie la présence d’éthanol." },
        { id: "thermometer", label: "Thermomètre", role: "Chaleur libérée", detail: "La légère hausse de température montre qu’une partie de l’énergie chimique est dissipée sous forme thermique." },
        { id: "atp", label: "ATP", role: "2 ATP nets", detail: "Le faible gain d’ATP provient de la glycolyse ; la fermentation régénère surtout le NAD⁺." },
      ],
      "Aucun indice isolé ne suffit aussi bien que leur convergence : CO₂ + éthanol + chaleur dans un milieu privé de dioxygène.",
    ),
    questions: [
      choice("Pourquoi le flacon est-il complètement fermé ?", ["Pour empêcher le renouvellement du dioxygène", "Pour ajouter de la lumière", "Pour refroidir les levures", "Pour produire du glucose"], 0, "Le montage cherche une condition anaérobie.", "Protocole • page 3"),
      choice("Que révèle l’eau de chaux troublée ?", ["Du dioxygène", "Du dioxyde de carbone", "Du glucose", "Du NADH"], 1, "Le CO₂ trouble l’eau de chaux.", "Résultats • page 4"),
      choice("Quel produit organique est formé par les levures ?", ["Acide citrique", "Eau", "Éthanol", "Oxygène"], 2, "La fermentation alcoolique forme de l’éthanol.", "Analyse • page 4"),
      choice("Quel type de dégradation subit le glucose ?", ["Une synthèse", "Une dégradation totale", "Aucune transformation", "Une dégradation partielle"], 3, "L’éthanol conserve encore une partie de l’énergie du glucose."),
      trueFalse("La fermentation alcoolique nécessite un apport continu de dioxygène.", false, "Elle est utilisée quand le dioxygène est absent ou très limité.", "Conclusion partielle • page 4"),
      choice("Combien d’ATP nets la glycolyse fournit-elle par glucose ?", ["2", "38", "0", "100"], 0, "Le gain net de la glycolyse est de 2 ATP."),
      choice("Quelle molécule doit être régénérée pour que la glycolyse continue ?", ["ADN", "NAD⁺", "O₂", "CO₂"], 1, "La fermentation réoxyde le NADH en NAD⁺."),
      choice("Quel coefficient manque devant l’éthanol dans l’équation du PDF ?", ["6", "1", "2", "4"], 2, "Un glucose à six carbones forme deux éthanols à deux carbones et deux CO₂."),
      choice("Quelle association résume le mieux la fermentation ?", ["Totale–fort rendement", "Aérobie–38 ATP", "Mitochondrie–O₂", "Partielle–faible rendement"], 3, "La fermentation laisse un résidu organique et produit peu d’ATP."),
      short("Complète : la fermentation commence par la …", ["glycolyse", "la glycolyse"], "La glycolyse scinde le glucose en deux pyruvates.", "Activité d’application • pages 4-5"),
      short("Nomme le gaz dégagé lors de la fermentation alcoolique.", ["dioxyde de carbone", "CO2", "CO₂", "le dioxyde de carbone"], "Le CO₂ est identifié par l’eau de chaux.", "Expérience • pages 3-4"),
    ],
    corrections: [
      "L’équation de fermentation alcoolique est équilibrée avec 2 éthanols et 2 CO₂ ; ces coefficients manquent dans le PDF.",
      "Le rôle de la fermentation est précisé : elle régénère le NAD⁺ et les 2 ATP nets proviennent de la glycolyse.",
      "La fermentation dite acétique du texte à trous est distinguée de l’oxydation aérobie de l’éthanol par les bactéries acétiques.",
      "Le test au dichromate est présenté comme un indice contextuel et non comme une preuve absolument spécifique de l’éthanol.",
    ],
  },
  {
    id: "respiration-fermentation-comparison",
    title: "Comparer respiration et fermentation",
    summary: "Construire un tableau comparatif fiable sans confondre condition, localisation, vitesse et rendement.",
    pages: "4-5, 9 et 14-17",
    section: "Conclusions, tableau comparatif et exercices 1-2",
    durationMinutes: 24,
    xp: 60,
    body: `
## 1. Deux voies qui commencent de la même façon

La respiration et la fermentation commencent toutes deux par la **glycolyse dans le cytosol**. Une molécule de glucose à six carbones donne deux molécules de pyruvate à trois carbones et un gain net de 2 ATP.

Le destin du pyruvate dépend ensuite du fonctionnement cellulaire et de la disponibilité du dioxygène :

| Caractéristique | Respiration cellulaire | Fermentation alcoolique |
|---|---|---|
| dioxygène | disponible | absent ou très limité |
| dégradation du glucose | complète | partielle |
| localisation | glycolyse dans le cytosol, suite dans la mitochondrie | cytosol |
| produits finaux carbonés | $\\mathrm{CO_2}$ | éthanol + $\\mathrm{CO_2}$ |
| gain d’ATP retenu par le document | 38 ATP | 2 ATP |
| ordre de grandeur moderne chez l’eucaryote | souvent environ 30 à 32 ATP | 2 ATP |
| rapidité immédiate indiquée dans le cours | plus lente | rapide |
| rendement énergétique | élevé | faible |

## 2. Rendement et puissance ne sont pas synonymes

Une voie peut produire beaucoup d’ATP par molécule de glucose mais ne pas fournir l’ATP aussi rapidement dans toutes les situations. Le **rendement** compare la quantité d’énergie récupérée par glucose ; la **puissance** décrit une vitesse de production. Le tableau du PDF oppose « peu rapide » et « rapide » : cette comparaison doit rester liée aux conditions et au type de cellule.

## 3. Deux modèles de bilan

Le document utilise le modèle scolaire historique :

$$\\mathrm{respiration : 38\\ ATP \\quad ; \\quad fermentation : 2\\ ATP}$$

Les estimations biochimiques modernes utilisent des rapports proches de 2,5 ATP par NADH mitochondrial et 1,5 ATP par $\\mathrm{FADH_2}$, d’où un bilan souvent voisin de 30 à 32 ATP chez les cellules eucaryotes.

> **Repère d’évaluation :** si la question cite explicitement le tableau officiel de ce cours, restitue **38 ATP contre 2 ATP**, puis ajoute si le format le permet que 38 est un modèle conventionnel ancien.

> **Astuce mémoire :** Respiration = **R**endement élevé ; Fermentation = **F**aible rendement, mais production rapide selon le tableau du cours.
`,
    keyPoint: "Les deux voies partagent la glycolyse ; la respiration poursuit l’oxydation dans la mitochondrie, la fermentation reste cytosolique et ne fournit que 2 ATP.",
    example: "Pour compléter le tableau : respiration = complète, aérobie, cytosol + mitochondrie, rendement élevé ; fermentation = partielle, anaérobie, cytosol, 2 ATP.",
    methodSteps: [
      "Commence par le point commun : la glycolyse cytosolique.",
      "Compare ensuite la condition de dioxygène et le destin du pyruvate.",
      "Distingue soigneusement localisation, produits, rendement et rapidité.",
      "Indique le modèle de bilan demandé sans masquer la précision scientifique moderne.",
    ],
    interaction: diagram(
      "Choisir le destin du pyruvate",
      "Explore les deux branches et reconstruis le tableau de comparaison.",
      "Glucose → glycolyse → 2 pyruvates + 2 ATP nets",
      "La glycolyse est le tronc commun cytosolique. Les voies divergent ensuite.",
      [
        { id: "respiration", label: "Respiration", role: "Avec dioxygène", detail: "Oxydation complète : pyruvate, cycle de Krebs, chaîne respiratoire, CO₂, H₂O et rendement élevé." },
        { id: "fermentation", label: "Fermentation alcoolique", role: "Sans dioxygène", detail: "Transformation cytosolique du pyruvate en éthanol et CO₂, régénération du NAD⁺ et 2 ATP nets au total." },
        { id: "school-yield", label: "Modèle scolaire", role: "38 contre 2 ATP", detail: "C’est la comparaison chiffrée du document officiel et celle attendue dans ses exercices." },
        { id: "modern-yield", label: "Précision moderne", role: "≈ 30–32 contre 2 ATP", detail: "Le rendement respiratoire eucaryote moderne tient compte des rapports P/O et des navettes du NADH cytosolique." },
      ],
      "Ne fais pas partir la respiration directement dans la mitochondrie : sa première étape, la glycolyse, se déroule elle aussi dans le cytosol.",
    ),
    questions: [
      choice("Quelle étape est commune aux deux voies ?", ["La glycolyse", "Le cycle de Krebs", "La chaîne respiratoire", "La synthèse d’ADN"], 0, "Les deux voies commencent par la glycolyse cytosolique."),
      choice("Où se déroule la fermentation alcoolique ?", ["Dans le noyau", "Dans le cytosol", "Dans les crêtes uniquement", "Dans le sang"], 1, "Les réactions fermentaires sont cytosoliques.", "Tableau • pages 9 et 17"),
      choice("Quel état de dégradation correspond à la respiration ?", ["Absent", "Partiel", "Complet", "Réversible seulement"], 2, "Le glucose est complètement oxydé en CO₂ et H₂O."),
      choice("Quel gain le tableau officiel attribue-t-il à la fermentation ?", ["30 ATP", "38 ATP", "0 ATP", "2 ATP"], 3, "Le gain net vient de la glycolyse.", "Tableau • page 17"),
      trueFalse("La respiration se déroule entièrement dans la mitochondrie.", false, "La glycolyse, première étape, se déroule dans le cytosol."),
      choice("Quel produit conserve encore beaucoup d’énergie après fermentation alcoolique ?", ["L’éthanol", "L’eau", "Le dioxygène", "Le phosphate"], 0, "L’éthanol est un résidu organique encore énergétique."),
      choice("Quel bilan moderne est généralement retenu chez l’eucaryote ?", ["2 ATP", "Environ 30 à 32 ATP", "100 ATP", "Aucun ATP"], 1, "Les rapports P/O modernes donnent un ordre de grandeur de 30–32 ATP."),
      choice("Que compare le rendement énergétique ?", ["La couleur des cellules", "Le nombre de noyaux", "L’énergie récupérée par quantité de substrat", "La durée du cours"], 2, "Le rendement porte sur la fraction d’énergie utilement transférée."),
      choice("Quelle voie est indiquée comme rapide dans le tableau du PDF ?", ["La respiration", "La photosynthèse", "Le cycle cellulaire", "La fermentation"], 3, "Le document associe fermentation et production rapide d’ATP.", "Tableau • pages 9 et 17"),
      short("Donne le nombre d’ATP attribué à la respiration dans le modèle scolaire du PDF.", ["38", "38 ATP", "38 atp"], "Le modèle historique du document retient 38 ATP.", "Tableau officiel • pages 9 et 17"),
    ],
    corrections: [
      "La localisation de la respiration est précisée : glycolyse cytosolique, puis étapes mitochondriales, et non mitochondrie seule.",
      "Le bilan de 38 ATP et les rendements de 3 ATP/NADH et 2 ATP/FADH₂ sont signalés comme un modèle scolaire ancien ; l’ordre de grandeur moderne est indiqué.",
      "La rapidité est présentée comme une propriété dépendante des conditions, afin de ne pas transformer le tableau simplifié en règle absolue.",
    ],
  },
  {
    id: "mitochondrion-evidence-structure",
    title: "Relier la mitochondrie à la respiration",
    summary: "Interpréter les levures aérobies et anaérobies puis maîtriser l’ultrastructure de la mitochondrie.",
    pages: "5-7 et 16",
    section: "Structure spécialisée et annotation de la mitochondrie",
    durationMinutes: 28,
    xp: 65,
    body: `
## 1. L’expérience comparative du document

Deux cultures de levures reçoivent régulièrement du glucose pendant une semaine. La culture A est aérée ; la culture B est pauvre en dioxygène. Les micrographies montrent de nombreuses mitochondries bien développées dans A et peu de structures mitochondriales visibles dans B.

La variable étudiée est donc la disponibilité du dioxygène. L’association entre milieu aérobie et développement mitochondrial appuie le rôle des mitochondries dans la respiration. Elle ne signifie pas que le glucose est absent de la culture B : les deux cultures en reçoivent.

> **Limite expérimentale :** une image seule établit une corrélation. Pour conclure plus solidement, il faudrait compter les mitochondries sur plusieurs cellules, mesurer leur activité respiratoire et répéter l’expérience.

## 2. Une organisation en compartiments

La mitochondrie est entourée de deux membranes :

- la **membrane externe** délimite l’organite ;
- la **membrane interne**, repliée en **crêtes**, porte la chaîne respiratoire et l’ATP synthase ;
- l’**espace intermembranaire** reçoit les protons pompés par la chaîne ;
- la **matrice** contient notamment les enzymes de l’oxydation du pyruvate et du cycle de Krebs ;
- l’**ADN mitochondrial** et les **ribosomes mitochondriaux** participent à une autonomie génétique partielle.

Les crêtes augmentent la surface de membrane interne disponible. Plus cette surface est grande, plus la cellule peut loger de complexes respiratoires — sans que cela suffise, à lui seul, à garantir une production donnée d’ATP.

## 3. Une répartition fonctionnelle précise

| Compartiment | Processus principal dans cette leçon |
|---|---|
| cytosol hors mitochondrie | glycolyse et fermentation |
| matrice mitochondriale | oxydation du pyruvate et cycle de Krebs |
| membrane interne | chaîne d’électrons, gradient de protons, ATP synthase |
| espace intermembranaire | accumulation transitoire de protons |

> **Astuce mémoire :** **Matrice = Métabolites du cycle** ; **Membrane interne = Machines respiratoires**.
`,
    keyPoint: "La mitochondrie compartimente la respiration : cycle de Krebs dans la matrice et phosphorylation oxydative sur la membrane interne.",
    example: "Une flèche pointant le repli doit être annotée “crête”, tandis que la zone interne entourée par la membrane interne est la matrice.",
    methodSteps: [
      "Compare les cultures A et B en rappelant leur seule différence expérimentale.",
      "Évite de transformer une corrélation morphologique en preuve unique.",
      "Repère d’abord les deux membranes, puis les crêtes et la matrice.",
      "Associe chaque compartiment au mécanisme qui s’y déroule.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma original à annoter",
      title: "Explorer l’ultrastructure d’une mitochondrie",
      instruction: "Sélectionne les sept repères et associe structure, localisation et fonction.",
      viewBox: "0 0 760 430",
      caption: "Figure originale inspirée des schémas d’annotation des pages 6, 7, 11 et 16.",
      shapes: mitochondrionShapes,
      hotspots: mitochondrionHotspots,
      observation: "La membrane interne forme les crêtes ; elle sépare la matrice de l’espace intermembranaire et porte les complexes de phosphorylation oxydative.",
    },
    questions: [
      choice("Quelle culture présente le plus de mitochondries développées ?", ["La culture aérée A", "La culture anaérobie B", "Les deux sans différence", "Aucune culture"], 0, "La figure A correspond au milieu enrichi en dioxygène.", "Micrographies • pages 5-6"),
      choice("Quelle structure porte la chaîne respiratoire ?", ["La membrane externe", "La membrane interne", "Le noyau", "Le cytosquelette"], 1, "Les complexes respiratoires sont insérés dans la membrane interne."),
      choice("Où se déroule principalement le cycle de Krebs ?", ["Dans l’espace intermembranaire", "Dans le cytosol", "Dans la matrice", "Dans le lysosome"], 2, "Les enzymes du cycle se trouvent dans la matrice."),
      choice("Comment appelle-t-on un repli de la membrane interne ?", ["Ribosome", "Chromosome", "Pore nucléaire", "Crête mitochondriale"], 3, "Les crêtes augmentent la surface de membrane interne.", "Annotation • pages 6-7"),
      trueFalse("La fermentation alcoolique se déroule dans la matrice mitochondriale.", false, "Elle se déroule dans le cytosol.", "Conclusion • page 6"),
      choice("Quel compartiment accumule les protons pompés ?", ["L’espace intermembranaire", "Le nucléole", "Le réticulum", "La paroi"], 0, "Le gradient se forme entre espace intermembranaire et matrice."),
      choice("Quel élément montre une autonomie génétique partielle ?", ["Le glucose", "L’ADN mitochondrial", "L’eau de chaux", "L’éthanol"], 1, "La mitochondrie possède un génome propre."),
      choice("Pourquoi les crêtes sont-elles utiles ?", ["Elles fabriquent du glucose", "Elles ferment le cytosol", "Elles augmentent la surface de membrane interne", "Elles détruisent le dioxygène"], 2, "Une plus grande surface peut porter davantage de complexes respiratoires."),
      choice("Quelle amélioration renforcerait l’expérience A/B ?", ["Supprimer le témoin", "Changer aussi le glucose", "Observer une seule cellule", "Répéter et mesurer l’activité respiratoire"], 3, "Répétitions et mesures quantitatives renforcent l’inférence."),
      short("Nomme le compartiment interne contenant le cycle de Krebs.", ["matrice", "matrice mitochondriale", "la matrice", "la matrice mitochondriale"], "Le cycle de Krebs se déroule dans la matrice."),
    ],
    corrections: [
      "La relation entre aération et développement mitochondrial est présentée comme une corrélation expérimentale à confirmer quantitativement, non comme une preuve absolue tirée de deux images.",
      "La production d’ATP n’est pas attribuée à la mitochondrie entière sans distinction : matrice, membrane interne et espace intermembranaire sont fonctionnellement séparés.",
      "Les mitochondries de levures en condition anaérobie ne sont pas décrites comme universellement sans activité ou nécessairement atrophiées ; cette formulation du PDF est replacée dans le cadre de l’expérience.",
    ],
  },
  {
    id: "glycolysis-stage",
    title: "Suivre la glycolyse dans le cytosol",
    summary: "Comprendre le tronc commun qui transforme un glucose en deux pyruvates et fournit 2 ATP nets.",
    pages: "4-5 et 7-9",
    section: "Première étape de la dégradation du glucose",
    durationMinutes: 26,
    xp: 70,
    body: `
## 1. Une voie universelle en dix réactions

La **glycolyse** est une suite de réactions enzymatiques qui se déroule dans le cytosol. Elle ne consomme directement aucune molécule de dioxygène. Elle transforme un glucose à six carbones en deux pyruvates à trois carbones.

Pour comprendre le bilan, on distingue deux phases :

1. **Investissement :** 2 ATP sont consommés pour activer le glucose et former deux trioses phosphates.
2. **Rendement :** les deux trioses sont oxydés ; 4 ATP et 2 NADH sont produits.

Le bilan net est donc :

$$\\mathrm{1\\ glucose + 2\\ NAD^+ + 2\\ ADP + 2\\ P_i}
\\longrightarrow
\\mathrm{2\\ pyruvates + 2\\ NADH + 2\\ H^+ + 2\\ ATP + 2\\ H_2O}$$

Le nombre d’ATP formés est 4, mais 2 ont été consommés : $4-2=2$ ATP **nets**.

## 2. Pourquoi produire du NADH ?

Le $\\mathrm{NAD^+}$ capte des électrons et des protons lors de l’oxydation des trioses ; il devient du $\\mathrm{NADH}$. Pour que la glycolyse continue, le NADH doit être réoxydé en $\\mathrm{NAD^+}$ :

- avec dioxygène, ses électrons rejoignent la chaîne respiratoire ;
- sans dioxygène, une fermentation régénère le $\\mathrm{NAD^+}$.

## 3. Ce que devient le pyruvate

Le pyruvate est un carrefour : dans une respiration eucaryote, il gagne la matrice mitochondriale et est transformé en acétyl-CoA ; lors d’une fermentation alcoolique, il conduit à l’éthanol et au $\\mathrm{CO_2}$ ; dans le muscle humain en manque relatif de dioxygène, il peut conduire au lactate.

> **Astuce mémoire — 6 devient 2 × 3 :** un glucose C6 donne deux pyruvates C3. Et **4 produits − 2 dépensés = 2 ATP nets**.

> **Attention :** dire que la glycolyse est « anaérobie » signifie qu’elle n’utilise pas directement $\\mathrm{O_2}$ ; elle fonctionne aussi au début de la respiration aérobie.
`,
    keyPoint: "Glycolyse : glucose C6 → 2 pyruvates C3 + 2 ATP nets + 2 NADH, dans le cytosol.",
    example: "Deux ATP sont investis et quatre sont formés : le gain net est 2 ATP, pas 4.",
    methodSteps: [
      "Place la glycolyse dans le cytosol.",
      "Vérifie la conservation du carbone : 6 = 2 × 3.",
      "Sépare ATP consommés, ATP produits et gain net.",
      "Relie la réoxydation du NADH au destin aérobie ou fermentaire du pyruvate.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Processus à dérouler",
      title: "De l’investissement au pyruvate",
      instruction: "Parcours les étapes et reconstruis le bilan net de la glycolyse.",
      items: [
        { label: "Activation du glucose", shortLabel: "−2 ATP", detail: "La cellule investit deux ATP pour phosphoryler et réorganiser le sucre." },
        { label: "Clivage", shortLabel: "2 × C3", detail: "Le composé à six carbones est séparé en deux trioses à trois carbones." },
        { label: "Oxydation", shortLabel: "+2 NADH", detail: "Deux NAD⁺ captent des électrons et deviennent deux NADH." },
        { label: "Phosphorylation", shortLabel: "+4 ATP", detail: "Quatre ATP sont produits par phosphorylation au niveau du substrat." },
        { label: "Bilan net", shortLabel: "2 pyruvates + 2 ATP", detail: "Le gain net est de deux ATP et deux NADH pour un glucose." },
      ],
      observation: "La glycolyse fournit peu d’ATP directement, mais elle prépare le pyruvate et les électrons qui alimenteront la respiration.",
    },
    questions: [
      choice("Où se déroule la glycolyse ?", ["Dans le cytosol", "Dans le noyau", "Dans le lysosome", "Dans le sang"], 0, "La glycolyse est cytosolique."),
      choice("Combien de pyruvates obtient-on par glucose ?", ["Un", "Deux", "Six", "Trente-huit"], 1, "Un glucose C6 est séparé en deux pyruvates C3."),
      choice("Combien d’ATP sont produits avant soustraction de l’investissement ?", ["0", "2", "4", "38"], 2, "Quatre ATP sont formés pendant la phase de rendement."),
      choice("Quel est le gain net d’ATP ?", ["4", "6", "38", "2"], 3, "Quatre produits moins deux consommés donnent deux ATP nets."),
      trueFalse("La glycolyse consomme directement du dioxygène.", false, "Aucune réaction glycolytique n’utilise directement O₂."),
      choice("Quelle molécule accepte les électrons pendant la glycolyse ?", ["NAD⁺", "CO₂", "ADN", "Éthanol"], 0, "Le NAD⁺ est réduit en NADH."),
      choice("Quelle égalité vérifie le bilan carbone ?", ["6 = 3 + 2", "6 = 2 × 3", "6 = 4 × 2", "6 = 38"], 1, "Deux pyruvates à trois carbones conservent les six carbones du glucose."),
      choice("Que doit-il arriver au NADH pour que la glycolyse continue ?", ["Être transformé en ADN", "Être détruit", "Être réoxydé en NAD⁺", "Former du dioxygène"], 2, "La cellule doit régénérer le NAD⁺."),
      choice("Quel destin est propre au muscle humain en manque relatif d’oxygène ?", ["Éthanol", "Acide acétique", "Méthane", "Lactate"], 3, "Les cellules musculaires humaines peuvent régénérer le NAD⁺ par fermentation lactique."),
      short("Complète le bilan : un glucose donne deux …", ["pyruvates", "acides pyruviques", "molécules de pyruvate", "deux pyruvates"], "Les deux produits carbonés immédiats sont les pyruvates."),
      short("Quel transporteur réduit est produit pendant la glycolyse ?", ["NADH", "le NADH", "nadh"], "Le NAD⁺ capte des électrons et devient NADH."),
    ],
    corrections: [
      "L’équation de glycolyse est équilibrée avec 2 H⁺, absents de l’équation du PDF alors que son texte mentionne des protons.",
      "La distinction entre quatre ATP formés et deux ATP nets est explicitée.",
      "La glycolyse n’est pas réservée à l’anaérobiose : elle constitue aussi la première étape de la respiration.",
      "Le lactate est ajouté pour relier correctement le mécanisme aux cellules musculaires humaines de la mission finale.",
    ],
  },
  {
    id: "pyruvate-krebs-cycle",
    title: "Faire entrer le pyruvate dans le cycle de Krebs",
    summary: "Distinguer transport du pyruvate, oxydation en acétyl-CoA et fonctionnement cyclique de la matrice.",
    pages: "8-9 et 17",
    section: "Pyruvate, acétyl-CoA et cycle de Krebs",
    durationMinutes: 30,
    xp: 80,
    body: `
## 1. La réaction de liaison

Le pyruvate produit dans le cytosol est transporté vers la matrice mitochondriale. Le **complexe pyruvate-déshydrogénase** catalyse alors une décarboxylation oxydative :

$$\\mathrm{pyruvate + CoA + NAD^+ \\longrightarrow acetyl\\text{-}CoA + CO_2 + NADH + H^+}$$

Cette réaction a lieu deux fois par glucose. Le coenzyme A, abrégé CoA, est un **cofacteur transporteur de groupements acyle** ; ce n’est pas « une autre enzyme » qui fixerait seule le pyruvate.

## 2. Un cycle qui régénère son accepteur

L’acétyl-CoA apporte un groupement à deux carbones. Celui-ci se condense avec l’oxaloacétate à quatre carbones pour former un composé à six carbones. Une suite de réactions libère du $\\mathrm{CO_2}$, produit des coenzymes réduits et régénère l’oxaloacétate.

Pour un glucose, donc deux tours :

| Produit | Bilan des deux tours |
|---|---:|
| $\\mathrm{CO_2}$ | 4 |
| $\\mathrm{NADH}$ | 6 |
| $\\mathrm{FADH_2}$ | 2 |
| ATP ou GTP | 2 |

En ajoutant l’oxydation des deux pyruvates, on obtient encore 2 $\\mathrm{CO_2}$ et 2 NADH avant la chaîne respiratoire.

## 3. Le rôle énergétique réel du cycle

Le cycle de Krebs ne fabrique directement que 2 ATP/GTP par glucose. Son rôle majeur est de charger les transporteurs d’électrons NADH et $\\mathrm{FADH_2}$. Ceux-ci alimentent ensuite la chaîne respiratoire.

Le dioxygène ne participe donc pas directement à une réaction du cycle. Cependant, sans dioxygène, la chaîne respiratoire s’arrête, le NADH n’est plus efficacement réoxydé en NAD⁺ et le cycle ralentit fortement : la dépendance est **indirecte mais essentielle**.

> **Astuce mémoire — “Acétyl entre, oxaloacétate revient” :** l’acétyl-CoA apporte 2 carbones ; l’oxaloacétate C4 est régénéré, ce qui permet un nouveau tour.
`,
    keyPoint: "Le cycle de Krebs oxyde l’acétyl-CoA dans la matrice et produit surtout NADH et FADH₂, qui alimentent la chaîne respiratoire.",
    example: "Un glucose donne deux pyruvates, donc deux acétyl-CoA et deux tours de cycle : 4 CO₂, 6 NADH, 2 FADH₂ et 2 ATP/GTP dans le cycle.",
    methodSteps: [
      "Sépare la réaction de liaison du cycle proprement dit.",
      "Compte deux pyruvates et donc deux tours par glucose.",
      "Vérifie la régénération de l’oxaloacétate.",
      "Présente NADH et FADH₂ comme des transporteurs d’électrons destinés à la chaîne.",
    ],
    interaction: diagram(
      "Suivre le carbone et les électrons",
      "Sélectionne les étapes depuis le pyruvate jusqu’aux transporteurs réduits.",
      "Deux pyruvates issus d’un glucose",
      "Chaque pyruvate est converti en acétyl-CoA, puis chaque acétyl-CoA alimente un tour du cycle.",
      [
        { id: "transport", label: "Transport du pyruvate", role: "Cytosol → matrice", detail: "Le pyruvate franchit la membrane interne grâce à un transporteur spécifique." },
        { id: "pdh", label: "Complexe pyruvate-déshydrogénase", role: "Acétyl-CoA + CO₂ + NADH", detail: "Le complexe multienzymatique oxyde et décarboxyle le pyruvate ; CoA intervient comme cofacteur." },
        { id: "condensation", label: "Condensation", role: "C2 + C4 → C6", detail: "L’acétyl-CoA à deux carbones rejoint l’oxaloacétate à quatre carbones." },
        { id: "oxidations", label: "Oxydations du cycle", role: "NADH et FADH₂", detail: "Les déshydrogénations extraient des électrons et réduisent les coenzymes." },
        { id: "regeneration", label: "Régénération", role: "Retour de l’oxaloacétate", detail: "L’accepteur C4 est reformé ; le cycle peut recommencer." },
      ],
      "Le cycle est une plateforme de collecte d’électrons : la plus grande part de l’ATP viendra ensuite de la phosphorylation oxydative.",
    ),
    questions: [
      choice("Dans quel compartiment le pyruvate est-il oxydé en acétyl-CoA ?", ["La matrice mitochondriale", "Le noyau", "Le sang", "Le lysosome"], 0, "Le complexe pyruvate-déshydrogénase est matriciel chez l’eucaryote."),
      choice("Quel complexe catalyse cette transformation ?", ["ATP synthase", "Complexe pyruvate-déshydrogénase", "ADN polymérase", "Myosine"], 1, "Il réalise la décarboxylation oxydative du pyruvate."),
      choice("Quel est le statut du coenzyme A ?", ["Un sucre", "Un gaz", "Un cofacteur", "Un chromosome"], 2, "CoA transporte un groupement acyle ; ce n’est pas une enzyme."),
      choice("Combien de tours de cycle ont lieu par glucose ?", ["Un", "Six", "Trente-huit", "Deux"], 3, "Un glucose donne deux acétyl-CoA."),
      trueFalse("Le dioxygène est consommé directement dans le cycle de Krebs.", false, "Il est réduit à la fin de la chaîne respiratoire."),
      choice("Quelle molécule C4 est régénérée ?", ["L’oxaloacétate", "L’éthanol", "Le glucose", "Le lactate"], 0, "L’oxaloacétate accepte l’acétyle et réapparaît en fin de cycle."),
      choice("Combien de NADH le cycle produit-il par glucose ?", ["2", "6", "38", "0"], 1, "Trois NADH par tour, donc six par glucose."),
      choice("Combien de FADH₂ le cycle produit-il par glucose ?", ["6", "4", "2", "38"], 2, "Un FADH₂ par tour, donc deux."),
      choice("Quel est le rôle majeur du cycle ?", ["Former directement 38 ATP", "Produire du dioxygène", "Fabriquer du glucose", "Produire des transporteurs réduits"], 3, "NADH et FADH₂ apportent ensuite leurs électrons à la chaîne."),
      short("Nomme le composé C2 qui entre dans le cycle.", ["acétyl-CoA", "acetyl-CoA", "acétyl coenzyme A", "l’acétyl-CoA"], "L’acétyl-CoA condense avec l’oxaloacétate."),
      short("Quel gaz est libéré lors des décarboxylations ?", ["CO2", "CO₂", "dioxyde de carbone", "le dioxyde de carbone"], "Les carbones sont éliminés sous forme de CO₂."),
    ],
    corrections: [
      "Le coenzyme A n’est plus qualifié d’enzyme : le complexe pyruvate-déshydrogénase catalyse la formation de l’acétyl-CoA.",
      "Les carboxylases mentionnées dans le PDF sont remplacées par les catégories pertinentes de réactions du cycle, notamment déshydrogénations et décarboxylations.",
      "Le bilan du cycle est séparé de celui de la chaîne respiratoire : le cycle ne produit pas directement 32 ATP.",
      "La consommation de dioxygène est située hors du cycle, à l’extrémité de la chaîne respiratoire.",
    ],
  },
  {
    id: "respiratory-chain-atp-balance",
    title: "Expliquer la phosphorylation oxydative",
    summary: "Relier chaîne d’électrons, gradient de protons, ATP synthase, dioxygène et bilan énergétique.",
    pages: "8-9 et 17",
    section: "Schéma global de la respiration et bilan énergétique",
    durationMinutes: 30,
    xp: 85,
    body: `
## 1. Des électrons à un gradient de protons

Le NADH et le $\\mathrm{FADH_2}$ cèdent leurs électrons à des complexes de la membrane interne mitochondriale. L’énergie libérée pendant leur transfert sert à pomper des protons $\\mathrm{H^+}$ de la matrice vers l’espace intermembranaire.

Il se forme alors un **gradient électrochimique** : les protons sont plus concentrés dans l’espace intermembranaire et tendent à revenir vers la matrice.

## 2. L’ATP synthase transforme le gradient

Le retour des protons à travers l’ATP synthase fournit l’énergie nécessaire à :

$$\\mathrm{ADP + P_i \\longrightarrow ATP}$$

Ce couplage entre oxydation des coenzymes et phosphorylation de l’ADP est la **phosphorylation oxydative**. La membrane interne doit rester suffisamment imperméable aux protons ; sinon le gradient se dissipe sans synthèse efficace d’ATP.

## 3. Le rôle précis du dioxygène

À l’extrémité de la chaîne, le dioxygène accepte les électrons et des protons pour former de l’eau :

$$\\mathrm{O_2 + 4\\,e^- + 4\\,H^+ \\longrightarrow 2\\,H_2O}$$

Sans cet accepteur final, la chaîne se bloque, le NADH et le $\\mathrm{FADH_2}$ ne sont plus correctement réoxydés et la production mitochondriale d’ATP chute.

## 4. Pourquoi le bilan n’est-il pas exactement 38 ?

Le PDF utilise 3 ATP par NADH et 2 ATP par $\\mathrm{FADH_2}$, ce qui conduit au bilan conventionnel de 38 ATP. Les mesures modernes retiennent plutôt des rapports proches de :

$$\\mathrm{1\\ NADH \\approx 2{,}5\\ ATP \\quad ; \\quad 1\\ FADH_2 \\approx 1{,}5\\ ATP}$$

Le coût des transports à travers la membrane et la navette utilisée par le NADH cytosolique font varier le total. Chez une cellule eucaryote, on enseigne souvent **environ 30 à 32 ATP par glucose**.

> **Astuce mémoire — “Électrons poussent, protons reviennent, ATP apparaît” :** la chaîne pompe les protons ; l’ATP synthase exploite leur retour.
`,
    keyPoint: "Le dioxygène accepte les électrons en fin de chaîne ; le gradient de H⁺ alimente l’ATP synthase et permet l’essentiel de la production d’ATP.",
    example: "Si la membrane interne devient perméable aux H⁺, le gradient s’effondre : le transport d’électrons peut libérer de la chaleur mais l’ATP synthase produit moins d’ATP.",
    methodSteps: [
      "Place NADH et FADH₂ comme donneurs d’électrons.",
      "Relie le transfert d’électrons au pompage des protons.",
      "Fais revenir les H⁺ par l’ATP synthase vers la matrice.",
      "Termine par la réduction du dioxygène en eau et distingue modèle scolaire et bilan moderne.",
    ],
    interaction: diagram(
      "Reconstruire la phosphorylation oxydative",
      "Explore les cinq fonctions dans l’ordre du transfert d’énergie.",
      "Membrane interne mitochondriale",
      "La membrane sépare matrice et espace intermembranaire et porte la chaîne respiratoire ainsi que l’ATP synthase.",
      [
        { id: "donors", label: "NADH et FADH₂", role: "Donneurs d’électrons", detail: "Ils sont réoxydés et remettent leurs électrons à la chaîne." },
        { id: "chain", label: "Chaîne respiratoire", role: "Transfert et pompage", detail: "Le transfert exergonique des électrons alimente le pompage de H⁺." },
        { id: "gradient", label: "Gradient de H⁺", role: "Énergie potentielle", detail: "Les protons accumulés dans l’espace intermembranaire possèdent une force proton-motrice." },
        { id: "synthase", label: "ATP synthase", role: "ADP + Pi → ATP", detail: "Le retour des protons entraîne la synthèse d’ATP dans la matrice." },
        { id: "oxygen", label: "Dioxygène", role: "Accepteur final", detail: "Il reçoit les électrons en fin de chaîne et, avec des H⁺, forme de l’eau." },
      ],
      "Le cycle de Krebs fournit les transporteurs ; la chaîne et l’ATP synthase convertissent ensuite leur énergie en ATP.",
    ),
    questions: [
      choice("Où se trouve la chaîne respiratoire ?", ["Dans la membrane interne", "Dans le noyau", "Dans le cytosol", "Dans la paroi"], 0, "Les complexes respiratoires sont membranaires."),
      choice("Vers quel compartiment les protons sont-ils pompés ?", ["La matrice", "L’espace intermembranaire", "Le noyau", "Le lysosome"], 1, "Le pompage crée un gradient au-delà de la membrane interne."),
      choice("Par quelle protéine les protons reviennent-ils principalement ?", ["Myosine", "Pyruvate translocase", "ATP synthase", "Hémoglobine"], 2, "L’ATP synthase couple le flux de H⁺ à la phosphorylation de l’ADP."),
      choice("Quel est l’accepteur final des électrons ?", ["Le glucose", "Le CO₂", "Le NADH", "Le dioxygène"], 3, "O₂ est réduit en eau à l’extrémité de la chaîne."),
      trueFalse("Le cycle de Krebs produit directement la majorité des ATP de la respiration.", false, "La majorité est produite par phosphorylation oxydative."),
      choice("Quelle réaction résume la synthèse d’ATP ?", ["ADP + Pi → ATP", "ATP → glucose", "CO₂ → O₂", "ADN → NADH"], 0, "La phosphorylation de l’ADP forme l’ATP."),
      choice("Quel rapport moderne est proche de celui du NADH mitochondrial ?", ["38 ATP", "2,5 ATP", "0 ATP", "10 ATP"], 1, "Le rapport P/O moderne est proche de 2,5."),
      choice("Quel rapport moderne est proche de celui du FADH₂ ?", ["3 ATP", "38 ATP", "1,5 ATP", "6 ATP"], 2, "Il est inférieur à celui du NADH, environ 1,5."),
      choice("Que provoque une fuite massive de protons ?", ["Plus de gradient", "Plus de glucose", "Formation d’ADN", "Moins d’ATP et plus de dissipation"], 3, "Le découplage réduit l’énergie disponible pour l’ATP synthase."),
      short("Nomme le processus qui couple oxydation et synthèse d’ATP.", ["phosphorylation oxydative", "la phosphorylation oxydative"], "La chaîne respiratoire et l’ATP synthase réalisent ce couplage."),
    ],
    corrections: [
      "Le rôle de la chaîne respiratoire et de l’ATP synthase, visibles mais insuffisamment expliqués dans le schéma source, est développé.",
      "Le dioxygène est correctement placé comme accepteur final d’électrons.",
      "Les rapports historiques 3 ATP/NADH et 2 ATP/FADH₂ sont confrontés aux rapports modernes proches de 2,5 et 1,5.",
      "Le bilan eucaryote moderne d’environ 30 à 32 ATP est distingué du bilan scolaire de 38 ATP.",
    ],
  },
  {
    id: "isolated-mitochondria-assessment",
    title: "Résoudre l’évaluation des mitochondries isolées",
    summary: "Identifier l’organite, annoter sa structure, analyser la courbe de dioxygène et déduire son rôle.",
    pages: "10-11 et 15-16",
    section: "Situation d’évaluation et exercice 3 sur les mitochondries isolées",
    durationMinutes: 28,
    xp: 95,
    kind: "practice",
    body: `
## 1. Le sujet officiel

Des cellules hépatiques de souris sont centrifugées. Le culot contient des organites dont la micrographie montre une double membrane et de nombreuses crêtes : ce sont des **mitochondries**. Ces organites isolés sont placés dans un milieu contenant des nutriments carbonés ; la teneur en dioxygène est suivie pendant neuf minutes.

La courbe passe approximativement de 9,5 mg/L au départ à 4 mg/L vers 9 minutes.

## 2. Réponse méthodique aux quatre consignes

### 1. Nommer

La double membrane, les crêtes et l’échelle micrométrique permettent d’identifier des mitochondries.

### 2. Schématiser et annoter

Un schéma fonctionnel doit comporter : membrane externe, membrane interne, crêtes, espace intermembranaire, matrice, ADN mitochondrial et ribosomes. Le titre et la légende sont indispensables.

### 3. Analyser la courbe

« La teneur en dioxygène diminue régulièrement d’environ 9,5 mg/L à environ 4 mg/L entre 0 et 9 minutes, soit une baisse voisine de 5,5 mg/L. » Cette phrase donne la grandeur, le sens, les valeurs et la durée.

### 4. Expliquer et déduire

Les mitochondries isolées utilisent le dioxygène comme accepteur final d’électrons au cours de la chaîne respiratoire. Les nutriments fournissent les substrats réduits ; la phosphorylation oxydative produit de l’ATP. On en déduit que les mitochondries sont le siège des étapes aérobies majeures de la respiration cellulaire.

> **Correction du corrigé source :** la baisse du dioxygène ne s’explique pas par son utilisation « au cours du cycle de Krebs ». Le cycle produit NADH et $\\mathrm{FADH_2}$ ; c’est la chaîne respiratoire qui réduit directement $\\mathrm{O_2}$ en eau.

## 3. Une rédaction qui rapporte tous les points

Utilise quatre verbes différents : **j’identifie**, **je schématise**, **j’analyse**, **j’explique puis je déduis**. Ne réponds pas à « analyse » par une cause, et ne réponds pas à « explique » par une simple répétition de la courbe.
`,
    keyPoint: "La baisse de 9,5 à 4 mg/L montre que les mitochondries consomment le dioxygène via la chaîne respiratoire pour permettre la phosphorylation oxydative.",
    example: "Analyse complète : “De 0 à 9 min, la teneur en O₂ diminue régulièrement d’environ 9,5 à 4 mg/L, soit −5,5 mg/L.”",
    methodSteps: [
      "Identifie l’organite grâce à la double membrane et aux crêtes.",
      "Réalise un schéma grand, titré et annoté avec des traits horizontaux.",
      "Analyse la courbe avec grandeur, sens, valeurs, unité et intervalle de temps.",
      "Explique par la chaîne respiratoire puis déduis le rôle énergétique mitochondrial.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe officielle redessinée",
      title: "Mesurer la consommation de dioxygène",
      instruction: "Déplace le point et formule une analyse chiffrée de l’évolution.",
      formula: "Teneur en O₂ (mg/L)",
      formulaTex: "[\\mathrm{O_2}]\\ (\\mathrm{mg\\,L^{-1}})",
      rule: { kind: "samples", points: [[0, 9.5], [1, 8.9], [2, 8.3], [3, 7.7], [4, 7.1], [5, 6.5], [6, 5.9], [7, 5.3], [8, 4.7], [9, 4.1]] },
      window: { xMin: 0, xMax: 9, yMin: 0, yMax: 10 },
      guides: [{ kind: "horizontal", value: 4, label: "≈ 4 mg/L à 9 min" }],
      marker: { min: 0, max: 9, step: 1, initial: 0 },
      observation: "La décroissance est régulière sur le graphique source ; les valeurs redessinées sont approximatives.",
    },
    questions: [
      choice("Quels éléments ont été isolés ?", ["Des mitochondries", "Des noyaux", "Des ribosomes libres", "Des chromosomes"], 0, "Les crêtes et la double membrane identifient la mitochondrie.", "Question 1 • pages 10-11"),
      choice("Quelle valeur initiale lit-on approximativement ?", ["4 mg/L", "9,5 mg/L", "23 mg/L", "0 mg/L"], 1, "La courbe débute près de 9,5 mg/L.", "Question 3 • pages 10-11"),
      choice("Quelle valeur lit-on vers 9 minutes ?", ["23 mg/L", "9,5 mg/L", "4 mg/L", "38 mg/L"], 2, "Le dernier point est voisin de 4 mg/L.", "Question 3 • pages 10-11"),
      choice("Quelle est la variation approximative ?", ["+5,5 mg/L", "0 mg/L", "+9,5 mg/L", "−5,5 mg/L"], 3, "4 − 9,5 ≈ −5,5 mg/L."),
      trueFalse("Une analyse correcte doit citer les valeurs et l’unité.", true, "Sans valeurs, la description reste incomplète."),
      choice("Quelle structure consomme directement le dioxygène ?", ["La chaîne respiratoire", "Le cycle de Krebs", "La glycolyse", "Le nucléole"], 0, "O₂ reçoit les électrons à la fin de la chaîne."),
      choice("Quelle conclusion est la plus précise ?", ["Le foie crée du dioxygène", "Les mitochondries assurent les étapes aérobies de la respiration", "Les mitochondries réalisent la fermentation", "Le glucose détruit les crêtes"], 1, "La consommation de dioxygène appuie la fonction respiratoire mitochondriale."),
      choice("Quel élément doit figurer sur le schéma annoté ?", ["Une paroi végétale", "Un axone", "La matrice mitochondriale", "Un chloroplaste"], 2, "La matrice est un compartiment essentiel."),
      short("Calcule la baisse approximative de dioxygène en mg/L.", ["5,5", "5.5", "5,5 mg/L", "5.5 mg/L", "environ 5,5 mg/L"], "9,5 − 4 ≈ 5,5 mg/L.", "Lecture du graphe • pages 10-11"),
    ],
    corrections: [
      "L’explication officielle est corrigée : le dioxygène est consommé par la chaîne respiratoire, pas directement par le cycle de Krebs.",
      "L’analyse chiffrée reprend 9,5 à environ 4 mg/L en neuf minutes et explicite la variation de 5,5 mg/L.",
      "La déduction finale distingue l’organite entier des mécanismes localisés dans sa membrane interne et sa matrice.",
    ],
  },
  {
    id: "muscle-energy-mission",
    title: "Mission finale : fournir l’énergie au muscle",
    summary: "Mobiliser glucose, respiration, fermentation lactique, mitochondrie et ATP pour expliquer l’activité musculaire.",
    pages: "12-14",
    section: "Situation d’évaluation des boissons sucrées et de la fibre musculaire",
    durationMinutes: 34,
    xp: 110,
    kind: "challenge",
    body: `
## Mission officielle

Pendant la préparation d’une compétition scolaire, certains joueurs se fatiguent plus vite que d’autres. L’entraîneur leur fournit de l’eau et des boissons sucrées. Le document associe vaisseau sanguin, cellule musculaire, mitochondrie, myofibrilles, actine et myosine. Il faut expliquer l’origine de l’énergie utilisée par la fibre.

## 1. Identifier le nutriment

Le nutriment énergétique attendu dans la boisson est le **glucose**. Il passe dans le sang puis gagne les cellules musculaires. L’eau participe à l’hydratation, mais ne fournit pas d’énergie chimique.

## 2. Nommer les voies adaptées à l’être humain

- Si l’apport de dioxygène et la capacité mitochondriale répondent à la demande : **respiration cellulaire**.
- Si la demande d’ATP dépasse temporairement la capacité oxydative : la glycolyse accélère et le pyruvate peut être réduit en **lactate**, ce qui régénère le NAD⁺.

La fermentation alcoolique étudiée chez les levures ne se produit pas dans la fibre musculaire humaine. Pour l’exercice sportif, la voie anaérobie pertinente est :

$$\\mathrm{glucose + 2\\ ADP + 2\\ P_i \\longrightarrow 2\\ lactates + 2\\ ATP + 2\\ H_2O}$$

La respiration reste résumée par :

$$\\mathrm{C_6H_{12}O_6 + 6\\,O_2 \\longrightarrow 6\\,CO_2 + 6\\,H_2O} + \\text{énergie}$$

## 3. Relier ATP et contraction

La dégradation du glucose transfère de l’énergie à l’ATP. L’ATP est ensuite hydrolysé par les protéines motrices :

$$\\mathrm{ATP + H_2O \\longrightarrow ADP + P_i} + \\text{énergie utilisable}$$

Cette énergie permet le cycle des ponts actine–myosine, le transport actif du calcium et le retour à l’état de repos. Les mitochondries proches des myofibrilles renouvellent l’ATP pendant l’effort aérobie.

## 4. Réponse modèle

« Le glucose apporté par le sang est dégradé d’abord par glycolyse. En présence de dioxygène, le pyruvate est complètement oxydé dans la mitochondrie ; la chaîne respiratoire permet une production importante d’ATP. Lorsque la demande dépasse temporairement l’apport oxydatif, la fermentation lactique régénère le NAD⁺ et maintient rapidement un faible apport de 2 ATP par glucose. L’hydrolyse de l’ATP fournit directement l’énergie nécessaire aux interactions actine–myosine. »

> **Astuce mémoire — Aliment → ATP → Action :** le glucose est le carburant, l’ATP est la monnaie immédiatement dépensée, la contraction est le travail réalisé.
`,
    keyPoint: "Dans le muscle, le glucose renouvelle l’ATP par respiration ou glycolyse lactique ; l’hydrolyse de l’ATP alimente directement l’actine–myosine.",
    example: "La boisson fournit du glucose, le sang apporte aussi O₂, la mitochondrie renouvelle beaucoup d’ATP et les myofibrilles utilisent cet ATP pour se contracter.",
    methodSteps: [
      "Nomme le glucose comme nutriment et le sang comme voie d’apport.",
      "Distingue respiration aérobie et fermentation lactique musculaire.",
      "Relie la mitochondrie à la production importante d’ATP.",
      "Termine par l’hydrolyse de l’ATP et le cycle actine–myosine.",
    ],
    interaction: diagram(
      "Du sang à la contraction",
      "Explore le trajet de la matière et de l’énergie dans la fibre musculaire.",
      "Cellule musculaire en activité",
      "La cellule reçoit glucose et dioxygène, renouvelle son ATP puis l’utilise dans les myofibrilles.",
      [
        { id: "blood", label: "Vaisseau sanguin", role: "Glucose + O₂", detail: "Le sang apporte les substrats et emporte notamment le CO₂ produit par la respiration." },
        { id: "glycolysis", label: "Cytosol", role: "Glycolyse", detail: "Le glucose donne deux pyruvates, deux ATP nets et deux NADH." },
        { id: "mitochondrion", label: "Mitochondrie", role: "Respiration", detail: "Oxydation du pyruvate, cycle de Krebs et phosphorylation oxydative renouvellent une grande quantité d’ATP." },
        { id: "lactate", label: "Voie lactique", role: "Appoint anaérobie", detail: "La réduction du pyruvate en lactate régénère le NAD⁺ et permet à la glycolyse de continuer rapidement." },
        { id: "myofibril", label: "Myofibrille", role: "Actine–myosine", detail: "L’hydrolyse de l’ATP permet les changements de conformation des têtes de myosine et le cycle contractile." },
      ],
      "Le glucose n’agit pas directement sur l’actine : l’énergie doit d’abord être transférée et rendue disponible sous forme d’ATP.",
    ),
    questions: [
      choice("Quel nutriment énergétique est attendu dans la boisson sucrée ?", ["Le glucose", "Le dioxygène", "L’eau", "Le calcium"], 0, "Le sucre simple mobilisé par la cellule est le glucose.", "Question 1 • pages 12-14"),
      choice("Quelle voie domine lorsque le dioxygène et les mitochondries répondent à la demande ?", ["Fermentation alcoolique", "Respiration cellulaire", "Photosynthèse", "Réplication"], 1, "La respiration oxyde complètement le glucose."),
      choice("Quelle fermentation concerne la fibre musculaire humaine ?", ["Acétique", "Alcoolique", "Lactique", "Butyrique"], 2, "Le pyruvate peut être réduit en lactate."),
      choice("Quelle molécule fournit directement l’énergie au cycle actine–myosine ?", ["Le glucose", "Le dioxygène", "Le CO₂", "L’ATP"], 3, "Le moteur moléculaire hydrolyse l’ATP."),
      trueFalse("La cellule musculaire humaine transforme normalement le pyruvate en éthanol pendant un sprint.", false, "Elle peut former du lactate, pas de l’éthanol."),
      choice("Quel est le rôle immédiat de la voie lactique ?", ["Régénérer le NAD⁺", "Créer du dioxygène", "Former 38 ATP", "Détruire la myosine"], 0, "La régénération du NAD⁺ maintient la glycolyse."),
      choice("Quel organite renouvelle beaucoup d’ATP pendant l’effort aérobie ?", ["Le noyau", "La mitochondrie", "Le lysosome", "Le centriole"], 1, "La phosphorylation oxydative est mitochondriale."),
      choice("Quels éléments contractiles montre le schéma ?", ["ADN et ARN", "NADH et FADH₂", "Actine et myosine", "Glucose et éthanol"], 2, "Les myofibrilles comportent notamment actine et myosine.", "Figure • pages 12 et 14"),
      choice("Quel produit est emporté du muscle par le sang pendant la respiration ?", ["Le dioxygène uniquement", "Le glucose uniquement", "L’ADN", "Le dioxyde de carbone"], 3, "Le CO₂ formé gagne le sang."),
      choice("Quelle chaîne causale est correcte ?", ["Glucose → ATP → contraction", "ATP → glucose → dioxygène", "Contraction → ADN → ATP", "CO₂ → glucose → actine"], 0, "L’énergie du glucose est transférée à l’ATP, ensuite utilisé par la contraction."),
      short("Nomme le produit final de la voie anaérobie musculaire.", ["lactate", "le lactate", "acide lactique", "l’acide lactique"], "Le terme biochimique précis est lactate aux pH physiologiques."),
      short("Complète : ATP + H₂O → ADP + …", ["Pi", "P_i", "phosphate inorganique", "un phosphate inorganique"], "L’hydrolyse libère un phosphate inorganique et de l’énergie utilisable."),
    ],
    corrections: [
      "La situation musculaire est reliée à la fermentation lactique humaine et non à la fermentation alcoolique des levures.",
      "L’ATP est présenté comme source énergétique immédiate de l’actine–myosine ; le glucose est le carburant en amont.",
      "Le rôle de l’ATP dans le transport du calcium et le cycle contractile est ajouté pour rendre le schéma fonctionnel.",
      "La phrase tronquée de la situation (« certains joueurs se fatiguent plus vite et d’autres ») est reformulée sans inventer de comparaison manquante.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCSvtCellEnergyPath: LearningPath = {
  id: "terminale-c-svt-l3-cell-energy-production",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Le métabolisme énergétique et l’activité musculaire" },
  chapterNumber: 3,
  title: "La production d’énergie par la cellule",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, enrichi par des expériences interactives, une mitochondrie annotée, les exercices du document et des précisions scientifiques explicites.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Interpréter des expériences de respiration et de fermentation chez la levure",
    "Comparer dégradation complète et partielle du glucose",
    "Annoter une mitochondrie et associer ses compartiments à leurs fonctions",
    "Expliquer glycolyse, oxydation du pyruvate, cycle de Krebs et phosphorylation oxydative",
    "Relier la production d’ATP à l’activité de la fibre musculaire",
  ],
  modules: [
    {
      id: "cell-energy-production-mastery",
      title: "Maîtriser la production d’énergie cellulaire",
      description: "Neuf niveaux progressifs, de l’expérience sur les levures à la mission énergétique du muscle.",
      lessons: builtLevels,
    },
  ],
};
