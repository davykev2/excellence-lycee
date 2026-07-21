import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const read = (path) => readFileSync(resolve(frontend, path), 'utf8')

test('Capacitor embarque le build Vite sans charger le site Vercel dans une WebView distante', () => {
  const config = JSON.parse(read('capacitor.config.json'))
  const packageJson = JSON.parse(read('package.json'))

  assert.equal(config.appId, 'com.excellencelycee.app')
  assert.equal(config.appName, 'Excellence Lycée')
  assert.equal(config.webDir, 'dist')
  assert.equal(config.server?.url, undefined)
  assert.equal(config.plugins?.SystemBars?.insetsHandling, 'css')
  assert.ok(packageJson.dependencies['@capacitor/android'])
  assert.ok(packageJson.dependencies['@capacitor/app'])
  assert.match(packageJson.scripts['mobile:sync'], /vite build|npm run build/)
  assert.match(packageJson.scripts['mobile:sync'], /capacitor sync android/)
})

test('le pont Android gère le cycle de vie, les liens profonds et le bouton Retour', () => {
  const bridge = read('src/components/native/NativeAppBridge.jsx')
  const nativeApp = read('src/lib/nativeApp.js')
  const app = read('src/App.jsx')

  assert.match(app, /<NativeAppBridge\s*\/>/)
  assert.match(bridge, /appStateChange/)
  assert.match(bridge, /appUrlOpen/)
  assert.match(bridge, /getLaunchUrl/)
  assert.match(bridge, /backButton/)
  assert.match(bridge, /startAutoRefresh/)
  assert.match(bridge, /stopAutoRefresh/)
  assert.match(nativeApp, /excellencelycee:\/\/reset-password/)
  assert.match(nativeApp, /exchangeCodeForSession/)
})

test('la récupération de compte et les zones sûres sont compatibles avec Android', () => {
  const authStore = read('src/store/useAuthStore.js')
  const index = read('index.html')
  const styles = read('src/index.css')
  const manifest = read('android/app/src/main/AndroidManifest.xml')

  assert.match(authStore, /getPasswordResetRedirectUrl\(\)/)
  assert.doesNotMatch(authStore, /window\.location\.origin.*reset-password/)
  assert.match(index, /viewport-fit=cover/)
  assert.match(styles, /--app-safe-top/)
  assert.match(styles, /--app-safe-bottom/)
  assert.match(manifest, /android\.intent\.action\.VIEW/)
  assert.match(manifest, /android:host="reset-password"/)
  assert.match(manifest, /android:allowBackup="false"/)
  assert.match(manifest, /android:usesCleartextTraffic="false"/)
})

test('les secrets de signature Android restent exclus du projet', () => {
  const gitignore = read('.gitignore')

  assert.match(gitignore, /\*\.jks/)
  assert.match(gitignore, /\*\.keystore/)
  assert.match(gitignore, /keystore\.properties/)
})
