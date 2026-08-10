import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 17 de Physique en Terminale C. Cette leçon d'optique quantique
// n'appartient pas à la progression de Terminale D.
const sourceDocument = "Tle D PHY L17 Modèle corpusculaire Lumière by Tehua.pdf";

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
      introduction: "Identifie d'abord le système et son état initial, distingue absorption et émission, puis travaille avec des énergies positives pour le photon.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : une flèche monte quand l'atome absorbe ; elle descend quand il émet. Plus λ est petite, plus le photon est énergétique.",
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

// Axe des fréquences exprimé en 10^14 Hz et énergie cinétique maximale en eV
// pour un métal pédagogique de travail d'extraction W0 = 2,00 eV.
const photoelectricThreshold = 2 / 0.4135668;
const photoelectricPoints: Array<[number, number]> = [photoelectricThreshold, 5, 6, 7, 8, 9]
  .map((frequencyUnit): [number, number] => [
    Number(frequencyUnit.toFixed(4)),
    Number(Math.max(0, 0.4135668 * frequencyUnit - 2).toFixed(4)),
  ]);

const photonEnergyPoints: Array<[number, number]> = [100, 121.6, 200, 400, 589, 656, 800, 1000]
  .map((wavelengthNanometres): [number, number] => [
    wavelengthNanometres,
    Number((1239.842 / wavelengthNanometres).toFixed(4)),
  ]);

const hydrogenEnergyPoints: Array<[number, number]> = Array.from(
  { length: 8 },
  (_, index): [number, number] => {
    const n = index + 1;
    return [n, Number((-13.6 / n ** 2).toFixed(4))];
  },
);

