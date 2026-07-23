import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TleD_PHY_L1_Cinématique du point.pdf";

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
      tip: "Précise toujours le repère et l’unité : une vitesse est en m·s⁻¹, une accélération en m·s⁻².",
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
    id: "kinematics-rappels",
    title: "Référentiel, repères et trajectoire",
    summary: "Mettre en place le cadre de toute étude de mouvement : référentiel, repère d’espace, repère de temps et trajectoire.",
    pages: "1",
    section: "1. Rappels",
    durationMinutes: 14,
    xp: 40,
    body: String.raw`## Pourquoi un cadre avant tout calcul

Un mouvement n’a de sens **que par rapport à un observateur**. Avant d’écrire la moindre équation, on fixe le cadre de l’étude.

| Notion | Définition |
|---|---|
| **Référentiel** | Objet par rapport auquel on décrit le mouvement d’un autre objet. |
| **Repère d’espace** | Système d’axes lié à un référentiel, où l’on situe le point mobile par ses coordonnées. On utilise en général le repère orthonormé $R(O,\vec{i},\vec{j},\vec{k})$. |
| **Repère de temps** | Permet de dater le mouvement. Il est défini par un instant-origine choisi arbitrairement ($t=0\,\text{s}$). |
| **Trajectoire** | Ensemble des positions successives occupées par le point mobile au cours de son mouvement. |

> **Astuce mémoire.** Repère d’**espace** = *où* est le point ; repère de **temps** = *quand*. Les deux ensemble permettent de suivre le point à chaque instant.

> **Erreur fréquente.** La trajectoire dépend du référentiel choisi : un point de la roue d’un vélo décrit un cercle pour le cycliste, mais une courbe (cycloïde) pour un piéton immobile. Toujours préciser le référentiel avant de nommer une trajectoire.`,
    keyPoint: "Tout mouvement se décrit par rapport à un référentiel, dans un repère d’espace et un repère de temps ; la trajectoire est l’ensemble des positions successives.",
    example: "Dans le repère $R(O,\\vec{i},\\vec{j},\\vec{k})$, on situe le point par ses coordonnées à chaque date $t$.",
    methodSteps: [
      "Choisis le référentiel : par rapport à quoi décris-tu le mouvement ?",
      "Fixe le repère d’espace, en général orthonormé.",
      "Choisis l’instant-origine des dates (t = 0 s).",
      "Décris alors la trajectoire dans ce cadre.",
    ],
    interaction: timeline(
      [
        { label: "Référentiel", detail: "L’objet de référence par rapport auquel on observe le mouvement." },
        { label: "Repère d’espace", detail: "Les axes orthonormés (O, i, j, k) qui donnent les coordonnées." },
        { label: "Repère de temps", detail: "L’origine des dates t = 0 s qui permet de dater les positions." },
        { label: "Trajectoire", detail: "La courbe formée par toutes les positions successives du point." },
      ],
      "Mettre en place le cadre de l’étude",
      "Parcours les quatre éléments à fixer avant toute étude de mouvement.",
      "Sans référentiel ni repère, une position ou une vitesse n’a aucun sens.",
    ),
    questions: [
      choice("Un référentiel est…", ["l’objet par rapport auquel on décrit un mouvement", "la vitesse d’un objet", "la durée du mouvement", "la forme de la trajectoire"], 0, "Le référentiel est l’objet de référence de l’observation.", "1.1 Le référentiel"),
      choice("La trajectoire d’un point matériel est…", ["l’ensemble de ses positions successives", "sa vitesse à chaque instant", "son accélération", "la durée de son parcours"], 0, "C’est la définition du cours.", "1.4 Trajectoire"),
      choice("Le repère de temps est défini par…", ["un instant-origine des dates (t = 0 s)", "trois axes orthonormés", "la masse du mobile", "la longueur de la trajectoire"], 0, "Le repère de temps sert à dater les positions.", "1.3 Le repère temps"),
      choice("Le repère d’espace généralement utilisé est…", ["orthonormé", "quelconque", "toujours à un seul axe", "sans origine"], 0, "On travaille dans un repère orthonormé $R(O,\\vec i,\\vec j,\\vec k)$.", "1.2 Le repère d’espace"),
    ],
  },
  {
    id: "position-vector",
    title: "Le vecteur-position",
    summary: "Écrire le vecteur-position dans un repère cartésien et reconnaître les équations horaires.",
    pages: "1-2",
    section: "2. Vecteur-position",
    durationMinutes: 16,
    xp: 50,
    body: String.raw`## Définition

Le **vecteur-position** $\overrightarrow{OM}$ donne la position du point matériel $M$ dans un repère d’espace, à chaque instant $t$.

## Expression dans un repère cartésien

| Type de mouvement | Vecteur-position |
|---|---|
| Dans l’espace | $\overrightarrow{OM}=x\,\vec{i}+y\,\vec{j}+z\,\vec{k}$ |
| Dans un plan | $\overrightarrow{OM}=x\,\vec{i}+y\,\vec{j}$ |
| Sur une droite | $\overrightarrow{OM}=x\,\vec{i}$ |

Les coordonnées $(x,y,z)$ sont les **équations horaires** (ou équations paramétriques) du mouvement : chacune est une fonction du temps.

> **Équation cartésienne de la trajectoire.** C’est la relation qui lie directement $x$, $y$ (et $z$), **sans le temps**. On l’obtient en éliminant $t$ entre les équations horaires.

## Exemple guidé

Pour $x(t)=t$ et $y(t)=-\dfrac12 t^2+2$ : comme $t=x$, on remplace dans $y$ :

$$y=-\frac12 x^2+2$$

La trajectoire est donc une **parabole** — c’est ce que trace la figure ci-dessous.`,
    keyPoint: "Le vecteur-position s’écrit OM = x·i + y·j (+ z·k) ; ses coordonnées sont les équations horaires du mouvement.",
    example: "Pour $\\overrightarrow{OM}=-2t\\,\\vec{i}+t^2\\,\\vec{j}$, les équations horaires sont $x=-2t$ et $y=t^2$.",
    methodSteps: [
      "Repère la dimension du mouvement : droite, plan ou espace.",
      "Écris OM avec les vecteurs de base correspondants.",
      "Lis les équations horaires x(t), y(t), z(t).",
      "Pour la trajectoire, élimine t entre les équations horaires.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La trajectoire de l’activité 1",
      instruction: "Déplace le point : sa position (x ; y) décrit une trajectoire quand le temps passe.",
      observation: "En éliminant t entre x = t et y = -½t² + 2, on obtient la parabole y = -½x² + 2 : c’est l’équation cartésienne de la trajectoire.",
      formula: "y = -½x² + 2",
      formulaTex: "y=-\\tfrac12 x^2+2",
      rule: { kind: "polynomial", coefficients: [2, 0, -0.5] },
      window: { xMin: -3, xMax: 3, yMin: -3, yMax: 3 },
      marker: { min: -3, max: 3, step: 0.1, initial: 0 },
    },
    questions: [
      short("Pour $\\overrightarrow{OM}=-2t\\,\\vec{i}+t^2\\,\\vec{j}$ (en cm), donne l’équation horaire $x(t)$.", ["x=-2t", "-2t"], "On lit la composante selon $\\vec i$.", "Exercice 1 - question 1"),
      short("Pour la même fonction, donne $y(t)$.", ["y=t^2", "t^2", "t²"], "On lit la composante selon $\\vec j$.", "Exercice 1 - question 1"),
      choice("À $t=0$ s, le vecteur-position $\\overrightarrow{OM_0}$ de l’exercice 1 vaut…", ["$\\vec 0$", "$-2\\vec i$", "$\\vec i+\\vec j$", "$t^2\\vec j$"], 0, "$x(0)=0$ et $y(0)=0$, donc $\\overrightarrow{OM_0}=\\vec 0$.", "Exercice 1 - question 2"),
      short("À $t=1$ s, donne $\\overrightarrow{OM_1}$ de l’exercice 1.", ["-2i+j", "-2 i + j", "-2vec i+vec j"], "$x(1)=-2$ et $y(1)=1$, donc $\\overrightarrow{OM_1}=-2\\vec i+\\vec j$.", "Exercice 1 - question 2", 2),
      choice("Les coordonnées du vecteur-position s’appellent aussi…", ["les équations horaires du mouvement", "l’accélération", "le référentiel", "la vitesse angulaire"], 0, "Ce sont les équations horaires ou paramétriques.", "2.2 Expression"),
    ],
  },
  {
    id: "velocity-vector",
    title: "Le vecteur-vitesse",
    summary: "Dériver le vecteur-position, calculer la valeur de la vitesse et découvrir la base de Frenet.",
    pages: "2",
    section: "3. Vecteur-vitesse",
    durationMinutes: 18,
    xp: 60,
    body: String.raw`## Définition

Le **vecteur-vitesse instantanée** est la dérivée du vecteur-position par rapport au temps :

$$\vec{v}=\frac{d\overrightarrow{OM}}{dt}$$

## Expression dans le repère cartésien

$$\vec{v}=\dot{x}\,\vec{i}+\dot{y}\,\vec{j}+\dot{z}\,\vec{k}$$

où $\dot{x}=\dfrac{dx}{dt}$. La **valeur** de la vitesse est :

$$v=\sqrt{\dot{x}^2+\dot{y}^2+\dot{z}^2}\qquad(\text{en } \text{m·s}^{-1})$$

## Exemple guidé (activité 1)

Pour $x(t)=t$ et $y(t)=-\dfrac12 t^2+2$ :

$$v_x=\dot{x}=1\quad;\quad v_y=\dot{y}=-t\qquad\Longrightarrow\qquad v=\sqrt{1+t^2}$$

## La base de Frenet $(\vec{\tau},\vec{n})$

C’est une base **liée au point mobile** :

- $\vec{\tau}$ : vecteur unitaire **tangent** à la trajectoire, dans le sens du mouvement ;
- $\vec{n}$ : vecteur unitaire **normal** à $\vec{\tau}$, orienté vers la concavité.

Dans cette base, la vitesse s’écrit simplement $\vec{v}=v\,\vec{\tau}$, avec $v=\dfrac{ds}{dt}=\dot{s}$, où $s$ est l’**abscisse curviligne**.

> **Le point clé de Frenet.** La vitesse est **toujours tangente** à la trajectoire : sa seule composante est portée par $\vec{\tau}$. Il n’y a jamais de vitesse « normale ».`,
    keyPoint: "Le vecteur-vitesse est la dérivée de la position ; sa valeur est √(ẋ²+ẏ²+ż²) et il est toujours tangent à la trajectoire (v = v·τ).",
    example: "Pour $x=2t$ et $y=-t^2$ : $v_x=2$, $v_y=-2t$, et $v=\\sqrt{4+4t^2}$.",
    methodSteps: [
      "Dérive chaque équation horaire par rapport au temps.",
      "Écris le vecteur-vitesse avec ces dérivées comme coordonnées.",
      "Calcule sa valeur avec √(ẋ²+ẏ²+ż²).",
      "Rappelle-toi que la vitesse est portée par le vecteur tangent τ.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "La composante v_y de l’exercice 2",
      instruction: "Déplace le point le long de la droite : la composante v_y du mobile change avec le temps.",
      observation: "Pour x = 2t et y = -t², on a v_y = -2t : une droite. La composante croît (en valeur absolue) régulièrement avec le temps.",
      formula: "v_y(t) = -2t",
      formulaTex: "v_y(t)=-2t",
      rule: { kind: "polynomial", coefficients: [0, -2] },
      window: { xMin: 0, xMax: 3, yMin: -7, yMax: 1 },
      marker: { min: 0, max: 3, step: 0.1, initial: 0.5 },
    },
    questions: [
      short("Pour $x(t)=t$ et $y(t)=-\\tfrac12 t^2+2$, donne la coordonnée $v_x$.", ["1", "v_x=1"], "$v_x=\\dot x=1$.", "Activité d’application 1"),
      short("Pour la même activité, donne $v_y$ en fonction de $t$.", ["-t", "v_y=-t"], "$v_y=\\dot y=-t$.", "Activité d’application 1"),
      short("Donne l’expression de la valeur $v$ pour cette activité.", ["√(1+t^2)", "racine(1+t^2)", "sqrt(1+t^2)"], "$v=\\sqrt{\\dot x^2+\\dot y^2}=\\sqrt{1+t^2}$.", "Activité d’application 1", 2),
      short("Pour $x=2t$, $y=-t^2$, calcule la valeur de $v$ à $t=0{,}5$ s.", ["2,24", "2.24"], "$v=\\sqrt{2^2+(-1)^2}=\\sqrt5\\approx2{,}24$ m·s⁻¹.", "Exercice 2", 2),
      choice("Dans la base de Frenet, le vecteur-vitesse s’écrit…", ["$\\vec v=v\\,\\vec\\tau$", "$\\vec v=v\\,\\vec n$", "$\\vec v=v\\,\\vec\\tau+v\\,\\vec n$", "$\\vec v=\\vec 0$"], 0, "La vitesse est toujours tangente à la trajectoire.", "3.2 Base de Frenet"),
      choice("Le vecteur $\\vec\\tau$ de la base de Frenet est…", ["tangent à la trajectoire, dans le sens du mouvement", "toujours vertical", "dirigé vers le centre de la Terre", "normal à la trajectoire"], 0, "$\\vec\\tau$ est unitaire et tangent.", "3.2 Base de Frenet"),
    ],
  },
  {
    id: "acceleration-vector",
    title: "Le vecteur-accélération",
    summary: "Dériver la vitesse, décomposer l’accélération dans la base de Frenet et distinguer ses deux composantes.",
    pages: "3",
    section: "4. Vecteur-accélération",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## Définition

Le **vecteur-accélération instantanée** est la dérivée du vecteur-vitesse, donc la **dérivée seconde** du vecteur-position :

$$\vec{a}=\frac{d\vec{v}}{dt}=\frac{d^2\overrightarrow{OM}}{dt^2}$$

## Dans le repère cartésien

$$\vec{a}=\ddot{x}\,\vec{i}+\ddot{y}\,\vec{j}+\ddot{z}\,\vec{k}\qquad,\qquad a=\sqrt{\ddot{x}^2+\ddot{y}^2+\ddot{z}^2}\ \ (\text{m·s}^{-2})$$

## Dans la base de Frenet

L’accélération se décompose en **deux composantes** :

$$\vec{a}=a_t\,\vec{\tau}+a_n\,\vec{n}$$

| Composante | Expression | Signification |
|---|---|---|
| **Tangentielle** $a_t$ | $\dfrac{dv}{dt}=\ddot{s}$ | traduit la **variation de la valeur** de la vitesse |
| **Normale** $a_n$ | $\dfrac{v^2}{\rho}$ | traduit le **changement de direction** ; $\rho$ est le rayon de courbure |

La valeur totale est $a=\sqrt{a_t^{\,2}+a_n^{\,2}}$. Si la trajectoire est **circulaire**, $\rho=R$, le rayon du cercle.

> **Ce que chaque composante raconte.** $a_t$ dit si le mobile **accélère ou ralentit** ; $a_n$ existe dès que la trajectoire **tourne**. Un mouvement rectiligne a $a_n=0$ ; un mouvement circulaire uniforme a $a_t=0$.`,
    keyPoint: "L’accélération est la dérivée de la vitesse ; dans Frenet elle vaut a_t·τ + a_n·n, avec a_t = dv/dt et a_n = v²/ρ.",
    example: "Mouvement circulaire uniforme de rayon R = 0,2 m et ω = 250 rad·s⁻¹ : v = Rω = 50 m·s⁻¹ et a = v²/R = 12 500 m·s⁻².",
    methodSteps: [
      "Dérive les coordonnées de la vitesse pour obtenir l’accélération cartésienne.",
      "Pour Frenet, calcule a_t = dv/dt (variation de la valeur de v).",
      "Calcule a_n = v²/ρ (changement de direction).",
      "La valeur totale est a = √(a_t² + a_n²).",
    ],
    interaction: timeline(
      [
        { label: "Accélération tangentielle", shortLabel: "a_t", detail: "a_t = dv/dt : elle change la valeur de la vitesse (le mobile accélère ou ralentit)." },
        { label: "Accélération normale", shortLabel: "a_n", detail: "a_n = v²/ρ : elle change la direction de la vitesse (la trajectoire tourne)." },
        { label: "Valeur totale", shortLabel: "a", detail: "a = √(a_t² + a_n²), combinaison des deux effets." },
      ],
      "Les deux composantes de l’accélération",
      "Compare ce que produit chaque composante sur le mouvement.",
      "Rectiligne ⇒ a_n = 0 ; circulaire uniforme ⇒ a_t = 0.",
    ),
    questions: [
      short("Mobile circulaire uniforme, $R=20$ cm, $\\omega=250$ rad·s⁻¹. Calcule la vitesse linéaire $v$.", ["50", "50 m/s", "50 m.s-1"], "$v=R\\omega=0{,}2\\times250=50$ m·s⁻¹.", "Exercice d’application 2", 2),
      short("Pour ce même mobile, calcule l’accélération $a$.", ["12500", "12 500", "12500 m/s2"], "$a=\\dfrac{v^2}{R}=\\dfrac{50^2}{0{,}2}=12\\,500$ m·s⁻².", "Exercice d’application 2", 2),
      short("Pour $x=2t$, $y=-t^2$, donne la coordonnée $a_y$.", ["-2", "a_y=-2"], "$a_y=\\ddot y=-2$.", "Exercice 3"),
      short("Calcule la valeur de l’accélération $a$ à $t=1$ s pour l’exercice 3.", ["2", "2 m/s2"], "$a=\\sqrt{0^2+(-2)^2}=2$ m·s⁻².", "Exercice 3", 2),
      choice("Pour l’exercice 3, $\\vec a\\cdot\\vec v=-2t\\times(-2)=4t>0$. Le mouvement est…", ["accéléré", "retardé", "uniforme", "circulaire"], 0, "Un produit $\\vec a\\cdot\\vec v>0$ signifie un mouvement accéléré.", "Exercice 3 - question 3"),
      choice("Pour un mouvement rectiligne, l’accélération normale $a_n$ vaut…", ["0", "$v^2/R$", "$\\dot v$", "$g$"], 0, "Une trajectoire rectiligne ne tourne pas : $a_n=0$.", "4.2 Base de Frenet"),
    ],
  },
  {
    id: "rectilinear-uniform-motion",
    title: "Mouvement rectiligne uniforme",
    summary: "Reconnaître un MRU (vecteur-vitesse constant, accélération nulle) et écrire ses équations horaires.",
    pages: "4",
    section: "5.1 Mouvement rectiligne et uniforme",
    durationMinutes: 16,
    xp: 55,
    body: String.raw`## Définition

Un point décrit un **mouvement rectiligne uniforme** (MRU) lorsque son **vecteur-vitesse est constant** :

$$\vec{v}=\overrightarrow{cst}\qquad\text{et donc}\qquad \vec{a}=\vec 0\ \ (a=0\ \text{m·s}^{-2})$$

## Équations horaires

Sur l’axe $(O,\vec{i})$ :

| Grandeur | Expression |
|---|---|
| Accélération | $a=0$ |
| Vitesse | $v=v_0$ (constante) |
| Abscisse | $x=v_0\,t+x_0$ |

où $v_0$ est la vitesse initiale et $x_0$ l’abscisse initiale. **L’abscisse est une fonction affine du temps.**

> **Reconnaître un MRU d’un coup d’œil.** L’équation horaire est de la forme $x=v_0 t+x_0$ : **du premier degré en $t$**, sans terme en $t^2$. Toute présence de $t^2$ exclut le MRU.

## Exemple guidé (activité 3)

Parmi $x=-2t$ ; $x=2t^2-t+1$ ; $x=\dfrac2t+3$ ; $x=t-1$ ; $x=1$ ; $x=\dfrac1{2t^2}$, seules $x=-2t$ et $x=t-1$ sont du premier degré en $t$ : ce sont les MRU.

- $x=-2t$ : $v_0=-2$ m·s⁻¹, $x_0=0$ m ;
- $x=t-1$ : $v_0=1$ m·s⁻¹, $x_0=-1$ m.`,
    keyPoint: "MRU : vitesse constante, accélération nulle, abscisse affine x = v₀·t + x₀ (du premier degré en t).",
    example: "Pour $x=t-1$ : $v_0=1$ m·s⁻¹ et $x_0=-1$ m ; la courbe x(t) est une droite.",
    methodSteps: [
      "Vérifie que l’équation horaire est du premier degré en t (pas de t²).",
      "Identifie le coefficient de t : c’est la vitesse initiale v₀.",
      "Identifie le terme constant : c’est l’abscisse initiale x₀.",
      "Conclus : accélération nulle, vitesse constante.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "L’abscisse d’un MRU : une droite",
      instruction: "Déplace le point : dans un MRU, l’abscisse x augmente de la même quantité à chaque seconde.",
      observation: "Pour x = t - 1, la courbe x(t) est une droite de pente v₀ = 1 : l’abscisse est une fonction affine du temps.",
      formula: "x(t) = t - 1",
      formulaTex: "x(t)=t-1",
      rule: { kind: "polynomial", coefficients: [-1, 1] },
      window: { xMin: 0, xMax: 6, yMin: -2, yMax: 6 },
      marker: { min: 0, max: 6, step: 0.1, initial: 1 },
    },
    questions: [
      choice("Quelle forme a l’équation horaire d’un MRU ?", ["$x=v_0 t+x_0$", "$x=\\tfrac12 a t^2+v_0 t+x_0$", "$x=R\\cos(\\omega t)$", "$x=v_0 t^2$"], 0, "L’abscisse d’un MRU est affine en t.", "5.1.2 Équations horaires"),
      choice("Parmi ces équations, laquelle correspond à un MRU ?", ["$x=-2t$", "$x=2t^2-t+1$", "$x=\\tfrac1{2t^2}$", "$x=\\tfrac2t+3$"], 0, "$x=-2t$ est du premier degré en t.", "Activité d’application 3 - question 2"),
      short("Pour $x=-2t$, donne la vitesse initiale $v_0$ (en m·s⁻¹).", ["-2", "-2 m/s"], "Le coefficient de t est $v_0=-2$.", "Activité d’application 3 - question 3"),
      short("Pour $x=t-1$, donne l’abscisse initiale $x_0$ (en m).", ["-1", "-1 m"], "Le terme constant est $x_0=-1$.", "Activité d’application 3 - question 3"),
      choice("Dans un MRU, le vecteur-accélération vaut…", ["$\\vec 0$", "$\\vec v_0$", "$v^2/R\\,\\vec n$", "$g\\,\\vec j$"], 0, "La vitesse étant constante, l’accélération est nulle.", "5.1.1 Définition"),
    ],
  },
  {
    id: "rectilinear-varied-motion",
    title: "Mouvement rectiligne uniformément varié",
    summary: "Reconnaître un MRUV (accélération constante), écrire ses équations horaires et distinguer accéléré et retardé.",
    pages: "4-5",
    section: "5.2 Mouvement rectiligne et uniformément varié",
    durationMinutes: 22,
    xp: 70,
    body: String.raw`## Définition

Un point décrit un **mouvement rectiligne uniformément varié** (MRUV) si sa trajectoire est **rectiligne** et son **vecteur-accélération constant**.

## Équations horaires (sur l’axe $O,\vec i$)

| Grandeur | Expression |
|---|---|
| Accélération | $a_x=\text{cste}$ |
| Vitesse | $v=a_x\,t+v_0$ *(fonction affine du temps)* |
| Abscisse | $x=\dfrac12 a_x\,t^2+v_0\,t+x_0$ *(fonction du second degré)* |

En combinant ces deux relations entre deux dates, on obtient une relation **sans le temps**, très utile :

$$v_1^2-v_0^2=2\,a_x\,(x_1-x_0)\qquad\text{soit}\qquad \Delta v^2=2\,a_x\,\Delta x$$

## Accéléré ou retardé ?

On compare les **sens** de l’accélération et de la vitesse :

| Signe de $\vec{a}\cdot\vec{v}=a_x\,v_x$ | Mouvement |
|---|---|
| $>0$ | **accéléré** (la valeur de $v$ augmente) |
| $<0$ | **retardé** (la valeur de $v$ diminue) |

> **Reconnaître un MRUV.** L’abscisse est du **second degré** en $t$ : présence d’un terme en $t^2$. Attention, $x=\dfrac1{2t^2}$ n’est **pas** un polynôme (c’est $t$ au dénominateur) : ce n’est pas un MRUV.

## Exemple guidé (activité 4)

Parmi les équations proposées, $x=2t^2-t+1$ et $x=-\dfrac12 t^2-3$ sont du second degré :

- $x=2t^2-t+1$ : par identification avec $\tfrac12 a_x t^2+v_0 t+x_0$, on a $\tfrac12 a_x=2$ donc $a_x=4$ m·s⁻², $v_0=-1$ m·s⁻¹, $x_0=1$ m ;
- $x=-\dfrac12 t^2-3$ : $a_x=-1$ m·s⁻², $v_0=0$, $x_0=-3$ m.`,
    keyPoint: "MRUV : accélération constante ; v = a·t + v₀ et x = ½a·t² + v₀·t + x₀ ; le signe de a·v distingue accéléré (>0) et retardé (<0).",
    example: "Pour $x=2t^2-t+1$ : $a_x=4$ m·s⁻², $v_0=-1$ m·s⁻¹, $x_0=1$ m ; la courbe x(t) est une parabole.",
    methodSteps: [
      "Vérifie que l’abscisse est du second degré en t (terme en t²).",
      "Identifie ½a_x, v₀ et x₀ terme à terme.",
      "Déduis l’accélération a_x en doublant le coefficient de t².",
      "Pour accéléré/retardé, étudie le signe du produit a·v.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "L’abscisse d’un MRUV : une parabole",
      instruction: "Déplace le point : dans un MRUV, l’abscisse varie de plus en plus vite (courbe qui se creuse).",
      observation: "Pour x = 2t² - t + 1, la courbe x(t) est une parabole : le terme en t² traduit une accélération constante a_x = 4 m·s⁻².",
      formula: "x(t) = 2t² - t + 1",
      formulaTex: "x(t)=2t^2-t+1",
      rule: { kind: "polynomial", coefficients: [1, -1, 2] },
      window: { xMin: -1, xMax: 3, yMin: -2, yMax: 16 },
      marker: { min: -1, max: 3, step: 0.1, initial: 0 },
    },
    questions: [
      choice("L’équation horaire de l’abscisse d’un MRUV est…", ["$x=\\tfrac12 a_x t^2+v_0 t+x_0$", "$x=v_0 t+x_0$", "$x=R\\sin(\\omega t)$", "$x=v_0$"], 0, "Elle est du second degré en t.", "5.2.2 Équations horaires"),
      short("Pour $x=2t^2-t+1$, donne l’accélération $a_x$ (en m·s⁻²).", ["4", "4 m/s2"], "$\\tfrac12 a_x=2$ donc $a_x=4$.", "Activité d’application 4 - question 3", 2),
      short("Pour $x=2t^2-t+1$, donne la vitesse initiale $v_0$ (en m·s⁻¹).", ["-1", "-1 m/s"], "Le coefficient de t est $v_0=-1$.", "Activité d’application 4 - question 3"),
      short("Pour $x=-\\tfrac12 t^2-3$, donne $a_x$ (en m·s⁻²).", ["-1", "-1 m/s2"], "$\\tfrac12 a_x=-\\tfrac12$ donc $a_x=-1$.", "Activité d’application 4 - question 3"),
      choice("La relation indépendante du temps dans un MRUV est…", ["$v_1^2-v_0^2=2a_x(x_1-x_0)$", "$x=v_0 t$", "$a=v^2/R$", "$v=R\\omega$"], 0, "C’est la relation $\\Delta v^2=2a_x\\Delta x$.", "5.2.2 Relation"),
      choice("Si $\\vec a\\cdot\\vec v<0$, le mouvement est…", ["retardé", "accéléré", "uniforme", "circulaire"], 0, "Accélération et vitesse de sens contraires : le mobile ralentit.", "5.2.2 Remarque"),
    ],
  },
  {
    id: "circular-uniform-motion",
    title: "Mouvement circulaire uniforme",
    summary: "Repérer un point sur un cercle et exprimer vitesse et accélération dans la base de Frenet.",
    pages: "5-6",
    section: "5.3 Mouvement circulaire et uniforme",
    durationMinutes: 22,
    xp: 75,
    kind: "graph",
    body: String.raw`## Définition

Un point décrit un **mouvement circulaire uniforme** (MCU) si sa trajectoire est **circulaire** et la **valeur** de sa vitesse **constante**.

## Repérer un point sur le cercle

| Repérage | Expression |
|---|---|
| Coordonnées cartésiennes | $x_M=R\cos\theta$ ; $y_M=R\sin\theta$ |
| Abscisse curviligne | $s=\overset{\frown}{M_0M}=R\theta$ |
| Abscisse angulaire | $\theta=(\overrightarrow{OM_0},\overrightarrow{OM})$ |

## Vitesse et accélération dans la base de Frenet

- Vitesse : $\vec{v}=R\omega\,\vec{\tau}$, avec $v=\dfrac{ds}{dt}=R\dfrac{d\theta}{dt}=R\omega$ ($\omega$ : vitesse angulaire, en rad·s⁻¹) ;
- Accélération : $\vec{a}=R\omega^2\,\vec{n}=\dfrac{v^2}{R}\,\vec{n}$.

> **Le fait marquant du MCU.** La valeur de la vitesse est constante, donc $a_t=\dfrac{dv}{dt}=0$ : **l’accélération est purement normale**, dirigée vers le centre (centripète). Un mouvement circulaire uniforme est **accéléré au sens vectoriel** — la direction de $\vec v$ change en permanence, même si sa valeur ne change pas.

## Équations horaires

$$\theta=\omega t+\theta_0\qquad;\qquad s=R(\omega t+\theta_0)=v\,t+s_0$$

Observe ci-contre : $\vec{v}$ reste **tangent** au cercle, $\vec{a}$ pointe **toujours vers le centre**.`,
    keyPoint: "MCU : v = Rω (tangente), a = Rω² = v²/R (centripète, normale) ; l’accélération tangentielle est nulle.",
    example: "Looping d’avion : $a=100$ m·s⁻² et $v=500$ m·s⁻¹ donnent $R=v^2/a=2500$ m et $\\omega=v/R=0{,}2$ rad·s⁻¹.",
    methodSteps: [
      "Vérifie que la trajectoire est un cercle et la valeur de v constante.",
      "Utilise v = Rω pour relier vitesse linéaire et vitesse angulaire.",
      "Calcule l’accélération centripète a = v²/R = Rω².",
      "Écris les équations horaires θ = ωt + θ₀ et s = v·t + s₀.",
    ],
    interaction: {
      kind: "orbit",
      eyebrow: "Manipuler",
      title: "Vitesse tangente, accélération centripète",
      instruction: "Fais tourner le point M autour du cercle : observe la direction des deux vecteurs à chaque position.",
      observation: "La vitesse (verte) reste tangente au cercle ; l’accélération (orange) pointe toujours vers le centre. La valeur de v ne change pas, mais sa direction, oui : voilà pourquoi il y a une accélération.",
      formula: "v = Rω (tangente) ; a = v²/R (centripète)",
      formulaTex: "\\vec v=R\\omega\\,\\vec\\tau,\\quad \\vec a=\\tfrac{v^2}{R}\\,\\vec n",
      radiusLabel: "R",
      showVelocity: true,
      showAcceleration: true,
      marker: { min: 0, max: 360, step: 2, initial: 40 },
    },
    questions: [
      choice("Dans un MCU, l’accélération est…", ["normale et centripète (vers le centre)", "tangente à la trajectoire", "nulle", "dirigée vers l’extérieur"], 0, "La valeur de v étant constante, $a_t=0$ : l’accélération est purement normale.", "5.3.3"),
      short("Avion en looping : $a_n=100$ m·s⁻² et $v=500$ m·s⁻¹. Calcule le rayon $R$ (en m).", ["2500", "2 500", "2500 m"], "$R=\\dfrac{v^2}{a_n}=\\dfrac{500^2}{100}=2500$ m.", "Exercice 4 - question 3", 2),
      short("Pour cet avion, calcule la vitesse angulaire $\\omega$ (en rad·s⁻¹).", ["0,2", "0.2", "0,2 rad/s"], "$\\omega=\\dfrac{v}{R}=\\dfrac{500}{2500}=0{,}2$ rad·s⁻¹.", "Exercice 4 - question 4", 2),
      short("Mobile avec $\\theta=2t+\\tfrac{\\pi}{2}$. Donne la vitesse angulaire $\\omega$ (en rad·s⁻¹).", ["2", "2 rad/s"], "Par identification avec $\\theta=\\omega t+\\theta_0$, $\\omega=2$.", "Exercice 5 - question 1.2"),
      short("Pour ce mobile, $a=2{,}56$ m·s⁻². Calcule le rayon $R$ (en m).", ["0,64", "0.64", "0,64 m"], "$R=\\dfrac{a}{\\omega^2}=\\dfrac{2{,}56}{4}=0{,}64$ m.", "Exercice 5 - question 2.1", 2),
      short("Pour ce mobile, calcule la vitesse linéaire $v$ (en m·s⁻¹).", ["1,28", "1.28", "1,28 m/s"], "$v=R\\omega=0{,}64\\times2=1{,}28$ m·s⁻¹.", "Exercice 5 - question 2.2"),
      choice("Un mouvement circulaire uniforme est-il accéléré au sens vectoriel ?", ["Oui, car la direction de la vitesse change", "Non, car la valeur de v est constante", "Oui, car v augmente", "Non, l’accélération est nulle"], 0, "Le vecteur-vitesse change de direction : il y a bien une accélération (centripète).", "5.3.3"),
    ],
  },
  {
    id: "pursuit-mission",
    title: "Mission finale : la poursuite sur l’autoroute",
    summary: "Mobiliser MRU, MRUV et équations horaires pour résoudre la situation d’évaluation complète.",
    pages: "7",
    section: "Situation d’évaluation",
    durationMinutes: 40,
    xp: 95,
    kind: "challenge",
    body: String.raw`## La situation

Sur l’autoroute du nord, une automobile **A** est à l’arrêt au niveau d’une borne $O$. Au moment de son démarrage, elle est dépassée par un mini-bus **B** roulant à la vitesse constante $v_B=25$ m·s⁻¹. L’automobile A accélère uniformément avec $a_A=6$ m·s⁻² pour rattraper le bus. L’instant du démarrage de A est l’origine des dates, la borne $O$ l’origine des espaces. Vitesse maximale autorisée : $120$ km·h⁻¹.

## Récapitulatif des trois mouvements

| Mouvement | Vitesse | Accélération | Abscisse |
|---|---|---|---|
| Rectiligne uniforme | $v=v_0$ | $a=0$ | $x=v_0 t+x_0$ |
| Rectiligne unif. varié | $v=a t+v_0$ | $a=\text{cste}$ | $x=\tfrac12 a t^2+v_0 t+x_0$ |
| Circulaire uniforme | $v=R\omega$ (cste) | $a=v^2/R$ (centripète) | $\theta=\omega t+\theta_0$ |

## Nature des mouvements

- **Automobile A** : trajectoire rectiligne, accélération constante ⇒ **rectiligne uniformément accéléré**.
- **Mini-bus B** : trajectoire rectiligne, vitesse constante ⇒ **rectiligne uniforme**.

## Équations horaires

$$v_A(t)=a_A\,t=6t\qquad;\qquad x_A(t)=\tfrac12 a_A t^2=3t^2\quad(v_{0A}=0,\ x_{0A}=0)$$

$$x_B(t)=v_B\,t=25t\quad(x_{0B}=0)$$

## L’instant du rattrapage

A rattrape B quand $x_A(t_R)=x_B(t_R)$ :

$$3t_R^2=25t_R\ \Longrightarrow\ t_R=\frac{25}{3}\approx8{,}33\ \text{s}$$

La distance parcourue vaut alors $d=25\,t_R=\dfrac{625}{3}\approx208{,}33$ m, et la vitesse de A :

$$v_{AR}=6\,t_R=6\times\frac{25}{3}=50\ \text{m·s}^{-1}$$

## L’automobiliste est-il en faute ?

$$v_{AR}=50\ \text{m·s}^{-1}=50\times\frac{3600}{1000}=180\ \text{km·h}^{-1}>120\ \text{km·h}^{-1}$$

**Oui** : au moment du dépassement, l’automobiliste roule à 180 km·h⁻¹, bien au-delà de la limite autorisée. Il est en faute.

> **Ce que révèle la courbe.** La parabole $x_A=3t^2$ (l’auto qui accélère) et la droite $x_B=25t$ (le bus régulier) se croisent au **point de rattrapage** : c’est la traduction graphique de l’équation $3t^2=25t$.`,
    keyPoint: "Deux mobiles se rejoignent quand leurs abscisses sont égales : x_A(t) = x_B(t) ; ici t_R = 25/3 s et v_A = 50 m·s⁻¹ = 180 km·h⁻¹.",
    example: "$3t^2=25t$ donne $t_R=25/3\\approx8{,}33$ s, puis $v_{AR}=6t_R=50$ m·s⁻¹ = 180 km·h⁻¹.",
    methodSteps: [
      "Donne la nature de chaque mouvement en justifiant (trajectoire et accélération/vitesse).",
      "Établis les équations horaires de A (MRUV) et de B (MRU).",
      "Écris x_A(t) = x_B(t) et résous pour trouver l’instant de rattrapage.",
      "Calcule distance et vitesse, puis compare à la limite autorisée.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Manipuler",
      title: "L’auto rattrape le bus",
      instruction: "Avance dans le temps : la parabole de l’auto (A) finit par rejoindre la droite du bus (B).",
      observation: "x_A = 3t² (auto qui accélère) croise x_B = 25t (bus régulier, droite rouge) vers t = 8,33 s : c’est l’instant du rattrapage, à environ 208 m de la borne.",
      formula: "x_A(t) = 3t²  ;  x_B(t) = 25t",
      formulaTex: "x_A(t)=3t^2,\\quad x_B(t)=25t",
      rule: { kind: "polynomial", coefficients: [0, 0, 3] },
      window: { xMin: 0, xMax: 10, yMin: 0, yMax: 300 },
      guides: [{ kind: "oblique", slope: 25, intercept: 0, label: "bus B : x = 25t" }],
      marker: { min: 0, max: 10, step: 0.1, initial: 2 },
    },
    corrections: [
      "Le PDF calcule avec la valeur arrondie $t_R\\approx8{,}33$ s : il obtient $v_{AR}=49{,}98\\approx50$ m·s⁻¹ et $d=208{,}25$ m. Avec la valeur exacte $t_R=25/3$ s, on trouve $v_{AR}=50$ m·s⁻¹ exactement et $d=625/3\\approx208{,}33$ m.",
    ],
    questions: [
      choice("Quelle est la nature du mouvement de l’automobile A ?", ["rectiligne uniformément accéléré", "rectiligne uniforme", "circulaire uniforme", "immobile"], 0, "Trajectoire rectiligne et accélération constante non nulle.", "Situation d’évaluation - question 1", 2),
      choice("Quelle est la nature du mouvement du mini-bus B ?", ["rectiligne uniforme", "rectiligne uniformément varié", "circulaire uniforme", "accéléré"], 0, "Trajectoire rectiligne et valeur de la vitesse constante.", "Situation d’évaluation - question 1"),
      short("Établis l’équation horaire $x_A(t)$ de l’automobile A.", ["3t^2", "3t²", "x=3t^2"], "$x_A=\\tfrac12 a_A t^2=\\tfrac12\\times6\\times t^2=3t^2$.", "Situation d’évaluation - question 2.1", 2),
      short("Établis l’équation horaire $x_B(t)$ du mini-bus B.", ["25t", "x=25t"], "$x_B=v_B t=25t$.", "Situation d’évaluation - question 2.2"),
      short("Détermine la date $t_R$ du rattrapage (en s).", ["25/3", "8,33", "8.33"], "$3t_R^2=25t_R$ donne $t_R=25/3\\approx8{,}33$ s.", "Situation d’évaluation - question 3.1", 3),
      short("Calcule la vitesse $v_{AR}$ de l’automobile au rattrapage (en m·s⁻¹).", ["50", "50 m/s"], "$v_{AR}=6t_R=6\\times25/3=50$ m·s⁻¹.", "Situation d’évaluation - question 3.3", 2),
      short("Convertis cette vitesse en km·h⁻¹.", ["180", "180 km/h"], "$50\\times3600/1000=180$ km·h⁻¹.", "Situation d’évaluation - question 4", 2),
      choice("L’automobiliste est-il en faute au moment du dépassement ?", ["Oui, 180 km·h⁻¹ dépasse la limite de 120 km·h⁻¹", "Non, il roule à la limite", "Non, 180 < 120", "On ne peut pas conclure"], 0, "180 km·h⁻¹ > 120 km·h⁻¹ : excès de vitesse caractérisé.", "Situation d’évaluation - question 4", 2),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const kinematicsPath: LearningPath = {
  id: "seconde-c-kinematics",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C/D • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Mécanique" },
  chapterNumber: 1,
  title: "Cinématique du point",
  description: "Le cours officiel intégral, sans la situation d’apprentissage, découpé en niveaux progressifs avec ses exercices et corrections.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Poser le cadre d’une étude : référentiel, repères et trajectoire",
    "Exprimer les vecteurs position, vitesse et accélération, dans le repère cartésien et la base de Frenet",
    "Reconnaître un mouvement rectiligne uniforme, uniformément varié ou circulaire uniforme",
    "Établir et exploiter les équations horaires, jusqu’à une situation de poursuite",
  ],
  modules: [
    { id: "kinematics-mastery", title: "Maîtriser la cinématique", description: "Un niveau après l’autre, du cadre de l’étude à la situation de poursuite.", lessons: builtLevels },
  ],
};

export const physicsPaths: LearningPath[] = [kinematicsPath];
