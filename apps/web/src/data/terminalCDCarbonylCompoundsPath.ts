import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L2_Composés carbonylés.pdf";

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
      tip: "Une équation-bilan n’est juste que si elle est équilibrée en atomes ET en charges.",
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
    id: "carbonyl-definition",
    title: "Le groupe carbonyle : aldéhydes et cétones",
    summary: "Reconnaître le groupe carbonyle, écrire la formule brute générale et distinguer un aldéhyde d’une cétone sur la formule.",
    pages: "1",
    section: "1. Définition d’un composé carbonylé",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## Ce qu’est un composé carbonylé

Un **composé carbonylé** est un composé organique oxygéné qui comporte le **groupe carbonyle** :

$$\mathrm{C=O}$$

Sa **formule brute générale** est :

$$\mathrm{C_nH_{2n}O}$$

où $n$ est le nombre d’atomes de carbone.

Les **aldéhydes** et les **cétones** sont des composés carbonylés. Ce qui les sépare n’est pas le groupe carbonyle lui-même — il est identique dans les deux — mais **la place qu’il occupe dans la chaîne**.

## Les deux familles

| | Aldéhyde | Cétone |
|---|---|---|
| Formule générale | $\mathrm{R-CHO}$ | $\mathrm{R_1-CO-R_2}$ |
| Position du carbonyle | **en bout de chaîne** | **à l’intérieur de la chaîne** |
| Le carbone fonctionnel porte | un $\mathrm{H}$ et un groupe $\mathrm{R}$ | deux groupes alkyle |
| Condition sur les groupes | $\mathrm{R}$ = groupe alkyle **ou** $\mathrm{H}$ | $\mathrm{R_1}$ et $\mathrm{R_2}$ **différents de** $\mathrm{H}$ |

> **Astuce mémoire de Davy.** Compte les hydrogènes portés par le carbone du carbonyle. **Un hydrogène → aldéhyde. Aucun → cétone.** C’est ce seul atome d’hydrogène qui rendra plus tard l’aldéhyde réducteur, et la cétone inerte.

## Le cas particulier du méthanal

Quand $\mathrm{R}=\mathrm{H}$, l’aldéhyde s’écrit $\mathrm{H-CHO}$ : c’est le **méthanal**. Son carbone fonctionnel porte **deux** hydrogènes. C’est le seul aldéhyde dans ce cas, et il reste un aldéhyde.

> **Erreur fréquente.** Écrire une « cétone » dont le carbonyle serait en bout de chaîne. C’est impossible : il faudrait que $\mathrm{R_1}$ ou $\mathrm{R_2}$ soit un hydrogène, et on retomberait sur un aldéhyde. Une cétone a donc **au minimum trois carbones**.`,
    keyPoint: "Composé carbonylé : groupe $\\mathrm{C=O}$, formule brute $\\mathrm{C_nH_{2n}O}$. Aldéhyde $\\mathrm{R-CHO}$ en bout de chaîne, cétone $\\mathrm{R_1-CO-R_2}$ à l’intérieur.",
    example: "$\\mathrm{CH_3-CHO}$ porte un hydrogène sur le carbone du carbonyle : c’est un aldéhyde. $\\mathrm{CH_3-CO-CH_3}$ n’en porte aucun : c’est une cétone.",
    methodSteps: [
      "Repère le groupe $\\mathrm{C=O}$ dans la formule.",
      "Regarde ce que porte ce carbone en plus de l’oxygène.",
      "S’il porte au moins un hydrogène, c’est un aldéhyde.",
      "S’il porte deux groupes alkyle, c’est une cétone.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Une seule fonction, deux familles",
      instruction: "Sélectionne une famille pour voir sa formule générale et ce que porte son carbone fonctionnel.",
      observation: "Le groupe carbonyle est le même des deux côtés. Toute la chimie de cette leçon découle d’un seul détail : l’hydrogène présent chez l’aldéhyde, absent chez la cétone.",
      rootLabel: "Groupe carbonyle C=O",
      rootDetail: "Où se trouve-t-il dans la chaîne carbonée ?",
      nodes: [
        { id: "aldehyde", label: "Aldéhyde", role: "en bout de chaîne — R–CHO", detail: "Le carbone fonctionnel porte un atome d’hydrogène et un groupe R (alkyle ou H). Son indice de position est toujours 1. Exemples : méthanal H–CHO, éthanal CH₃–CHO, propanal CH₃–CH₂–CHO. Cet hydrogène le rend réducteur." },
        { id: "cetone", label: "Cétone", role: "à l’intérieur — R₁–CO–R₂", detail: "Le carbone fonctionnel porte deux groupes alkyle, tous deux différents de H, et aucun hydrogène. Il faut donc au moins trois carbones. Exemples : propanone CH₃–CO–CH₃, butan-2-one CH₃–CO–CH₂–CH₃. Sans hydrogène, elle n’est pas réductrice." },
        { id: "methanal", label: "Cas du méthanal", role: "R = H — H–CHO", detail: "Quand R est un hydrogène, le carbone fonctionnel en porte deux. C’est le plus simple des composés carbonylés, et il reste un aldéhyde à part entière : il donne bien un test positif au réactif de Schiff, à Tollens et à Fehling." },
      ],
    },
    questions: [
      choice("Un composé carbonylé est un composé organique oxygéné comportant…", ["le groupe carbonyle $\\mathrm{C=O}$", "le groupe hydroxyle $\\mathrm{-OH}$", "le groupe carboxyle $\\mathrm{-COOH}$", "une double liaison $\\mathrm{C=C}$"], 0, "C’est la définition du cours.", "1. Définition"),
      short("Écris la formule brute générale d’un composé carbonylé à $n$ atomes de carbone.", ["CnH2nO", "C_nH_2nO", "cnh2no"], "Le cours donne $\\mathrm{C_nH_{2n}O}$.", "1. Définition"),
      choice("Dans une cétone $\\mathrm{R_1-CO-R_2}$, les groupes $\\mathrm{R_1}$ et $\\mathrm{R_2}$ sont…", ["tous deux différents de $\\mathrm{H}$", "tous deux égaux à $\\mathrm{H}$", "l’un des deux égal à $\\mathrm{H}$"], 0, "Si l’un valait $\\mathrm{H}$, le composé serait un aldéhyde.", "1. Définition", 2),
      choice("Le composé $\\mathrm{CH_3-CO-CH_2-CH_3}$ est…", ["une cétone", "un aldéhyde", "un alcool"], 0, "Le carbonyle est à l’intérieur de la chaîne, entre deux groupes alkyle.", "2. Nomenclature - exemples"),
      choice("Combien de carbones au minimum une cétone possède-t-elle ?", ["3", "2", "1", "4"], 0, "Il faut un carbone fonctionnel encadré par deux groupes alkyle.", "1. Définition", 2),
      short("Quelle famille correspond à la formule générale $\\mathrm{R-CHO}$ ?", ["aldehyde", "aldéhyde", "un aldéhyde", "les aldéhydes"], "Le carbonyle est en bout de chaîne, avec un hydrogène.", "1. Définition"),
    ],
  },
  {
    id: "carbonyl-nomenclature",
    title: "Nommer un aldéhyde et une cétone",
    summary: "Appliquer les suffixes « al » et « one », placer l’indice du carbone fonctionnel et nommer les composés ramifiés.",
    pages: "1-2",
    section: "2. Nomenclature des aldéhydes et des cétones",
    durationMinutes: 26,
    xp: 55,
    body: String.raw`## La règle, famille par famille

