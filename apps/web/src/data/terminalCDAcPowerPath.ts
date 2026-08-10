import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 15 de Physique en Terminale C et leçon 13 en Terminale D.
const sourceDocument = "Tle D PHY L15 Puissance en courant alternatif by Tehua.pdf";

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
      introduction: "Distingue toujours les valeurs instantanées des valeurs efficaces, puis vérifie la grandeur et son unité avant tout calcul.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : p(t) varie, P est une moyenne en watts, S=UI est en voltampères et cos φ n’a pas d’unité.",
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

const instantaneousPowerPoints: Array<[number, number]> = Array.from(
  { length: 73 },
  (_, index): [number, number] => {
    const angleDegrees = index * 5;
    const angleRadians = angleDegrees * Math.PI / 180;
    const power = 24 * (Math.cos(2 * angleRadians + Math.PI / 3) + 0.5);
    return [angleDegrees, Number(power.toFixed(4))];
  },
);

const rlcPowerAtFrequency = (frequency: number) => {
  const omega = 2 * Math.PI * frequency;
  const resistance = 500;
  const reactance = omega - 1 / (4e-6 * omega);
  return resistance * 220 ** 2 / (resistance ** 2 + reactance ** 2);
};

const rlcPowerPoints: Array<[number, number]> = [
  20, 30, 40, 49.1816, 60, 70, 79.5775, 90, 100, 110, 120, 128.7591, 140, 160, 180,
].map((frequency): [number, number] => [frequency, Number(rlcPowerAtFrequency(frequency).toFixed(4))]);

const transportLossPoints: Array<[number, number]> = [1, 2, 5, 10, 20, 50, 100, 200]
  .map((voltageKilovolts): [number, number] => {
    const current = 10_000 / (voltageKilovolts * 1_000 * 0.9);
    return [voltageKilovolts, Number((2 * current ** 2).toFixed(6))];
  });

const exercise4Reactance = 0.02 * 2 * Math.PI * 400 - 1 / (5e-6 * 2 * Math.PI * 400);
const exercise4PowerPoints: Array<[number, number]> = [1, 3, 6, 10, 15, 20, 25, 29.312, 35, 45, 60, 80, 100]
  .map((resistance): [number, number] => [
    resistance,
    Number((resistance * 24 ** 2 / (resistance ** 2 + exercise4Reactance ** 2)).toFixed(4)),
  ]);

