import type {
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

// Leçon 02 de Physique (Terminales C et D) — commune aux deux séries.
const sourceDocument = "TleD_PHY_L2_Mouvement du centre d’inertie d’un solide.pdf";

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
      tip: "Précise toujours le système, le référentiel et le repère — et l’unité : une accélération est en m·s⁻², une force en N.",
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
    id: "galilean-referentials",
    title: "Les référentiels galiléens",
    summary: "Définir le cadre indispensable à toute la dynamique : le référentiel galiléen, où le principe d’inertie est vérifié.",
    pages: "1",
    section: "1. Les référentiels galiléens",
    durationMinutes: 13,
    xp: 45,
    body: String.raw`## Pourquoi un référentiel « galiléen » ?

Toute la mécanique de cette leçon (théorème du centre d’inertie, théorème de l’énergie cinétique) ne s’applique que dans un type de référentiel bien précis.

> **Définition.** Un **référentiel galiléen** est un référentiel dans lequel le **principe de l’inertie est vérifié** : un solide soumis à des forces qui se compensent est soit immobile, soit en mouvement rectiligne uniforme.

## Trois exemples au programme

| Référentiel | Origine | Axes |
|---|---|---|
| **Copernic** (héliocentrique) | le centre du système solaire | trois axes dirigés vers trois étoiles fixes |
| **Géocentrique** | le centre d’inertie de la Terre | les mêmes axes que Copernic |
| **Terrestre** (du laboratoire) | un objet immobile sur la Terre (un mur, un arbre…) | liés au sol |

> **À retenir.** Le **référentiel terrestre** est celui de presque tous les exercices. Il est **supposé galiléen pour des expériences de courte durée** — c’est cette hypothèse qu’on écrit au début de chaque résolution : « référentiel terrestre supposé galiléen ».`,
    keyPoint: "Un référentiel galiléen est un référentiel où le principe de l’inertie est vérifié ; le référentiel terrestre l’est pour de courtes durées.",
    example: "Pour étudier un mobile sur un banc à coussin d’air, on choisit le référentiel terrestre supposé galiléen.",
    methodSteps: [
      "Repère le solide de référence (le sol, la Terre, le Soleil).",
      "Vérifie que le principe d’inertie y est valable.",
      "Pour un exercice courant, écris « référentiel terrestre supposé galiléen ».",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Les référentiels galiléens",
      instruction: "Sélectionne un référentiel pour voir son origine et ses axes.",
      observation: "Du plus large (le Soleil) au plus proche (le laboratoire) : tous supposés galiléens, le terrestre seulement pour de courtes durées.",
      rootLabel: "Référentiel galiléen",
      rootDetail: "Un référentiel où le principe de l’inertie est vérifié",
      nodes: [
        { id: "copernic", group: "À l’échelle du système solaire", label: "Copernic (héliocentrique)", role: "Centré sur le Soleil", detail: "Origine : le centre du système solaire. Axes : trois directions pointant vers trois étoiles fixes. Le plus « galiléen » de tous — référence des mouvements des planètes." },
        { id: "geocentric", group: "À l’échelle de la Terre", label: "Géocentrique", role: "Centré sur la Terre", detail: "Origine : le centre d’inertie de la Terre. Ses axes sont ceux du référentiel de Copernic. Sert à étudier les satellites et la Lune." },
        { id: "terrestrial", group: "À l’échelle du laboratoire", label: "Terrestre (du laboratoire)", role: "Lié au sol", detail: "Le solide de référence est un objet immobile sur Terre (mur, arbre…). Supposé galiléen pour des expériences de courte durée : c’est le référentiel de la quasi-totalité des exercices." },
      ],
    },
    questions: [
      choice("Qu’est-ce qu’un référentiel galiléen ?", ["Un référentiel où le principe de l’inertie est vérifié", "Un référentiel en rotation rapide", "Un référentiel centré sur l’élève", "Un référentiel où toute vitesse est nulle"], 0, "C’est la définition exacte du cours.", "1.1 Définition", 2),
      choice("Quelle est l’origine du référentiel géocentrique ?", ["Le centre d’inertie de la Terre", "Le centre du Soleil", "Un mur du laboratoire", "Un satellite"], 0, "Ses axes sont ceux de Copernic.", "1.2 Exemples", 1),
      choice("« Un solide en mouvement rectiligne et uniforme peut être considéré comme un référentiel galiléen. » Vrai ou faux ?", ["Vrai", "Faux : seul un solide immobile convient", "Faux : aucun solide ne convient", "Vrai uniquement au repos"], 0, "Un référentiel en translation rectiligne uniforme par rapport à un référentiel galiléen est lui aussi galiléen.", "Activité d’application, affirmation 3", 2),
      short("Pour un exercice de courte durée, quel référentiel choisit-on presque toujours ?", ["terrestre", "référentiel terrestre", "le référentiel terrestre", "laboratoire", "référentiel du laboratoire"], "Le référentiel terrestre, supposé galiléen pour de courtes durées.", "1.2 Exemples", 1),
    ],
  },
  {
    id: "center-inertia-theorem",
    title: "Le théorème du centre d’inertie",
    summary: "Relier les forces extérieures à l’accélération du centre d’inertie : le cœur de la dynamique du solide.",
    pages: "1-2",
    section: "2. Théorème du centre d’inertie",
    durationMinutes: 15,
    xp: 55,
    body: String.raw`## L’énoncé

> **Théorème du centre d’inertie (TCI).** Dans un référentiel galiléen, la **somme vectorielle des forces extérieures** appliquées à un solide est égale au **produit de sa masse par le vecteur-accélération de son centre d’inertie G** :

$$\sum \vec{F}_{ext} = m\,\vec{a}_G$$

C’est une **égalité vectorielle** : la somme des forces et l’accélération de $G$ ont **même direction et même sens**.

## Le cas où les forces se compensent

Si la somme des forces extérieures est nulle, l’accélération l’est aussi :

$$\sum \vec{F}_{ext} = \vec{0} \;\Longrightarrow\; \vec{a}_G = \vec{0}$$

Deux situations possibles alors :

- $\vec{v} = \vec{0}$ : le solide est **immobile** ;
- $\vec{v} = \overrightarrow{\text{cste}}$ : le mouvement est **rectiligne uniforme**.

> **On retrouve le principe de l’inertie.** Le TCI le contient comme cas particulier : « forces compensées » équivaut à « immobile ou rectiligne uniforme ».

> **Attention.** Les théorèmes de cette leçon ne sont valables **que dans un référentiel galiléen**.`,
    keyPoint: "TCI : dans un référentiel galiléen, ∑F_ext = m·a_G (même direction et même sens que l’accélération de G).",
    example: "Sur un plan incliné sans frottement, R + P = m·a ; projetée sur la ligne de plus grande pente, elle donne a = g·sinθ.",
    methodSteps: [
      "Vérifie que le référentiel est galiléen.",
      "Fais le bilan des forces extérieures et écris ∑F = m·a.",
      "Projette cette égalité vectorielle sur les axes du repère.",
      "Isole l’accélération (ou la force) cherchée.",
    ],
    interaction: {
      kind: "diagram",
      eyebrow: "Explorer",
      title: "Que dit le théorème du centre d’inertie ?",
      instruction: "Sélectionne un élément pour comprendre chaque terme de ∑F = m·a.",
      observation: "L’accélération de G a exactement la direction et le sens de la résultante des forces.",
      rootLabel: "∑Fₑₓₜ = m·a_G",
      rootDetail: "L’égalité fondamentale de la dynamique, dans un référentiel galiléen",
      nodes: [
        { id: "sum-forces", group: "Les termes du théorème", label: "∑Fₑₓₜ : la résultante", role: "La somme des forces extérieures", detail: "On additionne vectoriellement toutes les forces qui agissent sur le solide (poids, réaction, frottement, force motrice…). Seules les forces extérieures comptent." },
        { id: "mass", group: "Les termes du théorème", label: "m : la masse", role: "L’inertie du solide", detail: "La masse mesure la résistance du solide à la variation de vitesse : à force égale, plus m est grand, plus a_G est petit." },
        { id: "acceleration", group: "Les termes du théorème", label: "a_G : l’accélération de G", role: "Même direction, même sens que ∑F", detail: "Le vecteur-accélération du centre d’inertie est colinéaire et de même sens que la résultante des forces. C’est ce qui permet, après projection, de calculer a." },
        { id: "equilibrium", group: "Le cas particulier", label: "Si ∑F = 0", role: "Le principe de l’inertie", detail: "Alors a_G = 0 : le solide est immobile (v = 0) ou en mouvement rectiligne uniforme (v = constante). Le TCI contient le principe de l’inertie." },
      ],
    },
    questions: [
      short("Complète le théorème du centre d’inertie : ∑Fₑₓₜ = …", ["m.a", "m·a", "m a_G", "m.a_G", "m·a_G", "m aG"], "La somme des forces extérieures égale le produit de la masse par l’accélération de G.", "2. Énoncé du TCI", 2),
      choice("« Les théorèmes de l’énergie cinétique et du centre d’inertie ne sont applicables que dans des référentiels galiléens. » Vrai ou faux ?", ["Vrai", "Faux : ils s’appliquent partout", "Faux : seulement le TCI", "Faux : seulement le TEC"], 0, "C’est la condition d’application des deux théorèmes.", "Activité d’application, affirmation 2", 2),
      choice("« Si la somme vectorielle des forces extérieures est nulle, alors le solide est nécessairement au repos. » Vrai ou faux ?", ["Faux : il peut aussi être en mouvement rectiligne uniforme", "Vrai", "Vrai s’il est lourd", "Faux : il accélère toujours"], 0, "∑F = 0 ⇒ a = 0 : immobile OU rectiligne uniforme.", "Activité d’application, affirmation 1", 2),
      choice("Dans un référentiel galiléen, pour un solide en mouvement rectiligne uniforme, la somme des forces extérieures est…", ["nulle", "égale au poids", "maximale", "verticale"], 0, "a = 0 pour un MRU, donc ∑F = m·a = 0.", "Activité d’application, affirmation 4", 1),
    ],
  },
  {
    id: "kinetic-energy-theorem",
    title: "Le théorème de l’énergie cinétique",
    summary: "Relier la variation d’énergie cinétique aux travaux des forces : l’outil idéal pour calculer une vitesse.",
    pages: "2",
    section: "3. Théorème de l’énergie cinétique",
    durationMinutes: 14,
    xp: 60,
    body: String.raw`## L’énoncé

> **Théorème de l’énergie cinétique (TEC).** Dans un référentiel galiléen, la **variation de l’énergie cinétique** d’un solide entre deux instants (ou deux points A et B) est égale à la **somme algébrique des travaux** de toutes les forces extérieures entre ces deux instants :

$$\Delta E_C = E_{C_B} - E_{C_A} = \sum W_{AB}(\vec{F}_{ext})$$

avec l’énergie cinétique $E_C = \dfrac{1}{2}\,m\,v^2$.

## Lire les travaux : moteur, résistant ou nul

| Travail | Signe | Exemple |
|---|---|---|
| **Moteur** | $W > 0$ | le poids quand le solide **descend** |
| **Résistant** | $W < 0$ | les **frottements** (opposés au mouvement) |
| **Nul** | $W = 0$ | une force **perpendiculaire** au déplacement |

> **Le réflexe qui simplifie tout.** La réaction $\vec{R}$ d’un support **sans frottement** est perpendiculaire au déplacement : son travail est **nul**. Sur un plan incliné lisse, il ne reste que le travail du poids : $W(\vec{P}) = m\,g\,\ell\,\sin\theta$.

> **Erreur fréquente à éviter.** La variation d’énergie cinétique est égale à la somme des **travaux** des forces, **pas** à la somme des forces. Une énergie ne s’ajoute pas à une force.`,
    keyPoint: "TEC : ΔEc = ∑W(F_ext). Une réaction sans frottement ne travaille pas (R⊥déplacement).",
    example: "Sur un plan incliné lisse, ½mV²_B = m·g·ℓ·sinθ, d’où V_B = √(2gℓsinθ).",
    methodSteps: [
      "Choisis les deux points A (départ) et B (arrivée).",
      "Écris E_C(B) − E_C(A) = somme des travaux.",
      "Élimine les travaux nuls (forces perpendiculaires au déplacement).",
      "Remplace E_C = ½mv² et isole la vitesse cherchée.",
    ],
    interaction: timeline(
      [
        { label: "La variation d’énergie cinétique", shortLabel: "ΔEc", detail: "ΔEc = E_C(B) − E_C(A) = ½mv²_B − ½mv²_A : ce qui a changé dans le mouvement entre A et B." },
        { label: "= la somme des travaux", shortLabel: "= ∑W", detail: "On additionne les travaux de toutes les forces extérieures entre A et B, avec leur signe." },
        { label: "Travail moteur (W > 0)", shortLabel: "Moteur", detail: "Une force dans le sens du mouvement accélère : ex. le poids d’un solide qui descend, W(P) = +mgℓsinθ." },
        { label: "Travail résistant (W < 0)", shortLabel: "Résistant", detail: "Une force opposée au mouvement freine : ex. les frottements, W(f) = −f·ℓ." },
        { label: "Travail nul (W = 0)", shortLabel: "Nul", detail: "Une force perpendiculaire au déplacement ne travaille pas : ex. la réaction d’un support sans frottement, R ⊥ (AB)." },
      ],
      "De la variation d’énergie aux travaux",
      "Parcours chaque terme du bilan d’énergie.",
      "Repérer les travaux nuls et résistants est ce qui rend le calcul rapide.",
    ),
    questions: [
      choice("Le théorème de l’énergie cinétique relie la variation d’énergie cinétique à…", ["la somme des travaux des forces extérieures", "la somme des forces extérieures", "la masse du solide seule", "la durée du trajet"], 0, "ΔEc = ∑W(F_ext).", "3. Énoncé du TEC", 2),
      choice("« Dans un référentiel galiléen, la variation de l’énergie cinétique d’un solide est égale à la somme des forces extérieures. » Vrai ou faux ?", ["Faux : à la somme de leurs travaux, pas des forces", "Vrai", "Vrai en chute libre", "Vrai sans frottement"], 0, "On confond souvent forces et travaux : c’est la somme des travaux.", "Activité d’application, affirmation 5", 2),
      choice("Pourquoi le travail de la réaction R est-il nul sur un plan incliné sans frottement ?", ["Parce que R est perpendiculaire au déplacement", "Parce que R est nulle", "Parce que le solide est immobile", "Parce que R est verticale"], 0, "W = 0 quand la force est perpendiculaire au déplacement.", "Situation d’évaluation, question 4", 2),
      short("Quelle est l’expression de l’énergie cinétique d’un solide de masse m et de vitesse v ?", ["1/2 m v^2", "1/2mv²", "½mv²", "0,5 m v^2", "mv²/2"], "E_C = ½mv².", "3. Énoncé du TEC", 1),
    ],
  },
  {
    id: "mechanics-protocol",
    title: "Le protocole de résolution",
    summary: "La méthode en quatre étapes qui structure tout exercice de mécanique.",
    pages: "3",
    section: "4. Protocole de résolution d’un problème de mécanique",
    durationMinutes: 12,
    xp: 65,
    body: String.raw`## Les quatre étapes, toujours dans le même ordre

Pour résoudre un problème de mécanique, on suit **toujours** la même démarche :

1. **Définir le système** — le solide (ou l’objet) que l’on étudie.
2. **Choisir un référentiel galiléen** muni d’un **repère orthonormé** — presque toujours « référentiel terrestre supposé galiléen ».
3. **Faire le bilan des forces** extérieures appliquées au système — avec un **schéma** si possible (poids, réaction, frottement, force motrice…).
4. **Appliquer le théorème** adapté :
   - le **théorème du centre d’inertie** pour trouver une **accélération** (ou une force) ;
   - le **théorème de l’énergie cinétique** pour trouver une **vitesse** (ou une distance).

> **Comment choisir entre les deux théorèmes ?** On demande une **accélération** ou on connaît les forces → **TCI**. On demande une **vitesse** ou une **distance** de freinage → **TEC** (souvent plus rapide, car il élimine les forces qui ne travaillent pas).

> **Astuce du schéma.** Un bon schéma des forces, orienté selon le repère, évite 90 % des erreurs de signe lors de la projection.`,
    keyPoint: "Système → référentiel galiléen + repère → bilan des forces (schéma) → TCI (accélération) ou TEC (vitesse).",
    example: "Pour trouver V_B on choisit le TEC ; pour trouver l’accélération a on choisit le TCI.",
    methodSteps: [
      "Définir le système étudié.",
      "Choisir le référentiel galiléen et le repère orthonormé.",
      "Faire le bilan des forces avec un schéma.",
      "Appliquer le TCI (pour a) ou le TEC (pour v).",
    ],
    interaction: timeline(
      [
        { label: "1. Définir le système", shortLabel: "Système", detail: "Nommer précisément le solide étudié : « le système est le solide S » ou « le véhicule »." },
        { label: "2. Choisir le référentiel", shortLabel: "Référentiel", detail: "Un référentiel galiléen muni d’un repère orthonormé : « référentiel terrestre supposé galiléen »." },
        { label: "3. Bilan des forces", shortLabel: "Forces", detail: "Inventorier toutes les forces extérieures (poids, réaction, frottement, force motrice) et les représenter sur un schéma." },
        { label: "4. Appliquer le théorème", shortLabel: "Théorème", detail: "TCI si l’on cherche une accélération ou une force ; TEC si l’on cherche une vitesse ou une distance." },
      ],
      "Le protocole de mécanique en 4 étapes",
      "Suis l’ordre : chaque étape prépare la suivante.",
      "Le choix du théorème (étape 4) dépend de la grandeur cherchée : accélération → TCI, vitesse → TEC.",
    ),
    questions: [
      choice("Quelle est la première étape d’un problème de mécanique ?", ["Définir le système étudié", "Calculer la vitesse", "Choisir le théorème", "Faire l’application numérique"], 0, "On définit d’abord le système, puis le référentiel, puis les forces.", "4. Protocole", 1),
      choice("On cherche l’accélération d’un mobile connaissant les forces. Quel théorème appliquer ?", ["Le théorème du centre d’inertie", "Le théorème de l’énergie cinétique", "Le principe de Pascal", "La loi d’Ohm"], 0, "Le TCI relie forces et accélération.", "4. Protocole", 2),
      choice("On cherche la vitesse d’un solide après un trajet. Quel théorème est le plus direct ?", ["Le théorème de l’énergie cinétique", "Le théorème du centre d’inertie", "La conservation de la charge", "Le théorème de Thalès"], 0, "Le TEC relie directement vitesse et travaux.", "4. Protocole", 2),
      short("Quel document d’aide accompagne le bilan des forces (étape 3) ?", ["un schéma", "schéma", "un schema", "le schéma", "un dessin"], "Un schéma des forces orienté selon le repère.", "4. Protocole", 1),
    ],
  },
  {
    id: "inclined-plane",
    title: "Le plan incliné sans frottement",
    summary: "L’application phare : sur un plan incliné lisse, l’accélération vaut g·sinθ, indépendante de la masse.",
    pages: "3-6",
    section: "Situation d’évaluation et Exercice 3",
    durationMinutes: 16,
    xp: 70,
    body: String.raw`## Le bilan des forces

Un solide $S$ glisse **sans frottement** sur un plan incliné d’un angle $\theta$. Deux forces seulement s’exercent :

- son **poids** $\vec{P}$, vertical, vers le bas ;
- la **réaction** $\vec{R}$ de la piste, **perpendiculaire** au plan (car il n’y a pas de frottement).

## L’accélération par le théorème du centre d’inertie

On applique le TCI, puis on **projette** sur la ligne de plus grande pente $(A,x)$ orientée vers le bas :

$$\vec{R} + \vec{P} = m\,\vec{a} \quad\xrightarrow{\text{projection sur } x}\quad 0 + m\,g\sin\theta = m\,a_x$$

$$\boxed{a_x = g\sin\theta}$$

> **Résultat remarquable.** L’accélération **ne dépend pas de la masse** : deux solides de masses différentes glissent avec la même accélération. Pour $\theta = 30°$ et $g = 10\ \text{m·s}^{-2}$ : $a_x = 10 \times \sin 30° = 5\ \text{m·s}^{-2}$.

## La vitesse en bas par le théorème de l’énergie cinétique

Entre $A$ (départ, $v_A = 0$) et $B$, seul le poids travaille (la réaction est perpendiculaire) :

$$\tfrac{1}{2}m V_B^2 - 0 = m\,g\,\ell\,\sin\theta \;\Longrightarrow\; \boxed{V_B = \sqrt{2\,g\,\ell\,\sin\theta}}$$

Application (banc à coussin d’air, $\ell = 2\ \text{m}$, $\theta = 30°$) : $V_B = \sqrt{2 \times 10 \times 2 \times 0{,}5} = \sqrt{20} \approx 4{,}5\ \text{m·s}^{-1}$.`,
    keyPoint: "Plan incliné sans frottement : a = g·sinθ (indépendant de m) ; et V_B = √(2gℓsinθ) par le TEC.",
    example: "θ = 30°, g = 10 : a = 5 m·s⁻² ; avec ℓ = 2 m, V_B = √20 ≈ 4,5 m·s⁻¹.",
    methodSteps: [
      "Système : le solide ; référentiel terrestre supposé galiléen.",
      "Bilan : poids P (vertical) et réaction R (perpendiculaire au plan, car sans frottement).",
      "TCI projeté sur la ligne de plus grande pente : a = g·sinθ.",
      "TEC entre A et B (seul le poids travaille) : V_B = √(2gℓsinθ).",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer les forces",
      title: "Forces sur un plan incliné (sans frottement)",
      instruction: "Sélectionne un repère pour situer chaque force et l’angle.",
      observation: "Sans frottement, seules P (vers le bas) et R (perpendiculaire au plan) agissent. La projection sur la ligne de plus grande pente donne a = g·sinθ.",
      caption: "Figure redessinée d’après le document officiel : le solide S sur le plan incliné et son bilan de forces.",
      viewBox: "0 0 320 210",
      shapes: [
        { shape: "line", x1: 55, y1: 175, x2: 275, y2: 175, tone: "outline" },
        { shape: "line", x1: 55, y1: 175, x2: 55, y2: 60, tone: "muted" },
        { shape: "line", x1: 55, y1: 60, x2: 275, y2: 175, tone: "accent" },
        { shape: "path", d: "M150 106 L180 106 L180 126 L150 126 Z", tone: "fill" },
        { shape: "text", x: 165, y: 120, content: "S", anchor: "middle" },
        { shape: "line", x1: 165, y1: 118, x2: 165, y2: 168, tone: "soft" },
        { shape: "path", d: "M160 159 L165 169 L170 159 Z", tone: "soft" },
        { shape: "text", x: 176, y: 165, content: "P", anchor: "start" },
        { shape: "line", x1: 165, y1: 116, x2: 187, y2: 74, tone: "accent" },
        { shape: "path", d: "M181 74 L187 74 L185 82 Z", tone: "accent" },
        { shape: "text", x: 193, y: 74, content: "R", anchor: "start" },
        { shape: "text", x: 250, y: 168, content: "θ", anchor: "middle" },
        { shape: "text", x: 45, y: 58, content: "A", anchor: "end" },
        { shape: "text", x: 283, y: 178, content: "B", anchor: "start" },
      ],
      hotspots: [
        { id: "system", number: 1, label: "Le système S", detail: "Le solide étudié, assimilé à son centre d’inertie G. C’est sur lui qu’on fait le bilan des forces.", x: 165, y: 116 },
        { id: "weight", number: 2, label: "Le poids P", detail: "Vertical, dirigé vers le bas, de valeur P = m·g. C’est la seule force qui travaille pendant la descente.", x: 165, y: 150 },
        { id: "reaction", number: 3, label: "La réaction R", detail: "Perpendiculaire au plan (car il n’y a pas de frottement). Son travail est nul et sa projection sur la pente est nulle.", x: 182, y: 92 },
        { id: "angle", number: 4, label: "L’angle θ", detail: "L’inclinaison du plan par rapport à l’horizontale. C’est lui qui fixe la part du poids le long de la pente : m·g·sinθ.", x: 250, y: 168 },
        { id: "axis", number: 5, label: "La ligne de plus grande pente (A, x)", detail: "L’axe de projection, orienté de A vers B (vers le bas). En projetant le TCI dessus : m·g·sinθ = m·a, d’où a = g·sinθ.", x: 115, y: 118 },
      ],
    },
    questions: [
      choice("Sur un plan incliné sans frottement, l’accélération du solide vaut :", ["a = g·sinθ", "a = g·cosθ", "a = g", "a = m·g·sinθ"], 0, "La projection du TCI sur la pente donne a = g·sinθ.", "Exercice 3, question 2", 2),
      choice("De quoi l’accélération sur le plan incliné lisse dépend-elle ?", ["De g et de l’angle θ seulement", "De la masse du solide", "De la longueur du plan", "De la vitesse initiale"], 0, "a = g·sinθ ne contient ni m ni ℓ : indépendante de la masse.", "Exercice 3, question 2", 2),
      short("Pour θ = 30° et g = 10 m·s⁻², combien vaut l’accélération (en m·s⁻²) ?", ["5", "5 m/s2", "5 m·s-2", "a=5"], "a = 10 × sin30° = 10 × 0,5 = 5 m·s⁻².", "Exercice 3, question 3", 2),
      choice("Quelle est l’expression de la vitesse V_B en bas du plan (départ sans vitesse) ?", ["V_B = √(2gℓsinθ)", "V_B = 2gℓsinθ", "V_B = √(gℓ)", "V_B = g·sinθ"], 0, "Le TEC entre A et B : ½mV²_B = m·g·ℓ·sinθ.", "Situation d’évaluation, question 4", 2),
    ],
    corrections: [
      "Page 4, calcul de V_B : le document écrit « V_B = √(2·10·2·0,5) = 4,5 m/s² ». La valeur ≈ 4,5 est correcte, mais l’unité d’une vitesse est le mètre par seconde (m·s⁻¹), pas le m·s⁻². L’unité a été rétablie.",
    ],
  },
  {
    id: "free-fall-vertical",
    title: "Chute libre et mouvement vertical",
    summary: "Deux théorèmes sur un mouvement vertical : en chute libre a = g, et v² = 2gh après une hauteur h.",
    pages: "4-5",
    section: "Exercices 1 et 2",
    durationMinutes: 14,
    xp: 80,
    body: String.raw`## La chute libre

Un solide en **chute libre** n’est soumis qu’à son poids. Le TCI donne aussitôt :

$$m\,\vec{g} = m\,\vec{a} \;\Longrightarrow\; \boxed{\vec{a} = \vec{g}}$$

L’accélération est celle de la pesanteur, **indépendante de la masse**. Après une chute d’une hauteur $h$ (sans vitesse initiale), le TEC donne :

$$\tfrac{1}{2}m v^2 = m\,g\,h \;\Longrightarrow\; \boxed{v^2 = 2\,g\,h}$$

> **À retenir.** Ces **deux théorèmes**, qui ne s’appliquent que dans **des référentiels galiléens**, sont les plus utilisés en mécanique : le **TCI** donne l’accélération $\vec a = \vec g$, le **TEC** donne la vitesse $v = \sqrt{2gh}$.

## Un solide lancé vers le haut

Pendant la **montée**, le solide n’est encore soumis qu’à son poids : son accélération reste $\vec{a} = \vec{g}$, dirigée **vers le bas**.

> **Le point clé (Exercice 2).** Pendant la montée, le vecteur-accélération $\vec{a}$ a **le même sens que $\vec{g}$** (vers le bas) — donc **opposé** au vecteur-vitesse $\vec{v}$ (qui pointe vers le haut). C’est pour cela que la vitesse **diminue** : le mouvement est rectiligne uniformément **retardé**.`,
    keyPoint: "Chute libre : a = g (TCI) et v² = 2gh (TEC). En montée, a garde le sens de g, opposé à v : la vitesse diminue.",
    example: "Après une chute de hauteur h sans vitesse initiale : v = √(2gh). La courbe v² = 2gh est une droite de pente 2g.",
    methodSteps: [
      "En chute libre, écris le TCI : m·g = m·a, donc a = g.",
      "Applique le TEC entre le départ et l’arrivée : ½mv² = mgh.",
      "Simplifie par m : v² = 2gh, puis v = √(2gh).",
      "En montée, note que a garde le sens de g (vers le bas) : la vitesse diminue.",
    ],
    interaction: {
      kind: "curve",
      eyebrow: "Visualiser",
      title: "La relation v² = 2gh",
      instruction: "Déplace le point le long de la courbe : lis v² en fonction de la hauteur de chute h.",
      observation: "v² = 2gh est une droite passant par l’origine, de pente 2g = 20 (avec g = 10 m·s⁻²). Doubler la hauteur double v², donc multiplie la vitesse par √2.",
      formula: "v² = 2·g·h (g = 10 m·s⁻²)",
      formulaTex: "v^2 = 2\\,g\\,h",
      rule: { kind: "linear", coefficient: 20, constant: 0 },
      window: { xMin: 0, xMax: 5, yMin: 0, yMax: 100 },
      marker: { min: 0, max: 5, step: 0.5, initial: 2 },
    },
    questions: [
      choice("En chute libre, quel théorème montre que a = g ?", ["Le théorème du centre d’inertie", "Le théorème de l’énergie cinétique", "Le principe d’inertie seul", "La loi de Coulomb"], 0, "m·g = m·a ⇒ a = g.", "Exercice 1", 2),
      choice("Après une chute d’une hauteur h sans vitesse initiale, quelle relation donne la vitesse ?", ["v² = 2gh", "v = 2gh", "v² = gh", "v = g·h"], 0, "Le TEC : ½mv² = mgh ⇒ v² = 2gh.", "Exercice 1", 2),
      choice("Un solide est lancé verticalement vers le haut. Pendant la montée, son vecteur-accélération a :", ["a le même sens que g (vers le bas)", "a le même sens que la vitesse", "est un vecteur nul", "est horizontal"], 0, "Seul le poids agit : a = g, opposé à la vitesse, d’où le ralentissement.", "Exercice 2", 2),
      choice("Les théorèmes du centre d’inertie et de l’énergie cinétique s’appliquent uniquement dans…", ["des référentiels galiléens", "le référentiel de l’élève", "un référentiel en rotation", "n’importe quel référentiel"], 0, "C’est leur condition d’application.", "Exercice 1", 1),
    ],
  },
  {
    id: "vehicle-slope-mission",
    title: "Mission finale : le véhicule en panne dans la côte",
    summary: "Une situation complète avec frottements : combiner TCI et TEC pour trouver la force de frottement et la distance d’arrêt.",
    pages: "6-8",
    section: "Exercice 4 (situation complexe)",
    durationMinutes: 20,
    xp: 95,
    kind: "challenge",
    body: String.raw`## L’énoncé

Un véhicule de masse $m = 800\ \text{kg}$ tombe en panne au sommet $O$ d’une côte de longueur $\ell = 500\ \text{m}$ inclinée de $\alpha = 20°$. Le frein se desserre : il **descend** $OA$ et arrive en $A$ (bas de la côte) à $v_A = 15\ \text{m·s}^{-1}$, en mouvement **rectiligne uniformément varié**. Puis il **ralentit** sur le tronçon horizontal $AB$ jusqu’à s’arrêter en $B$. La force de frottement $\vec{f}$, constante, est parallèle à la route et opposée à la vitesse. On donne $g = 9{,}8\ \text{m·s}^{-2}$.

**On cherche la force de frottement $f$ et la distance $d = AB$.**

## Phase OA — la descente (deux expressions de l’accélération)

Comme le mouvement est **rectiligne uniformément varié** :

$$a_x = \frac{v_A^2 - v_0^2}{2\,\ell} = \frac{15^2 - 0}{2 \times 500} = 0{,}225\ \text{m·s}^{-2}$$

Le TCI projeté sur la descente donne une **deuxième** expression :

$$m\,g\sin\alpha - f = m\,a_x \;\Longrightarrow\; f = m\,(g\sin\alpha - a_x)$$

$$f = 800 \times (9{,}8 \times \sin 20° - 0{,}225) \approx \boxed{2\,501{,}4\ \text{N}}$$

> Le **théorème de l’énergie cinétique** entre $O$ et $A$ redonne exactement la même valeur — deux chemins, un seul résultat.

## Phase AB — le freinage jusqu’à l’arrêt

Sur l’horizontale, le poids et la réaction ne travaillent pas ; seul le frottement freine. Le TEC entre $A$ ($v_A$) et $B$ ($v = 0$) :

$$0 - \tfrac{1}{2}m v_A^2 = -f\cdot d \;\Longrightarrow\; d = \frac{m\,v_A^2}{2\,f} = \frac{800 \times 15^2}{2 \times 2\,501{,}4} \approx \boxed{36\ \text{m}}$$

> **Le geste attendu au BAC.** Chaque phase a **son** bilan de forces et **son** théorème : le TCI (ou le MRUV) pour la descente, le TEC pour le freinage. On relie les deux par la vitesse $v_A$ commune au point $A$.`,
    keyPoint: "Situation complète : phase OA (MRUV, f = m(g·sinα − a_x)) puis phase AB (TEC, d = m·v_A²/2f). La vitesse v_A relie les deux phases.",
    example: "f = 800×(9,8·sin20° − 0,225) ≈ 2501,4 N ; d = 800×15²/(2×2501,4) ≈ 36 m.",
    methodSteps: [
      "Système : le véhicule ; référentiel terrestre supposé galiléen.",
      "Phase OA : bilan P, R_N, f ; a_x = (v_A²−v_0²)/(2ℓ) puis a_x = g·sinα − f/m.",
      "En égalant : f = m(g·sinα − a_x).",
      "Phase AB : TEC (seul f travaille) : d = m·v_A²/(2f).",
    ],
    interaction: {
      kind: "schema",
      eyebrow: "Situer les forces",
      title: "Le véhicule : descente OA puis freinage AB",
      instruction: "Sélectionne un repère pour suivre les deux phases et leurs forces.",
      observation: "Sur OA (descente), le poids fait avancer et le frottement freine. Sur AB (horizontale), seul le frottement agit dans la direction du mouvement : le véhicule s’arrête.",
      caption: "Figure redessinée d’après le document officiel : le trajet O→A→B et les forces sur le véhicule.",
      viewBox: "0 0 360 210",
      shapes: [
        { shape: "line", x1: 55, y1: 60, x2: 205, y2: 160, tone: "accent" },
        { shape: "line", x1: 205, y1: 160, x2: 330, y2: 160, tone: "accent" },
        { shape: "line", x1: 55, y1: 160, x2: 205, y2: 160, tone: "muted" },
        { shape: "line", x1: 55, y1: 60, x2: 55, y2: 160, tone: "muted" },
        { shape: "path", d: "M112 92 L140 92 L140 110 L112 110 Z", tone: "fill" },
        { shape: "line", x1: 126, y1: 101, x2: 126, y2: 150, tone: "soft" },
        { shape: "path", d: "M121 141 L126 151 L131 141 Z", tone: "soft" },
        { shape: "text", x: 137, y: 148, content: "P", anchor: "start" },
        { shape: "line", x1: 126, y1: 100, x2: 150, y2: 84, tone: "accent" },
        { shape: "path", d: "M144 84 L150 84 L149 92 Z", tone: "accent" },
        { shape: "text", x: 156, y: 82, content: "R", anchor: "start" },
        { shape: "line", x1: 122, y1: 104, x2: 92, y2: 84, tone: "outline" },
        { shape: "path", d: "M92 84 L100 84 L96 92 Z", tone: "outline" },
        { shape: "text", x: 82, y: 82, content: "f", anchor: "end" },
        { shape: "text", x: 50, y: 56, content: "O", anchor: "end" },
        { shape: "text", x: 205, y: 176, content: "A", anchor: "middle" },
        { shape: "text", x: 332, y: 176, content: "B", anchor: "start" },
        { shape: "text", x: 240, y: 154, content: "α", anchor: "middle" },
      ],
      hotspots: [
        { id: "point-o", number: 1, label: "Le sommet O", detail: "Le véhicule tombe en panne au sommet de la côte, à l’altitude la plus haute. Départ sans vitesse (v₀ = 0).", x: 55, y: 60 },
        { id: "phase-oa", number: 2, label: "La phase OA (descente)", detail: "Mouvement rectiligne uniformément varié : le poids fait descendre, le frottement freine. On y calcule l’accélération de deux façons.", x: 130, y: 101 },
        { id: "friction", number: 3, label: "Le frottement f", detail: "Force constante, parallèle à la route et opposée à la vitesse. Sur la descente, elle est dirigée vers le haut de la pente (elle freine).", x: 100, y: 90 },
        { id: "point-a", number: 4, label: "Le point A (bas de la côte)", detail: "Le véhicule y arrive à v_A = 15 m·s⁻¹. Cette vitesse relie la phase OA et la phase AB.", x: 205, y: 160 },
        { id: "phase-ab", number: 5, label: "La phase AB (freinage)", detail: "Sur l’horizontale, le poids et la réaction ne travaillent pas. Seul le frottement agit : le véhicule ralentit et s’arrête en B après d = 36 m.", x: 268, y: 160 },
      ],
    },
    questions: [
      choice("Sur la descente OA, quelle est l’expression de la force de frottement ?", ["f = m(g·sinα − a_x)", "f = m·g·sinα", "f = m·a_x", "f = m·g·cosα"], 0, "Le TCI projeté : m·g·sinα − f = m·a_x, d’où f = m(g·sinα − a_x).", "Exercice 4, question 3.2", 3),
      short("Sur OA (MRUV), a_x = (v_A² − v_0²)/(2ℓ). Avec v_A = 15 m·s⁻¹ et ℓ = 500 m, combien vaut a_x (en m·s⁻²) ?", ["0,225", "0.225", "0,225 m/s2", "a=0,225"], "a_x = 15²/(2×500) = 225/1000 = 0,225 m·s⁻².", "Exercice 4, question 4.1", 2),
      choice("Sur le tronçon horizontal AB, quelles forces travaillent ?", ["Seul le frottement", "Le poids et la réaction", "Toutes les forces", "Aucune force"], 0, "Le poids et la réaction sont perpendiculaires au déplacement : seul f travaille.", "Exercice 4, question 4.3", 2),
      choice("Quelle est l’expression de la distance d’arrêt d = AB (TEC) ?", ["d = m·v_A² / (2f)", "d = 2f / (m·v_A²)", "d = f·v_A", "d = m·v_A / f"], 0, "0 − ½m·v_A² = −f·d ⇒ d = m·v_A²/(2f) ≈ 36 m.", "Exercice 4, question 4.3", 3),
    ],
  },
];

