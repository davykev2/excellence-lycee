import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { terminalCDMathPairs, getTerminalCDMathPair, terminalDMathProgrammeSource } from "../apps/web/src/data/terminalCDMathSharing";
import { terminalCMathematicsPaths } from "../apps/web/src/data/terminalCMathPaths";
import { terminalDMathematicsPaths } from "../apps/web/src/data/terminalDMathPaths";
import { learningPaths } from "../apps/web/src/data/learningPaths";
import { loadLearningPathsForSubject } from "../apps/web/src/data/learningPathLoader";
import { loadExerciseCollection } from "../apps/web/src/data/exerciseCollections/loadExerciseCollection";
import { mathEssentialPairs, getMathEssentialKey, loadMathEssentialSheet } from "../apps/web/src/data/mathEssentials/registry";
import { terminalDMathPathSources, terminalDMathLessonIds } from "../apps/api/src/terminalDMathRewards";
import { arenaPayloadSchema } from "../apps/api/src/arenaExerciseSchema";
import { exerciseLibrarySections } from "../apps/web/src/features/arena/exercises/exerciseLibraryModel";
import { exerciseDraftKey, restoreExerciseDraft, exerciseAssessment } from "../apps/web/src/features/arena/exercises/exerciseAssessment";
import { documentDraftKey, restoreDocumentDraft } from "../apps/web/src/features/lesson/document/documentAssessment";
import { getPathLessons } from "../apps/web/src/features/paths/pathLessons";
import { appRouteUrl, readAppRoute } from "../apps/web/src/routing/appRoute";
import type { PublishedArenaExerciseLevel } from "../apps/web/src/domain/arenaExercises";

const cPath = (id: string) => terminalCMathematicsPaths.find(path => path.id === id)!;
const dPath = (id: string) => terminalDMathematicsPaths.find(path => path.id === id)!;
const source = (name: string) => readFileSync(new URL("../apps/web/src/" + name, import.meta.url), "utf8");

test("les douze correspondances vérifiées sur le manuel D sont les mêmes que le contrat API historique", () => {
  assert.equal(terminalCDMathPairs.length, 12);
  assert.deepEqual(terminalCDMathPairs.map(pair => [pair.d, pair.c]).sort(), [...terminalDMathPathSources].sort());
  assert.deepEqual(terminalCDMathPairs.map(pair => pair.chapterD).sort((a,b) => a-b), Array.from({length:12}, (_,i) => i+1));
  assert.deepEqual(mathEssentialPairs, terminalCDMathPairs.map(pair => [pair.key, pair.c, pair.d]));
  assert.equal(terminalDMathProgrammeSource.pageCount, 343);
  assert.equal(terminalDMathProgrammeSource.contentsPdfPage, 8);
  assert.equal(terminalDMathProgrammeSource.sha256, "F18EBEB14490B81F21C74957181B61F321077C9E237B9F78ADAE8AEEDA17396E");
  assert.deepEqual(terminalCDMathPairs.map(pair => pair.skillsPdfPageD).sort((a,b) => a-b), [10,50,80,106,120,140,176,200,232,254,288,312]);
  for (const pair of terminalCDMathPairs) {
    assert.strictEqual(getTerminalCDMathPair(pair.c, "terminale-c"), pair);
    assert.strictEqual(getTerminalCDMathPair(pair.d, "terminale-d"), pair);
    assert.equal(getTerminalCDMathPair(pair.c, "terminale-d"), null);
    assert.equal(getTerminalCDMathPair(pair.d, "terminale-c"), null);
    assert.equal(dPath(pair.d).chapterNumber, pair.chapterD);
  }
});

