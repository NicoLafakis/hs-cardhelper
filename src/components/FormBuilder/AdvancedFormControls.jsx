/**
 * @fileoverview Advanced Form Controls React component
 * @module src/components/FormBuilder/AdvancedFormControls
 * @license MIT
 * @author CardHelper Team
 */

/**
 * AdvancedFormControls - Enhanced form input components
 * Part of Advanced Form Controls & Validation feature
 */

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  ChevronDown,
  X,
  Check,
  Search,
  Calendar,
  ArrowRight,
  Plus,
  Tag,
} from 'lucide-react'

/**
 * MultiSelect - Multi-select dropdown with search
 */
export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options...',
  searchable = true,
  maxSelections = Infinity,
  error,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelect = optionValue => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else if (value.length < maxSelections) {
      onChange([...value, optionValue])
    }
  }

  const handleRemove = (optionValue, e) => {
    e.stopPropagation()
    onChange(value.filter(v => v !== optionValue))
  }

  const selectedLabels = value.map(
    v => options.find(o => o.value === v)?.label || v
  )

  return (
    <div ref={containerRef} className="relative">
      {/* Selected Items / Trigger */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`min-h-[42px] p-2 border-2 rounded-lg cursor-pointer flex flex-wrap gap-1 items-center
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200'}
          ${error ? 'border-red-400' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      >
        {selectedLabels.length > 0 ? (
          selectedLabels.map((label, index) => (
            <span
              key={value[index]}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-sm"
            >
              {label}
              <X
                className="w-3 h-3 cursor-pointer hover:text-primary/70"
                onClick={e => handleRemove(value[index], e)}
              />
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">{placeholder}</span>
        )}
        <ChevronDown
          className={`w-4 h-4 ml-auto text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border rounded focus:outline-none focus:border-primary"
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map(option => {
                const isSelected = value.includes(option.value)
                return (
                  <div
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm
                      ${isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center
                      ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}
                    `}
                    >
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    {option.label}
                  </div>
                )
              })
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                No options found
              </div>
            )}
          </div>
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

/**
 * Combobox - Autocomplete input with suggestions
 */
export function Combobox({
  options = [],
  value,
  onChange,
  placeholder = 'Type to search...',
  allowCustom = true,
  error,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const containerRef = useRef(null)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  )

  const handleInputChange = e => {
    setInputValue(e.target.value)
    setIsOpen(true)
    if (allowCustom) {
      onChange(e.target.value)
    }
  }

  const handleSelect = option => {
    setInputValue(option.label)
    onChange(option.value)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:border-primary
            ${error ? 'border-red-400' : 'border-gray-200'}
            ${disabled ? 'bg-gray-100' : ''}
          `}
        />
        <ChevronDown
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filteredOptions.map(option => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 cursor-pointer text-sm hover:bg-gray-50
                ${option.value === value ? 'bg-primary/10 text-primary' : ''}
              `}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

/**
 * DateRangePicker - Select date range (from/to)
 */
export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  minDate,
  maxDate,
  error,
  disabled = false,
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={startDate || ''}
            onChange={e => onStartDateChange(e.target.value)}
            min={minDate}
            max={endDate || maxDate}
            disabled={disabled}
            className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:border-primary
              ${error ? 'border-red-400' : 'border-gray-200'}
              ${disabled ? 'bg-gray-100' : ''}
            `}
          />
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <div className="relative flex-1">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={endDate || ''}
            onChange={e => onEndDateChange(e.target.value)}
            min={startDate || minDate}
            max={maxDate}
            disabled={disabled}
            className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:border-primary
              ${error ? 'border-red-400' : 'border-gray-200'}
              ${disabled ? 'bg-gray-100' : ''}
            `}
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

/**
 * TagInput - Tag/chip input for multiple values
 */
export function TagInput({
  value = [],
  onChange,
  placeholder = 'Add tag...',
  maxTags = Infinity,
  suggestions = [],
  error,
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)

  const filteredSuggestions = suggestions.filter(
    s =>
      s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  )

  const addTag = useCallback(
    tag => {
      const trimmedTag = tag.trim()
      if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
        onChange([...value, trimmedTag])
        setInputValue('')
      }
    },
    [value, maxTags, onChange]
  )

  const removeTag = tagToRemove => {
    onChange(value.filter(tag => tag !== tagToRemove))
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div className="relative">
      <div
        className={`min-h-[42px] p-2 border-2 rounded-lg flex flex-wrap gap-1 items-center
          ${error ? 'border-red-400' : 'border-gray-200 focus-within:border-primary'}
          ${disabled ? 'bg-gray-100' : 'bg-white'}
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm"
          >
            <Tag className="w-3 h-3 text-gray-400" />
            {tag}
            {!disabled && (
              <X
                className="w-3 h-3 cursor-pointer hover:text-red-500"
                onClick={() => removeTag(tag)}
              />
            )}
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || value.length >= maxTags}
          className="flex-1 min-w-[100px] border-none outline-none text-sm bg-transparent"
        />
        {value.length < maxTags && inputValue && (
          <button
            type="button"
            onClick={() => addTag(inputValue)}
            className="p-1 text-primary hover:bg-primary/10 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && inputValue && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
          {filteredSuggestions.map(suggestion => (
            <div
              key={suggestion}
              onClick={() => addTag(suggestion)}
              className="px-3 py-2 cursor-pointer text-sm hover:bg-gray-50"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

/**
 * SliderInput - Range slider with value display
 */
export function SliderInput({
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  unit = '',
  error,
  disabled = false,
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <input
          type="range"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary disabled:cursor-not-allowed"
        />
        {showValue && (
          <div className="w-20 px-2 py-1 bg-gray-100 rounded text-center text-sm font-medium">
            {value}
            {unit}
          </div>
        )}
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}

/**
 * RatingInput - Star rating input
 */
export function RatingInput({
  value = 0,
  onChange,
  max = 5,
  error,
  disabled = false,
}) {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        {Array.from({ length: max }, (_, i) => i + 1).map(star => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            onMouseEnter={() => !disabled && setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            disabled={disabled}
            className="text-2xl focus:outline-none disabled:cursor-not-allowed"
          >
            <span
              className={
                (hoverValue || value) >= star
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }
            >
              ★
            </span>
          </button>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}
