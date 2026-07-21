import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'

export default function Home() {
  const [stats, setStats] = useState(null)
  const [enAttente, setEnAttente] = useState(0)
  const [signalementsOuverts, setSignalementsOuverts] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: s }, { count: c1 }, { count: c2 }] = await Promise.all([
        supabase.rpc('get_stats_globales'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('approuve', false),
        supabase.from('signalements').select('id', { count: 'exact', head: true }).eq('statut', 'ouvert'),
      ])
      setStats(s)
      setEnAttente(c1 ?? 0)
      setSignalementsOuverts(c2 ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Élèves approuvés" value={stats?.nb_eleves} />
        <StatCard label="Questions" value={stats?.nb_questions} />
        <StatCard label="Quiz joués" value={stats?.nb_quiz_joues} />
        <StatCard label="Établissements" value={stats?.nb_etablissements} />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link to="/admin/contenus" className="sm:col-span-2">
          <Card className="flex items-center justify-between border-[var(--neon-cyan)]/50 hover:border-[var(--neon-cyan)]">
            <div>
              <span className="font-bold">✍️ Atelier éditorial</span>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Modifier les résumés, les exercices et les devoirs déjà publiés.</p>
            </div>
            <span className="text-xl text-[var(--neon-cyan)]">→</span>
          </Card>
        </Link>
        <Link to="/admin/users">
          <Card className="flex items-center justify-between hover:border-[var(--neon-magenta)]">
            <span>👤 Comptes en attente d'approbation</span>
            <span className="rounded-full bg-[var(--neon-violet)] px-2 py-0.5 text-xs text-black">{enAttente}</span>
          </Card>
        </Link>
        <Link to="/admin/signalements">
          <Card className="flex items-center justify-between hover:border-[var(--neon-magenta)]">
            <span>🚩 Signalements ouverts</span>
            <span className="rounded-full bg-[var(--neon-magenta)] px-2 py-0.5 text-xs text-black">{signalementsOuverts}</span>
          </Card>
        </Link>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <Card className="text-center">
      <p className="text-xl font-bold text-[var(--neon-cyan)]">{value ?? 0}</p>
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
    </Card>
  )
}
