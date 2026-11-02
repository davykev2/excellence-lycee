import type { CourseDocument } from "../../domain/courseDocument";
import { probabilitySummaryA } from "./terminalCProbabilitySummaryA";
import { probabilitySummaryB } from "./terminalCProbabilitySummaryB";
import { probabilityEvaluations } from "./terminalCProbabilityEvaluations";

export const terminalCProbabilityDocument: CourseDocument = {
  id: "tc-analysis-l9-probability-summary", version: 1, levelIds: ["terminale-c"],
  source: {
    title: "Pyramide · Terminale C · Tome 1 · Probabilité conditionnelle et variable aléatoire", lessonLabel: "Tome 1 · Leçon 9", pageCount: 268,
    summaryPages: [223,224,225,226,227,228,229,230], evaluationPages: [231,232],
    sha256: "893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes: [
      "Résumé folios221–228/PDF223–230,évaluation229–230/PDF231–232 inspectés visuellement intégralement. Activités et situation d’apprentissage exclues. C seulement ; path globalL17/8IDs/poids/132questions historiques/10 000XP/compteur10 294 inchangés.",
      "Probabilité conditionnelle exige P(A)>0 ; probabilités totales : partition et cas de probabilité nulle explicités. Indépendance ne signifie pas incompatibilité. Tirages sans remise ne sont pas tacitement rendus indépendants.",
      "Résumé p224 : donnéesA0,7/B0,4/P(nonA etnonB)0,28 conservées, mais conclusion corrigée en non-indépendance puisque0,3*0,6=0,18≠0,28. Aucune donnée changée pour imposer artificiellement l’indépendance annoncée par le support.",
      "PairesOO/OB/OV/BB/BV/VV non équiprobables. Le cas X<=200 inclutOO, omis du support. Gain roulette net100 et-100 : espérance-100/37 ; coefficient200 erroné du calcul imprimé corrigé en100.",
      "Loi(-20,-10,10,20,30) avecp(1/5,3/10,1/6,1/12,1/4) : E23/6, pas23/3 ; E2=385,V13331/36≈370,30556,sigma≈19,24332. Puissancesdesx toutes2, pasdernierxn^n.",
      "Répartition finie : croissante large, palier supérieur fermé à gauche, limites0/1. Pas de rejet erroné d’une applicationRversR ou d’un palier affine de pente0.",
      "Modèles de grippe et naissances : indépendance etprobabilité commune sont des hypothèses explicites, pas des conséquences biologiques. Évaluation familleB(3,0,49) : probabilités exactes0,132651/0,382347/0,367353/0,117649,V0,7497 ; pas lesarrondis0,14/0,36/0,74 de la source.",
      "Solutions simples et séparées par sous-question ; les formules symboliques/démonstrations ont un brouillon etunegrille,sans note automatique. Aucune notice de coquille affichée aux élèves.",
    ],
  },
  sections: [...probabilitySummaryA,...probabilitySummaryB], evaluations: probabilityEvaluations,
  legacyAnchors: {
    "conditional-probability": "prob-condition", "product-independence": "prob-independence",
    "partition-total-probability": "prob-total", "random-variable-law": "prob-law",
    "expectation-variance": "prob-expectation", "bernoulli-binomial": "prob-bernoulli",
    "binomial-parameters": "prob-binomial-parameters", "cumulative-distribution": "prob-cdf",
  },
};
