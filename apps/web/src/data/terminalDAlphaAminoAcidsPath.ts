import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L12_Acides alpha aminés.pdf";

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
      introduction: "Applique cette démarche au cours, à la situation d'évaluation et aux exercices officiels.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple du cours", work: seed.example, result: seed.keyPoint },
      tip: "Commence toujours par repérer le carbone α, placé entre le groupe amine et le groupe carboxyle.",
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
    id: "alpha-amino-structure-nomenclature",
    title: "Reconnaître et nommer un acide α-aminé",
    summary: "Identifier le carbone α, la chaîne latérale R et les deux fonctions caractéristiques, puis nommer la glycine, l'alanine et la valine.",
    pages: "1 et 4",
    section: "II. Structure et nomenclature - exercice 2",
    durationMinutes: 23,
    xp: 45,
    body: String.raw`## 1. La structure commune

Un **acide α-aminé** possède sur le **même atome de carbone** :

- une fonction amine $\mathrm{-NH_2}$ ;
- une fonction acide carboxylique $\mathrm{-COOH}$ ;
- un atome d'hydrogène ;
- une chaîne latérale notée $R$.

Sa notation générale est :

$$\boxed{\mathrm{H_2N-CH(R)-COOH}}$$

Le carbone central est appelé **carbone α**, car il est directement voisin du carbone du groupe carboxyle. La partie $R$ distingue les différents acides α-aminés.

> **Astuce mémoire de Davy.** Cherche le motif « amine - carbone α - acide » : $\mathrm{NH_2-CH-COOH}$. Tout ce qui varie est accroché sur le même $\mathrm{CH}$ et s'appelle $R$.

## 2. Les trois exemples du cours

| Chaîne latérale $R$ | Formule semi-développée | Nom systématique | Nom usuel | Abréviation |
|---|---|---|---|---|
| $\mathrm{H}$ | $\mathrm{H_2N-CH_2-COOH}$ | acide 2-aminoéthanoïque | glycine | Gly |
| $\mathrm{CH_3}$ | $\mathrm{CH_3-CH(NH_2)-COOH}$ | acide 2-aminopropanoïque | alanine | Ala |
| $\mathrm{CH(CH_3)_2}$ | $\mathrm{CH_3-CH(CH_3)-CH(NH_2)-COOH}$ | acide 2-amino-3-méthylbutanoïque | valine | Val |

## 3. Construire le nom systématique

1. choisis comme chaîne principale celle qui contient le carbone de $\mathrm{COOH}$ ;
2. ce carbone porte le numéro 1 ;
3. transforme le nom de l'acide carboxylique en gardant son suffixe **-oïque** ;
4. indique le groupe $\mathrm{NH_2}$ par le préfixe **amino-** et son indice ;
5. place enfin les ramifications alkyle.

Pour l'alanine, la chaîne comporte trois carbones et le groupe amine est en position 2 :

$$\mathrm{CH_3-CH(NH_2)-COOH}\quad\longrightarrow\quad\text{acide 2-aminopropanoïque}$$

## 4. Exercice 2 : la glycine

La formule brute $\mathrm{C_2H_5NO_2}$ conduit à la formule semi-développée :

$$\boxed{\mathrm{H_2N-CH_2-COOH}}$$

Son nom systématique est **acide 2-aminoéthanoïque**. La glycine est un cas particulier : son carbone α porte deux hydrogènes, car $R=H$.`,
    keyPoint: "Un acide α-aminé possède le motif $\\mathrm{H_2N-CH(R)-COOH}$ ; R détermine son identité.",
    example: "Pour $\\mathrm{R=CH_3}$, on obtient l'alanine : $\\mathrm{CH_3-CH(NH_2)-COOH}$, acide 2-aminopropanoïque.",
    methodSteps: [
      "Repère le groupe carboxyle COOH et numérote son carbone 1.",
      "Vérifie que NH2 est porté par le carbone voisin, le carbone α.",
      "Lis la chaîne latérale R pour reconnaître l'acide α-aminé.",
      "Nomme d'abord l'acide carboxylique puis ajoute amino- et les ramifications.",
      "Contrôle le nombre total de carbones et d'hydrogènes avec la formule brute.",
    ],
    corrections: [
      "Pages 1 et 4 : les graphies « acides α-amines » et « acide-2-aminoéthanoïque » sont harmonisées en « acides α-aminés » et « acide 2-aminoéthanoïque ».",
      "Page 1 : R est plus précisément la chaîne latérale, ou résidu après engagement dans un peptide ; cette distinction est explicitée.",
    ],
    interaction: diagram(
      [
        { id: "amine", group: "Fonction", label: "Groupe amine", role: "-NH₂", detail: "Le doublet de l'azote peut capter un proton. Dans un acide α-aminé neutre écrit formellement, NH₂ est fixé au carbone α." },
        { id: "alpha", group: "Centre", label: "Carbone α", role: "-CH(R)-", detail: "Il relie NH₂, COOH, H et R. Sauf pour la glycine, ces quatre substituants sont différents et le carbone est généralement chiral." },
        { id: "acid", group: "Fonction", label: "Groupe carboxyle", role: "-COOH", detail: "Le carbone du carboxyle est numéroté 1. Ce groupe peut céder un proton." },
        { id: "side", group: "Identité", label: "Chaîne latérale R", role: "partie variable", detail: "R vaut H dans la glycine, CH₃ dans l'alanine et CH(CH₃)₂ dans la valine." },
      ],
      "Architecture d'un acide α-aminé",
      "Le carbone α porte les deux fonctions et la chaîne latérale R.",
      "Sélectionne chaque partie de la structure pour comprendre son rôle.",
      "La structure commune donne la famille ; la chaîne R donne l'identité.",
    ),
    questions: [
      choice("Quelles fonctions trouve-t-on sur le carbone α ?", ["une amine et un acide carboxylique", "un alcool et un aldéhyde", "deux acides carboxyliques", "une cétone et un ester"], 0, "Le motif commun est NH2-CH(R)-COOH.", "Structure - page 1"),
      choice("Dans $\\mathrm{H_2N-CH(R)-COOH}$, que représente R ?", ["la chaîne latérale", "le groupe carboxyle", "un proton", "l'atome d'azote"], 0, "R varie d'un acide α-aminé à l'autre.", "Structure - page 1"),
      short("Donne le motif général d'un acide α-aminé.", ["H2N-CH(R)-COOH", "NH2-CH(R)-CO2H", "R-CH(NH2)-COOH"], "Les fonctions amine et carboxyle sont portées par le même carbone α.", "Structure - page 1", 2),
      choice("Pour la glycine, R vaut…", ["H", "CH3", "CH(CH3)2", "C2H5"], 0, "La glycine est H2N-CH2-COOH.", "Tableau - page 1"),
      choice("Le nom usuel de l'acide 2-aminopropanoïque est…", ["alanine", "glycine", "valine", "leucine"], 0, "R=CH3 donne l'alanine.", "Tableau - page 1"),
      choice("Le nom systématique de la valine est…", ["acide 2-amino-3-méthylbutanoïque", "acide 3-amino-2-méthylbutanoïque", "acide 2-aminobutanoïque", "acide 3-méthylbutanoïque"], 0, "Le groupe NH2 est en 2 et le méthyle en 3.", "Tableau - page 1", 2),
      choice("Quelle abréviation correspond à la glycine ?", ["Gly", "Ala", "Val", "Gln"], 0, "Le tableau source donne GLY, normalisé en Gly.", "Tableau - page 1"),
      short("Écris la formule semi-développée de la glycine.", ["H2N-CH2-COOH", "NH2-CH2-CO2H"], "Pour la glycine, R=H.", "Exercice 2 - question 1", 2),
      short("Donne le nom systématique de la glycine.", ["acide 2-aminoéthanoïque", "acide 2-aminoethanoique", "2-aminoéthanoïque"], "La chaîne principale est l'acide éthanoïque et NH2 est en position 2.", "Exercice 2 - question 2", 2),
      choice("Quel carbone du groupe carboxyle reçoit le numéro 1 ?", ["le carbone de COOH", "le carbone α", "le carbone de R", "aucun"], 0, "La numérotation d'un acide carboxylique commence par COOH.", "Méthode de nomenclature"),
    ],
  },
  {
    id: "alpha-amino-zwitterion-acid-base",
    title: "Prévoir la forme acido-basique dominante",
    summary: "Comprendre l'amphion, puis passer correctement du cation en milieu acide à l'anion en milieu basique.",
    pages: "1-4",
    section: "Propriétés acido-basiques - exercice 1 et exercice 2",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## 1. Une molécule amphotère

L'acide α-aminé porte deux groupes de comportements opposés :

- $\mathrm{-COOH}$ peut **céder** un proton $\mathrm{H^+}$ ;
- $\mathrm{-NH_2}$ peut **capter** un proton $\mathrm{H^+}$.

Il est donc **amphotère** : selon le milieu, il peut se comporter comme un acide ou comme une base.

## 2. L'amphion ou zwitterion

À l'état pur et, plus généralement, autour de sa zone isoélectrique, la forme dipolaire prédomine :

$$\boxed{\mathrm{^+H_3N-CH(R)-COO^-}}$$

Cette espèce porte simultanément une charge positive et une charge négative, mais sa charge totale est nulle. On l'appelle **amphion** ou **zwitterion**.

> **Astuce mémoire de Davy.** Le proton quitte COOH et rejoint NH₂ : la gauche devient $\mathrm{NH_3^+}$, la droite devient $\mathrm{COO^-}$.

## 3. Milieu acide : le cation domine

Si le milieu fournit beaucoup de protons, le groupe carboxylate $\mathrm{COO^-}$ se protonne :

$$\mathrm{^+H_3N-CH(R)-COO^- + H^+ \rightleftharpoons ^+H_3N-CH(R)-COOH}$$

La forme prédominante porte une charge globale **positive** : c'est un **cation**.

## 4. Milieu basique : l'anion domine

Si le milieu capte les protons, le groupe ammonium $\mathrm{NH_3^+}$ perd un proton :

$$\mathrm{^+H_3N-CH(R)-COO^- + OH^- \rightleftharpoons H_2N-CH(R)-COO^- + H_2O}$$

La forme prédominante porte une charge globale **négative** : c'est un **anion**.

> **Correction essentielle.** La page 2 répète par erreur « en milieu acide » avant de présenter l'anion. Il faut lire **en milieu basique**. Elle dit aussi que l'ion dipolaire capte un proton dans ce cas ; en réalité il en **cède** un.

## 5. Exercice 1 : les quatre affirmations

| Affirmation | Verdict | Pourquoi ? |
|---|---|---|
| un acide α-aminé possède COOH et NH₂ | vrai | ce sont ses deux fonctions caractéristiques |
| un amphion est monopolaire | faux | il est dipolaire, avec deux charges opposées |
| en milieu très acide, le cation domine | vrai | l'espèce gagne un proton |
| en milieu très basique, l'anion domine | vrai | l'espèce perd un proton |

Pour la glycine, l'amphion demandé à l'exercice 2 est :

$$\boxed{\mathrm{^+H_3N-CH_2-COO^-}}$$`,
    keyPoint: "Acide : cation $\\mathrm{^+H_3N-CH(R)-COOH}$ ; intermédiaire : amphion ; base : anion $\\mathrm{H_2N-CH(R)-COO^-}$.",
    example: "La glycine devient $\\mathrm{^+H_3N-CH_2-COO^-}$ sous forme d'amphion.",
    methodSteps: [
      "Pars de l'amphion NH3+ / COO-.",
      "En milieu acide, ajoute H+ sur COO- pour former COOH.",
      "En milieu basique, retire H+ de NH3+ pour former NH2.",
      "Additionne les charges pour décider entre cation, forme neutre globale et anion.",
      "Vérifie que le nombre total d'atomes est conservé.",
    ],
    corrections: [
      "Page 2 : le deuxième paragraphe doit commencer par « en milieu basique », et non par « en milieu acide ». Dans ce milieu, l'amphion cède un proton ; il ne le capte pas.",
      "Pages 3-4 : l'amphion n'est pas un ion « monopolaire » mais un ion dipolaire, ce que le corrigé classe bien comme faux.",
    ],
    interaction: timeline(
      [
        { label: "Milieu très acide", shortLabel: "cation", detail: "Forme +H₃N-CH(R)-COOH, de charge globale +1." },
        { label: "Forme dipolaire", shortLabel: "amphion", detail: "Forme +H₃N-CH(R)-COO−, avec deux charges opposées et une charge totale nulle." },
        { label: "Milieu très basique", shortLabel: "anion", detail: "Forme H₂N-CH(R)-COO−, de charge globale −1." },
      ],
      "Les trois formes acido-basiques",
      "Le pH pilote les protonations successives.",
      "Parcours la frise de l'acide vers la base et suis les protons.",
      "Quand le milieu devient plus basique, l'acide α-aminé perd successivement ses protons.",
    ),
    questions: [
      choice("Un amphion porte…", ["une charge positive et une charge négative", "une seule charge positive", "une seule charge négative", "aucune charge locale"], 0, "Il est dipolaire mais globalement neutre.", "Propriétés acido-basiques - page 1"),
      choice("La charge globale du zwitterion est…", ["nulle", "+1", "-1", "+2"], 0, "+1 et -1 se compensent.", "Propriétés acido-basiques - page 1"),
      choice("En milieu très acide, la forme prédominante est…", ["le cation", "l'anion", "un radical", "un alcène"], 0, "L'espèce est davantage protonée.", "Exercice 1 - affirmation 3"),
      choice("En milieu très basique, la forme prédominante est…", ["l'anion", "le cation", "la forme totalement protonée", "un ester"], 0, "L'espèce est déprotonée.", "Exercice 1 - affirmation 4"),
      choice("L'affirmation « un amphion est monopolaire » est…", ["fausse", "vraie"], 0, "L'amphion possède deux pôles de charges opposées.", "Exercice 1 - affirmation 2"),
      choice("L'affirmation « un acide α-aminé possède COOH et NH2 » est…", ["vraie", "fausse"], 0, "C'est la définition de la famille.", "Exercice 1 - affirmation 1"),
      choice("Que fait le groupe amine vis-à-vis d'un proton ?", ["il peut le capter", "il libère toujours OH-", "il devient COOH", "il se transforme en carbone"], 0, "Le doublet de N accepte H+.", "Propriétés acido-basiques"),
      choice("Que fait le groupe carboxyle vis-à-vis d'un proton ?", ["il peut le céder", "il le capte toujours", "il devient NH3+", "il ne réagit jamais"], 0, "COOH peut devenir COO-.", "Propriétés acido-basiques"),
      short("Écris l'amphion de la glycine.", ["+H3N-CH2-COO-", "H3N+-CH2-COO-", "NH3+-CH2-COO-"], "La fonction amine est protonée et le carboxyle déprotoné.", "Exercice 2 - question 3", 2),
      choice("Quelle correction faut-il apporter au deuxième cas de la page 2 ?", ["remplacer milieu acide par milieu basique", "remplacer anion par cation", "retirer le groupe COOH", "ajouter un deuxième azote"], 0, "L'anion domine en milieu basique.", "Correction documentée", 2),
      choice("En allant du cation vers l'anion, combien de protons sont perdus au total ?", ["2", "1", "3", "0"], 0, "COOH perd un proton puis NH3+ en perd un autre.", "Synthèse ajoutée", 2),
      choice("Un acide α-aminé est amphotère parce qu'il peut…", ["céder ou capter un proton", "seulement céder des électrons", "seulement capter OH-", "brûler sans oxygène"], 0, "Ses deux fonctions ont des comportements acido-basiques opposés.", "Propriété générale"),
    ],
  },
  {
    id: "peptide-bond-condensation-hydrolysis",
    title: "Former, reconnaître et hydrolyser une liaison peptidique",
    summary: "Relier deux acides α-aminés par condensation, identifier le motif peptidique et retrouver les réactifs par hydrolyse.",
    pages: "2-5",
    section: "Liaison peptidique, hydrolyse et exercices 3-4",
    durationMinutes: 26,
    xp: 60,
    body: String.raw`## 1. La condensation de deux acides α-aminés

Le groupe carboxyle d'un premier acide α-aminé réagit avec le groupe amine d'un second. Une molécule d'eau est éliminée :

$$\mathrm{-COOH + H_2N- \longrightarrow -CO-NH- + H_2O}$$

Le produit contenant deux résidus d'acides α-aminés est un **dipeptide**. Le motif nouvellement créé est :

$$\boxed{\mathrm{-C(=O)-NH-}}$$

Il s'appelle **liaison peptidique**, ou liaison amide.

## 2. Exemple officiel : Ala-Gly

$$\mathrm{H_2N-CH(CH_3)-COOH + H_2N-CH_2-COOH}$$

$$\mathrm{\longrightarrow H_2N-CH(CH_3)-CO-NH-CH_2-COOH + H_2O}$$

Le peptide obtenu est **Ala-Gly** : l'alanine est du côté de l'extrémité amine libre, dite **N-terminale**, et la glycine du côté de l'extrémité carboxyle libre, dite **C-terminale**.

> **Astuce mémoire de Davy.** Dans l'écriture d'un peptide, lis de gauche à droite : extrémité N, motif CO-NH, extrémité C.

## 3. L'ordre compte

Avec deux acides α-aminés différents A et B, deux dipeptides de séquence différente sont possibles :

$$\mathrm{A-B}\qquad\text{et}\qquad\mathrm{B-A}$$

Ils ont la même formule brute et la même masse molaire, mais leurs extrémités et l'ordre des résidus diffèrent.

## 4. L'hydrolyse : la réaction inverse

L'hydrolyse consomme une molécule d'eau et rompt la liaison peptidique :

$$\mathrm{-CO-NH- + H_2O \longrightarrow -COOH + H_2N-}$$

Ainsi, l'hydrolyse complète de Ala-Gly redonne l'alanine et la glycine.

## 5. Lire une formule de peptide

Pour analyser $\mathrm{H_2N-CH(R_1)-CO-NH-CH(R_2)-COOH}$ :

1. entoure $\mathrm{-CO-NH-}$ ;
2. coupe mentalement cette liaison ;
3. remets $\mathrm{OH}$ sur le premier carbonyle ;
4. remets $\mathrm{H}$ sur le second azote ;
5. identifie les chaînes $R_1$ et $R_2$.

Cette méthode permet de retrouver sans deviner les deux acides α-aminés de départ.`,
    keyPoint: "Condensation : $\\mathrm{-COOH+H_2N-\\to-CO-NH-+H_2O}$ ; hydrolyse : réaction inverse.",
    example: "Ala + Gly donne Ala-Gly et $\\mathrm{H_2O}$ ; l'hydrolyse de Ala-Gly redonne Ala et Gly.",
    methodSteps: [
      "Repère le carboxyle du premier acide α-aminé et l'amine du second.",
      "Retire OH du carboxyle et H de l'amine pour former H2O.",
      "Relie le carbone du carbonyle à l'azote et écris CO-NH.",
      "Conserve l'amine libre à gauche et le carboxyle libre à droite.",
      "Pour hydrolyser, réalise exactement les opérations inverses.",
    ],
    corrections: [
      "Page 2 : la notation compacte « ALAGLY » est explicitée sous la forme usuelle Ala-Gly, qui rend visible l'ordre des résidus.",
      "Page 2 : le texte dit qu'un dipeptide possède « comme acide α-aminé, deux groupes » ; il faut lire qu'il possède deux extrémités réactives, amine et carboxyle.",
    ],
    interaction: timeline(
      [
        { label: "Choisir les fonctions", shortLabel: "COOH + NH₂", detail: "Le carboxyle du premier acide α-aminé rencontre l'amine du second." },
        { label: "Éliminer l'eau", shortLabel: "-H₂O", detail: "OH vient de COOH et H vient de NH₂." },
        { label: "Former la liaison", shortLabel: "CO-NH", detail: "Le carbone carbonylé se lie à l'azote : c'est la liaison peptidique." },
        { label: "Nommer la séquence", shortLabel: "Ala-Gly", detail: "Le résidu N-terminal est écrit en premier, puis le résidu C-terminal." },
        { label: "Hydrolyser", shortLabel: "+H₂O", detail: "L'eau rétablit COOH et NH₂ et restitue les deux acides α-aminés." },
      ],
      "Cycle condensation-hydrolyse",
      "La même liaison est créée puis rompue.",
      "Parcours les étapes et suis les fragments OH et H de la molécule d'eau.",
      "Le bilan atomique doit toujours être conservé.",
    ),
    questions: [
      choice("La liaison peptidique possède le motif…", ["$\\mathrm{-CO-NH-}$", "$\\mathrm{-CO-O-}$", "$\\mathrm{-NH-NH-}$", "$\\mathrm{-CH=CH-}$"], 0, "C'est une liaison amide entre un carbonyle et un azote.", "Liaison peptidique - page 2"),
      choice("La formation d'un dipeptide élimine…", ["une molécule d'eau", "du dioxyde de carbone", "du diazote", "deux molécules d'eau"], 0, "OH et H forment H2O.", "Condensation - page 2"),
      choice("Deux acides α-aminés forment un…", ["dipeptide", "disaccharide", "alcane", "savon"], 0, "Le produit contient deux résidus.", "Définition - page 2"),
      choice("Dans Ala-Gly, quel résidu est N-terminal ?", ["Ala", "Gly", "les deux", "aucun"], 0, "Le premier résidu conserve son amine libre.", "Exemple Ala-Gly"),
      choice("Dans Ala-Gly, quel résidu est C-terminal ?", ["Gly", "Ala", "les deux", "aucun"], 0, "Le dernier résidu conserve son carboxyle libre.", "Exemple Ala-Gly"),
      choice("L'hydrolyse d'un dipeptide consomme…", ["H2O", "O2", "H2", "NH3"], 0, "L'eau se répartit entre les deux fragments.", "Hydrolyse - page 2"),
      choice("L'hydrolyse complète de Ala-Gly donne…", ["alanine et glycine", "deux alanines", "deux glycines", "valine et glycine"], 0, "Elle restitue les réactifs de la condensation.", "Hydrolyse - page 2"),
      choice("Avec deux acides α-aminés différents A et B, combien de séquences dipeptidiques simples sont possibles ?", ["2", "1", "3", "4"], 0, "A-B et B-A.", "Exercice 3 - question 1"),
      choice("A-B et B-A ont-ils la même masse molaire ?", ["oui", "non"], 0, "Ils ont les mêmes atomes mais un ordre différent.", "Exercice 3"),
      short("Écris le nom du motif -C(=O)-NH-.", ["liaison peptidique", "liaison amide", "peptidique"], "C'est le motif créé par condensation.", "Cours - page 2"),
      choice("Pour retrouver les réactifs d'un peptide, on doit couper mentalement…", ["la liaison CO-NH", "toutes les liaisons C-H", "la chaîne R", "le groupe OH"], 0, "C'est la liaison formée lors de la condensation.", "Méthode ajoutée"),
      choice("Dans l'hydrolyse, OH retourne sur…", ["le carbone du carbonyle", "l'azote", "la chaîne R", "un hydrogène"], 0, "Cela reconstitue COOH.", "Hydrolyse détaillée"),
      choice("Dans l'hydrolyse, H retourne sur…", ["l'azote", "le carbone du carbonyle", "l'oxygène de R", "le groupe méthyle"], 0, "Cela reconstitue NH2.", "Hydrolyse détaillée"),
    ],
  },
  {
    id: "peptide-selective-synthesis",
    title: "Obtenir un seul dipeptide par synthèse sélective",
    summary: "Comprendre pourquoi un mélange est possible et organiser protection, activation, couplage puis déprotection pour imposer une séquence.",
    pages: "3-6",
    section: "Situation d'évaluation et exercice 4 - synthèse exclusive",
    durationMinutes: 27,
    xp: 70,
    body: String.raw`## 1. Pourquoi la condensation directe n'est-elle pas sélective ?

Chaque acide α-aminé possède une fonction amine et une fonction acide. Si A et B réagissent sans précaution, plusieurs produits peuvent apparaître :

- A-B ;
- B-A ;
- A-A ;
- B-B ;
- puis éventuellement des chaînes plus longues.

Pour obtenir **un seul dipeptide**, il faut rendre indisponibles les fonctions qui ne doivent pas réagir.

## 2. Les quatre idées de la synthèse dirigée

1. **protéger** temporairement les fonctions concurrentes ;
2. **activer** le groupe carboxyle qui doit former la liaison ;
3. effectuer le **couplage** avec l'amine choisie ;
4. **déprotéger** pour retrouver les extrémités libres.

> **Astuce mémoire de Davy.** P-A-C-D : **Protéger, Activer, Coupler, Déprotéger**.

## 3. Exemple officiel : préparer uniquement Ala-Gly

Le peptide ciblé est :

$$\mathrm{H_2N-CH(CH_3)-CO-NH-CH_2-COOH}$$

Il faut faire réagir le **carboxyle de l'alanine** avec l'**amine de la glycine**. On protège donc :

- l'amine de l'alanine, pour qu'elle ne réagisse pas comme nucléophile ;
- le carboxyle de la glycine, pour qu'il ne forme pas la liaison dans l'autre sens.

On active ensuite le carboxyle de l'alanine, on le couple à l'amine de la glycine, puis on enlève les protections.

## 4. Retrouver le peptide isomère

En inversant l'ordre, on obtient Gly-Ala :

$$\mathrm{H_2N-CH_2-CO-NH-CH(CH_3)-COOH}$$

Même formule brute, même masse molaire, mais extrémités différentes.

## 5. N-terminal et C-terminal

- le résidu **N-terminal** porte l'amine libre $\mathrm{NH_2}$ ;
- le résidu **C-terminal** porte le carboxyle libre $\mathrm{COOH}$.

La protection utilisée pendant la synthèse est temporaire : après déprotection, le résidu N-terminal retrouve bien son groupe amine libre.`,
    keyPoint: "Pour imposer A-B, fais réagir COOH de A avec NH₂ de B et protège les deux fonctions concurrentes.",
    example: "Pour Ala-Gly : protéger NH₂ d'Ala et COOH de Gly, activer COOH d'Ala, coupler avec NH₂ de Gly, puis déprotéger.",
    methodSteps: [
      "Écris d'abord la séquence cible de N-terminal vers C-terminal.",
      "Entoure le carboxyle du premier résidu et l'amine du second : ce sont les fonctions à coupler.",
      "Protège l'amine du premier et le carboxyle du second.",
      "Active le carboxyle destiné au couplage puis forme CO-NH.",
      "Retire les protections et vérifie les deux extrémités libres.",
    ],
    corrections: [
      "Page 5 : le document parle d'« activation de la fonction amine de A2 ». La démarche est reformulée avec plus de précision : on protège les fonctions concurrentes et on active principalement le carboxyle à coupler ; l'amine partenaire doit être disponible.",
      "Pages 2-3 : le blocage de l'amine du résidu N-terminal est temporaire. Après déprotection, cette amine redevient l'extrémité N libre du peptide.",
      "Page 5 : « déblocagede » est corrigé en « déblocage de ».",
    ],
    interaction: timeline(
      [
        { label: "Fixer la cible", shortLabel: "Ala-Gly", detail: "Le carboxyle d'Ala doit rejoindre l'amine de Gly." },
        { label: "Protéger", shortLabel: "sélectivité", detail: "Bloquer NH₂ d'Ala et COOH de Gly pour empêcher les couplages concurrents." },
        { label: "Activer", shortLabel: "COOH d'Ala", detail: "Rendre le carboxyle choisi suffisamment réactif." },
        { label: "Coupler", shortLabel: "CO-NH", detail: "Former la liaison peptidique entre Ala et Gly." },
        { label: "Déprotéger", shortLabel: "extrémités libres", detail: "Restituer NH₂ en N-terminal et COOH en C-terminal." },
      ],
      "Synthèse sélective d'Ala-Gly",
      "Chaque étape élimine une source de produit parasite.",
      "Parcours les cinq étapes dans l'ordre et identifie la fonction concernée.",
      "La séquence est décidée avant la réaction, pas après.",
    ),
    questions: [
      choice("Pourquoi la réaction directe de A et B peut-elle donner plusieurs produits ?", ["chaque molécule possède NH2 et COOH", "A et B n'ont aucune fonction", "l'eau empêche toute réaction", "la liaison peptidique est ionique"], 0, "Plusieurs couples de fonctions peuvent réagir.", "Synthèse exclusive - page 5"),
      choice("Pour préparer A-B, quelles fonctions doivent réagir ?", ["COOH de A et NH2 de B", "NH2 de A et COOH de B", "les deux chaînes R", "deux groupes COOH"], 0, "A devient N-terminal et B C-terminal.", "Principe de synthèse"),
      choice("Pour préparer Ala-Gly, quelle amine faut-il protéger ?", ["celle de l'alanine", "celle de la glycine", "les deux définitivement", "aucune"], 0, "L'amine de Gly doit rester disponible pour le couplage.", "Exercice 4 - question 2", 2),
      choice("Pour préparer Ala-Gly, quel carboxyle faut-il protéger ?", ["celui de la glycine", "celui de l'alanine", "les deux définitivement", "aucun"], 0, "Le carboxyle d'Ala est celui qui doit réagir.", "Exercice 4 - question 2", 2),
      choice("Quel groupe carboxyle faut-il activer pour Ala-Gly ?", ["celui de l'alanine", "celui de la glycine", "les deux", "aucun"], 0, "Il formera le carbonyle de la liaison peptidique.", "Exercice 4 - question 2"),
      choice("Que signifie déprotéger ?", ["retirer les groupes protecteurs", "casser la liaison peptidique", "enlever tous les hydrogènes", "ajouter un radical R"], 0, "On restitue les fonctions libres après le couplage.", "Synthèse exclusive"),
      short("Donne la séquence du dipeptide P1 formé par Ala puis Gly.", ["Ala-Gly", "ALAGLY", "alanine-glycine"], "L'alanine est N-terminale et la glycine C-terminale.", "Exercice 4 - formule de P1", 2),
      short("Donne la séquence du dipeptide isomère P2.", ["Gly-Ala", "GLYALA", "glycine-alanine"], "L'inversion de l'ordre donne Gly-Ala.", "Exercice 4 - question 3", 2),
      choice("Dans Gly-Ala, le résidu N-terminal est…", ["Gly", "Ala", "les deux", "aucun"], 0, "Gly est écrit en premier et porte NH2 libre.", "Exercice 4 - P2"),
      choice("Ala-Gly et Gly-Ala sont-ils identiques ?", ["non", "oui"], 0, "L'ordre des résidus diffère.", "Exercice 4"),
      choice("Ala-Gly et Gly-Ala ont-ils la même formule brute ?", ["oui", "non"], 0, "Ils sont isomères de séquence.", "Exercice 4"),
      choice("Quelle suite résume la stratégie ?", ["protéger, activer, coupler, déprotéger", "hydrolyser, brûler, refroidir", "nommer, peser, filtrer", "protoner quatre fois"], 0, "C'est la démarche P-A-C-D.", "Méthode enrichie", 2),
      choice("Après déprotection, l'extrémité N porte…", ["NH2 libre", "COOH libre", "Cl-", "aucun azote"], 0, "C'est la définition de l'extrémité N-terminale.", "Précision ajoutée"),
      choice("Après déprotection, l'extrémité C porte…", ["COOH libre", "NH2 libre", "NH3 seulement", "un alcool"], 0, "C'est la définition de l'extrémité C-terminale.", "Précision ajoutée"),
    ],
  },
  {
    id: "alpha-amino-composition-identification",
    title: "Identifier un acide α-aminé par sa composition massique",
    summary: "Exploiter les pourcentages de C, H, N et O pour retrouver une formule brute, une structure et un nom.",
    pages: "2-3",
    section: "Situation d'évaluation - identification de A et B",
    durationMinutes: 29,
    xp: 75,
    body: String.raw`## 1. La donnée expérimentale

Le composé A contient :

$$\%C=40{,}45\qquad \%H=7{,}87\qquad \%N=15{,}72$$

et sa molécule possède deux atomes d'oxygène. On pose :

$$\mathrm{A=C_xH_yN_zO_2}$$

## 2. Utiliser 100 g de composé

Dans 100 g de A, les masses de C, H et N sont directement leurs pourcentages. La part d'oxygène vaut :

$$\%O=100-(40{,}45+7{,}87+15{,}72)=35{,}96$$

Les rapports des quantités de matière sont alors :

$$\frac{40{,}45}{12}:\frac{7{,}87}{1}:\frac{15{,}72}{14}:\frac{35{,}96}{16}$$

soit environ :

$$3{,}371:7{,}87:1{,}123:2{,}248$$

En divisant par $1{,}123$, on obtient presque :

$$3:7:1:2$$

Donc :

$$\boxed{\mathrm{A=C_3H_7NO_2}}$$

## 3. Passer de la formule brute à l'identité

Un acide α-aminé à trois carbones et une seule chaîne latérale simple est :

$$\mathrm{CH_3-CH(NH_2)-COOH}$$

C'est l'**alanine**, ou **acide 2-aminopropanoïque**.

## 4. Identifier B avec la chaîne carbonée

Le composé B est donné sous la forme :

$$\mathrm{C_4H_9-CH(NH_2)-COOH}$$

La chaîne carbonée possède deux ramifications. Le groupe $\mathrm{C_4H_9}$ retenu est alors le groupe tert-butyle :

$$\mathrm{B=(CH_3)_3C-CH(NH_2)-COOH}$$

Son nom systématique est **acide 2-amino-3,3-diméthylbutanoïque**.

## 5. Construire le dipeptide D

A est N-terminal : son carboxyle se lie à l'amine de B.

$$\mathrm{H_2N-CH(CH_3)-COOH+H_2N-CH[C(CH_3)_3]-COOH}$$

$$\mathrm{\longrightarrow H_2N-CH(CH_3)-CO-NH-CH[C(CH_3)_3]-COOH+H_2O}$$

La liaison peptidique est le motif $\mathrm{-CO-NH-}$.`,
    keyPoint: "Avec des pourcentages, transforme d'abord les masses sur 100 g en quantités de matière, puis réduis au plus petit rapport entier.",
    example: "$40{,}45/12:7{,}87:15{,}72/14:35{,}96/16\\approx3:7:1:2$, donc $\\mathrm{C_3H_7NO_2}$, l'alanine.",
    methodSteps: [
      "Complète le pourcentage manquant jusqu'à 100 %.",
      "Divise chaque pourcentage par la masse molaire atomique correspondante.",
      "Divise tous les résultats par le plus petit.",
      "Arrondis seulement quand les rapports sont clairement proches d'entiers.",
      "Utilise enfin la fonction α-aminée et les informations de ramification pour choisir la structure.",
    ],
    corrections: [
      "Page 3 : la relation imprimée avec 32 au numérateur de l'oxygène est une écriture condensée liée aux deux atomes O ; la méthode sur une base de 100 g est détaillée pour éviter toute ambiguïté.",
      "Page 3 : le composé B est nommé explicitement acide 2-amino-3,3-diméthylbutanoïque ; le corrigé source ne donne que sa formule semi-développée.",
    ],
    interaction: timeline(
      [
        { label: "Compléter l'oxygène", shortLabel: "35,96 %", detail: "100 − 40,45 − 7,87 − 15,72 = 35,96." },
        { label: "Diviser par M atomique", shortLabel: "n", detail: "C/12, H/1, N/14 et O/16 donnent des quantités proportionnelles." },
        { label: "Réduire les rapports", shortLabel: "3:7:1:2", detail: "On divise par le plus petit nombre obtenu." },
        { label: "Écrire la formule", shortLabel: "C₃H₇NO₂", detail: "Les rapports entiers deviennent les indices de la formule brute." },
        { label: "Identifier la structure", shortLabel: "alanine", detail: "Trois carbones et le motif α-aminé conduisent à CH₃-CH(NH₂)-COOH." },
      ],
      "Des pourcentages à l'alanine",
      "Chaque opération réduit l'incertitude sur l'identité de A.",
      "Parcours les cinq étapes sans arrondir trop tôt.",
      "La composition donne la formule ; le contexte chimique donne la structure.",
    ),
    questions: [
      short("Calcule le pourcentage massique d'oxygène de A.", ["35,96", "35.96", "35,96%", "35.96%"], "$100-40{,}45-7{,}87-15{,}72=35{,}96$.", "Situation d'évaluation - II", 2),
      choice("Pour convertir le pourcentage de carbone en quantité de matière relative, on divise par…", ["12", "1", "14", "16"], 0, "La masse molaire atomique du carbone est 12 g·mol-1.", "Méthode de composition"),
      choice("Pour l'azote, on calcule…", ["$15{,}72/14$", "$15{,}72/12$", "$14/15{,}72$", "$15{,}72/2$"], 0, "On divise la masse par la masse molaire atomique.", "Situation d'évaluation"),
      short("Donne le rapport entier C:H:N:O obtenu.", ["3:7:1:2", "3;7;1;2", "3/7/1/2"], "La réduction des quatre quantités donne 3, 7, 1 et 2.", "Situation d'évaluation - question 2.1", 2),
      short("Donne la formule brute de A.", ["C3H7NO2", "C₃H₇NO₂", "c3h7no2"], "Les indices sont 3, 7, 1 et 2.", "Situation d'évaluation - question 2.1", 2),
      short("Écris la formule semi-développée de A.", ["CH3-CH(NH2)-COOH", "CH3CH(NH2)COOH", "H2N-CH(CH3)-COOH"], "Il s'agit de l'alanine.", "Situation d'évaluation - question 2.2", 2),
      short("Nomme A.", ["alanine", "acide 2-aminopropanoïque", "acide 2-aminopropanoique"], "A est l'alanine.", "Situation d'évaluation - question 2.3", 2),
      choice("La chaîne C4H9 de B possède deux ramifications. Quel groupe convient ?", ["tert-butyle $\\mathrm{C(CH_3)_3}$", "n-butyle", "sec-butyle", "éthyle"], 0, "Le carbone de liaison est relié à trois méthyles.", "Situation d'évaluation - I et III", 2),
      short("Écris une formule semi-développée de B.", ["(CH3)3C-CH(NH2)-COOH", "HOOC-CH(NH2)-C(CH3)3"], "La chaîne latérale est tert-butyle.", "Situation d'évaluation - question 2.4", 2),
      short("Donne le nom systématique de B.", ["acide 2-amino-3,3-diméthylbutanoïque", "acide 2-amino-3,3-dimethylbutanoique"], "La chaîne principale compte quatre carbones et deux méthyles sont en 3.", "Nom explicité", 3),
      choice("Si A est N-terminal, quel groupe reste libre dans D ?", ["l'amine de A", "le carboxyle de A", "les deux groupes de B", "aucun"], 0, "Le résidu N-terminal porte NH2 libre.", "Situation d'évaluation - III"),
      choice("Dans D, le carboxyle de A réagit avec…", ["l'amine de B", "le carboxyle de B", "la chaîne tert-butyle", "l'amine de A"], 0, "Cela place A en N-terminal.", "Situation d'évaluation - question 3.1"),
      short("Quel motif faut-il entourer comme liaison peptidique ?", ["-CO-NH-", "CO-NH", "-C(=O)-NH-"], "C'est la liaison formée entre A et B.", "Situation d'évaluation - question 3.2", 2),
      choice("Pourquoi ne faut-il pas arrondir les quotients dès le début ?", ["pour ne pas fausser le rapport entier", "pour changer la masse atomique", "pour supprimer l'oxygène", "pour obtenir toujours n=1"], 0, "Les données expérimentales sont déjà arrondies.", "Méthode enrichie"),
    ],
  },
  {
    id: "dipeptide-molar-mass",
    title: "Retrouver une chaîne latérale par la masse d'un dipeptide",
    summary: "Établir une formule de masse en fonction de n et utiliser la ramification pour identifier la valine ou l'alanine.",
    pages: "4-6",
    section: "Exercices 3 et 5 - masses molaires",
    durationMinutes: 29,
    xp: 80,
    body: String.raw`## 1. Règle de masse d'une condensation

Lorsqu'un dipeptide se forme à partir de deux acides α-aminés :

$$\boxed{M(\text{dipeptide})=M(A)+M(B)-18}$$

On soustrait $18\ \mathrm{g\,mol^{-1}}$, la masse molaire de l'eau éliminée.

## 2. Exercice 3 : alanine + acide α-aminé A

La chaîne latérale de A est un alkyle ramifié :

$$\mathrm{R=C_nH_{2n+1}}$$

La formule du dipeptide conduit dans le document à :

$$M(P)=14n+146$$

Or $M(P)=188\ \mathrm{g\,mol^{-1}}$, donc :

$$n=\frac{188-146}{14}=3$$

Ainsi $\mathrm{R=C_3H_7}$. Comme R est ramifié, il s'agit du groupe isopropyle $\mathrm{CH(CH_3)_2}$, et A est la **valine** :

$$\boxed{\mathrm{CH_3-CH(CH_3)-CH(NH_2)-COOH}}$$

Son nom systématique est **acide 2-amino-3-méthylbutanoïque**.

## 3. Exercice 5 : valine + acide α-aminé B

Le dipeptide a encore une masse molaire de $188\ \mathrm{g\,mol^{-1}}$. On isole cette fois la masse du groupe alkyle R de B.

La partie du peptide autre que R a pour composition $\mathrm{C_7H_{13}N_2O_3}$ :

$$M_{\text{fixe}}=7\times12+13\times1+2\times14+3\times16=173$$

Donc :

$$M(R)=188-173=15$$

Pour $\mathrm{R=C_nH_{2n+1}}$ :

$$M(R)=12n+(2n+1)=14n+1$$

Ainsi :

$$14n+1=15\quad\Longrightarrow\quad n=1$$

Donc $\mathrm{R=CH_3}$ et B est l'**alanine** :

$$\boxed{\mathrm{CH_3-CH(NH_2)-COOH}}$$

## 4. Pourquoi la ramification est indispensable

Connaître seulement $\mathrm{C_3H_7}$ ne suffit pas : il existe le groupe propyle droit et le groupe isopropyle ramifié. L'énoncé impose la forme ramifiée ; cette information permet de choisir la valine.`,
    keyPoint: "$M(\\text{dipeptide})=M(A)+M(B)-18$ ; après le calcul de n, utilise encore les indices de structure donnés par l'énoncé.",
    example: "$188=14n+146$ donne $n=3$ ; R est ramifié, donc $\\mathrm{R=CH(CH_3)_2}$ et A est la valine.",
    methodSteps: [
      "Écris la formule générale du groupe alkyle R=CnH2n+1.",
      "Construis la formule ou la masse du dipeptide en retirant une molécule d'eau.",
      "Isole n sans arrondir.",
      "Traduis CnH2n+1 en structures possibles.",
      "Utilise les mots ramifié, terminal ou la séquence imposée pour choisir la bonne structure.",
    ],
    corrections: [
      "Page 5 : la formule semi-développée de la valine est tronquée dans l'énoncé de l'exercice 5 ; le groupe COOH manquant est rétabli.",
      "Page 6 : la formule symbolique du corrigé imprime 7M_N alors que l'application numérique utilise correctement 2×14. La partie fixe contient deux atomes d'azote : le terme correct est 2M_N.",
      "Page 6 : « méthyl » et « propanoique » sont corrigés en « méthyle » et « propanoïque ».",
    ],
    interaction: diagram(
      [
        { id: "mass", group: "Donnée", label: "M(P)=188", role: "masse du dipeptide", detail: "La masse globale permet d'isoler la contribution de la chaîne latérale inconnue." },
        { id: "water", group: "Bilan", label: "-18", role: "eau éliminée", detail: "Toute condensation de deux acides α-aminés retire H₂O." },
        { id: "formula", group: "Inconnue", label: "R=CₙH₂ₙ₊₁", role: "M(R)=14n+1", detail: "Un groupe alkyle saturé possède cette formule générale." },
        { id: "branch", group: "Indice", label: "R ramifié", role: "choix de l'isomère", detail: "Pour C₃H₇, l'indice ramifié désigne l'isopropyle et donc la valine." },
        { id: "identity", group: "Résultat", label: "n=3 ou n=1", role: "valine ou alanine", detail: "L'exercice 3 conduit à la valine ; l'exercice 5 conduit à l'alanine." },
      ],
      "Enquête par la masse molaire",
      "Le calcul trouve la taille de R ; le texte trouve sa forme.",
      "Sélectionne chaque indice et observe son rôle dans l'identification.",
      "Une formule brute peut laisser plusieurs isomères : ne néglige jamais l'indice de ramification.",
    ),
    questions: [
      short("Quelle masse molaire retire-t-on lors d'une condensation ?", ["18", "18 g/mol", "18 g.mol-1"], "Une molécule d'eau est éliminée.", "Règle de condensation", 2),
      choice("La relation correcte est…", ["$M(P)=M(A)+M(B)-18$", "$M(P)=M(A)+M(B)+18$", "$M(P)=M(A)-M(B)$", "$M(P)=18$"], 0, "Le peptide perd H2O.", "Méthode"),
      short("Dans l'exercice 3, calcule n à partir de 188=14n+146.", ["3", "n=3"], "$n=(188-146)/14=3$.", "Exercice 3 - question 2", 2),
      short("Donne la formule brute du groupe alkyle R obtenu dans l'exercice 3.", ["C3H7", "C₃H₇"], "Pour n=3, R=C3H7.", "Exercice 3 - question 2"),
      choice("Quel isomère de C3H7 est ramifié ?", ["isopropyle", "n-propyle", "éthyle", "méthyle"], 0, "Le carbone de liaison porte deux groupes CH3.", "Exercice 3"),
      short("Identifie l'acide α-aminé A de l'exercice 3.", ["valine", "acide 2-amino-3-méthylbutanoïque", "acide 2-amino-3-methylbutanoique"], "R=isopropyle donne la valine.", "Exercice 3 - question 3", 2),
      short("Donne la masse de la partie fixe C7H13N2O3.", ["173", "173 g/mol", "173 g.mol-1"], "$7×12+13+2×14+3×16=173$.", "Exercice 5 - corrigé", 2),
      short("Dans l'exercice 5, calcule M(R).", ["15", "15 g/mol", "15 g.mol-1"], "$188-173=15$.", "Exercice 5 - question 4", 2),
      short("Résous 14n+1=15.", ["1", "n=1"], "$14n=14$, donc n=1.", "Exercice 5 - question 4", 2),
      short("Quel groupe alkyle correspond à n=1 ?", ["CH3", "méthyle", "methyl", "groupe méthyle"], "R=CH3.", "Exercice 5 - question 4"),
      short("Identifie B dans l'exercice 5.", ["alanine", "acide 2-aminopropanoïque", "acide 2-aminopropanoique"], "R=CH3 donne l'alanine.", "Exercice 5 - question 5", 2),
      choice("Combien d'atomes d'azote contient la partie fixe du calcul de l'exercice 5 ?", ["2", "7", "1", "3"], 0, "Le terme correct est 2MN ; le 7MN imprimé est une coquille.", "Correction documentée", 2),
      choice("Pourquoi C3H7 ne suffit-il pas à identifier la valine ?", ["il existe plusieurs isomères de C3H7", "C3H7 ne contient pas de carbone", "la masse de l'eau est inconnue", "la valine ne possède pas R"], 0, "L'indice « ramifié » choisit l'isopropyle.", "Précision ajoutée"),
      short("Donne le nom systématique de la valine.", ["acide 2-amino-3-méthylbutanoïque", "acide 2-amino-3-methylbutanoique"], "La chaîne principale est butanoïque, NH2 en 2 et CH3 en 3.", "Exercice 5 - question 1.1", 2),
    ],
  },
  {
    id: "peptides-proteins-biuret",
    title: "Relier dipeptides, polypeptides et protéines",
    summary: "Passer de la liaison peptidique aux chaînes biologiques, comprendre le test du Biuret et le rôle des résidus d'acides aminés.",
    pages: "2 et 7",
    section: "Caractérisation, protéines et document d'approfondissement",
    durationMinutes: 24,
    xp: 75,
    body: String.raw`## 1. De deux résidus à une longue chaîne

- **dipeptide** : 2 résidus, donc 1 liaison peptidique ;
- **tripeptide** : 3 résidus, donc 2 liaisons peptidiques ;
- **tétrapeptide** : 4 résidus, donc 3 liaisons peptidiques ;
- **polypeptide** : longue chaîne de résidus reliés par des liaisons peptidiques ;
- **protéine** : une ou plusieurs chaînes polypeptidiques organisées dans une structure fonctionnelle.

Pour une chaîne linéaire de $n$ résidus :

$$\boxed{N_{\text{liaisons peptidiques}}=n-1}$$

## 2. Le test du Biuret

La réaction du **Biuret** met en évidence les molécules possédant au moins **deux liaisons peptidiques**. Dans les conditions usuelles, un résultat positif produit une coloration violette.

Conséquences :

- un acide α-aminé libre : test négatif ;
- un dipeptide, avec une seule liaison peptidique : test généralement négatif ;
- un tripeptide ou une chaîne plus longue : test positif attendu.

## 3. Résidu et séquence

Quand un acide α-aminé entre dans un peptide, il perd les éléments de l'eau engagés dans la condensation. La partie incorporée est appelée **résidu d'acide aminé**.

L'ordre des résidus forme la **séquence peptidique**. Deux chaînes contenant les mêmes résidus dans un ordre différent ne sont pas la même molécule.

## 4. Repères biologiques du document

Le document rappelle que :

- les protéines sont indispensables à la structure et au fonctionnement des cellules ;
- la plupart des acides aminés naturels des protéines appartiennent à la série L ;
- la glycine est une exception importante à la chiralité, car son carbone α porte deux hydrogènes ;
- neuf acides aminés sont dits essentiels chez l'être humain et doivent être apportés par l'alimentation ;
- certains acides aminés ou dérivés jouent d'autres rôles : précurseurs, neurotransmetteurs ou intermédiaires métaboliques.

## 5. Ce qu'il faut savoir expliquer

Une protéine n'est pas un simple « sac » d'acides aminés. Sa séquence impose une organisation, et cette organisation participe à sa fonction. Changer l'ordre des résidus peut donc modifier profondément les propriétés de la molécule.`,
    keyPoint: "Une chaîne linéaire de n résidus possède n−1 liaisons peptidiques ; le Biuret devient positif à partir de deux liaisons.",
    example: "Un tripeptide possède 3 résidus et 2 liaisons peptidiques : il satisfait le seuil du test du Biuret.",
    methodSteps: [
      "Compte les résidus, pas les atomes d'azote.",
      "Soustrais 1 pour obtenir le nombre de liaisons peptidiques d'une chaîne linéaire.",
      "Compare ce nombre au seuil de deux liaisons pour le Biuret.",
      "Lis la séquence de l'extrémité N vers l'extrémité C.",
      "Distingue acide aminé libre, résidu, peptide et protéine.",
    ],
    corrections: [
      "Page 2 : le test du Biuret est présenté avec son seuil d'au moins deux liaisons peptidiques ; cela signifie qu'un dipeptide, qui n'en possède qu'une, ne suffit généralement pas.",
      "Page 7 : la glycine est explicitement signalée comme exception à la chiralité des acides α-aminés usuels, car son carbone α porte deux hydrogènes.",
      "Page 7 : la formule générique typographiée H2N-HCR-COOH est normalisée en H2N-CH(R)-COOH.",
    ],
    interaction: timeline(
      [
        { label: "Acide α-aminé", shortLabel: "1 résidu libre", detail: "Aucune liaison peptidique." },
        { label: "Dipeptide", shortLabel: "2 / 1", detail: "Deux résidus et une liaison peptidique : seuil du Biuret non atteint." },
        { label: "Tripeptide", shortLabel: "3 / 2", detail: "Trois résidus et deux liaisons peptidiques : test du Biuret attendu positif." },
        { label: "Polypeptide", shortLabel: "n / n−1", detail: "Longue séquence linéaire de résidus." },
        { label: "Protéine", shortLabel: "structure fonctionnelle", detail: "Une ou plusieurs chaînes polypeptidiques repliées et organisées." },
      ],
      "De l'acide aminé à la protéine",
      "Chaque nouvelle condensation ajoute un résidu et une liaison peptidique.",
      "Parcours les cinq échelles et compare résidus, liaisons et organisation.",
      "La longueur compte, mais la séquence et la structure déterminent aussi la fonction.",
    ),
    questions: [
      choice("Un dipeptide contient combien de liaisons peptidiques ?", ["1", "2", "0", "3"], 0, "Deux résidus sont reliés par une seule liaison.", "Cours - page 2"),
      choice("Un tripeptide contient combien de liaisons peptidiques ?", ["2", "3", "1", "4"], 0, "Pour n=3, n-1=2.", "Cours - page 2"),
      short("Une chaîne linéaire de 10 résidus possède combien de liaisons peptidiques ?", ["9", "neuf"], "$10-1=9$.", "Règle enrichie", 2),
      choice("Le test du Biuret caractérise principalement…", ["au moins deux liaisons peptidiques", "un seul groupe COOH", "la présence de glucose", "les ions chlorure"], 0, "Le document fixe ce seuil.", "Caractérisation - page 2"),
      choice("Le test du Biuret d'un dipeptide isolé est généralement…", ["négatif", "positif violet", "explosif", "sans aucun réactif"], 0, "Le dipeptide ne possède qu'une liaison peptidique.", "Déduction du cours"),
      choice("Le test du Biuret d'un tripeptide est attendu…", ["positif", "toujours négatif", "identique à celui du chlorure", "impossible"], 0, "Deux liaisons peptidiques satisfont le seuil.", "Déduction du cours"),
      choice("Qu'appelle-t-on résidu d'acide aminé ?", ["la partie incorporée dans un peptide", "un ion chlorure", "une molécule d'eau", "le seul groupe R"], 0, "C'est l'unité issue de l'acide aminé après condensation.", "Document - page 7"),
      choice("Qu'est-ce que la séquence peptidique ?", ["l'ordre des résidus", "la masse de l'eau", "le nombre d'oxygènes uniquement", "la couleur du Biuret"], 0, "La séquence est l'ordre le long de la chaîne.", "Document - page 7"),
      choice("Pourquoi la glycine n'est-elle pas chirale ?", ["son carbone α porte deux hydrogènes", "elle ne contient pas d'azote", "elle possède deux COOH", "elle est toujours ionique"], 0, "Le carbone α n'a pas quatre substituants différents.", "Document - précision"),
      choice("Combien d'acides aminés sont essentiels chez l'être humain selon le document ?", ["9", "22", "19", "2"], 0, "Ils doivent être apportés par l'alimentation.", "Document - page 7"),
      choice("Les représentants naturels des acides aminés protéinogènes sont principalement…", ["de série L", "de série D uniquement", "sans carbone", "des alcènes"], 0, "Le document mentionne la prédominance des énantiomères L.", "Document - page 7"),
      choice("Une protéine est-elle définie uniquement par le nombre de résidus ?", ["non", "oui"], 0, "Sa séquence, son repliement et son organisation fonctionnelle comptent aussi.", "Précision enrichie", 2),
    ],
  },
  {
    id: "alpha-amino-final-mission",
    title: "Mission finale : identifier B et construire le bon dipeptide",
    summary: "Mobiliser nomenclature, sélectivité, bilan massique et liaison peptidique dans l'exercice 5 intégral.",
    pages: "5-6",
    section: "Exercice 5 et corrigé",
    durationMinutes: 30,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Mission

Un acide α-aminé inconnu B, de formule $\mathrm{R-CH(NH_2)-COOH}$ où R est un groupe alkyle saturé, réagit avec la valine. Le dipeptide D obtenu possède une masse molaire :

$$M(D)=188\ \mathrm{g\,mol^{-1}}$$

Il faut identifier B et expliquer comment obtenir uniquement le peptide dans lequel **B est C-terminal** — c'est le sens cohérent avec l'équation et le corrigé, même si l'énoncé utilise l'expression ambiguë « B est l'acide α-aminé terminal ».

## Étape 1. Reconnaître la valine

$$\mathrm{Val=H_2N-CH[CH(CH_3)_2]-COOH}$$

Son nom systématique est **acide 2-amino-3-méthylbutanoïque**.

## Étape 2. Fixer la séquence

Le peptide représenté dans le corrigé est Val-B :

$$\mathrm{H_2N-CH[CH(CH_3)_2]-CO-NH-CH(R)-COOH}$$

La valine est N-terminale et B est C-terminal. Pour obtenir exclusivement cette séquence :

- protéger l'amine de la valine ;
- protéger le carboxyle de B ;
- activer le carboxyle de la valine ;
- coupler avec l'amine de B ;
- déprotéger les deux extrémités.

## Étape 3. Isoler la masse de R

La partie connue de D, sans R, a pour formule $\mathrm{C_7H_{13}N_2O_3}$ et pour masse :

$$7\times12+13\times1+2\times14+3\times16=173$$

Donc :

$$M(R)=188-173=15\ \mathrm{g\,mol^{-1}}$$

## Étape 4. Déterminer R

Pour $\mathrm{R=C_nH_{2n+1}}$ :

$$M(R)=12n+(2n+1)=14n+1$$

$$14n+1=15\quad\Longrightarrow\quad n=1$$

Ainsi :

$$\boxed{\mathrm{R=CH_3}}$$

## Étape 5. Identifier B

$$\boxed{\mathrm{B=CH_3-CH(NH_2)-COOH}}$$

B est l'**alanine**, ou **acide 2-aminopropanoïque**.

## Bilan complet

$$\mathrm{Val+Alanine\longrightarrow Val-Ala+H_2O}$$

La liaison peptidique de D est $\mathrm{-CO-NH-}$. La mission utilise les quatre idées centrales de la leçon : **structure, séquence, sélectivité et masse molaire**.`,
    keyPoint: "Le peptide ciblé est Val-Ala : la masse 188 impose R=CH₃, donc B est l'alanine.",
    example: "$M(R)=188-173=15$ puis $14n+1=15$ donne $n=1$ et $\\mathrm{R=CH_3}$.",
    methodSteps: [
      "Écris la formule complète de la valine, avec son COOH.",
      "Traduis l'ordre terminal en une séquence explicite Val-B.",
      "Planifie les protections avant d'écrire l'équation de condensation.",
      "Soustrais la masse de la partie fixe pour isoler M(R).",
      "Résous 14n+1=M(R), identifie R puis nomme B.",
      "Vérifie la masse totale, l'eau éliminée et le motif CO-NH.",
    ],
    corrections: [
      "Page 5 : la formule de la valine est imprimée sans le groupe COOH ; il est rétabli dans l'énoncé et dans tous les calculs.",
      "Page 6 : 7M_N est corrigé en 2M_N, conformément à l'application numérique 2×14 et à la formule C7H13N2O3.",
      "Pages 5-6 : la consigne « B est l'acide α-aminé terminal » est précisée en « B est C-terminal », conformément à la formule du produit donnée par le corrigé.",
      "Page 6 : l'équation de condensation est réécrite avec les groupes carboxyle complets et la liaison peptidique nettement visible.",
    ],
    interaction: timeline(
      [
        { label: "Nommer la valine", shortLabel: "Val", detail: "Acide 2-amino-3-méthylbutanoïque, chaîne latérale isopropyle." },
        { label: "Fixer l'ordre", shortLabel: "Val-B", detail: "Valine N-terminale et B C-terminal." },
        { label: "Rendre la synthèse sélective", shortLabel: "P-A-C-D", detail: "Protéger, activer, coupler puis déprotéger." },
        { label: "Isoler R", shortLabel: "188−173=15", detail: "La masse de la partie inconnue est 15 g·mol−1." },
        { label: "Calculer n", shortLabel: "n=1", detail: "14n+1=15." },
        { label: "Conclure", shortLabel: "B=Ala", detail: "R=CH₃ : B est l'alanine et D est Val-Ala." },
      ],
      "Résoudre l'exercice 5 sans saut logique",
      "Chaque donnée a une fonction précise dans l'enquête.",
      "Parcours les six étapes et vérifie la conclusion à chaque transition.",
      "Le résultat final doit satisfaire simultanément la masse, la séquence et la structure α-aminée.",
    ),
    questions: [
      short("Donne le nom systématique de la valine.", ["acide 2-amino-3-méthylbutanoïque", "acide 2-amino-3-methylbutanoique"], "NH2 est en 2 et CH3 en 3.", "Exercice 5 - question 1.1", 2),
      short("Nomme la liaison particulière présente dans D.", ["liaison peptidique", "liaison amide", "peptidique"], "Le motif est CO-NH.", "Exercice 5 - question 1.2"),
      choice("Pour obtenir uniquement Val-B, quelle amine faut-il protéger ?", ["celle de la valine", "celle de B", "aucune", "les deux définitivement"], 0, "L'amine de B doit rester disponible pour le couplage.", "Exercice 5 - question 2", 2),
      choice("Pour obtenir uniquement Val-B, quel carboxyle faut-il protéger ?", ["celui de B", "celui de la valine", "aucun", "les deux définitivement"], 0, "Le carboxyle de la valine doit former la liaison.", "Exercice 5 - question 2", 2),
      choice("Quel carboxyle faut-il activer ?", ["celui de la valine", "celui de B", "aucun", "celui de l'eau"], 0, "Il réagit avec l'amine de B.", "Exercice 5 - question 2"),
      choice("Quelle séquence représente l'équation corrigée ?", ["Val-B", "B-Val", "Val-Val", "B-B"], 0, "La valine porte l'amine N-terminale libre.", "Exercice 5 - question 3", 2),
      short("Calcule la masse de la partie fixe du dipeptide.", ["173", "173 g/mol", "173 g.mol-1"], "$7×12+13+2×14+3×16=173$.", "Exercice 5 - question 4", 2),
      short("Calcule M(R).", ["15", "15 g/mol", "15 g.mol-1"], "$188-173=15$.", "Exercice 5 - question 4", 2),
      short("Résous l'équation 14n+1=15.", ["1", "n=1"], "$n=14/14=1$.", "Exercice 5 - question 4", 2),
      short("Donne la formule du groupe R.", ["CH3", "-CH3", "méthyle", "groupe méthyle"], "Pour n=1, R=C1H3.", "Exercice 5 - question 4"),
      short("Écris la formule semi-développée de B.", ["CH3-CH(NH2)-COOH", "H2N-CH(CH3)-COOH", "CH3CH(NH2)CO2H"], "R=CH3 donne l'alanine.", "Exercice 5 - question 5", 2),
      short("Nomme B.", ["alanine", "acide 2-aminopropanoïque", "acide 2-aminopropanoique"], "B est l'alanine.", "Exercice 5 - question 5", 2),
      choice("Dans Val-Ala, quel résidu est C-terminal ?", ["Ala", "Val", "les deux", "aucun"], 0, "Ala porte le carboxyle libre.", "Précision de séquence"),
      choice("Quel terme faut-il corriger dans le bilan imprimé ?", ["7MN en 2MN", "3MO en 7MO", "13MH en 1MH", "7MC en 2MC"], 0, "La partie fixe contient deux azotes.", "Correction documentée", 2),
      choice("Quelle vérification finale est correcte ?", ["Val + Ala - H2O a une masse de 188 g/mol", "188+18=188", "R ne contient aucun carbone", "D ne contient pas de liaison peptidique"], 0, "$117+89-18=188$ g·mol-1.", "Vérification enrichie", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const alphaAminoAcidsPath: LearningPath = {
  id: "terminale-d-chemistry-alpha-amino-acids",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Chimie organique" },
  chapterNumber: 21,
  title: "Les acides α-aminés",
  description: "Le cours officiel intégral, sans la situation d'apprentissage, enrichi de méthodes, d'interactions et de tous ses exercices corrigés.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître, représenter et nommer un acide α-aminé",
    "Prévoir sa forme dominante selon l'acidité du milieu",
    "Former, hydrolyser et caractériser une liaison peptidique",
    "Planifier une synthèse sélective et identifier un résidu par composition ou masse molaire",
  ],
  modules: [
    {
      id: "alpha-amino-acids-mastery",
      title: "Maîtriser les acides α-aminés",
      description: "Un niveau après l'autre, de la structure commune à l'identification complète d'un dipeptide.",
      lessons: builtLevels,
    },
  ],
};
