import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L6_Solutions aqueuses-Notion de pH.pdf";

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
      tip: "Une concentration se calcule toujours avec le volume de LA solution finale, pas celui du solvant ajouté.",
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
    id: "water-solvent-properties",
    title: "L’eau, solvant et conducteur",
    summary: "Reconnaître les quatre pouvoirs solvants de l’eau et expliquer pourquoi l’eau pure conduit faiblement le courant.",
    pages: "1",
    section: "1. Quelques propriétés de l’eau",
    durationMinutes: 20,
    xp: 45,
    body: String.raw`## Le pouvoir solvant de l’eau

L’eau est un **solvant dipolaire**. Cette structure lui donne quatre pouvoirs :

| Pouvoir | Ce qu’il fait |
|---|---|
| **ionisant** | crée des ions à partir de molécules |
| **dissociant** | sépare les ions déjà présents dans un cristal |
| **hydratant** | entoure chaque ion de molécules d’eau |
| **dispersant** | répartit les ions dans tout le volume |

## La conductibilité électrique de l’eau

Un montage simple — deux électrodes plongées dans de l’**eau distillée**, reliées à un **galvanomètre** — révèle une **faible intensité** de courant.

**L’eau pure conduit donc faiblement le courant électrique.** Elle ne contient pas que des molécules d’eau : elle contient aussi des **ions hydronium $\mathrm{H_3O^+}$** et des **ions hydroxyde $\mathrm{OH^-}$**.

Ce sont **ces ions**, et eux seuls, qui sont responsables de la conductibilité.

> **Astuce mémoire de Davy.** Retiens la chaîne logique : *l’eau conduit un peu* → *donc elle contient des ions* → *donc elle se transforme un peu elle-même*. Cette dernière étape est l’**autoprotolyse**, l’objet du niveau suivant. La conductibilité n’est pas une curiosité : c’est la preuve expérimentale qu’une réaction se déroule dans l’eau pure.

> **Erreur fréquente.** Dire que l’eau pure « ne conduit pas ». Elle conduit **faiblement** — le galvanomètre le décèle. C’est une différence de degré, pas de nature, et c’est toute la leçon qui en découle.`,
    keyPoint: "L’eau est un solvant ionisant, dissociant, hydratant et dispersant. Elle conduit faiblement le courant grâce aux ions $\\mathrm{H_3O^+}$ et $\\mathrm{OH^-}$ qu’elle contient.",
    example: "Le galvanomètre décèle une faible intensité dans l’eau distillée : la preuve que des ions y sont présents.",
    methodSteps: [
      "Rappelle que l’eau est un solvant dipolaire.",
      "Cite ses quatre pouvoirs : ionisant, dissociant, hydratant, dispersant.",
      "Relie la conductibilité observée à la présence d’ions.",
      "Nomme ces ions : $\\mathrm{H_3O^+}$ et $\\mathrm{OH^-}$.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les quatre pouvoirs de l’eau",
      instruction: "Sélectionne un pouvoir pour voir ce qu’il produit sur un soluté.",
      observation: "Ces quatre pouvoirs ne sont pas indépendants : ils décrivent les étapes successives par lesquelles un cristal ionique se retrouve dispersé en solution.",
      rootLabel: "L’eau, solvant dipolaire",
      rootDetail: "Que fait-elle subir au soluté ?",
      nodes: [
        { id: "ionisant", label: "Pouvoir ionisant", role: "crée des ions", detail: "L’eau transforme certaines molécules neutres en ions. C’est ce qui se produit avec le chlorure d’hydrogène gazeux, qui donne des ions H₃O⁺ et Cl⁻ en solution." },
        { id: "dissociant", label: "Pouvoir dissociant", role: "sépare les ions du cristal", detail: "Au contact d’un cristal ionique, l’agitation des molécules d’eau rompt les liaisons électrostatiques et disloque le cristal. C’est la première étape de la dissolution." },
        { id: "hydratant", label: "Pouvoir hydratant", role: "entoure chaque ion", detail: "Les ions libérés s’entourent de molécules d’eau par attraction électrostatique. En solution aqueuse, les ions ne sont jamais nus : ils sont hydratés." },
        { id: "dispersant", label: "Pouvoir dispersant", role: "répartit dans le volume", detail: "Sous l’effet de l’agitation thermique, les ions hydratés se répartissent progressivement dans toute la solution. Une agitation mécanique accélère cette étape sans la changer." },
      ],
    },
    questions: [
      choice("L’eau est un solvant…", ["ionisant, dissociant, hydratant et dispersant", "uniquement dissociant", "uniquement hydratant"], 0, "Les quatre pouvoirs du cours.", "1.1 Pouvoir solvant"),
      choice("L’eau pure…", ["conduit faiblement le courant électrique", "ne conduit pas du tout le courant", "conduit très bien le courant"], 0, "Le galvanomètre décèle une faible intensité.", "1.2 Conductibilité", 2),
      short("Quels sont les deux ions responsables de la conductibilité de l’eau pure ?", ["H3O+ et OH-", "h3o+ et oh-", "hydronium et hydroxyde", "ion hydronium et ion hydroxyde"], "$\\mathrm{H_3O^+}$ et $\\mathrm{OH^-}$.", "1.2 Conductibilité", 2),
      choice("Quel appareil décèle la faible intensité traversant l’eau distillée ?", ["un galvanomètre", "un pH-mètre", "un voltmètre"], 0, "Montage du cours.", "1.2 Conductibilité"),
      choice("Que prouve la conductibilité de l’eau pure ?", ["qu’elle contient des ions", "qu’elle contient des impuretés", "qu’elle est chauffée"], 0, "C’est la preuve expérimentale de l’autoprotolyse.", "1.2 Conductibilité", 2),
    ],
  },
  {
    id: "water-autoprotolysis",
    title: "L’autoprotolyse de l’eau et le produit ionique",
    summary: "Écrire l’équation d’autoprotolyse, définir le produit ionique Ke et retenir qu’il ne dépend que de la température.",
    pages: "2",
    section: "2. Autoprotolyse de l’eau",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## L’équation

Les ions $\mathrm{H_3O^+}$ et $\mathrm{OH^-}$ de l’eau résultent d’une **réaction d’équilibre** qui se déroule dans l’eau elle-même. Cette **auto-ionisation** s’appelle l’**autoprotolyse de l’eau** :

$$\mathrm{H_2O + H_2O \rightleftharpoons H_3O^+ + OH^-}$$

Une molécule d’eau cède un proton à une autre. La **double flèche est obligatoire** : c’est un équilibre, et il est très peu déplacé vers la droite — d’où la faible conductibilité observée.

## Le produit ionique

Le produit des concentrations des deux ions est une **constante**, notée $K_e$ :

$$\boxed{\;K_e = [\mathrm{H_3O^+}] \times [\mathrm{OH^-}]\;}$$

$K_e$ est **sans unité**, et sa valeur **ne dépend que de la température** :

| Température | $K_e$ |
|---|---|
| 25 °C | $10^{-14}$ |
| 60 °C | $9{,}6 \times 10^{-14}$ |

## À quoi ça sert

C’est la relation qui permet de **passer d’un ion à l’autre**. Connaissant l’un, on obtient toujours l’autre :

$$[\mathrm{OH^-}] = \frac{K_e}{[\mathrm{H_3O^+}]} \qquad\text{et}\qquad [\mathrm{H_3O^+}] = \frac{K_e}{[\mathrm{OH^-}]}$$

> **Astuce mémoire de Davy.** Le $K_e$ est le **pont** entre les deux ions. Dès qu’un énoncé te donne une seule des deux concentrations, ta première réflexion doit être : *l’autre s’en déduit par $K_e$*. C’est vrai dans **toute** solution aqueuse, acide ou basique, pas seulement dans l’eau pure.

> **Erreur fréquente.** Écrire « $[\mathrm{H_3O^+}][\mathrm{OH^-}] = 10^{-14}$ à toute température ». C’est **faux** : la valeur $10^{-14}$ ne vaut qu’à 25 °C. À 60 °C, le produit ionique vaut $9{,}6\times10^{-14}$.`,
    keyPoint: "$\\mathrm{H_2O + H_2O \\rightleftharpoons H_3O^+ + OH^-}$. $K_e = [\\mathrm{H_3O^+}][\\mathrm{OH^-}]$, sans unité, ne dépendant que de la température ($10^{-14}$ à 25 °C).",
    example: "À 25 °C, si $[\\mathrm{H_3O^+}] = 10^{-5}$ mol·L⁻¹, alors $[\\mathrm{OH^-}] = 10^{-14}/10^{-5} = 10^{-9}$ mol·L⁻¹.",
    methodSteps: [
      "Écris l’autoprotolyse avec une double flèche : c’est un équilibre.",
      "Pose $K_e = [\\mathrm{H_3O^+}][\\mathrm{OH^-}]$.",
      "Vérifie la température avant d’utiliser la valeur $10^{-14}$.",
      "Déduis la concentration manquante en divisant $K_e$ par celle qui est connue.",
    ],
    interaction: timeline(
      [
        { label: "Deux molécules d’eau se rencontrent", shortLabel: "Rencontre", detail: "H₂O + H₂O. L’une va jouer le rôle d’acide, l’autre celui de base : c’est ce qui rend l’eau capable de réagir sur elle-même." },
        { label: "Un proton passe de l’une à l’autre", shortLabel: "Transfert", detail: "La molécule qui cède un proton devient un ion hydroxyde OH⁻ ; celle qui le capte devient un ion hydronium H₃O⁺. D’où le nom d’autoprotolyse : proto pour proton, auto parce que l’eau agit sur elle-même." },
        { label: "Un équilibre s’installe", shortLabel: "Équilibre", detail: "H₂O + H₂O ⇌ H₃O⁺ + OH⁻. L’équilibre est très peu déplacé vers la droite, ce qui explique la faible conductibilité de l’eau pure. La double flèche est obligatoire." },
        { label: "Le produit des concentrations est constant", shortLabel: "Ke", detail: "Ke = [H₃O⁺][OH⁻], sans unité, fonction de la seule température : 10⁻¹⁴ à 25 °C, 9,6 × 10⁻¹⁴ à 60 °C. C’est le pont qui relie les deux concentrations dans toute solution aqueuse." },
      ],
      "Comment l’eau fabrique ses propres ions",
      "Parcours les quatre étapes : elles expliquent d’où viennent les ions mesurés au niveau précédent.",
      "L’autoprotolyse relie l’observation expérimentale — l’eau conduit un peu — à la relation quantitative Ke, qui servira dans tous les calculs de la leçon.",
    ),
    questions: [
      short("Écris l’équation de l’autoprotolyse de l’eau.", ["H2O + H2O = H3O+ + OH-", "2H2O = H3O+ + OH-", "H2O+H2O<=>H3O++OH-"], "$\\mathrm{H_2O + H_2O \\rightleftharpoons H_3O^+ + OH^-}$, avec une double flèche.", "2.1 Équation", 2),
      choice("« L’équation de l’auto-ionisation de l’eau est $\\mathrm{H_2O + H_2O \\to H_3O^+ + OH^-}$ » (flèche simple). Cette affirmation est…", ["fausse", "vraie"], 0, "C’est un équilibre : la double flèche est obligatoire.", "Activité d’application 1 - item 4", 2),
      choice("« À toute température, $[\\mathrm{H_3O^+}][\\mathrm{OH^-}] = 10^{-14}$ ». Cette affirmation est…", ["fausse", "vraie"], 0, "$10^{-14}$ ne vaut qu’à 25 °C.", "Activité d’application 1 - item 2", 2),
      choice("Le produit ionique de l’eau dépend…", ["uniquement de la température", "de la nature du soluté", "du volume de la solution"], 0, "C’est une constante fonction de la seule température.", "2.2 Produit ionique", 2),
      short("À 25 °C, une solution a $[\\mathrm{H_3O^+}] = 10^{-5}$ mol·L⁻¹. Quelle est $[\\mathrm{OH^-}]$ ?", ["10-9", "10^-9", "1e-9", "10^(-9)"], "$[\\mathrm{OH^-}] = K_e/[\\mathrm{H_3O^+}] = 10^{-14}/10^{-5}$.", "2.2 Produit ionique", 2),
      choice("« Toute solution aqueuse contient des ions $\\mathrm{H_3O^+}$ et des ions $\\mathrm{OH^-}$ ». Cette affirmation est…", ["vraie", "fausse"], 0, "L’autoprotolyse a lieu dans toute solution aqueuse.", "Activité d’application 1 - item 1"),
    ],
  },
  {
    id: "dissolution-process",
    title: "Les trois étapes de la dissolution",
    summary: "Décrire la dissociation, la solvatation et la dispersion d’un composé ionique mis dans l’eau.",
    pages: "2",
    section: "3.1 Processus de la dissolution des solutés dans l’eau",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## Trois étapes successives

La dissolution d’un composé ionique dans l’eau se fait en **trois étapes successives**.

**1. La dissociation**, ou dislocation. L’agitation des molécules d’eau, au contact du cristal ionique, **rompt les liaisons électrostatiques** et disloque le cristal.

**2. La solvatation**, ou **hydratation** lorsque le solvant est l’eau. Les ions libérés **s’entourent de molécules d’eau** par attraction électrostatique. En solution aqueuse, les ions sont donc toujours **hydratés**.

**3. La dispersion.** Sous l’effet de l’**agitation thermique**, les ions hydratés se répartissent progressivement dans toute la solution. On peut **agiter mécaniquement** pour accélérer cette étape.

## Écrire une équation de dissolution

L’équation traduit la première étape, avec l’eau notée au-dessus de la flèche :

$$\mathrm{NaCl \xrightarrow{\;H_2O\;} Na^+ + Cl^-}$$
$$\mathrm{CaCl_2 \xrightarrow{\;H_2O\;} Ca^{2+} + 2\,Cl^-}$$
$$\mathrm{FeCl_2 \xrightarrow{\;H_2O\;} Fe^{2+} + 2\,Cl^-}$$

> **Astuce mémoire de Davy.** Les **coefficients** de l’équation de dissolution sont la clé de tous les calculs qui suivent. $\mathrm{CaCl_2}$ libère **deux** ions chlorure par unité dissoute : oublier ce 2, c’est se tromper d’un facteur deux sur $[\mathrm{Cl^-}]$ et rater la vérification de l’électroneutralité.

> **Erreur fréquente.** Confondre agitation **thermique** et agitation **mécanique**. La première est naturelle et suffit à disperser les ions ; la seconde ne fait qu’accélérer le processus, elle n’est pas nécessaire.`,
    keyPoint: "Dissociation, puis solvatation (hydratation dans l’eau), puis dispersion. L’équation $\\mathrm{CaCl_2 \\to Ca^{2+} + 2Cl^-}$ fixe les proportions.",
    example: "$\\mathrm{CaCl_2 \\xrightarrow{H_2O} Ca^{2+} + 2\\,Cl^-}$ : une mole de solide libère une mole de $\\mathrm{Ca^{2+}}$ et **deux** moles de $\\mathrm{Cl^-}$.",
    methodSteps: [
      "Écris la formule du composé ionique et identifie ses deux ions.",
      "Équilibre les charges : c’est ce qui fixe les coefficients.",
      "Place l’eau au-dessus de la flèche pour signaler la dissolution.",
      "Relis les coefficients : ils serviront à calculer chaque concentration ionique.",
    ],
    interaction: timeline(
      [
        { label: "Dissociation", shortLabel: "Dissocier", detail: "Les molécules d’eau, agitées, viennent au contact du cristal ionique et rompent les liaisons électrostatiques qui maintenaient les ions ensemble. Le cristal se disloque." },
        { label: "Solvatation", shortLabel: "Hydrater", detail: "Chaque ion libéré s’entoure de molécules d’eau par attraction électrostatique. On parle de solvatation en général, d’hydratation quand le solvant est l’eau. En solution aqueuse, aucun ion n’est nu." },
        { label: "Dispersion", shortLabel: "Disperser", detail: "L’agitation thermique, naturelle, répartit progressivement les ions hydratés dans tout le volume. Une agitation mécanique accélère cette étape mais n’est pas indispensable." },
      ],
      "Du cristal à la solution homogène",
      "Parcours les trois étapes dans l’ordre : c’est la description attendue à l’examen.",
      "Les trois étapes ne sont pas de simples mots : chacune explique une observation. La dissociation fait disparaître le solide, l’hydratation stabilise les ions, la dispersion rend la solution homogène.",
    ),
    questions: [
      choice("La dissolution d’un composé ionique se fait en…", ["trois étapes : dissociation, solvatation, dispersion", "deux étapes : dissociation et dispersion", "une seule étape"], 0, "Les trois étapes du cours.", "3.1 Processus"),
      short("Comment appelle-t-on la solvatation lorsque le solvant est l’eau ?", ["hydratation", "l'hydratation", "une hydratation"], "Solvatation en général, hydratation dans l’eau.", "3.1 Processus", 2),
      choice("Quelle étape rompt les liaisons électrostatiques du cristal ?", ["la dissociation", "la solvatation", "la dispersion"], 0, "C’est la dislocation du cristal.", "3.1 Processus"),
      choice("Sous l’effet de quelle agitation les ions hydratés se répartissent-ils dans la solution ?", ["l’agitation thermique", "l’agitation mécanique uniquement", "aucune agitation"], 0, "L’agitation mécanique ne fait qu’accélérer le phénomène.", "3.1 Processus", 2),
      short("Écris l’équation de dissolution du chlorure de calcium $\\mathrm{CaCl_2}$ dans l’eau.", ["CaCl2 = Ca2+ + 2Cl-", "CaCl2 -> Ca2+ + 2Cl-", "cacl2 = ca2+ + 2cl-"], "Deux ions chlorure par unité dissoute.", "Situation d’évaluation - question 1", 2),
      short("Écris l’équation de dissolution du chlorure de potassium $\\mathrm{KCl}$ dans l’eau.", ["KCl = K+ + Cl-", "KCl -> K+ + Cl-", "kcl = k+ + cl-"], "Un ion de chaque.", "Situation d’évaluation - question 1"),
    ],
  },
  {
    id: "solution-concentrations",
    title: "Concentrations et électroneutralité",
    summary: "Distinguer concentration de solution, concentration d’une espèce et concentration massique, et poser l’électroneutralité.",
    pages: "3",
    section: "3.2 à 3.4",
    durationMinutes: 26,
    xp: 65,
    body: String.raw`## Trois concentrations à ne pas confondre

| Grandeur | Définition | Relation | Unité |
|---|---|---|---|
| Concentration molaire **de la solution** | quantité de **soluté** dissous par litre | $C = \dfrac{n}{V}$ | mol·L⁻¹ |
| Concentration molaire **d’une espèce** $\mathrm{X}$ | quantité de **cette espèce** par litre | $[\mathrm{X}] = \dfrac{n_X}{V}$ | mol·L⁻¹ |
| Concentration **massique** | masse de substance par litre | $C_m = \dfrac{m}{V}$ | g·L⁻¹ |

Les deux premières se relient par les **coefficients de l’équation de dissolution**. Pour $\mathrm{CaCl_2}$ de concentration $C$ :

$$[\mathrm{Ca^{2+}}] = C \qquad\text{mais}\qquad [\mathrm{Cl^-}] = 2C$$

Et les deux concentrations molaire et massique se relient par la masse molaire :

$$C_m = C \times M$$

## L’électroneutralité

Dans une solution aqueuse, la quantité de **charges positives** est toujours égale à la quantité de **charges négatives** : les solutions aqueuses sont **électriquement neutres**.

En pratique, on écrit l’égalité en **pondérant chaque concentration par la charge de l’ion** :

$$2[\mathrm{Ca^{2+}}] + [\mathrm{K^+}] + [\mathrm{H_3O^+}] = [\mathrm{Cl^-}] + [\mathrm{OH^-}]$$

> **Astuce mémoire de Davy.** Le piège est le **coefficient de charge**. Un ion $\mathrm{Ca^{2+}}$ apporte **deux** charges positives : il compte donc pour $2[\mathrm{Ca^{2+}}]$ dans l’égalité, jamais pour $[\mathrm{Ca^{2+}}]$. Vérifier l’électroneutralité est le meilleur contrôle de tes calculs de concentration : si l’égalité ne tombe pas juste, une concentration est fausse.

> **Erreur fréquente.** Calculer une concentration en divisant par le **volume d’eau ajouté** au lieu du **volume de la solution finale**. Quand on mélange 400 mL et 700 mL, le volume à utiliser est 1100 mL — c’est-à-dire 1,1 L — pour **toutes** les espèces du mélange.`,
    keyPoint: "$C = n/V$, $[\\mathrm{X}] = n_X/V$, $C_m = m/V = C \\times M$. Électroneutralité : somme des charges positives = somme des charges négatives, chaque ion pondéré par sa charge.",
    example: "Une solution de $\\mathrm{CaCl_2}$ à $C = 0{,}2$ mol·L⁻¹ contient $[\\mathrm{Ca^{2+}}] = 0{,}2$ et $[\\mathrm{Cl^-}] = 0{,}4$ mol·L⁻¹.",
    methodSteps: [
      "Calcule la quantité de matière du soluté : $n = m/M$.",
      "Divise par le volume de **la solution**, pas celui du solvant.",
      "Applique les coefficients de dissolution pour chaque ion.",
      "Vérifie l’électroneutralité en pondérant chaque ion par sa charge.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Quelle concentration calcule-t-on ?",
      instruction: "Sélectionne une grandeur pour voir sa définition et le piège qui lui est propre.",
      observation: "Trois grandeurs, un seul volume : celui de la solution finale. La plupart des erreurs d’examen viennent de ce volume, et non de la formule.",
      rootLabel: "Une solution aqueuse",
      rootDetail: "Que cherche-t-on à quantifier ?",
      nodes: [
        { id: "solution", label: "Concentration de la solution", role: "C = n/V", detail: "Quantité de soluté dissous par litre de solution. Pour NaCl : C = m/(M·V). Attention, elle ne se confond pas avec les concentrations ioniques dès que le composé libère plusieurs ions identiques." },
        { id: "espece", label: "Concentration d’une espèce", role: "[X] = n_X / V", detail: "Quantité de l’espèce X par litre de solution. Elle se déduit de C par les coefficients de l’équation de dissolution : pour CaCl₂, [Ca²⁺] = C mais [Cl⁻] = 2C." },
        { id: "massique", label: "Concentration massique", role: "Cm = m/V = C × M", detail: "Masse de substance dissoute par litre, en g·L⁻¹. Le lien avec la concentration molaire passe par la masse molaire : Cm = C × M. C’est la réponse de l’activité d’application 2." },
        { id: "neutralite", label: "Électroneutralité", role: "Σ charges + = Σ charges −", detail: "Chaque ion compte pour sa concentration multipliée par sa charge. Un ion Ca²⁺ pèse 2[Ca²⁺]. C’est le meilleur contrôle de cohérence d’un calcul de concentrations." },
      ],
    },
    questions: [
      choice("La concentration molaire volumique d’une espèce $\\mathrm{X}$ s’écrit…", ["$[\\mathrm{X}] = n_X / V$", "$[\\mathrm{X}] = V \\cdot n_X$", "$[\\mathrm{X}] = V / n_X$"], 0, "Quantité de $\\mathrm{X}$ par litre de solution.", "Activité d’application 2 - question 1", 2),
      choice("La concentration massique $C_m$ est liée à la concentration molaire par…", ["$C_m = [\\mathrm{X}] \\times M$", "$C_m = [\\mathrm{X}] / M$", "$C_m = M / [\\mathrm{X}]$"], 0, "Réponse 2.b de l’activité d’application.", "Activité d’application 2 - question 2", 2),
      short("Une solution de $\\mathrm{CaCl_2}$ a une concentration $C = 0{,}2$ mol·L⁻¹. Quelle est $[\\mathrm{Cl^-}]$, en mol·L⁻¹ ?", ["0,4", "0.4", "0,4 mol/L"], "Deux chlorures par unité de $\\mathrm{CaCl_2}$.", "3.3 Concentration d’une espèce", 2),
      choice("Dans l’écriture de l’électroneutralité, un ion $\\mathrm{Ca^{2+}}$ compte pour…", ["$2[\\mathrm{Ca^{2+}}]$", "$[\\mathrm{Ca^{2+}}]$", "$[\\mathrm{Ca^{2+}}]/2$"], 0, "Chaque ion est pondéré par sa charge.", "3.4 Électroneutralité", 3),
      short("On mélange 400 mL et 700 mL de deux solutions. Quel volume utiliser pour les concentrations du mélange, en L ?", ["1,1", "1.1", "1,1 L", "1.1 L"], "$400 + 700 = 1100$ mL $= 1{,}1$ L.", "Situation d’évaluation - question 3.2", 2),
      choice("Une solution aqueuse est…", ["toujours électriquement neutre", "positive si elle contient un cation", "négative si elle contient un anion"], 0, "C’est le principe d’électroneutralité.", "3.4 Électroneutralité"),
    ],
  },
  {
    id: "ph-definition-classification",
    title: "Le pH : expression, mesure et classification",
    summary: "Calculer un pH à partir de la concentration en ions hydronium, et classer une solution en acide, neutre ou basique.",
    pages: "4",
    section: "4. pH d’une solution aqueuse",
    durationMinutes: 28,
    xp: 75,
    body: String.raw`## L’expression

$$\boxed{\;pH = -\log[\mathrm{H_3O^+}] \qquad\Longleftrightarrow\qquad [\mathrm{H_3O^+}] = 10^{-pH}\;}$$

À 25 °C, le pH varie de **0 à 14**.

## La mesure

Deux instruments :

- le **papier pH**, qui donne une valeur approchée par comparaison de couleurs ;
- le **pH-mètre**, qui donne une mesure précise.

## La classification

| Zone | pH | Relation entre les ions |
|---|---|---|
| Solutions **acides** | $0 \le pH < 7$ | $[\mathrm{H_3O^+}] > [\mathrm{OH^-}]$ |
| Solution **neutre** | $pH = 7$ | $[\mathrm{H_3O^+}] = [\mathrm{OH^-}]$ |
| Solutions **basiques** | $7 < pH \le 14$ | $[\mathrm{H_3O^+}] < [\mathrm{OH^-}]$ |

Plus le pH est **petit**, plus la solution est **acide**. Plus il est **grand**, plus elle est **basique**.

## L’exemple du cours

On mesure $pH = 2{,}3$ à 25 °C. Alors :

$$[\mathrm{H_3O^+}] = 10^{-2,3} = 5{,}01\times10^{-3} \text{ mol·L}^{-1}$$
$$[\mathrm{OH^-}] = \frac{K_e}{[\mathrm{H_3O^+}]} = \frac{10^{-14}}{5{,}01\times10^{-3}} = 1{,}99\times10^{-12} \text{ mol·L}^{-1}$$

La solution est nettement **acide** : $[\mathrm{H_3O^+}]$ dépasse $[\mathrm{OH^-}]$ de neuf ordres de grandeur.

> **Astuce mémoire de Davy.** Le pH est un **logarithme** : une unité de pH en moins, c’est **dix fois plus** d’ions hydronium. Un jus de citron à pH 2,3 est donc environ **50 000 fois** plus acide que l’eau pure à pH 7. C’est ce qui rend l’échelle si commode : elle comprime quatorze ordres de grandeur en quatorze graduations.

> **Erreur fréquente.** Oublier le signe moins. $pH = -\log[\mathrm{H_3O^+}]$, jamais $\log[\mathrm{H_3O^+}]$ : les concentrations étant inférieures à 1, leur logarithme est négatif, et le signe moins rend le pH positif.`,
    keyPoint: "$pH = -\\log[\\mathrm{H_3O^+}]$ et $[\\mathrm{H_3O^+}] = 10^{-pH}$. Acide si $pH < 7$, neutre à 7, basique au-delà, à 25 °C.",
    example: "$pH = 2{,}3$ donne $[\\mathrm{H_3O^+}] = 5{,}01\\times10^{-3}$ et $[\\mathrm{OH^-}] = 1{,}99\\times10^{-12}$ mol·L⁻¹ : solution acide.",
    methodSteps: [
      "Si le pH est donné, calcule $[\\mathrm{H_3O^+}] = 10^{-pH}$.",
      "Si une concentration est donnée, calcule $pH = -\\log[\\mathrm{H_3O^+}]$.",
      "Déduis l’autre ion par $K_e$, en vérifiant la température.",
      "Conclus sur le caractère acide, neutre ou basique en comparant à 7.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "L’échelle des pH à 25 °C",
      instruction: "Sélectionne une zone pour voir la relation entre les deux ions.",
      observation: "Le point 7 n’a rien d’arbitraire : c’est la valeur pour laquelle les deux concentrations sont égales, chacune valant 10⁻⁷ mol·L⁻¹ puisque leur produit vaut 10⁻¹⁴.",
      rootLabel: "pH d’une solution aqueuse à 25 °C",
      rootDetail: "Où se situe-t-il sur l’échelle de 0 à 14 ?",
      nodes: [
        { id: "acide", label: "Zone acide", role: "0 ≤ pH < 7", detail: "[H₃O⁺] > [OH⁻]. Plus le pH est petit, plus la solution est acide. Exemple du cours : un jus de citron à pH 2,3, où [H₃O⁺] = 5,01 × 10⁻³ mol·L⁻¹." },
        { id: "neutre", label: "Solution neutre", role: "pH = 7", detail: "[H₃O⁺] = [OH⁻] = 10⁻⁷ mol·L⁻¹. C’est le cas de l’eau pure à 25 °C : les deux ions, produits en quantités égales par l’autoprotolyse, se retrouvent à la même concentration." },
        { id: "basique", label: "Zone basique", role: "7 < pH ≤ 14", detail: "[H₃O⁺] < [OH⁻]. Plus le pH est grand, plus la solution est basique. Une solution d’hydroxyde de sodium se situe dans cette zone." },
      ],
    },
    questions: [
      short("Écris l’expression du pH en fonction de $[\\mathrm{H_3O^+}]$.", ["pH = -log[H3O+]", "-log[H3O+]", "ph=-log[h3o+]"], "Le signe moins est indispensable.", "4.1 Expression", 2),
      short("Une solution a $[\\mathrm{H_3O^+}] = 3\\times10^{-3}$ mol·L⁻¹. Quel est son pH ? (deux décimales)", ["2,52", "2.52"], "$-\\log(3\\times10^{-3}) = 2{,}52$.", "Exercice 2 - question 1.1", 2),
      short("Une solution a $[\\mathrm{OH^-}] = 10^{-5}$ mol·L⁻¹ à 25 °C. Quel est son pH ?", ["9", "pH = 9"], "$[\\mathrm{H_3O^+}] = 10^{-14}/10^{-5} = 10^{-9}$, donc $pH = 9$.", "Exercice 2 - question 1.2", 3),
      short("Quelle est la concentration en ions hydronium d’une solution de pH = 12 ? (en mol·L⁻¹)", ["10-12", "10^-12", "1e-12"], "$[\\mathrm{H_3O^+}] = 10^{-pH}$.", "Exercice 2 - question 2.1", 2),
      choice("Une solution de pH = 9 est…", ["basique", "acide", "neutre"], 0, "Au-delà de 7, la solution est basique.", "4.3 Classification"),
      choice("Dans une solution acide…", ["$[\\mathrm{H_3O^+}] > [\\mathrm{OH^-}]$", "$[\\mathrm{H_3O^+}] < [\\mathrm{OH^-}]$", "$[\\mathrm{H_3O^+}] = [\\mathrm{OH^-}]$"], 0, "C’est la définition de la zone acide.", "4.3 Classification", 2),
      choice("Quels instruments permettent de mesurer un pH ?", ["le papier pH et le pH-mètre", "le galvanomètre et le voltmètre", "la fiole jaugée et la burette"], 0, "Documents 1 et 2 du cours.", "4.2 Mesure"),
    ],
  },
  {
    id: "ph-concentration-workshop",
    title: "Atelier : concentrations, pH et vocabulaire",
    summary: "Traiter les exercices officiels de dissolution, de conversion pH ↔ concentration et de vocabulaire des solutions.",
    pages: "6-7",
    section: "III. Exercices 1 à 4",
    durationMinutes: 30,
    xp: 80,
    kind: "practice",
    body: String.raw`## Exercice 1 — dissoudre du chlorure de sodium

On dissout 10 g de $\mathrm{NaCl}$ dans 100 mL d’eau. Avec $M = 58{,}5$ g·mol⁻¹ :

$$C = \frac{m}{M \times V} = \frac{10}{58{,}5 \times 0{,}1} = 1{,}71 \text{ mol·L}^{-1}$$
$$C_m = \frac{m}{V} = \frac{10}{0{,}1} = 100 \text{ g·L}^{-1}$$

L’équation $\mathrm{NaCl \to Na^+ + Cl^-}$ donne un ion de chaque, donc :

$$[\mathrm{Na^+}] = [\mathrm{Cl^-}] = C = 1{,}71 \text{ mol·L}^{-1}$$

## Exercice 2 — passer du pH aux concentrations, et retour

| Donnée | Résultat |
|---|---|
| $[\mathrm{H_3O^+}] = 3\times10^{-3}$ | $pH = -\log(3\times10^{-3}) = 2{,}52$ |
| $[\mathrm{OH^-}] = 10^{-5}$ | $[\mathrm{H_3O^+}] = 10^{-9}$, donc $pH = 9$ |
| $pH = 12$ | $[\mathrm{H_3O^+}] = 10^{-12}$ mol·L⁻¹ |
| $pH = 2{,}4$ | $[\mathrm{H_3O^+}] = 10^{-2,4} = 4\times10^{-3}$ mol·L⁻¹ |

Le deuxième cas est le seul qui demande **deux** étapes : passer d’abord par $K_e$, puis appliquer le logarithme.

## Exercice 3 — le vocabulaire

On prépare un mélange d’hydroxyde de sodium et d’eau distillée en grande quantité.

| Question | Réponse |
|---|---|
| L’opération effectuée est… | une **dissolution** |
| Le mélange obtenu est… | **basique** |
| L’eau représente… | le **solvant** |
| Le mélange est électriquement… | **neutre** |

## Exercice 4 — le jus de citron

$pH = 2{,}3$ à 25 °C, pour un verre de 100 cm³ :

$$[\mathrm{H_3O^+}] = 10^{-2,3} = 5{,}01\times10^{-3} \text{ mol·L}^{-1} \quad\Rightarrow\quad n = 5{,}01\times10^{-4} \text{ mol}$$
$$[\mathrm{OH^-}] = 1{,}99\times10^{-12} \text{ mol·L}^{-1} \quad\Rightarrow\quad n = 1{,}99\times10^{-13} \text{ mol}$$

> **Astuce mémoire de Davy.** Distingue bien **concentration** et **quantité de matière**. La concentration ne dépend pas du volume prélevé ; la quantité de matière, si. Deux verres de tailles différentes du même jus ont le même pH mais pas le même nombre de moles d’ions.`,
    keyPoint: "$C = m/(MV)$, $C_m = m/V$. Du pH à la concentration : $10^{-pH}$. De $[\\mathrm{OH^-}]$ au pH : passer d’abord par $K_e$.",
    example: "10 g de $\\mathrm{NaCl}$ dans 100 mL donnent $C = 1{,}71$ mol·L⁻¹ et $C_m = 100$ g·L⁻¹.",
    methodSteps: [
      "Repère si l’énoncé donne une masse, une concentration ou un pH.",
      "Passe par la quantité de matière $n = m/M$ si nécessaire.",
      "Pour une concentration ionique, applique les coefficients de dissolution.",
      "Pour une quantité de matière d’ion, multiplie la concentration par le volume prélevé.",
    ],
    interaction: timeline(
      [
        { label: "De la masse à la concentration", shortLabel: "m → C", detail: "n = m/M, puis C = n/V. Pour 10 g de NaCl (M = 58,5) dans 100 mL : C = 10/(58,5 × 0,1) = 1,71 mol·L⁻¹." },
        { label: "De la concentration aux ions", shortLabel: "C → [ion]", detail: "Les coefficients de l’équation de dissolution font le lien. NaCl donne un ion de chaque, donc [Na⁺] = [Cl⁻] = C. CaCl₂ donnerait [Cl⁻] = 2C." },
        { label: "De la concentration au pH", shortLabel: "[H₃O⁺] → pH", detail: "pH = −log[H₃O⁺]. Si c’est [OH⁻] qui est donné, il faut d’abord passer par Ke : [H₃O⁺] = Ke/[OH⁻]." },
        { label: "Du pH à la quantité de matière", shortLabel: "pH → n", detail: "[H₃O⁺] = 10⁻ᵖᴴ, puis n = [H₃O⁺] × V. Pour un jus à pH 2,3 dans un verre de 100 cm³ : n = 5,01 × 10⁻³ × 0,1 = 5,01 × 10⁻⁴ mol." },
      ],
      "Les quatre conversions de la leçon",
      "Parcours les quatre passages : tous les exercices en sont des combinaisons.",
      "Une seule conversion demande deux étapes : celle qui part de [OH⁻] pour arriver au pH. C’est aussi celle qui est le plus souvent ratée.",
    ),
    questions: [
      short("Exercice 1 : quelle est la concentration molaire d’une solution de 10 g de $\\mathrm{NaCl}$ dans 100 mL ? (en mol·L⁻¹, deux décimales)", ["1,71", "1.71", "1,71 mol/L"], "$C = 10/(58{,}5 \\times 0{,}1) = 1{,}71$.", "Exercice 1 - question 1.1", 2),
      short("Exercice 1 : quelle est la concentration massique de cette solution ? (en g·L⁻¹)", ["100", "100 g/L"], "$C_m = 10/0{,}1 = 100$ g·L⁻¹.", "Exercice 1 - question 1.2", 2),
      short("Exercice 2 : quelle est la concentration en ions hydronium d’une solution de pH = 2,4 ? (en mol·L⁻¹)", ["4.10-3", "4e-3", "0,004", "4x10-3", "4 10-3"], "$10^{-2,4} = 4\\times10^{-3}$.", "Exercice 2 - question 2.2", 2),
      choice("Exercice 3 : dissoudre de l’hydroxyde de sodium dans beaucoup d’eau distillée est…", ["une dissolution", "une hydratation", "une dilution"], 0, "On dissout un soluté solide dans un solvant.", "Exercice 3 - question 1", 2),
      choice("Exercice 3 : le mélange obtenu avec de l’hydroxyde de sodium est…", ["basique", "acide", "neutre"], 0, "L’hydroxyde de sodium libère des ions $\\mathrm{OH^-}$.", "Exercice 3 - question 2"),
      choice("Exercice 3 : dans ce mélange, l’eau représente…", ["le solvant", "le soluté", "la solution"], 0, "Le soluté est l’hydroxyde de sodium.", "Exercice 3 - question 3"),
      short("Exercice 4 : quelle quantité d’ions hydronium contient un verre de 100 cm³ de jus à pH 2,3 ? (en mol)", ["5,01.10-4", "5.01e-4", "5,01 10-4", "5.01x10-4"], "$n = 5{,}01\\times10^{-3} \\times 0{,}1 = 5{,}01\\times10^{-4}$ mol.", "Exercice 4 - question 2", 3),
    ],
  },
  {
    id: "ionic-mixture-mission",
    title: "Mission finale : mélanges ioniques et électroneutralité",
    summary: "Faire le bilan des ions d’un mélange, calculer chaque concentration avec le bon volume et vérifier l’électroneutralité.",
    pages: "4-5, 7-9",
    section: "Situation d’évaluation et exercices 5 et 6",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

On dissout $m_1 = 10$ g de **chlorure de calcium** $\mathrm{CaCl_2}$ dans $V_1 = 400$ mL d’eau, et $m_2 = 30$ g de **chlorure de potassium** $\mathrm{KCl}$ dans $V_2 = 700$ mL. On **mélange** ensuite les deux solutions.

*Données* : $M(\mathrm{Ca}) = 40$, $M(\mathrm{Cl}) = 35{,}5$, $M(\mathrm{K}) = 39$ g·mol⁻¹.

## Le raisonnement

**1. Les équations de dissolution.**

$$\mathrm{CaCl_2 \xrightarrow{\;H_2O\;} Ca^{2+} + 2\,Cl^-} \qquad \mathrm{KCl \xrightarrow{\;H_2O\;} K^+ + Cl^-}$$

**2. Le bilan des ions.** Dans la solution de $\mathrm{CaCl_2}$ : $\mathrm{Ca^{2+}}$, $\mathrm{Cl^-}$, plus $\mathrm{H_3O^+}$ et $\mathrm{OH^-}$ issus de l’autoprotolyse. Dans celle de $\mathrm{KCl}$ : $\mathrm{K^+}$, $\mathrm{Cl^-}$, $\mathrm{H_3O^+}$ et $\mathrm{OH^-}$.

**3. Les quantités de matière.**

$$M(\mathrm{CaCl_2}) = 40 + 2\times35{,}5 = 111 \text{ g·mol}^{-1} \Rightarrow n_1 = \frac{10}{111} = 0{,}0901 \text{ mol}$$
$$M(\mathrm{KCl}) = 39 + 35{,}5 = 74{,}5 \text{ g·mol}^{-1} \Rightarrow n_2 = \frac{30}{74{,}5} = 0{,}403 \text{ mol}$$

**4. Dans chaque solution séparée.**

| | $\mathrm{Ca^{2+}}$ | $\mathrm{K^+}$ | $\mathrm{Cl^-}$ |
|---|---|---|---|
| $\mathrm{CaCl_2}$, 400 mL | $0{,}225$ | — | $0{,}450$ |
| $\mathrm{KCl}$, 700 mL | — | $0{,}576$ | $0{,}576$ |

**5. Dans le mélange.** Le volume total est $400 + 700 = 1100$ mL, soit **1,1 L** :

$$[\mathrm{Ca^{2+}}] = \frac{0{,}0901}{1{,}1} = 0{,}082 \qquad [\mathrm{K^+}] = \frac{0{,}403}{1{,}1} = 0{,}366$$
$$[\mathrm{Cl^-}] = \frac{2(0{,}0901) + 0{,}403}{1{,}1} = \frac{0{,}583}{1{,}1} = 0{,}530 \text{ mol·L}^{-1}$$

**6. L’électroneutralité.**

$$2[\mathrm{Ca^{2+}}] + [\mathrm{K^+}] = 2(0{,}082) + 0{,}366 = 0{,}530 = [\mathrm{Cl^-}] \quad\checkmark$$

L’égalité tombe **exactement** juste : c’est la meilleure preuve que les calculs sont bons.

## Variante 1 — le chlorure de fer II (exercice 5)

On dissout $m = 63{,}5$ g de $\mathrm{FeCl_2}$ ($M = 127$ g·mol⁻¹) dans $V = 500$ mL, ce qui donne, comme l’énoncé l’annonce, une solution de concentration $C_0 = 1$ mol·L⁻¹.

$$\mathrm{FeCl_2 \xrightarrow{\;H_2O\;} Fe^{2+} + 2\,Cl^-}$$
$$n = \frac{63{,}5}{127} = 0{,}5 \text{ mol} \quad\Rightarrow\quad [\mathrm{Fe^{2+}}] = \frac{0{,}5}{0{,}5} = \mathbf{1} \text{ mol·L}^{-1} \quad [\mathrm{Cl^-}] = \mathbf{2} \text{ mol·L}^{-1}$$

**Le mode opératoire.** Dans une fiole jaugée de 500 mL contenant un peu d’eau, introduire les 63,5 g de cristaux pesés à la balance. Après dissolution totale, compléter au trait de jauge à la pissette d’eau distillée, puis homogénéiser.

## Variante 2 — vérifier l’électroneutralité d’un mélange (exercice 6)

$\mathrm{S_1}$ : 0,745 g de $\mathrm{KCl}$ dans 100 mL $\Rightarrow n = 0{,}01$ mol, donc $[\mathrm{K^+}] = [\mathrm{Cl^-}] = 0{,}1$ mol·L⁻¹.

$\mathrm{S_2}$ : 500 mL de soude à 0,1 mol·L⁻¹ $\Rightarrow n = 0{,}05$ mol.

**Le mélange est réalisé dans une fiole jaugée de 1 L** : c’est donc **1 L**, et non 0,5 L, qu’il faut utiliser pour toutes les concentrations du mélange.

$$[\mathrm{K^+}] = [\mathrm{Cl^-}] = 0{,}01 \text{ mol·L}^{-1} \qquad [\mathrm{Na^+}] = [\mathrm{OH^-}] = 0{,}05 \text{ mol·L}^{-1}$$

$$[\mathrm{K^+}] + [\mathrm{Na^+}] = 0{,}06 = [\mathrm{Cl^-}] + [\mathrm{OH^-}] \quad\checkmark$$

**Conclusion :** toute solution aqueuse est électriquement neutre.

> **Astuce mémoire de Davy.** Deux réflexes suffisent à réussir ces trois problèmes. Le premier : **quel volume ?** — toujours celui de la solution finale. Le second : **quels coefficients ?** — ceux de l’équation de dissolution. Les erreurs du document source viennent toutes de l’un ou de l’autre.`,
    keyPoint: "Volume du mélange = somme des volumes. Chaque ion pondéré par sa charge dans l’électroneutralité. $\\mathrm{FeCl_2}$ à 63,5 g dans 500 mL donne $[\\mathrm{Fe^{2+}}] = 1$ et $[\\mathrm{Cl^-}] = 2$ mol·L⁻¹.",
    example: "$2(0{,}082) + 0{,}366 = 0{,}530 = [\\mathrm{Cl^-}]$ : l’électroneutralité du mélange est vérifiée exactement.",
    methodSteps: [
      "Écris les équations de dissolution et relève les coefficients.",
      "Calcule les quantités de matière : elles ne changent pas au mélange.",
      "Divise par le volume **total** du mélange pour obtenir chaque concentration.",
      "Vérifie l’électroneutralité en pondérant chaque ion par sa charge.",
    ],
    interaction: timeline(
      [
        { label: "Écrire les dissolutions", shortLabel: "Équations", detail: "CaCl₂ → Ca²⁺ + 2 Cl⁻ et KCl → K⁺ + Cl⁻. Les coefficients seront réutilisés à chaque étape : le 2 devant Cl⁻ apparaît aussi bien dans le calcul de concentration que dans l’électroneutralité." },
        { label: "Calculer les quantités de matière", shortLabel: "Moles", detail: "n = m/M. Ce sont les seules grandeurs qui ne changent pas quand on mélange : les moles se conservent, les concentrations non." },
        { label: "Diviser par le volume total", shortLabel: "Volume total", detail: "400 + 700 = 1100 mL = 1,1 L. C’est l’erreur la plus fréquente : utiliser le volume d’une seule des deux solutions, ou celui du solvant ajouté au lieu de celui de la solution finale." },
        { label: "Vérifier l’électroneutralité", shortLabel: "Contrôle", detail: "2[Ca²⁺] + [K⁺] = 0,530 et [Cl⁻] = 0,530. L’égalité exacte confirme les calculs. Si elle ne tombe pas juste, une concentration ou un coefficient est faux." },
      ],
      "Traiter un mélange de solutions ioniques",
      "Suis les quatre étapes : elles couvrent la situation d’évaluation comme les exercices 5 et 6.",
      "Les moles se conservent, les concentrations se recalculent. Retenir cette distinction évite la quasi-totalité des erreurs sur les mélanges.",
    ),
    questions: [
      short("Quelle est la masse molaire du chlorure de calcium $\\mathrm{CaCl_2}$, en g·mol⁻¹ ?", ["111", "111 g/mol"], "$40 + 2 \\times 35{,}5 = 111$.", "Situation d’évaluation - question 3.1", 2),
      short("On mélange 400 mL et 700 mL. Quel volume total, en L ?", ["1,1", "1.1", "1,1 L"], "$400 + 700 = 1100$ mL.", "Situation d’évaluation - question 3.2 corrigée", 2),
      short("Dans le mélange, quelle est $[\\mathrm{Cl^-}]$ ? (en mol·L⁻¹, trois décimales)", ["0,530", "0.530", "0,53", "0.53"], "$(2 \\times 0{,}0901 + 0{,}403)/1{,}1 = 0{,}530$.", "Situation d’évaluation - question 3.2", 3),
      choice("Comment s’écrit l’électroneutralité de ce mélange ?", ["$2[\\mathrm{Ca^{2+}}] + [\\mathrm{K^+}] = [\\mathrm{Cl^-}]$", "$[\\mathrm{Ca^{2+}}] + [\\mathrm{K^+}] = [\\mathrm{Cl^-}]$", "$[\\mathrm{Ca^{2+}}] + 2[\\mathrm{K^+}] = [\\mathrm{Cl^-}]$"], 0, "L’ion calcium porte deux charges positives.", "Situation d’évaluation - question 4", 3),
      short("Exercice 5 : quelle est $[\\mathrm{Fe^{2+}}]$ pour 63,5 g de $\\mathrm{FeCl_2}$ ($M = 127$) dans 500 mL ? (en mol·L⁻¹)", ["1", "1 mol/L", "1,0"], "$n = 0{,}5$ mol dans 0,5 L.", "Exercice 5 - question 4 corrigée", 3),
      short("Exercice 5 : quelle est alors $[\\mathrm{Cl^-}]$ ? (en mol·L⁻¹)", ["2", "2 mol/L", "2,0"], "Deux chlorures par $\\mathrm{FeCl_2}$.", "Exercice 5 - question 4 corrigée", 2),
      short("Exercice 6 : après mélange dans une fiole de 1 L, quelle est $[\\mathrm{Na^+}]$ ? (en mol·L⁻¹)", ["0,05", "0.05", "0,05 mol/L"], "$n = 0{,}05$ mol dans 1 L.", "Exercice 6 - question 2.2 corrigée", 3),
      choice("Que peut-on dire de l’électroneutralité d’une solution aqueuse ?", ["toute solution aqueuse est toujours électriquement neutre", "seules les solutions neutres le sont", "cela dépend du pH"], 0, "C’est la conclusion de l’exercice 6.", "Exercice 6 - question 3"),
    ],
    corrections: [
      "Page 5, situation d’évaluation, question 2 : le bilan des ions omet l’ion Ca²⁺, pourtant présent dans la solution de chlorure de calcium et utilisé dès la question suivante. Il est rétabli ici.",
      "Page 5, situation d’évaluation, question 3.2 : le document annonce « V_T = 110 mL » alors que le mélange de 400 mL et 700 mL fait 1100 mL. Ses calculs utilisent bien 1,1 L : il s’agit d’une coquille d’écriture, corrigée ici.",
      "Page 5, situation d’évaluation : le document pose « M(CaCl₂) = 40 + 70 = 111 ». Le terme correct est 2 × 35,5 = 71, et non 70 ; le résultat 111 g·mol⁻¹ est bien celui-là.",
      "Page 8, exercice 5 : le corrigé annonce [Fe²⁺] = 10⁻³ mol·L⁻¹ et [Cl⁻] = 2 × 10⁻³ mol·L⁻¹. Le calcul donne pourtant 63,5/(127 × 0,5) = 1 mol·L⁻¹ et 2 mol·L⁻¹, ce qui est cohérent avec le C₀ = 1 mol·L⁻¹ annoncé par l’énoncé lui-même. La seconde concentration y est de plus étiquetée [Fe²⁺] au lieu de [Cl⁻].",
      "Page 9, exercice 6, question 2.2 : le corrigé calcule les concentrations du mélange en divisant par 0,5 L, alors que l’énoncé précise que le mélange est réalisé dans une fiole jaugée de 1 L. Les valeurs correctes sont [K⁺] = [Cl⁻] = 0,01 mol·L⁻¹ et [Na⁺] = [OH⁻] = 0,05 mol·L⁻¹. L’électroneutralité reste vérifiée, à 0,06 mol·L⁻¹ de chaque côté et non 0,2.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const aqueousSolutionsPhPath: LearningPath = {
  id: "terminale-cd-chemistry-ph",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Chimie générale" },
  chapterNumber: 5,
  title: "Solutions aqueuses : notion de pH",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Expliquer le pouvoir solvant de l’eau et sa conductibilité",
    "Écrire l’autoprotolyse de l’eau et exploiter le produit ionique",
    "Calculer concentrations molaires, massiques et ioniques",
    "Déterminer un pH, classer une solution et vérifier l’électroneutralité d’un mélange",
  ],
  modules: [
    { id: "ph-mastery", title: "Maîtriser les solutions aqueuses et le pH", description: "Un niveau après l’autre, des propriétés de l’eau à l’étude quantitative d’un mélange ionique.", lessons: builtLevels },
  ],
};
