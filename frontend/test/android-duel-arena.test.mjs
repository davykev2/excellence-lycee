import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const page = readFileSync(new URL('../src/pages/Defis.jsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/pages/AndroidDuel.css', import.meta.url), 'utf8')
const nativeApp = readFileSync(new URL('../src/lib/nativeApp.js', import.meta.url), 'utf8')
const navbar = readFileSync(new URL('../src/components/layout/Navbar.jsx', import.meta.url), 'utf8')
const protectedRoute = readFileSync(new URL('../src/components/layout/ProtectedRoute.jsx', import.meta.url), 'utf8')

test('la nouvelle arène remplace uniquement la page des duels sur Android', () => {
  assert.match(nativeApp, /isAndroidDuelExperience/)
  assert.match(nativeApp, /import\.meta\.env\.DEV/)
  assert.match(nativeApp, /android-duel-preview/)
  assert.match(navbar, /location\.pathname === '\/defis' && isAndroidDuelExperience\(\)/)
  assert.match(protectedRoute, /location\.pathname === '\/defis' && isAndroidDuelPreview\(\)/)
  assert.match(page, /document\.documentElement\.classList\.add\('is-android-duel'\)/)
})

test('les quatre états de l’expérience Android peuvent être contrôlés visuellement', () => {
  for (const mode of ['home', 'lobby', 'result']) {
    assert.match(page, new RegExp(`mode === ['"]${mode}['"]|mode \\|\\| '${mode}'`))
  }
  assert.match(page, /android-duel-preview'\) \|\| 'game'/)
  assert.match(page, /AndroidDuelTopbar/)
  assert.match(page, /LobbyScreen/)
  assert.match(page, /GameScreen/)
  assert.match(page, /ResultScreen/)
})

test('le combat Android garde les deux joueurs, le chrono et les compteurs', () => {
  assert.match(page, /Scoreboard/)
  assert.match(page, /TimerIcon/)
  assert.match(page, /CheckCircleIcon/)
  assert.match(page, /XCircleIcon/)
  assert.match(page, /remaining/)
  assert.match(page, /stats\.correct/)
  assert.match(page, /stats\.wrong/)
})

test('l’arène est plein écran, tactile et respecte les zones sûres', () => {
  assert.match(styles, /arena-excellence-night-v1\.png/)
  assert.match(styles, /min-height: 100dvh/)
  assert.match(styles, /var\(--app-safe-top\)/)
  assert.match(styles, /var\(--app-safe-bottom\)/)
  assert.match(styles, /min-height: 2\.75rem/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
})

test('les contrats serveur duels v2 restent la source de vérité', () => {
  for (const rpc of [
    'get_duel_catalogue_v2',
    'search_duel_opponents_v2',
    'create_defi_v2',
    'get_mes_defis_v2',
    'get_defi_questions_v2',
    'submit_defi_answer_v2',
    'finish_defi_v2',
  ]) {
    assert.match(page, new RegExp(`supabase\\.rpc\\('${rpc}'`))
  }
})
