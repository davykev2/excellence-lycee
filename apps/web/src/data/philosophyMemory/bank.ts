import type {PhiloMemoryItem,PhiloNotion} from "../../features/philosophy/memoryModel";
import {philoDefinitions} from "./definitions";
import {philoQuotations} from "./quotations";

const notion=(id:string,title:string,description:string,chapter:string):PhiloNotion=>({id,title,description,coursePathId:"terminale-philo-"+chapter});
export const philoNotions:PhiloNotion[]=[
  notion("conscience","Conscience","Se connaître et porter un jugement.","l3-knowledge-of-man"),
  notion("liberte","Liberté","Choisir, agir et comprendre ses limites.","l3-knowledge-of-man"),
  notion("inconscient","Inconscient","Ce qui échappe à la conscience.","l3-knowledge-of-man"),
  notion("autrui","Autrui","Rencontrer un autre sujet.","l4-social-life"),
  notion("societe","Société","Vivre ensemble et échanger.","l4-social-life"),
  notion("etat","État et droit","Pouvoir, lois et justice.","l4-social-life"),
  notion("religion","Religion","Croyance, sacré et raison.","l5-god-religion"),
  notion("histoire","Histoire","Comprendre le devenir humain.","l6-history-humanity"),
  notion("philosophie","Philosophie","Questionner et examiner les idées.","l7-value-philosophy"),
  notion("progres","Progrès","Distinguer changement et amélioration.","l8-progress-happiness"),
  notion("bonheur","Bonheur","Désirs, plaisirs et vie heureuse.","l8-progress-happiness"),
  notion("travail","Travail","Produire et transformer le monde.","l8-progress-happiness"),
  notion("technique","Technique","Savoir-faire, moyens et finalités.","l8-progress-happiness"),
  notion("langage","Langage","Exprimer, communiquer et penser.","l9-language-truth"),
  notion("verite","Vérité","Distinguer vérité, opinion et certitude.","l9-language-truth"),
  notion("science","Science","Expliquer, démontrer et expérimenter.","l10-scientific-knowledge"),
];
export const philoMemoryItems:PhiloMemoryItem[]=[...philoQuotations,...philoDefinitions];
