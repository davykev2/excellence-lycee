import type {
  CourseActivity,
  LearningLesson,
  LearningPath,
  LessonInteraction,
  LessonKind,
  LessonQuestion,
  LessonSourceMetadata,
  TimelineInteractionItem,
} from "../domain/paths";

export interface PhilosophySectionSeed {
  id: string;
  title: string;
  summary: string;
  conceptTitle: string;
  explanation: string;
  /** Cours rédigé : méthode détaillée, exemples corrigés, encadrés. */
  bodyMarkdown?: string;
  /** Remplace la carte mentale par une autre interaction, par exemple un organigramme. */
  interaction?: LessonInteraction;
  /** Exercices supplémentaires tirés du document, en plus du contrôle `check`. */
  extraQuestions?: LessonQuestion[];
  /** Ateliers du lecteur continu, sans note et indépendants du registre XP. */
  courseActivities?: CourseActivity[];
  source?: LessonSourceMetadata;
  keyPoint: string;
  example: string;
  mapTitle: string;
  mapInstruction: string;
  map: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  observation: string;
  methodTitle?: string;
  methodSteps?: [string, string, string, ...string[]];
  check: LessonQuestion;
  distractors: [string, string, string];
  durationMinutes?: number;
  kind?: LessonKind;
}

export interface PhilosophyMissionSeed {
  title: string;
  scenario: string;
  problem: string;
  plan: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  modelAnswer: string;
  questions: [LessonQuestion, LessonQuestion, LessonQuestion];
  /** Corrigé rédigé du sujet, affiché avant les consignes. */
  bodyMarkdown?: string;
  /** Remplace la frise du plan, par exemple par l'organigramme des axes. */
  interaction?: LessonInteraction;
  /** Consignes supplémentaires du document. */
  extraQuestions?: LessonQuestion[];
  courseActivities?: CourseActivity[];
  source?: LessonSourceMetadata;
}

export interface PhilosophyCourseSeed {
  id: string;
  presentation?: LearningPath["presentation"];
  chapterNumber: number;
  themeNumber: number;
  themeTitle: string;
  title: string;
  description: string;
  centralQuestion: string;
  memorySentence: string;
  overviewBodyMarkdown?: string;
  overviewActivities?: CourseActivity[];
  overviewSource?: LessonSourceMetadata;
  sections: [PhilosophySectionSeed, PhilosophySectionSeed, PhilosophySectionSeed, PhilosophySectionSeed];
  mission: PhilosophyMissionSeed;
}

const rewards = [40, 55, 60, 65, 70, 80] as const;

function courseMethod(section: PhilosophySectionSeed) {
  return {
    eyebrow: "Méthode philosophique",
    title: section.methodTitle ?? "Construire un argument complet",
    introduction: "En philosophie, une idée devient convaincante lorsqu’elle est définie, justifiée, illustrée puis mise à l’épreuve.",
    steps: section.methodSteps ?? [
      "Affirme clairement l’idée que tu veux défendre.",
      "Explique pourquoi elle répond au problème.",
      "Ajoute une référence ou un exemple précis.",
      "Présente une limite ou une objection avant de conclure.",
    ],
    example: {
      prompt: `Comment défendre l’idée essentielle du niveau « ${section.title} » ?`,
      work: `${section.map[0].label} : ${section.map[0].detail}`,
      result: section.keyPoint,
    },
    tip: "Utilise : « parce que », « par exemple », « cependant » et « donc ».",
  };
}

function sectionLesson(course: PhilosophyCourseSeed, section: PhilosophySectionSeed, index: number): LearningLesson {
  return {
    id: `${course.id}-${section.id}`,
    title: section.title,
    summary: section.summary,
    durationMinutes: section.durationMinutes ?? 13,
    xp: rewards[index],
    kind: section.kind ?? (index < 3 ? "concept" : index < 5 ? "practice" : "challenge"),
    concept: {
      eyebrow: `Niveau ${index + 1} • Philosophie`,
      title: section.conceptTitle,
      explanation: section.explanation,
      bodyMarkdown: section.bodyMarkdown,
      notation: section.keyPoint,
      example: section.example,
    },
    interaction: section.interaction ?? {
      kind: "timeline",
      eyebrow: "Mettre les idées en mouvement",
      title: section.mapTitle,
      instruction: section.mapInstruction,
      items: section.map,
      observation: section.observation,
    },
    method: courseMethod(section),
    question: section.check,
    questions: [
      section.check,
      ...(section.extraQuestions ?? []),
      {
        prompt: "Quelle formulation résume correctement ce niveau ?",
        options: [section.distractors[0], section.keyPoint, section.distractors[1], section.distractors[2]],
        correctIndex: 1,
        explanation: section.keyPoint,
      },
    ],
    courseActivities: section.courseActivities,
    source: section.source,
  };
}

