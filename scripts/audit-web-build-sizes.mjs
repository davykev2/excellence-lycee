import { readdirSync, statSync } from "node:fs";
import { dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDirectory = resolve(root, "apps/web/dist/assets");
const maximumChunkBytes = 500_000;
const checkedExtensions = new Set([".css", ".js"]);

const chunks = readdirSync(assetsDirectory)
  .map((name) => resolve(assetsDirectory, name))
  .filter((file) => checkedExtensions.has(extname(file)))
  .map((file) => ({
    file: relative(root, file).replaceAll("\\", "/"),
    bytes: statSync(file).size,
  }))
  .sort((left, right) => right.bytes - left.bytes);

if (chunks.length === 0) {
  console.error("Aucun chunk JavaScript ou CSS trouvé dans le build Web.");
  process.exit(1);
}

const oversizedChunks = chunks.filter((chunk) => chunk.bytes > maximumChunkBytes);
if (oversizedChunks.length > 0) {
  console.error("Budget de bundle dépassé (limite 500 000 octets) :");
  for (const chunk of oversizedChunks) {
    console.error(`- ${chunk.file} : ${chunk.bytes.toLocaleString("fr-FR")} octets`);
  }
  process.exit(1);
}

console.log("Budget de bundle respecté. Plus gros chunks JS/CSS :");
for (const chunk of chunks.slice(0, 5)) {
  console.log(`- ${chunk.file} : ${chunk.bytes.toLocaleString("fr-FR")} octets`);
}
