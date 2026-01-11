/**
 * @fileoverview Filter Panel React component
 * @module src/components/SmartSearch/FilterPanel
 * @license MIT
 * @author CardHelper Team
 */

/**
 * FilterPanel - Advanced filtering with multiple criteria
 * Part of Smart Filtering & Search feature
 */

import { useState, useMemo } from 'react'
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Check,
  Star,
  Calendar,
  Tag,
  LayoutGrid,
  List,
} from 'lucide-react'

// Filter configuration types
const FILTER_TYPES = {
  checkbox: 'checkbox',
  radio: 'radio',
  range: 'range',
  date: 'date',
  rating: 'rating',
}

function CheckboxFilter({ options, selected, onChange }) {
  return (
    <div className="space-y-1">
      {options.map(option => (
        <label
          key={option.value}
          className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer"
        >
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => {
              const newSelected = selected.includes(option.value)
                ? selected.filter(v => v !== option.value)
                : [...selected, option.value]
              onChange(newSelected)
            }}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
          {option.count !== undefined && (
            <span className="ml-auto text-xs text-gray-400">
              ({option.count})
            </span>
          )}
        </label>
      ))}
    </div>
  )
}

function RadioFilter({ options, selected, onChange }) {
  return (
    <div className="space-y-1">
      {options.map(option => (
        <label
          key={option.value}
          className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer"
        >
          <input
            type="radio"
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">{option.label}</span>
        </label>
      ))}
    </div>
  )
}

function RangeFilter({ min, max, value, onChange, unit = '' }) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="number"
          value={value[0]}
          onChange={e => onChange([Number(e.target.value), value[1]])}
          min={min}
          max={value[1]}
          placeholder="Min"
          className="w-full px-2 py-1 border rounded text-sm"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          value={value[1]}
          onChange={e => onChange([value[0], Number(e.target.value)])}
          min={value[0]}
          max={max}
          placeholder="Max"
          className="w-full px-2 py-1 border rounded text-sm"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value[0]}
        onChange={e => onChange([Number(e.target.value), value[1]])}
        className="w-full"
      />
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
    </div>
  )
}

function RatingFilter({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(value === star ? null : star)}
          className={`p-1 rounded transition-colors ${
            value >= star
              ? 'text-yellow-400'
              : 'text-gray-300 hover:text-yellow-200'
          }`}
        >
          <Star className="w-5 h-5 fill-current" />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-500">
        {value ? `${value}+ stars` : 'Any rating'}
      </span>
    </div>
  )
}

function DateFilter({ value, onChange }) {
  const presets = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' },
  ]

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {presets.map(preset => (
          <button
            key={preset.value}
            onClick={() =>
              onChange(value === preset.value ? null : preset.value)
            }
            className={`px-2 py-1 text-xs rounded ${
              value === preset.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <input
          type="date"
          value={typeof value === 'string' && value.includes('-') ? value : ''}
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1 border rounded text-sm"
        />
      </div>
    </div>
  )
}

function FilterSection({ filter, value, onChange, isExpanded, onToggle }) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-3 hover:bg-gray-50"
      >
        <span className="font-medium text-gray-700">{filter.label}</span>
        <div className="flex items-center gap-2">
          {value && <span className="w-2 h-2 bg-primary rounded-full" />}
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      {isExpanded && (
        <div className="px-3 pb-3">
          {filter.type === FILTER_TYPES.checkbox && (
            <CheckboxFilter
              options={filter.options}
              selected={value || []}
              onChange={onChange}
            />
          )}
          {filter.type === FILTER_TYPES.radio && (
            <RadioFilter
              options={filter.options}
              selected={value}
              onChange={onChange}
            />
          )}
          {filter.type === FILTER_TYPES.range && (
            <RangeFilter
              min={filter.min}
              max={filter.max}
              value={value || [filter.min, filter.max]}
              onChange={onChange}
              unit={filter.unit}
            />
          )}
          {filter.type === FILTER_TYPES.rating && (
            <RatingFilter value={value} onChange={onChange} />
          )}
          {filter.type === FILTER_TYPES.date && (
            <DateFilter value={value} onChange={onChange} />
          )}
        </div>
      )}
    </div>
  )
}

export default function FilterPanel({
  filters = [],
  values = {},
  onChange,
  onClear,
  showViewToggle = true,
  viewMode = 'grid',
  onViewModeChange,
  className = '',
}) {
  const [expandedSections, setExpandedSections] = useState(
    filters.reduce((acc, f) => ({ ...acc, [f.id]: true }), {})
  )

  const activeFilterCount = useMemo(() => {
    return Object.entries(values).filter(([_, v]) => {
      if (Array.isArray(v)) return v.length > 0
      return v !== null && v !== undefined
    }).length
  }, [values])

  const toggleSection = filterId => {
    setExpandedSections(prev => ({
      ...prev,
      [filterId]: !prev[filterId],
    }))
  }

  const handleFilterChange = (filterId, value) => {
    onChange({ ...values, [filterId]: value })
  }

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {showViewToggle && (
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => onViewModeChange?.('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => onViewModeChange?.('list')}
                className={`p-1.5 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          )}
          {activeFilterCount > 0 && (
            <button
              onClick={onClear}
              className="text-xs text-red-500 hover:text-red-600"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Filter Sections */}
      <div className="divide-y divide-gray-100">
        {filters.map(filter => (
          <FilterSection
            key={filter.id}
            filter={filter}
            value={values[filter.id]}
            onChange={value => handleFilterChange(filter.id, value)}
            isExpanded={expandedSections[filter.id]}
            onToggle={() => toggleSection(filter.id)}
          />
        ))}
      </div>

      {/* Active Tags */}
      {activeFilterCount > 0 && (
        <div className="p-3 bg-gray-50 border-t">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Tag className="w-3 h-3" />
            Active Filters
          </div>
          <div className="flex flex-wrap gap-1">
            {Object.entries(values).map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0))
                return null
              const filter = filters.find(f => f.id === key)
              if (!filter) return null

              const displayValue = Array.isArray(value)
                ? value.join(', ')
                : filter.options?.find(o => o.value === value)?.label || value

              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs"
                >
                  {filter.label}: {displayValue}
                  <X
                    className="w-3 h-3 cursor-pointer hover:text-primary/70"
                    onClick={() =>
                      handleFilterChange(
                        key,
                        filter.type === FILTER_TYPES.checkbox ? [] : null
                      )
                    }
                  />
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export { FILTER_TYPES }
