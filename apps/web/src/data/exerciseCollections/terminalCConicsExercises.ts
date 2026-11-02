import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { conicsFixationA } from "./terminalCConicsFixationA";
import { conicsFixationB } from "./terminalCConicsFixationB";
import { conicsDeepeningA } from "./terminalCConicsDeepeningA";
import { conicsDeepeningB } from "./terminalCConicsDeepeningB";
import { conicsDeepeningC } from "./terminalCConicsDeepeningC";
import { conicsComplex } from "./terminalCConicsComplex";
export const terminalCConicsExercises:ArenaExerciseCollection={
  id:"tc-t2-l4-exercises-20261019",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l07-conics",
  source:{
    title:"Pyramide Maths Tle C · Tome 2 · Leçon 4 · Coniques",pages:[107,108,109,110],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Folios105–108/PDF107–110 contrôlés visuellement :42 exercices(13 fixation/27 approfondissement/2 situations). Quatre sous-titres bleus sources ; regroupement éditorial supplémentaire Synthèse pour13. Ex38 commence109 et se termine110.",
      "Ex2 : ne pas déclarer faux un cercle non normalisé ou une hyperbole de membre droit−1 ; faire normaliser et identifier. Ex3a/b points,3c vide ; ex29 conserve le +1/4 et donne l’ensemble vide.",
      "Ex14/15/21 remplacent la demande erronée de centre d’une parabole par sommet et absence de centre ; aucun foyer doublé. Ex32 a reste le demi-axe horizontal, même quand l’axe focal est vertical.",
      "Ex33 suppose une forme réduite centrée en O. Ex34 foyer manquant : réponse familiale en F(u;v), v non nul ; ne pas inventer d’unicité.",
      "Ex35 cas m=−1 et1 droites parallèles, m=−2/3 droites sécantes. Ex36 m=−2 parabole, m=0 droites parallèles ; numérateur5m²+12m+8 strictement positif.",
      "Ex31 inclut z=1 sans division par0 et lieu union Ox/H. Ex37 repère tourné30°, X²/6−Y²/3=1. Ex38 similitude inverse, centre(2;−2). Ex39 K(5/2;3/2), G(2;2), asymptotes pentes2±√3. Ex40 véritable parabole d=MF, points de construction(0;4)/(4;2).",
      "Ex41 données insuffisantes pour E2 sans petit axe/centre ; solution conditionnelle conservant b13 et centre(−2;1), a′22,c′3sqrt35, écartement +5,099m, aucune validation de structure. Ex42 unité2m, deux couples foyer/directrice possibles, grand axe8m.",
      "Figures natives originales réservées aux corrections, aucun scan. Modèles de rédaction non notés automatiquement ; seuls choix et c/e évalués localement, sans XP. Contrat JSON Web/API étendu sans migration, IDs/poids/94 questions historiques et compteur10 294 inchangés.",
    ],
  },
  sections:[
    {id:"tc-t2-l4-general",title:"Généralités sur les coniques",category:"fixation",courseTopicId:"conics-reduction",exercises:conicsFixationA.slice(0,4)},
    {id:"tc-t2-l4-parabola",title:"Parabole",category:"fixation",courseTopicId:"conics-parabola-elements",exercises:conicsFixationA.slice(4)},
    {id:"tc-t2-l4-ellipse",title:"Ellipse",category:"fixation",courseTopicId:"conics-ellipse-elements",exercises:conicsFixationB.slice(0,3)},
    {id:"tc-t2-l4-hyperbola",title:"Hyperbole",category:"fixation",courseTopicId:"conics-hyperbola-elements",exercises:conicsFixationB.slice(3,6)},
    {id:"tc-t2-l4-synthesis",title:"Synthèse",category:"fixation",courseTopicId:"conics-focus-definition",exercises:conicsFixationB.slice(6)},
    {id:"tc-t2-l4-deepening",title:"Approfondissement",category:"deepening",courseTopicId:"conics-landmarks",exercises:[...conicsDeepeningA,...conicsDeepeningB,...conicsDeepeningC]},
    {id:"tc-t2-l4-complex",title:"Situations complexes",category:"complex",courseTopicId:"conics-focus-definition",exercises:conicsComplex},
  ],
};
