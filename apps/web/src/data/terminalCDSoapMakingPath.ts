import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L5_Fabrication dun savon.pdf";

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
      tip: "Vérifie toujours une masse molaire de triglycéride : 3 acides gras + glycérol − 3 molécules d’eau.",
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
    id: "saponification-definition",
    title: "La saponification d’un ester",
    summary: "Définir la saponification, écrire son équation générale et retenir ses deux caractéristiques : lente et totale.",
    pages: "1",
    section: "1. Saponification des esters",
    durationMinutes: 20,
    xp: 45,
    body: String.raw`## Définition

La **saponification** d’un ester est la réaction de cet ester avec les **ions hydroxyde $\mathrm{OH^-}$** provenant d’une **base forte** :

$$\mathrm{R-COO-R' + OH^- \longrightarrow R-COO^- + R'-OH}$$

L’ester est coupé en deux : un **ion carboxylate** $\mathrm{R-COO^-}$ et un **alcool** $\mathrm{R'-OH}$.

## Deux caractéristiques, à ne pas confondre

La réaction de saponification est **lente** et **totale**.

C’est le point qui départage cette leçon de la précédente. Compare :

| | Estérification directe | Hydrolyse acide | **Saponification** |
|---|---|---|---|
| Vitesse | lente | lente | **lente** |
| Avancement | limitée | limitée | **totale** |
| Réversibilité | réversible | réversible | **non réversible** |

> **Astuce mémoire de Davy.** La saponification est **l’hydrolyse basique** d’un ester. L’hydrolyse ordinaire, à l’eau, est limitée et réversible ; en milieu basique, l’ion carboxylate formé ne peut plus revenir en arrière, et la réaction va **jusqu’au bout**. Un seul mot change — basique — et l’équilibre disparaît.

> **Erreur fréquente.** Écrire la saponification avec une double flèche. Elle est **totale** : une flèche simple, toujours. C’est précisément ce qui la rend industriellement intéressante face à l’estérification.`,
    keyPoint: "Saponification : $\\mathrm{R-COO-R' + OH^- \\to R-COO^- + R'-OH}$. Réaction lente et **totale**, donc non réversible.",
    example: "$\\mathrm{CH_3-CO-O-CH_2-CH_3 + (Na^+ + OH^-) \\to (CH_3-COO^- + Na^+) + CH_3-CH_2-OH}$.",
    methodSteps: [
      "Repère la liaison $\\mathrm{-CO-O-}$ de l’ester : c’est là que la coupure a lieu.",
      "Place l’ion carboxylate $\\mathrm{R-COO^-}$ du côté de l’acide.",
      "Place l’alcool $\\mathrm{R'-OH}$ du côté du groupe alkyle.",
      "Écris une flèche simple : la réaction est totale.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Trois façons de couper un ester",
      instruction: "Sélectionne une voie pour comparer son milieu, ses produits et son avancement.",
      observation: "Le même ester, coupé au même endroit, mais un avancement radicalement différent selon le milieu. C’est la base forte qui rend la coupure définitive.",
      rootLabel: "Ester R–COO–R′",
      rootDetail: "Dans quel milieu le fait-on réagir ?",
      nodes: [
        { id: "saponification", label: "Saponification", role: "milieu basique — totale", detail: "Avec les ions hydroxyde d’une base forte : R–COO–R′ + OH⁻ → R–COO⁻ + R′–OH. Lente mais totale. L’ion carboxylate formé ne peut pas redonner l’ester, ce qui empêche tout retour en arrière." },
        { id: "hydrolyse", label: "Hydrolyse", role: "milieu aqueux — limitée", detail: "Avec l’eau seule : R–COO–R′ + H₂O ⇌ R–COOH + R′–OH. Lente, limitée et réversible, exactement comme l’estérification directe dont elle est la réaction inverse." },
        { id: "esterification", label: "Estérification directe", role: "sens inverse — limitée", detail: "Acide + alcool → ester + eau. Lente, athermique, réversible et limitée. C’est le point de départ de la leçon précédente ; la saponification en est en quelque sorte la version irréversible." },
      ],
    },
    questions: [
      choice("La saponification d’un ester est sa réaction avec…", ["les ions hydroxyde d’une base forte", "l’eau seule", "un acide fort", "un alcool"], 0, "C’est la définition du cours.", "1.1 Définition"),
      choice("La réaction de saponification est…", ["lente et totale", "rapide et totale", "lente et limitée", "rapide et limitée"], 0, "Les deux caractéristiques du cours.", "1.2 Caractéristiques", 2),
      short("Quels sont les deux produits de la saponification d’un ester $\\mathrm{R-COO-R'}$ ?", ["carboxylate et alcool", "ion carboxylate et alcool", "un carboxylate et un alcool"], "$\\mathrm{R-COO^-}$ et $\\mathrm{R'-OH}$.", "1.1 Définition", 2),
      choice("Pourquoi la saponification est-elle non réversible, contrairement à l’hydrolyse ?", ["l’ion carboxylate formé ne peut pas redonner l’ester", "elle est exothermique", "elle est rapide"], 0, "C’est le milieu basique qui rend la coupure définitive.", "1.2 Caractéristiques", 2),
      short("Écris le produit organique obtenu en saponifiant l’éthanoate d’éthyle : quel alcool se forme ?", ["ethanol", "éthanol", "l'éthanol", "CH3CH2OH"], "La partie alcool de l’ester est libérée : l’éthanol.", "Exercice 2 - question 2", 2),
    ],
  },
  {
    id: "triglycerides-structure",
    title: "Corps gras : les triglycérides",
    summary: "Comprendre qu’un triglycéride est le triester du glycérol et de trois acides gras, et reconnaître butyrine et palmitine.",
    pages: "1-2",
    section: "2. Triesters ou triglycérides",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## Ce qu’est un triglycéride

Les **triesters**, ou **triglycérides** :

- font partie des **corps gras** ;
- sont les constituants des **graisses** et des **huiles** ;
- proviennent des **acides gras** et du **propane-1,2,3-triol**, plus connu sous le nom de **glycérol**.

## La formule générale

Le glycérol porte **trois** groupes $\mathrm{-OH}$. Chacun s’estérifie avec un acide gras :

$$\mathrm{CH_2(OOC-R)-CH(OOC-R')-CH_2(OOC-R'')}$$

Quand les trois acides gras sont identiques, le triglycéride porte un nom simple.

## Deux acides gras du cours

| Acide gras | Formule | Triglycéride correspondant |
|---|---|---|
| Acide butyrique (butanoïque) | $\mathrm{CH_3(CH_2)_2COOH}$ | **butyrine** |
| Acide palmitique | $\mathrm{CH_3(CH_2)_{14}COOH}$ | **palmitine** |

Un troisième reviendra dans les exercices : l’**acide stéarique**, $\mathrm{CH_3(CH_2)_{16}COOH}$, dont le triglycéride est la **stéarine**.

## Calculer la masse molaire d’un triglycéride

C’est le calcul le plus utile de cette leçon — et celui que le document source rate à deux reprises. Le triglycéride se forme en soudant **trois acides gras** au **glycérol**, avec départ de **trois molécules d’eau** :

$$M_{\text{triglycéride}} = 3 \times M_{\text{acide gras}} + M_{\text{glycérol}} - 3 \times M_{\mathrm{H_2O}}$$

Avec $M_{\text{glycérol}} = 92$ g·mol⁻¹ et $M_{\mathrm{H_2O}} = 18$ g·mol⁻¹ :

| Triglycéride | Acide gras | Calcul | Masse molaire |
|---|---|---|---|
| Palmitine | palmitique, 256 | $3(256) + 92 - 54$ | **806 g·mol⁻¹** |
| Stéarine | stéarique, 284 | $3(284) + 92 - 54$ | **890 g·mol⁻¹** |

> **Astuce mémoire de Davy.** Ne recopie **jamais** une masse molaire de triglycéride sans la recalculer. Le document source annonce 366 pour la palmitine et 806 pour la stéarine — la première est fausse, et la seconde est en réalité celle de la **palmitine**. Deux minutes de calcul t’évitent de perdre toutes les questions numériques qui suivent.`,
    keyPoint: "Triglycéride = triester du glycérol et de trois acides gras. $M = 3 M_{\\text{acide}} + 92 - 54$. Palmitine : 806 g·mol⁻¹, stéarine : 890 g·mol⁻¹.",
    example: "Palmitine : $3 \\times 256 + 92 - 54 = 806$ g·mol⁻¹, à comparer aux 366 annoncés par le document.",
    methodSteps: [
      "Identifie l’acide gras et calcule sa masse molaire.",
      "Multiplie par trois : le glycérol porte trois groupes $\\mathrm{-OH}$.",
      "Ajoute 92 pour le glycérol, retranche 54 pour les trois molécules d’eau.",
      "Vérifie l’ordre de grandeur : un triglycéride d’acide gras dépasse toujours 600 g·mol⁻¹.",
    ],
    interaction: timeline(
      [
        { label: "Le glycérol, trois fonctions alcool", shortLabel: "Glycérol", detail: "Le propane-1,2,3-triol HO–CH₂–CHOH–CH₂–OH porte trois groupes –OH. Sa masse molaire est 92 g·mol⁻¹. C’est le squelette commun à tous les triglycérides." },
        { label: "Trois acides gras s’y fixent", shortLabel: "Acides gras", detail: "Chaque –OH s’estérifie avec un acide gras : butyrique CH₃(CH₂)₂COOH, palmitique CH₃(CH₂)₁₄COOH ou stéarique CH₃(CH₂)₁₆COOH. Quand les trois sont identiques, le triester porte le nom du corps gras : butyrine, palmitine, stéarine." },
        { label: "Trois molécules d’eau partent", shortLabel: "−3 H₂O", detail: "Chaque estérification libère une molécule d’eau. C’est ce qui explique le −54 dans le calcul de la masse molaire : trois fois 18 g·mol⁻¹." },
        { label: "On obtient le corps gras", shortLabel: "Triglycéride", detail: "Le produit est une huile ou une graisse. Sa masse molaire vaut 3 M(acide) + 92 − 54, soit 806 pour la palmitine et 890 pour la stéarine. Toujours la recalculer avant de l’utiliser." },
      ],
      "Comment se construit un triglycéride",
      "Parcours les quatre étapes : elles justifient la formule de la masse molaire.",
      "Ce n’est pas une formule à apprendre par cœur mais à reconstruire : trois estérifications sur un glycérol, donc trois molécules d’eau qui partent.",
    ),
    questions: [
      short("De quel polyalcool proviennent les triglycérides ?", ["glycerol", "glycérol", "le glycérol", "propane-1,2,3-triol"], "Le propane-1,2,3-triol, ou glycérol.", "2.1 Obtention"),
      choice("Les triglycérides sont les constituants…", ["des graisses et des huiles", "des savons", "des alcools", "des acides gras"], 0, "Ils font partie des corps gras.", "2.1 Obtention"),
      short("Écris la formule de l’acide palmitique.", ["CH3(CH2)14COOH", "ch3(ch2)14cooh", "C15H31COOH"], "Quinze carbones dans la chaîne plus celui du carboxyle.", "2.1 Obtention", 2),
      short("Quel triglycéride provient de l’acide butyrique ?", ["butyrine", "la butyrine"], "Le triester de l’acide butyrique et du glycérol.", "2.1 Exemples", 2),
      short("Calcule la masse molaire de la palmitine, en g·mol⁻¹. (acide palmitique : 256 ; glycérol : 92)", ["806", "806 g/mol"], "$3 \\times 256 + 92 - 3 \\times 18 = 806$.", "Situation d’évaluation - donnée corrigée", 3),
      choice("Combien de molécules d’eau partent lors de la formation d’un triglycéride ?", ["3", "1", "2", "aucune"], 0, "Une par estérification, donc trois au total.", "2.1 Obtention", 2),
    ],
    corrections: [
      "Page 1, le document écrit « propan-1,2,3 triol ». L’orthographe correcte, qu’il emploie d’ailleurs lui-même page 5, est propane-1,2,3-triol.",
      "Le document n’explicite jamais le calcul de la masse molaire d’un triglycéride, ce qui explique les valeurs fausses de ses exercices. La relation M = 3 M(acide gras) + 92 − 54 est ajoutée ici, avec ses deux applications : palmitine 806 g·mol⁻¹ et stéarine 890 g·mol⁻¹.",
    ],
  },
  {
    id: "soap-equation",
    title: "L’équation-bilan de la préparation d’un savon",
    summary: "Écrire la saponification d’un triglycéride par la soude, et reconnaître le savon comme carboxylate de sodium.",
    pages: "2",
    section: "3.1 Équation-bilan de la réaction",
    durationMinutes: 24,
    xp: 60,
    body: String.raw`## L’équation

Un triglycéride réagit avec **trois** fois la soude — un ion hydroxyde par fonction ester :

$$\mathrm{triglycéride + 3\,(Na^+ + OH^-) \longrightarrow glycérol + 3\ carboxylate\ de\ sodium}$$

Sous forme développée, avec trois acides gras identiques $\mathrm{R}$ :

$$\mathrm{CH_2(OOC\text{-}R)-CH(OOC\text{-}R)-CH_2(OOC\text{-}R) + 3(Na^+ + OH^-)}$$
$$\longrightarrow \mathrm{CH_2OH-CHOH-CH_2OH + 3\,(R-COO^- + Na^+)}$$

Le **carboxylate de sodium** obtenu **est le savon**.

## Le coefficient 3, et ce qu’il implique

Le stœchiométrie de cette réaction est la clé de tous les calculs de la leçon :

| Relation molaire | Traduction |
|---|---|
| $n_{\text{savon}} = 3 \times n_{\text{triglycéride}}$ | une mole de corps gras donne **trois** moles de savon |
| $n_{\text{glycérol}} = n_{\text{triglycéride}}$ | mais **une seule** mole de glycérol |

## Un exemple concret

Avec l’**huile de palme**, qui contient de la **palmitine**, on obtient le **palmitate de sodium** :

$$\mathrm{(C_{15}H_{31}COO^- + Na^+)}$$

de masse molaire **278 g·mol⁻¹**.

> **Astuce mémoire de Davy.** Retiens le rapport **3 : 1 : 3** — trois soude, un glycérol, trois savons, pour un triglycéride. Le glycérol est le seul produit qui ne se multiplie pas par trois : il n’y a qu’un squelette de glycérol par molécule de corps gras.

> **Erreur fréquente.** Oublier le coefficient 3 devant la soude. L’équation n’est alors plus équilibrée, et toutes les masses calculées ensuite sont fausses d’un facteur trois.`,
    keyPoint: "Triglycéride + 3 (Na⁺ + OH⁻) → glycérol + 3 carboxylate de sodium. Le savon est le carboxylate de sodium. Palmitate de sodium : 278 g·mol⁻¹.",
    example: "La palmitine donne trois moles de palmitate de sodium $\\mathrm{(C_{15}H_{31}COO^- + Na^+)}$ et une mole de glycérol.",
    methodSteps: [
      "Écris le triglycéride avec ses trois fonctions ester.",
      "Fais réagir avec trois fois $\\mathrm{(Na^+ + OH^-)}$.",
      "Écris les produits : un glycérol et trois carboxylates de sodium.",
      "Vérifie l’équilibre en atomes avant de passer aux calculs de masse.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Ce que devient chaque partie du corps gras",
      instruction: "Sélectionne un fragment pour suivre son devenir dans la réaction.",
      observation: "La molécule se sépare en deux destins : le squelette de glycérol part seul, les trois chaînes grasses deviennent trois molécules de savon. Tout le rapport 3 : 1 est là.",
      rootLabel: "Triglycéride + 3 (Na⁺ + OH⁻)",
      rootDetail: "Que devient chaque partie de la molécule ?",
      nodes: [
        { id: "glycerol", label: "Le squelette glycérol", role: "→ 1 glycérol", detail: "Les trois carbones du glycérol récupèrent leurs trois groupes –OH et repartent sous forme de propane-1,2,3-triol, de masse molaire 92 g·mol⁻¹. Une molécule de corps gras ne donne qu’un seul glycérol : c’est le produit qui ne se multiplie pas." },
        { id: "savon", label: "Les trois chaînes grasses", role: "→ 3 savons", detail: "Chaque chaîne R–COO– devient un ion carboxylate, associé à un ion sodium : c’est le savon. Avec la palmitine, on obtient trois palmitates de sodium (C₁₅H₃₁COO⁻ + Na⁺), de masse molaire 278 g·mol⁻¹." },
        { id: "soude", label: "La soude", role: "3 équivalents consommés", detail: "Il faut un ion hydroxyde par fonction ester, donc trois par triglycéride. Oublier ce coefficient est l’erreur la plus coûteuse de la leçon : toutes les masses calculées ensuite s’en trouvent fausses." },
      ],
    },
    questions: [
      choice("Combien de moles de soude faut-il pour saponifier une mole de triglycéride ?", ["3", "1", "2", "6"], 0, "Une par fonction ester.", "3.1 Équation-bilan", 2),
      choice("Le savon obtenu est…", ["un carboxylate de sodium", "un alcool", "un acide carboxylique", "un ester"], 0, "$\\mathrm{R-COO^- + Na^+}$.", "3.1 Équation-bilan"),
      short("Quel savon obtient-on à partir de l’huile de palme, qui contient de la palmitine ?", ["palmitate de sodium", "le palmitate de sodium"], "$\\mathrm{(C_{15}H_{31}COO^- + Na^+)}$.", "3.1 Équation-bilan", 2),
      choice("Une mole de triglycéride donne combien de moles de glycérol ?", ["1", "3", "2"], 0, "Il n’y a qu’un squelette de glycérol par molécule de corps gras.", "3.1 Équation-bilan", 2),
      short("Quelle est la masse molaire du palmitate de sodium, en g·mol⁻¹ ?", ["278", "278 g/mol"], "$\\mathrm{C_{16}H_{31}O_2Na}$ : $192+31+32+23 = 278$.", "Situation d’évaluation - données", 2),
      short("Quel autre produit, à côté du savon, la saponification d’un corps gras fournit-elle ?", ["glycerol", "glycérol", "le glycérol", "propane-1,2,3-triol"], "Le squelette du triglycéride repart en glycérol.", "3.1 Équation-bilan"),
    ],
  },
  {
    id: "soap-preparation-protocol",
    title: "Le protocole de fabrication au laboratoire",
    summary: "Suivre les quatre étapes de la préparation d’un savon, du chauffage à reflux au relargage, et vérifier ses propriétés détergentes.",
    pages: "3",
    section: "3.2 Description de la préparation",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Les quatre étapes

**1. Chauffage à reflux.** On chauffe de l’**huile** additionnée de **soude en solution dans de l’alcool**. Le reflux permet de chauffer sans rien perdre : les vapeurs se condensent et retombent dans le ballon.

**2. Relargage.** Le mélange obtenu est versé dans une **solution concentrée de chlorure de sodium**. Le savon, **très peu soluble dans ces conditions**, **précipite**.

**3. Filtration et rinçage.** On sépare le solide, puis on le rince.

**4. Vérification.** On vérifie que le solide obtenu a des **propriétés détergentes** : dissolution de la saleté.

## Pourquoi chacune de ces étapes ?

| Étape | Rôle |
|---|---|
| Chauffage | la saponification est **lente** : la chaleur l’accélère |
| Reflux | éviter de perdre l’alcool et l’eau par évaporation |
| Alcool | l’huile et la soude aqueuse ne se mélangent pas ; l’alcool les rend miscibles |
| Chlorure de sodium concentré | diminuer la solubilité du savon pour le faire précipiter |

> **Astuce mémoire de Davy.** Le mot à retenir pour l’étape 2 est **relargage** : on « sale » la solution pour en faire sortir le savon. C’est le même principe que dans l’industrie, où l’on récupère le savon en surface après ajout de sel.

> **Erreur fréquente.** Croire que le chlorure de sodium participe à la réaction chimique. Il n’intervient **pas** dans l’équation-bilan : son rôle est uniquement **physique**, il fait chuter la solubilité du savon.`,
    keyPoint: "Chauffage à reflux de l’huile et de la soude alcoolique, puis relargage dans une solution concentrée de $\\mathrm{NaCl}$, filtration, rinçage, test de détergence.",
    example: "Le savon précipite au relargage parce qu’il est très peu soluble dans une solution saline concentrée.",
    methodSteps: [
      "Mélange l’huile et la soude en solution alcoolique dans un ballon.",
      "Chauffe à reflux : la saponification est lente.",
      "Verse dans une solution concentrée de chlorure de sodium pour faire précipiter le savon.",
      "Filtre, rince, puis vérifie les propriétés détergentes du solide.",
    ],
    interaction: timeline(
      [
        { label: "Chauffer à reflux", shortLabel: "Reflux", detail: "Huile + soude dissoute dans de l’alcool, dans un ballon surmonté d’un réfrigérant. La chaleur compense la lenteur de la réaction ; le reflux évite toute perte par évaporation. L’alcool sert de solvant commun à l’huile et à la soude, qui ne se mélangent pas autrement." },
        { label: "Relarguer dans l’eau salée", shortLabel: "Relargage", detail: "Le mélange est versé dans une solution concentrée de chlorure de sodium. Le savon y est très peu soluble : il précipite. Le sel ne participe pas à la réaction, son rôle est purement physique." },
        { label: "Filtrer et rincer", shortLabel: "Filtrer", detail: "On sépare le solide du filtrat, puis on le rince pour éliminer la soude en excès et le sel résiduel." },
        { label: "Vérifier la détergence", shortLabel: "Vérifier", detail: "Le solide obtenu doit dissoudre la saleté : c’est le test qui confirme qu’on a bien fabriqué un savon." },
      ],
      "Du ballon au savon solide",
      "Parcours les quatre étapes du protocole de laboratoire.",
      "Deux étapes seulement sont chimiques — le chauffage et la réaction elle-même. Le relargage, la filtration et le rinçage sont des opérations de séparation.",
    ),
    questions: [
      choice("Pourquoi chauffe-t-on le mélange lors de la fabrication d’un savon ?", ["parce que la saponification est lente", "parce qu’elle est endothermique", "pour évaporer l’eau"], 0, "La chaleur compense la lenteur de la réaction.", "3.2 Description", 2),
      choice("Dans quoi verse-t-on le mélange en fin de chauffage ?", ["une solution concentrée de chlorure de sodium", "de l’eau distillée", "une solution d’acide chlorhydrique"], 0, "C’est le relargage.", "3.2 Description"),
      choice("Pourquoi le savon précipite-t-il dans la solution salée ?", ["il y est très peu soluble", "il réagit avec le chlorure de sodium", "il est plus dense que l’eau"], 0, "Le rôle du sel est physique, pas chimique.", "3.2 Description", 2),
      short("Comment appelle-t-on l’opération qui consiste à verser le mélange dans une solution salée concentrée ?", ["relargage", "le relargage"], "Le savon est « chassé » de la solution par le sel.", "3.2 Description", 2),
      short("Quelle propriété vérifie-t-on sur le solide obtenu ?", ["detergente", "détergente", "les proprietes detergentes", "propriétés détergentes", "detergentes"], "La dissolution de la saleté.", "3.2 Description"),
      choice("Pourquoi la soude est-elle mise en solution dans de l’alcool ?", ["pour rendre l’huile et la soude miscibles", "pour accélérer le relargage", "pour neutraliser l’acide gras"], 0, "L’alcool sert de solvant commun aux deux réactifs.", "3.2 Description", 2),
    ],
  },
  {
    id: "saponification-calculations",
    title: "Calculer les masses de savon et de glycérol",
    summary: "Exploiter les relations molaires 3 : 1 pour passer d’une masse de corps gras aux masses de savon et de glycérol obtenus.",
    pages: "3-4",
    section: "Situation d’évaluation — questions 3.1 et 3.2",
    durationMinutes: 30,
    xp: 75,
    body: String.raw`## Les deux relations à poser

Tout part de l’équation-bilan. Pour un triglycéride noté 1, un savon noté S et le glycérol noté a :

$$n_S = 3\,n_1 \qquad\text{et}\qquad n_a = n_1$$

En passant aux masses, avec $n = \dfrac{m}{M}$ :

$$\boxed{\;m_S = 3\,\frac{m_1}{M_1}\,M_S \qquad m_a = \frac{m_1}{M_1}\,M_a\;}$$

## L’application du cours, avec la masse molaire corrigée

On part de $m_1 = 100$ g d’huile de table assimilée à de la **palmitine**.

**Étape 1 — la masse molaire du corps gras.** C’est ici que tout se joue :

$$M_1 = 3 \times 256 + 92 - 54 = 806 \text{ g·mol}^{-1}$$

**Étape 2 — la masse de savon**, avec $M_S = 278$ g·mol⁻¹ pour le palmitate de sodium :

$$m_S = 3 \times \frac{100}{806} \times 278 = \mathbf{103{,}5 \text{ g}}$$

**Étape 3 — la masse de glycérol**, avec $M_a = 92$ g·mol⁻¹ :

$$m_a = \frac{100}{806} \times 92 = \mathbf{11{,}4 \text{ g}}$$

## Vérifier son résultat

Deux contrôles rapides évitent les erreurs grossières :

| Contrôle | Attendu |
|---|---|
| Conservation de la masse | $m_1 + m_{\text{soude}} = m_S + m_a$, donc $m_S$ ne peut pas dépasser $m_1$ de beaucoup |
| Rapport savon / glycérol | environ $\dfrac{3 \times 278}{92} \approx 9$ |

Avec 103,5 g et 11,4 g, le rapport vaut 9,1 : cohérent. Les valeurs du document, 227,87 g et 25,14 g, donnent le même rapport — l’erreur ne porte pas sur la méthode mais **uniquement sur la masse molaire du corps gras**.

> **Astuce mémoire de Davy.** Quand deux résultats sont faux dans le même rapport, cherche l’erreur dans une donnée **commune** aux deux calculs — ici $M_1$. C’est un réflexe de vérification qui vaut pour toute la physique-chimie.`,
    keyPoint: "$m_S = 3\\,\\dfrac{m_1}{M_1}M_S$ et $m_a = \\dfrac{m_1}{M_1}M_a$. Avec 100 g de palmitine : 103,5 g de savon et 11,4 g de glycérol.",
    example: "$M_1 = 806$ donne $m_S = 3 \\times (100/806) \\times 278 = 103{,}5$ g, et non les 227,87 g du document qui utilise $M_1 = 366$.",
    methodSteps: [
      "Recalcule la masse molaire du triglycéride : $3M_{\\text{acide}} + 92 - 54$.",
      "Pose les relations molaires : $n_S = 3n_1$ et $n_a = n_1$.",
      "Convertis en masses avec $n = m/M$.",
      "Vérifie le rapport savon/glycérol, proche de 9 pour un acide gras long.",
    ],
    interaction: timeline(
      [
        { label: "Calculer M du corps gras", shortLabel: "M du corps gras", detail: "3 M(acide gras) + 92 − 54. Pour la palmitine : 3 × 256 + 92 − 54 = 806 g·mol⁻¹. Ne jamais recopier cette valeur d’un énoncé sans la vérifier." },
        { label: "Poser les relations molaires", shortLabel: "Relations", detail: "L’équation-bilan donne n(savon) = 3 n(corps gras) et n(glycérol) = n(corps gras). Le facteur 3 ne concerne que le savon." },
        { label: "Passer aux masses", shortLabel: "Masses", detail: "m_S = 3 (m₁/M₁) M_S et m_a = (m₁/M₁) M_a. Pour 100 g de palmitine : 103,5 g de palmitate de sodium et 11,4 g de glycérol." },
        { label: "Contrôler l’ordre de grandeur", shortLabel: "Vérifier", detail: "Le rapport masse de savon sur masse de glycérol vaut environ 3 × 278 / 92 ≈ 9. Et la masse de savon ne peut pas être plus du double de la masse d’huile de départ." },
      ],
      "La chaîne de calcul, du corps gras au savon",
      "Suis les quatre étapes : la première est celle que le document rate.",
      "La méthode du document est juste ; seule sa masse molaire de palmitine est fausse. C’est pourquoi ses deux résultats sont faux du même facteur — un indice précieux quand on relit une copie.",
    ),
    questions: [
      choice("Quelle relation molaire lie le savon au triglycéride ?", ["$n_S = 3\\,n_1$", "$n_S = n_1$", "$n_S = n_1/3$"], 0, "Trois fonctions ester donnent trois savons.", "Situation d’évaluation - question 3.1", 2),
      choice("Quelle relation molaire lie le glycérol au triglycéride ?", ["$n_a = n_1$", "$n_a = 3\\,n_1$", "$n_a = n_1/3$"], 0, "Un seul squelette de glycérol par molécule.", "Situation d’évaluation - question 3.2", 2),
      short("Avec 100 g de palmitine ($M = 806$), quelle masse de palmitate de sodium ($M = 278$) obtient-on ? (en g, une décimale)", ["103,5", "103.5", "103,5 g", "103.5 g"], "$3 \\times (100/806) \\times 278 = 103{,}5$ g.", "Situation d’évaluation - question 3.1 corrigée", 3),
      short("Avec la même quantité, quelle masse de glycérol ($M = 92$) obtient-on ? (en g, une décimale)", ["11,4", "11.4", "11,4 g", "11.4 g"], "$(100/806) \\times 92 = 11{,}4$ g.", "Situation d’évaluation - question 3.2 corrigée", 3),
      short("Quelle est la masse molaire du glycérol, en g·mol⁻¹ ?", ["92", "92 g/mol"], "$\\mathrm{C_3H_8O_3}$ : $36+8+48 = 92$.", "Situation d’évaluation - données", 2),
    ],
    corrections: [
      "Pages 3 et 4, situation d’évaluation : le document utilise M₁ = 366 g·mol⁻¹ pour la palmitine. La valeur exacte est 806 g·mol⁻¹ (3 × 256 + 92 − 54). Ses deux résultats sont donc faux : la masse de savon est de 103,5 g et non 227,87 g, et la masse de glycérol de 11,4 g et non 25,14 g. La méthode du document, elle, est correcte — seule cette donnée est en cause.",
    ],
  },
  {
    id: "saponification-workshop",
    title: "Atelier : butyrine, acétate d’éthyle et glycérol",
    summary: "Écrire les équations de saponification des exercices officiels et nommer chaque produit obtenu.",
    pages: "4-6",
    section: "III. Exercices 1 à 3",
    durationMinutes: 30,
    xp: 80,
    kind: "practice",
    body: String.raw`## Exercice 1 — la butyrine

La **butyrine** est le triester de l’**acide butyrique** $\mathrm{C_3H_7-COOH}$ et du glycérol :

$$\mathrm{CH_2(OOC\text{-}C_3H_7)-CH(OOC\text{-}C_3H_7)-CH_2(OOC\text{-}C_3H_7)}$$

Sa saponification par la soude :

$$\mathrm{butyrine + 3(Na^+ + OH^-) \longrightarrow glycérol + 3\,(C_3H_7\text{-}COO^- + Na^+)}$$

**Produits** : le **glycérol** et le **butanoate de sodium**.

## Exercice 2 — un ester simple

Les caractéristiques d’abord : la saponification est **lente mais totale**.

Puis la saponification de l’**acétate d’éthyle** — autre nom de l’éthanoate d’éthyle :

$$\mathrm{CH_3-CO-O-CH_2-CH_3 + (Na^+ + OH^-) \longrightarrow (CH_3-COO^- + Na^+) + CH_3-CH_2-OH}$$

Un seul équivalent de soude ici : il n’y a **qu’une** fonction ester, contrairement au triglycéride.

## Exercice 3 — du glycérol au savon

| Composé | Formule semi-développée |
|---|---|
| Glycérol (propane-1,2,3-triol) | $\mathrm{HO-CH_2-CHOH-CH_2-OH}$ |
| Acide butyrique | $\mathrm{C_3H_7-COOH}$ |
| Savon obtenu | $\mathrm{C_3H_7-COO^- + Na^+}$ |

> **Astuce mémoire de Davy.** Compte les fonctions ester avant d’écrire le coefficient devant la soude : **un** pour un ester simple, **trois** pour un triglycéride. C’est la seule différence entre les exercices 1 et 2, et c’est aussi la faute la plus fréquente.`,
    keyPoint: "Un ester simple consomme une soude, un triglycéride en consomme trois. Butyrine → glycérol + butanoate de sodium.",
    example: "$\\mathrm{CH_3-CO-O-C_2H_5 + (Na^+ + OH^-) \\to (CH_3-COO^- + Na^+) + C_2H_5-OH}$.",
    methodSteps: [
      "Compte les fonctions ester de la molécule de départ.",
      "Place autant d’équivalents de soude que de fonctions ester.",
      "Écris les produits : le ou les carboxylates de sodium, et l’alcool ou le glycérol.",
      "Nomme chaque produit : « …oate de sodium » pour le savon.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Un ester simple ou un triglycéride ?",
      instruction: "Sélectionne un cas pour voir le coefficient de la soude et les produits attendus.",
      observation: "La réaction est la même dans les deux cas ; seul le nombre de fonctions ester change, et avec lui tous les coefficients de l’équation.",
      rootLabel: "Ester à saponifier",
      rootDetail: "Combien de fonctions ester la molécule porte-t-elle ?",
      nodes: [
        { id: "simple", label: "Ester simple", role: "1 fonction — 1 soude", detail: "Exemple : l’acétate d’éthyle CH₃–CO–O–C₂H₅. Il consomme un seul équivalent de soude et donne un carboxylate de sodium et un alcool : éthanoate de sodium et éthanol." },
        { id: "triglyceride", label: "Triglycéride", role: "3 fonctions — 3 soudes", detail: "Exemple : la butyrine. Elle consomme trois équivalents de soude et donne trois butanoates de sodium et un seul glycérol. C’est le rapport 3 : 1 qui gouverne tous les calculs de masse." },
      ],
    },
    questions: [
      short("Quels sont les deux produits de la saponification de la butyrine par la soude ?", ["glycerol et butanoate de sodium", "glycérol et butanoate de sodium", "butanoate de sodium et glycérol"], "Trois butanoates de sodium et un glycérol.", "Exercice 1 - question 3", 2),
      choice("Combien d’équivalents de soude consomme l’acétate d’éthyle ?", ["1", "3", "2"], 0, "Il ne porte qu’une seule fonction ester.", "Exercice 2 - question 2", 2),
      short("Quel alcool obtient-on en saponifiant l’acétate d’éthyle ?", ["ethanol", "éthanol", "l'éthanol"], "La partie alcool de l’ester est libérée.", "Exercice 2 - question 2", 2),
      short("Écris la formule semi-développée du glycérol.", ["HO-CH2-CHOH-CH2-OH", "HOCH2CHOHCH2OH", "CH2OH-CHOH-CH2OH"], "Trois carbones, trois groupes $\\mathrm{-OH}$.", "Exercice 3 - question 1.1", 2),
      short("Quelle est la formule du savon obtenu en saponifiant la butyrine ?", ["C3H7-COO- + Na+", "C3H7COO-Na+", "C3H7COONa"], "Le butanoate de sodium.", "Exercice 3 - question 2.2", 2),
      choice("Les caractéristiques de la réaction de saponification sont…", ["lente mais totale", "rapide et totale", "lente et limitée"], 0, "Réponse de l’exercice 2.", "Exercice 2 - question 1"),
    ],
  },
  {
    id: "soap-production-mission",
    title: "Mission finale : du laboratoire à l’industrie",
    summary: "Mener les calculs de rendement d’une saponification, identifier le précipité d’un traitement acide et produire du stéarate de sodium.",
    pages: "3-4, 6-8",
    section: "Situation d’évaluation et exercices 4 et 5",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Volet 1 — la saponification du benzoate d’éthyle (exercice 4)

On introduit $V = 10{,}0$ mL de **benzoate d’éthyle** ($\rho = 1{,}05$ g·mL⁻¹, $M = 150$ g·mol⁻¹) et $V' = 25$ mL de **soude** à $C' = 4$ mol·L⁻¹. On chauffe à reflux, puis on traite par un **excès d’acide chlorhydrique** : un solide précipite.

**1. La réaction.** C’est une **saponification** — un ester traité par une base forte. Elle est **lente et totale**.

$$\mathrm{C_6H_5-CO-O-C_2H_5 + (Na^+ + OH^-) \longrightarrow (C_6H_5-COO^- + Na^+) + C_2H_5-OH}$$

**2. Les quantités de matière.**

$$n_{\text{soude}} = C'V' = 4 \times 25\times10^{-3} = 0{,}1 \text{ mol}$$
$$m_{\text{ester}} = \rho V = 1{,}05 \times 10 = 10{,}5 \text{ g} \quad\Longrightarrow\quad n_{\text{ester}} = \frac{10{,}5}{150} = 0{,}07 \text{ mol}$$

L’ester est le **réactif limitant** : après réaction, il en reste 0, et il reste $0{,}1 - 0{,}07 = 0{,}03$ mol de soude.

**3. Le précipité.** L’acide chlorhydrique en excès neutralise la soude restante, **puis protone l’ion benzoate** :

$$\mathrm{C_6H_5-COO^- + H_3O^+ \longrightarrow C_6H_5-COOH + H_2O}$$

Le solide qui précipite est donc l’**acide benzoïque**, de masse molaire $M = 122$ g·mol⁻¹ :

$$m = 0{,}07 \times 122 = \mathbf{8{,}54 \text{ g}}$$

## Volet 2 — le stéarate de sodium industriel (exercice 5)

L’**acide stéarique** est un **acide carboxylique** saturé à 18 carbones : $\mathrm{CH_3(CH_2)_{16}-COOH}$, de masse molaire 284 g·mol⁻¹.

Estérifié par le glycérol, il donne la **stéarine**, dont il faut recalculer la masse molaire :

$$M_{\text{stéarine}} = 3 \times 284 + 92 - 54 = 890 \text{ g·mol}^{-1}$$

Une masse $m_1 = 1$ kg de stéarine traitée par un excès de soude subit une **saponification**, lente et totale, et donne du **stéarate de sodium** — nom d’usage : un **savon** — de masse molaire 306 g·mol⁻¹ :

$$m_2 = 3 \times \frac{m_1}{M_{\text{stéarine}}} \times M_2 = 3 \times \frac{1000}{890} \times 306 = \mathbf{1031 \text{ g} \approx 1{,}03 \text{ kg}}$$

## Ce que les trois énoncés ont en commun

| | Situation d’évaluation | Exercice 4 | Exercice 5 |
|---|---|---|---|
| Ester de départ | palmitine | benzoate d’éthyle | stéarine |
| Fonctions ester | 3 | 1 | 3 |
| Grandeur cherchée | masses de savon et de glycérol | masse d’un précipité | masse de savon |
| Piège | $M$ du corps gras | nature du précipité | $M$ du corps gras |

> **Astuce mémoire de Davy.** Deux des trois pièges portent sur la **masse molaire du corps gras**, et le troisième sur **l’identité du produit final**. Prends l’habitude de te poser deux questions avant tout calcul : *de quelle molécule exactement parle-t-on ?* et *ai-je recalculé sa masse molaire ?*`,
    keyPoint: "Réactif limitant, puis identité exacte du produit. Acide benzoïque : 122 g·mol⁻¹ → 8,54 g. Stéarine : 890 g·mol⁻¹ → 1,03 kg de stéarate de sodium.",
    example: "$3 \\times (1000/890) \\times 306 = 1031$ g, et non les 1,14 kg du document qui utilise 806 — la masse molaire de la palmitine, pas celle de la stéarine.",
    methodSteps: [
      "Calcule les quantités de matière des deux réactifs et repère le limitant.",
      "Écris l’équation de saponification, puis celle du traitement acide s’il y en a un.",
      "Identifie précisément le produit final : acide carboxylique ou carboxylate de sodium ?",
      "Recalcule sa masse molaire avant de conclure.",
    ],
    interaction: timeline(
      [
        { label: "Repérer le réactif limitant", shortLabel: "Limitant", detail: "n(soude) = C′V′ = 0,1 mol ; n(ester) = ρV/M = 10,5/150 = 0,07 mol. L’ester est limitant : il disparaît entièrement et il reste 0,03 mol de soude." },
        { label: "Suivre le traitement acide", shortLabel: "Acide", detail: "L’acide chlorhydrique en excès neutralise d’abord la soude restante, puis protone l’ion benzoate : C₆H₅–COO⁻ + H₃O⁺ → C₆H₅–COOH + H₂O. C’est cette seconde réaction qui produit le précipité." },
        { label: "Identifier le précipité", shortLabel: "Précipité", detail: "Le solide est l’acide benzoïque, peu soluble dans l’eau, de masse molaire 122 g·mol⁻¹ — et non le benzoate de sodium, qui est soluble et pèse 144 g·mol⁻¹. m = 0,07 × 122 = 8,54 g." },
        { label: "Passer à l’échelle industrielle", shortLabel: "Industrie", detail: "Pour 1 kg de stéarine (M = 890), la saponification donne 3 × (1000/890) × 306 = 1031 g de stéarate de sodium, soit environ 1,03 kg de savon." },
      ],
      "Trois problèmes, deux réflexes",
      "Suis les quatre étapes : elles couvrent les deux volets de la mission.",
      "Les deux réflexes qui sauvent : identifier le réactif limitant, et vérifier de quelle molécule on calcule la masse molaire. Les erreurs du document viennent toutes de la seconde.",
    ),
    questions: [
      choice("Exercice 4 : quel est le nom de la réaction entre le benzoate d’éthyle et la soude ?", ["une saponification", "une estérification", "une hydrolyse acide"], 0, "Un ester traité par une base forte : c’est une saponification.", "Exercice 4 - question 1.1 corrigée", 3),
      short("Exercice 4 : quelle quantité de matière de soude introduit-on ? (en mol)", ["0,1", "0.1", "0,1 mol", "0.1 mol"], "$n = C'V' = 4 \\times 25\\times10^{-3} = 0{,}1$ mol.", "Exercice 4 - question 3.1", 2),
      short("Exercice 4 : quelle quantité de matière de benzoate d’éthyle introduit-on ? (en mol)", ["0,07", "0.07", "0,07 mol", "0.07 mol"], "$m = \\rho V = 10{,}5$ g, puis $n = 10{,}5/150 = 0{,}07$ mol.", "Exercice 4 - question 3.2", 2),
      choice("Exercice 4 : quel solide précipite après ajout de l’acide chlorhydrique en excès ?", ["l’acide benzoïque", "le benzoate de sodium", "le chlorure de sodium"], 0, "L’ion benzoate est protoné en acide benzoïque, peu soluble.", "Exercice 4 - question 4 corrigée", 3),
      short("Exercice 4 : quelle est la masse du précipité ? (en g, deux décimales)", ["8,54", "8.54", "8,54 g", "8.54 g"], "$0{,}07 \\times 122 = 8{,}54$ g.", "Exercice 4 - question 4 corrigée", 3),
      short("Exercice 5 : quelle est la masse molaire de la stéarine, en g·mol⁻¹ ?", ["890", "890 g/mol"], "$3 \\times 284 + 92 - 54 = 890$.", "Exercice 5 - donnée corrigée", 3),
      short("Exercice 5 : quelle masse de stéarate de sodium obtient-on à partir de 1 kg de stéarine ? (en g, arrondie)", ["1031", "1031 g", "1030", "1,03 kg"], "$3 \\times (1000/890) \\times 306 = 1031$ g.", "Exercice 5 - question 4.3 corrigée", 3),
      choice("Exercice 5 : quel est le nom d’usage du stéarate de sodium ?", ["un savon", "une huile", "un détergent de synthèse"], 0, "C’est le savon obtenu par saponification de la stéarine.", "Exercice 5 - question 4.1.3"),
    ],
    corrections: [
      "Page 7, exercice 4, question 1.1 : le corrigé répond « c’est une réaction d’estérification ». C’est faux, et cela contredit la question 2.1 du même exercice, qui demande « l’équation-bilan de la réaction de saponification ». Un ester traité par une base forte subit une saponification.",
      "Page 7, exercice 4, question 4 : le corrigé calcule la masse du précipité avec M′ = 144 g·mol⁻¹, qui est la masse molaire du benzoate de sodium. Or ce sel est soluble ; le solide qui précipite après ajout d’acide chlorhydrique en excès est l’acide benzoïque, de masse molaire 122 g·mol⁻¹. La masse correcte est 8,54 g et non 10,08 g. L’équation de précipitation, absente du corrigé, est ajoutée : C₆H₅–COO⁻ + H₃O⁺ → C₆H₅–COOH + H₂O.",
      "Page 8, exercice 5, question 4.3 : le corrigé utilise M = 806 g·mol⁻¹ pour la stéarine. Cette valeur est celle de la palmitine ; la stéarine vaut 3 × 284 + 92 − 54 = 890 g·mol⁻¹. La masse de stéarate de sodium est donc de 1,03 kg et non 1,14 kg.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const soapMakingPath: LearningPath = {
  id: "terminale-cd-chemistry-soap",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Chimie organique" },
  chapterNumber: 4,
  title: "Fabrication d’un savon",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Définir la saponification et écrire son équation-bilan",
    "Reconnaître un triglycéride et calculer sa masse molaire",
    "Décrire le protocole de fabrication d’un savon au laboratoire",
    "Mener les calculs de masse de savon, de glycérol et de précipité",
  ],
  modules: [
    { id: "soap-mastery", title: "Maîtriser la fabrication d’un savon", description: "Un niveau après l’autre, de la saponification d’un ester à la production industrielle de savon.", lessons: builtLevels },
  ],
};
