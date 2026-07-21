import type { LearningLesson, LearningPath, LessonKind, LessonQuestion } from "../domain/paths";

const sourceUrl = "https://dpfc-ci.net/";

export interface OfficialMathTopic {
  id: string;
  title: string;
  pages: string;
  section: string;
  summary: string;
  rule: string;
  formula?: string;
  exercisePrompt: string;
  answer: string;
  explanation?: string;
  distractors?: string[];
  weight?: number;
  durationMinutes?: number;
  kind?: LessonKind;
  corrections?: string[];
}

export interface OfficialMathPathSeed {
  id: string;
  levelIds: string[];
  chapterNumber: number;
  themeNumber: number;
  themeTitle: string;
  title: string;
  description: string;
  outcomes: string[];
  documentTitle: string;
  topics: OfficialMathTopic[];
}

export const officialMathTopic = (
  id: string,
  title: string,
  pages: string,
  section: string,
  summary: string,
  rule: string,
  formula: string,
  exercisePrompt: string,
  answer: string,
  weight = 60,
  kind: LessonKind = "concept",
): OfficialMathTopic => ({
  id,
  title,
  pages,
  section,
  summary,
  rule,
  formula,
  exercisePrompt,
  answer,
  weight,
  kind,
});

function buildQuestion(topic: OfficialMathTopic, index: number): LessonQuestion {
  const defaults = [
    "La conclusion contraire",
    "Aucune valeur ne convient",
    "Les données ne permettent aucune conclusion",
  ];
  const distractors = (topic.distractors ?? defaults).slice(0, 3);
  while (distractors.length < 3) distractors.push(defaults[distractors.length]);
  const correctIndex = index % 4;
  const options = [...distractors];
  options.splice(correctIndex, 0, topic.answer);
  return {
    type: "choice",
    prompt: topic.exercisePrompt,
    options,
    correctIndex,
    explanation: topic.explanation ?? topic.rule,
    sourceLabel: `Exercice officiel de fixation • page${topic.pages.includes("-") ? "s" : ""} ${topic.pages}`,
    points: index % 3 === 2 ? 2 : 1,
  };
}

function plainMathText(value: string) {
  return value.replace(/\$([^$]+)\$/g, (_match, latex: string) => latex
    .replace(/\\mathbb\{?R\}?/g, "ℝ")
    .replace(/\\mathbb\{?Z\}?/g, "ℤ")
    .replace(/\\mathbb\{?N\}?/g, "ℕ")
    .replace(/\\operatorname\{([^}]+)\}/g, "$1")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, "$1/$2")
    .replace(/\\sqrt\{([^{}]+)\}/g, "√($1)")
    .replace(/\\circ/g, "∘")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "∞")
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\ne/g, "≠")
    .replace(/\\mid/g, "∣")
    .replace(/\\pi/g, "π")
    .replace(/\\theta/g, "θ")
    .replace(/\\alpha/g, "α")
    .replace(/\\ell/g, "ℓ")
    .replace(/\\varphi/g, "φ")
    .replace(/[{}]/g, "")
    .replace(/\\/g, ""));
}

function buildLesson(topic: OfficialMathTopic, index: number, documentTitle: string): LearningLesson {
  const formulaBlock = topic.formula ? `\n\n## Formule ou critère\n\n$$${topic.formula}$$` : "";
  const question = buildQuestion(topic, index);
  // The same deterministic progression is mirrored by the API and Supabase.
  // It gives later synthesis levels a little more weight before the path is
  // normalized to exactly 10,000 XP.
  const progressionWeight = 50 + Math.min(index, 7) * 5;
  return {
    id: topic.id,
    title: topic.title,
    summary: plainMathText(topic.summary),
    durationMinutes: topic.durationMinutes ?? 18,
    xp: progressionWeight,
    kind: topic.kind ?? "concept",
    source: {
      documentTitle,
      pages: topic.pages,
      section: topic.section,
      fidelity: topic.corrections?.length ? "faithful-corrected" : "faithful",
      corrections: topic.corrections ?? [],
    },
    concept: {
      eyebrow: `Niveau ${index + 1} • Cours officiel`,
      title: topic.title,
      explanation: topic.summary,
      bodyMarkdown: `## ${topic.title}\n\n${topic.summary}\n\n**À retenir.** ${topic.rule}${formulaBlock}`,
      notation: topic.rule,
      example: `${topic.exercisePrompt} — **Réponse attendue :** ${topic.answer}`,
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Repères",
      title: "Construire le raisonnement",
      instruction: "Parcours les trois repères avant de lancer l’exercice officiel.",
      observation: "Le contenu et l’exercice sont issus du PDF fourni ; l’activité d’introduction n’est pas intégrée.",
      items: [
        { label: "Comprendre", detail: plainMathText(topic.summary) },
        { label: "Retenir", detail: topic.rule },
        { label: "Vérifier", detail: topic.explanation ?? topic.answer },
      ],
    },
    method: {
      eyebrow: "Méthode",
      title: `Réussir : ${topic.title.toLocaleLowerCase("fr")}`,
      introduction: "Applique la propriété du cours, garde les conditions de validité visibles et contrôle le résultat.",
      steps: [
        "Identifie les données, l’ensemble de validité et la propriété utile.",
        "Écris la formule avant de remplacer les valeurs.",
        "Effectue les calculs dans l’ordre et justifie chaque transformation.",
        "Vérifie que le résultat répond exactement à la question posée.",
      ],
      example: { prompt: "Exercice de fixation du cours", work: topic.exercisePrompt, result: topic.answer },
      tip: topic.explanation ?? topic.rule,
    },
    question,
    questions: [question],
  };
}

export function buildOfficialMathPath(seed: OfficialMathPathSeed): LearningPath {
  const lessons = seed.topics.map((topic, index) => buildLesson(topic, index, seed.documentTitle));
  return {
    id: seed.id,
    subjectId: "mathematics",
    levelIds: seed.levelIds,
    curriculumLabel: "Programme ivoirien • Terminale C • Cours officiel fourni",
    curriculumSourceUrl: sourceUrl,
    theme: { number: seed.themeNumber, title: seed.themeTitle },
    chapterNumber: seed.chapterNumber,
    title: seed.title,
    description: seed.description,
    estimatedMinutes: lessons.reduce((sum, lesson) => sum + lesson.durationMinutes, 0),
    outcomes: seed.outcomes,
    modules: [{
      id: `${seed.id}-mastery`,
      title: `Maîtriser : ${seed.title}`,
      description: "Les niveaux suivent les blocs du cours officiel placés avant les exercices de fixation.",
      lessons,
    }],
  };
}
