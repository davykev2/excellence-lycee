import {useEffect,useId,useState} from "react";
import {MarkdownContent} from "../../../components/MarkdownContent";
import {MathText} from "../../../components/MathText";
import type {HumanitiesReader} from "../../../data/courseDocuments/humanitiesCourseSummary";
import {DocumentCorrection} from "./DocumentCorrection";
import {humanitiesWritingStorageKey,restoreHumanitiesWriting,serializeHumanitiesWriting} from "./humanitiesWritingDraft";

export function HumanitiesWritingPanel({writing,storageScope}:{writing:HumanitiesReader["writing"];storageScope:string}){
  const id=useId(),storageKey=humanitiesWritingStorageKey(storageScope);
  const restore=()=>{
    try{return restoreHumanitiesWriting(writing.tasks,window.localStorage.getItem(storageKey));}
    catch{return {};}
  };
  const [answers,setAnswers]=useState<Record<string,string>>(restore);
  useEffect(()=>{setAnswers(restore());},[storageKey,writing]);
  useEffect(()=>{
    try{window.localStorage.setItem(storageKey,serializeHumanitiesWriting(writing.tasks,answers));}
    catch{/* A draft is optional; writing and corrections remain usable. */}
  },[storageKey,writing,answers]);
  return <section className="humanities-writing" aria-labelledby={id+"-title"}>
    <header>
      <p className="document-small-label">Application rédigée · sans note automatique</p>
      <h2 id={id+"-title"}><MathText>{writing.title}</MathText></h2>
    </header>
    <details className="document-method humanities-writing-context" open><summary>Document et situation</summary><MarkdownContent markdown={writing.context}/></details>
    {writing.tasks.map((task,index)=><article className="document-written-task" data-humanities-writing-task={task.id} key={task.id}>
      <p className="document-small-label">Question {index+1}</p>
      <p className="document-question-prompt"><MathText>{task.prompt}</MathText></p>
      <label htmlFor={id+"-"+task.id}>Ta réponse</label>
      <textarea id={id+"-"+task.id} value={answers[task.id]??""} maxLength={10000} rows={5}
        placeholder="Rédige ta réponse en t’appuyant sur le cours…"
        onChange={event=>setAnswers(current=>({...current,[task.id]:event.target.value}))}/>
      <DocumentCorrection>
        <MarkdownContent markdown={task.model}/>
        <h4>Les points à retrouver dans ta réponse</h4>
        <ul>{task.criteria.map(criterion=><li key={criterion}>{criterion}</li>)}</ul>
      </DocumentCorrection>
    </article>)}
  </section>;
}
