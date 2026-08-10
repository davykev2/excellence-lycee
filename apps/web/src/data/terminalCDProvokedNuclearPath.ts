import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon commune : n°19 en Terminale C et n°15 en Terminale D.
const sourceDocument = "Leçon 19 (TC) / 15 (TD) - Réactions nucléaires provoquées.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel: string,
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
  corrections?: string[];
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: {
      documentTitle: sourceDocument,
      pages: seed.pages,
      section: seed.section,
      fidelity: seed.corrections?.length ? "faithful-corrected" : "faithful",
      corrections: seed.corrections ?? [],
    },
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
      introduction: "Écris d'abord les nombres de masse A et les numéros atomiques Z, puis effectue les bilans de masse et d'énergie sans mélanger les signes.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : A se conserve sur la ligne du haut, Z sur la ligne du bas ; pour une énergie libérée, calcule masse initiale moins masse finale afin d'obtenir Q positif.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const timeline = (
  items: TimelineInteractionItem[],
  title: string,
  instruction: string,
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Démarche",
  title,
  instruction,
  observation,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
});

const bindingEnergyPoints: Array<[number, number]> = [
  [2, 1.1],
  [4, 7.1],
  [12, 7.7],
  [56, 8.8],
  [94, 8.6],
  [139, 8.4],
  [235, 7.6],
];

const decayReviewPoints: Array<[number, number]> = [0, 1, 2, 3, 4].map((periods) => [periods, 2 ** -periods]);

