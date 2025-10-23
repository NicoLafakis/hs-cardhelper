/**
 * Animation Builder Component
 * Visual animation editor and builder UI
 */

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ANIMATION_PRESETS, getAnimationsByCategory } from '../../core/AnimationEngine'
import Modal from '../ui/molecules/Modal'
import Button from '../ui/atoms/Button'
import Input from '../ui/atoms/Input'
import Label from '../ui/atoms/Label'
import './AnimationBuilder.css'

export function AnimationBuilder({ onAnimationSelect, onClose }) {
  const [activeTab, setActiveTab] = useState('entrance')
  const [selectedAnimation, setSelectedAnimation] = useState(null)
  const [customOptions, setCustomOptions] = useState({
    duration: 0.5,
    delay: 0,
    repeat: 0
  })
  const [preview, setPreview] = useState(true)

  const animationsByCategory = useMemo(
    () => getAnimationsByCategory(activeTab),
    [activeTab]
  )

  const handleAnimationSelect = (animKey) => {
    setSelectedAnimation(animKey)
  }

  const handleApply = () => {
    if (selectedAnimation) {
      const animation = ANIMATION_PRESETS[selectedAnimation]
      onAnimationSelect({
        key: selectedAnimation,
        config: {
          ...animation,
          duration: customOptions.duration,
          delay: customOptions.delay
        }
      })
      onClose()
    }
  }

  const getPreviewProps = () => {
    if (!selectedAnimation) return {}

    const animation = ANIMATION_PRESETS[selectedAnimation]

    if (activeTab === 'continuous') {
      return {
        animate: animation.animate,
        transition: {
          ...animation.transition,
          duration: customOptions.duration
        }
      }
    }

    return {
      initial: animation.initial,
      animate: animation.animate,
      transition: {
        duration: customOptions.duration,
        delay: customOptions.delay,
        ease: animation.easing
      }
    }
  }

  return (
    <Modal title="Animation Builder" onClose={onClose} size="large">
      <div className="animation-builder">
        <div className="builder-layout">
          {/* Left: Category Tabs */}
          <div className="builder-sidebar">
            <div className="category-tabs">
              {['entrance', 'hover', 'scroll', 'exit', 'continuous'].map(category => (
                <button
                  key={category}
                  className={`category-tab ${activeTab === category ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(category)
                    setSelectedAnimation(null)
                  }}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Center: Animation Grid */}
          <div className="builder-center">
            <div className="animations-grid">
              {animationsByCategory.map(animation => (
                <motion.div
                  key={animation.key}
                  className={`animation-card ${selectedAnimation === animation.key ? 'selected' : ''}`}
                  onClick={() => handleAnimationSelect(animation.key)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="animation-preview-mini">
                    {activeTab !== 'hover' && activeTab !== 'scroll' && (
                      <motion.div
                        className="preview-box"
                        initial={animation.initial}
                        animate={animation.animate}
                        transition={{
                          duration: animation.duration,
                          ease: animation.easing
                        }}
                      />
                    )}
                    {activeTab === 'hover' && (
                      <motion.div
                        className="preview-box"
                        whileHover={animation.whileHover}
                        transition={animation.transition}
                      />
                    )}
                    {activeTab === 'scroll' && (
                      <div className="preview-box scroll-icon">↓</div>
                    )}
                  </div>
                  <p className="animation-name">{animation.name}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Settings */}
          <div className="builder-right">
            <div className="animation-settings">
              <h3>Settings</h3>

              {selectedAnimation ? (
                <>
                  <div className="setting-group">
                    <Label>Animation</Label>
                    <p className="selected-animation">
                      {ANIMATION_PRESETS[selectedAnimation]?.name || 'None'}
                    </p>
                  </div>

                  {activeTab !== 'hover' && activeTab !== 'scroll' && (
                    <div className="setting-group">
                      <Label>Duration (seconds)</Label>
                      <Input
                        type="number"
                        min="0.1"
                        max="5"
                        step="0.1"
                        value={customOptions.duration}
                        onChange={e =>
                          setCustomOptions({
                            ...customOptions,
                            duration: parseFloat(e.target.value)
                          })
                        }
                      />
                    </div>
                  )}

                  {activeTab !== 'hover' && activeTab !== 'scroll' && (
                    <div className="setting-group">
                      <Label>Delay (seconds)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="2"
                        step="0.1"
                        value={customOptions.delay}
                        onChange={e =>
                          setCustomOptions({
                            ...customOptions,
                            delay: parseFloat(e.target.value)
                          })
                        }
                      />
                    </div>
                  )}

                  <div className="setting-group checkbox">
                    <label>
                      <input
                        type="checkbox"
                        checked={preview}
                        onChange={e => setPreview(e.target.checked)}
                      />
                      Preview Animation
                    </label>
                  </div>

                  {preview && (
                    <div className="animation-preview-large">
                      <motion.div className="preview-box-large" {...getPreviewProps()} />
                    </div>
                  )}
                </>
              ) : (
                <p className="no-selection">Select an animation to configure</p>
              )}
            </div>

            <div className="settings-actions">
              <Button
                onClick={handleApply}
                disabled={!selectedAnimation}
                variant="primary"
              >
                Apply Animation
              </Button>
              <Button onClick={onClose} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

/**
 * Animation Preset Card Component
 */
export function AnimationPresetCard({ preset, isSelected, onClick }) {
  return (
    <motion.div
      className={`animation-preset ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="preset-preview">
        <motion.div
          className="preview-element"
          initial={preset.initial}
          animate={preset.animate}
          transition={{ duration: preset.duration }}
        />
      </div>
      <h4>{preset.name}</h4>
      <p className="preset-category">{preset.category}</p>
    </motion.div>
  )
}

/**
 * Animation Timeline Component
 */
export function AnimationTimeline({ animations = [], onAnimationClick, onAnimationRemove }) {
  return (
    <div className="animation-timeline">
      <div className="timeline-header">
        <h3>Animation Timeline</h3>
      </div>

      {animations.length === 0 ? (
        <p className="empty-timeline">No animations applied yet</p>
      ) : (
        <div className="timeline-track">
          {animations.map((anim, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => onAnimationClick?.(index)}
            >
              <div className="timeline-item-header">
                <span className="item-name">{anim.name}</span>
                <span className="item-duration">{anim.duration}s</span>
              </div>
              <div className="timeline-item-bar">
                <div
                  className="timeline-bar"
                  style={{
                    width: `${(anim.duration / 5) * 100}%`,
                    left: `${(anim.delay / 5) * 100}%`
                  }}
                />
              </div>
              <button
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  onAnimationRemove?.(index)
                }}
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Quick Animation Selector
 */
export function QuickAnimationPicker({ onSelect, categories = ['entrance', 'hover', 'continuous'] }) {
  const [activeCategory, setActiveCategory] = useState(categories[0])

  const animations = useMemo(
    () => getAnimationsByCategory(activeCategory),
    [activeCategory]
  )

  return (
    <div className="quick-animation-picker">
      <div className="picker-tabs">
        {categories.map(category => (
          <button
            key={category}
            className={`picker-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="picker-grid">
        {animations.map(anim => (
          <motion.button
            key={anim.key}
            className="picker-item"
            onClick={() => onSelect(anim.key)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {anim.name}
          </motion.button>
        ))}
      </div>
    </div>
  )
}
