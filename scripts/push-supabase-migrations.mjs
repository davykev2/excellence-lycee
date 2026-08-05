import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const supabaseDirectory = resolve(root, "supabase");
const migrationsDirectory = resolve(supabaseDirectory, "migrations");
const linkedMetadataDirectory = resolve(supabaseDirectory, ".temp");
const projectRefFile = resolve(linkedMetadataDirectory, "project-ref");
const migrationPattern = /^(\d{8,14})_[A-Za-z0-9_-]+\.sql$/;
const windowsNpxCli = resolve(dirname(process.execPath), "node_modules/npm/bin/npx-cli.js");

function usage() {
  return [
    "Usage :",
    "  node scripts/push-supabase-migrations.mjs --dry-run <migration.sql> [...]",
    "  node scripts/push-supabase-migrations.mjs --apply --confirm-project=<ref> <migration.sql> [...]",
    "",
    "Seuls les fichiers explicitement nommés peuvent être proposés à Supabase.",
  ].join("\n");
}

function fail(message) {
  throw new Error(`${message}\n\n${usage()}`);
}

function runSupabase(args, cwd, inherit = false) {
  const command = process.platform === "win32" && existsSync(windowsNpxCli)
    ? process.execPath
    : "npx";
  const commandArgs = command === process.execPath
    ? [windowsNpxCli, "--yes", "supabase@latest", ...args]
    : ["--yes", "supabase@latest", ...args];
  const result = spawnSync(command, commandArgs, {
    cwd,
    encoding: "utf8",
    shell: false,
    stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    const details = inherit ? "" : `\n${result.stdout ?? ""}\n${result.stderr ?? ""}`;
    throw new Error(`Supabase CLI a échoué (code ${result.status ?? "inconnu"}).${details}`);
  }
  return {
    stdout: inherit ? "" : result.stdout ?? "",
    stderr: inherit ? "" : result.stderr ?? "",
  };
}

function parseJsonOutput(output) {
  const start = output.indexOf("{");
  const end = output.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("Réponse JSON Supabase introuvable.");
  return JSON.parse(output.slice(start, end + 1));
}

function migrationVersion(fileName) {
  const match = migrationPattern.exec(fileName);
  if (!match) fail(`Nom de migration invalide : ${fileName}`);
  return match[1];
}

function validateRequestedMigrations(fileNames) {
  if (fileNames.length === 0) fail("Aucune migration n'a été indiquée.");
  const unique = new Set();
  return fileNames.map((fileName) => {
    if (fileName !== basename(fileName)) fail(`Indique uniquement le nom du fichier : ${fileName}`);
    const version = migrationVersion(fileName);
    const source = resolve(migrationsDirectory, fileName);
    if (!existsSync(source)) fail(`Migration locale introuvable : ${fileName}`);
    if (unique.has(version)) fail(`Version de migration dupliquée : ${version}`);
    unique.add(version);
    return { fileName, version, source };
  });
}

function readRemoteHistory() {
  const result = runSupabase(
    ["migration", "list", "--linked", "--output-format", "json"],
    root,
  );
  const payload = parseJsonOutput(result.stdout);
  if (!Array.isArray(payload.migrations)) throw new Error("Historique Supabase illisible.");
  return new Set(
    payload.migrations
      .map((migration) => String(migration.remote ?? "").trim())
      .filter(Boolean),
  );
}

function localMigrationByVersion() {
  const files = readdirSync(migrationsDirectory).filter((file) => migrationPattern.test(file));
  return new Map(files.map((file) => [migrationVersion(file), file]));
}

function prepareIsolatedProject(remoteVersions, requested) {
  const temporaryRoot = mkdtempSync(join(tmpdir(), "excellence-supabase-"));
  const temporarySupabase = resolve(temporaryRoot, "supabase");
  const temporaryMigrations = resolve(temporarySupabase, "migrations");
  mkdirSync(temporaryMigrations, { recursive: true });
  cpSync(linkedMetadataDirectory, resolve(temporarySupabase, ".temp"), { recursive: true });

  const localByVersion = localMigrationByVersion();
  for (const version of remoteVersions) {
    const localFile = localByVersion.get(version);
    if (localFile) {
      cpSync(resolve(migrationsDirectory, localFile), resolve(temporaryMigrations, localFile));
    } else {
      writeFileSync(
        resolve(temporaryMigrations, `${version}_remote_history.sql`),
        "-- Migration présente dans l'historique distant.\n",
        "utf8",
      );
    }
  }
  for (const migration of requested) {
    cpSync(migration.source, resolve(temporaryMigrations, migration.fileName));
  }
  return temporaryRoot;
}

function assertDryRunTargets(output, requested) {
  const mentioned = new Set(
    [...output.matchAll(/\b\d{8,14}_[A-Za-z0-9_-]+\.sql\b/g)].map((match) => match[0]),
  );
  const expected = new Set(requested.map((migration) => migration.fileName));
  const unexpected = [...mentioned].filter((file) => !expected.has(file));
  const missing = [...expected].filter((file) => !mentioned.has(file));
  if (unexpected.length > 0 || missing.length > 0) {
    throw new Error([
      "Le dry-run Supabase ne correspond pas à la liste autorisée.",
      unexpected.length ? `Migrations inattendues : ${unexpected.join(", ")}` : "",
      missing.length ? `Migrations absentes : ${missing.join(", ")}` : "",
    ].filter(Boolean).join("\n"));
  }
}

function parseArguments(argv) {
  if (argv.includes("--help") || argv.includes("-h")) {
    console.log(usage());
    process.exit(0);
  }
  const dryRun = argv.includes("--dry-run");
  const apply = argv.includes("--apply");
  if (dryRun === apply) fail("Choisis exactement un mode : --dry-run ou --apply.");
  const confirmation = argv.find((argument) => argument.startsWith("--confirm-project="))
    ?.slice("--confirm-project=".length);
  const fileNames = argv.filter((argument) => !argument.startsWith("--"));
  return { apply, confirmation, fileNames };
}

function main() {
  const { apply, confirmation, fileNames } = parseArguments(process.argv.slice(2));
  if (!existsSync(projectRefFile)) fail("Le projet Supabase n'est pas lié localement.");
  const projectRef = readFileSync(projectRefFile, "utf8").trim();
  if (apply && confirmation !== projectRef) {
    fail(`Confirme explicitement la production avec --confirm-project=${projectRef}.`);
  }

  const requested = validateRequestedMigrations(fileNames);
  const remoteVersions = readRemoteHistory();
  const alreadyApplied = requested.filter((migration) => remoteVersions.has(migration.version));
  if (alreadyApplied.length > 0) {
    fail(`Déjà enregistrée(s) à distance : ${alreadyApplied.map((item) => item.fileName).join(", ")}`);
  }

  const temporaryRoot = prepareIsolatedProject(remoteVersions, requested);
  try {
    console.log(`Projet lié : ${projectRef}`);
    console.log(`Migrations autorisées : ${requested.map((item) => item.fileName).join(", ")}`);
    console.log("\nVérification à blanc Supabase…");
    const dryRunResult = runSupabase(
      ["db", "push", "--linked", "--include-all", "--dry-run", "--yes"],
      temporaryRoot,
    );
    const dryRunOutput = `${dryRunResult.stdout}\n${dryRunResult.stderr}`;
    assertDryRunTargets(dryRunOutput, requested);
    process.stdout.write(dryRunOutput);

    if (!apply) {
      console.log("\nDry-run validé : aucune modification distante n'a été effectuée.");
      return;
    }

    console.log("\nApplication ciblée en production…");
    runSupabase(["db", "push", "--linked", "--include-all", "--yes"], temporaryRoot, true);
    const updatedRemoteVersions = readRemoteHistory();
    const missingAfterPush = requested.filter((migration) => !updatedRemoteVersions.has(migration.version));
    if (missingAfterPush.length > 0) {
      throw new Error(
        `Application non confirmée dans l'historique distant : ${missingAfterPush.map((item) => item.fileName).join(", ")}`,
      );
    }
    console.log("\nMigrations ciblées appliquées avec succès.");
  } finally {
    const expectedPrefix = resolve(tmpdir(), "excellence-supabase-");
    const resolvedTemporaryRoot = resolve(temporaryRoot);
    if (!resolvedTemporaryRoot.startsWith(expectedPrefix)) {
      throw new Error(`Refus de nettoyer un chemin temporaire inattendu : ${resolvedTemporaryRoot}`);
    }
    rmSync(resolvedTemporaryRoot, { recursive: true, force: true });
  }
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
