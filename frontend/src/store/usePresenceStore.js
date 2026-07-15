import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

// Présence temps réel via Supabase Realtime Presence.
// Aucun changement de schéma DB : la présence vit uniquement dans le canal realtime.
// La clé de présence = l'id du profil, donc onlineIds contient des ids de profils.

let channel = null
let currentUserId = null

export const usePresenceStore = create((set, get) => ({
  onlineIds: new Set(),

  isOnline(userId) {
    return userId ? get().onlineIds.has(userId) : false
  },

  join(userId) {
    if (!userId || currentUserId === userId) return
    // Changement d'utilisateur : on nettoie l'ancien canal
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
    currentUserId = userId

    channel = supabase.channel('presence:online', {
      config: { presence: { key: userId } },
    })

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        set({ onlineIds: new Set(Object.keys(state)) })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })
  },

  leave() {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
    currentUserId = null
    set({ onlineIds: new Set() })
  },
}))
