import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import test from "node:test";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { terminalCLimitsExercises as collection } from "../apps/web/src/data/exerciseCollections/terminalCLimitsExercises";
import { terminalCLimitsContinuityDocument as course } from "../apps/web/src/data/courseDocuments/terminalCLimitsContinuityDocument";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import type { PublishedArenaExerciseLevel } from "../apps/web/src/domain/arenaExercises";
import { exerciseAnswerStatus, exerciseAssessment, exerciseDraftKey, numericExerciseAnswer, restoreExerciseDraft } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { exerciseLibrarySections } from "../apps/web/src/features/arena/exercises/exerciseLibraryModel";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";

const exercises = collection.sections.flatMap(section => section.exercises);
const require = createRequire(new URL("../apps/web/package.json", import.meta.url));
const katex = require("katex");
const source = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("le support est reconstruit en 62 exercices, 17 rubriques de fixation et trois catégories", () => {
  assert.deepEqual(exercises.map(exercise => exercise.sourceNumber), Array.from({length:62},(_,index)=>index+1));
  assert.deepEqual(["fixation","deepening","complex"].map(category=>collection.sections.filter(section=>section.category===category).flatMap(section=>section.exercises).length),[54,6,2]);
  assert.equal(collection.sections.filter(section=>section.category==="fixation").length,17);
  assert.equal(new Set(exercises.map(exercise=>exercise.id)).size,62);
  const questions=exercises.flatMap(exercise=>exercise.questions??[]);
  assert.equal(questions.length,143);
  assert.equal(questions.filter(question=>question.answer.kind!=="written").length,85);
  assert.equal(questions.filter(question=>question.answer.kind==="written").length,58);
  assert.deepEqual(collection.source.pages,[40,41,42,43,44,45,46]);
  assert.equal(collection.source.sha256,"C207C23E5C4F0F275C8FFEAA4677948728634DBE1E2E71B406219335963EC302");
  const topics=new Set(course.sections.flatMap(section=>section.topics).map(topic=>topic.id));
  for(const section of collection.sections) assert.ok(topics.has(section.courseTopicId),section.id);
  for(const exercise of exercises) {
    assert.ok(exercise.statementMarkdown.length>10);
    assert.ok(exercise.correctionMarkdown.length>80);
    assert.equal(new Set(exercise.questions?.map(question=>question.id)).size,exercise.questions?.length);
  }
});

test("chaque rubrique conserve un contrat éditorial Web/API valide",()=>{
  for(const [index,section] of collection.sections.entries()) {
    const payload=arenaPayloadSchema.parse({
      levelId:collection.levelId,subjectId:collection.subjectId,lessonKey:collection.lessonKey,lessonTitle:"Limites et continuité",
      difficulty:"easy",category:section.category,stageNumber:index+1,title:section.title,instructionsMarkdown:"",
      sourceSectionId:section.id,courseTopicId:section.courseTopicId,exercises:section.exercises,
    });
    assert.equal(payload.category,section.category);
    assert.equal(payload.exercises[0].sourceNumber,section.exercises[0].sourceNumber);
    assert.deepEqual(payload.exercises[0].questions,section.exercises[0].questions);
  }
});

test("les commandes LaTeX sont toutes valides et ne deviennent pas des lettres sans antislash",()=>{
  let count=0;
  const visit=(value:unknown)=>{
    if(typeof value==="string") for(const match of value.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g)) {
      const tex=match[1]??match[2];
      assert.doesNotMatch(tex,/(?<!\\)\binfty\b/);
      katex.renderToString(tex,{displayMode:match[1]!==undefined,throwOnError:true,strict:"error",trust:false});
      count++;
    }
    else if(Array.isArray(value)) value.forEach(visit);
    else if(value&&typeof value==="object") Object.values(value).forEach(visit);
  };
  visit(collection);
  assert.ok(count>500,`${count} formules`);
});

