import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { terminalCLimitsExercises as collection } from "../apps/web/src/data/exerciseCollections/terminalCLimitsExercises";
import { terminalCSpaceExercises } from "../apps/web/src/data/exerciseCollections/terminalCSpaceExercises";
import { terminalCDerivativesExercises } from "../apps/web/src/data/exerciseCollections/terminalCDerivativesExercises";
import { terminalCPrimitivesExercises } from "../apps/web/src/data/exerciseCollections/terminalCPrimitivesExercises";
import { terminalCLogarithmsExercises } from "../apps/web/src/data/exerciseCollections/terminalCLogarithmsExercises";
import { terminalCExponentialPowerExercises } from "../apps/web/src/data/exerciseCollections/terminalCExponentialPowerExercises";
import { terminalCSequencesExercises } from "../apps/web/src/data/exerciseCollections/terminalCSequencesExercises";
import { terminalCIntegralExercises } from "../apps/web/src/data/exerciseCollections/terminalCIntegralExercises";
import { terminalCDifferentialExercises } from "../apps/web/src/data/exerciseCollections/terminalCDifferentialExercises";
import { terminalCProbabilityExercises } from "../apps/web/src/data/exerciseCollections/terminalCProbabilityExercises";
import { terminalCStatisticsExercises } from "../apps/web/src/data/exerciseCollections/terminalCStatisticsExercises";
import { terminalCBarycenterExercises } from "../apps/web/src/data/exerciseCollections/terminalCBarycenterExercises";
import { terminalCDivisibilityExercises } from "../apps/web/src/data/exerciseCollections/terminalCDivisibilityExercises";
import { terminalCConicsExercises } from "../apps/web/src/data/exerciseCollections/terminalCConicsExercises";
import { terminalCComplexExercises } from "../apps/web/src/data/exerciseCollections/terminalCComplexExercises";
import { terminalCGcdExercises } from "../apps/web/src/data/exerciseCollections/terminalCGcdExercises";

const prefix = resolve(tmpdir(), "excellence-exercise-bank-test-");
const directory = mkdtempSync(join(tmpdir(), "excellence-exercise-bank-test-"));
process.env.NODE_ENV = "test";
process.env.SUPABASE_URL = "";
process.env.SUPABASE_PUBLISHABLE_KEY = "";
process.env.SUPABASE_ANON_KEY = "";
process.env.DATABASE_PATH = join(directory, "exercises.sqlite");
process.env.JWT_SECRET = "test-only-exercise-bank-jwt-secret-with-sufficient-length";
process.env.RESEND_API_KEY = "";
process.env.EMAIL_FROM = "";

let app: Awaited<ReturnType<(typeof import("../apps/api/src/app"))["buildApp"]>>;
let database: (typeof import("../apps/api/src/database"))["database"];
const users = [
  {id:"00000000-0000-4000-8000-000000000071",role:"student"},
  {id:"00000000-0000-4000-8000-000000000072",role:"content_editor"},
  {id:"00000000-0000-4000-8000-000000000073",role:"content_editor"},
  {id:"00000000-0000-4000-8000-000000000074",role:"admin"},
] as const;
function headers(index:number) { return {authorization:`Bearer ${app.jwt.sign({sub:users[index].id,email:`test${index}@example.test`,role:users[index].role})}`}; }
const section=collection.sections[0];
const payload={
  levelId:collection.levelId,subjectId:collection.subjectId,lessonKey:collection.lessonKey,lessonTitle:"Limites et continuité",
  difficulty:"easy",category:section.category,stageNumber:1,title:section.title,instructionsMarkdown:"",
  sourceSectionId:section.id,courseTopicId:section.courseTopicId,exercises:section.exercises,
};
const listUrl=`/arena-exercises?levelId=${collection.levelId}&subjectId=${collection.subjectId}&lessonKey=${collection.lessonKey}`;
test.before(async()=>{
  app=await (await import("../apps/api/src/app")).buildApp();
  database=(await import("../apps/api/src/database")).database;
  const insert=database.prepare("INSERT INTO users (id,email,password_hash,name,role,audience,level_id,email_verified_at,created_at,updated_at) VALUES (?,?,?,?,?,'student','terminale-c',?,?,?)");
  const now=new Date().toISOString();
  users.forEach((user,index)=>insert.run(user.id,`test${index}@example.test`,"unused",`Test ${index}`,user.role,now,now,now));
});
test.after(async()=>{
  await app?.close();database?.close();
  const target=resolve(directory);
  assert.ok(target.startsWith(prefix)&&target!==resolve(tmpdir()));
  rmSync(target,{recursive:true,force:true});
});

