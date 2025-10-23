/**
 * Smart Builder UI Component
 * Natural language card generation interface
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGenerateLayout, useSuggestComponents, useLayoutImprovements } from '../../hooks/useSmartBuilder'
import './SmartBuilder.css'

export function SmartBuilder({ onCardGenerated }) {
  const [description, setDescription] = useState('')
  const [activeTab, setActiveTab] = useState('generate')
  const [generatedLayout, setGeneratedLayout] = useState(null)

  const { generate: generateLayout, loading: generatingLayout, error: layoutError } =
    useGenerateLayout()
  const { suggest: suggestComponents, loading: loadingComponents } =
    useSuggestComponents()
  const { getSuggestions: getImprovements, loading: loadingImprovements } =
    useLayoutImprovements()

  const handleGenerate = async () => {
    try {
      const layout = await generateLayout(description)
      setGeneratedLayout(layout)
      setActiveTab('preview')
    } catch (err) {
      console.error('Generation failed:', err)
    }
  }

  const handleApplyLayout = () => {
    if (generatedLayout && onCardGenerated) {
      onCardGenerated(generatedLayout)
    }
  }

  const handleSuggestComponents = async () => {
    if (generatedLayout) {
      try {
        await suggestComponents(generatedLayout.description)
      } catch (err) {
        console.error('Component suggestion failed:', err)
      }
    }
  }

  const handleGetImprovements = async () => {
    if (generatedLayout) {
      try {
        await getImprovements(generatedLayout)
      } catch (err) {
        console.error('Improvement suggestions failed:', err)
      }
    }
  }

  return (
    <motion.div
      className="smart-builder"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="builder-header">
        <div className="header-content">
          <h2>🤖 AI Card Generator</h2>
          <p>Describe your card, and Claude will design it for you</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="builder-tabs">
        {['generate', 'preview', 'refine'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'generate' && '✨ Generate'}
            {tab === 'preview' && '👁️ Preview'}
            {tab === 'refine' && '⚙️ Refine'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="builder-content">
        <AnimatePresence mode="wait">
          {/* Generate Tab */}
          {activeTab === 'generate' && (
            <motion.div
              key="generate"
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="input-group">
                <label>Describe your card:</label>
                <textarea
                  className="description-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Example: A contact card showing name, email, phone number, and company. Include action buttons for call and email. Use a professional blue theme."
                  rows={5}
                />
                <span className="char-count">
                  {description.length} / 1000
                </span>
              </div>

              {/* Examples */}
              <div className="examples">
                <p className="examples-label">Quick examples:</p>
                <div className="example-chips">
                  {[
                    'Lead qualification form with score display',
                    'Product card with image, price, and reviews',
                    'Meeting scheduler with calendar picker'
                  ].map(example => (
                    <button
                      key={example}
                      className="example-chip"
                      onClick={() => setDescription(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {layoutError && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  ❌ {layoutError}
                </motion.div>
              )}

              {/* Generate Button */}
              <button
                className="generate-btn"
                onClick={handleGenerate}
                disabled={generatingLayout || description.length < 10}
              >
                {generatingLayout ? '⏳ Generating...' : '✨ Generate Card'}
              </button>
            </motion.div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <motion.div
              key="preview"
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {generatedLayout ? (
                <div className="preview-content">
                  {/* Layout Info */}
                  <div className="layout-info">
                    <div className="info-item">
                      <span className="label">Name:</span>
                      <span className="value">{generatedLayout.name}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Layout:</span>
                      <span className="value">{generatedLayout.layout}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Sections:</span>
                      <span className="value">{generatedLayout.sections?.length || 0}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Fields:</span>
                      <span className="value">{generatedLayout.fields?.length || 0}</span>
                    </div>
                  </div>

                  {/* Sections Preview */}
                  <div className="sections-preview">
                    <h4>Sections:</h4>
                    <div className="sections-list">
                      {generatedLayout.sections?.map(section => (
                        <div key={section.id} className="section-item">
                          <span className="section-type">{section.type}</span>
                          <span className="section-title">{section.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Fields Preview */}
                  <div className="fields-preview">
                    <h4>Fields:</h4>
                    <div className="fields-list">
                      {generatedLayout.fields?.map(field => (
                        <div key={field.id} className="field-item">
                          <span className="field-type">{field.type}</span>
                          <span className="field-name">{field.name}</span>
                          {field.required && <span className="required-badge">Required</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  {generatedLayout.suggestions && (
                    <div className="suggestions-box">
                      <h4>💡 AI Suggestions:</h4>
                      <ul>
                        {generatedLayout.suggestions.map((sugg, idx) => (
                          <li key={idx}>{sugg}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="preview-actions">
                    <button
                      className="action-btn primary"
                      onClick={handleApplyLayout}
                    >
                      ✅ Use This Layout
                    </button>
                    <button
                      className="action-btn secondary"
                      onClick={() => {
                        setDescription('')
                        setGeneratedLayout(null)
                        setActiveTab('generate')
                      }}
                    >
                      🔄 Generate Another
                    </button>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No layout generated yet. Go back to the Generate tab!</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Refine Tab */}
          {activeTab === 'refine' && (
            <motion.div
              key="refine"
              className="tab-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {generatedLayout ? (
                <div className="refine-content">
                  <div className="refine-actions">
                    <button
                      className="refine-btn"
                      onClick={handleSuggestComponents}
                      disabled={loadingComponents}
                    >
                      {loadingComponents ? '⏳ Analyzing...' : '🎨 Suggest Components'}
                    </button>
                    <button
                      className="refine-btn"
                      onClick={handleGetImprovements}
                      disabled={loadingImprovements}
                    >
                      {loadingImprovements ? '⏳ Analyzing...' : '⚡ Get Improvements'}
                    </button>
                  </div>
                  <div className="refine-info">
                    <p>Ask Claude Haiku to:</p>
                    <ul>
                      <li>Suggest better component choices</li>
                      <li>Recommend layout optimizations</li>
                      <li>Improve visual hierarchy</li>
                      <li>Enhance mobile responsiveness</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Generate a layout first to refine it!</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default SmartBuilder
