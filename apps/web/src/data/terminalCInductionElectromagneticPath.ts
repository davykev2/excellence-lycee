import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 09 de Physique - Terminale C.
const sourceDocument = "TleD_PHY_L9_Induction électromagnétique.pdf";

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
      eyebrow: "Niveau " + (index + 1) + " • Cours officiel",
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: {
      eyebrow: "Méthode",
      title: "Réussir : " + seed.title.toLocaleLowerCase("fr"),
      introduction: "Applique cette démarche au cours et aux exercices du document officiel.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : choisis d'abord un sens positif et le vecteur-surface, écris le flux avec son signe, puis applique Faraday. Le signe de la f.é.m. devient alors une conséquence, pas une devinette.",
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
    id: "magnetic-flux-orientation",
    title: "Orienter une surface et calculer le flux magnétique",
    summary: "Construire le vecteur-surface d'un circuit, comprendre le caractère algébrique du flux et exploiter la relation Φ = NBS cos θ.",
    pages: "1-2",
    section: "II.1 Notion de flux magnétique - vecteur-surface, flux et règle du flux maximal",
    durationMinutes: 17,
    xp: 45,
    body: String.raw`## Le vecteur-surface donne un sens au circuit

Un circuit fermé plan limite une surface d'aire $S$. On lui associe un **vecteur-surface** $\vec S$ :

- sa direction est normale au plan du circuit ;
- sa norme vaut l'aire $S$ en $\text{m}^2$ ;
- son sens est lié au sens positif choisi sur le contour.

La règle de l'observateur d'Ampère permet de relier les deux orientations : lorsque les doigts de la main droite s'enroulent dans le sens positif du circuit, le pouce indique le sens de $\vec S$.

Si le circuit est déjà parcouru par un courant, le sens positif est naturellement celui du courant conventionnel. Sans courant imposé, on choisit une orientation arbitraire, mais on la conserve pendant tout le calcul.

## Un flux algébrique

Dans un champ magnétique uniforme $\vec B$, le flux à travers une spire vaut :

$$\Phi=\vec B\cdot\vec S=BS\cos\theta$$

où $\theta$ est l'angle entre $\vec B$ et $\vec S$. Pour une bobine de $N$ spires identiques :

$$\boxed{\Phi=NBS\cos\theta}$$

Le flux est une grandeur **algébrique** :

| Orientation | Angle | Flux |
|---|---:|---:|
| $\vec B$ et $\vec S$ de même sens | $0^\circ$ | $+NBS$ |
| $\vec B\perp\vec S$ | $90^\circ$ | $0$ |
| $\vec B$ et $\vec S$ de sens opposés | $180^\circ$ | $-NBS$ |

Son unité est le **weber**, symbole $\text{Wb}$. Un fluxmètre mesure cette grandeur.

## Règle du flux maximal

Un circuit fermé parcouru par un courant continu et libre de s'orienter dans un champ uniforme atteint un équilibre stable lorsque son flux est maximal :

$$\Phi_{\max}=NBS$$

Dans cette position, $\vec S$ et $\vec B$ ont même direction et même sens.

## Application officielle

La bobine possède $N=50$ spires, $r=2{,}5\ \text{cm}=2{,}5\times10^{-2}\ \text{m}$ et $B=0{,}02\ \text{T}$. Son aire vaut :

$$S=\pi r^2=\pi(2{,}5\times10^{-2})^2$$

Pour l'orientation de la première figure, l'angle entre $\vec B$ et $\vec S$ est $30^\circ$, donc :

$$\Phi=NB\pi r^2\cos30^\circ
=NB\pi r^2\sin60^\circ
\approx+1{,}70\times10^{-3}\ \text{Wb}$$

Inverser seulement $\vec S$ conserve la valeur absolue mais change le signe :

$$\Phi\approx-1{,}70\times10^{-3}\ \text{Wb}$$

> **Astuce mémoire.** Le flux compte les lignes de champ qui traversent la surface **avec un signe**. Plus $\vec B$ pointe dans le sens de $\vec S$, plus le flux est positif.

> **Erreur fréquente.** L'angle de la formule est celui entre $\vec B$ et la **normale** $\vec S$, pas nécessairement l'angle dessiné entre le champ et le plan de la bobine.`,
    keyPoint: "Pour N spires, Φ = NBS cos θ avec θ = angle(B⃗,S⃗) ; Φ est maximal pour θ = 0°, nul pour 90° et négatif au-delà de 90°.",
    example: "N = 50, B = 0,02 T, r = 2,5 cm et θ = 30° donnent Φ ≈ 1,70×10⁻³ Wb ; inverser S⃗ donne -1,70×10⁻³ Wb.",
    methodSteps: [
      "Choisis le sens positif du contour et déduis le sens de S⃗.",
      "Convertis l'aire en m² ; pour un disque, calcule S = πr².",
      "Identifie l'angle entre B⃗ et S⃗.",
      "Calcule Φ = NBS cos θ en conservant le signe du cosinus.",
      "Contrôle que |Φ| ne dépasse jamais NBS.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe interactive",
      title: "Le flux change avec l'orientation",
      instruction: "Déplace le point entre 0° et 180° pour observer le flux réduit Φ/(NBS).",
      observation: "Le flux passe de +NBS à -NBS, s'annule à 90° et change de signe lorsque le vecteur-surface se retourne par rapport au champ.",
      formula: "Φ/(NBS) = cos θ",
      formulaTex: "\\Phi/(NBS)=\\cos\\theta",
      rule: {
        kind: "samples",
        points: [[0, 1], [15, 0.966], [30, 0.866], [45, 0.707], [60, 0.5], [75, 0.259], [90, 0], [105, -0.259], [120, -0.5], [135, -0.707], [150, -0.866], [165, -0.966], [180, -1]],
      },
      window: { xMin: 0, xMax: 180, yMin: -1.1, yMax: 1.1 },
      guides: [{ kind: "horizontal", value: 0, label: "Φ = 0" }],
      marker: { min: 0, max: 180, step: 15, initial: 30 },
    },
    questions: [
      choice("Le vecteur-surface S⃗ est dirigé…", ["dans le plan du circuit", "normalement au plan du circuit", "toujours comme le poids", "sans direction précise"], 1, "Le vecteur-surface est normal au plan et sa norme vaut l'aire.", "II.1.1 Vecteur-surface", 1),
      choice("Pour N spires, quelle relation définit le flux ?", ["Φ = NB/S", "Φ = NBS sin θ", "Φ = NBS cos θ", "Φ = N+B+S"], 2, "Le flux est le produit scalaire de B⃗ par N S⃗.", "II.1.2 Flux magnétique", 2),
      choice("L'unité légale du flux magnétique est…", ["le tesla", "le weber", "l'ampère", "le newton"], 1, "Le flux s'exprime en webers, symbole Wb.", "II.1.2 Remarques", 1),
      choice("Quand B⃗ et S⃗ sont perpendiculaires, le flux vaut…", ["NBS", "-NBS", "0", "NB/S"], 2, "cos 90° = 0.", "II.1.2 Flux magnétique", 1),
      choice("Inverser seulement S⃗ transforme le flux Φ en…", ["Φ²", "-Φ", "2Φ", "0 dans tous les cas"], 1, "L'angle devient 180°-θ et le produit scalaire change de signe.", "Activité d'application, page 2", 2),
      short("Convertis r = 2,5 cm en mètres.", ["0,025", "0.025", "2,5.10^-2", "2.5e-2", "0,025 m", "0.025 m"], "2,5 cm = 2,5×10⁻² m = 0,025 m.", "Activité d'application, page 2", 1),
      short("Donne la valeur absolue du flux de l'activité en Wb.", ["1,7.10^-3", "1.7e-3", "0,0017", "0.0017", "1,70×10^-3 Wb", "0,0017 Wb"], "|Φ| = 50×0,02×π×0,025²×sin 60° ≈ 1,70×10⁻³ Wb.", "Activité d'application, page 2", 3),
      choice("À l'équilibre correspondant au flux maximal, S⃗ est…", ["opposé à B⃗", "parallèle et de même sens que B⃗", "perpendiculaire à B⃗", "toujours horizontal"], 1, "Le maximum positif NBS est atteint pour θ = 0°.", "II.1.3 Règle du flux maximal", 2),
    ],
    corrections: [
      "Page 2, premier cas : la ligne finale note ΔΦ = 1,7×10⁻³ Wb alors que le calcul porte sur le flux Φ d'une orientation donnée, pas sur une variation de flux. Le parcours rétablit Φ.",
    ],
  },
  {
    id: "induction-flux-variation-experiments",
    title: "Reconnaître une induction électromagnétique",
    summary: "Relier les expériences du document à une même cause : la variation du flux magnétique à travers un circuit.",
    pages: "2-3",
    section: "II.2 Mise en évidence de l'induction électromagnétique",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Une bobine sans générateur peut produire un courant

On relie une bobine à un galvanomètre sans ajouter de générateur. Lorsque l'on approche ou éloigne un aimant, l'aiguille dévie : un **courant induit** apparaît.

- l'aimant ou la bobine qui crée le champ variable est l'**inducteur** ;
- la bobine dans laquelle apparaît la tension est l'**induit** ;
- le phénomène est l'**induction électromagnétique**.

Le courant augmente lorsque le mouvement relatif est plus rapide, change de sens lorsque le mouvement ou le pôle présenté est inversé, puis s'annule lorsque le mouvement cesse.

## Cinq expériences, une seule explication

Le flux $\Phi=NBS\cos\theta$ peut varier de plusieurs façons.

### 1. Mouvement relatif aimant-bobine

Approcher ou éloigner l'aimant modifie le champ $B$ reçu par la bobine. Le galvanomètre ne réagit que pendant le déplacement.

### 2. Rotation de la bobine

La rotation modifie l'angle $\theta$ entre $\vec B$ et $\vec S$. Même si $B$ et $S$ restent constants, $\cos\theta$ change.

### 3. Variation de la surface

Une tige mobile sur des rails augmente ou réduit la surface $S$ du circuit située dans le champ.

### 4. Déplacement d'une bobine inductrice

Une bobine parcourue par un courant crée son propre champ. La rapprocher d'une bobine fixe augmente le flux reçu ; l'éloigner le diminue.

### 5. Ouverture ou fermeture du circuit inducteur

Fermer le circuit fait croître le courant inducteur et donc le champ. L'ouvrir provoque sa décroissance. Même sans mouvement mécanique, la variation de $B$ suffit.

## Conclusion expérimentale

$$\boxed{\text{variation de flux}\Longrightarrow\text{f.é.m. induite}}$$

Si le circuit induit est fermé, cette f.é.m. produit un courant. S'il est ouvert, aucun courant permanent ne circule, mais une tension induite peut toujours être mesurée à ses bornes.

Le courant induit ne dure que pendant la variation de flux. Le simple fait qu'un champ existe ne suffit pas : il faut que le flux change au cours du temps.

## Ce que montre l'oscilloscope

Un aller-retour de l'aimant devant la bobine donne deux alternances opposées. Une alternance correspond à l'approche, l'autre à l'éloignement. Plus le mouvement est rapide, plus l'impulsion observée est importante et brève.

> **Astuce mémoire.** Ne demande pas seulement « y a-t-il un champ ? », demande « le flux vu par le circuit est-il en train de changer ? ».

> **À ne pas confondre.** Un circuit ouvert peut être le siège d'une f.é.m. induite, mais il ne laisse pas circuler de courant induit.`,
    keyPoint: "Toute variation de Φ = NBS cos θ crée une f.é.m. induite ; un courant n'apparaît que si le circuit induit est fermé.",
    example: "Une bobine immobile dans un champ constant ne réagit pas. La faire tourner modifie θ, donc Φ, et crée une tension induite.",
    methodSteps: [
      "Identifie l'inducteur et le circuit induit.",
      "Écris mentalement Φ = NBS cos θ.",
      "Repère quelle grandeur varie : B, S ou θ.",
      "Vérifie si le circuit induit est fermé pour conclure sur le courant.",
      "Relie la rapidité de la variation à l'amplitude de la tension observée.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte des expériences",
      title: "Quatre moyens de faire varier le flux",
      instruction: "Sélectionne une branche pour identifier la grandeur qui change dans Φ = NBS cos θ.",
      observation: "Des montages très différents produisent la même conséquence dès que le flux varie.",
      rootLabel: "Variation de Φ",
      rootDetail: "Le flux peut changer parce que le champ, la surface ou l'orientation évolue au cours du temps.",
      nodes: [
        { id: "field", label: "Déplacer l'aimant", role: "B varie", detail: "Approcher ou éloigner l'aimant modifie le champ reçu par la bobine." },
        { id: "angle", label: "Faire tourner la bobine", role: "θ varie", detail: "La normale à la surface tourne par rapport au champ." },
        { id: "surface", label: "Déplacer une tige", role: "S varie", detail: "La portion de surface comprise dans le circuit augmente ou diminue." },
        { id: "current", label: "Ouvrir ou fermer l'inducteur", role: "B varie sans mouvement", detail: "Le courant de la bobine inductrice change, donc son champ et le flux reçu changent." },
      ],
    },
    questions: [
      choice("La source du champ magnétique dans une expérience d'induction se nomme…", ["l'induit", "l'inducteur", "l'inductance", "le fluxmètre"], 1, "L'inducteur produit le champ à l'origine du phénomène.", "II.2.1.1 Définitions", 1),
      choice("Le circuit où apparaît la tension induite est…", ["l'induit", "le rotor", "le générateur continu", "le fluxmètre"], 0, "Le circuit récepteur de la variation de flux est l'induit.", "II.2.1.1 Définitions", 1),
      choice("Pourquoi le courant s'annule-t-il lorsque l'aimant s'arrête ?", ["Le champ disparaît toujours", "La bobine devient isolante", "Le flux ne varie plus", "Le nombre de spires devient nul"], 2, "À position fixe, le flux est constant et la f.é.m. induite s'annule.", "II.2.1.1 Remarques", 2),
      choice("Faire tourner la bobine fait principalement varier…", ["N", "θ", "la charge de l'électron", "la résistance de l'air"], 1, "L'angle entre B⃗ et S⃗ change.", "II.2.1.2 Rotation", 1),
      choice("La tige mobile sur les rails fait varier…", ["l'aire S du circuit", "le nombre de pôles terrestres", "la masse de l'aimant", "l'unité du flux"], 0, "Le déplacement modifie la surface comprise dans la boucle.", "II.2.1.3 Surface", 1),
      choice("À la fermeture du circuit inducteur, le courant induit apparaît parce que…", ["le flux reçu croît", "la surface disparaît", "le champ reste strictement nul", "le circuit induit fond"], 0, "Le courant inducteur croît, donc son champ et le flux reçu par l'induit croissent.", "II.2.1.5 Fermeture", 2),
      choice("Circuit induit ouvert et flux variable : que peut-on mesurer ?", ["Ni tension ni courant", "Un courant mais aucune tension", "Une f.é.m., sans courant de circulation", "Une masse induite"], 2, "La f.é.m. existe, mais l'ouverture empêche la circulation du courant.", "II.2 Conclusion", 2),
      choice("Un mouvement plus rapide de l'aimant produit généralement…", ["une tension induite plus grande", "une tension toujours nulle", "un flux forcément constant", "moins de variation par seconde"], 0, "La variation de flux par unité de temps augmente.", "II.2.1.1 Remarques", 2),
    ],
  },
  {
    id: "lenz-law-induced-current-direction",
    title: "Prévoir le sens du courant avec la loi de Lenz",
    summary: "Interpréter l'opposition à la cause de l'induction et déterminer le sens du champ puis du courant induit.",
    pages: "4-5",
    section: "II.3.1 Loi de Lenz et II.4.4 Sens du courant induit",
    durationMinutes: 19,
    xp: 65,
    body: String.raw`## La loi de Lenz ne dit pas « toujours le champ opposé »

La loi de Lenz s'énonce :

> Le courant induit a un sens tel que, par ses effets, il s'oppose à la **cause qui lui donne naissance**.

La cause n'est pas le champ magnétique lui-même, mais sa **variation de flux**. Le champ créé par le courant induit cherche donc à limiter cette variation.

- si le flux extérieur **augmente**, le champ induit tend à s'y opposer ;
- si le flux extérieur **diminue**, le champ induit tend à le maintenir.

Cette distinction évite l'erreur classique « le champ induit est toujours opposé au champ inducteur ».

## Aimant et spire : raisonner par faces

Considérons le pôle Nord d'un aimant face à une spire.

### Le pôle Nord approche

Le flux créé par l'aimant augmente. La spire crée alors un champ qui repousse l'approche : sa face tournée vers l'aimant devient un **pôle Nord**.

### Le pôle Nord s'éloigne

Le flux diminue. La spire cherche à conserver ce flux et attire l'aimant : sa face tournée vers l'aimant devient un **pôle Sud**.

Une fois le champ induit trouvé, on utilise la règle de l'observateur d'Ampère :

- courant vu dans le sens antihoraire $\Longrightarrow$ face Nord ;
- courant vu dans le sens horaire $\Longrightarrow$ face Sud.

## Une méthode qui fonctionne dans tous les montages

1. Choisir le sens de $\vec S$ et le sens positif du circuit.
2. Déterminer le signe du flux extérieur.
3. Dire si ce flux augmente ou diminue.
4. Construire le champ induit qui s'oppose à cette variation.
5. En déduire le sens du courant induit.

## Vérification énergétique

La loi de Lenz garantit la conservation de l'énergie. Si le courant induit aidait spontanément la variation qui le crée, l'aimant serait accéléré sans apport d'énergie. En réalité, il faut fournir un travail mécanique pour approcher l'aimant : l'effet induit résiste au mouvement.

## Deux leviers pour faire varier le champ en un point

L'activité officielle rappelle que l'on peut :

- déplacer un aimant ou une bobine parcourue par un courant ;
- faire varier l'intensité du courant dans un conducteur ou une bobine proche.

> **Astuce mémoire.** **Lenz lutte contre le changement.** Si le flux monte, l'induit le freine ; s'il baisse, l'induit tente de le soutenir.

> **Contrôle rapide.** Lorsque l'aimant approche, la force magnétique induite doit s'opposer à l'approche ; lorsqu'il s'éloigne, elle doit s'opposer à l'éloignement.`,
    keyPoint: "La loi de Lenz s'oppose à la variation du flux : hausse de Φ → champ induit opposé ; baisse de Φ → champ induit qui tend à maintenir le flux.",
    example: "Un pôle Nord approche d'une spire : la face proche de la spire devient Nord afin de repousser l'aimant et de s'opposer à l'augmentation du flux.",
    methodSteps: [
      "Choisis un vecteur-surface et le sens positif associé.",
      "Détermine le sens du champ inducteur à travers la spire.",
      "Décide si le flux inducteur augmente ou diminue.",
      "Oriente le champ induit pour qu'il s'oppose à cette variation.",
      "Utilise la règle d'Ampère pour retrouver le sens du courant induit.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Un pôle Nord approche de la spire",
      instruction: "Sélectionne les repères dans l'ordre pour reconstruire le raisonnement de Lenz.",
      observation: "Le flux inducteur vers la gauche augmente ; la spire crée un champ vers la droite et présente une face Nord à l'aimant.",
      caption: "Schéma original redessiné d'après les expériences aimant-spire des pages 4 et 5.",
      viewBox: "0 0 430 250",
      shapes: [
        { shape: "path", d: "M145 55 C110 55 110 195 145 195 C180 195 180 55 145 55", tone: "outline" },
        { shape: "path", d: "M145 75 C125 75 125 175 145 175 C165 175 165 75 145 75", tone: "muted" },
        { shape: "path", d: "M126 91 L116 105 L132 106 Z", tone: "accent" },
        { shape: "path", d: "M164 160 L174 146 L158 145 Z", tone: "accent" },
        { shape: "text", x: 145, y: 218, content: "spire", anchor: "middle" },
        { shape: "path", d: "M285 91 L385 91 L385 159 L285 159 Z", tone: "soft" },
        { shape: "line", x1: 335, y1: 91, x2: 335, y2: 159, tone: "outline" },
        { shape: "text", x: 310, y: 131, content: "N", anchor: "middle" },
        { shape: "text", x: 360, y: 131, content: "S", anchor: "middle" },
        { shape: "line", x1: 276, y1: 125, x2: 220, y2: 125, tone: "accent" },
        { shape: "path", d: "M220 125 L238 116 L238 134 Z", tone: "accent" },
        { shape: "text", x: 250, y: 108, content: "approche", anchor: "middle" },
        { shape: "line", x1: 274, y1: 72, x2: 182, y2: 72, tone: "accent" },
        { shape: "path", d: "M182 72 L200 63 L200 81 Z", tone: "accent" },
        { shape: "text", x: 228, y: 56, content: "B inducteur", anchor: "middle" },
        { shape: "line", x1: 178, y1: 182, x2: 267, y2: 182, tone: "accent" },
        { shape: "path", d: "M267 182 L249 173 L249 191 Z", tone: "accent" },
        { shape: "text", x: 224, y: 207, content: "B induit", anchor: "middle" },
        { shape: "text", x: 188, y: 132, content: "N", anchor: "middle" },
      ],
      hotspots: [
        { id: "motion", number: 1, label: "Approche", detail: "Le pôle Nord se rapproche : le champ reçu par la spire devient plus intense.", x: 250, y: 125 },
        { id: "external-field", number: 2, label: "Flux croissant", detail: "Le champ inducteur traverse ici la spire vers la gauche ; son flux augmente.", x: 228, y: 72 },
        { id: "induced-field", number: 3, label: "Opposition", detail: "La spire crée un champ vers la droite pour s'opposer à l'augmentation.", x: 224, y: 182 },
        { id: "north-face", number: 4, label: "Face Nord", detail: "La face proche de l'aimant devient Nord : la répulsion s'oppose mécaniquement à l'approche.", x: 188, y: 132 },
      ],
    },
    questions: [
      choice("La loi de Lenz affirme que l'effet induit s'oppose…", ["au champ inducteur dans tous les cas", "à la cause qui lui donne naissance", "à toute tension électrique", "au nombre de spires"], 1, "L'opposition porte sur la variation de flux, pas systématiquement sur le champ lui-même.", "II.3.1 Loi de Lenz", 2),
      choice("Un flux extérieur positif augmente. Le champ induit tend à créer un flux…", ["positif plus grand", "nul sans condition", "négatif", "sans orientation"], 2, "Le flux induit s'oppose à l'augmentation du flux positif.", "II.3.1 Interprétation", 2),
      choice("Un flux extérieur positif diminue. Le champ induit tend à créer un flux…", ["positif", "négatif", "toujours nul", "alternatif sans cause"], 0, "Il tente de maintenir le flux qui diminue.", "II.3.1 Interprétation", 2),
      choice("Un pôle Nord approche d'une spire. La face proche devient…", ["Sud pour attirer", "Nord pour repousser", "neutre", "Est"], 1, "La répulsion s'oppose à l'approche.", "II.3.1 Application aimant-spire", 2),
      choice("Le même pôle Nord s'éloigne. La face proche devient…", ["Nord", "Sud", "sans pôle", "toujours Nord et Sud à la fois"], 1, "L'attraction s'oppose à l'éloignement et tend à maintenir le flux.", "II.4.4.1 Loi de Lenz", 2),
      choice("Vue de face, une spire parcourue dans le sens antihoraire présente une face…", ["Sud", "Nord", "sans champ", "positive électriquement"], 1, "La règle d'Ampère donne un champ sortant de la face, donc une face Nord.", "Règle de l'observateur d'Ampère", 1),
      choice("Quelle action peut faire varier le champ sans déplacement mécanique ?", ["Faire varier le courant de la bobine inductrice", "Augmenter uniquement la résistance de l'air", "Immobiliser toutes les sources", "Garder le courant strictement constant"], 0, "Le champ d'une bobine dépend du courant qui la traverse.", "Activité d'application, question 1", 1),
      choice("Pourquoi faut-il fournir un effort pour approcher rapidement l'aimant ?", ["L'effet induit s'oppose au mouvement qui augmente le flux", "La gravité change de sens", "Le flux crée de la matière", "La spire perd toutes ses charges"], 0, "Cette opposition est la traduction énergétique de la loi de Lenz.", "Prolongement de la loi de Lenz", 2),
      choice("Dans la méthode complète, que faut-il déterminer juste avant le sens du courant ?", ["Le champ induit", "La masse de la spire", "L'unité du temps", "La couleur de l'aimant"], 0, "Le champ induit est d'abord imposé par Lenz, puis le courant est obtenu par Ampère.", "Méthode Lenz", 1),
    ],
  },
  {
    id: "faraday-emf-current-charge",
    title: "Exploiter les lois de Faraday et de Lenz",
    summary: "Calculer une f.é.m. instantanée ou moyenne, l'intensité induite, la tension aux bornes et la charge transférée.",
    pages: "4-5",
    section: "II.3.2 Loi de Faraday et II.4 Courant induit, tension et quantité d'électricité",
    durationMinutes: 22,
    xp: 75,
    body: String.raw`## La loi de Faraday mesure la rapidité de variation

Après avoir orienté le circuit, le flux $\Phi$ devient algébrique. La force électromotrice induite vaut :

$$\boxed{e(t)=-\frac{\mathrm d\Phi}{\mathrm dt}}$$

Le signe moins traduit la loi de Lenz. Il ne faut pas l'ajouter « au hasard » à la fin : il est lié au sens positif choisi pour le contour et donc au vecteur-surface.

Sur un intervalle où seules les valeurs initiale et finale sont connues, on utilise la f.é.m. moyenne :

$$\boxed{e_{\text{moy}}=-\frac{\Delta\Phi}{\Delta t}}$$

## Intensité dans un circuit fermé

L'induit possède une résistance interne $r$ et alimente une résistance extérieure $R$. La résistance totale vaut $R+r$. Avec les conventions du document :

$$i=\frac{e}{R+r}
=-\frac{1}{R+r}\frac{\mathrm d\Phi}{\mathrm dt}$$

Le signe de $i$ indique le sens réel par rapport au sens positif choisi :

- $i>0$ : le courant circule dans le sens positif ;
- $i<0$ : il circule dans le sens opposé.

## Tension aux bornes

Lorsque le circuit est fermé, la tension dépend de la résistance extérieure et de la convention de mesure. Le document obtient :

$$u=-Ri=-\frac{R}{R+r}e$$

Lorsque le circuit est ouvert, $i=0$ mais la f.é.m. subsiste. Avec la même orientation :

$$u=-e=\frac{\mathrm d\Phi}{\mathrm dt}$$

Le voltmètre peut donc détecter l'induction même sans courant de circulation.

## Quantité d'électricité transférée

Comme $i=\mathrm dq/\mathrm dt$ :

$$\mathrm dq=-\frac{1}{R+r}\,\mathrm d\Phi$$

Entre un état initial et un état final :

$$\boxed{Q=-\frac{\Phi_f-\Phi_i}{R+r}}$$

Cette relation montre que la charge algébrique transférée dépend de la variation totale de flux, et non de la durée précise du mouvement. La durée influence l'intensité instantanée, mais pas la charge totale si les deux états de flux sont les mêmes.

## Application officielle : champ décroissant

Une bobine de $N=100$ spires et de rayon $r=4\ \text{cm}$ est soumise à un champ axial qui décroît linéairement de $0{,}04$ T à $0$ en $0{,}10$ s.

$$S=\pi(0{,}04)^2,\qquad
\frac{\Delta B}{\Delta t}=\frac{0-0{,}04}{0{,}10}=-0{,}40\ \text{T·s}^{-1}$$

Comme $\Phi=NBS$ :

$$e=-NS\frac{\mathrm dB}{\mathrm dt}
=-100\pi(0{,}04)^2(-0{,}40)
\approx\boxed{0{,}20\ \text{V}}$$

Le résultat positif signifie que la f.é.m. est orientée dans le sens positif choisi.

> **Astuce mémoire.** Faraday regarde une **pente** : une grande variation en peu de temps produit une grande f.é.m.

> **Contrôle d'unité.** $\text{Wb·s}^{-1}=\text{V}$ et $\text{V}/\Omega=\text{A}$.`,
    keyPoint: "e = -dΦ/dt ; circuit fermé : i = e/(R+r) ; circuit ouvert : i = 0 mais e existe ; Q = -(Φf-Φi)/(R+r).",
    example: "100 spires de rayon 4 cm dans un champ passant de 0,04 T à 0 en 0,10 s donnent e ≈ +0,20 V.",
    methodSteps: [
      "Oriente le circuit et écris Φ avec son signe.",
      "Exprime la grandeur variable en fonction du temps.",
      "Calcule dΦ/dt ou, si nécessaire, ΔΦ/Δt.",
      "Applique e = -dΦ/dt puis lis son signe.",
      "Si le circuit est fermé, utilise i = e/(R+r) ; sinon, garde i = 0.",
      "Pour une charge totale, intègre ou utilise directement Q = -ΔΦ/(R+r).",
    ],
    interaction: timeline([
      { label: "1. Orientation", shortLabel: "Sens positif", detail: "Le sens choisi fixe S⃗, le signe du flux et le signe de la f.é.m." },
      { label: "2. Flux", shortLabel: "Φ(t)", detail: "Écris NBS cos θ en ne conservant comme fonction du temps que les grandeurs variables." },
      { label: "3. Variation", shortLabel: "dΦ/dt", detail: "Dérive exactement ou calcule la pente moyenne sur l'intervalle demandé." },
      { label: "4. Faraday", shortLabel: "e = -dΦ/dt", detail: "Le signe moins traduit Lenz dans la convention choisie." },
      { label: "5. Circuit", shortLabel: "Ouvert ou fermé", detail: "Fermé : i = e/(R+r). Ouvert : i = 0 mais la tension induite subsiste." },
      { label: "6. Contrôle", shortLabel: "Signe et unités", detail: "Vérifie le sens avec Lenz et l'unité Wb/s = V." },
    ], "Le protocole Faraday sans erreur de signe", "Avance dans l'ordre ; chaque étape dépend de l'orientation choisie à la première.", "Le signe final devient vérifiable par deux voies : le calcul de Faraday et le raisonnement qualitatif de Lenz."),
    questions: [
      choice("Quelle relation exprime la loi de Faraday ?", ["e = dΦ/dt", "e = -dΦ/dt", "e = Φt", "e = R/Φ"], 1, "Le signe moins traduit la loi de Lenz.", "II.3.2 Loi de Faraday", 2),
      choice("Une variation de flux deux fois plus rapide produit, toutes choses égales…", ["une f.é.m. deux fois plus grande en valeur absolue", "la même f.é.m.", "une f.é.m. deux fois plus petite", "toujours zéro"], 0, "|e| est proportionnelle à |dΦ/dt|.", "II.3.2 Interprétation", 1),
      choice("Dans un circuit fermé de résistance totale R+r, l'intensité vaut…", ["(R+r)/e", "e(R+r)", "e/(R+r)", "R/e"], 2, "La loi d'Ohm appliquée au circuit donne i=e/(R+r).", "II.4.1 Intensité", 2),
      choice("Si le circuit induit est ouvert…", ["e = 0 et i = 0", "i = 0 mais e peut être non nulle", "i est infinie", "le flux ne peut plus varier"], 1, "L'ouverture empêche le courant, pas la création de la f.é.m.", "II.4.2 Circuit ouvert", 2),
      choice("La charge algébrique transférée entre deux états vaut…", ["Q = -(Φf-Φi)/(R+r)", "Q = (R+r)(Φf-Φi)", "Q = e/t", "Q = Φf+Φi"], 0, "On intègre i = -(1/(R+r))dΦ/dt.", "II.4.3 Quantité d'électricité", 2),
      short("Calcule la pente ΔB/Δt lorsque B passe de 0,04 T à 0 en 0,10 s.", ["-0,4", "-0.4", "-0,40", "-0.40", "-0,4 T/s", "-0.4 T/s"], "(0-0,04)/0,10 = -0,40 T·s⁻¹.", "Activité d'application, page 5", 2),
      short("Donne l'aire d'une spire de rayon 4 cm au dix-millième de m².", ["0,0050", "0.0050", "0,00503", "0.00503", "5,03.10^-3", "5.03e-3"], "S=π(0,04)²≈5,03×10⁻³ m².", "Activité d'application, page 5", 2),
      short("Calcule la f.é.m. induite de l'activité au centième de volt.", ["0,20", "0.20", "0,2", "0.2", "0,20 V", "0.2 V"], "e=-100×π×0,04²×(-0,40)≈0,201 V.", "Activité d'application, page 5", 3),
      choice("Le signe positif obtenu signifie que e est orientée…", ["dans le sens positif choisi", "dans le sens opposé sans exception", "sans lien avec l'orientation", "vers le bas géométriquement"], 0, "Le signe est algébrique et se lit par rapport à la convention choisie.", "Activité d'application, remarque", 1),
      choice("Deux mouvements relient les mêmes flux initial et final mais durent différemment. La charge totale |Q| est…", ["plus grande pour le plus rapide", "la même si R+r est identique", "toujours nulle", "proportionnelle au carré du temps"], 1, "Q dépend de ΔΦ, tandis que la durée modifie surtout l'intensité instantanée.", "II.4.3 Interprétation", 2),
    ],
  },
  {
    id: "induction-devices-applications",
    title: "Comprendre les dispositifs utilisant l'induction",
    summary: "Relier transformateur, alternateur, courants de Foucault, microphone et stockage magnétique aux lois de l'induction.",
    pages: "6-8 et 14",
    section: "II.5 Applications, II.6 Production de l'électricité et IV. Documentation",
    durationMinutes: 21,
    xp: 80,
    body: String.raw`## Le transformateur : transmettre une variation de flux

Un transformateur possède deux bobines couplées par un circuit magnétique :

- le **primaire**, alimenté en courant alternatif, joue le rôle d'inducteur ;
- le **secondaire** reçoit le flux variable et joue le rôle d'induit.

Un courant continu établi crée un flux constant : après le bref régime de mise sous tension, il n'induit plus de f.é.m. au secondaire. C'est pourquoi un transformateur fonctionne en régime alternatif et non avec un courant continu constant.

Pour un transformateur parfait :

$$\boxed{k=\frac{U_2}{U_1}=\frac{N_2}{N_1}}$$

| Valeur de $k$ | Type | Effet |
|---:|---|---|
| $k<1$ | abaisseur | $U_2<U_1$ |
| $k>1$ | élévateur | $U_2>U_1$ |
| $k=1$ | isolement | $U_2=U_1$ |

La puissance est conservée dans le modèle parfait :

$$U_1I_1=U_2I_2$$

Ainsi :

$$\frac{I_1}{I_2}=\frac{U_2}{U_1}=k
\qquad\Longrightarrow\qquad
I_2=\frac{I_1}{k}$$

Pour $U_1=220$ V, $U_2=24$ V, $N_1=1000$ et $I_1=0{,}50$ A :

$$k=\frac{24}{220}\approx0{,}109,\quad
N_2\approx109,\quad
I_2\approx4{,}58\ \text{A}$$

## L'alternateur : mouvement vers tension alternative

Un aimant tournant, ou rotor, fait varier le flux reçu par les bobines fixes du stator. Si :

$$\Phi(t)=NBS\cos(\omega t)$$

alors la loi de Faraday donne :

$$e(t)=-\frac{\mathrm d\Phi}{\mathrm dt}
=\boxed{NBS\omega\sin(\omega t)}$$

La f.é.m. est sinusoïdale, de valeur maximale :

$$E_{\max}=NBS\omega$$

L'alternateur transforme l'énergie mécanique de rotation en énergie électrique.

## Les courants de Foucault

Un conducteur massif placé dans un champ variable, ou en mouvement dans un champ, est parcouru de boucles de courant internes. Leurs effets obéissent à Lenz.

- **freinage électromagnétique** : les forces s'opposent au mouvement ;
- **four à induction** : l'effet Joule chauffe le matériau conducteur ;
- **pertes dans les transformateurs** : on feuillette le circuit magnétique pour réduire les boucles de courant indésirables.

## Le microphone électrodynamique

La membrane entraîne une bobine dans le champ d'un aimant. Le mouvement fait varier le flux et produit une tension qui reproduit le signal sonore. La chaîne énergétique est :

$$\text{onde sonore}\rightarrow\text{mouvement}\rightarrow\text{tension électrique}$$

## La lecture et l'écriture magnétiques

Une tête de lecture inductive détecte les variations du champ des domaines magnétiques qui défilent. Les technologies plus récentes GMR et TMR détectent plutôt une variation de résistance provoquée par le champ. La tête d'écriture, elle, utilise un électroaimant pour orienter les domaines.

> **Astuce mémoire.** Transformateur : **électrique vers électrique**. Alternateur : **mécanique vers électrique**. Microphone dynamique : **acoustique vers électrique**.

> **Point scientifique.** Dériver $\cos(\omega t)$ donne $-\omega\sin(\omega t)$ ; le signe moins de Faraday transforme donc le résultat en $+\omega\sin(\omega t)$.`,
    keyPoint: "Transformateur parfait : U₂/U₁ = N₂/N₁ = I₁/I₂ ; alternateur : Φ=NBS cos(ωt) et e=NBSω sin(ωt).",
    example: "220 V vers 24 V avec 1000 spires au primaire donne k≈0,109, N₂≈109 spires et, pour I₁=0,50 A, I₂≈4,58 A.",
    methodSteps: [
      "Identifie l'inducteur, l'induit et la grandeur mécanique ou électrique d'entrée.",
      "Pour un transformateur, calcule d'abord k = U₂/U₁ = N₂/N₁.",
      "Utilise la conservation de la puissance seulement si le transformateur est supposé parfait.",
      "Pour un alternateur, écris Φ(t), dérive puis applique le signe moins de Faraday.",
      "Pour une application, décris la chaîne des conversions d'énergie et l'effet utile de Lenz.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Applications",
      title: "Une loi, cinq technologies",
      instruction: "Sélectionne un dispositif pour suivre la variation de flux et la conversion réalisée.",
      observation: "Chaque application exploite une variation de flux ; ce qui change est la source de cette variation et l'effet recherché.",
      rootLabel: "Induction électromagnétique",
      rootDetail: "Une variation de flux produit une f.é.m. qui peut transmettre, produire, mesurer, freiner ou chauffer.",
      nodes: [
        { id: "transformer", label: "Transformateur", role: "Adapter une tension", detail: "Le courant alternatif du primaire crée un flux variable reçu par le secondaire." },
        { id: "alternator", label: "Alternateur", role: "Produire de l'électricité", detail: "La rotation du rotor transforme une énergie mécanique en tension alternative." },
        { id: "eddy", label: "Courants de Foucault", role: "Freiner ou chauffer", detail: "Des courants circulent dans la masse conductrice et s'opposent à la variation qui les crée." },
        { id: "microphone", label: "Microphone dynamique", role: "Convertir un son", detail: "Le mouvement de la membrane et de la bobine produit un signal électrique." },
        { id: "storage", label: "Stockage magnétique", role: "Lire et écrire", detail: "Une tête détecte ou impose l'orientation de domaines magnétiques microscopiques." },
      ],
    },
    questions: [
      choice("Pourquoi un transformateur ne fonctionne-t-il pas avec un courant continu établi ?", ["Le flux devient constant", "Le secondaire perd ses spires", "Le primaire ne crée jamais de champ", "La tension continue n'a aucune charge"], 0, "Une fois le régime établi, dΦ/dt=0 et la f.é.m. secondaire s'annule.", "II.5.1.1 Généralités", 2),
      choice("Pour un transformateur parfait, le rapport k vaut…", ["U₁/U₂=N₂/N₁", "U₂/U₁=N₂/N₁", "U₂U₁=N₂+N₁", "I₂/I₁=N₂/N₁"], 1, "Le rapport de transformation est U₂/U₁=N₂/N₁.", "II.5.1.2 Rapport de transformation", 2),
      short("Calcule k = 24/220 au millième.", ["0,109", "0.109", "0,11", "0.11"], "24/220≈0,1091.", "Activité transformateur, question 1", 2),
      short("Avec N₁ = 1000, donne N₂ arrondi à l'unité.", ["109", "109 spires"], "N₂=kN₁≈109 spires.", "Activité transformateur, question 1", 2),
      short("Pour I₁ = 0,50 A, calcule I₂ au centième.", ["4,58", "4.58", "4,58 A", "4.58 A", "4,59", "4.59"], "I₂=I₁/k≈0,50/0,1091≈4,58 A.", "Activité transformateur, question 2", 3),
      choice("Un transformateur avec N₂>N₁ est…", ["abaisseur", "élévateur", "sans flux", "un moteur thermique"], 1, "k>1 donc U₂>U₁.", "II.5.1.2 Remarques", 1),
      choice("Si Φ=NBS cos(ωt), quelle est la f.é.m. correcte ?", ["e=NBSω cos(ωt)", "e=-NBSω sin(ωt)", "e=NBSω sin(ωt)", "e=NBS/ω"], 2, "La dérivée de cos est -sin, puis le signe moins de Faraday donne +sin.", "II.6 Alternateur", 3),
      choice("Dans un frein à courants de Foucault, l'effet utile est…", ["une opposition au mouvement", "une disparition de toute énergie", "une attraction gravitationnelle", "une augmentation sans limite de la vitesse"], 0, "Les effets induits s'opposent au mouvement qui fait varier le flux.", "II.5.3 Courants de Foucault", 1),
      choice("Dans un microphone électrodynamique, la bobine transforme d'abord…", ["le mouvement de la membrane en tension", "une tension en lumière", "la chaleur en masse", "le champ terrestre en courant continu constant"], 0, "Le déplacement de la bobine dans le champ induit le signal électrique.", "II.5.4 Microphone", 1),
    ],
    corrections: [
      "Page 8, production par alternateur : à partir de Φ=NBS cos(ωt), la loi de Faraday donne e=NBSω sin(ωt). Le document imprime cos(ωt), ce qui oublie le déphasage dû à la dérivation.",
    ],
  },
  {
    id: "coupled-coils-piecewise-emf",
    title: "Lire un graphe et déterminer une f.é.m. induite",
    summary: "Passer d'un courant primaire par morceaux au champ, au flux secondaire puis au graphe de la f.é.m. induite.",
    pages: "8-10",
    section: "Situation d'évaluation - deux enroulements entrelacés",
    durationMinutes: 23,
    xp: 90,
    kind: "practice",
    body: String.raw`## Deux enroulements couplés

Le solénoïde primaire possède $N_1=200$ spires, une longueur $\ell=41{,}2$ cm et porte le courant variable $i_1(t)$. La bobine secondaire possède $N_2=100$ spires et le rayon commun vaut $r=2{,}5$ cm.

Dans le solénoïde long, le champ créé par le primaire est :

$$\boxed{B_1(t)=\mu_0\frac{N_1}{\ell}i_1(t)}$$

Le flux total à travers les $N_2$ spires du secondaire vaut :

$$\Phi_{21}(t)=N_2B_1(t)\pi r^2$$

donc :

$$\boxed{\Phi_{21}(t)=
\mu_0\frac{\pi N_1N_2r^2}{\ell}i_1(t)}$$

Posons :

$$M=\mu_0\frac{\pi N_1N_2r^2}{\ell}$$

Le coefficient $M$ s'exprime en henrys et vaut ici environ :

$$M\approx1{,}20\times10^{-4}\ \text{H}$$

La f.é.m. secondaire est alors :

$$\boxed{e_2(t)=-M\frac{\mathrm di_1}{\mathrm dt}}$$

## Lire les trois intervalles

Le graphe donne $i_1$ en milliampères et $t$ en millisecondes.

### De 0 à 2 ms

Le courant passe de $-50$ mA à $+50$ mA :

$$\frac{\Delta i_1}{\Delta t}
=\frac{0{,}050-(-0{,}050)}{0{,}002}
=50\ \text{A·s}^{-1}$$

Donc :

$$e_2=-1{,}20\times10^{-4}\times50
\approx\boxed{-6{,}0\ \text{mV}}$$

### De 2 à 3 ms

Le courant est constant :

$$\frac{\mathrm di_1}{\mathrm dt}=0
\qquad\Longrightarrow\qquad
\boxed{e_2=0}$$

### De 3 à 5 ms

Le courant passe de $+50$ mA à $-50$ mA :

$$\frac{\Delta i_1}{\Delta t}=-50\ \text{A·s}^{-1}$$

Donc :

$$\boxed{e_2=+6{,}0\ \text{mV}}$$

## La clé graphique

La f.é.m. n'est pas proportionnelle à la hauteur du graphe $i_1(t)$, mais à sa **pente opposée** :

- segment montant $\Rightarrow e_2<0$ ;
- segment horizontal $\Rightarrow e_2=0$ ;
- segment descendant $\Rightarrow e_2>0$.

Les changements de pente produisent des changements brusques de la f.é.m. dans le modèle idéal.

> **Astuce mémoire.** Faraday lit l'**inclinaison**, pas l'altitude : un courant élevé mais constant ne produit aucune f.é.m. dans la seconde bobine.

> **Unités.** Convertis ensemble mA en A et ms en s ; les deux facteurs $10^{-3}$ ne doivent pas être oubliés.`,
    keyPoint: "B₁=μ₀N₁i₁/ℓ, Φ₂₁=Mi₁ et e₂=-M di₁/dt ; ici e₂ vaut successivement -6 mV, 0 puis +6 mV.",
    example: "De 0 à 2 ms, i₁ varie de -50 à +50 mA : la pente vaut +50 A·s⁻¹ et e₂≈-6 mV.",
    methodSteps: [
      "Exprime B₁ à partir du courant primaire.",
      "Multiplie par N₂πr² pour obtenir le flux total secondaire.",
      "Regroupe les constantes dans M et vérifie son unité.",
      "Calcule la pente de i₁ sur chaque segment en A·s⁻¹.",
      "Applique e₂=-M di₁/dt et construis le graphe par morceaux.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Lecture graphique",
      title: "Le courant primaire i₁(t)",
      instruction: "Déplace le point sur les cinq millisecondes et repère les segments montant, horizontal puis descendant.",
      observation: "La pente vaut +50 A/s de 0 à 2 ms, 0 de 2 à 3 ms et -50 A/s de 3 à 5 ms.",
      formula: "e₂(t) = -M di₁/dt",
      formulaTex: "e_2(t)=-M\\,\\frac{\\mathrm di_1}{\\mathrm dt}",
      rule: { kind: "samples", points: [[0, -50], [1, 0], [2, 50], [3, 50], [4, 0], [5, -50]] },
      window: { xMin: 0, xMax: 5, yMin: -60, yMax: 60 },
      guides: [{ kind: "horizontal", value: 0, label: "i₁ = 0" }],
      marker: { min: 0, max: 5, step: 0.5, initial: 1 },
    },
    questions: [
      choice("Dans un solénoïde long, B₁ s'écrit…", ["μ₀N₁i₁/ℓ", "μ₀ℓi₁/N₁", "N₁/(μ₀ℓi₁)", "μ₀N₂πr²"], 0, "Le champ interne du solénoïde est μ₀ni avec n=N₁/ℓ.", "Situation d'évaluation, question 1.1", 2),
      choice("Le flux total reçu par N₂ spires vaut…", ["B₁πr²/N₂", "N₂B₁πr²", "N₁B₁/(πr²)", "B₁r"], 1, "Chaque spire reçoit B₁πr² et les N₂ contributions s'additionnent.", "Situation d'évaluation, question 1.2", 2),
      choice("Le coefficient M relie le flux au courant par…", ["Φ₂₁=M/i₁", "Φ₂₁=Mi₁", "Φ₂₁=M+i₁", "Φ₂₁=i₁²/M"], 1, "Toutes les constantes géométriques et magnétiques sont regroupées dans M.", "Situation d'évaluation, question 1.2", 1),
      short("Donne M en écriture scientifique, en H.", ["1,2.10^-4", "1.2e-4", "0,00012", "0.00012", "1,20×10^-4 H"], "M=μ₀πN₁N₂r²/ℓ≈1,20×10⁻⁴ H.", "Situation d'évaluation, solution", 3),
      short("Calcule la pente de i₁ entre 0 et 2 ms, en A/s.", ["50", "50 A/s", "+50", "+50 A/s"], "Δi/Δt=0,100/0,002=50 A·s⁻¹.", "Situation d'évaluation, question 2", 2),
      short("Donne e₂ entre 0 et 2 ms, en mV.", ["-6", "-6 mV", "-6,0", "-6.0", "-0,006 V", "-0.006 V"], "e₂=-M×50≈-0,006 V=-6 mV.", "Situation d'évaluation, question 2", 3),
      short("Donne e₂ entre 2 et 3 ms.", ["0", "0 V", "0 mV"], "Le courant est constant, donc sa dérivée et la f.é.m. sont nulles.", "Situation d'évaluation, question 2", 2),
      short("Donne e₂ entre 3 et 5 ms, en mV.", ["6", "+6", "6 mV", "+6 mV", "0,006 V", "0.006 V"], "La pente vaut -50 A/s, donc e₂=+6 mV.", "Situation d'évaluation, question 2", 3),
      choice("Sur quel segment la valeur du courant est-elle forte mais la f.é.m. nulle ?", ["0 à 2 ms", "2 à 3 ms", "3 à 5 ms", "aucun"], 1, "Le plateau est à +50 mA mais sa pente est nulle.", "Situation d'évaluation, graphe", 2),
      choice("Si toutes les durées du graphe étaient divisées par deux sans changer les courants, |e₂| serait…", ["divisée par deux", "inchangée", "doublée sur les segments inclinés", "toujours nulle"], 2, "Les pentes seraient doublées, donc les f.é.m. aussi.", "Prolongement de l'évaluation", 2),
    ],
  },
  {
    id: "official-induction-exercises",
    title: "Résoudre les exercices officiels de fixation",
    summary: "Mobiliser flux, vocabulaire de l'induction, loi de Lenz et Faraday dans les exercices 1 à 3 du document.",
    pages: "10-12",
    section: "III. Exercices 1 à 3",
    durationMinutes: 24,
    xp: 105,
    kind: "practice",
    body: String.raw`## Exercice 1 - Flux dans une bobine

La bobine possède $N=150$ spires, $r=10$ cm et se trouve dans un champ axial $B=0{,}10$ T. Les vecteurs $\vec B$ et $\vec S$ ont même sens.

L'angle est donc :

$$\alpha=0\ \text{rad}$$

Le flux total s'écrit :

$$\Phi=150BS$$

Avec $S=\pi(0{,}10)^2$ :

$$\Phi=150\times0{,}10\times\pi(0{,}10)^2
\approx\boxed{0{,}47\ \text{Wb}}$$

Les réponses officielles sont donc **1-b, 2-c, 3-a**.

## Exercice 2 - Vocabulaire et condition d'induction

Les cinq réponses du QCM sont :

1. la source du champ est l'**inducteur** : **b** ;
2. le circuit siège de la tension est l'**induit** : **a** ;
3. une tension apparaît si l'intensité du champ est **variable** : **c** ;
4. dans la configuration proposée, le déplacement perpendiculaire au champ modifie le flux : **c** ;
5. le champ du courant induit s'oppose à la **variation du champ**, donc du flux : **b**.

Le point 4 doit être lu avec soin : un déplacement ne provoque une induction que s'il modifie effectivement le flux ou la portion de circuit située dans la zone de champ.

## Exercice 3 - Tige mobile sur deux rails

Deux rails sont séparés de $\ell=25$ cm. Une tige de résistance $r=0{,}50\ \Omega$ glisse vers la droite à $v=10\ \text{m·s}^{-1}$. Les rails sont reliés à $R=0{,}50\ \Omega$ et le champ $B=1{,}0$ T sort du plan.

### Sens du courant

Le déplacement augmente l'aire traversée par le champ sortant. Le courant induit crée une force de Laplace vers la gauche afin de s'opposer au mouvement. Dans la tige, le courant conventionnel circule de $M'$ vers $M$.

### Flux

Avec le sens positif de la figure, le vecteur-surface est opposé au champ. À $t=0$, l'aire vaut $S_0$ ; à la date $t$ :

$$S(t)=S_0+\ell vt$$

Le flux est :

$$\Phi(t)=-B\bigl(S_0+\ell vt\bigr)$$

### F.é.m. et courant

$$e=-\frac{\mathrm d\Phi}{\mathrm dt}=B\ell v$$

Application numérique :

$$e=1{,}0\times0{,}25\times10
=\boxed{2{,}5\ \text{V}}$$

La résistance totale vaut $R+r=1{,}0\ \Omega$, donc :

$$i=\frac{e}{R+r}
=\boxed{2{,}5\ \text{A}}$$

La force de freinage associée vaut, en prolongement :

$$F=i\ell B=2{,}5\times0{,}25\times1
=0{,}625\ \text{N}$$

Elle est orientée vers la gauche, conformément à Lenz.

> **Astuce mémoire.** Rails mobiles : **surface**, puis **flux**, puis **dérivée**. La formule $e=B\ell v$ se retrouve, elle ne doit pas être apprise sans le raisonnement.

> **Contrôle énergétique.** La force magnétique freine la tige ; maintenir $v$ constant exige donc une force extérieure et un apport d'énergie mécanique.`,
    keyPoint: "Pour une tige de longueur ℓ glissant à la vitesse v dans B perpendiculaire : |e|=Bℓv et |i|=Bℓv/(R+r), le sens étant fixé par Lenz.",
    example: "B=1 T, ℓ=0,25 m, v=10 m/s et R+r=1 Ω donnent e=2,5 V et i=2,5 A, de M′ vers M dans la tige.",
    methodSteps: [
      "Dans un QCM de flux, commence par l'angle entre B⃗ et S⃗.",
      "Dans les rails, détermine si l'aire augmente ou diminue.",
      "Choisis S⃗ et écris le flux algébrique B⃗·S⃗.",
      "Dérive pour obtenir e, puis divise par la résistance totale.",
      "Vérifie avec Lenz que la force associée s'oppose au mouvement.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "La tige mobile sur les rails",
      instruction: "Sélectionne les repères pour suivre la chaîne mouvement → flux → f.é.m. → courant → freinage.",
      observation: "L'aire augmente vers la droite ; le courant descend de M′ vers M dans la tige et la force magnétique s'oppose au mouvement.",
      caption: "Schéma original redessiné d'après l'exercice 3 des pages 11 et 12.",
      viewBox: "0 0 450 260",
      shapes: [
        { shape: "line", x1: 75, y1: 72, x2: 390, y2: 72, tone: "outline" },
        { shape: "line", x1: 75, y1: 188, x2: 390, y2: 188, tone: "outline" },
        { shape: "path", d: "M75 72 L38 72 L38 188 L75 188", tone: "outline" },
        { shape: "path", d: "M38 103 L55 103 L55 157 L38 157 Z", tone: "soft" },
        { shape: "text", x: 46, y: 134, content: "R", anchor: "middle" },
        { shape: "line", x1: 285, y1: 72, x2: 285, y2: 188, tone: "accent" },
        { shape: "text", x: 302, y: 65, content: "M′", anchor: "start" },
        { shape: "text", x: 302, y: 205, content: "M", anchor: "start" },
        { shape: "line", x1: 285, y1: 82, x2: 285, y2: 172, tone: "accent" },
        { shape: "path", d: "M285 172 L276 154 L294 154 Z", tone: "accent" },
        { shape: "text", x: 307, y: 133, content: "i", anchor: "start" },
        { shape: "line", x1: 302, y1: 124, x2: 378, y2: 124, tone: "accent" },
        { shape: "path", d: "M378 124 L360 115 L360 133 Z", tone: "accent" },
        { shape: "text", x: 340, y: 108, content: "v", anchor: "middle" },
        { shape: "line", x1: 269, y1: 222, x2: 194, y2: 222, tone: "accent" },
        { shape: "path", d: "M194 222 L212 213 L212 231 Z", tone: "accent" },
        { shape: "text", x: 232, y: 247, content: "F freinage", anchor: "middle" },
        { shape: "circle", cx: 150, cy: 112, r: 13, tone: "muted" },
        { shape: "circle", cx: 150, cy: 112, r: 4, tone: "accent" },
        { shape: "circle", cx: 205, cy: 151, r: 13, tone: "muted" },
        { shape: "circle", cx: 205, cy: 151, r: 4, tone: "accent" },
        { shape: "text", x: 178, y: 132, content: "B sortant", anchor: "middle" },
        { shape: "line", x1: 105, y1: 86, x2: 105, y2: 174, tone: "muted" },
        { shape: "text", x: 92, y: 133, content: "ℓ", anchor: "middle" },
      ],
      hotspots: [
        { id: "motion", number: 1, label: "Mouvement", detail: "La tige glisse vers la droite à vitesse v et augmente la surface de la boucle.", x: 340, y: 124 },
        { id: "field", number: 2, label: "Champ sortant", detail: "Les points représentent B⃗ dirigé vers l'observateur.", x: 178, y: 132 },
        { id: "current", number: 3, label: "Courant induit", detail: "Dans la tige, le courant conventionnel circule de M′ vers M.", x: 285, y: 128 },
        { id: "braking", number: 4, label: "Force opposée", detail: "La force de Laplace est dirigée vers la gauche et s'oppose au mouvement qui crée l'induction.", x: 232, y: 222 },
      ],
    },
    questions: [
      choice("Exercice 1 : l'angle entre B⃗ et S⃗ vaut…", ["π rad", "0 rad", "π/2 rad", "2π rad"], 1, "Les deux vecteurs sont parallèles et de même sens.", "Exercice 1, question 1", 1),
      choice("Exercice 1 : l'expression correcte du flux est…", ["10BS", "100BS", "150BS", "BS/150"], 2, "La bobine comporte N=150 spires et cos0=1.", "Exercice 1, question 2", 1),
      short("Exercice 1 : calcule le flux au centième de Wb.", ["0,47", "0.47", "0,47 Wb", "0.47 Wb"], "Φ=150×0,1×π×0,1²≈0,471 Wb.", "Exercice 1, question 3", 2),
      choice("Exercice 2.1 : la source du champ se nomme…", ["l'induit", "l'inducteur", "l'inductance"], 1, "C'est l'inducteur.", "Exercice 2, question 1", 1),
      choice("Exercice 2.2 : le circuit siège de la tension se nomme…", ["l'induit", "l'inducteur", "l'inductance"], 0, "C'est l'induit.", "Exercice 2, question 2", 1),
      choice("Exercice 2.3 : une tension apparaît si le champ est…", ["faible", "fort", "variable"], 2, "L'induction demande une variation de flux.", "Exercice 2, question 3", 1),
      choice("Exercice 2.4 : dans la configuration proposée, il faut notamment que la bobine…", ["ait beaucoup de spires seulement", "soit fixe dans un flux constant", "se déplace perpendiculairement au champ"], 2, "Ce déplacement modifie le flux traversant le circuit dans la situation dessinée.", "Exercice 2, question 4", 1),
      choice("Exercice 2.5 : le champ induit s'oppose…", ["au champ inducteur dans tous les cas", "à la variation du champ", "à la variation de la tension"], 1, "Lenz s'oppose à la variation à l'origine de l'induction.", "Exercice 2, question 5", 2),
      choice("Exercice 3 : dans la tige, le courant circule…", ["de M vers M′", "de M′ vers M", "sans direction", "du milieu vers les deux extrémités"], 1, "La force de freinage et la règle de Laplace imposent M′ vers M.", "Exercice 3, question 1.2", 2),
      choice("À la date t, l'aire de la boucle vaut…", ["S₀-ℓvt", "S₀+ℓvt", "Bℓv", "S₀/t"], 1, "La tige se déplace vers la droite et ajoute un rectangle ℓ×vt.", "Exercice 3, question 2", 2),
      choice("Avec l'orientation du corrigé, le flux vaut…", ["B(S₀+ℓvt)", "-B(S₀+ℓvt)", "Bℓ/v", "0"], 1, "Le vecteur-surface choisi est opposé au champ sortant.", "Exercice 3, question 2", 2),
      short("Exercice 3 : calcule la f.é.m. induite en volts.", ["2,5", "2.5", "2,5 V", "2.5 V"], "e=Bℓv=1×0,25×10=2,5 V.", "Exercice 3, question 3", 3),
      short("Exercice 3 : calcule la résistance totale en ohms.", ["1", "1 Ω", "1 ohm", "1,0", "1.0"], "R+r=0,5+0,5=1,0 Ω.", "Exercice 3, question 3", 1),
      short("Exercice 3 : calcule l'intensité induite en ampères.", ["2,5", "2.5", "2,5 A", "2.5 A"], "i=e/(R+r)=2,5/1=2,5 A.", "Exercice 3, question 3", 2),
      short("Prolongement : calcule la force de freinage iℓB en N.", ["0,625", "0.625", "0,625 N", "0.625 N"], "F=2,5×0,25×1=0,625 N.", "Exercice 3, prolongement", 2),
    ],
    corrections: [
      "Page 11, exercice 3, question 3 : l'expression « force électromagnétique d'induction » désigne en réalité la force électromotrice induite e, comme le confirme le corrigé e=Bℓv.",
      "Page 12, exercice 3 : la parenthèse finale mentionne un sens « de M vers N », alors que le point N n'existe pas sur la figure et que le raisonnement précédent donne un courant de M′ vers M dans la tige.",
    ],
  },
  {
    id: "induction-oscilloscope-mission",
    title: "Mission : reconstruire les signaux induits",
    summary: "Résoudre les exercices 4 et 5, relier pente et créneaux de tension, puis expliquer une lecture magnétique.",
    pages: "12-14",
    section: "Exercices 4 et 5 et documentation sur les disques durs",
    durationMinutes: 27,
    xp: 120,
    kind: "challenge",
    body: String.raw`## Mission A - Retrouver le signal d'une bobine secondaire

L'exercice 4 reprend les deux enroulements de la situation d'évaluation :

$$B_1=\mu_0\frac{N_1}{\ell}i_1$$

Le rayon $r$ n'intervient pas dans le champ interne du solénoïde ; il intervient dans l'aire et donc dans le flux :

$$\Phi_{21}=\mu_0\frac{\pi N_1N_2r^2}{\ell}i_1$$

La f.é.m. est :

$$e_2=-\mu_0\frac{\pi N_1N_2r^2}{\ell}
\frac{\mathrm di_1}{\mathrm dt}$$

On retrouve les trois créneaux :

| Intervalle | Pente de $i_1$ | $e_2$ |
|---|---:|---:|
| $0<t<2$ ms | $+50\ \text{A·s}^{-1}$ | $-6$ mV |
| $2<t<3$ ms | $0$ | $0$ |
| $3<t<5$ ms | $-50\ \text{A·s}^{-1}$ | $+6$ mV |

## Mission B - Transformer un courant triangulaire en tension créneau

Dans l'exercice 5, le champ du solénoïde vérifie :

$$B=ki$$

Une bobine plate de $N$ spires et d'aire $S$ reçoit le flux :

$$\Phi=NBS=NSki$$

La f.é.m. vaut :

$$\boxed{e=-NSk\frac{\mathrm di}{\mathrm dt}}$$

Avec $k=10^{-2}\ \text{T·A}^{-1}$, $S=5\ \text{cm}^2=5\times10^{-4}\ \text{m}^2$ et $N=1000$ :

$$NSk=1000\times5\times10^{-4}\times10^{-2}
=5{,}0\times10^{-3}\ \text{H}$$

### Première rampe : 0 à 0,2 ms

Le courant monte de $0$ à $2$ mA :

$$\frac{\Delta i}{\Delta t}
=\frac{2\times10^{-3}}{0{,}2\times10^{-3}}
=10\ \text{A·s}^{-1}$$

Donc :

$$e=-5{,}0\times10^{-3}\times10
=\boxed{-0{,}050\ \text{V}}$$

### Deuxième rampe : 0,2 à 0,4 ms

La pente vaut $-10\ \text{A·s}^{-1}$, donc :

$$\boxed{e=+0{,}050\ \text{V}}$$

Le courant triangulaire produit ainsi une tension en créneaux. Inverser les deux fils de l'oscilloscope inverse tout le signal.

## Culture scientifique - Lire un disque magnétique

Les domaines magnétiques du disque défilent sous la tête. Une tête inductive réagit aux **variations** du champ, donc surtout aux transitions entre domaines. Une zone uniformément aimantée et immobile ne produit pas un signal continu par induction.

Les têtes modernes GMR ou TMR reposent sur une variation de résistance provoquée par le champ ; elles ne doivent pas être confondues avec la tête inductive historique. La tête d'écriture utilise un électroaimant pour imposer l'orientation des domaines.

## Bilan

Dans les deux missions, une droite inclinée pour le courant donne un niveau constant pour la tension :

$$\text{pente constante de }i(t)
\Longrightarrow
\text{f.é.m. constante}$$

Changer le signe de la pente change le signe de la f.é.m.

> **Astuce mémoire.** **Triangle en entrée, créneau en sortie** : la dérivée d'une rampe est constante.

> **Vigilance.** Les abscisses $0{,}2$ et $0{,}4$ du dernier exercice sont des millisecondes. Les traiter comme des secondes rendrait la f.é.m. mille fois trop petite.`,
    keyPoint: "Pour Φ=NSki, e=-NSk di/dt ; un courant triangulaire de pentes ±10 A/s produit ici des créneaux ∓0,050 V.",
    example: "De 0 à 0,2 ms, i passe de 0 à 2 mA : di/dt=10 A/s et e=-0,050 V ; sur la rampe descendante, e=+0,050 V.",
    methodSteps: [
      "Convertis cm² en m², mA en A et ms en s.",
      "Exprime le flux en fonction du courant variable.",
      "Calcule le coefficient constant qui multiplie i.",
      "Mesure la pente sur chaque segment du graphe.",
      "Applique le signe moins de Faraday et trace un niveau constant par segment.",
      "Vérifie que l'inversion des branchements inverse seulement le signe observé.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Signal de sortie",
      title: "La f.é.m. créée par le courant triangulaire",
      instruction: "Déplace le point de 0 à 0,4 ms pour observer les deux niveaux de tension.",
      observation: "La rampe montante donne -0,050 V ; la rampe descendante donne +0,050 V. Le basculement se produit à 0,2 ms.",
      formula: "e(t) = -NSk di/dt",
      formulaTex: "e(t)=-NSk\\,\\frac{\\mathrm di}{\\mathrm dt}",
      rule: { kind: "samples", points: [[0, -0.05], [0.199, -0.05], [0.2, 0.05], [0.4, 0.05]] },
      window: { xMin: 0, xMax: 0.4, yMin: -0.06, yMax: 0.06 },
      guides: [{ kind: "horizontal", value: 0, label: "e = 0" }],
      marker: { min: 0, max: 0.4, step: 0.02, initial: 0.1 },
    },
    questions: [
      choice("Exercice 4 : le champ B₁ dépend-il du rayon r ?", ["Oui, toujours en r²", "Non, pas dans le modèle du solénoïde long", "Oui, en 1/r", "Il ne dépend pas du courant"], 1, "B₁=μ₀N₁i₁/ℓ ; r intervient ensuite dans le flux par l'aire πr².", "Exercice 4, question 1", 2),
      choice("Exercice 4 : le flux secondaire vaut…", ["μ₀N₁N₂πr²i₁/ℓ", "μ₀N₁i₁/(N₂πr²)", "N₂ℓ/(μ₀i₁)", "0 car les bobines sont immobiles"], 0, "Le courant variable suffit à faire varier le champ et le flux.", "Exercice 4, question 2", 2),
      short("Exercice 4 : donne e₂ pour 0<t<2 ms.", ["-6", "-6 mV", "-0,006 V", "-0.006 V"], "La pente vaut +50 A/s, donc e₂=-6 mV.", "Exercice 4, question 3", 2),
      short("Exercice 4 : donne e₂ pour 2<t<3 ms.", ["0", "0 V", "0 mV"], "Le courant est constant sur le plateau.", "Exercice 4, question 3", 1),
      short("Exercice 4 : donne e₂ pour 3<t<5 ms.", ["6", "+6", "6 mV", "+6 mV", "0,006 V", "0.006 V"], "La pente vaut -50 A/s, donc e₂=+6 mV.", "Exercice 4, question 3", 2),
      choice("Le graphe e₂(t) associé est formé…", ["d'une sinusoïde", "de trois niveaux constants -6 mV, 0, +6 mV", "d'une droite toujours croissante", "d'une parabole"], 1, "Chaque segment de i₁ possède une pente constante.", "Exercice 4, question 4", 2),
      choice("Dans l'exercice 5, le flux s'écrit…", ["Φ=NSki", "Φ=NS/(ki)", "Φ=N+i+k", "Φ=ki/(NS)"], 0, "B=ki et Φ=NBS.", "Exercice 5, question 1", 2),
      short("Convertis S=5 cm² en m².", ["5.10^-4", "5e-4", "0,0005", "0.0005", "5×10^-4 m²"], "1 cm²=10⁻⁴ m², donc 5 cm²=5×10⁻⁴ m².", "Exercice 5, données", 1),
      short("Calcule le coefficient NSk en H.", ["5.10^-3", "5e-3", "0,005", "0.005", "5×10^-3 H"], "1000×5×10⁻⁴×10⁻²=5×10⁻³ H.", "Exercice 5, question 2", 2),
      short("Calcule di/dt sur la première rampe, en A/s.", ["10", "10 A/s", "+10", "+10 A/s"], "2 mA / 0,2 ms = 0,002/0,0002 = 10 A/s.", "Exercice 5, question 2", 2),
      short("Donne e sur la première rampe.", ["-0,05", "-0.05", "-0,050 V", "-0.050 V", "-50 mV"], "e=-5×10⁻³×10=-0,050 V.", "Exercice 5, question 2", 2),
      short("Donne e sur la rampe descendante.", ["0,05", "0.05", "+0,05", "+0.05", "0,050 V", "50 mV"], "La pente vaut -10 A/s, donc e=+0,050 V.", "Exercice 5, question 2", 2),
      choice("Inverser les fils de l'oscilloscope…", ["inverse le signe de tout le signal", "annule le flux physique", "double le nombre de spires", "change les millisecondes en secondes"], 0, "La polarité affichée dépend du branchement des voies.", "Exercice 5, question 3", 1),
      choice("L'axe du temps du graphique final doit être gradué en…", ["secondes pour les valeurs 0,2 et 0,4", "millisecondes", "heures", "mètres"], 1, "Le courant varie sur 0,2 ms puis 0,4 ms, comme le graphe d'entrée.", "Exercice 5, graphiques", 2),
      choice("Une tête de lecture inductive réagit surtout…", ["aux transitions du champ magnétique", "à une aimantation uniforme immobile", "à la masse du disque", "à la couleur des domaines"], 0, "L'induction dépend d'une variation de flux.", "IV. Documentation", 1),
      choice("Les capteurs GMR et TMR détectent principalement…", ["une variation de résistance sous l'effet du champ", "une variation de gravité", "la fusion du disque", "un courant continu créé sans champ"], 0, "Ces technologies exploitent la magnétorésistance.", "IV. Documentation", 1),
    ],
    corrections: [
      "Page 13, exercice 4, question 1 : le rayon r figure dans la liste des grandeurs demandées pour B, mais le champ du solénoïde long B=μ₀N₁i₁/ℓ n'en dépend pas. Le rayon intervient dans le flux via πr².",
      "Page 13, exercice 5 : le graphe de sortie imprime t(s), alors que le graphe d'entrée et les calculs utilisent 0,2 ms et 0,4 ms. L'axe correct est t(ms).",
      "Page 13, exercice 5 : le point d'interrogation après e=-5×10⁻³ di/dt est un résidu typographique ; le coefficient est bien confirmé par les données numériques.",
    ],
  },
];

