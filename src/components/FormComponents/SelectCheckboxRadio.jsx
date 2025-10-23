/**
 * Select & Checkbox & Radio Components
 * Dropdown selection, boolean choices, multi-select
 */

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import './FormComponents.css'

/**
 * Select Component
 * Single/multi-select dropdown with dynamic options from API or static
 */
export function Select({
  config = {},
  value = '',
  onChange,
  error = null,
  disabled = false
}) {
  const {
    label,
    required = false,
    helpText = '',
    errorMessage = '',
    multiSelect = false,
    options = [], // [ { label, value }, ... ]
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(multiSelect && !Array.isArray(value) ? [] : value)
  const [validationError, setValidationError] = useState(null)
  const [isFocused, setIsFocused] = useState(false)

  // Validate selection
  const validateValue = useCallback((val) => {
    if (required && (!val || (Array.isArray(val) && val.length === 0))) {
      return { valid: false, message: errorMessage || 'Please select an option' }
    }
    return { valid: true, message: '' }
  }, [required, errorMessage])

  const handleChange = useCallback((selectedValue) => {
    let newValue
    if (multiSelect) {
      newValue = Array.isArray(internalValue) ? internalValue : []
      if (newValue.includes(selectedValue)) {
        newValue = newValue.filter(v => v !== selectedValue)
      } else {
        newValue = [...newValue, selectedValue]
      }
    } else {
      newValue = selectedValue
    }

    setInternalValue(newValue)

    const validation_result = validateValue(newValue)
    if (!validation_result.valid) {
      setValidationError(validation_result.message)
    } else {
      setValidationError(null)
    }

    if (onChange) onChange(newValue)
  }, [internalValue, multiSelect, onChange, validateValue])

  const displayError = error || validationError
  const displayOptions = Array.isArray(options) ? options : []

  return (
    <motion.div className="form-field select-wrapper">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className={`select-container ${isFocused ? 'focused' : ''} ${displayError ? 'error' : ''}`}>
        <select
          className="select-input"
          value={multiSelect ? (Array.isArray(internalValue) ? internalValue[0] : '') : internalValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setIsFocused(false)}
          onFocus={() => setIsFocused(true)}
          disabled={disabled}
          multiple={multiSelect}
          aria-label={ariaLabel}
          aria-invalid={!!displayError}
          aria-required={required}
        >
          {!multiSelect && <option value="">-- Select --</option>}
          {displayOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {helpText && !displayError && <p className="help-text">{helpText}</p>}
      {displayError && (
        <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {displayError}
        </motion.p>
      )}
    </motion.div>
  )
}

/**
 * Checkbox Component
 * Single boolean checkbox or checkbox group
 */
export function Checkbox({
  config = {},
  value = false,
  onChange,
  error = null,
  disabled = false
}) {
  const {
    label,
    helpText = '',
    required = false,
    errorMessage = '',
    description = ''
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)

  const handleChange = useCallback((e) => {
    const newValue = e.target.checked
    setInternalValue(newValue)

    if (required && !newValue) {
      setValidationError(errorMessage || 'This checkbox must be checked')
    } else {
      setValidationError(null)
    }

    if (onChange) onChange(newValue)
  }, [required, onChange, errorMessage])

  const displayError = error || validationError

  return (
    <motion.div className="form-field checkbox-wrapper">
      <div className="checkbox-input-wrapper">
        <input
          type="checkbox"
          className={`checkbox-input ${displayError ? 'error' : ''}`}
          checked={internalValue}
          onChange={handleChange}
          disabled={disabled}
          aria-label={label}
          aria-invalid={!!displayError}
          aria-required={required}
        />
        <label className="checkbox-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      </div>

      {description && <p className="checkbox-description">{description}</p>}
      {helpText && !displayError && <p className="help-text">{helpText}</p>}
      {displayError && (
        <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {displayError}
        </motion.p>
      )}
    </motion.div>
  )
}

/**
 * Radio Component
 * Single selection from multiple options
 */
export function Radio({
  config = {},
  value = '',
  onChange,
  error = null,
  disabled = false
}) {
  const {
    label,
    required = false,
    helpText = '',
    errorMessage = '',
    options = [], // [ { label, value }, ... ]
    orientation = 'vertical', // 'vertical' | 'horizontal'
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)

  const handleChange = useCallback((selectedValue) => {
    setInternalValue(selectedValue)

    if (required && !selectedValue) {
      setValidationError(errorMessage || 'Please select an option')
    } else {
      setValidationError(null)
    }

    if (onChange) onChange(selectedValue)
  }, [required, onChange, errorMessage])

  const displayError = error || validationError

  return (
    <motion.div className="form-field radio-wrapper">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div className={`radio-group radio-${orientation}`} role="radiogroup" aria-label={ariaLabel}>
        {options.map(opt => (
          <div key={opt.value} className="radio-option">
            <input
              type="radio"
              name={ariaLabel}
              value={opt.value}
              checked={internalValue === opt.value}
              onChange={(e) => handleChange(e.target.value)}
              disabled={disabled}
              className={`radio-input ${displayError ? 'error' : ''}`}
              aria-required={required}
            />
            <label className="radio-label">{opt.label}</label>
          </div>
        ))}
      </div>

      {helpText && !displayError && <p className="help-text">{helpText}</p>}
      {displayError && (
        <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {displayError}
        </motion.p>
      )}
    </motion.div>
  )
}

export { Select as default }
