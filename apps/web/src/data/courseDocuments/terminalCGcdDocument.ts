import type {CourseDocument}from"../../domain/courseDocument";
import{gcdSummaryA}from"./terminalCGcdSummaryA";
import{gcdSummaryB,gcdSummaryC}from"./terminalCGcdSummaryB";
import{gcdEvaluations}from"./terminalCGcdEvaluations";
export const terminalCGcdDocument:CourseDocument={
 id:"tc-algebra-t2-l6-gcd-summary",version:1,levelIds:["terminale-c"],
 source:{title:"Pyramide · Terminale C · Tome 2 · PPCM et PGCD",lessonLabel:"Tome 2 · Leçon 6",pageCount:276,
 summaryPages:Array.from({length:11},(_,i)=>162+i),evaluationPages:[173,174],
 sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
 editorialNotes:[
  "Résumé folios160–170/PDF162–172 et évaluation171–172/PDF173–174 inspectés visuellement. Activités et situation d’apprentissage ignorées. Trois rubriques sources ; propriétés et exemples conservés avec rédaction simple et sous-questions séparées.",
  "PPCM(360,21)=2520 et non520. Pour 8x+11y=0 on écrit 8x=−11y. Produit des diviseurs présenté comme outil d’énumération, pas comme égalité avec une liste. PGCD d positif et hypothèses de non-nullité conservés ; PGCD(a,0)=|a| explicité.",
  "Solutions de Bézout et paramétrages non uniques : les couples libres restent rédigés sans comparaison littérale arbitraire. Deux applications d’évaluation rédigées, sans fausse note automatique.",
  "Raccord C uniquement au chapitre historique11 ; huit IDs/poids/questions/XP/progressions/feedback et compteur10294 intacts. Aucun registre XP ni migration modifié.",
 ]},
 sections:[gcdSummaryA[0],{...gcdSummaryA[1],topics:[...gcdSummaryA[1].topics,...gcdSummaryB]},...gcdSummaryC],
 evaluations:gcdEvaluations,
 legacyAnchors:{"common-multiples-lcm":"gcd-lcm-definition","common-divisors-gcd":"gcd-definition","euclidean-algorithm":"gcd-euclid","bezout-identity":"gcd-bezout","gauss-theorem":"gcd-gauss","gcd-lcm-relation":"gcd-lcm-relation","diophantine-solvability":"gcd-diophantine","diophantine-congruences":"gcd-congruence"},
};
