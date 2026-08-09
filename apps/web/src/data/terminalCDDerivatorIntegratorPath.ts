import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 11 de Physique en Terminale C et leçon 9 en Terminale D.
const sourceDocument = "Cours montages dérivateur et intégrateur.pdf";

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
      tip: "Astuce Davy : repère d’abord où sont placés R et C. C à l’entrée signifie dériver ; C dans la rétroaction signifie intégrer.",
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
    id: "ideal-operational-amplifier",
    title: "Comprendre l’amplificateur opérationnel idéal",
    summary: "Identifier les bornes de l’AOP, distinguer régime linéaire et saturation, puis utiliser les deux propriétés idéales.",
    pages: "1 et 3",
    section: "1. Propriétés de l’amplificateur opérationnel",
    durationMinutes: 18,
    xp: 45,
    body: String.raw`## Un composant qui réalise des opérations sur des tensions

Un **amplificateur opérationnel** — noté AOP — est un circuit intégré capable d’amplifier et de combiner des tensions. Avec quelques composants extérieurs, il peut notamment réaliser une addition, une soustraction, une dérivation ou une intégration.

Le symbole utile au lycée comporte :

- une entrée **inverseuse** $E^-$ ;
- une entrée **non-inverseuse** $E^+$ ;
- une sortie $S$ ;
- deux alimentations continues $+U$ et $-U$, souvent omises sur le symbole normalisé.

La tension différentielle d’entrée est :

$$\epsilon=V_{E^+}-V_{E^-}$$

## Le régime linéaire

Dans les montages de cette leçon, la sortie est renvoyée vers l’entrée inverseuse : il y a **rétroaction négative**. Tant que la sortie reste entre les tensions de saturation, l’AOP idéal fonctionne en régime linéaire et l’on utilise deux propriétés :

$$\boxed{i^+=i^-=0}$$

$$\boxed{\epsilon=0\quad\Longrightarrow\quad V_{E^+}=V_{E^-}}$$

La première relation signifie qu’aucun courant ne pénètre dans les entrées. La seconde est une égalité de potentiels, parfois appelée **court-circuit virtuel** : les deux bornes ont le même potentiel sans être reliées par un fil.

Dans les deux montages étudiés, $E^+$ est reliée à la masse $M$. On obtient donc :

$$V_{E^+}=V_M=0\quad\text{et}\quad V_{E^-}=0$$

Le nœud de l’entrée inverseuse est alors une **masse virtuelle**.

## Le régime saturé

L’AOP réel ne peut pas produire une tension de sortie arbitrairement grande. Lorsque la commande exige une valeur hors de la plage disponible, la sortie se bloque près d’une limite :

$$u_s\approx +V_{\mathrm{sat}}\quad\text{ou}\quad u_s\approx -V_{\mathrm{sat}}$$

En régime linéaire :

$$-V_{\mathrm{sat}}<u_s<V_{\mathrm{sat}}$$

En régime saturé, on ne peut plus imposer $\epsilon=0$. C’est pourquoi les relations idéales du dérivateur et de l’intégrateur ne sont valables que si la sortie ne sature pas.

> **Astuce mémoire.** En régime linéaire idéal : **aucun courant n’entre**, **aucune différence de potentiel ne subsiste** entre les deux entrées.

> **Correction de formulation.** La fiche écrit que l’AOP permet de « simplifier des tensions ». Le terme physique attendu est **amplifier** ou **traiter** des tensions.` ,
    keyPoint: "En régime linéaire idéal avec rétroaction négative : i⁺=i⁻=0 et ε=0, donc les deux entrées sont au même potentiel.",
    example: "Si E⁺ est à la masse, alors VE⁺=0. Comme ε=0, VE⁻=0 également : E⁻ est une masse virtuelle, mais aucun fil ne la relie à la masse.",
    methodSteps: [
      "Repère E⁺, E⁻, la sortie S et les alimentations.",
      "Vérifie qu’une rétroaction relie la sortie à E⁻ : le régime linéaire peut alors être utilisé.",
      "Pose i⁺=i⁻=0 pour conserver les courants dans les composants extérieurs.",
      "Pose ε=0 puis égalise les potentiels des deux entrées.",
      "Contrôle enfin que la tension calculée reste comprise entre les saturations.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Schéma interactif",
      title: "Les bornes essentielles de l’AOP",
      instruction: "Sélectionne chaque repère pour comprendre son rôle dans les montages de la leçon.",
      observation: "Les calculs portent sur les deux entrées et la sortie ; les alimentations fixent seulement les limites de saturation.",
      caption: "Symbole original d’un amplificateur opérationnel idéal en régime linéaire.",
      viewBox: "0 0 440 250",
      shapes: [
        { shape: "path", d: "M155 45 L155 205 L325 125 Z", tone: "soft" },
        { shape: "line", x1: 65, y1: 90, x2: 155, y2: 90, tone: "outline" },
        { shape: "line", x1: 65, y1: 160, x2: 155, y2: 160, tone: "outline" },
        { shape: "line", x1: 325, y1: 125, x2: 395, y2: 125, tone: "accent" },
        { shape: "line", x1: 235, y1: 72, x2: 235, y2: 25, tone: "muted" },
        { shape: "line", x1: 235, y1: 178, x2: 235, y2: 225, tone: "muted" },
        { shape: "text", x: 174, y: 98, content: "−", anchor: "middle" },
        { shape: "text", x: 174, y: 168, content: "+", anchor: "middle" },
        { shape: "text", x: 48, y: 95, content: "E⁻", anchor: "end" },
        { shape: "text", x: 48, y: 165, content: "E⁺", anchor: "end" },
        { shape: "text", x: 410, y: 130, content: "S", anchor: "start" },
        { shape: "text", x: 250, y: 22, content: "+U", anchor: "start" },
        { shape: "text", x: 250, y: 238, content: "−U", anchor: "start" },
        { shape: "text", x: 235, y: 132, content: "∞", anchor: "middle" },
      ],
      hotspots: [
        { id: "inverting", number: 1, label: "Entrée inverseuse E⁻", detail: "Une augmentation de son potentiel tend à faire diminuer la sortie. La rétroaction des deux montages revient sur cette entrée.", x: 92, y: 90 },
        { id: "non-inverting", number: 2, label: "Entrée non-inverseuse E⁺", detail: "Elle est reliée à la masse dans cette leçon. En régime linéaire, E⁻ prend alors le même potentiel nul.", x: 92, y: 160 },
        { id: "output", number: 3, label: "Sortie S", detail: "Elle fournit us et reste comprise entre −Vsat et +Vsat tant que le montage fonctionne linéairement.", x: 365, y: 125 },
        { id: "supplies", number: 4, label: "Alimentations", detail: "Les bornes +U et −U alimentent le circuit intégré et déterminent les limites accessibles à la sortie.", x: 235, y: 40 },
      ],
    },
    questions: [
      choice("Un AOP permet notamment de réaliser…", ["des opérations sur des tensions", "uniquement des pesées", "seulement des réactions chimiques", "des mesures de masse sans circuit"], 0, "L’AOP traite des tensions et peut réaliser addition, soustraction, dérivation ou intégration.", "1.1 Définition", 1),
      choice("L’entrée marquée − est appelée…", ["entrée inverseuse", "sortie", "masse mécanique", "alimentation positive"], 0, "Le signe − identifie l’entrée inverseuse E⁻.", "1.2 Description", 1),
      choice("Pour un AOP idéal, les courants d’entrée vérifient…", ["i⁺=i⁻=0", "i⁺=i⁻=1 A", "i⁺=−i⁻ toujours", "i⁺=us/R"], 0, "L’impédance d’entrée idéale est infinie : aucun courant ne pénètre.", "1.3 Régime linéaire", 1),
      short("Donne ε en régime linéaire idéal, en volt.", ["0", "0 V", "zéro"], "La tension différentielle d’entrée est nulle.", "1.3 Régime linéaire", 1),
      choice("Si E⁺ est à la masse et ε=0, le potentiel de E⁻ vaut…", ["0 V", "+Vsat", "−Vsat", "une valeur nécessairement infinie"], 0, "VE⁻=VE⁺=0 V.", "1.3 Masse virtuelle", 1),
      choice("Une masse virtuelle signifie que E⁻…", ["est au potentiel de la masse sans y être reliée par un fil", "absorbe un courant infini", "est une véritable prise de terre", "est toujours saturée"], 0, "L’égalité de potentiel provient du fonctionnement linéaire et non d’un fil.", "1.3 Régime linéaire", 2),
      choice("En régime linéaire, la sortie vérifie…", ["−Vsat<us<+Vsat", "us est toujours +Vsat", "us est toujours nulle", "us>+Vsat"], 0, "La sortie doit rester dans la plage non saturée.", "1.3 Caractéristiques", 1),
      choice("En régime saturé, us est voisine de…", ["+Vsat ou −Vsat", "ε/0", "toujours 1 V", "la capacité C"], 0, "La sortie se bloque près de l’une des deux limites.", "1.3 Régime saturé", 1),
      choice("La propriété ε=0 s’emploie…", ["en régime linéaire avec rétroaction négative", "dans tout montage saturé", "même sans alimentation", "uniquement en mécanique"], 0, "Elle découle de l’amplification idéale tant que la rétroaction maintient le régime linéaire.", "1.3 Régimes", 2),
      choice("Les alimentations +U et −U servent principalement à…", ["alimenter l’AOP et borner sa sortie", "faire entrer i⁺ et i⁻", "remplacer R et C", "définir la fréquence du GBF"], 0, "Elles fournissent l’énergie au circuit et fixent ses limites de sortie.", "1.2 Bornes", 1),
    ],
    corrections: [
      "Page 3 : « simplifier des tensions électriques » est corrigé en « amplifier ou traiter des tensions électriques », formulation conforme au rôle de l’amplificateur opérationnel.",
      "Page 3 : l’égalité ε=0 est explicitement rattachée au régime linéaire avec rétroaction négative ; elle n’est pas valable en saturation.",
    ],
  },
  {
    id: "derivator-circuit-identification",
    title: "Reconnaître et monter un dérivateur",
    summary: "Lire le schéma, suivre le courant entre le condensateur d’entrée et la résistance de rétroaction, puis comprendre les composants pratiques.",
    pages: "4-6",
    section: "2.1 Dispositif expérimental et 2.3.1 montage pratique",
    durationMinutes: 18,
    xp: 55,
    body: String.raw`## La signature visuelle du dérivateur

Dans le montage dérivateur idéal :

- le **condensateur $C$ est placé à l’entrée**, entre le générateur et l’entrée inverseuse ;
- la **résistance $R$ est placée dans la rétroaction**, entre la sortie et l’entrée inverseuse ;
- l’entrée non-inverseuse est reliée à la masse.

Cette disposition suffit à identifier le montage avant tout calcul.

## Pourquoi le même courant traverse $C$ et $R$

Au nœud $B$ de l’entrée inverseuse, le courant d’entrée de l’AOP est nul :

$$i^-=0$$

La loi des nœuds impose donc que le courant fourni par le condensateur reparte intégralement dans la résistance de rétroaction. Avec les orientations de la fiche, on note ce courant $i$ dans les deux composants.

Comme $E^+$ est à la masse et que l’AOP fonctionne linéairement :

$$V_B=V_{E^-}=V_{E^+}=V_M=0$$

Le condensateur voit alors la tension d’entrée :

$$u_C=u_e$$

Et la tension de sortie est l’opposée de la tension de la résistance :

$$u_s=-u_R=-Ri$$

Ces deux relations préparent directement la démonstration du niveau suivant.

## Le montage pratique

Un dérivateur idéal amplifie fortement les variations très rapides et le bruit. Dans le montage pratique de la fiche :

- une petite résistance $R_p$ est ajoutée **en série avec $C$** pour limiter le courant et le gain aux hautes fréquences ;
- une résistance reliée à l’entrée non-inverseuse aide à compenser les effets des courants de polarisation d’un AOP réel.

Ces composants n’inversent pas le rôle du montage : $C$ reste du côté de l’entrée et $R$ dans la boucle de retour.

> **Astuce mémoire.** **C entre en premier : le montage dérive.** La capacité d’entrée réagit aux changements de $u_e$.

> **Erreur fréquente.** La masse virtuelle n’absorbe pas le courant. C’est l’impédance d’entrée idéale qui impose $i^-=0$ ; le courant circule de $C$ vers $R$.` ,
    keyPoint: "Dérivateur : C à l’entrée, R en rétroaction, E⁺ à la masse ; le même courant traverse C et R car i⁻=0.",
    example: "En observant C entre le GBF et E⁻ puis R entre S et E⁻, on peut annoncer « dérivateur » avant même d’utiliser us=−RC due/dt.",
    methodSteps: [
      "Localise l’entrée du signal et suis le conducteur jusqu’à E⁻.",
      "Si le premier dipôle est C, soupçonne immédiatement le dérivateur.",
      "Vérifie que R relie la sortie à E⁻ : c’est la rétroaction négative.",
      "Pose VB=0 grâce à la masse virtuelle.",
      "Applique la loi des nœuds en utilisant i⁻=0.",
      "Distingue les composants idéaux des résistances correctrices du montage pratique.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Circuit interactif",
      title: "Le condensateur est à l’entrée",
      instruction: "Sélectionne les repères pour suivre le signal et le courant dans le dérivateur.",
      observation: "Le nœud B reste à 0 V et n’absorbe aucun courant : le courant du condensateur traverse la résistance de rétroaction.",
      caption: "Schéma original du dérivateur idéal, redessiné d’après la fiche de cours.",
      viewBox: "0 0 520 300",
      shapes: [
        { shape: "circle", cx: 62, cy: 190, r: 27, tone: "soft" },
        { shape: "text", x: 62, y: 196, content: "GBF", anchor: "middle" },
        { shape: "line", x1: 62, y1: 163, x2: 62, y2: 90, tone: "outline" },
        { shape: "line", x1: 62, y1: 90, x2: 175, y2: 90, tone: "outline" },
        { shape: "line", x1: 184, y1: 65, x2: 184, y2: 115, tone: "accent" },
        { shape: "line", x1: 198, y1: 65, x2: 198, y2: 115, tone: "accent" },
        { shape: "line", x1: 198, y1: 90, x2: 285, y2: 90, tone: "outline" },
        { shape: "path", d: "M285 55 L285 175 L405 115 Z", tone: "soft" },
        { shape: "text", x: 302, y: 98, content: "−", anchor: "middle" },
        { shape: "text", x: 302, y: 153, content: "+", anchor: "middle" },
        { shape: "line", x1: 405, y1: 115, x2: 465, y2: 115, tone: "accent" },
        { shape: "line", x1: 345, y1: 80, x2: 345, y2: 28, tone: "outline" },
        { shape: "line", x1: 345, y1: 28, x2: 445, y2: 28, tone: "outline" },
        { shape: "line", x1: 445, y1: 28, x2: 445, y2: 115, tone: "outline" },
        { shape: "path", d: "M365 18 L425 18 L425 38 L365 38 Z", tone: "soft" },
        { shape: "text", x: 395, y: 33, content: "R", anchor: "middle" },
        { shape: "line", x1: 285, y1: 145, x2: 250, y2: 145, tone: "outline" },
        { shape: "line", x1: 250, y1: 145, x2: 250, y2: 235, tone: "outline" },
        { shape: "line", x1: 225, y1: 235, x2: 275, y2: 235, tone: "muted" },
        { shape: "line", x1: 235, y1: 245, x2: 265, y2: 245, tone: "muted" },
        { shape: "line", x1: 245, y1: 255, x2: 255, y2: 255, tone: "muted" },
        { shape: "line", x1: 62, y1: 217, x2: 62, y2: 235, tone: "outline" },
        { shape: "line", x1: 62, y1: 235, x2: 225, y2: 235, tone: "outline" },
        { shape: "text", x: 191, y: 55, content: "C", anchor: "middle" },
        { shape: "text", x: 270, y: 82, content: "B", anchor: "middle" },
        { shape: "text", x: 480, y: 120, content: "uₛ", anchor: "start" },
      ],
      hotspots: [
        { id: "input-capacitor", number: 1, label: "Condensateur d’entrée", detail: "Sa charge vérifie q=Cue. Il transforme donc la variation de ue en courant i=C due/dt.", x: 191, y: 90 },
        { id: "virtual-node", number: 2, label: "Nœud B", detail: "B est une masse virtuelle : VB=0, mais aucun courant ne pénètre dans E⁻.", x: 272, y: 90 },
        { id: "feedback-resistor", number: 3, label: "Résistance de retour", detail: "Le courant du condensateur la traverse et produit uR=Ri ; la sortie vaut us=−uR.", x: 395, y: 28 },
        { id: "grounded-input", number: 4, label: "Entrée E⁺ à la masse", detail: "Elle fixe VE⁺=0 puis, en régime linéaire, VE⁻=0.", x: 250, y: 195 },
      ],
    },
    questions: [
      choice("Dans un dérivateur idéal, le condensateur est placé…", ["à l’entrée", "uniquement sur l’alimentation", "à la sortie sans rétroaction", "en parallèle avec le GBF seulement"], 0, "C relie le générateur à l’entrée inverseuse.", "2.1 Dispositif", 1),
      choice("La résistance R principale est placée…", ["entre la sortie et E⁻", "entre E⁺ et +U", "en série avec l’alimentation négative", "hors du circuit"], 0, "R constitue la rétroaction négative.", "2.1 Dispositif", 1),
      choice("L’entrée non-inverseuse E⁺ est reliée…", ["à la masse", "à la sortie", "au condensateur d’entrée", "au GBF sans dipôle"], 0, "Cette connexion crée la masse virtuelle en E⁻.", "2.1 Dispositif", 1),
      choice("Pourquoi le même courant traverse-t-il C et R dans le modèle idéal ?", ["Parce que i⁻=0", "Parce que us=0 toujours", "Parce que C=R", "Parce que le GBF est saturé"], 0, "Aucun courant ne se perd dans l’entrée inverseuse.", "2.2 Nœud B", 2),
      short("Donne le potentiel VB lorsque E⁺ est à la masse et l’AOP linéaire.", ["0", "0 V", "zéro"], "La masse virtuelle impose VB=0 V.", "2.2 Masse virtuelle", 1),
      choice("Avec les orientations de la fiche, uC vaut…", ["ue", "−ue toujours", "us", "+Vsat"], 0, "Les bornes opposées du condensateur sont à VA et VB=0.", "2.2 Maille MABCM", 1),
      choice("La tension de sortie vérifie d’abord…", ["us=−Ri", "us=+Ri", "us=q/C", "us=Vsat dans tous les cas"], 0, "La maille de sortie donne us=−uR=−Ri.", "2.2 Maille MCBSM", 2),
      choice("La résistance pratique en série avec C sert surtout à…", ["limiter les effets des hautes fréquences et le courant", "annuler toute dérivation", "augmenter C", "forcer la saturation"], 0, "Le dérivateur idéal amplifierait excessivement les variations très rapides.", "2.3.1 Montage pratique", 2),
      choice("Quel repère visuel distingue le dérivateur de l’intégrateur ?", ["C à l’entrée et R en retour", "R et C absents", "deux sorties", "E⁺ non reliée"], 0, "La position relative de R et C est la signature du montage.", "2.1 Dispositif", 1),
    ],
    corrections: [
      "Pages 4-6 : le rôle de la résistance pratique en série avec le condensateur est précisé : elle limite le gain et le courant aux hautes fréquences, plutôt que de seulement « compenser » de façon indifférenciée l’AOP réel.",
    ],
  },
  {
    id: "derivator-law-slope-method",
    title: "Établir la loi du dérivateur",
    summary: "Passer de la charge du condensateur à la dérivée de la tension d’entrée, maîtriser le signe et vérifier les unités.",
    pages: "4-5",
    section: "2.2 Relation entrée-sortie et 2.3.2 vérification",
    durationMinutes: 20,
    xp: 65,
    body: String.raw`## De la charge à la dérivée

Dans le montage idéal, la masse virtuelle donne $u_C=u_e$. La charge du condensateur est donc :

$$q=C u_C=C u_e$$

Le courant qui le traverse vaut :

$$i=\frac{\mathrm dq}{\mathrm dt}=C\frac{\mathrm du_e}{\mathrm dt}$$

Ce même courant traverse la résistance de rétroaction et la sortie vérifie $u_s=-Ri$. En remplaçant $i$ :

$$\boxed{u_s(t)=-RC\frac{\mathrm du_e(t)}{\mathrm dt}}$$

Le produit $RC$ s’exprime en secondes. La dérivée $mathrm du_e/mathrm dt$ s’exprime en volts par seconde ; le produit donne bien des volts.

## Lire la formule sans se tromper

La sortie dépend de la **pente instantanée** de l’entrée :

| Évolution de $u_e$ | Signe de $\mathrm du_e/\mathrm dt$ | Signe de $u_s$ |
|---|---:|---:|
| $u_e$ croît linéairement | positif | négatif |
| $u_e$ décroît linéairement | négatif | positif |
| $u_e$ est constante | nul | nul |

Une rampe d’entrée donne donc un plateau en sortie. Une tension triangulaire, faite de rampes alternativement montantes et descendantes, donne un signal en créneaux.

## Méthode de calcul sur un oscillogramme

Sur un segment rectiligne entre $(t_A,u_A)$ et $(t_B,u_B)$ :

$$a=\frac{\Delta u_e}{\Delta t}=\frac{u_B-u_A}{t_B-t_A}$$

Il faut convertir les millisecondes en secondes avant d’utiliser :

$$u_s=-RCa$$

Dans l’exemple de la fiche, entre $0{,}25$ ms et $0{,}75$ ms, $u_e$ passe de $+1$ V à $-1$ V :

$$a=\frac{-1-1}{(0{,}75-0{,}25)\times10^{-3}}=-4000\ \mathrm{V\,s^{-1}}$$

Avec $R=1000\ \Omega$ et $C=0{,}2\ \mu\mathrm F$ :

$$RC=1000\times0{,}2\times10^{-6}=2\times10^{-4}\ \mathrm s$$

$$u_s=-(2\times10^{-4})(-4000)=+0{,}8\ \mathrm V$$

> **Astuce mémoire.** Le dérivateur lit la **pente**, puis le signe moins la **retourne**.

> **Contrôle express.** Une pente en V/ms ne peut pas être introduite telle quelle dans la formule SI : multiplie sa valeur par $1000$ pour l’obtenir en V/s.` ,
    keyPoint: "La loi du dérivateur idéal est us=−RC·due/dt : la sortie est l’opposée de la pente d’entrée multipliée par la constante de temps RC.",
    example: "Une pente de −4000 V/s avec R=1 kΩ et C=0,2 µF produit us=+0,8 V.",
    methodSteps: [
      "Écris q=Cue grâce à la masse virtuelle.",
      "Dérive : i=C·due/dt.",
      "Utilise us=−Ri pour obtenir us=−RC·due/dt.",
      "Sur le graphe, choisis deux points du même segment rectiligne.",
      "Convertis le temps en secondes puis calcule la pente.",
      "Applique le signe moins et vérifie que le résultat est en volts.",
    ],
    interaction: {
      eyebrow: "Calculateur de pente",
      title: "De la pente d’entrée à la tension de sortie",
      instruction: "Fais varier la pente de ue entre −20 000 et +20 000 V/s pour observer l’inversion de la sortie.",
      observation: "Avec RC=0,2 ms, une pente positive donne une sortie négative de même proportion, et inversement.",
      formula: "us = −RC × pente(ue)",
      formulaTex: "u_s=-RC\\,\\frac{\\mathrm du_e}{\\mathrm dt}",
      inputSymbol: "due/dt",
      outputSuffix: " V",
      rule: { kind: "linear", coefficient: -0.0002, constant: 0 },
      input: { min: -20000, max: 20000, step: 1000, initial: -4000 },
    },
    questions: [
      choice("La charge du condensateur d’entrée vaut…", ["q=Cue", "q=R/ue", "q=us/C", "q=RC seulement"], 0, "La masse virtuelle donne uC=ue.", "2.2 Condensateur", 1),
      choice("Le courant dans le condensateur vaut…", ["C·due/dt", "ue/C", "R·due/dt", "C·ue sans dérivée"], 0, "i=dq/dt et q=Cue.", "2.2 Relation (3)", 2),
      choice("La loi du dérivateur idéal est…", ["us=−RC·due/dt", "us=+RC∫ue dt", "us=ue/R", "us=−ue/(RC)"], 0, "La résistance convertit le courant dérivé en tension inversée.", "2.2 Relation finale", 2),
      choice("L’unité du produit RC est…", ["la seconde", "le volt", "l’ampère", "le watt"], 0, "Ω·F=s.", "2.2 Analyse dimensionnelle", 1),
      choice("Si ue croît linéairement, us est…", ["constante négative", "constante positive", "toujours nulle", "triangulaire de même signe"], 0, "La pente est positive et le signe moins rend la sortie négative.", "2.3 Oscillogramme", 1),
      choice("Si ue décroît linéairement, us est…", ["constante positive", "constante négative", "sinusoïdale", "égale à ue"], 0, "Une pente négative produit une sortie positive.", "2.3 Oscillogramme", 1),
      short("Calcule RC pour R=1000 Ω et C=0,2 µF, en seconde.", ["0,0002", "0.0002", "2.10^-4", "2e-4", "0,2 ms"], "RC=1000×0,2×10⁻⁶=2×10⁻⁴ s.", "2.3.2 Vérification", 2),
      short("Calcule la pente lorsque ue passe de +1 V à −1 V en 0,5 ms.", ["-4000", "-4000 V/s", "-4.10^3", "-4e3"], "Δue=−2 V et Δt=5×10⁻⁴ s, donc a=−4000 V/s.", "2.3.2 Vérification", 2),
      short("Avec RC=0,2 ms et une pente −4000 V/s, donne us.", ["0,8", "0.8", "+0,8", "+0.8", "0,8 V", "+0,8 V"], "us=−2×10⁻⁴×(−4000)=+0,8 V.", "2.3.2 Vérification", 2),
      choice("Une entrée constante produit idéalement…", ["us=0", "us=+Vsat", "un triangle", "une rampe infinie"], 0, "La dérivée d’une constante est nulle.", "2.2 Conséquence", 1),
    ],
  },
  {
    id: "derivator-quiz-triangular-signal",
    title: "Résoudre le quiz du dérivateur",
    summary: "Exploiter la fréquence, calculer les pentes du triangle et construire le créneau de sortie avec son amplitude et son signe.",
    pages: "5-6",
    section: "Quiz 1",
    durationMinutes: 22,
    xp: 75,
    kind: "practice",
    body: String.raw`## Données du quiz

Le circuit possède un condensateur à l’entrée et une résistance $R$ dans la rétroaction : c’est un **dérivateur**. Le GBF fournit un triangle compris entre $+5$ V et $-5$ V, de fréquence :

$$f=1000\ \mathrm{Hz}$$

La période vaut :

$$T=\frac1f=1{,}0\times10^{-3}\ \mathrm s=1\ \mathrm{ms}$$

Le signal descend de $+5$ V à $-5$ V pendant $T/2=0{,}5$ ms, puis remonte pendant la demi-période suivante.

## Première demi-période : le triangle descend

$$\frac{\mathrm du_e}{\mathrm dt}=\frac{-5-5}{0{,}5\times10^{-3}}=-2{,}0\times10^4\ \mathrm{V\,s^{-1}}$$

Avec $R=1000\ \Omega$ et $C=0{,}2\ \mu\mathrm F$ :

$$RC=2{,}0\times10^{-4}\ \mathrm s$$

$$u_s=-RC\frac{\mathrm du_e}{\mathrm dt}=+4{,}0\ \mathrm V$$

## Deuxième demi-période : le triangle monte

La pente change de signe :

$$\frac{\mathrm du_e}{\mathrm dt}=+2{,}0\times10^4\ \mathrm{V\,s^{-1}}$$

La sortie devient :

$$u_s=-4{,}0\ \mathrm V$$

Le signal de sortie est donc un **créneau** de même période : plateau $+4$ V lorsque le triangle descend, puis plateau $-4$ V lorsqu’il monte.

## Ce que montrent les voies de l’oscillographe

- La voie $Y_A$ est branchée à l’entrée : elle affiche le triangle $u_e$.
- La voie $Y_B$ est branchée à la sortie : elle affiche le créneau $u_s$.

La petite résistance $R_p$ placée en série avec $C$ protège le montage réel des très hautes fréquences et des fronts trop rapides. Elle ne change pas la reconnaissance générale du dérivateur.

> **Astuce mémoire.** Quand le triangle **descend**, le créneau est **en haut** ; quand le triangle **monte**, le créneau est **en bas**.

> **Vérification.** La valeur $4$ V reste inférieure à une saturation usuelle : le modèle linéaire est cohérent.` ,
    keyPoint: "Dans le quiz 1, T=1 ms, les pentes valent ±20 000 V/s et la sortie alterne +4 V puis −4 V.",
    example: "De 0 à 0,5 ms, ue chute de 10 V : sa pente vaut −20 000 V/s et le dérivateur fournit +4 V.",
    methodSteps: [
      "Reconnais C à l’entrée et R en retour.",
      "Calcule T=1/f puis la durée T/2 de chaque rampe.",
      "Calcule la variation de tension sur chaque demi-période.",
      "Convertis les millisecondes en secondes.",
      "Applique us=−RC·due/dt sur chaque segment.",
      "Place les plateaux avec le signe opposé à la pente et répète-les chaque période.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Oscillogramme interactif",
      title: "Le créneau produit par le triangle",
      instruction: "Déplace le point sur une période pour suivre la sortie du dérivateur.",
      observation: "La sortie vaut +4 V pendant la pente descendante, puis −4 V pendant la pente montante.",
      formula: "us(t) pour le triangle du quiz 1",
      formulaTex: "u_s=-RC\\,\\frac{\\mathrm du_e}{\\mathrm dt}",
      rule: { kind: "samples", points: [[0, 4], [0.499, 4], [0.5, -4], [0.999, -4], [1, 4]] },
      window: { xMin: 0, xMax: 1, yMin: -5, yMax: 5 },
      guides: [
        { kind: "horizontal", value: 0, label: "0 V" },
        { kind: "vertical", value: 0.5, label: "T/2" },
      ],
      marker: { min: 0, max: 1, step: 0.05, initial: 0.25 },
    },
    questions: [
      choice("Le circuit du quiz 1 est…", ["un dérivateur", "un intégrateur", "un redresseur", "un oscillateur mécanique"], 0, "C est à l’entrée et R dans la rétroaction.", "Quiz 1, question 1", 1),
      choice("Quel élément justifie le mieux cette identification ?", ["La position de C à l’entrée", "La valeur 5 V", "La présence du GBF seule", "Le nom de la voie YA"], 0, "C à l’entrée est la signature structurelle du dérivateur.", "Quiz 1, question 1", 1),
      choice("Rp en série avec C sert à…", ["limiter le comportement excessif aux hautes fréquences", "transformer le montage en intégrateur", "annuler R", "doubler automatiquement la fréquence"], 0, "Elle rend le dérivateur réel plus stable et limite le courant.", "Quiz 1, question 2", 2),
      short("Donne la période du signal pour f=1000 Hz.", ["1 ms", "1ms", "0,001 s", "0.001 s", "10^-3 s"], "T=1/f=10⁻³ s=1 ms.", "Quiz 1, données", 1),
      short("Donne la durée d’une demi-période.", ["0,5 ms", "0.5 ms", "0,0005 s", "0.0005 s", "5.10^-4 s"], "T/2=0,5 ms.", "Quiz 1, figure 2", 1),
      short("Donne la pente de ue pendant la descente.", ["-20000", "-20000 V/s", "-2.10^4", "-2e4"], "La tension varie de −10 V en 0,5 ms.", "Quiz 1, question 3", 2),
      short("Donne la pente de ue pendant la montée.", ["20000", "+20000", "20000 V/s", "+2.10^4", "2e4"], "La tension varie de +10 V en 0,5 ms.", "Quiz 1, question 3", 2),
      short("Calcule RC avec les données du quiz.", ["0,0002", "0.0002", "2.10^-4 s", "2e-4 s", "0,2 ms"], "RC=1000×0,2 µF=2×10⁻⁴ s.", "Quiz 1, données", 2),
      short("Donne us pendant la pente descendante.", ["4", "+4", "4 V", "+4 V", "4,0 V"], "us=−2×10⁻⁴×(−2×10⁴)=+4 V.", "Quiz 1, question 3.1", 2),
      short("Donne us pendant la pente montante.", ["-4", "-4 V", "-4,0 V"], "us=−2×10⁻⁴×(+2×10⁴)=−4 V.", "Quiz 1, question 3.1", 2),
      choice("La voie YA affiche…", ["le triangle d’entrée", "le créneau de sortie", "la saturation seulement", "la charge du condensateur en coulombs"], 0, "YA est reliée à l’entrée du circuit.", "Quiz 1, question 3.1", 1),
      choice("La forme de us est…", ["un signal en créneaux", "une constante nulle", "un triangle identique à ue", "une parabole"], 0, "Chaque pente constante du triangle devient un plateau constant.", "Quiz 1, question 3.2", 1),
    ],
  },
  {
    id: "integrator-circuit-law",
    title: "Reconnaître et démontrer l’intégrateur",
    summary: "Identifier R à l’entrée et C en rétroaction, puis établir une relation intégrale complète avec sa condition initiale.",
    pages: "6-7",
    section: "3.1 Dispositif et 3.2 relation entrée-sortie",
    durationMinutes: 22,
    xp: 80,
    body: String.raw`## La signature visuelle de l’intégrateur

Dans le montage intégrateur idéal :

- la **résistance $R$ est à l’entrée** ;
- le **condensateur $C$ est dans la rétroaction**, entre la sortie et l’entrée inverseuse ;
- l’entrée non-inverseuse est à la masse.

La position de $R$ et $C$ est donc exactement l’inverse de celle du dérivateur.

## Établir la relation différentielle

La masse virtuelle impose $V_B=0$. La résistance d’entrée porte la tension $u_e$ :

$$u_e=Ri\quad\Longrightarrow\quad i=\frac{u_e}{R}$$

La tension de sortie est opposée à la tension du condensateur :

$$u_s=-u_C=-\frac qC$$

Or :

$$i=\frac{\mathrm dq}{\mathrm dt}$$

En dérivant $u_s=-q/C$ :

$$\frac{\mathrm du_s}{\mathrm dt}=-\frac1C\frac{\mathrm dq}{\mathrm dt}=-\frac iC$$

Puis en remplaçant $i=u_e/R$ :

$$\boxed{\frac{\mathrm du_s}{\mathrm dt}=-\frac{u_e}{RC}}$$

ou, sous une forme très utile pour analyser un oscillogramme :

$$\boxed{u_e=-RC\frac{\mathrm du_s}{\mathrm dt}}$$

## La relation intégrale complète

Entre un instant initial $t_0$ et l’instant $t$ :

$$\boxed{u_s(t)=u_s(t_0)-\frac1{RC}\int_{t_0}^{t}u_e(\tau)\,\mathrm d\tau}$$

La valeur $u_s(t_0)$ est indispensable : une intégrale indéfinie comporte toujours une constante. Le montage accumule l’aire algébrique sous la courbe d’entrée à partir de son état initial.

## Montage pratique

Une grande résistance $R_p$ est placée en parallèle avec le condensateur. Elle fournit un chemin de rétroaction en continu et empêche les petites tensions parasites de charger indéfiniment $C$ jusqu’à saturer la sortie. Le circuit reste approximativement intégrateur dans la bande de fréquences prévue.

> **Astuce mémoire.** **R entre en premier : C cumule dans le retour.** Le condensateur mémorise l’aire du signal d’entrée.

> **Correction mathématique.** Écrire seulement $u_s=-(1/RC)\int u_e\,dt$ masque la constante d’intégration. La forme avec $t_0$ et $u_s(t_0)$ est complète.` ,
    keyPoint: "Intégrateur : R à l’entrée, C en rétroaction, avec dus/dt=−ue/(RC) et us(t)=us(t₀)−(1/RC)∫ue dτ.",
    example: "Si ue=+4 V, R=20 kΩ et C=0,5 µF, alors RC=0,01 s et dus/dt=−400 V/s : la sortie descend linéairement.",
    methodSteps: [
      "Repère R à l’entrée et C dans la boucle de retour.",
      "Pose VB=0 puis écris i=ue/R.",
      "Écris us=−q/C et i=dq/dt.",
      "Dérive pour obtenir dus/dt=−ue/(RC).",
      "Intègre entre t0 et t en conservant us(t0).",
      "Interprète Rp comme une protection contre la dérive continue et la saturation.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Circuit interactif",
      title: "Le condensateur est dans la rétroaction",
      instruction: "Sélectionne les repères pour reconstruire la démonstration de l’intégrateur.",
      observation: "R transforme ue en courant ; C accumule ce courant et la sortie prend l’opposé de sa tension.",
      caption: "Schéma original de l’intégrateur idéal, redessiné d’après la fiche de cours.",
      viewBox: "0 0 520 300",
      shapes: [
        { shape: "circle", cx: 62, cy: 190, r: 27, tone: "soft" },
        { shape: "text", x: 62, y: 196, content: "GBF", anchor: "middle" },
        { shape: "line", x1: 62, y1: 163, x2: 62, y2: 90, tone: "outline" },
        { shape: "line", x1: 62, y1: 90, x2: 120, y2: 90, tone: "outline" },
        { shape: "path", d: "M120 78 L205 78 L205 102 L120 102 Z", tone: "soft" },
        { shape: "text", x: 162, y: 96, content: "R", anchor: "middle" },
        { shape: "line", x1: 205, y1: 90, x2: 285, y2: 90, tone: "outline" },
        { shape: "path", d: "M285 55 L285 175 L405 115 Z", tone: "soft" },
        { shape: "text", x: 302, y: 98, content: "−", anchor: "middle" },
        { shape: "text", x: 302, y: 153, content: "+", anchor: "middle" },
        { shape: "line", x1: 405, y1: 115, x2: 465, y2: 115, tone: "accent" },
        { shape: "line", x1: 345, y1: 80, x2: 345, y2: 28, tone: "outline" },
        { shape: "line", x1: 345, y1: 28, x2: 378, y2: 28, tone: "outline" },
        { shape: "line", x1: 386, y1: 10, x2: 386, y2: 46, tone: "accent" },
        { shape: "line", x1: 400, y1: 10, x2: 400, y2: 46, tone: "accent" },
        { shape: "line", x1: 400, y1: 28, x2: 445, y2: 28, tone: "outline" },
        { shape: "line", x1: 445, y1: 28, x2: 445, y2: 115, tone: "outline" },
        { shape: "line", x1: 285, y1: 145, x2: 250, y2: 145, tone: "outline" },
        { shape: "line", x1: 250, y1: 145, x2: 250, y2: 235, tone: "outline" },
        { shape: "line", x1: 225, y1: 235, x2: 275, y2: 235, tone: "muted" },
        { shape: "line", x1: 235, y1: 245, x2: 265, y2: 245, tone: "muted" },
        { shape: "line", x1: 245, y1: 255, x2: 255, y2: 255, tone: "muted" },
        { shape: "line", x1: 62, y1: 217, x2: 62, y2: 235, tone: "outline" },
        { shape: "line", x1: 62, y1: 235, x2: 225, y2: 235, tone: "outline" },
        { shape: "text", x: 393, y: 8, content: "C", anchor: "middle" },
        { shape: "text", x: 270, y: 82, content: "B", anchor: "middle" },
        { shape: "text", x: 480, y: 120, content: "uₛ", anchor: "start" },
      ],
      hotspots: [
        { id: "input-resistor", number: 1, label: "Résistance d’entrée", detail: "Comme VB=0, elle impose i=ue/R.", x: 162, y: 90 },
        { id: "virtual-node-integrator", number: 2, label: "Masse virtuelle", detail: "Le nœud B reste à 0 V et tout le courant de R traverse C.", x: 270, y: 90 },
        { id: "feedback-capacitor", number: 3, label: "Condensateur de retour", detail: "Il accumule la charge q=∫i dt et sa tension est l’opposée de us.", x: 393, y: 28 },
        { id: "integrator-output", number: 4, label: "Sortie intégrée", detail: "Sa pente vaut −ue/(RC) : une entrée constante crée une rampe.", x: 448, y: 115 },
      ],
    },
    questions: [
      choice("Dans un intégrateur, la résistance R est placée…", ["à l’entrée", "sur l’alimentation uniquement", "en parallèle avec le GBF", "hors du circuit"], 0, "R relie la source à l’entrée inverseuse.", "3.1 Dispositif", 1),
      choice("Le condensateur C principal est placé…", ["dans la rétroaction", "à l’entrée avant R", "sur E⁺ sans retour", "entre les deux alimentations"], 0, "C relie la sortie à E⁻.", "3.1 Dispositif", 1),
      choice("La masse virtuelle permet d’écrire…", ["i=ue/R", "i=us/R toujours", "i=Cue", "i=0 dans R"], 0, "La résistance voit ue entre son entrée et le nœud B à 0 V.", "3.2 Maille MABCM", 2),
      choice("La sortie et la tension du condensateur vérifient…", ["us=−uC", "us=+uC", "us=Ri", "us=0"], 0, "La maille de retour impose l’opposition.", "3.2 Maille MCBSM", 1),
      choice("La relation différentielle de l’intégrateur est…", ["dus/dt=−ue/(RC)", "dus/dt=−RC·ue", "us=−RC·due/dt", "due/dt=0 toujours"], 0, "Elle résulte de i=ue/R et us=−q/C.", "3.2 Relation finale", 2),
      choice("La forme équivalente utile sur un graphe est…", ["ue=−RC·dus/dt", "ue=+us/(RC)", "ue=RC·us", "ue=0"], 0, "On multiplie la relation précédente par −RC.", "3.2 Relation", 2),
      choice("Pourquoi faut-il préciser us(t0) dans la relation intégrale ?", ["Parce que l’intégration introduit une constante", "Parce que R est variable", "Parce que C vaut toujours zéro", "Parce que le temps n’a pas d’unité"], 0, "L’état initial du condensateur fixe le niveau vertical de la sortie.", "3.2 Intégration", 2),
      choice("Une entrée constante positive donne une sortie…", ["qui décroît linéairement", "qui croît linéairement", "constante positive", "toujours saturée immédiatement"], 0, "dus/dt est négative et constante.", "3.2 Interprétation", 1),
      choice("La résistance Rp en parallèle avec C sert à…", ["éviter la dérive continue et la saturation", "supprimer toute rétroaction", "doubler la capacité", "faire entrer un courant dans E⁺"], 0, "Elle offre un chemin de retour en continu.", "3.3.1 Montage pratique", 2),
      short("Pour R=20 kΩ et C=0,5 µF, donne RC.", ["0,01", "0.01", "0,01 s", "0.01 s", "10 ms"], "RC=20 000×0,5×10⁻⁶=0,01 s.", "Quiz 2, données", 2),
    ],
    corrections: [
      "Page 7 : la primitive est écrite sans constante d’intégration. La relation complète est us(t)=us(t0)−(1/RC)∫ de t0 à t ue(τ)dτ.",
      "Page 7 : le rôle de la résistance parallèle est précisé : elle fournit une rétroaction continue qui réduit la dérive et évite la saturation due aux défauts réels.",
    ],
  },
  {
    id: "integrator-quiz-square-signal",
    title: "Résoudre le quiz de l’intégrateur",
    summary: "Lire le créneau ±4 V, calculer période, fréquence et coefficient, puis construire la rampe triangulaire de sortie.",
    pages: "7-8",
    section: "3.3 Visualisation et Quiz 2",
    durationMinutes: 22,
    xp: 90,
    kind: "practice",
    body: String.raw`## Le signal d’entrée du quiz 2

La tension $u_e$ vaut alternativement $+4$ V puis $-4$ V. Chaque plateau dure $5$ ms :

$$T=10\ \mathrm{ms}=1{,}0\times10^{-2}\ \mathrm s$$

$$f=\frac1T=100\ \mathrm{Hz}$$

Le montage contient $R=20\ \mathrm{k}\Omega$ et $C=0{,}5\ \mu\mathrm F$ :

$$RC=20\times10^3\times0{,}5\times10^{-6}=1{,}0\times10^{-2}\ \mathrm s$$

## Relier l’entrée à la pente de sortie

La loi peut s’écrire :

$$\boxed{u_e=-RC\frac{\mathrm du_s}{\mathrm dt}}$$

La tension d’entrée est donc proportionnelle à la dérivée de la sortie, avec le coefficient :

$$\boxed{-RC=-0{,}010\ \mathrm s}$$

Lorsque $u_e=+4$ V :

$$\frac{\mathrm du_s}{\mathrm dt}=-\frac{4}{0{,}010}=-400\ \mathrm{V\,s^{-1}}$$

Pendant $5$ ms, la variation de sortie est :

$$\Delta u_s=(-400)(5\times10^{-3})=-2\ \mathrm V$$

Lorsque $u_e=-4$ V, la pente devient $+400\ \mathrm{V\,s^{-1}}$ et la sortie remonte de $2$ V pendant la demi-période suivante.

La sortie est donc **triangulaire**. Son niveau absolu dépend de la tension initiale du condensateur, mais sa pente et sa variation sur chaque intervalle sont entièrement déterminées.

## Lecture physique

Le condensateur ne reproduit pas le plateau d’entrée : il l’accumule. Une aire rectangulaire positive sous $u_e$ fait descendre $u_s$ à vitesse constante ; une aire négative la fait remonter.

> **Astuce mémoire.** Créneau constant à l’entrée → pente constante à la sortie → triangle.

> **Point de rigueur.** Sans valeur initiale $u_s(0)$, on peut calculer les variations de la sortie, mais pas sa position verticale exacte sur l’écran.` ,
    keyPoint: "Dans le quiz 2, T=10 ms, f=100 Hz, RC=0,010 s et les pentes de sortie valent −400 puis +400 V/s.",
    example: "Sur le plateau ue=+4 V durant 5 ms, us baisse de 2 V ; sur le plateau −4 V, elle remonte de 2 V.",
    methodSteps: [
      "Lis la durée entre deux fronts identiques pour obtenir T.",
      "Convertis T en secondes puis calcule f=1/T.",
      "Calcule RC avec R en ohms et C en farads.",
      "Utilise dus/dt=−ue/(RC) sur chaque plateau.",
      "Multiplie la pente par la durée du plateau pour obtenir Δus.",
      "Relie les segments en conservant la continuité de la tension du condensateur.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Oscillogramme interactif",
      title: "Le triangle produit par le créneau",
      instruction: "Déplace le point entre 0 et 20 ms pour suivre les rampes successives de la sortie.",
      observation: "La sortie baisse pendant chaque plateau +4 V et remonte pendant chaque plateau −4 V.",
      formula: "us(t) pour le créneau du quiz 2",
      formulaTex: "\\frac{\\mathrm du_s}{\\mathrm dt}=-\\frac{u_e}{RC}",
      rule: { kind: "samples", points: [[0, 1], [5, -1], [10, 1], [15, -1], [20, 1]] },
      window: { xMin: 0, xMax: 20, yMin: -1.4, yMax: 1.4 },
      guides: [
        { kind: "horizontal", value: 0, label: "niveau moyen" },
        { kind: "vertical", value: 5, label: "5 ms" },
        { kind: "vertical", value: 10, label: "T" },
      ],
      marker: { min: 0, max: 20, step: 0.5, initial: 2.5 },
    },
    questions: [
      choice("Le signal d’entrée du quiz 2 est…", ["un créneau ±4 V", "un triangle ±4 V", "une constante 4 V", "une sinusoïde"], 0, "La figure montre des plateaux alternés à +4 V et −4 V.", "Quiz 2, figure", 1),
      short("Donne la période T du signal.", ["10 ms", "10ms", "0,01 s", "0.01 s"], "Deux fronts montants successifs sont séparés de 10 ms.", "Quiz 2, question 2.1", 1),
      short("Donne la fréquence du signal.", ["100", "100 Hz", "100Hz"], "f=1/0,01=100 Hz.", "Quiz 2, question 2.1", 1),
      short("Donne RC pour les valeurs du quiz.", ["0,01", "0.01", "0,01 s", "0.01 s", "10 ms"], "RC=0,010 s.", "Quiz 2, question 3", 2),
      short("Quel est le coefficient reliant ue à dus/dt dans ue=k·dus/dt ?", ["-0,01", "-0.01", "-0,01 s", "-0.01 s", "-10 ms"], "k=−RC=−0,010 s.", "Quiz 2, question 3", 2),
      short("Donne la pente de us lorsque ue=+4 V.", ["-400", "-400 V/s"], "dus/dt=−4/0,01=−400 V/s.", "Quiz 2, question 2.2", 2),
      short("Donne la pente de us lorsque ue=−4 V.", ["400", "+400", "400 V/s", "+400 V/s"], "dus/dt=+400 V/s.", "Quiz 2, question 2.2", 2),
      short("Donne Δus pendant un plateau positif de 5 ms.", ["-2", "-2 V"], "Δus=−400×0,005=−2 V.", "Quiz 2, exploitation", 2),
      short("Donne Δus pendant un plateau négatif de 5 ms.", ["2", "+2", "2 V", "+2 V"], "Δus=+400×0,005=+2 V.", "Quiz 2, exploitation", 2),
      choice("La sortie du montage est…", ["triangulaire", "en créneaux identiques", "toujours nulle", "parabolique"], 0, "Une entrée constante par morceaux produit des rampes linéaires.", "3.3 Visualisation", 1),
      choice("Pourquoi la sortie reste-t-elle continue aux fronts de ue ?", ["La tension d’un condensateur ne saute pas instantanément dans ce modèle", "Parce que R est nulle", "Parce que us=ue", "Parce que la fréquence vaut zéro"], 0, "Le condensateur impose la continuité de sa tension et donc de us=−uC.", "3.3 Visualisation", 2),
      choice("Sans us(0), on peut déterminer…", ["les pentes et variations, pas le décalage vertical exact", "aucune information", "uniquement la masse du GBF", "la saturation exacte"], 0, "La constante d’intégration fixe le niveau initial.", "Quiz 2, conclusion", 2),
    ],
  },
  {
    id: "derivator-integrator-comparison",
    title: "Distinguer et utiliser les deux montages",
    summary: "Construire une carte de décision rapide reliant position de R et C, formule, forme d’entrée et forme de sortie.",
    pages: "1 et 9",
    section: "4. Intérêt des montages intégrateur et dérivateur",
    durationMinutes: 16,
    xp: 105,
    body: String.raw`## Deux circuits complémentaires

Les deux montages utilisent le même AOP inverseur, la même masse virtuelle et les mêmes composants $R$ et $C$. Leur fonction change lorsque l’on échange la position de ces deux composants.

| Critère | Dérivateur | Intégrateur |
|---|---|---|
| Dipôle à l’entrée | condensateur $C$ | résistance $R$ |
| Dipôle de rétroaction | résistance $R$ | condensateur $C$ |
| Relation | $u_s=-RC\,\mathrm du_e/\mathrm dt$ | $\mathrm du_s/\mathrm dt=-u_e/(RC)$ |
| Entrée type | triangle | créneau |
| Sortie type | créneau | triangle |
| Sens physique | détecte la variation | accumule l’aire |

## La règle du signal

Un dérivateur répond à la pente :

- une rampe montante devient un plateau négatif ;
- une rampe descendante devient un plateau positif ;
- un plateau idéal devient zéro, sauf aux fronts où sa dérivée est impulsionnelle.

Un intégrateur répond à l’aire :

- un plateau positif fait descendre la sortie ;
- un plateau négatif fait monter la sortie ;
- une impulsion très brève fait varier rapidement le niveau de sortie.

## L’intérêt en électronique

Ces montages permettent de produire une forme de signal à partir d’une autre et d’effectuer analogiquement une opération mathématique. Ils interviennent dans le traitement de signaux, la détection de variations rapides, la génération de rampes et certains systèmes de commande.

## Les limites du modèle idéal

Les formules ne peuvent pas conduire à une sortie dépassant les saturations. Les composants pratiques $R_p$ limitent le gain extrême, la dérive et les effets des imperfections. Les créneaux et impulsions réels ont toujours des fronts de durée finie.

> **Astuce mémoire double.** **C à l’entrée capte le changement** ; **C dans le retour cumule le changement**.

> **Réflexe examen.** Commence par entourer $R$ et $C$ sur le schéma. Le nom du montage et la bonne formule apparaissent avant tout calcul.` ,
    keyPoint: "C à l’entrée → dérivateur → triangle vers créneau ; C en rétroaction → intégrateur → créneau vers triangle.",
    example: "Un montage reçoit un créneau et délivre un triangle : c’est l’intégrateur, donc R est à l’entrée et C dans la rétroaction.",
    methodSteps: [
      "Repère la position de C par rapport à l’entrée et à la sortie.",
      "Nomme le montage avant de choisir une formule.",
      "Traduis chaque portion du signal en pente ou en aire.",
      "Applique le signe inverseur de l’AOP.",
      "Vérifie la continuité de la tension du condensateur.",
      "Contrôle que l’amplitude calculée reste sous Vsat.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Carte de décision",
      title: "Dériver ou intégrer ?",
      instruction: "Sélectionne une carte pour retrouver la structure, la formule et la transformation associées.",
      observation: "La position du condensateur est le critère le plus rapide et le plus fiable.",
      rootLabel: "AOP inverseur + R + C",
      rootDetail: "Deux composants identiques, deux opérations opposées selon leur position.",
      nodes: [
        { id: "identify-derivator", label: "C à l’entrée", role: "Dérivateur", detail: "R est en rétroaction. La sortie vaut us=−RC·due/dt et révèle la pente de l’entrée.", group: "Structure" },
        { id: "identify-integrator", label: "C en rétroaction", role: "Intégrateur", detail: "R est à l’entrée. La pente de sortie vaut dus/dt=−ue/(RC) et la sortie accumule l’aire.", group: "Structure" },
        { id: "triangle-to-square", label: "Triangle → créneau", role: "Dérivation", detail: "Les pentes constantes du triangle deviennent des plateaux de signes opposés.", group: "Signaux" },
        { id: "square-to-triangle", label: "Créneau → triangle", role: "Intégration", detail: "Les plateaux constants du créneau deviennent des rampes de signes opposés.", group: "Signaux" },
        { id: "real-derivator", label: "Résistance série", role: "Protection HF", detail: "Elle limite le courant et le gain du dérivateur aux fréquences élevées.", group: "Montage réel" },
        { id: "real-integrator", label: "Résistance parallèle", role: "Protection continue", detail: "Elle limite la dérive de l’intégrateur et évite une saturation progressive.", group: "Montage réel" },
      ],
    },
    questions: [
      choice("C à l’entrée et R en rétroaction désignent…", ["le dérivateur", "l’intégrateur", "un circuit LC libre", "un pont de diodes"], 0, "La position du condensateur identifie le dérivateur.", "4. Distinction", 1),
      choice("R à l’entrée et C en rétroaction désignent…", ["l’intégrateur", "le dérivateur", "un solénoïde", "un montage saturé obligatoire"], 0, "C dans le retour accumule la charge.", "4. Distinction", 1),
      choice("Un triangle à l’entrée du dérivateur donne…", ["un créneau", "un autre triangle identique", "une constante toujours positive", "une parabole"], 0, "Les pentes constantes deviennent des plateaux.", "4. Intérêt", 1),
      choice("Un créneau à l’entrée de l’intégrateur donne…", ["un triangle", "un créneau identique", "une sinusoïde parfaite dans tous les cas", "zéro"], 0, "Les plateaux deviennent des rampes.", "4. Intérêt", 1),
      choice("Le dérivateur est surtout sensible…", ["aux variations rapides", "à l’aire accumulée uniquement", "à la masse du montage", "à la couleur du signal"], 0, "Il calcule une dérivée temporelle.", "4. Interprétation", 1),
      choice("L’intégrateur traduit principalement…", ["l’aire algébrique accumulée", "la pente instantanée de l’entrée seulement", "la fréquence sans tension", "la saturation de l’alimentation"], 0, "L’intégrale est une accumulation d’aire.", "4. Interprétation", 1),
      choice("Le signe moins présent dans les deux relations vient…", ["de la configuration inverseuse", "de l’unité du farad", "du GBF uniquement", "d’une erreur de calcul"], 0, "La sortie est renvoyée vers l’entrée inverseuse.", "2.2 et 3.2", 2),
      choice("Avant d’accepter une amplitude calculée, il faut vérifier…", ["qu’elle reste sous |Vsat|", "que R=C", "que t est en kilogrammes", "que E⁺ absorbe un courant"], 0, "Au-delà des saturations, le modèle linéaire n’est plus valable.", "1.3 et 4", 2),
    ],
  },
  {
    id: "integrator-evaluation-signal-reconstruction",
    title: "Réussir la situation d’évaluation",
    summary: "Identifier l’intégrateur, reconstruire le créneau d’entrée à partir du triangle de sortie, puis interpréter une sortie carrée comme la réponse à des impulsions.",
    pages: "9",
    section: "Situation d’évaluation",
    durationMinutes: 26,
    xp: 120,
    kind: "challenge",
    body: String.raw`## Analyser le circuit avant les graphes

La résistance $R$ est à l’entrée et le condensateur $C$ est dans la rétroaction : le circuit est un **intégrateur inverseur**. La résistance $R_p$ montée en parallèle avec $C$ fournit un chemin de retour continu et limite la dérive du montage réel.

Les données sont :

$$R=10\ \mathrm{k}\Omega,\qquad C=0{,}2\ \mu\mathrm F,\qquad T=2\ \mathrm{ms}$$

La constante de temps vaut :

$$RC=10^4\times0{,}2\times10^{-6}=2{,}0\times10^{-3}\ \mathrm s=2\ \mathrm{ms}$$

## Reconstruire $u_e$ à partir du triangle $u_s$

La relation à employer est :

$$u_e=-RC\frac{\mathrm du_s}{\mathrm dt}$$

Pendant la première demi-période, $u_s$ monte de $-2$ V à $+2$ V en $T/2=1$ ms :

$$\frac{\mathrm du_s}{\mathrm dt}=\frac{2-(-2)}{1\times10^{-3}}=+4000\ \mathrm{V\,s^{-1}}$$

Donc :

$$u_e=-(2\times10^{-3})(4000)=-8\ \mathrm V$$

Pendant la deuxième demi-période, la pente vaut $-4000\ \mathrm{V\,s^{-1}}$ et :

$$u_e=+8\ \mathrm V$$

Le signal d’entrée recherché est donc un **créneau** : $-8$ V lorsque la sortie monte, puis $+8$ V lorsqu’elle descend. Il possède la même période $T=2$ ms et la fréquence :

$$f=\frac1T=500\ \mathrm{Hz}$$

## Quand la sortie est carrée

La figure 3 montre désormais une sortie idéale passant brusquement de $+2$ V à $-2$ V, puis inversement. Or l’entrée vérifie $u_e=-RC\,\mathrm du_s/\mathrm dt$ :

- sur chaque plateau, $\mathrm du_s/\mathrm dt=0$, donc $u_e=0$ ;
- à chaque front idéal, la dérivée est une impulsion très brève ;
- un front descendant produit une impulsion **positive** à l’entrée ;
- un front montant produit une impulsion **négative**.

Le GBF doit donc délivrer un **signal impulsionnel alterné**. Dans un circuit réel, les fronts ont une durée finie : les impulsions ont une grande amplitude mais ne sont pas infinies.

## Bilan de la mission

Cette situation oblige à travailler « à l’envers » : la sortie est connue et l’entrée doit être retrouvée. Le bon réflexe consiste à calculer la pente de $u_s$ sur chaque intervalle, puis à appliquer $u_e=-RC\,\mathrm du_s/\mathrm dt$.

> **Astuce mémoire.** Pour l’intégrateur, si la sortie **monte**, l’entrée est **négative** ; si la sortie **descend**, l’entrée est **positive**.

> **Précision.** La figure 3 ne peut provenir d’un créneau d’entrée ordinaire : un intégrateur transformerait ce créneau en triangle. Il faut des impulsions concentrées aux instants des sauts.` ,
    keyPoint: "Dans la mission : RC=2 ms ; le triangle ±2 V impose un créneau d’entrée −8 V puis +8 V, et une sortie carrée impose des impulsions alternées.",
    example: "Sur la montée de −2 V à +2 V en 1 ms, us’=+4000 V/s ; ainsi ue=−0,002×4000=−8 V.",
    methodSteps: [
      "Identifie R à l’entrée et C en retour : le circuit est intégrateur.",
      "Calcule RC et convertis la demi-période en secondes.",
      "Découpe la sortie en segments de pente constante.",
      "Calcule dus/dt sur chaque segment.",
      "Reconstruis ue avec ue=−RC·dus/dt et place les plateaux.",
      "Pour une sortie discontinue, remplace les fronts idéaux par des impulsions réelles de durée finie.",
    ],
    interaction: timeline([
      { label: "Identifier le montage", shortLabel: "R entrée, C retour", detail: "La structure est celle d’un intégrateur inverseur ; Rp stabilise le comportement réel en continu." },
      { label: "Calculer la constante", shortLabel: "RC=2 ms", detail: "10 kΩ × 0,2 µF = 2×10⁻³ s." },
      { label: "Lire la montée", shortLabel: "+4000 V/s", detail: "La sortie passe de −2 V à +2 V en 1 ms ; l’entrée vaut alors −8 V." },
      { label: "Lire la descente", shortLabel: "−4000 V/s", detail: "La sortie revient de +2 V à −2 V en 1 ms ; l’entrée vaut alors +8 V." },
      { label: "Interpréter les fronts", shortLabel: "Impulsions", detail: "Une sortie carrée a une dérivée nulle sur les plateaux et concentrée aux transitions : l’entrée est impulsionnelle alternée." },
    ], "Reconstruire l’entrée à partir de la sortie", "Sélectionne chaque étape de la mission avant de répondre.", "Le même outil ue=−RC·dus/dt traite le triangle et explique les impulsions associées au carré."),
    questions: [
      choice("Le circuit de la situation d’évaluation est…", ["un intégrateur", "un dérivateur", "un circuit LC isolé", "un redresseur"], 0, "R est à l’entrée et C dans la rétroaction.", "Situation, question 1", 1),
      choice("La justification correcte est…", ["R à l’entrée et C en parallèle de retour", "C à l’entrée et R absent", "la sortie vaut 2 V", "la période est 2 ms"], 0, "La topologie du circuit détermine sa fonction.", "Situation, question 1", 1),
      choice("Rp en parallèle avec C sert à…", ["limiter la dérive et la saturation du montage réel", "annuler le condensateur", "transformer le montage en dérivateur idéal", "doubler la fréquence"], 0, "Elle assure une rétroaction en continu.", "Situation, question 2", 2),
      short("Calcule RC avec R=10 kΩ et C=0,2 µF.", ["0,002", "0.002", "0,002 s", "0.002 s", "2 ms"], "RC=2×10⁻³ s.", "Situation, données", 2),
      short("Donne la demi-période T/2.", ["1 ms", "1ms", "0,001 s", "0.001 s"], "T=2 ms donc T/2=1 ms.", "Situation, figure 2", 1),
      short("Donne la pente de us pendant la montée de −2 V à +2 V.", ["4000", "+4000", "4000 V/s", "+4000 V/s"], "La variation +4 V s’effectue en 10⁻³ s.", "Situation, question 3.1", 2),
      short("Donne ue pendant cette montée.", ["-8", "-8 V"], "ue=−0,002×4000=−8 V.", "Situation, question 3.1", 2),
      short("Donne la pente de us pendant la descente.", ["-4000", "-4000 V/s"], "La variation −4 V s’effectue en 10⁻³ s.", "Situation, question 3.1", 2),
      short("Donne ue pendant cette descente.", ["8", "+8", "8 V", "+8 V"], "ue=−0,002×(−4000)=+8 V.", "Situation, question 3.1", 2),
      choice("La forme du signal d’entrée reconstruit est…", ["un créneau", "un triangle", "une constante nulle", "une parabole"], 0, "Les deux pentes constantes donnent deux plateaux opposés.", "Situation, question 3.2", 1),
      short("Donne la fréquence du signal pour T=2 ms.", ["500", "500 Hz", "500Hz"], "f=1/(2×10⁻³)=500 Hz.", "Situation, exploitation", 1),
      choice("Lorsque us est constante sur un plateau de la figure 3, ue vaut idéalement…", ["0", "+2 V", "−2 V", "8 V"], 0, "La dérivée d’un plateau est nulle.", "Situation, question 4", 1),
      choice("Un front descendant de us correspond à une impulsion d’entrée…", ["positive", "négative", "nulle", "sinusoïdale"], 0, "dus/dt est très négative et ue=−RC·dus/dt devient positive.", "Situation, question 4", 2),
      choice("Un front montant de us correspond à une impulsion d’entrée…", ["négative", "positive", "nulle", "triangulaire"], 0, "dus/dt est très positive, donc ue est négative.", "Situation, question 4", 2),
      choice("La nature du signal délivré par le GBF pour obtenir la figure 3 est…", ["un signal impulsionnel alterné", "un simple créneau ±2 V", "une tension continue", "un triangle lent"], 0, "La dérivée d’un carré idéal est une succession d’impulsions alternées.", "Situation, question 4", 2),
    ],
    corrections: [
      "Page 9 : la nature du signal associé à une sortie carrée est explicitée. Dans le modèle idéal, il s’agit d’impulsions alternées aux fronts ; dans le montage réel, ce sont des impulsions brèves de durée finie.",
    ],
  },
];

