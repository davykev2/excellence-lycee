import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import QuizSessionHeader from '../components/quiz/QuizSessionHeader'
import { useAudioFeedback } from '../store/useAudioFeedbackStore'

const PALIER = 50 // points par palier pour la barre de progression

const ERREURS = {
  contenu_insuffisant: "Aucune question de quiz rapide n'est encore disponible pour cette matière.",
  matiere_non_autorisee: "Cette matière n'est pas disponible pour ta classe.",
  question_expiree: 'Cette question a expiré. Demande une nouvelle question.',
  question_deja_repondue: 'Cette question a déjà été validée.',
  question_introuvable: 'Cette question n’est plus disponible.',
  choix_invalide: 'Cette proposition n’est plus disponible. Demande une nouvelle question.',
  trop_rapide: 'Attends un instant avant de répondre à nouveau.',
}

const QUESTIONS_A_RENOUVELER = new Set([
  'question_expiree',
  'question_deja_repondue',
  'question_introuvable',
  'choix_invalide',
])

function codeErreur(error) {
  const message = String(error?.message ?? error ?? '')
  return Object.keys(ERREURS).find((code) => message.includes(code)) ?? message
}

export default function QuizRapide() {
  const profile = useAuthStore((s) => s.profile)
  const [matieres, setMatieres] = useState([])
  const [matiere, setMatiere] = useState(null)
  const [question, setQuestion] = useState(null)
  const [questionLoading, setQuestionLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [correction, setCorrection] = useState(null)
  const [justification, setJustification] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sessionPoints, setSessionPoints] = useState(0)
  const [sessionQuestions, setSessionQuestions] = useState(0)
  const [lastGain, setLastGain] = useState(null)
  const [streak, setStreak] = useState(0)
  const [erreur, setErreur] = useState('')
  const { play } = useAudioFeedback()

  useEffect(() => {
    if (!profile?.serie_id) return
    supabase
      .from('matieres_series')
      .select('matieres(id, nom, slug, icone)')
      .eq('serie_id', profile.serie_id)
      .then(({ data }) => setMatieres((data ?? []).map((r) => r.matieres).filter(Boolean)))
  }, [profile?.serie_id])

  async function chargerQuestion(cible = matiere) {
    if (!cible) return
    setQuestionLoading(true)
    setQuestion(null)
    setSelected(null)
    setFeedback(null)
    setCorrection(null)
    setJustification('')
    setErreur('')

    const { data, error } = await supabase.rpc('get_quiz_rapide_question', {
      p_matiere_id: cible.id,
    })
    setQuestionLoading(false)

    if (error) {
      const code = codeErreur(error)
      setErreur(ERREURS[code] ?? code)
      return
    }
    setQuestion(data)
  }

  async function choisirMatiere(cible) {
    setMatiere(cible)
    setSessionPoints(0)
    setSessionQuestions(0)
    setLastGain(null)
    setStreak(0)
    await chargerQuestion(cible)
  }

  async function repondre(choix) {
    if (!question || selected !== null || submitting) return
    setSelected(choix)
    setSubmitting(true)
    setErreur('')

    const { data, error } = await supabase.rpc('submit_quiz_rapide', {
      p_challenge_id: question.challenge_id,
      p_choix: choix,
    })
    setSubmitting(false)

    if (error) {
      const code = codeErreur(error)
      setErreur(ERREURS[code] ?? code)
      if (QUESTIONS_A_RENOUVELER.has(code)) setQuestion(null)
      setSelected(null)
      play('error')
      return
    }

    setFeedback(data.bonne ? 'correcte' : 'incorrecte')
    setCorrection(data.bonne_reponse)
    setJustification(String(data.justification ?? data.explication ?? '').trim())
    setStreak(data.streak_actuel)
    setSessionQuestions((total) => total + 1)
    if (data.bonne) {
      setSessionPoints((p) => p + 5)
      setLastGain({ n: 5, key: `${question.challenge_id}-${Date.now()}` })
      play('success')
    } else {
      play('error')
    }
    // L'élève garde le contrôle : il lit la justification puis demande la suite.
  }

  if (!profile) return <Loader />

  if (!matiere) {
    return (
      <div className="game-page mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-1 text-2xl font-bold">⚡ Quiz rapide</h1>
        <p className="mb-6 text-sm text-[var(--text-muted)]">
          Choisis une matière et joue sans limite, jusqu’à ce que tu décides de quitter.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {matieres.map((m) => (
            <button key={m.id} onClick={() => choisirMatiere(m)} className="cursor-pointer">
              <Card variant="interactive" className="flex min-h-36 flex-col items-center justify-center gap-2 py-6">
                <span className="text-3xl">{m.icone}</span>
                <span className="text-sm font-medium">{m.nom}</span>
              </Card>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="game-page mx-auto max-w-xl px-4 py-8">
      <QuizSessionHeader
        points={sessionPoints}
        barPct={((sessionPoints % PALIER) / PALIER) * 100}
        unit="pts"
        streak={streak}
        lastGain={lastGain}
      />

      <div className="mb-4 flex items-center justify-between rounded-full border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-xs">
        <span className="font-bold text-[var(--neon-cyan)]">∞ Mode continu</span>
        <span className="text-[var(--text-muted)]">
          {sessionQuestions} réponse{sessionQuestions > 1 ? 's' : ''} dans cette série
        </span>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm">
        <button
          onClick={() => {
            setMatiere(null)
            setQuestion(null)
          }}
          className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--neon-cyan)]"
        >
          ← Changer de matière
        </button>
        <span className="flex items-center gap-1 text-[var(--text-muted)]">
          <span>{matiere.icone}</span> {matiere.nom}
        </span>
      </div>

      {erreur && (
        <Card className="mb-4 border-[var(--neon-magenta)]">
          <p className="text-sm text-[var(--neon-magenta)]">{erreur}</p>
        </Card>
      )}

      {questionLoading && <Loader label="Préparation de la question…" />}

      {question && (
        <Card>
          <p className="mb-4 text-lg font-medium">{question.enonce}</p>
          <div className="flex flex-col gap-2">
            {(question.choix ?? []).map((choix) => {
              let extra = 'border-[var(--border)] hover:border-[var(--neon-cyan)]/60'
              if (feedback) {
                if (choix === correction) extra = 'border-[var(--neon-green)] bg-[var(--neon-green)]/10 text-[var(--neon-green)]'
                else if (choix === selected) extra = 'border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10 text-[var(--neon-magenta)]'
              } else if (choix === selected) {
                extra = 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]'
              }
              return (
                <button
                  key={choix}
                  disabled={!!selected || submitting}
                  onClick={() => repondre(choix)}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-left text-sm transition disabled:cursor-default ${extra}`}
                >
                  {choix}
                </button>
              )
            })}
          </div>
          {feedback && (
            <div className="mt-4 flex flex-col gap-3" aria-live="polite">
              <p className={`text-sm font-semibold ${feedback === 'correcte' ? 'text-[var(--neon-green)]' : 'text-[var(--neon-magenta)]'}`}>
                {feedback === 'correcte' ? '✔ Bonne réponse ! +5 pts' : `✘ La bonne réponse était : ${correction}`}
              </p>

              <div className="resume-content rounded-xl border border-[var(--neon-cyan)]/35 bg-[var(--neon-cyan)]/5 p-4 text-sm">
                <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[var(--neon-cyan)]">
                  Pourquoi ? — Justification pédagogique
                </p>
                {justification ? (
                  <ReactMarkdown remarkPlugins={[remarkMath, remarkGfm]} rehypePlugins={[rehypeKatex]}>
                    {justification}
                  </ReactMarkdown>
                ) : (
                  <p className="text-[var(--text-muted)]">La justification n’a pas pu être chargée.</p>
                )}
              </div>

              <Button className="self-end" onClick={() => chargerQuestion(matiere)}>
                Question suivante →
              </Button>
            </div>
          )}
        </Card>
      )}

      {!questionLoading && !question && (
        <div className="text-center">
          <Button onClick={() => chargerQuestion()}>Nouvelle question</Button>
        </div>
      )}
    </div>
  )
}
