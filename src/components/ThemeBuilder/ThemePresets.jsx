/**
 * Theme Presets Component
 * Pre-built theme templates and custom theme management
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore, THEME_TEMPLATES } from '../../core/ThemeEngine'
import './ThemePresets.css'

export function ThemePresets({ onThemeSelect, onOpenEditor }) {
  const { currentTheme, customThemes, setTheme } = useThemeStore()
  const [hoveredTheme, setHoveredTheme] = useState(null)

  const allThemes = [
    ...Object.values(THEME_TEMPLATES),
    ...customThemes
  ]

  const handleThemeClick = (theme) => {
    setTheme(theme)
    onThemeSelect?.(theme)
  }

  return (
    <div className="theme-presets-container">
      <div className="presets-header">
        <h2>Theme Library</h2>
        <button className="create-theme-btn" onClick={onOpenEditor}>
          + Create Custom
        </button>
      </div>

      <div className="presets-grid">
        <AnimatePresence>
          {allThemes.map((theme, idx) => (
            <motion.div
              key={theme.name}
              className={`preset-card ${currentTheme.name === theme.name ? 'active' : ''}`}
              onClick={() => handleThemeClick(theme)}
              onMouseEnter={() => setHoveredTheme(theme.name)}
              onMouseLeave={() => setHoveredTheme(null)}
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {/* Color Palette Preview */}
              <div className="preset-colors">
                {Object.entries(theme.colors)
                  .slice(0, 6)
                  .map(([key, color]) => (
                    <div
                      key={key}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      title={key}
                    />
                  ))}
              </div>

              {/* Theme Info */}
              <div className="preset-info">
                <h3>{theme.name}</h3>
                <p>{theme.description}</p>
              </div>

              {/* Actions */}
              <AnimatePresence>
                {hoveredTheme === theme.name && (
                  <motion.div
                    className="preset-actions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      className="action-btn edit-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        setTheme(theme)
                        onOpenEditor?.()
                      }}
                    >
                      Edit
                    </button>
                    {theme.custom && (
                      <button className="action-btn delete-btn">Delete</button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Badge */}
              {currentTheme.name === theme.name && (
                <motion.div
                  className="active-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  ✓ Active
                </motion.div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ThemePresets
