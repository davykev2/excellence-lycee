import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 16 de Physique en Terminale C. Le programme de Terminale D passe
// directement de la puissance alternative aux réactions nucléaires.
const sourceDocument = "Tle D PHY L16 Modèle ondulatoire de la lumière by Tehua.pdf";

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
      introduction: "Commence par identifier le phénomène, convertis toutes les longueurs en mètres, puis vérifie le sens de variation avant le calcul.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : petite ouverture → grande diffraction ; grande fréquence → petite longueur d’onde ; franges voisines → un interfrange.",
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

const diffractionWidthPoints: Array<[number, number]> = [50, 75, 100, 150, 200, 300, 500]
  .map((slitMicrometres): [number, number] => [
    slitMicrometres,
    Number((253.12 / slitMicrometres).toFixed(4)),
  ]);

const interferenceIntensityPoints: Array<[number, number]> = Array.from(
  { length: 81 },
  (_, index): [number, number] => {
    const positionMillimetres = -10 + index * 0.25;
    const intensity = Math.cos(Math.PI * positionMillimetres / 2.5) ** 2;
    return [positionMillimetres, Number(intensity.toFixed(4))];
  },
);

const wavelengthFrequencyPoints: Array<[number, number]> = [3.75, 4, 4.5, 5, 5.45, 6, 7, 7.14, 7.5]
  .map((frequencyUnit): [number, number] => [frequencyUnit, Number((3000 / frequencyUnit).toFixed(3))]);

