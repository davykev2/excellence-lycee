import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L8_Acide faible base faible.pdf";

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
      tip: "Quatre relations suffisent : le pH, le produit ionique, l’électroneutralité et la conservation de la matière.",
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
    id: "weak-acid-evidence",
    title: "L’acide faible : la preuve par la conductibilité",
    summary: "Comparer les conductibilités de l’acide éthanoïque et de l’acide chlorhydrique pour établir qu’une ionisation peut être partielle.",
    pages: "1-3",
    section: "1. Acide faible",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## L’expérience

L’**acide éthanoïque** pur, $\mathrm{CH_3COOH}$, est un liquide incolore à l’odeur piquante, miscible à l’eau en toutes proportions. On mesure l’intensité du courant traversant trois liquides :

| Liquide | Intensité |
|---|---|
| Acide éthanoïque **pur** | **0** |
| Acide éthanoïque en solution, $C = 0{,}1$ mol·L⁻¹ | **4 mA** |
| Acide chlorhydrique, $C = 0{,}1$ mol·L⁻¹ | **70 mA** |

## Les trois conclusions

**1. L’acide pur ne conduit pas** : il ne contient aucun ion. Ce sont donc bien les molécules d’eau qui ionisent l’acide, et non l’acide qui serait déjà ionisé.

**2. La solution conduit** : l’eau a ionisé une partie des molécules.

**3. Elle conduit **beaucoup moins** que l’acide chlorhydrique** — 4 mA contre 70 mA à concentration égale. Son ionisation **n’est donc pas totale : elle est partielle**.

## Définition

> Un acide est dit **faible** en solution aqueuse si sa réaction avec l’eau est **partielle**, c’est-à-dire n’est pas totale.

L’équation s’écrit avec une **double flèche**, signe d’un équilibre :

$$\mathrm{CH_3COOH + H_2O \rightleftharpoons CH_3COO^- + H_3O^+}$$

**Exemples d’acides faibles** : acide méthanoïque, acide benzoïque, ion ammonium $\mathrm{NH_4^+}$, ion méthylammonium.

> **Astuce mémoire de Davy.** L’expérience est plus convaincante que la définition. À **même concentration**, deux acides donnent des intensités dans un rapport de 1 à 17 : c’est la preuve directe qu’il reste des molécules non ionisées dans le premier. Retenir les trois chiffres — 0, 4 mA, 70 mA — te donne tout le raisonnement.

> **Erreur fréquente.** Croire qu’un acide faible est un acide dilué. La comparaison se fait à **concentration identique** : la force est une propriété de l’acide, la dilution une propriété de la solution.`,
    keyPoint: "Acide faible : réaction **partielle** avec l’eau, écrite avec une double flèche. Preuve : à concentration égale, il conduit bien moins le courant qu’un acide fort.",
    example: "À 0,1 mol·L⁻¹ : 4 mA pour l’acide éthanoïque contre 70 mA pour l’acide chlorhydrique.",
    methodSteps: [
      "Compare les conductibilités à **concentration égale**.",
      "Une intensité plus faible signale une ionisation partielle.",
      "Écris l’équation avec une double flèche.",
      "Conclus : l’acide est faible, un équilibre s’établit.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Trois liquides, trois intensités",
      instruction: "Sélectionne un liquide pour voir ce que son intensité démontre.",
      observation: "Chaque mesure élimine une hypothèse. Prises ensemble, les trois établissent que l’eau ionise l’acide, mais seulement en partie.",
      rootLabel: "Mesure de l’intensité du courant",
      rootDetail: "Que traverse-t-on, et qu’observe-t-on ?",
      nodes: [
        { id: "pur", label: "Acide éthanoïque pur", role: "0 mA", detail: "Aucun courant : le liquide pur ne contient pas d’ions. C’est donc bien l’eau qui, en dissolvant l’acide, provoque son ionisation — l’acide n’arrive pas déjà ionisé." },
        { id: "solution", label: "Solution d’acide éthanoïque", role: "4 mA à 0,1 mol/L", detail: "Le courant passe : des ions se sont formés, CH₃COO⁻ et H₃O⁺. L’eau a bien ionisé les molécules d’acide éthanoïque." },
        { id: "fort", label: "Acide chlorhydrique", role: "70 mA à 0,1 mol/L", detail: "À concentration identique, dix-sept fois plus de courant. L’acide chlorhydrique est totalement ionisé ; l’acide éthanoïque ne l’est donc que partiellement. C’est la comparaison qui fait la démonstration." },
      ],
    },
    questions: [
      choice("Un acide est dit faible si sa réaction avec l’eau est…", ["partielle", "totale", "nulle"], 0, "C’est la définition du cours.", "1.3 Définition"),
      choice("L’acide éthanoïque **pur** conduit-il le courant ?", ["non, il ne contient pas d’ions", "oui, faiblement", "oui, fortement"], 0, "L’intensité mesurée est nulle.", "1.2.1.3 Interprétation", 2),
      short("Quelle intensité traverse la solution d’acide éthanoïque à 0,1 mol·L⁻¹ ? (en mA)", ["4", "4 mA"], "Contre 70 mA pour l’acide chlorhydrique.", "1.2.1.2 Résultats", 2),
      choice("Pourquoi compare-t-on les deux acides à la **même** concentration ?", ["parce que la force est une propriété de l’acide, pas de la dilution", "pour économiser les réactifs", "parce que le pH doit être identique"], 0, "Sinon la comparaison ne prouverait rien.", "1.2.1.3 Interprétation", 3),
      short("Écris l’équation de la réaction de l’acide éthanoïque avec l’eau.", ["CH3COOH + H2O = CH3COO- + H3O+", "ch3cooh + h2o = ch3coo- + h3o+"], "Avec une **double** flèche : c’est un équilibre.", "1.2.5 Équation-bilan", 2),
      choice("Lequel de ces composés est un acide faible ?", ["l’ion ammonium $\\mathrm{NH_4^+}$", "l’acide chlorhydrique", "l’acide nitrique"], 0, "Exemple cité par le cours.", "1.3 Définition"),
    ],
  },
  {
    id: "weak-acid-quantitative",
    title: "L’étude quantitative d’une solution d’acide faible",
    summary: "Calculer les quatre concentrations d’une solution d’acide faible avec le pH, le produit ionique, l’électroneutralité et la conservation.",
    pages: "2",
    section: "1.2.2 Étude quantitative",
    durationMinutes: 28,
    xp: 55,
    body: String.raw`## Les quatre relations

C’est la méthode centrale de la leçon, et elle est **toujours la même**. Pour une solution d’acide éthanoïque de concentration $C_a = 10^{-2}$ mol·L⁻¹ dont le pH mesuré vaut **3,4** :

**1. L’inventaire.** Ions : $\mathrm{H_3O^+}$, $\mathrm{OH^-}$, $\mathrm{CH_3COO^-}$. Molécules : $\mathrm{H_2O}$, $\mathrm{CH_3COOH}$.

La molécule $\mathrm{CH_3COOH}$ **figure** dans l’inventaire — c’est toute la différence avec l’acide fort, où elle avait disparu.

**2. Le pH et le produit ionique.**

