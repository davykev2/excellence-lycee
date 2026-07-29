import { useCallback, useEffect, useState } from "react";
import { BAC_CI_2024_EXAM_ID } from "../../data/bacCi2024Exam";
import type { BacExamParticipantResult } from "../../domain/bacExam";
import { apiRequest } from "../../lib/api";

const previewItems: BacExamParticipantResult[] = [
  {
    userId: "preview-awa",
    name: "Awa Koné",
    email: "awa.kone@excellence.ci",
    levelId: "terminale-c",
    submittedAt: "2026-07-29T09:18:00.000Z",
    correctAnswers: 61,
    scoreMax: 69,
    sectionScores: {
      english: { correctAnswers: 18, scoreMax: 20 },
      generalKnowledge: { correctAnswers: 22, scoreMax: 25 },
      scientificKnowledge: { correctAnswers: 21, scoreMax: 24 },
    },
    appreciation: {
      label: "Excellent",
      message: "Une maîtrise remarquable de l’ensemble de l’épreuve.",
    },
  },
  {
    userId: "preview-moussa",
    name: "Moussa Traoré",
    email: "moussa.traore@excellence.ci",
    levelId: "terminale-d",
    submittedAt: "2026-07-29T09:27:00.000Z",
    correctAnswers: 52,
    scoreMax: 69,
    sectionScores: {
      english: { correctAnswers: 16, scoreMax: 20 },
      generalKnowledge: { correctAnswers: 19, scoreMax: 25 },
      scientificKnowledge: { correctAnswers: 17, scoreMax: 24 },
    },
    appreciation: {
      label: "Très bien",
      message: "Un très bon résultat, avec des acquis solides.",
    },
  },
  {
    userId: "preview-ange",
    name: "Ange N’Guessan",
    email: "ange.nguessan@excellence.ci",
    levelId: "terminale-a",
    submittedAt: "2026-07-29T10:04:00.000Z",
    correctAnswers: 41,
    scoreMax: 69,
    sectionScores: {
      english: { correctAnswers: 14, scoreMax: 20 },
      generalKnowledge: { correctAnswers: 14, scoreMax: 25 },
      scientificKnowledge: { correctAnswers: 13, scoreMax: 24 },
    },
    appreciation: {
      label: "Bien",
      message: "Un résultat satisfaisant et une bonne base de travail.",
    },
  },
  {
    userId: "preview-fatou",
    name: "Fatou Coulibaly",
    email: "fatou.coulibaly@excellence.ci",
    levelId: "terminale-c",
    submittedAt: "2026-07-29T10:12:00.000Z",
    correctAnswers: 29,
    scoreMax: 69,
    sectionScores: {
      english: { correctAnswers: 10, scoreMax: 20 },
      generalKnowledge: { correctAnswers: 11, scoreMax: 25 },
      scientificKnowledge: { correctAnswers: 8, scoreMax: 24 },
    },
    appreciation: {
      label: "Passable",
      message: "Des acquis sont présents, mais plusieurs points restent à renforcer.",
    },
  },
];

export function useBacExamParticipantResults({ preview = false }: { preview?: boolean } = {}) {
  const [items, setItems] = useState<BacExamParticipantResult[]>(preview ? previewItems : []);
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (preview) {
      setItems(previewItems);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiRequest<{ items: BacExamParticipantResult[]; total: number }>(
        `/bac-exams/${BAC_CI_2024_EXAM_ID}/participant-results`,
      );
      setItems(response.items);
    } catch (loadError) {
      setError(loadError instanceof Error
        ? loadError.message
        : "Les notes des participants n’ont pas pu être chargées.");
    } finally {
      setLoading(false);
    }
  }, [preview]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { items, loading, error, reload };
}