test("onze résumés et évaluations sont réellement partagés, sans recopier les données C", () => {
  let shared = 0;
  for (const pair of terminalCDMathPairs) {
    const c = cPath(pair.c).courseDocument, d = dPath(pair.d).courseDocument;
    if (!c) {
      assert.equal(pair.key, "geometry"); assert.equal(d, undefined);
      continue; // Do not pretend the not-yet-rebuilt C13 documentary course exists.
    }
    assert.ok(d, pair.d); shared++;
    assert.notStrictEqual(d, c);
    assert.notEqual(d.id, c.id);
    assert.deepEqual(c.levelIds, ["terminale-c"]);
    assert.deepEqual(d.levelIds, ["terminale-d"]);
    assert.strictEqual(d.sections, c.sections);
    assert.strictEqual(d.evaluations, c.evaluations);
    assert.strictEqual(d.legacyAnchors, c.legacyAnchors);
    assert.equal(d.version, c.version);
    assert.equal(d.source.lessonLabel, "Leçon " + pair.chapterD);
    // The original C provenance is kept; the D manual only verified compatibility.
    for (const field of ["title", "pageCount", "summaryPages", "evaluationPages", "sha256", "editorialNotes"] as const) {
      assert.deepEqual(d.source[field], c.source[field]);
    }
  }
  assert.equal(shared, 11);
});

test("les douze parcours, identifiants, poids, anciennes questions et budgets restent inchangés", () => {
  assert.equal(terminalDMathematicsPaths.length, 12);
  for (const pair of terminalCDMathPairs) {
    const c = getPathLessons(cPath(pair.c)), d = getPathLessons(dPath(pair.d));
    assert.deepEqual(d.map(lesson => [lesson.id, lesson.xp]), c.map(lesson => [lesson.id, lesson.xp]));
    assert.deepEqual(d.map(lesson => lesson.id), terminalDMathLessonIds.find(([id]) => id === pair.d)![1]);
    d.forEach((lesson, index) => assert.strictEqual(lesson.questions, c[index].questions));
    const normalized = learningPaths.find(path => path.id === pair.d)!;
    assert.equal(getPathLessons(normalized).reduce((sum, lesson) => sum + lesson.xp, 0), 10_000);
  }
  // The stability suite recalculates the global counter. Do not freeze an
  // editorial milestone here: unrelated lesson updates must remain possible.
});

test("le chargement différé D retrouve les mêmes contenus que le catalogue synchrone, sans exposer C", async () => {
  const loaded = await loadLearningPathsForSubject("terminale-d", "mathematics");
  assert.equal(loaded.length, 12);
  for (const pair of terminalCDMathPairs) {
    const path = loaded.find(path => path.id === pair.d)!;
    assert.ok(path); assert.deepEqual(path.levelIds, ["terminale-d"]);
    // tsx's synchronous and dynamic import bridges may instantiate two module graphs.
    assert.deepEqual(path.courseDocument, dPath(pair.d).courseDocument);
    assert.ok(!loaded.some(item => item.id === pair.c));
  }
});

test("onze banques,562 exercices,figures et corrections ont une seule version éditoriale", async () => {
  let collections = 0, exercises = 0;
  for (const pair of terminalCDMathPairs) {
    const c = await loadExerciseCollection("terminale-c", "mathematics", pair.c);
    const d = await loadExerciseCollection("terminale-d", "mathematics", pair.d);
    if (!c) { assert.equal(pair.key, "geometry"); assert.equal(d, null); continue; }
    assert.ok(d); collections++;
    assert.notStrictEqual(d, c); assert.notEqual(d.id, c.id);
    assert.equal(d.levelId, "terminale-d"); assert.equal(d.lessonKey, pair.d);
    assert.equal(c.levelId, "terminale-c"); assert.equal(c.lessonKey, pair.c);
    assert.strictEqual(d.source, c.source); assert.strictEqual(d.sections, c.sections);
    for (const section of d.sections) {
      assert.ok(dPath(pair.d).courseDocument!.sections.flatMap(item => item.topics).some(topic => topic.id === section.courseTopicId));
      exercises += section.exercises.length;
      assert.ok(section.exercises.every(exercise => exercise.correctionMarkdown.length > 30));
    }
    assert.deepEqual([...new Set(d.sections.map(section => section.category))].sort(), ["complex", "deepening", "fixation"]);
  }
  assert.equal(collections, 11); assert.equal(exercises, 562);
});

