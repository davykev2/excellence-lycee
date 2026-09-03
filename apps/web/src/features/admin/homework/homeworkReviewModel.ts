import type {
  HomeworkQuestionReviewPayload,
  HomeworkReviewDetail,
  HomeworkReviewPayload,
  HomeworkReviewQuestion,
} from "./homeworkReviewTypes";

export interface HomeworkQuestionReviewDraft {
  pointsAwarded: number;
  comment: string;
  criteria: Record<string, number>;
}

export type HomeworkReviewDrafts = Record<string, HomeworkQuestionReviewDraft>;

export interface HomeworkReviewTotals {
  automatic: number;
  manual: number;
  awarded: number;
  maximum: number;
  manualMaximum: number;
  scoreOutOf20: number;
}

const finiteNonNegative = (value: unknown) => (
  typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : 0
);

export function questionMaximum(question: HomeworkReviewQuestion) {
  return finiteNonNegative(question.points);
}

export function questionManualMaximum(question: HomeworkReviewQuestion) {
  if (question.isNeutralized || question.gradingMode === "auto") return 0;
  if (question.manualPoints != null) {
    return Math.min(questionMaximum(question), finiteNonNegative(question.manualPoints));
  }
  return question.gradingMode === "manual" ? questionMaximum(question) : 0;
}

export function questionAutomaticPoints(question: HomeworkReviewQuestion) {
  if (question.isNeutralized) return questionMaximum(question);
  if (question.gradingMode === "manual") return 0;
  const awarded = question.autoPointsAwarded
    ?? (question.gradingMode === "auto" ? question.pointsAwarded : 0)
    ?? 0;
  const automaticMaximum = Math.max(0, questionMaximum(question) - questionManualMaximum(question));
  return Math.min(automaticMaximum, finiteNonNegative(awarded));
}

export function questionHasStudentSubmission(question: HomeworkReviewQuestion) {
  if (question.attachmentUrls.length > 0) return true;
  if (typeof question.studentAnswer === "string") return Boolean(question.studentAnswer.trim());
  if (!question.studentAnswer || typeof question.studentAnswer !== "object") return false;
  return Boolean(question.studentAnswer.finalAnswer?.trim() || question.studentAnswer.reasoning?.trim());
}

export function questionNeedsManualReview(question: HomeworkReviewQuestion) {
  return !question.isNeutralized
    && question.gradingMode !== "auto"
    && questionManualMaximum(question) > 0
    && questionHasStudentSubmission(question);
}

export function manualQuestionPoints(
  question: HomeworkReviewQuestion,
  draft: HomeworkQuestionReviewDraft | undefined,
) {
  if (!questionNeedsManualReview(question)) return 0;
  if (!draft) {
    if (question.manualPointsAwarded != null) return finiteNonNegative(question.manualPointsAwarded);
    return finiteNonNegative(question.manualPointsAwarded ?? question.pointsAwarded);
  }
  if (question.rubricCriteria.length > 0) {
    return question.rubricCriteria.reduce(
      (sum, criterion) => sum + finiteNonNegative(draft.criteria[criterion.id]),
      0,
    );
  }
  return finiteNonNegative(draft.pointsAwarded);
}

export function createHomeworkReviewDrafts(detail: HomeworkReviewDetail): HomeworkReviewDrafts {
  return Object.fromEntries(detail.questions
    .filter(questionNeedsManualReview)
    .map((question) => {
      const criteria = Object.fromEntries(question.rubricCriteria.map((criterion) => [
        criterion.id,
        finiteNonNegative(criterion.pointsAwarded),
      ]));
      const criterionTotal = Object.values(criteria).reduce((sum, value) => sum + value, 0);
      return [question.id, {
        pointsAwarded: question.rubricCriteria.length > 0
          ? criterionTotal
          : manualQuestionPoints(question, undefined),
        comment: question.reviewComment ?? "",
        criteria,
      } satisfies HomeworkQuestionReviewDraft];
    }));
}

export function calculateHomeworkReviewTotals(
  questions: HomeworkReviewQuestion[],
  drafts: HomeworkReviewDrafts,
): HomeworkReviewTotals {
  const maximum = questions.reduce((sum, question) => sum + questionMaximum(question), 0);
  const automatic = questions.reduce((sum, question) => sum + questionAutomaticPoints(question), 0);
  const manualMaximum = questions.reduce(
    (sum, question) => sum + (questionNeedsManualReview(question) ? questionManualMaximum(question) : 0),
    0,
  );
  const manual = questions.reduce(
    (sum, question) => sum + manualQuestionPoints(question, drafts[question.id]),
    0,
  );
  const awarded = Math.min(maximum, automatic + manual);
  const scoreOutOf20 = maximum > 0 ? Math.round((20 * awarded / maximum) * 100) / 100 : 0;
  return { automatic, manual, awarded, maximum, manualMaximum, scoreOutOf20 };
}

export function validateHomeworkReviewDrafts(
  questions: HomeworkReviewQuestion[],
  drafts: HomeworkReviewDrafts,
) {
  const errors: Record<string, string> = {};

  for (const question of questions) {
    if (!questionNeedsManualReview(question)) continue;
    const draft = drafts[question.id];
    if (!draft) {
      errors[question.id] = "Cette réponse doit être évaluée avant la validation.";
      continue;
    }

    const maximum = questionManualMaximum(question);
    const awarded = manualQuestionPoints(question, draft);
    if (awarded > maximum) {
      errors[question.id] = `Le total attribué ne peut pas dépasser ${maximum} point${maximum > 1 ? "s" : ""}.`;
      continue;
    }

    const invalidCriterion = question.rubricCriteria.find((criterion) => {
      const value = draft.criteria[criterion.id];
      return !Number.isFinite(value) || value < 0 || value > criterion.pointsMax;
    });
    if (invalidCriterion) {
      errors[question.id] = `Vérifie le critère « ${invalidCriterion.label} ».`;
    }
  }

  return errors;
}

function reviewPayloadForQuestion(
  question: HomeworkReviewQuestion,
  draft: HomeworkQuestionReviewDraft,
): HomeworkQuestionReviewPayload {
  const pointsAwarded = manualQuestionPoints(question, draft);
  const comment = draft.comment.trim();
  return {
    questionId: question.id,
    pointsAwarded,
    ...(comment ? { comment } : {}),
    ...(question.rubricCriteria.length > 0 ? {
      criteria: question.rubricCriteria.map((criterion) => ({
        id: criterion.id,
        pointsAwarded: finiteNonNegative(draft.criteria[criterion.id]),
      })),
    } : {}),
  };
}

export function createHomeworkReviewPayload(
  questions: HomeworkReviewQuestion[],
  drafts: HomeworkReviewDrafts,
  overallComment: string,
): HomeworkReviewPayload {
  const errors = validateHomeworkReviewDrafts(questions, drafts);
  if (Object.keys(errors).length > 0) {
    throw new Error("La correction contient encore des points à vérifier.");
  }

  const comment = overallComment.trim();
  return {
    reviews: questions
      .filter(questionNeedsManualReview)
      .map((question) => reviewPayloadForQuestion(question, drafts[question.id])),
    ...(comment ? { overallComment: comment } : {}),
  };
}
