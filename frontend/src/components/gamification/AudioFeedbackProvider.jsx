import { useEffect } from 'react'
import {
  installAudioPreferenceListener,
  installAudioUnlockListeners,
  playAudioFeedback,
} from '../../lib/audioFeedback'
import { playNativeHaptic } from '../../lib/nativeApp'

const INTERACTIVE_SELECTOR = [
  'button',
  'a[href]',
  '[role="button"]',
  'input[type="button"]',
  'input[type="submit"]',
  '[data-audio-feedback]',
].join(',')

/**
 * Mount once near the application root to enable discreet delegated click sounds.
 * Use data-audio-feedback="off" on an element to silence it, or set it to a sound
 * name (success, error, levelUp, notification) for a semantic sound.
 */
export default function AudioFeedbackProvider() {
  useEffect(() => {
    const removeUnlockListeners = installAudioUnlockListeners(document)
    const removePreferenceListener = installAudioPreferenceListener(window)

    const handleClick = (event) => {
      if (!(event.target instanceof Element)) return
      const interactiveElement = event.target.closest(INTERACTIVE_SELECTOR)
      if (!interactiveElement || interactiveElement.matches(':disabled, [aria-disabled="true"]')) return

      const requestedSound = interactiveElement.dataset.audioFeedback
      if (requestedSound === 'off') return
      const feedbackType = requestedSound || 'click'
      playAudioFeedback(feedbackType)
      void playNativeHaptic(feedbackType)
    }

    document.addEventListener('click', handleClick)
    return () => {
      removeUnlockListeners()
      removePreferenceListener()
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
