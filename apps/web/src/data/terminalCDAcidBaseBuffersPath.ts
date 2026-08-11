import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L10_Réactions acidobasiques. Solutions tampons.pdf";

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
      tip: "Sur une courbe de dosage, deux points seulement portent une information : l’équivalence donne la concentration, la demi-équivalence donne le pKa.",
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
    id: "strong-acid-strong-base",
    title: "Acide fort et base forte : une réaction totale",
    summary: "Établir expérimentalement que la réaction entre un acide fort et une base forte est exothermique et totale.",
    pages: "1-2",
    section: "I.1. Nature de la réaction",
    durationMinutes: 18,
    xp: 45,
    body: String.raw`## 1.1 Une réaction exothermique

On mélange dans un bécher une solution d’acide chlorhydrique et une solution d’hydroxyde de sodium, toutes deux à $20\,^{\circ}\mathrm{C}$. Le thermomètre monte à $34\,^{\circ}\mathrm{C}$.

> **La réaction entre un acide fort et une base forte est exothermique** : elle libère de la chaleur.

## 1.2 Une réaction totale

C’est la partie la plus importante du paragraphe, parce qu’elle **démontre** ce qu’elle affirme, au lieu de l’asséner.

On mélange $V_a=20$ mL d’acide chlorhydrique à $C_a=10^{-2}$ mol·L⁻¹ (de pH $=2$) avec $V_b=10$ mL de soude à $C_b=10^{-2}$ mol·L⁻¹. On mesure le pH du mélange : **pH $=2{,}5$**.

| Quantité de matière | Avant la réaction | Après la réaction |
|---|---|---|
| $n(\mathrm{H_3O^+})$ | $C_aV_a=2\times10^{-4}$ mol | $10^{-\mathrm{pH}}(V_a+V_b)=10^{-4}$ mol |
| $n(\mathrm{OH^-})$ | $C_bV_b=10^{-4}$ mol | $\dfrac{K_e}{[\mathrm{H_3O^+}]}(V_a+V_b)=10^{-13}\approx0$ mol |

### Comment lire ce tableau

Deux lectures s’enchaînent, et ce sont elles qui emportent la conclusion.

**1. Les ions hydroxyde ont disparu.** Il en restait $10^{-4}$ mol avant, il en reste $10^{-13}$ mol après, soit **un milliard de fois moins**. Rien ne les a fait partir sauf la réaction : elle a consommé la totalité du réactif limitant.

**2. Le compte tombe juste.** L’acide a perdu $2\times10^{-4}-10^{-4}=10^{-4}$ mol d’ions $\mathrm{H_3O^+}$, exactement la quantité d’ions $\mathrm{OH^-}$ introduite. Un ion hydroxyde consommé pour un ion hydronium consommé.

> **La réaction entre un acide fort et une base forte est totale.** Son équation-bilan s’écrit :
> $$\mathrm{H_3O^+}+\mathrm{OH^-}\ \longrightarrow\ 2\,\mathrm{H_2O}$$

## Pourquoi cette équation ne parle ni de $\mathrm{Cl^-}$ ni de $\mathrm{Na^+}$

Un acide fort est **entièrement dissocié** dans l’eau : la solution d’acide chlorhydrique ne contient pas de $\mathrm{HCl}$, mais des ions $\mathrm{H_3O^+}$ et $\mathrm{Cl^-}$. De même la soude n’apporte que $\mathrm{Na^+}$ et $\mathrm{OH^-}$.

Les ions $\mathrm{Cl^-}$ et $\mathrm{Na^+}$ traversent la réaction sans rien faire : ce sont des **ions spectateurs**. Seuls $\mathrm{H_3O^+}$ et $\mathrm{OH^-}$ réagissent — d’où une équation-bilan identique pour **tout** couple acide fort / base forte.

> **Astuce mémoire.** Acide fort + base forte, c’est toujours la même réaction : de l’eau qui se forme. Change les flacons, l’équation ne bouge pas.`,
    keyPoint: "Acide fort + base forte : réaction exothermique et totale, d’équation-bilan H₃O⁺ + OH⁻ → 2 H₂O, quels que soient les ions spectateurs.",
    example: "Après mélange, il reste $10^{-13}$ mol d’ions $\\mathrm{OH^-}$ contre $10^{-4}$ avant : ils ont tous réagi, la réaction est totale.",
    methodSteps: [
      "Calcule les quantités de matière initiales : n = C × V, en convertissant les volumes en litres.",
      "Déduis les quantités finales du pH mesuré : n(H₃O⁺) = 10⁻ᵖᴴ × (Va + Vb) et n(OH⁻) = Ke/[H₃O⁺] × (Va + Vb).",
      "Compare : si le réactif limitant a quasiment disparu, la réaction est totale.",
      "Vérifie que la quantité d’acide consommée égale la quantité de base introduite.",
      "Écris l’équation-bilan en ne gardant que les espèces qui réagissent réellement.",
    ],
    interaction: timeline(
      [
        { label: "Mesurer avant le mélange", shortLabel: "Avant", detail: "n(H₃O⁺) = Ca·Va = 2 × 10⁻⁴ mol et n(OH⁻) = Cb·Vb = 10⁻⁴ mol. L’acide est en excès." },
        { label: "Lire le pH du mélange", shortLabel: "pH", detail: "Le pH-mètre affiche 2,5 pour les 30 mL du mélange. C’est cette mesure unique qui donne accès à toutes les quantités finales." },
        { label: "Compter ce qui reste", shortLabel: "Après", detail: "n(H₃O⁺) = 10⁻²·⁵ × 0,030 = 10⁻⁴ mol et n(OH⁻) = 10⁻¹³ mol, c’est-à-dire pratiquement zéro." },
        { label: "Conclure que la réaction est totale", shortLabel: "Totale", detail: "Le réactif limitant a entièrement disparu, et l’acide a perdu exactement la quantité de base ajoutée : la réaction est totale." },
        { label: "Écrire l’équation-bilan", shortLabel: "Bilan", detail: "H₃O⁺ + OH⁻ → 2 H₂O. Les ions Cl⁻ et Na⁺, spectateurs, n’y figurent pas." },
      ],
      "La démonstration en cinq mesures",
      "Suis le raisonnement qui transforme une mesure de pH en preuve que la réaction est totale.",
      "Une seule lecture de pH suffit à remplir toute la colonne « après » : c’est la force de cette méthode.",
    ),
    questions: [
      choice("La réaction entre un acide fort et une base forte est…", ["exothermique et totale", "endothermique et totale", "exothermique et limitée", "athermique et limitée"], 0, "La température monte de 20 à 34 °C et le réactif limitant disparaît entièrement.", "I.1 Nature de la réaction"),
      short("Écris l’équation-bilan de la réaction entre un acide fort et une base forte.", ["H3O+ + OH- -> 2 H2O", "H3O+ + OH- = 2H2O", "H3O+ + OH- → 2 H2O", "H3O+ + OH- -> 2H2O"], "Seuls les ions $\\mathrm{H_3O^+}$ et $\\mathrm{OH^-}$ réagissent ; ils forment de l’eau.", "I.1.2 Réaction totale", 2),
      short("Calcule $n(\\mathrm{OH^-})$ introduite pour $C_b=10^{-2}$ mol·L⁻¹ et $V_b=10$ mL (en mol).", ["1e-4", "10-4", "0,0001", "1.10-4", "10^-4"], "$n=C_bV_b=10^{-2}\\times0{,}010=10^{-4}$ mol.", "I.1.2 Réaction totale", 2),
      choice("Après le mélange, il reste $10^{-13}$ mol d’ions $\\mathrm{OH^-}$ contre $10^{-4}$ mol avant. On en conclut que…", ["la réaction est totale", "la réaction est limitée", "la réaction n’a pas eu lieu", "l’acide était le réactif limitant"], 0, "Le réactif limitant a pratiquement entièrement disparu.", "I.1.2 Réaction totale", 2),
      choice("Pourquoi les ions $\\mathrm{Cl^-}$ et $\\mathrm{Na^+}$ n’apparaissent-ils pas dans l’équation-bilan ?", ["ce sont des ions spectateurs, ils ne réagissent pas", "ils précipitent au fond du bécher", "ils se transforment en eau", "ils s’échappent sous forme de gaz"], 0, "Ils sont présents avant et après la réaction, sans être modifiés.", "I.1.2 Réaction totale", 2),
      short("Quelle est la quantité de matière d’ions $\\mathrm{H_3O^+}$ ayant réagi, en mol ?", ["1e-4", "10-4", "0,0001", "10^-4"], "$2\\times10^{-4}-10^{-4}=10^{-4}$ mol, soit exactement la quantité d’ions $\\mathrm{OH^-}$ ajoutée.", "I.1.2 Réaction totale", 2),
    ],
  },
  {
    id: "strong-acid-titration-curve",
    title: "La courbe de dosage d’un acide fort",
    summary: "Lire une courbe pH = f(Vb), y placer le point d’équivalence et en déduire une concentration inconnue.",
    pages: "2-4",
    section: "I.2. Étude de l’évolution du pH au cours de la réaction",
    durationMinutes: 22,
    xp: 55,
    kind: "graph",
    body: String.raw`## 2.1 L’expérience

À $25\,^{\circ}\mathrm{C}$, on verse à la burette une solution de soude de concentration $C_b=10^{-2}$ mol·L⁻¹ sur $V_a=20$ mL d’acide chlorhydrique de concentration $C_a$ **inconnue**. On relève le pH au fur et à mesure.

Le montage est toujours le même : **burette graduée** au-dessus, **bécher** sur un **agitateur magnétique** avec son **barreau aimanté**, et la sonde du **pH-mètre** plongée dans le mélange. L’agitation n’est pas un détail : sans elle, la sonde lit une zone non homogène et la courbe est fausse.

## 2.3 Le tableau des mesures

| $V_b$ (mL) | 0 | 4 | 8 | 12 | 16 | 18 | 19 | 19,5 | **20** | 20,5 | 21 | 24 | 30 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| pH | 2 | 2,2 | 2,4 | 2,6 | 2,9 | 3,3 | 3,6 | 4,2 | **7** | 9,4 | 10,1 | 10,9 | 11,2 |

Regarde ce qui se passe entre $19{,}5$ et $20{,}5$ mL : **une goutte de part et d’autre, et le pH bondit de 4,2 à 9,4**. C’est tout l’intérêt de la méthode.

## 2.5 Les trois parties de la courbe

La courbe est **croissante**, comporte **trois parties** et présente **un point d’inflexion** E.

| Partie | Domaine | Ce qu’on observe |
|---|---|---|
| 1ʳᵉ | $0\le V_b\le19$ mL | le pH varie peu, la courbe est quasi linéaire, concavité tournée vers le haut |
| 2ᵉ | $19\le V_b\le21$ mL | **saut de pH**, changement de concavité, point d’inflexion E |
| 3ᵉ | $V_b>21$ mL | le pH varie très peu et tend vers l’asymptote $\mathrm{pH}=\mathrm{p}K_e+\log C_b$ |

> **Vérifie l’asymptote toi-même.** $\mathrm{p}K_e+\log C_b=14+\log(10^{-2})=12$. Le tableau se termine à $11{,}2$ et continue de monter : cohérent. Quand la soude est en large excès, le mélange n’est plus qu’une solution de soude diluée.

## 2.6 L’équivalence acido-basique

### Définition

> L’**équivalence acido-basique** est l’état du mélange des réactifs **dans les proportions stœchiométriques** indiquées par l’équation-bilan.

### La relation d’équivalence

À l’équivalence, la quantité d’acide introduite égale la quantité de base ajoutée :

$$n(\mathrm{H_3O^+})=n(\mathrm{OH^-})\quad\Longrightarrow\quad \boxed{C_aV_a=C_bV_{bE}}$$

C’est **la** relation qui rend le dosage utile : on connaît $C_b$, on lit $V_{bE}$ sur la courbe, on en déduit $C_a$.

### La méthode des tangentes parallèles

On trace deux tangentes à la courbe, **parallèles entre elles**, de part et d’autre du saut de pH. On trace la parallèle **équidistante** de ces deux tangentes : elle coupe la courbe au point d’équivalence E.

Ici : $V_{bE}=20$ mL et $\mathrm{pH}_E=7$.

## 2.6.4 Que contient le bécher à l’équivalence ?

- **Ions** : $\mathrm{Na^+}$, $\mathrm{Cl^-}$, $\mathrm{H_3O^+}$ et $\mathrm{OH^-}$ — **molécules** : $\mathrm{H_2O}$
- $[\mathrm{Na^+}]=\dfrac{C_bV_{bE}}{V_a+V_{bE}}=5\times10^{-3}$ mol·L⁻¹ et $[\mathrm{Cl^-}]=\dfrac{C_aV_a}{V_a+V_{bE}}=5\times10^{-3}$ mol·L⁻¹

L’**électroneutralité** de la solution s’écrit $[\mathrm{Na^+}]+[\mathrm{H_3O^+}]=[\mathrm{Cl^-}]+[\mathrm{OH^-}]$. Or on vient de voir que $[\mathrm{Na^+}]=[\mathrm{Cl^-}]$, donc il reste :

$$[\mathrm{H_3O^+}]=[\mathrm{OH^-}]=\sqrt{K_e}=10^{-7}\ \text{mol·L}^{-1}\quad\Longrightarrow\quad \mathrm{pH}=7$$

> **À l’équivalence, on obtient une solution neutre de chlorure de sodium** — de l’eau salée — de concentration $C=\dfrac{C_aV_a}{V_a+V_{bE}}$.`,
    keyPoint: "À l’équivalence : CaVa = CbVbE et, pour un acide fort dosé par une base forte, pH = 7 à 25 °C.",
    example: "$V_{bE}=20$ mL et $V_a=20$ mL avec $C_b=10^{-2}$ donnent $C_a=C_bV_{bE}/V_a=10^{-2}$ mol·L⁻¹.",
    methodSteps: [
      "Repère le saut de pH sur la courbe : le point d’équivalence est au milieu de ce saut.",
      "Trace deux tangentes parallèles de part et d’autre du saut, puis leur parallèle équidistante.",
      "Lis les coordonnées de E : VbE en abscisse, pHE en ordonnée.",
      "Applique la relation d’équivalence CaVa = CbVbE pour trouver la concentration inconnue.",
      "Vérifie la cohérence : pour un acide fort dosé par une base forte, pHE doit valoir 7.",
    ],
    corrections: [
      "Page 2, paragraphe 2.1 : l’énoncé note « Cₐ = 10⁻² mol/L » la concentration de la solution de soude versée, alors qu’il s’agit de la base — c’est Cᵦ. Le même symbole Cₐ désigne deux lignes plus loin la concentration de l’acide, déclarée inconnue. Le texte affirme donc à la fois que Cₐ vaut 10⁻² et qu’elle est inconnue. Il faut lire : soude de concentration Cᵦ = 10⁻² mol·L⁻¹ versée sur l’acide de concentration Cₐ inconnue, que le dosage détermine ensuite (Cₐ = 10⁻² mol·L⁻¹).",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les trois parties de la courbe",
      instruction: "Sélectionne une partie de la courbe pour comprendre ce qui s’y passe chimiquement.",
      observation: "Le pH ne saute qu’une fois, à l’équivalence. Partout ailleurs il se traîne — c’est justement ce contraste qui rend le point d’équivalence lisible au dixième de millilitre.",
      rootLabel: "Courbe pH = f(Vb) d’un acide fort dosé par une base forte",
      rootDetail: "Trois parties, un seul point d’inflexion",
      nodes: [
        { id: "avant", label: "Avant l’équivalence", role: "0 ≤ Vb ≤ 19 mL", detail: "L’acide est en excès. Chaque goutte de soude neutralise des ions H₃O⁺, mais il en reste tellement que le pH ne bouge presque pas : de 2 à 3,6 en dix-neuf millilitres. La courbe est quasi linéaire, concavité tournée vers le haut." },
        { id: "saut", label: "Le saut de pH", role: "19 ≤ Vb ≤ 21 mL", detail: "Les derniers ions H₃O⁺ disparaissent. Comme il n’y a plus de réserve pour tamponner l’ajout, le pH bondit de 3,6 à 10,1 en deux millilitres. La courbe change de concavité : c’est le point d’inflexion E, le point d’équivalence, en VbE = 20 mL et pH = 7." },
        { id: "apres", label: "Après l’équivalence", role: "Vb > 21 mL", detail: "La soude est maintenant en excès et le mélange n’est plus qu’une solution de soude diluée. Le pH tend vers l’asymptote pH = pKe + log Cb = 14 − 2 = 12. La concavité est tournée vers le bas." },
        { id: "equivalence", label: "Ce que contient le bécher en E", role: "solution neutre de NaCl", detail: "Les ions Na⁺ et Cl⁻ sont à la même concentration, 5 × 10⁻³ mol·L⁻¹. L’électroneutralité impose alors [H₃O⁺] = [OH⁻] = √Ke = 10⁻⁷ mol·L⁻¹, donc pH = 7 : une simple solution de chlorure de sodium, neutre." },
      ],
    },
    questions: [
      short("À l’équivalence, écris la relation entre $C_a$, $V_a$, $C_b$ et $V_{bE}$.", ["CaVa = CbVbE", "Ca.Va = Cb.VbE", "CaVa=CbVbE", "Ca Va = Cb VbE"], "Les réactifs sont dans les proportions stœchiométriques : $n(\\mathrm{H_3O^+})=n(\\mathrm{OH^-})$.", "I.2.6.2 Relation d’équivalence", 2),
      choice("Quel est le pH à l’équivalence d’un dosage acide fort / base forte à 25 °C ?", ["7", "moins de 7", "plus de 7", "cela dépend des concentrations"], 0, "L’électroneutralité impose $[\\mathrm{H_3O^+}]=[\\mathrm{OH^-}]=10^{-7}$ mol·L⁻¹.", "I.2.6.4 Composition à l’équivalence"),
      short("On lit $V_{bE}=20$ mL sur la courbe, avec $V_a=20$ mL et $C_b=10^{-2}$ mol·L⁻¹. Calcule $C_a$ en mol·L⁻¹.", ["1e-2", "10-2", "0,01", "0.01", "10^-2"], "$C_a=C_bV_{bE}/V_a=10^{-2}\\times20/20=10^{-2}$ mol·L⁻¹.", "I.2.6.2 Relation d’équivalence", 2),
      choice("Comment détermine-t-on graphiquement le point d’équivalence ?", ["par la méthode des tangentes parallèles", "en prenant le premier point de la courbe", "en prenant le pH le plus élevé", "en traçant la bissectrice des axes"], 0, "Deux tangentes parallèles encadrent le saut, leur parallèle équidistante coupe la courbe en E.", "I.2.6.3 Détermination graphique", 2),
      short("Vers quelle valeur tend le pH quand la soude ($C_b=10^{-2}$ mol·L⁻¹) est en large excès ?", ["12", "pH = 12"], "L’asymptote a pour équation $\\mathrm{pH}=\\mathrm{p}K_e+\\log C_b=14-2=12$.", "I.2.5 Analyse de la courbe", 2),
      choice("Quelle solution obtient-on à l’équivalence de ce dosage ?", ["une solution neutre de chlorure de sodium", "une solution basique d’éthanoate de sodium", "une solution acide de chlorure d’ammonium", "une solution tampon"], 0, "Les ions Na⁺ et Cl⁻ restent seuls en solution, sans propriété acide ni basique.", "I.2.6.4 Composition à l’équivalence", 2),
      choice("Combien la courbe d’un dosage acide fort / base forte présente-t-elle de points d’inflexion ?", ["un seul", "aucun", "deux", "trois"], 0, "La courbe comporte trois parties et un unique point d’inflexion, le point d’équivalence.", "I.2.5 Analyse de la courbe", 2),
    ],
  },
  {
    id: "weak-acid-strong-base",
    title: "Acide faible et base forte : la preuve par les concentrations",
    summary: "Montrer que la réaction est totale et qu’elle se déroule entre l’acide non dissocié et l’ion hydroxyde.",
    pages: "4-6",
    section: "II.1. Nature de la réaction",
    durationMinutes: 22,
    xp: 60,
    body: String.raw`## 1.1 Encore une réaction exothermique

Acide éthanoïque à $20\,^{\circ}\mathrm{C}$, soude à $20\,^{\circ}\mathrm{C}$, mélange à $28\,^{\circ}\mathrm{C}$ : **la réaction entre un acide faible et une base forte est exothermique**.

## 1.2 Est-elle totale ? L’expérience qui tranche

On verse $V_b=1$ mL de soude à $C_b=2\times10^{-1}$ mol·L⁻¹ sur $V_a=100$ mL d’acide éthanoïque à $C_a=10^{-2}$ mol·L⁻¹. Le pH du mélange vaut **4,2**.

Comme $V_b\ll V_a$, on néglige la dilution : $V_a+V_b\approx V_a$.

### Inventaire des espèces

- **Ions** : $\mathrm{H_3O^+}$, $\mathrm{OH^-}$, $\mathrm{CH_3COO^-}$, $\mathrm{Na^+}$
- **Molécules** : $\mathrm{H_2O}$, $\mathrm{CH_3COOH}$

### Les quatre concentrations, dans l’ordre

**1. Par le pH**, directement :
$$[\mathrm{H_3O^+}]=10^{-\mathrm{pH}}=10^{-4,2}=6{,}3\times10^{-5}\ \text{mol·L}^{-1}$$
$$[\mathrm{OH^-}]=10^{\mathrm{pH}-14}=1{,}6\times10^{-10}\ \text{mol·L}^{-1}$$

**2. Par la dilution du sodium**, qui est un ion spectateur : tout ce qu’on a versé est encore là.
$$[\mathrm{Na^+}]=\frac{C_bV_b}{V_a+V_b}\approx\frac{C_bV_b}{V_a}=\frac{2\times10^{-1}\times1}{100}=2\times10^{-3}\ \text{mol·L}^{-1}$$

**3. Par l’électroneutralité** : $[\mathrm{CH_3COO^-}]+[\mathrm{OH^-}]=[\mathrm{H_3O^+}]+[\mathrm{Na^+}]$.
Comme $[\mathrm{OH^-}]\ll[\mathrm{H_3O^+}]\ll[\mathrm{Na^+}]$, il ne reste que :
$$[\mathrm{CH_3COO^-}]\approx[\mathrm{Na^+}]=2\times10^{-3}\ \text{mol·L}^{-1}$$

**4. Par la conservation de la matière** : tout l’acide introduit est soit resté entier, soit devenu de l’ion éthanoate.
$$[\mathrm{CH_3COOH}]=C_a-[\mathrm{CH_3COO^-}]=10^{-2}-2\times10^{-3}=8\times10^{-3}\ \text{mol·L}^{-1}$$

### Le bilan qui conclut

| Quantité de matière | Avant le mélange | Après le mélange |
|---|---|---|
| $n(\mathrm{CH_3COOH})$ | $C_aV_a=10^{-3}$ mol | $[\mathrm{CH_3COOH}]V_a=0{,}8\times10^{-3}$ mol |
| $n(\mathrm{OH^-})$ | $C_bV_b=2\times10^{-4}$ mol | $[\mathrm{OH^-}]V_a=1{,}6\times10^{-11}$ mol |

**Deux conclusions se lisent dans ce tableau :**

**1. La réaction est totale.** Les ions $\mathrm{OH^-}$ sont passés de $2\times10^{-4}$ à $1{,}6\times10^{-11}$ mol : ils ont tous réagi.

**2. Elle se déroule entre $\mathrm{CH_3COOH}$ et $\mathrm{OH^-}$.** L’acide éthanoïque a perdu $10^{-3}-0{,}8\times10^{-3}=2\times10^{-4}$ mol, **exactement** la quantité d’ions hydroxyde introduite. Un pour un.

C’est un point délicat et il mérite qu’on s’y arrête. On aurait pu croire que $\mathrm{OH^-}$ réagit avec les ions $\mathrm{H_3O^+}$ déjà présents dans la solution d’acide faible. Le compte le dément : c’est bien la **molécule non dissociée** $\mathrm{CH_3COOH}$ qui est attaquée.

## 1.3 Conclusion

> La réaction entre un acide faible et une base forte est **exothermique et totale**.

| Type d’acide faible | Équation-bilan |
|---|---|
| Acide de type $\mathrm{AH}$ | $\mathrm{AH}+\mathrm{OH^-}\longrightarrow\mathrm{A^-}+\mathrm{H_2O}$ |
| Acide de type $\mathrm{BH^+}$ | $\mathrm{BH^+}+\mathrm{OH^-}\longrightarrow\mathrm{B}+\mathrm{H_2O}$ |

> **Le réflexe à garder.** Avec une base forte, c’est **l’acide sous sa forme non dissociée** qui réagit, et le produit est sa **base conjuguée**. On passe d’un bout à l’autre du couple.`,
    keyPoint: "Acide faible + base forte : réaction exothermique et totale, entre l’acide non dissocié et OH⁻ : AH + OH⁻ → A⁻ + H₂O.",
    example: "L’acide éthanoïque perd $2\\times10^{-4}$ mol, soit exactement les $2\\times10^{-4}$ mol d’ions $\\mathrm{OH^-}$ versées.",
    methodSteps: [
      "Fais l’inventaire complet des ions et des molécules présents après le mélange.",
      "Calcule [H₃O⁺] et [OH⁻] à partir du pH mesuré.",
      "Calcule la concentration de l’ion spectateur par simple dilution : [Na⁺] = CbVb/(Va + Vb).",
      "Écris l’électroneutralité, élimine les termes négligeables, obtiens la base conjuguée.",
      "Écris la conservation de la matière pour obtenir l’acide restant, puis dresse le bilan avant / après.",
    ],
    corrections: [
      "Page 5, paragraphe 1.2.1 : l’énoncé annonce Va = 20 mL, ce qui est incompatible avec l’ensemble du paragraphe qu’il introduit. Avec Va = 20 mL on obtiendrait CₐVₐ = 2 × 10⁻⁴ mol et [Na⁺] = 10⁻² mol·L⁻¹, donc [CH₃COOH] = Cₐ − [CH₃COO⁻] = 10⁻² − 10⁻² = 0 : on serait exactement à l’équivalence, ce qui contredit le pH mesuré de 4,2. Avec Va = 100 mL, les quatre valeurs du paragraphe et du tableau tombent toutes justes : CₐVₐ = 10⁻³ mol, [Na⁺] = 2 × 10⁻³ mol·L⁻¹, [CH₃COOH]·Vₐ = 0,8 × 10⁻³ mol et [OH⁻]·Vₐ = 1,6 × 10⁻¹¹ mol. La relation pH = pKa + log([base]/[acide]) confirme : 4,8 + log(2 × 10⁻³ / 8 × 10⁻³) = 4,2, précisément le pH mesuré. La leçon retient donc Va = 100 mL, valeur qui rend d’ailleurs bien meilleure l’approximation Vb ≪ Va sur laquelle repose tout le calcul.",
    ],
    interaction: timeline(
      [
        { label: "Lire le pH", shortLabel: "pH", detail: "pH = 4,2 donne [H₃O⁺] = 6,3 × 10⁻⁵ mol·L⁻¹ et [OH⁻] = 1,6 × 10⁻¹⁰ mol·L⁻¹." },
        { label: "Suivre l’ion spectateur", shortLabel: "Na⁺", detail: "Le sodium ne réagit pas : [Na⁺] = CbVb/Va = 2 × 10⁻¹ × 1/100 = 2 × 10⁻³ mol·L⁻¹." },
        { label: "Appliquer l’électroneutralité", shortLabel: "Charges", detail: "[CH₃COO⁻] + [OH⁻] = [H₃O⁺] + [Na⁺]. Les deux premiers termes du membre de droite étant négligeables devant [Na⁺], il reste [CH₃COO⁻] ≈ 2 × 10⁻³ mol·L⁻¹." },
        { label: "Appliquer la conservation de la matière", shortLabel: "Matière", detail: "[CH₃COOH] = Ca − [CH₃COO⁻] = 10⁻² − 2 × 10⁻³ = 8 × 10⁻³ mol·L⁻¹." },
        { label: "Dresser le bilan avant / après", shortLabel: "Bilan", detail: "OH⁻ passe de 2 × 10⁻⁴ à 1,6 × 10⁻¹¹ mol : la réaction est totale. CH₃COOH perd 2 × 10⁻⁴ mol, exactement autant : la réaction se fait entre ces deux espèces." },
      ],
      "De la mesure de pH à l’équation-bilan",
      "Suis les cinq étapes qui transforment une seule mesure de pH en une équation-bilan démontrée.",
      "C’est l’égalité des deux disparitions — 2 × 10⁻⁴ mol de chaque côté — qui prouve quelles espèces réagissent réellement.",
    ),
    questions: [
      short("Écris l’équation-bilan de la réaction entre un acide faible AH et une base forte.", ["AH + OH- -> A- + H2O", "AH + OH- → A- + H2O", "AH+OH- -> A-+H2O", "AH + OH- = A- + H2O"], "L’acide non dissocié réagit avec l’ion hydroxyde pour donner sa base conjuguée et de l’eau.", "II.1.3 Conclusion", 2),
      choice("Avec quelle espèce l’ion hydroxyde réagit-il dans une solution d’acide éthanoïque ?", ["la molécule non dissociée CH₃COOH", "l’ion éthanoate CH₃COO⁻", "l’ion H₃O⁺ déjà présent", "l’ion Na⁺"], 0, "L’acide éthanoïque perd exactement la quantité d’ions OH⁻ introduite : c’est lui qui réagit.", "II.1.2.3 Interprétation", 2),
      short("Calcule $[\\mathrm{Na^+}]$ pour $C_b=2\\times10^{-1}$ mol·L⁻¹, $V_b=1$ mL et $V_a=100$ mL (en mol·L⁻¹).", ["2e-3", "2.10-3", "0,002", "0.002", "2 10-3"], "$[\\mathrm{Na^+}]\\approx C_bV_b/V_a=2\\times10^{-1}\\times1/100=2\\times10^{-3}$ mol·L⁻¹.", "II.1.2.2 Calcul des concentrations", 2),
      short("Sachant $C_a=10^{-2}$ et $[\\mathrm{CH_3COO^-}]=2\\times10^{-3}$ mol·L⁻¹, calcule $[\\mathrm{CH_3COOH}]$ en mol·L⁻¹.", ["8e-3", "8.10-3", "0,008", "0.008", "8 10-3"], "Conservation de la matière : $10^{-2}-2\\times10^{-3}=8\\times10^{-3}$ mol·L⁻¹.", "II.1.2.2 Calcul des concentrations", 2),
      choice("La réaction entre un acide faible et une base forte est…", ["exothermique et totale", "exothermique et limitée", "endothermique et totale", "athermique et limitée"], 0, "Le mélange s’échauffe et les ions OH⁻ disparaissent entièrement.", "II.1.3 Conclusion"),
      short("Écris l’équation-bilan de la réaction entre un acide faible de type $\\mathrm{BH^+}$ et une base forte.", ["BH+ + OH- -> B + H2O", "BH+ + OH- → B + H2O", "BH+ + OH- = B + H2O"], "Même schéma : l’acide donne sa base conjuguée B et de l’eau.", "II.1.3 Conclusion", 2),
      choice("Pourquoi peut-on écrire $V_a+V_b\\approx V_a$ dans ce calcul ?", ["parce que Vb = 1 mL est négligeable devant Va = 100 mL", "parce que les volumes ne s’additionnent jamais", "parce que la réaction est totale", "parce que le pH est acide"], 0, "Un millilitre ajouté à cent, c’est une variation de 1 % : négligeable à ce niveau de précision.", "II.1.2.2 Calcul des concentrations", 2),
    ],
  },
  {
    id: "weak-acid-titration-curve",
    title: "Équivalence et demi-équivalence : lire un pKa sur une courbe",
    summary: "Exploiter les deux points d’inflexion de la courbe d’un acide faible, et comprendre pourquoi l’équivalence y est basique.",
    pages: "6-9",
    section: "II.2 et II.3. Évolution du pH et influence des concentrations",
    durationMinutes: 24,
    xp: 65,
    kind: "graph",
    body: String.raw`## Une courbe qui a deux points remarquables au lieu d’un

On verse de la soude à $C_b=0{,}1$ mol·L⁻¹ sur $V_a=20$ mL d’acide éthanoïque de concentration inconnue.

| $V_b$ (mL) | 0 | 4 | 8 | **11,1** | 16 | 20 | 21,5 | **22,2** | 22,5 | 25 | 27 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pH | 2,8 | 4 | 4,4 | **4,8** | 5 | 5,5 | 6,2 | **8,7** | 10,7 | 11,8 | 12 |

La courbe est **croissante**, comporte **quatre parties**, **trois concavités**, et donc **deux points d’inflexion** : E et F.

| Partie | Domaine | Ce qui s’y passe |
|---|---|---|
| 1ʳᵉ | $0\le V_b\le4$ mL | le pH croît **rapidement**, concavité vers le bas |
| 2ᵉ | $4\le V_b\le21$ mL | le pH varie peu, quasi linéairement : point d’inflexion **F**, la **demi-équivalence** |
| 3ᵉ | $21\le V_b\le23$ mL | **saut de pH** : point d’inflexion **E**, l’**équivalence** |
| 4ᵉ | $V_b\ge23$ mL | asymptote $\mathrm{pH}=\mathrm{p}K_e+\log C_b$, le pH tend vers celui de la soude |

> **Compare avec la courbe précédente.** L’acide fort partait de pH 2 et montait à peine ; l’acide faible part de pH 2,8 et grimpe vite dès les premières gouttes, puis s’installe sur un long plateau. Ce plateau, c’est le **domaine tampon** — et c’est lui qui n’existe pas avec un acide fort.

## 2.5 Le point d’équivalence E

$$n(\mathrm{CH_3COOH})=n(\mathrm{OH^-})\quad\Longrightarrow\quad C_aV_a=C_bV_{bE}$$

Par la méthode des tangentes parallèles : $\mathrm{E}\ (V_{bE}=22{,}2\ \text{mL}\ ;\ \mathrm{pH}_E=8{,}7)$.

**Le pH à l’équivalence vaut 8,7 : la solution est basique.** Ce n’est plus 7, et ce n’est pas un hasard.

## 2.6 Pourquoi l’équivalence est-elle basique ?

À l’équivalence, tout l’acide éthanoïque a été transformé. Il reste dans le bécher :

- **Ions** : $\mathrm{H_3O^+}$, $\mathrm{OH^-}$, $\mathrm{Na^+}$, $\mathrm{CH_3COO^-}$ — **molécules** : $\mathrm{H_2O}$, $\mathrm{CH_3COOH}$
- $[\mathrm{H_3O^+}]=10^{-8,7}=2\times10^{-9}$ et $[\mathrm{OH^-}]=10^{8,7-14}=5\times10^{-6}$ mol·L⁻¹

L’électroneutralité $[\mathrm{Na^+}]+[\mathrm{H_3O^+}]=[\mathrm{OH^-}]+[\mathrm{CH_3COO^-}]$ donne, en négligeant $[\mathrm{H_3O^+}]$ devant $[\mathrm{OH^-}]$ :

$$[\mathrm{CH_3COO^-}]=[\mathrm{Na^+}]-[\mathrm{OH^-}]$$

et la conservation de la matière, combinée à $C_aV_a=C_bV_{bE}$, donne $[\mathrm{CH_3COOH}]=[\mathrm{OH^-}]=5\times10^{-6}$ mol·L⁻¹.

> **Les espèces majoritaires sont $\mathrm{CH_3COO^-}$ et $\mathrm{Na^+}$.** Le bécher contient donc une solution d’**éthanoate de sodium** : or l’ion éthanoate est une **base faible**, qui réagit un peu avec l’eau. D’où le caractère basique de la solution à l’équivalence.

## 2.7 Le point de demi-équivalence F — le plus utile des deux

$$V_{bF}=\frac{V_{bE}}{2}=\frac{22{,}2}{2}=11{,}1\ \text{mL}\qquad\text{et on lit}\qquad \mathrm{pH}_F=4{,}8$$

> **À la demi-équivalence, le pH de la solution est égal au $\mathrm{p}K_a$ du couple mis en jeu.**

Pourquoi ? À la demi-équivalence, la moitié de l’acide a été transformée en sa base conjuguée : $[\mathrm{AH}]=[\mathrm{A^-}]$. Or $\mathrm{pH}=\mathrm{p}K_a+\log\dfrac{[\mathrm{A^-}]}{[\mathrm{AH}]}$, et le logarithme de 1 vaut zéro. Il reste $\mathrm{pH}=\mathrm{p}K_a$.

Ici $\mathrm{p}K_a=4{,}8$ : c’est bien celui du couple $\mathrm{CH_3COOH}/\mathrm{CH_3COO^-}$.

> **Le point de demi-équivalence permet de déterminer graphiquement le $\mathrm{p}K_a$ d’un couple** — et donc, avec un tableau de pKa, d’**identifier** un acide inconnu.

## 3. Ce qui change quand on dilue

On refait le dosage avec $C_a=C_b=10^{-1}$, puis $10^{-2}$, puis $10^{-3}$ mol·L⁻¹.

| Ce qui change | Ce qui ne change pas |
|---|---|
| le **saut de pH** est d’autant plus marqué que les concentrations sont grandes | le **volume équivalent** $V_{bE}$ (car $C_a=C_b$) |
| le point d’équivalence E se déplace | le **point de demi-équivalence** : $\mathrm{pH}=\mathrm{p}K_a$ reste le même |

> **La conséquence pratique.** Un dosage trop dilué donne un saut de pH mou, donc un point d’équivalence difficile à lire. Mais le pKa, lui, reste lisible : c’est une propriété du couple, pas de la solution.`,
    keyPoint: "Deux points d’inflexion : l’équivalence (CaVa = CbVbE, pH basique) et la demi-équivalence (VbE/2, où pH = pKa).",
    example: "$V_{bE}=22{,}2$ mL donne $V_{bF}=11{,}1$ mL, où on lit $\\mathrm{pH}=4{,}8=\\mathrm{p}K_a$ du couple $\\mathrm{CH_3COOH}/\\mathrm{CH_3COO^-}$.",
    methodSteps: [
      "Repère le saut de pH et place E par la méthode des tangentes parallèles.",
      "Déduis la concentration inconnue de la relation CaVa = CbVbE.",
      "Divise VbE par deux pour obtenir l’abscisse de la demi-équivalence.",
      "Lis le pH correspondant sur la courbe : c’est le pKa du couple.",
      "Compare ce pKa à un tableau de couples pour identifier l’acide dosé.",
    ],
    corrections: [
      "Page 8, paragraphe 2.6 : le corrigé écrit « [H₃O⁺] >> [OH⁻] » pour justifier une approximation, alors que le pH vaut 8,7 et que la solution est donc basique. L’inégalité est inversée : [OH⁻] = 5 × 10⁻⁶ mol·L⁻¹ est environ 2 500 fois plus grand que [H₃O⁺] = 2 × 10⁻⁹ mol·L⁻¹. Le calcul qui suit utilise d’ailleurs le bon sens, puisqu’il néglige [H₃O⁺] et conserve [OH⁻].",
      "Page 7, paragraphe 2.4 : la quatrième partie de la courbe est décrite par l’intervalle incomplet « 23 mL ≤ Vb ≤ mL », dont la borne supérieure manque. Il faut lire Vb ≥ 23 mL, domaine sur lequel la courbe rejoint son asymptote.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les deux points remarquables",
      instruction: "Sélectionne un point de la courbe pour découvrir ce qu’il apprend et comment l’exploiter.",
      observation: "Une courbe d’acide faible porte deux informations, pas une : la concentration se lit à l’équivalence, l’identité du couple se lit à la demi-équivalence.",
      rootLabel: "Courbe pH = f(Vb) d’un acide faible dosé par une base forte",
      rootDetail: "Quatre parties, deux points d’inflexion",
      nodes: [
        { id: "demi", group: "Les points d’inflexion", label: "F, la demi-équivalence", role: "VbE/2 → pH = pKa", detail: "À VbF = 11,1 mL, la moitié de l’acide a été transformée en sa base conjuguée, donc [AH] = [A⁻]. La relation pH = pKa + log([A⁻]/[AH]) se réduit à pH = pKa, car log 1 = 0. On lit ici pH = 4,8, le pKa du couple CH₃COOH/CH₃COO⁻. C’est le point qui permet d’identifier un acide inconnu." },
        { id: "equiv", group: "Les points d’inflexion", label: "E, l’équivalence", role: "CaVa = CbVbE → pH = 8,7", detail: "À VbE = 22,2 mL, tout l’acide a réagi. Le bécher contient une solution d’éthanoate de sodium : les espèces majoritaires sont CH₃COO⁻ et Na⁺. Comme l’ion éthanoate est une base faible, la solution est basique — pH = 8,7 et non 7. C’est le point qui donne la concentration inconnue." },
        { id: "tampon", group: "Les zones", label: "Le plateau tampon", role: "4 ≤ Vb ≤ 21 mL", detail: "Sur ce long domaine, l’acide et sa base conjuguée coexistent en quantités comparables et le pH ne varie presque pas. C’est le domaine tampon, qui n’existe pas dans le dosage d’un acide fort. La solution obtenue en son milieu, à la demi-équivalence, est précisément une solution tampon." },
        { id: "dilution", group: "Les zones", label: "L’effet des concentrations", role: "ce qui bouge, ce qui reste", detail: "Plus les concentrations sont grandes, plus le saut de pH est marqué et le point d’équivalence lisible. Mais le point de demi-équivalence, lui, ne bouge pas : pH = pKa est une propriété du couple, pas de la dilution. Un dosage trop dilué rend l’équivalence floue sans rien enlever au pKa." },
      ],
    },
    questions: [
      choice("Combien de points d’inflexion présente la courbe de dosage d’un acide faible par une base forte ?", ["deux", "un", "trois", "aucun"], 0, "La courbe comporte quatre parties, trois concavités et donc deux points d’inflexion, E et F.", "II.2.4 Exploitation de la courbe"),
      short("À la demi-équivalence, à quoi le pH est-il égal ?", ["pKa", "au pKa", "pH = pKa"], "$[\\mathrm{AH}]=[\\mathrm{A^-}]$ donc $\\log([\\mathrm{A^-}]/[\\mathrm{AH}])=0$ et $\\mathrm{pH}=\\mathrm{p}K_a$.", "II.2.7 Point de demi-équivalence", 2),
      short("On lit $V_{bE}=22{,}2$ mL. Calcule le volume de la demi-équivalence, en mL.", ["11,1", "11.1", "11,1 mL"], "$V_{bF}=V_{bE}/2=22{,}2/2=11{,}1$ mL.", "II.2.7 Point de demi-équivalence", 2),
      choice("Pourquoi le pH vaut-il 8,7 et non 7 à l’équivalence de ce dosage ?", ["parce que la solution obtenue est de l’éthanoate de sodium, dont l’ion éthanoate est une base faible", "parce que la soude est en excès", "parce que l’acide éthanoïque est encore présent en grande quantité", "parce que le pH-mètre est mal étalonné"], 0, "Les espèces majoritaires sont CH₃COO⁻ et Na⁺ : l’ion éthanoate rend la solution basique.", "II.2.6 Composition à l’équivalence", 3),
      short("À la demi-équivalence on lit pH $=4{,}8$. Quel est le pKa du couple dosé ?", ["4,8", "4.8", "pKa = 4,8"], "À la demi-équivalence, pH = pKa. Ce couple est $\\mathrm{CH_3COOH}/\\mathrm{CH_3COO^-}$.", "II.2.7 Point de demi-équivalence", 2),
      choice("Quand on augmente les concentrations $C_a=C_b$, qu’observe-t-on ?", ["le saut de pH devient plus marqué", "le pH de demi-équivalence augmente", "le pH de demi-équivalence diminue", "la courbe devient décroissante"], 0, "Le saut s’accentue avec la concentration ; le pH de demi-équivalence, lui, ne change pas.", "II.3 Influence des concentrations", 2),
      choice("Que reste-t-il inchangé quand on dilue les deux solutions dans les mêmes proportions ?", ["le point de demi-équivalence, donc le pKa lu", "le saut de pH", "le pH initial de l’acide", "le pH à l’équivalence"], 0, "Le pKa est une propriété du couple : la dilution ne le modifie pas.", "II.3 Influence des concentrations", 2),
      short("Quelles sont les deux espèces majoritaires à l’équivalence de ce dosage ?", ["CH3COO- et Na+", "Na+ et CH3COO-", "ion éthanoate et ion sodium", "CH3COO-, Na+"], "Tout l’acide a réagi : il reste une solution d’éthanoate de sodium.", "II.2.6 Composition à l’équivalence", 2),
    ],
  },
  {
    id: "strong-acid-weak-base",
    title: "Acide fort et base faible : la courbe qui descend",
    summary: "Traiter le cas symétrique, où l’on dose une base faible par un acide fort et où l’équivalence devient acide.",
    pages: "9",
    section: "III. Réaction entre un acide fort et une base faible",
    durationMinutes: 22,
    xp: 75,
    kind: "practice",
    body: String.raw`## 2.1 Les caractéristiques

> La réaction entre un **acide fort** et une **base faible** est **totale** et **exothermique**.

| Type de base faible | Équation-bilan |
|---|---|
| Base de type $\mathrm{A^-}$ | $\mathrm{A^-}+\mathrm{H_3O^+}\longrightarrow\mathrm{AH}+\mathrm{H_2O}$ |
| Base de type $\mathrm{B}$ | $\mathrm{B}+\mathrm{H_3O^+}\longrightarrow\mathrm{BH^+}+\mathrm{H_2O}$ |

C’est le miroir exact du niveau précédent. Là-bas, $\mathrm{OH^-}$ arrachait un proton à l’acide faible ; ici, $\mathrm{H_3O^+}$ **donne** un proton à la base faible. On parcourt le couple dans l’autre sens.

## Ce qui change sur la courbe

Cette fois on verse **l’acide** dans la base : la courbe $\mathrm{pH}=f(V_a)$ est donc **décroissante**. Tout le reste se transpose terme à terme.

| Dosage | Sens de la courbe | pH à l’équivalence | Nombre de parties |
|---|---|---|---|
| Acide fort par base forte | croissante | $=7$ | 3 |
| Acide faible par base forte | croissante | $>7$ (basique) | 4 |
| **Base faible par acide fort** | **décroissante** | $\boldsymbol{<7}$ **(acide)** | **4** |
| Base forte par acide fort | décroissante | $=7$ | 3 |

> **La règle générale, en une phrase.** À l’équivalence, il ne reste que le **conjugué** du réactif faible. Si le réactif faible était un acide, on récupère sa base conjuguée et le pH monte au-dessus de 7 ; si c’était une base, on récupère son acide conjugué et le pH descend en dessous de 7. Quand les deux réactifs sont forts, on ne récupère que des ions spectateurs et le pH vaut 7.

## 2.2 L’activité : action de l’acide chlorhydrique sur l’ammoniac

Dans un bécher, $V_B=20$ mL d’ammoniac de concentration $C$ **inconnue**. À la burette, on ajoute un volume $V$ d’acide chlorhydrique à $C'=0{,}14$ mol·L⁻¹.

| $V$ (mL) | 0 | 6 | 10 | 12 | 14 | 14,5 | 15 | 15,2 | 16 | 20 | 30 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pH | 11,1 | 9,5 | 9 | 8,6 | 7,7 | 6 | 4 | 2,8 | 2,6 | 2 | 1,6 |

### Le travail demandé

**1.** Écrire l’équation-bilan. L’ammoniac est une base faible de type $\mathrm{B}$ :
$$\mathrm{NH_3}+\mathrm{H_3O^+}\ \longrightarrow\ \mathrm{NH_4^+}+\mathrm{H_2O}$$

**2.** Tracer $\mathrm{pH}=f(V)$, à l’échelle 1 cm pour 2 mL et 1 cm pour une unité de pH.

**3.** En déduire :

- **les coordonnées du point d’équivalence.** Le saut le plus brutal se situe entre 14,5 et 15,2 mL : on place E vers $V_E\approx15$ mL, à un pH nettement inférieur à 7 ;
- **le $\mathrm{p}K_a$ du couple.** À la demi-équivalence, vers $V\approx7{,}5$ mL, on lit un pH voisin de **9,2** : c’est le pKa du couple $\mathrm{NH_4^+}/\mathrm{NH_3}$ ;
- **la concentration $C$** de l’ammoniac : $C=\dfrac{C'V_E}{V_B}=\dfrac{0{,}14\times15}{20}\approx0{,}1$ mol·L⁻¹ ;
- **pourquoi la solution est acide à l’équivalence** : il ne reste que du **chlorure d’ammonium**, et l’ion ammonium $\mathrm{NH_4^+}$ est un **acide faible**.

> **Attention à la précision.** Le tableau ne donne que des points espacés autour du saut, donc $V_E$ se lit à quelques dixièmes de millilitre près. C’est normal : sur un tracé à la main, une lecture entre 14,5 et 15 mL est acceptable, et la concentration trouvée reste voisine de $0{,}1$ mol·L⁻¹.`,
    keyPoint: "Base faible dosée par un acide fort : courbe décroissante, quatre parties, équivalence acide (pH < 7) car il ne reste que l’acide conjugué.",
    example: "$\\mathrm{NH_3}+\\mathrm{H_3O^+}\\rightarrow\\mathrm{NH_4^+}+\\mathrm{H_2O}$ : à l’équivalence il ne reste que $\\mathrm{NH_4^+}$, acide faible, d’où un pH inférieur à 7.",
    methodSteps: [
      "Identifie le réactif faible : c’est lui qui décide du pH à l’équivalence.",
      "Écris l’équation-bilan en faisant réagir H₃O⁺ avec la base faible.",
      "Place le point d’équivalence au milieu du saut de pH, par la méthode des tangentes.",
      "Lis le pH à la demi-équivalence : c’est le pKa du couple.",
      "Applique C·VB = C'·VE pour obtenir la concentration inconnue.",
    ],
    interaction: timeline(
      [
        { label: "Reconnaître le réactif faible", shortLabel: "Faible", detail: "L’ammoniac NH₃ est la base faible ; l’acide chlorhydrique est fort. C’est le réactif faible qui décide du pH à l’équivalence." },
        { label: "Écrire l’équation-bilan", shortLabel: "Bilan", detail: "NH₃ + H₃O⁺ → NH₄⁺ + H₂O. L’ion hydronium donne son proton à la base faible." },
        { label: "Placer l’équivalence", shortLabel: "Équivalence", detail: "Le saut se produit entre 14,5 et 15,2 mL : VE ≈ 15 mL, à un pH inférieur à 7 puisqu’il ne reste que du chlorure d’ammonium." },
        { label: "Lire le pKa à la demi-équivalence", shortLabel: "pKa", detail: "À V ≈ 7,5 mL, le pH vaut environ 9,2 : c’est le pKa du couple NH₄⁺/NH₃." },
        { label: "Calculer la concentration", shortLabel: "Concentration", detail: "C = C'·VE/VB = 0,14 × 15/20 ≈ 0,1 mol·L⁻¹." },
      ],
      "Doser une base faible",
      "Suis les cinq étapes de l’activité sur l’ammoniac, du réactif faible à la concentration.",
      "La démarche est la même que pour un acide faible : seul le sens de la courbe et celui de l’équation changent.",
    ),
    questions: [
      short("Écris l’équation-bilan de la réaction entre l’ammoniac et l’acide chlorhydrique.", ["NH3 + H3O+ -> NH4+ + H2O", "NH3 + H3O+ → NH4+ + H2O", "NH3+H3O+ -> NH4+ + H2O", "NH3 + H3O+ = NH4+ + H2O"], "L’ammoniac est une base faible de type B : elle capte un proton.", "III.2.2 Action de HCl sur NH₃", 2),
      choice("Le pH à l’équivalence d’un dosage acide fort / base faible est…", ["inférieur à 7", "égal à 7", "supérieur à 7", "toujours égal au pKa"], 0, "Il ne reste que l’acide conjugué de la base faible, qui acidifie la solution.", "III.2.1 Caractéristiques", 2),
      choice("Pourquoi la courbe pH = f(V) est-elle décroissante dans ce dosage ?", ["parce qu’on verse l’acide dans la base", "parce que la réaction est exothermique", "parce que la base est faible", "parce que le pH-mètre est inversé"], 0, "Chaque ajout d’acide fait baisser le pH de la solution initialement basique.", "III.2.2 Action de HCl sur NH₃", 2),
      short("Écris l’équation-bilan entre une base faible de type $\\mathrm{A^-}$ et un acide fort.", ["A- + H3O+ -> AH + H2O", "A- + H3O+ → AH + H2O", "A- + H3O+ = AH + H2O"], "La base faible capte un proton et redonne son acide conjugué.", "III.2.1 Caractéristiques", 2),
      short("Avec $V_E\\approx15$ mL, $C'=0{,}14$ mol·L⁻¹ et $V_B=20$ mL, calcule $C$ en mol·L⁻¹.", ["0,1", "0.1", "0,105", "0.105", "1e-1"], "$C=C'V_E/V_B=0{,}14\\times15/20\\approx0{,}1$ mol·L⁻¹.", "III.2.2 question 3.3", 3),
      choice("À l’équivalence du dosage de l’ammoniac par l’acide chlorhydrique, la solution contient essentiellement…", ["du chlorure d’ammonium, acide faible", "de l’ammoniac en excès", "du chlorure de sodium, neutre", "de l’éthanoate de sodium"], 0, "L’ion ammonium NH₄⁺ est un acide faible : la solution est acide.", "III.2.2 question 3.4", 2),
      short("Quel est le pKa du couple $\\mathrm{NH_4^+}/\\mathrm{NH_3}$, lu à la demi-équivalence ?", ["9,2", "9.2", "pKa = 9,2"], "La demi-équivalence, vers 7,5 mL, donne un pH voisin de 9,2.", "III.2.2 question 3.2", 2),
      choice("Dans quel cas le pH à l’équivalence vaut-il exactement 7 à 25 °C ?", ["quand l’acide et la base sont tous deux forts", "quand l’acide est faible et la base forte", "quand l’acide est fort et la base faible", "dans tous les cas"], 0, "Il ne reste alors que des ions spectateurs, sans propriété acide ni basique.", "Synthèse I, II et III", 2),
    ],
  },
  {
    id: "buffer-solutions",
    title: "Les solutions tampons",
    summary: "Reconnaître, préparer et exploiter une solution dont le pH résiste à la dilution et aux ajouts modérés.",
    pages: "9-11",
    section: "IV. Solutions tampons",
    durationMinutes: 26,
    xp: 80,
    body: String.raw`## 1. Ce qu’est une solution tampon

Au cours de la réaction entre un acide faible et une base forte — ou entre une base faible et un acide fort — la solution obtenue **à la demi-équivalence** est appelée **solution tampon**. Elle est telle que :

- $\mathrm{pH}=\mathrm{p}K_a$ du couple acide/base présent ;
- $[\text{Acide}]=[\text{Base conjuguée}]$.

> Une solution tampon est constituée d’un **mélange équimolaire d’un acide faible et de sa base conjuguée**.

## 2. Ses trois propriétés

On prépare une solution tampon en mélangeant $V_a=5$ mL d’acide éthanoïque à $10^{-2}$ mol·L⁻¹ et $V_b=5$ mL d’éthanoate de sodium à $10^{-2}$ mol·L⁻¹. Le pH-mètre affiche $4{,}8$. On répartit cette solution en plusieurs tubes.

| Tube | pH mesuré |
|---|---|
| Tube témoin | **4,8** |
| + quelques gouttes de $\mathrm{NaOH}$ à $0{,}1$ mol·L⁻¹ | 4,9 |
| + quelques gouttes de $\mathrm{HCl}$ à $0{,}1$ mol·L⁻¹ | 4,7 |
| + quelques cm³ d’eau | 4,82 |

> Une solution tampon est une solution aqueuse dont le pH :
> - **varie peu** suite à une **dilution** modérée ;
> - **augmente peu** suite à l’addition modérée d’une **base** ;
> - **diminue peu** suite à l’addition modérée d’un **acide**.

**Pourquoi ça marche.** La solution contient une réserve d’acide **et** une réserve de base conjuguée. Ajoute-t-on de la base ? L’acide en réserve la neutralise. Ajoute-t-on de l’acide ? La base en réserve l’absorbe. Le rapport $[\mathrm{A^-}]/[\mathrm{AH}]$ bouge à peine, donc son logarithme encore moins — et le pH tient bon. Le mot **modérée** compte : versez assez d’acide pour épuiser la réserve de base et le tampon cède.

## 3. Les trois façons d’en préparer une

### 3.1 Acide faible + base forte, jusqu’à la demi-équivalence

$$n(\mathrm{OH^-})=\frac{n(\mathrm{AH})}{2}\quad\Longrightarrow\quad C_bV_b=\frac{C_aV_a}{2}\quad\Longrightarrow\quad V_b=\frac{C_aV_a}{2C_b}$$

**Application.** Quel volume $V_b$ de soude à $C_b=0{,}5$ mol·L⁻¹ ajouter à $V_a=20$ mL d’acide éthanoïque (pKa $=4{,}8$) à $C_a=0{,}1$ mol·L⁻¹ pour obtenir un tampon de pH $=4{,}8$ ?

$$V_b=\frac{0{,}1\times20}{2\times0{,}5}=\boxed{2\ \text{mL}}$$

### 3.2 Acide fort + base faible, jusqu’à la demi-équivalence

$$n(\mathrm{H_3O^+})=\frac{n(\mathrm{B})}{2}\quad\Longrightarrow\quad C_aV_a=\frac{C_bV_b}{2}\quad\Longrightarrow\quad V_a=\frac{C_bV_b}{2C_a}$$

**Application.** Quel volume $V_a$ d’acide chlorhydrique à $C_a=0{,}4$ mol·L⁻¹ ajouter à $V_b=40$ mL d’ammoniac (pKa $=9{,}2$) à $C_b=0{,}2$ mol·L⁻¹ pour obtenir un tampon de pH $=9{,}2$ ?

$$V_a=\frac{0{,}2\times40}{2\times0{,}4}=\boxed{10\ \text{mL}}$$

### 3.3 Mélange équimolaire d’un acide faible et de sa base conjuguée

Pas de réaction cette fois : on met directement les deux partenaires du couple, en quantités égales.

$$n(\mathrm{A})=n(\mathrm{B})\quad\Longrightarrow\quad C_aV_a=C_bV_b$$

**Application.** Quels volumes d’acide méthanoïque à $C_a=0{,}1$ mol·L⁻¹ et de méthanoate de sodium à $C_b=0{,}3$ mol·L⁻¹ mélanger pour obtenir $V=1$ L de tampon ? Le pKa du couple vaut $3{,}8$.

Deux conditions : $C_aV_a=C_bV_b$ et $V_a+V_b=1000$ mL. En remplaçant $V_b$ par $1000-V_a$ :

$$0{,}1\,V_a=0{,}3\,(1000-V_a)\ \Longrightarrow\ 0{,}4\,V_a=300\ \Longrightarrow\ \boxed{V_a=750\ \text{mL}}\quad\text{et}\quad V_b=250\ \text{mL}$$

Le pH de ce tampon vaut $\mathrm{p}K_a=3{,}8$.

> **La vérification qui évite l’erreur.** Le tampon le plus concentré est celui de la base : il en faut donc **moins**. Trouver $V_b>V_a$ ici serait un signe d’erreur.

## 4. À quoi ça sert

| En chimie | En biologie |
|---|---|
| étalonner les pH-mètres | favoriser les réactions enzymatiques des médicaments |
| contrôler le pH lors des réactions d’oxydoréduction | favoriser l’assimilation des nutriments par le sang, en atténuant sa saveur acide |`,
    keyPoint: "Tampon = mélange équimolaire d’un acide faible et de sa base conjuguée ; pH = pKa, et ce pH résiste à la dilution comme aux ajouts modérés.",
    example: "$V_b=\\dfrac{C_aV_a}{2C_b}=\\dfrac{0{,}1\\times20}{2\\times0{,}5}=2$ mL de soude suffisent à tamponner 20 mL d’acide éthanoïque à pH 4,8.",
    methodSteps: [
      "Identifie la méthode : réaction jusqu’à la demi-équivalence, ou mélange direct des deux partenaires du couple.",
      "Écris la condition sur les quantités de matière : moitié pour une demi-équivalence, égalité pour un mélange direct.",
      "Traduis-la en concentrations et volumes, puis isole l’inconnue.",
      "Ajoute la condition de volume total si l’énoncé impose un volume final.",
      "Conclus en rappelant que le pH du tampon obtenu vaut le pKa du couple.",
    ],
    corrections: [
      "Page 11, paragraphe 3.3 : la conclusion annonce « pour obtenir 1 L de solution tampon de pH = 9,2 » alors que l’énoncé porte sur le couple de l’acide méthanoïque, dont le pKa est donné égal à 3,8. La valeur 9,2 est celle de l’activité précédente, sur l’ammoniac. Les volumes calculés, Va = 750 mL et Vb = 250 mL, sont exacts ; c’est le pH annoncé qui doit être corrigé en pH = pKa = 3,8.",
      "Page 10, paragraphe 3.2 : la relation littérale est écrite « Ca.Va = Cb.Va/2 », avec Va des deux côtés. Il faut lire Ca·Va = Cb·Vb/2, la quantité de base étant Cb·Vb. Le calcul numérique qui suit utilise bien Vb et donne le résultat correct de 10 mL.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Trois chemins vers le même tampon",
      instruction: "Sélectionne une méthode de préparation pour voir sa condition et son calcul.",
      observation: "Les trois méthodes visent toutes le même état : autant d’acide que de base conjuguée. Seul le chemin pour y arriver change.",
      rootLabel: "Obtenir une solution tampon",
      rootDetail: "Objectif commun : [Acide] = [Base conjuguée], donc pH = pKa",
      nodes: [
        { id: "m1", label: "Acide faible + base forte", role: "s’arrêter à la demi-équivalence", detail: "On neutralise exactement la moitié de l’acide : n(OH⁻) = n(AH)/2, soit Cb·Vb = Ca·Va/2. Avec 20 mL d’acide éthanoïque à 0,1 mol·L⁻¹ et de la soude à 0,5 mol·L⁻¹ : Vb = (0,1 × 20)/(2 × 0,5) = 2 mL. Le tampon obtenu a pour pH 4,8." },
        { id: "m2", label: "Acide fort + base faible", role: "s’arrêter à la demi-équivalence", detail: "Symétrique du précédent : on protone exactement la moitié de la base, n(H₃O⁺) = n(B)/2, soit Ca·Va = Cb·Vb/2. Avec 40 mL d’ammoniac à 0,2 mol·L⁻¹ et de l’acide chlorhydrique à 0,4 mol·L⁻¹ : Va = (0,2 × 40)/(2 × 0,4) = 10 mL. Le tampon obtenu a pour pH 9,2." },
        { id: "m3", label: "Mélange équimolaire direct", role: "aucune réaction nécessaire", detail: "On met côte à côte l’acide et sa base conjuguée en quantités égales : Ca·Va = Cb·Vb. Pour 1 L de tampon à partir d’acide méthanoïque à 0,1 mol·L⁻¹ et de méthanoate de sodium à 0,3 mol·L⁻¹, on résout aussi Va + Vb = 1000 mL : Va = 750 mL et Vb = 250 mL. Le tampon obtenu a pour pH 3,8, le pKa du couple." },
        { id: "props", label: "Ce que fait le tampon", role: "trois résistances", detail: "Dilution modérée : 4,8 devient 4,82. Ajout modéré de base : 4,8 devient 4,9. Ajout modéré d’acide : 4,8 devient 4,7. La réserve d’acide absorbe les bases ajoutées, la réserve de base absorbe les acides ajoutés. Épuisez l’une des deux réserves et le tampon cède : le mot « modéré » n’est pas décoratif." },
      ],
    },
    questions: [
      choice("Une solution tampon est constituée…", ["d’un mélange équimolaire d’un acide faible et de sa base conjuguée", "d’un acide fort et d’une base forte", "d’un acide faible seul", "d’un sel neutre dissous dans l’eau"], 0, "C’est la définition du cours : [Acide] = [Base conjuguée], d’où pH = pKa.", "IV.1 Composition d’une solution tampon"),
      short("À quoi le pH d’une solution tampon est-il égal ?", ["pKa", "au pKa", "pH = pKa"], "Le mélange étant équimolaire, $\\log([\\mathrm{A^-}]/[\\mathrm{AH}])=0$.", "IV.1 Composition d’une solution tampon", 2),
      short("Calcule le volume $V_b$ de soude à $0{,}5$ mol·L⁻¹ à ajouter à 20 mL d’acide éthanoïque à $0{,}1$ mol·L⁻¹ pour obtenir un tampon (en mL).", ["2", "2 mL", "2mL"], "$V_b=C_aV_a/(2C_b)=(0{,}1\\times20)/(2\\times0{,}5)=2$ mL.", "IV.3.1 Activité d’application", 3),
      short("Calcule le volume $V_a$ d’acide chlorhydrique à $0{,}4$ mol·L⁻¹ à ajouter à 40 mL d’ammoniac à $0{,}2$ mol·L⁻¹ pour obtenir un tampon (en mL).", ["10", "10 mL", "10mL"], "$V_a=C_bV_b/(2C_a)=(0{,}2\\times40)/(2\\times0{,}4)=10$ mL.", "IV.3.2 Activité d’application", 3),
      short("On veut 1 L de tampon à partir d’acide méthanoïque à $0{,}1$ mol·L⁻¹ et de méthanoate de sodium à $0{,}3$ mol·L⁻¹. Calcule $V_a$ en mL.", ["750", "750 mL", "750mL"], "$C_aV_a=C_bV_b$ et $V_a+V_b=1000$ donnent $0{,}4V_a=300$, soit $V_a=750$ mL.", "IV.3.3 Activité d’application", 3),
      choice("Quel est le pH du tampon obtenu au 3.3, sachant que le pKa du couple vaut 3,8 ?", ["3,8", "9,2", "7", "4,8"], 0, "Le pH d’un tampon vaut le pKa du couple mis en jeu, ici 3,8.", "IV.3.3 (coquille du document corrigée)", 3),
      choice("Que devient le pH d’une solution tampon après une dilution modérée ?", ["il varie très peu", "il devient égal à 7", "il augmente fortement", "il diminue fortement"], 0, "De 4,8 à 4,82 dans l’expérience du cours.", "IV.2.2 Conclusion", 2),
      choice("Parmi ces usages, lequel relève de la biologie ?", ["favoriser l’assimilation des nutriments par le sang", "étalonner un pH-mètre", "contrôler le pH d’une réaction d’oxydoréduction", "doser un acide inconnu"], 0, "Le cours cite les réactions enzymatiques et l’assimilation des nutriments.", "IV.4 Intérêt d’une solution tampon", 2),
    ],
  },
  {
    id: "titration-identification-mission",
    title: "Mission finale : exploiter un dosage de bout en bout",
    summary: "Mener une situation d’évaluation complète, puis identifier des flacons inconnus et une base faible par son pKa.",
    pages: "11-19",
    section: "Situation d’évaluation et exercices 3 à 5",
    durationMinutes: 42,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Partie A — La situation d’évaluation

Tu verses sur $V_b=50$ mL d’une solution d’hydroxyde de sodium une solution d’acide chlorhydrique de concentration $C_a=10^{-2}$ mol·L⁻¹, et tu relèves le pH.

| $V_a$ (mL) | 0 | 5 | 10 | 14 | 16 | 16,25 | **16,5** | 16,75 | 17 | 18 | 20 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| pH | 11,5 | 11,3 | 11,1 | 10,8 | 9,9 | 9,6 | **7,3** | 4,4 | 4,1 | 3,6 | 3,3 |

**1. Le montage.** Burette graduée contenant l’acide chlorhydrique, bécher contenant les 50 mL de soude, barreau aimanté, agitateur magnétique, sonde de pH-mètre.

**2. L’équation-bilan.** Deux espèces fortes : $\ \mathrm{H_3O^+}+\mathrm{OH^-}\longrightarrow2\,\mathrm{H_2O}$.

**3. Le pH à l’équivalence.** Acide fort et base forte : la solution obtenue est du chlorure de sodium, **neutre**, donc $\mathrm{pH}_E=7$ à $25\,^{\circ}\mathrm{C}$.

**4 et 5. Le point d’équivalence.** Par la méthode des tangentes parallèles : $\ \mathrm{E}\ (V_{aE}=16{,}6\ \text{mL}\ ;\ \mathrm{pH}_E=7)$.

**6. La concentration de la soude.**
$$C_b=\frac{C_aV_{aE}}{V_b}=\frac{10^{-2}\times16{,}6}{50}=3{,}32\times10^{-3}\ \text{mol·L}^{-1}$$

**7. Les espèces pour $V_a=10$ mL**, où le pH vaut $11{,}1$ :

$$[\mathrm{H_3O^+}]=10^{-11,1}=7{,}94\times10^{-12}\quad;\quad[\mathrm{OH^-}]=\frac{K_e}{[\mathrm{H_3O^+}]}=1{,}26\times10^{-3}\ \text{mol·L}^{-1}$$
$$[\mathrm{Na^+}]=\frac{C_bV_b}{V_a+V_b}=2{,}8\times10^{-3}\quad;\quad[\mathrm{Cl^-}]=\frac{C_aV_a}{V_a+V_b}=1{,}66\times10^{-3}\ \text{mol·L}^{-1}$$

**8. La limite du pH.** En versant l’acide en très grande quantité, le mélange n’est plus qu’une solution d’acide chlorhydrique : le pH tend vers $-\log(10^{-2})=2$.

## Partie B — Exercice 4 : identifier trois flacons

Trois flacons A, B et C contiennent, dans le désordre, une solution d’ammoniac $\mathrm{NH_3}$, une solution d’acide chlorhydrique $\mathrm{HCl}$ et une solution d’hydroxyde de **potassium** $\mathrm{KOH}$. Toutes à $C=10^{-2}$ mol·L⁻¹, à $25\,^{\circ}\mathrm{C}$.

- **Dosage 1** (A et C) : courbe **décroissante à quatre parties**, $\mathrm{pH}_E=5{,}4$
- **Dosage 2** (A et B) : courbe **décroissante à trois parties**, $\mathrm{pH}_E=7$

### Le raisonnement

**Dosage 1.** Quatre parties et deux points d’inflexion ⇒ un réactif faible est en jeu. Courbe décroissante ⇒ on verse l’acide. $\mathrm{pH}_E=5{,}4<7$ ⇒ le réactif faible était la **base**. C’est donc le dosage d’une **base faible par un acide fort** : $\mathrm{A}=\mathrm{HCl}$ et $\mathrm{C}=\mathrm{NH_3}$.
$$\mathrm{NH_3}+\mathrm{H_3O^+}\longrightarrow\mathrm{NH_4^+}+\mathrm{H_2O}$$

**Dosage 2.** Trois parties, un seul point d’inflexion, $\mathrm{pH}_E=7$ ⇒ les deux réactifs sont **forts**. Comme A est déjà l’acide chlorhydrique, $\mathrm{B}=\mathrm{KOH}$.
$$\mathrm{OH^-}+\mathrm{H_3O^+}\longrightarrow2\,\mathrm{H_2O}$$

### Le choix de l’indicateur coloré

> **La règle :** l’indicateur convient si sa **zone de virage contient le pH d’équivalence**.

| Indicateur | Zone de virage | Dosage 1 ($\mathrm{pH}_E=5{,}4$) | Dosage 2 ($\mathrm{pH}_E=7$) |
|---|---|---|---|
| Rouge de méthyle | 4,2 – 6,2 | **convient** | non |
| BBT | 6,0 – 7,6 | non | **convient** |
| Phénolphtaléine | 8,2 – 10 | non | non |

**Au point F de la courbe 1**, à la demi-équivalence, on obtient une **solution tampon** : son pH varie peu lors d’un ajout modéré d’acide ou de base, et lors d’une dilution modérée.

## Partie C — Exercice 5 : identifier une base faible

On dose $V_b=20$ cm³ d’une base faible B de concentration $C_b$ inconnue par de l’acide chlorhydrique à $C_a=10^{-1}$ mol·L⁻¹.

$$\mathrm{H_3O^+}+\mathrm{B}\longrightarrow\mathrm{BH^+}+\mathrm{H_2O}$$

**L’équivalence** se lit en $\mathrm{E}\ (V_{aE}=20\ \text{mL}\ ;\ \mathrm{pH}_E=5{,}2)$, d’où :
$$C_b=\frac{C_aV_{aE}}{V_b}=\frac{0{,}1\times20}{20}=0{,}1\ \text{mol·L}^{-1}$$

**La demi-équivalence** est en $V_a=V_{aE}/2=10$ mL, où la courbe donne $\mathrm{pH}=\mathrm{p}K_a=9{,}2$.

| Couple | pKa |
|---|---|
| Ion éthylammonium / éthylamine | 10,67 |
| Ion méthylammonium / méthylamine | 10,72 |
| **Ion ammonium / ammoniac** | **9,20** |
| Ion hydrogénocarbonate / ion carbonate | 10,3 |

$\mathrm{p}K_a=9{,}2$ ⇒ **la base faible B est l’ammoniac** $\mathrm{NH_3}$.

> **La démarche générale, à retenir pour le bac.** Le **sens** de la courbe dit qui on verse. Le **nombre de parties** dit si un réactif est faible. Le **pH à l’équivalence** dit lequel des deux l’est. Le **volume équivalent** donne la concentration. Le **pH à la demi-équivalence** donne le pKa, donc l’identité du couple. Cinq lectures, cinq informations : aucune n’est décorative.`,
    keyPoint: "Sens de la courbe ⇒ qui on verse ; nombre de parties ⇒ un réactif faible ; pHE ⇒ lequel ; VE ⇒ la concentration ; pH à VE/2 ⇒ le pKa.",
    example: "$\\mathrm{p}K_a=9{,}2$ lu à la demi-équivalence identifie sans ambiguïté le couple $\\mathrm{NH_4^+}/\\mathrm{NH_3}$ : la base dosée est l’ammoniac.",
    methodSteps: [
      "Lis le sens de la courbe pour savoir quel réactif est versé à la burette.",
      "Compte les parties : trois pour deux réactifs forts, quatre dès qu’un réactif est faible.",
      "Compare le pH d’équivalence à 7 pour savoir lequel des deux réactifs est le faible.",
      "Applique la relation d’équivalence pour obtenir la concentration inconnue.",
      "Lis le pH à la demi-équivalence, compare-le à un tableau de pKa et conclus sur l’identité du couple.",
    ],
    corrections: [
      "Page 16, exercice 4, énoncé : la troisième solution, de formule KOH, est nommée « hydroxyde de sodium ». KOH est l’hydroxyde de potassium — l’hydroxyde de sodium est NaOH. Le corrigé de la question 2.2 rétablit d’ailleurs le bon nom.",
      "Page 17, exercice 4, question 1.2 : le corrigé identifie « A et B » alors que le premier dosage, dont il est question, met en réaction A et C. Il faut lire : A est la solution d’acide chlorhydrique et C la solution d’ammoniac. Le flacon B n’est identifié qu’à la question 2.2, à partir du second dosage.",
      "Page 18, exercice 5, tableau 2 : le deuxième couple est intitulé « ion méthylammonium / éthylamine ». La base conjuguée de l’ion méthylammonium CH₃NH₃⁺ est la méthylamine CH₃NH₂, et non l’éthylamine, qui figure déjà dans la première colonne. Le pKa de 10,72 est bien celui du couple de la méthylamine.",
      "Page 14, exercice 1 : les trois questions ont un énoncé strictement identique, « Pour un acide fort S₁ et une base S₂, cette réaction est… ». Les trois corrigés (c, a, d) désignent pourtant tous « totale et exothermique », ce qui correspond aux trois combinaisons traitées par la leçon. Il faut lire : 1. acide fort et base forte, 2. acide fort et base faible, 3. acide faible et base forte — les trois étant effectivement totales et exothermiques.",
    ],
    interaction: timeline(
      [
        { label: "Lire le sens de la courbe", shortLabel: "Sens", detail: "Croissante : on verse une base sur un acide. Décroissante : on verse un acide sur une base. C’est la première lecture, et elle est gratuite." },
        { label: "Compter les parties", shortLabel: "Parties", detail: "Trois parties et un point d’inflexion : les deux réactifs sont forts. Quatre parties et deux points d’inflexion : l’un des deux est faible." },
        { label: "Situer le pH d’équivalence", shortLabel: "pH_E", detail: "pH_E = 7 : deux réactifs forts. pH_E > 7 : l’acide était faible. pH_E < 7 : la base était faible. C’est le conjugué du réactif faible qui reste seul en solution." },
        { label: "Calculer la concentration", shortLabel: "Concentration", detail: "La relation d’équivalence CaVa = CbVb donne la concentration inconnue à partir du volume équivalent lu sur la courbe." },
        { label: "Lire le pKa et identifier", shortLabel: "pKa", detail: "À la demi-équivalence, pH = pKa. Comparé à un tableau de couples, ce pKa nomme l’acide ou la base dosée : 9,2 désigne l’ammoniac." },
        { label: "Choisir l’indicateur coloré", shortLabel: "Indicateur", detail: "L’indicateur convient si sa zone de virage encadre le pH d’équivalence : rouge de méthyle (4,2–6,2) pour pH_E = 5,4, BBT (6,0–7,6) pour pH_E = 7." },
      ],
      "Les six lectures d’une courbe de dosage",
      "Suis les six lectures qui transforment une courbe en identification complète.",
      "Chaque caractéristique de la courbe porte une information distincte : sens, nombre de parties, pH d’équivalence, volume équivalent, pH de demi-équivalence, zone de virage.",
    ),
    questions: [
      short("Calcule $C_b$ pour $C_a=10^{-2}$ mol·L⁻¹, $V_{aE}=16{,}6$ mL et $V_b=50$ mL (en mol·L⁻¹).", ["3,32e-3", "3.32e-3", "3,32.10-3", "0,00332", "0.00332"], "$C_b=C_aV_{aE}/V_b=10^{-2}\\times16{,}6/50=3{,}32\\times10^{-3}$ mol·L⁻¹.", "Situation d’évaluation, question 6", 3),
      short("Vers quelle valeur tend le pH quand on ajoute l’acide ($C_a=10^{-2}$ mol·L⁻¹) en très grande quantité ?", ["2", "pH = 2"], "Le mélange tend vers la solution d’acide chlorhydrique pure : $\\mathrm{pH}=-\\log(10^{-2})=2$.", "Situation d’évaluation, question 8", 2),
      short("Pour $V_a=10$ mL, le pH vaut 11,1. Calcule $[\\mathrm{OH^-}]$ en mol·L⁻¹.", ["1,26e-3", "1.26e-3", "1,26.10-3", "0,00126", "0.00126"], "$[\\mathrm{OH^-}]=K_e/[\\mathrm{H_3O^+}]=10^{-14}/10^{-11,1}=1{,}26\\times10^{-3}$ mol·L⁻¹.", "Situation d’évaluation, question 7", 3),
      choice("Une courbe décroissante à quatre parties, avec $\\mathrm{pH}_E=5{,}4$, correspond au dosage…", ["d’une base faible par un acide fort", "d’un acide faible par une base forte", "d’une base forte par un acide fort", "d’un acide fort par une base forte"], 0, "Quatre parties ⇒ un réactif faible ; pH_E < 7 ⇒ c’est la base qui est faible.", "Exercice 4, question 1.1", 3),
      choice("Quel indicateur coloré convient pour un dosage dont le pH à l’équivalence vaut 5,4 ?", ["le rouge de méthyle (4,2 – 6,2)", "le BBT (6,0 – 7,6)", "la phénolphtaléine (8,2 – 10)", "aucun des trois"], 0, "La zone de virage doit contenir le pH d’équivalence.", "Exercice 4, question 3.2.1", 2),
      choice("Quel indicateur coloré convient pour un dosage dont le pH à l’équivalence vaut 7 ?", ["le BBT (6,0 – 7,6)", "le rouge de méthyle (4,2 – 6,2)", "la phénolphtaléine (8,2 – 10)", "aucun des trois"], 0, "Seule la zone du BBT contient la valeur 7.", "Exercice 4, question 3.2.2", 2),
      short("Dans l’exercice 5, on lit $V_{aE}=20$ mL avec $C_a=0{,}1$ mol·L⁻¹ et $V_b=20$ cm³. Calcule $C_b$ en mol·L⁻¹.", ["0,1", "0.1", "1e-1", "10-1"], "$C_b=C_aV_{aE}/V_b=0{,}1\\times20/20=0{,}1$ mol·L⁻¹.", "Exercice 5, question 3.2", 2),
      short("La demi-équivalence de l’exercice 5 donne pH $=9{,}2$. Nomme la base faible B.", ["ammoniac", "l’ammoniac", "NH3", "lammoniac"], "pH à la demi-équivalence = pKa = 9,2, qui est celui du couple $\\mathrm{NH_4^+}/\\mathrm{NH_3}$.", "Exercice 5, question 4", 3),
      choice("Quelle solution obtient-on au point F de la courbe 1 de l’exercice 4 ?", ["une solution tampon", "une solution neutre", "une solution d’acide fort", "une solution d’acide chlorhydrique pur"], 0, "F est le point de demi-équivalence : la solution y est un tampon, dont le pH résiste aux ajouts modérés.", "Exercice 4, question 4", 2),
      short("Écris l’équation-bilan du dosage de l’ammoniac par l’acide chlorhydrique de l’exercice 4.", ["NH3 + H3O+ -> NH4+ + H2O", "NH3 + H3O+ → NH4+ + H2O", "NH3 + H3O+ = NH4+ + H2O"], "L’ammoniac, base faible de type B, capte un proton.", "Exercice 4, question 1.3", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const acidBaseBuffersPath: LearningPath = {
  id: "terminale-cd-chemistry-acid-base-buffers",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Chimie générale" },
  chapterNumber: 9,
  title: "Réactions acido-basiques et solutions tampons",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Établir qu’une réaction acido-basique est exothermique et totale",
    "Exploiter une courbe de dosage : équivalence, demi-équivalence et pKa",
    "Prévoir le caractère acide, neutre ou basique du mélange à l’équivalence",
    "Reconnaître, préparer et utiliser une solution tampon",
  ],
  modules: [
    { id: "acid-base-buffers-mastery", title: "Maîtriser les dosages acido-basiques", description: "Un niveau après l’autre, de la réaction acide fort / base forte à l’identification d’une base inconnue par son pKa.", lessons: builtLevels },
  ],
};
