import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function ResetPassword() {
  const updatePassword = useAuthStore((s) => s.updatePassword)
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('6 caractères minimum.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setLoading(true)
    try {
      await updatePassword(password)
      setDone(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-1 text-2xl font-bold neon-text">Nouveau mot de passe</h1>

      <Card className="mt-6">
        {done ? (
          <p className="text-[var(--neon-green)]">Mot de passe mis à jour, redirection…</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-[var(--text-muted)]">Nouveau mot de passe</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" required />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-[var(--text-muted)]">Confirmer</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input" required />
            </label>
            {error && <p className="text-sm text-[var(--neon-magenta)]">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Mise à jour…' : 'Valider'}
            </Button>
          </form>
        )}
      </Card>
    </div>
  )
}
