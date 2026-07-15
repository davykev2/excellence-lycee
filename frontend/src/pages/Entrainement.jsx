import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import Card from '../components/ui/Card'
import MathMarkdown from '../components/content/MathMarkdown'

const PALIERS = {
  entrainement: {
    label: 'Facile',
    icon: '🌱',
    description: 'Consolide les bases et adopte les bons réflexes.',
    color: 'var(--neon-green)',
  },
  maitrise: {
    label: 'Moyen',
    icon: '⚡',
    description: 'Applique tes méthodes dans des situations plus variées.',
    color: 'var(--neon-cyan)',
  },
  concours: {
    label: 'Difficile',
    icon: '🏆',
    description: 'Prépare-toi aux problèmes exigeants et aux compétitions.',
    color: 'var(--neon-violet)',
  },
}

function normaliserExercices(value) {
  if (!Array.isArray(value)) return []

  return [...value]
    .sort((a, b) => Number(a?.numero ?? 0) - Number(b?.numero ?? 0))
    .map((exercice, index) => ({
      ...exercice,
      numero: Number(exercice?.numero) || index + 1,
      termine: Boolean(exercice?.termine),
      questions: Array.isArray(exercice?.questions)
        ? [...exercice.questions].sort((a, b) => Number(a?.ordre ?? 0) - Number(b?.ordre ?? 0))
        : [],
    }))
}