test("toutes les bonnes réponses objectives sont acceptées et les rédactions ne reçoivent aucune note",()=>{
  for(const exercise of exercises) {
    const answers:Record<string,string>={};
    for(const question of exercise.questions??[]) {
      if(question.answer.kind==="written") {
        assert.equal(exerciseAnswerStatus(question,"blabla"),"written");
        assert.equal(question.points,0);
      } else {
        const variants=question.answer.kind==="short"?question.answer.accepted:[String(question.answer.correctIndex)];
        for(const variant of variants) assert.equal(exerciseAnswerStatus(question,variant),"correct",`${exercise.id}: ${variant}`);
        assert.equal(exerciseAnswerStatus(question,""),"unanswered");
        assert.equal(exerciseAnswerStatus(question,"réponse manifestement fausse"),"incorrect");
        answers[question.id]=variants[0];
      }
    }
    const result=exerciseAssessment(exercise,answers);
    assert.equal(result.outOf20,result.total?20:null,exercise.id);
    assert.equal(result.percentage,result.total?100:null);
  }
});

test("le modèle de rédaction explique les substitutions, la référence et les conditions de calcul",()=>{
  const question=(number:number,index:number)=>exercises.find(exercise=>exercise.sourceNumber===number)!.questions![index];
  for(const [number,index,substitution] of [[1,1,"u=2x"],[12,0,"u=5x"],[12,1,String.raw`u=4\pi x`],[13,0,"u=8x"],[28,2,"u=2x"]] as const) {
    const explanation=question(number,index).explanation;
    assert.ok(explanation.includes("**Posons $" + substitution + "$.**"),`exercice ${number}`);
    assert.ok(explanation.includes("Lorsque"));
    assert.ok(explanation.includes(String.raw`\lim_{u\to0`));
    assert.ok(explanation.includes("\\boxed"));
    assert.ok(explanation.includes("\n\n$$"));
  }
  const reference=question(1,1).explanation;
  assert.ok(reference.includes(String.raw`\frac32\,\frac{\sin(2x)}{2x}`));
  assert.ok(reference.includes("radians"));
  assert.ok(question(28,2).explanation.includes(String.raw`x\to0^+`));
  assert.ok(question(28,2).explanation.includes("$[0;1[$"));
  const lateral=question(9,2).explanation;
  assert.doesNotMatch(lateral,/\\sim|dériv/);
  assert.ok(lateral.includes(String.raw`x\to0^+`));
  assert.ok(lateral.includes(String.raw`x\to0^-`));
  for(const number of [3,4,9]) assert.ok(exercises.find(exercise=>exercise.sourceNumber===number)!.correctionMarkdown.includes("\\ne"));
  for(const exercise of exercises) for(const item of exercise.questions??[]) assert.ok(exercise.correctionMarkdown.includes(item.explanation),exercise.id);
});