$$[\mathrm{H_3O^+}] = 10^{-pH} = 10^{-3,4} = 3{,}98\times10^{-4} \text{ mol·L}^{-1}$$
$$[\mathrm{OH^-}] = \frac{K_e}{[\mathrm{H_3O^+}]} = 2{,}51\times10^{-11} \text{ mol·L}^{-1}$$

**3. L’électroneutralité.**

$$[\mathrm{H_3O^+}] = [\mathrm{OH^-}] + [\mathrm{CH_3COO^-}]$$

Comme $[\mathrm{OH^-}]$ est négligeable — sept ordres de grandeur d’écart :

$$[\mathrm{CH_3COO^-}] \approx [\mathrm{H_3O^+}] = 3{,}98\times10^{-4} \text{ mol·L}^{-1}$$

**4. La conservation de la matière.** L’acide apporté se retrouve soit ionisé, soit intact :

$$C_a = [\mathrm{CH_3COO^-}] + [\mathrm{CH_3COOH}]$$
$$[\mathrm{CH_3COOH}] = 10^{-2} - 3{,}98\times10^{-4} = 9{,}6\times10^{-3} \text{ mol·L}^{-1}$$

## Le résultat parle de lui-même

| Espèce | Concentration |
|---|---|
| $\mathrm{CH_3COOH}$ **non ionisé** | $9{,}6\times10^{-3}$ — **majoritaire** |
| $\mathrm{CH_3COO^-}$ et $\mathrm{H_3O^+}$ | $3{,}98\times10^{-4}$ |
| $\mathrm{OH^-}$ | $2{,}51\times10^{-11}$ — minoritaire |

**96 % de l’acide n’a pas réagi.** C’est la signature d’un acide faible.

> **Astuce mémoire de Davy.** Retiens l’ordre des quatre relations : **pH → $K_e$ → électroneutralité → conservation**. Chacune donne une concentration, et il y a exactement quatre inconnues. Cet enchaînement résout la totalité des exercices de cette leçon, acide comme base.

> **Erreur fréquente.** Oublier la conservation de la matière et croire que $[\mathrm{CH_3COOH}] = C_a$. La concentration de l’acide **restant** est celle apportée **moins** celle qui s’est ionisée.`,
    keyPoint: "Quatre relations dans l’ordre : $[\\mathrm{H_3O^+}] = 10^{-pH}$, $[\\mathrm{OH^-}] = K_e/[\\mathrm{H_3O^+}]$, électroneutralité, puis conservation $C_a = [\\mathrm{A^-}] + [\\mathrm{AH}]$.",
    example: "$C_a = 10^{-2}$, $pH = 3{,}4$ : $[\\mathrm{CH_3COO^-}] = 3{,}98\\times10^{-4}$ et $[\\mathrm{CH_3COOH}] = 9{,}6\\times10^{-3}$ mol·L⁻¹.",
    methodSteps: [
      "Recense les espèces, **molécule d’acide comprise**.",
      "Calcule $[\\mathrm{H_3O^+}] = 10^{-pH}$ puis $[\\mathrm{OH^-}]$ par le produit ionique.",
      "Écris l’électroneutralité et néglige le terme minoritaire.",
      "Applique la conservation de la matière pour l’acide restant.",
    ],
    interaction: timeline(
      [
        { label: "Le pH donne l’ion hydronium", shortLabel: "pH", detail: "[H₃O⁺] = 10⁻ᵖᴴ. Pour pH = 3,4 : 3,98 × 10⁻⁴ mol·L⁻¹. Attention, cette valeur n’est plus égale à Ca comme pour un acide fort." },
        { label: "Le produit ionique donne l’hydroxyde", shortLabel: "Ke", detail: "[OH⁻] = Ke/[H₃O⁺] = 2,51 × 10⁻¹¹ mol·L⁻¹. Sept ordres de grandeur en dessous de l’ion hydronium : il sera négligeable dans l’étape suivante." },
        { label: "L’électroneutralité donne l’anion", shortLabel: "Charges", detail: "[H₃O⁺] = [OH⁻] + [CH₃COO⁻]. Le terme [OH⁻] étant négligeable, [CH₃COO⁻] ≈ [H₃O⁺] = 3,98 × 10⁻⁴ mol·L⁻¹." },
        { label: "La conservation donne l’acide restant", shortLabel: "Matière", detail: "Ca = [CH₃COO⁻] + [CH₃COOH], donc [CH₃COOH] = 10⁻² − 3,98 × 10⁻⁴ = 9,6 × 10⁻³ mol·L⁻¹. L’acide non ionisé est de loin majoritaire : 96 % du total." },
      ],
      "Les quatre relations, dans l’ordre",
      "Parcours les quatre étapes : chacune fournit une concentration, et il y a exactement quatre inconnues.",
      "Cet enchaînement est le squelette de tous les exercices de la leçon. Seuls les chiffres changent — la démarche, jamais.",
    ),
    questions: [
      short("Quelle espèce figure dans l’inventaire d’un acide faible et pas dans celui d’un acide fort ?", ["CH3COOH", "la molecule d'acide", "l'acide non ionise", "la molécule d’acide"], "L’acide non ionisé subsiste, puisque la réaction est partielle.", "1.2.2 Inventaire", 2),
      short("Pour $pH = 3{,}4$, quelle est $[\\mathrm{H_3O^+}]$ ? (en mol·L⁻¹, trois chiffres)", ["3,98.10-4", "3.98e-4", "3,98 10-4"], "$10^{-3,4}$.", "1.2.2 Exploitation du pH", 2),
      choice("Quelle relation donne $[\\mathrm{CH_3COO^-}]$ ?", ["l’électroneutralité", "la conservation de la matière", "le produit ionique"], 0, "$[\\mathrm{H_3O^+}] = [\\mathrm{OH^-}] + [\\mathrm{CH_3COO^-}]$.", "1.2.2 Électroneutralité", 2),
      choice("Quelle relation donne $[\\mathrm{CH_3COOH}]$ ?", ["la conservation de la matière", "l’électroneutralité", "le produit ionique"], 0, "$C_a = [\\mathrm{CH_3COO^-}] + [\\mathrm{CH_3COOH}]$.", "1.2.2 Conservation", 2),
      short("Pour $C_a = 10^{-2}$ et $[\\mathrm{CH_3COO^-}] = 3{,}98\\times10^{-4}$, quelle est $[\\mathrm{CH_3COOH}]$ ? (en mol·L⁻¹)", ["9,6.10-3", "9.6e-3", "9,6 10-3", "0,0096"], "$10^{-2} - 3{,}98\\times10^{-4}$.", "1.2.2 Conservation", 3),
      choice("Dans cette solution, l’espèce majoritaire est…", ["l’acide éthanoïque non ionisé", "l’ion éthanoate", "l’ion hydronium"], 0, "96 % de l’acide n’a pas réagi.", "1.2.2 Espèces majoritaires", 2),
    ],
  },
  {
    id: "ionization-coefficient",
    title: "Le coefficient d’ionisation et l’effet de la dilution",
    summary: "Définir le coefficient d’ionisation α, l’interpréter en nombre de molécules et montrer qu’il augmente avec la dilution.",
    pages: "3",
    section: "1.2.3 et 1.2.4",
    durationMinutes: 24,
    xp: 60,
    body: String.raw`## Définition

