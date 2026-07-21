import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const input = process.argv[2]
if (!input) {
  throw new Error('Usage: node build-training-import-sql.mjs <batch-v2.json>')
}

const raw = await readFile(resolve(input), 'utf8')
const batch = JSON.parse(raw)

if (batch.schema_version !== 2 || batch.status !== 'reviewed') {
  throw new Error('Le lot doit être un lot v2 relu avant import.')
}

const canonical = JSON.stringify(batch)
let tag = '$training_v2$'
let suffix = 2
while (canonical.includes(tag)) {
  tag = `$training_v2_${suffix}$`
  suffix += 1
}

process.stdout.write([
  '-- Import idempotent d’un lot d’exercices guidés v2.',
  'begin;',
  `select public.importer_lot_exercices_v2(${tag}${canonical}${tag}::jsonb);`,
  'commit;',
  '',
].join('\n'))
