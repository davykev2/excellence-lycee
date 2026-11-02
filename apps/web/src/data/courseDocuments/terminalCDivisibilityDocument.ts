import type { CourseDocument } from "../../domain/courseDocument";
import { divisibilitySummaryA } from "./terminalCDivisibilitySummaryA";
import { divisibilitySummaryB } from "./terminalCDivisibilitySummaryB";
import { divisibilitySummaryC } from "./terminalCDivisibilitySummaryC";
import { divisibilityEvaluations } from "./terminalCDivisibilityEvaluations";
export const terminalCDivisibilityDocument:CourseDocument={
  id:"tc-algebra-t2-l2-divisibility-summary",version:1,levelIds:["terminale-c"],
  source:{
    title:"Pyramide · Terminale C · Tome 2 · Divisibilité dans ℤ",lessonLabel:"Tome 2 · Leçon 2",pageCount:276,
    summaryPages:Array.from({length:13},(_,i)=>49+i),evaluationPages:[62,63],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Résumé folios47–59/PDF49–61 et évaluations60–61/PDF62–63 inspectés visuellement. Trois rubriques complètes ; activités/situation d’apprentissage ignorées.",
      "Raccord uniquement C au path historique L03, sans renommer les 12 IDs ni changer les poids, 114 questions historiques, progressions, feedback, 10 000 XP ou compteur10 294.",
      "Opposé défini dans Z, non N ; opposé d’un négatif ou nul est positif ou nul, non strictement positif. Division N et formule plancher restreintes au diviseur positif.",
      "Exemple -43/7 : quotient -7 et non +7. Méthode de division signée reformulée avec B=|b| pour éviter les quatre cas ambigus ; reste toujours dans[0;|b|[.",
      "Primalité exige n>1 et diviseur propre ; la division par n lui-même ne prouve pas la composition. Pas de simplification illégitime d’un facteur dans une congruence.",
      "Trois méthodes, trois exemples et trois applications rédigées, toutes munies de solutions indépendantes. Aucune note automatique pour ces preuves ou listes justifiées.",
    ],
  },
  sections:[...divisibilitySummaryA,...divisibilitySummaryB,...divisibilitySummaryC],evaluations:divisibilityEvaluations,
  legacyAnchors:{
    "integer-divisibility":"div-divisors","euclidean-division-z":"div-euclid-z","remainders-operations":"div-euclid-natural",
    "congruences":"div-congruences","numeration-divisibility-tests":"div-bases","divisibility-tests":"div-criteria",
    "prime-numbers":"div-prime-definition","prime-factorization":"div-factorization","number-of-divisors":"div-factorization",
    "modular-strategy-mission":"div-congruences","affine-coding-mission":"div-congruences","exponential-coding-mission":"div-congruences",
  },
};
