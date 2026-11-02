import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { limitsFixationA } from "./terminalCLimitsFixationA";
import { limitsFixationB } from "./terminalCLimitsFixationB";
import { limitsFixationC } from "./terminalCLimitsFixationC";
import { limitsComplex, limitsDeepening } from "./terminalCLimitsDeepening";

const fixation = [...limitsFixationA, ...limitsFixationB, ...limitsFixationC];
const groups: Array<[string, string, number, number, string]> = [
  ["reference", "Limites de référence", 1, 2, "reference-limits"],
  ["restriction", "Limite d’une restriction", 3, 4, "restriction-limit"],
  ["one-sided", "Limite à gauche, limite à droite et limite d’une fonction", 5, 7, "one-sided-limits"],
  ["operations", "Limites et opérations sur les fonctions", 8, 11, "limit-operations"],
  ["composition", "Limite d’une fonction composée", 12, 14, "composition-limit"],
  ["comparison", "Limite par comparaison", 15, 18, "comparison-limit"],
  ["monotone", "Limite d’une fonction monotone sur un intervalle", 19, 20, "monotone-limit"],
  ["continuity-point", "Continuité en un point", 21, 23, "continuity-point"],
  ["extension", "Prolongement par continuité", 24, 28, "continuous-extension"],
  ["continuity-operations", "Continuité sur un intervalle · Opérations sur les fonctions continues", 29, 29, "continuity-operations"],
  ["image", "Image d’un intervalle par une fonction continue", 30, 32, "image-interval"],
  ["continuous-composition", "Continuité d’une fonction composée", 33, 34, "continuity-composition"],
  ["intermediate-value", "Théorème des valeurs intermédiaires", 35, 38, "intermediate-value"],
  ["bijection", "Fonction continue et strictement monotone", 39, 42, "bijection-inverse"],
  ["asymptotes", "Asymptotes", 43, 46, "asymptotes"],
  ["parabolic", "Branches paraboliques", 47, 49, "parabolic-branches"],
  ["powers", "Fonction racine n-ième · Fonction puissance d’exposant rationnel", 50, 54, "power-laws"],
];

export const terminalCLimitsExercises: ArenaExerciseCollection = {
  id: "tc-l1-exercises-20261018", version: 1,
  levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l01-limits-continuity",
  source: {
    title: "L1 · Mes séances d’exercices · Limite et continuité", pages: [40, 41, 42, 43, 44, 45, 46],
    sha256: "C207C23E5C4F0F275C8FFEAA4677948728634DBE1E2E71B406219335963EC302",
    editorialNotes: [
      "62 exercices, 54 fixation / 6 approfondissement / 2 situations complexes. Corrigés originaux Excellence, absents du document source.",
      "Ex. 19 : plusieurs propriétés complètes possibles, donc rédaction comparée et non autocorrection restrictive.",
      "Ex. 20 : quantificateurs du minorant commun rétablis en il existe m, pour tout x.",
      "Ex. 27 : valeur absolue ajoutée au majorant et hypothèse localisée près de 1 ; l’inégalité imprimée était impossible à gauche de 1.",
      "Ex. 30.3 : le support écrit bien 3/5. L’affirmation est fausse, notamment car 3/2 est dans l’intervalle annoncé.",
      "Ex. 42 : bijection sur R explicitée afin de définir la restriction inverse sur tous les réels négatifs.",
      "Ex. 47 : hypothèses de signe incompatibles dans les cas 1 et 2. Analyse écrite, aucune note V/F trompeuse.",
      "Ex. 48 : repère d) rétabli en c) après a), b).",
      "Ex. 55 : domaine [3;+infini[ précisé pour la racine de x-3.",
      "Ex. 59 : domaine excluant -1 et 1 explicité. Courbe qualitative redessinée, sans attribuer une formule au support.",
      "Ex. 61 : température initiale narrative de 210°C retirée car incompatible avec le modèle 210/t+10 au premier contrôle (220°C à t=1). Le coefficient 210 est conservé. Modèle pour t>0, sans valeur f(0). Le premier contrôle t=1 est à 08h : t=211 correspond à 11h30.",
      "Ex. 62 : arc mineur, radians, exclusion de zéro et unicité de l’angle 1.895494267 rad / 108.603821592 degrés protégés.",
    ],
  },
  sections: [
    ...groups.map(([id, title, start, end, courseTopicId]) => ({
      id: `tc-l1-${id}`, title, category: "fixation" as const, courseTopicId,
      exercises: fixation.filter(exercise => exercise.sourceNumber! >= start && exercise.sourceNumber! <= end),
    })),
    { id: "tc-l1-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "asymptotes", exercises: limitsDeepening },
    { id: "tc-l1-complex", title: "Situations complexes", category: "complex", courseTopicId: "intermediate-value", exercises: limitsComplex },
  ],
};
