/**
 * Theme Switcher Component
 * Allows users to switch between themes
 */

import { Palette, Check } from 'lucide-react'
import useThemeStore from '../themeStore'
import { getAllThemes } from '../themes'

export function ThemeSwitcher({ compact = false }) {
  const { currentTheme, setTheme, customThemes } = useThemeStore()

  const allThemes = [
    ...getAllThemes(),
    ...Object.values(customThemes)
  ]

  if (compact) {
    return (
      <div className="relative group">
        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Palette size={20} />
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
          <div className="p-2">
            {allThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setTheme(theme.id)}
                className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between transition-colors ${
                  currentTheme === theme.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">{theme.name}</span>
                {currentTheme === theme.id && <Check size={16} />}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-4">
        <Palette size={20} className="text-gray-600" />
        <h3 className="font-semibold text-gray-900">Theme</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {allThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              currentTheme === theme.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-sm">{theme.name}</span>
              {currentTheme === theme.id && (
                <Check size={16} className="text-blue-600" />
              )}
            </div>

            <p className="text-xs text-gray-600 mb-3">{theme.description}</p>

            {/* Color preview */}
            <div className="flex gap-1">
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: theme.colors.primary }}
              />
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: theme.colors.background }}
              />
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: theme.colors.success }}
              />
              <div
                className="w-6 h-6 rounded"
                style={{ backgroundColor: theme.colors.warning }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ThemeSwitcher
