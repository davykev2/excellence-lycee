import type { CourseDocument } from "../../domain/courseDocument";
import { terminalCLimitsEvaluations } from "./terminalCLimitsEvaluations";
import { terminalCLimitsSummary } from "./terminalCLimitsSummary";

export const terminalCLimitsContinuityDocument: CourseDocument = {
  id: "tc-l1-limits-summary", version: 1,
  levelIds: ["terminale-c"],
  source: {
    title: "L1 · Limite et continuité",
    pageCount: 17,
    summaryPages: Array.from({ length: 14 }, (_, index) => index + 1),
    evaluationPages: [15, 16, 17],
  },
  sections: terminalCLimitsSummary,
  evaluations: terminalCLimitsEvaluations,
  legacyAnchors: {
    "limit-composition": "composition-limit",
    "monotone-finite-limit": "monotone-limit",
    "parabolic-branches": "parabolic-branches",
    "continuous-extension": "continuous-extension",
    "continuous-image-interval": "image-interval",
    "continuity-operations": "continuity-operations",
    "continuous-bijection-inverse": "bijection-inverse",
    "intermediate-value-theorem": "intermediate-value",
    "rational-powers": "power-laws",
    "complete-function-study-mission": "power-laws",
  },
};