const levels: LevelSeed[] = [
  {
    id: "provoked-nuclear-mass-defect",
    title: "Comprendre le défaut de masse",
    summary: "Comparer la masse d'un noyau à celle de ses nucléons séparés et utiliser correctement les unités u, kg et MeV/c².",
    pages: "1-2",
    section: "Défaut de masse et activité d'application 1",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## Pourquoi la masse du noyau est-elle plus petite ?

Un noyau \${}^{A}_{Z}\mathrm{X}$ contient $Z$ protons et $A-Z$ neutrons. Si ces nucléons étaient séparés, leur masse totale serait :

$$m_{\text{séparés}}=Z m_p+(A-Z)m_n$$

Or la masse mesurée $m_X$ du noyau lié est plus petite. La différence positive est le **défaut de masse** :

$$\Delta m=Z m_p+(A-Z)m_n-m_X$$

Cette masse n'a pas disparu : lors de la formation du noyau, elle correspond à de l'énergie transférée selon la relation d'Einstein $E=mc^2$. Un noyau lié possède donc une énergie plus basse que les mêmes nucléons séparés.

## Choisir la bonne unité

| Données utilisées | Unité de $\Delta m$ | Conversion utile |
|---|---:|---:|
| masses en kilogrammes | kg | $E=\Delta m c^2$ en J |
| masses en unité atomique | u | $1\ \mathrm{u}\,c^2=931{,}5\ \mathrm{MeV}$ |
| masses-énergies | $\mathrm{MeV}/c^2$ | multiplier par $c^2$ |

Le support dit directement que l'unité du défaut de masse est le $\mathrm{MeV}/c^2$. C'est possible lorsqu'on exprime une masse par son équivalent énergétique, mais **u** et **kg** sont aussi des unités de masse valides. Il faut regarder l'unité des données avant de calculer.

## Activité d'application 1 : uranium 235

Le support donne $A=235$, $Z=92$, $m_p=1{,}0073\ \mathrm{u}$, $m_n=1{,}0087\ \mathrm{u}$ et $m_U=235{,}0439\ \mathrm{u}$.

Le nombre de neutrons est $N=235-92=143$, puis :

$$\Delta m=92(1{,}0073)+143(1{,}0087)-235{,}0439=1{,}8718\ \mathrm{u}$$

Le résultat est positif, comme attendu pour un noyau lié. Si un calcul donne une valeur négative ici, l'ordre des termes a probablement été inversé.

> **Astuce mémoire.** On part des nucléons libres et on retire le noyau déjà assemblé : « pièces séparées moins objet construit ».

Le défaut de masse est la porte d'entrée de toute la leçon : il permet ensuite de calculer l'énergie de liaison, de comparer la stabilité des noyaux et de déterminer l'énergie libérée par une réaction nucléaire.` ,
    keyPoint: "Δm = Zmp + (A−Z)mn − mX ; pour l'uranium 235 du support, Δm = 1,8718 u.",
    example: "Pour U-235 : N=143, puis Δm=92×1,0073+143×1,0087−235,0439=1,8718 u.",
    methodSteps: [
      "Relève A, Z et calcule N=A−Z.",
      "Vérifie que toutes les masses utilisent la même unité.",
      "Calcule Zmp+(A−Z)mn avant de retirer la masse du noyau.",
      "Contrôle que le défaut de masse d'un noyau lié est positif.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Bilan de masse",
      title: "Suivre les termes du défaut de masse",
      instruction: "Sélectionne chaque carte pour comprendre son rôle dans le calcul.",
      observation: "La différence entre les nucléons séparés et le noyau lié mesure l'énergie de cohésion stockée dans le noyau.",
      rootLabel: "Défaut de masse Δm",
      rootDetail: "Une différence de masse positive entre l'état séparé et l'état lié.",
      nodes: [
        { id: "protons", label: "Z protons", role: "Zmp", detail: "La contribution des Z protons libres." },
        { id: "neutrons", label: "A−Z neutrons", role: "(A−Z)mn", detail: "La contribution des neutrons libres." },
        { id: "nucleus", label: "Noyau lié", role: "−mX", detail: "La masse réelle du noyau assemblé est retirée." },
        { id: "energy", label: "Équivalent énergie", role: "Δmc²", detail: "Le défaut de masse correspond à une énergie de liaison." },
      ],
    },
    questions: [
      choice("Le défaut de masse d'un noyau lié est…", ["la masse des nucléons séparés moins la masse du noyau", "la masse du noyau moins celle des électrons", "le nombre de neutrons moins Z", "toujours nul"], 0, "C'est la différence entre l'état séparé et l'état lié.", "Page 1"),
      choice("Dans Δm=Zmp+(A−Z)mn−mX, A−Z représente…", ["le nombre de neutrons", "le nombre de protons", "le nombre d'électrons", "l'énergie de liaison"], 0, "N=A−Z.", "Page 1"),
      choice("Si les masses sont données en u, Δm s'exprime naturellement en…", ["u", "Bq", "J", "s⁻¹"], 0, "Le défaut de masse garde l'unité des masses utilisées.", "Précision d'unité"),
      choice("L'équivalent énergétique de 1 u vaut environ…", ["931,5 MeV", "1 MeV", "6,02×10²³ MeV", "3×10⁸ MeV"], 0, "1 u c²=931,5 MeV.", "Remarque page 1"),
      short("Combien de neutrons contient l'uranium 235 de numéro atomique 92 ?", ["143"], "N=235−92=143.", "Activité 1"),
      short("Donne le défaut de masse de l'uranium 235 calculé dans le support, en u.", ["1,8718", "1.8718", "1,8718 u", "1.8718 u"], "Le calcul donne 1,8718 u.", "Activité 1"),
      choice("Pourquoi mX est-elle inférieure à la masse des nucléons séparés ?", ["Une partie de la masse correspond à l'énergie de liaison", "Des protons disparaissent", "Le noyau ne contient aucun neutron", "Les unités changent la matière"], 0, "Masse et énergie sont équivalentes.", "Explication"),
      choice("Pour obtenir Δm, on doit utiliser…", ["des masses exprimées dans une même unité", "des unités toutes différentes", "uniquement des becquerels", "uniquement des secondes"], 0, "Un bilan exige des unités cohérentes.", "Méthode"),
      choice("Un résultat Δm<0 pour un noyau stable signale le plus souvent…", ["un ordre de soustraction inversé", "une radioactivité certaine", "une absence de protons", "une demi-vie infinie"], 0, "Il faut calculer séparés moins lié.", "Contrôle"),
      short("Un noyau a A=56 et Z=26. Combien possède-t-il de neutrons ?", ["30"], "56−26=30.", "Application"),
      choice("La relation masse-énergie utilisée est…", ["E=mc²", "E=mc", "E=m/c²", "E=c/m"], 0, "La relation d'Einstein est E=mc².", "Page 1"),
      choice("Le défaut de masse mesure directement…", ["l'écart de masse entre nucléons libres et noyau lié", "l'activité en becquerels", "la durée d'une demi-vie", "le nombre d'électrons émis"], 0, "C'est un bilan de masse.", "Synthèse"),
    ],
    corrections: [
      "Page 1 : le MeV/c² n'est pas l'unique unité possible de Δm ; le support calcule ensuite explicitement en u.",
      "Page 1 : la signification physique de la masse manquante est explicitée par l'équivalence masse-énergie.",
    ],
  },
  {
    id: "provoked-nuclear-binding-energy",
    title: "Calculer l'énergie de liaison et la stabilité",
    summary: "Passer du défaut de masse à l'énergie de liaison puis comparer des noyaux grâce à l'énergie de liaison par nucléon.",
    pages: "1-2",
    section: "Énergie de liaison et activité d'application 1",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## Énergie nécessaire pour séparer le noyau

L'**énergie de liaison** $E_l$ d'un noyau est l'énergie minimale qu'il faut lui fournir, au repos, pour le dissocier complètement en protons et neutrons séparés, eux aussi au repos.

$$E_l=\Delta m c^2$$

Si $\Delta m$ est exprimé en kilogrammes, $E_l$ est obtenu en joules. Si $\Delta m$ est exprimé en u, la conversion directe est :

$$E_l(\mathrm{MeV})=\Delta m(\mathrm{u})\times931{,}5$$

Pour l'uranium 235 de l'activité :

$$E_l=1{,}8718\times931{,}5=1743{,}58\ \mathrm{MeV}$$

## Comparer des noyaux de tailles différentes

Une grande énergie de liaison totale ne suffit pas pour dire qu'un noyau est plus stable : un grand noyau contient naturellement davantage de nucléons. On utilise l'**énergie de liaison par nucléon** :

$$E_a=\frac{E_l}{A}=\frac{\Delta m c^2}{A}$$

Pour l'uranium 235 :

$$E_a=\frac{1743{,}58}{235}=7{,}4195\ \mathrm{MeV}\,\mathrm{nucleon}^{-1}$$

Plus $E_a$ est élevée, plus les nucléons sont fortement liés en moyenne. Les noyaux de masse moyenne, proches du fer et du nickel, sont parmi les plus stables. C'est pourquoi deux transformations peuvent libérer de l'énergie :

- la **fission** rapproche un noyau très lourd de cette zone stable ;
- la **fusion** rapproche des noyaux très légers de cette même zone.

La courbe interactive est une représentation pédagogique avec quelques valeurs indicatives ; le support n'en fournit pas une table complète. Elle sert à comprendre la tendance, pas à remplacer des données expérimentales précises.

## Ne pas confondre les deux énergies

| Grandeur | Symbole | Signification |
|---|---:|---|
| énergie de liaison totale | $E_l$ | dissocier tout le noyau |
| énergie de liaison par nucléon | $E_a$ | comparer la cohésion moyenne |

> **Astuce mémoire.** « Par nucléon » signifie toujours « diviser par A ».

Cette comparaison explique le moteur énergétique des réactions provoquées avant même d'étudier leurs équations.` ,
    keyPoint: "El=Δmc² et Ea=El/A ; une grande valeur de Ea indique une forte cohésion moyenne.",
    example: "Pour U-235 : El=1,8718×931,5=1743,58 MeV puis Ea=1743,58/235=7,4195 MeV/nucléon.",
    methodSteps: [
      "Calcule d'abord le défaut de masse dans une unité cohérente.",
      "Convertis Δm en énergie avec c² ou avec 931,5 MeV par u.",
      "Divise par A seulement si l'on demande l'énergie par nucléon.",
      "Compare les valeurs de Ea, pas les seules énergies totales.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Stabilité",
      title: "Explorer la cohésion moyenne des noyaux",
      instruction: "Déplace le point selon le nombre de masse A et observe la zone des noyaux les plus liés.",
      observation: "La cohésion moyenne augmente pour les noyaux légers, culmine vers les masses moyennes puis diminue lentement pour les noyaux lourds.",
      formula: "Énergie de liaison moyenne selon A",
      formulaTex: String.raw`E_a=\frac{E_l}{A}`,
      rule: { kind: "samples", points: bindingEnergyPoints },
      window: { xMin: 0, xMax: 240, yMin: 0, yMax: 10 },
      guides: [{ kind: "vertical", value: 56, label: "zone très stable" }],
      marker: { min: 2, max: 235, step: 1, initial: 56 },
    },
    questions: [
      choice("L'énergie de liaison d'un noyau est l'énergie minimale nécessaire pour…", ["le dissocier en nucléons séparés", "retirer un seul électron", "doubler sa masse", "annuler sa charge"], 0, "Elle mesure la cohésion du noyau.", "Page 1"),
      choice("La relation correcte est…", ["El=Δmc²", "El=Δm/c²", "El=A/Δm", "El=λN"], 0, "L'équivalence masse-énergie donne El=Δmc².", "Page 1"),
      short("Avec Δm=1,8718 u, donne El en MeV à 0,01 MeV près.", ["1743,58", "1743.58", "1743,58 MeV", "1743.58 MeV"], "1,8718×931,5=1743,58 MeV.", "Activité 1"),
      choice("L'énergie de liaison par nucléon vaut…", ["El/A", "El×A", "A/El", "Δm/A²"], 0, "On répartit l'énergie totale sur A nucléons.", "Page 1"),
      short("Donne Ea de l'uranium 235 du support, à 4 décimales.", ["7,4195", "7.4195", "7,4195 MeV/nucléon", "7.4195 MeV/nucléon"], "1743,5817/235=7,4195.", "Activité 1"),
      choice("Pour comparer la stabilité moyenne de C-12 et U-235, on compare surtout…", ["leur énergie de liaison par nucléon", "leur énergie totale seulement", "leur nombre d'électrons", "leur activité sans autre donnée"], 0, "Ea neutralise l'effet de la taille du noyau.", "Méthode"),
      choice("Une valeur plus grande de Ea signifie en général…", ["des nucléons plus fortement liés", "un noyau forcément plus lourd", "une demi-vie nulle", "aucun proton"], 0, "Ea traduit la cohésion moyenne.", "Interprétation"),
      choice("La fission libère de l'énergie parce que les produits sont en moyenne…", ["plus liés que le noyau lourd initial", "moins liés que le noyau initial", "sans masse", "uniquement constitués d'électrons"], 0, "Les fragments se rapprochent de la zone de forte cohésion.", "Complément"),
      choice("La fusion de noyaux très légers peut libérer de l'énergie parce que…", ["le noyau formé est plus lié par nucléon", "A ne se conserve plus", "les protons disparaissent", "c devient nul"], 0, "La cohésion moyenne augmente.", "Complément"),
      short("Un noyau a El=492 MeV et A=60. Donne Ea en MeV/nucléon.", ["8,2", "8.2", "8,2 MeV/nucléon", "8.2 MeV/nucléon"], "492/60=8,2.", "Application"),
      choice("L'unité pratique de Ea est…", ["MeV/nucléon", "Bq", "kg/s", "C"], 0, "C'est une énergie moyenne par nucléon.", "Unité"),
      choice("Dans El=Δmc², c désigne…", ["la célérité de la lumière", "la charge du proton", "la constante radioactive", "la chaleur massique"], 0, "c≈3,00×10⁸ m/s.", "Page 1"),
      choice("Quelle opération termine un calcul d'énergie de liaison par nucléon ?", ["diviser par A", "soustraire Z", "multiplier par λ", "diviser par le temps"], 0, "Par nucléon signifie par A.", "Synthèse"),
    ],
    corrections: [
      "Page 1 : la notation E₀ du support est harmonisée en Ea pour éviter la confusion avec une énergie initiale.",
      "La courbe de cohésion est ajoutée comme aide pédagogique originale ; ses points sont indicatifs et ne sont pas extraits d'une figure du PDF.",
    ],
  },
  {
    id: "provoked-nuclear-fission-chain",
    title: "Décrire la fission et la réaction en chaîne",
    summary: "Reconnaître l'éclatement provoqué d'un noyau lourd, équilibrer un exemple et distinguer chaîne contrôlée et incontrôlée.",
    pages: "2",
    section: "Réaction de fission nucléaire",
    durationMinutes: 24,
    xp: 65,
    body: String.raw`## Une réaction déclenchée

Une **fission nucléaire** est une réaction provoquée au cours de laquelle un noyau lourd, dit **fissile**, absorbe généralement un neutron puis se scinde en deux noyaux plus légers. Elle émet aussi des neutrons et libère une grande quantité d'énergie.

L'exemple du support est :

$$ {}^{235}_{92}\mathrm{U}+{}^{1}_{0}\mathrm{n}
\longrightarrow{}^{94}_{38}\mathrm{Sr}+{}^{140}_{54}\mathrm{Xe}+2\,{}^{1}_{0}\mathrm{n} $$

Vérification du nombre de masse :

$$235+1=94+140+2\times1=236$$

Vérification de la charge nucléaire :

$$92+0=38+54+2\times0=92$$

## Pourquoi une chaîne est-elle possible ?

Les neutrons libérés peuvent rencontrer d'autres noyaux fissiles. Chaque fission peut alors en déclencher de nouvelles. C'est une **réaction en chaîne**.

- Dans un réacteur, des dispositifs absorbants et un modérateur permettent de maîtriser le nombre de neutrons efficaces : la chaîne est **contrôlée**.
- Dans une arme de type A, la multiplication devient très rapide : la chaîne est **incontrôlée**.

Une réaction en chaîne ne signifie pas que chaque neutron provoque automatiquement une fission. Certains s'échappent ou sont capturés sans fission. La géométrie, la quantité de matière fissile et l'énergie des neutrons influencent donc la poursuite de la chaîne.

## Fissile n'est pas synonyme de radioactif

Un noyau **radioactif** peut se transformer spontanément. Un noyau **fissile** peut subir une fission après capture d'un neutron approprié. Ces propriétés sont liées à la physique nucléaire mais ne désignent pas le même phénomène.

> **Astuce mémoire.** Fission = fissure : un noyau lourd se partage. Fusion = réunion : deux noyaux légers s'assemblent.

Les figures documentaires du PDF sont remplacées ici par un schéma original : on conserve l'idée scientifique sans republier l'illustration.` ,
    keyPoint: "Fission : noyau lourd + neutron → deux fragments + neutrons + énergie ; A et Z se conservent.",
    example: "U-235+n donne Sr-94+Xe-140+2n : 236 nucléons et charge 92 des deux côtés.",
    methodSteps: [
      "Repère le noyau lourd bombardé par un neutron.",
      "Compte A de chaque côté de la flèche.",
      "Compte séparément Z de chaque côté.",
      "Identifie les neutrons libérés et explique la réaction en chaîne.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Réaction en chaîne",
      title: "Suivre les neutrons d'une fission",
      instruction: "Sélectionne les repères pour voir comment une fission peut en déclencher d'autres.",
      observation: "Le contrôle consiste à limiter le nombre de neutrons qui poursuivent efficacement la chaîne.",
      caption: "Schéma pédagogique original d'une chaîne de fissions.",
      viewBox: "0 0 640 310",
      shapes: [
        { shape: "line", x1: 35, y1: 155, x2: 165, y2: 155, tone: "accent" },
        { shape: "circle", cx: 25, cy: 155, r: 9, tone: "fill" },
        { shape: "circle", cx: 215, cy: 155, r: 54, tone: "soft" },
        { shape: "text", x: 215, y: 160, content: "U-235", anchor: "middle" },
        { shape: "circle", cx: 350, cy: 105, r: 38, tone: "muted" },
        { shape: "circle", cx: 350, cy: 205, r: 42, tone: "muted" },
        { shape: "line", x1: 265, y1: 140, x2: 315, y2: 112, tone: "accent" },
        { shape: "line", x1: 265, y1: 170, x2: 310, y2: 198, tone: "accent" },
        { shape: "line", x1: 390, y1: 105, x2: 565, y2: 55, tone: "accent" },
        { shape: "line", x1: 392, y1: 155, x2: 575, y2: 155, tone: "accent" },
        { shape: "line", x1: 392, y1: 205, x2: 565, y2: 260, tone: "accent" },
        { shape: "circle", cx: 575, cy: 52, r: 9, tone: "fill" },
        { shape: "circle", cx: 585, cy: 155, r: 9, tone: "fill" },
        { shape: "circle", cx: 575, cy: 263, r: 9, tone: "fill" },
      ],
      hotspots: [
        { id: "incoming", number: 1, label: "Neutron incident", detail: "Il est absorbé par le noyau fissile et déclenche la réaction.", x: 80, y: 130 },
        { id: "fissile", number: 2, label: "Noyau fissile", detail: "Le noyau lourd excité devient instable après la capture.", x: 215, y: 85 },
        { id: "fragments", number: 3, label: "Deux fragments", detail: "Ils sont plus légers et généralement radioactifs.", x: 350, y: 155 },
        { id: "neutrons", number: 4, label: "Neutrons émis", detail: "Ils peuvent entretenir une chaîne si suffisamment d'entre eux provoquent une nouvelle fission.", x: 500, y: 150 },
      ],
    },
    questions: [
      choice("Une fission nucléaire provoquée correspond à…", ["la scission d'un noyau lourd après capture d'un neutron", "la réunion de deux noyaux légers", "une émission lumineuse sans noyau", "la disparition de tous les nucléons"], 0, "La fission partage un noyau lourd.", "Page 2"),
      choice("Un noyau susceptible de fissionner est dit…", ["fissile", "isolant", "inerte", "acide"], 0, "Le terme du support est fissile.", "Page 2"),
      choice("Dans l'exemple du support, le noyau bombardé est…", ["U-235", "Sr-94", "Xe-140", "He-4"], 0, "L'uranium 235 reçoit le neutron.", "Page 2"),
      short("Combien de neutrons libres sont émis dans l'exemple U-235 → Sr-94 + Xe-140 ?", ["2", "deux"], "L'équation contient 2 neutrons.", "Page 2"),
      short("Vérifie la somme des nombres de masse du côté initial de U-235+n.", ["236"], "235+1=236.", "Vérification"),
      short("Calcule 94+140+2 pour vérifier A du côté final.", ["236"], "Les nombres de masse totalisent 236.", "Vérification"),
      short("Calcule 38+54 pour vérifier la charge finale.", ["92"], "Les neutrons portent Z=0.", "Vérification"),
      choice("Une réaction en chaîne devient possible grâce…", ["aux neutrons produits par les fissions", "aux électrons du circuit", "à la disparition de c", "au pH du milieu"], 0, "Les neutrons peuvent provoquer d'autres fissions.", "Remarque page 2"),
      choice("Dans un réacteur, la réaction en chaîne est…", ["contrôlée", "toujours arrêtée", "chimique", "sans énergie"], 0, "Le flux de neutrons est maîtrisé.", "Page 2"),
      choice("Dans une bombe A, la chaîne est…", ["incontrôlée", "réversible", "sans neutrons", "une fusion"], 0, "La multiplication rapide est incontrôlée.", "Page 2"),
      choice("Tous les neutrons émis provoquent-ils nécessairement une nouvelle fission ?", ["Non", "Oui, toujours", "Seulement dans l'eau", "Seulement s'ils sont chargés"], 0, "Certains s'échappent ou sont capturés autrement.", "Précision"),
      choice("La radioactivité spontanée et la fissilité…", ["sont deux propriétés différentes", "sont exactement synonymes", "concernent seulement les électrons", "annulent la conservation de Z"], 0, "Une fission est provoquée, une désintégration peut être spontanée.", "Précision"),
      choice("Quel couple de lois vérifie-t-on dans une équation nucléaire ?", ["conservation de A et de Z", "conservation du pH et du volume", "Ohm et Joule", "Snell-Descartes"], 0, "A et Z sont vérifiés séparément.", "Méthode"),
      choice("Le moyen mnémotechnique correct est…", ["fission = fissure", "fission = fusion", "fusion = séparation", "fissile = stable à jamais"], 0, "Le mot fissure aide à retenir la scission.", "Astuce"),
    ],
    corrections: [
      "Les conditions de poursuite d'une réaction en chaîne sont précisées : tous les neutrons émis ne provoquent pas automatiquement une nouvelle fission.",
      "Les illustrations documentaires des pages 8-9 ne sont pas republiées ; le schéma interactif est une création originale.",
    ],
  },
  {
    id: "provoked-nuclear-fusion-transmutation",
    title: "Distinguer fusion, fission et transmutation",
    summary: "Décrire une fusion thermonucléaire, équilibrer l'exemple deutérium-tritium et reconnaître une réaction provoquée qui n'est ni fusion ni fission.",
    pages: "2-3 et 9",
    section: "Fusion nucléaire, activité d'application 2 et documentation",
    durationMinutes: 25,
    xp: 75,
    body: String.raw`## La fusion nucléaire

Une **fusion** réunit deux noyaux légers pour former un noyau plus lourd. Elle exige des températures très élevées afin que les noyaux positifs puissent s'approcher malgré leur répulsion électrique : on parle de réaction **thermonucléaire**.

L'exemple du support est la fusion du deutérium et du tritium :

$$ {}^{2}_{1}\mathrm{H}+{}^{3}_{1}\mathrm{H}
\longrightarrow{}^{4}_{2}\mathrm{He}+{}^{1}_{0}\mathrm{n} $$

Les bilans sont exacts : $2+3=4+1$ pour A et $1+1=2+0$ pour Z.

Ces réactions alimentent le Soleil et les étoiles. La fusion contrôlée pour produire durablement de l'électricité reste un domaine de recherche technologique ; une fusion incontrôlée intervient dans les armes thermonucléaires, dites bombes H.

## Trois familles à séparer

| Réaction | Signe distinctif | Exemple |
|---|---|---|
| fission | un noyau lourd se scinde | U-235 bombardé par un neutron |
| fusion | deux noyaux légers s'unissent | deutérium + tritium |
| transmutation provoquée | un projectile transforme un noyau sans former un seul noyau final | K-39 + He-4 → Ca-42 + H-1 |

L'activité 2 du PDF propose :

$$ {}^{39}_{19}\mathrm{K}+{}^{4}_{2}\mathrm{He}
\longrightarrow{}^{42}_{20}\mathrm{Ca}+{}^{1}_{1}\mathrm{H} $$

Le corrigé la classe comme une fusion. Ce classement est incorrect : deux noyaux entrent, mais **deux noyaux ressortent**. Il s'agit d'une transmutation provoquée de type $(\alpha,p)$, pas d'une fusion au sens défini juste avant.

## Compléter une équation

Pour une inconnue \${}^{A}_{Z}\mathrm{X}$ :

1. on conserve A pour trouver le nombre de masse ;
2. on conserve Z pour trouver le numéro atomique ;
3. on identifie ensuite l'élément avec Z ;
4. seulement après, on classe la réaction.

> **Attention.** Le nombre de réactifs ne suffit pas à décider. Une fusion produit un noyau plus lourd principal ; une réaction projectile-cible peut simplement transformer le noyau et réémettre une particule.` ,
    keyPoint: "Fusion D+T : ²₁H+³₁H→⁴₂He+¹₀n ; K-39+α→Ca-42+p est une transmutation, pas une fusion.",
    example: "Dans D+D→He-3+n, A : 4=3+1 et Z : 2=2+0 ; c'est une fusion de deux noyaux légers.",
    methodSteps: [
      "Équilibre d'abord A puis Z.",
      "Identifie tous les noyaux et particules.",
      "Observe si un noyau lourd se scinde ou si deux noyaux légers s'unissent.",
      "Classe à part les transmutations qui réémettent une particule.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Comparer",
      title: "Classer une réaction provoquée",
      instruction: "Sélectionne une famille puis repère son critère décisif.",
      observation: "La structure des noyaux avant et après la réaction est plus fiable que le simple nombre de réactifs.",
      rootLabel: "Réactions provoquées",
      rootDetail: "Un projectile ou des conditions extrêmes déclenchent la transformation.",
      nodes: [
        { id: "fission", label: "Fission", role: "lourd → fragments", detail: "Un noyau lourd absorbe un neutron puis se scinde et émet des neutrons." },
        { id: "fusion", label: "Fusion", role: "légers → plus lourd", detail: "Deux noyaux légers franchissent la barrière électrique et forment un noyau plus lourd." },
        { id: "transmutation", label: "Transmutation", role: "cible + projectile", detail: "Le noyau cible change d'identité et une autre particule peut ressortir." },
        { id: "conservation", label: "Contrôle", role: "A et Z", detail: "Toute classification commence par les deux lois de conservation." },
      ],
    },
    questions: [
      choice("Une fusion nucléaire réunit…", ["deux noyaux légers", "deux fragments d'un noyau lourd déjà séparés", "deux électrons", "un acide et une base"], 0, "La fusion assemble des noyaux légers.", "Page 2"),
      choice("Pourquoi la fusion est-elle dite thermonucléaire ?", ["Elle exige des températures très élevées", "Elle refroidit toujours le milieu", "Elle ne concerne que les électrons", "Elle mesure le pH"], 0, "L'agitation thermique aide à franchir la répulsion électrique.", "Page 2"),
      choice("Dans la fusion D+T, le noyau principal formé est…", ["He-4", "U-235", "Sr-94", "C-14"], 0, "Le produit principal est l'hélium 4.", "Page 2"),
      short("Dans D+T→He-4+n, donne la somme des nombres de masse avant la réaction.", ["5"], "2+3=5.", "Vérification"),
      short("Dans D+T→He-4+n, donne la somme des numéros atomiques après la réaction.", ["2"], "2+0=2.", "Vérification"),
      choice("Les réactions de fusion naturelles expliquent principalement l'énergie…", ["du Soleil et des étoiles", "d'une pile chimique", "d'un ressort", "d'un aimant permanent"], 0, "La fusion alimente les astres.", "Page 2"),
      choice("La production électrique par fusion contrôlée est présentée dans le support comme…", ["encore au stade de la recherche", "déjà majoritaire partout", "impossible en principe", "une réaction chimique"], 0, "Le contrôle durable reste un défi technologique.", "Page 2"),
      choice("Une bombe H repose sur…", ["une fusion incontrôlée", "une fission contrôlée seulement", "une réaction acido-basique", "une désintégration sans énergie"], 0, "C'est une arme thermonucléaire.", "Page 2"),
      choice("La réaction K-39+He-4→Ca-42+H-1 est correctement classée comme…", ["transmutation provoquée", "fusion", "fission", "radioactivité spontanée"], 0, "Elle réémet un proton et ne forme pas un unique noyau lourd.", "Activité 2 corrigée"),
      choice("Dans K-39+He-4→Ca-42+H-1, A est-il conservé ?", ["Oui : 43=43", "Non : 39=42", "Non : 4 disparaît", "Impossible à vérifier"], 0, "39+4=42+1.", "Activité 2"),
      choice("Dans K-39+He-4→Ca-42+H-1, Z est-il conservé ?", ["Oui : 21=21", "Non : 19=20", "Non : 2=1", "Seulement si H est neutre"], 0, "19+2=20+1.", "Activité 2"),
      choice("D+D→He-3+n est…", ["une fusion", "une fission", "une désintégration alpha", "une réaction chimique"], 0, "Deux noyaux légers s'unissent en un noyau plus lourd.", "Activité 2"),
      choice("Pour classer une réaction, la première vérification est…", ["l'équilibre de A et Z", "la couleur du document", "le nombre de lignes", "la température en degrés Celsius uniquement"], 0, "Une équation nucléaire doit d'abord être valide.", "Méthode"),
      choice("Le titre du paragraphe 4 du PDF devrait être…", ["Réaction de fusion nucléaire", "Réaction de fission nucléaire", "Désintégration spontanée", "Dosage nucléaire"], 0, "Le texte définit la fusion ; le titre répète fission par erreur.", "Correction page 2"),
    ],
    corrections: [
      "Page 2 : le titre 4 répète « Réaction de fission nucléaire » ; il est corrigé en « Réaction de fusion nucléaire ».",
      "Page 3 : K-39 + He-4 → Ca-42 + H-1 est une transmutation provoquée (α,p), et non une fusion.",
      "Les schémas documentaires de fusion/fission sont remplacés par une carte interactive originale.",
    ],
  },
  {
    id: "provoked-nuclear-energy-balance",
    title: "Équilibrer une réaction et calculer l'énergie libérée",
    summary: "Appliquer les conservations de A et Z, puis choisir un bilan de masses ou d'énergies de liaison pour obtenir Q.",
    pages: "3-4",
    section: "Situation d'évaluation : fission de l'uranium 235",
    durationMinutes: 27,
    xp: 85,
    body: String.raw`## Étape 1 : compléter l'équation globale

La situation d'évaluation étudie une fission de l'uranium 235 dans un réacteur à eau sous pression. Le support écrit une équation globale qui inclut les désintégrations $\beta^-$ ultérieures des fragments :

$$ {}^{235}_{92}\mathrm{U}+{}^{1}_{0}\mathrm{n}
\longrightarrow{}^{91}_{b}\mathrm{Zr}+{}^{a}_{58}\mathrm{Ce}
+3\,{}^{1}_{0}\mathrm{n}+6\,{}^{0}_{-1}\mathrm{e} $$

Conservation de A :

$$235+1=91+a+3\quad\Rightarrow\quad a=142$$

Conservation de Z :

$$92=b+58-6\quad\Rightarrow\quad b=40$$

L'équation globale devient donc :

$$ {}^{235}_{92}\mathrm{U}+{}^{1}_{0}\mathrm{n}
\longrightarrow{}^{91}_{40}\mathrm{Zr}+{}^{142}_{58}\mathrm{Ce}
+3\,{}^{1}_{0}\mathrm{n}+6\,{}^{0}_{-1}\mathrm{e} $$

> **Précision physique.** Les électrons $\beta^-$ ne sont pas tous produits dans l'acte instantané de fission. Ils décrivent ici les désintégrations ultérieures des fragments instables ; l'équation du support est donc un bilan global simplifié.

## Étape 2 : deux méthodes pour l'énergie Q

### Méthode des masses

$$Q=(m_{\text{initial}}-m_{\text{final}})c^2$$

Pour une réaction exoénergétique, la masse initiale est supérieure à la masse finale et $Q>0$.

### Méthode des énergies de liaison

$$Q=\sum E_l(\text{produits})-\sum E_l(\text{réactifs})$$

Avec $E_l=A E_a$ et les valeurs fournies $E_a(U)=7{,}59$, $E_a(Zr)=8{,}70$ et $E_a(Ce)=8{,}37\ \mathrm{MeV}\,\mathrm{nucleon}^{-1}$ :

$$Q=91(8{,}70)+142(8{,}37)-235(7{,}59)=196{,}59\ \mathrm{MeV}$$

$$Q=196{,}59\times1{,}60\times10^{-13}=3{,}15\times10^{-11}\ \mathrm{J}$$

## Une incohérence à connaître dans les données

Le support calcule aussi $E_a(U)=7{,}395\ \mathrm{MeV}\,\mathrm{nucleon}^{-1}$ à partir des masses, puis utilise $7{,}59$ dans le tableau des énergies de liaison pour obtenir $196{,}59\ \mathrm{MeV}$. Ces deux valeurs sont incompatibles. Nous conservons chaque calcul dans son contexte et signalons explicitement l'écart au lieu de les confondre.` ,
    keyPoint: "Q=ΣEl(produits)−ΣEl(réactifs)=196,59 MeV≈3,15×10⁻¹¹ J pour les données du tableau.",
    example: "A donne a=142 ; Z donne b=40 ; puis Q=91×8,70+142×8,37−235×7,59=196,59 MeV.",
    methodSteps: [
      "Complète l'équation par conservation de A.",
      "Complète-la ensuite par conservation de Z, en tenant compte du signe des β−.",
      "Choisis soit les masses, soit les énergies de liaison, sans mélanger les deux bilans.",
      "Exprime l'énergie libérée comme une valeur positive et convertis-la si nécessaire.",
    ],
    interaction: timeline(
      [
        { label: "Inventorier", shortLabel: "Données", detail: "Relève tous les A, Z, masses et énergies de liaison fournis." },
        { label: "Conserver A", shortLabel: "A", detail: "Le bilan des nucléons donne a=142." },
        { label: "Conserver Z", shortLabel: "Z", detail: "En comptant 6 électrons de charge −1, on obtient b=40." },
        { label: "Former Q", shortLabel: "Énergie", detail: "Produits moins réactifs pour les liaisons, ou masse initiale moins masse finale." },
        { label: "Contrôler", shortLabel: "Signe", detail: "Une énergie libérée doit être annoncée positive : Q=196,59 MeV." },
      ],
      "Résoudre la situation d'évaluation",
      "Parcours les étapes dans l'ordre avant de lancer les calculs.",
      "Séparer les deux conservations et le bilan énergétique évite presque toutes les erreurs de signe.",
    ),
    questions: [
      choice("Dans l'équation globale, la conservation de A donne a=…", ["142", "140", "91", "40"], 0, "236=91+a+3, donc a=142.", "Situation d'évaluation"),
      choice("La conservation de Z donne b=…", ["40", "34", "46", "92"], 0, "92=b+58−6, donc b=40.", "Situation d'évaluation"),
      short("Calcule 235+1−91−3.", ["142"], "Ce calcul donne le nombre de masse du cérium.", "Situation d'évaluation"),
      short("Calcule 92−58+6.", ["40"], "Ce calcul donne Z du zirconium.", "Situation d'évaluation"),
      choice("Les six électrons β− de l'équation représentent surtout…", ["des désintégrations ultérieures des fragments", "six protons initiaux", "des neutrons rapides", "l'énergie de liaison"], 0, "Le support présente un bilan global simplifié.", "Précision"),
      choice("Avec des masses, l'énergie libérée se calcule par…", ["(minitiale−mfinale)c²", "(mfinale−minitiale)c²", "A/Z", "λN"], 0, "Le défaut de masse de la réaction est initial moins final.", "Méthode"),
      choice("Avec les énergies de liaison, Q vaut…", ["ΣEl(produits)−ΣEl(réactifs)", "ΣEl(réactifs)−ΣEl(produits)", "ΣA−ΣZ", "El/A²"], 0, "Des produits plus liés libèrent l'écart d'énergie.", "Méthode"),
      short("Calcule 91×8,70+142×8,37−235×7,59, en MeV.", ["196,59", "196.59", "196,59 MeV", "196.59 MeV"], "Le bilan du tableau vaut 196,59 MeV.", "Situation d'évaluation"),
      short("Convertis 196,59 MeV en joules avec 1 MeV=1,60×10⁻¹³ J.", ["3,15×10^-11", "3.15×10^-11", "3,15e-11", "3.15e-11", "3,15×10⁻¹¹ J", "3.15×10⁻¹¹ J"], "Le produit vaut environ 3,15×10⁻¹¹ J.", "Situation d'évaluation"),
      choice("Une réaction qui libère de l'énergie a Q…", ["positif", "négatif", "toujours nul", "sans unité"], 0, "Q>0 pour une réaction exoénergétique.", "Contrôle"),
      choice("Les valeurs 7,395 et 7,59 MeV/nucléon pour U-235 dans le support…", ["sont incohérentes entre elles", "sont strictement identiques", "sont des activités", "sont des demi-vies"], 0, "Elles proviennent de deux jeux de données incompatibles.", "Correction source"),
      choice("Pour reproduire Q=196,59 MeV, il faut utiliser pour U-235…", ["7,59 MeV/nucléon", "7,395 MeV/nucléon", "8,70 MeV/nucléon", "8,37 MeV/nucléon"], 0, "C'est la valeur du tableau employée dans le bilan.", "Situation d'évaluation"),
      choice("Dans El=A×Ea, A est…", ["le nombre de nucléons", "l'activité", "la constante radioactive", "la charge électrique"], 0, "L'énergie totale est A fois la moyenne par nucléon.", "Méthode"),
      choice("L'ordre de résolution le plus sûr est…", ["A, puis Z, puis Q", "Q, puis pH, puis A", "Z seulement", "conversion avant l'équation"], 0, "On équilibre avant de calculer l'énergie.", "Synthèse"),
    ],
    corrections: [
      "Pages 3-4 : les six émissions β− sont présentées comme des désintégrations différées des fragments, et non comme l'acte instantané de fission.",
      "Page 4 : le support calcule Ea(U-235)=7,395 MeV/nucléon mais utilise ensuite 7,59 ; l'incohérence des données est explicitée.",
    ],
  },
  {
    id: "provoked-nuclear-iodine-yttrium-exercise",
    title: "Corriger la fission iode-yttrium",
    summary: "Résoudre intégralement l'exercice 1, rétablir Y-94 et donner une énergie libérée positive avec des conversions cohérentes.",
    pages: "4-5",
    section: "Exercice 1 : fission en iode et yttrium",
    durationMinutes: 26,
    xp: 95,
    body: String.raw`## Énoncé fidèle de l'exercice 1

Le réacteur met en jeu la réaction :

$$ {}^{235}_{92}\mathrm{U}+{}^{1}_{0}\mathrm{n}
\longrightarrow{}^{139}_{a}\mathrm{I}+{}^{b}_{39}\mathrm{Y}
+3\,{}^{1}_{0}\mathrm{n} $$

Il faut identifier la réaction, déterminer $a$ et $b$, puis calculer l'énergie libérée.

## Nature et nombres inconnus

Le noyau lourd U-235 absorbe un neutron et se sépare en deux fragments : c'est une **fission**.

Conservation de Z :

$$92=a+39\quad\Rightarrow\quad a=53$$

Conservation de A :

$$235+1=139+b+3\quad\Rightarrow\quad b=94$$

L'équation correcte est donc :

$$ {}^{235}_{92}\mathrm{U}+{}^{1}_{0}\mathrm{n}
\longrightarrow{}^{139}_{53}\mathrm{I}+{}^{94}_{39}\mathrm{Y}
+3\,{}^{1}_{0}\mathrm{n} $$

Le corrigé du PDF écrit $235-1$ au lieu de $235+1$ et conclut $b=92$. Les masses fournies et le symbole de l'yttrium montrent que la valeur cohérente est bien **94**.

## Énergie libérée

Avec les masses nucléaires utilisées dans le corrigé :

$$\Delta m_{\text{libérée}}=m_U+m_n-(m_I+m_Y+3m_n)=0{,}18898\ \mathrm{u}$$

La source calcule dans l'ordre inverse et obtient $-0{,}18898\ \mathrm{u}$. Pour annoncer l'énergie **libérée**, on prend la perte de masse positive :

$$Q=0{,}18898\times931{,}5\simeq176{,}03\ \mathrm{MeV}$$

$$Q\simeq176{,}03\times1{,}602\times10^{-13}
\simeq2{,}82\times10^{-11}\ \mathrm{J}$$

Le PDF trouve environ $177{,}5\ \mathrm{MeV}$ après une conversion arrondie par $1{,}67\times10^{-27}\ \mathrm{kg/u}$. La conversion directe $1\ \mathrm{u}\,c^2=931{,}5\ \mathrm{MeV}$ est plus cohérente avec les données du cours.

> **Contrôle express.** Le résultat doit être de l'ordre de quelques centaines de MeV par fission et son signe doit être positif lorsqu'on parle d'énergie libérée.` ,
    keyPoint: "a=53, b=94 et Q≈176,03 MeV≈2,82×10⁻¹¹ J ; les signes négatifs du corrigé source sont rectifiés.",
    example: "A : 236=139+b+3 donne b=94 ; Z : 92=a+39 donne a=53 ; Q=0,18898×931,5≈176,03 MeV.",
    methodSteps: [
      "Identifie la fission à partir du noyau lourd bombardé.",
      "Conserve Z pour retrouver le numéro atomique de l'iode.",
      "Conserve A en comptant aussi le neutron incident et les trois neutrons émis.",
      "Calcule masse initiale moins masse finale puis convertis Q.",
    ],
    interaction: timeline(
      [
        { label: "Classer", shortLabel: "Fission", detail: "U-235 se scinde après capture d'un neutron." },
        { label: "Trouver a", shortLabel: "Z", detail: "92=a+39 donne a=53, numéro atomique de l'iode." },
        { label: "Trouver b", shortLabel: "A", detail: "235+1=139+b+3 donne b=94 pour l'yttrium." },
        { label: "Perte de masse", shortLabel: "Δm", detail: "Initial moins final donne +0,18898 u." },
        { label: "Énergie", shortLabel: "Q", detail: "Q≈176,03 MeV≈2,82×10⁻¹¹ J." },
      ],
      "Réparer l'exercice 1 sans perdre sa logique",
      "Avance étape par étape et compare avec les deux lois de conservation.",
      "La conservation de A révèle immédiatement que Y-92 du corrigé est impossible.",
    ),
    questions: [
      choice("La réaction U-235+n→I+Y+3n est…", ["une fission", "une fusion", "une réaction acido-basique", "une désintégration spontanée simple"], 0, "Le noyau lourd se scinde en deux fragments.", "Exercice 1"),
      choice("La conservation de Z s'écrit…", ["92=a+39", "235=a+39", "92=139+b", "236=a+b+3"], 0, "Les neutrons ont Z=0.", "Exercice 1"),
      short("Donne la valeur de a dans le symbole de l'iode.", ["53"], "a=92−39=53.", "Exercice 1"),
      choice("La conservation correcte de A s'écrit…", ["235+1=139+b+3", "235−1=139+b+3", "92+1=53+b", "235=139+b"], 0, "Le neutron incident ajoute un nucléon.", "Exercice 1 corrigé"),
      short("Donne la valeur correcte de b pour l'yttrium.", ["94"], "b=236−139−3=94.", "Exercice 1 corrigé"),
      choice("La valeur b=92 du PDF est…", ["une coquille", "la seule valeur possible", "le numéro atomique de Y", "l'énergie en MeV"], 0, "Elle viole la conservation de A.", "Correction page 4"),
      choice("L'équation correcte contient…", ["Y-94", "Y-92", "I-92", "U-139"], 0, "Le fragment d'yttrium a A=94.", "Exercice 1 corrigé"),
      short("Donne la perte de masse positive de la réaction, en u.", ["0,18898", "0.18898", "0,18898 u", "0.18898 u"], "Initial moins final donne 0,18898 u.", "Exercice 1"),
      choice("Pour annoncer l'énergie libérée, Q doit être…", ["positif", "négatif", "sans valeur", "en becquerels"], 0, "Une énergie dégagée est comptée positivement.", "Correction de signe"),
      short("Calcule 0,18898×931,5 en MeV, à 0,01 MeV près.", ["176,03", "176.03", "176,03 MeV", "176.03 MeV"], "La conversion directe donne environ 176,03 MeV.", "Exercice 1 corrigé"),
      short("Donne Q en joules à trois chiffres significatifs.", ["2,82×10^-11", "2.82×10^-11", "2,82e-11", "2.82e-11", "2,82×10⁻¹¹ J", "2.82×10⁻¹¹ J"], "176,03 MeV valent environ 2,82×10⁻¹¹ J.", "Exercice 1 corrigé"),
      choice("Quel calcul de masse donne directement une valeur positive ?", ["mU+mn−mI−mY−3mn", "mI+mY+3mn−mU−mn", "mU−mI seulement", "mY−mU"], 0, "On calcule initial moins final.", "Méthode"),
      choice("L'ordre de grandeur attendu par fission est…", ["environ 10² MeV", "environ 10⁻¹⁰ MeV", "exactement 0 MeV", "10²³ J par noyau"], 0, "Une fission libère typiquement quelques centaines de MeV.", "Contrôle"),
      choice("Quelle vérification détecte le plus vite Y-92 ?", ["le bilan de A", "le pH", "la demi-vie", "le bilan des électrons atomiques seulement"], 0, "236≠139+92+3.", "Synthèse"),
    ],
    corrections: [
      "Page 4 : 235−1 est corrigé en 235+1 dans la conservation du nombre de masse.",
      "Page 4 : b=92 est corrigé en b=94, conformément à l'équation et à la masse de Y-94 fournie.",
      "Pages 4-5 : Δm et l'énergie libérée sont rendues positives ; la conversion cohérente donne environ 176,03 MeV et 2,82×10⁻¹¹ J.",
    ],
  },
  {
    id: "provoked-nuclear-carbon-beta-exercise",
    title: "Relier composition, liaison et désintégrations bêta",
    summary: "Résoudre l'exercice 2 sur B-12, C-12 et N-12, calculer la liaison du carbone puis écrire les équations bêta complètes.",
    pages: "5",
    section: "Exercice 2 : noyaux isobares et désintégrations bêta",
    durationMinutes: 27,
    xp: 105,
    body: String.raw`## Trois noyaux de même nombre de masse

L'exercice compare \${}^{12}_{5}\mathrm{B}$, \${}^{12}_{6}\mathrm{C}$ et \${}^{12}_{7}\mathrm{N}$. Ils ont tous $A=12$ : ce sont des **isobares**. Leur nombre de protons diffère, donc ce sont trois éléments différents.

| Noyau | Protons Z | Neutrons A−Z |
|---|---:|---:|
| B-12 | 5 | 7 |
| C-12 | 6 | 6 |
| N-12 | 7 | 5 |

## Énergie de liaison de C-12

Le support fournit des masses-énergies : $m_p=938{,}27\ \mathrm{MeV}/c^2$, $m_n=939{,}56\ \mathrm{MeV}/c^2$ et $m({}^{12}\mathrm{C})=1{,}12\times10^4\ \mathrm{MeV}/c^2$.

$$E_l=6(938{,}27)+6(939{,}56)-11200=66{,}98\ \mathrm{MeV}$$

Ici, multiplier par $c^2$ annule le $/c^2$ des masses-énergies ; le résultat est directement en MeV.

## Désintégration de B-12

B-12 est $\beta^-$ : un neutron du noyau devient un proton. Z augmente de 1 et A reste constant.

$$ {}^{12}_{5}\mathrm{B}\longrightarrow{}^{12}_{6}\mathrm{C}
+{}^{0}_{-1}\mathrm{e}+\bar\nu_e $$

## Désintégration de N-12

N-12 est $\beta^+$ : un proton devient un neutron. Z diminue de 1 et A reste constant.

$$ {}^{12}_{7}\mathrm{N}\longrightarrow{}^{12}_{6}\mathrm{C}
+{}^{0}_{+1}\mathrm{e}+\nu_e $$

Une émission $\gamma$ ne doit être ajoutée que si le noyau fils est produit dans un état excité. Le PDF l'ajoute automatiquement aux deux équations sans préciser cet état : nous ne la rendons donc pas systématique.

Le corrigé simplifié de la deuxième désintégration recopie par erreur B-12 à la place de N-12. La conservation de Z permet de détecter immédiatement cette coquille.

> **Astuce mémoire.** β− fait monter Z ; β+ fait descendre Z ; A ne bouge pas.` ,
    keyPoint: "B-12→C-12+e⁻+antineutrino ; N-12→C-12+e⁺+neutrino ; El(C-12)=66,98 MeV.",
    example: "Pour N-12 en β+ : A reste 12 et Z passe de 7 à 6, donc le noyau fils est C-12.",
    methodSteps: [
      "Calcule Z et N=A−Z pour chaque noyau.",
      "Effectue le bilan des masses-énergies dans une unité unique.",
      "Pour β−, augmente Z de 1 ; pour β+, diminue Z de 1.",
      "Ajoute neutrino ou antineutrino et ne rends γ que conditionnel.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Isobares",
      title: "Suivre les transformations autour de C-12",
      instruction: "Sélectionne les noyaux ou les flèches bêta.",
      observation: "Les trois noyaux gardent A=12 ; seules les transformations neutron-proton modifient Z.",
      caption: "Schéma original des désintégrations B-12 et N-12.",
      viewBox: "0 0 620 280",
      shapes: [
        { shape: "circle", cx: 110, cy: 140, r: 58, tone: "soft" },
        { shape: "text", x: 110, y: 145, content: "B-12", anchor: "middle" },
        { shape: "circle", cx: 310, cy: 140, r: 62, tone: "fill" },
        { shape: "text", x: 310, y: 145, content: "C-12", anchor: "middle" },
        { shape: "circle", cx: 510, cy: 140, r: 58, tone: "soft" },
        { shape: "text", x: 510, y: 145, content: "N-12", anchor: "middle" },
        { shape: "line", x1: 170, y1: 140, x2: 245, y2: 140, tone: "accent" },
        { shape: "line", x1: 450, y1: 140, x2: 375, y2: 140, tone: "accent" },
        { shape: "text", x: 208, y: 118, content: "β−", anchor: "middle" },
        { shape: "text", x: 412, y: 118, content: "β+", anchor: "middle" },
      ],
      hotspots: [
        { id: "boron", number: 1, label: "B-12", detail: "5 protons et 7 neutrons ; sa désintégration β− augmente Z à 6.", x: 110, y: 70 },
        { id: "beta-minus", number: 2, label: "β−", detail: "Émission d'un électron et d'un antineutrino ; A reste 12.", x: 210, y: 170 },
        { id: "carbon", number: 3, label: "C-12", detail: "6 protons et 6 neutrons ; noyau fils commun des deux transformations.", x: 310, y: 60 },
        { id: "beta-plus", number: 4, label: "β+", detail: "Émission d'un positon et d'un neutrino ; Z passe de 7 à 6.", x: 410, y: 170 },
        { id: "nitrogen", number: 5, label: "N-12", detail: "7 protons et 5 neutrons ; le corrigé source recopie B-12 par erreur.", x: 510, y: 70 },
      ],
    },
    questions: [
      short("Combien de protons contient B-12 ?", ["5"], "Z=5.", "Exercice 2"),
      short("Combien de neutrons contient B-12 ?", ["7"], "12−5=7.", "Exercice 2"),
      short("Combien de neutrons contient C-12 ?", ["6"], "12−6=6.", "Exercice 2"),
      short("Combien de neutrons contient N-12 ?", ["5"], "12−7=5.", "Exercice 2"),
      choice("B-12, C-12 et N-12 sont des isobares car…", ["ils ont le même A", "ils ont le même Z", "ils ont la même charge", "ils ont tous 6 neutrons"], 0, "A=12 pour les trois.", "Complément"),
      choice("L'énergie de liaison de C-12 calculée avec les données du support vaut…", ["66,98 MeV", "11200 MeV", "7,59 MeV", "931,5 MeV"], 0, "6mp+6mn−mC donne 66,98 MeV.", "Exercice 2"),
      short("Calcule 6×938,27+6×939,56−11200.", ["66,98", "66.98", "66,98 MeV", "66.98 MeV"], "Le bilan vaut 66,98 MeV.", "Exercice 2"),
      choice("Dans une désintégration β−, Z…", ["augmente de 1", "diminue de 1", "reste toujours nul", "augmente de 2"], 0, "Un neutron devient un proton.", "Rappel"),
      choice("Dans une désintégration β+, Z…", ["diminue de 1", "augmente de 1", "augmente de 4", "ne se conserve jamais"], 0, "Un proton devient un neutron.", "Rappel"),
      choice("Le noyau fils de B-12 en β− est…", ["C-12", "N-12", "Be-8", "He-4"], 0, "Z passe de 5 à 6.", "Exercice 2"),
      choice("Le noyau fils de N-12 en β+ est…", ["C-12", "B-12", "O-12", "He-4"], 0, "Z passe de 7 à 6.", "Exercice 2"),
      choice("La particule neutre associée à β− est…", ["l'antineutrino électronique", "le proton", "le photon visible obligatoire", "le neutron incident"], 0, "L'équation complète contient un antineutrino.", "Correction"),
      choice("La particule neutre associée à β+ est…", ["le neutrino électronique", "l'antineutrino électronique", "un ion chlorure", "un neutron obligatoire"], 0, "L'équation complète contient un neutrino.", "Correction"),
      choice("Une émission γ doit-elle être ajoutée automatiquement ?", ["Non, seulement si le noyau fils est excité", "Oui, toujours", "Jamais dans aucune réaction", "Seulement pour équilibrer A"], 0, "Gamma dépend de l'état énergétique du noyau fils.", "Correction page 5"),
    ],
    corrections: [
      "Page 5 : neutrino et antineutrino sont rétablis dans les deux équations bêta.",
      "Page 5 : l'émission gamma n'est plus automatique ; elle suppose un noyau fils excité.",
      "Page 5 : la deuxième équation simplifiée concerne N-12, pas B-12 recopié par erreur.",
    ],
  },
  {
    id: "provoked-nuclear-breeder-safety",
    title: "Relier combustible fertile, décroissance et usages",
    summary: "Suivre la production de Pu-239 à partir de U-238, réviser la demi-vie et distinguer applications utiles, irradiation et prévention.",
    pages: "3 et 6-9",
    section: "Applications, dangers, exercices 3 et 4, documentation",
    durationMinutes: 28,
    xp: 115,
    body: String.raw`## Du noyau fertile au noyau fissile

L'exercice 3 décrit la conversion de l'uranium 238, **fertile**, en plutonium 239, **fissile** :

$$ {}^{238}_{92}\mathrm{U}+{}^{1}_{0}\mathrm{n}\longrightarrow{}^{239}_{92}\mathrm{U} $$

Puis deux désintégrations $\beta^-$ successives :

$$ {}^{239}_{92}\mathrm{U}\longrightarrow{}^{239}_{93}\mathrm{Np}
+{}^{0}_{-1}\mathrm{e}+\bar\nu_e $$

$$ {}^{239}_{93}\mathrm{Np}\longrightarrow{}^{239}_{94}\mathrm{Pu}
+{}^{0}_{-1}\mathrm{e}+\bar\nu_e $$

Un matériau **fertile** ne fissionne pas facilement dans les conditions considérées, mais il peut produire un noyau fissile après capture et transformations. Dans un surgénérateur, des neutrons issus de la fission du Pu-239 peuvent convertir une partie de l'U-238 en nouveau Pu-239 : une partie du combustible fissile est ainsi régénérée.

## Rappel de décroissance radioactive

L'exercice 4 reprend :

$$N(t)=N_0e^{-\lambda t}$$

La demi-vie $T$ vérifie $N(T)=N_0/2$, donc :

$$T=\frac{\ln2}{\lambda}$$

Après $2T$ il reste $N_0/4$ ; après $3T$, $N_0/8$. Cette loi concerne les désintégrations spontanées des noyaux produits, même lorsque leur création initiale a été provoquée.

## Applications de la radioactivité

Le support cite :

- médecine : imagerie, diagnostic et traitement de certaines tumeurs ;
- industrie : contrôle d'épaisseur et inspection de soudures ;
- agronomie : irradiation contrôlée, sélection ou traitement de semences ;
- archéologie et sciences de la Terre : datation au carbone 14.

## Dangers et protection

Une **irradiation** est une exposition à des rayonnements. Une **contamination** correspond à la présence de matière radioactive sur ou dans l'organisme. Les effets dépendent de la nature du rayonnement, de la dose, de la durée et des organes exposés.

Les règles de base sont : réduire le **temps** d'exposition, augmenter la **distance**, utiliser un **écran** adapté et éviter la dispersion des sources.

La dernière page donne des activités moyennes indicatives : environ 10 Bq pour l'eau de mer, 80 Bq pour le lait, 100 Bq pour le poisson, 150 Bq pour la pomme de terre, 1000 Bq pour le café ou le granite, 7000 Bq pour un corps humain de 70 kg, jusqu'à des valeurs bien plus élevées pour des sources médicales ou des déchets. Une activité élevée ne suffit toutefois pas, à elle seule, à calculer le risque : il faut aussi connaître le radionucléide, le rayonnement, l'énergie, la durée et la voie d'exposition.

> **Précision.** Le tableau source contient des libellés dupliqués (« 1L1L », « 70kg70kg ») ; ils sont nettoyés sans modifier l'idée comparative.` ,
    keyPoint: "U-238 fertile capte n puis deux β− conduisent à Pu-239 fissile ; T=ln2/λ et la protection repose sur temps-distance-écran.",
    example: "Après trois demi-vies, N=N₀/2³=N₀/8 ; deux β− font passer Z de 92 à 94 sans changer A=239.",
    methodSteps: [
      "Distingue fertile, fissile et radioactif.",
      "Conserve A et fais augmenter Z de 1 à chaque β−.",
      "Pour une durée en demi-vies, divise N par 2 à chaque étape.",
      "Pour le risque, ne confonds pas activité, dose, irradiation et contamination.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Révision",
      title: "Retrouver les points remarquables de la décroissance",
      instruction: "Déplace le point d'une demi-vie à l'autre.",
      observation: "La fraction restante est divisée par deux à chaque demi-vie : 1, 1/2, 1/4, 1/8…",
      formula: "N/N₀ selon t/T",
      formulaTex: String.raw`\frac{N}{N_0}=2^{-t/T}`,
      rule: { kind: "samples", points: decayReviewPoints },
      window: { xMin: 0, xMax: 4, yMin: 0, yMax: 1.05 },
      guides: [
        { kind: "vertical", value: 1, label: "T" },
        { kind: "horizontal", value: 0.5, label: "N₀/2" },
      ],
      marker: { min: 0, max: 4, step: 1, initial: 1 },
    },
    questions: [
      choice("U-238 est qualifié de fertile parce qu'il peut…", ["produire un noyau fissile après capture et transformations", "fusionner spontanément à température ambiante", "annuler toute radioactivité", "devenir un électron"], 0, "Il peut conduire à Pu-239 fissile.", "Exercice 3"),
      choice("Après capture d'un neutron, U-238 devient…", ["U-239", "Pu-239 directement", "U-235", "C-14"], 0, "A augmente de 238 à 239, Z reste 92.", "Exercice 3"),
      choice("U-239 se transforme en Np-239 par…", ["β−", "β+", "α", "fusion"], 0, "Z augmente de 92 à 93.", "Exercice 3"),
      choice("Np-239 se transforme en Pu-239 par…", ["β−", "β+", "fission", "capture d'un électron obligatoire"], 0, "Z augmente de 93 à 94.", "Exercice 3"),
      short("Après les deux désintégrations β−, quel est Z du plutonium ?", ["94"], "92→93→94.", "Exercice 3"),
      choice("L'intérêt du couple Pu-239/U-238 dans un surgénérateur est de…", ["régénérer une partie du combustible fissile", "supprimer tous les neutrons", "fabriquer du carbone 12", "rendre Q négatif"], 0, "Les neutrons contribuent à produire du nouveau Pu-239.", "Exercice 3"),
      choice("Dans N=N₀e^(−λt), N₀ est…", ["le nombre initial de noyaux", "la charge du noyau", "l'énergie de liaison", "le nombre d'Avogadro"], 0, "N₀=N(0).", "Exercice 4"),
      choice("λ est…", ["la constante radioactive", "la longueur d'onde", "le nombre de masse", "l'activité totale à jamais"], 0, "λ caractérise la probabilité de désintégration par unité de temps.", "Exercice 4"),
      choice("La demi-vie vérifie…", ["T=ln2/λ", "T=λ/ln2", "T=N₀/λ", "T=Ac²"], 0, "On pose N(T)=N₀/2.", "Exercice 4"),
      short("Quelle fraction de N₀ reste après 2T ?", ["1/4", "0,25", "0.25", "N0/4", "N₀/4"], "Deux divisions par deux donnent N₀/4.", "Exercice 4"),
      short("Quelle fraction de N₀ reste après 3T ?", ["1/8", "0,125", "0.125", "N0/8", "N₀/8"], "Trois divisions par deux donnent N₀/8.", "Exercice 4"),
      choice("Une application médicale citée est…", ["le traitement de certaines tumeurs", "la fabrication d'un ressort", "la neutralisation d'un acide", "la réfraction de la lumière"], 0, "Le support cite radiologie et traitement des tumeurs.", "Page 3"),
      choice("Une contamination radioactive signifie…", ["présence de matière radioactive sur ou dans l'organisme", "exposition sans matière déposée", "absence de rayonnement", "simple chaleur"], 0, "La contamination implique une substance radioactive.", "Précision sécurité"),
      choice("Le trio de protection de base est…", ["temps-distance-écran", "masse-volume-pH", "tension-intensité-résistance", "A-Z-N seulement"], 0, "On réduit le temps, augmente la distance et interpose un écran.", "Complément sécurité"),
      choice("Une activité en Bq suffit-elle seule à déterminer le risque ?", ["Non", "Oui, toujours", "Seulement pour l'eau", "Seulement si A=Z"], 0, "Il faut aussi le rayonnement, l'énergie, la durée et la voie d'exposition.", "Documentation page 9"),
    ],
    corrections: [
      "Page 6 : antineutrinos ajoutés aux deux désintégrations β− de la chaîne U-239 → Np-239 → Pu-239.",
      "Page 9 : les doublons typographiques « 1L1L » et « 70kg70kg » du tableau documentaire sont nettoyés.",
      "Page 9 : l'activité en Bq est distinguée du risque radiologique, qui dépend de plusieurs paramètres.",
    ],
  },
  {
    id: "provoked-nuclear-uranium-mission",
    title: "Mission finale : l'énergie d'un kilogramme d'uranium",
    summary: "Résoudre l'exercice 5 de bout en bout, corriger x=39 et transformer l'énergie d'une seule fission en énergie pour 1 kg d'U-235.",
    pages: "7-8",
    section: "Exercice 5 : fission de l'uranium et énergie pour 1 kg",
    durationMinutes: 30,
    xp: 130,
    kind: "challenge",
    body: String.raw`## La mission du deuxième examen blanc

Le support propose :

$$ {}^{1}_{0}\mathrm{n}+{}^{235}_{92}\mathrm{U}
\longrightarrow{}^{139}_{53}\mathrm{I}+{}^{94}_{x}\mathrm{Y}
+y\,{}^{1}_{0}\mathrm{n} $$

Données : $m_n=1{,}009\ \mathrm{u}$, $m_I=138{,}905\ \mathrm{u}$, $m_U=235{,}044\ \mathrm{u}$, $m_Y=93{,}906\ \mathrm{u}$, $N_A=6{,}02\times10^{23}\ \mathrm{mol}^{-1}$ et $c=3{,}00\times10^8\ \mathrm{m/s}$.

## 1. Identifier et décrire

Un noyau lourd U-235 absorbe un neutron, se scinde en deux fragments et émet d'autres neutrons : c'est une fission. Le noyau initial contient 92 protons et $235-92=143$ neutrons.

## 2. Trouver x et y

Conservation de Z :

$$92=53+x\quad\Rightarrow\quad x=39$$

Conservation de A :

$$1+235=139+94+y\quad\Rightarrow\quad y=3$$

Le corrigé source écrit **x=8**, alors que son propre calcul $92-53$ vaut 39. Le symbole Y confirme $Z=39$.

## 3. Calculer la perte de masse

Masse initiale :

$$m_i=m_n+m_U=1{,}009+235{,}044=236{,}053\ \mathrm{u}$$

Masse finale :

$$m_f=m_I+m_Y+3m_n=138{,}905+93{,}906+3(1{,}009)=235{,}838\ \mathrm{u}$$

$$\Delta m=m_i-m_f=0{,}215\ \mathrm{u}$$

Le PDF écrit $-0{,}215\ \mathrm{u}$ parce qu'il soustrait dans l'ordre inverse. Une **perte** de masse et une énergie libérée sont annoncées positives.

## 4. Énergie d'une fission

$$Q=0{,}215\times931{,}5=200{,}27\ \mathrm{MeV}$$

$$Q=200{,}27\times1{,}602\times10^{-13}
\simeq3{,}21\times10^{-11}\ \mathrm{J}$$

## 5. Passer à 1 kg d'uranium 235

La masse molaire est approximativement $M=235\ \mathrm{g/mol}=0{,}235\ \mathrm{kg/mol}$.

$$N=\frac{m}{M}N_A=\frac{1}{0{,}235}\times6{,}02\times10^{23}
\simeq2{,}56\times10^{24}\ \text{noyaux}$$

Si tous ces noyaux fissionnent selon cette réaction :

$$E_{1\,\mathrm{kg}}=NQ\simeq2{,}56\times10^{24}\times3{,}21\times10^{-11}
\simeq8{,}21\times10^{13}\ \mathrm{J}$$

Le support trouve une valeur proche, $8{,}23\times10^{13}\ \mathrm{J}$, mais lui attribue un signe négatif. Le signe est corrigé ; l'écart numérique vient des arrondis.

> **Interprétation.** Ce calcul est une énergie nucléaire théorique. Une centrale réelle ne transforme pas toute cette énergie en électricité : rendement, fissions effectives, pertes et gestion du combustible doivent être pris en compte.` ,
    keyPoint: "x=39, y=3, Δm=0,215 u, Q≈200,27 MeV et E(1 kg)≈8,21×10¹³ J.",
    example: "N=(1/0,235)NA≈2,56×10²⁴ noyaux ; E=N×3,21×10⁻¹¹≈8,21×10¹³ J.",
    methodSteps: [
      "Identifie la fission et donne la composition de U-235.",
      "Conserve Z pour x puis A pour y.",
      "Calcule la perte de masse positive mi−mf.",
      "Convertis l'énergie d'une fission, puis multiplie par le nombre de noyaux dans 1 kg.",
      "Annonce les hypothèses et contrôle le signe ainsi que l'ordre de grandeur.",
    ],
    interaction: timeline(
      [
        { label: "Équilibrer Z", shortLabel: "x=39", detail: "92=53+x : l'yttrium a Z=39." },
        { label: "Équilibrer A", shortLabel: "y=3", detail: "236=139+94+y : trois neutrons sont émis." },
        { label: "Perte de masse", shortLabel: "0,215 u", detail: "Masse initiale moins masse finale." },
        { label: "Une fission", shortLabel: "200,27 MeV", detail: "La masse perdue devient environ 3,21×10⁻¹¹ J." },
        { label: "Un kilogramme", shortLabel: "8,21×10¹³ J", detail: "On multiplie par environ 2,56×10²⁴ noyaux." },
      ],
      "Du noyau isolé au kilogramme de combustible",
      "Suis les cinq étapes sans arrondir trop tôt.",
      "La même réaction change d'échelle : de 10⁻¹¹ J par noyau à environ 10¹⁴ J par kilogramme.",
    ),
    questions: [
      choice("La réaction de la mission est…", ["une fission", "une fusion", "une désintégration alpha", "une réaction chimique"], 0, "U-235 se scinde après capture d'un neutron.", "Exercice 5"),
      short("Combien de protons contient U-235 ?", ["92"], "Z=92.", "Exercice 5"),
      short("Combien de neutrons contient U-235 ?", ["143"], "235−92=143.", "Exercice 5"),
      short("Calcule x=92−53.", ["39"], "x=39, et non 8.", "Exercice 5 corrigé"),
      short("Calcule y=236−139−94.", ["3"], "Trois neutrons sont émis.", "Exercice 5"),
      choice("Le x=8 imprimé dans la solution est…", ["une erreur de calcul", "le numéro atomique de Y", "le nombre de neutrons émis", "l'énergie de liaison"], 0, "92−53=39.", "Correction page 8"),
      short("Donne la masse initiale mi en u.", ["236,053", "236.053", "236,053 u", "236.053 u"], "1,009+235,044=236,053 u.", "Exercice 5"),
      short("Donne la masse finale mf en u.", ["235,838", "235.838", "235,838 u", "235.838 u"], "138,905+93,906+3×1,009=235,838 u.", "Exercice 5"),
      short("Donne la perte de masse positive en u.", ["0,215", "0.215", "0,215 u", "0.215 u"], "236,053−235,838=0,215 u.", "Exercice 5 corrigé"),
      short("Calcule Q=0,215×931,5 en MeV, à 0,01 MeV près.", ["200,27", "200.27", "200,27 MeV", "200.27 MeV"], "Q≈200,27 MeV.", "Exercice 5 corrigé"),
      short("Donne l'énergie d'une fission en joules à trois chiffres significatifs.", ["3,21×10^-11", "3.21×10^-11", "3,21e-11", "3.21e-11", "3,21×10⁻¹¹ J", "3.21×10⁻¹¹ J"], "200,27 MeV≈3,21×10⁻¹¹ J.", "Exercice 5 corrigé"),
      choice("Pour 1 kg d'U-235, la quantité de matière vaut environ…", ["1/0,235 mol", "1/235 mol", "235 mol exactement", "6,02×10²³ kg"], 0, "La masse molaire est 0,235 kg/mol.", "Exercice 5"),
      short("Combien de noyaux U-235 y a-t-il approximativement dans 1 kg ?", ["2,56×10^24", "2.56×10^24", "2,56e24", "2.56e24", "2,56×10²⁴"], "(1/0,235)×6,02×10²³≈2,56×10²⁴.", "Exercice 5"),
      short("Donne l'énergie théorique libérée par 1 kg, à trois chiffres significatifs.", ["8,21×10^13", "8.21×10^13", "8,21e13", "8.21e13", "8,21×10¹³ J", "8.21×10¹³ J"], "NQ≈8,21×10¹³ J.", "Exercice 5 corrigé"),
      choice("Pourquoi le signe négatif de la source est-il corrigé ?", ["Une énergie libérée est annoncée positive", "La masse finale est plus grande", "A ne se conserve pas", "Le joule est négatif"], 0, "La perte de masse mi−mf est positive.", "Correction page 8"),
      choice("Le calcul de 1 kg suppose notamment que…", ["tous les noyaux considérés fissionnent selon la réaction", "aucun noyau ne fissionne", "le rendement électrique vaut forcément 100 %", "la masse molaire est 1 kg/mol"], 0, "C'est une énergie nucléaire théorique maximale pour cette hypothèse.", "Interprétation"),
      choice("Quel ordre de grandeur faut-il retenir ?", ["10¹⁴ J par kilogramme", "10⁻¹⁴ J par kilogramme", "1 J exactement", "10²⁴ J par noyau"], 0, "8,21×10¹³ J est de l'ordre de 10¹⁴ J.", "Mission finale"),
    ],
    corrections: [
      "Page 8 : x=8 est corrigé en x=39, car 92−53=39 et l'yttrium a le numéro atomique 39.",
      "Page 8 : la perte de masse est réécrite mi−mf=+0,215 u au lieu de −0,215 u.",
      "Page 8 : l'énergie de 1 kg est positive et recalculée à environ 8,21×10¹³ J ; 8,23×10¹³ J reste compatible avec les arrondis du support.",
      "Page 8 : l'hypothèse de fission de tous les noyaux et la différence avec l'électricité réellement produite sont explicitées.",
    ],
  },
];

