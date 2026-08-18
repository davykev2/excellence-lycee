import type {
  DiagramNodeItem,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  LessonSourceMetadata,
  SchemaHotspot,
  SchemaShape,
} from "../domain/paths";

const sourceDocument = "SVT Tle C_L8_La transmission dun caractère héréditaire chez lHomme.pdf";

const choice = (
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string,
  sourceLabel?: string,
  points = 1,
): LessonQuestion => ({ type: "choice", prompt, options, correctIndex, explanation, sourceLabel, points });

const short = (
  prompt: string,
  acceptedAnswers: string[],
  explanation: string,
  sourceLabel?: string,
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

const trueFalse = (
  prompt: string,
  answer: boolean,
  explanation: string,
  sourceLabel?: string,
): LessonQuestion => choice(prompt, ["Vrai", "Faux"], answer ? 0 : 1, explanation, sourceLabel);

const source = (
  pages: string,
  section: string,
  corrections: string[] = [],
): LessonSourceMetadata => ({
  documentTitle: sourceDocument,
  pages,
  section,
  fidelity: corrections.length ? "faithful-corrected" : "faithful",
  corrections,
});

const diagram = (
  title: string,
  instruction: string,
  rootLabel: string,
  rootDetail: string,
  nodes: DiagramNodeItem[],
  observation: string,
): LessonInteraction => ({
  kind: "diagram",
  eyebrow: "Enquête génétique",
  title,
  instruction,
  rootLabel,
  rootDetail,
  nodes: nodes as [DiagramNodeItem, DiagramNodeItem, ...DiagramNodeItem[]],
  observation,
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
  corrections: string[];
}

function officialLevel(index: number, seed: LevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: seed.xp,
    kind: seed.kind ?? "concept",
    source: source(seed.pages, seed.section, seed.corrections),
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
      introduction: "Observe d’abord les phénotypes et les liens familiaux ; formule ensuite une hypothèse de transmission, puis cherche le croisement qui la confirme ou la contredit.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Davy te rappelle : une seule contradiction certaine suffit à éliminer une hypothèse ; plusieurs cas compatibles ne la prouvent pas toujours à eux seuls.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const male = (x: number, y: number, affected = false): SchemaShape => ({
  shape: "path",
  d: `M${x - 17} ${y - 17} H${x + 17} V${y + 17} H${x - 17} Z`,
  tone: affected ? "accent" : "outline",
});

const female = (x: number, y: number, affected = false): SchemaShape => ({
  shape: "circle",
  cx: x,
  cy: y,
  r: 17,
  tone: affected ? "accent" : "outline",
});

const couple = (x1: number, x2: number, y: number): SchemaShape => ({
  shape: "line",
  x1: x1 + 17,
  y1: y,
  x2: x2 - 17,
  y2: y,
  tone: "muted",
});

const descent = (parentX: number, parentY: number, leftX: number, rightX: number, childY: number): SchemaShape[] => [
  { shape: "line", x1: parentX, y1: parentY, x2: parentX, y2: childY - 35, tone: "muted" },
  { shape: "line", x1: leftX, y1: childY - 35, x2: rightX, y2: childY - 35, tone: "muted" },
];

const albinismShapes: SchemaShape[] = [
  female(255, 85), male(385, 85), couple(255, 385, 85),
  ...descent(320, 85, 100, 540, 235),
  { shape: "line", x1: 100, y1: 200, x2: 100, y2: 218, tone: "muted" },
  { shape: "line", x1: 210, y1: 200, x2: 210, y2: 218, tone: "muted" },
  { shape: "line", x1: 320, y1: 200, x2: 320, y2: 218, tone: "muted" },
  { shape: "line", x1: 430, y1: 200, x2: 430, y2: 218, tone: "muted" },
  { shape: "line", x1: 540, y1: 200, x2: 540, y2: 218, tone: "muted" },
  female(100, 235), male(210, 235, true), female(320, 235, true), male(430, 235), male(540, 235, true),
  { shape: "text", x: 320, y: 305, content: "Pedigree d’albinisme — dessin pédagogique original", anchor: "middle" },
];

const albinismHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "parents", number: 1, label: "Deux parents non atteints", x: 320, y: 85, detail: "II1 et II2 n’expriment pas le caractère, mais chacun doit porter l’allèle récessif $a$ : ils sont $Aa$." },
  { id: "affected-son", number: 2, label: "Fils atteint", x: 210, y: 235, detail: "III2 est $aa$. Un enfant atteint issu de deux parents non atteints révèle une transmission récessive dans ce modèle." },
  { id: "affected-daughter", number: 3, label: "Fille atteinte", x: 320, y: 235, detail: "III3 est $aa$. Avec un père non atteint, ce cas contredit une transmission récessive liée à X." },
  { id: "unaffected", number: 4, label: "Enfants non atteints", x: 430, y: 235, detail: "III1 et III4 peuvent être $AA$ ou $Aa$ : leur seul phénotype ne tranche pas." },
  { id: "affected-last", number: 5, label: "Autre fils atteint", x: 540, y: 235, detail: "III5 est $aa$ et confirme que l’allèle $a$ a été transmis par les deux parents." },
];

const brachydactylyShapes: SchemaShape[] = [
  male(250, 82, true), female(390, 82), couple(250, 390, 82),
  ...descent(320, 82, 130, 510, 230),
  { shape: "line", x1: 130, y1: 195, x2: 130, y2: 213, tone: "muted" },
  { shape: "line", x1: 255, y1: 195, x2: 255, y2: 213, tone: "muted" },
  { shape: "line", x1: 385, y1: 195, x2: 385, y2: 213, tone: "muted" },
  { shape: "line", x1: 510, y1: 195, x2: 510, y2: 213, tone: "muted" },
  female(130, 230, true), male(255, 230), male(385, 230, true), female(510, 230, true),
  { shape: "text", x: 320, y: 300, content: "Pedigree de brachydactylie — dessin pédagogique original", anchor: "middle" },
];

const brachydactylyHotspots: [SchemaHotspot, SchemaHotspot, ...SchemaHotspot[]] = [
  { id: "affected-father", number: 1, label: "Père atteint", x: 250, y: 82, detail: "Le père transmet le caractère à des filles et à un fils : le modèle autosomique dominant est compatible." },
  { id: "unaffected-mother", number: 2, label: "Mère non atteinte", x: 390, y: 82, detail: "Dans le modèle dominant retenu, la mère est $nn$." },
  { id: "healthy-son", number: 3, label: "Fils non atteint", x: 255, y: 230, detail: "Sa présence impose que le père atteint soit hétérozygote $Nn$, et non $NN$." },
  { id: "affected-son", number: 4, label: "Fils atteint", x: 385, y: 230, detail: "Un père transmet son chromosome Y à son fils : ce fils atteint exclut une transmission dominante liée à X par le père." },
  { id: "both-sexes", number: 5, label: "Deux sexes atteints", x: 510, y: 230, detail: "La répartition observée est compatible avec un gène porté par un autosome." },
];

