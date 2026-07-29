import type { BacExamAnswers, BacExamChoiceId } from "../data/bacCi2024Exam";

export interface BacExamCorrectionEntry {
  answer: BacExamChoiceId;
  explanation?: string;
  warning?: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface BacExamAppreciation {
  label: string;
  message: string;
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
    appreciation: BacExamAppreciation;
    corrections: Record<string, BacExamCorrectionEntry>;
  };
}
