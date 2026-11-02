import type{ArenaExerciseCollection}from"../../domain/arenaExercises";
import{gcdFixationA}from"./terminalCGcdFixationA";
import{gcdFixationB}from"./terminalCGcdFixationB";
import{gcdDeepeningA}from"./terminalCGcdDeepeningA";
import{gcdDeepeningB}from"./terminalCGcdDeepeningB";
import{gcdDeepeningC}from"./terminalCGcdDeepeningC";
import{gcdSituations}from"./terminalCGcdSituations";
const fixation=[...gcdFixationA,...gcdFixationB];
const groups:readonly[string,string,number,number,string][]=[
 ["multiples","Multiples d’un entier relatif",1,3,"gcd-multiples"],
 ["lcm","PPCM",4,10,"gcd-lcm-definition"],["divisors","PGCD et diviseurs communs",11,17,"gcd-definition"],
 ["euclid","Algorithme d’Euclide",18,20,"gcd-euclid"],["coprime","Nombres premiers entre eux",21,22,"gcd-coprime"],
 ["bezout","Bézout et équations entières",23,29,"gcd-bezout"],["products","Coprimalité et produits",30,31,"gcd-coprime-products"],
 ["gauss","Gauss et congruences",32,37,"gcd-gauss"],["factors","PPCM, PGCD et facteurs premiers",38,42,"gcd-prime-factors"],
 ["equations","Équations à deux inconnues entières",43,44,"gcd-diophantine"],["congruence","Équations de congruence",45,48,"gcd-congruence"],
];
export const terminalCGcdExercises:ArenaExerciseCollection={
 id:"tc-t2-l6-exercises-20261022",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l11-lcm-gcd",
 source:{title:"Pyramide Maths Tle C · Tome2 · Leçon6 · PPCM et PGCD",pages:[175,176,177,178,179,180],
 sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
 editorialNotes:[
  "Banque folios173–178/PDF175–180 contrôlée visuellement :82 exercices,48fixation/33approfondissement/1situation. Les deux grandes rubriques sources de fixation sont subdivisées en11 regroupements pédagogiques éditoriaux ; aucune fausse attribution de ces sous-titres au PDF.",
  "Ex7 plusieurs propositions sont vraies(4,5,20) : cinq décisions V/F plutôt qu’un QCM faussement unique. Ex38 donnéePPCM(108,150) corrigée de360 à2700, PGCD6. Ex40 calcule bien le PGCD, nonPDCD.",
  "Ex79.2b primalité de65537 vérifiée par les54premiers≤251 et leurs restes ; ex79.5c q possède un diviseur impair≥3, sans affirmer q impair. Ex80 injectivité limitée aux26indices : l’application sur N serait périodique ; AWA se décodeJDJ, pas un mot inventé.",
  "Ex78 labels répétés3.a/b clarifiés3.d/e ; ensemblesD positifs ici, distincts des diviseurs entiers signés du résumé. Ex81 seulement en correction : trois réseaux, équation et diagonale. Ex82 dates conservées, année2020bissextile, première rencontre735j/le11décembre2021 et pas de répétition avant2835j.",
  "Les preuves, listes de couples et solutions paramétriques ne sont pas comparées à un texte unique : modèles rédigés sans note automatique. Figures originales uniquement dans les corrections. Score objectif local sansXP ; aucune progression historique modifiée.",
 ]},
 sections:[
  ...groups.map(([id,title,first,last,courseTopicId])=>({id:"tc-t2-l6-"+id,title,category:"fixation" as const,courseTopicId,exercises:fixation.filter(e=>e.sourceNumber!>=first&&e.sourceNumber!<=last)})),
  {id:"tc-t2-l6-deepening-a",title:"Approfondissement",category:"deepening",courseTopicId:"gcd-lcm-relation",exercises:gcdDeepeningA},
  {id:"tc-t2-l6-deepening-b",title:"Problèmes et approfondissements",category:"deepening",courseTopicId:"gcd-congruence",exercises:[...gcdDeepeningB,...gcdDeepeningC]},
  {id:"tc-t2-l6-complex",title:"Situations complexes",category:"complex",courseTopicId:"gcd-congruence",exercises:gcdSituations},
 ],
};
