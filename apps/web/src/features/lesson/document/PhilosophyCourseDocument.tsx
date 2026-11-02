import {WarningCircle} from "@phosphor-icons/react";
import {useEffect,useMemo,useState,type ComponentProps} from "react";
import type {PhilosophyDocumentSeed} from "../../../data/philosophyDocuments/model";
import {buildPhilosophyReader} from "../../../data/philosophyDocuments/model";
import {loadPhilosophyDocument} from "../../../data/philosophyDocuments/registry";
import type {LearningPath} from "../../../domain/paths";
import {LessonDocumentScreen} from "./LessonDocumentScreen";
import {PhilosophyAssessment} from "./PhilosophyAssessment";

type Props=Omit<ComponentProps<typeof LessonDocumentScreen>,"path"|"document"|"assessmentContent"|"essentialsContent"|"readingOnly">&{path:LearningPath};
export default function PhilosophyCourseDocument(props:Props){
 const [loaded,setLoaded]=useState<{id:string;seed?:PhilosophyDocumentSeed;error?:boolean}>({id:props.path.id});
 const [attempt,setAttempt]=useState(0);
 useEffect(()=>{
  let active=true;setLoaded({id:props.path.id});
  loadPhilosophyDocument(props.path.id).then(seed=>{if(active)setLoaded({id:props.path.id,seed});},()=>{if(active)setLoaded({id:props.path.id,error:true});});
  return ()=>{active=false;};
 },[props.path.id,attempt]);
 const reader=useMemo(()=>loaded.id===props.path.id&&loaded.seed?buildPhilosophyReader(loaded.seed,props.path):null,[loaded,props.path]);
 if(!reader)return <main className="philosophy-course-loading">
  {loaded.id===props.path.id&&loaded.error?<>
   <WarningCircle size={30} aria-hidden="true"/><h1>Le cours n’a pas pu être chargé.</h1><button className="document-primary-button" onClick={()=>setAttempt(value=>value+1)}>Réessayer</button>
  </>:<p role="status">Chargement du cours…</p>}
  <button type="button" className="path-back-button" onClick={props.onBackToLibrary}>Mes cours</button>
 </main>;
 return <LessonDocumentScreen key={[props.currentUser.id,props.level.id,props.path.id].join(":")} {...props} document={reader.summary} className="philosophy-course-document"
  assessmentContent={<PhilosophyAssessment exercises={reader.exercises} userId={props.currentUser.id} levelId={props.level.id} pathId={props.path.id}/>}/>;
}
