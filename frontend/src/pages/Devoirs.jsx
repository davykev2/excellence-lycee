import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'

export default function Devoirs() {
  const profile = useAuthStore((s) => s.profile)
  const [devoirs, setDevoirs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.serie_id) return
    supabase
      .from('quiz')
      .select('*, matieres(nom, icone)')
      .eq('serie_id', profile.serie_id)
      .eq('type', 'devoir')
      .eq('published', true)
      .order('numero')
      .then(({ data }) => {
        setDevoirs(data ?? [])
        setLoading(false)
      })
  }, [profile?.serie_id])

  if (loading) return <Loader />

  // Regroupe les devoirs par matière
  const parMatiere = new Map()
  for (const d of devoirs) {
    const nom = d.matieres?.nom ?? 'Autre'
    if (!parMatiere.has(nom)) parMatiere.set(nom, { icone: d.matieres?.icone, liste: [] })
    parMatiere.get(nom).liste.push(d)
  }

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <section className="game-hero mb-7 rounded-3xl p-5 sm:p-7">
        <p className="game-eyebrow">📝 Mode examen</p>
        <h1 className="mt-2 text-3xl font-black">Devoirs types</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Conditions réelles : chronomètre, trois tentatives maximum et une note sur 20.</p>
        <div className="mt-4 flex flex-wrap gap-2"><span className="game-kicker">⏱ Temps limité</span><span className="game-kicker">🎯 Objectif 12/20</span><span className="game-kicker">3 essais</span></div>
      </section>

      {!profile?.approuve && (
        <Card className="mb-6 border-[var(--neon-violet)]">
          <p className="text-sm">🔒 Les devoirs sont réservés aux membres approuvés.</p>
        </Card>
      )}

      {devoirs.length === 0 ? (
        <Card><p className="text-[var(--text-muted)]">Aucun devoir publié pour ta classe pour le moment.</p></Card>
      ) : (
        [...parMatiere.entries()].map(([nom, { icone, liste }]) => (
          <div key={nom} className="mb-6">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
              <span>{icone}</span> {nom}
            </h2>
            <div className="flex flex-col gap-2">
              {liste.map((d) => (
                <Link
                  key={d.id}
                  to={profile?.approuve ? `/quiz/${d.id}` : '#'}
                  onClick={(e) => !profile?.approuve && e.preventDefault()}
                >
                  <Card variant={profile?.approuve ? 'interactive' : 'default'} className={`flex min-h-20 items-center justify-between ${profile?.approuve ? '' : 'opacity-60'}`}>
                    <span className="font-medium">{d.titre}</span>
                    <span className="text-xs text-[var(--text-muted)]">
                      ⏱ {Math.round((d.duree_sec ?? 2700) / 60)} min {profile?.approuve ? '→' : '🔒'}
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
