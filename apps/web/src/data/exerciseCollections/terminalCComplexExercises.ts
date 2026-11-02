import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { complexFixationA } from "./terminalCComplexFixationA";
import { complexFixationB } from "./terminalCComplexFixationB";
import { complexFixationC } from "./terminalCComplexFixationC";
import { complexDeepeningA } from "./terminalCComplexDeepeningA";
import { complexDeepeningB } from "./terminalCComplexDeepeningB";
import { complexDeepeningC } from "./terminalCComplexDeepeningC";
import { complexSituations } from "./terminalCComplexSituations";
const fixation=[...complexFixationA,...complexFixationB,...complexFixationC];
const groups:readonly[ string,string,number,number,string ][]=[
 ["algebra","Ensemble des nombres complexes et forme algébrique",1,5,"complex-definition"],
 ["equality","Égalité de deux complexes",6,6,"complex-equality"],
 ["opposite","Opposé",7,7,"complex-operations"],
 ["sum","Somme",8,8,"complex-operations"],["product","Produit",9,9,"complex-operations"],
 ["inverse","Inverse",10,10,"complex-operations"],["powers","Puissances entières",11,12,"complex-integer-powers"],
 ["zero","Produit nul",13,14,"complex-integer-powers"],["conjugate","Conjugué",15,18,"complex-conjugation"],
 ["modulus","Module",19,23,"complex-modulus-properties"],["affix","Affixe, point-image et vecteur-image",24,30,"complex-affixes-vectors"],
 ["argument","Argument",31,32,"complex-argument-definition"],["trigonometric","Forme trigonométrique",33,37,"complex-trigonometric-form"],
 ["exponential","Forme exponentielle",38,40,"complex-exponential-form"],["moivre","Formule de Moivre",41,42,"complex-moivre-formula"],
 ["euler","Formules d’Euler",43,44,"complex-euler-linearization"],["linearization","Linéarisation",45,45,"complex-euler-linearization"],
 ["equations","Résolution d’équations dans ℂ",46,52,"complex-nth-roots"],["geometry","Configurations du plan",53,54,"complex-geometric-criteria"],
];
export const terminalCComplexExercises:ArenaExerciseCollection={
 id:"tc-t2-l5-exercises-20261020",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l09-complex-numbers",
 source:{
  title:"Pyramide Maths Tle C · Tome 2 · Leçon 5 · Nombres complexes",pages:[139,140,141,142,143,144,145,146],
  sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
  editorialNotes:[
   "Folios137–144/PDF139–146 contrôlés visuellement :80 exercices(54fixation/24approfondissement/2situations), numérotation source conservée ; ex67 continue144,ex78 continue146.",
   "Ex1 bonne option14/25−23i/25 rétablie ; ex19 quotient imaginaire pur admet0 et exclutC ; ex24 vecteur renomméw pour ne pas confondre avec l’unité du repère.",
   "Arguments principaux dans]-π;π] ; demandes d’un argument et de formes trigonométriques rédigées pour accepter la non-unicité modulo2π sans correction arbitraire.",
   "Ex60 2 puissance θ conservé ; solutions2^θexp(±iθ), équilatéralθπ/6 ou5π/6. Ex63 racine pure2i puis1+i/−2+2i. Ex65 rayon des racines√3.",
   "Ex66 réels=ligne/imagpur=cercle, pointi exclu,2 inclus. Ex67 rayon1/√2 et demi-droite ouverte, non droite complète. Ex73 réels positifs uniquement n multiple6.",
   "Ex76/77 j électrique désigne i, pas la racine cubiquej ; X nommé réactance, module en ohms, gain sans unité, R/L/C/ω positifs. Deux schémas natifs d’énoncé, aucun scan.",
   "Ex78 rotationcentreC−π/3,E−1+√3,F−i(1+√3),quotient2−√3. Ex79 conditionmodulo2π impose le demi-cercle ouvert3x+y<2 ; une réponse cercle complet serait incorrecte. Ex80 contexte fictif sans promesse de prix.",
   "Comparaison complexe bornée sans évaluation de code ; réponses rédigées non notées automatiquement. Entraînement local sansXP ni modification du compteur historique.",
  ],
 },
 sections:[
  ...groups.map(([id,title,first,last,courseTopicId])=>({id:"tc-t2-l5-"+id,title,category:"fixation" as const,courseTopicId,exercises:fixation.filter(e=>e.sourceNumber!>=first&&e.sourceNumber!<=last)})),
  {id:"tc-t2-l5-deepening",title:"Approfondissement",category:"deepening",courseTopicId:"complex-geometric-criteria",exercises:[...complexDeepeningA,...complexDeepeningB,...complexDeepeningC]},
  {id:"tc-t2-l5-complex",title:"Situations complexes",category:"complex",courseTopicId:"complex-geometric-criteria",exercises:complexSituations},
 ],
};
