import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import MathMarkdown from '../components/content/MathMarkdown'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import LessonReactions from '../components/lecon/LessonReactions'
import LessonComments from '../components/lecon/LessonComments'
import Button from '../components/ui/Button'
import CelebrationOverlay from '../components/gamification/CelebrationOverlay'
import { useAudioFeedback } from '../store/useAudioFeedbackStore'

export default function ResumeLecon() {
  const { slug, chapitreId } = useParams()
  const [lecon, setLecon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [progressionLecture, setProgressionLecture] = useState(0)
  const [lue, setLue] = useState(false)
  const [celebration, setCelebration] = useState(false)
  const articleRef = useRef(null)
  const { play } = useAudioFeedback()

  useEffect(() => {
    let cancelled = false
    supabase
      .from('chapitres')
      .select('*, matieres(nom, slug, icone)')
      .eq('id', chapitreId)
      .single()
      .then(({ data }) => {
        if (cancelled) return
        setLecon(data)
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [chapitreId])

  useEffect(() => {
    try {
      const ids = new Set(JSON.parse(localStorage.getItem('excellence_read_lessons') ?? '[]'))
      setLue(ids.has(chapitreId))
    } catch {
      setLue(false)
    }
  }, [chapitreId])

  useEffect(() => {
    function mesurer() {
      const article = articleRef.current
      if (!article) return
      const debut = article.offsetTop - 120
      const fin = Math.max(debut + 1, article.offsetTop + article.offsetHeight - window.innerHeight * 0.65)
      const pct = Math.max(0, Math.min(100, Math.round(((window.scrollY - debut) / (fin - debut)) * 100)))
      setProgressionLecture(pct)
    }
    mesurer()
    window.addEventListener('scroll', mesurer, { passive: true })
    window.addEventListener('resize', mesurer)
    return () => {
      window.removeEventListener('scroll', mesurer)
      window.removeEventListener('resize', mesurer)
    }
  }, [lecon])

  if (loading) return <Loader label="Chargement de la leçon…" />
  if (!lecon) return <div className="p-8 text-center text-[var(--text-muted)]">Leçon introuvable.</div>

  const minutes = Math.max(2, Math.ceil((lecon.resume?.trim().split(/\s+/).length ?? 0) / 220))

  function marquerCommeLue() {
    try {
      const ids = new Set(JSON.parse(localStorage.getItem('excellence_read_lessons') ?? '[]'))
      ids.add(chapitreId)
      localStorage.setItem('excellence_read_lessons', JSON.stringify([...ids]))
    } catch {
      // La lecture reste validée pour la session si le stockage est indisponible.
    }
    setLue(true)
    setCelebration(true)
    play('levelUp')
  }

  return (
    <div className="game-page mx-auto max-w-3xl px-4 py-8">
      <div className="fixed inset-x-0 top-14 z-30 h-1 bg-[var(--border)]" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-[var(--neon-violet)] to-[var(--neon-cyan)] transition-[width] duration-150"
          style={{ width: `${progressionLecture}%` }}
        />
      </div>
      <Link to={`/resumes/${slug}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">
        ← {lecon.matieres?.icone} {lecon.matieres?.nom}
      </Link>
      <section className="game-hero mb-6 mt-3 rounded-3xl p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <span className="game-kicker">Leçon {String(lecon.ordre).padStart(2, '0')}</span>
          <span className="game-kicker">⏱ {minutes} min</span>
          <span className="game-kicker">{lue ? '✓ Déjà lue' : `${progressionLecture}% lu`}</span>
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">{lecon.titre}</h1>
        {lecon.description && <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">{lecon.description}</p>}
      </section>

      {lecon.resume && lecon.resume_published ? (
        <>
          <Card ref={articleRef} className="p-5 sm:p-7">
            <MathMarkdown>{lecon.resume}</MathMarkdown>
          </Card>

          <Card variant="reward" className="mt-5 flex flex-col items-start justify-between gap-4 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="game-eyebrow">🏁 Fin de la leçon</p>
              <h2 className="mt-1 text-lg font-bold">{lue ? 'Cette leçon est dans ton parcours' : 'Prêt à valider cette lecture ?'}</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Tu pourras toujours revenir la relire et t’exercer ensuite.</p>
            </div>
            {lue ? (
              <span className="shrink-0 rounded-full border border-[var(--neon-green)] bg-[var(--neon-green)]/10 px-4 py-2 text-sm font-bold text-[var(--success-text)]">✓ Lecture terminée</span>
            ) : (
              <Button className="shrink-0" onClick={marquerCommeLue} data-audio-feedback="off">Marquer comme lue ✨</Button>
            )}
          </Card>
          <LessonReactions chapitreId={lecon.id} />
          <LessonComments chapitreId={lecon.id} />
        </>
      ) : (
        <Card className="py-10 text-center">
          <p className="text-3xl">📖</p>
          <p className="mt-2 text-[var(--text-muted)]">Le résumé de cette leçon arrive bientôt.</p>
        </Card>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to={`/chapitre/${chapitreId}`}
          className="rounded-lg border border-[var(--neon-cyan)] px-4 py-2 text-sm text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)]/10"
        >
          ✏️ Exercices et quiz de cette leçon
        </Link>
      </div>

      <CelebrationOverlay
        open={celebration}
        title="Leçon terminée !"
        message="Ta progression de lecture a été enregistrée sur cet appareil. Passe maintenant à la pratique pour ancrer tes acquis."
        reward="📖 Lecture validée"
        icon="✨"
        actionLabel="Continuer"
        onClose={() => setCelebration(false)}
      />
    </div>
  )
}
