/**
 * Data Display Components - Simple Stats
 * Badge, Tag, Progress Bar, Rating (lightweight, configuration-driven)
 */

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import './DataDisplay.css'

/**
 * Badge Component
 * Simple status/label badge with multiple variants
 */
export function Badge({
  config = {},
  value = 'Badge'
}) {
  const {
    variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info'
    size = 'md', // 'sm' | 'md' | 'lg'
    icon = null,
    rounded = true,
    animated = false
  } = config

  const variantClasses = {
    default: 'badge-default',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    info: 'badge-info'
  }

  const sizeClasses = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg'
  }

  return (
    <motion.span
      className={`badge ${variantClasses[variant] || 'badge-default'} ${sizeClasses[size] || 'badge-md'} ${rounded ? 'badge-rounded' : ''}`}
      animate={animated ? { scale: [0.95, 1.05, 1] } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {value}
    </motion.span>
  )
}

/**
 * Tag Component
 * Removable label with optional close button
 */
export function Tag({
  config = {},
  value = 'Tag',
  onRemove = null
}) {
  const {
    color = 'default', // 'default' | 'blue' | 'green' | 'red' | 'purple'
    removable = false,
    icon = null,
    size = 'md'
  } = config

  const [isVisible, setIsVisible] = useState(true)

  const handleRemove = useCallback(() => {
    setIsVisible(false)
    if (onRemove) onRemove()
  }, [onRemove])

  if (!isVisible) return null

  const colorClasses = {
    default: 'tag-default',
    blue: 'tag-blue',
    green: 'tag-green',
    red: 'tag-red',
    purple: 'tag-purple'
  }

  const sizeClasses = {
    sm: 'tag-sm',
    md: 'tag-md',
    lg: 'tag-lg'
  }

  return (
    <motion.div
      className={`tag ${colorClasses[color] || 'tag-default'} ${sizeClasses[size] || 'tag-md'}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
    >
      {icon && <span className="tag-icon">{icon}</span>}
      <span>{value}</span>
      {removable && (
        <button
          className="tag-close"
          onClick={handleRemove}
          type="button"
          aria-label={`Remove ${value}`}
        >
          ✕
        </button>
      )}
    </motion.div>
  )
}

/**
 * ProgressBar Component
 * Visual progress indicator with percentage
 */
export function ProgressBar({
  config = {},
  value = 50
}) {
  const {
    max = 100,
    animated = true,
    showLabel = true,
    labelFormat = 'percent', // 'percent' | 'fraction' | 'custom'
    variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info'
    size = 'md', // 'sm' | 'md' | 'lg'
    striped = false,
    customLabel = null
  } = config

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const variantClasses = {
    default: 'progress-default',
    success: 'progress-success',
    warning: 'progress-warning',
    danger: 'progress-danger',
    info: 'progress-info'
  }

  const sizeClasses = {
    sm: 'progress-sm',
    md: 'progress-md',
    lg: 'progress-lg'
  }

  let displayLabel = ''
  if (showLabel) {
    if (customLabel) {
      displayLabel = customLabel
    } else if (labelFormat === 'percent') {
      displayLabel = `${Math.round(percentage)}%`
    } else if (labelFormat === 'fraction') {
      displayLabel = `${value}/${max}`
    }
  }

  return (
    <div className={`progress-wrapper ${sizeClasses[size] || 'progress-md'}`}>
      <div className="progress-container">
        <motion.div
          className={`progress-bar ${variantClasses[variant] || 'progress-default'} ${striped ? 'progress-striped' : ''} ${animated ? 'progress-animated' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={displayLabel}
        />
      </div>
      {showLabel && <span className="progress-label">{displayLabel}</span>}
    </div>
  )
}

/**
 * Rating Component
 * Star rating display and input
 */
export function Rating({
  config = {},
  value = 0,
  onChange = null
}) {
  const {
    max = 5,
    interactive = false,
    size = 'md', // 'sm' | 'md' | 'lg'
    precision = 1, // 1 | 0.5
    color = 'default', // 'default' | 'gold' | 'red'
    showLabel = true,
    hoverEffect = true
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [hoverValue, setHoverValue] = useState(0)

  const handleRating = useCallback((newValue) => {
    if (!interactive) return
    setInternalValue(newValue)
    if (onChange) onChange(newValue)
  }, [interactive, onChange])

  const sizeClasses = {
    sm: 'rating-sm',
    md: 'rating-md',
    lg: 'rating-lg'
  }

  const colorClasses = {
    default: 'rating-default',
    gold: 'rating-gold',
    red: 'rating-red'
  }

  const displayValue = hoverValue || internalValue
  const stars = Array.from({ length: max }, (_, i) => i + 1)

  return (
    <div className={`rating-wrapper ${sizeClasses[size] || 'rating-md'} ${colorClasses[color] || 'rating-default'}`}>
      <div className="rating-stars" role="img" aria-label={`Rating: ${displayValue} out of ${max}`}>
        {stars.map(star => {
          const isFilled = star <= displayValue
          const isHalf = precision === 0.5 && star - 0.5 === displayValue

          return (
            <motion.span
              key={star}
              className={`rating-star ${isFilled ? 'filled' : ''} ${isHalf ? 'half' : ''}`}
              onClick={() => handleRating(interactive ? star : value)}
              onMouseEnter={() => hoverEffect && setHoverValue(star)}
              onMouseLeave={() => hoverEffect && setHoverValue(0)}
              animate={hoverValue === star ? { scale: 1.2 } : { scale: 1 }}
              style={{ cursor: interactive ? 'pointer' : 'default' }}
              role={interactive ? 'button' : 'presentation'}
            >
              ★
            </motion.span>
          )
        })}
      </div>
      {showLabel && (
        <span className="rating-label">
          {displayValue > 0 ? `${displayValue.toFixed(1)} / ${max}` : 'Not rated'}
        </span>
      )}
    </div>
  )
}

export { Badge as default }