test("coniques : figures et corrigés séparés survivent à sauvegarde, publication et GET",async()=>{
  const section=terminalCConicsExercises.sections.find(s=>s.category==="deepening")!,selected=section.exercises.filter(e=>[35,37,39,40].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCConicsExercises.lessonKey,lessonTitle:"Coniques",category:"deepening",stageNumber:45,title:section.title,sourceSectionId:section.id,courseTopicId:section.courseTopicId,exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});assert.equal(save.statusCode,200,save.body);
  const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:`/arena-exercises/editor/${id}/status`,headers:headers(3),payload:{status:"published"}});assert.equal(publish.statusCode,200,publish.body);
  const get=await app.inject({method:"GET",url:`/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=${source.lessonKey}`,headers:headers(0)});assert.equal(get.statusCode,200);
  const actual=get.json().levels[0].exercises;assert.deepEqual(actual,JSON.parse(JSON.stringify(selected)));
  assert.ok(actual.every((e:{figureKey?:string;correctionFigureKey?:string})=>!e.figureKey&&e.correctionFigureKey==="tc-t2-l4-conic"));
});

test("divisibilité : outils de correction et comparaison littérale persistent après publication",async()=>{
  const section=terminalCDivisibilityExercises.sections[0],source={...payload,lessonKey:terminalCDivisibilityExercises.lessonKey,lessonTitle:"Divisibilité dans ℤ",stageNumber:43,title:section.title,sourceSectionId:section.id,courseTopicId:section.courseTopicId,exercises:section.exercises.filter(e=>[1,10,11].includes(e.sourceNumber!))};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});assert.equal(save.statusCode,200,save.body);
  const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:`/arena-exercises/editor/${id}/status`,headers:headers(3),payload:{status:"published"}});assert.equal(publish.statusCode,200,publish.body);
  const get=await app.inject({method:"GET",url:`/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=${source.lessonKey}`,headers:headers(0)});assert.equal(get.statusCode,200);
  const actual=get.json().levels[0].exercises;assert.deepEqual(actual,JSON.parse(JSON.stringify(source.exercises)));
  assert.equal(actual[1].correctionFigureKey,"tc-t2-l2-arithmetic");assert.equal(actual[1].questions[0].answer.comparison,"literal");assert.equal(actual[0].figureKey,undefined);
});

test("les figures de dérivabilité et les tracés réservés aux corrections sont conservés à la publication", async () => {
  const section = terminalCDerivativesExercises.sections.find(item => item.category === "deepening")!;
  const source = { ...payload, lessonKey: terminalCDerivativesExercises.lessonKey, lessonTitle: "Dérivabilité et étude de fonctions", category: "deepening", stageNumber: 24, title: section.title, sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises.filter(exercise => [29, 40].includes(exercise.sourceNumber!)) };
  const save = await app.inject({ method: "PUT", url: "/arena-exercises/editor", headers: headers(3), payload: { payload: source } });
  assert.equal(save.statusCode, 200, save.body);
  const id = save.json().level.id;
  const publish = await app.inject({ method: "POST", url: `/arena-exercises/editor/${id}/status`, headers: headers(3), payload: { status: "published" } });
  assert.equal(publish.statusCode, 200, publish.body);
  const response = await app.inject({ method: "GET", url: `/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=${source.lessonKey}`, headers: headers(0) });
  assert.equal(response.statusCode, 200);
  const published = response.json().levels[0].exercises;
  assert.equal(published[0].figureKey, undefined);
  assert.equal(published[0].correctionFigureKey, "tc-l2-functions");
  assert.equal(published[1].figureKey, "tc-l2-triangle");
  assert.equal(published[1].correctionFigureKey, undefined);
  assert.deepEqual(published, source.exercises);
});