const levels: LevelSeed[] = [
  {
    id: "pedigree-method-notation",
    title: "Lire un pedigree et poser une hypothèse",
    summary: "Décoder les symboles d’un arbre généalogique, distinguer phénotype et génotype, puis tester dominance et localisation chromosomique.",
    pages: "1-2",
    section: "Hypothèses de transmission et conventions des arbres généalogiques",
    durationMinutes: 27,
    xp: 45,
    body: `
## 1. Un pedigree raconte une transmission familiale

Un **caractère héréditaire** est une particularité transmissible dont une part dépend d’un ou de plusieurs gènes. Le **phénotype** est ce que l’on observe ou mesure ; le **génotype** décrit les allèles portés au locus étudié. Une personne qui n’exprime pas un caractère récessif peut donc en porter l’allèle.

Dans un pedigree scolaire :

| Symbole | Signification |
|---|---|
| carré | homme |
| cercle | femme |
| symbole coloré | personne qui exprime le caractère |
| ligne horizontale | union |
| ligne verticale puis barre fraternelle | descendance |
| chiffre romain | génération |
| chiffre arabe | individu |

Le vocabulaire « personne atteinte » signifie seulement que le caractère étudié est présent. Il ne résume jamais la personne.

## 2. Dominant ou récessif ?

On note souvent $N$ l’allèle dominant et $n$ l’allèle récessif. Dans ce modèle simple :

- phénotype dominant : génotype $NN$ ou $Nn$ ;
- phénotype récessif : génotype $nn$.

Un enfant exprimant le caractère alors que ses deux parents ne l’expriment pas est un indice très fort d’une **transmission récessive** : chaque parent a pu transmettre un allèle masqué. À l’inverse, deux parents exprimant un caractère dominant peuvent avoir un enfant qui ne l’exprime pas s’ils sont tous deux hétérozygotes.

## 3. Autosome ou chromosome sexuel ?

Un **autosome** est un chromosome autre que X ou Y. Le mot ancien « hétérosome » du PDF est remplacé ici par **gonosome** ou **chromosome sexuel**. Pour un caractère récessif lié à X :

- un homme XY est **hémizygote** : il ne possède qu’une copie du locus sur X ;
- un père transmet son chromosome X à ses filles, jamais à ses fils ;
- une fille exprimant le caractère doit recevoir l’allèle concerné sur chacun de ses deux chromosomes X dans le modèle simple.

La bonne méthode n’est pas de compter grossièrement les hommes et les femmes. Il faut trouver un **croisement informatif** capable de contredire une hypothèse.

> **Astuce mémoire — D-A-C :** **D**ominance, **A**utosome ou X, **C**roisement de contrôle.

> **Précision :** un pedigree limité montre qu’un modèle est compatible ou incompatible avec les données. Des mutations nouvelles, une pénétrance incomplète ou d’autres mécanismes peuvent compliquer des situations réelles.
`,
    keyPoint: "Lire un pedigree revient à identifier le phénotype, tester dominant/récessif, puis autosomique/lié à X à l’aide d’un croisement informatif.",
    example: "Deux parents non atteints ont une fille atteinte : le caractère est compatible avec un modèle autosomique récessif et incompatible avec un modèle récessif lié à X si le père est non atteint.",
    methodSteps: [
      "Recopie la légende et repère les générations.",
      "Cherche d’abord un enfant dont le phénotype diffère de celui de ses deux parents.",
      "Teste la dominance sans attribuer trop vite un génotype unique.",
      "Teste ensuite le chromosome X en suivant ce que le père transmet à ses filles et à ses fils.",
      "Conserve l’hypothèse qui n’est contredite par aucun croisement du pedigree.",
    ],
    interaction: diagram(
      "Construire le diagnostic en cinq questions",
      "Ouvre chaque étape dans l’ordre et transforme l’arbre en démonstration.",
      "Pedigree",
      "Un arbre généalogique fournit des contraintes : chaque enfant reçoit un allèle de chacun de ses parents.",
      [
        { id: "legend", label: "1. Lire la légende", role: "Identifier", detail: "Carré = homme, cercle = femme, symbole coloré = caractère exprimé." },
        { id: "phenotypes", label: "2. Relever les phénotypes", role: "Observer", detail: "Décris uniquement ce qui est visible avant de proposer des génotypes." },
        { id: "dominance", label: "3. Tester la dominance", role: "Comparer", detail: "Parents non atteints avec enfant atteint : piste récessive. Parents atteints avec enfant non atteint : piste dominante." },
        { id: "chromosome", label: "4. Tester X", role: "Éliminer", detail: "Un père ne transmet pas X à son fils ; une fille récessive liée à X exige un père porteur de l’allèle." },
        { id: "genotypes", label: "5. Écrire les génotypes", role: "Conclure", detail: "Commence par les individus certains, puis remonte vers les parents obligatoirement porteurs." },
      ],
      "La couleur d’un symbole donne un phénotype ; le génotype se déduit seulement après le test du mode de transmission.",
    ),
    questions: [
      choice("Quel symbole représente traditionnellement une femme dans un pedigree ?", ["Un cercle", "Un carré", "Une flèche", "Un triangle"], 0, "Le cercle représente une femme.", "Conventions du pedigree • page 2"),
      choice("Que représente un symbole coloré ?", ["Un génotype obligatoirement homozygote", "L’expression du caractère étudié", "Une naissance multiple", "Une mutation certaine"], 1, "La couleur code le phénotype observé."),
      choice("Quelle notion décrit les allèles portés par un individu ?", ["La génération", "Le phénotype", "Le génotype", "La descendance"], 2, "Le génotype correspond à la combinaison allélique."),
      choice("Quel croisement oriente vers une transmission récessive ?", ["Deux parents atteints et tous les enfants atteints", "Un père atteint et une fille atteinte", "Une mère atteinte et un fils atteint", "Deux parents non atteints et un enfant atteint"], 3, "L’allèle récessif peut être masqué chez chacun des parents."),
      trueFalse("Un père transmet son chromosome X à chacun de ses fils.", false, "Dans le modèle XY, le fils reçoit Y de son père et X de sa mère."),
      choice("Comment nomme-t-on un homme qui ne possède qu’une copie d’un locus porté par X ?", ["Hémizygote", "Hétérozygote", "Triploïde", "Codominant"], 0, "Il est hémizygote pour ce locus lié à X."),
      choice("Quelle démarche est la plus fiable pour localiser le gène ?", ["Compter seulement les hommes atteints", "Chercher un croisement qui contredit une hypothèse", "Supposer tout caractère dominant", "Ignorer les filles"], 1, "Une contradiction mendélienne est plus informative qu’un simple comptage."),
      choice("Quel mot moderne remplace « hétérosome » dans ce cours ?", ["Autosome", "Allèle", "Gonosome", "Phénotype"], 2, "Gonosome ou chromosome sexuel sont les termes utilisés."),
      choice("Que peut-on conclure d’un petit pedigree sans analyse moléculaire ?", ["Le gène exact est toujours identifié", "Toute exception est impossible", "Le diagnostic médical est certain", "Un modèle est compatible ou incompatible avec les données"], 3, "Le pedigree teste des modèles de transmission sous des hypothèses données."),
      short("Écris les trois lettres de l’astuce : dominance, autosome ou X, croisement de contrôle.", ["DAC", "D-A-C", "D A C"], "L’astuce mémoire est D-A-C."),
    ],
    corrections: [
      "L’activité introductive sur la polydactylie n’est pas utilisée comme cours, conformément à la démarche éditoriale retenue.",
      "Le terme source « hétérosome » est modernisé en « gonosome » ou « chromosome sexuel ».",
      "La différence entre compatibilité d’un modèle et preuve absolue est explicitée.",
      "Le titre interne « Leçon 7 » du PDF est corrigé en leçon 8 pour respecter la progression officielle utilisée par le catalogue.",
    ],
  },
  {
    id: "albinism-recessive-evidence",
    title: "Établir la récessivité dans le pedigree d’albinisme",
    summary: "Exploiter les enfants atteints de parents non atteints pour identifier un allèle récessif et attribuer les génotypes certains.",
    pages: "2",
    section: "Analyse du pedigree d’albinisme et détermination de la dominance",
    durationMinutes: 29,
    xp: 55,
    body: `
## 1. Décrire avant d’interpréter

Le pedigree officiel présente deux parents, II1 et II2, qui n’expriment pas l’albinisme étudié. Leur descendance comprend des filles et des garçons, dont trois personnes atteintes : III2, III3 et III5.

La phrase utile est : **deux parents non atteints ont des enfants atteints des deux sexes**. Elle rassemble les deux indices qui serviront au raisonnement sans inventer de génotype.

## 2. Tester l’hypothèse dominante

Si l’allèle responsable était dominant avec pénétrance complète dans le modèle scolaire, une personne atteinte devrait généralement posséder cet allèle et au moins l’un des deux parents devrait l’exprimer. Or les deux parents ne présentent pas le phénotype. L’hypothèse dominante simple est donc rejetée.

On retient un allèle récessif $a$ :

| Individu | Phénotype | Génotype déductible |
|---|---|---|
| II1 | non atteint | $Aa$ |
| II2 | non atteint | $Aa$ |
| III2, III3, III5 | atteints | $aa$ |
| III1, III4 | non atteints | $AA$ ou $Aa$ |

Les deux parents sont **hétérozygotes porteurs** : chacun a nécessairement donné $a$ à leurs enfants $aa$. Pour chaque conception du croisement $Aa × Aa$, les probabilités théoriques sont $1/4$ $AA$, $1/2$ $Aa$ et $1/4$ $aa$.

## 3. Une probabilité n’est pas un quota familial

Le fait d’observer trois enfants atteints sur cinq ne contredit pas la probabilité $1/4$. Chaque conception constitue un nouvel événement aléatoire. Un petit nombre d’enfants peut s’éloigner fortement des proportions théoriques.

## 4. Nommer précisément le modèle

Le document parle d’« albinisme ». Il faut éviter de généraliser : les albinismes forment un ensemble génétiquement hétérogène. Le pedigree étudié et le modèle classique de nombreux albinismes oculocutanés sont compatibles avec une transmission **autosomique récessive**. D’autres formes, notamment certains albinismes oculaires, peuvent suivre un autre mode.

> **Astuce mémoire — caché chez les parents, visible chez l’enfant :** pense d’abord à un allèle récessif.
`,
    keyPoint: "Dans le pedigree officiel, II1 et II2 sont $Aa$ ; les individus atteints sont $aa$, tandis qu’un individu non atteint peut être $AA$ ou $Aa$.",
    example: "III4 n’est pas atteint : on ne peut pas choisir entre $AA$ et $Aa$ avec son seul phénotype.",
    methodSteps: [
      "Formule la constatation : parents non atteints, enfants atteints.",
      "Rejette le modèle dominant simple.",
      "Note $a$ l’allèle récessif et écris $aa$ chez chaque personne atteinte.",
      "Déduis $Aa$ chez chacun des deux parents.",
      "Laisse deux possibilités, $AA$ ou $Aa$, chez un enfant non atteint si aucune descendance ne tranche.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Pedigree redessiné",
      title: "Explorer la famille étudiée",
      instruction: "Sélectionne les repères pour passer du phénotype au génotype.",
      viewBox: "0 0 640 330",
      caption: "Représentation pédagogique originale du pedigree d’albinisme de la page 2.",
      shapes: albinismShapes,
      hotspots: albinismHotspots,
      observation: "Les trois enfants atteints sont $aa$ ; les deux parents non atteints doivent chacun être porteurs $Aa$.",
    },
    questions: [
      choice("Quelle observation établit la piste récessive ?", ["Deux parents non atteints ont des enfants atteints", "Tous les enfants sont non atteints", "Seuls les parents sont atteints", "Le nombre de filles égale celui des garçons"], 0, "Un allèle récessif peut être masqué chez chacun des parents.", "Interprétation du pedigree • page 2"),
      choice("Quel génotype possède nécessairement III3, qui exprime le caractère ?", ["$AA$", "$aa$", "$Aa$ uniquement", "$A-$"], 1, "Dans le modèle récessif, une personne atteinte est $aa$."),
      choice("Quel génotype possède nécessairement le père II2 ?", ["$AA$", "$aa$", "$Aa$", "Impossible même avec ses enfants"], 2, "Non atteint mais père d’enfants $aa$, il doit porter $a$."),
      choice("Que peut-on écrire pour l’enfant non atteint III4 ?", ["$aa$ uniquement", "$Aa$ uniquement", "$AA$ uniquement", "$AA$ ou $Aa$"], 3, "Le phénotype dominant ne distingue pas homozygote et hétérozygote."),
      trueFalse("Trois enfants atteints sur cinq invalident automatiquement le croisement $Aa × Aa$.", false, "Une probabilité théorique n’impose pas un quota exact dans une petite fratrie."),
      choice("Quelle proportion théorique de descendants $aa$ donne $Aa × Aa$ ?", ["$1/4$", "$1/2$", "$3/4$", "$1$"], 0, "Une case sur quatre de l’échiquier est $aa$."),
      choice("Pourquoi II1 est-elle porteuse ?", ["Parce que toutes les femmes le sont", "Elle a transmis $a$ à un enfant $aa$ tout en étant non atteinte", "Parce que son conjoint est un homme", "Parce qu’elle est $AA$"], 1, "Son phénotype non atteint et ses enfants atteints imposent $Aa$."),
      choice("Quel mot qualifie II1 et II2 pour ce locus ?", ["Homozygotes récessifs", "Hémizygotes", "Hétérozygotes", "Codominants"], 2, "Ils portent deux allèles différents, $A$ et $a$."),
      choice("Quelle formulation est scientifiquement prudente ?", ["Tous les albinismes sont identiques", "Le pedigree prouve le gène précis", "Le sexe décide du génotype", "Ce pedigree est compatible avec un albinisme autosomique récessif"], 3, "Le mot « compatible » respecte la diversité génétique des albinismes."),
      short("Écris le croisement des deux parents du pedigree.", ["Aa x Aa", "Aa × Aa", "Aa*Aa", "Aa Aa"], "Les deux parents sont hétérozygotes : $Aa × Aa$."),
    ],
    corrections: [
      "L’albinisme n’est pas présenté comme une entité génétique unique : le raisonnement porte sur le pedigree et le modèle oculocutané récessif étudiés.",
      "Les proportions mendéliennes sont présentées comme des probabilités à chaque conception, pas comme un quota obligatoire dans la fratrie.",
      "Les personnes non atteintes III1 et III4 conservent les deux génotypes possibles $AA$ ou $Aa$.",
    ],
  },
  {
    id: "albinism-autosomal-test",
    title: "Éliminer la liaison à X et conclure autosomique",
    summary: "Construire l’hypothèse récessive liée à X, la confronter à la fille atteinte de père non atteint, puis conclure par contradiction.",
    pages: "3-4",
    section: "Échiquier lié à X, confrontation au pedigree et génotypes",
    durationMinutes: 31,
    xp: 65,
    body: `
## 1. Une hypothèse doit faire une prédiction

Après avoir établi la récessivité, le document teste si l’allèle pourrait être porté par le chromosome X. Notons $X^A$ l’allèle usuel et $X^a$ l’allèle récessif étudié.

Le père II2 est non atteint. Dans le modèle lié à X, il serait donc $X^A Y$. Pour avoir des fils atteints, la mère non atteinte devrait être porteuse $X^A X^a$.

Le croisement prédit :

| Gamète maternel | $X^A$ paternel | $Y$ paternel |
|---|---|---|
| $X^A$ | $X^A X^A$ : fille non atteinte | $X^A Y$ : fils non atteint |
| $X^a$ | $X^A X^a$ : fille non atteinte porteuse | $X^a Y$ : fils atteint |

Les fils peuvent donc être atteints, mais **aucune fille ne devrait exprimer le caractère**, car toutes reçoivent $X^A$ de leur père non atteint.

## 2. La contradiction décisive

III3 est une fille atteinte. Pour être $X^aX^a$, elle devrait recevoir $X^a$ de sa mère et de son père. Or son père non atteint possède $X^A$, pas $X^a$. L’observation est incompatible avec le modèle récessif lié à X retenu.

On conserve alors la localisation **autosomique récessive**, qui explique sans contradiction :

$$Aa × Aa → AA,\ Aa,\ Aa,\ aa$$

Le raisonnement ne consiste pas à dire « les deux sexes sont atteints, donc autosomique ». Un caractère lié à X peut toucher les deux sexes. C’est la transmission impossible de l’allèle paternel à la fille qui tranche ici.

## 3. Attribuer les génotypes sans dépasser les données

- II1 et II2 : $Aa$ ;
- III2, III3 et III5 : $aa$ ;
- III1 et III4 : $AA$ ou $Aa$.

Un test génétique ou une descendance informative serait nécessaire pour distinguer $AA$ de $Aa$ chez les personnes non atteintes.

> **Astuce mémoire — fille récessive liée à X : regarde le père.** S’il est non atteint dans le modèle simple, l’hypothèse est contradictoire.
`,
    keyPoint: "La fille atteinte III3 et son père non atteint excluent le modèle récessif lié à X ; le caractère étudié est compatible avec une transmission autosomique récessive.",
    example: "Un père $X^A Y$ donne toujours $X^A$ à ses filles : aucune ne peut être $X^aX^a$ avec ce père.",
    methodSteps: [
      "Écris le génotype lié à X du père non atteint : $X^A Y$.",
      "Écris celui de la mère porteuse supposée : $X^A X^a$.",
      "Construis les quatre issues de l’échiquier.",
      "Compare la prédiction « aucune fille atteinte » à III3.",
      "Rejette l’hypothèse liée à X et reviens au modèle autosomique $Aa × Aa$.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Preuve par contradiction",
      title: "Tester puis éliminer l’hypothèse liée à X",
      instruction: "Parcours les cinq étapes du raisonnement et repère le moment où le modèle échoue.",
      items: [
        { label: "Récessivité établie", shortLabel: "Récessif", detail: "Les deux parents non atteints ont des enfants atteints." },
        { label: "Hypothèse liée à X", shortLabel: "$X^a$", detail: "Père $X^A Y$, mère supposée $X^A X^a$." },
        { label: "Prédiction", shortLabel: "Filles non atteintes", detail: "Toutes les filles reçoivent $X^A$ du père." },
        { label: "Observation", shortLabel: "III3 atteinte", detail: "La fille III3 exprime pourtant le caractère." },
        { label: "Conclusion", shortLabel: "Autosome", detail: "Le modèle récessif lié à X est rejeté ; $Aa × Aa$ explique le pedigree." },
      ],
      observation: "La conclusion autosomique repose sur une incompatibilité de transmission, pas sur un simple comptage des sexes.",
    },
    questions: [
      choice("Quel génotype lié à X aurait le père non atteint ?", ["$X^A Y$", "$X^aY$", "$X^AX^a$", "$YY$"], 0, "Son unique chromosome X porte l’allèle non pathologique dans l’hypothèse.", "Hypothèse chromosomique • page 3"),
      choice("Quel génotype aurait la mère porteuse non atteinte ?", ["$X^aX^a$", "$X^AX^a$", "$X^AY$", "$X^AX^A$ uniquement"], 1, "Elle doit porter $X^a$ pour avoir un fils atteint."),
      choice("Quelle catégorie l’échiquier prévoit-il parmi les filles ?", ["Toutes atteintes", "Une moitié atteinte", "Aucune atteinte", "Toutes $X^aX^a$"], 2, "Le père transmet $X^A$ à toutes ses filles."),
      choice("Quel individu contredit directement cette prédiction ?", ["II1", "II2", "III2", "III3"], 3, "III3 est une fille atteinte de père non atteint.", "Interprétation • page 4"),
      trueFalse("Le fait que les deux sexes soient atteints suffit toujours à prouver une localisation autosomique.", false, "Certains caractères liés à X peuvent aussi atteindre des femmes et des hommes."),
      choice("Quel chromosome le père transmet-il à ses filles ?", ["Son chromosome X", "Son chromosome Y", "Les deux X et Y", "Aucun chromosome sexuel"], 0, "Une fille reçoit le chromosome X paternel."),
      choice("Pourquoi III3 ne peut-elle pas être $X^aX^a$ dans cette hypothèse ?", ["Sa mère ne transmet aucun X", "Son père non atteint lui transmet $X^A$", "Une femme ne possède pas de X", "Le caractère est dominant"], 1, "Le X paternel empêche l’homozygotie $X^aX^a$."),
      choice("Quel modèle reste compatible avec tout le pedigree ?", ["Dominant lié à Y", "Dominant lié à X", "Autosomique récessif", "Mitochondrial obligatoire"], 2, "$Aa × Aa$ produit des enfants atteints et non atteints des deux sexes."),
      choice("Quel génotype autosomique est certain pour III5 ?", ["$AA$", "$Aa$", "$A-$", "$aa$"], 3, "III5 exprime le phénotype récessif."),
      short("Écris le génotype lié à X d’une fille atteinte dans le modèle récessif testé.", ["X^aX^a", "XᵃXᵃ", "XaXa", "X^a X^a"], "Une fille atteinte devrait recevoir $X^a$ de ses deux parents."),
    ],
    corrections: [
      "La preuve autosomique est reliée explicitement à la fille III3 atteinte et au père II2 non atteint.",
      "Le raccourci « les deux sexes sont atteints donc autosomique » est remplacé par une preuve de transmission.",
      "La notation liée à X est harmonisée en $X^A$ et $X^a$.",
    ],
  },
  {
    id: "brachydactyly-dominant-autosomal",
    title: "Diagnostiquer une transmission autosomique dominante",
    summary: "Utiliser le pedigree de brachydactylie pour établir la dominance, éliminer la liaison à X et déterminer les génotypes parentaux.",
    pages: "4-5",
    section: "Pedigree de brachydactylie, dominance et localisation autosomique",
    durationMinutes: 30,
    xp: 70,
    body: `
## 1. Repérer le croisement informatif

Le père I1 exprime la brachydactylie étudiée et la mère I2 ne l’exprime pas. Leur descendance comprend des personnes atteintes et une personne non atteinte, dans les deux sexes.

Le fils non atteint est décisif. Si le père atteint possède un allèle dominant $N$, il ne peut pas être $NN$, car il transmettrait $N$ à tous ses enfants avec une mère $nn$. Il est donc **hétérozygote $Nn$**, tandis que la mère non atteinte est $nn$.

Le croisement est :

$$Nn × nn → 1/2\ Nn\ \text{atteints et}\ 1/2\ nn\ \text{non atteints}$$

La fratrie réelle n’a pas à respecter exactement la moitié dans un petit effectif.

## 2. Tester la liaison dominante à X

Supposons le caractère dominant lié à X. Un père atteint serait $X^NY$ et une mère non atteinte $X^nX^n$.

- toutes les filles recevraient $X^N$ du père et seraient atteintes ;
- tous les fils recevraient $Y$ du père et $X^n$ de la mère, donc seraient non atteints.

Or le pedigree comporte un fils atteint. Le père ne peut pas lui avoir transmis son chromosome X. Cette observation élimine la transmission dominante liée à X dans le modèle.

## 3. Conclure sans généraliser

Le modèle **autosomique dominant** explique la transmission observée :

- I1 : $Nn$ ;
- I2 : $nn$ ;
- enfants atteints : $Nn$ avec ce croisement ;
- enfant non atteint : $nn$.

La brachydactylie désigne un groupe hétérogène de malformations caractérisées par des doigts ou orteils courts. Beaucoup de formes isolées suivent une transmission autosomique dominante, mais le pedigree scolaire ne permet pas d’identifier à lui seul un type clinique ou un gène précis.

> **Astuce mémoire — père atteint, fils atteint :** une transmission dominante liée à X par le père est impossible ; cherche le modèle autosomique.
`,
    keyPoint: "Le pedigree est compatible avec une transmission autosomique dominante : le père est $Nn$, la mère $nn$, et le fils atteint exclut la liaison dominante à X.",
    example: "Le fils II3 reçoit Y de son père. Son caractère ne peut donc pas provenir d’un allèle dominant porté par le X paternel.",
    methodSteps: [
      "Observe la présence du caractère sur plusieurs générations.",
      "Utilise l’enfant non atteint pour établir que le parent atteint est hétérozygote.",
      "Écris le croisement autosomique $Nn × nn$.",
      "Teste ensuite le modèle dominant lié à X.",
      "Utilise le fils atteint pour rejeter ce dernier modèle.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Pedigree redessiné",
      title: "Suivre le caractère de brachydactylie",
      instruction: "Sélectionne chaque personne informative et lis ce qu’elle impose au modèle.",
      viewBox: "0 0 640 325",
      caption: "Représentation pédagogique originale du pedigree de brachydactylie des pages 4-5.",
      shapes: brachydactylyShapes,
      hotspots: brachydactylyHotspots,
      observation: "L’enfant non atteint impose $Nn$ chez le père ; le fils atteint exclut la transmission dominante du chromosome X paternel.",
    },
    questions: [
      choice("Quel individu prouve que le père atteint n’est pas $NN$ ?", ["L’enfant non atteint", "La mère non atteinte seule", "N’importe quelle fille atteinte", "Le grand-père absent"], 0, "Un père $NN$ et une mère $nn$ n’auraient que des enfants $Nn$ atteints.", "Interprétation du pedigree • page 5"),
      choice("Quel génotype autosomique retient-on pour le père I1 ?", ["$NN$", "$Nn$", "$nn$", "$X^NY$ après conclusion"], 1, "Il est atteint mais a un enfant non atteint."),
      choice("Quel génotype retient-on pour la mère I2 ?", ["$NN$", "$Nn$", "$nn$", "$X^NX^N$"], 2, "Dans le modèle dominant, une personne non atteinte est $nn$."),
      choice("Quelle observation exclut directement la liaison dominante à X ?", ["Une fille atteinte", "La mère non atteinte", "Une fille non atteinte uniquement", "Un fils atteint du père atteint"], 3, "Le père donne Y, non X, à son fils."),
      trueFalse("Un père transmet son chromosome X à toutes ses filles.", true, "Dans le modèle XY, chaque fille reçoit le X paternel."),
      choice("Quelle proportion théorique d’enfants atteints donne $Nn × nn$ ?", ["$1/2$", "$1/4$", "$3/4$", "$1$"], 0, "Deux types de gamètes paternels donnent deux issues équiprobables."),
      choice("Quel génotype possède un enfant atteint dans ce croisement précis ?", ["$NN$", "$Nn$", "$nn$", "$N-$ sans autre précision possible"], 1, "La mère $nn$ donne toujours $n$, donc l’enfant atteint est $Nn$."),
      choice("Pourquoi faut-il éviter de généraliser à toutes les brachydactylies ?", ["Elles ne sont jamais héréditaires", "Elles touchent uniquement les hommes", "Elles forment un groupe génétiquement hétérogène", "Elles sont toujours liées à Y"], 2, "Plusieurs types et plusieurs gènes existent."),
      choice("Quelle conclusion respecte les données ?", ["Le gène précis est identifié", "Toute personne atteinte est $NN$", "Le caractère est forcément présent dans toute descendance", "Le pedigree est compatible avec un modèle autosomique dominant"], 3, "Le pedigree établit un mode compatible, pas l’identité moléculaire du gène."),
      short("Écris le croisement parental autosomique retenu.", ["Nn x nn", "Nn × nn", "Nn*nn", "Nn nn"], "Le père est $Nn$ et la mère $nn$."),
    ],
    corrections: [
      "La brachydactylie est présentée comme un groupe hétérogène ; le pedigree porte sur le caractère familial étudié.",
      "Le fils atteint est utilisé comme contradiction précise du modèle dominant lié à X.",
      "Les proportions de $Nn × nn$ sont données comme probabilités par conception.",
    ],
  },
  {
    id: "abo-codominance-polyallelism",
    title: "Expliquer le système ABO par codominance et polyallélisme",
    summary: "Déduire les génotypes d’une famille A × B ayant des enfants A, B, AB et O, avec la notation moderne $I^A$, $I^B$ et $i$.",
    pages: "6-7",
    section: "Pedigree des groupes sanguins ABO, codominance et polyallélisme",
    durationMinutes: 32,
    xp: 75,
    body: `
## 1. Trois allèles principaux dans la population, deux chez une personne

Le système ABO repose, dans le modèle scolaire, sur trois allèles principaux :

- $I^A$ : permet l’expression de l’antigène A ;
- $I^B$ : permet l’expression de l’antigène B ;
- $i$ : ne produit ni antigène A ni antigène B fonctionnel dans ce modèle.

Le locus ABO se situe sur le chromosome 9. Chaque personne diploïde ne porte pourtant que **deux** allèles, un reçu de chaque parent. La présence de plus de deux allèles possibles dans la population se nomme **polyallélisme**.

## 2. Codominance de A et B

$I^A$ et $I^B$ sont codominants : chez $I^AI^B$, les deux phénotypes s’expriment simultanément et donnent le groupe AB. L’allèle $i$ est récessif face à $I^A$ et $I^B$.

| Groupe | Génotypes possibles |
|---|---|
| A | $I^AI^A$ ou $I^Ai$ |
| B | $I^BI^B$ ou $I^Bi$ |
| AB | $I^AI^B$ |
| O | $ii$ |

## 3. Résoudre le pedigree officiel

La mère I1 est de groupe A, le père I2 de groupe B. Leur enfant II1 est AB : la mère a transmis $I^A$ et le père $I^B$. Leur enfant II2 est O : chaque parent lui a transmis $i$.

Les génotypes parentaux sont donc nécessairement :

$$I^Ai × I^Bi$$

L’échiquier prévoit quatre issues théoriques de probabilité $1/4$ :

| Descendant | Génotype | Groupe |
|---|---|---|
| 1 | $I^AI^B$ | AB |
| 2 | $I^Ai$ | A |
| 3 | $I^Bi$ | B |
| 4 | $ii$ | O |

Le fils II3 de groupe A est $I^Ai$, car son père B ne peut lui transmettre que $i$ pour obtenir A. La fille II4 de groupe B est $I^Bi$, car sa mère A lui transmet alors $i$.

> **Correction du PDF :** la page 7 appelle par erreur I1 « mère de groupe B ». Le pedigree de la page 6 et le raisonnement montrent qu’elle est de groupe **A**.

> **Astuce mémoire — AB ensemble, O caché :** $I^A$ et $I^B$ s’expriment ensemble ; $i$ ne se voit qu’en double.
`,
    keyPoint: "Dans la famille officielle, la mère A est $I^Ai$, le père B est $I^Bi$ et leurs quatre groupes d’enfants sont expliqués par codominance et polyallélisme.",
    example: "La présence de l’enfant O suffit à révéler $i$ chez chacun des deux parents.",
    methodSteps: [
      "Commence par les phénotypes à génotype unique : AB et O.",
      "Utilise l’enfant O pour imposer $i$ chez les deux parents.",
      "Complète le parent A par $I^A$ et le parent B par $I^B$.",
      "Construis l’échiquier $I^Ai × I^Bi$.",
      "Vérifie chaque enfant sans confondre codominance et dominance complète.",
    ],
    interaction: diagram(
      "Reconstituer la famille ABO",
      "Sélectionne chaque personne et retrouve l’allèle transmis par chacun des parents.",
      "$I^Ai × I^Bi$",
      "L’enfant O révèle les deux allèles $i$ ; l’enfant AB montre l’expression simultanée de $I^A$ et $I^B$.",
      [
        { id: "mother-a", label: "Mère I1 — groupe A", role: "$I^Ai$", detail: "Elle transmet $I^A$ à l’enfant AB ou A, et $i$ à l’enfant B ou O." },
        { id: "father-b", label: "Père I2 — groupe B", role: "$I^Bi$", detail: "Il transmet $I^B$ à l’enfant AB ou B, et $i$ à l’enfant A ou O." },
        { id: "child-ab", label: "II1 — groupe AB", role: "$I^AI^B$", detail: "Les deux allèles codominants s’expriment." },
        { id: "child-o", label: "II2 — groupe O", role: "$ii$", detail: "Chaque parent a obligatoirement fourni un allèle $i$." },
        { id: "child-a", label: "II3 — groupe A", role: "$I^Ai$", detail: "Le père B lui fournit $i$ ; la mère lui fournit $I^A$." },
        { id: "child-b", label: "II4 — groupe B", role: "$I^Bi$", detail: "La mère A lui fournit $i$ ; le père lui fournit $I^B$." },
      ],
      "Le pedigree permet ici d’identifier exactement les génotypes, car les enfants AB et O révèlent les quatre allèles parentaux.",
    ),
    questions: [
      choice("Quel génotype correspond au groupe O dans le modèle scolaire ?", ["$ii$", "$I^Ai$", "$I^BI^B$", "$I^AI^B$"], 0, "Le phénotype O usuel nécessite deux allèles $i$.", "Interprétation du pedigree • pages 6-7"),
      choice("Quelle relation unit $I^A$ et $I^B$ ?", ["Récessivité de A", "Codominance", "Dominance de B", "Liaison au chromosome X"], 1, "Les deux antigènes s’expriment chez une personne AB."),
      choice("Quel génotype parental explique la mère A ayant un enfant O ?", ["$I^AI^A$", "$I^AI^B$", "$I^Ai$", "$ii$"], 2, "Elle doit porter et transmettre $i$."),
      choice("Quel est le génotype du père B de cette famille ?", ["$I^BI^B$", "$I^AI^B$", "$ii$", "$I^Bi$"], 3, "L’enfant O impose $i$ chez le père."),
      trueFalse("Une personne porte les trois allèles principaux du système ABO.", false, "La population possède trois allèles principaux, mais une personne diploïde n’en porte que deux."),
      choice("Quel enfant révèle directement la codominance ?", ["L’enfant AB", "L’enfant O", "L’enfant A seulement", "L’enfant B seulement"], 0, "$I^A$ et $I^B$ s’expriment ensemble."),
      choice("Quel terme désigne plus de deux allèles possibles dans la population ?", ["Hémizygotie", "Polyallélisme", "Monosomie", "Épistasie obligatoire"], 1, "ABO est un exemple classique de série allélique multiple."),
      choice("Sur quel chromosome se situe le locus ABO ?", ["X", "Y", "9", "21 uniquement"], 2, "Le gène ABO se situe sur le chromosome 9."),
      choice("Quelle coquille de la page 7 faut-il corriger ?", ["Le père est O", "L’enfant AB est A", "II2 est une fille", "La mère I1 est dite B alors qu’elle est A"], 3, "Le pedigree montre clairement une mère A."),
      short("Écris le génotype de l’enfant II4 de groupe B.", ["I^Bi", "Iᴮi", "IBi", "I^B i"], "La mère A fournit $i$ et le père B fournit $I^B$."),
    ],
    corrections: [
      "La notation manuscrite A/O et B/O est normalisée en $I^Ai$ et $I^Bi$.",
      "La mère I1, appelée par erreur « de groupe B » à la page 7, est rétablie comme groupe A conformément au pedigree.",
      "Le polyallélisme dans la population est distingué des deux allèles portés par une personne diploïde.",
      "La localisation du locus ABO sur le chromosome 9 est ajoutée comme précision moderne.",
    ],
  },
  {
    id: "red-green-x-linked-recessive",
    title: "Modéliser le daltonisme rouge-vert lié à X",
    summary: "Déduire la mère porteuse, raisonner sur l’hémizygotie masculine et résoudre le croisement femme atteinte × homme non atteint.",
    pages: "7-9",
    section: "Pedigree du daltonisme, génotypes liés à X et échiquier",
    durationMinutes: 33,
    xp: 85,
    body: `
## 1. Un caractère récessif porté par X

Le document étudie une déficience de la vision rouge-vert, couramment appelée daltonisme rouge-vert. Notons $X^D$ l’allèle de vision rouge-vert usuelle et $X^d$ l’allèle récessif étudié.

Dans le modèle scolaire :

- femme non atteinte non porteuse : $X^DX^D$ ;
- femme non atteinte porteuse : $X^DX^d$ ;
- femme atteinte : $X^dX^d$ ;
- homme non atteint : $X^DY$ ;
- homme atteint : $X^dY$.

Un homme n’est ni homozygote ni hétérozygote pour ce locus : avec un seul chromosome X, il est **hémizygote**.

## 2. Déduire la mère porteuse

Les parents 1 et 2 n’expriment pas le caractère, mais leur fils 5 est atteint. Le fils reçoit Y de son père et son chromosome X de sa mère. L’allèle $X^d$ vient donc de la mère, qui est porteuse $X^DX^d$. Le père non atteint est simplement $X^DY$.

> **Correction du PDF :** la page 8 affirme que « ses deux parents sont hétérozygotes ». Cette phrase est impossible pour le père XY au locus lié à X. Seule la mère peut être hétérozygote ; le père est hémizygote $X^DY$.

## 3. Résoudre le couple 12 × 13

La femme 12 est atteinte : $X^dX^d$. L’homme 13 est non atteint : $X^DY$.

| Gamète maternel | $X^D$ paternel | $Y$ paternel |
|---|---|---|
| $X^d$ | $X^DX^d$ : fille non atteinte porteuse | $X^dY$ : fils atteint |

Toutes les filles prévues sont porteuses non atteintes et tous les fils prévus sont atteints, dans ce croisement précis. Le père ne transmet jamais son X à ses fils.

## 4. Ne pas confondre un cas avec toutes les déficiences colorées

La transmission récessive liée à X décrit surtout les déficiences rouge-vert dues aux gènes d’opsines concernés. Toutes les anomalies de vision des couleurs n’ont pas nécessairement le même mode de transmission.

> **Astuce mémoire — le X du fils vient de sa mère :** pour expliquer un fils atteint, remonte d’abord vers le chromosome X maternel.
`,
    keyPoint: "Le daltonisme rouge-vert étudié est récessif lié à X : les hommes sont hémizygotes, la mère 2 est $X^DX^d$, et le croisement 12 × 13 donne des filles porteuses et des fils atteints.",
    example: "Le fils 5 est $X^dY$ : Y vient du père, donc $X^d$ vient nécessairement de la mère 2.",
    methodSteps: [
      "Écris d’abord le chromosome reçu du père : X pour une fille, Y pour un fils.",
      "Chez un fils atteint, attribue l’allèle porté par X à la mère.",
      "N’emploie jamais « hétérozygote » pour l’homme au locus lié à X.",
      "Détermine les gamètes du couple avant de remplir l’échiquier.",
      "Annonce séparément le résultat pour les filles et pour les fils.",
    ],
    interaction: {
      kind: "timeline",
      eyebrow: "Transmission liée à X",
      title: "Suivre l’allèle $X^d$ dans la famille",
      instruction: "Parcours la chaîne de transmission et identifie l’origine de chaque chromosome.",
      items: [
        { label: "Père 1 non atteint", shortLabel: "$X^DY$", detail: "Il donne Y à son fils 5 ; il ne peut donc pas lui transmettre l’allèle lié à X." },
        { label: "Mère 2 porteuse", shortLabel: "$X^DX^d$", detail: "Elle n’exprime pas le caractère mais transmet $X^d$ au fils 5." },
        { label: "Fils 5 atteint", shortLabel: "$X^dY$", detail: "Son unique allèle au locus sur X s’exprime : il est hémizygote." },
        { label: "Femme 12 atteinte", shortLabel: "$X^dX^d$", detail: "Elle ne produit que des ovules porteurs de $X^d$ pour ce locus." },
        { label: "Homme 13 non atteint", shortLabel: "$X^DY$", detail: "Il produit des spermatozoïdes $X^D$ ou Y." },
        { label: "Descendance", shortLabel: "Filles porteuses, fils atteints", detail: "$X^DX^d$ pour les filles et $X^dY$ pour les fils dans le croisement étudié." },
      ],
      observation: "La direction de transmission du chromosome X explique les résultats sans avoir à mémoriser une liste isolée.",
    },
    questions: [
      choice("Quel génotype possède un homme atteint dans ce modèle ?", ["$X^dY$", "$X^dX^d$", "$X^DX^d$", "$YY$"], 0, "Son unique chromosome X porte l’allèle $d$.", "Analyse du pedigree • page 8"),
      choice("Quel génotype possède la mère 2 non atteinte ayant un fils atteint ?", ["$X^DX^D$", "$X^DX^d$", "$X^dX^d$", "$X^DY$"], 1, "Elle est porteuse hétérozygote."),
      choice("Quel terme décrit le père pour ce locus lié à X ?", ["Hétérozygote", "Homozygote", "Hémizygote", "Polyallélique"], 2, "Il ne possède qu’une copie du locus sur son chromosome X."),
      choice("Quel chromosome le fils 5 reçoit-il de son père ?", ["$X^d$", "$X^D$", "Les deux X", "Y"], 3, "Un fils XY reçoit Y de son père."),
      trueFalse("Le père 1 et la mère 2 sont tous deux hétérozygotes pour ce locus.", false, "Seule la mère XX peut être hétérozygote ici ; le père est hémizygote."),
      choice("Quel génotype possède la femme 12 atteinte ?", ["$X^dX^d$", "$X^DX^d$", "$X^DX^D$", "$X^dY$"], 0, "Le caractère récessif s’exprime chez elle avec deux allèles $d$."),
      choice("Quel phénotype prévoit-on pour les filles de 12 × 13 ?", ["Atteintes", "Non atteintes porteuses", "Sans chromosome X", "Toutes homozygotes $X^DX^D$"], 1, "Elles reçoivent $X^D$ du père et $X^d$ de la mère."),
      choice("Quel phénotype prévoit-on pour les fils de 12 × 13 ?", ["Non atteints porteurs", "Porteurs sans expression", "Atteints", "Tous $X^DY$"], 2, "Ils reçoivent $X^d$ de la mère et Y du père."),
      choice("Quelle formulation est précise ?", ["Toutes les visions colorées sont liées à X", "Une femme ne peut jamais être atteinte", "Le père transmet toujours le daltonisme à ses fils", "La déficience rouge-vert étudiée suit un modèle récessif lié à X"], 3, "Le cours porte sur la forme rouge-vert et son modèle."),
      short("Écris le génotype d’une fille non atteinte porteuse.", ["X^DX^d", "XᴰXᵈ", "XDXd", "X^D X^d"], "Une fille porteuse possède un allèle $D$ et un allèle $d$."),
    ],
    corrections: [
      "La phrase source « ses deux parents sont hétérozygotes » est corrigée : le père est hémizygote $X^DY$, seule la mère est hétérozygote.",
      "Le terme général « daltonisme » est précisé comme déficience rouge-vert dans le cas étudié.",
      "La transmission père-fils est explicitement exclue pour un caractère porté par X.",
    ],
  },
  {
    id: "inheritance-mode-decision-method",
    title: "Choisir le mode de transmission sans raccourci",
    summary: "Assembler une stratégie unique pour distinguer autosomique dominant, autosomique récessif, dominant lié à X et récessif lié à X.",
    pages: "2-9",
    section: "Synthèse méthodologique des quatre pedigrees du cours",
    durationMinutes: 34,
    xp: 90,
    body: `
## 1. Commencer par la dominance

Un pedigree se résout avec des **cas informatifs**, pas avec une impression visuelle.

| Observation familiale | Modèle simple suggéré |
|---|---|
| deux parents non atteints ont un enfant atteint | récessif |
| deux parents atteints ont un enfant non atteint | dominant |
| une personne atteinte a un parent atteint à chaque génération | dominant possible, mais pas preuve suffisante |
| le caractère saute des générations | récessif possible, mais pas preuve suffisante |

Ces règles supposent un modèle mendélien simple, une pénétrance complète et l’absence de mutation nouvelle. Dans un exercice scolaire, elles permettent de choisir l’hypothèse à tester.

## 2. Tester ensuite le chromosome X

### Pour un caractère dominant lié à X

Un père atteint transmet son X à **toutes ses filles** et à **aucun de ses fils**. Donc :

- une fille non atteinte d’un père atteint contredit le modèle ;
- un fils atteint ne peut pas avoir reçu l’allèle lié à X de son père.

### Pour un caractère récessif lié à X

Une fille atteinte doit recevoir l’allèle récessif sur ses deux X. Son père doit donc être atteint dans le modèle simple. Une fille atteinte de père non atteint constitue une contradiction directe.

Un homme reçoit son X de sa mère. Un fils atteint révèle donc un allèle maternel, mais cela ne suffit pas seul à prouver la liaison à X : un modèle autosomique récessif peut produire la même observation.

## 3. Attribuer les génotypes dans le bon ordre

1. Écris les génotypes certains du phénotype récessif.
2. Utilise les enfants pour identifier les parents obligatoirement hétérozygotes.
3. Dans une transmission dominante, utilise un enfant non atteint pour révéler $n$ chez chacun des parents concernés.
4. Garde une écriture ouverte — $NN$ ou $Nn$, $AA$ ou $Aa$ — lorsqu’aucun croisement ne tranche.

## 4. Séparer conclusion et preuve

Une bonne réponse possède toujours trois phrases :

1. **Constat :** « Les parents… ont un enfant… »
2. **Prédiction :** « Si le caractère était…, alors… »
3. **Conclusion :** « Or…, donc l’hypothèse est rejetée/retenue comme compatible. »

Ne conclus jamais « autosomique parce que les deux sexes sont atteints ». Les caractères liés à X peuvent toucher les deux sexes. Cherche une transmission père-fille, père-fils ou une fille récessive qui rende une hypothèse impossible.

> **Astuce mémoire — C-P-C :** **C**onstat, **P**rédiction, **C**onclusion. C’est la forme d’une démonstration complète.
`,
    keyPoint: "La méthode sûre suit trois temps : établir dominant/récessif, tester les prédictions liées à X, puis attribuer seulement les génotypes imposés par le pedigree.",
    example: "Parents non atteints + fille atteinte + père non atteint : récessif, puis liaison récessive à X impossible ; on retient autosomique récessif.",
    methodSteps: [
      "Cherche le couple et l’enfant dont les phénotypes s’opposent.",
      "Décide dominant ou récessif avec ce croisement.",
      "Écris la prédiction exacte d’un modèle lié à X.",
      "Cherche un seul individu qui contredit cette prédiction.",
      "Attribue les génotypes certains et conserve les alternatives restantes.",
      "Rédige constat, prédiction et conclusion.",
    ],
    interaction: diagram(
      "Le diagnostic en quatre branches",
      "Choisis une hypothèse et découvre le test qui peut l’éliminer.",
      "Mode de transmission",
      "On n’adopte pas une branche parce qu’elle « ressemble » au pedigree : on vérifie toutes ses prédictions.",
      [
        { id: "autosomal-recessive", label: "Autosomique récessif", role: "$Aa × Aa$", detail: "Deux parents non atteints peuvent avoir un enfant $aa$ atteint, quel que soit son sexe." },
        { id: "autosomal-dominant", label: "Autosomique dominant", role: "$Nn × nn$ ou $Nn × Nn$", detail: "Deux parents atteints hétérozygotes peuvent avoir un enfant $nn$ non atteint." },
        { id: "x-recessive", label: "Récessif lié à X", role: "Regarder le père d’une fille atteinte", detail: "Une fille $X^aX^a$ doit recevoir $X^a$ de son père, qui est donc atteint dans le modèle." },
        { id: "x-dominant", label: "Dominant lié à X", role: "Regarder toute la descendance du père", detail: "Un père atteint transmet le caractère à toutes ses filles et à aucun fils par son chromosome X." },
        { id: "uncertain", label: "Génotype non tranché", role: "Garder deux possibilités", detail: "Un phénotype dominant isolé ne distingue pas $NN$ de $Nn$." },
      ],
      "La même fratrie peut être compatible avec plusieurs hypothèses ; les relations de transmission éliminent les modèles impossibles.",
    ),
    questions: [
      choice("Quelle étape vient en premier ?", ["Tester dominant ou récessif", "Chercher le chromosome 9", "Attribuer tous les génotypes au hasard", "Compter uniquement les hommes"], 0, "La dominance structure les génotypes possibles."),
      choice("Quel constat suggère une transmission dominante ?", ["Deux parents non atteints ont un enfant atteint", "Deux parents atteints ont un enfant non atteint", "Tous les enfants ont le même sexe", "Une famille a deux générations"], 1, "Deux hétérozygotes dominants peuvent produire $nn$."),
      choice("Quel cas contredit un modèle récessif lié à X ?", ["Un fils atteint de mère porteuse", "Une fille atteinte de père atteint", "Une fille atteinte de père non atteint", "Un homme non atteint"], 2, "La fille devrait recevoir l’allèle récessif de son père."),
      choice("Quel cas contredit un modèle dominant lié à X transmis par le père ?", ["Toutes ses filles atteintes", "Aucun fils atteint", "Une mère non atteinte", "Un fils atteint ou une fille non atteinte"], 3, "Le père donne X à ses filles et Y à ses fils."),
      trueFalse("La présence de personnes atteintes des deux sexes prouve à elle seule une localisation autosomique.", false, "Il faut examiner les transmissions, car un caractère lié à X peut toucher les deux sexes."),
      choice("Que doit contenir la première phrase d’une démonstration ?", ["Le constat tiré du pedigree", "Une conclusion sans preuve", "Une définition hors sujet", "Le nom du gène supposé"], 0, "La démonstration commence par les données observées."),
      choice("Dans quelle situation garde-t-on $NN$ ou $Nn$ ?", ["Pour un phénotype récessif", "Pour un phénotype dominant sans descendance informative", "Pour tout homme lié à X", "Pour un groupe O"], 1, "Le phénotype dominant seul ne distingue pas les deux génotypes."),
      choice("D’où vient le chromosome X d’un fils ?", ["Du père", "Des deux parents", "De la mère", "D’aucun parent"], 2, "Le père fournit Y au fils."),
      choice("Quelle séquence forme une preuve complète ?", ["Prédiction, oubli, réponse", "Conclusion, constat, aucune hypothèse", "Définition, calcul, dessin", "Constat, prédiction, conclusion"], 3, "C-P-C structure la justification."),
      short("Écris les trois lettres de l’astuce « constat, prédiction, conclusion ».", ["CPC", "C-P-C", "C P C"], "L’astuce est C-P-C."),
    ],
    corrections: [
      "Les quatre modèles de transmission sont comparés par prédictions testables et non par comptage des sexes.",
      "La notion de pénétrance complète est signalée comme hypothèse du modèle scolaire.",
      "Les génotypes incertains restent explicitement ouverts lorsqu’aucun croisement ne tranche.",
    ],
  },
  {
    id: "official-two-pedigrees-assessment",
    title: "Résoudre l’exercice officiel des pedigrees A et B",
    summary: "Classer vrai ou faux les huit propositions de l’exercice 1, puis justifier les génotypes parentaux dans chaque famille.",
    pages: "10",
    section: "Exercice 1 — comparaison de deux arbres généalogiques",
    durationMinutes: 39,
    xp: 105,
    kind: "challenge",
    body: `
## 1. Pedigree A : deux parents atteints, des enfants non atteints

Dans la première famille, les deux parents 1 et 2 expriment le caractère. Ils ont pourtant des enfants qui ne l’expriment pas. Une transmission récessive simple est impossible : deux parents $nn$ ne produiraient que des enfants $nn$ atteints.

On retient un caractère **dominant**. La présence d’enfants non atteints $nn$ impose que chacun des deux parents puisse transmettre $n$ :

$$Nn × Nn$$

Le caractère est **autosomique** dans le cadre du pedigree. Une transmission dominante liée à X est notamment contredite par les relations père-enfants du schéma : le père atteint n’impose pas le phénotype à toutes ses filles et le caractère ne suit pas exclusivement son X.

| Proposition A | Verdict | Justification |
|---|---|---|
| caractère récessif | Faux | deux parents atteints auraient seulement des enfants atteints |
| caractère dominant | Vrai | $Nn × Nn$ peut produire $nn$ |
| gène autosomique | Vrai | le modèle explique les deux sexes et les transmissions |
| gène lié au sexe | Faux | les prédictions liées à X sont contredites |

## 2. Pedigree B : deux parents non atteints, des enfants atteints

Dans la seconde famille, les parents 1 et 2 n’expriment pas le caractère, mais ils ont un fils et une fille atteints. Le caractère est **récessif** et chaque parent est porteur :

$$Aa × Aa$$

La fille atteinte possède $aa$. Si le caractère était récessif lié à X, elle devrait recevoir l’allèle récessif de son père ; or le père non atteint ne le porte pas sur son unique X. Le modèle est donc **autosomique récessif**.

| Proposition B | Verdict | Justification |
|---|---|---|
| caractère récessif | Vrai | parents non atteints, enfants atteints |
| caractère dominant | Faux | le modèle dominant simple exige un parent atteint |
| gène autosomique | Vrai | $Aa × Aa$ explique fils et fille atteints |
| gène lié au sexe | Faux | la fille atteinte a un père non atteint |

## 3. La copie attendue

Ne donne pas seulement V ou F. Même si la consigne demande de relever les affirmations exactes, ajoute une ligne de justification :

- A : dominant autosomique, parents 1 et 2 $Nn$ ;
- B : récessif autosomique, parents 1 et 2 $Aa$.

> **Astuce mémoire :** A montre « atteints → enfant non atteint », donc dominant ; B montre « non atteints → enfant atteint », donc récessif.
`,
    keyPoint: "Pedigree A : autosomique dominant avec parents $Nn$ ; pedigree B : autosomique récessif avec parents $Aa$.",
    example: "Dans B, la fille atteinte et le père non atteint éliminent la transmission récessive liée à X.",
    methodSteps: [
      "Traite les deux pedigrees séparément.",
      "Dans A, pars des deux parents atteints et des enfants non atteints.",
      "Dans B, pars des deux parents non atteints et des enfants atteints.",
      "Teste la liaison à X avec les relations père-fille et père-fils.",
      "Écris les quatre verdicts et les génotypes parentaux pour chaque famille.",
    ],
    interaction: diagram(
      "Comparer les deux démonstrations",
      "Ouvre chaque dossier et retrouve le croisement qui explique toute la famille.",
      "Exercice officiel 1",
      "Les deux pedigrees inversent la relation parents-enfants et conduisent donc à deux dominances différentes.",
      [
        { id: "a-observation", label: "A — observation", role: "Parents atteints, enfants non atteints", detail: "Le phénotype non atteint apparaît chez la descendance de deux personnes atteintes." },
        { id: "a-model", label: "A — modèle", role: "Autosomique dominant", detail: "$Nn × Nn$ explique des enfants $NN$, $Nn$ ou $nn$." },
        { id: "a-answer", label: "A — réponses", role: "F, V, V, F", detail: "Récessif faux ; dominant vrai ; autosomique vrai ; lié au sexe faux." },
        { id: "b-observation", label: "B — observation", role: "Parents non atteints, enfants atteints", detail: "Deux allèles récessifs masqués se rencontrent chez certains enfants." },
        { id: "b-model", label: "B — modèle", role: "Autosomique récessif", detail: "$Aa × Aa$ explique les enfants $aa$ atteints." },
        { id: "b-answer", label: "B — réponses", role: "V, F, V, F", detail: "Récessif vrai ; dominant faux ; autosomique vrai ; lié au sexe faux." },
      ],
      "Le contraste entre A et B constitue un entraînement complet au test de dominance.",
    ),
    questions: [
      trueFalse("Pedigree A — Le caractère est récessif.", false, "Deux parents atteints récessifs ne pourraient avoir d’enfants non atteints.", "Exercice 1, pedigree A • page 10"),
      trueFalse("Pedigree A — Le caractère est dominant.", true, "$Nn × Nn$ peut donner un enfant $nn$ non atteint.", "Exercice 1, pedigree A • page 10"),
      trueFalse("Pedigree A — Le gène est autosomique dans le modèle retenu.", true, "Le modèle autosomique dominant explique les transmissions observées.", "Exercice 1, pedigree A • page 10"),
      trueFalse("Pedigree A — Le caractère est lié au sexe.", false, "Les relations père-enfants contredisent les prédictions d’un modèle simple lié à X.", "Exercice 1, pedigree A • page 10"),
      choice("Quels génotypes attribue-t-on aux parents 1 et 2 du pedigree A ?", ["$Nn$ et $Nn$", "$NN$ et $NN$", "$nn$ et $nn$", "$Nn$ et $nn$"], 0, "Chacun est atteint et doit pouvoir transmettre $n$."),
      trueFalse("Pedigree B — Le caractère est récessif.", true, "Deux parents non atteints ont des enfants atteints.", "Exercice 1, pedigree B • page 10"),
      trueFalse("Pedigree B — Le caractère est dominant.", false, "Dans le modèle dominant simple, un enfant atteint devrait avoir un parent atteint.", "Exercice 1, pedigree B • page 10"),
      trueFalse("Pedigree B — Le gène est autosomique dans le modèle retenu.", true, "La fille atteinte de père non atteint élimine notamment le modèle récessif lié à X.", "Exercice 1, pedigree B • page 10"),
      trueFalse("Pedigree B — Le caractère est lié au sexe.", false, "La transmission observée est incompatible avec le modèle récessif lié à X.", "Exercice 1, pedigree B • page 10"),
      choice("Quels génotypes attribue-t-on aux parents 1 et 2 du pedigree B ?", ["$AA$ et $AA$", "$aa$ et $aa$", "$Aa$ et $Aa$", "$AA$ et $aa$"], 2, "Ils sont non atteints mais transmettent chacun $a$ à leurs enfants atteints."),
      choice("Quelle observation est décisive pour la dominance dans A ?", ["Un enfant non atteint de deux parents atteints", "La présence de deux générations", "Le nombre total d’enfants", "La forme des symboles"], 0, "Elle impose l’allèle récessif chez chacun des parents atteints."),
      choice("Quelle observation exclut la liaison récessive à X dans B ?", ["Un fils atteint", "Une fille atteinte de père non atteint", "Une mère non atteinte", "Deux enfants non atteints"], 1, "La fille devrait recevoir l’allèle récessif de son père."),
      short("Écris les quatre verdicts du pedigree B dans l’ordre : récessif, dominant, autosomique, lié au sexe.", ["V F V F", "V,F,V,F", "V-F-V-F", "v f v f"], "Les réponses sont Vrai, Faux, Vrai, Faux."),
    ],
    corrections: [
      "Les huit affirmations de l’exercice officiel sont conservées et accompagnées d’une justification.",
      "Les génotypes parentaux sont explicités : $Nn × Nn$ pour A et $Aa × Aa$ pour B.",
      "La conclusion autosomique de B est fondée sur la fille atteinte de père non atteint, pas sur le seul fait que les deux sexes soient touchés.",
    ],
  },
  {
    id: "nodules-pedigree-final-mission",
    title: "Expertiser le pedigree des nodules faciaux",
    summary: "Résoudre l’exercice officiel 2, déterminer les génotypes certains et expliquer pourquoi six enfants atteints ne prouvent pas un génotype homozygote.",
    pages: "11",
    section: "Exercice 2 — caractère familial des nodules colorés du visage",
    durationMinutes: 43,
    xp: 125,
    kind: "challenge",
    body: `
## Mission — Conseiller une équipe de génétique

Le pedigree officiel suit un caractère décrit comme de « petits nodules colorés sur le visage ». Les individus 1 et 2 expriment tous deux le caractère, mais plusieurs de leurs enfants — 3, 6 et 7 — ne l’expriment pas. Leur fille 9, atteinte, a six enfants atteints avec l’homme 8, non atteint.

L’équipe te demande d’établir le mode de transmission, les génotypes de 1, 2, 4 et 6, puis le génotype de 9.

## 1. Dominant ou récessif ?

Si le caractère était récessif, les deux parents atteints seraient $nn$ et tous leurs enfants seraient $nn$ atteints. Or plusieurs enfants sont non atteints. Le modèle récessif est rejeté.

Le caractère est donc **dominant** dans le modèle scolaire. Les enfants non atteints sont $nn$. Pour produire ces enfants, chacun des deux parents atteints doit transmettre $n$ :

$$1 : Nn \qquad 2 : Nn$$

## 2. Autosome ou chromosome X ?

Le père 2 est atteint mais certaines de ses filles, notamment 6 et 7, ne le sont pas. Dans un modèle dominant lié à X, un père atteint transmettrait son X porteur à toutes ses filles. Cette observation exclut la liaison dominante à X.

Le caractère est compatible avec une transmission **autosomique dominante**.

## 3. Génotypes demandés

| Individu | Phénotype | Génotype |
|---|---|---|
| 1 | atteinte | $Nn$ |
| 2 | atteint | $Nn$ |
| 4 | atteint | $NN$ ou $Nn$ |
| 6 | non atteinte | $nn$ |
| 8 | non atteint | $nn$ |
| 9 | atteinte | $NN$ ou $Nn$ avant information supplémentaire |

L’individu 4 n’a pas de descendance informative dans le schéma : il faut garder $NN$ ou $Nn$.

## 4. Les six enfants de 9 donnent-ils un génotype exact ?

Avec le conjoint 8 $nn$ :

- si 9 est $NN$, tous les enfants sont $Nn$ et atteints ;
- si 9 est $Nn$, chaque enfant a une probabilité $1/2$ d’être atteint.

Les six enfants observés sont tous atteints. Cela rend $NN$ très compatible, mais **ne prouve pas** que 9 est $NN$. Si elle est $Nn$, la probabilité d’obtenir six enfants atteints est :

$$(1/2)^6 = 1/64$$

Ce résultat est peu fréquent, mais possible. Un nombre fini de naissances ne transforme pas une probabilité en certitude. La réponse rigoureuse est donc : **9 peut être $NN$ ou $Nn$ ; la fratrie favorise l’hypothèse $NN$ sans l’établir exactement**.

> **Correction majeure :** si le corrigé scolaire exige « 9 est $NN$ » parce que tous ses enfants sont atteints, il confond résultat observé et résultat nécessaire. Un test moléculaire ou une descendance révélant un enfant non atteint pourrait mieux trancher.

> **Astuce mémoire — zéro enfant non atteint ne vaut pas zéro probabilité :** un échantillon familial n’est jamais un échiquier complet obligatoire.
`,
    keyPoint: "Le caractère est autosomique dominant ; 1 et 2 sont $Nn$, 4 est $NN$ ou $Nn$, 6 est $nn$, et 9 reste $NN$ ou $Nn$ malgré ses six enfants atteints.",
    example: "Si 9 est $Nn$ avec 8 $nn$, six enfants atteints successifs ont une probabilité $(1/2)^6=1/64$ : rare ne signifie pas impossible.",
    methodSteps: [
      "Utilise les enfants non atteints de deux parents atteints pour établir la dominance.",
      "Déduis $Nn$ chez les parents 1 et 2.",
      "Élimine la liaison dominante à X grâce aux filles non atteintes du père 2.",
      "Attribue $nn$ aux personnes non atteintes et garde les alternatives chez les personnes atteintes.",
      "Compare les deux croisements possibles de 9 avec 8 : $NN × nn$ et $Nn × nn$.",
      "Distingue une hypothèse favorisée d’un génotype démontré avec certitude.",
    ],
    interaction: diagram(
      "Présenter l’expertise finale",
      "Ouvre chaque preuve et construis une réponse qui distingue certitude, possibilité et probabilité.",
      "Pedigree des nodules faciaux",
      "Deux parents atteints ont des enfants non atteints ; leur fille atteinte a six enfants atteints avec un conjoint non atteint.",
      [
        { id: "dominance", label: "Parents 1 et 2", role: "$Nn × Nn$", detail: "Leurs enfants non atteints imposent $n$ chez chacun et établissent le modèle dominant." },
        { id: "autosomal", label: "Filles 6 et 7 non atteintes", role: "Exclusion liée à X", detail: "Le père 2 atteint aurait transmis un X dominant à toutes ses filles." },
        { id: "individual-4", label: "Individu 4 atteint", role: "$NN$ ou $Nn$", detail: "Son phénotype et l’absence de descendance informative ne permettent pas de trancher." },
        { id: "individual-6", label: "Individu 6 non atteinte", role: "$nn$", detail: "Le phénotype non dominant fixe son génotype." },
        { id: "individual-9", label: "Femme 9 atteinte", role: "$NN$ ou $Nn$", detail: "Les six enfants atteints favorisent $NN$ mais restent possibles avec $Nn$." },
        { id: "probability", label: "Six enfants atteints", role: "$1/64$ si 9 est $Nn$", detail: "Un résultat rare ne devient pas impossible ; le pedigree ne donne pas un génotype exact." },
      ],
      "Une expertise scientifique annonce le modèle le mieux soutenu et les limites des données au lieu de fabriquer une certitude.",
    ),
    questions: [
      choice("Quel constat établit la dominance ?", ["Deux parents atteints ont des enfants non atteints", "Tous les enfants de 9 sont atteints", "L’individu 8 est un homme", "La famille compte trois générations"], 0, "Deux parents récessifs atteints ne pourraient avoir d’enfant non atteint.", "Exercice 2, question 1 • page 11"),
      choice("Quels génotypes possèdent les parents 1 et 2 ?", ["$NN$ et $NN$", "$Nn$ et $Nn$", "$nn$ et $nn$", "$NN$ et $nn$"], 1, "Chacun doit transmettre $n$ aux enfants non atteints.", "Exercice 2, question 3 • page 11"),
      choice("Quelle localisation retient-on ?", ["Liée à Y", "Dominante liée à X", "Autosomique", "Mitochondriale obligatoire"], 2, "Le père atteint a des filles non atteintes.", "Exercice 2, question 2 • page 11"),
      choice("Quel est le génotype de l’individu 6 non atteinte ?", ["$NN$", "$Nn$", "$N-$", "$nn$"], 3, "Dans un modèle dominant, une personne non atteinte est $nn$.", "Exercice 2, question 3 • page 11"),
      trueFalse("L’individu 4 atteint est nécessairement $NN$.", false, "Il peut être $NN$ ou $Nn$ ; aucune descendance informative ne tranche."),
      choice("Quel génotype possède l’homme 8 non atteint ?", ["$nn$", "$Nn$", "$NN$", "$X^NY$"], 0, "Le caractère dominant n’est pas exprimé chez $nn$."),
      choice("Si la femme 9 est $NN$, quelle descendance prévoit $NN × nn$ ?", ["La moitié atteinte", "Tous les enfants $Nn$ atteints", "Tous les enfants $nn$", "Un quart atteint"], 1, "Chaque enfant reçoit N de la mère et n du père."),
      choice("Si la femme 9 est $Nn$, quelle est la probabilité qu’un enfant soit atteint avec 8 $nn$ ?", ["$1/4$", "$3/4$", "$1/2$", "$1$"], 2, "Le croisement produit $Nn$ ou $nn$ avec la même probabilité."),
      choice("Quelle est la probabilité de six enfants atteints si 9 est $Nn$ ?", ["$1/2$", "$1/12$", "$1/36$", "$1/64$"], 3, "Les six conceptions indépendantes donnent $(1/2)^6$.", "Exercice 2, question 4 • page 11"),
      trueFalse("Six enfants atteints prouvent avec certitude que 9 est $NN$.", false, "Le résultat reste possible avec $Nn$, avec une probabilité de $1/64$."),
      choice("Quelle réponse est rigoureuse pour le génotype de 9 ?", ["$NN$ ou $Nn$, avec $NN$ favorisé mais non prouvé", "$NN$ uniquement avec certitude", "$nn$", "$X^NX^N$ obligatoire"], 0, "Le pedigree favorise une hypothèse sans éliminer l’autre."),
      choice("Quelle observation exclut la liaison dominante à X ?", ["Le fils 4 atteint", "Les filles 6 et 7 non atteintes d’un père atteint", "Les six enfants atteints", "La mère 1 atteinte"], 1, "Un père atteint lié à X transmettrait le caractère à toutes ses filles."),
      short("Écris la probabilité simplifiée de six enfants atteints si 9 est $Nn$.", ["1/64", "1 sur 64", "0,015625", "0.015625"], "La probabilité est $(1/2)^6=1/64$."),
    ],
    corrections: [
      "La conclusion attendue « femme 9 obligatoirement $NN$ » est rectifiée : $Nn$ reste possible avec une probabilité de $1/64$ pour six enfants atteints.",
      "Le génotype de l’individu 4 reste $NN$ ou $Nn$ faute de descendance informative.",
      "La liaison dominante à X est éliminée par les filles non atteintes du père 2 atteint.",
      "La différence entre résultat rare et résultat impossible est explicitée.",
    ],
  },
];

