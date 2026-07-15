import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export const useAppSettingsStore = create((set, get) => ({
  settings: {},
  loaded: false,

  async load() {
    if (get().loaded) return
    const { data, error } = await supabase.from('app_settings').select('cle, valeur')
    if (error) {
      console.error('Erreur chargement app_settings', error)
      return
    }
    const settings = {}
    for (const row of data ?? []) settings[row.cle] = row.valeur
    set({ settings, loaded: true })
  },
}))

export function getSetting(cle, fallback) {
  const v = useAppSettingsStore.getState().settings[cle]
  return v === undefined ? fallback : v
}
