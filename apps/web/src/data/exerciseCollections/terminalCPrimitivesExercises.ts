import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { primitivesFixation } from "./terminalCPrimitivesFixation";
import { primitivesDeepeningA } from "./terminalCPrimitivesDeepeningA";
import { primitivesDeepeningB } from "./terminalCPrimitivesDeepeningB";
import { primitivesComplex } from "./terminalCPrimitivesComplex";

const groups: Array<[string, string, number, number, string]> = [
  ["definition", "Primitive d’une fonction", 1, 2, "primitive-definition-summary"],
  ["existence", "Primitive d’une fonction continue sur un intervalle", 3, 4, "primitive-existence-summary"],
  ["families", "Primitives d’une fonction donnée", 5, 6, "primitive-family-summary"],
  ["initial", "Primitive prenant une valeur donnée en un point donné", 7, 8, "primitive-initial-summary"],
  ["usual", "Primitives des fonctions usuelles", 9, 10, "primitive-usual-summary"],
  ["operations", "Opérations sur les primitives", 11, 12, "primitive-composites-summary"],
];

export const terminalCPrimitivesExercises: ArenaExerciseCollection = {
  id: "tc-l3-exercises-20261018", version: 1,
  levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l06-primitives",
  source: {
    title: "Pyramide Maths Tle C · Tome 1 · Leçon 3 · Primitives", pages: [86, 87, 88],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "38 exercices : 12 fixation dans 6 rubriques, 25 approfondissement, 1 situation complexe. Folios 86–88, pages PDF 88–90 inspectées visuellement. Corrections originales Excellence, absentes de cette banque source.",
      "Chapitre 3 du tome Analyse et probabilité, path historique L06 conservé. Entraînements locaux, sans XP ni changement du compteur canonique.",
      "Ex. 4 : domaines naturels rétablis pour 1/x^3 et sqrt(2x-1), non fonctions définies partout sur R. Deux constantes possibles de part et d’autre du pôle ; dérivée à droite à l’extrémité 1/2.",
      "Ex. 11.c : pôle 5/2 exclu de l’intervalle imprimé ]0;+infini[ ; deux intervalles précisés. Domaines et positivité contrôlés pour toutes les racines et fractions.",
      "Ex. 13.3 : unicité explicitement limitée aux primitives satisfaisant la même condition en a. Ex. 22 : convention de dérivée à gauche en 1 précisée, contradiction par fonction constante ; discontinuité seule jamais présentée comme preuve suffisante de non-existence.",
      "Ex. 18 : H(2)=0 conservé. Ex. 19 : dérivation seulement pour x<3, coefficients 2/5,-2/5,-12/5 et constante 16/5. Ex. 31 et 32 : valeur initiale détermine seulement la primitive sur l’intervalle contenant 0 ou 2.",
      "Ex. 38 : donnée f(0)=1000 conservée ; continuité en 0 explicitée ; modèle uniquement tant que population non négative. Maximum en 5 h égal à 140500/3, supérieur à 46000 : inefficace selon le critère. Courbe native en correction uniquement, sans scan.",
      "Productions de fonctions et démonstrations : rédaction libre avec modèle et grille, pas de comparaison symbolique fragile ni notation automatique. Les sous-questions numériques/VF sont des décompositions pédagogiques, non un barème officiel.",
    ],
  },
  sections: [
    ...groups.map(([id, title, start, end, courseTopicId]) => ({
      id: `tc-l3-${id}`, title, category: "fixation" as const, courseTopicId,
      exercises: primitivesFixation.filter(item => item.sourceNumber! >= start && item.sourceNumber! <= end),
    })),
    { id: "tc-l3-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "primitive-composites-summary", exercises: [...primitivesDeepeningA, ...primitivesDeepeningB] },
    { id: "tc-l3-complex", title: "Situation complexe", category: "complex", courseTopicId: "primitive-initial-summary", exercises: primitivesComplex },
  ],
};
