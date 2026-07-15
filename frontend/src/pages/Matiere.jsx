import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import ProgressRing from '../components/ui/ProgressRing'

export default function Matiere() {
  const { slug } = useParams()
  const profile = useAuthStore((s) => s.profile)
  const [matiere, setMatiere] = useState(null)
  const [chapitres, setChapitres] = useState([])
  const [devoirs, setDevoirs] = useState([])
  const [progressions, setProgressions] = useState({})
  const [progressionError, setProgressionError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.serie_id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setProgressionError(false)
      setMatiere(null)
      const { data: m, error: matiereError } = await supabase.from('matieres').select('*').eq('slug', slug).single()
      if (cancelled) return
      if (matiereError || !m) {
        setLoading(false)
        return
      }
      setMatiere(m)

      const [{ data: chs }, { data: dvs }, { data: progression, error: progressionRpcError }] = await Promise.all([
        supabase.from('chapitres').select('*').eq('matiere_id', m.id).eq('serie_id', profile.serie_id).eq('published', true).order('ordre'),
        supabase.from('quiz').select('*').eq('matiere_id', m.id).eq('serie_id', profile.serie_id).eq('type', 'devoir').eq('published', true).order('numero'),
        supabase.rpc('get_progression_exercices_matiere_v2', { p_matiere_id: m.id }),
      ])
      if (cancelled) return
      setChapitres(chs ?? [])
      setDevoirs(dvs ?? [])
      setProgressionError(Boolean(progressionRpcError))
      const progressionChapitres = Array.isArray(progression)
        ? progression
        : (progression?.chapitres ?? [])
      setProgressions(Object.fromEntries(progressionChapitres.map((row) => {
        const total = Math.max(0, Number(row.exercices_total ?? row.total ?? 0))
        const valides = Math.min(
          total,
          Math.max(0, Number(row.exercices_valides ?? row.valides ?? 0)),
        )

        return [
          row.chapitre_id,
          {
            total,
            valides,
            pourcentage: total > 0 ? Math.round((valides / total) * 100) : 0,
          },
        ]
      })))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [slug, profile?.serie_id])

  const limiteDecouverte = 1

  if (loading) return <Loader />
  if (!matiere) return <div className="p-8 text-center text-[var(--text-muted)]">Matière introuvable.</div>

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <section className="game-hero mb-7 rounded-3xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl border border-[var(--neon-cyan)]/40 bg-[var(--neon-cyan)]/10 text-4xl shadow-[var(--glow-cyan)]">{matiere.icone}</span>
          <div className="flex-1">
            <p className="game-eyebrow">Parcours d’entraînement</p>
            <h1 className="mt-1 text-3xl font-black">{matiere.nom}</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Entraîne-toi sans note, consulte les corrections, puis mesure-toi aux quiz.</p>
          </div>
          <span className="game-kicker">{chapitres.length} chapitres · {devoirs.length} devoirs</span>
        </div>
      </section>

      <h2 className="mb-3 text-xl font-bold">Carte du parcours</h2>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {chapitres.map((c, i) => {
          const verrouille = !profile.approuve && c.ordre > limiteDecouverte
          const progression = progressions[c.id] ?? { total: 0, valides: 0, pourcentage: 0 }
          return (
            <Link key={c.id} to={verrouille ? '#' : `/chapitre/${c.id}`} onClick={(e) => verrouille && e.preventDefault()}>
              <Card
                variant={verrouille ? 'default' : 'interactive'}
                className={`relative flex aspect-square min-h-0 flex-col justify-between overflow-hidden p-3 sm:p-4 ${verrouille ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--bg)]/45 text-xs font-black tabular-nums text-[var(--text-muted)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]" aria-hidden="true">{verrouille ? '🔒' : '↗'}</span>
                </div>

                <p
                  className="my-2 overflow-hidden text-sm font-black leading-snug sm:text-base"
                  style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}
                >
                  {c.titre}
                </p>

                <div className="flex items-end justify-between gap-2">
                  <div className="min-w-0 text-[10px] leading-tight text-[var(--text-muted)] sm:text-xs">
                    {progressionError ? (
                      <span className="font-semibold text-[var(--neon-magenta)]">Progression indisponible</span>
                    ) : progression.total > 0 ? (
                      <>
                        <strong className="block text-sm text-[var(--text)]">{progression.valides}/{progression.total}</strong>
                        exercices terminés
                      </>
                    ) : (
                      <span className="font-semibold text-[var(--neon-violet)]">Exercices à venir</span>
                    )}
                  </div>
                  <ProgressRing value={progression.pourcentage} size={56} />
                </div>
              </Card>
            </Link>
          )
        })}
        {chapitres.length === 0 && <Card><p className="text-[var(--text-muted)]">Pas encore de chapitre publié.</p></Card>}
      </div>

      {devoirs.length > 0 && (
        <>
          <h2 className="mb-2 mt-8 text-lg font-bold">📝 Devoirs types</h2>
          <div className="flex flex-col gap-2">
            {devoirs.map((d) => (
              <Link key={d.id} to={profile.approuve ? `/quiz/${d.id}` : '#'} onClick={(e) => !profile.approuve && e.preventDefault()}>
                <Card variant={profile.approuve ? 'interactive' : 'default'} className={`flex items-center justify-between ${!profile.approuve ? 'opacity-60' : ''}`}>
                  <span className="font-medium">{d.titre}</span>
                  <span className="text-xs text-[var(--text-muted)]">{profile.approuve ? '→' : '🔒 Membres'}</span>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
