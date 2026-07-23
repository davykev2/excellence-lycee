import type {
  CurveLessonInteraction,
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TA Maths leçon 07 Systèmes linéaires.pdf";

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
    id: "substitution-elimination",
    title: "Systèmes linéaires : substitution et combinaison",
    summary: "Résoudre un système de deux équations à deux inconnues par deux méthodes classiques.",
    pages: "1",
    section: "B-1. Systèmes d'équations linéaires",
    durationMinutes: 18,
    xp: 60,
    body: String.raw`## Deux méthodes pour un même système

Résolvons dans $\mathbb R\times\mathbb R$ le système :

$$\begin{cases}x-2y=3\\x+y=-3\end{cases}$$

### a) Méthode de substitution

On isole une inconnue dans une équation, puis on la remplace dans l'autre :

$$\begin{cases}x=3+2y\\3+2y+y=-3\end{cases}\iff\begin{cases}x=3+2y\\3y=-6\end{cases}\iff\begin{cases}x=3+2\times(-2)=-1\\y=-2\end{cases}$$

$$S_{\mathbb R\times\mathbb R}=\{(-1\,;-2)\}$$

### b) Méthode de combinaison

On multiplie la première équation par $(-1)$ puis on ajoute membre à membre pour éliminer $x$ :

$$\begin{cases}-x+2y=-3\\x+y=-3\end{cases}\;\Longrightarrow\;3y=-6\;\Longrightarrow\;y=-2$$

En remplaçant $y$ par sa valeur dans la deuxième équation : $x=-1$.

$$S_{\mathbb R\times\mathbb R}=\{(-1\,;-2)\}$$

Les deux méthodes donnent évidemment le même couple : ce sont deux chemins vers la même solution.

> **Erreur fréquente.** La solution d'un système dans $\mathbb R\times\mathbb R$ est un **couple**, pas deux nombres séparés. L'ordre compte : $(-1\,;-2)$ et $(-2\,;-1)$ ne désignent pas la même chose.

> **Astuce mémoire de Davy.** « Substitution quand une inconnue est facile à isoler ; combinaison quand les coefficients se ressemblent. » Et dans tous les cas, **vérifie** ton couple dans les **deux** équations de départ — c'est gratuit et ça élimine toute erreur de calcul.`,
    keyPoint: "Éliminer une inconnue, calculer l'autre, puis remplacer et vérifier.",
    example: "$\\{x-2y=3\\,;\\,x+y=-3\\}$ a pour solution $(-1\\,;-2)$.",
    methodSteps: [
      "Choisis substitution ou combinaison.",
      "Détermine une première inconnue.",
      "Remplace pour trouver la seconde puis vérifie le couple.",
    ],
    timeline: [
      { label: "Éliminer", detail: "Faire disparaître une inconnue du système." },
      { label: "Calculer", detail: "Résoudre l'équation à une inconnue obtenue." },
      { label: "Vérifier", detail: "Contrôler le couple dans les deux équations." },
    ],
    questions: [
      short("Pour le système officiel, calcule $y$.", ["-2", "−2"], "La combinaison donne $3y=-6$.", "Exemple officiel, page 1"),
      short("Calcule $x$.", ["-1", "−1"], "Dans $x+y=-3$, remplacer $y$ par $-2$ donne $x=-1$.", "Exemple officiel, page 1"),
      choice("Quel est l'ensemble solution ?", ["$\\{(-2\\,;-1)\\}$", "$\\{(-1\\,;-2)\\}$", "$\\{(1\\,;2)\\}$", "$\\varnothing$"], 1, "Le couple est écrit dans l'ordre $(x\\,;y)$.", "Exemple officiel, page 1"),
      choice("L'équation $2x+3y-4=0$ admet dans $\\mathbb R\\times\\mathbb R$ :", ["aucune solution", "une seule solution", "une infinité de solutions"], 2, "Une équation linéaire à deux inconnues décrit une droite entière.", "Exercice d'application 1, affirmation 2, page 6"),
      choice("Dans $\\mathbb R\\times\\mathbb R$, l'inéquation $x+y-2>0$ admet :", ["0 solution", "une infinité de solutions", "1 solution"], 1, "C'est tout un demi-plan.", "Exercice d'application 2, question 4, page 6"),
    ],
  },
  {
    id: "log-exp-systems",
    title: "Systèmes logarithmiques et exponentiels",
    summary: "Linéariser le système par un changement de variables, puis revenir aux inconnues initiales.",
    pages: "1-2, 6-8",
    section: "B-2. Systèmes de type logarithmique ou exponentiel",
    durationMinutes: 22,
    xp: 70,
    body: String.raw`## La méthode : changement de variables

Les systèmes du type

$$\begin{cases}a\ln x+b\ln y=c\\a'\ln x+b'\ln y=c'\end{cases}\qquad\text{ou}\qquad\begin{cases}ae^x+be^y=c\\a'e^x+b'e^y=c'\end{cases}$$

se résolvent par **changement de variables**.

### Exemple 1 entièrement rédigé — système logarithmique

$$(S_1):\begin{cases}2\ln x-\ln y=-2\\4\ln x+\ln y=5\end{cases}$$

**Contraintes** : $x>0$ et $y>0$. On pose $X=\ln x$ et $Y=\ln y$ :

$$\begin{cases}2X-Y=-2\quad(i)\\4X+Y=5\quad(ii)\end{cases}$$

De $(i)$ on tire $Y=2X+2$. En remplaçant dans $(ii)$ : $4X+2X+2=5$, soit $6X=3$ et $X=\dfrac12$.

Alors $Y=2\left(\dfrac12\right)+2=3$. On revient aux inconnues :

$$\ln x=\frac12\;\Rightarrow\;x=e^{1/2}\qquad\ln y=3\;\Rightarrow\;y=e^3$$

Le couple solution est $\left(e^{1/2}\,;\,e^3\right)$.

### Exemple 2 entièrement rédigé — système exponentiel

$$(S_2):\begin{cases}e^x+3e^y=5\\2e^x-e^y=3\end{cases}$$

On pose $X=e^x>0$ et $Y=e^y>0$ :

$$\begin{cases}X+3Y=5\\2X-Y=3\end{cases}$$

Par combinaison : $-7Y=-7$ donc $Y=1>0$, puis $7X=14$ donc $X=2>0$.

$$e^x=2\;\Rightarrow\;x=\ln2\qquad e^y=1\;\Rightarrow\;y=0$$

Le couple solution est $(\ln2\,;\,0)$.

### Exercice d'approfondissement rédigé

$$(S):\begin{cases}\ln x^2+3\ln y^2=4\\\ln x^2-\ln y^2=4\end{cases}$$

**Contraintes** : $x\neq0$ et $y\neq0$ (et non $x>0$ : le carré est déjà positif). Avec $X=\ln x^2$ et $Y=\ln y^2$, on obtient $X=4$ et $Y=0$, d'où $x^2=e^4$ et $y^2=1$.

Les **quatre** couples solutions sont : $(e^2;1)$, $(e^2;-1)$, $(-e^2;1)$ et $(-e^2;-1)$.

> **Erreur fréquente.** Après le changement de variables, il faut **vérifier la contrainte** ($X>0$ pour une exponentielle) puis **revenir aux inconnues de départ**. S'arrêter à $X=2$ et $Y=1$, c'est répondre à une autre question que celle posée.

> **Astuce mémoire de Davy.** « Poser, résoudre, revenir. » Trois temps, jamais deux. Et attention au piège de $\ln x^2$ : la contrainte est $x\neq0$, ce qui ouvre la porte aux solutions **négatives** — d'où quatre couples au lieu d'un.`,
    keyPoint: "Changer de variables, résoudre, vérifier la positivité, revenir à x et y.",
    example: "$2\\ln x-\\ln y=-2$ et $4\\ln x+\\ln y=5$ donnent $(x,y)=(e^{1/2},e^3)$.",
    methodSteps: [
      "Écris les contraintes sur x et y.",
      "Pose les nouvelles variables et résous le système linéaire.",
      "Reviens aux inconnues et vérifie la positivité.",
    ],
    timeline: [
      { label: "Contraintes", detail: "x > 0 pour ln ; X > 0 pour une exponentielle." },
      { label: "Linéariser", detail: "Poser X et Y pour obtenir un système classique." },
      { label: "Revenir", detail: "Repasser à x et y avec exp ou ln." },
    ],
    questions: [
      choice("Dans le premier système officiel, quelles nouvelles variables utilise-t-on ?", ["$X=x^2$, $Y=y^2$", "$X=\\ln x$, $Y=\\ln y$", "$X=e^x$, $Y=e^y$", "$X=x+y$, $Y=x-y$"], 1, "Le système est linéaire en $\\ln x$ et $\\ln y$.", "Exemple S1, page 2"),
      choice("Quelle solution obtient-on pour ce système ?", ["$(e^2,e^3)$", "$(e^{1/2},e^3)$", "$(1/2,3)$", "$(\\ln2,0)$"], 1, "$X=1/2$ et $Y=3$, puis on revient à $x$ et $y$.", "Exemple S1, page 2", 2),
      choice("Quelle est la solution du système exponentiel officiel ?", ["$(2,1)$", "$(\\ln2,0)$", "$(e^2,e)$", "$(0,\\ln2)$"], 1, "$e^x=2$ et $e^y=1$ donnent $x=\\ln2$, $y=0$.", "Exemple S2, page 2", 2),
      choice("La solution de $\\{x+y=2\\,;\\,\\ln x+\\ln y=0\\}$ est :", ["$(1;1)$", "$(3;-1)$", "$(e;e^{-1})$"], 0, "$\\ln(xy)=0$ donne $xy=1$, avec $x+y=2$ : $x=y=1$.", "Exercice d'application 2, question 1, page 6", 2),
      choice("La solution de $\\{\\ln x+\\ln y=3\\,;\\,2\\ln x-\\ln y=0\\}$ est :", ["$(1;2)$", "$(e;e^2)$", "$(e^2;e)$"], 1, "$X=1$ et $Y=2$ donnent $x=e$ et $y=e^2$.", "Exercice d'application 2, question 2, page 6", 2),
      choice("Combien le système $\\{\\ln x^2+3\\ln y^2=4\\,;\\,\\ln x^2-\\ln y^2=4\\}$ a-t-il de couples solutions ?", ["1", "2", "4"], 2, "$x^2=e^4$ et $y^2=1$ donnent deux valeurs pour x et deux pour y.", "Exercice d'approfondissement 1, page 8", 2),
      short("Pour le système $\\{-x+y=1\\,;\\,e^x+e^y=1\\}$, exprime $x$ en fonction de $e$.", ["-ln(1+e)", "−ln(1+e)", "-ln(1+e)", "x=-ln(1+e)"], "$e^x(1+e)=1$ donne $x=-\\ln(1+e)$.", "Exercice de renforcement, page 7", 2),
    ],
  },
  {
    id: "linear-inequalities-halfplanes",
    title: "Inéquation linéaire et demi-plan",
    summary: "Construire la frontière et sélectionner le demi-plan solution avec un point test.",
    pages: "3-4",
    section: "B-3-a. Inéquation dans ℝ × ℝ",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## Méthode de résolution — elle est graphique

Considérons l'inéquation $(I):ax+by+c>0$ et soit $(D)$ la droite d'équation $ax+by+c=0$.

La droite $(D)$ partage le plan en **deux demi-plans ouverts** (qui ne contiennent pas $(D)$) :

- l'un dont les points $M(x;y)$ vérifient $ax+by+c>0$ ;
- l'autre dont les points vérifient $ax+by+c<0$.

La droite $(D)$ est appelée la **frontière** de ces deux demi-plans.

## Le point test

On considère $A(x_A;y_A)$ un point **n'appartenant pas** à $(D)$ :

| Si… | alors l'ensemble des solutions est… |
|---|---|
| $ax_A+by_A+c>0$ | le demi-plan ouvert de frontière $(D)$ **contenant** $A$ |
| $ax_A+by_A+c<0$ | le demi-plan ouvert de frontière $(D)$ **ne contenant pas** $A$ |

**Remarque.** Pour une inéquation du type $ax+by+c\ge0$, l'ensemble des solutions est un demi-plan **fermé**, c'est-à-dire qui **contient** la droite $(D)$.

### Exercice de fixation entièrement rédigé

Résolvons $(I):x+y+1>0$.

Soit $(D):x+y+1=0$, que l'on trace. Considérons l'origine $O(0;0)$ :

$$0+0+1=1\quad\text{et}\quad1>0$$

Le couple $(0;0)$ est donc solution. L'ensemble des solutions de $(I)$ est le demi-plan **ouvert** de frontière $(D)$ **contenant** le point $O$ — la droite $(D)$ n'en fait pas partie.

> **Erreur fréquente.** Le point test ne doit **jamais** appartenir à la droite frontière : sinon le calcul donne $0$ et ne permet de choisir aucun côté. L'origine est le test le plus commode… sauf quand la droite passe par elle.

> **Astuce mémoire de Davy.** « Trace, teste, tranche. » Trace la frontière, teste l'origine, tranche le bon côté. Et retiens le code visuel : **trait plein** si la frontière est incluse ($\ge$, $\le$), **trait pointillé** si elle est exclue ($>$, $<$).`,
    keyPoint: "Strict : frontière exclue ; large : frontière incluse. Un point test choisit le côté.",
    example: "$x+y+1>0$ contient l'origine car $0+0+1>0$ ; la droite $x+y+1=0$ est exclue.",
    methodSteps: [
      "Trace la droite frontière.",
      "Teste un point hors de la droite, souvent l'origine.",
      "Choisis le demi-plan et précise si la frontière est incluse.",
    ],
    timeline: [
      { label: "Frontière", detail: "Tracer la droite ax + by + c = 0." },
      { label: "Test", detail: "Calculer le signe en un point hors de la droite." },
      { label: "Trancher", detail: "Garder le bon côté, frontière incluse ou non." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La frontière x + y + 1 = 0",
      instruction: "Déplace le point sur la droite : au-dessus, x + y + 1 est positif ; en dessous, négatif.",
      observation: "La droite y = −x − 1 sépare le plan. L'origine O(0 ; 0) est au-dessus : 0 + 0 + 1 = 1 > 0, donc le demi-plan solution de x + y + 1 > 0 est celui qui contient O — sans la droite elle-même.",
      formula: "(D) : y = -x - 1",
      formulaTex: "(D):y=-x-1",
      rule: { kind: "linear", coefficient: -1, constant: -1 },
      window: { xMin: -5, xMax: 5, yMin: -5, yMax: 4 },
      guides: [
        { kind: "vertical", value: 0, label: "x = 0" },
        { kind: "horizontal", value: 0, label: "y = 0" },
      ],
      marker: { min: -5, max: 5, step: 0.1, initial: -1 },
    },
    questions: [
      choice("L'origine vérifie-t-elle $x+y+1>0$ ?", ["Oui", "Non"], 0, "$0+0+1=1>0$.", "Exercice de fixation, page 4"),
      choice("La droite $x+y+1=0$ appartient-elle à la solution de $x+y+1>0$ ?", ["Oui", "Non"], 1, "L'inégalité est stricte : le demi-plan est ouvert.", "Exercice de fixation, page 4"),
      choice("Pour une inéquation du type $ax+by+c\\ge0$, le demi-plan solution est :", ["ouvert", "fermé", "vide", "le plan entier"], 1, "L'inégalité large inclut la frontière.", "Remarque, page 3"),
      choice("$(2;0)$ est-il solution de $x-3y\\le1$ ?", ["Vrai", "Faux"], 1, "$2-0=2$, qui n'est pas inférieur ou égal à 1.", "Exercice d'application 1, affirmation 1, page 6"),
      choice("Pourquoi le point test ne doit-il pas être sur la frontière ?", ["Le calcul donnerait 0, sans permettre de choisir un côté", "Le calcul serait trop long", "La droite n'est pas tracée", "Il n'y a pas de raison"], 0, "Sur la droite, $ax+by+c=0$ : ni positif ni négatif.", "Méthode, page 3", 2),
    ],
  },
  {
    id: "inequality-systems-modeling",
    title: "Systèmes d'inéquations dans le plan",
    summary: "Résoudre chaque inéquation puis prendre l'intersection des demi-plans.",
    pages: "4-5",
    section: "B-3-b. Systèmes d'inéquations",
    durationMinutes: 22,
    xp: 75,
    body: String.raw`## Méthode de résolution — également graphique

Soit le système :

$$(S):\begin{cases}ax+by+c\ge0\\a'x+b'y+c'<0\end{cases}$$

On désigne par $(S_1)$ l'ensemble des solutions de la première inéquation et par $(S_2)$ celui de la seconde. **L'ensemble des solutions du système $(S)$ est l'intersection de $(S_1)$ et $(S_2)$.**

### Exercice de fixation entièrement rédigé

$$(S):\begin{cases}2x-y+1<0\\x-2y+4\ge0\end{cases}$$

**Première inéquation** $(I_1):2x-y+1<0$, de frontière $(D_1):2x-y+1=0$.

Test à l'origine : $2\times0-0+1=1$ et $1>0$. L'origine **ne vérifie pas** $(I_1)$. L'ensemble $(H_1)$ est donc le demi-plan **ouvert** de frontière $(D_1)$ **ne contenant pas** $O$.

**Seconde inéquation** $(I_2):x-2y+4\ge0$, de frontière $(D_2):x-2y+4=0$.

Test à l'origine : $0-2\times0+4=4$ et $4>0$. L'origine **vérifie** $(I_2)$. L'ensemble $(H_2)$ est le demi-plan **fermé** de frontière $(D_2)$ **contenant** $O$.

**Conclusion.** L'ensemble des solutions $(H)$ du système est l'**intersection** de $(H_1)$ et $(H_2)$.

> **Erreur fréquente.** On confond souvent intersection et réunion. Un couple n'est solution du système que s'il vérifie **toutes** les inéquations **à la fois** : il faut donc la zone **commune**, pas la zone totale.

> **Astuce mémoire de Davy.** « Une couleur par inéquation, la solution est là où les couleurs se superposent. » Colorie chaque demi-plan différemment : la zone qui cumule toutes les teintes est ton ensemble solution.`,
    keyPoint: "Solution du système = intersection de tous les demi-plans solutions.",
    example: "Le système $2x-y+1<0$ et $x-2y+4\\ge0$ combine un demi-plan ouvert et un demi-plan fermé.",
    methodSteps: [
      "Résous graphiquement chaque inéquation.",
      "Hachure ou colore chaque demi-plan.",
      "Garde uniquement leur zone commune.",
    ],
    timeline: [
      { label: "Une par une", detail: "Résoudre chaque inéquation séparément." },
      { label: "Superposer", detail: "Colorer chaque demi-plan solution." },
      { label: "Intersecter", detail: "La solution est la zone commune à toutes." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La frontière (D₁) : 2x − y + 1 = 0",
      instruction: "Déplace le point : l'origine O(0 ; 0) est-elle au-dessus ou en dessous de cette droite ?",
      observation: "La droite y = 2x + 1 passe au-dessus de l'origine (en x = 0, elle vaut 1). Comme 2(0) − 0 + 1 = 1 > 0, l'origine ne vérifie PAS 2x − y + 1 < 0 : le demi-plan solution est celui qui ne contient pas O, soit au-dessus de la droite.",
      formula: "(D₁) : y = 2x + 1",
      formulaTex: "(D_1):y=2x+1",
      rule: { kind: "linear", coefficient: 2, constant: 1 },
      window: { xMin: -4, xMax: 4, yMin: -4, yMax: 7 },
      guides: [
        { kind: "vertical", value: 0, label: "x = 0" },
        { kind: "horizontal", value: 0, label: "y = 0" },
      ],
      marker: { min: -4, max: 4, step: 0.1, initial: 0 },
    },
    questions: [
      choice("Pour $2x-y+1<0$, l'origine est-elle solution ?", ["Oui", "Non"], 1, "$2\\times0-0+1=1$, qui n'est pas inférieur à 0.", "Exercice de fixation, page 5"),
      choice("Pour $x-2y+4\\ge0$, l'origine est-elle solution ?", ["Oui", "Non"], 0, "$4\\ge0$.", "Exercice de fixation, page 5"),
      choice("L'ensemble solution du système est :", ["La réunion des demi-plans", "L'intersection des demi-plans", "Uniquement les frontières", "Toujours vide"], 1, "Les deux inéquations doivent être vérifiées simultanément.", "Méthode, page 4"),
      choice("Le demi-plan solution de $2x-y+1<0$ est :", ["fermé et contient O", "ouvert et contient O", "ouvert et ne contient pas O", "fermé et ne contient pas O"], 2, "Inégalité stricte donc ouvert, et l'origine ne la vérifie pas.", "Exercice de fixation, page 5", 2),
      choice("Le demi-plan solution de $x-2y+4\\ge0$ est :", ["fermé et contient O", "ouvert et contient O", "ouvert et ne contient pas O", "fermé et ne contient pas O"], 0, "Inégalité large donc fermé, et l'origine la vérifie.", "Exercice de fixation, page 5", 2),
    ],
  },
  {
    id: "awale-mission",
    title: "Mission — le concours d'awalé",
    summary: "Modéliser une situation concrète par un système d'équations et l'interpréter.",
    pages: "5-6",
    section: "C. Situation complexe",
    durationMinutes: 24,
    xp: 80,
    kind: "challenge",
    body: String.raw`## L'énoncé

Les élèves de Terminale A organisent un concours de jeu d'**awalé**. Willy et Kévin s'affrontent ; Willy est plus expérimenté.

- Lorsque **Willy** gagne une partie, on lui donne **5 points** et 0 point pour Kévin.
- Lorsque **Kévin** gagne une partie, on lui donne **8 points** et 0 point pour Willy.

Les deux amis livrent **26 matchs**, sans match nul, puis arrêtent le jeu avec **le même nombre de points**.

Combien de parties chacun a-t-il gagnées ?

## 1. Je modélise le problème

Soit $x$ le nombre de parties gagnées par Willy et $y$ celui gagné par Kévin. Ce sont des **entiers naturels non nuls**, et :

$$\begin{cases}x+y=26&\text{(26 matchs, sans match nul)}\\5x=8y&\text{(les deux ont le même total de points)}\end{cases}$$

## 2. Je résous le système

$$\begin{cases}x+y=26\\5x-8y=0\end{cases}$$

Je multiplie la première équation par $(-5)$ :

$$\begin{cases}-5x-5y=-130\quad(1)\\5x-8y=0\quad\;\;\;\;(2)\end{cases}$$

En additionnant $(1)$ et $(2)$ : $-13y=-130$, donc $y=10$.

En remplaçant dans $x+y=26$ : $x+10=26$, donc $x=16$.

## 3. Je conclus

**Willy a gagné 16 parties et Kévin en a gagné 10.**

### Vérification

$16+10=26$ matchs ✓ — et les points : Willy $5\times16=80$, Kévin $8\times10=80$ ✓. Les deux totaux sont bien égaux.

> **Pourquoi Willy gagne-t-il plus de parties tout en faisant match nul ?** Parce que chacune de ses victoires rapporte moins (5 points contre 8). Le barème compense son avance : il doit gagner plus souvent pour arriver au même score. C'est tout l'intérêt de la modélisation — le système traduit fidèlement cette règle du jeu.

> **Erreur fréquente.** La seconde équation traduit l'**égalité des points**, pas le total des matchs : c'est $5x=8y$, et surtout pas $5x+8y=26$. Relis chaque phrase de l'énoncé et demande-toi quelle grandeur elle compare.

> **Astuce mémoire de Davy.** « Une phrase = une équation. » Ici : « 26 matchs » donne $x+y=26$, « le même nombre de points » donne $5x=8y$. Et termine **toujours** par une vérification dans le contexte concret.`,
    keyPoint: "Traduire chaque phrase en équation, résoudre, puis vérifier dans le contexte concret.",
    example: "$\\{x+y=26\\,;\\,5x=8y\\}$ donne $x=16$ et $y=10$.",
    methodSteps: [
      "Nomme les inconnues et précise leur nature (entiers, positifs…).",
      "Traduis chaque phrase de l'énoncé en une équation.",
      "Résous puis vérifie le résultat dans la situation concrète.",
    ],
    timeline: [
      { label: "Nommer", detail: "x et y désignent les parties gagnées par chacun." },
      { label: "Traduire", detail: "Une équation par contrainte de l'énoncé." },
      { label: "Vérifier", detail: "Contrôler matchs et points dans le contexte." },
    ],
    questions: [
      choice("Quelle équation traduit « les deux amis livrent 26 matchs, sans match nul » ?", ["$5x=8y$", "$x+y=26$", "$5x+8y=26$", "$x-y=26$"], 1, "Chaque match a un vainqueur, donc le total des victoires vaut 26.", "C-Situation complexe, pages 5-6"),
      choice("Quelle équation traduit « ils arrêtent avec le même nombre de points » ?", ["$x+y=26$", "$5x=8y$", "$5x+8y=0$", "$8x=5y$"], 1, "Willy marque $5x$ points et Kévin $8y$ points.", "C-Situation complexe, page 6", 2),
      short("Combien de parties Kévin a-t-il gagnées ?", ["10"], "$-13y=-130$ donne $y=10$.", "C-Situation complexe, page 6", 2),
      short("Combien de parties Willy a-t-il gagnées ?", ["16"], "$x+10=26$ donne $x=16$.", "C-Situation complexe, page 6", 2),
      short("Combien de points chacun totalise-t-il à la fin ?", ["80"], "$5\\times16=80$ et $8\\times10=80$.", "Vérification de la situation complexe", 2),
      choice("Pourquoi Willy gagne-t-il plus de parties que Kévin ?", ["Parce qu'il joue plus vite", "Parce que chaque victoire lui rapporte moins de points", "Parce qu'il a commencé", "C'est une erreur d'énoncé"], 1, "5 points contre 8 : il lui faut plus de victoires pour le même total.", "Interprétation de la situation complexe", 2),
    ],
  },
  {
    id: "cocktail-programming-mission",
    title: "Mission finale — le cocktail sous contraintes",
    summary: "Traduire des contraintes économiques en système d'inéquations et lire le domaine des possibilités.",
    pages: "1, 8-9",
    section: "A-Situation d'apprentissage et exercice d'approfondissement 2",
    durationMinutes: 30,
    xp: 90,
    kind: "challenge",
    body: String.raw`## L'énoncé

Pour réaliser un cocktail, on achète $x$ bouteilles d'un litre de jus d'**orange à 800 F** le litre et $y$ bouteilles d'un litre de jus de **pomme à 600 F** le litre.

On veut obtenir **au moins 8 litres** de mélange, mais on ne veut pas dépenser **plus de 8000 F**.

## 1. Je justifie le système

- $x$ et $y$ sont des **quantités** : donc $x\ge0$ et $y\ge0$.
- Le nombre total de litres est $x+y$, et on en veut au moins 8 : donc $x+y\ge8$.
- Le coût total est $800x+600y$, plafonné à 8000 F : donc $800x+600y\le8000$, ce qui se simplifie en $8x+6y\le80$.

$$(S):\begin{cases}x\ge0\\y\ge0\\x+y\ge8\\8x+6y\le80\end{cases}$$

## 2. Je résous graphiquement

| Inéquation | Frontière | Test en $O(0;0)$ | Demi-plan retenu |
|---|---|---|---|
| $x\ge0$ | l'axe $(OJ)$ | — | à droite de l'axe |
| $y\ge0$ | l'axe $(OI)$ | — | au-dessus de l'axe |
| $x+y\ge8$ | $x+y-8=0$ | $-8<0$ | celui **ne contenant pas** $O$ |
| $8x+6y\le80$ | $8x+6y-80=0$ | $-80<0$ | celui **contenant** $O$ |

L'ensemble $(H)$ des solutions est l'**intersection** des quatre demi-plans : un quadrilatère délimité par les axes et les deux droites. C'est le **domaine des possibilités**.

## 3. Les couples à coordonnées entières

Il y a exactement **45 couples** d'entiers dans le domaine :

| $x$ | valeurs possibles de $y$ |
|---|---|
| 0 | 8, 9, 10, 11, 12, 13 |
| 1 | 7, 8, 9, 10, 11, 12 |
| 2 | 6, 7, 8, 9, 10 |
| 3 | 5, 6, 7, 8, 9 |
| 4 | 4, 5, 6, 7, 8 |
| 5 | 3, 4, 5, 6 |
| 6 | 2, 3, 4, 5 |
| 7 | 1, 2, 3, 4 |
| 8 | 0, 1, 2 |
| 9 | 0, 1 |
| 10 | 0 |

## 4. Retour à la situation de départ

La situation d'apprentissage posait la même question avec **au moins 20 bouteilles** pour **24 000 F**. Le budget suffit-il ?

La solution la moins chère consiste à ne prendre que du jus de pomme : $20\times600=12\,000$ F. Comme $12\,000\le24\,000$, **le budget est largement suffisant** — le fabricant peut être rassuré.

> **Erreur fréquente.** « Au moins 8 litres » donne $x+y\ge8$ ; « pas plus de 8000 F » donne $\le$. Inverser un seul de ces deux sens fait basculer le domaine du mauvais côté et rend toute la suite fausse.

> **Astuce mémoire de Davy.** « Au moins → $\ge$ ; au plus, pas plus de → $\le$. » Et n'oublie jamais les contraintes **implicites** : une quantité de bouteilles est toujours positive **et entière**. Le domaine est continu, mais seules ses coordonnées entières ont un sens ici.`,
    keyPoint: "« Au moins » → ≥ ; « pas plus de » → ≤ ; sans oublier les contraintes de positivité.",
    example: "$800x+600y\\le8000$ se simplifie en $8x+6y\\le80$.",
    methodSteps: [
      "Nomme les inconnues et pose les contraintes de positivité.",
      "Traduis chaque contrainte de l'énoncé en inéquation.",
      "Trace les frontières, intersecte les demi-plans, puis relève les points entiers.",
    ],
    timeline: [
      { label: "Modéliser", detail: "Positivité, quantité minimale, budget maximal." },
      { label: "Tracer", detail: "Quatre frontières et quatre demi-plans." },
      { label: "Lire", detail: "Relever les couples entiers du domaine commun." },
    ],
    curve: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La contrainte de budget : 8x + 6y = 80",
      instruction: "Déplace le point sur la droite du budget : combien de bouteilles de pomme peut-on prendre pour x bouteilles d'orange ?",
      observation: "Sous cette droite, le budget est respecté (8x + 6y ≤ 80). Elle coupe l'axe des ordonnées en y ≈ 13,3 (que du jus de pomme) et l'axe des abscisses en x = 10 (que du jus d'orange). Le domaine des possibilités est la zone sous cette droite, au-dessus de x + y = 8.",
      formula: "8x + 6y = 80, soit y = (80 - 8x)/6",
      formulaTex: "y=\\frac{80-8x}{6}",
      rule: { kind: "linear", coefficient: -1.3333, constant: 13.3333 },
      window: { xMin: -1, xMax: 12, yMin: -1, yMax: 15 },
      guides: [
        { kind: "horizontal", value: 0, label: "y = 0" },
        { kind: "vertical", value: 10, label: "x = 10" },
      ],
      marker: { min: 0, max: 11, step: 0.25, initial: 4 },
    },
    corrections: [
      "La liste des couples à coordonnées entières donnée page 9 est incomplète et comporte un doublon : le couple (4 ; 4) y figure deux fois, et quatre couples valides sont absents — (0 ; 13), (3 ; 9), (6 ; 5) et (8 ; 2). Chacun vérifie pourtant les quatre contraintes : par exemple 8(0) + 6(13) = 78 ≤ 80 et 0 + 13 ≥ 8. Le domaine compte donc 45 couples entiers, et non 41.",
      "La situation d'apprentissage de la page 1 (au moins 20 bouteilles pour 24 000 F) n'est jamais résolue dans le document ; l'exercice d'approfondissement 2 en reprend la trame avec d'autres nombres (8 litres, 8000 F). Le niveau traite l'exercice résolu puis répond explicitement à la question initiale du fabricant.",
    ],
    questions: [
      choice("Quelle inéquation traduit « on veut au moins 8 litres de mélange » ?", ["$x+y\\le8$", "$x+y\\ge8$", "$x+y=8$", "$8x+6y\\ge8$"], 1, "« Au moins » impose un minimum.", "Exercice d'approfondissement 2, page 8"),
      choice("Quelle inéquation traduit « on ne veut pas dépenser plus de 8000 F » ?", ["$800x+600y\\ge8000$", "$800x+600y\\le8000$", "$800x+600y=8000$", "$x+y\\le8000$"], 1, "« Pas plus de » impose un plafond.", "Exercice d'approfondissement 2, page 8"),
      short("Simplifie l'inéquation $800x+600y\\le8000$.", ["8x+6y<=80", "8x+6y≤80", "4x+3y<=40", "4x+3y≤40"], "On divise les deux membres par 100.", "Exercice d'approfondissement 2, page 8", 2),
      choice("Pourquoi ajoute-t-on les contraintes $x\\ge0$ et $y\\ge0$ ?", ["Pour simplifier le tracé", "Parce que $x$ et $y$ sont des quantités de bouteilles", "Parce que le prix est positif", "Ce n'est pas nécessaire"], 1, "On ne peut pas acheter un nombre négatif de bouteilles.", "Exercice d'approfondissement 2, page 8"),
      choice("Le couple $(0;13)$ appartient-il au domaine des possibilités ?", ["Oui", "Non"], 0, "$0+13\\ge8$ et $8(0)+6(13)=78\\le80$ : il convient.", "Correction de la liste, page 9", 2),
      choice("Le couple $(5;7)$ appartient-il au domaine ?", ["Oui", "Non"], 1, "$8(5)+6(7)=82>80$ : le budget est dépassé.", "Exercice d'approfondissement 2, page 9", 2),
      short("Combien coûtent 20 bouteilles si l'on ne prend que du jus de pomme à 600 F ?", ["12000", "12 000"], "$20\\times600=12\\,000$ F.", "A-Situation d'apprentissage, page 1", 2),
      choice("Le budget de 24 000 F suffit-il pour 20 bouteilles ?", ["Oui", "Non"], 0, "La solution la moins chère coûte 12 000 F, bien en dessous de 24 000 F.", "A-Situation d'apprentissage, page 1", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index + 1, seed));

export const terminalALinearSystemsPath: LearningPath = {
  id: "terminale-a-linear-systems",
  subjectId: "mathematics",
  levelIds: ["terminale-a"],
  curriculumLabel: "Programme ivoirien • Terminale A • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Fonctions numériques" },
  chapterNumber: 7,
  title: "Systèmes linéaires",
  description: "Le cours officiel intégral : substitution et combinaison, systèmes logarithmiques et exponentiels, demi-plans, systèmes d'inéquations, mission du concours d'awalé et mission finale du cocktail sous contraintes.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Résoudre un système linéaire",
    "Linéariser un système logarithmique ou exponentiel",
    "Résoudre graphiquement des inéquations",
  ],
  modules: [{
    id: "terminale-a-linear-systems-mastery",
    title: "Maîtriser les systèmes linéaires",
    description: "Progression fidèle au document source ; la situation d'apprentissage du cocktail n'apparaît que dans la mission finale, en contexte d'évaluation.",
    lessons: builtLevels,
  }],
};
