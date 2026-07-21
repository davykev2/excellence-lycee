function toFiniteNumber(value, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

/**
 * Barre de progression XP autonome.
 * `current` représente l'XP acquise dans le palier et `target` l'XP du palier.
 */
export default function XPProgress({
  current = 0,
  target = 100,
  level,
  nextLevel,
  title = 'Progression XP',
  caption,
  accent = 'var(--neon-cyan)',
  showNumbers = true,
  compact = false,
  className = '',
  ariaLabel,
}) {
  const safeTarget = Math.max(0, toFiniteNumber(target))
  const safeCurrent = Math.max(0, toFiniteNumber(current))
  const boundedCurrent = safeTarget > 0 ? Math.min(safeCurrent, safeTarget) : 0
  const percentage = safeTarget > 0 ? Math.round((boundedCurrent / safeTarget) * 100) : 0
  const remaining = Math.max(0, safeTarget - safeCurrent)
  const resolvedCaption =
    caption ??
    (remaining > 0
      ? `${remaining.toLocaleString('fr-FR')} XP avant${nextLevel != null ? ` le niveau ${nextLevel}` : ' le prochain niveau'}`
      : 'Palier atteint !')

  return (
    <section
      className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] ${
        compact ? 'p-3' : 'p-4 sm:p-5'
      } ${className}`}
      aria-label={ariaLabel ?? title}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-14 h-32 w-32 rounded-full opacity-15 blur-3xl"
        style={{ background: accent }}
        aria-hidden="true"
      />

      <div className="relative mb-2 flex min-w-0 items-end justify-between gap-3">
        <div className="min-w-0">
          <p className={`${compact ? 'text-xs' : 'text-sm'} font-semibold text-[var(--text)]`}>{title}</p>
          {level != null && (
            <p className="mt-0.5 truncate text-xs font-medium" style={{ color: accent }}>
              Niveau {level}
            </p>
          )}
        </div>
        {showNumbers && (
          <p className="shrink-0 text-xs tabular-nums text-[var(--text-muted)]">
            <strong className="text-[var(--text)]">{safeCurrent.toLocaleString('fr-FR')}</strong>
            {' / '}
            {safeTarget.toLocaleString('fr-FR')} XP
          </p>
        )}
      </div>

      <div
        className={`${compact ? 'h-2' : 'h-3'} relative overflow-hidden rounded-full bg-[var(--border)]`}
        role="progressbar"
        aria-label={ariaLabel ?? title}
        aria-valuemin={0}
        aria-valuemax={safeTarget}
        aria-valuenow={boundedCurrent}
        aria-valuetext={`${percentage} %, ${safeCurrent} XP sur ${safeTarget}`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
          style={{
            width: `${percentage}%`,
            background: `linear-gradient(90deg, var(--neon-violet), ${accent})`,
            boxShadow: `0 0 12px ${accent}`,
          }}
        />
      </div>

      {!compact && (
        <div className="relative mt-2 flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
          <span className="min-w-0 truncate">{resolvedCaption}</span>
          <span className="shrink-0 font-bold tabular-nums" style={{ color: accent }}>
            {percentage}%
          </span>
        </div>
      )}
    </section>
  )
}
