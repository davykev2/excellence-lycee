import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Loader from '../../components/ui/Loader'

export default function Settings() {
  const [settings, setSettings] = useState([])
  const [valeurs, setValeurs] = useState({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.from('app_settings').select('*').order('cle').then(({ data }) => {
      setSettings(data ?? [])
      const v = {}
      for (const s of data ?? []) v[s.cle] = JSON.stringify(s.valeur)
      setValeurs(v)
      setLoading(false)
    })
  }, [])

  async function sauvegarder(cle) {
    setMessage('')
    try {
      const valeur = JSON.parse(valeurs[cle])
      const { error } = await supabase.from('app_settings').update({ valeur }).eq('cle', cle)
      if (error) throw error
      setMessage(`« ${cle} » mis à jour.`)
    } catch {
      setMessage(`Erreur sur ${cle} : valeur JSON invalide.`)
    }
  }

  if (loading) return <Loader />

  return (
    <div>
      {message && <p className="mb-3 text-sm text-[var(--neon-cyan)]">{message}</p>}
      <div className="flex flex-col gap-2">
        {settings.map((s) => (
          <Card key={s.cle} className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-mono text-sm">{s.cle}</p>
              {s.description && <p className="text-xs text-[var(--text-muted)]">{s.description}</p>}
            </div>
            <div className="flex items-center gap-2">
              <input
                className="input w-40"
                value={valeurs[s.cle] ?? ''}
                onChange={(e) => setValeurs((v) => ({ ...v, [s.cle]: e.target.value }))}
              />
              <Button onClick={() => sauvegarder(s.cle)}>Enregistrer</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
