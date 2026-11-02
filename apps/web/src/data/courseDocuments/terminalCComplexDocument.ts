import type { CourseDocument } from "../../domain/courseDocument";
import { complexSummaryA } from "./terminalCComplexSummaryA";
import { complexSummaryB } from "./terminalCComplexSummaryB";
import { complexSummaryC } from "./terminalCComplexSummaryC";
import { complexEvaluations } from "./terminalCComplexEvaluations";
export const terminalCComplexDocument:CourseDocument={
 id:"tc-algebra-t2-l5-complex-summary",version:1,levelIds:["terminale-c"],
 source:{
  title:"Pyramide · Terminale C · Tome 2 · Nombres complexes",lessonLabel:"Tome 2 · Leçon 5",pageCount:276,
  summaryPages:Array.from({length:12},(_,i)=>124+i),evaluationPages:[136,137,138],
  sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
  editorialNotes:[
   "Folios122–136/PDF124–138 contrôlés visuellement. Situation d’apprentissage/activités ignorées. Quatre rubriques, propriétés/hypothèses et exemples distincts conservés ; rédaction simplifiée sans retirer le fond.",
   "Somme et produit différenciés ; opposé −a−ib, pas conjugué ; inverse exige z non nul. Forme exponentielle unique seulement modulo2π et avec module positif. Tangente exclue d’une linéarisation trigonométrique polynomiale générale.",
   "Exemple du quotient d’arguments : rédaction cohérente pour z/z′, angle−5π/6. Polynôme1+iz−z²−iz³+z⁴ : quatre racines, z=−i exclu et non z=i.",
   "Évaluation : discriminant3+4i et racines1−2i/3−i ; quartique(z²+2)(z²+z+3) ; linéarisationcos³sin²=(2cosx−cos3x−cos5x)/16. Lieu moduloπ cercle complet privé des deux extrémités, distinct du demi-cercle modulo2π.",
   "Résumé/évaluation C uniquement ; dix IDs/poids,110 questions historiques,progressions,feedback,10 000XP et compteur10 294 inchangés. Six applications rédigées non notées automatiquement.",
  ],
 },
 sections:[...complexSummaryA,...complexSummaryB,...complexSummaryC],evaluations:complexEvaluations,
 legacyAnchors:{
  "complex-algebra":"complex-definition","complex-powers":"complex-integer-powers","complex-conjugate":"complex-conjugation","complex-modulus":"complex-modulus-properties",
  "complex-arguments":"complex-argument-definition","trigonometric-form":"complex-trigonometric-form","exponential-form":"complex-exponential-form",
  "moivre-linearization":"complex-moivre-formula","complex-equations":"complex-square-roots","roots-of-unity":"complex-nth-roots",
 },
};
