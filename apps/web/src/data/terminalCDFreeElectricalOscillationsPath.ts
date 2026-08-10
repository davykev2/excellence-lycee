import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 12 de Physique en Terminale C et leçon 10 en Terminale D.
const sourceDocument = "PHYS. Oscillations électriques libres dans un circuit LC.pdf";

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
      introduction: "Applique cette démarche au cours, aux oscillogrammes et aux exercices de la fiche ivoirienne.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : dans un circuit LC idéal, l’énergie ne disparaît pas ; elle voyage entre le condensateur et la bobine.",
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
  eyebrow: "Démarche",
  title,
  instruction,
  observation,
  items: items as [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]],
});

const levels: LevelSeed[] = [
  {
    id: "electrical-oscillator-capacitor-charge",
    title: "Définir un oscillateur et charger un condensateur",
    summary: "Reconnaître un oscillateur électrique, identifier le circuit LC et relier tension, charge et courant pendant la charge.",
    pages: "3 à 5",
    section: "1. Oscillateur électrique ; 2.1. Charge d’un condensateur",
    durationMinutes: 20,
    xp: 45,
    body: String.raw`## Qu’est-ce qu’un oscillateur électrique ?

Un **oscillateur électrique** est un système dont une grandeur électrique varie de façon périodique ou pseudopériodique : tension $u$, intensité $i$, charge $q$, etc.

Il peut produire un signal sinusoïdal, carré, triangulaire ou de toute autre forme. Sa fréquence peut être fixe ou réglable. La fiche cite trois grandes familles :

- l’oscillateur à circuit **LC** ;
- l’oscillateur à déphasage utilisant un étage **RC** ;
- l’oscillateur à **quartz**.

Cette leçon étudie le circuit LC, association d’un condensateur de capacité $C$ et d’une bobine d’inductance $L$.

## Charger le condensateur

Le condensateur possède deux armatures conductrices séparées par un isolant. Dans le montage de la fiche, le générateur, la résistance $R$, l’ampèremètre et le condensateur sont mis en série lorsque l’interrupteur $K$ est en position 1.

Au début de la charge :

- un courant bref circule ;
- des électrons quittent l’armature $A$, qui devient positive ;
- des électrons arrivent sur l’armature $B$, qui devient négative ;
- les charges restent opposées : $Q_A=-Q_B$.

On note $q=|Q_A|=|Q_B|$. La relation constitutive du condensateur est :

$$\boxed{q=C\,u_C}$$

Si $u_C=u_{AB}$, alors $q$ représente la charge de l’armature $A$.

## Fin de la charge

Sous une tension continue $E$, la tension $u_C$ croît progressivement de $0$ à $E$. Le courant de charge diminue et finit par s’annuler :

$$i\longrightarrow0,\qquad u_C\longrightarrow E,\qquad q\longrightarrow CE$$

Le condensateur est alors chargé. Il conserve de l’énergie électrique et peut ensuite alimenter un autre dipôle.

## Lecture de l’oscilloscope

La voie $Y_1$ montre la tension en échelon fournie par le générateur. La voie $Y_2$ montre la montée progressive de $u_C$. Dans un circuit de charge RC idéal, cette montée est exponentielle :

$$u_C(t)=E\left(1-e^{-t/(RC)}\right)$$

Cette formule précise le dessin de la fiche : après une durée de quelques constantes de temps $RC$, $u_C$ devient pratiquement égale à $E$.

> **Astuce mémoire.** Le condensateur se charge en **tension** et en **charge**, tandis que le courant ne dure que pendant la transition.` ,
    keyPoint: "En fin de charge continue : i=0, uC=E et q=CE ; les deux armatures portent +q et −q.",
    example: "Avec C=10 µF et E=12 V, q=CE=120 µC. L’armature positive porte +120 µC et l’autre −120 µC.",
    methodSteps: [
      "Identifie le générateur, la résistance, le condensateur et la position de charge de l’interrupteur.",
      "Choisis l’orientation de uC et nomme l’armature positive.",
      "Utilise q=C·uC à tout instant.",
      "En régime permanent continu, pose i=0 et uC=E.",
      "Vérifie les unités : C en farads, u en volts et q en coulombs.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma interactif",
      title: "Le condensateur pendant sa charge",
      instruction: "Sélectionne les repères pour suivre le courant et l’accumulation des charges.",
      observation: "Le générateur sépare les charges ; lorsque uC atteint E, le courant continu devient nul.",
      caption: "Figure originale redessinée d’après le montage de charge du document.",
      viewBox: "0 0 520 280",
      shapes: [
        { shape: "line", x1: 80, y1: 70, x2: 210, y2: 70, tone: "outline" },
        { shape: "line", x1: 210, y1: 70, x2: 285, y2: 70, tone: "accent" },
        { shape: "line", x1: 285, y1: 70, x2: 420, y2: 70, tone: "outline" },
        { shape: "line", x1: 420, y1: 70, x2: 420, y2: 220, tone: "outline" },
        { shape: "line", x1: 420, y1: 220, x2: 330, y2: 220, tone: "outline" },
        { shape: "line", x1: 235, y1: 190, x2: 235, y2: 250, tone: "accent" },
        { shape: "line", x1: 265, y1: 190, x2: 265, y2: 250, tone: "accent" },
        { shape: "line", x1: 330, y1: 220, x2: 265, y2: 220, tone: "outline" },
        { shape: "line", x1: 235, y1: 220, x2: 80, y2: 220, tone: "outline" },
        { shape: "line", x1: 80, y1: 220, x2: 80, y2: 70, tone: "outline" },
        { shape: "line", x1: 122, y1: 130, x2: 122, y2: 175, tone: "accent" },
        { shape: "line", x1: 140, y1: 140, x2: 140, y2: 165, tone: "outline" },
        { shape: "text", x: 130, y: 118, content: "G", anchor: "middle" },
        { shape: "text", x: 250, y: 270, content: "C", anchor: "middle" },
        { shape: "text", x: 250, y: 178, content: "+ +   − −", anchor: "middle" },
        { shape: "text", x: 362, y: 214, content: "R", anchor: "middle" },
        { shape: "text", x: 247, y: 61, content: "K", anchor: "middle" },
      ],
      hotspots: [
        { id: "generator", number: 1, label: "Générateur", detail: "Il impose la tension E et fournit l’énergie nécessaire pour séparer les charges.", x: 90, y: 150 },
        { id: "switch", number: 2, label: "Interrupteur K", detail: "En position de charge, il relie le condensateur au générateur à travers R.", x: 248, y: 70 },
        { id: "resistor", number: 3, label: "Résistance R", detail: "Elle limite le courant initial et fixe avec C la constante de temps RC.", x: 360, y: 220 },
        { id: "capacitor", number: 4, label: "Condensateur C", detail: "Ses armatures portent des charges opposées et sa tension vérifie q=C·uC.", x: 250, y: 220 },
      ],
    },
    questions: [
      choice("Un oscillateur électrique est un système où varie périodiquement…", ["une grandeur électrique", "uniquement la masse", "la température extérieure seulement", "la longueur d’un ressort sans tension"], 0, "Une tension, une intensité ou une charge peut constituer la grandeur oscillante.", "1.1 Définition", 1),
      choice("Le circuit étudié dans cette leçon contient principalement…", ["une bobine L et un condensateur C", "deux piles sans dipôle", "un moteur thermique", "une lentille et un miroir"], 0, "LC désigne l’inductance de la bobine et la capacité du condensateur.", "1.2 Exemples", 1),
      choice("Pendant la charge, l’armature qui perd des électrons devient…", ["positive", "négative", "neutre par obligation", "magnétique"], 0, "Perdre des électrons crée un déficit de charges négatives.", "2.1.3 Interprétation", 1),
      choice("Les charges des deux armatures vérifient…", ["QA=−QB", "QA=QB>0", "QA=QB<0", "QA=0 toujours"], 0, "Les armatures portent des charges opposées de même valeur absolue.", "2.1.3 Interprétation", 1),
      choice("La relation correcte du condensateur est…", ["q=C·uC", "q=uC/C", "q=L·i", "q=R/uC"], 0, "La charge est le produit de la capacité par la tension.", "2.1 Charge", 1),
      short("Calcule q pour C=10 µF et uC=12 V, en µC.", ["120", "120 µC", "120uC", "120 microcoulombs"], "10×12=120 µC.", "Application de q=C·uC", 2),
      choice("En fin de charge sous la tension continue E…", ["i=0 et uC=E", "i est maximal et uC=0", "i et uC sont infinis", "q=0 et i=E"], 0, "Une fois la charge achevée, la tension est E et le courant continu est nul.", "2.1.4 Conclusion", 1),
      choice("Sur l’oscilloscope, la tension uC de charge…", ["augmente progressivement vers E", "reste toujours nulle", "oscille immédiatement entre ±E", "diminue depuis −E"], 0, "Le condensateur acquiert progressivement la tension du générateur.", "2.1.5 Oscilloscope", 1),
      choice("La constante de temps d’une charge RC vaut…", ["RC", "L/C", "R+C", "1/LC"], 0, "Le produit RC s’exprime en secondes.", "Complément de lecture", 1),
      short("Donne q final pour C=2,5 µF et E=20 V, en µC.", ["50", "50 µC", "50uC", "50 microcoulombs"], "q=2,5×20=50 µC.", "2.1.4 Conclusion", 2),
    ],
  },
  {
    id: "natural-frequency-phase-quiz-one",
    title: "Relier tension, courant, phase et fréquence",
    summary: "Exprimer uC et i, lire leur quadrature puis résoudre intégralement le premier quiz officiel.",
    pages: "8 et 9",
    section: "3.3. Tension et intensité ; Quiz 1",
    durationMinutes: 24,
    xp: 75,
    kind: "graph",
    body: String.raw`## De la charge à la tension

Partons de :

$$q(t)=Q_m\cos(\omega_0t+\varphi)$$

Comme $u_C=q/C$, la tension du condensateur est :

$$\boxed{u_C(t)=U_m\cos(\omega_0t+\varphi)}$$

avec :

$$U_m=\frac{Q_m}{C}$$

## De la charge au courant

Avec la convention $i=\mathrm dq/\mathrm dt$ :

$$i(t)=-\omega_0Q_m\sin(\omega_0t+\varphi)$$

Or $-\sin\theta=\cos(\theta+\pi/2)$. Donc :

$$\boxed{i(t)=I_m\cos\left(\omega_0t+\varphi+\frac\pi2\right)}$$

et :

$$\boxed{I_m=\omega_0Q_m=\omega_0CU_m}$$

Dans cette convention, $i$ est en **quadrature avance** sur $u_C$ : son argument contient $+\pi/2$. Sur l’axe du temps, ses extrema sont décalés d’un quart de période.

- Quand $u_C=\pm U_m$, $i=0$.
- Quand $u_C=0$, $i=\pm I_m$.
- Le décalage temporel vaut $T_0/4$.

## Quiz 1 intégralement résolu

La fiche donne :

$$L=10\ \mathrm{mH}=10^{-2}\ \mathrm H$$

$$u_{AB}(t)=5\cos(100\pi t)\ \mathrm V$$

On lit immédiatement :

$$U_m=5\ \mathrm V,\qquad \omega_0=100\pi\ \mathrm{rad\,s^{-1}}$$

La période et la fréquence sont :

$$T_0=\frac{2\pi}{100\pi}=2,0\times10^{-2}\ \mathrm s=20\ \mathrm{ms}$$

$$f_0=\frac1{T_0}=50\ \mathrm{Hz}$$

La bobine est orientée de $F$ vers $E$. Comme $A$ est relié à $E$ et $B$ à $F$ :

$$u_{FE}=V_F-V_E=-u_{AB}$$

donc :

$$u_{FE}(t)=-5\cos(100\pi t)\ \mathrm V$$

La relation $LC\omega_0^2=1$ donne :

$$C=\frac1{L\omega_0^2}=\frac1{10^{-2}(100\pi)^2}\approx1,013\times10^{-3}\ \mathrm F$$

soit environ $1,01$ mF. Puis :

$$I_m=\omega_0CU_m\approx1,59\ \mathrm A$$

$$\boxed{i(t)\approx-1,59\sin(100\pi t)\ \mathrm A}$$

La charge maximale vaut enfin $Q_m=CU_m\approx5,07$ mC.

> **Astuce mémoire.** Quand la tension du condensateur est au sommet, le courant s’arrête un instant ; quand la tension passe par zéro, le courant est le plus intense.` ,
    keyPoint: "uC=Um cos(ω0t+φ), i=−ω0CUm sin(ω0t+φ) et Im=ω0CUm ; les deux signaux sont décalés de T0/4.",
    example: "Pour uC=5 cos(100πt), L=10 mH : T0=20 ms, f0=50 Hz, C≈1,013 mF et i≈−1,59 sin(100πt) A.",
    methodSteps: [
      "Lis Um et ω0 directement dans l’expression de uC.",
      "Calcule T0=2π/ω0 puis f0=1/T0.",
      "Utilise C=1/(Lω0²) si L est connue.",
      "Dérive q=C·uC pour obtenir i.",
      "Contrôle Im=ω0CUm et le décalage de T0/4.",
      "Pour une tension orientée en sens inverse, change explicitement le signe.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Oscillogramme interactif",
      title: "La tension du Quiz 1 sur deux périodes",
      instruction: "Déplace le point et repère les maxima, les zéros et la période de 20 ms.",
      observation: "La tension retrouve la valeur +5 V toutes les 20 ms ; le courant est nul à ces maxima.",
      formula: "uC(t)=5 cos(100πt), avec t en seconde",
      formulaTex: "u_C(t)=5\\cos(100\\pi t)",
      rule: {
        kind: "samples",
        points: [
          [0, 5], [2.5, 3.54], [5, 0], [7.5, -3.54], [10, -5], [12.5, -3.54], [15, 0], [17.5, 3.54], [20, 5],
          [22.5, 3.54], [25, 0], [27.5, -3.54], [30, -5], [32.5, -3.54], [35, 0], [37.5, 3.54], [40, 5],
        ],
      },
      window: { xMin: 0, xMax: 40, yMin: -6, yMax: 6 },
      guides: [
        { kind: "horizontal", value: 5, label: "Um=5 V" },
        { kind: "horizontal", value: -5, label: "−Um" },
        { kind: "vertical", value: 20, label: "T0=20 ms" },
      ],
      marker: { min: 0, max: 40, step: 2.5, initial: 0 },
    },
    questions: [
      choice("Si q=Qm cos(ω0t+φ), alors uC vaut…", ["(Qm/C) cos(ω0t+φ)", "CQm cos(ω0t)", "LQm", "Qm/ω0"], 0, "uC=q/C.", "3.3 Expression", 1),
      choice("Avec i=dq/dt, l’intensité vaut…", ["−ω0Qm sin(ω0t+φ)", "+Qm sin(ω0t)", "Qm/ω0", "C cos(φ)"], 0, "La dérivée du cosinus est l’opposé du sinus.", "3.3 Expression", 1),
      choice("L’amplitude du courant vérifie…", ["Im=ω0Qm=ω0CUm", "Im=Um/ω0C", "Im=LCUm", "Im=Qm/C"], 0, "La dérivation multiplie l’amplitude par ω0.", "3.3 Intensité", 1),
      choice("Quand uC est maximale, i est…", ["nulle", "maximale positive", "maximale négative", "égale à uC"], 0, "La charge cesse momentanément de varier à son extremum.", "3.3 Graphes", 1),
      choice("Quand uC=0, la valeur absolue de i est…", ["maximale", "nulle", "toujours 1 A", "indéterminée"], 0, "Toute l’énergie est alors magnétique dans le modèle idéal.", "3.3 Graphes", 1),
      choice("Le décalage temporel entre uC et i vaut…", ["T0/4", "T0", "2T0", "0"], 0, "Une quadrature correspond à π/2, donc à un quart de période.", "3.3 Quadrature", 1),
      short("Dans uAB=5 cos(100πt), donne Um en volt.", ["5", "5 V"], "Le coefficient devant le cosinus est l’amplitude.", "Quiz 1, question 1", 1),
      short("Donne ω0 pour ce même signal.", ["100π", "100 pi", "100π rad/s", "314,16", "314.16", "314,16 rad/s", "314.16 rad/s"], "L’argument est ω0t=100πt.", "Quiz 1, question 1", 1),
      short("Donne T0 en millisecondes.", ["20", "20 ms", "0,02 s", "0.02 s"], "T0=2π/(100π)=0,02 s.", "Quiz 1, question 1", 2),
      short("Donne la fréquence f0.", ["50", "50 Hz"], "f0=1/0,02=50 Hz.", "Quiz 1, question 1", 1),
      choice("Orientée de F vers E, la tension de la bobine vaut…", ["uFE=−uAB", "uFE=uAB", "uFE=0", "uFE=2uAB"], 0, "F est relié à B et E à A : V_F−V_E=−(V_A−V_B).", "Quiz 1, question 2", 2),
      short("Calcule C en millifarad, à 0,01 mF près.", ["1,01", "1.01", "1,01 mF", "1.01 mF"], "C=1/(Lω0²)≈1,013 mF.", "Quiz 1, question 4", 2),
      short("Donne l’amplitude Im du courant, à 0,01 A près.", ["1,59", "1.59", "1,59 A", "1.59 A"], "Im=ω0CUm≈1,59 A.", "Quiz 1, question 3", 2),
      short("Donne Qm en mC, à 0,01 mC près.", ["5,07", "5.07", "5,07 mC", "5.07 mC"], "Qm=CUm≈1,013 mF×5 V=5,07 mC.", "Quiz 1, synthèse", 2),
    ],
    corrections: [
      "Pages 7 à 9 : la convention i=dq/dt est conservée dans les formules, le graphe et le Quiz 1 ; le signe opposé de la page 7 n’est pas repris.",
      "Page 9 : l’orientation F vers E est traduite explicitement par uFE=−uAB, car E est relié à A et F à B.",
    ],
  },
  {
    id: "lc-energy-conservation-quiz-two",
    title: "Suivre les échanges d’énergie dans le circuit LC",
    summary: "Démontrer la conservation de l’énergie totale et résoudre le second quiz sur charge, courant et énergies instantanées.",
    pages: "9 à 11",
    section: "3.4. Énergie emmagasinée ; Quiz 2",
    durationMinutes: 28,
    xp: 85,
    body: String.raw`## Deux réservoirs d’énergie

Le condensateur stocke une énergie électrostatique :

$$\boxed{E_C=\frac{q^2}{2C}=\frac12Cu_C^2}$$

La bobine stocke une énergie magnétique :

$$\boxed{E_L=\frac12Li^2}$$

Dans le circuit LC idéal :

$$E=E_C+E_L$$

## Démontrer la conservation

Avec $q=Q_m\cos\theta$, $i=-\omega_0Q_m\sin\theta$ et $\theta=\omega_0t+\varphi$ :

$$E_C=\frac{Q_m^2}{2C}\cos^2\theta$$

$$E_L=\frac12L\omega_0^2Q_m^2\sin^2\theta$$

Comme $LC\omega_0^2=1$ :

$$E_L=\frac{Q_m^2}{2C}\sin^2\theta$$

Ainsi :

$$E=\frac{Q_m^2}{2C}\left(\cos^2\theta+\sin^2\theta\right)$$

$$\boxed{E=\frac{Q_m^2}{2C}=\frac12CU_m^2=\frac12LI_m^2=\text{constante}}$$

L’énergie ne reste pas dans un seul dipôle : elle passe continuellement du condensateur à la bobine, puis revient.

## Quiz 2 intégralement résolu

Données :

$$C=2,5\times10^{-6}\ \mathrm F,\qquad U=20\ \mathrm V,\qquad L=25\ \mathrm{mH}$$

Avant la connexion à la bobine :

$$Q_0=CU=5,0\times10^{-5}\ \mathrm C=50\ \mu\mathrm C$$

$$E_0=\frac12CU^2=5,0\times10^{-4}\ \mathrm J=0,50\ \mathrm{mJ}$$

Après fermeture de $K$ :

$$\omega_0=\frac1{\sqrt{LC}}=4000\ \mathrm{rad\,s^{-1}}$$

Avec $q(0)=Q_0$ et $i(0)=0$ :

$$\boxed{q(t)=5,0\times10^{-5}\cos(4000t)\ \mathrm C}$$

$$\boxed{i(t)=-0,20\sin(4000t)\ \mathrm A}$$

Les énergies deviennent :

$$\boxed{E_C(t)=5,0\times10^{-4}\cos^2(4000t)\ \mathrm J}$$

$$\boxed{E_L(t)=5,0\times10^{-4}\sin^2(4000t)\ \mathrm J}$$

et :

$$\boxed{E_C(t)+E_L(t)=E_0=5,0\times10^{-4}\ \mathrm J}$$

La période propre est $T_0\approx1,57$ ms et la fréquence $f_0\approx637$ Hz.

> **Astuce mémoire.** $u_C$ et $i$ sont en quadrature ; leurs **énergies**, qui contiennent des carrés, se relayent deux fois par période.` ,
    keyPoint: "Dans le LC idéal, E=EC+EL=Qm²/(2C)=½CUm²=½LIm² est constante.",
    example: "Pour C=2,5 µF et U=20 V, E0=0,50 mJ. Elle devient tour à tour électrique puis magnétique sans changer de valeur totale.",
    methodSteps: [
      "Calcule d’abord Q0=CU et E0=½CU².",
      "Détermine ω0 à partir de L et C.",
      "Utilise les conditions initiales pour écrire q(t).",
      "Dérive q(t) afin d’obtenir i(t).",
      "Substitue q et i dans EC=q²/(2C) et EL=½Li².",
      "Utilise LCω0²=1 puis cos²+sin²=1 pour vérifier EC+EL=E0.",
    ],
    interaction: timeline([
      { label: "Condensateur chargé", shortLabel: "t=0", detail: "q=Qm, i=0 : EC=E et EL=0." },
      { label: "Courant maximal", shortLabel: "t=T0/4", detail: "q=0, |i|=Im : EC=0 et EL=E." },
      { label: "Polarité inversée", shortLabel: "t=T0/2", detail: "q=−Qm, i=0 : EC=E et EL=0." },
      { label: "Courant opposé", shortLabel: "t=3T0/4", detail: "q=0, |i|=Im dans l’autre sens : EC=0 et EL=E." },
      { label: "Retour initial", shortLabel: "t=T0", detail: "q=Qm et i=0 : le cycle énergétique recommence." },
    ], "Le relais énergétique pendant une période", "Sélectionne les instants remarquables et observe quel dipôle porte l’énergie.", "Les deux énergies sont toujours positives et leur somme reste constante."),
    questions: [
      choice("L’énergie du condensateur vaut…", ["q²/(2C)", "Lq²/2", "Ci²", "q/C²"], 0, "On peut aussi écrire EC=½CuC².", "3.4 Énergie", 1),
      choice("L’énergie magnétique de la bobine vaut…", ["½Li²", "½Ci²", "q²/L", "Li"], 0, "Elle dépend de l’inductance et du carré du courant.", "3.4 Énergie", 1),
      choice("Dans un LC idéal, l’énergie totale est…", ["constante", "toujours nulle", "croissante", "entièrement dissipée à chaque période"], 0, "Il n’y a pas de résistance dans le modèle idéal.", "3.4 Conservation", 1),
      choice("Quand q=±Qm, l’énergie de la bobine est…", ["nulle", "maximale", "négative", "égale à 2E"], 0, "À cet instant i=0.", "3.4 Échanges", 1),
      choice("Quand q=0, l’énergie du condensateur est…", ["nulle", "maximale", "infinie", "égale à L"], 0, "EC=q²/(2C).", "3.4 Échanges", 1),
      short("Quiz 2 : donne Q0 en µC.", ["50", "50 µC", "50uC", "5×10^-5 C"], "Q0=2,5 µF×20 V=50 µC.", "Quiz 2, question 1.1", 2),
      short("Quiz 2 : donne E0 en mJ.", ["0,5", "0.5", "0,50", "0.50", "0,5 mJ", "0.5 mJ", "5×10^-4 J"], "E0=½×2,5×10⁻⁶×20²=5×10⁻⁴ J.", "Quiz 2, question 1.2", 2),
      choice("L’équation différentielle du Quiz 2 est…", ["q''+q/(LC)=0", "q'+q/LC=U", "q''−LCq=0", "q=0"], 0, "La résistance de la bobine est négligée.", "Quiz 2, question 2.1", 1),
      short("Quiz 2 : donne ω0 en rad/s.", ["4000", "4000 rad/s", "4×10^3"], "ω0=1/√(25×10⁻³×2,5×10⁻⁶)=4000 rad/s.", "Quiz 2, question 2.2", 2),
      short("Donne l’amplitude Im du courant dans le Quiz 2.", ["0,2", "0.2", "0,20", "0.20", "0,2 A", "0.2 A"], "Im=ω0Q0=4000×5×10⁻⁵=0,20 A.", "Quiz 2, question 2.3", 2),
      choice("L’expression correcte de q(t) est…", ["5×10⁻⁵ cos(4000t)", "20 cos(25t)", "5×10⁻⁵ sin(4000t)", "0,2 cos(t)"], 0, "q est maximale et le courant nul à t=0.", "Quiz 2, question 2.3", 2),
      choice("L’expression correcte de i(t) est…", ["−0,20 sin(4000t)", "+0,20 cos(4000t)", "−20 sin(25t)", "5×10⁻⁵ cos(4000t)"], 0, "i=dq/dt.", "Quiz 2, question 2.3", 2),
      choice("EC(t) vaut…", ["5×10⁻⁴ cos²(4000t) J", "0,20 cos(4000t) J", "5×10⁻⁴ sin(4000t) J", "25×10⁻³ J"], 0, "À t=0, toute l’énergie est dans le condensateur.", "Quiz 2, question 2.4", 2),
      choice("EL(t) vaut…", ["5×10⁻⁴ sin²(4000t) J", "5×10⁻⁴ cos²(4000t) J", "−0,20 sin(4000t) J", "2,5×10⁻⁶ J"], 0, "L’énergie magnétique est nulle à t=0 puis augmente.", "Quiz 2, question 2.4", 2),
      choice("La relation finale du Quiz 2 est…", ["EC(t)+EL(t)=E0", "EC(t)−EL(t)=E0 toujours", "EC(t)=EL(t)=E0 toujours", "EC(t)+EL(t)=0"], 0, "La somme reste égale à l’énergie initiale.", "Quiz 2, question 2.5", 2),
      short("Donne la fréquence propre du Quiz 2, à 1 Hz près.", ["637", "637 Hz", "636,6", "636.6", "636,6 Hz"], "f0=4000/(2π)≈636,6 Hz.", "Quiz 2, synthèse", 2),
    ],
  },
  {
    id: "mechanical-electrical-analogy",
    title: "Construire l’analogie mécanique-électrique",
    summary: "Faire correspondre position, vitesse, masse, raideur et énergies avec charge, courant, inductance et capacité.",
    pages: "11 et 12",
    section: "3.5. Analogie entre oscillateur mécanique et oscillateur électrique",
    durationMinutes: 18,
    xp: 90,
    body: String.raw`## Deux oscillateurs, une même structure mathématique

L’oscillateur mécanique masse-ressort idéal vérifie :

$$\frac{\mathrm d^2x}{\mathrm dt^2}+\frac kmx=0$$

Le circuit LC idéal vérifie :

$$\frac{\mathrm d^2q}{\mathrm dt^2}+\frac1{LC}q=0$$

Les deux équations ont la même forme. On peut donc établir une analogie terme à terme.

| Oscillateur mécanique | Oscillateur électrique | Rôle commun |
|---|---|---|
| Élongation $x$ | Charge $q$ | Grandeur qui oscille |
| Vitesse $v=\dot x$ | Intensité $i=\dot q$ | Dérivée de la grandeur |
| Masse $m$ | Inductance $L$ | Inertie du système |
| Raideur $k$ | Inverse $1/C$ | Rappel vers l’équilibre |
| $E_p=\frac12kx^2$ | $E_C=\frac{q^2}{2C}$ | Énergie de position ou électrique |
| $E_k=\frac12mv^2$ | $E_L=\frac12Li^2$ | Énergie de mouvement ou magnétique |

Les pulsations propres se répondent :

$$\omega_0=\sqrt{\frac km}\qquad\longleftrightarrow\qquad\omega_0=\sqrt{\frac1{LC}}$$

Les solutions aussi :

$$x=X_m\cos(\omega_0t+\varphi)$$

$$q=Q_m\cos(\omega_0t+\varphi)$$

## Comment interpréter les paramètres ?

- Une masse $m$ plus grande ralentit l’oscillateur ; une inductance $L$ plus grande ralentit le LC.
- Un ressort plus raide augmente la fréquence ; une capacité $C$ plus petite augmente $1/C$ et donc la fréquence.
- Le ressort et le condensateur stockent une énergie liée à la grandeur $x$ ou $q$.
- La masse en mouvement et la bobine parcourue par un courant stockent l’autre forme d’énergie.

> **Astuce mémoire.** $m$ et $L$ s’opposent aux variations rapides ; $k$ et $1/C$ ramènent vers l’équilibre.

> **Précision de notation.** Pour ne pas confondre l’énergie cinétique avec celle du condensateur, ce parcours note $E_k$ l’énergie cinétique, $E_C$ l’énergie électrique et $E_L$ l’énergie magnétique.` ,
    keyPoint: "L’analogie fondamentale est x↔q, v↔i, m↔L et k↔1/C ; les bilans d’énergie ont exactement la même structure.",
    example: "Augmenter L joue le même rôle qu’augmenter la masse m : la pulsation propre diminue et la période augmente.",
    methodSteps: [
      "Place côte à côte les deux équations différentielles.",
      "Associe les grandeurs dérivées x' et q'.",
      "Associe les coefficients d’inertie m et L.",
      "Associe les coefficients de rappel k et 1/C.",
      "Vérifie l’analogie sur les deux termes d’énergie.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte d’analogie",
      title: "Du ressort au circuit LC",
      instruction: "Sélectionne chaque paire pour comprendre le rôle commun des grandeurs.",
      observation: "L’analogie porte sur les équations et les rôles énergétiques, pas sur la nature physique des objets.",
      rootLabel: "Oscillateur harmonique",
      rootDetail: "Une grandeur oscille parce que deux formes d’énergie s’échangent sans dissipation dans le modèle idéal.",
      nodes: [
        { id: "state", group: "Grandeur", label: "x ↔ q", role: "Position ↔ charge", detail: "x repère l’écart mécanique ; q repère l’état de charge du condensateur." },
        { id: "rate", group: "Grandeur", label: "v ↔ i", role: "x' ↔ q'", detail: "La vitesse est la dérivée de x et l’intensité est la dérivée de q dans la convention retenue." },
        { id: "inertia", group: "Paramètre", label: "m ↔ L", role: "Inertie", detail: "Une masse ou une inductance plus grande s’oppose davantage aux variations rapides." },
        { id: "restoring", group: "Paramètre", label: "k ↔ 1/C", role: "Rappel", detail: "La raideur et l’inverse de la capacité multiplient la grandeur dans l’équation." },
        { id: "stored", group: "Énergie", label: "Ep ↔ EC", role: "½kx² ↔ q²/(2C)", detail: "Ces énergies sont maximales lorsque la grandeur x ou q est extrémale." },
        { id: "kinetic", group: "Énergie", label: "Ek ↔ EL", role: "½mv² ↔ ½Li²", detail: "Ces énergies sont maximales lorsque la grandeur dérivée v ou i est extrémale." },
      ],
    },
    questions: [
      choice("Dans l’analogie, l’élongation x correspond à…", ["la charge q", "l’inductance L", "la capacité C", "la résistance R"], 0, "Ce sont les grandeurs qui satisfont l’équation harmonique.", "3.5 Tableau", 1),
      choice("La vitesse v correspond à…", ["l’intensité i", "la charge q", "l’énergie EC", "la tension constante E"], 0, "v=x' et i=q'.", "3.5 Tableau", 1),
      choice("La masse m correspond à…", ["l’inductance L", "la capacité C", "la charge q", "la fréquence f"], 0, "m et L portent l’inertie du système.", "3.5 Tableau", 1),
      choice("La raideur k correspond à…", ["1/C", "C", "1/L", "R"], 0, "Les équations contiennent k/m et 1/(LC).", "3.5 Tableau", 1),
      choice("L’énergie potentielle élastique correspond à…", ["l’énergie du condensateur", "l’énergie Joule", "l’énergie nucléaire", "la puissance du GBF"], 0, "Les deux dépendent du carré de la grandeur x ou q.", "3.5 Énergies", 1),
      choice("L’énergie cinétique correspond à…", ["l’énergie magnétique de la bobine", "l’énergie du condensateur", "la charge", "la résistance"], 0, "Les deux dépendent du carré de v ou i.", "3.5 Énergies", 1),
      choice("Si L augmente avec C fixe, la période propre…", ["augmente", "diminue", "reste toujours nulle", "devient indépendante de L"], 0, "T0=2π√(LC).", "3.5 Analogie", 1),
      choice("Si C diminue avec L fixe, la pulsation propre…", ["augmente", "diminue", "reste inchangée", "devient négative"], 0, "ω0=1/√(LC).", "3.5 Analogie", 1),
      choice("Le couple m–k correspond au couple…", ["L–1/C", "C–L", "R–q", "u–i"], 0, "On compare l’inertie puis le rappel.", "3.5 Équations", 2),
      choice("L’analogie signifie que les deux systèmes…", ["ont la même structure mathématique", "sont fabriqués avec les mêmes matériaux", "ont toujours la même période numérique", "ne stockent aucune énergie"], 0, "Les natures physiques diffèrent mais les équations se correspondent.", "3.5 Bilan", 2),
    ],
    corrections: [
      "Page 11 : l’énergie cinétique, notée Ec dans la fiche comme l’énergie du condensateur, est renommée Ek afin d’éviter une collision de notation.",
    ],
  },
  {
    id: "capacitor-discharge-damping-regimes",
    title: "Observer la décharge et distinguer les régimes",
    summary: "Expliquer la décharge du condensateur dans une bobine et relier la résistance totale aux régimes périodique, pseudopériodique et apériodique.",
    pages: "5 à 7",
    section: "2.2. Décharge d’un condensateur dans une bobine",
    durationMinutes: 22,
    xp: 55,
    body: String.raw`## Décharger le condensateur dans la bobine

Lorsque l’interrupteur passe en position 2, le générateur de charge est retiré et le condensateur alimente la bobine. La charge de l’armature positive diminue, le courant change de sens par rapport au courant de charge et la tension $u_C$ se met à évoluer.

Pour éviter toute ambiguïté, on adopte dans tout le parcours une convention unique :

$$\boxed{q=C\,u_C\qquad\text{et}\qquad i=\frac{\mathrm dq}{\mathrm dt}}$$

Le courant de référence entre dans l’armature dont la charge est $q$. Pendant la décharge initiale, $q$ diminue ; l’intensité algébrique $i$ est donc négative. Une autre orientation du courant donnerait $i=-\mathrm dq/\mathrm dt$, mais il faudrait alors conserver ce choix partout.

## Pourquoi la tension peut-elle osciller ?

Le condensateur crée un champ électrique et la bobine crée un champ magnétique. Lors de la décharge :

1. l’énergie électrique du condensateur met le courant en mouvement ;
2. le courant charge magnétiquement la bobine ;
3. la bobine maintient ensuite le courant et recharge le condensateur avec la polarité opposée ;
4. le phénomène recommence.

## Les trois régimes observés

Dans un circuit série réel de résistance totale $R_{\mathrm{tot}}=R+r$, l’équation complète est :

$$L\frac{\mathrm d^2q}{\mathrm dt^2}+R_{\mathrm{tot}}\frac{\mathrm dq}{\mathrm dt}+\frac qC=0$$

- Si $R_{\mathrm{tot}}=0$, aucune énergie n’est dissipée : le régime idéal est **périodique non amorti**.
- Si $R_{\mathrm{tot}}>0$ mais reste assez faible, l’amplitude diminue : le régime est **pseudopériodique amorti**.
- Si $R_{\mathrm{tot}}$ est suffisamment grande, le retour vers zéro se fait sans oscillation : le régime est **apériodique**.

Dans le modèle série, la frontière mathématique est :

$$R_{\mathrm{crit}}=2\sqrt{\frac LC}$$

Le cas $R_{\mathrm{tot}}=R_{\mathrm{crit}}$ est le régime critique. La fiche emploie les mots « faible » et « grande » ; la formule explique précisément ce qu’ils signifient.

## Libre ne signifie pas forcément non amorti

Une oscillation est dite **libre** lorsque le circuit évolue après l’excitation initiale, sans signal périodique extérieur imposant sa fréquence. Elle peut néanmoins être amortie si une résistance dissipe de l’énergie.

> **Astuce mémoire.** Plus la résistance totale augmente, moins le circuit a le temps d’échanger son énergie avant de la perdre par effet Joule.` ,
    keyPoint: "Le circuit réel vérifie Lq''+Rtot q'+q/C=0 : sans résistance il oscille indéfiniment, avec résistance il s’amortit ou devient apériodique.",
    example: "Pour L=0,10 H et C=100 µF, Rcrit=2√(L/C)≈63,2 Ω : en dessous le régime peut rester pseudopériodique, au-dessus il devient apériodique.",
    methodSteps: [
      "Fixe d’abord les orientations de uC, q et i.",
      "Additionne les résistances du circuit série pour obtenir Rtot.",
      "Repère si la courbe traverse plusieurs fois zéro.",
      "Observe si l’amplitude reste constante, décroît ou ne présente aucune oscillation.",
      "Si L et C sont connus, compare Rtot à 2√(L/C).",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte des régimes",
      title: "Ce que change la résistance totale",
      instruction: "Sélectionne un régime pour reconnaître sa courbe et son bilan énergétique.",
      observation: "La résistance ne fixe pas la fréquence propre idéale ; elle dissipe surtout l’énergie et modifie l’allure du retour à l’équilibre.",
      rootLabel: "Décharge dans un circuit RLC",
      rootDetail: "Le condensateur initialement chargé échange de l’énergie avec la bobine tandis que la résistance en dissipe.",
      nodes: [
        { id: "periodic", group: "Régime", label: "Périodique", role: "Rtot=0", detail: "Amplitude constante, passages réguliers par zéro et énergie totale conservée dans le modèle idéal." },
        { id: "pseudo", group: "Régime", label: "Pseudopériodique", role: "0<Rtot<Rcrit", detail: "Oscillations encore visibles, mais amplitude décroissante à cause de l’effet Joule." },
        { id: "critical", group: "Frontière", label: "Critique", role: "Rtot=Rcrit", detail: "Retour le plus rapide vers l’équilibre sans dépassement oscillatoire." },
        { id: "aperiodic", group: "Régime", label: "Apériodique", role: "Rtot>Rcrit", detail: "Retour monotone vers zéro, sans changement répété de signe." },
      ],
    },
    questions: [
      choice("Pendant la décharge initiale et avec i=dq/dt, si q diminue alors i est…", ["négative", "positive", "toujours nulle", "infinie"], 0, "La dérivée d’une charge décroissante est négative.", "2.2.2 Interprétation", 1),
      choice("Le rôle de la bobine pendant la décharge est notamment de…", ["stocker de l’énergie magnétique et maintenir le courant", "supprimer toute tension", "créer une capacité", "bloquer chaque électron définitivement"], 0, "La bobine reçoit l’énergie du condensateur puis la restitue.", "2.2 Décharge", 1),
      choice("Si Rtot=0, les oscillations idéales sont…", ["non amorties et périodiques", "apériodiques", "immédiatement nulles", "forcées par un GBF"], 0, "Sans résistance, aucune perte Joule n’atténue l’amplitude.", "2.2.4 Oscilloscope", 1),
      choice("Une amplitude qui décroît tout en traversant plusieurs fois zéro indique un régime…", ["pseudopériodique", "statique", "critique parfait", "continu permanent"], 0, "Les oscillations subsistent mais sont amorties.", "2.2.4 Oscilloscope", 1),
      choice("Un retour vers zéro sans oscillation correspond au régime…", ["apériodique", "périodique", "sinusoïdal forcé", "résonant"], 0, "Une forte dissipation empêche les inversions successives.", "2.2.4 Oscilloscope", 1),
      choice("La résistance totale série vaut…", ["R+r", "R−r toujours", "L/C", "RC"], 0, "La résistance extérieure et la résistance interne de la bobine s’additionnent.", "2.2.4 Montage", 1),
      choice("L’effet Joule transforme progressivement l’énergie électrique en…", ["énergie thermique", "charge supplémentaire", "inductance", "fréquence infinie"], 0, "La résistance dissipe l’énergie sous forme de chaleur.", "2.2.4 Régimes", 1),
      short("Calcule Rcrit pour L=0,10 H et C=100 µF, à 0,1 Ω près.", ["63,2", "63.2", "63,2 Ω", "63.2 Ω"], "Rcrit=2√(0,10/100×10⁻⁶)=63,2 Ω.", "Précision sur les régimes", 2),
      choice("Une oscillation libre…", ["peut être amortie", "est toujours entretenue par un GBF", "a toujours une amplitude croissante", "n’existe qu’en mécanique"], 0, "Libre décrit l’absence d’excitation périodique imposée, pas l’absence de pertes.", "2.2 Conclusion", 2),
      choice("La légende des courbes de la fiche devrait lire…", ["uC=f(t)", "q=f(R)", "L=f(t)", "R=f(q)"], 0, "Les axes représentent explicitement la tension uC en fonction du temps.", "Page 6, courbes", 1),
      choice("Si l’on choisit l’orientation opposée du courant, la relation avec q devient…", ["i=−dq/dt", "i=q/C", "i=LC", "i=Rtot q"], 0, "Changer le sens de référence change le signe de l’intensité algébrique.", "Convention de signe", 2),
    ],
    corrections: [
      "Pages 5, 7, 8 et 11 : la fiche alterne entre i=dq/dt et i=−dq/dt sans conserver la même orientation. Le parcours fixe i=dq/dt pour la charge de l’armature de référence et adapte tous les signes à cette convention.",
      "Page 6 : la légende « Courbes q=f(t) » est corrigée en « Courbes uC=f(t) », conformément à l’axe vertical des trois oscillogrammes.",
      "Pages 6 et 7 : les qualificatifs « résistance faible » et « résistance grande » sont précisés par le seuil série Rcrit=2√(L/C).",
    ],
  },
  {
    id: "ideal-lc-differential-equation",
    title: "Établir l’équation différentielle du circuit LC",
    summary: "Passer de la loi des mailles à l’oscillateur harmonique et relier L, C, pulsation, période et fréquence propres.",
    pages: "7 et 8",
    section: "3.1. Équation différentielle ; 3.2. Solution",
    durationMinutes: 24,
    xp: 65,
    body: String.raw`## Le circuit LC idéal

On considère une bobine d’inductance $L$ dont la résistance est négligeable et un condensateur de capacité $C$. Après la charge initiale, aucun générateur périodique n’impose le mouvement : les oscillations sont libres.

On choisit :

$$q=C\,u_C\qquad\text{et}\qquad i=\frac{\mathrm dq}{\mathrm dt}$$

Pour la bobine idéale :

$$u_L=L\frac{\mathrm di}{\mathrm dt}=L\frac{\mathrm d^2q}{\mathrm dt^2}$$

La loi des mailles donne $u_L+u_C=0$. Ainsi :

$$L\frac{\mathrm d^2q}{\mathrm dt^2}+\frac qC=0$$

En divisant par $L$ :

$$\boxed{\frac{\mathrm d^2q}{\mathrm dt^2}+\frac1{LC}q=0}$$

Cette équation est celle d’un oscillateur harmonique.

## Solution sinusoïdale

La charge s’écrit :

$$\boxed{q(t)=Q_m\cos(\omega_0t+\varphi)}$$

- $Q_m$ est la charge maximale, en coulombs ;
- $\omega_0$ est la pulsation propre, en radians par seconde ;
- $\varphi$ est la phase à l’origine, en radians.

En substituant la solution dans l’équation, on obtient :

$$\boxed{\omega_0=\frac1{\sqrt{LC}}}$$

Puis :

$$\boxed{T_0=\frac{2\pi}{\omega_0}=2\pi\sqrt{LC}}$$

$$\boxed{f_0=N_0=\frac1{T_0}=\frac1{2\pi\sqrt{LC}}}$$

## Déterminer la phase initiale

Les conditions initiales sélectionnent $Q_m$ et $\varphi$.

Si le condensateur est chargé à $U_0>0$ et si $i(0)=0$, alors :

$$q(0)=CU_0=Q_m,\qquad \varphi=0$$

Donc :

$$q(t)=CU_0\cos(\omega_0t)$$

> **Astuce mémoire.** La bobine apporte l’« inertie » $L$ ; le condensateur apporte le rappel électrique $1/C$. Leur produit fixe l’échelle de temps $\sqrt{LC}$.` ,
    keyPoint: "Pour un LC idéal : q''+q/(LC)=0, ω0=1/√(LC), T0=2π√(LC) et f0=1/(2π√(LC)).",
    example: "Avec L=25 mH et C=2,5 µF, √(LC)=2,5×10⁻⁴ s ; donc ω0=4000 rad/s et T0≈1,57 ms.",
    methodSteps: [
      "Écris q=C·uC et i=dq/dt avec une convention claire.",
      "Écris uL=L·di/dt pour la bobine idéale.",
      "Applique la loi des mailles uL+uC=0.",
      "Remplace i par q' puis divise par L.",
      "Identifie ω0²=1/(LC), puis calcule T0 et f0.",
      "Utilise q(0) et i(0) pour déterminer Qm et φ.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma interactif",
      title: "La maille LC idéale",
      instruction: "Sélectionne chaque repère pour reconstruire l’équation différentielle.",
      observation: "La somme des tensions est nulle : la dérivée seconde de q est opposée à q.",
      caption: "Circuit LC idéal redessiné ; les références sont cohérentes avec i=dq/dt.",
      viewBox: "0 0 500 280",
      shapes: [
        { shape: "line", x1: 95, y1: 55, x2: 210, y2: 55, tone: "outline" },
        { shape: "path", d: "M210 55 C225 25 240 85 255 55 C270 25 285 85 300 55 C315 25 330 85 345 55", tone: "accent" },
        { shape: "line", x1: 345, y1: 55, x2: 405, y2: 55, tone: "outline" },
        { shape: "line", x1: 405, y1: 55, x2: 405, y2: 225, tone: "outline" },
        { shape: "line", x1: 405, y1: 225, x2: 280, y2: 225, tone: "outline" },
        { shape: "line", x1: 245, y1: 185, x2: 245, y2: 260, tone: "accent" },
        { shape: "line", x1: 280, y1: 185, x2: 280, y2: 260, tone: "accent" },
        { shape: "line", x1: 245, y1: 225, x2: 95, y2: 225, tone: "outline" },
        { shape: "line", x1: 95, y1: 225, x2: 95, y2: 55, tone: "outline" },
        { shape: "line", x1: 120, y1: 42, x2: 180, y2: 42, tone: "accent" },
        { shape: "text", x: 150, y: 32, content: "i", anchor: "middle" },
        { shape: "text", x: 277, y: 105, content: "L", anchor: "middle" },
        { shape: "text", x: 262, y: 278, content: "C", anchor: "middle" },
        { shape: "text", x: 375, y: 150, content: "uL", anchor: "middle" },
        { shape: "text", x: 205, y: 222, content: "uC", anchor: "middle" },
      ],
      hotspots: [
        { id: "current", number: 1, label: "Courant i", detail: "La référence est choisie de sorte que i=dq/dt pour la charge q de l’armature considérée.", x: 150, y: 55 },
        { id: "inductor", number: 2, label: "Bobine L", detail: "Elle vérifie uL=L·di/dt=L·q'' lorsque sa résistance est négligée.", x: 278, y: 55 },
        { id: "capacitor", number: 3, label: "Condensateur C", detail: "Sa tension est uC=q/C.", x: 262, y: 225 },
        { id: "loop", number: 4, label: "Loi des mailles", detail: "uL+uC=0 conduit à Lq''+q/C=0.", x: 405, y: 145 },
      ],
    },
    questions: [
      choice("Pour une bobine idéale, la tension vaut…", ["uL=L·di/dt", "uL=C·i", "uL=q/L", "uL=Ri avec R infini"], 0, "La tension inductive est proportionnelle à la dérivée du courant.", "3.1 Équation", 1),
      choice("Avec i=dq/dt, di/dt vaut…", ["d²q/dt²", "q/C", "Lq", "dq²/dt"], 0, "Dériver i revient à dériver deux fois q.", "3.1 Équation", 1),
      choice("L’équation du LC idéal est…", ["q''+q/(LC)=0", "q'+LCq=0", "q''−LCq=0", "q=LC"], 0, "La loi des mailles conduit à l’équation harmonique.", "3.1 Équation", 1),
      choice("La solution générale est de la forme…", ["Qm cos(ω0t+φ)", "Qm e^(ω0t) uniquement", "Qm t²", "LC/t"], 0, "Une équation harmonique possède une solution sinusoïdale.", "3.2 Solution", 1),
      choice("La pulsation propre vaut…", ["1/√(LC)", "√(LC)", "L/C", "2πLC"], 0, "ω0²=1/(LC).", "3.2 Pulsation", 1),
      choice("La période propre vaut…", ["2π√(LC)", "1/(LC)", "√(L/C)", "2π/(LC)"], 0, "T0=2π/ω0.", "3.2 Période", 1),
      choice("La fréquence propre vaut…", ["1/(2π√(LC))", "2π√(LC)", "LC", "1/LC²"], 0, "f0=1/T0.", "3.2 Fréquence", 1),
      short("Calcule ω0 pour L=25 mH et C=2,5 µF.", ["4000", "4000 rad/s", "4000 rad.s-1", "4×10^3"], "LC=6,25×10⁻⁸ s², donc ω0=4000 rad/s.", "Application", 2),
      short("Calcule T0 correspondant à ω0=4000 rad/s, en ms à 0,01 ms près.", ["1,57", "1.57", "1,57 ms", "1.57 ms"], "T0=2π/4000≈1,57 ms.", "Application", 2),
      short("Calcule f0 pour T0=1,57 ms, à 1 Hz près.", ["637", "637 Hz", "636,6", "636.6", "636,6 Hz", "636.6 Hz"], "f0≈636,6 Hz, soit 637 Hz à l’unité.", "Application", 2),
      choice("Si q(0)=Qm>0 et i(0)=0, on peut prendre…", ["φ=0", "φ=π/2 obligatoirement", "Qm=0", "ω0=0"], 0, "cos 0=1 et la dérivée du cosinus est nulle à l’origine.", "Conditions initiales", 1),
      choice("Le produit LC a la dimension…", ["d’un temps au carré", "d’une énergie", "d’une résistance", "d’une charge"], 0, "Puisque ω0=1/√(LC), √(LC) est un temps.", "Analyse dimensionnelle", 2),
    ],
    corrections: [
      "Page 7 : la démonstration est réécrite avec la convention i=dq/dt et la loi des mailles uL+uC=0, afin d’éviter le changement de signe non signalé entre les pages 7 et 8.",
    ],
  },
  {
    id: "negative-resistance-oscillation-maintenance",
    title: "Entretenir les oscillations par résistance négative",
    summary: "Compenser les pertes de la bobine, établir l’équation avec r−R0 et distinguer amortissement, entretien exact et croissance.",
    pages: "12 à 14",
    section: "4. Entretien des oscillations",
    durationMinutes: 24,
    xp: 100,
    body: String.raw`## Pourquoi faut-il entretenir les oscillations ?

Une bobine réelle possède une résistance interne $r$. La puissance dissipée par effet Joule est :

$$P_J=r i^2$$

L’énergie totale du circuit diminue donc et l’amplitude des oscillations décroît. Pour maintenir une amplitude constante, il faut restituer exactement l’énergie perdue.

## Le générateur auxiliaire à amplificateur opérationnel

La fiche utilise un amplificateur opérationnel, deux résistances égales $R_1$ et une résistance réglable $R_0$. Dans le régime linéaire idéal, le montage impose :

$$i'=-i$$

et :

$$u_{NM}=R_0i'=-R_0i$$

Le générateur auxiliaire se comporte donc, du point de vue de la maille LC, comme une **résistance négative** $-R_0$.

## Équation de la maille entretenue

La bobine réelle fournit $u_B=ri+L\,\mathrm di/\mathrm dt$ et le condensateur $u_C=q/C$. La loi des mailles donne :

$$-R_0i+ri+L\frac{\mathrm di}{\mathrm dt}+\frac qC=0$$

Avec $i=\dot q$ :

$$\boxed{L\ddot q+(r-R_0)\dot q+\frac qC=0}$$

La résistance effective est donc :

$$\boxed{R_{\mathrm{eff}}=r-R_0}$$

## Les trois réglages possibles

### 1. $R_0<r$ : pertes encore présentes

$R_{\mathrm{eff}}>0$. L’amplitude diminue : les oscillations sont amorties, ou le retour devient apériodique si la résistance effective est assez grande.

### 2. $R_0=r$ : entretien exact

$R_{\mathrm{eff}}=0$. L’équation redevient :

$$\ddot q+\frac1{LC}q=0$$

L’amplitude reste constante dans le modèle idéal. Le générateur restitue exactement l’énergie dissipée par $r$.

### 3. $R_0>r$ : surcompensation

$R_{\mathrm{eff}}<0$. L’amplitude doit **croître**, car le montage fournit plus d’énergie qu’il n’en perd. Dans un circuit réel, cette croissance s’arrête lorsque l’amplificateur sature ou que les non-linéarités limitent le signal.

Cette dernière conséquence corrige les courbes de la page 13, qui associent par erreur $R_0>r$ à un amortissement.

## Une résistance active

La résistance négative n’est pas un composant passif ordinaire. Elle utilise l’énergie des alimentations de l’amplificateur opérationnel pour la réinjecter dans le circuit oscillant.

> **Astuce mémoire.** Compare toujours $R_0$ à $r$ : plus petit, ça décroît ; égal, ça se maintient ; plus grand, ça croît jusqu’à limitation réelle.` ,
    keyPoint: "Le montage impose Reff=r−R0 : R0<r amortit, R0=r entretient exactement et R0>r provoque une croissance limitée ensuite par le circuit réel.",
    example: "Pour r=12 Ω et R0=12 Ω, Reff=0 : l’équation idéale LC est restaurée. Pour R0=15 Ω, Reff=−3 Ω et l’amplitude croît jusqu’à saturation.",
    methodSteps: [
      "Écris la tension de la bobine réelle ri+L·di/dt.",
      "Établis i'=−i dans le montage à AOP.",
      "Remplace uNM par −R0i dans la loi des mailles.",
      "Regroupe les termes résistifs sous la forme (r−R0)i.",
      "Compare R0 à r pour prévoir l’évolution de l’amplitude.",
      "Vérifie que l’AOP reste linéaire ; sinon la croissance est limitée par saturation.",
    ],
    interaction: {
      kind: "numeric",
      eyebrow: "Réglage interactif",
      title: "Ajuster la résistance négative",
      instruction: "Fais varier R0 pour une bobine de résistance r=10 Ω et observe la résistance effective.",
      observation: "La valeur zéro correspond à l’entretien idéal. Une valeur négative signifie une surcompensation active.",
      formula: "Reff = r − R0, avec r = 10 Ω",
      formulaTex: "R_{\\mathrm{eff}}=r-R_0",
      inputSymbol: "R0",
      outputSuffix: " Ω",
      rule: { kind: "linear", coefficient: -1, constant: 10 },
      input: { min: 0, max: 20, step: 1, initial: 10 },
    },
    questions: [
      choice("La bobine réelle dissipe de l’énergie par…", ["effet Joule", "effet photoélectrique uniquement", "fusion", "gravitation"], 0, "Sa résistance interne transforme de l’énergie en chaleur.", "4. Introduction", 1),
      choice("Le rôle du générateur auxiliaire est de…", ["compenser les pertes énergétiques", "augmenter C sans limite", "supprimer la bobine", "mesurer une masse"], 0, "Il réinjecte l’énergie dissipée par r.", "4. Entretien", 1),
      choice("Le montage à AOP établit la relation…", ["i'=−i", "i'=i²", "i'=0 toujours", "i'=q/C"], 0, "La maille avec les deux résistances R1 égales conduit à i'=−i.", "4.2.1", 1),
      choice("La tension du générateur auxiliaire vaut…", ["uNM=−R0i", "uNM=+R0i", "uNM=Lq", "uNM=0 toujours"], 0, "uNM=R0i' et i'=−i.", "4.2.1", 1),
      choice("La résistance effective du circuit entretenu est…", ["r−R0", "r+R0", "R0/r", "LC"], 0, "La résistance négative se soustrait à r.", "4.2.2", 1),
      choice("Pour obtenir des oscillations d’amplitude constante, il faut…", ["R0=r", "R0=0 toujours", "R0>r sans limite", "C=0"], 0, "Les pertes et l’apport énergétique se compensent exactement.", "4.2.2", 1),
      choice("Si R0<r, l’amplitude…", ["décroît", "croît sans limite", "reste exactement constante", "change instantanément de signe"], 0, "La résistance effective reste positive.", "Condition d’entretien", 1),
      choice("Si R0>r, le modèle linéaire prévoit une amplitude qui…", ["croît", "décroît", "reste nulle", "devient apériodique par excès de pertes"], 0, "La résistance effective est négative : le circuit reçoit un excès d’énergie.", "Condition d’entretien", 2),
      choice("Dans la pratique, cette croissance est limitée par…", ["la saturation et les non-linéarités", "une énergie infinie", "la disparition de L", "la valeur de g"], 0, "L’AOP ne peut pas fournir une tension de sortie infinie.", "Précision physique", 2),
      short("Calcule Reff pour r=10 Ω et R0=7 Ω.", ["3", "3 Ω"], "Reff=10−7=3 Ω : les oscillations restent amorties.", "4.2.3 Résistance négative", 1),
      short("Calcule Reff pour r=10 Ω et R0=10 Ω.", ["0", "0 Ω"], "Les pertes sont exactement compensées.", "4.2.3 Résistance négative", 1),
      short("Calcule Reff pour r=10 Ω et R0=14 Ω.", ["-4", "−4", "-4 Ω", "−4 Ω"], "Reff=−4 Ω : le circuit est surcompensé.", "4.2.3 Résistance négative", 2),
    ],
    corrections: [
      "Page 13 : les courbes associées à R0>r sont physiquement inversées. Puisque Reff=r−R0<0, l’amplitude croît jusqu’à la saturation réelle ; l’amortissement correspond à R0<r.",
      "Pages 12 à 14 : la résistance négative est explicitement présentée comme un montage actif alimenté, et non comme une résistance passive ordinaire.",
    ],
  },
  {
    id: "lc-official-evaluation-mission",
    title: "Mission : valider un oscillogramme LC",
    summary: "Résoudre la situation d’évaluation officielle, calculer le régime propre puis comparer amplitude et fréquence à l’écran.",
    pages: "15",
    section: "Situation d’évaluation",
    durationMinutes: 30,
    xp: 115,
    kind: "challenge",
    body: String.raw`## Données de la mission

Le condensateur de capacité $C=10\ \mu$F est d’abord chargé par un générateur continu $E=10$ V lorsque $K_1$ est fermé et $K_2$ ouvert. Il est ensuite isolé du générateur et relié à une bobine idéale d’inductance $L=0,16$ H.

L’oscilloscope est réglé sur :

- balayage horizontal : $2\ \mathrm{ms\,div^{-1}}$ ;
- sensibilité verticale : $5\ \mathrm{V\,div^{-1}}$.

## Partie A — Charge initiale

La borne positive du générateur est reliée à l’armature $A$. En fin de charge :

$$u_{AB}=E=10\ \mathrm V$$

L’armature $A$ est positive et :

$$Q_A=CE=10\times10^{-6}\times10=1,0\times10^{-4}\ \mathrm C=100\ \mu\mathrm C$$

L’énergie initiale est :

$$E_0=\frac12CE^2=\frac12\times10^{-5}\times10^2=5,0\times10^{-4}\ \mathrm J$$

## Partie B — Oscillations libres

À $t=0$, $K_1$ est ouvert et $K_2$ fermé. Les conditions initiales sont :

$$U_0=u_{AB}(0)=10\ \mathrm V,\qquad I_0=i(0)=0$$

L’équation de la charge est :

$$\ddot q+\frac1{LC}q=0$$

Comme $q=Cu_C$, la tension vérifie aussi :

$$\boxed{\ddot u_C+\frac1{LC}u_C=0}$$

La solution compatible avec les conditions initiales est :

$$\boxed{u_C(t)=10\cos(\omega_0t)\ \mathrm V}$$

avec :

$$\omega_0=\frac1{\sqrt{0,16\times10^{-5}}}\approx790,57\ \mathrm{rad\,s^{-1}}$$

$$T_0=\frac{2\pi}{\omega_0}\approx7,95\ \mathrm{ms}$$

$$f_0=\frac1{T_0}\approx125,82\ \mathrm{Hz}$$

## Partie C — Vérifier l’écran

Sur le graphe, l’amplitude occupe $2$ divisions verticales :

$$U_{m,\mathrm{mes}}=2\times5=10\ \mathrm V$$

Une période occupe environ $4$ divisions horizontales :

$$T_{\mathrm{mes}}=4\times2=8\ \mathrm{ms}$$

$$f_{\mathrm{mes}}=\frac1{8\times10^{-3}}=125\ \mathrm{Hz}$$

Les comparaisons donnent :

$$U_{m,\mathrm{mes}}=U_{m,\mathrm{calc}}=10\ \mathrm V$$

$$f_{\mathrm{mes}}\approx125\ \mathrm{Hz}\approx125,82\ \mathrm{Hz}=f_{\mathrm{calc}}$$

L’écart vient de la lecture graphique et des arrondis. L’oscillogramme est cohérent avec le circuit LC calculé.

> **Astuce mémoire.** Une mesure d’oscilloscope se lit en deux temps : nombre de divisions, puis multiplication par la sensibilité.` ,
    keyPoint: "Mission : Um=10 V, ω0≈790,57 rad/s, T0≈7,95 ms et f0≈125,82 Hz ; l’écran donne 10 V et environ 125 Hz.",
    example: "Quatre divisions à 2 ms/div donnent T=8 ms ; la fréquence mesurée est 1/0,008=125 Hz, très proche des 125,82 Hz calculés.",
    methodSteps: [
      "Résous la charge initiale avec q=CE et E0=½CE².",
      "Écris les conditions uC(0)=E et i(0)=0.",
      "Établis l’équation de uC puis choisis la solution cosinus.",
      "Calcule ω0, T0 et f0 avec L et C en unités SI.",
      "Compte les divisions verticales et horizontales de l’oscillogramme.",
      "Multiplie par les sensibilités puis compare les valeurs mesurées aux valeurs calculées.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Oscillogramme redessiné",
      title: "La tension théorique de la mission",
      instruction: "Déplace le point sur un peu plus de deux périodes et retrouve l’amplitude et la période.",
      observation: "La période voisine de 8 ms explique les quatre divisions horizontales du document.",
      formula: "uC(t)=10 cos(790,57 t), t en seconde",
      formulaTex: "u_C(t)=10\\cos(790{,}57t)",
      rule: {
        kind: "samples",
        points: [
          [0, 10], [1, 7.04], [2, -0.1], [3, -7.18], [3.97, -10], [4.97, -7.04], [5.96, 0], [6.96, 7.08], [7.95, 10],
          [8.95, 7.04], [9.94, 0], [10.94, -7.08], [11.92, -10], [12.92, -7.04], [13.91, 0], [14.91, 7.08], [15.9, 10],
        ],
      },
      window: { xMin: 0, xMax: 16, yMin: -12, yMax: 12 },
      guides: [
        { kind: "horizontal", value: 10, label: "Um=10 V" },
        { kind: "horizontal", value: -10, label: "−Um" },
        { kind: "vertical", value: 7.95, label: "T0≈7,95 ms" },
      ],
      marker: { min: 0, max: 15.9, step: 0.5, initial: 0 },
    },
    questions: [
      short("Partie A : donne uAB en fin de charge.", ["10", "10 V"], "Le condensateur prend la tension E du générateur.", "Situation, question 1.1", 1),
      choice("L’armature chargée positivement est…", ["A", "B", "les deux", "aucune"], 0, "A est reliée à la borne positive du générateur.", "Situation, question 1.2", 1),
      short("Calcule QA en µC.", ["100", "100 µC", "100uC", "1×10^-4 C"], "QA=10 µF×10 V=100 µC.", "Situation, question 1.3", 2),
      short("Calcule l’énergie initiale en mJ.", ["0,5", "0.5", "0,50", "0.50", "0,5 mJ", "5×10^-4 J"], "E0=½CE²=0,50 mJ.", "Situation, question 1.4", 2),
      short("Partie B : donne U0=uAB(0).", ["10", "10 V"], "La tension ne peut pas changer instantanément à la commutation.", "Situation, question 2.1", 1),
      short("Donne I0=i(0).", ["0", "0 A"], "Le courant dans la bobine part de zéro.", "Situation, question 2.1", 1),
      choice("L’équation de q est…", ["q''+q/(LC)=0", "q'+RCq=0", "q''−q/(LC)=0", "q=CE toujours"], 0, "Le circuit devient un LC idéal.", "Situation, question 2.2", 1),
      choice("L’équation de uC est…", ["uC''+uC/(LC)=0", "uC'+LCuC=E", "uC''=0", "uC=Ri"], 0, "q=CuC avec C constant.", "Situation, question 2.3", 1),
      choice("La solution compatible avec U0=10 V et I0=0 est…", ["uC=10 cos(ω0t)", "uC=10 sin(ω0t)", "uC=−10t", "uC=0"], 0, "La tension est maximale à l’origine.", "Situation, question 2.4", 2),
      short("Calcule ω0 à 0,01 rad/s près.", ["790,57", "790.57", "790,57 rad/s", "790.57 rad/s"], "ω0=1/√(0,16×10⁻⁵)≈790,57 rad/s.", "Situation, question 2.5", 2),
      short("Calcule T0 en ms à 0,01 ms près.", ["7,95", "7.95", "7,95 ms", "7.95 ms"], "T0=2π/ω0≈7,95 ms.", "Situation, question 2.5", 2),
      short("Calcule f0 à 0,01 Hz près.", ["125,82", "125.82", "125,82 Hz", "125.82 Hz"], "f0=1/T0≈125,82 Hz.", "Situation, question 2.5", 2),
      short("L’amplitude occupe 2 divisions à 5 V/div. Donne Um mesurée.", ["10", "10 V"], "2×5=10 V.", "Situation, partie C", 1),
      short("La période occupe 4 divisions à 2 ms/div. Donne T mesurée.", ["8", "8 ms", "0,008 s", "0.008 s"], "4×2=8 ms.", "Situation, partie C", 1),
      choice("La conclusion correcte est…", ["l’oscillogramme est cohérent avec les calculs", "la fréquence mesurée est nulle", "l’amplitude calculée vaut 20 V", "la période mesurée vaut 2 ms"], 0, "10 V coïncide exactement et 125 Hz est très proche de 125,82 Hz.", "Situation, conclusion", 2),
    ],
  },
  {
    id: "lc-consolidation-data-audit",
    title: "Consolidation : exploiter une courbe sans inventer de données",
    summary: "Traiter la partie calculable de l’exercice final, repérer ses graduations manquantes et formuler la résolution symbolique correcte.",
    pages: "16",
    section: "Exercice de consolidation",
    durationMinutes: 22,
    xp: 125,
    kind: "challenge",
    body: String.raw`## Partie calculable de l’exercice

Le condensateur possède :

$$C=10^{-6}\ \mathrm F=1\ \mu\mathrm F,\qquad U=40\ \mathrm V$$

Sa charge initiale vaut :

$$\boxed{Q=CU=4,0\times10^{-5}\ \mathrm C=40\ \mu\mathrm C}$$

Son énergie initiale vaut :

$$\boxed{E_0=\frac12CU^2=8,0\times10^{-4}\ \mathrm J=0,80\ \mathrm{mJ}}$$

## Ce que demande ensuite la fiche

Après connexion à une bobine idéale, l’exercice demande de :

1. déterminer l’expression de la tension $u(t)$ aux bornes de la bobine ;
2. lire la tension maximale et la pulsation ;
3. calculer $L$ ;
4. tracer $i(t)$ pour $0\leq t\leq3,5$ ms ;
5. calculer les énergies à $t=0,75$ ms.

## Le problème du graphique source

La figure $c$ montre bien une sinusoïde et indique $t$ en millisecondes, mais elle ne fournit :

- aucune valeur par division sur l’axe horizontal ;
- aucune valeur par division sur l’axe vertical ;
- aucun nombre permettant d’identifier sans ambiguïté l’origine de phase.

Il est donc impossible de déterminer **numériquement et de façon unique** $U_m$, $T_0$, $\omega_0$, $L$, $i(t)$ et les énergies à $0,75$ ms. Inventer une échelle produirait une correction arbitraire.

## Résolution dès que les graduations sont fournies

Si l’on peut lire une amplitude $U_m$, une période $T_0$ et une phase $\varphi$, alors :

$$u_L(t)=U_m\cos\left(\frac{2\pi}{T_0}t+\varphi\right)$$

$$\omega_0=\frac{2\pi}{T_0}$$

$$\boxed{L=\frac1{C\omega_0^2}=\frac{T_0^2}{4\pi^2C}}$$

Dans la maille idéale, les tensions référencées dans le même sens de parcours vérifient $u_L+u_C=0$. Après avoir fixé les flèches du schéma :

$$u_C(t)=-u_L(t),\qquad q(t)=Cu_C(t),\qquad i(t)=\frac{\mathrm dq}{\mathrm dt}$$

Les énergies s’obtiennent ensuite par :

$$E_C(t)=\frac12C\,u_C(t)^2$$

$$E_L(t)=\frac12L\,i(t)^2$$

et doivent vérifier :

$$E_C(t)+E_L(t)=E_0=8,0\times10^{-4}\ \mathrm J$$

## Le bon réflexe scientifique

Une donnée manquante n’autorise pas à choisir une valeur au hasard. La réponse correcte consiste à :

1. calculer ce qui est déterminé par les données ;
2. nommer précisément les informations absentes ;
3. donner la méthode ou la formule symbolique ;
4. demander la version graduée du graphique.

> **Astuce mémoire.** Un joli tracé sans échelle donne une **forme**, pas une valeur numérique.` ,
    keyPoint: "L’exercice donne Q=40 µC et E0=0,80 mJ, mais son graphique non gradué ne permet pas de calculer numériquement Um, T0, ω0, L, i(t) ni les énergies demandées.",
    example: "Dès que T0 est connu, L=T0²/(4π²C). Sans T0 ou l’échelle horizontale, aucune valeur numérique de L n’est justifiable.",
    methodSteps: [
      "Liste les données numériques effectivement présentes.",
      "Calcule Q=CU et E0=½CU².",
      "Vérifie les unités et les graduations de chaque axe.",
      "Si une échelle manque, arrête le calcul numérique et explique pourquoi.",
      "Écris la résolution symbolique avec Um, T0 et φ.",
      "Contrôle le futur résultat grâce à EC+EL=E0.",
    ],
    interaction: timeline([
      { label: "Calculer le certain", shortLabel: "Q et E0", detail: "C et U suffisent pour obtenir Q=40 µC et E0=0,80 mJ." },
      { label: "Auditer les axes", shortLabel: "Échelles absentes", detail: "La figure ne donne ni volts par division ni millisecondes par division." },
      { label: "Refuser l’invention", shortLabel: "Pas de nombre arbitraire", detail: "La forme sinusoïdale seule ne fixe ni l’amplitude ni la période." },
      { label: "Donner les formules", shortLabel: "Um, T0, φ", detail: "Écrire uL, ω0, L, i et les énergies sous forme symbolique." },
      { label: "Demander la source complète", shortLabel: "Graphique gradué", detail: "Une version avec échelles rendra toutes les questions numériques solvables." },
    ], "Résoudre honnêtement un exercice incomplet", "Sélectionne les étapes avant de répondre aux dernières questions.", "La rigueur consiste à distinguer une donnée lisible d’une valeur supposée."),
    questions: [
      short("Calcule la charge initiale Q en µC.", ["40", "40 µC", "40uC", "4×10^-5 C"], "Q=1 µF×40 V=40 µC.", "Consolidation, question 1.1", 2),
      short("Calcule E0 en mJ.", ["0,8", "0.8", "0,80", "0.80", "0,8 mJ", "8×10^-4 J"], "E0=½×10⁻⁶×40²=8×10⁻⁴ J.", "Consolidation, question 1.2", 2),
      choice("Le graphique permet-il de lire numériquement Um ?", ["Non, l’échelle verticale manque", "Oui, Um vaut forcément 40 V", "Oui, Um vaut 1 V", "Non, car la courbe n’est pas sinusoïdale"], 0, "Aucune sensibilité verticale n’est fournie.", "Consolidation, figure c", 2),
      choice("Permet-il de lire numériquement T0 ?", ["Non, l’échelle horizontale manque", "Oui, T0 vaut forcément 3,5 ms", "Oui, T0 vaut 0,75 ms", "Non, car t n’est pas en millisecondes"], 0, "L’unité est indiquée, mais pas la valeur d’une division.", "Consolidation, figure c", 2),
      choice("Sans T0, peut-on calculer numériquement L ?", ["Non", "Oui, L=C", "Oui, L=U/C", "Oui, L=40 H"], 0, "Il faut ω0 ou T0 pour appliquer L=1/(Cω0²).", "Consolidation, question 2.2", 1),
      choice("La formule correcte de L en fonction de T0 est…", ["T0²/(4π²C)", "4π²C/T0²", "T0/C", "CT0²"], 0, "On isole L dans T0=2π√(LC).", "Consolidation, méthode", 2),
      choice("Après orientation cohérente de la maille idéale, on utilise…", ["uL+uC=0", "uL=uC=0 toujours", "uL=Ri", "uL+uC=E pendant les oscillations libres"], 0, "Le générateur est déconnecté pendant l’oscillation libre.", "Consolidation, question 2.1", 1),
      choice("L’énergie du condensateur s’écrit…", ["½C uC²", "½L uC²", "C/uC", "uC²/L"], 0, "EC=q²/(2C)=½CuC².", "Consolidation, question 2.4", 1),
      choice("Le contrôle énergétique attendu est…", ["EC+EL=0,80 mJ", "EC−EL=0", "EC=EL à tout instant", "EL=40 J"], 0, "Le circuit idéal conserve l’énergie initiale.", "Consolidation, question 2.4", 2),
      choice("Face à un graphique non gradué, la bonne démarche est de…", ["signaler les données manquantes et donner la méthode symbolique", "inventer une échelle pratique", "abandonner aussi les calculs Q et E0", "choisir la réponse la plus grande"], 0, "La rigueur distingue les résultats déterminés des résultats impossibles à chiffrer.", "Consolidation, bilan", 2),
    ],
    corrections: [
      "Page 16 : la figure c ne comporte ni échelle horizontale ni échelle verticale exploitable. Les questions numériques 2.1.1 à 2.4 sont donc indéterminées ; le parcours conserve l’énoncé, calcule Q et E0, puis fournit la résolution symbolique sans inventer de graduations.",
    ],
  },
];

