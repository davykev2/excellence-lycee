import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { derivativesFixationA } from "./terminalCDerivativesFixationA";
import { derivativesFixationB } from "./terminalCDerivativesFixationB";
import { derivativesDeepeningA } from "./terminalCDerivativesDeepeningA";
import { derivativesDeepeningB } from "./terminalCDerivativesDeepeningB";
import { derivativesDeepeningC } from "./terminalCDerivativesDeepeningC";
import { derivativesComplex } from "./terminalCDerivativesComplex";

const fixation = [...derivativesFixationA, ...derivativesFixationB];
const groups: Array<[string, string, number, number, string]> = [
  ["lateral", "Dérivabilité à gauche et à droite", 1, 3, "lateral-derivatives"],
  ["interval", "Dérivabilité sur un intervalle", 4, 5, "closed-interval-derivative"],
  ["tangents", "Interprétation graphique · Tangentes et demi-tangentes", 6, 7, "vertical-tangent"],
  ["successive", "Dérivées successives", 8, 9, "successive-derivatives-summary"],
  ["composition", "Dérivée d’une fonction composée", 10, 12, "chain-rule"],
  ["increments", "Inégalité des accroissements finis · Propriétés", 13, 15, "finite-increments-summary"],
  ["inflection", "Point d’inflexion", 16, 18, "inflection-point"],
  ["inverse", "Dérivée d’une bijection réciproque", 19, 21, "inverse-derivative-summary"],
  ["increments-applications", "Inégalité des accroissements finis · Applications", 22, 25, "finite-increments-summary"],
];

export const terminalCDerivativesExercises: ArenaExerciseCollection = {
  id: "tc-l2-exercises-20261018", version: 1,
  levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l04-derivatives-functions",
  source: {
    title: "Pyramide Maths Tle C · Tome 1 · Leçon 2 · Dérivabilité et étude de fonctions",
    pages: [66, 67, 68, 69, 70, 71, 72, 73, 74],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "49 exercices : 25 fixation dans 9 rubriques bleues, 22 approfondissement, 2 situations complexes. Folios 66–74, pages PDF 68–76 inspectées visuellement. Corrigés originaux Excellence, absents du support.",
      "Chapitre 2 du tome Analyse et probabilité, raccordé au path historique L04 sans renuméroter le catalogue ni modifier IDs/XP/progression des anciens parcours. Entraînements locaux uniquement.",
      "Les preuves, calculs de fonctions, études et constructions restent rédigés avec modèle/grille, sans fausse notation automatique. Les réponses numériques et choix fermés possèdent un score objectif local séparé.",
      "Ex. 6 : continuité ajoutée pour l’interprétation géométrique ; une limite latérale ne suffit pas à conclure à une tangente complète.",
      "Ex. 7 : domaine réel [1;+infini[ rétabli pour la racine.",
      "Ex. 10 : composition supposée définie, images incluses dans les domaines ; positivité précisée pour racines/puissances réelles.",
      "Ex. 14 : bornes inversées et impossibles 1/2 <= f' <= 1/3 corrigées en 1/3 <= f' <= 1/2, avec a/3 <= f(a) <= a/2.",
      "Ex. 16 : trois courbes qualitatives natives redessinées, sans attribuer leurs formules auxiliaires au document. Figure 1 seule présente l’inflexion demandée.",
      "Ex. 19 : différentiabilité/bijectivité et point intérieur explicités. f'(antécédent) doit être non nul ; f'(image) ne suffit pas.",
      "Ex. 22 : encadrement exact de sqrt(1001) par IAF sur [1000;1001], bornes 10sqrt(10)+1/64 et 10sqrt(10)+1/62.",
      "Ex. 36.8 : puissance 2/3 interprétée explicitement comme le carré de la racine cubique réelle ; domaine privé de -1, dérivabilité excluant aussi 1/2.",
      "Ex. 44 : domaine R privé de -1 rétabli. Ex. 45 : domaine à deux composantes et demi-tangentes aux extrémités protégés.",
      "Ex. 48 : position de M à l’intérieur du rectangle impose 0 < theta < arctan(6/5), plus précis que le seul angle aigu imprimé. Dimensions 10/6 et longueur du support conservées ; optimum pi/6, longueur 6+5sqrt(3).",
      "Ex. 49 : coût imprimé x²-81x conservé comme modèle algébrique, sans inventer de coût fixe ni de signe. Bénéfice 84x-x² et optimum entier 42. Incohérence économique du coût négatif expliquée dans la solution, et non présentée comme un coût réel exploitable.",
      "Figures géométriques présentes dans les énoncés ; tracés de fonctions demandés par les sujets exclusivement dans les corrections. Aucun scan publié.",
    ],
  },
  sections: [
    ...groups.map(([id, title, start, end, courseTopicId]) => ({
      id: `tc-l2-${id}`, title, category: "fixation" as const, courseTopicId,
      exercises: fixation.filter(item => item.sourceNumber! >= start && item.sourceNumber! <= end),
    })),
    { id: "tc-l2-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "chain-rule", exercises: [...derivativesDeepeningA, ...derivativesDeepeningB, ...derivativesDeepeningC] },
    { id: "tc-l2-complex", title: "Situations complexes", category: "complex", courseTopicId: "finite-increments-summary", exercises: derivativesComplex },
  ],
};