const levels: LevelSeed[] = [
  {
    id: "corpuscular-light-photoelectric-photons",
    title: "Reconnaître le photon et l'effet photoélectrique",
    summary: "Passer du faisceau lumineux aux photons et comprendre pourquoi une lumière suffisamment énergétique peut extraire des électrons d'un matériau.",
    pages: "1, 10-11",
    section: "Effet photoélectrique, photon et documentation",
    durationMinutes: 24,
    xp: 45,
    kind: "concept",
    body: String.raw`## Une lumière faite de photons

Le modèle ondulatoire explique la diffraction et les interférences. D'autres expériences, comme l'**effet photoélectrique**, obligent à décrire aussi la lumière comme un ensemble de grains d'énergie : les **photons**. Ces deux modèles ne s'annulent pas ; ils décrivent deux manifestations complémentaires de la lumière.

Un photon possède :

- une charge électrique nulle ;
- une masse **au repos** nulle ;
- une énergie liée à sa fréquence ;
- dans le vide, une vitesse égale à $c\simeq3{,}00\times10^8\ \text{m·s}^{-1}$.

Dire « masse au repos nulle » est plus précis que dire simplement « sans masse » : un photon transporte bien de l'énergie et de la quantité de mouvement.

## Effet photoélectrique

Lorsqu'une surface, souvent métallique, reçoit de la lumière, elle peut émettre des électrons. Cette émission n'a lieu que si chaque photon apporte au moins l'énergie minimale $W_0$ nécessaire pour extraire un électron :

$$E_\gamma=h\nu\geq W_0$$

La fréquence limite du matériau est donc :

$$\nu_0=\frac{W_0}{h}$$

- si $\nu<\nu_0$, aucun électron n'est extrait, même si la lumière est très intense ;
- si $\nu\geq\nu_0$, l'émission devient possible ;
- augmenter l'intensité à fréquence fixée augmente surtout le **nombre de photons**, donc le nombre d'électrons émis, pas l'énergie de chaque photon.

## Ce que prouve l'expérience

L'énergie arrive par paquets. Un électron ne peut pas accumuler progressivement des fractions d'énergie provenant de photons trop faibles dans le modèle élémentaire. Il interagit avec un photon d'énergie déterminée. C'est la fréquence, et non l'intensité seule, qui décide si le seuil est franchi.

> **Correction de classement.** La couverture annonce « Réactions nucléaires ». La progression ivoirienne classe cette leçon dans le thème **La lumière : onde ou particule**.` ,
    keyPoint: "Un photon est neutre, de masse au repos nulle, et l'effet photoélectrique exige hν≥W0.",
    example: "Une lumière plus intense mais de fréquence inférieure à ν0 apporte davantage de photons trop peu énergétiques : elle n'arrache toujours aucun électron.",
    methodSteps: [
      "Repère le matériau éclairé et l'électron éventuellement extrait.",
      "Identifie la fréquence ν ou la longueur d'onde λ de la lumière.",
      "Compare l'énergie hν au travail d'extraction W0.",
      "Conclue : pas d'émission, émission au seuil ou émission avec énergie cinétique.",
      "Distingue toujours l'effet d'une fréquence plus grande de celui d'une intensité plus grande.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Expérience",
      title: "Un photon peut libérer un électron",
      instruction: "Sélectionne les repères pour suivre l'énergie depuis le faisceau jusqu'à l'électron extrait.",
      observation: "Le métal ne répond pas à l'intensité seule : chaque photon doit franchir le travail d'extraction du matériau.",
      caption: "Schéma pédagogique original de l'effet photoélectrique, sans reprise de la figure du PDF.",
      viewBox: "0 0 560 260",
      shapes: [
        { shape: "path", d: "M25 112 H120 V148 H25 Z", tone: "soft" },
        { shape: "text", x: 72, y: 136, content: "LUMIÈRE", anchor: "middle" },
        { shape: "line", x1: 120, y1: 130, x2: 305, y2: 130, tone: "accent" },
        { shape: "path", d: "M285 118 L305 130 L285 142 Z", tone: "accent" },
        { shape: "path", d: "M325 82 H535 V205 H325 Z", tone: "fill" },
        { shape: "text", x: 430, y: 188, content: "métal", anchor: "middle" },
        { shape: "circle", cx: 372, cy: 112, r: 9, tone: "soft" },
        { shape: "circle", cx: 430, cy: 134, r: 9, tone: "soft" },
        { shape: "circle", cx: 485, cy: 106, r: 9, tone: "soft" },
        { shape: "line", x1: 430, y1: 126, x2: 470, y2: 55, tone: "muted" },
        { shape: "path", d: "M460 65 L470 55 L471 70 Z", tone: "muted" },
        { shape: "circle", cx: 475, cy: 47, r: 9, tone: "accent" },
        { shape: "text", x: 476, y: 24, content: "e⁻", anchor: "middle" },
      ],
      hotspots: [
        { id: "beam", number: 1, label: "Photons incidents", detail: "À fréquence fixée, chaque photon transporte la même énergie Eγ=hν.", x: 185, y: 105 },
        { id: "surface", number: 2, label: "Travail d'extraction", detail: "Le matériau retient l'électron avec une énergie minimale W0 qui fixe la fréquence seuil ν0.", x: 330, y: 130 },
        { id: "electron", number: 3, label: "Électron émis", detail: "Si hν≥W0, l'électron peut sortir ; l'excédent devient son énergie cinétique maximale.", x: 475, y: 48 },
        { id: "intensity", number: 4, label: "Rôle de l'intensité", detail: "Au-dessus du seuil, plus de photons par seconde donnent généralement plus d'électrons par seconde.", x: 110, y: 180 },
      ],
    },
    questions: [
      choice("L'effet photoélectrique correspond à…", ["l'émission d'électrons sous l'action de la lumière", "la diffraction d'une onde sonore", "la fusion de deux noyaux", "la charge d'un condensateur"], 0, "La lumière peut extraire des électrons d'un matériau convenable.", "Page 1"),
      choice("Le photon porte une charge électrique…", ["nulle", "positive", "négative", "variable avec la couleur"], 0, "Le photon est électriquement neutre.", "Page 1"),
      choice("La formulation scientifique précise est…", ["masse au repos nulle", "masse toujours négative", "masse égale à celle du proton", "charge au repos nulle uniquement"], 0, "Le photon a une masse invariante ou masse au repos nulle.", "Correction scientifique"),
      short("Donne la célérité de la lumière dans le vide en m/s.", ["3e8", "3×10^8", "3,0×10^8", "3.00e8", "300000000"], "Dans le vide, c≈3,00×10⁸ m·s⁻¹.", "Page 11"),
      choice("Augmenter l'intensité à fréquence fixée augmente d'abord…", ["le nombre de photons", "l'énergie de chaque photon", "la charge du photon", "la valeur de h"], 0, "L'énergie individuelle dépend de ν ; l'intensité augmente le flux de photons.", "Page 1"),
      choice("Sous la fréquence seuil ν0…", ["il n'y a pas d'émission dans le modèle élémentaire", "tout électron est émis", "h devient nul", "la lumière devient sonore"], 0, "Chaque photon est trop peu énergétique pour franchir W0.", "Explication ajoutée"),
      short("Complète la condition de seuil : hν … W0.", [">=", "≥", "superieur ou egal", "supérieur ou égal"], "L'émission est possible pour hν≥W0.", "Effet photoélectrique"),
      choice("La fréquence limite d'un matériau vaut…", ["W0/h", "h/W0", "cW0", "W0+c"], 0, "ν0=W0/h.", "Effet photoélectrique"),
      choice("La diffraction et l'effet photoélectrique montrent que la lumière…", ["possède une dualité onde-corpuscule", "est uniquement une onde sonore", "est uniquement de la matière massive", "ne transporte aucune énergie"], 0, "Les deux modèles décrivent des observations différentes.", "Documentation"),
      choice("À fréquence plus grande, l'énergie d'un photon est…", ["plus grande", "plus petite", "toujours nulle", "indépendante de ν"], 0, "Eγ=hν est proportionnelle à ν.", "Page 11"),
      choice("Le travail d'extraction W0 dépend principalement…", ["du matériau", "du nombre de pages du cours", "de la masse de la Terre", "de la distance écran-fente"], 0, "Chaque matériau possède un seuil photoélectrique propre.", "Complément"),
      choice("Une lumière très intense mais trop rouge pour le seuil…", ["n'extrait pas d'électron", "extrait forcément tous les électrons", "augmente h", "rend le photon chargé"], 0, "L'intensité ne compense pas une énergie individuelle insuffisante.", "Bilan"),
      choice("Le thème correct de la leçon est…", ["La lumière : onde ou particule", "Réactions nucléaires", "Mécanique", "Acides et bases"], 0, "Le titre de thème de la couverture est une coquille.", "Correction de classement"),
    ],
    corrections: [
      "Page 1 : le thème « Réactions nucléaires » est remplacé par le thème officiel « La lumière : onde ou particule ».",
      "Pages 1 et 11 : « particule sans masse » est précisé en « masse au repos nulle », et la vitesse c est explicitement limitée au vide.",
      "Page 1 : l'effet photoélectrique est complété par la fréquence seuil, indispensable pour l'expliquer et pas seulement le définir.",
    ],
  },
  {
    id: "corpuscular-light-planck-einstein",
    title: "Calculer l'énergie d'un photon",
    summary: "Utiliser la relation de Planck-Einstein, convertir joules et électronvolts, puis relier correctement fréquence et longueur d'onde.",
    pages: "1, 5, 11",
    section: "Théorie des quanta et relation de Planck-Einstein",
    durationMinutes: 25,
    xp: 55,
    kind: "graph",
    body: String.raw`## Le quantum d'énergie

Un photon transporte un **quantum** d'énergie. Le pluriel de quantum est **quanta** : un photon ne « possède pas un quanta », il porte un quantum. La relation de Planck-Einstein s'écrit :

$$\boxed{E_\gamma=h\nu}$$

avec $h=6{,}626\times10^{-34}\ \text{J·s}$ et $\nu$ en hertz. Dans le vide, $c=\lambda\nu$, donc :

$$\boxed{E_\gamma=\frac{hc}{\lambda}}$$

Cette dernière forme montre immédiatement que l'énergie est inversement proportionnelle à la longueur d'onde : petite $\lambda$ signifie photon très énergétique.

## Joule et électronvolt

L'unité SI est le joule. En physique atomique, l'électronvolt est plus pratique :

$$1\ \text{eV}=1{,}602\times10^{-19}\ \text{J}$$

On utilise donc :

$$E(\text{eV})=\frac{E(\text{J})}{1{,}602\times10^{-19}}$$

Avec $\lambda$ en nanomètres, une écriture-mémoire très utile est :

$$\boxed{E_\gamma(\text{eV})\simeq\frac{1240}{\lambda(\text{nm})}}$$

## Équation d'Einstein pour l'effet photoélectrique

L'énergie du photon sert d'abord à vaincre le travail d'extraction $W_0$. L'excédent devient l'énergie cinétique maximale :

$$\boxed{E_{c,\max}=h\nu-W_0}$$

Au seuil, $E_{c,\max}=0$ et $h\nu_0=W_0$. La courbe $E_{c,\max}=f(\nu)$ est donc une droite de pente $h$, à partir de $\nu_0$. Avant le seuil, il n'y a pas de photoélectron : on ne prolonge pas physiquement la droite vers des énergies cinétiques négatives.

## Contrôle rapide

Pour $\lambda=400\ \text{nm}$ :

$$E_\gamma\simeq\frac{1240}{400}=3{,}10\ \text{eV}$$

Pour un matériau tel que $W_0=2{,}00\ \text{eV}$, l'électron peut sortir avec $E_{c,\max}=1{,}10\ \text{eV}$.` ,
    keyPoint: "Eγ=hν=hc/λ ; 1 eV=1,602×10⁻¹⁹ J ; Ec,max=hν−W0.",
    example: "À 620 nm, Eγ≈1240/620=2,00 eV : cette radiation est exactement au seuil d'un matériau de travail W0=2,00 eV.",
    methodSteps: [
      "Convertis λ en mètres pour utiliser hc/λ, ou garde les nm avec 1240/λ.",
      "Calcule l'énergie du photon dans l'unité demandée.",
      "Si le problème est photoélectrique, compare Eγ à W0.",
      "Au-dessus du seuil, calcule Ec,max=Eγ−W0.",
      "Vérifie le sens physique : diminuer λ doit augmenter Eγ.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Loi d'Einstein",
      title: "Énergie cinétique au-dessus du seuil",
      instruction: "Déplace le point sur la fréquence, exprimée en 10¹⁴ Hz, pour suivre l'énergie cinétique maximale d'un métal de travail W0=2,00 eV.",
      observation: "La droite commence au seuil ν0≈4,84×10¹⁴ Hz ; sa pente traduit la constante de Planck.",
      formula: "Ec,max = hν − W0",
      formulaTex: "E_{c,\\max}=h\\nu-W_0",
      rule: { kind: "samples", points: photoelectricPoints },
      window: { xMin: 4.5, xMax: 9.2, yMin: -0.1, yMax: 2 },
      guides: [{ kind: "vertical", value: photoelectricThreshold, label: "ν₀" }],
      marker: { min: 4.8, max: 9, step: 0.1, initial: 6 },
    },
    questions: [
      choice("La relation de Planck-Einstein est…", ["Eγ=hν", "Eγ=h/ν", "Eγ=cν", "Eγ=λ/h"], 0, "L'énergie d'un photon vaut hν.", "Page 1"),
      choice("Dans le vide, Eγ peut aussi s'écrire…", ["hc/λ", "hλ/c", "cλ/h", "λ/(hc)"], 0, "Comme ν=c/λ, Eγ=hc/λ.", "Page 11"),
      short("Donne la valeur approchée de h en J·s.", ["6.626e-34", "6,626×10^-34", "6,626×10⁻³⁴", "6.63e-34"], "h≈6,626×10⁻³⁴ J·s.", "Page 1"),
      short("Convertis 1 eV en joules.", ["1.6e-19", "1,6e-19", "1,6×10^-19", "1,602×10⁻¹⁹ J"], "1 eV≈1,602×10⁻¹⁹ J.", "Page 5"),
      short("Calcule l'énergie en eV d'un photon de 400 nm.", ["3.1", "3,1", "3.10", "3,10 eV"], "E≈1240/400=3,10 eV.", "Application guidée", 2),
      short("Calcule l'énergie en eV d'un photon de 620 nm.", ["2", "2.0", "2,00", "2 eV"], "E≈1240/620=2,00 eV.", "Application guidée"),
      choice("Quand λ diminue, l'énergie du photon…", ["augmente", "diminue", "reste toujours nulle", "devient indépendante de h"], 0, "Eγ=hc/λ.", "Page 11"),
      choice("Le singulier correct est…", ["un quantum", "un quanta", "une quantas", "un photonnes"], 0, "Quantum est singulier ; quanta est pluriel.", "Correction terminologique"),
      short("Pour W0=2,00 eV et Eγ=3,10 eV, calcule Ec,max.", ["1.1", "1,1", "1.10", "1,10 eV"], "Ec,max=3,10−2,00=1,10 eV.", "Effet photoélectrique", 2),
      choice("Au seuil photoélectrique, Ec,max vaut…", ["0", "W0", "h", "c"], 0, "Toute l'énergie du photon sert alors à l'extraction.", "Seuil"),
      choice("La pente de Ec,max=f(ν) représente…", ["la constante de Planck h", "la célérité c", "la charge du photon", "la masse du métal"], 0, "Ec,max=hν−W0 est affine de pente h.", "Graphique"),
      short("Un photon de 2,50 eV frappe un métal de W0=3,00 eV. Combien de photoélectrons dans le modèle élémentaire ?", ["0", "aucun", "zero", "zéro"], "Le photon est sous le seuil ; il n'y a pas d'émission.", "Seuil"),
      choice("Augmenter l'intensité sans changer ν modifie surtout…", ["le nombre de photons", "la valeur de h", "la fréquence seuil du métal", "l'énergie individuelle hν"], 0, "Le flux de photons augmente, pas leur énergie individuelle.", "Bilan"),
    ],
    corrections: [
      "Page 1 : « un paquet d'énergie appelé quanta » est corrigé en « un quantum d'énergie » ; quanta est le pluriel.",
      "Pages 1 et 11 : les unités et la conversion eV↔J sont harmonisées ; la relation photoélectrique d'Einstein est ajoutée pour expliquer le phénomène demandé par le programme.",
    ],
  },
  {
    id: "corpuscular-light-quantized-transitions-spectra",
    title: "Interpréter transitions et spectres atomiques",
    summary: "Relier les niveaux d'énergie discrets aux photons absorbés ou émis et distinguer un spectre de raies d'émission d'un spectre d'absorption.",
    pages: "1-2",
    section: "Quantification de l'énergie et spectres atomiques",
    durationMinutes: 26,
    xp: 65,
    kind: "concept",
    body: String.raw`## Des niveaux autorisés, pas une énergie continue

L'énergie d'un atome est **quantifiée** : l'atome ne peut occuper que certains niveaux $E_1,E_2,E_3,\ldots$ Un état de plus grande énergie est dit **excité**. Le niveau stable le plus bas est l'**état fondamental**.

Lors d'une transition de l'état initial $E_i$ vers l'état final $E_f$, la variation d'énergie de l'atome est :

$$\Delta E_{\text{atome}}=E_f-E_i$$

Le photon échangé possède toujours une énergie positive :

$$E_\gamma=h\nu=\frac{hc}{\lambda}=|E_f-E_i|$$

## Émission et absorption

- **émission** : $E_f<E_i$, l'atome perd de l'énergie et la flèche descend ;
- **absorption** : $E_f>E_i$, l'atome gagne de l'énergie et la flèche monte.

Une transition d'émission peut se terminer sur n'importe quel niveau inférieur autorisé, pas obligatoirement sur le niveau fondamental. Inversement, un photon n'est absorbé que si son énergie correspond exactement à une différence de niveaux, tant qu'elle reste sous le seuil d'ionisation.

## Spectre d'émission

On excite d'abord les atomes. Lorsqu'ils reviennent vers des niveaux inférieurs, ils émettent des photons de quelques énergies précises. On observe des **raies lumineuses sur fond sombre**. L'ensemble des raies constitue une signature de l'élément.

## Spectre d'absorption

Une lumière à spectre continu traverse un gaz plus froid. Les atomes absorbent certaines radiations autorisées : on observe des **raies sombres sur fond continu**. Les longueurs d'onde absorbées correspondent à des transitions possibles vers des niveaux supérieurs.

Les raies d'émission et d'absorption associées aux mêmes niveaux ont les mêmes longueurs d'onde idéales. Il est cependant trop vague de dire que les deux spectres sont simplement « complémentaires » : l'intensité des raies dépend aussi des populations d'états et des conditions expérimentales.

## Phrase reconstruite correctement

La formulation attendue par l'activité devient : **« L'effet photoélectrique est l'émission d'électrons par une matière convenable frappée par un rayonnement électromagnétique. »**` ,
    keyPoint: "Photon échangé : Eγ=|Ef−Ei| ; flèche descend = émission, flèche monte = absorption.",
    example: "Entre Ei=−1,5 eV et Ef=−3,4 eV, l'atome émet un photon de 1,9 eV car Ef<Ei.",
    methodSteps: [
      "Repère le niveau initial Ei et le niveau final Ef.",
      "Calcule ΔEatome=Ef−Ei en conservant les signes.",
      "Utilise |ΔE| pour l'énergie positive du photon.",
      "Conclue émission si la flèche descend, absorption si elle monte.",
      "Relie l'énergie à la fréquence ou à la longueur d'onde du spectre.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Lecture",
      title: "Du niveau d'énergie à la raie spectrale",
      instruction: "Sélectionne chaque carte pour suivre le mécanisme d'émission ou d'absorption.",
      observation: "Les mêmes écarts d'énergie expliquent les raies brillantes émises et les raies sombres absorbées.",
      rootLabel: "Atome quantifié",
      rootDetail: "L'atome n'échange que des photons compatibles avec ses différences d'énergie autorisées.",
      nodes: [
        { id: "excited", label: "État excité", role: "Énergie élevée", detail: "Un apport d'énergie a placé l'atome sur un niveau supérieur autorisé.", group: "Niveaux" },
        { id: "emission", label: "Émission", role: "Flèche descendante", detail: "L'atome perd |Ef−Ei| et un photon de cette énergie est créé.", group: "Transitions" },
        { id: "emission-spectrum", label: "Raie brillante", role: "Spectre d'émission", detail: "La fréquence de la raie vérifie hν=|Ef−Ei|.", group: "Spectres" },
        { id: "absorption", label: "Absorption", role: "Flèche montante", detail: "Un photon compatible disparaît et l'atome gagne son énergie.", group: "Transitions" },
        { id: "absorption-spectrum", label: "Raie sombre", role: "Spectre d'absorption", detail: "La radiation retirée du fond continu correspond à une transition autorisée.", group: "Spectres" },
      ],
    },
    questions: [
      choice("Une énergie atomique quantifiée signifie que…", ["seules certaines valeurs sont permises", "toutes les valeurs sont permises", "l'énergie est toujours nulle", "l'atome n'a aucun électron"], 0, "Les niveaux d'énergie sont discrets.", "Page 1"),
      choice("Le niveau le plus bas est appelé…", ["état fondamental", "état ionisé", "spectre continu", "photon seuil"], 0, "L'état fondamental est l'état stable de plus faible énergie.", "Page 2"),
      short("Écris l'énergie du photon échangé entre Ei et Ef.", ["|Ef-Ei|", "abs(Ef-Ei)", "|E_f-E_i|", "hnu", "hν"], "Eγ=|Ef−Ei|=hν.", "Pages 1-2"),
      choice("Une flèche descendante représente…", ["une émission", "une absorption", "une ionisation nécessaire", "une absence de transition"], 0, "L'atome perd de l'énergie.", "Quantification"),
      choice("Une flèche montante représente…", ["une absorption", "une émission", "une baisse d'énergie", "une diffraction"], 0, "L'atome gagne l'énergie du photon absorbé.", "Quantification"),
      choice("Lors d'une émission, l'état final doit être…", ["plus bas que l'état initial", "toujours ionisé", "toujours fondamental", "de même énergie seulement"], 0, "Une émission accompagne une perte d'énergie.", "Correction page 2"),
      choice("Un spectre d'émission présente idéalement…", ["des raies brillantes sur fond sombre", "des raies sombres sur fond continu", "une seule couleur toujours", "aucune fréquence"], 0, "Les photons émis donnent des raies lumineuses.", "Page 2"),
      choice("Un spectre d'absorption présente idéalement…", ["des raies sombres sur fond continu", "des raies brillantes sur fond noir", "une tache de diffraction", "un courant continu"], 0, "Certaines radiations ont été retirées du spectre incident.", "Page 2"),
      choice("Pourquoi un spectre atomique comporte-t-il des raies ?", ["les écarts d'énergie sont discrets", "h varie d'un atome à l'autre", "la lumière n'a aucune énergie", "les électrons sont immobiles dans tous les cas"], 0, "Chaque raie correspond à une différence de niveaux.", "Exercice 2"),
      short("Pour Ei=−1,51 eV et Ef=−3,40 eV, donne l'énergie du photon.", ["1.89", "1,89", "1,89 eV", "1.9", "1,9 eV"], "|−3,40−(−1,51)|=1,89 eV.", "Exemple", 2),
      choice("Dans l'exemple précédent, la transition est…", ["une émission", "une absorption", "une ionisation", "impossible par définition"], 0, "Ef<Ei : l'atome émet.", "Exemple"),
      choice("Sous le seuil d'ionisation, un photon est absorbé si…", ["son énergie correspond à un écart autorisé", "son énergie est quelconque", "son intensité est nulle", "sa fréquence vaut toujours c"], 0, "L'absorption liée-liée est sélective.", "Complément"),
      choice("Les raies d'un élément constituent…", ["une signature spectrale", "une masse nucléaire", "une résistance électrique", "un mouvement uniforme"], 0, "Les niveaux propres à l'élément donnent un spectre caractéristique.", "Page 2"),
      choice("La phrase correcte de l'activité commence par…", ["L'effet photoélectrique est l'émission d'électrons…", "L'effet photoélectrique est la fusion de noyaux…", "Un photon est un proton…", "Le spectre est toujours continu…"], 0, "La phrase source est réordonnée et accordée correctement.", "Activité 1"),
    ],
    corrections: [
      "Page 2 : un atome excité peut émettre vers tout niveau inférieur autorisé, et pas uniquement vers le niveau fondamental.",
      "Page 2 : la phrase de l'activité 1 est réordonnée et ses accords grammaticaux sont corrigés.",
      "Page 2 : le mot « complémentaire » est nuancé ; émission et absorption partagent des longueurs d'onde autorisées sans imposer des intensités parfaitement complémentaires.",
    ],
  },
  {
    id: "corpuscular-light-hydrogen-levels-ionization",
    title: "Construire les niveaux d'énergie de l'hydrogène",
    summary: "Exploiter En=−13,6/n², reconnaître l'état fondamental, les états excités et la limite d'ionisation de l'atome d'hydrogène.",
    pages: "2-3",
    section: "Niveaux d'énergie de l'atome d'hydrogène et activité 2",
    durationMinutes: 27,
    xp: 75,
    kind: "graph",
    body: String.raw`## Le modèle énergétique de l'hydrogène

Pour l'atome d'hydrogène, les niveaux liés sont décrits par :

$$\boxed{E_n=-\frac{13{,}6}{n^2}\ \text{eV}}\qquad n\in\mathbb{N}^*$$

Le nombre $n$ est un entier positif. Les premières valeurs sont :

| Niveau | Énergie | État |
|---:|---:|---|
| $n=1$ | $E_1=-13{,}6\ \text{eV}$ | fondamental |
| $n=2$ | $E_2=-3{,}40\ \text{eV}$ | excité |
| $n=3$ | $E_3=-1{,}51\ \text{eV}$ | excité |
| $n=4$ | $E_4=-0{,}85\ \text{eV}$ | excité |
| $n\to\infty$ | $E_\infty=0$ | atome ionisé |

Les valeurs négatives signifient que l'électron est **lié** au noyau. Le zéro d'énergie est choisi pour un électron libre, infiniment éloigné du proton et sans énergie cinétique.

## Énergie d'ionisation

Ioniser l'atome depuis le fondamental demande :

$$E_i=E_\infty-E_1=0-(-13{,}6)=13{,}6\ \text{eV}$$

En joules :

$$E_i=13{,}6\times1{,}602\times10^{-19}\simeq2{,}18\times10^{-18}\ \text{J}$$

Cette énergie est positive : il faut fournir de l'énergie pour libérer l'électron. L'**énergie de liaison** du fondamental a la même valeur absolue, $13{,}6\ \text{eV}$, tandis que l'énergie du niveau reste $-13{,}6\ \text{eV}$.

## Comment lire le diagramme

Quand $n$ augmente, les niveaux se rapprochent et tendent vers $0$. Ils ne sont pas régulièrement espacés. Une transition entre deux niveaux liés exige exactement l'écart d'énergie correspondant. Une énergie au moins égale à l'énergie d'ionisation permet une transition vers le continuum.

## Activité 2 du support

1. La bonne loi est $E_n=-13{,}6/n^2$ : réponse **a**.
2. $E=0$ correspond à l'état ionisé : réponse **c**.
3. L'énergie d'ionisation vaut $+13{,}6\ \text{eV}$ : réponse **b**.` ,
    keyPoint: "Hydrogène : En=−13,6/n² eV ; E1=−13,6 eV ; E∞=0 ; Ei=+13,6 eV.",
    example: "Pour n=3, E3=−13,6/9≈−1,51 eV ; il faut 12,09 eV depuis le fondamental pour atteindre ce niveau.",
    methodSteps: [
      "Vérifie que n est un entier positif.",
      "Calcule n² avant de diviser 13,6.",
      "Conserve le signe négatif pour tout état lié.",
      "Place E=0 au-dessus des niveaux : c'est la limite d'ionisation.",
      "Pour une transition, soustrais toujours énergie finale moins énergie initiale.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Niveaux discrets",
      title: "Les énergies se resserrent vers zéro",
      instruction: "Déplace le point de n=1 à n=8. La ligne relie les repères pour guider l'œil, mais seuls les points entiers sont des niveaux permis.",
      observation: "L'écart entre niveaux diminue quand n augmente ; la limite E=0 correspond à l'ionisation.",
      formula: "En = −13,6/n²",
      formulaTex: "E_n=-\\frac{13{,}6}{n^2}",
      rule: { kind: "samples", points: hydrogenEnergyPoints },
      window: { xMin: 1, xMax: 8, yMin: -14, yMax: 0.5 },
      guides: [{ kind: "horizontal", value: 0, label: "Ionisation" }],
      marker: { min: 1, max: 8, step: 1, initial: 1 },
    },
    questions: [
      choice("La loi des niveaux liés de l'hydrogène est…", ["En=−13,6/n²", "En=+13,6n²", "En=−13,6/n", "En=0 pour tout n"], 0, "La dépendance correcte est en −1/n².", "Page 2"),
      short("Donne la valeur de n à l'état fondamental.", ["1", "n=1"], "L'état fondamental correspond à n=1.", "Page 2"),
      short("Calcule E1 en eV.", ["-13.6", "-13,6", "−13,6 eV"], "E1=−13,6 eV.", "Page 2"),
      short("Calcule E2 en eV.", ["-3.4", "-3,4", "-3.40", "−3,40 eV"], "E2=−13,6/4=−3,40 eV.", "Page 2"),
      short("Calcule E3 en eV au centième.", ["-1.51", "-1,51", "−1,51 eV"], "E3=−13,6/9≈−1,51 eV.", "Page 2"),
      short("Calcule E4 en eV.", ["-0.85", "-0,85", "−0,85 eV"], "E4=−13,6/16=−0,85 eV.", "Page 2"),
      choice("Le niveau E=0 correspond à…", ["l'atome ionisé", "l'état fondamental", "n=2", "une énergie négative"], 0, "À E=0, l'électron n'est plus lié.", "Activité 2"),
      short("Calcule l'énergie d'ionisation depuis le fondamental en eV.", ["13.6", "13,6", "+13,6", "13,6 eV"], "Ei=0−(−13,6)=13,6 eV.", "Page 3"),
      choice("Pourquoi les niveaux liés ont-ils une énergie négative ?", ["le zéro est choisi pour l'électron libre", "l'énergie physique est interdite", "h est négative", "le photon est chargé"], 0, "Il faut fournir de l'énergie pour atteindre le continuum E=0.", "Interprétation"),
      choice("Quand n augmente, En…", ["se rapproche de 0 par valeurs négatives", "tend vers −∞", "reste à −13,6", "devient immédiatement positive"], 0, "Le terme −13,6/n² tend vers 0−.", "Diagramme"),
      choice("Dans l'activité 2, la réponse à la question 1 est…", ["a", "b", "c", "aucune"], 0, "La proposition a donne −13,6/n².", "Activité 2"),
      choice("Dans l'activité 2, la réponse à la question 2 est…", ["c", "a", "b", "aucune"], 0, "E=0 est l'état ionisé.", "Activité 2"),
      choice("Dans l'activité 2, la réponse à la question 3 est…", ["b", "a", "c", "aucune"], 0, "L'énergie à fournir est positive : +13,6 eV.", "Activité 2"),
      short("Calcule E5 en eV au millième.", ["-0.544", "-0,544", "−0,544 eV"], "E5=−13,6/25=−0,544 eV.", "Prolongement"),
    ],
    corrections: [
      "Pages 2-3 : le niveau E=0 est explicitement distingué des niveaux liés ; le signe positif de l'énergie d'ionisation est maintenu.",
      "Page 2 : la légende ambiguë des niveaux 3 et 4 est remplacée par les valeurs En et les nombres n correspondants.",
    ],
  },
  {
    id: "corpuscular-light-sodium-evaluation",
    title: "Résoudre l'évaluation du sodium à 589 nm",
    summary: "Identifier un atome grâce à son énergie d'ionisation et décider s'il reste fondamental, s'excite ou s'ionise selon l'énergie du photon reçu.",
    pages: "3-4",
    section: "Situation d'évaluation : atome X et raie jaune",
    durationMinutes: 28,
    xp: 85,
    kind: "challenge",
    body: String.raw`## Données du diagramme

L'atome $X$ possède un état fondamental à $-5{,}14\ \text{eV}$ et plusieurs états excités, notamment $-3{,}03\ \text{eV}$. La limite d'ionisation est $0\ \text{eV}$. Son énergie de première ionisation vaut donc :

$$E_i=0-(-5{,}14)=5{,}14\ \text{eV}$$

Le tableau du support donne $13{,}6\ \text{eV}$ pour l'hydrogène, $5{,}39\ \text{eV}$ pour le lithium et $5{,}14\ \text{eV}$ pour le sodium. L'atome $X$ est donc le **sodium**.

## Raie jaune de 589 nm

L'énergie du photon est :

$$E_\gamma=\frac{hc}{\lambda}$$

Avec $\lambda=589\ \text{nm}$ :

$$E_\gamma\simeq3{,}37\times10^{-19}\ \text{J}\simeq2{,}105\ \text{eV}$$

Or :

$$|-3{,}03-(-5{,}14)|=2{,}11\ \text{eV}$$

La raie relie donc l'état fondamental $-5{,}14\ \text{eV}$ à l'état excité $-3{,}03\ \text{eV}$, dans la précision des données.

## Trois photons incidents

L'atome est d'abord au fondamental.

### Photon de 589 nm

Son énergie coïncide avec un écart autorisé : le photon est absorbé et l'atome atteint le niveau $-3{,}03\ \text{eV}$.

### Photon de 3,00 eV

Le niveau final supposé serait :

$$E_f=-5{,}14+3{,}00=-2{,}14\ \text{eV}$$

Aucun niveau du diagramme ne vaut $-2{,}14\ \text{eV}$ et $3{,}00<5{,}14$. Dans le modèle idéal, le photon n'est pas absorbé ; l'atome reste au fondamental.

### Photon de 6,00 eV

Cette énergie dépasse le seuil d'ionisation :

$$E_{c}=E_\gamma-E_i=6{,}00-5{,}14=0{,}86\ \text{eV}$$

L'atome est ionisé et l'électron emporte au maximum $0{,}86\ \text{eV}$ d'énergie cinétique.

> Les mentions « n=1 » et « n=2 » du corrigé sont seulement des rangs de niveaux sur ce diagramme du sodium. Il ne faut pas leur appliquer la formule $-13{,}6/n^2$, réservée à l'hydrogène.` ,
    keyPoint: "X=sodium ; 589 nm ↔ 2,105 eV ; 3 eV non absorbé ; 6 eV ionise avec Ec=0,86 eV.",
    example: "Le seuil du sodium est 5,14 eV : un photon de 5,50 eV ionise et laisse 0,36 eV à l'électron.",
    methodSteps: [
      "Lis l'énergie du fondamental et calcule Ei=0−Efondamental.",
      "Compare Ei au tableau pour identifier l'atome.",
      "Convertis chaque longueur d'onde en énergie de photon.",
      "Sous Ei, cherche une différence exacte entre niveaux.",
      "Au-dessus de Ei, calcule l'énergie cinétique par Eγ−Ei.",
    ],
    interaction: timeline([
      { label: "Fondamental", shortLabel: "−5,14 eV", detail: "La distance énergétique jusqu'à 0 donne Ei=5,14 eV." },
      { label: "Identification", shortLabel: "Sodium", detail: "Le tableau associe 5,14 eV au sodium." },
      { label: "Raie jaune", shortLabel: "589 nm", detail: "Le photon vaut environ 2,105 eV, soit l'écart entre −5,14 et −3,03 eV." },
      { label: "Photon 3 eV", shortLabel: "Pas d'absorption", detail: "Le niveau fictif −2,14 eV n'existe pas sur le diagramme." },
      { label: "Photon 6 eV", shortLabel: "Ionisation", detail: "6,00 eV dépasse 5,14 eV et laisse 0,86 eV à l'électron." },
    ], "Identifier puis tester les photons", "Suis l'ordre de résolution de la situation officielle.", "Le diagramme décide : écart exact sous le seuil, continuum au-dessus du seuil."),
    questions: [
      short("Calcule l'énergie d'ionisation de X en eV.", ["5.14", "5,14", "5,14 eV"], "Ei=0−(−5,14)=5,14 eV.", "Question 1.2", 2),
      choice("L'atome X est…", ["le sodium", "l'hydrogène", "le lithium", "l'hélium"], 0, "Le tableau associe 5,14 eV au sodium.", "Question 1.3"),
      short("Calcule l'énergie en joules du photon de 589 nm, à 0,01×10⁻¹⁹ près.", ["3.37e-19", "3,37e-19", "3,37×10^-19", "3,37×10⁻¹⁹ J"], "E=hc/λ≈3,37×10⁻¹⁹ J.", "Question 2.1", 2),
      short("Donne cette énergie en eV au centième.", ["2.11", "2,11", "2,11 eV", "2.1"], "E≈2,105 eV≈2,11 eV.", "Question 2.1"),
      choice("Les niveaux reliés par la raie jaune sont…", ["−5,14 eV et −3,03 eV", "−5,14 eV et 0 eV", "−3,03 eV et −0,38 eV", "−1,51 eV et 0 eV"], 0, "Leur écart vaut 2,11 eV.", "Question 2.2"),
      choice("Depuis le fondamental, le photon de 589 nm est…", ["absorbé", "toujours réfléchi", "sans énergie", "un neutron"], 0, "Son énergie correspond à la première transition indiquée.", "Question 3.1"),
      short("Quel niveau fictif donnerait un photon absorbé de 3 eV depuis −5,14 eV ?", ["-2.14", "-2,14", "−2,14 eV"], "Ef=−5,14+3,00=−2,14 eV.", "Question 3.2"),
      choice("Le photon de 3 eV est-il absorbé dans le modèle idéal ?", ["non", "oui, toujours", "oui, il ionise", "oui, il crée un proton"], 0, "Aucun niveau n'est à −2,14 eV et l'énergie est sous le seuil.", "Question 3.2"),
      choice("Un photon de 6 eV provoque…", ["l'ionisation", "une transition impossible sans effet", "la diffraction", "une fusion"], 0, "6 eV>5,14 eV.", "Question 3.3"),
      short("Calcule l'énergie cinétique maximale de l'électron pour le photon de 6 eV.", ["0.86", "0,86", "0,86 eV"], "Ec=6,00−5,14=0,86 eV.", "Question 3.3", 2),
      choice("La relation correcte après ionisation est…", ["Ec=Eγ−Ei", "Ec=Eγ+Ei", "Ec=Ei−Eγ toujours", "Ec=h+ν"], 0, "L'énergie du photon paie d'abord le seuil.", "Correction du corrigé"),
      choice("La formule En=−13,6/n² peut-elle être appliquée à ce diagramme du sodium ?", ["non", "oui sans condition", "seulement à 589 nm", "seulement après ionisation"], 0, "Cette formule est spécifique au modèle de l'hydrogène étudié.", "Précision"),
      short("Un photon de 5,50 eV ionise le sodium. Donne Ec,max.", ["0.36", "0,36", "0,36 eV"], "Ec,max=5,50−5,14=0,36 eV.", "Transfert", 2),
    ],
    corrections: [
      "Page 4 : les rangs n=1 et n=2 du sodium sont remplacés par les énergies −5,14 eV et −3,03 eV pour éviter toute confusion avec la loi de l'hydrogène.",
      "Page 4 : la relation imprimée Ec=E+Ei est corrigée en Ec=Eγ−Ei ; le résultat 0,86 eV est conservé.",
      "Page 4 : l'énergie de la raie de 589 nm est donnée à 2,105 eV avant l'arrondi à 2,11 eV.",
    ],
  },
  {
    id: "corpuscular-light-capture-concepts",
    title: "Traiter la capture électronique et les conversions",
    summary: "Résoudre les exercices 1 et 2 : photon émis lors de la formation de l'hydrogène, domaine ultraviolet et raison physique des spectres de raies.",
    pages: "4-5",
    section: "Exercices 1 et 2",
    durationMinutes: 27,
    xp: 95,
    kind: "practice",
    body: String.raw`## Exercice 1 - Capture d'un électron par un proton

Un proton $\mathrm{H}^+$ capture un électron initialement au repos. L'atome d'hydrogène formé atteint son état fondamental. L'énergie libérée est la valeur de l'énergie d'ionisation :

$$E_\gamma=13{,}6\ \text{eV}$$

Conversion en joules :

$$E_\gamma=13{,}6\times1{,}602\times10^{-19}\simeq2{,}18\times10^{-18}\ \text{J}$$

La longueur d'onde émise vaut :

$$\lambda=\frac{hc}{E_\gamma}$$

$$\lambda\simeq\frac{6{,}626\times10^{-34}\times3{,}00\times10^8}{2{,}18\times10^{-18}}\simeq9{,}12\times10^{-8}\ \text{m}$$

donc :

$$\boxed{\lambda\simeq91{,}2\ \text{nm}}$$

Cette radiation se situe dans l'**ultraviolet extrême**. Le résultat du support, $9{,}1\times10^{-8}\ \text{m}$, est cohérent ; seule la ligne numérique du numérateur contient une coquille : elle imprime $3\times10^{-8}$ alors qu'il faut $3\times10^{8}$.

## Exercice 2 - Comprendre le diagramme

1. À l'état fondamental, $n=1$.
2. Les spectres d'émission et d'absorption sont formés de raies parce que l'énergie de l'atome ne peut prendre que des valeurs déterminées. Les photons échangés ont donc des énergies, des fréquences et des longueurs d'onde discrètes.
3. La question « détermine l'énergie de l'atome » est imprécise. Le corrigé calcule en réalité l'**énergie d'ionisation** depuis le fondamental :

$$E_i=0-E_1=13{,}6\ \text{eV}$$

L'énergie de l'atome au fondamental, elle, est $E_1=-13{,}6\ \text{eV}$.

## Lecture de la courbe

La courbe interactive représente $E_\gamma=1240/\lambda$ avec $\lambda$ en nm. Elle est décroissante : les ultraviolets de petite longueur d'onde sont plus énergétiques que les photons visibles ou infrarouges.` ,
    keyPoint: "Capture vers n=1 : Eγ=13,6 eV=2,18×10⁻¹⁸ J et λ≈91,2 nm.",
    example: "À 100 nm, un photon vaut environ 12,4 eV ; à 1000 nm, il ne vaut plus qu'environ 1,24 eV.",
    methodSteps: [
      "Identifie l'énergie libérée par la transition ou la capture.",
      "Convertis les eV en joules si tu utilises h en J·s.",
      "Applique λ=hc/E sans changer le signe de l'exposant de c.",
      "Convertis le résultat en nanomètres.",
      "Situe la radiation dans le spectre et interprète la quantification.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Conversion",
      title: "Énergie d'un photon selon sa longueur d'onde",
      instruction: "Déplace le point entre 100 et 1000 nm pour comparer ultraviolet, visible et proche infrarouge.",
      observation: "La courbe décroît comme 1/λ : diviser λ par deux double l'énergie du photon.",
      formula: "E(eV) = 1239,842/λ(nm)",
      formulaTex: "E_\\gamma(\\mathrm{eV})=\\frac{1239{,}842}{\\lambda(\\mathrm{nm})}",
      rule: { kind: "samples", points: photonEnergyPoints },
      window: { xMin: 100, xMax: 1000, yMin: 0, yMax: 13 },
      marker: { min: 100, max: 1000, step: 10, initial: 589 },
    },
    questions: [
      short("Quelle énergie en eV est libérée lors de la capture vers le fondamental ?", ["13.6", "13,6", "13,6 eV"], "La capture libère l'énergie de liaison du fondamental.", "Exercice 1"),
      short("Convertis 13,6 eV en joules à trois chiffres significatifs.", ["2.18e-18", "2,18e-18", "2,18×10^-18", "2,18×10⁻¹⁸ J"], "13,6×1,602×10⁻¹⁹≈2,18×10⁻¹⁸ J.", "Exercice 1", 2),
      short("Calcule la longueur d'onde émise en mètres.", ["9.12e-8", "9,12e-8", "9,12×10^-8", "9,12×10⁻⁸ m", "9.1e-8"], "λ=hc/E≈9,12×10⁻⁸ m.", "Exercice 1", 2),
      short("Donne cette longueur d'onde en nanomètres.", ["91.2", "91,2", "91.2 nm", "91,2 nm", "91"], "9,12×10⁻⁸ m=91,2 nm.", "Exercice 1"),
      choice("Cette radiation appartient principalement…", ["à l'ultraviolet", "aux ondes radio", "au visible rouge", "aux micro-ondes"], 0, "91,2 nm est ultraviolet.", "Interprétation"),
      choice("Dans la ligne numérique de la page 5, la célérité doit être…", ["3×10⁸ m/s", "3×10⁻⁸ m/s", "3×10⁸ J", "3×10⁻³⁴ m/s"], 0, "L'exposant −8 est une coquille ; c≈3×10⁸ m/s.", "Correction page 5"),
      short("Quel est n à l'état fondamental de l'hydrogène ?", ["1", "n=1"], "Le fondamental est n=1.", "Exercice 2"),
      choice("Pourquoi observe-t-on des raies atomiques ?", ["les niveaux d'énergie sont quantifiés", "c varie pour chaque photon", "la lumière ne transporte rien", "le proton possède plusieurs charges"], 0, "Les différences d'énergie permises sont discrètes.", "Exercice 2"),
      choice("L'énergie de l'atome au fondamental est…", ["−13,6 eV", "+13,6 eV", "0 eV", "+2,18 eV"], 0, "E1=−13,6 eV.", "Précision exercice 2"),
      choice("L'énergie d'ionisation depuis ce fondamental est…", ["+13,6 eV", "−13,6 eV", "0 eV", "−3,40 eV"], 0, "Ei=0−E1=+13,6 eV.", "Exercice 2"),
      short("Calcule l'énergie en eV d'un photon de 100 nm.", ["12.4", "12,4", "12.40", "12,4 eV"], "E≈1240/100=12,4 eV.", "Courbe", 2),
      short("Calcule l'énergie en eV d'un photon de 1000 nm.", ["1.24", "1,24", "1,24 eV"], "E≈1240/1000=1,24 eV.", "Courbe"),
      choice("Si λ est divisée par deux, Eγ est…", ["multipliée par deux", "divisée par deux", "inchangée", "annulée"], 0, "Eγ est inversement proportionnelle à λ.", "Bilan"),
      choice("Lors de la capture, l'énergie est…", ["émise sous forme d'un photon", "absorbée depuis le vide", "perdue sans conservation", "transformée en charge"], 0, "L'atome passe vers un état lié plus bas et émet.", "Exercice 1"),
    ],
    corrections: [
      "Page 5 : le facteur 3×10⁻⁸ du numérateur est corrigé en 3×10⁸ m·s⁻¹ ; le résultat λ≈9,1×10⁻⁸ m reste valide.",
      "Page 5 : la question 3 de l'exercice 2 est précisée : le corrigé détermine l'énergie d'ionisation, tandis que l'énergie du fondamental vaut −13,6 eV.",
    ],
  },
  {
    id: "corpuscular-light-hydrogen-transition-lab",
    title: "Résoudre les transitions de l'hydrogène",
    summary: "Traiter intégralement l'exercice 3 : construire quatre niveaux, calculer l'émission 3→2 et identifier l'absorption provoquée par un photon de 121,7 nm.",
    pages: "6-7",
    section: "Exercice 3 : diagramme et transitions",
    durationMinutes: 29,
    xp: 105,
    kind: "practice",
    body: String.raw`## 1. Les quatre premiers niveaux

Le texte de l'exercice imprime $E_n=-13{,}5/n^2$ alors que tout le chapitre et son corrigé utilisent $13{,}6\ \text{eV}$. On conserve la valeur cohérente :

$$E_n=-\frac{13{,}6}{n^2}\ \text{eV}$$

On obtient :

$$E_1=-13{,}6\ \text{eV},\quad E_2=-3{,}40\ \text{eV}$$

$$E_3=-1{,}51\ \text{eV},\quad E_4=-0{,}85\ \text{eV}$$

Le niveau fondamental est $E_1$. La limite $E=0$ représente l'atome ionisé.

## 2. Transition du niveau 3 vers le niveau 2

Le niveau final est plus bas : la transition est une **émission**. La variation de l'énergie atomique vaut :

$$\Delta E_{\text{atome}}=E_2-E_3=-3{,}40-(-1{,}51)=-1{,}89\ \text{eV}$$

Le photon émis possède l'énergie positive :

$$E_\gamma=1{,}89\ \text{eV}\simeq3{,}03\times10^{-19}\ \text{J}$$

Sa longueur d'onde est :

$$\lambda=\frac{hc}{E_\gamma}\simeq6{,}56\times10^{-7}\ \text{m}\simeq656\ \text{nm}$$

La radiation appartient au domaine visible, dans le **rouge**. Le corrigé arrondit à $657\ \text{nm}$ avec ses constantes ; les deux valeurs sont compatibles.

## 3. Absorption d'un photon de 121,7 nm

L'énergie du photon vaut :

$$E_\gamma=\frac{hc}{121{,}7\times10^{-9}}\simeq1{,}63\times10^{-18}\ \text{J}\simeq10{,}2\ \text{eV}$$

Or :

$$E_2-E_1=-3{,}40-(-13{,}6)=10{,}2\ \text{eV}$$

Le photon est donc absorbé lors de la transition $n=1\rightarrow n=2$. Sur le diagramme, la flèche monte de $E_1$ vers $E_2$.

## Garde-fou sur les signes

Pour l'émission $3\to2$, $\Delta E_{\text{atome}}<0$ mais $E_\gamma=|\Delta E|>0$. Pour l'absorption $1\to2$, $\Delta E_{\text{atome}}>0$ et le photon incident apporte exactement cette valeur.` ,
    keyPoint: "3→2 émet λ≈656 nm ; 121,7 nm apporte 10,2 eV et provoque 1→2.",
    example: "La flèche 3→2 descend et produit un photon rouge ; la flèche 1→2 monte après absorption ultraviolet.",
    methodSteps: [
      "Calcule les niveaux En avec 13,6/n² et conserve les signes négatifs.",
      "Pour une transition, pose ΔEatome=Ef−Ei.",
      "Prends |ΔE| pour l'énergie positive du photon.",
      "Convertis eV en J avant d'utiliser λ=hc/E si nécessaire.",
      "Vérifie sur le diagramme le sens de la flèche et le domaine spectral.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Diagramme",
      title: "Deux transitions, deux sens",
      instruction: "Sélectionne les repères pour distinguer l'émission 3→2 de l'absorption 1→2.",
      observation: "La même structure de niveaux produit une raie rouge en descendant et absorbe un ultraviolet en montant.",
      caption: "Diagramme énergétique original de l'hydrogène, redessiné pour l'interaction.",
      viewBox: "0 0 560 280",
      shapes: [
        { shape: "line", x1: 100, y1: 235, x2: 500, y2: 235, tone: "outline" },
        { shape: "line", x1: 100, y1: 118, x2: 500, y2: 118, tone: "outline" },
        { shape: "line", x1: 100, y1: 72, x2: 500, y2: 72, tone: "outline" },
        { shape: "line", x1: 100, y1: 52, x2: 500, y2: 52, tone: "outline" },
        { shape: "line", x1: 100, y1: 25, x2: 500, y2: 25, tone: "muted" },
        { shape: "text", x: 88, y: 240, content: "E₁", anchor: "end" },
        { shape: "text", x: 88, y: 123, content: "E₂", anchor: "end" },
        { shape: "text", x: 88, y: 77, content: "E₃", anchor: "end" },
        { shape: "text", x: 88, y: 57, content: "E₄", anchor: "end" },
        { shape: "text", x: 88, y: 30, content: "0", anchor: "end" },
        { shape: "line", x1: 245, y1: 78, x2: 245, y2: 111, tone: "accent" },
        { shape: "path", d: "M237 101 L245 113 L253 101 Z", tone: "accent" },
        { shape: "line", x1: 365, y1: 228, x2: 365, y2: 126, tone: "muted" },
        { shape: "path", d: "M357 136 L365 124 L373 136 Z", tone: "muted" },
        { shape: "text", x: 225, y: 95, content: "656 nm", anchor: "end" },
        { shape: "text", x: 385, y: 185, content: "121,7 nm", anchor: "start" },
      ],
      hotspots: [
        { id: "levels", number: 1, label: "Niveaux permis", detail: "E1=−13,6 eV, E2=−3,40 eV, E3=−1,51 eV et E4=−0,85 eV.", x: 480, y: 160 },
        { id: "emission", number: 2, label: "Émission 3→2", detail: "La descente libère 1,89 eV, soit une radiation rouge d'environ 656 nm.", x: 245, y: 92 },
        { id: "absorption", number: 3, label: "Absorption 1→2", detail: "Le photon ultraviolet de 121,7 nm apporte environ 10,2 eV.", x: 365, y: 178 },
        { id: "continuum", number: 4, label: "Limite d'ionisation", detail: "La ligne E=0 est la limite au-dessus des états liés.", x: 470, y: 25 },
      ],
    },
    questions: [
      choice("La constante cohérente dans En est…", ["13,6 eV", "13,5 J", "3,40 eV", "0,85 J"], 0, "Le chapitre utilise En=−13,6/n² eV.", "Correction exercice 3"),
      short("Calcule E1 en eV.", ["-13.6", "-13,6", "−13,6 eV"], "E1=−13,6 eV.", "Question 1"),
      short("Calcule E2 en eV.", ["-3.4", "-3,4", "-3.40", "−3,40 eV"], "E2=−3,40 eV.", "Question 1"),
      short("Calcule E3 en eV au centième.", ["-1.51", "-1,51", "−1,51 eV"], "E3≈−1,51 eV.", "Question 1"),
      short("Calcule E4 en eV.", ["-0.85", "-0,85", "−0,85 eV"], "E4=−0,85 eV.", "Question 1"),
      choice("Le niveau fondamental est…", ["E1", "E2", "E3", "E=0"], 0, "Le plus bas niveau lié est E1.", "Question 2.2"),
      choice("La transition 3→2 est…", ["une émission", "une absorption", "une ionisation", "une transition vers E=0"], 0, "Le niveau final est plus bas.", "Question 3.2"),
      short("Calcule l'énergie du photon 3→2 en eV au centième.", ["1.89", "1,89", "1,89 eV"], "|E2−E3|≈1,89 eV.", "Question 3.3", 2),
      short("Donne cette énergie en joules à 0,01×10⁻¹⁹ près.", ["3.03e-19", "3,03e-19", "3,03×10^-19", "3,03×10⁻¹⁹ J", "3.02e-19"], "1,89 eV≈3,03×10⁻¹⁹ J.", "Question 3.3"),
      short("Calcule la longueur d'onde 3→2 en nm.", ["656", "656 nm", "657", "657 nm", "656.4"], "λ≈656,4 nm, compatible avec l'arrondi 657 nm du support.", "Question 3.3", 2),
      choice("Cette radiation est…", ["rouge visible", "gamma", "une onde radio métrique", "un rayon X"], 0, "Environ 656 nm appartient au rouge.", "Question 3.4"),
      short("Calcule l'énergie d'un photon de 121,7 nm en eV au dixième.", ["10.2", "10,2", "10,2 eV"], "E≈1240/121,7≈10,2 eV.", "Question 4.1", 2),
      choice("Le photon de 121,7 nm provoque…", ["la transition 1→2", "la transition 2→1", "la transition 3→2", "une transition 4→3"], 0, "E2−E1=10,2 eV.", "Question 4.2"),
      choice("Sur le diagramme, l'absorption 1→2 est une flèche…", ["montante", "descendante", "horizontale", "absente"], 0, "L'atome gagne de l'énergie.", "Question 4.3"),
      choice("Pendant l'émission, l'énergie du photon est…", ["|ΔEatome|", "ΔEatome négatif", "toujours 0", "E1+E2 sans valeur absolue"], 0, "L'énergie du photon reste positive.", "Garde-fou"),
    ],
    corrections: [
      "Pages 6-7 : la valeur 13,5 eV de l'énoncé est harmonisée à 13,6 eV, utilisée par le chapitre et par le corrigé.",
      "Page 7 : le signe de ΔEatome est séparé de l'énergie positive Eγ=|ΔE| pour éviter de parler d'un photon d'énergie négative.",
      "Page 7 : λ est recalculée à environ 656,4 nm ; l'arrondi 657 nm du support reste accepté.",
    ],
  },
  {
    id: "corpuscular-light-absorption-thresholds",
    title: "Décider entre excitation et ionisation",
    summary: "Résoudre l'exercice 4 en testant trois quanta reçus par l'hydrogène fondamental : absence d'absorption, excitation discrète ou ionisation.",
    pages: "8",
    section: "Exercice 4 : quanta de 6 eV, 12,75 eV et 18 eV",
    durationMinutes: 29,
    xp: 115,
    kind: "challenge",
    body: String.raw`## Les énergies accessibles depuis le fondamental

L'atome d'hydrogène est initialement en $n=1$, avec $E_1=-13{,}6\ \text{eV}$. Les énergies d'excitation vers les premiers niveaux sont :

$$E_2-E_1=-3{,}40-(-13{,}6)=10{,}2\ \text{eV}$$

$$E_3-E_1=-1{,}51-(-13{,}6)\simeq12{,}09\ \text{eV}$$

$$E_4-E_1=-0{,}85-(-13{,}6)=12{,}75\ \text{eV}$$

La limite d'ionisation est :

$$E_i=13{,}6\ \text{eV}$$

Le support parle de « différences d'énergie d'ionisation entre les niveaux ». Le terme correct ici est **énergies d'excitation depuis le fondamental** ; l'ionisation désigne le passage vers le continuum.

## Test du photon de 6 eV

Il est sous le seuil et ne correspond à aucune différence autorisée depuis $n=1$. Dans le modèle de l'atome isolé :

$$6\ \text{eV}\neq10{,}2;\ 12{,}09;\ 12{,}75;\ldots$$

Le photon n'est pas absorbé.

## Test du photon de 12,75 eV

Il correspond exactement à $E_4-E_1$. Il est absorbé et provoque :

$$n=1\longrightarrow n=4$$

## Test du photon de 18 eV

Il dépasse $13{,}6\ \text{eV}$. Le photon peut être absorbé en ionisant l'atome. L'électron libéré reçoit :

$$E_c=18-13{,}6=4{,}4\ \text{eV}$$

## Règle de décision

Depuis un état lié :

1. si $E_\gamma<E_i$, il faut une égalité avec une différence de niveaux pour absorber ;
2. si $E_\gamma\geq E_i$, l'ionisation est possible et l'excédent devient énergie cinétique ;
3. une énergie quelconque sous le seuil n'est pas « partiellement absorbée » dans le modèle élémentaire.

L'énergie de liaison du fondamental est $13{,}6\ \text{eV}$ en valeur absolue ; l'énergie du niveau lui-même est $-13{,}6\ \text{eV}$.` ,
    keyPoint: "Depuis n=1 : 6 eV non absorbé ; 12,75 eV excite vers n=4 ; 18 eV ionise avec Ec=4,4 eV.",
    example: "Un photon de 12,09 eV peut provoquer 1→3 ; un photon de 13,0 eV ne correspond à aucun niveau et reste sous le seuil.",
    methodSteps: [
      "Calcule les écarts En−Einitial vers les niveaux liés.",
      "Calcule séparément le seuil d'ionisation 0−Einitial.",
      "Compare le photon aux écarts discrets s'il est sous le seuil.",
      "S'il dépasse le seuil, calcule Ec=Eγ−Ei.",
      "Énonce clairement : non absorbé, excitation vers n, ou ionisation.",
    ],
    interaction: timeline([
      { label: "État initial", shortLabel: "n=1", detail: "E1=−13,6 eV et le seuil d'ionisation vaut 13,6 eV." },
      { label: "Photon 6 eV", shortLabel: "Refusé", detail: "Aucun écart discret ne vaut 6 eV et l'énergie reste sous le seuil." },
      { label: "Photon 12,75 eV", shortLabel: "1→4", detail: "Il coïncide avec E4−E1 et excite l'atome." },
      { label: "Photon 18 eV", shortLabel: "Ionisation", detail: "Il franchit le continuum et laisse 4,4 eV à l'électron." },
      { label: "Décision", shortLabel: "Exact ou seuil", detail: "Sous le seuil : égalité discrète ; au-dessus : ionisation possible." },
    ], "Tester trois quanta", "Avance photon par photon sans confondre excitation et ionisation.", "La quantification impose des valeurs exactes sous le seuil, mais le continuum accepte toute énergie supérieure au seuil."),
    questions: [
      choice("L'énergie du niveau fondamental est…", ["−13,6 eV", "+13,6 eV", "0 eV", "−3,40 eV"], 0, "E1=−13,6 eV.", "Exercice 4"),
      short("Donne l'énergie de liaison du fondamental en valeur absolue.", ["13.6", "13,6", "13,6 eV"], "La valeur absolue de E1 est 13,6 eV.", "Question 2"),
      short("Calcule l'énergie d'excitation 1→2.", ["10.2", "10,2", "10,2 eV"], "E2−E1=10,2 eV.", "Question 3"),
      short("Calcule l'énergie d'excitation 1→3 au centième.", ["12.09", "12,09", "12,09 eV", "12.1"], "E3−E1≈12,09 eV.", "Question 3"),
      short("Calcule l'énergie d'excitation 1→4.", ["12.75", "12,75", "12,75 eV"], "E4−E1=12,75 eV.", "Question 3"),
      choice("Le photon de 6 eV est…", ["non absorbé", "absorbé vers n=2", "ionisant", "absorbé vers n=4"], 0, "Il ne coïncide avec aucun écart et reste sous le seuil.", "Question 4"),
      choice("Le photon de 12,75 eV provoque…", ["1→4", "1→2", "4→1", "l'ionisation avec 12,75 eV cinétiques"], 0, "Son énergie coïncide avec E4−E1.", "Question 4"),
      choice("Le photon de 18 eV provoque…", ["une ionisation", "aucune interaction car il n'est pas exact", "1→2", "une émission"], 0, "Au-dessus du seuil, les états libres forment un continuum.", "Question 4"),
      short("Calcule l'énergie cinétique de l'électron après absorption du photon de 18 eV.", ["4.4", "4,4", "4,4 eV"], "Ec=18−13,6=4,4 eV.", "Complément au corrigé", 2),
      choice("Le terme correct pour E3−E1 est…", ["énergie d'excitation", "énergie d'ionisation entre niveaux", "masse du photon", "fréquence seuil du métal"], 0, "L'ionisation désigne le passage jusqu'à E=0.", "Correction terminologique"),
      choice("Un photon de 13,0 eV depuis n=1 est, dans le modèle idéal…", ["non absorbé", "ionisant", "absorbé vers n=4", "émis"], 0, "13,0 eV ne correspond pas à un niveau et reste sous 13,6 eV.", "Transfert"),
      choice("Un photon de 13,6 eV peut…", ["ioniser au seuil avec Ec=0", "exciter seulement vers n=2", "être sans énergie", "donner Ec=13,6 eV"], 0, "Toute l'énergie sert à libérer l'électron au seuil.", "Transfert"),
      short("Un photon de 15 eV ionise l'hydrogène. Donne Ec.", ["1.4", "1,4", "1,4 eV"], "Ec=15−13,6=1,4 eV.", "Transfert", 2),
      choice("Sous le seuil, l'absorption liée-liée exige…", ["une énergie exactement autorisée", "n'importe quelle énergie", "une intensité infinie", "un photon de charge positive"], 0, "Les niveaux liés sont discrets.", "Règle"),
      choice("Au-dessus du seuil, les énergies de l'électron libre forment…", ["un continuum", "un unique niveau −13,6", "uniquement n=2", "une suite sans énergie"], 0, "L'électron peut emporter l'excédent sous forme cinétique.", "Bilan"),
    ],
    corrections: [
      "Page 8 : « différence d'énergie d'ionisation entre les niveaux » est corrigé en « énergie d'excitation depuis le fondamental ».",
      "Page 8 : l'absorption du photon de 18 eV est explicitée comme une ionisation, avec énergie cinétique Ec=4,4 eV.",
      "Page 8 : le cas du photon de 6 eV est justifié par l'absence d'écart discret et par son énergie inférieure au seuil.",
    ],
  },
  {
    id: "corpuscular-light-balmer-mission",
    title: "Construire la série de Balmer",
    summary: "Achever l'exercice 5 en calculant les niveaux n=1 à 6, les énergies et fréquences des quatre raies visibles, puis les placer sur un diagramme cohérent.",
    pages: "8-11",
    section: "Exercice 5, série de Balmer et documentation",
    durationMinutes: 31,
    xp: 130,
    kind: "challenge",
    body: String.raw`## Série de Balmer

La série de Balmer rassemble les photons émis lorsque l'atome d'hydrogène passe d'un niveau $p>2$ vers $n=2$. Les niveaux vérifient :

$$E_n=-\frac{13{,}6}{n^2}\ \text{eV}$$

L'énergie du photon émis lors de $p\to2$ est :

$$E_\gamma=E_p-E_2=13{,}6\left(\frac{1}{2^2}-\frac{1}{p^2}\right)\ \text{eV}$$

Comme $h$ est exprimée en joules-secondes, il faut convertir les eV en joules dans la formule de fréquence :

$$\boxed{\nu_{p\to2}=\frac{13{,}6\,e}{h}\left(\frac{1}{2^2}-\frac{1}{p^2}\right)}$$

où $e=1{,}602\times10^{-19}\ \text{J/eV}$. Le facteur $e$ manque dans l'écriture imprimée du support.

## Niveaux n=1 à n=6

| $n$ | $E_n$ (eV) |
|---:|---:|
| 1 | −13,60 |
| 2 | −3,40 |
| 3 | −1,51 |
| 4 | −0,85 |
| 5 | −0,544 |
| 6 | −0,378 |

L'énergie d'ionisation depuis le fondamental vaut $13{,}6\ \text{eV}$.

## Les quatre raies données

| Transition | Raie | $\lambda$ | $E_\gamma$ (J) | $E_\gamma$ (eV) |
|---|---|---:|---:|---:|
| $3\to2$ | $\mathrm{H}_\alpha$ | 656 nm | $3{,}03\times10^{-19}$ | 1,89 |
| $4\to2$ | $\mathrm{H}_\beta$ | 486 nm | $4{,}09\times10^{-19}$ | 2,55 |
| $5\to2$ | $\mathrm{H}_\gamma$ | 434 nm | $4{,}58\times10^{-19}$ | 2,86 |
| $6\to2$ | $\mathrm{H}_\delta$ | 410 nm | $4{,}84\times10^{-19}$ | 3,02 |

La page 9 transforme par erreur $656\ \text{nm}$ en $659\ \text{nm}$ dans la première ligne de solution. La valeur fidèle à l'énoncé et à la série de Balmer est **656 nm**.

## Lecture du diagramme

Toutes les flèches descendent vers $n=2$. Quand $p$ augmente, l'énergie du photon augmente et la longueur d'onde diminue :

$$656>486>434>410\ \text{nm}$$

## Dualité et couleur - correction de la documentation

La diffraction révèle l'aspect ondulatoire ; l'effet photoélectrique et les échanges par quanta révèlent l'aspect corpusculaire. Pour un objet opaque rouge, on dit en général qu'il **réfléchit ou diffuse** surtout le rouge et absorbe davantage les autres longueurs d'onde, plutôt qu'il « laisse passer » le rouge. Le ciel est principalement bleu à cause de la **diffusion de Rayleigh**, plus efficace aux courtes longueurs d'onde ; il n'est pas bleu parce que l'atmosphère absorberait les grandes longueurs d'onde comme l'affirme la documentation.

Cette mission reprend donc tout l'exercice officiel tout en protégeant l'élève contre trois confusions : unité de $h$, inversion énergie-longueur d'onde et explication incorrecte des couleurs.` ,
    keyPoint: "Balmer : p→2 ; Hα 656 nm, Hβ 486 nm, Hγ 434 nm, Hδ 410 nm ; ν=(13,6e/h)(1/4−1/p²).",
    example: "Pour p=4, ΔE=−0,85−(−3,40)=2,55 eV : la raie Hβ vaut environ 486 nm.",
    methodSteps: [
      "Calcule les niveaux En de n=1 à n=6.",
      "Pour chaque p, calcule Eγ=Ep−E2, valeur positive.",
      "Convertis l'énergie en joules avant de diviser par h.",
      "Calcule λ=hc/Eγ ou associe les longueurs d'onde données.",
      "Trace toutes les flèches vers n=2 et contrôle : plus d'énergie signifie moins de longueur d'onde.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Mission finale",
      title: "Les quatre raies visibles de Balmer",
      instruction: "Sélectionne chaque flèche pour relier le niveau initial, l'énergie et la longueur d'onde.",
      observation: "Les niveaux se rapprochent de zéro ; les quatre transitions convergent vers n=2 et leurs longueurs d'onde diminuent.",
      caption: "Diagramme de Balmer original redessiné à partir des valeurs calculées.",
      viewBox: "0 0 580 300",
      shapes: [
        { shape: "line", x1: 75, y1: 255, x2: 535, y2: 255, tone: "outline" },
        { shape: "line", x1: 75, y1: 205, x2: 535, y2: 205, tone: "outline" },
        { shape: "line", x1: 75, y1: 122, x2: 535, y2: 122, tone: "outline" },
        { shape: "line", x1: 75, y1: 84, x2: 535, y2: 84, tone: "outline" },
        { shape: "line", x1: 75, y1: 63, x2: 535, y2: 63, tone: "outline" },
        { shape: "line", x1: 75, y1: 49, x2: 535, y2: 49, tone: "outline" },
        { shape: "line", x1: 75, y1: 25, x2: 535, y2: 25, tone: "muted" },
        { shape: "text", x: 64, y: 260, content: "n=1", anchor: "end" },
        { shape: "text", x: 64, y: 210, content: "n=2", anchor: "end" },
        { shape: "text", x: 64, y: 127, content: "n=3", anchor: "end" },
        { shape: "text", x: 64, y: 89, content: "n=4", anchor: "end" },
        { shape: "text", x: 64, y: 68, content: "n=5", anchor: "end" },
        { shape: "text", x: 64, y: 54, content: "n=6", anchor: "end" },
        { shape: "line", x1: 155, y1: 128, x2: 155, y2: 198, tone: "accent" },
        { shape: "path", d: "M147 188 L155 202 L163 188 Z", tone: "accent" },
        { shape: "line", x1: 260, y1: 90, x2: 260, y2: 198, tone: "muted" },
        { shape: "path", d: "M252 188 L260 202 L268 188 Z", tone: "muted" },
        { shape: "line", x1: 365, y1: 69, x2: 365, y2: 198, tone: "accent" },
        { shape: "path", d: "M357 188 L365 202 L373 188 Z", tone: "accent" },
        { shape: "line", x1: 470, y1: 55, x2: 470, y2: 198, tone: "muted" },
        { shape: "path", d: "M462 188 L470 202 L478 188 Z", tone: "muted" },
        { shape: "text", x: 155, y: 225, content: "656 nm", anchor: "middle" },
        { shape: "text", x: 260, y: 225, content: "486 nm", anchor: "middle" },
        { shape: "text", x: 365, y: 225, content: "434 nm", anchor: "middle" },
        { shape: "text", x: 470, y: 225, content: "410 nm", anchor: "middle" },
      ],
      hotspots: [
        { id: "alpha", number: 1, label: "Hα : 3→2", detail: "La raie rouge vaut environ 656 nm et le photon 1,89 eV.", x: 155, y: 160 },
        { id: "beta", number: 2, label: "Hβ : 4→2", detail: "La raie bleu-vert vaut environ 486 nm et le photon 2,55 eV.", x: 260, y: 145 },
        { id: "gamma", number: 3, label: "Hγ : 5→2", detail: "La raie bleu-violet vaut environ 434 nm et le photon 2,86 eV.", x: 365, y: 132 },
        { id: "delta", number: 4, label: "Hδ : 6→2", detail: "La raie violette vaut environ 410 nm et le photon 3,02 eV.", x: 470, y: 123 },
      ],
    },
    questions: [
      short("Calcule l'énergie d'ionisation de l'hydrogène en eV.", ["13.6", "13,6", "13,6 eV"], "Ei=0−(−13,6)=13,6 eV.", "Exercice 5 question 1"),
      choice("La formule dimensionnellement correcte de la fréquence Balmer contient…", ["le facteur e pour convertir les eV en J", "une fréquence négative", "la masse du proton seulement", "aucune constante de Planck"], 0, "h est en J·s ; 13,6 eV doit être converti avec e.", "Question 2 corrigée"),
      short("Calcule l'énergie en joules du photon Hα à 656 nm.", ["3.03e-19", "3,03e-19", "3,03×10^-19", "3,03×10⁻¹⁹ J", "3.01e-19"], "E=hc/λ≈3,03×10⁻¹⁹ J.", "Question 3.1", 2),
      short("Donne l'énergie de Hα en eV au centième.", ["1.89", "1,89", "1,89 eV", "1.88"], "E≈1,89 eV.", "Question 3.1"),
      short("Donne l'énergie de Hβ à 486 nm en eV au centième.", ["2.55", "2,55", "2,55 eV"], "E≈1240/486≈2,55 eV.", "Question 3.1"),
      short("Donne l'énergie de Hγ à 434 nm en eV au centième.", ["2.86", "2,86", "2,86 eV"], "E≈1240/434≈2,86 eV.", "Question 3.1"),
      short("Donne l'énergie de Hδ à 410 nm en eV au centième.", ["3.02", "3,02", "3,02 eV"], "E≈1240/410≈3,02 eV.", "Question 3.1"),
      short("Calcule E5 en eV au millième.", ["-0.544", "-0,544", "−0,544 eV"], "E5=−13,6/25=−0,544 eV.", "Question 3.2"),
      short("Calcule E6 en eV au millième.", ["-0.378", "-0,378", "−0,378 eV", "-0.38"], "E6=−13,6/36≈−0,378 eV.", "Question 3.2"),
      choice("La raie Hα correspond à…", ["3→2", "4→2", "5→2", "6→2"], 0, "La première raie de Balmer donnée est 3→2.", "Question 4"),
      choice("La raie Hβ correspond à…", ["4→2", "3→2", "5→2", "2→1"], 0, "Hβ associe p=4 à n=2.", "Question 4"),
      choice("La raie Hγ correspond à…", ["5→2", "6→2", "4→2", "3→1"], 0, "Hγ associe p=5 à n=2.", "Question 4"),
      choice("La raie Hδ correspond à…", ["6→2", "5→2", "4→2", "2→6"], 0, "Hδ associe p=6 à n=2.", "Question 4"),
      choice("Parmi ces quatre raies, la plus énergétique est…", ["Hδ à 410 nm", "Hα à 656 nm", "Hβ à 486 nm", "elles ont toutes la même énergie"], 0, "La plus petite longueur d'onde donne la plus grande énergie.", "Bilan Balmer"),
      choice("Un objet opaque vu rouge…", ["réfléchit ou diffuse surtout le rouge", "absorbe seulement le rouge", "laisse nécessairement passer toute la lumière", "produit des photons gamma"], 0, "La documentation confond transmission et réflexion/diffusion.", "Documentation corrigée"),
      choice("La couleur bleue du ciel est principalement liée…", ["à la diffusion de Rayleigh", "à l'absorption de toutes les petites longueurs d'onde", "à l'effet photoélectrique du sol", "à la série de Balmer du sodium"], 0, "Les courtes longueurs d'onde sont davantage diffusées par l'atmosphère.", "Documentation corrigée"),
    ],
    corrections: [
      "Page 9 : la longueur d'onde Hα imprimée 659 nm dans la solution est rétablie à 656 nm, valeur donnée dans l'énoncé.",
      "Page 9 : la formule de fréquence de Balmer reçoit le facteur e=1,602×10⁻¹⁹ J/eV manquant pour être compatible avec h en J·s.",
      "Pages 10-11 : la couleur d'un objet opaque est expliquée par réflexion/diffusion sélective, et la couleur du ciel par diffusion de Rayleigh ; l'explication d'absorption du document est corrigée.",
      "Pages 10-11 : la dualité onde-corpuscule est présentée comme complémentarité de modèles, et non comme une question tranchée successivement en faveur d'un seul camp.",
    ],
  },
];

