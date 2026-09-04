import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 01 Limite et continuité.pdf";

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

/**
 * Poids de progression identique à celui du générateur officiel et du registre XP
 * de l'API (`terminalCMathRewardWeight`). Le conserver garantit que la répartition
 * des 10 000 XP du parcours reste inchangée pour les élèves déjà engagés.
 */
function progressionWeight(index: number) {
  return 50 + Math.min(index, 7) * 5;
}

function officialLevel(index: number, seed: OfficialLevelSeed): LearningLesson {
  return {
    id: seed.id,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: progressionWeight(index),
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
    id: "limit-composition",
    title: "Limite d’une fonction composée",
    summary: "Enchaîner la limite de la fonction intérieure puis celle de la fonction extérieure au point obtenu.",
    pages: "1-2",
    section: "1. Limite d’une fonction composée",
    durationMinutes: 20,
    body: String.raw`## Propriété

Soient $f$ et $g$ deux fonctions numériques. $a$, $b$ et $\ell$ sont des éléments de $\mathbb{R}\cup\{-\infty;+\infty\}$.

Si $\lim_{x\to a}f(x)=b$ et $\lim_{x\to b}g(x)=\ell$, alors :

$$\lim_{x\to a}g\circ f(x)=\ell$$

### Lire la propriété comme un relais

La composée se calcule en **deux temps**, jamais en un seul :

| Étape | Ce que l’on calcule | Résultat |
|---|---|---|
| 1 | La limite de la fonction **intérieure** $f$ en $a$ | $b$ |
| 2 | La limite de la fonction **extérieure** $g$ au point $b$ | $\ell$ |

Le nombre $b$ obtenu à l’étape 1 devient le point vers lequel tend la variable à l’étape 2. C’est un relais : la sortie de $f$ est l’entrée de $g$.

### Exemple du cours entièrement rédigé

Calcul de $\lim_{x\to+\infty}\sqrt{4+\dfrac{2}{x^2+1}}$.

On pose $f(x)=4+\dfrac{2}{x^2+1}$ et $g(x)=\sqrt{x}$, de sorte que $h=g\circ f$.

- **Étape 1 :** $\lim_{x\to+\infty}\dfrac{2}{x^2+1}=\lim_{x\to+\infty}\dfrac{2}{x^2}=0$, donc $\lim_{x\to+\infty}f(x)=4$.
- **Étape 2 :** $\lim_{x\to4}\sqrt{x}=2$.

$$\lim_{x\to+\infty}h(x)=2$$

### Deuxième exemple : une limite trigonométrique

Pour $f(x)=\dfrac{\sin 2x}{x}$, on écrit $f(x)=2\times\dfrac{\sin(2x)}{2x}$. En posant $v(x)=2x$ et $u(x)=2\times\dfrac{\sin x}{x}$ :

$\lim_{x\to0}v(x)=0$ et $\lim_{x\to0}u(x)=2$ (car $\dfrac{\sin x}{x}\to1$), donc $\lim_{x\to0}f(x)=2$.

> **Astuce mémoire.** La limite de référence $\lim_{x\to0}\dfrac{\sin x}{x}=1$ revient sans cesse. Pour $\dfrac{\sin(kx)}{x}$, fais apparaître $kx$ au dénominateur : $\dfrac{\sin(kx)}{x}=k\times\dfrac{\sin(kx)}{kx}\to k$.

> **Erreur fréquente.** Ne remplace jamais $x$ directement dans $g$ sans passer par $b$. Ici, faire tendre $x$ vers $+\infty$ dans $\sqrt{x}$ donnerait $+\infty$, ce qui est faux : c’est bien vers $4$ que tend l’intérieur.`,
    keyPoint: "Composée : limite de l’intérieure d’abord, puis limite de l’extérieure au point obtenu.",
    example: "Pour $h(x)=\\sqrt{4+\\frac{2}{x^2+1}}$ : l’intérieur tend vers 4 et $\\sqrt{4}=2$, donc $h(x)\\to2$.",
    methodSteps: [
      "Identifie la fonction intérieure f et la fonction extérieure g.",
      "Calcule la limite b de f au point demandé.",
      "Calcule la limite de g lorsque sa variable tend vers b.",
      "Conclus : cette dernière valeur est la limite de la composée.",
    ],
    timeline: [
      { label: "Décomposer", detail: "Reconnaître g∘f et nommer les deux fonctions." },
      { label: "Intérieure", detail: "Calculer la limite b de f en a." },
      { label: "Extérieure", detail: "Calculer la limite de g en b." },
      { label: "Conclure", detail: "La limite de la composée est cette valeur." },
    ],
    questions: [
      short("Calcule $\\lim_{x\\to+\\infty}\\sqrt{4+\\frac{2}{x^2+1}}$.", ["2"], "L’intérieur tend vers 4 et $\\sqrt4=2$.", "Exercice de fixation - question 1", 2),
      short("Calcule $\\lim_{x\\to0}\\frac{\\sin 2x}{x}$.", ["2"], "On écrit $2\\times\\frac{\\sin 2x}{2x}$, et $\\frac{\\sin t}{t}\\to1$.", "Exercice de fixation - question 2", 2),
      short("D’après le tableau de variation de l’exercice résolu 1, donne $\\lim_{x\\to-\\infty}f(x^2)$.", ["1"], "$x^2\\to+\\infty$ et $\\lim_{x\\to+\\infty}f(x)=1$.", "D-Exercice résolu 1"),
      short("Toujours d’après ce tableau, donne $\\lim_{x\\to0^+}f\\left(\\frac{-1}{x}\\right)$.", ["-2"], "$\\frac{-1}{x}\\to-\\infty$ et $\\lim_{x\\to-\\infty}f(x)=-2$.", "D-Exercice résolu 1"),
      short("Donne $\\lim_{x\\to+\\infty}f\\left(\\frac{2x-1}{x^2+x}\\right)$ sachant que $\\lim_{x\\to0^+}f(x)=+\\infty$.", ["+∞", "+infini"], "Le quotient tend vers 0 par valeurs positives, et f tend vers +∞ en 0⁺.", "D-Exercice résolu 1", 2),
      short("Calcule $\\lim_{x\\to-\\infty}\\frac{\\sqrt{x^2+1}}{x}$.", ["-1"], "En $-\\infty$, $\\sqrt{x^2}=|x|=-x$, donc le quotient tend vers $-1$.", "D-Exercice résolu 2", 2),
      short("Calcule $\\lim_{x\\to+\\infty}\\frac{\\sin(x^5)}{x}$.", ["0"], "Le sinus est borné entre -1 et 1 ; l’encadrement par $\\pm\\frac1x$ donne 0.", "D-Exercice résolu 2", 2),
    ],
  },
  {
    id: "monotone-finite-limit",
    title: "Limite d’une fonction monotone sur un intervalle ouvert",
    summary: "Une fonction croissante et majorée, ou décroissante et minorée, admet une limite finie à la borne visée.",
    pages: "2-3",
    section: "2. Limite d’une fonction monotone sur un intervalle ouvert",
    durationMinutes: 22,
    body: String.raw`## Propriété 1 — croissante et majorée

$a$ et $b$ sont des éléments de $\mathbb{R}\cup\{-\infty;+\infty\}$ et $f$ une fonction numérique.

Si $f$ est **croissante et majorée** par un nombre réel $M$ sur l’intervalle $]a,b[$, alors $f$ admet une **limite finie** $\ell$ en $b$. De plus $\ell\le M$.

## Propriété 2 — décroissante et minorée

Si $f$ est **décroissante et minorée** par un nombre réel $m$ sur $]a,b[$, alors $f$ admet une **limite finie** $\ell$ en $b$. De plus $\ell\ge m$.

### Les deux situations en un tableau

| Hypothèses sur $]a,b[$ | Conclusion en $b$ | Comparaison |
|---|---|---|
| $f$ croissante et majorée par $M$ | limite finie $\ell$ | $\ell\le M$ |
| $f$ décroissante et minorée par $m$ | limite finie $\ell$ | $\ell\ge m$ |

> **Pourquoi ça marche.** Une fonction croissante ne peut que monter ; si un plafond l’empêche de dépasser $M$, elle est obligée de se stabiliser. La monotonie donne le sens, la borne empêche de partir à l’infini. **Les deux hypothèses sont indispensables** : croissante sans majorant, $f$ peut tendre vers $+\infty$.

> **Astuce mémoire de Davy.** « Elle monte avec un plafond, elle se stabilise ; elle descend avec un plancher, elle se stabilise. » Associe toujours **croissante** à **majorée**, et **décroissante** à **minorée**.

### Exemple du cours

Soit $f$ définie sur $\mathbb{R}$ avec $f(0)=0$ et $f'(x)=\dfrac{1}{1+x^2}$. On sait que pour tout $x\in[1;+\infty[$ :

$$f(1)\le f(x)\le -\frac1x+1+f(1)$$

Comme $f'(x)>0$, $f$ est strictement croissante sur $[1;+\infty[$. De plus $-\dfrac1x\le0$, donc $f(x)\le 1+f(1)$ : $f$ est **majorée**.

$f$ est croissante et majorée, donc elle admet une limite finie $\ell$ en $+\infty$, avec :

$$f(1)\le\ell\le 1+f(1)$$

> **Erreur fréquente.** La propriété donne l’**existence** de la limite, pas sa valeur. Elle permet d’affirmer « $\ell$ existe et $\ell\le M$ » sans jamais calculer $\ell$.`,
    keyPoint: "Croissante + majorée ⇒ limite finie ℓ ≤ M. Décroissante + minorée ⇒ limite finie ℓ ≥ m.",
    example: "$f$ croissante sur $[1;+\\infty[$ et majorée par $1+f(1)$ admet une limite finie $\\ell$ avec $f(1)\\le\\ell\\le1+f(1)$.",
    methodSteps: [
      "Établis le sens de variation, en général par le signe de la dérivée.",
      "Cherche un majorant (cas croissant) ou un minorant (cas décroissant) sur l’intervalle.",
      "Conclus à l’existence d’une limite finie à la borne visée.",
      "Encadre cette limite à l’aide de la borne trouvée.",
    ],
    timeline: [
      { label: "Variation", detail: "Déterminer le sens de variation sur l’intervalle." },
      { label: "Borne", detail: "Trouver un majorant ou un minorant." },
      { label: "Existence", detail: "Conclure que la limite finie existe." },
      { label: "Encadrer", detail: "Comparer la limite à la borne." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La mise au point du club photo",
      instruction: "Éloigne le sujet photographié : jusqu’où la distance de mise au point peut-elle monter ?",
      observation: "P(x) est croissante et majorée par 10 : elle ne peut que se stabiliser. La distance de mise au point tend vers 10 mètres, sans jamais les atteindre.",
      formula: "P(x) = 10x / (5 + x)",
      formulaTex: "P(x)=\\frac{10x}{5+x}",
      rule: { kind: "rational-linear", numerator: [10, 0], denominator: [1, 5] },
      window: { xMin: 0, xMax: 120, yMin: 0, yMax: 12 },
      guides: [{ kind: "horizontal", value: 10, label: "y = 10" }],
      marker: { min: 0, max: 120, step: 1, initial: 5 },
    },
    questions: [
      choice("Une fonction croissante sur $]a,b[$ admet toujours une limite finie en $b$.", ["Vrai", "Faux"], 1, "Sans majorant, elle peut tendre vers $+\\infty$. La borne est indispensable.", "Contrôle de la propriété 1"),
      choice("Si $f$ est croissante et majorée par $M$ sur $]a,b[$, sa limite $\\ell$ en $b$ vérifie $\\ell\\le M$.", ["Vrai", "Faux"], 0, "C’est exactement la conclusion de la propriété 1.", "Propriété 1"),
      choice("Si $f$ est décroissante et minorée par $m$, sa limite $\\ell$ vérifie…", ["$\\ell\\ge m$", "$\\ell\\le m$", "$\\ell=m$"], 0, "Une fonction décroissante reste au-dessus de son minorant.", "Propriété 2"),
      short("Dans l’exercice du cours, entre quelles valeurs est encadrée la limite $\\ell$ ? Donne le majorant.", ["1+f(1)", "1 + f(1)"], "L’encadrement obtenu est $f(1)\\le\\ell\\le1+f(1)$.", "Exercice de fixation", 2),
      short("Un objet refroidit selon $f(t)=\\frac{200}{t}+10$. Calcule $\\lim_{t\\to+\\infty}f(t)$ en °C.", ["10", "10°C", "10 °C"], "$\\frac{200}{t}\\to0$ : la température se stabilise à 10 °C. La fonction est décroissante et minorée par 10.", "C-Situation complexe 1", 2),
      short("Pour la mise au point $P=\\frac{10x}{5+x}$, calcule $\\lim_{x\\to+\\infty}P$ en mètres.", ["10", "10m", "10 m"], "Les degrés sont égaux : la limite est le quotient $\\frac{10}{1}=10$ mètres.", "C-Situation complexe 2", 2),
    ],
  },
  {
    id: "parabolic-branches",
    title: "Branches paraboliques",
    summary: "Comparer f(x) et f(x)/x à l’infini pour préciser la direction d’une branche infinie.",
    pages: "3-4",
    section: "3. Branches paraboliques",
    durationMinutes: 24,
    kind: "graph",
    body: String.raw`## Définition

Soit $f$ une fonction numérique et $(C)$ sa courbe représentative dans un repère $(O,I,J)$.

- $(C)$ admet en $+\infty$ une **branche parabolique de direction celle de $(OI)$** — l’axe des abscisses — lorsque
$$\lim_{x\to+\infty}f(x)=\pm\infty\quad\text{et}\quad\lim_{x\to+\infty}\frac{f(x)}{x}=0$$
- $(C)$ admet en $+\infty$ une **branche parabolique de direction celle de $(OJ)$** — l’axe des ordonnées — lorsque
$$\lim_{x\to+\infty}f(x)=\pm\infty\quad\text{et}\quad\lim_{x\to+\infty}\frac{f(x)}{x}=\pm\infty$$

**Remarque.** On définit de manière analogue les branches paraboliques en $-\infty$.

### Reconnaître la branche en deux calculs

| $\lim f(x)$ | $\lim \dfrac{f(x)}{x}$ | Conclusion |
|---|---|---|
| $\pm\infty$ | $0$ | branche parabolique de direction $(OI)$ |
| $\pm\infty$ | $\pm\infty$ | branche parabolique de direction $(OJ)$ |
| $\pm\infty$ | $a$ réel non nul | direction asymptotique de pente $a$ ; étudier $f(x)-ax$ |

> **Comment l’interpréter ?** Le rapport $\dfrac{f(x)}{x}$ mesure la **pente moyenne** depuis l’origine. S’il tend vers $0$, la courbe s’aplatit et se couche vers l’axe des abscisses. S’il tend vers l’infini, elle se redresse vers l’axe des ordonnées.

> **Astuce mémoire de Davy.** Regarde seulement $\dfrac{f(x)}{x}$ : **0 couche** la branche vers $(OI)$ ; **l’infini redresse** la branche vers $(OJ)$.

### Exemple du cours

Soit $f(x)=\dfrac{2}{x-1}-\sqrt{x+1}$, définie sur $[-1;1[\cup]1;+\infty[$.

- $\lim_{x\to+\infty}\dfrac{2}{x-1}=0$ et $\lim_{x\to+\infty}\sqrt{x+1}=+\infty$, donc $\lim_{x\to+\infty}f(x)=-\infty$.
- $\dfrac{f(x)}{x}=\dfrac{2}{x^2-x}-\dfrac{\sqrt{x+1}}{x}$, et ces deux termes tendent vers $0$.

Donc $(C)$ admet en $+\infty$ une branche parabolique de direction celle de $(OI)$.`,
    keyPoint: "f(x)→±∞ avec f(x)/x→0 : direction (OI). Avec f(x)/x→±∞ : direction (OJ).",
    example: "Pour $f(x)=x^2$ : $f(x)\\to+\\infty$ et $\\frac{f(x)}{x}=x\\to+\\infty$, donc branche parabolique de direction $(OJ)$.",
    methodSteps: [
      "Vérifie d’abord que f(x) tend vers +∞ ou -∞.",
      "Calcule ensuite la limite du quotient f(x)/x.",
      "Si ce quotient tend vers 0, la direction est celle de l’axe des abscisses (OI).",
      "S’il tend vers l’infini, la direction est celle de l’axe des ordonnées (OJ).",
    ],
    timeline: [
      { label: "Limite de f", detail: "Vérifier qu’elle est infinie." },
      { label: "Quotient", detail: "Calculer la limite de f(x)/x." },
      { label: "Direction", detail: "0 donne (OI), l’infini donne (OJ)." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Une branche parabolique de direction (OJ)",
      instruction: "Éloigne le point vers la droite : la courbe se redresse-t-elle vers le haut ou se couche-t-elle ?",
      observation: "Pour f(x) = x², f(x) → +∞ et le rapport f(x)/x = x → +∞ : la courbe se redresse vers l’axe des ordonnées. C’est la direction (OJ).",
      formula: "f(x) = x²",
      formulaTex: "f(x)=x^2",
      rule: { kind: "polynomial", coefficients: [0, 0, 1] },
      window: { xMin: -6, xMax: 6, yMin: -4, yMax: 34 },
      marker: { min: -6, max: 6, step: 0.1, initial: 1 },
    },
    questions: [
      choice("Si $f(x)\\to-\\infty$ et $\\frac{f(x)}{x}\\to0$ en $+\\infty$, la branche a la direction de…", ["l’axe des abscisses $(OI)$", "l’axe des ordonnées $(OJ)$"], 0, "Un quotient nul couche la courbe vers l’axe des abscisses.", "Définition"),
      choice("Si $f(x)\\to+\\infty$ et $\\frac{f(x)}{x}\\to+\\infty$, la branche a la direction de…", ["l’axe des ordonnées $(OJ)$", "l’axe des abscisses $(OI)$"], 0, "Un quotient infini redresse la courbe vers l’axe des ordonnées.", "Définition"),
      short("Pour $f(x)=x^2$, donne $\\lim_{x\\to+\\infty}\\frac{f(x)}{x}$.", ["+∞", "+infini"], "$\\frac{x^2}{x}=x$, qui tend vers $+\\infty$.", "Application directe"),
      choice("Pour $f(x)=\\frac{x^3}{x+2}$, la branche en $+\\infty$ a la direction de…", ["$(OJ)$", "$(OI)$"], 0, "$f(x)\\sim x^2\\to+\\infty$ et $\\frac{f(x)}{x}\\sim x\\to+\\infty$.", "E-Exercice 5 - a", 2),
      choice("Pour $f(x)=\\frac{2}{x+1}-\\sqrt{x+1}$, la branche en $+\\infty$ a la direction de…", ["$(OI)$", "$(OJ)$"], 0, "$f(x)\\to-\\infty$ et $\\frac{f(x)}{x}\\to0$.", "E-Exercice 5 - b", 2),
      short("Pour $f(x)=\\sqrt{x^2+x+1}-x$, calcule $\\lim_{x\\to+\\infty}f(x)$.", ["1/2", "0,5", "0.5"], "En multipliant par la quantité conjuguée, on obtient $\\frac12$.", "D-Exercice résolu 4 - question 1", 3),
      short("Déduis-en l’équation de l’asymptote horizontale à $(C_f)$ en $+\\infty$.", ["y=1/2", "y = 1/2", "y=0,5", "y=0.5"], "Une limite finie $\\frac12$ donne l’asymptote horizontale $y=\\frac12$.", "D-Exercice résolu 4 - question 1", 2),
    ],
  },
  {
    id: "continuous-extension",
    title: "Continuité sur un intervalle et prolongement par continuité",
    summary: "Reconnaître une fonction continue sur un intervalle et combler un trou lorsque la limite finie existe.",
    pages: "4-5",
    section: "4.1 et 4.2. Continuité sur un intervalle et prolongement par continuité",
    durationMinutes: 24,
    kind: "graph",
    body: String.raw`## Continuité sur un intervalle

On dit qu’une fonction $f$ est **continue sur un intervalle $I$** si elle est continue en tout élément de $I$.

**Exemple.** Les fonctions polynôme, rationnelle, sinus, cosinus, racine carrée, puissance, valeur absolue et tangente sont continues sur tout intervalle inclus dans leurs ensembles de définition respectifs.

## Prolongement par continuité

**Propriété et définition.** Soit $f$ une fonction d’ensemble de définition $D_f$ et $a$ un nombre réel **n’appartenant pas** à $D_f$.

Si $f$ admet une **limite finie** $\ell$ en $a$, on dit que $f$ est **prolongeable par continuité** en $a$. La fonction $g$ définie sur $D_f\cup\{a\}$ par

$$g(x)=f(x)\ \text{ si } x\in D_f,\qquad g(a)=\ell$$

est continue en $a$ : c’est le **prolongement par continuité** de $f$ en $a$.

### Les deux conditions à vérifier

| Condition | Pourquoi elle est nécessaire |
|---|---|
| $a\notin D_f$ | S’il y appartenait, il n’y aurait rien à prolonger |
| $f$ admet une limite **finie** en $a$ | C’est cette valeur que l’on donne à $g(a)$ |

> **Erreur fréquente.** Une limite infinie ne permet **aucun** prolongement : la courbe part vers l’infini, il n’y a pas un simple trou à combler mais une asymptote.

> **Astuce mémoire de Davy.** **Trou + limite finie = on remplit le trou.** La valeur ajoutée est exactement $\ell$ : on pose $g(a)=\ell$. Si la limite est infinie, pense plutôt « asymptote ».

### Exemple du cours

Pour $f(x)=\dfrac{\sin x}{x}$, on a $D_f=\mathbb{R}\setminus\{0\}$ et $\lim_{x\to0}f(x)=1$. La fonction $g$ définie par $g(x)=f(x)$ pour $x\ne0$ et $g(0)=1$ est le prolongement par continuité de $f$ en $0$.

### Exemple avec quantité conjuguée

Pour $f(x)=\dfrac{x-9}{\sqrt{x-5}-2}$, on a $D_f=[5;9[\cup]9;+\infty[$. En multipliant par la quantité conjuguée :

$$f(x)=\frac{(x-9)(\sqrt{x-5}+2)}{(\sqrt{x-5}-2)(\sqrt{x-5}+2)}=\frac{(x-9)(\sqrt{x-5}+2)}{x-9}=\sqrt{x-5}+2$$

Donc $\lim_{x\to9}f(x)=4$ : $f$ est prolongeable par continuité en $9$ avec $\varphi(9)=4$.

### Un contre-exemple instructif

Pour $g(x)=\dfrac{x^2+x}{x^2-|x|}$, la limite à gauche en $0$ vaut $1$ et la limite à droite vaut $-1$. Les deux limites latérales diffèrent, donc $g$ n’admet **pas** de limite en $0$ : elle n’est **pas** prolongeable par continuité en $0$.`,
    keyPoint: "Prolongement possible si a ∉ D_f et si f admet une limite finie ℓ en a ; on pose alors g(a)=ℓ.",
    example: "$\\frac{x-9}{\\sqrt{x-5}-2}=\\sqrt{x-5}+2$ tend vers 4 en 9 : le prolongement vaut $\\varphi(9)=4$.",
    methodSteps: [
      "Détermine l’ensemble de définition et vérifie que a n’y appartient pas.",
      "Lève l’indétermination : factorisation, quantité conjuguée ou simplification.",
      "Calcule la limite en a et vérifie qu’elle est finie.",
      "Définis le prolongement en posant g(a) égal à cette limite.",
    ],
    timeline: [
      { label: "Domaine", detail: "Vérifier que a est exclu de D_f." },
      { label: "Transformer", detail: "Simplifier ou utiliser la quantité conjuguée." },
      { label: "Limite", detail: "Vérifier qu’elle est finie." },
      { label: "Prolonger", detail: "Poser g(a) égal à cette limite." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Un trou que l’on peut combler",
      instruction: "Approche le point de x = 1 par la gauche puis par la droite : que vaut f(x) ? Et exactement en 1 ?",
      observation: "Partout f(x) = 2, sauf en x = 1 où elle n’est pas définie : un simple trou. Comme la limite y vaut 2, on prolonge en posant g(1) = 2.",
      formula: "f(x) = (2x - 2)/(x - 1)",
      formulaTex: "f(x)=\\frac{2x-2}{x-1}",
      rule: { kind: "rational-linear", numerator: [2, -2], denominator: [1, -1] },
      window: { xMin: -3, xMax: 5, yMin: -1, yMax: 5 },
      guides: [{ kind: "vertical", value: 1, label: "x = 1 exclu" }],
      marker: { min: -3, max: 5, step: 0.05, initial: -1 },
    },
    questions: [
      choice("Une fonction qui admet une limite infinie en $a$ est prolongeable par continuité en $a$.", ["Vrai", "Faux"], 1, "Le prolongement exige une limite **finie**.", "Contrôle de la définition"),
      short("Pour $f(x)=\\frac{x-9}{\\sqrt{x-5}-2}$, donne la valeur du prolongement $\\varphi(9)$.", ["4"], "Après simplification, $f(x)=\\sqrt{x-5}+2$, qui vaut 4 en 9.", "Exercice de fixation 1", 2),
      short("Donne l’expression simplifiée de $\\varphi(x)$ sur $[5;+\\infty[$.", ["√(x-5)+2", "racine(x-5)+2", "sqrt(x-5)+2"], "La quantité conjuguée donne $\\varphi(x)=\\sqrt{x-5}+2$.", "Exercice de fixation 1 - remarque", 2),
      short("Pour $g(x)=\\frac{x^2+x}{x^2-|x|}$, donne $\\lim_{x\\to0^-}g(x)$.", ["1"], "À gauche de 0, $|x|=-x$ et le quotient se simplifie en 1.", "Exercice de fixation 2"),
      short("Donne $\\lim_{x\\to0^+}g(x)$ pour la même fonction.", ["-1"], "À droite de 0, $g(x)=\\frac{x+1}{x-1}$, qui vaut $-1$ en 0.", "Exercice de fixation 2"),
      choice("Cette fonction $g$ est-elle prolongeable par continuité en 0 ?", ["Non", "Oui"], 0, "Les limites latérales diffèrent : la limite en 0 n’existe pas.", "Exercice de fixation 2", 2),
      short("Pour $f(x)=\\frac{\\sin x}{x}$, quelle valeur donne-t-on au prolongement en 0 ?", ["1"], "La limite de référence $\\frac{\\sin x}{x}$ en 0 vaut 1.", "Exemple du cours"),
    ],
  },
  {
    id: "continuous-image-interval",
    title: "Image d’un intervalle par une fonction continue",
    summary: "Déterminer l’intervalle image en combinant continuité, sens de variation et limites aux bornes.",
    pages: "5-7",
    section: "4.3. Image d’un intervalle par une fonction continue",
    durationMinutes: 24,
    body: String.raw`## Propriété 1

L’image d’un intervalle $I$ par une fonction **continue** sur $I$ est un **intervalle** ou un **singleton**.

**Exemple du cours.** La fonction cosinus est continue sur $]-\pi;\pi]$ et pour tout $x$ de cet intervalle, $-1\le\cos x\le1$. De plus $\cos(\pi)=-1$ et $\cos(0)=1$. Donc l’image de $]-\pi;\pi]$ par cosinus est $[-1;1]$.

> Remarque importante : l’image d’un intervalle **ouvert** n’est pas nécessairement ouverte, comme le montre cet exemple.

## Propriété 2 — cas d’une fonction strictement monotone

Soit $f$ continue et **strictement monotone** sur un intervalle $I$, et $a<b$ deux réels.

| Intervalle $I$ | $f$ strictement **croissante** | $f$ strictement **décroissante** |
|---|---|---|
| $[a;b]$ | $[f(a);f(b)]$ | $[f(b);f(a)]$ |
| $[a;b[$ | $\left[f(a);\lim_{x\to b^-}f(x)\right[$ | $\left]\lim_{x\to b^-}f(x);f(a)\right]$ |
| $]a;b]$ | $\left]\lim_{x\to a^+}f(x);f(b)\right]$ | $\left[f(b);\lim_{x\to a^+}f(x)\right[$ |
| $]a;b[$ | $\left]\lim_{x\to a^+}f(x);\lim_{x\to b^-}f(x)\right[$ | $\left]\lim_{x\to b^-}f(x);\lim_{x\to a^+}f(x)\right[$ |
| $[a;+\infty[$ | $\left[f(a);\lim_{x\to+\infty}f(x)\right[$ | $\left]\lim_{x\to+\infty}f(x);f(a)\right]$ |
| $]-\infty;+\infty[$ | $\left]\lim_{x\to-\infty}f;\lim_{x\to+\infty}f\right[$ | $\left]\lim_{x\to+\infty}f;\lim_{x\to-\infty}f\right[$ |

### Les deux règles à retenir

1. **Une borne atteinte reste fermée**, une borne obtenue par limite reste **ouverte**.
2. Si $f$ est **décroissante**, l’ordre des bornes s’**inverse** : la borne gauche de l’image vient de la borne droite de l’intervalle.

### Exemple du cours

Le tableau de variation d’une fonction $f$ continue sur $]-\infty;0[$ et sur $]0;+\infty[$ donne :

- $f$ croissante sur $]-\infty;-1]$ avec $\lim_{x\to-\infty}f=-2$ et $f(-1)=5$, donc $f(]-\infty;-1])=]-2;5]$ ;
- $f$ décroissante sur $]0;+\infty[$ avec $\lim_{x\to0^+}f=+\infty$ et $\lim_{x\to+\infty}f=1$, donc $f(]0;+\infty[)=]1;+\infty[$ ;
- $f$ décroissante sur $[-1;0[$ avec $f(-1)=5$ et $\lim_{x\to0^-}f=1$, donc $f([-1;0[)=]1;5]$.`,
    keyPoint: "Borne atteinte ⇒ crochet fermé ; borne obtenue par limite ⇒ crochet ouvert. Décroissante ⇒ ordre inversé.",
    example: "$f$ croissante sur $]-\\infty;-1]$ avec limite $-2$ et $f(-1)=5$ donne l’image $]-2;5]$.",
    methodSteps: [
      "Vérifie la continuité et détermine le sens de variation sur l’intervalle.",
      "Calcule l’image des bornes atteintes et la limite aux bornes ouvertes.",
      "Place la plus petite valeur à gauche : inverse l’ordre si la fonction décroît.",
      "Ferme le crochet d’une borne atteinte, ouvre celui d’une limite.",
    ],
    timeline: [
      { label: "Continuité", detail: "Vérifier qu’elle est continue sur l’intervalle." },
      { label: "Variation", detail: "Croissante ou décroissante ?" },
      { label: "Bornes", detail: "Images des bornes atteintes, limites des bornes ouvertes." },
      { label: "Écrire", detail: "Ordonner et choisir les crochets." },
    ],
    questions: [
      short("Détermine l’image de $]-\\pi;\\pi]$ par la fonction cosinus.", ["[-1;1]", "[-1,1]", "[-1 ;1]"], "Le cosinus est continu, borné par $\\pm1$, et atteint $-1$ et $1$.", "Exercice de fixation", 2),
      short("$f$ est continue croissante sur $]-\\infty;-1]$, $\\lim_{x\\to-\\infty}f=-2$ et $f(-1)=5$. Donne $f(]-\\infty;-1])$.", ["]-2;5]", "]-2 ;5]", "]-2,5]"], "La limite donne une borne ouverte, l’image atteinte une borne fermée.", "Exercice de fixation", 2),
      short("$f$ est continue décroissante sur $]0;+\\infty[$ avec $\\lim_{x\\to0^+}f=+\\infty$ et $\\lim_{x\\to+\\infty}f=1$. Donne son image.", ["]1;+∞[", "]1 ;+∞[", "]1;+infini["], "Les deux bornes proviennent de limites : l’intervalle est ouvert.", "Exercice de fixation", 2),
      short("$f$ est continue décroissante sur $[-1;0[$ avec $f(-1)=5$ et $\\lim_{x\\to0^-}f=1$. Donne $f([-1;0[)$.", ["]1;5]", "]1 ;5]", "]1,5]"], "La fonction décroît : l’ordre s’inverse, et 5 est atteint.", "Exercice de fixation", 2),
      choice("L’image d’un intervalle par une fonction continue est toujours un intervalle ouvert.", ["Vrai", "Faux"], 1, "C’est un intervalle ou un singleton, pas nécessairement ouvert.", "Propriété 1"),
      choice("Si $f$ est continue et strictement croissante sur $[a;b]$, alors $f([a;b])$ vaut…", ["$[f(a);f(b)]$", "$[f(b);f(a)]$"], 0, "La croissance conserve l’ordre des bornes.", "Propriété 2"),
    ],
  },
  {
    id: "continuity-operations",
    title: "Opérations et composition de fonctions continues",
    summary: "Combiner somme, produit, quotient, racine et composition en préservant la continuité.",
    pages: "6-8",
    section: "4.4. Opérations sur les fonctions continues",
    durationMinutes: 22,
    body: String.raw`## Propriété 1 — opérations

Si $f$ et $g$ sont deux fonctions **continues sur un intervalle $I$**, alors :

| Fonction | Continue sur | Condition |
|---|---|---|
| $f+g$ | $I$ | — |
| $f\times g$ | $I$ | — |
| $f^{\,n}$, $n\in\mathbb{N}$ | $I$ | — |
| $\lvert f\rvert$ | $I$ | — |
| $\dfrac{f}{g}$ | $I$ | $g$ ne s’annule pas sur $I$ |
| $\sqrt{f}$ | $I$ | $f$ est positive sur $I$ |

## Propriété 2 — composition

Si $f$ est continue sur un intervalle $I$ et $g$ continue sur l’ensemble $f(I)$, alors $g\circ f$ est continue sur $I$.

> **Le point de vigilance.** Pour une composée, il ne suffit pas que $g$ soit continue « quelque part » : elle doit l’être **sur l’image $f(I)$**. C’est pourquoi on calcule d’abord $f(I)$ — d’où l’utilité de la partie précédente.

> **Astuce mémoire de Davy.** Pour les opérations, retiens les deux feux rouges : **quotient $\Rightarrow$ dénominateur non nul** ; **racine carrée $\Rightarrow$ contenu positif ou nul**. Pour une composée, contrôle le trajet $I\to f(I)\to g(f(I))$.

### Exemples du cours

**1.** $g(x)=x^3+\sin x$ est la somme des fonctions $x\mapsto x^3$ et $x\mapsto\sin x$, continues sur $\mathbb{R}$. Donc $g$ est continue sur $\mathbb{R}$.

**2.** $h(x)=\sqrt{x^2-1}$ : la fonction $x\mapsto x^2-1$ est continue et **positive** sur $]-\infty;-1]$. Donc $h$ est continue sur $]-\infty;-1]$.

**3.** Soient $g(x)=\dfrac{1+x}{2+x}$ et $f(x)=\cos x$. La fonction $f$ est continue sur $\mathbb{R}$ et $f(\mathbb{R})=[-1;1]$. La fonction $g$ est continue sur $[-1;1]$ car son dénominateur $2+x$ ne s’y annule pas. Donc $g\circ f$ est continue sur $\mathbb{R}$.

> **Erreur fréquente.** Pour $\sqrt{f}$, on oublie souvent de vérifier la positivité de $f$ : c’est elle qui fixe l’intervalle sur lequel la continuité peut être affirmée.`,
    keyPoint: "Somme, produit, puissance et valeur absolue conservent la continuité ; quotient si le dénominateur ne s’annule pas, racine si le radicande est positif.",
    example: "$\\sqrt{x^2-1}$ est continue sur $]-\\infty;-1]$ car $x^2-1$ y est continue et positive.",
    methodSteps: [
      "Décompose l’expression en fonctions de référence.",
      "Vérifie la continuité de chaque morceau sur l’intervalle visé.",
      "Contrôle les conditions : dénominateur non nul, radicande positif.",
      "Pour une composée, vérifie que la seconde fonction est continue sur l’image de la première.",
    ],
    timeline: [
      { label: "Décomposer", detail: "Repérer les fonctions de référence." },
      { label: "Conditions", detail: "Dénominateur non nul, radicande positif." },
      { label: "Composée", detail: "Contrôler la continuité de g sur f(I)." },
      { label: "Conclure", detail: "Annoncer l’intervalle de continuité." },
    ],
    questions: [
      short("Sur quel ensemble $g(x)=x^3+\\sin x$ est-elle continue ?", ["R", "ℝ", "IR", "R tout entier"], "C’est la somme de deux fonctions continues sur $\\mathbb{R}$.", "Exercice de fixation - question 1"),
      short("Sur quel intervalle $h(x)=\\sqrt{x^2-1}$ est-elle continue, d’après le cours ?", ["]-∞;-1]", "]-∞ ;-1]", "]-infini;-1]"], "Le radicande $x^2-1$ y est continu et positif.", "Exercice de fixation - question 2", 2),
      choice("Pour affirmer que $g\\circ f$ est continue sur $I$, il suffit que $g$ soit continue sur $\\mathbb{R}$.", ["Vrai", "Faux"], 1, "Il faut que $g$ soit continue sur l’image $f(I)$, ce qui est plus précis.", "Propriété 2"),
      short("Pour $f(x)=\\cos x$, donne l’image $f(\\mathbb{R})$.", ["[-1;1]", "[-1,1]", "[-1 ;1]"], "Le cosinus décrit exactement $[-1;1]$.", "Exercice de fixation - composée", 2),
      choice("Pourquoi $g(x)=\\frac{1+x}{2+x}$ est-elle continue sur $[-1;1]$ ?", ["Son dénominateur $2+x$ ne s’annule pas sur $[-1;1]$", "Parce que toute fraction est continue"], 0, "Sur $[-1;1]$, $2+x$ varie entre 1 et 3 : il ne s’annule jamais.", "Exercice de fixation - composée", 2),
      choice("La fonction $\\lvert f\\rvert$ est continue dès que $f$ l’est.", ["Vrai", "Faux"], 0, "La valeur absolue préserve la continuité, sans condition.", "Propriété 1"),
    ],
  },
  {
    id: "continuous-bijection-inverse",
    title: "Bijection et bijection réciproque continue",
    summary: "Une fonction continue et strictement monotone réalise une bijection dont la réciproque varie dans le même sens.",
    pages: "8-9",
    section: "5.1. Fonction continue et strictement monotone sur un intervalle",
    durationMinutes: 26,
    kind: "graph",
    body: String.raw`## Propriété 1

Si $f$ est une fonction **continue et strictement monotone** sur un intervalle $I$, alors :

- $f$ est une **bijection** de $I$ sur l’intervalle $f(I)$ ;
- la bijection réciproque $f^{-1}$ est **continue et strictement monotone** sur $f(I)$ ;
- $f^{-1}$ a le **même sens de variation** que $f$.

**Remarque.** Dans un repère orthonormé, les courbes représentatives de $f$ et de $f^{-1}$ sont **symétriques par rapport à la droite d’équation $y=x$**.

### Les deux hypothèses, et ce que chacune apporte

| Hypothèse | Ce qu’elle garantit |
|---|---|
| Continuité | L’image $f(I)$ est un **intervalle**, sans trou |
| Stricte monotonie | Chaque valeur est atteinte **au plus une fois** : l’injectivité |

Réunies, elles donnent la bijection : tout élément de $f(I)$ possède **exactement un** antécédent dans $I$.

> **Astuce mémoire de Davy.** La réciproque **échange les rôles de $x$ et de $y$** : le domaine $I$ de $f$ devient l’image de $f^{-1}$, et l’image $f(I)$ devient son domaine. Sur le graphique, cet échange produit la symétrie par rapport à $y=x$.

### Exemple 1 du cours

Soit $f:[0;+\infty[\ \to\mathbb{R}$, $x\mapsto\dfrac{x^2}{1+x^2}$.

- $\lim_{x\to+\infty}f(x)=\lim_{x\to+\infty}\dfrac{x^2}{x^2}=1$.
- $f'(x)=\dfrac{2x(1+x^2)-2x\cdot x^2}{(1+x^2)^2}=\dfrac{2x}{(1+x^2)^2}$, strictement positive sur $]0;+\infty[$.

$f$ est donc continue et strictement croissante sur $[0;+\infty[$, et réalise une bijection de $[0;+\infty[$ sur $f([0;+\infty[)=[0;1[$. Sa réciproque $f^{-1}$ est définie sur $[0;1[$ et y est **strictement croissante**, comme $f$.

### Exemple 2 du cours — calculer la réciproque

Soit $g:[1;3]\to[0;4]$, $x\mapsto -x^2+2x+3$. On a $g'(x)=-2x+2$, strictement négative sur $]1;3]$.

$g$ est continue et strictement décroissante sur $[1;3]$, avec $g([1;3])=[g(3);g(1)]=[0;4]$ : c’est une bijection.

Pour $y\in[0;4]$ et $x\in[1;3]$ :

$$g(x)=y\iff (x-1)^2-4+y=0\iff x=1+\sqrt{4-y}$$

D’où la réciproque : $g^{-1}(x)=1+\sqrt{4-x}$, définie de $[0;4]$ sur $[1;3]$.`,
    keyPoint: "Continue + strictement monotone ⇒ bijection de I sur f(I) ; la réciproque varie dans le même sens.",
    example: "$g(x)=-x^2+2x+3$ décroît de 4 à 0 sur $[1;3]$ : c’est une bijection, et $g^{-1}(x)=1+\\sqrt{4-x}$.",
    methodSteps: [
      "Justifie la continuité, puis la stricte monotonie par le signe de la dérivée.",
      "Détermine l’intervalle image f(I) à l’aide des bornes et des limites.",
      "Conclus que f réalise une bijection de I sur f(I).",
      "Pour l’expression de la réciproque, résous l’équation f(x)=y en gardant la solution qui appartient à I.",
    ],
    timeline: [
      { label: "Continuité", detail: "Justifier qu’elle est continue sur I." },
      { label: "Monotonie", detail: "Étudier le signe de la dérivée." },
      { label: "Image", detail: "Déterminer l’intervalle f(I)." },
      { label: "Réciproque", detail: "Résoudre f(x)=y pour l’expliciter." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Une bijection de [1 ; 3] sur [0 ; 4]",
      instruction: "Parcours l’intervalle [1 ; 3] : chaque valeur de y entre 0 et 4 est-elle atteinte une seule fois ?",
      observation: "Sur [1 ; 3], g décroît strictement de 4 à 0 : chaque ordonnée est atteinte exactement une fois. C’est la définition d’une bijection de [1 ; 3] sur [0 ; 4].",
      formula: "g(x) = -x² + 2x + 3",
      formulaTex: "g(x)=-x^2+2x+3",
      rule: { kind: "polynomial", coefficients: [3, 2, -1] },
      window: { xMin: -1, xMax: 4, yMin: -3, yMax: 5 },
      guides: [
        { kind: "vertical", value: 1, label: "x = 1" },
        { kind: "vertical", value: 3, label: "x = 3" },
      ],
      marker: { min: 1, max: 3, step: 0.05, initial: 1 },
    },
    questions: [
      choice("La stricte monotonie seule suffit à garantir que $f(I)$ est un intervalle.", ["Vrai", "Faux"], 1, "C’est la **continuité** qui garantit que l’image est un intervalle.", "Propriété 1", 2),
      choice("La bijection réciproque $f^{-1}$ varie…", ["dans le même sens que $f$", "dans le sens contraire de $f$"], 0, "C’est une conclusion explicite de la propriété 1.", "Propriété 1"),
      short("Pour $f(x)=\\frac{x^2}{1+x^2}$ sur $[0;+\\infty[$, donne l’intervalle image.", ["[0;1[", "[0 ;1[", "[0,1["], "$f(0)=0$ est atteint et la limite en $+\\infty$ vaut 1, non atteinte.", "Exercice 1 - question 1", 2),
      choice("La réciproque de cette fonction $f$ est donc…", ["strictement croissante sur $[0;1[$", "strictement décroissante sur $[0;1[$"], 0, "$f$ est croissante, donc $f^{-1}$ l’est aussi.", "Exercice 1 - question 2"),
      short("Pour $g(x)=-x^2+2x+3$ sur $[1;3]$, donne l’intervalle image $g([1;3])$.", ["[0;4]", "[0 ;4]", "[0,4]"], "$g$ décroît : l’image est $[g(3);g(1)]=[0;4]$.", "Exercice 2 - question 1", 2),
      short("Donne l’expression de la bijection réciproque $g^{-1}(x)$.", ["1+√(4-x)", "1+racine(4-x)", "1+sqrt(4-x)"], "On résout $g(x)=y$ et on garde la solution appartenant à $[1;3]$.", "Exercice 2 - question 2", 3),
      choice("Dans un repère orthonormé, les courbes de $f$ et $f^{-1}$ sont symétriques par rapport à…", ["la droite $y=x$", "l’axe des abscisses", "l’origine"], 0, "C’est la remarque du cours.", "Propriété 1 - remarque"),
    ],
  },
  {
    id: "intermediate-value-theorem",
    title: "Théorème des valeurs intermédiaires et valeur approchée",
    summary: "Justifier l’existence puis l’unicité d’une solution, et l’encadrer par balayage ou par dichotomie.",
    pages: "9-11",
    section: "5.1 (TVI et corollaires) et 5.2 (valeur approchée)",
    durationMinutes: 30,
    kind: "challenge",
    body: String.raw`## Propriété 2 — Théorème des valeurs intermédiaires

Soit $f$ une fonction **continue** sur un intervalle $I$, et $a$, $b$ deux éléments de $I$.

Pour tout $m$ compris entre $f(a)$ et $f(b)$, l’équation $f(x)=m$ admet **au moins une** solution comprise entre $a$ et $b$.

## Corollaire 1 — unicité

Si de plus $f$ est **strictement monotone** sur $I$, alors pour tout $m$ compris entre $f(a)$ et $f(b)$, l’équation $f(x)=m$ admet **une unique** solution comprise entre $a$ et $b$.

## Corollaire 2 — cas de l’équation $f(x)=0$

Si $f$ est continue et strictement monotone sur $[a;b]$ et si $f(a)\times f(b)<0$, alors l’équation $f(x)=0$ admet **une solution unique** dans $]a;b[$.

### Ce que chaque hypothèse apporte

| Hypothèse | Apport |
|---|---|
| Continuité | **Existence** d’au moins une solution |
| Stricte monotonie | **Unicité** de cette solution |
| $f(a)\times f(b)<0$ | Garantit que $0$ est bien compris entre $f(a)$ et $f(b)$ |

### Exemple du cours — lecture sur un tableau de variation

$f$ est continue et strictement décroissante sur $[-1;+\infty[$, avec $f([-1;+\infty[)=\,]-\infty;5]$.

- $-10\in\,]-\infty;5]$, donc $f(x)=-10$ admet une **solution unique**.
- $13\notin\,]-\infty;5]$, donc $f(x)=13$ n’admet **aucune** solution.

> **La méthode complète.** Pour savoir si $f(x)=m$ a une solution, on ne devine pas : on calcule l’**intervalle image** et on regarde si $m$ lui appartient. C’est le lien direct avec la partie « Image d’un intervalle ».

### Exemple du cours — existence et unicité

Soit $f(x)=2x^3+3x-1$ sur $[0;1]$. On a $f'(x)=6x^2+3>0$, donc $f$ est strictement croissante. De plus $f(0)=-1$ et $f(1)=4$, donc $f(0)\times f(1)<0$.

L’équation $f(x)=0$ admet donc une **unique solution** $\alpha$ dans $]0;1[$.

## Valeur approchée de $\alpha$

### Méthode 1 — balayage

On parcourt l’intervalle avec un pas de $0,1$ jusqu’à trouver deux images consécutives de signes contraires.

| $x$ | 0 | 0,1 | 0,2 | 0,3 | 0,4 |
|---|---|---|---|---|---|
| $f(x)$ | $-1$ | $-0,7$ | $-0,38$ | $-0,05$ | $0,3$ |

Comme $f(0,3)\times f(0,4)<0$, on conclut $0,3<\alpha<0,4$. Une valeur approchée de $\alpha$ à $10^{-1}$ près est $0,3$.

### Méthode 2 — dichotomie

On calcule $f(a)$ et $f\!\left(\dfrac{a+b}{2}\right)$, puis on conserve la moitié où les images changent de signe, et on recommence.

| Étape | Intervalle | Milieu | $f(\text{milieu})$ | Nouvel intervalle |
|---|---|---|---|---|
| 1 | $[0;1]$ | $0,5$ | $0,75>0$ | $[0;0,5]$ |
| 2 | $[0;0,5]$ | $0,25$ | $-0,22<0$ | $[0,25;0,5]$ |
| 3 | $[0,25;0,5]$ | $0,375$ | $0,23>0$ | $[0,25;0,375]$ |
| 4 | $[0,25;0,375]$ | $0,3125$ | $-0,0014<0$ | $[0,3125;0,375]$ |

À l’ordre 1, on retrouve $\alpha\in[0,3;0,4]$ : la valeur approchée à $10^{-1}$ près est $0,3$.

> **Astuce mémoire de Davy.** Pour une solution unique, retiens **C-M-S** : **Continuité** pour l’existence, **Monotonie stricte** pour l’unicité, **Signes contraires** pour encadrer la solution.

> **Balayage ou dichotomie ?** Le balayage avance d’un pas fixe et donne directement la précision voulue. La dichotomie divise l’incertitude par deux à chaque étape : elle converge plus vite, mais les calculs sont moins réguliers.`,
    keyPoint: "Continuité ⇒ existence ; stricte monotonie ⇒ unicité ; f(a)×f(b)<0 place la racine dans ]a;b[.",
    example: "$f(x)=2x^3+3x-1$ est croissante avec $f(0)=-1$ et $f(1)=4$ : une unique racine $\\alpha$, encadrée par $0,3<\\alpha<0,4$.",
    methodSteps: [
      "Justifie la continuité de f sur l’intervalle.",
      "Établis la stricte monotonie par le signe de la dérivée.",
      "Vérifie que m est compris entre les images des bornes, ou que f(a)×f(b)<0.",
      "Conclus à l’existence et à l’unicité, puis encadre par balayage ou dichotomie.",
    ],
    timeline: [
      { label: "Continuité", detail: "Elle donne l’existence d’une solution." },
      { label: "Monotonie", detail: "Elle ajoute l’unicité." },
      { label: "Encadrer", detail: "Vérifier le changement de signe." },
      { label: "Approcher", detail: "Balayage ou dichotomie jusqu’à la précision voulue." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "Traquer la racine de 2x³ + 3x − 1",
      instruction: "Balaye l’intervalle [0 ; 1] au pas de 0,1 : entre quelles valeurs f(x) change-t-elle de signe ?",
      observation: "f(0,3) = -0,05 est encore négatif, f(0,4) = 0,3 est positif : la racine α est coincée entre 0,3 et 0,4. La courbe traverse l’axe une seule fois, car f est strictement croissante.",
      formula: "f(x) = 2x³ + 3x - 1",
      formulaTex: "f(x)=2x^3+3x-1",
      rule: { kind: "polynomial", coefficients: [-1, 3, 0, 2] },
      window: { xMin: -0.2, xMax: 1.1, yMin: -1.5, yMax: 4.5 },
      marker: { min: 0, max: 1, step: 0.1, initial: 0 },
    },
    questions: [
      choice("La continuité seule garantit l’unicité de la solution de $f(x)=m$.", ["Vrai", "Faux"], 1, "Elle garantit l’existence ; l’unicité demande la stricte monotonie.", "TVI et corollaire 1", 2),
      short("$f$ est continue strictement décroissante sur $[-1;+\\infty[$ avec $f([-1;+\\infty[)=]-\\infty;5]$. Combien de solutions a $f(x)=-10$ ?", ["1", "une", "une seule"], "$-10$ appartient à l’intervalle image et $f$ est strictement monotone.", "Exercice de fixation - question 1", 2),
      short("Pour la même fonction, combien de solutions a l’équation $f(x)=13$ ?", ["0", "aucune", "zéro"], "$13\\notin\\,]-\\infty;5]$ : aucune solution.", "Exercice de fixation - question 2", 2),
      short("Pour $f(x)=2x^3+3x-1$, calcule $f(0)$.", ["-1"], "$0+0-1=-1$.", "Exercice de fixation - corollaire 2"),
      short("Calcule $f(1)$ pour cette même fonction.", ["4"], "$2+3-1=4$.", "Exercice de fixation - corollaire 2"),
      short("Donne l’encadrement de $\\alpha$ obtenu par balayage au pas de 0,1.", ["0,3<α<0,4", "0.3<alpha<0.4", "0,3<alpha<0,4"], "$f(0,3)<0$ et $f(0,4)>0$.", "5.2 - Méthode de balayage", 3),
      short("Première étape de dichotomie sur $[0;1]$ : calcule $f(0,5)$.", ["0,75", "0.75"], "$2(0,125)+1,5-1=0,75$.", "5.2 - Méthode de dichotomie", 2),
      short("Après cette étape, dans quel intervalle se trouve $\\alpha$ ?", ["[0;0,5]", "[0;0.5]", "[0 ;0,5]"], "$f(0)$ et $f(0,5)$ sont de signes contraires.", "5.2 - Méthode de dichotomie", 2),
      short("Pour $g(x)=2x^3-3x^2-1$, l’équation $g(x)=0$ a une unique solution $\\alpha$. Donne son encadrement à $10^{-1}$.", ["1,6<α<1,7", "1.6<alpha<1.7", "1,6<alpha<1,7"], "$g(1,6)\\approx-0,49$ et $g(1,7)\\approx0,16$ sont de signes contraires.", "D-Exercice résolu 5 - partie A", 3),
    ],
  },
  {
    id: "rational-powers",
    title: "Fonction racine n-ième et puissance d’exposant rationnel",
    summary: "Définir la racine n-ième comme bijection réciproque et manipuler les exposants rationnels.",
    pages: "11-13",
    section: "6. Fonction racine n-ième, fonction puissance d’exposant rationnel",
    durationMinutes: 26,
    body: String.raw`## Fonction racine n-ième

Soit $n$ un entier naturel tel que $n\ge2$. La **fonction racine n-ième** est la bijection réciproque de la fonction

$$f:[0;+\infty[\ \longrightarrow\ [0;+\infty[,\qquad x\longmapsto x^n$$

La racine n-ième d’un réel positif ou nul $x$ se note $\sqrt[n]{x}$ ou $x^{\frac1n}$.

> **Le lien avec la partie précédente.** La fonction $x\mapsto x^n$ est continue et strictement croissante sur $[0;+\infty[$ : elle réalise donc une bijection, ce qui **autorise** à parler de sa réciproque. La racine n-ième n’existe pas par convention, elle est justifiée par la propriété des bijections.

### Conséquences

$$\begin{cases}x\in\mathbb{R}^+\\ y=\sqrt[n]{x}\end{cases}\iff\begin{cases}y\in\mathbb{R}^+\\ x=y^n\end{cases}$$

Pour tout $x\in\mathbb{R}^+$ : $\left(\sqrt[n]{x}\right)^n=x$ et $\sqrt[n]{x^n}=x$.

**Exemples.** $x^3=5\iff x=\sqrt[3]{5}$ ; $\sqrt[4]{16}=2$ ; $\sqrt[5]{120^5}=120$.

## Puissance d’exposant rationnel

Soit $p$ un entier relatif non nul et $q$ un entier naturel tel que $q\ge2$. Pour tout réel $a$ **strictement positif** :

$$a^{\frac{p}{q}}=\left(a^{\frac1q}\right)^p=\left(\sqrt[q]{a}\right)^p=\sqrt[q]{a^p}$$

### Propriétés des exposants rationnels

Pour tous rationnels $r$ et $r'$ non nuls et tous réels $a$, $b$ strictement positifs :

| Règle | Écriture |
|---|---|
| Produit de même base | $a^r\times a^{r'}=a^{r+r'}$ |
| Inverse | $\dfrac{1}{a^r}=a^{-r}$ |
| Quotient de même base | $\dfrac{a^{r'}}{a^r}=a^{r'-r}$ |
| Puissance de puissance | $\left(a^r\right)^{r'}=a^{r\,r'}$ |
| Produit de même exposant | $a^r\times b^r=(ab)^r$ |
| Quotient de même exposant | $\dfrac{a^r}{b^r}=\left(\dfrac{a}{b}\right)^r$ |

### La méthode en une phrase

> Transforme **d’abord** chaque radical en puissance d’exposant rationnel, **puis** additionne ou soustrais les exposants. C’est toujours plus sûr que de manipuler les racines directement.

### Exemple du cours entièrement rédigé

$$\sqrt[3]{a}\times\sqrt[4]{a}=a^{\frac13}\times a^{\frac14}=a^{\frac13+\frac14}=a^{\frac{7}{12}}$$

$$\sqrt{\sqrt{\sqrt{a}}}=\left(\left(a^{\frac12}\right)^{\frac12}\right)^{\frac12}=a^{\frac18}$$

$$\frac{a^3}{\sqrt{a^{0,4}}}=\frac{a^3}{a^{\frac15}}=a^{3-\frac15}=a^{\frac{14}{5}}$$

> **Erreur fréquente.** Ces règles supposent $a>0$. Pour $a$ négatif, $\sqrt[q]{a^p}$ n’a pas toujours de sens : ne les applique jamais sans vérifier le signe.`,
    keyPoint: "√[n]{x} = x^(1/n) et a^(p/q) = ᵠ√(aᵖ) pour a > 0 ; on additionne les exposants d’une même base.",
    example: "$\\sqrt[3]{a}\\times\\sqrt[4]{a}=a^{\\frac13+\\frac14}=a^{\\frac7{12}}$.",
    methodSteps: [
      "Réécris chaque radical sous la forme d’une puissance d’exposant rationnel.",
      "Vérifie que la base est strictement positive.",
      "Applique les règles sur les exposants : addition, soustraction ou produit.",
      "Réduis la fraction obtenue à l’exposant final.",
    ],
    timeline: [
      { label: "Convertir", detail: "Passer des racines aux exposants rationnels." },
      { label: "Signe", detail: "Vérifier que la base est strictement positive." },
      { label: "Combiner", detail: "Additionner ou soustraire les exposants." },
      { label: "Réduire", detail: "Simplifier la fraction finale." },
    ],
    questions: [
      short("Écris $\\sqrt[3]{a}\\times\\sqrt[4]{a}$ sous la forme $a^\\alpha$. Donne $\\alpha$.", ["7/12"], "$\\frac13+\\frac14=\\frac{7}{12}$.", "Exercice de fixation 1", 2),
      short("Écris $\\sqrt{\\sqrt{\\sqrt{a}}}$ sous la forme $a^\\alpha$. Donne $\\alpha$.", ["1/8"], "Trois racines carrées successives donnent $\\left(\\frac12\\right)^3=\\frac18$.", "Exercice de fixation 1", 2),
      short("Écris $\\frac{a^3}{\\sqrt{a^{0,4}}}$ sous la forme $a^\\alpha$. Donne $\\alpha$.", ["14/5", "2,8", "2.8"], "$\\sqrt{a^{0,4}}=a^{0,2}=a^{\\frac15}$, donc $\\alpha=3-\\frac15=\\frac{14}{5}$.", "Exercice de fixation 1", 3),
      short("Calcule $\\sqrt[4]{16}$.", ["2"], "$2^4=16$.", "Exemples du cours"),
      short("Calcule $\\sqrt[5]{120^5}$.", ["120"], "$\\sqrt[n]{x^n}=x$ pour $x\\ge0$.", "Exemples du cours"),
      short("Résous dans $\\mathbb{R}^+$ : $x^3=5$. Donne $x$.", ["³√5", "3√5", "racine cubique de 5", "5^(1/3)"], "Par définition de la racine cubique.", "Exemples du cours", 2),
      choice("Les règles sur les exposants rationnels s’appliquent pour tout réel $a$.", ["Vrai", "Faux"], 1, "Elles supposent $a$ **strictement positif**.", "Propriétés", 2),
    ],
  },
  {
    id: "complete-function-study-mission",
    title: "Étude guidée : conduire une étude complète de fonction",
    summary: "Mobiliser limites, continuité, TVI, asymptotes et tangente sur l’étude complète du document.",
    pages: "13-19",
    section: "C. Situations complexes et D. Exercices résolus",
    durationMinutes: 45,
    kind: "challenge",
    body: String.raw`## Méthode complète d’étude

Pour étudier une fonction et représenter sa courbe, l’ordre suivant ne change jamais :

1. déterminer l’ensemble de définition ;
2. calculer les limites aux bornes du domaine ;
3. interpréter ces limites en termes d’asymptotes ou de branches infinies ;
4. calculer la dérivée et en étudier le signe ;
5. dresser le tableau de variations ;
6. déterminer une tangente remarquable et la position de la courbe par rapport à elle ;
7. tracer la courbe.

> **Astuce mémoire de Davy.** Retiens la chaîne **D-L-A-D-V-T** : **D**omaine, **L**imites, **A**symptotes, **D**érivée, **V**ariations, **T**angente — puis le tracé. C’est ton ordre de marche pour une étude complète au BAC.

Lorsque le signe de la dérivée n’est pas immédiat, on **étudie d’abord une fonction auxiliaire** : c’est tout l’objet de la partie A ci-dessous.

## Partie A — la fonction auxiliaire $g(x)=2x^3-3x^2-1$

### Limites

$$\lim_{x\to-\infty}g(x)=\lim_{x\to-\infty}2x^3=-\infty,\qquad \lim_{x\to+\infty}g(x)=\lim_{x\to+\infty}2x^3=+\infty$$

### Variations

$g$ est dérivable sur $\mathbb{R}$ et $g'(x)=6x^2-6x=6x(x-1)$, qui s’annule en $0$ et en $1$.

| $x$ | $-\infty\to0$ | $0$ | $0\to1$ | $1$ | $1\to+\infty$ |
|---|---|---|---|---|---|
| $g'(x)$ | $+$ | $0$ | $-$ | $0$ | $+$ |
| $g$ | ↗ | $-1$ | ↘ | $-2$ | ↗ |

### Existence et unicité de la racine $\alpha$

Sur $]-\infty;1]$, le maximum de $g$ est $g(0)=-1<0$, donc $g$ y reste **strictement négative** : aucune racine.

Sur $[1;+\infty[$, $g$ est continue et strictement croissante avec $g([1;+\infty[)=[-2;+\infty[$. Comme $0\in[-2;+\infty[$, l’équation $g(x)=0$ admet une **unique solution** $\alpha$.

Enfin $g(1{,}6)\approx-0{,}49$ et $g(1{,}7)\approx0{,}16$ sont de signes contraires, donc :

$$1{,}6<\alpha<1{,}7$$

### Signe de $g$

$$\forall x\in\,]-\infty;\alpha[,\ g(x)<0\qquad\text{et}\qquad\forall x\in\,]\alpha;+\infty[,\ g(x)>0$$

## Partie B — l’étude de $f(x)=\dfrac{1-x}{1+x^3}$ sur $]-1;+\infty[$

### Limites et asymptotes

Pour $x>-1$, on a $x^3>-1$ donc $1+x^3>0$, et $\lim_{x\to-1^+}\dfrac{1}{1+x^3}=+\infty$. Comme $\lim_{x\to-1}(1-x)=2$ :

$$\lim_{x\to-1^+}f(x)=+\infty\ \Longrightarrow\ \text{la droite } x=-1 \text{ est asymptote verticale}$$

$$\lim_{x\to+\infty}f(x)=\lim_{x\to+\infty}\frac{-x}{x^3}=\lim_{x\to+\infty}\frac{-1}{x^2}=0\ \Longrightarrow\ \text{la droite } y=0 \text{ est asymptote horizontale}$$

### Dérivée et variations

$$f'(x)=\frac{-(1+x^3)-3x^2(1-x)}{(1+x^3)^2}=\frac{2x^3-3x^2-1}{(1+x^3)^2}=\frac{g(x)}{(1+x^3)^2}$$

Comme $(1+x^3)^2>0$, le signe de $f'$ est exactement celui de $g$, étudié en partie A. Donc $f$ est strictement **décroissante** sur $]-1;\alpha]$ et strictement **croissante** sur $[\alpha;+\infty[$.

### Tangente au point d’abscisse 0 et position relative

$f(0)=1$ et $f'(0)=\dfrac{g(0)}{1}=-1$, donc la tangente $(T)$ a pour équation :

$$y=-x+1$$

Pour tout $x>-1$ : $f(x)-(-x+1)=\dfrac{x^2-x}{1+x^3}=\dfrac{x(x-1)}{1+x^3}$. Comme $1+x^3>0$, le signe est celui de $x(x-1)$ :

- $(C)$ est **au-dessus** de $(T)$ sur $]-1;0[\,\cup\,]1;+\infty[$ ;
- $(C)$ est **en dessous** de $(T)$ sur $]0;1[$ ;
- $(C)$ et $(T)$ se coupent aux points d’abscisses $0$ et $1$.

> **Ce qu’il faut retenir de cette étude.** Le signe d’une dérivée compliquée s’obtient en isolant une **fonction auxiliaire** ; le TVI donne alors la racine qui sépare les variations. C’est le schéma le plus fréquent au Baccalauréat.`,
    keyPoint: "Étude complète : domaine, limites, asymptotes, dérivée via une fonction auxiliaire, variations, tangente et position.",
    example: "$f'(x)=\\frac{g(x)}{(1+x^3)^2}$ : le signe de $f'$ est celui de $g$, dont la racine unique $\\alpha$ vérifie $1,6<\\alpha<1,7$.",
    methodSteps: [
      "Étudie la fonction auxiliaire : limites, dérivée, variations, racine unique et signe.",
      "Reviens à f : domaine, limites aux bornes et interprétation en asymptotes.",
      "Exprime f' en fonction de la fonction auxiliaire pour en déduire son signe.",
      "Dresse le tableau de variations, puis étudie la tangente et la position relative.",
    ],
    timeline: [
      { label: "Auxiliaire", detail: "Étudier g et localiser sa racine α." },
      { label: "Limites", detail: "Déterminer les asymptotes de f." },
      { label: "Dérivée", detail: "Relier le signe de f' à celui de g." },
      { label: "Synthèse", detail: "Variations, tangente, position et tracé." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La fonction auxiliaire g et sa racine α",
      instruction: "Balaye entre 1,6 et 1,7 : entre quelles bornes g change-t-elle de signe ?",
      observation: "g reste négative jusqu’à α, puis devient positive. g(1,6) ≈ -0,49 et g(1,7) ≈ 0,16 : la racine unique α est coincée entre les deux droites rouges. C’est elle qui sépare les variations de f.",
      formula: "g(x) = 2x³ - 3x² - 1",
      formulaTex: "g(x)=2x^3-3x^2-1",
      rule: { kind: "polynomial", coefficients: [-1, 0, -3, 2] },
      window: { xMin: -1, xMax: 2.5, yMin: -8, yMax: 8 },
      guides: [
        { kind: "vertical", value: 1.6, label: "1,6" },
        { kind: "vertical", value: 1.7, label: "1,7" },
      ],
      marker: { min: -1, max: 2.5, step: 0.05, initial: 0 },
    },
    questions: [
      short("Pour $g(x)=2x^3-3x^2-1$, calcule $\\lim_{x\\to-\\infty}g(x)$.", ["-∞", "-infini"], "Le monôme dominant $2x^3$ tend vers $-\\infty$.", "D-Exercice résolu 5 - partie A"),
      short("Donne $g'(x)$ sous forme factorisée.", ["6x(x-1)", "6x(x - 1)"], "$g'(x)=6x^2-6x=6x(x-1)$.", "D-Exercice résolu 5 - partie A", 2),
      short("Calcule $g(0)$, le maximum de $g$ sur $]-\\infty;1]$.", ["-1"], "$g(0)=-1$, et comme c’est le maximum, $g<0$ sur tout cet intervalle.", "D-Exercice résolu 5 - partie A"),
      short("Donne l’encadrement de la racine unique $\\alpha$ à $10^{-1}$ près.", ["1,6<α<1,7", "1.6<alpha<1.7", "1,6<alpha<1,7"], "$g(1,6)\\approx-0,49$ et $g(1,7)\\approx0,16$ sont de signes contraires.", "D-Exercice résolu 5 - partie A", 3),
      short("Pour $f(x)=\\frac{1-x}{1+x^3}$, donne l’équation de l’asymptote verticale.", ["x=-1", "x = -1"], "$\\lim_{x\\to-1^+}f(x)=+\\infty$.", "D-Exercice résolu 5 - partie B", 2),
      short("Donne l’équation de l’asymptote horizontale en $+\\infty$.", ["y=0", "y = 0"], "$f(x)\\sim\\frac{-1}{x^2}\\to0$.", "D-Exercice résolu 5 - partie B", 2),
      short("Complète : $f'(x)=\\frac{\\dots}{(1+x^3)^2}$. Donne le numérateur.", ["g(x)", "2x^3-3x^2-1", "2x³-3x²-1"], "Le calcul du quotient redonne exactement $g(x)$.", "D-Exercice résolu 5 - partie B", 3),
      short("Donne l’équation de la tangente $(T)$ à $(C)$ au point d’abscisse 0.", ["y=-x+1", "y = -x + 1"], "$f(0)=1$ et $f'(0)=-1$.", "D-Exercice résolu 5 - partie B", 2),
      choice("Sur $]0;1[$, la courbe $(C)$ est située…", ["en dessous de $(T)$", "au-dessus de $(T)$"], 0, "Sur cet intervalle, $x(x-1)<0$.", "D-Exercice résolu 5 - partie B", 2),
      short("En quels points $(C)$ et $(T)$ se coupent-elles ? Donne les deux abscisses.", ["0 et 1", "0;1", "0 et 1", "0,1"], "$x(x-1)=0$ pour $x=0$ ou $x=1$.", "D-Exercice résolu 5 - partie B", 2),
      short("Un objet refroidit selon $f(t)=\\frac{200}{t}+10$. Quelle température atteint-il après une très longue période, en °C ?", ["10", "10°C", "10 °C"], "$\\lim_{t\\to+\\infty}f(t)=10$ : la température se stabilise à 10 °C.", "C-Situation complexe 1", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const terminalCLimitsContinuityPath: LearningPath = {
  id: "terminale-c-math-l01-limits-continuity",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  presentation: "continuous-course",
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 1,
  title: "Limites et continuité",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, présenté en lecture continue avec ses exemples, manipulations et corrections expliquées.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer la limite d’une fonction composée et d’une fonction monotone bornée",
    "Reconnaître une branche parabolique et prolonger une fonction par continuité",
    "Déterminer l’image d’un intervalle et exploiter les opérations sur les fonctions continues",
    "Justifier l’existence et l’unicité d’une solution, puis l’encadrer par balayage ou dichotomie",
    "Manipuler les racines n-ièmes et les puissances d’exposant rationnel",
  ],
  modules: [
    { id: "official-course", title: "Leçon officielle", description: "Progression fidèle au document source.", lessons: builtLevels },
  ],
};
