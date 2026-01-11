/**
 * @fileoverview Module exports
 * @module src/plugins/theme-system/index
 * @license MIT
 * @author CardHelper Team
 */

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
  description:
    'Switch between pre-built themes or create your own custom themes',
  author: 'CardHelper Team',
  enabled: true,

  components: {
    ThemeSwitcher,
    ThemeEditor,
  },

  services: {
    theme: {
      // Get current theme
      getCurrentTheme: () => {
        return useThemeStore.getState().getThemeObject()
      },

      // Set theme
      setTheme: themeId => {
        return useThemeStore.getState().setTheme(themeId)
      },

      // Get all available themes
      getAllThemes: () => {
        const { customThemes } = useThemeStore.getState()
        return [...getAllThemes(), ...Object.values(customThemes)]
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
      importTheme: file => {
        return useThemeStore.getState().importTheme(file)
      },
    },
  },

  config: {
    defaultTheme: 'light',
    enableCustomThemes: true,
    enableThemeImportExport: true,
  },

  hooks: {
    'app:mounted': async function () {
      const currentTheme = useThemeStore.getState().currentTheme
      useThemeStore.getState().applyTheme(currentTheme)
    },
  },

  initialize: async function (context) {
    // Apply saved theme on init
    const currentTheme = useThemeStore.getState().currentTheme
    useThemeStore.getState().applyTheme(currentTheme)

    // Set feature flag
    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.theme-system', true)
    }

    return true
  },

  destroy: async function () {
    // Reset to default theme
    useThemeStore.getState().resetTheme()

    return true
  },
})

export default themeSystemPlugin