const levelOrder = [
  "corpuscular-light-photoelectric-photons",
  "corpuscular-light-planck-einstein",
  "corpuscular-light-quantized-transitions-spectra",
  "corpuscular-light-hydrogen-levels-ionization",
  "corpuscular-light-sodium-evaluation",
  "corpuscular-light-capture-concepts",
  "corpuscular-light-hydrogen-transition-lab",
  "corpuscular-light-absorption-thresholds",
  "corpuscular-light-balmer-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau du modèle corpusculaire de la lumière introuvable : " + id);
  return officialLevel(index, level);
});

export const corpuscularLightPath: LearningPath = {
  id: "terminale-c-corpuscular-light",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c"],
  curriculumLabel: "Programme ivoirien • Leçon 17 de Physique en Terminale C • Thème 4",
  curriculumSourceUrl: "https://www.fomesoutra.com/cours/secondaire/terminale/terminale-c/cours-de-physique-chimie-terminales-c-d-e/15954-tle-d-phy-l17-modele-corpusculaire-lumiere-by-tehua",
  theme: { number: 4, title: "La lumière : onde ou particule" },
  chapterNumber: 17,
  title: "Modèle corpusculaire de la lumière",
  description: "Expliquer l'effet photoélectrique, calculer l'énergie d'un photon, interpréter les spectres atomiques et construire les niveaux de l'atome d'hydrogène.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Décrire les propriétés du photon et expliquer le seuil de l'effet photoélectrique.",
    "Utiliser E=hν=hc/λ et convertir joules, électronvolts, fréquences et longueurs d'onde.",
    "Distinguer émission, absorption et ionisation sur un diagramme énergétique.",
    "Interpréter les spectres de raies comme signatures de niveaux quantifiés.",
    "Exploiter En=−13,6/n² eV et calculer l'énergie d'ionisation de l'hydrogène.",
    "Résoudre la situation officielle du sodium à 589 nm et tester des photons incidents.",
    "Construire intégralement la série de Balmer et corriger les incohérences du support.",
  ],
  modules: [{
    id: "corpuscular-light-mastery",
    title: "Maîtriser le modèle corpusculaire de la lumière",
    description: "Du seuil photoélectrique à la série de Balmer, neuf niveaux fidèles aux onze pages du support ivoirien.",
    lessons: builtLevels,
  }],
};

export const corpuscularLightPaths: LearningPath[] = [corpuscularLightPath];
