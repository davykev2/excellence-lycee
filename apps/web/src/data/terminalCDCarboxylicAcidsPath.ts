import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L4_Acides carboxyliques et dérivés.pdf";

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
    id: "carboxylic-acid-definition",
    title: "L’acide carboxylique : groupe, nom et acidité",
    summary: "Reconnaître le groupe carboxyle, écrire la formule brute des monoacides, nommer un acide et comprendre pourquoi il est faible.",
    pages: "1-2",
    section: "1. Les acides carboxyliques",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## Définition

Les **acides carboxyliques** sont des composés organiques oxygénés de formule générale :

$$\mathrm{R-COOH}$$

où $\mathrm{R}$ est un atome d’hydrogène, un groupe **alkyle** ou un groupe **aryle**.

Leur groupe fonctionnel est le **groupe carboxyle** :

$$\mathrm{-COOH}$$

La formule brute générale des **monoacides carboxyliques** est :

$$\mathrm{C_nH_{2n}O_2}$$

## Nomenclature

Le nom s’obtient en faisant suivre le mot **« acide »** du nom de l’hydrocarbure correspondant à la chaîne principale, dont le **« e » final** est remplacé par la terminaison **« oïque »**.

| Formule | Nom |
|---|---|
| $\mathrm{H-COOH}$ | acide méthanoïque |
| $\mathrm{CH_3-COOH}$ | acide éthanoïque |
| $\mathrm{CH_3-CH_2-COOH}$ | acide propanoïque |
| $\mathrm{CH_3-CH_2-CH_2-COOH}$ | acide butanoïque |

> **Attention à la chaîne principale.** Elle doit **toujours contenir le carbone du groupe carboxyle**, et c’est **la plus longue** qui le contient. C’est la règle qui départage les noms possibles d’un acide ramifié.

## Un acide faible

Les acides carboxyliques sont des **acides faibles**. Leur réaction avec l’eau est **réversible**, donc la dissociation n’est que **partielle** :

$$\mathrm{R-COOH + H_2O \rightleftharpoons H_3O^+ + R-COO^-}$$

La double flèche n’est pas un détail d’écriture : elle traduit qu’à l’équilibre, **la majorité des molécules d’acide n’est pas dissociée**.

> **Astuce mémoire de Davy.** L’ion formé, $\mathrm{R-COO^-}$, s’appelle l’**ion carboxylate**. Tu l’as déjà rencontré dans la leçon précédente : c’est exactement ce que donne l’oxydation d’un aldéhyde par Tollens ou Fehling. Les deux leçons se rejoignent ici.

> **Erreur fréquente.** Écrire la dissociation avec une flèche simple, comme pour un acide fort. Un acide carboxylique est faible : la double flèche est obligatoire.`,
    keyPoint: "Acide carboxylique : $\\mathrm{R-COOH}$, groupe carboxyle $\\mathrm{-COOH}$, formule brute $\\mathrm{C_nH_{2n}O_2}$. Acide faible : dissociation partielle et réversible.",
    example: "$\\mathrm{CH_3-COOH}$ est l’acide éthanoïque, celui du vinaigre. Dans l’eau il n’est que partiellement dissocié.",
    methodSteps: [
      "Repère le groupe $\\mathrm{-COOH}$ en bout de chaîne.",
      "Identifie la chaîne principale : la plus longue contenant le carbone du carboxyle.",
      "Nomme l’hydrocarbure correspondant et remplace le « e » final par « oïque ».",
      "Fais précéder le tout du mot « acide », et place les préfixes des ramifications.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Le groupe carboxyle et ce qu’il implique",
      instruction: "Sélectionne un aspect pour voir ce que le groupe carboxyle apporte à la molécule.",
      observation: "Un seul groupe, trois conséquences : il donne son nom à la molécule, il la rend acide, et il sert de point de départ à tous les dérivés de cette leçon.",
      rootLabel: "Groupe carboxyle –COOH",
      rootDetail: "Que change-t-il pour la molécule ?",
      nodes: [
        { id: "structure", label: "Sa structure", role: "C=O et O–H sur le même carbone", detail: "Le carbone fonctionnel porte à la fois une double liaison vers un oxygène et un groupe hydroxyle. C’est cette combinaison, et non l’un ou l’autre isolément, qui définit la fonction acide carboxylique. Formule brute des monoacides : CₙH₂ₙO₂." },
        { id: "nom", label: "Son nom", role: "acide …oïque", detail: "Le carbone du carboxyle porte toujours l’indice 1 et appartient obligatoirement à la chaîne principale. Exemples : acide méthanoïque H–COOH, acide éthanoïque CH₃–COOH, acide butanoïque CH₃–CH₂–CH₂–COOH." },
        { id: "acidite", label: "Son acidité", role: "acide faible, dissociation partielle", detail: "R–COOH + H₂O ⇌ H₃O⁺ + R–COO⁻. La réaction est réversible : à l’équilibre, la majorité des molécules reste sous forme non dissociée. L’ion formé est l’ion carboxylate R–COO⁻." },
        { id: "derives", label: "Ses dérivés", role: "on remplace le –OH par Z", detail: "Toute la seconde partie de la leçon consiste à remplacer le groupe –OH du carboxyle par un autre groupe Z : Cl donne un chlorure d’acyle, –O–CO–R un anhydride, –OR′ un ester, –NH₂ un amide." },
      ],
    },
    questions: [
      short("Écris la formule brute générale d’un monoacide carboxylique à $n$ atomes de carbone.", ["CnH2nO2", "cnh2no2", "C_nH_2nO_2"], "Le cours donne $\\mathrm{C_nH_{2n}O_2}$.", "1.1 Définitions"),
      short("Nomme le composé $\\mathrm{H-COOH}$.", ["acide methanoique", "acide méthanoïque", "acide methanoïque"], "Un seul carbone : acide méthanoïque.", "Activité d’application 1 - a"),
      short("Nomme le composé $\\mathrm{CH_3-COOH}$.", ["acide ethanoique", "acide éthanoïque", "acide ethanoïque"], "Deux carbones : acide éthanoïque, l’acide du vinaigre.", "Activité d’application 1 - b"),
      choice("L’acide méthanoïque dans l’eau est…", ["partiellement dissocié", "totalement dissocié", "insoluble"], 0, "Les acides carboxyliques sont des acides faibles.", "Activité d’application 1 - question 2", 2),
      choice("Quel groupe est le groupe fonctionnel des acides carboxyliques ?", ["$\\mathrm{-COOH}$", "$\\mathrm{-CHO}$", "$\\mathrm{-OH}$", "$\\mathrm{-CO-}$"], 0, "C’est le groupe carboxyle.", "1.1 Définitions"),
      choice("Comment s’appelle l’ion $\\mathrm{R-COO^-}$ ?", ["ion carboxylate", "ion carbonate", "ion alcoolate"], 0, "C’est l’ion carboxylate, déjà rencontré à la leçon précédente.", "1.3 Propriétés chimiques", 2),
    ],
  },
  {
    id: "carboxylic-derivatives-overview",
    title: "Les quatre dérivés : une seule substitution",
    summary: "Comprendre que tous les dérivés s’obtiennent en remplaçant le –OH du carboxyle par un groupe Z, et reconnaître les quatre familles.",
    pages: "2",
    section: "2.1 Fonctions dérivées des acides carboxyliques",
    durationMinutes: 22,
    xp: 55,
    body: String.raw`## Le principe

