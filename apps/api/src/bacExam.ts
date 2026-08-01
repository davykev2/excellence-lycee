export const BAC_CI_2024_EXAM_ID = "bac-ci-2024-level-test";
export const BAC_CI_2017_EXAM_ID = "bac-ci-2017-archive";
export const BAC_CI_2018_EXAM_ID = "bac-ci-2018-archive";
export const BAC_CI_2019_EXAM_ID = "bac-ci-2019-archive";
export const BAC_CI_2020_EXAM_ID = "bac-ci-2020-archive";
export const BAC_CI_2022_EXAM_ID = "bac-ci-2022-archive";
export const BAC_CI_2023_EXAM_ID = "bac-ci-2023-archive";

export type BacExamChoice = "A" | "B" | "C" | "D" | "E";
export type BacExamAnswers = Record<string, BacExamChoice>;
export type BacExamZone = "cocody" | "bingerville" | "yopougon" | "online";

export const BAC_EXAM_ZONES: readonly BacExamZone[] = ["cocody", "bingerville", "yopougon", "online"];

export const BAC_EXAM_IDS = [
  BAC_CI_2017_EXAM_ID,
  BAC_CI_2018_EXAM_ID,
  BAC_CI_2019_EXAM_ID,
  BAC_CI_2020_EXAM_ID,
  BAC_CI_2022_EXAM_ID,
  BAC_CI_2023_EXAM_ID,
  BAC_CI_2024_EXAM_ID,
] as const;

export type BacExamId = typeof BAC_EXAM_IDS[number];

export interface BacExamConfiguration {
  id: BacExamId;
  title: string;
  durationMinutes: number;
  questionCount: number;
  allowedChoices: readonly BacExamChoice[];
  sectionQuestionNumbers: {
    english: readonly number[];
    generalKnowledge: readonly number[];
    scientificKnowledge: readonly number[];
  };
}

const standardSixtyQuestionSections = {
  english: Array.from({ length: 20 }, (_, index) => index + 1),
  generalKnowledge: Array.from({ length: 20 }, (_, index) => index + 21),
  scientificKnowledge: Array.from({ length: 20 }, (_, index) => index + 41),
};

export const BAC_EXAM_CONFIGURATIONS: readonly BacExamConfiguration[] = [
  {
    id: BAC_CI_2017_EXAM_ID,
    title: "Sujet type BAC — Session 2017",
    durationMinutes: 180,
    questionCount: 86,
    allowedChoices: ["A", "B", "C", "D"],
    sectionQuestionNumbers: {
      english: Array.from({ length: 29 }, (_, index) => index + 1),
      generalKnowledge: Array.from({ length: 34 }, (_, index) => index + 30),
      scientificKnowledge: Array.from({ length: 23 }, (_, index) => index + 64),
    },
  },
  {
    id: BAC_CI_2018_EXAM_ID,
    title: "Sujet type BAC — Session 2018",
    durationMinutes: 180,
    questionCount: 60,
    allowedChoices: ["A", "B", "C", "D", "E"],
    sectionQuestionNumbers: standardSixtyQuestionSections,
  },
  {
    id: BAC_CI_2019_EXAM_ID,
    title: "Sujet type BAC — Session 2019",
    durationMinutes: 180,
    questionCount: 60,
    allowedChoices: ["A", "B", "C", "D", "E"],
    sectionQuestionNumbers: standardSixtyQuestionSections,
  },
  {
    id: BAC_CI_2020_EXAM_ID,
    title: "Sujet type BAC — Session 2020",
    durationMinutes: 180,
    questionCount: 60,
    allowedChoices: ["A", "B", "C", "D"],
    sectionQuestionNumbers: standardSixtyQuestionSections,
  },
  {
    id: BAC_CI_2022_EXAM_ID,
    title: "Sujet type BAC — Session 2022",
    durationMinutes: 180,
    questionCount: 41,
    allowedChoices: ["A", "B", "C", "D"],
    sectionQuestionNumbers: {
      english: Array.from({ length: 15 }, (_, index) => index + 27),
      generalKnowledge: Array.from({ length: 9 }, (_, index) => index + 18),
      scientificKnowledge: Array.from({ length: 17 }, (_, index) => index + 1),
    },
  },
  {
    id: BAC_CI_2023_EXAM_ID,
    title: "Sujet type BAC — Session 2023",
    durationMinutes: 180,
    questionCount: 43,
    allowedChoices: ["A", "B", "C", "D"],
    sectionQuestionNumbers: {
      english: Array.from({ length: 20 }, (_, index) => index + 1),
      generalKnowledge: Array.from({ length: 20 }, (_, index) => index + 21),
      scientificKnowledge: Array.from({ length: 3 }, (_, index) => index + 41),
    },
  },
  {
    id: BAC_CI_2024_EXAM_ID,
    title: "Concours BAC & BT 2024 — Test de niveau",
    durationMinutes: 180,
    questionCount: 69,
    allowedChoices: ["A", "B", "C", "D"],
    sectionQuestionNumbers: {
      english: Array.from({ length: 20 }, (_, index) => index + 1),
      generalKnowledge: [
        ...Array.from({ length: 20 }, (_, index) => index + 21),
        ...Array.from({ length: 5 }, (_, index) => index + 61),
      ],
      scientificKnowledge: [
        ...Array.from({ length: 20 }, (_, index) => index + 41),
        ...Array.from({ length: 4 }, (_, index) => index + 66),
      ],
    },
  },
] as const;

