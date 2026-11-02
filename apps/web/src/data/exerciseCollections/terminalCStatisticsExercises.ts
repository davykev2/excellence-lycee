import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { statisticsFixation } from "./terminalCStatisticsFixation";
import { statisticsDeepeningA } from "./terminalCStatisticsDeepeningA";
import { statisticsDeepeningB } from "./terminalCStatisticsDeepeningB";
import { statisticsDeepeningC } from "./terminalCStatisticsDeepeningC";
import { statisticsDeepeningD } from "./terminalCStatisticsDeepeningD";
import { statisticsWeighted } from "./terminalCStatisticsWeighted";
import { statisticsComplex } from "./terminalCStatisticsComplex";
const rubrics:Array<[string,string,number,number,string]>=[
  ["series","Série statistique double · Fréquences marginales",1,3,"stats-marginals"],
  ["scatter","Nuage de points · Point moyen",4,7,"stats-scatter"],
  ["covariance","Covariance",8,9,"stats-covariance"],
  ["regression","Droite de régression",10,12,"stats-regressions"],
  ["correlation","Coefficient de corrélation",13,14,"stats-correlation"],
];
export const terminalCStatisticsExercises:ArenaExerciseCollection={
  id:"tc-l10-exercises-20261019",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l19-statistics",
  source:{
    title:"Pyramide Maths Tle C · Tome 1 · Leçon 10 · Statistique à deux variables",pages:[256,257,258,259,260,261,262],
    sha256:"893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes:[
      "37 exercices complets, folios256–262/PDF258–264 inspectés visuellement :14 fixation/21 approfondissement/2 situations complexes ;5 rubriques bleues. Contextes et tableaux reconstruits, pas de scans.",
      "Path C historique L19 ;6 IDs/poids/83 questions/10 000XP/compteur10 294 intacts. Banque indépendante, rédactions/graphes/équations complètes sans score automatique. Arrondis numériques précisés pour les champs courts.",
      "Ex10 conserve les lettres imprimées c/d/e/f dans les choix. Ex15 alpha691,année2033. Ex16 alpha4,beta14 ; donnéeG est un contexte, non une fausse question1.",
      "Ex17 donnée atypique80cm pour3kg conservée, non transformée en50cm sans preuve ; r0,23247 faible, Mayer et moindres carrés distincts. Estimations inverses17/18/19 résolvent le modèle Y enX demandé et ne sont jamais présentées comme une nouvelle régression X enY.",
      "Ex20 X est le numéro du mois, pas de l’année. Ex21 unités centainesF et6000F→x60 ; arrondi1 client, prédiction non garantie.",
      "Ex22 données conservées : Vx3030/49≈61,84 et Vy1591400/49≈32477,55, non61,92/32480,73 imprimés. Les paramètres ne sont jamais calculés avec des moyennes préalablement arrondies.",
      "Ex23 les7 points lus du graphique donnent a203/346,b-104/173, donc0,59x-0,60 et non-0,62. Ex24 coefficientX manquant rétabli ; b exact50,25, non50,27. Question2 respecte l’arrondi par défaut, pas au plus proche.",
      "Ex27 données brutes donnent Vx4,234375,Cov5,40625 (non4,18/5,57). Objectif travailleurs depuis hectares : droiteXenY173/270Y+89/135,11travailleurs ; le1,28x+0,54 imprimé n’est pas cette régression.",
      "Ex30 marges total248 et fréquences non conditionnelles. Ex31 alpha20,r0,9. Ex32 logarithmes affichés0,01, calculs précision complète ; modèlepuissance233,66991x^0,459058. À20000F extrapolation22031F>revenu, limite explicitée, pas conseil financier.",
      "Ex33 listex1…11puis13 conservée, pas de couple12 inventé. Modèle logarithmique d’ajustement, non identité pour toutes les observations.",
      "Ex35 pondérations pourcentages nécessaires : G24,6;3,09,Cov-2,614,r-0,77139. La grille9couples non pondérés donneY3,r0, et comprend un couple de fréquence0 : distinction explicitée dans l’énoncé corrigé, le modèle et la figure.",
      "Ex36 critère président satisfait par71,846644kg, mais corrélation/extrapolation sur5personnes ne prouve pas l’efficacité d’une campagne ni diagnostic. Ex37 seuil strict x>23,0700257 : premier mois24=décembre2019, pas novembre ni simple arrondi23.",
      "Toutes les figures de réponse restent dans les corrections ; seul le nuage non annoté23 est dans l’énoncé. Graphiques natifs, axes et échelles explicites, vue logarithmique32orthonormée, contrôles44px et texte16px, sans eval.",
    ],
  },
  sections:[
    ...rubrics.map(([id,title,start,end,courseTopicId])=>({id:"tc-l10-"+id,title,category:"fixation" as const,courseTopicId,exercises:statisticsFixation.filter(e=>e.sourceNumber!>=start&&e.sourceNumber!<=end)})),
    {id:"tc-l10-deepening",title:"Exercices d’approfondissement",category:"deepening",courseTopicId:"stats-regressions",exercises:[...statisticsDeepeningA,...statisticsDeepeningB,...statisticsDeepeningC,...statisticsDeepeningD,...statisticsWeighted]},
    {id:"tc-l10-complex",title:"Situations complexes",category:"complex",courseTopicId:"stats-adjustment",exercises:statisticsComplex},
  ],
};
