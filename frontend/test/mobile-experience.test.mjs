import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const here = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(here, '..')
const read = (path) => readFileSync(resolve(frontend, path), 'utf8')

test('le dock mobile respecte l’ordre demandé et boucle réellement', () => {
  const dock = read('src/components/layout/MobileGameDock.jsx')
  const styles = read('src/index.css')
  const labels = [...dock.matchAll(/label: '([^']+)'/g)].map((match) => match[1])

  assert.deepEqual(labels, [
    'Accueil',
    'Cours',
    'Exercices',
    'Devoirs',
    'Éclair',
    'Duels',
    'Compétitions',
  ])
  assert.match(dock, /loop: true/)
  assert.match(dock, /dragFree: false/)
  assert.match(dock, /skipSnaps: false/)
  assert.match(dock, /selectedScrollSnap\(\)/)
  assert.match(dock, /mobile-game-dock__magnet/)
  assert.doesNotMatch(dock, /featured/)
  assert.match(styles, /\.mobile-game-dock__link\s*\{[\s\S]*flex: 0 0 20%/)
  assert.match(styles, /\.mobile-game-dock__magnet\s*\{[\s\S]*left: 50%[\s\S]*width: 20%/)
})

test('le retour audio ne contient plus de musique ni de planificateur', () => {
  const audio = read('src/lib/audioFeedback.js')
  const provider = read('src/components/gamification/AudioFeedbackProvider.jsx')
  const app = read('src/App.jsx')
  const toggle = read('src/components/gamification/AudioToggle.jsx')

  assert.doesNotMatch(audio, /BACKGROUND_MUSIC|MUSIC_MELODY|musicGain|MusicVoice/)
  assert.doesNotMatch(audio, /setBackgroundMusicEnabled|scheduleBackgroundMusic|setTimeout/)
  assert.doesNotMatch(provider, /backgroundMusic|VisibilityListener/)
  assert.doesNotMatch(app, /backgroundMusicEnabled/)
  assert.match(app, /<AudioFeedbackProvider\s*\/>/)
  assert.doesNotMatch(toggle, /musique/i)
  assert.match(toggle, /Activer les sons/)
  assert.match(toggle, /Désactiver les sons/)
})

test('les sons courts de clic restent actifs et respectent la mise en sourdine', async () => {
  const counters = { starts: 0, stops: 0 }
  class FakeParam {
    setTargetAtTime() {}
    setValueAtTime() {}
    exponentialRampToValueAtTime() {}
  }
  class FakeAudioNode {
    connect() { return this }
  }
  class FakeOscillator extends FakeAudioNode {
    constructor() {
      super()
      this.frequency = new FakeParam()
    }
    start() { counters.starts += 1 }
    stop() { counters.stops += 1 }
  }
  class FakeAudioContext {
    constructor() {
      this.currentTime = 0
      this.destination = new FakeAudioNode()
      this.state = 'running'
    }
    createGain() {
      return Object.assign(new FakeAudioNode(), { gain: new FakeParam() })
    }
    createOscillator() { return new FakeOscillator() }
    async resume() { this.state = 'running' }
  }

  globalThis.window = {
    AudioContext: FakeAudioContext,
    matchMedia: () => ({ matches: false }),
  }
  globalThis.document = { visibilityState: 'visible' }

  try {
    const audio = await import(`../src/lib/audioFeedback.js?test=${Date.now()}`)
    assert.equal(await audio.unlockAudioFeedback(), true)
    assert.equal(counters.starts, 0, 'aucun son continu ne démarre au déverrouillage')

    assert.equal(audio.playAudioFeedback('click'), true)
    assert.equal(counters.starts, 1)
    assert.equal(counters.stops, 1)

    audio.setAudioFeedbackMuted(true)
    assert.equal(audio.playAudioFeedback('click'), false)
    assert.equal(counters.starts, 1)

    audio.setAudioFeedbackMuted(false)
    assert.equal(audio.playAudioFeedback('click'), true)
    assert.equal(counters.starts, 2)
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})