const levels: LevelSeed[] = [
  {
    id: "wave-light-diffraction-observation",
    title: "Reconnaître la diffraction de la lumière",
    summary: "Observer l’étalement d’un faisceau par une fente ou un trou et comprendre pourquoi ce phénomène révèle le caractère ondulatoire de la lumière.",
    pages: "1, 8-9",
    section: "II.1 Phénomène de diffraction et IV.1 Documentation",
    durationMinutes: 24,
    xp: 45,
    kind: "concept",
    body: String.raw`## Du rayon lumineux à l’onde

Dans un milieu homogène, le modèle géométrique prévoit une propagation rectiligne de la lumière. On pourrait donc penser qu’une ouverture très étroite découpe simplement un faisceau encore plus fin. L’expérience montre autre chose : après la fente ou le trou, la lumière **s’étale** et forme une figure plus large que l’ouverture.

Ce phénomène s’appelle la **diffraction**. Il est caractéristique des ondes et constitue un indice expérimental du caractère ondulatoire de la lumière.

## Quand la diffraction devient-elle visible ?

La diffraction est marquée lorsque la dimension caractéristique $a$ de l’ouverture ou de l’obstacle est comparable à la longueur d’onde $\lambda$ :

$$a\lesssim \text{quelques }\lambda$$

Le rapport décisif est donc $a/\lambda$ :

- si $a/\lambda$ est très grand, l’étalement est faible et le modèle du rayon reste une bonne approximation ;
- si $a/\lambda$ diminue, la figure s’élargit ;
- à longueur d’onde fixée, **plus la fente est petite, plus la diffraction est importante**.

## Fente et trou circulaire

Pour une fente fine, le demi-angle entre l’axe et la première extinction vérifie, aux petits angles :

$$\boxed{\theta_c\simeq\frac{\lambda}{a}}$$

Pour un trou circulaire de diamètre $a$, la première extinction de la tache d’Airy vérifie :

$$\boxed{\theta_c\simeq1{,}22\frac{\lambda}{a}}$$

Le coefficient $1{,}22$ dépend de la géométrie circulaire. Il ne doit pas être ajouté à la formule de la fente.

## Ce que l’on observe sur l’écran

- une fente donne une large tache centrale, entourée de taches latérales moins lumineuses ;
- un trou circulaire donne une tache centrale entourée d’anneaux ;
- l’orientation de l’étalement est perpendiculaire à la petite dimension de l’ouverture.

La diffraction ne signifie pas que la lumière cesse de se propager en ligne droite partout. Elle montre que la propagation rectiligne est une approximation qui perd sa précision lorsque les dimensions deviennent proches de $\lambda$.

> **Correction de classement.** La couverture du support annonce « Réactions nucléaires ». La progression officielle classe cette leçon dans le thème **La lumière : onde ou particule**.` ,
    keyPoint: "Diffraction marquée si a est de l’ordre de λ ; fente : θc≈λ/a ; trou : θc≈1,22λ/a.",
    example: "Si la largeur d’une fente est divisée par 2 à λ fixée, l’écart angulaire est multiplié par 2.",
    methodSteps: [
      "Repère l’ouverture ou l’obstacle de dimension a.",
      "Identifie la longueur d’onde λ de la radiation.",
      "Compare a à λ sans oublier les unités.",
      "Choisis θc≈λ/a pour une fente et 1,22λ/a pour un trou.",
      "Interprète le résultat : plus θc est grand, plus la figure s’étale.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Expérience",
      title: "Une fente transforme le faisceau",
      instruction: "Sélectionne les repères pour suivre le faisceau depuis le laser jusqu’à la figure de diffraction.",
      observation: "La fente ne découpe pas un rayon : elle produit une tache centrale élargie et des taches secondaires.",
      caption: "Schéma pédagogique original d’une diffraction par une fente, sans reprise de l’illustration du PDF.",
      viewBox: "0 0 540 250",
      shapes: [
        { shape: "path", d: "M30 105 H105 V145 H30 Z", tone: "soft" },
        { shape: "text", x: 68, y: 130, content: "LASER", anchor: "middle" },
        { shape: "line", x1: 105, y1: 125, x2: 220, y2: 125, tone: "accent" },
        { shape: "line", x1: 220, y1: 45, x2: 220, y2: 113, tone: "outline" },
        { shape: "line", x1: 220, y1: 137, x2: 220, y2: 205, tone: "outline" },
        { shape: "line", x1: 220, y1: 113, x2: 470, y2: 60, tone: "muted" },
        { shape: "line", x1: 220, y1: 137, x2: 470, y2: 190, tone: "muted" },
        { shape: "line", x1: 470, y1: 28, x2: 470, y2: 222, tone: "outline" },
        { shape: "path", d: "M470 66 H500 V184 H470 Z", tone: "accent" },
        { shape: "path", d: "M470 42 H486 V61 H470 Z M470 189 H486 V208 H470 Z", tone: "soft" },
        { shape: "text", x: 220, y: 228, content: "fente a", anchor: "middle" },
        { shape: "text", x: 470, y: 244, content: "écran", anchor: "middle" },
      ],
      hotspots: [
        { id: "laser", number: 1, label: "Source monochromatique", detail: "Le laser fournit une radiation de fréquence et de longueur d’onde bien définies.", x: 70, y: 95 },
        { id: "slit", number: 2, label: "Fente de largeur a", detail: "Quand a devient proche de λ, chaque point de l’ouverture contribue à l’onde diffractée.", x: 220, y: 125 },
        { id: "spread", number: 3, label: "Écart angulaire", detail: "Pour une fente, la première extinction est observée vers θc≈λ/a.", x: 345, y: 92 },
        { id: "screen", number: 4, label: "Tache centrale", detail: "Elle est deux fois plus large angulairement que le demi-angle θc et domine les taches latérales.", x: 485, y: 125 },
      ],
    },
    questions: [
      choice("Le phénomène d’étalement de la lumière derrière une petite ouverture s’appelle…", ["la diffraction", "la conduction", "la réfraction seulement", "la polarisation thermique"], 0, "L’étalement derrière une petite ouverture est la diffraction.", "II.1 Définition"),
      choice("La diffraction est surtout marquée lorsque…", ["a est comparable à λ", "a est infinie", "λ vaut zéro", "la lumière est immobile"], 0, "Le rapport a/λ doit être suffisamment petit.", "II.1 Condition"),
      choice("À λ fixée, si la fente devient plus étroite, la tache centrale…", ["s’élargit", "rétrécit", "disparaît toujours", "ne change jamais"], 0, "θc≈λ/a augmente lorsque a diminue.", "Documentation"),
      choice("La diffraction met principalement en défaut…", ["la propagation strictement rectiligne à petite échelle", "la conservation de l’énergie", "la valeur de c dans le vide", "la notion de fréquence"], 0, "Le modèle du rayon devient insuffisant près d’une petite ouverture.", "IV.1 Remarques"),
      short("Pour une fente, complète θc≈…", ["λ/a", "lambda/a", "l/a"], "Pour une fente, θc≈λ/a.", "IV Retour sur la diffraction"),
      short("Pour un trou circulaire, quel coefficient multiplie λ/a ?", ["1.22", "1,22"], "La tache d’Airy conduit au coefficient 1,22.", "Page 9"),
      choice("Une fente verticale diffracte principalement la lumière…", ["horizontalement", "verticalement seulement", "sans aucune direction", "vers la source uniquement"], 0, "L’étalement principal est perpendiculaire à la petite dimension de la fente.", "Interprétation"),
      choice("Une ouverture circulaire produit idéalement…", ["une tache centrale et des anneaux", "une seule droite", "un carré uniforme", "aucune lumière"], 0, "La symétrie circulaire conduit à une tache d’Airy et des anneaux.", "Page 1"),
      choice("Dans θc≈λ/a, θc s’exprime en…", ["radians", "mètres", "hertz", "joules"], 0, "Un angle petit est exprimé en radians.", "Page 9"),
      choice("Si a est multipliée par 4, θc est…", ["divisé par 4", "multiplié par 4", "multiplié par 16", "inchangé"], 0, "θc est inversement proportionnel à a.", "Relation de diffraction"),
      short("Une fente de 0,20 mm est-elle beaucoup plus grande qu’une lumière de 600 nm ? Donne le rapport a/λ arrondi.", ["333", "333.3", "333,3", "environ 333", "≈333"], "0,20 mm/600 nm≈333 : la diffraction reste mesurable mais l’angle est petit.", "Application"),
      choice("Le thème correct de cette leçon est…", ["La lumière : onde ou particule", "Réactions acido-basiques", "Mécanique céleste", "Thermodynamique"], 0, "La mention nucléaire de la couverture est une coquille de classement.", "Correction éditoriale"),
      choice("Le modèle ondulatoire est justifié ici par…", ["une observation expérimentale", "une convention sans expérience", "la masse de la lumière", "la tension électrique"], 0, "La figure de diffraction est l’indice expérimental central.", "Bilan"),
    ],
    corrections: [
      "Page 1 : le thème « Réactions nucléaires » est remplacé par le thème officiel « La lumière : onde ou particule ».",
      "Page 9 : les notations q et lo mal rendues sont normalisées en θc et λ0 ; le coefficient 1,22 est réservé au trou circulaire.",
    ],
  },
  {
    id: "wave-light-diffraction-geometry",
    title: "Relier la largeur de la tache à λ, a et D",
    summary: "Passer de l’écart angulaire à la largeur mesurée sur l’écran et exploiter la proportionnalité L=2Dλ/a.",
    pages: "4-7, 9",
    section: "Géométrie de la diffraction et exercice expérimental",
    durationMinutes: 26,
    xp: 55,
    kind: "graph",
    body: String.raw`## Géométrie de la tache centrale

Une fente de largeur $a$ est éclairée par une lumière monochromatique de longueur d’onde $\lambda$. L’écran est placé à une distance $D$ très grande devant $a$. La moitié de la tache centrale est vue sous l’angle $\theta_c$.

La géométrie donne :

$$\tan\theta_c=\frac{L/2}{D}=\frac{L}{2D}$$

Lorsque $\theta_c$ est petit et exprimé en radians :

$$\tan\theta_c\simeq\theta_c$$

Or la diffraction par une fente fournit $\theta_c\simeq\lambda/a$. On combine les deux relations :

$$\frac{L}{2D}\simeq\frac{\lambda}{a}$$

donc :

$$\boxed{L\simeq\frac{2D\lambda}{a}}$$

## Lire les dépendances avant de calculer

| Grandeur modifiée | Conséquence sur $L$ |
|---|---|
| $D$ multipliée par $k$ | $L$ multipliée par $k$ |
| $\lambda$ multipliée par $k$ | $L$ multipliée par $k$ |
| $a$ multipliée par $k$ | $L$ divisée par $k$ |

Cette lecture qualitative détecte beaucoup d’erreurs : une fente plus petite ne peut pas donner une tache plus petite.

## Exercice expérimental fidèle

Le support fournit $a=0{,}10$ mm, $\lambda=632{,}8$ nm et $D=2{,}0$ m. On convertit :

$$a=1{,}0\times10^{-4}\ \text{m},\qquad \lambda=6{,}328\times10^{-7}\ \text{m}$$

L’écart angulaire vaut :

$$\theta_c\simeq\frac{6{,}328\times10^{-7}}{1{,}0\times10^{-4}}
=6{,}328\times10^{-3}\ \text{rad}$$

La largeur centrale vaut :

$$L\simeq\frac{2\times2{,}0\times6{,}328\times10^{-7}}{1{,}0\times10^{-4}}
=2{,}5312\times10^{-2}\ \text{m}$$

soit :

$$\boxed{L\simeq2{,}53\ \text{cm}}$$

## Isoler n’importe quelle grandeur

À partir de $L=2D\lambda/a$ :

$$\boxed{\lambda=\frac{aL}{2D}},\qquad
\boxed{a=\frac{2D\lambda}{L}},\qquad
\boxed{D=\frac{aL}{2\lambda}}$$

Avant de remplacer, vérifie que $a$, $L$, $D$ et $\lambda$ sont tous exprimés en mètres. Le résultat de $\theta_c$ est sans dimension et s’exprime en radians.

> **Correction d’unité.** L’énoncé de la page 6 écrit $a=0{,}10$ nm, mais son schéma, son calcul et le résultat exigent $a=0{,}10$ **mm**. Avec 0,10 nm, la formule donnerait un angle impossible dans l’approximation des petits angles.` ,
    keyPoint: "L≈2Dλ/a ; donc λ=aL/(2D), avec toutes les longueurs en mètres.",
    example: "a=0,10 mm, λ=632,8 nm et D=2,0 m donnent θc≈6,328×10⁻³ rad et L≈2,53 cm.",
    methodSteps: [
      "Convertis a et λ en mètres.",
      "Écris tan θc=L/(2D).",
      "Utilise tan θc≈θc pour un petit angle.",
      "Remplace θc par λ/a.",
      "Calcule puis contrôle le sens de variation de L.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Laboratoire virtuel",
      title: "La tache s’élargit quand la fente rétrécit",
      instruction: "Déplace le point : l’abscisse est la largeur a en µm et l’ordonnée la largeur L en cm pour λ=632,8 nm et D=2 m.",
      observation: "La courbe décroît : doubler a divise L par deux.",
      formula: "L(cm)=253,12/a(µm)",
      formulaTex: "L=\\frac{253{,}12}{a}",
      rule: { kind: "samples", points: diffractionWidthPoints },
      window: { xMin: 40, xMax: 520, yMin: 0, yMax: 5.5 },
      guides: [{ kind: "vertical", value: 100, label: "a=100 µm" }, { kind: "horizontal", value: 2.5312, label: "L=2,53 cm" }],
      marker: { min: 50, max: 500, step: 25, initial: 100 },
    },
    questions: [
      choice("La relation géométrique exacte avant approximation est…", ["tan θc=L/(2D)", "tan θc=2D/L", "tan θc=a/λ", "tan θc=LD"], 0, "La moitié de la tache est L/2 à la distance D.", "Géométrie"),
      choice("Pour un petit angle exprimé en radians…", ["tan θ≈θ", "tan θ≈1/θ", "tan θ≈θ²", "tan θ=0 toujours"], 0, "L’approximation des petits angles permet la dérivation.", "Approximation"),
      short("Donne l’expression de L pour une fente.", ["2Dλ/a", "2dλ/a", "2*D*lambda/a", "2Dl/a"], "L≈2Dλ/a.", "Pages 5-6"),
      choice("À a et λ fixés, L est…", ["proportionnelle à D", "inversement proportionnelle à D", "indépendante de D", "égale à D²"], 0, "L=2Dλ/a.", "Proportionnalité"),
      choice("À D et λ fixés, L est…", ["inversement proportionnelle à a", "proportionnelle à a", "égale à a²", "indépendante de a"], 0, "La largeur a est au dénominateur.", "Proportionnalité"),
      short("Convertis 0,10 mm en mètres.", ["0.0001", "0,0001", "1e-4", "10^-4", "1×10^-4 m", "10⁻⁴ m"], "0,10 mm=1,0×10⁻⁴ m.", "Conversion"),
      short("Convertis 632,8 nm en mètres.", ["6.328e-7", "6,328e-7", "6.328×10^-7", "6,328×10^-7", "6.328×10⁻⁷ m", "6,328×10⁻⁷ m"], "632,8 nm=6,328×10⁻⁷ m.", "Conversion"),
      short("Calcule θc pour a=0,10 mm et λ=632,8 nm.", ["0.006328", "0,006328", "6.328e-3", "6,328e-3", "6.328×10^-3 rad", "6,328×10⁻³ rad"], "θc=λ/a=6,328×10⁻³ rad.", "Exercice expérimental", 2),
      short("Calcule L en centimètres pour D=2,0 m.", ["2.53", "2,53", "2.5312", "2,5312", "2.53 cm", "2,53 cm"], "L=2Dλ/a=0,025312 m=2,5312 cm.", "Exercice expérimental", 2),
      choice("L’unité 0,10 nm imprimée dans l’énoncé est…", ["une coquille : il faut lire 0,10 mm", "correcte sans réserve", "équivalente à 0,10 mm", "une fréquence"], 0, "Le calcul officiel emploie 0,10×10⁻³ m.", "Correction source"),
      short("Isole λ dans L=2Dλ/a.", ["aL/(2D)", "a*l/(2*d)", "aL/2D"], "λ=aL/(2D).", "Méthode inverse"),
      short("Isole a dans L=2Dλ/a.", ["2Dλ/L", "2*d*lambda/l", "2Dl/L"], "a=2Dλ/L.", "Méthode inverse"),
      choice("Si D et a sont doublés ensemble, L…", ["reste inchangée", "double", "est divisée par deux", "est multipliée par quatre"], 0, "Le rapport D/a reste constant.", "Contrôle de proportion"),
    ],
    corrections: [
      "Page 6 : la largeur de fente « 0,10 nm » est corrigée en 0,10 mm, unité effectivement utilisée dans la solution.",
      "Page 7 : le résultat est conservé avec davantage de précision, L=2,5312×10⁻² m≈2,53 cm.",
    ],
  },
  {
    id: "wave-light-young-interference",
    title: "Comprendre les interférences de Young",
    summary: "Faire naître deux sources cohérentes à partir d’une même lumière et interpréter l’alternance régulière des franges brillantes et sombres.",
    pages: "1-2",
    section: "II.2 Interférences lumineuses et fentes d’Young",
    durationMinutes: 25,
    xp: 65,
    kind: "concept",
    body: String.raw`## Pourquoi deux fentes ?

Une source monochromatique $S$ éclaire deux ouvertures très fines $S_1$ et $S_2$, séparées par la distance $a$. Chaque ouverture diffracte la lumière et se comporte comme une source secondaire. Les deux ondes se superposent ensuite sur un écran situé à la distance $D$.

On observe une alternance de franges brillantes et sombres. Cette figure ne résulte pas de deux faisceaux indépendants quelconques : $S_1$ et $S_2$ sont alimentées par la **même source**, ce qui maintient une différence de phase stable. On les qualifie de sources cohérentes.

## Le principe de superposition

Au point $P$, les amplitudes des deux ondes s’ajoutent :

$$s(P,t)=s_1(P,t)+s_2(P,t)$$

Deux cas remarquables apparaissent :

- les ondes arrivent en phase : les amplitudes s’ajoutent, l’intensité est maximale et la frange est brillante ;
- les ondes arrivent en opposition de phase : les amplitudes se compensent, l’intensité est minimale et la frange est sombre.

La différence ne vient pas d’une vitesse différente : dans le même milieu, les deux ondes ont la même fréquence et la même célérité. Elle vient des **distances parcourues**, $S_1P$ et $S_2P$.

## Conditions pratiques d’observation

Pour obtenir une figure stable :

1. la lumière doit être suffisamment monochromatique ;
2. les deux ondes doivent provenir de la même source ;
3. les deux faisceaux doivent se recouvrir sur l’écran ;
4. les fentes doivent être fines pour diffracter la lumière ;
5. la différence de phase doit rester stable pendant l’observation.

## La frange centrale

Au centre $O$ de l’écran, situé sur la médiatrice de $S_1S_2$ :

$$S_1O=S_2O$$

La différence de marche est nulle. Les deux ondes arrivent en phase : la frange centrale est brillante dans le montage idéal.

## Diffraction et interférence ne sont pas synonymes

- la diffraction explique que chaque fente envoie de la lumière dans plusieurs directions ;
- l’interférence explique l’alternance claire-sombre quand les deux ondes diffractées se superposent.

Une figure réelle de Young combine donc les deux phénomènes : des franges fines d’interférence se trouvent sous une enveloppe plus large de diffraction.

> **Précision.** Dire seulement « deux ondes de même fréquence se superposent » ne garantit pas des franges stables. Il faut aussi une différence de phase constante, assurée ici par la source commune.` ,
    keyPoint: "Deux sources cohérentes issues de la même source produisent des franges : en phase → brillante ; opposition de phase → sombre.",
    example: "Au centre O, S1O=S2O : δ=0, donc la frange centrale est brillante.",
    methodSteps: [
      "Identifie la source commune S puis les deux sources secondaires S1 et S2.",
      "Vérifie que les deux ondes se recouvrent sur l’écran.",
      "Compare les distances S1P et S2P.",
      "Relie une arrivée en phase à une frange brillante.",
      "Relie une opposition de phase à une frange sombre.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Fentes d’Young",
      title: "Deux chemins vers un même point P",
      instruction: "Sélectionne les repères pour comprendre comment la source unique engendre deux ondes cohérentes.",
      observation: "Les deux chemins n’ont pas toujours la même longueur : cette différence commande l’éclairement en P.",
      caption: "Schéma original du montage de Young.",
      viewBox: "0 0 560 280",
      shapes: [
        { shape: "circle", cx: 45, cy: 140, r: 8, tone: "accent" },
        { shape: "text", x: 45, y: 122, content: "S", anchor: "middle" },
        { shape: "line", x1: 53, y1: 140, x2: 205, y2: 95, tone: "muted" },
        { shape: "line", x1: 53, y1: 140, x2: 205, y2: 185, tone: "muted" },
        { shape: "line", x1: 205, y1: 35, x2: 205, y2: 82, tone: "outline" },
        { shape: "line", x1: 205, y1: 108, x2: 205, y2: 172, tone: "outline" },
        { shape: "line", x1: 205, y1: 198, x2: 205, y2: 245, tone: "outline" },
        { shape: "circle", cx: 205, cy: 95, r: 5, tone: "accent" },
        { shape: "circle", cx: 205, cy: 185, r: 5, tone: "accent" },
        { shape: "text", x: 185, y: 91, content: "S1", anchor: "end" },
        { shape: "text", x: 185, y: 190, content: "S2", anchor: "end" },
        { shape: "line", x1: 210, y1: 95, x2: 505, y2: 70, tone: "accent" },
        { shape: "line", x1: 210, y1: 185, x2: 505, y2: 70, tone: "accent" },
        { shape: "line", x1: 505, y1: 25, x2: 505, y2: 255, tone: "outline" },
        { shape: "circle", cx: 505, cy: 70, r: 6, tone: "soft" },
        { shape: "text", x: 525, y: 74, content: "P", anchor: "start" },
        { shape: "text", x: 355, y: 56, content: "S1P", anchor: "middle" },
        { shape: "text", x: 360, y: 146, content: "S2P", anchor: "middle" },
      ],
      hotspots: [
        { id: "primary", number: 1, label: "Source S", detail: "La source unique impose la même fréquence et une relation de phase stable aux deux voies.", x: 45, y: 140 },
        { id: "slit-one", number: 2, label: "Source S1", detail: "La première fente diffracte l’onde incidente vers l’écran.", x: 205, y: 95 },
        { id: "slit-two", number: 3, label: "Source S2", detail: "La seconde fente émet une onde cohérente avec celle issue de S1.", x: 205, y: 185 },
        { id: "point-p", number: 4, label: "Point P", detail: "L’état brillant ou sombre dépend de δ=S2P−S1P.", x: 505, y: 70 },
      ],
    },
    questions: [
      choice("Dans le montage de Young, S1 et S2 se comportent comme…", ["deux sources secondaires cohérentes", "deux résistances", "deux miroirs sans onde", "deux générateurs indépendants quelconques"], 0, "Les fentes diffractent la même onde incidente.", "II.2 Interprétation"),
      choice("Pourquoi utilise-t-on une source commune ?", ["Pour garder une différence de phase stable", "Pour annuler toute fréquence", "Pour chauffer l’écran", "Pour supprimer la diffraction"], 0, "La cohérence temporelle permet des franges stables.", "Précision"),
      choice("Une frange brillante correspond à des ondes…", ["en phase", "toujours perpendiculaires", "de fréquences nulles", "absorbées"], 0, "Les amplitudes s’ajoutent constructivement.", "Superposition"),
      choice("Une frange sombre correspond idéalement à…", ["une opposition de phase", "une vitesse infinie", "une absence de source", "une longueur d’onde nulle"], 0, "Les amplitudes se compensent.", "Superposition"),
      short("Au centre O, quelle est la différence de marche ?", ["0", "zéro", "0 m"], "S1O=S2O donc δ=0.", "Frange centrale"),
      choice("La frange centrale idéale est…", ["brillante", "toujours sombre", "invisible par définition", "aléatoire"], 0, "δ=0 est une condition constructive.", "Frange centrale"),
      choice("La diffraction de chaque fente sert à…", ["faire recouvrir les deux ondes sur l’écran", "empêcher toute lumière d’atteindre l’écran", "changer la masse de la lumière", "créer un courant continu"], 0, "L’étalement permet la superposition des faisceaux.", "Rôle de la diffraction"),
      choice("Deux lasers indépendants de même couleur donnent facilement des franges stables ?", ["Non, leur phase relative fluctue", "Oui, toujours", "Oui, même éteints", "Seulement si D=0"], 0, "La même fréquence ne suffit pas sans cohérence de phase.", "Cohérence"),
      choice("La figure réelle de Young combine…", ["diffraction et interférences", "réfraction et radioactivité", "gravitation et conduction", "fusion et fission"], 0, "Chaque fente diffracte, puis les deux ondes interfèrent.", "Bilan"),
      choice("La grandeur qui compare les deux chemins est…", ["la différence de marche", "la masse volumique", "la puissance active", "le pH"], 0, "Elle vaut δ=S2P−S1P selon la convention du support.", "Annonce du niveau suivant"),
      short("Écris la relation de superposition des amplitudes en P.", ["s=s1+s2", "s(P,t)=s1(P,t)+s2(P,t)", "s1+s2"], "Les amplitudes s’additionnent au point P.", "Principe de superposition"),
      choice("Si les deux faisceaux ne se recouvrent pas…", ["on ne voit pas de franges d’interférence", "les franges sont plus nombreuses", "δ vaut toujours λ", "la fréquence double"], 0, "L’interférence nécessite une superposition spatiale.", "Condition pratique"),
      choice("Le rôle de l’écran est de…", ["rendre visible la répartition d’intensité", "rendre les sources incohérentes", "créer la longueur d’onde", "modifier c dans le vide"], 0, "L’écran matérialise les maxima et minima d’intensité.", "Observation"),
      choice("Les deux ondes issues de S1 et S2 ont…", ["la même fréquence", "nécessairement deux couleurs", "des célérités opposées", "une énergie nulle"], 0, "Elles proviennent de la même lumière monochromatique.", "II.2"),
    ],
    corrections: [
      "Page 2 : la définition est complétée par la condition de cohérence, indispensable à une figure d’interférences stable.",
    ],
  },
  {
    id: "wave-light-path-difference-fringes",
    title: "Calculer différence de marche et interfrange",
    summary: "Passer de δ aux positions des franges constructives ou destructives, puis exploiter i=λD/a sans confondre rang et distance.",
    pages: "2, 4",
    section: "II.3 Différence de marche et exercice 1",
    durationMinutes: 28,
    xp: 75,
    kind: "graph",
    body: String.raw`## Différence de marche

Au point $P$ d’ordonnée $y$, les deux ondes ont parcouru les distances $S_1P$ et $S_2P$. Avec la convention du support :

$$\boxed{\delta=S_2P-S_1P}$$

Lorsque l’écran est loin devant l’écartement des fentes ($D\gg a$) et que $|y|\ll D$ :

$$\boxed{\delta\simeq\frac{ay}{D}}$$

Changer l’orientation de l’axe peut changer le signe de $\delta$, mais l’éclairement dépend de la phase relative ; les positions symétriques $y$ et $-y$ ont le même type de frange.

## Franges brillantes

Les interférences sont constructives si la différence de marche est un nombre entier de longueurs d’onde :

$$\delta=k\lambda,\qquad k\in\mathbb Z$$

La position de la frange brillante d’ordre $k$ vaut :

$$\boxed{y_k=k\frac{\lambda D}{a}}$$

## Franges sombres

Les interférences sont destructives si :

$$\delta=\left(k+\frac12\right)\lambda
=\frac{(2k+1)\lambda}{2}$$

La position d’une frange sombre vaut :

$$\boxed{y_k^{(s)}=\left(k+\frac12\right)\frac{\lambda D}{a}}$$

## Interfrange

La distance entre deux franges brillantes consécutives, ou deux franges sombres consécutives, est :

$$\boxed{i=\frac{\lambda D}{a}}$$

Ainsi :

- les brillantes sont aux positions $y=ki$ ;
- les sombres sont aux positions $y=(k+1/2)i$ ;
- une brillante et la sombre voisine sont séparées de $i/2$.

## Exercice 1 : troisième brillante

$a=0{,}2$ mm, $D=1$ m et la troisième brillante est à $7{,}5$ mm du centre. Avec $k=3$ :

$$i=\frac{7{,}5}{3}=2{,}5\ \text{mm}$$

Puis :

$$\lambda=\frac{ai}{D}
=\frac{0{,}2\times10^{-3}\times2{,}5\times10^{-3}}{1}
=\boxed{5{,}0\times10^{-7}\ \text{m}=500\ \text{nm}}$$

## Exercice 1 : troisième sombre

En comptant la première sombre à $i/2$, la troisième sombre est à $2{,}5i$ :

$$i=\frac{7{,}5}{2{,}5}=3{,}0\ \text{mm}$$

$$\lambda=\frac{ai}{D}
=\boxed{6{,}0\times10^{-7}\ \text{m}=600\ \text{nm}}$$

> **Correction algébrique.** La solution du PDF imprime $\lambda=a/(iD)$, alors que ses nombres utilisent bien la relation correcte $\lambda=ai/D$. L’analyse dimensionnelle confirme : $ai/D$ est une longueur.` ,
    keyPoint: "δ≈ay/D ; brillante : δ=kλ ; sombre : δ=(k+1/2)λ ; interfrange i=λD/a.",
    example: "Avec a=0,2 mm, D=1 m et i=2,5 mm : λ=ai/D=500 nm.",
    methodSteps: [
      "Détermine si le point demandé est brillant ou sombre.",
      "Traduis le rang en y=ki ou y=(k+1/2)i.",
      "Calcule l’interfrange i.",
      "Utilise i=λD/a ou λ=ai/D.",
      "Vérifie l’unité et l’ordre de grandeur visible.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Franges idéalisées",
      title: "Intensité le long de l’écran",
      instruction: "Déplace le point entre −10 mm et 10 mm pour repérer les brillantes espacées de i=2,5 mm.",
      observation: "Les maxima sont séparés de 2,5 mm ; les minima se placent exactement à mi-distance.",
      formula: "I/Imax=cos²(πy/i), i=2,5 mm",
      formulaTex: "\\frac{I}{I_{\\max}}=\\cos^2\\left(\\frac{\\pi y}{i}\\right)",
      rule: { kind: "samples", points: interferenceIntensityPoints },
      window: { xMin: -10, xMax: 10, yMin: 0, yMax: 1.1 },
      guides: [{ kind: "vertical", value: 0, label: "frange centrale" }, { kind: "horizontal", value: 1, label: "brillante" }],
      marker: { min: -10, max: 10, step: 0.25, initial: 0 },
    },
    questions: [
      short("Écris la différence de marche selon la convention du support.", ["S2P-S1P", "S₂P−S₁P", "s2p-s1p"], "δ=S2P−S1P.", "II.3 Définition"),
      short("Donne l’expression approchée de δ en fonction de a, y et D.", ["ay/D", "a*y/d", "a y / D"], "δ≈ay/D.", "II.3 Géométrie"),
      choice("Une frange brillante vérifie…", ["δ=kλ", "δ=(k+1/2)λ", "δ=λ/3 seulement", "δ=D/a"], 0, "La construction est constructive pour un nombre entier de longueurs d’onde.", "Franges brillantes"),
      choice("Une frange sombre vérifie…", ["δ=(k+1/2)λ", "δ=kλ", "δ=0 uniquement", "δ=aD"], 0, "L’opposition de phase correspond à un demi-entier.", "Franges sombres"),
      short("Donne la formule de l’interfrange.", ["λD/a", "lambda*D/a", "lD/a"], "i=λD/a.", "Interfrange"),
      choice("Deux franges brillantes consécutives sont séparées de…", ["i", "i/2", "2i toujours", "λ seulement"], 0, "C’est la définition de l’interfrange.", "Interfrange"),
      choice("Une brillante et la sombre voisine sont séparées de…", ["i/2", "i", "2i", "D"], 0, "La sombre est à mi-distance de deux brillantes.", "Positions"),
      short("Dans l’exercice 1, calcule i pour la troisième brillante à 7,5 mm.", ["2.5", "2,5", "2.5 mm", "2,5 mm"], "i=7,5/3=2,5 mm.", "Exercice 1.1", 2),
      short("Calcule λ pour cette troisième brillante, en nm.", ["500", "500 nm", "0.5 µm", "0,5 µm"], "λ=ai/D=500 nm.", "Exercice 1.1", 2),
      choice("La troisième sombre positive est située à…", ["2,5i", "3i", "1,5i", "0,5i"], 0, "Les sombres positives sont à 0,5i ; 1,5i ; 2,5i…", "Exercice 1.2"),
      short("Calcule i pour la troisième sombre à 7,5 mm.", ["3", "3.0", "3,0", "3 mm", "3,0 mm"], "i=7,5/2,5=3,0 mm.", "Exercice 1.2", 2),
      short("Calcule λ correspondante en nm.", ["600", "600 nm", "0.6 µm", "0,6 µm"], "λ=ai/D=600 nm.", "Exercice 1.2", 2),
      choice("La formule λ=a/(iD) imprimée dans le PDF est…", ["fausse ; il faut λ=ai/D", "correcte", "une formule d’énergie", "équivalente à λ=ai/D"], 0, "Les dimensions et le calcul imposent λ=ai/D.", "Correction source"),
      choice("Si D double à a et λ fixés, i…", ["double", "est divisé par deux", "reste constant", "quadruple"], 0, "i est proportionnel à D.", "Variation"),
    ],
    corrections: [
      "Page 4 : la formule imprimée λ=a/(iD) est corrigée en λ=ai/D ; les résultats 500 nm et 600 nm du support sont alors cohérents.",
      "Page 4 : la convention de rang de la troisième frange sombre est explicitée : 0,5i, 1,5i puis 2,5i.",
    ],
  },
  {
    id: "wave-light-electromagnetic-spectrum",
    title: "Situer la lumière dans le spectre électromagnétique",
    summary: "Relier période, fréquence, longueur d’onde et célérité, puis distinguer les domaines du spectre et leurs usages.",
    pages: "2-3, 8-9",
    section: "Onde électromagnétique, onde lumineuse et documentation",
    durationMinutes: 27,
    xp: 85,
    kind: "concept",
    body: String.raw`## Une onde électromagnétique

Une onde électromagnétique associe un champ électrique variable et un champ magnétique variable. Elle peut se propager dans le vide, contrairement à une onde mécanique qui a besoin d’un milieu matériel.

Dans le vide, toutes les ondes électromagnétiques ont la même célérité :

$$\boxed{c=299\,792\,458\ \text{m·s}^{-1}\simeq3{,}00\times10^8\ \text{m·s}^{-1}}$$

La période $T$, la fréquence $\nu$ et la longueur d’onde dans le vide $\lambda_0$ vérifient :

$$\boxed{\nu=\frac1T},\qquad
\boxed{\lambda_0=cT=\frac c\nu}$$

La fréquence est fixée par la source et ne change pas lors d’un changement de milieu. La célérité et la longueur d’onde peuvent, elles, changer dans la matière.

## Onde lumineuse et lumière monochromatique

Une onde lumineuse visible est une onde électromagnétique perceptible par l’œil humain. Une lumière monochromatique correspond, dans le modèle idéal, à une fréquence unique. Sa couleur dépend de sa fréquence, ou de façon équivalente de sa longueur d’onde dans le vide.

Le domaine visible est approximativement compris entre le violet autour de $400$ nm et le rouge profond autour de $700$ à $800$ nm selon les conventions scolaires.

## Ordre du spectre

De la plus grande fréquence à la plus petite longueur d’onde :

1. rayons gamma $\gamma$ ;
2. rayons X ;
3. ultraviolet ;
4. visible ;
5. infrarouge ;
6. micro-ondes ;
7. ondes radio.

Puisque $\lambda_0=c/\nu$, fréquence et longueur d’onde varient en sens inverse.

## Usages à connaître

| Domaine | Exemples d’usage |
|---|---|
| Ondes radio / micro-ondes | radiodiffusion, téléphonie, radar, liaisons satellitaires |
| Infrarouge | télécommandes, imagerie thermique, chauffage |
| Visible | vision, éclairage, fibres optiques, lasers |
| Ultraviolet | fluorescence, traitement sous contrôle, analyse |
| Rayons X | imagerie médicale et contrôle de matériaux |
| Rayons gamma | médecine nucléaire et stérilisation sous contrôle |

L’usage ne signifie pas absence de risque : les rayonnements les plus énergétiques exigent des protections et des protocoles adaptés.

## Relation de Planck : une transition vers le modèle corpusculaire

Le support écrit :

$$E=h\nu,\qquad h\simeq6{,}626\times10^{-34}\ \text{J·s}$$

Cette relation donne l’énergie d’un **photon**, pas à elle seule l’énergie totale transportée par un faisceau. Elle annonce la leçon suivante sur le modèle corpusculaire. À fréquence plus grande, l’énergie de chaque photon est plus grande.

Pour $\lambda_0=500$ nm :

$$E=\frac{hc}{\lambda_0}
\simeq\frac{6{,}626\times10^{-34}\times3{,}00\times10^8}{500\times10^{-9}}
\simeq3{,}98\times10^{-19}\ \text{J}$$

> **Précision de vocabulaire.** On réserve $\nu$ à la fréquence et $v$ à une vitesse. Dans le vide, la vitesse est notée $c$, ce qui évite la confusion présente dans le support.` ,
    keyPoint: "ν=1/T ; λ0=c/ν ; fréquence et longueur d’onde varient en sens inverse ; photon : E=hν=hc/λ0.",
    example: "Pour ν=5,00×10¹⁴ Hz, λ0=3,00×10⁸/5,00×10¹⁴=600 nm.",
    methodSteps: [
      "Identifie si l’on demande T, ν, λ0 ou l’énergie d’un photon.",
      "Convertis les nanomètres en mètres.",
      "Utilise λ0=c/ν ou ν=c/λ0.",
      "Situe la valeur obtenue dans le spectre.",
      "N’utilise E=hν que pour l’énergie d’un photon.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Spectre",
      title: "Du rayonnement gamma aux ondes radio",
      instruction: "Sélectionne chaque domaine pour relier fréquence, longueur d’onde et usage.",
      observation: "En allant vers les ondes radio, la fréquence et l’énergie d’un photon diminuent tandis que la longueur d’onde augmente.",
      rootLabel: "Spectre électromagnétique",
      rootDetail: "Toutes ces ondes se propagent à c dans le vide ; elles se distinguent par leur fréquence et leur longueur d’onde.",
      nodes: [
        { id: "gamma", label: "Rayons γ", role: "Très haute fréquence", detail: "Très petite longueur d’onde ; photons très énergétiques ; médecine nucléaire et stérilisation sous contrôle.", group: "Ionisants" },
        { id: "xray", label: "Rayons X", role: "Imagerie", detail: "Traversent différemment les tissus et les matériaux ; protections indispensables.", group: "Ionisants" },
        { id: "uv", label: "Ultraviolet", role: "Au-delà du violet", detail: "Fréquence supérieure au visible ; fluorescence et usages contrôlés.", group: "Proche visible" },
        { id: "visible", label: "Visible", role: "≈400 à 700-800 nm", detail: "Du violet au rouge ; domaine détecté par l’œil humain.", group: "Proche visible" },
        { id: "infrared", label: "Infrarouge", role: "Au-delà du rouge", detail: "Télécommandes, capteurs et imagerie thermique.", group: "Télécommunications" },
        { id: "microwave", label: "Micro-ondes", role: "Centimètres à millimètres", detail: "Radar, satellites et certaines liaisons sans fil.", group: "Télécommunications" },
        { id: "radio", label: "Ondes radio", role: "Grande longueur d’onde", detail: "Radiodiffusion et télécommunications ; fréquence plus faible du classement proposé.", group: "Télécommunications" },
      ],
    },
    questions: [
      choice("Une onde électromagnétique peut se propager…", ["dans le vide", "uniquement dans l’eau", "uniquement dans un solide", "seulement avec une corde"], 0, "Elle n’a pas besoin de milieu matériel.", "II.4 Définition"),
      short("Donne la célérité approchée de la lumière dans le vide.", ["3e8", "3×10^8", "3,00×10^8 m/s", "300000000", "299792458"], "c≈3,00×10⁸ m·s⁻¹.", "Documentation"),
      short("Relie fréquence et période.", ["ν=1/T", "1/T", "v=1/T", "f=1/T"], "ν=1/T.", "II.4"),
      short("Relie λ0, c et ν.", ["λ0=c/ν", "c/ν", "lambda=c/f", "λ=c/f"], "λ0=c/ν dans le vide.", "II.4"),
      choice("Si ν augmente, λ0…", ["diminue", "augmente", "reste toujours identique", "devient une énergie"], 0, "Le produit λ0ν reste égal à c.", "Variation"),
      choice("Une onde lumineuse visible est…", ["une onde électromagnétique", "une onde sonore", "une onde exclusivement mécanique", "un courant continu"], 0, "La lumière appartient au spectre électromagnétique.", "II.5"),
      choice("Quel ordre va vers les fréquences décroissantes ?", ["γ, X, UV, visible, IR, micro-ondes, radio", "radio, γ, visible", "visible, X, radio, γ", "IR, γ, UV, X"], 0, "C’est l’ordre du spectre de la haute vers la basse fréquence.", "Spectre"),
      choice("Les rayons X sont notamment utilisés pour…", ["l’imagerie médicale", "mesurer le pH", "remplacer une balance", "créer un ressort"], 0, "Leur pénétration permet l’imagerie sous contrôle.", "Importance"),
      choice("La téléphonie et la radiodiffusion utilisent surtout…", ["des ondes hertziennes", "uniquement des rayons gamma", "des ondes mécaniques dans le vide", "des neutrons"], 0, "Les ondes radio et micro-ondes portent des communications.", "Importance"),
      short("Calcule λ0 pour ν=5,00×10¹⁴ Hz, en nm.", ["600", "600 nm"], "λ0=c/ν=6,00×10⁻⁷ m=600 nm.", "Application", 2),
      choice("Dans E=hν, E désigne précisément…", ["l’énergie d’un photon", "l’énergie totale obligatoire du faisceau", "la fréquence", "la célérité"], 0, "La relation de Planck porte sur un quantum de lumière.", "Précision"),
      choice("À fréquence plus grande, l’énergie d’un photon est…", ["plus grande", "plus petite", "toujours nulle", "sans lien"], 0, "E=hν.", "Relation de Planck"),
      short("Donne la valeur approchée de h.", ["6.626e-34", "6,626e-34", "6.62e-34", "6,62×10^-34 J.s", "6,626×10⁻³⁴ J·s"], "h≈6,626×10⁻³⁴ J·s.", "Constante de Planck"),
    ],
    corrections: [
      "Pages 2-3 : la notation distingue ν, fréquence, de v, vitesse ; la célérité dans le vide est notée c.",
      "Page 3 : E=hν est présentée comme l’énergie d’un photon, et non comme l’énergie totale du faisceau.",
      "Page 8 : l’écriture c≈3×10⁸ m·s⁻¹ est restaurée avec son exposant et son unité.",
    ],
  },
  {
    id: "wave-light-official-evaluation-laser",
    title: "Résoudre l’évaluation du pointeur laser",
    summary: "Exploiter trois expériences comparées pour retrouver la longueur d’onde d’un laser rouge sans connaître séparément a et D.",
    pages: "3-4",
    section: "Situation d’évaluation",
    durationMinutes: 25,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Données de l’évaluation

Un pointeur laser rouge est annoncé entre $660$ nm et $680$ nm. Une fente de largeur $a_1$ est placée à la distance $D$ de l’écran.

| Expérience | Longueur d’onde | Fente | Largeur centrale |
|---|---:|---:|---:|
| 1 | $\lambda_1=543$ nm, vert | $a_1$ | $L_1=3{,}2$ cm |
| 2 | $\lambda_0$ inconnue, rouge | $a_1$ | $L_2=4{,}0$ cm |
| 3 | $\lambda_1=543$ nm | $a_3<a_1$ | $L_3>L_1$ |

La question centrale est de retrouver $\lambda_0$.

## 1. Définir l’onde lumineuse

Une onde lumineuse est une onde électromagnétique visible. Le laser est presque monochromatique : il fournit une longueur d’onde suffisamment bien définie pour l’expérience.

## 2. Écrire la largeur de la tache

Pour une fente et un écran lointain :

$$L=\frac{2D\lambda}{a}$$

Les expériences 1 et 2 utilisent le même $D$ et la même fente $a_1$ :

$$L_1=\frac{2D\lambda_1}{a_1},\qquad
L_2=\frac{2D\lambda_0}{a_1}$$

## 3. Construire un rapport

Diviser les deux égalités élimine les grandeurs inconnues communes :

$$\frac{L_2}{L_1}=\frac{\lambda_0}{\lambda_1}$$

d’où :

$$\boxed{\lambda_0=\lambda_1\frac{L_2}{L_1}}$$

Application :

$$\lambda_0=543\times\frac{4{,}0}{3{,}2}
=543\times1{,}25
=\boxed{678{,}75\ \text{nm}}$$

À la précision des données :

$$\boxed{\lambda_0\simeq679\ \text{nm}}$$

Cette valeur appartient bien à l’intervalle $[660;680]$ nm de la notice. L’expérience est cohérente avec le pointeur rouge.

## 4. Interpréter l’expérience 3

À $D$ et $\lambda_1$ fixés :

$$L=\frac{2D\lambda_1}{a}$$

Si $a_3<a_1$, alors :

$$\frac1{a_3}>\frac1{a_1}\quad\Longrightarrow\quad L_3>L_1$$

Cette troisième expérience vérifie qualitativement la dépendance inverse entre $L$ et $a$.

## Pourquoi la méthode du rapport est puissante

Ni $D$ ni $a_1$ ne sont chiffrés. Un calcul direct serait impossible, mais ils sont identiques dans les deux expériences et disparaissent dans le quotient. Cette stratégie se retrouve souvent en sciences : comparer deux expériences où une seule grandeur utile varie.

> **Précision de notation.** La question 3.1 du support parle de $\lambda_2$, alors que le pointeur est noté $\lambda_0$ dans le tableau. Le parcours conserve la notation cohérente $\lambda_0$.` ,
    keyPoint: "Même fente et même distance : L2/L1=λ0/λ1, donc λ0=543×4,0/3,2=678,75 nm≈679 nm.",
    example: "Le rapport 4,0/3,2=1,25 montre que le laser rouge a une longueur d’onde 25 % plus grande que le vert.",
    methodSteps: [
      "Écris L=2Dλ/a pour chaque expérience.",
      "Repère les grandeurs identiques : D et a1.",
      "Divise les deux relations pour les éliminer.",
      "Isole λ0 et calcule sans convertir les nm, puisque le rapport est sans unité.",
      "Compare le résultat à l’intervalle de la notice.",
    ],
    interaction: timeline([
      { label: "Modèle", shortLabel: "L=2Dλ/a", detail: "La largeur de la tache est proportionnelle à λ pour une fente et une distance fixées." },
      { label: "Deux expériences", shortLabel: "Même D, même a", detail: "Les facteurs 2D/a1 sont communs aux expériences verte et rouge." },
      { label: "Rapport", shortLabel: "L2/L1", detail: "Le quotient des largeurs est égal au quotient des longueurs d’onde." },
      { label: "Calcul", shortLabel: "678,75 nm", detail: "λ0=543×4,0/3,2=678,75 nm." },
      { label: "Validation", shortLabel: "Notice conforme", detail: "678,75 nm est compris entre 660 nm et 680 nm." },
    ], "Retrouver λ0 sans connaître a ni D", "Parcours les cinq étapes de la comparaison expérimentale.", "Le rapport élimine automatiquement toutes les grandeurs maintenues constantes."),
    questions: [
      choice("Une onde lumineuse est…", ["une onde électromagnétique visible", "une onde sonore", "une onde uniquement matérielle", "une force"], 0, "C’est la définition demandée en question 1.", "Évaluation 1"),
      short("Donne l’expression de L.", ["2Dλ/a", "2*d*lambda/a", "2Dl/a"], "L=2Dλ/a.", "Évaluation 2"),
      choice("Entre les expériences 1 et 2, quelles grandeurs restent identiques ?", ["D et a1", "λ et L", "la couleur seulement", "aucune"], 0, "Même écran et même fente a1.", "Tableau"),
      short("Calcule le rapport L2/L1.", ["1.25", "1,25"], "4,0/3,2=1,25.", "Évaluation 3.1"),
      choice("La relation correcte est…", ["L2/L1=λ0/λ1", "L2/L1=λ1/λ0", "L2L1=λ0+λ1", "L2/L1=a1/D"], 0, "Les facteurs communs 2D/a1 s’éliminent.", "Évaluation 3.1"),
      short("Calcule λ0 en nm.", ["678.75", "678,75", "678.75 nm", "678,75 nm", "679", "679 nm"], "λ0=678,75 nm≈679 nm.", "Évaluation 3.2", 3),
      choice("Le résultat est-il conforme à la notice 660-680 nm ?", ["Oui", "Non", "Impossible à décider", "Seulement si a=0"], 0, "678,75 appartient à l’intervalle.", "Évaluation 3.3"),
      choice("La radiation inconnue est plutôt…", ["rouge", "violette", "ultraviolette", "rayon X"], 0, "Une longueur d’onde proche de 679 nm est rouge.", "Interprétation"),
      choice("Pourquoi aucune conversion cm→m n’est nécessaire dans L2/L1 ?", ["Les deux largeurs ont la même unité, qui s’annule", "Les centimètres sont des hertz", "D vaut zéro", "λ n’a pas d’unité"], 0, "Un rapport de longueurs exprimées dans la même unité est sans dimension.", "Méthode"),
      choice("Dans l’expérience 3, a3<a1 implique…", ["L3>L1", "L3<L1", "L3=L1 toujours", "λ1=0"], 0, "L varie comme 1/a.", "Expérience 3"),
      choice("Si L2=L1 avec la même fente, alors…", ["λ0=λ1", "λ0=2λ1", "λ0=0", "D change obligatoirement"], 0, "Les longueurs sont proportionnelles.", "Transfert"),
      short("Quel pourcentage d’augmentation de L sépare 3,2 cm de 4,0 cm ?", ["25", "25%", "25 %"], "(4,0−3,2)/3,2=0,25 soit 25 %.", "Interprétation quantitative", 2),
      choice("La notation cohérente du pointeur dans le tableau est…", ["λ0", "λ2 obligatoire", "a0", "D0"], 0, "Le tableau nomme l’inconnue λ0 ; la mention λ2 est harmonisée.", "Correction source"),
      choice("La stratégie générale utilisée est…", ["former un rapport entre expériences", "additionner toutes les unités", "ignorer les données communes", "changer la source pendant le calcul"], 0, "Le rapport élimine les paramètres constants.", "Bilan"),
    ],
    corrections: [
      "Page 4 : la notation λ2 de la question 3.1 est harmonisée avec λ0, notation du pointeur dans le tableau.",
      "Page 4 : la solution absente du support est entièrement établie ; λ0=678,75 nm, valeur conforme à la notice 660-680 nm.",
    ],
  },
  {
    id: "wave-light-official-young-diffraction",
    title: "Traiter les exercices officiels 1 et 2",
    summary: "Résoudre le classement des franges de Young puis reconnaître et dimensionner une figure de diffraction.",
    pages: "4-5",
    section: "Exercices 1 et 2",
    durationMinutes: 27,
    xp: 105,
    kind: "practice",
    body: String.raw`## Exercice 1 — fentes de Young

Les fentes sont séparées de $a=0{,}2$ mm et l’écran est à $D=1$ m.

### Troisième brillante à 7,5 mm

Les brillantes sont à $y=ki$. La troisième brillante positive correspond à $k=3$ :

$$i=\frac{7{,}5}{3}=2{,}5\ \text{mm}$$

Puis :

$$\lambda=\frac{ai}{D}
=\frac{0{,}2\times10^{-3}\times2{,}5\times10^{-3}}{1}
=5{,}0\times10^{-7}\ \text{m}$$

$$\boxed{\lambda=500\ \text{nm}}$$

### Troisième sombre à 7,5 mm

Les sombres positives sont à $0{,}5i$, $1{,}5i$, $2{,}5i$, etc. La troisième correspond donc à $2{,}5i$ :

$$i=\frac{7{,}5}{2{,}5}=3{,}0\ \text{mm}$$

$$\lambda=\frac{0{,}2\times10^{-3}\times3{,}0\times10^{-3}}{1}
=6{,}0\times10^{-7}\ \text{m}$$

$$\boxed{\lambda=600\ \text{nm}}$$

Le mot « troisième » ne se traduit donc pas de la même façon pour une brillante et une sombre. C’est le piège principal.

## Exercice 2 — reconnaître la diffraction

Le schéma montre un laser, une fente étroite, un écran et une tache centrale élargie.

La phrase complétée est :

> Le phénomène observé sur l’écran s’appelle **la diffraction** ; son importance est liée au rapport de la largeur $a$ de la fente sur la **longueur d’onde** $\lambda$.

Le bon rapport est :

$$\frac a\lambda$$

Plus $a/\lambda$ diminue, plus la diffraction est marquée.

Parmi les quatre expressions proposées, la bonne largeur centrale est :

$$\boxed{L=\frac{2\lambda D}{a}}$$

C’est la proposition (1) du support. On peut la contrôler sans calcul :

- $L$ doit augmenter si $D$ augmente ;
- $L$ doit augmenter si $\lambda$ augmente ;
- $L$ doit augmenter si $a$ diminue ;
- $2\lambda D/a$ a bien la dimension d’une longueur.

## Analyse dimensionnelle de la correction de l’exercice 1

Le PDF affiche par endroits $\lambda=a/(iD)$. Les dimensions seraient :

$$\frac{[a]}{[i][D]}=\frac{\text{m}}{\text{m}^2}=\text{m}^{-1}$$

Ce ne peut pas être une longueur d’onde. En revanche :

$$\left[\frac{ai}{D}\right]=\frac{\text{m}\times\text{m}}{\text{m}}=\text{m}$$

L’analyse dimensionnelle permet donc de corriger la formule même avant de refaire le calcul.

## Contrôle par la couleur

$500$ nm se situe vers le vert-bleu ; $600$ nm se situe vers l’orange-rouge selon les limites de couleurs retenues. Les deux résultats appartiennent au domaine visible, ce qui confirme l’ordre de grandeur.

> **Règle de fiabilité.** Une réponse en nanomètres doit être compatible avec la lumière annoncée ; une valeur comme $10^{-12}$ m ou plusieurs mètres révélerait une erreur de conversion.` ,
    keyPoint: "Ex.1 : 500 nm pour la troisième brillante, 600 nm pour la troisième sombre ; Ex.2 : diffraction et L=2λD/a.",
    example: "Pour une troisième sombre, y=2,5i et non 3i : c’est ce qui donne i=3,0 mm.",
    methodSteps: [
      "Traduis correctement le rang de la frange.",
      "Calcule i dans la même unité que y.",
      "Convertis a, i et D en mètres avant λ=ai/D.",
      "Pour la diffraction, contrôle les variations de L.",
      "Termine par une vérification dimensionnelle et spectrale.",
    ],
    interaction: timeline([
      { label: "Nature de la frange", shortLabel: "Brillante ou sombre ?", detail: "Choisis y=ki pour une brillante et y=(k+1/2)i pour une sombre." },
      { label: "Rang", shortLabel: "3 ou 2,5", detail: "La troisième brillante est à 3i ; la troisième sombre est à 2,5i." },
      { label: "Interfrange", shortLabel: "i=y/rang", detail: "On trouve 2,5 mm pour la brillante et 3,0 mm pour la sombre." },
      { label: "Longueur d’onde", shortLabel: "λ=ai/D", detail: "Les résultats sont 500 nm et 600 nm." },
      { label: "Contrôle", shortLabel: "Visible", detail: "Les deux longueurs d’onde ont un ordre de grandeur compatible avec la lumière visible." },
    ], "Ne pas se tromper de rang", "Sélectionne chaque étape avant de refaire les deux calculs.", "Le rang des sombres commence à un demi-interfrange du centre."),
    questions: [
      short("Exercice 1 : donne a en mètres.", ["0.0002", "0,0002", "2e-4", "2×10^-4", "2×10⁻⁴ m"], "0,2 mm=2×10⁻⁴ m.", "Exercice 1"),
      short("Donne D en millimètres.", ["1000", "1000 mm", "10^3 mm", "10³ mm"], "1 m=1000 mm.", "Exercice 1"),
      short("Troisième brillante : calcule i.", ["2.5", "2,5", "2.5 mm", "2,5 mm"], "i=7,5/3=2,5 mm.", "Exercice 1.1", 2),
      short("Troisième brillante : calcule λ en mètres.", ["5e-7", "5×10^-7", "5×10⁻⁷", "0.0000005", "5×10⁻⁷ m"], "λ=5×10⁻⁷ m.", "Exercice 1.1", 2),
      short("Troisième brillante : donne λ en nm.", ["500", "500 nm"], "5×10⁻⁷ m=500 nm.", "Exercice 1.1"),
      choice("La troisième sombre est à…", ["2,5i", "3i", "3,5i", "i/3"], 0, "Le comptage commence à 0,5i.", "Exercice 1.2"),
      short("Troisième sombre : calcule i.", ["3", "3.0", "3,0", "3 mm"], "i=7,5/2,5=3 mm.", "Exercice 1.2", 2),
      short("Troisième sombre : donne λ en nm.", ["600", "600 nm"], "λ=ai/D=600 nm.", "Exercice 1.2", 2),
      choice("Dans l’exercice 2, le phénomène est…", ["la diffraction", "l’induction", "la fission", "la résonance électrique"], 0, "La tache s’élargit derrière une fente.", "Exercice 2.1"),
      short("Complète : l’importance dépend du rapport a sur…", ["λ", "lambda", "longueur d'onde", "la longueur d’onde"], "Le rapport pertinent est a/λ.", "Exercice 2.1"),
      choice("Quelle proposition de l’exercice 2 est correcte ?", ["(1) L=2λD/a", "(2) L=2aD/λ", "(3) L=2D²/(λa)", "(4) L=2aλ/D"], 0, "La relation correcte est L=2λD/a.", "Exercice 2.2"),
      choice("Quelle écriture a la dimension d’une longueur ?", ["ai/D", "a/(iD)", "1/(aD)", "D/(ai)"], 0, "ai/D a pour dimension m.", "Analyse dimensionnelle"),
      choice("Si la fente est divisée par deux, L…", ["double", "est divisée par deux", "reste fixe", "quadruple"], 0, "L varie comme 1/a.", "Exercice 2"),
      choice("500 nm appartient…", ["au visible", "aux ondes radio", "aux rayons gamma", "aux rayons X"], 0, "500 nm est dans le domaine visible.", "Contrôle"),
      choice("Le meilleur contrôle final est…", ["unité et ordre de grandeur", "le nombre de lignes du PDF", "la couleur du papier", "aucun contrôle"], 0, "L’unité et le domaine spectral détectent les erreurs grossières.", "Bilan"),
    ],
    corrections: [
      "Page 4 : la relation utilisée est explicitement λ=ai/D, malgré la fraction mal composée dans le corrigé source.",
      "Page 4 : le rang de la troisième sombre est expliqué pour éviter l’ambiguïté de comptage.",
    ],
  },
  {
    id: "wave-light-frequency-table-lab",
    title: "Corriger le tableau spectral et le TP de diffraction",
    summary: "Calculer quatre longueurs d’onde à partir des fréquences, puis exploiter correctement le TP à 632,8 nm.",
    pages: "5-7",
    section: "Exercice 3, exercice 3 bis et solutions",
    durationMinutes: 29,
    xp: 115,
    kind: "practice",
    body: String.raw`## Exercice 3 — fréquences et longueurs d’onde

Le support donne quatre fréquences monochromatiques. Dans le vide :

$$\lambda_0=\frac c\nu$$

Pour obtenir des nanomètres directement :

$$\lambda_0(\text{nm})=\frac{3{,}00\times10^{17}}{\nu(\text{Hz})}$$

| $\nu$ (Hz) | Calcul | $\lambda_0$ corrigée | Couleur indicative |
|---:|---:|---:|---|
| $7{,}14\times10^{14}$ | $3{,}00\times10^8/(7{,}14\times10^{14})$ | $420$ nm | violet |
| $5{,}45\times10^{14}$ | $3{,}00\times10^8/(5{,}45\times10^{14})$ | $550$ nm | vert, proche du jaune selon les conventions |
| $5{,}00\times10^{14}$ | $3{,}00\times10^8/(5{,}00\times10^{14})$ | $600$ nm | orange-rouge |
| $4{,}00\times10^{14}$ | $3{,}00\times10^8/(4{,}00\times10^{14})$ | $750$ nm | rouge profond / limite proche infrarouge |

La première valeur du corrigé source, $120$ nm, est incompatible avec le calcul. Elle doit être $420$ nm. Les noms de couleurs ont des frontières conventionnelles ; la valeur numérique de $\lambda_0$ reste la réponse scientifique principale.

## Exercice 3 bis — dispositif de diffraction

Le support numérote une seconde fois « Exercice 3 ». Il fournit :

$$a=0{,}10\ \text{mm},\qquad
\lambda=632{,}8\ \text{nm},\qquad
D=2{,}0\ \text{m}$$

### Écart angulaire

$\theta_c$ est l’angle entre l’axe du faisceau et la direction de la première extinction bordant la moitié de la tache centrale :

$$\theta_c\simeq\frac\lambda a
=\frac{632{,}8\times10^{-9}}{0{,}10\times10^{-3}}
=\boxed{6{,}328\times10^{-3}\ \text{rad}}$$

### Largeur de la tache

$$L\simeq2D\theta_c
=2\times2{,}0\times6{,}328\times10^{-3}$$

$$\boxed{L=2{,}5312\times10^{-2}\ \text{m}\simeq2{,}53\ \text{cm}}$$

## Les trois contrôles indispensables

1. **Variation** : si $a$ diminue, $L$ doit augmenter.
2. **Dimension** : $2D\lambda/a$ doit avoir l’unité d’une longueur.
3. **Petit angle** : $6{,}328\times10^{-3}$ rad est bien petit, donc $\tan\theta_c\simeq\theta_c$ est cohérent.

## Lire la courbe interactive

L’abscisse représente $\nu$ en unités de $10^{14}$ Hz et l’ordonnée $\lambda_0$ en nm. La courbe est décroissante et non linéaire car $\lambda_0=3000/\nu_{14}$.

Par exemple :

$$\nu_{14}=5\quad\Longrightarrow\quad\lambda_0=\frac{3000}{5}=600\ \text{nm}$$

> **Corrections de source.** La première longueur d’onde du tableau est 420 nm, non 120 nm. La fente du TP vaut 0,10 mm, non 0,10 nm. Les deux exercices portant le numéro 3 sont distingués ici en « exercice 3 » et « exercice 3 bis ».` ,
    keyPoint: "Tableau corrigé : 420, 550, 600 et 750 nm ; TP : θc=6,328×10⁻³ rad et L≈2,53 cm.",
    example: "Pour 7,14×10¹⁴ Hz, λ0≈3,00×10⁸/(7,14×10¹⁴)=420 nm, pas 120 nm.",
    methodSteps: [
      "Utilise λ0=c/ν et conserve les puissances de dix.",
      "Convertis le résultat en nm en multipliant les mètres par 10⁹.",
      "Attribue une couleur seulement après le calcul numérique.",
      "Pour le TP, corrige a en 0,10 mm et calcule θc=λ/a.",
      "Déduis L=2Dθc puis contrôle l’approximation des petits angles.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Spectre calculé",
      title: "λ0 diminue quand ν augmente",
      instruction: "Déplace le point ; x représente ν en 10¹⁴ Hz et y la longueur d’onde en nm.",
      observation: "Le produit λ0ν est constant dans le vide : la courbe suit une loi inverse.",
      formula: "λ0(nm)=3000/ν14",
      formulaTex: "\\lambda_0=\\frac{3000}{\\nu_{14}}",
      rule: { kind: "samples", points: wavelengthFrequencyPoints },
      window: { xMin: 3.5, xMax: 7.7, yMin: 350, yMax: 850 },
      guides: [{ kind: "horizontal", value: 420.168, label: "420 nm" }, { kind: "vertical", value: 5, label: "5×10¹⁴ Hz" }],
      marker: { min: 3.75, max: 7.5, step: 0.25, initial: 5 },
    },
    questions: [
      short("Calcule λ0 pour 7,14×10¹⁴ Hz, au nm près.", ["420", "420 nm"], "λ0≈420,17 nm, soit 420 nm.", "Exercice 3 tableau", 2),
      choice("La valeur 120 nm du corrigé est…", ["une erreur numérique", "exacte", "égale à 420 nm", "une fréquence"], 0, "c/ν donne environ 420 nm.", "Correction source"),
      short("Calcule λ0 pour 5,45×10¹⁴ Hz, au nm près.", ["550", "550 nm"], "λ0≈550,46 nm.", "Exercice 3 tableau", 2),
      short("Calcule λ0 pour 5,00×10¹⁴ Hz.", ["600", "600 nm"], "λ0=600 nm.", "Exercice 3 tableau", 2),
      short("Calcule λ0 pour 4,00×10¹⁴ Hz.", ["750", "750 nm"], "λ0=750 nm.", "Exercice 3 tableau", 2),
      choice("420 nm est associé approximativement au…", ["violet", "rouge profond", "micro-onde", "rayon gamma"], 0, "420 nm est dans le violet.", "Couleur"),
      choice("Les frontières entre couleurs visibles sont…", ["conventionnelles et progressives", "des murs physiques parfaitement nets", "sans lien avec λ", "identiques à toutes les sources sans variation"], 0, "Le spectre est continu et les limites de couleur sont indicatives.", "Précision"),
      short("Dans le TP, donne la largeur correcte de la fente.", ["0.10 mm", "0,10 mm", "1e-4 m", "10^-4 m", "10⁻⁴ m"], "La fente vaut 0,10 mm.", "Exercice 3 bis"),
      short("Calcule θc dans le TP.", ["0.006328", "0,006328", "6.328e-3", "6,328×10^-3", "6,328×10⁻³ rad"], "θc=λ/a=6,328×10⁻³ rad.", "Exercice 3 bis", 2),
      short("Calcule L en mètres.", ["0.025312", "0,025312", "2.5312e-2", "2,5312×10^-2", "2,5312×10⁻² m"], "L=2Dθc=0,025312 m.", "Exercice 3 bis", 2),
      short("Donne L en centimètres au centième près.", ["2.53", "2,53", "2.53 cm", "2,53 cm"], "L≈2,53 cm.", "Exercice 3 bis"),
      choice("L’approximation tan θ≈θ est-elle justifiée ici ?", ["Oui, θ≈0,0063 rad est petit", "Non, θ vaut 90°", "Non, car a est en mètres", "Impossible"], 0, "L’angle est très inférieur à 1 rad.", "Contrôle"),
      choice("Si ν passe de 4×10¹⁴ à 8×10¹⁴ Hz, λ0…", ["est divisée par deux", "double", "quadruple", "reste fixe"], 0, "λ0=c/ν.", "Variation"),
      choice("La seconde occurrence « Exercice 3 » est traitée comme…", ["Exercice 3 bis", "un doublon à supprimer", "une correction sans énoncé", "une leçon de chimie"], 0, "Le contenu est conservé et distingué clairement.", "Numérotation"),
      choice("Le contrôle dimensionnel de L=2Dλ/a donne…", ["des mètres", "des hertz", "des joules", "aucune dimension"], 0, "m×m/m=m.", "Dimension"),
    ],
    corrections: [
      "Pages 5-6 : 7,14×10¹⁴ Hz correspond à 420 nm et non 120 nm.",
      "Pages 5-6 : les couleurs sont présentées comme indicatives ; la valeur numérique de la longueur d’onde est prioritaire.",
      "Page 6 : la fente vaut 0,10 mm et non 0,10 nm.",
      "Pages 5-6 : la seconde occurrence « Exercice 3 » est renommée « Exercice 3 bis » sans retirer son contenu.",
    ],
  },
  {
    id: "wave-light-measurement-spectrum-mission",
    title: "Mission finale : mesurer λ et expliquer le spectre",
    summary: "Réaliser le bilan complet de la situation expérimentale, corriger les puissances de dix et transférer le modèle aux usages des ondes électromagnétiques.",
    pages: "7-9",
    section: "Situation expérimentale et documentation",
    durationMinutes: 31,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Mission A — mesurer la longueur d’onde

Le groupe mesure :

$$a=(0{,}200\pm0{,}005)\ \text{mm}$$

$$D=(2{,}00\pm0{,}01)\ \text{m}$$

$$l=(12{,}6\pm0{,}1)\ \text{mm}$$

$l$ est la largeur totale de la tache centrale.

### 1. Nommer le phénomène

La présence d’une zone lumineuse centrale élargie, bordée de zones sombres, caractérise la **diffraction**.

### 2. Calculer l’angle

$$\tan\theta_c=\frac{l}{2D}\simeq\theta_c$$

Après conversion $l=12{,}6\times10^{-3}$ m :

$$\theta_c=\frac{12{,}6\times10^{-3}}{2\times2{,}00}
=\boxed{3{,}15\times10^{-3}\ \text{rad}}$$

Le corrigé source affiche une fois $3{,}15\times10^{-2}$ rad : l’exposant correct est $-3$.

### 3. Déterminer λ

Pour une fente :

$$\theta_c\simeq\frac\lambda a$$

donc :

$$\lambda=a\theta_c$$

Avec $a=0{,}200\times10^{-3}$ m :

$$\lambda=0{,}200\times10^{-3}\times3{,}15\times10^{-3}
=6{,}30\times10^{-7}\ \text{m}$$

$$\boxed{\lambda=630\ \text{nm}}$$

### 4. Déterminer la fréquence

$$\nu=\frac c\lambda
=\frac{3{,}00\times10^8}{6{,}30\times10^{-7}}
\simeq\boxed{4{,}76\times10^{14}\ \text{Hz}}$$

Cette radiation appartient au visible, dans la zone rouge-orangé.

## Bonus — ordre de grandeur de l’incertitude

La question officielle ne demande pas de calculer l’incertitude sur $\lambda$. Les mesures fournies permettent toutefois un contrôle prudent. Comme :

$$\lambda=\frac{al}{2D}$$

une majoration simple des incertitudes relatives donne :

$$\frac{u(\lambda)}\lambda
\lesssim\frac{u(a)}a+\frac{u(l)}l+\frac{u(D)}D$$

$$\frac{u(\lambda)}\lambda
\lesssim\frac{0{,}005}{0{,}200}+\frac{0{,}1}{12{,}6}+\frac{0{,}01}{2{,}00}
\simeq0{,}038$$

soit environ $u(\lambda)\lesssim24$ nm avec cette majoration. On peut donc présenter le résultat expérimental comme environ $630$ nm, avec quelques dizaines de nanomètres d’incertitude maximale.

## Mission B — transférer au spectre électromagnétique

La documentation rappelle que toutes les ondes électromagnétiques se propagent à $c$ dans le vide et obéissent à $\lambda_0=c/\nu$. Leurs interactions avec la matière dépendent fortement de la fréquence.

Pour résoudre une situation de télécommunication ou d’imagerie :

1. identifie le domaine spectral ;
2. convertis fréquence et longueur d’onde ;
3. relie la fréquence à l’usage demandé ;
4. distingue propriété physique et précaution d’utilisation.

Exemple : une onde radio de fréquence $100$ MHz a pour longueur d’onde :

$$\lambda_0=\frac{3{,}00\times10^8}{100\times10^6}=\boxed{3{,}0\ \text{m}}$$

Un rayon X de longueur d’onde $0{,}10$ nm a une fréquence :

$$\nu=\frac{3{,}00\times10^8}{1{,}0\times10^{-10}}
=\boxed{3{,}0\times10^{18}\ \text{Hz}}$$

## Bilan complet

- la diffraction et les interférences établissent le caractère ondulatoire de la lumière ;
- $L=2D\lambda/a$ permet une mesure expérimentale de $\lambda$ ;
- $\delta$ classe les franges brillantes et sombres ;
- $\lambda_0=c/\nu$ organise le spectre électromagnétique ;
- $E=h\nu$ prépare le passage au modèle corpusculaire.

> **Correction des puissances de dix.** Dans la solution de la page 7, $\theta_c$ est $3{,}15\times10^{-3}$ rad, et la largeur $a$ vaut $0{,}200\times10^{-3}$ m. Ces valeurs conduisent correctement à $630$ nm.` ,
    keyPoint: "Mission : θc=l/(2D)=3,15×10⁻³ rad ; λ=aθc=630 nm ; ν=c/λ≈4,76×10¹⁴ Hz.",
    example: "Une onde radio de 100 MHz a λ0=3,0 m ; la même relation c=λ0ν couvre tout le spectre.",
    methodSteps: [
      "Convertis a et l de millimètres en mètres.",
      "Calcule θc=l/(2D) et vérifie qu’il est petit.",
      "Déduis λ=aθc puis convertis en nm.",
      "Calcule ν=c/λ et situe la radiation.",
      "Transfère la relation à un autre domaine du spectre et contrôle l’usage.",
    ],
    interaction: timeline([
      { label: "Mesures", shortLabel: "a, D, l", detail: "a=0,200 mm, D=2,00 m et l=12,6 mm sont convertis en unités SI." },
      { label: "Angle", shortLabel: "3,15×10⁻³ rad", detail: "θc=l/(2D)=3,15×10⁻³ rad, et non 3,15×10⁻² rad." },
      { label: "Longueur d’onde", shortLabel: "630 nm", detail: "λ=aθc=6,30×10⁻⁷ m=630 nm." },
      { label: "Fréquence", shortLabel: "4,76×10¹⁴ Hz", detail: "ν=c/λ situe la radiation dans le visible rouge-orangé." },
      { label: "Transfert", shortLabel: "Tout le spectre", detail: "La même relation λ0ν=c permet de traiter radio, infrarouge, visible, UV, X et gamma." },
    ], "Du laboratoire au spectre", "Parcours toute la chaîne de mesure avant d’ouvrir le transfert spectral.", "Une seule puissance de dix erronée peut déplacer artificiellement la radiation vers un autre domaine."),
    questions: [
      choice("Le phénomène observé dans la mission est…", ["la diffraction", "la résonance RLC", "l’auto-induction", "la fission"], 0, "La fente produit une tache centrale élargie.", "Situation 1"),
      short("Convertis l=12,6 mm en mètres.", ["0.0126", "0,0126", "12.6e-3", "12,6×10^-3", "1,26×10⁻² m"], "l=12,6×10⁻³ m.", "Situation 2"),
      short("Calcule θc=l/(2D).", ["0.00315", "0,00315", "3.15e-3", "3,15×10^-3", "3,15×10⁻³ rad"], "θc=12,6×10⁻³/4=3,15×10⁻³ rad.", "Situation 2", 2),
      choice("L’exposant −2 imprimé une fois pour θc est…", ["une coquille ; il faut −3", "correct", "équivalent à −3", "une unité"], 0, "Le quotient numérique donne 0,00315.", "Correction source"),
      short("Convertis a=0,200 mm en mètres.", ["0.0002", "0,0002", "2e-4", "2×10^-4", "2×10⁻⁴ m"], "a=2,00×10⁻⁴ m.", "Situation 3"),
      short("Calcule λ=aθc en mètres.", ["6.3e-7", "6,3e-7", "6.30×10^-7", "6,30×10⁻⁷ m"], "λ=6,30×10⁻⁷ m.", "Situation 3.2", 2),
      short("Donne λ en nanomètres.", ["630", "630 nm"], "6,30×10⁻⁷ m=630 nm.", "Situation 3.2"),
      short("Calcule ν au centième en 10¹⁴ Hz.", ["4.76", "4,76", "4.76e14", "4,76×10^14", "4,76×10¹⁴ Hz"], "ν≈4,76×10¹⁴ Hz.", "Situation 4.1", 2),
      choice("630 nm se situe approximativement dans…", ["le rouge-orangé visible", "les rayons gamma", "les ondes radio métriques", "les rayons X"], 0, "630 nm appartient au visible.", "Interprétation"),
      short("Exprime l directement en fonction de D, λ et a.", ["2Dλ/a", "2*d*lambda/a", "2Dl/a"], "l=2Dλ/a.", "Situation 4.2"),
      choice("L’incertitude bonus est…", ["un approfondissement non exigé par la question officielle", "la seule réponse notée", "une raison d’ignorer λ", "une fréquence"], 0, "Le parcours la distingue clairement du barème officiel.", "Bonus"),
      short("Avec la majoration proposée, donne l’incertitude maximale approximative en nm.", ["24", "24 nm", "environ 24", "≈24 nm"], "0,038×630≈24 nm.", "Bonus", 2),
      short("Calcule λ0 d’une onde de 100 MHz.", ["3", "3.0", "3,0", "3 m", "3,0 m"], "λ0=3×10⁸/10⁸=3 m.", "Transfert radio", 2),
      short("Convertis 0,10 nm en mètres.", ["1e-10", "10^-10", "1×10^-10", "10⁻¹⁰ m"], "0,10 nm=1,0×10⁻¹⁰ m.", "Transfert X"),
      short("Calcule la fréquence d’un rayon X de 0,10 nm.", ["3e18", "3×10^18", "3,0×10¹⁸ Hz", "3×10¹⁸ Hz"], "ν=c/λ=3,0×10¹⁸ Hz.", "Transfert X", 2),
      choice("Quel énoncé résume le mieux la leçon ?", ["Diffraction et interférences révèlent l’onde ; λν=c organise le spectre", "La lumière est uniquement sonore", "Toutes les longueurs d’onde ont la même fréquence", "Une petite fente supprime toute lumière"], 0, "C’est le fil directeur du parcours.", "Bilan final"),
    ],
    corrections: [
      "Page 7 : θc est corrigé de 3,15×10⁻² rad à 3,15×10⁻³ rad.",
      "Page 7 : la conversion de a est rétablie en 0,200×10⁻³ m, et non 0,200×10⁻² m.",
      "Page 7 : la fréquence manquante dans le corrigé est calculée à 4,76×10¹⁴ Hz.",
      "Pages 8-9 : les notations lo et q sont normalisées en λ0 et θc.",
    ],
  },
];

