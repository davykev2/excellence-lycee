import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import ProgressRing from '../components/ui/ProgressRing'

const NIVEAUX = [
  {
    palier: 'entrainement',
    label: 'Facile',
    icon: '🌱',
    description: 'Consolide les réflexes essentiels.',
    color: 'var(--neon-green)',
    className: 'border-[var(--neon-green)]/45 bg-[var(--neon-green)]/10 text-[var(--neon-green)]',
  },
  {
    palier: 'maitrise',
    label: 'Moyen',
    icon: '⚡',
    description: 'Raisonne et combine les méthodes.',
    color: 'var(--neon-cyan)',
    className: 'border-[var(--neon-cyan)]/45 bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]',
  },
  {
    palier: 'concours',
    label: 'Difficile',
    icon: '🏆',
    description: 'Prépare-toi aux duels et compétitions.',
    color: 'var(--neon-violet)',
    className: 'border-[var(--neon-violet)]/45 bg-[var(--neon-violet)]/10 text-[var(--neon-violet)]',
  },
]

export default function Chapitre() {
  const { id } = useParams()
  const profile = useAuthStore((s) => s.profile)
  const [chapitre, setChapitre] = useState(null)
  const [quizList, setQuizList] = useState([])
  const [niveauxProgression, setNiveauxProgression] = useState([])
  const [meilleuresNotes, setMeilleuresNotes] = useState({})
  const [entrainementError, setEntrainementError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setEntrainementError(false)
      setChapitre(null)
      const { data: c, error: chapitreError } = await supabase
        .from('chapitres')
        .select('*, matieres(nom, slug, icone)')
        .eq('id', id)
        .single()
      if (cancelled) return
      if (chapitreError || !c) {
        setLoading(false)
        return
      }
      setChapitre(c)

      const [{ data: qz }, { data: niveaux, error: niveauxError }] = await Promise.all([
        supabase
          .from('quiz')
          .select('*')
          .eq('chapitre_id', id)
          .eq('type', 'chapitre')
          .eq('published', true)
          .is('palier', null)
          .order('numero'),
        supabase.rpc('get_niveaux_exercices_chapitre_v2', { p_chapitre_id: id }),
      ])
      if (cancelled) return
      setQuizList(qz ?? [])
      setNiveauxProgression(Array.isArray(niveaux) ? niveaux : (niveaux?.niveaux ?? []))
      setEntrainementError(Boolean(niveauxError))

      if (qz?.length) {
        const { data: tentatives } = await supabase
          .from('tentatives')
          .select('quiz_id, note')
          .eq('user_id', profile.id)
          .eq('statut', 'terminee')
          .in('quiz_id', qz.map((q) => q.id))
        if (cancelled) return
        const best = {}
        for (const tentative of tentatives ?? []) {
          best[tentative.quiz_id] = Math.max(best[tentative.quiz_id] ?? 0, tentative.note ?? 0)
        }
        setMeilleuresNotes(best)
      } else {
        setMeilleuresNotes({})
      }
      setLoading(false)
    }

    if (profile?.id) load()
    return () => { cancelled = true }
  }, [id, profile?.id])

  const niveaux = useMemo(() => NIVEAUX.map((niveau) => {
    const progression = niveauxProgression.find((item) => item.palier === niveau.palier) ?? {}
    const totalPublie = Math.max(0, Number(progression.exercices_total ?? progression.total ?? 0))
    const valides = Math.min(
      totalPublie,
      Math.max(0, Number(progression.exercices_valides ?? progression.valides ?? 0)),
    )
    return {
      ...niveau,
      titre: progression.titre,
      totalPublie,
      valides,
      pourcentage: totalPublie > 0 ? Math.round((valides / totalPublie) * 100) : 0,
    }
  }), [niveauxProgression])

  if (loading) return <Loader />
  if (!chapitre) return <div className="p-8 text-center text-[var(--text-muted)]">Leçon introuvable.</div>

  const totalPublie = niveaux.reduce((sum, niveau) => sum + niveau.totalPublie, 0)
  const totalValides = Math.min(totalPublie, niveaux.reduce((sum, niveau) => sum + niveau.valides, 0))

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <Link to={`/matiere/${chapitre.matieres?.slug}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">
        ← {chapitre.matieres?.icone} {chapitre.matieres?.nom}
      </Link>

      <section className="game-hero mb-7 mt-3 rounded-3xl p-5 sm:p-7">
        <p className="game-eyebrow">{chapitre.matieres?.icone} Mission de la leçon</p>
        <h1 className="mt-2 text-3xl font-black">{chapitre.titre}</h1>
        {chapitre.description && <p className="mt-2 text-sm text-[var(--text-muted)]">{chapitre.description}</p>}
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="game-kicker">
            {entrainementError
              ? '⚠️ État des exercices indisponible'
              : totalPublie > 0
                ? `✏️ ${totalPublie} exercice${totalPublie > 1 ? 's' : ''} sans note`
                : '✏️ Exercices en préparation'}
          </span>
          {!entrainementError && totalPublie > 0 && (
            <span className="game-kicker" role="status">✓ {totalValides}/{totalPublie} terminés</span>
          )}
          <span className="game-kicker">🎯 {quizList.length} quiz noté{quizList.length > 1 ? 's' : ''}</span>
        </div>
      </section>

      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="game-eyebrow">Zone libre</p>
          <h2 className="mt-1 text-xl font-black">Entraînement sans note</h2>
        </div>
        <span className="text-right text-xs text-[var(--text-muted)]">Une correction complète après validation</span>
      </div>

      {entrainementError && (
        <Card className="mb-3 border-[var(--neon-magenta)]/35 py-4" role="alert">
          <p className="font-semibold">Impossible de charger les exercices pour le moment.</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Réessaie dans quelques instants.</p>
        </Card>
      )}

      {!entrainementError && totalPublie === 0 && (
        <Card className="mb-3 border-[var(--neon-violet)]/35 py-4" role="status">
          <p className="font-semibold">Les exercices de cette leçon ne sont pas encore publiés.</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Chaque niveau deviendra cliquable dès sa mise en ligne.</p>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {niveaux.map((niveau) => {
          const disponible = niveau.totalPublie > 0
          const contenu = (
            <Card
              variant={disponible ? 'interactive' : 'default'}
              className={`flex h-full min-h-52 flex-col justify-between p-4 ${!disponible ? 'opacity-65' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${niveau.className}`}>
                  <span aria-hidden="true">{niveau.icon}</span>
                  {niveau.label}
                </span>
                {disponible ? (
                  <ProgressRing value={niveau.pourcentage} size={54} color={niveau.color} />
                ) : (
                  <span
                    className="grid h-[54px] w-[54px] place-items-center rounded-full border border-dashed border-[var(--border)] text-lg text-[var(--text-muted)]"
                    aria-label={`Aucune progression disponible pour le niveau ${niveau.label.toLowerCase()}`}
                  >
                    —
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="font-black">{niveau.titre || `Niveau ${niveau.label.toLowerCase()}`}</p>
                <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">{niveau.description}</p>
              </div>
              <p className="mt-4 text-xs font-bold text-[var(--text)]">
                {disponible
                  ? `${niveau.valides}/${niveau.totalPublie} terminés →`
                  : entrainementError
                    ? 'Chargement indisponible'
                    : 'Pas encore publié'}
              </p>
            </Card>
          )

          return disponible ? (
            <Link key={niveau.palier} to={`/entrainement/${id}/${niveau.palier}`}>{contenu}</Link>
          ) : (
            <div key={niveau.palier} aria-disabled="true">{contenu}</div>
          )
        })}
      </div>

      <div className="mb-3 mt-9">
        <p className="game-eyebrow">Mode challenge</p>
        <h2 className="mt-1 text-xl font-black">Quiz notés</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">Les résultats de cette section comptent dans ta progression et tes classements.</p>
      </div>

      <div className="flex flex-col gap-2">
        {quizList.map((quiz, index) => {
          const prevNote = index > 0 ? meilleuresNotes[quizList[index - 1].id] : null
          const verrouille = index > 0 && (prevNote ?? 0) < 12
          const note = meilleuresNotes[quiz.id]

          return (
            <Link key={quiz.id} to={verrouille ? '#' : `/quiz/${quiz.id}`} onClick={(event) => verrouille && event.preventDefault()}>
              <Card variant={verrouille ? 'default' : 'interactive'} className={`flex min-h-20 items-center justify-between gap-3 ${verrouille ? 'opacity-60' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--border)] text-sm font-black tabular-nums">{quiz.numero}</span>
                  <div className="min-w-0">
                    <p className="font-medium">{quiz.titre}</p>
                    <p className="text-xs text-[var(--text-muted)]">Objectif de déblocage : 12/20</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  {note !== undefined && (
                    <span className={note >= 12 ? 'text-[var(--neon-green)]' : 'text-[var(--neon-magenta)]'}>{note}/20</span>
                  )}
                  <span>{verrouille ? '🔒' : '→'}</span>
                </div>
              </Card>
            </Link>
          )
        })}
        {quizList.length === 0 && (
          <Card className="py-7 text-center">
            <p className="text-2xl">🎯</p>
            <p className="mt-2 font-semibold">Le prochain quiz noté est en préparation.</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">Profite des trois niveaux d’entraînement pour prendre de l’avance.</p>
          </Card>
        )}
      </div>
    </div>
  )
}
