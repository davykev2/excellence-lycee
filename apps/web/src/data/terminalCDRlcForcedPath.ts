import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 13 de Physique en Terminale C et leçon 11 en Terminale D.
const sourceDocument = "Tle D PHY L13 Circuit RLC en régime sinusoïdal forcé.pdf";

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
      introduction: "Applique cette démarche aux formules, diagrammes de Fresnel et oscillogrammes du document ivoirien.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : choisis toujours le courant comme référence de phase ; les tensions de R, L et C se placent alors sans hésitation.",
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
    id: "sinusoidal-current-effective-values",
    title: "Caractériser un courant alternatif sinusoïdal",
    summary: "Lire amplitude, pulsation, phase, période, fréquence et valeur efficace dans l’expression d’un signal sinusoïdal.",
    pages: "1 à 2 et 7",
    section: "1. Courant alternatif sinusoïdal ; activité d’application ; exercice 1",
    durationMinutes: 18,
    xp: 45,
    body: String.raw`## Reconnaître une grandeur sinusoïdale

Une grandeur alternative sinusoïdale s’écrit sous la forme :

$$\boxed{x(t)=X_m\cos(\omega t+\varphi)}$$

- $X_m$ est l’**amplitude**, ou valeur maximale ;
- $\omega$ est la **pulsation**, en rad·s$^{-1}$ ;
- $\varphi$ est la **phase à l’origine**, en radians ;
- $\omega t+\varphi$ est la phase à l’instant $t$.

Pour le courant et la tension :

$$i(t)=I_m\cos(\omega t+\varphi_i),\qquad u(t)=U_m\cos(\omega t+\varphi_u)$$

## Période et fréquence

Une oscillation complète correspond à une augmentation de phase de $2\pi$ :

$$\boxed{\omega=2\pi f=\frac{2\pi}{T}},\qquad \boxed{T=\frac{2\pi}{\omega}},\qquad \boxed{f=\frac1T}$$

Le document note parfois la fréquence $N$ ; sur la plateforme, $f$ et $N$ désignent la même grandeur en hertz.

## Valeurs efficaces

La valeur efficace est celle qu’indiquerait un ampèremètre ou un voltmètre alternatif. Pour une sinusoïde :

$$\boxed{I=\frac{I_m}{\sqrt2}},\qquad \boxed{U=\frac{U_m}{\sqrt2}}$$

Elle produit, dans une résistance, le même effet Joule qu’un courant continu de même valeur.

> **Astuce mémoire.** L’oscilloscope montre surtout les valeurs maximales ; le multimètre alternatif donne les valeurs efficaces.

## Activité entièrement résolue

Pour $u_{AB}=311\cos(314{,}2t-\pi/2)$ :

| Grandeur | Lecture ou calcul |
|---|---:|
| $U_m$ | $311$ V |
| $\omega$ | $314{,}2$ rad·s$^{-1}$ |
| $\varphi$ | $-\pi/2$ rad |
| $U=U_m/\sqrt2$ | $220$ V |
| $T=2\pi/\omega$ | $0{,}0200$ s |
| $f=1/T$ | $50{,}0$ Hz |

L’exercice 1 reprend exactement la même méthode avec $\omega=628$ rad·s$^{-1}$ : $T\approx0{,}0100$ s et $f\approx100$ Hz.`,
    keyPoint: "Dans x(t)=Xm cos(ωt+φ), on lit Xm, ω et φ ; puis T=2π/ω, f=1/T et Xeff=Xm/√2.",
    example: "Pour u=311cos(628t−π/2), Um=311 V, U≈220 V, T≈0,0100 s et f≈100 Hz.",
    methodSteps: [
      "Repère l’amplitude devant le cosinus.",
      "Lis le coefficient de t : c’est la pulsation ω.",
      "Lis le terme constant dans la parenthèse : c’est la phase à l’origine.",
      "Calcule T=2π/ω puis f=1/T.",
      "Divise l’amplitude par √2 pour obtenir la valeur efficace.",
    ],
    interaction: {
      eyebrow: "Convertisseur",
      title: "De la valeur maximale à la valeur efficace",
      instruction: "Fais varier l’amplitude maximale d’une tension sinusoïdale.",
      observation: "La valeur efficace reste égale à 0,707 fois l’amplitude.",
      formula: "U = Um / √2",
      formulaTex: "U=\\frac{U_m}{\\sqrt2}",
      inputSymbol: "Um",
      outputSuffix: " V efficaces",
      rule: { kind: "linear", coefficient: 1 / Math.sqrt(2), constant: 0 },
      input: { min: 0, max: 400, step: 10, initial: 311 },
    },
    questions: [
      choice("Dans x(t)=Xm cos(ωt+φ), Xm représente…", ["l’amplitude", "la période", "la fréquence", "l’impédance"], 0, "Xm est la valeur maximale de la grandeur.", "1.2 Expressions", 1),
      choice("L’unité de la pulsation ω est…", ["rad·s⁻¹", "Hz uniquement", "V", "Ω"], 0, "Une pulsation est un angle parcouru par unité de temps.", "1.2 Expressions", 1),
      choice("La relation correcte est…", ["ω=2πf", "ω=f/2π", "T=ω/2π", "f=T"], 0, "ω=2πf=2π/T.", "1.2 Expressions", 1),
      choice("Un voltmètre alternatif mesure principalement…", ["la valeur efficace", "la phase", "la pulsation", "la capacité"], 0, "Le document distingue mesure efficace au multimètre et maximum à l’oscilloscope.", "1.3 Valeurs efficaces", 1),
      choice("Pour une sinusoïde, U vaut…", ["Um/√2", "√2 Um", "Um/2", "2Um"], 0, "U=Um/√2.", "1.3 Valeurs efficaces", 1),
      short("Donne Um pour u=311cos(314,2t−π/2).", ["311", "311 V"], "L’amplitude est le coefficient devant le cosinus.", "Activité d’application", 1),
      short("Donne ω pour u=311cos(314,2t−π/2).", ["314.2", "314,2", "314.2 rad/s", "314,2 rad/s"], "Le coefficient de t vaut 314,2 rad·s⁻¹.", "Activité d’application", 1),
      short("Donne la phase à l’origine de u=311cos(314,2t−π/2).", ["-π/2", "−π/2", "-pi/2", "−pi/2"], "Le terme constant est −π/2.", "Activité d’application", 1),
      short("Calcule la valeur efficace associée à Um=311 V, arrondie au volt.", ["220", "220 V"], "311/√2≈219,91 V, soit 220 V.", "Activité d’application", 2),
      short("Calcule T pour ω=314,2 rad/s.", ["0.02", "0,02", "0.020", "0,020", "20 ms"], "T=2π/314,2≈0,0200 s.", "Activité d’application", 2),
      short("Calcule f lorsque T=0,020 s.", ["50", "50 Hz"], "f=1/T=50 Hz.", "Activité d’application", 1),
      short("Exercice 1 : calcule la fréquence pour ω=628 rad/s, à l’unité près.", ["100", "100 Hz"], "f=ω/(2π)≈99,95 Hz.", "Exercice 1", 2),
    ],
  },
  {
    id: "rlc-official-fresnel-mission",
    title: "Mission : retrouver la nature d’un circuit par Fresnel",
    summary: "Résoudre intégralement la situation d’évaluation officielle : impédance, courant, tensions, diagramme et nature.",
    pages: "6 à 7",
    section: "Situation d’évaluation",
    durationMinutes: 28,
    xp: 105,
    kind: "challenge",
    body: String.raw`## Situation d’évaluation

Un GBF alimente en série :

- un résistor $R=1000\ \Omega$ ;
- une bobine idéale $L=0{,}5$ H ;
- un condensateur $C=2\ \mu$F.

La tension imposée est :

$$u(t)=10\sqrt2\cos(10^3\pi t)$$

On lit donc :

$$U_m=10\sqrt2\ \text{V},\qquad U=10\ \text{V},\qquad \omega=1000\pi\ \text{rad·s}^{-1}$$

## 1. Calcul des réactances et de l’impédance

$$X_L=L\omega=0{,}5\times1000\pi\approx1570{,}8\ \Omega$$

$$X_C=\frac1{C\omega}=\frac1{2\times10^{-6}\times1000\pi}\approx159{,}15\ \Omega$$

$$X=X_L-X_C\approx1411{,}64\ \Omega$$

$$Z=\sqrt{R^2+X^2}\approx\boxed{1729{,}95\ \Omega}$$

La valeur $1729\ \Omega$ du document provient d’arrondis intermédiaires ; conserver les valeurs non arrondies donne environ $1730\ \Omega$.

## 2. Intensité et tensions efficaces

$$I=\frac UZ\approx\frac{10}{1729{,}95}=5{,}7805\times10^{-3}\ \text{A}$$

$$\boxed{I\approx5{,}78\ \text{mA}}$$

Puis :

| Tension | Expression | Valeur |
|---|---:|---:|
| $U_R$ | $RI$ | $5{,}78$ V |
| $U_L$ | $X_LI$ | $9{,}08$ V |
| $U_C$ | $X_CI$ | $0{,}920$ V |

## 3. Diagramme de Fresnel

À l’échelle 1 cm pour 1 V :

- trace $U_R$ sur $5{,}78$ cm horizontalement ;
- trace $U_L-U_C=8{,}16$ cm vers le haut ;
- l’hypoténuse mesure $10$ cm et représente $U$.

La phase vaut :

$$\varphi=\arctan\left(\frac{1411{,}64}{1000}\right)\approx0{,}954\ \text{rad}\approx54{,}7^\circ$$

## 4. Nature

Comme $X_L>X_C$, $\varphi>0$ : la tension est en avance sur le courant et le circuit est **inductif**.

> **Contrôle intelligent.** $U$ n’est pas $U_R+U_L+U_C$ ; ici cette somme vaudrait $15{,}78$ V. Le diagramme donne bien $\sqrt{5{,}78^2+8{,}16^2}\approx10$ V.`,
    keyPoint: "Pour la mission : Z≈1730 Ω, I≈5,78 mA, UR≈5,78 V, UL≈9,08 V, UC≈0,920 V et le circuit est inductif.",
    example: "Le triangle 5,78-8,16-10 confirme simultanément la tension du GBF et la nature inductive.",
    methodSteps: [
      "Lis Um, ω et calcule la valeur efficace U.",
      "Calcule XL et XC sans arrondir trop tôt.",
      "Déduis X, Z puis I=U/Z.",
      "Calcule UR, UL et UC avec le même courant efficace.",
      "Construis Fresnel et conclus avec le signe de XL−XC.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Mission graphique",
      title: "Diagramme numérique de la situation",
      instruction: "Sélectionne les trois côtés du triangle de Fresnel.",
      observation: "Les côtés 5,78 V et 8,16 V donnent une résultante de 10 V.",
      viewBox: "0 0 620 350",
      caption: "Construction originale à l’échelle des valeurs corrigées.",
      shapes: [
        { shape: "line", x1: 90, y1: 280, x2: 360, y2: 280, tone: "outline" },
        { shape: "line", x1: 360, y1: 280, x2: 360, y2: 70, tone: "accent" },
        { shape: "line", x1: 90, y1: 280, x2: 360, y2: 70, tone: "fill" },
        { shape: "text", x: 225, y: 310, content: "UR = 5,78 V", anchor: "middle" },
        { shape: "text", x: 385, y: 175, content: "UL−UC = 8,16 V", anchor: "start" },
        { shape: "text", x: 210, y: 165, content: "U = 10 V", anchor: "middle" },
      ],
      hotspots: [
        { id: "horizontal", number: 1, label: "Composante résistive", detail: "UR=RI≈5,78 V, horizontale.", x: 225, y: 265 },
        { id: "vertical", number: 2, label: "Composante réactive", detail: "UL−UC≈8,16 V, dirigée vers le haut car XL>XC.", x: 345, y: 170 },
        { id: "result", number: 3, label: "Tension totale", detail: "U=√(UR²+(UL−UC)²)≈10 V.", x: 210, y: 185 },
      ],
    },
    questions: [
      choice("Dans u=10√2 cos(10³πt), la valeur efficace U vaut…", ["10 V", "10√2 V", "5 V", "1000 V"], 0, "U=Um/√2=10 V.", "Situation d’évaluation", 1),
      short("Donne ω dans la situation d’évaluation.", ["1000π", "1000pi", "3141.59", "3141,59", "1000π rad/s"], "Le coefficient de t vaut 1000π rad·s⁻¹.", "Situation d’évaluation", 1),
      short("Calcule XL pour L=0,5 H et ω=1000π rad/s, à l’ohm près.", ["1571", "1571 Ω", "1570.8", "1570,8"], "XL=500π≈1570,8 Ω.", "Question 1.1", 2),
      short("Calcule XC pour C=2 µF et ω=1000π rad/s, à l’ohm près.", ["159", "159 Ω", "159.15", "159,15"], "XC≈159,15 Ω.", "Question 1.1", 2),
      short("Calcule XL−XC, à l’ohm près.", ["1412", "1412 Ω", "1411.64", "1411,64"], "La réactance nette vaut environ 1411,64 Ω.", "Question 1.1", 2),
      short("Calcule Z, à l’ohm près.", ["1730", "1730 Ω", "1729.95", "1729,95"], "Z=√(1000²+1411,64²)≈1729,95 Ω.", "Question 1.1", 2),
      short("Calcule I en mA, à 0,01 mA près.", ["5.78", "5,78", "5.78 mA", "5,78 mA"], "I=10/1729,95≈5,78 mA.", "Question 1.2", 2),
      short("Calcule UR, à 0,01 V près.", ["5.78", "5,78", "5.78 V", "5,78 V"], "UR=1000×0,0057805≈5,78 V.", "Question 2.3", 2),
      short("Calcule UL, à 0,01 V près.", ["9.08", "9,08", "9.08 V", "9,08 V"], "UL=XL I≈9,08 V.", "Question 2.2", 2),
      short("Calcule UC, à 0,01 V près.", ["0.92", "0,92", "0.92 V", "0,92 V"], "UC=XC I≈0,920 V.", "Question 2.1", 2),
      short("Calcule UL−UC, à 0,01 V près.", ["8.16", "8,16", "8.16 V", "8,16 V"], "9,08−0,92≈8,16 V.", "Question 3", 1),
      choice("Le circuit est…", ["inductif", "capacitif", "résistif", "ouvert"], 0, "XL>XC, donc φ>0.", "Question 4", 1),
      choice("La tension totale se calcule ici par…", ["√(UR²+(UL−UC)²)", "UR+UL+UC", "UL−UR−UC", "U=0"], 0, "Les tensions sont additionnées vectoriellement.", "Question 3", 1),
      short("Calcule approximativement φ en degrés.", ["54.7", "54,7", "54.7°", "54,7°", "55", "55°"], "φ=atan(1411,64/1000)≈54,7°.", "Déduction du diagramme", 2),
    ],
    corrections: [
      "Pages 6 et 7 : les résultats sont recalculés sans arrondis prématurés : Z≈1729,95 Ω, I≈5,7805 mA, UC≈0,920 V, UL≈9,080 V et UR≈5,781 V.",
    ],
  },
  {
    id: "rlc-oscilloscope-current-mission",
    title: "Mission : retrouver l’expression du courant sur l’écran",
    summary: "Résoudre l’exercice 4 à partir des voies A et B : période, pulsation, amplitudes, courant et signe de phase.",
    pages: "9 à 10",
    section: "Exercice 4",
    durationMinutes: 28,
    xp: 115,
    kind: "challenge",
    body: String.raw`## Données de l’exercice 4

Le dipôle série contient :

- $R_1=40\ \Omega$ ;
- une bobine d’inductance $L$ et de résistance $R_2$ ;
- un condensateur $C=5{,}0\ \mu$F.

Le GBF impose $u(t)=U_m\cos(\omega t)$. La voie B montre $u$ et la voie A montre $u_1=R_1i$.

Réglages :

- balayage : $1{,}0$ ms/div ;
- voies A et B : $1{,}0$ V/div.

## 1. Période et pulsation

Une période occupe 10 divisions :

$$T=10\times1{,}0\ \text{ms}=10\ \text{ms}=10^{-2}\ \text{s}$$

$$\omega=\frac{2\pi}{T}=200\pi\approx628{,}3\ \text{rad·s}^{-1}$$

## 2. Amplitudes et courant

La voie B occupe 3 divisions en amplitude :

$$U_m=3\times1=3\ \text{V}$$

La voie A occupe 2 divisions :

$$U_{1m}=2\times1=2\ \text{V}$$

Comme $u_1=R_1i$ :

$$I_m=\frac{U_{1m}}{R_1}=\frac2{40}=0{,}050\ \text{A}$$

## 3. Phase et expression de $i$

Le décalage vaut 1 division pour une période de 10 divisions :

$$|\varphi|=2\pi\frac1{10}=\frac\pi5$$

La voie B, donc $u$, atteint son maximum avant la voie A, donc $u$ est en avance sur $i$ :

$$\varphi_{u/i}=+\frac\pi5$$

Puisque $u(t)=U_m\cos(\omega t)$ sert de référence :

$$\boxed{i(t)=0{,}050\cos\left(628{,}3t-\frac\pi5\right)\ \text{A}}$$

## Contrôles complémentaires

Les données permettent aussi d’obtenir :

$$Z=\frac{U_m}{I_m}=\frac3{0{,}050}=60\ \Omega$$

et $I=I_m/\sqrt2\approx35{,}4$ mA.

> **Astuce mémoire.** Si $u$ est la référence et qu’elle est en avance de $\varphi$, alors le courant porte la phase $-\varphi$.`,
    keyPoint: "Exercice 4 : T=10 ms, ω≈628,3 rad/s, Um=3 V, Im=0,050 A, φu/i=+π/5 et i=0,050cos(628,3t−π/5).",
    example: "Le signe moins dans i vient du fait que la tension, prise comme référence, arrive une division avant le courant.",
    methodSteps: [
      "Associe chaque voie à sa tension et repère que u1=R1i.",
      "Lis T avec la base de temps puis calcule ω.",
      "Lis Um et U1m avec les sensibilités verticales.",
      "Calcule Im=U1m/R1.",
      "Mesure le décalage, choisis son signe et écris i(t).",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Oscillogramme",
      title: "Voie B avant voie A",
      instruction: "Sélectionne les repères pour reconstruire l’expression du courant.",
      observation: "La tension totale est en avance d’une division, soit π/5, sur le courant.",
      viewBox: "0 0 640 330",
      caption: "Oscillogramme original redessiné d’après l’exercice 4.",
      shapes: [
        { shape: "line", x1: 50, y1: 165, x2: 590, y2: 165, tone: "muted" },
        { shape: "line", x1: 320, y1: 35, x2: 320, y2: 295, tone: "muted" },
        { shape: "path", d: "M50 165 C80 45 110 45 140 165 C170 285 200 285 230 165 C260 45 290 45 320 165 C350 285 380 285 410 165 C440 45 470 45 500 165 C530 285 560 285 590 165", tone: "accent" },
        { shape: "path", d: "M50 245 C80 215 110 105 140 85 C170 65 200 145 230 235 C260 265 290 215 320 105 C350 65 380 105 410 215 C440 265 470 235 500 125 C530 65 560 85 590 195", tone: "soft" },
        { shape: "text", x: 105, y: 55, content: "B : u", anchor: "middle" },
        { shape: "text", x: 165, y: 100, content: "A : u1 ∝ i", anchor: "middle" },
      ],
      hotspots: [
        { id: "period", number: 1, label: "10 divisions", detail: "Avec 1 ms/div, T=10 ms.", x: 500, y: 285 },
        { id: "amplitudes", number: 2, label: "3 div et 2 div", detail: "Um=3 V et U1m=2 V avec 1 V/div.", x: 320, y: 75 },
        { id: "phase", number: 3, label: "1 division", detail: "u arrive avant u1 : φu/i=+2π/10=+π/5.", x: 145, y: 165 },
      ],
    },
    questions: [
      choice("Dans l’exercice 4, la voie A mesure…", ["u1=R1i", "uC uniquement", "uL uniquement", "la fréquence"], 0, "La tension résistive u1 est en phase avec i.", "Exercice 4, figure 1", 1),
      choice("La voie B mesure…", ["la tension totale u", "u1 uniquement", "la résistance R1", "l’impédance"], 0, "Le schéma relie la voie B au point N et la masse au point M.", "Exercice 4, figure 1", 1),
      short("Une période occupe 10 div à 1 ms/div. Calcule T en ms.", ["10", "10 ms"], "T=10×1 ms=10 ms.", "Question 1.1", 1),
      short("Calcule ω pour T=10 ms.", ["628.3", "628,3", "200π", "200pi", "628.3 rad/s", "628,3 rad/s"], "ω=2π/0,010=200π≈628,3 rad/s.", "Question 1.2", 2),
      short("La voie B mesure 3 div à 1 V/div. Calcule Um.", ["3", "3 V"], "Um=3 V.", "Question 2.1", 1),
      short("La voie A mesure 2 div à 1 V/div. Calcule U1m.", ["2", "2 V"], "U1m=2 V.", "Question 2.2", 1),
      short("Calcule Im avec U1m=2 V et R1=40 Ω.", ["0.05", "0,05", "0.05 A", "0,05 A", "50 mA"], "Im=2/40=0,050 A.", "Question 2.2", 2),
      short("Un décalage de 1 div sur 10 donne |φ|.", ["π/5", "pi/5", "0.628", "0,628"], "|φ|=2π/10=π/5.", "Question 3", 1),
      choice("La voie B atteint son maximum avant A. Donc…", ["φu/i>0", "φu/i<0", "φu/i=0", "f=0"], 0, "La tension totale est en avance sur le courant.", "Solution exercice 4", 1),
      choice("L’expression correcte du courant est…", ["0,05cos(628,3t−π/5)", "0,05cos(628,3t+π/5)", "2cos(10t)", "3cos(628,3t)"], 0, "u est la référence et i est en retard de π/5.", "Solution exercice 4", 2),
      short("Calcule l’impédance à partir de Um=3 V et Im=0,050 A.", ["60", "60 Ω"], "Z=3/0,050=60 Ω.", "Approfondissement", 2),
      short("Calcule la valeur efficace I pour Im=0,050 A, en mA à 0,1 mA près.", ["35.4", "35,4", "35.4 mA", "35,4 mA"], "I=50/√2≈35,4 mA.", "Approfondissement", 2),
      choice("Pourquoi le courant porte-t-il −π/5 ?", ["Parce que u, prise comme référence, est en avance", "Parce que R1 est négative", "Parce que C est nulle", "Parce que la fréquence change"], 0, "Le signe traduit le retard du courant.", "Expression finale", 1),
    ],
  },
  {
    id: "rc-capacitance-data-audit-mission",
    title: "Mission : déterminer une capacité sans subir les incohérences",
    summary: "Résoudre l’exercice 5, comparer phase et amplitudes, puis corriger rigoureusement la capacité annoncée dans le document.",
    pages: "10 à 11",
    section: "Exercice 5",
    durationMinutes: 32,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Le circuit RC de l’exercice 5

Le circuit contient un résistor $R=40\ \Omega$ et un condensateur inconnu $C$. On visualise la tension totale $u$ et la tension résistive $u_R$, en phase avec le courant.

Le texte ne donne pas explicitement les sensibilités de l’oscilloscope. La solution imprimée suppose :

- balayage : $0{,}5$ ms/div ;
- voie de $u$ : $2$ V/div ;
- voie de $u_R$ : $1$ V/div.

Sans ces trois réglages, les valeurs numériques ne seraient pas déterminables de façon unique.

## 1. Période, fréquence et phase graphique

Une période occupe 10 divisions :

$$T=10\times0{,}5\ \text{ms}=5{,}0\ \text{ms}$$

$$f=\frac1T=200\ \text{Hz},\qquad \omega=2\pi f=400\pi\ \text{rad·s}^{-1}$$

Le décalage lu vaut environ 2 divisions :

$$\varphi_{u/i}\approx-2\pi\frac2{10}=-0{,}4\pi\ \text{rad}$$

Le signe est négatif parce que, dans un circuit RC, la tension totale est en retard sur le courant.

## 2. Amplitudes, valeurs efficaces et impédance

Sous les sensibilités supposées par la correction :

$$U_m=5\times2=10\ \text{V},\qquad U_{Rm}=4\times1=4\ \text{V}$$

$$U=\frac{10}{\sqrt2}\approx7{,}071\ \text{V},\qquad U_R=\frac4{\sqrt2}\approx2{,}828\ \text{V}$$

$$I=\frac{U_R}{R}=\frac{2{,}828}{40}\approx0{,}07071\ \text{A}$$

$$Z=\frac UI=\frac{7{,}071}{0{,}07071}=100\ \Omega$$

## 3. Capacité corrigée

Pour un circuit RC :

$$Z^2=R^2+\left(\frac1{C\omega}\right)^2$$

Donc :

$$\boxed{C=\frac1{\omega\sqrt{Z^2-R^2}}}$$

Avec $\omega=400\pi$ rad·s$^{-1}$, $Z=100\ \Omega$ et $R=40\ \Omega$ :

$$C=\frac1{400\pi\sqrt{100^2-40^2}}\approx8{,}68\times10^{-6}\ \text{F}$$

$$\boxed{C\approx8{,}68\ \mu\text{F}}$$

La valeur $2{,}73\times10^{-5}$ F imprimée dans le document est incorrecte.

## 4. Pourquoi les lectures ne coïncident-elles pas parfaitement ?

Les amplitudes donnent :

$$\cos\varphi=\frac{U_R}{U}=\frac4{10}=0{,}4\quad\Longrightarrow\quad \varphi\approx-1{,}159\ \text{rad}\approx-0{,}369\pi$$

La lecture grossière de 2 divisions donne $-0{,}4\pi$. L’écart vient de la précision limitée du dessin. Il ne faut pas mélanger des lectures arrondies comme si elles étaient exactes.

Si l’on utilisait uniquement $-0{,}4\pi$, on trouverait environ $6{,}46\ \mu$F. La route demandée par le corrigé passe par $U$, $U_R$, $I$ et $Z$ ; elle conduit donc à $8{,}68\ \mu$F.

> **Astuce mémoire.** Une donnée graphique est une mesure : annonce sa précision, contrôle sa cohérence et n’invente jamais les réglages absents.`,
    keyPoint: "Avec les réglages supposés par la source : T=5 ms, f=200 Hz, Z=100 Ω et C≈8,68 µF ; la valeur 27,3 µF imprimée est fausse.",
    example: "Le contrôle cosφ=UR/U=0,4 révèle que la lecture de phase −0,4π est seulement approximative.",
    methodSteps: [
      "Vérifie que les sensibilités horizontale et verticales sont connues.",
      "Lis T, calcule f puis ω.",
      "Lis Um et URm, puis convertis-les en valeurs efficaces.",
      "Calcule I=UR/R et Z=U/I.",
      "Isole C et contrôle la cohérence avec cosφ=R/Z.",
    ],
    interaction: timeline([
      { label: "Lire l’écran", shortLabel: "Écran", detail: "T=5 ms, Um=10 V et URm=4 V sous les sensibilités supposées par la solution." },
      { label: "Passer en efficace", shortLabel: "Efficace", detail: "U≈7,071 V et UR≈2,828 V." },
      { label: "Calculer I et Z", shortLabel: "Impédance", detail: "I≈70,71 mA puis Z=100 Ω." },
      { label: "Isoler C", shortLabel: "Capacité", detail: "C=1/[ω√(Z²−R²)]≈8,68 µF." },
      { label: "Auditer", shortLabel: "Contrôle", detail: "La phase graphique arrondie et les amplitudes ne coïncident pas exactement ; on documente l’écart." },
    ], "Du graphe à la capacité corrigée", "Parcours les étapes du calcul sans sauter le contrôle de cohérence.", "Le résultat fiable issu de la route U/I est C≈8,68 µF."),
    questions: [
      choice("Quelle donnée manque dans l’énoncé imprimé de l’exercice 5 ?", ["les sensibilités de l’oscilloscope", "la résistance R", "la présence du condensateur", "le nombre de voies"], 0, "La solution utilise 0,5 ms/div, 2 V/div et 1 V/div sans les annoncer dans le texte.", "Exercice 5, données manquantes", 1),
      short("Calcule T pour 10 div à 0,5 ms/div.", ["5", "5 ms", "0.005", "0,005", "0.005 s", "0,005 s"], "T=5 ms=0,005 s.", "Question 2.1", 1),
      short("Calcule f lorsque T=5 ms.", ["200", "200 Hz"], "f=1/0,005=200 Hz.", "Question 2.1", 1),
      short("Calcule ω pour f=200 Hz.", ["400π", "400pi", "1256.64", "1256,64", "1257", "1257 rad/s"], "ω=2πf=400π≈1256,64 rad·s⁻¹.", "Question 2.1", 2),
      short("Calcule φ pour un retard de 2 div sur 10 div.", ["-0.4π", "−0,4π", "-0,4π", "-0.4pi", "-1.257", "-1,257"], "φ=−2π×2/10=−0,4π rad.", "Question 2.2", 2),
      short("Sous 2 V/div, 5 divisions donnent Um.", ["10", "10 V"], "Um=10 V.", "Question 2.3", 1),
      short("Sous 1 V/div, 4 divisions donnent URm.", ["4", "4 V"], "URm=4 V.", "Question 2.3", 1),
      short("Calcule U efficace pour Um=10 V, à 0,01 V près.", ["7.07", "7,07", "7.07 V", "7,07 V", "7.071", "7,071"], "U=10/√2≈7,071 V.", "Question 3.1", 1),
      short("Calcule I avec URm=4 V et R=40 Ω, en mA à 0,1 mA près.", ["70.7", "70,7", "70.7 mA", "70,7 mA", "0.0707", "0,0707"], "UR=4/√2 et I=UR/40≈70,71 mA.", "Question 3.1", 2),
      short("Calcule Z avec U=7,071 V et I=0,07071 A.", ["100", "100 Ω"], "Z=U/I=100 Ω.", "Question 3.2", 2),
      short("Calcule √(Z²−R²) pour Z=100 Ω et R=40 Ω, à 0,01 Ω près.", ["91.65", "91,65", "91.65 Ω", "91,65 Ω"], "√(10000−1600)=√8400≈91,65 Ω.", "Question 4", 2),
      short("Calcule C corrigée en µF, à 0,01 µF près.", ["8.68", "8,68", "8.68 µF", "8,68 µF", "8.683", "8,683"], "C=1/(400π×91,65)≈8,68 µF.", "Question 4 corrigée", 3),
      choice("Pourquoi −0,4π et UR/U=0,4 ne donnent-ils pas exactement la même phase ?", ["Le dessin et les lectures sont arrondis", "La loi d’Ohm est fausse", "La fréquence est nulle", "Le condensateur est absent"], 0, "Le graphe n’est pas une mesure parfaite et les divisions sont lues grossièrement.", "Contrôle de cohérence", 2),
    ],
    corrections: [
      "Pages 10 et 11 : les sensibilités utilisées par la solution (0,5 ms/div, 2 V/div pour u et 1 V/div pour uR) sont absentes de l’énoncé ; elles sont donc annoncées comme hypothèses nécessaires.",
      "Page 11 : avec ω=400π rad/s, Z=100 Ω et R=40 Ω, la formule imprimée donne C≈8,68×10⁻⁶ F, et non 2,73×10⁻⁵ F.",
      "Pages 10 et 11 : la phase lue à 2 divisions vaut −0,4π, tandis que le rapport UR/U=0,4 donne φ≈−0,369π ; cet écart est traité comme une incertitude de lecture du dessin, pas comme deux données exactes compatibles.",
    ],
  },
  {
    id: "rlc-series-dipoles-equation",
    title: "Établir l’équation et les tensions du circuit RLC",
    summary: "Appliquer la loi des mailles, utiliser les impédances élémentaires et distinguer valeurs maximales et efficaces.",
    pages: "4, 5, 7 et 8",
    section: "3.1 Équation différentielle ; exercice 2",
    durationMinutes: 24,
    xp: 75,
    body: String.raw`## Le circuit série soumis au GBF

Le générateur impose une tension sinusoïdale. Après disparition du régime transitoire, le circuit fonctionne en **régime sinusoïdal forcé** : toutes les tensions et le courant ont la pulsation $\omega$ du GBF.

La loi des mailles donne :

$$u=u_R+u_L+u_C$$

Pour un résistor $R$, une bobine idéale $L$ et un condensateur $C$ :

$$u=Ri+L\frac{\mathrm di}{\mathrm dt}+\frac qC,\qquad i=\frac{\mathrm dq}{\mathrm dt}$$

En fonction de la charge :

$$\boxed{L\ddot q+R\dot q+\frac qC=u(t)}$$

Si la bobine possède une résistance interne $r$, on remplace $R$ par la résistance totale :

$$\boxed{R_t=R+r}$$

## Tensions en prenant le courant pour référence

Avec $i(t)=I_m\cos(\omega t)$ :

$$u_R(t)=RI_m\cos(\omega t)$$

$$u_L(t)=L\omega I_m\cos\left(\omega t+\frac\pi2\right)$$

$$u_C(t)=\frac{I_m}{C\omega}\cos\left(\omega t-\frac\pi2\right)$$

Ainsi :

- $u_R$ est en phase avec $i$ ;
- $u_L$ est en avance de $\pi/2$ ;
- $u_C$ est en retard de $\pi/2$.

## Impédances élémentaires

En valeurs efficaces comme en amplitudes, les rapports tension/courant sont :

| Dipôle | Impédance | Phase de sa tension par rapport à $i$ |
|---|---:|---:|
| Résistor | $Z_R=R$ | $0$ |
| Bobine idéale | $Z_L=L\omega$ | $+\pi/2$ |
| Condensateur | $Z_C=1/(C\omega)$ | $-\pi/2$ |

## Exercice 2 entièrement traité

Pour $R=50\ \Omega$, $C=10^{-6}$ F, $L=2$ mH et $\omega=100\pi$ rad·s$^{-1}$ :

$$Z_R=50\ \Omega$$

$$Z_C=\frac1{10^{-6}\times100\pi}\approx3183\ \Omega$$

$$Z_L=2\times10^{-3}\times100\pi\approx0{,}628\ \Omega$$

> **Astuce mémoire.** Quand $\omega$ augmente, $Z_L=L\omega$ augmente alors que $Z_C=1/(C\omega)$ diminue.`,
    keyPoint: "Dans le circuit série : u=uR+uL+uC ; ZR=R, ZL=Lω et ZC=1/(Cω), avec des phases 0, +π/2 et −π/2.",
    example: "À ω=100π rad/s, une bobine de 2 mH a ZL≈0,628 Ω tandis qu’un condensateur de 1 µF a ZC≈3183 Ω.",
    methodSteps: [
      "Écris la loi des mailles u=uR+uL+uC.",
      "Remplace chaque tension par sa loi constitutive.",
      "Si la bobine est réelle, pose Rt=R+r.",
      "Prends i comme référence de phase.",
      "Calcule ZR, ZL et ZC dans des unités SI.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte des dipôles",
      title: "Trois contributions à la tension",
      instruction: "Sélectionne un dipôle pour revoir sa loi et sa phase.",
      observation: "Les tensions s’additionnent comme des vecteurs, pas comme trois nombres toujours positifs.",
      rootLabel: "Circuit RLC série",
      rootDetail: "Le même courant traverse R, L et C ; le GBF impose la pulsation ω.",
      nodes: [
        { id: "resistor", label: "Résistor R", role: "uR=Ri", detail: "ZR=R et uR est en phase avec le courant.", group: "Dipôles" },
        { id: "coil", label: "Bobine L", role: "uL=L di/dt", detail: "ZL=Lω et uL est en avance de π/2 sur le courant.", group: "Dipôles" },
        { id: "capacitor", label: "Condensateur C", role: "uC=q/C", detail: "ZC=1/(Cω) et uC est en retard de π/2 sur le courant.", group: "Dipôles" },
        { id: "mesh", label: "Maille", role: "u=uR+uL+uC", detail: "L’addition est instantanée ; en Fresnel, elle devient une somme vectorielle.", group: "Assemblage" },
      ],
    },
    questions: [
      choice("La loi des mailles du circuit série est…", ["u=uR+uL+uC", "u=uR−uL−uC toujours", "i=iR+iL+iC", "u=0 malgré le GBF"], 0, "Les trois tensions réceptrices s’ajoutent.", "3.1 Équation", 1),
      choice("Pour une bobine réelle, la résistance totale vaut…", ["R+r", "R−r", "Rr", "R/r"], 0, "Les résistances en série s’additionnent.", "Remarque sur la bobine réelle", 1),
      choice("La tension uR est…", ["en phase avec i", "en avance de π/2", "en retard de π/2", "opposée à i"], 0, "uR=Ri.", "3.2 Construction", 1),
      choice("La tension uL est…", ["en avance de π/2 sur i", "en retard de π/2", "en phase", "toujours nulle"], 0, "La dérivée du cosinus conduit à une avance de π/2 dans la convention utilisée.", "3.2 Construction", 1),
      choice("La tension uC est…", ["en retard de π/2 sur i", "en avance de π/2", "en phase", "de fréquence double"], 0, "L’intégration du courant produit un retard de π/2.", "3.2 Construction", 1),
      choice("L’impédance d’un résistor vaut…", ["R", "Lω", "1/(Cω)", "R²"], 0, "ZR=R.", "Exercice 2", 1),
      choice("L’impédance d’une bobine idéale vaut…", ["Lω", "R", "1/(Cω)", "Cω"], 0, "ZL=Lω.", "Exercice 2", 1),
      choice("L’impédance d’un condensateur vaut…", ["1/(Cω)", "Cω", "Lω", "R+C"], 0, "ZC=1/(Cω).", "Exercice 2", 1),
      short("Exercice 2 : calcule ZR pour R=50 Ω.", ["50", "50 Ω"], "ZR=R=50 Ω.", "Exercice 2", 1),
      short("Exercice 2 : calcule ZL pour L=2 mH et ω=100π rad/s, à 0,01 Ω près.", ["0.63", "0,63", "0.63 Ω", "0,63 Ω", "0.628", "0,628"], "ZL=0,002×100π≈0,628 Ω.", "Exercice 2", 2),
      short("Exercice 2 : calcule ZC pour C=1 µF et ω=100π rad/s, à l’ohm près.", ["3183", "3183 Ω"], "ZC=1/(10⁻⁶×100π)≈3183 Ω.", "Exercice 2", 2),
      choice("Quand ω augmente, ZL…", ["augmente", "diminue", "reste nulle", "devient égale à C"], 0, "ZL=Lω.", "Comparaison des dipôles", 1),
      choice("Quand ω augmente, ZC…", ["diminue", "augmente", "reste égale à R", "change de signe"], 0, "ZC=1/(Cω).", "Comparaison des dipôles", 1),
    ],
    corrections: [
      "Page 4 : dans le développement de uC, le facteur Im manque dans une ligne ; la bonne amplitude est Im/(Cω), comme le tableau de la page 5 l’indique ensuite.",
      "Pages 4 et 5 : les calculs sont réécrits avec Im pour les amplitudes et I pour les valeurs efficaces afin de ne pas mélanger les deux conventions.",
    ],
  },
  {
    id: "fresnel-vector-construction",
    title: "Construire le diagramme de Fresnel",
    summary: "Transformer les tensions sinusoïdales en vecteurs et obtenir la tension totale par une construction géométrique.",
    pages: "4 à 6",
    section: "3.2 Construction de Fresnel",
    durationMinutes: 24,
    xp: 85,
    body: String.raw`## Pourquoi utiliser des vecteurs ?

Les tensions $u_R$, $u_L$ et $u_C$ ont la même pulsation, mais des phases différentes. Additionner seulement leurs amplitudes serait faux. Le diagramme de Fresnel représente chaque sinusoïde par un vecteur :

- sa norme est l’amplitude ou la valeur efficace choisie ;
- son angle est sa phase par rapport à l’axe de référence.

On choisit l’axe du courant comme origine des phases.

## Les trois vecteurs

En valeurs efficaces :

$$\vec U_R=RI\,\vec e_x$$

$$\vec U_L=L\omega I\,\vec e_y$$

$$\vec U_C=-\frac{I}{C\omega}\,\vec e_y$$

La composante horizontale vaut $U_R=RI$. La composante verticale résultante vaut :

$$U_L-U_C=I\left(L\omega-\frac1{C\omega}\right)$$

La tension totale est la somme vectorielle :

$$\boxed{\vec U=\vec U_R+\vec U_L+\vec U_C}$$

## Construction pas à pas

1. Trace l’axe horizontal du courant.
2. Place $\vec U_R$ horizontalement vers la droite.
3. À son extrémité, place $\vec U_L$ vers le haut.
4. Place $\vec U_C$ vers le bas.
5. Relie l’origine au point final : tu obtiens $\vec U$.

Le triangle final a pour côtés $RI$, $|U_L-U_C|$ et $U$.

> **Astuce mémoire.** R reste sur la route horizontale ; L lève le vecteur ; C le couche vers le bas.`,
    keyPoint: "Dans Fresnel, UR est horizontal, UL vertical vers le haut, UC vertical vers le bas et U est leur somme vectorielle.",
    example: "Si UR=6 V, UL=9 V et UC=1 V, la composante verticale vaut 8 V et U=√(6²+8²)=10 V.",
    methodSteps: [
      "Choisis une seule convention : amplitudes partout ou valeurs efficaces partout.",
      "Trace l’axe du courant et place UR horizontalement.",
      "Place UL vers le haut et UC vers le bas à la même échelle.",
      "Calcule la composante verticale UL−UC.",
      "Trace U depuis l’origine et contrôle le triangle rectangle.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Construction",
      title: "Le triangle de Fresnel",
      instruction: "Sélectionne les repères pour suivre la somme des tensions.",
      observation: "La tension totale est l’hypoténuse construite avec UR et UL−UC.",
      viewBox: "0 0 640 330",
      caption: "Diagramme original redessiné d’après les constructions du document.",
      shapes: [
        { shape: "line", x1: 80, y1: 250, x2: 590, y2: 250, tone: "muted" },
        { shape: "line", x1: 120, y1: 250, x2: 410, y2: 250, tone: "outline" },
        { shape: "line", x1: 410, y1: 250, x2: 410, y2: 70, tone: "accent" },
        { shape: "line", x1: 410, y1: 70, x2: 410, y2: 145, tone: "soft" },
        { shape: "line", x1: 120, y1: 250, x2: 410, y2: 145, tone: "fill" },
        { shape: "text", x: 265, y: 275, content: "UR = RI", anchor: "middle" },
        { shape: "text", x: 435, y: 105, content: "UL", anchor: "start" },
        { shape: "text", x: 435, y: 185, content: "UC", anchor: "start" },
        { shape: "text", x: 250, y: 180, content: "U", anchor: "middle" },
      ],
      hotspots: [
        { id: "current-axis", number: 1, label: "Axe du courant", detail: "L’axe horizontal est la référence de phase : φi=0.", x: 555, y: 250 },
        { id: "resistive", number: 2, label: "UR", detail: "UR=RI est horizontal et en phase avec i.", x: 260, y: 235 },
        { id: "reactive", number: 3, label: "UL−UC", detail: "La différence verticale est positive si le circuit est inductif, négative s’il est capacitif.", x: 390, y: 145 },
        { id: "total", number: 4, label: "U", detail: "Le vecteur résultant relie l’origine à l’extrémité de la somme.", x: 250, y: 190 },
      ],
    },
    questions: [
      choice("L’origine des phases choisie dans le document est…", ["l’axe du courant", "l’axe de uC", "l’axe vertical", "la fréquence propre"], 0, "Le courant est la référence.", "3.2.2 Construction", 1),
      choice("Le vecteur UR est placé…", ["horizontalement vers la droite", "verticalement vers le haut", "verticalement vers le bas", "à 45° toujours"], 0, "uR est en phase avec i.", "3.2.2 Construction", 1),
      choice("Le vecteur UL est placé…", ["vers le haut", "vers le bas", "sur UR", "dans le sens opposé au courant"], 0, "uL est en avance de π/2.", "3.2.2 Construction", 1),
      choice("Le vecteur UC est placé…", ["vers le bas", "vers le haut", "horizontalement", "à zéro"], 0, "uC est en retard de π/2.", "3.2.2 Construction", 1),
      choice("La composante verticale résultante vaut…", ["UL−UC", "UL+UC toujours", "UR−UL", "U/I"], 0, "UL et UC sont de sens opposés.", "Diagramme de Fresnel", 1),
      choice("La tension U est…", ["la somme vectorielle des trois tensions", "la somme arithmétique UR+UL+UC", "toujours égale à UR", "toujours nulle"], 0, "Les phases imposent une addition vectorielle.", "Diagramme de Fresnel", 1),
      short("Avec UR=6 V, UL=9 V et UC=1 V, calcule la composante verticale.", ["8", "8 V"], "UL−UC=9−1=8 V.", "Exemple de construction", 1),
      short("Avec UR=6 V et UL−UC=8 V, calcule U.", ["10", "10 V"], "U=√(6²+8²)=10 V.", "Triangle de Fresnel", 2),
      choice("Si UL=UC, le vecteur U est…", ["confondu avec UR", "vertical", "nul", "opposé à UR"], 0, "La composante réactive s’annule.", "Cas résistif", 1),
      choice("Un diagramme réalisé avec UR efficace et UL maximale serait…", ["incohérent", "toujours exact", "une mesure d’énergie", "une résonance"], 0, "Toutes les normes doivent suivre la même convention.", "Méthode", 1),
      short("À l’échelle 1 cm pour 1 V, quelle longueur représente UR=5,8 V ?", ["5.8", "5,8", "5.8 cm", "5,8 cm"], "La longueur vaut 5,8 cm.", "Situation d’évaluation", 1),
      short("À l’échelle 1 cm pour 1 V, UL=9 V et UC=0,9 V donnent quelle longueur verticale nette ?", ["8.1", "8,1", "8.1 cm", "8,1 cm"], "9−0,9=8,1 cm.", "Situation d’évaluation", 2),
    ],
  },
  {
    id: "rlc-impedance-phase-nature",
    title: "Calculer l’impédance, la phase et la nature du circuit",
    summary: "Déduire Z, tanφ, cosφ et sinφ du triangle de Fresnel, puis reconnaître un comportement inductif, résistif ou capacitif.",
    pages: "5, 6 et 8",
    section: "3.3 Impédance, phase et nature ; exercice 3",
    durationMinutes: 24,
    xp: 95,
    body: String.raw`## Impédance du circuit série

Le triangle de Fresnel donne, avec $R_t=R+r$ :

$$U^2=(R_tI)^2+\left[\left(L\omega-\frac1{C\omega}\right)I\right]^2$$

Comme $Z=U/I$ :

$$\boxed{Z=\sqrt{R_t^2+\left(L\omega-\frac1{C\omega}\right)^2}}$$

Si la résistance de la bobine est négligeable, $R_t=R$.

## Relations trigonométriques

En notant $X=L\omega-1/(C\omega)$ :

$$\boxed{\tan\varphi=\frac{X}{R_t}},\qquad \boxed{\cos\varphi=\frac{R_t}{Z}},\qquad \boxed{\sin\varphi=\frac{X}{Z}}$$

## Nature selon le signe de $\varphi$

| Condition | Phase | Nature | Relation temporelle |
|---|---:|---|---|
| $L\omega>1/(C\omega)$ | $\varphi>0$ | inductive | $u$ en avance sur $i$ |
| $L\omega=1/(C\omega)$ | $\varphi=0$ | résistive | $u$ et $i$ en phase |
| $L\omega<1/(C\omega)$ | $\varphi<0$ | capacitive | $u$ en retard sur $i$ |

L’égalité centrale annonce la **résonance d’intensité**, qui sera approfondie dans la leçon suivante. Ici, elle sert à classer le comportement du circuit.

> **Astuce mémoire.** $X_L-X_C$ décide du signe : L positif et en haut ; C négatif et en bas.

## Exercice 3 corrigé

1. « L’impédance dépend de la pulsation » : **vrai**.
2. « L’impédance RLC se mesure avec un ohmmètre » : **faux**.
3. À pulsation fixée, faire varier $U$ fait varier $I=U/Z$ : **vrai**.
4. La tension secteur annoncée à 220 V est une valeur efficace : **vrai**.

La grille imprimée place par erreur la croix de l’affirmation 2 dans la colonne « Vrai ».`,
    keyPoint: "Z=√(Rt²+(Lω−1/(Cω))²) et le signe de Lω−1/(Cω) donne la nature inductive, résistive ou capacitive.",
    example: "Si Rt=30 Ω, XL=50 Ω et XC=10 Ω, Z=50 Ω, tanφ=4/3 et le circuit est inductif.",
    methodSteps: [
      "Calcule Rt=R+r si la bobine n’est pas idéale.",
      "Calcule XL=Lω et XC=1/(Cω).",
      "Forme la réactance X=XL−XC.",
      "Calcule Z=√(Rt²+X²).",
      "Utilise le signe de X pour la nature et les rapports trigonométriques pour φ.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Décision",
      title: "Quelle est la nature du circuit ?",
      instruction: "Compare XL et XC puis sélectionne le cas correspondant.",
      observation: "Le signe de la réactance X=XL−XC suffit pour prévoir le signe de la phase.",
      rootLabel: "Comparer XL=Lω et XC=1/(Cω)",
      rootDetail: "Cette comparaison fixe le sens de la composante verticale du diagramme de Fresnel.",
      nodes: [
        { id: "inductive", label: "XL>XC", role: "φ>0", detail: "Le circuit est inductif : u est en avance sur i.", group: "Nature" },
        { id: "resistive", label: "XL=XC", role: "φ=0", detail: "Le circuit est résistif : u et i sont en phase et Z=Rt.", group: "Nature" },
        { id: "capacitive", label: "XL<XC", role: "φ<0", detail: "Le circuit est capacitif : u est en retard sur i.", group: "Nature" },
      ],
    },
    questions: [
      choice("L’expression générale de Z est…", ["√(Rt²+(Lω−1/(Cω))²)", "Rt+L+C", "Lω−1/(Cω)", "U×I"], 0, "Elle vient du triangle rectangle de Fresnel.", "3.3.1 Impédance", 1),
      choice("Si la bobine a une résistance r non négligeable, cosφ vaut…", ["(R+r)/Z", "R/Z toujours", "Z/(R+r)", "0"], 0, "Le côté horizontal du triangle vaut (R+r)I.", "Remarque bobine réelle", 1),
      choice("tanφ vaut…", ["(XL−XC)/Rt", "Rt/(XL−XC)", "Z/Rt", "XL+XC"], 0, "C’est le rapport vertical/horizontal.", "3.3.2 Phase", 1),
      choice("Si XL>XC, le circuit est…", ["inductif", "capacitif", "continu", "ouvert"], 0, "La réactance est positive.", "3.3.3 Nature", 1),
      choice("Si XL<XC, u est…", ["en retard sur i", "en avance sur i", "toujours nulle", "de fréquence double"], 0, "Le circuit est capacitif et φ<0.", "3.3.3 Nature", 1),
      choice("Si XL=XC, alors…", ["u et i sont en phase", "u est en retard de π/2", "Z est infinie", "I est nulle"], 0, "La composante verticale s’annule.", "Cas résistif", 1),
      short("Calcule X=XL−XC pour XL=50 Ω et XC=10 Ω.", ["40", "40 Ω"], "X=50−10=40 Ω.", "Application", 1),
      short("Calcule Z pour Rt=30 Ω et X=40 Ω.", ["50", "50 Ω"], "Z=√(30²+40²)=50 Ω.", "Application", 2),
      short("Calcule cosφ pour Rt=30 Ω et Z=50 Ω.", ["0.6", "0,6"], "cosφ=30/50=0,6.", "Application", 1),
      choice("Exercice 3 : l’impédance RLC se mesure directement à l’ohmmètre.", ["Faux", "Vrai"], 0, "On la détermine à la fréquence choisie par Z=U/I.", "Exercice 3, affirmation 2", 1),
      choice("Exercice 3 : 220 V pour le secteur désigne…", ["une valeur efficace", "une amplitude maximale", "une phase", "une impédance"], 0, "La valeur maximale correspondante est environ 311 V.", "Exercice 3, affirmation 4", 1),
      choice("À pulsation fixée, si U augmente et Z reste constante, I…", ["augmente", "diminue forcément", "reste toujours nulle", "change d’unité"], 0, "I=U/Z.", "Exercice 3, affirmation 3", 1),
      short("Avec R=40 Ω et Z=100 Ω, calcule |X|.", ["91.65", "91,65", "91.7", "91,7", "91.65 Ω", "91,65 Ω"], "|X|=√(100²−40²)≈91,65 Ω.", "Préparation exercice 5", 2),
    ],
    corrections: [
      "Pages 5 et 6 : lorsque la résistance interne r de la bobine n’est pas négligeable, les relations de phase utilisent Rt=R+r : tanφ=(XL−XC)/(R+r) et cosφ=(R+r)/Z.",
      "Page 8 : l’affirmation 2 de l’exercice 3 est fausse ; un ohmmètre ne mesure pas l’impédance RLC à une pulsation choisie. La croix imprimée dans la colonne Vrai est erronée.",
    ],
  },
  {
    id: "rlc-experimental-impedance",
    title: "Déterminer expérimentalement l’impédance",
    summary: "Exploiter les droites U=f(I), définir Z=U/I et comprendre sa dépendance à la fréquence.",
    pages: "2 à 3",
    section: "2.1 Détermination expérimentale de l’impédance",
    durationMinutes: 20,
    xp: 55,
    body: String.raw`## Le montage de mesure

Le résistor, la bobine et le condensateur sont associés **en série** avec un GBF. Un ampèremètre mesure l’intensité efficace $I$ et un voltmètre la tension efficace $U$ aux bornes de l’ensemble.

À fréquence fixée, le tableau du document donne des points alignés avec l’origine : $U$ est proportionnelle à $I$.

$$\boxed{U=ZI}\qquad\Longrightarrow\qquad\boxed{Z=\frac UI}$$

$Z$ est l’**impédance** du dipôle à cette fréquence ; elle s’exprime en ohms.

## Exploiter les deux séries de mesures

| $U$ (V) | 5 | 10 | 15 | 20 |
|---:|---:|---:|---:|---:|
| $I$ à 100 Hz (A) | 0,07 | 0,13 | 0,20 | 0,27 |
| $I$ à 700 Hz (A) | 0,15 | 0,30 | 0,45 | 0,60 |

- à $100$ Hz, la pente moyenne de la droite vaut environ $75\ \Omega$ ;
- à $700$ Hz, $Z=5/0{,}15=33{,}3\ \Omega$.

L’impédance dépend donc de la fréquence. Une même tension peut produire des courants très différents selon $f$.

## Ce que mesure un ohmmètre

Un ohmmètre ordinaire mesure une **résistance en courant continu**. Il ne donne pas directement l’impédance RLC à une pulsation choisie. Pour mesurer $Z$, on mesure $U$ et $I$ à cette fréquence, puis on calcule $U/I$.

> **Erreur fréquente.** Ne calcule jamais $Z=I/U$ : l’unité ne serait plus l’ohm.`,
    keyPoint: "À fréquence fixée, l’impédance est la pente de U=f(I) : Z=U/I, en ohms.",
    example: "À 700 Hz, U=15 V et I=0,45 A donnent Z=15/0,45=33,3 Ω.",
    methodSteps: [
      "Fixe la fréquence du GBF.",
      "Relève plusieurs couples (I,U) en valeurs efficaces.",
      "Vérifie que la droite U=f(I) passe par l’origine.",
      "Calcule sa pente Z=ΔU/ΔI ou le rapport U/I.",
      "Recommence à une autre fréquence pour comparer les impédances.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mesures",
      title: "Droite U=f(I) à 100 Hz",
      instruction: "Déplace le point sur les mesures du document.",
      observation: "Les légers écarts viennent des arrondis expérimentaux ; la pente est proche de 75 Ω.",
      formula: "U ≈ 75 I",
      formulaTex: "U\\approx75I",
      rule: { kind: "samples", points: [[0, 0], [0.07, 5], [0.13, 10], [0.2, 15], [0.27, 20]] },
      window: { xMin: 0, xMax: 0.3, yMin: 0, yMax: 22 },
      marker: { min: 0, max: 0.27, step: 0.01, initial: 0.2 },
    },
    questions: [
      choice("À fréquence fixée, le graphe U=f(I) est…", ["une droite passant par l’origine", "une parabole", "une hyperbole", "une droite horizontale"], 0, "Les mesures montrent U proportionnelle à I.", "2.1.2 Exploitation", 1),
      choice("L’impédance se calcule par…", ["Z=U/I", "Z=I/U", "Z=UI", "Z=U+I"], 0, "U=ZI, donc Z=U/I.", "2.1.2 Exploitation", 1),
      choice("L’unité de Z est…", ["l’ohm", "le farad", "le henry", "le watt"], 0, "V/A=Ω.", "2.1.2 Exploitation", 1),
      choice("Un ohmmètre ordinaire fournit directement Z à 700 Hz.", ["Faux", "Vrai"], 0, "Il mesure surtout la résistance en continu, pas l’impédance à une fréquence imposée.", "Exercice 3, affirmation 2", 1),
      choice("Si U est doublée à fréquence fixée, I est approximativement…", ["doublée", "divisée par deux", "inchangée", "nulle"], 0, "I=U/Z et Z reste fixe à fréquence donnée.", "2.1.2 Exploitation", 1),
      short("Calcule Z pour U=5 V et I=0,15 A.", ["33.3", "33,3", "33.33", "33,33", "33.3 Ω", "33,3 Ω"], "Z=5/0,15≈33,3 Ω.", "Tableau, 700 Hz", 2),
      short("Calcule Z pour U=15 V et I=0,20 A.", ["75", "75 Ω"], "Z=15/0,20=75 Ω.", "Tableau, 100 Hz", 2),
      short("Calcule Z pour U=20 V et I=0,60 A.", ["33.3", "33,3", "33.33", "33,33", "33.3 Ω", "33,3 Ω"], "Z=20/0,60≈33,3 Ω.", "Tableau, 700 Hz", 2),
      choice("Dans le tableau, la plus faible impédance est obtenue à…", ["700 Hz", "100 Hz", "0 Hz", "les deux sont identiques"], 0, "Environ 33,3 Ω à 700 Hz contre environ 75 Ω à 100 Hz.", "Tableau de mesures", 1),
      choice("Le rapport U/I dépend ici…", ["de la fréquence", "uniquement de U", "uniquement de I", "du temps d’observation seulement"], 0, "Les deux droites ont des pentes différentes.", "Graphes U=f(I)", 1),
      short("Pour Z=75 Ω et U=12 V, calcule I.", ["0.16", "0,16", "0.16 A", "0,16 A", "160 mA"], "I=U/Z=12/75=0,16 A.", "Application de Z=U/I", 2),
      choice("La pente d’un graphe U en ordonnée et I en abscisse vaut…", ["Z", "1/Z", "R²", "f"], 0, "La pente ΔU/ΔI a l’unité V/A=Ω.", "Graphes U=f(I)", 1),
    ],
  },
  {
    id: "oscilloscope-phase-shift",
    title: "Lire un déphasage à l’oscilloscope",
    summary: "Relier le décalage temporel à la phase de la tension par rapport au courant et déterminer son signe.",
    pages: "3 à 4",
    section: "2.2 Visualisation à l’oscilloscope ; activité d’application",
    durationMinutes: 22,
    xp: 65,
    body: String.raw`## Visualiser simultanément $u$ et $i$

La voie $Y_A$ affiche la tension $u$ aux bornes du GBF. La voie $Y_B$ affiche $u_R=Ri$, qui est **en phase avec le courant**. Comparer $u$ et $u_R$ revient donc à comparer $u$ et $i$.

En régime sinusoïdal forcé, le GBF impose sa pulsation :

$$i(t)=I_m\cos(\omega t),\qquad u(t)=U_m\cos(\omega t+\varphi)$$

Les deux signaux ont la même période, mais pas nécessairement la même phase.

## Valeur du déphasage

Si $\tau$ est le décalage temporel et $T$ la période :

$$\boxed{|\varphi_{u/i}|=2\pi\frac{\tau}{T}}$$

Sur une grille, les sensibilités verticales n’interviennent pas :

$$|\varphi|=2\pi\frac{\text{nombre de divisions du décalage}}{\text{nombre de divisions d’une période}}$$

## Choisir le signe

- si $u$ atteint un maximum **avant** $i$, $u$ est en avance et $\varphi_{u/i}>0$ ;
- si $u$ atteint un maximum **après** $i$, $u$ est en retard et $\varphi_{u/i}<0$ ;
- si les maxima coïncident, $\varphi_{u/i}=0$.

> **Astuce mémoire.** Valeur absolue avec les divisions ; signe avec le signal qui arrive le premier.

## Correction de l’activité

Le document donne :

$$u=15\cos(314t+0{,}5),\qquad i=40\cos(\omega t)\ \text{mA}$$

On lit $\omega=314$ rad·s$^{-1}$ et :

$$Z=\frac{U_m}{I_m}=\frac{15}{0{,}040}=375\ \Omega$$

La phase de $u$ par rapport à $i$ est **$+0{,}5$ rad**, car le signe devant $0{,}5$ est positif. La correction imprimée $-0{,}5$ rad inverse ce signe.

Le premier oscillogramme du document montre également la voie $Y_A$ en avance sur $Y_B$ ; son commentaire textuel affirme l’inverse. La méthode ci-dessus permet de trancher sans mémoriser une légende erronée.`,
    keyPoint: "|φu/i|=2πτ/T ; u en avance sur i donne φ>0, u en retard donne φ<0.",
    example: "Un décalage de 2 divisions pour une période de 8 divisions donne |φ|=π/2. Si u arrive d’abord, φ=+π/2.",
    methodSteps: [
      "Identifie la voie de u et la voie de uR=Ri.",
      "Compte les divisions d’une période T.",
      "Compte les divisions du décalage τ entre deux points homologues.",
      "Calcule |φ|=2πτ/T.",
      "Observe quel signal arrive en premier pour choisir le signe.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Oscillogramme",
      title: "Deux sinusoïdes déphasées",
      instruction: "Sélectionne les repères pour lire période, décalage et signe.",
      observation: "Le signal u bleu atteint son maximum avant uR, donc la tension est en avance sur le courant.",
      viewBox: "0 0 620 300",
      caption: "Oscillogramme original redessiné d’après la figure du document.",
      shapes: [
        { shape: "line", x1: 50, y1: 150, x2: 580, y2: 150, tone: "muted" },
        { shape: "line", x1: 310, y1: 30, x2: 310, y2: 270, tone: "muted" },
        { shape: "path", d: "M50 150 C85 35 120 35 155 150 C190 265 225 265 260 150 C295 35 330 35 365 150 C400 265 435 265 470 150 C505 35 540 35 575 150", tone: "accent" },
        { shape: "path", d: "M50 235 C85 215 120 105 155 65 C190 25 225 105 260 215 C295 255 330 215 365 105 C400 25 435 65 470 175 C505 255 540 215 575 105", tone: "soft" },
        { shape: "text", x: 90, y: 55, content: "u", anchor: "middle" },
        { shape: "text", x: 180, y: 55, content: "uR ∝ i", anchor: "middle" },
      ],
      hotspots: [
        { id: "period", number: 1, label: "Période", detail: "Mesure l’écart horizontal entre deux maxima successifs du même signal.", x: 260, y: 45 },
        { id: "delay", number: 2, label: "Décalage", detail: "Mesure l’écart entre deux maxima homologues de u et de uR.", x: 155, y: 115 },
        { id: "sign", number: 3, label: "Signe", detail: "Ici u atteint son maximum avant uR : φu/i est positif.", x: 105, y: 150 },
      ],
    },
    questions: [
      choice("La voie mesurant uR=Ri représente aussi la phase…", ["du courant i", "de la capacité C", "de l’impédance Z", "de la fréquence f"], 0, "Dans une résistance, uR et i sont en phase.", "2.2.1 Expérience", 1),
      choice("En régime forcé, u et i ont…", ["la même fréquence", "toujours la même phase", "toujours la même amplitude", "des périodes différentes"], 0, "Le générateur impose une pulsation commune.", "2.2.2 Conclusion", 1),
      choice("La valeur absolue du déphasage vaut…", ["2πτ/T", "τ/T", "2πT/τ", "T−τ"], 0, "Une période T correspond à 2π radians.", "2.2.3 Détermination graphique", 1),
      short("T occupe 8 divisions et τ en occupe 2. Calcule |φ|.", ["π/2", "pi/2", "1.57", "1,57", "1.57 rad", "1,57 rad"], "|φ|=2π×2/8=π/2.", "Exemple graphique", 2),
      choice("Si u atteint son maximum avant i, alors…", ["φu/i>0", "φu/i<0", "φu/i=0", "on ne peut rien conclure"], 0, "u est en avance sur i.", "Signe de la phase", 1),
      choice("Si u atteint son maximum après i, le circuit observé donne…", ["φu/i<0", "φu/i>0", "φu/i=π toujours", "Z=0"], 0, "u est alors en retard.", "Signe de la phase", 1),
      short("Dans u=15cos(314t+0,5), donne φu/i si i=Im cos(314t).", ["0.5", "0,5", "+0.5", "+0,5", "0.5 rad", "0,5 rad"], "La phase est +0,5 rad ; le document imprime le signe opposé.", "Activité d’application corrigée", 2),
      short("Calcule Z si Um=15 V et Im=40 mA.", ["375", "375 Ω"], "40 mA=0,040 A et Z=15/0,040=375 Ω.", "Activité d’application", 2),
      short("Calcule T pour ω=314 rad/s.", ["0.02", "0,02", "20 ms"], "T=2π/314≈0,0200 s.", "Activité d’application", 1),
      choice("Les sensibilités verticales sont nécessaires pour calculer τ/T.", ["Faux", "Vrai"], 0, "Le déphasage dépend uniquement des distances horizontales.", "Lecture graphique", 1),
      choice("Le document affirme −0,5 rad pour l’activité. Cette valeur est…", ["une erreur de signe", "exacte", "une erreur d’unité uniquement", "une fréquence"], 0, "L’expression contient +0,5.", "Correction source", 1),
      short("Un retard de 1 division sur une période de 10 divisions correspond à |φ| en radians.", ["π/5", "pi/5", "0.628", "0,628", "0.63", "0,63"], "2π×1/10=π/5≈0,628 rad.", "Lecture d’oscillogramme", 2),
    ],
    corrections: [
      "Page 3 : l’oscillogramme étiquette YA comme la tension u et YB comme uR=Ri ; YA atteint son maximum avant YB, donc la figure donne φu/i>0, contrairement au commentaire imprimé.",
      "Page 4 : pour u=15cos(314t+0,5) et i=40cos(ωt), la phase de u par rapport à i est +0,5 rad, et non −0,5 rad.",
    ],
  },
];

const levelOrder = [
  "sinusoidal-current-effective-values",
  "rlc-experimental-impedance",
  "oscilloscope-phase-shift",
  "rlc-series-dipoles-equation",
  "fresnel-vector-construction",
  "rlc-impedance-phase-nature",
  "rlc-official-fresnel-mission",
  "rlc-oscilloscope-current-mission",
  "rc-capacitance-data-audit-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau RLC forcé introuvable : " + id);
  return officialLevel(index, level);
});

export const rlcForcedSinusoidalPath: LearningPath = {
  id: "terminale-cd-rlc-forced-sinusoidal",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminales C et D • Cours de Physique-Chimie en ligne",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/15950-tle-d-phy-l13-circuit-rlc-en-regime-sinusoidal-force",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 13,
  title: "Circuit RLC en régime sinusoïdal forcé",
  description: "Caractériser les signaux sinusoïdaux, mesurer l’impédance et le déphasage, construire Fresnel puis résoudre les situations expérimentales du circuit RLC série.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Lire amplitude, valeur efficace, pulsation, période, fréquence et phase d’un signal sinusoïdal.",
    "Déterminer expérimentalement une impédance et un déphasage.",
    "Établir la loi des mailles et les impédances de R, L et C.",
    "Construire et exploiter un diagramme de Fresnel.",
    "Calculer Z, tanφ, cosφ et sinφ puis identifier la nature du circuit.",
    "Résoudre les cinq exercices et la situation d’évaluation du document en auditant les données graphiques.",
  ],
  modules: [{
    id: "rlc-forced-sinusoidal-mastery",
    title: "Maîtriser le circuit RLC forcé",
    description: "Des caractéristiques du courant alternatif aux missions expérimentales, une progression complète fondée sur les 11 pages du document ivoirien.",
    lessons: builtLevels,
  }],
};

export const rlcForcedSinusoidalPaths: LearningPath[] = [rlcForcedSinusoidalPath];
