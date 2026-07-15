import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const badges = readFileSync(new URL('../src/pages/Badges.jsx', import.meta.url), 'utf8')
const androidBadges = readFileSync(new URL('../src/pages/AndroidBadges.jsx', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../src/pages/AndroidBadges.css', import.meta.url), 'utf8')
const nativeApp = readFileSync(new URL('../src/lib/nativeApp.js', import.meta.url), 'utf8')
const navbar = readFileSync(new URL('../src/components/layout/Navbar.jsx', import.meta.url), 'utf8')
const protectedRoute = readFileSync(new URL('../src/components/layout/ProtectedRoute.jsx', import.meta.url), 'utf8')

test('la salle des distinctions remplace uniquement la page Badges sur Android', () => {
  assert.match(nativeApp, /isAndroidBadgeExperience/)
  assert.match(nativeApp, /import\.meta\.env\.DEV/)
  assert.match(nativeApp, /android-badge-preview/)
  assert.match(navbar, /location\.pathname === '\/badges' && isAndroidBadgeExperience\(\)/)
  assert.match(protectedRoute, /location\.pathname === '\/badges' && isAndroidBadgePreview\(\)/)
  assert.match(androidBadges, /classList\.add\('is-android-badges'\)/)
  assert.match(badges, /<AndroidBadges/)
  assert.match(badges, /<BadgeChip/)
})

test('la collection Android consomme les vrais badges et leurs obtentions', () => {
  assert.match(badges, /from\('badges'\)\.select\('\*'\)/)
  assert.match(badges, /from\('user_badges'\)/)
  assert.match(androidBadges, /badges\.filter/)
  assert.match(androidBadges, /obtainedIds\.has\(badge\.id\)/)
  assert.match(androidBadges, /BADGE_CATEGORIES/)
  assert.match(androidBadges, /LockKeyIcon/)
})

test('le chat global affiche les derniers messages du niveau et écoute le direct', () => {
  assert.match(androidBadges, /from\('chat_global'\)/)
  assert.match(androidBadges, /profiles\(username\)/)
  assert.match(androidBadges, /\.eq\('niveau_id', profile\.niveau_id\)/)
  assert.match(androidBadges, /'postgres_changes'/)
  assert.match(androidBadges, /event: 'INSERT'/)
  assert.match(androidBadges, /filter: `niveau_id=eq\.\$\{profile\.niveau_id\}`/)
  assert.match(androidBadges, /messages\.slice\(-2\)/)
  assert.match(androidBadges, /to="\/communaute"/)
})

test('la grille et le chat restent ancrés au dock sur les écrans Android', () => {
  assert.match(styles, /height: 100dvh/)
  assert.match(styles, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\)/)
  assert.match(styles, /grid-template-columns: repeat\(5, minmax\(0, 1fr\)\)/)
  assert.match(androidBadges, /badge-vault-night-v1\.png/)
  assert.match(styles, /var\(--app-safe-top\)/)
  assert.match(styles, /var\(--app-safe-bottom\)/)
  assert.match(styles, /prefers-reduced-motion: reduce/)
})
