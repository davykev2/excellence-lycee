import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Loader from '../components/ui/Loader'
import BadgeChip from '../components/ui/BadgeChip'
import Avatar, { PresenceLabel } from '../components/ui/Avatar'
import XPProgress from '../components/gamification/XPProgress'
import { computeLevel } from '../lib/level'

export default function Profil() {
  const { userId: paramUserId } = useParams()
  const profile = useAuthStore((s) => s.profile)
  const estMoi = !paramUserId || paramUserId === profile?.id

  if (estMoi) return <ProfilEditable />
  return <ProfilPublic userId={paramUserId} />
}

function ProfilEditable() {
  const { profile, updateProfile } = useAuthStore()
  const [form, setForm] = useState({ username: profile?.username ?? '', bio: profile?.bio ?? '', etablissement: profile?.etablissement ?? '' })
  const [avatarFile, setAvatarFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [badges, setBadges] = useState([])

  useEffect(() => {
    if (!profile?.id) return
    supabase.from('user_badges').select('badges(*)').eq('user_id', profile.id)
      .then(({ data }) => setBadges((data ?? []).map((r) => r.badges).filter(Boolean)))
  }, [profile?.id])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      let avatar_url = profile.avatar_url
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop()
        const path = `${profile.id}/${Date.now()}.${ext}`
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true })
        if (upErr) throw upErr
        avatar_url = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
      }
      await updateProfile({ username: form.username, bio: form.bio, etablissement: form.etablissement, avatar_url })
      setMessage('Profil mis à jour !')
    } catch (err) {
      setMessage(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (!profile) return <Loader />

  const niveau = computeLevel(profile.points_carriere)

  return (
    <div className="game-page mx-auto max-w-2xl px-4 py-8">
      <section className="game-hero mb-6 rounded-3xl p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <Avatar profile={profile} size="h-20 w-20" forceOnline ring />
          <div className="min-w-0">
            <p className="game-eyebrow">👤 Carte de joueur</p>
            <h1 className="mt-1 truncate text-2xl font-black">{profile.username}</h1>
            <p className="text-sm font-bold text-[var(--neon-violet)]">Niveau {niveau.level} · {niveau.titre}</p>
          </div>
        </div>
        <XPProgress
          current={niveau.dansLeNiveau}
          target={niveau.requisNiveau}
          level={niveau.level}
          nextLevel={niveau.level + 1}
          title="Progression vers le prochain niveau"
          compact
          className="mt-5 bg-[var(--bg)]/35"
        />
      </section>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <Card className="text-center"><p className="text-xl font-bold text-[var(--neon-cyan)]">{profile.points_carriere}</p><p className="text-xs text-[var(--text-muted)]">Points carrière</p></Card>
        <Card className="text-center"><p className="text-xl font-bold text-[var(--neon-violet)]">{badges.length}</p><p className="text-xs text-[var(--text-muted)]">Badges</p></Card>
        <Card className="text-center"><p className="text-xl font-bold text-[var(--neon-magenta)]">{profile.likes}</p><p className="text-xs text-[var(--text-muted)]">Likes ❤️</p></Card>
      </div>

      <Card className="p-5">
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <Avatar profile={profile} size="h-16 w-16" forceOnline />
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} className="text-sm" />
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-muted)]">Nom d'utilisateur</span>
            <input className="input" value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-muted)]">Bio</span>
            <textarea className="input" rows={3} value={form.bio} onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-[var(--text-muted)]">Établissement</span>
            <input className="input" value={form.etablissement} onChange={(e) => setForm((f) => ({ ...f, etablissement: e.target.value }))} />
          </label>

          {message && <p className="text-sm text-[var(--neon-cyan)]">{message}</p>}
          <Button type="submit" disabled={saving} className="mt-2 self-start">{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </form>
      </Card>

      {badges.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-lg font-bold">Mes badges</h2>
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => <BadgeChip key={b.id} badge={b} />)}
          </div>
        </>
      )}
    </div>
  )
}

