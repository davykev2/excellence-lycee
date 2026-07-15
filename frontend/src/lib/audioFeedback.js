const DEFAULT_VOLUME = 0.12

export const AUDIO_FEEDBACK_TYPES = Object.freeze([
  'click',
  'success',
  'error',
  'levelUp',
  'notification',
])

let audioContext = null
let masterGain = null
let activated = false
let muted = false
const stateListeners = new Set()

function getAudioContextConstructor() {
  if (typeof window === 'undefined') return null
  return window.AudioContext || window.webkitAudioContext || null
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function currentState() {
  return {
    activated,
    muted,
    reducedMotion: prefersReducedMotion(),
    supported: Boolean(getAudioContextConstructor()),
  }
}

function emitState() {
  const state = currentState()
  stateListeners.forEach((listener) => listener(state))
}

function syncMasterVolume() {
  if (!audioContext) return
  const volume = muted ? 0 : DEFAULT_VOLUME
  masterGain?.gain.setTargetAtTime(volume, audioContext.currentTime, 0.012)
}

function createTone({
  frequency,
  endFrequency = frequency,
  type = 'sine',
  gain = 0.14,
  delay = 0,
  duration = 0.08,
}) {
  if (!audioContext || !masterGain) return

  const start = audioContext.currentTime + delay
  const stop = start + duration
  const oscillator = audioContext.createOscillator()
  const envelope = audioContext.createGain()

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, stop)

  envelope.gain.setValueAtTime(0.0001, start)
  envelope.gain.exponentialRampToValueAtTime(gain, start + Math.min(0.012, duration / 3))
  envelope.gain.exponentialRampToValueAtTime(0.0001, stop)

  oscillator.connect(envelope)
  envelope.connect(masterGain)
  oscillator.start(start)
  oscillator.stop(stop + 0.015)
}

const sounds = {
  click() {
    createTone({ frequency: 480, endFrequency: 640, duration: 0.045, gain: 0.1 })
  },
  success() {
    createTone({ frequency: 523.25, duration: 0.11, gain: 0.14 })
    createTone({ frequency: 659.25, delay: 0.075, duration: 0.14, gain: 0.13 })
    createTone({ frequency: 783.99, delay: 0.15, duration: 0.18, gain: 0.11 })
  },
  error() {
    createTone({ frequency: 190, endFrequency: 145, type: 'triangle', duration: 0.16, gain: 0.14 })
    createTone({ frequency: 155, endFrequency: 120, type: 'triangle', delay: 0.1, duration: 0.18, gain: 0.1 })
  },
  levelUp() {
    ;[392, 523.25, 659.25, 783.99].forEach((frequency, index) => {
      createTone({
        frequency,
        endFrequency: frequency * 1.015,
        delay: index * 0.075,
        duration: 0.22,
        gain: 0.13 - index * 0.012,
      })
    })
  },
  notification() {
    createTone({ frequency: 659.25, duration: 0.12, gain: 0.1 })
    createTone({ frequency: 880, delay: 0.09, duration: 0.18, gain: 0.09 })
  },
}

/**
 * Creates/resumes Web Audio. Call this from a pointer or keyboard event only.
 * It deliberately does nothing while audio is muted.
 */
export async function unlockAudioFeedback() {
  if (muted) return false

  const AudioContextConstructor = getAudioContextConstructor()
  if (!AudioContextConstructor) return false

  if (!audioContext) {
    audioContext = new AudioContextConstructor()
    masterGain = audioContext.createGain()
    masterGain.gain.value = DEFAULT_VOLUME
    masterGain.connect(audioContext.destination)
    activated = true
    emitState()
  }

  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume()
    } catch {
      return false
    }
  }

  syncMasterVolume()
  return audioContext.state === 'running'
}

/** Plays one of the five synthesized feedback sounds after audio has been unlocked. */
export function playAudioFeedback(type = 'click') {
  if (!activated || muted || !sounds[type]) return false

  if (audioContext?.state === 'suspended') {
    void audioContext.resume().catch(() => {})
    return false
  }

  sounds[type]()
  return true
}

export function setAudioFeedbackMuted(nextMuted) {
  muted = Boolean(nextMuted)
  syncMasterVolume()
  emitState()
}

export function getAudioFeedbackState() {
  return currentState()
}

export function subscribeToAudioFeedback(listener) {
  stateListeners.add(listener)
  return () => stateListeners.delete(listener)
}

/**
 * Adds one-shot gesture listeners. Useful at the application root; returns cleanup.
 */
export function installAudioUnlockListeners(target = globalThis.document) {
  if (!target?.addEventListener) return () => {}

  const cleanup = () => {
    target.removeEventListener('pointerdown', handleGesture, true)
    target.removeEventListener('keydown', handleGesture, true)
  }
  const handleGesture = async () => {
    if (await unlockAudioFeedback()) cleanup()
  }

  target.addEventListener('pointerdown', handleGesture, true)
  target.addEventListener('keydown', handleGesture, true)
  return cleanup
}

/** Keeps volume and UI state aligned if the OS accessibility preference changes. */
export function installAudioPreferenceListener(target = globalThis.window) {
  if (typeof target?.matchMedia !== 'function') return () => {}
  const mediaQuery = target.matchMedia('(prefers-reduced-motion: reduce)')
  const handleChange = () => {
    emitState()
  }

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }

  mediaQuery.addListener?.(handleChange)
  return () => mediaQuery.removeListener?.(handleChange)
}