function overviewLesson(course: PhilosophyCourseSeed): LearningLesson {
  return {
    id: `${course.id}-overview`,
    title: "La carte de la leçon",
    summary: "Comprendre le problème central et les quatre étapes du parcours avant d’entrer dans les détails.",
    durationMinutes: 10,
    xp: rewards[0],
    kind: "concept",
    concept: {
      eyebrow: "Niveau 1 • Vue d’ensemble",
      title: course.centralQuestion,
      explanation: `${course.description} La leçon progresse en quatre étapes : ${course.sections.map((section) => section.title).join(" ; ")}.`,
      bodyMarkdown: course.overviewBodyMarkdown,
      notation: course.memorySentence,
      example: "Au BAC, commence toujours par transformer le thème en problème, puis organise les réponses possibles en axes argumentés.",
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Vue d’ensemble",
      title: "Les quatre étapes de la leçon",
      instruction: "Sélectionne chaque étape pour voir le rôle qu’elle joue dans le raisonnement.",
      items: course.sections.map((section) => ({ label: section.title, detail: section.summary })) as [TimelineInteractionItem, TimelineInteractionItem, TimelineInteractionItem, TimelineInteractionItem],
      observation: "Une bonne copie relie ces étapes au lieu de juxtaposer des définitions et des citations.",
    },
    method: {
      eyebrow: "Réflexe BAC",
      title: "Passer du thème au problème",
      introduction: "Le thème indique de quoi l’on parle ; le problème montre la difficulté qu’il faut résoudre.",
      steps: [
        "Repère les notions importantes.",
        "Définis-les dans le contexte du sujet ou du texte.",
        "Cherche la tension entre deux réponses possibles.",
        "Formule une question centrale précise.",
      ],
      example: {
        prompt: course.title,
        work: `Je pars du thème et je demande : ${course.centralQuestion}`,
        result: course.memorySentence,
      },
      tip: "Une problématique n’est pas le simple recopiage du sujet.",
    },
    question: {
      prompt: "Qu’est-ce qui transforme un thème en véritable réflexion philosophique ?",
      options: ["Une longue citation", "Un problème qui oppose des réponses possibles", "Une liste de définitions", "Une opinion sans justification"],
      correctIndex: 1,
      explanation: "Le problème fait apparaître la difficulté intellectuelle que l’argumentation devra résoudre.",
    },
    questions: [
      {
        prompt: "Qu’est-ce qui transforme un thème en véritable réflexion philosophique ?",
        options: ["Une longue citation", "Un problème qui oppose des réponses possibles", "Une liste de définitions", "Une opinion sans justification"],
        correctIndex: 1,
        explanation: "Le problème fait apparaître la difficulté intellectuelle que l’argumentation devra résoudre.",
      },
      {
        prompt: "Quel est le meilleur réflexe avant de mémoriser les auteurs ?",
        options: ["Comprendre le plan et les liens entre les thèses", "Apprendre les citations sans contexte", "Ignorer les objections", "Rédiger directement la conclusion"],
        correctIndex: 0,
        explanation: "Les auteurs servent à soutenir un raisonnement déjà compris ; ils ne remplacent pas l’analyse.",
      },
    ],
    courseActivities: course.overviewActivities,
    source: course.overviewSource,
  };
}

function missionLesson(course: PhilosophyCourseSeed): LearningLesson {
  const mission = course.mission;
  return {
    id: `${course.id}-mission-finale`,
    title: "Mission finale",
    summary: mission.title,
    durationMinutes: 20,
    xp: rewards[5],
    kind: "challenge",
    concept: {
      eyebrow: "Niveau 6 • Mission type BAC",
      title: mission.title,
      explanation: mission.scenario,
      bodyMarkdown: mission.bodyMarkdown,
      notation: mission.problem,
      example: mission.modelAnswer,
    },
    interaction: mission.interaction ?? {
      kind: "timeline",
      eyebrow: "Préparer la copie",
      title: "Le plan de résolution",
      instruction: "Parcours les mouvements du raisonnement avant de répondre aux questions.",
      items: mission.plan,
      observation: "Chaque axe doit contenir une idée, une justification et une référence pertinente.",
    },
    method: {
      eyebrow: "Méthode BAC",
      title: "Rédiger sans réciter",
      introduction: "Ta réponse doit rester centrée sur le problème et faire dialoguer les positions.",
      steps: [
        "Définis les termes essentiels et formule le problème.",
        "Annonce un premier axe et défends-le avec un argument précis.",
        "Présente l’objection ou la limite dans un second axe.",
        "Donne une réponse nuancée et directement liée au sujet.",
      ],
      example: {
        prompt: mission.title,
        work: mission.plan.map((item) => item.label).join(" → "),
        result: mission.modelAnswer,
      },
      tip: "Une référence est utile seulement si tu expliques ce qu’elle prouve.",
    },
    question: mission.questions[0],
    questions: [...mission.questions, ...(mission.extraQuestions ?? [])],
    courseActivities: mission.courseActivities,
    source: mission.source,
  };
}

export function createPhilosophyPath(course: PhilosophyCourseSeed): LearningPath {
  const contentLessons = course.sections.map((section, sectionIndex) => sectionLesson(course, section, sectionIndex + 1));
  const lessons = [overviewLesson(course), ...contentLessons, missionLesson(course)];
  return {
    id: course.id,
    presentation: course.presentation,
    subjectId: "philosophy",
    levelIds: ["terminale-a", "terminale-c", "terminale-d"],
    curriculumLabel: "Programme ivoirien • Terminale • Côte d’Ivoire École Numérique",
    curriculumSourceUrl: "https://www.ecole-ci.online/",
    theme: { number: course.themeNumber, title: course.themeTitle },
    chapterNumber: course.chapterNumber,
    title: course.title,
    description: course.description,
    estimatedMinutes: lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0),
    outcomes: [
      ...course.sections.map((section) => section.summary),
      "Traiter une situation d’évaluation en problématisant, argumentant et mobilisant des références.",
    ],
    modules: [{
      id: `${course.id}-mastery`,
      title: `Maîtriser « ${course.title} »`,
      description: course.presentation === "continuous-course"
        ? "Un cours continu en six parties, avec exemples expliqués, ateliers non notés et corrigés guidés."
        : "Cinq niveaux courts pour comprendre et raisonner, puis une mission finale inspirée des évaluations du cours officiel.",
      lessons,
    }],
  };
}