Le **coefficient de dissociation** — ou d’ionisation — noté $\alpha$, est le rapport du **nombre de molécules ionisées** au **nombre total de molécules apportées** :

$$\boxed{\;\alpha = \frac{[\mathrm{A^-}]}{C_a}\;}$$

C’est un **nombre sans unité**, compris entre 0 et 1, qu’on exprime souvent en pourcentage.

## L’interprétation concrète

Pour l’acide éthanoïque à $C_a = 10^{-2}$ mol·L⁻¹ :

$$\alpha = \frac{3{,}98\times10^{-4}}{10^{-2}} = 0{,}0398 \approx \mathbf{4\,\%}$$

Autrement dit : **sur 100 molécules d’acide éthanoïque introduites, seules 4 se dissocient.** Les 96 autres restent intactes.

Cette lecture « sur 100 molécules » est ce qui rend le coefficient parlant — bien plus qu’un nombre décimal.

## L’effet de la dilution

On dilue la même solution jusqu’à $C'_a = 10^{-4}$ mol·L⁻¹, et le pH mesuré devient 4,4 :

$$[\mathrm{H_3O^+}] = 10^{-4,4} = 3{,}98\times10^{-5} \quad\Longrightarrow\quad \alpha' = \frac{3{,}98\times10^{-5}}{10^{-4}} = \mathbf{40\,\%}$$

> **Le facteur d’ionisation augmente avec la dilution.**

De 4 % à 40 % : **dix fois plus** de molécules dissociées, pour une solution cent fois moins concentrée.

## Comprendre le paradoxe apparent

Diluer **augmente** la proportion ionisée mais **diminue** la quantité d’ions. Les deux affirmations sont vraies :

| | Concentrée | Diluée |
|---|---|---|
| $C_a$ | $10^{-2}$ | $10^{-4}$ |
| $\alpha$ | 4 % | **40 %** |
| $[\mathrm{H_3O^+}]$ | $3{,}98\times10^{-4}$ | $3{,}98\times10^{-5}$ — **plus faible** |
| pH | 3,4 | 4,4 — **moins acide** |

> **Astuce mémoire de Davy.** $\alpha$ est une **proportion**, pas une quantité. Diluer pousse l’équilibre vers plus de dissociation, donc la proportion monte ; mais comme il y a bien moins d’acide au départ, le nombre d’ions produits baisse quand même. Une solution diluée est **plus ionisée en pourcentage** et **moins acide en pH**.

> **Erreur fréquente.** Conclure qu’une solution plus diluée est plus acide parce que $\alpha$ augmente. Le pH passe de 3,4 à 4,4 : elle est **moins** acide.`,
    keyPoint: "$\\alpha = [\\mathrm{A^-}]/C_a$, sans unité. Le coefficient d’ionisation **augmente avec la dilution** : 4 % à $10^{-2}$, 40 % à $10^{-4}$ mol·L⁻¹.",
    example: "$\\alpha = 3{,}98\\times10^{-4}/10^{-2} = 4\\,\\%$ : sur 100 molécules apportées, 4 seulement se dissocient.",
    methodSteps: [
      "Calcule $[\\mathrm{A^-}]$ par l’électroneutralité.",
      "Divise par la concentration **apportée** $C_a$, pas par l’acide restant.",
      "Exprime en pourcentage et traduis en « sur 100 molécules ».",
      "Pour comparer deux dilutions, calcule les deux $\\alpha$ puis conclus.",
    ],
    interaction: timeline(
      [
        { label: "Compter les molécules ionisées", shortLabel: "Ionisées", detail: "C’est [A⁻], obtenue par l’électroneutralité. Pour l’acide éthanoïque à 10⁻² mol·L⁻¹ : 3,98 × 10⁻⁴ mol·L⁻¹." },
        { label: "Diviser par le total apporté", shortLabel: "α", detail: "α = [A⁻]/Ca = 3,98 × 10⁻⁴ / 10⁻² = 0,0398, soit 4 %. Le dénominateur est la concentration apportée, jamais celle de l’acide restant." },
        { label: "Traduire en nombre de molécules", shortLabel: "Lecture", detail: "4 % signifie : sur 100 molécules d’acide introduites, 4 se dissocient et 96 restent intactes. C’est cette lecture qui rend le coefficient parlant." },
        { label: "Observer l’effet de la dilution", shortLabel: "Diluer", detail: "À 10⁻⁴ mol·L⁻¹, le pH vaut 4,4 et α passe à 40 %. Le coefficient augmente avec la dilution — mais la concentration en ions hydronium, elle, diminue, et la solution est moins acide." },
      ],
      "Du calcul à l’interprétation",
      "Parcours les quatre étapes : la dernière est celle qui compte à l’examen.",
      "Le coefficient est une proportion, pas une quantité. Confondre les deux conduit à l’erreur classique : croire qu’une solution diluée est plus acide.",
    ),
    questions: [
      short("Écris l’expression du coefficient d’ionisation d’un acide faible.", ["alpha = [A-]/Ca", "[A-]/C", "a=[A-]/C", "alpha=[A-]/C"], "Rapport des molécules ionisées au total apporté.", "1.2.3 Coefficient d’ionisation", 2),
      short("Pour l’acide éthanoïque à $10^{-2}$ mol·L⁻¹ et $pH = 3{,}4$, que vaut $\\alpha$ ? (en %)", ["4", "4 %", "4%", "3,98"], "$3{,}98\\times10^{-4}/10^{-2} = 0{,}0398$.", "1.2.3 Coefficient d’ionisation", 2),
      choice("Un coefficient de 4 % signifie que…", ["sur 100 molécules apportées, 4 se dissocient", "4 % de la solution est de l’acide", "le pH vaut 4"], 0, "C’est l’interprétation du cours.", "1.2.3 Coefficient d’ionisation", 2),
      short("Après dilution à $10^{-4}$ mol·L⁻¹, le pH vaut 4,4. Que vaut $\\alpha'$ ? (en %)", ["40", "40 %", "40%"], "$3{,}98\\times10^{-5}/10^{-4} = 0{,}398$.", "1.2.4 Effet de la dilution", 3),
      choice("Quelle est l’influence de la dilution sur l’ionisation d’un acide faible ?", ["le coefficient d’ionisation augmente", "le coefficient d’ionisation diminue", "le coefficient d’ionisation ne change pas"], 0, "Conclusion du cours.", "1.2.4 Effet de la dilution", 2),
      choice("En diluant, la solution devient…", ["plus ionisée en proportion mais moins acide", "plus ionisée et plus acide", "moins ionisée et moins acide"], 0, "Le pH passe de 3,4 à 4,4 alors que $\\alpha$ passe de 4 % à 40 %.", "1.2.4 Effet de la dilution", 3),
    ],
  },
  {
    id: "weak-base-study",
    title: "La base faible : l’ion éthanoate",
    summary: "Étudier une solution d’éthanoate de sodium, définir une base faible et mener son étude quantitative.",
    pages: "3-5",
    section: "2. Base faible",
    durationMinutes: 28,
    xp: 65,
    body: String.raw`## Deux réactions à ne pas confondre

