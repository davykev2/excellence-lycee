import type { CourseDocument } from "../../domain/courseDocument";
import { differentialSummary } from "./terminalCDifferentialSummary";
import { differentialEvaluations } from "./terminalCDifferentialEvaluations";

export const terminalCDifferentialDocument: CourseDocument = {
  id: "tc-analysis-l8-differential-summary", version: 1, levelIds: ["terminale-c"],
  source: {
    title: "Pyramide · Terminale C · Tome 1 · Équations différentielles", lessonLabel: "Tome 1 · Leçon 8", pageCount: 268,
    summaryPages: [198,199,200], evaluationPages: [201,202,203,204,205],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "Résumé folios196–198/PDF198–200, évaluation199–203/PDF201–205 inspectés visuellement intégralement. Activités et situation d’apprentissage exclues. C seulement ; path global L18,6 IDs/poids,106 questions historiques et10 000 XP conservés, compteur10 294 inchangé.",
      "Ordre2 exige a non nul. Deux valeurs de y pour y''=0 : abscisses distinctes ; existence/unicité y et y' vaut au même point, pas arbitrairement en deux points différents.",
      "Résumé : famille positive Ae^(wx)+Be^(-wx), pas deux exposants positifs. Exemple4y''-y : A=-3/2,B=9/2. Propriété d’unicité de la partieV porte sur y''=-w²y, pas+w²y.",
      "Évaluation méthode4 : l’énoncé y'=2y+3,y(0)=2 est conservé. Solution correcte(7/2)e^(2x)-3/2, et non(1/2)e^(-2x)+3/2. Méthode3 : l’application réimprime le même y'=4y,y(-2)=3 que la méthode2 ; conservée, pas d’exercice inventé.",
      "Méthode4 application : valeur e-3/2 en-1/5, lue au même niveau de ligne ; non e^(-3/2). Méthode7 solutiong : signe plus devant Be^(-sqrt3x), A1/2,B3/2.",
      "Toutes les applications demandent une résolution complète ; brouillons et modèles explicites, aucun score automatique de démonstration. Pas de notice de coquille dans l’interface élève.",
    ],
  },
  sections: differentialSummary, evaluations: differentialEvaluations,
  legacyAnchors: {
    "first-order-homogeneous": "ode-first-general", "first-order-constant": "ode-affine-general",
    "first-order-initial-value": "ode-first-initial", "second-order-hyperbolic": "ode-second-positive",
    "second-order-oscillatory": "ode-second-oscillatory", "second-order-initial-values": "ode-second-initial",
  },
};
