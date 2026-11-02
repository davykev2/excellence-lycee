import {ArrowLeft,ArrowRight,ArrowSquareOut,BookOpenText,Brain,CheckCircle,ClockCounterClockwise,Lightbulb,Quotes,XCircle} from "@phosphor-icons/react";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {philoMemoryItems,philoNotions} from "../../data/philosophyMemory/bank";
import {createMemoryQuestions,createMemorySession,emptyMemoryState,memoryAnswerCorrect,memoryConsolidated,memoryShuffle,memoryStorageKey,restoreMemoryState,submitMemoryAnswer} from "./memoryEngine";
import type {MemoryAnswer,MemoryQuestion,MemoryState,PhiloMemoryItem,PhiloQuotation} from "./memoryModel";

const questions=createMemoryQuestions(philoMemoryItems);
const questionById=new Map(questions.map(question=>[question.id,question]));
const itemById=new Map(philoMemoryItems.map(item=>[item.id,item]));
const formatLabels={meaning:"Comprendre une citation",cloze:"Citation à trous",author:"Retrouver l’auteur",completion:"Terminer la citation",work:"Retrouver l’ouvrage",order:"Reconstituer la citation",definition:"Définition",recognition:"Reconnaître une notion"};

function QuotationSource({item}:{item:PhiloQuotation}) {
  return <div className="philo-source"><strong>{item.author}</strong><span><cite>{item.work}</cite> · {item.location}</span><small>{item.edition}</small><a href={item.url} target="_blank" rel="noopener noreferrer">Lire la source<ArrowSquareOut size={16}/></a></div>;
}
function ItemReference({item}:{item:PhiloMemoryItem}) {
  return <>{item.kind==="quote"?<><blockquote>« {item.text} »</blockquote><QuotationSource item={item}/><p>{item.explanation}</p><p className="philo-application"><strong>Dans une dissertation.</strong> {item.application}</p></>
    :<><h3>{item.label}</h3><p>{item.text}</p><p>{item.explanation}</p><p className="philo-application"><strong>Exemple.</strong> {item.example}</p></>}</>;
}
function expectedAnswer(question:MemoryQuestion){return question.expected.join(question.format==="order"?" ":" · ");}
function displayAnswer(question:MemoryQuestion,answer:MemoryAnswer){return answer.filter(Boolean).join(question.format==="order"?" ":" · ");}

