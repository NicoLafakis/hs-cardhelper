/**
 * @fileoverview Smart Search Bar React component
 * @module src/components/SmartSearch/SmartSearchBar
 * @license MIT
 * @author CardHelper Team
 */

/**
 * SmartSearchBar - Advanced search with filters and suggestions
 * Part of Smart Filtering & Search feature
 */

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Search,
  X,
  Filter,
  Clock,
  Star,
  ArrowRight,
  Command,
  ChevronDown,
} from 'lucide-react'

// Search result categories
const RESULT_CATEGORIES = {
  templates: {
    label: 'Templates',
    icon: '📄',
    color: 'bg-blue-100 text-blue-700',
  },
  components: {
    label: 'Components',
    icon: '🧩',
    color: 'bg-purple-100 text-purple-700',
  },
  properties: {
    label: 'Properties',
    icon: '⚙️',
    color: 'bg-green-100 text-green-700',
  },
  actions: {
    label: 'Actions',
    icon: '⚡',
    color: 'bg-orange-100 text-orange-700',
  },
  help: { label: 'Help', icon: '❓', color: 'bg-gray-100 text-gray-700' },
}

// Quick actions
const QUICK_ACTIONS = [
  {
    id: 'new-card',
    label: 'Create New Card',
    shortcut: 'Ctrl+N',
    category: 'actions',
  },
  { id: 'save', label: 'Save Card', shortcut: 'Ctrl+S', category: 'actions' },
  {
    id: 'preview',
    label: 'Preview Card',
    shortcut: 'Ctrl+P',
    category: 'actions',
  },
  {
    id: 'export',
    label: 'Export Card',
    shortcut: 'Ctrl+E',
    category: 'actions',
  },
  { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', category: 'actions' },
  { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', category: 'actions' },
]

export default function SmartSearchBar({
  searchData = [],
  onSelect,
  onSearch,
  placeholder = 'Search templates, components, properties...',
  showRecentSearches = true,
  showQuickActions = true,
  recentSearches = [],
  onRecentSearchUpdate,
}) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilters, setActiveFilters] = useState({
    categories: [],
    dateRange: null,
    rating: null,
  })

  const inputRef = useRef(null)
  const containerRef = useRef(null)

  // Filter and search results
  const results = useMemo(() => {
    if (!query.trim()) {
      if (showQuickActions) {
        return QUICK_ACTIONS.map(action => ({
          ...action,
          type: 'action',
        }))
      }
      return []
    }

    const lowerQuery = query.toLowerCase()
    const filtered = searchData.filter(item => {
      // Category filter
      if (
        activeFilters.categories.length > 0 &&
        !activeFilters.categories.includes(item.category)
      ) {
        return false
      }

      // Text search
      const searchFields = [
        item.name,
        item.description,
        item.category,
        ...(item.tags || []),
      ].filter(Boolean)

      return searchFields.some(field =>
        field.toLowerCase().includes(lowerQuery)
      )
    })

    // Group by category
    const grouped = filtered.reduce((acc, item) => {
      const category = item.category || 'other'
      if (!acc[category]) acc[category] = []
      acc[category].push(item)
      return acc
    }, {})

    // Flatten with category headers
    const flatResults = []
    Object.entries(grouped).forEach(([category, items]) => {
      flatResults.push({ type: 'header', category })
      items.forEach(item => flatResults.push({ ...item, type: 'result' }))
    })

    return flatResults
  }, [query, searchData, activeFilters, showQuickActions])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    e => {
      const selectableResults = results.filter(r => r.type !== 'header')

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev < selectableResults.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev =>
            prev > 0 ? prev - 1 : selectableResults.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && selectableResults[selectedIndex]) {
            handleSelect(selectableResults[selectedIndex])
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
        default:
          break
      }
    },
    [results, selectedIndex]
  )

  const handleSelect = item => {
    // Add to recent searches
    if (query.trim() && onRecentSearchUpdate) {
      const newRecent = [
        query,
        ...recentSearches.filter(s => s !== query),
      ].slice(0, 5)
      onRecentSearchUpdate(newRecent)
    }

    onSelect?.(item)
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
  }

  const handleFilterToggle = category => {
    setActiveFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }))
  }

  const clearFilters = () => {
    setActiveFilters({ categories: [], dateRange: null, rating: null })
  }

  const hasActiveFilters =
    activeFilters.categories.length > 0 ||
    activeFilters.dateRange ||
    activeFilters.rating

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div
        className={`relative flex items-center bg-white border-2 rounded-xl transition-all
        ${isOpen ? 'border-primary shadow-lg ring-4 ring-primary/10' : 'border-gray-200'}
      `}
      >
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
            onSearch?.(e.target.value)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-12 pr-24 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none"
        />
        <div className="absolute right-3 flex items-center gap-2">
          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1.5 rounded-lg transition-colors ${
              hasActiveFilters
                ? 'bg-primary/10 text-primary'
                : 'hover:bg-gray-100 text-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
          </button>
          <div className="text-xs text-gray-300 font-mono hidden sm:flex items-center gap-1">
            <Command className="w-3 h-3" />K
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="absolute z-50 w-full mt-2 p-4 bg-white border-2 border-gray-200 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-gray-700">
              Filter by Category
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(RESULT_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => handleFilterToggle(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeFilters.categories.includes(key)
                    ? cat.color
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {/* Recent Searches */}
          {!query && showRecentSearches && recentSearches.length > 0 && (
            <div className="p-3 border-b">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(search)
                      onSearch?.(search)
                    }}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              results.map((item, index) => {
                if (item.type === 'header') {
                  const categoryInfo = RESULT_CATEGORIES[item.category] || {
                    label: item.category,
                    icon: '📁',
                  }
                  return (
                    <div
                      key={`header-${item.category}`}
                      className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 flex items-center gap-2"
                    >
                      <span>{categoryInfo.icon}</span>
                      {categoryInfo.label}
                    </div>
                  )
                }

                const resultIndex = results
                  .filter(r => r.type !== 'header')
                  .indexOf(item)
                const isSelected = resultIndex === selectedIndex

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={`px-4 py-3 cursor-pointer flex items-center gap-3 ${
                      isSelected ? 'bg-primary/10' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {item.name || item.label}
                      </div>
                      {item.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.shortcut && (
                      <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-0.5 rounded">
                        {item.shortcut}
                      </span>
                    )}
                    {item.rating && (
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        {item.rating}
                      </div>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                )
              })
            ) : query ? (
              <div className="p-8 text-center">
                <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No results found for "{query}"</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <span className="font-mono bg-gray-200 px-1 rounded">↑</span>
                <span className="font-mono bg-gray-200 px-1 rounded">↓</span>
                to navigate
              </span>
              <span className="flex items-center gap-1">
                <span className="font-mono bg-gray-200 px-1 rounded">↵</span>
                to select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <span className="font-mono bg-gray-200 px-1 rounded">esc</span>
              to close
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export { RESULT_CATEGORIES, QUICK_ACTIONS }
