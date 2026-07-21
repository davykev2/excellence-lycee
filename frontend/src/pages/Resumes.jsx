import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'

export default function Resumes() {
  const profile = useAuthStore((s) => s.profile)
  const [matieres, setMatieres] = useState([])
  const [couverture, setCouverture] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.serie_id) return
    supabase
      .from('matieres_series')
      .select('matieres(id, nom, slug, icone, ordre)')
      .eq('serie_id', profile.serie_id)
      .then(async ({ data }) => {
        const list = (data ?? []).map((r) => r.matieres).filter(Boolean).sort((a, b) => a.ordre - b.ordre)
        const ids = list.map((m) => m.id)
        const { data: chapitres } = ids.length
          ? await supabase
              .from('chapitres')
              .select('id, matiere_id, resume_published, resume')
              .eq('serie_id', profile.serie_id)
              .eq('published', true)
              .in('matiere_id', ids)
          : { data: [] }
        let lus = new Set()
        try {
          lus = new Set(JSON.parse(localStorage.getItem('excellence_read_lessons') ?? '[]'))
        } catch {
          lus = new Set()
        }
        const next = {}
        for (const m of list) next[m.id] = { total: 0, lus: 0 }
        for (const c of chapitres ?? []) {
          if (!c.resume_published || !c.resume || !next[c.matiere_id]) continue
          next[c.matiere_id].total += 1
          if (lus.has(c.id)) next[c.matiere_id].lus += 1
        }
        setMatieres(list)
        setCouverture(next)
        setLoading(false)
      })
  }, [profile?.serie_id])

  if (loading) return <Loader />

  const totalLecons = Object.values(couverture).reduce((sum, item) => sum + item.total, 0)
  const totalLues = Object.values(couverture).reduce((sum, item) => sum + item.lus, 0)
  const progression = totalLecons ? Math.round((totalLues / totalLecons) * 100) : 0

  return (
    <div className="game-page mx-auto max-w-5xl px-4 py-8">
      <section className="game-hero mb-7 rounded-3xl p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[var(--neon-violet)]/20 blur-3xl" />
        <div className="relative grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="game-eyebrow">📖 Bibliothèque de révision</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Révise l’essentiel, sans te perdre</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
              Des résumés clairs, les formules utiles et un passage direct vers l’entraînement.
            </p>
          </div>
          <div className="min-w-48 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/40 p-4 backdrop-blur">
            <div className="flex items-end justify-between gap-3">
              <span className="text-xs text-[var(--text-muted)]">Leçons lues</span>
              <strong className="text-2xl text-[var(--neon-cyan)]">{totalLues}/{totalLecons}</strong>
            </div>
            <div className="game-progress mt-2 h-2.5" role="progressbar" aria-label="Progression de lecture" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progression}>
              <span style={{ width: `${progression}%` }} />
            </div>
            <p className="mt-2 text-right text-xs font-bold text-[var(--accent-text)]">{progression}% parcouru</p>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">Choisis ta matière</h2>
          <p className="text-sm text-[var(--text-muted)]">Chaque lecture terminée reste cochée sur cet appareil.</p>
        </div>
        <span className="game-kicker">{matieres.length} matières</span>
      </div>

      {matieres.length === 0 ? (
        <Card><p className="text-[var(--text-muted)]">Aucune matière configurée pour ta série.</p></Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {matieres.map((m) => (
            <Link key={m.id} to={`/resumes/${m.slug}`}>
              <Card variant="interactive" className="flex h-full min-h-44 flex-col justify-between gap-3 p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-[var(--border)] bg-[var(--bg-soft)] text-2xl">{m.icone}</span>
                  <span className="text-[var(--text-muted)]">↗</span>
                </div>
                <div>
                  <span className="font-bold">{m.nom}</span>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {couverture[m.id]?.total ?? 0} résumé{(couverture[m.id]?.total ?? 0) > 1 ? 's' : ''} disponible{(couverture[m.id]?.total ?? 0) > 1 ? 's' : ''}
                  </p>
                  <div className="game-progress mt-3 h-1.5">
                    <span style={{ width: `${couverture[m.id]?.total ? Math.round((couverture[m.id].lus / couverture[m.id].total) * 100) : 0}%` }} />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
