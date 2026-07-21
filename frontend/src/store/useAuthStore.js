import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'
import { getPasswordResetRedirectUrl } from '../lib/nativeApp'

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem('theme', theme)
}

export const useAuthStore = create((set, get) => ({
  session: null,
  profile: null,
  loading: true,
  initialized: false,

  async init() {
    if (get().initialized) return
    set({ initialized: true })

    applyTheme(localStorage.getItem('theme') || 'dark')

    const { data: { session } } = await supabase.auth.getSession()
    set({ session })
    if (session) await get().refreshProfile()
    set({ loading: false })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session })
      if (session) queueMicrotask(() => get().refreshProfile())
      else set({ profile: null })
    })
  },

  async refreshProfile() {
    const session = get().session
    if (!session) return
    const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
    set({ profile: data })
    if (data?.theme) applyTheme(data.theme)
  },

  async signUp({ email, password, username, niveau_id, serie_id, etablissement }) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, niveau_id, serie_id, etablissement } },
    })
    if (error) throw error
  },

  async signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    set({ session: data.session })
    await get().refreshProfile()
  },

  async signOut() {
    await supabase.auth.signOut()
    set({ session: null, profile: null })
  },

  async sendPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getPasswordResetRedirectUrl(),
    })
    if (error) throw error
  },

  async updatePassword(newPassword) {
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw error
  },

  async toggleTheme() {
    const profile = get().profile
    const current = profile?.theme || localStorage.getItem('theme') || 'dark'
    const next = current === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    if (profile) {
      await supabase.from('profiles').update({ theme: next }).eq('id', profile.id)
      set({ profile: { ...profile, theme: next } })
    }
  },

  async updateProfile(patch) {
    const profile = get().profile
    if (!profile) return
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', profile.id).select().single()
    if (error) throw error
    set({ profile: data })
    return data
  },
}))
