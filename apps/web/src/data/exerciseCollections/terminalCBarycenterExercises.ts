import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { barycenterFixationA } from "./terminalCBarycenterFixationA";
import { barycenterFixationB } from "./terminalCBarycenterFixationB";
import { barycenterDeepeningA } from "./terminalCBarycenterDeepeningA";
import { barycenterDeepeningB } from "./terminalCBarycenterDeepeningB";
import { barycenterTheorems,barycenterComplex } from "./terminalCBarycenterTheorems";
const fixation=[...barycenterFixationA,...barycenterFixationB];
const rubrics:Array<[string,string,number,number,string]>=[
  ["definition","Barycentre de n points pondérés",1,3,"bary-definition"],
  ["homogeneity","Homogénéité",4,5,"bary-homogeneity"],
  ["vectors","Réduction de sommes vectorielles",6,7,"bary-reduction"],
  ["coordinates","Coordonnées",8,9,"bary-coordinates"],
  ["partial","Barycentres partiels",10,11,"bary-partial"],
  ["affine","Ensemble des barycentres",12,12,"bary-affine-locus"],
  ["quadratic","Sommes de carrés · barycentre",13,15,"bary-quadratic"],
  ["zero-sum","Sommes de carrés · niveaux particuliers",16,17,"bary-zero-quadratic"],
  ["ratio","Rapport de distances",18,18,"bary-apollonius"],
  ["angle","Angle orienté",19,19,"bary-oriented-angles"],
];
export const terminalCBarycenterExercises:ArenaExerciseCollection={
  id:"tc-t2-l1-exercises-20261019",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l02-barycenter",
  source:{
    title:"Pyramide Maths Tle C · Tome 2 · Leçon 1 · Barycentre et lignes de niveau",pages:[28,29,30,31,32],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "41 exercices, folios26–30/PDF28–32 intégralement contrôlés :19 fixation,21 approfondissement,1 situation ;10 rubriques. Tous les sous-items conservés, expressions et figures reconstruites nativement.",
      "Ex4 S2 coefficients12/8/9/-6/6 : somme29, normalisation2/29. Ex5 somme-17/12. Ex7 sensQM/RM rétabli avant réduction. Repères8/9/11 préservés.",
      "Ex15 et17 : AB2,AC1,BC1 imposent trois points alignés C milieuAB, non un triangle non dégénéré. Longueurs conservées. Ex16 BD2 supprimé : D non défini et donnée inutilisable ; lieu décrit avec I milieuBC, sans inventer d’angle.",
      "Ex17 S1, malgré son emplacement sous somme nulle ; correction par identité du milieu, niveaux vide et singletonC. Ex18 [EF] harmonisé en[AB] puisque seul MA/MB est utilisé ; sphèreG729/80,R81/80.",
      "Ex19 -2pi/3 modulo2pi : petit arc inférieur. Ex27 -pi/3 modulo pi : cercle privé des extrémités, pas un seul arc. Ex22b norme égale à-a : vide ; quatre cas indépendants.",
      "Ex24 grille exacte A0;3,B5;2,C2;1,D0;0,E3;3 =>G1;13/7. L’énoncé montre seulement les cinq points ; G est réservé à la correction.",
      "Ex32 AK/KJ4,DK/KI2/3 ; poidsA1,B0,C2,D2 ouA2,B-1,C3,D1. Ex33 espace : sphère, non cercle. Ex36 ordresA-I-J-B,B-K-L-C,C-M-N-A protégés après relecture de la figure.",
      "Ex37 G manquant dans le texte défini par(DJ)∩(KB) conformément à la figure. Ex38 rapports orientés, Ceva concurrence OU parallélisme, Ménélaüs signe+1. Ex39 intersections uniques hors sommets et rayons distincts explicités pour rendre les quotients définis.",
      "Ex40 M intérieur pour les aires, hypothèses de sommes partielles explicites. Ex41 graduations BG3,GA2 :12kg,30000F,manque3000F ; tige de masse négligée pour le modèle.",
      "Rédactions non notées automatiquement. Réponses objectives, corrections et figures indépendantes. Anciennes questions/IDs/poids/10 000XP/counter10 294 inchangés. Contrat JSON figures Web/API étendu sans migration, tout local.",
    ],
  },
  sections:[
    ...rubrics.map(([id,title,start,end,courseTopicId])=>({id:"tc-t2-l1-"+id,title,category:"fixation" as const,courseTopicId,exercises:fixation.filter(e=>e.sourceNumber!>=start&&e.sourceNumber!<=end)})),
    {id:"tc-t2-l1-deepening",title:"Exercices d’approfondissement",category:"deepening",courseTopicId:"bary-partial",exercises:[...barycenterDeepeningA,...barycenterDeepeningB,...barycenterTheorems]},
    {id:"tc-t2-l1-complex",title:"Situations complexes",category:"complex",courseTopicId:"bary-definition",exercises:barycenterComplex},
  ],
};
