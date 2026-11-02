import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const windowsNpmCli = resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");
const useWindowsNpmCli = process.platform === "win32" && existsSync(windowsNpmCli);
const npm = useWindowsNpmCli ? process.execPath : "npm";
const npmPrefix = useWindowsNpmCli ? [windowsNpmCli] : [];

function run(label, command, args, cwd = root) {
  console.log(`\n=== ${label} ===`);
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const web = resolve(root, "apps/web");
const api = resolve(root, "apps/api");

run("Audit de sécurité Web", npm, [...npmPrefix, "audit", "--omit=dev", "--audit-level=high"], web);
run("Audit de sécurité API", npm, [...npmPrefix, "audit", "--omit=dev", "--audit-level=high"], api);
run("Typage Web", npm, [...npmPrefix, "run", "typecheck"], web);
run("Typage API", npm, [...npmPrefix, "run", "typecheck"], api);
run(
  "Budget des fichiers source Web",
  process.execPath,
  [resolve(root, "scripts", "audit-web-source-sizes.mjs")],
);
run("Tests de stabilité", npm, [...npmPrefix, "run", "test:stability"], api);
run(
  "Présentation des exercices de l’Arène",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    "--test",
    resolve(root, "tests", "arena-exercises-presentation.test.ts"),
    resolve(root, "tests", "arena-exercises.test.ts"),
    resolve(root, "tests", "arena-exercises-api.test.ts"),
    resolve(root, "tests", "derivatives-exercises.test.ts"),
    resolve(root, "tests", "primitives-exercises.test.ts"),
    resolve(root, "tests", "logarithms-exercises.test.ts"),
    resolve(root, "tests", "exponential-power-exercises.test.ts"),
    resolve(root, "tests", "sequences-exercises.test.ts"),
    resolve(root, "tests", "integral-exercises.test.ts"),
    resolve(root, "tests", "differential-exercises.test.ts"),
    resolve(root, "tests", "probability-exercises.test.ts"),
    resolve(root, "tests", "statistics-exercises.test.ts"),
    resolve(root, "tests", "barycenter-exercises.test.ts"),
    resolve(root, "tests", "divisibility-exercises.test.ts"),
    resolve(root, "tests", "space-exercises.test.ts"),
    resolve(root, "tests", "conics-exercises.test.ts"),
    resolve(root, "tests", "complex-exercises.test.ts"),
    resolve(root, "tests", "complex-input.test.ts"),
    resolve(root, "tests", "gcd-exercises.test.ts"),
  ],
);
run(
  "Soutien volontaire et paiement Wave",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    "--test",
    resolve(root, "tests", "support-route.test.ts"),
    resolve(root, "tests", "wave-checkout.test.ts"),
  ],
);
run(
  "Correction des cours continus",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    "--test",
    resolve(root, "tests", "continuous-course-correction.test.ts"),
  ],
);
run(
  "Navigation simplifiée et historique des résultats",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    "--test",
    resolve(root, "tests", "usability-navigation.test.ts"),
    resolve(root, "tests", "home-action-cards.test.ts"),
    resolve(root, "tests", "home-focused.test.ts"),
    resolve(root, "tests", "home-original.test.ts"),
    resolve(root, "tests", "home-historical.test.ts"),
    resolve(root, "tests", "home-document.test.ts"),
    resolve(root, "tests", "subject-library-homework-lock.test.ts"),
    resolve(root, "tests", "training-illustrated.test.ts"),
    resolve(root, "tests", "exam-collections.test.ts"),
    resolve(root, "tests", "official-bac-library.test.ts"),
    resolve(root, "tests", "math-library-essentials.test.ts"),
    resolve(root, "tests", "analysis-reminder.test.ts"),
    resolve(root, "tests", "math-shared-essentials.test.ts"),
    resolve(root, "tests", "math-cd-sharing.test.ts"),
    resolve(root, "tests", "physics-shared-essentials.test.ts"),
    resolve(root, "tests", "physics-course-summary.test.ts"),
    resolve(root, "tests", "humanities-course-summary.test.ts"),
    resolve(root, "tests", "svt-shared-essentials.test.ts"),
    resolve(root, "tests", "svt-course-summary.test.ts"),
  ],
);
run(
  "Ateliers de mémorisation · philo, français et accès",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    "--test",
    resolve(root, "tests", "philo-memory.test.ts"),
    resolve(root, "tests", "philo-memory-navigation.test.ts"),
    resolve(root, "tests", "french-workshop.test.ts"),
    resolve(root, "tests", "french-workshop-navigation.test.ts"),
  ],
);
run(
  "Cours documentaires · résumé et évaluation",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    "--test",
    resolve(root, "tests", "course-document.test.ts"),
    resolve(root, "tests", "terminal-a-functions-document.test.ts"),
    resolve(root, "tests", "terminal-a-probability-document.test.ts"),
    resolve(root, "tests", "terminal-a-logarithm-document.test.ts"),
    resolve(root, "tests", "terminal-a-exponential-document.test.ts"),
    resolve(root, "tests", "derivatives-document.test.ts"),
    resolve(root, "tests", "primitives-document.test.ts"),
    resolve(root, "tests", "logarithms-document.test.ts"),
    resolve(root, "tests", "exponential-power-document.test.ts"),
    resolve(root, "tests", "sequences-document.test.ts"),
    resolve(root, "tests", "integral-document.test.ts"),
    resolve(root, "tests", "differential-document.test.ts"),
    resolve(root, "tests", "probability-document.test.ts"),
    resolve(root, "tests", "statistics-document.test.ts"),
    resolve(root, "tests", "barycenter-document.test.ts"),
    resolve(root, "tests", "divisibility-document.test.ts"),
    resolve(root, "tests", "space-document.test.ts"),
    resolve(root, "tests", "conics-document.test.ts"),
    resolve(root, "tests", "complex-document.test.ts"),
    resolve(root, "tests", "gcd-document.test.ts"),
    resolve(root, "tests", "document-corrections.test.ts"),
    resolve(root, "tests", "philosophy-course-documents.test.ts"),
  ],
);
run(
  "Cours documentaires · audit TC L1",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-limits-document.ts")],
);
run(
  "Cours documentaires · fonctions Terminale A",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-a-functions-document.ts")],
);
run(
  "Cours documentaires · probabilités Terminale A1/A2",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-a-probability-document.ts")],
);
run(
  "Cours documentaires · logarithme Terminale A",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-a-logarithm-document.ts")],
);
run(
  "Cours documentaires · exponentielle Terminale A",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-a-exponential-document.ts")],
);
run(
  "Cours documentaires · audit nombres complexes TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-complex-document.ts")],
);
run(
  "Cours documentaires · audit PPCM et PGCD TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-gcd-document.ts")],
);
run(
  "Cours documentaires · audit dérivabilité TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-derivatives-document.ts")],
);
run(
  "Cours documentaires · audit primitives TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-primitives-document.ts")],
);
run(
  "Cours documentaires · audit logarithmes TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-logarithms-document.ts")],
);
run(
  "Cours documentaires · audit exponentielles et puissances TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-exponential-power-document.ts")],
);
run(
  "Cours documentaires · audit suites numériques TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-sequences-document.ts")],
);
run(
  "Cours documentaires · audit calcul intégral TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-integral-document.ts")],
);
run(
  "Cours documentaires · audit équations différentielles TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-differential-document.ts")],
);
run(
  "Cours documentaires · audit probabilités TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-probability-document.ts")],
);
run(
  "Cours documentaires · audit statistiques TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-statistics-document.ts")],
);
run(
  "Syntaxe du garde-fou Supabase",
  process.execPath,
  ["--check", resolve(root, "scripts", "push-supabase-migrations.mjs")],
);
run(
  "Cours documentaires · audit barycentre TC Tome 2",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-barycenter-document.ts")],
);
run(
  "Cours documentaires · audit divisibilité TC Tome 2",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-divisibility-document.ts")],
);
run(
  "Cours documentaires · géométrie de l’espace TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-space-document.ts")],
);
run(
  "Cours documentaires · audit coniques TC",
  process.execPath,
  [resolve(api, "node_modules", "tsx", "dist", "cli.mjs"), resolve(root, "scripts", "audit-terminal-c-conics-document.ts")],
);
run(
  "Contenu · audit-terminal-history-h1-onu.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-history-h1-onu.ts"),
  ],
);

