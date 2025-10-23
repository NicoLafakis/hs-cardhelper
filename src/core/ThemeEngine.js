/**
 * Professional Theme Engine
 * Complete theme system with pre-built templates, color generation, and customization
 */

import { create } from 'zustand'

// Pre-built theme templates
export const THEME_TEMPLATES = {
  minimal: {
    name: 'Minimal',
    description: 'Clean and simple design',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#3b82f6',
      background: '#ffffff',
      surface: '#f9fafb',
      border: '#e5e7eb',
      text: '#111827',
      textLight: '#6b7280',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    typography: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      headingSize: { h1: '32px', h2: '28px', h3: '24px', h4: '20px' },
      bodySize: '16px',
      smallSize: '14px',
      headingWeight: '600',
      bodyWeight: '400',
      lineHeight: '1.5'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px'
    },
    border: {
      radius: '4px',
      width: '1px'
    },
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
    }
  },
  bold: {
    name: 'Bold',
    description: 'High contrast and vibrant',
    colors: {
      primary: '#1f2937',
      secondary: '#4f46e5',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f0f9ff',
      border: '#0369a1',
      text: '#0f172a',
      textLight: '#475569',
      success: '#059669',
      warning: '#d97706',
      error: '#dc2626'
    },
    typography: {
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      headingSize: { h1: '40px', h2: '32px', h3: '28px', h4: '24px' },
      bodySize: '17px',
      smallSize: '14px',
      headingWeight: '700',
      bodyWeight: '500',
      lineHeight: '1.6'
    },
    spacing: {
      xs: '6px',
      sm: '12px',
      md: '20px',
      lg: '32px',
      xl: '48px',
      xxl: '64px'
    },
    border: {
      radius: '8px',
      width: '2px'
    },
    shadow: {
      sm: '0 2px 4px rgba(0, 0, 0, 0.1)',
      md: '0 6px 12px rgba(0, 0, 0, 0.15)',
      lg: '0 14px 28px rgba(0, 0, 0, 0.2)',
      xl: '0 24px 48px rgba(0, 0, 0, 0.25)'
    }
  },
  elegant: {
    name: 'Elegant',
    description: 'Sophisticated and refined',
    colors: {
      primary: '#78350f',
      secondary: '#92400e',
      accent: '#d97706',
      background: '#fef3c7',
      surface: '#fef9e7',
      border: '#f3b81f',
      text: '#451a03',
      textLight: '#78350f',
      success: '#7c2d12',
      warning: '#b45309',
      error: '#92400e'
    },
    typography: {
      fontFamily: "'Georgia', 'Garamond', serif",
      headingSize: { h1: '48px', h2: '40px', h3: '32px', h4: '28px' },
      bodySize: '18px',
      smallSize: '16px',
      headingWeight: '600',
      bodyWeight: '400',
      lineHeight: '1.8'
    },
    spacing: {
      xs: '8px',
      sm: '16px',
      md: '24px',
      lg: '40px',
      xl: '56px',
      xxl: '80px'
    },
    border: {
      radius: '12px',
      width: '1px'
    },
    shadow: {
      sm: '0 3px 8px rgba(120, 53, 15, 0.1)',
      md: '0 8px 16px rgba(120, 53, 15, 0.12)',
      lg: '0 16px 32px rgba(120, 53, 15, 0.15)',
      xl: '0 24px 48px rgba(120, 53, 15, 0.2)'
    }
  },
  dark: {
    name: 'Dark Mode',
    description: 'Dark background with light text',
    colors: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
      accent: '#60a5fa',
      background: '#111827',
      surface: '#1f2937',
      border: '#374151',
      text: '#f3f4f6',
      textLight: '#d1d5db',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171'
    },
    typography: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      headingSize: { h1: '36px', h2: '32px', h3: '28px', h4: '24px' },
      bodySize: '16px',
      smallSize: '14px',
      headingWeight: '600',
      bodyWeight: '400',
      lineHeight: '1.6'
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px'
    },
    border: {
      radius: '6px',
      width: '1px'
    },
    shadow: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.3)',
      md: '0 4px 8px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 20px rgba(0, 0, 0, 0.5)',
      xl: '0 20px 40px rgba(0, 0, 0, 0.6)'
    }
  }
}

/**
 * Color Palette Generator
 */