export function getBacExamConfiguration(examId: string) {
  return BAC_EXAM_CONFIGURATIONS.find((configuration) => configuration.id === examId);
}

export interface BacExamCorrectionEntry {
  answer: BacExamChoice;
  explanation?: string;
  warning?: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface BacExamAppreciation {
  label: string;
  message: string;
}

export interface BacExamSectionScore {
  correctAnswers: number;
  scoreMax: number;
}

export interface BacExamSectionScores {
  english: BacExamSectionScore;
  generalKnowledge: BacExamSectionScore;
  scientificKnowledge: BacExamSectionScore;
}

export interface BacExamParticipantResult {
  userId: string;
  name: string;
  email: string;
  levelId: string;
  photoUrl?: string;
  candidateZone?: BacExamZone;
  submittedAt: string;
  correctAnswers: number;
  scoreMax: number;
  sectionScores: BacExamSectionScores;
  appreciation: BacExamAppreciation;
}

export interface BacExamState {
  examId: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  subjectPublished: boolean;
  resultsPublished: boolean;
  answerKeyReady: boolean;
  correctionReady: boolean;
  canPublishResults: boolean;
  canManageSubject: boolean;
  submittedAt?: string;
  submittedAnswers?: BacExamAnswers;
  candidateZone?: BacExamZone;
  totalSubmissions?: number;
  result?: {
    correctAnswers: number;
    scoreMax: number;
    scoreOutOf20?: number;
    sectionScores: BacExamSectionScores;
    appreciation: BacExamAppreciation;
    corrections: Record<string, BacExamCorrectionEntry>;
  };
}

function bacExamQuestionKey(questionNumber: number) {
  return `q${String(questionNumber).padStart(2, "0")}`;
}

function scoreBacExamSection(
  answers: BacExamAnswers,
  answerKey: Record<string, BacExamChoice>,
  questionNumbers: readonly number[],
): BacExamSectionScore {
  return {
    correctAnswers: questionNumbers.reduce((total, questionNumber) => {
      const key = bacExamQuestionKey(questionNumber);
      return total + (answers[key] === answerKey[key] ? 1 : 0);
    }, 0),
    scoreMax: questionNumbers.length,
  };
}

export function getBacExamSectionScores(
  answers: BacExamAnswers,
  answerKey: Record<string, BacExamChoice>,
  examId = BAC_CI_2024_EXAM_ID,
): BacExamSectionScores {
  const questionNumbers = getBacExamConfiguration(examId)?.sectionQuestionNumbers
    ?? getBacExamConfiguration(BAC_CI_2024_EXAM_ID)!.sectionQuestionNumbers;
  return {
    english: scoreBacExamSection(answers, answerKey, questionNumbers.english),
    generalKnowledge: scoreBacExamSection(answers, answerKey, questionNumbers.generalKnowledge),
    scientificKnowledge: scoreBacExamSection(answers, answerKey, questionNumbers.scientificKnowledge),
  };
}

export function getBacExamAppreciation(
  correctAnswers: number,
  questionCount: number,
): BacExamAppreciation {
  const percentage = questionCount > 0 ? (correctAnswers * 100) / questionCount : 0;
  if (percentage >= 90) {
    return {
      label: "Excellent",
      message: "Performance remarquable. Tu maîtrises très bien l’ensemble du sujet.",
    };
  }
  if (percentage >= 80) {
    return {
      label: "Très bien",
      message: "Très belle maîtrise. Quelques points seulement restent à consolider.",
    };
  }
  if (percentage >= 70) {
    return {
      label: "Bien",
      message: "Bon niveau général. Corrige tes dernières erreurs pour progresser encore.",
    };
  }
  if (percentage >= 60) {
    return {
      label: "Assez bien",
      message: "Ensemble satisfaisant. Consolide les notions encore fragiles.",
    };
  }
  if (percentage >= 50) {
    return {
      label: "Passable",
      message: "Les bases sont présentes. Une révision ciblée te fera gagner des points.",
    };
  }
  return {
    label: "Insuffisant",
    message: "Des bases restent à renforcer. Appuie-toi sur la correction pour reprendre chaque difficulté.",
  };
}
