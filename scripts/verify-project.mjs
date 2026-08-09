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
run("Tests de stabilité", npm, [...npmPrefix, "run", "test:stability"], api);
run(
  "Syntaxe du garde-fou Supabase",
  process.execPath,
  ["--check", resolve(root, "scripts", "push-supabase-migrations.mjs")],
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
  "audit-physics-laplace-law-katex.mjs",
]) {
  run(`Contenu · ${script}`, process.execPath, [resolve(root, "scripts", script)]);
}

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
run("Build Web", npm, [...npmPrefix, "run", "build"], web);

console.log("\nTous les contrôles Excellence Lycée sont passés.");