test("les leçons propres à C, les URL croisées et les autres classes ne chargent aucune banque D", async () => {
  for (const pair of terminalCDMathPairs) {
    assert.equal(await loadExerciseCollection("terminale-d", "mathematics", pair.c), null);
    assert.equal(await loadExerciseCollection("terminale-c", "mathematics", pair.d), null);
    assert.equal(await loadExerciseCollection("terminale-d", "svt", pair.d), null);
    for (const other of ["terminale-a", "premiere-d", "seconde-c", "unknown"]) {
      assert.equal(getTerminalCDMathPair(pair.d, other), null);
      assert.equal(await loadExerciseCollection(other, "mathematics", pair.d), null);
    }
  }
  for (const suffix of ["02-barycenter", "03-divisibility", "05-space-analytic-geometry", "07-conics", "11-lcm-gcd", "14-plane-isometries", "16-direct-similarities"]) {
    assert.equal(getTerminalCDMathPair("terminale-c-math-l" + suffix, "terminale-c"), null);
    assert.equal(getTerminalCDMathPair("terminale-d-math-l" + suffix, "terminale-d"), null);
  }
});

test("les douze fiches L’essentiel restent les mêmes objets pour C et D", async () => {
  for (const pair of terminalCDMathPairs) {
    const c = await loadMathEssentialSheet(getMathEssentialKey(pair.c, "terminale-c")!);
    const d = await loadMathEssentialSheet(getMathEssentialKey(pair.d, "terminale-d")!);
    assert.strictEqual(d, c);
  }
});

test("lecture et réponses documentaires sont cloisonnées par série,élève et version", () => {
  for (const pair of terminalCDMathPairs) {
    const c = cPath(pair.c).courseDocument, d = dPath(pair.d).courseDocument;
    if (!c || !d) continue;
    const keyC = documentDraftKey("élève:1", pair.c, c);
    const keyD = documentDraftKey("élève:1", pair.d, d);
    assert.notEqual(keyC, keyD);
    assert.notEqual(keyD, documentDraftKey("élève:2", pair.d, d));
    assert.notEqual(keyD, documentDraftKey("élève:1", pair.d, {...d, version:d.version+1}));
    const task = d.evaluations.flatMap(group => group.writtenTasks ?? [])[0];
    assert.ok(task);
    const stored = new Map([[keyD, JSON.stringify({answers:{},written:{[task.id]:"Ma démonstration en D"},submitted:false})]]);
    assert.equal(restoreDocumentDraft(stored.get(keyD) ?? null, d).written[task.id], "Ma démonstration en D");
    assert.deepEqual(restoreDocumentDraft(stored.get(keyC) ?? null, c).written, {});
  }
  assert.match(source("features/lesson/document/LessonDocumentScreen.tsx"), /readingKey = .*currentUser.id.*path.id.*course.version/);
});

test("brouillons d’exercices et validations restent séparés malgré les IDs de source communs", async () => {
  for (const pair of terminalCDMathPairs) {
    const c = await loadExerciseCollection("terminale-c", "mathematics", pair.c);
    const d = await loadExerciseCollection("terminale-d", "mathematics", pair.d);
    if (!c || !d) continue;
    const [sectionC] = exerciseLibrarySections(c, []), [sectionD] = exerciseLibrarySections(d, []);
    const exercise = sectionD.exercises[0];
    const keyC = exerciseDraftKey("élève", pair.c + ":" + sectionC.revision, exercise.id);
    const keyD = exerciseDraftKey("élève", pair.d + ":" + sectionD.revision, exercise.id);
    assert.notEqual(sectionC.revision, sectionD.revision); assert.notEqual(keyC, keyD);
    assert.notEqual(keyD, exerciseDraftKey("autre élève", pair.d + ":" + sectionD.revision, exercise.id));
    const question = exercise.questions![0];
    const stored = new Map([[keyD, JSON.stringify({answers:{[question.id]:"Ma réponse D"},reasoning:"Mes étapes",submitted:true,score:20,correctionOpen:true})]]);
    const restored = restoreExerciseDraft(stored.get(keyD) ?? null, exercise);
    assert.equal(restored.answers[question.id], "Ma réponse D");
    assert.equal("score" in restored, false); assert.equal("correctionOpen" in restored, false);
    assert.deepEqual(restoreExerciseDraft(stored.get(keyC) ?? null, exercise).answers, {});
    if (exercise.questions!.every(question => question.answer.kind === "written")) assert.equal(exerciseAssessment(exercise,{}).total,0);
  }
});

