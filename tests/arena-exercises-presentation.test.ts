import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

function readProjectFile(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), "utf8");
}

const pageSource = readProjectFile("apps/web/src/features/arena/ArenaExercisesPage.tsx");
const librarySource = readProjectFile("apps/web/src/features/arena/exercises/ExerciseLibrary.tsx");
const playerSource = readProjectFile("apps/web/src/features/arena/exercises/ExercisePlayer.tsx");
const categorySource = readProjectFile("apps/web/src/features/arena/exercises/exerciseLibraryModel.ts");
const styleSource = readProjectFile("apps/web/src/styles/exercise-bank.css");
const frontendDecisions = readProjectFile("apps/web/AGENTS.md");

test("les exercices utilisent trois catégories pédagogiques et des rubriques académiques", () => {
  assert.doesNotMatch(
    pageSource,
    /\b(?:ArenaLevelJourney|ArenaJourneyLevel|journeyIcons|journeyLevels|journeyPreview(?:Levels|Sources)?)\b|arena-level-journey|mastery-road/,
  );
  assert.doesNotMatch(pageSource, /Choisis ton défi/);
  assert.doesNotMatch(pageSource, /J’ai terminé\s*[—–-]\s*voir la correction/);

  for (const label of ["Exercices de fixation", "Approfondissement", "Situations complexes"]) assert.ok(categorySource.includes(label));
  assert.match(librarySource, /practice-section-link/);
  assert.match(librarySource, /practice-exercise-heading/);
  assert.doesNotMatch(librarySource, /practice-exercise-toggle|aria-expanded/);
  assert.doesNotMatch(pageSource, /Choisis une difficulté|Niveau de difficulté/);

  assert.doesNotMatch(styleSource, /\.arena-level-journey\b/);
  assert.match(styleSource, /\.practice-section\b/);
});

test("les exercices restent visibles et chaque correction possède son bouton accessible", () => {
  assert.match(librarySource, /aria-labelledby=\{headingId\}/);
  assert.match(librarySource, /id=\{headingId\}/);
  assert.match(playerSource, /aria-expanded=\{correctionVisible\}/);
  assert.match(playerSource, /aria-controls=\{correctionId\}/);
  assert.match(playerSource, /id=\{correctionId\}/);
  assert.match(playerSource, /role="region"/);
  assert.match(playerSource, /hidden=\{!correctionVisible\}/);
  assert.match(playerSource, /Voir la correction/);
  assert.match(styleSource, /background: #187341/);
});

test("la décision frontend interdit durablement la gamification de cette banque", () => {
  assert.match(frontendDecisions, /calm academic list/);
  assert.match(frontendDecisions, /never as a gamified mastery road/);
  assert.match(frontendDecisions, /no dotted progression/);
});