const levelOrder = [
  "ideal-operational-amplifier",
  "derivator-circuit-identification",
  "derivator-law-slope-method",
  "derivator-quiz-triangular-signal",
  "integrator-circuit-law",
  "integrator-quiz-square-signal",
  "derivator-integrator-comparison",
  "integrator-evaluation-signal-reconstruction",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error("Niveau de montages dérivateur et intégrateur introuvable : " + id);
  return officialLevel(index, level);
});

export const derivatorIntegratorPath: LearningPath = {
  id: "terminale-cd-derivator-integrator",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminales C et D • Cours de Physique-Chimie en ligne",
  curriculumSourceUrl: "https://courspcenligne-ci-21.webself.net/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 11,
  title: "Montages dérivateur et intégrateur",
  description: "Utiliser un amplificateur opérationnel idéal pour dériver ou intégrer une tension, interpréter les oscillogrammes et reconstruire un signal d’entrée ou de sortie.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Identifier les bornes et les propriétés d’un amplificateur opérationnel idéal.",
    "Reconnaître un dérivateur ou un intégrateur à la position de R et C.",
    "Établir les relations entrée-sortie des deux montages.",
    "Transformer un signal triangulaire en créneau et un créneau en triangle.",
    "Calculer périodes, fréquences, pentes, amplitudes et constantes de temps.",
    "Reconstruire un signal inconnu à partir d’un oscillogramme et interpréter les impulsions.",
  ],
  modules: [{
    id: "derivator-integrator-mastery",
    title: "Maîtriser les montages dérivateur et intégrateur",
    description: "De l’AOP idéal à la situation d’évaluation, une progression complète fondée sur les 9 pages de la fiche ivoirienne.",
    lessons: builtLevels,
  }],
};

export const derivatorIntegratorPaths: LearningPath[] = [derivatorIntegratorPath];
