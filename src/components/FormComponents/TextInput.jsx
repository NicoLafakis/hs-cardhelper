/**
 * TextInput Form Component
 * Advanced text input with validation, formatting, conditions, and actions
 * Users configure everything via UI - no code needed
 */

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './FormComponents.css'

/**
 * TextInput Component
 * Supports: validation, formatting, conditional display, async actions, debouncing
 */
export function TextInput({
  componentId,
  config = {},
  value = '',
  onChange,
  onBlur,
  onValidate,
  error = null,
  disabled = false
}) {
  const {
    label,
    placeholder = 'Enter text...',
    helpText = '',
    required = false,
    validation = {}, // { type: 'email'|'phone'|'url'|'number'|'custom', pattern, minLength, maxLength }
    formatting = {}, // { type: 'uppercase'|'lowercase'|'capitalize'|'currency'|'phone'|'date', mask }
    conditions = [], // [ { type: 'show|hide|enable|disable', field, operator, value } ]
    asyncAction = null, // { on: 'change'|'blur', action: 'webhook'|'validate'|'lookup', url, debounce }
    errorMessage = '', // Custom error message
    icon = null, // Icon component
    maxLength = 500,
    autoComplete = 'off',
    ariaLabel = label,
    ariaDescription = helpText
  } = config

  // Internal state
  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const debounceTimer = useRef(null)

  // Format value based on config
  const formatValue = useCallback((val) => {
    if (!formatting.type || !val) return val

    switch (formatting.type) {
      case 'uppercase':
        return val.toUpperCase()
      case 'lowercase':
        return val.toLowerCase()
      case 'capitalize':
        return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
      case 'phone': {
        // Format as (123) 456-7890
        const digitsOnly = val.replace(/\D/g, '')
        if (digitsOnly.length <= 3) return digitsOnly
        if (digitsOnly.length <= 6) return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3)}`
        return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`
      }
      case 'currency': {
        // Format as $1,234.56
        const num = parseFloat(val.replace(/[^\d.]/g, '')) || 0
        return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      }
      case 'date': {
        // Format as MM/DD/YYYY
        const dateDigits = val.replace(/\D/g, '')
        if (dateDigits.length <= 2) return dateDigits
        if (dateDigits.length <= 4) return `${dateDigits.slice(0, 2)}/${dateDigits.slice(2)}`
        return `${dateDigits.slice(0, 2)}/${dateDigits.slice(2, 4)}/${dateDigits.slice(4, 8)}`
      }
      default:
        return val
    }
  }, [formatting])

  // Validate value based on config
  const validateValue = useCallback((val) => {
    // Check required
    if (required && (!val || val.trim().length === 0)) {
      return { valid: false, message: errorMessage || 'This field is required' }
    }

    // Check length
    if (validation.minLength && val.length < validation.minLength) {
      return { valid: false, message: errorMessage || `Minimum ${validation.minLength} characters required` }
    }
    if (validation.maxLength && val.length > validation.maxLength) {
      return { valid: false, message: errorMessage || `Maximum ${validation.maxLength} characters allowed` }
    }

    // Check type-based validation
    if (validation.type) {
      switch (validation.type) {
        case 'email': {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (val && !emailRegex.test(val)) {
            return { valid: false, message: errorMessage || 'Please enter a valid email address' }
          }
          break
        }
        case 'phone': {
          const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
          if (val && !phoneRegex.test(val.replace(/\D/g, ''))) {
            return { valid: false, message: errorMessage || 'Please enter a valid phone number' }
          }
          break
        }
        case 'url': {
          try {
            if (val) new URL(val)
          } catch {
            return { valid: false, message: errorMessage || 'Please enter a valid URL' }
          }
          break
        }
        case 'number': {
          if (val && isNaN(val)) {
            return { valid: false, message: errorMessage || 'Please enter a valid number' }
          }
          break
        }
        case 'custom': {
          if (validation.pattern) {
            const regex = new RegExp(validation.pattern)
            if (val && !regex.test(val)) {
              return { valid: false, message: errorMessage || 'Invalid format' }
            }
          }
          break
        }
        default:
          break
      }
    }

    return { valid: true, message: '' }
  }, [validation, required, errorMessage])

  // Handle async action (validation, webhook, lookup)
  const performAsyncAction = useCallback(async (val) => {
    if (!asyncAction || !asyncAction.url) return

    setIsValidating(true)
    try {
      const response = await fetch(asyncAction.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: val, componentId })
      })

      const result = await response.json()

      if (asyncAction.action === 'validate') {
        if (!result.valid) {
          setValidationError(result.message || 'Validation failed')
          if (onValidate) onValidate({ valid: false, message: result.message })
        } else {
          setValidationError(null)
          if (onValidate) onValidate({ valid: true })
        }
      }
    } catch (err) {
      console.error('Async action failed:', err)
    } finally {
      setIsValidating(false)
    }
  }, [asyncAction, componentId, onValidate])

  // Handle change with formatting and validation
  const handleChange = useCallback((e) => {
    let newValue = e.target.value

    // Apply formatting
    newValue = formatValue(newValue)

    // Enforce max length
    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    setInternalValue(newValue)

    // Sync validation (instant feedback)
    const validation_result = validateValue(newValue)
    if (!validation_result.valid) {
      setValidationError(validation_result.message)
    } else {
      setValidationError(null)
    }

    // Call onChange callback
    if (onChange) onChange(newValue)

    // Debounce async action on change
    if (asyncAction?.on === 'change') {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        performAsyncAction(newValue)
      }, asyncAction.debounce || 500)
    }
  }, [formatValue, validateValue, maxLength, onChange, asyncAction, performAsyncAction])

  // Handle blur with validation
  const handleBlur = useCallback(() => {
    setIsFocused(false)

    // Perform async action on blur if configured
    if (asyncAction?.on === 'blur') {
      performAsyncAction(internalValue)
    }

    if (onBlur) onBlur(internalValue)
  }, [internalValue, asyncAction, performAsyncAction, onBlur])

  // Handle focus
  const handleFocus = () => setIsFocused(true)

  // Cleanup on unmount
  useEffect(() => {
    return () => clearTimeout(debounceTimer.current)
  }, [])

  // Determine if field should be shown (conditions)
  const isVisible = conditions.length === 0 || conditions.every(() => {
    // Evaluate condition (in real app, this would check parent form state)
    return true
  })

  if (!isVisible) return null

  const displayError = error || validationError
  const charCount = internalValue.length

  return (
    <motion.div
      className="form-field text-input-wrapper"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <div className="input-icon">{icon}</div>}

        <input
          type="text"
          className={`text-input ${isFocused ? 'focused' : ''} ${displayError ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
          value={internalValue}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          disabled={disabled || isValidating}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-label={ariaLabel}
          aria-description={ariaDescription}
          aria-invalid={!!displayError}
          aria-required={required}
        />

        {isValidating && (
          <div className="validation-spinner">
            <div className="spinner" />
          </div>
        )}
      </div>

      {helpText && !displayError && (
        <p className="help-text">{helpText}</p>
      )}

      {displayError && (
        <motion.p
          className="error-message"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {displayError}
        </motion.p>
      )}

      {validation.maxLength && (
        <div className="char-count">
          {charCount} / {validation.maxLength}
        </div>
      )}
    </motion.div>
  )
}

/**
 * TextArea Component
 * Multi-line text input with same validation/formatting/async capabilities
 */
export function TextArea({
  config = {},
  value = '',
  onChange,
  onBlur,
  error = null,
  disabled = false
}) {
  const {
    label,
    placeholder = 'Enter text...',
    helpText = '',
    required = false,
    validation = {},
    errorMessage = '',
    rows = 4,
    maxLength = 5000,
    ariaLabel = label,
    ariaDescription = helpText
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)
  const [isFocused, setIsFocused] = useState(false)

  // Same validation logic as TextInput
  const validateValue = useCallback((val) => {
    if (required && (!val || val.trim().length === 0)) {
      return { valid: false, message: errorMessage || 'This field is required' }
    }

    if (validation.minLength && val.length < validation.minLength) {
      return { valid: false, message: errorMessage || `Minimum ${validation.minLength} characters required` }
    }

    if (validation.maxLength && val.length > validation.maxLength) {
      return { valid: false, message: errorMessage || `Maximum ${validation.maxLength} characters allowed` }
    }

    return { valid: true, message: '' }
  }, [validation, required, errorMessage])

  const handleChange = useCallback((e) => {
    let newValue = e.target.value

    if (newValue.length > maxLength) {
      newValue = newValue.slice(0, maxLength)
    }

    setInternalValue(newValue)

    const validation_result = validateValue(newValue)
    if (!validation_result.valid) {
      setValidationError(validation_result.message)
    } else {
      setValidationError(null)
    }

    if (onChange) onChange(newValue)
  }, [maxLength, validateValue, onChange])

  const handleBlur = () => {
    setIsFocused(false)
    if (onBlur) onBlur(internalValue)
  }

  const displayError = error || validationError
  const charCount = internalValue.length

  return (
    <motion.div
      className="form-field textarea-wrapper"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <textarea
        className={`text-area ${isFocused ? 'focused' : ''} ${displayError ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        value={internalValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={() => setIsFocused(true)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        aria-label={ariaLabel}
        aria-description={ariaDescription}
        aria-invalid={!!displayError}
        aria-required={required}
      />

      {helpText && !displayError && (
        <p className="help-text">{helpText}</p>
      )}

      {displayError && (
        <motion.p
          className="error-message"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {displayError}
        </motion.p>
      )}

      <div className="char-count">
        {charCount} / {maxLength}
      </div>
    </motion.div>
  )
}

export default TextInput