const levelOrder = [
  "electrical-oscillator-capacitor-charge",
  "capacitor-discharge-damping-regimes",
  "ideal-lc-differential-equation",
  "natural-frequency-phase-quiz-one",
  "lc-energy-conservation-quiz-two",
  "mechanical-electrical-analogy",
  "negative-resistance-oscillation-maintenance",
  "lc-official-evaluation-mission",
  "lc-consolidation-data-audit",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau d’oscillations électriques LC introuvable : " + id);
  return officialLevel(index, level);
});

export const freeElectricalOscillationsPath: LearningPath = {
  id: "terminale-cd-free-electrical-oscillations",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminales C et D • Cours de Physique-Chimie en ligne",
  curriculumSourceUrl: "https://courspcenligne-ci-21.webself.net/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 12,
  title: "Oscillations électriques libres dans un circuit LC",
  description: "Décrire la charge et la décharge d’un condensateur, établir le modèle LC, analyser la phase et l’énergie, puis entretenir les oscillations avec une résistance négative.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Définir un oscillateur électrique et interpréter la charge puis la décharge d’un condensateur.",
    "Distinguer les régimes périodique, pseudopériodique, critique et apériodique.",
    "Établir et résoudre l’équation différentielle du circuit LC idéal.",
    "Calculer pulsation, période, fréquence, charge, tension et courant.",
    "Démontrer la conservation de l’énergie et suivre ses échanges entre C et L.",
    "Construire l’analogie avec l’oscillateur mécanique masse-ressort.",
    "Expliquer l’entretien par résistance négative et exploiter rigoureusement un oscillogramme.",
  ],
  modules: [{
    id: "free-electrical-oscillations-mastery",
    title: "Maîtriser les oscillations électriques libres",
    description: "De la charge initiale à l’entretien actif, une progression complète fondée sur les 16 pages de la fiche ivoirienne.",
    lessons: builtLevels,
  }],
};

export const freeElectricalOscillationsPaths: LearningPath[] = [freeElectricalOscillationsPath];
