/**
 * Theme Definitions
 * Pre-built themes for the application
 */

export const themes = {
  light: {
    id: 'light',
    name: 'Light',
    description: 'Clean and bright theme',
    colors: {
      // Primary colors
      primary: '#3B82F6',
      primaryHover: '#2563EB',
      primaryLight: '#DBEAFE',

      // Background colors
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      backgroundTertiary: '#F3F4F6',

      // Text colors
      textPrimary: '#111827',
      textSecondary: '#6B7280',
      textTertiary: '#9CA3AF',

      // Border colors
      border: '#E5E7EB',
      borderHover: '#D1D5DB',

      // Status colors
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',

      // Component specific
      cardBackground: '#FFFFFF',
      cardBorder: '#E5E7EB',
      inputBackground: '#FFFFFF',
      inputBorder: '#D1D5DB',
      modalOverlay: 'rgba(0, 0, 0, 0.5)'
    }
  },

  dark: {
    id: 'dark',
    name: 'Dark',
    description: 'Easy on the eyes',
    colors: {
      // Primary colors
      primary: '#60A5FA',
      primaryHover: '#3B82F6',
      primaryLight: '#1E3A8A',

      // Background colors
      background: '#111827',
      backgroundSecondary: '#1F2937',
      backgroundTertiary: '#374151',

      // Text colors
      textPrimary: '#F9FAFB',
      textSecondary: '#D1D5DB',
      textTertiary: '#9CA3AF',

      // Border colors
      border: '#374151',
      borderHover: '#4B5563',

      // Status colors
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',

      // Component specific
      cardBackground: '#1F2937',
      cardBorder: '#374151',
      inputBackground: '#374151',
      inputBorder: '#4B5563',
      modalOverlay: 'rgba(0, 0, 0, 0.75)'
    }
  },

  highContrast: {
    id: 'highContrast',
    name: 'High Contrast',
    description: 'Maximum readability',
    colors: {
      // Primary colors
      primary: '#0000FF',
      primaryHover: '#0000CC',
      primaryLight: '#E0E0FF',

      // Background colors
      background: '#FFFFFF',
      backgroundSecondary: '#F0F0F0',
      backgroundTertiary: '#E0E0E0',

      // Text colors
      textPrimary: '#000000',
      textSecondary: '#333333',
      textTertiary: '#666666',

      // Border colors
      border: '#000000',
      borderHover: '#333333',

      // Status colors
      success: '#008000',
      warning: '#FF8C00',
      error: '#FF0000',
      info: '#0000FF',

      // Component specific
      cardBackground: '#FFFFFF',
      cardBorder: '#000000',
      inputBackground: '#FFFFFF',
      inputBorder: '#000000',
      modalOverlay: 'rgba(0, 0, 0, 0.8)'
    }
  },

  ocean: {
    id: 'ocean',
    name: 'Ocean',
    description: 'Cool blue tones',
    colors: {
      // Primary colors
      primary: '#0EA5E9',
      primaryHover: '#0284C7',
      primaryLight: '#E0F2FE',

      // Background colors
      background: '#F0F9FF',
      backgroundSecondary: '#E0F2FE',
      backgroundTertiary: '#BAE6FD',

      // Text colors
      textPrimary: '#0C4A6E',
      textSecondary: '#075985',
      textTertiary: '#0369A1',

      // Border colors
      border: '#7DD3FC',
      borderHover: '#38BDF8',

      // Status colors
      success: '#14B8A6',
      warning: '#F97316',
      error: '#F43F5E',
      info: '#0EA5E9',

      // Component specific
      cardBackground: '#FFFFFF',
      cardBorder: '#7DD3FC',
      inputBackground: '#FFFFFF',
      inputBorder: '#38BDF8',
      modalOverlay: 'rgba(12, 74, 110, 0.5)'
    }
  },

  sunset: {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm orange and purple tones',
    colors: {
      // Primary colors
      primary: '#F97316',
      primaryHover: '#EA580C',
      primaryLight: '#FED7AA',

      // Background colors
      background: '#FFF7ED',
      backgroundSecondary: '#FFEDD5',
      backgroundTertiary: '#FED7AA',

      // Text colors
      textPrimary: '#7C2D12',
      textSecondary: '#9A3412',
      textTertiary: '#C2410C',

      // Border colors
      border: '#FDBA74',
      borderHover: '#FB923C',

      // Status colors
      success: '#84CC16',
      warning: '#EAB308',
      error: '#DC2626',
      info: '#8B5CF6',

      // Component specific
      cardBackground: '#FFFFFF',
      cardBorder: '#FDBA74',
      inputBackground: '#FFFFFF',
      inputBorder: '#FB923C',
      modalOverlay: 'rgba(124, 45, 18, 0.5)'
    }
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    description: 'Natural green tones',
    colors: {
      // Primary colors
      primary: '#22C55E',
      primaryHover: '#16A34A',
      primaryLight: '#DCFCE7',

      // Background colors
      background: '#F0FDF4',
      backgroundSecondary: '#DCFCE7',
      backgroundTertiary: '#BBF7D0',

      // Text colors
      textPrimary: '#14532D',
      textSecondary: '#166534',
      textTertiary: '#15803D',

      // Border colors
      border: '#86EFAC',
      borderHover: '#4ADE80',

      // Status colors
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      info: '#3B82F6',

      // Component specific
      cardBackground: '#FFFFFF',
      cardBorder: '#86EFAC',
      inputBackground: '#FFFFFF',
      inputBorder: '#4ADE80',
      modalOverlay: 'rgba(20, 83, 45, 0.5)'
    }
  }
}

export function getTheme(themeId) {
  return themes[themeId] || themes.light
}

export function getAllThemes() {
  return Object.values(themes)
}

export default themes
