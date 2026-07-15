import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/useAuthStore'
import Card from '../ui/Card'

const REACTIONS = [
  { code: 'love', emoji: '❤️', label: "J'adore" },
  { code: 'up',   emoji: '👍', label: "C'est nickel" },
  { code: 'meh',  emoji: '😐', label: 'Pas assez satisfaisant' },
  { code: 'bad',  emoji: '❌', label: 'Pas bon du tout' },
]

const EMPTY = { love: 0, up: 0, meh: 0, bad: 0, total: 0 }

export default function LessonReactions({ chapitreId }) {
  const session = useAuthStore((s) => s.session)
  const [counts, setCounts] = useState(EMPTY)
  const [mine, setMine] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.rpc('get_lecon_reactions', { p_chapitre_id: chapitreId }).then(({ data }) => {
      if (cancelled || !data) return
      setCounts({ ...EMPTY, ...data })
      setMine(data.ma_reaction ?? null)
    })
    return () => { cancelled = true }
  }, [chapitreId, session?.user?.id])

  async function react(code) {
    if (!session || busy) return
    const target = code === mine ? null : code

    // Mise à jour optimiste
    const prevCounts = counts
    const prevMine = mine
    const next = { ...counts }
    if (mine) { next[mine] = Math.max(0, next[mine] - 1); next.total = Math.max(0, next.total - 1) }
    if (target) { next[target] = (next[target] || 0) + 1; next.total += 1 }
    setCounts(next)
    setMine(target)
    setBusy(true)

    const { data, error } = await supabase.rpc('set_lecon_reaction', {
      p_chapitre_id: chapitreId,
      p_reaction: target,
    })
    if (error) {
      setCounts(prevCounts)
      setMine(prevMine)
    } else if (data) {
      setCounts({ ...EMPTY, ...data })
      setMine(data.ma_reaction ?? null)
    }
    setBusy(false)
  }

  return (
    <Card className="mt-6 p-4 sm:p-5">
      <p className="mb-3 text-center text-sm font-semibold">
        Ton avis sur ce résumé&nbsp;?
      </p>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {REACTIONS.map((r) => {
          const active = mine === r.code
          return (
            <button
              key={r.code}
              type="button"
              onClick={() => react(r.code)}
              disabled={!session || busy}
              title={session ? r.label : 'Connecte-toi pour réagir'}
              aria-pressed={active}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition
                disabled:cursor-not-allowed
                ${active
                  ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 shadow-[var(--glow-cyan)]'
                  : 'border-[var(--border)] hover:border-[var(--neon-cyan)]/60 hover:bg-[var(--border)]/30'}
                ${!session ? 'opacity-70' : ''}`}
            >
              <span className="text-lg leading-none">{r.emoji}</span>
              <span className="min-w-4 font-semibold tabular-nums">{counts[r.code] ?? 0}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-3 text-center text-xs text-[var(--text-muted)]">
        {counts.total > 0
          ? `${counts.total} avis`
          : 'Sois le premier à réagir'}
        {!session && (
          <>
            {' · '}
            <Link to="/login" className="text-[var(--neon-cyan)] hover:underline">
              connecte-toi pour donner le tien
            </Link>
          </>
        )}
      </p>
    </Card>
  )
}
