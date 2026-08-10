import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L7_Acide fort-base forte.pdf";

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
      tip: "Vérifie toujours un résultat par l’électroneutralité : la somme des charges positives doit égaler celle des charges négatives.",
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
    id: "strong-acid-definition",
    title: "L’acide fort : une ionisation totale",
    summary: "Comprendre la dissolution du chlorure d’hydrogène, définir un acide fort et connaître les principaux exemples.",
    pages: "1-2",
    section: "1. Acide fort",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## La dissolution du chlorure d’hydrogène

Le **chlorure d’hydrogène** $\mathrm{HCl}$ est un **gaz très soluble** dans l’eau. Sa dissolution est **exothermique** et donne une solution aqueuse d’**acide chlorhydrique**.

**Caractère ionique.** La solution obtenue **conduit le courant électrique** : elle contient donc des ions, les ions **hydronium $\mathrm{H_3O^+}$** et les ions **chlorure $\mathrm{Cl^-}$**.

**Nature de la réaction.** L’ionisation du chlorure d’hydrogène dans l’eau est **totale**. C’est pourquoi l’acide chlorhydrique est un **acide fort** :

$$\mathrm{HCl + H_2O \longrightarrow H_3O^+ + Cl^-}$$

La **flèche simple** traduit cette totalité — à comparer à la double flèche des acides carboxyliques, qui sont faibles.

## Définition

> Un acide $\mathrm{HA}$ est dit **fort** s’il **réagit totalement** avec l’eau.

$$\mathrm{HA + H_2O \longrightarrow H_3O^+ + A^-}$$

## Les exemples du cours

| Monoacides forts | Diacide fort |
|---|---|
| $\mathrm{HCl}$ acide chlorhydrique · $\mathrm{HNO_3}$ acide nitrique · $\mathrm{HBr}$ acide bromhydrique · $\mathrm{HI}$ acide iodhydrique · $\mathrm{HF}$ acide fluorhydrique | $\mathrm{H_2SO_4}$ acide sulfurique |

Un **monoacide** libère **un** ion $\mathrm{H_3O^+}$ par molécule ; un **diacide** en libère **deux**.

> **Astuce mémoire de Davy.** Les caractéristiques de la réaction d’un acide fort avec l’eau tiennent en trois mots : **exothermique, rapide et totale**. Ce trio revient mot pour mot dans la situation d’évaluation.

