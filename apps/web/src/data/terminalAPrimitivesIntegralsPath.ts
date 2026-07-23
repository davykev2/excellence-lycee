import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 08 Primitives et Calcul integral.pdf";

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

interface OfficialLevelSeed {
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
  timeline: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  /** Quand une figure aide à comprendre, la courbe interactive remplace la frise de repères. */
  curve?: CurveLessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
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
      eyebrow: `Niveau ${index} • Cours officiel`,
      title: seed.title,
      explanation: seed.summary,
      bodyMarkdown: seed.body,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.curve ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Suivre le raisonnement",
      instruction: "Parcours les étapes essentielles de cette partie avant de passer à la méthode.",
      observation: "Chaque repère reprend le contenu du cours sans remplacer les définitions et propriétés.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique cette démarche aux exercices du document source.",
      steps: seed.methodSteps,
      example: {
        prompt: "Exemple du cours",
        work: seed.example,
        result: seed.keyPoint,
      },
      tip: "Écris toujours la propriété utilisée avant le calcul lorsque la consigne demande de justifier.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const levels: OfficialLevelSeed[] = [
  {
    id: "primitive-definition-usual-functions",
    title: "Définition et famille des primitives",
    summary: "Reconnaître une primitive par dérivation et décrire toutes les primitives d'une fonction.",
    pages: "1-2",
    section: "I-1. Primitives d'une fonction",
    durationMinutes: 16,
    xp: 50,
    body: String.raw`## Définition

Soit $f$ une fonction définie sur un intervalle $I$. On appelle **primitive de $f$ sur $I$** toute fonction $F$ dérivable sur $I$ telle que :

$$\text{pour tout }x\in I,\quad F'(x)=f(x)$$

**Remarque.** Si $F$ est une primitive de $f$ sur $I$, alors **toute** primitive de $f$ sur $I$ est de la forme $x\mapsto F(x)+c$, où $c\in\mathbb R$. Ajouter une constante ne change pas la dérivée.

### Exercice de fixation entièrement rédigé

Soit $f(x)=2x+5$. Parmi $F(x)=x^2$, $G(x)=x^2+5x-7$, $H(x)=x^2+5x$ et $P(x)=x^2+5x+x^3$, lesquelles sont des primitives de $f$ ?

On dérive chacune :

| Fonction | Dérivée | Est-ce $f$ ? |
|---|---|---|
| $F(x)=x^2$ | $2x$ | non |
| $G(x)=x^2+5x-7$ | $2x+5$ | **oui** |
| $H(x)=x^2+5x$ | $2x+5$ | **oui** |
| $P(x)=x^2+5x+x^3$ | $2x+5+3x^2$ | non |

**$G$ et $H$ sont des primitives de $f$.** Elles diffèrent d'une constante : $G(x)-H(x)=-7$.

> **Erreur fréquente.** Pour vérifier une primitive, on **dérive** — on ne cherche pas à « intégrer » de tête. C'est le sens de lecture le plus sûr : si $F'=f$, c'est gagné.

> **Astuce mémoire de Davy.** « Primitiver, c'est dériver à l'envers. » Et une fonction n'a jamais **une** primitive, mais une **famille entière** : toutes se déduisent l'une de l'autre par ajout d'une constante.`,
    keyPoint: "Pour vérifier qu'une fonction est une primitive, on la dérive et on compare le résultat à f.",
    example: "Pour $f(x)=2x+5$, $G(x)=x^2+5x-7$ et $H(x)=x^2+5x$ sont des primitives de $f$.",
    methodSteps: [
      "Dérive chacune des fonctions proposées.",
      "Compare chaque dérivée à f(x) sur tout l'intervalle.",
      "Garde les fonctions dont la dérivée est exactement f.",
    ],
    timeline: [
      { label: "Dériver", detail: "Calculer la dérivée de chaque candidate." },
      { label: "Comparer", detail: "La dérivée doit être exactement f." },
      { label: "Famille", detail: "Toutes les primitives diffèrent d'une constante." },
    ],
    corrections: [
      "La conclusion imprimée « G et F » est une coquille : les calculs de dérivées de la page 2 montrent qu'il faut lire « G et H », puisque F′(x) = 2x ≠ f(x).",
    ],
    questions: [
      choice("Parmi les fonctions du cours, lesquelles sont des primitives de $f(x)=2x+5$ ?", ["F seulement", "G et H", "G et P", "F, G, H et P"], 1, "$G'(x)=H'(x)=2x+5$ ; les dérivées de $F$ et $P$ sont différentes.", "Exercice de fixation, pages 1-2", 2),
      choice("Pourquoi $G$ et $H$ peuvent-elles être deux primitives de la même fonction ?", ["Elles sont égales", "Elles diffèrent d'une constante", "Leur somme est nulle", "Elles ne sont pas dérivables"], 1, "$G(x)-H(x)=-7$, une constante.", "Exercice de fixation, pages 1-2"),
      choice("$F$ est une primitive de $f$ sur $I$ signifie :", ["$f'(x)=F(x)$", "$F'(x)=f(x)$", "$F(x)=f(x)$", "$F(x)=f'(x)$"], 1, "C'est exactement la définition.", "Définition, page 1"),
      choice("$F(x)=x^3-2x^2+x-\\pi$ est-elle une primitive de $f(x)=3x^2-4x+1$ ?", ["Vrai", "Faux"], 0, "$F'(x)=3x^2-4x+1=f(x)$ ; la constante $-\\pi$ ne gêne pas.", "Exercice 1, page 8", 2),
      choice("Une primitive de $u'v+uv'$ sur un intervalle $I$ est :", ["$u\\times v$", "$u+v$", "$u/v$", "$u'v'$"], 0, "C'est exactement la dérivée d'un produit lue à l'envers.", "Exercice 1, page 9", 2),
    ],
  },
  {
    id: "primitive-initial-condition",
    title: "Primitive prenant une valeur donnée",
    summary: "Utiliser une condition en un point pour déterminer l'unique constante d'intégration.",
    pages: "2",
    section: "I-2. Primitive prenant une valeur donnée",
    durationMinutes: 15,
    xp: 55,
    body: String.raw`## Propriété

Soit $f$ admettant une primitive $F$ sur un intervalle $I$, $x_0\in I$ et $y_0\in\mathbb R$.

**Il existe une primitive de $f$ et une seule qui prend la valeur $y_0$ en $x_0$.**

La famille des primitives est $H(x)=F(x)+c$ ; la condition $H(x_0)=y_0$ donne une équation qui détermine $c$ de façon unique.

### Exercice de fixation entièrement rédigé

Soit $g$ dont une primitive est $G(x)=x^2-x$. Déterminons la primitive $H$ de $g$ qui prend la valeur $5$ en $-1$.

Les primitives de $g$ sont de la forme $H(x)=x^2-x+c$. La condition $H(-1)=5$ donne :

$$(-1)^2-(-1)+c=5\;\Longleftrightarrow\;2+c=5\;\Longleftrightarrow\;c=3$$

$$H(x)=x^2-x+3$$

**Vérification** : $H(-1)=1+1+3=5$ ✓

> **Erreur fréquente.** On oublie souvent la constante $c$ dès le départ, ou on l'ajoute après avoir déjà utilisé la condition. L'ordre est : écrire $F(x)+c$, **puis** imposer la valeur.

> **Astuce mémoire de Davy.** « Une condition, une constante. » La famille des primitives a un degré de liberté ; une seule contrainte suffit à le supprimer. Et termine toujours par la vérification — elle coûte trois secondes.`,
    keyPoint: "La condition H(x₀)=y₀ sélectionne une seule fonction dans la famille F+c.",
    example: "$G(x)=x^2-x$ et $H(-1)=5$ donnent $2+c=5$, donc $H(x)=x^2-x+3$.",
    methodSteps: [
      "Écris H(x) = F(x) + c.",
      "Remplace x par x₀ et H(x₀) par y₀.",
      "Calcule c, puis vérifie la valeur imposée.",
    ],
    timeline: [
      { label: "Famille", detail: "Écrire toutes les primitives sous la forme F + c." },
      { label: "Condition", detail: "Imposer la valeur donnée en un point." },
      { label: "Vérifier", detail: "Recalculer H(x₀) pour confirmer." },
    ],
    questions: [
      short("Dans l'exercice officiel, quelle est la valeur de $c$ ?", ["3"], "$H(-1)=(-1)^2-(-1)+c=2+c=5$.", "Exercice de fixation, page 2"),
      short("Écris la primitive particulière demandée, sans espaces.", ["x^2-x+3", "x²-x+3"], "La famille est $x^2-x+c$ et la condition impose $c=3$.", "Exercice de fixation, page 2", 2),
      choice("Combien existe-t-il de primitives de $f$ prenant une valeur donnée en un point donné ?", ["Aucune", "Exactement une", "Deux", "Une infinité"], 1, "C'est la propriété d'unicité du cours.", "Propriété, page 2"),
    ],
  },
  {
    id: "primitive-usual-functions",
    title: "Primitives des fonctions usuelles",
    summary: "Lire à l'envers les formules de dérivation des constantes, puissances entières et puissances rationnelles.",
    pages: "2",
    section: "I-3. Primitives des fonctions usuelles",
    durationMinutes: 18,
    xp: 60,
    body: String.raw`## Le tableau des primitives usuelles

| Fonction $f$ | Primitives de $f$ ($c\in\mathbb R$) | Sur l'intervalle |
|---|---|---|
| $x\mapsto a$ $(a\in\mathbb R)$ | $x\mapsto ax+c$ | $\mathbb R$ |
| $x\mapsto x^n$ $(n\in\mathbb N)$ | $x\mapsto\dfrac{x^{n+1}}{n+1}+c$ | $\mathbb R$ |
| $x\mapsto\dfrac1{x^n}$ $(n\ge2)$ | $x\mapsto-\dfrac1{(n-1)x^{n-1}}+c$ | $]-\infty;0[$ ou $]0;+\infty[$ |
| $x\mapsto x^r$ $(r\in\mathbb Q^*\setminus\{-1\})$ | $x\mapsto\dfrac{x^{r+1}}{r+1}+c$ | $[0;+\infty[$ si $r>0$, $]0;+\infty[$ si $r<0$ |

La règle générale se résume ainsi : **on augmente l'exposant de 1, puis on divise par ce nouvel exposant** — sauf pour l'exposant $-1$, qui relève du logarithme (voir plus loin).

### Exercice de fixation entièrement rédigé

Déterminons toutes les primitives sur $]0;+\infty[$ :

**a)** $f(x)=x^2$ : $F(x)=\dfrac{x^3}{3}+c$

**b)** $f(x)=\dfrac1{x^5}=x^{-5}$ : $F(x)=\dfrac{x^{-4}}{-4}+c=-\dfrac1{4x^4}+c$

**c)** $f(x)=x^{2/3}$ : $F(x)=\dfrac{x^{5/3}}{5/3}+c=\dfrac35x^{5/3}+c$

**d)** $f(x)=-3$ : $F(x)=-3x+c$

> **Erreur fréquente.** Attention au **signe** pour les puissances négatives : la primitive de $\dfrac1{x^n}$ porte un signe moins. Le réflexe de contrôle est toujours le même — dérive ta réponse et vérifie que tu retombes sur $f$.

> **Astuce mémoire de Davy.** « Exposant + 1, puis on divise par lui. » Écris d'abord chaque terme sous la forme $x^r$ (même $\dfrac1{x^5}$ devient $x^{-5}$) : la formule s'applique alors mécaniquement.`,
    keyPoint: "Augmente l'exposant de 1 puis divise par ce nouvel exposant, sauf pour l'exposant −1.",
    example: "Sur $]0;+\\infty[$, les primitives de $x^2$ sont $x^3/3+c$ et celles de $1/x^5$ sont $-1/(4x^4)+c$.",
    methodSteps: [
      "Écris chaque terme sous la forme ax^r.",
      "Applique la formule adaptée et respecte l'intervalle.",
      "Ajoute la constante c puis dérive pour contrôler.",
    ],
    timeline: [
      { label: "Réécrire", detail: "Mettre chaque terme sous la forme x^r." },
      { label: "Appliquer", detail: "Exposant + 1, puis division par ce nouvel exposant." },
      { label: "Contrôler", detail: "Dériver la réponse pour retrouver f." },
    ],
    corrections: [
      "Le tableau de la page 2 donne pour x ↦ 1/xⁿ la primitive 1/((n−1)xⁿ⁻¹) : il manque le signe moins, car la dérivée de cette expression vaut −1/xⁿ. La solution b) de l'exercice, elle, utilise bien −1/(4x⁴).",
      "La réponse c) de l'exercice de fixation donne −3x^(−1/3) pour f(x) = x^(2/3) ; or cette expression est une primitive de x^(−4/3). Avec r = 2/3, la formule du tableau donne F(x) = (3/5)x^(5/3) + c.",
    ],
    questions: [
      choice("Quelles sont les primitives de $f(x)=x^2$ ?", ["$2x+c$", "$x^3/3+c$", "$x^2/2+c$", "$3x^2+c$"], 1, "La dérivée de $x^3/3$ est $x^2$.", "Exercice de fixation, page 2"),
      choice("Quelles sont les primitives de $f(x)=1/x^5$ sur $]0;+\\infty[$ ?", ["$1/(4x^4)+c$", "$-1/(4x^4)+c$", "$\\ln x+c$", "$-5/x^6+c$"], 1, "$x^{-5}$ a pour primitive $x^{-4}/(-4)$.", "Exercice de fixation, page 2"),
      choice("Quelles sont les primitives de la fonction constante $-3$ ?", ["$-3x+c$", "$-3+c$", "$3x+c$", "$-x^3+c$"], 0, "La dérivée de $-3x+c$ vaut $-3$.", "Exercice de fixation, page 2"),
      choice("Quelles sont les primitives de $f(x)=x^{2/3}$ sur $]0;+\\infty[$ ?", ["$-3x^{-1/3}+c$", "$\\frac35x^{5/3}+c$", "$\\frac23x^{5/3}+c$", "$\\frac53x^{5/3}+c$"], 1, "$r=2/3$ donne $x^{5/3}/(5/3)=\\frac35x^{5/3}$.", "Exercice de fixation corrigé, page 2", 2),
    ],
  },
  {
    id: "primitive-sum",
    title: "Primitive d'une somme",
    summary: "Additionner des primitives terme à terme.",
    pages: "2-3",
    section: "I-6-a. Primitives de u + v",
    durationMinutes: 14,
    xp: 60,
    body: String.raw`## Propriété

Si $U$ et $V$ sont des primitives respectives de $u$ et $v$ sur un intervalle $K$, alors $U+V$ est une primitive de $u+v$ sur $K$.

Cette propriété permet de **décomposer** un polynôme ou une expression en termes simples, puis de primitiver chaque terme séparément.

### Exercice de fixation entièrement rédigé

Déterminons une primitive sur $\mathbb R$ de $f(x)=x^4+x^3$.

$f$ est la somme de $x\mapsto x^4$ et de $x\mapsto x^3$ :

- une primitive de $x^4$ est $\dfrac{x^5}{5}$ ;
- une primitive de $x^3$ est $\dfrac{x^4}{4}$.

$$F(x)=\frac{x^5}{5}+\frac{x^4}{4}$$

**Vérification** : $F'(x)=\dfrac{5x^4}{5}+\dfrac{4x^3}{4}=x^4+x^3$ ✓

> **Erreur fréquente.** Cette propriété vaut pour une **somme**, pas pour un produit ni un quotient : il n'existe aucune formule donnant « la primitive d'un produit » à partir des primitives de chaque facteur.

> **Astuce mémoire de Davy.** « Terme à terme. » Découpe l'expression en morceaux les plus simples possibles, primitive chacun, puis recolle. Un polynôme se traite ainsi sans aucune difficulté.`,
    keyPoint: "La primitive d'une somme s'obtient en additionnant une primitive de chaque terme.",
    example: "Une primitive de $x^4+x^3$ est $x^5/5+x^4/4$.",
    methodSteps: [
      "Décompose la fonction en somme.",
      "Trouve une primitive de chaque terme.",
      "Additionne les résultats et vérifie par dérivation.",
    ],
    timeline: [
      { label: "Découper", detail: "Séparer l'expression en termes simples." },
      { label: "Primitiver", detail: "Traiter chaque terme indépendamment." },
      { label: "Recoller", detail: "Additionner puis vérifier par dérivation." },
    ],
    questions: [
      choice("Une primitive de $x^4+x^3$ est :", ["$4x^3+3x^2$", "$x^5/5+x^4/4$", "$x^5+x^4$", "$x^3/3+x^2/2$"], 1, "On primitive séparément $x^4$ et $x^3$.", "Exercice de fixation, page 3", 2),
      choice("La propriété de la somme s'applique-t-elle à un produit de fonctions ?", ["Oui, de la même façon", "Non, il n'existe pas de formule analogue"], 1, "Aucune formule ne donne la primitive d'un produit à partir de celles des facteurs.", "Propriété, pages 2-3"),
    ],
  },
  {
    id: "primitive-scalar-multiple",
    title: "Primitive d'un multiple au",
    summary: "Sortir une constante multiplicative avant de chercher une primitive.",
    pages: "3",
    section: "I-6-b. Primitives de au",
    durationMinutes: 14,
    xp: 60,
    body: String.raw`## Propriété

Si $U$ est une primitive de $u$ sur un intervalle $K$, alors, pour tout réel $a$, la fonction $aU$ est une primitive de $au$ sur $K$.

Autrement dit, une **constante multiplicative traverse** l'opération de primitivation.

### Exercice de fixation entièrement rédigé

Déterminons une primitive sur $\mathbb R^*$ de $f(x)=-\dfrac{5}{2x^2}$.

$f$ est le produit de $-\dfrac52$ par la fonction $x\mapsto\dfrac1{x^2}$.

Une primitive de $\dfrac1{x^2}$ sur $\mathbb R^*$ est $-\dfrac1x$. On en déduit :

$$F(x)=-\frac52\times\left(-\frac1x\right)=\frac{5}{2x}$$

**Vérification** : $F'(x)=\dfrac52\times\left(-\dfrac1{x^2}\right)=-\dfrac5{2x^2}$ ✓

> **Erreur fréquente.** Attention à ne pas « oublier » un signe en chemin : ici deux signes moins se compensent, ce qui donne un résultat **positif**. Le contrôle par dérivation lève toute ambiguïté.

> **Astuce mémoire de Davy.** « La constante attend dehors. » Sors le coefficient, occupe-toi de la fonction, puis remets le coefficient devant le résultat.`,
    keyPoint: "Si U'=u, alors (aU)'=au.",
    example: "Une primitive de $-5/(2x^2)$ sur $\\mathbb R^*$ est $5/(2x)$.",
    methodSteps: [
      "Isole la constante a.",
      "Trouve une primitive de la fonction restante.",
      "Multiplie cette primitive par a et vérifie.",
    ],
    timeline: [
      { label: "Sortir", detail: "Extraire le coefficient constant." },
      { label: "Primitiver", detail: "Traiter la fonction seule." },
      { label: "Remettre", detail: "Multiplier le résultat par la constante." },
    ],
    questions: [
      choice("Une primitive de $-5/(2x^2)$ est :", ["$-5/(2x)$", "$5/(2x)$", "$5x/2$", "$-5/(4x^2)$"], 1, "La dérivée de $5/(2x)$ vaut $-5/(2x^2)$.", "Exercice de fixation, page 3", 2),
      choice("Une primitive de $\\dfrac1{x^2}$ sur $\\mathbb R^*$ est :", ["$-\\dfrac1x$", "$\\dfrac1x$", "$\\ln x$", "$-\\dfrac2{x^3}$"], 0, "La dérivée de $-1/x$ vaut $1/x^2$.", "Exercice de fixation, page 3"),
    ],
  },
  {
    id: "composite-primitives",
    title: "Primitive de la forme u′uᵐ",
    summary: "Reconnaître une fonction intérieure positive et sa dérivée.",
    pages: "3",
    section: "I-6-c. Primitives de u′ × uᵐ",
    durationMinutes: 18,
    xp: 70,
    body: String.raw`## Propriété

Soit $m\in\mathbb Q\setminus\{-1\}$. Si $u$ est dérivable et **strictement positive** sur un intervalle $K$, alors une primitive de $u'u^m$ sur $K$ est :

$$\frac{u^{m+1}}{m+1}$$

Le point décisif est de repérer dans l'expression le facteur $u'(x)$, éventuellement à une constante multiplicative près.

### Exercice de fixation entièrement rédigé

Déterminons une primitive sur $\mathbb R$ de $f(x)=2x(x^2+1)^8$.

La dérivée de $u(x)=x^2+1$ est $u'(x)=2x$. La fonction $f$ est donc exactement de la forme $u'u^8$ :

$$F(x)=\frac{(x^2+1)^9}{9}$$

**Vérification** : $F'(x)=\dfrac{9\times2x(x^2+1)^8}{9}=2x(x^2+1)^8$ ✓

### Exercice d'application rédigé

$f(x)=(3x+2)(3x^2+4x-7)^3$ sur $\mathbb R$. Ici $u(x)=3x^2+4x-7$ et $u'(x)=6x+4=2(3x+2)$. Donc $f=\dfrac12u'u^3$ et :

$$F(x)=\frac12\times\frac{(3x^2+4x-7)^4}{4}=\frac{(3x^2+4x-7)^4}{8}$$

> **Erreur fréquente.** Le facteur extérieur n'est pas toujours **exactement** $u'$ : il peut lui être proportionnel. Dans ce cas, on ajuste avec une constante — surtout ne pas ignorer l'écart.

> **Astuce mémoire de Davy.** « Cherche la dérivée cachée. » Regarde la parenthèse : c'est $u$. Dérive-la mentalement, puis compare avec ce qu'il y a devant. Si c'est proportionnel, tu tiens ta primitive.`,
    keyPoint: "Repère u, contrôle u′, augmente l'exposant de 1 puis divise par m+1.",
    example: "Pour $u(x)=x^2+1$, une primitive de $2x(x^2+1)^8$ est $(x^2+1)^9/9$.",
    methodSteps: [
      "Choisis u(x) et calcule u′(x).",
      "Vérifie que le facteur extérieur est bien u′, à une constante près.",
      "Applique u^(m+1)/(m+1) puis dérive pour contrôler.",
    ],
    timeline: [
      { label: "Repérer u", detail: "C'est ce qui est élevé à la puissance." },
      { label: "Dériver u", detail: "Comparer u′ au facteur extérieur." },
      { label: "Appliquer", detail: "u^(m+1)/(m+1), ajusté par la constante." },
    ],
    questions: [
      choice("Une primitive de $2x(x^2+1)^8$ est :", ["$2(x^2+1)^9$", "$(x^2+1)^9/9$", "$(x^2+1)^7/7$", "$x^2(x^2+1)^9$"], 1, "La fonction est de la forme $u'u^8$ avec $u=x^2+1$.", "Exercice de fixation, page 3", 2),
      choice("Une primitive de $(3x+2)(3x^2+4x-7)^3$ est :", ["$\\frac{(3x^2+4x-7)^4}{4}$", "$\\frac{(3x^2+4x-7)^4}{8}$", "$\\frac{(3x^2+4x-7)^4}{2}$", "$(3x^2+4x-7)^4$"], 1, "$u'=6x+4=2(3x+2)$, d'où le facteur $\\frac12$.", "Exercice 2-b, page 9", 2),
      choice("Une primitive de $\\dfrac1{(2x+5)^2}$ sur $]-\\frac52;+\\infty[$ est :", ["$-\\dfrac1{2(2x+5)}$", "$\\dfrac1{2(2x+5)}$", "$-\\dfrac1{(2x+5)}$", "$\\ln(2x+5)$"], 0, "Avec $u=2x+5$ et $m=-2$ : $\\frac12\\times\\frac{u^{-1}}{-1}$.", "Exercice 2-a, page 9", 2),
    ],
  },
  {
    id: "primitive-logarithmic-form",
    title: "Primitive de la forme u′/u",
    summary: "Utiliser le logarithme lorsque le dénominateur ne s'annule pas.",
    pages: "3-4",
    section: "I-5. Primitives de u′/u",
    durationMinutes: 20,
    xp: 75,
    body: String.raw`## Propriété

Soit $u$ dérivable sur un intervalle $K$ sur lequel elle **ne s'annule pas**. La fonction $\dfrac{u'}{u}$ admet pour primitive :

- $x\mapsto\ln(u(x))$ sur tout intervalle où $u$ est strictement **positive** ;
- $x\mapsto\ln(-u(x))$ sur tout intervalle où $u$ est strictement **négative**.

Ces deux écritures se réunissent en $\ln|u|$.

### Exercice de fixation entièrement rédigé

**1)** $f(x)=\dfrac1x$ sur $K=]0;+\infty[$. Ici $u(x)=x$, $u'(x)=1$ et $u>0$ :

$$F(x)=\ln x+c$$

**2)** $f(x)=\dfrac{5}{3-x}$ sur $K=]3;+\infty[$. Ici $u(x)=3-x$, $u'(x)=-1$ et $u<0$ sur cet intervalle. On écrit $f(x)=-5\times\dfrac{u'(x)}{u(x)}$ :

$$F(x)=-5\ln(x-3)+c$$

**3)** $f(x)=\dfrac{2x+3}{x^2+3x+5}$ sur $K=\mathbb R$. Ici $u(x)=x^2+3x+5$ et $u'(x)=2x+3$ : le numérateur est **exactement** la dérivée du dénominateur.

$$F(x)=\ln(x^2+3x+5)+c$$

*(Le trinôme $x^2+3x+5$ a pour discriminant $9-20=-11<0$ : il est strictement positif sur $\mathbb R$, ce qui autorise bien $\ln(u)$.)*

> **Erreur fréquente.** Le logarithme exige un argument **strictement positif**. Sur un intervalle où $u<0$, on écrit $\ln(-u)$ — comme au 2) où $\ln(x-3)$ apparaît, et non $\ln(3-x)$.

> **Astuce mémoire de Davy.** « Le haut est la dérivée du bas → réponse en $\ln$. » Exactement la règle de la leçon 03. Et vérifie toujours le **signe** de $u$ sur l'intervalle avant d'écrire le logarithme.`,
    keyPoint: "Sur un intervalle sans zéro de u : ∫u′/u = ln|u| + c.",
    example: "Sur $]3;+\\infty[$, les primitives de $5/(3-x)$ sont $-5\\ln(x-3)+c$.",
    methodSteps: [
      "Pose u égal au dénominateur.",
      "Compare le numérateur à u′ et ajuste la constante.",
      "Vérifie le signe de u sur l'intervalle puis écris le logarithme.",
    ],
    timeline: [
      { label: "Dénominateur", detail: "C'est lui qui joue le rôle de u." },
      { label: "Numérateur", detail: "Comparer à u′, ajuster la constante." },
      { label: "Signe", detail: "ln(u) si u > 0, ln(−u) si u < 0." },
    ],
    questions: [
      choice("Les primitives de $1/x$ sur $]0;+\\infty[$ sont :", ["$1/x+c$", "$\\ln x+c$", "$x\\ln x+c$", "$e^x+c$"], 1, "$u=x$ et $u'=1$.", "Exercice de fixation, page 4"),
      choice("Une primitive de $(2x+3)/(x^2+3x+5)$ est :", ["$2\\ln(x^2+3x+5)$", "$\\ln(x^2+3x+5)$", "$1/(x^2+3x+5)$", "$e^{x^2+3x+5}$"], 1, "Le numérateur est la dérivée exacte du dénominateur.", "Exercice de fixation, page 4", 2),
      choice("Sur $]3;+\\infty[$, une primitive de $\\dfrac5{3-x}$ est :", ["$5\\ln(3-x)$", "$-5\\ln(x-3)$", "$5\\ln(x-3)$", "$-5\\ln(3-x)$"], 1, "$u=3-x$ est négative sur cet intervalle : on écrit $\\ln(-u)=\\ln(x-3)$.", "Exercice de fixation, page 4", 2),
    ],
  },
  {
    id: "primitive-exponential-form",
    title: "Primitive de la forme u′eᵘ",
    summary: "Reconnaître la dérivée intérieure qui accompagne une exponentielle composée.",
    pages: "4-5",
    section: "I-6. Primitives de u′eᵘ",
    durationMinutes: 18,
    xp: 75,
    body: String.raw`## Propriété

Soit $u$ dérivable sur un intervalle $K$. La fonction $x\mapsto e^{u(x)}$ est une primitive sur $K$ de $x\mapsto u'(x)e^{u(x)}$, car :

$$\left(e^u\right)'=u'e^u$$

### Exercice de fixation entièrement rédigé

**1)** $f(x)=e^x$ sur $\mathbb R$. Ici $u(x)=x$ et $u'(x)=1$ :

$$F(x)=e^x+c$$

**2)** $f(x)=(2x+3)e^{x^2+3x-1}$ sur $\mathbb R$. Ici $u(x)=x^2+3x-1$ et $u'(x)=2x+3$ : le facteur extérieur est exactement $u'$.

$$F(x)=e^{x^2+3x-1}+c$$

**3)** $f(x)=4e^{4x+5}$ sur $\mathbb R$. Ici $u(x)=4x+5$ et $u'(x)=4$ :

$$F(x)=e^{4x+5}+c$$

> **Erreur fréquente.** Si le facteur extérieur **manque**, il faut le fabriquer : une primitive de $e^{4x+5}$ (sans le 4) est $\dfrac14e^{4x+5}$. Ne recopie jamais l'exponentielle telle quelle sans vérifier le coefficient.

> **Astuce mémoire de Davy.** « L'exposant est $u$ ; il faut sa dérivée devant. » Si elle y est, la primitive est l'exponentielle nue. Sinon, ajuste avec la constante qui convient.`,
    keyPoint: "La primitive de u′eᵘ est eᵘ + c.",
    example: "Une primitive de $(2x+3)e^{x^2+3x-1}$ est $e^{x^2+3x-1}$.",
    methodSteps: [
      "Lis l'exposant et pose-le égal à u(x).",
      "Calcule u′(x).",
      "Vérifie le facteur extérieur puis conserve e^(u(x)) comme primitive.",
    ],
    timeline: [
      { label: "Exposant", detail: "Poser u égal à l'exposant." },
      { label: "Dérivée", detail: "Calculer u′ et la chercher en facteur." },
      { label: "Ajuster", detail: "Compenser par une constante si besoin." },
    ],
    questions: [
      choice("Une primitive de $e^x$ est :", ["$xe^x$", "$e^x$", "$e^{x+1}/2$", "$\\ln x$"], 1, "La dérivée de $e^x$ est $e^x$.", "Exercice de fixation, page 4"),
      choice("Une primitive de $4e^{4x+5}$ est :", ["$4e^{4x+5}$", "$e^{4x+5}$", "$e^{4x+5}/4$", "$e^{x+5}$"], 1, "La dérivée de $4x+5$ vaut 4.", "Exercice de fixation, pages 4-5", 2),
      choice("Une primitive de $(2x+3)e^{x^2+3x-1}$ est :", ["$e^{x^2+3x-1}$", "$(2x+3)e^{x^2+3x-1}$", "$(x^2+3x-1)e^{x^2+3x-1}$", "$\\frac12e^{x^2+3x-1}$"], 0, "Le facteur extérieur est exactement $u'$.", "Exercice de fixation, page 4", 2),
    ],
  },
  {
    id: "definite-integral",
    title: "Définition et notation de l'intégrale",
    summary: "Calculer une intégrale comme une différence de valeurs d'une primitive.",
    pages: "5",
    section: "II-1. Définition et notation",
    durationMinutes: 18,
    xp: 70,
    body: String.raw`## Définition

Soit $f$ **continue** sur un intervalle $K$, $a$ et $b$ deux éléments de $K$ et $F$ une primitive de $f$ sur $K$. Le nombre réel $F(b)-F(a)$ **ne dépend pas** de la primitive choisie : il est appelé **intégrale de $a$ à $b$ de $f$**.

$$\int_a^bf(x)\,dx=\bigl[F(x)\bigr]_a^b=F(b)-F(a)$$

*Pourquoi le choix de $F$ est-il sans importance ?* Parce que deux primitives diffèrent d'une constante $c$, et cette constante disparaît dans la soustraction : $(F(b)+c)-(F(a)+c)=F(b)-F(a)$.

La lettre $x$ est une **variable muette** : $\displaystyle\int_0^1x^2dx$ et $\displaystyle\int_0^1z^2dz$ ont la même valeur.

### Exercice entièrement rédigé

**$I=\displaystyle\int_0^1x^2dx$** — une primitive de $x^2$ est $\dfrac{x^3}{3}$ :

$$I=\left[\frac{x^3}{3}\right]_0^1=\frac13-0=\frac13$$

**$P=\displaystyle\int_0^1z^2dz$** — la variable est muette, donc $P=I=\dfrac13$.

**$J=\displaystyle\int_3^1\left(1-\frac1t\right)dt$** — une primitive est $F(t)=t-\ln t$ :

$$J=\bigl[t-\ln t\bigr]_3^1=(1-\ln1)-(3-\ln3)=1-3+\ln3=-2+\ln3$$

> **Erreur fréquente.** L'ordre des bornes compte : ici on part de $3$ pour aller à $1$, donc on calcule $F(1)-F(3)$ — et le résultat est **négatif**. Une intégrale n'est une aire que si $f\ge0$ **et** $a\le b$.

> **Astuce mémoire de Davy.** « Borne du haut moins borne du bas. » Toujours dans cet ordre, quelle que soit leur taille respective. Et pas besoin de constante : elle s'annule.`,
    keyPoint: "Toujours calculer borne supérieure moins borne inférieure : F(b)−F(a).",
    example: "$\\int_0^1x^2dx=[x^3/3]_0^1=1/3$.",
    methodSteps: [
      "Trouve une primitive F de l'intégrande.",
      "Calcule F(b) puis F(a).",
      "Effectue F(b) − F(a) et simplifie la valeur exacte.",
    ],
    timeline: [
      { label: "Primitive", detail: "Trouver F telle que F′ = f." },
      { label: "Évaluer", detail: "Calculer F aux deux bornes." },
      { label: "Soustraire", detail: "F(b) − F(a) : la constante disparaît." },
    ],
    questions: [
      choice("Quelle est la valeur de $I=\\int_0^1x^2dx$ ?", ["$1/2$", "$1/3$", "$1$", "$3$"], 1, "Une primitive de $x^2$ est $x^3/3$.", "Exercice officiel, page 5"),
      choice("Quelle est la valeur de $P=\\int_0^1z^2dz$ ?", ["$0$", "$1/3$", "$1/2$", "Elle dépend de la lettre z"], 1, "$z$ est une variable muette : $P=I=1/3$.", "Exercice officiel, page 5"),
      short("Calcule $J=\\int_3^1\\left(1-\\frac1t\\right)dt$ sous la forme $-2+\\ln k$ : donne $k$.", ["3"], "$[t-\\ln t]_3^1=(1-0)-(3-\\ln3)=-2+\\ln3$.", "Exercice officiel, page 5", 2),
      choice("Pourquoi le résultat ne dépend-il pas de la primitive choisie ?", ["Parce que f est continue", "Parce que la constante s'annule dans la soustraction", "Parce que les bornes sont égales", "C'est une convention"], 1, "$(F(b)+c)-(F(a)+c)=F(b)-F(a)$.", "Définition, page 5", 2),
    ],
  },
  {
    id: "integral-positive-area",
    title: "Intégrale d'une fonction positive et unité d'aire",
    summary: "Relier l'intégrale à l'aire sous une courbe et convertir l'unité d'aire en cm².",
    pages: "5-6",
    section: "II-2. Interprétation graphique",
    durationMinutes: 20,
    xp: 75,
    body: String.raw`## Propriété

Si $f$ est **continue et positive** sur $[a;b]$, alors $\displaystyle\int_a^bf(x)dx$ est l'aire $\mathcal A$, **en unités d'aire**, de la partie du plan limitée par la courbe $(C_f)$, l'axe $(OI)$ et les droites d'équations $x=a$ et $x=b$.

## L'unité d'aire

Dans un repère orthogonal, l'unité d'aire est l'aire du rectangle $OIAJ$ :

$$1\,\text{u.a.}=OI\times OJ$$

Si une unité sur l'axe des abscisses représente 2 cm et une unité sur l'axe des ordonnées 3 cm, alors $1\,\text{u.a.}=6\,\text{cm}^2$.

### Exercice de fixation entièrement rédigé

Unités : 2 cm en abscisse, 3 cm en ordonnée. Soit $f(x)=2x+1$, continue et positive sur $[0;+\infty[$. Calculons en cm² l'aire limitée par la courbe, l'axe des abscisses et les droites $x=0$ et $x=5$.

L'unité d'aire vaut $2\times3=6\,\text{cm}^2$.

$$\int_0^5(2x+1)dx=\bigl[x^2+x\bigr]_0^5=(25+5)-0=30$$

$$\mathcal A=30\times6=180\,\text{cm}^2$$

> **Erreur fréquente.** L'intégrale seule donne un nombre **en unités d'aire**, pas en cm². Oublier la conversion est l'erreur la plus coûteuse de tout le chapitre : ici, on passerait de 180 cm² à 30.

> **Astuce mémoire de Davy.** « Intègre d'abord, convertis ensuite. » Deux temps bien séparés : la valeur mathématique, puis le facteur $OI\times OJ$. Et vérifie que $f$ est bien **positive** sur l'intervalle avant de parler d'aire.`,
    keyPoint: "Aire réelle = intégrale en u.a. × produit des deux unités graphiques.",
    example: "Pour $f(x)=2x+1$ sur $[0;5]$, l'intégrale vaut 30 u.a., donc l'aire vaut $30\\times6=180\\,cm^2$.",
    methodSteps: [
      "Vérifie que f est positive sur l'intervalle.",
      "Calcule l'intégrale en unités d'aire.",
      "Multiplie par l'unité horizontale puis par l'unité verticale.",
    ],
    timeline: [
      { label: "Positivité", detail: "L'interprétation en aire exige f ≥ 0." },
      { label: "Intégrer", detail: "Obtenir la valeur en unités d'aire." },
      { label: "Convertir", detail: "Multiplier par OI × OJ." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "L'aire sous f(x) = 2x + 1 entre 0 et 5",
      instruction: "Déplace le point de x = 0 à x = 5 : la zone sous la courbe est celle dont on calcule l'aire.",
      observation: "La fonction est positive sur [0 ; 5], donc l'intégrale mesure bien une aire. Elle vaut [x² + x] de 0 à 5 = 30 unités d'aire — soit 180 cm² une fois convertie avec 1 u.a. = 2 × 3 = 6 cm².",
      formula: "f(x) = 2x + 1",
      formulaTex: "f(x)=2x+1",
      rule: { kind: "linear", coefficient: 2, constant: 1 },
      window: { xMin: -1, xMax: 6, yMin: -1, yMax: 13 },
      guides: [
        { kind: "vertical", value: 0, label: "x = 0" },
        { kind: "vertical", value: 5, label: "x = 5" },
      ],
      marker: { min: 0, max: 5, step: 0.1, initial: 2.5 },
    },
    questions: [
      short("Dans l'exercice officiel, combien vaut une unité d'aire en cm² ?", ["6", "6cm2", "6cm²"], "$2\\,cm\\times3\\,cm=6\\,cm^2$.", "Exercice de fixation, page 6"),
      short("Quelle aire obtient-on pour $f(x)=2x+1$ entre 0 et 5, en cm² ?", ["180", "180cm2", "180cm²"], "$\\int_0^5(2x+1)dx=30$ puis $30\\times6=180$.", "Exercice de fixation, page 6", 2),
      choice("Quelle condition permet d'interpréter l'intégrale comme une aire ?", ["f dérivable", "f continue et positive sur $[a;b]$", "f croissante", "aucune condition"], 1, "C'est l'hypothèse explicite de la propriété.", "Propriété, page 5"),
    ],
  },
  {
    id: "integral-area",
    title: "Aire sous une courbe et entre deux courbes",
    summary: "Choisir l'intégrande positive puis calculer l'aire géométrique dans les unités demandées.",
    pages: "6-7",
    section: "II-3. Calcul d'aire",
    durationMinutes: 24,
    xp: 85,
    body: String.raw`## Aire sous une courbe

Pour $f$ continue et positive sur $[a;b]$ :

$$\mathcal A=\int_a^bf(x)\,dx\quad\text{u.a.}$$

### Exercice de fixation entièrement rédigé

Unités : 2 cm en abscisse, 4 cm en ordonnée. Soit $f(x)=x^2$ sur $[1;3]$.

$$\int_1^3x^2dx=\left[\frac{x^3}{3}\right]_1^3=9-\frac13=\frac{26}{3}$$

Une unité d'aire vaut $2\times4=8\,\text{cm}^2$ :

$$\mathcal A=\frac{26}{3}\times8=\frac{208}{3}\,\text{cm}^2$$

## Aire entre deux courbes

Pour $f$ et $g$ continues sur $[a;b]$ avec $f\ge g$ :

$$\mathcal A=\int_a^b\bigl(f(x)-g(x)\bigr)dx\quad\text{u.a.}$$

### Exercice de fixation entièrement rédigé

Soit $f(x)=x+2$ et $g(x)=x^2$, repère orthonormé d'unité 2 cm. Calculons l'aire entre les deux courbes sur $[-1;2]$.

**Étape 1 — quelle courbe est au-dessus ?** Étudions le signe de $g(x)-f(x)$ :

$$g(x)-f(x)=x^2-x-2=(x+1)(x-2)$$

| $x$ | $-\infty$ | | $-1$ | | $2$ | | $+\infty$ |
|---|---|---|---|---|---|---|---|
| $(x+1)(x-2)$ | | $+$ | $0$ | $-$ | $0$ | $+$ | |

Sur $[-1;2]$, $g(x)-f(x)\le0$, donc **$f\ge g$** : c'est la droite qui est au-dessus.

**Étape 2 — l'intégrale.**

$$\int_{-1}^2\bigl(2+x-x^2\bigr)dx=\left[2x+\frac{x^2}{2}-\frac{x^3}{3}\right]_{-1}^2=\left(4+2-\frac83\right)-\left(-2+\frac12+\frac13\right)=\frac92$$

**Étape 3 — la conversion.** Repère orthonormé d'unité 2 cm, donc $1\,\text{u.a.}=4\,\text{cm}^2$ :

$$\mathcal A=\frac92\times4=18\,\text{cm}^2$$

> **Erreur fréquente.** Intégrer $g-f$ au lieu de $f-g$ donne une aire **négative**. L'étude du signe n'est pas une formalité : c'est elle qui détermine l'ordre de la soustraction.

> **Astuce mémoire de Davy.** « Toujours : celle du haut moins celle du bas. » Si tu obtiens un résultat négatif, tu as inversé — reprends dans l'autre sens. Une aire est toujours positive.`,
    keyPoint: "Entre deux courbes, on intègre toujours fonction supérieure − fonction inférieure.",
    example: "Pour $f=x+2$ et $g=x^2$ sur $[-1;2]$, $f\\ge g$ et l'intégrale vaut $9/2$ u.a. ; avec une unité de 2 cm sur chaque axe, l'aire vaut 18 cm².",
    methodSteps: [
      "Détermine les bornes et la fonction supérieure par une étude de signe.",
      "Intègre la différence positive.",
      "Calcule la valeur exacte puis convertis les unités d'aire.",
    ],
    timeline: [
      { label: "Comparer", detail: "Étude du signe de f − g sur l'intervalle." },
      { label: "Intégrer", detail: "Toujours la supérieure moins l'inférieure." },
      { label: "Convertir", detail: "Multiplier par OI × OJ." },
    ],
    questions: [
      choice("Pour $f(x)=x^2$ sur $[1;3]$, l'intégrale en unités d'aire vaut :", ["$8/3$", "$26/3$", "$208/3$", "$9$"], 1, "$[x^3/3]_1^3=9-1/3=26/3$.", "Exercice de fixation, pages 6-7"),
      choice("Avec les unités 2 cm et 4 cm, quelle aire obtient-on ?", ["$26/3\\,cm^2$", "$52/3\\,cm^2$", "$104/3\\,cm^2$", "$208/3\\,cm^2$"], 3, "Une unité d'aire vaut $2\\times4=8\\,cm^2$ ; $(26/3)\\times8=208/3$.", "Exercice de fixation, pages 6-7", 2),
      short("Quelle est l'aire entre $x+2$ et $x^2$ sur $[-1;2]$, en cm², avec une unité graphique de 2 cm ?", ["18", "18cm2", "18cm²"], "L'intégrale de $x+2-x^2$ vaut $9/2$ et une u.a. vaut $4\\,cm^2$.", "Exercice de fixation, page 7", 2),
      choice("Sur $[-1;2]$, quelle courbe est au-dessus de l'autre ?", ["La parabole $g(x)=x^2$", "La droite $f(x)=x+2$", "Elles se croisent au milieu", "Cela dépend de x"], 1, "$g(x)-f(x)=(x+1)(x-2)\\le0$ sur $[-1;2]$.", "Exercice de fixation, page 7", 2),
    ],
  },
  {
    id: "pool-terrace-mission",
    title: "Mission finale — la terrasse et la piscine",
    summary: "Décomposer une figure réelle en aires calculables et conclure par une intégrale.",
    pages: "1, 8",
    section: "A-Situation d'apprentissage et C-Situation complexe",
    durationMinutes: 30,
    xp: 90,
    kind: "challenge",
    body: String.raw`## Mission 1 — la terrasse du professeur à la retraite

La terrasse se compose de deux parties :

- une partie **rectangulaire** $ABCD$, de largeur 2 m et de longueur 4 m ;
- une partie délimitée par une **parabole** d'équation $y=-x^2+4$ et le segment $[AB]$, avec $A(-2;0)$ et $B(2;0)$, dans un repère orthonormé d'unité 1 m.

Quelle est l'aire totale de la terrasse ?

### 1. L'aire du rectangle

$$\mathcal A_{ABCD}=AB\times AD=4\times2=8\;\text{m}^2$$

### 2. L'aire sous la parabole

La parabole coupe l'axe des abscisses en $-2$ et $2$, et $-x^2+4\ge0$ sur $[-2;2]$ : l'intégrale mesure donc bien une aire.

$$\mathcal A_{ABE}=\int_{-2}^{2}(4-x^2)\,dx=\left[4x-\frac{x^3}{3}\right]_{-2}^{2}=\left(8-\frac83\right)-\left(-8+\frac83\right)=\frac{32}{3}\;\text{m}^2$$

### 3. L'aire totale

$$\mathcal A=\frac{32}{3}+8=\frac{32+24}{3}=\frac{56}{3}\approx18{,}67\;\text{m}^2$$

**L'aire de la terrasse est de $\dfrac{56}{3}$ m², soit environ 18,67 m².**

## Mission 2 — la piscine du lycée

La situation d'apprentissage ouvrait la leçon sur la piscine de Rimon : un rectangle de **12 m sur 8 m**, dont on retire une échancrure parabolique de **4 m de large et 4 m de profondeur**.

En modélisant l'échancrure par la même parabole que ci-dessus (largeur 4, profondeur 4), son aire vaut $\dfrac{32}{3}$ m². D'où :

$$\mathcal A_{\text{piscine}}=12\times8-\frac{32}{3}=96-\frac{32}{3}=\frac{288-32}{3}=\frac{256}{3}\approx85{,}33\;\text{m}^2$$

*Remarque utile.* L'aire d'un **segment de parabole** de largeur $w$ et de hauteur $h$ vaut toujours $\dfrac23wh$ — ici $\dfrac23\times4\times4=\dfrac{32}{3}$. C'est un résultat qu'Archimède connaissait déjà, bien avant l'invention du calcul intégral.

> **Erreur fréquente.** On additionne parfois toutes les aires sans se demander si une partie doit être **retirée**. Ici, la terrasse **ajoute** la partie parabolique, alors que la piscine la **retranche** : c'est la figure, pas la formule, qui le dit.

> **Astuce mémoire de Davy.** « Découpe, calcule, recompose. » Toute figure complexe se ramène à des morceaux simples : rectangles pour la géométrie élémentaire, intégrales pour les parties courbes. Et vérifie toujours l'ordre de grandeur — 18,67 m² pour une terrasse, c'est plausible.`,
    keyPoint: "Découper la figure, calculer chaque aire, puis additionner ou soustraire selon la forme.",
    example: "Terrasse : $\\frac{32}{3}+8=\\frac{56}{3}\\approx18{,}67$ m².",
    methodSteps: [
      "Décompose la figure en parties élémentaires et courbes.",
      "Calcule chaque aire, par géométrie ou par intégrale.",
      "Additionne ou soustrais selon la figure, puis conclus avec l'unité.",
    ],
    timeline: [
      { label: "Découper", detail: "Rectangle d'un côté, partie courbe de l'autre." },
      { label: "Intégrer", detail: "L'intégrale donne l'aire de la partie courbe." },
      { label: "Recomposer", detail: "Additionner ou retrancher selon la figure." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La parabole de la terrasse : y = −x² + 4",
      instruction: "Déplace le point de A(−2 ; 0) à B(2 ; 0) : l'aire sous cet arc est celle de la partie rose.",
      observation: "La parabole coupe l'axe des abscisses en −2 et 2, et culmine à 4 en son sommet E(0 ; 4). L'aire sous l'arc vaut ∫(4 − x²)dx de −2 à 2 = 32/3 ≈ 10,67 m² — soit exactement les deux tiers du rectangle 4 × 4 qui l'encadre.",
      formula: "y = -x² + 4",
      formulaTex: "y=-x^2+4",
      rule: { kind: "quadratic", coefficient: -1, constant: 4 },
      window: { xMin: -3.5, xMax: 3.5, yMin: -1.5, yMax: 5.5 },
      guides: [
        { kind: "horizontal", value: 0, label: "segment [AB]" },
        { kind: "vertical", value: 0, label: "sommet E" },
      ],
      marker: { min: -2, max: 2, step: 0.05, initial: 0 },
    },
    corrections: [
      "La situation d'apprentissage de la page 1 (l'aire de la piscine) n'est jamais résolue dans le document. Le niveau la traite en modélisant l'échancrure par la même parabole que la situation complexe (largeur 4 m, profondeur 4 m), ce qui donne une aire de 256/3 ≈ 85,33 m².",
    ],
    questions: [
      short("Calcule l'aire du rectangle $ABCD$ de la terrasse, en m².", ["8"], "$4\\times2=8$ m².", "C-Situation complexe, page 8"),
      short("Calcule $\\int_{-2}^{2}(4-x^2)dx$.", ["32/3"], "$[4x-\\frac{x^3}{3}]_{-2}^{2}=(8-\\frac83)-(-8+\\frac83)=\\frac{32}{3}$.", "C-Situation complexe, page 8", 2),
      short("Quelle est l'aire totale de la terrasse, sous forme de fraction ?", ["56/3"], "$\\frac{32}{3}+8=\\frac{56}{3}$.", "C-Situation complexe, page 8", 2),
      short("Donne cette aire arrondie au centième, en m².", ["18,67", "18.67", "18,66", "18.66"], "$\\frac{56}{3}\\approx18{,}67$ m².", "C-Situation complexe, page 8"),
      choice("Pourquoi peut-on interpréter $\\int_{-2}^{2}(4-x^2)dx$ comme une aire ?", ["Parce que la fonction est continue et positive sur $[-2;2]$", "Parce que les bornes sont symétriques", "Parce que c'est une parabole", "Parce que le résultat est positif"], 0, "C'est l'hypothèse de la propriété d'interprétation graphique.", "Propriété, page 5", 2),
      short("Piscine : calcule l'aire du rectangle 12 m × 8 m.", ["96"], "$12\\times8=96$ m².", "A-Situation d'apprentissage, page 1"),
      short("Piscine : quelle est son aire totale, sous forme de fraction, après retrait de l'échancrure ?", ["256/3"], "$96-\\frac{32}{3}=\\frac{288-32}{3}=\\frac{256}{3}$.", "A-Situation d'apprentissage, page 1", 2),
      choice("L'aire d'un segment de parabole de largeur $w$ et de hauteur $h$ vaut :", ["$\\frac12wh$", "$\\frac23wh$", "$wh$", "$\\frac34wh$"], 1, "Résultat classique, retrouvé ici : $\\frac23\\times4\\times4=\\frac{32}{3}$.", "Généralisation de la situation complexe", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalAPrimitivesIntegralsPath: LearningPath = {
  id: "terminale-a-primitives-integrals",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 8,
  title: "Primitives et calcul intégral",
  description: "Le cours officiel intégral : définition et famille des primitives, formes usuelles et composées, intégrale définie, interprétation en aire, aire entre deux courbes et mission finale de la terrasse et de la piscine.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Déterminer des primitives",
    "Calculer une intégrale",
    "Calculer une aire sous ou entre des courbes",
  ],
  modules: [{
    id: "terminale-a-primitives-integrals-mastery",
    title: "Maîtriser les primitives et le calcul intégral",
    description: "Progression fidèle au document source ; la situation d'apprentissage de la piscine n'apparaît que dans la mission finale, en contexte d'évaluation.",
    lessons: builtLevels,
  }],
};
