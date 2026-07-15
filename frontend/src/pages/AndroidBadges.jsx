/* eslint-disable react-refresh/only-export-components */
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BarbellIcon } from '@phosphor-icons/react/dist/csr/Barbell'
import { BookOpenIcon } from '@phosphor-icons/react/dist/csr/BookOpen'
import { CalendarCheckIcon } from '@phosphor-icons/react/dist/csr/CalendarCheck'
import { ChatCircleDotsIcon } from '@phosphor-icons/react/dist/csr/ChatCircleDots'
import { EnvelopeSimpleIcon } from '@phosphor-icons/react/dist/csr/EnvelopeSimple'
import { FireIcon } from '@phosphor-icons/react/dist/csr/Fire'
import { FootprintsIcon } from '@phosphor-icons/react/dist/csr/Footprints'
import { GraduationCapIcon } from '@phosphor-icons/react/dist/csr/GraduationCap'
import { HouseIcon } from '@phosphor-icons/react/dist/csr/House'
import { LightningIcon } from '@phosphor-icons/react/dist/csr/Lightning'
import { LockKeyIcon } from '@phosphor-icons/react/dist/csr/LockKey'
import { MedalIcon } from '@phosphor-icons/react/dist/csr/Medal'
import { NumberOneIcon } from '@phosphor-icons/react/dist/csr/NumberOne'
import { PersonSimpleRunIcon } from '@phosphor-icons/react/dist/csr/PersonSimpleRun'
import { RankingIcon } from '@phosphor-icons/react/dist/csr/Ranking'
import { RocketLaunchIcon } from '@phosphor-icons/react/dist/csr/RocketLaunch'
import { SealCheckIcon } from '@phosphor-icons/react/dist/csr/SealCheck'
import { ShieldCheckeredIcon } from '@phosphor-icons/react/dist/csr/ShieldCheckered'
import { StarIcon } from '@phosphor-icons/react/dist/csr/Star'
import { SwordIcon } from '@phosphor-icons/react/dist/csr/Sword'
import { TrendUpIcon } from '@phosphor-icons/react/dist/csr/TrendUp'
import { TrophyIcon } from '@phosphor-icons/react/dist/csr/Trophy'
import { UserCircleIcon } from '@phosphor-icons/react/dist/csr/UserCircle'
import { XIcon } from '@phosphor-icons/react/dist/csr/X'
import { BADGE_CATEGORIES } from '../utils/constants'
import { supabase } from '../lib/supabaseClient'
import badgeVaultArtwork from '../assets/badges/badge-vault-night-v1.png'
import './AndroidBadges.css'

const ICONS_BY_CODE = {
  sans_faute: SealCheckIcon,
  perfectionniste: StarIcon,
  eclair: LightningIcon,
  premier_pas: FootprintsIcon,
  chapitre_maitrise: BookOpenIcon,
  matiere_completee: GraduationCapIcon,
  saison_complete: CalendarCheckIcon,
  serie_en_cours: FireIcon,
  marathonien: PersonSimpleRunIcon,
  increvable: BarbellIcon,
  top10_classe: TrophyIcon,
  numero1: NumberOneIcon,
  podium_saison: MedalIcon,
  duelliste: SwordIcon,
  invaincu: ShieldCheckeredIcon,
  revanche_reussie: TrendUpIcon,
  remontada: RocketLaunchIcon,
}

const CATEGORY_TONES = {
  performance: 'cyan',
  progression: 'green',
  assiduite: 'violet',
  competition: 'gold',
  amelioration: 'magenta',
}

export const ANDROID_BADGE_PREVIEW_PROFILE = {
  id: 'android-badge-preview',
  username: 'Aïcha',
  niveau_id: 'preview-niveau',
}