L’**éthanoate de sodium** $\mathrm{CH_3COONa}$ est un solide ionique blanc. Sa **dissolution** est une réaction **totale** et très exothermique :

$$\mathrm{CH_3COONa \xrightarrow{\;H_2O\;} CH_3COO^- + Na^+}$$

Mais une fois en solution, l’ion éthanoate **réagit à son tour** avec l’eau, et cette seconde réaction est **partielle** :

$$\mathrm{CH_3COO^- + H_2O \rightleftharpoons CH_3COOH + OH^-}$$

> C’est ce second équilibre qui rend la solution **basique**. La dissolution du sel est totale ; la réaction de l’anion avec l’eau ne l’est pas.

## Définition

> Une base est dite **faible** en solution aqueuse si sa réaction avec l’eau est **partielle**.

**Exemples** : ammoniac $\mathrm{NH_3}$, méthylamine, ion carbonate $\mathrm{CO_3^{2-}}$, ion propanoate, ion hypochlorite $\mathrm{ClO^-}$.

## L’étude quantitative

Solution d’éthanoate de sodium, $C_b = 10^{-2}$ mol·L⁻¹, $pH = 8{,}4$ à 25 °C.

**Inventaire.** Ions : $\mathrm{H_3O^+}$, $\mathrm{OH^-}$, $\mathrm{Na^+}$, $\mathrm{CH_3COO^-}$. Molécules : $\mathrm{H_2O}$, $\mathrm{CH_3COOH}$.

$$[\mathrm{H_3O^+}] = 10^{-8,4} = 3{,}98\times10^{-9} \qquad [\mathrm{OH^-}] = \frac{K_e}{[\mathrm{H_3O^+}]} = 2{,}51\times10^{-6}$$

L’ion sodium ne réagit pas : $[\mathrm{Na^+}] = C_b = 10^{-2}$ mol·L⁻¹.

**Électroneutralité :**

$$[\mathrm{H_3O^+}] + [\mathrm{Na^+}] = [\mathrm{OH^-}] + [\mathrm{CH_3COO^-}]$$
$$[\mathrm{CH_3COO^-}] \approx [\mathrm{Na^+}] = 10^{-2} \text{ mol·L}^{-1}$$

**Conservation :**

$$[\mathrm{CH_3COOH}] = C_b - [\mathrm{CH_3COO^-}] = [\mathrm{OH^-}] - [\mathrm{H_3O^+}] \approx \mathbf{2{,}51\times10^{-6}} \text{ mol·L}^{-1}$$

**Le coefficient :**

$$\alpha = \frac{2{,}51\times10^{-6}}{10^{-2}} = 2{,}51\times10^{-4}$$

Soit : **sur 100 000 ions éthanoate introduits, 25 seulement ont réagi** avec l’eau. La base est très faible.

> **Astuce mémoire de Davy.** Pour une base faible, le coefficient se calcule à partir de **l’espèce formée par la réaction avec l’eau** — ici $\mathrm{CH_3COOH}$, dont la concentration égale $[\mathrm{OH^-}]$. C’est le miroir exact de l’acide faible, où l’on prenait $[\mathrm{A^-}] = [\mathrm{H_3O^+}]$.`,
    keyPoint: "Dissolution du sel : totale. Réaction de l’anion avec l’eau : partielle, d’où le caractère basique. $\\alpha = [\\mathrm{AH}]/C_b$.",
    example: "$C_b = 10^{-2}$, $pH = 8{,}4$ : $[\\mathrm{CH_3COOH}] = 2{,}51\\times10^{-6}$ et $\\alpha = 2{,}51\\times10^{-4}$.",
    methodSteps: [
      "Distingue la dissolution du sel, totale, de la réaction de l’anion, partielle.",
      "Calcule $[\\mathrm{H_3O^+}]$ puis $[\\mathrm{OH^-}]$, et pose $[\\mathrm{Na^+}] = C_b$.",
      "Écris l’électroneutralité en n’oubliant pas le cation spectateur.",
      "Applique la conservation, puis $\\alpha = [\\mathrm{AH}]/C_b$.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Deux réactions successives, deux natures",
      instruction: "Sélectionne une réaction pour voir son avancement et son rôle.",
      observation: "Le sel se dissout totalement, mais c’est la seconde réaction — partielle — qui donne à la solution son caractère basique. Confondre les deux fait manquer l’essentiel.",
      rootLabel: "Éthanoate de sodium mis dans l’eau",
      rootDetail: "Que se passe-t-il, et dans quel ordre ?",
      nodes: [
        { id: "dissolution", label: "1. La dissolution du sel", role: "totale", detail: "CH₃COONa → CH₃COO⁻ + Na⁺. Réaction totale et très exothermique, comme toute dissolution de composé ionique. Elle libère les ions mais ne rend pas encore la solution basique." },
        { id: "reaction", label: "2. La réaction de l’anion", role: "partielle — équilibre", detail: "CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻. C’est cette réaction, limitée, qui produit les ions hydroxyde et donne son pH basique à la solution. L’ion éthanoate est donc une base faible." },
        { id: "spectateur", label: "L’ion sodium", role: "spectateur — [Na⁺] = Cb", detail: "Il ne réagit pas avec l’eau. Sa concentration reste égale à celle du sel apporté, et il figure dans l’électroneutralité sans jamais rien transformer." },
      ],
    },
    questions: [
      choice("La dissolution de l’éthanoate de sodium dans l’eau est…", ["totale", "partielle", "impossible"], 0, "C’est la réaction de l’ion éthanoate avec l’eau qui est partielle.", "2.1 Éthanoate de sodium", 2),
      short("Écris l’équation de la réaction de l’ion éthanoate avec l’eau.", ["CH3COO- + H2O = CH3COOH + OH-", "ch3coo- + h2o = ch3cooh + oh-"], "Équilibre : double flèche.", "2.2.3 Équation-bilan", 2),
      choice("Qu’est-ce qui rend la solution d’éthanoate de sodium basique ?", ["la réaction de l’ion éthanoate avec l’eau", "la dissolution du sel", "l’ion sodium"], 0, "Elle produit les ions $\\mathrm{OH^-}$.", "Exercice 3 - question 3", 2),
      short("Dans une solution d’éthanoate de sodium à $10^{-2}$ mol·L⁻¹, que vaut $[\\mathrm{Na^+}]$ ? (en mol·L⁻¹)", ["10-2", "10^-2", "0,01", "1e-2"], "L’ion sodium ne réagit pas.", "2.2.1 Étude quantitative", 2),
      short("Pour $pH = 8{,}4$, quelle est $[\\mathrm{CH_3COOH}]$ dans cette solution ? (en mol·L⁻¹)", ["2,51.10-6", "2.51e-6", "2,51 10-6"], "Elle égale $[\\mathrm{OH^-}]$, à $[\\mathrm{H_3O^+}]$ près.", "2.2.1 Conservation", 3),
      choice("Lequel de ces composés est une base faible ?", ["l’ammoniac $\\mathrm{NH_3}$", "l’hydroxyde de sodium", "l’hydroxyde de potassium"], 0, "Exemple cité par le cours.", "2.3 Définition"),
    ],
  },
  {
    id: "chemical-equilibrium-water-role",
    title: "L’équilibre chimique et le double rôle de l’eau",
    summary: "Comprendre l’équilibre comme deux réactions inverses simultanées, et identifier le rôle acide ou basique de l’eau.",
    pages: "5, 8",
    section: "3. Notion d’équilibre chimique et exercice 3",
    durationMinutes: 26,
    xp: 75,
    body: String.raw`## Deux réactions inverses simultanées

