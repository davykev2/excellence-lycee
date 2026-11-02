import type {CourseDocumentSection,CourseDocumentTopic,CourseSummary,CourseWorkedExample} from "../../domain/courseDocument";
import type {LearningPath} from "../../domain/paths";

export type PhilosophyTask=
 | {id:string;kind:"choice";prompt:string;options:string[];correct:number[];explanation:string}
 | {id:string;kind:"short";prompt:string;accepted:string[];explanation:string}
 | {id:string;kind:"writing";prompt:string;model:string;criteria:string[]};
export interface PhilosophyExercise {id:string;title:string;pages:number[];statement?:string;tasks:PhilosophyTask[];correctionOrigin:"source-explained"|"excellence"}
export interface PhilosophyDocumentSeed {
 pathId:string;source:{title:string;pageCount:number;sha256:string;editorialNotes:string[]};
 sections:CourseDocumentSection[];essentials:{title:string;body:string;topic:string}[];
 legacy:Record<string,string>;exercises:PhilosophyExercise[];
}
export interface PhilosophyReader {summary:CourseSummary;source:PhilosophyDocumentSeed["source"];exercises:PhilosophyExercise[]}
export const topic=(id:string,title:string,pages:number[],body:string,examples:CourseWorkedExample[]=[]):CourseDocumentTopic=>({id,title,pages,body,examples});
export const section=(id:string,numeral:string,title:string,topics:CourseDocumentTopic[]):CourseDocumentSection=>({id,numeral,title,topics});
export const example=(id:string,title:string,prompt:string,parts:[string,string,string][]):CourseWorkedExample=>({id,title,prompt,parts:parts.map(([label,prompt,solution],index)=>({id:id+"-"+(index+1),label,prompt,solution}))});
export const choice=(id:string,prompt:string,options:string[],correct:number|number[],explanation:string):PhilosophyTask=>({id,kind:"choice",prompt,options,correct:Array.isArray(correct)?correct:[correct],explanation});
export const short=(id:string,prompt:string,accepted:string[],explanation:string):PhilosophyTask=>({id,kind:"short",prompt,accepted,explanation});
export const writing=(id:string,prompt:string,model:string,criteria:string[]):PhilosophyTask=>({id,kind:"writing",prompt,model,criteria});
export const exercise=(id:string,title:string,pages:number[],tasks:PhilosophyTask[],statement?:string,correctionOrigin:PhilosophyExercise["correctionOrigin"]="source-explained"):PhilosophyExercise=>({id,title,pages,tasks,statement,correctionOrigin});

/** New reading organisation; historical path/lesson identifiers and rewards are never mutated. */
export function buildPhilosophyReader(seed:PhilosophyDocumentSeed,path:LearningPath):PhilosophyReader {
 if(path.id!==seed.pathId)throw new Error("Document philosophie hors parcours");
 const lessons=path.modules.flatMap(module=>module.lessons),topics=seed.sections.flatMap(s=>s.topics);
 const anchors=Object.fromEntries(lessons.map(lesson=>{
  const suffix=lesson.id.slice(path.id.length+1),target=seed.legacy[suffix];
  if(!target||!topics.some(t=>t.id===target))throw new Error("Ancre philo à vérifier : "+lesson.id);
  return [lesson.id,target];
 }));
 return {source:seed.source,exercises:seed.exercises,summary:{id:path.id+"-source-document",version:1,levelIds:[...path.levelIds],legacyAnchors:anchors,
  sections:seed.sections.map(s=>({...s,topics:s.topics.map(t=>({...t,legacyLessonIds:lessons.filter(l=>anchors[l.id]===t.id).map(l=>l.id)}))})),
  essentials:seed.essentials.map((e,index)=>({id:path.id+"-essential-"+(index+1),title:e.title,body:e.body,topicId:e.topic})),
 }};
}
