import type {
  CourseActivity,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonQuestion,
  LessonSourceMetadata,
} from "../domain/paths";

const pathId = "terminale-french-l2-literary-dissertation";
const rawWeights = [40, 55, 60, 65, 70, 80, 75, 95] as const;
const progressionTitle = "Français — Progressions à usage pédagogique 2025-2026, second cycle, DPFC";
const bacTitle = "Baccalauréat 2025 — Français A-B-C-D-E-H — Dissertation littéraire et corrigé national";
type SourceDocument = "progression" | "bac" | "both";

function source(
  pages: string,
  section: string,
  fidelity: LessonSourceMetadata["fidelity"] = "adapted",
  corrections: string[] = [],
  document: SourceDocument = "bac",
): LessonSourceMetadata {
  const documentTitle = document === "progression"
    ? progressionTitle
    : document === "bac"
      ? bacTitle
      : `${progressionTitle} ; ${bacTitle}`;
  return {
    documentTitle,
    pages,
    section,
    fidelity,
    corrections,
  };
}

function q(
  prompt: string,
  options: [string, string, string, string],
  correctIndex: number,
  explanation: string,
  sourceLabel: string,
): LessonQuestion {
  return { prompt, options, correctIndex, explanation, sourceLabel, points: 1 };
}

interface FrenchLessonSeed {
  suffix: string;
  title: string;
  summary: string;
  durationMinutes: number;
  kind: LearningLesson["kind"];
  eyebrow: string;
  conceptTitle: string;
  explanation: string;
  bodyMarkdown: string;
  keyPoint: string;
  example: string;
  interaction: LessonInteraction;
  method: LearningLesson["method"];
  questions: [LessonQuestion, LessonQuestion, LessonQuestion, LessonQuestion];
  activities: CourseActivity[];
  source: LessonSourceMetadata;
}