const levelOrder = [
  "provoked-nuclear-mass-defect",
  "provoked-nuclear-binding-energy",
  "provoked-nuclear-fission-chain",
  "provoked-nuclear-fusion-transmutation",
  "provoked-nuclear-energy-balance",
  "provoked-nuclear-iodine-yttrium-exercise",
  "provoked-nuclear-carbon-beta-exercise",
  "provoked-nuclear-breeder-safety",
  "provoked-nuclear-uranium-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau de réactions nucléaires provoquées introuvable : " + id);
  return officialLevel(index, level);
});

export const provokedNuclearPath: LearningPath = {
  id: "terminale-cd-provoked-nuclear",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Leçon 19 en Terminale C • Leçon 15 en Terminale D • Thème 5",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/15956-tle-d-phy-l19-reactions-nucleaires-provoquees-by-tehua/file",
  theme: { number: 5, title: "Réactions nucléaires" },
  chapterNumber: 19,
  chapterNumberByLevel: { "terminale-c": 19, "terminale-d": 15 },
  title: "Réactions nucléaires provoquées",
  description: "Calculer défaut de masse et énergie de liaison, distinguer fission, fusion et transmutation, équilibrer les réactions puis déterminer l'énergie libérée jusqu'à l'échelle d'un kilogramme de combustible.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer le défaut de masse, l'énergie de liaison et l'énergie par nucléon.",
    "Expliquer la stabilité relative des noyaux et l'origine de l'énergie libérée.",
    "Distinguer fission, fusion, réaction en chaîne et transmutation provoquée.",
    "Compléter une équation nucléaire par conservation de A et Z.",
    "Calculer Q par un bilan de masses ou d'énergies de liaison.",
    "Relier noyaux fertiles, noyaux fissiles et régénération du combustible.",
    "Connaître les applications, les dangers et les principes de radioprotection.",
    "Résoudre intégralement la mission officielle sur un kilogramme d'uranium 235.",
  ],
  modules: [{
    id: "provoked-nuclear-mastery",
    title: "Maîtriser les réactions nucléaires provoquées",
    description: "Du défaut de masse à la fission d'un kilogramme d'uranium, neuf niveaux fidèles aux neuf pages du support ivoirien.",
    lessons: builtLevels,
  }],
};

export const provokedNuclearPaths: LearningPath[] = [provokedNuclearPath];
