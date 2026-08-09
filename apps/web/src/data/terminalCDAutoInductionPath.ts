import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 10 de Physique - Terminales C et D.
const sourceDocument = "TleD_PHY_L10_Auto induction.pdf";

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
      tip: "Astuce Davy : sur un graphe de courant, commence toujours par calculer la pente Δi/Δt en unités SI. Le signe et la valeur de la tension inductive deviennent ensuite immédiats.",
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
    id: "auto-induction-evidence-transients",
    title: "Mettre en évidence l’auto-induction",
    summary: "Comprendre le retard à l’allumage, lire les oscillogrammes et distinguer régime transitoire et régime permanent.",
    pages: "1-2",
    section: "II.1 Mise en évidence de l’auto-induction",
    durationMinutes: 18,
    xp: 45,
    body: String.raw`## Une bobine refuse les variations brusques de courant

Le document compare deux branches alimentées par le même générateur :

- la première contient une résistance $R$ et la lampe $L_1$ ;
- la seconde contient une bobine d’inductance $L$, de résistance interne égale à $R$, et la lampe $L_2$.

Les lampes sont identiques et les deux branches ont la même résistance en régime permanent. La différence observée au moment de la commutation provient donc de la bobine.

### À la fermeture de l’interrupteur

$L_1$ s’allume presque immédiatement, tandis que $L_2$ s’allume progressivement. La bobine **retarde l’établissement** du courant dans sa branche.

### À l’ouverture de l’interrupteur

$L_1$ s’éteint avant $L_2$. La bobine tend à **maintenir le courant** qui la parcourait avant l’ouverture.

Dans les deux cas, elle ne s’oppose pas au courant lui-même : elle s’oppose à sa **variation**.

$$\boxed{\text{Auto-induction} = \text{opposition d’une bobine aux variations de son propre courant}}$$

## Ce que montre l’oscilloscope

Le générateur basse fréquence fournit une tension créneau $u_{AM}$. La voie $Y_A$ affiche cette tension. La voie $Y_B$ affiche la tension aux bornes de la résistance :

$$u_{BM}=Ri$$

La courbe de $u_{BM}$ a donc exactement la même allure que le courant $i$.

| Commutation | Tension du générateur | Courant dans la bobine |
|---|---|---|
| Fermeture | passe brutalement de $0$ à $E$ | croît progressivement vers $I_{\max}$ |
| Ouverture | retombe brutalement à $0$ | décroît progressivement vers $0$ |

Le courant d’une bobine réelle ne peut donc pas effectuer un saut instantané dans ce modèle.

## Deux régimes à ne pas confondre

- Le **régime transitoire** correspond à la phase où $i$ varie : établissement ou annulation.
- Le **régime permanent** correspond à une intensité devenue constante.

En régime permanent continu, l’effet inductif disparaît puisque $\mathrm di/\mathrm dt=0$. La bobine réelle se comporte alors comme sa résistance interne $r$.

> **Astuce mémoire.** Une bobine possède une mémoire du courant : juste après une commutation, elle cherche à conserver la valeur qu’il avait juste avant.

> **Erreur fréquente.** Dire « la bobine bloque le courant » est faux. Après le transitoire, le courant circule normalement ; seule sa variation a été freinée.` ,
    keyPoint: "Une bobine s’oppose aux variations de son propre courant : montée et extinction sont progressives pendant le régime transitoire.",
    example: "À la fermeture, uAM passe immédiatement à E mais uBM=Ri croît progressivement : la courbe de uBM visualise directement l’établissement du courant.",
    methodSteps: [
      "Repère l’instant de fermeture ou d’ouverture du circuit.",
      "Identifie la grandeur directement imposée par le générateur.",
      "Utilise uBM=Ri pour lire l’évolution du courant sur la voie de la résistance.",
      "Qualifie de transitoire la phase où i varie et de permanent le plateau final.",
      "Explique le retard par l’opposition de la bobine à la variation, jamais par un blocage définitif.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Oscillogramme redessiné",
      title: "Établissement puis annulation du courant",
      instruction: "Déplace le point de la fermeture à l’ouverture et observe la continuité du courant normalisé.",
      observation: "Le courant croît sans saut, puis décroît sans saut après l’ouverture. Les portions inclinées sont les régimes transitoires.",
      formula: "i(t) / Imax",
      formulaTex: "i(t)/I_{\\max}",
      rule: { kind: "samples", points: [[0, 0], [0.2, 0.34], [0.4, 0.56], [0.6, 0.71], [0.8, 0.81], [1, 0.88], [1.2, 0.59], [1.4, 0.39], [1.6, 0.26], [1.8, 0.17], [2, 0.11]] },
      window: { xMin: 0, xMax: 2, yMin: 0, yMax: 1.05 },
      guides: [{ kind: "horizontal", value: 1, label: "Imax" }, { kind: "vertical", value: 1, label: "ouverture" }],
      marker: { min: 0, max: 2, step: 0.1, initial: 0.4 },
    },
    questions: [
      choice("À la fermeture de K, quelle lampe s’allume progressivement ?", ["L1", "L2, placée avec la bobine", "Les deux s’allument nécessairement au même instant", "Aucune"], 1, "La bobine retarde l’établissement du courant dans la branche de L2.", "II.1.1 Retard à l’allumage", 1),
      choice("Une bobine s’oppose principalement…", ["au courant constant", "aux variations du courant", "à toute tension", "à la résistance du circuit"], 1, "L’auto-induction apparaît lorsque le courant varie.", "II.1.3 Conclusion", 2),
      choice("Pourquoi uBM possède-t-elle la même forme que i ?", ["Parce que uBM=Ri", "Parce que uBM=L/i", "Parce que R est nulle", "Parce que i est toujours constant"], 0, "R étant constante, la tension ohmique est proportionnelle au courant.", "II.1.2 Visualisation à l’oscilloscope", 2),
      choice("À la fermeture, le courant dans la bobine…", ["saute instantanément à l’infini", "croît progressivement", "reste toujours nul", "change obligatoirement de signe"], 1, "La bobine freine son établissement.", "II.1.2.3 Interprétation", 1),
      choice("À l’ouverture, le courant…", ["s’annule progressivement", "double instantanément", "devient nécessairement alternatif", "reste à Imax pour toujours"], 0, "La bobine tend à maintenir le courant puis celui-ci décroît.", "II.1.2.3 Interprétation", 1),
      choice("Le régime où i varie est appelé…", ["régime permanent", "régime transitoire", "régime statique", "régime gravitationnel"], 1, "Le transitoire accompagne l’établissement ou l’annulation du courant.", "II.1.2.3 Remarque", 1),
      choice("En régime permanent continu, di/dt vaut…", ["1", "-1", "0", "Imax²"], 2, "Une intensité constante a une dérivée nulle.", "II.1.2.3 Remarque", 1),
      choice("L’auto-induction résulte de la variation…", ["du flux magnétique propre de la bobine", "de la masse de la bobine", "de la couleur des fils", "de la pesanteur"], 0, "Le courant crée un flux dans la bobine ; sa variation induit une f.é.m. dans cette même bobine.", "II.1.2.4 Conclusion", 2),
    ],
  },
  {
    id: "self-induced-emf-current-slopes",
    title: "Calculer la f.é.m. d’auto-induction",
    summary: "Appliquer e=-L di/dt à un courant variable et transformer les pentes d’un graphe de courant en niveaux de tension.",
    pages: "3-4",
    section: "II.2.3 Force électromotrice d’auto-induction",
    durationMinutes: 20,
    xp: 65,
    kind: "graph",
    body: String.raw`## La loi de Faraday appliquée à la bobine elle-même

Lorsque le courant varie, le flux propre $\Phi_p=Li$ varie. La loi de Faraday donne la force électromotrice d’auto-induction :

$$e=-\frac{\mathrm d\Phi_p}{\mathrm dt}$$

Si l’inductance $L$ est constante :

$$\boxed{e=-L\frac{\mathrm di}{\mathrm dt}}$$

Le signe moins traduit la loi de Lenz : la f.é.m. créée s’oppose à la variation qui lui donne naissance.

| Évolution de $i$ | Signe de $\mathrm di/\mathrm dt$ | Signe de $e$ |
|---|---:|---:|
| courant croissant | positif | négatif |
| courant constant | nul | nul |
| courant décroissant | négatif | positif |

L’unité est cohérente :

$$[e]=\text{H}\times\text{A}\,\text{s}^{-1}=\text{V}$$

## Lire une pente sur un graphe

Sur un segment droit, la pente est constante :

$$\frac{\mathrm di}{\mathrm dt}=\frac{i_2-i_1}{t_2-t_1}$$

Il faut convertir les milliampères en ampères et les millisecondes en secondes **avant** d’appliquer la formule.

## Application officielle 3

La bobine possède $L=12\ \text{mH}=12\times10^{-3}\ \text{H}$.

### De $0$ à $0{,}15\ \text{s}$

Le courant passe de $0$ à $0{,}6\ \text{A}$ :

$$\frac{\Delta i}{\Delta t}=\frac{0{,}6}{0{,}15}=4\ \text{A}\,\text{s}^{-1}$$

$$e=-12\times10^{-3}\times4=-48\ \text{mV}$$

### De $0{,}15$ à $0{,}25\ \text{s}$

Le courant est constant :

$$e=0$$

### De $0{,}25$ à $0{,}35\ \text{s}$

Le courant passe de $0{,}6\ \text{A}$ à $0$ :

$$\frac{\Delta i}{\Delta t}=\frac{-0{,}6}{0{,}10}=-6\ \text{A}\,\text{s}^{-1}$$

$$e=-12\times10^{-3}\times(-6)=+72\ \text{mV}$$

La f.é.m. est donc un signal en trois paliers : $-48\ \text{mV}$, $0$, puis $+72\ \text{mV}$.

> **Astuce mémoire.** La tension inductive lit la **pente** du courant, pas sa hauteur. Un grand courant constant donne $e=0$ ; un petit courant qui varie vite peut donner une grande f.é.m.

> **Erreur fréquente.** Ne mélange pas le signe de $i$ et celui de sa pente. Un courant positif mais décroissant possède une pente négative, donc une f.é.m. positive.` ,
    keyPoint: "Pour L constante : e=-L di/dt ; une rampe de courant produit un palier de f.é.m. de signe opposé à sa pente.",
    example: "Avec L=12 mH, une pente de +4 A/s donne e=-48 mV ; une pente de -6 A/s donne e=+72 mV.",
    methodSteps: [
      "Découpe le graphe aux changements de pente.",
      "Convertis L en henrys, les temps en secondes et le courant en ampères.",
      "Calcule Δi/Δt sur chaque intervalle.",
      "Multiplie par -L en conservant le signe de la pente.",
      "Trace un palier horizontal de e sur chaque segment de i.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Dérivation graphique",
      title: "La f.é.m. de l’application 3",
      instruction: "Déplace le point le long du temps et observe les trois valeurs constantes de e.",
      observation: "Rampe montante : -48 mV ; plateau : 0 ; rampe descendante : +72 mV.",
      formula: "e(t) = -L di/dt",
      formulaTex: "e(t)=-L\\,\\frac{\\mathrm di}{\\mathrm dt}",
      rule: { kind: "samples", points: [[0, -48], [0.149, -48], [0.15, 0], [0.249, 0], [0.25, 72], [0.35, 72]] },
      window: { xMin: 0, xMax: 0.35, yMin: -60, yMax: 85 },
      guides: [{ kind: "horizontal", value: 0, label: "e = 0" }, { kind: "vertical", value: 0.15, label: "0,15 s" }, { kind: "vertical", value: 0.25, label: "0,25 s" }],
      marker: { min: 0, max: 0.35, step: 0.01, initial: 0.1 },
    },
    questions: [
      choice("La f.é.m. d’auto-induction s’écrit…", ["e=L di/dt", "e=-L di/dt", "e=Li²", "e=ri"], 1, "Le signe moins traduit l’opposition de Lenz.", "II.2.3 Force électromotrice", 2),
      choice("Si le courant croît, e est…", ["positive", "négative", "toujours nulle", "sans unité"], 1, "di/dt>0 donc e=-L di/dt<0.", "II.2.3 Loi de Lenz", 1),
      choice("Si le courant est constant, e vaut…", ["L", "i", "0", "ri²"], 2, "La dérivée d’un courant constant est nulle.", "II.2.3 Force électromotrice", 1),
      short("Convertis L=12 mH en H.", ["0,012", "0.012", "12.10^-3", "12e-3", "0,012 H"], "12 mH=12×10⁻³ H=0,012 H.", "Exercice d’application 3", 1),
      short("Calcule la pente de i entre 0 et 0,15 s.", ["4", "+4", "4 A/s", "+4 A/s"], "0,6/0,15=4 A/s.", "Exercice d’application 3", 2),
      short("Donne e entre 0 et 0,15 s.", ["-48", "-48 mV", "-0,048 V", "-0.048 V"], "e=-0,012×4=-0,048 V=-48 mV.", "Exercice d’application 3", 2),
      short("Donne e entre 0,15 et 0,25 s.", ["0", "0 V", "0 mV"], "Le courant est constant sur le plateau.", "Exercice d’application 3", 1),
      short("Calcule la pente de i entre 0,25 et 0,35 s.", ["-6", "-6 A/s"], "(0-0,6)/(0,35-0,25)=-6 A/s.", "Exercice d’application 3", 2),
      short("Donne e entre 0,25 et 0,35 s.", ["72", "+72", "72 mV", "+72 mV", "0,072 V", "0.072 V"], "e=-0,012×(-6)=+0,072 V.", "Exercice d’application 3", 2),
    ],
    corrections: [
      "Page 4, troisième intervalle : la solution imprime 0,25<t<0,35 ms, alors que le graphe et les deux premiers intervalles sont en secondes. L’intervalle correct est 0,25<t<0,35 s.",
      "Page 4, légende d’échelle : la mention « 1 cm ↔ 24 ms » est incompatible avec l’axe 0,15 s à 0,35 s et n’est pas utilisée dans le calcul. Le parcours s’appuie sur les valeurs explicites de l’axe.",
    ],
  },
  {
    id: "coil-terminal-voltage",
    title: "Établir la tension aux bornes d’une bobine",
    summary: "Décomposer la tension d’une bobine réelle en chute ohmique et tension inductive, puis traiter les cas particuliers.",
    pages: "4-5",
    section: "II.3 Tension aux bornes d’une bobine",
    durationMinutes: 19,
    xp: 75,
    body: String.raw`## Une bobine réelle possède deux effets

Une bobine réelle est modélisée par :

- une inductance idéale $L$ ;
- une résistance interne $r$ due au fil conducteur.

Avec la convention récepteur, le courant entre par la borne positive de la tension $u_{AB}$. Le document écrit :

$$u_{AB}=ri-e$$

Or :

$$e=-L\frac{\mathrm di}{\mathrm dt}$$

Donc :

$$\boxed{u_{AB}=ri+L\frac{\mathrm di}{\mathrm dt}}$$

Les deux termes ont des rôles différents :

| Terme | Origine | Existe quand… |
|---|---|---|
| $ri$ | résistance du fil | le courant est non nul |
| $L\,\mathrm di/\mathrm dt$ | auto-induction | le courant varie |

## Cas particuliers

### Inductance pure

Si $r=0$ :

$$u_{AB}=L\frac{\mathrm di}{\mathrm dt}=-e$$

### Régime permanent continu

Si $i=I$ est constante :

$$\frac{\mathrm di}{\mathrm dt}=0
\qquad\Longrightarrow\qquad
u_{AB}=rI$$

La bobine réelle se comporte alors comme une résistance $r$. Une inductance idéale de résistance nulle se comporte comme un fil en régime permanent continu.

## Activité d’application 4

La bobine possède $L=0{,}5\ \text{H}$ et $r=8\ \Omega$. Le courant est :

$$i(t)=5-2{,}5t$$

Sa dérivée vaut :

$$\frac{\mathrm di}{\mathrm dt}=-2{,}5\ \text{A}\,\text{s}^{-1}$$

La tension est donc :

$$u(t)=8(5-2{,}5t)+0{,}5(-2{,}5)$$

$$\boxed{u(t)=38{,}75-20t}$$

À $t=1\ \text{s}$ :

$$\boxed{u(1)=18{,}75\ \text{V}}$$

Le terme inductif est ici négatif parce que le courant décroît ; il réduit la tension réceptrice $u_{AB}$ par rapport à $ri$.

> **Astuce mémoire.** Pour la tension réceptrice de la bobine, retiens **R + L** : $u=ri+L i'$. Pour sa f.é.m. génératrice, retiens le signe de Lenz : $e=-Li'$.

> **Contrôle de signe.** Si $i$ croît, le terme inductif de $u$ est positif ; si $i$ décroît, il est négatif.` ,
    keyPoint: "En convention récepteur, uAB=ri+L di/dt ; pour r=0, uAB=-e ; en continu permanent, uAB=rI.",
    example: "Avec r=8 Ω, L=0,5 H et i=5-2,5t, u=8i+0,5i'=38,75-20t et u(1)=18,75 V.",
    methodSteps: [
      "Repère le sens du courant et l’orientation de la tension demandée.",
      "Écris u=ri+L di/dt en convention récepteur.",
      "Calcule i(t) puis sa dérivée dans les unités SI.",
      "Additionne séparément la partie ohmique et la partie inductive.",
      "Vérifie les cas limites : r=0 ou di/dt=0.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Modèle électrique",
      title: "Les deux composantes de la tension",
      instruction: "Sélectionne une composante pour voir quand elle intervient.",
      observation: "La résistance dépend de la valeur du courant ; l’inductance dépend de sa vitesse de variation.",
      rootLabel: "uAB = ri + L di/dt",
      rootDetail: "La tension totale est la somme algébrique de la chute ohmique et de la tension inductive.",
      nodes: [
        { id: "resistive", group: "Bobine réelle", label: "Partie ohmique", role: "ur=ri", detail: "Elle traduit l’effet Joule dans le fil et subsiste en régime permanent si r n’est pas nulle." },
        { id: "inductive", group: "Bobine réelle", label: "Partie inductive", role: "uL=L di/dt", detail: "Elle n’existe que lorsque le courant varie et peut être positive ou négative selon la pente." },
        { id: "pure", group: "Cas limites", label: "Inductance pure", role: "r=0", detail: "La tension devient uAB=L di/dt=-e." },
        { id: "steady", group: "Cas limites", label: "Courant constant", role: "di/dt=0", detail: "La bobine réelle ne présente plus que sa résistance interne : uAB=rI." },
      ],
    },
    questions: [
      choice("En convention récepteur, la tension d’une bobine réelle vaut…", ["u=ri+L di/dt", "u=ri-Li", "u=L/i", "u=ri²"], 0, "La tension additionne les composantes ohmique et inductive.", "II.3.2 Loi d’Ohm", 2),
      choice("La f.é.m. e et la tension d’une inductance pure uAB vérifient…", ["uAB=e", "uAB=-e", "uAB=e²", "uAB=0 toujours"], 1, "Pour r=0, uAB=L di/dt tandis que e=-L di/dt.", "II.3.2 Remarques", 2),
      choice("En régime permanent continu, une bobine réelle se comporte comme…", ["un condensateur ouvert", "sa résistance interne r", "un générateur idéal", "une masse"], 1, "di/dt=0, donc uAB=rI.", "II.3.2 Remarques", 1),
      short("Activité 4 : donne di/dt en A/s.", ["-2,5", "-2.5", "-2,5 A/s", "-2.5 A/s"], "La dérivée de 5-2,5t est -2,5.", "Activité d’application 4", 1),
      short("Activité 4 : donne le terme inductif L di/dt en volts.", ["-1,25", "-1.25", "-1,25 V", "-1.25 V"], "0,5×(-2,5)=-1,25 V.", "Activité d’application 4", 2),
      short("Activité 4 : donne l’expression de u(t).", ["38,75-20t", "38.75-20t", "u=38,75-20t", "u(t)=38,75-20t"], "u=8(5-2,5t)-1,25=38,75-20t.", "Activité d’application 4", 3),
      short("Activité 4 : calcule u à t=1 s.", ["18,75", "18.75", "18,75 V", "18.75 V"], "u(1)=38,75-20=18,75 V.", "Activité d’application 4", 2),
      choice("Si i croît dans une inductance pure, uAB est…", ["positive avec la convention récepteur", "négative dans tous les repères", "toujours nulle", "égale à ri"], 0, "L>0 et di/dt>0 donnent uAB=L di/dt>0.", "II.3.2 Loi d’Ohm", 1),
      choice("Quel terme disparaît quand le courant devient constant ?", ["ri", "L di/dt", "r", "i"], 1, "La dérivée du courant devient nulle.", "II.3.2 Remarques", 1),
    ],
  },
  {
    id: "self-flux-solenoid-inductance",
    title: "Relier flux propre et inductance",
    summary: "Passer du champ du solénoïde au flux total lié aux spires, puis définir l’inductance L par Φp=Li.",
    pages: "2-3",
    section: "II.2 Flux propre et inductance d’une bobine",
    durationMinutes: 22,
    xp: 55,
    body: String.raw`## Le flux propre est créé par le courant de la bobine

Le courant $i$ qui traverse une bobine crée un champ magnétique $\vec B$. Ce champ traverse les propres spires de la bobine : on parle de **flux magnétique propre**.

Pour une spire d’aire $S$, orientée par le vecteur-surface $\vec S$ :

$$\phi_1=\vec B\cdot\vec S=BS\cos\theta$$

Dans un solénoïde long, le champ est dirigé suivant l’axe. Le vecteur-surface des spires est choisi dans le même sens, donc $\theta=0$ et $\cos\theta=1$.

$$B=\mu_0\frac{N}{\ell}i$$

Le flux total lié aux $N$ spires est alors :

$$\Phi_p=N\phi_1=NBS=\mu_0\frac{N^2S}{\ell}i$$

Il faut distinguer soigneusement :

| Grandeur | Expression | Sens |
|---|---|---|
| Flux d’une spire | $\phi_1=BS$ | flux à travers une seule surface |
| Flux propre total | $\Phi_p=NBS$ | somme des flux liés aux $N$ spires |

## Définition de l’inductance

Dans une bobine sans noyau ferromagnétique et de géométrie fixe, $\Phi_p$ est proportionnel au courant. Le coefficient de proportionnalité est l’**inductance** $L$ :

$$\boxed{L=\frac{\Phi_p}{i}=\mu_0\frac{N^2S}{\ell}}$$

L’unité de $L$ est le **henry**, symbole $\text{H}$. Plus $N$ et $S$ sont grands, plus l’inductance est forte ; une bobine plus longue possède une inductance plus faible, toutes choses égales par ailleurs.

## Application officielle 1

Avec $N=100$, $\ell=0{,}40\ \text{m}$, $S=20\ \text{cm}^2=2{,}0\times10^{-3}\ \text{m}^2$ et $i=0{,}10\ \text{A}$ :

$$B=\mu_0\frac{N}{\ell}i\approx3{,}14\times10^{-5}\ \text{T}$$

Le flux d’une seule spire vaut :

$$\phi_1=BS\approx6{,}28\times10^{-8}\ \text{Wb}$$

Mais le flux propre total demandé à travers les $100$ spires est :

$$\boxed{\Phi_p=NBS\approx6{,}28\times10^{-6}\ \text{Wb}}$$

## Application officielle 2

Pour $\ell=0{,}50\ \text{m}$, un diamètre $d=5\ \text{cm}$ donc $r=0{,}025\ \text{m}$, et $N=2{,}0\times10^4$ :

$$S=\pi r^2$$

$$L=\mu_0\frac{N^2\pi r^2}{\ell}\approx1{,}97\ \text{H}$$

La bonne proposition officielle est donc **c)**.

> **Astuce mémoire.** Une spire donne $BS$ ; toute la bobine donne $NBS$. Le second facteur $N$ est celui qu’on oublie le plus souvent.

> **Contrôle rapide.** Dans $L=\mu_0N^2S/\ell$, doubler le nombre de spires multiplie $L$ par quatre.` ,
    keyPoint: "Pour un solénoïde long : Φp=NBS=μ0N²Si/ℓ=Li et L=μ0N²S/ℓ.",
    example: "N=100, ℓ=0,40 m, S=2,0×10⁻³ m² et i=0,10 A donnent B=3,14×10⁻⁵ T, φ1=6,28×10⁻⁸ Wb et Φp=6,28×10⁻⁶ Wb.",
    methodSteps: [
      "Convertis la longueur, le rayon et l’aire en unités SI.",
      "Calcule le champ avec B=μ0Ni/ℓ.",
      "Décide si la question demande le flux d’une spire φ1=BS ou le flux total Φp=NBS.",
      "Utilise Φp=Li pour relier flux propre et inductance.",
      "Pour une bobine sans noyau, contrôle avec L=μ0N²S/ℓ.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Chaîne de calcul",
      title: "Du courant à l’inductance",
      instruction: "Sélectionne chaque étape pour comprendre où interviennent les deux facteurs N.",
      observation: "Un facteur N crée le champ du solénoïde ; le second additionne le flux des N spires.",
      rootLabel: "Bobine parcourue par i",
      rootDetail: "Le courant produit le champ qui traverse les spires de cette même bobine.",
      nodes: [
        { id: "field", group: "Création", label: "Champ B", role: "B=μ0Ni/ℓ", detail: "Le premier facteur N vient du nombre de spires par unité de longueur qui créent le champ intérieur." },
        { id: "one-turn", group: "Flux", label: "Une spire", role: "φ1=BS", detail: "Pour une spire orientée comme le champ, le flux est le produit du champ par l’aire de la spire." },
        { id: "all-turns", group: "Flux", label: "N spires", role: "Φp=NBS", detail: "Le second facteur N additionne le flux lié à chacune des N spires." },
        { id: "inductance", group: "Propriété", label: "Inductance L", role: "Φp=Li", detail: "La géométrie fixe le coefficient L=μ0N²S/ℓ, exprimé en henrys." },
      ],
    },
    questions: [
      choice("Le flux propre est créé par…", ["le courant qui traverse la bobine elle-même", "la masse du solénoïde", "la résistance seule", "la gravité"], 0, "Le courant de la bobine crée son propre champ magnétique.", "II.2.1 Définition", 1),
      choice("Dans un solénoïde long, le champ intérieur vaut…", ["B=μ0Ni/ℓ", "B=μ0ℓ/(Ni)", "B=NiS", "B=L/i"], 0, "C’est l’expression du champ d’un solénoïde long sans noyau.", "II.2.1 Champ du solénoïde", 2),
      choice("Le flux d’une seule spire orientée comme B vaut…", ["BS", "NBS", "B/S", "Li²"], 0, "Une spire ne reçoit pas encore le facteur de sommation N.", "II.2.1 Flux d’une spire", 1),
      choice("Le flux propre total des N spires vaut…", ["BS/N", "NBS", "N+B+S", "μ0i/N"], 1, "Les flux identiques des N spires s’additionnent.", "II.2.1 Flux propre", 2),
      choice("L’inductance s’exprime en…", ["teslas", "webers", "henrys", "joules par seconde uniquement"], 2, "L’unité SI de l’inductance est le henry, H.", "II.2.2 Inductance", 1),
      choice("Quelle relation définit L ?", ["L=i/Φp", "L=Φp/i", "L=Φpi", "L=Φp+i"], 1, "Le flux propre est proportionnel au courant : Φp=Li.", "II.2.2 Inductance", 2),
      short("Application 1 : donne B en teslas.", ["3,14.10^-5", "3.14e-5", "0,0000314", "0.0000314", "3,14×10^-5 T"], "B=4π×10⁻⁷×100×0,10/0,40≈3,14×10⁻⁵ T.", "Exercice d’application 1", 2),
      short("Application 1 : donne le flux d’une spire φ1 en Wb.", ["6,28.10^-8", "6.28e-8", "0,0000000628", "6,28×10^-8 Wb"], "φ1=BS=3,14×10⁻⁵×2,0×10⁻³≈6,28×10⁻⁸ Wb.", "Exercice d’application 1", 2),
      short("Application 1 : donne le flux propre total Φp en Wb.", ["6,28.10^-6", "6.28e-6", "0,00000628", "6,28×10^-6 Wb"], "Il faut multiplier le flux d’une spire par N=100.", "Exercice d’application 1", 3),
      choice("Application 2 : quelle valeur de L est correcte ?", ["0,97 H", "1,5 H", "1,97 H", "19,7 H"], 2, "L=μ0N²πr²/ℓ≈1,97 H.", "Exercice d’application 2", 2),
    ],
    corrections: [
      "Page 3, exercice d’application 1 : la solution calcule 6,28×10⁻⁸ Wb avec Φ=BS. Cette valeur est le flux d’une spire ; le flux propre total à travers les 100 spires demandé par l’énoncé vaut NBS=6,28×10⁻⁶ Wb.",
    ],
  },
  {
    id: "magnetic-energy-power",
    title: "Comprendre l’énergie magnétique d’une bobine",
    summary: "Décomposer la puissance reçue entre effet Joule et stockage magnétique, puis utiliser Em=1/2 Li².",
    pages: "5",
    section: "II.4 Énergie magnétique emmagasinée dans une bobine",
    durationMinutes: 18,
    xp: 80,
    body: String.raw`## La puissance reçue par une bobine réelle

La puissance électrique reçue est :

$$P=u_{AB}i$$

Avec $u_{AB}=ri+L\,\mathrm di/\mathrm dt$ :

$$P=ri^2+Li\frac{\mathrm di}{\mathrm dt}$$

Or, si $L$ est constante :

$$Li\frac{\mathrm di}{\mathrm dt}
=\frac{\mathrm d}{\mathrm dt}\left(\frac12Li^2\right)$$

Donc :

$$\boxed{P=ri^2+\frac{\mathrm d}{\mathrm dt}\left(\frac12Li^2\right)}$$

Cette relation sépare deux destinations de l’énergie :

- $ri^2$ est la puissance dissipée par **effet Joule** dans le fil ;
- $\mathrm d(\tfrac12Li^2)/\mathrm dt$ est la puissance échangée avec le **champ magnétique**.

## Énergie emmagasinée

L’énergie magnétique stockée par la bobine parcourue par un courant $i$ vaut :

$$\boxed{E_m=\frac12Li^2}$$

Elle s’exprime en joules. Elle est toujours positive ou nulle, car elle dépend de $i^2$.

Lorsque le courant s’établit, $E_m$ augmente. Quand le courant décroît, la bobine restitue cette énergie au circuit ; cette restitution peut provoquer une surtension ou une étincelle de rupture.

## Bilan énergétique correct

Entre $0$ et $t$, l’énergie électrique reçue par une bobine réelle est :

$$E_{\text{reçue}}(t)=\int_0^t r\,i(\tau)^2\,\mathrm d\tau+\frac12Li(t)^2-\frac12Li(0)^2$$

Si le courant part de zéro, le dernier terme initial disparaît. Le document remplace parfois l’intégrale Joule par $ri^2t$ ; cette simplification n’est valable que si $i$ est constant sur toute la durée considérée.

## Activité d’application 6

Pour $L=1{,}5\ \text{H}$ et $i=2\ \text{A}$ :

$$E_m=\frac12\times1{,}5\times2^2=3\ \text{J}$$

Si le courant double :

$$E'_m=\frac12L(2i)^2=4E_m$$

L’énergie est donc multipliée par quatre.

> **Astuce mémoire.** L’énergie d’une bobine ressemble à l’énergie cinétique $\tfrac12mv^2$ : remplace la masse $m$ par l’inductance $L$ et la vitesse $v$ par le courant $i$.

> **Conséquence.** Doubler $L$ double l’énergie ; doubler $i$ la quadruple.` ,
    keyPoint: "L’énergie magnétique d’une bobine vaut Em=1/2 Li² ; la puissance reçue se partage entre ri² et dEm/dt.",
    example: "Une bobine de 1,5 H parcourue par 2 A stocke 3 J ; à 4 A, elle stocke 12 J.",
    methodSteps: [
      "Identifie l’inductance L et le courant instantané i.",
      "Convertis les unités en henrys et ampères.",
      "Calcule Em=1/2 Li² sans oublier le carré du courant.",
      "Pour une comparaison, utilise directement Em∝L et Em∝i².",
      "Distingue l’énergie magnétique de l’énergie dissipée par effet Joule.",
    ],
    interaction: {
      eyebrow: "Énergie interactive",
      title: "L’énergie croît comme le carré du courant",
      instruction: "Fais varier le courant de 0 à 4 A pour une bobine de 1,5 H.",
      observation: "À 2 A, l’énergie vaut 3 J ; à 4 A, elle vaut 12 J : doubler le courant quadruple l’énergie.",
      formula: "Em = 0,75 i²",
      formulaTex: "E_m=\\frac12Li^2=0{,}75i^2",
      inputSymbol: "i",
      outputSuffix: " J",
      rule: { kind: "quadratic", coefficient: 0.75, constant: 0 },
      input: { min: 0, max: 4, step: 0.5, initial: 2 },
    },
    questions: [
      choice("La puissance reçue par une bobine réelle se décompose en…", ["ri² et d(1/2 Li²)/dt", "ri et Li", "L/i et r/i", "deux puissances toujours nulles"], 0, "La première partie est dissipée, la seconde modifie l’énergie magnétique.", "II.4.1 Puissance échangée", 2),
      choice("La puissance dissipée par effet Joule vaut…", ["ri²", "Li²", "L di/dt", "i/L"], 0, "C’est la puissance de la résistance interne r.", "II.4.1 Puissance échangée", 1),
      choice("L’énergie magnétique stockée vaut…", ["Li", "1/2 Li²", "ri²t dans tous les cas", "L/i²"], 1, "La formule de stockage est Em=1/2 Li².", "II.4.2 Énergie emmagasinée", 2),
      choice("L’unité de l’énergie magnétique est…", ["le tesla", "le joule", "le henry", "le weber par seconde"], 1, "Comme toute énergie, elle s’exprime en joules.", "II.4.2 Énergie emmagasinée", 1),
      short("Calcule Em pour L=1,5 H et i=2 A.", ["3", "3 J"], "Em=1/2×1,5×4=3 J.", "Activité d’application 6", 2),
      choice("Si le courant double, Em est multipliée par…", ["2", "4", "8", "elle ne change pas"], 1, "L’énergie dépend du carré du courant.", "Activité d’application 6", 1),
      short("Calcule Em pour la même bobine à i=4 A.", ["12", "12 J"], "Em=1/2×1,5×16=12 J.", "Activité d’application 6", 2),
      choice("L’écriture ri²t pour l’énergie Joule est directement valable lorsque…", ["i reste constant sur la durée", "i varie arbitrairement", "L est nulle uniquement", "r est infinie"], 0, "Si i varie, il faut intégrer ri(t)² sur le temps.", "II.4.2 Bilan énergétique", 2),
    ],
    corrections: [
      "Page 5, bilan énergétique : l’écriture ri²t n’est générale que pour un courant constant. Si i dépend du temps, l’énergie Joule correcte est l’intégrale de r i(t)² entre les deux dates.",
    ],
  },
  {
    id: "evaluation-piecewise-current-voltage",
    title: "Résoudre la situation d’évaluation par morceaux",
    summary: "Exploiter un courant constant puis affine pour déterminer flux, f.é.m. et tension d’une bobine réelle sur quatre intervalles.",
    pages: "5-6",
    section: "Situation d’évaluation - bobine L=5 mH et r=2 Ω",
    durationMinutes: 25,
    xp: 90,
    kind: "challenge",
    body: String.raw`## Données de la situation

La bobine possède :

$$L=5\ \text{mH}=5\times10^{-3}\ \text{H}
\qquad\text{et}\qquad
r=2\ \Omega$$

Le graphe doit être lu avec une abscisse en $10^{-2}\ \text{s}$ : les dates $1$, $2$, $3$ et $4$ représentent donc $0{,}01$, $0{,}02$, $0{,}03$ et $0{,}04\ \text{s}$.

Le courant suit quatre phases :

| Intervalle | Évolution de $i$ |
|---|---|
| $[0;0{,}01]$ s | $i=+0{,}2$ A constant |
| $[0{,}01;0{,}02]$ s | $+0{,}2$ A vers $-0{,}2$ A |
| $[0{,}02;0{,}03]$ s | $i=-0{,}2$ A constant |
| $[0{,}03;0{,}04]$ s | $-0{,}2$ A vers $+0{,}2$ A |

## 1. Flux propre

$$\Phi_p=Li$$

Pour $i=+0{,}2\ \text{A}$ :

$$\Phi_p=5\times10^{-3}\times0{,}2=+1{,}0\times10^{-3}\ \text{Wb}$$

Pour $i=-0{,}2\ \text{A}$, le flux vaut $-1{,}0\times10^{-3}\ \text{Wb}$.

Le flux ne varie que sur les deux rampes. Ses variations sont :

$$\Delta\Phi_{1\to2}=-2{,}0\times10^{-3}\ \text{Wb}$$

$$\Delta\Phi_{3\to4}=+2{,}0\times10^{-3}\ \text{Wb}$$

## 2. Pentes et f.é.m.

Sur la première rampe :

$$\frac{\Delta i}{\Delta t}=\frac{-0{,}2-0{,}2}{0{,}01}=-40\ \text{A}\,\text{s}^{-1}$$

$$e=-L\frac{\mathrm di}{\mathrm dt}=+0{,}20\ \text{V}$$

Sur la seconde rampe, la pente vaut $+40\ \text{A}\,\text{s}^{-1}$ et :

$$e=-0{,}20\ \text{V}$$

Sur les deux plateaux, $e=0$.

## 3. Tension aux bornes

La relation est :

$$u_{AB}=ri+L\frac{\mathrm di}{\mathrm dt}$$

En notant $t$ en secondes :

$$u_{AB}(t)=
\begin{cases}
+0{,}40 & 0\le t<0{,}01\\
1{,}00-80t & 0{,}01<t<0{,}02\\
-0{,}40 & 0{,}02<t<0{,}03\\
-2{,}60+80t & 0{,}03<t<0{,}04
\end{cases}$$

Les sauts de tension aux changements de pente sont normaux dans le modèle idéal : $i$ reste continu, mais $\mathrm di/\mathrm dt$ change brutalement.

## Démarche de représentation

1. trace les deux plateaux $+0{,}40$ V et $-0{,}40$ V ;
2. trace la droite décroissante de $+0{,}20$ V à $-0{,}60$ V sur la première rampe ;
3. trace la droite croissante de $-0{,}20$ V à $+0{,}60$ V sur la seconde rampe ;
4. marque les changements de régime par des traits verticaux pointillés.

> **Astuce mémoire.** Sur une rampe, $ri$ varie avec la hauteur du courant tandis que $L i'$ reste constant. La somme donne donc encore une droite, simplement décalée verticalement.

> **Vigilance.** Le signe du flux dépend du sens positif choisi ; les variations, la f.é.m. et la tension doivent toutes utiliser ce même choix.` ,
    keyPoint: "Pour la mission : Φp=Li, e=-Li′ et uAB=ri+Li′ ; les plateaux de i donnent des tensions constantes et les rampes donnent des droites décalées.",
    example: "Entre 0,01 s et 0,02 s, i=0,6-40t, donc uAB=2(0,6-40t)+0,005(-40)=1,00-80t.",
    methodSteps: [
      "Corrige l’unité de l’axe et convertis toutes les dates en secondes.",
      "Écris l’expression affine de i sur chaque rampe.",
      "Calcule Φp=Li et repère les intervalles où le flux varie.",
      "Calcule e=-Li′ puis uAB=ri+Li′ sur chaque intervalle.",
      "Trace les plateaux et les droites en respectant les sauts dus aux changements de pente.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mission graphique",
      title: "La tension uAB sur les quatre phases",
      instruction: "L’abscisse est exprimée en unités de 10⁻² s. Déplace le point pour suivre les plateaux et les rampes.",
      observation: "La tension combine une partie ohmique, liée à i, et un décalage inductif constant sur chaque rampe.",
      formula: "uAB = ri + L di/dt",
      formulaTex: "u_{AB}=ri+L\\,\\frac{\\mathrm di}{\\mathrm dt}",
      rule: { kind: "samples", points: [[0, 0.4], [0.999, 0.4], [1, 0.2], [1.999, -0.6], [2, -0.4], [2.999, -0.4], [3, -0.2], [3.999, 0.6], [4, 0.4]] },
      window: { xMin: 0, xMax: 4, yMin: -0.7, yMax: 0.7 },
      guides: [{ kind: "horizontal", value: 0, label: "u = 0" }, { kind: "vertical", value: 1, label: "10 ms" }, { kind: "vertical", value: 2, label: "20 ms" }, { kind: "vertical", value: 3, label: "30 ms" }],
      marker: { min: 0, max: 4, step: 0.1, initial: 1.5 },
    },
    questions: [
      short("Convertis L=5 mH en H.", ["0,005", "0.005", "5.10^-3", "5e-3", "0,005 H"], "5 mH=5×10⁻³ H.", "Situation d’évaluation, données", 1),
      short("Donne Φp pour i=+0,2 A.", ["0,001", "0.001", "1.10^-3", "1e-3", "+1 mWb", "1 mWb"], "Φp=Li=0,005×0,2=0,001 Wb.", "Situation d’évaluation, question 2", 2),
      choice("Le flux varie sur quels intervalles ?", ["les deux plateaux seulement", "les deux rampes seulement", "tout le temps avec la même pente", "jamais"], 1, "Φp=Li varie exactement lorsque i varie.", "Situation d’évaluation, question 3.1", 2),
      short("Donne ΔΦ sur la rampe descendante.", ["-0,002", "-0.002", "-2.10^-3", "-2e-3", "-2 mWb"], "Le flux passe de +1 mWb à -1 mWb.", "Situation d’évaluation, question 3.2", 2),
      short("Donne ΔΦ sur la rampe montante.", ["0,002", "0.002", "+0,002", "+0.002", "2.10^-3", "2e-3", "+2 mWb", "2 mWb"], "Le flux passe de -1 mWb à +1 mWb.", "Situation d’évaluation, question 3.2", 2),
      short("Calcule di/dt sur la première rampe.", ["-40", "-40 A/s"], "(-0,2-0,2)/0,01=-40 A/s.", "Situation d’évaluation, question 3.3", 2),
      short("Donne e sur la première rampe.", ["0,2", "0.2", "+0,2", "+0.2", "0,20 V", "+0,20 V"], "e=-0,005×(-40)=+0,20 V.", "Situation d’évaluation, question 3.3", 2),
      short("Donne e sur la seconde rampe.", ["-0,2", "-0.2", "-0,20 V", "-0.20 V"], "e=-0,005×40=-0,20 V.", "Situation d’évaluation, question 3.3", 2),
      short("Donne uAB sur le premier plateau.", ["0,4", "0.4", "+0,4", "+0.4", "0,40 V", "+0,40 V"], "uAB=ri=2×0,2=0,40 V.", "Situation d’évaluation, question 3.4", 2),
      short("Donne l’expression de uAB sur 0,01<t<0,02 s.", ["1-80t", "1,00-80t", "u=1-80t", "uAB=1-80t"], "i=0,6-40t et Li′=-0,2, donc uAB=1-80t.", "Situation d’évaluation, question 3.4", 3),
      short("Donne uAB sur le plateau négatif.", ["-0,4", "-0.4", "-0,40 V", "-0.40 V"], "uAB=2×(-0,2)=-0,40 V.", "Situation d’évaluation, question 3.4", 2),
      short("Donne l’expression de uAB sur 0,03<t<0,04 s.", ["-2,6+80t", "-2.6+80t", "u=-2,6+80t", "uAB=-2,6+80t"], "i=-1,4+40t et Li′=+0,2, donc uAB=-2,6+80t.", "Situation d’évaluation, question 3.4", 3),
    ],
    corrections: [
      "Page 5, figure 1 : l’axe est imprimé t(10⁻² ms), alors que la question 3.1 fixe explicitement 0≤t≤4×10⁻² s et que les calculs cohérents utilisent 10 ms par graduation. L’unité correcte est t(10⁻² s).",
    ],
  },
  {
    id: "official-auto-induction-exercises",
    title: "Traiter les exercices officiels 1 à 4",
    summary: "Mobiliser le vocabulaire, reconnaître un oscillogramme, calculer la tension d’une bobine réelle et transformer un courant polygonal en f.é.m.",
    pages: "6-8",
    section: "III. Exercices 1 à 4",
    durationMinutes: 28,
    xp: 105,
    kind: "practice",
    body: String.raw`## Exercice 1 — Remettre les idées dans l’ordre

Les deux phrases reconstituées donnent l’essentiel du chapitre :

1. une bobine placée dans un circuit s’oppose à l’établissement du courant ou à sa rupture ; ce phénomène porte le nom d’**auto-induction** ;
2. la variation de l’intensité dans un circuit comportant une bobine fait apparaître une **force électromotrice d’auto-induction**.

Le mot important est « variation » : si le courant reste constant, la f.é.m. d’auto-induction est nulle.

## Exercice 2 — Reconnaître l’oscillogramme

Pour une bobine idéale :

$$u_{AB}=L\frac{\mathrm di}{\mathrm dt}$$

La tension ne reproduit donc pas la hauteur du courant, mais sa **pente**. Un courant triangulaire donne une tension rectangulaire :

- rampe montante de $i$ : $u_{AB}>0$ ;
- rampe descendante de $i$ : $u_{AB}<0$ ;
- plateau de $i$ : $u_{AB}=0$.

La f.é.m. interne $e=-L\,\mathrm di/\mathrm dt$ possède le signe opposé à la tension récepteur $u_{AB}$.

## Exercice 3 — Bobine réelle parcourue par $i=0{,}63t$

Les données sont :

$$r=4\ \Omega,\qquad L=0{,}5\ \text{H},\qquad i(t)=0{,}63t$$

À $t=1\ \text{s}$ :

$$i(1)=0{,}63\ \text{A}
\qquad\text{et}\qquad
\frac{\mathrm di}{\mathrm dt}=0{,}63\ \text{A·s}^{-1}$$

La tension vaut :

$$u=ri+L\frac{\mathrm di}{\mathrm dt}$$

$$u(1)=4\times0{,}63+0{,}5\times0{,}63
=2{,}52+0{,}315
=\boxed{2{,}835\ \text{V}}$$

L’énergie stockée est :

$$E_m(1)=\frac12\times0{,}5\times0{,}63^2
=\boxed{9{,}9225\times10^{-2}\ \text{J}}$$

## Exercice 4 — Courant polygonal

La bobine idéale possède $L=0{,}1\ \text{H}$. Le courant, exprimé en milliampères, suit quatre rampes :

| Intervalle | Variation de $i$ | Pente | $e=-Li'$ |
|---|---:|---:|---:|
| $0$ à $3$ ms | $0$ à $12$ mA | $+4$ A·s⁻¹ | $-0{,}4$ V |
| $3$ à $5$ ms | $12$ à $0$ mA | $-6$ A·s⁻¹ | $+0{,}6$ V |
| $5$ à $8$ ms | $0$ à $12$ mA | $+4$ A·s⁻¹ | $-0{,}4$ V |
| $8$ à $10$ ms | $12$ à $0$ mA | $-6$ A·s⁻¹ | $+0{,}6$ V |

Le graphe de $e(t)$ est donc une succession de quatre plateaux. Le courant maximal vaut $12\ \text{mA}=12\times10^{-3}\ \text{A}$, d’où :

$$E_{m,\max}=\frac12\times0{,}1\times(12\times10^{-3})^2
=\boxed{7{,}2\times10^{-6}\ \text{J}}$$

soit $7{,}2\ \mu\text{J}$, et non $0{,}6\ \text{mJ}$.

> **Astuce mémoire.** Le courant dessine des rampes ; sa dérivée dessine des marches. Rampe montante $Rightarrow e<0$, rampe descendante $Rightarrow e>0$.

> **Contrôle d’unité.** Pour une pente calculée à partir de mA et ms, les facteurs $10^{-3}$ se simplifient : $12\ \text{mA}/3\ \text{ms}=4\ \text{A·s}^{-1}$.`,
    keyPoint: "Pour passer de i(t) à e(t), on calcule la pente de chaque segment puis e=-Li′ ; l’énergie maximale utilise le courant maximal converti en ampères.",
    example: "Dans l’exercice 4, la première rampe a une pente +4 A/s : e=-0,1×4=-0,4 V et Em,max=7,2 µJ.",
    methodSteps: [
      "Convertis les milliampères en ampères et les millisecondes en secondes.",
      "Découpe le graphe aux dates où la pente change.",
      "Calcule Δi/Δt avec son signe sur chaque segment.",
      "Applique e=-LΔi/Δt et représente un plateau par segment.",
      "Pour l’énergie maximale, repère |i|max puis applique Em=1/2 Li².",
    ],
    interaction: timeline([
      { label: "1. Lire i", shortLabel: "Valeurs", detail: "Relève les intensités aux extrémités de chaque segment, avec leurs unités." },
      { label: "2. Convertir", shortLabel: "Unités SI", detail: "Transforme mA en A et ms en s avant tout calcul d’énergie." },
      { label: "3. Calculer la pente", shortLabel: "Δi/Δt", detail: "Une montée donne une pente positive ; une descente, une pente négative." },
      { label: "4. Déduire e", shortLabel: "e=-Li′", detail: "Le signe moins inverse le signe de la pente du courant." },
      { label: "5. Tracer", shortLabel: "Plateaux", detail: "Chaque pente constante de i produit un plateau constant de e." },
      { label: "6. Vérifier l’énergie", shortLabel: "1/2 Li²", detail: "Utilise la plus grande valeur absolue de i, exprimée en ampères." },
    ], "Du graphe de courant à la f.é.m.", "Sélectionne chaque étape pour construire le signal sans erreur de signe ni d’unité.", "Le tableau des pentes permet de contrôler simultanément le graphe de e et l’énergie maximale."),
    questions: [
      choice("Une bobine placée dans un circuit s’oppose principalement…", ["aux variations du courant", "à tout courant permanent", "à la tension du générateur uniquement", "à sa propre résistance"], 0, "L’auto-induction concerne l’établissement et la rupture du courant.", "Exercice 1, phrase 1", 1),
      choice("La variation de l’intensité fait apparaître dans la bobine…", ["une f.é.m. d’auto-induction", "une masse magnétique", "une capacité infinie", "une tension toujours nulle"], 0, "Cette f.é.m. traduit l’opposition de la bobine à la variation.", "Exercice 1, phrase 2", 1),
      choice("Pour une bobine idéale, une rampe montante de i donne uAB…", ["positive", "négative", "nulle", "toujours sinusoïdale"], 0, "Dans la convention récepteur, uAB=L di/dt.", "Exercice 2, oscillogrammes", 2),
      choice("Lorsque i est constant, la f.é.m. d’auto-induction vaut…", ["0", "L i", "r i", "L/i"], 0, "La dérivée d’un courant constant est nulle.", "Exercice 2, oscillogrammes", 1),
      short("Exercice 3 : donne i à t=1 s.", ["0,63", "0.63", "0,63 A", "0.63 A"], "i(1)=0,63×1=0,63 A.", "Exercice 3, question 1", 1),
      short("Exercice 3 : donne di/dt.", ["0,63", "0.63", "0,63 A/s", "0.63 A/s"], "La dérivée de 0,63t est 0,63 A/s.", "Exercice 3, question 1", 1),
      short("Exercice 3 : calcule la partie résistive ri à t=1 s.", ["2,52", "2.52", "2,52 V", "2.52 V"], "ri=4×0,63=2,52 V.", "Exercice 3, question 1", 2),
      short("Exercice 3 : calcule la partie inductive L di/dt.", ["0,315", "0.315", "0,315 V", "0.315 V"], "0,5×0,63=0,315 V.", "Exercice 3, question 1", 2),
      short("Exercice 3 : donne u à t=1 s.", ["2,835", "2.835", "2,835 V", "2.835 V"], "u=2,52+0,315=2,835 V.", "Exercice 3, question 1", 2),
      short("Exercice 3 : donne l’énergie stockée à t=1 s.", ["0,099225", "0.099225", "9,9225.10^-2", "9.9225e-2", "0,099225 J"], "Em=1/2×0,5×0,63²=0,099225 J.", "Exercice 3, question 2", 2),
      short("Exercice 4 : donne e entre 0 et 3 ms.", ["-0,4", "-0.4", "-0,4 V", "-0.4 V"], "La pente vaut +4 A/s, donc e=-0,4 V.", "Exercice 4, question 2", 2),
      short("Exercice 4 : donne e entre 3 et 5 ms.", ["0,6", "0.6", "+0,6", "+0.6", "0,6 V", "+0,6 V"], "La pente vaut -6 A/s, donc e=+0,6 V.", "Exercice 4, question 2", 2),
      short("Exercice 4 : donne e entre 5 et 8 ms.", ["-0,4", "-0.4", "-0,4 V", "-0.4 V"], "La pente vaut +4 A/s, donc e=-0,4 V.", "Exercice 4, question 2", 2),
      short("Exercice 4 : donne e entre 8 et 10 ms.", ["0,6", "0.6", "+0,6", "+0.6", "0,6 V", "+0,6 V"], "La pente vaut -6 A/s, donc e=+0,6 V.", "Exercice 4, question 2", 2),
      short("Exercice 4 : convertis le courant maximal en ampères.", ["0,012", "0.012", "12.10^-3", "12e-3", "0,012 A"], "12 mA=12×10⁻³ A.", "Exercice 4, question 4", 1),
      short("Exercice 4 : donne l’énergie maximale corrigée.", ["7,2.10^-6", "7.2e-6", "0,0000072", "0.0000072", "7,2 µJ", "7.2 µJ"], "Em,max=1/2×0,1×(12×10⁻³)²=7,2×10⁻⁶ J.", "Exercice 4, question 4", 3),
    ],
    corrections: [
      "Pages 7-8, exercice 4 : le tracé imprimé porte les valeurs +6 et -4 alors que les calculs donnent +0,6 V et -0,4 V ; les virgules décimales ont disparu du graphique.",
      "Page 8, exercice 4 : le document annonce 0,6 mJ. La conversion correcte de 12 mA en ampères donne 7,2×10⁻⁶ J, soit 7,2 µJ ou 0,0072 mJ.",
    ],
  },
  {
    id: "solenoid-synthesis-spark-mission",
    title: "Réussir la mission solénoïde et étincelle de rupture",
    summary: "Déterminer champ, flux, inductance, énergie et tensions d’un solénoïde, puis expliquer et limiter la surtension à l’ouverture.",
    pages: "8-11",
    section: "Exercices 5 et 6 - Documentation : l’étincelle de rupture",
    durationMinutes: 34,
    xp: 120,
    kind: "challenge",
    body: String.raw`## Exercice 5 — Solénoïde du laboratoire

Le solénoïde possède $N=400$ spires, une longueur $\ell=41{,}2\ \text{cm}=0{,}412\ \text{m}$ et un rayon $r=2{,}5\ \text{cm}=0{,}025\ \text{m}$. Il est d’abord parcouru par $I=5\ \text{A}$.

### Champ magnétique

À l’intérieur d’un solénoïde long :

$$B=\mu_0\frac N\ell I$$

$$B=4\pi\times10^{-7}\times\frac{400}{0{,}412}\times5
\approx\boxed{6{,}10\times10^{-3}\ \text{T}}$$

Le champ est dirigé suivant l’axe du solénoïde ; son sens est donné par la règle de la main droite.

### Flux propre et inductance

L’aire d’une spire est :

$$S=\pi r^2=\pi(0{,}025)^2\approx1{,}9635\times10^{-3}\ \text{m}^2$$

Le flux propre total est :

$$\Phi_p=NBS\approx\boxed{4{,}79\times10^{-3}\ \text{Wb}}$$

Puisque $\Phi_p=LI$ :

$$L=\frac{\Phi_p}{I}\approx\boxed{9{,}58\times10^{-4}\ \text{H}}$$

soit $0{,}958\ \text{mH}$, arrondi à $1\ \text{mH}$ dans la deuxième expérience.

### Tension de la deuxième expérience

La résistance est négligeable, donc $u_{AC}=L\,\mathrm di/\mathrm dt$.

- de $0$ à $40$ ms, $i$ passe de $0$ à $2$ A : $i'=50\ \text{A·s}^{-1}$ et $u_{AC}=+0{,}050$ V ;
- de $40$ à $50$ ms, $i$ passe de $2$ A à $0$ : $i'=-200\ \text{A·s}^{-1}$ et $u_{AC}=-0{,}200$ V.

## Exercice 6 — Solénoïde de synthèse

Les données sont $R=0{,}10\ \text{m}$, $N=500$, $\ell=1\ \text{m}$ et $I=5\ \text{A}$.

$$B=\mu_0\frac N\ell I
=\pi\times10^{-3}\ \text{T}
\approx\boxed{3{,}14\ \text{mT}}$$

$$L=\mu_0\frac{N^2\pi R^2}{\ell}
\approx\boxed{9{,}87\times10^{-3}\ \text{H}}$$

Avec cette valeur non arrondie :

$$E_m=\frac12LI^2\approx\boxed{0{,}123\ \text{J}}$$

Le document arrondit ensuite $L$ à $0{,}01$ H. Cet arrondi donne $E_m=0{,}125$ J, jamais $0{,}375$ J.

## Quatre lois de courant

En utilisant $e=-L\,\mathrm di/\mathrm dt$ et $L\approx0{,}01$ H :

| Courant | Dérivée | F.é.m. correcte |
|---|---|---|
| $i_1=2$ | $0$ | $e_1=0$ |
| $i_2=5t+2$ | $5$ | $e_2=-0{,}05$ V |
| $i_3=2\sqrt2\sin(100\pi t)$ | $200\pi\sqrt2\cos(100\pi t)$ | $e_3=-2\pi\sqrt2\cos(100\pi t)$ V |
| $i_4=\sqrt3\cos(50\pi t+\varphi)$ | $-50\pi\sqrt3\sin(50\pi t+\varphi)$ | $e_4=\frac{\pi\sqrt3}{2}\sin(50\pi t+\varphi)$ V |

## Courant triangulaire de la question 3

La bobine idéale est orientée de M vers N, donc $u_{MN}=L\,\mathrm di/\mathrm dt$. Le graphe donne :

| Intervalle | Pente de $i$ | $u_{MN}$ avec $L\approx0{,}01$ H |
|---|---:|---:|
| $0$ à $20$ ms | $+5$ A·s⁻¹ | $+0{,}05$ V |
| $20$ à $30$ ms | $-20$ A·s⁻¹ | $-0{,}20$ V |
| $30$ à $50$ ms | $+5$ A·s⁻¹ | $+0{,}05$ V |

## Pourquoi une étincelle apparaît-elle à la rupture ?

À l’ouverture, le courant tente de passer rapidement de sa valeur initiale à zéro. La valeur absolue de $\mathrm di/\mathrm dt$ devient très grande, donc celle de $e=-L\,\mathrm di/\mathrm dt$ aussi. La tension peut ioniser l’air entre les contacts et créer une **étincelle de rupture**.

Pour limiter ce phénomène, on peut placer :

- une **diode de roue libre**, éventuellement associée à une résistance, en parallèle sur une bobine alimentée en continu ;
- un **condensateur** ou un réseau d’amortissement aux bornes de l’interrupteur.

Ces dispositifs offrent un chemin à l’énergie magnétique et réduisent aussi les parasites électromagnétiques.

> **Astuce mémoire.** Une coupure plus brutale signifie une pente plus grande, donc une tension plus grande. La diode ne détruit pas instantanément l’énergie : elle lui donne un chemin pour se dissiper progressivement.

> **Mission réussie si…** tu peux passer des dimensions du solénoïde à $L$, puis du graphe de $i$ au graphe de $u$ sans confondre flux d’une spire, flux total et unités de temps.`,
    keyPoint: "Un solénoïde vérifie L=μ₀N²S/ℓ ; toute variation rapide du courant crée une tension inductive, et la coupure brutale explique l’étincelle de rupture.",
    example: "Pour N=500, R=10 cm et ℓ=1 m, L≈9,87 mH ; une pente de +5 A/s produit uMN≈+0,05 V.",
    methodSteps: [
      "Convertis longueur et rayon en mètres puis calcule S=πR².",
      "Calcule B=μ₀NI/ℓ, le flux propre Φp=NBS puis L=Φp/I.",
      "Repère chaque segment du courant et calcule sa pente en A/s.",
      "Choisis la relation correspondant à la grandeur demandée : e=-Li′ ou uMN=+Li′.",
      "Calcule l’énergie avec Em=1/2 Li² et contrôle l’ordre de grandeur.",
      "Relie la surtension de rupture à la grande valeur de |di/dt| et propose un dispositif de protection.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mission graphique",
      title: "Tension uMN du courant triangulaire",
      instruction: "Déplace le point entre 0 et 50 ms pour suivre les trois plateaux de tension corrigés.",
      observation: "La montée lente donne +0,05 V, la descente cinq fois plus rapide donne -0,20 V, puis la dernière montée redonne +0,05 V.",
      formula: "uMN = L di/dt",
      formulaTex: "u_{MN}=L\\,\\frac{\\mathrm di}{\\mathrm dt}",
      rule: { kind: "samples", points: [[0, 0.05], [19.999, 0.05], [20, -0.2], [29.999, -0.2], [30, 0.05], [50, 0.05]] },
      window: { xMin: 0, xMax: 50, yMin: -0.24, yMax: 0.09 },
      guides: [{ kind: "horizontal", value: 0, label: "u = 0" }, { kind: "vertical", value: 20, label: "20 ms" }, { kind: "vertical", value: 30, label: "30 ms" }],
      marker: { min: 0, max: 50, step: 1, initial: 10 },
    },
    questions: [
      choice("Exercice 5 : le champ intérieur est dirigé…", ["suivant l’axe du solénoïde", "toujours verticalement", "suivant le rayon d’une spire", "au hasard"], 0, "Le champ d’un solénoïde long est axial.", "Exercice 5, question 1.1", 1),
      choice("Exercice 5 : l’expression du champ vaut…", ["μ₀NI/ℓ", "μ₀ℓ/(NI)", "NBS", "LI²/2"], 0, "B=μ₀nI avec n=N/ℓ.", "Exercice 5, question 1.2", 2),
      short("Exercice 5 : donne B à 0,01 mT près.", ["6,10", "6.10", "6,1 mT", "6.1 mT", "6,10 mT"], "B≈6,10×10⁻³ T=6,10 mT.", "Exercice 5, question 1.3", 2),
      short("Exercice 5 : donne l’aire d’une spire en m².", ["0,0019635", "0.0019635", "1,9635.10^-3", "1.9635e-3"], "S=π(0,025)²≈1,9635×10⁻³ m².", "Exercice 5, question 1.4", 2),
      short("Exercice 5 : donne le flux propre total.", ["0,00479", "0.00479", "4,79.10^-3", "4.79e-3", "4,79 mWb"], "Φp=NBS≈4,79×10⁻³ Wb.", "Exercice 5, question 1.4", 3),
      short("Exercice 5 : donne l’inductance à 0,001 mH près.", ["0,958", "0.958", "0,958 mH", "0.958 mH", "9,58.10^-4 H", "9.58e-4 H"], "L=Φp/I≈9,58×10⁻⁴ H=0,958 mH.", "Exercice 5, question 1.5", 3),
      short("Exercice 5 : donne uAC de 0 à 40 ms avec L=1 mH.", ["0,05", "0.05", "+0,05", "+0.05", "50 mV", "+50 mV"], "uAC=0,001×50=+0,050 V.", "Exercice 5, question 2.2", 2),
      short("Exercice 5 : donne uAC de 40 à 50 ms.", ["-0,2", "-0.2", "-0,20 V", "-200 mV"], "uAC=0,001×(-200)=-0,200 V.", "Exercice 5, question 2.2", 2),
      choice("Le graphe uAC de l’exercice 5 comporte…", ["un plateau +50 mV puis un plateau -200 mV", "une seule droite à 0 V", "une sinusoïde", "deux plateaux +200 mV"], 0, "La pente du courant est constante sur chacun des deux intervalles.", "Exercice 5, question 2.3", 2),
      short("Exercice 6 : donne B à 0,01 mT près.", ["3,14", "3.14", "3,14 mT", "3.14 mT", "π mT"], "B=4π×10⁻⁷×500×5≈3,14 mT.", "Exercice 6, question 1.a", 2),
      short("Exercice 6 : donne l’inductance non arrondie en mH.", ["9,87", "9.87", "9,87 mH", "9.87 mH", "0,00987 H"], "L≈9,87×10⁻³ H.", "Exercice 6, question 1.b", 3),
      short("Exercice 6 : donne l’énergie avec L non arrondie, au millième de joule.", ["0,123", "0.123", "0,123 J", "0.123 J", "123 mJ"], "Em≈1/2×0,00987×25≈0,123 J.", "Exercice 6, question 1.c", 3),
      short("Pour i₁=2 A, donne e₁.", ["0", "0 V"], "Le courant est constant, donc di₁/dt=0.", "Exercice 6, question 2", 1),
      short("Avec L≈0,01 H et i₂=5t+2, donne e₂.", ["-0,05", "-0.05", "-0,05 V", "-0.05 V"], "e₂=-0,01×5=-0,05 V.", "Exercice 6, question 2", 2),
      choice("Avec L≈0,01 H et i₃=2√2 sin(100πt), e₃ vaut…", ["-2π√2 cos(100πt)", "+2π√2 cos(100πt)", "-2√2 sin(100πt)", "0"], 0, "La dérivée vaut 200π√2 cos(100πt), puis on multiplie par -0,01.", "Exercice 6, question 2", 3),
      choice("Avec L≈0,01 H et i₄=√3 cos(50πt+φ), e₄ vaut…", ["(π√3/2) sin(50πt+φ)", "-(π√3/2) sin(50πt+φ)", "√3 cos(50πt+φ)", "0"], 0, "La dérivée du cosinus apporte un signe moins, annulé par celui de e=-Li′.", "Exercice 6, question 2", 3),
      choice("Pour le courant triangulaire de l’exercice 6, les trois valeurs de uMN sont…", ["+0,05 V ; -0,20 V ; +0,05 V", "+0,15 V ; -0,06 V ; +0,15 V", "-0,05 V ; +0,20 V ; -0,05 V", "0 V ; 0 V ; 0 V"], 0, "Les pentes sont respectivement +5, -20 et +5 A/s.", "Exercice 6, question 3", 3),
      choice("Pour atténuer une étincelle de rupture sur une bobine continue, on peut placer…", ["une diode de roue libre en parallèle", "un interrupteur plus éloigné sans autre composant", "une deuxième ouverture en série", "un fil coupé en parallèle"], 0, "La diode offre un chemin au courant pendant la restitution de l’énergie magnétique.", "IV. Documentation", 2),
    ],
    corrections: [
      "Pages 8-9, exercice 5 : les résultats du flux propre et de l’inductance sont absents de la correction. Les valeurs issues des données sont Φp≈4,79×10⁻³ Wb et L≈0,958 mH.",
      "Pages 9-10, exercice 6 : la correction affiche L=0,01 H, arrondi acceptable de 9,87 mH, mais annonce ensuite 375 mJ. La valeur correcte est environ 123 mJ avec L exact, ou 125 mJ avec L=0,01 H.",
      "Page 10, exercice 6, question 2 : les f.é.m. imprimées pour i₂, i₃ et i₄ correspondent implicitement à L≈0,03 H et contredisent l’inductance calculée. Elles sont recalculées avec L≈0,01 H.",
      "Page 10, exercice 6, question 3 : les tensions +0,15 V, -0,06 V et +0,15 V ne correspondent ni aux pentes du graphe ni à L≈0,01 H. Les plateaux corrects sont +0,05 V, -0,20 V et +0,05 V.",
    ],
  },
];

