import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'

export default function Exercices() {
  const profile = useAuthStore((s) => s.profile)
  const [matieres, setMatieres] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.serie_id) return
    supabase
      .from('matieres_series')
      .select('matieres(id, nom, slug, icone, ordre)')
      .eq('serie_id', profile.serie_id)
      .then(({ data }) => {
        const list = (data ?? []).map((r) => r.matieres).filter(Boolean).sort((a, b) => a.ordre - b.ordre)
        setMatieres(list)
        setLoading(false)
      })
  }, [profile?.serie_id])

  if (loading) return <Loader />

  return (
    <div className="game-page mx-auto max-w-5xl px-4 py-8">
      <section className="game-hero mb-7 rounded-3xl p-5 sm:p-7">
        <p className="game-eyebrow">✏️ Zone d’entraînement</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Choisis ton terrain de jeu</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Trois niveaux sans note, correction détaillée après validation, puis des quiz pour te challenger.</p>
      </section>

      {matieres.length === 0 ? (
        <Card><p className="text-[var(--text-muted)]">Aucune matière configurée pour ta série.</p></Card>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {matieres.map((m) => (
            <Link key={m.id} to={`/matiere/${m.slug}`}>
              <Card variant="interactive" className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center">
                <span className="text-3xl">{m.icone}</span>
                <span className="text-sm font-medium">{m.nom}</span>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