const builtLevels = levels.map((seed, index) => officialLevel(index, seed));

export const inertiaMotionPath: LearningPath = {
  id: "terminale-cd-inertia-motion",
  subjectId: "physics-chemistry",
  levelIds: ["terminale-c", "terminale-d"],
  curriculumLabel: "Programme ivoirien • Terminale C et D • Côte d’Ivoire École Numérique",
  curriculumSourceUrl: "https://www.ecole-ci.online/",
  theme: { number: 1, title: "Mécanique" },
  chapterNumber: 2,
  title: "Mouvement du centre d’inertie d’un solide",
  description: "Définir un référentiel galiléen, relier accélération et forces par le théorème du centre d’inertie, et calculer des vitesses par le théorème de l’énergie cinétique.",
  estimatedMinutes: builtLevels.reduce((total, lesson) => total + lesson.durationMinutes, 0),
  outcomes: [
    "Reconnaître un référentiel galiléen et énoncer le principe de l’inertie.",
    "Appliquer le théorème du centre d’inertie pour déterminer une accélération.",
    "Appliquer le théorème de l’énergie cinétique pour déterminer une vitesse.",
    "Traiter une situation complète avec frottements en combinant les deux théorèmes.",
  ],
  modules: [{
    id: "inertia-motion-mastery",
    title: "Maîtriser le mouvement du centre d’inertie",
    description: "Des référentiels galiléens à la situation du véhicule en panne, un niveau après l’autre.",
    lessons: builtLevels,
  }],
};

export const inertiaMotionPaths: LearningPath[] = [inertiaMotionPath];