test("la population de Primitives reste dans la correction après sauvegarde et publication", async () => {
  const section = terminalCPrimitivesExercises.sections.find(item => item.category === "complex")!;
  const source = { ...payload, lessonKey: terminalCPrimitivesExercises.lessonKey, lessonTitle: "Primitives", category: "complex", stageNumber: 25, title: section.title, sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises };
  const save = await app.inject({ method: "PUT", url: "/arena-exercises/editor", headers: headers(3), payload: { payload: source } });
  assert.equal(save.statusCode, 200, save.body);
  const id = save.json().level.id;
  const publish = await app.inject({ method: "POST", url: `/arena-exercises/editor/${id}/status`, headers: headers(3), payload: { status: "published" } });
  assert.equal(publish.statusCode, 200, publish.body);
  const response = await app.inject({ method: "GET", url: `/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=${source.lessonKey}`, headers: headers(0) });
  assert.equal(response.statusCode, 200);
  const published = response.json().levels[0].exercises;
  assert.deepEqual(published, source.exercises);
  assert.equal(published[0].figureKey, undefined);
  assert.equal(published[0].correctionFigureKey, "tc-l3-population");
});

test("les courbes logarithmiques sont conservées dans la correction après publication", async () => {
  const section = terminalCLogarithmsExercises.sections.find(item => item.category === "deepening")!;
  const source = { ...payload, lessonKey: terminalCLogarithmsExercises.lessonKey, lessonTitle: "Fonctions logarithmes", category: "deepening", stageNumber: 26, title: section.title, sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises.filter(item => [31, 38, 39].includes(item.sourceNumber!)) };
  const save = await app.inject({ method: "PUT", url: "/arena-exercises/editor", headers: headers(3), payload: { payload: source } });
  assert.equal(save.statusCode, 200, save.body);
  const id = save.json().level.id;
  const publish = await app.inject({ method: "POST", url: `/arena-exercises/editor/${id}/status`, headers: headers(3), payload: { status: "published" } });
  assert.equal(publish.statusCode, 200, publish.body);
  const response = await app.inject({ method: "GET", url: `/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=${source.lessonKey}`, headers: headers(0) });
  assert.equal(response.statusCode, 200); assert.deepEqual(response.json().levels[0].exercises, source.exercises);
  assert.ok(response.json().levels[0].exercises.every((item: { figureKey?: string; correctionFigureKey?: string }) => !item.figureKey && item.correctionFigureKey === "tc-l4-functions"));
});

test("les figures exponentielles sont conservées après sauvegarde, publication et relecture", async () => {
  const section = terminalCExponentialPowerExercises.sections.find(item => item.category === "deepening")!;
  const source = { ...payload, lessonKey: terminalCExponentialPowerExercises.lessonKey, lessonTitle: "Exponentielles et puissances", category: "deepening", stageNumber: 27, title: section.title, sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises.filter(item => [25, 27, 39].includes(item.sourceNumber!)) };
  const save = await app.inject({ method: "PUT", url: "/arena-exercises/editor", headers: headers(3), payload: { payload: source } });
  assert.equal(save.statusCode, 200, save.body);
  const id = save.json().level.id;
  const publish = await app.inject({ method: "POST", url: `/arena-exercises/editor/${id}/status`, headers: headers(3), payload: { status: "published" } });
  assert.equal(publish.statusCode, 200, publish.body);
  const response = await app.inject({ method: "GET", url: `/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=${source.lessonKey}`, headers: headers(0) });
  assert.equal(response.statusCode, 200); assert.deepEqual(response.json().levels[0].exercises, source.exercises);
  assert.ok(response.json().levels[0].exercises.every((item: { figureKey?: string; correctionFigureKey?: string }) => !item.figureKey && item.correctionFigureKey === "tc-l5-functions"));
});

