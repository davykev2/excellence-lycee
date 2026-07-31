import type { BacExamAnswers, BacExamChoiceId } from "../data/bacCi2024Exam";

export type BacExamZone = "cocody" | "bingerville" | "yopougon" | "online";

export const bacExamZones: readonly {
  id: BacExamZone;
  label: string;
  description: string;
}[] = [
  { id: "cocody", label: "Cocody", description: "Je suis rattaché au centre de Cocody." },
  { id: "bingerville", label: "Bingerville", description: "Je suis rattaché au centre de Bingerville." },
  { id: "yopougon", label: "Yopougon", description: "Je suis rattaché au centre de Yopougon." },
  { id: "online", label: "Cours en ligne", description: "Je suis les cours entièrement à distance." },
] as const;

export function bacExamZoneLabel(zone?: BacExamZone) {
  return bacExamZones.find((item) => item.id === zone)?.label ?? "Zone non renseignée";
}

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
