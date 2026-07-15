import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/useAuthStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Signup() {
  const signUp = useAuthStore((s) => s.signUp)
  const session = useAuthStore((s) => s.session)
  const navigate = useNavigate()

  const [niveaux, setNiveaux] = useState([])
  const [series, setSeries] = useState([])
  const [etablissements, setEtablissements] = useState([])
  const [form, setForm] = useState({
    username: '', email: '', password: '', niveau_id: '', serie_id: '', etablissement: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    supabase.from('niveaux').select('*').order('ordre').then(({ data }) => setNiveaux(data ?? []))
    // Établissements déjà connus → suggestions pour éviter les variantes d'orthographe
    supabase.from('profiles').select('etablissement').not('etablissement', 'is', null)
      .then(({ data }) => {
        const uniques = [...new Set((data ?? []).map((r) => r.etablissement?.trim()).filter(Boolean))].sort()
        setEtablissements(uniques)
      })
  }, [])

  useEffect(() => {
    if (!form.niveau_id) {
      setSeries([])
      return
    }
    supabase.from('series').select('*').eq('niveau_id', form.niveau_id).order('nom')
      .then(({ data }) => setSeries(data ?? []))
  }, [form.niveau_id])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value, ...(field === 'niveau_id' ? { serie_id: '' } : {}) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.username || !form.email || !form.password || !form.niveau_id || !form.serie_id || !form.etablissement.trim()) {
      setError('Merci de remplir tous les champs obligatoires.')
      return
    }
    setLoading(true)
    try {
      await signUp({ ...form, etablissement: form.etablissement.trim() })
      setDone(true)
    } catch (err) {
      setError(err.message === 'User already registered' ? 'Cet email est déjà utilisé.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  // Déjà connecté (session active, ex. confirmation email désactivée) → dashboard
  if (session) return <Navigate to="/dashboard" replace />

  if (done) {
    return (
      <div className="mx-auto max-w-md py-16 px-4 text-center">
        <Card glow>
          <h1 className="mb-2 text-xl font-bold neon-text">Inscription réussie 🎉</h1>
          <p className="text-[var(--text-muted)]">
            Vérifie ta boîte mail pour confirmer ton compte, puis connecte-toi. Ton accès aux contenus sera
            activé automatiquement.
          </p>
          <Button className="mt-4" onClick={() => navigate('/login')}>Aller à la connexion</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-1 text-2xl font-bold neon-text">Créer un compte</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">Rejoins EXCELLENCE LYCÉE et entraîne-toi chaque jour.</p>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Nom d'utilisateur *">
            <input value={form.username} onChange={(e) => update('username', e.target.value)} className="input" required />
          </Field>
          <Field label="Email *">
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} className="input" required />
          </Field>
          <Field label="Mot de passe *">
            <input type="password" minLength={6} value={form.password} onChange={(e) => update('password', e.target.value)} className="input" required />
          </Field>
          <Field label="Niveau *">
            <select value={form.niveau_id} onChange={(e) => update('niveau_id', e.target.value)} className="input" required>
              <option value="">Choisir…</option>
              {niveaux.map((n) => <option key={n.id} value={n.id}>{n.nom}</option>)}
            </select>
          </Field>
          <Field label="Série *">
            <select value={form.serie_id} onChange={(e) => update('serie_id', e.target.value)} className="input" required disabled={!form.niveau_id}>
              <option value="">Choisir…</option>
              {series.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
            </select>
          </Field>
          <Field label="Établissement *">
            <input
              value={form.etablissement}
              onChange={(e) => update('etablissement', e.target.value)}
              className="input"
              placeholder="Lycée…"
              list="liste-etablissements"
              required
            />
            <datalist id="liste-etablissements">
              {etablissements.map((e) => <option key={e} value={e} />)}
            </datalist>
          </Field>

          {error && <p className="text-sm text-[var(--neon-magenta)]">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Création…' : "S'inscrire"}
          </Button>
        </form>
      </Card>

      <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
        Déjà inscrit ? <Link to="/login" className="text-[var(--neon-cyan)] hover:underline">Se connecter</Link>
      </p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-[var(--text-muted)]">{label}</span>
      {children}
    </label>
  )
}