const levelOrder = [
  "magnetic-flux-orientation",
  "induction-flux-variation-experiments",
  "lenz-law-induced-current-direction",
  "faraday-emf-current-charge",
  "induction-devices-applications",
  "coupled-coils-piecewise-emf",
  "official-induction-exercises",
  "induction-oscilloscope-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau d'induction électromagnétique introuvable : " + id);
  return officialLevel(index, level);
});

export const inductionElectromagneticPath: LearningPath = {
  id: "terminale-c-induction-electromagnetic",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Côte d'Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 9,
  title: "Induction électromagnétique",
  description: "Comprendre le flux magnétique, prévoir le sens du courant induit, appliquer Faraday et exploiter transformateurs, alternateurs et signaux induits.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Orienter un circuit et calculer un flux magnétique algébrique.",
    "Identifier les différentes causes d'une variation de flux.",
    "Prévoir le sens du courant induit avec la loi de Lenz.",
    "Calculer une f.é.m., une intensité et une quantité d'électricité induites.",
    "Expliquer le fonctionnement d'un transformateur, d'un alternateur et d'un microphone dynamique.",
    "Passer d'un graphe de courant à un graphe de f.é.m. par morceaux.",
    "Résoudre les exercices officiels de tige mobile et de bobines couplées.",
  ],
  modules: [{
    id: "induction-electromagnetic-mastery",
    title: "Maîtriser l'induction électromagnétique",
    description: "Du flux orienté aux signaux observés à l'oscilloscope, une progression complète fondée sur les 14 pages du document officiel.",
    lessons: builtLevels,
  }],
};

export const inductionElectromagneticPaths: LearningPath[] = [inductionElectromagneticPath];
