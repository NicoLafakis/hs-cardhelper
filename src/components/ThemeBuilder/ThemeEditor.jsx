/**
 * Professional Theme Editor
 * Real-time theme customization with live preview
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore, ColorPaletteGenerator, THEME_TEMPLATES } from '../../core/ThemeEngine'
import './ThemeEditor.css'

export function ThemeEditor({ onClose, onSave }) {
  const {
    currentTheme,
    updateThemeColor,
    updateThemeTypography,
    applyTheme,
    saveCustomTheme
  } = useThemeStore()

  const [activeTab, setActiveTab] = useState('colors')
  const [themeName, setThemeName] = useState(currentTheme.name)
  const [isSaving, setIsSaving] = useState(false)
  const [colorMode, setColorMode] = useState('manual')
  const [baseColor, setBaseColor] = useState(currentTheme.colors.primary)

  // Apply theme changes in real-time
  useEffect(() => {
    applyTheme(currentTheme)
  }, [currentTheme, applyTheme])

  const handleColorChange = (colorKey, value) => {
    updateThemeColor(colorKey, value)
  }

  const handleTypographyChange = (typogKey, value) => {
    updateThemeTypography(typogKey, value)
  }

  const handleGenerateComplementary = () => {
    const complement = ColorPaletteGenerator.generateComplementary(baseColor)
    handleColorChange('secondary', complement)
  }

  const handleGenerateAnalogous = () => {
    const colors = ColorPaletteGenerator.generateAnalogous(baseColor)
    handleColorChange('secondary', colors[1])
    handleColorChange('accent', colors[2])
  }

  const handleGenerateTriadic = () => {
    const colors = ColorPaletteGenerator.generateTriadic(baseColor)
    handleColorChange('secondary', colors[1])
    handleColorChange('accent', colors[2])
  }

  const handleSaveTheme = async () => {
    setIsSaving(true)
    try {
      saveCustomTheme(themeName, currentTheme)
      onSave?.(themeName, currentTheme)
    } catch (error) {
      console.error('Failed to save theme:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <motion.div
      className="theme-editor-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="theme-editor-modal"
        onClick={e => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        {/* Header */}
        <div className="editor-header">
          <div className="editor-title">
            <h2>Theme Designer</h2>
            <input
              type="text"
              className="theme-name-input"
              value={themeName}
              onChange={e => setThemeName(e.target.value)}
              placeholder="Enter theme name"
            />
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="editor-tabs">
          {['colors', 'typography', 'spacing', 'effects'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="editor-content">
          <AnimatePresence mode="wait">
            {activeTab === 'colors' && (
              <motion.div
                key="colors"
                className="editor-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Color Generator */}
                <div className="color-generator-section">
                  <h3>Color Palette Generator</h3>
                  <div className="generator-controls">
                    <div className="control-group">
                      <label>Base Color:</label>
                      <div className="color-input-group">
                        <input
                          type="color"
                          value={baseColor}
                          onChange={e => setBaseColor(e.target.value)}
                          className="color-picker"
                        />
                        <span className="color-value">{baseColor}</span>
                      </div>
                    </div>
                    <div className="generator-buttons">
                      <button
                        className="gen-btn"
                        onClick={handleGenerateComplementary}
                        title="Generate opposite color on color wheel"
                      >
                        Complementary
                      </button>
                      <button
                        className="gen-btn"
                        onClick={handleGenerateAnalogous}
                        title="Generate nearby colors"
                      >
                        Analogous
                      </button>
                      <button
                        className="gen-btn"
                        onClick={handleGenerateTriadic}
                        title="Generate 3 evenly spaced colors"
                      >
                        Triadic
                      </button>
                    </div>
                  </div>
                </div>

                {/* Color Grid */}
                <div className="color-grid-section">
                  <h3>Colors</h3>
                  <div className="color-grid">
                    {Object.entries(currentTheme.colors).map(([key, value]) => (
                      <motion.div
                        key={key}
                        className="color-item"
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="color-preview-wrapper">
                          <div
                            className="color-preview"
                            style={{ backgroundColor: value }}
                          />
                          <input
                            type="color"
                            value={value}
                            onChange={e => handleColorChange(key, e.target.value)}
                            className="color-picker-hidden"
                          />
                        </div>
                        <div className="color-info">
                          <p className="color-label">{key}</p>
                          <p className="color-hex">{value}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'typography' && (
              <motion.div
                key="typography"
                className="editor-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="typography-grid">
                  {/* Font Family */}
                  <div className="control-group full-width">
                    <label>Font Family</label>
                    <input
                      type="text"
                      value={currentTheme.typography.fontFamily}
                      onChange={e => handleTypographyChange('fontFamily', e.target.value)}
                      className="text-input"
                      placeholder="e.g., 'Segoe UI', sans-serif"
                    />
                  </div>

                  {/* Heading Sizes */}
                  <div className="section-group">
                    <h4>Heading Sizes</h4>
                    {['h1', 'h2', 'h3', 'h4'].map(heading => (
                      <div key={heading} className="control-group">
                        <label>{heading.toUpperCase()}</label>
                        <input
                          type="text"
                          value={currentTheme.typography.headingSize[heading]}
                          onChange={e => handleTypographyChange('headingSize', {
                            ...currentTheme.typography.headingSize,
                            [heading]: e.target.value
                          })}
                          className="text-input"
                          placeholder="e.g., 32px"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Body Sizes */}
                  <div className="section-group">
                    <h4>Text Sizes</h4>
                    {['bodySize', 'smallSize'].map(size => (
                      <div key={size} className="control-group">
                        <label>{size === 'bodySize' ? 'Body' : 'Small'}</label>
                        <input
                          type="text"
                          value={currentTheme.typography[size]}
                          onChange={e => handleTypographyChange(size, e.target.value)}
                          className="text-input"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Weights */}
                  <div className="section-group">
                    <h4>Font Weights</h4>
                    <div className="control-group">
                      <label>Heading Weight</label>
                      <select
                        value={currentTheme.typography.headingWeight}
                        onChange={e => handleTypographyChange('headingWeight', e.target.value)}
                        className="select-input"
                      >
                        {['400', '500', '600', '700', '800'].map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div className="control-group">
                      <label>Body Weight</label>
                      <select
                        value={currentTheme.typography.bodyWeight}
                        onChange={e => handleTypographyChange('bodyWeight', e.target.value)}
                        className="select-input"
                      >
                        {['400', '500', '600', '700'].map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Line Height */}
                  <div className="control-group full-width">
                    <label>Line Height</label>
                    <input
                      type="number"
                      step="0.1"
                      value={currentTheme.typography.lineHeight}
                      onChange={e => handleTypographyChange('lineHeight', parseFloat(e.target.value))}
                      className="text-input"
                      min="1"
                      max="2"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'spacing' && (
              <motion.div
                key="spacing"
                className="editor-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="spacing-grid">
                  <h3>Spacing Scale</h3>
                  {Object.entries(currentTheme.spacing).map(([key, value]) => (
                    <div key={key} className="control-group">
                      <label>{key.toUpperCase()}</label>
                      <input
                        type="text"
                        value={value}
                        onChange={e => handleTypographyChange('spacing', {
                          ...currentTheme.spacing,
                          [key]: e.target.value
                        })}
                        className="text-input"
                        placeholder="e.g., 16px"
                      />
                      <div
                        className="spacing-preview"
                        style={{ width: value, height: '20px', backgroundColor: 'var(--color-accent)' }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'effects' && (
              <motion.div
                key="effects"
                className="editor-section"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="effects-grid">
                  <h3>Shadows & Borders</h3>

                  {/* Shadows */}
                  <div className="section-group">
                    <h4>Drop Shadows</h4>
                    {Object.entries(currentTheme.shadow).map(([key, value]) => (
                      <div key={key} className="control-group">
                        <label>{key.toUpperCase()}</label>
                        <input
                          type="text"
                          value={value}
                          onChange={e => handleTypographyChange('shadow', {
                            ...currentTheme.shadow,
                            [key]: e.target.value
                          })}
                          className="text-input"
                        />
                        <div
                          className="shadow-preview"
                          style={{ boxShadow: value }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Borders */}
                  <div className="section-group">
                    <h4>Border Styling</h4>
                    <div className="control-group">
                      <label>Border Radius</label>
                      <input
                        type="text"
                        value={currentTheme.border.radius}
                        onChange={e => handleTypographyChange('border', {
                          ...currentTheme.border,
                          radius: e.target.value
                        })}
                        className="text-input"
                        placeholder="e.g., 4px"
                      />
                      <div
                        className="border-preview"
                        style={{ borderRadius: currentTheme.border.radius }}
                      />
                    </div>
                    <div className="control-group">
                      <label>Border Width</label>
                      <input
                        type="text"
                        value={currentTheme.border.width}
                        onChange={e => handleTypographyChange('border', {
                          ...currentTheme.border,
                          width: e.target.value
                        })}
                        className="text-input"
                        placeholder="e.g., 1px"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Panel */}
          <div className="preview-panel">
            <h3>Preview</h3>
            <div className="preview-content">
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <p>This is body text. It demonstrates the current typography settings.</p>
              <div className="preview-colors">
                {Object.entries(currentTheme.colors).slice(0, 4).map(([key, color]) => (
                  <div
                    key={key}
                    className="preview-color-box"
                    style={{ backgroundColor: color }}
                    title={key}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="editor-footer">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="save-btn"
            onClick={handleSaveTheme}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Theme'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ThemeEditor
