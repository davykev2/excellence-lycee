import { useEffect, useRef, useState } from 'react'
import { formatDuration, remainingSeconds } from '../../utils/time'

// Chronomètre basé sur l'heure de fin théorique (serveur) : robuste au rechargement de page.
export default function Timer({ dateFinTheorique, onExpire }) {
  const [remaining, setRemaining] = useState(() => remainingSeconds(dateFinTheorique))
  const expiredRef = useRef(false)

  useEffect(() => {
    expiredRef.current = false
    const interval = setInterval(() => {
      const r = remainingSeconds(dateFinTheorique)
      setRemaining(r)
      if (r <= 0 && !expiredRef.current) {
        expiredRef.current = true
        clearInterval(interval)
        onExpire?.()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [dateFinTheorique, onExpire])

  if (remaining === null) return null

  const urgent = remaining <= 30
  return (
    <div
      role="timer"
      aria-live={urgent ? 'assertive' : 'off'}
      aria-label={`Temps restant : ${formatDuration(remaining)}`}
      className={`rounded-lg border px-3 py-1.5 font-mono text-sm ${
        urgent
          ? 'border-[var(--neon-magenta)] text-[var(--neon-magenta)] animate-pulse'
          : 'border-[var(--neon-cyan)] text-[var(--neon-cyan)]'
      }`}
    >
      ⏱ {formatDuration(remaining)}
    </div>
  )
}
