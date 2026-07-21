const VARIANTS = {
  default: '',
  interactive: 'game-card-interactive',
  reward: 'game-card-reward',
}

export default function Card({ className = '', children, glow = false, variant = 'default', ...props }) {
  return (
    <div
      className={`game-card rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4
        ${glow ? 'shadow-[var(--glow-violet)]' : ''} ${VARIANTS[variant] ?? ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
