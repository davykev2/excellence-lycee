import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const root = resolve(frontend, '..')
const usersPage = readFileSync(resolve(frontend, 'src/pages/admin/Users.jsx'), 'utf8')
const signupPage = readFileSync(resolve(frontend, 'src/pages/auth/Signup.jsx'), 'utf8')
const dashboardPage = readFileSync(resolve(frontend, 'src/pages/Dashboard.jsx'), 'utf8')
const migration = readFileSync(resolve(root, 'supabase/migrations/2026071412_auto_approval_bulk.sql'), 'utf8')

test('les nouvelles inscriptions sont approuvées exclusivement côté serveur', () => {
  assert.match(migration, /^begin;/m)
  assert.match(migration, /^commit;/m)
  assert.match(migration, /alter column approuve set default true/)
  assert.match(migration, /create or replace function public\.handle_new_user\(\)/)
  assert.match(migration, /set search_path = pg_catalog, public/)
  assert.match(migration, /id, username, avatar_url, niveau_id, serie_id, etablissement, approuve/)
  assert.match(migration, /new\.raw_user_meta_data ->> 'etablissement',\s*true/s)
  assert.doesNotMatch(migration, /raw_user_meta_data ->> 'approuve'/)
  assert.match(migration, /revoke all on function public\.handle_new_user\(\) from public, anon, authenticated/)
  assert.match(signupPage, /accès aux contenus sera\s+activé automatiquement/)
  assert.doesNotMatch(signupPage, /admin devra approuver/i)
  assert.match(dashboardPage, /désapprouvé par l’administration/)
})

test('la RPC groupée est réservée aux admins et ne bloque jamais un administrateur', () => {
  assert.match(migration, /set_approbation_utilisateurs_admin_v1\(\s*p_approuve boolean/s)
  assert.match(migration, /v_caller_id uuid := auth\.uid\(\)/)
  assert.match(migration, /where p\.id = v_caller_id\s+for share of p/)
  assert.match(migration, /if not coalesce\(v_is_admin, false\) then raise exception 'admin_required'/)
  assert.match(migration, /where p\.is_admin = false[\s\S]*p\.approuve is distinct from p_approuve/)
  assert.match(migration, /p_approuve or p\.id <> v_caller_id/)
  assert.match(migration, /get diagnostics v_updated_count = row_count/)
  assert.match(migration, /'updated_count', v_updated_count/)
  assert.match(migration, /revoke all on function public\.set_approbation_utilisateurs_admin_v1\(boolean\)[\s\S]*from public, anon, authenticated/)
  assert.match(migration, /grant execute on function public\.set_approbation_utilisateurs_admin_v1\(boolean\)[\s\S]*to authenticated/)
})

test('la page utilisateurs confirme, compte et recharge les actions groupées', () => {
  assert.match(usersPage, /Tout approuver \(\{aApprouverCount\}\)/)
  assert.match(usersPage, /Tout désapprouver \(\{aDesapprouverCount\}\)/)
  assert.match(usersPage, /supabase\.rpc\('set_approbation_utilisateurs_admin_v1'/)
  assert.match(usersPage, /p_approuve: bulkDialog\.approuve/)
  assert.match(usersPage, /role="dialog"/)
  assert.match(usersPage, /aria-modal="true"/)
  assert.match(usersPage, /Confirmation requise/)
  assert.match(usersPage, /Application en cours…/)
  assert.match(usersPage, /data\?\.updated_count/)
  assert.match(usersPage, /await charger\(false\)/)
  assert.match(usersPage, /Les comptes administrateurs et votre propre compte sont protégés/)

  // Les commandes unitaires historiques restent disponibles.
  assert.match(usersPage, /async function toggleApprouve/)
  assert.match(usersPage, /user\.approuve \? 'Bloquer' : 'Approuver'/)
  assert.match(usersPage, /async function toggleAdmin/)
})