Dans toute solution aqueuse d’acide éthanoïque, **deux réactions se produisent en même temps** :

$$\mathrm{(1)\quad CH_3COOH + H_2O \longrightarrow CH_3COO^- + H_3O^+}$$
$$\mathrm{(2)\quad CH_3COO^- + H_3O^+ \longrightarrow CH_3COOH + H_2O}$$

Ces deux réactions **se limitent mutuellement** et conduisent à un **état d’équilibre chimique**, traduit par la double flèche :

$$\mathrm{CH_3COOH + H_2O \rightleftharpoons CH_3COO^- + H_3O^+}$$

À l’équilibre, les concentrations ne varient plus — mais les deux réactions continuent, à vitesses égales.

## L’eau, acide ou base selon le partenaire

C’est l’objet de l’exercice 3, et c’est un point conceptuel important. Comparons deux dissolutions :

**L’éthanoate de sodium :**

$$\mathrm{CH_3COO^- + H_2O \rightleftharpoons CH_3COOH + OH^-}$$

L’eau **cède** un proton $\mathrm{H^+}$ à l’ion éthanoate. **L’eau joue le rôle d’acide.** La solution obtenue est **basique**, puisqu’elle produit des $\mathrm{OH^-}$.

**Le chlorure de méthylammonium :**

$$\mathrm{CH_3NH_3^+ + H_2O \rightleftharpoons CH_3NH_2 + H_3O^+}$$

L’eau **arrache** un proton à l’ion méthylammonium. **L’eau joue le rôle de base.** La solution obtenue est **acide**, puisqu’elle produit des $\mathrm{H_3O^+}$.

## Le tableau à retenir

| Soluté | Rôle de l’eau | Ion produit | Nature de la solution |
|---|---|---|---|
| Ion éthanoate $\mathrm{CH_3COO^-}$ | **acide** (elle cède $\mathrm{H^+}$) | $\mathrm{OH^-}$ | **basique** |
| Ion méthylammonium $\mathrm{CH_3NH_3^+}$ | **base** (elle capte $\mathrm{H^+}$) | $\mathrm{H_3O^+}$ | **acide** |

> **Astuce mémoire de Davy.** L’eau est **amphotère** : elle s’adapte à son partenaire. Face à une base faible elle se comporte en acide, face à un acide faible elle se comporte en base. C’est exactement ce que montrait déjà l’autoprotolyse, où deux molécules d’eau jouaient l’une contre l’autre ces deux rôles.

> **Erreur fréquente.** Croire qu’un sel donne toujours une solution neutre. Tout dépend de l’ion qui réagit : l’éthanoate de sodium donne une solution **basique**, le chlorure de méthylammonium une solution **acide**.`,
    keyPoint: "Un équilibre est fait de deux réactions inverses simultanées qui se limitent. L’eau est amphotère : acide face à une base faible, base face à un acide faible.",
    example: "$\\mathrm{CH_3COO^- + H_2O \\rightleftharpoons CH_3COOH + OH^-}$ : l’eau cède un proton, elle joue le rôle d’acide, la solution est basique.",
    methodSteps: [
      "Écris la dissolution du sel, qui est totale.",
      "Repère l’ion qui réagit ensuite avec l’eau.",
      "Regarde si l’eau cède ou capte un proton pour donner son rôle.",
      "Conclus sur la nature de la solution d’après l’ion produit.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "L’eau change de rôle selon son partenaire",
      instruction: "Sélectionne un soluté pour voir le rôle joué par l’eau et la nature de la solution.",
      observation: "Une même molécule d’eau, deux comportements opposés. C’est ce caractère amphotère qui explique aussi son autoprotolyse, où elle joue les deux rôles à la fois.",
      rootLabel: "Un sel dissous dans l’eau",
      rootDetail: "Quel ion réagit, et l’eau fait-elle quoi ?",
      nodes: [
        { id: "ethanoate", label: "Ion éthanoate CH₃COO⁻", role: "l’eau est un acide", detail: "CH₃COO⁻ + H₂O ⇌ CH₃COOH + OH⁻. L’eau cède un proton H⁺ à l’ion éthanoate : elle joue le rôle d’acide. La réaction libère des ions hydroxyde, donc la solution est basique." },
        { id: "methylammonium", label: "Ion méthylammonium CH₃NH₃⁺", role: "l’eau est une base", detail: "CH₃NH₃⁺ + H₂O ⇌ CH₃NH₂ + H₃O⁺. L’eau arrache un proton à l’ion méthylammonium : elle joue le rôle de base. La réaction libère des ions hydronium, donc la solution est acide." },
        { id: "equilibre", label: "Dans les deux cas, un équilibre", role: "deux réactions inverses", detail: "La réaction directe et la réaction inverse se produisent simultanément et se limitent mutuellement. À l’équilibre les concentrations sont stables, mais les deux réactions continuent à vitesses égales." },
      ],
    },
    questions: [
      choice("Un équilibre chimique résulte de…", ["deux réactions inverses simultanées qui se limitent", "une réaction qui s’arrête", "une réaction totale"], 0, "C’est la notion du cours.", "3. Notion d’équilibre chimique", 2),
      choice("Dans $\\mathrm{CH_3COO^- + H_2O \\rightleftharpoons CH_3COOH + OH^-}$, l’eau joue le rôle…", ["d’acide, elle cède un proton", "de base, elle capte un proton", "de solvant seulement"], 0, "Elle cède un $\\mathrm{H^+}$ à l’ion éthanoate.", "Exercice 3 - question 2", 3),
      choice("Dans $\\mathrm{CH_3NH_3^+ + H_2O \\rightleftharpoons CH_3NH_2 + H_3O^+}$, l’eau joue le rôle…", ["de base, elle capte un proton", "d’acide, elle cède un proton", "de solvant seulement"], 0, "Elle arrache un $\\mathrm{H^+}$ à l’ion méthylammonium.", "Exercice 3 - question 2", 3),
      choice("Une solution aqueuse d’éthanoate de sodium est…", ["basique", "acide", "neutre"], 0, "La réaction de l’anion produit des $\\mathrm{OH^-}$.", "Exercice 3 - question 3", 2),
      choice("Une solution aqueuse de chlorure de méthylammonium est…", ["acide", "basique", "neutre"], 0, "La réaction du cation produit des $\\mathrm{H_3O^+}$.", "Exercice 3 - question 3", 2),
      short("Comment qualifie-t-on une espèce capable de jouer le rôle d’acide **et** de base, comme l’eau ?", ["amphotere", "amphotère", "ampholyte"], "L’eau s’adapte à son partenaire.", "Exercice 3 - question 2", 2),
    ],
  },
  {
    id: "weak-acid-base-workshop",
    title: "Atelier : acide propanoïque, ammoniac, éthylamine",
    summary: "Appliquer la méthode des quatre relations à trois solutions différentes et calculer leurs coefficients d’ionisation.",
    pages: "7-8, 10",
    section: "Exercices 1, 2 et 5",
    durationMinutes: 30,
    xp: 80,
    kind: "practice",
    body: String.raw`## Exercice 1 — l’acide propanoïque

