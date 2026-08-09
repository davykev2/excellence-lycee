import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 08 de Physique (Terminales C et D) — commune aux deux séries.
const sourceDocument = "TleD_PHY_L8_Loi de Laplace.pdf";

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
      introduction: "Applique cette démarche au cours et aux exercices du document officiel.",
      steps: seed.methodSteps,
      example: { prompt: "Exemple guidé", work: seed.example, result: seed.keyPoint },
      tip: "Astuce Davy : commence toujours par orienter le courant et le champ, déduis le sens de la force, puis calcule seulement après avoir converti toutes les longueurs en mètres.",
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
    id: "laplace-force-experiments",
    title: "Mettre en évidence la force de Laplace",
    summary: "Observer l'action d'un champ magnétique sur un conducteur parcouru par un courant et identifier les paramètres qui en fixent le sens.",
    pages: "1-2",
    section: "I. Mise en évidence expérimentale — tige et rails de Laplace",
    durationMinutes: 15,
    xp: 45,
    body: String.raw`## L'expérience de la tige de Laplace

Une portion de conducteur est placée dans l'entrefer d'un aimant en U. Lorsque le circuit est **fermé**, un courant d'intensité $I$ traverse la tige et celle-ci dévie. Cette déviation montre qu'une action mécanique s'exerce sur la portion de fil située dans le champ magnétique $\vec B$.

Les observations du document permettent d'isoler les conditions de l'effet :

| Modification expérimentale | Observation |
|---|---|
| circuit fermé et champ présent | la tige dévie |
| circuit ouvert | la tige reprend sa position initiale |
| aimant retiré | la tige reprend sa position initiale |
| sens du courant inversé | la déviation s'inverse |
| sens du champ inversé | la déviation s'inverse |

La force n'est donc produite ni par le courant seul, ni par l'aimant seul : elle naît de **l'interaction entre le courant et le champ magnétique**.

## L'expérience des rails de Laplace

Une barre conductrice mobile repose sur deux rails reliés à un générateur. Sa portion comprise dans l'entrefer est parcourue par un courant et baigne dans un champ uniforme. À la fermeture du circuit, la barre se déplace le long des rails.

- inverser $I$ inverse le déplacement ;
- inverser $\vec B$ inverse aussi le déplacement ;
- augmenter $I$ rend le mouvement plus marqué, car l'intensité de la force augmente ;
- inverser **à la fois** $I$ et $\vec B$ conserve le sens de la force.

Cette action mécanique est appelée **force électromagnétique de Laplace**. Elle s'exerce uniquement sur la portion active du conducteur : celle qui est à la fois parcourue par le courant et plongée dans le champ.

> **Astuce mémoire.** Il faut les deux acteurs : **un courant + un champ**. Si l'un manque, la force de Laplace disparaît.

> **À ne pas confondre.** Le déplacement observé n'indique pas directement le sens du champ. Il faut connaître le sens du courant et utiliser ensuite la règle d'orientation de la force.` ,
    keyPoint: "Un conducteur parcouru par un courant et placé dans un champ magnétique subit une force de Laplace ; inverser I ou B inverse F, inverser les deux conserve F.",
    example: "La barre part vers la droite. Si l'on inverse seulement les bornes du générateur, le courant change de sens et la barre part vers la gauche.",
    methodSteps: [
      "Vérifie que le circuit est fermé et que la portion étudiée se trouve dans le champ.",
      "Repère le sens du courant conventionnel dans la portion active.",
      "Repère le sens du champ entre les pôles de l'aimant.",
      "Compare l'état initial et l'état après inversion de I ou de B.",
      "Conclus sur l'existence et le sens de la force de Laplace.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Expérience interactive",
      title: "Les rails de Laplace",
      instruction: "Sélectionne les repères pour comprendre pourquoi la barre mobile se met en mouvement.",
      observation: "Le courant traverse la barre dans le champ. Leur interaction produit une force parallèle aux rails.",
      caption: "Schéma original redessiné d'après l'expérience des rails du document officiel.",
      viewBox: "0 0 420 240",
      shapes: [
        { shape: "line", x1: 65, y1: 72, x2: 355, y2: 72, tone: "outline" },
        { shape: "line", x1: 65, y1: 168, x2: 355, y2: 168, tone: "outline" },
        { shape: "line", x1: 210, y1: 72, x2: 210, y2: 168, tone: "accent" },
        { shape: "path", d: "M210 93 L202 108 L218 108 Z", tone: "accent" },
        { shape: "text", x: 225, y: 126, content: "I", anchor: "start" },
        { shape: "path", d: "M128 97 C118 97 118 113 128 113 C138 113 138 97 128 97 M123 100 L133 110 M133 100 L123 110", tone: "soft" },
        { shape: "path", d: "M285 97 C275 97 275 113 285 113 C295 113 295 97 285 97 M280 100 L290 110 M290 100 L280 110", tone: "soft" },
        { shape: "path", d: "M128 133 C118 133 118 149 128 149 C138 149 138 133 128 133 M123 136 L133 146 M133 136 L123 146", tone: "soft" },
        { shape: "path", d: "M285 133 C275 133 275 149 285 149 C295 149 295 133 285 133 M280 136 L290 146 M290 136 L280 146", tone: "soft" },
        { shape: "text", x: 315, y: 126, content: "B entrant", anchor: "middle" },
        { shape: "line", x1: 210, y1: 48, x2: 294, y2: 48, tone: "accent" },
        { shape: "path", d: "M294 48 L278 40 L278 56 Z", tone: "fill" },
        { shape: "text", x: 250, y: 36, content: "F", anchor: "middle" },
        { shape: "line", x1: 65, y1: 72, x2: 42, y2: 96, tone: "muted" },
        { shape: "line", x1: 65, y1: 168, x2: 42, y2: 144, tone: "muted" },
        { shape: "text", x: 38, y: 124, content: "G", anchor: "middle" },
      ],
      hotspots: [
        { id: "active-bar", number: 1, label: "Barre active", detail: "La portion verticale est parcourue par le courant et plongée dans le champ : c'est sur elle que s'exerce la force résultante.", x: 210, y: 120 },
        { id: "field", number: 2, label: "Champ entrant", detail: "Les croix représentent un vecteur dirigé vers l'arrière du plan, comme la queue d'une flèche.", x: 285, y: 141 },
        { id: "force", number: 3, label: "Force de Laplace", detail: "Ici, elle est parallèle aux rails et entraîne la barre vers la droite.", x: 340, y: 48 },
        { id: "generator", number: 4, label: "Circuit fermé", detail: "Le générateur impose le courant. Circuit ouvert, I = 0 et la force disparaît.", x: 48, y: 120 },
      ],
    },
    questions: [
      choice("Dans quelle situation la tige de Laplace dévie-t-elle ?", ["Circuit fermé et champ magnétique présent", "Circuit ouvert sans champ", "Aimant retiré et circuit ouvert", "Conducteur non parcouru par un courant"], 0, "La force exige simultanément un courant et un champ.", "I.1 Tige de Laplace", 1),
      choice("Que se passe-t-il si l'on ouvre le circuit ?", ["La tige reprend sa position initiale", "La force double", "Le champ change automatiquement de sens", "La tige fond"], 0, "Circuit ouvert, I = 0 et la force de Laplace disparaît.", "I.1 Observations", 1),
      choice("Inverser uniquement le sens du courant…", ["inverse le sens de la force", "ne change rien", "annule toujours le champ", "double la longueur active"], 0, "Changer le signe de I change le signe du produit vectoriel.", "I.1 Observations", 1),
      choice("Inverser uniquement le champ magnétique…", ["inverse le sens de la force", "annule le courant", "ne change jamais le mouvement", "double la masse"], 0, "Changer le sens de B inverse F.", "I.2 Rails de Laplace", 1),
      choice("Si l'on inverse simultanément I et B, le sens de F…", ["reste inchangé", "s'inverse", "devient toujours vertical", "est indéterminé"], 0, "Les deux changements de signe se compensent : (−I)ℓ∧(−B) donne la même force.", "I. Conclusion", 2),
      choice("Sur les rails, augmenter l'intensité I rend l'effet mécanique…", ["plus marqué", "toujours nul", "indépendant du courant", "opposé sans autre modification"], 0, "L'intensité de la force est proportionnelle à I.", "I.2 Observations", 1),
      choice("La portion active est celle qui est…", ["parcourue par I et située dans B", "hors du champ et sans courant", "uniquement reliée au support", "toujours circulaire"], 0, "Les deux conditions sont nécessaires.", "I. Conclusion", 1),
    ],
  },
  {
    id: "cotton-balance-measurement",
    title: "Mesurer un champ avec la balance de Cotton",
    summary: "Appliquer le théorème des moments pour relier la force de Laplace, une masse connue et la valeur du champ magnétique.",
    pages: "4 et 7",
    section: "III.1 Balance de Cotton et exercice 2",
    durationMinutes: 20,
    xp: 75,
    body: String.raw`## Principe du dispositif

La balance de Cotton transforme la force de Laplace en une **mesure de champ magnétique**. Un fléau pivote autour d'un axe passant par $O$. Une partie conductrice $CDE$ est placée dans l'entrefer d'un aimant, tandis qu'une masse $m$ est suspendue à l'autre bras.

La portion rectiligne $CD$, de longueur $\ell$, est perpendiculaire au champ. Elle subit donc une force de valeur :

$$\boxed{F=I\ell B}$$

Les portions $AC$ et $DE$ sont des arcs de cercle centrés sur $O$. Les forces élémentaires qui s'y exercent possèdent des droites d'action passant par l'axe de rotation. Leur bras de levier est nul : leur **moment en $O$ est nul**.

## Équilibre des moments

Notons $d$ le bras de levier de la force de Laplace et $d'$ celui du poids $P=mg$. À l'équilibre, les deux moments ont des sens opposés et des valeurs égales :

$$F\,d=mg\,d'$$

En remplaçant $F$ par $I\ell B$ :

$$I\ell B\,d=mg\,d'$$

On isole le champ :

$$\boxed{B=\frac{mg\,d'}{I\ell\,d}}$$

Lorsque les deux bras de levier sont égaux, $d'=d$, la relation se simplifie :

$$\boxed{B=\frac{mg}{I\ell}}$$

## Exercice 2 du document

On donne $\ell=3$ cm, $I=8$ A, $B=0{,}50$ T et l'on prend $g=10$ N·kg$^{-1}$. Les bras étant égaux :

$$m=\frac{I\ell B}{g}$$

$$m=\frac{8\times0{,}03\times0{,}50}{10}=0{,}012\ \text{kg}=\boxed{12\ \text{g}}$$

## Pourquoi cette méthode est fiable

Le champ n'est pas lu directement : on l'obtient par comparaison avec le poids d'une masse connue. Pour éviter une erreur, il faut toutefois identifier les bons bras de levier et ne jamais confondre la longueur active $\ell$ avec la distance $d$ au pivot.

> **Astuce mémoire.** **Force × bras = force × bras**. Écris d'abord l'équilibre des moments, puis remplace seulement $F$ par $I\ell B$.

> **Erreur fréquente.** Une force peut être non nulle et avoir pourtant un moment nul si sa droite d'action passe par l'axe de rotation.` ,
    keyPoint: "À l'équilibre de la balance, IℓBd = mgd′, donc B = mgd′/(Iℓd) et, si d = d′, B = mg/(Iℓ).",
    example: "Avec I = 8 A, ℓ = 0,03 m, B = 0,50 T et g = 10 N·kg⁻¹, la masse d'équilibre est 0,012 kg, soit 12 g.",
    methodSteps: [
      "Fais le bilan des forces qui peuvent faire tourner le fléau.",
      "Élimine du calcul les forces dont la droite d'action passe par O.",
      "Écris l'équilibre algébrique des moments autour de O.",
      "Remplace F par IℓB et isole la grandeur demandée.",
      "Convertis ℓ en mètres et m en kilogrammes avant l'application numérique.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Lire une balance de Cotton",
      instruction: "Sélectionne les repères pour distinguer portion active, axe et bras de levier.",
      observation: "La portion CD crée le moment magnétique ; le poids suspendu fournit le moment opposé qui permet de mesurer B.",
      caption: "Schéma original simplifié et redessiné d'après la balance de Cotton de la page 4.",
      viewBox: "0 0 440 250",
      shapes: [
        { shape: "circle", cx: 225, cy: 124, r: 10, tone: "outline" },
        { shape: "text", x: 225, y: 106, content: "O", anchor: "middle" },
        { shape: "line", x1: 225, y1: 124, x2: 382, y2: 124, tone: "outline" },
        { shape: "line", x1: 382, y1: 124, x2: 382, y2: 191, tone: "muted" },
        { shape: "path", d: "M364 191 L400 191 L382 220 Z", tone: "soft" },
        { shape: "text", x: 382, y: 208, content: "m", anchor: "middle" },
        { shape: "path", d: "M225 124 C183 124 163 96 151 75", tone: "outline" },
        { shape: "line", x1: 151, y1: 75, x2: 93, y2: 75, tone: "accent" },
        { shape: "path", d: "M93 75 C81 96 61 124 25 124", tone: "outline" },
        { shape: "path", d: "M80 44 L164 44 L164 102 L80 102 Z", tone: "muted" },
        { shape: "text", x: 91, y: 67, content: "N", anchor: "middle" },
        { shape: "text", x: 153, y: 67, content: "S", anchor: "middle" },
        { shape: "line", x1: 93, y1: 75, x2: 151, y2: 75, tone: "accent" },
        { shape: "text", x: 122, y: 67, content: "CD", anchor: "middle" },
        { shape: "line", x1: 122, y1: 77, x2: 122, y2: 132, tone: "accent" },
        { shape: "path", d: "M122 132 L113 115 L131 115 Z", tone: "fill" },
        { shape: "text", x: 140, y: 126, content: "F", anchor: "start" },
        { shape: "line", x1: 382, y1: 191, x2: 382, y2: 232, tone: "accent" },
        { shape: "path", d: "M382 232 L373 215 L391 215 Z", tone: "fill" },
        { shape: "text", x: 399, y: 231, content: "P", anchor: "start" },
        { shape: "line", x1: 122, y1: 153, x2: 225, y2: 153, tone: "soft" },
        { shape: "text", x: 173, y: 171, content: "d", anchor: "middle" },
        { shape: "line", x1: 225, y1: 153, x2: 382, y2: 153, tone: "soft" },
        { shape: "text", x: 304, y: 171, content: "d′", anchor: "middle" },
      ],
      hotspots: [
        { id: "active", number: 1, label: "Portion CD", detail: "CD est rectiligne, de longueur ℓ, et perpendiculaire au champ : elle subit F = IℓB.", x: 122, y: 75 },
        { id: "arcs", number: 2, label: "Arcs centrés en O", detail: "Les droites d'action des forces sur les arcs passent par O ; leurs moments autour de O sont nuls.", x: 180, y: 101 },
        { id: "pivot", number: 3, label: "Axe O", detail: "On calcule tous les moments autour de cet axe afin d'éliminer la réaction du support.", x: 225, y: 124 },
        { id: "mass", number: 4, label: "Masse étalon", detail: "Son poids mg crée le moment opposé au moment de la force de Laplace.", x: 382, y: 198 },
      ],
    },
    questions: [
      choice("Pourquoi les forces sur les arcs AC et DE n'influencent-elles pas l'équilibre ?", ["Leurs droites d'action passent par O", "Elles sont toujours nulles", "Le courant n'y circule jamais", "Leur masse est nulle"], 0, "Leur bras de levier par rapport à O est nul.", "III.1 Balance de Cotton", 2),
      choice("Quelle relation traduit l'équilibre général ?", ["IℓBd = mgd′", "IℓB = mg dans tous les cas", "Iℓd = Bmg", "B = I+ℓ+m"], 0, "Les moments opposés ont même valeur.", "III.1 Théorème des moments", 2),
      choice("Si d = d′, le champ vaut…", ["B = mg/(Iℓ)", "B = Iℓ/(mg)", "B = mgIℓ", "B = g/(mIℓ)"], 0, "Les bras se simplifient dans IℓBd = mgd′.", "III.1 Cas particulier", 2),
      short("Exercice 2 : convertis ℓ = 3 cm en mètres.", ["0,03", "0.03", "0,03 m", "0.03 m"], "3 cm = 0,03 m.", "Exercice 2", 1),
      short("Exercice 2 : calcule la force IℓB en newtons.", ["0,12", "0.12", "0,12 N", "0.12 N"], "F = 8×0,03×0,50 = 0,12 N.", "Exercice 2", 2),
      short("Exercice 2 : donne la masse en kilogrammes.", ["0,012", "0.012", "0,012 kg", "0.012 kg"], "m = F/g = 0,12/10 = 0,012 kg.", "Exercice 2", 2),
      short("Exercice 2 : donne cette masse en grammes.", ["12", "12 g", "12g"], "0,012 kg = 12 g.", "Exercice 2", 1),
      choice("Quelle grandeur ne doit pas être confondue avec ℓ ?", ["Le bras de levier d", "L'intensité I", "Le champ B", "L'unité N"], 0, "ℓ est la longueur active ; d est une distance perpendiculaire à l'axe pour le moment.", "III.1 Méthode", 1),
    ],
  },
  {
    id: "laplace-force-applications",
    title: "Comprendre les applications de la force",
    summary: "Relier la force de Laplace à la roue de Barlow, au haut-parleur et aux effets utiles des courants de Foucault.",
    pages: "5 et 11-13",
    section: "III.2-3 Applications et IV. Documentation — courants de Foucault",
    durationMinutes: 18,
    xp: 80,
    body: String.raw`## La roue de Barlow

Une roue conductrice plonge par son bord dans un liquide conducteur et ferme ainsi un circuit électrique. La portion de roue traversée par le courant et placée dans le champ magnétique subit une force de Laplace. Comme cette force ne passe pas par l'axe, elle possède un moment et met la roue en rotation.

Inverser le courant ou le champ inverse le sens de rotation. La roue de Barlow constitue donc un modèle simple de **moteur électrique** : une énergie électrique est transformée en énergie mécanique.

## Le haut-parleur électrodynamique

Une bobine solidaire d'une membrane est placée dans le champ d'un aimant permanent. Le courant audio change continuellement d'intensité et de sens. La force de Laplace qui agit sur la bobine change donc elle aussi :

$$\vec F(t)=I(t)\,\vec\ell\wedge\vec B$$

La bobine entraîne la membrane, qui met l'air en vibration. Ces vibrations deviennent une onde sonore. La chaîne énergétique et fonctionnelle est :

$$\text{signal électrique}\longrightarrow\text{force variable}\longrightarrow\text{vibration}\longrightarrow\text{son}$$

## Les courants de Foucault

Lorsqu'un conducteur massif se déplace dans un champ magnétique, ou lorsque le flux magnétique qui le traverse varie, des courants induits apparaissent dans sa masse. Ils sont appelés **courants de Foucault**.

Ils produisent deux effets essentiels :

1. selon la loi de Lenz, leur champ s'oppose à la variation qui leur a donné naissance ;
2. ils échauffent le conducteur par effet Joule.

Le document présente plusieurs applications :

- **freinage sans contact** de trains, poids lourds et autocars ;
- **chauffage par induction** des matériaux conducteurs ;
- brasage et fours à induction ;
- anciens compteurs électriques et tachymètres ;
- capteurs de proximité ;
- contrôle non destructif de pièces métalliques.

Un frein à courants de Foucault est efficace lorsque le disque tourne, mais son action diminue avec la vitesse. Il ne peut donc pas immobiliser seul un véhicule jusqu'à l'arrêt complet et complète les freins conventionnels.

> **Astuce mémoire.** Laplace fait **bouger** le conducteur ; Foucault peut **freiner** ou **chauffer** le conducteur.

> **Point de vigilance.** Le chauffage par induction concerne une pièce conductrice : les courants doivent pouvoir circuler dans la matière.` ,
    keyPoint: "La force de Laplace transforme un courant en mouvement dans la roue de Barlow et le haut-parleur ; les courants de Foucault s'opposent aux variations et produisent aussi un échauffement Joule.",
    example: "Dans un haut-parleur, l'inversion rapide du courant inverse la force sur la bobine ; la membrane avance et recule au rythme du signal.",
    methodSteps: [
      "Repère la portion conductrice où circulent simultanément courant et champ.",
      "Détermine le sens de la force et vérifie si sa droite d'action passe par l'axe.",
      "Relie la force ou son moment au mouvement observé.",
      "Pour les courants de Foucault, identifie la variation de flux ou le déplacement relatif.",
      "Classe l'effet recherché : mouvement, freinage, chauffage ou détection.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Applications",
      title: "Une même physique, plusieurs machines",
      instruction: "Sélectionne une application pour suivre la transformation provoquée par les forces électromagnétiques.",
      observation: "Le point commun est l'action mécanique ou thermique créée lorsqu'un conducteur et un champ magnétique interagissent.",
      rootLabel: "Courant + champ magnétique",
      rootDetail: "L'interaction peut produire directement une force de Laplace ou induire des courants de Foucault dans un conducteur massif.",
      nodes: [
        { id: "barlow", label: "Roue de Barlow", role: "Rotation", detail: "La force appliquée hors de l'axe possède un moment et entretient la rotation de la roue conductrice." },
        { id: "speaker", label: "Haut-parleur", role: "Vibration", detail: "Le courant audio variable impose une force variable à la bobine et fait vibrer la membrane." },
        { id: "brake", label: "Frein électromagnétique", role: "Opposition au mouvement", detail: "Les courants de Foucault créent des forces qui s'opposent au déplacement, sans contact mécanique." },
        { id: "heating", label: "Plaque à induction", role: "Chauffage", detail: "Les courants induits dissipent de l'énergie par effet Joule dans le récipient conducteur." },
        { id: "testing", label: "Contrôle non destructif", role: "Détection", detail: "Une fissure modifie la circulation des courants induits et donc le signal magnétique mesuré." },
      ],
    },
    questions: [
      choice("Pourquoi la roue de Barlow tourne-t-elle ?", ["La force de Laplace possède un moment autour de l'axe", "Son poids disparaît", "Le champ annule le courant", "Le liquide bout toujours"], 0, "La droite d'action de la force ne passe pas par l'axe.", "III.2 Roue de Barlow", 2),
      choice("Dans un haut-parleur, la force variable agit d'abord sur…", ["la bobine solidaire de la membrane", "l'air sans intermédiaire", "le générateur uniquement", "le pôle Nord qui se déplace"], 0, "La bobine reçoit la force puis entraîne la membrane.", "III.3 Haut-parleur", 1),
      choice("Si le courant audio change de sens, la force sur la bobine…", ["change de sens", "reste toujours identique", "devient une masse", "annule le champ permanent"], 0, "F est proportionnelle à I et son sens dépend du sens du courant.", "III.3 Haut-parleur", 1),
      choice("Les courants de Foucault apparaissent notamment lorsqu'un conducteur…", ["subit une variation de flux magnétique", "reste isolant sans champ", "est uniquement refroidi", "ne contient aucune charge mobile"], 0, "Une variation de flux ou un déplacement dans le champ les induit.", "IV. Documentation", 1),
      choice("Selon la loi de Lenz, leur effet magnétique…", ["s'oppose à la variation qui les crée", "amplifie toujours la variation", "supprime l'effet Joule", "est sans direction"], 0, "C'est le sens d'opposition décrit par Lenz.", "IV. Documentation", 2),
      choice("Quel effet explique le chauffage par induction ?", ["L'effet Joule", "La poussée d'Archimède", "La réfraction", "La gravitation"], 0, "Les courants induits dissipent de l'énergie thermique.", "IV. Chauffage", 1),
      choice("Un frein à courants de Foucault peut-il assurer seul l'arrêt complet ?", ["Non, son action diminue avec la vitesse", "Oui, même sans mouvement", "Oui, sans conducteur", "Non, car il accélère toujours"], 0, "Le document précise qu'il complète les freins conventionnels.", "IV. Freinage", 2),
      choice("Le contrôle non destructif exploite le fait qu'une fissure…", ["modifie les courants induits", "augmente toujours la masse", "supprime tout champ terrestre", "rend le métal transparent"], 0, "Le défaut change la circulation des courants et le champ secondaire mesuré.", "IV. Autres applications", 1),
    ],
  },
  {
    id: "laplace-vector-law-characteristics",
    title: "Écrire la loi vectorielle de Laplace",
    summary: "Identifier le vecteur longueur actif, le point d'application, la direction, le sens et la valeur de la force de Laplace.",
    pages: "2-3",
    section: "II. Loi de Laplace — expression et caractéristiques",
    durationMinutes: 17,
    xp: 55,
    body: String.raw`## La relation vectorielle

Pour un conducteur rectiligne de longueur active $\ell$, parcouru par un courant continu d'intensité $I$ et placé dans un champ magnétique uniforme $\vec B$, la force résultante est :

$$\boxed{\vec F=I\,\vec\ell\wedge\vec B}$$

Le vecteur $\vec\ell$ possède trois informations précises :

- sa direction est celle du conducteur ;
- son sens est celui du **courant conventionnel** ;
- sa norme est la longueur $\ell$ de la portion effectivement soumise au champ.

Le symbole $\wedge$ désigne le **produit vectoriel**. Il explique pourquoi la force n'est généralement dirigée ni comme le fil, ni comme le champ.

## Les caractéristiques de $\vec F$

| Caractéristique | Lecture correcte |
|---|---|
| point d'application | milieu de la portion active si le champ est uniforme |
| direction | perpendiculaire au plan formé par $\vec\ell$ et $\vec B$ |
| sens | celui qui rend le trièdre $(\vec\ell,\vec B,\vec F)$ direct |
| valeur | $F=I\ell B\lvert\sin\alpha\rvert$ |
| unité | le newton, symbole N |

Ici $\alpha$ est l'angle entre $\vec\ell$ et $\vec B$. Dans le cas très fréquent où le conducteur est perpendiculaire au champ, $\alpha=90^\circ$ et :

$$\boxed{F=I\ell B}$$

## Ce que la formule permet de vérifier

- si $I=0$, alors $F=0$ ;
- si $B=0$, alors $F=0$ ;
- si $\ell=0$ dans la zone de champ, alors $F=0$ ;
- si le fil est parallèle au champ, $\sin0^\circ=0$ et $F=0$ ;
- si le fil est perpendiculaire au champ, la force est maximale pour $I$, $\ell$ et $B$ fixés.

> **Astuce mémoire.** Dans $I\vec\ell\wedge\vec B$, lis toujours dans l'ordre : **courant, champ, force**. Ne remplace pas $\ell$ par la longueur totale du fil si une seule partie se trouve dans l'entrefer.` ,
    keyPoint: "La loi est F⃗ = I ℓ⃗ ∧ B⃗ ; ℓ⃗ suit le courant et la force est perpendiculaire au plan (ℓ⃗, B⃗).",
    example: "Un fil actif de 0,20 m porte 5 A dans B = 0,050 T, perpendiculairement au champ : F = 5×0,20×0,050 = 0,050 N.",
    methodSteps: [
      "Isole la portion réellement située dans le champ et mesure sa longueur ℓ.",
      "Oriente le vecteur ℓ dans le sens du courant conventionnel.",
      "Place le vecteur B puis forme mentalement le plan (ℓ, B).",
      "Trace F perpendiculairement à ce plan avec le sens du produit vectoriel.",
      "Calcule F avec la formule générale ou sa forme perpendiculaire.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Décomposer la loi",
      title: "Les cinq informations de la force",
      instruction: "Sélectionne un élément pour relier le dessin, la formule et la grandeur physique.",
      observation: "Une réponse complète ne donne pas seulement F : elle précise aussi point d'application, direction et sens.",
      rootLabel: "Force de Laplace",
      rootDetail: "Résultante de l'action d'un champ magnétique uniforme sur une portion rectiligne parcourue par un courant.",
      nodes: [
        { id: "current", label: "Intensité I", role: "Facteur électrique", detail: "I s'exprime en ampères. Doubler I double la valeur de la force si les autres données restent fixes." },
        { id: "length", label: "Vecteur ℓ", role: "Portion active", detail: "Il suit le conducteur dans le sens du courant et sa norme est la longueur plongée dans le champ, en mètres." },
        { id: "field", label: "Champ B", role: "Facteur magnétique", detail: "B s'exprime en teslas. Son orientation intervient dans le produit vectoriel et sa norme dans le calcul." },
        { id: "direction", label: "Direction", role: "Perpendiculaire", detail: "F est perpendiculaire au plan défini par ℓ et B." },
        { id: "point", label: "Point d'application", role: "Milieu actif", detail: "Dans un champ uniforme, la résultante est placée au milieu de la portion du conducteur soumise au champ." },
      ],
    },
    questions: [
      choice("Quelle est l'expression vectorielle de la loi de Laplace ?", ["F⃗ = I ℓ⃗ ∧ B⃗", "F⃗ = I + ℓ⃗ + B⃗", "F⃗ = B⃗/I", "F⃗ = m g⃗"], 0, "La force est donnée par le produit vectoriel Iℓ⃗∧B⃗.", "II.1 Expression", 2),
      choice("Le vecteur ℓ⃗ est orienté…", ["dans le sens du courant", "à l'opposé du courant", "toujours vers le haut", "comme le poids"], 0, "C'est la convention utilisée dans la relation vectorielle.", "II.1 Expression", 1),
      choice("La norme de ℓ⃗ représente…", ["la longueur active dans le champ", "la longueur de tout le circuit", "la masse du fil", "la distance à l'aimant uniquement"], 0, "Seule la portion soumise au champ intervient.", "II.1 Expression", 1),
      choice("Dans un champ uniforme, la résultante est appliquée…", ["au milieu de la portion active", "à la borne positive du générateur", "au pôle Nord", "au support uniquement"], 0, "Le document place la résultante au milieu de la portion soumise au champ.", "II.2 Caractéristiques", 1),
      choice("La direction de F⃗ est…", ["perpendiculaire au plan (ℓ⃗, B⃗)", "toujours parallèle à B⃗", "toujours parallèle au fil", "celle du poids"], 0, "C'est une propriété du produit vectoriel.", "II.2 Direction", 2),
      choice("L'unité de la valeur F est…", ["le newton", "le tesla", "l'ampère", "le mètre"], 0, "F est une force, donc s'exprime en newtons.", "II.2 Valeur", 1),
      choice("Si le conducteur est parallèle à B⃗, la force vaut…", ["0 N", "IℓB", "mg", "B/I"], 0, "α = 0° donc sin α = 0.", "II.2 Valeur", 2),
      choice("Si le conducteur est perpendiculaire à B⃗, on utilise…", ["F = IℓB", "F = Iℓ/B", "F = IB/ℓ", "F = mgℓ"], 0, "Pour α = 90°, |sin α| = 1.", "II.2 Cas particulier", 2),
    ],
  },
  {
    id: "laplace-force-direction",
    title: "Déterminer le sens de la force",
    summary: "Utiliser la règle des trois doigts de la main droite et décoder les symboles entrant et sortant du plan.",
    pages: "3",
    section: "II.2 Sens de la force — règle de la main droite et application",
    durationMinutes: 16,
    xp: 60,
    body: String.raw`## La règle des trois doigts

La direction de $\vec F$ est perpendiculaire au plan $(\vec\ell,\vec B)$, mais il reste à choisir l'un des deux sens possibles. Le document utilise la **main droite** :

| Doigt | Grandeur représentée |
|---|---|
| index | courant $I$, donc vecteur $\vec\ell$ |
| majeur | champ magnétique $\vec B$ |
| pouce | force de Laplace $\vec F$ |

Place d'abord l'index dans le sens du courant, puis le majeur dans le sens du champ. Le pouce indique alors le sens de la force.

## Lire un vecteur perpendiculaire à la feuille

Deux symboles évitent les dessins en perspective :

- $\odot$ : vecteur **sortant** de la feuille, comme la pointe d'une flèche qui vient vers toi ;
- $\otimes$ : vecteur **entrant** dans la feuille, comme l'empennage d'une flèche qui s'éloigne.

### Exemple central

Le courant est dirigé vers la droite et le champ entre dans la feuille :

$$\vec\ell\ \text{vers la droite},\qquad \vec B\ \text{entrant}\ (\otimes)$$

La règle de la main droite donne une force dirigée vers le **haut**.

Si l'on inverse uniquement le courant, la force va vers le bas. Si l'on inverse uniquement le champ, elle va aussi vers le bas. Si l'on inverse simultanément les deux, elle revient vers le haut.

## Retrouver une grandeur inconnue

La règle fonctionne également à rebours. Si le courant va vers la droite et la force vers le haut, alors le champ doit être entrant. On peut donc déterminer $\vec B$ à partir de $I$ et $\vec F$, comme dans l'exercice de la balance de Cotton.

> **Astuce mémoire.** **Index = I**, **Majeur = Magnétique**, **Pouce = Poussée**. Les trois mots commencent par la fonction du doigt.

> **Erreur fréquente.** Ne regarde pas le sens réel de déplacement des électrons : la loi scolaire utilise le **courant conventionnel**.` ,
    keyPoint: "Main droite : index dans le sens de I, majeur dans le sens de B, pouce dans le sens de F ; ⊙ sort du plan et ⊗ entre dans le plan.",
    example: "I vers la droite et B entrant dans la feuille donnent F vers le haut.",
    methodSteps: [
      "Traduis les symboles ⊙ et ⊗ avant de placer ta main.",
      "Aligne l'index de la main droite sur le courant conventionnel.",
      "Aligne le majeur sur le champ magnétique.",
      "Lis le sens de la force avec le pouce.",
      "Contrôle ta réponse : inverser une seule grandeur doit inverser F.",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Figure interactive",
      title: "Orienter I, B et F",
      instruction: "Sélectionne chaque repère et reconstruis le produit vectoriel sans deviner.",
      observation: "I vers la droite et B entrant donnent F vers le haut : le trièdre (ℓ, B, F) est direct.",
      caption: "Schéma original redessiné d'après la règle des trois doigts et l'application de la page 3.",
      viewBox: "0 0 390 250",
      shapes: [
        { shape: "line", x1: 70, y1: 155, x2: 320, y2: 155, tone: "outline" },
        { shape: "line", x1: 115, y1: 155, x2: 275, y2: 155, tone: "accent" },
        { shape: "path", d: "M275 155 L258 146 L258 164 Z", tone: "accent" },
        { shape: "text", x: 194, y: 179, content: "I", anchor: "middle" },
        { shape: "circle", cx: 194, cy: 155, r: 23, tone: "soft" },
        { shape: "line", x1: 182, y1: 143, x2: 206, y2: 167, tone: "accent" },
        { shape: "line", x1: 206, y1: 143, x2: 182, y2: 167, tone: "accent" },
        { shape: "text", x: 228, y: 135, content: "B entrant", anchor: "start" },
        { shape: "line", x1: 194, y1: 131, x2: 194, y2: 52, tone: "accent" },
        { shape: "path", d: "M194 52 L185 69 L203 69 Z", tone: "fill" },
        { shape: "text", x: 211, y: 71, content: "F", anchor: "start" },
        { shape: "circle", cx: 62, cy: 67, r: 20, tone: "muted" },
        { shape: "circle", cx: 62, cy: 67, r: 4, tone: "accent" },
        { shape: "text", x: 62, y: 102, content: "sortant", anchor: "middle" },
        { shape: "circle", cx: 326, cy: 67, r: 20, tone: "muted" },
        { shape: "line", x1: 314, y1: 55, x2: 338, y2: 79, tone: "accent" },
        { shape: "line", x1: 338, y1: 55, x2: 314, y2: 79, tone: "accent" },
        { shape: "text", x: 326, y: 102, content: "entrant", anchor: "middle" },
      ],
      hotspots: [
        { id: "current", number: 1, label: "Index : courant", detail: "Le courant conventionnel va ici de gauche à droite ; le vecteur ℓ a le même sens.", x: 285, y: 185 },
        { id: "field", number: 2, label: "Majeur : champ", detail: "La croix signifie que B entre dans la feuille, vers l'arrière du dessin.", x: 225, y: 190 },
        { id: "force", number: 3, label: "Pouce : force", detail: "Le pouce de la main droite pointe vers le haut : c'est le sens de F.", x: 235, y: 72 },
        { id: "symbols", number: 4, label: "Point ou croix", detail: "Le point ⊙ est une pointe de flèche sortante ; la croix ⊗ est la queue d'une flèche entrante.", x: 326, y: 67 },
      ],
    },
    questions: [
      choice("Dans la règle de la main droite, l'index indique…", ["le courant I", "la force F", "le poids P", "la masse m"], 0, "Index et intensité I sont associés.", "II.2 Règle des trois doigts", 1),
      choice("Le majeur indique…", ["le champ B", "le courant I", "la force F", "la longueur totale"], 0, "Le majeur représente le champ magnétique.", "II.2 Règle des trois doigts", 1),
      choice("Le pouce indique…", ["la force F", "le champ B", "le courant I", "la résistance"], 0, "Le pouce donne la poussée, donc F.", "II.2 Règle des trois doigts", 1),
      choice("Le symbole ⊗ représente un vecteur…", ["entrant dans la feuille", "sortant de la feuille", "dirigé vers la droite", "nul"], 0, "La croix évoque la queue de la flèche qui s'éloigne.", "II.2 Conventions", 1),
      choice("Le symbole ⊙ représente un vecteur…", ["sortant de la feuille", "entrant dans la feuille", "vertical vers le bas", "sans direction"], 0, "Le point évoque la pointe de la flèche qui vient vers l'observateur.", "II.2 Conventions", 1),
      choice("I va vers la droite et B entre dans la feuille. F est dirigée…", ["vers le haut", "vers le bas", "vers la droite", "dans la feuille"], 0, "La main droite donne une force vers le haut.", "Application, page 3", 2),
      choice("Dans la situation précédente, si seul I est inversé, F va…", ["vers le bas", "vers le haut", "dans la feuille", "toujours vers la droite"], 0, "Inverser un seul facteur inverse le produit vectoriel.", "Application, page 3", 2),
      choice("I va vers la droite et F vers le haut. Le champ est…", ["entrant dans la feuille", "sortant de la feuille", "parallèle au fil", "nul"], 0, "Le produit droite ∧ entrant donne une force vers le haut.", "Application inverse", 2),
    ],
  },
  {
    id: "laplace-force-magnitude",
    title: "Calculer la valeur de la force",
    summary: "Exploiter F = IℓB|sin α|, gérer l'angle et vérifier les cas limites avant de calculer.",
    pages: "3 et 7",
    section: "II.2 Valeur de la force et exercice 1",
    durationMinutes: 19,
    xp: 65,
    body: String.raw`## La formule générale

La valeur de la force de Laplace dépend de l'angle $\alpha$ entre le vecteur longueur $\vec\ell$ et le champ $\vec B$ :

$$\boxed{F=I\ell B\lvert\sin\alpha\rvert}$$

Les unités à employer sont celles du système international :

| Grandeur | Unité |
|---|---|
| $I$ | ampère (A) |
| $\ell$ | mètre (m) |
| $B$ | tesla (T) |
| $F$ | newton (N) |

Le facteur $\lvert\sin\alpha\rvert$ est compris entre 0 et 1. La force est nulle pour un fil parallèle au champ et maximale lorsque le fil est perpendiculaire au champ.

$$\alpha=0^\circ\Rightarrow F=0\qquad ;\qquad \alpha=90^\circ\Rightarrow F=I\ell B$$

## Exercice 1 du document

On donne $\ell=40$ cm, $I=12$ A et $B=0{,}25$ T. Convertissons d'abord :

$$\ell=40\ \text{cm}=0{,}40\ \text{m}$$

Le produit maximal vaut :

$$I\ell B=12\times0{,}40\times0{,}25=1{,}20\ \text{N}$$

### Pour $\alpha=30^\circ$

$$F=1{,}20\times\sin30^\circ=1{,}20\times0{,}5=\boxed{0{,}60\ \text{N}}$$

### Pour $\alpha=45^\circ$

$$F=1{,}20\times\frac{\sqrt2}{2}\approx0{,}8485\ \text{N}\approx\boxed{0{,}85\ \text{N}}$$

## Lire les proportionnalités

Pour un angle fixé, $F$ est proportionnelle à $I$, à $\ell$ et à $B$. Ainsi, doubler l'intensité double la force ; doubler simultanément $I$ et $B$ la multiplie par quatre. En revanche, l'effet de l'angle n'est pas linéaire : passer de $30^\circ$ à $60^\circ$ ne double pas la force.

> **Astuce mémoire.** Calcule d'abord la valeur maximale $F_{\max}=I\ell B$, puis multiplie par $\lvert\sin\alpha\rvert$.

> **Contrôle rapide.** Le résultat final doit toujours vérifier $0\leq F\leq I\ell B$.` ,
    keyPoint: "F = IℓB|sin α| ; la force est nulle pour α = 0° et maximale, égale à IℓB, pour α = 90°.",
    example: "Avec IℓB = 1,20 N et α = 45°, F = 1,20×√2/2 ≈ 0,85 N.",
    methodSteps: [
      "Convertis la longueur active en mètres et le champ en teslas.",
      "Identifie l'angle entre ℓ⃗ et B⃗, pas l'angle avec l'horizontale par habitude.",
      "Calcule d'abord Fmax = IℓB.",
      "Multiplie par |sin α| et conserve quelques chiffres pendant le calcul.",
      "Vérifie que le résultat est compris entre 0 et Fmax.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Courbe interactive",
      title: "Comment l'angle modifie la force",
      instruction: "Déplace le point entre 0° et 180° pour observer la valeur de F lorsque IℓB = 1,20 N.",
      observation: "La force est nulle à 0° et 180°, maximale à 90°, et symétrique autour de 90°.",
      formula: "F(α) = 1,20 |sin α|",
      formulaTex: "F(\\alpha)=1{,}20\\lvert\\sin\\alpha\\rvert",
      rule: {
        kind: "samples",
        points: [[0, 0], [15, 0.311], [30, 0.6], [45, 0.849], [60, 1.039], [75, 1.159], [90, 1.2], [105, 1.159], [120, 1.039], [135, 0.849], [150, 0.6], [165, 0.311], [180, 0]],
      },
      window: { xMin: 0, xMax: 180, yMin: 0, yMax: 1.3 },
      guides: [{ kind: "horizontal", value: 1.2, label: "Fmax = 1,20 N" }],
      marker: { min: 0, max: 180, step: 15, initial: 30 },
    },
    questions: [
      choice("Quelle formule donne la valeur générale de la force ?", ["F = IℓB|sin α|", "F = IℓB cos α", "F = I+ℓ+B", "F = mg/I"], 0, "Le module du produit vectoriel contient |sin α|.", "II.2 Valeur", 2),
      short("Exercice 1 : convertis 40 cm en mètres.", ["0,4", "0.4", "0,40", "0.40", "0,4 m", "0.4 m"], "40 cm = 40/100 m = 0,40 m.", "Exercice 1", 1),
      short("Exercice 1 : calcule IℓB en newtons.", ["1,2", "1.2", "1,20", "1.20", "1,2 N", "1.2 N"], "12×0,40×0,25 = 1,20 N.", "Exercice 1", 2),
      short("Exercice 1 : calcule F pour α = 30°.", ["0,6", "0.6", "0,60", "0.60", "0,6 N", "0.6 N"], "F = 1,20×sin 30° = 0,60 N.", "Exercice 1, question 1", 2),
      short("Exercice 1 : arrondis F au centième pour α = 45°.", ["0,85", "0.85", "0,85 N", "0.85 N"], "F = 1,20×√2/2 ≈ 0,8485 N, donc 0,85 N au centième.", "Exercice 1, question 2", 2),
      short("Avec les mêmes données, combien vaut F pour α = 90° ?", ["1,2", "1.2", "1,20", "1.20", "1,2 N", "1.2 N"], "À 90°, sin α = 1 donc F = IℓB = 1,20 N.", "Prolongement de l'exercice 1", 2),
      choice("Pour I, ℓ et B fixés, la force est maximale lorsque α vaut…", ["90°", "0°", "180°", "360°"], 0, "|sin 90°| = 1.", "II.2 Valeur", 1),
      choice("Si I double et que les autres données restent fixes, F…", ["double", "est divisée par deux", "est multipliée par quatre", "ne change pas"], 0, "F est proportionnelle à I.", "II.2 Proportionnalité", 1),
      choice("Quel contrôle doit satisfaire tout résultat ?", ["0 ≤ F ≤ IℓB", "F > IℓB dans tous les cas", "F < 0", "F = mg toujours"], 0, "Le facteur |sin α| reste compris entre 0 et 1.", "II.2 Valeur", 1),
    ],
    corrections: [
      "Page 7, exercice 1 : pour α = 45°, le calcul exact donne 0,8485… N, soit 0,85 N au centième. La valeur 0,86 N imprimée provient d'un arrondi trop précoce.",
    ],
  },
  {
    id: "official-laplace-exercises",
    title: "Résoudre les exercices officiels 1 à 3",
    summary: "Mobiliser orientation, valeur de la force et moment dans les configurations de fixation du document officiel.",
    pages: "5-9",
    section: "Évaluation et exercices de fixation 1 à 3",
    durationMinutes: 24,
    xp: 95,
    kind: "practice",
    body: String.raw`## Première situation — la tige pivotante

Une tige de cuivre $OA$ peut tourner autour de $O$. Une partie de la tige, parcourue par un courant, est placée dans un champ magnétique uniforme.

### Analyse qualitative

- interrupteur ouvert : $I=0$, donc $F=0$ et la tige ne dévie pas sous l'effet de Laplace ;
- circuit fermé mais champ retiré : $B=0$, donc $F=0$ ;
- circuit fermé et champ présent : la tige dévie ;
- inversion du courant : le sens de la déviation s'inverse ;
- inversion du champ : le sens de la déviation s'inverse ;
- inversion simultanée du courant et du champ : le sens initial de la force est retrouvé.

### Analyse quantitative

Le document donne $B=5{,}0\times10^{-2}$ T, $I=5{,}0$ A, $\ell=20$ cm, $m=10$ g et $g=10$ N·kg$^{-1}$. On convertit :

$$\ell=0{,}20\ \text{m}\qquad ;\qquad m=0{,}010\ \text{kg}$$

La force et le poids valent :

$$F=I\ell B=5{,}0\times0{,}20\times5{,}0\times10^{-2}=0{,}050\ \text{N}$$

$$P=mg=0{,}010\times10=0{,}100\ \text{N}$$

L'équilibre des moments conduit à $F=P\sin\alpha$, donc :

$$\sin\alpha=\frac{F}{P}=\frac{0{,}050}{0{,}100}=0{,}5$$

$$\boxed{\alpha=30^\circ}$$

## Exercice 2 — retrouver la masse

Pour $\ell=3$ cm, $I=8$ A et $B=0{,}50$ T, avec des bras égaux :

$$m=\frac{I\ell B}{g}=\frac{8\times0{,}03\times0{,}50}{10}=0{,}012\ \text{kg}=12\ \text{g}$$

## Exercice 3 — force et moment dans trois géométries

Les données communes sont $d=20$ cm $=0{,}20$ m, $I=500$ mA $=0{,}500$ A et $B=0{,}40$ T.

### Configurations 1 et 2

La longueur active vaut $d$ et le conducteur est perpendiculaire au champ :

$$F=IdB=0{,}500\times0{,}20\times0{,}40=\boxed{0{,}040\ \text{N}}$$

Le bras de levier vaut $d/2=0{,}10$ m :

$$\lvert M_O(\vec F)\rvert=F\frac d2=0{,}040\times0{,}10=\boxed{4{,}0\times10^{-3}\ \text{N·m}}$$

### Configuration 3

La longueur active vaut $2d=0{,}40$ m :

$$F=I(2d)B=0{,}500\times0{,}40\times0{,}40=\boxed{0{,}080\ \text{N}}$$

Le moment demandé vaut alors :

$$\lvert M_O(\vec F)\rvert=Fd=0{,}080\times0{,}10=\boxed{8{,}0\times10^{-3}\ \text{N·m}}$$

> **Astuce mémoire.** Pour un moment, ne multiplie pas automatiquement par la longueur du conducteur : utilise la **distance perpendiculaire** entre l'axe et la droite d'action de la force.` ,
    keyPoint: "Dans les exercices officiels, sépare toujours F = IℓB du moment M = Fd⊥ ; la longueur active et le bras de levier ne jouent pas le même rôle.",
    example: "Avec I = 0,500 A, ℓ = 0,20 m et B = 0,40 T, F = 0,040 N ; si d⊥ = 0,10 m, alors M = 0,0040 N·m.",
    methodSteps: [
      "Convertis mA en A, cm en m et g en kg.",
      "Identifie la longueur active avant de calculer F.",
      "Oriente la force avec la règle de la main droite.",
      "Trace ou repère la distance perpendiculaire à la droite d'action.",
      "Calcule le moment et attribue son signe selon le sens de rotation choisi.",
    ],
    interaction: timeline([
      { label: "1. Conditions", shortLabel: "I et B", detail: "Vérifie que courant et champ sont présents ; sinon la force de Laplace est nulle." },
      { label: "2. Conversions", shortLabel: "Unités S.I.", detail: "Transforme 500 mA en 0,500 A et 20 cm en 0,20 m avant tout calcul." },
      { label: "3. Force", shortLabel: "F = IℓB", detail: "Choisis la longueur réellement soumise au champ et calcule la valeur de la force." },
      { label: "4. Orientation", shortLabel: "Main droite", detail: "Détermine le sens de F pour connaître le sens de rotation autour de l'axe." },
      { label: "5. Moment", shortLabel: "M = Fd⊥", detail: "Utilise le bras de levier perpendiculaire, qui peut différer de la longueur active." },
    ], "Le protocole des exercices de fixation", "Avance étape par étape avant d'ouvrir les questions.", "Cette séparation évite les deux erreurs classiques : une longueur active mal choisie et un mauvais bras de levier."),
    questions: [
      choice("Tige pivotante : interrupteur ouvert, la force de Laplace vaut…", ["0 N", "IℓB", "mg", "IB/ℓ"], 0, "Circuit ouvert, l'intensité est nulle.", "Évaluation, question 1", 1),
      choice("Tige pivotante : si l'aimant est retiré, la force vaut…", ["0 N", "mg", "Iℓ", "toujours 1 N"], 0, "Sans champ magnétique, B = 0.", "Évaluation, question 2", 1),
      short("Évaluation : convertis B = 5×10⁻² T en écriture décimale.", ["0,05", "0.05", "0,050", "0.050", "0,05 T", "0.05 T"], "5×10⁻² T = 0,05 T.", "Évaluation quantitative", 1),
      short("Évaluation : calcule F pour I = 5 A, ℓ = 0,20 m et B = 0,05 T.", ["0,05", "0.05", "0,050", "0.050", "0,05 N", "0.05 N"], "F = 5×0,20×0,05 = 0,05 N.", "Évaluation quantitative", 2),
      short("Évaluation : calcule le poids de 10 g avec g = 10 N·kg⁻¹.", ["0,1", "0.1", "0,10", "0.10", "0,1 N", "0.1 N"], "10 g = 0,010 kg, donc P = 0,010×10 = 0,10 N.", "Évaluation quantitative", 2),
      short("Évaluation : si sin α = F/P = 0,5, donne α en degrés.", ["30", "30°", "30 degres", "30 degrés"], "sin 30° = 0,5.", "Évaluation quantitative", 2),
      short("Exercice 2 : calcule la masse d'équilibre en grammes.", ["12", "12 g", "12g"], "m = IℓB/g = 0,012 kg = 12 g.", "Exercice 2", 2),
      short("Exercice 3 : convertis I = 500 mA en ampères.", ["0,5", "0.5", "0,500", "0.500", "0,5 A", "0.5 A"], "500 mA = 500×10⁻³ A = 0,500 A.", "Exercice 3", 1),
      short("Exercice 3, cas 1 et 2 : calcule F en newtons.", ["0,04", "0.04", "0,040", "0.040", "0,04 N", "0.04 N"], "F = 0,500×0,20×0,40 = 0,040 N.", "Exercice 3, cas 1 et 2", 2),
      short("Exercice 3, cas 1 et 2 : calcule |M| en N·m.", ["0,004", "0.004", "4.10^-3", "4×10^-3", "0,004 N.m", "0.004 N.m"], "|M| = Fd/2 = 0,040×0,10 = 0,0040 N·m.", "Exercice 3, cas 1 et 2", 2),
      short("Exercice 3, cas 3 : calcule F en newtons.", ["0,08", "0.08", "0,080", "0.080", "0,08 N", "0.08 N"], "La longueur active vaut 2d = 0,40 m, donc F = 0,080 N.", "Exercice 3, cas 3", 2),
      short("Exercice 3, cas 3 : calcule |M| en N·m.", ["0,008", "0.008", "8.10^-3", "8×10^-3", "0,008 N.m", "0.008 N.m"], "|M| = 0,080×0,10 = 0,0080 N·m.", "Exercice 3, cas 3", 2),
    ],
  },
  {
    id: "laplace-measurement-equilibrium-mission",
    title: "Mission finale : identifier le champ et le courant",
    summary: "Exploiter la courbe d'une balance de Cotton puis résoudre l'équilibre complet d'une tige de Laplace inclinée.",
    pages: "9-11",
    section: "Exercices 4 et 5 — balance de Cotton et tige de Laplace",
    durationMinutes: 28,
    xp: 115,
    kind: "challenge",
    body: String.raw`## Mission A — exploiter la balance de Cotton

Le document fournit les mesures suivantes pour une portion $CD$ de longueur $\ell=2{,}9$ cm, avec $g=10$ N·kg$^{-1}$ :

| $m$ (g) | 0,5 | 1,0 | 1,5 | 2,0 | 2,5 | 3,0 |
|---:|---:|---:|---:|---:|---:|---:|
| $I$ (A) | 0,74 | 1,50 | 2,35 | 3,20 | 3,90 | 4,80 |

La portion $CD$ est parcourue de $C$ vers $D$ et la force magnétique nécessaire à l'équilibre est descendante. La règle de la main droite impose alors un champ **sortant du plan**, noté $\odot$.

Les portions circulaires $AD$ et $BC$ ont des forces dont les droites d'action rencontrent l'axe : leurs moments sont nuls. Avec des bras de levier égaux, l'équilibre donne :

$$I\ell B=mg$$

Donc :

$$\boxed{I=\frac{g}{\ell B}\,m}$$

La courbe $I=f(m)$ est une droite passant par l'origine. En utilisant les points $(1{,}0\ \text{g};1{,}50\ \text{A})$ et $(2{,}5\ \text{g};3{,}90\ \text{A})$, avec les masses en kilogrammes :

$$k=\frac{3{,}90-1{,}50}{0{,}0025-0{,}0010}=1600\ \text{A·kg}^{-1}$$

Comme $k=g/(\ell B)$ :

$$B=\frac{g}{k\ell}=\frac{10}{1600\times0{,}029}\approx\boxed{0{,}215\ \text{T}}$$

## Mission B — résoudre la tige inclinée

Une tige de longueur $\ell$ et de masse $m=20$ g pivote autour de $A$. À l'équilibre, elle fait un angle $\alpha=10^\circ$ avec la verticale. La portion plongée dans le champ est symétrique par rapport à son centre d'inertie $G$. On donne $h=5$ cm et $B=0{,}50$ T.

La géométrie du dessin donne :

$$h=\ell\cos\alpha\qquad\Longrightarrow\qquad \ell=\frac{h}{\cos\alpha}$$

La force de Laplace vaut alors :

$$F=I\ell B=\boxed{\frac{IhB}{\cos\alpha}}$$

Les forces appliquées sont le poids $\vec P$, la force de Laplace $\vec F$ et la réaction $\vec R$ de l'axe. Le moment de $\vec R$ en $A$ est nul. Les deux autres moments sont :

$$M_A(P)=\frac{mg\ell\sin\alpha}{2}$$

$$M_A(F)=-\frac{IhB\ell}{2\cos\alpha}$$

L'équilibre $M_A(P)+M_A(F)=0$ conduit à :

$$mg\sin\alpha=\frac{IhB}{\cos\alpha}$$

$$I=\frac{mg\sin\alpha\cos\alpha}{hB}=\boxed{\frac{mg\sin(2\alpha)}{2hB}}$$

Application numérique :

$$I=\frac{0{,}020\times10\times\sin20^\circ}{2\times0{,}050\times0{,}50}\approx\boxed{1{,}36\ \text{A}}$$

## Bilan stratégique

Dans les deux missions, la même idée gouverne le raisonnement : la force de Laplace est obtenue par $I\ell B$, mais c'est **l'équilibre des moments** qui relie cette force au poids. Le graphique de la première mission mesure $B$ ; la géométrie de la seconde permet de retrouver $I$.

> **Astuce mémoire.** Le texte imprimé écrit « $\sin2\alpha$ » sans espace. Ici il faut lire $\sin(2\alpha)$ : la valeur $1{,}36$ A confirme cette interprétation.` ,
    keyPoint: "La pente k de I = f(m) donne B = g/(kℓ) ; pour la tige inclinée, I = mg sin(2α)/(2hB).",
    example: "Avec k = 1600 A·kg⁻¹ et ℓ = 0,029 m, B ≈ 0,215 T ; avec m = 0,020 kg, α = 10°, h = 0,050 m et B = 0,50 T, I ≈ 1,36 A.",
    methodSteps: [
      "Écris les données dans les unités S.I. et corrige l'unité incohérente du tableau.",
      "Détermine le sens de B à partir du courant et de la force d'équilibre.",
      "Écris l'équilibre des moments et obtiens la relation littérale.",
      "Pour la balance, mesure la pente k avec les masses en kilogrammes puis calcule B.",
      "Pour la tige, utilise h = ℓ cos α puis l'identité sin(2α) = 2 sin α cos α.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Mesure interactive",
      title: "La droite I = f(m) de la balance",
      instruction: "Déplace le point le long des mesures ; l'abscisse est la masse en grammes et l'ordonnée l'intensité en ampères.",
      observation: "Les mesures entourent la droite I ≈ 1,6m lorsque m est exprimée en grammes, soit une pente de 1600 A·kg⁻¹.",
      formula: "I(A) ≈ 1,6 × m(g)",
      formulaTex: "I\\,(\\mathrm{A})\\approx1{,}6\\,m\\,(\\mathrm{g})",
      rule: { kind: "samples", points: [[0, 0], [0.5, 0.74], [1, 1.5], [1.5, 2.35], [2, 3.2], [2.5, 3.9], [3, 4.8]] },
      window: { xMin: 0, xMax: 3.2, yMin: 0, yMax: 5.2 },
      guides: [{ kind: "oblique", slope: 1.6, intercept: 0, label: "I = 1,6m" }],
      marker: { min: 0, max: 3, step: 0.5, initial: 1 },
    },
    questions: [
      choice("Exercice 4 : le champ magnétique dans la zone active est…", ["sortant du plan", "entrant dans le plan", "parallèle au courant", "nul"], 0, "I va de C vers D et F est descendante ; la main droite impose B sortant.", "Exercice 4, question 1", 2),
      choice("Pourquoi les forces sur AD et BC n'interviennent-elles pas dans l'équilibre ?", ["Leurs moments autour de l'axe sont nuls", "Elles n'existent pas", "Le courant y est alternatif", "Le champ y est électrique"], 0, "Leurs droites d'action rencontrent l'axe de rotation.", "Exercice 4, question 2", 2),
      choice("Quelle relation relie I et m lorsque les bras sont égaux ?", ["I = mg/(ℓB)", "I = ℓB/(mg)", "I = mℓB/g", "I = gB/(mℓ)"], 0, "IℓB = mg, donc I = mg/(ℓB).", "Exercice 4, question 3", 2),
      choice("La courbe I = f(m) idéale est…", ["une droite passant par l'origine", "une parabole", "une droite horizontale", "une hyperbole"], 0, "I = km traduit une proportionnalité.", "Exercice 4, question 4", 1),
      short("Avec les deux points retenus, donne k en A·kg⁻¹.", ["1600", "1600 A/kg", "1,6.10^3", "1,6×10^3"], "k = (3,90−1,50)/(0,0025−0,0010) = 1600 A·kg⁻¹.", "Exercice 4, question 5", 3),
      short("Exercice 4 : calcule B au millième de tesla.", ["0,215", "0.215", "0,216", "0.216", "0,215 T", "0.215 T"], "B = 10/(1600×0,029) ≈ 0,2155 T, soit 0,215 T selon l'arrondi du document ou 0,216 T au millième usuel.", "Exercice 4, question 5", 3),
      short("Exercice 5 : convertis m = 20 g en kilogrammes.", ["0,02", "0.02", "0,020", "0.020", "0,02 kg", "0.02 kg"], "20 g = 0,020 kg.", "Exercice 5", 1),
      short("Exercice 5 : convertis h = 5 cm en mètres.", ["0,05", "0.05", "0,050", "0.050", "0,05 m", "0.05 m"], "5 cm = 0,050 m.", "Exercice 5", 1),
      choice("Quelle relation géométrique lie h et ℓ ?", ["h = ℓ cos α", "h = ℓ sin α", "h = ℓ/α", "h = ℓB"], 0, "h est la projection verticale de la longueur ℓ.", "Exercice 5, question 1", 2),
      choice("Quelle est l'expression de la force dans cet exercice ?", ["F = IhB/cos α", "F = IhB cos α", "F = I cos α/(hB)", "F = mg sin α"], 0, "F = IℓB et ℓ = h/cos α.", "Exercice 5, question 1", 2),
      choice("Quelles forces agissent sur la tige ?", ["F, P et R", "F seulement", "P et B", "I et ℓ"], 0, "Il faut représenter la force de Laplace, le poids et la réaction du support.", "Exercice 5, question 2", 1),
      choice("Pourquoi le moment de R en A est-il nul ?", ["Sa droite d'action passe par A", "R est toujours nulle", "R est parallèle à B", "La tige est sans masse"], 0, "La réaction est appliquée sur l'axe de rotation.", "Exercice 5, question 3", 2),
      choice("Quelle expression finale donne I ?", ["I = mg sin(2α)/(2hB)", "I = mg sin²α/(2hB)", "I = 2hB/(mg)", "I = mg/(hB sin α)"], 0, "L'équilibre donne mg sin α cos α/(hB), puis sin 2α = 2 sin α cos α.", "Exercice 5, question 4", 3),
      short("Exercice 5 : calcule I au centième d'ampère.", ["1,36", "1.36", "1,37", "1.37", "1,36 A", "1.36 A"], "I = 0,020×10×sin 20°/(2×0,050×0,50) ≈ 1,36 A.", "Exercice 5, question 5", 3),
      choice("Dans la formule imprimée « sin2α », quelle lecture est cohérente avec 1,36 A ?", ["sin(2α)", "sin²α", "2 sin α sans cos α", "sin α/2"], 0, "Le calcul numérique et l'identité trigonométrique montrent qu'il s'agit de sin(2α).", "Exercice 5, solution", 2),
      choice("Quel principe commun relie les deux missions ?", ["L'équilibre des moments avec F = IℓB", "La conservation de la charge seule", "La loi de Snell-Descartes", "La poussée d'Archimède"], 0, "Dans les deux cas, le moment de la force de Laplace équilibre celui du poids.", "Exercices 4 et 5", 2),
    ],
    corrections: [
      "Pages 9-10, exercice 4 : l'en-tête « m (mg) » est incompatible avec les conversions 0,0010 kg et 0,0025 kg utilisées par la solution et avec B ≈ 0,215 T. Les valeurs 0,5 à 3 sont donc des grammes, pas des milligrammes.",
      "Page 11, exercice 5 : la typographie compacte « sin2α » doit être lue sin(2α), et non sin²(α). La dérivation et la valeur numérique I ≈ 1,36 A le confirment.",
    ],
  },
];

