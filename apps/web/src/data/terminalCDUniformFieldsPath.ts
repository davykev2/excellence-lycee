import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 04 de Physique (Terminales C et D) — commune aux deux séries.
const sourceDocument = "TleD_PHY_L4_Mouvement dans les champs g et E uniformes.pdf";

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
      introduction: "Applique cette démarche aux exercices du document source.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "Précise toujours le système, le référentiel et le repère — et projette bien le théorème du centre d’inertie sur chaque axe avant d’intégrer.",
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
    id: "uniform-field",
    title: "Le champ uniforme",
    summary: "Définir un champ uniforme et reconnaître les deux exemples au programme : le champ de pesanteur et le champ électrostatique entre deux plaques.",
    pages: "1",
    section: "1. Champ uniforme",
    durationMinutes: 12,
    xp: 40,
    body: String.raw`## Définition

> **Champ uniforme.** Un champ est **uniforme** dans une région de l’espace si les **caractéristiques du vecteur-champ** — **direction, sens et intensité** — sont **les mêmes en tout point** de cette région.

Autrement dit : le vecteur-champ est **le même partout**. Ses lignes de champ sont des **droites parallèles**, régulièrement espacées.

## Les deux exemples du programme

| Champ | Où | Vecteur-champ |
|---|---|---|
| **Champ de pesanteur** $\vec{g}$ | au voisinage de la Terre (petite région) | vertical, vers le bas, $g \approx 9{,}8\ \text{m·s}^{-2}$ |
| **Champ électrostatique** $\vec{E}$ | entre les armatures d’un **condensateur plan** chargé | perpendiculaire aux plaques, de la plaque **+** vers la plaque **−**, $E = \dfrac{U}{d}$ |

> **À retenir.** Ces deux champs uniformes jouent le même rôle dans la leçon : ils imposent au mobile une **accélération constante** (via le théorème du centre d’inertie), donc une **trajectoire parabolique**. La suite de la leçon traite ces deux cas en parallèle.`,
    keyPoint: "Champ uniforme : direction, sens et intensité identiques en tout point. Exemples : g (pesanteur, près de la Terre) et E (entre les plaques d’un condensateur, E = U/d).",
    example: "Entre deux plaques distantes de d = 3 cm sous U = 120 V : E = U/d = 120/0,03 = 4000 V·m⁻¹, uniforme.",
    methodSteps: [
      "Vérifie que direction, sens et intensité du champ sont les mêmes partout.",
      "Pour la pesanteur : g vertical vers le bas, sur une petite région.",
      "Pour l’électrostatique : E perpendiculaire aux plaques, du + vers le −.",
      "Relie E à la tension : E = U/d entre les armatures.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Qu’est-ce qu’un champ uniforme ?",
      instruction: "Sélectionne un élément pour comprendre ce qui rend un champ « uniforme » et ses deux exemples.",
      observation: "Uniforme = même vecteur partout (mêmes direction, sens, intensité). Les deux champs du programme, g et E, imposent une accélération constante au mobile.",
      rootLabel: "Champ uniforme",
      rootDetail: "Un vecteur-champ identique en tout point de la région",
      nodes: [
        { id: "direction", group: "Les trois caractéristiques", label: "Même direction", role: "Lignes de champ parallèles", detail: "En tout point, le vecteur-champ pointe dans la même direction. Ses lignes de champ sont des droites parallèles." },
        { id: "sens", group: "Les trois caractéristiques", label: "Même sens", role: "Toutes les flèches identiques", detail: "Le sens du vecteur-champ ne change pas d’un point à l’autre." },
        { id: "intensite", group: "Les trois caractéristiques", label: "Même intensité", role: "Norme constante", detail: "La valeur (norme) du champ est la même partout : les lignes de champ sont régulièrement espacées." },
        { id: "pesanteur", group: "Les deux exemples", label: "Champ de pesanteur g", role: "Près de la Terre", detail: "Sur une petite région au voisinage de la Terre, g est vertical, dirigé vers le bas, de valeur ≈ 9,8 m·s⁻². Il agit sur tout corps de masse m par le poids P = mg." },
        { id: "electrostatique", group: "Les deux exemples", label: "Champ électrostatique E", role: "Entre deux plaques", detail: "Entre les armatures d’un condensateur plan chargé, E est perpendiculaire aux plaques, dirigé du + vers le −, de valeur E = U/d. Il agit sur une charge q par la force F = qE." },
      ],
    },
    questions: [
      choice("Un champ est uniforme si, en tout point de la région…", ["sa direction, son sens et son intensité sont les mêmes", "seule son intensité est constante", "seule sa direction est constante", "sa valeur augmente avec la distance"], 0, "Les trois caractéristiques du vecteur-champ doivent être identiques partout.", "1. Champ uniforme", 2),
      choice("Où le champ électrostatique est-il uniforme ?", ["entre les armatures d’un condensateur plan chargé", "autour d’une charge ponctuelle", "loin de toute charge", "à la surface de la Terre"], 0, "Entre les plaques d’un condensateur plan, E est uniforme.", "1. Exemples", 1),
      short("Entre deux plaques distantes de d = 3 cm soumises à U = 120 V, calcule l’intensité du champ E (en V·m⁻¹).", ["4000", "4 000", "4000 V/m", "4.10^3"], "E = U/d = 120 / 0,03 = 4000 V·m⁻¹.", "Situation d’évaluation, question 2.1", 2),
      choice("« Un champ est uniforme si ses caractéristiques sont les mêmes en tout point de l’espace. » (Exercice 1)", ["Vrai", "Faux", "Vrai seulement pour g", "Faux, seulement l’intensité compte"], 0, "C’est la définition exacte : mêmes direction, sens et intensité en tout point.", "Exercice 1, affirmation 3", 1),
      choice("« Un champ électrostatique E est uniforme si sa norme est constante. » (Exercice 1)", ["Faux : il faut aussi même direction et même sens", "Vrai", "Vrai si E > 0", "Faux : la norme ne compte pas"], 0, "Une norme constante ne suffit pas : direction et sens doivent aussi être identiques partout.", "Exercice 1, affirmation 2", 2),
    ],
  },
  {
    id: "projectile-motion",
    title: "Le projectile dans le champ de pesanteur",
    summary: "Établir l’accélération, les équations horaires et l’équation de la trajectoire d’un projectile lancé dans le champ g uniforme.",
    pages: "1-2",
    section: "2. Mouvement d’un projectile dans le champ de pesanteur",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Conditions initiales

On étudie un projectile de masse $m$ dans le **référentiel terrestre supposé galiléen**, muni d’un repère $(O,\vec{i},\vec{j},\vec{k})$. Il est lancé à $t = 0$ avec une vitesse initiale $\vec{v}_0$ faisant un angle $\alpha$ avec l’horizontale. On **néglige les frottements** de l’air devant le poids.

## Accélération : le théorème du centre d’inertie

La seule force est le poids. Le TCI donne :

$$\vec{P} = m\,\vec{a} \;\Longrightarrow\; \vec{a} = \vec{g}$$

L’accélération est **constante**, égale à $\vec g$ (verticale, vers le bas), **indépendante de la masse**.

## Équations horaires

En projetant sur les axes (mouvement dans le plan vertical $xOz$, donc $y = 0$) :

| | Accélération | Vitesse | Position |
|---|---|---|---|
| **x** | $a_x = 0$ | $v_x = v_0\cos\alpha$ | $x = (v_0\cos\alpha)\,t$ |
| **z** | $a_z = -g$ | $v_z = -g\,t + v_0\sin\alpha$ | $z = -\tfrac{1}{2}g\,t^2 + (v_0\sin\alpha)\,t$ |

## Équation cartésienne de la trajectoire

On élimine $t$ : de $x = (v_0\cos\alpha)t$ on tire $t = \dfrac{x}{v_0\cos\alpha}$, que l’on reporte dans $z$ :

$$\boxed{z = -\frac{g}{2\,v_0^2\cos^2\alpha}\,x^2 + x\,\tan\alpha}$$

> **La trajectoire est une parabole.** Le terme en $x^2$ (négatif) traduit la courbure vers le bas due à la pesanteur ; le terme $x\tan\alpha$ traduit la direction de lancement.`,
    keyPoint: "Projectile : a = g (TCI, indépendant de m). Équations : x = (v₀cosα)t, z = -½gt² + (v₀sinα)t. Trajectoire parabolique : z = -g/(2v₀²cos²α)·x² + x·tanα.",
    example: "Pour v₀ = 20 m·s⁻¹, α = 45°, g = 10 : z = -0,025 x² + x — une parabole de portée 40 m.",
    methodSteps: [
      "Système : le projectile ; référentiel terrestre supposé galiléen ; frottements négligés.",
      "TCI : la seule force est le poids, donc a = g.",
      "Projette sur x et z pour obtenir vitesses puis positions par intégration.",
      "Élimine t entre x(t) et z(t) pour l’équation cartésienne de la trajectoire.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer le lancer",
      title: "Un projectile lancé sous un angle α",
      instruction: "Sélectionne un repère pour situer les conditions de lancement et l’accélération.",
      observation: "La seule force est le poids : a = g, verticale vers le bas, constante. La trajectoire est une parabole ouverte vers le bas.",
      caption: "Figure redessinée d’après le document officiel : lancer d’un projectile en O avec la vitesse v₀ inclinée de α.",
      viewBox: "0 0 340 200",
      shapes: [
        { shape: "line", x1: 45, y1: 165, x2: 320, y2: 165, tone: "muted" },
        { shape: "line", x1: 45, y1: 165, x2: 45, y2: 40, tone: "muted" },
        { shape: "text", x: 38, y: 48, content: "z", anchor: "end" },
        { shape: "text", x: 316, y: 182, content: "x", anchor: "end" },
        { shape: "text", x: 38, y: 180, content: "O", anchor: "end" },
        { shape: "path", d: "M45 165 Q 175 35 300 165", tone: "accent" },
        { shape: "line", x1: 45, y1: 165, x2: 95, y2: 128, tone: "soft" },
        { shape: "path", d: "M86 128 L96 127 L92 137 Z", tone: "soft" },
        { shape: "text", x: 100, y: 122, content: "v0", anchor: "start" },
        { shape: "text", x: 74, y: 160, content: "α", anchor: "middle" },
        { shape: "line", x1: 172, y1: 52, x2: 172, y2: 90, tone: "fill" },
        { shape: "path", d: "M167 82 L172 92 L177 82 Z", tone: "fill" },
        { shape: "text", x: 182, y: 78, content: "a = g", anchor: "start" },
        { shape: "text", x: 300, y: 182, content: "P", anchor: "middle" },
      ],
      hotspots: [
        { id: "launch", number: 1, label: "Le point de lancement O", detail: "Origine du repère et des dates. Le projectile part de O à t = 0 avec la vitesse v₀.", x: 45, y: 165 },
        { id: "v0", number: 2, label: "La vitesse initiale v₀", detail: "Inclinée d’un angle α sur l’horizontale. Ses composantes : v₀cosα (horizontale) et v₀sinα (verticale).", x: 92, y: 130 },
        { id: "angle", number: 3, label: "L’angle de tir α", detail: "Angle entre v₀ et l’horizontale. Il fixe la répartition de la vitesse et, plus tard, la portée (maximale pour α = 45°).", x: 74, y: 158 },
        { id: "accel", number: 4, label: "L’accélération a = g", detail: "La seule force est le poids : a = g, verticale, vers le bas, constante et indépendante de la masse. C’est elle qui courbe la trajectoire.", x: 172, y: 72 },
        { id: "parabola", number: 5, label: "La trajectoire parabolique", detail: "Parabole d’équation z = -g/(2v₀²cos²α)·x² + x·tanα, ouverte vers le bas.", x: 175, y: 60 },
      ],
    },
    questions: [
      choice("Quelle est l’accélération d’un projectile dans le champ de pesanteur (frottements négligés) ?", ["a = g (constante, vers le bas)", "a = 0", "a = v₀/t", "a dépend de la masse"], 0, "Le TCI avec le seul poids donne a = g.", "2.2 Vecteur accélération", 2),
      choice("Le mouvement d’un projectile en chute libre dépend-il de sa masse ?", ["Non, il en est indépendant", "Oui, il augmente avec la masse", "Oui, il diminue avec la masse", "Seulement si α = 45°"], 0, "a = g ne contient pas m : le mouvement est indépendant de la masse.", "Exercice 1, affirmation 1", 2),
      short("Donne l’équation horaire $x(t)$ d’un projectile lancé à v₀ sous l’angle α.", ["(v0cosα)t", "v0cosα t", "x=(v0cosα)t", "v0.cosα.t"], "Sur l’axe horizontal, a_x = 0 donc x = (v₀cosα)·t.", "2.3 Équations horaires", 2),
      short("Donne l’équation horaire $z(t)$ (axe vertical ascendant).", ["-1/2 g t^2 + (v0sinα)t", "-½gt²+(v0sinα)t", "-0,5 g t^2 + v0 sinα t", "-1/2gt^2+v0sinα t"], "a_z = -g, d’où v_z = -gt + v₀sinα puis z = -½gt² + (v₀sinα)t.", "2.3 Équations horaires", 2),
      choice("Quelle est la nature de la trajectoire d’un projectile ?", ["une parabole", "une droite", "un cercle", "une ellipse"], 0, "z = -g/(2v₀²cos²α)·x² + x·tanα : équation du second degré en x.", "2.4 Équation cartésienne", 1),
    ],
  },
  {
    id: "projectile-range-height",
    title: "La flèche et la portée",
    summary: "Calculer la hauteur maximale (flèche) et la portée d’un projectile, et retrouver l’angle de portée maximale.",
    pages: "2, 7-8",
    section: "2.4-2.5 Flèche et portée",
    durationMinutes: 18,
    xp: 65,
    body: String.raw`## La flèche (hauteur maximale)

C’est la hauteur maximale $Z_S = h_{max}$ atteinte au sommet $S$ de la trajectoire. **Au sommet, la composante verticale de la vitesse s’annule** :

$$v_{Sz} = 0 \;:\; -g\,t_S + v_0\sin\alpha = 0 \;\Longrightarrow\; t_S = \frac{v_0\sin\alpha}{g}$$

En reportant $t_S$ dans $z(t)$ :

$$\boxed{Z_S = h_{max} = \frac{v_0^2\sin^2\alpha}{2\,g}}$$

## La portée

C’est la distance $OP$ entre le point de lancement $O$ et le point de chute $P$ sur l’axe horizontal $(Ox)$. **En $P$, $z = 0$** ; on trouve :

$$\boxed{x_P = \frac{v_0^2\sin 2\alpha}{g}}$$

> **Remarque (à retenir).** La portée est **maximale** quand $\sin 2\alpha = 1$, c’est-à-dire pour :
$$\alpha = 45°$$

## Vitesse au point de chute

Par symétrie de la parabole, la valeur de la vitesse au point de chute $P$ (à la même altitude que le lancement) est **égale à la vitesse de lancement** $v_0$.`,
    keyPoint: "Flèche : h_max = v₀²sin²α/(2g), au sommet où v_z = 0. Portée : x_P = v₀²sin(2α)/g, maximale pour α = 45°. Vitesse en P (même altitude) = v₀.",
    example: "Ex2 : v₀ = 200 m·s⁻¹, α = 20°, g = 9,8 → h_max = 238,7 m ; durée du vol t_P = 13,96 s ; vitesse d’impact = 200 m·s⁻¹.",
    methodSteps: [
      "Pour la flèche : écris v_z = 0 pour trouver t_S = v₀sinα/g, puis h_max = v₀²sin²α/(2g).",
      "Pour la portée : écris z = 0 (au point de chute) pour trouver x_P = v₀²sin(2α)/g.",
      "Retiens que la portée est maximale pour α = 45°.",
      "Pour le temps de vol : t_P = 2v₀sinα/g (double du temps de montée).",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Visualiser",
      title: "La parabole : flèche et portée",
      instruction: "Déplace le point le long de la trajectoire : repère le sommet (flèche) et le point de chute (portée).",
      observation: "Pour v₀ = 20 m·s⁻¹, α = 45°, g = 10 : z = -0,025 x² + x. Le sommet (flèche) est à x = 20 m, z = 10 m ; la portée (retour à z = 0) est à x = 40 m — la portée est maximale car α = 45°.",
      formula: "z = -0,025 x² + x  (v₀ = 20 m·s⁻¹, α = 45°, g = 10)",
      formulaTex: "z=-\\dfrac{g}{2v_0^2\\cos^2\\alpha}\\,x^2+x\\tan\\alpha",
      rule: { kind: "polynomial", coefficients: [0, 1, -0.025] },
      window: { xMin: 0, xMax: 40, yMin: 0, yMax: 12 },
      marker: { min: 0, max: 40, step: 1, initial: 20 },
    },
    questions: [
      choice("Au sommet de la trajectoire (flèche), que vaut la composante verticale de la vitesse ?", ["v_z = 0", "v_z = v₀", "v_z = -g", "v_z = v₀sinα"], 0, "Au sommet, la vitesse est horizontale : v_z = 0. C’est ce qui donne t_S = v₀sinα/g.", "2.4 Flèche", 2),
      short("Donne l’expression de la flèche (hauteur maximale) h_max.", ["v0^2 sin^2 α / (2g)", "v0²sin²α/2g", "(v0 sinα)^2/(2g)", "v0^2sin^2(α)/(2g)"], "h_max = v₀²sin²α/(2g).", "2.4 Flèche", 2),
      choice("Pour quel angle la portée d’un projectile est-elle maximale ?", ["α = 45°", "α = 30°", "α = 60°", "α = 90°"], 0, "x_P = v₀²sin(2α)/g est maximale pour sin(2α) = 1, soit α = 45°.", "2.5 Portée, remarque", 2),
      short("Ex2 : projectile v₀ = 200 m·s⁻¹, α = 20°, g = 9,8 m·s⁻². Calcule la hauteur atteinte h (en m).", ["238,7", "238.7", "≈238,7", "238,7 m"], "h = v₀²sin²α/(2g) = 200²·sin²20° / (2×9,8) ≈ 238,7 m.", "Exercice 2, question 1", 2),
      short("Pour ce même projectile, quelle est la vitesse au point d’impact P (en m·s⁻¹) ?", ["200", "200 m/s", "=v0", "v0"], "Par symétrie (même altitude que le lancement), la vitesse d’impact vaut v₀ = 200 m·s⁻¹.", "Exercice 2, question 3", 2),
    ],
  },
  {
    id: "charged-particle-motion",
    title: "La particule chargée dans le champ E",
    summary: "Établir l’accélération, les équations horaires et la trajectoire parabolique d’une particule chargée dans un champ électrostatique uniforme.",
    pages: "3-4",
    section: "3. Mouvement d’une particule chargée dans un champ électrostatique",
    durationMinutes: 18,
    xp: 70,
    body: String.raw`## Conditions initiales

Une particule de charge $q$ ($q > 0$) et de masse $m$ pénètre en $O$ entre les armatures d’un **condensateur plan**, dans le **référentiel du laboratoire supposé galiléen** $(O,\vec{i},\vec{j},\vec{k})$, avec une vitesse initiale **horizontale** $\vec{v}_0 = v_0\,\vec{i}$. On **néglige le poids** $\vec{P}$ devant la force électrostatique $\vec{F} = q\vec{E}$.

## Accélération : le théorème du centre d’inertie

$$\vec{F} = q\vec{E} = m\,\vec{a} \;\Longrightarrow\; \vec{a} = \frac{q}{m}\,\vec{E}$$

L’accélération est **constante**, portée par $\vec E$ (perpendiculaire aux plaques).

## Équations horaires

En prenant $\vec E$ selon l’axe $Oy$ (perpendiculaire aux plaques) :

| | Accélération | Vitesse | Position |
|---|---|---|---|
| **x** | $a_x = 0$ | $v_x = v_0$ | $x = v_0\,t$ |
| **y** | $a_y = \dfrac{q}{m}E$ | $v_y = \dfrac{q}{m}E\,t$ | $y = \dfrac{1}{2}\dfrac{q}{m}E\,t^2$ |

## Équation cartésienne de la trajectoire

On élimine $t = \dfrac{x}{v_0}$ dans $y$ :

$$\boxed{y = \frac{q\,E}{2\,m\,v_0^2}\,x^2 = \frac{q\,U}{2\,m\,d\,v_0^2}\,x^2}\qquad(\text{car } E = \tfrac{U}{d})$$

> **La même parabole que le projectile.** Entre les plaques, la trajectoire est une **parabole** : le champ $\vec E$ joue exactement le rôle que $\vec g$ jouait pour le projectile. Hors des plaques (plus de champ), le mouvement redevient rectiligne uniforme.`,
    keyPoint: "Particule chargée : a = (q/m)·E (poids négligé). x = v₀t, y = ½(q/m)Et². Trajectoire parabolique : y = qE/(2mv₀²)·x² = qU/(2mdv₀²)·x².",
    example: "Entre deux plaques (E = U/d), un électron entrant horizontalement décrit une parabole qui le rapproche de la plaque positive.",
    methodSteps: [
      "Système : la particule ; référentiel du laboratoire supposé galiléen ; poids négligé.",
      "TCI : F = qE = ma, donc a = (q/m)·E, portée par E.",
      "Projette : a_x = 0 (mouvement uniforme en x), a_y = qE/m (uniformément varié en y).",
      "Élimine t = x/v₀ pour obtenir y = qE/(2mv₀²)·x² = qU/(2mdv₀²)·x².",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer les forces",
      title: "Une charge déviée entre les plaques",
      instruction: "Sélectionne un repère pour suivre la particule dans le condensateur.",
      observation: "Entre les plaques, la force qE (constante) courbe la trajectoire en parabole. En sortant, il n’y a plus de champ : le mouvement redevient rectiligne uniforme.",
      caption: "Figure redessinée d’après le document officiel : une charge q entre en O à v₀ horizontale et est déviée par le champ E.",
      viewBox: "0 0 340 200",
      shapes: [
        { shape: "line", x1: 70, y1: 55, x2: 260, y2: 55, tone: "outline" },
        { shape: "text", x: 66, y: 50, content: "+ + + + +", anchor: "start" },
        { shape: "line", x1: 70, y1: 150, x2: 260, y2: 150, tone: "outline" },
        { shape: "text", x: 66, y: 168, content: "− − − − −", anchor: "start" },
        { shape: "line", x1: 130, y1: 70, x2: 130, y2: 135, tone: "soft" },
        { shape: "path", d: "M125 127 L130 137 L135 127 Z", tone: "soft" },
        { shape: "text", x: 138, y: 100, content: "E", anchor: "start" },
        { shape: "line", x1: 30, y1: 100, x2: 72, y2: 100, tone: "fill" },
        { shape: "path", d: "M64 95 L74 100 L64 105 Z", tone: "fill" },
        { shape: "text", x: 34, y: 92, content: "v0", anchor: "start" },
        { shape: "text", x: 66, y: 114, content: "O", anchor: "end" },
        { shape: "path", d: "M70 100 Q 190 100 262 132", tone: "accent" },
        { shape: "line", x1: 262, y1: 132, x2: 315, y2: 148, tone: "accent" },
        { shape: "text", x: 150, y: 40, content: "ℓ", anchor: "middle" },
        { shape: "line", x1: 70, y1: 32, x2: 260, y2: 32, tone: "muted" },
      ],
      hotspots: [
        { id: "entry", number: 1, label: "L’entrée en O (v₀ horizontale)", detail: "La particule pénètre au point O avec une vitesse v₀ = v₀·i, horizontale, entre les deux armatures.", x: 60, y: 100 },
        { id: "field", number: 2, label: "Le champ E", detail: "Uniforme, perpendiculaire aux plaques, dirigé du + vers le −, de valeur E = U/d.", x: 130, y: 100 },
        { id: "force", number: 3, label: "La force qE", detail: "Force électrostatique F = qE (le poids est négligé). Elle donne l’accélération constante a = (q/m)E, perpendiculaire à v₀.", x: 130, y: 120 },
        { id: "parabola", number: 4, label: "La trajectoire parabolique", detail: "Entre les plaques, y = qE/(2mv₀²)·x² : une parabole, comme pour le projectile.", x: 190, y: 112 },
        { id: "exit", number: 5, label: "La sortie du condensateur", detail: "Au-delà des plaques, il n’y a plus de champ : la particule repart en ligne droite (mouvement rectiligne uniforme).", x: 288, y: 140 },
      ],
    },
    questions: [
      choice("Quelle est l’accélération d’une particule de charge q dans un champ E (poids négligé) ?", ["a = (q/m)·E", "a = g", "a = qE", "a = mE/q"], 0, "Le TCI : qE = ma, donc a = (q/m)·E.", "3.2 Vecteur accélération", 2),
      choice("Le mouvement d’une particule chargée dans un champ électrostatique dépend-il de sa masse ?", ["Oui, via a = (q/m)·E", "Non, jamais", "Non, comme le projectile", "Seulement si q < 0"], 0, "a = (q/m)·E contient m : contrairement au projectile, le mouvement dépend de la masse.", "Exercice 1, affirmation 4", 2),
      short("Donne l’équation horaire $x(t)$ de la particule (axe horizontal).", ["v0 t", "v0.t", "x=v0 t", "v0t"], "a_x = 0 donc x = v₀·t (mouvement uniforme en x).", "3.3 Équations horaires", 1),
      short("Donne l’équation cartésienne de la trajectoire en fonction de q, E, m, v₀.", ["qE/(2mv0^2) x^2", "qE x^2/(2mv0^2)", "qEx²/(2mv0²)", "qE/(2mv0²)x^2"], "En éliminant t = x/v₀ : y = qE/(2mv₀²)·x².", "3.4 Équation cartésienne", 2),
      choice("En sortant du condensateur (plus de champ), le mouvement de la particule devient…", ["rectiligne uniforme", "parabolique", "circulaire", "immobile"], 0, "Sans force, le mouvement est rectiligne uniforme (principe de l’inertie).", "3.5 Déviation", 1),
    ],
  },
  {
    id: "electrostatic-deflection",
    title: "Déviation angulaire et déflexion",
    summary: "Distinguer la déviation angulaire (à la sortie des plaques) et la déflexion sur l’écran, et établir leurs expressions.",
    pages: "4",
    section: "3.5-3.6 Déviation et déflexion",
    durationMinutes: 16,
    xp: 80,
    body: String.raw`## La déviation angulaire α

C’est l’angle entre la vitesse d’entrée $\vec{v}_0$ et la vitesse de sortie $\vec{v}_S$. À la sortie des plaques (en $x = \ell$, à l’instant $t = \dfrac{\ell}{v_0}$) :

$$\tan\alpha = \frac{v_{Sy}}{v_{Sx}} = \frac{q\,E\,\ell}{m\,v_0^2}$$

## La déflexion électrostatique Y

C’est la distance $Y = O'P$ mesurée **sur l’écran**, entre le point d’impact $P$ de la particule déviée et le point $O'$ qu’elle aurait atteint **sans déviation**. En notant $D$ la distance du centre des plaques à l’écran et $U_{AB}$ la tension entre les plaques :

$$\boxed{Y = \frac{q\,\ell\,D}{m\,d\,v_0^2}\,U_{AB}}$$

> **Le résultat clé.** La déflexion $Y$ est **proportionnelle à la tension** $U_{AB}$ appliquée aux plaques. C’est le principe de l’**oscilloscope** : en faisant varier $U$, on déplace le spot sur l’écran proportionnellement au signal.

> **Deux zones, deux mouvements.** Entre les plaques : parabole (champ $\vec E$). Après les plaques : ligne droite prolongeant la vitesse de sortie $\vec v_S$, jusqu’à l’écran.`,
    keyPoint: "Déviation angulaire (sortie des plaques) : tanα = qEℓ/(mv₀²). Déflexion sur l’écran : Y = qℓD·U/(mdv₀²), proportionnelle à la tension U (principe de l’oscilloscope).",
    example: "Ex4 : électron, ℓ = 5 cm, d = 2 cm, U = 100 V, v₀ = 1,30×10⁷ m·s⁻¹ → sortie y_M = 6,5 mm, angle θ = 14,57°.",
    methodSteps: [
      "À la sortie (x = ℓ, t = ℓ/v₀), calcule v_Sy = (q/m)E·t et v_Sx = v₀.",
      "Déviation angulaire : tanα = v_Sy/v_Sx = qEℓ/(mv₀²).",
      "Après les plaques : le mouvement est rectiligne (droite de pente tanα).",
      "Déflexion sur l’écran à la distance D : Y = qℓD·U/(mdv₀²).",
    ],
    interaction: timeline(
      [
        { label: "Entrée en O", shortLabel: "v₀", detail: "La particule entre entre les plaques avec une vitesse v₀ horizontale, perpendiculaire au champ E." },
        { label: "Entre les plaques : la parabole", shortLabel: "Parabole", detail: "La force qE (constante) dévie la particule : trajectoire parabolique y = qE/(2mv₀²)·x², sur la longueur ℓ des plaques." },
        { label: "Sortie : déviation angulaire α", shortLabel: "Angle α", detail: "En sortant, la vitesse fait un angle α avec l’horizontale : tanα = v_Sy/v_Sx = qEℓ/(mv₀²)." },
        { label: "Vol libre vers l’écran", shortLabel: "Ligne droite", detail: "Au-delà des plaques il n’y a plus de champ : la particule file en ligne droite, prolongeant sa vitesse de sortie, sur la distance D." },
        { label: "Impact : déflexion Y", shortLabel: "Déflexion Y", detail: "Sur l’écran, l’écart au point non dévié est Y = qℓD·U/(mdv₀²), proportionnel à la tension U : c’est le principe de l’oscilloscope." },
      ],
      "Le trajet de la particule, de l’entrée à l’écran",
      "Suis les cinq étapes, des plaques jusqu’à l’impact sur l’écran.",
      "Deux zones : parabole entre les plaques, puis ligne droite jusqu’à l’écran.",
    ),
    questions: [
      choice("La déviation angulaire α d’une particule à la sortie des plaques vérifie…", ["tanα = qEℓ/(mv₀²)", "tanα = mv₀²/(qEℓ)", "tanα = qE/(mℓ)", "tanα = v₀/g"], 0, "tanα = v_Sy/v_Sx avec v_Sy = (q/m)E·(ℓ/v₀) et v_Sx = v₀.", "3.5 Déviation électrostatique", 2),
      short("Donne l’expression de la déflexion électrostatique Y sur l’écran (en fonction de q, ℓ, D, m, d, v₀, U).", ["qℓD U/(mdv0^2)", "q l D U/(m d v0^2)", "qℓDU/(mdv0²)", "q ℓ D U /(m d v0^2)"], "Y = qℓD·U/(mdv₀²).", "3.6 Déflexion électrostatique", 2),
      choice("De quelle grandeur la déflexion Y est-elle proportionnelle ?", ["de la tension U appliquée aux plaques", "de la masse de la particule", "du carré de la longueur des plaques", "de la distance à l’écran au carré"], 0, "Y ∝ U : c’est le principe de l’oscilloscope.", "3.6 Déflexion électrostatique", 2),
      choice("Entre la sortie des plaques et l’écran, le mouvement de la particule est…", ["rectiligne uniforme", "parabolique", "circulaire", "accéléré"], 0, "Plus de champ ⇒ plus de force ⇒ mouvement rectiligne uniforme.", "3.6 Déflexion électrostatique", 1),
      short("Ex4 : électron, ℓ = 5 cm, d = 2 cm, U = 100 V, v₀ = 1,30×10⁷ m·s⁻¹. Calcule le déplacement vertical y_M à la sortie (en mm).", ["6,5", "6.5", "≈6,5", "6,5 mm"], "y_M = eU·ℓ²/(2mdv₀²) ≈ 6,5 mm.", "Exercice 4, question 3.1", 3),
    ],
  },
  {
    id: "oscilloscope-mission",
    title: "Mission finale : la déflexion dans l’oscilloscope",
    summary: "Mobiliser énergie cinétique, champ E et déflexion pour déterminer le déplacement du spot d’un oscilloscope sur l’écran.",
    pages: "4-6",
    section: "Situation d’évaluation (oscilloscope)",
    durationMinutes: 22,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

Dans un **oscilloscope**, la cathode $C$ émet des électrons (vitesse négligeable). Ils sont accélérés jusqu’à l’anode $A$ par la tension $U_0 = V_A - V_C$, la traversent par une ouverture $O_2$, puis pénètrent en $O$ entre deux plaques horizontales $P$ et $P'$ (longueur $\ell$, distance $d$) sous la tension $U_{PP'}$. Ils frappent enfin un écran $(E)$ à la distance $L$ du centre des plaques. **On cherche la déflexion $Y$ du spot.**

**Données** : $|U_0| = 1{,}27\ \text{kV}$ ; $e = 1{,}6\times10^{-19}\ \text{C}$ ; $m = 9{,}1\times10^{-31}\ \text{kg}$ ; $L = 18\ \text{cm}$ ; $d = 3\ \text{cm}$ ; $\ell = 8\ \text{cm}$ ; $U_{PP'} = 120\ \text{V}$.

## 1. Vitesse d’entrée v₀ (théorème de l’énergie cinétique)

Entre $C$ et $O_2$, seule la force électrique travaille. Le TEC donne $E_C = e\,U_0$ (car $v_C = 0$) :

$$E_C = e\,U_0 = 1{,}6\times10^{-19} \times 1270 \approx 2{,}03\times10^{-16}\ \text{J}$$

Puis $E_C = \tfrac{1}{2}m v_0^2$ donne :

$$v_0 = \sqrt{\frac{2\,e\,U_0}{m}} \approx 2{,}11\times10^{7}\ \text{m·s}^{-1}$$

## 2. Le champ entre les plaques

$$E = \frac{U_{PP'}}{d} = \frac{120}{0{,}03} = 4000\ \text{V·m}^{-1}\qquad;\qquad a_y = \frac{e\,E}{m}$$

## 3. La déflexion Y

$$\boxed{Y = \frac{e\,L\,\ell}{m\,d\,v_0^2}\,U_{PP'} \approx 2{,}27\times10^{-2}\ \text{m} = 2{,}27\ \text{cm}}$$

> **Ce que révèle la mission.** Deux théorèmes s’enchaînent : le **TEC** donne la vitesse d’entrée $v_0$ (phase d’accélération), puis la **déflexion** donne le déplacement du spot (phase de déviation). Et $Y \propto U_{PP'}$ : voilà comment un oscilloscope « dessine » une tension sur son écran.`,
    keyPoint: "Oscilloscope : (1) TEC C→O donne E_C = eU₀ puis v₀ = √(2eU₀/m) ≈ 2,11×10⁷ m·s⁻¹ ; (2) E = U/d = 4000 V·m⁻¹ ; (3) déflexion Y = eLℓU/(mdv₀²) ≈ 2,27 cm.",
    example: "v₀ = √(2×1,6×10⁻¹⁹×1270 / 9,1×10⁻³¹) ≈ 2,11×10⁷ m·s⁻¹ ; Y ≈ 2,27 cm.",
    methodSteps: [
      "Phase d’accélération : TEC entre C et O ⟹ E_C = eU₀, puis v₀ = √(2eU₀/m).",
      "Caractérise le champ entre les plaques : E = U/d, a_y = eE/m.",
      "Établis la trajectoire parabolique entre les plaques : y = eU/(2mdv₀²)·x².",
      "Déflexion sur l’écran : Y = eLℓ·U/(mdv₀²).",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer le dispositif",
      title: "L’oscilloscope : de la cathode à l’écran",
      instruction: "Sélectionne un repère pour suivre l’électron, de son accélération à son impact.",
      observation: "L’électron est d’abord accéléré (C→A, gain de vitesse v₀), puis dévié entre les plaques (parabole), puis file droit jusqu’à l’écran où il frappe à la distance Y du point non dévié.",
      caption: "Figure schématique d’après le document officiel : cathode C, anode A, plaques P/P' et écran (E).",
      viewBox: "0 0 380 200",
      shapes: [
        { shape: "line", x1: 24, y1: 70, x2: 24, y2: 130, tone: "fill" },
        { shape: "text", x: 20, y: 62, content: "C", anchor: "middle" },
        { shape: "line", x1: 70, y1: 70, x2: 70, y2: 130, tone: "outline" },
        { shape: "text", x: 70, y: 62, content: "A", anchor: "middle" },
        { shape: "line", x1: 130, y1: 74, x2: 250, y2: 74, tone: "outline" },
        { shape: "text", x: 190, y: 66, content: "P", anchor: "middle" },
        { shape: "line", x1: 130, y1: 126, x2: 250, y2: 126, tone: "outline" },
        { shape: "text", x: 190, y: 142, content: "P'", anchor: "middle" },
        { shape: "line", x1: 350, y1: 40, x2: 350, y2: 170, tone: "muted" },
        { shape: "text", x: 360, y: 44, content: "(E)", anchor: "start" },
        { shape: "line", x1: 24, y1: 100, x2: 130, y2: 100, tone: "soft" },
        { shape: "path", d: "M122 95 L132 100 L122 105 Z", tone: "soft" },
        { shape: "text", x: 96, y: 94, content: "v0", anchor: "middle" },
        { shape: "path", d: "M130 100 Q 210 100 250 118", tone: "accent" },
        { shape: "line", x1: 250, y1: 118, x2: 350, y2: 150, tone: "accent" },
        { shape: "line", x1: 250, y1: 100, x2: 350, y2: 100, tone: "soft" },
        { shape: "text", x: 344, y: 96, content: "O'", anchor: "end" },
        { shape: "text", x: 360, y: 154, content: "P", anchor: "start" },
        { shape: "line", x1: 356, y1: 100, x2: 356, y2: 150, tone: "fill" },
        { shape: "text", x: 366, y: 128, content: "Y", anchor: "start" },
      ],
      hotspots: [
        { id: "accel", number: 1, label: "L’accélération C → A", detail: "Les électrons partent de la cathode C (vitesse ≈ 0) et sont accélérés par U₀. Le TEC donne E_C = eU₀, puis v₀ = √(2eU₀/m).", x: 47, y: 100 },
        { id: "entry", number: 2, label: "L’entrée en O (v₀)", detail: "L’électron pénètre entre les plaques avec la vitesse v₀ ≈ 2,11×10⁷ m·s⁻¹, horizontale.", x: 130, y: 100 },
        { id: "plates", number: 3, label: "Les plaques P / P'", detail: "Longueur ℓ = 8 cm, distance d = 3 cm, tension U = 120 V. Le champ E = U/d = 4000 V·m⁻¹ dévie l’électron : parabole.", x: 190, y: 100 },
        { id: "freeflight", number: 4, label: "Le vol libre vers l’écran", detail: "Après les plaques, plus de champ : l’électron file en ligne droite jusqu’à l’écran (E), à la distance L = 18 cm.", x: 300, y: 128 },
        { id: "deflection", number: 5, label: "La déflexion Y", detail: "Écart entre l’impact P et le point non dévié O'. Y = eLℓ·U/(mdv₀²) ≈ 2,27 cm, proportionnel à la tension U.", x: 356, y: 126 },
      ],
    },
    questions: [
      choice("Quel est le signe de la tension accélératrice U₀ = V_A − V_C ?", ["U₀ > 0 (les électrons sont attirés par l’anode)", "U₀ < 0", "U₀ = 0", "On ne peut pas savoir"], 0, "Les électrons (charge négative) sont attirés par l’anode A : V_A > V_C, donc U₀ > 0.", "Situation d’évaluation, question 1.1", 2),
      short("Calcule l’énergie cinétique E_C des électrons en O (en J), avec U₀ = 1270 V.", ["2,03.10^-16", "2,03×10^-16", "2.03e-16", "≈2,03.10^-16"], "Le TEC : E_C = e·U₀ = 1,6×10⁻¹⁹ × 1270 ≈ 2,03×10⁻¹⁶ J.", "Situation d’évaluation, question 1.2.1", 2),
      short("Déduis-en la vitesse d’entrée v₀ des électrons (en m·s⁻¹).", ["2,11.10^7", "2,11×10^7", "2.11e7", "≈2,11.10^7"], "v₀ = √(2eU₀/m) = √(2×2,03×10⁻¹⁶ / 9,1×10⁻³¹) ≈ 2,11×10⁷ m·s⁻¹.", "Situation d’évaluation, question 1.2.2", 3),
      short("Calcule le champ électrique E entre les plaques (en V·m⁻¹), avec U = 120 V et d = 3 cm.", ["4000", "4 000", "4000 V/m", "4.10^3"], "E = U/d = 120 / 0,03 = 4000 V·m⁻¹.", "Situation d’évaluation, question 2.1", 2),
      short("Détermine la déflexion Y du spot sur l’écran (en cm).", ["2,27", "2.27", "≈2,27", "2,27 cm"], "Y = eLℓ·U/(mdv₀²) ≈ 2,27×10⁻² m = 2,27 cm.", "Situation d’évaluation, question 4", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const uniformFieldsPath: LearningPath = {
  id: "terminale-cd-uniform-fields",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C et D • Côte d’Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 1, title: "Mécanique" },
  chapterNumber: 4,
  title: "Mouvements dans les champs g et E uniformes",
  description: "Définir un champ uniforme, puis établir en parallèle le mouvement d’un projectile dans le champ de pesanteur et celui d’une particule chargée dans un champ électrostatique, jusqu’à la déflexion dans un oscilloscope.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Définir un champ uniforme et reconnaître les champs g et E.",
    "Établir les équations horaires et la trajectoire parabolique d’un projectile.",
    "Calculer la flèche, la portée et l’angle de portée maximale.",
    "Étudier le mouvement d’une particule chargée et calculer la déflexion électrostatique.",
  ],
  modules: [{
    id: "uniform-fields-mastery",
    title: "Maîtriser les mouvements dans les champs uniformes",
    description: "Du champ uniforme au projectile, puis à la particule chargée et à l’oscilloscope, un niveau après l’autre.",
    lessons: builtLevels,
  }],
};

export const uniformFieldsPaths: LearningPath[] = [uniformFieldsPath];
