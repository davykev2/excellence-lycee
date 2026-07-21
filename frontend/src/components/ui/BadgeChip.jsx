import { useState } from 'react'
import { BADGE_CATEGORIES } from '../../utils/constants'

export default function BadgeChip({ badge, obtenu = true }) {
  const cat = BADGE_CATEGORIES.find((c) => c.key === badge.categorie)
  const [ouvert, setOuvert] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setOuvert((value) => !value)}
      aria-expanded={ouvert}
      title={badge.description}
      className={`flex min-h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border p-3 text-center transition hover:-translate-y-0.5 hover:border-[var(--neon-cyan)]
        ${obtenu ? 'border-[var(--border)] bg-[var(--bg-elevated)]' : 'border-[var(--border)] bg-[var(--bg-soft)] grayscale-[.65]'}`}
    >
      <span
        className="text-3xl"
        style={obtenu ? { filter: `drop-shadow(0 0 6px ${cat?.color ?? 'var(--neon-cyan)'})` } : undefined}
      >
        {obtenu ? badge.icone : '🔒'}
      </span>
      <span className="text-xs font-medium leading-tight">{badge.nom}</span>
      {ouvert ? (
        <span className="text-[10px] leading-tight text-[var(--text-muted)]">
          {badge.description || (obtenu ? 'Badge obtenu' : 'Badge à débloquer')}
        </span>
      ) : (
        <span className="text-[10px] text-[var(--text-muted)]">{obtenu ? 'Obtenu · voir' : 'À débloquer'}</span>
      )}
    </button>
  )
}
