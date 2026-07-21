import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/admin', label: 'Vue d\'ensemble', end: true },
  { to: '/admin/contenus', label: 'Atelier' },
  { to: '/admin/resumes', label: 'Résumés' },
  { to: '/admin/exercices-guides', label: 'Exercices' },
  { to: '/admin/devoirs', label: 'Devoirs' },
  { to: '/admin/couverture', label: 'Couverture' },
  { to: '/admin/catalogue', label: 'Structure' },
  { to: '/admin/users', label: 'Utilisateurs' },
  { to: '/admin/signalements', label: 'Signalements' },
  { to: '/admin/settings', label: 'Paramètres' },
]

export default function AdminLayout() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-[var(--neon-magenta)]">⚙️ Administration</h1>
      <nav className="mb-6 flex flex-wrap gap-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `rounded-full border px-3 py-1.5 text-sm transition ${
                isActive ? 'border-[var(--neon-magenta)] text-[var(--neon-magenta)] bg-[var(--neon-magenta)]/10' : 'border-[var(--border)] text-[var(--text-muted)]'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
