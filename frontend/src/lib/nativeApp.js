import { Capacitor, SystemBars, SystemBarsStyle } from '@capacitor/core'
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics'
import { SplashScreen } from '@capacitor/splash-screen'
import { supabase } from './supabaseClient'

export const isNativeApp = Capacitor.isNativePlatform()

export function isAndroidHomePreview() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('android-preview') === '1'
}

export function isAndroidHomeExperience() {
  return isNativeApp || isAndroidHomePreview()
}

export function isAndroidDuelPreview() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).has('android-duel-preview')
}

export function isAndroidDuelExperience() {
  return isNativeApp || isAndroidDuelPreview()
}

export function isAndroidBadgePreview() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('android-badge-preview') === '1'
}

export function isAndroidBadgeExperience() {
  return isNativeApp || isAndroidBadgePreview()
}

const DEFAULT_NATIVE_AUTH_REDIRECT = 'excellencelycee://reset-password'

export function getPasswordResetRedirectUrl() {
  if (isNativeApp) {
    return import.meta.env.VITE_NATIVE_AUTH_REDIRECT_URL || DEFAULT_NATIVE_AUTH_REDIRECT
  }

  return `${window.location.origin}/reset-password`
}

export async function configureNativeChrome() {
  if (!isNativeApp) return

  document.documentElement.classList.add('is-native-app')
  document.documentElement.dataset.nativePlatform = Capacitor.getPlatform()

  await Promise.allSettled([
    SystemBars.show(),
    SystemBars.setStyle({ style: SystemBarsStyle.Light }),
    SplashScreen.hide(),
  ])
}

export async function playNativeHaptic(type = 'click') {
  if (!isNativeApp) return

  try {
    if (type === 'success' || type === 'levelUp') {
      await Haptics.notification({ type: NotificationType.Success })
      return
    }
    if (type === 'error') {
      await Haptics.notification({ type: NotificationType.Error })
      return
    }
    await Haptics.impact({ style: ImpactStyle.Light })
  } catch {
    // Certains appareils désactivent les vibrations : le clic doit rester fonctionnel.
  }
}

function pathFromNativeUrl(parsedUrl) {
  if (parsedUrl.protocol === 'excellencelycee:') {
    const hostPath = parsedUrl.hostname ? `/${parsedUrl.hostname}` : ''
    return `${hostPath}${parsedUrl.pathname}` || '/dashboard'
  }

  return parsedUrl.pathname || '/dashboard'
}

export async function consumeNativeAuthUrl(url) {
  if (!url) return null

  let parsedUrl
  try {
    parsedUrl = new URL(url)
  } catch {
    return null
  }

  const hashParams = new URLSearchParams(parsedUrl.hash.replace(/^#/, ''))
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')
  const authCode = parsedUrl.searchParams.get('code')

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (error) throw error
  } else if (authCode) {
    const { error } = await supabase.auth.exchangeCodeForSession(authCode)
    if (error) throw error
  }

  return pathFromNativeUrl(parsedUrl)
}
