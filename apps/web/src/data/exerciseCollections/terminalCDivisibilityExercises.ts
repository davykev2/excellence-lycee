import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { divisibilityFixationA } from "./terminalCDivisibilityFixationA";
import { divisibilityFixationB } from "./terminalCDivisibilityFixationB";
import { divisibilityDeepeningA } from "./terminalCDivisibilityDeepeningA";
import { divisibilityDeepeningB } from "./terminalCDivisibilityDeepeningB";
import { divisibilityDeepeningC } from "./terminalCDivisibilityDeepeningC";
import { divisibilityComplex } from "./terminalCDivisibilityComplex";
export const terminalCDivisibilityExercises:ArenaExerciseCollection={
  id:"tc-t2-l2-exercises-20261019",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l03-divisibility",
  source:{
    title:"Pyramide Maths Tle C · Tome 2 · Leçon 2 · Divisibilité dans ℤ",pages:[64,65,66],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Folios62–64/PDF64–66 inspectés visuellement :60 exercices (26 fixation,32 approfondissement,2 situations), deux rubriques bleues sources. Approfondissement découpé en deux sections de stockage de22 et10 exercices pour respecter la limite API30, sans changer la présentation directe.",
      "Ex3 n non nul rétabli. Ex14 étiquettes répétées c/d/e harmonisées en six cas a–f, nombres et signes conservés. Ex22 est bien67^89-1 (pas6^789 ni6789-1).",
      "Ex23a :2024 n’est pas divisible par24 ; affirmation rendue vraie en conservant le nombre. Ex43 somme de deux carrés de relatifs consécutifs, et non somme de deux relatifs : omission du mot carrés dans les deux sens réparée.",
      "Ex58.2 : produit de deux entiers3mod4 congru1, pas3. La preuve d’infinitude utilise ensuite au moins un facteur premier3mod4.",
      "Ex32 second reste : n1 reste2, n2–4 reste9-2n, n>=5 reste n+11. Ne pas oublier les petits rangs. Ex53 passage2u mod100 => u mod50, puis mod4 pour distinguer14/64.",
      "Ex38 produit2126 base8, Ex41 produit347279398267536, Ex47 grand entier groupé999|888|777|666|555|444|333|222|111|000 reste5 ; vérifications par entiers exacts.",
      "Ex59 Pierre doit commencer et retirer4 pour laisser36 ; retrait complémentaire5-a ensuite, perdant prend la dernière. Ex60 C garde11positions, N0 reste96mod97, clé01 et quotient exact238187137216501507333. Modèle scolaire de RIB, pas une règle universelle de compte bancaire.",
      "Corrections indépendantes ; modèles rédigés sans note automatique, résultats courts évalués localement sans XP. Aucun scan ni solution de situation d’apprentissage. Historique12IDs/114questions/10 000XP et compteur10 294 inchangés.",
    ],
  },
  sections:[
    {id:"tc-t2-l2-natural",title:"Ensemble ℕ des entiers naturels",category:"fixation",courseTopicId:"div-natural-order",exercises:divisibilityFixationA},
    {id:"tc-t2-l2-integers",title:"Ensemble ℤ des entiers relatifs",category:"fixation",courseTopicId:"div-relative-order",exercises:divisibilityFixationB},
    {id:"tc-t2-l2-deepening-a",title:"Approfondissement · Raisonnement et numération",category:"deepening",courseTopicId:"div-bases",exercises:[...divisibilityDeepeningA,...divisibilityDeepeningB.slice(0,6)]},
    {id:"tc-t2-l2-deepening-b",title:"Approfondissement · Congruences et nombres premiers",category:"deepening",courseTopicId:"div-congruences",exercises:[...divisibilityDeepeningB.slice(6),...divisibilityDeepeningC]},
    {id:"tc-t2-l2-complex",title:"Situations complexes",category:"complex",courseTopicId:"div-congruences",exercises:divisibilityComplex},
  ],
};
