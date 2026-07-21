import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

const QUESTION_VIDE = {
  type: 'qcm',
  enonce: '',
  choix: ['', '', '', ''],
  correcte: 0,
  reponses_texte: '',
  points: 1,
  explication: '',
  image_url: '',
}

export default function QuizEdit() {
  const { quizId } = useParams()
  const [quiz, setQuiz] = useState(null)
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(QUESTION_VIDE)
  const [editId, setEditId] = useState(null)

  const charger = useCallback(async () => {
    setLoading(true)
    const [{ data: q }, { data: qs }] = await Promise.all([
      supabase.from('quiz').select('*, chapitres(titre), matieres(nom)').eq('id', quizId).single(),
      supabase.from('questions').select('*').eq('quiz_id', quizId).order('ordre'),
    ])
    setQuiz(q)
    setQuestions(qs ?? [])
    setLoading(false)
  }, [quizId])

  useEffect(() => { charger() }, [charger])

  function resetForm() {
    setForm({ ...QUESTION_VIDE, choix: ['', '', '', ''] })
    setEditId(null)
  }

  function editer(q) {
    const isTexte = q.type === 'texte'
    setForm({
      type: q.type || 'qcm',
      enonce: q.enonce,
      choix: q.choix?.length ? [...q.choix] : ['', '', '', ''],
      correcte: (q.choix ?? []).indexOf(q.bonnes_reponses),
      reponses_texte: isTexte
        ? (Array.isArray(q.bonnes_reponses) ? q.bonnes_reponses.join('\n') : String(q.bonnes_reponses ?? ''))
        : '',
      points: q.points,
      explication: q.explication ?? '',
      image_url: q.image_url ?? '',
    })
    setEditId(q.id)
  }

  async function enregistrer(e) {
    e.preventDefault()
    if (!form.enonce.trim()) return

    let payload
    if (form.type === 'texte') {
      const reponses = form.reponses_texte.split('\n').map((r) => r.trim()).filter(Boolean)
      if (reponses.length < 1) return
      payload = {
        quiz_id: quizId,
        type: 'texte',
        enonce: form.enonce,
        choix: null,
        bonnes_reponses: reponses, // tableau de réponses acceptées
        points: Number(form.points) || 1,
        explication: form.explication || null,
        image_url: form.image_url || null,
      }
    } else {
      const choixNettoyes = form.choix.map((c) => c.trim()).filter(Boolean)
      if (choixNettoyes.length < 2) return
      payload = {
        quiz_id: quizId,
        type: 'qcm',
        enonce: form.enonce,
        choix: choixNettoyes,
        bonnes_reponses: form.choix[form.correcte],
        points: Number(form.points) || 1,
        explication: form.explication || null,
        image_url: form.image_url || null,
      }
    }

    if (editId) {
      await supabase.from('questions').update(payload).eq('id', editId)
    } else {
      await supabase.from('questions').insert({ ...payload, ordre: questions.length + 1 })
    }
    resetForm()
    charger()
  }

  async function supprimer(id) {
    if (!confirm('Supprimer cette question ?')) return
    await supabase.from('questions').delete().eq('id', id)
    charger()
  }

  if (loading) return <Loader />
  if (!quiz) return <p className="text-sm text-[var(--text-muted)]">Quiz introuvable.</p>
  if (quiz.type === 'devoir') {
    return (
      <Card>
        <h2 className="text-lg font-bold">Ce devoir utilise maintenant un historique de versions</h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Ouvre-le dans l’atelier des devoirs pour créer un brouillon sans modifier les copies et les résultats déjà enregistrés.
        </p>
        <Link
          to={`/admin/devoirs/${quiz.devoir_id ?? quiz.id}`}
          className="mt-4 inline-flex rounded-xl border border-[var(--neon-magenta)] px-4 py-2 text-sm font-bold text-[var(--neon-magenta)]"
        >
          Ouvrir le devoir →
        </Link>
      </Card>
    )
  }

  const isTexte = form.type === 'texte'

  return (
    <div>
      <Link to="/admin/catalogue" className="text-sm text-[var(--text-muted)] hover:text-[var(--neon-cyan)]">← Retour à la structure</Link>
      <h2 className="mb-1 mt-2 text-lg font-bold">{quiz.titre}</h2>
      <p className="mb-6 text-sm text-[var(--text-muted)]">
        {quiz.chapitres?.titre ?? quiz.matieres?.nom} · {questions.length} question(s)
      </p>

      <div className="mb-6 flex flex-col gap-2">
        {questions.map((q, i) => (
          <Card key={q.id} className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium">
                #{i + 1} {q.enonce}
                <span className="ml-2 rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase text-[var(--text-muted)]">
                  {q.type === 'texte' ? 'Libre' : 'QCM'}
                </span>
              </p>
              <p className="text-xs text-[var(--neon-green)]">
                ✔ {Array.isArray(q.bonnes_reponses) ? q.bonnes_reponses.join(' · ') : q.bonnes_reponses}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="ghost" onClick={() => editer(q)}>Modifier</Button>
              <Button variant="danger" onClick={() => supprimer(q.id)}>×</Button>
            </div>
          </Card>
        ))}
        {questions.length === 0 && <p className="text-sm text-[var(--text-muted)]">Aucune question pour l'instant.</p>}
      </div>

      <Card>
        <h3 className="mb-3 text-sm font-bold">{editId ? 'Modifier la question' : 'Ajouter une question'}</h3>
        <form onSubmit={enregistrer} className="flex flex-col gap-3">
          {/* Type de question */}
          <div className="flex gap-2">
            {[['qcm', 'QCM'], ['texte', 'Réponse libre']].map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: val }))}
                className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                  form.type === val
                    ? 'border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)]'
                    : 'border-[var(--border)] text-[var(--text-muted)]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <textarea
            className="input"
            rows={2}
            placeholder="Énoncé de la question"
            value={form.enonce}
            onChange={(e) => setForm((f) => ({ ...f, enonce: e.target.value }))}
          />

          {isTexte ? (
            <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
              Réponses acceptées (une par ligne — casse et accents ignorés)
              <textarea
                className="input"
                rows={3}
                placeholder={'Ex :\n6,02.10^23\n6.02e23'}
                value={form.reponses_texte}
                onChange={(e) => setForm((f) => ({ ...f, reponses_texte: e.target.value }))}
              />
            </label>
          ) : (
            <div className="flex flex-col gap-2">
              {form.choix.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correcte"
                    checked={form.correcte === i}
                    onChange={() => setForm((f) => ({ ...f, correcte: i }))}
                  />
                  <input
                    className="input"
                    placeholder={`Choix ${i + 1}`}
                    value={c}
                    onChange={(e) => setForm((f) => ({ ...f, choix: f.choix.map((v, j) => (j === i ? e.target.value : v)) }))}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
              Points
              <input type="number" className="input w-20" value={form.points} onChange={(e) => setForm((f) => ({ ...f, points: e.target.value }))} />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs text-[var(--text-muted)]">
              Image (URL, optionnel)
              <input className="input" value={form.image_url} onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-xs text-[var(--text-muted)]">
            Explication (affichée après correction — Markdown et LaTeX pris en charge)
            <textarea className="input" rows={3} value={form.explication} onChange={(e) => setForm((f) => ({ ...f, explication: e.target.value }))} />
          </label>

          <div className="flex gap-2">
            <Button type="submit">{editId ? 'Enregistrer' : '+ Ajouter'}</Button>
            {editId && <Button type="button" variant="ghost" onClick={resetForm}>Annuler</Button>}
          </div>
        </form>
      </Card>
    </div>
  )
}
