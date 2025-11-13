import React, { useState } from 'react'
import {
  X,
  Palette,
  Type,
  Maximize2,
  Save,
  Download,
  Upload,
  Copy,
  Check,
  Plus,
  Trash2
} from 'lucide-react'
import useBuilderStore from '../../store/builderStore'

// Default design tokens
const DEFAULT_TOKENS = {
  colors: {
    primary: '#ff7a59',
    secondary: '#33475b',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    light: '#f8f9fa',
    dark: '#343a40',
    text: '#33475b',
    background: '#ffffff',
    border: '#cbd6e2'
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px'
  },
  borderRadius: {
    none: '0px',
    sm: '2px',
    base: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
  }
}

// Theme presets
const THEME_PRESETS = {
  default: {
    name: 'Default',
    colors: DEFAULT_TOKENS.colors
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      ...DEFAULT_TOKENS.colors,
      primary: '#6366f1',
      background: '#1f2937',
      text: '#f9fafb',
      border: '#374151'
    }
  },
  minimal: {
    name: 'Minimal',
    colors: {
      ...DEFAULT_TOKENS.colors,
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      text: '#000000',
      border: '#e5e5e5'
    }
  },
  vibrant: {
    name: 'Vibrant',
    colors: {
      primary: '#f43f5e',
      secondary: '#8b5cf6',
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
      info: '#06b6d4',
      light: '#fef3c7',
      dark: '#1e293b',
      text: '#1e293b',
      background: '#ffffff',
      border: '#e2e8f0'
    }
  },
  professional: {
    name: 'Professional',
    colors: {
      primary: '#0f172a',
      secondary: '#475569',
      success: '#059669',
      warning: '#d97706',
      danger: '#dc2626',
      info: '#0284c7',
      light: '#f1f5f9',
      dark: '#1e293b',
      text: '#334155',
      background: '#ffffff',
      border: '#cbd5e1'
    }
  }
}

export default function DesignSystemManager({ isOpen, onClose }) {
  const [tokens, setTokens] = useState(DEFAULT_TOKENS)
  const [activeSection, setActiveSection] = useState('colors')
  const [copied, setCopied] = useState(false)
  const { components, updateComponent } = useBuilderStore()

  const handleColorChange = (key, value) => {
    setTokens(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }))
  }

  const handleTypographyChange = (category, key, value) => {
    setTokens(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [category]: {
          ...prev.typography[category],
          [key]: value
        }
      }
    }))
  }

  const handleApplyTheme = (presetKey) => {
    const preset = THEME_PRESETS[presetKey]
    setTokens(prev => ({
      ...prev,
      colors: preset.colors
    }))
  }

  const handleApplyToComponents = () => {
    if (!confirm('Apply design tokens to all components? This will override existing styles.')) {
      return
    }

    components.forEach(component => {
      const updates = {}

      // Apply color tokens
      if (component.type === 'text') {
        updates.props = {
          ...component.props,
          color: tokens.colors.text,
          fontSize: tokens.typography.fontSize.base
        }
      }

      if (component.type === 'button') {
        updates.props = {
          ...component.props,
          backgroundColor: tokens.colors.primary,
          textColor: tokens.colors.background
        }
      }

      if (Object.keys(updates).length > 0) {
        updateComponent(component.id, updates)
      }
    })

    alert('Design tokens applied to all components!')
  }

  const handleExportCSS = () => {
    const css = generateCSSVariables()
    const blob = new Blob([css], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'design-tokens.css'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyCSS = () => {
    const css = generateCSSVariables()
    navigator.clipboard.writeText(css)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateCSSVariables = () => {
    let css = ':root {\n'

    // Colors
    Object.entries(tokens.colors).forEach(([key, value]) => {
      css += `  --color-${key}: ${value};\n`
    })

    css += '\n'

    // Typography
    css += `  --font-family: ${tokens.typography.fontFamily};\n\n`

    Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
      css += `  --font-size-${key}: ${value};\n`
    })

    css += '\n'

    Object.entries(tokens.typography.fontWeight).forEach(([key, value]) => {
      css += `  --font-weight-${key}: ${value};\n`
    })

    css += '\n'

    Object.entries(tokens.typography.lineHeight).forEach(([key, value]) => {
      css += `  --line-height-${key}: ${value};\n`
    })

    css += '\n'

    // Spacing
    Object.entries(tokens.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`
    })

    css += '\n'

    // Border Radius
    Object.entries(tokens.borderRadius).forEach(([key, value]) => {
      css += `  --radius-${key}: ${value};\n`
    })

    css += '\n'

    // Shadows
    Object.entries(tokens.shadows).forEach(([key, value]) => {
      css += `  --shadow-${key}: ${value};\n`
    })

    css += '}\n'

    return css
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Design System Manager</h2>
            <p className="text-sm text-gray-600">Define and manage design tokens for consistent styling</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCSS}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy CSS'}
            </button>
            <button
              onClick={handleExportCSS}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Design Tokens</h3>
              <div className="space-y-1">
                {[
                  { id: 'colors', label: 'Colors', icon: Palette },
                  { id: 'typography', label: 'Typography', icon: Type },
                  { id: 'spacing', label: 'Spacing', icon: Maximize2 }
                ].map(section => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {section.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Theme Presets</h3>
              <div className="space-y-1">
                {Object.entries(THEME_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => handleApplyTheme(key)}
                    className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Colors Section */}
            {activeSection === 'colors' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Color Tokens</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(tokens.colors).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-16 h-10 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                        />
                      </div>
                      <div
                        className="mt-2 h-8 rounded border border-gray-200"
                        style={{ backgroundColor: value }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Typography Section */}
            {activeSection === 'typography' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Typography Tokens</h3>

                {/* Font Family */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                  <input
                    type="text"
                    value={tokens.typography.fontFamily}
                    onChange={(e) => setTokens(prev => ({
                      ...prev,
                      typography: { ...prev.typography, fontFamily: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>

                {/* Font Sizes */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Font Sizes</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(tokens.typography.fontSize).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 w-16 capitalize">{key}:</label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleTypographyChange('fontSize', key, e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Font Weights */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Font Weights</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(tokens.typography.fontWeight).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <label className="text-sm text-gray-600 w-20 capitalize">{key}:</label>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => handleTypographyChange('fontWeight', key, e.target.value)}
                          className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Spacing Section */}
            {activeSection === 'spacing' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Spacing Tokens</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(tokens.spacing).map(([key, value]) => (
                    <div key={key} className="border border-gray-200 rounded p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key}
                      </label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setTokens(prev => ({
                          ...prev,
                          spacing: { ...prev.spacing, [key]: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className="bg-primary"
                          style={{ width: value, height: '8px' }}
                        ></div>
                        <span className="text-xs text-gray-500">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-600">
            {components.length} components in canvas
          </p>
          <button
            onClick={handleApplyToComponents}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            <Save className="w-4 h-4" />
            Apply to All Components
          </button>
        </div>
      </div>
    </div>
  )
}