$\mathrm{C_2H_5COOH}$, $C = 5\times10^{-2}$ mol·L⁻¹, $pH = 2{,}9$.

**Est-il fort ?** $-\log(5\times10^{-2}) = 1{,}3 \ne 2{,}9$ : **non, il est faible**.

$$\mathrm{C_2H_5COOH + H_2O \rightleftharpoons C_2H_5COO^- + H_3O^+}$$

| Espèce | Concentration (mol·L⁻¹) |
|---|---|
| $[\mathrm{H_3O^+}]$ | $10^{-2,9} = 1{,}26\times10^{-3}$ |
| $[\mathrm{OH^-}]$ | $7{,}94\times10^{-12}$ |
| $[\mathrm{C_2H_5COO^-}]$ | $\approx 1{,}26\times10^{-3}$ |
| $[\mathrm{C_2H_5COOH}]$ | $5\times10^{-2} - 1{,}26\times10^{-3} = \mathbf{4{,}87\times10^{-2}}$ |

$$\alpha = \frac{1{,}26\times10^{-3}}{5\times10^{-2}} = 0{,}0252 = \mathbf{2{,}52\,\%}$$

## Exercice 2 — l’ammoniac

$\mathrm{NH_3}$, $C_b = 10^{-3}$ mol·L⁻¹, $pH = 10{,}1$.

**Est-elle forte ?** $14 + \log(10^{-3}) = 11 \ne 10{,}1$ : **non, elle est faible**.

$$\mathrm{NH_3 + H_2O \rightleftharpoons NH_4^+ + OH^-}$$

$$[\mathrm{H_3O^+}] = 7{,}94\times10^{-11} \qquad [\mathrm{OH^-}] = 1{,}26\times10^{-4} \text{ mol·L}^{-1}$$

L’électroneutralité $[\mathrm{NH_4^+}] + [\mathrm{H_3O^+}] = [\mathrm{OH^-}]$ donne $[\mathrm{NH_4^+}] \approx 1{,}26\times10^{-4}$, et la conservation $[\mathrm{NH_3}] = 10^{-3} - 1{,}26\times10^{-4} = 8{,}74\times10^{-4}$ mol·L⁻¹.

$$\alpha = \frac{1{,}26\times10^{-4}}{10^{-3}} = \mathbf{12{,}6\,\%}$$

## Exercice 5 — l’éthylamine

$\mathrm{C_2H_5NH_2}$, $C = 10^{-2}$ mol·L⁻¹, $pH = 11{,}3$.

$14 + \log(10^{-2}) = 12 \ne 11{,}3$ : **base faible**.

$$\mathrm{C_2H_5NH_2 + H_2O \rightleftharpoons C_2H_5NH_3^+ + OH^-}$$

$$[\mathrm{H_3O^+}] = 5\times10^{-12} \quad [\mathrm{OH^-}] = 2\times10^{-3} \quad [\mathrm{C_2H_5NH_3^+}] \approx 2\times10^{-3} \quad [\mathrm{C_2H_5NH_2}] = 8\times10^{-3}$$

$$\alpha = \frac{2\times10^{-3}}{10^{-2}} = \mathbf{20\,\%}$$