| | Aldéhyde | Cétone |
|---|---|---|
| Règle | On remplace le **« e » final** du nom de l’alcane correspondant par le suffixe **« al »**. | On remplace le **« e » final** du nom de l’alcane correspondant par le suffixe **« one »**, précédé de **l’indice de position** du carbone fonctionnel. |
| Indice du carbone fonctionnel | Toujours **1** — il est donc inutile de l’écrire. | Le **plus faible possible** : on numérote la chaîne à partir de l’extrémité la plus proche du carbonyle. |

## Les exemples du cours

| Aldéhyde | Formule | Cétone | Formule |
|---|---|---|---|
| Éthanal | $\mathrm{CH_3-CHO}$ | Propan-2-one (ou propanone) | $\mathrm{CH_3-CO-CH_3}$ |
| Propanal | $\mathrm{CH_3-CH_2-CHO}$ | Butan-2-one (ou butanone) | $\mathrm{CH_3-CO-CH_2-CH_3}$ |

Pour les cétones les plus simples, le nom courant sans indice — **propanone**, **butanone** — reste accepté : il n’y a qu’une position possible pour le carbonyle.

## Les ramifications

Quand la chaîne porte un groupe méthyle, on le signale par un préfixe **et son indice**, calculé sur la même numérotation que le carbone fonctionnel.

- $\mathrm{CH_3-CH(CH_3)-CHO}$ : la chaîne principale a trois carbones, le carbonyle est en 1, le méthyle en 2 → **2-méthylpropanal**.
- $\mathrm{CH_3-CH(CH_3)-CO-CH_3}$ : chaîne de quatre carbones, carbonyle en 2, méthyle en 3 → **3-méthylbutan-2-one**.

> **Astuce mémoire de Davy.** Numérote **toujours en partant du bout le plus proche du carbonyle**. Chez l’aldéhyde la question ne se pose pas — il est déjà au bout. Chez la cétone, c’est ce choix qui donne « butan-2-one » plutôt que « butan-3-one ».