> **Erreur fréquente.** Écrire l’ionisation d’un acide fort avec une double flèche. Fort veut dire **totale** : la flèche est simple, et il ne reste aucune molécule $\mathrm{HA}$ en solution.`,
    keyPoint: "Acide fort : $\\mathrm{HA + H_2O \\to H_3O^+ + A^-}$, réaction exothermique, rapide et **totale**, écrite avec une flèche simple.",
    example: "$\\mathrm{HCl + H_2O \\to H_3O^+ + Cl^-}$ : il ne reste aucune molécule de $\\mathrm{HCl}$ en solution.",
    methodSteps: [
      "Vérifie que l’acide figure parmi les acides forts connus.",
      "Écris son ionisation avec une flèche simple.",
      "Identifie les ions formés : $\\mathrm{H_3O^+}$ et l’anion correspondant.",
      "Compte les $\\mathrm{H_3O^+}$ libérés : un pour un monoacide, deux pour un diacide.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Ce qui distingue un acide fort",
      instruction: "Sélectionne un aspect pour voir ce que « fort » implique concrètement.",
      observation: "Un seul mot — totale — détermine tout : l’écriture de l’équation, la composition de la solution, et la relation entre pH et concentration du niveau suivant.",
      rootLabel: "Acide HA mis dans l’eau",
      rootDetail: "Que signifie exactement « fort » ?",
      nodes: [
        { id: "totale", label: "Une réaction totale", role: "flèche simple", detail: "HA + H₂O → H₃O⁺ + A⁻. Toutes les molécules d’acide sont ionisées : il n’en reste aucune en solution. C’est ce qui oppose l’acide fort à l’acide carboxylique de la leçon 4, qui n’est que partiellement dissocié." },
        { id: "ionique", label: "Une solution ionique", role: "elle conduit le courant", detail: "La conduction électrique prouve la présence d’ions. Dans l’acide chlorhydrique : H₃O⁺ et Cl⁻, plus les OH⁻ issus de l’autoprotolyse de l’eau." },
        { id: "exothermique", label: "Une dissolution exothermique", role: "elle dégage de la chaleur", detail: "La dissolution du chlorure d’hydrogène gazeux, comme celle de la soude solide, libère de la chaleur. Les trois caractéristiques attendues à l’examen sont : exothermique, rapide et totale." },
        { id: "monodi", label: "Mono- ou diacide", role: "1 ou 2 H₃O⁺ par molécule", detail: "Les monoacides forts du cours sont HCl, HNO₃, HBr, HI et HF. Le seul diacide fort cité est l’acide sulfurique H₂SO₄, qui libère deux ions hydronium par molécule." },
      ],
    },
    questions: [
      choice("Un acide $\\mathrm{HA}$ est dit fort s’il…", ["réagit totalement avec l’eau", "réagit partiellement avec l’eau", "ne réagit pas avec l’eau"], 0, "C’est la définition du cours.", "1.2 Définition"),
      short("Écris l’équation-bilan de la réaction du chlorure d’hydrogène avec l’eau.", ["HCl + H2O = H3O+ + Cl-", "HCl + H2O -> H3O+ + Cl-", "hcl+h2o=h3o++cl-"], "Flèche simple : la réaction est totale.", "1.1 Dissolution", 2),
      choice("Quelles sont les caractéristiques de l’ionisation d’un acide fort dans l’eau ?", ["exothermique, rapide et totale", "endothermique, lente et limitée", "athermique, lente et totale"], 0, "Les trois caractéristiques attendues.", "Situation d’évaluation - question 1.2", 2),
      choice("Lequel de ces acides est un **di**acide fort ?", ["$\\mathrm{H_2SO_4}$", "$\\mathrm{HCl}$", "$\\mathrm{HNO_3}$", "$\\mathrm{HBr}$"], 0, "L’acide sulfurique libère deux $\\mathrm{H_3O^+}$.", "1.3.2 Diacide fort", 2),
      short("Quel est le nom de l’acide $\\mathrm{HNO_3}$ ?", ["acide nitrique", "l'acide nitrique", "nitrique"], "Monoacide fort du cours.", "1.3.1 Monoacides forts"),
      choice("Quels ions contient une solution d’acide chlorhydrique ?", ["$\\mathrm{H_3O^+}$ et $\\mathrm{Cl^-}$", "$\\mathrm{HCl}$ et $\\mathrm{OH^-}$", "$\\mathrm{Na^+}$ et $\\mathrm{Cl^-}$"], 0, "Plus les $\\mathrm{OH^-}$ de l’autoprotolyse, en très faible quantité.", "1.1 Caractère ionique", 2),
    ],
  },
  {
    id: "strong-acid-ph",
    title: "Le pH d’un monoacide fort",
    summary: "Utiliser la relation pH = −log Ca, connaître son domaine de validité et prouver qu’un acide est fort.",
    pages: "2",
    section: "1.4 Expression du pH",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## La relation

Le pH d’une solution de **monoacide fort** de concentration $C_a$ est donné par :

$$\boxed{\;pH = -\log C_a \qquad\Longleftrightarrow\qquad C_a = 10^{-pH}\;}$$

## Pourquoi cette relation

L’ionisation étant **totale**, chaque molécule d’acide donne exactement un ion hydronium :

$$[\mathrm{H_3O^+}] = C_a$$

Il suffit alors d’appliquer la définition du pH vue à la leçon précédente. La relation n’est donc pas une formule à mémoriser : c’est une **conséquence directe** du caractère total de la réaction.

## Le domaine de validité

$$10^{-6} \le C_a \le 10^{-2} \text{ mol·L}^{-1}$$

Cette restriction n’est pas décorative :

- **au-dessus de $10^{-2}$**, la solution est trop concentrée et la relation s’écarte de la mesure ;
- **en dessous de $10^{-6}$**, les ions $\mathrm{H_3O^+}$ produits par l’**autoprotolyse de l’eau** ne sont plus négligeables devant ceux de l’acide.

## Prouver qu’un acide est fort

C’est le raisonnement type de la leçon. On compare le **pH mesuré** au **pH calculé** par la relation :

> Une solution de bromure d’hydrogène $\mathrm{HBr}$ de concentration $C = 10^{-2}$ mol·L⁻¹ a un $pH = 2$ à 25 °C.
>
> $-\log C = -\log(10^{-2}) = 2$, or le pH mesuré vaut 2. Les deux coïncident, **donc $\mathrm{HBr}$ est un acide fort**.

$$\mathrm{HBr + H_2O \longrightarrow H_3O^+ + Br^-}$$

> **Astuce mémoire de Davy.** Le raisonnement est toujours le même : **calculer**, puis **comparer**. Si $pH_{\text{calculé}} = pH_{\text{mesuré}}$, l’acide est fort. Si le pH mesuré est **plus grand** que le calcul, c’est que l’acide n’est pas totalement ionisé : il est faible — ce sera l’objet de la leçon suivante.

> **Erreur fréquente.** Appliquer $pH = -\log C_a$ à un **diacide**. La relation ne vaut que pour un **monoacide** fort : un diacide libère deux ions hydronium par molécule, donc $[\mathrm{H_3O^+}] = 2C_a$.`,
    keyPoint: "$pH = -\\log C_a$ pour un **monoacide** fort, valable pour $10^{-6} \\le C_a \\le 10^{-2}$ mol·L⁻¹. Un acide est fort si le pH calculé égale le pH mesuré.",
    example: "$\\mathrm{HBr}$ à $C = 10^{-2}$ mol·L⁻¹ : $-\\log(10^{-2}) = 2$, égal au pH mesuré. C’est donc un acide fort.",
    methodSteps: [
      "Vérifie que la concentration est dans le domaine $10^{-6}$ à $10^{-2}$ mol·L⁻¹.",
      "Calcule $pH = -\\log C_a$.",
      "Compare au pH mesuré donné par l’énoncé.",
      "Conclus : égalité signifie acide fort, écris ensuite son ionisation.",
    ],
    interaction: timeline(
      [
        { label: "L’ionisation est totale", shortLabel: "Totale", detail: "HA + H₂O → H₃O⁺ + A⁻, sans molécule restante. C’est l’hypothèse de départ, et tout en découle." },
        { label: "Donc [H₃O⁺] = Ca", shortLabel: "Égalité", detail: "Chaque molécule d’acide donne exactement un ion hydronium. La concentration en ions hydronium est donc égale à la concentration de l’acide apporté." },
        { label: "Donc pH = −log Ca", shortLabel: "Relation", detail: "Il suffit d’appliquer la définition du pH. La relation n’est pas à apprendre par cœur : elle se reconstruit en deux lignes à partir du caractère total de la réaction." },
        { label: "Dans un domaine limité", shortLabel: "Validité", detail: "10⁻⁶ ≤ Ca ≤ 10⁻². Trop concentrée, la solution s’écarte du modèle ; trop diluée, les ions H₃O⁺ de l’autoprotolyse de l’eau ne sont plus négligeables devant ceux de l’acide." },
      ],
      "D’où vient la relation pH = −log Ca",
      "Parcours les quatre étapes : elles justifient la formule au lieu de la faire mémoriser.",
      "Reconstruire la relation plutôt que la retenir évite l’erreur classique de l’appliquer à un diacide, où [H₃O⁺] vaut 2Ca.",
    ),
    questions: [
      short("Écris la relation entre le pH et la concentration d’un monoacide fort.", ["pH = -logCa", "pH=-log C", "-log C", "ph = -log ca"], "Conséquence directe de l’ionisation totale.", "1.4 Expression du pH", 2),
      short("Quel est le domaine de validité de cette relation ? Donne la borne inférieure en mol·L⁻¹.", ["10-6", "10^-6", "1e-6"], "$10^{-6} \\le C_a \\le 10^{-2}$.", "1.4 Expression du pH", 2),
      choice("Pourquoi la relation cesse-t-elle d’être valable en dessous de $10^{-6}$ mol·L⁻¹ ?", ["les ions $\\mathrm{H_3O^+}$ de l’autoprotolyse ne sont plus négligeables", "l’acide devient faible", "la solution devient basique"], 0, "L’eau elle-même fournit alors une part notable des ions hydronium.", "1.4 Expression du pH", 3),
      short("Une solution de $\\mathrm{HBr}$ à $10^{-2}$ mol·L⁻¹ a un pH mesuré de 2. Quel pH la relation prévoit-elle ?", ["2", "pH = 2"], "$-\\log(10^{-2}) = 2$, donc l’acide est fort.", "Activité d’application 1", 2),
      choice("Le pH mesuré d’une solution acide est **supérieur** au pH calculé par $-\\log C_a$. On en déduit que l’acide est…", ["faible", "fort", "un diacide"], 0, "Il n’est pas totalement ionisé.", "1.4 Expression du pH", 3),
      short("Quelle est la concentration d’un monoacide fort dont le pH vaut 4 ? (en mol·L⁻¹)", ["10-4", "10^-4", "1e-4"], "$C_a = 10^{-pH}$.", "Situation d’évaluation - question 3.1", 2),
    ],
  },
  {
    id: "strong-base-definition",
    title: "La base forte : une dissociation totale",
    summary: "Décrire la dissolution de l’hydroxyde de sodium, définir une base forte et connaître les exemples du cours.",
    pages: "3",
    section: "2. Base forte",
    durationMinutes: 22,
    xp: 60,
    body: String.raw`## La dissolution de l’hydroxyde de sodium

L’**hydroxyde de sodium**, ou **soude**, de formule $\mathrm{NaOH}$, est un **solide blanc très soluble** dans l’eau. Sa dissolution est **exothermique**.

**Caractère ionique.** La solution conduit le courant : elle contient les ions **sodium $\mathrm{Na^+}$** et **hydroxyde $\mathrm{OH^-}$**.

**Nature de la réaction.** La dissociation est **totale**, donc l’hydroxyde de sodium est une **base forte** :

$$\mathrm{NaOH \xrightarrow{\;H_2O\;} Na^+ + OH^-}$$

## Définition

> Une base $\mathrm{BOH}$ (ou $\mathrm{B^-}$) est dite **forte** si elle **réagit totalement** avec l’eau.

Deux écritures selon la nature de la base :

$$\mathrm{BOH \xrightarrow{\;H_2O\;} B^+ + OH^-} \qquad\text{ou}\qquad \mathrm{B^- + H_2O \longrightarrow BH + OH^-}$$

La seconde forme concerne les bases qui ne sont pas des hydroxydes, comme l’**ion éthanolate**.

## Les exemples du cours

| Monobases fortes | Dibase forte |
|---|---|
| $\mathrm{NaOH}$ hydroxyde de sodium · $\mathrm{KOH}$ hydroxyde de potassium · $\mathrm{C_2H_5O^-}$ ion éthanolate | $\mathrm{Ca(OH)_2}$ hydroxyde de calcium |

> **Astuce mémoire de Davy.** La symétrie avec l’acide fort est parfaite : dissolution **exothermique**, solution **ionique**, réaction **totale**. Seul l’ion produit change — $\mathrm{OH^-}$ au lieu de $\mathrm{H_3O^+}$. Retenir un seul schéma te donne les deux moitiés de la leçon.

> **Erreur fréquente.** Écrire l’ion éthanolate comme un hydroxyde. $\mathrm{C_2H_5O^-}$ ne contient pas de groupe $\mathrm{OH}$ libérable : il **prend** un proton à l’eau et libère ainsi un $\mathrm{OH^-}$, selon la seconde écriture.`,
    keyPoint: "Base forte : dissociation totale. $\\mathrm{NaOH \\to Na^+ + OH^-}$, ou $\\mathrm{B^- + H_2O \\to BH + OH^-}$ pour une base non hydroxyde.",
    example: "$\\mathrm{KOH \\xrightarrow{H_2O} K^+ + OH^-}$ : dissociation totale, donc base forte.",
    methodSteps: [
      "Vérifie que la base figure parmi les bases fortes connues.",
      "Choisis l’écriture : hydroxyde qui se dissocie, ou anion qui capte un proton.",
      "Écris l’équation avec une flèche simple.",
      "Compte les $\\mathrm{OH^-}$ libérés : un pour une monobase, deux pour une dibase.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Deux façons de libérer un ion hydroxyde",
      instruction: "Sélectionne un type de base pour voir son équation et ses exemples.",
      observation: "Le résultat est le même — des ions OH⁻ en solution — mais le chemin diffère : l’hydroxyde se contente de se dissocier, l’anion doit arracher un proton à l’eau.",
      rootLabel: "Base forte mise dans l’eau",
      rootDetail: "La base contient-elle déjà un groupe OH ?",
      nodes: [
        { id: "hydroxyde", label: "Hydroxyde métallique", role: "BOH → B⁺ + OH⁻", detail: "Le solide se dissocie totalement et libère directement ses ions hydroxyde. Exemples : NaOH, KOH. La dissolution est exothermique et la solution conduit le courant." },
        { id: "anion", label: "Anion basique", role: "B⁻ + H₂O → BH + OH⁻", detail: "L’anion ne contient pas de groupe OH : il capte un proton à une molécule d’eau, qui devient alors un ion hydroxyde. Exemple du cours : l’ion éthanolate C₂H₅O⁻." },
        { id: "dibase", label: "Dibase forte", role: "2 OH⁻ par unité", detail: "L’hydroxyde de calcium Ca(OH)₂ libère deux ions hydroxyde par unité dissoute. La relation pH = 14 + log Cb, valable pour une monobase, ne s’applique donc pas telle quelle." },
      ],
    },
    questions: [
      choice("Une base est dite forte si elle…", ["réagit totalement avec l’eau", "réagit partiellement avec l’eau", "libère des ions $\\mathrm{H_3O^+}$"], 0, "Définition du cours.", "2.2 Définition"),
      short("Écris l’équation de dissociation de l’hydroxyde de sodium dans l’eau.", ["NaOH = Na+ + OH-", "NaOH -> Na+ + OH-", "naoh = na+ + oh-"], "Dissociation totale.", "2.1 Solution aqueuse", 2),
      choice("Quels ions contient une solution d’hydroxyde de sodium ?", ["$\\mathrm{Na^+}$ et $\\mathrm{OH^-}$", "$\\mathrm{Na^+}$ et $\\mathrm{H_3O^+}$", "$\\mathrm{NaOH}$ et $\\mathrm{OH^-}$"], 0, "Plus les $\\mathrm{H_3O^+}$ de l’autoprotolyse.", "2.1 Caractère ionique"),
      choice("Lequel de ces composés est une **di**base forte ?", ["$\\mathrm{Ca(OH)_2}$", "$\\mathrm{NaOH}$", "$\\mathrm{KOH}$", "$\\mathrm{C_2H_5O^-}$"], 0, "L’hydroxyde de calcium libère deux $\\mathrm{OH^-}$.", "2.3.2 Dibase forte", 2),
      short("Comment s’appelle l’ion $\\mathrm{C_2H_5O^-}$ ?", ["ion ethanolate", "ion éthanolate", "ethanolate", "éthanolate"], "Base forte qui n’est pas un hydroxyde.", "2.3.1 Monobases fortes", 2),
      choice("La dissolution de l’hydroxyde de sodium dans l’eau est…", ["exothermique", "endothermique", "athermique"], 0, "Comme celle du chlorure d’hydrogène.", "2.1 Solution aqueuse"),
    ],
  },
  {
    id: "strong-base-ph",
    title: "Le pH d’une monobase forte",
    summary: "Utiliser la relation pH = 14 + log Cb, et prouver qu’une base est forte en comparant calcul et mesure.",
    pages: "3-4",
    section: "2.4 Expression du pH",
    durationMinutes: 26,
    xp: 65,
    body: String.raw`## La relation

Le pH d’une solution de **monobase forte** de concentration $C_b$ est donné par :

$$\boxed{\;pH = 14 + \log C_b \qquad\Longleftrightarrow\qquad C_b = 10^{\,pH-14}\;}$$

Le domaine de validité est le même que pour l’acide fort :

$$10^{-6} \le C_b \le 10^{-2} \text{ mol·L}^{-1}$$

## D’où elle vient

La dissociation étant totale, $[\mathrm{OH^-}] = C_b$. Le produit ionique donne alors :

$$[\mathrm{H_3O^+}] = \frac{K_e}{C_b} = \frac{10^{-14}}{C_b} \quad\Longrightarrow\quad pH = -\log\frac{10^{-14}}{C_b} = 14 + \log C_b$$

Le **14** n’est donc rien d’autre que $-\log K_e$ à 25 °C.

## Prouver qu’une base est forte

Même démarche que pour l’acide : **calculer**, puis **comparer**.

> Une solution d’hydroxyde de potassium $\mathrm{KOH}$ de concentration $C = 2\times10^{-3}$ mol·L⁻¹ a un $pH = 11{,}3$ à 25 °C.
>
> $14 + \log C = 14 + \log(2\times10^{-3}) = 14 - 2{,}70 = \mathbf{11{,}30}$
>
> Le calcul redonne exactement le pH mesuré : **$\mathrm{KOH}$ est une base forte**.

$$\mathrm{KOH \xrightarrow{\;H_2O\;} K^+ + OH^-}$$

> **Astuce mémoire de Davy.** Deux relations, une seule idée. $pH = -\log C_a$ pour l’acide, $pH = 14 + \log C_b$ pour la base : dans les deux cas on part de la concentration de l’espèce apportée, parce que la réaction est **totale**. Et le 14 vient uniquement du produit ionique de l’eau.

> **Erreur fréquente.** Utiliser une concentration approchée au lieu de celle de l’énoncé. Avec $C = 2\times10^{-3}$, le logarithme vaut $-2{,}70$, pas $-3$ ni $-2$ : le pH est 11,30 et non 11 ni 12. C’est exactement l’erreur que commet le corrigé du document.`,
    keyPoint: "$pH = 14 + \\log C_b$ pour une **monobase** forte, avec $10^{-6} \\le C_b \\le 10^{-2}$. Le 14 vaut $-\\log K_e$ à 25 °C.",
    example: "$\\mathrm{KOH}$ à $2\\times10^{-3}$ mol·L⁻¹ : $14 + \\log(2\\times10^{-3}) = 11{,}30$, égal au pH mesuré. C’est une base forte.",
    methodSteps: [
      "Vérifie que la concentration est dans le domaine de validité.",
      "Calcule $pH = 14 + \\log C_b$ avec la concentration **exacte** de l’énoncé.",
      "Compare au pH mesuré.",
      "Conclus, puis écris l’équation de dissociation.",
    ],
    interaction: timeline(
      [
        { label: "La dissociation est totale", shortLabel: "Totale", detail: "BOH → B⁺ + OH⁻ sans reste. Donc [OH⁻] = Cb, exactement comme [H₃O⁺] = Ca pour l’acide fort." },
        { label: "Le produit ionique fait le pont", shortLabel: "Ke", detail: "[H₃O⁺] = Ke/[OH⁻] = 10⁻¹⁴/Cb. C’est la relation vue à la leçon précédente qui permet de passer de l’ion hydroxyde à l’ion hydronium." },
        { label: "On applique la définition du pH", shortLabel: "pH", detail: "pH = −log(10⁻¹⁴/Cb) = 14 + log Cb. Le 14 n’est rien d’autre que −log Ke à 25 °C : à une autre température, il changerait." },
        { label: "On compare au pH mesuré", shortLabel: "Comparer", detail: "Si le calcul redonne le pH mesuré, la base est forte. Pour KOH à 2 × 10⁻³ mol·L⁻¹ : 14 + log(2 × 10⁻³) = 11,30, ce qui correspond exactement à la mesure." },
      ],
      "D’où vient la relation pH = 14 + log Cb",
      "Parcours les quatre étapes : la relation se démontre en deux lignes à partir du produit ionique.",
      "Comprendre l’origine du 14 évite de l’appliquer aveuglément : à une température autre que 25 °C, Ke change et le 14 avec lui.",
    ),
    questions: [
      short("Écris la relation entre le pH et la concentration d’une monobase forte.", ["pH = 14 + logCb", "pH = 14 + log C", "14 + log C", "ph=14+logcb"], "Conséquence du produit ionique et de la dissociation totale.", "2.4 Expression du pH", 2),
      short("D’où vient le nombre 14 dans cette relation ? Donne la grandeur concernée.", ["Ke", "produit ionique", "le produit ionique de l'eau", "-log Ke"], "$14 = -\\log K_e$ à 25 °C.", "2.4 Expression du pH", 3),
      short("Une solution de $\\mathrm{KOH}$ à $2\\times10^{-3}$ mol·L⁻¹ : quel pH la relation prévoit-elle ? (une décimale)", ["11,3", "11.3", "11,30", "11.30"], "$14 + \\log(2\\times10^{-3}) = 11{,}30$.", "Activité d’application 2 corrigée", 3),
      short("Quelle est la concentration d’une monobase forte de pH = 11 ? (en mol·L⁻¹)", ["10-3", "10^-3", "1e-3", "0,001"], "$C_b = 10^{\\,pH-14} = 10^{-3}$.", "Exercice 2 - question 3", 2),
      short("Exercice 3 : quelle est la concentration d’une solution de $\\mathrm{NaOH}$ de pH = 11,5 ? (en mol·L⁻¹, trois chiffres)", ["3,16.10-3", "3.16e-3", "3,16 10-3", "0,00316"], "$C = 10^{11,5-14} = 3{,}16\\times10^{-3}$.", "Exercice 3 - question 1", 3),
      choice("La relation $pH = 14 + \\log C_b$ s’applique à…", ["une monobase forte", "toute base", "une dibase forte"], 0, "Une dibase libère deux $\\mathrm{OH^-}$ par unité.", "2.4 Expression du pH", 2),
    ],
    corrections: [
      "Page 3, activité d’application 2 : le corrigé calcule « 14 + log(10⁻²) = 12 » alors que l’énoncé donne C = 2 × 10⁻³ mol·L⁻¹. Avec la concentration correcte, 14 + log(2 × 10⁻³) = 11,30, ce qui correspond exactement au pH mesuré de 11,3 annoncé par l’énoncé. Le document fait d’ailleurs le calcul juste à l’exercice 2, qui pose la même question.",
    ],
  },
  {
    id: "species-inventory-electroneutrality",
    title: "Inventaire des espèces et électroneutralité",
    summary: "Recenser toutes les espèces d’une solution d’acide ou de base forte et calculer leurs concentrations.",
    pages: "5-6",
    section: "Exercices 1 et 3",
    durationMinutes: 28,
    xp: 75,
    kind: "practice",
    body: String.raw`## L’inventaire complet

Une solution d’acide fort $\mathrm{HA}$ contient **quatre** espèces, jamais trois :

$$\mathrm{H_3O^+} \;;\; \mathrm{A^-} \;;\; \mathrm{OH^-} \;;\; \mathrm{H_2O}$$

Les ions $\mathrm{OH^-}$ sont présents malgré le caractère acide : ils proviennent de l’**autoprotolyse de l’eau**. Et l’**eau elle-même** fait partie de l’inventaire — c’est l’espèce qu’on oublie le plus souvent.

En revanche, **la molécule $\mathrm{HA}$ n’y figure pas** : l’ionisation étant totale, il n’en reste aucune.

## Le calcul, étape par étape

Reprenons l’exercice 1 : $\mathrm{HBr}$ à $C = 10^{-2}$ mol·L⁻¹, $pH = 2$.

$$[\mathrm{H_3O^+}] = 10^{-pH} = 10^{-2} \text{ mol·L}^{-1}$$
$$[\mathrm{OH^-}] = \frac{K_e}{[\mathrm{H_3O^+}]} = \frac{10^{-14}}{10^{-2}} = 10^{-12} \text{ mol·L}^{-1}$$

Pour l’anion, on passe par l’**électroneutralité** :

$$[\mathrm{H_3O^+}] = [\mathrm{OH^-}] + [\mathrm{Br^-}] \quad\Longrightarrow\quad [\mathrm{Br^-}] = [\mathrm{H_3O^+}] - [\mathrm{OH^-}]$$

Or $[\mathrm{OH^-}] = 10^{-12}$ est **négligeable** devant $[\mathrm{H_3O^+}] = 10^{-2}$ — dix ordres de grandeur d’écart. D’où :

$$[\mathrm{Br^-}] \approx [\mathrm{H_3O^+}] = 10^{-2} \text{ mol·L}^{-1}$$

## Préparer une solution de concentration donnée

L’exercice 3 fait le chemin inverse : de la solution voulue à la masse à peser.

Pour $V = 100$ mL de soude à $pH = 11{,}5$, avec $M(\mathrm{NaOH}) = 40$ g·mol⁻¹ :

$$C = 10^{\,11,5-14} = 3{,}16\times10^{-3} \text{ mol·L}^{-1}$$
$$m = M \times C \times V = 40 \times 3{,}16\times10^{-3} \times 0{,}100 = \mathbf{1{,}26\times10^{-2} \text{ g}}$$

Soit environ **13 milligrammes** — une masse volontairement minuscule, qui rappelle qu’une base forte agit à très faible dose.

> **Astuce mémoire de Davy.** Un ordre de grandeur absurde est un signal d’alarme. Peser 1,26 **gramme** de soude pour 100 mL donnerait une concentration de $3{,}16\times10^{-1}$ mol·L⁻¹, soit un pH de 13,5 — pas 11,5. Reprends toujours le calcul mentalement : le résultat doit être compatible avec le pH visé.`,
    keyPoint: "Quatre espèces : $\\mathrm{H_3O^+}$, l’anion, $\\mathrm{OH^-}$ et $\\mathrm{H_2O}$. L’anion s’obtient par électroneutralité, et $[\\mathrm{OH^-}]$ y est négligeable en milieu acide.",
    example: "$\\mathrm{HBr}$ à $10^{-2}$ mol·L⁻¹ : $[\\mathrm{H_3O^+}] = 10^{-2}$, $[\\mathrm{OH^-}] = 10^{-12}$, $[\\mathrm{Br^-}] \\approx 10^{-2}$ mol·L⁻¹.",
    methodSteps: [
      "Recense les quatre espèces, l’eau comprise, sans oublier $\\mathrm{OH^-}$.",
      "Calcule $[\\mathrm{H_3O^+}] = 10^{-pH}$, puis $[\\mathrm{OH^-}]$ par le produit ionique.",
      "Écris l’électroneutralité et isole l’anion.",
      "Néglige le terme minoritaire quand l’écart dépasse trois ordres de grandeur.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les quatre espèces d’une solution d’acide fort",
      instruction: "Sélectionne une espèce pour voir d’où elle vient et comment la calculer.",
      observation: "Trois espèces se calculent, la quatrième est le solvant. Et une seule est absente de l’inventaire : la molécule d’acide, entièrement ionisée.",
      rootLabel: "Solution d’acide fort HA",
      rootDetail: "Quelles espèces y trouve-t-on réellement ?",
      nodes: [
        { id: "hydronium", label: "Ion hydronium H₃O⁺", role: "majoritaire — 10⁻ᵖᴴ", detail: "Provient de l’ionisation totale de l’acide. Sa concentration se lit directement dans le pH : [H₃O⁺] = 10⁻ᵖᴴ, et vaut Ca pour un monoacide fort." },
        { id: "anion", label: "Anion A⁻", role: "≈ [H₃O⁺]", detail: "Provient lui aussi de l’ionisation de l’acide. On l’obtient par l’électroneutralité : [A⁻] = [H₃O⁺] − [OH⁻], et le second terme est négligeable en milieu acide." },
        { id: "hydroxyde", label: "Ion hydroxyde OH⁻", role: "minoritaire — Ke/[H₃O⁺]", detail: "Provient de l’autoprotolyse de l’eau, jamais de l’acide. Toujours présent, mais négligeable en milieu acide : 10⁻¹² contre 10⁻² dans l’exercice 1, soit dix ordres de grandeur d’écart." },
        { id: "eau", label: "Eau H₂O", role: "le solvant", detail: "C’est l’espèce qu’on oublie le plus souvent dans l’inventaire, alors qu’elle est de loin la plus abondante. Un inventaire complet en compte quatre, pas trois." },
      ],
    },
    questions: [
      short("Cite les quatre espèces chimiques présentes dans une solution d’acide bromhydrique.", ["H3O+ Br- OH- H2O", "H3O+, Br-, OH-, H2O", "h3o+ br- oh- h2o"], "Sans oublier l’eau ni les $\\mathrm{OH^-}$ de l’autoprotolyse.", "Exercice 1 - question 3", 3),
      choice("Pourquoi la molécule $\\mathrm{HBr}$ ne figure-t-elle pas dans l’inventaire ?", ["l’ionisation est totale : il n’en reste aucune", "elle est insoluble", "elle s’évapore"], 0, "C’est le propre d’un acide fort.", "Exercice 1 - question 3", 2),
      short("Dans une solution de $\\mathrm{HBr}$ à $10^{-2}$ mol·L⁻¹, quelle est $[\\mathrm{OH^-}]$ ? (en mol·L⁻¹)", ["10-12", "10^-12", "1e-12"], "$K_e/[\\mathrm{H_3O^+}] = 10^{-14}/10^{-2}$.", "Exercice 1 - question 3", 2),
      choice("Comment obtient-on $[\\mathrm{Br^-}]$ ?", ["par l’électroneutralité de la solution", "par le produit ionique", "par la relation $pH = -\\log C$"], 0, "$[\\mathrm{H_3O^+}] = [\\mathrm{OH^-}] + [\\mathrm{Br^-}]$.", "Exercice 1 - question 3", 2),
      short("Exercice 3 : quelle masse de $\\mathrm{NaOH}$ faut-il pour 100 mL de solution à pH 11,5 ? (en g, trois chiffres)", ["0,0126", "0.0126", "1,26.10-2", "1.26e-2"], "$m = 40 \\times 3{,}16\\times10^{-3} \\times 0{,}1 = 1{,}26\\times10^{-2}$ g.", "Exercice 3 - question 2 corrigée", 3),
      choice("En milieu acide, l’ion hydroxyde est…", ["présent mais négligeable", "totalement absent", "majoritaire"], 0, "Il provient de l’autoprotolyse et reste très minoritaire.", "Exercice 1 - question 3", 2),
    ],
    corrections: [
      "Page 6, exercice 3, question 2 : le corrigé annonce m = 1,26 g. Le calcul m = M × C × V = 40 × 3,16 × 10⁻³ × 0,100 donne 1,26 × 10⁻² g, soit environ 13 mg. Le résultat du document est cent fois trop grand ; avec 1,26 g dans 100 mL, le pH serait de 13,5 et non de 11,5.",
    ],
  },
  {
    id: "mixtures-and-dilution",
    title: "Mélanges et dilutions",
    summary: "Calculer le pH d’un mélange de deux solutions et le volume d’eau à ajouter pour atteindre un pH donné.",
    pages: "5-7",
    section: "Exercices 2 et 4",
    durationMinutes: 30,
    xp: 80,
    kind: "practice",
    body: String.raw`## Le principe des mélanges

Une seule idée gouverne tous ces calculs : **les quantités de matière s’ajoutent, les pH ne s’ajoutent jamais.**

$$n_{\text{total}} = C_1V_1 + C_2V_2 \qquad\text{puis}\qquad [\text{ion}] = \frac{n_{\text{total}}}{V_1 + V_2}$$

Le pH se calcule **à la fin**, à partir de la concentration du mélange.

## Exercice 4 — deux bases fortes mélangées

$V_1 = 100$ mL de $\mathrm{NaOH}$ à $C_1 = 10^{-2}$ et $V_2 = 75$ mL de $\mathrm{KOH}$ à $C_2 = 1{,}5\times10^{-2}$ mol·L⁻¹.

**Les pH séparés :**

$$pH_1 = 14 + \log(10^{-2}) = 12 \qquad pH_2 = 14 + \log(1{,}5\times10^{-2}) = 12{,}18$$

**Le pH du mélange :**

$$n(\mathrm{OH^-}) = C_1V_1 + C_2V_2 = 10^{-3} + 1{,}125\times10^{-3} = 2{,}125\times10^{-3} \text{ mol}$$
$$[\mathrm{OH^-}] = \frac{2{,}125\times10^{-3}}{0{,}175} = 1{,}21\times10^{-2} \quad\Longrightarrow\quad pH = 14 + \log(1{,}21\times10^{-2}) = \mathbf{12{,}08}$$

**La conclusion.** La somme des pH vaudrait $12 + 12{,}18 = 24{,}18$, une valeur **impossible** puisque le pH ne dépasse pas 14. Le pH d’un mélange **n’est pas la somme** des pH.

## Exercice 2 — diluer pour atteindre un pH

On part de $V_1 = 20$ cm³ de $\mathrm{KOH}$ à $C = 2\times10^{-3}$ mol·L⁻¹ et on veut $pH_2 = 11$.

La **dilution conserve la quantité de matière** :

$$C \cdot V_1 = C_2 \cdot V_2 \qquad\text{avec}\qquad C_2 = 10^{\,pH_2-14} = 10^{-3} \text{ mol·L}^{-1}$$
$$V_2 = \frac{C \cdot V_1}{C_2} = \frac{2\times10^{-3} \times 20\times10^{-3}}{10^{-3}} = 4\times10^{-2} \text{ L} = 40 \text{ mL}$$

Le volume d’**eau ajoutée** est la **différence** :

$$V_e = V_2 - V_1 = 40 - 20 = \mathbf{20 \text{ mL}} = 0{,}02 \text{ L}$$

> **Astuce mémoire de Davy.** Ne confonds jamais $V_2$, le **volume final**, et $V_e$, le **volume d’eau ajoutée**. L’énoncé demande presque toujours le second, et la formule donne d’abord le premier. Une soustraction sépare une bonne réponse d’une mauvaise.

> **Erreur fréquente.** Additionner les pH d’un mélange. C’est l’assertion que l’exercice 4 est précisément conçu pour démolir : une somme de deux pH basiques dépasserait 14, ce qui est impossible.`,
    keyPoint: "Les quantités de matière s’ajoutent, jamais les pH. Dilution : $C_1V_1 = C_2V_2$, puis $V_e = V_2 - V_1$.",
    example: "Mélange de 100 mL de $\\mathrm{NaOH}$ à $10^{-2}$ et 75 mL de $\\mathrm{KOH}$ à $1{,}5\\times10^{-2}$ : $pH = 12{,}08$, et non $24{,}18$.",
    methodSteps: [
      "Calcule la quantité de matière de l’ion actif dans chaque solution.",
      "Additionne ces quantités, puis divise par le volume total.",
      "Applique la relation du pH à la concentration obtenue.",
      "Pour une dilution, calcule d’abord $V_2$ puis retranche $V_1$ pour obtenir l’eau ajoutée.",
    ],
    interaction: timeline(
      [
        { label: "Compter les moles", shortLabel: "Moles", detail: "n = C × V pour chaque solution. Ce sont les seules grandeurs additives : n(OH⁻) = C₁V₁ + C₂V₂ = 2,125 × 10⁻³ mol dans l’exercice 4." },
        { label: "Diviser par le volume total", shortLabel: "Volume total", detail: "Les volumes s’ajoutent : 100 + 75 = 175 mL. [OH⁻] = 2,125 × 10⁻³ / 0,175 = 1,21 × 10⁻² mol·L⁻¹." },
        { label: "Calculer le pH à la fin", shortLabel: "pH", detail: "pH = 14 + log(1,21 × 10⁻²) = 12,08. Jamais la somme des pH : 12 + 12,18 donnerait 24,18, une valeur impossible sur une échelle qui s’arrête à 14." },
        { label: "Cas d’une dilution", shortLabel: "Diluer", detail: "La quantité de matière est conservée : C·V₁ = C₂·V₂. On en tire le volume final V₂, puis le volume d’eau ajoutée Ve = V₂ − V₁. C’est cette soustraction qu’on oublie." },
      ],
      "Mélanger ou diluer",
      "Parcours les quatre étapes : les mélanges et les dilutions obéissent au même principe de conservation.",
      "Dans les deux cas, la quantité de matière est l’invariant. Les concentrations et les pH, eux, se recalculent toujours à la fin.",
    ),
    questions: [
      choice("Le pH d’un mélange de deux solutions basiques est-il la somme de leurs pH ?", ["non, jamais", "oui, toujours", "oui, si les volumes sont égaux"], 0, "La somme dépasserait 14, ce qui est impossible.", "Exercice 4 - question 5", 2),
      short("Exercice 4 : quel est le pH d’une solution de $\\mathrm{NaOH}$ à $10^{-2}$ mol·L⁻¹ ?", ["12", "pH = 12"], "$14 + \\log(10^{-2}) = 12$.", "Exercice 4 - question 3", 2),
      short("Exercice 4 : quel est le pH du mélange ? (deux décimales)", ["12,08", "12.08"], "$[\\mathrm{OH^-}] = 2{,}125\\times10^{-3}/0{,}175 = 1{,}21\\times10^{-2}$.", "Exercice 4 - question 4", 3),
      short("Exercice 2 : quelle est la concentration visée pour obtenir un pH de 11 ? (en mol·L⁻¹)", ["10-3", "10^-3", "1e-3", "0,001"], "$C_2 = 10^{11-14}$.", "Exercice 2 - question 3", 2),
      short("Exercice 2 : quel volume d’eau faut-il ajouter à 20 cm³ de $\\mathrm{KOH}$ à $2\\times10^{-3}$ mol·L⁻¹ pour obtenir un pH de 11 ? (en mL)", ["20", "20 mL", "0,02 L"], "$V_2 = 40$ mL, donc $V_e = 40 - 20 = 20$ mL.", "Exercice 2 - question 3", 3),
      choice("Lors d’une dilution, quelle grandeur est conservée ?", ["la quantité de matière", "la concentration", "le pH"], 0, "$C_1V_1 = C_2V_2$.", "Exercice 2 - question 3", 2),
    ],
  },
  {
    id: "acid-mixture-mission",
    title: "Mission finale : le pH d’un mélange d’acides forts",
    summary: "Mener l’étude complète d’un mélange d’acides forts, du bilan des espèces au pH, et vérifier des résultats de concours.",
    pages: "4-5, 7-8",
    section: "Situation d’évaluation et exercice 5",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

On dispose d’une solution d’**acide chlorhydrique** $\mathrm{S_1}$ de $pH_1 = 2$ et d’une solution d’**acide nitrique** $\mathrm{S_2}$ de $pH_2 = 4$. On prélève $v_1 = 100$ mL de $\mathrm{S_1}$ et on y ajoute $v_2 = 200$ mL de $\mathrm{S_2}$.

## Le raisonnement

**1. Les concentrations initiales.** Les deux acides sont forts et monoacides :

$$C_1 = 10^{-pH_1} = 10^{-2} \qquad C_2 = 10^{-pH_2} = 10^{-4} \text{ mol·L}^{-1}$$

**2. Les ionisations.**

$$\mathrm{HCl + H_2O \longrightarrow H_3O^+ + Cl^-} \qquad \mathrm{HNO_3 + H_2O \longrightarrow H_3O^+ + NO_3^-}$$

**3. Les espèces du mélange.** $\mathrm{H_3O^+}$, $\mathrm{Cl^-}$, $\mathrm{NO_3^-}$, $\mathrm{OH^-}$ et $\mathrm{H_2O}$.

**4. Les concentrations dans le mélange**, avec $V = 0{,}1 + 0{,}2 = 0{,}3$ L :

$$[\mathrm{H_3O^+}] = \frac{C_1v_1 + C_2v_2}{V} = \frac{10^{-3} + 2\times10^{-5}}{0{,}3} = 3{,}40\times10^{-3} \text{ mol·L}^{-1}$$
$$[\mathrm{Cl^-}] = \frac{10^{-3}}{0{,}3} = 3{,}33\times10^{-3} \qquad [\mathrm{NO_3^-}] = \frac{2\times10^{-5}}{0{,}3} = 6{,}67\times10^{-5}$$
$$[\mathrm{OH^-}] = \frac{K_e}{[\mathrm{H_3O^+}]} = 2{,}94\times10^{-12} \text{ mol·L}^{-1}$$

**5. Le pH.**

$$pH = -\log(3{,}40\times10^{-3}) = \mathbf{2{,}47} \approx 2{,}5$$

**6. Le contrôle.** L’électroneutralité doit être vérifiée :

$$[\mathrm{Cl^-}] + [\mathrm{NO_3^-}] + [\mathrm{OH^-}] = 3{,}33\times10^{-3} + 6{,}67\times10^{-5} = 3{,}40\times10^{-3} = [\mathrm{H_3O^+}] \quad\checkmark$$

## L’épreuve de concours (exercice 5)

Un camarade annonce $pH = 3{,}38$ pour $\mathrm{S_1}$ et $pH = 4{,}21$ pour $\mathrm{S_2}$. Il faut vérifier.

**Le mélange $\mathrm{S_1}$** réunit 50 mL de $\mathrm{HCl}$ à $10^{-3}$, 75 mL de $\mathrm{HNO_3}$ à $10^{-4}$, **0,6 mL de $\mathrm{HBr}$ gazeux** ($V_m = 24$ L·mol⁻¹) et 75 mL d’eau distillée. Le volume total vaut 200 mL.

Le gaz se compte en moles par $n = v/V_m$ :

$$n(\mathrm{H_3O^+}) = 10^{-3}(0{,}05) + 10^{-4}(0{,}075) + \frac{0{,}6\times10^{-3}}{24} = 8{,}25\times10^{-5} \text{ mol}$$
$$[\mathrm{H_3O^+}] = \frac{8{,}25\times10^{-5}}{0{,}2} = 4{,}125\times10^{-4} \quad\Longrightarrow\quad pH = \mathbf{3{,}38} \quad\checkmark$$

Les autres espèces : $[\mathrm{Cl^-}] = 2{,}5\times10^{-4}$, $[\mathrm{Br^-}] = 1{,}25\times10^{-4}$, $[\mathrm{NO_3^-}] = 3{,}75\times10^{-5}$, et $[\mathrm{OH^-}] = K_e/[\mathrm{H_3O^+}] = 2{,}42\times10^{-11}$ mol·L⁻¹.

**Le mélange $\mathrm{S_2}$** s’obtient en ajoutant $V_e$ d’eau jusqu’à $[\mathrm{NO_3^-}] = 2\times10^{-5}$ mol·L⁻¹. La quantité de nitrate ne change pas :

$$V_{\text{total}} = \frac{7{,}5\times10^{-6}}{2\times10^{-5}} = 0{,}375 \text{ L} \quad\Longrightarrow\quad V_e = 0{,}375 - 0{,}200 = \mathbf{0{,}175 \text{ L}} = 175 \text{ mL}$$

$$[\mathrm{H_3O^+}] = \frac{8{,}25\times10^{-5}}{0{,}375} = 2{,}20\times10^{-4} \quad\Longrightarrow\quad pH = \mathbf{3{,}66}$$

**Le verdict.** Le camarade a juste pour $\mathrm{S_1}$ (3,38) mais **faux pour $\mathrm{S_2}$** : il annonce 4,21 alors que le calcul donne 3,66. Ses chances au concours sont réduites.

> **Astuce mémoire de Davy.** Trois réflexes traversent toute cette leçon. **Compter en moles** avant toute chose, y compris pour un gaz avec $n = v/V_m$. **Diviser par le volume total**, jamais par un volume partiel. Et **vérifier par l’électroneutralité** — c’est le seul contrôle qui détecte une erreur de calcul sans refaire tout le problème.`,
    keyPoint: "Mélange d’acides forts : additionner les moles de $\\mathrm{H_3O^+}$, diviser par le volume total, puis appliquer $pH = -\\log[\\mathrm{H_3O^+}]$. Contrôler par l’électroneutralité.",
    example: "100 mL à pH 2 et 200 mL à pH 4 donnent $[\\mathrm{H_3O^+}] = 3{,}40\\times10^{-3}$ mol·L⁻¹, soit $pH = 2{,}47$.",
    methodSteps: [
      "Convertis chaque pH en concentration, puis en quantité de matière.",
      "Pour un gaz, utilise $n = v/V_m$.",
      "Additionne les moles et divise par le volume total.",
      "Calcule le pH, puis vérifie l’électroneutralité.",
    ],
    interaction: timeline(
      [
        { label: "Du pH aux moles", shortLabel: "Moles", detail: "C = 10⁻ᵖᴴ pour un monoacide fort, puis n = C × V. Pour un gaz dissous, n = v/Vm : 0,6 mL de HBr avec Vm = 24 L·mol⁻¹ donnent 2,5 × 10⁻⁵ mol." },
        { label: "Additionner et diviser", shortLabel: "Mélanger", detail: "Les moles d’ions hydronium s’additionnent, le volume total est la somme des volumes — eau distillée comprise. [H₃O⁺] = 8,25 × 10⁻⁵ / 0,2 = 4,125 × 10⁻⁴ mol·L⁻¹." },
        { label: "Calculer le pH", shortLabel: "pH", detail: "pH = −log[H₃O⁺]. Pour S₁ : 3,38. La dilution jusqu’à [NO₃⁻] = 2 × 10⁻⁵ porte le volume à 0,375 L et le pH à 3,66." },
        { label: "Vérifier par l’électroneutralité", shortLabel: "Contrôle", detail: "[Cl⁻] + [NO₃⁻] + [Br⁻] + [OH⁻] doit égaler [H₃O⁺]. Dans S₁ : 2,5 × 10⁻⁴ + 3,75 × 10⁻⁵ + 1,25 × 10⁻⁴ = 4,125 × 10⁻⁴, exactement [H₃O⁺]." },
      ],
      "Traiter un mélange d’acides forts",
      "Suis les quatre étapes : elles couvrent la situation d’évaluation comme l’épreuve de concours.",
      "L’électroneutralité n’est pas une formalité : c’est le contrôle qui aurait permis au camarade de repérer son erreur sur S₂ sans refaire tout le problème.",
    ),
    questions: [
      short("Quelle est la concentration d’une solution d’acide chlorhydrique de pH = 2 ? (en mol·L⁻¹)", ["10-2", "10^-2", "1e-2", "0,01"], "$C = 10^{-pH}$ pour un monoacide fort.", "Situation d’évaluation - question 3.1", 2),
      short("Cite les cinq espèces présentes dans le mélange de $\\mathrm{HCl}$ et $\\mathrm{HNO_3}$.", ["H3O+ Cl- NO3- OH- H2O", "H3O+, Cl-, NO3-, OH-, H2O"], "Sans oublier l’eau et les $\\mathrm{OH^-}$.", "Situation d’évaluation - question 2.3", 3),
      short("Quelle est $[\\mathrm{H_3O^+}]$ dans le mélange de 100 mL à pH 2 et 200 mL à pH 4 ? (en mol·L⁻¹, trois chiffres)", ["3,40.10-3", "3.4e-3", "3,4.10-3", "0,0034"], "$(10^{-3} + 2\\times10^{-5})/0{,}3$.", "Situation d’évaluation - question 3.2", 3),
      short("Quel est le pH de ce mélange ? (une décimale)", ["2,5", "2.5", "2,47", "2.47"], "$-\\log(3{,}40\\times10^{-3}) = 2{,}47$.", "Situation d’évaluation - question 4", 3),
      short("Exercice 5 : quelle quantité de matière apportent 0,6 mL de $\\mathrm{HBr}$ gazeux, avec $V_m = 24$ L·mol⁻¹ ? (en mol)", ["2,5.10-5", "2.5e-5", "0,000025"], "$n = v/V_m = 0{,}6\\times10^{-3}/24$.", "Exercice 5 - question 1.2", 3),
      short("Exercice 5 : quel est le pH du mélange $\\mathrm{S_1}$ ? (deux décimales)", ["3,38", "3.38"], "$-\\log(4{,}125\\times10^{-4})$.", "Exercice 5 - question 1.3", 2),
      short("Exercice 5 : quel volume d’eau faut-il ajouter pour obtenir $\\mathrm{S_2}$ ? (en L, trois décimales)", ["0,175", "0.175", "0,175 L", "175 mL"], "$V_{\\text{total}} = 0{,}375$ L, donc $V_e = 0{,}175$ L.", "Exercice 5 - question 2.1 corrigée", 3),
      short("Exercice 5 : quel est le pH de $\\mathrm{S_2}$ ? (deux décimales)", ["3,66", "3.66"], "$-\\log(2{,}20\\times10^{-4})$. Le camarade annonçait 4,21 : il s’est trompé.", "Exercice 5 - question 2.3", 3),
    ],
    corrections: [
      "Page 8, exercice 5, question 1.2 : le corrigé annonce [OH⁻] = 2,49 × 10⁻¹⁹ mol·L⁻¹ dans le mélange S₁. Le calcul Ke/[H₃O⁺] = 10⁻¹⁴/(4,125 × 10⁻⁴) donne 2,42 × 10⁻¹¹ mol·L⁻¹ — l’exposant du document est faux de huit ordres de grandeur.",
      "Page 8, exercice 5, question 2.1 : le corrigé écrit « Ve = 0,175 mL ». La valeur est correcte mais l’unité ne l’est pas : il s’agit de 0,175 litre, soit 175 mL. Le volume total passant de 200 à 375 mL, ajouter 0,175 mL n’aurait aucun effet mesurable.",
      "Page 4, situation d’évaluation : l’énoncé numérote ses questions 1.1 puis 1.3, sans 1.2, alors que le corrigé répond bien à 1.1 et 1.2. La numérotation est rétablie.",
      "Page 6, exercice 4 : le corrigé donne pH₂ = 12,17 pour KOH à 1,5 × 10⁻² mol·L⁻¹. La valeur exacte est 14 + log(1,5 × 10⁻²) = 12,18. L’écart est sans conséquence sur la conclusion.",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const strongAcidBasePath: LearningPath = {
  id: "terminale-cd-chemistry-strong-acid-base",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Chimie générale" },
  chapterNumber: 6,
  title: "Acide fort - base forte",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Définir un acide fort et une base forte, et écrire leurs équations avec l’eau",
    "Établir et appliquer les relations pH = −log Ca et pH = 14 + log Cb",
    "Recenser les espèces d’une solution et exploiter l’électroneutralité",
    "Calculer le pH d’un mélange et le volume d’eau d’une dilution",
  ],
  modules: [
    { id: "strong-acid-base-mastery", title: "Maîtriser les acides forts et les bases fortes", description: "Un niveau après l’autre, de l’ionisation totale au pH d’un mélange de concours.", lessons: builtLevels },
  ],
};
