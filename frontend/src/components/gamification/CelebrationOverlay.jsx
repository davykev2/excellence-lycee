import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

const CONFETTI = [
  { left: '9%', top: '18%', color: 'var(--neon-cyan)', rotate: '-18deg' },
  { left: '20%', top: '8%', color: 'var(--neon-magenta)', rotate: '25deg' },
  { left: '34%', top: '14%', color: 'var(--neon-green)', rotate: '45deg' },
  { left: '62%', top: '9%', color: 'var(--neon-violet)', rotate: '-34deg' },
  { left: '76%', top: '17%', color: 'var(--neon-cyan)', rotate: '18deg' },
  { left: '89%', top: '10%', color: 'var(--neon-magenta)', rotate: '52deg' },
]

/** Modale contrôlée pour annoncer un niveau, un badge, un score ou une mission. */
export default function CelebrationOverlay({
  open = false,
  title = 'Bravo !',
  message,
  reward,
  icon = '🏆',
  actionLabel = 'Continuer',
  onAction,
  onClose,
  autoCloseMs = 0,
  closeOnBackdrop = true,
  accent = 'var(--neon-cyan)',
  children,
}) {
  const titleId = useId()
  const descriptionId = useId()
  const actionRef = useRef(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined

    const previouslyFocused = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const frame = window.requestAnimationFrame(() => {
      ;(actionRef.current ?? closeRef.current)?.focus()
    })

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose?.()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open || !onClose || autoCloseMs <= 0) return undefined
    const timer = window.setTimeout(onClose, autoCloseMs)
    return () => window.clearTimeout(timer)
  }, [autoCloseMs, onClose, open])

  if (!open || typeof document === 'undefined') return null

  function handleAction() {
    if (onAction) onAction()
    else onClose?.()
  }

  return createPortal(
    <div
      className="anim-fade-in fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose?.()
      }}
    >
      <section
        className="anim-pop relative w-full max-w-md overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5 text-center shadow-2xl sm:p-7"
        style={{ boxShadow: `0 0 50px color-mix(in srgb, ${accent} 35%, transparent)` }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={message ? descriptionId : undefined}
      >
        <div
          className="pointer-events-none absolute inset-x-0 -top-24 h-56 opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, ${accent}, transparent 68%)` }}
          aria-hidden="true"
        />

        {CONFETTI.map((piece, index) => (
          <span
            key={index}
            className="pointer-events-none absolute h-2.5 w-1.5 rounded-sm"
            style={{
              left: piece.left,
              top: piece.top,
              background: piece.color,
              transform: `rotate(${piece.rotate})`,
            }}
            aria-hidden="true"
          />
        ))}

        {onClose && (
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 grid h-9 w-9 cursor-pointer place-items-center rounded-full text-xl text-[var(--text-muted)] outline-none transition hover:bg-[var(--border)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)]"
            aria-label="Fermer la célébration"
          >
            ×
          </button>
        )}

        <div className="relative">
          <div
            className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-3xl border text-5xl sm:h-24 sm:w-24 sm:text-6xl"
            style={{
              borderColor: accent,
              background: `color-mix(in srgb, ${accent} 12%, transparent)`,
              boxShadow: `0 0 28px color-mix(in srgb, ${accent} 45%, transparent)`,
            }}
            aria-hidden="true"
          >
            {icon}
          </div>

          <h2 id={titleId} className="text-2xl font-black sm:text-3xl" style={{ color: accent }}>
            {title}
          </h2>
          {message && (
            <p id={descriptionId} className="mx-auto mt-2 max-w-sm text-sm text-[var(--text-muted)] sm:text-base">
              {message}
            </p>
          )}
          {reward != null && (
            <p
              className="mx-auto mt-4 w-fit rounded-full border px-4 py-1.5 text-sm font-extrabold"
              style={{
                borderColor: accent,
                color: accent,
                background: `color-mix(in srgb, ${accent} 10%, transparent)`,
              }}
            >
              {reward}
            </p>
          )}

          {children && <div className="mt-5">{children}</div>}

          {actionLabel && (
            <button
              ref={actionRef}
              type="button"
              onClick={handleAction}
              className="mt-6 min-h-11 w-full cursor-pointer rounded-xl px-5 py-2.5 text-sm font-extrabold text-black outline-none transition hover:brightness-110 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-elevated)] active:scale-[0.98] motion-reduce:transform-none sm:w-auto sm:min-w-44"
              style={{
                background: accent,
                boxShadow: `0 0 18px color-mix(in srgb, ${accent} 55%, transparent)`,
              }}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </section>
    </div>,
    document.body,
  )
}
