import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const root = resolve(frontend, '..')

const read = (path) => readFileSync(resolve(root, path), 'utf8')

test('le quiz rapide est corrigé par les RPC serveur', () => {
  const page = read('frontend/src/pages/QuizRapide.jsx')
  const schema = read('supabase/schema.sql')

  assert.match(page, /rpc\('get_quiz_rapide_question'/)
  assert.match(page, /rpc\('submit_quiz_rapide'/)
  assert.doesNotMatch(page, /quiz_add_result|genererQuestion|bonneReponse/)
  assert.match(schema, /drop function if exists public\.quiz_add_result\(uuid, boolean\)/)
  assert.match(schema, /where c\.id = p_challenge_id and c\.user_id = auth\.uid\(\)[\s\S]*for update/)
})

test('les réponses des défis ne sont plus lues directement', () => {
  const page = read('frontend/src/pages/Defis.jsx')
  const schema = read('supabase/schema.sql')
  const migration = read('supabase/migrations/2026071411_duels_arene_v2.sql')

  assert.match(page, /rpc\('get_mes_defis_v2'/)
  assert.match(page, /rpc\('get_defi_questions_v2'/)
  assert.doesNotMatch(page, /from\(['"]defis['"]\)|quiz_genere|p_temps_sec/)
  assert.match(schema, /revoke select on public\.defis from anon, authenticated/)

  const legacyFunctions = [
    'get_mes_defis\\(\\)',
    'create_defi\\(uuid, uuid\\)',
    'accept_defi\\(uuid\\)',
    'get_defi_questions\\(uuid\\)',
    'submit_defi\\(uuid, jsonb\\)',
  ]
  for (const signature of legacyFunctions) {
    assert.match(
      migration,
      new RegExp(`revoke\\s+execute\\s+on\\s+function\\s+public\\.${signature}\\s+from\\s+public\\s*,\\s*anon\\s*,\\s*authenticated`, 'i'),
    )
  }

  const publicV2Functions = [
    'get_duel_catalogue_v2\\(uuid\\)',
    'create_defi_v2\\(uuid, uuid, uuid\\[\\]\\)',
    'get_mes_defis_v2\\(\\)',
    'accept_defi_v2\\(uuid\\)',
    'set_defi_ready_v2\\(uuid, boolean\\)',
    'get_defi_questions_v2\\(uuid\\)',
    'submit_defi_answer_v2\\(uuid, uuid, jsonb\\)',
    'finish_defi_v2\\(uuid\\)',
    'get_defi_state_v2\\(uuid\\)',
  ]
  for (const signature of publicV2Functions) {
    assert.match(
      migration,
      new RegExp(`grant\\s+execute\\s+on\\s+function\\s+public\\.${signature}\\s+to\\s+authenticated`, 'i'),
    )
  }
})

test('les soumissions de devoir sont atomiques et limitées dans le temps', () => {
  const schema = read('supabase/schema.sql')

  assert.match(schema, /uniq_reponses_tentative_question/)
  assert.match(schema, /date_fin_theorique \+ interval '10 seconds'/)
  assert.match(schema, /where id = p_tentative_id and user_id = auth\.uid\(\)[\s\S]*for update/)
})

test('la migration de sécurité est complète et transactionnelle', () => {
  const migration = read('supabase/migrations/2026071201_security_hardening.sql')

  assert.match(migration, /^begin;/m)
  assert.match(migration, /^commit;/m)
  assert.doesNotMatch(migration, /__[A-Z_]+__/)
  assert.match(migration, /alter column user_id set default auth\.uid\(\)/)
  assert.match(migration, /notify pgrst, 'reload schema'/)
})