export default function Entrainement() {
  const { chapitreId, palier } = useParams()
  const navigate = useNavigate()
  const niveau = PALIERS[palier]
  const exerciceTopRef = useRef(null)
  const correctionRef = useRef(null)

  const [chapitre, setChapitre] = useState(null)
  const [titre, setTitre] = useState('')
  const [exercices, setExercices] = useState([])
  const [index, setIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')
      setValidationError('')
      setIndex(0)

      if (!niveau) {
        setError("Ce niveau d'exercice n'existe pas.")
        setLoading(false)
        return
      }

      const { data, error: rpcError } = await supabase.rpc('get_exercices_entrainement_v2', {
        p_chapitre_id: chapitreId,
        p_palier: palier,
      })

      if (cancelled) return
      if (rpcError) {
        setError(rpcError.message)
        setLoading(false)
        return
      }

      const liste = normaliserExercices(data?.exercices)
      const premierNonTermine = liste.findIndex((exercice) => !exercice.termine)

      setChapitre(data?.chapitre ?? null)
      setTitre(data?.titre ?? '')
      setExercices(liste)
      setIndex(premierNonTermine >= 0 ? premierNonTermine : 0)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [chapitreId, palier, niveau])

  const exercice = exercices[index]
  const totalTermines = useMemo(
    () => exercices.filter((item) => item.termine).length,
    [exercices],
  )

  async function terminerExercice() {
    if (!exercice || exercice.termine || busy) return

    setBusy(true)
    setValidationError('')
    const { data, error: rpcError } = await supabase.rpc('terminer_exercice_entrainement_v2', {
      p_exercice_id: exercice.id,
    })
    setBusy(false)

    if (rpcError) {
      setValidationError(rpcError.message)
      return
    }

    const corrections = new Map(
      (Array.isArray(data?.corrections) ? data.corrections : [])
        .map((item) => [item.question_id, item.correction_md]),
    )

    setExercices((liste) => liste.map((item) => {
      if (item.id !== exercice.id) return item

      return {
        ...item,
        termine: true,
        questions: item.questions.map((question) => ({
          ...question,
          correction_md: corrections.get(question.id) ?? question.correction_md ?? null,
        })),
      }
    }))

    window.requestAnimationFrame(() => {
      correctionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      correctionRef.current?.focus({ preventScroll: true })
    })
  }

  function allerA(nouvelIndex) {
    if (busy || nouvelIndex < 0 || nouvelIndex >= exercices.length || nouvelIndex === index) return
    setIndex(nouvelIndex)
    setValidationError('')
    window.requestAnimationFrame(() => {
      exerciceTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      exerciceTopRef.current?.focus({ preventScroll: true })
    })
  }

  if (loading) return <Loader label="Chargement des exercices…" />

  if (error) {
    return (
      <div className="game-page mx-auto max-w-xl px-4 py-12 text-center">
        <Card>
          <p className="text-[var(--neon-magenta)]" role="alert">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={() => navigate(`/chapitre/${chapitreId}`)}>
            Retour à la leçon
          </Button>
        </Card>
      </div>
    )
  }

  const chapitreTitre = typeof chapitre === 'string' ? chapitre : chapitre?.titre

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <Link
        to={`/chapitre/${chapitreId}`}
        className="text-sm text-[var(--text-muted)] transition hover:text-[var(--neon-cyan)]"
      >
        ← Retour à la leçon
      </Link>

      <section className="game-hero mb-6 mt-3 rounded-3xl p-5 sm:p-7">
        <div className="flex items-start gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border bg-[var(--bg)]/30 text-3xl"
            style={{ borderColor: niveau.color, boxShadow: `0 0 18px color-mix(in srgb, ${niveau.color} 25%, transparent)` }}
            aria-hidden="true"
          >
            {niveau.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="game-eyebrow">Entraînement sans note · Niveau {niveau.label}</p>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">{titre || chapitreTitre || 'Exercices de la leçon'}</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">{niveau.description}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="game-kicker" role="status" aria-live="polite">
            ✓ {totalTermines}/{exercices.length} exercices terminés
          </span>
          <span className="text-xs font-bold uppercase tracking-wide text-[var(--text-muted)]">Aucun point, aucune note</span>
        </div>
      </section>

      {exercices.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="text-3xl" aria-hidden="true">🧩</p>
          <p className="mt-2 font-bold">Les exercices de ce niveau arrivent bientôt.</p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Tu peux essayer un autre niveau en attendant.</p>
        </Card>
      ) : (
        <>
          <nav className="mb-4 flex gap-2 overflow-x-auto pb-2" aria-label="Choisir un exercice">
            {exercices.map((item, itemIndex) => {
              const actif = itemIndex === index
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => allerA(itemIndex)}
                  aria-current={actif ? 'step' : undefined}
                  className={`game-button min-h-16 min-w-28 rounded-2xl border px-3 py-2 text-center transition ${
                    actif
                      ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] shadow-[var(--glow-cyan)]'
                      : 'border-[var(--border)] bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:border-[var(--neon-cyan)]/50 hover:text-[var(--text)]'
                  }`}
                >
                  <span className="block text-xs font-black">Exercice {item.numero}</span>
                  <span className={`mt-1 block text-[10px] font-bold ${item.termine ? 'text-[var(--neon-green)]' : ''}`}>
                    {item.termine ? '✓ Terminé' : actif ? 'En cours' : 'À faire'}
                  </span>
                </button>
              )
            })}
          </nav>

          <article
            ref={exerciceTopRef}
            className="scroll-mt-24 outline-none"
            tabIndex={-1}
            aria-labelledby={`exercice-${exercice.id}-titre`}
          >
            <Card className="overflow-hidden p-0">
              <header className="border-b border-[var(--border)] bg-[var(--border)]/15 p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="game-eyebrow">Exercice {exercice.numero} sur {exercices.length}</span>
                  {exercice.termine && (
                    <span className="rounded-full border border-[var(--neon-green)]/45 bg-[var(--neon-green)]/10 px-2.5 py-1 text-xs font-black text-[var(--neon-green)]">
                      ✓ Terminé
                    </span>
                  )}
                </div>
                <h2 id={`exercice-${exercice.id}-titre`} className="mt-2 text-xl font-black sm:text-2xl">
                  {exercice.titre || `Exercice ${exercice.numero}`}
                </h2>
                {exercice.consigne && <MathMarkdown className="mt-3 text-sm text-[var(--text-muted)]">{exercice.consigne}</MathMarkdown>}
              </header>

              <ol className="divide-y divide-[var(--border)]" aria-label="Questions de l'exercice">
                {exercice.questions.map((question, questionIndex) => (
                  <li key={question.id} className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <span
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-xl border border-[var(--neon-violet)]/40 bg-[var(--neon-violet)]/10 text-xs font-black text-[var(--neon-violet)]"
                        aria-hidden="true"
                      >
                        {question.ordre ?? questionIndex + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <MathMarkdown>{question.enonce_md}</MathMarkdown>
                        {question.image_url && (
                          <img
                            src={question.image_url}
                            alt={question.image_alt || `Illustration de la question ${question.ordre ?? questionIndex + 1}`}
                            className="mt-4 max-h-80 max-w-full rounded-xl border border-[var(--border)] object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              {exercice.questions.length === 0 && (
                <p className="p-6 text-center text-sm text-[var(--text-muted)]">Cet exercice est en cours de préparation.</p>
              )}
            </Card>

            {validationError && (
              <Card className="mt-3 border-[var(--neon-magenta)]/50 py-3 text-sm text-[var(--neon-magenta)]" role="alert">
                {validationError}
              </Card>
            )}

            {!exercice.termine && exercice.questions.length > 0 && (
              <div className="sticky bottom-20 z-20 mt-4 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/90 p-3 backdrop-blur lg:bottom-3">
                <p className="mb-2 text-center text-xs text-[var(--text-muted)]">
                  Fais l’exercice sur ton cahier, puis révèle la solution complète.
                </p>
                <Button className="w-full" onClick={terminerExercice} disabled={busy}>
                  {busy ? 'Ouverture de la correction…' : 'J’ai terminé — voir la correction'}
                </Button>
              </div>
            )}

            {exercice.termine && (
              <section
                ref={correctionRef}
                className="mt-6 scroll-mt-24 outline-none"
                tabIndex={-1}
                aria-labelledby={`correction-${exercice.id}-titre`}
              >
                <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="game-eyebrow">Solution détaillée</p>
                    <h2 id={`correction-${exercice.id}-titre`} className="mt-1 text-xl font-black">Correction complète</h2>
                  </div>
                  <span className="text-xs font-bold text-[var(--neon-green)]">✓ Exercice comptabilisé</span>
                </div>

                <div className="flex flex-col gap-3">
                  {exercice.questions.map((question, questionIndex) => (
                    <Card key={question.id} className="border-[var(--neon-green)]/25">
                      <h3 className="mb-3 font-black text-[var(--neon-green)]">
                        Question {question.ordre ?? questionIndex + 1}
                      </h3>
                      {question.correction_md ? (
                        <MathMarkdown>{question.correction_md}</MathMarkdown>
                      ) : (
                        <p className="text-sm text-[var(--text-muted)]">La correction est momentanément indisponible.</p>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </article>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={() => allerA(index - 1)} disabled={index === 0 || busy}>
              ← Exercice précédent
            </Button>
            {index < exercices.length - 1 ? (
              <Button variant="secondary" onClick={() => allerA(index + 1)} disabled={busy}>
                Exercice suivant →
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate(`/chapitre/${chapitreId}`)} disabled={busy}>
                Retour à la leçon
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
