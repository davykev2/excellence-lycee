import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

function fail(message) {
  throw new Error(message)
}

function assert(condition, message) {
  if (!condition) fail(message)
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
  }
  return value
}

const LEVELS = [
  { palier: 'entrainement', libelle: 'Facile' },
  { palier: 'maitrise', libelle: 'Moyen' },
  { palier: 'concours', libelle: 'Difficile' },
]

const input = resolve(process.argv[2] ?? '')
if (!process.argv[2]) fail('Usage: node validate-training-v2.mjs <batch.json>')

const batch = JSON.parse(await readFile(input, 'utf8'))
const codes = new Set()

assert(batch.schema_version === 2, 'schema_version doit valoir 2')
assert(isNonEmptyString(batch.batch_code), 'batch_code manquant')
assert(batch.status === 'reviewed', 'le lot doit être marqué reviewed')
assert(isNonEmptyString(batch.target?.chapitre_id), 'chapitre_id manquant')
assert(isNonEmptyString(batch.target?.chapitre_code), 'chapitre_code manquant')
assert(isNonEmptyString(batch.target?.niveau), 'niveau scolaire manquant')
assert(isNonEmptyString(batch.target?.serie), 'série manquante')
assert(isNonEmptyString(batch.target?.matiere_slug), 'matiere_slug manquant')
assert(Number.isInteger(batch.target?.chapitre_ordre), 'chapitre_ordre invalide')
assert(batch.source?.droits_statut === 'reference_only', 'la source PDF doit rester reference_only')
assert(/^[a-f0-9]{64}$/.test(batch.source?.sha256 ?? ''), 'SHA-256 de source invalide')
assert(Array.isArray(batch.levels) && batch.levels.length === 3, 'exactement trois difficultés sont requises')

let exerciseCount = 0
let questionCount = 0

for (const [levelIndex, level] of batch.levels.entries()) {
  const expected = LEVELS[levelIndex]
  assert(level.palier === expected.palier, `difficulté ${levelIndex + 1}: palier attendu ${expected.palier}`)
  assert(level.libelle === expected.libelle, `${level.palier}: libellé attendu ${expected.libelle}`)
  assert(isNonEmptyString(level.titre), `${level.palier}: titre manquant`)
  assert(Array.isArray(level.exercises) && level.exercises.length === 3, `${level.palier}: exactement 3 exercices attendus`)

  for (const [exerciseIndex, exercise] of level.exercises.entries()) {
    const context = exercise.code ?? `${level.palier}/exercice-${exerciseIndex + 1}`
    assert(exercise.numero === exerciseIndex + 1, `${context}: numéro non séquentiel`)
    assert(isNonEmptyString(exercise.code) && !codes.has(exercise.code), `${context}: code invalide ou dupliqué`)
    codes.add(exercise.code)
    assert(isNonEmptyString(exercise.titre), `${context}: titre manquant`)
    assert(isNonEmptyString(exercise.consigne), `${context}: consigne manquante`)
    assert(Array.isArray(exercise.questions) && exercise.questions.length >= 2, `${context}: au moins 2 sous-questions attendues`)

    for (const [questionIndex, question] of exercise.questions.entries()) {
      const questionContext = `${context}/question-${questionIndex + 1}`
      assert(question.ordre === questionIndex + 1, `${questionContext}: ordre non séquentiel`)
      assert(isNonEmptyString(question.enonce_md), `${questionContext}: énoncé vide`)
      assert(isNonEmptyString(question.correction_md), `${questionContext}: correction vide`)
      assert(question.image_url == null || isNonEmptyString(question.image_url), `${questionContext}: image_url invalide`)
      assert(question.image_alt == null || isNonEmptyString(question.image_alt), `${questionContext}: image_alt invalide`)
      assert(!Object.hasOwn(question, 'type'), `${questionContext}: aucun type de réponse ne doit être demandé`)
      assert(!Object.hasOwn(question, 'choix'), `${questionContext}: aucun choix QCM ne doit être présent`)
      assert(!Object.hasOwn(question, 'bonnes_reponses'), `${questionContext}: aucun champ de réponse ne doit être présent`)
      questionCount += 1
    }
    exerciseCount += 1
  }
}

assert(exerciseCount === 9, 'un lot doit contenir exactement 9 exercices')

const batchHash = createHash('sha256')
  .update(JSON.stringify(stable(batch)))
  .digest('hex')

console.log(JSON.stringify({
  ok: true,
  batch_code: batch.batch_code,
  batch_sha256: batchHash,
  difficulties: batch.levels.map(({ palier, libelle }) => ({ palier, libelle })),
  exercises: exerciseCount,
  subquestions: questionCount,
  target: batch.target,
  source_rights: batch.source.droits_statut,
}, null, 2))