test("les constructions de suites restent seulement dans les corrections après publication", async () => {
  const section = terminalCSequencesExercises.sections.find(item => item.category === "deepening")!;
  const source = { ...payload, lessonKey: terminalCSequencesExercises.lessonKey, lessonTitle: "Suites numériques", category: "deepening", stageNumber: 28, title: section.title, sourceSectionId: section.id, courseTopicId: section.courseTopicId, exercises: section.exercises.filter(item => [31, 48, 49, 52].includes(item.sourceNumber!)) };
  const save = await app.inject({ method: "PUT", url: "/arena-exercises/editor", headers: headers(3), payload: { payload: source } });
  assert.equal(save.statusCode, 200, save.body);
  const id = save.json().level.id;
  const publish = await app.inject({ method: "POST", url: "/arena-exercises/editor/" + id + "/status", headers: headers(3), payload: { status: "published" } });
  assert.equal(publish.statusCode, 200, publish.body);
  const response = await app.inject({ method: "GET", url: "/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey=" + source.lessonKey, headers: headers(0) });
  assert.equal(response.statusCode, 200); assert.deepEqual(response.json().levels[0].exercises, source.exercises);
  assert.ok(response.json().levels[0].exercises.every((item: { figureKey?: string; correctionFigureKey?: string }) => !item.figureKey && item.correctionFigureKey === "tc-l6-sequences"));
});

test("les figures intégrales et la banque de67 exercices survivent à la publication", async () => {
  const sections = terminalCIntegralExercises.sections;
  const selected = sections.flatMap(section => section.exercises).filter(item => [31,36,52,65,67].includes(item.sourceNumber!));
  const source = { ...payload, lessonKey: terminalCIntegralExercises.lessonKey, lessonTitle: "Calcul intégral", category: "deepening", stageNumber: 29, title: "Intégrales", sourceSectionId: "tc-l7-deepening", courseTopicId: "int-parts", exercises: selected };
  const save = await app.inject({ method: "PUT", url: "/arena-exercises/editor", headers: headers(3), payload: { payload: source } });
  assert.equal(save.statusCode, 200, save.body);
  const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);assert.deepEqual(response.json().levels[0].exercises,selected);
  assert.equal(response.json().levels[0].exercises[0].figureKey,"tc-l7-integrals");
  assert.equal(response.json().levels[0].exercises[1].figureKey,undefined);
  assert.equal(response.json().levels[0].exercises[1].correctionFigureKey,"tc-l7-integrals");
});

test("les corrections et figures différentielles survivent au cycle complet de publication",async()=>{
  const section=terminalCDifferentialExercises.sections.find(s=>s.category==="deepening")!;
  const selected=section.exercises.filter(e=>[34,36,37,38].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCDifferentialExercises.lessonKey,lessonTitle:"Équations différentielles",category:"deepening",stageNumber:30,title:section.title,sourceSectionId:section.id,courseTopicId:section.courseTopicId,exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);const actual=response.json().levels[0].exercises;
  assert.deepEqual(actual,selected);assert.equal(actual[0].figureKey,undefined);assert.equal(actual[0].correctionFigureKey,"tc-l8-differential");
  assert.equal(actual[1].correctionFigureKey,undefined);assert.equal(actual[2].correctionFigureKey,"tc-l8-differential");
});

