import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'

export default function ResumeMatiere() {
  const { slug } = useParams()
  const profile = useAuthStore((s) => s.profile)
  const [matiere, setMatiere] = useState(null)
  const [lecons, setLecons] = useState([])
  const [leconsLues, setLeconsLues] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.serie_id) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data: m } = await supabase.from('matieres').select('*').eq('slug', slug).single()
      if (cancelled || !m) { setLoading(false); return }
      setMatiere(m)

      const { data: chs } = await supabase
        .from('chapitres')
        .select('*')
        .eq('matiere_id', m.id)
        .eq('serie_id', profile.serie_id)
        .eq('published', true)
        .order('ordre')
      if (cancelled) return
      setLecons(chs ?? [])
      try {
        setLeconsLues(new Set(JSON.parse(localStorage.getItem('excellence_read_lessons') ?? '[]')))
      } catch {
        setLeconsLues(new Set())
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [slug, profile?.serie_id])

  if (loading) return <Loader />
  if (!matiere) return <div className="p-8 text-center text-[var(--text-muted)]">Matière introuvable.</div>

  const disponibles = lecons.filter((lecon) => lecon.resume_published && lecon.resume)
  const lues = disponibles.filter((lecon) => leconsLues.has(lecon.id)).length
  const pct = disponibles.length ? Math.round((lues / disponibles.length) * 100) : 0

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <Link to="/resumes" className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">
        ← Résumés
      </Link>
      <section className="game-hero mb-7 mt-3 rounded-3xl p-5 sm:p-7">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-[var(--neon-violet)]/40 bg-[var(--neon-violet)]/10 text-4xl shadow-[var(--glow-violet)]">
            {matiere.icone}
          </span>
          <div className="min-w-0 flex-1">
            <p className="game-eyebrow">Parcours de révision</p>
            <h1 className="mt-1 text-3xl font-black">{matiere.nom}</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Avance leçon par leçon, puis teste-toi dans les exercices.</p>
          </div>
          <div className="min-w-36">
            <p className="text-right text-sm font-bold text-[var(--accent-text)]">{lues}/{disponibles.length} lues</p>
            <div className="game-progress mt-2 h-2.5" role="progressbar" aria-label="Progression dans la matière" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}>
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Ton parcours</h2>
        <span className="game-kicker">{disponibles.length} leçons prêtes</span>
      </div>

      <div className="relative flex flex-col gap-3 before:absolute before:bottom-8 before:left-[1.72rem] before:top-8 before:w-px before:bg-[var(--border)]">
        {lecons.map((l, i) => {
          const disponible = l.resume_published && l.resume
          const lue = leconsLues.has(l.id)
          const contenu = (
            <Card
              variant={disponible ? 'interactive' : 'default'}
              className={`flex items-center justify-between gap-3 ${!disponible ? 'opacity-70' : ''}`}
            >
              <div className="flex items-center gap-3">
                <span className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                  lue
                    ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/15 text-[var(--success-text)] shadow-[var(--glow-green)]'
                    : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)]'
                }`}>{lue ? '✓' : i + 1}</span>
                <div>
                  <p className="font-medium">{l.titre}</p>
                  {l.description && <p className="text-xs text-[var(--text-muted)]">{l.description}</p>}
                </div>
              </div>
              {disponible ? (
                <span className="shrink-0 rounded-full border border-[var(--neon-green)] px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-green)]">
                  {lue ? 'Relire →' : 'Lire →'}
                </span>
              ) : (
                <span className="shrink-0 rounded-full border border-[var(--neon-violet)] px-2 py-0.5 text-[10px] font-semibold text-[var(--neon-violet)]">
                  Bientôt
                </span>
              )}
            </Card>
          )
          return disponible ? (
            <Link key={l.id} to={`/resumes/${slug}/${l.id}`}>{contenu}</Link>
          ) : (
            <div key={l.id}>{contenu}</div>
          )
        })}
        {lecons.length === 0 && (
          <Card><p className="text-[var(--text-muted)]">Pas encore de leçon publiée pour cette matière.</p></Card>
        )}
      </div>
    </div>
  )
}
