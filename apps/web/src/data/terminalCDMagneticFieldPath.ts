import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 06 de Physique (Terminales C et D) — commune aux deux séries.
const sourceDocument = "TleD_PHY_L6_Champ magnétique.pdf";

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
      introduction: "Applique cette démarche au cours et aux exercices du document officiel.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : dessine d'abord le sens du champ, écris ensuite la relation littérale, puis seulement les valeurs en unités S.I.",
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

const levels: LevelSeed[] = [
  {
    id: "magnetic-interactions-sources",
    title: "Mettre en évidence les interactions magnétiques",
    summary: "Reconnaître attraction et répulsion, puis identifier les principales sources d'un champ magnétique.",
    pages: "1-2",
    section: "I. Mise en évidence expérimentale et II.1 Définitions",
    durationMinutes: 14,
    xp: 45,
    body: String.raw`## Ce que montre l'expérience

Deux aimants, ou deux bobines parcourues par un courant, peuvent **s'attirer** ou **se repousser** :

| Faces ou pôles placés en regard | Observation |
|---|---|
| même nom : Nord-Nord ou Sud-Sud | répulsion |
| noms différents : Nord-Sud | attraction |

La présence d'un aimant ou d'un conducteur parcouru par un courant **modifie les propriétés de la région qui l'entoure**. Une aiguille aimantée placée dans cette région peut dévier : on dit qu'il y règne un **champ magnétique**.

> **Définition.** Un espace champ magnétique est une région de l'espace dont les propriétés sont modifiées par la présence d'un aimant ou d'un conducteur parcouru par un courant électrique.

## Les sources citées par le cours

- les **aimants permanents** ;
- les **courants électriques**, donc les charges électriques en mouvement ;
- la **Terre**, qui se comporte localement comme une source de champ magnétique.

La bobine n'a donc pas besoin d'être un aimant permanent : lorsqu'un courant la traverse, elle possède deux faces magnétiques et agit sur une aiguille aimantée.

> **Astuce mémoire.** **Même nom = je m'éloigne** ; **noms différents = je me rapproche**.

## Application du document

Dans le premier dessin, les aimants s'éloignent : les faces en regard ont le **même nom**. Si la face de l'aimant A tournée vers B est Nord, la face correspondante de B est aussi Nord. Dans le second dessin, les aimants se rapprochent : la face de B tournée vers le Nord de A est donc Sud.` ,
    keyPoint: "Un aimant, un courant électrique ou la Terre peut créer un champ magnétique ; pôles identiques se repoussent et pôles différents s'attirent.",
    example: "Une aiguille placée près d'une bobine ne dévie que lorsque le courant circule : le courant est bien la source du champ observé.",
    methodSteps: [
      "Observe si les deux objets se rapprochent ou s'éloignent.",
      "Traduis : attraction signifie pôles opposés ; répulsion signifie pôles identiques.",
      "Place le pôle connu, puis déduis le pôle de la face voisine.",
      "Complète l'autre extrémité de chaque aimant par le pôle opposé.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Qui crée le champ magnétique ?",
      instruction: "Sélectionne une source pour comprendre comment elle agit sur une aiguille aimantée.",
      observation: "Le test commun est la déviation d'une aiguille aimantée : elle révèle la présence et l'orientation locale du champ.",
      rootLabel: "Champ magnétique",
      rootDetail: "Une modification des propriétés de l'espace, détectable notamment par une aiguille aimantée.",
      nodes: [
        { id: "magnet", label: "Aimant", role: "Source permanente", detail: "Ses pôles Nord et Sud créent un champ même sans alimentation électrique." },
        { id: "current", label: "Courant", role: "Charges en mouvement", detail: "Un fil ou une bobine parcouru par un courant crée un champ magnétique autour de lui." },
        { id: "earth", label: "Terre", role: "Champ naturel", detail: "L'aiguille d'une boussole s'oriente sous l'action du champ magnétique terrestre." },
        { id: "needle", label: "Aiguille aimantée", role: "Détecteur et repère", detail: "Sa déviation révèle le champ ; son axe et son pôle Nord en indiquent direction et sens." },
      ],
    },
    questions: [
      choice("Deux pôles Nord placés face à face…", ["se repoussent", "s'attirent", "n'interagissent jamais", "fusionnent"], 0, "Deux pôles de même nom se repoussent.", "I.1 Expérience", 1),
      choice("Un pôle Nord placé face à un pôle Sud…", ["est attiré", "est repoussé", "reste toujours immobile", "annule les deux aimants"], 0, "Deux pôles de noms différents s'attirent.", "I.1 Expérience", 1),
      choice("Quelle observation met en évidence le champ d'une bobine ?", ["Une aiguille aimantée dévie lorsque le courant circule", "La bobine change de masse", "La bobine devient transparente", "Le courant cesse toujours"], 0, "La déviation montre que les propriétés de l'espace autour de la bobine ont changé.", "Situation d'apprentissage", 2),
      choice("Laquelle n'est pas une source citée par le cours ?", ["Une charge immobile isolée", "Un aimant", "Un courant électrique", "La Terre"], 0, "Le cours cite les aimants, les courants et la Terre.", "II.1 Sources", 1),
      choice("Deux aimants s'éloignent. Leurs faces en regard sont…", ["de même nom", "de noms différents", "forcément toutes deux Sud", "sans pôle"], 0, "L'éloignement traduit une répulsion, donc des faces de même nom.", "Exercice d'application, page 1", 2),
      choice("La face Nord de A attire la face voisine de B. Cette face de B est…", ["Sud", "Nord", "sans nom", "Est"], 0, "L'attraction exige deux pôles opposés.", "Exercice d'application, page 1", 2),
    ],
  },
  {
    id: "magnetic-vector-characteristics",
    title: "Caractériser le vecteur champ magnétique",
    summary: "Déterminer le point d'application, la direction, le sens, la valeur et l'unité du vecteur champ magnétique.",
    pages: "1-2",
    section: "II.1-2 Vecteur champ magnétique et caractéristiques",
    durationMinutes: 15,
    xp: 50,
    body: String.raw`## Une grandeur vectorielle

En chaque point $M$ où règne un champ magnétique, celui-ci est représenté par un vecteur noté :

$$\boxed{\vec B(M)}$$

Dire que le champ est **vectoriel** signifie qu'une seule valeur numérique ne suffit pas. Il faut donner quatre caractéristiques.

| Caractéristique | Comment la déterminer ? |
|---|---|
| point d'application | le point $M$ étudié |
| direction | l'axe d'une aiguille aimantée placée en $M$ |
| sens | du pôle Sud vers le pôle Nord de cette aiguille |
| valeur | mesurée avec un teslamètre, en tesla (T) |

Le vecteur $\vec B$ est donc **tangent à l'orientation prise par l'aiguille** et pointe vers son pôle Nord.

## Valeur et unités

L'unité S.I. du champ magnétique est le **tesla**, symbole T. Les valeurs de laboratoire sont souvent petites :

$$1\ \text{mT}=10^{-3}\ \text{T}\qquad ;\qquad 1\ \mu\text{T}=10^{-6}\ \text{T}$$

Un teslamètre muni d'une sonde mesure une composante ou la valeur du champ selon l'orientation de la sonde. Il faut donc respecter l'axe indiqué par le constructeur.

> **Erreur fréquente.** Ne confonds pas **direction** et **sens**. Une même droite définit la direction ; deux orientations opposées sont possibles sur cette droite.

> **Astuce mémoire.** L'aiguille donne tout : son **axe** donne la direction et son extrémité **Nord** donne le sens de $\vec B$.` ,
    keyPoint: "Au point M, B a la direction de l'aiguille, le sens Sud vers Nord et une valeur mesurée en tesla avec un teslamètre.",
    example: "Une sonde indique 2,5 mT : la valeur S.I. est B = 2,5×10⁻³ T.",
    methodSteps: [
      "Place mentalement une aiguille aimantée au point étudié.",
      "Prends son axe comme direction du champ.",
      "Oriente le vecteur du pôle Sud vers le pôle Nord de l'aiguille.",
      "Convertis la valeur en teslas si un calcul en unités S.I. est demandé.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte d'identité",
      title: "Les quatre caractéristiques de B",
      instruction: "Sélectionne chaque carte pour ne plus confondre direction, sens et valeur.",
      observation: "Une réponse complète ne dit pas seulement « B = 2 mT » : elle précise aussi où, selon quelle droite et vers quel côté.",
      rootLabel: "Vecteur champ B au point M",
      rootDetail: "La représentation locale du champ magnétique en un point donné de l'espace.",
      nodes: [
        { id: "point", label: "Point M", role: "Point d'application", detail: "Le vecteur est attaché au point où l'on étudie le champ." },
        { id: "direction", label: "Axe de l'aiguille", role: "Direction", detail: "La droite support du vecteur B est celle de l'aiguille aimantée en équilibre." },
        { id: "sense", label: "Sud vers Nord", role: "Sens", detail: "Le vecteur pointe vers le pôle Nord de l'aiguille aimantée." },
        { id: "magnitude", label: "Teslamètre", role: "Valeur en tesla", detail: "La valeur B s'exprime en T ; mT et µT doivent être convertis avant un calcul S.I." },
      ],
    },
    questions: [
      choice("La direction de B en un point est donnée par…", ["l'axe de l'aiguille aimantée", "la verticale dans tous les cas", "le fil électrique seulement", "la masse de la sonde"], 0, "C'est la définition expérimentale du cours.", "II.2 Direction", 1),
      choice("Le sens de B est orienté…", ["du pôle Sud vers le pôle Nord de l'aiguille", "du Nord vers le Sud de l'aiguille", "vers le bas dans tous les cas", "au hasard"], 0, "Le pôle Nord de l'aiguille indique le sens du champ.", "II.2 Sens", 2),
      choice("L'unité S.I. du champ magnétique est…", ["le tesla", "le volt", "l'ampère", "le weber par seconde"], 0, "La valeur de B s'exprime en tesla (T).", "II.2 Valeur", 1),
      short("Convertis 4,0 mT en teslas.", ["0,004", "0.004", "4.10^-3", "4×10^-3", "4e-3", "0,004 T"], "4,0 mT = 4,0×10⁻³ T.", "II.2 Valeur", 2),
      short("Convertis 25 µT en teslas.", ["25.10^-6", "25×10^-6", "2,5.10^-5", "2.5e-5", "0,000025", "0.000025"], "25 µT = 25×10⁻⁶ T = 2,5×10⁻⁵ T.", "II.2 Valeur", 2),
      choice("Quelle réponse distingue correctement direction et sens ?", ["Direction : horizontale ; sens : vers la droite", "Direction : vers la droite ; sens : horizontale", "Direction et sens sont toujours identiques", "Le sens n'existe pas pour B"], 0, "La direction est une droite ; le sens choisit une orientation sur cette droite.", "II.2 Caractéristiques", 2),
    ],
  },
  {
    id: "magnetic-field-lines-spectra",
    title: "Lire les lignes de champ et les spectres",
    summary: "Relier le vecteur champ à la tangente d'une ligne de champ et interpréter les spectres d'un aimant droit ou en U.",
    pages: "2",
    section: "II.3 Spectres magnétiques",
    durationMinutes: 17,
    xp: 60,
    body: String.raw`## Ligne de champ

Une **ligne de champ** est une courbe telle qu'en chacun de ses points le vecteur $\vec B$ est **tangent** à la courbe et orienté dans le même sens :

$$\vec B(M)\ \text{est tangent à la ligne de champ au point}\ M$$

Un **spectre magnétique** est l'ensemble des lignes de champ utilisées pour rendre le champ visible.

## Comment lire le dessin ?

- à l'extérieur d'un aimant, les lignes sortent du pôle **Nord** et entrent au pôle **Sud** ;
- à l'intérieur de l'aimant, elles reviennent de Sud vers Nord : les lignes forment des boucles fermées ;
- des lignes serrées signalent un champ plus intense ;
- deux lignes de champ ne se coupent pas, car $\vec B$ ne peut pas avoir deux directions différentes au même point.

## Les deux spectres du document

### Aimant droit

Les lignes sont courbes à l'extérieur et plus concentrées près des pôles. Le champ est très peu uniforme autour de l'aimant.

### Aimant en U

Dans l'entrefer, loin des bords, les lignes sont presque droites, parallèles et régulièrement espacées. Le champ y est **approximativement uniforme**.

> **Astuce mémoire.** À l'extérieur : **N sort, S reçoit**. À l'intérieur : le chemin se referme de S vers N.

> **Erreur fréquente.** La ligne n'est pas la trajectoire d'une particule : c'est une construction qui indique, point par point, la direction et le sens du champ.` ,
    keyPoint: "B est tangent à la ligne de champ ; à l'extérieur d'un aimant les lignes vont de N vers S et leur ensemble forme le spectre.",
    example: "Entre les branches d'un aimant en U, des lignes parallèles et équidistantes indiquent un champ presque uniforme.",
    methodSteps: [
      "Repère les pôles Nord et Sud.",
      "Oriente les lignes extérieures de Nord vers Sud.",
      "Au point demandé, trace la tangente à la ligne.",
      "Place B sur cette tangente dans le sens des flèches.",
      "Observe l'espacement des lignes pour comparer l'intensité du champ.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Spectre original d'un aimant droit",
      instruction: "Sélectionne les repères pour lire les lignes sans apprendre le dessin par cœur.",
      observation: "À l'extérieur, les lignes quittent N et rejoignent S. En chaque point, B est porté par la tangente locale.",
      caption: "Figure originale redessinée d'après les spectres du document officiel.",
      viewBox: "0 0 400 230",
      shapes: [
        { shape: "path", d: "M200 103 L278 103 L278 143 L200 143 Z", tone: "accent" },
        { shape: "path", d: "M122 103 L200 103 L200 143 L122 143 Z", tone: "fill" },
        { shape: "text", x: 161, y: 129, content: "S", anchor: "middle" },
        { shape: "text", x: 239, y: 129, content: "N", anchor: "middle" },
        { shape: "path", d: "M278 115 C350 25 50 25 122 115", tone: "accent" },
        { shape: "path", d: "M278 125 C330 65 70 65 122 125", tone: "soft" },
        { shape: "path", d: "M278 131 C330 191 70 191 122 131", tone: "soft" },
        { shape: "path", d: "M278 139 C350 225 50 225 122 139", tone: "accent" },
        { shape: "path", d: "M126 114 L112 107 L112 121 Z", tone: "accent" },
        { shape: "path", d: "M126 136 L112 129 L112 143 Z", tone: "accent" },
        { shape: "line", x1: 302, y1: 72, x2: 326, y2: 52, tone: "muted" },
        { shape: "path", d: "M326 52 L315 55 L322 64 Z", tone: "muted" },
        { shape: "text", x: 334, y: 49, content: "B", anchor: "start" },
      ],
      hotspots: [
        { id: "north", number: 1, label: "Pôle Nord", detail: "À l'extérieur de l'aimant, les lignes de champ quittent le pôle Nord.", x: 250, y: 115 },
        { id: "south", number: 2, label: "Pôle Sud", detail: "À l'extérieur de l'aimant, les lignes de champ pénètrent dans le pôle Sud.", x: 150, y: 115 },
        { id: "tangent", number: 3, label: "Tangente locale", detail: "Le vecteur B au point étudié est tangent à la ligne et orienté comme elle.", x: 314, y: 62 },
        { id: "density", number: 4, label: "Densité des lignes", detail: "Le resserrement près des pôles traduit qualitativement un champ plus intense.", x: 290, y: 123 },
      ],
    },
    questions: [
      choice("Au point M d'une ligne de champ, B est…", ["tangent à la ligne", "toujours perpendiculaire à la ligne", "toujours vertical", "nul"], 0, "C'est la définition d'une ligne de champ.", "II.3 Ligne de champ", 2),
      choice("À l'extérieur d'un aimant droit, les lignes sont orientées…", ["de Nord vers Sud", "de Sud vers Nord", "du centre vers les deux pôles", "sans sens"], 0, "Les lignes sortent de N et entrent en S à l'extérieur.", "II.3 Spectre", 2),
      choice("Un spectre magnétique est…", ["un ensemble de lignes de champ", "une seule valeur de B", "un appareil de mesure", "la trajectoire d'un électron"], 0, "Le spectre rassemble les lignes qui représentent le champ.", "II.3 Spectre", 1),
      choice("Des lignes parallèles et régulièrement espacées indiquent…", ["un champ uniforme", "un champ nul", "un champ nécessairement terrestre", "deux champs opposés"], 0, "Direction, sens et valeur sont alors identiques dans la zone considérée.", "II.3 Aimant en U", 2),
      choice("Pourquoi deux lignes de champ ne se coupent-elles pas ?", ["B aurait deux directions au même point", "elles n'ont jamais de courbure", "elles sont matérielles", "le teslamètre les repousse"], 0, "Un vecteur unique ne peut avoir deux directions différentes en un même point.", "II.3 Lecture d'un spectre", 2),
      choice("Dans l'entrefer central d'un aimant en U, le champ est approximativement…", ["uniforme", "circulaire", "nul", "aléatoire"], 0, "Les lignes y sont presque droites, parallèles et équidistantes.", "II.3 Aimant en U", 1),
    ],
  },
  {
    id: "solenoid-orientation",
    title: "Orienter le champ d'un solénoïde",
    summary: "Reconnaître un solénoïde long, déterminer ses faces et orienter son champ par la règle de la main droite.",
    pages: "2-3",
    section: "II.4.1-2 Solénoïde et règle d'Ampère",
    durationMinutes: 18,
    xp: 65,
    body: String.raw`## Définition correcte

Un **solénoïde** est une bobine longue formée de nombreuses spires jointives. Dans le modèle du cours, sa longueur $L$ est au moins dix fois son rayon $R$ :

$$\boxed{L\geq10R}$$

Cette condition permet de négliger les effets de bord dans la région centrale.

## Le champ à l'intérieur

Au centre d'un solénoïde suffisamment long, les lignes sont presque droites, parallèles et équidistantes : le champ y est **approximativement uniforme**.

- sa direction est celle de l'axe du solénoïde ;
- à l'intérieur, son sens va de la face **Sud** vers la face **Nord** ;
- à l'extérieur, les lignes reviennent de Nord vers Sud.

## Règle de la main droite

Enroule les doigts de la main droite dans le **sens du courant conventionnel** dans les spires : le pouce tendu indique le sens de $\vec B$ à l'intérieur et pointe vers la **face Nord**.

Vue depuis une face :

| Sens du courant sur la face | Nom de la face |
|---|---|
| antihoraire | Nord |
| horaire | Sud |

La règle du bonhomme d'Ampère citée par le document conduit au même résultat, mais la main droite est généralement plus rapide et moins ambiguë.

> **Astuce mémoire.** Les doigts suivent **I**, le pouce donne **B** et montre **N**.` ,
    keyPoint: "Pour un solénoïde long, L ≥ 10R ; les doigts de la main droite suivent I et le pouce donne B intérieur vers la face Nord.",
    example: "Si le champ intérieur pointe vers la droite, la face droite est Nord et la face gauche est Sud.",
    methodSteps: [
      "Repère le sens du courant dans les spires.",
      "Enroule les doigts de la main droite dans ce sens.",
      "Lis le sens de B avec le pouce.",
      "Nomme Nord la face vers laquelle pointe B et Sud l'autre face.",
      "Trace à l'intérieur des lignes parallèles orientées de S vers N.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Le champ intérieur du solénoïde",
      instruction: "Sélectionne les repères pour relier courant, champ et nom des faces.",
      observation: "À l'intérieur, B suit l'axe de S vers N. Les lignes extérieures referment les boucles de N vers S.",
      caption: "Figure originale redessinée d'après le spectre du solénoïde du document officiel.",
      viewBox: "0 0 410 230",
      shapes: [
        { shape: "path", d: "M95 77 L315 77 L315 153 L95 153 Z", tone: "muted" },
        { shape: "line", x1: 112, y1: 77, x2: 112, y2: 153, tone: "outline" },
        { shape: "line", x1: 136, y1: 77, x2: 136, y2: 153, tone: "outline" },
        { shape: "line", x1: 160, y1: 77, x2: 160, y2: 153, tone: "outline" },
        { shape: "line", x1: 184, y1: 77, x2: 184, y2: 153, tone: "outline" },
        { shape: "line", x1: 208, y1: 77, x2: 208, y2: 153, tone: "outline" },
        { shape: "line", x1: 232, y1: 77, x2: 232, y2: 153, tone: "outline" },
        { shape: "line", x1: 256, y1: 77, x2: 256, y2: 153, tone: "outline" },
        { shape: "line", x1: 280, y1: 77, x2: 280, y2: 153, tone: "outline" },
        { shape: "line", x1: 304, y1: 77, x2: 304, y2: 153, tone: "outline" },
        { shape: "line", x1: 120, y1: 115, x2: 292, y2: 115, tone: "accent" },
        { shape: "path", d: "M292 115 L276 107 L276 123 Z", tone: "accent" },
        { shape: "text", x: 204, y: 104, content: "B", anchor: "middle" },
        { shape: "text", x: 77, y: 120, content: "S", anchor: "middle" },
        { shape: "text", x: 333, y: 120, content: "N", anchor: "middle" },
        { shape: "path", d: "M315 92 C385 12 25 12 95 92", tone: "soft" },
        { shape: "path", d: "M315 138 C385 218 25 218 95 138", tone: "soft" },
        { shape: "line", x1: 112, y1: 153, x2: 112, y2: 196, tone: "fill" },
        { shape: "path", d: "M112 196 L104 181 L120 181 Z", tone: "fill" },
        { shape: "line", x1: 304, y1: 196, x2: 304, y2: 153, tone: "fill" },
        { shape: "path", d: "M304 153 L296 168 L312 168 Z", tone: "fill" },
      ],
      hotspots: [
        { id: "axis", number: 1, label: "Axe du solénoïde", detail: "Dans la zone centrale, la direction de B est celle de l'axe de la bobine.", x: 205, y: 115 },
        { id: "north-face", number: 2, label: "Face Nord", detail: "Le champ intérieur pointe vers cette face. Vue de cette face, le courant tourne dans le sens antihoraire.", x: 333, y: 120 },
        { id: "south-face", number: 3, label: "Face Sud", detail: "À l'intérieur, les lignes partent de cette face vers la face Nord.", x: 77, y: 120 },
        { id: "current", number: 4, label: "Sens du courant", detail: "Les doigts de la main droite suivent le courant ; le pouce donne le sens de B et pointe vers N.", x: 304, y: 180 },
      ],
    },
    questions: [
      choice("La condition géométrique d'un solénoïde long est…", ["L ≥ 10R", "L = R/10", "L ≤ R", "L = 0"], 0, "« Au moins dix fois le rayon » s'écrit L ≥ 10R.", "II.4.1 Définition", 2),
      choice("À l'intérieur d'un solénoïde long, la direction de B est…", ["celle de son axe", "toujours verticale", "tangente aux spires", "perpendiculaire à son axe"], 0, "Les lignes intérieures sont parallèles à l'axe.", "II.4.1 Caractéristiques", 1),
      choice("À l'intérieur, B est orienté…", ["de la face Sud vers la face Nord", "de la face Nord vers la face Sud", "vers le générateur dans tous les cas", "sans sens"], 0, "Les lignes se ferment : intérieur S→N, extérieur N→S.", "II.4.2 Spectre", 2),
      choice("Vue depuis une face, le courant tourne dans le sens antihoraire. Cette face est…", ["Nord", "Sud", "sans pôle", "Est"], 0, "La règle de la main droite donne une face Nord.", "Règle d'orientation", 2),
      choice("Si B intérieur pointe vers la droite, les faces gauche et droite sont respectivement…", ["Sud et Nord", "Nord et Sud", "Nord et Nord", "Sud et Sud"], 0, "À l'intérieur, le champ va de S vers N.", "Exercice 5, partie A", 2),
      choice("Quel geste applique correctement la main droite ?", ["Les doigts suivent I et le pouce donne B", "Le pouce suit I et les doigts donnent la masse", "La main gauche donne toujours B", "Le pouce pointe toujours vers le Sud"], 0, "C'est la règle d'enroulement de la main droite.", "Règle d'Ampère", 1),
    ],
    corrections: [
      "Page 2 : « au moins 10 fois supérieure à son rayon » doit s'écrire L ≥ 10R, et non l'égalité stricte L = 10R imprimée entre parenthèses.",
    ],
  },
  {
    id: "solenoid-field-law",
    title: "Calculer le champ dans un solénoïde",
    summary: "Utiliser B = μ₀NI/L = μ₀nI, convertir les unités et interpréter l'influence de chaque paramètre.",
    pages: "2-3 et 5",
    section: "II.4 Valeur du champ et exercice d'application",
    durationMinutes: 19,
    xp: 70,
    body: String.raw`## La relation fondamentale

Dans la région centrale d'un solénoïde long parcouru par un courant d'intensité $I$ :

$$\boxed{B=\mu_0\frac{N}{L}I=\mu_0nI}$$

avec :

| Symbole | Grandeur | Unité S.I. |
|---|---|---|
| $B$ | valeur du champ magnétique | T |
| $I$ | intensité du courant | A |
| $N$ | nombre total de spires | sans unité |
| $L$ | longueur du solénoïde | m |
| $n=N/L$ | nombre de spires par mètre | m$^{-1}$ |
| $\mu_0$ | perméabilité magnétique du vide | T·m·A$^{-1}$ |

$$\boxed{\mu_0=4\pi\times10^{-7}\ \text{T·m·A}^{-1}}$$

## Ce que dit la formule

- à géométrie fixée, $B$ est proportionnel à $I$ ;
- à intensité fixée, davantage de spires par mètre donne un champ plus fort ;
- à $N$ fixé, allonger la bobine diminue $n$ et donc $B$.

## Application officielle corrigée

Pour $n=1000$ spires·m$^{-1}$ et $I=2{,}0$ A :

$$B=4\pi\times10^{-7}\times1000\times2{,}0=8\pi\times10^{-4}\ \text{T}$$

$$\boxed{B\approx2{,}51\times10^{-3}\ \text{T}=2{,}51\ \text{mT}}$$

La direction est l'axe du solénoïde ; le sens se détermine avec la main droite.

> **Astuce mémoire.** Avant de calculer, transforme toujours les centimètres en mètres et les milliteslas en teslas.` ,
    keyPoint: "B = μ₀(N/L)I = μ₀nI, avec n en m⁻¹, L en m, I en A et B en T.",
    example: "n = 1000 m⁻¹ et I = 2,0 A donnent B = 2,51×10⁻³ T = 2,51 mT.",
    methodSteps: [
      "Relève N, L, n et I et identifie la grandeur cherchée.",
      "Convertis L en mètres et B en teslas.",
      "Calcule n = N/L si nécessaire.",
      "Isole la grandeur dans B = μ₀nI.",
      "Vérifie l'ordre de grandeur et écris l'unité.",
    ],
    interaction: timeline([
      { label: "Choisir la relation", shortLabel: "1. Formule", detail: "Utilise B = μ₀NI/L si N et L sont donnés, ou B = μ₀nI si n est déjà connu." },
      { label: "Passer en unités S.I.", shortLabel: "2. Convertir", detail: "Longueur en mètre, champ en tesla, intensité en ampère et densité de spires en m⁻¹." },
      { label: "Isoler l'inconnue", shortLabel: "3. Isoler", detail: "Par exemple n = B/(μ₀I), N = BL/(μ₀I) ou I = B/(μ₀n)." },
      { label: "Calculer", shortLabel: "4. Numérique", detail: "Conserve μ₀ = 4π×10⁻⁷ et ne remplace π qu'à la fin." },
      { label: "Contrôler", shortLabel: "5. Vérifier", detail: "Un champ de quelques milliteslas doit apparaître comme quelques 10⁻³ T, pas 10³ T." },
    ], "Le protocole de calcul", "Suis l'ordre pour éviter les erreurs de conversion et de puissance de dix.", "La formule littérale et les unités S.I. protègent mieux qu'un calcul mental immédiat."),
    questions: [
      choice("Quelle relation est correcte dans un solénoïde long ?", ["B = μ₀NI/L", "B = μ₀L/(NI)", "B = NI/μ₀L", "B = μ₀NLI"], 0, "Comme n = N/L, on a B = μ₀nI = μ₀NI/L.", "II.4.1 Valeur", 2),
      short("Calcule n pour N = 800 spires et L = 40 cm, en spires·m⁻¹.", ["2000", "2 000", "2000 spires/m", "2.10^3"], "L = 0,40 m et n = 800/0,40 = 2000 m⁻¹.", "II.4.1 Valeur", 2),
      short("Application officielle : donne B en mT pour n = 1000 m⁻¹ et I = 2,0 A.", ["2,51", "2.5", "2,5", "2.51", "2,51 mT", "2,5 mT"], "B = μ₀nI = 2,51×10⁻³ T = 2,51 mT.", "Exercice d'application, page 3", 3),
      choice("À n fixé, si I est doublée, B est…", ["doublé", "divisé par deux", "mis au carré", "inchangé"], 0, "B = μ₀nI est proportionnel à I.", "II.4.1 Valeur", 1),
      choice("À I et N fixés, si L double, B est…", ["divisé par deux", "doublé", "multiplié par quatre", "inchangé"], 0, "B = μ₀NI/L est inversement proportionnel à L.", "II.4.1 Valeur", 2),
      short("Isole l'intensité I dans B = μ₀nI.", ["B/(mu0 n)", "B/(μ0n)", "B/μ₀n", "I=B/(μ0n)", "B/(mu_0*n)"], "En divisant par μ₀n, I = B/(μ₀n).", "II.4.1 Valeur", 2),
      short("Isole le nombre total de spires N dans B = μ₀NI/L.", ["BL/(mu0 I)", "BL/(μ0I)", "BL/μ₀I", "N=BL/(μ0I)", "B*L/(mu0*I)"], "On multiplie par L puis on divise par μ₀I : N = BL/(μ₀I).", "II.4.1 Valeur", 2),
    ],
  },
  {
    id: "magnetic-field-superposition",
    title: "Composer plusieurs champs magnétiques",
    summary: "Construire le champ résultant et exploiter un triangle rectangle lorsque le champ terrestre est perpendiculaire à celui du solénoïde.",
    pages: "5-6",
    section: "Exercice 4 — champ terrestre et champ du solénoïde",
    durationMinutes: 19,
    xp: 80,
    body: String.raw`## Principe de superposition

Lorsque plusieurs sources agissent au même point, le champ total est la **somme vectorielle** des champs produits séparément :

$$\boxed{\vec B=\vec B_0+\vec B_h}$$

Dans l'exercice 4, $\vec B_0$ est le champ créé par le solénoïde et $\vec B_h$ le champ magnétique terrestre horizontal. L'aiguille s'aligne sur le champ résultant $\vec B$.

## Cas de deux champs perpendiculaires

Le document précise que, sans courant, l'aiguille est perpendiculaire à l'axe du solénoïde. Les deux champs $\vec B_0$ et $\vec B_h$ sont donc perpendiculaires. Le triangle vectoriel est rectangle :

$$\tan\alpha=\frac{B_0}{B_h}$$

$$\boxed{B_0=B_h\tan\alpha}$$

et, par Pythagore :

$$\boxed{B=\sqrt{B_0^2+B_h^2}=\frac{B_h}{\cos\alpha}}$$

## Application officielle

Avec $B_h=2{,}0\times10^{-5}$ T et $\alpha=30^\circ$ :

$$B_0=2{,}0\times10^{-5}\tan30^\circ\approx1{,}15\times10^{-5}\ \text{T}$$

$$B=\sqrt{(1{,}15\times10^{-5})^2+(2{,}0\times10^{-5})^2}\approx2{,}31\times10^{-5}\ \text{T}$$

> **Erreur fréquente.** On ne doit pas additionner directement les valeurs $B_0+B_h$ quand les vecteurs ne sont pas colinéaires.

> **Astuce mémoire.** Dessine le triangle avant de choisir sinus, cosinus ou tangente.` ,
    keyPoint: "B = B₀ + Bh vectoriellement ; si B₀ ⟂ Bh, alors B₀ = Bh tanα et B = √(B₀²+Bh²).",
    example: "Bh = 2,0×10⁻⁵ T et α = 30° donnent B₀ ≈ 1,15×10⁻⁵ T et B ≈ 2,31×10⁻⁵ T.",
    methodSteps: [
      "Identifie chaque source et trace son vecteur champ au même point.",
      "Construis le parallélogramme ou le triangle de la somme vectorielle.",
      "Vérifie si les champs sont perpendiculaires.",
      "Place correctement l'angle α sur le triangle.",
      "Utilise la trigonométrie puis Pythagore et contrôle B > B₀ et B > Bh.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Triangle des champs au centre O",
      instruction: "Sélectionne les trois vecteurs pour voir leur rôle dans la déviation de l'aiguille.",
      observation: "Le champ résultant B est la diagonale construite à partir de B₀ et Bh. L'aiguille s'aligne sur cette diagonale.",
      caption: "Construction vectorielle originale redessinée d'après l'exercice 4.",
      viewBox: "0 0 390 230",
      shapes: [
        { shape: "line", x1: 70, y1: 180, x2: 330, y2: 180, tone: "muted" },
        { shape: "line", x1: 140, y1: 180, x2: 285, y2: 180, tone: "accent" },
        { shape: "path", d: "M285 180 L269 172 L269 188 Z", tone: "accent" },
        { shape: "text", x: 292, y: 193, content: "B0", anchor: "start" },
        { shape: "line", x1: 140, y1: 180, x2: 140, y2: 48, tone: "fill" },
        { shape: "path", d: "M140 48 L132 64 L148 64 Z", tone: "fill" },
        { shape: "text", x: 126, y: 43, content: "Bh", anchor: "end" },
        { shape: "line", x1: 140, y1: 180, x2: 285, y2: 48, tone: "outline" },
        { shape: "path", d: "M285 48 L269 54 L280 66 Z", tone: "outline" },
        { shape: "text", x: 297, y: 45, content: "B", anchor: "start" },
        { shape: "path", d: "M140 145 A35 35 0 0 1 166 157", tone: "soft" },
        { shape: "text", x: 154, y: 143, content: "α", anchor: "middle" },
        { shape: "path", d: "M140 165 L155 165 L155 180", tone: "muted" },
        { shape: "text", x: 129, y: 196, content: "O", anchor: "middle" },
      ],
      hotspots: [
        { id: "solenoid", number: 1, label: "Champ B₀ du solénoïde", detail: "Il suit l'axe de la bobine. Sa valeur est recherchée avec B₀ = Bh tanα.", x: 255, y: 180 },
        { id: "earth", number: 2, label: "Champ terrestre Bh", detail: "Sans courant, l'aiguille s'aligne sur ce champ. Ici Bh = 2,0×10⁻⁵ T et il est perpendiculaire à l'axe.", x: 140, y: 70 },
        { id: "result", number: 3, label: "Champ résultant B", detail: "L'aiguille déviée s'aligne sur la somme vectorielle B = B₀ + Bh.", x: 260, y: 70 },
        { id: "angle", number: 4, label: "Angle α", detail: "Il est mesuré entre le champ terrestre Bh et le champ résultant B ; dans ce triangle rectangle, tanα = B₀/Bh.", x: 154, y: 151 },
      ],
    },
    questions: [
      choice("Le champ total au centre O s'écrit…", ["B = B₀ + Bh vectoriellement", "B = B₀Bh", "B = B₀/Bh", "B = 0 dans tous les cas"], 0, "Les champs obéissent au principe de superposition.", "Exercice 4, question 3", 2),
      choice("Pourquoi l'aiguille dévie-t-elle quand le courant circule ?", ["Elle s'aligne sur la somme du champ terrestre et du champ du solénoïde", "Le champ terrestre disparaît", "Sa masse change", "Le courant supprime tout champ"], 0, "L'aiguille répond au champ résultant.", "Exercice 4, question 2", 2),
      choice("Dans le montage décrit, B₀ et Bh sont…", ["perpendiculaires", "toujours parallèles", "de même valeur", "nuls"], 0, "Sans courant, l'aiguille est perpendiculaire à l'axe du solénoïde.", "Exercice 4", 1),
      short("Avec Bh = 2,0×10⁻⁵ T et α = 30°, calcule B₀ selon la relation du corrigé, en teslas.", ["1,15.10^-5", "1,15×10^-5", "1.15e-5", "1,155e-5", "0,0000115"], "B₀ = Bh tan30° ≈ 1,15×10⁻⁵ T.", "Exercice 4, question 4", 3),
      short("Déduis la valeur du champ résultant B, en teslas.", ["2,31.10^-5", "2,3.10^-5", "2,31×10^-5", "2.31e-5", "2,3e-5", "0,0000231"], "B = √(B₀²+Bh²) ≈ 2,31×10⁻⁵ T.", "Exercice 4, question 4", 3),
      choice("Peut-on écrire B = B₀ + Bh pour les valeurs numériques ici ?", ["Non, car les deux champs ne sont pas colinéaires", "Oui, toujours", "Oui, car α = 30°", "Non, car B est nul"], 0, "L'addition simple des normes n'est valable que pour des vecteurs de même direction et même sens.", "Composition des champs", 2),
      choice("Quel contrôle permet de repérer une erreur de calcul ?", ["Le résultant doit être supérieur à chacune des deux composantes perpendiculaires", "Le résultant doit être nul", "B doit être inférieur à B₀ et Bh", "B doit être en ampères"], 0, "L'hypoténuse d'un triangle rectangle est plus longue que chaque côté.", "Exercice 4", 1),
    ],
    corrections: [
      "Page 6 : le champ résultant vaut plus précisément 2,31×10⁻⁵ T ; l'arrondi 2,3×10⁻⁵ T du document est acceptable.",
    ],
  },
  {
    id: "official-solenoid-exercises",
    title: "Résoudre les exercices officiels sur le solénoïde",
    summary: "Mobiliser orientation, densité de spires et relation B = μ₀nI dans les exercices 1 à 4 du document.",
    pages: "4-6",
    section: "III. Exercices 1 à 4",
    durationMinutes: 23,
    xp: 95,
    body: String.raw`## Exercice 1 — orienter la bobine

Le schéma du document conduit à un champ intérieur dirigé de la droite vers la gauche. Comme le champ intérieur va de Sud vers Nord :

- face gauche : **Nord** ;
- face droite : **Sud** ;
- lignes intérieures : parallèles à l'axe et fléchées vers la gauche.

## Exercice 2 — calcul direct corrigé

Données : $L=40$ cm $=0{,}40$ m, $N=1000$ spires et $I=2$ A.

$$B=\mu_0\frac NL I=4\pi\times10^{-7}\times\frac{1000}{0{,}40}\times2$$

$$\boxed{B\approx6{,}28\times10^{-3}\ \text{T}=6{,}28\ \text{mT}}$$

Le document remplace accidentellement $I=2$ A par $5$ A dans la ligne numérique et obtient donc une valeur erronée.

## Exercice 3 — retrouver n, N puis I'

Données : $L=0{,}80$ m, $I=2{,}5$ A et $B=12{,}0$ mT $=0{,}0120$ T.

$$n=\frac{B}{\mu_0I}\approx3819{,}7\ \text{m}^{-1}\approx3820\ \text{spires·m}^{-1}$$

$$N=nL\approx3055{,}8\approx3056\ \text{spires}$$

Pour doubler le champ sans modifier la bobine, il faut doubler l'intensité :

$$I'=\frac{B'}{\mu_0n}=5{,}0\ \text{A}$$

## Exercice 4 — composition

La méthode complète est celle du niveau précédent : identifier le champ terrestre, construire $\vec B=\vec B_0+\vec B_h$, puis exploiter le triangle rectangle.

> **Astuce mémoire.** Dans chaque calcul : **convertir → formule littérale → application numérique → unité → contrôle**.` ,
    keyPoint: "Orientation par la main droite ; n = B/(μ₀I), N = nL, I' = B'/(μ₀n) et toutes les longueurs doivent être en mètres.",
    example: "L = 0,80 m, I = 2,5 A et B = 12 mT donnent n ≈ 3820 m⁻¹, N ≈ 3056 spires et I' = 5 A pour B' = 24 mT.",
    methodSteps: [
      "Fais un schéma et oriente B avant tout calcul.",
      "Recopie les données puis convertis cm en m et mT en T.",
      "Choisis B = μ₀NI/L ou B = μ₀nI.",
      "Isole l'inconnue littéralement.",
      "Calcule, arrondis raisonnablement et contrôle la proportionnalité.",
    ],
    interaction: timeline([
      { label: "Exercice 1 : sens et faces", shortLabel: "Orientation", detail: "Applique la main droite, trace les lignes intérieures puis nomme les faces S et N." },
      { label: "Exercice 2 : calcul direct", shortLabel: "B connu", detail: "Convertis L = 40 cm en 0,40 m puis applique B = μ₀NI/L avec I = 2 A." },
      { label: "Exercice 3 : calcul inverse", shortLabel: "n et N", detail: "Pars de B = μ₀nI pour trouver n, puis utilise N = nL." },
      { label: "Exercice 3 : nouveau courant", shortLabel: "I'", detail: "À bobine inchangée, B est proportionnel à I : doubler B revient à doubler I." },
      { label: "Exercice 4 : superposition", shortLabel: "Deux champs", detail: "Construis la somme vectorielle avant d'utiliser la trigonométrie." },
    ], "Les quatre exercices, une même logique", "Choisis un exercice pour retrouver le bon outil.", "Le dessin traite le sens ; la relation B = μ₀nI traite la valeur ; la somme vectorielle traite plusieurs sources."),
    questions: [
      choice("Exercice 1 : si B intérieur pointe vers la gauche, la face gauche est…", ["Nord", "Sud", "sans nom", "positive"], 0, "À l'intérieur, le champ pointe vers la face Nord.", "Exercice 1", 1),
      choice("Exercice 1 : la face droite est alors…", ["Sud", "Nord", "positive", "sans pôle"], 0, "Les deux faces sont opposées : gauche N, droite S.", "Exercice 1", 1),
      short("Exercice 2 : convertis 40 cm en mètres.", ["0,40", "0.40", "0,4", "0.4", "0,40 m"], "40 cm = 40/100 m = 0,40 m.", "Exercice 2", 1),
      short("Exercice 2 : calcule B en milliteslas pour N = 1000, L = 0,40 m et I = 2 A.", ["6,28", "6.28", "6,3", "6.3", "6,28 mT", "6.28 mT"], "B = 4π×10⁻⁷×(1000/0,40)×2 ≈ 6,28 mT.", "Exercice 2", 3),
      choice("Pourquoi la réponse 1,57×10⁻² T imprimée à l'exercice 2 est-elle fausse ?", ["La ligne de calcul utilise 5 A au lieu des 2 A de l'énoncé", "Le tesla n'existe pas", "N doit être en mètres", "μ₀ vaut zéro"], 0, "Le facteur ×5 visible dans la solution ne correspond pas à I = 2 A.", "Exercice 2, solution", 2),
      short("Exercice 3 : convertis 12,0 mT en teslas.", ["0,012", "0.012", "12.10^-3", "12×10^-3", "1,2.10^-2"], "12,0 mT = 12,0×10⁻³ T = 0,0120 T.", "Exercice 3", 1),
      short("Exercice 3 : calcule n en spires·m⁻¹ à l'unité près.", ["3820", "3819", "3819,7", "3819.7", "3820 spires/m"], "n = 0,012/(4π×10⁻⁷×2,5) ≈ 3819,7, soit 3820 m⁻¹.", "Exercice 3, question 1", 3),
      short("Exercice 3 : déduis N à l'unité près pour L = 0,80 m.", ["3056", "3055", "3055,8", "3055.8", "3056 spires"], "N = nL ≈ 3819,7×0,80 ≈ 3055,8, soit environ 3056 spires.", "Exercice 3, question 2", 3),
      short("Exercice 3 : quelle intensité I' produit B' = 24 mT avec la même bobine ?", ["5", "5,0", "5.0", "5 A", "5,0 A"], "Le champ double de 12 à 24 mT, donc l'intensité double de 2,5 à 5,0 A.", "Exercice 3, question 3", 2),
      choice("Exercice 4 : sans courant, le champ au centre est…", ["le champ magnétique terrestre", "le champ du solénoïde", "nul", "un champ électrique"], 0, "Sans courant, le solénoïde ne crée pas B₀ ; l'aiguille répond au champ terrestre.", "Exercice 4, question 1", 1),
      choice("Exercice 4 : les valeurs des champs perpendiculaires se combinent par…", ["B = √(B₀²+Bh²)", "B = B₀−Bh", "B = B₀Bh", "B = 0"], 0, "Le triangle vectoriel est rectangle.", "Exercice 4, question 4", 2),
      choice("Si B passe de 12 mT à 24 mT à bobine inchangée, I…", ["double", "est divisée par deux", "est multipliée par quatre", "ne change pas"], 0, "B est proportionnel à I.", "Exercice 3", 1),
    ],
    corrections: [
      "Page 5, exercice 2 : avec I = 2 A, le résultat correct est 6,28×10⁻³ T. La solution imprimée insère ×5 et annonce 1,57×10⁻² T, valeur correspondant à 5 A.",
      "Page 5, exercice 3 : l'arrondi cohérent du nombre total est N ≈ 3056 spires ; le document affiche 3055 après avoir arrondi n trop tôt.",
    ],
  },
  {
    id: "solenoid-measurement-mission",
    title: "Mission finale : retrouver une bobine inconnue",
    summary: "Exploiter la droite B = f(I) pour déterminer la densité de spires, le nombre total de spires et le bobinage par couche.",
    pages: "3-4 et 6-8",
    section: "Situation d'évaluation, exercice 5 et documentation",
    durationMinutes: 25,
    xp: 110,
    kind: "challenge",
    body: String.raw`## La situation expérimentale

Un solénoïde de longueur $L=40$ cm comporte un nombre inconnu $N$ de spires réparties sur **quatre couches**. Les mesures sont :

| $I$ (A) | 0 | 0,5 | 1,0 | 1,5 | 2,0 | 2,5 | 3,0 |
|---:|---:|---:|---:|---:|---:|---:|---:|
| $B$ (mT) | 0 | 1,00 | 2,00 | 2,95 | 4,10 | 5,00 | 5,95 |

Les points sont presque alignés sur une droite passant par l'origine. Les petits écarts proviennent des incertitudes de mesure :

$$\boxed{B=kI\quad\text{avec}\quad k\approx2{,}0\ \text{mT·A}^{-1}=2{,}0\times10^{-3}\ \text{T·A}^{-1}}$$

## Retrouver la bobine

Comme $B=\mu_0nI$, l'identification avec $B=kI$ donne :

$$k=\mu_0n\qquad\Longrightarrow\qquad n=\frac{k}{\mu_0}$$

$$n=\frac{2{,}0\times10^{-3}}{4\pi\times10^{-7}}\approx1{,}59\times10^3\ \text{spires·m}^{-1}$$

Puis :

$$N=nL\approx1{,}59\times10^3\times0{,}40\approx637\ \text{spires}$$

La mesure étant approximative et les spires réparties sur quatre couches entières, on retient en pratique environ **640 spires**, soit :

$$\boxed{160\ \text{spires par couche environ}}$$

## Exercice 5 — ce que l'on peut vraiment conclure

Le second tableau donne encore $k\approx2{,}0\times10^{-3}$ T·A$^{-1}$. On a toujours :

$$\mu_0=\frac{kL}{N}$$

Mais l'énoncé imprimé de l'exercice 5 ne fournit ni $L$ ni $N$ : la valeur numérique de $\mu_0$ ne peut donc pas être retrouvée **à partir de ce tableau seul**. Le résultat $1{,}25\times10^{-6}$ S.I. annoncé est proche de $4\pi\times10^{-7}=1{,}2566\times10^{-6}$, mais les données géométriques nécessaires ont été omises.

## Pour aller plus loin — documentation du PDF

Le champ magnétique modélise les effets des aimants, des courants et, plus généralement, des charges en mouvement. Il intervient dans la force de Lorentz et dans la réponse des matériaux : diamagnétisme, paramagnétisme et ferromagnétisme, réponse quantifiée par la susceptibilité magnétique. En régime variable, un champ électrique variable peut aussi engendrer un champ magnétique ; les deux champs deviennent alors indissociables dans le **champ électromagnétique**.

> **Astuce mémoire.** La pente du graphe est le pont entre l'expérience et la bobine : $k=B/I=\mu_0n$.` ,
    keyPoint: "La droite B = kI donne k ≈ 2,0×10⁻³ T·A⁻¹, puis n = k/μ₀ ≈ 1592 m⁻¹, N ≈ 637 et environ 160 spires par couche.",
    example: "Avec k = 2,0×10⁻³ T·A⁻¹ et L = 0,40 m : n ≈ 1592 m⁻¹, N ≈ 637 spires, soit environ 640 spires et 160 par couche.",
    methodSteps: [
      "Place I en abscisse et B en ordonnée, avec des unités explicites.",
      "Vérifie que les points suivent une droite passant près de l'origine.",
      "Calcule la pente k = ΔB/ΔI avec B converti en teslas.",
      "Identifie k = μ₀n puis calcule n = k/μ₀.",
      "Calcule N = nL et interprète l'arrondi avec le nombre entier de couches.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Expérience interactive",
      title: "La mesure B = f(I)",
      instruction: "Déplace le point le long des mesures et observe la proportionnalité entre B et I.",
      observation: "Les points expérimentaux entourent la droite B ≈ 2I en mT. La pente vaut environ 2 mT·A⁻¹, soit 2×10⁻³ T·A⁻¹.",
      formula: "B(mT) ≈ 2,0 × I(A)",
      formulaTex: "B\\,(\\mathrm{mT})\\approx2{,}0\\,I\\,(\\mathrm{A})",
      rule: {
        kind: "samples",
        points: [[0, 0], [0.5, 1], [1, 2], [1.5, 2.95], [2, 4.1], [2.5, 5], [3, 5.95]],
      },
      window: { xMin: 0, xMax: 3.2, yMin: 0, yMax: 6.5 },
      guides: [{ kind: "oblique", slope: 2, intercept: 0, label: "B = 2I (mT)" }],
      marker: { min: 0, max: 3, step: 0.5, initial: 0 },
    },
    questions: [
      choice("Que montre une droite B = f(I) passant par l'origine ?", ["B est proportionnel à I", "B est indépendant de I", "B est inversement proportionnel à I", "B est toujours nul"], 0, "La relation a la forme B = kI.", "Situation d'évaluation, question 3", 2),
      short("À partir de B = 6,0 mT pour I = 3,0 A, donne la pente k en mT·A⁻¹.", ["2", "2,0", "2.0", "2 mT/A", "2,0 mT/A"], "k = ΔB/ΔI = 6,0/3,0 = 2,0 mT·A⁻¹.", "Situation d'évaluation, question 4.1", 2),
      short("Convertis cette pente en T·A⁻¹.", ["2.10^-3", "2×10^-3", "2e-3", "0,002", "0.002", "2,0.10^-3"], "2,0 mT·A⁻¹ = 2,0×10⁻³ T·A⁻¹.", "Situation d'évaluation, question 4.1", 2),
      short("Calcule n = k/μ₀ en spires·m⁻¹, à l'unité près.", ["1592", "1591", "1591,5", "1591.5", "1592 spires/m"], "n = 2,0×10⁻³/(4π×10⁻⁷) ≈ 1591,5, soit 1592 m⁻¹.", "Situation d'évaluation, question 4.2", 3),
      short("Avec L = 0,40 m, calcule N à l'unité près.", ["637", "636", "636,6", "636.6", "637 spires"], "N = nL ≈ 1591,5×0,40 ≈ 636,6, soit 637 spires d'après la pente ajustée.", "Situation d'évaluation, question 4.3", 3),
      short("Quel nombre pratique de spires par couche retient-on pour quatre couches ?", ["160", "160 spires", "environ 160", "≈160"], "La mesure conduit à environ 637 spires ; un bobinage réparti en quatre couches suggère environ 640/4 = 160 spires par couche.", "Situation d'évaluation, question 4.4", 2),
      choice("Exercice 5 : peut-on calculer numériquement μ₀ avec le seul tableau B(I) imprimé ?", ["Non, car L et N ne sont pas fournis", "Oui, sans aucune autre donnée", "Non, car I est nul", "Oui, car μ₀ = k"], 0, "La relation μ₀ = kL/N exige la longueur et le nombre de spires.", "Exercice 5, question 4", 2),
      choice("Quelle relation permettrait de calculer μ₀ si L et N étaient connus ?", ["μ₀ = kL/N", "μ₀ = kN/L", "μ₀ = NI/k", "μ₀ = B+I"], 0, "De k = μ₀N/L, on tire μ₀ = kL/N.", "Exercice 5, solution", 2),
      choice("En régime variable, la documentation rappelle qu'un champ électrique variable peut…", ["engendrer un champ magnétique", "supprimer toute interaction", "changer le tesla en ampère", "rendre les charges immobiles"], 0, "C'est le lien entre champs électrique et magnétique dans l'électromagnétisme.", "IV. Documentation", 1),
      choice("La grandeur qui caractérise la réponse magnétique d'un matériau est…", ["la susceptibilité magnétique", "la température de fusion seulement", "la résistance mécanique", "la fréquence sonore"], 0, "La documentation cite la susceptibilité pour quantifier l'interaction matériau-champ.", "IV. Documentation", 1),
    ],
    corrections: [
      "Page 4 : le coefficient de proportionnalité vaut k ≈ 2×10⁻³ T·A⁻¹, et non « 2×10⁻³ mT » comme l'indique la ligne imprimée.",
      "Page 4 : N ≈ 637 provient d'une pente expérimentale arrondie. Une répartition physique sur quatre couches conduit raisonnablement à environ 640 spires, soit 160 par couche ; 637/4 n'est pas exactement 160.",
      "Pages 6-7, exercice 5 : l'énoncé ne donne ni la longueur L ni le nombre N de spires. La valeur numérique de μ₀ ne peut pas être déduite du seul tableau ; seule la relation μ₀ = kL/N est justifiée.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const magneticFieldPath: LearningPath = {
  id: "terminale-cd-magnetic-field",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C et D • Côte d'Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 6,
  title: "Champ magnétique",
  description: "Mettre en évidence un champ magnétique, lire ses lignes, orienter puis calculer le champ d'un solénoïde et exploiter expérimentalement la droite B = f(I).",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Définir un champ magnétique et donner les caractéristiques du vecteur B.",
    "Lire et orienter les lignes de champ d'un aimant ou d'un solénoïde.",
    "Déterminer les faces d'un solénoïde par la règle de la main droite.",
    "Calculer B, n, N ou I avec B = μ₀nI.",
    "Composer plusieurs champs et exploiter une courbe expérimentale B = f(I).",
  ],
  modules: [{
    id: "magnetic-field-mastery",
    title: "Maîtriser le champ magnétique",
    description: "Des premières interactions à l'identification expérimentale d'une bobine inconnue, un niveau après l'autre.",
    lessons: builtLevels,
  }],
};

export const magneticFieldPaths: LearningPath[] = [magneticFieldPath];
