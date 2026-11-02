import {ArrowLeft,ArrowRight,ArrowSquareOut,BookOpenText,CheckCircle,ClockCounterClockwise,Feather,Lightbulb,TextAa,XCircle} from "@phosphor-icons/react";
import {useEffect,useRef,useState,type FormEvent} from "react";
import {frenchCards,frenchPracticeItems,frenchQuestionExplanation,frenchQuestions,frenchSections,frenchStorageKey} from "../../data/frenchWorkshop/bank";
import type {FrenchCard} from "../../data/frenchWorkshop/model";
import {createMemorySession,memoryAnswerCorrect,memoryConsolidated,memoryShuffle,normalizeMemoryAnswer} from "../philosophy/memoryEngine";
import type {MemoryAnswer} from "../philosophy/memoryModel";
import {submitMemoryAnswer} from "../philosophy/memoryEngine";
import {useMemoryStore} from "../memory/useMemoryStore";

const questionById=new Map(frenchQuestions.map(q=>[q.id,q]));
const cardById=new Map(frenchCards.map(card=>[card.id,card]));
const labels={recognition:"Repérer dans un texte",meaning:"Comprendre et expliquer",cloze:"Retrouver le terme",definition:"Définition",completion:"Compléter le texte"};

function Reference({card}:{card:FrenchCard}){
  return <div className="philo-source"><strong>{card.reference.publisher}</strong><a href={card.reference.url} target="_blank" rel="noopener noreferrer">{card.reference.title}<ArrowSquareOut size={16}/></a></div>;
}
function ReferenceCard({card}:{card:FrenchCard}){
  return <article className="philo-reference-card french-reference-card"><h3>{card.label}</h3><p>{card.definition}</p><p className="philo-application"><strong>À retenir.</strong> {card.tip}</p>
    <h4>Exemple</h4><p className="french-excerpt">{card.identify.text}</p><p>{card.identify.explanation}</p><Reference card={card}/></article>;
}
interface Props {userId:string;levelId:string;section?:string;onSectionChange:(section?:string)=>void;onBack:()=>void}
export function FrenchWorkshopPage({userId,levelId,section:requestedSection,onSectionChange,onBack}:Props){
  const {state,setState,storageError}=useMemoryStore(frenchStorageKey(userId,levelId),frenchPracticeItems,frenchQuestions);
  const [count,setCount]=useState(10),[showLibrary,setShowLibrary]=useState(false),[search,setSearch]=useState("");
  const questionHeading=useRef<HTMLHeadingElement>(null),heading=useRef<HTMLHeadingElement>(null);
  const section=frenchSections.find(section=>section.id===requestedSection),session=state.session;
  const current=session?questionById.get(session.queue[session.index]):undefined,card=current?cardById.get(current.itemId):undefined;
  const response=session?.responses[session.index],answer=response?.answer??session?.draft??[],checked=!!response;
  const correct=!!current&&!!response&&memoryAnswerCorrect(current,response.answer);
  const active=!!session&&session.index<session.queue.length,finished=!!session&&session.index===session.queue.length;
  const errors=session?.responses.filter(r=>r.assisted||!memoryAnswerCorrect(questionById.get(r.questionId)!,r.answer)).map(r=>questionById.get(r.questionId)!.itemId)??[];
  const title=(session?frenchSections.find(section=>section.id===session.notion)?.title:section?.title)??"Atelier de français";
  const now=Date.now(),due=frenchPracticeItems.filter(item=>state.reviews[item.id]?.dueAt<=now).length;
  const hasDaily=frenchPracticeItems.some(item=>!state.reviews[item.id]||state.reviews[item.id].dueAt<=now);
  const library=frenchCards.filter(card=>(!section||card.section===section.id)&&normalizeMemoryAnswer([card.label,card.definition,card.identify.text,card.tip].join(" ")).includes(normalizeMemoryAnswer(search)));
  useEffect(()=>{if(active)questionHeading.current?.focus();},[active,session?.index,session?.seed]);
  useEffect(()=>{if(requestedSection)heading.current?.scrollIntoView({block:"start"});setShowLibrary(false);setSearch("");},[requestedSection]);

  function start(mode:"notion"|"daily"|"errors",sectionId=section?.id??"all"){
    const next=createMemorySession(frenchPracticeItems,state.reviews,frenchQuestions,sectionId,mode,count,`${Date.now()}-${Math.random().toString(36).slice(2)}`,Date.now(),errors);
    if(next)setState(previous=>({...previous,session:next}));
  }
  function updateAnswer(draft:MemoryAnswer){setState(previous=>!previous.session||previous.session.responses.length>previous.session.index?previous:{...previous,session:{...previous.session,draft}});}
  function validate(event:FormEvent){event.preventDefault();setState(previous=>submitMemoryAnswer(previous,frenchPracticeItems,frenchQuestions,previous.session?.draft??[],Date.now()));}
  function next(){setState(previous=>!previous.session||previous.session.responses.length<=previous.session.index?previous:{...previous,session:{...previous.session,index:previous.session.index+1,draft:[],assisted:false}});}
  function chooseSection(){setState(previous=>({...previous,session:null}));onSectionChange(undefined);setShowLibrary(false);}

  return <main className="philo-memory-page french-workshop-page">
    <header className="philo-memory-topbar"><button type="button" onClick={onBack}><ArrowLeft size={20}/>M’entraîner</button><span>Français</span></header>
    <header className="philo-memory-heading"><div className="philo-memory-icon"><Feather size={29} weight="duotone"/></div><div><p>{section||session?"Atelier de français":"Lire, comprendre, retenir"}</p><h1 ref={heading}>{title}</h1></div></header>
    {storageError&&<p className="philo-storage-error" role="alert">Tu peux continuer, mais tes révisions ne peuvent pas être enregistrées sur cet appareil.</p>}
    {active&&current&&card&&session?<section className="philo-session" aria-label="Séance de français">
      <div className="philo-session-meta"><span>{frenchSections.find(section=>section.id===card.section)?.title}</span><span>Question {session.index+1} / {session.queue.length}</span></div>
      <progress value={session.index} max={session.queue.length} aria-label="Avancement de la séance"/>
      <form className="philo-question" onSubmit={validate} key={session.seed+":"+session.index}>
        <p className="philo-format">{labels[current.format as keyof typeof labels]}</p><h2 ref={questionHeading} tabIndex={-1}>{current.prompt}</h2>
        {current.quotation&&<p className="french-excerpt">{current.quotation}</p>}
        {current.options?<div className="philo-options" aria-label="Propositions de réponse">{memoryShuffle(current.options,session.seed+":"+session.index).map((option,index)=>{
          const selected=answer[0]===option,expected=checked&&option===current.expected[0];
          return <button type="button" key={option} disabled={checked} aria-pressed={selected} onClick={()=>updateAnswer([option])} className={[selected?"is-selected":"",checked&&selected?(correct?"is-correct":"is-incorrect"):"",expected&&!selected?"is-expected":""].filter(Boolean).join(" ")}>
            <span className="philo-option-letter">{String.fromCharCode(65+index)}</span><span>{checked&&selected&&!correct?<del>{option}</del>:option}</span>{checked&&selected&&(correct?<CheckCircle size={23}/>:<XCircle size={23}/>)}</button>;
        })}</div>:<div className="french-answer-field">{current.format==="completion"&&<p className="french-excerpt">{current.prefix}<span className="french-gap" aria-label="Mot ou groupe de mots manquant"> […] </span>{current.suffix}</p>}<label className="french-term-answer" htmlFor="french-term">{current.format==="completion"?"Le mot ou groupe de mots manquant":"Terme attendu"}<input id="french-term" className={checked?(correct?"is-correct":"is-incorrect"):""} value={answer[0]??""} disabled={checked} maxLength={100} autoComplete="off" autoCorrect="off" spellCheck={false} onChange={event=>updateAnswer([event.target.value])}/></label></div>}
        {!checked&&<div className="philo-question-actions"><button type="submit" className="philo-primary">Valider ma réponse<CheckCircle size={21}/></button><button type="button" className="philo-hint-button" onClick={()=>setState(previous=>({...previous,session:previous.session?{...previous.session,assisted:true}:null}))}><Lightbulb size={20}/>Un indice</button></div>}
        {!checked&&session.assisted&&<p className="philo-hint" role="status">{current.format==="cloze"?`Le terme commence par « ${card.label[0]} ».`:card.tip}</p>}
        {checked&&response&&<section className={`philo-feedback ${correct?"is-correct":"is-incorrect"}`} aria-live="polite">
          <h3>{correct?<CheckCircle size={24}/>:<XCircle size={24}/>} {correct?"Bonne réponse":answer.some(a=>a.trim())?"À revoir":"Pas de réponse"}</h3>
          {!correct&&answer.some(a=>a.trim())&&<p>Ta réponse : <del>{answer.join(" · ")}</del></p>}
          <p className="philo-expected"><strong>Réponse attendue :</strong> {current.expected.join(" · ")}</p>
          {current.format!=="definition"&&<p>{frenchQuestionExplanation(current)}</p>}
          {current.format==="completion"&&<p className="french-accepted"><strong>Autres réponses acceptées :</strong> {current.acceptedAnswers!.map(answer=>answer[0]).join(" · ")}</p>}
          {response.assisted&&<p className="philo-assisted">Tu as utilisé un indice : ce repère reviendra pour être revu sans aide.</p>}
          <div className="french-correction-rule"><h4>{card.label}</h4>{current.format!=="definition"&&<p>{card.definition}</p>}<p>{card.tip}</p></div>
          <Reference card={card}/><button type="button" className="philo-primary" onClick={next}>{session.index+1===session.queue.length?"Voir mon bilan":"Question suivante"}<ArrowRight size={21}/></button>
        </section>}
      </form>
      <div className="philo-notion-actions"><button type="button" className="philo-text-button" onClick={onBack}>Faire une pause</button><button type="button" className="philo-text-button" onClick={chooseSection}>Changer de rubrique</button></div>
    </section>:finished&&session?<section className="philo-session-results">
      <CheckCircle size={42} weight="duotone"/><h2>Séance terminée</h2>
      {(()=>{const right=session.responses.filter(r=>memoryAnswerCorrect(questionById.get(r.questionId)!,r.answer)).length,assisted=session.responses.filter(r=>r.assisted&&memoryAnswerCorrect(questionById.get(r.questionId)!,r.answer)).length;return <><strong>{right} / {session.queue.length} bonnes réponses</strong><p>{Math.round(right/session.queue.length*100)} % · {Number((right/session.queue.length*20).toFixed(1)).toLocaleString("fr")} / 20</p>{assisted>0&&<p>Dont {assisted} avec un indice.</p>}</>;})()}
      <p>{errors.length?`${new Set(errors).size} repère${new Set(errors).size>1?"s":""} à reprendre sans aide.`:"Tes prochaines révisions sont programmées."}</p>
      <div className="philo-result-actions">{errors.length>0&&<button type="button" className="philo-primary" onClick={()=>start("errors",session.notion)}>Reprendre mes erreurs<ClockCounterClockwise size={21}/></button>}<button type="button" className="philo-secondary" onClick={chooseSection}>Choisir une rubrique</button></div>
    </section>:<>
      {!section&&<section className="philo-daily"><div><ClockCounterClockwise size={27}/><div><h2>Révisions du jour</h2><p>{due?`${due} repère${due>1?"s":""} à revoir.`:hasDaily?"Des exemples pour reconnaître les procédés et construire un raisonnement.":"Tes révisions sont à jour pour aujourd’hui."}</p></div></div><button type="button" className="philo-primary" onClick={()=>start(hasDaily?"daily":"notion","all")}>{hasDaily?"Commencer":"Réviser librement"}<ArrowRight size={21}/></button></section>}
      <section className="philo-settings"><label>Une séance de<select value={count} onChange={event=>setCount(Number(event.target.value))}>{[5,10,15,20].map(n=><option key={n} value={n}>{n} questions</option>)}</select></label><p>Révisions enregistrées pour ton compte sur cet appareil.</p></section>
      {!section&&<section className="philo-notion-grid french-section-grid" aria-label="Choisir une rubrique">{frenchSections.map(section=>{
        const cards=frenchCards.filter(card=>card.section===section.id),retained=frenchPracticeItems.filter(item=>item.notions.includes(section.id)&&memoryConsolidated(item,state.reviews[item.id])).length;
        return <button type="button" key={section.id} onClick={()=>onSectionChange(section.id)}><TextAa size={28} weight="duotone"/><strong>{section.title}</strong><span>{section.description}</span><small>{cards.length} repères{retained?` · ${retained} consolidé${retained>1?"s":""}`:""}</small></button>;
      })}</section>}
      {section&&<section className="philo-notion-detail"><header><div><p>Ta rubrique</p><h2>{section.title}</h2></div><button type="button" className="philo-text-button" onClick={()=>onSectionChange(undefined)}>Toutes les rubriques</button></header><div className="philo-notion-actions"><button type="button" className="philo-primary" onClick={()=>start("notion")}>M’entraîner<ArrowRight size={21}/></button><button type="button" className="philo-secondary" aria-expanded={showLibrary} onClick={()=>setShowLibrary(value=>!value)}><BookOpenText size={20}/>{showLibrary?"Fermer les fiches":"Fiches repères et exemples"}</button></div></section>}
      {section&&showLibrary&&<section className="philo-reference-library" aria-label="Fiches de français"><label>Rechercher dans cette rubrique<input type="search" value={search} maxLength={100} onChange={event=>setSearch(event.target.value)} placeholder="Un procédé, un mot, un exemple…"/></label>{library.map(card=><ReferenceCard key={card.id} card={card}/>)}{!library.length&&<p role="status">Aucune fiche pour cette recherche.</p>}</section>}
    </>}
  </main>;
}
