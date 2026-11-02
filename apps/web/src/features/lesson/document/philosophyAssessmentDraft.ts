import type {PhilosophyExercise,PhilosophyTask} from "../../../data/philosophyDocuments/model";

export type PhilosophyAnswer=string|number[];
export type PhilosophyAnswers=Record<string,PhilosophyAnswer>;
export const philosophyAssessmentKey=(userId:string,levelId:string,pathId:string,exerciseId:string)=>
 "excellence-philosophy-document:"+[userId,levelId,pathId,exerciseId].map(encodeURIComponent).join(":")+":v1";
const signature=(exercise:PhilosophyExercise)=>{
 const text=JSON.stringify(exercise);let hash=2166136261;
 for(let i=0;i<text.length;i++)hash=Math.imul(hash^text.charCodeAt(i),16777619);
 return (hash>>>0).toString(36);
};
const cleanAnswer=(task:PhilosophyTask,value:unknown):PhilosophyAnswer|undefined=>{
 if(task.kind==="choice")return Array.isArray(value)&&value.length<=task.options.length&&
  value.every(index=>Number.isInteger(index)&&index>=0&&index<task.options.length)&&new Set(value).size===value.length
  ? [...value].sort((a,b)=>a-b) : undefined;
 return typeof value==="string"&&value.length<=(task.kind==="writing"?10000:500)?value:undefined;
};
const cleanAnswers=(exercise:PhilosophyExercise,answers:Record<string,unknown>):PhilosophyAnswers=>
 Object.fromEntries(exercise.tasks.flatMap(task=>{
  const value=cleanAnswer(task,answers[task.id]);return value===undefined?[]:[[task.id,value]];
 }));
export function restorePhilosophyAssessment(exercise:PhilosophyExercise,raw:string|null):PhilosophyAnswers{
 try{
  if(!raw||raw.length>200000)return {};
  const value=JSON.parse(raw);
  if(value?.version!==1||value.signature!==signature(exercise)||!value.answers||typeof value.answers!=="object"||Array.isArray(value.answers))return {};
  return cleanAnswers(exercise,value.answers);
 }catch{return {};}
}
export function serializePhilosophyAssessment(exercise:PhilosophyExercise,answers:PhilosophyAnswers){
 // Only drafts are stored; validation, marks and correction visibility are never trusted from storage.
 return JSON.stringify({version:1,signature:signature(exercise),answers:cleanAnswers(exercise,answers)});
}
export const normalizePhilosophyAnswer=(value:string)=>value.normalize("NFD").replace(/[\u0300-\u036f]/g,"")
 .toLocaleLowerCase("fr").replace(/[’‘`]/g,"'").trim().replace(/[.!?]+$/g,"").replace(/\s+/g," ");
export function philosophyAnswerStatus(task:PhilosophyTask,answer:PhilosophyAnswer|undefined):"writing"|"unanswered"|"correct"|"incorrect"{
 if(task.kind==="writing")return "writing";
 if(task.kind==="short"){
  if(typeof answer!=="string"||!answer.trim())return "unanswered";
  return task.accepted.some(expected=>normalizePhilosophyAnswer(answer)===normalizePhilosophyAnswer(expected))?"correct":"incorrect";
 }
 if(!Array.isArray(answer)||!answer.length)return "unanswered";
 return answer.length===task.correct.length&&new Set(answer).size===answer.length&&answer.every(index=>task.correct.includes(index))?"correct":"incorrect";
}
export function philosophyExerciseScore(exercise:PhilosophyExercise,answers:PhilosophyAnswers){
 const tasks=exercise.tasks.filter(task=>task.kind!=="writing");
 if(!tasks.length)return null;
 const correct=tasks.filter(task=>philosophyAnswerStatus(task,answers[task.id])==="correct").length;
 return {total:tasks.length,correct,percent:100*correct/tasks.length,score20:20*correct/tasks.length};
}
