import type { ArenaExerciseCollection } from "../../domain/arenaExercises";
import { spaceFixationA } from "./terminalCSpaceFixationA";
import { spaceFixationB } from "./terminalCSpaceFixationB";
import { spaceDeepeningA } from "./terminalCSpaceDeepeningA";
import { spaceDeepeningB } from "./terminalCSpaceDeepeningB";
import { spaceDeepeningC } from "./terminalCSpaceDeepeningC";
import { spaceComplex } from "./terminalCSpaceComplex";
export const terminalCSpaceExercises:ArenaExerciseCollection={
  id:"tc-t2-l3-exercises-20261019",version:1,levelId:"terminale-c",subjectId:"mathematics",lessonKey:"terminale-c-math-l05-space-analytic-geometry",
  source:{
    title:"Pyramide Maths Tle C · Tome 2 · Leçon 3 · Géométrie analytique de l’espace",pages:[80,81,82],
    sha256:"6C79BA3066F9ADBA689DBA3EACB28228189D92EE5C97876CD29D80B7A20A6E29",
    editorialNotes:[
      "Folios78–80/PDF80–82 contrôlés visuellement : 29 exercices(13 fixation/15 approfondissement/1 situation). Les trois regroupements de fixation sont éditoriaux : le support ne comporte pas de sous-titres bleus thématiques.",
      "Exercices4 et5 identiques dans le support : les deux numéros sont conservés. Ex6 « trois points A et B » corrigé en deux points et premier système y=1-lambda ; les trois choix originaux étaient incorrects pour AB.",
      "Ex18.2 : un plan passant par A et orthogonal à ABC n’est pas unique ; donner un choix et ne pas ajouter d’unicité absente de la consigne source. Ex21 y=-4t-3, t manquant dans l’impression, confirmé par les deux plans.",
      "Ex27.3 : vérifier aussi A hors de Delta ; la question2 ne teste que D. Ex28 : G(2;0;-5), H(-1;-3;-2), sphère rayon6 et section cercle rayon3.",
      "Ex29 : d’une droite à un plan sécants, distance0 ; intersectiont=63/2. Ne pas imposer le parallélisme suggéré par le dessin, ni substituer un segment à la droite sans domaine. Seuil2m traité seulement comme critère scolaire ; la formulation source « au moins » et l’affirmation de sécurité sont neutralisées, aucune certification électrique.",
      "Tous les repères du lot sont orthonormés. Équations, preuves et constructions en réponses rédigées, sans fausse note automatique ; V/F, choix et deux distances évalués localement sans XP. Figures natives, aucun scan.",
      "Douze IDs/poids,82 questions historiques, feedback, progression,10 000XP et compteur10 294 inchangés. Extension JSON Web/API sans migration.",
    ],
  },
  sections:[
    {id:"tc-t2-l3-normals",title:"Vecteurs normaux et équations de plans",category:"fixation",courseTopicId:"space-normal",exercises:spaceFixationA.slice(0,5)},
    {id:"tc-t2-l3-lines",title:"Droites de l’espace",category:"fixation",courseTopicId:"space-line",exercises:[...spaceFixationA.slice(5),...spaceFixationB.slice(0,2)]},
    {id:"tc-t2-l3-positions",title:"Positions relatives et distances",category:"fixation",courseTopicId:"space-two-planes",exercises:spaceFixationB.slice(2)},
    {id:"tc-t2-l3-deepening",title:"Approfondissement",category:"deepening",courseTopicId:"space-plane-equation",exercises:[...spaceDeepeningA,...spaceDeepeningB,...spaceDeepeningC]},
    {id:"tc-t2-l3-complex",title:"Situations complexes",category:"complex",courseTopicId:"space-line-plane",exercises:spaceComplex},
  ],
};
