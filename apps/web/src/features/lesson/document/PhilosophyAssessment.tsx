import {CheckCircle,XCircle,MinusCircle} from "@phosphor-icons/react";
import {useEffect,useId,useState} from "react";
import {MarkdownContent} from "../../../components/MarkdownContent";
import type {PhilosophyExercise,PhilosophyTask} from "../../../data/philosophyDocuments/model";
import {DocumentCorrection} from "./DocumentCorrection";
import {philosophyAnswerStatus,philosophyAssessmentKey,philosophyExerciseScore,restorePhilosophyAssessment,serializePhilosophyAssessment,type PhilosophyAnswer,type PhilosophyAnswers} from "./philosophyAssessmentDraft";

const expectedAnswer=(task:PhilosophyTask)=>task.kind==="choice"?task.correct.map(index=>task.options[index]).join(" ; "):task.kind==="short"?task.accepted[0]:"";
const answerText=(task:PhilosophyTask,answer:PhilosophyAnswer|undefined)=>task.kind==="choice"&&Array.isArray(answer)?answer.map(index=>task.options[index]).join(" ; "):typeof answer==="string"?answer:"";

function AnswerResult({task,answer}:{task:PhilosophyTask;answer:PhilosophyAnswer|undefined}){
 const status=philosophyAnswerStatus(task,answer);
 if(status==="writing")return null;
 return <div className={`philosophy-answer-result is-${status}`} data-philosophy-result={status}>
  <p className="philosophy-result-label">{status==="correct"?<><CheckCircle size={20} aria-hidden="true"/>Bonne réponse</>:status==="incorrect"?<><XCircle size={20} aria-hidden="true"/>À revoir</>:<><MinusCircle size={20} aria-hidden="true"/>Pas de réponse</>}</p>
  {status==="correct"?<p className="philosophy-answer-correct">{answerText(task,answer)}</p>:<>
   {status==="incorrect"&&<p className="philosophy-answer-incorrect"><span>Ta réponse : </span><s>{answerText(task,answer)}</s></p>}
   <p className="philosophy-answer-expected"><span>Réponse attendue : </span>{expectedAnswer(task)}</p>
  </>}
 </div>;
}

function PhilosophyExercisePanel({exercise,userId,levelId,pathId,index}:{exercise:PhilosophyExercise;userId:string;levelId:string;pathId:string;index:number}){
 const id=useId(),storageKey=philosophyAssessmentKey(userId,levelId,pathId,exercise.id);
 const [answers,setAnswers]=useState<PhilosophyAnswers>(()=>{
  try{return restorePhilosophyAssessment(exercise,window.localStorage.getItem(storageKey));}catch{return {};}
 });
 const [validated,setValidated]=useState(false);
 useEffect(()=>{
  try{window.localStorage.setItem(storageKey,serializePhilosophyAssessment(exercise,answers));}catch{/* Draft storage is optional; answering remains available. */}
 },[answers,exercise,storageKey]);
 const score=philosophyExerciseScore(exercise,answers);
 const update=(task:PhilosophyTask,value:PhilosophyAnswer)=>{setAnswers(current=>({...current,[task.id]:value}));setValidated(false);};
 const choose=(task:Extract<PhilosophyTask,{kind:"choice"}>,option:number)=>{
  const previous=Array.isArray(answers[task.id])?answers[task.id] as number[]:[];
  update(task,task.correct.length>1?(previous.includes(option)?previous.filter(item=>item!==option):[...previous,option]):[option]);
 };
 return <article className="philosophy-exercise" data-philosophy-exercise={exercise.id} aria-labelledby={id+"-title"}>
  <header><p className="document-small-label">Application {index+1}</p><h2 id={id+"-title"}>{exercise.title}</h2></header>
  {exercise.statement&&<div className="philosophy-study-text"><MarkdownContent markdown={exercise.statement}/></div>}
  {exercise.tasks.some(task=>task.kind==="writing")&&<p className="philosophy-writing-note">Réponse rédigée · modèle et repères de relecture, sans note automatique.</p>}
  <form onSubmit={event=>{event.preventDefault();setValidated(true);}}>
   {exercise.tasks.map((task,taskIndex)=><fieldset className="philosophy-task" data-philosophy-task={task.id} key={task.id}>
    <legend><span>{taskIndex+1}.</span> {task.prompt}</legend>
    {task.kind==="choice"?<>
     {task.correct.length>1&&<p className="philosophy-multiple-hint">Plusieurs réponses possibles.</p>}
     <div className="philosophy-options">{task.options.map((option,optionIndex)=>{
      const selected=Array.isArray(answers[task.id])&&(answers[task.id] as number[]).includes(optionIndex);
      return <label key={optionIndex} className={selected?"is-selected":""}>
       <input type={task.correct.length>1?"checkbox":"radio"} name={id+"-"+task.id} checked={selected} value={optionIndex} onChange={()=>choose(task,optionIndex)}/><span>{option}</span>
      </label>;
     })}</div>
    </>:<>
     <label className="philosophy-answer-label" htmlFor={id+"-"+task.id}>Ta réponse</label>
     {task.kind==="writing"?<textarea id={id+"-"+task.id} maxLength={10000} rows={6} value={typeof answers[task.id]==="string"?answers[task.id] as string:""} onChange={event=>update(task,event.target.value)} placeholder="Développe ton raisonnement…"/>
      :<input id={id+"-"+task.id} type="text" maxLength={500} value={typeof answers[task.id]==="string"?answers[task.id] as string:""} onChange={event=>update(task,event.target.value)} autoComplete="off"/>}
    </>}
    {validated&&<AnswerResult task={task} answer={answers[task.id]}/>}
   </fieldset>)}
   {score&&<div className="philosophy-validation">
    <button type="submit" className="document-primary-button">Vérifier mes réponses</button>
    {validated&&<p role="status" className="philosophy-score">{score.correct} / {score.total} · {score.percent.toLocaleString("fr-FR",{maximumFractionDigits:1})} % · {score.score20.toLocaleString("fr-FR",{maximumFractionDigits:1})} / 20{exercise.tasks.some(task=>task.kind==="writing")?" — questions objectives uniquement":""}</p>}
   </div>}
  </form>
  <DocumentCorrection>{exercise.tasks.map((task,taskIndex)=><section className="philosophy-model" key={task.id}>
   <h4>{taskIndex+1}. {task.prompt}</h4>
   {task.kind==="writing"?<>
    <MarkdownContent markdown={task.model}/>
    <h5>Pour relire ta réponse</h5><ul>{task.criteria.map(criterion=><li key={criterion}>{criterion}</li>)}</ul>
   </>:<><p className="philosophy-answer-expected"><strong>Réponse : </strong>{expectedAnswer(task)}</p><MarkdownContent markdown={task.explanation}/></>}
  </section>)}</DocumentCorrection>
 </article>;
}

export function PhilosophyAssessment({exercises,userId,levelId,pathId}:{exercises:PhilosophyExercise[];userId:string;levelId:string;pathId:string}){
 return <div className="philosophy-assessment">{exercises.map((exercise,index)=><PhilosophyExercisePanel key={[userId,levelId,pathId,exercise.id].join(":")} {...{exercise,index,userId,levelId,pathId}}/>)}</div>;
}
