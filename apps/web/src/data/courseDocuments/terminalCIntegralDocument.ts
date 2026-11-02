import type { CourseDocument } from "../../domain/courseDocument";
import { integralSummaryA } from "./terminalCIntegralSummaryA";
import { integralSummaryB } from "./terminalCIntegralSummaryB";
import { terminalCIntegralEvaluations } from "./terminalCIntegralEvaluations";

export const terminalCIntegralDocument: CourseDocument = {
  id: "tc-analysis-l7-integral-summary", version: 1, levelIds: ["terminale-c"],
  source: {
    title: "Pyramide · Terminale C · Tome 1 · Calcul intégral", lessonLabel: "Tome 1 · Leçon 7", pageCount: 268,
    summaryPages: [170,171,172,173,174,175,176,177,178], evaluationPages: [179,180,181,182],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "Résumé folios168–176/PDF170–178, évaluation177–180/PDF179–182, tous inspectés visuellement. Leçon7 du tome Analyse et probabilité, path historique L15 C conservé ; 8 IDs/poids/153 questions/10 000 XP et compteur10 294 inchangés. Document C seulement, pas de migration.",
      "Positivité et comparaison : a<=b requis. L’exemple positif est étudié sur[-5;-2], pas[-2;5]. Une intégrale positive ne prouve pas que l’intégrande est partout positif.",
      "Fonction à borne variable : dérivée1/(1+x²), valeur en-1 nulle ; f(0)=pi/4 également expliquée par x=tan s pour répondre à l’énoncé, sans introduire une primitive arctan hors du support.",
      "Aire entre -x²-x+2 et2x+2 sur[-1;1], OI2cm/OJ1cm : coupure en0 ; aire3 unités, soit6cm². La source intégrait seulement[-1;0] et obtenait7/3cm².",
      "Rectangles : distinguer n rectangles et n+1 valeurs ; la somme avec les deux extrémités converge mais ne porte pas la même borne d’erreur. L’exemple n10 conserve ses bornes, arrondies vers l’extérieur ; une erreur proche0,00052 ne garantit pas5e-4.",
      "Méthode trigonométrique : une puissance impaire suffit, pas nécessairement les deux. Primitive de ln(x)/x² sur]0;+infini[, pas surR. Constante au point e rétablie à2/e.",
      "Notices internes seulement ; solutions rédigées point par point, productions écrites non notées automatiquement. Activités introductives et situation d’apprentissage exclues.",
    ],
  },
  sections: [...integralSummaryA, ...integralSummaryB], evaluations: terminalCIntegralEvaluations,
  legacyAnchors: {
    "definite-integral": "int-definition", "integral-area": "int-area-sign",
    "chasles-linearity": "int-linearity", "integral-order": "int-order",
    "integral-bounds-mean": "int-average", "integration-by-parts": "int-parts",
    "integral-substitution": "int-affine", "integral-symmetry-function": "int-parity",
  },
};
