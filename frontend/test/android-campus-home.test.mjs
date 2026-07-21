import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const app = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8')
const navbar = readFileSync(new URL('../src/components/layout/Navbar.jsx', import.meta.url), 'utf8')
const campus = readFileSync(new URL('../src/pages/AndroidDashboard.jsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/pages/AndroidDashboard.css', import.meta.url), 'utf8')
const nativeApp = readFileSync(new URL('../src/lib/nativeApp.js', import.meta.url), 'utf8')

test('le campus remplace uniquement l’accueil Android et dispose d’un aperçu de développement borné', () => {
  assert.match(app, /isAndroidHomeExperience\(\) \? <AndroidDashboard \/> : <Dashboard \/>/)
  assert.match(nativeApp, /import\.meta\.env\.DEV/)
  assert.match(nativeApp, /android-preview/)
  assert.match(nativeApp, /isAndroidHomePreview/)
  assert.match(navbar, /location\.pathname === '\/dashboard' && isAndroidHomeExperience\(\)/)
})

test('les bâtiments permanents ouvrent toutes les expériences pédagogiques', () => {
  for (const route of ['/resumes', '/exercices', '/devoirs', '/quiz-rapide', '/defis', '/competitions']) {
    assert.match(campus, new RegExp(route.replace('/', '\\/')))
  }
  assert.doesNotMatch(campus, /upgrade|améliorer le bâtiment|niveau du bâtiment/i)
})

test('l’enveloppe Courrier ouvre la messagerie privée et affiche les non-lus réels', () => {
  assert.match(campus, /EnvelopeSimpleIcon/)
  assert.match(campus, /\/communaute\?tab=mp/)
  assert.match(campus, /from\('messages_prives'\)/)
  assert.match(campus, /\.eq\('lu', false\)/)
  assert.match(campus, /count > 99 \? '99\+' : count/)
})

test('l’écran de jeu reste plein écran, tactile et respectueux des zones sûres', () => {
  assert.match(styles, /height: 100dvh/)
  assert.match(styles, /var\(--safe-area-inset-top\)/)
  assert.match(styles, /var\(--safe-area-inset-bottom\)/)
  assert.match(styles, /min-height: 3\.25rem/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
})
