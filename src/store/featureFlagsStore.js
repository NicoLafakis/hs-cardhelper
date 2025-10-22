/**
 * Feature Flags Store
 * Manages feature flags for toggling plugins and features
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useFeatureFlagsStore = create(
  persist(
    (set, get) => ({
      // Feature flags state
      flags: {},

      /**
       * Set a feature flag
       */
      setFlag: (key, value) => set((state) => ({
        flags: {
          ...state.flags,
          [key]: value
        }
      })),

      /**
       * Set multiple flags at once
       */
      setFlags: (newFlags) => set((state) => ({
        flags: {
          ...state.flags,
          ...newFlags
        }
      })),

      /**
       * Get a feature flag value
       */
      getFlag: (key, defaultValue = false) => {
        const state = get()
        return state.flags[key] !== undefined ? state.flags[key] : defaultValue
      },

      /**
       * Check if a feature is enabled
       */
      isEnabled: (key) => {
        return get().getFlag(key, false) === true
      },

      /**
       * Toggle a feature flag
       */
      toggleFlag: (key) => set((state) => ({
        flags: {
          ...state.flags,
          [key]: !state.flags[key]
        }
      })),

      /**
       * Reset all flags
       */
      resetFlags: () => set({ flags: {} }),

      /**
       * Get all flags
       */
      getAllFlags: () => get().flags
    }),
    {
      name: 'feature-flags-storage',
      version: 1
    }
  )
)

export default useFeatureFlagsStore
