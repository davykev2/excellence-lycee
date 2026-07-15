export default function ProgressBar({ current, total }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs text-[var(--text-muted)]">
        <span>Question {current} / {total}</span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]"
        role="progressbar"
        aria-label="Progression du quiz"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={Math.min(current, total)}
        aria-valuetext={`${pct} %`}
      >
        <div
          className="h-full rounded-full bg-[var(--neon-cyan)] transition-all duration-300"
          style={{ width: `${pct}%`, boxShadow: 'var(--glow-cyan)' }}
        />
      </div>
    </div>
  )
}
