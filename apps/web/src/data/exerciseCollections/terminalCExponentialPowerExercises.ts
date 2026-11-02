import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { exponentialFixation } from "./terminalCExponentialPowerFixation";
import { exponentialDeepeningA } from "./terminalCExponentialPowerDeepeningA";
import { exponentialDeepeningB } from "./terminalCExponentialPowerDeepeningB";
import { exponentialDeepeningC } from "./terminalCExponentialPowerDeepeningC";
import { exponentialComplex } from "./terminalCExponentialPowerComplex";

const groups: Array<[string, string, number, number, string]> = [
  ["algebra", "Propriétés algébriques de la fonction exponentielle", 1, 4, "exp-definition-summary"],
  ["equations", "Équations et inéquations comportant une exponentielle", 5, 9, "exp-definition-summary"],
  ["limits", "Limites d’une fonction comportant une exponentielle", 10, 10, "exp-limits-summary"],
  ["derivatives", "Dérivées d’une fonction comportant une exponentielle", 11, 11, "exp-derivative-summary"],
  ["primitives", "Primitives d’une fonction comportant une exponentielle", 12, 13, "exp-primitives-summary"],
];
export const terminalCExponentialPowerExercises: ArenaExerciseCollection = {
  id: "tc-l5-exercises-20261019", version: 1, levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l10-exponential-power",
  source: { title: "Pyramide Maths Tle C · Tome 1 · Leçon 5 · Fonctions exponentielles et fonctions puissances", pages: [129, 130, 131, 132, 133, 134], sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "41 exercices des folios 129–134 (pages PDF 131–136), inspectés visuellement, avec détail agrandi des folios 129/130/133/134. Numérotation et sous-questions conservées ; 13 fixation, 26 approfondissement, 2 situations complexes. Corrections originales Excellence.",
      "Leçon 5 du tome Analyse et probabilité, raccord au path historique L10 C. IDs/poids/128 questions/10 000 XP historiques et compteur 10 294 inchangés. Aucun XP dans cette banque, rédactions non notées automatiquement.",
      "Ex.1 : la bijection est explicitement R vers ]0;+infini[. Ex.2.I : domaine x>2 conservé après simplification. Ex.11.c et 25.B : 1+x exp(x) >=1-1/e>0 sur R.",
      "Ex.16.6 : la puissance réelle (x+3)^x est étudiée sur x>-3, solutions -2 et 0. Ex.20/21/22 : racines cubiques réelles distinguées de la définition générale exp(alpha ln x), restrictions/points non dérivables et constantes sur composantes disjointes explicités.",
      "Ex.25 : alpha=0,703467422... ; maximum 0,290505358... ; l’encadrement 0,70–0,71 ne suffit pas à choisir les deux centièmes consécutifs, donc affinement. Inverse non dérivable au maximum, dérivée (1+e)^2/(1-e) en 1/(1+e).",
      "Ex.26 : alpha=-0,703467422..., maximum 4,389587166..., encadrement 4,3–4,4 affiné ; asymptote y=-x en +infini.",
      "Ex.27 : H imprimée (x-1/2)^2 exp(2x)+4(2-x)exp(x) n’est pas primitive de f+2 ; remplacée dans l’énoncé par H=(x-1)exp(2x)/2+4(2-x)exp(x), de dérivée vérifiée. Primitive demandée F=H-2x-17/2. g(0) imprimé 0 remplacé par -2 pour le prolongement continu ; dérivée droite infinie positive. Racine alpha=-1,612176945... ; g s’annule en exp(alpha)=0,199452943... ; niveaux horizontaux -2,4-4ln2,3/2 distingués.",
      "Ex.32 : quatre options sources conservées, réponses B/C/A/B. Ex.38 : asymptotes 2x+1 à droite et 2x à gauche, primitive x²+ln(1-exp(x))+C sur x<0, constante -ln(1-e^-1). Ex.39 : f=x² exp(-x), bien avec signe moins ; contraction 1/e, premier rang garanti 14, alpha=-0,5569290855...",
      "Ex.40 : seuil 80 boutiques, intersection x=13,5540234..., première année entière 2024. Ex.41 : A=17, k=2ln(12/11), durée 2,00150087h ; conclusion vers 8h le 02/08/2023, sans fausse précision médico-légale. Modèles présentés avec leur portée, pas comme vérités physiques universelles.",
      "Toutes les figures sont natives et apparaissent seulement dans les corrections ; aucun scan ni photographie publié. Les propriétés/corrections utiles sont affichées directement, les notices d’erreurs restent internes.",
    ],
  },
  sections: [
    ...groups.map(([id, title, start, end, courseTopicId]) => ({ id: `tc-l5-${id}`, title, category: "fixation" as const, courseTopicId, exercises: exponentialFixation.filter(item => item.sourceNumber! >= start && item.sourceNumber! <= end) })),
    { id: "tc-l5-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "exp-base-summary", exercises: [...exponentialDeepeningA, ...exponentialDeepeningB, ...exponentialDeepeningC] },
    { id: "tc-l5-complex", title: "Situations complexes", category: "complex", courseTopicId: "exp-growth-summary", exercises: exponentialComplex },
  ],
};