> **Erreur fréquente.** Écrire « butan-1-one ». Un carbonyle en position 1 porte forcément un hydrogène : ce serait un aldéhyde, donc un « butanal ». **Une cétone ne peut jamais porter l’indice 1.**`,
    keyPoint: "Aldéhyde : suffixe « al », carbone fonctionnel toujours en 1. Cétone : suffixe « one » précédé de l’indice le plus faible.",
    example: "$\\mathrm{CH_3-CH(CH_3)-CO-CH_3}$ : quatre carbones dans la chaîne, carbonyle en 2, méthyle en 3 → 3-méthylbutan-2-one.",
    methodSteps: [
      "Identifie la famille : aldéhyde ou cétone.",
      "Compte les carbones de la chaîne principale et nomme l’alcane correspondant.",
      "Remplace le « e » final par « al » ou par « one ».",
      "Pour une cétone, numérote depuis le bout le plus proche et place l’indice ; ajoute les préfixes des ramifications.",
    ],
    interaction: timeline(
      [
        { label: "Aldéhyde ou cétone ?", shortLabel: "Famille", detail: "Le carbonyle porte-t-il un hydrogène ? Oui → aldéhyde, suffixe « al ». Non → cétone, suffixe « one »." },
        { label: "Compter les carbones", shortLabel: "Chaîne", detail: "La chaîne principale est la plus longue contenant le carbone fonctionnel. Trois carbones → propane, quatre → butane." },
        { label: "Attribuer l’indice", shortLabel: "Numéroter", detail: "On numérote depuis l’extrémité la plus proche du carbonyle. L’aldéhyde reçoit toujours 1 ; la cétone reçoit l’indice le plus faible possible, jamais 1." },
        { label: "Ajouter les préfixes", shortLabel: "Ramifications", detail: "Chaque groupe alkyle latéral est nommé en préfixe avec son indice, calculé sur la même numérotation. Exemple : 3-méthylbutan-2-one." },
      ],
      "Nommer pas à pas",
      "Parcours les quatre étapes dans l’ordre : c’est la démarche à appliquer à chaque exercice.",
      "L’ordre compte : c’est la position du carbonyle qui fixe la numérotation, et non l’inverse. Les ramifications se nomment ensuite, sur cette numérotation déjà décidée.",
    ),
    questions: [
      choice("Pour nommer un aldéhyde, on remplace le « e » final de l’alcane par…", ["« al »", "« one »", "« ol »", "« oïque »"], 0, "Règle du cours.", "2. Nomenclature"),
      short("Nomme le composé $\\mathrm{H-CHO}$.", ["methanal", "méthanal", "le méthanal"], "Un seul carbone, fonction aldéhyde.", "Activité d’application - A"),
      short("Nomme le composé $\\mathrm{CH_3-CH(CH_3)-CHO}$.", ["2-methylpropanal", "2-méthylpropanal", "2 methylpropanal"], "Chaîne de trois carbones, carbonyle en 1, méthyle en 2.", "Activité d’application - B", 2),
      short("Nomme le composé $\\mathrm{CH_3-CH(CH_3)-CO-CH_3}$.", ["3-methylbutan-2-one", "3-méthylbutan-2-one", "3 methylbutan 2 one"], "Chaîne de quatre carbones, carbonyle en 2, méthyle en 3.", "Activité d’application - C", 2),
      choice("Dans une cétone, le carbone fonctionnel reçoit…", ["l’indice le plus faible possible", "toujours l’indice 1", "toujours l’indice 2", "l’indice le plus élevé"], 0, "C’est la règle de numérotation du cours.", "2. Nomenclature", 2),
      choice("Quel nom est impossible ?", ["butan-1-one", "butan-2-one", "butanal", "propanone"], 0, "Un carbonyle en position 1 porte un hydrogène : c’est un aldéhyde, pas une cétone.", "2. Nomenclature", 2),
    ],
    corrections: [
      "Le document nomme le composé de l’exercice 5 « butan-1-one » (page 8). Ce nom est impossible : un carbonyle en position 1 porte un hydrogène et définit un aldéhyde. La formule donnée, CH₃–CO–CH₂–CH₃, correspond à la butan-2-one (ou butanone), nom retenu ici.",
    ],
  },
  {
    id: "dnph-common-test",
    title: "Le test commun : la 2,4-DNPH",
    summary: "Reconnaître un composé carbonylé par le précipité jaune-orangé de la 2,4-dinitrophénylhydrazine, sans pouvoir distinguer aldéhyde et cétone.",
    pages: "2-3",
    section: "3.1 Propriété commune : test à la 2,4-DNPH",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## Un réactif pour toute la famille

En présence d’un composé carbonylé — **aldéhyde comme cétone** — la **2,4-dinitrophénylhydrazine**, notée **2,4-DNPH**, donne un **précipité jaune-orangé**.

$$\text{composé carbonylé} + \text{2,4-DNPH} \longrightarrow \textbf{précipité jaune-orangé}$$

## Ce que le test prouve, et ce qu’il ne prouve pas

C’est le point pédagogique de ce niveau, et la source de la plupart des erreurs d’examen.

| La 2,4-DNPH répond à la question… | Réponse |
|---|---|
| « Ce composé contient-il un groupe carbonyle ? » | **Oui**, un précipité jaune-orangé le confirme. |
| « Est-ce un aldéhyde ou une cétone ? » | **Non**, le test ne permet pas de trancher. |

Un test positif à la 2,4-DNPH signifie donc : *« j’ai bien affaire à un aldéhyde **ou** à une cétone »*. Pour aller plus loin, il faudra un second test — ceux du niveau suivant.

> **Astuce mémoire de Davy.** Pense à la 2,4-DNPH comme au **portier de la famille carbonylée** : elle vérifie que tu es bien de la famille, mais elle ne dit pas si tu es l’aldéhyde ou la cétone. C’est toujours le **premier** test qu’on réalise sur un composé inconnu.

> **Erreur fréquente.** Conclure « le composé est un aldéhyde » à partir du seul précipité jaune-orangé. C’est la faute la plus coûteuse de cette leçon : le précipité est aussi obtenu avec une cétone.`,
    keyPoint: "2,4-DNPH + composé carbonylé → précipité jaune-orangé. Le test est commun aux aldéhydes et aux cétones : il ne les distingue pas.",
    example: "La propanone (une cétone) et l’éthanal (un aldéhyde) donnent tous deux un précipité jaune-orangé avec la 2,4-DNPH.",
    methodSteps: [
      "Verse quelques gouttes de 2,4-DNPH sur le composé à identifier.",
      "Observe : un précipité jaune-orangé signale un groupe carbonyle.",
      "Conclus que le composé est un aldéhyde ou une cétone — sans trancher.",
      "Enchaîne sur un test différenciant pour lever l’ambiguïté.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Ce que dit la 2,4-DNPH",
      instruction: "Sélectionne un résultat pour voir la conclusion exacte qu’il autorise.",
      observation: "Un seul test ne suffit jamais à identifier un composé carbonylé. La 2,4-DNPH ouvre la porte de la famille ; elle ne désigne pas le membre.",
      rootLabel: "Ajout de 2,4-DNPH au composé inconnu",
      rootDetail: "Qu’observe-t-on dans le tube à essai ?",
      nodes: [
        { id: "precipite", label: "Précipité jaune-orangé", role: "→ composé carbonylé", detail: "Le composé possède un groupe carbonyle C=O. Il s’agit d’un aldéhyde OU d’une cétone : à ce stade, rien ne permet de choisir. Il faut poursuivre avec le réactif de Schiff, celui de Tollens ou la liqueur de Fehling." },
        { id: "rien", label: "Aucun précipité", role: "→ pas de carbonyle", detail: "Le composé ne contient pas de groupe carbonyle. Ce n’est ni un aldéhyde ni une cétone : ce peut être un alcool, un acide carboxylique ou un hydrocarbure. Inutile de poursuivre avec Tollens ou Fehling." },
      ],
    },
    questions: [
      choice("Avec un composé carbonylé, la 2,4-DNPH donne…", ["un précipité jaune-orangé", "un miroir d’argent", "un précipité rouge brique", "une coloration rose"], 0, "C’est le test commun du cours.", "3.1 Propriété commune"),
      choice("Un précipité jaune-orangé avec la 2,4-DNPH permet de conclure que le composé est…", ["un aldéhyde ou une cétone", "forcément un aldéhyde", "forcément une cétone", "un alcool"], 0, "Le test est commun aux deux familles.", "3.1 Propriété commune", 2),
      choice("Une cétone donne-t-elle un précipité avec la 2,4-DNPH ?", ["oui, jaune-orangé", "non, aucune réaction", "oui, rouge brique"], 0, "Le tableau de correction le confirme : la cétone réagit avec la 2,4-DNPH.", "Activité d’application - tableau", 2),
      short("Quelle couleur prend le précipité obtenu avec la 2,4-DNPH ?", ["jaune-orange", "jaune orangé", "jaune-orangé", "jaune orange"], "Précipité jaune-orangé.", "3.1 Propriété commune"),
      choice("Sur un composé inconnu, quel test réalise-t-on en premier ?", ["la 2,4-DNPH", "la liqueur de Fehling", "le réactif de Tollens"], 0, "On confirme d’abord l’appartenance à la famille carbonylée.", "3.1 Propriété commune"),
    ],
  },
  {
    id: "aldehyde-differentiating-tests",
    title: "Distinguer l’aldéhyde de la cétone : Schiff, Tollens, Fehling",
    summary: "Utiliser les trois tests qui ne répondent qu’aux aldéhydes, et retenir la conclusion : les aldéhydes sont réducteurs, pas les cétones.",
    pages: "3-4",
    section: "3.2 Propriétés différenciant les aldéhydes des cétones",
    durationMinutes: 28,
    xp: 65,
    body: String.raw`## Trois réactifs, une seule famille qui répond

| Réactif | Observation avec un **aldéhyde** | Avec une **cétone** |
|---|---|---|
| Réactif de **Schiff** (incolore) | vire au **rose** | rien |
| Réactif de **Tollens** (nitrate d’argent ammoniacal) | **miroir d’argent** | rien |
| **Liqueur de Fehling** | précipité **rouge brique** | rien |
| Rappel — 2,4-DNPH | précipité jaune-orangé | précipité jaune-orangé |

## Pourquoi seuls les aldéhydes répondent

Dans les tests de Tollens et de Fehling, l’aldéhyde est **oxydé en ion carboxylate** $\mathrm{R-COO^-}$ tandis que le réactif est réduit. Cette oxydation est possible parce que le carbone fonctionnel de l’aldéhyde **porte un atome d’hydrogène** qui peut être arraché.

La cétone n’en porte aucun : il n’y a rien à arracher, elle ne peut pas être oxydée dans ces conditions.

## La conclusion du cours

> **Les aldéhydes sont des réducteurs, ce qui n’est pas le cas des cétones.**

C’est la phrase à retenir, et elle explique à elle seule les trois lignes du tableau.

> **Astuce mémoire de Davy.** Un moyen simple de ne pas confondre les couleurs : **Fehling → rouge brique** (le cuivre), **Tollens → miroir d’argent** (l’argent), **Schiff → rose**. Chaque test porte la couleur du métal ou du colorant qu’il met en jeu.

> **Erreur fréquente.** Croire qu’une cétone « ne réagit à rien ». Elle réagit bien avec la 2,4-DNPH — c’est justement ce qui permet de la reconnaître comme composé carbonylé. Elle ne réagit pas aux **trois tests différenciants**, ce qui est autre chose.`,
    keyPoint: "Schiff → rose, Tollens → miroir d’argent, Fehling → précipité rouge brique : ces trois tests ne répondent qu’aux aldéhydes. Les aldéhydes sont réducteurs, les cétones non.",
    example: "Un composé donne un précipité jaune-orangé à la 2,4-DNPH puis un précipité rouge brique à la liqueur de Fehling : c’est un aldéhyde.",
    methodSteps: [
      "Confirme d’abord la famille avec la 2,4-DNPH.",
      "Réalise ensuite un test différenciant : Schiff, Tollens ou Fehling.",
      "Une réponse positive — rose, miroir d’argent ou rouge brique — désigne un aldéhyde.",
      "Aucune réponse à ces trois tests désigne une cétone.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les quatre réactifs de la leçon",
      instruction: "Sélectionne un réactif pour voir ce qu’il révèle et ce qu’il laisse indécis.",
      observation: "Un seul réactif répond aux deux familles : la 2,4-DNPH. Les trois autres sont muets devant une cétone, et c’est précisément ce silence qui permet de l’identifier.",
      rootLabel: "Composé carbonylé inconnu",
      rootDetail: "Quel réactif lui applique-t-on ?",
      nodes: [
        { id: "dnph", group: "Test commun", label: "2,4-DNPH", role: "→ précipité jaune-orangé", detail: "Répond aux aldéhydes ET aux cétones. Confirme la présence du groupe carbonyle sans distinguer les deux familles. C’est le test d’entrée." },
        { id: "schiff", group: "Tests des aldéhydes", label: "Réactif de Schiff", role: "→ vire au rose", detail: "Le réactif, initialement incolore, vire au rose en présence d’un aldéhyde. Une cétone le laisse incolore." },
        { id: "tollens", group: "Tests des aldéhydes", label: "Réactif de Tollens", role: "→ miroir d’argent", detail: "Nitrate d’argent ammoniacal. En milieu basique, l’aldéhyde est oxydé en ion carboxylate et l’ion diamine argent I est réduit en argent métallique, qui se dépose en miroir sur la paroi du tube." },
        { id: "fehling", group: "Tests des aldéhydes", label: "Liqueur de Fehling", role: "→ précipité rouge brique", detail: "Les ions cuivre II sont réduits en oxyde de cuivre I, Cu₂O, qui précipite en rouge brique, tandis que l’aldéhyde est oxydé en ion carboxylate." },
      ],
    },
    questions: [
      choice("En présence d’un aldéhyde, le réactif de Schiff…", ["vire au rose", "reste incolore", "donne un précipité jaune", "donne un miroir d’argent"], 0, "Observation du cours.", "3.2.1 Réactif de Schiff"),
      choice("Le réactif de Tollens en présence d’un aldéhyde donne…", ["un miroir d’argent", "un précipité rouge brique", "une coloration rose", "aucune réaction"], 0, "L’ion diamine argent I est réduit en argent métallique.", "3.2.2 Réactif de Tollens"),
      choice("La liqueur de Fehling en présence d’un aldéhyde donne…", ["un précipité rouge brique", "un miroir d’argent", "un précipité jaune-orangé"], 0, "Les ions cuivre II sont réduits en oxyde de cuivre I.", "3.2.3 Liqueur de Fehling"),
      choice("Une cétone donne, avec la liqueur de Fehling…", ["aucune réaction", "un précipité rouge brique", "un miroir d’argent"], 0, "Seuls les aldéhydes sont réducteurs.", "Activité d’application - tableau", 2),
      choice("La conclusion du cours est que…", ["les aldéhydes sont des réducteurs, pas les cétones", "les cétones sont des réducteurs, pas les aldéhydes", "les deux familles sont réductrices"], 0, "C’est la conclusion du paragraphe 3.2.4.", "3.2.4 Conclusion", 2),
      short("Quel réactif donne un miroir d’argent avec un aldéhyde ?", ["tollens", "réactif de tollens", "le réactif de tollens", "nitrate d'argent ammoniacal"], "C’est le réactif de Tollens.", "3.2.2 Réactif de Tollens"),
      choice("Un aldéhyde réduit-il l’ion permanganate en solution aqueuse acide ?", ["oui", "non"], 0, "L’exercice 2 le confirme : c’est vrai.", "Exercice 2 - affirmation 2", 2),
    ],
  },
  {
    id: "carbonyl-redox-equations",
    title: "Écrire les équations-bilans d’oxydoréduction",
    summary: "Construire les demi-équations électroniques de Tollens et de Fehling, puis les combiner en une équation-bilan équilibrée.",
    pages: "3-4",
    section: "3.2.2 et 3.2.3 — équations-bilans",
    durationMinutes: 32,
    xp: 75,
    body: String.raw`## La demi-équation de l’aldéhyde

Elle est commune aux deux tests. En milieu basique, l’aldéhyde s’oxyde en ion carboxylate :

$$\mathrm{R-CHO + 3\,OH^- \longrightarrow R-COO^- + 2\,H_2O + 2\,e^-}$$

L’aldéhyde **cède** deux électrons : c’est le **réducteur**.

## Test de Tollens

Le réactif se réduit en argent métallique, une seule fois par électron — il faut donc doubler cette demi-équation :

$$2 \times \left( \mathrm{[Ag(NH_3)_2]^+ + e^- \longrightarrow Ag + 2\,NH_3} \right)$$

En additionnant les deux demi-équations :

$$\mathrm{R-CHO + 2\,[Ag(NH_3)_2]^+ + 3\,OH^- \longrightarrow 2\,Ag + R-COO^- + 4\,NH_3 + 2\,H_2O}$$

## Test de Fehling

Les ions cuivre II se réduisent en oxyde de cuivre I :

$$\mathrm{2\,Cu^{2+} + 2\,OH^- + 2\,e^- \longrightarrow Cu_2O + H_2O}$$

En additionnant :

$$\mathrm{R-CHO + 2\,Cu^{2+} + 5\,OH^- \longrightarrow Cu_2O + R-COO^- + 3\,H_2O}$$

## Vérifier son équation

Une équation-bilan d’oxydoréduction n’est juste que si **les atomes et les charges** sont conservés. Sur l’équation de Fehling :

| | Membre de gauche | Membre de droite |
|---|---|---|
| Charge | $2 \times (+2) + 5 \times (-1) = -1$ | $-1$ (l’ion carboxylate) |
| Hydrogènes hors R | $1 + 5 = 6$ | $6$ (3 molécules d’eau) |

> **Astuce mémoire de Davy.** Les électrons doivent **disparaître** dans l’équation-bilan. S’il en reste, c’est que tu n’as pas multiplié la bonne demi-équation : ajuste les coefficients pour que le nombre d’électrons cédés égale le nombre d’électrons captés.

> **Erreur fréquente.** Oublier les ions $\mathrm{OH^-}$. Ces réactions se déroulent **en milieu basique** : ils apparaissent dans les deux demi-équations et se cumulent dans le bilan — 3 pour Tollens, 5 pour Fehling.`,
    keyPoint: "Tollens : $\\mathrm{R-CHO + 2[Ag(NH_3)_2]^+ + 3OH^- \\to 2Ag + R-COO^- + 4NH_3 + 2H_2O}$. Fehling : $\\mathrm{R-CHO + 2Cu^{2+} + 5OH^- \\to Cu_2O + R-COO^- + 3H_2O}$.",
    example: "Avec le butanal : $\\mathrm{CH_3-CH_2-CH_2-CHO + 2Cu^{2+} + 5OH^- \\to CH_3-CH_2-CH_2-COO^- + Cu_2O + 3H_2O}$.",
    methodSteps: [
      "Écris la demi-équation de l’aldéhyde : il cède 2 électrons en milieu basique.",
      "Écris la demi-équation du réactif : argent I pour Tollens, cuivre II pour Fehling.",
      "Multiplie les demi-équations pour que les électrons cédés égalent les électrons captés.",
      "Additionne, simplifie, puis vérifie la conservation des atomes et des charges.",
    ],
    interaction: timeline(
      [
        { label: "L’aldéhyde cède 2 électrons", shortLabel: "Réducteur", detail: "R–CHO + 3 OH⁻ → R–COO⁻ + 2 H₂O + 2 e⁻. Cette demi-équation est la même pour Tollens et pour Fehling : c’est toujours l’aldéhyde qui s’oxyde en ion carboxylate." },
        { label: "Le réactif capte les électrons", shortLabel: "Oxydant", detail: "Tollens : [Ag(NH₃)₂]⁺ + e⁻ → Ag + 2 NH₃, qui ne capte qu’un électron et doit donc être doublée. Fehling : 2 Cu²⁺ + 2 OH⁻ + 2 e⁻ → Cu₂O + H₂O, qui en capte déjà deux." },
        { label: "Égaliser les électrons", shortLabel: "Équilibrer", detail: "Le nombre d’électrons cédés doit égaler le nombre d’électrons captés. Pour Tollens, on multiplie la demi-équation de l’argent par 2 ; pour Fehling, aucune multiplication n’est nécessaire." },
        { label: "Additionner et vérifier", shortLabel: "Bilan", detail: "On additionne membre à membre : les électrons disparaissent. On vérifie ensuite que les atomes et les charges sont conservés des deux côtés." },
      ],
      "Construire une équation-bilan",
      "Suis les quatre étapes : c’est la démarche attendue à l’examen, demi-équations comprises.",
      "Les demi-équations ne sont pas facultatives : le barème officiel les attend avant le bilan. Les écrire évite aussi la plupart des erreurs de coefficients.",
    ),
    questions: [
      choice("Dans la demi-équation $\\mathrm{R-CHO + 3OH^- \\to R-COO^- + 2H_2O + 2e^-}$, l’aldéhyde…", ["cède des électrons : il est réducteur", "capte des électrons : il est oxydant", "ne change pas de nombre d’oxydation"], 0, "Les électrons sont du côté des produits : ils sont cédés.", "3.2.2 Équation-bilan", 2),
      short("Combien d’électrons l’aldéhyde cède-t-il dans sa demi-équation ?", ["2", "deux"], "R–CHO + 3 OH⁻ → R–COO⁻ + 2 H₂O + 2 e⁻.", "3.2.2 Équation-bilan"),
      choice("Quel produit métallique se forme dans le test de Tollens ?", ["l’argent $\\mathrm{Ag}$", "l’oxyde de cuivre I $\\mathrm{Cu_2O}$", "le cuivre métallique $\\mathrm{Cu}$"], 0, "L’ion diamine argent I est réduit en argent métallique.", "3.2.2 Équation-bilan"),
      choice("Dans l’équation-bilan de Fehling, combien d’ions $\\mathrm{OH^-}$ interviennent ?", ["5", "3", "2", "4"], 0, "$\\mathrm{R-CHO + 2Cu^{2+} + 5OH^- \\to Cu_2O + R-COO^- + 3H_2O}$.", "3.2.3 Équation-bilan", 2),
      choice("Pourquoi double-t-on la demi-équation de l’argent dans le test de Tollens ?", ["parce qu’elle ne capte qu’un électron alors que l’aldéhyde en cède deux", "pour équilibrer les atomes d’azote", "pour équilibrer les molécules d’eau"], 0, "Les électrons cédés doivent égaler les électrons captés.", "3.2.2 Équation-bilan", 2),
      short("Quel ion carbonique l’aldéhyde forme-t-il en s’oxydant en milieu basique ?", ["ion carboxylate", "carboxylate", "R-COO-", "RCOO-"], "L’aldéhyde est oxydé en ion carboxylate R–COO⁻.", "3.2.2 Équation-bilan", 2),
    ],
  },
  {
    id: "carbonyl-identification-workshop",
    title: "Atelier : classer, trancher, identifier",
    summary: "Traiter les exercices officiels de classement, de vrai-faux et d’identification d’un composé à partir de sa formule brute.",
    pages: "5-7",
    section: "III. Exercices 1 à 3",
    durationMinutes: 34,
    xp: 80,
    kind: "practice",
    body: String.raw`## Exercice 1 — classer des composés

On dispose de : a) butanal ; b) $\mathrm{CH_3-CH_2-CH_2-OH}$ ; c) $\mathrm{CH_3-CH_2-CHO}$ ; d) $\mathrm{CH_3-CH_2-COOH}$ ; e) butanone ; f) $\mathrm{CH_3-CO-CH_3}$.

| Composé carbonylé | Aldéhyde | Cétone |
|---|---|---|
| a, c, e et f | a et c | e et f |

Les composés **b** et **d** sont écartés : **b** est un alcool ($-\mathrm{OH}$), **d** un acide carboxylique ($-\mathrm{COOH}$). Ni l’un ni l’autre ne porte de groupe carbonyle au sens de cette leçon.

## Exercice 2 — six affirmations

| Affirmation | Réponse |
|---|---|
| La 2,4-DNPH donne un précipité jaune-orangé avec un aldéhyde ou une cétone | **VRAI** |
| Un aldéhyde réduit l’ion permanganate en solution aqueuse acide | **VRAI** |
| Une cétone réduit l’ion dichromate en solution aqueuse acide | **FAUX** |
| Un aldéhyde réduit l’ion cuivre II de la liqueur de Fehling en milieu basique | **VRAI** |
| Une cétone réduit l’ion diamine argent du réactif de Tollens en milieu basique | **FAUX** |
| En présence d’une cétone, le réactif de Schiff vire au rose | **FAUX** |

Les trois affirmations fausses ont toutes la même cause : **une cétone n’est pas un réducteur**.

## Exercice 3 — du $\mathrm{C_2H_4O}$ à l’équation-bilan

Le composé **A** a pour formule brute $\mathrm{C_2H_4O}$, conforme à $\mathrm{C_nH_{2n}O}$ avec $n=2$.

- **Fonction chimique** : aldéhyde ; **groupe fonctionnel** : $-\mathrm{CHO}$.
- **Formule semi-développée** : $\mathrm{CH_3-CHO}$ — c’est l’**éthanal**.
- Avec la **2,4-DNPH** : précipité jaune-orangé.
- Avec le **réactif de Tollens** : miroir d’argent, autrement dit un dépôt d’argent.

Équation-bilan avec la liqueur de Fehling :

$$\mathrm{CH_3-CHO + 2\,Cu^{2+} + 5\,OH^- \longrightarrow Cu_2O + CH_3-COO^- + 3\,H_2O}$$

> **Astuce mémoire de Davy.** Avec deux carbones, une seule structure carbonylée est possible : l’éthanal. La cétone est exclue d’office, puisqu’elle exigerait trois carbones. Vérifier le nombre de carbones fait souvent gagner une question entière.`,
    keyPoint: "Un alcool ($-\\mathrm{OH}$) et un acide carboxylique ($-\\mathrm{COOH}$) ne sont pas des composés carbonylés. Avec deux carbones, le seul composé carbonylé possible est l’éthanal.",
    example: "$\\mathrm{C_2H_4O}$ vérifie $\\mathrm{C_nH_{2n}O}$ pour $n=2$ : c’est l’éthanal $\\mathrm{CH_3-CHO}$, un aldéhyde.",
    methodSteps: [
      "Vérifie la formule brute contre le modèle $\\mathrm{C_nH_{2n}O}$.",
      "Écarte les fonctions voisines : $-\\mathrm{OH}$ est un alcool, $-\\mathrm{COOH}$ un acide.",
      "Compte les carbones : en dessous de trois, une cétone est impossible.",
      "Traduis chaque observation expérimentale en une conclusion, puis écris l’équation demandée.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "L’arbre de décision d’une identification",
      instruction: "Sélectionne une étape pour voir la question posée et la conclusion qu’elle permet.",
      observation: "Une identification est une suite de questions fermées. Chacune élimine une possibilité ; c’est leur enchaînement, et non un test isolé, qui désigne le composé.",
      rootLabel: "Composé organique inconnu",
      rootDetail: "Quelle question poser, et dans quel ordre ?",
      nodes: [
        { id: "formule", group: "Sur le papier", label: "La formule brute", role: "CₙH₂ₙO ?", detail: "Si la formule brute suit CₙH₂ₙO, le composé peut être carbonylé. On en déduit aussi le nombre de carbones, donc les structures possibles. En dessous de trois carbones, la cétone est exclue." },
        { id: "famille", group: "Au laboratoire", label: "Test à la 2,4-DNPH", role: "carbonylé ou non ?", detail: "Précipité jaune-orangé : le composé est un aldéhyde ou une cétone. Rien : ce n’est ni l’un ni l’autre, et l’identification s’arrête là pour cette leçon." },
        { id: "distinction", group: "Au laboratoire", label: "Schiff, Tollens ou Fehling", role: "aldéhyde ou cétone ?", detail: "Une réponse positive — rose, miroir d’argent ou rouge brique — désigne un aldéhyde. Aucune réponse désigne une cétone. C’est ce test qui tranche." },
        { id: "structure", group: "Sur le papier", label: "La chaîne carbonée", role: "linéaire ou ramifiée ?", detail: "Une fois la famille connue, l’énoncé précise souvent si la chaîne est linéaire ou ramifiée : c’est ce qui permet de choisir entre les isomères et d’écrire la formule semi-développée exacte." },
      ],
    },
    questions: [
      choice("Parmi ces composés, lequel n’est PAS un composé carbonylé ?", ["$\\mathrm{CH_3-CH_2-CH_2-OH}$", "$\\mathrm{CH_3-CH_2-CHO}$", "$\\mathrm{CH_3-CO-CH_3}$", "butanal"], 0, "C’est un alcool : il porte un groupe $-\\mathrm{OH}$, pas un carbonyle.", "Exercice 1 - question 1"),
      choice("Dans l’exercice 1, quels composés sont des cétones ?", ["e et f", "a et c", "a, c, e et f", "b et d"], 0, "La butanone (e) et la propanone (f).", "Exercice 1 - solution", 2),
      choice("« Une cétone réduit l’ion dichromate en solution aqueuse acide. » Cette affirmation est…", ["fausse", "vraie"], 0, "Une cétone n’est pas un réducteur.", "Exercice 2 - affirmation 3", 2),
      short("Nomme le composé carbonylé de formule brute $\\mathrm{C_2H_4O}$.", ["ethanal", "éthanal", "l'éthanal"], "Deux carbones, fonction aldéhyde : c’est l’éthanal.", "Exercice 3 - question 1.2", 2),
      choice("Quel est le groupe fonctionnel d’un aldéhyde ?", ["$-\\mathrm{CHO}$", "$-\\mathrm{OH}$", "$-\\mathrm{COOH}$", "$-\\mathrm{CO}-$"], 0, "Le groupe fonctionnel de l’aldéhyde s’écrit $-\\mathrm{CHO}$.", "Exercice 3 - question 1.1"),
      choice("Avec le réactif de Tollens, l’éthanal donne…", ["un miroir d’argent", "un précipité rouge brique", "une coloration rose"], 0, "Dépôt d’argent métallique sur la paroi du tube.", "Exercice 3 - question 2.2"),
    ],
    corrections: [
      "Page 7, exercice 3, question 1.2 : le corrigé donne la formule semi-développée du composé A mais omet son nom, pourtant demandé par l’énoncé. Le nom est ajouté ici : éthanal.",
      "Page 5 : la résolution de la situation d’évaluation comporte un point « 1.4 » sans énoncé correspondant. Cet artefact du document a été retiré.",
    ],
  },
  {
    id: "unknown-carbonyl-mission",
    title: "Mission finale : identifier un composé carbonylé inconnu",
    summary: "Mobiliser analyse élémentaire, densité de vapeur, combustion et tests caractéristiques pour identifier un composé et écrire son équation-bilan.",
    pages: "4-5, 7-8",
    section: "Situation d’évaluation et exercices 4 et 5",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation d’évaluation

Le professeur communique les résultats de quatre expériences réalisées sur un composé oxygéné **A** de formule $\mathrm{C_xH_yO_z}$ :

1. Masse molaire $M(A) = 72$ g·mol⁻¹, **66,7 %** de carbone en masse, **un seul** atome d’oxygène.
2. **A** donne un **précipité jaune-orangé** avec la 2,4-DNPH.
3. **A** donne un **test positif** avec la liqueur de Fehling en milieu basique.
4. Sa chaîne carbonée est **linéaire**.

*Données* : $M(\mathrm{C}) = 12$, $M(\mathrm{H}) = 1$, $M(\mathrm{O}) = 16$ g·mol⁻¹.

## Le raisonnement, étape par étape

**1. Que dit l’expérience 2 ?** Le précipité jaune-orangé signe la présence du groupe carbonyle : **A est un composé carbonylé**, aldéhyde ou cétone.

**2. Quelle est sa formule brute ?** Un seul atome d’oxygène, donc $z=1$. Le nombre de carbones se déduit du pourcentage massique :

$$x = \frac{M \times \%\mathrm{C}}{1200} = \frac{72 \times 66{,}7}{1200} = 4$$

Puis les hydrogènes, par différence :

$$y = M - (12x + 16z) = 72 - (48 + 16) = 8$$

D’où **$\mathrm{C_4H_8O}$**, qui vérifie bien $\mathrm{C_nH_{2n}O}$ avec $n = 4$.

**3. Que dit l’expérience 3 ?** Le test à la liqueur de Fehling est positif : **A est un aldéhyde**, puisque seuls les aldéhydes sont réducteurs.

**4. Que dit l’expérience 4 ?** La chaîne est linéaire. Avec quatre carbones et une fonction aldéhyde en bout de chaîne, une seule structure convient :

$$\mathrm{CH_3-CH_2-CH_2-CHO} \quad \text{— le \textbf{butanal}}$$

**5. Qu’observe-t-on dans le tube ?** Un **précipité rouge brique** d’oxyde de cuivre I, $\mathrm{Cu_2O}$.

**6. L’équation-bilan.** Demi-équations puis bilan :

$$\mathrm{CH_3-CH_2-CH_2-CHO + 3\,OH^- \longrightarrow CH_3-CH_2-CH_2-COO^- + 2\,H_2O + 2\,e^-}$$
$$\mathrm{2\,Cu^{2+} + 2\,OH^- + 2\,e^- \longrightarrow Cu_2O + H_2O}$$
$$\mathrm{CH_3-CH_2-CH_2-CHO + 2\,Cu^{2+} + 5\,OH^- \longrightarrow CH_3-CH_2-CH_2-COO^- + Cu_2O + 3\,H_2O}$$

## Deux variantes du même raisonnement

**Par la densité de vapeur (exercice 4).** Un alcool saturé **A** de densité de vapeur $d = 2{,}07$ donne, par oxydation ménagée en milieu acide, un composé **B** qui réagit avec la 2,4-DNPH et possède des propriétés réductrices.

$M_A = 29d = 60$ g·mol⁻¹. Or $M_A = 14n + 18$, d’où $n = 3$ et la formule $\mathrm{C_3H_8O}$. **B est réducteur donc c’est un aldéhyde**, ce qui impose que **A soit un alcool primaire** : $\mathrm{CH_3-CH_2-CH_2-OH}$, le **propan-1-ol**. Et **B** est le **propanal**.

**Par la combustion (exercice 5).** La combustion complète d’une mole de **A** fournit 4 moles de $\mathrm{CO_2}$ et 4 moles d’eau, donc $x = 4$ et $y/2 = 4$ soit $y = 8$ : **$\mathrm{C_4H_8O}$**. Cette fois **A ne réduit pas** la liqueur de Fehling : c’est une **cétone**, donc la **butan-2-one** $\mathrm{CH_3-CO-CH_2-CH_3}$.

> **Astuce mémoire de Davy.** Ces trois problèmes ont la même ossature : *une donnée quantitative* donne la formule brute, *un test* donne la famille, *une précision de structure* donne l’isomère. Retiens l’ossature, pas les chiffres.`,
    keyPoint: "Formule brute par l’analyse quantitative, famille par les tests, isomère par la structure : trois étapes, dans cet ordre.",
    example: "$M = 72$, 66,7 % de C, un O → $\\mathrm{C_4H_8O}$ ; Fehling positif → aldéhyde ; chaîne linéaire → butanal $\\mathrm{CH_3-CH_2-CH_2-CHO}$.",
    methodSteps: [
      "Traduis chaque donnée quantitative en une relation sur $x$, $y$ et $z$ pour obtenir la formule brute.",
      "Utilise les tests pour trancher entre aldéhyde et cétone.",
      "Utilise la précision de structure — linéaire, ramifiée — pour choisir l’isomère.",
      "Écris les demi-équations puis l’équation-bilan, et vérifie atomes et charges.",
    ],
    interaction: timeline(
      [
        { label: "Exploiter les données chiffrées", shortLabel: "Formule brute", detail: "Masse molaire, pourcentage massique, densité de vapeur (M = 29 d) ou bilan de combustion : chacune donne une équation sur x, y et z. Trois relations suffisent à fixer la formule brute." },
        { label: "Lire les tests", shortLabel: "Famille", detail: "2,4-DNPH positive : composé carbonylé. Fehling ou Tollens positif : aldéhyde. Fehling négatif alors que la 2,4-DNPH est positive : cétone." },
        { label: "Choisir la structure", shortLabel: "Isomère", detail: "Avec C₄H₈O et une fonction aldéhyde, deux structures existent : butanal (linéaire) et 2-méthylpropanal (ramifiée). L’énoncé précise « chaîne linéaire » : c’est le butanal." },
        { label: "Rédiger le bilan", shortLabel: "Équation", detail: "Demi-équation de l’aldéhyde, demi-équation de l’oxydant, égalisation des électrons, addition, puis vérification des atomes et des charges." },
      ],
      "L’ossature d’une identification",
      "Suis les quatre étapes : c’est la trame commune à la situation d’évaluation et aux exercices 4 et 5.",
      "Les trois énoncés changent de données mais pas de méthode. Reconnaître l’ossature vaut mieux que retenir un corrigé particulier.",
    ),
    questions: [
      short("Le composé A a $M = 72$ g·mol⁻¹, 66,7 % de carbone et un seul atome d’oxygène. Combien d’atomes de carbone contient-il ?", ["4", "quatre"], "$x = 72 \\times 66{,}7 / 1200 = 4$.", "Situation d’évaluation - question 2.2", 2),
      short("Quelle est la formule brute du composé A de la situation d’évaluation ?", ["C4H8O", "c4h8o"], "$x=4$, $z=1$, puis $y = 72-(48+16) = 8$.", "Situation d’évaluation - question 2.2", 2),
      choice("A donne un test positif avec la liqueur de Fehling. Sa fonction chimique est donc…", ["aldéhyde", "cétone", "alcool"], 0, "Seuls les aldéhydes réduisent la liqueur de Fehling.", "Situation d’évaluation - question 3.1", 2),
      short("Nomme le composé A : $\\mathrm{C_4H_8O}$, aldéhyde, chaîne linéaire.", ["butanal", "le butanal"], "Quatre carbones en chaîne linéaire avec la fonction aldéhyde en bout : butanal.", "Situation d’évaluation - question 3.2", 2),
      choice("Qu’observe-t-on dans le tube après la réaction avec la liqueur de Fehling ?", ["un précipité rouge brique d’oxyde de cuivre I", "un miroir d’argent", "une coloration rose"], 0, "Les ions cuivre II sont réduits en $\\mathrm{Cu_2O}$.", "Situation d’évaluation - question 3.3", 2),
      short("Exercice 4 : un alcool saturé a une densité de vapeur $d = 2{,}07$. Quelle est sa masse molaire, en g·mol⁻¹ ?", ["60", "60 g/mol", "60g/mol"], "$M = 29d = 29 \\times 2{,}07 = 60$ g·mol⁻¹.", "Exercice 4 - question 2", 2),
      short("Exercice 4 : nomme l’alcool A, sachant que son oxydation donne un aldéhyde.", ["propan-1-ol", "propan1ol", "le propan-1-ol"], "Formule $\\mathrm{C_3H_8O}$ ; comme B est un aldéhyde, A est l’alcool primaire.", "Exercice 4 - question 4", 2),
      choice("Exercice 5 : A donne $\\mathrm{C_4H_8O}$ et ne réduit pas la liqueur de Fehling. C’est…", ["la butan-2-one", "le butanal", "le 2-méthylpropanal"], 0, "Un test négatif à Fehling désigne une cétone ; avec quatre carbones, c’est la butan-2-one.", "Exercice 5 - question 3", 3),
    ],
    corrections: [
      "Page 8, exercice 5 : le corrigé conclut « A est la butan-1-one ou butanone ». Le nom « butan-1-one » n’existe pas — un carbonyle en position 1 définit un aldéhyde. La formule semi-développée donnée par le document, CH₃–CO–CH₂–CH₃, correspond à la butan-2-one (ou butanone), nom retenu ici.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const carbonylCompoundsPath: LearningPath = {
  id: "terminale-cd-chemistry-carbonyl",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Chimie organique" },
  chapterNumber: 2,
  title: "Composés carbonylés : aldéhydes et cétones",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître un composé carbonylé et distinguer un aldéhyde d’une cétone",
    "Nommer un aldéhyde et une cétone, ramifications comprises",
    "Choisir le test caractéristique adapté et interpréter son résultat",
    "Écrire les équations-bilans de Tollens et de Fehling, et identifier un composé inconnu",
  ],
  modules: [
    { id: "carbonyl-mastery", title: "Maîtriser les composés carbonylés", description: "Un niveau après l’autre, du groupe carbonyle à l’identification d’un composé inconnu.", lessons: builtLevels },
  ],
};
