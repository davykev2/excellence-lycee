import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L3_ Les amines.pdf";

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
      introduction: "Applique cette démarche aux activités et exercices du document source.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "Sur une formule d'amine, commence toujours par compter les groupes carbonés directement liés à l'azote.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const timeline = (
  items: TimelineInteractionItem[],
  title: string,
  introduction: string,
  instruction: string,
  observation: string,
): LessonInteraction => ({
  kind: "timeline",
  eyebrow: "Démarche",
  title,
  instruction: `${introduction} ${instruction}`,
  observation,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
});

const diagram = (
  nodes: DiagramNodeItem[],
  rootLabel: string,
  rootDetail: string,
  instruction: string,
  observation: string,
): LessonInteraction => ({
  kind: "diagram",
  eyebrow: "Carte interactive",
  title: rootLabel,
  instruction,
  observation,
  rootLabel,
  rootDetail,
  nodes: nodes as [DiagramNodeItem, DiagramNodeItem, ...DiagramNodeItem[]],
});

const levels: LevelSeed[] = [
  {
    id: "amine-definition-classes",
    title: "Définir une amine et reconnaître sa classe",
    summary: "Passer de l'ammoniac aux amines, utiliser leur formule brute et distinguer les amines primaires, secondaires et tertiaires.",
    pages: "1-2",
    section: "II.1 Définition et II.2 Les trois classes d'amine - activités 1 et 2",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## 1. De l'ammoniac à une amine

Une **amine** est obtenue en remplaçant un, deux ou trois atomes d'hydrogène de la molécule d'ammoniac $\mathrm{NH_3}$ par des groupes hydrocarbonés, appelés groupes **alkyle** ou **aryle**.

| Molécule de départ | Remplacement | Forme obtenue |
|---|---|---|
| $\mathrm{NH_3}$ | un hydrogène remplacé | $\mathrm{R-NH_2}$ |
| $\mathrm{NH_3}$ | deux hydrogènes remplacés | $\mathrm{R_1-NH-R_2}$ |
| $\mathrm{NH_3}$ | trois hydrogènes remplacés | $\mathrm{R_1-N(R_2)-R_3}$ |

Pour une **monoamine saturée, acyclique et sans autre fonction**, la formule brute générale est :

$$\boxed{\mathrm{C_nH_{2n+3}N}}$$

Cette formule permet de reconnaître une famille possible, mais elle ne suffit pas à connaître la structure : plusieurs isomères peuvent partager la même formule brute.

> **Précision importante.** Le document écrit que « les amines saturées » ont toutes cette formule. Elle vaut pour les monoamines saturées **acycliques**. Une amine cyclique ou aromatique ne suit pas nécessairement $\mathrm{C_nH_{2n+3}N}$.

## 2. Les trois classes

La classe d'une amine dépend du nombre de **groupes carbonés directement liés à l'atome d'azote**. On ne compte ni le nombre total de carbones, ni le nombre d'hydrogènes portés par le reste de la molécule.

| Classe | Forme générale | Groupes carbonés liés à N | Hydrogènes sur N |
|---|---|---:|---:|
| amine primaire | $\mathrm{R-NH_2}$ | 1 | 2 |
| amine secondaire | $\mathrm{R_1-NH-R_2}$ | 2 | 1 |
| amine tertiaire | $\mathrm{R_1-N(R_2)-R_3}$ | 3 | 0 |

Un ion $\mathrm{R_4N^+}$ possède quatre groupes carbonés autour de l'azote. Il ne constitue pas une « amine quaternaire » : c'est un **ion ammonium quaternaire**.

## 3. Activité d'application 1

Parmi les composés proposés dans le document :

- $\mathrm{CH_3-NH_2}$ est une amine ;
- $\mathrm{CH_3-NH-CH_3}$ est une amine ;
- $\mathrm{CH_3-CH_3}$ est un alcane ;
- $\mathrm{CH_3-CH_2-CH_3}$ est un alcane ;
- $\mathrm{CH_3-CH_2-OH}$ est un alcool ;
- $\mathrm{CH_3-CO-CH_3}$ est une cétone.

La présence de l'atome d'azote ne suffit pas toujours dans toute la chimie organique, mais, pour cette série simple, le groupe $\mathrm{-NH_2}$, $\mathrm{-NH-}$ ou $\mathrm{-N<}$ permet d'identifier l'amine.

## 4. Activité d'application 2

- $\mathrm{CH_3-NH-CH_3}$ : deux groupes méthyle sur N, donc **secondaire** ;
- $\mathrm{CH_3-N(CH_3)-CH_2-CH_3}$ : trois groupes carbonés sur N, donc **tertiaire** ;
- $\mathrm{CH_3-NH-CH_2-CH_3}$ : deux groupes carbonés sur N, donc **secondaire** ;
- $\mathrm{CH_3-NH_2}$ : un seul groupe carboné sur N, donc **primaire**.

> **Astuce mémoire de Davy.** Primaire, secondaire, tertiaire signifie ici **1, 2 ou 3 carbones attachés directement à N**. Place ton doigt sur N et compte seulement les liaisons N-C.` ,
    keyPoint: "Classe de l'amine = nombre de groupes carbonés directement liés à N : 1 primaire, 2 secondaire, 3 tertiaire.",
    example: "$\\mathrm{CH_3-NH-CH_2-CH_3}$ porte deux groupes carbonés sur N : c'est une amine secondaire.",
    methodSteps: [
      "Repère l'atome d'azote et les liaisons qui partent directement de lui.",
      "Écarte les molécules sans groupe amine, comme un alcane, un alcool ou une cétone.",
      "Compte les groupes carbonés liés directement à N.",
      "Associe 1, 2 ou 3 groupes à la classe primaire, secondaire ou tertiaire.",
      "Si l'azote porte quatre groupes et une charge positive, conclus à un ammonium quaternaire.",
    ],
    corrections: [
      "Page 1 : la formule CnH2n+3N est présentée comme celle de toutes les amines saturées. Elle est valable pour une monoamine saturée acyclique, sans autre fonction ; cette condition est désormais explicitée.",
      "Page 1 : la classification primaire, secondaire ou tertiaire dépend du nombre de groupes carbonés directement liés à l'azote, et non du nombre total de carbones de la molécule.",
    ],
    interaction: diagram(
      [
        { id: "primary", group: "Classe", label: "Amine primaire", role: "R-NH₂ - un groupe carboné", detail: "L'azote est lié à un groupe carboné et à deux hydrogènes. Exemple : CH₃-NH₂." },
        { id: "secondary", group: "Classe", label: "Amine secondaire", role: "R₁-NH-R₂ - deux groupes", detail: "L'azote est lié à deux groupes carbonés et conserve un hydrogène. Exemple : CH₃-NH-C₂H₅." },
        { id: "tertiary", group: "Classe", label: "Amine tertiaire", role: "R₁-N(R₂)-R₃ - trois groupes", detail: "L'azote est lié à trois groupes carbonés et ne porte plus d'hydrogène. Exemple : N,N-diméthyléthanamine." },
        { id: "quaternary", group: "À distinguer", label: "Ammonium quaternaire", role: "R₄N⁺ - quatre groupes", detail: "La quatrième liaison donne une charge positive. Il s'agit d'un ion ammonium quaternaire, pas d'une quatrième classe d'amine." },
      ],
      "Azote des amines",
      "Le doublet non liant de N reste disponible dans une amine primaire, secondaire ou tertiaire.",
      "Sélectionne chaque carte et compare le nombre de groupes directement liés à l'azote.",
      "La classe se lit localement autour de l'azote ; le reste de la chaîne n'intervient pas dans ce comptage.",
    ),
    questions: [
      choice("Une amine dérive formellement de…", ["l'ammoniac $\\mathrm{NH_3}$", "l'eau $\\mathrm{H_2O}$", "le méthane $\\mathrm{CH_4}$", "l'éthane $\\mathrm{C_2H_6}$"], 0, "On remplace un ou plusieurs hydrogènes de l'ammoniac par des groupes hydrocarbonés.", "II.1 Définition"),
      choice("Quelle formule convient à une monoamine saturée acyclique ?", ["$\\mathrm{C_nH_{2n+3}N}$", "$\\mathrm{C_nH_{2n+1}N}$", "$\\mathrm{C_nH_{2n+2}O}$", "$\\mathrm{C_nH_{2n}O}$"], 0, "La famille considérée possède une seule insaturation apparente due à l'azote trivalent.", "II.1 Définition"),
      choice("Lequel des composés proposés est une amine ?", ["$\\mathrm{CH_3-NH_2}$", "$\\mathrm{CH_3-CH_3}$", "$\\mathrm{CH_3-CH_2-OH}$", "$\\mathrm{CH_3-CO-CH_3}$"], 0, "Le groupe $\\mathrm{-NH_2}$ est porté par un groupe méthyle.", "Activité d'application 1"),
      choice("Le composé $\\mathrm{CH_3-NH-CH_3}$ est…", ["une amine secondaire", "une amine primaire", "une amine tertiaire", "un ammonium quaternaire"], 0, "Deux groupes méthyle sont directement liés à N.", "Activité d'application 2 - a"),
      choice("Le composé $\\mathrm{CH_3-N(CH_3)-CH_2-CH_3}$ est…", ["une amine tertiaire", "une amine secondaire", "une amine primaire", "un amide"], 0, "Trois groupes carbonés sont directement liés à N.", "Activité d'application 2 - b"),
      choice("Le composé $\\mathrm{CH_3-NH-CH_2-CH_3}$ est…", ["une amine secondaire", "une amine tertiaire", "une amine primaire"], 0, "N est lié à un méthyle, un éthyle et un hydrogène.", "Activité d'application 2 - c"),
      choice("Le composé $\\mathrm{CH_3-NH_2}$ est…", ["une amine primaire", "une amine secondaire", "une amine tertiaire"], 0, "Un seul groupe carboné est directement lié à N.", "Activité d'application 2 - d"),
      short("Combien de groupes carbonés sont directement liés à N dans une amine tertiaire ?", ["3", "trois"], "Une amine tertiaire a la forme $\\mathrm{R_1-N(R_2)-R_3}$.", "II.2 Les trois classes"),
      choice("Un azote lié à quatre groupes carbonés porte généralement…", ["une charge positive", "une charge négative", "deux hydrogènes", "un doublet non liant disponible"], 0, "La quatrième liaison transforme l'amine en ion ammonium quaternaire.", "Précision ajoutée"),
      choice("Dans $\\mathrm{R-NH_2}$, la lettre R représente…", ["un groupe hydrocarboné", "un atome d'hydrogène", "un ion hydroxyde", "un électron"], 0, "R désigne ici un groupe alkyle ou aryle.", "II.1 Définition"),
      choice("Pour déterminer la classe d'une amine, il faut compter…", ["les groupes carbonés liés directement à N", "tous les carbones de la molécule", "les hydrogènes de toute la chaîne", "les doubles liaisons"], 0, "La classe est une propriété de l'environnement immédiat de l'azote.", "II.2 Les trois classes", 2),
      short("Donne la classe de $\\mathrm{C_2H_5-NH-C_2H_5}$.", ["secondaire", "amine secondaire", "une amine secondaire"], "Les deux groupes éthyle sont directement liés à l'azote.", "II.2 Les trois classes", 2),
    ],
  },
  {
    id: "amine-nomenclature-isomers",
    title: "Nommer les amines et retrouver tous les isomères",
    summary: "Appliquer les deux nomenclatures du cours, choisir la chaîne principale et dresser sans oubli les huit amines de formule C4H11N.",
    pages: "2, 4-5",
    section: "II.3 Nomenclature - exercices 1 et 2",
    durationMinutes: 30,
    xp: 55,
    body: String.raw`## 1. Nomenclature substitutive

La méthode moderne consiste à choisir la plus longue chaîne carbonée liée à l'azote, puis à remplacer le **e** final de l'alcane par **amine**. La position du groupe amine reçoit l'indice le plus petit possible.

- $\mathrm{CH_3-NH_2}$ : **méthanamine** ;
- $\mathrm{CH_3-CH_2-CH_2-NH_2}$ : **propan-1-amine** ;
- $\mathrm{CH_3-CH(NH_2)-CH_3}$ : **propan-2-amine**.

> **Correction de la règle du PDF.** Le carbone lié à N n'est pas toujours le carbone 1 : dans le propan-2-amine, le groupe $\mathrm{NH_2}$ est porté par le carbone 2. Il faut numéroter la chaîne pour donner à la fonction amine le plus petit indice.

Pour une amine secondaire ou tertiaire, la plus longue chaîne devient le nom principal. Les autres groupes attachés à N sont précédés de **N-** :

- $\mathrm{C_2H_5-NH-CH_3}$ : **N-méthyléthanamine** ;
- $\mathrm{CH_3-N(CH_3)-C_2H_5}$ : **N,N-diméthyléthanamine** ;
- $\mathrm{C_2H_5-N(C_2H_5)-C_2H_5}$ : **N,N-diéthyléthanamine**, aussi appelée **triéthylamine**.

## 2. Noms de type alkylamine

Le document présente aussi la nomenclature fonctionnelle : **méthylamine**, **éthylamine**, **diméthylamine**, **méthyléthylamine**, **triéthylamine**. Ces noms usuels restent utiles, mais la nomenclature substitutive est plus précise pour les chaînes ramifiées.

## 3. Exercice 1

| Formule ou nom donné | Réponse fidèle et précisée |
|---|---|
| $\mathrm{CH_3-N(CH_3)-C_2H_5}$ | N,N-diméthyléthanamine |
| $\mathrm{CH_3-NH-CH_2-CH_2-CH_3}$ | N-méthylpropan-1-amine |
| N-éthyl-N-méthylpropan-1-amine | $\mathrm{CH_3CH_2-N(CH_3)-CH_2CH_2CH_3}$ |
| N-méthyléthanamine | $\mathrm{CH_3-NH-CH_2CH_3}$ |

## 4. Exercice 2 : les isomères de C4H11N

Le document demande toutes les formules semi-développées. Il en existe **huit**, réparties en trois classes.

### Quatre amines primaires

1. $\mathrm{CH_3CH_2CH_2CH_2NH_2}$ : **butan-1-amine** ;
2. $\mathrm{CH_3CH(NH_2)CH_2CH_3}$ : **butan-2-amine** ;
3. $\mathrm{(CH_3)_2CHCH_2NH_2}$ : **2-méthylpropan-1-amine** ;
4. $\mathrm{(CH_3)_3CNH_2}$ : **2-méthylpropan-2-amine**.

### Trois amines secondaires

5. $\mathrm{C_2H_5-NH-C_2H_5}$ : **diéthylamine** ;
6. $\mathrm{CH_3-NH-CH_2CH_2CH_3}$ : **N-méthylpropan-1-amine** ;
7. $\mathrm{CH_3-NH-CH(CH_3)_2}$ : **N-méthylpropan-2-amine**.

### Une amine tertiaire

8. $\mathrm{C_2H_5-N(CH_3)_2}$ : **N,N-diméthyléthanamine**.

> **Coquille majeure du document.** La liste source ne contient que sept isomères : elle oublie $\mathrm{CH_3-NH-CH(CH_3)_2}$, la N-méthylpropan-2-amine. La liste complète comporte donc **4 primaires, 3 secondaires et 1 tertiaire**.

> **Astuce mémoire de Davy.** Répartis d'abord les quatre carbones entre les groupes liés à N : $4$ pour une primaire ; $1+3$ ou $2+2$ pour une secondaire ; $1+1+2$ pour une tertiaire. Ensuite seulement, cherche les ramifications internes.` ,
    keyPoint: "Pour C4H11N : 8 isomères = 4 amines primaires + 3 secondaires + 1 tertiaire.",
    example: "$\\mathrm{CH_3-NH-CH(CH_3)_2}$ est la N-méthylpropan-2-amine, l'isomère secondaire oublié par le corrigé source.",
    methodSteps: [
      "Choisis la plus longue chaîne carbonée liée à l'azote comme chaîne principale.",
      "Donne au groupe amine l'indice le plus petit possible.",
      "Place devant le nom les groupes portés par N avec les préfixes N- ou N,N-.",
      "Pour une formule brute, répartis les carbones entre un, deux ou trois groupes liés à N.",
      "Élimine les doublons obtenus par symétrie, puis vérifie le nombre total de carbones et d'hydrogènes.",
    ],
    corrections: [
      "Page 2 : la règle « le carbone lié à l'azote porte le numéro 1 » est fausse dans le cas général. Le groupe amine doit recevoir le plus petit indice possible ; il est en position 2 dans le propan-2-amine.",
      "Pages 4-5, exercice 2 : le corrigé ne donne que sept isomères de C4H11N et omet la N-méthylpropan-2-amine, CH3-NH-CH(CH3)2. Il existe huit isomères constitutionnels : quatre primaires, trois secondaires et un tertiaire.",
      "Page 5 : les noms « méthylpropanamine », « 2-méthylpropanime » et « 1,1-diméthyléthylamine » sont ambigus, fautif ou ancien. Ils sont précisés en butan-2-amine, 2-méthylpropan-1-amine et 2-méthylpropan-2-amine.",
    ],
    interaction: diagram(
      [
        { id: "p1", group: "Primaires", label: "Butan-1-amine", role: "chaîne droite - NH₂ en 1", detail: "CH₃CH₂CH₂CH₂NH₂. Quatre carbones dans une seule chaîne, fonction en bout de chaîne." },
        { id: "p2", group: "Primaires", label: "Butan-2-amine", role: "chaîne droite - NH₂ en 2", detail: "CH₃CH(NH₂)CH₂CH₃. Le groupe amine reçoit l'indice 2, ce qui réfute la règle trop générale du carbone 1." },
        { id: "p3", group: "Primaires", label: "2-méthylpropan-1-amine", role: "chaîne ramifiée - NH₂ en 1", detail: "(CH₃)₂CHCH₂NH₂. Le carbone fonctionnel est terminal, la ramification méthyle est en 2." },
        { id: "p4", group: "Primaires", label: "2-méthylpropan-2-amine", role: "tert-butylamine", detail: "(CH₃)₃CNH₂. La molécule reste une amine primaire : N n'est lié qu'à un seul groupe carboné." },
        { id: "s1", group: "Secondaires", label: "Diéthylamine", role: "répartition 2 + 2", detail: "C₂H₅-NH-C₂H₅. Deux groupes éthyle identiques entourent N." },
        { id: "s2", group: "Secondaires", label: "N-méthylpropan-1-amine", role: "répartition 1 + 3 droite", detail: "CH₃-NH-CH₂CH₂CH₃. La chaîne principale est le propane." },
        { id: "s3", group: "Secondaires", label: "N-méthylpropan-2-amine", role: "répartition 1 + 3 ramifiée", detail: "CH₃-NH-CH(CH₃)₂. C'est l'isomère oublié dans la source." },
        { id: "t1", group: "Tertiaires", label: "N,N-diméthyléthanamine", role: "répartition 1 + 1 + 2", detail: "C₂H₅-N(CH₃)₂. C'est la seule répartition de quatre carbones entre trois groupes non vides." },
      ],
      "C4H11N",
      "Huit structures différentes partagent cette formule brute.",
      "Explore les trois classes et vérifie la répartition des quatre carbones autour de N.",
      "Une formule brute ne détermine ni la classe ni la structure : l'isomérie doit être traitée méthodiquement.",
    ),
    questions: [
      short("Nomme $\\mathrm{CH_3-N(CH_3)-C_2H_5}$.", ["N,N-diméthyléthanamine", "n,n-dimethylethanamine", "N,N-dimethylethanamine"], "La chaîne principale est l'éthane et les deux méthyles sont portés par N.", "Exercice 1 A-a", 2),
      short("Nomme $\\mathrm{CH_3-NH-CH_2-CH_2-CH_3}$.", ["N-méthylpropan-1-amine", "n-methylpropan-1-amine", "N-methylpropan-1-amine", "N-méthylpropanamine"], "La chaîne principale compte trois carbones et le méthyle supplémentaire est porté par N.", "Exercice 1 A-b", 2),
      choice("Quelle formule correspond à la N-méthyléthanamine ?", ["$\\mathrm{CH_3-NH-CH_2CH_3}$", "$\\mathrm{CH_3-N(CH_3)-CH_2CH_3}$", "$\\mathrm{CH_3CH_2NH_2}$"], 0, "Un méthyle est porté par N et l'éthanamine fournit la chaîne principale.", "Exercice 1 B-b"),
      choice("Quelle formule correspond à la N-éthyl-N-méthylpropan-1-amine ?", ["$\\mathrm{CH_3CH_2-N(CH_3)-CH_2CH_2CH_3}$", "$\\mathrm{CH_3-NH-CH_2CH_2CH_3}$", "$\\mathrm{(CH_3)_3CNH_2}$"], 0, "N porte le propyle principal, un éthyle et un méthyle.", "Exercice 1 B-a", 2),
      short("Combien d'isomères constitutionnels amines possède $\\mathrm{C_4H_{11}N}$ ?", ["8", "huit"], "Il y a quatre primaires, trois secondaires et une tertiaire.", "Exercice 2 corrigé", 3),
      short("Combien de ces isomères sont des amines primaires ?", ["4", "quatre"], "Butan-1-amine, butan-2-amine, 2-méthylpropan-1-amine et 2-méthylpropan-2-amine.", "Exercice 2", 2),
      short("Combien de ces isomères sont des amines secondaires ?", ["3", "trois"], "Diéthylamine et les deux N-méthylpropanamines.", "Exercice 2 corrigé", 2),
      short("Combien de ces isomères sont des amines tertiaires ?", ["1", "une", "un"], "Seule la répartition 2 + 1 + 1 est possible.", "Exercice 2"),
      choice("Quel isomère manque dans le corrigé du document ?", ["la N-méthylpropan-2-amine", "la diéthylamine", "la butan-1-amine", "la N,N-diméthyléthanamine"], 0, "La structure $\\mathrm{CH_3-NH-CH(CH_3)_2}$ n'apparaît pas dans la liste source.", "Exercice 2 - correction documentée", 3),
      choice("Le nom correct de $\\mathrm{CH_3CH(NH_2)CH_2CH_3}$ est…", ["butan-2-amine", "butan-1-amine", "2-méthylpropan-1-amine", "N-méthylpropanamine"], 0, "La plus longue chaîne compte quatre carbones et la fonction est en 2.", "Exercice 2 - b", 2),
      choice("Le nom correct de $\\mathrm{(CH_3)_3CNH_2}$ est…", ["2-méthylpropan-2-amine", "2-méthylpropan-1-amine", "butan-2-amine", "N,N-diméthyléthanamine"], 0, "La chaîne principale est le propane ; le groupe amine et le méthyle sont tous deux en 2.", "Exercice 2 - d", 2),
      choice("Quelle amine correspond à une répartition 2 + 2 des carbones autour de N ?", ["la diéthylamine", "la N-méthylpropan-1-amine", "la N,N-diméthyléthanamine"], 0, "Deux groupes éthyle donnent $\\mathrm{C_2H_5-NH-C_2H_5}$.", "Exercice 2 - e"),
      choice("La 2-méthylpropan-2-amine est classée primaire parce que…", ["N n'est lié qu'à un seul groupe carboné", "son carbone fonctionnel est tertiaire", "elle contient quatre carbones", "elle possède trois groupes méthyle"], 0, "La classe de l'amine se lit autour de N, pas autour du carbone porteur.", "Exercice 2 - d", 3),
      short("Donne le nom usuel de $\\mathrm{C_2H_5-NH-C_2H_5}$.", ["diéthylamine", "diethylamine"], "Deux groupes éthyle identiques sont liés à N.", "Exercice 2 - e"),
      choice("Dans le nom N,N-diméthyléthanamine, N,N indique que…", ["les deux méthyles sont liés à l'azote", "les deux méthyles sont liés au carbone 1", "la molécule contient deux atomes d'azote"], 0, "Les locants N désignent des substituants portés par l'azote.", "II.3 Nomenclature"),
      short("Nomme $\\mathrm{CH_3-NH-CH(CH_3)_2}$.", ["N-méthylpropan-2-amine", "n-methylpropan-2-amine", "N-methylpropan-2-amine"], "La chaîne principale est le propan-2-amine et le méthyle supplémentaire est sur N.", "Exercice 2 - isomère ajouté", 3),
    ],
  },
  {
    id: "amine-basicity",
    title: "Expliquer le caractère basique des amines",
    summary: "Relier le doublet non liant de l'azote à la capture d'un proton et écrire l'équilibre d'une amine avec l'eau.",
    pages: "2-3",
    section: "II.4.1 Caractère basique - activité 3",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## 1. Pourquoi une amine est-elle basique ?

Dans une amine, l'atome d'azote possède un **doublet non liant**. Ce doublet peut former une nouvelle liaison avec un proton $\mathrm{H^+}$ : l'amine est donc une **base de Brønsted**, c'est-à-dire une espèce capable de capter un proton.

Pour une amine primaire $\mathrm{R-NH_2}$ dans l'eau :

$$\mathrm{R-NH_2 + H_2O \rightleftharpoons R-NH_3^+ + OH^-}$$

Les couples acide-base sont :

$$\mathrm{R-NH_3^+/R-NH_2} \qquad \text{et} \qquad \mathrm{H_2O/OH^-}$$

L'apparition de l'ion hydroxyde $\mathrm{OH^-}$ explique que la solution soit basique : son pH est supérieur à 7 à température ordinaire.

## 2. Une base faible

La double flèche $
ightleftharpoons$ indique que la réaction avec l'eau est **limitée**. Toutes les molécules d'amine ne captent pas un proton : l'amine est une **base faible**.

Il ne faut donc pas remplacer systématiquement sa concentration par $[mathrm{OH^-}]$. Cette approximation ne serait valable que pour une base forte totalement dissociée.

## 3. Activité d'application 3

Pour la méthylamine :

$$\mathrm{CH_3-NH_2 + H_2O \rightleftharpoons CH_3-NH_3^+ + OH^-}$$

Lecture de l'équation :

1. la méthylamine utilise son doublet pour capter un proton de l'eau ;
2. elle devient l'ion **méthylammonium** $\mathrm{CH_3NH_3^+}$ ;
3. l'eau, après avoir perdu ce proton, devient $\mathrm{OH^-}$ ;
4. atomes et charges sont conservés.

Pour une amine secondaire $\mathrm{R_1-NH-R_2}$ :

$$\mathrm{R_1R_2NH + H_2O \rightleftharpoons R_1R_2NH_2^+ + OH^-}$$

Pour une amine tertiaire $\mathrm{R_1R_2R_3N}$ :

$$\mathrm{R_1R_2R_3N + H_2O \rightleftharpoons R_1R_2R_3NH^+ + OH^-}$$

> **Astuce mémoire de Davy.** Une base « prend H+ ». Regarde N avant et après : il gagne un hydrogène et une charge positive. L'eau perd ce même hydrogène et devient $\mathrm{OH^-}$.` ,
    keyPoint: "Le doublet de N capte H+ : RNH2 + H2O ⇌ RNH3+ + OH-. L'amine est une base faible.",
    example: "$\\mathrm{CH_3NH_2 + H_2O \\rightleftharpoons CH_3NH_3^+ + OH^-}$.",
    methodSteps: [
      "Repère le doublet non liant de l'azote : c'est le site qui capte le proton.",
      "Ajoute un hydrogène à l'azote et une charge positive sur l'ion obtenu.",
      "Transforme l'eau qui a cédé H+ en ion hydroxyde OH-.",
      "Utilise une double flèche, car l'amine est une base faible.",
      "Vérifie la conservation des atomes et de la charge totale.",
    ],
    interaction: diagram(
      [
        { id: "amine", group: "Réactifs", label: "Amine R-NH₂", role: "base - capte H⁺", detail: "Le doublet non liant de N accepte un proton. L'amine joue le rôle de base de Brønsted." },
        { id: "water", group: "Réactifs", label: "Eau H₂O", role: "acide - cède H⁺", detail: "Dans cet équilibre, l'eau cède un proton à l'amine et devient l'ion hydroxyde." },
        { id: "ammonium", group: "Produits", label: "Ion R-NH₃⁺", role: "acide conjugué", detail: "L'azote a gagné H⁺ : il porte désormais quatre liaisons et une charge positive." },
        { id: "hydroxide", group: "Produits", label: "Ion OH⁻", role: "base conjuguée", detail: "Sa présence rend la solution basique. La double flèche rappelle que sa formation est partielle." },
      ],
      "Transfert de proton",
      "R-NH₂ + H₂O ⇌ R-NH₃⁺ + OH⁻",
      "Sélectionne les quatre espèces et suis le proton de l'eau vers l'azote.",
      "Le même doublet qui explique la basicité expliquera aussi la nucléophilie au niveau suivant.",
    ),
    questions: [
      choice("Le caractère basique des amines est dû principalement…", ["au doublet non liant de l'azote", "aux liaisons C-H", "à la masse molaire", "aux ions chlorure"], 0, "Le doublet de N peut capter un proton.", "II.4.1 Caractère basique"),
      choice("Au sens de Brønsted, une base est une espèce capable de…", ["capter un proton", "céder un proton", "capter un électron", "libérer du dioxygène"], 0, "L'amine accepte H+ grâce au doublet de N.", "II.4.1"),
      choice("Quel ion se forme quand la méthylamine capte un proton ?", ["$\\mathrm{CH_3NH_3^+}$", "$\\mathrm{CH_3NH^-}$", "$\\mathrm{NH_4^-}$", "$\\mathrm{CH_3^+}$"], 0, "L'ion méthylammonium est l'acide conjugué de la méthylamine.", "Activité 3"),
      choice("Quel ion formé explique le caractère basique de la solution ?", ["$\\mathrm{OH^-}$", "$\\mathrm{H_3O^+}$", "$\\mathrm{Cl^-}$", "$\\mathrm{Na^+}$"], 0, "L'eau qui perd H+ devient OH-.", "II.4.1"),
      choice("Pourquoi utilise-t-on une double flèche ?", ["la réaction avec l'eau est limitée", "la réaction est explosive", "l'amine est un acide fort", "l'eau est absente"], 0, "Une amine est une base faible : toutes les molécules ne réagissent pas.", "II.4.1"),
      short("Écris la formule de l'acide conjugué de l'éthylamine $\\mathrm{C_2H_5NH_2}$.", ["C2H5NH3+", "C₂H₅NH₃⁺", "C2H5-NH3+"], "L'azote gagne un proton : $\\mathrm{C_2H_5NH_3^+}$.", "Application de l'activité 3", 2),
      choice("Dans l'équilibre avec l'eau, l'amine joue le rôle…", ["de base", "d'acide", "d'oxydant", "de catalyseur"], 0, "Elle capte un proton.", "II.4.1"),
      choice("L'ion $\\mathrm{RNH_3^+}$ est…", ["l'acide conjugué de l'amine", "la base conjuguée de l'amine", "un radical", "un ion hydroxyde"], 0, "Il peut redonner H+ à la base conjuguée.", "II.4.1"),
      choice("Pour une amine tertiaire $\\mathrm{R_3N}$, le produit protoné est…", ["$\\mathrm{R_3NH^+}$", "$\\mathrm{R_3N^-}$", "$\\mathrm{R_3NH_2^+}$", "$\\mathrm{R_4N^+}$"], 0, "La protonation ajoute un seul H+ sans ajouter de groupe carboné.", "Extension du cours", 2),
      short("Quel est le pH qualitatif attendu pour une solution aqueuse d'amine : inférieur, égal ou supérieur à 7 ?", ["supérieur à 7", "superieur a 7", ">7", "pH>7"], "La réaction avec l'eau produit des ions OH-.", "Conséquence du caractère basique", 2),
    ],
  },
  {
    id: "amine-nucleophilicity-alkylation",
    title: "Comprendre la nucléophilie et l'alkylation",
    summary: "Suivre l'attaque du doublet de l'azote sur un halogénoalcane et prévoir les alkylations successives jusqu'à l'ammonium quaternaire.",
    pages: "3",
    section: "II.4.2 Caractère nucléophile - réaction de Hofmann - activité 4",
    durationMinutes: 27,
    xp: 65,
    body: String.raw`## 1. Le même doublet, une deuxième propriété

Le doublet non liant de l'azote explique aussi le caractère **nucléophile** d'une amine. Un nucléophile est une espèce riche en électrons capable de former une liaison avec un centre pauvre en électrons.

Dans un halogénoalcane $\mathrm{R-X}$ avec $\mathrm{X=Cl,Br,I}$ :

- le carbone lié à X est le centre **électrophile** ;
- l'azote de l'amine est le centre **nucléophile** ;
- la liaison C-X se rompt et l'ion halogénure $\mathrm{X^-}$ part.

Cette alkylation est appelée **réaction de Hofmann** dans le programme scolaire.

## 2. Le bilan ionique exact

La première attaque d'une amine primaire sur un halogénoalcane forme d'abord un ion alkylammonium :

$$\mathrm{RNH_2 + R'X \longrightarrow [RR'NH_2]^+X^-}$$

En présence d'une base, souvent une autre molécule d'amine, cet ion perd un proton et donne l'amine secondaire :

$$\mathrm{[RR'NH_2]^+ + B \longrightarrow RR'NH + BH^+}$$

Le document écrit directement $\mathrm{amine + R'X \to amine' + HX}$. C'est le **bilan scolaire simplifié**, où $\mathrm{amine'}$ désigne l'amine plus alkylée. Il faut retenir que le sel d'ammonium est l'intermédiaire réel et qu'une base permet la déprotonation.

## 3. Alkylations successives de la méthylamine

Avec le chlorométhane, le document suit trois substitutions :

### Première alkylation

$$\mathrm{CH_3NH_2 + CH_3Cl \longrightarrow [(CH_3)_2NH_2]^+Cl^-}$$

Après déprotonation : **diméthylamine** $\mathrm{(CH_3)_2NH}$.

### Deuxième alkylation

$$\mathrm{(CH_3)_2NH + CH_3Cl \longrightarrow [(CH_3)_3NH]^+Cl^-}$$

Après déprotonation : **triméthylamine** $\mathrm{(CH_3)_3N}$.

### Troisième alkylation : quaternisation

$$\mathrm{(CH_3)_3N + CH_3Cl \longrightarrow (CH_3)_4N^+Cl^-}$$

Ici, l'azote ne porte plus d'hydrogène : aucune déprotonation n'est possible. Le produit final est le **chlorure de tétraméthylammonium**.

## 4. Exemple du document : triéthylamine et iodoéthane

$$\mathrm{(C_2H_5)_3N + C_2H_5I \longrightarrow (C_2H_5)_4N^+I^-}$$

La triéthylamine, tertiaire, reçoit un quatrième groupe éthyle et donne l'iodure de tétraéthylammonium.

> **Astuce mémoire de Davy.** À chaque alkylation, N gagne **un groupe carboné**. Primaire → secondaire → tertiaire → ammonium quaternaire. À la dernière étape, la charge positive devient définitive.` ,
    keyPoint: "Le doublet de N attaque le carbone de R-X ; chaque alkylation ajoute un groupe carboné, jusqu'à R4N+X-.",
    example: "$\\mathrm{(C_2H_5)_3N+C_2H_5I\\longrightarrow(C_2H_5)_4N^+I^-}$.",
    methodSteps: [
      "Repère N, nucléophile grâce à son doublet, et le carbone lié à X, électrophile.",
      "Fais former la nouvelle liaison N-C pendant que X quitte la molécule sous forme X-.",
      "Compte les groupes carbonés autour de N après la réaction.",
      "S'il reste un hydrogène sur N, distingue l'ion alkylammonium initial de l'amine neutre obtenue après déprotonation.",
      "Si N porte quatre groupes carbonés, écris la charge positive et l'ion halogénure associé.",
    ],
    corrections: [
      "Page 3 : les deux premières alkylations sont écrites directement sous la forme amine plus halogénoalcane donnant amine plus alkylée plus HX. Le mécanisme forme d'abord un sel d'alkylammonium ; une base, souvent une autre molécule d'amine, assure ensuite la déprotonation. Le bilan scolaire source est conservé mais cette étape est explicitée.",
      "Page 3 : le produit final de la troisième alkylation est un ion ammonium quaternaire associé à Cl-, et non une amine tertiaire supplémentaire.",
      "Page 3 : l'exemple nommé « N,N-diéthyléthylamine » est plus clairement désigné par triéthylamine ou N,N-diéthyléthanamine.",
    ],
    interaction: timeline(
      [
        { label: "Méthylamine", shortLabel: "1 groupe", detail: "CH₃NH₂ : amine primaire, N porte un méthyle et deux hydrogènes." },
        { label: "Diméthylamine", shortLabel: "2 groupes", detail: "Après une alkylation et déprotonation : (CH₃)₂NH, amine secondaire." },
        { label: "Triméthylamine", shortLabel: "3 groupes", detail: "Après la deuxième alkylation et déprotonation : (CH₃)₃N, amine tertiaire." },
        { label: "Tétraméthylammonium", shortLabel: "4 groupes", detail: "Après la troisième alkylation : (CH₃)₄N⁺Cl⁻. Plus aucun H sur N, donc le sel quaternaire est le produit final." },
      ],
      "L'alkylation pas à pas",
      "Chaque étape ajoute exactement un groupe méthyle autour de l'azote.",
      "Parcours les quatre états et observe le passage des trois classes d'amine à l'ammonium quaternaire.",
      "La charge positive apparaît dès l'attaque ; elle disparaît après déprotonation seulement tant qu'un hydrogène reste sur N.",
    ),
    questions: [
      choice("Dans une amine, le centre nucléophile est…", ["l'atome d'azote", "l'atome d'hydrogène", "le groupe alkyle", "l'ion halogénure"], 0, "Le doublet non liant de N fournit les électrons de la nouvelle liaison.", "II.4.2"),
      choice("Dans un halogénoalcane $\\mathrm{R-X}$, le centre électrophile est…", ["le carbone lié à X", "l'halogène X", "l'atome d'azote", "un ion hydroxyde"], 0, "La liaison C-X est polarisée vers l'halogène.", "II.4.2"),
      choice("Quel groupe part pendant l'attaque nucléophile ?", ["$\\mathrm{X^-}$", "$\\mathrm{H^+}$", "$\\mathrm{OH^-}$", "$\\mathrm{NH_2^-}$"], 0, "L'halogène emporte le doublet de la liaison C-X.", "II.4.2"),
      choice("Après une alkylation suivie de déprotonation, une amine primaire devient…", ["une amine secondaire", "une amine tertiaire", "un alcool", "un acide"], 0, "N gagne un deuxième groupe carboné.", "Activité 4 - première étape"),
      choice("La deuxième alkylation de la diméthylamine conduit, après déprotonation, à…", ["la triméthylamine", "la méthylamine", "la tétraméthylamine", "l'ammoniac"], 0, "Le troisième méthyle donne l'amine tertiaire $\\mathrm{(CH_3)_3N}$.", "Activité 4 - deuxième étape"),
      choice("Le produit final de $\\mathrm{(CH_3)_3N+CH_3Cl}$ est…", ["le chlorure de tétraméthylammonium", "la diméthylamine", "la méthylamine", "le chlorure d'ammonium"], 0, "N porte alors quatre méthyles et une charge positive.", "Activité 4 - troisième étape", 2),
      choice("Quelle équation décrit la quaternisation de la triéthylamine ?", ["$\\mathrm{(C_2H_5)_3N+C_2H_5I\\to(C_2H_5)_4N^+I^-}$", "$\\mathrm{C_2H_5NH_2+H_2O\\to C_2H_5OH+NH_3}$", "$\\mathrm{(C_2H_5)_3N\\to NH_3+C_2H_4}$"], 0, "Un quatrième groupe éthyle est ajouté à l'azote.", "Exemple de Hofmann", 2),
      short("Combien de groupes carbonés entourent N dans un ammonium quaternaire ?", ["4", "quatre"], "L'azote porte quatre liaisons C-N et une charge positive.", "II.4.2"),
      choice("Pourquoi l'ion ammonium quaternaire ne peut-il plus être déprotoné sur N ?", ["N ne porte plus d'hydrogène", "N ne porte plus de carbone", "l'halogène a disparu", "la molécule est acide forte"], 0, "Les quatre liaisons de N sont des liaisons N-C.", "Précision ajoutée", 2),
      choice("Le document appelle cette alkylation…", ["réaction de Hofmann", "réaction de Fehling", "estérification", "saponification"], 0, "C'est le nom retenu dans le programme pour l'alkylation successive des amines.", "II.4.2"),
      choice("Le bilan direct amine + R-X → amine plus alkylée + HX est…", ["un bilan scolaire simplifié", "le mécanisme élémentaire exact", "une réaction acido-basique impossible", "une combustion"], 0, "Le sel d'alkylammonium apparaît avant la déprotonation.", "Correction documentée", 3),
      short("Donne la formule de l'ion tétraméthylammonium.", ["(CH3)4N+", "(CH₃)₄N⁺", "N(CH3)4+"], "Quatre groupes méthyle sont liés à l'azote positif.", "Activité 4", 2),
      choice("À chaque alkylation, l'azote gagne…", ["un groupe carboné", "un atome d'oxygène", "deux protons", "un ion hydroxyde"], 0, "Le groupe R' du halogénoalcane se fixe sur N.", "II.4.2"),
      choice("L'amine tertiaire possède-t-elle encore un doublet disponible ?", ["oui, avant sa quaternisation", "non, jamais", "seulement en milieu acide", "uniquement si elle porte un hydrogène"], 0, "Une amine tertiaire est nucléophile ; son doublet forme la quatrième liaison lors de la quaternisation.", "II.4.2", 2),
    ],
  },
  {
    id: "amine-formula-mass-percentage",
    title: "Déterminer une amine par sa composition massique",
    summary: "Transformer un pourcentage massique d'azote en masse molaire, retrouver n puis choisir l'isomère compatible avec la classe ou la ramification.",
    pages: "3-6",
    section: "Situation d'évaluation et exercice 3",
    durationMinutes: 24,
    xp: 75,
    body: String.raw`## 1. Formule et masse molaire

Pour une monoamine saturée acyclique à $n$ atomes de carbone :

$$\mathrm{C_nH_{2n+3}N}$$

Sa masse molaire vaut :

$$M=12n+(2n+3)+14=\boxed{14n+17}$$

Comme la molécule ne contient qu'un atome d'azote, la fraction massique d'azote est :

$$\%N=\frac{14}{M}\times100=\frac{1400}{14n+17}$$

On peut donc remonter directement au nombre de carbones :

$$M=\frac{1400}{\%N} \qquad \text{puis} \qquad n=\frac{M-17}{14}$$

## 2. Situation d'évaluation : 23,7 % d'azote

Le document cherche une amine primaire saturée B contenant $23{,}7\ \%$ d'azote.

$$M_B=\frac{1400}{23{,}7}\approx59{,}07\ \mathrm{g\,mol^{-1}}$$

Puis :

$$n=\frac{59{,}07-17}{14}\approx3$$

La formule brute est donc :

$$\boxed{\mathrm{C_3H_9N}}$$

Comme B est **primaire**, seules deux structures conviennent :

| Formule semi-développée | Nom |
|---|---|
| $\mathrm{CH_3-CH_2-CH_2-NH_2}$ | propan-1-amine, ou propylamine |
| $\mathrm{CH_3-CH(NH_2)-CH_3}$ | propan-2-amine, ou isopropylamine |

La chaîne demandée est **ramifiée autour du carbone porteur** dans la présentation source : le composé identifié est le **propan-2-amine**.

## 3. Exercice 3

L'exercice 3 reprend exactement la même donnée $23{,}7\ \%$ et la même méthode. Il confirme :

$$y=2x+3,\qquad M\approx59{,}07\ \mathrm{g\,mol^{-1}},\qquad \mathrm{C_3H_9N}$$

Puis les deux amines primaires précédentes.

> **Pourquoi le résultat n'est-il pas exactement entier ?** Le pourcentage $23{,}7\ \%$ est arrondi. On trouve $n\approx3{,}005$ avec les valeurs affichées ; le seul entier chimiquement cohérent est $n=3$.

> **Astuce mémoire de Davy.** Pour une monoamine de cette famille, le numérateur de $\%N$ est toujours **1400**. Calcule d'abord $M=1400/\%N$, puis retire 17 et divise par 14.` ,
    keyPoint: "%N = 1400/(14n+17). Avec 23,7 %, M ≈ 59,07 g·mol-1, n = 3 et la formule est C3H9N.",
    example: "$M=1400/23{,}7\\approx59{,}07$, puis $n=(59{,}07-17)/14\\approx3$.",
    methodSteps: [
      "Écris la formule CnH2n+3N et calcule sa masse molaire M = 14n + 17.",
      "Utilise le seul atome d'azote : %N = 1400/M.",
      "Calcule M = 1400/%N, puis n = (M - 17)/14.",
      "Arrondis n au seul entier chimiquement cohérent, car les pourcentages expérimentaux sont arrondis.",
      "Dresse les isomères puis utilise la classe ou la forme de chaîne pour choisir le composé.",
    ],
    corrections: [
      "Pages 3-4 et 5-6 : la situation d'évaluation et l'exercice 3 utilisent la même donnée 23,7 % et conduisent au même calcul. Le doublon est conservé comme entraînement, mais signalé.",
      "Pages 4 et 6 : « 1-méthyléthylamine » et « méthyléthylamine » sont remplacés par le nom non ambigu propan-2-amine, avec le nom usuel isopropylamine.",
      "Page 5 : la numérotation du corrigé écrit d'abord « 1. y = 2x + 3 », puis laisse « 1.1 » sans réponse. Les étapes sont remises dans l'ordre formule générale, masse molaire, formule brute, isomères.",
    ],
    interaction: timeline(
      [
        { label: "Écrire la famille", shortLabel: "Formule", detail: "Monoamine saturée acyclique : CnH2n+3N ; masse molaire M = 14n + 17." },
        { label: "Exploiter l'azote", shortLabel: "%N", detail: "Un seul N apporte 14 g par mole : %N = 14/M × 100, donc M = 1400/%N." },
        { label: "Trouver n", shortLabel: "n", detail: "n = (M - 17)/14. Avec 23,7 %, M ≈ 59,07 et n ≈ 3." },
        { label: "Écrire la formule brute", shortLabel: "C₃H₉N", detail: "Pour n = 3 : H = 2n + 3 = 9, d'où C₃H₉N." },
        { label: "Choisir l'isomère", shortLabel: "Structure", detail: "La classe primaire conserve deux possibilités. L'information de forme de chaîne désigne le propan-2-amine." },
      ],
      "Du pourcentage à la structure",
      "Une donnée massique devient successivement une masse molaire, une formule brute puis une structure.",
      "Suis les cinq étapes sans commencer par deviner les isomères.",
      "Le calcul détermine la formule brute ; les informations chimiques de l'énoncé déterminent ensuite l'isomère.",
    ),
    questions: [
      short("Donne la masse molaire générale de $\\mathrm{C_nH_{2n+3}N}$ en fonction de n.", ["14n+17", "M=14n+17", "14 n + 17"], "$12n+(2n+3)+14=14n+17$.", "Situation d'évaluation - question 1", 2),
      choice("Pour une monoamine contenant un seul N, la relation correcte est…", ["$\\%N=1400/M$", "$\\%N=M/1400$", "$\\%N=14M$", "$\\%N=100M/14$"], 0, "$\\%N=(14/M)\\times100$.", "Situation d'évaluation - question 2"),
      short("Calcule M pour $\\%N=23{,}7$ (en g·mol-1, au dixième).", ["59,1", "59.1", "59,07", "59.07", "59"], "$M=1400/23{,}7\\approx59{,}07$ g·mol-1.", "Situation d'évaluation - question 2", 2),
      short("Déduis le nombre n d'atomes de carbone.", ["3", "trois"], "$n=(59{,}07-17)/14\\approx3$.", "Situation d'évaluation - question 2", 2),
      short("Donne la formule brute obtenue.", ["C3H9N", "C₃H₉N", "c3h9n"], "Avec n=3, $2n+3=9$.", "Exercice 3 - question 1.2", 2),
      short("Combien d'amines primaires de formule $\\mathrm{C_3H_9N}$ existe-t-il ?", ["2", "deux"], "Propan-1-amine et propan-2-amine.", "Situation d'évaluation - question 3"),
      choice("Quelle formule est celle du propan-1-amine ?", ["$\\mathrm{CH_3CH_2CH_2NH_2}$", "$\\mathrm{CH_3CH(NH_2)CH_3}$", "$\\mathrm{CH_3NHCH_2CH_3}$"], 0, "La fonction est en bout de chaîne.", "Situation d'évaluation - question 3.1"),
      choice("Quelle formule est celle du propan-2-amine ?", ["$\\mathrm{CH_3CH(NH_2)CH_3}$", "$\\mathrm{CH_3CH_2CH_2NH_2}$", "$\\mathrm{(CH_3)_3N}$"], 0, "Le groupe NH2 est porté par le carbone central.", "Situation d'évaluation - question 4"),
      choice("Pourquoi n vaut-il 3 malgré le résultat calculé proche de 3,005 ?", ["le pourcentage est arrondi et n doit être entier", "la masse de N vaut 15", "on ignore les hydrogènes", "la formule brute peut contenir un demi-carbone"], 0, "Le nombre d'atomes est entier ; l'écart vient de l'arrondi de 23,7 %.", "Précision de calcul", 2),
      choice("L'information « amine primaire » sert à…", ["écarter l'isomère secondaire N-méthyléthanamine", "calculer la masse de l'azote", "changer n de 3 à 4", "transformer N en O"], 0, "C3H9N possède aussi une amine secondaire ; la classe la retire des possibilités.", "Situation d'évaluation"),
      short("Donne le nom usuel du propan-2-amine.", ["isopropylamine", "isopropanamine"], "Le groupe isopropyle est lié à NH2.", "Situation d'évaluation - nom précisé"),
    ],
  },
  {
    id: "amine-hofmann-synthesis",
    title: "Préparer un ammonium quaternaire",
    summary: "Résoudre l'exercice 4 en remontant du produit cible vers la seule amine tertiaire compatible, puis écrire la quaternisation.",
    pages: "6",
    section: "Exercice 4 - iodure de tétraéthylammonium",
    durationMinutes: 22,
    xp: 80,
    kind: "practice",
    body: String.raw`## 1. Le problème posé

Le composé A possède la formule brute $\mathrm{C_6H_{15}N}$. Il réagit avec l'iodoéthane $\mathrm{C_2H_5I}$ pour préparer l'**iodure de tétraéthylammonium**.

Le nom du produit final fournit la clé : autour de N, il doit y avoir **quatre groupes éthyle**. L'iodoéthane n'en apporte qu'un. Le composé A doit donc déjà porter les trois autres.

$$\boxed{\mathrm{A=(C_2H_5)_3N}}$$

A est la **triéthylamine**, dont le nom substitutif est **N,N-diéthyléthanamine**. Elle est tertiaire, car N est directement lié à trois groupes carbonés.

## 2. La réaction

La triéthylamine attaque le carbone électrophile de l'iodoéthane :

$$\mathrm{(C_2H_5)_3N+C_2H_5I\longrightarrow(C_2H_5)_4N^+I^-}$$

Le produit B est l'**iodure de tétraéthylammonium**.

| Élément demandé | Réponse |
|---|---|
| fonction chimique de A | amine |
| nom de la réaction | alkylation d'une amine, dite réaction de Hofmann dans le cours |
| propriété mise en jeu | caractère nucléophile |
| formule de A | $\mathrm{(C_2H_5)_3N}$ |
| nom de A | triéthylamine ou N,N-diéthyléthanamine |
| classe de A | amine tertiaire |

## 3. Pourquoi la formule brute seule ne suffisait pas

La formule $\mathrm{C_6H_{15}N}$ possède plusieurs isomères. Ce n'est donc pas elle seule qui impose la triéthylamine. C'est la structure du **produit demandé** - quatre éthyles autour de N - qui rend le choix unique dans le contexte.

Vérification de la formule de la triéthylamine :

$$3\times\mathrm{C_2H_5}+\mathrm{N}=\mathrm{C_6H_{15}N}$$

Puis l'iodoéthane apporte $\mathrm{C_2H_5}$ et $\mathrm{I^-}$ :

$$\mathrm{C_6H_{15}N+C_2H_5I\longrightarrow C_8H_{20}N^+I^-}$$

> **Astuce mémoire de Davy.** Lis le nom du sel final à l'envers : « tétraéthyl » signifie quatre éthyles sur N ; l'iodoéthane en apporte un, donc l'amine de départ doit en porter trois.` ,
    keyPoint: "Produit tétraéthylammonium + réactif éthyle => A porte déjà 3 éthyles : A = (C2H5)3N.",
    example: "$\\mathrm{(C_2H_5)_3N+C_2H_5I\\to(C_2H_5)_4N^+I^-}$.",
    methodSteps: [
      "Lis les groupes carbonés annoncés dans le nom de l'ammonium final.",
      "Retire mentalement le groupe apporté par l'halogénoalcane.",
      "Écris l'amine tertiaire restante et vérifie sa formule brute.",
      "Identifie la fonction, la classe, la propriété nucléophile et le nom de la réaction.",
      "Écris le sel final avec la charge positive sur N et l'ion halogénure séparé.",
    ],
    corrections: [
      "Page 6 : la formule brute C6H15N n'identifie pas à elle seule la triéthylamine, car elle possède d'autres isomères. C'est l'objectif de former l'ion tétraéthylammonium avec un seul équivalent d'iodoéthane qui impose trois groupes éthyle dans A.",
      "Page 6 : la numérotation des questions passe de 3 à 5 dans l'énoncé puis revient à 4 dans le corrigé. La dernière consigne est simplement la question 4.",
      "Page 6 : le nom « réaction d'Hoffmann » est orthographié Hofmann dans le cours et distingué ici de l'élimination de Hofmann étudiée dans d'autres contextes.",
    ],
    interaction: diagram(
      [
        { id: "target", group: "Cible", label: "(C₂H₅)₄N⁺", role: "quatre groupes éthyle", detail: "Le nom tétraéthylammonium impose quatre groupes C₂H₅ autour de N." },
        { id: "reagent", group: "Apport", label: "C₂H₅I", role: "apporte un éthyle", detail: "L'iodoéthane fournit un groupe éthyle électrophile et laisse l'ion iodure." },
        { id: "amine", group: "Départ", label: "(C₂H₅)₃N", role: "les trois éthyles restants", detail: "La triéthylamine possède la formule C₆H₁₅N annoncée et un doublet nucléophile." },
        { id: "salt", group: "Produit", label: "(C₂H₅)₄N⁺I⁻", role: "iodure de tétraéthylammonium", detail: "Le quatrième groupe transforme l'amine tertiaire en ammonium quaternaire." },
      ],
      "Synthèse à rebours",
      "Déduire A à partir du sel final et du groupe apporté par le réactif.",
      "Sélectionne les cartes dans l'ordre cible, apport, départ, produit.",
      "Quand une formule brute autorise plusieurs isomères, l'identité du produit peut fournir l'information structurale manquante.",
    ),
    questions: [
      choice("La fonction chimique du composé A est…", ["amine", "alcool", "amide", "ester"], 0, "A contient l'azote trivalent de la triéthylamine.", "Exercice 4 - question 1.1"),
      choice("La réaction mise en jeu est…", ["une alkylation d'amine", "une estérification", "une oxydation", "une saponification"], 0, "L'iodoéthane ajoute un groupe éthyle sur N.", "Exercice 4 - question 1.2"),
      choice("La propriété de l'amine mise en jeu est…", ["sa nucléophilie", "son acidité forte", "son pouvoir oxydant", "sa combustion"], 0, "Le doublet de N attaque le carbone lié à I.", "Exercice 4 - question 1.3"),
      choice("Quelle est la formule de A ?", ["$\\mathrm{(C_2H_5)_3N}$", "$\\mathrm{C_2H_5NH_2}$", "$\\mathrm{(CH_3)_3N}$", "$\\mathrm{C_6H_5NH_2}$"], 0, "A doit déjà porter trois groupes éthyle.", "Exercice 4 - question 2", 2),
      short("Donne le nom usuel de A.", ["triéthylamine", "triethylamine"], "Trois groupes éthyle entourent N.", "Exercice 4 - question 2"),
      short("Donne le nom substitutif de A.", ["N,N-diéthyléthanamine", "n,n-diethylethanamine", "N,N-diethylethanamine"], "Une chaîne éthanamine et deux substituants éthyle sur N.", "Exercice 4 - question 2", 2),
      choice("Quelle est la classe de A ?", ["tertiaire", "secondaire", "primaire", "ammonium quaternaire"], 0, "N est directement lié à trois groupes éthyle.", "Exercice 4 - question 3"),
      choice("Quel est le produit de la réaction ?", ["$\\mathrm{(C_2H_5)_4N^+I^-}$", "$\\mathrm{(C_2H_5)_2NH_2^+I^-}$", "$\\mathrm{NH_4^+I^-}$"], 0, "Le quatrième éthyle donne l'iodure de tétraéthylammonium.", "Exercice 4 - question 4", 2),
      short("Combien d'atomes de carbone possède l'ion tétraéthylammonium ?", ["8", "huit"], "Quatre groupes éthyle contiennent chacun deux carbones.", "Vérification de l'exercice 4"),
      choice("Pourquoi la formule C6H15N ne suffit-elle pas, seule, à identifier A ?", ["elle possède plusieurs isomères", "elle ne contient pas d'azote", "sa masse molaire est inconnue", "elle décrit un alcool"], 0, "Le produit cible fournit l'information structurale supplémentaire.", "Correction documentée", 3),
    ],
  },
  {
    id: "amine-identification-mission",
    title: "Mission finale : identifier puis transformer une amine",
    summary: "Résoudre intégralement l'exercice 5, de la composition massique aux propriétés basique et nucléophile, puis relier les amines à leurs usages.",
    pages: "6-8",
    section: "Exercice 5 et IV. Documents",
    durationMinutes: 28,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Mission

Une amine secondaire saturée contient $61{,}02\ \%$ de carbone et $15{,}25\ \%$ d'hydrogène. On dispose d'eau et d'iodoéthane $\mathrm{C_2H_5I}$.

## 1. Retrouver la formule brute

Pour $\mathrm{C_nH_{2n+3}N}$, le rapport des masses de carbone et d'hydrogène donne :

$$\frac{12n}{61{,}02}=\frac{2n+3}{15{,}25}$$

En croisant :

$$12n\times15{,}25=61{,}02(2n+3)$$

On obtient $n\approx3$, donc :

$$\boxed{\mathrm{C_3H_9N}}$$

La fraction d'azote manquante vaut aussi :

$$\%N=100-61{,}02-15{,}25=23{,}73\ \%$$

ce qui confirme $M\approx59\ \mathrm{g\,mol^{-1}}$.

## 2. Utiliser l'information « secondaire »

Parmi les isomères de $\mathrm{C_3H_9N}$, la seule amine secondaire est :

$$\boxed{\mathrm{CH_3-NH-CH_2CH_3}}$$

Son nom est **N-méthyléthanamine**, ou méthyléthylamine.

## 3. Action sur l'eau

$$\mathrm{CH_3NHCH_2CH_3+H_2O\rightleftharpoons[CH_3NH_2CH_2CH_3]^++OH^-}$$

La propriété mise en évidence est le **caractère basique** : N capte un proton.

## 4. Première action de l'iodoéthane

Le bilan scolaire du document conduit à l'amine tertiaire :

$$\mathrm{CH_3NHCH_2CH_3+C_2H_5I\longrightarrow CH_3N(C_2H_5)_2+HI}$$

Le produit organique est la **N-éthyl-N-méthyléthanamine**, aussi appelée **diéthylméthylamine**. La propriété mise en évidence est le **caractère nucléophile**.

La représentation ionique plus précise passe d'abord par le sel d'alkylammonium, puis par sa déprotonation en présence d'une base.

## 5. Deuxième action de l'iodoéthane

L'amine tertiaire obtenue réagit encore :

$$\mathrm{CH_3N(C_2H_5)_2+C_2H_5I\longrightarrow[CH_3N(C_2H_5)_3]^+I^-}$$

Le produit final est l'**iodure de triéthylméthylammonium**, un ammonium quaternaire.

## 6. Les amines autour de nous

Le document conclut par plusieurs emplois et présences naturelles :

- de nombreuses toxines, dont la **tétrodotoxine** du poisson-globe, possèdent des fonctions amine ;
- la **quinine**, issue du quinquina, a joué un rôle majeur contre le paludisme ;
- la **morphine** est un antalgique puissant ;
- l'industrie utilise des amines comme solvants et matières premières pour des colorants et des insecticides.

Ces exemples ne signifient pas que toutes les amines ont les mêmes effets : leurs propriétés biologiques dépendent de l'ensemble de leur structure, de la dose et du contexte d'utilisation.

> **Astuce mémoire de Davy.** Dans une mission longue, chaque information a un rôle : les pourcentages donnent la formule brute ; « secondaire » donne l'isomère ; l'eau teste la basicité ; l'iodoéthane teste la nucléophilie.` ,
    keyPoint: "61,02 % C et 15,25 % H => C3H9N ; secondaire => N-méthyléthanamine ; eau => basicité ; C2H5I => nucléophilie.",
    example: "$\\mathrm{CH_3NHCH_2CH_3\\xrightarrow{C_2H_5I}CH_3N(C_2H_5)_2\\xrightarrow{C_2H_5I}[CH_3N(C_2H_5)_3]^+I^-}$.",
    methodSteps: [
      "Transforme les pourcentages C/H en une équation portant sur n.",
      "Écris CnH2n+3N, puis calcule n et la formule brute.",
      "Utilise la classe secondaire pour sélectionner l'unique isomère compatible.",
      "Avec l'eau, écris la protonation réversible et conclus au caractère basique.",
      "Avec l'iodoéthane, ajoute un groupe éthyle à chaque étape et conclus au caractère nucléophile.",
      "À quatre groupes carbonés sur N, écris la charge positive et l'ion iodure.",
    ],
    corrections: [
      "Pages 7-8 : les équations d'alkylation sont conservées dans leur bilan scolaire, mais l'intermédiaire alkylammonium et la déprotonation sont rappelés pour éviter de présenter la formation directe de HI comme une étape élémentaire.",
      "Page 7 : « cite la propriété la mise en évidence » est corrigé en « cite la propriété mise en évidence ».",
      "Page 8 : l'adresse de la source est imprimée « www.faidherbe.ord » ; il faut lire le domaine .org.",
      "Page 8 : les usages médicaux et industriels sont contextualisés ; la présence d'une fonction amine ne suffit pas à prédire l'activité ou la toxicité d'une molécule.",
    ],
    interaction: timeline(
      [
        { label: "Composition massique", shortLabel: "Pourcentages", detail: "61,02 % de C et 15,25 % de H conduisent à n = 3 dans CnH2n+3N." },
        { label: "Formule brute", shortLabel: "C₃H₉N", detail: "La fraction d'azote vaut 23,73 %, compatible avec une masse molaire de 59 g·mol-1." },
        { label: "Classe secondaire", shortLabel: "Isomère", detail: "La seule structure secondaire est CH₃-NH-C₂H₅ : N-méthyléthanamine." },
        { label: "Réaction avec l'eau", shortLabel: "Base", detail: "N capte H+ ; le milieu produit OH-. La propriété est la basicité faible." },
        { label: "Premier iodoéthane", shortLabel: "Tertiaire", detail: "Un éthyle s'ajoute : CH₃N(C₂H₅)₂, amine tertiaire." },
        { label: "Second iodoéthane", shortLabel: "Quaternaire", detail: "Un troisième éthyle s'ajoute : [CH₃N(C₂H₅)₃]⁺I⁻, ammonium quaternaire." },
      ],
      "La mission complète",
      "Chaque donnée de l'énoncé déclenche une étape précise du raisonnement.",
      "Parcours les six étapes, du pourcentage au sel quaternaire.",
      "La réussite vient de la séparation des rôles : calcul, isomérie, acidité-basicité puis substitution nucléophile.",
    ),
    questions: [
      short("Calcule le pourcentage massique d'azote manquant.", ["23,73", "23.73", "23,73%", "23.73%"], "$100-61{,}02-15{,}25=23{,}73\\ \\%$.", "Exercice 5 - identification", 2),
      short("Détermine n dans $\\mathrm{C_nH_{2n+3}N}$.", ["3", "trois"], "Le rapport des pourcentages de C et H donne n = 3.", "Exercice 5 - question 1.1", 2),
      short("Donne la formule brute de l'amine.", ["C3H9N", "C₃H₉N", "c3h9n"], "Avec n=3, H=2n+3=9.", "Exercice 5 - question 1.1"),
      choice("Quelle structure respecte à la fois C3H9N et la classe secondaire ?", ["$\\mathrm{CH_3-NH-CH_2CH_3}$", "$\\mathrm{CH_3CH_2CH_2NH_2}$", "$\\mathrm{(CH_3)_3N}$", "$\\mathrm{CH_3CH(NH_2)CH_3}$"], 0, "N doit porter exactement deux groupes carbonés.", "Exercice 5 - question 1.2", 2),
      short("Nomme cette amine.", ["N-méthyléthanamine", "n-methylethanamine", "N-methylethanamine", "méthyléthylamine", "methylethylamine"], "La chaîne principale est l'éthanamine et le méthyle supplémentaire est porté par N.", "Exercice 5 - question 1.2"),
      choice("La réaction de cette amine avec l'eau met en évidence…", ["son caractère basique", "son caractère nucléophile", "son caractère acide fort", "son pouvoir oxydant"], 0, "Elle capte H+ et forme OH-.", "Exercice 5 - question 2.2"),
      choice("Quel produit ionique résulte de la protonation de $\\mathrm{CH_3NHCH_2CH_3}$ ?", ["$\\mathrm{[CH_3NH_2CH_2CH_3]^+}$", "$\\mathrm{CH_3N(CH_2CH_3)_2}$", "$\\mathrm{CH_3NH^-}$"], 0, "L'azote gagne un H+ et porte une charge positive.", "Exercice 5 - question 2.1", 2),
      choice("La première alkylation par C2H5I met en évidence…", ["la nucléophilie", "la basicité uniquement", "une oxydation", "une hydrolyse"], 0, "Le doublet de N attaque le carbone de l'iodoéthane.", "Exercice 5 - question 3.2"),
      choice("Quel est le produit organique neutre après la première alkylation et déprotonation ?", ["$\\mathrm{CH_3N(C_2H_5)_2}$", "$\\mathrm{CH_3NH_2}$", "$\\mathrm{(CH_3)_4N^+}$", "$\\mathrm{C_2H_5OH}$"], 0, "N porte désormais un méthyle et deux éthyles : c'est une amine tertiaire.", "Exercice 5 - question 3.1", 2),
      choice("Quel est le produit final après une seconde action de C2H5I ?", ["$\\mathrm{[CH_3N(C_2H_5)_3]^+I^-}$", "$\\mathrm{CH_3NHCH_2CH_3}$", "$\\mathrm{(C_2H_5)_4N^+Cl^-}$"], 0, "Le quatrième groupe carboné donne l'iodure de triéthylméthylammonium.", "Exercice 5 - question 4", 3),
      choice("La tétrodotoxine citée dans le document est associée notamment…", ["au poisson-globe", "au quinquina", "au savon", "à l'éthanol"], 0, "Le document cite le poisson tétrodon, ou poisson-globe.", "IV. Documents"),
      choice("La quinine citée dans le document provient…", ["de l'écorce de quinquina", "du poisson-globe", "du pétrole", "du méthane"], 0, "Le texte relie la quinine au traitement du paludisme.", "IV. Documents"),
      choice("Dans l'industrie, les amines sont notamment utilisées comme…", ["solvants et matières premières", "uniquement combustibles", "seulement engrais potassiques", "métaux de construction"], 0, "Le document mentionne les colorants et insecticides.", "IV. Documents"),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const aminesPath: LearningPath = {
  id: "terminale-d-chemistry-amines",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Chimie organique" },
  chapterNumber: 18,
  title: "Les amines",
  description: "Le cours officiel intégral, sans la situation d'apprentissage, enrichi de méthodes, d'interactions et de tous ses exercices corrigés.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Définir une amine et reconnaître ses trois classes",
    "Nommer une amine et dresser méthodiquement ses isomères",
    "Expliquer les caractères basique et nucléophile par le doublet de l'azote",
    "Identifier une amine par sa composition massique et prévoir ses alkylations successives",
  ],
  modules: [
    { id: "amines-mastery", title: "Maîtriser les amines", description: "Un niveau après l'autre, de la classification à la synthèse d'un ammonium quaternaire.", lessons: builtLevels },
  ],
};