La formule générale des dérivés des acides carboxyliques est :

$$\mathrm{R-CO-Z}$$

Autrement dit : **on garde le $\mathrm{C=O}$, on remplace le $\mathrm{-OH}$ par un groupe $\mathrm{Z}$**. Toute la leçon tient dans cette phrase — les quatre familles ne diffèrent que par la nature de $\mathrm{Z}$.

## Les quatre familles

| Fonction | Nature de $\mathrm{Z}$ | Formule générale |
|---|---|---|
| Chlorure d’acyle | $\mathrm{Cl}$ | $\mathrm{R-CO-Cl}$ |
| Anhydride d’acide | $\mathrm{-O-CO-R'}$ | $\mathrm{R-CO-O-CO-R'}$ |
| Ester | $\mathrm{-O-R'}$ | $\mathrm{R-CO-O-R'}$ |
| Amide | $\mathrm{-NH_2}$ | $\mathrm{R-CO-NH_2}$ |

> **Erreur fréquente.** Confondre **ester** et **anhydride**. Les deux contiennent un enchaînement $\mathrm{-CO-O-}$, mais l’anhydride en possède **deux carbonyles** encadrant l’oxygène ($\mathrm{-CO-O-CO-}$) alors que l’ester n’en a **qu’un** ($\mathrm{-CO-O-R'}$). Compte les $\mathrm{C=O}$ : un pour l’ester, deux pour l’anhydride.

> **Astuce mémoire de Davy.** Retiens l’ordre de réactivité, il structure toute la suite : **chlorure d’acyle > anhydride > ester > amide**. Plus un dérivé est haut dans cette liste, plus il réagit vite et totalement. C’est pourquoi on passe par un chlorure d’acyle quand on veut une réaction rapide et complète.`,
    keyPoint: "Tous les dérivés s’écrivent $\\mathrm{R-CO-Z}$ : $\\mathrm{Z}=\\mathrm{Cl}$ chlorure d’acyle, $\\mathrm{-O-CO-R'}$ anhydride, $\\mathrm{-OR'}$ ester, $\\mathrm{-NH_2}$ amide.",
    example: "À partir de l’acide éthanoïque $\\mathrm{CH_3-COOH}$ : $\\mathrm{CH_3-CO-Cl}$ est le chlorure d’éthanoyle, $\\mathrm{CH_3-CO-O-CH_3}$ l’éthanoate de méthyle.",
    methodSteps: [
      "Repère le carbonyle $\\mathrm{C=O}$ : il est présent dans les quatre familles.",
      "Regarde ce qui est accroché juste après ce carbonyle : c’est le groupe $\\mathrm{Z}$.",
      "Compte les carbonyles : deux encadrant un oxygène signalent un anhydride.",
      "Vérifie l’atome porté par $\\mathrm{Z}$ : $\\mathrm{Cl}$, $\\mathrm{O}$ ou $\\mathrm{N}$ départagent les familles.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les quatre dérivés d’un acide carboxylique",
      instruction: "Sélectionne une famille pour voir la nature de Z, sa formule et un exemple.",
      observation: "Les quatre familles partagent le même squelette R–CO–. Ce qui change tient en un groupe. Les distinguer sur une formule, c’est simplement lire ce qui suit le carbonyle.",
      rootLabel: "R–CO–Z, avec Z remplaçant le –OH",
      rootDetail: "Quelle est la nature du groupe Z ?",
      nodes: [
        { id: "chlorure", group: "Très réactifs", label: "Chlorure d’acyle", role: "Z = Cl", detail: "Formule R–CO–Cl. Le plus réactif des dérivés : ses réactions sont rapides, totales et exothermiques. Exemple : chlorure d’éthanoyle CH₃–CO–Cl. Nom formé en remplaçant « acide » par « chlorure de » et « oïque » par « oyle »." },
        { id: "anhydride", group: "Très réactifs", label: "Anhydride d’acide", role: "Z = –O–CO–R′", detail: "Formule R–CO–O–CO–R′. Deux carbonyles encadrent un oxygène — c’est ce qui le distingue de l’ester. Obtenu en éliminant une molécule d’eau entre deux acides. Exemple : anhydride éthanoïque." },
        { id: "ester", group: "Peu réactifs", label: "Ester", role: "Z = –O–R′", detail: "Formule R–CO–O–R′. Un seul carbonyle. Obtenu par estérification d’un acide et d’un alcool. Nom en « …oate de … ». Exemple : éthanoate de méthyle CH₃–CO–O–CH₃." },
        { id: "amide", group: "Peu réactifs", label: "Amide", role: "Z = –NH₂", detail: "Formule R–CO–NH₂. Le seul dérivé contenant de l’azote. Obtenu à partir d’un acide et de l’ammoniac, ou plus efficacement d’un chlorure d’acyle et de l’ammoniac. Exemple : méthanamide H–CO–NH₂." },
      ],
    },
    questions: [
      choice("La formule générale des dérivés des acides carboxyliques est…", ["$\\mathrm{R-CO-Z}$", "$\\mathrm{R-OH}$", "$\\mathrm{R-CHO}$", "$\\mathrm{R-O-R'}$"], 0, "On remplace le $\\mathrm{-OH}$ du carboxyle par un groupe $\\mathrm{Z}$.", "2. Les dérivés"),
      choice("Pour un ester, la nature de $\\mathrm{Z}$ est…", ["$\\mathrm{-O-R'}$", "$\\mathrm{Cl}$", "$\\mathrm{-NH_2}$", "$\\mathrm{-O-CO-R'}$"], 0, "L’ester s’écrit $\\mathrm{R-CO-O-R'}$.", "2.1 Fonctions dérivées"),
      choice("Pour un amide, la nature de $\\mathrm{Z}$ est…", ["$\\mathrm{-NH_2}$", "$\\mathrm{Cl}$", "$\\mathrm{-O-R'}$"], 0, "L’amide est le seul dérivé azoté.", "2.1 Fonctions dérivées"),
      choice("Comment distinguer un anhydride d’un ester sur une formule ?", ["l’anhydride possède deux carbonyles encadrant un oxygène", "l’anhydride contient un atome d’azote", "l’ester contient un atome de chlore"], 0, "$\\mathrm{-CO-O-CO-}$ contre $\\mathrm{-CO-O-R'}$.", "2.1 Fonctions dérivées", 2),
      short("Quel dérivé d’acide carboxylique contient un atome de chlore ?", ["chlorure d'acyle", "chlorure d’acyle", "chlorure d'acide", "le chlorure d'acyle"], "$\\mathrm{Z}=\\mathrm{Cl}$ définit le chlorure d’acyle.", "2.1 Fonctions dérivées"),
    ],
  },
  {
    id: "acyl-chlorides-and-anhydrides",
    title: "Chlorures d’acyle et anhydrides d’acide",
    summary: "Obtenir un chlorure d’acyle par SOCl₂ ou PCl₅, un anhydride par déshydratation, et nommer correctement les deux.",
    pages: "2-3",
    section: "2.2.1 et 2.2.2",
    durationMinutes: 28,
    xp: 60,
    body: String.raw`## Les chlorures d’acyle

### Obtention

Deux réactifs permettent de remplacer le $\mathrm{-OH}$ par un $\mathrm{Cl}$ :

**Avec le chlorure de thionyle $\mathrm{SOCl_2}$ :**

$$\mathrm{R-COOH + SOCl_2 \longrightarrow R-COCl + SO_2 + HCl}$$

**Avec le pentachlorure de phosphore $\mathrm{PCl_5}$ :**

$$\mathrm{R-COOH + PCl_5 \longrightarrow R-COCl + POCl_3 + HCl}$$

Dans les deux cas, **un chlorure d’hydrogène $\mathrm{HCl}$ se dégage** — c’est ce dégagement que l’on exploite dans les exercices pour calculer un volume gazeux.

### Nomenclature

On part du nom de l’acide, on remplace **« acide »** par **« chlorure de »** et la terminaison **« oïque »** par **« oyle »**.

| Formule | Nom |
|---|---|
| $\mathrm{CH_3-COCl}$ | chlorure d’éthanoyle |
| $\mathrm{CH_3-CH(CH_3)-COCl}$ | chlorure de 2-méthylpropanoyle |

## Les anhydrides d’acide

### Obtention

Un anhydride résulte de **l’élimination d’une molécule d’eau entre deux molécules d’acide carboxylique**. La déshydratation se fait par simple **chauffage**, en présence d’un déshydratant énergétique comme le **décaoxyde de tétraphosphore $\mathrm{P_4O_{10}}$** :

$$\mathrm{R-COOH + R'-COOH \xrightarrow{\;P_4O_{10},\;\Delta\;} R-CO-O-CO-R' + H_2O}$$

### Nomenclature

On remplace simplement, dans le nom de l’acide, le mot **« acide »** par le mot **« anhydride »**.

| Formule | Nom |
|---|---|
| $\mathrm{CH_3-CO-O-CO-CH_3}$ | anhydride éthanoïque |
| $\mathrm{CH_3-CH_2-CO-O-CO-CH_3}$ | anhydride éthanoïque et propanoïque |

Quand les deux moitiés diffèrent, l’anhydride est dit **mixte** et on nomme les deux acides.

> **Astuce mémoire de Davy.** Pour les chlorures, retiens la transformation du suffixe : **oïque → oyle**. « Acide éthan**oïque** » devient « chlorure d’éthan**oyle** ». Le squelette du nom ne bouge pas, seule la terminaison change.`,
    keyPoint: "Chlorure d’acyle : $\\mathrm{R-COOH + SOCl_2 \\to R-COCl + SO_2 + HCl}$, nom en « chlorure de …oyle ». Anhydride : déshydratation de deux acides, nom en « anhydride …oïque ».",
    example: "$\\mathrm{CH_3-COOH + SOCl_2 \\to CH_3-COCl + SO_2 + HCl}$ : l’acide éthanoïque donne le chlorure d’éthanoyle.",
    methodSteps: [
      "Pour un chlorure d’acyle, choisis le réactif : $\\mathrm{SOCl_2}$ ou $\\mathrm{PCl_5}$.",
      "Écris l’équation en n’oubliant pas le sous-produit et le $\\mathrm{HCl}$ dégagé.",
      "Pour un anhydride, associe deux acides et retire une molécule d’eau.",
      "Nomme : « oïque » devient « oyle » pour le chlorure ; « acide » devient « anhydride » pour l’anhydride.",
    ],
    interaction: timeline(
      [
        { label: "Partir de l’acide", shortLabel: "Acide", detail: "Le point de départ est toujours R–COOH. C’est le groupe –OH du carboxyle qui va être remplacé ou éliminé." },
        { label: "Chlorure d’acyle : substituer par Cl", shortLabel: "Chlorure", detail: "Avec SOCl₂ : R–COOH + SOCl₂ → R–COCl + SO₂ + HCl. Avec PCl₅ : R–COOH + PCl₅ → R–COCl + POCl₃ + HCl. Dans les deux cas, du chlorure d’hydrogène se dégage." },
        { label: "Anhydride : éliminer une molécule d’eau", shortLabel: "Anhydride", detail: "Deux molécules d’acide se soudent en perdant une molécule d’eau, par chauffage en présence de P₄O₁₀. Le produit contient deux carbonyles encadrant un oxygène." },
        { label: "Nommer le produit", shortLabel: "Nommer", detail: "Chlorure : « acide …oïque » devient « chlorure de …oyle ». Anhydride : « acide » devient « anhydride », et les deux acides sont cités si l’anhydride est mixte." },
      ],
      "De l’acide à ses deux dérivés les plus réactifs",
      "Parcours les étapes : la même molécule de départ donne deux dérivés selon le réactif employé.",
      "Ces deux dérivés sont les plus réactifs de la famille. C’est précisément pour cela qu’on les fabrique : ils servent ensuite à obtenir esters et amides par des réactions rapides et totales.",
    ),
    questions: [
      choice("Quel réactif transforme un acide carboxylique en chlorure d’acyle ?", ["$\\mathrm{SOCl_2}$", "$\\mathrm{P_4O_{10}}$", "$\\mathrm{NH_3}$", "$\\mathrm{NaOH}$"], 0, "Le chlorure de thionyle, ou le pentachlorure de phosphore.", "2.2.1 a) Obtention"),
      short("Nomme le composé $\\mathrm{CH_3-COCl}$.", ["chlorure d'ethanoyle", "chlorure d’éthanoyle", "chlorure d'éthanoyle"], "« oïque » devient « oyle ».", "2.2.1 b) Nomenclature", 2),
      choice("Dans la réaction avec $\\mathrm{PCl_5}$, quels sont les produits ?", ["$\\mathrm{R-COCl}$, $\\mathrm{POCl_3}$ et $\\mathrm{HCl}$", "$\\mathrm{R-COCl}$ et $\\mathrm{SO_2}$", "$\\mathrm{R-COCl}$ et $\\mathrm{H_2O}$"], 0, "Équation du cours.", "2.2.1 a) Obtention", 2),
      choice("Un anhydride d’acide résulte de…", ["l’élimination d’une molécule d’eau entre deux acides", "l’addition d’eau sur un acide", "la réaction d’un acide avec l’ammoniac"], 0, "C’est une déshydratation, réalisée par chauffage avec $\\mathrm{P_4O_{10}}$.", "2.2.2 a) Obtention"),
      short("Quel déshydratant énergétique est utilisé pour préparer un anhydride ?", ["P4O10", "p4o10", "decaoxyde de tetraphosphore", "décaoxyde de tétraphosphore"], "Le décaoxyde de tétraphosphore $\\mathrm{P_4O_{10}}$.", "2.2.2 a) Obtention", 2),
      short("Nomme le composé $\\mathrm{CH_3-CO-O-CO-CH_3}$.", ["anhydride ethanoique", "anhydride éthanoïque", "anhydride ethanoïque"], "« acide » devient « anhydride ».", "2.2.2 b) Nomenclature", 2),
    ],
  },
  {
    id: "amides-formation",
    title: "Les amides : deux voies, trois classes",
    summary: "Obtenir un amide depuis l’acide ou depuis le chlorure d’acyle, et nommer les amides primaires, secondaires et tertiaires.",
    pages: "3-4",
    section: "2.2.3 Les amides",
    durationMinutes: 28,
    xp: 65,
    body: String.raw`## Voie 1 — à partir de l’acide et de l’ammoniac

La réaction se déroule **en deux étapes** et donne un **amide non substitué**.

**1ʳᵉ étape — une simple réaction acide-base**, qui forme un carboxylate d’ammonium :

$$\mathrm{R-COOH + NH_3 \longrightarrow R-COO^- + NH_4^+}$$

**2ᵉ étape — déshydratation du carboxylate d’ammonium par chauffage :**

$$\mathrm{R-COO^-\!,\,NH_4^+ \xrightarrow{\;\Delta\;} R-CO-NH_2 + H_2O}$$

## Voie 2 — à partir du chlorure d’acyle et de l’ammoniac

La réaction est **rapide, totale**, et se déroule **en une seule étape** :

$$\mathrm{R-COCl + NH_3 \longrightarrow R-CO-NH_2 + HCl}$$

C’est l’illustration directe de la règle de réactivité : le chlorure d’acyle, plus réactif que l’acide, permet d’atteindre le même produit **en une étape au lieu de deux**.

> **Remarque du cours.** Avec les **amines primaires** et **secondaires** à la place de l’ammoniac, on obtient respectivement des **amides secondaires** et **tertiaires**.

## Nomenclature

Le nom s’obtient en remplaçant le **« e » final** du nom de l’hydrocarbure correspondant par **« amide »**, précédé de la lettre **N** devant le nom de chaque substituant porté par l’atome d’azote.

| Formule | Nom | Classe |
|---|---|---|
| $\mathrm{H-CO-NH_2}$ | méthanamide | amide primaire |
| $\mathrm{CH_3-CO-NH-CH_3}$ | N-méthyléthanamide | amide secondaire |
| $\mathrm{CH_3-CH_2-CO-N(CH_3)(C_2H_5)}$ | N-éthyl-N-méthylpropanamide | amide tertiaire |

> **Astuce mémoire de Davy.** La classe d’un amide se lit **sur l’azote**, pas sur le carbone. Compte les groupes alkyle portés par $\mathrm{N}$ : **aucun → primaire, un → secondaire, deux → tertiaire**. Attention, c’est une logique différente de celle des alcools, où l’on comptait sur le carbone fonctionnel.

> **Erreur fréquente.** Oublier la lettre **N** devant le nom du substituant. « méthyléthanamide » désignerait un méthyle sur la chaîne carbonée ; « **N**-méthyléthanamide » précise qu’il est porté par l’azote. La lettre change la molécule.`,
    keyPoint: "Depuis l’acide : deux étapes, via le carboxylate d’ammonium. Depuis le chlorure d’acyle : une étape, rapide et totale. Classe lue sur l’azote : 0, 1 ou 2 substituants.",
    example: "$\\mathrm{CH_3-COCl + NH_3 \\to CH_3-CO-NH_2 + HCl}$ donne l’éthanamide en une seule étape.",
    methodSteps: [
      "Choisis le point de départ : acide (deux étapes) ou chlorure d’acyle (une étape).",
      "Depuis l’acide, écris d’abord la réaction acide-base, puis la déshydratation par chauffage.",
      "Compte les groupes alkyle portés par l’azote pour donner la classe.",
      "Nomme en plaçant un N devant chaque substituant de l’azote.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les trois classes d’amide",
      instruction: "Sélectionne une classe pour voir sa structure sur l’azote et un exemple nommé.",
      observation: "Contrairement aux alcools, la classe d’un amide se lit sur l’atome d’azote. Le carbone fonctionnel, lui, ne change pas d’une classe à l’autre.",
      rootLabel: "Atome d’azote de la fonction amide",
      rootDetail: "Combien de groupes alkyle porte-t-il ?",
      nodes: [
        { id: "primaire", label: "Amide primaire", role: "0 substituant — R–CO–NH₂", detail: "L’azote ne porte que des hydrogènes. C’est l’amide non substitué, obtenu directement avec l’ammoniac. Exemple : méthanamide H–CO–NH₂." },
        { id: "secondaire", label: "Amide secondaire", role: "1 substituant — R–CO–NH–R′", detail: "L’azote porte un groupe alkyle, signalé par la lettre N dans le nom. Obtenu avec une amine primaire à la place de l’ammoniac. Exemple : N-méthyléthanamide CH₃–CO–NH–CH₃." },
        { id: "tertiaire", label: "Amide tertiaire", role: "2 substituants — R–CO–N(R′)(R″)", detail: "L’azote porte deux groupes alkyle, chacun précédé d’un N dans le nom. Obtenu avec une amine secondaire. Exemple : N-éthyl-N-méthylpropanamide." },
      ],
    },
    questions: [
      choice("La formation d’un amide à partir d’un acide carboxylique et de l’ammoniac se déroule en…", ["deux étapes", "une seule étape", "trois étapes"], 0, "Réaction acide-base, puis déshydratation par chauffage.", "2.2.3 a) Obtention"),
      choice("Quel composé intermédiaire se forme lors de la première étape ?", ["un carboxylate d’ammonium", "un ester", "un anhydride"], 0, "$\\mathrm{R-COOH + NH_3 \\to R-COO^- + NH_4^+}$.", "2.2.3 a) Obtention", 2),
      choice("La réaction entre un chlorure d’acyle et l’ammoniac est…", ["rapide, totale et en une seule étape", "lente et limitée", "réversible"], 0, "C’est l’avantage du chlorure d’acyle.", "2.2.3 a) Obtention", 2),
      short("Nomme le composé $\\mathrm{H-CO-NH_2}$.", ["methanamide", "méthanamide", "le méthanamide"], "Un seul carbone, fonction amide.", "2.2.3 b) Nomenclature"),
      short("Nomme le composé $\\mathrm{CH_3-CO-NH-CH_3}$.", ["n-methylethanamide", "N-méthyléthanamide", "n-méthyléthanamide"], "Un méthyle sur l’azote : la lettre N est obligatoire.", "2.2.3 b) Nomenclature", 2),
      choice("Un amide dont l’azote porte deux groupes alkyle est…", ["tertiaire", "primaire", "secondaire"], 0, "La classe se lit sur le nombre de substituants de l’azote.", "2.2.3 b) Nomenclature", 2),
      choice("Avec une amine primaire au lieu de l’ammoniac, on obtient…", ["un amide secondaire", "un amide primaire", "un amide tertiaire"], 0, "C’est la remarque du cours.", "2.2.3 a) Remarque", 2),
    ],
  },
  {
    id: "esterification-reactions",
    title: "L’estérification, directe et indirecte",
    summary: "Opposer l’estérification directe — lente, limitée, réversible — à l’estérification indirecte, rapide et totale, et nommer les esters.",
    pages: "4",
    section: "2.2.4 Les esters",
    durationMinutes: 32,
    xp: 75,
    body: String.raw`## Estérification directe

C’est la réaction entre un **acide carboxylique** et un **alcool** :

$$\mathrm{R-COOH + R'-OH \rightleftharpoons R-CO-O-R' + H_2O}$$

Ses quatre caractéristiques sont à connaître par cœur : elle est **lente, athermique, réversible et limitée**.

La **réaction inverse** s’appelle l’**hydrolyse d’un ester**. Elle possède exactement **les mêmes caractéristiques**.

## Estérification indirecte

C’est la réaction entre un **dérivé d’acide** — chlorure d’acyle ou anhydride — et un **alcool**. Elle est **totale, rapide et exothermique**.

**Avec un anhydride :**

$$\mathrm{R-CO-O-CO-R + R'-OH \longrightarrow R-CO-O-R' + R-COOH}$$

**Avec un chlorure d’acyle :**

$$\mathrm{R-COCl + R'-OH \longrightarrow R-CO-O-R' + HCl}$$

## Directe ou indirecte : le tableau à retenir

| | Estérification **directe** | Estérification **indirecte** |
|---|---|---|
| Réactifs | acide + alcool | chlorure d’acyle ou anhydride + alcool |
| Vitesse | **lente** | **rapide** |
| Avancement | **limitée** (équilibre) | **totale** |
| Réversibilité | **réversible** | non réversible |
| Thermicité | **athermique** | **exothermique** |

## Nomenclature des esters

Le nom s’obtient à partir de celui de l’acide correspondant, en :

1. **supprimant** le mot « acide » ;
2. **remplaçant** le suffixe « oïque » par « **oate** » ;
3. **ajoutant** « de » ou « d’ » suivi du nom du **groupe alkyle lié à l’atome d’oxygène**.

| Formule | Nom |
|---|---|
| $\mathrm{H-CO-O-CH_2-CH_3}$ | méthanoate d’éthyle |
| $\mathrm{CH_3-CO-O-CH_3}$ | éthanoate de méthyle |

> **Astuce mémoire de Davy.** Dans un ester, **la partie « oate » vient de l’acide, la partie « de … » vient de l’alcool**. Coupe mentalement la molécule au niveau du $\mathrm{-CO-O-}$ : à gauche l’acide, à droite l’alcool. Tu ne te tromperas plus de sens.

> **Erreur fréquente.** Écrire l’estérification directe avec une flèche simple. Elle est **réversible et limitée** : la double flèche est obligatoire, et le rendement n’atteint jamais 100 %.`,
    keyPoint: "Directe : acide + alcool, lente, athermique, réversible, limitée. Indirecte : dérivé + alcool, rapide, totale, exothermique. Nom : « …oate de … ».",
    example: "$\\mathrm{CH_3-COCl + CH_3-OH \\to CH_3-CO-O-CH_3 + HCl}$ : estérification indirecte, rapide et totale, qui donne l’éthanoate de méthyle.",
    methodSteps: [
      "Identifie les réactifs : un acide donne la voie directe, un dérivé la voie indirecte.",
      "Écris l’équation avec la bonne flèche : double pour la directe, simple pour l’indirecte.",
      "Nomme l’ester en coupant au niveau du $\\mathrm{-CO-O-}$ : acide à gauche, alcool à droite.",
      "Cite les caractéristiques attendues : lente/limitée/athermique, ou rapide/totale/exothermique.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Deux chemins vers le même ester",
      instruction: "Sélectionne une voie pour comparer ses réactifs et ses caractéristiques.",
      observation: "Le produit est identique, la performance ne l’est pas. Passer par un dérivé coûte une étape de préparation, mais transforme une réaction limitée en réaction totale.",
      rootLabel: "Obtenir un ester R–CO–O–R′",
      rootDetail: "Par quel chemin passe-t-on ?",
      nodes: [
        { id: "directe", group: "Voie directe", label: "Acide + alcool", role: "lente, limitée, réversible, athermique", detail: "R–COOH + R′–OH ⇌ R–CO–O–R′ + H₂O. La réaction n’est jamais complète : un équilibre s’établit. Sa réaction inverse, l’hydrolyse de l’ester, a exactement les mêmes caractéristiques." },
        { id: "chlorure", group: "Voie indirecte", label: "Chlorure d’acyle + alcool", role: "rapide, totale, exothermique", detail: "R–COCl + R′–OH → R–CO–O–R′ + HCl. Un chlorure d’hydrogène se dégage. C’est la voie la plus efficace, celle qu’on choisit quand le rendement compte." },
        { id: "anhydride", group: "Voie indirecte", label: "Anhydride + alcool", role: "rapide, totale, exothermique", detail: "R–CO–O–CO–R + R′–OH → R–CO–O–R′ + R–COOH. La moitié de l’anhydride devient l’ester, l’autre redonne l’acide carboxylique de départ." },
        { id: "hydrolyse", group: "Sens inverse", label: "Hydrolyse de l’ester", role: "réaction inverse de la directe", detail: "L’ester réagit avec l’eau pour redonner l’acide et l’alcool. Lente, limitée, réversible et athermique, comme l’estérification directe dont elle est l’exact opposé." },
      ],
    },
    questions: [
      choice("L’estérification directe est…", ["lente, athermique, réversible et limitée", "rapide, totale et exothermique", "rapide mais limitée"], 0, "Ce sont les quatre caractéristiques du cours.", "2.2.4 a) Estérification directe", 2),
      choice("L’estérification indirecte est…", ["totale, rapide et exothermique", "lente et limitée", "athermique et réversible"], 0, "C’est l’avantage du passage par un dérivé.", "2.2.4 a) Estérification indirecte", 2),
      choice("Comment s’appelle la réaction inverse de l’estérification directe ?", ["l’hydrolyse de l’ester", "la saponification", "la déshydratation"], 0, "Elle possède les mêmes caractéristiques.", "2.2.4 a) Estérification directe"),
      short("Nomme le composé $\\mathrm{CH_3-CO-O-CH_3}$.", ["ethanoate de methyle", "éthanoate de méthyle", "ethanoate de méthyle"], "L’acide donne « éthanoate », l’alcool donne « de méthyle ».", "2.2.4 b) Nomenclature", 2),
      short("Nomme le composé $\\mathrm{H-CO-O-CH_2-CH_3}$.", ["methanoate d'ethyle", "méthanoate d’éthyle", "methanoate d'éthyle"], "Acide méthanoïque et éthanol.", "2.2.4 b) Nomenclature", 2),
      choice("Dans la réaction d’un anhydride avec un alcool, quel second produit se forme ?", ["un acide carboxylique", "de l’eau", "du chlorure d’hydrogène"], 0, "L’autre moitié de l’anhydride redonne l’acide.", "2.2.4 a) Cas des anhydrides", 2),
      choice("Dans la réaction d’un chlorure d’acyle avec un alcool, quel second produit se forme ?", ["du chlorure d’hydrogène $\\mathrm{HCl}$", "de l’eau", "un acide carboxylique"], 0, "$\\mathrm{R-COCl + R'-OH \\to R-CO-O-R' + HCl}$.", "2.2.4 a) Cas des chlorures d’acyle"),
    ],
  },
  {
    id: "derivatives-workshop",
    title: "Atelier : reconnaître, nommer, calculer",
    summary: "Compléter le tableau des fonctions dérivées, puis traiter les exercices de chlorure d’acyle et d’estérification avec leurs calculs.",
    pages: "4-5, 7-8",
    section: "Activité d’application 2 et exercices 1 à 3",
    durationMinutes: 34,
    xp: 80,
    kind: "practice",
    body: String.raw`## Le tableau des fonctions dérivées

| Fonction | Groupe caractéristique | Exemple | Nom |
|---|---|---|---|
| Ester | $\mathrm{-CO-O-}$ | $\mathrm{C_2H_5-CO-O-C_2H_5}$ | propanoate d’éthyle |
| Acide carboxylique | $\mathrm{-COOH}$ | $\mathrm{C_6H_5-COOH}$ | acide benzoïque |
| Chlorure d’acyle | $\mathrm{-CO-Cl}$ | $\mathrm{CH_3-CH(CH_3)-COCl}$ | chlorure de 2-méthylpropanoyle |
| Anhydride d’acide | $\mathrm{-CO-O-CO-}$ | $\mathrm{H-CO-O-CO-H}$ | anhydride méthanoïque |

## Exercice 1 — compléter le tableau

| Nom | Fonction | Formule semi-développée | Groupe |
|---|---|---|---|
| acide chloroéthanoïque | acide carboxylique | $\mathrm{ClCH_2-COOH}$ | $\mathrm{-COOH}$ |
| chlorure de benzoyle | chlorure d’acyle | $\mathrm{C_6H_5-COCl}$ | $\mathrm{-CO-Cl}$ |
| anhydride 2-méthylpropanoïque | anhydride d’acide | $\mathrm{(CH_3)_2CH-CO-O-CO-CH(CH_3)_2}$ | $\mathrm{-CO-O-CO-}$ |
| N-éthylpropanamide | amide | $\mathrm{CH_3-CH_2-CO-NH-C_2H_5}$ | $\mathrm{-CO-N}$ |
| méthanoate de 1-méthyléthyle | ester | $\mathrm{H-CO-O-CH(CH_3)_2}$ | $\mathrm{-CO-O-}$ |
| **acide 2-méthylbutanoïque** | acide carboxylique | $\mathrm{CH_3-CH(C_2H_5)-COOH}$ | $\mathrm{-COOH}$ |

## Exercice 2 — le chlorure d’éthanoyle et son dégagement gazeux

On fait réagir du chlorure de thionyle sur $m = 3$ g d’acide éthanoïque.

$$\mathrm{CH_3-COOH + SOCl_2 \longrightarrow CH_3-COCl + SO_2 + HCl}$$

Le produit **B** est le **chlorure d’éthanoyle**, un chlorure d’acyle de groupe $\mathrm{-CO-Cl}$.

Le calcul du volume de $\mathrm{HCl}$ dégagé exploite la proportion **1 : 1** entre l’acide et le gaz :

$$n = \frac{m}{M} = \frac{3}{60} = 0{,}05 \text{ mol} \qquad V = n \times V_m = 0{,}05 \times 24 = \mathbf{1{,}2 \text{ L}}$$

## Exercice 3 — remonter à l’acide depuis la masse molaire

Un ester **E** de masse molaire $M = 116$ g·mol⁻¹ est obtenu à partir d’un **alcool secondaire A** de formule $\mathrm{C_3H_8O}$ — c’est le **propan-2-ol** $\mathrm{CH_3-CHOH-CH_3}$ — et d’un acide $\mathrm{C_nH_{2n+1}-COOH}$.

L’ester s’écrit $\mathrm{C_nH_{2n+1}-CO-O-CH(CH_3)_2}$, soit $\mathrm{C_{n+4}H_{2n+8}O_2}$, d’où :

$$M_E = 14n + 88 = 116 \quad \Longrightarrow \quad n = 2$$

L’acide **B** est donc $\mathrm{C_2H_5-COOH}$, l’**acide propanoïque**.

> **Astuce mémoire de Davy.** Dans ces exercices, la masse molaire est presque toujours de la forme $14n + \text{constante}$. Prends l’habitude de **recalculer la constante toi-même** à partir de la formule de l’ester : c’est rapide, et cela t’évite de propager une erreur d’énoncé.`,
    keyPoint: "La chaîne principale d’un acide est la plus longue contenant le carboxyle. Pour un ester issu du propan-2-ol : $M = 14n + 88$.",
    example: "$\\mathrm{CH_3-CH(C_2H_5)-COOH}$ : la plus longue chaîne contenant le carboxyle a quatre carbones, avec un méthyle en 2 — c’est l’acide 2-méthylbutanoïque.",
    methodSteps: [
      "Pour nommer, cherche d’abord la plus longue chaîne contenant le carbone du carboxyle.",
      "Pour un calcul de volume gazeux, écris l’équation et lis la proportion molaire.",
      "Pour remonter à un acide, exprime la masse molaire de l’ester en fonction de $n$.",
      "Recalcule toi-même la constante de la relation $M = 14n + c$ avant de résoudre.",
    ],
    interaction: timeline(
      [
        { label: "Lire la formule", shortLabel: "Lire", detail: "Repérer le carbonyle, puis ce qui le suit : Cl, O–R′, O–CO–R′ ou NH₂. Compter les carbonyles départage l’ester de l’anhydride." },
        { label: "Trouver la chaîne principale", shortLabel: "Chaîne", detail: "Pour un acide, c’est la plus longue chaîne contenant le carbone du carboxyle. C’est cette règle qui donne « acide 2-méthylbutanoïque » et non « acide 2-éthylpropanoïque » pour CH₃–CH(C₂H₅)–COOH." },
        { label: "Écrire l’équation", shortLabel: "Équation", detail: "Elle fixe les proportions molaires. Dans CH₃–COOH + SOCl₂ → CH₃–COCl + SO₂ + HCl, une mole d’acide dégage une mole de HCl." },
        { label: "Mener le calcul", shortLabel: "Calculer", detail: "n = m/M pour le réactif, puis V = n × Vm pour un gaz. Pour remonter à une formule, exprimer M en fonction de n et résoudre." },
      ],
      "La démarche des exercices",
      "Suis les quatre étapes : elles couvrent aussi bien les questions de nomenclature que les calculs.",
      "Les exercices mélangent lecture de formule et calcul quantitatif, mais l’équation-bilan est toujours le pivot : c’est elle qui relie la structure aux nombres.",
    ),
    questions: [
      short("Quel est le groupe caractéristique d’un anhydride d’acide ?", ["-CO-O-CO-", "CO-O-OC", "-CO-O-CO"], "Deux carbonyles encadrant un oxygène.", "Activité d’application 2", 2),
      short("Nomme le composé $\\mathrm{C_6H_5-COOH}$.", ["acide benzoique", "acide benzoïque"], "L’acide aromatique du tableau.", "Activité d’application 2"),
      short("Quelle est la formule semi-développée de l’acide chloroéthanoïque ?", ["ClCH2COOH", "ClCH2-COOH", "clch2cooh"], "Un chlore remplace un hydrogène de l’acide éthanoïque.", "Exercice 1", 2),
      short("Exercice 2 : quel volume de chlorure d’hydrogène se dégage à partir de 3 g d’acide éthanoïque ? (en L)", ["1,2", "1.2", "1,2 L", "1.2 L"], "$n = 3/60 = 0{,}05$ mol, puis $V = 0{,}05 \\times 24 = 1{,}2$ L.", "Exercice 2 - question 2.2", 3),
      short("Exercice 3 : nomme l’alcool secondaire A de formule $\\mathrm{C_3H_8O}$.", ["propan-2-ol", "propan2ol", "le propan-2-ol"], "Le seul alcool secondaire à trois carbones.", "Exercice 3 - question 1", 2),
      short("Exercice 3 : nomme l’acide B, pour un ester de masse molaire 116 g·mol⁻¹.", ["acide propanoique", "acide propanoïque"], "$14n + 88 = 116$ donne $n = 2$ : acide propanoïque.", "Exercice 3 - question 2.2", 3),
      choice("Quel est le nom correct de $\\mathrm{CH_3-CH(C_2H_5)-COOH}$ ?", ["acide 2-méthylbutanoïque", "acide 2-éthylpropanoïque", "acide 3-méthylbutanoïque"], 0, "La plus longue chaîne contenant le carboxyle compte quatre carbones.", "Exercice 1 - dernière ligne", 3),
    ],
    corrections: [
      "Page 7, exercice 1 : le corrigé nomme CH₃–CH(C₂H₅)–COOH « acide 2-éthylpropanoïque ». Ce nom viole la règle de la chaîne principale la plus longue contenant le carboxyle, qui compte ici quatre carbones. Le nom correct est acide 2-méthylbutanoïque.",
      "Page 7, exercice 1 : la ligne du composé C₆H₅–COCl est laissée vide dans le corrigé. Elle est complétée ici : chlorure de benzoyle, fonction chlorure d’acyle, groupe –CO–Cl.",
      "Page 7, exercice 1 : le groupe caractéristique de l’anhydride est noté « -CO-O-OC- ». L’écriture correcte est –CO–O–CO–.",
      "Page 8, exercice 3 : le corrigé pose M_E = 14n + 87. La constante exacte est 88 pour un ester du propan-2-ol (C_{n+4}H_{2n+8}O₂). Avec 87, l’équation ne donnerait pas un entier ; le résultat annoncé, n = 2, est bien celui de la relation corrigée.",
    ],
  },
  {
    id: "ester-structure-mission",
    title: "Mission finale : remonter à la structure d’un ester",
    summary: "Identifier un ester par son pourcentage d’oxygène, retrouver l’acide et l’alcool par hydrolyse, puis comparer les deux voies de synthèse.",
    pages: "5-10",
    section: "Situation d’évaluation et exercices 4 et 5",
    durationMinutes: 42,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

Un ester saturé **E** de formule $\mathrm{C_nH_{2n}O_2}$ contient **31,37 %** d’oxygène en masse. Son **hydrolyse** donne deux composés **A** et **B**.

- **A** est soluble dans l’eau, sa solution **conduit le courant**, elle **jaunit le B.B.T.**, et **A contient deux carbones**.
- **B** subit une **oxydation ménagée** en un composé **D** qui donne un **précipité jaune avec la 2,4-DNPH** mais **ne réagit pas avec la liqueur de Fehling**. **B** s’obtient par **hydratation du propène** $\mathrm{CH_3-CH=CH_2}$.

## Le raisonnement

**1. La formule brute de E.** L’ester contient deux oxygènes, de masse $2 \times 16 = 32$ :

$$\frac{32}{M} = \frac{31{,}37}{100} \quad \Longrightarrow \quad M = \frac{3200}{31{,}37} = 102 \text{ g·mol}^{-1}$$

Or pour $\mathrm{C_nH_{2n}O_2}$, $M = 14n + 32$, d’où $n = \dfrac{102-32}{14} = 5$ : **E est $\mathrm{C_5H_{10}O_2}$**.

**2. Le composé A.** Il jaunit le B.B.T. et conduit le courant : **A est un acide carboxylique**. Avec deux carbones, c’est l’**acide éthanoïque** $\mathrm{CH_3-COOH}$.

**3. Le composé B.** Son oxydation donne **D**, qui réagit à la 2,4-DNPH — donc **D est carbonylé** — mais pas à la liqueur de Fehling — donc **D est une cétone**. Or seule l’oxydation d’un **alcool secondaire** donne une cétone : **B est un alcool secondaire**.

L’hydratation du **propène** confirme la structure : **B est le propan-2-ol** $\mathrm{CH_3-CHOH-CH_3}$, et **D la propanone** $\mathrm{CH_3-CO-CH_3}$.

**4. L’ester E.** Acide éthanoïque + propan-2-ol :

$$\mathrm{CH_3-CO-O-CH(CH_3)_2}$$

C’est l’**éthanoate de 1-méthyléthyle**, aussi appelé **éthanoate d’isopropyle**. Vérification : $\mathrm{C_5H_{10}O_2}$ ✓.

**5. Les deux voies de synthèse.** Soit **F** le chlorure d’acyle dérivant de l’acide éthanoïque, $\mathrm{CH_3-COCl}$ :

$$(1)\quad \mathrm{CH_3-COOH + CH_3-CHOH-CH_3 \rightleftharpoons E + H_2O}$$
$$(2)\quad \mathrm{CH_3-COCl + CH_3-CHOH-CH_3 \longrightarrow E + HCl}$$

| | Réaction (1) | Réaction (2) |
|---|---|---|
| Vitesse | lente | rapide |
| Avancement | limitée | totale |
| Thermicité | athermique | exothermique |

## Les deux variantes

**Par le rendement (exercice 4).** 20 g de chlorure de propanoyle $\mathrm{CH_3-CH_2-COCl}$ ($M = 92{,}5$) réagissent sur un alcool $\mathrm{R-OH}$ et donnent 20,4 g d’ester **F**, avec un rendement de 92,5 %.

$$M_F = \frac{m_F \times M_D}{r \times m_D} = \frac{20{,}4 \times 92{,}5}{0{,}925 \times 20} = 102 \text{ g·mol}^{-1}$$

**F** est le **propanoate d’éthyle** $\mathrm{CH_3-CH_2-CO-O-C_2H_5}$, et l’alcool **A** l’**éthanol**. La réaction est une **estérification indirecte** : rapide, totale, exothermique.

**Par le dosage (exercice 5).** L’oxydation ménagée d’un alcool primaire non ramifié **A** donne **B**, qui rosit le réactif de Schiff — donc un **aldéhyde** — puis **D**, qui jaunit le B.B.T. — donc un **acide carboxylique**.

Le dosage de 0,37 g de **D** par litre donne, à l’équivalence, $C_a V_a = C_b V_b$ :

$$C_a = \frac{10^{-2} \times 25}{50} = 5\times10^{-3} \text{ mol·L}^{-1} \qquad M = \frac{0{,}37}{5\times10^{-3}} = 74 \text{ g·mol}^{-1}$$

Puis $14n + 32 = 74$ donne $n = 3$ : **D est l’acide propanoïque** $\mathrm{CH_3-CH_2-COOH}$, et **A le propan-1-ol** $\mathrm{CH_3-CH_2-CH_2-OH}$.

Enfin, $\mathrm{PCl_5}$ transforme **D** en **E**, le chlorure de propanoyle, qui réagit avec l’ammoniac pour donner **F**, le **propanamide** — un **amide**.

> **Astuce mémoire de Davy.** Trois énoncés, une même ossature : **une donnée quantitative** fixe la formule brute, **des tests** fixent les fonctions, **une précision de structure** choisit l’isomère. Reconnais l’ossature et tu résoudras les trois.`,
    keyPoint: "Le pourcentage d’oxygène donne $M$, la relation $M = 14n + 32$ donne $n$, les tests donnent les fonctions, et l’hydratation d’un alcène donne l’isomère.",
    example: "31,37 % d’oxygène → $M = 102$ → $\\mathrm{C_5H_{10}O_2}$ ; B.B.T. jaune → acide éthanoïque ; cétone après oxydation → propan-2-ol ; donc E = éthanoate de 1-méthyléthyle.",
    methodSteps: [
      "Traduis le pourcentage massique en masse molaire, puis en formule brute.",
      "Lis chaque test : B.B.T. jaune pour un acide, 2,4-DNPH sans Fehling pour une cétone, Schiff rose pour un aldéhyde.",
      "Remonte de la cétone à l’alcool secondaire, ou de l’aldéhyde à l’alcool primaire.",
      "Recompose l’ester et écris les deux équations de synthèse avec leurs caractéristiques.",
    ],
    interaction: timeline(
      [
        { label: "Du pourcentage à la formule brute", shortLabel: "Formule", detail: "Les deux oxygènes pèsent 32 g·mol⁻¹. Si %O = 31,37, alors M = 3200/31,37 = 102. Puis M = 14n + 32 donne n = 5, soit C₅H₁₀O₂." },
        { label: "Des tests aux fonctions", shortLabel: "Fonctions", detail: "Le B.B.T. jaune et la conduction du courant désignent un acide carboxylique. Un produit d’oxydation qui répond à la 2,4-DNPH mais pas à Fehling est une cétone, donc l’alcool de départ est secondaire." },
        { label: "De l’alcène à l’isomère", shortLabel: "Isomère", detail: "L’hydratation du propène CH₃–CH=CH₂ donne majoritairement le propan-2-ol, conformément à la règle de Markovnikov vue à la leçon sur les alcools. C’est ce qui fixe la structure de B." },
        { label: "Recomposer et comparer", shortLabel: "Synthèse", detail: "Acide éthanoïque et propan-2-ol donnent l’éthanoate de 1-méthyléthyle. La voie directe est lente et limitée ; en passant par le chlorure d’éthanoyle, elle devient rapide et totale." },
      ],
      "L’ossature d’une identification d’ester",
      "Suis les quatre étapes : c’est la trame commune à la situation d’évaluation et aux exercices 4 et 5.",
      "Cette leçon réutilise tout ce qui précède : l’oxydation ménagée des alcools, les tests des composés carbonylés, et l’hydratation d’un alcène. Rien n’y est isolé.",
    ),
    questions: [
      short("Un ester $\\mathrm{C_nH_{2n}O_2}$ contient 31,37 % d’oxygène. Quelle est sa masse molaire, en g·mol⁻¹ ?", ["102", "102 g/mol", "102g/mol"], "$M = 3200 / 31{,}37 = 102$.", "Situation d’évaluation - question 1", 2),
      short("Quelle est la formule brute de cet ester ?", ["C5H10O2", "c5h10o2"], "$14n + 32 = 102$ donne $n = 5$.", "Situation d’évaluation - question 1", 2),
      choice("Le composé A jaunit le B.B.T. et conduit le courant. Sa fonction est…", ["acide carboxylique", "alcool", "ester", "amide"], 0, "Le B.B.T. vire au jaune en milieu acide.", "Situation d’évaluation - question 2.1.1", 2),
      choice("D réagit avec la 2,4-DNPH mais pas avec la liqueur de Fehling. D est donc…", ["une cétone", "un aldéhyde", "un acide carboxylique"], 0, "Carbonylé mais non réducteur : c’est une cétone.", "Situation d’évaluation - question 2.2.1", 2),
      short("Nomme le composé B, obtenu par hydratation du propène et dont l’oxydation donne une cétone.", ["propan-2-ol", "propan2ol", "le propan-2-ol"], "Alcool secondaire à trois carbones.", "Situation d’évaluation - question 2.2.2 b", 2),
      choice("Quelles sont les différences entre l’estérification directe (1) et indirecte (2) ?", ["(1) lente, limitée, athermique ; (2) rapide, totale, exothermique", "(1) rapide et totale ; (2) lente et limitée", "les deux sont identiques"], 0, "C’est la comparaison demandée par l’énoncé.", "Situation d’évaluation - question 3.2.2", 3),
      short("Exercice 4 : quelle est la masse molaire de l’ester F, pour 20,4 g obtenus à partir de 20 g de chlorure de propanoyle avec un rendement de 92,5 % ? (en g·mol⁻¹)", ["102", "102 g/mol"], "$M_F = (20{,}4 \\times 92{,}5)/(0{,}925 \\times 20) = 102$.", "Exercice 4 - question 3.1", 3),
      short("Exercice 5 : nomme le composé D, de masse molaire 74 g·mol⁻¹ et de fonction acide carboxylique.", ["acide propanoique", "acide propanoïque"], "$14n + 32 = 74$ donne $n = 3$.", "Exercice 5 - question 2.3", 3),
      choice("Exercice 5 : le composé F, obtenu en faisant réagir l’ammoniac sur le chlorure de propanoyle, est…", ["le propanamide, un amide", "l’acide propanoïque", "le propanoate d’éthyle"], 0, "Chlorure d’acyle + ammoniac donne un amide.", "Exercice 5 - question 3.2", 2),
    ],
    corrections: [
      "Page 7, situation d’évaluation, question 3.2.3 : le corrigé nomme l’ester « éthanoate de méthyl-éthyle ». Cette forme est incorrecte ; le nom systématique du groupe CH(CH₃)₂ est 1-méthyléthyle, comme le document l’écrit d’ailleurs lui-même à l’exercice 1. Le nom retenu ici est éthanoate de 1-méthyléthyle, ou éthanoate d’isopropyle.",
      "Page 10, exercice 5 : le corrigé n’apporte pas de réponse à la question 2.4, qui demande la formule semi-développée et le nom de l’alcool A. Elle est ajoutée ici : propan-1-ol CH₃–CH₂–CH₂–OH, seul alcool primaire non ramifié conduisant à l’acide propanoïque.",
      "Page 10, exercice 5 : la dernière réponse du corrigé est numérotée « 3.3 » alors que l’énoncé s’arrête à la question 3.2. La numérotation est rétablie.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const carboxylicAcidsPath: LearningPath = {
  id: "terminale-cd-chemistry-carboxylic-acids",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Chimie organique" },
  chapterNumber: 3,
  title: "Acides carboxyliques et dérivés",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître et nommer un acide carboxylique, et justifier son acidité faible",
    "Identifier les quatre dérivés et écrire les équations de passage depuis l’acide",
    "Nommer chlorures d’acyle, anhydrides, amides et esters",
    "Opposer estérification directe et indirecte, et identifier un ester inconnu",
  ],
  modules: [
    { id: "carboxylic-mastery", title: "Maîtriser les acides carboxyliques et leurs dérivés", description: "Un niveau après l’autre, du groupe carboxyle à l’identification d’un ester inconnu.", lessons: builtLevels },
  ],
};
