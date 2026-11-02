import type {FrenchCard} from "./model";
export const frenchConnectors:Record<string,NonNullable<FrenchCard["completion"]>>={
 "fr-concession":{
  prompt:"Complète pour souligner que le plaisir de lire persiste malgré la longueur du récit.",
  before:"Le récit est long ; ",after:" Awa le lit avec plaisir.",answer:"pourtant",aliases:["cependant","néanmoins","toutefois","malgré cela"],
  explanation:"La longueur peut être présentée comme un obstacle, sans empêcher ici le plaisir de lire. « Pourtant » marque ce résultat contraire à l’attente ; d’autres connecteurs concessifs conviennent aussi à cette phrase.",
 },
 "fr-cause":{
  prompt:"Complète avec un connecteur qui introduit la raison de la relecture.",
  before:"Sana relit le passage ",after:" elle souhaite vérifier le sens d’un mot.",answer:"parce que",aliases:["car","puisque"],
  explanation:"Le souhait de vérifier un mot est donné comme raison de la relecture. « Parce que » introduit cette cause. « Car » convient aussi ; « puisque » présente la raison comme admise dans l’échange.",
 },
 "fr-consequence":{
  prompt:"Complète pour présenter la relecture comme une conséquence de la difficulté.",
  before:"Le passage est difficile à comprendre ; ",after:" nous le relisons lentement.",answer:"donc",aliases:["par conséquent","ainsi","c’est pourquoi"],
  explanation:"La relecture est présentée comme le résultat de la difficulté. Les variantes acceptées conservent cette relation dans l’énoncé donné ; un connecteur de cause l’inverserait.",
 },
 "fr-opposition":{
  prompt:"Complète avec un connecteur qui met en contraste les deux versions.",
  before:"Cette version est claire ; ",after:" l’autre reste confuse.",answer:"en revanche",aliases:["par contre","à l’inverse","au contraire"],
  explanation:"Les deux versions sont évaluées différemment. « En revanche » met leurs qualités en contraste. Les autres réponses admises expriment aussi ce contraste dans cette phrase.",
 },
 "fr-but":{
  prompt:"Complète avec un mot ou un groupe de mots qui introduit l’objectif.",
  before:"Elle prépare un plan ",after:" mieux organiser ses idées.",answer:"pour",aliases:["afin de","de manière à","de façon à","dans le but de","en vue de"],
  explanation:"« Mieux organiser ses idées » est l’objectif recherché. « Pour » et les groupes proposés peuvent introduire cet infinitif. La phrase exprime une intention, pas la certitude d’une réussite.",
 },
 "fr-addition":{
  prompt:"Complète avec un connecteur qui ajoute un autre service de la bibliothèque.",
  before:"La bibliothèque prête des romans. ",after:" elle propose aussi des ateliers.",answer:"De plus",aliases:["En outre","Par ailleurs"],
  explanation:"Les ateliers s’ajoutent au prêt des romans. « De plus », « en outre » et « par ailleurs » permettent cet ajout. La majuscule est normale au début d’une nouvelle phrase.",
 },
};
