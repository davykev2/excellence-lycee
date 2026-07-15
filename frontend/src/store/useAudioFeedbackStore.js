import { create } from 'zustand'
import {
  getAudioFeedbackState,
  playAudioFeedback,
  setAudioFeedbackMuted,
  subscribeToAudioFeedback,
  unlockAudioFeedback,
} from '../lib/audioFeedback'

export const AUDIO_MUTED_STORAGE_KEY = 'excellence_audio_muted'

function readMutedPreference() {
  try {
    return globalThis.localStorage?.getItem(AUDIO_MUTED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistMutedPreference(value) {
  try {
    globalThis.localStorage?.setItem(AUDIO_MUTED_STORAGE_KEY, String(value))
  } catch {
    // Storage may be unavailable in private browsing; keep the in-memory choice.
  }
}

const initialMuted = readMutedPreference()
setAudioFeedbackMuted(initialMuted)

export const useAudioFeedbackStore = create((set, get) => ({
  ...getAudioFeedbackState(),
  muted: initialMuted,

  setMuted(nextMuted) {
    const muted = Boolean(nextMuted)
    persistMutedPreference(muted)
    setAudioFeedbackMuted(muted)
    set({ muted })
  },

  toggleMuted() {
    get().setMuted(!get().muted)
  },

  play: playAudioFeedback,
  unlock: unlockAudioFeedback,
}))

subscribeToAudioFeedback((state) => {
  useAudioFeedbackStore.setState(state)
})

/** Compact hook API for pages that need semantic success/error/level-up sounds. */
export function useAudioFeedback() {
  const muted = useAudioFeedbackStore((state) => state.muted)
  const activated = useAudioFeedbackStore((state) => state.activated)
  const reducedMotion = useAudioFeedbackStore((state) => state.reducedMotion)
  const supported = useAudioFeedbackStore((state) => state.supported)
  const setMuted = useAudioFeedbackStore((state) => state.setMuted)
  const toggleMuted = useAudioFeedbackStore((state) => state.toggleMuted)

  return {
    muted,
    activated,
    reducedMotion,
    supported,
    setMuted,
    toggleMuted,
    play: playAudioFeedback,
    unlock: unlockAudioFeedback,
  }
}
