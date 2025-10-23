/**
 * FileUpload & SearchInput Components
 * File upload with drag-drop, search with suggestions
 */

import React, { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import './FormComponents.css'

/**
 * FileUpload Component
 * File input with drag-drop support and validation
 */
export function FileUpload({
  config = {},
  value = null,
  onChange,
  error = null,
  disabled = false
}) {
  const {
    label,
    required = false,
    helpText = '',
    errorMessage = '',
    accept = '*/*', // MIME types: 'image/*', '.pdf', etc.
    maxSize = 5242880, // 5MB default
    multiple = false,
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const validateFile = useCallback((files) => {
    if (required && (!files || files.length === 0)) {
      return { valid: false, message: errorMessage || 'Please upload a file' }
    }

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.size > maxSize) {
          return { valid: false, message: `File size exceeds ${(maxSize / 1024 / 1024).toFixed(1)}MB limit` }
        }
      }
    }

    return { valid: true, message: '' }
  }, [required, errorMessage, maxSize])

  const handleFiles = useCallback((files) => {
    const validation_result = validateFile(files)
    if (!validation_result.valid) {
      setValidationError(validation_result.message)
    } else {
      setValidationError(null)
    }

    const newValue = multiple ? Array.from(files) : files[0]
    setInternalValue(newValue)

    if (onChange) onChange(newValue)
  }, [validateFile, multiple, onChange])

  const handleChange = (e) => {
    handleFiles(e.target.files)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const displayError = error || validationError
  const fileCount = multiple && Array.isArray(internalValue) ? internalValue.length : (internalValue ? 1 : 0)

  return (
    <motion.div className="form-field fileupload-wrapper">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-indicator">*</span>}
        </label>
      )}

      <div
        className={`fileupload-dropzone ${isDragging ? 'dragging' : ''} ${displayError ? 'error' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="fileupload-input"
          onChange={handleChange}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-invalid={!!displayError}
          aria-required={required}
          style={{ display: 'none' }}
        />

        <div className="fileupload-content">
          <div className="fileupload-icon">📁</div>
          <p className="fileupload-text">
            Drag files here or click to upload
          </p>
          <p className="fileupload-hint">
            Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
          </p>
        </div>
      </div>

      {fileCount > 0 && (
        <div className="fileupload-list">
          {multiple && Array.isArray(internalValue) ? (
            internalValue.map((file, idx) => (
              <div key={idx} className="fileupload-item">
                📄 {file.name} ({(file.size / 1024).toFixed(1)}KB)
              </div>
            ))
          ) : (
            internalValue && (
              <div className="fileupload-item">
                📄 {internalValue.name} ({(internalValue.size / 1024).toFixed(1)}KB)
              </div>
            )
          )}
        </div>
      )}

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
 * SearchInput Component
 * Text search with debouncing and async suggestions
 */
export function SearchInput({
  config = {},
  value = '',
  onChange,
  onSearch,
  error = null,
  disabled = false
}) {
  const {
    label,
    placeholder = 'Search...',
    helpText = '',
    minChars = 2,
    debounceMs = 300,
    ariaLabel = label
  } = config

  const [internalValue, setInternalValue] = useState(value)
  const [validationError, setValidationError] = useState(null)
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceTimerRef = useRef(null)

  const performSearch = useCallback(async (searchTerm) => {
    if (searchTerm.length < minChars) {
      setSuggestions([])
      return
    }

    setIsSearching(true)
    try {
      if (onSearch) {
        const results = await onSearch(searchTerm)
        setSuggestions(results || [])
        setShowSuggestions(true)
      }
    } catch (err) {
      setValidationError('Search failed, please try again')
    } finally {
      setIsSearching(false)
    }
  }, [minChars, onSearch])

  const handleChange = useCallback((e) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    setValidationError(null)
    setShowSuggestions(true)

    // Debounce search
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)

    if (newValue.trim().length >= minChars) {
      debounceTimerRef.current = setTimeout(() => {
        performSearch(newValue)
      }, debounceMs)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }

    if (onChange) onChange(newValue)
  }, [minChars, debounceMs, performSearch, onChange])

  const handleSelectSuggestion = useCallback((suggestion) => {
    setInternalValue(suggestion)
    setShowSuggestions(false)
    setSuggestions([])
    if (onChange) onChange(suggestion)
  }, [onChange])

  const displayError = error || validationError

  return (
    <motion.div className="form-field searchinput-wrapper">
      {label && <label className="form-label">{label}</label>}

      <div className="searchinput-container">
        <div className="searchinput-box">
          <span className="searchinput-icon">🔍</span>
          <input
            type="text"
            className={`searchinput-input ${displayError ? 'error' : ''}`}
            value={internalValue}
            onChange={handleChange}
            onFocus={() => internalValue.length >= minChars && setSuggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholder}
            disabled={disabled || isSearching}
            aria-label={ariaLabel}
            aria-invalid={!!displayError}
            autoComplete="off"
          />
          {isSearching && <div className="loading-spinner small" />}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            className="searchinput-suggestions"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="suggestion-item"
                onClick={() => handleSelectSuggestion(suggestion)}
                role="option"
              >
                {suggestion}
              </div>
            ))}
          </motion.div>
        )}
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

export { FileUpload as default }
