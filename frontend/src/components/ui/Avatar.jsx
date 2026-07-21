import { usePresenceStore } from '../../store/usePresenceStore'

// Avatar unifié avec voyant de présence (vert = en ligne, gris = hors ligne).
// Utilisable partout où un nom/avatar apparaît.
//
// Props :
// - userId : id du profil (pour la présence)
// - username / avatarUrl : ou passer `profile` directement
// - size : classes tailwind (h-x w-x)
// - showPresence : afficher le voyant (défaut true)
// - forceOnline : forcer l'état en ligne (ex. l'utilisateur courant sur son propre avatar)

const SIZE_DOT = {
  'h-6 w-6': 'h-2 w-2',
  'h-7 w-7': 'h-2.5 w-2.5',
  'h-8 w-8': 'h-2.5 w-2.5',
  'h-9 w-9': 'h-3 w-3',
  'h-10 w-10': 'h-3 w-3',
  'h-16 w-16': 'h-4 w-4',
  'h-20 w-20': 'h-5 w-5',
}

export default function Avatar({
  profile,
  userId,
  username,
  avatarUrl,
  size = 'h-8 w-8',
  showPresence = true,
  forceOnline = false,
  ring = false,
}) {
  const id = userId ?? profile?.id
  const url = avatarUrl ?? profile?.avatar_url
  const name = username ?? profile?.username
  const onlineFromStore = usePresenceStore((s) => (id ? s.onlineIds.has(id) : false))
  const online = forceOnline || onlineFromStore
  const dotSize = SIZE_DOT[size] ?? 'h-2.5 w-2.5'

  return (
    <span className={`relative inline-block shrink-0 ${ring ? 'rounded-full ring-2 ring-[var(--neon-violet)]/50' : ''}`}>
      {url ? (
        <img src={url} alt="" className={`${size} rounded-full object-cover`} />
      ) : (
        <span className={`${size} grid place-items-center rounded-full bg-[var(--neon-violet)]/30 text-xs font-semibold uppercase`}>
          {name?.[0]?.toUpperCase() ?? '?'}
        </span>
      )}
      {showPresence && id && (
        <span
          className={`presence-dot ${dotSize} ${online ? 'presence-dot--on' : 'presence-dot--off'}`}
          title={online ? 'En ligne' : 'Hors ligne'}
          aria-label={online ? 'En ligne' : 'Hors ligne'}
        />
      )}
    </span>
  )
}

// Petit libellé « En ligne / Hors ligne » à côté d'un nom
export function PresenceLabel({ userId, forceOnline = false, className = '' }) {
  const online = usePresenceStore((s) => (userId ? s.onlineIds.has(userId) : false)) || forceOnline
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-[var(--online)]' : 'bg-[var(--text-muted)]'}`} />
      <span className={online ? 'text-[var(--online)]' : 'text-[var(--text-muted)]'}>
        {online ? 'En ligne' : 'Hors ligne'}
      </span>
    </span>
  )
}
