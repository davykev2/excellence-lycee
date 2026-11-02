import type { CourseDocument } from "../../domain/courseDocument";
import { terminalCLogarithmsSummary } from "./terminalCLogarithmsSummary";
import { terminalCLogarithmsEvaluations } from "./terminalCLogarithmsEvaluations";

export const terminalCLogarithmsDocument: CourseDocument = {
  id: "tc-analysis-l4-logarithms-summary", version: 1, levelIds: ["terminale-c"],
  source: { title: "Pyramide · Terminale C · Tome 1 · Fonctions logarithmes", lessonLabel: "Tome 1 · Leçon 4",
    pageCount: 268, summaryPages: [101, 102, 103], evaluationPages: [104, 105],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "Chapitre 4 du tome Analyse et probabilité, raccord au path historique L08 sans modifier le catalogue global. Résumé folios 99–101 ; évaluation 102–103 ; pages PDF +2. Activités d’apprentissage exclues.",
      "Folio 100 : limite de ln(1+x)/x prise en 0, pas en 1. Bijection de ln justifiée par les limites ; signe strict de l’argument conservé.",
      "Folio 103 : le domaine du quotient (1-x)/(2+x) est R privé de -2, non de 2 ; logarithme dérivable sur ]-2;1[. Pour ln|u|, u doit être dérivable et non nul ; ln(-u) lorsque u<0.",
      "Les huit groupes d’exemples du résumé et les trois modèles corrigés viennent du support, reformulés et détaillés. Corrections des trois applications non corrigées produites par Excellence ; cinq réponses objectives et deux rédactions, sans prétendre à un barème officiel.",
      "Les 11 identifiants, poids et anciennes questions du parcours restent inchangés, avec conservation des fils de feedback. Le document est réservé à la Terminale C, sans extension implicite à D.",
    ],
  },
  sections: terminalCLogarithmsSummary, evaluations: terminalCLogarithmsEvaluations,
  legacyAnchors: {
    "natural-log-definition": "log-definition-summary", "log-algebra": "log-algebra-summary", "log-equations": "log-algebra-summary",
    "log-limits": "log-limits-summary", "log-limit-fixation-workshop": "log-limits-summary", "log-derivative": "log-derivative-summary",
    "log-primitives": "log-primitives-summary", "other-log-bases": "log-bases-summary", "revenue-log-mission": "log-limits-summary",
    "official-log-workshop": "log-limits-summary", "log-rational-function-mission": "log-limits-summary",
  },
};