test("arbres et répartition probabilistes conservés après sauvegarde, publication et GET",async()=>{
  const selected=terminalCProbabilityExercises.sections.flatMap(s=>s.exercises).filter(e=>[3,15,38,46,49].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCProbabilityExercises.lessonKey,lessonTitle:"Probabilité conditionnelle",category:"deepening",stageNumber:31,title:"Arbres et lois",sourceSectionId:"tc-l9-deepening",courseTopicId:"prob-total",exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);
  const actual=response.json().levels[0].exercises;assert.deepEqual(actual,selected);
  assert.equal(actual[0].figureKey,"tc-l9-tree-blank");assert.equal(actual[0].correctionFigureKey,"tc-l9-probability");
  assert.ok(actual.slice(1).every((e:{figureKey?:string;correctionFigureKey?:string})=>!e.figureKey&&e.correctionFigureKey==="tc-l9-probability"));
});

test("les nuages statistiques, variantes de correction et réponses survivent à sauvegarde/publication/GET",async()=>{
  const selected=terminalCStatisticsExercises.sections.flatMap(s=>s.exercises).filter(e=>[23,27,32,35,37].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCStatisticsExercises.lessonKey,lessonTitle:"Statistique à deux variables",category:"deepening",stageNumber:41,title:"Nuages et régressions",sourceSectionId:"tc-l10-deepening",courseTopicId:"stats-regressions",exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);const actual=response.json().levels[0].exercises;
  assert.deepEqual(actual,selected);assert.equal(actual[0].figureKey,"tc-l10-scatter-blank");
  assert.ok(actual.every((e:{correctionFigureKey?:string})=>e.correctionFigureKey==="tc-l10-statistics"));
});

test("barycentres : figures sources et solutions distinctes conservées par le serveur",async()=>{
  const selected=terminalCBarycenterExercises.sections.flatMap(s=>s.exercises).filter(e=>[24,27,36,38,41].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCBarycenterExercises.lessonKey,lessonTitle:"Barycentre",category:"deepening",stageNumber:42,title:"Barycentres et lieux",sourceSectionId:"tc-t2-l1-deepening",courseTopicId:"bary-partial",exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);const actual=response.json().levels[0].exercises;
  assert.deepEqual(actual,JSON.parse(JSON.stringify(selected)));assert.equal(actual[0].figureKey,"tc-t2-l1-source");assert.equal(actual[1].figureKey,undefined);
  assert.ok(actual.every((e:{correctionFigureKey?:string})=>e.correctionFigureKey==="tc-t2-l1-barycenter"));
});
test("plans, droites, sphère et réponse libre conservés après sauvegarde/publication/GET",async()=>{
  const selected=terminalCSpaceExercises.sections.flatMap(s=>s.exercises).filter(e=>[1,12,21,28,29].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCSpaceExercises.lessonKey,lessonTitle:"Géométrie analytique de l’espace",category:"deepening",stageNumber:44,title:"Plans et droites",sourceSectionId:"tc-t2-l3-deepening",courseTopicId:"space-two-planes",exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  const publish=await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);const actual=response.json().levels[0].exercises;
  assert.deepEqual(actual,JSON.parse(JSON.stringify(selected)));assert.equal(actual[0].figureKey,"tc-t2-l3-space");assert.equal(actual[0].correctionFigureKey,undefined);
  assert.ok(actual.slice(1).every((e:{figureKey?:string;correctionFigureKey?:string})=>!e.figureKey&&e.correctionFigureKey==="tc-t2-l3-space"));
});

