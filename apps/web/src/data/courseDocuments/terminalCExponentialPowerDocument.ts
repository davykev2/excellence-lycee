import type { CourseDocument } from "../../domain/courseDocument";
import { terminalCExponentialPowerSummary } from "./terminalCExponentialPowerSummary";
import { terminalCExponentialPowerEvaluations } from "./terminalCExponentialPowerEvaluations";

export const terminalCExponentialPowerDocument: CourseDocument = {
  id: "tc-analysis-l5-exponential-power-summary", version: 1, levelIds: ["terminale-c"],
  source: { title: "Pyramide · Terminale C · Tome 1 · Fonctions exponentielles et fonctions puissances", lessonLabel: "Tome 1 · Leçon 5", pageCount: 268,
    summaryPages: [124, 125, 126, 127, 128], evaluationPages: [129, 130], sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "Chapitre 5 Analyse et probabilité, raccord au path historique L10, sans renumérotation ni modification de ses 8 IDs/poids/128 questions/10 000 XP. Document C seulement. Activités introductives exclues.",
      "Folios 122–126 : exp définie sur R et à valeurs strictement positives ; les ambiguïtés R* de la source ne réduisent pas son domaine. Base 1 traitée comme constante, non comme bijection.",
      "Folio 125 : limite en +infini pour a>1 rétablie avec x au dénominateur de a^x/x ; pas ln a à sa place. Les branches paraboliques sont justifiées par le rapport à x.",
      "Folio 126 : primitive de (-2+ln x)^sqrt(3)/x sur ]e²;+infini[, pas ]0;+infini[ ; u>0 et alpha différent de -1, sans fausse condition alpha positif. Les variations générales des puissances prolongent explicitement la définition du support.",
      "Folio 127 : g(x)=exp(1/(2-sqrt(x))) transcrit selon la racine ; domaine [0;4[ union ]4;+infini[. Folio 128 : inéquation exp(2x²-1)>1 (et non équation). Les quatre applications sont corrigées par Excellence ; quatre résultats objectifs et deux rédactions non notées.",
    ],
  }, sections: terminalCExponentialPowerSummary, evaluations: terminalCExponentialPowerEvaluations,
  legacyAnchors: { "exp-properties": "exp-definition-summary", "exp-equations": "exp-definition-summary", "exp-limits": "exp-limits-summary", "exp-derivative": "exp-derivative-summary", "exp-primitives": "exp-primitives-summary", "real-powers": "exp-real-powers-summary", "power-equations": "exp-base-summary", "growth-comparison": "exp-growth-summary" },
};
