import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import ProgressBar from '../components/quiz/ProgressBar'
import Timer from '../components/quiz/Timer'
import QuestionCard from '../components/quiz/QuestionCard'
import QuizSessionHeader from '../components/quiz/QuizSessionHeader'
import { useAudioFeedback } from '../store/useAudioFeedbackStore'

const ERREURS = {
  quiz_verrouille: "Ce quiz n'est pas encore débloqué : obtiens au moins 12/20 au quiz précédent.",
  contenu_reserve_membres: 'Ce contenu est réservé aux membres approuvés par un admin.',
  contenu_non_autorise: 'Ce devoir est réservé aux élèves de la classe concernée.',
  quota_tentatives_atteint: "Tu as déjà utilisé tes 3 tentatives pour ce devoir.",
  quiz_introuvable: 'Ce quiz est introuvable ou non publié.',
  temps_ecoule: "Le temps imparti est écoulé. Cette tentative ne peut plus être envoyée.",
  tentative_close: 'Cette tentative est déjà terminée.',
}

export default function Quiz() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [state, setState] = useState(null)
  const [error, setError] = useState('')
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // question_id -> { choix, correcte, bonnes_reponses, explication, points }
  const [texte, setTexte] = useState('')
  const [points, setPoints] = useState(0)
  const [lastGain, setLastGain] = useState(null)
  const [streak, setStreak] = useState(0)
  const [busy, setBusy] = useState(false)
  const [finishing, setFinishing] = useState(false)
  const finalizedRef = useRef(false)
  const { play } = useAudioFeedback()

  // Démarrage + reprise éventuelle d'une tentative en cours
  useEffect(() => {
    let cancelled = false
    async function start() {
      setError('')
      const { data, error } = await supabase.rpc('start_tentative', { p_quiz_id: id })
      if (cancelled) return
      if (error) { setError(ERREURS[error.message] ?? error.message); return }

      // Restaure les réponses déjà enregistrées (reprise après rechargement)
      const { data: rep } = await supabase
        .from('reponses')
        .select('question_id, correcte')
        .eq('tentative_id', data.tentative_id)
      if (cancelled) return

      const done = {}
      let pts = 0
      for (const q of data.questions) {
        const r = rep?.find((x) => x.question_id === q.id)
        if (r) {
          done[q.id] = { correcte: r.correcte, resumed: true, points: q.points }
          if (r.correcte) pts += q.points || 0
        }
      }
      const firstUnanswered = data.questions.findIndex((q) => !done[q.id])
      setState(data)
      setAnswers(done)
      setPoints(pts)
      setIndex(firstUnanswered === -1 ? Math.max(0, data.questions.length - 1) : firstUnanswered)
    }
    start()
    return () => { cancelled = true }
  }, [id])

  const finalize = useCallback(async () => {
    if (finalizedRef.current || !state) return
    finalizedRef.current = true
    setFinishing(true)
    const { error } = await supabase.rpc('finalize_tentative', { p_tentative_id: state.tentative_id })
    setFinishing(false)
    if (error) {
      setError(ERREURS[error.message] ?? error.message)
      finalizedRef.current = false
      return
    }
    navigate(`/resultat/${state.tentative_id}`, { replace: true })
  }, [state, navigate])

  // Envoie une réponse (QCM : choix ; texte : valeur saisie) et affiche la correction
  const answer = useCallback(async (question, choix) => {
    if (busy || answers[question.id]) return
    setBusy(true)
    const { data, error } = await supabase.rpc('answer_question', {
      p_tentative_id: state.tentative_id,
      p_question_id: question.id,
      p_choix: choix,
    })
    setBusy(false)
    if (error) {
      setError(ERREURS[error.message] ?? error.message)
      play('error')
      return
    }

    setAnswers((a) => ({ ...a, [question.id]: { choix, ...data } }))
    if (data.correcte && data.points) {
      setPoints((p) => p + data.points)
      setLastGain({ n: data.points, key: `${question.id}-${Date.now()}` })
      setStreak((value) => value + 1)
      play('success')
    } else {
      setStreak(0)
      play('error')
    }
  }, [busy, answers, state, play])

  if (error) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <Card>
          <p className="mb-4 text-[var(--neon-magenta)]">{error}</p>
          <Button onClick={() => navigate(-1)}>Retour</Button>
        </Card>
      </div>
    )
  }

  if (!state) return <Loader label="Préparation du quiz…" />

  const question = state.questions[index]
  const total = state.questions.length
  const isLast = index === total - 1
  const current = question ? answers[question.id] : null
  const answered = !!current
  const maxPoints = state.questions.reduce((s, q) => s + (q.points || 0), 0)

  function next() {
    setTexte('')
    if (isLast) finalize()
    else setIndex((i) => i + 1)
  }

  return (
    <div className="game-page mx-auto max-w-2xl px-4 py-8">
      <QuizSessionHeader points={points} maxPoints={maxPoints} lastGain={lastGain} streak={streak} />

      <div className="mb-3 flex items-center justify-between gap-3">
        <h1 className="text-base font-bold">{state.quiz.titre}</h1>
        {state.quiz.type === 'devoir' && state.date_fin_theorique && (
          <Timer dateFinTheorique={state.date_fin_theorique} onExpire={finalize} />
        )}
      </div>

      <div className="mb-4">
        <ProgressBar current={index + 1} total={total} />
      </div>

      {question && (
        <div key={question.id} className="anim-pop">
        <QuestionCard
          question={question}
          selected={current?.choix}
          onSelect={(choix) => answer(question, choix)}
          textValue={texte}
          onTextChange={setTexte}
          onSubmitText={() => answer(question, texte.trim())}
          correction={answered ? current : null}
          disabled={answered || busy}
        />
        </div>
      )}

      <div className="sticky bottom-20 z-20 mt-4 flex items-center justify-end rounded-2xl border border-[var(--border)] bg-[var(--bg)]/88 p-3 backdrop-blur lg:bottom-3">
        {answered ? (
          <Button onClick={next} disabled={finishing}>
            {finishing ? 'Correction…' : isLast ? 'Voir mon résultat 🎉' : 'Continuer →'}
          </Button>
        ) : (
          <span className="text-xs text-[var(--text-muted)]">
            {question?.type === 'texte' ? 'Saisis puis valide ta réponse' : 'Choisis ta réponse'}
          </span>
        )}
      </div>
    </div>
  )
}