test("nombres complexes et circuits survivent à la publication JSON sans modifier les réponses",async()=>{
  const selected=terminalCComplexExercises.sections.flatMap(s=>s.exercises).filter(e=>[7,67,76,77,78,79].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCComplexExercises.lessonKey,lessonTitle:"Nombres complexes",category:"deepening",stageNumber:45,title:"Calculs complexes et configurations",sourceSectionId:"tc-t2-l5-deepening",courseTopicId:"complex-geometric-criteria",exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  assert.equal((await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}})).statusCode,200);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);assert.deepEqual(response.json().levels[0].exercises,JSON.parse(JSON.stringify(selected)));
});
test("PPCM/PGCD : outils et questions sont conservés à publication et lecture SQLite",async()=>{
  const selected=terminalCGcdExercises.sections.flatMap(s=>s.exercises).filter(e=>[19,38,48,79,80,81,82].includes(e.sourceNumber!));
  const source={...payload,lessonKey:terminalCGcdExercises.lessonKey,lessonTitle:"PPCM et PGCD",category:"deepening",stageNumber:46,title:"Arithmétique et applications",sourceSectionId:"tc-t2-l6-deepening-b",courseTopicId:"gcd-congruence",exercises:selected};
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:source}});
  assert.equal(save.statusCode,200,save.body);const id=save.json().level.id;
  assert.equal((await app.inject({method:"POST",url:"/arena-exercises/editor/"+id+"/status",headers:headers(3),payload:{status:"published"}})).statusCode,200);
  const response=await app.inject({method:"GET",url:"/arena-exercises?levelId=terminale-c&subjectId=mathematics&lessonKey="+source.lessonKey,headers:headers(0)});
  assert.equal(response.statusCode,200);assert.deepEqual(response.json().levels[0].exercises,JSON.parse(JSON.stringify(selected)));
});
test("la nouvelle banque enregistre les catégories et les réponses sans permettre à un élève de publier",async()=>{
  assert.equal((await app.inject({method:"PUT",url:"/arena-exercises/editor",payload:{payload}})).statusCode,401);
  assert.equal((await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(0),payload:{payload}})).statusCode,403);
  const save=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(1),payload:{payload}});
  assert.equal(save.statusCode,200,save.body);
  const draft=save.json().level;
  assert.equal(draft.category,"fixation");
  assert.equal(draft.sourceSectionId,section.id);
  assert.deepEqual(draft.exercises[0].questions,section.exercises[0].questions);
  const before=await app.inject({method:"GET",url:listUrl,headers:headers(0)});
  assert.deepEqual(before.json().levels,[]);
  const other=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(2),payload:{documentId:draft.id,payload}});
  assert.equal(other.statusCode,403);
  assert.equal((await app.inject({method:"POST",url:`/arena-exercises/editor/${draft.id}/status`,headers:headers(1),payload:{status:"published"}})).statusCode,403);
  const publish=await app.inject({method:"POST",url:`/arena-exercises/editor/${draft.id}/status`,headers:headers(3),payload:{status:"published"}});
  assert.equal(publish.statusCode,200,publish.body);
  const after=(await app.inject({method:"GET",url:listUrl,headers:headers(0)})).json().levels;
  assert.equal(after.length,1);
  assert.equal(after[0].category,"fixation");
  assert.deepEqual(after[0].exercises[0].questions,section.exercises[0].questions);
  const update=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(1),payload:{documentId:draft.id,payload:{...payload,title:"Référence en relecture"}}});
  assert.equal(update.statusCode,200,update.body);
  const stillPublished=(await app.inject({method:"GET",url:listUrl,headers:headers(0)})).json().levels;
  assert.equal(stillPublished[0].title,section.title,"Un brouillon ne remplace pas la publication");
  const move=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{documentId:draft.id,payload:{...payload,levelId:"terminale-d"}}});
  assert.equal(move.statusCode,409);
});

test("le serveur refuse les entrées interactives malformées avant toute sauvegarde",async()=>{
  const invalidChoice=structuredClone(payload);
  if(invalidChoice.exercises[0].questions![0].answer.kind==="choice")invalidChoice.exercises[0].questions![0].answer.correctIndex=99;
  for(const invalid of [{...payload,category:"easy"},invalidChoice,{...payload,exercises:[{...payload.exercises[0],questions:[payload.exercises[0].questions![0],payload.exercises[0].questions![0]]}]}]) {
    const response=await app.inject({method:"PUT",url:"/arena-exercises/editor",headers:headers(3),payload:{payload:invalid}});
    assert.equal(response.statusCode,400,response.body);
  }
});
