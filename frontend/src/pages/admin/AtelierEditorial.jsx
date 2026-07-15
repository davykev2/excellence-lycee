import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Loader from '../../components/ui/Loader'

const OUTILS = [
  {
    to: '/admin/resumes',
    icon: '📖',
    titre: 'Résumés',
    description: 'Corriger un résumé publié, travailler dans un brouillon privé et suivre les commentaires des élèves.',
    accent: 'var(--neon-violet)',
    statKey: 'resumes',
  },
  {
    to: '/admin/exercices-guides',
    icon: '✏️',
    titre: 'Exercices guidés',
    description: 'Modifier les exercices existants, leurs questions et leurs corrections sans perdre les niveaux inchangés.',
    accent: 'var(--neon-cyan)',
    statKey: 'exercices',
  },
  {
    to: '/admin/devoirs',
    icon: '📝',
    titre: 'Devoirs',
    description: 'Rouvrir un devoir, ajuster sa durée et ses questions, puis publier une nouvelle version complète.',
    accent: 'var(--neon-magenta)',
    statKey: 'devoirs',
  },
]

export default function AtelierEditorial() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      supabase.from('chapitres').select('id, published, resume, resume_published'),
      supabase.from('packs_entrainement').select('chapitre_id, published'),
      supabase.from('quiz').select('id, devoir_id, type, published').eq('type', 'devoir'),
      supabase.from('lecon_commentaires').select('id', { count: 'exact', head: true }),
    ]).then(([chapitresResult, packsResult, devoirsResult, commentairesResult]) => {
      if (cancelled) return
      const chapitres = chapitresResult.data ?? []
      const packs = packsResult.data ?? []
      const devoirs = devoirsResult.data ?? []
      const devoirIds = new Set(devoirs.map((devoir) => devoir.devoir_id ?? devoir.id))
      const devoirsPublies = new Set(
        devoirs.filter((devoir) => devoir.published).map((devoir) => devoir.devoir_id ?? devoir.id),
      )
      const chapitresAvecExercices = new Set(
        packs.filter((pack) => pack.published).map((pack) => pack.chapitre_id),
      )

      setStats({
        resumes: {
          publiés: chapitres.filter((chapitre) => chapitre.published && chapitre.resume_published && chapitre.resume?.trim()).length,
          total: chapitres.length,
        },
        exercices: {
          publiés: chapitresAvecExercices.size,
          total: chapitres.length,
        },
        devoirs: {
          publiés: devoirsPublies.size,
          total: devoirIds.size,
        },
        commentaires: commentairesResult.count ?? 0,
      })
    })

    return () => { cancelled = true }
  }, [])

  if (!stats) return <Loader label="Chargement de l’atelier…" />

  return (
    <div>
      <section className="game-hero mb-6 rounded-3xl p-5 sm:p-7">
        <p className="game-eyebrow">Atelier éditorial</p>
        <h2 className="mt-2 text-2xl font-black sm:text-3xl">Rouvre, améliore et republie tes contenus</h2>
        <p className="mt-2 max-w-3xl text-sm text-[var(--text-muted)]">
          Chaque outil charge ce qui existe déjà. Tu peux corriger progressivement, vérifier l’aperçu élève et publier seulement lorsque la nouvelle version est prête.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="game-kicker">💬 {stats.commentaires} commentaire{stats.commentaires > 1 ? 's' : ''} élève</span>
          <span className="game-kicker">🔒 Brouillons privés</span>
          <span className="game-kicker">🕘 Historique conservé</span>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        {OUTILS.map((outil) => {
          const stat = stats[outil.statKey]
          const pourcentage = stat.total ? Math.round((stat.publiés / stat.total) * 100) : 0
          return (
            <Link key={outil.to} to={outil.to} className="group min-w-0">
              <Card variant="interactive" className="flex h-full min-h-64 flex-col justify-between overflow-hidden p-5">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl border bg-[var(--bg)]/50 text-3xl"
                      style={{ borderColor: `color-mix(in srgb, ${outil.accent} 55%, transparent)` }}
                    >
                      {outil.icon}
                    </span>
                    <span className="text-xl text-[var(--text-muted)] transition group-hover:translate-x-1 group-hover:text-[var(--text)]">→</span>
                  </div>
                  <h3 className="mt-5 text-xl font-black">{outil.titre}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{outil.description}</p>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[var(--text-muted)]">Contenus actuellement publiés</span>
                    <strong style={{ color: outil.accent }}>{stat.publiés}/{stat.total}</strong>
                  </div>
                  <div className="game-progress mt-2 h-2" role="progressbar" aria-label={`Couverture ${outil.titre}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={pourcentage}>
                    <span style={{ width: `${pourcentage}%`, background: outil.accent }} />
                  </div>
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      <Card className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold">Structure des classes et des matières</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Crée les chapitres et les emplacements de devoir avant de rédiger leur contenu.</p>
        </div>
        <Link to="/admin/catalogue" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold hover:border-[var(--neon-cyan)] hover:text-[var(--neon-cyan)]">
          Ouvrir le catalogue →
        </Link>
      </Card>
    </div>
  )
}
