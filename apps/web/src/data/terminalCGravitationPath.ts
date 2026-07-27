import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 03 de Physique (Terminale C uniquement) — la Terminale D ne traite pas ce chapitre.
const sourceDocument = "TleC_PHY_L3_Interaction gravitationnelle.pdf";

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
      tip: "Précise toujours le système, le référentiel (géocentrique pour un satellite) et l’unité : un champ de gravitation est en N·kg⁻¹ (ou m·s⁻²), une vitesse angulaire en rad·s⁻¹.",
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
  eyebrow: "Repères",
  title,
  instruction,
  observation,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
});

const levels: LevelSeed[] = [
  {
    id: "newton-law",
    title: "La loi d’attraction universelle de Newton",
    summary: "Énoncer la force gravitationnelle entre deux corps et calculer son intensité : la brique de base de toute la leçon.",
    pages: "1-2",
    section: "1. Force d’interaction gravitationnelle",
    durationMinutes: 15,
    xp: 45,
    body: String.raw`## L’énoncé de la loi de Newton

> **Loi d’attraction universelle.** Deux corps ponctuels $A$ et $B$, de masses respectives $m_A$ et $m_B$, situés à une distance $r$ l’un de l’autre, **s’attirent mutuellement** avec des forces d’intensités **proportionnelles à leurs masses** et **inversement proportionnelles au carré de la distance** $r$.

Ces forces sont les **forces gravitationnelles**.

## L’expression vectorielle

En notant $\vec{u}$ le vecteur unitaire dirigé de $A$ vers $B$ (avec $r = AB$) :

$$\vec{F}_{A/B} = -\vec{F}_{B/A} = -\frac{G\,m_A\,m_B}{r^2}\,\vec{u}$$

et leur intensité commune :

$$F_{A/B} = F_{B/A} = \frac{G\,m_A\,m_B}{r^2}$$

$G$ est la **constante gravitationnelle** :

$$G = 6{,}67\times10^{-11}\ \text{N·m}^2\text{·kg}^{-2}\quad(\text{ou } \text{m}^3\text{·kg}^{-1}\text{·s}^{-2})$$

## Le cas des corps sphériques

Cette loi s’applique aux **solides à répartition sphérique de masse** : on admet alors qu’ils se comportent comme des **points matériels situés en leurs centres**, portant toute la masse du corps.

> **À ne jamais oublier.** Les forces gravitationnelles sont **toujours attractives** : $\vec{F}_{A/B}$ et $\vec{F}_{B/A}$ pointent l’une vers l’autre, opposées et de même intensité (action-réaction).`,
    keyPoint: "F = G·mₐ·m_B / r² ; forces toujours attractives ; G = 6,67×10⁻¹¹ N·m²·kg⁻².",
    example: "Uranus–Ariel (r = 192 000 km) : F = G·m_U·m_A/r² = 6,67×10⁻¹¹ × 8,84×10²⁵ × 1,26×10²¹ / (1,92×10⁸)² ≈ 2,015×10²⁰ N.",
    methodSteps: [
      "Identifie les deux corps, leurs masses et la distance r entre leurs centres.",
      "Écris l’intensité F = G·mₐ·m_B/r².",
      "Convertis la distance en mètres avant l’application numérique.",
      "Rappelle-toi que les deux forces sont attractives, opposées et de même intensité.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer les forces",
      title: "Deux corps qui s’attirent",
      instruction: "Sélectionne un repère pour situer chaque grandeur de la loi de Newton.",
      observation: "Les deux forces sont portées par la droite (AB), opposées et de même intensité : elles s’attirent. Doubler la distance r divise l’intensité par 4.",
      caption: "Figure redessinée d’après le document officiel : deux corps sphériques A et B et les forces gravitationnelles mutuelles.",
      viewBox: "0 0 340 160",
      shapes: [
        { shape: "circle", cx: 82, cy: 85, r: 28, tone: "fill" },
        { shape: "circle", cx: 262, cy: 85, r: 18, tone: "fill" },
        { shape: "text", x: 82, y: 90, content: "A", anchor: "middle" },
        { shape: "text", x: 262, y: 90, content: "B", anchor: "middle" },
        { shape: "text", x: 82, y: 132, content: "mₐ", anchor: "middle" },
        { shape: "text", x: 262, y: 132, content: "m_B", anchor: "middle" },
        { shape: "line", x1: 110, y1: 85, x2: 244, y2: 85, tone: "muted" },
        { shape: "text", x: 177, y: 76, content: "r", anchor: "middle" },
        { shape: "line", x1: 116, y1: 85, x2: 158, y2: 85, tone: "accent" },
        { shape: "path", d: "M152 80 L162 85 L152 90 Z", tone: "accent" },
        { shape: "text", x: 138, y: 104, content: "F_B/A", anchor: "middle" },
        { shape: "line", x1: 228, y1: 85, x2: 186, y2: 85, tone: "accent" },
        { shape: "path", d: "M192 80 L182 85 L192 90 Z", tone: "accent" },
        { shape: "text", x: 210, y: 104, content: "F_A/B", anchor: "middle" },
        { shape: "line", x1: 200, y1: 62, x2: 224, y2: 62, tone: "soft" },
        { shape: "path", d: "M219 58 L227 62 L219 66 Z", tone: "soft" },
        { shape: "text", x: 212, y: 54, content: "u", anchor: "middle" },
      ],
      hotspots: [
        { id: "body-a", number: 1, label: "Le corps A (masse mₐ)", detail: "Corps sphérique assimilé à un point matériel situé en son centre. Il attire B.", x: 82, y: 85 },
        { id: "body-b", number: 2, label: "Le corps B (masse m_B)", detail: "Second corps, lui aussi ramené à son centre. Sa masse intervient au numérateur de la force.", x: 262, y: 85 },
        { id: "distance", number: 3, label: "La distance r = AB", detail: "Distance entre les centres. Elle intervient au carré : F est inversement proportionnelle à r². Doubler r divise F par 4.", x: 177, y: 85 },
        { id: "force-a", number: 4, label: "La force F_B/A (sur A)", detail: "Force exercée par B sur A, dirigée de A vers B : A est attiré vers B.", x: 138, y: 85 },
        { id: "force-b", number: 5, label: "La force F_A/B (sur B)", detail: "Force exercée par A sur B, dirigée de B vers A. Opposée à F_B/A et de même intensité (action-réaction).", x: 210, y: 85 },
      ],
    },
    questions: [
      choice("La force gravitationnelle entre deux corps est…", ["proportionnelle aux masses et inversement proportionnelle au carré de la distance", "proportionnelle au carré de la distance", "indépendante des masses", "proportionnelle à la distance"], 0, "C’est l’énoncé de la loi de Newton : F = G·mₐ·m_B/r².", "1.1 Énoncé de la loi de Newton", 2),
      short("Donne la valeur de la constante gravitationnelle G (en N·m²·kg⁻²).", ["6,67.10-11", "6,67×10^-11", "6.67e-11", "6,67 10-11", "6,67·10⁻¹¹"], "G = 6,67×10⁻¹¹ N·m²·kg⁻².", "1.2 Expression de la force", 1),
      choice("Les forces gravitationnelles sont…", ["toujours attractives", "toujours répulsives", "attractives ou répulsives selon les masses", "nulles à grande distance"], 0, "La gravitation attire toujours : $\\vec F_{A/B}$ et $\\vec F_{B/A}$ pointent l’une vers l’autre.", "1.2 NB", 1),
      short("Uranus (m = 8,84×10²⁵ kg) et son satellite Ariel (m = 1,26×10²¹ kg) sont distants de r = 192 000 km. Calcule l’intensité F de la force (en N).", ["2,015.10^20", "2,015×10^20", "2e20", "2,015 10^20", "2,02.10^20"], "F = G·m_U·m_A/r² = 6,67×10⁻¹¹ × 8,84×10²⁵ × 1,26×10²¹ / (1,92×10⁸)² ≈ 2,015×10²⁰ N.", "Activité d’application (Uranus–Ariel)", 3),
      choice("Si l’on double la distance r entre les deux corps, l’intensité de la force est…", ["divisée par 4", "divisée par 2", "doublée", "inchangée"], 0, "F ∝ 1/r² : multiplier r par 2 divise F par 2² = 4.", "1.1 Énoncé de la loi de Newton", 2),
    ],
  },
  {
    id: "gravitational-field",
    title: "Le champ de gravitation",
    summary: "Définir le vecteur champ de gravitation, calculer sa valeur à une altitude z et l’identifier au champ de pesanteur.",
    pages: "2-3",
    section: "2. Champ gravitationnel",
    durationMinutes: 16,
    xp: 55,
    body: String.raw`## Définition

Un corps sphérique $S$ de masse $m$ et de centre $A$ crée, en tout point $P$ de l’espace environnant, un **vecteur champ de gravitation** $\vec{\mathcal{G}}$ :

$$\vec{\mathcal{G}} = -\frac{G\,m}{AP^2}\,\vec{u}\qquad\text{avec } AP = r$$

où $\vec{u}$ est le vecteur unitaire dirigé de $A$ vers $P$. Le champ pointe donc **vers le centre** $A$ (attractif).

## Le champ à une altitude z

Le champ créé par $S$ (de rayon $R$) au point $P$ situé à l’altitude $z$ au-dessus de la surface vaut :

$$\mathcal{G}_z = \frac{G\,m}{(R+z)^2}$$

À la surface ($z = 0$), on note $\mathcal{G}_0 = \dfrac{G\,m}{R^2}$, ce qui permet d’écrire :

$$\boxed{\mathcal{G}_z = \mathcal{G}_0\,\frac{R^2}{(R+z)^2}}$$

> **Ce que dit la formule.** Le champ **décroît** quand on s’éloigne : il est divisé par $(R+z)^2/R^2$. À l’altitude d’un satellite géostationnaire ($z \approx 36\,000$ km), il ne reste qu’environ $0{,}22\ \text{N·kg}^{-1}$, contre $\approx 9{,}8$ au sol.

## Champ de gravitation et champ de pesanteur

Au voisinage de la Terre, $\vec{\mathcal{G}}$ et le champ de pesanteur $\vec{g}$ sont pratiquement égaux :

- l’écart relatif entre leurs **normes** est inférieur à $0{,}3\ \%$ ;
- l’écart entre leurs **directions** n’excède pas $0{,}1°$.

On écrit donc, au voisinage de la Terre :

$$\vec{\mathcal{G}} = \vec{g}$$`,
    keyPoint: "𝒢_z = G·m/(R+z)² = 𝒢₀·R²/(R+z)² ; le champ décroît avec l’altitude ; au voisinage de la Terre 𝒢 = g.",
    example: "Champ terrestre au sol (m = 5,98×10²⁴ kg, R = 6370 km) : g₀ = G·m/R² ≈ 9,83 N·kg⁻¹ ; à z = 100 km : g ≈ 9,53 N·kg⁻¹.",
    methodSteps: [
      "Écris le champ à l’altitude z : 𝒢_z = G·m/(R+z)².",
      "Convertis rayon et altitude en mètres avant l’application numérique.",
      "Pour comparer deux altitudes, utilise 𝒢_z = 𝒢₀·R²/(R+z)².",
      "Au voisinage de la Terre, identifie 𝒢 au champ de pesanteur g.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Visualiser",
      title: "Le champ terrestre décroît avec l’altitude",
      instruction: "Déplace le point : lis la valeur du champ 𝒢 (en N·kg⁻¹) en fonction de l’altitude z.",
      observation: "𝒢 = 𝒢₀·R²/(R+z)² : au sol ≈ 9,8, la courbe chute vite puis s’aplatit. À l’altitude géostationnaire (36 000 km), il ne reste que ≈ 0,22 N·kg⁻¹.",
      formula: "𝒢(z) = 𝒢₀·R²/(R+z)²  (R = 6370 km)",
      formulaTex: "\\mathcal{G}(z)=\\mathcal{G}_0\\,\\dfrac{R^2}{(R+z)^2}",
      rule: {
        kind: "samples",
        points: [
          [0, 9.83],
          [1, 7.34],
          [2, 5.69],
          [3, 4.54],
          [5, 3.09],
          [8, 1.93],
          [10, 1.49],
          [20, 0.57],
          [36, 0.22],
        ],
      },
      window: { xMin: 0, xMax: 36, yMin: 0, yMax: 10 },
      marker: { min: 0, max: 36, step: 1, initial: 10 },
    },
    questions: [
      choice("Le vecteur champ de gravitation créé par un corps sphérique pointe…", ["vers le centre du corps (attractif)", "vers l’extérieur du corps", "toujours vers le haut", "tangentiellement à la surface"], 0, "$\\vec{\\mathcal{G}} = -\\dfrac{Gm}{AP^2}\\vec u$ : le signe − indique un champ dirigé vers le centre.", "2.1 Définition", 2),
      choice("Quand l’altitude z augmente, la valeur du champ de gravitation…", ["diminue", "augmente", "reste constante", "s’annule brusquement"], 0, "𝒢_z = Gm/(R+z)² décroît lorsque z croît.", "2.2.2 Champ à une altitude z", 1),
      short("Champ terrestre au sol : m = 5,98×10²⁴ kg, R = 6370 km. Calcule g₀ (en N·kg⁻¹).", ["9,83", "9.83", "9,83 N/kg", "≈9,83"], "g₀ = G·m/R² = 6,67×10⁻¹¹ × 5,98×10²⁴ / (6,37×10⁶)² ≈ 9,83 N·kg⁻¹.", "Exercice 1-b", 2),
      short("Pour le même corps, calcule le champ à l’altitude Z = 100 km (en N·kg⁻¹).", ["9,53", "9.53", "9,53 N/kg", "≈9,53"], "g = G·m/(R+Z)² = 6,67×10⁻¹¹ × 5,98×10²⁴ / (6470×10³)² ≈ 9,53 N·kg⁻¹.", "Exercice 1-a", 2),
      choice("Au voisinage de la Terre, quelle relation lie le champ de gravitation 𝒢 et le champ de pesanteur g ?", ["𝒢 = g", "𝒢 = 2g", "𝒢 = g/2", "𝒢 et g sont sans rapport"], 0, "Les écarts de norme (<0,3 %) et de direction (<0,1°) sont négligeables : 𝒢 = g.", "2.3 Champ gravitationnel et champ de pesanteur", 2),
    ],
    corrections: [
      "Page 2-3, activité d’application : avec m = 6×10²⁴ kg et R = 6,3×10³ km, le document annonce g₀ = 9,77 N·kg⁻¹, alors que ces données donnent en réalité ≈ 10,1 N·kg⁻¹. Les valeurs numériques utilisées ici proviennent de l’Exercice 1 (m = 5,98×10²⁴ kg, R = 6370 km), cohérentes entre elles : g₀ ≈ 9,83 et g(100 km) ≈ 9,53 N·kg⁻¹.",
    ],
  },
  {
    id: "satellite-motion",
    title: "Le mouvement des satellites",
    summary: "Montrer par le théorème du centre d’inertie qu’un satellite en orbite circulaire a un mouvement uniforme, puis calculer sa vitesse et sa période.",
    pages: "3-4",
    section: "3. Mouvement des satellites",
    durationMinutes: 18,
    xp: 65,
    body: String.raw`## Le cadre de l’étude

Pour étudier un satellite de la Terre, on utilise le **référentiel géocentrique** supposé galiléen. Un satellite en **« vol balistique »** (moteur coupé) décrit une courbe plane dont le plan contient le centre $O$ de la Terre — souvent une ellipse ou un cercle. On se limite au **mouvement circulaire**.

## La nature du mouvement : circulaire uniforme

- **Système** : le satellite de masse $m$ et de centre d’inertie $G$.
- **Référentiel** : géocentrique supposé galiléen.
- **Bilan des forces** : la seule force est la force gravitationnelle $\vec{F} = m\,\vec{\mathcal{G}}$.

En appliquant le **théorème du centre d’inertie** :

$$\sum \vec{F}_{ext} = m\,\vec{a} \;\Longrightarrow\; m\,\vec{\mathcal{G}} = m\,\vec{a} \;\Longrightarrow\; \vec{a} = \vec{\mathcal{G}} = -\frac{G\,M_T}{r^2}\,\vec{u}$$

L’accélération est donc **purement normale** (centripète, dirigée vers $O$). Dans la base de Frenet, $\vec{a} = \dfrac{dv}{dt}\,\vec{\tau} + \dfrac{v^2}{r}\,\vec{n}$ ; comme $\vec a$ n’a pas de composante tangentielle :

$$\frac{dv}{dt} = 0 \;\Longrightarrow\; v = \text{cste}$$

> **Conclusion.** Le mouvement du satellite est **circulaire uniforme**. Et comme $\vec a = \vec{\mathcal G}$ ne dépend pas de $m$, **le mouvement est indépendant de la masse du satellite**.

## Vitesse et période

De $\dfrac{v^2}{r} = \mathcal{G} = \dfrac{G M_T}{r^2}$ on tire la **vitesse linéaire** (avec $r = R_T + h$ et $\mathcal G_0 = G M_T/R_T^2$) :

$$v = \sqrt{\frac{G M_T}{r}} = R_T\sqrt{\frac{\mathcal{G}_0}{R_T + h}}$$

la **vitesse angulaire** $\omega = \dfrac{v}{r}$ et la **période** :

$$T = \frac{2\pi}{\omega} = \frac{2\pi\,(R_T + h)}{v}$$`,
    keyPoint: "Satellite en orbite circulaire : le TCI donne a = 𝒢 (centripète) ⟹ mouvement circulaire uniforme, indépendant de m. v = √(GM_T/r), T = 2π(R_T+h)/v.",
    example: "Satellite à h = 10 000 km (R_T = 6370 km, M_T = 5,98×10²⁴ kg) : v = √(GM_T/(R_T+h)) ≈ 4936 m·s⁻¹, ω ≈ 3,02×10⁻⁴ rad·s⁻¹, T ≈ 20 840 s.",
    methodSteps: [
      "Système : le satellite ; référentiel géocentrique supposé galiléen.",
      "Bilan : la seule force est la force gravitationnelle F = m·𝒢.",
      "TCI : a = 𝒢 (centripète) ⟹ dv/dt = 0 ⟹ mouvement circulaire uniforme.",
      "Calcule v = √(GM_T/r), puis ω = v/r et T = 2π/ω.",
    ],
    interaction: {
      kind: "orbit",
      eyebrow: "Manipuler",
      title: "Vitesse tangente, attraction centripète",
      instruction: "Fais tourner le satellite : observe la direction des deux vecteurs à chaque position de l’orbite.",
      observation: "La vitesse reste tangente à l’orbite ; la force gravitationnelle (donc l’accélération 𝒢) pointe toujours vers le centre O de la Terre. La valeur de v ne change pas : le mouvement est circulaire uniforme.",
      formula: "v = √(G·M_T / r) ; a = 𝒢 = G·M_T / r² (centripète)",
      formulaTex: "\\vec a=\\vec{\\mathcal{G}}=-\\dfrac{GM_T}{r^2}\\,\\vec u,\\quad v=\\sqrt{\\dfrac{GM_T}{r}}",
      radiusLabel: "r = R_T + h",
      showVelocity: true,
      showAcceleration: true,
      marker: { min: 0, max: 360, step: 2, initial: 40 },
    },
    questions: [
      choice("Dans quel référentiel étudie-t-on le mouvement d’un satellite de la Terre ?", ["le référentiel géocentrique", "le référentiel terrestre", "le référentiel de Copernic", "le référentiel du satellite"], 0, "Le référentiel géocentrique, supposé galiléen, a pour origine le centre de la Terre.", "3. Mouvement des satellites", 1),
      choice("Le théorème du centre d’inertie appliqué à un satellite en orbite circulaire montre que son mouvement est…", ["circulaire uniforme", "rectiligne uniforme", "circulaire accéléré", "elliptique"], 0, "a = 𝒢 est purement normale ⟹ dv/dt = 0 ⟹ v constante.", "3.1 Nature du mouvement", 2),
      choice("Le mouvement d’un satellite soumis à la seule gravitation dépend-il de sa masse ?", ["Non, il en est indépendant", "Oui, il augmente avec la masse", "Oui, il diminue avec la masse", "Seulement en orbite basse"], 0, "a = 𝒢 ne contient pas m : le mouvement est indépendant de la masse.", "3.1 Remarque", 2),
      short("Satellite à h = 10 000 km (R_T = 6370 km, M_T = 5,98×10²⁴ kg). Calcule sa vitesse v (en m·s⁻¹).", ["4936", "4936,16", "≈4936", "4,94.10^3", "4936 m/s"], "v = √(GM_T/(R_T+h)) = √(6,67×10⁻¹¹ × 5,98×10²⁴ / (16 370×10³)) ≈ 4936 m·s⁻¹.", "Exercice 2-a", 2),
      short("Pour ce satellite, calcule sa vitesse angulaire ω (en rad·s⁻¹).", ["3,015.10^-4", "3,02.10^-4", "3e-4", "3,015×10^-4", "0,0003015"], "ω = v/r = 4936 / (16 370×10³) ≈ 3,015×10⁻⁴ rad·s⁻¹.", "Exercice 2-b", 2),
    ],
  },
  {
    id: "geostationary-satellite",
    title: "Le satellite géostationnaire",
    summary: "Définir un satellite géostationnaire, établir ses caractéristiques (période, altitude) et comprendre son intérêt.",
    pages: "4",
    section: "4. Satellite géostationnaire",
    durationMinutes: 14,
    xp: 70,
    body: String.raw`## Définition

Un **satellite géostationnaire** tourne **dans le même sens et à la même vitesse angulaire que la Terre**, en décrivant un cercle **dans le plan équatorial**. Il paraît donc **immobile** pour un observateur terrien.

## Caractéristiques du mouvement

Puisqu’il « suit » la Terre, sa période est celle de la **rotation propre** de la Terre :

| Grandeur | Valeur |
|---|---|
| **Période** $T$ | $23\,\text{h}\ 56\,\text{min}\ 4\,\text{s} = 86\,164\ \text{s}$ |
| **Vitesse angulaire** $\omega = \dfrac{2\pi}{T}$ | $\approx 7{,}29\times10^{-5}\ \text{rad·s}^{-1}$ |
| **Altitude** $z$ | $\approx 3{,}6\times10^{4}\ \text{km} = 36\,000\ \text{km}$ |

L’altitude se déduit de la période : de $T = \dfrac{2\pi(R_T + z)}{v}$ combinée à $v = \sqrt{\dfrac{G M_T}{R_T + z}}$, on obtient $r^3 = (R_T + z)^3 = \dfrac{G M_T\,T^2}{4\pi^2}$, d’où $z \approx 36\,000$ km.

## Intérêt

Grâce à leur **immobilité apparente**, les satellites géostationnaires assurent des **communications intercontinentales permanentes** : une antenne au sol reste pointée dans une direction fixe. On les utilise notamment en **télécommunications** et en **météorologie**.`,
    keyPoint: "Géostationnaire : même sens et même vitesse angulaire que la Terre, plan équatorial, immobile apparent. T = 86 164 s, ω ≈ 7,29×10⁻⁵ rad·s⁻¹, z ≈ 36 000 km.",
    example: "ω = 2π/T = 2π/86 164 ≈ 7,29×10⁻⁵ rad·s⁻¹.",
    methodSteps: [
      "Retiens la définition : même sens et même ω que la Terre, dans le plan équatorial.",
      "Prends la période de rotation propre de la Terre : T = 86 164 s (≈ 24 h).",
      "Déduis ω = 2π/T.",
      "Pour l’altitude, utilise r³ = G·M_T·T²/(4π²) puis z = r − R_T.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Qu’est-ce qu’un satellite géostationnaire ?",
      instruction: "Sélectionne une caractéristique pour comprendre ce qui rend ce satellite « immobile ».",
      observation: "Trois conditions rendent le satellite immobile pour un terrien : même vitesse angulaire que la Terre, même sens, et plan équatorial. Cela fixe son altitude à ≈ 36 000 km.",
      rootLabel: "Satellite géostationnaire",
      rootDetail: "Un satellite qui paraît fixe au-dessus d’un point de l’équateur",
      nodes: [
        { id: "angular", group: "Les conditions", label: "Même vitesse angulaire que la Terre", role: "ω = ω_Terre", detail: "Il tourne exactement au rythme de la Terre : ω = 2π/T avec T = 86 164 s, soit ω ≈ 7,29×10⁻⁵ rad·s⁻¹. C’est ce qui le rend immobile vu du sol." },
        { id: "plane", group: "Les conditions", label: "Dans le plan équatorial", role: "Au-dessus de l’équateur", detail: "Son orbite est contenue dans le plan de l’équateur. Un satellite hors de ce plan oscillerait en latitude et ne paraîtrait pas fixe." },
        { id: "altitude", group: "La conséquence", label: "Altitude ≈ 36 000 km", role: "z fixé par la période", detail: "La période impose l’altitude : r³ = G·M_T·T²/(4π²) donne z ≈ 3,6×10⁴ km. Toutes les orbites géostationnaires sont à cette même altitude." },
        { id: "use", group: "L’intérêt", label: "Communications & météo", role: "Antenne fixe au sol", detail: "Comme il paraît immobile, une antenne terrestre reste pointée dans une direction fixe : liaisons intercontinentales permanentes, télévision, satellites météo (Meteosat)." },
      ],
    },
    questions: [
      choice("Un satellite géostationnaire…", ["tourne à la même vitesse angulaire que la Terre, dans le plan équatorial", "tourne deux fois plus vite que la Terre", "reste au-dessus d’un pôle", "a une orbite quelconque"], 0, "Même sens et même ω que la Terre, dans le plan équatorial : il paraît immobile.", "4.1 Définition", 2),
      short("Quelle est la période T d’un satellite géostationnaire (en secondes, valeur exacte du cours) ?", ["86164", "86 164", "86164 s", "23h56min4s"], "T = 23 h 56 min 4 s = 86 164 s, la période de rotation propre de la Terre.", "4.2 Caractéristiques", 1),
      short("À quelle altitude z (en km) évolue un satellite géostationnaire ?", ["36000", "36 000", "3,6.10^4", "36000 km", "≈36000"], "z ≈ 3,6×10⁴ km = 36 000 km, imposée par la période.", "4.2 Caractéristiques", 2),
      short("Calcule la vitesse angulaire ω d’un satellite géostationnaire (en rad·s⁻¹), avec T = 86 164 s.", ["7,29.10^-5", "7,29×10^-5", "7.29e-5", "7,29 10-5", "0,0000729"], "ω = 2π/T = 2π/86 164 ≈ 7,29×10⁻⁵ rad·s⁻¹.", "4.2 Caractéristiques", 2),
      choice("Quel est le principal intérêt des satellites géostationnaires ?", ["assurer des communications permanentes grâce à leur immobilité apparente", "voyager vers d’autres planètes", "changer d’altitude à volonté", "mesurer la masse de la Lune"], 0, "Immobiles vus du sol, ils permettent des liaisons permanentes (télécoms, météo).", "4.3 Intérêt", 1),
    ],
    corrections: [
      "Page 4 : la vitesse angulaire du satellite géostationnaire est notée « ω = 7,29×10⁻⁵ s » dans le document. L’unité d’une vitesse angulaire est le radian par seconde (rad·s⁻¹), pas la seconde. L’unité correcte a été rétablie.",
    ],
  },
  {
    id: "kepler-laws",
    title: "Les lois de Kepler et le mouvement des planètes",
    summary: "Énoncer les trois lois de Kepler, en tirer la relation des périodes et découvrir la notion d’impesanteur.",
    pages: "5",
    section: "5. Mouvement des planètes",
    durationMinutes: 16,
    xp: 80,
    body: String.raw`## Les trois lois de Kepler

Dans un **repère de Copernic** (héliocentrique) :

> **1ʳᵉ loi (loi des orbites).** La trajectoire d’une planète est une **ellipse** dont le **Soleil occupe l’un des foyers**.

> **2ᵉ loi (loi des aires).** Le segment de droite reliant le Soleil à la planète **balaie des aires égales pendant des durées égales**. (La planète va donc plus vite près du Soleil.)

> **3ᵉ loi (loi des périodes).** Pour toutes les planètes, le rapport entre le **cube du demi-grand axe** $a$ et le **carré de la période** de révolution est le même :
$$\frac{a^3}{T^2} = \text{cste}$$
Cette constante est **indépendante de la masse** des planètes.

## Conséquence

La 3ᵉ loi est la **base de la théorie de l’attraction gravitationnelle de Newton**. Pour un satellite terrestre en orbite circulaire de rayon $r = R_T + z$, elle s’écrit :

$$\frac{T^2}{r^3} = \frac{4\pi^2}{G\,M_T} = \text{cste}$$

Elle permet notamment de **déterminer la masse d’un astre central** à partir de la période et du rayon d’un de ses satellites.

## La notion d’impesanteur

L’**impesanteur** (ou apesanteur) découle du fait que, localement dans un champ gravitationnel, tous les objets ont **presque la même accélération, indépendante de leur masse**.

> **Exemples.** Un **ascenseur en chute libre** ou un **cosmonaute dans un satellite** : l’objet et son support « tombent » ensemble avec la même accélération, si bien que le support n’exerce plus de réaction — c’est la sensation d’impesanteur.`,
    keyPoint: "Kepler : (1) orbite = ellipse, Soleil à un foyer ; (2) aires égales en durées égales ; (3) a³/T² = cste, indépendant de la masse. Pour un satellite : T²/r³ = 4π²/(G·M_T).",
    example: "Les 5 satellites d’Uranus vérifient tous T²/r³ = 6,66×10⁻¹⁵ SI ⟹ masse d’Uranus M = 4π²/(G·(T²/r³)) ≈ 8,88×10²⁵ kg.",
    methodSteps: [
      "Énonce la loi utile : orbites (1), aires (2) ou périodes (3).",
      "Pour un satellite, écris T²/r³ = 4π²/(G·M) avec r = R_T + z.",
      "Pour vérifier la 3ᵉ loi, montre que T²/r³ est le même pour chaque astre.",
      "Pour une masse centrale, isole M = 4π²/(G·(T²/r³)).",
    ],
    interaction: timeline(
      [
        { label: "1ʳᵉ loi : les orbites", shortLabel: "Ellipses", detail: "La trajectoire d’une planète est une ellipse dont le Soleil occupe l’un des foyers." },
        { label: "2ᵉ loi : les aires", shortLabel: "Aires égales", detail: "Le rayon Soleil–planète balaie des aires égales pendant des durées égales : la planète accélère près du Soleil, ralentit loin de lui." },
        { label: "3ᵉ loi : les périodes", shortLabel: "a³/T²", detail: "Pour toutes les planètes, a³/T² est la même constante, indépendante de la masse. Pour un satellite : T²/r³ = 4π²/(G·M)." },
        { label: "Conséquence", shortLabel: "Masse des astres", detail: "La 3ᵉ loi fonde la théorie de Newton et permet de peser un astre central à partir d’un de ses satellites." },
        { label: "Impesanteur", shortLabel: "Chute libre", detail: "Tous les objets ont localement la même accélération : ascenseur en chute libre, cosmonaute en orbite — le support ne pousse plus, d’où l’impesanteur." },
      ],
      "Les trois lois de Kepler, puis leurs conséquences",
      "Parcours les lois dans l’ordre, puis leur portée physique.",
      "La 3ᵉ loi (a³/T² = cste) est la plus utilisée : elle relie période, rayon et masse.",
    ),
    questions: [
      choice("D’après la 1ʳᵉ loi de Kepler, la trajectoire d’une planète est…", ["une ellipse dont le Soleil occupe un foyer", "un cercle centré sur le Soleil", "une droite", "une parabole"], 0, "1ʳᵉ loi : orbite elliptique, Soleil à l’un des foyers.", "5.1 Lois de Kepler — 1ʳᵉ loi", 2),
      choice("La 2ᵉ loi de Kepler (loi des aires) affirme que le segment Soleil–planète…", ["balaie des aires égales pendant des durées égales", "a une longueur constante", "balaie des angles égaux", "reste perpendiculaire à la vitesse"], 0, "C’est la loi des aires : aires égales en durées égales.", "5.1 Lois de Kepler — 2ᵉ loi", 2),
      choice("La 3ᵉ loi de Kepler s’écrit…", ["a³/T² = constante", "a/T = constante", "a²/T³ = constante", "a·T = constante"], 0, "Le rapport du cube du demi-grand axe au carré de la période est constant.", "5.1 Lois de Kepler — 3ᵉ loi", 2),
      choice("La constante de la 3ᵉ loi de Kepler est…", ["indépendante de la masse des planètes", "proportionnelle à la masse de la planète", "différente pour chaque planète", "nulle"], 0, "Elle ne dépend que de l’astre central, pas de la masse des planètes.", "5.1 Lois de Kepler — 3ᵉ loi", 1),
      short("Les 5 satellites d’Uranus donnent tous T²/r³ = 6,66×10⁻¹⁵ SI. Calcule la masse d’Uranus (en kg).", ["8,88.10^25", "8,88×10^25", "8.88e25", "8,9.10^25", "8,88 10^25"], "M = 4π²/(G·(T²/r³)) = 4π²/(6,67×10⁻¹¹ × 6,66×10⁻¹⁵) ≈ 8,88×10²⁵ kg.", "Exercice 3, question 2", 3),
      choice("Un cosmonaute en orbite ressent l’impesanteur parce que…", ["lui et son satellite ont la même accélération (chute libre commune)", "il n’y a plus de gravité dans l’espace", "sa masse devient nulle", "le satellite ne bouge pas"], 0, "Le champ gravitationnel donne à tous la même accélération : le support ne pousse plus.", "5.2 Notion d’impesanteur", 2),
    ],
  },
  {
    id: "earth-mass-mission",
    title: "Mission finale : peser la Terre avec Meteosat",
    summary: "Mobiliser satellite géostationnaire et 3ᵉ loi de Kepler pour estimer la masse de la Terre et le champ à l’altitude du satellite.",
    pages: "5-6",
    section: "Situation d’évaluation (satellites Meteosat)",
    durationMinutes: 22,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

Les satellites **« Meteosat »** sont placés sur orbite **géostationnaire** d’altitude $Z = 36\,000$ km, dans le champ de pesanteur terrestre. On te demande d’**estimer la masse de la Terre** autour de laquelle ils tournent.

**Données** : $G = 6{,}67\times10^{-11}\ \text{N·m}^2\text{·kg}^{-2}$ ; $R_T = 6370$ km ; période de rotation de la Terre $\approx 24$ h.

## 1. Vitesse angulaire

Un géostationnaire a la vitesse angulaire de la Terre. Avec $T = 24\,\text{h} = 86\,400$ s :

$$\omega = \frac{2\pi}{T} = \frac{2\pi}{86\,400} \approx 7{,}27\times10^{-5}\ \text{rad·s}^{-1}$$

## 2. Vitesse linéaire

$$v = (R_T + Z)\,\omega = (6370 + 36\,000)\times10^{3} \times 7{,}27\times10^{-5} \approx 3080\ \text{m·s}^{-1}$$

## 3. Masse de la Terre (3ᵉ loi de Kepler)

$$\frac{T^2}{(R_T + Z)^3} = \frac{4\pi^2}{G\,M_T} \;\Longrightarrow\; M_T = \frac{4\pi^2\,(R_T + Z)^3}{G\,T^2}$$

$$M_T = \frac{4\pi^2 \times (42\,370\times10^{3})^3}{6{,}67\times10^{-11} \times (86\,400)^2} \approx \boxed{6{,}03\times10^{24}\ \text{kg}}$$

## 4. Champ de gravitation à l’altitude du satellite

$$\mathcal{G}_Z = \frac{G\,M_T}{(R_T + Z)^2} = \frac{6{,}67\times10^{-11} \times 6{,}03\times10^{24}}{(42\,370\times10^{3})^2} \approx 0{,}22\ \text{N·kg}^{-1}$$

> **Ce que révèle la mission.** On « pèse » la Terre **sans balance**, uniquement avec la période et l’altitude d’un satellite : c’est toute la puissance de la 3ᵉ loi de Kepler. Et le champ à 36 000 km n’est plus que $\approx 0{,}22\ \text{N·kg}^{-1}$, contre $\approx 9{,}8$ au sol.`,
    keyPoint: "Meteosat (géostationnaire, Z = 36 000 km, T ≈ 24 h) : ω = 2π/T ≈ 7,27×10⁻⁵ rad·s⁻¹ ; v = (R_T+Z)ω ≈ 3080 m·s⁻¹ ; M_T = 4π²(R_T+Z)³/(G·T²) ≈ 6,03×10²⁴ kg ; 𝒢_Z ≈ 0,22 N·kg⁻¹.",
    example: "M_T = 4π²·(42 370×10³)³ / (6,67×10⁻¹¹ × 86 400²) ≈ 6,03×10²⁴ kg.",
    methodSteps: [
      "Période : celle de la Terre, T ≈ 24 h = 86 400 s ; puis ω = 2π/T.",
      "Vitesse linéaire : v = (R_T + Z)·ω.",
      "Masse de la Terre par la 3ᵉ loi : M_T = 4π²(R_T + Z)³/(G·T²).",
      "Champ à l’altitude Z : 𝒢_Z = G·M_T/(R_T + Z)².",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer l’orbite",
      title: "Meteosat sur son orbite géostationnaire",
      instruction: "Sélectionne un repère pour suivre le raisonnement de la mission.",
      observation: "Le satellite décrit un cercle de rayon r = R_T + Z dans le plan équatorial. Sa période (celle de la Terre) et son rayon suffisent, via la 3ᵉ loi de Kepler, à estimer la masse de la Terre.",
      caption: "Figure schématique : la Terre, l’orbite géostationnaire et le satellite Meteosat à l’altitude Z.",
      viewBox: "0 0 320 220",
      shapes: [
        { shape: "circle", cx: 150, cy: 110, r: 88, tone: "outline" },
        { shape: "circle", cx: 150, cy: 110, r: 34, tone: "fill" },
        { shape: "text", x: 150, y: 114, content: "Terre", anchor: "middle" },
        { shape: "line", x1: 150, y1: 110, x2: 150, y2: 22, tone: "muted" },
        { shape: "circle", cx: 150, cy: 22, r: 7, tone: "accent" },
        { shape: "text", x: 168, y: 20, content: "Meteosat", anchor: "start" },
        { shape: "line", x1: 150, y1: 110, x2: 238, y2: 110, tone: "soft" },
        { shape: "text", x: 196, y: 102, content: "r = R_T + Z", anchor: "middle" },
        { shape: "line", x1: 150, y1: 110, x2: 176, y2: 88, tone: "outline" },
        { shape: "text", x: 168, y: 74, content: "R_T", anchor: "middle" },
        { shape: "line", x1: 40, y1: 110, x2: 260, y2: 110, tone: "soft" },
        { shape: "text", x: 44, y: 124, content: "plan équatorial", anchor: "start" },
      ],
      hotspots: [
        { id: "earth", number: 1, label: "La Terre (masse M_T)", detail: "L’astre central, de rayon R_T = 6370 km. C’est sa masse que la mission cherche à estimer.", x: 150, y: 110 },
        { id: "orbit", number: 2, label: "L’orbite géostationnaire", detail: "Cercle de rayon r = R_T + Z dans le plan équatorial. Le satellite y tourne à la vitesse angulaire de la Terre.", x: 150, y: 22 },
        { id: "radius", number: 3, label: "Le rayon r = R_T + Z", detail: "Distance du centre de la Terre au satellite : r = (6370 + 36 000) km = 42 370 km. Il intervient au cube dans la 3ᵉ loi de Kepler.", x: 200, y: 110 },
        { id: "satellite", number: 4, label: "Le satellite Meteosat", detail: "Placé à Z = 36 000 km. Sa période (24 h) et son rayon r donnent, via T²/r³ = 4π²/(G·M_T), la masse de la Terre.", x: 150, y: 22 },
        { id: "plane", number: 5, label: "Le plan équatorial", detail: "Plan de l’orbite d’un géostationnaire. C’est ce qui, avec la période, rend le satellite immobile au-dessus d’un point de l’équateur.", x: 90, y: 110 },
      ],
    },
    questions: [
      short("Meteosat est géostationnaire : sa période T vaut celle de la Terre. Donne T en secondes (avec 24 h).", ["86400", "86 400", "86400 s", "24h"], "T = 24 × 3600 = 86 400 s.", "Situation d’évaluation, question 1", 1),
      short("Calcule la vitesse angulaire ω de Meteosat (en rad·s⁻¹).", ["7,27.10^-5", "7,27×10^-5", "7.27e-5", "0,0000727", "7,27 10-5"], "ω = 2π/T = 2π/86 400 ≈ 7,27×10⁻⁵ rad·s⁻¹.", "Situation d’évaluation, question 2.1", 2),
      short("Déduis-en la vitesse linéaire v de Meteosat (en m·s⁻¹), avec R_T + Z = 42 370 km.", ["3080", "3080,3", "≈3080", "3,08.10^3", "3080 m/s"], "v = (R_T+Z)·ω = 42 370×10³ × 7,27×10⁻⁵ ≈ 3080 m·s⁻¹.", "Situation d’évaluation, question 2.2", 2),
      choice("Quelle relation permet d’estimer la masse de la Terre à partir de T et r = R_T + Z ?", ["M_T = 4π²(R_T+Z)³/(G·T²)", "M_T = G·T²/(4π²)", "M_T = 4π²·G/(R_T+Z)³", "M_T = G·(R_T+Z)/T²"], 0, "La 3ᵉ loi de Kepler : T²/r³ = 4π²/(G·M_T), d’où M_T = 4π²r³/(G·T²).", "Situation d’évaluation, question 3", 2),
      short("Applique cette relation : estime la masse de la Terre M_T (en kg).", ["6,03.10^24", "6,03×10^24", "6e24", "6,03 10^24", "≈6,03.10^24"], "M_T = 4π²(42 370×10³)³/(6,67×10⁻¹¹ × 86 400²) ≈ 6,03×10²⁴ kg.", "Situation d’évaluation, question 3", 3),
      short("Déduis-en le champ de gravitation 𝒢_Z à l’altitude de Meteosat (en N·kg⁻¹).", ["0,22", "0,224", "≈0,22", "0.22", "0,22 N/kg"], "𝒢_Z = G·M_T/(R_T+Z)² = 6,67×10⁻¹¹ × 6,03×10²⁴ / (42 370×10³)² ≈ 0,22 N·kg⁻¹.", "Situation d’évaluation, question 4", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const gravitationPath: LearningPath = {
  id: "terminale-c-gravitation",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Côte d’Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 1, title: "Mécanique" },
  chapterNumber: 3,
  title: "Interaction gravitationnelle",
  description: "Énoncer la loi d’attraction de Newton, définir le champ de gravitation, étudier le mouvement des satellites et appliquer les lois de Kepler jusqu’à peser la Terre.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Énoncer la loi d’attraction universelle de Newton et calculer une force gravitationnelle.",
    "Définir le champ de gravitation et calculer sa valeur à une altitude donnée.",
    "Établir la nature circulaire uniforme du mouvement d’un satellite et sa vitesse.",
    "Caractériser un satellite géostationnaire et exploiter les lois de Kepler.",
  ],
  modules: [{
    id: "gravitation-mastery",
    title: "Maîtriser l’interaction gravitationnelle",
    description: "De la loi de Newton aux satellites géostationnaires, un niveau après l’autre, jusqu’à estimer la masse de la Terre.",
    lessons: builtLevels,
  }],
};

export const gravitationPaths: LearningPath[] = [gravitationPath];
