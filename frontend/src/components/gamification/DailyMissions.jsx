import { useId } from 'react'

function toFiniteNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function MissionAction({ mission, onMissionClick, children }) {
  const label = mission.actionLabel ?? `Ouvrir la mission : ${mission.title}`

  if (typeof onMissionClick === 'function') {
    return (
      <button
        type="button"
        className="w-full cursor-pointer rounded-xl text-left outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] motion-reduce:transform-none"
        onClick={() => onMissionClick(mission)}
        aria-label={label}
      >
        {children}
      </button>
    )
  }

  if (mission.href) {
    return (
      <a
        href={mission.href}
        className="block rounded-xl outline-none transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] motion-reduce:transform-none"
        aria-label={label}
      >
        {children}
      </a>
    )
  }

  return children
}

/**
 * Liste de missions pilotée par `missions`.
 * Une mission accepte : id, title, description, icon, current, target, reward,
 * completed, href et actionLabel.
 */
export default function DailyMissions({
  missions = [],
  title = 'Missions du jour',
  subtitle = 'Reviens chaque jour pour garder le rythme.',
  emptyMessage = 'Toutes les missions sont terminées. Reviens demain !',
  onMissionClick,
  className = '',
  accent = 'var(--neon-cyan)',
}) {
  const titleId = useId()
  const safeMissions = Array.isArray(missions) ? missions : []
  const completedCount = safeMissions.filter((mission) => mission.completed).length

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 sm:p-5 ${className}`}
      aria-labelledby={titleId}
    >
      <header className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id={titleId} className="flex items-center gap-2 text-base font-bold sm:text-lg">
            <span aria-hidden="true">🎯</span>
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-xs text-[var(--text-muted)] sm:text-sm">{subtitle}</p>}
        </div>
        {safeMissions.length > 0 && (
          <p
            className="w-fit shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold tabular-nums"
            aria-live="polite"
          >
            <span style={{ color: accent }}>{completedCount}</span> / {safeMissions.length} accomplies
          </p>
        )}
      </header>

      {safeMissions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-5 text-center">
          <span className="text-3xl" aria-hidden="true">✨</span>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{emptyMessage}</p>
        </div>
      ) : (
        <ul className="grid gap-3" aria-label={title}>
          {safeMissions.map((mission, index) => {
            const target = Math.max(1, toFiniteNumber(mission.target, 1))
            const current = Math.max(0, toFiniteNumber(mission.current, mission.completed ? target : 0))
            const completed = Boolean(mission.completed || current >= target)
            const progress = completed ? 100 : Math.min(100, Math.round((current / target) * 100))
            const key = mission.id ?? `${mission.title ?? 'mission'}-${index}`

            return (
              <li key={key}>
                <MissionAction mission={mission} onMissionClick={onMissionClick}>
                  <article
                    className={`relative flex gap-3 overflow-hidden rounded-xl border p-3 sm:p-4 ${
                      completed
                        ? 'border-[var(--neon-green)]/40 bg-[var(--neon-green)]/5'
                        : 'border-[var(--border)] bg-[var(--bg)]/45'
                    }`}
                  >
                    <div
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] text-xl sm:h-11 sm:w-11"
                      aria-hidden="true"
                    >
                      {completed ? '✓' : (mission.icon ?? '⚡')}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className={`text-sm font-bold ${completed ? 'text-[var(--neon-green)]' : ''}`}>
                            {mission.title ?? 'Mission'}
                          </h3>
                          {mission.description && (
                            <p className="mt-0.5 text-xs text-[var(--text-muted)]">{mission.description}</p>
                          )}
                        </div>
                        {mission.reward != null && (
                          <span
                            className="shrink-0 rounded-full border px-2 py-0.5 text-xs font-bold"
                            style={{ borderColor: accent, color: accent }}
                          >
                            +{mission.reward} XP
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 flex items-center gap-2">
                        <div
                          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--border)]"
                          role="progressbar"
                          aria-label={`Progression de ${mission.title ?? 'la mission'}`}
                          aria-valuemin={0}
                          aria-valuemax={target}
                          aria-valuenow={Math.min(current, target)}
                        >
                          <div
                            className="h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none"
                            style={{
                              width: `${progress}%`,
                              background: completed ? 'var(--neon-green)' : accent,
                            }}
                          />
                        </div>
                        <span className="shrink-0 text-[11px] tabular-nums text-[var(--text-muted)]">
                          {completed ? 'Terminée' : `${Math.min(current, target)} / ${target}`}
                        </span>
                      </div>
                    </div>
                  </article>
                </MissionAction>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
