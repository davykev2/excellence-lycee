import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import Avatar, { PresenceLabel } from '../components/ui/Avatar'
import { formatDateTime } from '../utils/time'

export default function Communaute() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab') === 'mp' ? 'mp' : 'chat'

  function setTab(nextTab) {
    const nextParams = new URLSearchParams(searchParams)
    if (nextTab === 'mp') nextParams.set('tab', 'mp')
    else nextParams.delete('tab')
    setSearchParams(nextParams, { replace: true })
  }

  return (
    <div className="game-page mx-auto max-w-2xl px-4 py-8">
      <section className="game-hero mb-5 rounded-3xl p-5 sm:p-6">
        <p className="game-eyebrow">💬 Salon de classe</p>
        <h1 className="mt-2 text-3xl font-black">Avancez ensemble</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">Échange avec les élèves de ton niveau et retrouve tes conversations privées.</p>
      </section>

      <div className="mb-4 flex gap-2">
        <TabButton active={tab === 'chat'} onClick={() => setTab('chat')}>Chat de classe</TabButton>
        <TabButton active={tab === 'mp'} onClick={() => setTab('mp')}>Messagerie privée</TabButton>
      </div>

      {tab === 'chat' ? <ChatGlobal /> : <MessageriePrivee />}
    </div>
  )
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm cursor-pointer transition ${
        active ? 'border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10' : 'border-[var(--border)] text-[var(--text-muted)]'
      }`}
    >
      {children}
    </button>
  )
}

function ChatGlobal() {
  const profile = useAuthStore((s) => s.profile)
  const [messages, setMessages] = useState([])
  const [texte, setTexte] = useState('')
  const [loading, setLoading] = useState(true)
  const finRef = useRef(null)

  useEffect(() => {
    if (!profile?.niveau_id) return
    let cancelled = false

    supabase
      .from('chat_global')
      .select('*, profiles(username, avatar_url)')
      .eq('niveau_id', profile.niveau_id)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => {
        if (cancelled) return
        setMessages(data ?? [])
        setLoading(false)
      })

    const channel = supabase
      .channel(`chat-niveau-${profile.niveau_id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_global', filter: `niveau_id=eq.${profile.niveau_id}` }, async (payload) => {
        const { data: auteur } = await supabase.from('profiles').select('username, avatar_url').eq('id', payload.new.user_id).single()
        setMessages((m) => [...m, { ...payload.new, profiles: auteur }])
      })
      .subscribe()

    return () => { cancelled = true; supabase.removeChannel(channel) }
  }, [profile?.niveau_id])

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  async function envoyer(e) {
    e.preventDefault()
    if (!texte.trim()) return
    const contenu = texte
    setTexte('')
    await supabase.from('chat_global').insert({ user_id: profile.id, niveau_id: profile.niveau_id, contenu })
  }

  if (loading) return <Loader />

  return (
    <Card className="flex h-[60vh] flex-col p-0">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 && <p className="text-center text-sm text-[var(--text-muted)]">Aucun message pour l'instant, lance la discussion !</p>}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-2 ${m.user_id === profile.id ? 'flex-row-reverse text-right' : ''}`}>
              <Avatar userId={m.user_id} avatarUrl={m.profiles?.avatar_url} username={m.profiles?.username} size="h-7 w-7" />
              <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.user_id === profile.id ? 'bg-[var(--neon-cyan)]/15' : 'bg-[var(--border)]/40'}`}>
                <p className="mb-0.5 text-xs text-[var(--text-muted)]">{m.profiles?.username} · {formatDateTime(m.created_at)}</p>
                <p>{m.contenu}</p>
              </div>
            </div>
          ))}
          <div ref={finRef} />
        </div>
      </div>
      <form onSubmit={envoyer} className="flex gap-2 border-t border-[var(--border)] p-3">
        <input value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Écris un message…" className="input" />
        <Button type="submit">Envoyer</Button>
      </form>
    </Card>
  )
}

function MessageriePrivee() {
  const profile = useAuthStore((s) => s.profile)
  const [conversations, setConversations] = useState([]) // [{ partnerId, username, avatar_url, dernierMessage, nonLu }]
  const [partenaireId, setPartenaireId] = useState(null)
  const [messages, setMessages] = useState([])
  const [texte, setTexte] = useState('')
  const [recherche, setRecherche] = useState('')
  const [resultats, setResultats] = useState([])
  const [loading, setLoading] = useState(true)
  const finRef = useRef(null)

  const chargerConversations = useCallback(async () => {
    if (!profile?.id) return
    setLoading(true)
    const { data } = await supabase
      .from('messages_prives')
      .select('*')
      .or(`de.eq.${profile.id},vers.eq.${profile.id}`)
      .order('created_at', { ascending: false })

    const parPartenaire = new Map()
    for (const m of data ?? []) {
      const partnerId = m.de === profile.id ? m.vers : m.de
      if (!parPartenaire.has(partnerId)) {
        parPartenaire.set(partnerId, { partnerId, dernierMessage: m.contenu, nonLu: 0, date: m.created_at })
      }
      if (m.vers === profile.id && !m.lu) {
        parPartenaire.get(partnerId).nonLu += 1
      }
    }

    const ids = [...parPartenaire.keys()]
    if (ids.length > 0) {
      const { data: profils } = await supabase.from('profiles').select('id, username, avatar_url').in('id', ids)
      for (const p of profils ?? []) {
        Object.assign(parPartenaire.get(p.id), { username: p.username, avatar_url: p.avatar_url })
      }
    }
    setConversations([...parPartenaire.values()])
    setLoading(false)
  }, [profile?.id])

  useEffect(() => { chargerConversations() }, [chargerConversations])

  useEffect(() => {
    if (!partenaireId || !profile?.id) return
    let cancelled = false

    async function charger() {
      const { data } = await supabase
        .from('messages_prives')
        .select('*')
        .or(`and(de.eq.${profile.id},vers.eq.${partenaireId}),and(de.eq.${partenaireId},vers.eq.${profile.id})`)
        .order('created_at', { ascending: true })
      if (cancelled) return
      setMessages(data ?? [])
      const nonLus = (data ?? []).filter((m) => m.vers === profile.id && !m.lu)
      if (nonLus.length) {
        await supabase.from('messages_prives').update({ lu: true }).in('id', nonLus.map((m) => m.id))
      }
    }
    charger()

    const channel = supabase
      .channel(`mp-${profile.id}-${partenaireId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages_prives' }, (payload) => {
        const m = payload.new
        const concerne = (m.de === profile.id && m.vers === partenaireId) || (m.de === partenaireId && m.vers === profile.id)
        if (concerne) setMessages((prev) => [...prev, m])
      })
      .subscribe()

    return () => { cancelled = true; supabase.removeChannel(channel) }
  }, [partenaireId, profile?.id])

  useEffect(() => { finRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  async function rechercher(q) {
    setRecherche(q)
    if (q.trim().length < 2) { setResultats([]); return }
    const { data } = await supabase.from('profiles').select('id, username, avatar_url').ilike('username', `%${q}%`).neq('id', profile.id).limit(8)
    setResultats(data ?? [])
  }

  function ouvrirConversation(id) {
    setPartenaireId(id)
    setRecherche('')
    setResultats([])
  }

  async function envoyer(e) {
    e.preventDefault()
    if (!texte.trim() || !partenaireId) return
    const contenu = texte
    setTexte('')
    await supabase.from('messages_prives').insert({ de: profile.id, vers: partenaireId, contenu })
    chargerConversations()
  }

  if (loading) return <Loader />

  const partenaire = conversations.find((c) => c.partnerId === partenaireId) ?? resultats.find((r) => r.id === partenaireId)

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-[220px_1fr]">
      <Card className="p-0 sm:h-[60vh] sm:overflow-y-auto">
        <div className="p-3">
          <input
            value={recherche}
            onChange={(e) => rechercher(e.target.value)}
            placeholder="Rechercher un élève…"
            className="input"
          />
          {resultats.length > 0 && (
            <div className="mt-2 flex flex-col gap-1">
              {resultats.map((r) => (
                <button key={r.id} onClick={() => ouvrirConversation(r.id)} className="rounded px-2 py-1 text-left text-sm hover:bg-[var(--border)]/40 cursor-pointer">
                  {r.username}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          {conversations.map((c) => (
            <button
              key={c.partnerId}
              onClick={() => ouvrirConversation(c.partnerId)}
              className={`flex items-center gap-2 px-3 py-2 text-left text-sm cursor-pointer hover:bg-[var(--border)]/30 ${partenaireId === c.partnerId ? 'bg-[var(--neon-cyan)]/10' : ''}`}
            >
              <Avatar userId={c.partnerId} avatarUrl={c.avatar_url} username={c.username} size="h-7 w-7" />
              <span className="flex-1 truncate">{c.username}</span>
              {c.nonLu > 0 && <span className="rounded-full bg-[var(--neon-magenta)] px-1.5 text-xs text-black">{c.nonLu}</span>}
            </button>
          ))}
          {conversations.length === 0 && <p className="p-3 text-sm text-[var(--text-muted)]">Aucune conversation. Cherche un élève ci-dessus.</p>}
        </div>
      </Card>

      {partenaireId ? (
        <Card className="flex h-[60vh] flex-col p-0">
          <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] p-3 text-sm font-medium">
            <span className="truncate">{partenaire?.username}</span>
            <PresenceLabel userId={partenaireId} />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex flex-col gap-2">
              {messages.map((m) => (
                <div key={m.id} className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${m.de === profile.id ? 'ml-auto bg-[var(--neon-cyan)]/15' : 'bg-[var(--border)]/40'}`}>
                  <p>{m.contenu}</p>
                  <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">{formatDateTime(m.created_at)}</p>
                </div>
              ))}
              <div ref={finRef} />
            </div>
          </div>
          <form onSubmit={envoyer} className="flex gap-2 border-t border-[var(--border)] p-3">
            <input value={texte} onChange={(e) => setTexte(e.target.value)} placeholder="Écris un message…" className="input" />
            <Button type="submit">Envoyer</Button>
          </form>
        </Card>
      ) : (
        <Card className="flex h-[60vh] items-center justify-center text-sm text-[var(--text-muted)]">
          Sélectionne une conversation ou cherche un élève.
        </Card>
      )}
    </div>
  )
}
