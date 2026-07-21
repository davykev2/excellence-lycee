import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'

const LIEUX = ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro']

export default function Landing() {
  const session = useAuthStore((s) => s.session)
  const authLoading = useAuthStore((s) => s.loading)
  const [stats, setStats] = useState(null)
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: statsData }, { data: topData }] = await Promise.all([
        supabase.rpc('get_stats_globales'),
        supabase.rpc('get_classement_quiz_rapide'),
      ])
      setStats(statsData)
      setTop((topData ?? []).slice(0, 5))
      setLoading(false)
    }
    load()
  }, [])

  // Un utilisateur déjà connecté ne doit pas voir la page d'accueil publique
  if (!authLoading && session) return <Navigate to="/dashboard" replace />

  return (
    <div className="game-page">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-20">
        <div className="game-hero grid gap-10 rounded-[2rem] p-6 sm:p-10 lg:grid-cols-[1.08fr_.92fr] lg:items-center">
          <div className="relative">
            <p className="game-eyebrow">🚀 Préparation INP-HB & ESATIC</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-6xl">
              Apprends. Joue. <span className="neon-text">Dépasse-toi.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--text-muted)] sm:text-lg">
              Transforme chaque révision en mission : quiz instantanés, résumés clairs, badges, classements et duels entre élèves.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/signup"><Button className="px-6">Commencer ma progression ⚡</Button></Link>
              <Link to="/login"><Button variant="secondary">J’ai déjà un compte</Button></Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 text-xs text-[var(--text-muted)]">
              <span className="game-kicker">✓ Correction immédiate</span>
              <span className="game-kicker">✓ Duels sécurisés</span>
              <span className="game-kicker">✓ Parcours par classe</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md" aria-label="Aperçu d’une session de quiz">
            <div className="pointer-events-none absolute -inset-6 rounded-full bg-[var(--neon-violet)]/15 blur-3xl" />
            <Card className="relative rotate-1 p-5 shadow-2xl sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-violet)]">Mission express</p>
                  <p className="mt-1 font-bold">Mathématiques · Fonctions</p>
                </div>
                <span className="rounded-full border border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10 px-2.5 py-1 text-xs font-black text-[var(--neon-magenta)]">🔥 ×4</span>
              </div>
              <div className="game-progress h-2.5"><span style={{ width: '72%' }} /></div>
              <p className="mt-6 text-lg font-bold">Quelle est la dérivée de f(x) = x² ?</p>
              <div className="mt-4 grid gap-2">
                {['A · 2x', 'B · x', 'C · 2', 'D · x³'].map((choix, index) => (
                  <div key={choix} className={`rounded-xl border px-4 py-3 text-sm ${index === 0 ? 'border-[var(--neon-green)] bg-[var(--neon-green)]/10 text-[var(--success-text)] shadow-[var(--glow-green)]' : 'border-[var(--border)] text-[var(--text-muted)]'}`}>
                    {choix}{index === 0 ? '  ✓' : ''}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--success-text)]">Bonne réponse !</span>
                <span className="anim-pop rounded-full bg-[var(--neon-cyan)] px-3 py-1 text-sm font-black text-black">+5 XP</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-3 px-4 pb-12 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['01', 'Choisis une matière', 'Travaille exactement le programme de ta classe.'],
          ['02', 'Gagne des points', 'Chaque bonne réponse fait avancer ton parcours.'],
          ['03', 'Débloque des badges', 'Tes efforts deviennent une collection visible.'],
          ['04', 'Défie ta classe', 'Mesure-toi à tes camarades dans un cadre équitable.'],
        ].map(([numero, titre, texte]) => (
          <Card key={numero} variant="interactive" className="min-h-40 p-5">
            <span className="font-mono text-xs font-black text-[var(--neon-violet)]">MISSION {numero}</span>
            <h2 className="mt-4 font-black">{titre}</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{texte}</p>
          </Card>
        ))}
      </section>

      {loading ? (
        <Loader />
      ) : (
        <>
          <section className="mx-auto grid max-w-5xl grid-cols-2 gap-3 px-4 pb-12 sm:grid-cols-4">
            <StatCard label="Élèves inscrits" value={stats?.nb_eleves} color="var(--neon-cyan)" />
            <StatCard label="Questions" value={stats?.nb_questions} color="var(--neon-violet)" />
            <StatCard label="Quiz joués" value={stats?.nb_quiz_joues} color="var(--neon-magenta)" />
            <StatCard label="Établissements" value={stats?.nb_etablissements} color="var(--neon-green)" />
          </section>

          {top.length > 0 && (
            <section className="mx-auto max-w-3xl px-4 pb-16">
              <h2 className="mb-3 text-center text-xl font-bold">🏆 Top Quiz rapide</h2>
              <Card>
                <ol className="flex flex-col divide-y divide-[var(--border)]">
                  {top.map((u, i) => (
                    <li key={u.user_id} className="flex items-center justify-between py-2 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-6 text-center text-[var(--text-muted)]">{i + 1}</span>
                        {u.avatar_url ? (
                          <img src={u.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
                        ) : (
                          <span className="h-7 w-7 rounded-full bg-[var(--neon-violet)]/30 grid place-items-center text-xs">
                            {u.username?.[0]?.toUpperCase()}
                          </span>
                        )}
                        {u.username}
                      </span>
                      <span className="font-mono text-[var(--neon-cyan)]">{u.points} pts</span>
                    </li>
                  ))}
                </ol>
              </Card>
            </section>
          )}
        </>
      )}

      <section className="mx-auto max-w-5xl px-4 pb-20 text-center">
        <h2 className="mb-4 text-xl font-bold">Nos centres de formation</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {LIEUX.map((v) => (
            <span key={v} className="rounded-full border border-[var(--border)] px-4 py-1.5 text-sm text-[var(--text-muted)]">
              📍 {v}
            </span>
          ))}
        </div>
        <div className="mt-10">
          <Link to="/signup"><Button>Rejoindre EXCELLENCE LYCÉE</Button></Link>
        </div>
      </section>
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-center">
      <p className="text-2xl font-extrabold" style={{ color, textShadow: `0 0 10px ${color}` }}>
        {value ?? 0}
      </p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </div>
  )
}
