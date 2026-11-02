import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { logarithmsFixationA } from "./terminalCLogarithmsFixationA";
import { logarithmsFixationB } from "./terminalCLogarithmsFixationB";
import { logarithmsDeepeningA } from "./terminalCLogarithmsDeepeningA";
import { logarithmsDeepeningB } from "./terminalCLogarithmsDeepeningB";
import { logarithmsDeepeningC } from "./terminalCLogarithmsDeepeningC";
import { logarithmsComplex } from "./terminalCLogarithmsComplex";

const fixation = [...logarithmsFixationA, ...logarithmsFixationB];
const groups: Array<[string, string, number, number, string]> = [
  ["algebra", "Définition et propriétés algébriques de la fonction logarithme népérien", 1, 2, "log-algebra-summary"],
  ["equations", "Équations et inéquations comportant des logarithmes", 3, 6, "log-algebra-summary"],
  ["inequalities", "Inéquations comportant des logarithmes", 7, 8, "log-algebra-summary"],
  ["limits", "Limites de référence et limites aux bornes du domaine", 9, 11, "log-limits-summary"],
  ["derivatives", "Dérivée d’une fonction comportant des logarithmes", 12, 13, "log-derivative-summary"],
  ["primitives", "Primitives d’une fonction du type u′/u", 14, 15, "log-primitives-summary"],
  ["bases", "Définition et propriétés du logarithme de base a", 16, 17, "log-bases-summary"],
];
export const terminalCLogarithmsExercises: ArenaExerciseCollection = {
  id: "tc-l4-exercises-20261019", version: 1,
  levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l08-logarithms",
  source: {
    title: "Pyramide Maths Tle C · Tome 1 · Leçon 4 · Fonctions logarithmes",
    pages: [104, 105, 106, 107, 108, 109, 110], sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "42 exercices : 17 fixation dans 7 rubriques bleues, 22 approfondissement et 3 situations complexes. Folios 104–110, pages PDF 106–112 inspectées intégralement. Corrections originales Excellence, absentes du support d’exercices.",
      "Chapitre 4 du tome Analyse et probabilité, raccord au path historique L08 ; aucune renumérotation ni modification des identifiants/poids de progression, aucun XP dans cette banque locale.",
      "Ex.5.2 : aucune option imprimée ne correspond au domaine de ln(4-x²) ; option B rétablie en ]-2;2[, trois propositions conservées. Ex.11.a : limite en 0 prise à droite, conformément au domaine du quotient.",
      "Ex.13.c : écriture tronquée rétablie en h(x)=ln(x²-2x+4). Ex.23.d : les quatre glyphes manquants entourant x+1 et x+5 sont rendus comme barres de valeur absolue, sans inventer de coefficient devant x.",
      "Ex.26 : formulation valeur x0 en y0 inversée ; convention clarifiée en F(x0)=y0, conformément aux données et à leurs valeurs remarquables. Ex.29 : condition de f(1+t)+f(1-t) rétablie en t différent de 0, non différent de 1.",
      "Ex.28 : prolongement g(0)=0, g(1)=-1 ; non-dérivabilité à droite en 0 et g′(1)=-1/2. Limite du taux justifiée par une fonction auxiliaire et Rolle, jamais une fausse simplification d’un 0/0.",
      "Ex.33 : magnitudes utilisées comme données du modèle, sans reprendre les affirmations historiques inexactes sur le record de Lisbonne ou sur la prévisibilité des dommages. Énergies comparées, pas puissances ; constante 11,4 du support conservée, car les rapports ne dépendent que des différences de magnitude.",
      "Ex.34 : alpha=3,512862417... ; h(x)=ln x+x/2+1/2 conservée ; borne de contraction 5/6, premier p garanti 38 et u38=3,512803837... Ex.37.2.b : sens corrigé en ln(1+x)>=x-x²/2. Ex.37.2.c : borne supérieure corrigée en -1/2+x/3, indispensable au théorème des gendarmes et à f′_d(0)=-1/2.",
      "Ex.38 : pente -9/2 atteinte en x=5 ; aire 3(7ln7-2ln2-6ln6)=4,4535596... cm² ; racine x0 dans ]5,08;5,09[. Ex.39 : maximum (n/2)exp(2/n-1), domaine x>0 et n entier positif.",
      "Ex.40 : modèle de propagation explicitement idéal ; 76,0206 dB à 500m, demande non respectée. Ex.41 : seuil de charbon atteint en 2039, pas avant 2030. Ex.42 : premier anniversaire en dessous du quart en 2037, 17 années après 2020. Interprétations limitées aux hypothèses mathématiques.",
      "Figures originales natives dans les corrections uniquement ; aucune photographie ni scan republié. Produits de fonctions et démonstrations restent des rédactions avec modèles/grilles, jamais une fausse correction symbolique ou note automatique.",
    ],
  },
  sections: [
    ...groups.map(([id, title, start, end, courseTopicId]) => ({ id: `tc-l4-${id}`, title, category: "fixation" as const, courseTopicId, exercises: fixation.filter(item => item.sourceNumber! >= start && item.sourceNumber! <= end) })),
    { id: "tc-l4-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "log-limits-summary", exercises: [...logarithmsDeepeningA, ...logarithmsDeepeningB, ...logarithmsDeepeningC] },
    { id: "tc-l4-complex", title: "Situations complexes", category: "complex", courseTopicId: "log-bases-summary", exercises: logarithmsComplex },
  ],
};
