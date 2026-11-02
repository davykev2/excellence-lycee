import type { CourseDocument } from "../../domain/courseDocument";
import { terminalCPrimitivesSummary } from "./terminalCPrimitivesSummary";
import { terminalCPrimitivesEvaluations } from "./terminalCPrimitivesEvaluations";

export const terminalCPrimitivesDocument: CourseDocument = {
  id: "tc-analysis-l3-primitives-summary", version: 1, levelIds: ["terminale-c"],
  source: {
    title: "Pyramide · Terminale C · Tome 1 · Primitives", lessonLabel: "Tome 1 · Leçon 3",
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    pageCount: 268, summaryPages: [83, 84, 85], evaluationPages: [86, 87],
    editorialNotes: [
      "Leçon 3 du tome Analyse et probabilité, path historique L06 conservé. Résumé folios 81–83, évaluation 84–85 ; pages PDF +2. Activités introductives exclues.",
      "Folio 82 : primitive de x^r corrigée en +x^(r+1)/(r+1), avec r différent de -1 ; constantes ajoutées à sin et cos. Domaine x>0 pour la puissance rationnelle générale.",
      "Folio 83 : u>0 pour u′u^r à exposant rationnel général, pas u<0 pour r<0 ; cos(u) non nul pour la tangente composée. Exemple 3 : facteur 2 rétabli dans 2sqrt(3x+5).",
      "Folio 85 : la primitive de x^3 est x^4/4, non 2x^3/3. Calcul final du support conservé : C=-35/12.",
      "Les 5 groupes d’exemples du résumé et 3 exemples corrigés de l’évaluation reprennent le support. Les corrections des trois applications sont produites par Excellence. Trois réponses objectives et trois justifications rédigées ; aucun barème officiel ni note automatique sur les preuves.",
      "Les 13 IDs, poids, 101 questions et feedbacks de l’ancien parcours sont conservés derrière cette présentation. Document réservé à C ; aucune extension tacite à D.",
    ],
  },
  sections: terminalCPrimitivesSummary, evaluations: terminalCPrimitivesEvaluations,
  legacyAnchors: {
    "primitive-definition": "primitive-definition-summary",
    "primitive-existence": "primitive-existence-summary",
    "primitive-family": "primitive-family-summary",
    "primitive-initial-value": "primitive-initial-summary",
    "usual-primitives": "primitive-usual-summary",
    "primitive-linearity": "primitive-linearity-summary",
    "composite-primitives": "primitive-composites-summary",
    "bus-cost-mission": "primitive-composites-summary",
    "official-applications-workshop": "primitive-composites-summary",
    "radical-coefficients-reinforcement": "primitive-composites-summary",
    "derivative-links-reinforcement": "primitive-composites-summary",
    "composite-reinforcement-workshop": "primitive-composites-summary",
    "advanced-primitives-mission": "primitive-composites-summary",
  },
};
