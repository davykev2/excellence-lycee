import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

export default function ChapitreEdit() {
  const [niveaux, setNiveaux] = useState([])
  const [series, setSeries] = useState([])
  const [matieres, setMatieres] = useState([])
  const [niveauId, setNiveauId] = useState('')
  const [serieId, setSerieId] = useState('')
  const [matiereId, setMatiereId] = useState('')

  const [chapitres, setChapitres] = useState([])
  const [loading, setLoading] = useState(false)
  const [ouvert, setOuvert] = useState(null)

  const [nouveauChapitre, setNouveauChapitre] = useState({ titre: '', description: '', ordre: 1 })

  useEffect(() => {
    supabase.from('niveaux').select('*').order('ordre').then(({ data }) => setNiveaux(data ?? []))
    supabase.from('matieres').select('*').order('ordre').then(({ data }) => setMatieres(data ?? []))
  }, [])

  useEffect(() => {
    if (!niveauId) { setSeries([]); return }
    supabase.from('series').select('*').eq('niveau_id', niveauId).order('nom').then(({ data }) => setSeries(data ?? []))
  }, [niveauId])

  const charger = useCallback(async () => {
    if (!matiereId || !serieId) return
    setLoading(true)
    const { data: chs } = await supabase
      .from('chapitres')
      .select('*')
      .eq('matiere_id', matiereId)
      .eq('serie_id', serieId)
      .order('ordre')
    setChapitres(chs ?? [])
    setLoading(false)
  }, [matiereId, serieId])

  useEffect(() => { charger() }, [charger])

  async function creerChapitre(e) {
    e.preventDefault()
    if (!nouveauChapitre.titre) return
    await supabase.from('chapitres').insert({
      matiere_id: matiereId, serie_id: serieId,
      titre: nouveauChapitre.titre, description: nouveauChapitre.description,
      ordre: Number(nouveauChapitre.ordre) || chapitres.length + 1, published: false,
    })
    setNouveauChapitre({ titre: '', description: '', ordre: chapitres.length + 2 })
    charger()
  }

  async function majChapitre(c, patch) {
    await supabase.from('chapitres').update(patch).eq('id', c.id)
    charger()
  }

  async function supprimerChapitre(c) {
    if (!confirm(`Supprimer le chapitre « ${c.titre} » et tous ses quiz ?`)) return
    await supabase.from('chapitres').delete().eq('id', c.id)
    charger()
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <select className="input w-40" value={niveauId} onChange={(e) => { setNiveauId(e.target.value); setSerieId('') }}>
          <option value="">Niveau…</option>
          {niveaux.map((n) => <option key={n.id} value={n.id}>{n.nom}</option>)}
        </select>
        <select className="input w-32" value={serieId} onChange={(e) => setSerieId(e.target.value)} disabled={!niveauId}>
          <option value="">Série…</option>
          {series.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
        </select>
        <select className="input w-56" value={matiereId} onChange={(e) => setMatiereId(e.target.value)}>
          <option value="">Matière…</option>
          {matieres.map((m) => <option key={m.id} value={m.id}>{m.icone} {m.nom}</option>)}
        </select>
      </div>

      {!matiereId || !serieId ? (
        <p className="text-sm text-[var(--text-muted)]">Choisis un niveau, une série et une matière pour gérer les contenus.</p>
      ) : loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="mb-2 text-lg font-bold">📗 Chapitres</h2>
          <div className="mb-4 flex flex-col gap-2">
            {chapitres.map((c) => (
              <Card key={c.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-[var(--text-muted)]">#{c.ordre}</span>
                    <span className="font-medium">{c.titre}</span>
                    <label className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                      <input type="checkbox" checked={c.published} onChange={(e) => majChapitre(c, { published: e.target.checked })} />
                      publié
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/admin/resumes/${c.id}`}><Button variant="ghost">Résumé →</Button></Link>
                    <Link to={`/admin/exercices-guides/${c.id}`}><Button variant="ghost">Exercices →</Button></Link>
                    <Button variant="ghost" onClick={() => setOuvert(ouvert === c.id ? null : c.id)}>{ouvert === c.id ? 'Fermer' : 'Quiz →'}</Button>
                    <Button variant="danger" onClick={() => supprimerChapitre(c)}>Supprimer</Button>
                  </div>
                </div>
                {ouvert === c.id && <QuizDeChapitre chapitreId={c.id} />}
              </Card>
            ))}
            {chapitres.length === 0 && <p className="text-sm text-[var(--text-muted)]">Aucun chapitre.</p>}
          </div>

          <form onSubmit={creerChapitre} className="mb-8 flex flex-wrap items-end gap-2">
            <FieldSmall label="Ordre"><input type="number" className="input w-20" value={nouveauChapitre.ordre} onChange={(e) => setNouveauChapitre((f) => ({ ...f, ordre: e.target.value }))} /></FieldSmall>
            <FieldSmall label="Titre"><input className="input w-56" value={nouveauChapitre.titre} onChange={(e) => setNouveauChapitre((f) => ({ ...f, titre: e.target.value }))} /></FieldSmall>
            <FieldSmall label="Description"><input className="input w-64" value={nouveauChapitre.description} onChange={(e) => setNouveauChapitre((f) => ({ ...f, description: e.target.value }))} /></FieldSmall>
            <Button type="submit">+ Chapitre</Button>
          </form>

          <Card className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold">📝 Devoirs versionnés</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                La création et la modification des devoirs passent par l’atelier dédié afin de préserver les anciennes tentatives des élèves.
              </p>
            </div>
            <Link to="/admin/devoirs">
              <Button variant="ghost">Ouvrir les devoirs →</Button>
            </Link>
          </Card>
        </>
      )}
    </div>
  )
}

function QuizDeChapitre({ chapitreId }) {
  const [quizList, setQuizList] = useState([])
  const [loading, setLoading] = useState(true)
  const [nouveau, setNouveau] = useState({ titre: '', numero: 1 })

  const charger = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('quiz').select('*').eq('chapitre_id', chapitreId).eq('type', 'chapitre').order('numero')
    setQuizList(data ?? [])
    setNouveau((n) => ({ ...n, numero: (data?.length ?? 0) + 1 }))
    setLoading(false)
  }, [chapitreId])

  useEffect(() => { charger() }, [charger])

  async function creer(e) {
    e.preventDefault()
    if (!nouveau.titre) return
    await supabase.from('quiz').insert({ chapitre_id: chapitreId, type: 'chapitre', titre: nouveau.titre, numero: Number(nouveau.numero), published: false })
    setNouveau({ titre: '', numero: quizList.length + 2 })
    charger()
  }

  async function togglePublish(q) {
    await supabase.from('quiz').update({ published: !q.published }).eq('id', q.id)
    charger()
  }

  async function supprimer(q) {
    if (!confirm(`Supprimer « ${q.titre} » ?`)) return
    await supabase.from('quiz').delete().eq('id', q.id)
    charger()
  }

  if (loading) return <Loader />

  return (
    <div className="mt-3 border-t border-[var(--border)] pt-3">
      <div className="flex flex-col gap-2">
        {quizList.map((q) => (
          <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded bg-[var(--bg)] p-2">
            <span className="text-sm">#{q.numero} · {q.titre}</span>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <input type="checkbox" checked={q.published} onChange={() => togglePublish(q)} /> publié
              </label>
              <Link to={`/admin/quiz/${q.id}`}><Button variant="ghost">Questions →</Button></Link>
              <Button variant="danger" onClick={() => supprimer(q)}>×</Button>
            </div>
          </div>
        ))}
        {quizList.length === 0 && <p className="text-xs text-[var(--text-muted)]">Aucun quiz.</p>}
      </div>
      <form onSubmit={creer} className="mt-2 flex flex-wrap items-end gap-2">
        <input type="number" className="input w-16" value={nouveau.numero} onChange={(e) => setNouveau((n) => ({ ...n, numero: e.target.value }))} />
        <input placeholder="Titre du quiz" className="input w-56" value={nouveau.titre} onChange={(e) => setNouveau((n) => ({ ...n, titre: e.target.value }))} />
        <Button type="submit">+ Quiz</Button>
      </form>
    </div>
  )
}

function FieldSmall({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
      {label}
      {children}
    </label>
  )
}
