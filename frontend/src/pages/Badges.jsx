import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuthStore } from '../store/useAuthStore'
import { BADGE_CATEGORIES } from '../utils/constants'
import BadgeChip from '../components/ui/BadgeChip'
import Card from '../components/ui/Card'
import Loader from '../components/ui/Loader'
import AndroidBadges, { ANDROID_BADGE_PREVIEW_BADGES, ANDROID_BADGE_PREVIEW_PROFILE } from './AndroidBadges'
import { isAndroidBadgeExperience, isAndroidBadgePreview } from '../lib/nativeApp'

export default function Badges() {
  const { userId: paramUserId } = useParams()
  const profile = useAuthStore((s) => s.profile)
  const previewMode = isAndroidBadgePreview()
  const userId = paramUserId ?? profile?.id ?? (previewMode ? ANDROID_BADGE_PREVIEW_PROFILE.id : null)

  const [badges, setBadges] = useState([])
  const [obtenus, setObtenus] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    if (previewMode && !profile) {
      setBadges(ANDROID_BADGE_PREVIEW_BADGES)
      setObtenus(new Set(ANDROID_BADGE_PREVIEW_BADGES.slice(0, 6).map((badge) => badge.id)))
      setLoading(false)
      return
    }
    let cancelled = false
    async function load() {
      setLoading(true)
      const [{ data: allBadges }, { data: userBadges }] = await Promise.all([
        supabase.from('badges').select('*'),
        supabase.from('user_badges').select('badge_id').eq('user_id', userId),
      ])
      if (cancelled) return
      setBadges(allBadges ?? [])
      setObtenus(new Set((userBadges ?? []).map((b) => b.badge_id)))
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [previewMode, profile, userId])

  if (loading) return <Loader />

  const pct = badges.length ? Math.round((obtenus.size / badges.length) * 100) : 0

  if (isAndroidBadgeExperience()) {
    return (
      <AndroidBadges
        badges={badges}
        obtainedIds={obtenus}
        profile={profile ?? ANDROID_BADGE_PREVIEW_PROFILE}
        previewMode={previewMode && !profile}
      />
    )
  }

  return (
    <div className="game-page mx-auto max-w-4xl px-4 py-8">
      <section className="game-hero mb-7 rounded-3xl p-5 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="game-eyebrow">🎖️ Salle des trophées</p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Chaque effort laisse une trace</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Explore ta collection et découvre les prochains exploits à accomplir.</p>
          </div>
          <div className="min-w-52 rounded-2xl border border-[var(--border)] bg-[var(--bg)]/35 p-4">
            <div className="flex items-end justify-between">
              <span className="text-xs text-[var(--text-muted)]">Collection</span>
              <strong className="text-2xl text-[var(--neon-violet)]">{obtenus.size}/{badges.length}</strong>
            </div>
            <div className="game-progress mt-2 h-2.5" role="progressbar" aria-label="Progression des badges" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}>
              <span style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-2 text-right text-xs font-bold text-[var(--accent-text)]">{pct}% débloqué</p>
          </div>
        </div>
      </section>

      {BADGE_CATEGORIES.map((cat) => {
        const badgesCat = badges.filter((b) => b.categorie === cat.key)
        if (badgesCat.length === 0) return null
        return (
          <Card key={cat.key} className="mb-4 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold" style={{ color: cat.color }}>{cat.label}</h2>
              <span className="game-kicker">{badgesCat.filter((badge) => obtenus.has(badge.id)).length}/{badgesCat.length}</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {badgesCat.map((b) => (
                <BadgeChip key={b.id} badge={b} obtenu={obtenus.has(b.id)} />
              ))}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
