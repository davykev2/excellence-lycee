import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuthStore } from '../../store/useAuthStore'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Avatar from '../ui/Avatar'
import { formatDateTime } from '../../utils/time'

const MAX = 1000

export default function LessonComments({ chapitreId }) {
  const session = useAuthStore((s) => s.session)
  const profile = useAuthStore((s) => s.profile)
  const isAdmin = !!profile?.is_admin
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [texte, setTexte] = useState('')
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)

  async function charger() {
    const { data } = await supabase
      .from('lecon_commentaires')
      .select('*, profiles(username, avatar_url)')
      .eq('chapitre_id', chapitreId)
      .order('created_at', { ascending: false })
    setComments(data || [])
    setLoading(false)
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    supabase
      .from('lecon_commentaires')
      .select('*, profiles(username, avatar_url)')
      .eq('chapitre_id', chapitreId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (cancelled) return
        setComments(data || [])
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [chapitreId])

  async function envoyer(e) {
    e.preventDefault()
    const contenu = texte.trim()
    if (!contenu || !profile?.id || sending) return
    setSending(true)
    const { error } = await supabase
      .from('lecon_commentaires')
      .insert({ chapitre_id: chapitreId, user_id: profile.id, contenu })
    if (!error) {
      setTexte('')
      setOpen(false)
      await charger()
    }
    setSending(false)
  }

  async function supprimer(id) {
    const { error } = await supabase.from('lecon_commentaires').delete().eq('id', id)
    if (!error) setComments((c) => c.filter((x) => x.id !== id))
  }

  return (
    <Card className="mt-4 p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold">
          💬 Commentaires{comments.length > 0 && ` (${comments.length})`}
        </p>
        {session ? (
          <Button variant="secondary" className="px-3 py-1.5" onClick={() => setOpen((o) => !o)}>
            {open ? 'Annuler' : 'Commenter'}
          </Button>
        ) : (
          <Link to="/login" className="text-xs text-[var(--neon-cyan)] hover:underline">
            Connecte-toi pour commenter
          </Link>
        )}
      </div>

      {open && session && (
        <form onSubmit={envoyer} className="mb-4">
          <textarea
            value={texte}
            onChange={(e) => setTexte(e.target.value.slice(0, MAX))}
            placeholder="Partage ton avis sur ce résumé…"
            rows={3}
            className="input w-full resize-y"
            autoFocus
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">{texte.length}/{MAX}</span>
            <Button type="submit" disabled={sending || !texte.trim()} className="px-4 py-1.5">
              {sending ? 'Envoi…' : 'Publier'}
            </Button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="py-3 text-center text-sm text-[var(--text-muted)]">Chargement…</p>
      ) : comments.length === 0 ? (
        <p className="py-3 text-center text-sm text-[var(--text-muted)]">
          Aucun commentaire pour l'instant.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => (
            <li key={c.id} className="flex gap-2">
              <Avatar
                userId={c.user_id}
                avatarUrl={c.profiles?.avatar_url}
                username={c.profiles?.username}
                size="h-8 w-8"
              />
              <div className="flex-1">
                <p className="text-xs text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text)]">{c.profiles?.username || 'Élève'}</span>
                  {' · '}{formatDateTime(c.created_at)}
                </p>
                <p className="mt-0.5 whitespace-pre-wrap break-words text-sm">{c.contenu}</p>
              </div>
              {(c.user_id === profile?.id || isAdmin) && (
                <button
                  type="button"
                  onClick={() => supprimer(c.id)}
                  title="Supprimer"
                  className="self-start text-xs text-[var(--text-muted)] hover:text-[var(--neon-magenta)]"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
