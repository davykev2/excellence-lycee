const VARIANTS = {
  primary:
    'bg-[var(--neon-cyan)] text-black font-semibold hover:brightness-110 shadow-[var(--glow-cyan)]',
  secondary:
    'bg-transparent text-[var(--neon-cyan)] border border-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10',
  ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--border)]/40',
  danger: 'bg-[var(--neon-magenta)] text-black font-semibold hover:brightness-110',
}

export default function Button({ variant = 'primary', className = '', children, disabled, ...props }) {
  return (
    <button
      disabled={disabled}
      className={`game-button inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm transition
        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
