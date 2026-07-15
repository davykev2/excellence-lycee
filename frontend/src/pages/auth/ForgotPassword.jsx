import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'

export default function ForgotPassword() {
  const sendPasswordReset = useAuthStore((s) => s.sendPasswordReset)
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendPasswordReset(email)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-1 text-2xl font-bold neon-text">Mot de passe oublié</h1>
      <p className="mb-6 text-sm text-[var(--text-muted)]">On t'envoie un lien de réinitialisation par email.</p>

      <Card>
        {sent ? (
          <p className="text-[var(--neon-green)]">Email envoyé ! Vérifie ta boîte de réception.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="text-[var(--text-muted)]">Email</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
            </label>
            {error && <p className="text-sm text-[var(--neon-magenta)]">{error}</p>}
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Envoi…' : 'Envoyer le lien'}
            </Button>
          </form>
        )}
      </Card>

      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-[var(--neon-cyan)] hover:underline">Retour à la connexion</Link>
      </p>
    </div>
  )
}
