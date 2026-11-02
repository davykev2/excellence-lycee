import type { CourseDocument } from "../../domain/courseDocument";
import { terminalCSequencesSummary } from "./terminalCSequencesSummary";
import { terminalCSequencesEvaluations } from "./terminalCSequencesEvaluations";

export const terminalCSequencesDocument: CourseDocument = {
  id: "tc-analysis-l6-sequences-summary", version: 1, levelIds: ["terminale-c"],
  source: {
    title: "Pyramide · Terminale C · Tome 1 · Suites numériques", lessonLabel: "Tome 1 · Leçon 6", pageCount: 268,
    summaryPages: [146, 147, 148, 149], evaluationPages: [150, 151, 152],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "Résumé folios 144–147, évaluation 148–150, inspection visuelle intégrale. Leçon 6 du tome Analyse et probabilité, path historique L12 C ; pas de renumérotation du catalogue ni d’altération des 8 IDs/poids/79 questions/10 000 XP. Document C seulement.",
      "Folio 144 : u13 imprimé corrigé en u15 dans la somme des quinze termes ; cas q=1 ajouté, q=0 sans recours à 0^0. Bornes fixes et rangs consécutifs explicités.",
      "Folio 145 : composition avec limite précisée (continuité au point atteint, ou termes différents du point à partir d’un rang). Point fixe valable si f est continue à la limite et celle-ci dans son domaine ; appartenir à un intervalle ouvert ne suffit pas.",
      "Folio 146 : le second théorème de comparaison conclut lim u_n=-infini, pas lim v_n=-infini répété ; borne supérieure 1/n+3 dans les gendarmes. Base négative conservée dans l’exemple (-sqrt2/2)^n.",
      "Folio 148 : -2n <=0 sur N, et non <0 au rang0. Le quotient de monotonie requiert des termes strictement positifs ; l’étude de f donne une condition suffisante, pas une réciproque.",
      "Folios 149–150 : récurrence imprimée u_next=u/2+4 conservée. La borne correcte est 8, non4 ; solution intégralement réalignée sur 8, v=u-8, v0=-6, u=8-6/2^n et limite8. Les fragments +2 et u_k<=3 n’étaient pas cohérents avec l’énoncé et la fin de la solution.",
      "Trois applications du support corrigées par Excellence : preuves non notées automatiquement ; trois résultats objectifs constituent seulement un diagnostic local. Notices éditoriales non affichées à l’élève.",
    ],
  },
  sections: terminalCSequencesSummary, evaluations: terminalCSequencesEvaluations,
  legacyAnchors: {
    "sequence-induction": "seq-usual-summary", "sequence-monotonicity": "seq-monotonicity-summary",
    "sequence-limit-algebra": "seq-bounds-summary", "monotone-convergence": "seq-monotone-convergence-summary",
    "reference-sequences": "seq-geometric-summary", "sequence-growth": "seq-growth-summary",
    "small-angle-sequence": "seq-limit-summary", "recursive-sequence-limit": "seq-recursion-summary",
  },
};
