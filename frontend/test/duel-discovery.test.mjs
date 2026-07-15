import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const root = resolve(frontend, '..')
const readFrontend = (path) => readFileSync(resolve(frontend, path), 'utf8')
const readRoot = (path) => readFileSync(resolve(root, path), 'utf8')

const page = readFrontend('src/pages/Defis.jsx')
const discovery = readRoot('supabase/migrations/2026071413_duel_discovery.sql')
const arena = readRoot('supabase/migrations/2026071411_duels_arene_v2.sql')

function sqlFunction(source, name) {
  const start = source.search(new RegExp(`create\\s+or\\s+replace\\s+function\\s+public\\.${name}\\s*\\(`, 'i'))
  if (start < 0) return ''
  const rest = source.slice(start)
  const next = rest.slice(1).search(/\ncreate\s+or\s+replace\s+function\s+public\./i)
  return next < 0 ? rest : rest.slice(0, next + 1)
}

test('le catalogue conserve toutes les leçons publiées et décrit leur disponibilité', () => {
  const catalogue = sqlFunction(discovery, 'get_duel_catalogue_v2')

  assert.match(catalogue, /from\s+public\.chapitres\s+c/i)
  assert.match(catalogue, /left\s+join\s+public\.quiz\s+qz/i)
  assert.match(catalogue, /left\s+join\s+public\.questions\s+qu/i)
  assert.match(catalogue, /c\.serie_id\s*=\s*v_profile\.serie_id/i)
  assert.match(catalogue, /c\.published\s*=\s*true/i)
  assert.match(catalogue, /'question_count'[\s\S]*'available'[\s\S]*'unavailable_reason'/i)
  assert.match(catalogue, /aucun_qcm_duel_publie/i)

  assert.match(page, /chapterIsAvailable/)
  assert.match(page, /is-unavailable/)
  assert.match(page, /disabled=\{!available\}/)
  assert.match(page, /unavailable_reason/)
  assert.match(page, /Aucun QCM compatible publié pour cette leçon/i)
})

test('sans sélection le serveur tire jusqu’à trois leçons disponibles', () => {
  const createDuel = sqlFunction(arena, 'create_defi_v2')

  assert.match(createDuel, /cardinality\(v_chapitre_ids\)\s*>\s*0/i)
  assert.match(createDuel, /order\s+by\s+random\(\)[\s\S]{0,120}limit\s+3/i)
  assert.match(createDuel, /jsonb_typeof\(qu\.choix\)\s*=\s*'array'/i)
  assert.match(createDuel, /jsonb_typeof\(qu\.bonnes_reponses\)\s*=\s*'string'/i)
  assert.match(page, /Jusqu'à 3 leçons disponibles tirées au sort/i)
})

test('la page recherche les adversaires avec un délai sans charger toute la classe', () => {
  const catalogue = sqlFunction(discovery, 'get_duel_catalogue_v2')

  assert.match(page, /rpc\('search_duel_opponents_v2'/)
  assert.match(page, /p_query:\s*query/)
  assert.match(page, /p_limit:\s*12/)
  assert.match(page, /setTimeout\([\s\S]{0,1000}350\)/)
  assert.match(page, /payload\.suggestions/)
  assert.match(page, /payload\.resultats/)
  assert.doesNotMatch(page, /from\(['"]profiles['"]\)|payload\.adversaires/)
  assert.match(catalogue, /'suggestions'/)
  assert.match(catalogue, /limit\s+6/i)
  assert.doesNotMatch(catalogue, /'adversaires'\s*,\s*v_adversaires/i)
})

test('la recherche serveur est bornée, accent-insensible et limitée à la même classe', () => {
  const search = sqlFunction(discovery, 'search_duel_opponents_v2')

  assert.match(discovery, /^begin;/im)
  assert.match(discovery, /^commit;/im)
  assert.match(search, /security\s+definer/i)
  assert.match(search, /set\s+search_path\s*=\s*pg_catalog\s*,\s*public/i)
  assert.match(search, /auth\.uid\(\)\s+is\s+null/i)
  assert.match(search, /p\.approuve/i)
  assert.match(search, /p\.id\s*<>\s*auth\.uid\(\)/i)
  assert.match(search, /p\.niveau_id\s*=\s*v_profile\.niveau_id/i)
  assert.match(search, /p\.serie_id\s*=\s*v_profile\.serie_id/i)
  assert.match(search, /translate\([\s\S]*lower\(/i)
  assert.equal(
    (search.match(/replace\(replace\(lower\([\s\S]{0,80}?'œ',\s*'oe'\),\s*'æ',\s*'ae'\)/gi) ?? []).length,
    3,
    'la saisie et les deux comparaisons doivent développer œ/æ sans perdre de lettre',
  )
  assert.match(search, /position\(v_query\s+in\s+translate/i)
  assert.match(search, /least\(greatest\(coalesce\(p_limit,\s*8\),\s*1\),\s*12\)/i)
  assert.match(discovery, /revoke\s+all\s+on\s+function\s+public\.search_duel_opponents_v2\(text,\s*integer\)[\s\S]{0,100}from\s+public,\s*anon,\s*authenticated/i)
  assert.match(discovery, /grant\s+execute\s+on\s+function\s+public\.search_duel_opponents_v2\(text,\s*integer\)\s+to\s+authenticated/i)
})
