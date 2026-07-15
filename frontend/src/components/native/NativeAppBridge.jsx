import { useEffect, useRef, useState } from 'react'
import { App as CapacitorApp } from '@capacitor/app'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import {
  configureNativeChrome,
  consumeNativeAuthUrl,
  isNativeApp,
} from '../../lib/nativeApp'
import { useAuthStore } from '../../store/useAuthStore'
import { usePresenceStore } from '../../store/usePresenceStore'

const APP_ROOT_ROUTES = new Set(['/', '/dashboard'])

function isEditingText() {
  const activeElement = document.activeElement
  return activeElement instanceof HTMLInputElement
    || activeElement instanceof HTMLTextAreaElement
    || activeElement instanceof HTMLSelectElement
    || activeElement?.isContentEditable
}

export default function NativeAppBridge() {
  const navigate = useNavigate()
  const location = useLocation()
  const pathnameRef = useRef(location.pathname)
  const [online, setOnline] = useState(() => navigator.onLine)

  useEffect(() => {
    pathnameRef.current = location.pathname
  }, [location.pathname])

  useEffect(() => {
    const handleOnline = () => setOnline(true)
    const handleOffline = () => setOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!isNativeApp) return undefined

    let disposed = false
    const handles = []
    const register = async (eventName, handler) => {
      const handle = await CapacitorApp.addListener(eventName, handler)
      if (disposed) await handle.remove()
      else handles.push(handle)
    }

    const openNativeUrl = async ({ url } = {}) => {
      try {
        const path = await consumeNativeAuthUrl(url)
        if (!disposed && path) navigate(path, { replace: true })
      } catch (error) {
        console.error('Impossible de terminer le lien de connexion mobile', error)
      }
    }

    void configureNativeChrome()
    void CapacitorApp.getLaunchUrl().then((launchUrl) => openNativeUrl(launchUrl))
    void register('appUrlOpen', openNativeUrl)
    void register('appStateChange', ({ isActive }) => {
      const presence = usePresenceStore.getState()
      const userId = useAuthStore.getState().session?.user?.id

      if (isActive) {
        supabase.auth.startAutoRefresh()
        if (userId) presence.join(userId)
      } else {
        supabase.auth.stopAutoRefresh()
        presence.leave()
      }

      window.dispatchEvent(new CustomEvent('excellence:app-state', { detail: { isActive } }))
    })
    void register('backButton', ({ canGoBack }) => {
      if (isEditingText()) {
        document.activeElement?.blur()
        return
      }

      const pathname = pathnameRef.current
      if (APP_ROOT_ROUTES.has(pathname)) {
        void CapacitorApp.minimizeApp()
      } else if (canGoBack) {
        navigate(-1)
      } else {
        navigate('/dashboard', { replace: true })
      }
    })

    return () => {
      disposed = true
      handles.forEach((handle) => { void handle.remove() })
      document.documentElement.classList.remove('is-native-app')
      delete document.documentElement.dataset.nativePlatform
    }
  }, [navigate])

  if (online) return null

  return (
    <div className="native-offline-banner" role="status" aria-live="polite">
      <span aria-hidden="true">◌</span>
      Connexion perdue — les contenus et les duels seront disponibles au retour du réseau.
    </div>
  )
}