run(
  "Contenu · audit-terminal-philosophy-l1-dissertation.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-philosophy-l1-dissertation.ts"),
  ],
);

for (const script of [
  "audit-terminal-a-math.mjs",
  "audit-terminal-c-math.mjs",
  "audit-terminal-d-math.mjs",
  "audit-terminal-c-conics-katex.mjs",
  "audit-terminal-c-complex-numbers-katex.mjs",
  "audit-terminal-c-complex-geometry-katex.mjs",
  "audit-terminal-c-exponential-power-katex.mjs",
  "audit-terminal-c-derivatives-katex.mjs",
  "audit-terminal-c-logarithms-katex.mjs",
  "audit-terminal-c-lcm-gcd-katex.mjs",
  "audit-terminal-c-primitives-katex.mjs",
  "audit-terminal-c-sequences-katex.mjs",
  "audit-terminal-c-isometries-katex.mjs",
  "audit-terminal-c-integral-calculus-katex.mjs",
  "audit-terminal-c-direct-similarities-katex.mjs",
  "audit-terminal-c-probability-katex.mjs",
  "audit-terminal-c-differential-equations-katex.mjs",
  "audit-terminal-c-statistics-katex.mjs",
  "audit-terminal-c-space-geometry-katex.mjs",
  "audit-physics-free-oscillations-katex.mjs",
  "audit-physics-magnetic-field-katex.mjs",
  "audit-physics-charged-particle-katex.mjs",
  "audit-physics-laplace-law-katex.mjs",
  "audit-physics-induction-electromagnetic-katex.mjs",
  "audit-physics-auto-induction-katex.mjs",
  "audit-physics-derivator-integrator-katex.mjs",
  "audit-physics-free-electrical-oscillations-katex.mjs",
  "audit-physics-rlc-forced-katex.mjs",
  "audit-physics-rlc-resonance-katex.mjs",
  "audit-physics-ac-power-katex.mjs",
  "audit-physics-wave-light-katex.mjs",
  "audit-physics-corpuscular-light-katex.mjs",
  "audit-physics-spontaneous-nuclear-katex.mjs",
  "audit-physics-provoked-nuclear-katex.mjs",
  "audit-chemistry-amines-katex.mjs",
  "audit-chemistry-alpha-amino-acids-katex.mjs",
]) {
  run(`Contenu · ${script}`, process.execPath, [resolve(root, "scripts", script)]);
}

