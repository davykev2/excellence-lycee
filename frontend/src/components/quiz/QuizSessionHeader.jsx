import { useEffect, useRef, useState } from 'react'
import Avatar from '../ui/Avatar'
import { useAuthStore } from '../../store/useAuthStore'

// Nombre animé qui glisse de l'ancienne valeur vers la nouvelle.
function useCountTo(value, duration = 600) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)
  const raf = useRef(null)
  useEffect(() => {
    const from = fromRef.current
    const to = Number(value) || 0
    if (from === to) return
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = Math.round(from + (to - from) * eased)
      setDisplay(v)
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else fromRef.current = to
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [value, duration])
  return display
}

export default function QuizSessionHeader({ points, maxPoints, lastGain, barPct, unit, streak }) {
  const profile = useAuthStore((s) => s.profile)
  const shown = useCountTo(points)
  const pct =
    barPct != null
      ? Math.min(100, Math.max(0, Math.round(barPct)))
      : maxPoints > 0
      ? Math.min(100, Math.round((points / maxPoints) * 100))
      : 0

  // Badge "+N" éphémère à chaque gain de points.
  const [pop, setPop] = useState(null)
  useEffect(() => {
    if (!lastGain) return
    setPop({ n: lastGain.n, key: lastGain.key })
    const t = setTimeout(() => setPop(null), 1100)
    return () => clearTimeout(t)
  }, [lastGain])

  return (
    <div className="mb-4 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3">
      <Avatar
        userId={profile?.id}
        avatarUrl={profile?.avatar_url}
        username={profile?.username}
        size="h-11 w-11"
        ring
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{profile?.username || 'Élève'}</p>

        {/* La bande de points de la session */}
        <div className="mt-1 flex items-center gap-2">
          <div className="relative h-3 flex-1 overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: 'linear-gradient(90deg, var(--neon-violet), var(--neon-cyan))',
                boxShadow: 'var(--glow-cyan)',
              }}
            />
          </div>
          <div className="relative flex shrink-0 items-center gap-1" aria-live="polite" aria-atomic="true">
            <span
              key={points}
              className="text-sm font-extrabold tabular-nums text-[var(--neon-cyan)] quiz-points-pulse"
            >
              ⚡ {shown}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              {unit ?? (maxPoints > 0 ? `/ ${maxPoints}` : 'pts')}
            </span>
            {streak > 0 && (
              <span className="ml-1 shrink-0 text-xs font-semibold text-[var(--neon-magenta)]">🔥 ×{streak}</span>
            )}
            {pop && (
              <span
                key={pop.key}
                className="quiz-points-gain pointer-events-none absolute -top-4 right-0 text-xs font-bold text-[var(--neon-green)]"
              >
                +{pop.n}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