interface Props {userId:string;levelId:string;notion?:string;onNotionChange:(notion?:string)=>void;onBack:()=>void;onOpenCourse:(id:string)=>void}
export function PhiloMemoryPage({userId,levelId,notion:requestedNotion,onNotionChange,onBack,onOpenCourse}:Props) {
  const key=memoryStorageKey(userId,levelId);
  const [storageError,setStorageError]=useState(false);
  const [state,setState]=useState<MemoryState>(()=>{try{return restoreMemoryState(window.localStorage.getItem(key),philoMemoryItems,questions,Date.now());}catch{return emptyMemoryState();}});
  const [count,setCount]=useState(10),[showLibrary,setShowLibrary]=useState(false),[search,setSearch]=useState("");
  const focusRef=useRef<HTMLHeadingElement>(null),headingRef=useRef<HTMLHeadingElement>(null),lastWritten=useRef<string|null>(null);
  const notion=philoNotions.find(notion=>notion.id===requestedNotion);
  const session=state.session,question=session&&questionById.get(session.queue[session.index]),item=question&&itemById.get(question.itemId);
  const response=session?.responses[session.index],checked=!!response,answer=response?.answer??session?.draft??[];
  const correct=question&&response?memoryAnswerCorrect(question,response.answer):false;
  const now=Date.now(),selectedItems=philoMemoryItems.filter(item=>!notion||item.notions.includes(notion.id));
  const libraryItems=selectedItems.filter(item=>JSON.stringify(item).toLocaleLowerCase("fr").includes(search.toLocaleLowerCase("fr")));
  const due=philoMemoryItems.filter(item=>state.reviews[item.id]&&state.reviews[item.id].dueAt<=now).length;
  const activeSession=session&&session.index<session.queue.length;
  const sessionFinished=session&&session.index===session.queue.length;
  useEffect(()=>{
    const serialized=JSON.stringify(state);if(serialized===lastWritten.current)return;
    try{window.localStorage.setItem(key,serialized);lastWritten.current=serialized;setStorageError(false);}catch{setStorageError(true);}
  },[state,key]);
  useEffect(()=>{const listener=(event:StorageEvent)=>{if(event.key===key){lastWritten.current=event.newValue;setState(restoreMemoryState(event.newValue,philoMemoryItems,questions,Date.now()));}};window.addEventListener("storage",listener);return()=>window.removeEventListener("storage",listener);},[key]);
  useEffect(()=>{if(activeSession)focusRef.current?.focus();},[session?.index,session?.seed,activeSession]);
  useEffect(()=>{if(requestedNotion)headingRef.current?.scrollIntoView({block:"start"});},[requestedNotion]);
  const errors=session?.responses.filter(result=>!memoryAnswerCorrect(questionById.get(result.questionId)!,result.answer)||result.assisted).map(result=>questionById.get(result.questionId)!.itemId)??[];

  function start(mode:"notion"|"daily"|"errors",notionId=notion?.id??"all"){
    const next=createMemorySession(philoMemoryItems,state.reviews,questions,notionId,mode,count,`${Date.now()}-${Math.random().toString(36).slice(2)}`,Date.now(),errors);
    if(!next)return;setState(previous=>({...previous,session:next}));setShowLibrary(false);
  }
  function updateAnswer(next:MemoryAnswer){setState(previous=>!previous.session||previous.session.responses.length>previous.session.index?previous:{...previous,session:{...previous.session,draft:next}});}
  function validate(event:FormEvent){event.preventDefault();setState(previous=>submitMemoryAnswer(previous,philoMemoryItems,questions,previous.session?.draft??[],Date.now()));}
  function next(){setState(previous=>!previous.session||previous.session.responses.length<=previous.session.index?previous:{...previous,session:{...previous.session,index:previous.session.index+1,draft:[],assisted:false}});}
  function leaveSession(){setState(previous=>({...previous,session:null}));}

  return <main className="philo-memory-page">
    <header className="philo-memory-topbar"><button type="button" onClick={onBack}><ArrowLeft size={20}/>M’entraîner</button><span>Philosophie</span></header>
    <header className="philo-memory-heading"><div className="philo-memory-icon"><Brain size={29} weight="duotone"/></div><div><p>{notion?"Mémoire philo":"Citations & notions"}</p><h1 ref={headingRef}>{session?philoNotions.find(n=>n.id===session.notion)?.title??"Mémoire philo":notion?.title??"Mémoire philo"}</h1></div></header>
    {storageError&&<p className="philo-storage-error" role="alert">Tes réponses restent utilisables, mais les révisions ne peuvent pas être enregistrées sur cet appareil.</p>}

    {activeSession&&question&&item?<section className="philo-session" aria-label="Séance de révision">
      <div className="philo-session-meta"><span>{philoNotions.find(n=>n.id===session.notion)?.title??"Révisions du jour"}</span><span>Question {session.index+1} / {session.queue.length}</span></div>
      <progress value={session.index} max={session.queue.length} aria-label="Avancement de la séance"/>
      <form onSubmit={validate} className="philo-question" key={session.seed+":"+session.index}>
        <p className="philo-format">{formatLabels[question.format]}</p><p className="philo-question-notions">{item.notions.map(id=>philoNotions.find(n=>n.id===id)?.title).filter(Boolean).join(" · ")}</p><h2 tabIndex={-1} ref={focusRef}>{question.prompt}</h2>
        {question.quotation&&<blockquote>« {question.quotation} »</blockquote>}
        {question.options?<div className="philo-options" aria-label="Propositions de réponse">
          {memoryShuffle(question.options,session.seed+":"+session.index).map((option,index)=>{
            const selected=answer[0]===option,expected=checked&&option===question.expected[0];
            return <button type="button" key={option} aria-pressed={selected} disabled={checked} onClick={()=>updateAnswer([option])}
              className={[selected?"is-selected":"",checked&&selected?(correct?"is-correct":"is-incorrect"):"",expected&&!selected?"is-expected":""].filter(Boolean).join(" ")}>
              <span className="philo-option-letter">{String.fromCharCode(65+index)}</span><span>{checked&&selected&&!correct?<del>{option}</del>:option}</span>{checked&&selected&&(correct?<CheckCircle size={23}/>:<XCircle size={23}/>)}</button>;
          })}
        </div>:question.format==="order"?<div className="philo-order">
          <div className="philo-order-answer" aria-label="Ta citation reconstituée">{answer.length?answer.map((chunk,index)=><button key={index} type="button" disabled={checked} aria-label={`Retirer le fragment ${index+1}`} onClick={()=>updateAnswer(answer.filter((_,i)=>i!==index))}>{chunk}<span aria-hidden="true">×</span></button>):<span>Choisis le premier fragment.</span>}</div>
          <div className="philo-order-pool" aria-label="Fragments disponibles">{memoryShuffle(question.chunks!,session.seed).filter(chunk=>!answer.includes(chunk)).map(chunk=><button type="button" key={chunk} disabled={checked} onClick={()=>updateAnswer([...answer,chunk])}>{chunk}</button>)}</div>
          {!checked&&answer.length>0&&<button className="philo-text-button" type="button" onClick={()=>updateAnswer([])}>Recommencer l’ordre</button>}
        </div>:question.format==="cloze"?<fieldset className="philo-cloze"><legend className="sr-only">Mots manquants de la citation</legend><p>
          {question.parts!.map((part,index)=><span key={index}>{part}{index<question.expected.length&&<label><span className="sr-only">Mot manquant {index+1}</span><input value={answer[index]??""} disabled={checked} autoComplete="off" autoCorrect="off" spellCheck={false} maxLength={100} onChange={event=>updateAnswer(question.expected.map((_,i)=>i===index?event.target.value:answer[i]??""))}/></label>}</span>)}
        </p></fieldset>:<div className="philo-completion"><blockquote>« {question.prefix}… »</blockquote><label htmlFor="philo-completion">La suite de la citation<textarea id="philo-completion" rows={3} maxLength={500} value={answer[0]??""} disabled={checked} autoComplete="off" onChange={event=>updateAnswer([event.target.value])}/></label></div>}
        {!checked&&<div className="philo-question-actions"><button className="philo-primary" type="submit">Valider ma réponse<CheckCircle size={21}/></button>
          {!question.options&&<button className="philo-hint-button" type="button" onClick={()=>setState(previous=>({...previous,session:previous.session?{...previous.session,assisted:true}:null}))}><Lightbulb size={20}/>Un indice</button>}
        </div>}
        {!checked&&session.assisted&&<p className="philo-hint" role="status">{question.format==="order"?`Premier fragment : « ${question.expected[0]} »`:question.expected.map((word,index)=>`${index+1}. ${word.slice(0,1)}${"·".repeat(Math.min(15,Math.max(1,word.length-1)))}`).join(" · ")}</p>}
        {checked&&<section className={`philo-feedback ${correct?"is-correct":"is-incorrect"}`} aria-live="polite">
          <h3>{correct?<CheckCircle size={24}/>:<XCircle size={24}/>} {correct?"Bonne réponse":answer.some(value=>value.trim())?"À revoir":"Pas de réponse"}</h3>
          {!correct&&answer.some(value=>value.trim())&&<p>Ta réponse : <del>{displayAnswer(question,answer)}</del></p>}
          <p className="philo-expected"><strong>Réponse attendue :</strong> {expectedAnswer(question)}</p>
          {response.assisted&&<p className="philo-assisted">Réussite avec un indice : cette carte reviendra pour t’entraîner sans aide.</p>}
          <ItemReference item={item}/>
          <button className="philo-primary" type="button" onClick={next}>{session.index+1===session.queue.length?"Voir mon bilan":"Question suivante"}<ArrowRight size={21}/></button>
        </section>}
      </form>
      <div className="philo-notion-actions"><button className="philo-text-button" type="button" onClick={onBack}>Faire une pause</button><button className="philo-text-button" type="button" onClick={leaveSession}>Changer de notion</button></div>
    </section>:sessionFinished?<section className="philo-session-results">
      <CheckCircle size={42} weight="duotone"/><h2>Séance terminée</h2>
      {(()=>{const right=session.responses.filter(r=>memoryAnswerCorrect(questionById.get(r.questionId)!,r.answer)).length,percentage=Math.round(right/session.queue.length*100);return <><strong>{right} / {session.queue.length} bonnes réponses</strong><p>{percentage} % · {Number((right/session.queue.length*20).toFixed(1)).toLocaleString("fr")} / 20</p></>;})()}
      <p>{errors.length?`${new Set(errors).size} carte${new Set(errors).size>1?"s":""} à reprendre sans aide.`:"Tes prochaines révisions sont programmées."}</p>
      <div className="philo-result-actions">{errors.length>0&&<button className="philo-primary" type="button" onClick={()=>start("errors",session.notion)}>Reprendre mes erreurs<ClockCounterClockwise size={21}/></button>}<button className="philo-secondary" type="button" onClick={leaveSession}>Choisir une autre notion</button></div>
    </section>:<>
      {!notion&&<section className="philo-daily"><div><ClockCounterClockwise size={27}/><div><h2>Révisions du jour</h2><p>{due?`${due} carte${due>1?"s":""} à revoir.`:philoMemoryItems.some(item=>!state.reviews[item.id])?"Découvre de nouvelles citations et définitions.":"Tes révisions sont à jour pour aujourd’hui."}</p></div></div><button className="philo-primary" type="button" onClick={()=>start(philoMemoryItems.some(item=>!state.reviews[item.id]||state.reviews[item.id].dueAt<=Date.now())?"daily":"notion","all")}>{philoMemoryItems.some(item=>!state.reviews[item.id]||state.reviews[item.id].dueAt<=now)?"Commencer":"Réviser librement"}<ArrowRight size={21}/></button></section>}
      <section className="philo-settings"><label>Une séance de<select value={count} onChange={event=>setCount(Number(event.target.value))}>{[5,10,15,20].map(n=><option value={n} key={n}>{n} questions</option>)}</select></label><p>Révisions enregistrées pour ton compte sur cet appareil.</p></section>
      {!notion&&<section className="philo-notion-grid" aria-label="Choisir une notion">{philoNotions.map(n=>{
        const cards=philoMemoryItems.filter(item=>item.notions.includes(n.id)),retained=cards.filter(item=>memoryConsolidated(item,state.reviews[item.id])).length;
        return <button key={n.id} type="button" onClick={()=>{onNotionChange(n.id);setShowLibrary(false);setSearch("");}}><Quotes size={25} weight="duotone"/><strong>{n.title}</strong><span>{n.description}</span><small>{retained?`${retained} carte${retained>1?"s":""} consolidée${retained>1?"s":""}`:`${cards.filter(item=>item.kind==="quote").length} citations · ${cards.filter(item=>item.kind==="definition").length} définitions`}</small></button>;
      })}</section>}
      {notion&&<section className="philo-notion-detail"><header><div><p>Ta sélection</p><h2>{notion.title}</h2></div><button type="button" className="philo-text-button" onClick={()=>onNotionChange(undefined)}>Toutes les notions</button></header><div className="philo-notion-actions"><button className="philo-primary" type="button" onClick={()=>start("notion")}>M’entraîner<ArrowRight size={21}/></button><button className="philo-secondary" type="button" aria-expanded={showLibrary} onClick={()=>setShowLibrary(value=>!value)}><BookOpenText size={20}/>{showLibrary?"Fermer les fiches":"Apprendre les citations et définitions"}</button><button className="philo-text-button" type="button" onClick={()=>onOpenCourse(notion.coursePathId)}>Revoir le cours</button></div></section>}
      {notion&&showLibrary&&<section className="philo-reference-library" aria-label="Fiches de mémorisation"><label>Rechercher dans cette notion<input type="search" value={search} maxLength={100} onChange={event=>setSearch(event.target.value)} placeholder="Un auteur, un mot, une définition…"/></label>
        {libraryItems.map(item=><article className="philo-reference-card" key={item.id}><p className="philo-format">{item.kind==="quote"?"Citation":"Définition"}</p><ItemReference item={item}/></article>)}
        {!libraryItems.length&&<p role="status">Aucune fiche pour cette recherche.</p>}
      </section>}
    </>}
  </main>;
}
