import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import { CLASSEMENT_TABS } from '../utils/constants'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import Avatar from '../components/ui/Avatar'

export default function Classement() {
  const profile = useAuthStore((s) => s.profile)
  const [tab, setTab] = useState('classe')
  const [matieres, setMatieres] = useState([])
  const [matiereId, setMatiereId] = useState('')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.serie_id) return
    supabase.from('matieres_series').select('matieres(id, nom, icone)').eq('serie_id', profile.serie_id)
      .then(({ data }) => {
        const list = (data ?? []).map((r) => r.matieres).filter(Boolean)
        setMatieres(list)
        if (list.length) setMatiereId((current) => current || list[0].id)
      })
  }, [profile?.serie_id])

  useEffect(() => {
    if (!profile?.niveau_id || !profile?.serie_id) return
    let cancelled = false
    async function load() {
      setLoading(true)
      let data = []
      if (tab === 'classe') {
        const r = await supabase.rpc('get_classement_classe', { p_niveau_id: profile.niveau_id, p_serie_id: profile.serie_id })
        data = r.data ?? []
      } else if (tab === 'matiere' && matiereId) {
        const r = await supabase.rpc('get_classement_matiere', { p_matiere_id: matiereId, p_niveau_id: profile.niveau_id, p_serie_id: profile.serie_id })
        data = r.data ?? []
      } else if (tab === 'etablissement') {
        const r = await supabase.rpc('get_classement_etablissement')
        data = r.data ?? []
      } else if (tab === 'quiz_rapide') {
        const r = await supabase.rpc('get_classement_quiz_rapide')
        data = r.data ?? []
      }
      if (!cancelled) {
        setRows(data)
        setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tab, matiereId, profile?.niveau_id, profile?.serie_id])

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <section className="game-hero mb-6 rounded-3xl p-5 text-center sm:p-7">
        <p className="game-eyebrow">🏆 Arène des classements</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Grimpe place après place</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-[var(--text-muted)]">Compare ta progression, repère les meilleurs scores et lance ta prochaine session.</p>
      </section>

      <div className="mb-4 flex flex-wrap gap-2">
        {CLASSEMENT_TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-3 py-1.5 text-sm cursor-pointer transition ${
              tab === t.key ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10' : 'border-[var(--border)] text-[var(--text-muted)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'matiere' && matieres.length > 0 && (
        <select value={matiereId} onChange={(e) => setMatiereId(e.target.value)} className="input mb-4 max-w-xs">
          {matieres.map((m) => <option key={m.id} value={m.id}>{m.icone} {m.nom}</option>)}
        </select>
      )}

      {loading ? (
        <Loader />
      ) : (
        <>
        {rows.length >= 3 && tab !== 'etablissement' && (
          <div className="mb-5 grid grid-cols-3 items-end gap-2" aria-label="Podium">
            {[rows[1], rows[0], rows[2]].map((r, index) => {
              const place = [2, 1, 3][index]
              const height = ['min-h-32', 'min-h-40', 'min-h-28'][index]
              return (
                <Link key={r.user_id} to={`/profil/${r.user_id}`} className={`game-card flex ${height} flex-col items-center justify-end rounded-2xl border border-[var(--border)] bg-[var(--bg-elevated)] p-3 text-center transition hover:border-[var(--neon-cyan)]`}>
                  <span className="text-2xl">{['🥈', '🥇', '🥉'][index]}</span>
                  <Avatar userId={r.user_id} avatarUrl={r.avatar_url} username={r.username} size="mt-2 h-10 w-10" />
                  <span className="mt-1 max-w-full truncate text-xs font-bold">{r.username}</span>
                  <span className="text-[11px] font-mono text-[var(--accent-text)]">#{place} · {r.points} pts</span>
                </Link>
              )
            })}
          </div>
        )}
        <Card>
          {rows.length === 0 ? (
            <p className="py-6 text-center text-[var(--text-muted)]">Aucune donnée pour l'instant.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-[var(--border)]">
              {rows.map((r, i) => (
                <li key={r.user_id ?? r.etablissement} className={`flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm ${r.user_id === profile?.id ? 'bg-[var(--neon-cyan)]/10 ring-1 ring-[var(--neon-cyan)]/40' : ''}`}>
                  <span className="flex items-center gap-3">
                    <span className={`w-7 text-center font-mono ${i < 3 ? 'text-[var(--neon-cyan)]' : 'text-[var(--text-muted)]'}`}>
                      {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                    </span>
                    {tab === 'etablissement' ? (
                      <span>{r.etablissement} <span className="text-xs text-[var(--text-muted)]">({r.nb_eleves} élèves)</span></span>
                    ) : (
                      <Link to={`/profil/${r.user_id}`} className="flex items-center gap-2 hover:text-[var(--neon-cyan)]">
                        <Avatar userId={r.user_id} avatarUrl={r.avatar_url} username={r.username} size="h-7 w-7" />
                        {r.username}
                      </Link>
                    )}
                  </span>
                  <span className="font-mono text-[var(--neon-cyan)]">
                    {tab === 'etablissement' ? `${r.points_moyen} pts moy.` : `${r.points} pts`}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Card>
        </>
      )}
    </div>
  )
}
