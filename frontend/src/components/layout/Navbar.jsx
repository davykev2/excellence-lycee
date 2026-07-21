import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import UserAvatar from '../ui/Avatar'
import AudioToggle from '../gamification/AudioToggle'
import MobileGameDock from './MobileGameDock'
import { computeLevel } from '../../lib/level'
import { isAndroidBadgeExperience, isAndroidDuelExperience, isAndroidHomeExperience } from '../../lib/nativeApp'

const LIENS = [
  { to: '/dashboard', label: 'Accueil', icon: '🏠' },
  { to: '/classement', label: 'Classement', icon: '🏆' },
  { to: '/badges', label: 'Badges', icon: '🎖️' },
  { to: '/communaute', label: 'Communauté', icon: '💬' },
]

const ENTRAINEMENT = [
  { to: '/resumes', label: 'Résumés', icon: '📖' },
  { to: '/exercices', label: 'Exercices', icon: '✏️' },
  { to: '/quiz-rapide', label: 'Quiz rapide', icon: '⚡' },
  { to: '/devoirs', label: 'Devoirs', icon: '📝' },
  { to: '/defis', label: 'Duels', icon: '⚔️' },
  { to: '/competitions', label: 'Compétitions', icon: '🏁' },
]

export default function Navbar() {
  const { session, profile, signOut, toggleTheme } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOuvert, setMenuOuvert] = useState(false)
  const [dropdownOuvert, setDropdownOuvert] = useState(false)
  const dropdownRef = useRef(null)

  // Ferme les menus à chaque navigation
  useEffect(() => {
    setMenuOuvert(false)
    setDropdownOuvert(false)
  }, [location.pathname])

  // Ferme les menus avec la touche Échap
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setMenuOuvert(false)
        setDropdownOuvert(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    function onPointerDown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOuvert(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  const niveau = computeLevel(profile?.points_carriere ?? 0)
  const entrainementActif = location.pathname.startsWith('/entrainement/')
    || ENTRAINEMENT.some(({ to }) => location.pathname === to || location.pathname.startsWith(`${to}/`))

  async function handleLogout() {
    setMenuOuvert(false)
    setDropdownOuvert(false)
    await signOut()
    navigate('/')
  }

  const fullScreenAndroid = (location.pathname === '/dashboard' && isAndroidHomeExperience())
    || (location.pathname === '/defis' && isAndroidDuelExperience())
    || (location.pathname === '/badges' && isAndroidBadgeExperience())
  if (fullScreenAndroid) return null

  return (
    <>
    <header className="app-header sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4">
        <NavLink to={session ? '/dashboard' : '/'} className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold neon-text">EXCELLENCE</span>
          <span className="rounded border border-[var(--neon-violet)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--neon-violet)]">
            LYCÉE
          </span>
        </NavLink>

        {/* Liens desktop */}
        {session && (
          <nav className="ml-4 hidden flex-1 items-center gap-1 lg:flex">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition ${
                  isActive ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              Accueil
            </NavLink>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOuvert((ouvert) => !ouvert)}
                aria-haspopup="menu"
                aria-expanded={dropdownOuvert}
                className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition ${
                  entrainementActif || dropdownOuvert
                    ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                Entraînement
                <span className={`text-[10px] transition-transform ${dropdownOuvert ? 'rotate-180' : ''}`} aria-hidden="true">⌄</span>
              </button>

              {dropdownOuvert && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-1.5 shadow-2xl"
                >
                  {ENTRAINEMENT.map((lien) => (
                    <NavLink
                      key={lien.to}
                      to={lien.to}
                      role="menuitem"
                      onClick={() => setDropdownOuvert(false)}
                      className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]'
                          : 'text-[var(--text)] hover:bg-[var(--border)]/45'
                      }`}
                    >
                      <span className="w-5 text-center" aria-hidden="true">{lien.icon}</span>
                      {lien.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            <NavLink
              to="/classement"
              className={({ isActive }) =>
                `rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition ${
                  isActive ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              Classement
            </NavLink>
            <NavLink
              to="/badges"
              className={({ isActive }) =>
                `rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition ${
                  isActive ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              Badges
            </NavLink>
            <NavLink
              to="/communaute"
              className={({ isActive }) =>
                `rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap transition ${
                  isActive ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`
              }
            >
              Communauté
            </NavLink>

            {profile?.is_admin && (
              <NavLink
                to="/admin"
                className="ml-1 rounded-full border border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/15 px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-[var(--neon-magenta)] transition hover:bg-[var(--neon-magenta)]/25"
              >
                Admin
              </NavLink>
            )}
          </nav>
        )}

        <div className="ml-auto flex items-center gap-2">
          <AudioToggle className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-sm cursor-pointer hover:border-[var(--neon-cyan)] disabled:cursor-not-allowed disabled:opacity-50" />
          <button
            type="button"
            onClick={toggleTheme}
            title="Changer de thème"
            aria-label="Changer de thème"
            className="grid h-9 w-9 place-items-center rounded-md border border-[var(--border)] text-sm cursor-pointer hover:border-[var(--neon-cyan)]"
          >
            🌓
          </button>

          {session ? (
            <>
              {/* Profil + déconnexion : desktop uniquement */}
              <NavLink
                to="/profil"
                className="hidden items-center gap-2 rounded-md border border-[var(--border)] px-2 py-1.5 text-sm hover:border-[var(--neon-cyan)] lg:flex"
              >
                <Avatar profile={profile} />
                <span>{profile?.username ?? '…'}</span>
                <span className="rounded-full bg-[var(--neon-violet)]/15 px-1.5 py-0.5 text-[10px] font-bold text-[var(--neon-violet)]">
                  Niv. {niveau.level}
                </span>
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-md border border-[var(--border)] px-2.5 py-1.5 text-sm cursor-pointer hover:border-[var(--neon-magenta)] hover:text-[var(--neon-magenta)] lg:block"
              >
                Déconnexion
              </button>

              {/* Avatar = bouton menu sur mobile/tablette */}
              <button
                type="button"
                onClick={() => setMenuOuvert((o) => !o)}
                aria-label={menuOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuOuvert}
                className={`grid h-9 w-9 place-items-center rounded-full cursor-pointer transition lg:hidden ${
                  menuOuvert ? 'ring-2 ring-[var(--neon-cyan)]' : 'ring-1 ring-[var(--border)] hover:ring-[var(--neon-cyan)]'
                }`}
              >
                <Avatar profile={profile} size="h-8 w-8" />
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="rounded-md px-2.5 py-1.5 text-sm whitespace-nowrap hover:text-[var(--neon-cyan)]">
                Connexion
              </NavLink>
              <NavLink
                to="/signup"
                className="rounded-md bg-[var(--neon-cyan)] px-3 py-1.5 text-sm font-semibold whitespace-nowrap text-black hover:brightness-110"
              >
                Inscription
              </NavLink>
            </>
          )}
        </div>
      </div>

      {/* Menu mobile déroulant */}
      {session && menuOuvert && (
        <nav className="max-h-[calc(100dvh-3.5rem-var(--app-safe-top))] overflow-y-auto border-t border-[var(--border)] bg-[var(--bg)] px-4 pb-4 pt-2 lg:hidden">
          <NavLink
            to="/profil"
            className="mb-2 flex items-center gap-3 rounded-lg border border-[var(--border)] p-3"
          >
            <Avatar profile={profile} size="h-9 w-9" />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{profile?.username ?? '…'}</p>
              <p className="text-xs text-[var(--text-muted)]">Voir mon profil</p>
            </div>
          </NavLink>

          <div className="flex flex-col">
            {LIENS.map((l) => (
              <MobileLink key={l.to} {...l} />
            ))}

            {ENTRAINEMENT.map((l) => (
              <MobileLink key={l.to} {...l} />
            ))}

            {profile?.is_admin && (
              <NavLink
                to="/admin"
                className="mt-3 flex items-center gap-3 rounded-lg border border-[var(--neon-magenta)] bg-[var(--neon-magenta)]/15 px-3 py-2.5 text-sm font-semibold text-[var(--neon-magenta)]"
              >
                <span className="w-5 text-center">⚙️</span>
                Admin
              </NavLink>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-[var(--neon-magenta)] cursor-pointer hover:bg-[var(--neon-magenta)]/10"
          >
            <span className="w-5 text-center">🚪</span>
            Déconnexion
          </button>
        </nav>
      )}

    </header>

    {session && !location.pathname.startsWith('/admin') && (
      <MobileGameDock />
    )}
    </>
  )
}

function MobileLink({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition ${
          isActive ? 'bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]' : 'text-[var(--text)] hover:bg-[var(--border)]/40'
        }`
      }
    >
      <span className="w-5 text-center">{icon}</span>
      {label}
    </NavLink>
  )
}

function Avatar({ profile, size = 'h-6 w-6' }) {
  // L'utilisateur courant est par définition en ligne
  return <UserAvatar profile={profile} size={size} forceOnline />
}
