import type {CourseWrittenTask} from "../../../domain/courseDocument";

export const humanitiesWritingStorageKey=(scope:string)=>"excellence-humanities-writing:"+scope;
const signature=(tasks:CourseWrittenTask[])=>JSON.stringify(tasks.map(task=>[task.id,task.prompt]));
export function restoreHumanitiesWriting(tasks:CourseWrittenTask[],raw:string|null):Record<string,string>{
  try{
    const saved=JSON.parse(raw??"null");
    if(saved?.version!==1||saved.signature!==signature(tasks)||!saved.answers||typeof saved.answers!=="object"||Array.isArray(saved.answers))return {};
    return Object.fromEntries(tasks.flatMap(task=>{
      const value=saved.answers[task.id];
      return typeof value==="string"&&value.length<=10000?[[task.id,value]]:[];
    }));
  }catch{return {};}
}
export function serializeHumanitiesWriting(tasks:CourseWrittenTask[],answers:Record<string,string>){
  return JSON.stringify({version:1,signature:signature(tasks),answers:Object.fromEntries(tasks.flatMap(task=>{
    const value=answers[task.id];
    return typeof value==="string"&&value.length<=10000?[[task.id,value]]:[];
  }))});
}
