/**
 * Theme Switcher
 * Quick access theme selector for the toolbar
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore, THEME_TEMPLATES } from '../../core/ThemeEngine'
import { ThemeEditor } from './ThemeEditor'
import { ThemePresets } from './ThemePresets'
import './ThemeSwitcher.css'

export function ThemeSwitcher() {
  const { currentTheme, setTheme, customThemes } = useThemeStore()
  const [isOpen, setIsOpen] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [showLibrary, setShowLibrary] = useState(false)

  const builtInThemes = Object.values(THEME_TEMPLATES)

  const handleThemeSelect = (theme) => {
    setTheme(theme)
    setIsOpen(false)
  }

  const handleOpenEditor = () => {
    setShowLibrary(false)
    setShowEditor(true)
  }

  const handleCloseEditor = () => {
    setShowEditor(false)
    setShowLibrary(true)
  }

  const handleSaveTheme = () => {
    setShowEditor(false)
  }

  return (
    <>
      {/* Theme Switcher Button */}
      <div className="theme-switcher-container">
        <button
          className="theme-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Switch themes"
        >
          <span className="theme-icon">🎨</span>
          <span className="theme-name">{currentTheme.name}</span>
          <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="theme-dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Quick Select */}
              <div className="dropdown-section">
                <div className="section-label">Built-in Themes</div>
                {builtInThemes.map(theme => (
                  <button
                    key={theme.name}
                    className={`dropdown-item ${currentTheme.name === theme.name ? 'active' : ''}`}
                    onClick={() => handleThemeSelect(theme)}
                  >
                    <div className="item-colors">
                      {Object.values(theme.colors).slice(0, 3).map((color, idx) => (
                        <div
                          key={idx}
                          className="item-color"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="item-label">{theme.name}</span>
                    {currentTheme.name === theme.name && <span className="check-mark">✓</span>}
                  </button>
                ))}
              </div>

              {/* Custom Themes */}
              {customThemes.length > 0 && (
                <div className="dropdown-section">
                  <div className="section-label">Custom Themes</div>
                  {customThemes.map(theme => (
                    <button
                      key={theme.name}
                      className={`dropdown-item ${currentTheme.name === theme.name ? 'active' : ''}`}
                      onClick={() => handleThemeSelect(theme)}
                    >
                      <div className="item-colors">
                        {Object.values(theme.colors).slice(0, 3).map((color, idx) => (
                          <div
                            key={idx}
                            className="item-color"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span className="item-label">{theme.name}</span>
                      {currentTheme.name === theme.name && <span className="check-mark">✓</span>}
                    </button>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="dropdown-divider" />
              <div className="dropdown-actions">
                <button
                  className="action-link"
                  onClick={() => {
                    setIsOpen(false)
                    setShowLibrary(true)
                  }}
                >
                  📚 View Library
                </button>
                <button
                  className="action-link primary"
                  onClick={() => {
                    setIsOpen(false)
                    handleOpenEditor()
                  }}
                >
                  + Create Theme
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theme Editor Modal */}
      <AnimatePresence>
        {showEditor && (
          <ThemeEditor
            onClose={handleCloseEditor}
            onSave={handleSaveTheme}
          />
        )}
      </AnimatePresence>

      {/* Theme Library Modal */}
      <AnimatePresence>
        {showLibrary && (
          <motion.div
            className="library-overlay"
            onClick={() => setShowLibrary(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="library-modal"
              onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                className="library-close"
                onClick={() => setShowLibrary(false)}
              >
                ✕
              </button>
              <ThemePresets
                onThemeSelect={handleThemeSelect}
                onOpenEditor={handleOpenEditor}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ThemeSwitcher
