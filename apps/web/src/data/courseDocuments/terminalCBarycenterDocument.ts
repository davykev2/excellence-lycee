import type { CourseDocument } from "../../domain/courseDocument";
import { barycenterSummaryA } from "./terminalCBarycenterSummaryA";
import { barycenterSummaryB } from "./terminalCBarycenterSummaryB";
import { barycenterEvaluations } from "./terminalCBarycenterEvaluations";
export const terminalCBarycenterDocument:CourseDocument={
  id:"tc-algebra-t2-l1-barycenter-summary",version:1,levelIds:["terminale-c"],
  source:{
    title:"Pyramide · Terminale C · Tome 2 · Barycentre et lignes de niveau",lessonLabel:"Tome 2 · Leçon 1",pageCount:276,
    summaryPages:[19,20,21,22,23,24,25],evaluationPages:[26,27],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Tome 2 Algèbre et géométrie : résumé folios17–23/PDF19–25, évaluations24–25/PDF26–27 et banque26–30/PDF28–32 inspectés visuellement. Activités et situation d’apprentissage ignorées.",
      "Raccord propre à C au path global L02. Les 9 IDs/poids, 79 questions historiques, progressions, feedback, 10 000XP et compteur10 294 sont conservés.",
      "Somme nulle : pas de barycentre unique ; ne signifie pas que toute relation vectorielle est nécessairement sans solution. Coefficients du contre-exemple K rétablis.",
      "S négatif protégé dans les lignes quadratiques. Rapport MA/MB : B exclu, k positif, k1 séparé. Angles modulo2pi et modulo pi distincts ; grand arc -pi/3 et petit arc -2pi/3 correctement sélectionnés.",
      "Deux méthodes officielles complètes, deux exemples corrigés et trois tâches rédigées. Aucune preuve ou construction n’est notée automatiquement ; solutions et figures indépendantes, pas de notice publique.",
    ],
  },
  sections:[...barycenterSummaryA,...barycenterSummaryB],evaluations:barycenterEvaluations,
  legacyAnchors:{
    "weighted-barycenter":"bary-definition","isobarycenter-homogeneity":"bary-homogeneity","weighted-vector-reduction":"bary-reduction",
    "barycenter-coordinates":"bary-coordinates","partial-barycenter":"bary-partial","quadratic-level-sets":"bary-quadratic",
    "apollonius-level-set":"bary-apollonius","oriented-angle-level-set":"bary-oriented-angles","barycenter-level-set-mission":"bary-level-definition",
  },
};
