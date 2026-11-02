import type {CourseSummary,CourseDocumentTopic,CourseWorkedExample} from "../../domain/courseDocument";
import type {LearningLesson,LearningPath} from "../../domain/paths";
import {svtSummaryLayouts,svtSummaryTopicTitles} from "./svtSummaryLayouts";
import {svtReadingText as clean,svtReadingTitle} from "./svtSummaryEditorial";

export function svtSourcePages(value=""):number[] {
  const pages=new Set<number>();
  for(const match of value.matchAll(/(\d+)(?:\s*[-–à]\s*(\d+))?/g)){
    const first=Number(match[1]),last=Number(match[2]??first);
    if(first<1||last<first||last>300)continue;
    for(let page=first;page<=last;page++)pages.add(page);
  }
  return [...pages].sort((a,b)=>a-b);
}

/** Extract only explicitly authored examples; definitions and experiments stay in the course. */
export function svtWorkedBlocks(markdown:string,id:string) {
  const body:string[]=[],examples:CourseWorkedExample[]=[];
  for(const block of clean(markdown).split(/(?=^###\s+)/m)){
    const match=/^###\s+([^\n]+)\n([\s\S]*)$/.exec(block);
    const title=match?.[1].replace(/^\d+[.)]?\s*/,"");
    if(match&&/^(?:Exemple(?:s)?(?:\s|$)|Application (?:guidée|numérique)|Réponse (?:modèle|argumentée attendue)|Modèle de réponse rédigée)/iu.test(title!)){
      examples.push({id:id+"-worked-"+(examples.length+1),title:title!,prompt:"",solution:match[2].trim()});
    }else body.push(block);
  }
  return {body:body.join("\n").trim(),examples};
}

function topic(lesson:LearningLesson,optional:boolean):CourseDocumentTopic {
  const id="svt-summary-"+lesson.id;
  const parsed=svtWorkedBlocks(lesson.concept.bodyMarkdown??lesson.concept.explanation,id);
  const overview=lesson.id.endsWith("-overview");
  const example=clean(lesson.concept.example),model=lesson.method.example;
  const work=clean(model.work),result=clean(model.result);
  const included=(value:string)=>Boolean(value)&&[parsed.body,...parsed.examples.map(item=>item.solution??"")].some(text=>text.includes(value));
  if(!overview&&example&&!included(example))parsed.examples.push({id:id+"-example",title:"Exemple expliqué",prompt:"",solution:example});
  if(!overview&&work&&!included(work)&&work!==example){
    const prompt=/^Exemple guidé$/iu.test(model.prompt)?"":clean(model.prompt);
    parsed.examples.push({id:id+"-model",title:"Construire une réponse",prompt,
      solution:"**Raisonnement.** "+work+(result&&result!==work?"\n\n**Conclusion.** "+result:"")});
  }
  const notation=lesson.concept.notationTex?"$$"+clean(lesson.concept.notationTex)+"$$":clean(lesson.concept.notation);
  const detail=[clean(lesson.method.introduction),lesson.method.steps.map((step,index)=>(index+1)+". "+clean(step)).join("\n"),clean(lesson.method.tip??"")].filter(Boolean).join("\n\n");
  return {id,title:svtSummaryTopicTitles[lesson.id]??svtReadingTitle(lesson.title),pages:svtSourcePages(lesson.source?.pages),
    legacyLessonIds:[lesson.id],body:parsed.body+(notation?"\n\n> **À retenir.** "+notation:""),examples:parsed.examples,
    detail,interaction:{...lesson.interaction,title:svtReadingTitle(lesson.interaction.title),
      instruction:clean(lesson.interaction.instruction),observation:clean(lesson.interaction.observation)},optional};
}

const cache=new WeakMap<LearningPath,CourseSummary>();
const shared=new Map<string,{fingerprint:string;summary:CourseSummary}>();

/** Presentation only: no generated questions, source claims, reward or progression changes. */
export function createSvtCourseSummary(path:LearningPath):CourseSummary {
  const previous=cache.get(path);if(previous)return previous;
  const plan=svtSummaryLayouts[path.id];
  const lessons=path.modules.flatMap(module=>module.lessons);
  if(!plan||plan.reduce((sum,item)=>sum+item[1],0)!==lessons.length)throw new Error("Plan de résumé SVT à actualiser : "+path.id);
  const fingerprint=JSON.stringify([path.levelIds,plan,lessons.map(lesson=>[lesson.id,lesson.title,lesson.concept,lesson.method,lesson.interaction,lesson.source?.pages])]);
  const same=shared.get(path.id);
  if(same?.fingerprint===fingerprint){cache.set(path,same.summary);return same.summary;}
  let start=0;
  const sections=plan.map(([title,count,optional],index)=>{
    const selected=lessons.slice(start,start+count);start+=count;
    return {id:path.id+"-summary-section-"+(index+1),numeral:["I","II","III","IV","V"][index]??String(index+1),title,
      topics:selected.map(lesson=>topic(lesson,Boolean(optional)))};
  });
  const summary:CourseSummary={id:path.id+"-documentary-summary",version:1,levelIds:path.levelIds,sections,
    legacyAnchors:Object.fromEntries(sections.flatMap(section=>section.topics.flatMap(item=>(item.legacyLessonIds??[]).map(id=>[id,item.id]))))};
  cache.set(path,summary);shared.set(path.id,{fingerprint,summary});return summary;
}
