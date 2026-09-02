import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { fileURLToPath } from "node:url";

function readProjectFile(relativePath: string) {
  return readFileSync(fileURLToPath(new URL(`../${relativePath}`, import.meta.url)), "utf8");
}

const pageSource = readProjectFile("apps/web/src/features/arena/ArenaExercisesPage.tsx");
const styleSource = readProjectFile("apps/web/src/styles/onboarding-training.css");
const frontendDecisions = readProjectFile("apps/web/AGENTS.md");

test("les exercices de l’Arène utilisent une liste académique de séries", () => {
  assert.doesNotMatch(
    pageSource,
    /\b(?:ArenaLevelJourney|ArenaJourneyLevel|journeyIcons|journeyLevels|journeyPreview(?:Levels|Sources)?)\b|arena-level-journey|mastery-road/,
  );
  assert.doesNotMatch(pageSource, /Choisis ton défi/);
  assert.doesNotMatch(pageSource, /J’ai terminé\s*[—–-]\s*voir la correction/);

  assert.match(pageSource, /Liste des séries/);
  assert.match(pageSource, /Séries disponibles/);
  assert.match(pageSource, /Toutes les séries/);
  assert.match(pageSource, /arena-series-list/);
  assert.match(pageSource, /Ouvrir la série/);

  assert.doesNotMatch(styleSource, /\.arena-level-journey\b/);
  assert.match(styleSource, /\.arena-series-list\b/);
});

test("la correction est reliée à une région accessible toujours présente", () => {
  assert.match(pageSource, /Afficher la correction/);
  assert.match(pageSource, /aria-expanded=\{correctionVisible\}/);
  assert.match(pageSource, /aria-controls=\{correctionId\}/);
  assert.match(pageSource, /id=\{correctionId\}/);
  assert.match(pageSource, /role="region"/);
  assert.match(pageSource, /hidden=\{!correctionVisible\}/);
});

test("la décision frontend interdit durablement la gamification de cette banque", () => {
  assert.match(frontendDecisions, /calm academic list/);
  assert.match(frontendDecisions, /never as a gamified mastery road/);
  assert.match(frontendDecisions, /no dotted progression/);
});
