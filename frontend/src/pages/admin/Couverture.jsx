import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'

// Matrice de couverture des contenus : pour chaque niveau × série, état de
// publication des leçons, résumés, exercices (quiz de chapitre) et devoirs.
export default function Couverture() {
  const [donnees, setDonnees] = useState(null)
  const [hasResumeCol, setHasResumeCol] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const [{ data: niveaux }, { data: series }, { data: matieres }, { data: liaisons }, chapitresRes, { data: quiz }] =
        await Promise.all([
          supabase.from('niveaux').select('*').order('ordre'),
          supabase.from('series').select('*').order('nom'),
          supabase.from('matieres').select('*').order('ordre'),
          supabase.from('matieres_series').select('*'),
          supabase.from('chapitres').select('*'),
          supabase.from('quiz').select('id, devoir_id, chapitre_id, matiere_id, serie_id, type, published'),
        ])
      if (cancelled) return

      const chapitres = chapitresRes.data ?? []
      setHasResumeCol(chapitres.length === 0 || 'resume_published' in chapitres[0])

      // Statistiques par (serie_id, matiere_id)
      const stats = new Map()
      const cle = (serieId, matiereId) => `${serieId}|${matiereId}`
      const vide = () => ({
        lecons: { pub: 0, total: 0 },
        resumes: { pub: 0, total: 0 },
        exercices: { pub: 0, total: 0 },
        devoirs: { pub: 0, total: 0 },
      })
      const get = (serieId, matiereId) => {
        const k = cle(serieId, matiereId)
        if (!stats.has(k)) stats.set(k, vide())
        return stats.get(k)
      }

      const chapitreVers = new Map() // chapitre_id -> {serie_id, matiere_id}
      for (const c of chapitres) {
        if (!c.serie_id) continue
        chapitreVers.set(c.id, { serie_id: c.serie_id, matiere_id: c.matiere_id })
        const s = get(c.serie_id, c.matiere_id)
        s.lecons.total += 1
        if (c.published) s.lecons.pub += 1
        s.resumes.total += 1
        if (c.published && c.resume_published && c.resume?.trim()) s.resumes.pub += 1
      }

      const devoirsParId = new Map()
      for (const q of quiz ?? []) {
        if (q.type === 'chapitre') {
          const ref = chapitreVers.get(q.chapitre_id)
          if (!ref) continue
          const s = get(ref.serie_id, ref.matiere_id)
          s.exercices.total += 1
          if (q.published) s.exercices.pub += 1
        } else if (q.type === 'devoir' && q.serie_id) {
          const devoirId = q.devoir_id ?? q.id
          const courant = devoirsParId.get(devoirId)
          devoirsParId.set(devoirId, {
            serie_id: q.serie_id,
            matiere_id: q.matiere_id,
            published: Boolean(q.published || courant?.published),
          })
        }
      }

      for (const devoir of devoirsParId.values()) {
        const s = get(devoir.serie_id, devoir.matiere_id)
        s.devoirs.total += 1
        if (devoir.published) s.devoirs.pub += 1
      }

      setDonnees({ niveaux: niveaux ?? [], series: series ?? [], matieres: matieres ?? [], liaisons: liaisons ?? [], stats })
    }

    load()
    return () => { cancelled = true }
  }, [])

  if (!donnees) return <Loader />

  const { niveaux, series, matieres, liaisons, stats } = donnees
  const matieresDeSerie = (serieId) =>
    liaisons
      .filter((l) => l.serie_id === serieId)
      .map((l) => matieres.find((m) => m.id === l.matiere_id))
      .filter(Boolean)
      .sort((a, b) => a.ordre - b.ordre)

  return (
    <div>
      <p className="mb-4 text-sm text-[var(--text-muted)]">
        État de publication des contenus par classe : <Legende couleur="var(--neon-green)" label="tout publié" /> ·{' '}
        <Legende couleur="var(--neon-violet)" label="partiellement publié" /> ·{' '}
        <Legende couleur="var(--neon-magenta)" label="créé mais rien de publié" /> · <span className="text-[var(--text-muted)]">— : aucun contenu</span>
      </p>

      {!hasResumeCol && (
        <Card className="mb-4 border-[var(--neon-violet)]">
          <p className="text-sm">
            ℹ️ Le suivi des <strong>résumés</strong> nécessite une mise à jour de la base : exécute le bloc
            « résumés » de <code className="text-xs">supabase/schema.sql</code> dans le SQL Editor (2 lignes
            <code className="text-xs"> alter table</code>). En attendant, la colonne affiche —.
          </p>
        </Card>
      )}

      {niveaux.map((n) => {
        const seriesDuNiveau = series.filter((s) => s.niveau_id === n.id)
        return (
          <div key={n.id} className="mb-8">
            <h2 className="mb-3 text-lg font-bold neon-text">{n.nom}</h2>
            <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
              {seriesDuNiveau.map((s) => (
                <Card key={s.id} className="p-0">
                  <p className="border-b border-[var(--border)] px-4 py-2.5 text-sm font-semibold">
                    Série {s.nom}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-[var(--text-muted)]">
                          <th className="px-4 py-2 text-left font-medium">Matière</th>
                          <th className="px-2 py-2 text-center font-medium">Leçons</th>
                          <th className="px-2 py-2 text-center font-medium">Résumés</th>
                          <th className="px-2 py-2 text-center font-medium">Exercices</th>
                          <th className="px-2 py-2 pr-4 text-center font-medium">Devoirs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matieresDeSerie(s.id).map((m) => {
                          const st = stats.get(`${s.id}|${m.id}`)
                          return (
                            <tr key={m.id} className="border-t border-[var(--border)]/60">
                              <td className="whitespace-nowrap px-4 py-2">{m.icone} {m.nom}</td>
                              <CelluleStat stat={st?.lecons} />
                              <CelluleStat stat={hasResumeCol ? st?.resumes : null} />
                              <CelluleStat stat={st?.exercices} />
                              <CelluleStat stat={st?.devoirs} dernier />
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function CelluleStat({ stat, dernier = false }) {
  let contenu = <span className="text-[var(--text-muted)]">—</span>
  if (stat && stat.total > 0) {
    const couleur =
      stat.pub === stat.total ? 'var(--neon-green)' : stat.pub > 0 ? 'var(--neon-violet)' : 'var(--neon-magenta)'
    contenu = (
      <span
        className="inline-block min-w-11 rounded-full border px-1.5 py-0.5 font-mono text-xs"
        style={{ color: couleur, borderColor: couleur }}
      >
        {stat.pub}/{stat.total}
      </span>
    )
  }
  return <td className={`px-2 py-2 text-center ${dernier ? 'pr-4' : ''}`}>{contenu}</td>
}

function Legende({ couleur, label }) {
  return (
    <span className="whitespace-nowrap">
      <span className="inline-block h-2 w-2 rounded-full align-middle" style={{ background: couleur }} /> {label}
    </span>
  )
}
