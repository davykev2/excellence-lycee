import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { probabilityFixationA } from "./terminalCProbabilityFixationA";
import { probabilityFixationB } from "./terminalCProbabilityFixationB";
import { probabilityFixationC } from "./terminalCProbabilityFixationC";
import { probabilityDeepeningA } from "./terminalCProbabilityDeepeningA";
import { probabilityDeepeningB } from "./terminalCProbabilityDeepeningB";
import { probabilityDeepeningC } from "./terminalCProbabilityDeepeningC";
import { probabilityComplex } from "./terminalCProbabilityComplex";
const fixation=[...probabilityFixationA,...probabilityFixationB,...probabilityFixationC];
const rubrics:Array<[string,string,number,number,string]>=[
  ["conditional","Probabilité conditionnelle",1,7,"prob-condition"],
  ["independence","Événements indépendants",8,10,"prob-independence"],
  ["law","Variable aléatoire et loi de probabilité",11,13,"prob-law"],
  ["cdf","Fonction de répartition",14,16,"prob-cdf"],
  ["parameters","Espérance, variance et écart type",17,22,"prob-expectation"],
  ["bernoulli","Épreuve et schéma de Bernoulli",23,24,"prob-bernoulli"],
  ["binomial","Loi binomiale",25,35,"prob-binomial"],
];
export const terminalCProbabilityExercises:ArenaExerciseCollection={
  id:"tc-l9-exercises-20261019",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l17-probability",
  source:{
    title:"Pyramide Maths Tle C · Tome 1 · Leçon 9 · Probabilité conditionnelle et variable aléatoire",
    pages:[231,232,233,234,235,236,237,238],
    sha256:"893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes:[
      "52 exercices numérotés1–52, 35fixation/15approfondissement/2situations. Huit pages de banque PDF233–240/folios231–238 inspectées visuellement intégralement, avec agrandissements233/234/239/240. Sept rubriques bleues. Aucun scan publié ; corrections originales.",
      "Raccord exclusivement C au path historiqueL17 ; 8IDs/poids/132questions historiques/10 000XP et compteur10 294 inchangés. Rédactions et lois complètes sans notation automatique. Les conditions d’indépendance, d’équiprobabilité et de paramètre constant manquantes sont rendues explicites comme hypothèses de modèle, jamais comme faits prouvés.",
      "Ex2.2b le contraire porte uniquement surV : nonV intersectionC=2/25. Ex7 quatre issues de couleurs distinctes de20couples physiques équiprobables. Ex14.1 arrivéeR est vraie puisque[0,1] inclusR ;14.4 affine par intervalles est vraie, les constantes étant affines.",
      "Ex24 résultats d’élèves modélisés indépendants à probabilité commune ; absence de jumeaux ne prouve pas à elle seule l’indépendance des naissances25. Ex29 plus d’un signifieX>=2. Ex31 le succès mineur a probabilité0,33. Ex32 dix boîtes constituent l’échantillon d’un grand stock, non la totalité d’un stock de dix ; au moins une propre donne1-0,12^10.",
      "Ex35 se poursuit en folio235. Ex36 groupe neutre :90%sans baisse, donc10%avec baisse. Ex37 nombre1 nonpremier ; espérance-500/3,variance136250000/9. Ex38 probabilité5/6 du second nonrouge est conditionnée au premier vert ; variance1658000000/49,graphe aux échellesOI1000F/OJ21cm.",
      "Ex39 deux admissions incompatibles (dossier ou écrit+oral). Ex42.2 n’imprime que « On prend un individu au hasard », sans question : ne pas inventer de résultat à noter. Le contexte est conservé et seule la consigne complète1 est évaluée.",
      "Ex45.2b imprime seulement les règles de mise/paiement : elles figurent dans le contexte de2c, sans inventer une sous-question notée. Ex46 gain net après retrait de20 ; favorable entiern>=25. Ex47 temps moyen150h, non durée garantie. Ex48 événementX<=3 inclut0.",
      "Ex49 les lotsA sont harmonisés à100000F : l’introduction et4a impriment10000 malgré2/données de gains90000/190000, ce qui les rendait incompatibles. Énoncé cohérent conservant les données probabilistes ; P_G(A)=0,3,P_G(R)=0,6,P_G(B)=0,1 ; espérance-5200.",
      "Ex51 objectif d’espérance48 080 000F distingué d’une garantie ; linéarité sans indépendance. Ex52 pièce équilibrée et lancers indépendants explicités ;3/8contre5/16, différence6,25points de pourcentage.",
    ],
  },
  sections:[
    ...rubrics.map(([id,title,start,end,courseTopicId])=>({id:"tc-l9-"+id,title,category:"fixation" as const,courseTopicId,exercises:fixation.filter(e=>e.sourceNumber!>=start&&e.sourceNumber!<=end)})),
    {id:"tc-l9-deepening",title:"Exercices d’approfondissement",category:"deepening",courseTopicId:"prob-total",exercises:[...probabilityDeepeningA,...probabilityDeepeningB,...probabilityDeepeningC]},
    {id:"tc-l9-complex",title:"Situations complexes",category:"complex",courseTopicId:"prob-expectation",exercises:probabilityComplex},
  ],
};