function ProfilPublic({ userId }) {
  const [target, setTarget] = useState(null)
  const [badges, setBadges] = useState([])
  const [defiStats, setDefiStats] = useState(null)
  const [dejaLike, setDejaLike] = useState(false)
  const [loading, setLoading] = useState(true)
  const monId = useAuthStore((s) => s.profile?.id)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      const [{ data: p }, { data: ub }, { data: like }, { data: stats }] = await Promise.all([
        supabase.from('profiles').select('*, niveaux(nom), series(nom)').eq('id', userId).single(),
        supabase.from('user_badges').select('badges(*)').eq('user_id', userId),
        supabase.from('profil_likes').select('*').eq('liker_id', monId).eq('liked_id', userId).maybeSingle(),
        supabase.rpc('get_public_profile_stats', { p_user_id: userId }),
      ])
      if (cancelled) return
      setTarget(p)
      setBadges((ub ?? []).map((r) => r.badges).filter(Boolean))
      setDejaLike(!!like)
      setDefiStats(stats ?? null)
      setLoading(false)
    }
    if (userId) load()
    return () => { cancelled = true }
  }, [userId, monId])

  async function handleLike() {
    // Mise à jour optimiste, corrigée par la réponse du serveur
    const optimiste = !dejaLike
    setDejaLike(optimiste)
    setTarget((t) => ({ ...t, likes: Math.max(0, t.likes + (optimiste ? 1 : -1)) }))
    const { data, error } = await supabase.rpc('toggle_like_profile', { p_liked_id: userId })
    if (error) {
      // Annule si le serveur refuse
      setDejaLike(!optimiste)
      setTarget((t) => ({ ...t, likes: Math.max(0, t.likes + (optimiste ? -1 : 1)) }))
    } else if (data && data.like !== optimiste) {
      setDejaLike(data.like)
      setTarget((t) => ({ ...t, likes: Math.max(0, t.likes + (data.like ? 1 : -1)) }))
    }
  }

  if (loading) return <Loader />
  if (!target) return <div className="p-8 text-center text-[var(--text-muted)]">Profil introuvable.</div>

  return (
    <div className="game-page mx-auto max-w-2xl px-4 py-8">
      <Card variant="reward" className="mb-6 text-center">
        <div className="mx-auto mb-3 w-fit">
          <Avatar userId={userId} avatarUrl={target.avatar_url} username={target.username} size="h-20 w-20" />
        </div>
        <h1 className="text-xl font-bold">{target.username}</h1>
        <div className="mt-1 flex justify-center">
          <PresenceLabel userId={userId} />
        </div>
        {(target.niveaux?.nom || target.series?.nom) && (
          <p className="mt-2">
            <span className="rounded-full border border-[var(--neon-cyan)] px-3 py-0.5 text-xs font-semibold text-[var(--neon-cyan)]">
              🎓 {target.niveaux?.nom} {target.series?.nom}
            </span>
          </p>
        )}
        {target.bio && <p className="mt-2 text-sm text-[var(--text-muted)]">{target.bio}</p>}
        {target.etablissement && <p className="mt-1 text-xs text-[var(--text-muted)]">🏫 {target.etablissement}</p>}

        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <span><strong className="text-[var(--neon-cyan)]">{target.points_carriere}</strong> pts</span>
          <span><strong className="text-[var(--neon-violet)]">{badges.length}</strong> badges</span>
          <span><strong className="text-[var(--neon-magenta)]">{target.likes}</strong> likes</span>
        </div>

        <div className="mx-auto mt-3 flex w-fit items-center gap-4 rounded-full border border-[var(--border)] px-4 py-1.5 text-sm">
          <span title="Défis joués">⚔️ {defiStats?.defis_joues ?? 0} défis</span>
          <span className="text-[var(--neon-green)]" title="Victoires">🏆 {defiStats?.victoires ?? 0}</span>
          <span className="text-[var(--neon-magenta)]" title="Défaites">💔 {defiStats?.defaites ?? 0}</span>
        </div>

        {monId && monId !== userId && (
          <button
            type="button"
            onClick={handleLike}
            aria-pressed={dejaLike}
            title={dejaLike ? 'Retirer mon like' : 'Aimer ce profil'}
            className={`mx-auto mt-4 flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold cursor-pointer transition active:scale-95 ${
              dejaLike
                ? 'border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/15 text-[var(--neon-magenta)] shadow-[var(--glow-magenta)]'
                : 'border-[var(--border)] text-[var(--text)] hover:border-[var(--neon-magenta)] hover:text-[var(--neon-magenta)]'
            }`}
          >
            <span className={`text-lg leading-none ${dejaLike ? 'anim-pop' : ''}`}>{dejaLike ? '❤️' : '🤍'}</span>
            {dejaLike ? 'Aimé' : 'Aimer ce profil'}
            <span className={`rounded-full px-2 py-0.5 text-xs font-mono ${dejaLike ? 'bg-[var(--neon-magenta)]/20' : 'bg-[var(--border)]/60'}`}>
              {target.likes}
            </span>
          </button>
        )}
      </Card>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {badges.map((b) => <BadgeChip key={b.id} badge={b} />)}
        </div>
      )}
    </div>
  )
}
