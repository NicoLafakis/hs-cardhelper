/**
 * Theme Store
 * Manages the current theme and applies CSS variables
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getTheme } from './themes'

const useThemeStore = create(
  persist(
    (set, get) => ({
      // Current theme ID
      currentTheme: 'light',

      // Custom themes created by user
      customThemes: {},

      /**
       * Set the current theme
       */
      setTheme: (themeId) => {
        set({ currentTheme: themeId })
        get().applyTheme(themeId)
      },

      /**
       * Get current theme object
       */
      getThemeObject: () => {
        const { currentTheme, customThemes } = get()

        // Check if it's a custom theme
        if (customThemes[currentTheme]) {
          return customThemes[currentTheme]
        }

        // Otherwise get from built-in themes
        return getTheme(currentTheme)
      },

      /**
       * Apply theme to DOM
       */
      applyTheme: (themeId) => {
        const { customThemes } = get()

        // Get theme object
        const theme = customThemes[themeId] || getTheme(themeId)

        if (!theme) {
          console.error('Theme not found:', themeId)
          return
        }

        // Apply CSS variables to root
        const root = document.documentElement

        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value)
        })

        // Set data-theme attribute for CSS targeting
        root.setAttribute('data-theme', themeId)

        console.log(`✓ Applied theme: ${theme.name}`)
      },

      /**
       * Create a custom theme
       */
      createCustomTheme: (themeId, themeData) => {
        set((state) => ({
          customThemes: {
            ...state.customThemes,
            [themeId]: themeData
          }
        }))
      },

      /**
       * Delete a custom theme
       */
      deleteCustomTheme: (themeId) => {
        set((state) => {
          const { [themeId]: removed, ...remaining } = state.customThemes
          return { customThemes: remaining }
        })
      },

      /**
       * Update a custom theme
       */
      updateCustomTheme: (themeId, updates) => {
        set((state) => ({
          customThemes: {
            ...state.customThemes,
            [themeId]: {
              ...state.customThemes[themeId],
              ...updates
            }
          }
        }))
      },

      /**
       * Export current theme
       */
      exportTheme: () => {
        const theme = get().getThemeObject()
        const json = JSON.stringify(theme, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${theme.id}-theme.json`
        link.click()

        URL.revokeObjectURL(url)
      },

      /**
       * Import theme from JSON
       */
      importTheme: async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = (e) => {
            try {
              const theme = JSON.parse(e.target.result)

              // Validate theme structure
              if (!theme.id || !theme.name || !theme.colors) {
                reject(new Error('Invalid theme file'))
                return
              }

              get().createCustomTheme(theme.id, theme)
              resolve(theme)
            } catch (error) {
              reject(new Error('Failed to parse theme file'))
            }
          }

          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsText(file)
        })
      },

      /**
       * Reset to default theme
       */
      resetTheme: () => {
        set({ currentTheme: 'light' })
        get().applyTheme('light')
      }
    }),
    {
      name: 'theme-storage',
      version: 1
    }
  )
)

export default useThemeStore
