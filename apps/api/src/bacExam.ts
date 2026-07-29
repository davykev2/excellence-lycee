export const BAC_CI_2024_EXAM_ID = "bac-ci-2024-level-test";

export type BacExamChoice = "A" | "B" | "C" | "D";
export type BacExamAnswers = Record<string, BacExamChoice>;

export interface BacExamCorrectionEntry {
  answer: BacExamChoice;
  explanation?: string;
}

export interface BacExamState {
  examId: string;
  title: string;
  durationMinutes: number;
  questionCount: number;
  resultsPublished: boolean;
  answerKeyReady: boolean;
  canPublishResults: boolean;
  submittedAt?: string;
  submittedAnswers?: BacExamAnswers;
  totalSubmissions?: number;
  result?: {
    correctAnswers: number;
    scoreOutOf20: number;
    corrections: Record<string, BacExamCorrectionEntry>;
  };
}
