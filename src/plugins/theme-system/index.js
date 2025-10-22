/**
 * Theme System Plugin
 * Provides comprehensive theming capabilities
 */

import { createPlugin } from '../../core/Plugin'
import ThemeSwitcher from './components/ThemeSwitcher'
import ThemeEditor from './components/ThemeEditor'
import useThemeStore from './themeStore'
import { getAllThemes } from './themes'

const themeSystemPlugin = createPlugin({
  id: 'theme-system',
  name: 'Theme System',
  version: '1.0.0',
  description: 'Switch between pre-built themes or create your own custom themes',
  author: 'CardHelper Team',
  enabled: true,

  components: {
    ThemeSwitcher,
    ThemeEditor
  },

  services: {
    theme: {
      // Get current theme
      getCurrentTheme: () => {
        return useThemeStore.getState().getThemeObject()
      },

      // Set theme
      setTheme: (themeId) => {
        return useThemeStore.getState().setTheme(themeId)
      },

      // Get all available themes
      getAllThemes: () => {
        const { customThemes } = useThemeStore.getState()
        return [
          ...getAllThemes(),
          ...Object.values(customThemes)
        ]
      },

      // Create custom theme
      createTheme: (themeId, themeData) => {
        return useThemeStore.getState().createCustomTheme(themeId, themeData)
      },

      // Export theme
      exportTheme: () => {
        return useThemeStore.getState().exportTheme()
      },

      // Import theme
      importTheme: (file) => {
        return useThemeStore.getState().importTheme(file)
      }
    }
  },

  config: {
    defaultTheme: 'light',
    enableCustomThemes: true,
    enableThemeImportExport: true
  },

  hooks: {
    'app:mounted': async function() {
      console.log('Theme System: App mounted, applying saved theme')
      const currentTheme = useThemeStore.getState().currentTheme
      useThemeStore.getState().applyTheme(currentTheme)
    }
  },

  initialize: async function(context) {
    console.log('Theme System plugin initialized!')

    // Apply saved theme on init
    const currentTheme = useThemeStore.getState().currentTheme
    useThemeStore.getState().applyTheme(currentTheme)

    // Set feature flag
    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.theme-system', true)
    }

    // Log available themes
    console.log('Available themes:', getAllThemes().map(t => t.name).join(', '))

    return true
  },

  destroy: async function() {
    console.log('Theme System plugin destroyed!')

    // Reset to default theme
    useThemeStore.getState().resetTheme()

    return true
  }
})

export default themeSystemPlugin
