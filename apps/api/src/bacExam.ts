export const BAC_CI_2024_EXAM_ID = "bac-ci-2024-level-test";

export type BacExamChoice = "A" | "B" | "C" | "D";
export type BacExamAnswers = Record<string, BacExamChoice>;

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

const bacExamSectionQuestionNumbers = {
  english: Array.from({ length: 20 }, (_, index) => index + 1),
  generalKnowledge: [
    ...Array.from({ length: 20 }, (_, index) => index + 21),
    ...Array.from({ length: 5 }, (_, index) => index + 61),
  ],
  scientificKnowledge: [
    ...Array.from({ length: 20 }, (_, index) => index + 41),
    ...Array.from({ length: 4 }, (_, index) => index + 66),
  ],
} as const;

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
): BacExamSectionScores {
  return {
    english: scoreBacExamSection(answers, answerKey, bacExamSectionQuestionNumbers.english),
    generalKnowledge: scoreBacExamSection(answers, answerKey, bacExamSectionQuestionNumbers.generalKnowledge),
    scientificKnowledge: scoreBacExamSection(answers, answerKey, bacExamSectionQuestionNumbers.scientificKnowledge),
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
