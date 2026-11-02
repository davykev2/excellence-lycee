import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { differentialFixationA } from "./terminalCDifferentialFixationA";
import { differentialFixationB } from "./terminalCDifferentialFixationB";
import { differentialDeepeningA } from "./terminalCDifferentialDeepeningA";
import { differentialDeepeningB } from "./terminalCDifferentialDeepeningB";
import { differentialDeepeningC } from "./terminalCDifferentialDeepeningC";
import { differentialComplex } from "./terminalCDifferentialComplex";
const fixation = [...differentialFixationA, ...differentialFixationB];
const rubrics: Array<[string,string,number,number,string]> = [
  ["verify","Justifier qu’une fonction est solution",1,5,"ode-definition"],
  ["homogeneous","Résoudre une équation y′ = ay",6,7,"ode-first-general"],
  ["first-initial","Déterminer une solution de y′ = ay avec une condition",8,9,"ode-first-initial"],
  ["affine","Résoudre une équation y′ = ay + b",10,11,"ode-affine-general"],
  ["affine-initial","Déterminer une solution de y′ = ay + b avec une condition",12,13,"ode-affine-general"],
  ["zero","Déterminer une solution de y″ = 0",14,14,"ode-second-zero"],
  ["positive","Résoudre une équation y″ = ω²y",15,16,"ode-second-positive"],
  ["positive-initial","Déterminer une solution de y″ = ω²y avec deux conditions",17,18,"ode-second-positive"],
  ["negative","Résoudre une équation y″ = −ω²y",19,20,"ode-second-oscillatory"],
  ["negative-initial","Déterminer une solution de y″ = −ω²y avec deux conditions",21,22,"ode-second-initial"],
];
export const terminalCDifferentialExercises: ArenaExerciseCollection = {
  id: "tc-l8-exercises-20261019", version: 1, levelId: "terminale-c", subjectId: "mathematics", lessonKey: "terminale-c-math-l18-differential-equations",
  source: {
    title: "Pyramide Maths Tle C · Tome 1 · Leçon 8 · Équations différentielles", pages: [204,205,206,207,208],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "39 exercices, folios204–208/PDF206–210 inspectés visuellement intégralement.22 fixation dans10 rubriques,16 approfondissement et1 situation complexe. Numérotation et sous-questions conservées,39 décomposé en3 étapes d’aide. Corrections originales, aucun scan.",
      "Path historique L18 C ; aucune modification des6 IDs/poids/106 questions historiques/10 000 XP ni du compteur10 294. Banque d’entraînement indépendante. Deux réponses numériques de34 notées ; toutes les résolutions et démonstrations restent écrites, sans faux score automatique.",
      "Ex24 le nom g est harmonisé sans changer la condition g'(0)=4. Ex26 slope5 enpi/15 impose A=(3-sqrt3)/2,B=(1+3sqrt3)/2. Ex27 pente perpendiculaire-2, pas1/2.",
      "Ex28 résolution générale et dérivée conservées dans1. Ex29 deux conditions en des points différents explicitement traduites ; dérivée nulle enpi/6, pas valeur nulle.",
      "Ex31 particulier x/(n+1)+1. Ex32 particulier-2cos/5+sin/5. Ex33 v=x²/3-11x/9+47/27. Équivalences f-particulière démontrées dans les deux sens.",
      "Ex34 la typographie80°c et15°c signifie80°C et15°C, non800°C/150°C. t enheures :30min=0,5h, q45 à23min12s environ. Ex35 la phase correcte est+(pi/6), donc x+1/2, pour conserver f'(3)=pi/sqrt3.",
      "Ex36 l’ED imprimée est conservée ; coefficient de e^(2x) dansP corrigé en-3/32 (le+3/32 imprimé ne vérifie pas l’ED). ConditionsJ(0,1) etpente4/3 donnent A3/4,B49/96.",
      "Ex37 ne donne aucune condition initiale et ne permet pas une courbe unique. La condition complémentaire f(0)=0 est ajoutée explicitement dans l’énoncé, pas déduite abusivement ; famille générale(alpha*t+C)e^-t mentionnée dans la correction. Pouralpha4, intersections0,30534637 et2,34315184, deux intervalles f<=0,9. Courbe native orthonormée, aucune conclusion de sécurité médicale.",
      "Ex38 f désigne la masse dissoute, donc f'=k(50-f),k>0 ; restante50-f. Ex39 theta=T-10, pasT ; inégalitéstricte t>ln18/ln3, premier relevé admissible à3min.",
      "Les quatre figures de34,37,38,39 sont des réponses : uniquement dans les corrections. Deux explorations séparées dans le résumé. Fonctions fixes, aucun code évalué depuis une saisie.",
    ],
  },
  sections: [
    ...rubrics.map(([id,title,start,end,courseTopicId]) => ({
      id: "tc-l8-" + id, title, category: "fixation" as const, courseTopicId,
      exercises: fixation.filter(e => e.sourceNumber! >= start && e.sourceNumber! <= end),
    })),
    { id: "tc-l8-deepening", title: "Exercices d’approfondissement", category: "deepening", courseTopicId: "ode-affine-general", exercises: [...differentialDeepeningA,...differentialDeepeningB,...differentialDeepeningC] },
    { id: "tc-l8-complex", title: "Situations complexes", category: "complex", courseTopicId: "ode-first-initial", exercises: differentialComplex },
  ],
};
