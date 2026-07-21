import type {
  LearningLesson,
  LearningPath,
  LessonKind,
  LessonQuestion,
  TimelineInteractionItem,
} from "../domain/paths";

export interface SvtSectionSeed {
  id: string;
  title: string;
  summary: string;
  conceptTitle: string;
  explanation: string;
  keyPoint: string;
  example: string;
  processTitle: string;
  processInstruction: string;
  process: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  observation: string;
  check: LessonQuestion;
  distractors: [string, string, string];
  durationMinutes?: number;
  kind?: LessonKind;
}

export interface SvtMissionSeed {
  title: string;
  scenario: string;
  problem: string;
  investigation: [TimelineInteractionItem, TimelineInteractionItem, ...TimelineInteractionItem[]];
  modelAnswer: string;
  questions: [LessonQuestion, LessonQuestion, LessonQuestion];
}

export interface SvtCourseSeed {
  id: string;
  chapterNumber: number;
  themeNumber: number;
  themeTitle: string;
  title: string;
  description: string;
  centralQuestion: string;
  memorySentence: string;
  sections: [SvtSectionSeed, SvtSectionSeed, SvtSectionSeed, SvtSectionSeed];
  mission: SvtMissionSeed;
}

const rewards = [40, 55, 60, 65, 70, 80] as const;

function scientificMethod(section: SvtSectionSeed) {
  return {
    eyebrow: "Démarche scientifique",
    title: "Passer du document à l’explication",
    introduction: "En SVT, une bonne réponse distingue ce que l’on observe, ce que l’on déduit et le mécanisme biologique qui explique le résultat.",
    steps: [
      "Observe le document sans encore l’interpréter.",
      "Relève les résultats utiles et compare-les.",
      "Interprète les résultats avec les connaissances du cours.",
      "Conclue par une phrase qui répond exactement au problème.",
    ],
    example: {
      prompt: `Expliquer l’idée essentielle du niveau « ${section.title} ».` ,
      work: `${section.process[0].label} : ${section.process[0].detail}`,
      result: section.keyPoint,
    },
    tip: "Utilise : « j’observe que », « donc », « cela s’explique par » et « j’en conclus que ».",
  };
}

function sectionLesson(course: SvtCourseSeed, section: SvtSectionSeed, index: number): LearningLesson {
  return {
    id: `${course.id}-${section.id}`,
    title: section.title,
    summary: section.summary,
    durationMinutes: section.durationMinutes ?? 13,
    xp: rewards[index],
    kind: section.kind ?? (index < 3 ? "concept" : "practice"),
    concept: {
      eyebrow: `Niveau ${index + 1} • SVT`,
      title: section.conceptTitle,
      explanation: section.explanation,
      notation: section.keyPoint,
      example: section.example,
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Observer et raisonner",
      title: section.processTitle,
      instruction: section.processInstruction,
      items: section.process,
      observation: section.observation,
    },
    method: scientificMethod(section),
    question: section.check,
    questions: [
      section.check,
      {
        prompt: "Quelle proposition résume correctement ce niveau ?",
        options: [section.distractors[0], section.keyPoint, section.distractors[1], section.distractors[2]],
        correctIndex: 1,
        explanation: section.keyPoint,
      },
    ],
  };
}