const levelOrder = [
  "auto-induction-evidence-transients",
  "self-flux-solenoid-inductance",
  "self-induced-emf-current-slopes",
  "coil-terminal-voltage",
  "magnetic-energy-power",
  "evaluation-piecewise-current-voltage",
  "official-auto-induction-exercises",
  "solenoid-synthesis-spark-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau d’auto-induction introuvable : " + id);
  return officialLevel(index, level);
});

export const autoInductionPath: LearningPath = {
  id: "terminale-cd-auto-induction",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminales C et D • Côte d’Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 10,
  title: "Auto-induction",
  description: "Comprendre comment une bobine s’oppose aux variations de son propre courant, calculer flux propre, inductance, f.é.m., tension et énergie, puis maîtriser les transitoires et l’étincelle de rupture.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître expérimentalement l’auto-induction et distinguer les régimes transitoire et permanent.",
    "Calculer le flux propre et l’inductance d’un solénoïde.",
    "Passer d’un graphe de courant à la f.é.m. d’auto-induction puis à la tension aux bornes.",
    "Établir le bilan de puissance et calculer l’énergie magnétique emmagasinée.",
    "Résoudre une évolution par morceaux sans erreur de signe ni d’unité.",
    "Expliquer l’étincelle de rupture et proposer un dispositif de protection.",
  ],
  modules: [{
    id: "auto-induction-mastery",
    title: "Maîtriser l’auto-induction",
    description: "De la mise en évidence expérimentale aux exercices de synthèse, une progression complète fondée sur les 11 pages du document officiel.",
    lessons: builtLevels,
  }],
};

export const autoInductionPaths: LearningPath[] = [autoInductionPath];
