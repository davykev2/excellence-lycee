import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";
import { carbonylCompoundsPath } from "./terminalCDCarbonylCompoundsPath";
import { carboxylicAcidsPath } from "./terminalCDCarboxylicAcidsPath";
import { soapMakingPath } from "./terminalCDSoapMakingPath";
import { aqueousSolutionsPhPath } from "./terminalCDAqueousSolutionsPhPath";
import { strongAcidBasePath } from "./terminalCDStrongAcidBasePath";
import { weakAcidBasePath } from "./terminalCDWeakAcidBasePath";
import { acidBaseCouplesPath } from "./terminalCDAcidBaseCouplesPath";
import { acidBaseBuffersPath } from "./terminalCDAcidBaseBuffersPath";

const sourceDocument = "TleD_CH_L1_Les alcools.pdf";

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
    id: "alcohol-definition-nomenclature",
    title: "Définition, formule générale et nomenclature",
    summary: "Reconnaître un alcool à son groupe hydroxyle et le nommer avec le suffixe « -ol ».",
    pages: "1",
    section: "1. Définition et nomenclature",
    durationMinutes: 16,
    xp: 45,
    body: String.raw`## Définition

Un **alcool** est un composé organique qui possède un **groupe hydroxyle** $(-\mathrm{OH})$ fixé sur un **atome de carbone tétraédrique**. Ce carbone porteur du groupe hydroxyle est appelé **carbone fonctionnel**.

| Écriture | Formule |
|---|---|
| Formule générale | $\mathrm{R-OH}$, où $\mathrm{R}$ est un groupement alkyle |
| Formule brute générale | $\mathrm{C_nH_{2n+2}O}$ avec $n\ge1$ |

> **Le mot-clé : tétraédrique.** Le carbone qui porte le $-\mathrm{OH}$ doit être lié à quatre atomes par des liaisons simples. Si le $-\mathrm{OH}$ était porté par un carbone d’une double liaison ou d’un cycle aromatique, ce ne serait plus un alcool.

## Nomenclature

On nomme un alcool en remplaçant le **« e » final** du nom de l’alcane correspondant par le suffixe **« ol »**, précédé de l’**indice de position** du groupe hydroxyle. Le carbone fonctionnel reçoit le **plus petit indice possible**.

| Formule semi-développée | Nom |
|---|---|
| $\mathrm{CH_3-CH_2-OH}$ | éthanol |
| $\mathrm{CH_3-CH(OH)-CH_3}$ | propan-2-ol |
| $\mathrm{(CH_3)_3C-OH}$ | 2-méthylpropan-2-ol |

> **Erreur fréquente.** On numérote la chaîne **en partant du bout le plus proche du $-\mathrm{OH}$**, jamais de gauche à droite par habitude. « Propan-2-ol » et non « propan-3-ol » : c’est le plus petit indice qui gagne.

> **Astuce mémoire — retrouver la formule brute.** Pour $n$ carbones : $\mathrm{C_nH_{2n+2}O}$. La masse molaire vaut donc $M=14n+18$ (car $12n+2n+2+16$). Cette relation sert directement dans les exercices d’identification.`,
    keyPoint: "Un alcool porte un groupe –OH sur un carbone tétraédrique ; formule générale R–OH, formule brute CₙH₂ₙ₊₂O, nom en « -ol » avec le plus petit indice.",
    example: "$\\mathrm{CH_3-CH(OH)-CH_3}$ se nomme propan-2-ol : trois carbones, groupe $-\\mathrm{OH}$ sur le carbone 2.",
    methodSteps: [
      "Repère le groupe –OH et le carbone qui le porte.",
      "Compte les carbones de la chaîne principale pour trouver l’alcane de référence.",
      "Numérote la chaîne pour donner au carbone fonctionnel le plus petit indice.",
      "Remplace le « e » final par « ol » précédé de cet indice.",
    ],
    interaction: timeline(
      [
        { label: "Repérer le groupe –OH", detail: "C’est le groupe hydroxyle, porté par un carbone tétraédrique appelé carbone fonctionnel." },
        { label: "Compter les carbones", detail: "Le nombre de carbones de la chaîne donne l’alcane de référence : méthane, éthane, propane, butane…" },
        { label: "Numéroter au plus court", detail: "On numérote depuis le bout le plus proche du –OH pour obtenir le plus petit indice." },
        { label: "Nommer en « -ol »", detail: "On remplace le « e » final par « ol » précédé de l’indice : propan-2-ol." },
      ],
      "De la formule au nom",
      "Suis les quatre étapes qui transforment une formule semi-développée en nom officiel.",
      "La formule brute générale CₙH₂ₙ₊₂O donne la masse molaire M = 14n + 18, très utile en exercice.",
    ),
    questions: [
      choice("Un alcool est un composé qui possède…", ["un groupe hydroxyle –OH sur un carbone tétraédrique", "un groupe carbonyle C=O", "un groupe carboxyle –COOH", "une double liaison C=C"], 0, "C’est la définition du cours : le carbone porteur doit être tétraédrique.", "1.1 Définition"),
      short("Donne la formule brute générale d’un alcool à $n$ atomes de carbone.", ["CnH2n+2O", "C_nH_2n+2O", "CnH(2n+2)O"], "La formule générale est $\\mathrm{C_nH_{2n+2}O}$ avec $n\\ge1$.", "1.1 Définition", 2),
      short("Nomme l’alcool $\\mathrm{CH_3-CH_2-OH}$.", ["éthanol", "ethanol"], "Deux carbones (éthane) et un $-\\mathrm{OH}$ : éthanol.", "1.2 Nomenclature"),
      short("Nomme l’alcool $\\mathrm{CH_3-CH(OH)-CH_3}$.", ["propan-2-ol", "propan2ol", "propan 2 ol"], "Trois carbones, groupe $-\\mathrm{OH}$ sur le carbone 2.", "1.2 Nomenclature", 2),
      short("Nomme l’alcool $\\mathrm{(CH_3)_3C-OH}$.", ["2-méthylpropan-2-ol", "2-methylpropan-2-ol"], "Chaîne principale de trois carbones, un méthyle et le $-\\mathrm{OH}$ sur le carbone 2.", "1.2 Nomenclature", 2),
      short("Un alcool a pour masse molaire $M=74$ g·mol⁻¹. Combien a-t-il de carbones ?", ["4", "n=4"], "$14n+18=74$ donne $n=4$.", "Relation M = 14n + 18", 2),
    ],
  },
  {
    id: "alcohol-classes",
    title: "Les trois classes d’alcool",
    summary: "Classer un alcool en primaire, secondaire ou tertiaire selon le carbone fonctionnel.",
    pages: "2",
    section: "2. Les 3 classes d’alcool",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## Le critère de classement

Les alcools se regroupent en trois classes selon le **nombre de groupements alkyle** que porte le **carbone fonctionnel** — celui qui porte le $-\mathrm{OH}$.

| Classe | Groupements alkyle sur le carbone fonctionnel | Atomes d’hydrogène | Écriture |
|---|---|---|---|
| **Primaire** | 1 | 2 | $\mathrm{R-CH_2-OH}$ |
| **Secondaire** | 2 | 1 | $\mathrm{R_1-CH(OH)-R_2}$ |
| **Tertiaire** | 3 | 0 | $\mathrm{R_1R_2R_3C-OH}$ |

> **La règle en une phrase.** Compte les **carbones voisins** du carbone fonctionnel : 1 voisin ⇒ primaire, 2 voisins ⇒ secondaire, 3 voisins ⇒ tertiaire.

> **Le cas particulier du méthanol.** Dans $\mathrm{CH_3-OH}$, le carbone fonctionnel ne porte **aucun** groupement alkyle, seulement trois hydrogènes. Par convention, le méthanol est rangé parmi les alcools **primaires** — c’est ce que retient le document officiel.

## Pourquoi cette classification est décisive

Ce n’est pas un simple étiquetage : **la classe détermine le comportement chimique**. Un alcool primaire, un secondaire et un tertiaire ne donnent pas du tout les mêmes produits d’oxydation. Le niveau 5 y reviendra en détail.

## Les exemples du cours

| Composé | Nom | Classe |
|---|---|---|
| $\mathrm{CH_3-OH}$ | méthanol | primaire |
| $\mathrm{CH_3-CH_2-CH_2-OH}$ | propan-1-ol | primaire |
| $\mathrm{(CH_3)_2CH-CH_2-CH_2-OH}$ | 3-méthylbutan-1-ol | primaire |
| chaîne ramifiée en C6 | 4-éthyl-5-méthylhexan-2-ol | secondaire |
| $\mathrm{CH_3-C(CH_3)(OH)-CH_2-CH_3}$ | 2-méthylbutan-2-ol | tertiaire |`,
    keyPoint: "La classe se lit sur le carbone fonctionnel : 1 groupement alkyle ⇒ primaire, 2 ⇒ secondaire, 3 ⇒ tertiaire.",
    example: "Dans le 2-méthylbutan-2-ol, le carbone porteur du $-\\mathrm{OH}$ est entouré de trois carbones : l’alcool est tertiaire.",
    methodSteps: [
      "Repère le carbone fonctionnel, celui qui porte le groupe –OH.",
      "Compte les carbones directement liés à lui.",
      "1 carbone voisin donne un alcool primaire, 2 un secondaire, 3 un tertiaire.",
      "Vérifie avec le nombre d’hydrogènes restants : 2, 1 puis 0.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les trois classes d’alcool",
      instruction: "Sélectionne une classe pour voir sa structure, son nombre de voisins et un exemple.",
      observation: "Tout se joue sur le carbone fonctionnel : plus il porte de groupements alkyle, plus la classe est élevée — et plus son comportement à l’oxydation change.",
      rootLabel: "Carbone fonctionnel porteur du groupe –OH",
      rootDetail: "Combien de groupements alkyle porte-t-il ?",
      nodes: [
        { id: "primaire", label: "Alcool primaire", role: "1 groupement alkyle", detail: "Structure R–CH₂–OH : le carbone fonctionnel porte un seul carbone voisin et deux atomes d’hydrogène. Exemples : méthanol, propan-1-ol, 3-méthylbutan-1-ol. C’est la seule classe qui peut aller jusqu’à l’acide carboxylique par oxydation." },
        { id: "secondaire", label: "Alcool secondaire", role: "2 groupements alkyle", detail: "Structure R₁–CH(OH)–R₂ : le carbone fonctionnel porte deux carbones voisins et un seul hydrogène. Exemples : propan-2-ol, 4-éthyl-5-méthylhexan-2-ol. Son oxydation ménagée donne une cétone, et s’arrête là." },
        { id: "tertiaire", label: "Alcool tertiaire", role: "3 groupements alkyle", detail: "Structure R₁R₂R₃C–OH : le carbone fonctionnel porte trois carbones voisins et aucun hydrogène. Exemples : 2-méthylpropan-2-ol, 2-méthylbutan-2-ol. Sans hydrogène sur le carbone fonctionnel, il n’est pas oxydable en oxydation ménagée." },
      ],
    },
    questions: [
      choice("Le classement d’un alcool dépend…", ["du nombre de groupements alkyle portés par le carbone fonctionnel", "du nombre total de carbones", "de la masse molaire", "de la présence d’une double liaison"], 0, "C’est le critère du cours.", "2. Les 3 classes"),
      choice("Quelle est la classe du propan-1-ol $\\mathrm{CH_3-CH_2-CH_2-OH}$ ?", ["primaire", "secondaire", "tertiaire"], 0, "Le carbone fonctionnel n’a qu’un seul carbone voisin.", "Exercice d’application 1 - B"),
      choice("Quelle est la classe du 4-éthyl-5-méthylhexan-2-ol ?", ["secondaire", "primaire", "tertiaire"], 0, "Le $-\\mathrm{OH}$ est sur le carbone 2, entouré de deux carbones.", "Exercice d’application 1 - D", 2),
      choice("Quelle est la classe du 2-méthylbutan-2-ol ?", ["tertiaire", "primaire", "secondaire"], 0, "Le carbone fonctionnel porte trois groupements alkyle.", "Exercice d’application 1 - E", 2),
      short("Nomme l’alcool $\\mathrm{CH_3-CH_2-CH_2-OH}$.", ["propan-1-ol", "propan1ol"], "Trois carbones, $-\\mathrm{OH}$ en bout de chaîne.", "Exercice d’application 1 - B"),
      choice("Un alcool tertiaire possède, sur son carbone fonctionnel…", ["aucun atome d’hydrogène", "un atome d’hydrogène", "deux atomes d’hydrogène"], 0, "Trois alkyles plus le $-\\mathrm{OH}$ saturent les quatre liaisons.", "2. Les 3 classes", 2),
    ],
  },
  {
    id: "alcohol-preparation",
    title: "Préparer un alcool : fermentation et hydratation",
    summary: "Obtenir un alcool par fermentation des jus sucrés ou par hydratation d’un alcène, avec la règle de Markovnikov.",
    pages: "2-3",
    section: "3. Méthodes de préparation des alcools",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## 3.1 Par fermentation des jus sucrés

La fermentation du glucose en présence d’**enzymes** (levures) donne l’éthanol :

$$\mathrm{C_6H_{12}O_6}\ \longrightarrow\ 2\,\mathrm{C_2H_5OH}+2\,\mathrm{CO_2}$$

| Sucres **fermentescibles** | Sucres **non fermentescibles** |
|---|---|
| glucose, saccharose, fructose | lactose (du lait), amidon, sorbitol |

Un sucre **fermentescible** peut fermenter sous l’action des levures et donc produire de l’alcool ; un sucre **non fermentescible** en est incapable.

## 3.2 Par hydratation des alcènes

L’addition d’eau sur une double liaison carbone-carbone conduit à un alcool :

$$\mathrm{C{=}C}+\mathrm{H_2O}\ \longrightarrow\ \text{alcool}$$

### La règle de Markovnikov

> Lors de l’addition d’un composé du type $\mathrm{H-X}$ sur une double liaison carbone-carbone, l’atome d’**hydrogène** s’attache à l’atome de carbone de la double liaison qui porte **le plus d’atomes d’hydrogène**.

Pour l’eau, on écrit $\mathrm{H-X}$ avec $\mathrm{X}=\mathrm{OH}$ : l’hydrogène va sur le carbone le plus hydrogéné, donc le $-\mathrm{OH}$ va sur **l’autre**.

### Exemple guidé — l’hydratation du propène

$\mathrm{CH_2{=}CH-CH_3}$ : le carbone de gauche porte 2 hydrogènes, celui du milieu n’en porte qu’un. L’hydrogène ajouté va donc à gauche, et le $-\mathrm{OH}$ au milieu :

$$\mathrm{CH_2{=}CH-CH_3}+\mathrm{H_2O}\ \longrightarrow\ \mathrm{CH_3-CH(OH)-CH_3}$$

Le produit **majoritaire** est le **propan-2-ol**.

> **Astuce mémoire.** « Les riches deviennent plus riches » : le carbone déjà riche en hydrogènes en reçoit un de plus. Le groupe $-\mathrm{OH}$, lui, se fixe sur le carbone le plus substitué.`,
    keyPoint: "Fermentation : glucose → éthanol + CO₂. Hydratation d’un alcène : l’hydrogène va sur le carbone le plus hydrogéné (règle de Markovnikov).",
    example: "L’hydratation du propène donne majoritairement le propan-2-ol, car le $-\\mathrm{OH}$ se fixe sur le carbone central.",
    methodSteps: [
      "Pour une fermentation, pars du sucre et vérifie qu’il est fermentescible.",
      "Pour une hydratation, repère les deux carbones de la double liaison.",
      "Compte les hydrogènes portés par chacun de ces deux carbones.",
      "Place l’hydrogène sur le plus hydrogéné et le –OH sur l’autre : c’est le produit majoritaire.",
    ],
    corrections: [
      "Le document écrit la fermentation « C₆H₁₂O₆ → C₂H₅OH + CO₂ », sans les coefficients. L’équation équilibrée est C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂ : une molécule de glucose donne deux molécules d’éthanol et deux de dioxyde de carbone.",
    ],
    interaction: timeline(
      [
        { label: "Fermentation", shortLabel: "Fermentation", detail: "Le glucose, en présence de levures, donne de l’éthanol et du dioxyde de carbone : C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂." },
        { label: "Sucres fermentescibles", shortLabel: "Sucres", detail: "Glucose, saccharose et fructose fermentent. Le lactose, l’amidon et le sorbitol ne fermentent pas." },
        { label: "Hydratation d’un alcène", shortLabel: "Hydratation", detail: "On additionne H–OH sur la double liaison C=C pour obtenir un alcool." },
        { label: "Règle de Markovnikov", shortLabel: "Markovnikov", detail: "L’hydrogène se fixe sur le carbone de la double liaison qui porte déjà le plus d’hydrogènes ; le –OH va sur l’autre." },
      ],
      "Deux voies vers un alcool",
      "Compare la voie biologique (fermentation) et la voie chimique (hydratation).",
      "La règle de Markovnikov décide lequel des deux carbones reçoit le groupe –OH : c’est elle qui donne le produit majoritaire.",
    ),
    questions: [
      short("Écris le produit alcoolique de la fermentation du glucose (nom).", ["éthanol", "ethanol"], "La fermentation du glucose donne de l’éthanol et du CO₂.", "3.1 Fermentation"),
      choice("Parmi ces sucres, lequel n’est **pas** fermentescible ?", ["le lactose", "le glucose", "le saccharose", "le fructose"], 0, "Le lactose du lait, l’amidon et le sorbitol ne fermentent pas.", "3.1 Fermentation", 2),
      choice("Selon la règle de Markovnikov, lors de l’addition de H–X sur une double liaison, l’hydrogène se fixe…", ["sur le carbone qui porte le plus d’hydrogènes", "sur le carbone qui porte le moins d’hydrogènes", "indifféremment sur l’un des deux"], 0, "C’est l’énoncé exact de la règle.", "3.2 Markovnikov", 2),
      short("Nomme le produit majoritaire de l’hydratation du propène.", ["propan-2-ol", "propan2ol"], "L’hydrogène va sur le carbone le plus hydrogéné, le $-\\mathrm{OH}$ sur le carbone central.", "Exercice d’application 2", 2),
      short("Nomme le produit de l’hydratation du but-2-ène en milieu sulfurique.", ["butan-2-ol", "butan2ol"], "L’addition d’eau sur la double liaison centrale donne le butan-2-ol.", "Exercice 2 - question 1", 2),
      choice("Combien de molécules d’éthanol produit une molécule de glucose ?", ["2", "1", "3", "6"], 0, "L’équation équilibrée est C₆H₁₂O₆ → 2 C₂H₅OH + 2 CO₂.", "3.1 Fermentation (équation équilibrée)", 2),
    ],
  },
  {
    id: "sodium-dehydration-combustion",
    title: "Sodium, déshydratation et combustion",
    summary: "Écrire les réactions de l’alcool avec le sodium, ses deux déshydratations et sa combustion.",
    pages: "3",
    section: "4.1 à 4.3. Propriétés chimiques des alcools",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## 4.1 Réaction avec le sodium

L’alcool réagit avec le sodium pour donner un **ion alcoolate** et du dihydrogène :

$$\mathrm{R-OH}+\mathrm{Na}\ \longrightarrow\ \mathrm{RO^-}+\mathrm{Na^+}+\tfrac12\,\mathrm{H_2}$$

## 4.2 Déshydratation d’un alcool

Deux déshydratations différentes, selon les conditions :

| Type | Produit | Conditions |
|---|---|---|
| **Intramoléculaire** | un **alcène** | milieu acide sulfurique, ou alumine $\mathrm{Al_2O_3}$ |
| **Intermoléculaire** | un **éther-oxyde** | $\mathrm{R-OH}+\mathrm{R'-OH}\rightarrow \mathrm{R-O-R'}+\mathrm{H_2O}$ |

> **Comment les distinguer ?** *Intra* = **une seule** molécule d’alcool perd son eau et forme une double liaison. *Inter* = **deux** molécules se soudent par un pont oxygène en libérant une molécule d’eau. Le préfixe dit tout : intra = à l’intérieur, inter = entre deux.

## 4.3 Combustion des alcools

$$\mathrm{C_nH_{2n+1}OH}+\tfrac{3n}{2}\,\mathrm{O_2}\ \longrightarrow\ n\,\mathrm{CO_2}+(n+1)\,\mathrm{H_2O}$$

## Les produits de l’éthanol, selon la réaction

| Réaction | Produit obtenu |
|---|---|
| Action du sodium | éthanolate de sodium et dihydrogène |
| Déshydratation intramoléculaire (alumine) | éthylène (éthène) |
| Déshydratation intermoléculaire | oxyde de diéthyle |
| Combustion complète | dioxyde de carbone et eau |`,
    keyPoint: "Sodium ⇒ alcoolate + ½H₂ ; déshydratation intra ⇒ alcène ; inter ⇒ éther-oxyde ; combustion ⇒ CO₂ + H₂O.",
    example: "La déshydratation intermoléculaire de l’éthanol donne l’oxyde de diéthyle $\\mathrm{C_2H_5-O-C_2H_5}$.",
    methodSteps: [
      "Identifie la réaction demandée d’après le réactif et les conditions.",
      "Pour le sodium, écris la formation de l’alcoolate et du dihydrogène.",
      "Pour une déshydratation, demande-toi si une ou deux molécules d’alcool sont engagées.",
      "Équilibre enfin en atomes et en charges.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Que devient un alcool selon le réactif ?",
      instruction: "Sélectionne une réaction pour découvrir son produit et ses conditions.",
      observation: "Un même alcool donne quatre produits très différents : tout dépend du réactif et des conditions. C’est le réflexe à acquérir avant d’écrire une équation-bilan.",
      rootLabel: "Alcool R–OH",
      rootDetail: "Quel réactif, quelles conditions ?",
      nodes: [
        { id: "sodium", label: "Action du sodium", role: "→ alcoolate + ½ H₂", detail: "R–OH + Na → RO⁻ + Na⁺ + ½ H₂. Le sodium arrache l’hydrogène du groupe hydroxyle et forme l’ion alcoolate, accompagné d’un dégagement de dihydrogène. Avec l’éthanol, on obtient l’éthanolate de sodium." },
        { id: "intra", label: "Déshydratation intramoléculaire", role: "→ alcène", detail: "Une seule molécule d’alcool perd une molécule d’eau et forme une double liaison C=C. Conditions : milieu acide sulfurique, ou passage sur l’alumine Al₂O₃. L’éthanol donne l’éthylène." },
        { id: "inter", label: "Déshydratation intermoléculaire", role: "→ éther-oxyde", detail: "Deux molécules d’alcool se soudent par un atome d’oxygène : R–OH + R'–OH → R–O–R' + H₂O. L’éthanol donne l’oxyde de diéthyle." },
        { id: "combustion", label: "Combustion", role: "→ CO₂ + H₂O", detail: "CₙH₂ₙ₊₁OH + (3n/2) O₂ → n CO₂ + (n+1) H₂O. La combustion complète détruit la chaîne carbonée et ne laisse que du dioxyde de carbone et de l’eau." },
      ],
    },
    questions: [
      short("Nomme le produit organique de l’action du sodium sur l’éthanol.", ["éthanolate de sodium", "ethanolate de sodium", "éthanolate"], "Le sodium donne l’ion alcoolate correspondant.", "Exercice 2 - question 1", 2),
      short("Nomme le produit de la déshydratation intramoléculaire de l’éthanol sur alumine.", ["éthylène", "ethylene", "éthène", "ethene"], "Une seule molécule perd son eau et forme une double liaison.", "Exercice 2 - question 1", 2),
      short("Nomme le produit de la déshydratation intermoléculaire de l’éthanol.", ["oxyde de diéthyle", "oxyde de diethyle", "éther diéthylique"], "Deux molécules se soudent par un pont oxygène.", "Exercice 2 - question 1", 2),
      choice("La déshydratation **intramoléculaire** d’un alcool conduit à…", ["un alcène", "un éther-oxyde", "un aldéhyde", "un acide carboxylique"], 0, "Une seule molécule perd de l’eau et forme une double liaison.", "4.2 Déshydratation"),
      choice("Quel gaz se dégage lors de l’action du sodium sur un alcool ?", ["le dihydrogène H₂", "le dioxygène O₂", "le dioxyde de carbone CO₂", "le méthane CH₄"], 0, "La réaction libère ½ H₂ par molécule d’alcool.", "4.1 Réaction avec le sodium"),
      short("Dans la combustion de $\\mathrm{C_nH_{2n+1}OH}$, combien de molécules d’eau se forment ?", ["n+1", "(n+1)"], "L’équation donne n CO₂ et (n+1) H₂O.", "4.3 Combustion", 2),
    ],
  },
  {
    id: "mild-oxidation",
    title: "L’oxydation ménagée selon la classe",
    summary: "Prévoir le produit d’oxydation d’un alcool selon sa classe et la quantité d’oxydant.",
    pages: "3-4",
    section: "4.4. Oxydation ménagée des alcools",
    durationMinutes: 22,
    xp: 75,
    kind: "practice",
    body: String.raw`## Le tableau à connaître par cœur

C’est **le** point central de la leçon : le produit d’une oxydation ménagée dépend de **la classe de l’alcool** et, pour les primaires, de **la quantité d’oxydant**.

| Classe | Oxydant en **défaut** | Oxydant en **excès** |
|---|---|---|
| **Primaire** | **aldéhyde** $\mathrm{R-CHO}$ | **acide carboxylique** $\mathrm{R-COOH}$ |
| **Secondaire** | **cétone** $\mathrm{R_1-CO-R_2}$ | cétone (pas d’oxydation plus poussée) |
| **Tertiaire** | **non oxydable** | **non oxydable** |

## Pourquoi les tertiaires résistent

L’oxydation ménagée consiste à **arracher des hydrogènes portés par le carbone fonctionnel**. Un alcool tertiaire n’en possède **aucun** sur ce carbone : il n’y a rien à arracher, donc pas de réaction. C’est la même logique qui explique que le secondaire, avec un seul hydrogène, s’arrête à la cétone.

$$\mathrm{R-CH_2-OH}\ \xrightarrow{\text{oxydation}}\ \mathrm{R-CHO}\ \xrightarrow{\text{oxydation}}\ \mathrm{R-COOH}$$

## Reconnaître les produits au laboratoire

- Un **acide carboxylique** fait virer le **bleu de bromothymol au jaune** (milieu acide) ;
- un **aldéhyde** réagit positivement avec la **liqueur de Fehling** ; une cétone, non.

> **Le raisonnement inverse, très fréquent en examen.** Si l’oxydation d’un alcool donne un produit qui réagit à la liqueur de Fehling, c’est un aldéhyde, donc l’alcool était **primaire**. S’il fait virer le BBT au jaune, c’est un acide, donc l’alcool était **primaire** et l’oxydant en **excès**.`,
    keyPoint: "Primaire ⇒ aldéhyde (défaut) puis acide carboxylique (excès) ; secondaire ⇒ cétone ; tertiaire ⇒ non oxydable.",
    example: "L’oxydation ménagée du propan-2-ol (secondaire) donne la propanone $\\mathrm{CH_3-CO-CH_3}$.",
    methodSteps: [
      "Détermine d’abord la classe de l’alcool.",
      "Si l’alcool est tertiaire, conclus immédiatement : pas de réaction.",
      "Si l’alcool est secondaire, le produit est une cétone.",
      "Si l’alcool est primaire, regarde la quantité d’oxydant : défaut donne un aldéhyde, excès un acide carboxylique.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "L’échelle d’oxydation des alcools",
      instruction: "Sélectionne une classe pour voir jusqu’où son oxydation peut aller.",
      observation: "Tout dépend du nombre d’hydrogènes sur le carbone fonctionnel : 2 pour un primaire (deux étapes possibles), 1 pour un secondaire (une seule), 0 pour un tertiaire (aucune).",
      rootLabel: "Oxydation ménagée d’un alcool",
      rootDetail: "Quelle classe, et quelle quantité d’oxydant ?",
      nodes: [
        { id: "primaire-defaut", group: "Alcool primaire", label: "Oxydant en défaut", role: "→ aldéhyde R–CHO", detail: "L’alcool primaire perd deux hydrogènes et donne un aldéhyde. Exemple : l’éthanol donne l’éthanal CH₃–CHO. L’aldéhyde réagit positivement avec la liqueur de Fehling, ce qui permet de l’identifier." },
        { id: "primaire-exces", group: "Alcool primaire", label: "Oxydant en excès", role: "→ acide carboxylique R–COOH", detail: "L’oxydation se poursuit au-delà de l’aldéhyde jusqu’à l’acide carboxylique. Exemple : l’éthanol donne l’acide éthanoïque CH₃–COOH, qui fait virer le bleu de bromothymol au jaune." },
        { id: "secondaire", group: "Autres classes", label: "Alcool secondaire", role: "→ cétone", detail: "Le carbone fonctionnel ne porte qu’un seul hydrogène : l’oxydation s’arrête à la cétone R₁–CO–R₂, même avec un excès d’oxydant. Exemple : le propan-2-ol donne la propanone CH₃–CO–CH₃. Une cétone ne réagit pas avec la liqueur de Fehling." },
        { id: "tertiaire", group: "Autres classes", label: "Alcool tertiaire", role: "→ aucune réaction", detail: "Le carbone fonctionnel ne porte aucun hydrogène : il n’y a rien à arracher. Les alcools tertiaires ne sont pas oxydables en oxydation ménagée, quelle que soit la quantité d’oxydant." },
      ],
    },
    questions: [
      choice("L’oxydation ménagée d’un alcool primaire par un oxydant **en défaut** donne…", ["un aldéhyde", "un acide carboxylique", "une cétone", "aucun produit"], 0, "En défaut, l’oxydation s’arrête à l’aldéhyde.", "4.4.1 Alcools primaires"),
      choice("L’oxydation ménagée d’un alcool primaire par un oxydant **en excès** donne…", ["un acide carboxylique", "un aldéhyde", "une cétone", "un alcène"], 0, "L’excès pousse l’oxydation jusqu’à l’acide.", "4.4.1 Alcools primaires", 2),
      choice("L’oxydation ménagée d’un alcool secondaire donne…", ["une cétone", "un aldéhyde", "un acide carboxylique", "aucun produit"], 0, "Un seul hydrogène sur le carbone fonctionnel : la cétone est le terme final.", "4.4.2 Alcools secondaires"),
      choice("Les alcools tertiaires en oxydation ménagée sont…", ["non oxydables", "oxydés en cétone", "oxydés en aldéhyde", "oxydés en acide"], 0, "Aucun hydrogène sur le carbone fonctionnel.", "4.4.3 Alcools tertiaires", 2),
      short("Nomme le produit de l’oxydation ménagée du propan-1-ol par le permanganate acidifié **en défaut**.", ["propanal"], "Alcool primaire + oxydant en défaut donne l’aldéhyde correspondant.", "Exercice 2 - question 2", 2),
      short("Nomme le produit de l’oxydation ménagée du propan-2-ol par le dichromate acidifié **en excès**.", ["propanone", "la propanone", "acétone"], "Le propan-2-ol est secondaire : le produit est la propanone, même en excès.", "Exercice 2 - question 2", 2),
      choice("Un produit d’oxydation réagit positivement avec la liqueur de Fehling. L’alcool de départ était…", ["primaire, avec un oxydant en défaut", "secondaire", "tertiaire", "primaire, avec un oxydant en excès"], 0, "La liqueur de Fehling caractérise un aldéhyde, donc un alcool primaire oxydé en défaut.", "Application : Exercice 4", 2),
    ],
  },
  {
    id: "redox-equations-polyols",
    title: "Écrire les équations-bilans d’oxydoréduction, et les polyols",
    summary: "Combiner les demi-équations pour équilibrer une oxydation, puis découvrir les polyols.",
    pages: "4-5",
    section: "4.4.4. Équations-bilans et 1.5. Les polyols",
    durationMinutes: 24,
    xp: 80,
    body: String.raw`## La méthode des demi-équations

Une oxydation ménagée en milieu acide est une réaction d’**oxydoréduction**. On écrit les deux demi-équations, on les multiplie pour égaliser les électrons, puis on additionne.

### Éthanol oxydé par le dichromate **en défaut** → éthanal

$$3\times\left(\mathrm{CH_3-CH_2-OH}\ \rightleftarrows\ \mathrm{CH_3CHO}+2\mathrm{H^+}+2e^-\right)$$
$$\mathrm{Cr_2O_7^{2-}}+14\mathrm{H^+}+6e^-\ \rightleftarrows\ 2\mathrm{Cr^{3+}}+7\mathrm{H_2O}$$

$$3\,\mathrm{CH_3-CH_2-OH}+\mathrm{Cr_2O_7^{2-}}+8\mathrm{H^+}\ \longrightarrow\ 3\,\mathrm{CH_3CHO}+2\mathrm{Cr^{3+}}+7\mathrm{H_2O}$$

En notation avec l’ion hydronium : $3\,\mathrm{CH_3-CH_2-OH}+\mathrm{Cr_2O_7^{2-}}+8\mathrm{H_3O^+}\rightarrow 3\,\mathrm{CH_3CHO}+2\mathrm{Cr^{3+}}+15\mathrm{H_2O}$.

### Éthanol oxydé par le dichromate **en excès** → acide éthanoïque

$$3\,\mathrm{CH_3-CH_2-OH}+2\,\mathrm{Cr_2O_7^{2-}}+16\mathrm{H^+}\ \longrightarrow\ 3\,\mathrm{CH_3COOH}+4\mathrm{Cr^{3+}}+11\mathrm{H_2O}$$

### Propan-2-ol oxydé par le dichromate → propanone

$$3\,\mathrm{CH_3-CHOH-CH_3}+\mathrm{Cr_2O_7^{2-}}+8\mathrm{H^+}\ \longrightarrow\ 3\,\mathrm{CH_3-CO-CH_3}+2\mathrm{Cr^{3+}}+7\mathrm{H_2O}$$

> **Vérifie toujours deux choses.** Les **atomes** de chaque élément doivent être en nombre égal des deux côtés, et la **charge totale** aussi. Une équation équilibrée en atomes mais pas en charges est fausse.

## Les polyols

Les **polyols** (ou polyalcools) sont des alcools possédant **plusieurs groupes hydroxyle** dans leur structure.

| Nom | Formule semi-développée |
|---|---|
| Le **glycol** (éthane-1,2-diol) | $\mathrm{HO-CH_2-CH_2-OH}$ |
| Le **glycérol** | $\mathrm{HO-CH_2-CH(OH)-CH_2-OH}$ |

### Préparation du glycol, en deux étapes

**1.** Oxydation de l’éthylène par le dioxygène de l’air, sur catalyseur à l’argent, pour obtenir l’**oxyde d’éthylène** :
$$\mathrm{CH_2{=}CH_2}+\tfrac12\,\mathrm{O_2}\ \longrightarrow\ \text{oxyde d'éthylène}$$

**2.** Hydratation de l’oxyde d’éthylène pour obtenir le glycol :
$$\text{oxyde d'éthylène}+\mathrm{H_2O}\ \longrightarrow\ \mathrm{HO-CH_2-CH_2-OH}$$`,
    keyPoint: "On écrit les demi-équations, on égalise les électrons, on additionne, puis on vérifie atomes ET charges. Un polyol porte plusieurs groupes –OH.",
    example: "$3\\,\\mathrm{CH_3CH_2OH}+\\mathrm{Cr_2O_7^{2-}}+8\\mathrm{H^+}\\rightarrow 3\\,\\mathrm{CH_3CHO}+2\\mathrm{Cr^{3+}}+7\\mathrm{H_2O}$.",
    methodSteps: [
      "Écris la demi-équation de l’alcool, en précisant le produit selon la classe et la quantité d’oxydant.",
      "Écris la demi-équation de l’oxydant (dichromate ou permanganate).",
      "Multiplie chaque demi-équation pour que les électrons s’annulent.",
      "Additionne, puis vérifie l’équilibre des atomes et des charges.",
    ],
    corrections: [
      "Dans l’équation-bilan de l’oxydation de l’éthanol par le dichromate en excès, le document écrit « → 3 CH₃CHO » (l’aldéhyde). Le produit correct en excès est l’acide éthanoïque : « → 3 CH₃COOH ». La version du document écrite avec l’ion hydronium donne d’ailleurs bien CH₃COOH, ce qui confirme la coquille.",
    ],
    interaction: timeline(
      [
        { label: "Demi-équation de l’alcool", shortLabel: "Alcool", detail: "L’alcool cède des électrons : CH₃–CH₂–OH ⇄ CH₃CHO + 2H⁺ + 2e⁻ pour aller jusqu’à l’aldéhyde." },
        { label: "Demi-équation de l’oxydant", shortLabel: "Oxydant", detail: "Le dichromate capte 6 électrons : Cr₂O₇²⁻ + 14H⁺ + 6e⁻ ⇄ 2Cr³⁺ + 7H₂O." },
        { label: "Égaliser les électrons", shortLabel: "Égaliser", detail: "On multiplie la demi-équation de l’alcool par 3 pour obtenir 6 électrons de chaque côté." },
        { label: "Additionner et vérifier", shortLabel: "Vérifier", detail: "On additionne les deux demi-équations, puis on contrôle l’équilibre des atomes et des charges." },
        { label: "Les polyols", shortLabel: "Polyols", detail: "Le glycol HO–CH₂–CH₂–OH et le glycérol portent plusieurs groupes hydroxyle." },
      ],
      "Construire une équation-bilan",
      "Suis les quatre étapes de la méthode, puis découvre les polyols.",
      "Une équation n’est juste que si les atomes ET les charges s’équilibrent des deux côtés.",
    ),
    questions: [
      short("Dans la demi-équation du dichromate, combien d’électrons sont captés ?", ["6", "6 e-", "6e-"], "$\\mathrm{Cr_2O_7^{2-}}+14\\mathrm{H^+}+6e^-\\rightleftarrows 2\\mathrm{Cr^{3+}}+7\\mathrm{H_2O}$.", "4.4.4 Équations-bilans", 2),
      short("Par quel coefficient multiplie-t-on la demi-équation de l’éthanol pour l’équilibrer avec le dichromate ?", ["3"], "L’éthanol cède 2 électrons, le dichromate en capte 6 : il faut multiplier par 3.", "4.4.4 Équations-bilans", 2),
      choice("L’oxydation de l’éthanol par le dichromate **en excès** produit…", ["l’acide éthanoïque CH₃COOH", "l’éthanal CH₃CHO", "la propanone", "l’éthylène"], 0, "En excès, l’oxydation va jusqu’à l’acide carboxylique.", "4.4.4 (coquille du document corrigée)", 3),
      short("Nomme le produit de l’oxydation du propan-2-ol par le dichromate.", ["propanone", "la propanone"], "Le propan-2-ol est secondaire : il donne la propanone.", "4.4.4 Équations-bilans"),
      short("Combien de groupes hydroxyle porte le glycérol ?", ["3", "trois"], "$\\mathrm{HO-CH_2-CH(OH)-CH_2-OH}$ porte trois groupes $-\\mathrm{OH}$.", "1.5 Les polyols", 2),
      short("Donne le nom systématique du glycol.", ["éthane-1,2-diol", "ethane-1,2-diol"], "Deux carbones et deux groupes $-\\mathrm{OH}$ en positions 1 et 2.", "1.5 Les polyols", 2),
      choice("La première étape de préparation du glycol consiste à…", ["oxyder l’éthylène en oxyde d’éthylène", "hydrater directement l’éthylène", "faire fermenter du glucose", "déshydrater l’éthanol"], 0, "On oxyde d’abord l’éthylène, puis on hydrate l’oxyde d’éthylène.", "1.5 Préparation du glycol", 2),
    ],
  },
  {
    id: "unknown-alcohol-mission",
    title: "Mission finale : identifier un alcool inconnu",
    summary: "Mobiliser masse molaire, isomérie, classe et oxydation pour identifier un alcool et écrire son équation-bilan.",
    pages: "5-9",
    section: "Situation d’évaluation et exercices",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

Un groupe d’élèves dispose d’un flacon contenant un **alcool A** de masse molaire $M=74$ g·mol⁻¹. Ils réalisent son **oxydation ménagée par une solution acidifiée de permanganate de potassium en excès** et obtiennent un composé **B** qui fait **virer le bleu de bromothymol au jaune** et dont la **chaîne carbonée est ramifiée**.

## Le raisonnement, étape par étape

**1. Que nous apprend le composé B ?** Le BBT vire au jaune en milieu acide : **B est un acide carboxylique**. Or seul un **alcool primaire** peut être oxydé jusqu’à l’acide. Donc **A est primaire**.

**2. La formule brute.** Un alcool a pour formule $\mathrm{C_nH_{2n+2}O}$, soit $M=14n+18$ :

$$14n+18=74\ \Longrightarrow\ n=4\ \Longrightarrow\ \boxed{\mathrm{C_4H_{10}O}}$$

**3. Les isomères de $\mathrm{C_4H_{10}O}$.**

| Formule semi-développée | Nom | Classe |
|---|---|---|
| $\mathrm{CH_3-CH_2-CH_2-CH_2-OH}$ | butan-1-ol | primaire |
| $\mathrm{CH_3-CH(OH)-CH_2-CH_3}$ | butan-2-ol | secondaire |
| $\mathrm{(CH_3)_2CH-CH_2-OH}$ | 2-méthylpropan-1-ol | primaire |
| $\mathrm{(CH_3)_3C-OH}$ | 2-méthylpropan-2-ol | tertiaire |

**4. Le tri final.** A est **primaire** : restent le butan-1-ol et le 2-méthylpropan-1-ol. Mais B a une **chaîne ramifiée** : seul le **2-méthylpropan-1-ol** convient.

$$\mathrm{A}=\mathrm{(CH_3)_2CH-CH_2-OH}\quad\text{(2-méthylpropan-1-ol)}$$
$$\mathrm{B}=\mathrm{(CH_3)_2CH-COOH}\quad\text{(acide 2-méthylpropanoïque)}$$

**5. L’équation-bilan** de l’oxydation par l’ion permanganate :

$$5\,\mathrm{(CH_3)_2CH{-}CH_2{-}OH}+4\,\mathrm{MnO_4^-}+12\,\mathrm{H_3O^+}\ \longrightarrow\ 5\,\mathrm{(CH_3)_2CH{-}COOH}+4\,\mathrm{Mn^{2+}}+23\,\mathrm{H_2O}$$

> **La démarche à retenir.** Trois indices se combinent : le **test chimique** donne la fonction et donc la classe, la **masse molaire** donne la formule brute, la **ramification** tranche entre les isomères restants. Aucun indice n’est décoratif.

## Une autre voie d’identification : le pourcentage massique

Pour un alcool saturé contenant $21{,}62\,\%$ d’oxygène en masse :

$$M=\frac{16\times100}{\%\mathrm{O}}=\frac{1600}{21{,}62}=74\ \text{g·mol}^{-1}\ \Longrightarrow\ \mathrm{C_4H_{10}O}$$`,
    keyPoint: "Test chimique ⇒ fonction et classe ; masse molaire ⇒ formule brute (M = 14n + 18) ; ramification ⇒ choix de l’isomère.",
    example: "$M=74$ donne $n=4$ ; B acide et ramifié impose A = 2-méthylpropan-1-ol.",
    methodSteps: [
      "Exploite le test chimique pour identifier la fonction du produit et en déduire la classe de l’alcool.",
      "Utilise M = 14n + 18 pour trouver la formule brute.",
      "Écris tous les isomères possibles avec leur nom et leur classe.",
      "Élimine avec les indices restants (classe, ramification), puis écris l’équation-bilan.",
    ],
    interaction: timeline(
      [
        { label: "Lire le test chimique", shortLabel: "Test", detail: "Le BBT vire au jaune : B est un acide carboxylique. Seul un alcool primaire peut être oxydé jusqu’à l’acide." },
        { label: "Calculer la formule brute", shortLabel: "Formule", detail: "M = 14n + 18 = 74 donne n = 4, soit C₄H₁₀O." },
        { label: "Lister les isomères", shortLabel: "Isomères", detail: "Butan-1-ol (primaire), butan-2-ol (secondaire), 2-méthylpropan-1-ol (primaire), 2-méthylpropan-2-ol (tertiaire)." },
        { label: "Trancher avec la ramification", shortLabel: "Trancher", detail: "A est primaire et B ramifié : seul le 2-méthylpropan-1-ol convient." },
        { label: "Écrire l’équation-bilan", shortLabel: "Équation", detail: "5 (CH₃)₂CH–CH₂–OH + 4 MnO₄⁻ + 12 H₃O⁺ → 5 (CH₃)₂CH–COOH + 4 Mn²⁺ + 23 H₂O." },
      ],
      "Identifier un alcool inconnu",
      "Suis les cinq étapes du raisonnement, du test chimique à l’équation-bilan.",
      "Chaque indice de l’énoncé sert à éliminer des candidats : c’est une enquête, pas une récitation.",
    ),
    questions: [
      choice("Le composé B fait virer le bleu de bromothymol au jaune. B est donc…", ["un acide carboxylique", "un aldéhyde", "une cétone", "un alcène"], 0, "Le virage au jaune du BBT caractérise un milieu acide.", "Situation d’évaluation - question 1.1", 2),
      choice("Puisque B est un acide carboxylique, la classe de l’alcool A est…", ["primaire", "secondaire", "tertiaire"], 0, "Seul un alcool primaire s’oxyde jusqu’à l’acide carboxylique.", "Situation d’évaluation - question 1.2", 2),
      short("Vérifie la formule brute de A à partir de $M=74$ g·mol⁻¹.", ["C4H10O", "C_4H_10O"], "$14n+18=74$ donne $n=4$.", "Situation d’évaluation - question 2", 3),
      short("Combien d’isomères alcools possède la formule $\\mathrm{C_4H_{10}O}$ ?", ["4", "quatre"], "Butan-1-ol, butan-2-ol, 2-méthylpropan-1-ol et 2-méthylpropan-2-ol.", "Situation d’évaluation - question 3.1", 2),
      short("Donne le nom de l’alcool A.", ["2-méthylpropan-1-ol", "2-methylpropan-1-ol"], "A est primaire et sa chaîne est ramifiée.", "Situation d’évaluation - question 4.2", 3),
      short("Donne le nom du composé B.", ["acide 2-méthylpropanoïque", "acide 2-methylpropanoique"], "C’est l’acide carboxylique correspondant à A.", "Situation d’évaluation - question 3.2", 2),
      short("Un alcool saturé contient 21,62 % d’oxygène en masse. Calcule sa masse molaire (en g·mol⁻¹).", ["74"], "$M=\\dfrac{1600}{21{,}62}=74$ g·mol⁻¹.", "Exercice 3 - question 1", 2),
      short("Un composé X contient 85,7 % de carbone et 14,3 % d’hydrogène, avec $M=56$ g·mol⁻¹. Donne sa formule brute.", ["C4H8", "C_4H_8"], "$x=\\dfrac{56\\times85{,}7}{12\\times100}\\approx4$ et $y=\\dfrac{56\\times14{,}3}{100}=8$.", "Exercice 4 - question 2.1", 3),
      choice("Ce composé $\\mathrm{C_4H_8}$ appartient à la famille…", ["des alcènes", "des alcanes", "des alcools", "des acides carboxyliques"], 0, "La formule $\\mathrm{C_nH_{2n}}$ caractérise un alcène.", "Exercice 4 - question 2.2", 2),
      short("L’hydratation du 2-méthylpropène donne majoritairement A. Nomme A.", ["2-méthylpropan-2-ol", "2-methylpropan-2-ol"], "Par la règle de Markovnikov, le $-\\mathrm{OH}$ se fixe sur le carbone le plus substitué.", "Exercice 4 - question 3", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const alcoholsPath: LearningPath = {
  id: "terminale-cd-chemistry-alcohols",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Chimie organique" },
  chapterNumber: 1,
  title: "Les alcools",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître et nommer un alcool, et déterminer sa classe",
    "Préparer un alcool par fermentation ou par hydratation d’un alcène",
    "Prévoir les produits des réactions d’un alcool, dont l’oxydation ménagée",
    "Écrire une équation-bilan d’oxydoréduction et identifier un alcool inconnu",
  ],
  modules: [
    { id: "alcohols-mastery", title: "Maîtriser les alcools", description: "Un niveau après l’autre, de la nomenclature à l’identification d’un alcool inconnu.", lessons: builtLevels },
  ],
};

export const chemistryPaths: LearningPath[] = [alcoholsPath, carbonylCompoundsPath, carboxylicAcidsPath, soapMakingPath, aqueousSolutionsPhPath, strongAcidBasePath, weakAcidBasePath, acidBaseCouplesPath, acidBaseBuffersPath];
