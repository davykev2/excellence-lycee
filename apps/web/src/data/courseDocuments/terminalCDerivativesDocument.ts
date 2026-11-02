import type { CourseDocument } from "../../domain/courseDocument";
import { terminalCDerivativesSummary } from "./terminalCDerivativesSummary";
import { terminalCDerivativesEvaluations } from "./terminalCDerivativesEvaluations";

export const terminalCDerivativesDocument: CourseDocument = {
  id: "tc-analysis-l2-derivatives-summary", version: 1, levelIds: ["terminale-c"],
  source: {
    title: "Pyramide · Terminale C · Tome 1 · Dérivabilité et étude de fonctions",
    lessonLabel: "Tome 1 · Leçon 2",
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    pageCount: 268,
    summaryPages: [59, 60, 61, 62, 63, 64],
    evaluationPages: [65, 66, 67],
    editorialNotes: [
      "Leçon 2 du tome Analyse et probabilité ; parcours historique L04 conservé dans le catalogue global à 19 leçons. Aucune renumérotation des ids, niveaux ou récompenses.",
      "Résumé : folios imprimés 57–62. Évaluation : folios 63–65. Les pages PDF sont décalées de +2. Activités introductives exclues ; banque des folios 66–74 non intégrée par ce lot de cours.",
      "Folio 57, premier exemple : les conditions x<0/x>=0 sont incompatibles avec les calculs au raccord 1. Raccord rétabli en x<1/x>=1, en conservant les expressions, la valeur f(1)=2 et le résultat f′(1)=2.",
      "Folio 58 : domaine de −sqrt(x) restreint à [0;+infini[, pas R. Folio 59 : image de 4−x² sur ]−2;2[ corrigée à ]0;4], pas ]0;2].",
      "Folio 61 : notation de dérivée seconde corrigée en f″, pas f‴ ; la courbe qui traverse sa tangente est C_f, pas C_g.",
      "Folio 63 : domaine de la fonction rationnelle par morceaux explicitement privé de 2. Deux nombres dérivés 1 et 27 au raccord3 ; continuité sans dérivabilité.",
      "Les 10 exemples du résumé et les 3 modèles corrigés sont issus du support, reformulés et détaillés. Les corrections des trois exercices non corrigés sont produites par Excellence ; leur décomposition en 5 réponses objectives et 2 rédactions est pédagogique, sans barème officiel prétendu.",
      "Les anciens ateliers/synthèses conservent leurs fils de feedback via les ancres du document. Ils ne sont pas présentés comme des parties supplémentaires du nouveau résumé.",
    ],
  },
  sections: terminalCDerivativesSummary,
  evaluations: terminalCDerivativesEvaluations,
  legacyAnchors: {
    "one-sided-derivatives": "lateral-derivatives",
    "derivative-at-junction": "lateral-derivatives",
    "vertical-half-tangent": "vertical-tangent",
    "derivative-on-interval-and-rules": "closed-interval-derivative",
    "derivative-composition": "chain-rule",
    "inverse-function-derivative": "inverse-derivative-summary",
    "successive-derivatives": "successive-derivatives-summary",
    "finite-increments": "finite-increments-summary",
    "lipschitz-bound": "finite-increments-summary",
    "complete-piecewise-function-study": "finite-increments-summary",
    "radical-function-study": "finite-increments-summary",
    "periodic-tangent-study": "finite-increments-summary",
    "cocoa-profit-mission": "finite-increments-summary",
    "corrected-exercises-workshop": "finite-increments-summary",
    "reinforcement-exercises-mission": "finite-increments-summary",
  },
};
