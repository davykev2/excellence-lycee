import type { BacExamAnswers, BacExamChoiceId } from "../data/bacCi2024Exam";

export interface BacExamCorrectionEntry {
  answer: BacExamChoiceId;
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
