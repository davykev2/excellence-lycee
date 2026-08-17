import { createSvtPath, type SvtCourseSeed } from "./svtPathFactory";
import { q, choice, trueFalse, createSvtSource } from "./terminalSvtPathHelpers";

const brainActivitySource = createSvtSource("SVT TA_L2_Lactivité cérébrale chez lHomme.pdf");

const course: SvtCourseSeed = {
    id: "terminale-svt-l2-brain-activity",
    chapterNumber: 2,
    themeNumber: 1,
    themeTitle: "Communication et régulation chez l’Homme",
    title: "L’activité cérébrale chez l’Homme",
    description: "Localiser les principales aires cérébrales et expliquer la motricité volontaire ainsi que les mécanismes de la mémoire.",
    centralQuestion: "Comment les aires cérébrales produisent-elles un mouvement volontaire et un souvenir ?",
    memorySentence: "Aires spécialisées → préparation, programmation, exécution du mouvement ; acquisition, consolidation, restitution du souvenir.",
    overviewBodyMarkdown: `
## Le cerveau ne travaille pas en blocs isolés

Le cerveau influence le comportement grâce à des **aires spécialisées**, mais une fonction complexe résulte toujours de la coopération de plusieurs réseaux. Voir, reconnaître, décider, parler, bouger et se souvenir mobilisent des régions différentes qui échangent des messages nerveux.

| Problème biologique | Idée essentielle |
|---|---|
| Où sont les principales aires ? | Les quatre lobes portent des aires sensorielles, motrices et associatives. |
| Comment naît un mouvement volontaire ? | Le mouvement est préparé, programmé, décidé, exécuté puis ajusté. |
| Comment se forme un souvenir ? | L’information est acquise, consolidée et stockée, puis restituée. |

### Manifestations de l’activité cérébrale

Le langage, la mémoire, l’affectivité, la vigilance, la sensibilité, le désir, la conscience et la motricité volontaire sont des manifestations de l’activité cérébrale citées par le cours.

> **Astuce mémoire - APM :** **A**ires, **P**rogramme moteur, **M**émoire. Ces trois mots donnent le plan de la leçon.

> **Précision importante :** une aire n’agit jamais « toute seule ». Le vocabulaire scolaire aide à localiser les fonctions dominantes, mais les comportements reposent sur des réseaux distribués.
`,
    overviewInteraction: {
      kind: "diagram",
      eyebrow: "Carte de la leçon",
      title: "De l’information au comportement",
      instruction: "Ouvre chaque carte pour découvrir sa place dans l’activité cérébrale.",
      rootLabel: "Activité cérébrale",
      rootDetail: "Le cerveau reçoit des informations, les interprète, prépare une réponse et peut en garder une trace.",
      nodes: [
        { id: "sensory-input", label: "1. Percevoir", role: "Entrées sensorielles", detail: "Les récepteurs et les voies afférentes transmettent au cerveau les informations externes et internes.", group: "Entrées" },
        { id: "association", label: "2. Interpréter", role: "Aires associatives", detail: "Elles relient les sensations aux connaissances, à l’espace, à l’affectivité et aux buts du sujet.", group: "Intégration" },
        { id: "motor-plan", label: "3. Préparer l’action", role: "Réseaux moteurs", detail: "Ils sélectionnent le geste, sa direction, sa force, sa durée et la posture nécessaire.", group: "Intégration" },
        { id: "execution", label: "4. Exécuter", role: "Voie motrice", detail: "Le cortex moteur commande la moelle épinière et les motoneurones qui activent les muscles.", group: "Sorties" },
        { id: "memory", label: "5. Mémoriser", role: "Hippocampe et cortex", detail: "L’expérience peut être encodée, consolidée puis réactivée lors du rappel.", group: "Apprentissage" },
      ],
      observation: "Le même stimulus peut alimenter une décision motrice et une mémoire : perception, action et apprentissage sont liés.",
    },
    overviewExtraQuestions: [
      choice("Quel moyen mnémotechnique résume le parcours ?", ["MCR : manifestation, cause, régulation", "APM : aires, programme moteur, mémoire", "ADN : audition, décision, neurone", "IRM : intention, réaction, muscle"], 1, "APM rappelle les trois blocs de cette leçon."),
      choice("Quelle proposition décrit correctement une fonction complexe ?", ["Elle dépend toujours d’une seule aire isolée", "Elle résulte de la coopération de plusieurs réseaux spécialisés", "Elle est commandée uniquement par les muscles", "Elle ne dépend jamais des informations sensorielles"], 1, "Les aires ont des spécialisations dominantes, mais elles coopèrent en réseaux."),
      trueFalse("La mémoire et la motricité volontaire sont deux manifestations de l’activité cérébrale.", true, "Elles figurent explicitement dans la liste donnée par le cours, avec le langage, la sensibilité et la conscience."),
      choice("Quel ordre résume le traitement d’une information qui conduit à un geste ?", ["Muscle → récepteur → cortex", "Percevoir → interpréter → préparer → exécuter", "Exécuter → décider → percevoir", "Mémoriser → digérer → respirer"], 1, "Le cerveau traite d’abord l’information avant de préparer et d’exécuter une réponse."),
    ],
    overviewSource: brainActivitySource(
      "1-3 et 8",
      "Problématique, manifestations de l’activité cérébrale et conclusion générale",
      [
        "La situation d’apprentissage introductive est retirée du niveau ; la situation d’évaluation officielle est conservée dans la mission finale.",
        "La localisation scolaire par aires est conservée, mais présentée comme une organisation en réseaux coopérants plutôt que comme des centres totalement isolés.",
      ],
    ),
    sections: [
      {
        id: "cerebral-areas",
        title: "Localiser les aires cérébrales",
        summary: "Associer lobes frontal, pariétal, temporal et occipital aux fonctions motrices, sensitives, auditives et visuelles.",
        conceptTitle: "Le cortex est organisé en aires spécialisées et associées",
        explanation: "En avant du sillon de Rolando, le lobe frontal contient l’aire motrice et des aires prémotrices. En arrière se trouvent les aires de la sensibilité. Le lobe occipital porte les aires visuelles ; le temporal, les aires auditives. Des aires d’association permettent de reconnaître et de donner du sens aux sensations.",
        keyPoint: "Aire primaire = reçoit ou commande ; aire d’association = interprète et coordonne l’information.",
        example: "Voir un visage mobilise l’aire visuelle ; le reconnaître nécessite aussi l’aire psycho-visuelle.",
        bodyMarkdown: `
## 1. Les quatre lobes du cortex cérébral

| Lobe | Aires dominantes citées dans le document | Fonctions principales |
|---|---|---|
| **Frontal** | aire motrice, aire motrice supplémentaire, aire prémotrice, aire préfrontale, articulation du langage | commander, préparer et coordonner les mouvements ; initier l’action ; produire le langage articulé |
| **Pariétal** | sensibilité générale et aire psycho-sensorielle | recevoir les sensations du corps et les intégrer dans une représentation de l’espace |
| **Temporal** | aire auditive et aire psycho-auditive | entendre et reconnaître/interpréter les sons ; participer à la compréhension du langage |
| **Occipital** | aire visuelle et aire psycho-visuelle | recevoir l’information visuelle puis reconnaître les objets, les formes et les mots écrits |

Le **sillon de Rolando**, aujourd’hui appelé **sillon central**, sépare approximativement l’aire motrice primaire, en avant, de l’aire somesthésique primaire, en arrière.

## 2. Aire primaire et aire associative

- Une aire **primaire** reçoit une information sensorielle élémentaire ou émet une commande motrice.
- Une aire **associative** met cette information en relation avec d’autres données : mémoire, langage, position du corps, signification de l’objet ou but de l’action.

Voir n’est donc pas encore reconnaître. Entendre un son n’est pas encore comprendre un mot.

## 3. Les fonctions sont distribuées

Le schéma officiel est une carte simplifiée utile pour débuter. Le langage, la reconnaissance d’un visage ou un geste précis font intervenir des réseaux qui dépassent les limites d’une seule « aire ». Par exemple, la production du langage mobilise surtout un réseau frontal gauche, mais aussi des régions temporales et pariétales reliées entre elles.

> **Erreur fréquente :** placer l’aire auditive dans le lobe frontal. Elle se situe principalement dans le lobe temporal.

> **Astuce mémoire - FAPO :** **F**rontal = **A**ction et parole ; **P**ariétal = position du corps ; **O**ccipital = œil. Le **Temporal** traite notamment les sons.
`,
        processTitle: "Du lobe à la fonction",
        processInstruction: "Explore les principales régions représentées dans le schéma du cours.",
        process: [
          { label: "Frontal", detail: "Aire motrice, cortex prémoteur, langage articulé et fonctions de préparation." },
          { label: "Pariétal", detail: "Sensibilité générale et intégration de la position du corps dans l’espace." },
          { label: "Temporal", detail: "Audition, compréhension des sons et mémoire avec les structures temporales internes." },
          { label: "Occipital", detail: "Vision primaire et reconnaissance visuelle grâce aux aires associatives." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Schéma interactif",
          title: "Les lobes et les principales aires cérébrales",
          instruction: "Sélectionne un repère pour localiser le lobe et relier sa position à ses fonctions.",
          viewBox: "0 0 640 390",
          caption: "Figure originale redessinée d’après le document officiel ; vue latérale simplifiée de l’hémisphère gauche.",
          shapes: [
            { shape: "path", d: "M95 220 C72 142 128 67 238 48 C362 26 492 73 536 168 C564 230 522 292 427 318 C363 337 311 326 269 315 C211 345 124 311 95 220 Z", tone: "soft" },
            { shape: "path", d: "M292 55 C270 112 276 178 289 247", tone: "outline" },
            { shape: "path", d: "M408 75 C430 135 424 207 397 277", tone: "outline" },
            { shape: "path", d: "M175 225 C254 205 334 220 400 280", tone: "outline" },
            { shape: "ellipse", cx: 421, cy: 308, rx: 78, ry: 38, rotate: -9, tone: "muted" },
            { shape: "text", x: 286, y: 28, content: "avant", anchor: "middle" },
            { shape: "text", x: 525, y: 47, content: "arrière", anchor: "middle" },
            { shape: "text", x: 304, y: 369, content: "Vue latérale - le sillon central sépare motricité et sensibilité", anchor: "middle" },
          ],
          hotspots: [
            { id: "frontal", number: 1, label: "Lobe frontal", detail: "En avant du sillon central : cortex moteur, prémoteur, préfrontal et réseau frontal de l’articulation du langage.", x: 175, y: 126, highlight: [{ shape: "path", d: "M95 220 C72 142 128 67 238 48 C264 44 281 48 292 55 C270 112 276 178 289 247 C244 220 194 215 175 225 C132 240 105 239 95 220 Z", tone: "accent" }] },
            { id: "parietal", number: 2, label: "Lobe pariétal", detail: "En arrière du sillon central et au-dessus du temporal : sensibilité générale et intégration spatiale.", x: 342, y: 105, highlight: [{ shape: "path", d: "M292 55 C332 41 379 46 408 75 C430 135 424 207 397 277 C357 244 325 239 289 247 C276 178 270 112 292 55 Z", tone: "accent" }] },
            { id: "occipital", number: 3, label: "Lobe occipital", detail: "À l’arrière : aire visuelle primaire et régions associatives nécessaires à la reconnaissance visuelle.", x: 489, y: 176, highlight: [{ shape: "path", d: "M408 75 C474 89 519 125 536 168 C557 216 527 267 465 297 C443 283 420 275 397 277 C424 207 430 135 408 75 Z", tone: "accent" }] },
            { id: "temporal", number: 4, label: "Lobe temporal", detail: "Sous les régions frontale et pariétale : audition, compréhension des sons et structures temporales internes liées à la mémoire.", x: 307, y: 279, highlight: [{ shape: "path", d: "M175 225 C254 205 334 220 400 280 C420 294 440 300 465 297 C429 324 374 333 310 324 C269 317 233 326 202 317 C176 299 164 258 175 225 Z", tone: "accent" }] },
            { id: "central-sulcus", number: 5, label: "Sillon central", detail: "Repère anatomique : motricité primaire en avant, sensibilité générale en arrière.", x: 287, y: 178, highlight: [{ shape: "path", d: "M292 55 C270 112 276 178 289 247", tone: "accent" }] },
            { id: "cerebellum", number: 6, label: "Cervelet", detail: "Il ne constitue pas un lobe cérébral ; il ajuste la coordination, la précision et l’équilibre du mouvement.", x: 424, y: 309, highlight: [{ shape: "ellipse", cx: 421, cy: 308, rx: 78, ry: 38, rotate: -9, tone: "accent" }] },
          ],
          observation: "Le sillon central est le repère le plus utile : il sépare les territoires corticaux moteurs et somesthésiques primaires.",
        },
        observation: "Une lésion peut conserver la sensation brute tout en supprimant sa reconnaissance, si l’aire associative est atteinte.",
        check: q("Dans quel lobe se trouve principalement l’aire visuelle ?", "Le lobe occipital", "Le lobe frontal", "Le lobe temporal", "Le cervelet"),
        extraQuestions: [
          trueFalse("Activité officielle - Le langage humain est contrôlé uniquement par les aires auditives.", false, "L’audition participe à la compréhension, mais le langage mobilise notamment des réseaux frontaux, temporaux et pariétaux.", "Activité d’application 1, affirmation 1 • page 3"),
          trueFalse("Activité officielle - Chaque aire cérébrale peut commander n’importe quelle fonction de l’organisme.", false, "Les aires possèdent des spécialisations dominantes et coopèrent dans des réseaux.", "Activité d’application 1, affirmation 2 • page 3"),
          trueFalse("Activité officielle - La mémoire est une manifestation de l’activité cérébrale.", true, "La mémoire dépend notamment de l’hippocampe, du cortex et de leurs réseaux.", "Activité d’application 1, affirmation 3 • page 3"),
          choice("Activité officielle - À quel lobe associe-t-on l’aire motrice et l’aire prémotrice ?", ["Lobe temporal", "Lobe frontal", "Lobe occipital", "Lobe pariétal"], 1, "Les territoires moteurs cités sont situés dans le lobe frontal.", "Autres exercices, activité 1 • page 10"),
          choice("Activité officielle - Quel lobe porte principalement l’aire visuelle ?", ["Lobe pariétal", "Lobe temporal", "Lobe frontal", "Lobe occipital"], 3, "L’aire visuelle primaire occupe le lobe occipital.", "Autres exercices, activité 1 • page 10"),
          choice("Activité officielle - Quel lobe reçoit principalement la sensibilité générale ?", ["Lobe pariétal", "Lobe frontal", "Lobe occipital", "Cervelet"], 0, "L’aire somesthésique primaire se situe dans le lobe pariétal, en arrière du sillon central.", "Autres exercices, activité 1 • page 10"),
          choice("Dans le tableau officiel, quelle association doit être corrigée ?", ["Occipital - aire visuelle", "Pariétal - sensibilité générale", "Temporal - articulation du langage parlé", "Frontal - aire motrice"], 2, "L’articulation du langage est principalement frontale ; le temporal est surtout associé à l’audition et à la compréhension. L’exercice source ne propose donc pas une correspondance temporelle correcte.", "Autres exercices, activité 1 • page 10"),
          trueFalse("Activité officielle - L’aire auditive est localisée dans le lobe frontal.", false, "Elle se situe principalement dans le lobe temporal.", "Autres exercices, activité 2, affirmation 1 • page 10"),
          trueFalse("Activité officielle - L’aire motrice est localisée dans le lobe temporal.", false, "Elle est située dans le lobe frontal, en avant du sillon central.", "Autres exercices, activité 2, affirmation 2 • page 10"),
          trueFalse("Activité officielle - L’aire prémotrice est localisée dans le lobe frontal.", true, "Le cortex prémoteur est frontal et participe à la préparation du mouvement.", "Autres exercices, activité 2, affirmation 3 • page 10"),
          trueFalse("Activité officielle - L’aire visuelle se trouve en arrière du sillon central.", true, "Elle est située dans le lobe occipital, donc nettement en arrière du sillon central.", "Autres exercices, activité 2, affirmation 4 • page 10"),
          trueFalse("Activité officielle - L’aire de la sensibilité générale se trouve en avant du sillon central.", false, "Elle est située dans le lobe pariétal, juste en arrière du sillon central.", "Autres exercices, activité 2, affirmation 5 • page 10"),
        ],
        distractors: ["Toutes les fonctions cérébrales occupent une seule aire.", "L’aire psycho-visuelle commande directement les muscles.", "Le lobe temporal est le centre principal de la vision."],
        source: brainActivitySource(
          "1-3 et 9-10",
          "Lobes, principales aires cérébrales et activités d’application",
          [
            "Le sillon de Rolando est présenté avec son nom moderne, sillon central.",
            "Le corrigé de l’activité 1 associe le lobe temporal à l’aire du langage parlé, alors que le même cours place l’articulation et la psychomotricité dans le lobe frontal ; l’incohérence est signalée et corrigée.",
            "La liste des aires de sensibilité de la situation d’évaluation répète deux fois l’aire psycho-visuelle ; le doublon n’est pas reproduit.",
            "Les localisations classiques sont conservées comme repères scolaires tout en précisant que langage et reconnaissance reposent sur des réseaux distribués.",
          ],
        ),
      },
      {
        id: "movement-preparation",
        title: "Préparer et programmer le mouvement",
        summary: "Relier intention, informations sensorielles, posture et programme moteur avant l’action.",
        conceptTitle: "Un mouvement volontaire est planifié avant d’être exécuté",
        explanation: "Le cerveau utilise les stimuli internes et externes pour définir le but. L’aire motrice supplémentaire organise les actes complexes, le cortex prémoteur prépare la posture et le cortex pariétal postérieur situe l’objet dans l’espace. Les noyaux sous-corticaux et le cervelet participent à la coordination.",
        keyPoint: "Préparer = choisir le but ; programmer = préciser direction, distance, force et posture.",
        example: "Pour saisir un verre, le cerveau évalue sa position et sa distance, prépare l’épaule et la main, puis dose la force des doigts.",
        bodyMarkdown: `
## 1. Un geste volontaire commence avant la contraction

Saisir un objet est volontaire parce que le mouvement succède à une **intention**. Avant que la main ne bouge, plusieurs régions analysent la situation et construisent un programme moteur. Le cours distingue deux étapes préparatoires.

### Phase préparatoire

Le sujet localise l’objet grâce aux informations sensorielles, le plus souvent visuelles :

1. l’aire visuelle primaire reçoit l’information ;
2. les régions visuelles associatives l’interprètent ;
3. les aires d’association relient la position de l’objet au but du sujet ;
4. des régions sous-corticales, le système limbique et le cervelet contribuent à l’état motivationnel, à l’expérience acquise et à la coordination.

Un **potentiel de préparation** peut être enregistré avant le début du mouvement. Le document indique environ **0,8 seconde** avant le geste : l’activité cérébrale précède donc l’action visible.

### Phase de programmation

Le système nerveux central précise les paramètres du geste :

| Paramètre | Question résolue par le cerveau |
|---|---|
| latéralisation | quel bras ou quelle main utiliser ? |
| distance | jusqu’où étendre le membre ? |
| direction | quelle trajectoire suivre ? |
| force | quelle intensité appliquer à l’objet ? |
| posture | comment stabiliser le corps pendant l’action ? |

- L’**aire motrice supplémentaire** organise notamment les séquences complexes et souvent bilatérales.
- Le **cortex prémoteur** prépare la posture et les gestes guidés par les informations sensorielles.
- Le **cortex pariétal postérieur** traite la représentation de l’espace et la relation corps-objet.
- Les **noyaux gris centraux** participent à la sélection et à l’initiation du programme ; le **cervelet** contribue à sa coordination et à son ajustement.

> **Astuce mémoire - LDFP :** **L**atéralisation, **D**istance, **F**orce, **P**osture. Ajoute la direction entre distance et force lorsque tu rédiges.

> **Précision :** l’hypothalamus renseigne et régule surtout l’état interne et les comportements motivés ; ce n’est pas le centre qui dessine à lui seul le programme précis de la main.
`,
        processTitle: "Avant le mouvement",
        processInstruction: "Observe les décisions successives qui transforment une intention en programme moteur.",
        process: [
          { label: "Intention", detail: "Le sujet fixe un but à partir de ses besoins et des informations du milieu." },
          { label: "Repérage", detail: "Les aires sensitives et pariétales évaluent position, direction et distance." },
          { label: "Programme", detail: "Les aires supplémentaire et prémotrice préparent posture, force et succession des gestes." },
        ],
        interaction: {
          kind: "diagram",
          eyebrow: "Préparation interactive",
          title: "Qui prépare quoi avant le mouvement ?",
          instruction: "Sélectionne chaque structure pour distinguer information, intention et programme.",
          rootLabel: "Intention de saisir",
          rootDetail: "Le but du sujet est transformé en un programme moteur adapté à l’objet et au corps.",
          nodes: [
            { id: "visual", label: "Cortex visuel", role: "Localiser l’objet", detail: "Il reçoit puis analyse les caractéristiques visuelles avant que les aires associatives ne donnent sens et position à l’objet.", group: "Informations" },
            { id: "parietal", label: "Pariétal postérieur", role: "Corps dans l’espace", detail: "Il combine vision et informations corporelles afin d’estimer direction, distance et orientation.", group: "Informations" },
            { id: "limbic", label: "Système limbique", role: "Valeur et expérience", detail: "Il met la situation en relation avec l’affectivité, la motivation et certains apprentissages.", group: "But" },
            { id: "supplementary", label: "Aire motrice supplémentaire", role: "Séquence complexe", detail: "Elle participe à l’organisation interne des actes successifs ou bilatéraux.", group: "Programme" },
            { id: "premotor", label: "Cortex prémoteur", role: "Posture guidée", detail: "Il prépare les gestes orientés par les informations sensorielles et ajuste la posture de départ.", group: "Programme" },
            { id: "basal-cerebellum", label: "Noyaux gris et cervelet", role: "Sélection et coordination", detail: "Les noyaux gris participent au choix du programme ; le cervelet anticipe et ajuste sa coordination.", group: "Programme" },
          ],
          observation: "La préparation répond à « pourquoi et où agir ? » ; la programmation répond à « avec quel geste précis ? ».",
        },
        observation: "La programmation explique pourquoi un geste volontaire adapté n’est pas un simple réflexe.",
        check: q("Quelle aire participe à la préparation posturale du mouvement ?", "Le cortex prémoteur", "L’aire auditive", "La rétine", "L’hypophyse"),
        extraQuestions: [
          choice("Quel événement montre que le cerveau travaille avant le geste visible ?", ["La digestion après le repas", "Le potentiel de préparation enregistré environ 0,8 s avant le mouvement", "La contraction après le mouvement", "La disparition des sensations"], 1, "Le potentiel de préparation précède le début de l’action observée.", "Potentiel de préparation • page 4"),
          choice("Lors de la phase préparatoire, quelle information sert généralement à localiser l’objet ?", ["L’information visuelle", "Le taux de calcium osseux", "La digestion intestinale", "La filtration rénale"], 0, "Le document prend l’exemple d’une localisation d’abord visuelle.", "Phase préparatoire • page 4"),
          choice("Quel ordre décrit le traitement visuel cité dans le cours ?", ["Cortex secondaire → rétine → muscle", "Cortex visuel primaire → cortex visuel secondaire → aires d’association", "Muscle → aire auditive → cortex visuel", "Cervelet → œil → hypothalamus"], 1, "L’information est d’abord projetée, puis analysée et intégrée.", "Phase préparatoire • page 4"),
          choice("Quel groupe contient uniquement des paramètres programmés avant de saisir l’objet ?", ["Latéralisation, distance, direction, force", "Digestion, filtration, croissance, température", "Vision, audition, goût, odorat", "Mémoire, sommeil, faim, soif"], 0, "Le document énumère le bras, la distance, la direction et la force.", "Phase de programmation • page 5"),
          choice("Quelle structure établit surtout les programmes d’actes moteurs complexes ou bilatéraux ?", ["L’aire motrice supplémentaire", "La rétine", "L’aire auditive primaire", "La moelle osseuse"], 0, "C’est le rôle attribué à l’aire motrice supplémentaire dans le document.", "Phase de programmation • page 5"),
          choice("Quelle structure traite la représentation sensorielle de l’espace ?", ["Le cortex pariétal postérieur", "La corticosurrénale", "Le bulbe olfactif seul", "La thyroïde"], 0, "Le cortex pariétal postérieur met en relation le corps et la position de la cible.", "Phase de programmation • page 5"),
          choice("Activité officielle - À quoi correspond la phase de préparation ?", ["À la contraction finale du muscle", "À la localisation de l’objet dans l’espace à partir d’informations sensorielles", "À la mémorisation d’un visage", "À la sécrétion d’une hormone"], 1, "La préparation transforme les informations sensorielles en situation d’action.", "Autres exercices, activité 3 • pages 10-11"),
          choice("Situation officielle AVC - Quelle région peut être active pendant la seule représentation mentale du mouvement ?", ["L’aire psychomotrice", "L’aire gustative", "L’aire visuelle primaire uniquement", "La moelle épinière seule"], 0, "Le document montre une activité prémotrice même sans exécution musculaire.", "Situation d’évaluation 1 • pages 11-12"),
        ],
        distractors: ["La programmation vient après l’exécution.", "Un mouvement volontaire n’utilise aucune information sensorielle.", "Le cortex pariétal ne traite jamais la représentation de l’espace."],
        source: brainActivitySource(
          "3-5 et 10-12",
          "Phases préparatoire et de programmation, activité de correspondance et imagerie fonctionnelle",
          [
            "La virgule décimale française est rétablie dans « 0,8 s ».",
            "Le rôle de l’hypothalamus est précisé : il contribue à l’état interne et aux comportements motivés, sans être présenté comme le centre unique de programmation du geste.",
            "L’activité mesurée lors de la représentation mentale soutient la préparation corticale ; elle ne prouve pas à elle seule l’intégrité de tout l’organisme.",
          ],
        ),
      },
      {
        id: "movement-execution",
        title: "Exécuter et coordonner le mouvement",
        summary: "Suivre le message du cortex moteur à la moelle épinière puis aux muscles effecteurs.",
        conceptTitle: "Le message moteur descend vers les effecteurs",
        explanation: "Après la décision, le cortex moteur émet un message qui descend par les voies motrices vers la moelle épinière, puis les nerfs moteurs l’acheminent aux muscles. Le cervelet compare le mouvement prévu au mouvement réalisé et contribue à sa précision.",
        keyPoint: "Cortex moteur → voies descendantes → moelle épinière → nerfs moteurs → muscles, avec coordination cérébelleuse.",
        example: "Lors d’une prise d’objet, la contraction coordonnée du bras, de l’avant-bras et des doigts réalise le programme préparé.",
        bodyMarkdown: `
## 1. La décision devient une commande motrice

Après la préparation et la programmation, les centres corticaux sélectionnent la réponse à exécuter. Le **cortex moteur** produit alors des messages nerveux qui empruntent les voies descendantes.

### Trajet principal de la commande

**Cortex moteur → voies motrices descendantes → moelle épinière → motoneurones → nerfs moteurs → muscles effecteurs.**

Les motoneurones sont les neurones qui commandent directement les fibres musculaires. Selon les muscles concernés, leurs axones passent par des nerfs rachidiens ou des nerfs crâniens.

## 2. Le mouvement est continuellement ajusté

Un geste précis ne consiste pas à envoyer une commande unique puis à « laisser faire » le muscle.

- Les récepteurs sensoriels informent le système nerveux sur la position des segments du corps et sur le contact avec l’objet.
- Le **cervelet** compare le mouvement prévu au mouvement réellement en cours et contribue aux corrections rapides.
- Les **noyaux gris centraux** participent à l’initiation et à la sélection des programmes moteurs.
- Les muscles agonistes et antagonistes doivent être activés ou relâchés de manière coordonnée.

## 3. Distinguer volontaire et réflexe

Un réflexe peut emprunter un circuit médullaire court. Un mouvement volontaire met en jeu une intention, une préparation corticale, un programme et une commande descendante. Les deux systèmes peuvent cependant coopérer : les ajustements posturaux automatiques stabilisent le geste volontaire.

> **Astuce mémoire - CMM :** **C**ortex moteur, **M**oelle épinière, **M**uscle. Le cervelet contrôle la précision autour de cette chaîne.

> **Erreur fréquente :** dire que le cervelet « décide » le mouvement. Il participe surtout à la coordination, à la comparaison et à la correction.
`,
        processTitle: "Le trajet de la commande motrice",
        processInstruction: "Suis le message nerveux depuis le centre de décision jusqu’au geste.",
        process: [
          { label: "Décision", detail: "Les centres corticaux valident le programme moteur adapté au but." },
          { label: "Commande", detail: "Le cortex moteur génère les messages nerveux de la voie motrice." },
          { label: "Transmission", detail: "La moelle épinière relaie la commande vers les motoneurones." },
          { label: "Contraction", detail: "Les muscles effecteurs se contractent de façon coordonnée et produisent le mouvement." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Trajet interactif",
          title: "De la commande corticale au muscle",
          instruction: "Sélectionne chaque repère pour suivre la commande et sa boucle de correction.",
          viewBox: "0 0 700 390",
          caption: "Figure originale redessinée d’après les schémas de trajet et de synthèse du document officiel.",
          shapes: [
            { shape: "ellipse", cx: 150, cy: 96, rx: 92, ry: 58, rotate: -8, tone: "soft" },
            { shape: "circle", cx: 324, cy: 102, r: 50, tone: "muted" },
            { shape: "path", d: "M459 47 C438 91 444 162 458 215 C468 257 461 300 446 338", tone: "outline" },
            { shape: "path", d: "M530 295 C567 258 620 267 647 304 C617 333 565 341 526 316 Z", tone: "soft" },
            { shape: "line", x1: 232, y1: 96, x2: 274, y2: 101, tone: "accent" },
            { shape: "line", x1: 374, y1: 108, x2: 447, y2: 145, tone: "accent" },
            { shape: "line", x1: 454, y1: 214, x2: 545, y2: 293, tone: "accent" },
            { shape: "path", d: "M535 320 C450 370 325 330 274 144", tone: "muted" },
            { shape: "text", x: 150, y: 100, content: "Cortex moteur", anchor: "middle" },
            { shape: "text", x: 324, y: 106, content: "Cervelet", anchor: "middle" },
            { shape: "text", x: 475, y: 196, content: "Moelle", anchor: "start" },
            { shape: "text", x: 587, y: 307, content: "Muscle", anchor: "middle" },
            { shape: "text", x: 340, y: 374, content: "retour sensoriel et ajustement", anchor: "middle" },
          ],
          hotspots: [
            { id: "motor-cortex", number: 1, label: "Cortex moteur", detail: "Il transforme le programme retenu en commandes nerveuses descendantes.", x: 150, y: 72, highlight: [{ shape: "ellipse", cx: 150, cy: 96, rx: 92, ry: 58, rotate: -8, tone: "accent" }] },
            { id: "cerebellum", number: 2, label: "Cervelet", detail: "Il contribue à comparer le mouvement prévu avec les informations du mouvement réel et à corriger les écarts.", x: 324, y: 79, highlight: [{ shape: "circle", cx: 324, cy: 102, r: 50, tone: "accent" }] },
            { id: "spinal-cord", number: 3, label: "Moelle épinière", detail: "Elle relaie la commande descendante vers les motoneurones et reçoit aussi des informations sensorielles.", x: 455, y: 168, highlight: [{ shape: "path", d: "M459 47 C438 91 444 162 458 215 C468 257 461 300 446 338", tone: "accent" }] },
            { id: "motor-neuron", number: 4, label: "Motoneurone", detail: "Son axone quitte le système nerveux central par un nerf moteur et atteint les fibres musculaires.", x: 510, y: 247, highlight: [{ shape: "line", x1: 454, y1: 214, x2: 545, y2: 293, tone: "accent" }] },
            { id: "muscle", number: 5, label: "Muscle effecteur", detail: "La contraction coordonnée des unités motrices produit la pression, la trajectoire et la force programmées.", x: 587, y: 285, highlight: [{ shape: "path", d: "M530 295 C567 258 620 267 647 304 C617 333 565 341 526 316 Z", tone: "accent" }] },
            { id: "feedback", number: 6, label: "Retour sensoriel", detail: "La position du membre et le contact avec l’objet sont renvoyés aux centres nerveux pour ajuster le geste.", x: 334, y: 335, highlight: [{ shape: "path", d: "M535 320 C450 370 325 330 274 144", tone: "accent" }] },
          ],
          observation: "La commande descendante et le retour sensoriel forment une boucle : c’est cette boucle qui rend le geste précis et adaptable.",
        },
        observation: "Une atteinte de l’aire motrice ou de la voie descendante peut empêcher le geste malgré des muscles intacts.",
        check: q("Quelle structure relaie la commande vers les nerfs moteurs ?", "La moelle épinière", "La thyroïde", "Le cristallin", "Le pancréas"),
        extraQuestions: [
          choice("Quels neurones commandent directement la contraction des muscles ?", ["Les photorécepteurs", "Les motoneurones", "Les cellules hépatiques", "Les ostéocytes"], 1, "Les motoneurones établissent la sortie finale vers les fibres musculaires.", "Texte sur la saisie d’un objet • page 3"),
          choice("Quel trajet correspond à la phase d’exécution ?", ["Cortex moteur → moelle épinière → nerf moteur → muscle", "Muscle → rétine → cortex auditif", "Hypophyse → sang → os", "Oreille → cervelet → peau"], 0, "Le message cortical descend jusqu’aux motoneurones et aux effecteurs.", "Phase d’exécution • page 5"),
          choice("Activité officielle - Quelle description correspond à la phase d’exécution ?", ["Localiser l’objet grâce à la vision", "Déplacer le message du cortex moteur jusqu’à l’effecteur", "Consolider un souvenir", "Choisir le bras sans agir"], 1, "L’exécution est la transmission effective de la commande aux muscles.", "Autres exercices, activité 3 • pages 10-11"),
          trueFalse("Activité officielle - La programmation est la dernière phase de la motricité volontaire.", false, "L’exécution vient après la programmation.", "Activité d’application, affirmation a • page 8"),
          choice("Pourquoi le cervelet est-il indispensable à un geste précis ?", ["Il sécrète l’hormone de croissance", "Il participe à la coordination et à la correction des écarts", "Il remplace tous les muscles", "Il reçoit uniquement des sons"], 1, "Le cervelet ajuste la précision du geste grâce aux informations prévues et sensorielles."),
          choice("Que peut provoquer une lésion de la voie motrice descendante ?", ["Une difficulté à exécuter le mouvement malgré des muscles capables de se contracter", "Une augmentation automatique de la mémoire", "Une meilleure audition", "Une disparition des récepteurs visuels"], 0, "Le problème peut se situer dans la commande centrale ou son trajet, et non dans le muscle lui-même."),
        ],
        distractors: ["Le cortex moteur reçoit sa commande des muscles après le geste.", "Le cervelet sécrète les hormones de stress.", "La décision motrice est prise dans le nerf du bras."],
        source: brainActivitySource(
          "3-5 et 8-11",
          "Phase d’exécution, trajet de l’influx, schéma de synthèse et activités d’application",
          [
            "Le trajet source est conservé sous une forme lisible : commande descendante et retour sensoriel sont distingués.",
            "Le cervelet est présenté comme coordinateur et correcteur, non comme centre unique de décision.",
            "La formulation « message adressé au niveau médullaire » est explicitée en voies descendantes, motoneurones et nerfs moteurs.",
          ],
        ),
      },
      {
        id: "memory",
        title: "Construire et restituer un souvenir",
        summary: "Distinguer mémoires explicite et implicite, court et long terme, puis les phases du mécanisme mnésique.",
        conceptTitle: "La mémoire possède plusieurs formes et plusieurs étapes",
        explanation: "La mémoire explicite porte sur les souvenirs conscients ; la mémoire implicite permet notamment des habiletés. La mémoire à court terme conserve brièvement une information, tandis que la mémoire à long terme la stabilise. L’hippocampe intervient fortement dans la formation de nouveaux souvenirs explicites et le cortex dans leur stockage distribué.",
        keyPoint: "Acquisition → consolidation et stockage → restitution ; l’hippocampe est essentiel à la formation de nouveaux souvenirs explicites.",
        example: "Le patient H. M. améliorait une tâche motrice sans se rappeler l’avoir déjà réalisée : mémoire implicite préservée, mémoire explicite altérée.",
        bodyMarkdown: `
## 1. Le cas H. M. sépare plusieurs systèmes de mémoire

Le patient **H. M.**, connu aujourd’hui sous le nom de Henry Molaison, a subi une ablation bilatérale d’une partie des régions temporales internes comprenant l’hippocampe afin de traiter une épilepsie sévère.

Après l’intervention :

- ses capacités intellectuelles générales et sa mémoire immédiate restaient relativement préservées ;
- il conservait des souvenirs anciens, mais avait perdu une partie des souvenirs proches de l’opération ;
- il ne pouvait presque plus former de nouveaux souvenirs conscients durables : c’est une **amnésie antérograde** majeure ;
- il progressait pourtant dans une tâche motrice au miroir sans se souvenir de l’avoir déjà pratiquée.

Cette dissociation montre que la mémoire n’est pas unique.

| Classification | Définition | Exemple |
|---|---|---|
| mémoire **explicite** ou déclarative | souvenirs et connaissances accessibles consciemment | raconter un événement, reconnaître une personne |
| mémoire **implicite** | apprentissages exprimés par la performance sans rappel conscient nécessaire | améliorer un geste appris |
| mémoire **à court terme / de travail** | maintien bref et manipulation d’une petite quantité d’informations | garder le début d’une phrase pour comprendre sa fin |
| mémoire **à long terme** | conservation durable des connaissances, événements et habiletés | se souvenir d’un cours ou savoir faire du vélo |

## 2. Les trois grandes phases du mécanisme mnésique

### Acquisition ou encodage

L’information sensorielle est transformée en activité de réseaux neuronaux. L’attention et la répétition favorisent son maintien temporaire. Le document évoque des **circuits réverbérants**, c’est-à-dire une activité qui se maintient brièvement dans un réseau.

### Consolidation et stockage

Une partie de l’information est stabilisée par la **plasticité synaptique** : certaines connexions entre neurones sont durablement renforcées ou réorganisées. La synthèse de protéines participe à la consolidation de nombreux souvenirs. L’hippocampe est essentiel à la formation et à l’organisation initiale de nouveaux souvenirs explicites, tandis que leur représentation à long terme est distribuée dans le cortex.

### Restitution ou remémoration

Un indice - une odeur, une mélodie, une question - peut réactiver le réseau associé. Restituer n’est pas lire une copie intacte : le souvenir est reconstruit à partir de traces distribuées.

> **Correction scientifique :** un souvenir n’est pas stocké dans une seule « protéine spécifique », et sa restitution ne dépend pas de la décomposition de cette protéine. Les protéines participent à la plasticité ; le rappel correspond surtout à la réactivation coordonnée de réseaux neuronaux.

> **Astuce mémoire - ACR :** **A**cquisition, **C**onsolidation, **R**estitution.

La diminution ou la perte de mémoire est une **amnésie**. Elle peut toucher certaines périodes ou certaines formes de mémoire sans supprimer toutes les capacités d’apprentissage.
`,
        processTitle: "Les phases du mécanisme mnésique",
        processInstruction: "Suis le devenir d’une information depuis son entrée jusqu’au rappel.",
        process: [
          { label: "Acquisition", detail: "L’information sensorielle est encodée dans des réseaux neuronaux." },
          { label: "Consolidation", detail: "Des modifications durables stabilisent une partie de l’information." },
          { label: "Stockage", detail: "Le souvenir est maintenu dans des réseaux distribués, notamment corticaux." },
          { label: "Restitution", detail: "Un indice réactive le réseau et permet la remémoration." },
        ],
        interaction: {
          kind: "schema",
          eyebrow: "Réseau interactif",
          title: "Hippocampe, cortex et devenir d’un souvenir",
          instruction: "Sélectionne chaque repère pour suivre une information de l’encodage au rappel.",
          viewBox: "0 0 690 390",
          caption: "Figure originale redessinée d’après le cas H. M. et les phases du mécanisme mnésique.",
          shapes: [
            { shape: "ellipse", cx: 128, cy: 190, rx: 75, ry: 115, tone: "soft" },
            { shape: "path", d: "M259 71 C337 34 447 49 506 111 C550 159 548 236 500 283 C448 333 348 337 275 299 C225 272 205 210 221 153 C228 120 239 93 259 71 Z", tone: "soft" },
            { shape: "path", d: "M336 194 C343 158 382 137 414 153 C448 169 447 213 418 232 C389 252 347 231 336 194 Z", tone: "muted" },
            { shape: "line", x1: 203, y1: 190, x2: 334, y2: 190, tone: "accent" },
            { shape: "line", x1: 419, y1: 154, x2: 557, y2: 99, tone: "muted" },
            { shape: "line", x1: 418, y1: 232, x2: 573, y2: 283, tone: "muted" },
            { shape: "path", d: "M568 280 C612 232 618 145 565 102", tone: "accent" },
            { shape: "text", x: 128, y: 184, content: "Information", anchor: "middle" },
            { shape: "text", x: 128, y: 207, content: "sensorielle", anchor: "middle" },
            { shape: "text", x: 377, y: 199, content: "Hippocampe", anchor: "middle" },
            { shape: "text", x: 468, y: 68, content: "Réseaux corticaux", anchor: "middle" },
            { shape: "text", x: 607, y: 194, content: "Rappel", anchor: "middle" },
          ],
          hotspots: [
            { id: "encoding", number: 1, label: "Acquisition", detail: "Attention et traitement sensoriel encodent l’information dans une activité neuronale temporaire.", x: 129, y: 121, highlight: [{ shape: "ellipse", cx: 128, cy: 190, rx: 75, ry: 115, tone: "accent" }] },
            { id: "hippocampus", number: 2, label: "Hippocampe", detail: "Il est essentiel à la formation de nouveaux souvenirs explicites et à leur organisation initiale.", x: 378, y: 170, highlight: [{ shape: "path", d: "M336 194 C343 158 382 137 414 153 C448 169 447 213 418 232 C389 252 347 231 336 194 Z", tone: "accent" }] },
            { id: "cortex", number: 3, label: "Cortex distribué", detail: "Des composantes visuelles, auditives, verbales et émotionnelles du souvenir sont représentées dans plusieurs réseaux corticaux.", x: 470, y: 104, highlight: [{ shape: "path", d: "M259 71 C337 34 447 49 506 111 C550 159 548 236 500 283 C448 333 348 337 275 299 C225 272 205 210 221 153 C228 120 239 93 259 71 Z", tone: "accent" }] },
            { id: "consolidation", number: 4, label: "Consolidation", detail: "La plasticité synaptique stabilise progressivement certaines traces ; sommeil, répétition et récupération espacée peuvent la favoriser.", x: 506, y: 260, highlight: [{ shape: "line", x1: 418, y1: 232, x2: 573, y2: 283, tone: "accent" }] },
            { id: "retrieval", number: 5, label: "Restitution", detail: "Un indice réactive un ensemble de réseaux ; le souvenir conscient est reconstruit à partir de ces traces.", x: 605, y: 166, highlight: [{ shape: "path", d: "M568 280 C612 232 618 145 565 102", tone: "accent" }] },
          ],
          observation: "Le cas H. M. montre surtout que l’hippocampe est crucial pour former de nouveaux souvenirs explicites, pas qu’il contient à lui seul tous les souvenirs.",
        },
        observation: "Une lésion de l’hippocampe peut empêcher de créer de nouveaux souvenirs conscients tout en laissant des apprentissages moteurs possibles.",
        check: q("Quelle phase permet de stabiliser une information en mémoire à long terme ?", "La consolidation", "La digestion", "La fécondation", "La transpiration"),
        extraQuestions: [
          choice("Quelle capacité de H. M. restait observable malgré l’oubli conscient de la tâche au miroir ?", ["L’amélioration progressive d’une habileté motrice", "La formation normale de nouveaux souvenirs autobiographiques", "La reconnaissance de tous les soignants", "La récupération complète des années précédant l’opération"], 0, "Sa performance motrice s’améliorait : la mémoire implicite était relativement préservée.", "Observations cliniques sur H. M. • page 6"),
          choice("Quelle mémoire était principalement et durablement altérée chez H. M. ?", ["La mémoire explicite de nouveaux événements", "Toutes les réponses réflexes", "La mémoire génétique", "La sensibilité de la peau"], 0, "Il ne pouvait plus former normalement de nouveaux souvenirs conscients durables.", "Observations cliniques sur H. M. • page 6"),
          choice("Quel rôle attribue-t-on à l’hippocampe ?", ["Commander directement tous les muscles", "Participer fortement à la formation de nouveaux souvenirs explicites", "Produire les sons entendus", "Stocker seul et définitivement tous les souvenirs"], 1, "L’hippocampe organise la formation initiale ; les représentations à long terme sont distribuées.", "Hippocampe et mémoire • pages 6-7"),
          choice("Quelle phase transforme une trace fragile en trace plus durable ?", ["La consolidation", "La sudation", "La programmation motrice", "La digestion"], 0, "La consolidation repose notamment sur la plasticité synaptique.", "Consolidation et stockage • page 7"),
          trueFalse("Activité officielle - La restitution est la dernière grande phase du mécanisme mnésique.", true, "Après acquisition et consolidation-stockage, un indice peut permettre la restitution.", "Activité d’application, affirmation b • page 8"),
          trueFalse("Activité officielle - Mnésie et amnésie ont la même signification.", false, "La mnésie désigne la mémoire ; l’amnésie en est une diminution ou une perte.", "Activité d’application, affirmation c • page 8"),
          trueFalse("Le cours établit clairement une mémoire à moyen terme comme troisième catégorie entre court et long terme.", false, "Le texte développe seulement court et long terme ; le corrigé officiel qui valide « moyen terme » est incohérent avec son propre cours et avec la classification simplifiée retenue ici.", "Activité d’application, affirmation d • page 8"),
          choice("Situation officielle - Quel phénomène permet de garder en tête une chanson que l’on vient d’entendre ?", ["L’acquisition et le maintien temporaire de l’information dans des réseaux actifs", "La destruction de l’hippocampe", "La phase d’exécution motrice", "La disparition de toute activité neuronale"], 0, "L’information auditive est encodée et peut persister temporairement dans l’activité de réseaux neuronaux.", "Situation d’évaluation 2, consigne 3 • page 12"),
          choice("Quelle formulation moderne décrit le mieux la restitution d’un souvenir ?", ["Décomposer une protéine unique contenant tout le souvenir", "Réactiver de façon coordonnée les réseaux neuronaux associés à la trace", "Faire circuler le souvenir dans le sang", "Créer un nouvel hippocampe"], 1, "Le rappel correspond à la réactivation d’un réseau distribué ; aucune protéine unique ne contient le souvenir."),
          choice("Quelle définition de l’amnésie correspond au document ?", ["L’augmentation permanente de tous les souvenirs", "La diminution ou la perte de mémoire", "La préparation d’un mouvement", "La capacité d’entendre un son"], 1, "L’amnésie peut être partielle et toucher certaines périodes ou certains systèmes de mémoire.", "Définition • page 7"),
        ],
        distractors: ["Il n’existe qu’une seule forme de mémoire.", "L’hippocampe commande directement la contraction des muscles.", "La restitution précède toujours l’acquisition."],
        source: brainActivitySource(
          "6-8 et 12",
          "Cas H. M., formes de mémoire, acquisition, consolidation, restitution et situation d’évaluation 2",
          [
            "Le patient H. M. est nommé Henry Molaison et l’atteinte est précisée comme une amnésie antérograde majeure avec dissociation explicite/implicite.",
            "L’affirmation « court, moyen et long terme », déclarée vraie par le corrigé alors que le cours ne définit pas le moyen terme, est signalée comme incohérente et n’est pas retenue.",
            "Le modèle de restitution par décomposition d’une protéine spécifique est remplacé par la réactivation de réseaux ; la synthèse protéique reste reliée à la plasticité et à la consolidation.",
            "Les trois phases sont clarifiées en acquisition, consolidation-stockage et restitution.",
          ],
        ),
      },
    ],
    mission: {
      title: "Diagnostiquer les troubles après une commotion cérébrale",
      scenario: "Au cours d’un match de football interclasses, un élève reçoit un choc violent à la tête et perd connaissance. Après sa réanimation, il voit des éclairs lumineux, ne reconnaît plus les membres de sa famille et n’arrive pas à articuler un mot qu’il entend, bien que les muscles de sa langue ne soient pas paralysés. Utilise la carte cérébrale pour relier chaque signe à une fonction perturbée.",
      problem: "Comment relier chaque trouble observé à la fonction d’une aire cérébrale ?",
      bodyMarkdown: `
## Document clinique simplifié

| Observation | Fonction à examiner | Réseau principalement concerné |
|---|---|---|
| éclairs lumineux | traitement visuel élémentaire | voies visuelles et cortex visuel occipital |
| voit ses proches mais ne les reconnaît pas | reconnaissance visuelle des visages | régions visuelles associatives occipito-temporales |
| entend le mot mais ne peut pas l’articuler ; langue non paralysée | programmation et production motrice de la parole | réseau frontal du langage et régions prémotrices |

Le fait que les muscles soient intacts oriente vers une atteinte de la **commande centrale** plutôt que vers une lésion musculaire. Il faut cependant rester prudent : un symptôme clinique ne permet pas, à lui seul, de localiser exactement une lésion. L’imagerie et l’examen médical sont indispensables.

### Méthode attendue

1. **Identifier** les aires motrices et sensorielles sur le schéma.
2. **Nommer** les fonctions correspondant aux symptômes.
3. **Expliquer** chaque trouble avec une phrase « fonction perturbée → conséquence observée ».
4. **Conclure** sur la spécialisation et la coopération des réseaux cérébraux.

> **Correction du document :** les éclairs lumineux ne doivent pas être attribués automatiquement à la seule aire psycho-visuelle. Ils évoquent d’abord une perturbation des voies ou du cortex visuels ; la non-reconnaissance, elle, concerne les régions visuelles associatives.
`,
      investigation: [
        { label: "Voir des éclairs", detail: "Rechercher une perturbation des voies visuelles ou du cortex visuel du lobe occipital." },
        { label: "Ne pas reconnaître", detail: "Distinguer perception visuelle préservée et reconnaissance par le réseau visuel associatif." },
        { label: "Ne pas articuler", detail: "Relier le trouble au réseau frontal de programmation du langage plutôt qu’aux muscles eux-mêmes." },
        { label: "Conclure", detail: "Montrer la spécialisation et la coopération des aires cérébrales." },
      ],
      interaction: {
        kind: "diagram",
        eyebrow: "Raisonnement clinique",
        title: "Du symptôme à l’hypothèse fonctionnelle",
        instruction: "Ouvre chaque symptôme et vérifie la fonction qu’il permet d’interroger.",
        rootLabel: "Commotion cérébrale",
        rootDetail: "Les symptômes suggèrent plusieurs fonctions perturbées ; ils ne remplacent jamais le diagnostic médical.",
        nodes: [
          { id: "flashes", label: "Éclairs lumineux", role: "Perception visuelle", detail: "Ils orientent vers les voies visuelles ou le cortex visuel primaire ; une origine rétinienne ou autre doit aussi être recherchée cliniquement.", group: "Vision" },
          { id: "faces", label: "Visages non reconnus", role: "Association visuelle", detail: "La personne voit mais n’identifie plus les proches : les régions occipito-temporales associatives sont à examiner.", group: "Vision" },
          { id: "speech", label: "Mot non articulé", role: "Production du langage", detail: "L’audition et les muscles sont préservés ; le réseau frontal de programmation de la parole peut être perturbé.", group: "Langage" },
          { id: "intact-muscles", label: "Langue non paralysée", role: "Indice de localisation", detail: "Cet indice distingue la capacité musculaire de la commande corticale nécessaire à l’articulation.", group: "Langage" },
          { id: "network", label: "Conclusion", role: "Réseaux spécialisés", detail: "Perception, reconnaissance et articulation reposent sur des réseaux différents mais connectés.", group: "Synthèse" },
        ],
        observation: "Une explication correcte relie un symptôme à une fonction perturbée sans transformer cette relation en diagnostic certain.",
      },
      modelAnswer: "Les éclairs signalent une perturbation du traitement visuel ; la vision sans reconnaissance oriente vers les régions visuelles associatives ; l’impossibilité d’articuler malgré des muscles et une audition fonctionnels oriente vers le réseau frontal moteur du langage. Ces troubles montrent que perception, reconnaissance et production de la parole mobilisent des réseaux spécialisés qui coopèrent.",
      questions: [
        choice("Situation officielle - Quelle aire fonctionnelle associer à l’impossibilité de reconnaître des visages pourtant vus ?", ["L’aire gustative", "Le réseau visuel associatif ou psycho-visuel", "La moelle épinière", "L’hypophyse"], 1, "La perception élémentaire peut être présente alors que la reconnaissance visuelle est perturbée.", "Situation d’évaluation, consignes 2-3 • pages 9-10"),
        choice("Situation officielle - Pourquoi des muscles de la langue intacts n’excluent-ils pas un trouble de la parole ?", ["La commande et la programmation corticales du langage peuvent être atteintes", "Les muscles parlent sans commande nerveuse", "Le langage dépend seulement de l’oreille", "La mémoire remplace l’aire motrice"], 0, "L’articulation exige une programmation centrale en plus de muscles fonctionnels.", "Situation d’évaluation, consignes 2-3 • pages 9-10"),
        choice("Quelle conclusion générale est justifiée ?", ["Chaque fonction dépend d’un seul muscle", "Toutes les aires ont exactement la même fonction", "Des réseaux spécialisés coopèrent pour produire perception, reconnaissance et action", "Le cortex ne participe pas au comportement"], 2, "La spécialisation n’empêche pas la coopération entre régions cérébrales.", "Situation d’évaluation, consigne 3 • pages 9-10"),
      ],
      extraQuestions: [
        choice("Situation officielle - Parmi ces structures, lesquelles sont motrices ?", ["Aire visuelle et aire psycho-visuelle", "Aire auditive et aire psycho-auditive", "Aire motrice, commande de la langue et articulation du langage", "Lobe occipital et rétine uniquement"], 2, "Le document oppose ici les territoires moteurs aux territoires sensoriels.", "Situation d’évaluation, consigne 1 • page 9"),
        choice("À quelle fonction faut-il d’abord relier la perception d’éclairs lumineux ?", ["Au traitement visuel primaire et aux voies visuelles", "À la mémoire implicite uniquement", "À la digestion", "À l’aire motrice de la jambe"], 0, "Les éclairs sont un phénomène visuel ; la reconnaissance des visages constitue un second trouble distinct."),
        choice("Situation officielle AVC - Que montre l’activation de l’aire psychomotrice pendant une représentation mentale du geste ?", ["La préparation motrice peut exister sans contraction visible", "Le muscle décide seul du mouvement", "Le cortex ne travaille qu’après le geste", "Toute activité cérébrale est visuelle"], 0, "Imaginer le geste recrute une partie du réseau de préparation.", "Situation d’évaluation 1 • pages 11-12"),
        choice("Quelle conclusion peut-on raisonnablement tirer de l’activation des aires motrices pendant les tâches testées ?", ["Tout l’état de santé physique est nécessairement parfait", "Les réseaux moteurs étudiés sont recrutés pendant ces tâches, sans conclure sur tout l’organisme", "L’AVC n’a jamais existé", "Le cervelet est inutile"], 1, "Une imagerie fonctionnelle renseigne sur les tâches observées ; elle ne suffit pas à déclarer toute la santé physique intacte.", "Situation d’évaluation 1, consigne 3 • page 12"),
        choice("Quelle différence sépare perception et reconnaissance ?", ["Percevoir reçoit les caractéristiques ; reconnaître leur attribue une identité ou un sens", "Reconnaître précède toujours tout signal sensoriel", "Les deux mots sont strictement synonymes", "La reconnaissance dépend uniquement du muscle"], 0, "Les aires primaires et associatives permettent de distinguer ces deux étapes."),
        trueFalse("Cette mission permet à elle seule de poser un diagnostic médical exact après un traumatisme crânien.", false, "Les relations fonctionnelles guident l’analyse pédagogique ; seul un examen clinique et paraclinique peut établir un diagnostic."),
      ],
      source: brainActivitySource(
        "9-12",
        "Situation d’évaluation de la commotion, exercices complémentaires et situation AVC",
        [
          "La répétition de l’aire psycho-visuelle dans la liste des aires sensorielles est supprimée.",
          "Les éclairs lumineux sont reliés d’abord aux voies ou au cortex visuels, tandis que la non-reconnaissance est reliée aux régions associatives ; le corrigé source attribuait les deux signes à la seule aire psycho-visuelle.",
          "Le réseau d’articulation est décrit comme frontal et distribué plutôt que comme un point isolé.",
          "La conclusion « l’état de santé physique n’est pas affecté » est restreinte : l’activation indique seulement le recrutement des réseaux moteurs testés.",
        ],
      ),
    },
  };

export const terminalASvtBrainActivityPath = createSvtPath(course);