test("les explications et les énoncés héritent de la même taille lisible, sans règle éditoriale réduite",()=>{
  const css=source("apps/web/src/styles/exercise-bank.css");
  assert.match(css,/\.practice-player \{[^}]*font-size: 1rem/);
  assert.match(css,/\.practice-player \.lesson-rich-content \{[^}]*font-size: inherit/);
  assert.match(css,/\.practice-player \.lesson-rich-content table \{ font-size: inherit/);
  assert.doesNotMatch(css,/\.practice-player \{[^}]*font-size: \.(?:8[0-9]|9[0-9])rem/);
});

test("le calcul numérique est borné et accepte fractions, pi et racines sans exécution de code",()=>{
  for(const [text,value] of [["1/4",.25],["−2/√3",-2/Math.sqrt(3)],["8π²",8*Math.PI**2],["16√10/5",16*Math.sqrt(10)/5],["0,125",.125],["2^(-3)",.125]] as const) {
    assert.ok(Math.abs(numericExerciseAnswer(text)!-value)<1e-9,text);
  }
  for(const text of ["1/0","0/0","Infinity","NaN","sqrt(-1)","process.exit()","globalThis.alert(1)","constructor(1)","1;2","1abc","9^999999","(".repeat(100)+"1"+")".repeat(100)]) assert.equal(numericExerciseAnswer(text),null,text);
  const question=exercises[1].questions![1];
  assert.equal(exerciseAnswerStatus(question,"0,25"),"correct");
  assert.equal(exerciseAnswerStatus(question,"0,26"),"incorrect");
});

test("les résultats délicats et les hypothèses de la source sont protégés",()=>{
  const find=(number:number)=>exercises.find(exercise=>exercise.sourceNumber===number)!;
  assert.equal(exerciseAnswerStatus(find(2).questions![0],"-∞"),"correct");
  assert.equal(exerciseAnswerStatus(find(5).questions![0],"2"),"correct");
  assert.equal(exerciseAnswerStatus(find(9).questions![2],"pas de limite"),"correct");
  assert.equal(exerciseAnswerStatus(find(43).questions![0],"x=1"),"correct");
  assert.equal(exerciseAnswerStatus(find(43).questions![0],"y=1"),"incorrect");
  assert.equal(exerciseAnswerStatus(find(43).questions![1],"x=3"),"incorrect");
  assert.ok(find(27).statementMarkdown.includes("\\left|\\frac"));
  assert.ok(find(42).statementMarkdown.includes("sur $\\mathbb R$"));
  assert.ok(find(47).questions!.every(question=>question.answer.kind==="written"));
  assert.ok(find(57).correctionMarkdown.includes("0{,}000211"));
  assert.ok(find(60).correctionMarkdown.includes("\\frac{5y+3}{2-y}"));
  assert.ok(find(61).correctionMarkdown.includes("11 h 30"));
  assert.ok(find(61).correctionMarkdown.includes("211-1=210"));
  assert.ok(find(62).correctionMarkdown.includes("108{,}60"));
  assert.ok(find(62).correctionMarkdown.includes("elle est exclue"));
  assert.deepEqual(exercises.filter(exercise=>exercise.figureKey).map(exercise=>exercise.sourceNumber),[32,59,62]);
});

test("les brouillons sont bornés et cloisonnés, les scores enregistrés par le navigateur sont ignorés",()=>{
  const exercise=exercises[0];
  const key=exerciseDraftKey("user:a","tc-l1-v1",exercise.id);
  assert.notEqual(key,exerciseDraftKey("user:b","tc-l1-v1",exercise.id));
  assert.notEqual(key,exerciseDraftKey("user:a","tc-l1-v2",exercise.id));
  const restored=restoreExerciseDraft(JSON.stringify({answers:{[exercise.questions![0].id]:"1",unknown:"x"},reasoning:"r".repeat(15000),submitted:true,score:20}),exercise);
  assert.deepEqual(Object.keys(restored.answers),[exercise.questions![0].id]);
  assert.equal(restored.reasoning.length,10000);
  assert.equal(restored.submitted,true);
  assert.equal("score" in restored,false);
  assert.deepEqual(restoreExerciseDraft("{invalid",exercise),{answers:{},reasoning:"",submitted:false});
});

test("la nouvelle banque ignore les anciennes publications et remplace seulement la rubrique liée",()=>{
  const section=collection.sections[0];
  const published:PublishedArenaExerciseLevel={id:"test-published",levelId:collection.levelId,subjectId:collection.subjectId,lessonKey:collection.lessonKey,lessonTitle:"Limites",difficulty:"hard",stageNumber:1,title:"Référence révisée",instructionsMarkdown:"",exercises:section.exercises,version:2,publishedAt:"2026-10-18T12:00:00Z"};
  assert.equal(exerciseLibrarySections(null,[published]).length,0);
  assert.equal(exerciseLibrarySections(collection,[published]).length,19);
  const revised={...published,category:"fixation" as const,sourceSectionId:section.id};
  const result=exerciseLibrarySections(collection,[revised]);
  assert.equal(result.length,19);
  assert.equal(result[0].title,"Référence révisée");
  assert.equal(result[0].revision,"published-test-published-v2");
  assert.equal(result[1].title,collection.sections[1].title);
});

test("la collection reste propre à la Terminale C et à sa leçon",async()=>{
  assert.equal((await loadExerciseCollection("terminale-c","mathematics",collection.lessonKey))?.id,collection.id);
  assert.equal(await loadExerciseCollection("terminale-d","mathematics",collection.lessonKey),null);
  assert.equal(await loadExerciseCollection("seconde-c","mathematics",collection.lessonKey),null);
  assert.equal(await loadExerciseCollection("terminale-c","svt",collection.lessonKey),null);
});

test("les liens conservent leçon, catégorie, rubrique et exercice après F5 et historique",()=>{
  const search=`?matiere=mathematics&lecon=${collection.lessonKey}&categorie=deepening&rubrique=tc-l1-deepening&exercice=tc-l1-ex-59`;
  const route=readAppRoute({pathname:"/arene/exercices",search},{navigation:"home"});
  assert.deepEqual(route.exerciseSelection,{lessonKey:collection.lessonKey,category:"deepening",sectionId:"tc-l1-deepening",exerciseId:"tc-l1-ex-59"});
  assert.equal(appRouteUrl(route,""),`/arene/exercices${search}`);
  assert.equal(readAppRoute({pathname:"/arene/exercices",search:"?lecon=../../oops&categorie=easy"},{navigation:"home"}).exerciseSelection,undefined);
  assert.equal(readAppRoute({pathname:"/messages",search},{navigation:"home"}).exerciseSelection,undefined);
});

test("chaque rubrique de fixation possède une page dédiée et conserve les liens précédents",()=>{
  const selection={lessonKey:collection.lessonKey,category:"fixation" as const,sectionId:"tc-l1-reference"};
  const url=appRouteUrl({navigation:"arena",subjectId:"mathematics",arenaMode:"exercises",exerciseSelection:selection},"");
  assert.equal(url,`/arene/exercices/rubriques/tc-l1-reference?matiere=mathematics&lecon=${collection.lessonKey}&categorie=fixation`);
  const parsed=new URL(url,"http://localhost");
  assert.deepEqual(readAppRoute(parsed,{navigation:"home"}).exerciseSelection,selection);
  const legacy=readAppRoute({pathname:"/arene/exercices",search:`?lecon=${collection.lessonKey}&categorie=fixation&rubrique=tc-l1-reference&exercice=tc-l1-ex-1`},{navigation:"home"});
  assert.equal(legacy.exerciseSelection?.sectionId,selection.sectionId);
  assert.ok(appRouteUrl(legacy,"").startsWith("/arene/exercices/rubriques/tc-l1-reference?"));
  assert.equal(readAppRoute({pathname:"/arene/exercices/rubriques/bad%2Fid",search:`?lecon=${collection.lessonKey}`},{navigation:"home"}).exerciseSelection?.sectionId,undefined);
  assert.equal(readAppRoute({pathname:"/arene/exercices/editeur",search:`?lecon=${collection.lessonKey}&rubrique=tc-l1-reference`},{navigation:"home"}).arenaEditor,true);
});

test("valider et voir une correction sont deux actions indépendantes propres à chaque exercice",()=>{
  const player=source("apps/web/src/features/arena/exercises/ExercisePlayer.tsx");
  assert.ok(player.includes("const [correctionVisible, setCorrectionVisible] = useState(false)"));
  assert.match(player,/hidden=\{!correctionVisible\}/);
  assert.match(player,/onClick=\{\(\) => setCorrectionVisible\(visible => !visible\)\}/);
  const submit=player.slice(player.indexOf("<form onSubmit"),player.indexOf("<div className=\"practice-question-list\""));
  assert.doesNotMatch(submit,/setCorrectionVisible|correctionMarkdown|onSelection|navigate/);
  assert.doesNotMatch(player,/<details className="practice-full-correction"|markdown=\{question.explanation\}/);
  assert.doesNotMatch(source("apps/web/src/features/arena/exercises/ExerciseLibrary.tsx"),/hidden=\{!open\}|practice-exercise-toggle/);
});

test("le serveur refuse les catégories invalides et les rédactions prétendument notées",()=>{
  const section=collection.sections[0];
  const payload={levelId:collection.levelId,subjectId:collection.subjectId,lessonKey:collection.lessonKey,lessonTitle:"Limites",difficulty:"easy",category:"not-a-category",stageNumber:1,title:"Exercices",instructionsMarkdown:"",exercises:section.exercises};
  assert.equal(arenaPayloadSchema.safeParse(payload).success,false);
  const written=structuredClone(exercises[5]); written.questions![0].points=1;
  assert.equal(arenaPayloadSchema.safeParse({...payload,category:"fixation",exercises:[written]}).success,false);
  const choice=structuredClone(exercises[0]); if(choice.questions![0].answer.kind==="choice")choice.questions![0].answer.correctIndex=42;
  assert.equal(arenaPayloadSchema.safeParse({...payload,category:"fixation",exercises:[choice]}).success,false);
});

test("le lecteur ne soumet aucun XP et affiche les quatre états de correction",()=>{
  const player=source("apps/web/src/features/arena/exercises/ExercisePlayer.tsx");
  assert.match(player,/<del><MathText>/);
  for(const text of ["Bonne réponse","Réponse incorrecte","Pas de réponse","Refaire mes erreurs","/20"])assert.ok(player.includes(text),text);
  assert.doesNotMatch(player,/progress\/attempt|xpAwarded|submitAttempt/);
  assert.ok(source("apps/web/src/features/arena/exercises/ExerciseFigures.tsx").includes('type="range"'));
});
