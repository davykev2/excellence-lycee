import type {CourseSummary,CourseDocumentTopic,CourseWorkedExample,CourseWrittenTask} from "../../domain/courseDocument";
import type {LearningLesson,LearningPath} from "../../domain/paths";
import {humanitiesReadingText as clean,humanitiesReadingTitle as title} from "./humanitiesSummaryEditorial";

export interface HumanitiesReader {
  summary:CourseSummary;
  writing:{title:string;context:string;tasks:CourseWrittenTask[]};
}
const cache=new WeakMap<LearningPath,HumanitiesReader>();
const shared=new Map<string,{fingerprint:string;reader:HumanitiesReader}>();
const topicId=(id:string)=>"humanities-summary-"+id;
const lowerHeadings=(text:string)=>text.replace(/^#{1,6}\s+(.+)$/gm,(_,value:string)=>"### "+title(value));
const expected=(lesson:LearningLesson,index=0)=>{
  const question=(lesson.questions??[lesson.question])[index];
  if(!question)return {answer:"",explanation:"",prompt:""};
  return {answer:clean(question.type==="short-answer"?(question.acceptedAnswers?.[0]??""):question.options[question.correctIndex]),explanation:clean(question.explanation),prompt:clean(question.prompt)};
};

function application(lesson:LearningLesson):CourseWorkedExample {
  const answer=expected(lesson);
  return {
    id:topicId(lesson.id)+"-worked",title:"Expliquer avec un exemple précis",prompt:answer.prompt,
    parts:[
      {id:"answer",label:"1",prompt:"Répondre à la question.",solution:"**Réponse.** "+answer.answer},
      {id:"explanation",label:"2",prompt:"Justifier avec les connaissances du cours.",solution:answer.explanation+"\n\n**Exemple.** "+clean(lesson.concept.example)},
    ],
  };
}
function topic(lesson:LearningLesson,overview=false,mission=false):CourseDocumentTopic {
  const body=clean(lesson.concept.bodyMarkdown??lesson.concept.explanation);
  const method=lesson.method.steps.map((step,index)=>(index+1)+". "+clean(step)).join("\n");
  const model=clean(lesson.method.example.result);
  return {
    id:topicId(lesson.id),title:overview?"Repères et fil conducteur":mission?"Application de synthèse":title(lesson.title),
    pages:[],legacyLessonIds:[lesson.id],
    body:lowerHeadings(body)+"\n\n> **À retenir.** "+clean(lesson.concept.notation),
    examples:overview?undefined:mission?[{
      id:topicId(lesson.id)+"-worked",title:"Construire une réponse argumentée",prompt:clean(lesson.summary),
      parts:[0,1,2].map((index)=>{
        const question=expected(lesson,index);
        return {id:"part-"+(index+1),label:String(index+1),prompt:question.prompt,
          solution:"**Réponse possible.** "+question.answer+"\n\n"+question.explanation+(index===2?"\n\n**Bilan.** "+model:"")};
      }),
    }]:[application(lesson)],
    detail:method+(lesson.method.tip?"\n\n"+clean(lesson.method.tip):""),interaction:lesson.interaction,
    optional:mission,
  };
}

/** Group by the three authored thematic axes, never by mastery level or XP. */
export function createHumanitiesCourseSummary(path:LearningPath):HumanitiesReader {
  const previous=cache.get(path);if(previous)return previous;
  const lessons=path.modules.flatMap(module=>module.lessons);
  const overview=lessons.find(lesson=>lesson.id.endsWith("-overview"))!;
  const mission=lessons.find(lesson=>lesson.id.endsWith("-mission-finale"))!;
  const content=lessons.filter(lesson=>lesson!==overview&&lesson!==mission);
  const groups:LearningLesson[][]=[];
  let last="";
  for(const lesson of content){
    const base=lesson.id.replace(/-part-[12]$/,"");
    if(base!==last){groups.push([]);last=base;}
    groups[groups.length-1].push(lesson);
  }
  const axes=overview?.interaction.kind==="timeline"?overview.interaction.items:[];
  if(!overview||!mission||groups.length!==3||axes.length!==3)throw new Error("Structure des trois axes HG à vérifier : "+path.id);
  const fingerprint=JSON.stringify([path.levelIds,path.description,lessons]);
  const same=shared.get(path.id);
  if(same?.fingerprint===fingerprint){cache.set(path,same.reader);return same.reader;}
  const introduction=topic(overview,true);
  introduction.body=clean(path.description)+"\n\n> **À retenir.** "+clean(overview.concept.notation);
  const sections=groups.map((group,index)=>({
    id:path.id+"-summary-section-"+(index+1),numeral:["I","II","III"][index],title:title(axes[index].label),
    topics:[...(index===0?[introduction]:[]),...group.map(lesson=>topic(lesson)),...(index===2?[topic(mission,false,true)]:[])],
  }));
  const summary:CourseSummary={
    id:path.id+"-documentary-summary",version:1,levelIds:path.levelIds,sections,
    legacyAnchors:Object.fromEntries(lessons.map(lesson=>[lesson.id,topicId(lesson.id)])),
    essentials:[
      {id:path.id+"-essential-overview",title:"Le fil conducteur",body:clean(overview.concept.notation),topicId:topicId(overview.id)},
      ...groups.map((group,index)=>({id:path.id+"-essential-axis-"+(index+1),title:title(axes[index].label),
        body:[...new Set(group.map(lesson=>clean(lesson.concept.notation)))].join("\n\n"),topicId:topicId(group[0].id)})),
    ],
  };
  const tasks:CourseWrittenTask[]=[0,1,2].map(index=>{
    const question=expected(mission,index);
    return {id:path.id+"-written-"+(index+1),prompt:question.prompt,topicId:topicId(mission.id),
      model:"**Réponse possible.** "+question.answer+"\n\n**Explication.** "+question.explanation+(index===2?"\n\n**Exemple de bilan.** "+clean(mission.method.example.result):""),
      criteria:index===0?["Le thème ou le problème est nommé précisément.","La réponse se rapporte au document étudié."]
        :index===1?["L’idée est reformulée, pas seulement recopiée.","Une connaissance ou un exemple précis explique la réponse."]
        :["La position répond directement à la consigne.","Les arguments s’appuient sur le cours.","Une nuance ou une limite est prise en compte."],
    };
  });
  const reader={summary,writing:{title:clean(mission.summary),context:lowerHeadings(clean(mission.concept.bodyMarkdown??mission.concept.explanation)),tasks}};
  cache.set(path,reader);shared.set(path.id,{fingerprint,reader});return reader;
}
