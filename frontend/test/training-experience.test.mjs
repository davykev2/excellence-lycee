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

test('le bouton Entraînement existe uniquement dans la navigation desktop', () => {
  const navbar = readFrontend('src/components/layout/Navbar.jsx')

  assert.match(navbar, /<nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex">/)
  assert.match(navbar, /aria-haspopup="menu"/)
  assert.match(navbar, />\s*Entraînement\s*</)
  assert.equal((navbar.match(/>\s*Entraînement\s*</g) ?? []).length, 1)
})

test('chaque leçon propose trois niveaux et des exercices guidés sans champ de réponse', () => {
  const chapitre = readFrontend('src/pages/Chapitre.jsx')
  const entrainement = readFrontend('src/pages/Entrainement.jsx')
  const app = readFrontend('src/App.jsx')

  assert.match(app, /\/entrainement\/:chapitreId\/:palier/)
  assert.match(chapitre, /label: 'Facile'/)
  assert.match(chapitre, /label: 'Moyen'/)
  assert.match(chapitre, /label: 'Difficile'/)
  assert.match(chapitre, /get_niveaux_exercices_chapitre_v2/)
  assert.doesNotMatch(chapitre, /EXERCICES_PAR_NIVEAU|EXERCICES_PAR_LECON/)
  assert.match(chapitre, /Exercices en préparation/)
  assert.match(chapitre, /Chaque niveau deviendra cliquable dès sa mise en ligne/)
  assert.match(chapitre, /niveau\.valides\}\/\$\{niveau\.totalPublie\}/)
  assert.match(chapitre, /setEntrainementError\(Boolean\(niveauxError\)\)/)
  assert.match(entrainement, /Aucun point, aucune note/)
  assert.match(entrainement, /J’ai terminé — voir la correction/)
  assert.match(entrainement, /rpc\('get_exercices_entrainement_v2'/)
  assert.match(entrainement, /rpc\('terminer_exercice_entrainement_v2'/)
  assert.match(entrainement, /question\.enonce_md/)
  assert.match(entrainement, /question\.correction_md/)
  assert.doesNotMatch(entrainement, /QuestionCard|<input|type="radio"|type="checkbox"/)
})

test('les cartes de leçon sont carrées et affichent la progression serveur', () => {
  const matiere = readFrontend('src/pages/Matiere.jsx')
  const ring = readFrontend('src/components/ui/ProgressRing.jsx')

  assert.match(matiere, /grid grid-cols-2/)
  assert.match(matiere, /aspect-square/)
  assert.match(matiere, /get_progression_exercices_matiere_v2/)
  assert.doesNotMatch(matiere, /EXERCICES_PAR_LECON/)
  assert.match(matiere, /progression\?\.chapitres/)
  assert.match(matiere, /valides \/ total/)
  assert.match(matiere, /progression\.valides\}\/\{progression\.total/)
  assert.match(matiere, /<ProgressRing value=\{progression\.pourcentage\}/)
  assert.match(ring, /role="progressbar"/)
  assert.match(ring, /conic-gradient/)
})

test('Supabase sépare les exercices des quiz notés et protège la correction', () => {
  const migration = readRoot('supabase/migrations/2026071404_entrainement_non_note.sql')

  assert.match(migration, /^begin;/m)
  assert.match(migration, /^commit;/m)
  assert.match(migration, /add column if not exists est_note boolean not null default true/)
  assert.match(migration, /set est_note = false[\s\S]*where palier is not null/)
  assert.match(migration, /update public\.tentatives t[\s\S]*set note = null[\s\S]*and not q\.est_note/)
  assert.match(migration, /if not v_quiz\.est_note or v_quiz\.palier is not null then[\s\S]*utiliser_entrainement_rpc/)
  assert.match(migration, /create or replace function public\.valider_exercice_entrainement/)
  assert.match(migration, /when vr\.reponse_id is null then null[\s\S]*'bonnes_reponses'/)
  assert.match(migration, /if not coalesce\(v_est_note, true\) then[\s\S]*'note', null/)
  assert.match(migration, /date_fin_theorique \+ interval '10 seconds'/)
  assert.match(migration, /create or replace function public\.check_and_award_badges[\s\S]*q\.est_note/)
  assert.match(migration, /create or replace function public\.get_tentative_resultat[\s\S]*utiliser_entrainement_rpc/)
  assert.match(migration, /create or replace function public\.importer_lot_exercices[\s\S]*and not est_note[\s\S]*explication_requise/)
  assert.match(migration, /if p_palier is null[\s\S]*palier_invalide/)
  assert.match(migration, /notify pgrst, 'reload schema'/)
})

test('le moteur guide v2 valide un exercice entier sans reponse ni note', () => {
  const migration = readRoot('supabase/migrations/2026071405_exercices_guides.sql')
  const variableMigration = readRoot(
    'supabase/migrations/2026071407_exercices_guides_nombre_variable.sql',
  )
  const entrainement = readFrontend('src/pages/Entrainement.jsx')

  assert.match(migration, /^begin;/m)
  assert.match(migration, /^commit;/m)
  assert.match(migration, /create table if not exists public\.packs_entrainement/)
  assert.match(migration, /create table if not exists public\.exercices_entrainement/)
  assert.match(migration, /create table if not exists public\.questions_exercice/)
  assert.match(migration, /create table if not exists public\.exercices_termines/)
  assert.match(
    variableMigration,
    /add constraint exercices_entrainement_numero_positive check \(numero > 0\)/,
  )
  assert.match(migration, /create or replace function public\.get_exercices_entrainement_v2/)
  assert.match(migration, /'correction_md', case[\s\S]*when et\.user_id is null then null/)
  assert.match(migration, /create or replace function public\.terminer_exercice_entrainement_v2\(\s*p_exercice_id uuid\s*\)/)
  assert.match(migration, /insert into public\.exercices_termines\(user_id, exercice_id\)/)
  assert.match(migration, /'corrections', v_correction/)
  assert.match(migration, /create or replace function public\.importer_lot_exercices_v2/)
  assert.match(migration, /jsonb_array_length\(p_lot -> 'levels'\) <> 3/)
  assert.match(migration, /champ_interactif_interdit/)
  assert.match(
    variableMigration,
    /jsonb_array_length\(v_level_json -> 'exercises'\) < 1/,
  )
  assert.match(variableMigration, /v_max_ordre <> v_array_count/)
  assert.match(variableMigration, /'exercise_count', v_exercice_count/)
  assert.doesNotMatch(entrainement, /slice\(0,\s*3\)|EXERCICES_PAR_NIVEAU/)
  assert.match(entrainement, /exercices\.length/)

  const completionRpc = migration.match(
    /create or replace function public\.terminer_exercice_entrainement_v2[\s\S]*?\$\$;/,
  )?.[0] ?? ''
  assert.doesNotMatch(
    completionRpc,
    /p_choix|tentatives|reponses|points_carriere|check_and_award_badges/,
  )
})