test("une publication D ne remplace jamais une rubrique C,ni l’inverse,même avec le même sourceSectionId", async () => {
  const pair = terminalCDMathPairs[0];
  const c = (await loadExerciseCollection("terminale-c", "mathematics", pair.c))!;
  const d = (await loadExerciseCollection("terminale-d", "mathematics", pair.d))!;
  const section = c.sections[0];
  const publication: PublishedArenaExerciseLevel = {id:"publication-d",version:1,publishedAt:"2026-10-22T12:00:00Z",levelId:"terminale-d",subjectId:"mathematics",lessonKey:pair.d,lessonTitle:"Limites",difficulty:"easy",category:section.category,sourceSectionId:section.id,courseTopicId:section.courseTopicId,stageNumber:1,title:"Ma rubrique D",instructionsMarkdown:"",exercises:structuredClone(section.exercises)};
  assert.equal(exerciseLibrarySections(c,[publication])[0].title,section.title);
  assert.equal(exerciseLibrarySections(d,[publication])[0].title,"Ma rubrique D");
  const other = {...publication,id:"publication-c",levelId:"terminale-c",lessonKey:pair.c,title:"Ma rubrique C"};
  assert.equal(exerciseLibrarySections(c,[publication,other])[0].title,"Ma rubrique C");
  assert.equal(exerciseLibrarySections(d,[publication,other])[0].title,"Ma rubrique D");
  assert.equal(exerciseLibrarySections(d,[{...publication,lessonKey:terminalCDMathPairs[1].d}])[0].title,section.title);
});

test("chaque modèle de rubrique D passe le contrat de publication,une édition reste une copie privée", async () => {
  for (const pair of terminalCDMathPairs) {
    const collection = await loadExerciseCollection("terminale-d", "mathematics", pair.d);
    if (!collection) continue;
    for (const [index, section] of collection.sections.entries()) {
      const payload = arenaPayloadSchema.parse({levelId:"terminale-d",subjectId:"mathematics",lessonKey:pair.d,lessonTitle:dPath(pair.d).title,difficulty:"easy",category:section.category,sourceSectionId:section.id,courseTopicId:section.courseTopicId,stageNumber:index+1,title:section.title,instructionsMarkdown:"",exercises:structuredClone(section.exercises)});
      assert.equal(payload.levelId,"terminale-d"); assert.equal(payload.lessonKey,pair.d);
      const before = section.exercises[0].statementMarkdown;
      payload.exercises[0].statementMarkdown = "Un changement éditorial en D";
      assert.equal(section.exercises[0].statementMarkdown,before);
    }
  }
  assert.match(source("features/arena/ArenaExercisesPage.tsx"), /exercises: structuredClone\(source.exercises\)/);
  assert.match(source("features/arena/exercises/ExerciseEditor.tsx"), /structuredClone\(\{ \.\.\.initial/);
});

test("URL,retour au cours et onglets conservent le contexte D après F5", async () => {
  for (const pair of terminalCDMathPairs) {
    const collection = await loadExerciseCollection("terminale-d","mathematics",pair.d);
    if (!collection) continue;
    const section = collection.sections.find(section => section.category === "fixation")!;
    const exercise = section.exercises[0];
    const route = {navigation:"arena" as const,subjectId:"mathematics" as const,arenaMode:"exercises" as const,exerciseSelection:{lessonKey:pair.d,category:"fixation" as const,sectionId:section.id,exerciseId:exercise.id}};
    const url = new URL(appRouteUrl(route,"?__paths-preview=1&__level-preview=terminale-d"),"https://example.test");
    const restored = readAppRoute(url,{navigation:"home"});
    assert.deepEqual(restored.exerciseSelection,route.exerciseSelection);
    assert.equal(restored.navigation,"arena"); assert.equal(restored.arenaMode,"exercises");
    assert.equal(restored.subjectId,"mathematics");
    assert.equal(url.searchParams.get("__level-preview"),"terminale-d");
    for (const courseTab of ["summary","assessment","essentials"] as const) {
      const back = new URL(appRouteUrl({navigation:"paths",subjectId:"mathematics",pathId:pair.d,lessonId:section.courseTopicId,courseTab},"?__level-preview=terminale-d"),"https://example.test");
      assert.equal(readAppRoute(back,{navigation:"home"}).pathId,pair.d);
      assert.ok(!back.pathname.includes(pair.c));
    }
  }
});
