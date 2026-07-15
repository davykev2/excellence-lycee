import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'

const DOCK_LINKS = [
  { to: '/dashboard', label: 'Accueil', icon: '🏠' },
  { to: '/resumes', label: 'Cours', icon: '📖' },
  { to: '/exercices', label: 'Exercices', icon: '✏️' },
  { to: '/devoirs', label: 'Devoirs', icon: '📝' },
  { to: '/quiz-rapide', label: 'Éclair', icon: '⚡' },
  { to: '/defis', label: 'Duels', icon: '⚔️' },
  { to: '/competitions', label: 'Compétitions', icon: '🏁' },
]

function matchesDockRoute(pathname, to) {
  if (to === '/resumes') return pathname.startsWith('/resumes')
  if (to === '/exercices') {
    return pathname === '/exercices'
      || pathname.startsWith('/matiere/')
      || pathname.startsWith('/chapitre/')
      || pathname === '/entrainement'
      || pathname.startsWith('/entrainement/')
  }
  return pathname === to || pathname.startsWith(`${to}/`)
}

export default function MobileGameDock() {
  const { pathname } = useLocation()
  const [viewportRef, emblaApi] = useEmblaCarousel({
    align: 'center',
    containScroll: false,
    dragFree: false,
    duration: 28,
    loop: true,
    skipSnaps: false,
  })
  const [centeredIndex, setCenteredIndex] = useState(0)

  const activeIndex = useMemo(
    () => DOCK_LINKS.findIndex((link) => matchesDockRoute(pathname, link.to)),
    [pathname],
  )

  const syncCenteredIndex = useCallback((api) => {
    setCenteredIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return undefined
    syncCenteredIndex(emblaApi)
    emblaApi.on('select', syncCenteredIndex)
    emblaApi.on('reInit', syncCenteredIndex)
    return () => {
      emblaApi.off('select', syncCenteredIndex)
      emblaApi.off('reInit', syncCenteredIndex)
    }
  }, [emblaApi, syncCenteredIndex])

  useEffect(() => {
    if (emblaApi && activeIndex >= 0) emblaApi.scrollTo(activeIndex)
  }, [activeIndex, emblaApi])

  return (
    <nav className="mobile-game-dock lg:hidden" aria-label="Navigation principale mobile">
      <div className="mobile-game-dock__viewport" ref={viewportRef}>
        <div className="mobile-game-dock__track">
          {DOCK_LINKS.map((link, index) => {
            const active = index === activeIndex
            const centered = index === centeredIndex
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                aria-label={link.label}
                onFocus={() => emblaApi?.scrollTo(index)}
                data-centered={centered || undefined}
                className={`mobile-game-dock__link ${centered ? 'is-centered' : ''} ${active ? 'is-active' : ''}`}
              >
                <span className="mobile-game-dock__icon" aria-hidden="true">{link.icon}</span>
                <span className="mobile-game-dock__label">{link.label}</span>
              </Link>
            )
          })}
        </div>
        <span key={centeredIndex} className="mobile-game-dock__magnet" aria-hidden="true" />
      </div>
      <span className="sr-only">Balayez horizontalement pour parcourir la navigation en boucle.</span>
    </nav>
  )
}
