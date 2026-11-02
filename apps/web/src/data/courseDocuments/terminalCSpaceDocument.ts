import type { CourseDocument } from "../../domain/courseDocument";
import { spaceSummaryA } from "./terminalCSpaceSummaryA";
import { spaceSummaryB } from "./terminalCSpaceSummaryB";
import { spaceEvaluations } from "./terminalCSpaceEvaluations";
export const terminalCSpaceDocument:CourseDocument={
  id:"tc-algebra-t2-l3-space-summary",version:1,levelIds:["terminale-c"],
  source:{
    title:"Pyramide · Terminale C · Tome 2 · Géométrie analytique de l’espace",lessonLabel:"Tome 2 · Leçon 3",pageCount:276,
    summaryPages:[72,73,74,75],evaluationPages:[76,77,78,79],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Résumé folios70–73/PDF72–75 et évaluations74–77/PDF76–79 contrôlés visuellement. Trois rubriques, sept sous-sections, cinq groupes d’exemples et quatre méthodes. Activités et situation d’apprentissage ignorées.",
      "Raccord C uniquement au path historique L05 ; douze IDs/poids, 82 questions historiques, feedback, progressions, 10 000 XP et compteur10 294 conservés.",
      "Équation du plan par A(1;-1;2) de normale(1;2;3) : constante -5 et non -14. Distance de A(-1;2;5) au plan x+2y-3z+5 :7/sqrt14, pas1/sqrt14 ; substitution source z=3 incorrecte.",
      "La lecture des coefficients comme normale suppose un repère orthonormé. Orthogonalité des directions de deux droites non sécantes distinguée de droites perpendiculaires.",
      "Évaluation3 : directeur de D2=(-2;-4;-6), troisième coordonnée du corrigé source erronée. Les trois équations d’intersection sont vérifiées. D3 de l’application conserve +1,5, non -1,5.",
      "Évaluation4 : n3=-1/2 n2, signe négatif rétabli ; constantes distinctes donnent le parallélisme strict. Cinq applications rédigées, sans note automatique.",
      "Figures originales orthographiques manipulables ; aucune image ni scan du manuel republié. Corrections indépendantes accessibles sans validation.",
    ],
  },
  sections:[...spaceSummaryA,...spaceSummaryB],evaluations:spaceEvaluations,
  legacyAnchors:{
    "plane-normal-vector":"space-normal","plane-cartesian-equation":"space-plane-equation","point-plane-distance":"space-distance",
    "line-parametric-form":"space-line","relative-lines-space":"space-two-lines","line-plane-position":"space-line-plane",
    "relative-planes":"space-two-planes","sculpture-orthogonality-mission":"space-line-plane",
    "official-applications-workshop":"space-plane-equation","orthogonal-planes-reinforcement":"space-two-planes",
    "containing-plane-reinforcement":"space-plane-equation","parameterized-planes-mission":"space-two-planes",
  },
};