export class ColorPaletteGenerator {
  static generateComplementary(baseColor) {
    const hsl = this.hexToHSL(baseColor)
    hsl.h = (hsl.h + 180) % 360
    return this.hslToHex(hsl)
  }

  static generateAnalogous(baseColor) {
    const hsl = this.hexToHSL(baseColor)
    return [
      baseColor,
      this.hslToHex({ ...hsl, h: (hsl.h + 30) % 360 }),
      this.hslToHex({ ...hsl, h: (hsl.h - 30 + 360) % 360 })
    ]
  }

  static generateTriadic(baseColor) {
    const hsl = this.hexToHSL(baseColor)
    return [
      baseColor,
      this.hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
      this.hslToHex({ ...hsl, h: (hsl.h + 240) % 360 })
    ]
  }

  static generateMonochromatic(baseColor) {
    const hsl = this.hexToHSL(baseColor)
    return [
      this.hslToHex({ ...hsl, l: 90 }),
      this.hslToHex({ ...hsl, l: 70 }),
      this.hslToHex({ ...hsl, l: 50 }),
      this.hslToHex({ ...hsl, l: 30 }),
      this.hslToHex({ ...hsl, l: 10 })
    ]
  }

  static hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255
    let g = parseInt(hex.slice(3, 5), 16) / 255
    let b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  static hslToHex({ h, s, l }) {
    s /= 100
    l /= 100

    const k = n => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

    return "#" + [f(0), f(8), f(4)].map(x => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }).join('')
  }
}

/**
 * Theme Store (Zustand)
 */
export const useThemeStore = create((set) => ({
  currentTheme: THEME_TEMPLATES.minimal,
  customThemes: [],
  isDarkMode: false,

  setTheme: (theme) => set({ currentTheme: theme }),

  setDarkMode: (isDark) => set({ isDarkMode: isDark }),

  saveCustomTheme: (name, theme) => set((state) => ({
    customThemes: [...state.customThemes, { name, ...theme, custom: true }]
  })),

  deleteCustomTheme: (name) => set((state) => ({
    customThemes: state.customThemes.filter(t => t.name !== name)
  })),

  updateThemeColor: (colorKey, value) => set((state) => ({
    currentTheme: {
      ...state.currentTheme,
      colors: { ...state.currentTheme.colors, [colorKey]: value }
    }
  })),

  updateThemeTypography: (typogKey, value) => set((state) => ({
    currentTheme: {
      ...state.currentTheme,
      typography: { ...state.currentTheme.typography, [typogKey]: value }
    }
  })),

  applyTheme: (theme) => {
    const root = document.documentElement
    const colors = theme.colors || {}
    const typography = theme.typography || {}
    const spacing = theme.spacing || {}
    const shadow = theme.shadow || {}

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    Object.entries(typography).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => {
          root.style.setProperty(`--typo-${key}-${k}`, v)
        })
      } else {
        root.style.setProperty(`--typo-${key}`, value)
      }
    })

    Object.entries(spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    Object.entries(shadow).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value)
    })

    set({ currentTheme: theme })
  }
}))

/**
 * Theme CSS Generator
 */
export function generateThemeCSS(theme) {
  const colors = theme.colors || {}
  const typography = theme.typography || {}
  const spacing = theme.spacing || {}
  const shadow = theme.shadow || {}

  let css = ':root {\n'

  Object.entries(colors).forEach(([key, value]) => {
    css += `  --color-${key}: ${value};\n`
  })

  Object.entries(typography).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([k, v]) => {
        css += `  --typo-${key}-${k}: ${v};\n`
      })
    } else {
      css += `  --typo-${key}: ${value};\n`
    }
  })

  Object.entries(spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`
  })

  Object.entries(shadow).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`
  })

  css += '}\n\n'

  css += `body {
  font-family: var(--typo-fontFamily);
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: var(--typo-lineHeight);
}\n\n`

  css += `h1 { font-size: var(--typo-headingSize-h1); font-weight: var(--typo-headingWeight); }\n`
  css += `h2 { font-size: var(--typo-headingSize-h2); font-weight: var(--typo-headingWeight); }\n`
  css += `h3 { font-size: var(--typo-headingSize-h3); font-weight: var(--typo-headingWeight); }\n`
  css += `h4 { font-size: var(--typo-headingSize-h4); font-weight: var(--typo-headingWeight); }\n`

  return css
}

export default useThemeStore