export const ANDROID_BADGE_PREVIEW_BADGES = [
  ['sans_faute', 'performance', 'Sans-faute', 'Obtenir 20/20 à un quiz'],
  ['perfectionniste', 'performance', 'Perfectionniste', 'Obtenir 20/20 dès la première tentative'],
  ['eclair', 'performance', 'Éclair', 'Obtenir au moins 16/20 très rapidement'],
  ['premier_pas', 'progression', 'Premier pas', 'Valider son premier quiz'],
  ['chapitre_maitrise', 'progression', 'Chapitre maîtrisé', 'Réussir tous les quiz d’un chapitre'],
  ['matiere_completee', 'progression', 'Matière complétée', 'Terminer tous les chapitres d’une matière'],
  ['saison_complete', 'progression', 'Saison complète', 'Être actif chaque semaine du trimestre'],
  ['serie_en_cours', 'assiduite', 'Série en cours', 'Être actif trois jours consécutifs'],
  ['marathonien', 'assiduite', 'Marathonien', 'Cumuler trente jours d’activité'],
  ['increvable', 'assiduite', 'Increvable', 'Faire trois tentatives sur un même devoir'],
  ['top10_classe', 'competition', 'Top 10', 'Entrer dans le top 10 de sa classe'],
  ['numero1', 'competition', 'Numéro 1', 'Être premier du classement'],
  ['podium_saison', 'competition', 'Podium', 'Terminer une saison dans le top 3'],
  ['duelliste', 'competition', 'Duelliste', 'Jouer dix duels'],
  ['invaincu', 'competition', 'Invaincu', 'Gagner cinq duels d’affilée'],
  ['revanche_reussie', 'amelioration', 'Revanche réussie', 'Gagner quatre points entre deux tentatives'],
  ['remontada', 'amelioration', 'Remontada', 'Gagner dix places en une semaine'],
].map(([code, categorie, nom, description], index) => ({
  id: `preview-badge-${index + 1}`,
  code,
  categorie,
  nom,
  description,
  icone: '',
}))

const PREVIEW_MESSAGES = [
  { id: 'preview-message-1', contenu: 'Quelqu’un révise les limites ce soir ?', profiles: { username: 'Moussa' } },
  { id: 'preview-message-2', contenu: 'Oui, rendez-vous dans le chat à 20 h.', profiles: { username: 'Davy' } },
]

