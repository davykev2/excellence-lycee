import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'
import { formatDateTime } from '../../utils/time'

export default function Signalements() {
  const [items, setItems] = useState([])
  const [filtre, setFiltre] = useState('ouvert')
  const [loading, setLoading] = useState(true)
  const [reponses, setReponses] = useState({})

  async function charger() {
    setLoading(true)
    const { data } = await supabase
      .from('signalements')
      .select('*, profiles(username), questions(enonce)')
      .order('created_at', { ascending: false })
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { charger() }, [])

  async function traiter(id, statut) {
    await supabase.from('signalements').update({ statut, reponse_admin: reponses[id] ?? null }).eq('id', id)
    charger()
  }

  const filtres = items.filter((s) => filtre === 'tous' || s.statut === filtre)

  if (loading) return <Loader />

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {[['ouvert', 'Ouverts'], ['traite', 'Traités'], ['rejete', 'Rejetés'], ['tous', 'Tous']].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFiltre(k)}
            className={`rounded-full border px-3 py-1.5 text-sm cursor-pointer transition ${
              filtre === k ? 'border-[var(--neon-magenta)] text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10' : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {filtres.map((s) => (
          <Card key={s.id}>
            <p className="text-xs text-[var(--text-muted)]">{s.profiles?.username} · {formatDateTime(s.created_at)}</p>
            <p className="mt-1 text-sm font-medium">{s.questions?.enonce}</p>
            <p className="mt-1 text-sm text-[var(--neon-magenta)]">« {s.motif} »</p>

            {s.statut === 'ouvert' ? (
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  placeholder="Réponse (optionnelle)"
                  className="input"
                  value={reponses[s.id] ?? ''}
                  onChange={(e) => setReponses((r) => ({ ...r, [s.id]: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button onClick={() => traiter(s.id, 'traite')}>Marquer traité</Button>
                  <Button variant="ghost" onClick={() => traiter(s.id, 'rejete')}>Rejeter</Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-[var(--text-muted)]">
                Statut : <strong>{s.statut}</strong>{s.reponse_admin ? ` — ${s.reponse_admin}` : ''}
              </p>
            )}
          </Card>
        ))}
        {filtres.length === 0 && <p className="text-sm text-[var(--text-muted)]">Aucun signalement.</p>}
      </div>
    </div>
  )
}