const levelOrder = [
  "pedigree-method-notation",
  "albinism-recessive-evidence",
  "albinism-autosomal-test",
  "brachydactyly-dominant-autosomal",
  "abo-codominance-polyallelism",
  "red-green-x-linked-recessive",
  "inheritance-mode-decision-method",
  "official-two-pedigrees-assessment",
  "nodules-pedigree-final-mission",
] as const;

const builtLevels = levelOrder.map((id, index) => {
  const seed = levels.find((level) => level.id === id);
  if (!seed) throw new Error(`Niveau hérédité humaine introuvable : ${id}`);
  return officialLevel(index, seed);
});

export const terminalCSvtHumanHeredityPath: LearningPath = {
  id: "terminale-c-svt-l8-human-heredity",
  subjectId: "svt",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 4, title: "La transmission des caractères héréditaires" },
  chapterNumber: 8,
  title: "La transmission d’un caractère héréditaire chez l’Homme",
  description: "Le cours officiel restructuré en neuf niveaux interactifs : lecture de pedigrees, transmissions autosomiques récessive et dominante, système ABO, caractère récessif lié à X, stratégie de diagnostic et exercices d’évaluation.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Lire et légender un arbre généalogique sans confondre phénotype et génotype",
    "Distinguer caractère dominant et récessif à partir de croisements informatifs",
    "Tester une localisation autosomique ou liée au chromosome X par contradiction",
    "Utiliser les notations modernes du système ABO et expliquer codominance et polyallélisme",
    "Résoudre les deux exercices officiels en formulant des conclusions proportionnées aux données",
  ],
  modules: [
    {
      id: "human-heredity-mastery",
      title: "Maîtriser la transmission héréditaire chez l’Homme",
      description: "Neuf niveaux progressifs, des conventions du pedigree à la mission officielle sur un caractère facial familial.",
      lessons: builtLevels,
    },
  ],
};
