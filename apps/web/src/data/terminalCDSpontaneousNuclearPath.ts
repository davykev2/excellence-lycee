import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon commune : n°18 en Terminale C et n°14 en Terminale D.
const sourceDocument = "Leçon 18 (TCE) 14 (TD) - Réactions nucléaires spontanées.pdf";

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
      introduction: "Écris les données avec leurs unités, identifie le noyau père et applique une seule loi à la fois avant de calculer.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : contrôle séparément la ligne du haut A et la ligne du bas Z ; pour le temps, pense au facteur 1/2 à chaque demi-vie.",
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

const decayCurvePoints: Array<[number, number]> = Array.from({ length: 11 }, (_, index) => {
  const timeInHalfLives = index / 2;
  return [timeInHalfLives, Number((2 ** -timeInHalfLives).toFixed(4))];
});

const halfLifePoints: Array<[number, number]> = [0, 1, 2, 3, 4].map((periods) => [periods, 2 ** -periods]);

const poloniumLinearizedPoints: Array<[number, number]> = [
  [0, 0],
  [40, 0.1985],
  [80, 0.4005],
  [100, 0.4943],
  [120, 0.5978],
  [150, 0.7550],
];

const levels: LevelSeed[] = [
  {
    id: "spontaneous-nuclear-rutherford-structure",
    title: "Explorer l'atome et la structure du noyau",
    summary: "Interpréter l'expérience de Rutherford puis relier protons, neutrons, numéro atomique et nombre de masse.",
    pages: "1-2",
    section: "Structure de la matière : expérience de Rutherford et constitution du noyau",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## Ce que Rutherford observe

En 1909, Rutherford bombarde une très fine feuille d'or avec des particules $\alpha$. Deux faits sont essentiels :

- la très grande majorité traverse la feuille presque en ligne droite ;
- une petite partie est déviée, parfois fortement.

Il en déduit que l'atome est presque entièrement vide : sa structure est dite **lacunaire**. La charge positive et l'essentiel de la masse sont concentrés dans une région minuscule, le **noyau**. Les électrons, négatifs, occupent l'espace autour de ce noyau.

> **Image mentale.** Si le noyau avait la taille d'un grain de riz au centre d'un stade, l'atome atteindrait approximativement les gradins.

## Les constituants du noyau

Le noyau contient des **nucléons** de deux sortes :

| Nucléon | Charge | Masse approximative |
|---|---:|---:|
| proton | $+e=+1{,}602\times10^{-19}\ \mathrm{C}$ | $1{,}6726\times10^{-27}\ \mathrm{kg}$ |
| neutron | $0$ | $1{,}6749\times10^{-27}\ \mathrm{kg}$ |

L'électron n'est **pas** un nucléon : il se situe hors du noyau et porte la charge $-e$.

## Trois nombres à ne pas confondre

- $Z$ est le **numéro atomique** : il compte les protons ;
- $A$ est le **nombre de masse** : il compte tous les nucléons ;
- $N$ est le nombre de neutrons.

$$A=Z+N\qquad\Longleftrightarrow\qquad N=A-Z$$

Un noyau contenant $Z=8$ protons et $A=16$ nucléons possède donc $N=8$ neutrons. Dans un atome neutre, le nombre d'électrons est aussi égal à $Z$.

Une particule $\alpha$ passant loin du noyau traverse presque sans déviation. Si elle s'en approche, la répulsion entre charges positives peut fortement courber sa trajectoire. L'expérience révèle ainsi un noyau minuscule et positif ; elle ne place pas les électrons dans le noyau.`,
    keyPoint: "Le noyau positif contient Z protons et N=A−Z neutrons ; l'atome est essentiellement vide.",
    example: "Pour A=27 et Z=13, le noyau possède N=27−13=14 neutrons.",
    methodSteps: [
      "Relève A et Z sans les intervertir.",
      "Calcule le nombre de neutrons avec N=A−Z.",
      "Distingue le noyau du cortège électronique.",
      "Relie une forte déviation à un passage proche du noyau positif.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Expérience",
      title: "Suivre les particules alpha dans la feuille d'or",
      instruction: "Sélectionne les repères pour comprendre ce que révèle chaque trajectoire.",
      observation: "La majorité des trajectoires confirme le vide atomique ; les rares fortes déviations localisent la charge positive.",
      caption: "Schéma pédagogique original de l'expérience de Rutherford.",
      viewBox: "0 0 600 270",
      shapes: [
        { shape: "path", d: "M40 55 H135 V215 H40 Z", tone: "soft" },
        { shape: "text", x: 88, y: 140, content: "source α", anchor: "middle" },
        { shape: "line", x1: 135, y1: 95, x2: 545, y2: 95, tone: "accent" },
        { shape: "line", x1: 135, y1: 135, x2: 545, y2: 135, tone: "accent" },
        { shape: "line", x1: 135, y1: 175, x2: 325, y2: 175, tone: "accent" },
        { shape: "path", d: "M325 175 Q365 175 395 225", tone: "muted" },
        { shape: "line", x1: 350, y1: 45, x2: 350, y2: 225, tone: "outline" },
        { shape: "circle", cx: 350, cy: 174, r: 7, tone: "fill" },
        { shape: "circle", cx: 350, cy: 95, r: 4, tone: "fill" },
        { shape: "circle", cx: 350, cy: 135, r: 4, tone: "fill" },
        { shape: "text", x: 350, y: 30, content: "feuille d'or", anchor: "middle" },
      ],
      hotspots: [
        { id: "source", number: 1, label: "Particules α", detail: "Elles sont positives et arrivent sur une feuille métallique très mince.", x: 125, y: 45 },
        { id: "straight", number: 2, label: "Trajectoires droites", detail: "Elles sont très nombreuses : l'atome est essentiellement vide.", x: 465, y: 75 },
        { id: "deflected", number: 3, label: "Rare déviation", detail: "Une particule passée près du noyau positif est fortement repoussée.", x: 405, y: 220 },
        { id: "nucleus", number: 4, label: "Noyau minuscule", detail: "Il concentre la charge positive et presque toute la masse.", x: 350, y: 174 },
      ],
    },
    questions: [
      choice("Dans l'expérience de Rutherford, la majorité des particules α…", ["traverse la feuille sans forte déviation", "revient vers la source", "disparaît dans l'or", "devient un électron"], 0, "Le trajet presque rectiligne est majoritaire.", "Page 1"),
      choice("La structure lacunaire signifie que l'atome…", ["est principalement vide", "ne possède aucun noyau", "est entièrement positif", "ne contient que des neutrons"], 0, "L'essentiel du volume atomique est vide.", "Page 1"),
      choice("Les fortes déviations rares révèlent…", ["un noyau petit et positif", "des électrons très lourds", "une feuille sans atomes", "une charge positive uniforme"], 0, "La répulsion est forte près du noyau.", "Page 1"),
      choice("Les nucléons sont…", ["les protons et les neutrons", "les protons et les électrons", "les électrons et les photons", "les neutrons et les positons"], 0, "Le noyau regroupe protons et neutrons.", "Page 2"),
      choice("Le numéro atomique Z compte…", ["les protons", "tous les nucléons", "les neutrons", "les photons"], 0, "Z est le nombre de protons.", "Page 2"),
      choice("Le nombre de masse A compte…", ["tous les nucléons", "seulement les protons", "seulement les neutrons", "les photons gamma"], 0, "A=Z+N.", "Page 2"),
      short("Un noyau a A=31 et Z=15. Combien contient-il de neutrons ?", ["16"], "N=31−15=16.", "Application directe"),
      short("Un noyau possède 12 protons et 13 neutrons. Donne A.", ["25"], "A=12+13=25.", "Application directe"),
      choice("La charge du neutron est…", ["nulle", "+e", "−e", "+2e"], 0, "Le neutron est neutre.", "Tableau page 2"),
      choice("La charge du proton vaut…", ["+1,602×10⁻¹⁹ C", "0 C", "−1,602×10⁻¹⁹ C", "+4 C"], 0, "Le proton porte +e.", "Tableau page 2"),
      choice("Laquelle n'est pas un nucléon ?", ["l'électron", "le proton", "le neutron", "aucune"], 0, "L'électron est hors du noyau.", "Précision"),
      choice("Dans un atome neutre de numéro atomique Z, le nombre d'électrons est…", ["Z", "A", "A−Z", "2Z"], 0, "La neutralité impose autant d'électrons que de protons.", "Complément"),
    ],
    corrections: [
      "Page 1 : le modèle planétaire est présenté comme une représentation historique, pas comme des orbites classiques fixes.",
      "Page 2 : la relation A=Z+N est explicitée avant N=A−Z pour séparer nombre de masse et masse mesurée.",
    ],
  },
  {
    id: "spontaneous-nuclear-nuclides-isotopes-unit",
    title: "Nommer les nucléides, les éléments et les isotopes",
    summary: "Lire l'écriture nucléaire, reconnaître des isotopes et manipuler l'unité de masse atomique.",
    pages: "2",
    section: "Élément chimique, nucléide, isotopes et unité de masse atomique",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## Élément chimique et nucléide

Un **élément chimique** regroupe toutes les espèces qui possèdent le même numéro atomique $Z$. C'est $Z$, et non $A$, qui fixe l'identité chimique.

Un **nucléide** est un type précis de noyau caractérisé par le couple $(A,Z)$. Son écriture est :

$$^{A}_{Z}\mathrm{X}$$

$\mathrm{X}$ est le symbole de l'élément, $A$ figure en haut et $Z$ en bas. Le nombre de neutrons se déduit par $N=A-Z$. Ainsi, $^{14}_{6}\mathrm{C}$ contient $6$ protons et $8$ neutrons.

## Isotopes

Deux noyaux sont **isotopes** s'ils ont le même $Z$ mais des nombres de masse $A$ différents :

$$^{12}_{6}\mathrm{C},\qquad ^{13}_{6}\mathrm{C},\qquad ^{14}_{6}\mathrm{C}$$

Ils appartiennent tous au carbone, avec respectivement $6$, $7$ et $8$ neutrons. Des noyaux ayant le même $A$ mais des $Z$ différents ne sont pas isotopes.

## L'unité de masse atomique

Les masses nucléaires en kilogrammes sont minuscules. On utilise l'unité $\mathrm{u}$, définie comme le douzième de la masse d'un atome de carbone 12 :

$$1\ \mathrm{u}\simeq1{,}66\times10^{-27}\ \mathrm{kg}$$

La relation d'Einstein associe à cette masse l'énergie :

$$1\ \mathrm{u}\,c^2\simeq931\ \mathrm{MeV}$$

On rencontre aussi $1\ \mathrm{u}\simeq931\ \mathrm{MeV}/c^2$. Le support fournit :

$$m_p=1{,}007276\ \mathrm{u},\qquad m_n=1{,}008665\ \mathrm{u}$$

Le nombre $A$ est un **entier sans unité** ; la masse réelle s'exprime en $\mathrm{u}$ ou en kilogrammes. Elle n'est pas exactement égale à $A\ \mathrm{u}$, car l'énergie de liaison intervient.

> **Astuce mémoire.** Même $Z$ = même élément ; $A$ varie entre isotopes.`,
    keyPoint: "Un nucléide s'écrit ᴬ_ZX ; des isotopes ont le même Z mais des A différents.",
    example: "Pour ²³₁₁Na : 11 protons et 12 neutrons ; ²⁴₁₁Na serait un isotope.",
    methodSteps: ["Lis A en haut et Z en bas.", "Identifie l'élément avec Z.", "Calcule N=A−Z.", "Compare Z avant A.", "Garde A sans unité."],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte du noyau",
      title: "Décoder une écriture nucléaire",
      instruction: "Ouvre chaque carte pour relier le symbole aux informations du noyau.",
      observation: "L'identité chimique dépend de Z ; A et N peuvent varier entre isotopes.",
      rootLabel: "ᴬ_ZX",
      rootDetail: "Cette écriture donne l'élément X, le nombre de protons Z et le nombre total de nucléons A.",
      nodes: [
        { id: "mass", label: "A", role: "nombre de masse", detail: "A=Z+N compte les nucléons ; c'est un entier sans unité.", group: "Écriture" },
        { id: "charge", label: "Z", role: "numéro atomique", detail: "Z compte les protons et fixe l'élément.", group: "Écriture" },
        { id: "symbol", label: "X", role: "symbole chimique", detail: "X est déterminé par Z : C pour 6, Pb pour 82.", group: "Écriture" },
        { id: "neutrons", label: "N=A−Z", role: "neutrons", detail: "N se calcule à partir de A et Z.", group: "Composition" },
        { id: "isotopes", label: "Même Z", role: "isotopes", detail: "Ils gardent Z mais ont des A différents.", group: "Famille" },
        { id: "unit", label: "u", role: "unité de masse", detail: "1 u≈1,66×10⁻²⁷ kg et 1 u·c²≈931 MeV.", group: "Masse" },
      ],
    },
    questions: [
      choice("Un élément chimique est défini par…", ["son numéro atomique Z", "son nombre de masse A seul", "sa masse en kg", "son nombre de neutrons seul"], 0, "Même élément signifie même Z.", "Page 2"),
      choice("Dans ¹⁴₆C, le nombre écrit en bas est…", ["Z=6", "A=6", "N=6", "la masse 6 u"], 0, "Z figure en bas.", "Page 2"),
      short("Combien de neutrons possède ¹⁴₆C ?", ["8"], "N=14−6=8.", "Exemple page 2"),
      choice("¹²₆C et ¹⁴₆C sont isotopes car ils ont…", ["le même Z et des A différents", "le même A et des Z différents", "A et Z identiques", "des charges opposées"], 0, "C'est la définition des isotopes.", "Page 2"),
      choice("¹⁴₆C et ¹⁴₇N sont-ils isotopes ?", ["non, leurs Z diffèrent", "oui, leurs A sont égaux", "oui, ils ont autant de neutrons", "non, car A doit être nul"], 0, "Même A ne suffit pas.", "Application"),
      short("Pour ²³₁₁Na, donne le nombre de neutrons.", ["12"], "N=23−11=12.", "Application"),
      choice("L'unité u est définie à partir…", ["du carbone 12", "du polonium 210", "de l'électron", "du carbone 14"], 0, "C'est le douzième de la masse du carbone 12.", "Page 2"),
      short("Donne 1 u en kilogrammes.", ["1.66e-27", "1,66e-27", "1,66×10^-27", "1,66×10⁻²⁷"], "1 u≈1,66×10⁻²⁷ kg.", "Page 2"),
      choice("L'équivalent énergétique de 1 u·c² vaut environ…", ["931 MeV", "931 eV", "1,66 MeV", "3×10⁸ MeV"], 0, "Conversion nucléaire usuelle.", "Page 2"),
      choice("Le nombre de masse A s'exprime…", ["sans unité", "en u", "en kg", "en Bq"], 0, "A compte les nucléons.", "Précision"),
      choice("Le proton et le neutron ont…", ["des masses proches", "des charges identiques", "des masses nulles", "la masse de l'électron"], 0, "Leurs masses sont proches de 1 u.", "Page 2"),
      short("Un noyau possède Z=17 et N=20. Donne A.", ["37"], "A=17+20=37.", "Application"),
      choice("Même Z et même A désignent…", ["le même nucléide", "deux éléments différents", "deux ions obligatoires", "deux photons"], 0, "Le couple (A,Z) caractérise le nucléide.", "Bilan"),
    ],
    corrections: [
      "Page 2 : l'équivalence est écrite 1 u·c²≈931 MeV afin de distinguer masse et énergie.",
      "Page 2 : A est séparé de la masse réelle, affectée par l'énergie de liaison.",
    ],
  },
  {
    id: "spontaneous-nuclear-emissions",
    title: "Distinguer les émissions α, β⁺, β⁻ et γ",
    summary: "Définir la radioactivité et identifier la charge, la masse et la nature des rayonnements émis.",
    pages: "2-4",
    section: "Émissions radioactives et désexcitation gamma",
    durationMinutes: 25,
    xp: 65,
    body: String.raw`## Une transformation spontanée

La **radioactivité** est la transformation spontanée d'un noyau instable en un autre noyau. Le noyau initial est le **noyau père** ; le noyau obtenu est le **noyau fils**. Le phénomène peut concerner des radionucléides naturels ou artificiels.

Chaque noyau se désintègre à un instant imprévisible. Sur un très grand nombre de noyaux, une loi statistique précise apparaît.

## Les émissions à reconnaître

| Émission | Symbole | Charge | Nature |
|---|---:|---:|---|
| alpha | $^{4}_{2}\mathrm{He}$ | $+2e$ | noyau d'hélium, environ $4\ \mathrm{u}$ |
| bêta plus | $^{0}_{+1}\mathrm{e}$ | $+e$ | positon, environ $5{,}5\times10^{-4}\ \mathrm{u}$ |
| bêta moins | $^{0}_{-1}\mathrm{e}$ | $-e$ | électron, environ $5{,}5\times10^{-4}\ \mathrm{u}$ |
| gamma | $^{0}_{0}\gamma$ | $0$ | photon très énergétique |

Une émission $\alpha$ emporte quatre nucléons. Les émissions $\beta^+$ et $\beta^-$ transforment un nucléon sans modifier $A$.

## Le rayonnement gamma

Le rayonnement $\gamma$ est électromagnétique, comme la lumière, mais sa fréquence peut être de l'ordre de $10^{21}\ \mathrm{Hz}$ :

$$E_\gamma=h\nu$$

Après une désintégration, le noyau fils peut être excité :

$$^{A}_{Z}\mathrm{Y}^{*}\longrightarrow{}^{A}_{Z}\mathrm{Y}+{}^{0}_{0}\gamma$$

L'émission gamma ne change ni $A$ ni $Z$ : elle évacue un excès d'énergie.

> **Précision.** Gamma n'accompagne pas obligatoirement chaque désintégration ; il apparaît lorsque le noyau fils est produit dans un état excité.

Pour choisir vite : $^{4}_{2}\mathrm{He}$ indique $\alpha$ ; $^{0}_{+1}\mathrm e$ indique $\beta^+$ ; $^{0}_{-1}\mathrm e$ indique $\beta^-$ ; mêmes $A$ et $Z$ avec perte d'énergie indique $\gamma$.`,
    keyPoint: "α=⁴₂He, β⁺=⁰₊₁e, β⁻=⁰₋₁e et γ=⁰₀γ ; gamma conserve A et Z.",
    example: "Y* devient Y avec les mêmes A et Z : un photon γ emporte l'énergie excédentaire.",
    methodSteps: ["Observe le symbole émis.", "Lis A en haut et Z en bas.", "Associe le symbole au rayonnement.", "Pour gamma, vérifie A et Z inchangés.", "Distingue particule et photon."],
    interaction: {
      kind: "diagram",
      eyebrow: "Rayonnements",
      title: "Comparer les quatre signatures radioactives",
      instruction: "Sélectionne une émission pour afficher sa signature et son effet.",
      observation: "A et Z de la particule émise annoncent la modification du noyau père.",
      rootLabel: "Noyau instable",
      rootDetail: "Il devient spontanément un noyau fils plus stable.",
      nodes: [
        { id: "alpha", label: "α", role: "⁴₂He", detail: "Charge +2e, masse proche de 4 u ; le fils perd 4 sur A et 2 sur Z.", group: "Particules" },
        { id: "beta-plus", label: "β⁺", role: "positon", detail: "A reste constant et Z du fils diminue de 1.", group: "Particules" },
        { id: "beta-minus", label: "β⁻", role: "électron", detail: "A reste constant et Z du fils augmente de 1.", group: "Particules" },
        { id: "gamma", label: "γ", role: "photon", detail: "Rayonnement électromagnétique : A et Z restent inchangés.", group: "Rayonnement" },
        { id: "father", label: "Père", role: "avant", detail: "Noyau instable initial.", group: "Vocabulaire" },
        { id: "daughter", label: "Fils", role: "après", detail: "Nouveau noyau produit.", group: "Vocabulaire" },
      ],
    },
    questions: [
      choice("La radioactivité est…", ["une transformation spontanée d'un noyau instable", "une réaction chimique", "une onde sonore", "une fusion toujours provoquée"], 0, "Elle concerne le noyau.", "Page 2"),
      choice("Le noyau initial est appelé…", ["noyau père", "noyau fils", "positon", "photon"], 0, "Le père donne le fils.", "Page 2"),
      choice("Une particule α est…", ["un noyau d'hélium ⁴₂He", "un électron", "un photon", "un neutron"], 0, "Alpha contient deux protons et deux neutrons.", "Page 2"),
      choice("La charge de α vaut…", ["+2e", "+e", "−e", "0"], 0, "Deux protons donnent +2e.", "Page 2"),
      choice("β⁺ est…", ["un positon", "un électron", "un noyau d'hélium", "un photon"], 0, "Le positon est positif.", "Page 2"),
      choice("La charge de β⁻ vaut…", ["−e", "+e", "+2e", "0"], 0, "β⁻ est un électron.", "Page 2"),
      choice("Le nombre de masse de β⁺ ou β⁻ est…", ["0", "1", "2", "4"], 0, "La notation porte A=0.", "Page 2"),
      choice("Le rayonnement γ est…", ["électromagnétique", "un noyau d'hélium", "mécanique", "un proton"], 0, "Gamma est un photon.", "Page 3"),
      short("Quel ordre de grandeur de fréquence est donné pour γ, en Hz ?", ["1e21", "10^21", "10²¹"], "Environ 10²¹ Hz.", "Page 3"),
      choice("Une émission γ change…", ["l'énergie, pas A ni Z", "A de 4 et Z de 2", "Z de 1", "une molécule seulement"], 0, "C'est une désexcitation.", "Page 4"),
      choice("L'astérisque Y* signifie…", ["noyau excité", "ion sans proton", "photon", "isotope stable obligatoire"], 0, "L'astérisque marque l'excès d'énergie.", "Page 4"),
      choice("Toute désintégration émet-elle forcément γ ?", ["non, seulement si le fils se désexcite", "oui", "gamma n'existe pas", "oui en chimie"], 0, "L'état excité n'est pas systématique.", "Précision"),
      choice("La radioactivité concerne des noyaux…", ["naturels ou artificiels", "naturels seulement", "artificiels seulement", "sans nucléons"], 0, "Les deux existent.", "Page 2"),
      choice("Pour un noyau unique, l'instant de désintégration est…", ["aléatoire", "prévisible exactement", "fixé par la masse seule", "toujours nul"], 0, "La prévision est statistique.", "Transition"),
    ],
    corrections: [
      "Pages 2 et 4 : gamma est une désexcitation possible, pas un accompagnement obligatoire.",
      "Page 3 : gamma est précisé comme photon de masse au repos nulle.",
    ],
  },
  {
    id: "spontaneous-nuclear-conservation-alpha",
    title: "Équilibrer une désintégration alpha",
    summary: "Appliquer les deux lois de conservation et trouver le noyau fils d'un émetteur alpha.",
    pages: "3",
    section: "Lois de conservation et radioactivité alpha",
    durationMinutes: 26,
    xp: 75,
    body: String.raw`## Deux bilans indépendants

Une équation nucléaire générale s'écrit :

$$^{A}_{Z}\mathrm X\longrightarrow{}^{A_1}_{Z_1}\mathrm Y+{}^{A_2}_{Z_2}\mathrm R$$

Elle respecte deux lois :

$$A=A_1+A_2\qquad\text{et}\qquad Z=Z_1+Z_2$$

La première conserve le nombre de nucléons ; la seconde conserve le nombre de charge. On équilibre séparément la ligne du haut et celle du bas. Une équation chimique conserve les atomes ; une équation nucléaire peut changer l'élément mais conserve ces deux totaux.

## Désintégration alpha

La particule $\alpha$ est $^{4}_{2}\mathrm{He}$. Le noyau fils perd donc quatre nucléons et deux protons :

$$^{A}_{Z}\mathrm X\longrightarrow{}^{A-4}_{Z-2}\mathrm Y+{}^{4}_{2}\mathrm{He}$$

Cette radioactivité concerne surtout les noyaux lourds instables, le support indiquant typiquement $A>200$ et $Z>82$.

Exemple officiel :

$$^{226}_{88}\mathrm{Ra}\longrightarrow{}^{222}_{86}\mathrm{Rn}+{}^{4}_{2}\mathrm{He}$$

Vérification :

$$226=222+4,\qquad 88=86+2$$

## Retrouver l'élément fils

Après avoir calculé $A_{\mathrm f}=A-4$ et $Z_{\mathrm f}=Z-2$, on identifie le symbole chimique avec une classification. Pour le polonium, $Z=84$ devient $82$, donc le fils est le plomb $\mathrm{Pb}$.

Exemple :

$$^{210}_{84}\mathrm{Po}\longrightarrow{}^{206}_{82}\mathrm{Pb}+{}^{4}_{2}\mathrm{He}$$

Le nombre de neutrons diminue aussi de deux :

$$N_{\mathrm f}=(A-4)-(Z-2)=N-2$$

> **Contrôle anti-erreur.** Si le symbole choisi ne possède pas le $Z$ calculé, l'équation est fausse, même si la ligne de $A$ est juste.

La masse réelle n'est pas conservée exactement sous forme de somme numérique : une petite différence de masse devient énergie. Les lois d'équilibrage portent ici sur $A$ et $Z$, tandis que l'énergie totale reste conservée.`,
    keyPoint: "En alpha : A_f=A−4 et Z_f=Z−2 ; vérifie toujours A et Z séparément.",
    example: "²¹⁰₈₄Po donne ²⁰⁶₈₂Pb et ⁴₂He : 210=206+4, 84=82+2.",
    methodSteps: ["Écris ⁴₂He à droite.", "Calcule A−4.", "Calcule Z−2.", "Trouve le symbole associé au nouveau Z.", "Refais les deux sommes de contrôle."],
    interaction: timeline(
      [
        { label: "Écrire l'émission", shortLabel: "α", detail: "Place ⁴₂He à droite de la flèche." },
        { label: "Conserver A", shortLabel: "A−4", detail: "Le nombre de masse du fils vaut A−4." },
        { label: "Conserver Z", shortLabel: "Z−2", detail: "Le numéro atomique du fils vaut Z−2." },
        { label: "Identifier Y", shortLabel: "Symbole", detail: "Lis le symbole correspondant au nouveau Z." },
        { label: "Vérifier", shortLabel: "Deux lignes", detail: "Contrôle A_f+4=A et Z_f+2=Z." },
      ],
      "Construire une équation alpha sans deviner",
      "Parcours les cinq étapes dans l'ordre.",
      "Le double contrôle empêche de confondre nombre de masse, charge et symbole chimique.",
    ),
    questions: [
      choice("Une équation nucléaire conserve…", ["A et Z", "la masse en u uniquement", "le symbole X", "le nombre d'électrons atomiques uniquement"], 0, "On conserve nucléons et charge.", "Page 3"),
      choice("En alpha, le nombre de masse du fils vaut…", ["A−4", "A+4", "A−2", "A"], 0, "Alpha emporte quatre nucléons.", "Page 3"),
      choice("En alpha, le numéro atomique du fils vaut…", ["Z−2", "Z+2", "Z−4", "Z"], 0, "Alpha emporte deux protons.", "Page 3"),
      short("Dans la désintégration de ²²⁶₈₈Ra, donne A du fils.", ["222"], "226−4=222.", "Exemple page 3"),
      short("Dans la désintégration de ²²⁶₈₈Ra, donne Z du fils.", ["86"], "88−2=86.", "Exemple page 3"),
      choice("Le noyau fils de ²²⁶₈₈Ra est…", ["²²²₈₆Rn", "²³⁰₉₀Th", "²²⁶₈₆Rn", "²²²₈₈Ra"], 0, "Les deux nombres diminuent.", "Exemple page 3"),
      short("Un noyau ²³⁸₉₂U émet α. Donne A du fils.", ["234"], "238−4=234.", "Application"),
      short("Un noyau ²³⁸₉₂U émet α. Donne Z du fils.", ["90"], "92−2=90.", "Application"),
      choice("Le support associe surtout l'émission α aux noyaux…", ["lourds instables", "très légers stables", "sans neutron", "moléculaires"], 0, "Il indique A>200 et Z>82 comme domaine typique.", "Page 3"),
      short("Après une émission α, de combien N diminue-t-il ?", ["2", "de 2"], "Deux protons et deux neutrons partent.", "Déduction"),
      choice("Pour ²¹⁰₈₄Po, le numéro atomique du fils est…", ["82", "80", "84", "86"], 0, "84−2=82.", "Application officielle"),
      choice("L'élément de numéro atomique 82 est…", ["Pb", "Po", "Bi", "Rn"], 0, "La classification fournie donne Pb pour Z=82.", "Page 5"),
      choice("La bonne équation du Po-210 est…", ["²¹⁰₈₄Po→²⁰⁶₈₂Pb+⁴₂He", "²¹⁰₈₄Po→²¹⁰₈₂Pb+⁰₂He", "²¹⁰₈₄Po→²⁰⁶₈₄Po+⁴₂He", "²¹⁰₈₄Po→²¹⁴₈₆Rn+⁴₂He"], 0, "Les deux conservations imposent Pb-206.", "Correction page 5"),
      choice("Une différence entre masses réelles avant et après devient…", ["de l'énergie", "un défaut de charge", "un électron obligatoire", "un changement de A"], 0, "E=Δmc².", "Préparation mission"),
    ],
    corrections: [
      "Pages 5-6 : le polonium de la situation est rétabli en ²¹⁰₈₄Po et son fils en ²⁰⁶₈₂Pb ; les mentions ¹⁰⁷₈₄Po sont des coquilles.",
      "Page 3 : les lois sur A et Z sont distinguées de la conservation masse-énergie.",
    ],
  },
  {
    id: "spontaneous-nuclear-beta-gamma-application",
    title: "Maîtriser β⁺, β⁻ et la désexcitation γ",
    summary: "Comprendre les transformations internes, équilibrer les émissions bêta et résoudre l'activité d'application officielle.",
    pages: "3-4",
    section: "Radioactivités bêta, désexcitation gamma et activité d'application",
    durationMinutes: 27,
    xp: 85,
    body: String.raw`## Bêta plus : un proton devient neutron

Un noyau trop riche en protons peut émettre un positon :

$$^{A}_{Z}\mathrm X\longrightarrow{}^{A}_{Z-1}\mathrm Y+{}^{0}_{+1}\mathrm e+\nu_e$$

Au niveau microscopique :

$$^{1}_{1}\mathrm p\longrightarrow{}^{1}_{0}\mathrm n+{}^{0}_{+1}\mathrm e+\nu_e$$

$A$ reste constant et $Z$ diminue de $1$. Exemple :

$$^{13}_{7}\mathrm N\longrightarrow{}^{13}_{6}\mathrm C+{}^{0}_{+1}\mathrm e+\nu_e$$

## Bêta moins : un neutron devient proton

Un noyau trop riche en neutrons peut émettre un électron :

$$^{A}_{Z}\mathrm X\longrightarrow{}^{A}_{Z+1}\mathrm Y+{}^{0}_{-1}\mathrm e+\bar{\nu}_e$$

Au niveau microscopique :

$$^{1}_{0}\mathrm n\longrightarrow{}^{1}_{1}\mathrm p+{}^{0}_{-1}\mathrm e+\bar{\nu}_e$$

$A$ reste constant et $Z$ augmente de $1$. Exemple :

$$^{32}_{15}\mathrm P\longrightarrow{}^{32}_{16}\mathrm S+{}^{0}_{-1}\mathrm e+\bar{\nu}_e$$

Le positon ou l'électron émis n'était pas stocké dans le noyau : il est créé pendant la transformation. Le neutrino $\nu_e$ ou l'antineutrino $\bar{\nu}_e$ emporte une partie de l'énergie et de la quantité de mouvement.

## Gamma après bêta

Si le fils est excité :

$$^{A}_{Z}\mathrm Y^*\longrightarrow{}^{A}_{Z}\mathrm Y+{}^{0}_{0}\gamma$$

## Activité officielle complétée

$$^{14}_{6}\mathrm C\longrightarrow{}^{14}_{7}\mathrm N+{}^{0}_{-1}\mathrm e+\bar{\nu}_e$$

$$^{12}_{7}\mathrm N\longrightarrow{}^{12}_{6}\mathrm C+{}^{0}_{+1}\mathrm e+\nu_e$$

$$^{210}_{84}\mathrm{Po}\longrightarrow{}^{206}_{82}\mathrm{Pb}+{}^{4}_{2}\mathrm{He}$$

> **Mémoire.** En $\beta^-$, le signe de l'électron est négatif mais $Z$ du fils **augmente** : le neutron devient proton. En $\beta^+$, $Z$ diminue.`,
    keyPoint: "β⁺ : A constant, Z−1 ; β⁻ : A constant, Z+1 ; γ : A et Z constants.",
    example: "¹⁴₆C émet β⁻ : le fils garde A=14 et prend Z=7, donc ¹⁴₇N.",
    methodSteps: ["Repère β⁺ ou β⁻.", "Garde A inchangé.", "Pour β⁺, fais Z−1 ; pour β⁻, fais Z+1.", "Identifie le fils.", "Ajoute neutrino ou antineutrino pour l'écriture précise."],
    interaction: {
      kind: "schema",
      eyebrow: "Dans le noyau",
      title: "Voir ce qui change pendant une émission bêta",
      instruction: "Sélectionne les transformations pour suivre le nucléon et les particules créées.",
      observation: "Le total A ne change pas : seul un proton et un neutron échangent leur rôle.",
      viewBox: "0 0 600 270",
      caption: "Schéma original des transformations bêta et gamma.",
      shapes: [
        { shape: "circle", cx: 105, cy: 75, r: 35, tone: "fill" },
        { shape: "text", x: 105, y: 82, content: "p", anchor: "middle" },
        { shape: "line", x1: 145, y1: 75, x2: 265, y2: 75, tone: "accent" },
        { shape: "path", d: "M250 64 L268 75 L250 86 Z", tone: "accent" },
        { shape: "circle", cx: 315, cy: 75, r: 35, tone: "soft" },
        { shape: "text", x: 315, y: 82, content: "n", anchor: "middle" },
        { shape: "text", x: 440, y: 65, content: "e⁺ + νₑ", anchor: "middle" },
        { shape: "circle", cx: 105, cy: 195, r: 35, tone: "soft" },
        { shape: "text", x: 105, y: 202, content: "n", anchor: "middle" },
        { shape: "line", x1: 145, y1: 195, x2: 265, y2: 195, tone: "accent" },
        { shape: "path", d: "M250 184 L268 195 L250 206 Z", tone: "accent" },
        { shape: "circle", cx: 315, cy: 195, r: 35, tone: "fill" },
        { shape: "text", x: 315, y: 202, content: "p", anchor: "middle" },
        { shape: "text", x: 455, y: 185, content: "e⁻ + anti-νₑ", anchor: "middle" },
      ],
      hotspots: [
        { id: "plus", number: 1, label: "β⁺", detail: "p→n+e⁺+νₑ : Z diminue de 1.", x: 210, y: 45 },
        { id: "minus", number: 2, label: "β⁻", detail: "n→p+e⁻+anti-νₑ : Z augmente de 1.", x: 210, y: 165 },
        { id: "mass", number: 3, label: "A inchangé", detail: "Un nucléon change de nature ; le nombre total de nucléons reste le même.", x: 315, y: 135 },
        { id: "gamma", number: 4, label: "Puis γ ?", detail: "Si le fils est excité, il peut perdre son énergie sans modifier A ni Z.", x: 530, y: 135 },
      ],
    },
    questions: [
      choice("En β⁺, Z du fils vaut…", ["Z−1", "Z+1", "Z−2", "Z"], 0, "Un proton devient neutron.", "Page 3"),
      choice("En β⁻, Z du fils vaut…", ["Z+1", "Z−1", "Z−2", "Z"], 0, "Un neutron devient proton.", "Page 3"),
      choice("Pendant β⁺ ou β⁻, A…", ["reste constant", "diminue de 4", "augmente de 1", "devient nul"], 0, "Le nombre de nucléons ne change pas.", "Page 3"),
      choice("La transformation interne β⁺ est…", ["p→n+e⁺+νₑ", "n→p+e⁻+anti-νₑ", "p→p+γ", "n→α"], 0, "Un proton devient neutron.", "Correction scientifique"),
      choice("La transformation interne β⁻ est…", ["n→p+e⁻+anti-νₑ", "p→n+e⁺+νₑ", "n→n+γ", "p→α"], 0, "Un neutron devient proton.", "Correction scientifique"),
      choice("¹³₇N émet β⁺. Le fils est…", ["¹³₆C", "¹³₈O", "⁹₅B", "¹²₆C"], 0, "A constant, Z−1.", "Exemple page 3"),
      choice("³²₁₅P émet β⁻. Le fils est…", ["³²₁₆S", "³²₁₄Si", "²⁸₁₃Al", "³³₁₆S"], 0, "A constant, Z+1.", "Exemple page 3"),
      choice("Le neutrino associé à β⁺ est…", ["νₑ", "anti-νₑ", "α", "γ uniquement"], 0, "β⁺ émet un neutrino électronique.", "Précision"),
      choice("β⁻ émet avec l'électron…", ["un antineutrino électronique", "un positon", "un noyau d'hélium", "deux protons"], 0, "La particule neutre est anti-νₑ.", "Précision"),
      choice("Complète ¹⁴₆C→…+⁰₋₁e.", ["¹⁴₇N", "¹⁴₅B", "¹⁰₄Be", "¹⁴₆C"], 0, "C'est une émission β⁻.", "Activité page 4"),
      choice("Complète ¹²₇N→…+⁰₊₁e.", ["¹²₆C", "¹²₈O", "⁸₅B", "¹²₇N"], 0, "C'est une émission β⁺.", "Activité page 4"),
      short("Dans ²¹⁰₈₄Po→…+⁴₂He, donne A du fils.", ["206"], "210−4=206.", "Activité page 4"),
      short("Dans ²¹⁰₈₄Po→…+⁴₂He, donne Z du fils.", ["82"], "84−2=82.", "Activité page 4"),
      choice("Après une émission bêta, gamma peut être émis si…", ["le noyau fils est excité", "A devient négatif", "le noyau n'existe plus", "Z vaut toujours zéro"], 0, "Gamma désexcite le fils.", "Page 4"),
    ],
    corrections: [
      "Pages 3-4 : les neutrino et antineutrino cités dans le texte sont ajoutés aux équations, où ils étaient omis.",
      "Page 4 : la troisième activité utilise correctement ²¹⁰₈₄Po et ²⁰⁶₈₂Pb.",
    ],
  },
  {
    id: "spontaneous-nuclear-decay-law",
    title: "Établir la loi de décroissance radioactive",
    summary: "Passer du caractère aléatoire d'une désintégration à la loi exponentielle d'un grand échantillon.",
    pages: "4",
    section: "Loi de décroissance radioactive",
    durationMinutes: 25,
    xp: 95,
    body: String.raw`## Du hasard individuel à une loi collective

Il est impossible de prévoir l'instant où **un** noyau donné se désintégrera. En revanche, dans un échantillon contenant beaucoup de noyaux identiques, la probabilité de désintégration par unité de temps est constante.

Si $N(t)$ est le nombre de noyaux encore présents à la date $t$, la variation pendant $dt$ vérifie :

$$dN=-\lambda N\,dt$$

Le signe moins indique que $N$ diminue. La constante radioactive $\lambda>0$ caractérise le nucléide ; en unités SI, elle s'exprime en $\mathrm{s}^{-1}$.

## Intégration correcte

On sépare les variables :

$$\frac{dN}{N}=-\lambda\,dt$$

Entre $0$, où $N=N_0$, et $t$, où $N=N(t)$ :

$$\int_{N_0}^{N(t)}\frac{dN'}{N'}=-\lambda\int_0^t dt'$$

Donc :

$$\ln\left(\frac{N(t)}{N_0}\right)=-\lambda t$$

et finalement :

$$N(t)=N_0e^{-\lambda t}$$

Cette écriture conserve bien la condition initiale : pour $t=0$, $N(0)=N_0$.

> **Correction de rigueur.** Écrire directement $\ln N=-\lambda t$ oublie une constante. Le rapport $N/N_0$ rend le logarithme sans dimension et rétablit la condition initiale.

## Lire la loi

- $N(t)$ reste positif ;
- $N(t)$ diminue sans atteindre exactement zéro dans le modèle continu ;
- plus $\lambda$ est grande, plus la décroissance est rapide ;
- la fraction restante est indépendante de la quantité initiale :

$$\frac{N(t)}{N_0}=e^{-\lambda t}$$

Par exemple, si $\lambda=2{,}0\times10^{-3}\ \mathrm{s}^{-1}$ et $t=100\ \mathrm{s}$ :

$$\frac{N}{N_0}=e^{-0{,}2}\simeq0{,}819$$

Environ $81{,}9\,\%$ des noyaux restent et $18{,}1\,\%$ se sont désintégrés. Pour utiliser une unité de temps autre que la seconde, $\lambda$ doit être exprimée dans l'unité inverse correspondante.`,
    keyPoint: "dN=−λNdt conduit à N(t)=N₀e^(−λt) et ln(N/N₀)=−λt.",
    example: "Avec λ=0,002 s⁻¹ et t=100 s, N/N₀=e⁻⁰·²≈0,819.",
    methodSteps: ["Écris dN/N=−λdt.", "Intègre entre N₀ et N(t).", "Garde le rapport N/N₀ dans le logarithme.", "Vérifie λt sans unité.", "Interprète la fraction restante."],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe universelle",
      title: "Observer une décroissance exponentielle",
      instruction: "Déplace le point : l'abscisse est le nombre de demi-vies écoulées et l'ordonnée la fraction N/N₀.",
      observation: "La courbe reste positive et divise la population par deux à chaque unité de l'axe horizontal.",
      formula: "N/N₀ = 2^(−t/T)",
      formulaTex: String.raw`\frac{N}{N_0}=2^{-t/T}`,
      rule: { kind: "samples", points: decayCurvePoints },
      window: { xMin: 0, xMax: 5, yMin: 0, yMax: 1.05 },
      guides: [{ kind: "horizontal", value: 0.5, label: "N/N₀=1/2" }],
      marker: { min: 0, max: 5, step: 0.5, initial: 1 },
    },
    questions: [
      choice("L'instant de désintégration d'un noyau unique est…", ["aléatoire", "exactement prévisible", "toujours égal à T", "nul"], 0, "La loi est probabiliste.", "Page 4"),
      choice("Dans dN=−λNdt, le signe moins indique…", ["la diminution de N", "une constante négative", "une masse négative", "une augmentation"], 0, "N décroît.", "Page 4"),
      choice("L'unité SI de λ est…", ["s⁻¹", "s", "Bq·s", "kg"], 0, "λ est l'inverse d'un temps.", "Page 4"),
      choice("La solution correcte est…", ["N=N₀e⁻ˡᵃᵐᵇᵈᵃᵗ", "N=N₀eˡᵃᵐᵇᵈᵃᵗ", "N=N₀−λ", "N=λt"], 0, "L'exponentielle porte −λt.", "Page 4"),
      choice("À t=0, la loi donne…", ["N=N₀", "N=0", "N=λ", "N=e"], 0, "e⁰=1.", "Contrôle"),
      choice("La forme logarithmique correcte est…", ["ln(N/N₀)=−λt", "ln N=λt sans constante", "ln(N₀/N)=−λt", "N/N₀=−λt"], 0, "Le rapport rend le logarithme cohérent.", "Correction"),
      choice("Si λ augmente, la décroissance devient…", ["plus rapide", "plus lente", "constante", "impossible"], 0, "L'exposant négatif décroît plus vite.", "Interprétation"),
      short("Pour λ=0,01 s⁻¹ et t=100 s, donne λt.", ["1", "1,0"], "0,01×100=1.", "Application"),
      short("Pour λt=1, donne N/N₀ à 0,001 près.", ["0.368", "0,368", "0.3679", "0,3679"], "e⁻¹≈0,368.", "Application"),
      choice("Si N/N₀=0,80, la fraction désintégrée vaut…", ["0,20", "0,80", "1,80", "−0,20"], 0, "1−0,80=0,20.", "Application"),
      short("Avec N₀=1000 et N/N₀=0,80, combien de noyaux restent ?", ["800"], "N=0,80×1000=800.", "Application"),
      choice("Le produit λt doit être…", ["sans dimension", "en kilogrammes", "en becquerels", "en mètres"], 0, "L'exposant d'une exponentielle est sans unité.", "Contrôle d'unités"),
      choice("La courbe N(t)…", ["reste positive et décroît", "devient négative", "croît linéairement", "est périodique"], 0, "Une exponentielle positive décroissante.", "Lecture"),
      choice("La fraction N/N₀ dépend-elle de N₀ ?", ["non, pour un même λ et t", "oui, toujours proportionnellement", "seulement si N₀=0", "elle vaut N₀²"], 0, "Le rapport élimine N₀.", "Bilan"),
    ],
    corrections: [
      "Page 4 : l'intégration manquait la constante ; elle est conduite entre N₀ et N(t), donnant ln(N/N₀)=−λt.",
      "Page 4 : la dimension de λ et la cohérence de λt sont explicitées.",
    ],
  },
  {
    id: "spontaneous-nuclear-half-life-curve",
    title: "Déterminer la demi-vie d'un nucléide",
    summary: "Relier la période radioactive, la constante λ et les lectures graphiques successives.",
    pages: "4-5",
    section: "Période, demi-vie et courbe de décroissance",
    durationMinutes: 25,
    xp: 105,
    body: String.raw`## Définition

La **demi-vie**, notée $T$ dans le support et souvent $t_{1/2}$, est le temps nécessaire pour que la moitié des noyaux initiaux se soit désintégrée :

$$N(T)=\frac{N_0}{2}$$

Elle caractérise le nucléide et ne dépend ni de $N_0$ ni de l'âge déjà écoulé.

En remplaçant dans la loi exponentielle :

$$\frac{N_0}{2}=N_0e^{-\lambda T}$$

$$\frac12=e^{-\lambda T}\quad\Longrightarrow\quad \ln2=\lambda T$$

Ainsi :

$$T=\frac{\ln2}{\lambda}\qquad\text{et}\qquad\lambda=\frac{\ln2}{T}$$

## Divisions successives

Après $n$ demi-vies :

$$N(nT)=\frac{N_0}{2^n}$$

| Temps | Noyaux restants | Fraction désintégrée |
|---:|---:|---:|
| $0$ | $N_0$ | $0$ |
| $T$ | $N_0/2$ | $1/2$ |
| $2T$ | $N_0/4$ | $3/4$ |
| $3T$ | $N_0/8$ | $7/8$ |
| $4T$ | $N_0/16$ | $15/16$ |

La courbe du support permet de lire $T$ à l'intersection avec $N_0/2$, puis $2T$ avec $N_0/4$.

## Quelques échelles de temps

Le carbone 14 possède une demi-vie proche de $5{,}7\times10^3$ ans. Le soufre 30 a une demi-vie de l'ordre de quelques minutes. Les demi-vies couvrent donc des domaines immenses.

> **Correction factuelle.** Le tableau associe $4{,}5\times10^9$ ans à l'uranium 235. Cette valeur correspond approximativement à l'uranium 238. La demi-vie de $^{235}_{92}\mathrm U$ est proche de $7{,}0\times10^8$ ans.

## Retrouver T dans des données

Si un tableau donne $N/N_0=0{,}55$ à $120$ jours et $0{,}47$ à $150$ jours, la valeur $0{,}50$ est franchie entre ces dates :

$$120\ \mathrm{j}<T<150\ \mathrm{j}$$

Une estimation plus précise utilise la linéarisation $-\ln(N/N_0)=\lambda t$.`,
    keyPoint: "T=ln2/λ et N(nT)=N₀/2ⁿ.",
    example: "Après 3 demi-vies, il reste N₀/8, soit 12,5 % de l'échantillon initial.",
    methodSteps: ["Repère la fraction restante.", "Cherche une puissance de 1/2.", "Compte le nombre de demi-vies.", "Utilise T=ln2/λ si λ est connu.", "Vérifie l'unité de T."],
    interaction: {
      kind: "curve",
      eyebrow: "Lecture graphique",
      title: "Compter les demi-vies",
      instruction: "Déplace le point de 0 à 4 périodes et observe la division par deux.",
      observation: "À 2T il reste 1/4 ; à 3T, 1/8 ; la courbe ne coupe jamais l'axe horizontal.",
      formula: "N/N₀ = 2⁻ⁿ",
      formulaTex: String.raw`\frac{N(nT)}{N_0}=2^{-n}`,
      rule: { kind: "samples", points: halfLifePoints },
      window: { xMin: 0, xMax: 4, yMin: 0, yMax: 1.05 },
      guides: [
        { kind: "horizontal", value: 0.5, label: "1/2" },
        { kind: "horizontal", value: 0.25, label: "1/4" },
        { kind: "vertical", value: 1, label: "T" },
      ],
      marker: { min: 0, max: 4, step: 1, initial: 2 },
    },
    questions: [
      choice("La demi-vie est le temps au bout duquel…", ["il reste N₀/2", "il ne reste aucun noyau", "A est divisé par deux", "Z double"], 0, "La moitié des noyaux initiaux reste.", "Page 4"),
      choice("La demi-vie dépend-elle de N₀ ?", ["non", "oui proportionnellement", "seulement pour le carbone", "elle vaut N₀"], 0, "C'est une propriété du nucléide.", "Page 4"),
      choice("La relation correcte est…", ["T=ln2/λ", "T=λ/ln2", "T=λln2", "T=eˡᵃᵐᵇᵈᵃ"], 0, "ln2=λT.", "Page 4"),
      choice("La relation inverse est…", ["λ=ln2/T", "λ=T/ln2", "λ=2T", "λ=1/N₀"], 0, "On isole λ.", "Page 4"),
      choice("Après 2T, il reste…", ["N₀/4", "N₀/2", "3N₀/4", "N₀/8"], 0, "Deux divisions par deux.", "Page 5"),
      choice("Après 3T, il reste…", ["N₀/8", "N₀/6", "N₀/3", "7N₀/8"], 0, "2³=8.", "Application"),
      choice("Après 3T, la fraction désintégrée est…", ["7/8", "1/8", "3/8", "1/2"], 0, "1−1/8=7/8.", "Application"),
      short("Si T=10 jours, quel temps correspond à 4 demi-vies ?", ["40", "40 jours", "40 j"], "4T=40 jours.", "Application"),
      short("Si λ=0,01 s⁻¹, donne T en secondes à 0,1 près.", ["69.3", "69,3", "69.31", "69,31"], "T=ln2/0,01≈69,3 s.", "Application"),
      choice("La courbe de décroissance atteint-elle exactement zéro ?", ["non, dans le modèle continu", "oui à T", "oui à 2T", "elle devient négative"], 0, "L'exponentielle tend vers zéro.", "Lecture"),
      choice("La demi-vie approximative du carbone 14 est…", ["5,7×10³ ans", "5,7 s", "4,5×10⁹ min", "3 ans"], 0, "Valeur du support.", "Page 4"),
      choice("4,5×10⁹ ans correspond approximativement à…", ["l'uranium 238", "l'uranium 235", "le carbone 14", "le soufre 30"], 0, "Le tableau source attribue cette valeur au mauvais isotope.", "Correction"),
      choice("La demi-vie de l'uranium 235 est proche de…", ["7,0×10⁸ ans", "4,5×10⁹ ans", "3 min", "5,7×10³ s"], 0, "Valeur corrigée.", "Correction"),
      choice("Si 0,55 reste à 120 j et 0,47 à 150 j, T est…", ["entre 120 et 150 j", "inférieur à 40 j", "exactement 270 j", "supérieur à 1000 j"], 0, "La moitié est franchie entre les deux.", "Situation page 5"),
    ],
    corrections: [
      "Page 4 : la demi-vie 4,5×10⁹ ans est réattribuée à l'uranium 238 ; l'uranium 235 vaut environ 7,0×10⁸ ans.",
      "Pages 4-5 : la variable de temps est notée t et la demi-vie T pour éviter l'ambiguïté du tableau.",
    ],
  },
  {
    id: "spontaneous-nuclear-activity-dating",
    title: "Relier activité, nombre de noyaux et datation",
    summary: "Calculer l'activité d'un échantillon et transformer une mesure radioactive en âge.",
    pages: "5",
    section: "Activité d'une substance radioactive et application à la datation",
    durationMinutes: 24,
    xp: 115,
    body: String.raw`## Définition de l'activité

L'**activité** d'un échantillon est le nombre moyen de désintégrations par unité de temps. Elle est notée $\mathcal A$ pour ne pas la confondre avec le nombre de masse $A$ :

$$\mathcal A(t)=-\frac{dN}{dt}$$

Comme $dN/dt=-\lambda N$ :

$$\mathcal A(t)=\lambda N(t)$$

Son unité est le **becquerel** :

$$1\ \mathrm{Bq}=1\ \text{désintégration par seconde}$$

À $t=0$, $\mathcal A_0=\lambda N_0$. L'activité suit donc la même décroissance :

$$\mathcal A(t)=\mathcal A_0e^{-\lambda t}$$

et les rapports sont identiques :

$$\frac{\mathcal A(t)}{\mathcal A_0}=\frac{N(t)}{N_0}=e^{-\lambda t}$$

## Retrouver un âge

Si l'activité initiale de référence $\mathcal A_0$ et l'activité actuelle $\mathcal A$ sont connues :

$$t=\frac{1}{\lambda}\ln\left(\frac{\mathcal A_0}{\mathcal A}\right)$$

En utilisant $\lambda=\ln2/T$ :

$$t=\frac{T}{\ln2}\ln\left(\frac{\mathcal A_0}{\mathcal A}\right)$$

Si $\mathcal A/\mathcal A_0=1/4$, deux demi-vies se sont écoulées et $t=2T$.

## Démarche de datation

1. choisir un radionucléide dont la demi-vie convient à l'échelle recherchée ;
2. mesurer l'activité actuelle ;
3. comparer à une activité initiale ou une référence ;
4. calculer le rapport ;
5. déterminer l'âge avec la loi exponentielle.

Cette méthode suppose un système resté suffisamment fermé et une référence initiale justifiée. La radioactivité ne donne pas magiquement l'âge de tout objet : elle date un processus lié au radionucléide.

## Exemple

Un échantillon possède $\mathcal A_0=800\ \mathrm{Bq}$ et $\mathcal A=200\ \mathrm{Bq}$. Le rapport vaut $1/4=2^{-2}$ : l'âge est $2T$. Si $T=5730$ ans, alors :

$$t=11\,460\ \text{ans}$$

> **Unité.** Pour obtenir l'activité en Bq à partir de $\mathcal A=\lambda N$, exprime $\lambda$ en $\mathrm{s}^{-1}$.`,
    keyPoint: "𝒜=λN, 𝒜=𝒜₀e^(−λt) et t=(1/λ)ln(𝒜₀/𝒜).",
    example: "Une activité divisée par 4 indique deux demi-vies ; avec T=5730 ans, l'âge vaut 11 460 ans.",
    methodSteps: ["Distingue 𝒜 activité et A nombre de masse.", "Calcule le rapport 𝒜/𝒜₀.", "Reconnais une puissance de 1/2 ou utilise le logarithme.", "Vérifie l'unité de λ.", "Annonce l'âge avec son unité."],
    interaction: timeline(
      [
        { label: "Choisir le traceur", shortLabel: "Nucléide", detail: "Sa demi-vie doit correspondre à l'échelle de temps étudiée." },
        { label: "Mesurer", shortLabel: "𝒜", detail: "Le détecteur fournit une activité actuelle en becquerels." },
        { label: "Comparer", shortLabel: "𝒜/𝒜₀", detail: "Le rapport d'activités est aussi le rapport N/N₀." },
        { label: "Calculer", shortLabel: "ln", detail: "Utilise t=(1/λ)ln(𝒜₀/𝒜)." },
        { label: "Valider", shortLabel: "Hypothèses", detail: "Contrôle la référence initiale et le caractère fermé de l'échantillon." },
      ],
      "De la mesure au temps écoulé",
      "Ouvre chaque étape d'une datation radioactive.",
      "Une datation fiable combine mesure, modèle exponentiel et hypothèses sur l'échantillon.",
    ),
    questions: [
      choice("L'activité est…", ["le nombre de désintégrations par unité de temps", "le nombre de masse", "la charge du noyau", "la demi-vie"], 0, "C'est un taux de désintégration.", "Page 5"),
      choice("L'unité de l'activité est…", ["le becquerel", "la seconde", "le joule", "l'unité u"], 0, "Bq signifie désintégration par seconde.", "Page 5"),
      choice("La relation correcte est…", ["𝒜=λN", "𝒜=N/λ", "𝒜=λ/N", "𝒜=N+λ"], 0, "𝒜=−dN/dt=λN.", "Page 5"),
      choice("L'activité au cours du temps suit…", ["𝒜=𝒜₀e⁻ˡᵃᵐᵇᵈᵃᵗ", "𝒜=𝒜₀+λt", "𝒜=0 toujours", "𝒜=λt²"], 0, "Même loi exponentielle que N.", "Page 5"),
      choice("Le rapport 𝒜/𝒜₀ est égal à…", ["N/N₀", "N₀/N", "λt", "A/Z"], 0, "Le facteur λ se simplifie.", "Déduction"),
      short("Un échantillon subit 250 désintégrations par seconde. Donne son activité.", ["250 Bq", "250", "250 becquerels"], "1 Bq=1 désintégration/s.", "Application"),
      short("Si λ=0,02 s⁻¹ et N=5000, donne 𝒜 en Bq.", ["100", "100 Bq"], "𝒜=0,02×5000=100 Bq.", "Application"),
      choice("Si 𝒜/𝒜₀=1/2, le temps écoulé est…", ["T", "2T", "T/2", "0"], 0, "Une division par deux correspond à une demi-vie.", "Application"),
      choice("Si 𝒜/𝒜₀=1/8, le temps écoulé est…", ["3T", "8T", "T/3", "2T"], 0, "1/8=2⁻³.", "Application"),
      short("Pour T=20 ans et 𝒜/𝒜₀=1/4, donne l'âge.", ["40", "40 ans"], "Deux demi-vies donnent 40 ans.", "Application"),
      choice("La formule d'âge est…", ["t=(1/λ)ln(𝒜₀/𝒜)", "t=λln(𝒜/𝒜₀)", "t=𝒜₀−𝒜", "t=Nλ²"], 0, "On isole t dans l'exponentielle.", "Méthode"),
      choice("Pour calculer 𝒜 en Bq, λ doit être en…", ["s⁻¹", "jour", "kg", "MeV"], 0, "Bq est une seconde inverse.", "Unités"),
      choice("L'activité 𝒜 et le nombre de masse A…", ["sont deux grandeurs différentes", "sont toujours identiques", "s'expriment tous deux en Bq", "valent Z"], 0, "La calligraphie évite la confusion.", "Précision"),
      choice("Une datation radioactive suppose notamment…", ["une référence initiale justifiée", "que tout objet soit radioactif de la même façon", "que λ change chaque jour", "que N soit négatif"], 0, "Le modèle a des hypothèses.", "Complément"),
      choice("Si l'activité actuelle est plus faible, l'échantillon est en général…", ["plus ancien, toutes choses égales", "plus jeune", "plus massif nécessairement", "sans noyau"], 0, "L'activité décroît avec le temps.", "Bilan"),
    ],
    corrections: [
      "Page 5 : l'activité est notée 𝒜 dans le cours enrichi pour ne pas la confondre avec le nombre de masse A.",
      "La formule d'âge et les conditions d'une datation fiable sont explicitées à partir de la situation d'apprentissage.",
    ],
  },
  {
    id: "spontaneous-nuclear-polonium-mission",
    title: "Mission finale : caractériser le polonium 210",
    summary: "Résoudre fidèlement les sept tâches officielles : équation, énergie, encadrement, tracé, demi-vie et constante radioactive.",
    pages: "5-6",
    section: "Situation d'évaluation sur le polonium 210",
    durationMinutes: 32,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Données de la mission

Un échantillon de polonium 210 contient $N_0$ noyaux à l'origine. Les mesures sont :

| $t$ (jours) | 0 | 40 | 80 | 100 | 120 | 150 |
|---:|---:|---:|---:|---:|---:|---:|
| $N/N_0$ | 1 | 0,82 | 0,67 | 0,61 | 0,55 | 0,47 |

Le polonium 210 est émetteur $\alpha$. On donne :

$$m(^{210}_{84}\mathrm{Po})=209{,}9368\ \mathrm{u}$$

$$m(^{206}_{82}\mathrm{Pb})=205{,}9295\ \mathrm{u},\qquad m(\alpha)=4{,}00150\ \mathrm{u}$$

et $1\ \mathrm{u}\,c^2=931\ \mathrm{MeV}$.

> **Correction majeure du support.** Les mentions $^{107}_{84}\mathrm{Po}$ sont incompatibles avec l'énoncé, les masses et la question. Elles sont rétablies en $^{210}_{84}\mathrm{Po}$.

## 1. Équation de désintégration

$$^{210}_{84}\mathrm{Po}\longrightarrow{}^{206}_{82}\mathrm{Pb}+{}^{4}_{2}\mathrm{He}$$

## 2. Énergie libérée

Le défaut de masse est :

$$\Delta m=m_{\mathrm{Po}}-m_{\mathrm{Pb}}-m_\alpha$$

$$\Delta m=209{,}9368-205{,}9295-4{,}00150=0{,}0058\ \mathrm{u}$$

Donc :

$$Q=\Delta m c^2=0{,}0058\times931=5{,}3998\ \mathrm{MeV}$$

$$Q=5{,}3998\times10^6\ \mathrm{eV}\simeq5{,}40\ \mathrm{MeV}$$

## 3 et 4. Demi-vie et encadrement

La demi-vie est le temps pour atteindre $N/N_0=0{,}5$. Comme le rapport passe de $0{,}55$ à $120$ jours à $0{,}47$ à $150$ jours :

$$120\ \mathrm{j}<T<150\ \mathrm{j}$$

## 5. Linéarisation

On calcule $y=-\ln(N/N_0)$ :

| $t$ (j) | 0 | 40 | 80 | 100 | 120 | 150 |
|---:|---:|---:|---:|---:|---:|---:|
| $y$ | 0 | 0,1985 | 0,4005 | 0,4943 | 0,5978 | 0,7550 |

Or $y=\lambda t$ : les points s'alignent presque sur une droite passant par l'origine. L'ajustement contraint par l'origine donne :

$$\lambda\simeq4{,}998\times10^{-3}\ \mathrm{j}^{-1}$$

## 6 et 7. Période et constante

$$T=\frac{\ln2}{\lambda}\simeq138{,}7\ \mathrm{j}$$

Conversion en secondes :

$$\lambda=\frac{4{,}998\times10^{-3}}{86\,400}\simeq5{,}78\times10^{-8}\ \mathrm{s}^{-1}$$

Le résultat respecte bien l'encadrement lu dans le tableau. Une régression avec ordonnée à l'origine libre donne une valeur voisine ; la relation théorique impose toutefois $y(0)=0$.`,
    keyPoint: "Po-210→Pb-206+α ; Q≈5,40 MeV ; λ≈4,998×10⁻³ j⁻¹ et T≈138,7 j.",
    example: "La pente de −ln(N/N₀) en fonction de t vaut λ ; la demi-vie se déduit par T=ln2/λ.",
    methodSteps: ["Corrige le nucléide en Po-210.", "Équilibre A et Z.", "Calcule Δm puis Q.", "Transforme chaque rapport par −ln.", "Lis la pente λ.", "Calcule T et contrôle 120<T<150 jours."],
    interaction: {
      kind: "curve",
      eyebrow: "Laboratoire de données",
      title: "Linéariser la décroissance du polonium 210",
      instruction: "Déplace le point entre les six mesures de −ln(N/N₀).",
      observation: "Les points sont presque alignés sur y=0,0050t : la pente donne λ en jour⁻¹.",
      formula: "−ln(N/N₀) ≈ 0,0050 t",
      formulaTex: String.raw`-\ln\!\left(\frac{N}{N_0}\right)\simeq0{,}0050\,t`,
      rule: { kind: "samples", points: poloniumLinearizedPoints },
      window: { xMin: 0, xMax: 150, yMin: 0, yMax: 0.82 },
      guides: [{ kind: "oblique", slope: 0.004998, intercept: 0, label: "pente λ≈0,004998 j⁻¹" }],
      marker: { min: 0, max: 150, step: 10, initial: 120 },
    },
    questions: [
      choice("Le nucléide cohérent avec la mission est…", ["²¹⁰₈₄Po", "¹⁰⁷₈₄Po", "²¹⁰₁₀₇Po", "²⁰⁶₈₄Po"], 0, "L'énoncé, la masse et l'émission indiquent Po-210.", "Correction pages 5-6"),
      choice("Le noyau fils est…", ["²⁰⁶₈₂Pb", "²⁰⁶₈₃Bi", "²¹⁰₈₂Pb", "²¹⁴₈₆Rn"], 0, "A−4=206 et Z−2=82.", "Question 1"),
      choice("L'équation correcte est…", ["²¹⁰₈₄Po→²⁰⁶₈₂Pb+⁴₂He", "²¹⁰₈₄Po→²¹⁰₈₂Pb+⁰₂He", "²¹⁰₈₄Po→²⁰⁶₈₄Po+⁴₂He", "²¹⁰₈₄Po→²¹⁴₈₆Rn+⁴₂He"], 0, "A et Z sont conservés.", "Question 1"),
      short("Calcule le défaut de masse Δm en u.", ["0.0058", "0,0058", "0,0058 u"], "209,9368−205,9295−4,00150=0,0058 u.", "Question 2", 2),
      short("Calcule l'énergie Q en MeV à 0,01 près.", ["5.40", "5,40", "5.4", "5,4", "5,40 MeV"], "0,0058×931=5,3998 MeV.", "Question 2", 2),
      short("Donne Q en eV.", ["5.3998e6", "5,3998e6", "5,3998×10^6", "5,3998×10⁶", "5400000"], "5,3998 MeV=5,3998×10⁶ eV.", "Question 2"),
      choice("La demi-vie est le temps au bout duquel…", ["N=N₀/2", "N=0", "N=2N₀", "Z est divisé par deux"], 0, "Définition officielle.", "Question 3"),
      choice("Le tableau permet d'encadrer T par…", ["120 j<T<150 j", "0 j<T<40 j", "40 j<T<80 j", "T>300 j"], 0, "0,50 se trouve entre 0,55 et 0,47.", "Question 4"),
      short("Calcule −ln(0,82) à 4 décimales.", ["0.1985", "0,1985"], "−ln(0,82)=0,19845…", "Question 5"),
      short("Calcule −ln(0,67) à 4 décimales.", ["0.4005", "0,4005"], "−ln(0,67)=0,40048…", "Question 5"),
      short("Calcule −ln(0,61) à 4 décimales.", ["0.4943", "0,4943"], "−ln(0,61)=0,49430…", "Question 5"),
      short("Calcule −ln(0,55) à 4 décimales.", ["0.5978", "0,5978"], "−ln(0,55)=0,59784…", "Question 5"),
      short("Calcule −ln(0,47) à 4 décimales.", ["0.7550", "0,7550", "0.755"], "−ln(0,47)=0,75502…", "Question 5"),
      choice("Dans le graphe y=−ln(N/N₀) en fonction de t, la pente vaut…", ["λ", "T", "N₀", "1/λ²"], 0, "y=λt.", "Question 6"),
      short("Donne λ en jour⁻¹ à partir de l'ajustement.", ["0.004998", "0,004998", "4.998e-3", "4,998e-3", "0.005", "0,005"], "λ≈4,998×10⁻³ j⁻¹.", "Question 7", 2),
      short("Donne la demi-vie en jours à 0,1 près.", ["138.7", "138,7", "138.7 jours", "138,7 jours"], "T=ln2/λ≈138,7 j.", "Question 6", 2),
      short("Convertis λ en s⁻¹ à trois chiffres significatifs.", ["5.78e-8", "5,78e-8", "5,78×10^-8", "5,78×10⁻⁸"], "On divise la valeur en jour⁻¹ par 86400.", "Question 7", 2),
    ],
    corrections: [
      "Pages 5-6 : toutes les occurrences incohérentes de ¹⁰⁷₈₄Po sont rétablies en ²¹⁰₈₄Po ; le fils est ²⁰⁶₈₂Pb.",
      "Page 6 : l'énergie est recalculée explicitement à partir de Δm=0,0058 u, soit 5,3998 MeV.",
      "Page 5 : l'en-tête de temps est noté t (jours) afin de réserver T à la demi-vie.",
      "La pente contrainte par l'origine est calculée sur les six données : λ≈4,998×10⁻³ j⁻¹ et T≈138,7 j.",
    ],
  },
];

const levelOrder = [
  "spontaneous-nuclear-rutherford-structure",
  "spontaneous-nuclear-nuclides-isotopes-unit",
  "spontaneous-nuclear-emissions",
  "spontaneous-nuclear-conservation-alpha",
  "spontaneous-nuclear-beta-gamma-application",
  "spontaneous-nuclear-decay-law",
  "spontaneous-nuclear-half-life-curve",
  "spontaneous-nuclear-activity-dating",
  "spontaneous-nuclear-polonium-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau de réactions nucléaires spontanées introuvable : " + id);
  return officialLevel(index, level);
});

export const spontaneousNuclearPath: LearningPath = {
  id: "terminale-cd-spontaneous-nuclear",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Leçon 18 en Terminale C • Leçon 14 en Terminale D • Thème 5",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/7269-cours-de-redactions-nucleaires-spontanees/file",
  theme: { number: 5, title: "Réactions nucléaires" },
  chapterNumber: 18,
  chapterNumberByLevel: { "terminale-c": 18, "terminale-d": 14 },
  title: "Réactions nucléaires spontanées",
  description: "Décrire le noyau et les émissions radioactives, équilibrer les désintégrations, exploiter la loi exponentielle puis déterminer l'activité, la demi-vie et l'âge d'un échantillon.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Interpréter l'expérience de Rutherford et utiliser A, Z et N.",
    "Reconnaître un élément, un nucléide, des isotopes et l'unité u.",
    "Distinguer les émissions alpha, bêta plus, bêta moins et gamma.",
    "Équilibrer une équation nucléaire avec les deux lois de conservation.",
    "Établir et exploiter N(t)=N₀e^(−λt).",
    "Relier constante radioactive, demi-vie, activité et datation.",
    "Résoudre intégralement la situation officielle du polonium 210.",
  ],
  modules: [{
    id: "spontaneous-nuclear-mastery",
    title: "Maîtriser les réactions nucléaires spontanées",
    description: "Du modèle nucléaire à la datation, neuf niveaux fidèles aux six pages du support ivoirien.",
    lessons: builtLevels,
  }],
};

export const spontaneousNuclearPaths: LearningPath[] = [spontaneousNuclearPath];
