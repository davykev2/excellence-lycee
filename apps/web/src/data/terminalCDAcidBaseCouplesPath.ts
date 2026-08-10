import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_CH_L9_Couple acide-base.pdf";

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
      tip: "Un acide fort a un petit pKa ; une base forte a un grand pKa. Vérifie toujours ta conclusion contre cette règle.",
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
    id: "bronsted-couples",
    title: "Brönsted : acides, bases et couples conjugués",
    summary: "Définir un acide et une base par l’échange de proton, former un couple conjugué et reconnaître le caractère amphotère de l’eau.",
    pages: "1-2",
    section: "1. Définitions selon Brönsted et 2. Notion de couple",
    durationMinutes: 22,
    xp: 45,
    body: String.raw`## Les définitions de Brönsted

> Un **acide** est une espèce chimique capable de **libérer** un ou plusieurs protons $\mathrm{H^+}$.
>
> Une **base** est une espèce chimique capable de **capter** un ou plusieurs protons $\mathrm{H^+}$.

Symboliquement :

$$\mathrm{AH \rightleftharpoons A^- + H^+}$$

Dans le sens direct, $\mathrm{AH}$ cède le proton ; dans le sens inverse, $\mathrm{A^-}$ le capte.

## Le couple acide/base

Reprenons l’équilibre déjà rencontré :

$$\mathrm{CH_3COOH + H_2O \rightleftharpoons CH_3COO^- + H_3O^+}$$

- $\mathrm{CH_3COOH}$ cède un proton : c’est un **acide** ;
- $\mathrm{CH_3COO^-}$ capte un proton : c’est une **base**.

Ces deux espèces sont dites **conjuguées** et constituent le **couple acide/base** noté $\mathrm{CH_3COOH/CH_3COO^-}$.

> Un couple acide/base est constitué de deux espèces conjuguées qui échangent un proton selon le schéma **Acide $\rightleftharpoons$ Base $+\ \mathrm{H^+}$**.

## Les exemples du cours

| Acide | Base conjuguée | Couple |
|---|---|---|
| Acide éthanoïque | ion éthanoate | $\mathrm{CH_3COOH/CH_3COO^-}$ |
| Acide méthanoïque | ion méthanoate | $\mathrm{HCOOH/HCOO^-}$ |
| Acide monochloroéthanoïque | ion monochloroéthanoate | $\mathrm{CH_2ClCOOH/CH_2ClCOO^-}$ |
| Ion ammonium | ammoniac | $\mathrm{NH_4^+/NH_3}$ |
| Ion méthylammonium | méthylamine | $\mathrm{CH_3NH_3^+/CH_3NH_2}$ |
| Ion éthylammonium | éthylamine | $\mathrm{C_2H_5NH_3^+/C_2H_5NH_2}$ |

## Les deux couples de l’eau

$$\mathrm{H_3O^+ \rightleftharpoons H_2O + H^+} \quad\Longrightarrow\quad \text{couple } \mathbf{H_3O^+/H_2O}$$
$$\mathrm{H_2O \rightleftharpoons OH^- + H^+} \quad\Longrightarrow\quad \text{couple } \mathbf{H_2O/OH^-}$$

L’eau est **base** dans le premier, **acide** dans le second. On dit qu’elle est **amphotère**, ou qu’elle est un **ampholyte**.

> **Astuce mémoire de Davy.** Pour trouver la base conjuguée d’un acide, **retire un $\mathrm{H^+}$** : la charge augmente donc d’une unité. $\mathrm{CH_3COOH}$ donne $\mathrm{CH_3COO^-}$ ; $\mathrm{NH_4^+}$ donne $\mathrm{NH_3}$. La règle marche dans les deux sens et ne demande aucune mémorisation.

> **Erreur fréquente.** Nommer « ion » une base conjuguée qui n’en est pas une. La base conjuguée de $\mathrm{(CH_3)_3NH^+}$ est $\mathrm{(CH_3)_3N}$, la **triméthylamine** — une molécule neutre, et non un ion.`,
    keyPoint: "Acide : cède $\\mathrm{H^+}$. Base : capte $\\mathrm{H^+}$. Couple conjugué : Acide $\\rightleftharpoons$ Base $+\\ \\mathrm{H^+}$. L’eau est amphotère : $\\mathrm{H_3O^+/H_2O}$ et $\\mathrm{H_2O/OH^-}$.",
    example: "$\\mathrm{CH_3COOH/CH_3COO^-}$ : l’acide éthanoïque et l’ion éthanoate diffèrent d’un seul proton.",
    methodSteps: [
      "Repère l’espèce qui cède le proton : c’est l’acide.",
      "Retire-lui un $\\mathrm{H^+}$ pour obtenir sa base conjuguée.",
      "Vérifie la charge : elle diminue d’une unité pour la base.",
      "Note le couple sous la forme Acide/Base.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Un proton, deux espèces conjuguées",
      instruction: "Sélectionne un couple pour voir comment les deux espèces s’échangent le proton.",
      observation: "Toujours la même opération : un proton en moins fait passer de l’acide à la base, et la charge baisse d’une unité. L’eau est le seul cas qui apparaît des deux côtés.",
      rootLabel: "Acide ⇌ Base + H⁺",
      rootDetail: "Quel couple observe-t-on ?",
      nodes: [
        { id: "carboxylique", group: "Couples usuels", label: "Acide éthanoïque", role: "CH₃COOH / CH₃COO⁻", detail: "L’acide cède son proton et devient l’ion éthanoate, chargé négativement. C’est le couple de référence de toute la leçon, avec un pKa de 4,8." },
        { id: "ammonium", group: "Couples usuels", label: "Ion ammonium", role: "NH₄⁺ / NH₃", detail: "Ici l’acide est un cation. En cédant son proton il devient l’ammoniac, molécule neutre. La charge passe bien de +1 à 0 : elle diminue d’une unité." },
        { id: "eau-base", group: "Les couples de l’eau", label: "H₃O⁺ / H₂O", detail: "L’ion hydronium cède un proton et redonne une molécule d’eau. Dans ce couple, l’eau joue le rôle de base.", role: "l’eau est base" },
        { id: "eau-acide", group: "Les couples de l’eau", label: "H₂O / OH⁻", detail: "La molécule d’eau cède un proton et devient l’ion hydroxyde. Dans ce couple, l’eau joue le rôle d’acide. Ce double comportement définit une espèce amphotère, ou ampholyte.", role: "l’eau est acide" },
      ],
    },
    questions: [
      choice("Selon Brönsted, un acide est une espèce capable de…", ["libérer un ou plusieurs protons", "capter un ou plusieurs protons", "libérer des ions $\\mathrm{OH^-}$"], 0, "Définition du cours.", "1.1 Définition d’un acide"),
      short("Quelle est la base conjuguée de l’acide méthanoïque $\\mathrm{HCOOH}$ ?", ["HCOO-", "hcoo-", "ion methanoate", "ion méthanoate"], "On retire un proton.", "Exercice 3 - question 2.1", 2),
      short("Quel est l’acide conjugué de l’ammoniac $\\mathrm{NH_3}$ ?", ["NH4+", "nh4+", "ion ammonium"], "On ajoute un proton.", "2.2 Exemples de couples", 2),
      short("Écris les deux couples acide/base de l’eau.", ["H3O+/H2O et H2O/OH-", "H3O+/H2O H2O/OH-", "h3o+/h2o et h2o/oh-"], "L’eau est amphotère.", "2.3 Les couples de l’eau", 3),
      choice("Comment qualifie-t-on l’eau, qui peut être acide ou base ?", ["amphotère, ou ampholyte", "indifférente", "neutre"], 0, "Double comportement.", "2.3 Les couples de l’eau", 2),
      short("Quelle est la base conjuguée de l’ion $\\mathrm{(CH_3)_3NH^+}$ ? Donne son nom.", ["trimethylamine", "triméthylamine", "la triméthylamine"], "$\\mathrm{(CH_3)_3N}$, une molécule neutre.", "Exercice 3 - question 2.1 corrigée", 3),
    ],
    corrections: [
      "Page 10, exercice 3, question 2.1 : le corrigé nomme (CH₃)₃N « ion triméthylammonium ». C’est le nom de l’acide conjugué, et (CH₃)₃N n’est pas un ion. La base conjuguée de (CH₃)₃NH⁺ est la triméthylamine, molécule neutre.",
      "Page 10, exercice 3, énoncé 2° : l’acide est écrit « CH₂ClOOH ». La formule correcte, employée dans le corrigé, est CH₂ClCOOH.",
    ],
  },
  {
    id: "acidity-constant-pka",
    title: "La constante d’acidité Ka et le pKa",
    summary: "Écrire l’expression de Ka, en déduire le pKa et établir la relation entre pH, pKa et le rapport base/acide.",
    pages: "2",
    section: "3. Constante d’acidité",
    durationMinutes: 24,
    xp: 55,
    body: String.raw`## Définition

La **constante d’acidité** $K_a$ est la constante d’équilibre qui régit l’équilibre entre un acide et sa base conjuguée en solution aqueuse.

Pour la réaction $\mathrm{A + H_2O \rightleftharpoons B + H_3O^+}$ :

$$\boxed{\;K_a = \frac{[\mathrm{B}]\,[\mathrm{H_3O^+}]}{[\mathrm{A}]}\;}$$

**Trois remarques du cours :**

- $K_a$ est **sans unité** ;
- $K_a$ **dépend de la température** ;
- $K_a$ est **indépendante des autres espèces** présentes en solution.

Cette dernière propriété est capitale : elle fait de $K_a$ une **caractéristique du couple**, mesurable dans n’importe quelle solution qui le contient.

## Le pKa

$$pK_a = -\log K_a \qquad\Longleftrightarrow\qquad K_a = 10^{-pK_a}$$

En prenant le logarithme de l’expression de $K_a$, on obtient la relation la plus utile de la leçon :

$$\boxed{\;pH = pK_a + \log\frac{[\mathrm{B}]}{[\mathrm{A}]}\;}$$

## Quelques valeurs à 25 °C

| Couple | $K_a$ | $pK_a$ |
|---|---|---|
| $\mathrm{HCOOH/HCOO^-}$ | $1{,}8\times10^{-4}$ | 3,7 |
| $\mathrm{CH_3COOH/CH_3COO^-}$ | $1{,}8\times10^{-5}$ | 4,7 |
| $\mathrm{NH_4^+/NH_3}$ | $6{,}3\times10^{-10}$ | 9,2 |
| $\mathrm{CH_3NH_3^+/CH_3NH_2}$ | $1{,}9\times10^{-11}$ | 10,7 |

Un $K_a$ **grand** correspond à un $pK_a$ **petit** : les deux varient en sens inverse, puisque le pKa est un logarithme changé de signe.

> **Astuce mémoire de Davy.** La relation $pH = pK_a + \log([\mathrm{B}]/[\mathrm{A}])$ se lit comme une balance. Quand les deux espèces sont **à égalité**, le logarithme s’annule et **$pH = pK_a$**. C’est le repère qui structure tout le reste de la leçon — domaines de prédominance, indicateurs colorés, dosages.

> **Erreur fréquente.** Confondre $K_a$ et le coefficient d’ionisation $\alpha$ de la leçon précédente. $\alpha$ dépend de la concentration de la solution ; $K_a$ n’en dépend pas. C’est pour cela que $K_a$ sert à **classer** les couples, et pas $\alpha$.`,
    keyPoint: "$K_a = [\\mathrm{B}][\\mathrm{H_3O^+}]/[\\mathrm{A}]$, sans unité, fonction de la seule température. $pK_a = -\\log K_a$ et $pH = pK_a + \\log([\\mathrm{B}]/[\\mathrm{A}])$.",
    example: "Pour $\\mathrm{CH_3COOH/CH_3COO^-}$ : $K_a = 1{,}8\\times10^{-5}$ et $pK_a = 4{,}7$.",
    methodSteps: [
      "Écris l’équilibre de l’acide avec l’eau.",
      "Place la base et $\\mathrm{H_3O^+}$ au numérateur, l’acide au dénominateur.",
      "Calcule $K_a$ à partir des concentrations, puis $pK_a = -\\log K_a$.",
      "Ou, si le pH est connu, utilise $pH = pK_a + \\log([\\mathrm{B}]/[\\mathrm{A}])$.",
    ],
    interaction: timeline(
      [
        { label: "Écrire l’équilibre", shortLabel: "Équilibre", detail: "A + H₂O ⇌ B + H₃O⁺. L’eau n’apparaît jamais dans l’expression de Ka : c’est le solvant, présent en très large excès." },
        { label: "Poser l’expression de Ka", shortLabel: "Ka", detail: "Ka = [B][H₃O⁺]/[A]. Les produits au numérateur, le réactif au dénominateur. Ka est sans unité, ne dépend que de la température, et reste indépendante des autres espèces présentes." },
        { label: "Passer au pKa", shortLabel: "pKa", detail: "pKa = −log Ka. Un Ka grand donne un pKa petit : les deux grandeurs varient en sens inverse. Le pKa est plus commode car il compare des nombres de 0 à 14." },
        { label: "En déduire la relation du pH", shortLabel: "pH", detail: "pH = pKa + log([B]/[A]). Quand base et acide sont à égalité, le logarithme s’annule et le pH vaut exactement le pKa. C’est le repère central de toute la leçon." },
      ],
      "De l’équilibre à la relation du pH",
      "Parcours les quatre étapes : la dernière relation se démontre, elle ne se mémorise pas.",
      "Ka caractérise le couple, indépendamment de la solution. C’est ce qui permet de classer les couples entre eux — ce que le coefficient d’ionisation, lui, ne permettait pas.",
    ),
    questions: [
      short("Écris l’expression de la constante d’acidité d’un couple $\\mathrm{A/B}$.", ["Ka=[B][H3O+]/[A]", "[B][H3O+]/[A]", "ka=[b][h3o+]/[a]"], "Produits au numérateur, acide au dénominateur.", "3.2 Expression du Ka", 2),
      choice("La constante $K_a$…", ["ne dépend que de la température", "dépend de la concentration de la solution", "dépend des autres espèces présentes"], 0, "Trois remarques du cours.", "3.2 Remarque", 2),
      short("Écris la relation liant le pH, le pKa et le rapport base/acide.", ["pH = pKa + log([B]/[A])", "pH=pKa+log[B]/[A]", "ph = pka + log(b/a)"], "Elle découle du logarithme de $K_a$.", "3.3 pKa", 2),
      short("Le couple $\\mathrm{CH_3COOH/CH_3COO^-}$ a $K_a = 1{,}8\\times10^{-5}$. Quel est son pKa ? (une décimale)", ["4,7", "4.7"], "$-\\log(1{,}8\\times10^{-5})$.", "3.3 Tableau des valeurs", 2),
      choice("Que vaut le pH quand la base et l’acide sont en quantités égales ?", ["$pH = pK_a$", "$pH = 7$", "$pH = pK_a + 1$"], 0, "Le logarithme du rapport s’annule.", "3.3 pKa", 2),
      choice("Quelle grandeur permet de **classer** les couples, indépendamment de la concentration ?", ["le $K_a$", "le coefficient d’ionisation $\\alpha$", "le pH"], 0, "$\\alpha$ dépend de la dilution, $K_a$ non.", "3.2 Remarque", 3),
    ],
  },
  {
    id: "pka-determination",
    title: "Déterminer le pKa d’un couple",
    summary: "Mesurer un pKa par mélange d’un acide et de sa base conjuguée, puis le vérifier graphiquement.",
    pages: "2-4",
    section: "4. Détermination du pKa du couple CH₃COOH/CH₃COO⁻",
    durationMinutes: 28,
    xp: 60,
    body: String.raw`## Le principe

On mélange un acide faible avec sa **base conjuguée** et on mesure le pH. La relation $pH = pK_a + \log([\mathrm{B}]/[\mathrm{A}])$ donne alors directement le $pK_a$.

Le point subtil est le calcul des deux concentrations dans le mélange.

## Les concentrations dans le mélange

On mélange $V_a$ d’acide éthanoïque à $C_a$ avec $V_b$ d’éthanoate de sodium à $C_b$. Trois espèces se calculent :

$$[\mathrm{Na^+}] = \frac{C_b V_b}{V_a + V_b} \qquad [\mathrm{CH_3COO^-}] \approx [\mathrm{Na^+}] \qquad [\mathrm{CH_3COOH}] = \frac{C_a V_a}{V_a + V_b}$$

> **Remarque du cours :** *tout se passe comme si $\mathrm{CH_3COOH}$ et $\mathrm{CH_3COO^-}$ ne réagissaient pas.* Chacun garde la quantité apportée, simplement diluée dans le volume total.

D’où la relation générale :

$$\frac{[\mathrm{B}]}{[\mathrm{A}]} = \frac{C_b V_b}{C_a V_a} \qquad \text{valable si } \frac{1}{10} \le \frac{C_b V_b}{C_a V_a} \le 10$$

Et lorsque les deux solutions ont la **même concentration**, cela se réduit à :

$$\frac{[\mathrm{B}]}{[\mathrm{A}]} = \frac{V_b}{V_a}$$

## L’application

$V_a = 10$ mL et $V_b = 40$ mL, **de même concentration** $10^{-2}$ mol·L⁻¹, pH mesuré $= 5{,}4$ :

$$\frac{[\mathrm{B}]}{[\mathrm{A}]} = \frac{V_b}{V_a} = 4 \quad\text{(condition vérifiée)}$$
$$pK_a = pH - \log\frac{[\mathrm{B}]}{[\mathrm{A}]} = 5{,}4 - \log 4 = \mathbf{4{,}80}$$

Valeur cohérente avec le tableau du niveau précédent, qui donne 4,7 pour ce couple.

## La vérification expérimentale

On répète l’opération en faisant varier $V_a$ et $V_b$, avec $V_a + V_b = 100$ mL constant :

| $V_a$ (mL) | 90 | 80 | 70 | 60 | 40 | 30 | 20 | 10 |
|---|---|---|---|---|---|---|---|---|
| $V_b$ (mL) | 10 | 20 | 30 | 40 | 60 | 70 | 80 | 90 |
| pH | 3,8 | 4,15 | 4,4 | 4,6 | 4,9 | 5,1 | 5,35 | 5,7 |
| $\log(V_b/V_a)$ | −0,95 | −0,6 | −0,37 | −0,18 | 0,18 | 0,37 | 0,6 | 0,95 |

Le graphe $pH = f(\log(V_b/V_a))$ est une **droite affine** d’équation $pH = \alpha \log(V_b/V_a) + \beta$ avec :

- $\alpha = 1$, le coefficient directeur ;
- $\beta = 4{,}75$, l’ordonnée à l’origine — c’est-à-dire le pH pour $\log(V_b/V_a) = 0$, donc quand $V_a = V_b$.

Par identification : $pK_a = 4{,}75$ et $K_a = 10^{-4,75} = 1{,}78\times10^{-5}$.

> **Astuce mémoire de Davy.** L’ordonnée à l’origine **est** le pKa. C’est le point où l’on a versé autant de base que d’acide : les deux espèces sont à égalité, le logarithme s’annule, et le pH lu vaut exactement le pKa. Le graphe ne fait que rendre visible la relation.`,
    keyPoint: "$[\\mathrm{B}]/[\\mathrm{A}] = C_bV_b/(C_aV_a)$, valable entre 1/10 et 10. À concentrations égales, le rapport vaut $V_b/V_a$, et $pK_a = pH - \\log(V_b/V_a)$.",
    example: "$V_a = 10$ mL, $V_b = 40$ mL de même concentration, $pH = 5{,}4$ : $pK_a = 5{,}4 - \\log 4 = 4{,}80$.",
    methodSteps: [
      "Calcule les quantités de matière d’acide et de base apportées.",
      "Forme le rapport $C_bV_b/(C_aV_a)$ et vérifie qu’il est compris entre 1/10 et 10.",
      "Applique $pK_a = pH - \\log([\\mathrm{B}]/[\\mathrm{A}])$.",
      "Contrôle le résultat contre la valeur tabulée du couple.",
    ],
    interaction: timeline(
      [
        { label: "Mélanger acide et base conjuguée", shortLabel: "Mélanger", detail: "On verse Va d’acide et Vb de sa base conjuguée. Tout se passe comme si les deux espèces ne réagissaient pas : chacune garde sa quantité, simplement diluée dans le volume total." },
        { label: "Former le rapport base sur acide", shortLabel: "Rapport", detail: "[B]/[A] = CbVb/(CaVa). Le volume total se simplifie, ce qui explique que seul le rapport compte. À concentrations égales, il se réduit à Vb/Va." },
        { label: "Vérifier la condition de validité", shortLabel: "Condition", detail: "Le rapport doit rester compris entre 1/10 et 10. Hors de cet intervalle, l’une des deux espèces est trop minoritaire et l’approximation qui néglige leur réaction ne tient plus." },
        { label: "Lire le pKa", shortLabel: "pKa", detail: "pKa = pH − log([B]/[A]). Sur le graphe pH = f(log Vb/Va), c’est l’ordonnée à l’origine : le pH obtenu quand on a versé autant de base que d’acide." },
      ],
      "Mesurer un pKa au laboratoire",
      "Parcours les quatre étapes : c’est la démarche du paragraphe 4 du cours.",
      "La condition de validité n’est pas un détail administratif : hors de l’intervalle 1/10 à 10, le pKa obtenu s’écarte nettement de la valeur tabulée.",
    ),
    questions: [
      short("Écris le rapport $[\\mathrm{B}]/[\\mathrm{A}]$ dans un mélange acide + base conjuguée.", ["CbVb/(CaVa)", "Cb.Vb/Ca.Va", "cbvb/cava"], "Le volume total se simplifie.", "4.1 Étude théorique", 2),
      choice("Entre quelles bornes le rapport $C_bV_b/(C_aV_a)$ doit-il rester ?", ["entre 1/10 et 10", "entre 1 et 10", "entre 0 et 1"], 0, "Condition de validité du cours.", "4.1 Étude théorique", 2),
      short("$V_a = 10$ mL et $V_b = 40$ mL de même concentration, $pH = 5{,}4$. Quel est le pKa ? (deux décimales)", ["4,80", "4.80", "4,8", "4.8"], "$5{,}4 - \\log 4$.", "4.1 Étude théorique", 3),
      choice("Sur le graphe $pH = f(\\log(V_b/V_a))$, que représente l’ordonnée à l’origine ?", ["le pKa du couple", "le pH de l’acide pur", "le produit ionique"], 0, "C’est le pH quand $V_a = V_b$.", "4.2.2 Exploitation", 3),
      short("Le graphe donne $\\beta = 4{,}75$. Que vaut alors $K_a$ ? (trois chiffres)", ["1,78.10-5", "1.78e-5", "1,78 10-5"], "$K_a = 10^{-4,75}$.", "4.2.2 Exploitation", 2),
      choice("Quel est le coefficient directeur de la droite $pH = f(\\log(V_b/V_a))$ ?", ["1", "0", "4,75"], 0, "La relation $pH = pK_a + \\log([\\mathrm{B}]/[\\mathrm{A}])$ est affine de pente 1.", "4.2.2 Exploitation", 2),
    ],
    corrections: [
      "Pages 2 et 3, étude théorique : l’énoncé annonce Ca = 10⁻² mol·L⁻¹ pour l’acide et Cb = 10⁻¹ mol·L⁻¹ pour la base, mais son corrigé calcule ensuite pKa = 5,4 − log 4, ce qui suppose un rapport CbVb/(CaVa) égal à 4. Avec les concentrations annoncées ce rapport vaut 40 : la condition de validité 1/10 ≤ rapport ≤ 10 serait violée, et le pKa obtenu serait 3,80, incompatible avec la valeur 4,7 du tableau du cours comme avec les 4,75 de la détermination graphique. Les deux solutions doivent donc avoir la même concentration, ce que confirme la vérification expérimentale du paragraphe 4.2 qui précise explicitement « de même concentration ». Ca = Cb = 10⁻² mol·L⁻¹ est retenu ici, d’où [Na⁺] = [CH₃COO⁻] = 8 × 10⁻³ mol·L⁻¹ et non 8 × 10⁻².",
    ],
  },
  {
    id: "predominance-indicators",
    title: "Domaines de prédominance et indicateurs colorés",
    summary: "Déterminer l’espèce prédominante selon le pH et comprendre la zone de virage d’un indicateur coloré.",
    pages: "5",
    section: "5. Domaines de prédominance",
    durationMinutes: 26,
    xp: 65,
    body: String.raw`## Lire la relation comme une balance

La relation $pH = pK_a + \log([\mathrm{B}]/[\mathrm{A}])$ permet de savoir **laquelle des deux espèces domine** :

| Comparaison | Conséquence | Espèce prédominante |
|---|---|---|
| $pH > pK_a$ | $[\mathrm{B}] > [\mathrm{A}]$ | la **base** |
| $pH = pK_a$ | $[\mathrm{B}] = [\mathrm{A}]$ | aucune, elles sont à égalité |
| $pH < pK_a$ | $[\mathrm{B}] < [\mathrm{A}]$ | l’**acide** |

Sur un axe de pH, le $pK_a$ sépare donc deux **domaines de prédominance** : l’acide à gauche, la base à droite.

## Les indicateurs colorés

Un **indicateur coloré** est une solution contenant un couple $\mathrm{HIn/In^-}$ dont les deux formes ont des **teintes différentes** :

$$\mathrm{HIn + H_2O \rightleftharpoons In^- + H_3O^+}$$

La relation devient :

$$pH = pK_{a_i} + \log\frac{[\mathrm{In^-}]}{[\mathrm{HIn}]}$$

## La zone de virage

L’expérience montre que l’œil ne perçoit qu’une seule teinte quand une forme est **dix fois** plus abondante que l’autre :

- si $[\mathrm{HIn}] > 10\,[\mathrm{In^-}]$, la **forme acide** impose sa couleur, soit $pH < pK_{a_i} - 1$ ;
- si $[\mathrm{HIn}] = [\mathrm{In^-}]$, les deux teintes se superposent ;
- si $[\mathrm{In^-}] > 10\,[\mathrm{HIn}]$, la **forme basique** impose sa couleur, soit $pH > pK_{a_i} + 1$.

L’intervalle compris entre $pK_{a_i} - 1$ et $pK_{a_i} + 1$ est la **zone de virage**, où les deux formes colorées se superposent.

## Les trois indicateurs du cours

| Indicateur | Couleur acide | Zone de virage | Couleur basique |
|---|---|---|---|
| Hélianthine | rouge | 3,1 – 4,4 | jaune |
| Bleu de bromothymol (BBT) | jaune | 6 – 7,6 | bleu |
| Phénolphtaléine | incolore | 8,2 – 10 | rouge violacée |

> **Astuce mémoire de Davy.** La zone de virage a une **largeur de deux unités de pH**, centrée sur le $pK_{a_i}$ de l’indicateur. C’est une conséquence directe du facteur 10 : un rapport de 10 correspond à une unité de logarithme, et il y en a une de chaque côté.

> **Erreur fréquente.** Croire qu’un indicateur change de couleur exactement à son $pK_a$. Le virage est **progressif** et s’étale sur toute la zone ; le $pK_a$ n’en est que le centre.`,
    keyPoint: "$pH > pK_a$ : la base prédomine. $pH < pK_a$ : l’acide prédomine. Zone de virage d’un indicateur : $pK_{a_i} \\pm 1$, soit deux unités de large.",
    example: "Le BBT vire entre 6 et 7,6 : jaune en dessous, bleu au-dessus.",
    methodSteps: [
      "Compare le pH de la solution au $pK_a$ du couple.",
      "Conclus sur l’espèce prédominante.",
      "Pour un indicateur, encadre son $pK_{a_i}$ de $\\pm 1$ pour obtenir la zone de virage.",
      "En dehors de cette zone, une seule teinte est perçue.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "L’axe des pH et le repère du pKa",
      instruction: "Sélectionne une zone pour voir quelle espèce y domine.",
      observation: "Le pKa n’est pas une frontière abrupte mais un point d’équilibre. De part et d’autre, le rapport des concentrations bascule d’un facteur 10 par unité de pH.",
      rootLabel: "Une solution contenant le couple A/B",
      rootDetail: "Où se situe son pH par rapport au pKa ?",
      nodes: [
        { id: "acide", label: "pH < pKa", role: "l’acide prédomine", detail: "[B] < [A]. Plus le pH est bas devant le pKa, plus l’acide domine. À une unité en dessous, il est dix fois plus abondant que sa base conjuguée — c’est la borne inférieure de la zone de virage d’un indicateur." },
        { id: "egalite", label: "pH = pKa", role: "égalité des deux formes", detail: "[B] = [A]. Le logarithme du rapport s’annule. C’est le point que l’on lit comme ordonnée à l’origine sur le graphe de détermination du pKa, et le centre de la zone de virage d’un indicateur coloré." },
        { id: "base", label: "pH > pKa", role: "la base prédomine", detail: "[B] > [A]. À une unité au-dessus, la base est dix fois plus abondante que l’acide : sa teinte s’impose dans le cas d’un indicateur coloré." },
      ],
    },
    questions: [
      choice("Si $pH > pK_a$, quelle espèce prédomine ?", ["la base", "l’acide", "aucune"], 0, "$[\\mathrm{B}] > [\\mathrm{A}]$.", "5.1 Domaines de prédominance"),
      choice("Si $pH < pK_a$, quelle espèce prédomine ?", ["l’acide", "la base", "aucune"], 0, "$[\\mathrm{B}] < [\\mathrm{A}]$.", "5.1 Domaines de prédominance"),
      short("Quelle est la largeur, en unités de pH, de la zone de virage d’un indicateur coloré ?", ["2", "2 unites", "2 unités", "deux"], "De $pK_{a_i}-1$ à $pK_{a_i}+1$.", "5.2.2 Zone de virage", 2),
      short("Un indicateur a $pK_{a_i} = 7$. Quelle est sa zone de virage ?", ["6 - 8", "6-8", "de 6 a 8", "de 6 à 8"], "$pK_{a_i} \\pm 1$.", "5.2.2 Zone de virage", 2),
      short("Quelle est la zone de virage du bleu de bromothymol ?", ["6 - 7,6", "6-7,6", "6 a 7,6", "6 à 7,6"], "Jaune en dessous, bleu au-dessus.", "5.2.3 Principaux indicateurs", 2),
      choice("Quelle est la couleur de la phénolphtaléine en milieu acide ?", ["incolore", "rouge violacée", "jaune"], 0, "Elle ne se colore qu’au-delà de 8,2.", "5.2.3 Principaux indicateurs", 2),
    ],
    corrections: [
      "Page 5, paragraphe 5.2.2 : le troisième cas est écrit « si [HIn] < 10[In⁻], alors la forme basique impose sa couleur ». Cette condition n’est pas le symétrique de la première et serait déjà satisfaite à l’égalité des deux formes. La condition correcte est [In⁻] > 10[HIn], soit pH > pKai + 1, ce qui donne bien une zone de virage de deux unités centrée sur le pKai.",
    ],
  },
  {
    id: "acid-base-strength",
    title: "Comparer la force de deux acides ou de deux bases",
    summary: "Déterminer les Ka de deux couples à concentrations égales et en déduire lequel est le plus fort.",
    pages: "5-7",
    section: "6. Force d’un acide faible, d’une base faible",
    durationMinutes: 30,
    xp: 75,
    body: String.raw`## Comparer deux acides

Deux solutions de **même concentration** $C = 10^{-2}$ mol·L⁻¹ :

| | Acide méthanoïque | Acide éthanoïque |
|---|---|---|
| pH mesuré | 2,9 | 3,4 |
| $[\mathrm{H_3O^+}]$ | $1{,}26\times10^{-3}$ | $3{,}98\times10^{-4}$ |
| $[\mathrm{A^-}]$ | $1{,}26\times10^{-3}$ | $3{,}98\times10^{-4}$ |
| $[\mathrm{AH}]$ | $8{,}74\times10^{-3}$ | $9{,}6\times10^{-3}$ |
| $K_a$ | $1{,}8\times10^{-4}$ | $1{,}65\times10^{-5}$ |
| $pK_a$ | **3,74** | **4,78** |

**L’interprétation.** À concentrations égales, $[\mathrm{HCOO^-}] > [\mathrm{CH_3COO^-}]$ : l’acide méthanoïque s’ionise davantage, il est donc **plus fort**.

> **De deux acides faibles, le plus fort est celui dont le couple a le plus grand $K_a$, donc le plus petit $pK_a$.**

## Comparer deux bases

Deux solutions basiques de **même concentration** $C_b = 10^{-2}$ mol·L⁻¹ :

| | Ammoniac | Méthylamine |
|---|---|---|
| pH mesuré | 10,6 | 11,3 |
| $[\mathrm{OH^-}]$ | $3{,}98\times10^{-4}$ | $2\times10^{-3}$ |
| $[\text{acide conjugué}]$ | $3{,}98\times10^{-4}$ | $2\times10^{-3}$ |
| $[\text{base}]$ | $9{,}6\times10^{-3}$ | $8\times10^{-3}$ |
| $K_a$ | $6{,}1\times10^{-10}$ | $2\times10^{-11}$ |
| $pK_a$ | **9,2** | **10,7** |

**L’interprétation.** À concentrations égales, $[\mathrm{CH_3NH_3^+}] > [\mathrm{NH_4^+}]$ : la méthylamine s’ionise davantage, elle est donc une **base plus forte**. Et l’on vérifie bien que **$K_a(\text{méthylamine}) < K_a(\text{ammoniac})$**.

> **De deux bases faibles, la plus forte est celle dont le couple a le plus petit $K_a$, donc le plus grand $pK_a$.**

## La règle générale

$$\text{Force de l'\textbf{acide}} \nearrow \text{ avec } K_a \quad\text{et}\quad \searrow \text{ avec } pK_a$$
$$\text{Force de la \textbf{base}} \searrow \text{ avec } K_a \quad\text{et}\quad \nearrow \text{ avec } pK_a$$

> **Astuce mémoire de Davy.** Un seul $K_a$ décrit **les deux membres** du couple, dans des sens opposés. Plus l’acide est fort, plus sa base conjuguée est faible — et réciproquement. Il suffit donc de retenir **une** règle, celle de l’acide, et d’inverser pour la base.

> **Erreur fréquente.** Comparer deux acides de concentrations différentes. La comparaison n’a de sens qu’à **concentration égale** : c’est la condition posée par les deux expériences du cours.`,
    keyPoint: "Acide le plus fort : plus grand $K_a$, plus petit $pK_a$. Base la plus forte : plus petit $K_a$, plus grand $pK_a$. Comparaison valable à concentrations égales.",
    example: "Acide méthanoïque $pK_a = 3{,}74$ contre acide éthanoïque $4{,}78$ : le premier est le plus fort.",
    methodSteps: [
      "Vérifie que les deux solutions ont la même concentration.",
      "Calcule les concentrations par la méthode des quatre relations.",
      "Calcule $K_a$ pour chaque couple, puis $pK_a$.",
      "Compare : petit $pK_a$ pour l’acide fort, grand $pK_a$ pour la base forte.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Un seul Ka, deux lectures opposées",
      instruction: "Sélectionne un membre du couple pour voir comment sa force se lit.",
      observation: "Le Ka appartient au couple, pas à l’une des deux espèces. C’est pourquoi il se lit dans un sens pour l’acide et dans l’autre pour la base : renforcer l’un affaiblit l’autre.",
      rootLabel: "Un couple acide/base de constante Ka",
      rootDetail: "De quel membre parle-t-on ?",
      nodes: [
        { id: "acide", label: "L’acide du couple", role: "fort si Ka grand, pKa petit", detail: "L’acide méthanoïque, pKa 3,74, est plus fort que l’acide éthanoïque, pKa 4,78. À concentrations égales, il libère davantage d’ions hydronium et son pH est plus bas." },
        { id: "base", label: "La base conjuguée", role: "forte si Ka petit, pKa grand", detail: "La méthylamine, pKa 10,7, est une base plus forte que l’ammoniac, pKa 9,2. À concentrations égales, elle libère davantage d’ions hydroxyde et son pH est plus élevé." },
        { id: "reciprocite", label: "La réciprocité", role: "acide fort ⇒ base faible", detail: "Renforcer l’acide affaiblit sa base conjuguée, et inversement. C’est une conséquence directe du fait qu’un seul Ka décrit les deux espèces. Retenir la règle de l’acide suffit : celle de la base s’en déduit par inversion." },
      ],
    },
    questions: [
      choice("De deux acides faibles, le plus fort est celui dont le couple a…", ["le plus grand $K_a$ et le plus petit $pK_a$", "le plus petit $K_a$ et le plus grand $pK_a$", "le pH le plus élevé"], 0, "Conclusion 6.1.4.", "6.1.4 Conclusion", 2),
      choice("De deux bases faibles, la plus forte est celle dont le couple a…", ["le plus petit $K_a$ et le plus grand $pK_a$", "le plus grand $K_a$ et le plus petit $pK_a$", "le pH le plus bas"], 0, "Conclusion 6.2.4.", "6.2.4 Conclusion", 2),
      short("Acide méthanoïque : $K_a = 1{,}8\\times10^{-4}$. Quel est son pKa ? (deux décimales)", ["3,74", "3.74"], "$-\\log(1{,}8\\times10^{-4})$.", "6.1.2 Exploitation", 2),
      choice("Entre l’ammoniac ($pK_a = 9{,}2$) et la méthylamine ($pK_a = 10{,}7$), quelle est la base la plus forte ?", ["la méthylamine", "l’ammoniac", "elles sont équivalentes"], 0, "La base la plus forte a le plus grand pKa.", "6.2.3 Interprétation", 3),
      choice("Exercice 2 : $K_a(\\mathrm{CH_3COOH}) = 1{,}58\\times10^{-5}$ et $K_a(\\mathrm{HSO_3^-}) = 6{,}31\\times10^{-8}$. Quel est l’acide le plus fort ?", ["l’acide éthanoïque", "l’ion hydrogénosulfite"], 0, "Le plus grand $K_a$.", "Exercice 2 - question 2.1", 2),
      choice("Exercice 2 : quelle est alors la base la plus forte ?", ["l’ion sulfite $\\mathrm{SO_3^{2-}}$", "l’ion éthanoate"], 0, "La base conjuguée de l’acide le plus faible.", "Exercice 2 - question 2.2", 3),
      choice("Pourquoi la comparaison exige-t-elle des concentrations égales ?", ["parce que le taux d’ionisation dépend de la dilution", "parce que le $K_a$ dépend de la concentration", "pour simplifier les calculs"], 0, "C’est la condition des deux expériences du cours.", "6.1.1 Expérience", 3),
    ],
    corrections: [
      "Page 7, paragraphe 6.2.3 : le document écrit « Ka₂ > Ka₁ » pour conclure que la méthylamine est la base la plus forte. Ses propres valeurs donnent pourtant Ka₂ = 2 × 10⁻¹¹ et Ka₁ = 6,1 × 10⁻¹⁰, soit Ka₂ < Ka₁. C’est bien cette inégalité inversée qui justifie la conclusion, conformément à la règle du paragraphe 6.2.4 : la base la plus forte a le plus petit Ka.",
    ],
  },
  {
    id: "couples-classification",
    title: "Classer les couples acide/base dans l’eau",
    summary: "Situer acides forts, bases fortes et espèces indifférentes sur l’échelle des pKa, entre 0 et 14.",
    pages: "7-8",
    section: "7. Classification des couples acide/base dans l’eau",
    durationMinutes: 26,
    xp: 80,
    body: String.raw`## Les couples dont l’acide est fort

La réaction d’un acide fort avec l’eau est **totale**. Tous les acides forts sont donc **plus forts que $\mathrm{H_3O^+}$**, et par conséquent :

> **$\mathrm{H_3O^+}$ est le seul acide fort qui puisse exister dans l’eau.**

Leurs bases conjuguées — $\mathrm{Cl^-}$, $\mathrm{NO_3^-}$… — **ne réagissent pas** avec l’eau. Elles sont plus faibles que $\mathrm{H_2O}$ et dites **indifférentes** dans l’eau.

## Les couples dont la base est forte

Symétriquement, la réaction d’une base forte avec l’eau est totale. Toutes les bases fortes sont **plus fortes que $\mathrm{OH^-}$**, et leurs acides conjugués sont **indifférents**, plus faibles que $\mathrm{H_2O}$.

> **Remarque du cours :** le classement **relatif** des acides forts entre eux, ou des bases fortes entre elles, est **impossible dans l’eau**. Ils y sont tous totalement dissociés : l’eau les « nivelle ».

## Les couples faibles

La réaction est **partielle** et aboutit à un équilibre caractérisé par $K_a$. Deux conséquences :

- la base conjuguée d’un **acide faible** est **faible**, et réciproquement ;
- plus un acide faible est **fort**, plus sa base conjuguée est **faible**.

## L’échelle des pKa

| $pK_a$ | Couple | Nature |
|---|---|---|
| > 14 | $\mathrm{C_2H_5OH/C_2H_5O^-}$ | acide indifférent / **base forte** |
| 14 | $\mathrm{H_2O/OH^-}$ | frontière basique |
| 10,7 | $\mathrm{CH_3NH_3^+/CH_3NH_2}$ | couple faible |
| 10,6 | $\mathrm{C_2H_5NH_3^+/C_2H_5NH_2}$ | couple faible |
| 9,2 | $\mathrm{NH_4^+/NH_3}$ · $\mathrm{HCN/CN^-}$ | couple faible |
| 4,8 | $\mathrm{CH_3COOH/CH_3COO^-}$ | couple faible |
| 4,2 | $\mathrm{C_6H_5COOH/C_6H_5COO^-}$ | couple faible |
| 3,8 | $\mathrm{HCOOH/HCOO^-}$ | couple faible |
| 3,3 | $\mathrm{HNO_2/NO_2^-}$ | couple faible |
| 3,2 | $\mathrm{HF/F^-}$ | couple faible |
| 0 | $\mathrm{H_3O^+/H_2O}$ | frontière acide |
| < 0 | $\mathrm{HCl/Cl^-}$ | **acide fort** / base indifférente |

En descendant l’échelle, la **force de l’acide croît** ; en la remontant, la **force de la base croît**.

> **Astuce mémoire de Davy.** Retiens les **deux bornes** : $pK_a = 0$ pour $\mathrm{H_3O^+/H_2O}$ et $pK_a = 14$ pour $\mathrm{H_2O/OH^-}$. Tout ce qui sort de cet intervalle est fort ou indifférent dans l’eau ; tout ce qui s’y trouve constitue un couple faible. Les deux bornes sont les deux couples de l’eau — la boucle est bouclée avec le premier niveau.

> **Erreur fréquente.** Chercher lequel de $\mathrm{HCl}$ ou de $\mathrm{HNO_3}$ est le plus fort. Dans l’eau, la question n’a pas de sens : tous deux sont totalement dissociés, et l’eau ne permet pas de les départager.`,
    keyPoint: "Dans l’eau, $\\mathrm{H_3O^+}$ est le seul acide fort et $\\mathrm{OH^-}$ la seule base forte. Les couples faibles ont un pKa entre 0 et 14 ; au-delà, les espèces sont fortes ou indifférentes.",
    example: "$\\mathrm{Cl^-}$, base conjuguée d’un acide fort, ne réagit pas avec l’eau : elle est indifférente.",
    methodSteps: [
      "Situe le pKa du couple sur l’échelle de 0 à 14.",
      "En dessous de 0 : acide fort, base indifférente.",
      "Au-dessus de 14 : base forte, acide indifférent.",
      "Entre les deux : couple faible, classable par son pKa.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "L’échelle des pKa, de 0 à 14",
      instruction: "Sélectionne une zone de l’échelle pour voir ce qui s’y trouve.",
      observation: "Les deux bornes de l’échelle sont les deux couples de l’eau. Ce n’est pas un hasard : c’est l’eau qui, en réagissant totalement, empêche de distinguer ce qui se trouve au-delà.",
      rootLabel: "Échelle des pKa dans l’eau",
      rootDetail: "Où se situe le couple étudié ?",
      nodes: [
        { id: "acides-forts", group: "Hors échelle", label: "pKa < 0", role: "acide fort, base indifférente", detail: "HCl/Cl⁻ par exemple. L’acide réagit totalement avec l’eau : il est plus fort que H₃O⁺, qui reste le seul acide fort à exister réellement en solution. Sa base conjuguée ne réagit pas : elle est indifférente." },
        { id: "faibles", group: "Sur l’échelle", label: "0 < pKa < 14", role: "couple faible", detail: "HF 3,2 ; HNO₂ 3,3 ; HCOOH 3,8 ; C₆H₅COOH 4,2 ; CH₃COOH 4,8 ; NH₄⁺ 9,2 ; CH₃NH₃⁺ 10,7. La réaction avec l’eau est partielle et aboutit à un équilibre caractérisé par Ka. Ce sont les seuls couples classables entre eux." },
        { id: "bases-fortes", group: "Hors échelle", label: "pKa > 14", role: "base forte, acide indifférent", detail: "C₂H₅OH/C₂H₅O⁻ par exemple. La base réagit totalement avec l’eau : elle est plus forte que OH⁻. Son acide conjugué ne réagit pas et reste indifférent." },
        { id: "nivellement", group: "Conséquence", label: "L’effet de nivellement", role: "classement impossible", detail: "Le classement relatif des acides forts entre eux, ou des bases fortes entre elles, est impossible dans l’eau : tous y sont totalement dissociés. Il faudrait un autre solvant pour les départager." },
      ],
    },
    questions: [
      choice("Quel est le seul acide fort qui puisse exister dans l’eau ?", ["$\\mathrm{H_3O^+}$", "$\\mathrm{HCl}$", "$\\mathrm{H_2SO_4}$"], 0, "Tous les autres y sont totalement dissociés.", "7.1 Couples dont l’acide est fort", 2),
      choice("Comment qualifie-t-on la base conjuguée d’un acide fort ?", ["indifférente", "forte", "faible"], 0, "Elle ne réagit pas avec l’eau.", "7.1 Couples dont l’acide est fort", 2),
      choice("Peut-on classer deux acides forts entre eux dans l’eau ?", ["non, c’est impossible", "oui, par leur pKa", "oui, par leur concentration"], 0, "Remarque du cours : l’eau les nivelle.", "7.2 Remarque", 3),
      short("Quel est le pKa du couple $\\mathrm{H_3O^+/H_2O}$ ?", ["0", "zero", "zéro"], "C’est la borne inférieure de l’échelle.", "7.4 Classification", 2),
      short("Quel est le pKa du couple $\\mathrm{H_2O/OH^-}$ ?", ["14", "quatorze"], "C’est la borne supérieure de l’échelle.", "7.4 Classification", 2),
      choice("Plus un acide faible est fort, sa base conjuguée est…", ["plus faible", "plus forte", "inchangée"], 0, "Un seul $K_a$ décrit les deux membres.", "7.3 Couples faibles", 2),
      choice("Entre $\\mathrm{HF}$ ($pK_a = 3{,}2$) et $\\mathrm{CH_3COOH}$ ($pK_a = 4{,}8$), lequel est le plus fort ?", ["$\\mathrm{HF}$", "$\\mathrm{CH_3COOH}$"], 0, "Le plus petit pKa.", "7.4 Classification", 2),
    ],
  },
  {
    id: "pka-determination-mission",
    title: "Mission finale : déterminer un pKa et comparer deux bases",
    summary: "Étudier un mélange base faible et acide conjugué, en tirer le pKa, puis classer deux bases par leur pKa.",
    pages: "8-12",
    section: "Situation d’évaluation et exercices 4 et 5",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

À $V_1 = 20$ mL de **méthylamine** $\mathrm{CH_3NH_2}$ à $C_1 = 0{,}1$ mol·L⁻¹, on ajoute $V_2 = 10$ mL de **chlorure de méthylammonium** $(\mathrm{CH_3NH_3^+, Cl^-})$ à $C_2 = 0{,}2$ mol·L⁻¹. Le pH du mélange vaut **10,7**.

On donne $pK_a(\mathrm{NH_4^+/NH_3}) = 9{,}2$.

## Le raisonnement

**1. L’équation.**

$$\mathrm{CH_3NH_2 + H_2O \rightleftharpoons CH_3NH_3^+ + OH^-}$$

**2. L’inventaire.** Ions : $\mathrm{OH^-}$, $\mathrm{H_3O^+}$, $\mathrm{CH_3NH_3^+}$, $\mathrm{Cl^-}$. Molécules : $\mathrm{CH_3NH_2}$, $\mathrm{H_2O}$.

**3. Les concentrations**, avec $V_T = 30$ mL :

$$[\mathrm{H_3O^+}] = 10^{-10,7} = 2\times10^{-11} \qquad [\mathrm{OH^-}] = 10^{10,7-14} = 5\times10^{-4}$$
$$[\mathrm{Cl^-}] = \frac{C_2V_2}{V_T} = \frac{0{,}2 \times 0{,}010}{0{,}030} = 6{,}67\times10^{-2} \text{ mol·L}^{-1}$$

L’**électroneutralité** $[\mathrm{CH_3NH_3^+}] + [\mathrm{H_3O^+}] = [\mathrm{OH^-}] + [\mathrm{Cl^-}]$ donne :

$$[\mathrm{CH_3NH_3^+}] \approx [\mathrm{OH^-}] + [\mathrm{Cl^-}] = 6{,}72\times10^{-2} \text{ mol·L}^{-1}$$

La **conservation de la matière** — l’azote apporté sous les deux formes :

$$[\mathrm{CH_3NH_3^+}] + [\mathrm{CH_3NH_2}] = \frac{C_1V_1 + C_2V_2}{V_T} = \frac{0{,}002 + 0{,}002}{0{,}030} = 0{,}133$$
$$[\mathrm{CH_3NH_2}] = 0{,}133 - 6{,}72\times10^{-2} = \mathbf{6{,}61\times10^{-2}} \text{ mol·L}^{-1}$$

**4. Le pKa.**

$$K_a = \frac{[\mathrm{CH_3NH_2}]\,[\mathrm{H_3O^+}]}{[\mathrm{CH_3NH_3^+}]} = \frac{6{,}61\times10^{-2} \times 2\times10^{-11}}{6{,}72\times10^{-2}} = 2\times10^{-11}$$
$$pK_a = -\log(2\times10^{-11}) = \mathbf{10{,}7}$$

**5. La comparaison des deux bases.**

$$pK_a(\mathrm{NH_4^+/NH_3}) = 9{,}2 \quad < \quad pK_a(\mathrm{CH_3NH_3^+/CH_3NH_2}) = 10{,}7$$

La base la plus forte étant celle dont le couple a le **plus grand pKa**, **la méthylamine est plus basique que l’ammoniac**. Ce résultat confirme celui du paragraphe 6.2 du cours, établi expérimentalement.

## Deux variantes

**Par une solution d’acide seul (exercice 4).** Acide éthanoïque à $C_a = 0{,}1$ mol·L⁻¹, $pH = 2{,}9$ :

$$[\mathrm{H_3O^+}] = [\mathrm{CH_3COO^-}] = 1{,}26\times10^{-3} \qquad [\mathrm{CH_3COOH}] = 0{,}1 - 1{,}26\times10^{-3} = 9{,}87\times10^{-2}$$
$$K_a = \frac{(1{,}26\times10^{-3})^2}{9{,}87\times10^{-2}} = 1{,}61\times10^{-5} \quad\Longrightarrow\quad pK_a = \mathbf{4{,}8}$$

**Par une solution de base seule (exercice 5).** Méthylamine à $C = 10^{-2}$ mol·L⁻¹, $pH = 11{,}3$ :

$$[\mathrm{H_3O^+}] = 5{,}01\times10^{-12} \quad [\mathrm{OH^-}] = 2\times10^{-3} \quad [\mathrm{CH_3NH_3^+}] \approx 2\times10^{-3} \quad [\mathrm{CH_3NH_2}] = 8\times10^{-3}$$
$$K_a = \frac{8\times10^{-3} \times 5{,}01\times10^{-12}}{2\times10^{-3}} = 2\times10^{-11} \quad\Longrightarrow\quad pK_a = \mathbf{10{,}7}$$

Le **même pKa** que la situation d’évaluation, obtenu par un chemin entièrement différent — c’est la preuve que $K_a$ ne dépend que du couple, et non de la solution.

> **Astuce mémoire de Davy.** Trois énoncés, trois solutions différentes, mais **une seule constante** par couple. Que tu partes d’un mélange tampon, d’un acide seul ou d’une base seule, tu retombes sur le même $pK_a$. C’est exactement ce que promettait la remarque du niveau 2 : $K_a$ est indépendante des autres espèces présentes.`,
    keyPoint: "Électroneutralité puis conservation donnent les deux concentrations du couple ; $K_a$ s’en déduit. Le pKa obtenu ne dépend pas du chemin suivi.",
    example: "Mélange méthylamine + chlorure de méthylammonium à pH 10,7 : $K_a = 2\\times10^{-11}$, $pK_a = 10{,}7$.",
    methodSteps: [
      "Écris l’équilibre et recense toutes les espèces.",
      "Calcule $[\\mathrm{H_3O^+}]$, $[\\mathrm{OH^-}]$ et l’ion spectateur.",
      "Applique l’électroneutralité puis la conservation de la matière.",
      "Calcule $K_a$, puis $pK_a$, et compare avec l’autre couple.",
    ],
    interaction: timeline(
      [
        { label: "Recenser et calculer les ions simples", shortLabel: "Ions", detail: "[H₃O⁺] = 10⁻ᵖᴴ = 2 × 10⁻¹¹ et [OH⁻] = 10^(pH−14) = 5 × 10⁻⁴ mol·L⁻¹. L’ion chlorure, spectateur, vaut C₂V₂/VT = 6,67 × 10⁻² mol·L⁻¹." },
        { label: "Appliquer l’électroneutralité", shortLabel: "Charges", detail: "[CH₃NH₃⁺] + [H₃O⁺] = [OH⁻] + [Cl⁻]. Le terme [H₃O⁺] étant négligeable, [CH₃NH₃⁺] ≈ 6,72 × 10⁻² mol·L⁻¹. C’est l’acide du couple." },
        { label: "Appliquer la conservation", shortLabel: "Matière", detail: "L’azote apporté se répartit entre les deux formes : [CH₃NH₃⁺] + [CH₃NH₂] = (C₁V₁ + C₂V₂)/VT = 0,133 mol·L⁻¹. D’où [CH₃NH₂] = 6,61 × 10⁻² mol·L⁻¹, la base du couple." },
        { label: "Calculer Ka et comparer", shortLabel: "pKa", detail: "Ka = [base][H₃O⁺]/[acide] = 2 × 10⁻¹¹, soit pKa = 10,7. Comme 10,7 > 9,2, la méthylamine est une base plus forte que l’ammoniac — la base la plus forte ayant le plus grand pKa." },
      ],
      "Du mélange au pKa",
      "Suis les quatre étapes : elles couvrent la situation d’évaluation comme les exercices 4 et 5.",
      "Le pKa trouvé est le même que celui obtenu à partir d’une solution de méthylamine seule. Ka caractérise le couple, pas la solution — c’est ce qui rend la mesure fiable.",
    ),
    questions: [
      short("Écris l’équation de la réaction de la méthylamine avec l’eau.", ["CH3NH2 + H2O = CH3NH3+ + OH-", "ch3nh2 + h2o = ch3nh3+ + oh-"], "Équilibre : double flèche.", "Situation d’évaluation - question 1", 2),
      short("Quelle est $[\\mathrm{Cl^-}]$ dans le mélange ? (en mol·L⁻¹, trois chiffres)", ["6,67.10-2", "6.67e-2", "6,67 10-2"], "$C_2V_2/V_T = 0{,}2 \\times 0{,}010/0{,}030$.", "Situation d’évaluation - question 2.2", 2),
      short("Quelle est $[\\mathrm{CH_3NH_3^+}]$ dans le mélange ? (en mol·L⁻¹, trois chiffres)", ["6,72.10-2", "6.72e-2", "6,72 10-2"], "Électroneutralité : $[\\mathrm{OH^-}] + [\\mathrm{Cl^-}]$.", "Situation d’évaluation - question 2.2", 3),
      short("Quel est le pKa du couple $\\mathrm{CH_3NH_3^+/CH_3NH_2}$ ? (une décimale)", ["10,7", "10.7"], "$K_a = 2\\times10^{-11}$.", "Situation d’évaluation - question 3.1", 2),
      choice("Sachant que $pK_a(\\mathrm{NH_4^+/NH_3}) = 9{,}2$, quelle est la base la plus forte ?", ["la méthylamine", "l’ammoniac", "elles sont équivalentes"], 0, "La base la plus forte a le plus grand pKa : 10,7 > 9,2.", "Situation d’évaluation - question 3.2 corrigée", 3),
      short("Exercice 4 : quelle est $[\\mathrm{CH_3COOH}]$ pour $C_a = 0{,}1$ mol·L⁻¹ et $pH = 2{,}9$ ? (trois chiffres)", ["9,87.10-2", "9.87e-2", "9,87 10-2"], "$0{,}1 - 1{,}26\\times10^{-3}$.", "Exercice 4 - question 3.2", 3),
      short("Exercice 4 : quel est le pKa du couple obtenu ? (une décimale)", ["4,8", "4.8"], "$K_a = 1{,}61\\times10^{-5}$.", "Exercice 4 - question 3.4", 2),
      short("Exercice 5 : quel pKa obtient-on pour la méthylamine seule à $10^{-2}$ mol·L⁻¹ et $pH = 11{,}3$ ? (une décimale)", ["10,7", "10.7"], "Le même que par le mélange : $K_a$ ne dépend que du couple.", "Exercice 5 - question 4", 3),
    ],
    corrections: [
      "Page 9, situation d’évaluation, question 3.2 : le corrigé conclut « NH₃ est plus basique que CH₃NH₂ » après avoir pourtant constaté que pKa(NH₄⁺/NH₃) < pKa(CH₃NH₃⁺/CH₃NH₂). Cette conclusion contredit la règle énoncée par le cours lui-même au paragraphe 6.2.4 — la base la plus forte est celle dont le couple a le plus grand pKa — ainsi que le paragraphe 6.2.3, qui établit expérimentalement que la méthylamine est plus basique que l’ammoniac. C’est donc la méthylamine, de pKa 10,7 contre 9,2, qui est la base la plus forte.",
      "Page 9, situation d’évaluation, question 2.2 : le corrigé annonce [CH₃NH₂] = 6,68 × 10⁻² mol·L⁻¹. La conservation de la matière donne 0,133 − 6,72 × 10⁻² = 6,61 × 10⁻² mol·L⁻¹. L’écart reste sans effet sur le pKa, qui vaut 10,7 dans les deux cas.",
      "Page 12, exercice 5 : le corrigé écrit « [OH⁻] ≪ [H₃O⁺] » pour justifier une approximation en milieu basique. L’inégalité est inversée : à pH 11,3, c’est [H₃O⁺] qui est négligeable devant [OH⁻].",
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const acidBaseCouplesPath: LearningPath = {
  id: "terminale-cd-chemistry-acid-base-couples",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 2, title: "Chimie générale" },
  chapterNumber: 8,
  title: "Couples acide-base : classification",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Définir un couple acide/base selon Brönsted et reconnaître les couples de l’eau",
    "Exprimer la constante d’acidité, le pKa et la relation du pH",
    "Déterminer un pKa par mélange ou par voie graphique",
    "Comparer la force de deux acides ou de deux bases et classer les couples",
  ],
  modules: [
    { id: "acid-base-couples-mastery", title: "Maîtriser les couples acide/base", description: "Un niveau après l’autre, de la définition de Brönsted à la classification des couples dans l’eau.", lessons: builtLevels },
  ],
};