const levelOrder = [
  "laplace-force-experiments",
  "laplace-vector-law-characteristics",
  "laplace-force-direction",
  "laplace-force-magnitude",
  "cotton-balance-measurement",
  "laplace-force-applications",
  "official-laplace-exercises",
  "laplace-measurement-equilibrium-mission",
] as const;

const levelById = new Map(levels.map((level) => [level.id, level]));
const builtLevels = levelOrder.map((id, index) => {
  const level = levelById.get(id);
  if (!level) throw new Error(`Niveau de la loi de Laplace introuvable : ${id}`);
  return officialLevel(index, level);
});

export const laplaceLawPath: LearningPath = {
  id: "terminale-cd-laplace-law",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C et D • Côte d'Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 2, title: "Électricité" },
  chapterNumber: 8,
  title: "Loi de Laplace",
  description: "Mettre en évidence, orienter et calculer la force de Laplace, exploiter la balance de Cotton et comprendre ses principales applications.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Mettre en évidence expérimentalement la force de Laplace.",
    "Écrire et exploiter la relation vectorielle F⃗ = Iℓ⃗ ∧ B⃗.",
    "Déterminer le sens de la force avec la règle de la main droite.",
    "Calculer la valeur d'une force et son moment autour d'un axe.",
    "Mesurer un champ avec une balance de Cotton.",
    "Expliquer le fonctionnement d'une roue de Barlow, d'un haut-parleur et d'un frein à courants de Foucault.",
  ],
  modules: [{
    id: "laplace-law-mastery",
    title: "Maîtriser la loi de Laplace",
    description: "De l'expérience des rails à la détermination d'un champ et d'un courant par équilibre, un niveau après l'autre.",
    lessons: builtLevels,
  }],
};

export const laplaceLawPaths: LearningPath[] = [laplaceLawPath];
