import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import QuestionCard from '../components/quiz/QuestionCard'
import { formatDuration } from '../utils/time'
import CelebrationOverlay from '../components/gamification/CelebrationOverlay'
import { useAudioFeedback } from '../store/useAudioFeedbackStore'

export default function Resultat() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [correctionOuverte, setCorrectionOuverte] = useState(false)
  const [celebration, setCelebration] = useState(false)
  const { play } = useAudioFeedback()

  useEffect(() => {
    let cancelled = false
    supabase.rpc('get_tentative_resultat', { p_tentative_id: id }).then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error.message)
      else setData(data)
    })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!data || Number(data.note) < 16) return
    setCelebration(true)
    play('levelUp')
  }, [data, play])

  if (error) return <div className="p-8 text-center text-[var(--neon-magenta)]">{error}</div>
  if (!data) return <Loader label="Chargement du résultat…" />

  const note = data.note ?? 0
  const couleur = note >= 16 ? 'var(--neon-green)' : note >= 12 ? 'var(--neon-cyan)' : 'var(--neon-magenta)'
  const bonnesReponses = data.questions.filter((question) => question.correcte).length
  const scorePct = Math.max(0, Math.min(100, Math.round((Number(note) / 20) * 100)))
  const replayQuizId = data.quiz.type === 'devoir'
    ? data.quiz.current_quiz_id
    : (data.quiz.current_quiz_id ?? data.quiz.id)

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <Card variant="reward" className="mb-6 overflow-hidden p-5 sm:p-7">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <div
            className="relative mx-auto grid h-40 w-40 place-items-center rounded-full p-3"
            style={{ background: `conic-gradient(${couleur} ${scorePct}%, var(--border) ${scorePct}% 100%)`, boxShadow: `0 0 28px color-mix(in srgb, ${couleur} 28%, transparent)` }}
            role="img"
            aria-label={`Note : ${note} sur 20`}
          >
            <div className="grid h-full w-full place-items-center rounded-full bg-[var(--bg-elevated)] text-center">
              <div>
                <strong className="block text-4xl font-black" style={{ color: couleur }}>{note}</strong>
                <span className="text-sm text-[var(--text-muted)]">sur 20</span>
              </div>
            </div>
          </div>

          <div>
            <p className="game-eyebrow">🏆 Bilan de session</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">{data.quiz.titre}</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              {note >= 16
                ? 'Performance remarquable : ta maîtrise se confirme.'
                : note >= 12
                  ? 'Objectif atteint : la suite de ton parcours est ouverte.'
                  : 'Tu as identifié les points à retravailler. Une nouvelle tentative peut tout changer.'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="game-kicker">✓ {bonnesReponses}/{data.questions.length} réponses</span>
              {data.temps_pris_sec != null && <span className="game-kicker">⏱ {formatDuration(data.temps_pris_sec)}</span>}
              <span className="game-kicker">Tentative {data.numero_tentative ?? 1}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          <Link to="/dashboard" className="game-button inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--neon-cyan)] px-4 py-2 text-sm font-black text-black shadow-[var(--glow-cyan)]">
            Continuer
          </Link>
          {replayQuizId ? (
            <Link to={`/quiz/${replayQuizId}`} className="game-button inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--neon-violet)] px-4 py-2 text-sm font-bold text-[var(--neon-violet)]">
              Rejouer
            </Link>
          ) : (
            <span className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] px-4 py-2 text-center text-xs text-[var(--text-muted)]">
              Aucune version disponible
            </span>
          )}
          <button
            type="button"
            onClick={() => setCorrectionOuverte((ouverte) => !ouverte)}
            className="game-button min-h-11 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-bold"
            aria-expanded={correctionOuverte}
          >
            {correctionOuverte ? 'Masquer' : 'Voir'} la correction
          </button>
        </div>
      </Card>

      {correctionOuverte && (
        <section className="anim-rise">
          <h2 className="mb-3 text-lg font-bold">Correction détaillée</h2>
          <div className="flex flex-col gap-3">
            {data.questions.map((q) => (
              <QuestionCard
                key={q.id}
                question={q}
                selected={q.choix_selectionnes}
                correction={{ correcte: q.correcte, bonnes_reponses: q.bonnes_reponses, explication: q.explication }}
              />
            ))}
          </div>
        </section>
      )}

      <CelebrationOverlay
        open={celebration}
        title="Performance excellente !"
        message={`Tu termines ce quiz avec ${note}/20. Garde ce rythme pour continuer à progresser.`}
        reward={`${bonnesReponses} bonnes réponses`}
        icon="🏆"
        actionLabel="Voir mon bilan"
        onClose={() => setCelebration(false)}
        accent="var(--neon-green)"
      />
    </div>
  )
}
