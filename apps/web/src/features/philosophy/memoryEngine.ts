import type {MemoryAnswer,MemoryFormat,MemoryQuestion,MemoryReview,MemorySession,MemoryState,PhiloMemoryItem} from "./memoryModel";

export const memoryDay=86_400_000;
const intervals=[600_000,memoryDay,3*memoryDay,7*memoryDay,21*memoryDay,45*memoryDay];
const quoteFormats:MemoryFormat[]=["meaning","cloze","author","completion","work","order"];
export const emptyMemoryState=():MemoryState=>({version:1,reviews:{},session:null});
export function normalizeMemoryAnswer(value:string) {
  return value.normalize("NFD").replace(/\p{M}/gu,"").toLocaleLowerCase("fr").replace(/œ/g,"oe").replace(/æ/g,"ae")
    .replace(/[’'`]/g,"").replace(/[^\p{L}\p{N}]+/gu," ").trim().replace(/\s+/g," ");
}
function hash(value:string) { let n=2166136261;for(const char of value)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0; }
export function memoryFingerprint(item:PhiloMemoryItem) {
  const fields=item.kind==="quote"?[item.text,item.author,item.work,item.location,item.edition,item.meaning]:[item.label,item.text];
  if(item.reviewSignature)fields.push(item.reviewSignature);
  return String(hash(fields.join("|")));
}
function formatsFor(item:PhiloMemoryItem):MemoryFormat[]{return item.formats??(item.kind==="quote"?quoteFormats:["definition","recognition"]);}
export function memoryBankSignature(questions:readonly MemoryQuestion[]) {return String(hash(JSON.stringify(questions)));}
export function memoryStorageKey(userId:string,levelId:string){return `excellence-philo-memory:v1:${encodeURIComponent(userId)}:${encodeURIComponent(levelId)}`;}
export function memoryShuffle<T>(values:readonly T[],seed:string):T[] {
  const result=[...values];let n=hash(seed)||1;
  for(let i=result.length-1;i>0;i--){n^=n<<13;n^=n>>>17;n^=n<<5;const j=(n>>>0)%(i+1);[result[i],result[j]]=[result[j],result[i]];}
  return result;
}
function alternatives(answer:string,values:string[]) {return [answer,...[...new Set(values)].filter(value=>value!==answer).slice(0,3)];}
export function createMemoryQuestions(items:readonly PhiloMemoryItem[]):MemoryQuestion[] {
  const authors=items.filter(item=>item.kind==="quote").map(item=>item.author),works=items.filter(item=>item.kind==="quote").map(item=>item.work);
  const labels=items.filter(item=>item.kind==="definition").map(item=>item.label);
  return items.flatMap<MemoryQuestion>(item=>{
    if(item.kind==="definition")return [
      {id:item.id+":definition",itemId:item.id,format:"definition",prompt:`Quelle proposition définit « ${item.label} » ?`,options:[item.text,...item.distractors],expected:[item.text]},
      {id:item.id+":recognition",itemId:item.id,format:"recognition",prompt:`Quelle notion correspond à cette définition ?\n${item.text}`,options:alternatives(item.label,labels),expected:[item.label]},
    ];
    let rest=item.text;const parts:string[]=[];
    for(const gap of item.gaps){
      const escaped=gap.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
      const match=new RegExp("(?<![\\p{L}\\p{N}])"+escaped+"(?![\\p{L}\\p{N}])","u").exec(rest);
      if(!match)throw new Error("Mot manquant absent ou partiel : "+item.id);
      parts.push(rest.slice(0,match.index));rest=rest.slice(match.index+gap.length);
    }parts.push(rest);
    const words=item.text.split(/\s+/),cut=Math.max(1,Math.floor(words.length*.55)),prefix=words.slice(0,cut).join(" "),ending=words.slice(cut).join(" ");
    const chunkSize=Math.max(2,Math.ceil(words.length/5)),chunks:string[]=[];
    for(let index=0;index<words.length;index+=chunkSize)chunks.push(words.slice(index,index+chunkSize).join(" "));
    if(new Set(chunks).size!==chunks.length)throw new Error("Fragments ambigus : "+item.id);
    return [
      {id:item.id+":meaning",itemId:item.id,format:"meaning",prompt:"Quelle idée cette citation exprime-t-elle dans son contexte ?",quotation:item.text,options:[item.meaning,...item.distractors],expected:[item.meaning]},
      {id:item.id+":cloze",itemId:item.id,format:"cloze",prompt:"Complète les mots manquants.",parts,expected:item.gaps},
      {id:item.id+":author",itemId:item.id,format:"author",prompt:"Qui a écrit cet extrait ?",quotation:item.text,options:alternatives(item.author,authors),expected:[item.author]},
      {id:item.id+":completion",itemId:item.id,format:"completion",prompt:"Retrouve la suite de cette citation.",prefix,expected:[ending]},
      {id:item.id+":work",itemId:item.id,format:"work",prompt:"De quel ouvrage cet extrait provient-il ?",quotation:item.text,options:alternatives(item.work,works),expected:[item.work]},
      {id:item.id+":order",itemId:item.id,format:"order",prompt:"Remets les fragments dans l’ordre de la citation.",chunks,expected:chunks},
    ];
  });
}
export function memoryAnswerCorrect(question:MemoryQuestion,answer:MemoryAnswer) {
  return [question.expected,...question.acceptedAnswers??[]].some(expected=>answer.length===expected.length&&answer.every((value,index)=>!!value.trim()&&normalizeMemoryAnswer(value)===normalizeMemoryAnswer(expected[index])));
}
export function memoryConsolidated(item:PhiloMemoryItem,review?:MemoryReview) {
  return Boolean(review&&review.fingerprint===memoryFingerprint(item)&&review.days.length>=3&&review.successes>=3&&review.box>=3
    &&(item.kind==="definition"&&!item.requireRecall||(review.recall&&review.understood)));
}
export function reviewMemoryItem(item:PhiloMemoryItem,previous:MemoryReview|undefined,format:MemoryFormat,correct:boolean,assisted:boolean,now:number):MemoryReview {
  const old=previous?.fingerprint===memoryFingerprint(item)?previous:undefined;
  const success=correct&&!assisted,day=Math.floor(now/memoryDay);
  const box=success?Math.min(5,(old?.box??0)+(old?.days.includes(day)?0:1)):0;
  const days=success?[...new Set([...(old?.days??[]),day])].slice(-3):[];
  return {fingerprint:memoryFingerprint(item),attempts:Math.min(100_000,(old?.attempts??0)+1),successes:Math.min(100_000,(old?.successes??0)+(success?1:0)),
    lapses:Math.min(100_000,(old?.lapses??0)+(!success?1:0)),box,dueAt:now+intervals[box],lastAt:now,days,
    recall:Boolean(success&&(old?.recall||["cloze","completion","order"].includes(format))),
    understood:Boolean(success&&(old?.understood||format==="meaning"))};
}
export function createMemorySession(items:readonly PhiloMemoryItem[],reviews:Record<string,MemoryReview>,questions:readonly MemoryQuestion[],notion:string,mode:MemorySession["mode"],count:number,seed:string,now:number,errorItemIds:string[]=[]):MemorySession|null {
  const candidates=items.filter(item=>(notion==="all"||item.notions.includes(notion))&&(mode!=="errors"||errorItemIds.includes(item.id)))
    .filter(item=>mode!=="daily"||!reviews[item.id]||reviews[item.id].dueAt<=now);
  if(!candidates.length)return null;
  const pool=memoryShuffle(candidates,seed).sort((a,b)=>{
    const rank=(item:PhiloMemoryItem)=>{const review=reviews[item.id];return review&&review.dueAt<=now?0:!review?1:2;};return rank(a)-rank(b);
  });
  const queue:string[]=[],seen:Record<string,number>={},last:string[]=[];
  const length=Number.isFinite(count)?Math.min(20,Math.max(5,Math.floor(count))):10;
  for(let index=0;index<length;index++){
    const eligible=pool.filter(item=>!last.slice(-Math.min(3,pool.length-1)).includes(item.id));
    const selected=[...eligible].sort((a,b)=>(seen[a.id]??0)-(seen[b.id]??0))[0]??pool[index%pool.length];
    const formats=formatsFor(selected);
    const format=formats[((reviews[selected.id]?.attempts??0)+(seen[selected.id]??0))%formats.length];
    const question=questions.find(q=>q.itemId===selected.id&&q.format===format)!;
    queue.push(question.id);seen[selected.id]=(seen[selected.id]??0)+1;last.push(selected.id);
  }
  return {seed,bankSignature:memoryBankSignature(questions),notion,mode,queue,index:0,responses:[],draft:[],assisted:false};
}
export function submitMemoryAnswer(state:MemoryState,items:readonly PhiloMemoryItem[],questions:readonly MemoryQuestion[],answer:MemoryAnswer,now:number):MemoryState {
  const session=state.session;if(!session||session.index>=session.queue.length||session.responses.length>session.index)return state;
  const question=questions.find(q=>q.id===session.queue[session.index]);if(!question)return state;
  const item=items.find(item=>item.id===question.itemId)!;
  const correct=memoryAnswerCorrect(question,answer),review=reviewMemoryItem(item,state.reviews[item.id],question.format,correct,session.assisted,now);
  const queue=[...session.queue];
  if((!correct||session.assisted)&&session.index+4<queue.length){
    const laterIndex=queue.findIndex((id,index)=>index>session.index&&questions.find(q=>q.id===id)?.itemId===item.id);
    if(laterIndex<0||laterIndex>session.index+4){
      const formats=formatsFor(item),format=formats[(formats.indexOf(question.format)+1)%formats.length];
      const repeat=questions.find(q=>q.itemId===item.id&&q.format===format);
      if(repeat)queue[session.index+4]=repeat.id;
    }
  }
  return {version:1,reviews:{...state.reviews,[item.id]:review},session:{...session,queue,
    responses:[...session.responses,{questionId:question.id,answer:answer.map(value=>value.slice(0,500)),assisted:session.assisted,at:now}]}};
}
const number=(value:unknown,max:number)=>typeof value==="number"&&Number.isFinite(value)&&value>=0&&value<=max;
/** Ignore stored grades; answers are always evaluated against the current bank. */
export function restoreMemoryState(raw:string|null,items:readonly PhiloMemoryItem[],questions:readonly MemoryQuestion[],now:number):MemoryState {
  const fallback=emptyMemoryState();if(!raw||raw.length>120_000)return fallback;
  try{
    const data=JSON.parse(raw);if(data?.version!==1||typeof data.reviews!=="object"||!data.reviews)return fallback;
    for(const item of items){const r=data.reviews[item.id];
      if(!r||r.fingerprint!==memoryFingerprint(item)||!["attempts","successes","lapses"].every(key=>number(r[key],100_000)&&Number.isInteger(r[key]))||r.successes+r.lapses!==r.attempts||!Number.isInteger(r.box)||r.box<0||r.box>5
        ||!number(r.dueAt,now+366*memoryDay)||!number(r.lastAt,now+memoryDay)||!Array.isArray(r.days)||r.days.length>3||!r.days.every((d:unknown)=>number(d,Math.floor(now/memoryDay))&&Number.isInteger(d)))continue;
      fallback.reviews[item.id]={fingerprint:r.fingerprint,attempts:r.attempts,successes:r.successes,lapses:r.lapses,box:r.box,dueAt:r.dueAt,lastAt:r.lastAt,days:[...new Set<number>(r.days)],recall:r.recall===true,understood:r.understood===true};
    }
    const s=data.session;if(!s||s.bankSignature!==memoryBankSignature(questions)||typeof s.seed!=="string"||s.seed.length>100||typeof s.notion!=="string"||s.notion.length>60||!["notion","daily","errors"].includes(s.mode)
      ||!Array.isArray(s.queue)||s.queue.length<5||s.queue.length>20||!s.queue.every((id:unknown)=>typeof id==="string"&&questions.some(q=>q.id===id))
      ||!Number.isInteger(s.index)||s.index<0||s.index>s.queue.length||!Array.isArray(s.responses)||s.responses.length>s.queue.length||s.responses.length<s.index||s.responses.length>s.index+1)return fallback;
    const validAnswer=(answer:unknown):answer is string[]=>Array.isArray(answer)&&answer.length<=8&&answer.every(value=>typeof value==="string"&&value.length<=500);
    const responses=s.responses.filter((r:{questionId:unknown;answer:unknown;at:unknown},index:number)=>r&&r.questionId===s.queue[index]&&validAnswer(r.answer)&&number(r.at,now+memoryDay));
    if(responses.length!==s.responses.length)return fallback;
    fallback.session={seed:s.seed,bankSignature:s.bankSignature,notion:s.notion,mode:s.mode,queue:s.queue,index:s.index,responses:responses.map((r:{questionId:string;answer:string[];assisted:unknown;at:number})=>({questionId:r.questionId,answer:r.answer,assisted:r.assisted===true,at:r.at})),draft:validAnswer(s.draft)?s.draft:[],assisted:s.assisted===true};
    return fallback;
  }catch{return fallback;}
}