> **Astuce mémoire de Davy.** Trois exercices, **une seule méthode**. Ce qui change, c’est le test initial : $-\log C$ pour un acide, $14 + \log C$ pour une base. Le reste — pH, $K_e$, électroneutralité, conservation, coefficient — est rigoureusement identique.`,
    keyPoint: "Même démarche pour les trois : tester la force, écrire l’équilibre, appliquer les quatre relations, puis $\\alpha = [\\text{espèce formée}]/C$.",
    example: "Acide propanoïque : $\\alpha = 2{,}52\\,\\%$. Ammoniac : $12{,}6\\,\\%$. Éthylamine : $20\\,\\%$.",
    methodSteps: [
      "Teste la force : $-\\log C$ pour un acide, $14 + \\log C$ pour une base.",
      "Écris l’équilibre avec une double flèche.",
      "Applique les quatre relations dans l’ordre.",
      "Calcule $\\alpha$ en divisant par la concentration apportée.",
    ],
    interaction: timeline(
      [
        { label: "Tester la force", shortLabel: "Test", detail: "Comparer le pH mesuré à celui que prédirait la relation des espèces fortes. Acide propanoïque : −log(5 × 10⁻²) = 1,3 alors que le pH vaut 2,9 — l’acide est donc faible." },
        { label: "Écrire l’équilibre", shortLabel: "Équation", detail: "Double flèche obligatoire. C₂H₅COOH + H₂O ⇌ C₂H₅COO⁻ + H₃O⁺ pour un acide, NH₃ + H₂O ⇌ NH₄⁺ + OH⁻ pour une base." },
        { label: "Appliquer les quatre relations", shortLabel: "Calculer", detail: "pH, produit ionique, électroneutralité, conservation. L’ordre ne change jamais, et chaque relation fournit exactement une concentration." },
        { label: "Calculer le coefficient", shortLabel: "α", detail: "α = [espèce formée]/C. Pour un acide, l’espèce formée est l’anion ; pour une base, c’est le cation ou la molécule d’acide conjugué. 2,52 %, 12,6 % et 20 % pour les trois exercices." },
      ],
      "Une méthode, trois solutions",
      "Parcours les quatre étapes : elles s’appliquent à l’identique aux trois exercices.",
      "Seul le test initial distingue un acide d’une base. Tout le reste de la démarche est commun, ce qui rend ces exercices très rentables à travailler ensemble.",
    ),
    questions: [
      short("Exercice 1 : que vaut $-\\log C$ pour $C = 5\\times10^{-2}$ mol·L⁻¹ ? (une décimale)", ["1,3", "1.3"], "À comparer au pH mesuré de 2,9 : l’acide est faible.", "Exercice 1 - question 1", 2),
      short("Exercice 1 : quelle est $[\\mathrm{C_2H_5COOH}]$ ? (en mol·L⁻¹, trois chiffres)", ["4,87.10-2", "4.87e-2", "4,87 10-2", "0,0487"], "$5\\times10^{-2} - 1{,}26\\times10^{-3}$.", "Exercice 1 - question 3 corrigée", 3),
      short("Exercice 1 : que vaut le coefficient d’ionisation ? (en %, deux décimales)", ["2,52", "2.52", "2,52 %"], "$1{,}26\\times10^{-3}/5\\times10^{-2}$.", "Exercice 1 - question 4", 2),
      short("Exercice 2 : écris l’équation de la réaction de l’ammoniac avec l’eau.", ["NH3 + H2O = NH4+ + OH-", "nh3 + h2o = nh4+ + oh-"], "Équilibre : double flèche.", "Exercice 2 - question 2", 2),
      short("Exercice 2 : quelle est $[\\mathrm{OH^-}]$ pour $pH = 10{,}1$ ? (en mol·L⁻¹, trois chiffres)", ["1,26.10-4", "1.26e-4", "1,26 10-4"], "$K_e/[\\mathrm{H_3O^+}]$ avec $[\\mathrm{H_3O^+}] = 7{,}94\\times10^{-11}$.", "Exercice 2 - question 3.2", 3),
      short("Exercice 5 : que vaut le coefficient d’ionisation de l’éthylamine ? (en %)", ["20", "20 %", "20%"], "$2\\times10^{-3}/10^{-2} = 0{,}2$.", "Exercice 5 - question 4", 2),
      choice("Exercice 5 : pourquoi l’éthylamine est-elle une base faible ?", ["$14 + \\log C = 12$ diffère du pH mesuré de 11,3", "son pH est inférieur à 7", "elle ne conduit pas le courant"], 0, "Le calcul et la mesure ne coïncident pas.", "Exercice 5 - question 1", 2),
    ],
    corrections: [
      "Page 7, exercice 1 : la conservation de la matière soustrait 3,16 × 10⁻³ mol·L⁻¹, alors que la concentration en ion propanoate vient d’être établie à 1,26 × 10⁻³ mol·L⁻¹ deux lignes plus haut — et que le coefficient d’ionisation, calculé juste après, utilise bien cette dernière valeur. Le résultat correct est [C₂H₅COOH] = 5 × 10⁻² − 1,26 × 10⁻³ = 4,87 × 10⁻² mol·L⁻¹, et non 4,7 × 10⁻².",
      "Page 10, exercice 5 : le corrigé écrit « 14 + logC ± pH ». Le symbole attendu est ≠ : c’est précisément parce que les deux valeurs diffèrent que la base est faible.",
    ],
  },
  {
    id: "dilution-mission",
    title: "Mission finale : l’influence de la dilution",
    summary: "Mener l’étude complète de deux solutions diluées et démontrer par le calcul que la dilution accroît l’ionisation.",
    pages: "6, 8-9",
    section: "Situation d’évaluation et exercice 4",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation — l’acide méthanoïque

Une solution $\mathrm{S}$ d’**acide méthanoïque** $\mathrm{HCOOH}$ de concentration $C = 10^{-2}$ mol·L⁻¹ a un $pH = 2{,}9$. On la **dilue 20 fois** et on obtient $\mathrm{S'}$, de $pH = 3{,}4$.

**1. Fort ou faible ?** $-\log(10^{-2}) = 2 \ne 2{,}9$ : l’acide méthanoïque est **faible**.

$$\mathrm{HCOOH + H_2O \rightleftharpoons HCOO^- + H_3O^+}$$

**2. La solution $\mathrm{S}$.**

$$[\mathrm{H_3O^+}] = 10^{-2,9} = 1{,}26\times10^{-3} \qquad [\mathrm{OH^-}] = 7{,}94\times10^{-12}$$
$$[\mathrm{HCOO^-}] \approx 1{,}26\times10^{-3} \qquad [\mathrm{HCOOH}] = 10^{-2} - 1{,}26\times10^{-3} = 8{,}74\times10^{-3}$$

**3. La solution $\mathrm{S'}$**, de concentration $C' = C/20 = 5\times10^{-4}$ mol·L⁻¹.

$$[\mathrm{H_3O^+}] = 10^{-3,4} = 3{,}98\times10^{-4} \qquad [\mathrm{OH^-}] = 2{,}51\times10^{-11}$$
$$[\mathrm{HCOO^-}] \approx 3{,}98\times10^{-4} \qquad [\mathrm{HCOOH}] = 5\times10^{-4} - 3{,}98\times10^{-4} = 1{,}02\times10^{-4}$$

**4. Les coefficients.**

$$\alpha = \frac{1{,}26\times10^{-3}}{10^{-2}} = \mathbf{0{,}126} \qquad \alpha' = \frac{3{,}98\times10^{-4}}{5\times10^{-4}} = \mathbf{0{,}8}$$

**La conclusion :** $\alpha' > \alpha$ — de 12,6 % à 80 %. **La dilution augmente l’ionisation** d’un acide faible.

## L’étude de laboratoire — le chlorure d’ammonium

On prépare 1 L de solution $\mathrm{S_1}$ de $\mathrm{NH_4Cl}$ à $C_1 = 5\times10^{-2}$ mol·L⁻¹, de $pH_1 = 5{,}3$. Puis on dilue $V_1 = 10$ mL avec $V_e = 90$ mL d’eau, ce qui donne $\mathrm{S_2}$ de $pH_2 = 5{,}8$.

**La masse à peser.** $M(\mathrm{NH_4Cl}) = 14 + 4 + 35{,}5 = 53{,}5$ g·mol⁻¹ :

$$m = C_1 V M = 5\times10^{-2} \times 1 \times 53{,}5 = \mathbf{2{,}7 \text{ g}}$$

**La préparation.** Peser 2,7 g de solide, l’introduire dans une **fiole jaugée de 1000 mL**, ajouter l’eau distillée jusqu’au **trait de jauge**, puis homogénéiser.

**Dans $\mathrm{S_1}$.** La dissolution $\mathrm{NH_4Cl \to NH_4^+ + Cl^-}$ est totale, mais $-\log(5\times10^{-2}) = 1{,}3 \ne 5{,}3$ : l’**ion ammonium est un acide faible**.

$$\mathrm{NH_4^+ + H_2O \rightleftharpoons NH_3 + H_3O^+}$$

$$[\mathrm{H_3O^+}] = 5\times10^{-6} \quad [\mathrm{OH^-}] = 2\times10^{-9} \quad [\mathrm{Cl^-}] = [\mathrm{NH_4^+}] = 5\times10^{-2} \quad [\mathrm{NH_3}] \approx 5\times10^{-6}$$

$$\alpha_1 = \frac{5\times10^{-6}}{5\times10^{-2}} = \mathbf{10^{-4}}$$

**Dans $\mathrm{S_2}$** — la partie que le document laisse sans corrigé. Le volume passe de 10 à 100 mL, soit une **dilution d’un facteur 10** :

$$C_2 = C_1 \times \frac{V_1}{V_1 + V_e} = 5\times10^{-2} \times \frac{10}{100} = 5\times10^{-3} \text{ mol·L}^{-1}$$

$$[\mathrm{H_3O^+}] = 10^{-5,8} = 1{,}58\times10^{-6} \qquad [\mathrm{OH^-}] = 6{,}31\times10^{-9}$$
$$[\mathrm{Cl^-}] = [\mathrm{NH_4^+}] = 5\times10^{-3} \qquad [\mathrm{NH_3}] \approx 1{,}58\times10^{-6} \text{ mol·L}^{-1}$$

$$\alpha_2 = \frac{1{,}58\times10^{-6}}{5\times10^{-3}} = \mathbf{3{,}16\times10^{-4}}$$

**La comparaison.** $\alpha_2 > \alpha_1$ — le coefficient est multiplié par environ 3 pour une dilution par 10. **La dilution favorise la dissociation**, exactement comme pour l’acide méthanoïque.

> **Astuce mémoire de Davy.** Les deux problèmes démontrent la **même loi** par deux chemins : une dilution par 20 fait passer $\alpha$ de 12,6 % à 80 %, une dilution par 10 le multiplie par 3. Retiens le sens de variation plutôt que les chiffres — c’est lui qu’on te demandera de justifier.`,
    keyPoint: "Diluer un acide faible **augmente** son coefficient d’ionisation. $C_2 = C_1 V_1/(V_1+V_e)$, puis la méthode des quatre relations.",
    example: "Acide méthanoïque dilué 20 fois : $\\alpha$ passe de 0,126 à 0,8. Ion ammonium dilué 10 fois : $\\alpha$ passe de $10^{-4}$ à $3{,}16\\times10^{-4}$.",
    methodSteps: [
      "Calcule la concentration après dilution : $C_2 = C_1 V_1/(V_1+V_e)$.",
      "Applique les quatre relations à chaque solution séparément.",
      "Calcule les deux coefficients d’ionisation.",
      "Compare-les et conclus sur l’influence de la dilution.",
    ],
    interaction: timeline(
      [
        { label: "Calculer la concentration diluée", shortLabel: "Diluer", detail: "C₂ = C₁ × V₁/(V₁ + Ve). Pour 10 mL complétés à 100 mL, la dilution vaut 10 : C₂ = 5 × 10⁻³ mol·L⁻¹. Ne pas confondre le volume prélevé et le volume final." },
        { label: "Étudier chaque solution", shortLabel: "Étudier", detail: "Les quatre relations s’appliquent séparément à chacune, avec son propre pH. Dans S₁ : [NH₃] = 5 × 10⁻⁶ mol·L⁻¹. Dans S₂ : 1,58 × 10⁻⁶ mol·L⁻¹." },
        { label: "Calculer les deux coefficients", shortLabel: "α₁ et α₂", detail: "α₁ = 5 × 10⁻⁶ / 5 × 10⁻² = 10⁻⁴. α₂ = 1,58 × 10⁻⁶ / 5 × 10⁻³ = 3,16 × 10⁻⁴. Chacun se calcule avec la concentration apportée de sa propre solution." },
        { label: "Comparer et conclure", shortLabel: "Conclure", detail: "α₂ > α₁ : la dilution augmente la dissociation. C’est le résultat que les deux problèmes cherchent à établir, et c’est lui qui est demandé en conclusion." },
      ],
      "Démontrer l’effet de la dilution",
      "Suis les quatre étapes : elles couvrent la situation d’évaluation comme l’étude de laboratoire.",
      "La quantité d’ions diminue alors que la proportion ionisée augmente. Les deux affirmations sont vraies et ne se contredisent pas — c’est la distinction entre une proportion et une quantité.",
    ),
    questions: [
      choice("L’acide méthanoïque à $10^{-2}$ mol·L⁻¹ a un pH de 2,9. Il est donc…", ["faible, car $-\\log C = 2 \\ne 2{,}9$", "fort, car $-\\log C = 2$", "impossible à classer"], 0, "Le calcul et la mesure diffèrent.", "Situation d’évaluation - question 1", 2),
      short("Quelle est la concentration de $\\mathrm{S'}$, obtenue en diluant 20 fois une solution à $10^{-2}$ mol·L⁻¹ ?", ["5.10-4", "5e-4", "5 10-4", "0,0005"], "$C' = C/20$.", "Situation d’évaluation - question 3.2", 2),
      short("Que vaut $\\alpha$ pour la solution $\\mathrm{S}$ ? (trois décimales)", ["0,126", "0.126"], "$1{,}26\\times10^{-3}/10^{-2}$.", "Situation d’évaluation - question 4.1", 2),
      short("Que vaut $\\alpha'$ pour la solution $\\mathrm{S'}$ ? (une décimale)", ["0,8", "0.8", "80 %", "80%"], "$3{,}98\\times10^{-4}/5\\times10^{-4}$.", "Situation d’évaluation - question 4.1", 3),
      short("Exercice 4 : quelle masse de $\\mathrm{NH_4Cl}$ faut-il peser pour 1 L à $5\\times10^{-2}$ mol·L⁻¹ ? (en g, une décimale)", ["2,7", "2.7", "2,7 g"], "$m = C_1 V M$ avec $M = 53{,}5$ g·mol⁻¹.", "Exercice 4 - question 1.1", 2),
      short("Exercice 4 : quelle est la concentration $C_2$ après ajout de 90 mL d’eau à 10 mL de $\\mathrm{S_1}$ ? (en mol·L⁻¹)", ["5.10-3", "5e-3", "5 10-3", "0,005"], "Dilution d’un facteur 10.", "Exercice 4 - question 3.1", 3),
      short("Exercice 4 : que vaut $\\alpha_2$ dans $\\mathrm{S_2}$ ? (trois chiffres)", ["3,16.10-4", "3.16e-4", "3,16 10-4"], "$1{,}58\\times10^{-6}/5\\times10^{-3}$.", "Exercice 4 - question 3.3 corrigée", 3),
      choice("Que conclut-on en comparant $\\alpha_1$ et $\\alpha_2$ ?", ["la dilution augmente la dissociation", "la dilution diminue la dissociation", "la dilution ne change rien"], 0, "$\\alpha_2 = 3{,}16\\times10^{-4} > \\alpha_1 = 10^{-4}$.", "Exercice 4 - question 3.4", 2),
    ],
    corrections: [
      "Pages 8 et 9, exercice 4 : le corrigé s’arrête après le coefficient α₁ et ne traite pas la partie 3 (questions 3.1 à 3.4), pourtant posée par l’énoncé. Elle est complétée ici : C₂ = 5 × 10⁻³ mol·L⁻¹, [H₃O⁺] = 1,58 × 10⁻⁶, [OH⁻] = 6,31 × 10⁻⁹, [Cl⁻] = [NH₄⁺] = 5 × 10⁻³, [NH₃] = 1,58 × 10⁻⁶ mol·L⁻¹, et α₂ = 3,16 × 10⁻⁴, supérieur à α₁ = 10⁻⁴.",
      "Page 9, exercice 4 : la dernière réponse du corrigé est numérotée « 4. Coefficient d’ionisation » alors qu’elle répond à la question 2.4. La numérotation est rétablie.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const weakAcidBasePath: LearningPath = {
  id: "terminale-cd-chemistry-weak-acid-base",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Chimie générale" },
  chapterNumber: 7,
  title: "Acide faible - base faible",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Établir par l’expérience qu’une ionisation peut être partielle",
    "Calculer les concentrations d’une solution d’acide ou de base faible",
    "Définir le coefficient d’ionisation et l’effet de la dilution",
    "Identifier le rôle acide ou basique de l’eau selon son partenaire",
  ],
  modules: [
    { id: "weak-acid-base-mastery", title: "Maîtriser les acides faibles et les bases faibles", description: "Un niveau après l’autre, de la conductibilité comparée à l’influence de la dilution.", lessons: builtLevels },
  ],
};
