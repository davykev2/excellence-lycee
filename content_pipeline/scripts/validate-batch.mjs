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

const input = resolve(process.argv[2] ?? '')
if (!process.argv[2]) fail('Usage: node validate-batch.mjs <batch.json>')

const raw = await readFile(input, 'utf8')
const batch = JSON.parse(raw)
const codes = new Set()

assert(batch.schema_version === 1, 'schema_version doit valoir 1')
assert(isNonEmptyString(batch.batch_code), 'batch_code manquant')
assert(batch.status === 'reviewed', 'le lot doit être marqué reviewed')
assert(isNonEmptyString(batch.target?.chapitre_id), 'chapitre_id manquant')
assert(isNonEmptyString(batch.target?.chapitre_code), 'chapitre_code manquant')
assert(batch.source?.droits_statut === 'reference_only', 'la source PDF doit rester reference_only')
assert(/^[a-f0-9]{64}$/.test(batch.source?.sha256 ?? ''), 'SHA-256 de source invalide')
assert(Array.isArray(batch.quizzes) && batch.quizzes.length === 3, 'un chapitre doit contenir exactement 3 quiz')

let questionCount = 0
for (const [quizIndex, quiz] of batch.quizzes.entries()) {
  const expectedNumber = quizIndex + 1
  assert(quiz.numero === expectedNumber, `${quiz.code}: numero attendu ${expectedNumber}`)
  assert(['entrainement', 'maitrise', 'concours'].includes(quiz.palier), `${quiz.code}: palier invalide`)
  assert(isNonEmptyString(quiz.code) && !codes.has(quiz.code), `${quiz.code}: code de quiz invalide ou dupliqué`)
  codes.add(quiz.code)
  assert(Array.isArray(quiz.questions) && quiz.questions.length === 5, `${quiz.code}: exactement 5 questions attendues`)

  for (const [questionIndex, question] of quiz.questions.entries()) {
    const context = question.code ?? `${quiz.code}/question-${questionIndex + 1}`
    assert(question.ordre === questionIndex + 1, `${context}: ordre non séquentiel`)
    assert(isNonEmptyString(question.code) && !codes.has(question.code), `${context}: code invalide ou dupliqué`)
    codes.add(question.code)
    assert(['qcm', 'texte'].includes(question.type), `${context}: type invalide`)
    assert(isNonEmptyString(question.enonce), `${context}: énoncé vide`)
    assert(isNonEmptyString(question.explication), `${context}: explication vide`)
    assert(Number.isInteger(question.points) && question.points > 0, `${context}: points invalides`)
    assert(Number.isInteger(question.difficulte) && question.difficulte >= 1 && question.difficulte <= 3, `${context}: difficulté invalide`)
    assert(question.origine === 'originale', `${context}: origine non originale`)
    assert(isNonEmptyString(question.licence_code), `${context}: licence_code manquant`)

    if (question.type === 'qcm') {
      assert(Array.isArray(question.choix) && question.choix.length >= 2, `${context}: choix QCM invalides`)
      assert(question.choix.every(isNonEmptyString), `${context}: un choix est vide`)
      assert(new Set(question.choix).size === question.choix.length, `${context}: choix dupliqués`)
      assert(typeof question.bonnes_reponses === 'string', `${context}: la bonne réponse QCM doit être une chaîne`)
      assert(question.choix.includes(question.bonnes_reponses), `${context}: la bonne réponse ne figure pas dans les choix`)
    } else {
      assert(question.choix === null, `${context}: choix doit être null pour une réponse libre`)
      assert(Array.isArray(question.bonnes_reponses) && question.bonnes_reponses.length > 0, `${context}: variantes de réponse manquantes`)
      assert(question.bonnes_reponses.every(isNonEmptyString), `${context}: variante de réponse vide`)
    }
    questionCount += 1
  }
}

const canonical = JSON.stringify(stable(batch))
const batchHash = createHash('sha256').update(canonical).digest('hex')

console.log(JSON.stringify({
  ok: true,
  batch_code: batch.batch_code,
  batch_sha256: batchHash,
  quizzes: batch.quizzes.length,
  questions: questionCount,
  target: batch.target,
  source_rights: batch.source.droits_statut,
}, null, 2))