function GlobalChatStrip({ profile, previewMode }) {
  const [messages, setMessages] = useState(previewMode ? PREVIEW_MESSAGES : [])
  const [livePulse, setLivePulse] = useState(0)

  useEffect(() => {
    if (!profile?.niveau_id || previewMode) return undefined
    let active = true

    async function loadLatestMessages() {
      const { data } = await supabase
        .from('chat_global')
        .select('id, user_id, niveau_id, contenu, created_at, profiles(username)')
        .eq('niveau_id', profile.niveau_id)
        .order('created_at', { ascending: false })
        .limit(6)
      if (active) setMessages((data ?? []).reverse())
    }

    loadLatestMessages()

    const channel = supabase
      .channel(`badge-chat-niveau-${profile.niveau_id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_global', filter: `niveau_id=eq.${profile.niveau_id}` },
        async (payload) => {
          const { data: auteur } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single()
          if (!active) return
          setMessages((current) => [...current.slice(-5), { ...payload.new, profiles: auteur }])
          setLivePulse((value) => value + 1)
        },
      )
      .subscribe()

    return () => {
      active = false
      supabase.removeChannel(channel)
    }
  }, [previewMode, profile?.niveau_id])

  const visibleMessages = messages.slice(-2)

  return (
    <Link to="/communaute" className={`android-badge-chat${livePulse ? ' has-update' : ''}`} aria-label="Ouvrir le chat global">
      <span className="android-badge-chat__status" aria-hidden="true"><i /> Direct</span>
      <span className="android-badge-chat__messages" key={livePulse}>
        {visibleMessages.length ? visibleMessages.map((message) => (
          <span key={message.id}>
            <strong>[GLOBAL] {message.profiles?.username ?? 'Élève'} :</strong> {message.contenu}
          </span>
        )) : <span><strong>[GLOBAL]</strong> Aucun message récent. Lance la discussion.</span>}
      </span>
      <ChatCircleDotsIcon size={30} weight="duotone" aria-hidden="true" />
    </Link>
  )
}

function BadgeTile({ badge, obtained, selected, onSelect }) {
  const Icon = ICONS_BY_CODE[badge.code] ?? MedalIcon
  const tone = CATEGORY_TONES[badge.categorie] ?? 'cyan'

  return (
    <button
      type="button"
      className={`android-badge-tile is-${tone}${obtained ? ' is-obtained' : ' is-locked'}${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect(badge)}
    >
      <span className="android-badge-tile__emblem">
        <Icon size={37} weight={obtained ? 'duotone' : 'regular'} aria-hidden="true" />
        {!obtained && <span className="android-badge-tile__lock"><LockKeyIcon size={22} weight="fill" aria-hidden="true" /></span>}
      </span>
      <span className="android-badge-tile__name">{badge.nom}</span>
      <span className="android-badge-tile__state">{obtained ? 'Obtenu' : 'Verrouillé'}</span>
    </button>
  )
}

function BadgeDetail({ badge, obtained, onClose }) {
  if (!badge) return null
  const Icon = ICONS_BY_CODE[badge.code] ?? MedalIcon
  return (
    <aside className="android-badge-detail" aria-live="polite">
      <span className="android-badge-detail__icon"><Icon size={28} weight="duotone" aria-hidden="true" /></span>
      <span><strong>{badge.nom}</strong><small>{badge.description}</small></span>
      <span className={obtained ? 'is-obtained' : 'is-locked'}>{obtained ? 'Débloqué' : 'À accomplir'}</span>
      <button type="button" onClick={onClose} aria-label="Fermer le détail"><XIcon size={18} weight="bold" /></button>
    </aside>
  )
}

export default function AndroidBadges({ badges, obtainedIds, profile, previewMode = false }) {
  const [category, setCategory] = useState('all')
  const [selectedBadge, setSelectedBadge] = useState(null)
  const pct = badges.length ? Math.round((obtainedIds.size / badges.length) * 100) : 0
  const filteredBadges = useMemo(
    () => category === 'all' ? badges : badges.filter((badge) => badge.categorie === category),
    [badges, category],
  )

  useEffect(() => {
    document.documentElement.classList.add('is-android-badges')
    return () => document.documentElement.classList.remove('is-android-badges')
  }, [])

  return (
    <div className="android-badge-shell" data-android-badges>
      <img className="android-badge-art" src={badgeVaultArtwork} alt="Salle des distinctions du Campus Excellence" fetchPriority="high" />
      <div className="android-badge-veil" aria-hidden="true" />

      <header className="android-badge-header">
        <Link to="/dashboard" className="android-badge-header__home" aria-label="Retour au campus"><HouseIcon size={22} weight="fill" /></Link>
        <span className="android-badge-header__title"><MedalIcon size={20} weight="duotone" /><span><strong>Salle des distinctions</strong><small>{profile?.username ?? 'Collection'}</small></span></span>
        <span className="android-badge-header__score"><strong>{obtainedIds.size}</strong><small>/{badges.length}</small></span>
      </header>

      <section className="android-badge-progress" aria-label={`Collection complétée à ${pct} %`}>
        <div><span><TrophyIcon size={18} weight="fill" /> Collection</span><strong>{pct}%</strong></div>
        <span className="android-badge-progress__track"><span style={{ width: `${pct}%` }} /></span>
      </section>

      <nav className="android-badge-tabs" aria-label="Catégories de badges">
        <button type="button" className={category === 'all' ? 'is-active' : ''} onClick={() => setCategory('all')}>Tous</button>
        {BADGE_CATEGORIES.map((item) => (
          <button key={item.key} type="button" className={category === item.key ? 'is-active' : ''} onClick={() => setCategory(item.key)}>{item.label}</button>
        ))}
      </nav>

      <main className="android-badge-gallery">
        <div className="android-badge-gallery__meta"><span>{category === 'all' ? 'Tous les exploits' : BADGE_CATEGORIES.find((item) => item.key === category)?.label}</span><small>{filteredBadges.filter((badge) => obtainedIds.has(badge.id)).length}/{filteredBadges.length} obtenus</small></div>
        <div className="android-badge-grid">
          {filteredBadges.map((badge) => (
            <BadgeTile
              key={badge.id}
              badge={badge}
              obtained={obtainedIds.has(badge.id)}
              selected={selectedBadge?.id === badge.id}
              onSelect={setSelectedBadge}
            />
          ))}
        </div>
      </main>

      <BadgeDetail badge={selectedBadge} obtained={selectedBadge ? obtainedIds.has(selectedBadge.id) : false} onClose={() => setSelectedBadge(null)} />

      <footer className="android-badge-bottom">
        <GlobalChatStrip profile={profile} previewMode={previewMode} />
        <nav className="android-badge-dock" aria-label="Navigation de la salle des distinctions">
          <Link to="/dashboard"><HouseIcon size={24} weight="duotone" /><span>Accueil</span></Link>
          <Link to="/classement"><RankingIcon size={24} weight="duotone" /><span>Classement</span></Link>
          <Link to="/badges" className="is-active" aria-current="page"><MedalIcon size={28} weight="fill" /><span>Badges</span></Link>
          <Link to="/communaute?tab=mp"><EnvelopeSimpleIcon size={24} weight="duotone" /><span>Courrier</span></Link>
          <Link to="/profil"><UserCircleIcon size={24} weight="duotone" /><span>Profil</span></Link>
        </nav>
      </footer>
    </div>
  )
}
