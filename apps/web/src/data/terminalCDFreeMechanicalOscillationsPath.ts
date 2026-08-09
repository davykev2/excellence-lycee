import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 05 de Physique (Terminales C et D) — commune aux deux séries.
const sourceDocument = "TleD_PHY_L5_Oscillations mécaniques libres.pdf";

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
      introduction: "Applique cette démarche aux exercices du document officiel.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : écris toujours l'unité juste après la valeur — $T$ en seconde, $N$ en hertz, $\\omega$ en rad·s$^{-1}$ et l'énergie en joule.",
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
    id: "free-oscillation-basics",
    title: "Reconnaître un oscillateur mécanique libre",
    summary: "Définir mouvement oscillatoire, oscillateur mécanique, période propre, fréquence propre et pulsation propre.",
    pages: "1-2",
    section: "1. Définitions",
    durationMinutes: 13,
    xp: 45,
    body: String.raw`## Le mouvement oscillatoire

Un **mouvement oscillatoire** est un mouvement qui se répète de part et d'autre d'une **position d'équilibre**. Le mobile passe alternativement d'un côté puis de l'autre de cette position.

> **Oscillateur mécanique.** Tout système mécanique capable d'effectuer un mouvement oscillatoire est appelé **oscillateur mécanique** : masse accrochée à un ressort, pendule, suspension d'un véhicule, etc.

## Que signifie « libre » ?

Après l'écartement initial, le système évolue **sans excitation extérieure périodique**. Il oscille sous l'action de ses propres forces de rappel. Dans le modèle idéal du cours, les frottements sont négligés : l'amplitude reste constante.

## Les trois grandeurs à ne pas confondre

| Grandeur | Sens | Formule | Unité |
|---|---|---|---|
| période propre $T_0$ | durée d'une oscillation complète | $T_0=\dfrac{1}{N_0}$ | seconde (s) |
| fréquence propre $N_0$ | nombre d'oscillations par seconde | $N_0=\dfrac{1}{T_0}$ | hertz (Hz) |
| pulsation propre $\omega_0$ | vitesse d'évolution de la phase | $\omega_0=2\pi N_0=\dfrac{2\pi}{T_0}$ | rad·s$^{-1}$ |

> **Astuce mémoire.** **T** comme **Temps** d'un tour ; **N** comme **Nombre** d'oscillations par seconde ; $2\pi$ radians correspondent à une oscillation complète.` ,
    keyPoint: "T₀ = 1/N₀ et ω₀ = 2πN₀ = 2π/T₀ ; un oscillateur libre n'est plus entretenu par une action extérieure périodique.",
    example: "Si un oscillateur effectue 5 oscillations en 2 s : T₀ = 2/5 = 0,40 s, N₀ = 2,5 Hz et ω₀ = 5π ≈ 15,7 rad·s⁻¹.",
    methodSteps: [
      "Repère la position d'équilibre autour de laquelle le mouvement se répète.",
      "Compte le nombre d'oscillations sur une durée connue.",
      "Calcule T₀ = durée/nombre, puis N₀ = 1/T₀.",
      "Déduis la pulsation propre par ω₀ = 2π/T₀.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "La carte d'identité d'un oscillateur libre",
      instruction: "Sélectionne une carte pour relier le phénomène à sa grandeur physique.",
      observation: "L'équilibre donne le centre du mouvement ; période, fréquence et pulsation décrivent le même rythme sous trois formes.",
      rootLabel: "Oscillateur mécanique libre",
      rootDetail: "Un système écarté de l'équilibre puis abandonné sans excitation périodique extérieure.",
      nodes: [
        { id: "equilibrium", label: "Position d'équilibre", role: "Centre des oscillations", detail: "Position x = 0 où le ressort n'est ni allongé ni comprimé par rapport à sa longueur d'équilibre." },
        { id: "period", label: "Période propre T₀", role: "Durée d'une oscillation", detail: "Temps minimal au bout duquel le mouvement se reproduit identiquement. Elle s'exprime en seconde." },
        { id: "frequency", label: "Fréquence propre N₀", role: "Oscillations par seconde", detail: "N₀ = 1/T₀. Son unité est le hertz : 1 Hz signifie une oscillation complète par seconde." },
        { id: "pulsation", label: "Pulsation propre ω₀", role: "Rythme angulaire", detail: "ω₀ = 2πN₀ = 2π/T₀, en rad·s⁻¹. Elle intervient directement dans l'équation différentielle." },
      ],
    },
    questions: [
      choice("Un mouvement oscillatoire est un mouvement qui…", ["se répète de part et d'autre d'une position d'équilibre", "reste toujours dans le même sens", "possède forcément une trajectoire circulaire", "est entretenu en permanence par un moteur"], 0, "C'est la définition donnée par le cours.", "1. Définitions", 2),
      choice("Dans une oscillation libre idéale, après le lâcher…", ["aucune excitation extérieure périodique n'entretient le mouvement", "un moteur impose la fréquence", "la force de rappel disparaît", "la masse reste immobile"], 0, "Le système évolue sous ses propres forces après la perturbation initiale.", "1. Définitions", 2),
      short("Un oscillateur effectue 8 oscillations en 4 s. Donne sa période en seconde.", ["0,5", "0.5", "0,50", "0.50", "0,5 s"], "T₀ = 4/8 = 0,5 s.", "1. Définitions", 2),
      short("Avec T₀ = 0,25 s, quelle est la fréquence propre en hertz ?", ["4", "4 Hz", "4hz"], "N₀ = 1/T₀ = 1/0,25 = 4 Hz.", "1. Définitions", 2),
      choice("Quelle relation est correcte ?", ["ω₀ = 2π/T₀", "ω₀ = T₀/(2π)", "ω₀ = T₀N₀", "ω₀ = N₀/(2π)"], 0, "Une oscillation complète correspond à 2π radians.", "1. Définitions", 1),
      choice("L'unité de la pulsation propre est…", ["rad·s⁻¹", "Hz²", "seconde", "joule"], 0, "La pulsation est un rythme angulaire en radians par seconde.", "1. Définitions", 1),
    ],
  },
  {
    id: "spring-mass-force-model",
    title: "Modéliser le système masse-ressort horizontal",
    summary: "Choisir le repère, isoler la masse et traduire la force de rappel du ressort par la loi de Hooke.",
    pages: "2",
    section: "2.1 Équation différentielle du mouvement",
    durationMinutes: 15,
    xp: 55,
    body: String.raw`## Le dispositif étudié

Une masse $m$ est reliée à un ressort de raideur $k$ et se déplace horizontalement sans frottement. L'origine $O$ du repère correspond à la **position d'équilibre** ; l'abscisse $x$ mesure l'allongement algébrique du ressort.

## Le bilan des forces

La masse subit :

- son poids $\vec P$ vertical vers le bas ;
- la réaction du support $\vec R$ verticale vers le haut ;
- la force de rappel du ressort $\vec T$ horizontale.

Comme il n'y a pas de mouvement vertical, $\vec P+\vec R=\vec 0$. Selon l'axe horizontal $(O,\vec i)$, la loi de Hooke donne :

$$\vec T=-k x\,\vec i$$

Le signe « $-$ » est essentiel : la force est **toujours opposée à l'élongation**.

| Position de la masse | Signe de $x$ | Sens de $\vec T$ |
|---|---:|---|
| à droite de $O$ | $x>0$ | vers la gauche |
| en $O$ | $x=0$ | force nulle |
| à gauche de $O$ | $x<0$ | vers la droite |

> **Astuce mémoire.** Le ressort est un gardien : dès que la masse s'éloigne, il la **rappelle** vers $O$.` ,
    keyPoint: "Dans le repère d'origine O à l'équilibre, la force de rappel vaut T⃗ = −kx i⃗ ; le poids et la réaction se compensent.",
    example: "Pour k = 100 N·m⁻¹ et x = +0,04 m : Tₓ = −100×0,04 = −4 N, donc la force pointe vers la gauche.",
    methodSteps: [
      "Isole la masse et choisis O à la position d'équilibre.",
      "Dessine P⃗, R⃗ et la force de rappel T⃗.",
      "Écris P⃗ + R⃗ = 0⃗ sur la verticale.",
      "Projette T⃗ = −kx i⃗ sur l'axe horizontal.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Forces sur la masse reliée au ressort",
      instruction: "Sélectionne les repères pour comprendre le rôle de chaque force.",
      observation: "Verticalement, P et R se compensent. Horizontalement, seule la force du ressort ramène la masse vers O.",
      caption: "Schéma original redessiné d'après le dispositif du document officiel.",
      viewBox: "0 0 380 210",
      shapes: [
        { shape: "line", x1: 25, y1: 155, x2: 355, y2: 155, tone: "muted" },
        { shape: "line", x1: 35, y1: 55, x2: 35, y2: 155, tone: "outline" },
        { shape: "path", d: "M35 105 L55 105 L65 85 L80 125 L95 85 L110 125 L125 85 L140 125 L155 105 L195 105", tone: "accent" },
        { shape: "path", d: "M195 80 L260 80 L260 140 L195 140 Z", tone: "fill" },
        { shape: "circle", cx: 211, cy: 145, r: 10, tone: "outline" },
        { shape: "circle", cx: 244, cy: 145, r: 10, tone: "outline" },
        { shape: "line", x1: 228, y1: 110, x2: 155, y2: 110, tone: "accent" },
        { shape: "path", d: "M155 110 L169 103 L169 117 Z", tone: "accent" },
        { shape: "text", x: 145, y: 101, content: "T = −kx", anchor: "end" },
        { shape: "line", x1: 228, y1: 110, x2: 228, y2: 55, tone: "soft" },
        { shape: "path", d: "M228 55 L221 69 L235 69 Z", tone: "soft" },
        { shape: "text", x: 239, y: 59, content: "R", anchor: "start" },
        { shape: "line", x1: 228, y1: 110, x2: 228, y2: 190, tone: "outline" },
        { shape: "path", d: "M228 190 L221 176 L235 176 Z", tone: "outline" },
        { shape: "text", x: 239, y: 187, content: "P", anchor: "start" },
        { shape: "text", x: 175, y: 173, content: "O", anchor: "middle" },
        { shape: "line", x1: 175, y1: 165, x2: 330, y2: 165, tone: "muted" },
        { shape: "path", d: "M330 165 L316 158 L316 172 Z", tone: "muted" },
        { shape: "text", x: 338, y: 170, content: "+x", anchor: "start" },
      ],
      hotspots: [
        { id: "spring", number: 1, label: "Le ressort", detail: "Sa raideur k mesure sa rigidité. Il exerce la force de rappel Tₓ = −kx.", x: 110, y: 105 },
        { id: "mass", number: 2, label: "La masse m", detail: "Son centre d'inertie se déplace horizontalement ; son abscisse x est l'élongation du ressort.", x: 228, y: 110 },
        { id: "vertical", number: 3, label: "Poids et réaction", detail: "P⃗ et R⃗ sont opposés et de même norme : ils se compensent sur la verticale.", x: 273, y: 72 },
        { id: "restoring", number: 4, label: "Force de rappel", detail: "Elle est opposée à x : si la masse est à droite, T⃗ pointe à gauche ; si elle est à gauche, T⃗ pointe à droite.", x: 165, y: 110 },
      ],
    },
    questions: [
      choice("À quoi correspond l'origine O du repère ?", ["À la position d'équilibre", "À l'extrémité fixe du ressort", "À l'amplitude maximale", "Au centre du laboratoire"], 0, "L'élongation x est mesurée depuis la position d'équilibre.", "2.1 Dispositif", 1),
      choice("Quelle expression décrit la force de rappel ?", ["Tₓ = −kx", "Tₓ = k/x", "Tₓ = +kx dans tous les cas", "Tₓ = mg"], 0, "La loi de Hooke est algébrique : Tₓ = −kx.", "2.1 Équation différentielle", 2),
      short("Avec k = 50 N·m⁻¹ et x = +0,10 m, donne Tₓ en newton.", ["-5", "-5 N", "−5", "−5 N"], "Tₓ = −kx = −50×0,10 = −5 N.", "2.1 Équation différentielle", 2),
      choice("Si x < 0, la force de rappel est dirigée…", ["vers les x positifs", "vers les x négatifs", "verticalement", "elle est nulle"], 0, "Tₓ = −kx devient positif lorsque x est négatif.", "2.1 Équation différentielle", 2),
      choice("Pourquoi le poids n'apparaît-il pas dans l'équation horizontale ?", ["Il est compensé par la réaction du support", "Il est nul", "Il est parallèle au mouvement", "La masse n'a pas de poids"], 0, "P⃗ + R⃗ = 0⃗ sur la verticale.", "2.1 Bilan des forces", 1),
      choice("Au passage par O, la force du ressort vaut…", ["0 N", "mg", "k", "sa valeur maximale"], 0, "En O, x = 0 donc Tₓ = −kx = 0.", "2.1 Équation différentielle", 1),
    ],
  },
  {
    id: "free-oscillation-equation",
    title: "Établir l'équation différentielle",
    summary: "Appliquer le théorème du centre d'inertie et faire apparaître la pulsation propre du système.",
    pages: "2-3",
    section: "2.1 Équation différentielle et 2.2 Solution",
    durationMinutes: 17,
    xp: 65,
    body: String.raw`## Du bilan des forces à l'équation

Dans le référentiel terrestre supposé galiléen, le théorème du centre d'inertie donne :

$$\sum \vec F_{ext}=m\vec a$$

Sur l'axe horizontal, seule la force du ressort intervient :

$$-kx=m\ddot x$$

d'où l'équation différentielle de l'oscillateur harmonique :

$$\boxed{\ddot x+\frac{k}{m}x=0}$$

## Faire apparaître la pulsation propre

On pose :

$$\omega_0^2=\frac{k}{m}\qquad\Longrightarrow\qquad\boxed{\omega_0=\sqrt{\frac{k}{m}}}$$

L'équation prend sa forme la plus facile à reconnaître :

$$\boxed{\ddot x+\omega_0^2x=0}$$

Puis :

$$T_0=\frac{2\pi}{\omega_0}=2\pi\sqrt{\frac{m}{k}},\qquad N_0=\frac{1}{T_0}$$

## Lire l'effet des paramètres

- augmenter $m$ rend le mouvement **plus lent** : $T_0$ augmente ;
- augmenter $k$ rend le ressort plus rigide et le mouvement **plus rapide** : $T_0$ diminue ;
- l'amplitude initiale ne change pas $T_0$ dans le modèle harmonique idéal.

> **Contrôle d'unité.** $k/m$ s'exprime en s$^{-2}$ ; sa racine s'exprime bien en s$^{-1}$, comme une pulsation.` ,
    keyPoint: "ẍ + (k/m)x = 0, donc ω₀ = √(k/m) et T₀ = 2π√(m/k).",
    example: "Pour m = 0,10 kg et k = 10 N·m⁻¹ : ω₀ = √(10/0,10) = 10 rad·s⁻¹ et T₀ = 2π/10 ≈ 0,628 s.",
    methodSteps: [
      "Écris le TCI dans le référentiel terrestre supposé galiléen.",
      "Projette sur l'axe : m ẍ = −kx.",
      "Divise par m puis reconnais ẍ + ω₀²x = 0.",
      "Identifie ω₀ = √(k/m), puis T₀ = 2π/ω₀.",
    ],
    interaction: timeline([
      { label: "Système et repère", shortLabel: "1. Isoler", detail: "Système : la masse m ; origine O à l'équilibre ; axe horizontal orienté." },
      { label: "Bilan des forces", shortLabel: "2. Forces", detail: "P⃗ + R⃗ = 0⃗ et T⃗ = −kx i⃗." },
      { label: "Théorème du centre d'inertie", shortLabel: "3. TCI", detail: "La projection horizontale donne m ẍ = −kx." },
      { label: "Forme canonique", shortLabel: "4. Identifier", detail: "ẍ + (k/m)x = 0 = ẍ + ω₀²x ; donc ω₀ = √(k/m)." },
      { label: "Période propre", shortLabel: "5. Conclure", detail: "T₀ = 2π/ω₀ = 2π√(m/k), puis N₀ = 1/T₀." },
    ], "La chaîne de modélisation", "Avance étape par étape, du système isolé jusqu'à la période propre.", "Une erreur de signe dans T⃗ suffit à produire une équation non oscillante : vérifie toujours que la force s'oppose à x."),
    questions: [
      choice("Quelle est l'équation différentielle correcte ?", ["ẍ + (k/m)x = 0", "ẍ − (k/m)x = 0", "ẍ + (m/k)x = 0", "ẋ + kx = 0"], 0, "Le TCI donne m ẍ = −kx.", "2.1 Équation différentielle", 2),
      choice("La pulsation propre vaut…", ["√(k/m)", "k/m", "√(m/k)", "2π√(m/k)"], 0, "On identifie ω₀² = k/m.", "2.2 Solution", 2),
      short("Pour m = 0,25 kg et k = 100 N·m⁻¹, donne ω₀ en rad·s⁻¹.", ["20", "20 rad/s", "20rad/s"], "ω₀ = √(100/0,25) = √400 = 20 rad·s⁻¹.", "Exercice 4", 2),
      short("Avec ω₀ = 20 rad·s⁻¹, donne T₀ à 0,01 s près.", ["0,31", "0.31", "0,314", "0.314", "0,31 s"], "T₀ = 2π/20 = π/10 ≈ 0,314 s.", "Exercice 4", 2),
      choice("Si la masse est multipliée par 4 sans changer k, la période est…", ["multipliée par 2", "multipliée par 4", "divisée par 2", "inchangée"], 0, "T₀ est proportionnelle à √m.", "2.2 Solution", 2),
      choice("Si la raideur k augmente, le mouvement devient…", ["plus rapide", "plus lent", "apériodique", "immobile"], 0, "ω₀ augmente et T₀ diminue.", "2.2 Solution", 1),
    ],
  },
  {
    id: "harmonic-solution-initial-conditions",
    title: "Déterminer l'équation horaire",
    summary: "Utiliser les conditions initiales pour déterminer amplitude et phase d'une solution sinusoïdale.",
    pages: "2-3",
    section: "2.2 Solution de l'équation différentielle et situation d'évaluation",
    durationMinutes: 20,
    xp: 70,
    body: String.raw`## La solution harmonique

Toute solution de $\ddot x+\omega_0^2x=0$ peut s'écrire :

$$\boxed{x(t)=X_m\cos(\omega_0t+\varphi)}$$

avec $X_m>0$ l'amplitude et $\varphi$ la phase à l'origine. En dérivant correctement :

$$\boxed{v(t)=\dot x(t)=-\omega_0X_m\sin(\omega_0t+\varphi)}$$

$$\boxed{a(t)=\ddot x(t)=-\omega_0^2X_m\cos(\omega_0t+\varphi)=-\omega_0^2x(t)}$$

## Exploiter les conditions initiales

À $t=0$ :

$$x_0=X_m\cos\varphi,\qquad v_0=-\omega_0X_m\sin\varphi$$

Une relation sûre, valable même quand $x_0=0$, est :

$$\boxed{X_m=\sqrt{x_0^2+\left(\frac{v_0}{\omega_0}\right)^2}}$$

Puis on choisit le bon quadrant de $\varphi$ grâce aux signes de $\cos\varphi=x_0/X_m$ et de $\sin\varphi=-v_0/(\omega_0X_m)$.

## Application officielle

Pour $m=0{,}10$ kg, $k=10$ N·m$^{-1}$, $x_0=0{,}020$ m et $v_0=-0{,}20$ m·s$^{-1}$ :

$$\omega_0=10\ \text{rad·s}^{-1},\qquad X_m=\sqrt{0{,}02^2+(-0{,}20/10)^2}=2{,}82\times10^{-2}\ \text{m}$$

Ici $\cos\varphi>0$ et $\sin\varphi>0$, donc $\varphi=\pi/4$ :

$$\boxed{x(t)=2{,}82\times10^{-2}\cos(10t+\pi/4)}$$` ,
    keyPoint: "x = Xm cos(ω₀t+φ), v = −ω₀Xm sin(ω₀t+φ) et Xm = √(x₀²+(v₀/ω₀)²).",
    example: "x₀ = 0,020 m, v₀ = −0,20 m·s⁻¹ et ω₀ = 10 rad·s⁻¹ donnent Xm = 2,82×10⁻² m et φ = π/4.",
    methodSteps: [
      "Calcule d'abord ω₀ = √(k/m).",
      "Écris x₀ = Xm cosφ et v₀ = −ω₀Xm sinφ.",
      "Calcule Xm avec la somme des carrés.",
      "Utilise les signes de cosφ et sinφ pour choisir le bon quadrant.",
      "Vérifie l'équation obtenue en t = 0.",
    ],
    interaction: timeline([
      { label: "Calculer ω₀", detail: "ω₀ = √(10/0,10) = 10 rad·s⁻¹." },
      { label: "Trouver Xm", detail: "Xm = √(0,020² + (−0,20/10)²) = 2,82×10⁻² m." },
      { label: "Déterminer les signes", detail: "cosφ = x₀/Xm > 0 et sinφ = −v₀/(ω₀Xm) > 0 : φ est dans le premier quadrant." },
      { label: "Choisir φ", detail: "Les deux rapports valent √2/2, donc φ = π/4." },
      { label: "Vérifier", detail: "x(0) = 0,020 m et v(0) = −0,20 m·s⁻¹ : les deux conditions sont respectées." },
    ], "Des conditions initiales à x(t)", "Sélectionne chaque étape et vérifie qu'aucune information initiale n'est perdue.", "La fonction cosinus seule ne suffit pas : la phase φ indique où se trouve la masse et dans quel sens elle part à t = 0."),
    questions: [
      choice("Quelle est la dérivée de x(t) = Xm cos(ω₀t+φ) ?", ["v(t) = −ω₀Xm sin(ω₀t+φ)", "v(t) = −ω₀Xm cos(ω₀t+φ)", "v(t) = Xm sin(ω₀t+φ)", "v(t) = ω₀²x(t)"], 0, "La dérivée de cos u est −u' sin u.", "2.2 Solution", 2),
      choice("Quelle relation relie accélération et élongation ?", ["a = −ω₀²x", "a = +ω₀²x", "a = −ω₀x", "a = x/ω₀"], 0, "L'accélération est opposée à l'élongation.", "2.2 Solution", 2),
      short("Avec x₀ = 0,020 m, v₀ = −0,20 m·s⁻¹ et ω₀ = 10 rad·s⁻¹, donne Xm en mètre.", ["0,0282", "0.0282", "2,82e-2", "2.82e-2", "0,028", "0.028"], "Xm = √(0,020² + 0,020²) = 0,0282 m.", "Situation d'évaluation", 3),
      choice("Dans cette application, quel est le signe de sinφ ?", ["positif", "négatif", "nul", "indéterminé"], 0, "sinφ = −v₀/(ω₀Xm) et v₀ est négatif.", "Situation d'évaluation", 2),
      choice("Quelle phase satisfait cosφ = sinφ = √2/2 ?", ["π/4", "−π/4", "3π/4", "π"], 0, "Le premier quadrant donne φ = π/4.", "Situation d'évaluation", 2),
      choice("L'équation horaire correcte est…", ["x = 2,82×10⁻² cos(10t+π/4)", "x = 2,82×10⁻² cos(10t−π/4)", "x = 0,02 cos(10t+π/2)", "x = 2,82 cos(t+π/4)"], 0, "Elle reproduit x₀ et v₀.", "Situation d'évaluation", 2),
    ],
    corrections: [
      "Page 3 : le document imprime la dérivée avec un cosinus. La dérivée correcte de Xm·cos(ω₀t+φ) est −ω₀Xm·sin(ω₀t+φ).",
      "Page 3 : le dénominateur de la formule de tanφ contient par erreur v₀. La relation correcte est tanφ = −v₀/(ω₀x₀), lorsque x₀ ≠ 0.",
    ],
  },
  {
    id: "oscillation-graphs-phase",
    title: "Lire les graphes x(t), v(t) et a(t)",
    summary: "Relier les courbes sinusoïdales de position, vitesse et accélération et reconnaître leurs déphasages.",
    pages: "3-4",
    section: "Graphes horaires et Exercice 1",
    durationMinutes: 18,
    xp: 70,
    kind: "graph",
    body: String.raw`## Trois grandeurs, une même période

Pour $x(t)=X_m\cos(\omega_0t+\varphi)$ :

$$v(t)=-\omega_0X_m\sin(\omega_0t+\varphi),\qquad a(t)=-\omega_0^2x(t)$$

Les trois fonctions ont la **même période** $T_0$, mais pas la même amplitude ni la même phase.

| Position | Vitesse | Accélération | Interprétation |
|---|---|---|---|
| $x=+X_m$ | $v=0$ | $a=-\omega_0^2X_m$ | demi-tour vers la gauche |
| $x=0$ | $|v|=V_m$ | $a=0$ | passage le plus rapide |
| $x=-X_m$ | $v=0$ | $a=+\omega_0^2X_m$ | demi-tour vers la droite |

> **Astuce mémoire.** Aux **bords**, la masse s'arrête pour repartir : $v=0$. Au **centre**, elle file au plus vite : $|v|$ est maximal.

## Exercice 1 du document

On donne :

$$x(t)=2{,}0\times10^{-2}\cos(40\pi t-\pi/6)\ \text{(m)},\qquad k=100\ \text{N·m}^{-1}$$

On lit immédiatement :

$$X_m=2{,}0\times10^{-2}\ \text{m},\quad \omega_0=40\pi\ \text{rad·s}^{-1},\quad T_0=\frac{1}{20}=0{,}050\ \text{s},\quad N_0=20\ \text{Hz}$$

La dérivation donne :

$$v(t)=-0{,}8\pi\sin(40\pi t-\pi/6)$$

donc $v(0)=0{,}4\pi\approx1{,}26$ m·s$^{-1}$ et

$$a(0)=-16\sqrt3\pi^2\approx-274\ \text{m·s}^{-2}.$$` ,
    keyPoint: "Aux extrémités v = 0 ; à l'équilibre |v| = ω₀Xm ; l'accélération est toujours opposée à x.",
    example: "Pour x = 0,02 cos(40πt−π/6), T₀ = 0,05 s, N₀ = 20 Hz et v(0) = 0,4π ≈ 1,26 m·s⁻¹.",
    methodSteps: [
      "Lis Xm, ω₀ et φ directement dans l'équation horaire.",
      "Calcule T₀ = 2π/ω₀ puis N₀ = 1/T₀.",
      "Dérive une fois pour v et deux fois pour a.",
      "Remplace t par la date demandée en conservant les radians.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Visualiser",
      title: "Deux oscillations complètes de l'élongation",
      instruction: "Déplace le point sur la courbe x(t) de l'Exercice 1.",
      observation: "Le motif se répète toutes les 0,05 s. Aux maxima et minima de x, la vitesse est nulle ; aux passages par x = 0, sa valeur absolue est maximale.",
      formula: "x(t) = 2,0 cm · cos(40πt − π/6)",
      formulaTex: "x(t)=2{,}0\cos(40\pi t-\pi/6)\ \text{cm}",
      rule: {
        kind: "samples",
        points: [
          [0, 1.73], [0.00625, 1.93], [0.0125, 1], [0.01875, -0.52], [0.025, -1.73],
          [0.03125, -1.93], [0.0375, -1], [0.04375, 0.52], [0.05, 1.73], [0.05625, 1.93],
          [0.0625, 1], [0.06875, -0.52], [0.075, -1.73], [0.08125, -1.93], [0.0875, -1],
          [0.09375, 0.52], [0.1, 1.73],
        ],
      },
      window: { xMin: 0, xMax: 0.1, yMin: -2.3, yMax: 2.3 },
      guides: [{ kind: "horizontal", value: 0, label: "Équilibre x = 0" }],
      marker: { min: 0, max: 0.1, step: 0.00625, initial: 0 },
    },
    questions: [
      short("Dans x = 0,02 cos(40πt−π/6), donne la fréquence N₀ en hertz.", ["20", "20 Hz", "20hz"], "T₀ = 2π/(40π) = 1/20 s, donc N₀ = 20 Hz.", "Exercice 1, question 1", 2),
      short("Donne la période T₀ en seconde.", ["0,05", "0.05", "0,050", "0.050", "0,05 s"], "T₀ = 1/N₀ = 0,05 s.", "Exercice 1, question 1", 2),
      choice("Quelle est la phase à l'origine ?", ["−π/6", "π/6", "40π", "2×10⁻²"], 0, "C'est la constante dans l'argument du cosinus.", "Exercice 1, question 1", 1),
      short("Calcule v(0) en m·s⁻¹ à 0,01 près.", ["1,26", "1.26", "1,257", "1.257", "0,4pi", "0.4pi"], "v(0) = −0,8π sin(−π/6) = 0,4π ≈ 1,26 m·s⁻¹.", "Exercice 1, question 2-a", 3),
      short("Calcule a(0) en m·s⁻² à l'unité près.", ["-274", "−274", "-273,6", "-273.6", "−273,6"], "a(0) = −(40π)²×0,02×cos(−π/6) ≈ −273,6 m·s⁻².", "Exercice 1, question 2-b", 3),
      choice("Quand x = +Xm, que valent v et le sens de a ?", ["v = 0 et a pointe vers l'équilibre", "v est maximale et a = 0", "v = 0 et a s'éloigne de l'équilibre", "v et a sont nulles"], 0, "Au point de rebroussement, la vitesse s'annule et la force rappelle vers O.", "Graphes horaires", 2),
    ],
    corrections: [
      "Pages 3-4 : la correction imprimée de l'Exercice 1 s'arrête après l'expression de v(t). Les valeurs v(0) = 0,4π ≈ 1,26 m·s⁻¹ et a(0) = −16√3π² ≈ −274 m·s⁻² sont complétées ici.",
    ],
  },
  {
    id: "mechanical-energy-conservation",
    title: "Comprendre les échanges d'énergie",
    summary: "Calculer énergie potentielle élastique, énergie cinétique et énergie mécanique conservée.",
    pages: "3-4",
    section: "3. Énergie mécanique de l'oscillateur",
    durationMinutes: 18,
    xp: 80,
    body: String.raw`## Les deux réservoirs d'énergie

L'énergie potentielle élastique du ressort vaut :

$$\boxed{E_{pe}=\frac12kx^2}$$

L'énergie cinétique de la masse vaut :

$$\boxed{E_c=\frac12mv^2}$$

En l'absence de frottement, leur somme est constante :

$$\boxed{E_m=E_c+E_{pe}=\text{constante}}$$

## Trois écritures utiles de l'énergie mécanique

Aux extrémités $x=\pm X_m$, la vitesse est nulle :

$$E_m=\frac12kX_m^2$$

À l'équilibre $x=0$, la vitesse a sa valeur maximale $V_m=\omega_0X_m$ :

$$E_m=\frac12mV_m^2=\frac12m\omega_0^2X_m^2$$

Comme $k=m\omega_0^2$, ces écritures sont identiques.

## Application officielle

Pour $m=0{,}10$ kg, $k=10$ N·m$^{-1}$, $x_0=0{,}020$ m et $v_0=-0{,}20$ m·s$^{-1}$ :

$$E_m=\frac12mv_0^2+\frac12kx_0^2=0{,}002+0{,}002=\boxed{0{,}004\ \text{J}}$$

Alors :

$$V_m=\sqrt{\frac{2E_m}{m}}\approx0{,}283\ \text{m·s}^{-1},\qquad X_m=\sqrt{\frac{2E_m}{k}}\approx0{,}0283\ \text{m}$$

> **Astuce mémoire.** Aux **bords**, toute l'énergie est **élastique** ; au **centre**, toute l'énergie est **cinétique**.` ,
    keyPoint: "Em = ½mv² + ½kx² = ½kXm² = ½mVm² ; sans frottement, Em est constante.",
    example: "m = 0,10 kg, k = 10 N·m⁻¹, x₀ = 0,020 m, v₀ = −0,20 m·s⁻¹ donnent Em = 0,004 J, Vm ≈ 0,283 m·s⁻¹ et Xm ≈ 0,0283 m.",
    methodSteps: [
      "Choisis une date où x et v sont connus.",
      "Calcule Em = ½mv² + ½kx².",
      "À l'équilibre, pose x = 0 pour trouver Vm.",
      "Aux extrémités, pose v = 0 pour trouver Xm.",
      "Vérifie que kXm² = mVm².",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Échanges d'énergie",
      title: "Où se trouve l'énergie pendant l'oscillation ?",
      instruction: "Sélectionne une position remarquable de la masse.",
      observation: "L'énergie passe continuellement du ressort à la masse et inversement, mais leur somme reste constante dans le modèle sans frottement.",
      rootLabel: "Énergie mécanique Em",
      rootDetail: "Em = Ec + Epe = constante quand les frottements sont négligés.",
      nodes: [
        { id: "right", label: "Extrémité droite +Xm", role: "Epe maximale, Ec nulle", detail: "La masse s'arrête avant de repartir. v = 0 et Em = ½kXm²." },
        { id: "center-forward", label: "Passage par O", role: "Ec maximale, Epe nulle", detail: "Le ressort est à l'équilibre : x = 0. La vitesse atteint |Vm| et Em = ½mVm²." },
        { id: "left", label: "Extrémité gauche −Xm", role: "Epe maximale, Ec nulle", detail: "Deuxième point de rebroussement : v = 0 et l'énergie est entièrement élastique." },
        { id: "between", label: "Position intermédiaire", role: "Partage entre Ec et Epe", detail: "Les deux énergies sont non nulles et leur somme conserve la même valeur Em." },
      ],
    },
    questions: [
      choice("L'énergie potentielle élastique vaut…", ["½kx²", "kx", "½mv²", "mgx"], 0, "C'est l'énergie stockée par la déformation du ressort.", "3. Énergie mécanique", 2),
      choice("À l'équilibre x = 0, l'énergie est…", ["entièrement cinétique", "entièrement élastique", "nulle", "entièrement potentielle de pesanteur"], 0, "Epe = 0 et |v| = Vm.", "3. Énergie mécanique", 2),
      choice("Aux positions x = ±Xm…", ["v = 0", "|v| = Vm", "Ec est maximale", "Em = 0"], 0, "Ce sont les points de rebroussement.", "3. Énergie mécanique", 1),
      short("Calcule Em pour m = 0,10 kg, v₀ = −0,20 m·s⁻¹, k = 10 N·m⁻¹ et x₀ = 0,020 m (en J).", ["0,004", "0.004", "4e-3", "0,004 J"], "Em = ½×0,10×0,20² + ½×10×0,020² = 0,004 J.", "Situation d'évaluation", 3),
      short("Avec Em = 0,004 J et m = 0,10 kg, donne Vm à 0,01 m·s⁻¹ près.", ["0,28", "0.28", "0,283", "0.283"], "Vm = √(2Em/m) = √0,08 ≈ 0,283 m·s⁻¹.", "Situation d'évaluation", 2),
      short("Dans l'Exercice 1, k = 100 N·m⁻¹ et Xm = 0,020 m. Donne Em en joule.", ["0,02", "0.02", "0,020", "0.020", "0,02 J"], "Em = ½kXm² = ½×100×0,020² = 0,020 J.", "Exercice 1, question 3", 3),
    ],
    corrections: [
      "Page 4 : la démonstration énergétique de l'Exercice 1 n'est pas achevée dans le corrigé imprimé. La valeur constante est Em = ½kXm² = 0,020 J.",
    ],
  },
  {
    id: "official-fixation-exercises",
    title: "Exercices de fixation : vocabulaire et voiture à ressort",
    summary: "Réinvestir les définitions, vérifier des affirmations et résoudre intégralement le système de la petite voiture.",
    pages: "4-6",
    section: "Exercices 2, 3 et 4",
    durationMinutes: 22,
    xp: 90,
    kind: "practice",
    body: String.raw`## Exercice 2 — compléter correctement le vocabulaire

- La durée d'une oscillation complète est la **période** $T_0$.
- Le nombre d'**oscillations par seconde** est la **fréquence** $N_0$.
- L'unité de fréquence est le **hertz** (Hz).
- La pulsation propre vaut $\omega_0=2\pi N_0$.
- Lorsque les frottements sont négligés, l'énergie mécanique de l'oscillateur se **conserve**.

## Exercice 3 — vrai ou faux

1. La période s'exprime en hertz : **faux** (elle s'exprime en seconde).
2. La fréquence propre est l'inverse de la période propre : **vrai**.
3. La pulsation propre s'exprime en rad·s$^{-1}$ : **vrai**.
4. L'énergie mécanique est constante sans frottement : **vrai**.
5. $T_0=2\pi\sqrt{m/k}$ : **vrai**.

## Exercice 4 — la petite voiture à ressort

Une voiture de masse $m=0{,}25$ kg est reliée à un ressort de raideur $k=100$ N·m$^{-1}$. À $t=0$, elle est lâchée sans vitesse depuis $x_0=-0{,}15$ m.

L'équation différentielle est :

$$\ddot x+\frac{k}{m}x=0\quad\Longrightarrow\quad\ddot x+400x=0$$

Donc $\omega_0=20$ rad·s$^{-1}$. Écrivons $x=X_m\cos(20t+\varphi)$. Les conditions initiales donnent :

$$X_m=0{,}15\ \text{m},\qquad \cos\varphi=-1,\qquad \sin\varphi=0$$

d'où $\varphi=\pi$ et :

$$\boxed{x(t)=0{,}15\cos(20t+\pi)}$$

$$\boxed{v(t)=-3\sin(20t+\pi)}$$` ,
    keyPoint: "Pour la voiture : ω₀ = 20 rad·s⁻¹, Xm = 0,15 m, φ = π, x = 0,15 cos(20t+π) et v = −3 sin(20t+π).",
    example: "x(0) = 0,15 cosπ = −0,15 m et v(0) = −3 sinπ = 0 : les deux conditions initiales sont vérifiées.",
    methodSteps: [
      "Traduis d'abord les données : x₀ = −0,15 m et v₀ = 0.",
      "Établis ẍ + (k/m)x = 0 puis calcule ω₀.",
      "Utilise x₀ et v₀ pour trouver Xm et φ.",
      "Dérive x(t) pour obtenir v(t).",
      "Contrôle les deux expressions en t = 0.",
    ],
    interaction: timeline([
      { label: "Modéliser", detail: "P⃗ et R⃗ se compensent ; la force de rappel vaut −kx i⃗." },
      { label: "Établir l'équation", detail: "m ẍ = −kx, donc ẍ + 400x = 0." },
      { label: "Identifier ω₀", detail: "ω₀² = 400, donc ω₀ = 20 rad·s⁻¹." },
      { label: "Exploiter t = 0", detail: "x₀ = −0,15 m et v₀ = 0 imposent Xm = 0,15 m et φ = π." },
      { label: "Vérifier", detail: "x(0) = −0,15 m et v(0) = 0 : la solution est cohérente." },
    ], "Résoudre l'Exercice 4 sans sauter d'étape", "Suis la chaîne du bilan des forces jusqu'à la vérification finale.", "Le signe négatif de x₀ ne signifie pas que l'amplitude est négative : Xm reste positive, c'est la phase φ = π qui place la voiture à gauche."),
    questions: [
      choice("La période propre s'exprime en…", ["seconde", "hertz", "rad·s⁻¹", "joule"], 0, "Le hertz est l'unité de fréquence.", "Exercice 3, affirmation 1", 1),
      choice("La fréquence est…", ["le nombre d'oscillations par seconde", "la durée d'une oscillation", "l'énergie par seconde", "le nombre de périodes par semaine"], 0, "C'est la définition physique correcte de la fréquence.", "Exercice 2", 2),
      choice("Sans frottement, l'énergie mécanique de l'oscillateur…", ["se conserve", "augmente", "diminue toujours", "est nulle"], 0, "Ec et Epe s'échangent, mais leur somme reste constante.", "Exercice 2 et 3", 1),
      short("Pour m = 0,25 kg et k = 100 N·m⁻¹, donne ω₀ en rad·s⁻¹.", ["20", "20 rad/s", "20rad/s"], "ω₀ = √(100/0,25) = 20 rad·s⁻¹.", "Exercice 4, question 2", 2),
      choice("Avec x₀ = −0,15 m et v₀ = 0, quelle phase convient ?", ["π", "0", "π/2", "−π/2"], 0, "cosφ = −1 et sinφ = 0, donc φ = π modulo 2π.", "Exercice 4, question 3", 2),
      choice("Quelle équation horaire est correcte ?", ["x = 0,15 cos(20t+π)", "x = −0,15 cos(20t)", "x = 0,15 sin(20t)", "x = 20 cos(0,15t+π)"], 0, "Elle respecte simultanément l'équation différentielle et les conditions initiales.", "Exercice 4, question 3", 2),
      short("Quelle est l'amplitude maximale de la vitesse de la voiture (en m·s⁻¹) ?", ["3", "3 m/s", "3m/s"], "Vm = ω₀Xm = 20×0,15 = 3 m·s⁻¹.", "Exercice 4, question 4", 2),
    ],
    corrections: [
      "Page 4, Exercice 2 : le document emploie « nombre de périodes par semaine ». La fréquence est le nombre d'oscillations par seconde ; son unité est le hertz.",
      "Pages 5-6 : la force exercée par le ressort est appelée par erreur « tension du fil » dans la résolution. Il s'agit de la force de rappel du ressort.",
    ],
  },
  {
    id: "suspension-oscillator-mission",
    title: "Mission finale : oscillateur et suspension automobile",
    summary: "Résoudre l'Exercice 5, corriger la raideur du ressort et transférer le modèle à une suspension réelle.",
    pages: "6-8",
    section: "Exercice 5 et application aux suspensions",
    durationMinutes: 25,
    xp: 105,
    kind: "challenge",
    body: String.raw`## Exercice 5 — reconstituer l'oscillation

Une masse $m=0{,}10$ kg oscille horizontalement. Sa période est $T_0=0{,}80$ s. À l'instant initial, elle passe par l'équilibre $x_0=0$ avec une vitesse de valeur $0{,}50$ m·s$^{-1}$ dirigée vers l'extrémité fixe du ressort. L'axe positif étant orienté vers la droite, $v_0=-0{,}50$ m·s$^{-1}$.

### 1. Pulsation propre et raideur

$$\omega_0=\frac{2\pi}{T_0}=\frac{2\pi}{0{,}80}\approx7{,}85\ \text{rad·s}^{-1}$$

Comme $\omega_0^2=k/m$ :

$$\boxed{k=m\omega_0^2=0{,}10\times7{,}85^2\approx6{,}16\ \text{N·m}^{-1}}$$

### 2. Amplitude et phase

À $t=0$, $x_0=X_m\cos\varphi=0$. Pour obtenir $v_0<0$, il faut $\sin\varphi>0$ ; on choisit $\varphi=\pi/2$.

$$X_m=\frac{|v_0|}{\omega_0}=\frac{0{,}50}{7{,}85}\approx0{,}064\ \text{m}$$

L'équation horaire est donc :

$$\boxed{x(t)=0{,}064\cos(7{,}85t+\pi/2)}$$

## De l'oscillateur idéal à la suspension

Une suspension de véhicule associe :

- un **ressort**, qui stocke puis restitue de l'énergie et soutient la charge ;
- un **amortisseur**, qui dissipe de l'énergie et empêche les oscillations de durer ;
- la **masse suspendue**, qui représente une partie du véhicule.

Le modèle idéal de cette leçon explique la période propre. Dans une vraie voiture, l'amortisseur est indispensable : sans lui, après chaque bosse, le véhicule continuerait d'osciller longtemps.

> **Mission Davy.** Savoir modéliser, c'est aussi savoir dire ce que le modèle oublie : ici, l'oscillateur libre idéal conserve son énergie, alors que la suspension réelle en dissipe pour protéger les passagers et maintenir les roues au contact de la route.` ,
    keyPoint: "Pour T₀ = 0,80 s, m = 0,10 kg et v₀ = −0,50 m·s⁻¹ : ω₀ ≈ 7,85 rad·s⁻¹, k ≈ 6,16 N·m⁻¹, Xm ≈ 0,064 m et φ = π/2.",
    example: "x(t) = 0,064 cos(7,85t+π/2) donne x(0) = 0 et v(0) = −7,85×0,064 ≈ −0,50 m·s⁻¹.",
    methodSteps: [
      "Traduis le sens initial de la vitesse en un signe algébrique.",
      "Calcule ω₀ = 2π/T₀ puis k = mω₀².",
      "Utilise x₀ = 0 pour repérer les phases possibles.",
      "Choisis le bon quadrant avec le signe de v₀.",
      "Calcule Xm = |v₀|/ω₀ et vérifie les conditions initiales.",
      "Pour la suspension réelle, distingue le ressort qui restitue l'énergie et l'amortisseur qui la dissipe.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mission graphique",
      title: "Suivre l'Exercice 5 sur deux périodes",
      instruction: "Déplace le point : l'élongation est exprimée en centimètres et la période vaut 0,80 s.",
      observation: "À t = 0, la masse traverse l'équilibre vers les x négatifs. Elle atteint −6,4 cm après T₀/4, revient à l'équilibre après T₀/2 puis atteint +6,4 cm après 3T₀/4.",
      formula: "x(t) = 6,4 cm · cos(7,85t + π/2)",
      formulaTex: "x(t)=6{,}4\cos(7{,}85t+\pi/2)\ \text{cm}",
      rule: {
        kind: "samples",
        points: [
          [0, 0], [0.1, -4.53], [0.2, -6.4], [0.3, -4.53], [0.4, 0], [0.5, 4.53],
          [0.6, 6.4], [0.7, 4.53], [0.8, 0], [0.9, -4.53], [1, -6.4], [1.1, -4.53],
          [1.2, 0], [1.3, 4.53], [1.4, 6.4], [1.5, 4.53], [1.6, 0],
        ],
      },
      window: { xMin: 0, xMax: 1.6, yMin: -7.5, yMax: 7.5 },
      guides: [{ kind: "horizontal", value: 0, label: "Équilibre x = 0" }],
      marker: { min: 0, max: 1.6, step: 0.1, initial: 0 },
    },
    questions: [
      short("Avec T₀ = 0,80 s, donne ω₀ à 0,01 rad·s⁻¹ près.", ["7,85", "7.85", "7,85 rad/s", "7.85 rad/s"], "ω₀ = 2π/0,80 ≈ 7,85 rad·s⁻¹.", "Exercice 5, question 2-a", 2),
      short("Avec m = 0,10 kg, calcule la raideur k en N·m⁻¹ à 0,01 près.", ["6,16", "6.16", "6,17", "6.17", "6,16 N/m"], "k = mω₀² = 0,10×7,85² ≈ 6,16 N·m⁻¹.", "Exercice 5, question 2-b", 3),
      choice("Si l'axe positif pointe à droite et la masse part vers l'extrémité fixe située à gauche, v₀ est…", ["négative", "positive", "nulle", "sans unité"], 0, "Le sens de la vitesse est opposé à l'orientation de l'axe.", "Exercice 5, données", 2),
      choice("x₀ = 0 et v₀ < 0 conduisent ici à…", ["φ = π/2", "φ = 0", "φ = π", "φ = −π/2"], 0, "cosφ = 0 et −sinφ < 0 imposent sinφ > 0.", "Exercice 5, question 3", 2),
      short("Calcule Xm en mètre à 0,001 m près.", ["0,064", "0.064", "0,0637", "0.0637", "6,4e-2"], "Xm = 0,50/7,85 ≈ 0,0637 m.", "Exercice 5, question 3", 3),
      choice("Quel composant d'une suspension dissipe l'énergie des oscillations ?", ["L'amortisseur", "Le ressort seul", "La roue", "La carrosserie"], 0, "L'amortisseur réduit progressivement l'amplitude.", "Documentation sur les suspensions", 1),
      choice("Pourquoi le modèle du cours conserve-t-il l'énergie mécanique ?", ["Parce qu'il néglige les frottements", "Parce que la masse est nulle", "Parce que le ressort ne travaille pas", "Parce que l'amortisseur ajoute de l'énergie"], 0, "Le modèle idéal ne contient aucune force dissipative.", "3. Énergie mécanique", 2),
      choice("Dans une suspension réelle, le ressort sert surtout à…", ["stocker et restituer de l'énergie", "dissiper toute l'énergie", "bloquer totalement le mouvement", "mesurer la vitesse"], 0, "Le ressort assure le rappel ; l'amortisseur assure la dissipation.", "Documentation sur les suspensions", 1),
    ],
    corrections: [
      "Pages 6-7 : la force du ressort est appelée par erreur « tension du fil ». Le système étudié comporte bien un ressort.",
      "Page 7 : le document écrit k = ω₀²/m et annonce 616 N·m⁻¹. La relation correcte est k = mω₀², soit k ≈ 6,16 N·m⁻¹ pour m = 0,10 kg et ω₀ = 7,85 rad·s⁻¹.",
      "Page 8 : l'axe vertical du graphique est étiqueté i(A), comme un courant électrique. Il représente ici l'élongation x, en mètre (ou en centimètre sur notre tracé).",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const freeMechanicalOscillationsPath: LearningPath = {
  id: "terminale-cd-free-mechanical-oscillations",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C et D • Côte d’Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 1, title: "Mécanique" },
  chapterNumber: 5,
  title: "Oscillations mécaniques libres",
  description: "Du vocabulaire des oscillations au système masse-ressort : établir l'équation différentielle, déterminer l'équation horaire, suivre les échanges d'énergie et comprendre une suspension automobile.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Définir période, fréquence et pulsation propres d'un oscillateur mécanique libre.",
    "Établir l'équation différentielle d'un système masse-ressort horizontal.",
    "Déterminer amplitude et phase à partir des conditions initiales.",
    "Exploiter les graphes de position, vitesse et accélération.",
    "Utiliser la conservation de l'énergie mécanique et transférer le modèle à une suspension réelle.",
  ],
  modules: [{
    id: "free-mechanical-oscillations-mastery",
    title: "Maîtriser les oscillations mécaniques libres",
    description: "Huit niveaux progressifs, des notions fondamentales à la mission sur la suspension automobile.",
    lessons: builtLevels,
  }],
};

export const freeMechanicalOscillationsPaths: LearningPath[] = [freeMechanicalOscillationsPath];
