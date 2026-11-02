import type { CourseDocument } from "../../domain/courseDocument";
import { statisticsSummaryA } from "./terminalCStatisticsSummaryA";
import { statisticsSummaryB } from "./terminalCStatisticsSummaryB";
import { statisticsEvaluations } from "./terminalCStatisticsEvaluations";
export const terminalCStatisticsDocument:CourseDocument={
  id:"tc-analysis-l10-statistics-summary",version:1,levelIds:["terminale-c"],
  source:{
    title:"Pyramide · Terminale C · Tome 1 · Statistique à deux variables",lessonLabel:"Tome 1 · Leçon 10",pageCount:268,
    summaryPages:[248,249,250,251,252],evaluationPages:[253,254,255,256,257],
    sha256:"893731F9F377FAA1A46FB052E62A204511F5083116EE8305109AE1C3C4995BF4",
    editorialNotes:[
      "Résumé folios246–250/PDF248–252 et évaluations251–255/PDF253–257 inspectés visuellement. Activités et situation d’apprentissage exclues. C seulement, path global L19,6 IDs/poids/83 questions historiques/10 000XP/compteur10 294 intacts.",
      "Fréquence7/30 arrondie23,33% et non23,34% pour forcer le total. Covariance : indice1 àn, pas0 àn. Donnée du salaire217000 conservée, non ajustée artificiellement.",
      "Exemple régressions : G(7;577,5),VY714175/12,Cov3475/6 ; b=-2345/17 et b'=39424/28567. Deux directions et moindres carrés verticaux/horizontaux distincts, variances positives requises.",
      "Corrélation résumé : covariance21,5 conservée contre21,1 dans le calcul imprimé. r≈0,995626, l’arrondi1,00 n’est pas un alignement parfait. Seuil0,87 présenté comme repère du support, pas universel.",
      "Évaluation nuage : point(2;35) conforme au tableau, pas38 du texte et du graphe. Argent de poche : Cov=-6250, signe moins conservé. Formule b' correctement primée.",
      "Interprétation négative : -1≤r≤-0,87, pas≤+0,87. Population : r0,956488558→0,956 à trois décimales. Application finale :9 couples visibles, donc9 salariés, non10 inventés.",
      "Trois résultats numériques notés, quatre tâches rédigées à modèles/grilles non notées automatiquement. Corrections indépendantes, graphiques des applications dans leur solution seulement. Pas de notice de coquille publique.",
    ],
  },
  sections:[...statisticsSummaryA,...statisticsSummaryB],evaluations:statisticsEvaluations,
  legacyAnchors:{"scatter-plot":"stats-scatter","mean-point":"stats-mean",covariance:"stats-covariance",correlation:"stats-correlation","regression-lines":"stats-regressions","statistical-estimation":"stats-adjustment"},
};
