import type { CourseSummary, CourseDocumentTopic, CourseWorkedExample } from "../../domain/courseDocument";
import type { LearningLesson, LearningPath } from "../../domain/paths";
import { physicsSummaryLayouts, physicsSummaryTopicTitles } from "./physicsSummaryLayouts";
import { physicsReadingText, physicsSummaryBodyOverrides } from "./physicsSummaryEditorial";
import { physicsSummaryExamples } from "./physicsSummaryExamples";

export function physicsReadingTitle(value: string): string {
  return value.replace(/^Mission(?: finale| laboratoire)?\s*:\s*/i,"")
    .replace(/^Réussir la mission\s+/i,"")
    .replace(/^Atelier\s*:\s*/i,"")
    .replace(/^Consolidation\s*:\s*/i,"")
    .replace(/\bsans subir les incohérences\b/i,"")
    .replace(/^Auditer\s+/i,"Étudier ")
    .replace(/\bCorriger les exercices\b/i,"Applications")
    .replace(/\bRésoudre le quiz\b/i,"Applications")
    .replace(/\bRéussir la situation d’évaluation\b/i,"Application de synthèse")
    .trim().replace(/^./,letter=>letter.toLocaleUpperCase("fr"));
}

function lowerHeadings(value: string) {
  return value.replace(/^(#{1,6})\s+(.+)$/gm,(_,marks:string,title:string)=>"### "+physicsReadingTitle(title));
}
function legacyText(value: string) {
  return physicsReadingText(value).replace(/\\\\(?=(?:vec|overrightarrow|frac|dfrac|sqrt|mathrm|text|sum|Delta|alpha|theta|sin|cos|pi|omega|mu|lambda|varepsilon)\b)/g,"\\");
}
export function physicsSourcePages(value = "") {
  const pages=new Set<number>();
  for(const match of value.matchAll(/(\d+)(?:\s*[-–à]\s*(\d+))?/g)){
    const first=Number(match[1]),last=Number(match[2]??first);
    if(first<1||last<first||last>300)continue;
    for(let p=first;p<=last;p++)pages.add(p);
  }
  return [...pages].sort((a,b)=>a-b);
}

/** Move authored worked blocks into the same example renderer as mathematics. */
export function physicsWorkedBlocks(markdown: string, id: string) {
  const blocks=physicsReadingText(markdown).split(/(?=^##\s+)/m),body:string[]=[],examples:CourseWorkedExample[]=[];
  for(const block of blocks){
    const match=/^##\s+([^\n]+)\n([\s\S]*)$/.exec(block);
    if(match&&/^(?:exemples?(?:\s|$)|application(?:s)?\s+(?:numérique|guidée|du document|corrigée)|calcul guidé)/i.test(match[1].replace(/\*\*/g,""))){
      examples.push({id:id+"-example-"+(examples.length+1),title:physicsReadingTitle(match[1]),prompt:"",solution:lowerHeadings(match[2].trim())});
    }else body.push(lowerHeadings(block));
  }
  return {body:body.join("\n").trim(),examples};
}
function topic(lesson:LearningLesson,optional:boolean):CourseDocumentTopic {
  const id="physics-summary-"+lesson.id,parsed=physicsWorkedBlocks(physicsSummaryBodyOverrides[lesson.id]??lesson.concept.bodyMarkdown??lesson.concept.explanation,id);
  if(physicsSummaryExamples[lesson.id]) parsed.examples=lesson.id==="velocity-vector"
    ? [...parsed.examples,...physicsSummaryExamples[lesson.id]] : physicsSummaryExamples[lesson.id];
  if(!parsed.examples.length&&lesson.concept.example.trim()){
    parsed.examples.push({id:id+"-application",title:"Application",prompt:"",solution:legacyText(lesson.concept.example)});
  }
  const notation=lesson.id==="resonance-official-evaluation-audit" ? String.raw`$r=7{,}5\ \Omega$, $L\approx0{,}1896\ \mathrm H$, $Q\approx0{,}433$, $U_C\approx0{,}865\ \mathrm V$.`
    : lesson.concept.notationTex?"$$"+lesson.concept.notationTex+"$$":legacyText(lesson.concept.notation);
  const exampleText=legacyText(lesson.concept.example);
  const includesExample=JSON.stringify(parsed.examples).includes(JSON.stringify(exampleText).slice(1,-1))
    || ["velocity-vector","acceleration-vector","rectilinear-varied-motion","circular-uniform-motion","resonance-official-evaluation-audit"].includes(lesson.id);
  const detail=lesson.method.steps.map((step,index)=>(index+1)+". "+legacyText(step)).join("\n")
    +(lesson.method.tip?"\n\n"+legacyText(lesson.method.tip):"")
    +(!includesExample&&exampleText?"\n\n**Application complémentaire.** "+exampleText:"");
  return {
    id,title:physicsSummaryTopicTitles[lesson.id]??physicsReadingTitle(lesson.title),pages:physicsSourcePages(lesson.source?.pages),
    legacyLessonIds:[lesson.id],body:parsed.body+"\n\n> **À retenir.** "+notation,examples:parsed.examples,
    detail,
    interaction:lesson.interaction,optional:optional||lesson.kind==="challenge",
  };
}
const cache=new WeakMap<LearningPath,CourseSummary>();
const shared=new Map<string,{fingerprint:string;summary:CourseSummary}>();
export function createPhysicsCourseSummary(path:LearningPath):CourseSummary {
  const previous=cache.get(path);if(previous)return previous;
  const lessons=path.modules.flatMap(module=>module.lessons),plan=physicsSummaryLayouts[path.id]??[["Cours",lessons.length] as const];
  if(plan.reduce((sum,item)=>sum+item[1],0)!==lessons.length)throw new Error("Plan de résumé PC à actualiser : "+path.id);
  const fingerprint=JSON.stringify([path.levelIds,plan,lessons.map(lesson=>[lesson.id,lesson.title,lesson.kind,lesson.concept,lesson.method.steps,lesson.method.tip,lesson.interaction,lesson.source?.pages])]);
  const same=shared.get(path.id);
  if(same?.fingerprint===fingerprint){cache.set(path,same.summary);return same.summary;}
  let start=0;
  const numerals=["I","II","III","IV","V","VI"];
  const sections=plan.map(([title,count,optional],index)=>{
    const selected=lessons.slice(start,start+count);start+=count;
    return {id:path.id+"-summary-section-"+(index+1),numeral:numerals[index]??String(index+1),title,topics:selected.map(lesson=>topic(lesson,Boolean(optional)))};
  });
  const summary:CourseSummary={id:path.id+"-documentary-summary",version:1,levelIds:path.levelIds,sections,
    legacyAnchors:Object.fromEntries(sections.flatMap(section=>section.topics.flatMap(topic=>(topic.legacyLessonIds??[]).map(id=>[id,topic.id]))))};
  cache.set(path,summary);shared.set(path.id,{fingerprint,summary});return summary;
}