const lessons: FrenchLessonSeed[] = [
  {
    suffix: "overview-barreme",
    title: "Comprendre l’épreuve et le barème",
    summary: "Voir ce que la dissertation demande, comment la copie est évaluée et dans quel ordre travailler.",
    durationMinutes: 14,
    kind: "concept",
    eyebrow: "Partie 1 • Vue d’ensemble",
    conceptTitle: "Une démonstration littéraire, pas une récitation",
    explanation: "La dissertation explique une opinion sur la littérature, la discute et l’éprouve à l’aide d’œuvres précises. Le correcteur juge la méthode, les idées, leur enchaînement, la langue et le soin.",
    bodyMarkdown: String.raw`## Ce que signifie « disserter »

Une dissertation littéraire répond à une question portant sur la littérature. Elle ne consiste ni à réciter un cours, ni à aligner des titres d’œuvres. Elle doit **comprendre le sujet**, construire une problématique, organiser des arguments, expliquer des œuvres et aboutir à une réponse nuancée.

## Le sujet BAC 2025 qui guidera ce cours

L’écrivain français Henri Queffélec, dans le journal littéraire et artistique *Les Nouvelles littéraires* paru le 16 janvier 1961, affirme : « L’œuvre littéraire se crée, comme toute chose en ce monde, à partir de matériaux empruntés à la vie. »

La consigne demande d’**expliquer et discuter** cette opinion en s’appuyant sur des œuvres lues ou étudiées.

## Le barème national exact sur 20

| Partie évaluée | Points | Lecture pédagogique |
|---|---:|---|
| Introduction | **3** | Généralités, insertion du sujet, problématique ou annonce du plan |
| Développement | **12** | Méthode 2 ; pertinence des idées 6 ; cohérence 2 ; langue 2 |
| Conclusion | **3** | Bilan, opinion personnelle, ouverture facultative |
| Présentation et soin | **2** | Lisibilité, paragraphes, propreté |

> **Précision.** Le document attribue 3 points globalement à l’introduction et 3 à la conclusion. Il ne donne pas un découpage automatique « 1 + 1 + 1 ».

> **Repère de numérotation.** La progression DPFC nomme cette séquence « Leçon 1 d’Expression écrite ». « Leçon 2 » est seulement sa place dans le catalogue aplati d’Excellence, après l’étude de l’œuvre narrative.

## Une gestion simple des quatre heures

- **45 à 60 min** : analyser, chercher les idées et bâtir le plan ;
- **2 h 15 à 2 h 30** : rédiger ;
- **20 à 30 min** : relire le raisonnement, la langue et la présentation.

Ce partage est un repère pédagogique Excellence, pas une prescription nationale.`,
    keyPoint: "Comprendre → problématiser → organiser → rédiger → relire.",
    example: "Un titre d’œuvre ne rapporte rien à lui seul : il faut expliquer précisément ce que l’exemple prouve.",
    interaction: {
      kind: "timeline",
      eyebrow: "La copie de bout en bout",
      title: "Les cinq temps du travail",
      instruction: "Ouvre chaque étape pour comprendre son rôle.",
      items: [
        { label: "Analyser", detail: "Décomposer la citation, les verbes de consigne et les limites du sujet." },
        { label: "Problématiser", detail: "Transformer l’opinion proposée en question réellement discutable." },
        { label: "Construire", detail: "Choisir les axes, arguments, œuvres et transitions." },
        { label: "Rédiger", detail: "Faire progresser une démonstration claire de l’introduction à la conclusion." },
        { label: "Relire", detail: "Contrôler méthode, pertinence, cohérence, langue et soin selon le barème." },
      ],
      observation: "Une copie réussie est préparée avant d’être rédigée : le brouillon évite le hors-sujet et les exemples plaqués.",
    },
    method: {
      eyebrow: "Réflexe BAC",
      title: "Lire le sujet comme une mission",
      introduction: "Avant toute idée, repère ce que tu dois faire et sur quoi tu dois le faire.",
      steps: [
        "Entoure les verbes de consigne.",
        "Souligne les mots-clés de l’opinion.",
        "Reformule la thèse en une phrase simple.",
        "Note la question à laquelle ta copie devra répondre.",
      ],
      example: {
        prompt: "« Expliquez et discutez cette opinion. »",
        work: "Expliquer = montrer pourquoi elle est défendable ; discuter = en éprouver les limites.",
        result: "Justifier l’ancrage réel, puis montrer que la création ne se réduit pas à une copie du réel.",
      },
      tip: "Le barème récompense surtout la pertinence des idées : six points sur vingt.",
    },
    questions: [
      q("Combien de points le développement vaut-il ?", ["12 points", "10 points", "8 points", "14 points"], 0, "Le développement vaut 12 points sur 20.", "Barème national · p.10"),
      q("Quel élément est facultatif dans la conclusion ?", ["Le bilan", "L’ouverture", "L’opinion personnelle", "La réponse au problème"], 1, "Le corrigé précise que l’ouverture est facultative.", "Corrigé national · p.9-10"),
      q("Quelle rubrique du développement vaut le plus ?", ["La langue", "La cohérence", "La pertinence des idées", "La méthode"], 2, "La pertinence des idées vaut 6 points.", "Barème national · p.10"),
      q("Quel travail doit précéder la rédaction ?", ["La conclusion définitive", "Une liste de citations", "Le choix d’une ouverture", "L’analyse et le plan au brouillon"], 3, "Le brouillon sécurise le sens et l’organisation.", "Progression DPFC · Terminale A p.12 ; C/D p.15"),
    ],
    activities: [
      {
        id: "complete-dissertation-sequence",
        kind: "ordering",
        title: "Remets le travail dans l’ordre",
        instruction: "Déplace les opérations pour reconstruire une démarche efficace.",
        sourceLabel: "Progression DPFC · synthèse des séances",
        items: [
          { id: "write", label: "Rédiger", detail: "Transformer le plan détaillé en paragraphes reliés." },
          { id: "analyze", label: "Analyser", detail: "Comprendre les termes et la consigne." },
          { id: "review", label: "Relire", detail: "Contrôler fond, langue et présentation." },
          { id: "plan", label: "Élaborer le plan", detail: "Ordonner axes, arguments et exemples." },
          { id: "ideas", label: "Rechercher les idées", detail: "Mobiliser des œuvres pertinentes." },
        ],
        correctOrder: ["analyze", "ideas", "plan", "write", "review"],
        explanation: "On comprend la mission, puis on trouve la matière, on l’ordonne, on rédige et on relit.",
      },
    ],
    source: source(
      "Progression p.12 et p.15 ; sujet p.3 ; barème p.10",
      "Progression de la dissertation, sujet Queffélec et barème national",
      "adapted",
      ["Le partage du temps est une recommandation Excellence.", "La carte 2 d’Excellence correspond à la leçon 1 d’Expression écrite dans la progression DPFC."],
      "both",
    ),
  },
  {
    suffix: "analyze-subject",
    title: "Analyser précisément le sujet",
    summary: "Décomposer la citation, comprendre « expliquer et discuter », définir les mots et poser les limites.",
    durationMinutes: 17,
    kind: "concept",
    eyebrow: "Partie 2 • Comprendre",
    conceptTitle: "Faire parler chaque mot avant de chercher des idées",
    explanation: "Le sujet combine une opinion, des notions et une consigne. L’analyse doit préserver le sens de Queffélec sans réduire la littérature à un miroir passif.",
    bodyMarkdown: String.raw`## La fiche d’identité du sujet

- **Auteur** : Henri Queffélec ;
- **opinion** : l’œuvre se crée à partir de matériaux empruntés à la vie ;
- **consigne** : expliquer puis discuter ;
- **preuves attendues** : des œuvres lues ou étudiées.

## Définir les mots dans ce contexte

| Expression | Sens utile |
|---|---|
| **œuvre littéraire** | création écrite qui travaille la langue et produit un univers |
| **se crée** | résulte d’un travail de sélection, d’organisation et de transformation |
| **matériaux** | faits, situations, personnages, milieux, espaces, émotions, conflits |
| **empruntés à la vie** | tirés de l’expérience sociale, historique, culturelle, politique ou individuelle |

> **Interprétation Excellence.** Le mot **matériaux** peut se lire comme une métaphore d’artisan : l’écrivain reçoit une matière, puis la sélectionne, l’organise et la transforme. Le corrigé national définit plus directement ces matériaux comme des événements, faits, situations, personnages et espaces.

## Comprendre les deux verbes

- **Expliquer** : rendre l’opinion intelligible et montrer comment la littérature puise dans la réalité.
- **Discuter** : examiner sa portée, lui opposer des limites et construire une réponse nuancée.

> **Erreur fréquente.** « Discuter » ne signifie pas contredire systématiquement. Il faut reconnaître ce que la thèse éclaire, puis ce qu’elle ne suffit pas à expliquer.

## Reformulation fidèle

> Les écrivains utilisent souvent des éléments du monde vécu pour créer leurs œuvres. Mais la création littéraire se contente-t-elle de reproduire ce réel ?

Cette formulation ouvre la tension entre **ancrage dans la vie** et **invention artistique**.`,
    keyPoint: "Expliquer défend la thèse ; discuter en montre la portée et les limites.",
    example: "« Matériaux » désigne les faits, personnages, espaces et expériences que l’écrivain transforme en œuvre.",
    interaction: {
      kind: "diagram",
      eyebrow: "Radiographie du sujet",
      title: "Quatre éléments à ne pas confondre",
      instruction: "Sélectionne chaque carte pour voir ce qu’elle commande.",
      rootLabel: "Sujet Queffélec",
      rootDetail: "Une opinion sur la relation entre réalité et création littéraire.",
      nodes: [
        { id: "opinion", label: "L’opinion", role: "Ce qui est affirmé", detail: "L’œuvre prend sa matière dans la vie.", group: "Sujet" },
        { id: "explain", label: "Expliquer", role: "Rendre la thèse solide", detail: "Montrer les faits qui alimentent l’œuvre.", group: "Consigne" },
        { id: "discuss", label: "Discuter", role: "Tester la limite", detail: "Montrer l’invention des histoires, personnages, espaces et formes.", group: "Consigne" },
        { id: "evidence", label: "Les œuvres", role: "Apporter les preuves", detail: "Nommer, situer et relier chaque exemple à l’argument.", group: "Preuves" },
      ],
      observation: "Oublier un verbe de consigne produit une copie incomplète.",
    },
    method: {
      eyebrow: "Méthode d’analyse",
      title: "Quatre lignes de brouillon",
      introduction: "Une analyse sûre tient en quatre opérations.",
      steps: [
        "Écris la thèse avec tes propres mots.",
        "Définis les notions dans leur contexte.",
        "Traduis chaque verbe en une tâche.",
        "Formule la limite qui rend l’opinion discutable.",
      ],
      example: {
        prompt: "Queffélec dit-il que l’œuvre copie la vie ?",
        work: "Non : « matériaux » suppose une matière ensuite travaillée.",
        result: "La vie fournit des éléments ; l’écrivain les sélectionne et les transforme.",
      },
      tip: "Transforme toujours la consigne en actions concrètes.",
    },
    questions: [
      q("Que désigne surtout « matériaux » ?", ["Le papier et l’encre", "Des faits, personnages, situations et espaces", "Seulement la biographie", "Seulement l’histoire"], 1, "Le corrigé donne au mot un sens large.", "Corrigé national · p.4"),
      q("Que demande « discuter » ?", ["Refuser l’opinion", "Raconter une dispute", "Examiner sa portée et ses limites", "Donner seulement son avis"], 2, "Discuter consiste à éprouver une thèse.", "Consigne officielle · p.3"),
      q("Quelle reformulation respecte le sujet ?", ["La littérature prend matière dans la vie, mais transforme-t-elle aussi ce réel ?", "Toute littérature est autobiographique.", "Les écrivains mentent-ils ?", "La vie est-elle une œuvre ?"], 0, "Elle conserve les deux enjeux.", "Analyse dérivée · sujet p.3"),
      q("Pourquoi « matériaux » est-il une métaphore utile ?", ["Le livre est en béton", "Le réel interdit l’imagination", "L’auteur doit copier", "Une matière peut être sélectionnée et transformée"], 3, "La métaphore unit source réelle et travail créateur.", "Interprétation Excellence fondée sur le corrigé p.4"),
    ],
    activities: [
      {
        id: "subject-elements-sort",
        kind: "categorize",
        title: "Classe les éléments du sujet",
        instruction: "Associe chaque formulation à sa fonction.",
        sourceLabel: "Sujet officiel · p.3 ; corrigé · p.4",
        groups: [
          { id: "opinion", label: "Thèse à expliquer" },
          { id: "task", label: "Tâche demandée" },
          { id: "evidence", label: "Preuve attendue" },
        ],
        items: [
          { id: "life", label: "L’œuvre emprunte ses matériaux à la vie.", correctGroupId: "opinion", explanation: "C’est le contenu de la citation." },
          { id: "explain", label: "Rendre l’opinion intelligible et la justifier.", correctGroupId: "task", explanation: "C’est le rôle d’« expliquez »." },
          { id: "limits", label: "En éprouver les limites.", correctGroupId: "task", explanation: "C’est le rôle de « discutez »." },
          { id: "works", label: "Des œuvres lues ou étudiées.", correctGroupId: "evidence", explanation: "La consigne impose ces appuis." },
        ],
      },
    ],
    source: source("Sujet p.3 ; corrigé p.4", "Analyse de la citation et de la consigne, complétée par une interprétation pédagogique", "adapted"),
  },
  {
    suffix: "find-ideas",
    title: "Rechercher des idées et des œuvres",
    summary: "Construire une banque d’arguments puis relier chaque œuvre à ce qu’elle prouve.",
    durationMinutes: 22,
    kind: "practice",
    eyebrow: "Partie 3 • Chercher",
    conceptTitle: "Un exemple vaut par le lien qu’on explique",
    explanation: "Le corrigé propose six familles pour l’ancrage dans la vie, puis quatre familles pour l’invention. Trois arguments bien développés suffisent largement pour étayer la thèse.",
    bodyMarkdown: String.raw`## Axe I — La vie fournit la matière de l’œuvre

| Famille | Ce qu’il faut montrer | Exemple vérifié |
|---|---|---|
| Faits sociaux | L’œuvre représente les problèmes d’une société | *L’Ordonnance* : pauvreté et accès difficile aux soins |
| Faits historiques | La fiction conserve ou interroge l’histoire | *Racines* d’Alex Haley : traite et esclavage |
| Faits culturels | Elle traite des pratiques et conflits culturels | *Rebelle* de Fatou Keïta ; *Les Soleils des indépendances* d’Ahmadou Kourouma |
| Faits politiques | Elle représente ou critique le pouvoir | *On se chamaille pour un siège* de Hyacinthe Kakou |
| Personnages réels | Une figure historique devient matière littéraire | Patrice Lumumba dans *Une saison au Congo* d’Aimé Césaire |
| Espaces réels | Le décor s’inspire d’un espace identifiable | Des villes ou régions réelles retravaillées par le récit |

## Axe II — L’œuvre invente et transforme

| Famille | Ce qu’il faut montrer | Exemple vérifié |
|---|---|---|
| Histoire inventée | L’auteur construit un monde inexistant | *La Planète des singes* de Pierre Boulle |
| Personnage imaginaire | Un être fictif porte une idée | Pangloss dans *Candide* de Voltaire |
| Espace fictif | Le lieu est créé pour le récit | L’astéroïde B612 dans *Le Petit Prince* |
| Travail esthétique | La forme et la langue transforment la matière | Calligrammes d’Apollinaire ; langue malinkisée de Kourouma |

> **Formule utile :** œuvre + élément précis + lien avec l’argument.

« Dans *Rebelle*, il y a l’excision » est trop faible. Mieux : « En représentant l’excision et le mariage forcé, Fatou Keïta transforme des pratiques sociales réelles en matière romanesque et critique. »

> **Corrections bibliographiques.** Le titre correct est *Les Soleils des indépendances*. La lecture manuscrite « La fresque d’Ébinto » est rétablie en *Les Frasques d’Ebinto*. Les références illisibles ne sont pas reproduites.`,
    keyPoint: "Un argument affirme ; une œuvre prouve ; l’explication relie les deux.",
    example: "B612 n’est pas seulement un nom : cet espace fictif prouve que l’écrivain crée aussi des lieux absents du réel.",
    interaction: {
      kind: "diagram",
      eyebrow: "Banque d’arguments",
      title: "Deux grandes familles de preuves",
      instruction: "Explore les cartes, puis choisis les exemples que tu maîtrises.",
      rootLabel: "Vie ↔ création",
      rootDetail: "La littérature puise dans le réel tout en construisant un univers autonome.",
      nodes: [
        { id: "social-history", label: "Société et histoire", role: "Réel collectif", detail: "Pauvreté, esclavage, indépendances, pouvoir et conflits sociaux.", group: "Emprunt" },
        { id: "culture-people", label: "Culture et personnes", role: "Réel vécu", detail: "Pratiques culturelles, figures historiques et expériences individuelles.", group: "Emprunt" },
        { id: "fiction", label: "Histoires et êtres fictifs", role: "Invention", detail: "Intrigues, personnages et événements imaginés.", group: "Transformation" },
        { id: "space-style", label: "Espaces et formes", role: "Création esthétique", detail: "Lieux fictifs, images, rythmes, calligrammes et travail de la langue.", group: "Transformation" },
      ],
      observation: "Le meilleur exemple n’est pas le plus célèbre : c’est celui que tu peux expliquer exactement.",
    },
    method: {
      eyebrow: "Brouillon efficace",
      title: "La matrice argument–œuvre–preuve",
      introduction: "Construis une réserve d’idées avant de sélectionner ton plan.",
      steps: [
        "Écris une idée en une phrase.",
        "Choisis une œuvre que tu connais réellement.",
        "Note un élément précis de cette œuvre.",
        "Explique en quoi cet élément confirme l’idée.",
      ],
      example: {
        prompt: "La littérature invente des espaces.",
        work: "Le héros du Petit Prince vient de l’astéroïde fictif B612.",
        result: "L’exemple prouve que la création peut s’éloigner des espaces réels.",
      },
      tip: "Garde trois arguments solides par axe plutôt que six titres sans explication.",
    },
    questions: [
      q("Combien d’arguments suffisent largement pour étayer la thèse ?", ["Un", "Trois", "Six obligatoires", "Dix"], 1, "Le corrigé le précise explicitement.", "Corrigé national · p.7"),
      q("Quel exemple illustre un espace fictif ?", ["Patrice Lumumba", "La traite", "L’astéroïde B612", "L’excision"], 2, "B612 est inventé dans Le Petit Prince.", "Corrigé national · p.8-9"),
      q("Quel lien est juste ?", ["Racines → traite et esclavage", "Candide → biographie exacte", "Calligrammes → espace réel", "B612 → personnage historique"], 0, "Racines transforme une réalité historique en matière romanesque.", "Corrigé national · p.5-7"),
      q("Pourquoi une liste de titres est-elle faible ?", ["Elle est toujours trop longue", "Les titres sont interdits", "Elle empêche l’introduction", "Elle n’explique pas ce que chaque œuvre prouve"], 3, "Il faut relier chaque œuvre à l’argument.", "Conseil Excellence fondé sur le critère de pertinence · barème p.10"),
    ],
    activities: [
      {
        id: "arguments-examples-sort",
        kind: "categorize",
        title: "Emprunt au réel ou invention ?",
        instruction: "Classe chaque exemple selon son rôle dans le sujet.",
        sourceLabel: "Corrigé national · p.5-9",
        groups: [
          { id: "reality", label: "Matériau emprunté à la vie" },
          { id: "invention", label: "Écart créateur" },
        ],
        items: [
          { id: "roots", label: "*Racines* et l’esclavage", correctGroupId: "reality", explanation: "Le roman s’appuie sur une histoire collective." },
          { id: "rebel", label: "*Rebelle* et l’excision", correctGroupId: "reality", explanation: "L’œuvre traite de faits sociaux et culturels." },
          { id: "pangloss", label: "Pangloss dans *Candide*", correctGroupId: "invention", explanation: "Le personnage fictif porte une critique." },
          { id: "b612", label: "L’astéroïde B612", correctGroupId: "invention", explanation: "Cet espace est créé par l’auteur." },
          { id: "calligram", label: "Les calligrammes d’Apollinaire", correctGroupId: "invention", explanation: "La disposition transforme le langage." },
          { id: "lumumba", label: "Lumumba dans *Une saison au Congo*", correctGroupId: "reality", explanation: "Une figure historique devient personnage dramatique." },
        ],
      },
    ],
    source: source("Corrigé p.5-9", "Arguments et exemples de la thèse et de l’antithèse", "faithful-corrected", [
      "Titre corrigé en Les Soleils des indépendances.",
      "Lecture bibliographique corrigée en Les Frasques d’Ebinto.",
      "Les références manuscrites indéchiffrables ne sont pas publiées.",
    ]),
  },
  {
    suffix: "build-plan",
    title: "Construire la problématique et le plan",
    summary: "Passer d’une opinion discutable à deux axes cohérents, avec arguments, exemples et transition.",
    durationMinutes: 19,
    kind: "practice",
    eyebrow: "Partie 4 • Organiser",
    conceptTitle: "Le plan répond à une tension, pas à une recette",
    explanation: "Le sujet Queffélec appelle ici un mouvement dialectique : reconnaître l’ancrage dans la vie, puis montrer l’invention. Ce plan convient à ce sujet sans être une règle universelle.",
    bodyMarkdown: String.raw`## Une problématique de travail proposée par Excellence

> **Dans quelle mesure la littérature emprunte-t-elle ses matériaux à la vie, et comment la création lui permet-elle aussi de s’en éloigner ?**

Cette synthèse pédagogique contient la part de vérité de l’opinion, sa limite et le mouvement de la réponse. Le corrigé national propose aussi : « La littérature s’inspire-t-elle toujours de la réalité ? »

## Le plan du corrigé national réorganisé par Excellence

### Axe I — L’œuvre littéraire se nourrit de la vie

1. Les faits sociaux et culturels deviennent matière littéraire.
2. L’histoire et la politique alimentent intrigues et critiques.
3. Les personnes et espaces réels inspirent personnages et décors.

### Transition

Le réel fournit donc une matière essentielle. **Cependant, emprunter n’est pas reproduire** : l’écriture sélectionne, combine, déforme et invente.

### Axe II — L’œuvre construit un univers autonome

1. L’écrivain invente des histoires et des personnages.
2. Il crée des espaces fictifs.
3. Il transforme la matière par le style, la forme et l’imagination.

## Le plan détaillé au brouillon

| Idée | Explication | Œuvre précise | Lien au sujet |
|---|---|---|---|
| La littérature représente des problèmes sociaux | Elle donne une forme sensible au collectif | *L’Ordonnance* | Pauvreté et accès aux soins deviennent matériaux romanesques |

> **Erreur fréquente.** Un axe n’est jamais une liste d’œuvres : les œuvres viennent à l’intérieur d’arguments organisés.`,
    keyPoint: "Problématique = part de vérité + limite ; plan = réponse progressive.",
    example: "I. La vie fournit la matière ; II. l’écriture invente et transforme cette matière.",
    interaction: {
      kind: "timeline",
      eyebrow: "Architecture du raisonnement",
      title: "Le mouvement dialectique",
      instruction: "Parcours le raisonnement jusqu’à la réponse nuancée.",
      items: [
        { label: "Thèse", detail: "La littérature emprunte des matériaux à la vie." },
        { label: "Justification", detail: "Faits sociaux, historiques, culturels et politiques." },
        { label: "Transition", detail: "Emprunter une matière n’équivaut pas à la copier." },
        { label: "Limite", detail: "Histoires, personnages, lieux et formes peuvent être inventés." },
        { label: "Réponse", detail: "La création transforme une matière réelle ou imaginée." },
      ],
      observation: "La transition explique pourquoi le second axe devient nécessaire.",
    },
    method: {
      eyebrow: "Plan détaillé",
      title: "Tester la solidité d’un axe",
      introduction: "Un bon axe est une réponse partielle à la problématique.",
      steps: [
        "Donne à l’axe une phrase-thèse.",
        "Range trois arguments distincts sous cette thèse.",
        "Associe une œuvre expliquée à chaque argument.",
        "Écris la transition qui révèle la limite.",
      ],
      example: {
        prompt: "Comment passer de l’axe I à l’axe II ?",
        work: "Reconnaître le réel comme source, puis distinguer source et copie.",
        result: "Cependant, la vie n’est qu’une matière : l’écriture la sélectionne et la transforme.",
      },
      tip: "Si deux arguments disent la même chose, fusionne-les.",
    },
    questions: [
      q("Quelle problématique est dialectique ?", ["Qu’est-ce qu’un livre ?", "Quels auteurs connaissez-vous ?", "Dans quelle mesure l’œuvre emprunte-t-elle à la vie tout en la transformant ?", "La littérature est-elle bonne ?"], 2, "Elle met en tension ancrage réel et création.", "Analyse dérivée · p.3"),
      q("À quoi sert la transition ?", ["À répéter l’introduction", "À montrer la limite du premier axe et la nécessité du second", "À donner une note", "À annoncer seulement un titre"], 1, "Elle fait progresser la démonstration.", "Corrigé · p.8"),
      q("Quel plan correspond au corrigé ?", ["Réel comme matière → invention et esthétique", "Poésie → théâtre → roman", "Biographie → résumé", "Avantages → conclusion"], 0, "Le corrigé justifie puis nuance.", "Corrigé · p.5-9"),
      q("Pourquoi ce plan n’est-il pas universel ?", ["Deux axes sont faux", "Le plan est interdit", "Les œuvres suffisent", "Chaque sujet possède sa propre tension"], 3, "Le plan se construit à partir du sujet.", "Précision Excellence"),
    ],
    activities: [
      {
        id: "bac-plan-order",
        kind: "ordering",
        title: "Reconstruis le plan raisonné",
        instruction: "Replace les mouvements dans l’ordre.",
        sourceLabel: "Corrigé national · p.5-9",
        items: [
          { id: "invention", label: "Montrer l’invention", detail: "Histoires, personnages, espaces et formes créés." },
          { id: "problem", label: "Poser la tension", detail: "La vie fournit-elle toute la matière ?" },
          { id: "synthesis", label: "Nuancer", detail: "La littérature transforme une matière réelle ou imaginée." },
          { id: "reality", label: "Expliquer l’ancrage réel", detail: "Faits sociaux, historiques, politiques et culturels." },
          { id: "transition", label: "Faire la transition", detail: "Emprunter ne signifie pas copier." },
        ],
        correctOrder: ["problem", "reality", "transition", "invention", "synthesis"],
        explanation: "La copie pose la tension, reconnaît la thèse, en révèle la limite, puis nuance.",
      },
    ],
    source: source("Corrigé p.5-9", "Problématique et plan du corrigé national réorganisés pour l’apprentissage", "adapted", [
      "Le plan dialectique est celui de ce sujet, pas une obligation pour toute dissertation.",
      "La problématique et les regroupements en trois sous-parties par axe sont des adaptations Excellence.",
    ]),
  },
  {
    suffix: "write-introduction",
    title: "Rédiger une introduction",
    summary: "Amener le thème, insérer et reformuler l’opinion, poser la problématique puis annoncer le mouvement.",
    durationMinutes: 20,
    kind: "practice",
    eyebrow: "Partie 5 • Introduire",
    conceptTitle: "Une introduction en un seul mouvement logique",
    explanation: "L’introduction conduit le lecteur du thème général à la question précise que le devoir résoudra. Elle ne commence ni par une réponse définitive ni par une biographie de l’auteur.",
    bodyMarkdown: String.raw`## Les quatre fonctions conseillées par Excellence

1. **Amener le thème** : établir le rapport entre réalité et littérature.
2. **Insérer l’opinion** : présenter Queffélec et sa citation sans la déposer brutalement.
3. **Reformuler** : expliciter que la vie fournit une matière à l’écrivain.
4. **Problématiser et annoncer le plan** : poser la tension, puis le mouvement de la copie.

> **Barème national.** Le document attend les généralités, l’insertion du sujet, puis une **problématique ou une annonce du plan**. Excellence recommande de formuler les deux lorsqu’elles restent brèves et cohérentes ; ce conseil ne crée pas une exigence nationale supplémentaire.

## Modèle expliqué

> Les écrivains observent les sociétés, les événements et les êtres qui les entourent ; leurs œuvres semblent ainsi entretenir un lien étroit avec le monde vécu. C’est dans ce sens qu’Henri Queffélec affirme que « L’œuvre littéraire se crée, comme toute chose en ce monde, à partir de matériaux empruntés à la vie. » Autrement dit, la vie fournirait à l’écrivain la matière première de sa création. Toutefois, l’œuvre se réduit-elle à reproduire cette réalité ? Nous montrerons d’abord comment la littérature s’en nourrit, avant d’examiner la manière dont l’imagination et le travail esthétique lui permettent de s’en éloigner.

| Passage | Fonction |
|---|---|
| « Les écrivains observent… » | Amorce liée au thème |
| « C’est dans ce sens… » | Insertion de la citation |
| « Autrement dit… » | Reformulation |
| « Toutefois… ? » | Problématique |
| « Nous montrerons… » | Annonce du plan |

> **À éviter :** « Depuis la nuit des temps », une définition de dictionnaire, l’annonce « notre travail consistera à », ou une réponse déjà tranchée.`,
    keyPoint: "Amorce liée → sujet intégré → reformulation → problématique → plan.",
    example: "L’amorce parle déjà du rapport entre littérature et monde vécu ; elle prépare donc naturellement la citation.",
    interaction: {
      kind: "timeline",
      eyebrow: "Le mouvement de l’introduction",
      title: "Du thème au programme de la copie",
      instruction: "Ouvre les étapes pour vérifier leur enchaînement.",
      items: [
        { label: "Amorce", detail: "Installer le thème sans formule vague." },
        { label: "Sujet", detail: "Présenter l’auteur et intégrer la citation." },
        { label: "Reformulation", detail: "Dire clairement ce que l’opinion signifie." },
        { label: "Problématique", detail: "Faire apparaître la part de vérité et la limite." },
        { label: "Plan", detail: "Annoncer les deux mouvements de la réponse." },
      ],
      observation: "Chaque phrase prépare la suivante ; aucune partie ne doit sembler collée.",
    },
    method: {
      eyebrow: "Rédaction guidée",
      title: "Tester chaque phrase",
      introduction: "Relis l’introduction en demandant ce que chaque phrase accomplit.",
      steps: [
        "Vérifie que l’amorce touche exactement le thème.",
        "Intègre l’opinion dans une phrase grammaticalement complète.",
        "Fais apparaître la tension dans une vraie question.",
        "Annonce seulement le mouvement que le développement suivra.",
      ],
      example: {
        prompt: "L’œuvre copie-t-elle simplement la vie ?",
        work: "La citation affirme l’emprunt ; la problématique ajoute la transformation.",
        result: "L’introduction ouvre les deux axes sans les développer.",
      },
      tip: "Rédige l’introduction au brouillon, puis raccourcis tout ce qui n’aide pas la problématique.",
    },
    questions: [
      q("Quel passage doit faire apparaître la tension ?", ["L’amorce", "La présentation", "La problématique", "Le nom de l’auteur"], 2, "La problématique transforme l’opinion en difficulté.", "Corrigé · p.5"),
      q("Quelle amorce est la plus pertinente ?", ["Depuis la nuit des temps…", "Les œuvres transforment souvent les sociétés et les événements observés par les écrivains.", "Henri Queffélec est un homme.", "La littérature est un mot du dictionnaire."], 1, "Elle introduit directement le rapport littérature-réalité.", "Modèle adapté · p.5"),
      q("Que vient faire la reformulation ?", ["Répéter mot pour mot", "Donner la conclusion", "Lister des œuvres", "Expliciter le sens de l’opinion"], 3, "Elle rend l’opinion compréhensible sans la trahir.", "Corrigé · p.5"),
      q("Que doit annoncer le plan ?", ["Le mouvement réel de la démonstration", "Toutes les œuvres", "La note espérée", "Une ouverture finale"], 0, "L’annonce engage l’ordre que la copie respectera.", "Conseil Excellence ; le barème p.10 accepte problématique ou annonce du plan"),
    ],
    activities: [
      {
        id: "write-bac-introduction",
        kind: "guided-writing",
        title: "Construis ton introduction",
        instruction: "Rédige chaque composante, puis compare l’ensemble au modèle.",
        sourceLabel: "Adaptation Excellence fondée sur le corrigé national p.5",
        prompts: [
          { id: "lead", label: "Amorce liée au thème", placeholder: "Présente le rapport littérature-réalité…", hint: "Évite les généralités vides.", rows: 3 },
          { id: "subject", label: "Insertion et reformulation", placeholder: "Présente Queffélec, puis reformule…", hint: "Ne déforme pas « matériaux empruntés à la vie ».", rows: 4 },
          { id: "problem-plan", label: "Problématique et annonce du plan", placeholder: "Pose la tension, puis annonce le mouvement…", hint: "Ancrage réel, puis invention/transformation.", rows: 4 },
        ],
        criteria: [
          { id: "theme", label: "Mon amorce prépare vraiment le sujet", hint: "Elle parle déjà de littérature et de vie." },
          { id: "integrated", label: "La citation est intégrée", hint: "Elle appartient à une phrase correcte." },
          { id: "tension", label: "Ma question est discutable", hint: "Elle contient thèse et limite." },
          { id: "coherence", label: "Mon plan répond à ma problématique", hint: "Les axes annoncés seront réellement suivis." },
        ],
        modelTitle: "Introduction modèle annotée",
        modelMarkdown: String.raw`Les écrivains observent les sociétés, les événements et les êtres qui les entourent ; leurs œuvres semblent ainsi entretenir un lien étroit avec le monde vécu. C’est dans ce sens qu’Henri Queffélec affirme que « L’œuvre littéraire se crée, comme toute chose en ce monde, à partir de matériaux empruntés à la vie. » Autrement dit, la vie fournirait à l’écrivain la matière première de sa création. Toutefois, l’œuvre se réduit-elle à reproduire cette réalité ? Nous montrerons d’abord comment la littérature s’en nourrit, avant d’examiner la manière dont l’imagination et le travail esthétique lui permettent de s’en éloigner.`,
      },
    ],
    source: source("Corrigé p.5 ; barème p.10", "Critères nationaux et modèle d’introduction adapté par Excellence", "adapted"),
  },
  {
    suffix: "write-development",
    title: "Rédiger le développement",
    summary: "Construire des paragraphes démonstratifs, relier les exemples et faire progresser les axes.",
    durationMinutes: 25,
    kind: "practice",
    eyebrow: "Partie 6 • Démontrer",
    conceptTitle: "Idée, explication, œuvre, analyse et lien",
    explanation: "Le développement vaut 12 points. Sa force vient moins du nombre de titres que de la précision avec laquelle chaque œuvre soutient une idée.",
    bodyMarkdown: String.raw`## Le paragraphe démonstratif

> **Méthode Excellence fondée sur la progression.** La progression demande de rédiger une partie du développement ; le découpage suivant explicite cette compétence sans prétendre être une formule nationale imposée.

Un paragraphe solide peut s’organiser en cinq gestes :

1. **annoncer l’argument** ;
2. **l’expliquer** ;
3. **introduire une œuvre** ;
4. **analyser un élément précis** ;
5. **revenir au sujet**.

## Exemple entièrement rédigé

> D’abord, la littérature emprunte à la vie les difficultés sociales qu’elle rend visibles. En représentant des individus confrontés à la pauvreté, l’écrivain transforme une expérience collective en situation romanesque capable d’émouvoir et de faire réfléchir. Ainsi, dans *L’Ordonnance*, les obstacles rencontrés pour accéder aux soins donnent une forme concrète à la précarité. L’œuvre ne juxtapose donc pas un fait réel : elle le sélectionne et l’organise pour en révéler la violence. Cet exemple confirme que la vie sociale constitue bien un matériau de création littéraire.

| Segment | Rôle |
|---|---|
| « D’abord… difficultés sociales » | Argument |
| « En représentant… » | Explication |
| « Ainsi, dans L’Ordonnance… » | Œuvre et élément précis |
| « L’œuvre ne juxtapose donc pas… » | Analyse |
| « Cet exemple confirme… » | Retour au sujet |

## Construire l’axe

Les paragraphes d’un axe doivent être distincts et ordonnés. Une progression possible va du **social** à l’**historique**, puis au **politique**. Une autre est possible si elle reste cohérente.

## La transition

> La littérature trouve donc dans la vie une matière abondante. Toutefois, l’œuvre ne se confond pas avec le document : l’imagination et l’écriture transforment ce qu’elles empruntent, et peuvent même inventer des mondes sans modèle direct.

Cette transition fait le bilan de l’axe I et ouvre exactement l’axe II.`,
    keyPoint: "Argument → explication → exemple précis → analyse → lien au sujet.",
    example: "Le nom d’une œuvre est une donnée ; l’analyse de l’élément choisi en fait une preuve.",
    interaction: {
      kind: "diagram",
      eyebrow: "Anatomie du paragraphe",
      title: "Cinq gestes qui transforment une idée en preuve",
      instruction: "Sélectionne chaque geste pour relire ton propre paragraphe.",
      rootLabel: "Paragraphe",
      rootDetail: "Une mini-démonstration qui sert l’axe et la problématique.",
      nodes: [
        { id: "claim", label: "Argument", role: "Affirmer", detail: "Une phrase claire et directement liée à l’axe." },
        { id: "explain", label: "Explication", role: "Justifier", detail: "Dire pourquoi l’argument répond au sujet." },
        { id: "work", label: "Œuvre", role: "Illustrer", detail: "Nommer une œuvre et un élément précis." },
        { id: "analyze", label: "Analyse", role: "Interpréter", detail: "Montrer ce que cet élément prouve." },
        { id: "link", label: "Lien", role: "Revenir", detail: "Relier explicitement la preuve à la citation." },
      ],
      observation: "Si le dernier lien manque, l’exemple reste souvent plaqué.",
    },
    method: {
      eyebrow: "Contrôle qualité",
      title: "Le test des cinq couleurs",
      introduction: "Au brouillon, attribue mentalement une couleur à chaque fonction.",
      steps: [
        "Repère la phrase d’argument.",
        "Souligne l’explication.",
        "Encadre l’œuvre et l’élément précis.",
        "Entoure la phrase qui revient au sujet.",
      ],
      example: {
        prompt: "Pourquoi Racines est-il pertinent ?",
        work: "Parce que l’histoire de la traite et de l’esclavage alimente la fiction.",
        result: "L’œuvre prouve que des faits historiques deviennent matériaux littéraires.",
      },
      tip: "Une citation d’œuvre n’est utile que si tu l’expliques avec exactitude.",
    },
    questions: [
      q("Quel élément transforme un exemple en preuve ?", ["Son titre seul", "Sa longueur", "Le lien expliqué avec l’argument", "La célébrité de l’auteur"], 2, "L’analyse établit ce que l’exemple prouve.", "Barème · pertinence p.10"),
      q("Par quoi commence normalement un paragraphe ?", ["Un argument clair", "Une ouverture", "La note", "Une nouvelle problématique"], 0, "Le lecteur doit savoir quelle idée sera démontrée.", "Méthode Excellence fondée sur la progression DPFC"),
      q("Que doit faire une transition ?", ["Ajouter un exemple sans rapport", "Conclure tout le devoir", "Répéter le sujet", "Faire le bilan et révéler la limite"], 3, "Elle ferme un axe et rend le suivant nécessaire.", "Corrigé · p.8"),
      q("Quel usage de L’Ordonnance est le plus précis ?", ["Le titre est intéressant.", "L’accès difficile aux soins rend visible la précarité sociale.", "C’est un livre africain.", "L’auteur parle de la vie."], 1, "La proposition nomme un élément et son rôle argumentatif.", "Corrigé · p.5-6"),
    ],
    activities: [
      {
        id: "write-evidence-paragraph",
        kind: "guided-writing",
        title: "Rédige un paragraphe complet",
        instruction: "Choisis une œuvre que tu maîtrises et construis toute la démonstration.",
        sourceLabel: "Adaptation Excellence fondée sur la progression DPFC et le corrigé p.5-9",
        prompts: [
          { id: "claim", label: "Argument et explication", placeholder: "Affirme une idée, puis justifie-la…", rows: 4 },
          { id: "evidence", label: "Œuvre et élément précis", placeholder: "Dans…, l’auteur montre…", rows: 4 },
          { id: "analysis", label: "Analyse et retour au sujet", placeholder: "Cet élément prouve que…", rows: 4 },
        ],
        criteria: [
          { id: "distinct", label: "Mon argument est distinct des autres", hint: "Il apporte une nouvelle dimension." },
          { id: "specific", label: "Mon exemple est précis", hint: "Titre, auteur ou élément reconnaissable." },
          { id: "analyzed", label: "Je ne raconte pas seulement l’œuvre", hint: "J’explique ce qu’elle prouve." },
          { id: "linked", label: "Je reviens au sujet", hint: "Le mot vie, matériau ou création réapparaît." },
        ],
        modelTitle: "Paragraphe modèle",
        modelMarkdown: String.raw`D’abord, la littérature emprunte à la vie les difficultés sociales qu’elle rend visibles. En représentant des individus confrontés à la pauvreté, l’écrivain transforme une expérience collective en situation romanesque capable d’émouvoir et de faire réfléchir. Ainsi, dans *L’Ordonnance*, les obstacles rencontrés pour accéder aux soins donnent une forme concrète à la précarité. L’œuvre ne juxtapose donc pas un fait réel : elle le sélectionne et l’organise pour en révéler la violence. Cet exemple confirme que la vie sociale constitue bien un matériau de création littéraire.`,
      },
    ],
    source: source("Progression p.12/15 ; corrigé p.5-9 ; barème p.10", "Rédaction d’une partie du développement, explicitée par Excellence", "adapted", [], "both"),
  },
  {
    suffix: "write-conclusion",
    title: "Rédiger une conclusion",
    summary: "Faire le bilan, répondre clairement et n’ajouter une ouverture que si elle apporte une vraie perspective.",
    durationMinutes: 15,
    kind: "practice",
    eyebrow: "Partie 7 • Conclure",
    conceptTitle: "Fermer le raisonnement sans recommencer le devoir",
    explanation: "La conclusion vaut 3 points globalement. Elle synthétise le parcours, formule un jugement personnel argumenté et peut ouvrir une perspective ; cette ouverture demeure facultative.",
    bodyMarkdown: String.raw`## Les trois fonctions de la conclusion

1. **Bilan** : rappeler le résultat des deux axes, sans recopier leurs titres.
2. **Jugement ou réponse personnelle** : répondre franchement à la problématique.
3. **Ouverture facultative** : prolonger la réflexion par une question réellement liée.

## Modèle expliqué

> En définitive, la littérature puise largement dans la vie sociale, historique, culturelle ou politique, qui lui fournit personnages, conflits et décors. Pourtant, ces éléments ne deviennent œuvre qu’à travers l’imagination, le choix d’une forme et le travail singulier de la langue. L’opinion de Queffélec est donc juste si l’on comprend que l’écrivain n’est pas un simple copiste : il transforme la matière vécue pour produire un monde et un regard nouveaux. On peut alors se demander si cette transformation artistique ne nous aide pas, en retour, à mieux comprendre la réalité.

| Passage | Fonction |
|---|---|
| « En définitive… Pourtant… » | Bilan des deux axes |
| « L’opinion… est donc juste si… » | Réponse nuancée |
| « On peut alors se demander… » | Ouverture liée et facultative |

## Les erreurs qui coûtent cher

- apporter un argument ou une œuvre jamais développé auparavant ;
- écrire seulement « en somme, tout ce qui précède montre que… » ;
- contredire le plan annoncé ;
- proposer une ouverture sans lien ;
- transformer l’opinion personnelle en « moi je pense que » sans justification.`,
    keyPoint: "Bilan des axes → réponse nuancée → ouverture seulement si elle est pertinente.",
    example: "Queffélec a raison sur la matière de l’œuvre, mais cette matière devient littérature par l’invention et le style.",
    interaction: {
      kind: "timeline",
      eyebrow: "Dernier mouvement",
      title: "Trois gestes, dont un facultatif",
      instruction: "Vérifie ce que chaque geste apporte.",
      items: [
        { label: "Bilan", detail: "Réunir le résultat essentiel des deux axes." },
        { label: "Réponse", detail: "Prendre position de façon nuancée et directement liée au problème." },
        { label: "Ouverture", detail: "Prolonger sans recommencer ; la supprimer si elle est artificielle." },
      ],
      observation: "Une excellente conclusion peut s’arrêter après la réponse : l’ouverture n’est pas obligatoire.",
    },
    method: {
      eyebrow: "Relecture finale",
      title: "Le test de la réponse",
      introduction: "La conclusion doit être compréhensible même si on ne relit que la problématique.",
      steps: [
        "Relis la problématique.",
        "Résume ce que chaque axe a établi.",
        "Formule une réponse avec « certes », « cependant » ou « à condition de ».",
        "Garde l’ouverture seulement si elle prolonge exactement le thème.",
      ],
      example: {
        prompt: "Que devient la thèse de Queffélec après discussion ?",
        work: "Elle reste juste, mais l’emprunt est transformé par l’écriture.",
        result: "La littérature utilise la vie comme matière sans être sa reproduction.",
      },
      tip: "N’introduis jamais une nouvelle œuvre dans la conclusion.",
    },
    questions: [
      q("Quel élément de la conclusion est facultatif ?", ["Le bilan", "La réponse", "L’ouverture", "La cohérence"], 2, "Le corrigé national le précise.", "Corrigé · p.9-10"),
      q("Que doit faire le bilan ?", ["Résumer le résultat des axes", "Ajouter trois œuvres", "Répéter toute l’introduction", "Ouvrir un troisième axe"], 0, "Il rassemble les acquis sans répéter.", "Corrigé · p.9"),
      q("Quelle réponse est nuancée ?", ["Queffélec a entièrement tort.", "La littérature copie toujours.", "Je n’ai pas d’avis.", "La vie fournit une matière que l’écriture transforme."], 3, "Elle conserve la thèse et sa limite.", "Synthèse du corrigé · p.9"),
      q("Quand faut-il supprimer une ouverture ?", ["Quand elle est artificielle ou sans lien", "Toujours", "Quand la copie est propre", "Quand elle est une question"], 0, "Une ouverture forcée fragilise la conclusion.", "Conseil Excellence ; le barème p.10 la rend facultative"),
    ],
    activities: [
      {
        id: "write-bac-conclusion",
        kind: "guided-writing",
        title: "Ferme le raisonnement",
        instruction: "Rédige le bilan, la réponse puis une ouverture que tu pourras supprimer si elle n’est pas utile.",
        sourceLabel: "Adaptation Excellence fondée sur le corrigé national p.9-10",
        prompts: [
          { id: "summary", label: "Bilan des deux axes", placeholder: "La littérature puise…, mais elle…", rows: 4 },
          { id: "answer", label: "Réponse personnelle nuancée", placeholder: "L’opinion est juste à condition de…", rows: 3 },
          { id: "opening", label: "Ouverture", placeholder: "On peut alors se demander…", hint: "Tu peux laisser ce champ vide : l’ouverture n’est pas obligatoire.", rows: 3, optional: true },
        ],
        criteria: [
          { id: "both", label: "Je synthétise les deux axes", hint: "Ancrage réel et transformation." },
          { id: "direct", label: "Je réponds à Queffélec", hint: "Ma position est explicite." },
          { id: "new", label: "Je n’ajoute aucun nouvel argument", hint: "Tout vient du développement." },
          { id: "opening", label: "Mon ouverture reste liée", hint: "Sinon je la supprimerai." },
        ],
        modelTitle: "Conclusion modèle",
        modelMarkdown: String.raw`En définitive, la littérature puise largement dans la vie sociale, historique, culturelle ou politique, qui lui fournit personnages, conflits et décors. Pourtant, ces éléments ne deviennent œuvre qu’à travers l’imagination, le choix d’une forme et le travail singulier de la langue. L’opinion de Queffélec est donc juste si l’on comprend que l’écrivain n’est pas un simple copiste : il transforme la matière vécue pour produire un monde et un regard nouveaux. On peut alors se demander si cette transformation artistique ne nous aide pas, en retour, à mieux comprendre la réalité.`,
      },
    ],
    source: source("Corrigé p.9 ; barème p.10", "Critères de conclusion et modèle adapté par Excellence", "adapted"),
  },
  {
    suffix: "bac-2025-workshop",
    title: "Atelier complet — BAC 2025",
    summary: "Traiter le sujet Queffélec de l’analyse à l’auto-évaluation, avec le plan du corrigé national réorganisé et un corrigé guidé.",
    durationMinutes: 20,
    kind: "challenge",
    eyebrow: "Partie 8 • Mise en situation",
    conceptTitle: "Assembler une copie cohérente et personnelle",
    explanation: "Cet atelier réunit toutes les opérations. Les réponses objectives sont vérifiées immédiatement ; la dissertation libre reste un brouillon personnel comparé à un modèle et au barème.",
    bodyMarkdown: String.raw`## Sujet authentique

L’écrivain français Henri Queffélec, dans le journal littéraire et artistique *Les Nouvelles littéraires* paru le 16 janvier 1961, écrit :

> « L’œuvre littéraire se crée, comme toute chose en ce monde, à partir de matériaux empruntés à la vie. »

**Consigne :** Expliquez et discutez cette opinion en vous appuyant sur des œuvres littéraires lues ou étudiées.

## Corrigé national et organisation pédagogique Excellence

### Introduction : exigence nationale et conseil Excellence

Le barème national attend les généralités, l’insertion du sujet, puis une **problématique ou une annonce du plan**. Pour rendre la copie plus lisible, Excellence conseille ici :

- une amorce sur le rapport littérature-réalité ;
- l’insertion et la reformulation de l’opinion ;
- une problématique dialectique ;
- l’annonce d’un plan cohérent.

### Axe I — La littérature emprunte à la vie

Choisir environ trois arguments parmi les familles proposées par le corrigé : faits sociaux, faits historiques, faits culturels, faits politiques, personnages réels, espaces réels. Excellence les regroupe pour construire des sous-parties lisibles ; chaque argument doit recevoir une œuvre analysée.

### Transition

Reconnaître l’importance de la matière réelle, puis expliquer que l’écriture n’est pas une reproduction passive.

### Axe II — La littérature invente et transforme

Développer l’invention des histoires, des personnages, des espaces et le travail esthétique ou langagier.

### Conclusion

Le corrigé demande une synthèse du développement, un jugement personnel et, facultativement, une ouverture. La réponse « l’opinion est juste mais incomplète sans la transformation créatrice » est la synthèse guidée proposée par Excellence.

## Grille d’auto-évaluation fondée sur le barème national

| Question à se poser | Barème |
|---|---:|
| Mon introduction installe-t-elle le sujet et le problème ? | /3 |
| Ma méthode de développement est-elle maîtrisée ? | /2 |
| Mes idées sont-elles pertinentes et prouvées ? | /6 |
| Mes paragraphes et transitions sont-ils cohérents ? | /2 |
| Ma langue est-elle correcte ? | /2 |
| Ma conclusion fait-elle bilan et réponse ? | /3 |
| Ma copie est-elle lisible et soignée ? | /2 |
| **Total indicatif à faire confirmer par un correcteur** | **/20** |

> **Important.** Cette grille aide à se relire ; Excellence ne calcule aucune note automatique sur une rédaction. Seul un correcteur humain peut apprécier la pertinence, la qualité de la langue et la cohérence globale.`,
    keyPoint: "La vie apporte une matière ; l’imagination, la forme et la langue en font une œuvre.",
    example: "Une copie personnelle peut utiliser d’autres œuvres que celles du corrigé si chaque exemple est exact et analysé.",
    interaction: {
      kind: "diagram",
      eyebrow: "Copie complète",
      title: "Les éléments qui doivent se répondre",
      instruction: "Explore le schéma avant d’assembler ton brouillon.",
      rootLabel: "Réponse au sujet",
      rootDetail: "Une démonstration qui explique, discute et conclut.",
      nodes: [
        { id: "subject", label: "Analyse", role: "Comprendre", detail: "Notions, thèse, consigne et limites.", group: "Brouillon" },
        { id: "plan", label: "Plan", role: "Organiser", detail: "Axes, arguments, œuvres et transition.", group: "Brouillon" },
        { id: "intro", label: "Introduction", role: "Ouvrir", detail: "Thème, opinion, problème et mouvement.", group: "Copie" },
        { id: "body", label: "Développement", role: "Prouver", detail: "Paragraphes argumentés et exemples analysés.", group: "Copie" },
        { id: "conclusion", label: "Conclusion", role: "Répondre", detail: "Bilan, jugement et ouverture facultative.", group: "Copie" },
        { id: "review", label: "Barème", role: "Relire", detail: "Méthode, idées, cohérence, langue et soin.", group: "Contrôle" },
      ],
      observation: "La cohérence naît des liens : problématique ↔ axes ↔ paragraphes ↔ conclusion.",
    },
    method: {
      eyebrow: "Simulation BAC",
      title: "Trois passages avant de recopier",
      introduction: "Traite le sujet d’abord comme un architecte, puis comme un rédacteur.",
      steps: [
        "Premier passage : analyse, idées et œuvres.",
        "Deuxième passage : plan détaillé et transitions.",
        "Troisième passage : rédaction puis relecture sur le barème.",
      ],
      example: {
        prompt: "Que faut-il prouver au terme du devoir ?",
        work: "La thèse est fondée, mais la création transforme ou invente.",
        result: "L’œuvre naît d’un dialogue entre expérience du monde et liberté artistique.",
      },
      tip: "Si tu ne peux pas expliquer précisément une œuvre, choisis-en une autre que tu maîtrises.",
    },
    questions: [
      q("Quelle réponse synthétise le corrigé ?", ["L’œuvre copie le réel.", "La vie fournit une matière que l’écriture transforme.", "Toute œuvre est fantastique.", "Les exemples sont inutiles."], 1, "Elle articule la thèse et sa limite.", "Corrigé · p.5-9"),
      q("Quel ensemble peut nourrir l’axe I ?", ["Faits sociaux, historiques et politiques", "Seulement les biographies", "Seulement les lieux fictifs", "Seulement la poésie"], 0, "Ces familles figurent dans le corrigé.", "Corrigé · p.5-7"),
      q("Quel ensemble appartient à l’axe II ?", ["Personnages historiques et lieux réels", "Pauvreté et esclavage", "Histoire inventée, lieux fictifs et style", "Documents administratifs"], 2, "Il montre l’autonomie créatrice.", "Corrigé · p.8-9"),
      q("Qui doit attribuer la note finale d’une dissertation libre ?", ["Le nombre de mots", "Un tirage automatique", "Le clavier", "Un correcteur humain"], 3, "Le jugement global de la copie ne se réduit pas à des mots-clés.", "Contrat pédagogique Excellence"),
    ],
    activities: [
      {
        id: "complete-bac-copy",
        kind: "guided-writing",
        title: "Prépare ta copie complète",
        instruction: "Rédige les blocs essentiels. Ton brouillon reste sur cet appareil et ne reçoit aucune note automatique.",
        sourceLabel: "Adaptation Excellence fondée sur le sujet et le corrigé nationaux p.3-10",
        prompts: [
          { id: "analysis", label: "Reformulation et problématique", placeholder: "Reformule, puis pose la tension…", rows: 5 },
          { id: "plan", label: "Plan détaillé", placeholder: "Axe I : trois arguments et œuvres… Transition… Axe II…", rows: 8 },
          { id: "intro", label: "Introduction rédigée", placeholder: "Amorce, sujet, reformulation, problématique, plan…", rows: 7 },
          { id: "paragraph", label: "Un paragraphe entièrement rédigé", placeholder: "Argument, explication, œuvre, analyse, lien…", rows: 8 },
          { id: "conclusion", label: "Conclusion rédigée", placeholder: "Bilan, réponse, ouverture facultative…", rows: 6 },
        ],
        criteria: [
          { id: "commands", label: "Je réponds à « expliquer » et « discuter »", hint: "Les deux mouvements apparaissent." },
          { id: "works", label: "Chaque œuvre est analysée", hint: "Aucun titre n’est plaqué." },
          { id: "links", label: "Mes transitions font progresser", hint: "Elles ne sont pas décoratives." },
          { id: "language", label: "J’ai relu la langue et le soin", hint: "Phrases, accords, ponctuation, paragraphes." },
        ],
        modelTitle: "Corrigé guidé de comparaison",
        modelMarkdown: String.raw`**Problématique :** Dans quelle mesure la littérature emprunte-t-elle ses matériaux à la vie, et comment la création lui permet-elle aussi de s’en éloigner ?

**Axe I — La vie comme matière :** faits sociaux (*L’Ordonnance*), historiques (*Racines*), culturels (*Rebelle*, *Les Soleils des indépendances*) ou politiques (*On se chamaille pour un siège*). Pour chaque œuvre, expliquer l’élément précis qui devient matière littéraire.

**Transition :** emprunter n’est pas copier ; l’auteur sélectionne et transforme.

**Axe II — L’autonomie créatrice :** histoire inventée (*La Planète des singes*), personnage fictif (Pangloss), espace fictif (B612), travail de la forme et de la langue (calligrammes, langue malinkisée).

**Réponse :** Queffélec souligne justement l’ancrage de la littérature dans la vie, mais l’œuvre naît réellement lorsque l’imagination et l’écriture transforment cette matière.

Ce corrigé indique une architecture, pas une copie unique. D’autres œuvres et formulations sont recevables si elles sont exactes, pertinentes et expliquées.`,
      },
    ],
    source: source(
      "Sujet p.3 ; corrigé p.4-9 ; barème p.10",
      "Atelier intégral sur le sujet BAC 2025",
      "adapted",
      ["Le sujet, les familles d’arguments et le barème sont fidèles au dossier national ; leur organisation interactive est une adaptation Excellence.", "Le corrigé fournit des pistes et exemples indicatifs, non une liste obligatoire.", "La rédaction libre exige une correction humaine."],
    ),
  },
];

