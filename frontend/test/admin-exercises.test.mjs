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

test('l’admin dispose d’un atelier complet de publication des exercices guidés', () => {
  const app = readFrontend('src/App.jsx')
  const layout = readFrontend('src/components/layout/AdminLayout.jsx')
  const editor = readFrontend('src/pages/admin/ExercicesGuides.jsx')

  assert.match(app, /exercices-guides\/:chapitreId/)
  assert.match(layout, /Exercices/)
  assert.match(editor, /Facile/)
  assert.match(editor, /Moyen/)
  assert.match(editor, /Difficile/)
  assert.match(editor, /Correction complète/)
  assert.match(editor, /Aperçu élève/)
  assert.match(editor, /normalizeMathMarkdown/)
  assert.match(editor, /publier_exercices_admin_v3/)
  assert.match(editor, /base_exercice_id/)
  assert.match(editor, /content_hash/)
  assert.match(editor, /noteModification/)
  assert.match(editor, /Ajouter un exercice/)
  assert.match(editor, /Supprimer cet exercice/)
  assert.match(editor, /Enregistrer les modifications/)
  assert.match(editor, /relative z-10[\s\S]*lg:sticky lg:bottom-3/)
  assert.doesNotMatch(editor, /className="sticky bottom-20/)
})

test('la publication admin reste contrôlée et atomique côté Supabase', () => {
  const migration = readRoot('supabase/migrations/2026071408_exercices_edition_intelligente.sql')
  const variableMigration = readRoot(
    'supabase/migrations/2026071407_exercices_guides_nombre_variable.sql',
  )

  assert.match(migration, /^begin;/m)
  assert.match(migration, /^commit;/m)
  assert.match(migration, /security definer/)
  assert.match(migration, /if not public\.is_admin\(\)/)
  assert.match(migration, /p_publication_id uuid/)
  assert.match(migration, /publier_exercices_admin_v3/)
  assert.match(migration, /contenu_modifie_ailleurs/)
  assert.match(migration, /progress_hash/)
  assert.match(migration, /content_hash/)
  assert.match(migration, /trg_verrouiller_progression_exercice/)
  assert.match(migration, /for share of p/)
  assert.match(migration, /for update of p/)
  assert.match(migration, /exercices_termines/)
  assert.match(migration, /grant execute[\s\S]*to authenticated/)
  assert.match(migration, /contenu_trop_volumineux/)
  assert.match(variableMigration, /raise exception 'exercice_requis/)
  assert.match(
    variableMigration,
    /exercices_entrainement_numero_positive check \(numero > 0\)/,
  )
  assert.match(variableMigration, /v_max_ordre <> v_array_count/)
  assert.doesNotMatch(variableMigration, /trois_exercices_requis/)
})