function overviewLesson(course: SvtCourseSeed): LearningLesson {
  return {
    id: `${course.id}-overview`,
    title: "La carte de la leçon",
    summary: "Découvrir le problème biologique et les quatre étapes du parcours avant d’étudier les mécanismes.",
    durationMinutes: 10,
    xp: rewards[0],
    kind: "concept",
    concept: {
      eyebrow: "Niveau 1 • Vue d’ensemble",
      title: course.centralQuestion,
      explanation: `${course.description} Le parcours suit quatre étapes : ${course.sections.map((section) => section.title).join(" ; ")}.`,
      notation: course.memorySentence,
      example: "Au devoir, pars toujours du document : relève les faits, explique-les avec le cours, puis formule une conclusion liée à la consigne.",
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Vue d’ensemble",
      title: "Les quatre étapes de la leçon",
      instruction: "Sélectionne chaque étape pour comprendre son rôle dans le raisonnement.",
      items: course.sections.map((section) => ({ label: section.title, detail: section.summary })) as [TimelineInteractionItem, TimelineInteractionItem, TimelineInteractionItem, TimelineInteractionItem],
      observation: "Comprendre l’enchaînement des étapes facilite la mémorisation des termes scientifiques.",
    },
    method: {
      eyebrow: "Réflexe évaluation",
      title: "Lire une situation-problème",
      introduction: "Une situation d’évaluation indique un problème concret et les connaissances à mobiliser.",
      steps: [
        "Repère le phénomène biologique étudié.",
        "Souligne les verbes des consignes : identifier, expliquer, déduire ou justifier.",
        "Associe chaque document à une partie du cours.",
        "Réponds avec une observation, une explication et une conclusion.",
      ],
      example: {
        prompt: course.title,
        work: `Problème : ${course.centralQuestion}`,
        result: course.memorySentence,
      },
      tip: "Ne récite pas toute la leçon : sélectionne uniquement les connaissances utiles à la consigne.",
    },
    question: {
      prompt: "Quelle démarche correspond à une réponse scientifique complète ?",
      options: ["Observer → interpréter → conclure", "Réciter → deviner → recopier", "Conclure avant d’observer", "Donner uniquement son opinion"],
      correctIndex: 0,
      explanation: "On décrit d’abord les faits, puis on les explique avant de répondre au problème.",
    },
    questions: [
      {
        prompt: "Quelle démarche correspond à une réponse scientifique complète ?",
        options: ["Observer → interpréter → conclure", "Réciter → deviner → recopier", "Conclure avant d’observer", "Donner uniquement son opinion"],
        correctIndex: 0,
        explanation: "On décrit d’abord les faits, puis on les explique avant de répondre au problème.",
      },
      {
        prompt: "Quel élément faut-il repérer en premier dans une situation d’évaluation ?",
        options: ["Le phénomène biologique et les verbes de consigne", "La longueur du PDF", "La note espérée", "Les mots à recopier sans les comprendre"],
        correctIndex: 0,
        explanation: "Le phénomène et les verbes de consigne indiquent quelles connaissances et quelle démarche utiliser.",
      },
    ],
  };
}

function missionLesson(course: SvtCourseSeed): LearningLesson {
  const mission = course.mission;
  return {
    id: `${course.id}-mission-finale`,
    title: "Mission finale",
    summary: mission.title,
    durationMinutes: 20,
    xp: rewards[5],
    kind: "challenge",
    concept: {
      eyebrow: "Niveau 6 • Situation d’évaluation",
      title: mission.title,
      explanation: mission.scenario,
      notation: mission.problem,
      example: mission.modelAnswer,
    },
    interaction: {
      kind: "timeline",
      eyebrow: "Enquêter",
      title: "Le chemin de résolution",
      instruction: "Parcours chaque étape avant de répondre aux questions.",
      items: mission.investigation,
      observation: "Chaque conclusion doit être appuyée par un résultat ou un mécanisme précis.",
    },
    method: {
      eyebrow: "Méthode évaluation",
      title: "Construire une réponse démontrée",
      introduction: "La mission finale vérifie que tu sais transférer le cours vers une situation nouvelle.",
      steps: [
        "Identifie le phénomène et les informations utiles.",
        "Présente les résultats du document sans les déformer.",
        "Explique-les avec le mécanisme appris.",
        "Conclue en répondant exactement à la consigne.",
      ],
      example: {
        prompt: mission.title,
        work: mission.investigation.map((item) => item.label).join(" → "),
        result: mission.modelAnswer,
      },
      tip: "Un terme scientifique précis vaut mieux qu’une longue phrase vague.",
    },
    question: mission.questions[0],
    questions: mission.questions,
  };
}

export function createSvtPath(course: SvtCourseSeed): LearningPath {
  const contentLessons = course.sections.map((section, index) => sectionLesson(course, section, index + 1));
  const lessons = [overviewLesson(course), ...contentLessons, missionLesson(course)];
  return {
    id: course.id,
    subjectId: "svt",
    levelIds: ["terminale-a"],
    curriculumLabel: "Programme ivoirien • Terminale A • Côte d’Ivoire École Numérique",
    curriculumSourceUrl: "https://www.ecole-ci.online/",
    theme: { number: course.themeNumber, title: course.themeTitle },
    chapterNumber: course.chapterNumber,
    title: course.title,
    description: course.description,
    estimatedMinutes: lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0),
    outcomes: [
      ...course.sections.map((section) => section.summary),
      "Résoudre une situation d’évaluation en observant, interprétant et concluant.",
    ],
    modules: [{
      id: `${course.id}-mastery`,
      title: `Maîtriser « ${course.title} »`,
      description: "Cinq niveaux courts pour comprendre les mécanismes, puis une mission finale inspirée du cours officiel.",
      lessons,
    }],
  };
}
