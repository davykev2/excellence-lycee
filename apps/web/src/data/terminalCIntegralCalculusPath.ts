import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

const sourceDocument = "TC Maths leçon 15 Calcul intégral.pdf";

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

const truth = (
  prompt: string,
  isTrue: boolean,
  explanation: string,
  sourceLabel: string,
  points = 1,
) => choice(prompt, ["Vrai", "Faux"], isTrue ? 0 : 1, explanation, sourceLabel, points);

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
  interaction?: LessonInteraction;
  questions: LessonQuestion[];
  corrections?: string[];
  tip?: string;
}

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
    interaction: seed.interaction ?? {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Reconstruis le raisonnement",
      instruction: "Sélectionne chaque étape pour revoir la stratégie avant les exercices.",
      observation: "Une intégrale réussie commence toujours par le choix de la bonne propriété et se termine par le contrôle des bornes.",
      items: seed.timeline,
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${seed.title.toLocaleLowerCase("fr")}`,
      introduction: "Écris d’abord la propriété utilisée, transforme l’intégrande si nécessaire, puis calcule seulement après avoir contrôlé les bornes.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé du cours", work: seed.example, result: seed.keyPoint },
      tip: seed.tip ?? "Astuce mémoire de Davy : propriété, primitive, bornes, soustraction - toujours dans cet ordre.",
    },
    question: seed.questions[0],
    questions: seed.questions,
  };
}

const positiveAreaInteraction: LessonInteraction = {
  kind: "curve",
  eyebrow: "Laboratoire d’aire",
  title: "L’aire sous $f(x)=2x+1$",
  instruction: "Déplace le point entre 0 et 5 et repère la zone comprise entre la droite et l’axe des abscisses.",
  observation: "Sur $[0;5]$, la fonction est positive. L’intégrale vaut 30 u.a. ; avec 2 cm en abscisse et 3 cm en ordonnée, cela donne $30\times6=180\,cm^2$.",
  formula: "f(x) = 2x + 1",
  formulaTex: "f(x)=2x+1",
  rule: { kind: "linear", coefficient: 2, constant: 1 },
  window: { xMin: -1, xMax: 6, yMin: -1, yMax: 13 },
  guides: [
    { kind: "vertical", value: 0, label: "x = 0" },
    { kind: "vertical", value: 5, label: "x = 5" },
  ],
  marker: { min: 0, max: 5, step: 0.1, initial: 2.5 },
};

const meanValueInteraction: LessonInteraction = {
  kind: "schema",
  eyebrow: "Laboratoire de moyenne",
  title: "Même aire, hauteur constante",
  instruction: "Sélectionne les trois repères pour relier la courbe, l’intégrale et le rectangle de hauteur moyenne.",
  observation: "La valeur moyenne ne donne pas la plus grande valeur de la fonction : elle donne la hauteur constante qui conserve exactement l’aire.",
  caption: "Une courbe et le rectangle de même aire sur [a ; b].",
  viewBox: "0 0 420 240",
  shapes: [
    { shape: "line", x1: 35, y1: 195, x2: 390, y2: 195, tone: "muted" },
    { shape: "line", x1: 75, y1: 35, x2: 75, y2: 210, tone: "muted" },
    { shape: "path", d: "M110 170 C145 85 190 155 230 90 C270 35 310 150 350 105", tone: "accent" },
    { shape: "path", d: "M110 195 L110 120 L350 120 L350 195 Z", tone: "soft" },
    { shape: "line", x1: 110, y1: 120, x2: 350, y2: 120, tone: "outline" },
    { shape: "line", x1: 110, y1: 195, x2: 110, y2: 120, tone: "muted" },
    { shape: "line", x1: 350, y1: 195, x2: 350, y2: 120, tone: "muted" },
    { shape: "text", x: 110, y: 218, content: "a", anchor: "middle" },
    { shape: "text", x: 350, y: 218, content: "b", anchor: "middle" },
    { shape: "text", x: 92, y: 124, content: "μ", anchor: "middle" },
  ],
  hotspots: [
    { id: "integral", number: 1, label: "Aire sous la courbe", detail: "L’aire algébrique est $\\int_a^b f(x)\\,dx$.", x: 230, y: 82 },
    { id: "rectangle", number: 2, label: "Rectangle équivalent", detail: "Le rectangle a pour base $b-a$ et pour hauteur $\\mu$.", x: 300, y: 145 },
    { id: "mean", number: 3, label: "Valeur moyenne", detail: "$\\mu=\\dfrac1{b-a}\\int_a^b f(x)\\,dx$ garantit l’égalité des deux aires.", x: 145, y: 145 },
  ],
};

const terraceInteraction: LessonInteraction = {
  kind: "curve",
  eyebrow: "Mission terrasse",
  title: "La portion de parabole $y=4-x^2$",
  instruction: "Déplace le point de A(-2 ; 0) à B(2 ; 0) et observe la hauteur de la portion parabolique.",
  observation: "La partie rose vaut $\\int_{-2}^{2}(4-x^2)\\,dx=32/3$ m². Avec le rectangle de 8 m², l’aire totale correcte est $56/3\\approx18{,}67$ m².",
  formula: "y = 4 - x²",
  formulaTex: "y=4-x^2",
  rule: { kind: "quadratic", coefficient: -1, constant: 4 },
  window: { xMin: -3.5, xMax: 3.5, yMin: -1.5, yMax: 5.5 },
  guides: [
    { kind: "horizontal", value: 0, label: "segment [AB]" },
    { kind: "vertical", value: 0, label: "sommet E" },
  ],
  marker: { min: -2, max: 2, step: 0.05, initial: 0 },
};

const levels: OfficialLevelSeed[] = [
  {
    id: "definite-integral",
    title: "Définir et calculer une intégrale",
    summary: "Comprendre la définition par les primitives, la variable muette, les bornes et les conséquences immédiates.",
    pages: "1-2",
    section: "I-1. Notion d’intégrale",
    durationMinutes: 30,
    body: String.raw`## Définition

Soit $f$ une fonction continue sur un intervalle $K$, $a$ et $b$ deux éléments de $K$, et $F$ une primitive de $f$ sur $K$.

Le nombre $F(b)-F(a)$ ne dépend pas de la primitive choisie. Il est appelé **intégrale de $f$ de $a$ à $b$** :

$$\int_a^b f(x)\,dx=[F(x)]_a^b=F(b)-F(a)$$

Les nombres $a$ et $b$ sont les **bornes**. La lettre $x$ est une **variable muette** :

$$\int_a^b f(x)\,dx=\int_a^b f(t)\,dt=\int_a^b f(z)\,dz$$

Pourquoi le choix de la primitive ne change-t-il rien ? Si $G=F+c$, alors

$$G(b)-G(a)=F(b)+c-F(a)-c=F(b)-F(a).$$

## Deux conséquences à connaître sans hésiter

$$\int_a^a f(x)\,dx=0$$

$$\int_b^a f(x)\,dx=-\int_a^b f(x)\,dx$$

Inverser les bornes **change le signe** ; mettre deux bornes identiques donne **zéro**, quelle que soit l’expression intégrée.

## Exercice de fixation fidèlement repris

### 1. $I=\int_0^1x^2dx$

Une primitive de $x^2$ est $x^3/3$ :

$$I=\left[\frac{x^3}{3}\right]_0^1=\frac13.$$

### 2. $P=\int_0^1z^2dz$

$z$ est seulement une variable muette : $P=I=1/3$.

### 3. $J=\int_3^1\left(1-\frac1t\right)dt$

Une primitive est $t-\ln t$ :

$$J=[t-\ln t]_3^1=(1-\ln1)-(3-\ln3)=\ln3-2.$$

### 4. $H=\int_{-12}^{-12}x\sqrt{3-x}\,dx$

Les bornes sont identiques, donc $H=0$ sans chercher de primitive.

> **Erreur fréquente.** Dans $[F(x)]_a^b$, on calcule toujours **valeur en haut moins valeur en bas** : $F(b)-F(a)$.

> **Astuce mémoire de Davy.** « Primitive, haut, bas. » Trouve $F$, calcule $F(b)$, calcule $F(a)$, puis soustrais dans cet ordre.`,
    keyPoint: "$\\int_a^bf(x)\\,dx=F(b)-F(a)$ pour toute primitive $F$ de $f$.",
    example: "$\\int_3^1(1-1/t)dt=\\ln3-2$ : les bornes sont volontairement dans l’ordre décroissant.",
    methodSteps: [
      "Vérifie que l’intégrande est continue sur l’intervalle entre les bornes.",
      "Choisis une primitive F adaptée.",
      "Calcule F(b) - F(a), en respectant l’ordre des bornes.",
      "Simplifie et contrôle le signe du résultat.",
    ],
    timeline: [
      { label: "Primitive", detail: "Trouver F telle que F′=f." },
      { label: "Bornes", detail: "Identifier clairement la borne basse a et la borne haute b." },
      { label: "Évaluer", detail: "Calculer F(b) puis F(a)." },
      { label: "Soustraire", detail: "Former F(b)-F(a)." },
    ],
    corrections: [
      "La couverture du document imprimé porte « Terminale D - Leçon 10 ». Le fichier est classé dans le référentiel du projet comme la leçon 15 de Terminale C ; le contenu de calcul intégral reste celui exploité ici.",
    ],
    questions: [
      choice("Que signifie $F$ primitive de $f$ ?", ["$F'=f$", "$f'=F$", "$F=f$", "$F'=f'$"], 0, "C’est la définition d’une primitive.", "Définition • page 1"),
      choice("$\\int_a^bf(x)dx$ vaut :", ["$F(a)-F(b)$", "$F(b)-F(a)$", "$f(b)-f(a)$", "$F(a)+F(b)$"], 1, "On évalue une primitive aux bornes : haut moins bas.", "Définition • pages 1-2"),
      short("Calcule $I=\\int_0^1x^2dx$.", ["1/3", "0,333", "0.333"], "$[x^3/3]_0^1=1/3$.", "Exercice de fixation • page 2", 2),
      short("Calcule $P=\\int_0^1z^2dz$.", ["1/3", "0,333", "0.333"], "$z$ est une variable muette ; le calcul est identique à celui de I.", "Exercice de fixation • page 2"),
      choice("Quelle est la valeur de $J=\\int_3^1(1-1/t)dt$ ?", ["$2-\\ln3$", "$\\ln3-2$", "$1$", "$0$"], 1, "$[t-\\ln t]_3^1=\\ln3-2$.", "Exercice de fixation • page 2", 2),
      short("Calcule $H=\\int_{-12}^{-12}x\\sqrt{3-x}dx$.", ["0", "+0", "-0"], "Les deux bornes sont identiques.", "Exercice de fixation • page 2"),
      truth("Changer la variable muette x en t change la valeur de l’intégrale.", false, "La lettre d’intégration n’intervient pas dans le résultat.", "Remarques • page 2"),
      short("Calcule $\\int_4^4(7x^5-2)dx$.", ["0", "+0", "-0"], "Une intégrale entre deux bornes identiques vaut zéro.", "Conséquence de la définition • page 2"),
      choice("$\\int_b^af(x)dx$ est égal à :", ["$\\int_a^bf(x)dx$", "$-\\int_a^bf(x)dx$", "$0$", "$2\\int_a^bf(x)dx$"], 1, "Inverser les bornes change le signe.", "Conséquence de la définition • page 2"),
      short("Calcule $\\int_0^2 3x^2dx$.", ["8", "+8"], "$[x^3]_0^2=8$.", "Application directe de la définition"),
      short("Calcule $\\int_1^e\\frac1x dx$.", ["1", "+1"], "$[\\ln x]_1^e=1-0=1$.", "Application directe de la définition"),
      choice("Pourquoi deux primitives différentes donnent-elles la même intégrale ?", ["Elles sont égales", "Leur constante se simplifie", "Les bornes sont toujours nulles", "L’intégrande disparaît"], 1, "Deux primitives diffèrent d’une constante, qui s’annule dans F(b)-F(a).", "Définition • page 1", 2),
      truth("Une intégrale peut être négative.", true, "L’intégrale est une aire algébrique ; son signe dépend aussi de l’ordre des bornes et du signe de la fonction.", "Conséquences • page 2"),
      short("Si $\\int_2^7f(x)dx=5$, calcule $\\int_7^2f(x)dx$.", ["-5", "−5"], "On inverse les bornes, donc on change le signe.", "Conséquence de la définition • page 2"),
    ],
  },
  {
    id: "integral-area",
    title: "Interpréter l’intégrale comme une aire",
    summary: "Relier une intégrale positive à une aire, comprendre l’unité d’aire et convertir correctement en cm².",
    pages: "2-3",
    section: "I-1.d. Interprétation graphique",
    durationMinutes: 32,
    kind: "graph",
    body: String.raw`## Propriété

Soit $f$ une fonction **continue et positive** sur $[a;b]$. Dans un repère orthogonal, l’intégrale

$$\int_a^bf(x)\,dx$$

est l’aire, en **unités d’aire**, de la partie limitée par $(C_f)$, l’axe des abscisses et les droites $x=a$ et $x=b$.

Cette zone peut aussi s’écrire :

$$a\le x\le b\qquad\text{et}\qquad0\le y\le f(x).$$

## L’unité d’aire

Dans un repère orthogonal :

$$1\,\text{u.a.}=OI\times OJ.$$

Avec 2 cm sur l’axe des abscisses et 3 cm sur l’axe des ordonnées :

$$1\,\text{u.a.}=2\times3=6\,cm^2.$$

## Exercice de fixation amélioré

On considère $f(x)=2x+1$.

### Continuité et positivité

$f$ est polynomiale, donc continue sur $\mathbb R$. De plus,

$$2x+1\ge0\Longleftrightarrow x\ge-\frac12.$$

Elle est donc positive sur $[0;5]$.

### Interprétation et valeur de l’aire

Le PDF demande d’interpréter $\int_0^5f(x)dx$. Allons jusqu’au calcul pour rendre le résultat concret :

$$\int_0^5(2x+1)dx=[x^2+x]_0^5=30\,\text{u.a.}$$

Puisque $1$ u.a. vaut $6\,cm^2$ :

$$\mathcal A=30\times6=180\,cm^2.$$

## Lire correctement le graphique

Les droites $x=0$ et $x=5$ ferment la zone à gauche et à droite. L’axe des abscisses la ferme en bas, tandis que la courbe la ferme en haut. Avant tout calcul, hachure mentalement cette région : tu éviteras ainsi de confondre une aire sous la courbe avec une aire entre deux courbes.

> **Attention.** L’intégrale vaut 30, mais l’aire réelle vaut 180 cm². Ne mélange pas la valeur en unités d’aire et la conversion physique.

> **Astuce mémoire de Davy.** « Intègre d’abord, convertis ensuite. » Le calcul mathématique et la conversion sont deux étapes séparées.`,
    keyPoint: "Aire réelle = intégrale en u.a. × unité horizontale × unité verticale.",
    example: "Pour $f(x)=2x+1$ sur $[0;5]$, l’intégrale vaut 30 u.a. et l’aire vaut $30\\times6=180\,cm^2$.",
    methodSteps: [
      "Vérifie que la fonction est continue et positive sur l’intervalle.",
      "Identifie les deux droites verticales qui bornent la zone.",
      "Calcule l’intégrale en unités d’aire.",
      "Multiplie par les deux unités graphiques pour obtenir l’aire réelle.",
    ],
    timeline: [
      { label: "Signe", detail: "Une aire sous la courbe exige f≥0 sur l’intervalle." },
      { label: "Zone", detail: "Entre x=a, x=b, l’axe et la courbe." },
      { label: "Intégrale", detail: "Calcul en unités d’aire." },
      { label: "Conversion", detail: "Multiplier par OI×OJ." },
    ],
    interaction: positiveAreaInteraction,
    questions: [
      choice("Quand $\\int_a^bf(x)dx$ représente-t-elle directement une aire sous la courbe ?", ["Quand f est continue et positive sur [a;b]", "Quand f est seulement dérivable", "Quand a=b", "Toujours"], 0, "Ce sont les deux hypothèses de la propriété.", "Propriété • page 2"),
      choice("La zone sous une fonction positive est décrite par :", ["$a\\le x\\le b$ et $0\\le y\\le f(x)$", "$0\\le x\\le f(y)$", "$y\\le0$", "$x=a$ seulement"], 0, "C’est la description donnée dans les remarques.", "Remarques • page 3"),
      short("Avec 2 cm en abscisse et 3 cm en ordonnée, combien vaut 1 u.a. en cm² ?", ["6", "6cm2", "6cm²"], "$2\\times3=6$ cm².", "Exercice de fixation • page 3"),
      truth("$f(x)=2x+1$ est continue sur $[0;5]$.", true, "Toute fonction polynôme est continue sur R.", "Exercice de fixation • page 3"),
      choice("Sur quel intervalle $2x+1$ est-elle positive ?", ["$[-1/2;+\\infty[$", "$]-\\infty;-1/2]$", "$[0;1]$ seulement", "$]1;+\\infty[$"], 0, "$2x+1\\ge0$ équivaut à $x\\ge-1/2$.", "Exercice de fixation • page 3"),
      short("Calcule $\\int_0^5(2x+1)dx$.", ["30", "+30"], "$[x^2+x]_0^5=25+5=30$.", "Exercice de fixation approfondi • page 3", 2),
      short("Donne l’aire correspondante en cm².", ["180", "180cm2", "180cm²"], "$30\\times6=180$ cm².", "Exercice de fixation approfondi • page 3", 2),
      choice("Dans un repère où OI=4 cm et OJ=5 cm, 1 u.a. vaut :", ["9 cm²", "20 cm²", "1 cm²", "25 cm²"], 1, "$4\\times5=20$ cm².", "Application de l’unité d’aire"),
      short("Si une aire vaut 7 u.a. et si OI=2 cm, OJ=4 cm, donne l’aire en cm².", ["56", "56cm2", "56cm²"], "$7\\times2\\times4=56$ cm².", "Application de l’unité d’aire"),
      truth("Une intégrale positive est automatiquement exprimée en cm².", false, "Elle est d’abord exprimée en unités d’aire ; la conversion dépend du repère.", "Unité d’aire • page 3"),
      choice("Quelle droite constitue le bord inférieur de la zone étudiée ?", ["L’axe des abscisses", "L’axe des ordonnées", "La tangente en a", "La droite y=f(a)"], 0, "La zone est comprise entre la courbe et l’axe des abscisses.", "Interprétation graphique • pages 2-3"),
      short("Calcule l’aire en u.a. sous $f(x)=x$ sur $[0;4]$.", ["8", "+8"], "$[x^2/2]_0^4=8$.", "Application de l’aire positive"),
      choice("Pourquoi vérifie-t-on le signe de f avant de parler d’aire ?", ["Une aire géométrique est positive", "Pour trouver les bornes", "Pour changer l’unité", "Parce que f doit être croissante"], 0, "Sous l’axe, l’intégrale est négative alors que l’aire géométrique reste positive.", "Précision pédagogique"),
    ],
  },
  {
    id: "chasles-linearity",
    title: "Découper et combiner les intégrales",
    summary: "Utiliser la relation de Chasles et la linéarité pour traiter une fonction par morceaux ou simplifier un calcul.",
    pages: "3-4",
    section: "I-2.a. Propriétés algébriques",
    durationMinutes: 34,
    body: String.raw`## Relation de Chasles

Pour $f$ continue sur un intervalle contenant $a$, $b$ et $c$ :

$$\int_a^bf(x)dx=\int_a^cf(x)dx+\int_c^bf(x)dx.$$

Le point $c$ peut être placé à un changement de formule, à un zéro de la fonction ou à une valeur qui simplifie le calcul.

## Exercice de fixation : fonction par morceaux

$$f(x)=\begin{cases}2x-1&\text{si }x\le1,\\[2mm]\dfrac1x&\text{si }x>1.\end{cases}$$

Pour calculer $A=\int_0^ef(x)dx$, la formule change en $1$. On découpe donc en $1$ :

$$A=\int_0^1(2x-1)dx+\int_1^e\frac1x dx.$$

$$A=[x^2-x]_0^1+[\ln x]_1^e=0+1=1.$$

## Linéarité

Pour $f$ et $g$ continues et $\alpha\in\mathbb R$ :

$$\int_a^b(f+g)=\int_a^bf+\int_a^bg$$

$$\int_a^b\alpha f=\alpha\int_a^bf.$$

Par combinaison :

$$\int_a^b(\alpha f+\beta g)=\alpha\int_a^bf+\beta\int_a^bg.$$

## Deuxième exercice de fixation

$$\int_0^{2\pi}(-3\cos x+2\sin x)dx$$

$$=-3[\sin x]_0^{2\pi}+2[-\cos x]_0^{2\pi}=0.$$

## Contrôle rapide

Après un découpage, chaque sous-intégrale doit être calculée avec l’expression valable sur son propre intervalle. Pour la linéarité, seuls les nombres constants sortent du symbole intégral : une expression qui dépend de $x$ ne peut pas être extraite. Enfin, additionne les résultats avec leurs signes avant de conclure.

> **Erreur fréquente.** Dans Chasles, les bornes doivent s’enchaîner : $a\to c$, puis $c\to b$. Écrire deux intégrales qui ne se raccordent pas ne reconstitue pas l’intervalle initial.

> **Astuce mémoire de Davy.** Chasles fonctionne comme un trajet : Abidjan-Yamoussoukro = Abidjan-Toumodi + Toumodi-Yamoussoukro.`,
    keyPoint: "$\\int_a^bf=\\int_a^cf+\\int_c^bf$ et l’intégrale distribue les combinaisons linéaires.",
    example: "La fonction change de formule en 1 : $\\int_0^ef=\\int_0^1(2x-1)+\\int_1^e1/x=1$.",
    methodSteps: [
      "Repère la valeur où la formule ou le signe change.",
      "Découpe l’intervalle avec Chasles en faisant coïncider les bornes.",
      "Remplace f par la bonne expression sur chaque morceau.",
      "Utilise la linéarité, calcule puis additionne les résultats.",
    ],
    timeline: [
      { label: "Repérer", detail: "Trouver le point de changement c." },
      { label: "Découper", detail: "Former les trajets a→c et c→b." },
      { label: "Calculer", detail: "Utiliser la bonne formule sur chaque intervalle." },
      { label: "Réunir", detail: "Additionner les deux intégrales." },
    ],
    questions: [
      choice("La relation de Chasles correcte est :", ["$\\int_a^bf=\\int_a^cf+\\int_c^bf$", "$\\int_a^bf=\\int_c^af+\\int_c^bf$", "$\\int_a^bf=\\int_a^cf-\\int_c^bf$", "$\\int_a^bf=0$"], 0, "Les intervalles s’enchaînent de a à c puis de c à b.", "Propriété 1 • page 3"),
      choice("Pourquoi découpe-t-on l’intégrale de la fonction du PDF en 1 ?", ["La formule de f change en 1", "f s’annule toujours en 1", "e vaut 1", "L’intégrale est négative"], 0, "La première formule vaut pour x≤1 et la seconde pour x>1.", "Exercice de fixation • page 3"),
      short("Calcule $\\int_0^1(2x-1)dx$.", ["0", "+0", "-0"], "$[x^2-x]_0^1=0$.", "Exercice de fixation • pages 3-4"),
      short("Calcule $\\int_1^e\\frac1x dx$.", ["1", "+1"], "$[\\ln x]_1^e=1$.", "Exercice de fixation • pages 3-4"),
      short("Donne la valeur finale de $A=\\int_0^ef(x)dx$.", ["1", "+1"], "$A=0+1=1$.", "Exercice de fixation • pages 3-4", 2),
      truth("$\\int_a^b(f+g)=\\int_a^bf+\\int_a^bg$.", true, "C’est la première forme de linéarité.", "Propriété 2 • page 4"),
      choice("$\\int_a^b5f(x)dx$ vaut :", ["$5\\int_a^bf(x)dx$", "$\\int_a^bf(x)dx+5$", "$\\int_a^bf(5x)dx$", "$0$"], 0, "Le facteur constant sort de l’intégrale.", "Propriété 2 • page 4"),
      short("Calcule $\\int_0^{2\\pi}(-3\\cos x+2\\sin x)dx$.", ["0", "+0", "-0"], "Les contributions de cos et sin sur une période complète sont nulles.", "Exercice de fixation • page 4", 2),
      choice("Une primitive de $-3\\cos x+2\\sin x$ est :", ["$-3\\sin x-2\\cos x$", "$3\\sin x+2\\cos x$", "$-3\\cos x+2\\sin x$", "$3\\cos x-2\\sin x$"], 0, "La dérivée de $-2\\cos x$ est $2\\sin x$.", "Exercice de fixation • page 4"),
      short("Si $\\int_0^2f=3$ et $\\int_2^5f=7$, calcule $\\int_0^5f$.", ["10", "+10"], "Chasles donne 3+7=10.", "Application de Chasles"),
      short("Si $\\int_0^1f=2$ et $\\int_0^1g=-1$, calcule $\\int_0^1(3f-2g)$.", ["8", "+8"], "$3\\times2-2\\times(-1)=8$.", "Application de la linéarité", 2),
      choice("Pour une fonction par morceaux qui change en c, la première action est :", ["Découper en c", "Inverser les bornes", "Multiplier par c", "Supposer f positive"], 0, "Chasles permet ensuite d’utiliser chaque formule sur son domaine.", "Méthode du niveau"),
      truth("On peut choisir n’importe quel c de l’intervalle dans la relation de Chasles.", true, "La relation est valable pour tout c du même intervalle.", "Propriété 1 • page 3"),
      choice("Quel enchaînement de bornes reconstitue [a;b] ?", ["a→c puis c→b", "c→a puis c→b", "a→b puis b→c", "b→c puis a→c"], 0, "Les deux morceaux doivent se toucher en c et garder le même sens.", "Méthode du niveau"),
    ],
  },
  {
    id: "integral-order",
    title: "Comparer des intégrales",
    summary: "Exploiter la positivité et l’ordre entre deux fonctions sans effectuer de calcul inutile.",
    pages: "4, 12",
    section: "I-2.b. Propriétés de comparaison",
    durationMinutes: 32,
    body: String.raw`## Positivité de l’intégrale

Si $f$ est continue et positive sur $[a;b]$, avec $a\le b$, alors

$$\int_a^bf(x)\,dx\ge0.$$

### Exercice de fixation

Pour $f(x)=x^2$, on a $x^2\ge0$ sur $[-2;7]$. Sans calculer de primitive :

$$\int_{-2}^{7}x^2dx\ge0.$$

## Conservation de l’ordre

Si $f$ et $g$ sont continues sur $[a;b]$ et si $f(x)\le g(x)$ pour tout $x\in[a;b]$, alors

$$\int_a^bf(x)dx\le\int_a^bg(x)dx.$$

La démonstration se ramène à la positivité : $g-f\ge0$, donc

$$\int_a^b(g-f)\ge0\Longrightarrow\int_a^bg\ge\int_a^bf.$$

### Deuxième exercice de fixation

Sur $[0;1]$ :

$$(x-1)^2\ge0\Longrightarrow x^2+1\ge2x.$$

Donc

$$\int_0^1(x^2+1)dx\ge\int_0^12x\,dx.$$

## Exercice d’application 4

Sur $[0;\pi]$, $\cos x\le1$ et $x^2\ge0$. En multipliant par le nombre positif $x^2$ :

$$x^2\cos x\le x^2.$$

Ainsi,

$$\int_0^\pi x^2\cos x\,dx\le\int_0^\pi x^2dx.$$

## Exercice d’application 5

Soient $0\le a<b<\pi/2$. Sur cet intervalle, $\cos$ est positive et décroissante. Pour $x\in[a;b]$ :

$$\cos b\le\cos x\le\cos a.$$

En prenant les inverses des carrés positifs, l’ordre s’inverse :

$$\frac1{\cos^2a}\le\frac1{\cos^2x}\le\frac1{\cos^2b}.$$

En intégrant et en utilisant $(\tan x)'=1/\cos^2x$ :

$$\frac{b-a}{\cos^2a}\le\tan b-\tan a\le\frac{b-a}{\cos^2b}.$$

> **Erreur fréquente.** On ne peut pas multiplier une inégalité par une expression sans connaître son signe. Ici, $x^2\ge0$ autorise la multiplication sans changer l’ordre.

> **Astuce mémoire de Davy.** « Comparer avant de calculer. » Quand l’énoncé dit « démontre que », cherche d’abord une inégalité simple entre les intégrandes.`,
    keyPoint: "$f\\le g$ sur $[a;b]$ implique $\\int_a^bf\\le\\int_a^bg$ lorsque $a\\le b$.",
    example: "$(x-1)^2\\ge0$ donne $x^2+1\\ge2x$, puis l’intégration conserve cette inégalité sur $[0;1]$.",
    methodSteps: [
      "Compare les deux intégrandes point par point sur tout l’intervalle.",
      "Justifie le signe de tout facteur utilisé pour multiplier ou diviser.",
      "Applique la propriété de conservation de l’ordre.",
      "Ne calcule les intégrales que si la consigne demande ensuite leur valeur.",
    ],
    timeline: [
      { label: "Intervalle", detail: "Fixer précisément les valeurs possibles de x." },
      { label: "Comparer", detail: "Établir f(x)≤g(x) point par point." },
      { label: "Signe", detail: "Contrôler tout facteur multiplicatif." },
      { label: "Intégrer", detail: "Transmettre l’ordre aux intégrales." },
    ],
    questions: [
      truth("Si $f\\ge0$ sur $[a;b]$ avec $a\\le b$, alors $\\int_a^bf\\ge0$.", true, "C’est la propriété de positivité.", "Propriété 1 • page 4"),
      truth("$\\int_{-2}^7x^2dx\\ge0$ peut être justifié sans calculer l’intégrale.", true, "$x^2$ est positive sur tout R.", "Exercice de fixation • page 4"),
      choice("Si $f\\le g$ sur $[a;b]$, alors :", ["$\\int_a^bf\\le\\int_a^bg$", "$\\int_a^bf\\ge\\int_a^bg$", "les intégrales sont égales", "on ne peut rien dire"], 0, "L’intégration conserve l’ordre lorsque les bornes sont croissantes.", "Propriété 2 • page 4"),
      choice("Quelle identité permet de comparer $x^2+1$ et $2x$ ?", ["$(x-1)^2\\ge0$", "$(x+1)^2\\le0$", "$x^2\\le0$", "$x-1=0$"], 0, "$x^2-2x+1\\ge0$ équivaut à $x^2+1\\ge2x$.", "Exercice de fixation • page 4"),
      truth("Sur $[0;1]$, $x^2+1\\ge2x$.", true, "La différence vaut $(x-1)^2$.", "Exercice de fixation • page 4"),
      short("Calcule $\\int_0^1 2x\\,dx$.", ["1", "+1"], "$[x^2]_0^1=1$.", "Exercice de fixation • page 4"),
      choice("Sur $[0;\\pi]$, pourquoi $x^2\\cos x\\le x^2$ ?", ["Parce que $\\cos x\\le1$ et $x^2\\ge0$", "Parce que cos x≥1", "Parce que x²≤0", "Parce que π=0"], 0, "Multiplier cos x≤1 par x²≥0 conserve le sens.", "Exercice 4 • page 12", 2),
      truth("$\\int_0^\\pi x^2\\cos x\\,dx\\le\\int_0^\\pi x^2dx$.", true, "L’inégalité des intégrandes est vraie sur tout l’intervalle.", "Exercice 4 • page 12"),
      choice("Sur $[0;\\pi/2[$, la fonction cosinus est :", ["positive et décroissante", "négative et croissante", "constante", "positive et croissante"], 0, "C’est la propriété utilisée dans l’exercice 5.", "Exercice 5 • page 12"),
      choice("Si $0<r\\le s$, alors :", ["$1/r\\ge1/s$", "$1/r\\le1/s$", "$1/r=1/s$", "$r+s=0$"], 0, "Prendre l’inverse de deux positifs renverse l’ordre.", "Outil de l’exercice 5"),
      choice("Une primitive de $1/\\cos^2x$ est :", ["$\\tan x$", "$\\cos x$", "$\\sin x$", "$-\\tan x$"], 0, "$(\\tan x)'=1/\\cos^2x$.", "Exercice 5 • page 12"),
      choice("L’encadrement final de $\\tan b-\\tan a$ commence par :", ["$(b-a)/\\cos^2a$", "$(b-a)/\\cos^2b$", "$a-b$", "$0$ uniquement"], 0, "La borne inférieure de $1/\\cos^2x$ est $1/\\cos^2a$.", "Exercice 5 • page 12", 2),
      truth("Multiplier une inégalité par un nombre négatif conserve son sens.", false, "Un facteur négatif renverse le sens de l’inégalité.", "Précaution de méthode"),
      choice("Pour prouver une comparaison d’intégrales, on commence par :", ["Comparer les intégrandes", "Calculer des approximations", "Changer les bornes", "Supposer les deux fonctions égales"], 0, "La propriété exige une comparaison point par point.", "Méthode du niveau"),
    ],
  },
  {
    id: "integral-bounds-mean",
    title: "Encadrer une intégrale et calculer une valeur moyenne",
    summary: "Transformer un encadrement de fonction en encadrement d’intégrale et interpréter la valeur moyenne comme une hauteur équivalente.",
    pages: "4-6, 12",
    section: "I-2.b. Inégalité de la moyenne et I-3. Valeur moyenne",
    durationMinutes: 36,
    body: String.raw`## Inégalité de la moyenne

Soit $f$ continue sur $[a;b]$, avec $a\le b$.

Si $m\le f(x)\le M$ sur $[a;b]$, alors

$$m(b-a)\le\int_a^bf(x)dx\le M(b-a).$$

Si $\lvert f(x)\rvert\le M$, avec $M\ge0$, alors

$$\left\lvert\int_a^bf(x)dx\right\rvert\le M(b-a).$$

## Exercice de fixation : encadrer sans intégrer

Sur $[\pi/4;\pi/2]$, le PDF donne

$$1\le\frac1{\sin x}\le\sqrt2.$$

La longueur de l’intervalle est $\pi/2-\pi/4=\pi/4$. Donc

$$\frac\pi4\le\int_{\pi/4}^{\pi/2}\frac{dx}{\sin x}\le\frac{\pi\sqrt2}{4}.$$

## Valeur moyenne

La valeur moyenne de $f$ sur $[a;b]$ est

$$\mu=\frac1{b-a}\int_a^bf(x)dx.$$

Si $f$ est positive, $\mu$ est la hauteur du rectangle de base $b-a$ qui possède la même aire que la zone sous la courbe.

## Exercice de fixation entièrement rédigé

Pour $f(x)=x-\sin x$ sur $[0;\pi]$ :

$$\mu=\frac1\pi\int_0^\pi(x-\sin x)dx$$

$$=\frac1\pi\left[\frac{x^2}{2}+\cos x\right]_0^\pi
=\frac1\pi\left(\frac{\pi^2}{2}-2\right)
=\frac{\pi^2-4}{2\pi}.$$

## Exercice d’application 6

Pour $f(x)=3x+\cos x$ sur $[-\pi/2;\pi/2]$, la partie $3x$ est impaire : son intégrale sur l’intervalle symétrique vaut zéro. Ainsi,

$$\int_{-\pi/2}^{\pi/2}(3x+\cos x)dx=\int_{-\pi/2}^{\pi/2}\cos x\,dx=2.$$

La longueur de l’intervalle vaut $\pi$, donc

$$\mu=\frac2\pi.$$

> **Erreur fréquente.** La valeur moyenne n’est ni $(f(a)+f(b))/2$ en général, ni le maximum de f. C’est l’intégrale divisée par la longueur de l’intervalle.

> **Astuce mémoire de Davy.** « Moyenne = aire ÷ largeur. »`,
    keyPoint: "$\\mu=\\dfrac1{b-a}\\int_a^bf(x)dx$ et $m(b-a)\\le\\int_a^bf\\le M(b-a)$.",
    example: "Pour $f(x)=x-\\sin x$ sur $[0;\\pi]$, $\\mu=(\\pi^2-4)/(2\\pi)$.",
    methodSteps: [
      "Cherche des constantes m et M valables sur tout l’intervalle.",
      "Multiplie l’encadrement par la longueur positive b-a.",
      "Pour une valeur moyenne, calcule l’intégrale puis divise par b-a.",
      "Contrôle que la moyenne se trouve entre le minimum et le maximum de f.",
    ],
    timeline: [
      { label: "Encadrer", detail: "Trouver m≤f≤M sur tout [a;b]." },
      { label: "Largeur", detail: "Calculer b-a, toujours positif." },
      { label: "Intégrer", detail: "Obtenir m(b-a)≤∫f≤M(b-a)." },
      { label: "Moyenne", detail: "Diviser l’intégrale par b-a." },
    ],
    interaction: meanValueInteraction,
    questions: [
      choice("Si $m\\le f\\le M$ sur $[a;b]$, alors :", ["$m(b-a)\\le\\int_a^bf\\le M(b-a)$", "$m\\le\\int_a^bf\\le M$", "$\\int_a^bf=0$", "$M(b-a)\\le\\int_a^bf\\le m(b-a)$"], 0, "C’est l’inégalité de la moyenne.", "Propriété 3 • pages 4-5"),
      choice("Si $|f|\\le M$ sur $[a;b]$, alors :", ["$|\\int_a^bf|\\le M(b-a)$", "$|\\int_a^bf|=M$", "$\\int_a^bf\\ge M(b-a)$", "$f=0$"], 0, "C’est la seconde forme de l’inégalité.", "Propriété 3 • page 5"),
      short("Calcule la longueur de $[\\pi/4;\\pi/2]$ sous la forme d’une fraction de π.", ["pi/4", "π/4", "\\pi/4"], "$\\pi/2-\\pi/4=\\pi/4$.", "Exercice de fixation • page 5"),
      choice("La borne inférieure de $\\int_{\\pi/4}^{\\pi/2}1/\\sin x\\,dx$ est :", ["$\\pi/4$", "$\\pi/2$", "$\\pi\\sqrt2/4$", "$0$"], 0, "$1\\times(\\pi/4)=\\pi/4$.", "Exercice de fixation • page 5"),
      choice("Sa borne supérieure est :", ["$\\pi/4$", "$\\pi\\sqrt2/4$", "$\\sqrt2$", "$2\\pi$"], 1, "$\\sqrt2\\times(\\pi/4)=\\pi\\sqrt2/4$.", "Exercice de fixation • page 5"),
      choice("La valeur moyenne de f sur [a;b] est :", ["$\\frac1{b-a}\\int_a^bf$", "$(f(a)+f(b))/2$ toujours", "$\\int_a^bf$", "$f(b)-f(a)$"], 0, "C’est la définition.", "Définition • page 5"),
      choice("Graphiquement, pour f positive, μ est :", ["La hauteur du rectangle de même aire", "Le maximum de f", "L’abscisse du sommet", "La pente moyenne"], 0, "Le rectangle a pour aire μ(b-a), égale à l’intégrale.", "Interprétation graphique • page 5"),
      choice("Quelle est une primitive de $x-\\sin x$ ?", ["$x^2/2+\\cos x$", "$x^2/2-\\cos x$", "$1-\\cos x$", "$x+\\sin x$"], 0, "La dérivée de cos x est -sin x.", "Exercice de fixation • pages 5-6"),
      choice("La valeur moyenne de $x-\\sin x$ sur $[0;\\pi]$ vaut :", ["$(\\pi^2-4)/(2\\pi)$", "$\\pi/2$", "$2/\\pi$", "$0$"], 0, "Le calcul du PDF donne $(\\pi^2/2-2)/\\pi$.", "Exercice de fixation • pages 5-6", 2),
      truth("La fonction $3x$ est impaire.", true, "$3(-x)=-3x$.", "Exercice 6 • page 12"),
      short("Calcule $\\int_{-\\pi/2}^{\\pi/2}3x\\,dx$.", ["0", "+0", "-0"], "L’intégrande est impaire et l’intervalle symétrique.", "Exercice 6 • page 12"),
      short("Calcule $\\int_{-\\pi/2}^{\\pi/2}\\cos x\\,dx$.", ["2", "+2"], "$[\\sin x]_{-\\pi/2}^{\\pi/2}=1-(-1)=2$.", "Exercice 6 • page 12"),
      choice("La valeur moyenne de $3x+\\cos x$ sur $[-\\pi/2;\\pi/2]$ vaut :", ["$2/\\pi$", "$\\pi/2$", "$2$", "$0$"], 0, "L’intégrale vaut 2 et la longueur de l’intervalle vaut π.", "Exercice 6 • page 12", 2),
      truth("Une valeur moyenne doit appartenir à l’intervalle [m;M] si m≤f≤M.", true, "En divisant l’inégalité de la moyenne par b-a, on obtient m≤μ≤M.", "Conséquence de la propriété"),
    ],
  },
  {
    id: "integration-by-parts",
    title: "Calculer par primitives et intégration par parties",
    summary: "Reconnaître une forme dérivée, choisir les bons facteurs et traiter les produits logarithmiques, exponentiels ou trigonométriques.",
    pages: "6-7, 12-13",
    section: "II-1. Utilisation de primitives et II-2. Intégration par parties",
    durationMinutes: 48,
    kind: "practice",
    body: String.raw`## Reconnaître une primitive composée

Avant d’utiliser une technique longue, cherche une dérivée cachée.

| Forme reconnue | Primitive |
|---|---|
| $\dfrac{u'}u$ | $\ln\lvert u\rvert$ |
| $u'e^u$ | $e^u$ |
| $u'u^n$ | $\dfrac{u^{n+1}}{n+1}$ si $n\ne-1$ |

### Exemple 1

$$I=\int_0^1\frac{e^x}{1+e^x}dx$$

Avec $u(x)=1+e^x$, on a $u'(x)=e^x$ :

$$I=[\ln(1+e^x)]_0^1=\ln\left(\frac{1+e}{2}\right).$$

### Exemple 2

$$J=\int_0^1xe^{x^2}dx$$

Comme $(x^2)'=2x$ :

$$J=\frac12[e^{x^2}]_0^1=\frac{e-1}{2}.$$

### Exemple 3

$$K=\int_0^{\pi/3}\cos^3t\,dt.$$

On écrit $\cos^3t=(1-\sin^2t)\cos t$, puis $u=\sin t$ :

$$K=\left[\sin t-\frac{\sin^3t}{3}\right]_0^{\pi/3}=\frac{3\sqrt3}{8}.$$

## Intégration par parties

Si $u$ et $v$ sont dérivables et si $u'$ et $v'$ sont continues sur $[a;b]$ :

$$\int_a^bu(x)v'(x)dx=[u(x)v(x)]_a^b-\int_a^bu'(x)v(x)dx.$$

Le bon choix simplifie ce qui reste :

- on dérive en priorité $\ln x$ ou un polynôme ;
- on primitive facilement $e^x$, $\sin x$, $\cos x$ ou une puissance.

### Exercice de fixation entièrement rédigé

$$I=\int_1^ex^2\ln x\,dx.$$

Prenons $u=\ln x$, donc $u'=1/x$, et $v'=x^2$, donc $v=x^3/3$ :

$$I=\left[\frac{x^3\ln x}{3}\right]_1^e-\frac13\int_1^ex^2dx$$

$$=\frac{e^3}{3}-\left[\frac{x^3}{9}\right]_1^e
=\frac{2e^3+1}{9}.$$

## Exercices d’application : résultats contrôlés

### Exercice 1

$$\int_0^{\pi/4}(\cos x+2x)e^{\sin x+x^2}dx
=e^{\frac{\sqrt2}{2}+\frac{\pi^2}{16}}-1.$$

$$\int_1^e\frac{\sqrt{\ln z+2}}{z}dz
=\frac23(3\sqrt3-2\sqrt2).$$

$$\int_{-2}^{1}\frac{2t^3-t}{(t^4-t^2+3)^4}dt
=-\frac{62}{10125}.$$

### Exercice 8

| Intégrale | Valeur exacte |
|---|---|
| $\int_1^2x\sqrt{3-x}dx$ | $\dfrac{12\sqrt2-8}{5}$ |
| $\int_0^1(x+1)e^xdx$ | $e$ |
| $\int_{\pi/4}^{\pi/2}x\cos x\,dx$ | $\dfrac\pi2-\dfrac{\sqrt2(\pi+4)}8$ |
| $\int_2^3\ln x\,dx$ | $3\ln3-2\ln2-1$ |
| $\int_0^2x^2e^xdx$ | $2e^2-2$ |

La dernière demande deux intégrations par parties. Une primitive utile est

$$e^x(x^2-2x+2).$$

> **Erreur fréquente.** Dans une intégration par parties, oublier le terme aux bornes $[uv]_a^b$ change complètement le résultat.

> **Astuce mémoire de Davy.** « Le logarithme descend, l’exponentielle reste. » Dérive souvent $\ln x$ et primitive $e^x$.`,
    keyPoint: "$\\int_a^buv'=[uv]_a^b-\\int_a^bu'v$ ; avant cela, cherche toujours une forme composée plus directe.",
    example: "$\\int_1^ex^2\\ln x\\,dx=(2e^3+1)/9$ en choisissant $u=\\ln x$ et $v'=x^2$.",
    methodSteps: [
      "Cherche d’abord une forme u′/u, u′e^u ou u′u^n.",
      "Si le produit résiste, choisis le facteur à dériver pour le simplifier.",
      "Détermine une primitive v de v′ et écris toute la formule d’intégration par parties.",
      "Évalue le terme [uv] aux bornes, puis calcule l’intégrale restante.",
      "Dérive mentalement le résultat ou contrôle son signe et son ordre de grandeur.",
    ],
    timeline: [
      { label: "Reconnaître", detail: "Tester d’abord les formes composées immédiates." },
      { label: "Choisir", detail: "Fixer u et v′ pour simplifier u′v." },
      { label: "Formule", detail: "Écrire [uv] moins l’intégrale restante." },
      { label: "Bornes", detail: "Évaluer chaque terme avec soin." },
    ],
    questions: [
      choice("Quelle forme reconnaît-on dans $e^x/(1+e^x)$ ?", ["$u'/u$", "$u'u$", "$u''$", "Une fonction impaire"], 0, "Avec u=1+e^x, u′=e^x.", "Exemple 1 • page 6"),
      choice("$\\int_0^1e^x/(1+e^x)dx$ vaut :", ["$\\ln((1+e)/2)$", "$e-1$", "$1/(1+e)$", "$0$"], 0, "$[\\ln(1+e^x)]_0^1$ donne ce résultat.", "Exemple 1 • page 6", 2),
      choice("$\\int_0^1xe^{x^2}dx$ vaut :", ["$(e-1)/2$", "$e-1$", "$e/2$", "$1$"], 0, "Le facteur x représente la moitié de la dérivée de x².", "Exemple 2 • page 6", 2),
      choice("Pour intégrer $\\cos^3t$, le PDF propose :", ["$(1-\\sin^2t)\\cos t$", "$(1+\\sin^2t)\\cos t$", "$\\sin^3t$", "$1-\\cos t$"], 0, "$\\cos^2t=1-\\sin^2t$.", "Exemple 3 • page 6"),
      choice("$\\int_0^{\\pi/3}\\cos^3t\\,dt$ vaut :", ["$3\\sqrt3/8$", "$\\sqrt3/2$", "$1/3$", "$0$"], 0, "$[\\sin t-\\sin^3t/3]_0^{\\pi/3}=3\\sqrt3/8$.", "Exemple 3 • page 6", 2),
      choice("La formule d’intégration par parties est :", ["$\\int uv'=[uv]-\\int u'v$", "$\\int uv'=\\int u'v$", "$\\int uv'=[u'v']$", "$\\int uv'=uv$"], 0, "Le terme aux bornes et le signe moins sont indispensables.", "Propriété • page 6"),
      choice("Pour $\\int_1^ex^2\\ln xdx$, quel choix est le plus efficace ?", ["$u=\\ln x$ et $v'=x^2$", "$u=x^2$ et $v'=\\ln x$", "$u=1$", "Aucun"], 0, "La dérivée de ln x devient 1/x et simplifie le produit.", "Exercice de fixation • pages 6-7"),
      choice("$\\int_1^ex^2\\ln xdx$ vaut :", ["$(2e^3+1)/9$", "$e^3/3$", "$(e^3-1)/9$", "$0$"], 0, "Le terme aux bornes vaut e³/3 et l’intégrale restante vaut (e³-1)/9.", "Exercice de fixation • pages 6-7", 3),
      choice("Exercice 1. La première intégrale vaut :", ["$e^{\\sqrt2/2+\\pi^2/16}-1$", "$e^{\\pi/4}$", "$1$", "$\\sqrt2/2$"], 0, "L’intégrande est la dérivée de sin x+x² multipliée par son exponentielle.", "Exercice 1 • page 12", 2),
      choice("Exercice 1. $\\int_1^e\\sqrt{\\ln z+2}/z\\,dz$ vaut :", ["$\\frac23(3\\sqrt3-2\\sqrt2)$", "$\\sqrt3-\\sqrt2$", "$e-1$", "$3/2$"], 0, "Avec u=ln z+2, les bornes deviennent 2 et 3.", "Exercice 1 • page 12", 2),
      choice("Exercice 1. La troisième intégrale vaut :", ["$-62/10125$", "$62/10125$", "$1/6$", "$0$"], 0, "u=t⁴-t²+3 et du=2(2t³-t)dt.", "Exercice 1 • page 12", 3),
      truth("$\\cos^3t=(1-\\sin^2t)\\cos t$.", true, "On remplace cos²t par 1-sin²t.", "Exercice 3.1 • page 12"),
      choice("$\\int_0^{\\pi/3}-4\\cos^3t\\,dt$ vaut :", ["$-3\\sqrt3/2$", "$3\\sqrt3/2$", "$-4$", "$0$"], 0, "On multiplie 3√3/8 par -4.", "Exercice 3.2 • page 12", 2),
      choice("$\\int_1^2x\\sqrt{3-x}dx$ vaut :", ["$(12\\sqrt2-8)/5$", "$2\\sqrt2$", "$1$", "$(8-12\\sqrt2)/5$"], 0, "Le changement u=3-x transforme le calcul en puissances de u.", "Exercice 8 • page 12", 2),
      short("Calcule $\\int_0^1(x+1)e^xdx$.", ["e", "E"], "Une primitive est xe^x.", "Exercice 8 • page 12", 2),
      choice("$\\int_{\\pi/4}^{\\pi/2}x\\cos xdx$ vaut :", ["$\\pi/2-\\sqrt2(\\pi+4)/8$", "$\\pi/4$", "$\\sqrt2/2$", "$0$"], 0, "Une primitive est x sin x+cos x.", "Exercice 8 • page 12", 3),
      choice("$\\int_2^3\\ln xdx$ vaut :", ["$3\\ln3-2\\ln2-1$", "$\\ln(3/2)$", "$1$", "$3\\ln3-2\\ln2+1$"], 0, "Une primitive de ln x est x ln x-x.", "Exercice 8 • page 12", 2),
      choice("$\\int_0^2x^2e^xdx$ vaut :", ["$2e^2-2$", "$4e^2$", "$e^2-1$", "$2e^2+2$"], 0, "Une primitive est e^x(x²-2x+2).", "Exercice 8 • page 12", 3),
      choice("Combien d’intégrations par parties le PDF demande-t-il pour $\\int_0^2x^2e^xdx$ ?", ["Deux", "Une", "Trois", "Aucune"], 0, "Le polynôme de degré 2 doit être dérivé deux fois.", "Exercice 8 • page 12"),
      choice("Une primitive de $u'/u$ est :", ["$\\ln|u|$", "$u^2/2$", "$e^u$", "$1/u$"], 0, "C’est la forme composée logarithmique.", "Technique de primitives • page 6"),
      choice("Pour intégrer un produit polynôme-exponentielle, on dérive généralement :", ["Le polynôme", "L’exponentielle", "Les deux deux fois d’abord", "Aucun facteur"], 0, "Le degré du polynôme diminue à chaque intégration par parties.", "Méthode du niveau"),
      short("Calcule $\\int_0^1 2xe^{x^2}dx$.", ["e-1", "-1+e"], "C’est directement $[e^{x^2}]_0^1=e-1$.", "Application de la forme u′e^u"),
    ],
  },
  {
    id: "integral-substitution",
    title: "Changer de variable et traiter les formes composées",
    summary: "Transformer l’intégrande et les bornes, découper une valeur absolue et résoudre les exercices de substitution du document.",
    pages: "7, 12-13",
    section: "II-3. Changement de variable affine et exercices",
    durationMinutes: 48,
    kind: "practice",
    body: String.raw`## Changement de variable affine

Pour calculer

$$\int_a^bf(\alpha x+\beta)dx\qquad(\alpha\ne0),$$

on pose $t=\alpha x+\beta$. Alors

$$dt=\alpha dx,\qquad dx=\frac1\alpha dt.$$

Les bornes changent elles aussi :

$$x=a\Longrightarrow t=\alpha a+\beta,
\qquad x=b\Longrightarrow t=\alpha b+\beta.$$

Donc

$$\int_a^bf(\alpha x+\beta)dx
=\frac1\alpha\int_{\alpha a+\beta}^{\alpha b+\beta}f(t)dt.$$

## Exercice de fixation

$$P=\int_{-1}^{0}\frac{dx}{\sqrt{2x+3}}.$$

Posons $t=2x+3$. Alors $dx=dt/2$, et les bornes $-1$ et $0$ deviennent $1$ et $3$ :

$$P=\frac12\int_1^3t^{-1/2}dt=[\sqrt t]_1^3=\sqrt3-1.$$

## Valeur absolue : découper au changement de signe

Pour l’exercice 2,

$$P=\int_{-4}^{6}\lvert x+3\rvert dx.$$

$x+3$ change de signe en $-3$ :

$$P=\int_{-4}^{-3}-(x+3)dx+\int_{-3}^{6}(x+3)dx=\frac12+\frac{81}{2}=41.$$

## Exercice 7 : formes logarithmiques

$$\int_{\pi/4}^{\pi/2}\frac{\cos x}{\sin x}dx
=\left[\ln(\sin x)\right]_{\pi/4}^{\pi/2}=\frac12\ln2.$$

$$\int_{\pi/4}^{\pi/3}\frac{\cos x}{\sin x}dx
=\frac12\ln\left(\frac32\right).$$

Pour la troisième intégrale, on respecte l’ordre inhabituel des bornes :

$$\int_{\pi/3}^{-\pi/6}\cos^5t\sin^5t\,dt=-\frac{203}{15360}.$$

## Exercice 9 : trois substitutions affines

| Intégrale | Substitution | Valeur |
|---|---|---|
| $\int_{-5/2}^{-2}(2x+5)^7dx$ | $u=2x+5$ | $1/16$ |
| $\int_{-1}^{0}\dfrac{x}{\sqrt{2x+3}}dx$ | $u=2x+3$ | $4/3-\sqrt3$ |
| $\int_0^1x\sqrt{x+1}dx$ | $u=x+1$ | $4(\sqrt2+1)/15$ |

## Exercices de renforcement : résultats détaillés

| Intégrale | Valeur exacte |
|---|---|
| $\int_0^1x\sqrt{1-x^2}dx$ | $1/3$ |
| $\int_e^{e^2}\dfrac{dx}{x(\ln x)^2}$ | $1/2$ |
| $\int_{5/3}^{2}\dfrac{x^2}{(3x-4)^5}dx$ | $155/648$ |
| $\int_{-5}^{12}2\lvert2x+3\rvert dx$ | $389$ |
| $\int_2^5\dfrac{x+5/2}{x^2+5x-6}dx$ | $\dfrac12\ln(11/2)$ |
| $\int_{\pi/3}^{-\pi/6}\cos^5t\sin^5t\,dt$ | $-203/15360$ |
| $\int_{-4}^{-2}\dfrac{t^2+3t-2}{t+1}dt$ | $4\ln3-2$ |
| $\int_0^{\pi/3}\sin^6x\,dx$ | $5\pi/48-9\sqrt3/64$ |

> **Erreur fréquente.** Changer seulement $dx$ sans transformer les bornes produit un calcul incohérent. Dès que tu poses la nouvelle variable, écris immédiatement ses deux nouvelles bornes.

> **Astuce mémoire de Davy.** « Nouvelle variable, nouvelles bornes. » Écris-les côte à côte avant toute primitive.`,
    keyPoint: "Une substitution transforme simultanément l’expression, le différentiel et les deux bornes.",
    example: "$t=2x+3$ transforme $\\int_{-1}^0dx/\\sqrt{2x+3}$ en $\\frac12\\int_1^3dt/\\sqrt t=\\sqrt3-1$.",
    methodSteps: [
      "Choisis la nouvelle variable pour simplifier l’expression composée.",
      "Calcule son différentiel et isole dx.",
      "Transforme immédiatement les deux bornes.",
      "Réécris toute l’intégrale dans la nouvelle variable, sans mélanger x et t.",
      "Calcule puis vérifie le signe avec l’ordre des bornes initiales.",
    ],
    timeline: [
      { label: "Poser", detail: "Choisir t=αx+β ou une expression intérieure adaptée." },
      { label: "Différentiel", detail: "Relier dt et dx avec le bon facteur." },
      { label: "Bornes", detail: "Convertir la borne basse et la borne haute." },
      { label: "Calculer", detail: "Intégrer uniquement dans la nouvelle variable." },
    ],
    questions: [
      choice("Si $t=2x+3$, alors $dx$ vaut :", ["$dt/2$", "$2dt$", "$dt+3$", "$dx/2$"], 0, "$dt=2dx$.", "Changement de variable • page 7"),
      choice("Avec $t=2x+3$, la borne x=-1 devient :", ["1", "-1", "3", "5"], 0, "$2(-1)+3=1$.", "Exercice de fixation • page 7"),
      choice("Avec la même substitution, la borne x=0 devient :", ["3", "0", "1", "2"], 0, "$2(0)+3=3$.", "Exercice de fixation • page 7"),
      choice("$\\int_{-1}^{0}dx/\\sqrt{2x+3}$ vaut :", ["$\\sqrt3-1$", "$1-\\sqrt3$", "$2\\sqrt3$", "$1$"], 0, "$P=[\\sqrt t]_1^3=\\sqrt3-1$.", "Exercice de fixation • page 7", 2),
      choice("Pour $|x+3|$, le changement de signe se produit en :", ["-3", "3", "0", "-4"], 0, "$x+3=0$ donne x=-3.", "Exercice 2 • page 12"),
      short("Calcule $\\int_{-4}^{6}|x+3|dx$.", ["41", "+41"], "Les deux aires triangulaires valent 1/2 et 81/2.", "Exercice 2 • page 12", 2),
      choice("$\\int_{\\pi/4}^{\\pi/2}\\cos x/\\sin x\\,dx$ vaut :", ["$\\frac12\\ln2$", "$\\ln2$", "$0$", "$-\\frac12\\ln2$"], 0, "Une primitive est ln(sin x).", "Exercice 7 • page 12", 2),
      choice("$\\int_{\\pi/4}^{\\pi/3}\\cos x/\\sin x\\,dx$ vaut :", ["$\\frac12\\ln(3/2)$", "$\\ln(3/2)$", "$\\frac12\\ln2$", "$0$"], 0, "$\\ln((\\sqrt3/2)/(\\sqrt2/2))=\\frac12\\ln(3/2)$.", "Exercice 7 • page 12", 2),
      choice("$\\int_{\\pi/3}^{-\\pi/6}\\cos^5t\\sin^5t\\,dt$ est :", ["$-203/15360$", "$203/15360$", "$0$", "$-1/2$"], 0, "L’ordre décroissant des bornes explique le signe négatif.", "Exercice 7 • page 12", 3),
      short("Calcule $\\int_{-5/2}^{-2}(2x+5)^7dx$.", ["1/16", "0,0625", "0.0625"], "u=2x+5 donne (1/2)∫₀¹u⁷du=1/16.", "Exercice 9 • page 12", 2),
      choice("$\\int_{-1}^{0}x/\\sqrt{2x+3}dx$ vaut :", ["$4/3-\\sqrt3$", "$\\sqrt3-1$", "$\\sqrt3-4/3$", "$1/2$"], 0, "Après u=2x+3, on intègre (u-3)/(4√u).", "Exercice 9 • page 12", 3),
      choice("$\\int_0^1x\\sqrt{x+1}dx$ vaut :", ["$4(\\sqrt2+1)/15$", "$2\\sqrt2/3$", "$4(\\sqrt2-1)/15$", "$1$"], 0, "u=x+1 donne ∫₁²(u-1)√u du.", "Exercice 9 • page 12", 3),
      short("Calcule $\\int_0^1x\\sqrt{1-x^2}dx$.", ["1/3", "0,333", "0.333"], "u=1-x² et du=-2x dx donnent 1/3.", "Renforcement • page 13", 2),
      short("Calcule $\\int_e^{e^2}dx/[x(\\ln x)^2]$.", ["1/2", "0,5", "0.5"], "u=ln x transforme les bornes en 1 et 2.", "Renforcement • page 13", 2),
      choice("$\\int_{5/3}^{2}x^2/(3x-4)^5dx$ vaut :", ["$155/648$", "$648/155$", "$1/2$", "$0$"], 0, "u=3x-4 transforme les bornes en 1 et 2 puis on développe (u+4)².", "Renforcement • page 13", 3),
      short("Calcule $\\int_{-5}^{12}2|2x+3|dx$.", ["389", "+389"], "u=2x+3 donne ∫₋₇²⁷|u|du=(49+729)/2=389.", "Renforcement • page 13", 2),
      choice("$\\int_2^5(x+5/2)/(x^2+5x-6)dx$ vaut :", ["$\\frac12\\ln(11/2)$", "$\\ln(11/2)$", "$11/4$", "$0$"], 0, "Le numérateur est la moitié de la dérivée du dénominateur.", "Renforcement • page 13", 3),
      choice("$\\int_{-4}^{-2}(t^2+3t-2)/(t+1)dt$ vaut :", ["$4\\ln3-2$", "$2-4\\ln3$", "$4\\ln3+2$", "$0$"], 0, "La division donne t+2-4/(t+1).", "Renforcement • page 13", 3),
      choice("La valeur de $\\int_0^{\\pi/3}\\sin^6x dx$ est :", ["$5\\pi/48-9\\sqrt3/64$", "$5\\pi/48+9\\sqrt3/64$", "$0$", "$\\pi/6$"], 0, "On utilise la formule de réduction de sin⁶ puis on évalue en π/3.", "Renforcement • page 13", 3),
      truth("Après un changement de variable, on peut conserver les anciennes bornes sans revenir à x.", false, "Si l’intégrale est entièrement en t, les bornes doivent aussi être exprimées en t.", "Méthode du niveau"),
      choice("Pour une valeur absolue, la première étape est :", ["Trouver ses zéros et découper", "La supprimer", "Changer le signe partout", "Dériver"], 0, "Le signe de l’expression intérieure détermine la définition par morceaux.", "Exercice 2 • page 12"),
      choice("Quel contrôle détecte une erreur d’orientation ?", ["Comparer le signe attendu au signe obtenu", "Changer toutes les bornes en 0", "Arrondir immédiatement", "Supprimer le facteur 1/α"], 0, "Une intégrande positive avec des bornes croissantes doit donner un résultat positif.", "Méthode du niveau"),
    ],
  },
  {
    id: "integral-symmetry-function",
    title: "Symétries, aires et fonctions définies par une intégrale",
    summary: "Exploiter parité et périodicité, calculer des aires générales et résoudre les missions de synthèse du document.",
    pages: "7-16",
    section: "II-4, III, IV, situation complexe et approfondissement",
    durationMinutes: 68,
    kind: "challenge",
    body: String.raw`## Fonctions paires et impaires

Si $f$ est continue sur un intervalle symétrique $[-a;a]$ :

$$f\text{ paire}\Longrightarrow\int_{-a}^{a}f(x)dx=2\int_0^af(x)dx$$

$$f\text{ impaire}\Longrightarrow\int_{-a}^{a}f(x)dx=0.$$

Dans l’exercice de fixation :

$$\int_{-\pi/4}^{\pi/4}\cos2x\,dx=1$$

car $\cos2x$ est paire, tandis que

$$\int_{-\pi/4}^{\pi/4}\sin2x\,dx=0$$

car $\sin2x$ est impaire.

## Fonction périodique

Si $f$ est continue et de période $T$ :

$$\int_a^{a+T}f(x)dx=\int_0^Tf(x)dx.$$

Comme $\cos2x$ est de période $\pi$ :

$$\int_{\pi/2}^{3\pi/2}\cos2x\,dx=\int_0^\pi\cos2x\,dx=0.$$

## Calcul d’aires : le signe décide de la formule

Pour $f$ continue sur $[a;b]$ :

- si $f\ge0$, $\mathcal A=\int_a^bf(x)dx$ ;
- si $f\le0$, $\mathcal A=-\int_a^bf(x)dx$ ;
- si $f$ change de signe, on découpe aux zéros et on additionne les valeurs absolues des intégrales.

Entre deux courbes $y=f(x)$ et $y=g(x)$ :

$$\mathcal A=\int_a^b\lvert f(x)-g(x)\rvert dx.$$

Si $g\ge f$ sur tout $[a;b]$, cela devient $\int_a^b(g-f)dx$.

### Aire sous $f(x)=-x^2$ sur $[1;3]$

Avec 2 cm en abscisse et 4 cm en ordonnée :

$$\mathcal A=-\int_1^3(-x^2)dx=\frac{26}{3}\,\text{u.a.}$$

$$\mathcal A=\frac{26}{3}\times8=\frac{208}{3}\,cm^2.$$

### Aire associée à $f(x)=x^3$ sur $[-1;1]$

La fonction change de signe en 0 :

$$\mathcal A=-\int_{-1}^0x^3dx+\int_0^1x^3dx=\frac12\,\text{u.a.}$$

Avec une unité graphique de 2 cm sur chaque axe, $1$ u.a. vaut $4\,cm^2$, donc l’aire vaut $2\,cm^2$.

### Exercice 11 : entre une droite et une parabole

Pour $f(x)=x+2$ et $g(x)=x^2$ sur $[-1;2]$ :

$$f(x)-g(x)=-(x+1)(x-2)\ge0.$$

La droite est au-dessus de la parabole :

$$\int_{-1}^{2}(x+2-x^2)dx=\frac92\,\text{u.a.}$$

Le repère est orthonormé d’unité 2 cm, donc

$$\mathcal A=\frac92\times4=18\,cm^2.$$

## Fonction définie par une intégrale

Si $f$ est continue sur un intervalle $K$ et $a\in K$, alors

$$F(x)=\int_a^xf(t)dt$$

est l’unique primitive de $f$ qui s’annule en $a$ :

$$F'(x)=f(x),\qquad F(a)=0.$$

On retrouve ainsi le logarithme népérien :

$$\ln x=\int_1^x\frac{dt}{t}\qquad(x>0).$$

## Mission finale : la terrasse

La terrasse comprend :

- un rectangle de $4$ m sur $2$ m, donc d’aire $8\,m^2$ ;
- une partie rose sous la parabole $y=4-x^2$ entre $-2$ et $2$.

La parabole est positive sur $[-2;2]$ :

$$\mathcal A_1=\int_{-2}^{2}(4-x^2)dx
=\left[4x-\frac{x^3}{3}\right]_{-2}^{2}
=\frac{32}{3}\,m^2.$$

L’aire totale correcte est donc

$$\mathcal A=8+\frac{32}{3}=\frac{56}{3}\approx18{,}67\,m^2.$$

> **Correction majeure du PDF.** Le document obtient 16 m² pour la partie parabolique puis 24 m² au total. L’évaluation de la primitive en $-2$ y est mal soustraite : l’aire parabolique correcte est $32/3$ m² et le total $56/3$ m².

## Exercice 10 : exploiter les symétries

$$\int_{-\pi/6}^{\pi/6}x^6\sin x\,dx=0$$

car l’intégrande est impaire.

L’intégrande $x^6\cos x$ est paire :

$$\int_{-\pi/6}^{\pi/6}x^6\cos x\,dx
=2\int_0^{\pi/6}x^6\cos x\,dx.$$

Une primitive est

$$x^6\sin x+6x^5\cos x-30x^4\sin x-120x^3\cos x+360x^2\sin x+720x\cos x-720\sin x.$$

Enfin,

$$\int_{\pi/2}^{5\pi/2}\cos x\,dx=0$$

car l’intervalle couvre une période complète de $2\pi$.

## Exercice 12 : chute libre

La formule donnée par le document correspond à un corps lâché sans vitesse initiale : $v(t)=gt$. La distance parcourue après $x$ secondes est

$$D(x)=\int_0^xgt\,dt=\frac12gx^2=4{,}9x^2.$$

Le sol est atteint lorsque $D(T)=2000$ :

$$4{,}9T^2=2000\Longrightarrow T=\frac{100\sqrt2}{7}\approx20{,}20\,s.$$

## Approfondissement 1 : $f(x)=x+1-e^x$

- $f(x)\to-\infty$ et $f(x)/x\to-\infty$ lorsque $x\to+\infty$ ;
- $f(x)\to-\infty$ lorsque $x\to-\infty$ ;
- $f(x)-(x+1)=-e^x\to0$ en $-\infty$ : la droite $y=x+1$ est asymptote ;
- $-e^x<0$ : la courbe reste sous cette droite ;
- $f'(x)=1-e^x$, donc f croît jusqu’à $0$, atteint $f(0)=0$, puis décroît ;
- avec une unité de 2 cm sur chaque axe, l’aire entre la courbe et l’asymptote sur $[-2;0]$ vaut

$$4\int_{-2}^{0}e^xdx=4(1-e^{-2})\,cm^2.$$

## Approfondissement 2 : $F(x)=\int_1^x\dfrac{e^t}{t}dt$

$F$ est définie sur $]0;+\infty[$ et

$$F'(x)=\frac{e^x}{x}>0.$$

Elle est strictement croissante et $F(1)=0$. Posons $h(x)=F(x)-\ln x$ :

$$h(x)=\int_1^x\frac{e^t-1}{t}dt.$$

L’intégrande est positive pour $t>0$. À cause du sens des bornes :

$$0<x<1\Longrightarrow h(x)<0,
\qquad x>1\Longrightarrow h(x)>0.$$

On en déduit

$$F(x)\to-\infty\text{ quand }x\to0^+,
\qquad F(x)\to+\infty\text{ quand }x\to+\infty.$$

La droite $x=0$ est donc une asymptote verticale. Pour $x>1$ et $t\in[1;x]$ :

$$\frac{e^t}{t}\ge\frac{e^t}{x}.$$

Ainsi,

$$F(x)\ge\frac1x\int_1^xe^tdt=\frac{e^x-e}{x},$$

puis

$$\frac{F(x)}x\ge\frac{e^x-e}{x^2}\longrightarrow+\infty.$$

La courbe possède en $+\infty$ une branche parabolique de direction l’axe des ordonnées.

> **Astuce mémoire de Davy.** « Aire : haut moins bas ; fonction-intégrale : la dérivée retrouve l’intégrande. »`,
    keyPoint: "$F(x)=\\int_a^xf(t)dt$ vérifie $F'=f$ ; pour une aire, on additionne toujours des contributions positives.",
    example: "La terrasse vaut $8+\\int_{-2}^{2}(4-x^2)dx=56/3\\approx18{,}67$ m².",
    methodSteps: [
      "Teste d’abord la parité ou la périodicité avant tout calcul long.",
      "Pour une aire, étudie le signe ou l’ordre des deux courbes et découpe si nécessaire.",
      "Convertis les unités d’aire seulement après le calcul intégral.",
      "Pour F(x)=∫ₐˣf, dérive avec le théorème fondamental et utilise F(a)=0.",
      "Dans une étude de limite, compare l’intégrande à une fonction de référence sur le bon intervalle.",
    ],
    timeline: [
      { label: "Simplifier", detail: "Parité, périodicité ou signe peuvent éviter un calcul." },
      { label: "Découper", detail: "Séparer les zones positives et négatives ou les courbes qui se croisent." },
      { label: "Intégrer", detail: "Appliquer la technique adaptée sur chaque morceau." },
      { label: "Interpréter", detail: "Aire, dérivée, limite ou comportement graphique." },
    ],
    interaction: terraceInteraction,
    corrections: [
      "Page 10, exercice 2 : l’énoncé demande une aire « en unités d’aire », tandis que la solution applique l’unité graphique de 2 cm et conclut en cm². Les deux valeurs sont distinguées : 1/2 u.a., soit 2 cm².",
      "Pages 11-12, situation complexe : l’intégrale de 4-x² sur [-2;2] vaut 32/3 et non 16. L’aire totale de la terrasse vaut donc 56/3 ≈ 18,67 m², et non 24 m².",
      "Page 13, exercice 12 : la formulation sur la vitesse initiale est tronquée. La formule D(x)=∫₀ˣgt dt montre que le modèle utilisé est celui d’un corps lâché sans vitesse initiale.",
      "Page 13, approfondissement 1 : l’équation de l’asymptote est imprimée deux fois sous la forme « y=x y=x+1 ». Elle est rétablie comme y=x+1.",
      "Page 16, approfondissement 2 : la ligne « lim F(x)=0 quand x→0 » contredit la comparaison démontrée à la page précédente. La limite correcte est -∞, ce qui donne bien l’asymptote verticale x=0.",
      "Page 16 : la remarque finale « F(x)/x=1/x » est fausse. Elle est remplacée par l’inégalité correcte F(x)/x ≥ (e^x-e)/x², suffisante pour conclure.",
    ],
    questions: [
      truth("La fonction $x^6\\sin x$ est impaire.", true, "x⁶ est paire et sin x impaire ; leur produit est impair.", "Exercice 10 • page 13"),
      short("Calcule $\\int_{-\\pi/6}^{\\pi/6}x^6\\sin xdx$.", ["0", "+0", "-0"], "Une fonction impaire intégrée sur un intervalle symétrique donne 0.", "Exercice 10 • page 13", 2),
      truth("La fonction $x^6\\cos x$ est paire.", true, "x⁶ et cos x sont toutes deux paires.", "Exercice 10 • page 13"),
      choice("$\\int_{-\\pi/6}^{\\pi/6}x^6\\cos xdx$ se simplifie en :", ["$2\\int_0^{\\pi/6}x^6\\cos xdx$", "$0$", "$\\int_0^{\\pi/6}x^6\\cos xdx$", "$-2\\int_0^{\\pi/6}x^6\\cos xdx$"], 0, "L’intégrande est paire.", "Exercice 10 • page 13", 2),
      short("Calcule $\\int_{\\pi/2}^{5\\pi/2}\\cos xdx$.", ["0", "+0", "-0"], "L’intervalle a une longueur 2π, une période de cos.", "Exercice 10 • page 13"),
      short("Calcule $\\int_{-\\pi/4}^{\\pi/4}\\cos2x\\,dx$.", ["1", "+1"], "La fonction est paire et [sin2x/2] donne 1.", "Exercice de fixation • pages 7-8"),
      short("Calcule $\\int_{-\\pi/4}^{\\pi/4}\\sin2x\\,dx$.", ["0", "+0", "-0"], "La fonction est impaire.", "Exercice de fixation • pages 7-8"),
      truth("$\\cos2x$ est de période π.", true, "$\\cos(2(x+\\pi))=\\cos(2x+2\\pi)=\\cos2x$.", "Propriété 2 • page 8"),
      short("Calcule $\\int_{\\pi/2}^{3\\pi/2}\\cos2x\\,dx$.", ["0", "+0", "-0"], "L’intervalle couvre une période complète de cos2x.", "Exercice de fixation • page 8"),
      choice("Pour une fonction négative sur [a;b], l’aire sous la courbe vaut :", ["$-\\int_a^bf$", "$\\int_a^bf$", "$0$", "$f(b)-f(a)$"], 0, "On prend l’opposé de l’intégrale négative.", "Calcul d’aires • page 8"),
      choice("L’aire sous $f(x)=-x^2$ sur [1;3] vaut en u.a. :", ["$26/3$", "$-26/3$", "$208/3$", "$8$"], 0, "$-∫_1^3(-x²)dx=∫_1^3x²dx=26/3$.", "Exercice 1 • page 10", 2),
      choice("Avec les unités 2 cm et 4 cm, cette aire vaut :", ["$208/3\\,cm^2$", "$26/3\\,cm^2$", "$52/3\\,cm^2$", "$208\\,cm^2$"], 0, "Une u.a. vaut 8 cm².", "Exercice 1 • page 10", 2),
      short("Pour $f(x)=x^3$ sur [-1;1], donne l’aire géométrique en u.a.", ["1/2", "0,5", "0.5"], "Chaque moitié apporte 1/4 u.a.", "Exercice 2 • pages 10-11", 2),
      short("Avec une unité graphique de 2 cm sur chaque axe, donne cette aire en cm².", ["2", "2cm2", "2cm²"], "$1/2\\times4=2$ cm².", "Exercice 2 • pages 10-11"),
      choice("Sur [-1;2], entre $x+2$ et $x^2$, quelle fonction est au-dessus ?", ["$x+2$", "$x^2$", "Elles sont confondues", "Cela change en 0"], 0, "$x+2-x²=-(x+1)(x-2)≥0$ sur l’intervalle.", "Exercice 11 • page 13"),
      short("Calcule l’aire entre ces deux courbes en u.a.", ["9/2", "4,5", "4.5"], "$∫_{-1}^2(x+2-x²)dx=9/2$.", "Exercice 11 • page 13", 2),
      short("Donne cette aire en cm² avec une unité graphique de 2 cm.", ["18", "18cm2", "18cm²"], "$9/2\\times4=18$ cm².", "Exercice 11 • page 13", 2),
      choice("Si $F(x)=\\int_a^xf(t)dt$, alors :", ["$F'(x)=f(x)$", "$F'(x)=0$", "$F'(x)=f(a)$", "$F(x)=f'(x)$"], 0, "C’est le théorème fondamental utilisé dans le cours.", "Propriété • page 11"),
      short("Combien vaut $F(a)$ pour $F(x)=\\int_a^xf(t)dt$ ?", ["0", "+0", "-0"], "Les deux bornes deviennent identiques.", "Propriété • page 11"),
      choice("La représentation intégrale de ln x est :", ["$\\int_1^xdt/t$", "$\\int_0^xdt/t$", "$\\int_1^xe^tdt$", "$1/x$"], 0, "ln est la primitive de 1/x qui s’annule en 1.", "Exercice • page 11"),
      short("Mission terrasse : calcule l’aire du rectangle en m².", ["8", "+8"], "$4\\times2=8$ m².", "Situation complexe • pages 11-12"),
      short("Calcule $\\int_{-2}^{2}(4-x^2)dx$.", ["32/3", "10,666", "10.666"], "La valeur correcte est [4x-x³/3] de -2 à 2 =32/3.", "Situation complexe corrigée • pages 11-12", 3),
      short("Donne l’aire totale correcte de la terrasse sous forme de fraction.", ["56/3"], "$8+32/3=56/3$ m².", "Situation complexe corrigée • pages 11-12", 3),
      choice("La valeur 24 m² imprimée dans le PDF est-elle correcte ?", ["Non", "Oui"], 0, "Elle provient d’une mauvaise évaluation de la primitive en -2.", "Correction de la situation complexe • page 12", 2),
      choice("Pour la chute libre du PDF, $D(x)$ vaut :", ["$4,9x^2$", "$9,8x$", "$2000-9,8x$", "$x^2$"], 0, "$D(x)=∫₀ˣ9,8t dt=4,9x²$.", "Exercice 12 • page 13"),
      choice("Le temps de chute depuis 2000 m vaut :", ["$100\\sqrt2/7\\approx20,20$ s", "$200$ s", "$9,8$ s", "$14$ s"], 0, "$4,9T²=2000$.", "Exercice 12 • page 13", 3),
      choice("Pour $f(x)=x+1-e^x$, la limite en +∞ est :", ["$-\\infty$", "$+\\infty$", "$0$", "$1$"], 0, "L’exponentielle domine le terme affine.", "Approfondissement 1.1 • pages 13-14"),
      choice("La limite de $f(x)/x$ en +∞ est :", ["$-\\infty$", "$1$", "$0$", "$+\\infty$"], 0, "$e^x/x$ domine les autres termes.", "Approfondissement 1.1 • pages 13-14"),
      choice("L’asymptote en -∞ est :", ["$y=x+1$", "$y=x$", "$x=0$", "$y=0$"], 0, "$f(x)-(x+1)=-e^x→0$.", "Approfondissement 1.2 • page 14"),
      choice("La courbe de f est située :", ["Sous la droite y=x+1", "Au-dessus", "Sur la droite", "Alternativement"], 0, "$f(x)-(x+1)=-e^x<0$.", "Approfondissement 1.2 • page 14"),
      choice("Où f atteint-elle son maximum ?", ["En x=0, avec f(0)=0", "En x=1", "En -∞", "Elle n’a pas de maximum"], 0, "$f'=1-e^x$ change de + à - en 0.", "Approfondissement 1.3 • page 14", 2),
      choice("L’aire entre la courbe et son asymptote sur [-2;0], en cm², vaut :", ["$4(1-e^{-2})$", "$1-e^{-2}$", "$4e^{-2}$", "$0$"], 0, "La différence vaut e^x et 1 u.a.=4 cm².", "Approfondissement 1.5 • page 14", 3),
      choice("Le domaine de $F(x)=\\int_1^xe^t/t\\,dt$ est :", ["$]0;+\\infty[$", "$\\mathbb R$", "$]-\\infty;0[$", "$[1;+\\infty[$"], 0, "L’intégrande e^t/t est continue sur les positifs.", "Approfondissement 2.1 • pages 14-15"),
      choice("La dérivée de F est :", ["$e^x/x$", "$e^x$", "$1/x$", "$F(x)$"], 0, "La dérivée d’une intégrale à borne variable retrouve l’intégrande.", "Approfondissement 2.2 • page 15"),
      truth("F est strictement croissante sur $]0;+\\infty[$.", true, "$e^x/x>0$ sur ce domaine.", "Approfondissement 2.2 • page 15"),
      choice("Pour $h(x)=F(x)-\\ln x$, quel signe obtient-on sur ]0;1[ ?", ["h(x)<0", "h(x)>0", "h(x)=0", "h n’est pas définie"], 0, "L’intégrande est positive mais les bornes 1→x sont inversées.", "Approfondissement 2.3 • page 15", 2),
      choice("Les limites correctes de F sont :", ["$-\\infty$ en 0+ et $+\\infty$ en +∞", "$0$ aux deux extrémités", "$+\\infty$ en 0+", "$1$ en 0+"], 0, "La comparaison à ln x donne ces deux limites.", "Approfondissement 2.3 corrigé • pages 15-16", 3),
      choice("Quelle asymptote possède la courbe de F ?", ["La verticale x=0", "L’horizontale y=0", "La droite y=x", "Aucune"], 0, "$F(x)→-∞$ lorsque x→0+.", "Approfondissement 2.5 corrigé • page 16"),
      choice("Pour x>1, quelle minoration est correcte ?", ["$F(x)\\ge(e^x-e)/x$", "$F(x)\\le0$", "$F(x)=1/x$", "$F(x)\\le\\ln x$"], 0, "Sur [1;x], 1/t≥1/x.", "Approfondissement 2.6 • page 16", 3),
      choice("La limite de $F(x)/x$ en +∞ est :", ["$+\\infty$", "$0$", "$1$", "$-\\infty$"], 0, "$F(x)/x≥(e^x-e)/x²→+∞$.", "Approfondissement 2.6 corrigé • page 16", 3),
    ],
  },
];

const builtLevels = levels.map((level, index) => officialLevel(index, level));

export const terminalCIntegralCalculusPath: LearningPath = {
  id: "terminale-c-math-l15-integral-calculus",
  subjectId: "mathematics",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Terminale C • Leçon officielle fidèlement structurée",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Analyse" },
  chapterNumber: 15,
  title: "Calcul intégral",
  description: "Intégrale définie, propriétés, comparaison, valeur moyenne, techniques de calcul, aires et fonctions définies par une intégrale.",
  estimatedMinutes: builtLevels.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
  outcomes: [
    "Calculer une intégrale à l’aide d’une primitive",
    "Interpréter une intégrale en aire et convertir les unités",
    "Utiliser Chasles, la linéarité et les propriétés de comparaison",
    "Encadrer une intégrale et calculer une valeur moyenne",
    "Choisir entre primitive directe, intégration par parties et changement de variable",
    "Exploiter parité et périodicité",
    "Calculer des aires sous une courbe ou entre deux courbes",
    "Étudier une fonction définie par une intégrale",
  ],
  modules: [
    {
      id: "terminale-c-math-l15-integral-calculus-mastery",
      title: "Maîtriser le calcul intégral",
      description:
        "Huit niveaux progressifs, " +
        builtLevels.reduce((sum, lesson) => sum + (lesson.questions?.length ?? 0), 0) +
        " réponses évaluables, des visualisations interactives et les corrections explicites des coquilles du document.",
      lessons: builtLevels,
    },
  ],
};
