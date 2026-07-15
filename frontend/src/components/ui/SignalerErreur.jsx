import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function SignalerErreur({ questionId }) {
  const [open, setOpen] = useState(false)
  const [motif, setMotif] = useState('')
  const [envoye, setEnvoye] = useState(false)
  const [envoi, setEnvoi] = useState(false)
  const [erreur, setErreur] = useState('')

  async function envoyer() {
    if (!motif.trim()) return
    setEnvoi(true)
    setErreur('')
    const { error } = await supabase.from('signalements').insert({
      question_id: questionId,
      motif: motif.trim(),
    })
    setEnvoi(false)
    if (error) {
      setErreur("Le signalement n'a pas pu être envoyé. Réessaie dans un instant.")
      return
    }
    setEnvoye(true)
    setOpen(false)
  }

  if (envoye) {
    return <span className="text-xs text-[var(--neon-green)]">Signalement envoyé, merci !</span>
  }

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="text-[var(--text-muted)] hover:text-[var(--neon-magenta)] underline cursor-pointer"
      >
        Signaler une erreur
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <textarea
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Décris le problème (énoncé, réponse, image...)"
            rows={2}
            className="w-full rounded border border-[var(--border)] bg-[var(--bg)] p-2 text-[var(--text)]"
          />
          <button
            type="button"
            disabled={envoi}
            onClick={envoyer}
            className="self-start rounded bg-[var(--neon-magenta)] px-3 py-1 text-black disabled:opacity-40 cursor-pointer"
          >
            {envoi ? 'Envoi…' : 'Envoyer'}
          </button>
          {erreur && <p className="text-[var(--neon-magenta)]">{erreur}</p>}
        </div>
      )}
    </div>
  )
}
