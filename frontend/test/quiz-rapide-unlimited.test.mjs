import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const root = resolve(frontend, '..')
const page = readFileSync(resolve(frontend, 'src/pages/QuizRapide.jsx'), 'utf8')
const migration = readFileSync(
  resolve(root, 'supabase/migrations/2026071414_quiz_rapide_unlimited.sql'),
  'utf8',
)

function sqlFunction(name) {
  const start = migration.search(
    new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\s*\\(`, 'i'),
  )
  if (start < 0) return ''
  const rest = migration.slice(start)
  const next = rest.slice(1).search(/\ncreate\s+or\s+replace\s+function\s+public\./i)
  return next < 0 ? rest : rest.slice(0, next + 1)
}

const getQuestion = sqlFunction('get_quiz_rapide_question')
const submitAnswer = sqlFunction('submit_quiz_rapide')
const qualityPredicate = sqlFunction('quiz_rapide_question_est_eligible_v2')

test('le quiz rapide ne contient plus de quota de session ou de découverte', () => {
  assert.doesNotMatch(submitAnswer, /quota_decouverte|limite_decouverte|decouverte_quiz_rapide_limite/i)
  assert.match(
    migration,
    /delete\s+from\s+public\.app_settings\s+where\s+cle\s*=\s*'decouverte_quiz_rapide_limite'/i,
  )
  assert.doesNotMatch(page, /quota_decouverte|limite du quiz rapide|setBloque|\bbloque\b/i)
  assert.match(page, /∞ Mode continu/)
  assert.match(page, /joue sans limite/i)
  assert.match(page, /Question suivante/)
})

test('la sélection privilégie les inédites puis recycle la moins récemment vue', () => {
  assert.match(getQuestion, /left\s+join\s+lateral[\s\S]*max\(c\.created_at\)/i)
  assert.match(getQuestion, /case\s+when\s+historique\.derniere_vue_at\s+is\s+null\s+then\s+0\s+else\s+1/i)
  assert.match(getQuestion, /historique\.derniere_vue_at\s+asc\s+nulls\s+first/i)
  assert.match(getQuestion, /cycle_recommence/i)
  assert.match(getQuestion, /delete\s+from\s+public\.quiz_rapide_challenges[\s\S]*answered_at\s+is\s+null/i)
})

test('la banque active ne sert que des QCM publiés et pédagogiquement valides', () => {
  assert.match(qualityPredicate, /jsonb_array_length\(p_choix\)\s+not\s+between\s+2\s+and\s+6/i)
  assert.match(qualityPredicate, /count\(distinct\s+lower\(btrim/i)
  assert.match(qualityPredicate, /where\s+choice\.value\s*=\s*p_bonne_reponse/i)
  assert.match(qualityPredicate, /p_explication[\s\S]*between\s+20\s+and\s+3000/i)
  assert.match(getQuestion, /q\.active\s*=\s*true/i)
  assert.match(getQuestion, /quiz_rapide_question_est_eligible_v2/i)
  assert.match(migration, /quiz_rapide_questions_actives_invalides/i)
  assert.match(migration, /quiz_rapide_explications_manquantes_total/i)
})

test('chaque matière seedée possède six questions originales expliquées', () => {
  const prefixes = ['maths', 'pc', 'svt', 'fr', 'en', 'hg', 'philo', 'es']
  for (const prefix of prefixes) {
    for (let index = 1; index <= 6; index += 1) {
      const code = `${prefix}-${String(index).padStart(2, '0')}`
      assert.match(migration, new RegExp(`['"]${code}['"]`), `${code} doit être présent`)
    }
  }
  assert.match(migration, /if\s+v_valides\s*<\s*6\s+then/i)
  assert.match(migration, /on\s+conflict\s*\(code\)\s+do\s+update/i)
})

test('la bonne réponse et la justification ne quittent le serveur qu’après validation', () => {
  const getReturn = getQuestion.slice(getQuestion.lastIndexOf('return jsonb_build_object'))
  assert.doesNotMatch(getReturn, /'bonne_reponse'|'explication'|'justification'/i)
  assert.match(submitAnswer, /for\s+update/i)
  assert.match(submitAnswer, /'bonne_reponse'\s*,\s*v_question\.bonne_reponse/i)
  assert.match(submitAnswer, /'justification'\s*,\s*v_question\.explication/i)
  assert.match(page, /data\.justification\s*\?\?\s*data\.explication/)
  assert.match(page, /Pourquoi \? — Justification pédagogique/)
})

test('les RPC sont sérialisées, durcies et réservées aux utilisateurs authentifiés', () => {
  for (const fn of [getQuestion, submitAnswer]) {
    assert.match(fn, /security\s+definer/i)
    assert.match(fn, /set\s+search_path\s*=\s*pg_catalog\s*,\s*public/i)
    assert.match(fn, /pg_advisory_xact_lock/i)
    assert.match(fn, /auth\.uid\(\)\s+is\s+null/i)
  }

  for (const signature of [
    'get_quiz_rapide_question\\(uuid\\)',
    'submit_quiz_rapide\\(uuid, text\\)',
  ]) {
    assert.match(
      migration,
      new RegExp(`revoke\\s+all\\s+on\\s+function\\s+public\\.${signature}[\\s\\S]{0,160}from\\s+public\\s*,\\s*anon\\s*,\\s*authenticated`, 'i'),
    )
    assert.match(
      migration,
      new RegExp(`grant\\s+execute\\s+on\\s+function\\s+public\\.${signature}[\\s\\S]{0,100}to\\s+authenticated`, 'i'),
    )
  }
  assert.match(migration, /^begin;/im)
  assert.match(migration, /^commit;/im)
})