run(
  "Contenu · audit-terminal-a-svt-emotional-reactions.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-emotional-reactions.ts"),
  ],
);

run(
  "Contenu · audit-terminal-french-literary-dissertation.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-french-literary-dissertation.ts"),
  ],
);

run(
  "Contenu · audit-terminal-a-svt-brain-activity.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-brain-activity.ts"),
  ],
);

run(
  "Contenu · audit-terminal-a-svt-origin-of-life.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-origin-of-life.ts"),
  ],
);

run(
  "Contenu · audit-terminal-a-svt-human-lineage.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-human-lineage.ts"),
  ],
);

run(
  "Contenu · audit-terminal-a-svt-sex-blood-heredity.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-sex-blood-heredity.ts"),
  ],
);

run(
  "Contenu · audit-terminal-a-svt-genetic-predictions.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-genetic-predictions.ts"),
  ],
);

run(
  "Contenu · audit-terminal-a-svt-protein-biosynthesis.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-a-svt-protein-biosynthesis.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-drugs-nervous-system.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-drugs-nervous-system.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-cell-energy-production.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-cell-energy-production.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-muscle-energy-use.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-muscle-energy-use.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-immune-defense.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-immune-defense.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-hiv-infection.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-hiv-infection.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-female-cycles.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-female-cycles.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-human-heredity.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-human-heredity.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-petroleum-formation.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-petroleum-formation.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-petroleum-exploitation.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-petroleum-exploitation.ts"),
  ],
);

run(
  "Contenu · audit-terminal-c-svt-soil-fertility.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-c-svt-soil-fertility.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-conditioned-reflex.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-conditioned-reflex.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-nervous-tissue.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-nervous-tissue.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-skeletal-muscle.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-skeletal-muscle.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-heart.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-heart.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-gamete-fate.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-gamete-fate.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-human-sexual-organs.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-human-sexual-organs.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-spermaphyte-reproduction.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-spermaphyte-reproduction.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-single-trait-heredity.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-single-trait-heredity.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-two-trait-heredity.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-two-trait-heredity.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-internal-environment.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-internal-environment.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-immune-defense.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-immune-defense.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-hiv-infection.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-hiv-infection.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-mining-formation.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-mining-formation.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-mining-exploitation.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-mining-exploitation.ts"),
  ],
);

run(
  "Contenu · audit-terminal-d-svt-soil-protection.ts",
  process.execPath,
  [
    resolve(api, "node_modules", "tsx", "dist", "cli.mjs"),
    resolve(root, "scripts", "audit-terminal-d-svt-soil-protection.ts"),
  ],
);

const batchesDirectory = resolve(root, "content_pipeline/batches");
const batches = readdirSync(batchesDirectory)
  .filter((file) => file.endsWith("-v2.json"))
  .sort();
for (const batch of batches) {
  run(
    `Banque d'exercices · ${batch}`,
    process.execPath,
    [resolve(root, "content_pipeline/scripts/validate-training-v2.mjs"), resolve(batchesDirectory, batch)],
  );
}
run(
  "Couverture de la banque d'exercices",
  process.execPath,
  [resolve(root, "content_pipeline/scripts/audit-training-coverage.mjs")],
);

run("Build API", npm, [...npmPrefix, "run", "build"], api);
run("Intégration API · messagerie privée", npm, [...npmPrefix, "run", "test:messages"], api);
run("Intégration API · photo de profil", npm, [...npmPrefix, "run", "test:profile-photo"], api);
run("Build Web", npm, [...npmPrefix, "run", "build"], web);
run(
  "Budget du build Web",
  process.execPath,
  [resolve(root, "scripts", "audit-web-build-sizes.mjs")],
);

console.log("\nTous les contrôles Excellence Lycée sont passés.");
