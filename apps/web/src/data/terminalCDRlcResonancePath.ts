import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 14 de Physique en Terminale C et leçon 12 en Terminale D.
const sourceDocument = "Tle D PHY L14 Résonance d’intensité by Tehua.pdf";

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
      introduction: "Raisonne avec la courbe, les unités et le modèle du circuit avant de remplacer les valeurs numériques.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : à la résonance, pense au trio « réactances opposées, impédance minimale, courant maximal ».",
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

const resonance36Points: Array<[number, number]> = [
  [60, 4.5], [80, 6.5], [100, 9.5], [120, 12.9], [130, 15.2], [140, 18],
  [150, 20.8], [160, 25.4], [170, 32], [180, 38.5], [190, 45.4], [200, 51.6],
  [210, 54.4], [220, 52], [230, 45.2], [240, 39.6], [250, 33.6], [260, 30],
  [270, 26], [280, 23.6], [290, 21], [300, 19.2],
];

const exercise4Points: Array<[number, number]> = [
  [50, 8], [100, 18], [150, 35], [200, 76], [220, 118], [240, 228], [250, 362],
  [260, 500], [270, 364], [280, 240], [300, 136], [350, 67], [500, 29],
];

const levels: LevelSeed[] = [
  {
    id: "resonance-experimental-curve",
    title: "Tracer la courbe de résonance",
    summary: "Réaliser le montage RLC série, faire varier la fréquence à tension fixée et exploiter les deux séries de mesures officielles.",
    pages: "1 à 2",
    section: "1. Tracé de la courbe I=f(N) de résonance d’intensité",
    durationMinutes: 24,
    xp: 45,
    kind: "graph",
    body: String.raw`## La question expérimentale

Un circuit série contient un conducteur ohmique, une bobine d’inductance $L$, un condensateur de capacité $C$, un ampèremètre et un GBF. Le support fixe :

$$L=0{,}10\ \text{H},\qquad C=5700\ \text{nF}=5{,}7\times10^{-6}\ \text{F}$$

La valeur efficace $U$ délivrée par le GBF reste constante. On fait varier uniquement la fréquence $N$ et on relève l’intensité efficace $I$. Cette précaution est essentielle : sinon une variation de $I$ pourrait venir de $U$ au lieu du circuit.

## Mesures pour la première résistance

| $N$ (Hz) | 60 | 80 | 100 | 120 | 130 | 140 | 150 | 160 | 170 | 180 | 190 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| $I$ (mA) | 4,5 | 6,5 | 9,5 | 12,9 | 15,2 | 18,0 | 20,8 | 25,4 | 32,0 | 38,5 | 45,4 |

| $N$ (Hz) | 200 | 210 | 220 | 230 | 240 | 250 | 260 | 270 | 280 | 290 | 300 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| $I$ (mA) | 51,6 | 54,4 | 52,0 | 45,2 | 39,6 | 33,6 | 30,0 | 26,0 | 23,6 | 21,0 | 19,2 |

Le maximum mesuré est donc :

$$\boxed{I_0=54{,}4\ \text{mA}\quad\text{pour}\quad N\approx210\ \text{Hz}}$$

## Mesures pour la seconde résistance

| $N$ (Hz) | 60 | 80 | 100 | 120 | 130 | 140 | 150 | 160 | 170 | 180 | 190 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| $I$ (mA) | 2,5 | 3,5 | 5,0 | 7,0 | 8,5 | 10,0 | 11,5 | 13,5 | 15,5 | 17,2 | 18,6 |

| $N$ (Hz) | 200 | 210 | 220 | 230 | 240 | 250 | 260 | 270 | 280 | 290 | 300 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| $I$ (mA) | 19,7 | 20,0 | 19,0 | 17,5 | 16,0 | 14,0 | 12,5 | 11,0 | 9,5 | 8,5 | 7,0 |

Ici, $I'_0=20{,}0$ mA vers $210$ Hz. Les deux courbes ont leur sommet pratiquement à la même fréquence, mais la courbe associée à la plus grande résistance est plus basse et plus étalée.

> **Lecture physique.** Quand la résistance série augmente, le courant maximal diminue et la résonance devient moins aiguë.

## La situation de la RTI

Le document annonce Radio Fréquence 2 à « $92{,}0$ kHz sur la bande FM ». La bande FM usuelle est comprise entre $87{,}5$ et $108$ **MHz** : l’unité correcte est donc $92{,}0$ MHz. La mission radio du dernier niveau réutilisera cette fréquence corrigée.` ,
    keyPoint: "À tension efficace constante, la résonance se repère au maximum de I sur la courbe I=f(N).",
    example: "Dans la première série, le point le plus haut est (210 Hz ; 54,4 mA) : la fréquence de résonance mesurée est proche de 210 Hz.",
    methodSteps: [
      "Monte R, L et C en série avec l’ampèremètre et le GBF.",
      "Fixe la valeur efficace U du GBF.",
      "Fais varier N sans changer U et relève I.",
      "Place les points (N ; I), puis relie-les sans inventer de mesures.",
      "Lis le maximum et compare hauteur et largeur des courbes.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Laboratoire",
      title: "Courbe mesurée pour la première résistance",
      instruction: "Déplace le point le long des 22 mesures et repère le maximum.",
      observation: "L’intensité atteint 54,4 mA à 210 Hz, puis diminue de part et d’autre.",
      formula: "I = f(N), première série de mesures",
      formulaTex: "I=f(N)",
      rule: { kind: "samples", points: resonance36Points },
      window: { xMin: 50, xMax: 310, yMin: 0, yMax: 60 },
      guides: [{ kind: "vertical", value: 210, label: "maximum mesuré" }],
      marker: { min: 60, max: 300, step: 10, initial: 210 },
    },
    questions: [
      choice("Pendant le relevé de I=f(N), quelle grandeur doit rester constante ?", ["La tension efficace U", "La fréquence N", "L’intensité I", "La capacité C doit varier"], 0, "Le protocole fait varier N à tension efficace U fixée.", "1.2 Expériences", 1),
      choice("L’ampèremètre est branché…", ["en série", "en dérivation sur C", "en dérivation sur le GBF", "hors du circuit"], 0, "Il mesure le courant commun aux dipôles du circuit série.", "1.1 Montage", 1),
      short("Convertis 5700 nF en µF.", ["5.7", "5,7", "5.7 µF", "5,7 µF"], "1000 nF=1 µF, donc 5700 nF=5,7 µF.", "Données", 1),
      short("Lis I pour N=170 Hz dans la première série.", ["32", "32 mA", "32,0", "32,0 mA"], "Le tableau donne 32,0 mA.", "Tableau R=36 Ω", 1),
      short("Lis I pour N=250 Hz dans la première série.", ["33.6", "33,6", "33.6 mA", "33,6 mA"], "Le tableau donne 33,6 mA.", "Tableau R=36 Ω", 1),
      short("Donne l’intensité maximale de la première série.", ["54.4", "54,4", "54.4 mA", "54,4 mA"], "Le maximum tabulé vaut 54,4 mA.", "2.1.1 Intensité", 1),
      short("À quelle fréquence ce maximum est-il mesuré ?", ["210", "210 Hz"], "Le point maximal du tableau est à 210 Hz.", "2.1.1 Intensité", 1),
      short("Donne l’intensité maximale de la seconde série.", ["20", "20 mA", "20,0", "20,0 mA"], "Le maximum tabulé vaut 20,0 mA.", "Tableau R=200 Ω", 1),
      choice("Quand la résistance série augmente, le maximum d’intensité…", ["diminue", "augmente", "reste toujours identique", "devient négatif"], 0, "La seconde courbe culmine à 20 mA au lieu de 54,4 mA.", "2.1.1 Conclusion", 1),
      choice("Les deux maxima sont observés…", ["vers la même fréquence", "à 60 Hz et 300 Hz", "à des fréquences opposées", "uniquement en continu"], 0, "Ils apparaissent tous deux autour de 210 Hz.", "Courbes I=f(N)", 1),
      choice("Une courbe de résonance plus étalée est dite…", ["moins aiguë", "plus sélective", "verticale", "apériodique"], 0, "Une grande largeur traduit une résonance floue.", "Exploitation", 1),
      choice("92,0 kHz appartient à la bande FM 87,5–108 MHz.", ["Faux", "Vrai"], 0, "92 kHz est mille fois trop faible ; l’unité correcte est MHz.", "Situation d’apprentissage corrigée", 1),
      short("Écris la fréquence correcte de Radio Fréquence 2 donnée par la situation.", ["92 MHz", "92.0 MHz", "92,0 MHz", "92000000 Hz"], "La fréquence annoncée doit être 92,0 MHz.", "Situation d’apprentissage corrigée", 2),
    ],
    corrections: [
      "Page 1 : la situation écrit 92,0 kHz pour une station de la bande FM ; l’unité cohérente avec la bande 87,5–108 MHz est 92,0 MHz.",
      "Pages 1-2 : les tableaux culminent à 210 Hz, tandis que le calcul théorique arrondi de la page 3 donne 211 Hz ; ce ne sont pas deux résonances différentes mais la résolution limitée des mesures.",
    ],
  },
  {
    id: "resonance-official-exercises-one-three",
    title: "Corriger les exercices 1 à 3",
    summary: "Calculer la capacité d’accord, l’impédance, le facteur de qualité et les surtensions en corrigeant les coquilles algébriques du support.",
    pages: "7 à 8",
    section: "IV. Exercices 1, 2 et 3",
    durationMinutes: 28,
    xp: 105,
    kind: "practice",
    body: String.raw`## Exercice 1 — choisir le condensateur d’accord

Une bobine d’inductance $L=50$ mH est alimentée à la pulsation :

$$\omega=100\pi\ \text{rad}\cdot\text{s}^{-1}$$

À la résonance, $LC\omega^2=1$, donc :

$$C=\frac1{L\omega^2}=\frac1{50\times10^{-3}(100\pi)^2}$$

$$\boxed{C\approx2{,}026\times10^{-4}\ \text{F}=202{,}6\ \mu\text{F}}$$

Le support remplace par erreur $(100\pi)^2$ par $100^2$ et annonce $0{,}002$ F. Cette valeur serait dix fois trop grande et ne résonnerait pas à la pulsation demandée.

## Exercice 2 — impédance et qualité

Une bobine possède $r=10\ \Omega$, $L=0{,}25$ H et est associée à $C=1{,}5\ \mu$F. À la résonance :

$$\boxed{Z_0=r=10\ \Omega}$$

$$N_0=\frac1{2\pi\sqrt{0{,}25\times1{,}5\times10^{-6}}}\approx\boxed{259{,}9\ \text{Hz}}$$

$$Q=\frac{2\pi N_0L}{r}\approx\boxed{40{,}8}$$

La valeur $40{,}9$ du support est compatible avec ses arrondis. En revanche, la substitution imprimée montre $1{,}5\times10^{-6}$ au numérateur à la place de $L=0{,}25$ H : la formule écrite est fausse, même si le résultat final correspond à la bonne formule.

On peut en déduire :

$$\Delta N=\frac{N_0}{Q}=\frac r{2\pi L}\approx\boxed{6{,}37\ \text{Hz}}$$

Ce circuit est très sélectif.

## Exercice 3 — capacité et tensions réactives

Avec $R_t=10\ \Omega$, $L=0{,}10$ H, $U=12$ V et $N_0=50$ Hz :

$$C=\frac1{L(2\pi N_0)^2}\approx\boxed{101{,}3\ \mu\text{F}}$$

$$Q=\frac{2\pi N_0L}{R_t}=\pi$$

$$\boxed{U_L=U_C=QU=12\pi\approx37{,}7\ \text{V}}$$

## Contrôles rapides

Une réponse de capacité doit être contrôlée avec $LC\omega^2$. Une réponse de qualité doit être sans unité. Enfin, à la résonance, $Z_0$ ne contient plus les réactances : il reste la résistance **totale** du circuit, y compris la résistance interne de la bobine lorsqu’elle n’est pas négligeable.` ,
    keyPoint: "Toujours conserver ω en entier dans C=1/(Lω²) et utiliser Q=ω₀L/Rt, sans remplacer L par C.",
    example: "Avec L=50 mH et ω=100π rad·s⁻¹, C≈202,6 µF ; la valeur 2000 µF du support échoue au contrôle LCω²=1.",
    methodSteps: [
      "Convertis mH et µF dans les unités SI.",
      "Choisis C=1/(Lω²) ou N₀=1/(2π√LC).",
      "À la résonance, remplace Z par la résistance totale.",
      "Calcule Q=ω₀L/Rt puis, si besoin, UL=UC=QU.",
      "Réinjecte les résultats dans LCω²=1 et vérifie les unités.",
    ],
    interaction: timeline([
      { label: "Exercice 1", shortLabel: "C", detail: "Conserver π : C=1/[0,050(100π)²]≈202,6 µF." },
      { label: "Exercice 2", shortLabel: "Z et Q", detail: "À la résonance Z=r=10 Ω, N₀≈259,9 Hz et Q≈40,8." },
      { label: "Exercice 3", shortLabel: "Surtension", detail: "C≈101,3 µF, Q=π et UL=UC≈37,7 V." },
      { label: "Contrôle", shortLabel: "Audit", detail: "Tester LCω²=1 et vérifier que Q est sans unité." },
    ], "Trois exercices, une même condition d’accord", "Sélectionne chaque exercice avant de répondre.", "Les trois problèmes se ramènent à LCω₀²=1, mais n’interrogent pas la même grandeur."),
    questions: [
      short("Exercice 1 : convertis 50 mH en H.", ["0.05", "0,05", "0.05 H", "0,05 H"], "50 mH=50×10⁻³ H=0,050 H.", "Exercice 1", 1),
      short("Exercice 1 : donne ω² sous forme exacte.", ["10000π²", "10000 pi²", "10000*pi^2", "(100π)²"], "(100π)²=10 000π².", "Exercice 1", 1),
      short("Exercice 1 : calcule C en µF, au dixième près.", ["202.6", "202,6", "202.6 µF", "202,6 µF", "203"], "C≈202,6 µF.", "Exercice 1 corrigé", 2),
      choice("La valeur 0,002 F imprimée à l’exercice 1 est…", ["fausse", "exacte", "une fréquence", "une résistance"], 0, "Elle provient de l’oubli du facteur π².", "Exercice 1 corrigé", 1),
      choice("Exercice 2 : à la résonance, Z vaut…", ["10 Ω", "0 Ω", "0,25 Ω", "1,5 µF"], 0, "Il reste la résistance r=10 Ω.", "Exercice 2, question 1.1", 1),
      short("Exercice 2 : calcule N₀ au dixième de hertz près.", ["259.9", "259,9", "259.9 Hz", "259,9 Hz", "260", "260 Hz"], "N₀≈259,9 Hz.", "Exercice 2, question 1.2", 2),
      short("Exercice 2 : calcule ω₀ au rad/s près.", ["1633", "1633 rad/s", "1633 rad.s-1", "1633 rad·s⁻¹"], "ω₀=2πN₀≈1633 rad·s⁻¹.", "Exercice 2", 2),
      short("Exercice 2 : calcule Q au dixième près.", ["40.8", "40,8", "40.9", "40,9"], "Q=ω₀L/r≈40,8.", "Exercice 2, question 2", 2),
      short("Exercice 2 : déduis ΔN au centième près.", ["6.37", "6,37", "6.37 Hz", "6,37 Hz"], "ΔN=r/(2πL)=10/(2π×0,25)≈6,37 Hz.", "Prolongement", 2),
      choice("Le facteur de qualité contient-il une unité ?", ["Non", "Oui, le hertz", "Oui, l’ohm", "Oui, le farad"], 0, "Q est un rapport de fréquences ou de tensions.", "Contrôle d’unités", 1),
      short("Exercice 3 : calcule C en µF au dixième près.", ["101.3", "101,3", "101.3 µF", "101,3 µF", "101"], "C≈101,3 µF.", "Exercice 3, question 1", 2),
      short("Exercice 3 : donne Q sous forme exacte.", ["π", "pi"], "Q=2π×50×0,1/10=π.", "Exercice 3", 1),
      short("Exercice 3 : calcule UL au dixième près.", ["37.7", "37,7", "37.7 V", "37,7 V", "38"], "UL=12π≈37,7 V.", "Exercice 3, question 2", 2),
      short("Exercice 3 : calcule UC au dixième près.", ["37.7", "37,7", "37.7 V", "37,7 V", "38"], "UC=UL à la résonance.", "Exercice 3, question 2", 2),
      choice("Dans la substitution de Q de l’exercice 2, le numérateur doit contenir…", ["L=0,25 H", "C=1,5 µF", "r²", "U"], 0, "Q=2πN₀L/r.", "Exercice 2 corrigé", 1),
      short("Contrôle : que vaut LCω² avec la capacité correcte de l’exercice 1 ?", ["1", "1.0", "1,0"], "La capacité a précisément été choisie pour satisfaire LCω²=1.", "Contrôle", 1),
    ],
    corrections: [
      "Page 7, exercice 1 : C=1/[50×10⁻³(100π)²]≈2,026×10⁻⁴ F=202,6 µF ; la solution 0,002 F oublie π².",
      "Page 7, exercice 2 : la substitution imprimée pour Q place 1,5×10⁻⁶ au numérateur alors que la formule exige L=0,25 H ; le résultat 40,9 correspond cependant à la bonne formule.",
    ],
  },
  {
    id: "resonance-characterization-lab-mission",
    title: "Mission laboratoire : caractériser R, L et C",
    summary: "Exploiter les montages continu et alternatif puis une courbe de résonance pour retrouver toutes les caractéristiques du circuit.",
    pages: "8 à 9",
    section: "Exercice 4 et solution",
    durationMinutes: 32,
    xp: 115,
    kind: "challenge",
    body: String.raw`## Étape 1 — résistance de la bobine en continu

Le montage a donne $U_1=5{,}0$ V et $I_1=250$ mA :

$$\boxed{R=\frac{U_1}{I_1}=\frac5{0{,}250}=20\ \Omega}$$

## Étape 2 — inductance en alternatif

Le montage b utilise $U_2=1{,}0$ V, $I_2=19{,}5$ mA et $N=50$ Hz. La bobine seule possède :

$$Z_b=\frac{U_2}{I_2}=\frac1{0{,}0195}\approx51{,}28\ \Omega$$

Or :

$$Z_b^2=R^2+(L\omega)^2$$

$$L=\frac1{2\pi N}\sqrt{\left(\frac{U_2}{I_2}\right)^2-R^2}\approx\boxed{0{,}1503\ \text{H}}$$

## Étape 3 — courbe de résonance

| $N$ (Hz) | 50 | 100 | 150 | 200 | 220 | 240 | 250 | 260 | 270 | 280 | 300 | 350 | 500 |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| $I$ (mA) | 8 | 18 | 35 | 76 | 118 | 228 | 362 | 500 | 364 | 240 | 136 | 67 | 29 |

Le maximum est $I_0=500$ mA à :

$$\boxed{N_0=260\ \text{Hz}}$$

La tension efficace maintenue par le GBF est alors :

$$\boxed{U_3=RI_0=20\times0{,}500=10\ \text{V}}$$

## Étape 4 — capacité manquante dans la solution imprimée

À la résonance :

$$C=\frac1{L(2\pi N_0)^2}$$

$$C\approx\frac1{0{,}1503(2\pi\times260)^2}\approx\boxed{2{,}49\ \mu\text{F}}$$

Le support pose la relation mais saute directement à la bande passante : la valeur de $C$ n’y est jamais donnée. Elle est restaurée ici.

## Étape 5 — bande passante et qualité

Le seuil vaut :

$$\frac{I_0}{\sqrt2}=\frac{500}{\sqrt2}\approx353{,}6\ \text{mA}$$

Le document lit $N_1\approx250$ Hz et $N_2\approx271$ Hz :

$$\boxed{\Delta N\approx21\ \text{Hz}},\qquad \boxed{Q\approx\frac{260}{21}=12{,}38}$$

Avec les paramètres calculés, le modèle idéal donne $\Delta N=R/(2\pi L)\approx21{,}18$ Hz, ce qui confirme la lecture graphique. Les fréquences de coupure théoriques sont environ $249{,}6$ Hz et $270{,}8$ Hz.` ,
    keyPoint: "R=20 Ω, L≈0,1503 H, N₀=260 Hz, U₃=10 V, C≈2,49 µF, ΔN≈21 Hz et Q≈12,38.",
    example: "La courbe culmine à 500 mA : à la résonance U₃=RI₀=10 V, puis C se déduit de L et N₀.",
    methodSteps: [
      "En continu, calcule R=U₁/I₁.",
      "En alternatif, calcule Zb=U₂/I₂ puis isole L.",
      "Lis N₀ et I₀ au sommet de I=f(N).",
      "Déduis U₃=RI₀ et C=1/[L(2πN₀)²].",
      "Lis N₁ et N₂ au seuil I₀/√2, puis calcule ΔN et Q.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Exercice 4",
      title: "Courbe expérimentale du circuit inconnu",
      instruction: "Déplace le point sur les mesures et observe le pic très aigu.",
      observation: "Le sommet à 260 Hz et 500 mA permet de retrouver la tension puis la capacité.",
      formula: "I = f(N), exercice 4",
      formulaTex: "I=f(N)",
      rule: { kind: "samples", points: exercise4Points },
      window: { xMin: 40, xMax: 510, yMin: 0, yMax: 550 },
      guides: [
        { kind: "horizontal", value: 353.553, label: "I₀/√2" },
        { kind: "vertical", value: 260, label: "N₀=260 Hz" },
      ],
      marker: { min: 50, max: 500, step: 10, initial: 260 },
    },
    questions: [
      short("Montage a : convertis 250 mA en A.", ["0.25", "0,25", "0.25 A", "0,25 A"], "250 mA=0,250 A.", "Exercice 4, montage a", 1),
      short("Montage a : calcule R.", ["20", "20 Ω"], "R=5/0,250=20 Ω.", "Exercice 4, question 1", 2),
      short("Montage b : calcule Zb au centième près.", ["51.28", "51,28", "51.28 Ω", "51,28 Ω"], "Zb=1/0,0195≈51,28 Ω.", "Exercice 4, question 1", 2),
      short("Montage b : calcule L au millième de henry près.", ["0.150", "0,150", "0.15", "0,15", "150 mH"], "L≈0,1503 H.", "Exercice 4, question 1", 2),
      short("Lis l’intensité à 240 Hz.", ["228", "228 mA"], "Le tableau donne 228 mA.", "Exercice 4, tableau", 1),
      short("Lis l’intensité maximale I₀.", ["500", "500 mA", "0.5 A", "0,5 A"], "Le maximum vaut 500 mA.", "Exercice 4, question 2b", 1),
      short("Lis la fréquence de résonance N₀.", ["260", "260 Hz"], "Le maximum est observé à 260 Hz.", "Exercice 4, question 2b", 1),
      short("Calcule U₃.", ["10", "10 V"], "U₃=20×0,500=10 V.", "Exercice 4, question 2c", 2),
      short("Calcule C en µF au centième près.", ["2.49", "2,49", "2.49 µF", "2,49 µF", "2.5", "2,5"], "C≈2,49 µF.", "Exercice 4, question 2c restaurée", 2),
      short("Calcule le seuil I₀/√2 en mA, à l’unité près.", ["354", "354 mA", "353.6", "353,6"], "500/√2≈353,6 mA, soit 354 mA.", "Exercice 4, question 2d", 2),
      short("Avec N₁=250 Hz et N₂=271 Hz, calcule ΔN.", ["21", "21 Hz"], "271−250=21 Hz.", "Exercice 4, question 2d", 1),
      short("Calcule Q avec N₀=260 Hz et ΔN=21 Hz, au centième près.", ["12.38", "12,38", "12.4", "12,4"], "260/21≈12,38.", "Exercice 4, question 2d", 2),
      choice("La valeur de C est-elle explicitement terminée dans la solution imprimée ?", ["Non", "Oui"], 0, "La relation est amorcée, puis le texte passe à la bande passante.", "Correction source", 1),
      short("Calcule ΔN idéale avec R=20 Ω et L=0,1503 H, au dixième près.", ["21.2", "21,2", "21.2 Hz", "21,2 Hz"], "20/(2π×0,1503)≈21,18 Hz.", "Contrôle théorique", 2),
      choice("La lecture graphique ΔN≈21 Hz est-elle cohérente avec le modèle ?", ["Oui", "Non"], 0, "Le modèle donne environ 21,18 Hz.", "Contrôle", 1),
      choice("Pour mesurer une tension, le voltmètre doit être branché…", ["en dérivation", "en série", "à la place du GBF", "sans référence"], 0, "Un voltmètre se branche aux bornes du dipôle.", "Montages", 1),
    ],
    corrections: [
      "Page 9 : la solution de l’exercice 4 écrit la condition de résonance mais omet le calcul demandé de la capacité ; avec les données non arrondies, C≈2,49 µF.",
      "Page 9 : le fragment « 444Valeur de N0 » est un artefact de mise en page, sans signification physique.",
    ],
  },
  {
    id: "resonance-oscilloscope-radio-mission",
    title: "Mission finale : oscilloscope et accord radio",
    summary: "Lire un oscillogramme de résonance pour identifier une bobine, puis transposer la méthode à l’accord d’un récepteur FM.",
    pages: "10 à 11",
    section: "Exercice 5 ; documentation Radio FM ; situation d’apprentissage",
    durationMinutes: 32,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Partie A — exercice 5 fidèle

Le circuit série contient $R=20\ \Omega$, une bobine $(L,r)$ et $C=1\ \mu$F. L’oscilloscope affiche $u_1=Ri$ et la tension totale $u_2$.

Réglages :

- balayage horizontal : $500\ \mu$s par division ;
- voie $u_1$ : $1$ V par division ;
- voie $u_2$ : $2$ V par division.

Les deux courbes sont en phase. Une période occupe quatre divisions :

$$T=4\times500\times10^{-6}=2{,}0\times10^{-3}\ \text{s}$$

$$\boxed{N=\frac1T=500\ \text{Hz}}$$

L’amplitude de $u_1$ vaut quatre divisions, donc $U_{1m}=4$ V :

$$\boxed{I_m=\frac{U_{1m}}R=\frac4{20}=0{,}20\ \text{A}}$$

L’amplitude de $u_2$ vaut trois divisions à $2$ V/div :

$$\boxed{U_{2m}=6\ \text{V}}$$

À la résonance, l’impédance est $R+r$ :

$$r=\frac{U_{2m}}{I_m}-R=\frac6{0{,}20}-20=\boxed{10\ \Omega}$$

Enfin :

$$L=\frac1{C(2\pi N)^2}=\frac1{10^{-6}(2\pi\times500)^2}\approx\boxed{0{,}1013\ \text{H}}$$

Le support arrondit à $0{,}10$ H.

## Partie B — de l’oscilloscope à Radio Fréquence 2

La documentation rappelle que la bande FM usuelle s’étend de $87{,}5$ à $108$ MHz. La fréquence de Radio Fréquence 2 est donc $92{,}0$ **MHz**, et non kHz.

Pour accorder un circuit sur $N_0=92{,}0$ MHz :

$$LC=\frac1{(2\pi N_0)^2}$$

Si l’on choisit une petite inductance adaptée aux très hautes fréquences, $L=100$ nH :

$$C=\frac1{100\times10^{-9}(2\pi\times92{,}0\times10^6)^2}\approx\boxed{29{,}9\ \text{pF}}$$

Un circuit de grand facteur de qualité possède une bande étroite et rejette mieux les stations voisines. Le réglage réel d’un poste fait varier $C$ ou $L$ jusqu’à faire coïncider $N_0$ avec la fréquence recherchée.

## Synthèse de toute la leçon

1. tracer $I=f(N)$ à tension fixée ;
2. repérer $I_0$ et $N_0$ ;
3. lire $N_1$ et $N_2$ au seuil $I_0/\sqrt2$ ;
4. calculer $\Delta N$ puis $Q$ ;
5. surveiller $U_L=U_C=QU$ ;
6. vérifier la cohérence des données avant de conclure.

> **Astuce mémoire finale.** Le poste « écoute » la fréquence pour laquelle son circuit laisse passer le courant maximal.` ,
    keyPoint: "L’oscillogramme donne N=500 Hz, Im=0,20 A, U2m=6 V, r=10 Ω et L≈0,101 H ; l’accord de 92 MHz exige des composants nanohenry/picofarad.",
    example: "Avec L=100 nH, accorder 92,0 MHz demande C≈29,9 pF.",
    methodSteps: [
      "Lis T avec le balayage horizontal, puis N=1/T.",
      "Convertis les divisions verticales en amplitudes.",
      "Utilise u1=Ri pour calculer Im.",
      "À la résonance, calcule r puis L.",
      "Pour la radio, corrige MHz, choisis L et déduis C avec LCω₀²=1.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Oscilloscope",
      title: "Deux tensions en phase à la résonance",
      instruction: "Sélectionne les repères pour lire période et amplitudes.",
      observation: "Les maxima coïncident : u₂ et u₁=Ri sont en phase, donc le circuit est à la résonance.",
      viewBox: "0 0 660 320",
      caption: "Oscillogramme original redessiné d’après la figure 2 de l’exercice 5.",
      shapes: [
        { shape: "line", x1: 50, y1: 160, x2: 610, y2: 160, tone: "muted" },
        { shape: "line", x1: 50, y1: 40, x2: 50, y2: 280, tone: "muted" },
        { shape: "path", d: "M50 160 C85 40 120 40 155 160 C190 280 225 280 260 160 C295 40 330 40 365 160 C400 280 435 280 470 160 C505 40 540 40 575 160 C590 210 600 225 610 230", tone: "accent" },
        { shape: "path", d: "M50 160 C85 70 120 70 155 160 C190 250 225 250 260 160 C295 70 330 70 365 160 C400 250 435 250 470 160 C505 70 540 70 575 160 C590 200 600 210 610 215", tone: "soft" },
        { shape: "text", x: 115, y: 32, content: "u₁", anchor: "middle" },
        { shape: "text", x: 145, y: 78, content: "u₂", anchor: "middle" },
      ],
      hotspots: [
        { id: "period", number: 1, label: "Période", detail: "Quatre divisions à 500 µs/div donnent T=2 ms et N=500 Hz.", x: 260, y: 45 },
        { id: "u1", number: 2, label: "Amplitude u₁", detail: "Quatre divisions à 1 V/div donnent U1m=4 V, donc Im=0,20 A.", x: 115, y: 55 },
        { id: "u2", number: 3, label: "Amplitude u₂", detail: "Trois divisions à 2 V/div donnent U2m=6 V.", x: 155, y: 90 },
        { id: "phase", number: 4, label: "Même phase", detail: "Les passages par zéro et les maxima coïncident : φu/i=0.", x: 365, y: 160 },
      ],
    },
    questions: [
      short("Exercice 5 : calcule T en millisecondes.", ["2", "2 ms", "2.0 ms", "2,0 ms"], "4×500 µs=2000 µs=2 ms.", "Exercice 5, question 1.1", 1),
      short("Exercice 5 : calcule N.", ["500", "500 Hz"], "N=1/(2×10⁻³)=500 Hz.", "Exercice 5, question 1.1", 2),
      short("Lis U1m.", ["4", "4 V"], "4 divisions à 1 V/div donnent 4 V.", "Exercice 5, question 1.2", 1),
      short("Calcule Im.", ["0.2", "0,2", "0.2 A", "0,2 A", "200 mA"], "Im=4/20=0,20 A.", "Exercice 5, question 1.2", 2),
      short("Lis U2m.", ["6", "6 V"], "3 divisions à 2 V/div donnent 6 V.", "Exercice 5, question 1.3", 1),
      choice("Le phénomène observé est…", ["la résonance d’intensité", "la charge continue", "l’électrolyse", "l’induction mutuelle"], 0, "u₂ et u₁=Ri sont en phase.", "Exercice 5, question 2", 1),
      short("Calcule r.", ["10", "10 Ω"], "r=6/0,20−20=10 Ω.", "Exercice 5, question 3.1", 2),
      short("Calcule L au millième de henry près.", ["0.101", "0,101", "0.10", "0,10", "0.101 H", "0,101 H"], "L≈0,1013 H.", "Exercice 5, question 3.2", 2),
      choice("La bande FM usuelle est exprimée ici en…", ["MHz", "kHz", "Hz uniquement", "ohms"], 0, "Elle s’étend environ de 87,5 à 108 MHz.", "Documentation Radio FM", 1),
      short("Convertis 92,0 MHz en hertz.", ["92000000", "92 000 000", "9.2e7", "9,2e7"], "92,0 MHz=92,0×10⁶ Hz.", "Situation corrigée", 1),
      short("Avec L=100 nH, calcule C d’accord à 92,0 MHz en pF, au dixième près.", ["29.9", "29,9", "29.9 pF", "29,9 pF", "30", "30 pF"], "C≈29,9 pF.", "Mission radio", 2),
      choice("Pour mieux séparer deux stations proches, il faut…", ["un grand Q", "un petit Q", "une bande très large", "supprimer C"], 0, "Un grand Q donne une bande passante étroite.", "Sélectivité radio", 1),
      choice("Pour changer de station dans un récepteur accordé, on peut faire varier…", ["C", "l’unité du volt", "la masse de l’élève", "la constante π"], 0, "Modifier C déplace N₀=1/(2π√LC).", "Accord radio", 1),
      choice("À la résonance, la phrase-réflexe correcte est…", ["Z minimale, I maximale", "Z maximale, I minimale", "I nulle", "N₀ dépend uniquement de R"], 0, "C’est le cœur de la leçon.", "Synthèse", 1),
      choice("Avant de valider un résultat numérique, il faut…", ["contrôler unités et cohérence", "supprimer les décimales", "copier toute valeur imprimée", "changer la fréquence au hasard"], 0, "Les erreurs détectées dans le support montrent l’importance du contrôle.", "Synthèse", 1),
    ],
    corrections: [
      "Page 11 et situation page 1 : Radio Fréquence 2 doit être accordée à 92,0 MHz, et non 92,0 kHz.",
      "Page 11 : la valeur L=0,1 H du support est un arrondi ; avec les données affichées, L≈0,1013 H.",
    ],
  },
  {
    id: "resonance-quality-selectivity",
    title: "Mesurer la qualité et la sélectivité",
    summary: "Calculer le facteur de qualité, relier sa valeur à la largeur de bande et choisir un circuit capable d’isoler une fréquence.",
    pages: "4 à 5",
    section: "III.3 Facteur de qualité ; activité d’application 2",
    durationMinutes: 24,
    xp: 75,
    body: String.raw`## Un nombre sans unité pour comparer les résonances

Le facteur de qualité d’un circuit RLC série est :

$$\boxed{Q=\frac{N_0}{\Delta N}=\frac{\omega_0}{\Delta\omega}}$$

En combinant les expressions de $N_0$ et de la bande passante :

$$\boxed{Q=\frac{L\omega_0}{R_t}=\frac1{R_tC\omega_0}=\frac1{R_t}\sqrt{\frac LC}}$$

$Q$ est sans unité. Il compare la fréquence centrale à la largeur de la bande transmise.

## Lire l’acuité de la courbe

| Valeur de $Q$ | Bande passante | Résonance | Sélectivité |
|---|---|---|---|
| grande | étroite | aiguë | forte |
| petite | large | floue | faible |

Une radio doit sélectionner une station proche de plusieurs autres : elle a donc besoin d’un circuit à résonance aiguë. À $L$ et $C$ fixées, diminuer la résistance série augmente $Q$.

## Valeurs lues dans le support

Avec les lectures graphiques retenues :

$$Q_1=\frac{211}{60}\approx3{,}52$$

$$Q_2=\frac{211}{90}\approx2{,}34$$

La première courbe est bien plus sélective que la seconde.

## Activité d’application 2

Une bobine de $L=250$ mH et de résistance totale $R_t=37\ \Omega$ est associée à $C=3{,}2\ \mu$F.

1. Fréquence de résonance :

$$N_0=\frac1{2\pi\sqrt{0{,}250\times3{,}2\times10^{-6}}}\approx177{,}94\ \text{Hz}\approx\boxed{178\ \text{Hz}}$$

2. Facteur de qualité :

$$Q=\frac{2\pi N_0L}{R_t}\approx\frac{2\pi\times177{,}94\times0{,}250}{37}\approx\boxed{7{,}55}$$

3. Bande passante :

$$\Delta N=\frac{N_0}{Q}=\frac{R_t}{2\pi L}\approx\boxed{23{,}55\ \text{Hz}}$$

Le document écrit que le GBF est initialement réglé sur $100$ Hz. Cette information n’entre pas dans le calcul de $N_0$ : pour observer la résonance, il faut ensuite régler le GBF vers $178$ Hz.

## Audit des deux tableaux du cours

Les mesures de la seconde courbe sont utiles pour apprendre la lecture graphique. Mais les étiquettes $L=0{,}10$ H et $R=200\ \Omega$ donneraient, dans le modèle idéal :

$$\Delta N=\frac{200}{2\pi\times0{,}10}\approx318{,}3\ \text{Hz},\qquad Q\approx0{,}66$$

et non $90$ Hz et $2{,}3$. De plus, les deux pics ne correspondent pas à la même tension efficace si $I_0=U/R$. On doit donc traiter cette seconde série comme une **courbe expérimentale fournie**, sans lui imposer simultanément toutes les données idéales imprimées.` ,
    keyPoint: "Q=N₀/ΔN=Lω₀/Rt : grand Q signifie bande étroite, résonance aiguë et circuit sélectif.",
    example: "Pour N₀=178 Hz et ΔN=23,55 Hz, Q≈7,56 : le circuit est nettement plus sélectif qu’un circuit de Q=2.",
    methodSteps: [
      "Détermine N₀ et la largeur ΔN avec la même source de données.",
      "Calcule Q=N₀/ΔN sans unité.",
      "Vérifie éventuellement Q=Lω₀/Rt si le modèle idéal et Rt sont connus.",
      "Grand Q : pic étroit ; petit Q : pic large.",
      "Ne mélange pas une lecture expérimentale et des valeurs idéales incompatibles.",
    ],
    interaction: {
      eyebrow: "Sélectivité",
      title: "Influence de la résistance sur la bande passante",
      instruction: "Fais varier Rt pour une inductance L=0,250 H.",
      observation: "La bande passante augmente linéairement avec Rt : plus de résistance signifie moins de sélectivité.",
      formula: "ΔN = Rt / (2π × 0,250)",
      formulaTex: "\\Delta N=\\frac{R_t}{2\\pi\\times0{,}250}",
      inputSymbol: "Rt",
      outputSuffix: " Hz de bande passante",
      rule: { kind: "linear", coefficient: 1 / (2 * Math.PI * 0.25), constant: 0 },
      input: { min: 5, max: 100, step: 1, initial: 37 },
    },
    questions: [
      choice("Le facteur de qualité vaut…", ["N₀/ΔN", "ΔN/N₀", "N₁+N₂", "RLC"], 0, "Q=N₀/ΔN.", "III.3 Définition", 1),
      choice("L’unité de Q est…", ["aucune", "le hertz", "l’ohm", "le farad"], 0, "C’est le rapport de deux fréquences.", "III.3 Définition", 1),
      choice("Un grand facteur de qualité correspond à une bande…", ["étroite", "large", "négative", "infinie"], 0, "Q=N₀/ΔN.", "III.3 Conclusion", 1),
      choice("Un circuit très sélectif possède…", ["une résonance aiguë", "une courbe plate", "Q=0", "une résistance maximale"], 0, "La sélectivité augmente avec l’acuité.", "III.3 Conclusion", 1),
      choice("À L et C fixées, augmenter Rt fait Q…", ["diminuer", "augmenter", "rester constant", "changer d’unité"], 0, "Q=(1/Rt)√(L/C).", "Expression de Q", 1),
      short("Calcule Q pour N₀=211 Hz et ΔN=60 Hz, au centième près.", ["3.52", "3,52", "3.517", "3,517"], "211/60≈3,52.", "Première courbe", 2),
      short("Calcule Q pour N₀=211 Hz et ΔN=90 Hz, au centième près.", ["2.34", "2,34", "2.3", "2,3"], "211/90≈2,34.", "Seconde courbe", 2),
      choice("Entre Q=3,52 et Q=2,34, le circuit le plus sélectif est celui de…", ["Q=3,52", "Q=2,34", "les deux pareil", "Q=0"], 0, "Le plus grand Q correspond au pic le plus aigu.", "Comparaison", 1),
      short("Activité 2 : calcule N₀ pour L=250 mH et C=3,2 µF, à l’unité près.", ["178", "178 Hz"], "N₀≈177,94 Hz.", "Activité d’application 2", 2),
      short("Activité 2 : calcule Q au dixième près.", ["7.6", "7,6", "7.55", "7,55"], "Q≈7,55, soit 7,6 au dixième.", "Activité d’application 2", 2),
      short("Activité 2 : calcule ΔN au dixième près.", ["23.6", "23,6", "23.55", "23,55", "23.6 Hz", "23,6 Hz"], "ΔN=37/(2π×0,250)≈23,55 Hz.", "Activité d’application 2", 2),
      choice("Le réglage initial N=100 Hz de l’activité est-il la fréquence de résonance ?", ["Non", "Oui"], 0, "Le calcul donne environ 178 Hz.", "Activité d’application 2 auditée", 1),
      short("Avec L=0,10 H et Rt=200 Ω, calcule ΔN idéale au hertz près.", ["318", "318 Hz", "318.3", "318,3"], "ΔN=200/(2π×0,10)≈318,3 Hz.", "Audit des données", 2),
    ],
    corrections: [
      "Pages 2 à 4 : la seconde courbe peut être exploitée graphiquement, mais ses valeurs sont incompatibles avec le modèle idéal annoncé L=0,10 H, R=200 Ω et une tension U commune aux deux séries ; les résultats expérimentaux et les formules idéales sont donc distingués.",
      "Page 5 : le réglage N=100 Hz indiqué dans l’activité 2 n’est pas la fréquence de résonance ; celle-ci vaut environ 178 Hz.",
    ],
  },
  {
    id: "resonance-overvoltage-applications",
    title: "Comprendre la surtension et ses applications",
    summary: "Relier le facteur de qualité aux tensions de la bobine et du condensateur, prévenir les risques et comprendre la sélection radio.",
    pages: "5 et 7 à 8",
    section: "III.4 Surtension ; IV. Applications ; exercice 3",
    durationMinutes: 23,
    xp: 85,
    body: String.raw`## Des tensions qui se compensent sans être petites

À la résonance, $X_L=X_C$ et les tensions réactives efficaces sont opposées dans la construction de Fresnel :

$$U_L=L\omega_0I_0,\qquad U_C=\frac{I_0}{C\omega_0},\qquad U_L=U_C$$

La tension du générateur vaut $U=R_tI_0$. Par conséquent :

$$\frac{U_L}{U}=\frac{L\omega_0}{R_t}=Q$$

$$\frac{U_C}{U}=\frac1{R_tC\omega_0}=Q$$

Donc, pour des dipôles idéaux :

$$\boxed{U_L=U_C=QU}$$

Même si $U_L$ et $U_C$ peuvent être très grandes, elles se compensent dans la somme vectorielle parce qu’elles sont en opposition de phase.

## Quand parle-t-on réellement de surtension ?

- si $Q>1$, alors $U_L=U_C>U$ : il y a surtension ;
- si $Q=1$, les tensions réactives valent $U$ ;
- si $Q<1$, elles restent inférieures à $U$.

Le support affirme directement que $Q$ est « très grand ». Ce n’est pas automatique : cela dépend de $R_t$, $L$ et $C$. Une forte surtension peut échauffer la bobine ou faire claquer le condensateur ; il faut choisir une tension nominale adaptée.

## Trois domaines d’application

1. **Électronique et radio** : une grande sélectivité isole une fréquence parmi plusieurs stations.
2. **Acoustique** : une caisse ou une colonne d’air répond fortement à sa fréquence propre.
3. **Mécanique** : une balançoire prend de l’amplitude si les impulsions sont accordées à sa fréquence propre.

## Exercice 3 entièrement résolu

Le circuit comporte $R_t=10\ \Omega$, $L=0{,}10$ H, $U=12$ V et fonctionne à $N_0=50$ Hz.

La capacité nécessaire est :

$$C=\frac1{L(2\pi N_0)^2}=\frac1{0{,}10(2\pi\times50)^2}\approx1{,}013\times10^{-4}\ \text{F}$$

$$\boxed{C\approx101{,}3\ \mu\text{F}}$$

Le facteur de qualité vaut :

$$Q=\frac{2\pi N_0L}{R_t}=\frac{2\pi\times50\times0{,}10}{10}=\pi\approx3{,}142$$

Ainsi :

$$\boxed{U_L=U_C=QU\approx3{,}142\times12\approx37{,}7\ \text{V}}$$

Le document arrondit correctement à environ $38$ V.` ,
    keyPoint: "À la résonance idéale, UL=UC=QU ; il y a surtension seulement si Q>1.",
    example: "Avec Q=π et U=12 V, UL=UC≈37,7 V alors que la tension totale reste 12 V.",
    methodSteps: [
      "Vérifie d’abord que le circuit est à la résonance.",
      "Calcule Q=Lω₀/Rt ou Q=N₀/ΔN.",
      "Utilise UL=UC=QU.",
      "Compare chaque tension réactive à U pour conclure sur la surtension.",
      "Contrôle la tenue en tension des composants dans une application réelle.",
    ],
    interaction: {
      eyebrow: "Surtension",
      title: "Tension réactive pour U=12 V",
      instruction: "Fais varier Q et observe la tension aux bornes de L ou C.",
      observation: "Le seuil de surtension est Q=1 ; au-delà, UL et UC dépassent la tension du GBF.",
      formula: "UL = UC = 12Q",
      formulaTex: "U_L=U_C=QU=12Q",
      inputSymbol: "Q",
      outputSuffix: " V aux bornes de L ou C",
      rule: { kind: "linear", coefficient: 12, constant: 0 },
      input: { min: 0, max: 10, step: 0.1, initial: Math.PI },
    },
    questions: [
      choice("À la résonance idéale, les valeurs efficaces UL et UC sont…", ["égales", "toujours nulles", "sans relation", "de fréquences différentes"], 0, "XL=XC et le même courant traverse les deux dipôles.", "III.4 Surtension", 1),
      choice("La relation correcte est…", ["UL=UC=QU", "UL+UC=QU", "UL=U/Q", "UC=0"], 0, "Le rapport de chaque tension réactive à U vaut Q.", "III.4 Surtension", 1),
      choice("Il y a surtension si…", ["Q>1", "Q<0", "Q=0 uniquement", "R est infinie"], 0, "QU dépasse U lorsque Q>1.", "Surtension auditée", 1),
      choice("Si Q=0,5 et U=10 V, UC vaut…", ["5 V", "20 V", "10 V", "0,5 V"], 0, "UC=QU=0,5×10=5 V.", "Application de UC=QU", 1),
      choice("Une forte surtension peut…", ["détériorer le condensateur", "annuler toute énergie", "changer le hertz en ohm", "rendre C négative"], 0, "La tension nominale du condensateur peut être dépassée.", "III.4 Risque", 1),
      choice("L’accord d’un récepteur radio utilise surtout…", ["la sélectivité de la résonance", "la gravitation", "l’électrolyse", "la poussée d’Archimède"], 0, "Le circuit sélectionne une bande étroite autour de N₀.", "IV Applications", 1),
      choice("La balançoire illustre une résonance…", ["mécanique", "chimique", "nucléaire", "statique"], 0, "Les impulsions sont accordées sur les oscillations propres.", "IV Applications", 1),
      short("Exercice 3 : calcule C en µF, au dixième près.", ["101.3", "101,3", "101.3 µF", "101,3 µF", "101"], "C≈101,3 µF.", "Exercice 3", 2),
      short("Exercice 3 : calcule Q au centième près.", ["3.14", "3,14", "π", "pi"], "Q=π≈3,14.", "Exercice 3", 2),
      short("Exercice 3 : calcule UL en volts, au dixième près.", ["37.7", "37,7", "37.7 V", "37,7 V", "38", "38 V"], "UL=π×12≈37,7 V.", "Exercice 3", 2),
      short("Exercice 3 : calcule UC en volts, au dixième près.", ["37.7", "37,7", "37.7 V", "37,7 V", "38", "38 V"], "À la résonance, UC=UL≈37,7 V.", "Exercice 3", 2),
      choice("Pourquoi UL et UC ne donnent-elles pas 75,4 V au GBF ?", ["Elles sont opposées en phase", "Elles sont continues", "Elles sont nulles", "Elles ont des unités différentes"], 0, "Leurs contributions réactives se compensent dans la somme vectorielle.", "Interprétation", 1),
      short("Pour U=8 V et Q=6, calcule UC.", ["48", "48 V"], "UC=QU=6×8=48 V.", "Application directe", 2),
    ],
    corrections: [
      "Page 5 : l’affirmation « Q étant très grand » n’est pas générale ; une surtension n’existe que si Q>1.",
    ],
  },
  {
    id: "resonance-official-evaluation-audit",
    title: "Auditer la situation d’évaluation officielle",
    summary: "Exploiter deux expériences pour retrouver r, L, I et Q, puis démontrer proprement l’incompatibilité des données de surtension.",
    pages: "5 à 7",
    section: "Situation d’évaluation et solution",
    durationMinutes: 30,
    xp: 95,
    kind: "challenge",
    body: String.raw`## Données de la situation

Une bobine inconnue possède une inductance $L$ et une résistance interne $r$.

### Expérience 1 — courant continu

$$U=15\ \text{V},\qquad I=2{,}0\ \text{A}$$

En régime permanent continu, seule la résistance interne intervient :

$$\boxed{r=\frac UI=\frac{15}{2{,}0}=7{,}5\ \Omega}$$

### Expérience 2 — circuit RLC série

La bobine est associée à $C=6{,}1\ \mu$F, à $R=400\ \Omega$ et à un GBF de tension efficace $U_0=2{,}0$ V. Les signaux du GBF et de $u_R=Ri$ deviennent en phase à $N=148$ Hz. Le document annonce aussi $U_C=15{,}4$ V.

Le signal $u_R$ est en phase avec $i$ ; l’égalité de phase entre $u_R$ et $u$ identifie donc la résonance d’intensité.

## Grandeurs déterminées par les données cohérentes

À la résonance :

$$L=\frac1{C(2\pi N)^2}$$

$$L=\frac1{6{,}1\times10^{-6}(2\pi\times148)^2}\approx\boxed{0{,}1896\ \text{H}}$$

La résistance totale est $R_t=R+r=407{,}5\ \Omega$ :

$$I_0=\frac{U_0}{R_t}=\frac2{407{,}5}\approx\boxed{4{,}91\ \text{mA}}$$

Puis :

$$Q=\frac{2\pi NL}{R_t}\approx\boxed{0{,}433}$$

$$\Delta N=\frac NQ=\frac{R_t}{2\pi L}\approx\boxed{342\ \text{Hz}}$$

Le support obtient $344$ Hz après avoir arrondi prématurément $Q$ à $0{,}43$ ; il est préférable de conserver $Q=0{,}4326$ jusqu’à la fin.

## Contrôle indispensable de $U_C$

Avec ces mêmes valeurs :

$$U_C=QU_0\approx0{,}433\times2\approx\boxed{0{,}865\ \text{V}}$$

Cela contredit la donnée $U_C=15{,}4$ V. Inversement, la mesure annoncée imposerait :

$$Q=\frac{U_C}{U_0}=\frac{15{,}4}{2}=7{,}7$$

et une résistance totale :

$$R_t=\frac{L\omega_0}{Q}\approx22{,}9\ \Omega$$

qui n’est pas $407{,}5\ \Omega$. **Aucun circuit RLC idéal unique ne satisfait toutes les données imprimées.** La bonne pratique scientifique est de présenter les résultats cohérents puis de signaler la contradiction, pas de la masquer.

## Connexions de l’oscilloscope

- une voie mesure $u_R=Ri$ et représente la phase du courant ;
- l’autre mesure la tension $u$ du GBF ;
- les masses des deux voies doivent être reliées au même point de référence.

> **Réflexe Bac.** Après chaque calcul, réinjecte le résultat dans une autre relation. Ici, le test $U_C=QU_0$ révèle immédiatement l’erreur de données.` ,
    keyPoint: "Les données cohérentes donnent r=7,5 Ω, L≈0,1896 H, I₀≈4,91 mA, Q≈0,433 et ΔN≈342 Hz ; UC=15,4 V est incompatible.",
    example: "Le contrôle UC=QU₀ prédit 0,865 V, très loin des 15,4 V imprimés : la situation ne possède pas de solution globale cohérente.",
    methodSteps: [
      "Utilise l’expérience continue pour calculer r=U/I.",
      "Identifie la résonance grâce à u et uR=Ri en phase.",
      "Calcule L avec C et N, puis I₀ avec la résistance totale.",
      "Calcule Q et ΔN sans arrondi intermédiaire.",
      "Contrôle la donnée UC avec UC=QU₀ et signale toute contradiction.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Montage bicourbe",
      title: "Observer le courant et la tension du GBF",
      instruction: "Sélectionne les repères pour comprendre le branchement de l’oscilloscope.",
      observation: "Comparer uR et u permet de détecter l’instant où la tension totale et le courant sont en phase.",
      viewBox: "0 0 660 300",
      caption: "Montage original redessiné d’après la situation officielle.",
      shapes: [
        { shape: "line", x1: 90, y1: 70, x2: 570, y2: 70, tone: "outline" },
        { shape: "line", x1: 90, y1: 230, x2: 570, y2: 230, tone: "outline" },
        { shape: "line", x1: 90, y1: 70, x2: 90, y2: 230, tone: "outline" },
        { shape: "line", x1: 570, y1: 70, x2: 570, y2: 230, tone: "outline" },
        { shape: "path", d: "M150 70 C160 40 180 40 190 70 C200 100 220 100 230 70 C240 40 260 40 270 70", tone: "accent" },
        { shape: "line", x1: 330, y1: 45, x2: 330, y2: 95, tone: "accent" },
        { shape: "line", x1: 345, y1: 45, x2: 345, y2: 95, tone: "accent" },
        { shape: "path", d: "M410 70 L410 125 L490 125 L490 175 L410 175 L410 230", tone: "soft" },
        { shape: "circle", cx: 300, cy: 230, r: 36, tone: "soft" },
        { shape: "path", d: "M270 230 C280 205 295 205 305 230 C315 255 330 255 340 230", tone: "accent" },
        { shape: "text", x: 210, y: 32, content: "bobine (L,r)", anchor: "middle" },
        { shape: "text", x: 338, y: 32, content: "C", anchor: "middle" },
        { shape: "text", x: 450, y: 150, content: "R", anchor: "middle" },
        { shape: "text", x: 300, y: 286, content: "GBF", anchor: "middle" },
      ],
      hotspots: [
        { id: "current-channel", number: 1, label: "Voie courant", detail: "Elle mesure uR=Ri ; uR et i sont en phase.", x: 500, y: 150 },
        { id: "voltage-channel", number: 2, label: "Voie tension", detail: "Elle mesure la tension u aux bornes de tout le dipôle RLC.", x: 570, y: 105 },
        { id: "common-ground", number: 3, label: "Masse commune", detail: "Les deux voies partagent le même point de référence pour éviter un court-circuit.", x: 570, y: 230 },
        { id: "resonance", number: 4, label: "Résonance", detail: "Lorsque les deux sinusoïdes sont en phase, φu/i=0 et le courant est maximal.", x: 300, y: 230 },
      ],
    },
    questions: [
      short("Expérience 1 : calcule r.", ["7.5", "7,5", "7.5 Ω", "7,5 Ω"], "r=15/2=7,5 Ω.", "Situation, question 1", 2),
      choice("La voie mesurant uR permet de suivre la phase…", ["du courant", "de la capacité", "de L uniquement", "de la fréquence"], 0, "uR=Ri est en phase avec i.", "Situation, question 2.2", 1),
      choice("u et uR en phase à 148 Hz indiquent…", ["la résonance d’intensité", "un court-circuit", "une tension continue", "une réaction chimique"], 0, "À la résonance, u et i sont en phase.", "Situation, question 3.1", 1),
      short("Calcule L au millième de henry près.", ["0.190", "0,190", "0.19", "0,19", "0.190 H", "0,190 H"], "L≈0,1896 H.", "Situation, question 3.2.1", 2),
      short("Calcule la résistance totale R+r.", ["407.5", "407,5", "407.5 Ω", "407,5 Ω"], "400+7,5=407,5 Ω.", "Situation, question 3.2.2", 1),
      short("Calcule I₀ en mA, au centième près.", ["4.91", "4,91", "4.91 mA", "4,91 mA", "4.9", "4,9"], "I₀=2/407,5≈4,91 mA.", "Situation, question 3.2.2", 2),
      short("Calcule Q avec L non arrondie, au millième près.", ["0.433", "0,433", "0.4326", "0,4326"], "Q≈0,4326.", "Situation, question 3.4.1", 2),
      short("Déduis ΔN, au hertz près.", ["342", "342 Hz", "342.1", "342,1"], "ΔN=148/0,4326≈342,1 Hz.", "Situation, question 3.4.2", 2),
      short("Avec Q=0,4326 et U₀=2 V, calcule UC attendu.", ["0.865", "0,865", "0.87", "0,87", "0.865 V", "0,865 V"], "UC=QU₀≈0,865 V.", "Audit de cohérence", 2),
      choice("La valeur imprimée UC=15,4 V est-elle compatible avec R+r=407,5 Ω ?", ["Non", "Oui"], 0, "Le modèle prédit environ 0,865 V.", "Audit de cohérence", 1),
      short("Si UC=15,4 V et U₀=2 V, quel Q serait imposé ?", ["7.7", "7,7"], "Q=UC/U₀=7,7.", "Audit de cohérence", 2),
      short("Le Q=7,7 imposerait quelle résistance totale, au dixième près ?", ["22.9", "22,9", "22.9 Ω", "22,9 Ω"], "Rt=Lω₀/Q≈22,9 Ω.", "Audit de cohérence", 2),
      choice("Arrondir Q=0,4326 à 0,43 avant de calculer ΔN…", ["dégrade la précision", "améliore toujours la précision", "ne change jamais rien", "change l’unité"], 0, "148/0,43≈344 contre environ 342 avec la valeur non arrondie.", "Correction source", 1),
      choice("Face à des données contradictoires, la bonne démarche est…", ["signaler l’incompatibilité", "forcer une réponse unique", "supprimer les unités", "choisir au hasard"], 0, "Un raisonnement scientifique doit contrôler la cohérence.", "Méthode scientifique", 1),
      short("Calcule Δω=Rt/L avec Rt=407,5 Ω et L=0,1896 H, à la dizaine près.", ["2150", "2150 rad/s", "2150 rad.s-1", "2.15e3"], "Δω≈407,5/0,1896≈2149 rad·s⁻¹, soit 2150 à la dizaine près.", "Bande passante", 2),
    ],
    corrections: [
      "Pages 5 à 7 : R=400 Ω, r=7,5 Ω, L≈0,1896 H et N=148 Hz donnent Q≈0,433 et UC≈0,865 V ; la mesure UC=15,4 V est donc incompatible avec les autres données.",
      "Page 7 : ΔN≈344 Hz vient de l’arrondi prématuré Q=0,43 ; avec les valeurs non arrondies, ΔN≈342 Hz.",
      "Page 7 : la pulsation de largeur obtenue avec les valeurs non arrondies est proche de 2,15×10³ rad·s⁻¹ ; le résultat 2163 rad·s⁻¹ hérite lui aussi de l’arrondi de Q.",
    ],
  },
  {
    id: "resonance-frequency-condition",
    title: "Établir la condition de résonance",
    summary: "Relier le courant maximal à l’annulation de la partie réactive de l’impédance et calculer la fréquence propre du circuit.",
    pages: "2 à 4",
    section: "2.1 Intensité et fréquence de résonance ; III.1 Fréquence de résonance",
    durationMinutes: 22,
    xp: 55,
    body: String.raw`## Pourquoi le courant possède-t-il un maximum ?

Pour un circuit RLC série idéal de résistance totale $R_t$, l’impédance vaut :

$$Z=\sqrt{R_t^2+\left(L\omega-\frac1{C\omega}\right)^2}$$

À tension efficace $U$ fixée :

$$I=\frac UZ$$

Le courant est donc maximal lorsque $Z$ est minimale. Le carré ajouté à $R_t^2$ ne peut pas être négatif ; son minimum vaut zéro. Ainsi :

$$L\omega_0-\frac1{C\omega_0}=0$$

$$\boxed{L\omega_0=\frac1{C\omega_0}}\qquad\Longleftrightarrow\qquad\boxed{LC\omega_0^2=1}$$

On obtient la pulsation et la fréquence propres :

$$\boxed{\omega_0=\frac1{\sqrt{LC}}},\qquad \boxed{N_0=\frac1{2\pi\sqrt{LC}}}$$

## Ce qui change exactement à la résonance

Les effets inductif et capacitif se compensent dans la tension totale :

$$X_L=L\omega_0=X_C=\frac1{C\omega_0}$$

L’impédance est alors purement résistive :

$$\boxed{Z_0=R_t},\qquad \boxed{I_0=\frac U{R_t}},\qquad \boxed{\varphi_{u/i}=0}$$

La tension totale et le courant sont en phase. La fréquence $N_0$ ne dépend que de $L$ et $C$ dans le modèle idéal ; la hauteur du pic dépend de la résistance totale.

## Vérification des données du cours

Avec $L=0{,}10$ H et $C=5{,}7\times10^{-6}$ F :

$$N_0=\frac1{2\pi\sqrt{0{,}10\times5{,}7\times10^{-6}}}\approx210{,}81\ \text{Hz}$$

Le résultat théorique s’arrondit à $211$ Hz et encadre parfaitement le maximum expérimental mesuré à $210$ Hz.

## Activité d’application 1

Pour $L=1$ H et $C=10\ \mu$F :

$$N_0=\frac1{2\pi\sqrt{1\times10\times10^{-6}}}\approx\boxed{50{,}33\ \text{Hz}}$$

> **Astuce mémoire.** Résonance de courant : $X_L=X_C$, donc $Z=R_t$, $I$ est maximale et le déphasage est nul.` ,
    keyPoint: "À la résonance : Lω₀=1/(Cω₀), N₀=1/(2π√LC), Z₀=Rt et φu/i=0.",
    example: "Pour L=1 H et C=10 µF, N₀≈50,33 Hz.",
    methodSteps: [
      "Écris Z²=Rt²+(Lω−1/Cω)².",
      "Pour maximiser I=U/Z, minimise Z.",
      "Annule le terme réactif : Lω₀=1/(Cω₀).",
      "Déduis ω₀ puis N₀=ω₀/(2π).",
      "Conclue Z₀=Rt, I₀=U/Rt et φ=0.",
    ],
    interaction: timeline([
      { label: "Partir de l’impédance", shortLabel: "Z", detail: "Z²=Rt²+(Lω−1/Cω)²." },
      { label: "Annuler la réactance", shortLabel: "XL=XC", detail: "Le minimum de Z est obtenu lorsque Lω₀=1/(Cω₀)." },
      { label: "Trouver la fréquence", shortLabel: "N₀", detail: "ω₀=1/√(LC), puis N₀=1/(2π√(LC))." },
      { label: "Lire les conséquences", shortLabel: "I max", detail: "Z₀=Rt, I₀=U/Rt et u est en phase avec i." },
    ], "Du modèle au maximum de courant", "Ouvre les quatre étapes de la démonstration.", "La résonance est une conséquence directe du minimum de l’impédance."),
    questions: [
      choice("À tension U fixée, I est maximale lorsque Z est…", ["minimale", "maximale", "négative", "infinie"], 0, "I=U/Z.", "2.1 Exploitation", 1),
      choice("La condition de résonance est…", ["Lω₀=1/(Cω₀)", "Lω₀+1/(Cω₀)=0", "R=0 obligatoirement", "ω₀=LC"], 0, "Les réactances inductive et capacitive sont égales.", "III.1 Fréquence", 1),
      choice("À la résonance, LCω₀² vaut…", ["1", "0", "R", "2π"], 0, "La condition se réarrange en LCω₀²=1.", "III.1 Fréquence", 1),
      choice("La pulsation propre vaut…", ["1/√(LC)", "2π√(LC)", "LC", "R/L"], 0, "ω₀=1/√(LC).", "III.1 Fréquence", 1),
      choice("La fréquence propre vaut…", ["1/(2π√(LC))", "2π/√(LC)", "R/(2πL)", "LC/(2π)"], 0, "N₀=ω₀/(2π).", "III.1 Fréquence", 1),
      choice("Dans le modèle idéal, N₀ dépend…", ["de L et C", "seulement de R", "de U et I", "de la marque du GBF"], 0, "R n’apparaît pas dans N₀.", "2.1.2 Conclusion", 1),
      choice("À la résonance, l’impédance du circuit vaut…", ["Rt", "0", "Lω₀", "1/(Cω₀) seulement"], 0, "Les deux réactances se compensent, il reste la résistance totale.", "Remarque page 4", 1),
      choice("À la résonance, la tension totale et le courant sont…", ["en phase", "en opposition", "décalés de π/2", "de fréquences différentes"], 0, "Le circuit se comporte comme un conducteur ohmique.", "Remarque page 4", 1),
      short("Calcule N₀ pour L=0,10 H et C=5,7 µF, au hertz près.", ["211", "211 Hz", "210.8", "210,8", "210.81", "210,81"], "N₀≈210,81 Hz, soit 211 Hz.", "Application numérique", 2),
      short("Le maximum expérimental est à 210 Hz et le calcul donne 210,81 Hz. Donne l’écart absolu arrondi au centième.", ["0.81", "0,81", "0.81 Hz", "0,81 Hz"], "|210,81−210|=0,81 Hz.", "Comparaison théorie-expérience", 2),
      short("Activité 1 : calcule N₀ pour L=1 H et C=10 µF.", ["50.33", "50,33", "50.3", "50,3", "50.33 Hz", "50,33 Hz"], "N₀≈50,33 Hz.", "Activité d’application 1", 2),
      choice("Si Rt augmente alors que U reste fixe, I₀…", ["diminue", "augmente", "reste exactement inchangée", "devient complexe"], 0, "I₀=U/Rt.", "Intensité de résonance", 1),
      short("À la résonance, calcule I₀ pour U=2 V et Rt=40 Ω.", ["0.05", "0,05", "0.05 A", "0,05 A", "50 mA"], "I₀=2/40=0,05 A=50 mA.", "Conséquence Z₀=Rt", 2),
    ],
  },
  {
    id: "resonance-bandwidth-three-db",
    title: "Déterminer la bande passante à 3 dB",
    summary: "Lire les fréquences de coupure au seuil I₀/√2 et calculer la largeur de la bande passante en hertz ou en radians par seconde.",
    pages: "3 à 4",
    section: "2.2 Bande passante à 3 décibels",
    durationMinutes: 24,
    xp: 65,
    kind: "graph",
    body: String.raw`## Définition opérationnelle

La bande passante à $3$ dB est l’intervalle des fréquences pour lesquelles :

$$\boxed{I\geq\frac{I_0}{\sqrt2}}$$

Les deux fréquences de coupure $N_1$ et $N_2$ vérifient :

$$I(N_1)=I(N_2)=\frac{I_0}{\sqrt2},\qquad N_1<N_0<N_2$$

Sa largeur est :

$$\boxed{\Delta N=N_2-N_1}$$

Pourquoi « $3$ dB » ? Dans la résistance, $P=R_tI^2$. Au seuil :

$$\frac{P}{P_{\max}}=\left(\frac{I_0/\sqrt2}{I_0}\right)^2=\frac12$$

et $10\log_{10}(1/2)\approx-3{,}01$ dB.

## Première courbe du support

Pour $I_0=54{,}4$ mA :

$$\frac{I_0}{\sqrt2}=38{,}47\ \text{mA}$$

Le support lit graphiquement $N_1=180$ Hz et $N_2=240$ Hz :

$$\boxed{\Delta N=240-180=60\ \text{Hz}}$$

Une interpolation linéaire plus fine des valeurs tabulées donne environ $179{,}95$ Hz et $241{,}89$ Hz. La lecture $180$–$240$ Hz est donc une lecture graphique arrondie, conforme à la précision demandée.

## Seconde courbe du support

Pour $I'_0=20$ mA :

$$\frac{I'_0}{\sqrt2}=14{,}14\ \text{mA}$$

Le document retient $N'_1=160$ Hz et $N'_2=250$ Hz, donc :

$$\boxed{\Delta N'=90\ \text{Hz}}$$

L’interpolation des données donne plutôt $163{,}2$ Hz et $249{,}3$ Hz. Là encore, il s’agit de valeurs lues sur une courbe tracée à une échelle limitée.

## Formules du modèle idéal

Pour une résistance série totale $R_t$ :

$$\boxed{\Delta\omega=\omega_2-\omega_1=\frac{R_t}{L}}$$

Puisque $\omega=2\pi N$ :

$$\boxed{\Delta N=\frac{R_t}{2\pi L}}$$

La largeur augmente avec la résistance et diminue lorsque l’inductance augmente. Il ne faut cependant pas confondre les lectures expérimentales arrondies et une prédiction théorique fondée sur des composants idéaux.` ,
    keyPoint: "Bande passante : I≥I₀/√2, ΔN=N₂−N₁ et, dans le modèle idéal, ΔN=Rt/(2πL).",
    example: "I₀=54,4 mA donne un seuil de 38,47 mA ; les lectures 180 Hz et 240 Hz donnent ΔN=60 Hz.",
    methodSteps: [
      "Lis I₀ au sommet de la courbe.",
      "Calcule le seuil I₀/√2.",
      "Trace mentalement ou graphiquement l’horizontale du seuil.",
      "Lis N₁ à gauche et N₂ à droite.",
      "Calcule ΔN=N₂−N₁ et garde une précision cohérente avec le graphe.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Lecture graphique",
      title: "Seuil à 3 dB sur la première courbe",
      instruction: "Déplace le point et repère les deux croisements avec 38,47 mA.",
      observation: "Le support retient environ 180 Hz et 240 Hz, soit une bande passante de 60 Hz.",
      formula: "I = f(N), seuil I₀/√2",
      formulaTex: "I=f(N),\\qquad I_{\\mathrm{seuil}}=\\frac{I_0}{\\sqrt2}",
      rule: { kind: "samples", points: resonance36Points },
      window: { xMin: 50, xMax: 310, yMin: 0, yMax: 60 },
      guides: [
        { kind: "horizontal", value: 38.4666, label: "I₀/√2" },
        { kind: "vertical", value: 180, label: "N₁≈180 Hz" },
        { kind: "vertical", value: 240, label: "N₂≈240 Hz" },
      ],
      marker: { min: 60, max: 300, step: 10, initial: 180 },
    },
    questions: [
      choice("La bande passante à 3 dB correspond aux fréquences pour lesquelles…", ["I≥I₀/√2", "I≥2I₀", "I=0 uniquement", "N=N₀ uniquement"], 0, "C’est la définition du support.", "2.2 Définition", 1),
      choice("Les fréquences de coupure vérifient…", ["I=I₀/√2", "I=I₀²", "I=0", "I=2I₀"], 0, "Elles sont les intersections de la courbe et du seuil.", "2.2 Définition", 1),
      choice("L’ordre correct est…", ["N₁<N₀<N₂", "N₀<N₁<N₂", "N₂<N₁<N₀", "N₁=N₂ toujours"], 0, "La résonance se situe entre les deux coupures.", "Lecture graphique", 1),
      choice("La largeur de bande vaut…", ["N₂−N₁", "N₂+N₁", "N₀/N₁", "I₀/N₀"], 0, "ΔN=N₂−N₁.", "2.2 Définition", 1),
      short("Calcule 54,4/√2 en mA, au centième près.", ["38.47", "38,47", "38.47 mA", "38,47 mA"], "54,4/√2≈38,47 mA.", "Première courbe", 2),
      short("Calcule ΔN pour N₁=180 Hz et N₂=240 Hz.", ["60", "60 Hz"], "240−180=60 Hz.", "Première courbe", 1),
      short("Calcule 20/√2 en mA, au centième près.", ["14.14", "14,14", "14.14 mA", "14,14 mA"], "20/√2≈14,14 mA.", "Seconde courbe", 2),
      short("Calcule ΔN′ pour N′₁=160 Hz et N′₂=250 Hz.", ["90", "90 Hz"], "250−160=90 Hz.", "Seconde courbe", 1),
      choice("À I=I₀/√2, la puissance résistive vaut…", ["Pmax/2", "Pmax/√2", "2Pmax", "0"], 0, "P est proportionnelle à I².", "Sens des 3 dB", 1),
      short("Calcule Δω si Rt=36 Ω et L=0,10 H.", ["360", "360 rad/s", "360 rad.s-1", "360 rad·s⁻¹"], "Δω=Rt/L=36/0,10=360 rad·s⁻¹.", "Formule idéale", 2),
      short("Calcule ΔN théorique pour Rt=36 Ω et L=0,10 H, au dixième près.", ["57.3", "57,3", "57.3 Hz", "57,3 Hz"], "ΔN=36/(2π×0,10)≈57,3 Hz.", "Formule idéale", 2),
      choice("Si Rt augmente à L fixée, ΔN…", ["augmente", "diminue", "reste nulle", "change de signe"], 0, "ΔN=Rt/(2πL).", "Conclusion", 1),
      choice("Les valeurs 180 Hz et 240 Hz sont…", ["des lectures graphiques arrondies", "des constantes universelles", "des pulsations", "des résistances"], 0, "Elles dépendent de la courbe et de sa précision.", "Lecture auditée", 1),
    ],
  },
];

const levelOrder = [
  "resonance-experimental-curve",
  "resonance-frequency-condition",
  "resonance-bandwidth-three-db",
  "resonance-quality-selectivity",
  "resonance-overvoltage-applications",
  "resonance-official-evaluation-audit",
  "resonance-official-exercises-one-three",
  "resonance-characterization-lab-mission",
  "resonance-oscilloscope-radio-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau de résonance RLC introuvable : " + id);
  return officialLevel(index, level);
});

export const rlcIntensityResonancePath: LearningPath = {
  id: "terminale-cd-rlc-intensity-resonance",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Leçon 14 en Terminale C • Leçon 12 en Terminale D",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/15951-tle-d-phy-l14-resonance-dintensite-by-tehua",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 14,
  title: "Résonance d’intensité d’un circuit RLC série",
  description: "Tracer et exploiter une courbe de résonance, déterminer fréquence, bande passante, facteur de qualité et surtension, puis résoudre les cinq exercices officiels.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Tracer I=f(N) à tension efficace constante et repérer la résonance.",
    "Établir N₀=1/(2π√LC), Z₀=Rt et φu/i=0.",
    "Déterminer les fréquences de coupure et la bande passante à 3 dB.",
    "Calculer le facteur de qualité et interpréter la sélectivité.",
    "Évaluer la surtension aux bornes de la bobine et du condensateur.",
    "Résoudre les cinq exercices et la situation d’évaluation en contrôlant la cohérence des données.",
    "Transposer la résonance à l’accord d’un récepteur radio FM.",
  ],
  modules: [{
    id: "rlc-intensity-resonance-mastery",
    title: "Maîtriser la résonance d’intensité",
    description: "Des mesures expérimentales à l’accord radio, neuf niveaux fidèles aux onze pages du support ivoirien.",
    lessons: builtLevels,
  }],
};

export const rlcIntensityResonancePaths: LearningPath[] = [rlcIntensityResonancePath];
