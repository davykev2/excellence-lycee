function clampProgress(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 0
  return Math.max(0, Math.min(100, Math.round(parsed)))
}

export default function ProgressRing({
  value = 0,
  size = 62,
  color = 'var(--neon-cyan)',
  className = '',
}) {
  const progress = clampProgress(value)
  const thickness = Math.max(5, Math.round(size * 0.1))

  return (
    <span
      className={`relative grid shrink-0 place-items-center rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        padding: thickness,
        background: `conic-gradient(${color} ${progress}%, var(--border) ${progress}% 100%)`,
        boxShadow: progress > 0 ? `0 0 18px color-mix(in srgb, ${color} 22%, transparent)` : undefined,
      }}
      role="progressbar"
      aria-label={`Progression des exercices : ${progress} %`}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={progress}
    >
      <span className="grid h-full w-full place-items-center rounded-full bg-[var(--bg-elevated)] text-[11px] font-black tabular-nums text-[var(--text)]">
        {progress}%
      </span>
    </span>
  )
}
