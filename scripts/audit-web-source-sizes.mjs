import { readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDirectory = resolve(root, "apps/web/src");
const maximumBytes = 250_000;
const checkedExtensions = new Set([".css", ".ts", ".tsx"]);

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = resolve(directory, entry.name);
    return entry.isDirectory() ? collectFiles(absolutePath) : [absolutePath];
  });
}

const measuredFiles = collectFiles(sourceDirectory)
  .filter((file) => checkedExtensions.has(extname(file)))
  .map((file) => ({
    file: relative(root, file).replaceAll("\\", "/"),
    bytes: statSync(file).size,
  }))
  .sort((left, right) => right.bytes - left.bytes);
const oversizedFiles = measuredFiles.filter((entry) => entry.bytes > maximumBytes);

if (oversizedFiles.length > 0) {
  console.error("Fichiers monolithiques détectés (limite 250 000 octets) :");
  for (const entry of oversizedFiles) {
    console.error(`- ${entry.file} : ${entry.bytes.toLocaleString("fr-FR")} octets`);
  }
  process.exit(1);
}

console.log("Budget source respecté. Plus gros fichiers :");
for (const entry of measuredFiles.slice(0, 5)) {
  console.log(`- ${entry.file} : ${entry.bytes.toLocaleString("fr-FR")} octets`);
}
