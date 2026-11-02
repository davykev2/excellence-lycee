import type { CourseDocument } from "../../domain/courseDocument";
import { conicsSummaryA } from "./terminalCConicsSummaryA";
import { conicsSummaryB } from "./terminalCConicsSummaryB";
import { conicsSummaryC } from "./terminalCConicsSummaryC";
import { conicsEvaluations } from "./terminalCConicsEvaluations";
export const terminalCConicsDocument:CourseDocument={
  id:"tc-algebra-t2-l4-conics-summary",version:1,levelIds:["terminale-c"],
  source:{
    title:"Pyramide · Terminale C · Tome 2 · Coniques",lessonLabel:"Tome 2 · Leçon 4",pageCount:276,
    summaryPages:[92,93,94,95,96,97,98,99,100,101,102],evaluationPages:[103,104,105,106],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Résumé folios90–100/PDF92–102 et évaluations101–104/PDF103–106 inspectés visuellement. Activités/situation d’apprentissage ignorées. Formes, tableaux et cas dégénérés conservés, figures originales sans scans.",
      "Parabole : foyer à a/2 du sommet, non a ; paramètre |a| et distance OF=|a|/2. Exemples x²=2y F(0;1/2), y²=x F(1/4;0). Axe x²=y vertical ; légendes de graphes source interverties.",
      "Ellipse : sommets B(0;b),B′(0;−b), grand axe vertical si b>a. Cercle e=0 distingué de la définition foyer/directrice finie.",
      "Évaluation1b garde le signe moins de l’énoncé : hyperbole x²/25−y²/16=1, pas l’ellipse du corrigé imprimé. Évaluation2 garde le +8y de l’énoncé : sommet(−1;−4), non(−1;4). Valeurs de l’ellipse recalculées.",
      "Raccord C uniquement au path historique L07 ; 11 IDs/poids,94 questions historiques, feedback,progressions,10 000XP et compteur10 294 préservés. Les cinq applications rédigées ne reçoivent pas de fausse note automatique.",
    ],
  },
  sections:[...conicsSummaryA,...conicsSummaryB,...conicsSummaryC],evaluations:conicsEvaluations,
  legacyAnchors:{
    "conic-focus-directrix":"conics-focus-definition","conic-axis-vertices":"conics-parabola-definition","conic-region":"conics-focus-definition",
    "parabola-reduced-equation":"conics-parabola-elements","ellipse-reduced-equation":"conics-ellipse-form","hyperbola-reduced-equation":"conics-hyperbola-form",
    "pool-ellipse-mission":"conics-ellipse-form","official-fixation-workshop":"conics-equation",
    "parabola-construction-reinforcement":"conics-parabola-definition","conic-from-focus-directrix-reinforcement":"conics-focus-definition","complex-hyperbola-mission":"conics-landmarks",
  },
};