const levels: LevelSeed[] = [
  {
    id: "ac-power-instantaneous",
    title: "Construire la puissance instantanée",
    summary: "Multiplier la tension par le courant, transformer le produit de cosinus et comprendre pourquoi la puissance instantanée peut changer de signe.",
    pages: "1",
    section: "II.1 Puissance instantanée",
    durationMinutes: 22,
    xp: 45,
    kind: "graph",
    body: String.raw`## Partir des grandeurs instantanées

Un dipôle reçoit à chaque instant une tension $u(t)$ et un courant $i(t)$. Sa puissance instantanée est :

$$\boxed{p(t)=u(t)i(t)}$$

Le support considère deux signaux sinusoïdaux de même pulsation $\omega$ :

$$i(t)=I_m\cos(\omega t),\qquad u(t)=U_m\cos(\omega t+\varphi_{u/i})$$

$\varphi_{u/i}$ est la phase de la tension par rapport au courant. Les valeurs maximales et efficaces sont liées par :

$$U_m=\sqrt2\,U,\qquad I_m=\sqrt2\,I$$

## Transformer le produit

On utilise l’identité :

$$\cos a\cos b=\frac12\big[\cos(a+b)+\cos(a-b)\big]$$

Avec $a=\omega t$ et $b=\omega t+\varphi_{u/i}$ :

$$\cos(\omega t)\cos(\omega t+\varphi_{u/i})
=\frac12\left[\cos(2\omega t+\varphi_{u/i})+\cos\varphi_{u/i}\right]$$

Comme $U_mI_m/2=UI$, on obtient :

$$\boxed{p(t)=UI\left[\cos(2\omega t+\varphi_{u/i})+\cos\varphi_{u/i}\right]}$$

La puissance comporte donc deux parties :

- un terme $UI\cos\varphi_{u/i}$ qui ne dépend pas du temps ;
- un terme oscillant $UI\cos(2\omega t+\varphi_{u/i})$, de fréquence double.

## Lire le signe de $p(t)$

- $p(t)>0$ : le dipôle reçoit de l’énergie ;
- $p(t)<0$ : le dipôle restitue momentanément de l’énergie au générateur ;
- la moyenne sur une période ne dépend que du terme constant.

Dans l’interaction, $U=12$ V, $I=2$ A et $\varphi=60^\circ$. La puissance apparente vaut $UI=24$ VA et la moyenne vaut $24\cos60^\circ=12$ W. La courbe oscille entre $-12$ W et $36$ W autour de $12$ W.

> **Correction de notation.** Le document emploie une majuscule $P$ pour la puissance instantanée. On réserve ici $p(t)$ à l’instantané et $P$ à la puissance moyenne, ce qui évite toute ambiguïté.` ,
    keyPoint: "p(t)=UI[cos(2ωt+φ)+cosφ] ; le terme oscillant a une fréquence double et sa moyenne est nulle.",
    example: "Pour U=12 V, I=2 A et φ=60°, la puissance moyenne vaut 12×2×0,5=12 W.",
    methodSteps: [
      "Écris p(t)=u(t)i(t).",
      "Remplace u(t) et i(t) par leurs formes sinusoïdales.",
      "Applique l’identité produit-somme des cosinus.",
      "Utilise UmIm/2=UI pour revenir aux valeurs efficaces.",
      "Sépare le terme constant du terme oscillant.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Signal de puissance",
      title: "Puissance instantanée pour φ=60°",
      instruction: "Déplace le point sur une période du courant et observe les portions positives et négatives.",
      observation: "La puissance oscille à fréquence double autour de sa valeur moyenne P=12 W.",
      formula: "p = 24[cos(2θ+60°)+0,5]",
      formulaTex: "p(\\theta)=24\\left[\\cos(2\\theta+60^\\circ)+0{,}5\\right]",
      rule: { kind: "samples", points: instantaneousPowerPoints },
      window: { xMin: 0, xMax: 360, yMin: -15, yMax: 40 },
      guides: [{ kind: "horizontal", value: 12, label: "P moyenne = 12 W" }],
      marker: { min: 0, max: 360, step: 5, initial: 0 },
    },
    questions: [
      choice("La puissance instantanée reçue par un dipôle vaut…", ["p(t)=u(t)i(t)", "p(t)=u(t)/i(t)", "p(t)=UI uniquement", "p(t)=R/i(t)"], 0, "La puissance instantanée est le produit des valeurs prises au même instant.", "II.1 Définition"),
      choice("La relation entre valeur maximale et valeur efficace est…", ["Um=√2 U", "Um=U/2", "Um=2πU", "Um=U²"], 0, "Pour une sinusoïde, la valeur maximale vaut √2 fois la valeur efficace.", "Rappels sinusoïdaux"),
      choice("Le produit cos a cos b se transforme avec un facteur…", ["1/2", "2", "π", "−1"], 0, "L’identité produit-somme porte le facteur 1/2.", "Identité trigonométrique"),
      choice("Dans p(t), le terme oscillant a pour pulsation…", ["2ω", "ω/2", "ω", "0"], 0, "Le produit de deux sinusoïdes de pulsation ω fait apparaître 2ω.", "Développement"),
      choice("La moyenne de cos(2ωt+φ) sur une période vaut…", ["0", "1", "cos φ", "2"], 0, "Une sinusoïde complète possède une moyenne nulle.", "Moyenne temporelle"),
      choice("Si p(t)<0, le dipôle…", ["restitue momentanément de l’énergie", "consomme une énergie infinie", "n’est plus alimenté", "change d’unité"], 0, "Une puissance reçue négative traduit une restitution instantanée.", "Interprétation énergétique"),
      short("Calcule Um pour U=12 V, au centième près.", ["16.97", "16,97", "16.97 V", "16,97 V", "12√2", "12sqrt2"], "Um=12√2≈16,97 V.", "Valeur maximale", 2),
      short("Calcule Im pour I=2 A, au centième près.", ["2.83", "2,83", "2.83 A", "2,83 A", "2√2", "2sqrt2"], "Im=2√2≈2,83 A.", "Valeur maximale", 2),
      short("Pour U=12 V et I=2 A, calcule UI.", ["24", "24 VA", "24 V.A"], "UI=24 VA.", "Produit des valeurs efficaces"),
      short("Pour U=12 V, I=2 A et cosφ=0,5, calcule la puissance moyenne.", ["12", "12 W"], "P=UIcosφ=12×2×0,5=12 W.", "Terme constant", 2),
      choice("Pour l’exemple, p(t) oscille autour de…", ["12 W", "0 W", "24 W", "36 W"], 0, "La ligne moyenne de la courbe est P=12 W.", "Lecture de courbe"),
      choice("La notation la plus claire est…", ["p(t) pour l’instantanée et P pour la moyenne", "P pour toutes les grandeurs", "I pour la puissance", "Z pour l’énergie"], 0, "Elle distingue immédiatement les deux notions.", "Notation corrigée"),
    ],
    corrections: [
      "Page 1 : la puissance instantanée est notée p(t), tandis que P désigne la moyenne ; la source emploie P pour les deux grandeurs.",
      "Page 1 : l’identité intermédiaire est restaurée en cos(2ωt+φ), le premier cosinus imprimé perdant un facteur t dans sa mise en page.",
    ],
  },
  {
    id: "ac-power-average-apparent-energy",
    title: "Distinguer puissance moyenne, apparente et énergie",
    summary: "Relier P=UIcosφ, S=UI, le facteur de puissance, les pertes résistives et l’énergie consommée pendant une durée donnée.",
    pages: "1 à 2",
    section: "II.2 à II.5 Puissance moyenne, énergie et facteur de puissance",
    durationMinutes: 23,
    xp: 55,
    body: String.raw`## La puissance moyenne active

La moyenne du terme oscillant de $p(t)$ est nulle. La puissance moyenne reçue est donc :

$$\boxed{P=UI\cos\varphi_{u/i}}$$

Elle s’exprime en **watts** (W). C’est la puissance réellement transformée en chaleur, mouvement, lumière ou autre forme utile.

## La puissance apparente

Le produit des valeurs efficaces est :

$$\boxed{S=UI}$$

$S$ s’exprime en **voltampères** (VA). Elle mesure le dimensionnement électrique imposé à la source et aux conducteurs. Le facteur de puissance est :

$$\boxed{\cos\varphi_{u/i}=\frac{P}{S}=\frac{P}{UI}}$$

Pour un dipôle passif sinusoïdal, $0\leq\cos\varphi\leq1$, donc $P\leq S$ numériquement.

## Cas du circuit RLC série

Si $R_t$ représente **toutes** les résistances série, l’impédance vaut :

$$Z=\sqrt{R_t^2+\left(L\omega-\frac1{C\omega}\right)^2}$$

et :

$$\cos\varphi_{u/i}=\frac{R_t}{Z}$$

Ainsi :

$$\boxed{P=UI\cos\varphi=R_tI^2}$$

Une bobine idéale et un condensateur idéal ont une puissance **moyenne active nulle**. Ils peuvent néanmoins recevoir puis restituer de l’énergie au cours de chaque période : leur puissance instantanée n’est pas toujours nulle.

## Énergie sur une durée

Si la puissance moyenne reste constante pendant $\Delta t$ :

$$\boxed{E=P\Delta t=UI\Delta t\cos\varphi}$$

- avec $P$ en W et $\Delta t$ en s, $E$ est en joules ;
- avec $P$ en kW et $\Delta t$ en h, $E$ est en kWh.

## Exemple complet

Une installation fonctionne sous $U=230$ V, avec $I=2$ A et $\cos\varphi=0{,}80$ :

$$S=230\times2=460\ \text{VA}$$

$$P=460\times0{,}80=368\ \text{W}$$

En $3$ h, elle consomme :

$$E=0{,}368\times3=1{,}104\ \text{kWh}$$` ,
    keyPoint: "P=UIcosφ en W, S=UI en VA, cosφ=P/S et E=PΔt.",
    example: "Sous 230 V et 2 A avec cosφ=0,80 : S=460 VA, P=368 W et E=1,104 kWh en 3 h.",
    methodSteps: [
      "Identifie si l’on cherche une puissance instantanée, moyenne ou apparente.",
      "Calcule S=UI avec les valeurs efficaces.",
      "Utilise P=S cosφ ou cosφ=P/S.",
      "Dans un RLC série, emploie la résistance totale Rt dans P=RtI².",
      "Pour l’énergie, convertis la durée dans l’unité cohérente avec la puissance.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte des grandeurs",
      title: "Ne plus confondre P, S, cos φ et E",
      instruction: "Sélectionne chaque carte pour retrouver sa définition et son unité.",
      observation: "Le facteur de puissance relie la puissance active à la puissance apparente.",
      rootLabel: "Puissance en régime sinusoïdal",
      rootDetail: "Les valeurs efficaces U et I permettent de construire S, puis P grâce au facteur de puissance.",
      nodes: [
        { id: "instantaneous", label: "p(t)", role: "Puissance instantanée", detail: "p(t)=u(t)i(t), en watts ; elle peut être positive ou négative.", group: "Puissances" },
        { id: "active", label: "P", role: "Puissance moyenne", detail: "P=UIcosφ, en watts ; elle mesure l’énergie moyenne transformée.", group: "Puissances" },
        { id: "apparent", label: "S", role: "Puissance apparente", detail: "S=UI, en voltampères ; elle sert au dimensionnement de l’installation.", group: "Puissances" },
        { id: "factor", label: "cos φ", role: "Facteur de puissance", detail: "cosφ=P/S=P/(UI), sans unité, compris entre 0 et 1 pour le cadre étudié.", group: "Lien" },
        { id: "energy", label: "E", role: "Énergie consommée", detail: "E=PΔt ; joules si la durée est en secondes, kWh si P est en kW et la durée en heures.", group: "Énergie" },
      ],
    },
    questions: [
      choice("La puissance moyenne active s’écrit…", ["P=UIcosφ", "P=UI/cosφ", "P=U/I", "P=LCω"], 0, "C’est la moyenne de p(t).", "II.2 Puissance moyenne"),
      choice("L’unité de P est…", ["le watt", "le voltampère", "le joule par ohm", "le hertz"], 0, "La puissance active s’exprime en watts.", "II.2 Unité"),
      choice("La puissance apparente vaut…", ["S=UI", "S=PΔt", "S=RI²cosφ", "S=U²I"], 0, "S est le produit des valeurs efficaces.", "II.2 Puissance apparente"),
      choice("L’unité de S est…", ["le voltampère", "le watt-heure", "le radian", "le tesla"], 0, "S s’exprime en VA.", "II.2 Unité"),
      choice("Le facteur de puissance vaut…", ["P/S", "S/P toujours", "P×S", "R×L"], 0, "cosφ=P/(UI)=P/S.", "II.5 Facteur de puissance"),
      choice("Dans un RLC série, la résistance de P=RI² doit être…", ["la résistance totale dissipative", "seulement celle choisie arbitrairement", "la réactance capacitive", "nulle"], 0, "Toute résistance réelle qui chauffe participe à la puissance active.", "II.3 Dipôle RLC"),
      choice("Une bobine parfaite consomme en moyenne…", ["0 W", "UI W", "une puissance infinie", "1 VA"], 0, "Une inductance parfaite échange de l’énergie mais ne la dissipe pas en moyenne.", "II.3 Dipôles parfaits"),
      choice("Un condensateur parfait peut avoir une puissance instantanée non nulle.", ["Vrai", "Faux"], 0, "Il reçoit puis restitue de l’énergie même si sa moyenne active est nulle.", "Précision énergétique"),
      short("Avec U=230 V et I=2 A, calcule S.", ["460", "460 VA"], "S=230×2=460 VA.", "Exemple", 1),
      short("Avec S=460 VA et cosφ=0,80, calcule P.", ["368", "368 W"], "P=460×0,80=368 W.", "Exemple", 2),
      short("Calcule E en kWh pour P=0,368 kW pendant 3 h.", ["1.104", "1,104", "1.104 kWh", "1,104 kWh"], "E=0,368×3=1,104 kWh.", "Énergie", 2),
      short("Calcule E en joules pour P=100 W pendant 30 s.", ["3000", "3000 J", "3 kJ"], "E=100×30=3000 J.", "II.4 Énergie", 1),
      choice("Si cosφ=1, alors numériquement…", ["P=S", "P=0", "P>S", "S=0"], 0, "P=S cosφ, donc P=S.", "Facteur unité"),
      short("Une installation absorbe S=5 kVA et P=4 kW. Calcule cosφ.", ["0.8", "0,8"], "cosφ=4/5=0,8.", "Application", 2),
    ],
    corrections: [
      "Page 2 : l’affirmation sur la bobine et le condensateur parfaits concerne leur puissance moyenne active, pas leur puissance instantanée ni les échanges d’énergie.",
      "Page 2 : la résistance R de P=RI² est explicitée comme résistance totale dissipative du circuit.",
    ],
  },
  {
    id: "ac-power-factor-transport",
    title: "Réduire les pertes lors du transport",
    summary: "Montrer qu’une tension élevée et un bon facteur de puissance réduisent le courant, donc les pertes par effet Joule dans les lignes.",
    pages: "2 à 3 et 7 à 8",
    section: "II.5 à II.6 Transport du courant électrique et documentation",
    durationMinutes: 24,
    xp: 65,
    kind: "graph",
    body: String.raw`## La chaîne logique

Une ligne de résistance $R_{\text{ligne}}$ transporte une puissance active $P$ sous une tension efficace $U$ avec un facteur de puissance $\cos\varphi$ :

$$P=UI\cos\varphi$$

Le courant nécessaire est donc :

$$\boxed{I=\frac{P}{U\cos\varphi}}$$

La perte thermique dans la ligne vaut :

$$P_J=R_{\text{ligne}}I^2$$

En remplaçant $I$ :

$$\boxed{P_J=R_{\text{ligne}}\frac{P^2}{U^2\cos^2\varphi}}$$

À puissance transportée fixée :

- multiplier $U$ par $k$ divise le courant par $k$ ;
- les pertes Joule sont alors divisées par $k^2$ ;
- augmenter $\cos\varphi$ réduit également le courant et les pertes.

## Expérience des deux transformateurs

Le document représente un transformateur élévateur $12/220$ V, une résistance de ligne de $470\ \Omega$, puis un transformateur abaisseur $220/12$ V alimentant une lampe. Pour une même puissance utile, la section centrale fonctionne avec un courant beaucoup plus faible sous $220$ V que si le transport se faisait sous $12$ V.

Les transformateurs ne créent pas d’énergie : dans un modèle idéal, ils échangent tension contre courant à puissance presque conservée.

## Activité officielle : effet du facteur de puissance

Une installation doit recevoir $P=10$ kW sous $U=220$ V.

Pour $\cos\varphi=0{,}9$ :

$$I_{0,9}=\frac{10\,000}{220\times0{,}9}\approx\boxed{50{,}51\ \text{A}}$$

Pour $\cos\varphi=0{,}6$ :

$$I_{0,6}=\frac{10\,000}{220\times0{,}6}\approx\boxed{75{,}76\ \text{A}}$$

Le rapport des pertes est :

$$\frac{P_{J,0,6}}{P_{J,0,9}}=\left(\frac{75{,}76}{50{,}51}\right)^2=\left(\frac{0{,}9}{0{,}6}\right)^2=\boxed{2{,}25}$$

Le mauvais facteur de puissance impose donc ici **2,25 fois plus de pertes**.

## Lire la courbe interactive

La courbe prend $P=10$ kW, $\cos\varphi=0{,}9$ et $R_{\text{ligne}}=2\ \Omega$. La tension est exprimée en kilovolts. Elle matérialise la loi en $1/U^2$ : les pertes chutent très vite quand la tension augmente.

> **Contexte documentaire.** Les valeurs de tension et de longueur citées pages 7-8 décrivent le réseau français d’un article mis à jour en 2021. Elles illustrent le principe physique, mais ne constituent pas les caractéristiques du réseau ivoirien.` ,
    keyPoint: "À P fixée, I=P/(Ucosφ) et PJ=Rligne P²/(U²cos²φ) : haute tension et cosφ élevé réduisent les pertes.",
    example: "À 10 kW et 220 V, passer de cosφ=0,9 à 0,6 fait passer I de 50,51 A à 75,76 A et multiplie les pertes par 2,25.",
    methodSteps: [
      "Isole le courant dans P=UIcosφ.",
      "Calcule I avec la tension et le facteur de puissance donnés.",
      "Exprime les pertes par PJ=RligneI².",
      "Pour comparer deux cas, forme le rapport des carrés des courants.",
      "Conclue séparément sur l’effet de U et celui de cosφ.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Transport",
      title: "Pertes de ligne en fonction de la tension",
      instruction: "Déplace le point de 1 kV à 200 kV et observe la chute des pertes Joule.",
      observation: "À puissance et facteur de puissance fixés, les pertes sont inversement proportionnelles au carré de la tension.",
      formula: "PJ = 2[P/(U×0,9)]², P=10 kW",
      formulaTex: "P_J=2\\left(\\frac{10\\,000}{1000U_{\\mathrm{kV}}\\times0{,}9}\\right)^2",
      rule: { kind: "samples", points: transportLossPoints },
      window: { xMin: 0, xMax: 205, yMin: 0, yMax: 260 },
      marker: { min: 1, max: 200, step: 1, initial: 10 },
    },
    questions: [
      choice("À puissance active fixée, le courant vaut…", ["P/(Ucosφ)", "PUcosφ", "U/(Pcosφ)", "R/P²"], 0, "On isole I dans P=UIcosφ.", "II.6 Transport"),
      choice("Les pertes de ligne valent…", ["RligneI²", "UI", "Rligne/I²", "Lω"], 0, "Ce sont des pertes par effet Joule.", "II.6 Interprétation"),
      choice("À P et cosφ fixés, doubler U…", ["divise I par 2", "double I", "ne change pas I", "annule P"], 0, "I est inversement proportionnel à U.", "Relation I(U)"),
      choice("Dans le même cas, doubler U divise les pertes par…", ["4", "2", "8", "1"], 0, "PJ est proportionnelle à I² donc à 1/U².", "Pertes Joule"),
      choice("Améliorer le facteur de puissance vers 1…", ["réduit le courant pour une même P", "augmente forcément les pertes", "change le watt en VA", "rend U nulle"], 0, "I=P/(Ucosφ).", "II.5 Facteur de puissance"),
      short("Activité : calcule I pour 10 kW, 220 V et cosφ=0,9, au centième.", ["50.51", "50,51", "50.5", "50,5", "50.51 A", "50,51 A"], "I≈50,51 A.", "Activité d’application", 2),
      short("Activité : calcule I pour 10 kW, 220 V et cosφ=0,6, au centième.", ["75.76", "75,76", "75.8", "75,8", "75.76 A", "75,76 A"], "I≈75,76 A.", "Activité d’application", 2),
      short("Donne le rapport PJ(0,6)/PJ(0,9).", ["2.25", "2,25"], "Le rapport des carrés vaut (0,9/0,6)²=2,25.", "Comparaison des pertes", 2),
      choice("Le conducteur de 470 Ω du schéma représente…", ["la résistance des lignes", "la lampe seule", "une bobine idéale", "la Terre"], 0, "Il modélise les pertes du transport.", "II.6 Expérience"),
      choice("Le premier transformateur du schéma…", ["élève la tension", "annule le courant", "transforme le courant alternatif en continu", "mesure la puissance"], 0, "Il passe de 12 V à 220 V.", "II.6 Expérience"),
      choice("Le second transformateur…", ["abaisse la tension pour la lampe", "augmente encore la tension", "supprime la fréquence", "crée de l’énergie"], 0, "Il revient de 220 V à 12 V.", "II.6 Expérience"),
      short("À P fixée, si U est multipliée par 10, par combien PJ est-elle divisée ?", ["100", "par 100", "100 fois"], "Le carré de 10 vaut 100.", "Loi en 1/U²", 2),
      choice("Les valeurs 225–400 kV de la documentation concernent…", ["le contexte français cité", "toutes les lignes ivoiriennes", "un circuit de laboratoire 12 V", "une grandeur sans source"], 0, "Le texte documentaire est explicitement consacré au réseau français.", "Documentation pages 7-8"),
      short("Avec Rligne=2 Ω et I=5 A, calcule PJ.", ["50", "50 W"], "PJ=2×5²=50 W.", "Effet Joule", 1),
    ],
    corrections: [
      "Pages 7-8 : les chiffres du document annexe sont contextualisés comme données françaises de l’article cité, et non comme description du réseau ivoirien.",
      "Page 2 : le rôle idéal des transformateurs est explicité ; la puissance n’est pas créée lorsque la tension est élevée.",
    ],
  },
  {
    id: "ac-power-rlc-frequency",
    title: "Exprimer la puissance d’un circuit RLC",
    summary: "Établir P(ω), repérer la résonance comme maximum de puissance et corriger l’expression dimensionnellement fausse du support.",
    pages: "3 à 4",
    section: "Situation d’évaluation, questions 1 et 2.1",
    durationMinutes: 26,
    xp: 75,
    kind: "graph",
    body: String.raw`## Les données de la situation officielle

Le circuit série reçoit une tension efficace $U=220$ V et contient :

$$R=500\ \Omega,\qquad L=1\ \text{H},\qquad C=4{,}0\times10^{-6}\ \text{F}=4{,}0\ \mu\text{F}$$

Sa fréquence, donc sa pulsation $\omega=2\pi f$, peut varier.

## Repartir de l’impédance correcte

Les réactances ont toutes deux l’unité ohm :

$$X_L=L\omega,\qquad X_C=\frac1{C\omega}$$

L’impédance du circuit série est donc :

$$\boxed{Z=\sqrt{R^2+\left(L\omega-\frac1{C\omega}\right)^2}}$$

Le courant efficace vaut $I=U/Z$ et le facteur de puissance :

$$\cos\varphi_{u/i}=\frac RZ$$

La puissance moyenne devient :

$$P=UI\cos\varphi=U\times\frac UZ\times\frac RZ$$

$$\boxed{P(\omega)=\frac{RU^2}{R^2+\left(L\omega-\frac1{C\omega}\right)^2}}$$

## Où la puissance est-elle maximale ?

Le numérateur $RU^2$ est constant. La puissance est maximale quand le dénominateur est minimal, donc lorsque :

$$L\omega_0-\frac1{C\omega_0}=0$$

On retrouve la résonance d’intensité :

$$\boxed{\omega_0=\frac1{\sqrt{LC}}=500\ \text{rad·s}^{-1}}$$

$$\boxed{f_0=\frac{\omega_0}{2\pi}\approx79{,}58\ \text{Hz}}$$

À la résonance :

$$Z_0=R=500\ \Omega,\qquad I_0=\frac{220}{500}=\boxed{0{,}44\ \text{A}}$$

$$\cos\varphi_0=1,\qquad \varphi_{u/i}=0$$

$$\boxed{P_0=\frac{U^2}{R}=\frac{220^2}{500}=96{,}8\ \text{W}}$$

La courbe interactive montre le maximum de $P(f)$ à $79{,}58$ Hz. Les deux points où $P=P_0/2=48{,}4$ W prépareront le niveau suivant.

> **Contrôle d’unités.** $L\omega$ et $1/(C\omega)$ sont en ohms. Les termes $L\omega^2$ et $1/(C\omega^2)$ imprimés dans la source n’ont pas l’unité d’une impédance et ne peuvent donc pas être soustraits à $R$.` ,
    keyPoint: "P(ω)=RU²/[R²+(Lω−1/(Cω))²] ; elle est maximale à ω₀=1/√(LC), avec P₀=U²/R.",
    example: "Pour R=500 Ω, L=1 H, C=4 µF et U=220 V : f₀≈79,58 Hz, I₀=0,44 A et P₀=96,8 W.",
    methodSteps: [
      "Écris Z²=R²+(Lω−1/Cω)².",
      "Remplace I par U/Z et cosφ par R/Z dans P=UIcosφ.",
      "Réduis pour obtenir P=RU²/Z².",
      "Minimise Z² en annulant la réactance totale.",
      "Calcule ω₀, f₀, I₀ et P₀ avec leurs unités.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe de puissance",
      title: "Puissance active en fonction de la fréquence",
      instruction: "Déplace le point et repère le maximum à la résonance.",
      observation: "P atteint 96,8 W à 79,58 Hz et retombe à 48,4 W aux deux coupures.",
      formula: "P(f)=RU²/[R²+(2πLf−1/(2πCf))²]",
      formulaTex: "P(f)=\\frac{RU^2}{R^2+\\left(2\\pi Lf-\\frac1{2\\pi Cf}\\right)^2}",
      rule: { kind: "samples", points: rlcPowerPoints },
      window: { xMin: 15, xMax: 185, yMin: 0, yMax: 105 },
      guides: [
        { kind: "vertical", value: 79.5775, label: "f₀ = 79,58 Hz" },
        { kind: "horizontal", value: 48.4, label: "P₀/2 = 48,4 W" },
      ],
      marker: { min: 20, max: 180, step: 1, initial: 80 },
    },
    questions: [
      short("Convertis 4×10⁻⁶ F en µF.", ["4", "4 µF", "4 uF"], "4×10⁻⁶ F=4 µF.", "Données de la situation"),
      choice("La réactance inductive vaut…", ["Lω", "Lω²", "L/ω", "LCω"], 0, "XL=Lω, en ohms.", "Impédance corrigée"),
      choice("La réactance capacitive vaut…", ["1/(Cω)", "1/(Cω²)", "Cω", "R/C"], 0, "XC=1/(Cω), en ohms.", "Impédance corrigée"),
      choice("L’impédance correcte est…", ["√[R²+(Lω−1/Cω)²]", "R+Lω²−1/Cω²", "R²+LC", "U/I²"], 0, "Les composantes résistive et réactive se combinent quadratiquement.", "Situation 1.3"),
      choice("Dans le circuit, cosφ vaut…", ["R/Z", "Z/R", "L/C", "U/I"], 0, "Le facteur de puissance d’un RLC série est R/Z.", "Situation 1.2"),
      choice("Après substitution, P vaut…", ["RU²/Z²", "U²Z/R", "RZ²/U", "UI/Z²"], 0, "P=U(U/Z)(R/Z).", "Situation 1.3"),
      choice("La puissance est maximale quand…", ["Z est minimale", "Z est infinie", "R est négative", "U est nulle"], 0, "P=RU²/Z² à R et U constants.", "Situation 2.1"),
      choice("La condition de résonance est…", ["Lω₀=1/(Cω₀)", "Lω₀=R", "Cω₀=R²", "ω₀=0"], 0, "La réactance totale doit s’annuler.", "Résonance"),
      short("Calcule ω₀ avec L=1 H et C=4 µF.", ["500", "500 rad/s", "500 rad.s-1", "500 rad·s⁻¹"], "ω₀=1/√(4×10⁻⁶)=500 rad·s⁻¹.", "Situation 2.1", 2),
      short("Calcule f₀ au centième près.", ["79.58", "79,58", "79.58 Hz", "79,58 Hz", "79.6", "79,6"], "f₀=500/(2π)≈79,58 Hz.", "Situation 2.1", 2),
      short("Calcule I₀ à la résonance.", ["0.44", "0,44", "0.44 A", "0,44 A"], "I₀=220/500=0,44 A.", "Résonance", 2),
      short("Calcule P₀.", ["96.8", "96,8", "96.8 W", "96,8 W"], "P₀=220²/500=96,8 W.", "Situation 2.1", 2),
      choice("L’unité correcte de P₀ est…", ["W", "Hz", "VA uniquement", "rad/s"], 0, "P₀ est une puissance active.", "Unité corrigée"),
      choice("À la résonance, la tension et le courant sont…", ["en phase", "en opposition", "décalés de π/2", "de fréquences différentes"], 0, "La réactance résultante est nulle et φ=0.", "Situation 2.1"),
    ],
    corrections: [
      "Page 3 : Z et P sont rétablies avec Lω−1/(Cω), et non Lω²−1/(Cω²), expression dimensionnellement impossible.",
      "Page 4 : P₀=96,8 W ; la source imprime par erreur 96,8 Hz.",
      "Page 3 : cosφ est un facteur de puissance, pas un facteur de qualité.",
    ],
  },
  {
    id: "ac-power-half-power-band",
    title: "Relier demi-puissance et bande passante",
    summary: "Résoudre exactement les deux équations de coupure, ranger les fréquences dans le bon ordre et interpréter correctement la bande de demi-puissance.",
    pages: "3 à 4",
    section: "Situation d’évaluation, questions 2.2 à 4",
    durationMinutes: 27,
    xp: 85,
    kind: "challenge",
    body: String.raw`## Le seuil de demi-puissance

À la résonance, $P_0=U^2/R$. Aux fréquences de coupure, la puissance vaut :

$$P=\frac{P_0}{2}$$

Comme $P=RI^2$ et $P_0=RI_0^2$ :

$$\frac{I^2}{I_0^2}=\frac12\qquad\Longrightarrow\qquad\boxed{I=\frac{I_0}{\sqrt2}}$$

Dans l’expression de $P(\omega)$ :

$$\frac{RU^2}{R^2+\left(L\omega-\frac1{C\omega}\right)^2}=\frac{U^2}{2R}$$

On obtient :

$$\boxed{\left|L\omega-\frac1{C\omega}\right|=R}$$

## Coupure basse

Pour la branche capacitive :

$$L\omega_1-\frac1{C\omega_1}=-R$$

$$LC\omega_1^2+RC\omega_1-1=0$$

La racine positive est :

$$\boxed{\omega_1=\frac{-R+\sqrt{R^2+4L/C}}{2L}}$$

Avec $R=500\ \Omega$, $L=1$ H et $C=4\ \mu$F :

$$\omega_1\approx309{,}02\ \text{rad·s}^{-1},\qquad\boxed{f_1\approx49{,}18\ \text{Hz}}$$

## Coupure haute

Pour la branche inductive :

$$L\omega_2-\frac1{C\omega_2}=R$$

$$LC\omega_2^2-RC\omega_2-1=0$$

La racine positive est :

$$\boxed{\omega_2=\frac{R+\sqrt{R^2+4L/C}}{2L}}$$

$$\omega_2\approx809{,}02\ \text{rad·s}^{-1},\qquad\boxed{f_2\approx128{,}76\ \text{Hz}}$$

On a bien :

$$f_1<f_0<f_2$$

## Largeur de bande

La différence des racines est particulièrement simple :

$$\omega_2-\omega_1=\frac RL$$

Donc :

$$\boxed{\Delta f=f_2-f_1=\frac{R}{2\pi L}}$$

Numériquement :

$$\Delta f=128{,}76-49{,}18\approx79{,}58\ \text{Hz}$$

Dans la bande $[f_1;f_2]$, la puissance vérifie $P\geq P_0/2$. Elle vaut **exactement** $P_0/2$ uniquement aux deux bornes, et non partout dans l’intervalle.

> **Rangement réparé.** La source attribue le nom $f_1$ à 129 Hz puis $f_2$ à 49,2 Hz, avant de calculer malgré tout une différence positive. On rétablit la convention universelle : $f_1$ est la coupure basse et $f_2$ la coupure haute.` ,
    keyPoint: "Aux coupures P=P₀/2 et I=I₀/√2 ; f₁≈49,18 Hz, f₂≈128,76 Hz et Δf=R/(2πL)≈79,58 Hz.",
    example: "La bande de demi-puissance est [49,18 Hz ; 128,76 Hz] et contient la résonance f₀≈79,58 Hz.",
    methodSteps: [
      "Pose P=P₀/2 et simplifie sans arrondir trop tôt.",
      "Déduis |Lω−1/(Cω)|=R.",
      "Résous séparément les cas −R et +R.",
      "Range les racines positives dans l’ordre ω₁<ω₀<ω₂.",
      "Calcule Δf=f₂−f₁ puis vérifie Δf=R/(2πL).",
    ],
    interaction: timeline([
      { label: "Fixer le seuil", shortLabel: "P₀/2", detail: "La demi-puissance correspond aussi à I=I₀/√2." },
      { label: "Écrire la valeur absolue", shortLabel: "|X|=R", detail: "Le terme réactif vérifie |Lω−1/(Cω)|=R." },
      { label: "Trouver la coupure basse", shortLabel: "f₁", detail: "Le cas −R donne ω₁≈309,02 rad·s⁻¹, soit f₁≈49,18 Hz." },
      { label: "Trouver la coupure haute", shortLabel: "f₂", detail: "Le cas +R donne ω₂≈809,02 rad·s⁻¹, soit f₂≈128,76 Hz." },
      { label: "Calculer la largeur", shortLabel: "Δf", detail: "Δf=f₂−f₁=R/(2πL)≈79,58 Hz." },
    ], "Résoudre la situation sans inverser les bornes", "Ouvre chaque étape et vérifie l’ordre des fréquences.", "La résonance est comprise entre les deux coupures, où la puissance vaut la moitié du maximum."),
    questions: [
      choice("À une fréquence de coupure, la puissance vaut…", ["P₀/2", "P₀", "2P₀", "0 toujours"], 0, "C’est la définition du seuil de demi-puissance.", "Situation 2.2"),
      choice("Au même seuil, le courant vaut…", ["I₀/√2", "I₀/2", "√2I₀", "0"], 0, "P est proportionnelle à I².", "Lien puissance-courant"),
      choice("L’équation équivalente est…", ["|Lω−1/(Cω)|=R", "Lω+1/(Cω)=0", "R=0", "ω=RLC"], 0, "La partie réactive a pour valeur absolue R.", "Demi-puissance"),
      choice("La coupure basse se situe dans un régime plutôt…", ["capacitif", "inductif", "continu", "sans courant"], 0, "Sous la résonance, 1/(Cω)>Lω.", "Interprétation"),
      choice("La coupure haute se situe dans un régime plutôt…", ["inductif", "capacitif", "statique", "sans tension"], 0, "Au-dessus de la résonance, Lω>1/(Cω).", "Interprétation"),
      short("Donne ω₁ au rad/s près.", ["309", "309 rad/s", "309 rad.s-1", "309 rad·s⁻¹"], "ω₁≈309,02 rad·s⁻¹.", "Situation 2.2", 2),
      short("Donne f₁ au centième près.", ["49.18", "49,18", "49.18 Hz", "49,18 Hz", "49.2", "49,2"], "f₁≈49,18 Hz.", "Situation 2.2", 2),
      short("Donne ω₂ au rad/s près.", ["809", "809 rad/s", "809 rad.s-1", "809 rad·s⁻¹"], "ω₂≈809,02 rad·s⁻¹.", "Situation 2.2", 2),
      short("Donne f₂ au centième près.", ["128.76", "128,76", "128.76 Hz", "128,76 Hz", "129", "129 Hz"], "f₂≈128,76 Hz.", "Situation 2.2", 2),
      choice("L’ordre correct est…", ["f₁<f₀<f₂", "f₂<f₀<f₁", "f₀<f₁<f₂", "f₁=f₂"], 0, "49,18<79,58<128,76.", "Ordre corrigé"),
      short("Calcule f₂−f₁ au centième près.", ["79.58", "79,58", "79.58 Hz", "79,58 Hz", "79.6", "79,6"], "128,76−49,18≈79,58 Hz.", "Situation 4", 2),
      choice("La formule de largeur de bande est…", ["R/(2πL)", "2πL/R", "1/(RC)", "LC/R"], 0, "Δω=R/L puis Δf=Δω/(2π).", "Situation 3"),
      short("Calcule P₀/2 pour P₀=96,8 W.", ["48.4", "48,4", "48.4 W", "48,4 W"], "96,8/2=48,4 W.", "Seuil", 1),
      choice("Dans toute la bande [f₁;f₂], on a…", ["P≥P₀/2", "P=P₀/2 partout", "P=0", "P>P₀"], 0, "L’égalité n’a lieu qu’aux bornes.", "Conclusion corrigée"),
      choice("La source inverse les noms de…", ["f₁ et f₂", "U et I", "R et L", "P et E uniquement"], 0, "129 Hz est la coupure haute, donc f₂, et 49,2 Hz la coupure basse, donc f₁.", "Audit de la solution"),
    ],
    corrections: [
      "Page 4 : les coupures sont renommées dans l’ordre f₁≈49,18 Hz<f₀<f₂≈128,76 Hz ; la source les inverse.",
      "Page 4 : la conclusion est corrigée en P≥P₀/2 dans la bande ; l’égalité P=P₀/2 n’a lieu qu’aux deux bornes.",
      "Page 4 : Δf est recalculée sans arrondis intermédiaires à 79,58 Hz, cohérente exactement avec R/(2πL).",
    ],
  },
  {
    id: "ac-power-official-exercises-one-two",
    title: "Résoudre les exercices 1 et 2",
    summary: "Calculer une puissance apparente, un facteur de puissance, l’inductance d’un circuit RL et le condensateur de compensation série.",
    pages: "4 à 5",
    section: "IV. Exercices 1 et 2",
    durationMinutes: 25,
    xp: 95,
    kind: "practice",
    body: String.raw`## Exercice 1 — installation de 4,4 kW

**Données fidèles :** $U=110$ V, $I=50$ A et $P=4{,}4$ kW.

La puissance apparente vaut :

$$S=UI=110\times50=5500\ \text{VA}=\boxed{5{,}5\ \text{kVA}}$$

Le facteur de puissance est :

$$\cos\varphi=\frac PS=\frac{4400}{5500}=\boxed{0{,}80}$$

L’angle correspondant a pour valeur absolue :

$$|\varphi|=\arccos(0{,}80)\approx36{,}87^\circ$$

Le signe de $\varphi$ ne peut pas être décidé sans connaître la nature inductive ou capacitive de l’installation.

## Exercice 2 — retrouver l’inductance

Un circuit RL série comporte $R=20\ \Omega$, fonctionne à $f=50$ Hz et possède un facteur de puissance $0{,}8$.

$$\cos\varphi=\frac RZ=0{,}8\qquad\Longrightarrow\qquad Z=\frac{20}{0{,}8}=25\ \Omega$$

Dans un RL série :

$$Z^2=R^2+(L\omega)^2$$

Donc :

$$L\omega=\sqrt{Z^2-R^2}=\sqrt{25^2-20^2}=15\ \Omega$$

Avec $\omega=2\pi f=100\pi$ rad·s$^{-1}$ :

$$\boxed{L=\frac{15}{100\pi}\approx0{,}04775\ \text{H}=47{,}75\ \text{mH}}$$

## Ajouter un condensateur en série

Pour ramener le facteur de puissance du circuit **série** à $1$ à la même fréquence, on impose la résonance :

$$L\omega=\frac1{C\omega}$$

$$\boxed{C=\frac1{L\omega^2}}$$

Numériquement :

$$C\approx2{,}122\times10^{-4}\ \text{F}=\boxed{212{,}2\ \mu\text{F}}$$

La source arrondit $L$ à $0{,}048$ H puis $C$ à $2{,}1\times10^{-4}$ F. Les deux valeurs sont compatibles avec la précision des données.

> **Méthode générale.** Avec un facteur de puissance connu dans un RL série, commence par $Z=R/\cos\varphi$, trouve $X_L$ par Pythagore, puis déduis $L=X_L/\omega$.` ,
    keyPoint: "Ex.1 : S=5,5 kVA et cosφ=0,80. Ex.2 : L≈47,75 mH et C≈212,2 µF pour la compensation série.",
    example: "R=20 Ω et cosφ=0,8 donnent Z=25 Ω, XL=15 Ω puis L=15/(2π×50)≈47,75 mH.",
    methodSteps: [
      "Convertis d’abord les kW en W si tu formes P/S.",
      "Calcule S=UI et cosφ=P/S.",
      "Dans le RL, déduis Z=R/cosφ.",
      "Utilise XL=√(Z²−R²), puis L=XL/(2πf).",
      "Pour la compensation série, impose LCω²=1 et calcule C.",
    ],
    interaction: timeline([
      { label: "Puissance apparente", shortLabel: "S", detail: "S=110×50=5500 VA=5,5 kVA." },
      { label: "Facteur de puissance", shortLabel: "cos φ", detail: "cosφ=4400/5500=0,80." },
      { label: "Impédance du RL", shortLabel: "Z", detail: "Z=R/cosφ=20/0,8=25 Ω." },
      { label: "Inductance", shortLabel: "L", detail: "XL=15 Ω, donc L=15/(2π×50)≈47,75 mH." },
      { label: "Compensation", shortLabel: "C", detail: "C=1/(Lω²)≈212,2 µF pour obtenir cosφ=1 en série." },
    ], "Deux exercices, une chaîne de calcul", "Parcours les étapes sans mélanger W, VA, H et F.", "Chaque résultat intermédiaire possède une unité qui permet de contrôler la suite."),
    questions: [
      short("Exercice 1 : convertis 4,4 kW en watts.", ["4400", "4400 W"], "4,4 kW=4400 W.", "Exercice 1"),
      short("Exercice 1 : calcule S en VA.", ["5500", "5500 VA", "5.5 kVA", "5,5 kVA"], "S=110×50=5500 VA.", "Exercice 1", 2),
      choice("5500 VA s’écrit aussi…", ["5,5 kVA", "5,5 VA", "5500 kW", "0,55 Hz"], 0, "1000 VA=1 kVA.", "Unité corrigée"),
      short("Exercice 1 : calcule cosφ.", ["0.8", "0,8"], "cosφ=4400/5500=0,8.", "Exercice 1", 2),
      short("Donne |φ| en degrés, au centième près.", ["36.87", "36,87", "36.87°", "36,87°"], "arccos(0,8)≈36,87°.", "Complément explicatif", 2),
      choice("Peut-on déduire le signe de φ avec P, U et I seuls ?", ["Non", "Oui, il est toujours positif", "Oui, il est toujours négatif", "Oui, il vaut π"], 0, "Il faut connaître la nature inductive ou capacitive.", "Interprétation"),
      short("Exercice 2 : calcule Z.", ["25", "25 Ω", "25 ohm", "25 ohms"], "Z=20/0,8=25 Ω.", "Exercice 2", 1),
      short("Calcule XL=√(Z²−R²).", ["15", "15 Ω", "15 ohm", "15 ohms"], "√(625−400)=15 Ω.", "Exercice 2", 2),
      short("Calcule ω pour f=50 Hz, sous forme exacte.", ["100π", "100 pi", "100*pi", "314.16", "314,16"], "ω=2π×50=100π rad·s⁻¹.", "Exercice 2"),
      short("Calcule L en henrys, à cinq décimales.", ["0.04775", "0,04775", "0.04775 H", "0,04775 H", "0.048", "0,048"], "L≈0,04775 H.", "Exercice 2", 2),
      short("Exprime L en mH, au centième près.", ["47.75", "47,75", "47.75 mH", "47,75 mH", "48", "48 mH"], "0,04775 H=47,75 mH.", "Exercice 2", 2),
      choice("Pour obtenir cosφ=1 avec le condensateur série, il faut…", ["LCω²=1", "R=0", "Cω=R", "L=C"], 0, "La compensation annule la réactance totale.", "Exercice 2.2"),
      short("Calcule C en µF, au dixième près.", ["212.2", "212,2", "212.2 µF", "212,2 µF", "212", "212 µF"], "C≈212,2 µF.", "Exercice 2.2", 2),
      choice("Après compensation série idéale, le facteur de puissance vaut…", ["1", "0,8", "0", "2"], 0, "Le courant et la tension deviennent en phase.", "Exercice 2.2"),
    ],
    corrections: [
      "Page 4 : S=5500 VA=5,5 kVA ; la source affiche 5,5 V.A et perd le facteur 1000.",
      "Page 5 : le calcul non arrondi donne L≈0,04775 H et C≈212,2 µF ; les valeurs 0,048 H et 2,1×10⁻⁴ F restent des arrondis acceptables.",
    ],
  },
  {
    id: "ac-power-official-exercise-three",
    title: "Auditer l’exercice 3 à la résonance",
    summary: "Additionner toutes les résistances réelles, déterminer courant et puissance, puis corriger le facteur de puissance du circuit complet.",
    pages: "5",
    section: "IV. Exercice 3",
    durationMinutes: 22,
    xp: 105,
    kind: "practice",
    body: String.raw`## Énoncé fidèle

Le circuit RLC série reçoit une tension efficace $U=24$ V de fréquence variable. Il comprend :

$$R=10\ \Omega,\qquad r=2\ \Omega,\qquad L=0{,}10\ \text{H},\qquad C=1{,}0\ \mu\text{F}$$

$r$ est la résistance réelle de la bobine. La question demande le courant lorsque celui-ci est en phase avec la tension : le circuit est alors à la résonance.

## Fréquence d’accord

Même si la source ne la demande pas explicitement, elle permet de vérifier le régime :

$$f_0=\frac1{2\pi\sqrt{LC}}
=\frac1{2\pi\sqrt{0{,}10\times10^{-6}}}
\approx\boxed{503{,}29\ \text{Hz}}$$

## Résistance totale et courant

À la résonance, les réactances se compensent. L’impédance n’est toutefois pas $R$ seule, car la bobine possède aussi la résistance $r$ :

$$\boxed{Z_0=R+r=12\ \Omega}$$

Donc :

$$\boxed{I_0=\frac{U}{R+r}=\frac{24}{12}=2{,}0\ \text{A}}$$

## Facteur de puissance du circuit complet

Le facteur de puissance vaut :

$$\cos\varphi=\frac{R+r}{Z}$$

À la résonance, $Z_0=R+r$, donc :

$$\boxed{\cos\varphi_0=1}$$

Le résultat $10/12=0{,}83$ imprimé dans la source est le rapport de la résistance du conducteur ohmique à la résistance totale. Ce n’est pas le facteur de puissance du **circuit complet**, puisque $r$ dissipe aussi de l’énergie.

## Puissance active totale

$$P=(R+r)I_0^2=12\times2^2=\boxed{48\ \text{W}}$$

On peut vérifier la répartition :

$$P_R=RI_0^2=10\times4=40\ \text{W}$$

$$P_r=rI_0^2=2\times4=8\ \text{W}$$

$$P_R+P_r=40+8=48\ \text{W}$$

L’interaction fait varier le courant et représente $P=12I^2$. Le point $I=2$ A redonne immédiatement $48$ W.` ,
    keyPoint: "À la résonance avec une bobine réelle : Z₀=R+r, I₀=U/(R+r), cosφ₀=1 et P=(R+r)I₀².",
    example: "R+r=12 Ω et U=24 V donnent I₀=2 A ; la puissance totale vaut 48 W, répartie en 40 W et 8 W.",
    methodSteps: [
      "Repère toutes les résistances réelles du circuit.",
      "Traduis « courant en phase avec la tension » par résonance.",
      "À la résonance, écris Z₀=R+r.",
      "Calcule I₀ puis utilise la résistance totale dans P=(R+r)I₀².",
      "Vérifie que cosφ₀=(R+r)/Z₀=1.",
    ],
    interaction: {
      eyebrow: "Puissance résistive",
      title: "Puissance totale pour R+r=12 Ω",
      instruction: "Fais varier le courant et retrouve le point officiel I=2 A.",
      observation: "À 2 A, les deux résistances dissipent ensemble 48 W.",
      formula: "P = 12I²",
      formulaTex: "P=(R+r)I^2=12I^2",
      inputSymbol: "I",
      outputSuffix: " W",
      rule: { kind: "quadratic", coefficient: 12, constant: 0 },
      input: { min: 0, max: 3, step: 0.1, initial: 2 },
    },
    questions: [
      choice("Dire que i est en phase avec u signifie ici…", ["que le circuit est à la résonance", "que le circuit est ouvert", "que I=0", "que C est supprimé"], 0, "Le déphasage nul caractérise la résonance série.", "Exercice 3.1"),
      short("Convertis C=1 µF en farads.", ["0.000001", "1e-6", "10^-6", "1×10^-6 F"], "1 µF=10⁻⁶ F.", "Données"),
      short("Calcule f₀ au centième près.", ["503.29", "503,29", "503.29 Hz", "503,29 Hz", "503.3", "503,3"], "f₀≈503,29 Hz.", "Vérification de la résonance", 2),
      short("Calcule la résistance totale R+r.", ["12", "12 Ω", "12 ohm", "12 ohms"], "10+2=12 Ω.", "Exercice 3"),
      choice("À la résonance, Z₀ vaut…", ["R+r", "R seulement", "r seulement", "0"], 0, "Les réactances se compensent mais les deux résistances restent.", "Exercice 3.1"),
      short("Calcule I₀.", ["2", "2 A", "2.0", "2,0"], "I₀=24/12=2 A.", "Exercice 3.1", 2),
      choice("Le facteur de puissance du circuit complet à la résonance vaut…", ["1", "0,83", "0", "12"], 0, "La tension totale et le courant sont en phase.", "Exercice 3.2 corrigé"),
      choice("Pourquoi 10/12 n’est-il pas le facteur de puissance total ?", ["La résistance r=2 Ω dissipe aussi de la puissance", "La bobine n’a aucune résistance", "Le courant est continu", "La tension vaut 10 V"], 0, "Il faut mettre toute la résistance dissipative au numérateur.", "Audit de la solution"),
      short("Calcule la puissance totale.", ["48", "48 W"], "P=12×2²=48 W.", "Exercice 3.3", 2),
      short("Calcule la puissance dissipée dans R=10 Ω.", ["40", "40 W"], "PR=10×2²=40 W.", "Répartition", 1),
      short("Calcule la puissance dissipée dans r=2 Ω.", ["8", "8 W"], "Pr=2×2²=8 W.", "Répartition", 1),
      choice("La somme 40 W+8 W donne…", ["la puissance active totale", "la puissance apparente en VA", "la fréquence", "l’inductance"], 0, "Les deux résistances sont les seuls éléments dissipatifs.", "Bilan"),
      short("Si I=1,5 A, calcule P=12I².", ["27", "27 W"], "12×1,5²=27 W.", "Interaction", 2),
    ],
    corrections: [
      "Page 5 : le facteur de puissance du circuit complet à la résonance vaut 1, et non R/(R+r)=10/12≈0,83 ; la résistance r de la bobine participe aussi à la puissance active.",
    ],
  },
  {
    id: "ac-power-official-exercise-four",
    title: "Reconstruire entièrement l’exercice 4",
    summary: "Recalculer impédance, phase, courant et puissance en fonction de R, puis démontrer la résistance optimale sans reproduire les erreurs en chaîne du corrigé.",
    pages: "5 à 6",
    section: "IV. Exercice 4",
    durationMinutes: 32,
    xp: 115,
    kind: "challenge",
    body: String.raw`## Données de l’exercice

Le circuit série comporte une résistance variable $R$, une bobine idéale $L=20$ mH et un condensateur $C=5\ \mu$F. La fréquence est **$f=400$ Hz** et :

$$u(t)=24\sqrt2\sin(2\pi ft)$$

La tension efficace vaut donc $U=24$ V. Dans la première partie, $R=6\ \Omega$.

## 1. Impédance pour $R=6\ \Omega$

La pulsation est :

$$\omega=2\pi f=2\pi\times400\approx\boxed{2513{,}27\ \text{rad·s}^{-1}}$$

Les réactances valent :

$$X_L=L\omega=0{,}020\times2513{,}27\approx50{,}27\ \Omega$$

$$X_C=\frac1{C\omega}=\frac1{5\times10^{-6}\times2513{,}27}\approx79{,}58\ \Omega$$

La réactance totale est :

$$X=X_L-X_C\approx-29{,}31\ \Omega$$

Le circuit est capacitif. Son impédance vaut :

$$Z=\sqrt{R^2+X^2}=\sqrt{6^2+(-29{,}31)^2}\approx\boxed{29{,}92\ \Omega}$$

## 2. Phase et courant

La phase de la tension par rapport au courant est :

$$\varphi_{u/i}=\arctan\left(\frac XR\right)
=\arctan\left(\frac{-29{,}31}{6}\right)
\approx\boxed{-1{,}369\ \text{rad}}$$

Donc le courant est en avance :

$$\boxed{\varphi_{i/u}=+1{,}369\ \text{rad}\approx78{,}43^\circ}$$

La valeur efficace et l’amplitude sont :

$$I=\frac UZ=\frac{24}{29{,}92}\approx0{,}802\ \text{A}$$

$$I_m=\sqrt2I\approx\boxed{1{,}134\ \text{A}}$$

Ainsi :

$$\boxed{i(t)\approx1{,}134\sin(2513{,}27t+1{,}369)\ \text{A}}$$

## 3. Puissance en fonction de $R$

À $L$, $C$, $f$ et $U$ fixés, $X=-29{,}31\ \Omega$ reste constant :

$$I^2=\frac{U^2}{R^2+X^2}$$

$$\boxed{P(R)=RI^2=\frac{RU^2}{R^2+X^2}}$$

Pour $R=6\ \Omega$ :

$$P\approx\frac{6\times24^2}{6^2+29{,}31^2}\approx\boxed{3{,}86\ \text{W}}$$

La dérivée a le signe de $X^2-R^2$ :

$$P'(R)=U^2\frac{X^2-R^2}{(R^2+X^2)^2}$$

La puissance augmente jusqu’à $R=|X|$, puis diminue. La résistance optimale est donc :

$$\boxed{R_{\text{opt}}=|X|\approx29{,}31\ \Omega}$$

et :

$$\boxed{P_{\max}=\frac{U^2}{2|X|}\approx9{,}83\ \text{W}}$$

La puissance maximale ne correspond pas ici à $\cos\varphi=1$ : à fréquence fixée, changer $R$ ne peut pas annuler la réactance $X$. Le maximum vient du compromis entre l’augmentation de $R$ et la diminution du courant.

> **Audit.** Le corrigé source omet des carrés dans $Z$, remplace 400 Hz par 480 Hz, trouve $Z=8{,}48\ \Omega$, $I_m=4$ A puis $R=8{,}48\ \Omega$. Ces valeurs sont incompatibles entre elles et avec les données ; le calcul ci-dessus reprend la chaîne depuis les unités.` ,
    keyPoint: "Ex.4 corrigé : Z≈29,92 Ω, φi/u≈1,369 rad, Im≈1,134 A et P(R) est maximale pour R=|XL−XC|≈29,31 Ω.",
    example: "À 400 Hz, X≈−29,31 Ω. Pour R=6 Ω, Z≈29,92 Ω et P≈3,86 W ; l’optimum est R≈29,31 Ω.",
    methodSteps: [
      "Convertis L et C en unités SI et calcule ω=2πf.",
      "Calcule séparément XL, XC puis X=XL−XC.",
      "Déduis Z, le signe de la phase et l’amplitude du courant.",
      "Écris P(R)=RU²/(R²+X²) en gardant X constant.",
      "Étudie le signe de P′ ou applique l’égalité R=|X| au maximum.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Optimisation",
      title: "Puissance reçue en fonction de R",
      instruction: "Déplace le point et repère le maximum autour de 29,31 Ω.",
      observation: "À fréquence fixée, P augmente puis diminue ; son maximum ne coïncide pas avec cosφ=1.",
      formula: "P(R)=576R/(R²+29,312²)",
      formulaTex: "P(R)=\\frac{576R}{R^2+29{,}312^2}",
      rule: { kind: "samples", points: exercise4PowerPoints },
      window: { xMin: 0, xMax: 105, yMin: 0, yMax: 11 },
      guides: [{ kind: "vertical", value: 29.312, label: "R optimale" }],
      marker: { min: 1, max: 100, step: 1, initial: 29 },
    },
    questions: [
      choice("Dans u(t)=24√2 sin(2πft), la valeur efficace U vaut…", ["24 V", "24√2 V", "12 V", "48 V"], 0, "L’amplitude est Um=24√2, donc U=24 V.", "Exercice 4"),
      short("Convertis L=20 mH en henrys.", ["0.02", "0,02", "0.02 H", "0,02 H"], "20 mH=0,020 H.", "Données"),
      short("Convertis C=5 µF en farads.", ["0.000005", "5e-6", "5×10^-6", "5×10⁻⁶ F"], "5 µF=5×10⁻⁶ F.", "Données"),
      short("Calcule ω au centième près.", ["2513.27", "2513,27", "2513.27 rad/s", "2513,27 rad/s"], "ω=2π×400≈2513,27 rad·s⁻¹.", "Exercice 4", 2),
      short("Calcule XL au centième près.", ["50.27", "50,27", "50.27 Ω", "50,27 Ω"], "XL=0,02×2513,27≈50,27 Ω.", "Réactance", 2),
      short("Calcule XC au centième près.", ["79.58", "79,58", "79.58 Ω", "79,58 Ω"], "XC≈79,58 Ω.", "Réactance", 2),
      short("Calcule X=XL−XC au centième près.", ["-29.31", "-29,31", "−29.31", "−29,31", "-29.31 Ω", "-29,31 Ω"], "X≈−29,31 Ω.", "Réactance totale", 2),
      choice("Le signe de X montre que le circuit est…", ["capacitif", "inductif", "à la résonance", "purement résistif"], 0, "X<0 signifie XC>XL.", "Nature du circuit"),
      short("Calcule Z au centième près.", ["29.92", "29,92", "29.92 Ω", "29,92 Ω"], "Z≈29,92 Ω.", "Exercice 4.2.1", 2),
      short("Donne φi/u en radians au millième près.", ["1.369", "1,369", "1.369 rad", "1,369 rad"], "Le courant est en avance de 1,369 rad.", "Exercice 4.2.2", 2),
      short("Calcule I efficace au millième près.", ["0.802", "0,802", "0.802 A", "0,802 A"], "I=24/29,92≈0,802 A.", "Courant efficace", 2),
      short("Calcule Im au millième près.", ["1.134", "1,134", "1.134 A", "1,134 A"], "Im=√2I≈1,134 A.", "Exercice 4.3", 2),
      choice("La pulsation de i(t) doit être…", ["2513 rad/s", "3016 rad/s", "400 rad/s", "480 rad/s"], 0, "La fréquence donnée est 400 Hz, donc ω=2π×400.", "Fréquence corrigée"),
      short("Pour R=6 Ω, calcule P au centième près.", ["3.86", "3,86", "3.86 W", "3,86 W"], "P≈3,86 W.", "Exercice 4.4.1", 2),
      short("Donne Ropt au centième près.", ["29.31", "29,31", "29.31 Ω", "29,31 Ω"], "Ropt=|X|≈29,31 Ω.", "Exercice 4.4.2", 2),
      short("Calcule Pmax au centième près.", ["9.83", "9,83", "9.83 W", "9,83 W"], "Pmax=576/(2×29,31)≈9,83 W.", "Maximum", 2),
    ],
    corrections: [
      "Page 6 : Z est recalculée à 29,92 Ω ; le résultat 8,48 Ω vient d’une expression où le carré de la réactance a disparu.",
      "Page 6 : la fréquence reste 400 Hz, donc ω≈2513 rad·s⁻¹ ; la solution remplace sans justification 400 par 480 Hz et annonce 3016 rad·s⁻¹.",
      "Page 6 : Im≈1,134 A et non 4 A ; 24√2 V est l’amplitude de la tension, pas sa valeur efficace.",
      "Page 6 : P(R)=RU²/(R²+X²) est maximale pour R=|X|≈29,31 Ω, et non pour R=8,48 Ω ni par l’argument cosφ=1.",
    ],
  },
  {
    id: "ac-power-official-exercise-five-grid-mission",
    title: "Mission finale : du dipôle RL au réseau électrique",
    summary: "Résoudre l’exercice 5, comparer continu et alternatif, puis transférer la méthode à une chaîne de transport sous haute tension.",
    pages: "6 à 8",
    section: "IV. Exercice 5 et documentation sur les lignes à haute tension",
    durationMinutes: 29,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Partie A — exercice 5 fidèle

Un conducteur ohmique $R$ et une bobine idéale $L$ sont d’abord alimentés en continu sous $6$ V. Le courant vaut $0{,}2$ A.

En régime continu établi, la bobine idéale se comporte comme un conducteur :

$$\boxed{R=\frac UI=\frac6{0{,}2}=30\ \Omega}$$

La puissance consommée est :

$$\boxed{P_{\text{continu}}=RI^2=30\times0{,}2^2=1{,}2\ \text{W}}$$

Le même circuit est ensuite soumis à une tension sinusoïdale efficace de $6$ V, à $50$ Hz. Le courant efficace n’est plus que $0{,}1$ A.

La puissance active reste dissipée dans $R$ :

$$\boxed{P_{\text{alternatif}}=RI^2=30\times0{,}1^2=0{,}30\ \text{W}}$$

La puissance apparente est :

$$S=UI=6\times0{,}1=0{,}60\ \text{VA}$$

Le facteur de puissance vaut :

$$\boxed{\cos\varphi=\frac PS=\frac{0{,}30}{0{,}60}=0{,}50}$$

On peut prolonger le calcul pour contrôler la cohérence :

$$Z=\frac UI=60\ \Omega$$

$$X_L=\sqrt{Z^2-R^2}=\sqrt{60^2-30^2}\approx51{,}96\ \Omega$$

$$L=\frac{X_L}{2\pi f}\approx\boxed{0{,}165\ \text{H}}$$

et $|\varphi|=\arccos(0{,}5)=60^\circ$.

## Partie B — comprendre le réseau

La documentation décrit la chaîne suivante :

1. une centrale produit l’énergie électrique ;
2. un poste élève la tension pour réduire le courant ;
3. les lignes transportent l’énergie avec des pertes $R_{\text{ligne}}I^2$ ;
4. des postes abaissent progressivement la tension ;
5. le réseau de distribution alimente les utilisateurs.

Les câbles, isolateurs, pylônes et distances de sécurité dépendent de la tension. Les chiffres de la documentation sont des exemples français datés ; le principe $P_J\propto1/U^2$ est, lui, général.

## Partie C — défi de transfert

Une petite installation doit recevoir $P=20$ kW sous une ligne à $U=20$ kV, avec $\cos\varphi=0{,}80$. La résistance totale de la ligne vaut $4\ \Omega$.

Le courant transporté est :

$$I=\frac{20\,000}{20\,000\times0{,}80}=\boxed{1{,}25\ \text{A}}$$

Les pertes valent :

$$P_J=4\times1{,}25^2=\boxed{6{,}25\ \text{W}}$$

Si la tension était dix fois plus faible, le courant serait dix fois plus grand et les pertes seraient cent fois plus fortes : $625$ W.

> **Bilan de la leçon.** La puissance active explique ce qui est réellement transformé, la puissance apparente dimensionne les équipements, le facteur de puissance agit sur le courant, et la haute tension limite les pertes du transport.` ,
    keyPoint: "Ex.5 : R=30 Ω, Pcontinu=1,2 W, Palternatif=0,30 W, S=0,60 VA et cosφ=0,50 ; la haute tension réduit PJ en 1/U².",
    example: "Pour transporter 20 kW sous 20 kV avec cosφ=0,80 : I=1,25 A ; une ligne de 4 Ω perd 6,25 W.",
    methodSteps: [
      "En continu établi, détermine R avec la loi d’Ohm.",
      "En alternatif, garde la même résistance pour calculer P=RI².",
      "Calcule S=UI puis cosφ=P/S.",
      "Pour une ligne, repars de I=P/(Ucosφ).",
      "Calcule PJ=RligneI² et compare les tensions par un rapport au carré.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Réseau électrique",
      title: "De la production à l’utilisateur",
      instruction: "Sélectionne les cinq repères pour suivre la tension, le courant et les pertes.",
      observation: "La tension est élevée avant le transport puis abaissée près des utilisateurs.",
      caption: "Schéma pédagogique original de la chaîne de transport décrite dans la documentation.",
      viewBox: "0 0 520 230",
      shapes: [
        { shape: "circle", cx: 50, cy: 118, r: 28, tone: "soft" },
        { shape: "text", x: 50, y: 123, content: "G", anchor: "middle" },
        { shape: "path", d: "M100 155 L130 82 L160 155 M113 124 L147 124 M105 142 L155 142", tone: "outline" },
        { shape: "path", d: "M205 155 L235 62 L265 155 M218 115 L252 115 M211 138 L259 138", tone: "accent" },
        { shape: "line", x1: 265, y1: 82, x2: 365, y2: 82, tone: "accent" },
        { shape: "line", x1: 265, y1: 102, x2: 365, y2: 102, tone: "accent" },
        { shape: "path", d: "M365 155 L390 92 L415 155 M375 127 L405 127 M370 143 L410 143", tone: "outline" },
        { shape: "path", d: "M448 154 L448 104 L485 82 L512 104 L512 154 Z", tone: "soft" },
        { shape: "line", x1: 475, y1: 154, x2: 475, y2: 124, tone: "muted" },
        { shape: "text", x: 235, y: 45, content: "Haute tension", anchor: "middle" },
        { shape: "text", x: 315, y: 70, content: "I faible", anchor: "middle" },
      ],
      hotspots: [
        { id: "production", number: 1, label: "Production", detail: "L’alternateur fournit l’énergie électrique au réseau.", x: 50, y: 118 },
        { id: "step-up", number: 2, label: "Poste élévateur", detail: "Il augmente U et réduit I pour une puissance transportée donnée.", x: 130, y: 92 },
        { id: "transport", number: 3, label: "Ligne haute tension", detail: "Le faible courant limite les pertes PJ=RligneI² sur une longue distance.", x: 315, y: 92 },
        { id: "step-down", number: 4, label: "Poste abaisseur", detail: "Il ramène progressivement la tension à un niveau adapté à la distribution.", x: 390, y: 105 },
        { id: "consumer", number: 5, label: "Utilisateur", detail: "L’installation reçoit la puissance active nécessaire sous une tension d’usage.", x: 480, y: 118 },
      ],
    },
    questions: [
      short("Exercice 5 : calcule R en régime continu.", ["30", "30 Ω", "30 ohm", "30 ohms"], "R=6/0,2=30 Ω.", "Exercice 5.1.1", 1),
      short("Calcule la puissance continue.", ["1.2", "1,2", "1.2 W", "1,2 W"], "P=30×0,2²=1,2 W.", "Exercice 5.1.2", 2),
      short("En alternatif, calcule l’impédance Z.", ["60", "60 Ω", "60 ohm", "60 ohms"], "Z=6/0,1=60 Ω.", "Contrôle complémentaire", 1),
      short("Calcule la puissance apparente S.", ["0.6", "0,6", "0.6 VA", "0,6 VA"], "S=6×0,1=0,6 VA.", "Exercice 5.2", 1),
      short("Calcule la puissance moyenne alternative.", ["0.3", "0,3", "0.3 W", "0,3 W"], "P=30×0,1²=0,3 W.", "Exercice 5.2.1", 2),
      short("Calcule le facteur de puissance.", ["0.5", "0,5"], "cosφ=0,3/0,6=0,5.", "Exercice 5.2.2", 2),
      short("Donne |φ| en degrés.", ["60", "60°", "60 deg", "60 degrés"], "arccos(0,5)=60°.", "Complément", 1),
      short("Calcule XL au centième près.", ["51.96", "51,96", "51.96 Ω", "51,96 Ω"], "XL=√(60²−30²)≈51,96 Ω.", "Contrôle complémentaire", 2),
      short("Calcule L en henrys au millième près.", ["0.165", "0,165", "0.165 H", "0,165 H"], "L≈0,165 H.", "Contrôle complémentaire", 2),
      choice("Pourquoi le courant alternatif est-il plus faible ici ?", ["La bobine ajoute une réactance", "La résistance R a disparu", "La tension vaut zéro", "La fréquence est négative"], 0, "L’impédance du RL dépasse R.", "Interprétation"),
      choice("Dans la chaîne électrique, la tension est élevée…", ["avant le transport longue distance", "uniquement dans la maison", "après tout usage", "pour augmenter les pertes"], 0, "Le poste élévateur réduit le courant de ligne.", "Documentation"),
      choice("Le poste proche des utilisateurs sert surtout à…", ["abaisser la tension", "augmenter les pertes", "annuler la puissance", "créer la fréquence"], 0, "La distribution exige une tension adaptée aux usages.", "Documentation"),
      short("Défi : calcule I pour 20 kW, 20 kV et cosφ=0,80.", ["1.25", "1,25", "1.25 A", "1,25 A"], "I=20 000/(20 000×0,80)=1,25 A.", "Mission finale", 2),
      short("Avec Rligne=4 Ω et I=1,25 A, calcule PJ.", ["6.25", "6,25", "6.25 W", "6,25 W"], "PJ=4×1,25²=6,25 W.", "Mission finale", 2),
      short("Si la tension est divisée par 10 à puissance fixée, par combien les pertes sont-elles multipliées ?", ["100", "par 100", "100 fois"], "Le courant est multiplié par 10, donc I² par 100.", "Mission finale", 2),
    ],
    corrections: [
      "Pages 7-8 : les affirmations sanitaires datées de l’article annexe ne servent pas de conclusion scientifique dans le parcours ; seules la structure du réseau et la réduction des pertes sont retenues comme contenu de physique.",
      "Page 7 : les plages de tension et les longueurs sont présentées comme données du réseau français cité, sans les généraliser à la Côte d’Ivoire.",
    ],
  },
];

const levelOrder = [
  "ac-power-instantaneous",
  "ac-power-average-apparent-energy",
  "ac-power-factor-transport",
  "ac-power-rlc-frequency",
  "ac-power-half-power-band",
  "ac-power-official-exercises-one-two",
  "ac-power-official-exercise-three",
  "ac-power-official-exercise-four",
  "ac-power-official-exercise-five-grid-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau de puissance en courant alternatif introuvable : " + id);
  return officialLevel(index, level);
});

export const acPowerPath: LearningPath = {
  id: "terminale-cd-ac-power",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Leçon 15 en Terminale C • Leçon 13 en Terminale D",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/15952-tle-d-phy-l15-puissance-en-courant-alternatif-by-tehua",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 15,
  title: "Puissance en courant alternatif",
  description: "Distinguer puissance instantanée, active et apparente, maîtriser le facteur de puissance, limiter les pertes de transport et résoudre les cinq exercices officiels.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Établir p(t)=UI[cos(2ωt+φ)+cosφ] à partir de u(t) et i(t).",
    "Calculer P=UIcosφ, S=UI, cosφ=P/S et E=PΔt.",
    "Expliquer pourquoi la haute tension et un bon facteur de puissance réduisent les pertes Joule.",
    "Exprimer et exploiter la puissance P(ω) d’un circuit RLC série.",
    "Relier les fréquences de demi-puissance à la bande passante.",
    "Résoudre les cinq exercices officiels en contrôlant les résistances totales, phases et unités.",
    "Transférer les relations de puissance à une chaîne de transport électrique.",
  ],
  modules: [{
    id: "ac-power-mastery",
    title: "Maîtriser la puissance en régime sinusoïdal",
    description: "Des signaux instantanés au transport sous haute tension, neuf niveaux fidèles aux huit pages du support ivoirien.",
    lessons: builtLevels,
  }],
};

export const acPowerPaths: LearningPath[] = [acPowerPath];
