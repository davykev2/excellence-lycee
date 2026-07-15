import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpenIcon } from '@phosphor-icons/react/dist/csr/BookOpen'
import { ClipboardTextIcon } from '@phosphor-icons/react/dist/csr/ClipboardText'
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { ExamIcon } from '@phosphor-icons/react/dist/csr/Exam'
import { GearSixIcon } from '@phosphor-icons/react/dist/csr/GearSix'
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House'
import { LightningIcon } from '@phosphor-icons/react/dist/csr/Lightning'
import { MedalIcon } from '@phosphor-icons/react/dist/csr/Medal'
import { PencilSimpleLineIcon } from '@phosphor-icons/react/dist/csr/PencilSimpleLine'
import { RankingIcon } from '@phosphor-icons/react/dist/csr/Ranking'
import { ShieldCheckeredIcon } from '@phosphor-icons/react/dist/csr/ShieldCheckered'
import { SpeakerSimpleHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleHigh'
import { SpeakerSimpleSlashIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleSlash'
import { SwordIcon } from '@phosphor-icons/react/dist/csr/Sword'
import { TrophyIcon } from '@phosphor-icons/react/dist/csr/Trophy'
import { UserCircleIcon } from '@phosphor-icons/react/dist/csr/UserCircle'
import { UsersThreeIcon } from '@phosphor-icons/react/dist/csr/UsersThree'
import Avatar from '../components/ui/Avatar'
import Loader from '../components/ui/Loader'
import WelcomeModal from '../components/gamification/WelcomeModal'
import { computeLevel } from '../lib/level'
import { isAndroidHomePreview } from '../lib/nativeApp'
import { supabase } from '../lib/supabaseClient'
import { useAudioFeedback } from '../store/useAudioFeedbackStore'
import { useAuthStore } from '../store/useAuthStore'
import campusArtwork from '../assets/campus/campus-excellence-night-v1.png'
import './AndroidDashboard.css'

const DESTINATIONS = [
  { to: '/resumes', label: 'Cours', Icon: BookOpenIcon, x: '19%', y: '12%', tone: 'cyan' },
  { to: '/devoirs', label: 'Devoirs', Icon: ExamIcon, x: '55%', y: '13%', tone: 'gold' },
  { to: '/quiz-rapide', label: 'Éclair', Icon: LightningIcon, x: '84%', y: '28%', tone: 'cyan', featured: true },
  { to: '/exercices', label: 'Exercices', Icon: PencilSimpleLineIcon, x: '18%', y: '37%', tone: 'violet' },
  { to: '/competitions', label: 'Compétitions', Icon: TrophyIcon, x: '18%', y: '64%', tone: 'gold' },
  { to: '/badges', label: 'Badges', Icon: MedalIcon, x: '80%', y: '65%', tone: 'violet' },
  { to: '/defis', label: 'Duels', Icon: SwordIcon, x: '53%', y: '86%', tone: 'magenta', featured: true },
]

const compactNumber = new Intl.NumberFormat('fr-FR', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const PREVIEW_PROFILE = {
  id: 'android-campus-preview',
  username: 'Aïcha',
  avatar_url: null,
  points_carriere: 1970,
  niveau_id: null,
  serie_id: null,
  approuve: true,
  is_admin: false,
}

function displayCount(value) {
  return value == null ? '—' : compactNumber.format(value)
}

function MailBadge({ count }) {
  if (!count) return null
  return <span className="android-campus-mail-badge">{count > 99 ? '99+' : count}</span>
}

function CampusSoundButton() {
  const { muted, supported, setMuted, unlock, play } = useAudioFeedback()
  const disabled = !supported
  const SoundIcon = muted || disabled ? SpeakerSimpleSlashIcon : SpeakerSimpleHighIcon
  const label = disabled ? 'Sons indisponibles' : muted ? 'Activer les sons' : 'Désactiver les sons'

  async function toggleSound() {
    if (disabled) return
    if (muted) {
      setMuted(false)
      if (await unlock()) play('notification')
      return
    }
    play('click')
    setMuted(true)
  }

  return (
    <button
      type="button"
      className="android-campus-round-action"
      onClick={toggleSound}
      disabled={disabled}
      data-audio-feedback="off"
      aria-label={label}
      aria-pressed={!muted && !disabled}
    >
      <SoundIcon size={21} weight="duotone" aria-hidden="true" />
    </button>
  )
}

export default function AndroidDashboard() {
  const storedProfile = useAuthStore((state) => state.profile)
  const previewMode = isAndroidHomePreview()
  const profile = storedProfile ?? (previewMode ? PREVIEW_PROFILE : null)
  const [stats, setStats] = useState(() => (
    previewMode && !storedProfile
      ? { badges: 12, unreadMail: 3, rank: 2 }
      : { badges: null, unreadMail: null, rank: null }
  ))

  const level = useMemo(() => computeLevel(profile?.points_carriere ?? 0), [profile?.points_carriere])

  useEffect(() => {
    if (!profile?.id) return undefined
    if (previewMode && !storedProfile) {
      setStats({ badges: 12, unreadMail: 3, rank: 2 })
      return undefined
    }
    let active = true

    async function loadCampusStats() {
      const rankingRequest = profile.niveau_id && profile.serie_id
        ? supabase.rpc('get_classement_classe', {
            p_niveau_id: profile.niveau_id,
            p_serie_id: profile.serie_id,
          })
        : Promise.resolve({ data: [] })

      const [badgesResult, mailResult, rankingResult] = await Promise.all([
        supabase.from('user_badges').select('id', { count: 'exact', head: true }).eq('user_id', profile.id),
        supabase.from('messages_prives').select('id', { count: 'exact', head: true }).eq('vers', profile.id).eq('lu', false),
        rankingRequest,
      ])

      if (!active) return
      const rows = rankingResult.data ?? []
      const rankIndex = rows.findIndex((row) => row.user_id === profile.id)
      setStats({
        badges: badgesResult.count ?? 0,
        unreadMail: mailResult.count ?? 0,
        rank: rankIndex >= 0 ? rankIndex + 1 : null,
      })
    }

    loadCampusStats()

    const channel = supabase
      .channel(`campus-mail-${profile.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages_prives', filter: `vers=eq.${profile.id}` },
        () => setStats((current) => ({ ...current, unreadMail: (current.unreadMail ?? 0) + 1 })),
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [previewMode, profile?.id, profile?.niveau_id, profile?.serie_id, storedProfile])

  if (!profile) return <Loader />

  return (
    <div className="android-campus-shell" data-android-campus-home>
      {storedProfile && <WelcomeModal userId={profile.id} username={profile.username} />}

      <header className="android-campus-hud">
        <div className="android-campus-player-row">
          <Link to="/profil" className="android-campus-player" aria-label="Voir mon profil">
            <Avatar profile={profile} size="h-12 w-12" forceOnline ring />
            <span className="android-campus-player-copy">
              <strong>{profile.username}</strong>
              <small>Niveau {level.level} · {level.titre}</small>
              <span className="android-campus-xp-track" aria-label={`Progression du niveau : ${level.pct} %`}>
                <span style={{ width: `${level.pct}%` }} />
              </span>
            </span>
          </Link>

          <div className="android-campus-actions">
            <CampusSoundButton />
            {profile.is_admin && (
              <Link to="/admin" className="android-campus-round-action" aria-label="Ouvrir l’administration">
                <GearSixIcon size={21} weight="duotone" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>

        <div className="android-campus-resource-row" aria-label="Progression du joueur">
          <div className="android-campus-resource">
            <LightningIcon size={18} weight="fill" aria-hidden="true" />
            <span><strong>{displayCount(profile.points_carriere)}</strong><small>Points</small></span>
          </div>
          <div className="android-campus-resource">
            <MedalIcon size={18} weight="duotone" aria-hidden="true" />
            <span><strong>{displayCount(stats.badges)}</strong><small>Badges</small></span>
          </div>
          <div className="android-campus-resource">
            <RankingIcon size={18} weight="duotone" aria-hidden="true" />
            <span><strong>{stats.rank ? `#${stats.rank}` : '—'}</strong><small>Classe</small></span>
          </div>
        </div>
      </header>

      <main className="android-campus-map" aria-label="Carte interactive du Campus Excellence">
        <img
          className="android-campus-map-art"
          src={campusArtwork}
          alt="Campus Excellence vu du ciel avec ses pavillons d’apprentissage"
          fetchPriority="high"
          decoding="async"
        />
        <div className="android-campus-map-veil" aria-hidden="true" />

        <div className="android-campus-map-title" aria-hidden="true">
          <ShieldCheckeredIcon size={16} weight="fill" />
          Campus Excellence
        </div>

        {DESTINATIONS.map(({ to, label, Icon, x, y, tone, featured }) => (
          <Link
            key={to}
            to={to}
            className={`android-campus-hotspot android-campus-hotspot--${tone}${featured ? ' is-featured' : ''}`}
            style={{ '--campus-x': x, '--campus-y': y }}
            aria-label={`Ouvrir ${label}`}
          >
            <span className="android-campus-hotspot-icon"><Icon size={24} weight="duotone" aria-hidden="true" /></span>
            <span className="android-campus-hotspot-label">{label}</span>
          </Link>
        ))}

        {!profile.approuve && (
          <div className="android-campus-account-alert" role="status">
            Ton compte est temporairement désapprouvé. Contacte l’administration pour retrouver toutes les fonctions.
          </div>
        )}
      </main>

      <footer className="android-campus-bottom">
        <div className="android-campus-mission-strip">
          <ClipboardTextIcon size={17} weight="duotone" aria-hidden="true" />
          <span><strong>Ton campus t’attend.</strong> Choisis ta prochaine mission.</span>
        </div>

        <nav className="android-campus-dock" aria-label="Navigation principale du campus">
          <Link to="/dashboard" className="android-campus-dock-item is-active" aria-current="page">
            <HouseIcon size={24} weight="fill" aria-hidden="true" />
            <span>Accueil</span>
          </Link>
          <Link to="/classement" className="android-campus-dock-item">
            <RankingIcon size={24} weight="duotone" aria-hidden="true" />
            <span>Classement</span>
          </Link>
          <Link to="/communaute?tab=mp" className="android-campus-dock-item android-campus-dock-mail">
            <span className="android-campus-dock-mail-icon">
              <EnvelopeSimpleIcon size={30} weight="duotone" aria-hidden="true" />
              <MailBadge count={stats.unreadMail} />
            </span>
            <span>Courrier</span>
          </Link>
          <Link to="/communaute" className="android-campus-dock-item">
            <UsersThreeIcon size={24} weight="duotone" aria-hidden="true" />
            <span>Communauté</span>
          </Link>
          <Link to="/profil" className="android-campus-dock-item">
            <UserCircleIcon size={24} weight="duotone" aria-hidden="true" />
            <span>Profil</span>
          </Link>
        </nav>
      </footer>
    </div>
  )
}
