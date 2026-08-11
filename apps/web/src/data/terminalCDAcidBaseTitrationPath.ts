import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L11_Dosage Acido-Basique (2).pdf";

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
      tip: "Un dosage se résume à une seule égalité : à l’équivalence, les réactifs sont dans les proportions de l’équation-bilan.",
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
    id: "titration-principle",
    title: "Qu’est-ce qu’un dosage ?",
    summary: "Comprendre le principe d’un dosage, les conditions que doit remplir la réaction et les équations-bilans utilisables.",
    pages: "1-2",
    section: "I. Généralités",
    durationMinutes: 18,
    xp: 45,
    body: String.raw`## 1. Le protocole expérimental

On prélève un volume $V_a$ de la solution **à doser** que l’on verse dans un **erlenmeyer**. On y ajoute quelques gouttes d’un **indicateur coloré** approprié. À l’aide d’une **burette graduée**, on verse progressivement la **solution titrante** jusqu’à l’apparition d’une nouvelle couleur. On relève alors le volume $V_{\text{éq}}$ de solution versée.

> **Retiens la répartition des rôles.** Ce qu’on cherche est **dans l’erlenmeyer**, en volume connu mais de concentration inconnue. Ce qu’on connaît est **dans la burette**, et c’est son volume qu’on lit. Inverser les deux est l’erreur la plus fréquente en travaux pratiques.

## 2. Le principe

> Un **dosage** est une technique expérimentale qui permet de déterminer la **concentration molaire $C$ inconnue** d’une espèce chimique dans une solution.

De façon générale, on fait réagir une espèce **A** de concentration $C_A$ **inconnue** sur une espèce **B** de concentration $C_B$ **connue**, selon la réaction :

$$\mathrm{A}+\mathrm{B}\ \longrightarrow\ \mathrm{D}$$

### Les trois conditions sur la réaction

Cette réaction doit être **unique**, **rapide** et **totale**. Chacune est indispensable, pour une raison différente :

| Condition | Pourquoi elle est nécessaire |
|---|---|
| **unique** | si une seconde réaction consommait le réactif, le volume versé ne mesurerait plus la bonne quantité |
| **rapide** | il faut que chaque goutte ait fini de réagir avant qu’on lise le résultat |
| **totale** | sinon une partie du réactif resterait sans réagir et on sous-estimerait la concentration |

C’est précisément pour cela que les réactions acido-basiques conviennent : la leçon précédente a établi qu’elles sont **totales**.

## Les équations-bilans utilisables

| Famille | Équation-bilan |
|---|---|
| Acide fort – base forte | $\mathrm{H_3O^+}+\mathrm{OH^-}\longrightarrow2\,\mathrm{H_2O}$ |
| Acide faible – base forte | $\mathrm{AH}+\mathrm{OH^-}\longrightarrow\mathrm{A^-}+\mathrm{H_2O}$ |
| Acide faible – base forte (type $\mathrm{BH^+}$) | $\mathrm{BH^+}+\mathrm{OH^-}\longrightarrow\mathrm{B}+\mathrm{H_2O}$ |
| Acide fort – base faible | $\mathrm{H_3O^+}+\mathrm{A^-}\longrightarrow\mathrm{AH}+\mathrm{H_2O}$ |
| Acide fort – base faible (type $\mathrm{B}$) | $\mathrm{H_3O^+}+\mathrm{B}\longrightarrow\mathrm{BH^+}+\mathrm{H_2O}$ |

## Les deux types de dosage acido-basique

| Type | Comment on repère l’équivalence | Ce qu’il faut |
|---|---|---|
| **Colorimétrique** | par le **changement de couleur** d’un indicateur | quelques gouttes d’indicateur, l’œil |
| **pH-métrique** | par le **saut de pH** sur la courbe $\mathrm{pH}=f(V)$ | un pH-mètre, du papier millimétré |

> **À quoi ça sert.** Doser une espèce chimique, c’est déterminer sa concentration molaire volumique dans une solution. Le vinaigre du commerce, un médicament, l’acidité d’un sol : dans tous ces cas, on ne peut pas « voir » une concentration — il faut la faire réagir avec quelque chose de connu.`,
    keyPoint: "Doser, c’est déterminer une concentration inconnue en la faisant réagir avec une solution connue, selon une réaction unique, rapide et totale.",
    example: "On verse une soude de concentration connue sur un volume connu de vinaigre : le volume versé à l’équivalence donne la concentration du vinaigre.",
    methodSteps: [
      "Identifie la solution à doser : elle est dans l’erlenmeyer, son volume est connu et sa concentration inconnue.",
      "Identifie la solution titrante : elle est dans la burette, sa concentration est connue.",
      "Vérifie que la réaction choisie est unique, rapide et totale.",
      "Écris l’équation-bilan correspondant à la famille acide/base en jeu.",
      "Choisis le mode de repérage de l’équivalence : indicateur coloré ou pH-mètre.",
    ],
    interaction: timeline(
      [
        { label: "Prélever la solution à doser", shortLabel: "Prélever", detail: "On mesure précisément un volume Va de la solution de concentration inconnue et on le verse dans l’erlenmeyer." },
        { label: "Ajouter l’indicateur coloré", shortLabel: "Indicateur", detail: "Quelques gouttes suffisent. L’indicateur ne participe pas au dosage : il signale seulement l’équivalence." },
        { label: "Verser la solution titrante", shortLabel: "Verser", detail: "À la burette graduée, goutte à goutte, sous agitation constante. La concentration de cette solution est connue." },
        { label: "Repérer le changement de couleur", shortLabel: "Virage", detail: "Dès que la nouvelle teinte persiste, on arrête : l’équivalence est atteinte." },
        { label: "Lire le volume équivalent", shortLabel: "Lire Véq", detail: "On relève Véq sur la burette. C’est la seule mesure dont dépend tout le calcul qui suit." },
      ],
      "Les cinq gestes d’un dosage",
      "Suis le protocole expérimental, geste par geste.",
      "Une seule lecture compte vraiment : le volume équivalent. Tout le reste du dosage sert à la rendre fiable.",
    ),
    questions: [
      choice("Un dosage permet de déterminer…", ["la concentration molaire inconnue d’une espèce chimique", "la masse molaire d’un composé", "la température d’une réaction", "le volume d’un récipient"], 0, "C’est la définition du cours.", "I.2 Principe de dosage"),
      choice("Quelles conditions la réaction de dosage doit-elle remplir ?", ["unique, rapide et totale", "lente, unique et limitée", "totale, exothermique et lente", "rapide, limitée et unique"], 0, "Les trois conditions du cours ; les réactions acido-basiques les remplissent.", "I.2 Principe de dosage", 2),
      choice("Où se trouve la solution dont on cherche la concentration ?", ["dans l’erlenmeyer", "dans la burette graduée", "dans le pH-mètre", "indifféremment dans l’un ou l’autre"], 0, "La solution à doser est dans l’erlenmeyer ; la solution titrante est dans la burette.", "I.1 Protocole expérimental", 2),
      short("Écris l’équation-bilan du dosage d’un acide faible $\\mathrm{AH}$ par une base forte.", ["AH + OH- -> A- + H2O", "AH + OH- → A- + H2O", "AH + OH- = A- + H2O"], "L’acide non dissocié réagit avec l’ion hydroxyde.", "I.2 Réactions utilisables", 2),
      short("Écris l’équation-bilan du dosage d’une base faible $\\mathrm{B}$ par un acide fort.", ["H3O+ + B -> BH+ + H2O", "H3O+ + B → BH+ + H2O", "B + H3O+ -> BH+ + H2O", "B + H3O+ → BH+ + H2O"], "L’ion hydronium cède un proton à la base faible.", "I.2 Réactions utilisables", 2),
      choice("Quels sont les deux types de dosages acido-basiques ?", ["colorimétrique et pH-métrique", "colorimétrique et volumétrique", "pH-métrique et gravimétrique", "thermique et colorimétrique"], 0, "L’un repère l’équivalence à la couleur, l’autre au saut de pH.", "I.2 Types de dosages", 2),
      choice("Pourquoi la réaction de dosage doit-elle être totale ?", ["sinon une partie du réactif ne réagirait pas et la concentration serait sous-estimée", "sinon la solution changerait de couleur trop tôt", "sinon la burette se viderait trop vite", "sinon le pH-mètre se dérèglerait"], 0, "Le volume versé ne mesure la quantité cherchée que si tout a réagi.", "I.2 Principe de dosage", 2),
    ],
  },
  {
    id: "colorimetric-vinegar",
    title: "Le dosage colorimétrique du vinaigre",
    summary: "Suivre une manipulation complète, de la dilution de la solution commerciale au virage de la phénolphtaléine.",
    pages: "2",
    section: "II.1 à II.4. Dosage colorimétrique d’une solution commerciale de vinaigre",
    durationMinutes: 20,
    xp: 55,
    body: String.raw`## 1. Pourquoi commencer par diluer

On prélève $V_0=10$ mL de vinaigre commercial **à 8°**, de concentration $C_0$, et on le **dilue 10 fois** avec de l’eau distillée. La solution diluée, de concentration $C_a$, a un pH de $2{,}9$.

> **La raison de la dilution.** Le vinaigre commercial est trop concentré : à volume raisonnable de soude, l’équivalence serait atteinte après des dizaines de millilitres, et la burette n’y suffirait pas. On dilue d’un facteur connu, on dose la solution diluée, puis **on remonte** à la solution mère. C’est un réflexe de laboratoire, pas une complication gratuite.

## 2. Le montage

| Élément | Contenu |
|---|---|
| **Burette graduée** | solution de soude, $C_b=10^{-1}$ mol·L⁻¹ |
| **Erlenmeyer** | 10 mL de vinaigre dilué (incolore), $C_a$ inconnue, + quelques gouttes de **phénolphtaléine** |
| **Agitateur magnétique** | avec son barreau aimanté, pour homogénéiser en continu |

## 3. L’expérience et l’observation

On verse la soude **goutte à goutte**, l’agitateur faisant le mélange. Au fur et à mesure de l’ajout, rien ne se passe… puis la couleur du mélange passe **brusquement de l’incolore au rose violacé**, et le reste.

Le virage se produit pour un volume versé de $\boxed{V_{b\text{éq}}=13\ \text{mL}}$. Le pH du mélange vaut alors $8{,}8$.

> **Le mot important est « brusquement ».** Tant qu’il reste de l’acide, chaque goutte de soude est consommée et le pH bouge à peine. Quand le dernier acide disparaît, la goutte suivante n’a plus rien à neutraliser : le pH bondit et l’indicateur bascule. C’est ce saut, décrit au niveau précédent de la leçon 10, qui rend le repérage possible à la goutte près.

## 4. L’interprétation

Quand la couleur devient rose violacée, la réaction entre le vinaigre et la soude est **terminée** : on a atteint l’**équivalence acido-basique**.

$$n_A(\text{vinaigre})=n_B(\text{soude})$$

L’équation-bilan est celle d’un acide faible dosé par une base forte :

$$\mathrm{CH_3COOH}+\mathrm{OH^-}\ \longrightarrow\ \mathrm{CH_3COO^-}+\mathrm{H_2O}$$

## Ce que l’indicateur fait — et ne fait pas

> **Rôle de l’indicateur coloré :** son changement de couleur **marque la fin du dosage** et permet de savoir que l’équivalence est atteinte.

Il ne participe pas à la réaction dosée : on n’en met que quelques gouttes, précisément pour que sa propre acidité soit négligeable. Il est **témoin**, pas acteur.`,
    keyPoint: "On dilue, on dose la solution diluée par une base de concentration connue, et le virage de l’indicateur signale l’équivalence.",
    example: "Le virage de la phénolphtaléine au rose violacé se produit pour $V_{b\\text{éq}}=13$ mL de soude à $10^{-1}$ mol·L⁻¹.",
    methodSteps: [
      "Dilue la solution commerciale d’un facteur connu si elle est trop concentrée.",
      "Verse un volume précis de solution diluée dans l’erlenmeyer et ajoute quelques gouttes d’indicateur.",
      "Remplis la burette avec la solution titrante de concentration connue.",
      "Verse goutte à goutte sous agitation jusqu’au changement de couleur persistant.",
      "Relève le volume équivalent et écris l’équation-bilan de la réaction.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Le montage du dosage colorimétrique",
      instruction: "Sélectionne un élément du montage pour comprendre son rôle exact.",
      observation: "Chaque pièce a une fonction précise : ce qu’on cherche est en bas dans l’erlenmeyer, ce qu’on connaît est en haut dans la burette, et l’indicateur ne fait que signaler.",
      rootLabel: "Dosage colorimétrique du vinaigre",
      rootDetail: "Qui contient quoi, et pourquoi ?",
      nodes: [
        { id: "burette", label: "La burette graduée", role: "solution titrante connue", detail: "Elle contient la soude à Cb = 10⁻¹ mol·L⁻¹, de concentration parfaitement connue. C’est son volume qu’on lit, et cette lecture est la seule mesure dont dépend tout le calcul. On verse goutte à goutte pour ne pas dépasser l’équivalence." },
        { id: "erlen", label: "L’erlenmeyer", role: "solution à doser", detail: "Il contient 10 mL de vinaigre dilué, de concentration Ca inconnue. Le volume est connu avec précision, la concentration est ce qu’on cherche. La forme conique de l’erlenmeyer permet d’agiter sans projection." },
        { id: "indicateur", label: "La phénolphtaléine", role: "témoin de l’équivalence", detail: "Quelques gouttes suffisent. Incolore en milieu acide, rose violacé en milieu basique, elle bascule dans sa zone de virage 8,2 – 10. Elle ne participe pas à la réaction dosée : elle marque seulement la fin du dosage." },
        { id: "agitateur", label: "L’agitateur magnétique", role: "homogénéiser en continu", detail: "Le barreau aimanté tourne au fond de l’erlenmeyer et mélange en permanence. Sans agitation, la soude s’accumule localement, l’indicateur vire par zones et le volume équivalent est faussé." },
      ],
    },
    questions: [
      short("Pour quel volume de soude versé la phénolphtaléine vire-t-elle, dans ce dosage (en mL) ?", ["13", "13 mL", "13mL"], "Le mélange passe au rose violacé pour $V_{b\\text{éq}}=13$ mL.", "II.3 Expérience et observations", 2),
      choice("Quel est le rôle de la phénolphtaléine dans ce dosage ?", ["marquer la fin du dosage, donc l’équivalence", "accélérer la réaction acido-basique", "neutraliser l’excès de soude", "mesurer le pH du mélange"], 0, "C’est un indicateur coloré : témoin, pas acteur.", "Exercice 2, question 2", 2),
      short("Écris l’équation-bilan du dosage de l’acide éthanoïque par la soude.", ["CH3COOH + OH- -> CH3COO- + H2O", "CH3COOH + OH- → CH3COO- + H2O", "CH3COOH + OH- = CH3COO- + H2O"], "Acide faible dosé par une base forte.", "II.4 Interprétation", 2),
      choice("Pourquoi dilue-t-on le vinaigre commercial avant de le doser ?", ["parce qu’il est trop concentré pour être dosé directement à la burette", "parce que l’acide éthanoïque ne réagit pas s’il est pur", "pour faire virer la phénolphtaléine plus vite", "pour éviter que la réaction soit exothermique"], 0, "On dose la solution diluée puis on remonte à la solution mère par le facteur de dilution.", "II.1 Préparation d’une solution diluée", 2),
      choice("Que signifie le passage brusque au rose violacé ?", ["l’équivalence acido-basique est atteinte", "la réaction vient de commencer", "la soude est en défaut", "le mélange est devenu acide"], 0, "Quand le dernier acide disparaît, le pH bondit et l’indicateur bascule.", "II.4 Interprétation"),
      choice("À quoi sert l’agitateur magnétique ?", ["à homogénéiser le mélange en continu", "à chauffer la solution", "à mesurer le volume versé", "à colorer le mélange"], 0, "Sans agitation, l’indicateur vire par zones et le volume équivalent est faussé.", "II.2 Montage expérimental", 2),
    ],
  },
  {
    id: "concentration-from-equivalence",
    title: "De l’équivalence à la concentration",
    summary: "Exploiter la relation d’équivalence, puis remonter d’une solution diluée à la solution commerciale.",
    pages: "3",
    section: "II.6.1 et II.6.2. Concentrations molaires volumiques",
    durationMinutes: 20,
    xp: 60,
    body: String.raw`## 6.1 La concentration de la solution diluée

À l’équivalence, les réactifs sont dans les proportions de l’équation-bilan. Comme celle-ci fait réagir **une** molécule d’acide avec **un** ion hydroxyde :

$$C_a V_a=C_b V_{b\text{éq}}\quad\Longrightarrow\quad C_a=\frac{C_b V_{b\text{éq}}}{V_a}$$

$$C_a=\frac{0{,}1\times0{,}013}{0{,}010}=\boxed{0{,}13\ \text{mol·L}^{-1}}$$

> **Attention aux unités.** Les volumes doivent être dans la **même** unité des deux côtés — en litres ici, mais on peut aussi bien tout garder en millilitres, puisque le rapport $V_{b\text{éq}}/V_a$ est sans dimension. Ce qui ne se pardonne pas, c’est de mélanger les deux.

## 6.2 La concentration de la solution commerciale

La solution a été diluée **10 fois**, donc le facteur de dilution vaut $k=10$ :

$$C_0=k\,C_a=10\times0{,}13=\boxed{1{,}3\ \text{mol·L}^{-1}}$$

### Pourquoi $C_0=k\,C_a$

Diluer, c’est ajouter de l’eau **sans changer la quantité de matière** prélevée :

$$n_0=n_a\quad\Longrightarrow\quad C_0V_0=C_aV_a'\quad\text{avec}\quad V_a'=k\,V_0$$

d’où $C_0V_0=C_a\,k\,V_0$, et en simplifiant par $V_0$ : $\ C_0=k\,C_a$.

> **Le sens physique, pour ne jamais se tromper de sens.** Une solution diluée est **moins** concentrée que la solution mère. Donc $C_0$ est **plus grand** que $C_a$ : on **multiplie** par $k$, on ne divise pas.

## La vérification qui valide toute la manipulation

Le vinaigre était annoncé **à 8°** — un degré correspondant à 1 g d’acide éthanoïque pour 100 mL. Vérifions.

La masse molaire de $\mathrm{CH_3COOH}$ vaut $M=60$ g·mol⁻¹, donc :

$$C_0\times M=1{,}3\times60=78\ \text{g·L}^{-1}=7{,}8\ \text{g pour 100 mL}$$

soit un vinaigre à **7,8°**, c’est-à-dire les 8° de l’étiquette. **Le dosage confirme l’étiquette** : c’était exactement la question posée au départ.

## Activité d’application

> On dose $V_a=15$ mL d’acide éthanoïque par de l’hydroxyde de potassium à $C_b=10^{-2}$ mol·L⁻¹. L’équivalence est atteinte pour $V_{b\text{éq}}=16$ mL. Calcule $C_a$.

$$C_a=\frac{C_bV_{b\text{éq}}}{V_a}=\frac{10^{-2}\times16}{15}=1{,}06\times10^{-2}\ \text{mol·L}^{-1}$$

> **Remarque utile.** L’hydroxyde de potassium $\mathrm{KOH}$ joue ici le même rôle que la soude $\mathrm{NaOH}$ : ce sont deux bases fortes, et seul l’ion $\mathrm{OH^-}$ intervient dans l’équation-bilan. L’ion $\mathrm{K^+}$, comme l’ion $\mathrm{Na^+}$, est spectateur.`,
    keyPoint: "CaVa = CbVbéq donne la concentration cherchée ; après une dilution d’un facteur k, la solution mère vaut C₀ = k × C_dilué.",
    example: "$C_a=\\dfrac{0{,}1\\times13}{10}=0{,}13$ mol·L⁻¹, puis $C_0=10\\times0{,}13=1{,}3$ mol·L⁻¹.",
    methodSteps: [
      "Écris la relation d’équivalence à partir de l’équation-bilan : CaVa = CbVbéq quand les coefficients valent 1.",
      "Isole la concentration inconnue et vérifie que les deux volumes sont dans la même unité.",
      "Applique numériquement, sans oublier de convertir les millilitres si tu passes par les litres.",
      "Si la solution dosée était diluée d’un facteur k, multiplie le résultat par k pour retrouver la solution mère.",
      "Contrôle l’ordre de grandeur : la solution mère doit être plus concentrée que la diluée.",
    ],
    interaction: timeline(
      [
        { label: "Écrire la relation d’équivalence", shortLabel: "Équivalence", detail: "L’équation-bilan fait réagir une molécule d’acide pour un ion hydroxyde : CaVa = CbVbéq." },
        { label: "Isoler la concentration cherchée", shortLabel: "Isoler", detail: "Ca = CbVbéq/Va. Les deux volumes doivent être dans la même unité ; leur rapport est sans dimension." },
        { label: "Appliquer numériquement", shortLabel: "Calculer", detail: "Ca = 0,1 × 13/10 = 0,13 mol·L⁻¹ pour la solution diluée." },
        { label: "Remonter à la solution mère", shortLabel: "Dilution", detail: "La dilution était d’un facteur k = 10 : C₀ = k × Ca = 1,3 mol·L⁻¹. On multiplie, car la solution mère est la plus concentrée." },
        { label: "Vérifier avec l’étiquette", shortLabel: "Vérifier", detail: "1,3 mol·L⁻¹ × 60 g·mol⁻¹ = 78 g·L⁻¹, soit 7,8 g pour 100 mL : un vinaigre à 8°, conforme à l’étiquette." },
      ],
      "Du volume versé à la concentration du vinaigre",
      "Suis les cinq étapes qui transforment une lecture de burette en concentration commerciale.",
      "La dernière étape n’est pas décorative : elle confronte le résultat à une donnée indépendante, l’étiquette, et valide toute la manipulation.",
    ),
    questions: [
      short("Calcule $C_a$ pour $C_b=0{,}1$ mol·L⁻¹, $V_{b\\text{éq}}=13$ mL et $V_a=10$ mL (en mol·L⁻¹).", ["0,13", "0.13", "1,3e-1", "0,13 mol/L"], "$C_a=C_bV_{b\\text{éq}}/V_a=0{,}1\\times13/10=0{,}13$ mol·L⁻¹.", "II.6.1 Concentration de la solution diluée", 2),
      short("La solution a été diluée 10 fois. Calcule $C_0$ à partir de $C_a=0{,}13$ mol·L⁻¹.", ["1,3", "1.3", "1,3 mol/L"], "$C_0=k\\,C_a=10\\times0{,}13=1{,}3$ mol·L⁻¹.", "II.6.2 Concentration de la solution commerciale", 2),
      choice("Après une dilution d’un facteur $k$, comment retrouve-t-on la concentration de la solution mère ?", ["en multipliant la concentration diluée par k", "en divisant la concentration diluée par k", "en ajoutant k à la concentration diluée", "elle est inchangée"], 0, "La solution mère est plus concentrée : on multiplie.", "II.6.2 Concentration de la solution commerciale", 2),
      short("On dose 15 mL d’acide éthanoïque par $\\mathrm{KOH}$ à $10^{-2}$ mol·L⁻¹, équivalence à 16 mL. Calcule $C_a$ en mol·L⁻¹.", ["1,06e-2", "1.06e-2", "1,06.10-2", "0,0106", "0.0106"], "$C_a=10^{-2}\\times16/15=1{,}06\\times10^{-2}$ mol·L⁻¹.", "Activité d’application 1", 3),
      short("Vérifie le degré du vinaigre : calcule $C_0\\times M$ en g·L⁻¹, avec $C_0=1{,}3$ mol·L⁻¹ et $M=60$ g·mol⁻¹.", ["78", "78 g/L", "78 g.L-1"], "$1{,}3\\times60=78$ g·L⁻¹, soit 7,8 g pour 100 mL : un vinaigre à 8°.", "II.6.2 (vérification)", 3),
      choice("Dans le dosage par l’hydroxyde de potassium, quel est le rôle de l’ion $\\mathrm{K^+}$ ?", ["c’est un ion spectateur, il n’intervient pas dans l’équation-bilan", "il réagit avec l’acide éthanoïque", "il joue le rôle d’indicateur coloré", "il catalyse la réaction"], 0, "Comme $\\mathrm{Na^+}$, il ne fait que traverser la réaction.", "Activité d’application 1", 2),
    ],
  },
  {
    id: "indicator-choice",
    title: "Choisir le bon indicateur coloré",
    summary: "Associer chaque famille de dosage au pH de son équivalence, et en déduire l’indicateur qui convient.",
    pages: "4, 9-10",
    section: "Activité d’application 2 et Documents",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## La règle, en une phrase

> Un indicateur coloré convient à un dosage si sa **zone de virage contient le pH à l’équivalence**.

Tout le reste en découle. Encore faut-il savoir prévoir ce pH — et c’est là que la leçon précédente sert.

## Les indicateurs du programme

| Indicateur | Teinte acide | Zone de virage | Teinte basique |
|---|---|---|---|
| **Hélianthine** | rouge | 3,1 – 4,4 | jaune |
| **Bleu de bromothymol (BBT)** | jaune | 6,0 – 7,6 | bleu |
| **Phénolphtaléine** | incolore | 8,2 – 10,0 | rose violacé |

## Prévoir le pH à l’équivalence

À l’équivalence, il ne reste en solution que le **conjugué du réactif faible** — ou rien de tel si les deux réactifs sont forts.

| Famille | Ce qui reste à l’équivalence | pH à l’équivalence | Indicateur |
|---|---|---|---|
| Acide **fort** par base **forte** | ions spectateurs seulement | $=7$ | **BBT** |
| Base **forte** par acide **fort** | ions spectateurs seulement | $=7$ | **BBT** |
| Acide **faible** par base **forte** | la **base conjuguée** de l’acide | $>7$ | **phénolphtaléine** |
| Base **faible** par acide **fort** | l’**acide conjugué** de la base | $<7$ | **hélianthine** |

> **Le cas qu’on écarte.** Pour un dosage acide faible / base faible, on ne peut rien prévoir a priori : il faudrait comparer les $\mathrm{p}K_a$ des deux couples. C’est aussi pourquoi ce dosage n’est jamais utilisé en pratique — sans saut de pH net, il n’y a pas d’équivalence lisible.

## Le contrôle sur le dosage du vinaigre

Le pH à l’équivalence valait $8{,}8$, et la zone de virage de la phénolphtaléine s’étend de $8{,}2$ à $10$ :

$$8{,}2<8{,}8<10$$

La phénolphtaléine était donc bien l’indicateur approprié — ce qui n’était pas un coup de chance : l’acide éthanoïque est faible, la soude est forte, donc l’équivalence **devait** être basique.

## Comment fonctionne un indicateur coloré

Un indicateur de pH est lui-même un **couple acide/base**, dont la forme acide et la forme basique n’ont pas la même couleur. Quand le pH traverse sa zone de virage, la forme majoritaire bascule — et la couleur avec elle.

C’est exactement le mécanisme des domaines de prédominance vus à la leçon 9 : en dessous du $\mathrm{p}K_a$ de l’indicateur, sa forme acide domine ; au-dessus, sa forme basique.

## Quelques autres indicateurs

| Indicateur | Zone de virage | Changement de couleur |
|---|---|---|
| Bleu de bromophénol | 3,0 – 4,6 | jaune → bleu |
| Vert de bromocrésol | 3,8 – 5,4 | jaune → bleu |
| Rouge de méthyle | 4,2 – 6,2 | rouge → jaune |
| Rouge de crésol | 7,2 – 8,8 | jaune → rouge |
| Jaune d’alizarine R | 10,1 – 12,1 | jaune → violet |`,
    keyPoint: "L’indicateur convient si sa zone de virage contient le pH d’équivalence : BBT pour deux réactifs forts, phénolphtaléine pour un acide faible, hélianthine pour une base faible.",
    example: "Dosage du vinaigre : $\\mathrm{pH}_E=8{,}8$ et la phénolphtaléine vire entre 8,2 et 10, donc elle convient.",
    methodSteps: [
      "Repère lequel des deux réactifs est faible, s’il y en a un.",
      "Déduis-en le pH à l’équivalence : 7 si les deux sont forts, plus de 7 si l’acide est faible, moins de 7 si la base est faible.",
      "Compare ce pH aux zones de virage disponibles.",
      "Choisis l’indicateur dont la zone de virage contient ce pH.",
      "Justifie par l’encadrement chiffré, comme 8,2 < 8,8 < 10.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Quel indicateur pour quel dosage ?",
      instruction: "Sélectionne une famille de dosage pour voir le pH attendu et l’indicateur qui convient.",
      observation: "Le choix de l’indicateur n’est jamais une question de goût : il découle mécaniquement de la nature des réactifs, via le pH d’équivalence.",
      rootLabel: "Choisir un indicateur coloré",
      rootDetail: "La zone de virage doit contenir le pH d’équivalence",
      nodes: [
        { id: "ff", label: "Deux réactifs forts", role: "pH_E = 7 → BBT", detail: "Acide fort par base forte, ou base forte par acide fort. Il ne reste que des ions spectateurs, sans propriété acide ni basique : le pH d’équivalence vaut 7 à 25 °C. Le bleu de bromothymol, qui vire entre 6,0 et 7,6, encadre cette valeur : c’est lui qui convient." },
        { id: "af", label: "Acide faible par base forte", role: "pH_E > 7 → phénolphtaléine", detail: "À l’équivalence il ne reste que la base conjuguée de l’acide, qui rend la solution basique. C’est le cas du vinaigre dosé par la soude : pH_E = 8,8. La phénolphtaléine, incolore puis rose violacé entre 8,2 et 10, contient cette valeur — 8,2 < 8,8 < 10." },
        { id: "bf", label: "Base faible par acide fort", role: "pH_E < 7 → hélianthine", detail: "À l’équivalence il ne reste que l’acide conjugué de la base, qui acidifie la solution. L’hélianthine, rouge puis jaune entre 3,1 et 4,4, est l’indicateur du programme pour ce cas." },
        { id: "faible", label: "Acide faible par base faible", role: "imprévisible → à écarter", detail: "On ne peut rien conclure a priori : il faudrait comparer les pKa des deux couples. Et surtout, la courbe ne présente pas de saut de pH franc, donc l’équivalence n’est pas lisible. Ce dosage n’est pas utilisé en pratique." },
      ],
    },
    questions: [
      choice("Un indicateur coloré convient à un dosage si…", ["sa zone de virage contient le pH à l’équivalence", "il est incolore avant le virage", "il réagit avec l’acide dosé", "sa zone de virage contient le pH initial"], 0, "C’est le critère unique du choix.", "Activité d’application 2"),
      choice("Quel indicateur convient au dosage d’un acide fort par une base forte ?", ["le BBT (6,0 – 7,6)", "l’hélianthine (3,1 – 4,4)", "la phénolphtaléine (8,2 – 10)", "aucun des trois"], 0, "Le pH d’équivalence vaut 7, contenu dans la zone du BBT.", "Activité d’application 2, question 1", 2),
      choice("Quel indicateur convient au dosage d’un acide faible par une base forte ?", ["la phénolphtaléine (8,2 – 10)", "le BBT (6,0 – 7,6)", "l’hélianthine (3,1 – 4,4)", "aucun des trois"], 0, "Le pH d’équivalence est supérieur à 7 : il ne reste que la base conjuguée.", "Activité d’application 2, question 3", 2),
      choice("Quel indicateur convient au dosage d’une base faible par un acide fort ?", ["l’hélianthine (3,1 – 4,4)", "le BBT (6,0 – 7,6)", "la phénolphtaléine (8,2 – 10)", "aucun des trois"], 0, "Le pH d’équivalence est inférieur à 7 : il ne reste que l’acide conjugué.", "Activité d’application 2, question 4", 2),
      short("Le pH à l’équivalence du dosage du vinaigre vaut 8,8. Nomme l’indicateur approprié.", ["phénolphtaléine", "la phénolphtaléine", "phenolphtaleine"], "$8{,}2<8{,}8<10$ : la valeur est dans sa zone de virage.", "II.5 Choix de l’indicateur coloré", 2),
      choice("Pourquoi un indicateur coloré change-t-il de couleur ?", ["c’est un couple acide/base dont les deux formes n’ont pas la même couleur", "il se décompose au contact de la soude", "il précipite à l’équivalence", "il s’évapore quand le pH monte"], 0, "Quand le pH traverse sa zone de virage, la forme majoritaire bascule.", "Documents : fonctionnement de l’indicateur", 2),
      choice("Pourquoi le dosage d’un acide faible par une base faible n’est-il pas utilisé ?", ["parce que la courbe ne présente pas de saut de pH franc", "parce que la réaction n’est pas exothermique", "parce qu’aucun indicateur n’existe", "parce que les deux solutions se mélangent mal"], 0, "Sans saut net, l’équivalence n’est pas lisible ; le pH d’équivalence dépend en plus des deux pKa.", "Documents : choix de l’indicateur coloré", 3),
    ],
  },
  {
    id: "species-at-equivalence",
    title: "Les espèces en solution à l’équivalence",
    summary: "Calculer la concentration de chaque espèce présente dans le bécher au moment du virage.",
    pages: "3",
    section: "II.6.3. Concentrations volumiques des espèces chimiques à l’équivalence",
    durationMinutes: 22,
    xp: 75,
    kind: "practice",
    body: String.raw`## L’inventaire, d’abord

À l’équivalence du dosage du vinaigre, le pH vaut $8{,}8$ et le mélange occupe $V_a+V_b=10+13=23$ mL.

| Catégorie | Espèces |
|---|---|
| **Cations** | $\mathrm{H_3O^+}$, $\mathrm{Na^+}$ |
| **Anions** | $\mathrm{OH^-}$, $\mathrm{CH_3COO^-}$ |
| **Molécules** | $\mathrm{H_2O}$, $\mathrm{CH_3COOH}$ |

> **N’oublie jamais $\mathrm{CH_3COOH}$.** À l’équivalence, tout l’acide a réagi — mais la base conjuguée formée réagit un peu avec l’eau et en régénère une trace. C’est d’ailleurs ce qui rend la solution basique. Une espèce ultra-minoritaire n’est pas une espèce absente.

## Les quatre concentrations, dans l’ordre

**1. Par le pH**, directement :
$$[\mathrm{H_3O^+}]=10^{-\mathrm{pH}}=10^{-8,8}=1{,}6\times10^{-9}\ \text{mol·L}^{-1}$$
$$[\mathrm{OH^-}]=\frac{K_e}{[\mathrm{H_3O^+}]}=\frac{10^{-14}}{1{,}6\times10^{-9}}=6{,}25\times10^{-6}\ \text{mol·L}^{-1}$$

**2. Par la dilution de l’ion spectateur** : tout le sodium versé est encore là, dans le volume total.
$$[\mathrm{Na^+}]=\frac{C_bV_b}{V_a+V_b}=\frac{0{,}1\times13}{23}=56\times10^{-3}\ \text{mol·L}^{-1}$$

**3. Par l’électroneutralité** : $[\mathrm{Na^+}]+[\mathrm{H_3O^+}]=[\mathrm{OH^-}]+[\mathrm{CH_3COO^-}]$, soit
$$[\mathrm{CH_3COO^-}]=[\mathrm{Na^+}]+[\mathrm{H_3O^+}]-[\mathrm{OH^-}]\approx[\mathrm{Na^+}]=56\times10^{-3}\ \text{mol·L}^{-1}$$
car $[\mathrm{H_3O^+}]$ et $[\mathrm{OH^-}]$, de l’ordre de $10^{-9}$ et $10^{-6}$, sont **dix mille fois** plus petits que $[\mathrm{Na^+}]$.

**4. Par la conservation de la matière** :
$$\frac{C_aV_a}{V_a+V_b}=[\mathrm{CH_3COO^-}]+[\mathrm{CH_3COOH}]$$

Or, **à l’équivalence**, $C_aV_a=C_bV_b$, donc le membre de gauche vaut exactement $[\mathrm{Na^+}]$. En remplaçant $[\mathrm{CH_3COO^-}]$ par $[\mathrm{Na^+}]-[\mathrm{OH^-}]$ :

$$[\mathrm{CH_3COOH}]=[\mathrm{Na^+}]-\big([\mathrm{Na^+}]-[\mathrm{OH^-}]\big)=[\mathrm{OH^-}]=6{,}25\times10^{-6}\ \text{mol·L}^{-1}$$

> **Le résultat est élégant et mérite qu’on s’y arrête.** L’acide restant a exactement la même concentration que les ions hydroxyde. Ce n’est pas une coïncidence : chaque ion éthanoate qui arrache un proton à l’eau produit **une** molécule d’acide éthanoïque **et un** ion hydroxyde. Un pour un. C’est la réaction de la base conjuguée avec l’eau qui rend la solution basique, et cette égalité en est la signature.

## Le classement final

$$[\mathrm{Na^+}]\approx[\mathrm{CH_3COO^-}]\ \gg\ [\mathrm{OH^-}]=[\mathrm{CH_3COOH}]\ \gg\ [\mathrm{H_3O^+}]$$

$$5{,}6\times10^{-2}\quad\gg\quad6{,}25\times10^{-6}\quad\gg\quad1{,}6\times10^{-9}$$

Les espèces **majoritaires** sont donc $\mathrm{Na^+}$ et $\mathrm{CH_3COO^-}$ : le bécher contient une solution d’**éthanoate de sodium**, ce qui explique son caractère basique.`,
    keyPoint: "pH ⇒ [H₃O⁺] et [OH⁻] ; dilution ⇒ l’ion spectateur ; électroneutralité ⇒ la base conjuguée ; conservation de la matière ⇒ l’acide restant.",
    example: "$[\\mathrm{CH_3COOH}]=[\\mathrm{OH^-}]=6{,}25\\times10^{-6}$ mol·L⁻¹ : chaque ion éthanoate qui réagit avec l’eau produit une molécule d’acide et un ion hydroxyde.",
    methodSteps: [
      "Dresse l’inventaire complet : cations, anions, molécules — sans oublier l’acide restant en trace.",
      "Calcule [H₃O⁺] et [OH⁻] à partir du pH et du produit ionique de l’eau.",
      "Calcule la concentration de l’ion spectateur par dilution dans le volume total Va + Vb.",
      "Écris l’électroneutralité et néglige les termes minoritaires pour obtenir la base conjuguée.",
      "Écris la conservation de la matière et utilise la relation d’équivalence pour obtenir l’acide restant.",
    ],
    interaction: timeline(
      [
        { label: "Faire l’inventaire", shortLabel: "Inventaire", detail: "Cations H₃O⁺ et Na⁺, anions OH⁻ et CH₃COO⁻, molécules H₂O et CH₃COOH. L’acide restant, bien que minoritaire, ne doit pas être oublié." },
        { label: "Exploiter le pH", shortLabel: "pH", detail: "[H₃O⁺] = 10⁻⁸·⁸ = 1,6 × 10⁻⁹ mol·L⁻¹ et [OH⁻] = Ke/[H₃O⁺] = 6,25 × 10⁻⁶ mol·L⁻¹." },
        { label: "Diluer l’ion spectateur", shortLabel: "Na⁺", detail: "Tout le sodium versé se retrouve dans les 23 mL du mélange : [Na⁺] = 0,1 × 13/23 = 5,6 × 10⁻² mol·L⁻¹." },
        { label: "Appliquer l’électroneutralité", shortLabel: "Charges", detail: "[CH₃COO⁻] = [Na⁺] + [H₃O⁺] − [OH⁻] ≈ [Na⁺], les deux derniers termes étant dix mille fois plus petits." },
        { label: "Appliquer la conservation de la matière", shortLabel: "Matière", detail: "En utilisant CaVa = CbVb à l’équivalence, il vient [CH₃COOH] = [OH⁻] = 6,25 × 10⁻⁶ mol·L⁻¹ : un pour un, signature de la réaction de la base conjuguée avec l’eau." },
        { label: "Classer les espèces", shortLabel: "Classer", detail: "Na⁺ et CH₃COO⁻ sont majoritaires : le bécher contient une solution d’éthanoate de sodium, d’où son caractère basique." },
      ],
      "Les six étapes de l’inventaire quantitatif",
      "Suis l’enchaînement qui donne toutes les concentrations à partir d’une seule mesure de pH.",
      "Chaque étape utilise une relation différente : le pH, la dilution, les charges, la matière. Aucune n’est interchangeable.",
    ),
    questions: [
      short("Calcule $[\\mathrm{Na^+}]$ pour $C_b=0{,}1$ mol·L⁻¹, $V_b=13$ mL et $V_a=10$ mL (en mol·L⁻¹).", ["5,6e-2", "5.6e-2", "0,056", "0.056", "56e-3", "56.10-3"], "$[\\mathrm{Na^+}]=C_bV_b/(V_a+V_b)=0{,}1\\times13/23=5{,}6\\times10^{-2}$ mol·L⁻¹.", "II.6.3.2 Concentrations des espèces", 3),
      short("À pH $=8{,}8$, calcule $[\\mathrm{H_3O^+}]$ en mol·L⁻¹.", ["1,6e-9", "1.6e-9", "1,6.10-9", "1,58e-9"], "$[\\mathrm{H_3O^+}]=10^{-8,8}=1{,}6\\times10^{-9}$ mol·L⁻¹.", "II.6.3.2 Concentrations des espèces", 2),
      short("À quelle autre concentration $[\\mathrm{CH_3COOH}]$ est-elle égale à l’équivalence ?", ["[OH-]", "OH-", "celle des ions hydroxyde", "[OH−]"], "Chaque ion éthanoate qui réagit avec l’eau produit une molécule d’acide et un ion hydroxyde.", "II.6.3.2 Concentrations des espèces", 3),
      choice("Quelles sont les espèces majoritaires à l’équivalence de ce dosage ?", ["Na⁺ et CH₃COO⁻", "H₃O⁺ et OH⁻", "CH₃COOH et H₂O", "Na⁺ et OH⁻"], 0, "Leur concentration est dix mille fois supérieure à celle des autres espèces.", "II.6.3.2 Concentrations des espèces", 2),
      choice("Sur quelle relation s’appuie-t-on pour obtenir $[\\mathrm{CH_3COO^-}]$ ?", ["l’électroneutralité de la solution", "la conservation de la matière", "le produit ionique de l’eau", "la relation d’équivalence"], 0, "$[\\mathrm{Na^+}]+[\\mathrm{H_3O^+}]=[\\mathrm{OH^-}]+[\\mathrm{CH_3COO^-}]$.", "II.6.3.2 Concentrations des espèces", 2),
      choice("Pourquoi la molécule $\\mathrm{CH_3COOH}$ figure-t-elle encore dans l’inventaire à l’équivalence ?", ["parce que l’ion éthanoate réagit un peu avec l’eau et en régénère une trace", "parce que le dosage n’est pas terminé", "parce que la réaction n’est pas totale", "parce que l’indicateur en produit"], 0, "C’est cette réaction qui rend d’ailleurs la solution basique.", "II.6.3.1 Inventaire des espèces", 3),
    ],
  },
  {
    id: "ph-metric-titration",
    title: "Le dosage pH-métrique",
    summary: "Repérer l’équivalence sur une courbe, par la méthode des tangentes ou par celle de la dérivée.",
    pages: "3-5",
    section: "III. Dosage pH-métrique et exercice 1",
    durationMinutes: 22,
    xp: 80,
    kind: "graph",
    body: String.raw`## Le principe

Ici, pas d’indicateur coloré : on plonge une sonde de **pH-mètre** dans le mélange et on relève le pH après chaque ajout. On trace ensuite la courbe

$$\mathrm{pH}=f(V)$$

où $V$ est le volume de réactif versé, et on détermine le point d’équivalence **E** par la **méthode des tangentes parallèles**. Connaissant $V_E$, on applique l’équation-bilan pour remonter à la concentration cherchée.

## Les deux méthodes de lecture

| Méthode | Comment on procède | Ce qu’on obtient |
|---|---|---|
| **Tangentes parallèles** | deux tangentes parallèles de part et d’autre du saut, puis leur parallèle équidistante | $V_E$ **et** $\mathrm{pH}_E$ |
| **Dérivée $\mathrm{d}\mathrm{pH}/\mathrm{d}V$** | on trace la courbe des variations et on repère son **pic** | $V_E$ seul, mais très précisément |

> **Laquelle choisir ?** La méthode des tangentes se fait à la règle et donne les deux coordonnées : c’est celle du programme. La dérivée est plus précise sur $V_E$ car le pic est net, mais elle ne donne pas $\mathrm{pH}_E$ — et il faut assez de points de mesure autour du saut pour la tracer.

## Colorimétrie ou pH-métrie ?

| | Colorimétrique | pH-métrique |
|---|---|---|
| Matériel | quelques gouttes d’indicateur | un pH-mètre étalonné |
| Rapidité | très rapide, une seule lecture | long, une mesure par ajout |
| Ce qu’on obtient | $V_E$ seulement | la **courbe entière** : $V_E$, $\mathrm{pH}_E$, et le $\mathrm{p}K_a$ à la demi-équivalence |
| Difficulté | choisir le bon indicateur au préalable | aucun choix préalable à faire |

> **Le vrai avantage de la pH-métrie.** Elle ne demande **aucune hypothèse préalable**. En colorimétrie, il faut avoir deviné le pH d’équivalence pour choisir l’indicateur — donc déjà savoir quelle famille de dosage on a. La courbe, elle, le révèle.

## L’exercice type

> On ajoute progressivement à $V_A=50{,}0$ mL d’acide méthanoïque $\mathrm{HCOOH}$ de concentration $C_A$ inconnue un volume $V_B$ de soude à $C_B=0{,}10$ mol·L⁻¹, en mesurant le pH.

**1. L’équation-bilan.** L’acide méthanoïque est un acide faible :
$$\mathrm{HCOOH}+\mathrm{HO^-}\ \longrightarrow\ \mathrm{HCOO^-}+\mathrm{H_2O}$$

**2. Le volume équivalent.** Par la méthode des tangentes, on lit sur la courbe :
$$V_{BE}\approx21{,}5\ \text{mL}$$

**3. La concentration.** À l’équivalence, $n_A=n_{BE}$ :
$$C_AV_A=C_BV_{BE}\quad\Longrightarrow\quad C_A=\frac{C_BV_{BE}}{V_A}=\frac{0{,}10\times21{,}5}{50}=\boxed{4{,}3\times10^{-2}\ \text{mol·L}^{-1}}$$

> **Vérifie la cohérence.** L’acide est faible et la base forte : l’équivalence doit être **basique**. Sur la courbe fournie, le saut traverse effectivement la zone de la phénolphtaléine, au-dessus de 8 — l’hélianthine, elle, aurait viré bien trop tôt. La courbe confirme le choix d’indicateur au lieu de le supposer.`,
    keyPoint: "On trace pH = f(V), on place E par les tangentes parallèles (ou par le pic de dpH/dV), puis on applique la relation d’équivalence.",
    example: "$V_{BE}=21{,}5$ mL donne $C_A=\\dfrac{0{,}10\\times21{,}5}{50}=4{,}3\\times10^{-2}$ mol·L⁻¹.",
    methodSteps: [
      "Relève le pH après chaque ajout et reporte les points sur du papier millimétré.",
      "Trace la courbe pH = f(V) et repère la zone du saut.",
      "Place E par la méthode des tangentes parallèles, ou par le pic de la courbe dérivée.",
      "Lis VE, et pHE si tu as utilisé les tangentes.",
      "Applique la relation d’équivalence pour obtenir la concentration inconnue.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Deux façons de lire une équivalence",
      instruction: "Sélectionne une méthode pour comparer ce qu’elle exige et ce qu’elle donne.",
      observation: "Colorimétrie et pH-métrie ne s’opposent pas : l’une est rapide mais suppose qu’on sache déjà à quoi s’attendre, l’autre est longue mais ne suppose rien.",
      rootLabel: "Repérer le point d’équivalence",
      rootDetail: "À l’œil, ou à la courbe ?",
      nodes: [
        { id: "colori", group: "Les deux dosages", label: "Dosage colorimétrique", role: "au changement de couleur", detail: "Quelques gouttes d’indicateur, une seule lecture au moment du virage. Très rapide, matériel minimal. Mais il faut avoir choisi le bon indicateur AVANT de commencer, donc avoir prévu le pH d’équivalence — et l’on n’obtient que VE." },
        { id: "phmetrie", group: "Les deux dosages", label: "Dosage pH-métrique", role: "au saut de pH", detail: "Une mesure de pH après chaque ajout, puis un tracé. C’est long et il faut un pH-mètre étalonné. En échange, la courbe donne VE, pHE, et même le pKa du couple à la demi-équivalence — sans aucune hypothèse préalable." },
        { id: "tangentes", group: "Lire la courbe", label: "Méthode des tangentes parallèles", role: "→ VE et pHE", detail: "On trace deux tangentes parallèles de part et d’autre du saut, puis leur parallèle équidistante. Elle coupe la courbe au point d’équivalence. C’est la méthode du programme : elle se fait à la règle et donne les deux coordonnées." },
        { id: "derivee", group: "Lire la courbe", label: "Méthode de la dérivée", role: "→ VE très précis", detail: "On trace la courbe des variations dpH/dV : son pic a pour abscisse le volume équivalent. Plus précise que les tangentes sur VE, car le maximum est net. En revanche elle ne donne pas pHE, et elle exige beaucoup de points autour du saut." },
      ],
    },
    questions: [
      short("Écris l’équation-bilan du dosage de l’acide méthanoïque par la soude.", ["HCOOH + HO- -> HCOO- + H2O", "HCOOH + OH- -> HCOO- + H2O", "HCOOH + HO- → HCOO- + H2O", "HCOOH + OH- → HCOO- + H2O"], "Acide faible dosé par une base forte.", "Exercice 1, question 1", 2),
      short("Calcule $C_A$ pour $C_B=0{,}10$ mol·L⁻¹, $V_{BE}=21{,}5$ mL et $V_A=50{,}0$ mL (en mol·L⁻¹).", ["4,3e-2", "4.3e-2", "4,3.10-2", "0,043", "0.043"], "$C_A=C_BV_{BE}/V_A=0{,}10\\times21{,}5/50=4{,}3\\times10^{-2}$ mol·L⁻¹.", "Exercice 1, question 3", 3),
      choice("Dans un dosage pH-métrique, comment repère-t-on l’équivalence ?", ["par la méthode des tangentes parallèles sur la courbe pH = f(V)", "par le changement de couleur de la solution", "en mesurant la température du mélange", "en pesant le précipité formé"], 0, "C’est la méthode du programme ; la dérivée en est une variante plus précise sur VE.", "III. Dosage pH-métrique", 2),
      choice("Que donne la méthode de la dérivée $\\mathrm{d}\\mathrm{pH}/\\mathrm{d}V$ ?", ["le volume équivalent, à l’abscisse du pic", "le pH à l’équivalence", "la concentration directement", "le pKa du couple"], 0, "Le pic de la courbe des dérivées a pour abscisse le volume équivalent, mais ne donne pas pHE.", "Documents : exploitation d’une courbe pH-métrique", 2),
      choice("Quel est l’avantage principal du dosage pH-métrique sur le dosage colorimétrique ?", ["il ne demande aucune hypothèse préalable sur le pH d’équivalence", "il est beaucoup plus rapide", "il ne nécessite aucun appareil", "il fonctionne sans réaction chimique"], 0, "En colorimétrie il faut choisir l’indicateur avant, donc avoir prévu le pH d’équivalence.", "III. Dosage pH-métrique", 3),
      choice("Pour ce dosage d’acide méthanoïque par la soude, le pH à l’équivalence est…", ["supérieur à 7", "égal à 7", "inférieur à 7", "impossible à prévoir"], 0, "Acide faible et base forte : il ne reste que l’ion méthanoate, base conjuguée.", "Exercice 1 (cohérence)", 2),
    ],
  },
  {
    id: "titration-mission",
    title: "Mission finale : cinq dosages à mener",
    summary: "Traiter les exercices du document, de l’acide benzoïque au vinaigre dilué, jusqu’au pH d’un acide fort.",
    pages: "4-9",
    section: "Situation d’évaluation et exercices 2 à 5",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Dosage 1 — L’acide benzoïque

> $V_a=50$ mL d’acide benzoïque dosés par de la soude à $C_b=10^{-1}$ mol·L⁻¹. La phénolphtaléine vire au rose violacé pour $V_b=20$ mL.

**Le rôle de la phénolphtaléine.** Indicateur coloré : son changement de couleur marque la fin du dosage et signale l’équivalence.

**L’équation-bilan.** L’acide benzoïque est un acide faible de type $\mathrm{AH}$ :
$$\mathrm{C_6H_5{-}COOH}+\mathrm{OH^-}\ \longrightarrow\ \mathrm{C_6H_5{-}COO^-}+\mathrm{H_2O}$$

**La concentration.**
$$C_a=\frac{C_bV_{b}}{V_a}=\frac{0{,}1\times20}{50}=\boxed{4\times10^{-2}\ \text{mol·L}^{-1}}$$

**La nature du mélange à l’équivalence.** Il ne reste que du **benzoate de sodium**, dont l’ion benzoate est une base faible : le mélange est **basique**.

## Dosage 2 — Un acide fort de concentration inconnue

> Dosage d’un acide fort $\mathrm{HA}$ par une base forte $\mathrm{BOH}$. $V_A=10$ mL d’acide dosé, $C_B=10^{-1}$ mol·L⁻¹, courbe pH-métrique fournie.

**L’indicateur.** La courbe donne $\mathrm{pH}_E=7$, valeur contenue dans la zone du **BBT** ($6-7{,}6$) : c’est lui qui convient.

**L’équation-bilan.** Deux espèces fortes :
$$\mathrm{HA}+\mathrm{OH^-}\ \longrightarrow\ \mathrm{A^-}+\mathrm{H_2O}$$
ou, en faisant apparaître le cation spectateur : $\ \mathrm{HA}+(\mathrm{B^+}+\mathrm{OH^-})\longrightarrow\mathrm{B^+}+\mathrm{A^-}+\mathrm{H_2O}$.

**La concentration**, avec $V_{BE}=11$ mL lu sur la courbe :
$$C_A=C_B\frac{V_{BE}}{V_A}=10^{-1}\times\frac{11}{10}=\boxed{0{,}11\ \text{mol·L}^{-1}}$$

## Dosage 3 — Le vinaigre à l’étiquette illisible

> $V_0=5$ mL de vinaigre $S_0$ **dilués 4 fois** donnent $S_1$. On dose $V=10$ mL de $S_1$ par $\mathrm{KOH}$ à $C_2=10^{-2}$ mol·L⁻¹ ; le virage a lieu pour $V_E=11{,}5$ mL.

**L’équation-bilan.** $\ \mathrm{CH_3COOH}+\mathrm{OH^-}\longrightarrow\mathrm{CH_3COO^-}+\mathrm{H_2O}$

**La concentration de $S_1$.**
$$C_1=\frac{C_2V_E}{V}=\frac{10^{-2}\times11{,}5}{10}=1{,}15\times10^{-2}\ \text{mol·L}^{-1}$$

**La concentration du vinaigre.** La dilution était d’un facteur $k=4$, donc :
$$C_0=k\,C_1=4\times1{,}15\times10^{-2}=\boxed{4{,}6\times10^{-2}\ \text{mol·L}^{-1}}$$

> **Le piège de cet exercice.** Le facteur de dilution est $k=4$ — « diluer 4 fois » — et non $5$. Le nombre 5 est le **volume** $V_0$ en millilitres : deux données voisines dans l’énoncé, deux rôles totalement différents. Relis toujours ce que désigne chaque lettre avant de substituer.

## Dosage 4 — L’acide iodhydrique

> $V_A=10$ mL d’acide iodhydrique dosés par de la soude à $C_B=10^{-2}$ mol·L⁻¹ ; équivalence pour $V_{BE}=22$ mL.

**L’indicateur.** L’acide iodhydrique $\mathrm{HI}$ est un **acide fort**, la soude une base forte : $\mathrm{pH}_E=7$, donc le **BBT**, puisque $6<7<7{,}6$.

**La concentration.**
$$C_A=\frac{C_BV_{BE}}{V_A}=\frac{10^{-2}\times22}{10}=2{,}2\times10^{-2}\ \text{mol·L}^{-1}$$

**Le pH.** Pour un acide fort, la totalité se dissocie, donc $[\mathrm{H_3O^+}]=C_A$ :
$$\mathrm{pH}=-\log C_A=-\log(2{,}2\times10^{-2})=\boxed{1{,}65}$$

> **Le pH d’une solution aqueuse** est la grandeur sans dimension qui exprime la quantité d’ions $\mathrm{H_3O^+}$ présents. Pour un **acide fort** seulement, $\mathrm{pH}=-\log C$ — parce que lui seul est entièrement dissocié.

## La démarche commune aux quatre

1. **Quelle famille ?** Repère lequel des réactifs est faible, s’il y en a un.
2. **Quelle équation-bilan ?** Elle découle de la famille.
3. **Quel pH à l’équivalence ?** $7$, plus de $7$ ou moins de $7$ — donc quel indicateur.
4. **Quelle concentration ?** La relation d’équivalence, toujours la même.
5. **Y a-t-il eu dilution ?** Si oui, multiplie par le facteur $k$ pour remonter à la solution mère.`,
    keyPoint: "Famille ⇒ équation-bilan ⇒ pH d’équivalence ⇒ indicateur ; puis CaVa = CbVbéq, et × k s’il y a eu dilution.",
    example: "$C_1=1{,}15\\times10^{-2}$ mol·L⁻¹ et une dilution 4 fois donnent $C_0=4\\times1{,}15\\times10^{-2}=4{,}6\\times10^{-2}$ mol·L⁻¹.",
    methodSteps: [
      "Identifie la famille du dosage à partir de la nature des deux réactifs.",
      "Écris l’équation-bilan correspondante.",
      "Déduis le pH à l’équivalence, et choisis l’indicateur dont la zone de virage le contient.",
      "Applique la relation d’équivalence pour obtenir la concentration de la solution dosée.",
      "S’il y a eu dilution, multiplie par le facteur k — en vérifiant bien ce que k désigne dans l’énoncé.",
    ],
    corrections: [
      "Page 8, exercice 4, question 4 : le corrigé annonce C₀ = 5,75 × 10⁻² mol·L⁻¹. Sa propre formule, C₀ = k·C₁, est pourtant correcte : avec un facteur de dilution k = 4 et C₁ = 1,15 × 10⁻² mol·L⁻¹, on obtient C₀ = 4 × 1,15 × 10⁻² = 4,6 × 10⁻² mol·L⁻¹. La valeur annoncée correspond à 5 × C₁ : le corrigé a substitué à k le nombre 5, qui est le volume V₀ prélevé en millilitres et non le facteur de dilution. L’énoncé indique bien « diluer 4 fois ».",
      "Page 7, exercice 3, énoncé : « Vₐ = 10 mL, le volume de l’acide versé ». C’est le volume d’acide DOSÉ, placé dans le bécher ; l’axe des abscisses de la courbe porte V_B, le volume de base versée à la burette. Le protocole du paragraphe I.1 est explicite sur cette répartition des rôles.",
      "Page 8, exercice 5, énoncé : « Vous réalisez le dosage calorimétrique » — il s’agit d’un dosage COLORIMÉTRIQUE, repéré au changement de couleur d’un indicateur. Un dosage calorimétrique mesurerait une chaleur de réaction, ce qui n’est ni décrit ni demandé ici.",
      "Page 8, exercice 5, énoncé : « d’un volume Vₐ = 10 mL de cette solution aqueuse d’hydroxyde de sodium de concentration C_B = 10⁻² mol·L⁻¹ » confond la solution dosée et la solution titrante. Il faut lire : un volume Vₐ = 10 mL de la solution d’acide iodhydrique, dosé par une solution d’hydroxyde de sodium de concentration C_B = 10⁻² mol·L⁻¹. La suite de l’énoncé et le corrigé, qui calculent C_A pour l’acide iodhydrique, confirment cette lecture.",
      "Page 8, exercice 5, tableau des indicateurs : la zone de virage de l’hélianthine est donnée 3,1 – 4,5, alors que l’activité d’application 2, l’exercice 3 et la table de la page 10 du même document donnent tous 3,1 – 4,4.",
      "Page 9, exercice 5, corrigé : les questions de l’énoncé sont numérotées 1, 2, 3, 4 mais le corrigé les numérote 1, 2, 2, 3. Les réponses correspondent bien aux quatre questions posées, dans l’ordre.",
      "Page 3 : la section « III/ Dosage pH-métrique » est insérée au milieu de la section II, entre le paragraphe 6.3 et le paragraphe 7 « Intérêt du dosage », qui appartient encore à la section II. La numérotation des sections s’en trouve rompue.",
      "Pages 4 et 5 : la « Situation d’évaluation » et l’« Exercice 2 » sont strictement identiques, mot pour mot, énoncé et questions compris. Seul l’exercice 2 est corrigé.",
    ],
    interaction: timeline(
      [
        { label: "Identifier la famille", shortLabel: "Famille", detail: "Acide fort ou faible, base forte ou faible ? Toute la suite en dépend : acide benzoïque et acide éthanoïque sont faibles, acide iodhydrique est fort." },
        { label: "Écrire l’équation-bilan", shortLabel: "Bilan", detail: "AH + OH⁻ → A⁻ + H₂O pour un acide faible dosé par une base forte ; H₃O⁺ + OH⁻ → 2 H₂O si les deux sont forts." },
        { label: "Prévoir le pH d’équivalence", shortLabel: "pH_E", detail: "7 pour deux réactifs forts, plus de 7 si l’acide est faible, moins de 7 si la base est faible. Ce pH décide de l’indicateur : BBT, phénolphtaléine ou hélianthine." },
        { label: "Calculer la concentration", shortLabel: "Concentration", detail: "CaVa = CbVbéq. Acide benzoïque : 0,1 × 20/50 = 4 × 10⁻² mol·L⁻¹. Acide iodhydrique : 10⁻² × 22/10 = 2,2 × 10⁻² mol·L⁻¹." },
        { label: "Remonter la dilution", shortLabel: "Dilution", detail: "S’il y a eu dilution d’un facteur k, la solution mère vaut C₀ = k × C. Pour le vinaigre dilué 4 fois : C₀ = 4 × 1,15 × 10⁻² = 4,6 × 10⁻² mol·L⁻¹. Attention à ne pas confondre k avec un volume de l’énoncé." },
        { label: "Conclure sur le pH si besoin", shortLabel: "pH", detail: "Pour un acide fort seulement, pH = −log C. Ici −log(2,2 × 10⁻²) = 1,65." },
      ],
      "La démarche commune aux cinq dosages",
      "Suis les six étapes qui résolvent n’importe lequel des exercices du document.",
      "Un dosage se résout toujours dans le même ordre. Ce qui change d’un exercice à l’autre, c’est seulement la famille de départ et la présence ou non d’une dilution.",
    ),
    questions: [
      short("Calcule la concentration de l’acide benzoïque : $C_b=10^{-1}$ mol·L⁻¹, $V_b=20$ mL, $V_a=50$ mL (en mol·L⁻¹).", ["4e-2", "4.10-2", "0,04", "0.04", "4,0e-2"], "$C_a=C_bV_b/V_a=0{,}1\\times20/50=4\\times10^{-2}$ mol·L⁻¹.", "Exercice 2, question 4", 2),
      choice("Quelle est la nature du mélange à l’équivalence du dosage de l’acide benzoïque ?", ["basique : c’est une solution de benzoate de sodium", "neutre : c’est une solution de chlorure de sodium", "acide : c’est une solution d’acide benzoïque", "impossible à déterminer"], 0, "L’ion benzoate, base conjuguée d’un acide faible, rend la solution basique.", "Exercice 2, question 5", 2),
      short("Écris l’équation-bilan du dosage de l’acide benzoïque par la soude.", ["C6H5-COOH + OH- -> C6H5-COO- + H2O", "C6H5COOH + OH- -> C6H5COO- + H2O", "C6H5-COOH + OH- → C6H5-COO- + H2O", "C6H5COOH + OH- → C6H5COO- + H2O"], "Acide faible de type AH dosé par une base forte.", "Exercice 2, question 3", 2),
      short("$V_0=5$ mL de vinaigre sont dilués 4 fois. On trouve $C_1=1{,}15\\times10^{-2}$ mol·L⁻¹. Calcule $C_0$ en mol·L⁻¹.", ["4,6e-2", "4.6e-2", "4,6.10-2", "0,046", "0.046"], "$C_0=k\\,C_1$ avec $k=4$ : $4\\times1{,}15\\times10^{-2}=4{,}6\\times10^{-2}$ mol·L⁻¹. Le nombre 5 est un volume, pas le facteur de dilution.", "Exercice 4, question 4 (corrigée)", 3),
      short("Calcule $C_A$ de l’acide iodhydrique : $C_B=10^{-2}$ mol·L⁻¹, $V_{BE}=22$ mL, $V_A=10$ mL (en mol·L⁻¹).", ["2,2e-2", "2.2e-2", "2,2.10-2", "0,022", "0.022"], "$C_A=C_BV_{BE}/V_A=10^{-2}\\times22/10=2{,}2\\times10^{-2}$ mol·L⁻¹.", "Exercice 5, question 3", 3),
      short("Déduis le pH de cette solution d’acide iodhydrique ($C_A=2{,}2\\times10^{-2}$ mol·L⁻¹).", ["1,65", "1.65", "1,66", "1.66"], "L’acide iodhydrique est fort : $\\mathrm{pH}=-\\log C_A=-\\log(2{,}2\\times10^{-2})=1{,}65$.", "Exercice 5, question 4", 3),
      choice("Quel indicateur convient au dosage de l’acide iodhydrique par la soude ?", ["le BBT", "la phénolphtaléine", "l’hélianthine", "aucun des trois"], 0, "Deux réactifs forts : $\\mathrm{pH}_E=7$, et $6<7<7{,}6$.", "Exercice 5, question 1", 2),
      short("Calcule $C_A$ de l’acide fort de l’exercice 3 : $C_B=10^{-1}$ mol·L⁻¹, $V_{BE}=11$ mL, $V_A=10$ mL (en mol·L⁻¹).", ["0,11", "0.11", "1,1e-1"], "$C_A=C_BV_{BE}/V_A=10^{-1}\\times11/10=0{,}11$ mol·L⁻¹.", "Exercice 3, question 4", 2),
      choice("Dans l’exercice 3, que désigne $V_A=10$ mL ?", ["le volume d’acide dosé, placé dans le bécher", "le volume d’acide versé à la burette", "le volume de base versée à l’équivalence", "le volume total du mélange"], 0, "L’axe des abscisses porte V_B : c’est la base qu’on verse, l’acide est dosé.", "Exercice 3 (énoncé corrigé)", 3),
      choice("Pour quelle catégorie de solution la relation $\\mathrm{pH}=-\\log C$ est-elle valable ?", ["les solutions d’acide fort", "toutes les solutions acides", "les solutions d’acide faible", "les solutions tampons"], 0, "Seul un acide fort est entièrement dissocié, donc $[\\mathrm{H_3O^+}]=C$.", "Exercice 5, question 2.2", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const acidBaseTitrationPath: LearningPath = {
  id: "terminale-cd-chemistry-acid-base-titration",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Chimie générale" },
  chapterNumber: 10,
  title: "Dosage acido-basique",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire le protocole et le principe d’un dosage acido-basique",
    "Exploiter la relation d’équivalence et un facteur de dilution",
    "Choisir l’indicateur coloré adapté à chaque famille de dosage",
    "Déterminer les concentrations des espèces présentes à l’équivalence",
  ],
  modules: [
    { id: "acid-base-titration-mastery", title: "Maîtriser le dosage acido-basique", description: "Un niveau après l’autre, du protocole expérimental à l’exploitation complète d’un dosage.", lessons: builtLevels },
  ],
};