function buildLesson(seed: FrenchLessonSeed, index: number): LearningLesson {
  return {
    id: `${pathId}-${seed.suffix}`,
    title: seed.title,
    summary: seed.summary,
    durationMinutes: seed.durationMinutes,
    xp: rawWeights[index],
    kind: seed.kind,
    concept: {
      eyebrow: seed.eyebrow,
      title: seed.conceptTitle,
      explanation: seed.explanation,
      bodyMarkdown: seed.bodyMarkdown,
      notation: seed.keyPoint,
      example: seed.example,
    },
    interaction: seed.interaction,
    method: seed.method,
    question: seed.questions[0],
    questions: seed.questions,
    courseActivities: seed.activities,
    source: seed.source,
  };
}

export const terminalFrenchLiteraryDissertationPath: LearningPath = {
  id: pathId,
  subjectId: "french",
  levelIds: ["terminale-a", "terminale-c", "terminale-d"],
  presentation: "continuous-course",
  curriculumLabel: "Programme éducatif et progression DPFC — Français Terminale",
  curriculumSourceUrl: "https://dpfc-ci.net/",
  theme: { number: 1, title: "Méthodologie des exercices littéraires" },
  chapterNumber: 2,
  title: "La dissertation littéraire",
  description: "Analyser une opinion sur la littérature, construire une problématique et rédiger une réponse argumentée, puis appliquer la méthode au sujet BAC 2025.",
  estimatedMinutes: 152,
  outcomes: [
    "Analyser les notions et les verbes d’un sujet de dissertation littéraire.",
    "Construire une problématique et un plan répondant exactement au sujet.",
    "Associer chaque argument à une œuvre expliquée avec précision.",
    "Rédiger introduction, paragraphes, transitions et conclusion.",
    "Évaluer une copie avec le barème national sans automatiser la note d’une rédaction libre.",
  ],
  modules: [
    {
      id: "literary-dissertation-course",
      title: "Du sujet à la copie",
      description: "Un cours continu, des manipulations objectives et des ateliers de rédaction guidée.",
      lessons: lessons.map(buildLesson),
    },
  ],
};
