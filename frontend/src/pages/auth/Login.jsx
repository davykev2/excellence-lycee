import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function Login() {
  const signIn = useAuthStore((s) => s.signIn)
  const session = useAuthStore((s) => s.session)
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Destination : le lien protégé qui a déclenché la redirection (chemin + query + ancre)
  const from = location.state?.from
  const redirectTo = from
    ? `${from.pathname ?? '/dashboard'}${from.search ?? ''}${from.hash ?? ''}`
    : '/dashboard'

  // Déjà connecté ? On ne montre pas le formulaire, on file à destination.
  if (session) return <Navigate to={redirectTo} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate(redirectTo, { replace: true })
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-1 text-2xl font-bold neon-text">Connexion</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">Reviens t'entraîner !</p>

      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-muted)]">Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-muted)]">Mot de passe</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
          </label>

          {error && <p className="text-sm text-[var(--neon-magenta)]">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>
      </Card>

      <div className="mt-4 flex flex-col items-center gap-2 text-sm text-[var(--text-muted)]">
        <Link to="/forgot-password" className="hover:text-[var(--neon-cyan)]">Mot de passe oublié ?</Link>
        <p>
          Pas encore de compte ? <Link to="/signup" className="text-[var(--neon-cyan)] hover:underline">S'inscrire</Link>
        </p>
      </div>
    </div>
  )
}