const levelOrder = [
  "wave-light-diffraction-observation",
  "wave-light-diffraction-geometry",
  "wave-light-young-interference",
  "wave-light-path-difference-fringes",
  "wave-light-electromagnetic-spectrum",
  "wave-light-official-evaluation-laser",
  "wave-light-official-young-diffraction",
  "wave-light-frequency-table-lab",
  "wave-light-measurement-spectrum-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau du modèle ondulatoire de la lumière introuvable : " + id);
  return officialLevel(index, level);
});

export const waveLightPath: LearningPath = {
  id: "terminale-c-wave-light",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Leçon 16 de Physique en Terminale C • Thème 4",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/15953-tle-d-phy-l16-modele-ondulatoire-de-la-lumiere-by-tehua",
  theme: { number: 4, title: "La lumière : onde ou particule" },
  chapterNumber: 16,
  title: "Modèle ondulatoire de la lumière",
  description: "Observer diffraction et interférences, mesurer une longueur d’onde, calculer les franges de Young et situer la lumière dans le spectre électromagnétique.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Expliquer la diffraction par une fente ou un trou et exploiter θc≈λ/a.",
    "Établir L≈2Dλ/a et mesurer une longueur d’onde au laboratoire.",
    "Interpréter les interférences de Young avec deux sources cohérentes.",
    "Utiliser δ≈ay/D, les conditions constructive et destructive et i=λD/a.",
    "Relier période, fréquence, longueur d’onde, célérité et énergie d’un photon.",
    "Classer les domaines du spectre électromagnétique et citer leurs usages.",
    "Résoudre fidèlement l’évaluation et tous les exercices du support en corrigeant leurs coquilles.",
  ],
  modules: [{
    id: "wave-light-mastery",
    title: "Maîtriser le modèle ondulatoire de la lumière",
    description: "De la fente de diffraction au spectre électromagnétique, neuf niveaux fidèles aux neuf pages du support ivoirien.",
    lessons: builtLevels,
  }],
};

export const waveLightPaths: LearningPath[] = [waveLightPath];
