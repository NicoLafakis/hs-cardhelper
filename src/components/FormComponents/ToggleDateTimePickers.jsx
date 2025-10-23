/**
 * Toggle & DatePicker & TimePicker Components
 * Switch toggle, date selection, time selection
 */

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import './FormComponents.css'

/**
 * Toggle Component
 * On/off switch with labels
 */
export function Toggle({
  config = {},
  value = false,
  onChange,
  error = null,
  disabled = false
}) {
  const {
    label,
    helpText = '',
    onLabel = 'On',
    offLabel = 'Off',
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(value)

  const handleToggle = useCallback(() => {
    const newValue = !internalValue
    setInternalValue(newValue)
    if (onChange) onChange(newValue)
  }, [internalValue, onChange])

  return (
    <motion.div className="form-field toggle-wrapper">
      {label && <label className="form-label">{label}</label>}

      <div className="toggle-container">
        <button
          className={`toggle-switch ${internalValue ? 'active' : ''}`}
          onClick={handleToggle}
          disabled={disabled}
          role="switch"
          aria-checked={internalValue}
          aria-label={ariaLabel}
          type="button"
        >
          <motion.div
            className="toggle-thumb"
            animate={{ x: internalValue ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        <span className="toggle-label">
          {internalValue ? onLabel : offLabel}
        </span>
      </div>

      {helpText && <p className="help-text">{helpText}</p>}
      {error && (
        <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

/**
 * DatePicker Component
 * Calendar date selection with validation
 */
export function DatePicker({
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
    minDate = null,
    maxDate = null,
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)

  const validateDate = useCallback((dateStr) => {
    if (required && !dateStr) {
      return { valid: false, message: errorMessage || 'Please select a date' }
    }

    if (dateStr && minDate && new Date(dateStr) < new Date(minDate)) {
      return { valid: false, message: `Date must be after ${minDate}` }
    }

    if (dateStr && maxDate && new Date(dateStr) > new Date(maxDate)) {
      return { valid: false, message: `Date must be before ${maxDate}` }
    }

    return { valid: true, message: '' }
  }, [required, errorMessage, minDate, maxDate])

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    setInternalValue(newValue)

    const validation_result = validateDate(newValue)
    if (!validation_result.valid) {
      setValidationError(validation_result.message)
    } else {
      setValidationError(null)
    }

    if (onChange) onChange(newValue)
  }, [validateDate, onChange])

  const displayError = error || validationError

  return (
    <motion.div className="form-field datepicker-wrapper">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <input
        type="date"
        className={`datepicker-input ${displayError ? 'error' : ''}`}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        min={minDate}
        max={maxDate}
        aria-label={ariaLabel}
        aria-invalid={!!displayError}
        aria-required={required}
      />

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
 * TimePicker Component
 * Time selection with format validation
 */
export function TimePicker({
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
    minTime = null,
    maxTime = null,
    step = 300, // seconds: 300 = 5 minute intervals
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)

  const validateTime = useCallback((timeStr) => {
    if (required && !timeStr) {
      return { valid: false, message: errorMessage || 'Please select a time' }
    }

    if (timeStr && minTime && timeStr < minTime) {
      return { valid: false, message: `Time must be after ${minTime}` }
    }

    if (timeStr && maxTime && timeStr > maxTime) {
      return { valid: false, message: `Time must be before ${maxTime}` }
    }

    return { valid: true, message: '' }
  }, [required, errorMessage, minTime, maxTime])

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    setInternalValue(newValue)

    const validation_result = validateTime(newValue)
    if (!validation_result.valid) {
      setValidationError(validation_result.message)
    } else {
      setValidationError(null)
    }

    if (onChange) onChange(newValue)
  }, [validateTime, onChange])

  const displayError = error || validationError

  return (
    <motion.div className="form-field timepicker-wrapper">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <input
        type="time"
        className={`timepicker-input ${displayError ? 'error' : ''}`}
        value={internalValue}
        onChange={handleChange}
        disabled={disabled}
        min={minTime}
        max={maxTime}
        step={step}
        aria-label={ariaLabel}
        aria-invalid={!!displayError}
        aria-required={required}
      />

      {helpText && !displayError && <p className="help-text">{helpText}</p>}
      {displayError && (
        <motion.p className="error-message" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {displayError}
        </motion.p>
      )}
    </motion.div>
  )
}

export { Toggle as default }
