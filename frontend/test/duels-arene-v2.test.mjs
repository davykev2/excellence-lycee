import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const root = resolve(frontend, '..')
const readFrontend = (path) => readFileSync(resolve(frontend, path), 'utf8')
const readRoot = (path) => {
  try {
    return readFileSync(resolve(root, path), 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return ''
    throw error
  }
}

const page = readFrontend('src/pages/Defis.jsx')
const migration = readRoot('supabase/migrations/2026071411_duels_arene_v2.sql')

const rpcNames = [
  'get_duel_catalogue_v2',
  'create_defi_v2',
  'get_mes_defis_v2',
  'accept_defi_v2',
  'set_defi_ready_v2',
  'get_defi_questions_v2',
  'submit_defi_answer_v2',
  'finish_defi_v2',
  'get_defi_state_v2',
]

function sqlFunction(name) {
  const start = migration.search(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\s*\\(`, 'i'))
  if (start < 0) return ''
  const rest = migration.slice(start)
  const next = rest.slice(1).search(/\ncreate\s+or\s+replace\s+function\s+public\./i)
  return next < 0 ? rest : rest.slice(0, next + 1)
}

test('la création d’un duel accepte de zéro à trois leçons', () => {
  assert.match(page, /get_duel_catalogue_v2/)
  assert.match(page, /create_defi_v2/)
  assert.match(page, /p_(?:chapitre|lecon)_ids/)
  assert.match(page, /(?:0 à 3|jusqu['’]à 3|maximum 3|3 leçons)/i)
  assert.match(page, /(?:aléatoir|aucune leçon|toute la matière)/i)
  assert.match(page, /(?:MAX_(?:LECONS|LESSONS|CHAPITRES)\s*=\s*3|\.length\s*>=?\s*3|\.slice\(\s*0\s*,\s*3\s*\))/i)

  const createDuel = sqlFunction('create_defi_v2')
  assert.match(createDuel, /p_(?:chapitre|lecon)_ids\s+uuid\[\]/i)
  assert.match(createDuel, /(?:cardinality|array_length)[\s\S]{0,160}>\s*3/i)
  assert.match(createDuel, /(?:coalesce\s*\(\s*(?:cardinality|array_length)|'\{\}'\s*::\s*uuid\[\])/i)
})

test('l’interface utilise exclusivement le contrat RPC duel v2', () => {
  for (const name of rpcNames) {
    assert.match(migration, new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\s*\\(`, 'i'))
    assert.match(page, new RegExp(`supabase\\.rpc\\(\\s*['"]${name}['"]`))
  }

  assert.doesNotMatch(page, /supabase\.rpc\(\s*['"](?:create_defi|get_mes_defis|accept_defi|get_defi_questions|submit_defi)['"]\s*[,)]/)
})

test('l’arène affiche le HUD des deux joueurs et un chronomètre de 90 secondes', () => {
  assert.match(page, /(?:DUEL_DURATION_SECONDS|DUREE_DUEL|ARENA_DURATION)\s*=\s*90|90\s*(?:secondes|s\b)/i)
  assert.match(page, /(?:Joueur|Toi|Ton profil)/i)
  assert.match(page, /(?:Adversaire|Rival)/i)
  assert.match(page, /(?:Bonne(?:s)? réponse(?:s)?|Correct(?:es?)?)/i)
  assert.match(page, /(?:Mauvaise(?:s)? réponse(?:s)?|Erreur(?:s)?|Incorrect(?:es?)?)/i)
  assert.match(page, /Avatar/)
  assert.match(page, /(?:chrono|tempsRestant|remainingTime|timeLeft)/i)
})

test('la fin de manche distingue victoire, défaite et égalité', () => {
  assert.match(page, /Victoire/i)
  assert.match(page, /Défaite/i)
  assert.match(page, /Égalité|Match nul/i)
  assert.match(page, /(?:point(?:s)?|score)/i)
  assert.match(page, /finish_defi_v2/)

  const finalizer = sqlFunction('duel_v2_finaliser_match')
  assert.match(finalizer, /score_challenger\s*>\s*v_defi\.score_adversaire[\s\S]*v_defi\.challenger_id/i)
  assert.match(finalizer, /score_adversaire\s*>\s*v_defi\.score_challenger[\s\S]*v_defi\.adversaire_id/i)
  assert.match(finalizer, /else\s+null[\s\S]*gagnant_id\s*=\s*v_gagnant/i)
  assert.match(page, /scored\s*\?\s*`\$\{sides\.myStats\.score\}\s*–\s*\$\{sides\.opponentStats\.score\}`\s*:\s*'Sans points'/)
})

test('aucune correction ni bonne réponse n’est exposée au navigateur', () => {
  assert.doesNotMatch(page, /\.(?:bonne_reponse|reponse_correcte|correction|explication)\b/)

  const questions = sqlFunction('get_defi_questions_v2')
  const whitelist = /jsonb_build_object\s*\([\s\S]{0,2000}'(?:id|question_id)'[\s\S]{0,2000}'enonce'[\s\S]{0,2000}'choix'/i
  const explicitRemoval = /-\s*'(?:bonne_reponse|reponse_correcte|correction|explication)'/i
  assert.ok(whitelist.test(questions) || explicitRemoval.test(questions), 'get_defi_questions_v2 doit construire une question publique ou retirer explicitement la correction')
})

test('la migration duel est transactionnelle et durcit toutes les RPC', () => {
  assert.match(migration, /^begin;/im)
  assert.match(migration, /^commit;/im)

  for (const name of rpcNames) {
    const fn = sqlFunction(name)
    assert.match(fn, /security\s+definer/i, `${name} doit être SECURITY DEFINER`)
    assert.match(fn, /set\s+search_path\s*=\s*pg_catalog\s*,\s*public/i, `${name} doit fixer un search_path sûr`)
    assert.match(migration, new RegExp(`revoke\\s+all\\s+on\\s+function\\s+public\\.${name}\\s*\\([\\s\\S]{0,240}?from\\s+(?:public\\s*,\\s*anon|public|anon)`, 'i'), `${name} doit être révoquée pour les rôles publics`)
    assert.match(migration, new RegExp(`grant\\s+execute\\s+on\\s+function\\s+public\\.${name}\\s*\\([\\s\\S]{0,240}?to\\s+authenticated`, 'i'), `${name} doit être réservée aux utilisateurs connectés`)
  }
})

test('une seule réponse est acceptée par joueur et par question', () => {
  const uniqueConstraint = /unique\s*(?:index[\s\S]{0,240})?\(\s*defi_id\s*,\s*(?:user_id|participant_id|joueur_id)\s*,\s*(?:question_id|question_index)\s*\)/i
  const explicitGuard = /(?:reponse_deja_(?:donnee|soumise)|already_answered|on\s+conflict\s*\([\s\S]{0,160}(?:question_id|question_index)[\s\S]{0,80}do\s+nothing)/i
  assert.ok(uniqueConstraint.test(migration) || explicitGuard.test(migration), 'la base doit rendre chaque réponse de duel idempotente')

  const submit = sqlFunction('submit_defi_answer_v2')
  assert.match(submit, /for\s+update|on\s+conflict|reponse_deja|already_answered/i)
})

test('les invitations expirent après 48 heures', () => {
  assert.match(migration, /interval\s*'48\s+hours?'|interval\s*'2\s+days?'/i)
  assert.match(migration, /(?:expires_at|expire_at|expire_le|date_expiration)/i)
  assert.match(page, /(?:48\s*h|48\s*heures|expir)/i)
})

test('les deux joueurs partagent les questions et le fantôme rejoue les mêmes offsets', () => {
  assert.match(migration, /quiz_genere|questions_snapshot|question_ids/i)
  assert.match(migration, /(?:offset_ms|elapsed_ms|answered_after_ms|delai_ms|temps_reponse_ms)/i)
  assert.match(migration, /(?:fantome|ghost|reponses_adversaire|adversaire_reponses)/i)
  assert.match(page, /(?:fantôme|ghost)/i)
  assert.match(page, /(?:offset_ms|elapsed_ms|answered_after_ms|delai_ms|temps_reponse_ms)/i)
  assert.match(page, /(?:setTimeout|setInterval|requestAnimationFrame)/)
})

test('le compte à rebours serveur est respecté avant de charger les questions', () => {
  const questions = sqlFunction('get_defi_questions_v2')
  assert.match(questions, /clock_timestamp\(\)\s*<\s*v_start_at[\s\S]{0,120}duel_pas_encore_demarre/i)
  assert.match(page, /canPlay\s*&&\s*\(!startsAt\s*\|\|\s*new Date\(startsAt\)\.getTime\(\)\s*<=\s*Date\.now\(\)\)/)
})

test('le fantôme ne révèle aucun compteur futur avant son offset', () => {
  const stateBuilder = sqlFunction('duel_v2_construire_etat')
  assert.match(stateBuilder, /r\.offset_ms\s*<=\s*least/i)
  assert.match(stateBuilder, /v_opponent_json\s*:=\s*v_opponent_json\s*\|\|\s*jsonb_build_object\([\s\S]{0,500}'score'\s*,\s*0[\s\S]{0,500}'correctes'\s*,\s*v_visible_bonnes/i)
  assert.match(migration, /revoke\s+execute\s+on\s+function\s+public\.get_mes_defis\(\)\s+from\s+public\s*,\s*anon\s*,\s*authenticated/i)
})
