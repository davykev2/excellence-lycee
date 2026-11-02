import type {MemoryQuestion,PhiloMemoryItem} from "../../features/philosophy/memoryModel";
import {frenchFigures} from "./figures";
import {frenchArgumentation} from "./argumentation";
import {frenchConnectors} from "./connectors";
export const frenchSections=[
  {id:"figures",title:"Figures de style",description:"Reconnaître les procédés et expliquer leurs effets."},
  {id:"argumentation",title:"Argumentation",description:"Repérer les idées, leurs raisons et les liens logiques."},
] as const;
export const frenchCards=[...frenchFigures,...frenchArgumentation].map(card=>({...card,...(frenchConnectors[card.id]?{completion:frenchConnectors[card.id]}:{})}));
const masculine=new Set(["fr-oxymore","fr-euphemisme","fr-theme","fr-argument","fr-exemple","fr-but"]);
function termVariants(card:typeof frenchCards[number]){
  if(card.id==="fr-convaincre"||card.id==="fr-persuader")return card.aliases??[];
  const label=card.label.toLocaleLowerCase("fr"),vowel=/^[aeiouyhàâéèêîïôùûœ]/i.test(label);
  return [...card.aliases??[],(vowel?"l’":masculine.has(card.id)?"le ":"la ")+label,(masculine.has(card.id)?"un ":"une ")+label];
}
export const frenchPracticeItems:PhiloMemoryItem[]=frenchCards.map(card=>({
  kind:"definition",id:card.id,notions:[card.section],label:card.label,text:card.definition,distractors:card.distractors,
  explanation:card.tip,example:card.identify.text,formats:card.completion?["recognition","meaning","completion","cloze","definition"]:["recognition","meaning","cloze","definition"],
  requireRecall:true,reviewSignature:JSON.stringify(card),
}));
export const frenchQuestions:MemoryQuestion[]=frenchCards.flatMap<MemoryQuestion>(card=>[
  {id:card.id+":recognition",itemId:card.id,format:"recognition",prompt:card.identify.prompt,quotation:card.identify.text,options:[card.identify.answer,...card.identify.distractors],expected:[card.identify.answer]},
  {id:card.id+":meaning",itemId:card.id,format:"meaning",prompt:card.interpret.prompt,quotation:card.interpret.text,options:[card.interpret.answer,...card.interpret.distractors],expected:[card.interpret.answer]},
  {id:card.id+":cloze",itemId:card.id,format:"cloze",prompt:card.recallPrompt??"Quel est le nom de la figure de style visée ? Écris le terme, sans développer.",quotation:card.identify.text,parts:["Terme attendu : ",""],expected:[card.label],
    acceptedAnswers:[...new Set(termVariants(card))].map(value=>[value])},
  {id:card.id+":definition",itemId:card.id,format:"definition",prompt:`Quelle proposition définit « ${card.label.toLocaleLowerCase("fr")} » ?`,options:[card.definition,...card.distractors],expected:[card.definition]},
  ...(card.completion?[{id:card.id+":completion",itemId:card.id,format:"completion" as const,prompt:card.completion.prompt,prefix:card.completion.before,suffix:card.completion.after,expected:[card.completion.answer],acceptedAnswers:card.completion.aliases.map(alias=>[alias])}]:[]),
]);
export function frenchQuestionExplanation(question:MemoryQuestion){
  const card=frenchCards.find(card=>card.id===question.itemId)!;
  return question.format==="completion"?card.completion!.explanation:question.format==="meaning"?card.interpret.explanation:question.format==="definition"?card.tip:card.identify.explanation;
}
export function frenchStorageKey(userId:string,levelId:string){return `excellence-french-workshop:v1:${encodeURIComponent(userId)}:${encodeURIComponent(levelId)}`;}
