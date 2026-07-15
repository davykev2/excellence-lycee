import { useAudioFeedback } from '../../store/useAudioFeedbackStore'

export default function AudioToggle({ className = '' }) {
  const { muted, supported, setMuted, unlock, play } = useAudioFeedback()
  const unavailable = !supported

  async function handleClick() {
    if (muted) {
      setMuted(false)
      if (await unlock()) play('notification')
      return
    }

    play('click')
    setMuted(true)
  }

  const label = unavailable
    ? 'Sons indisponibles sur ce navigateur'
    : muted
      ? 'Activer les sons'
      : 'Désactiver les sons'

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      disabled={unavailable}
      data-audio-feedback="off"
      aria-label={label}
      aria-pressed={!muted && !unavailable}
      title={label}
    >
      <span aria-hidden="true">{muted || unavailable ? '🔇' : '🔊'}</span>
    </button>
  )
}
