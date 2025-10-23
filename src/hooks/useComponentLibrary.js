/**
 * Component Library React Hooks
 * Hooks for managing component creation, usage, and manipulation
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { componentAPI } from '../api/api'

/**
 * useComponentLibrary - Main hook for component library operations
 */
export function useComponentLibrary() {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const cache = useRef(new Map())

  const fetchComponents = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const cacheKey = JSON.stringify(filters)
      if (cache.current.has(cacheKey)) {
        setComponents(cache.current.get(cacheKey))
        return
      }

      const response = await componentAPI.getComponents(filters)
      cache.current.set(cacheKey, response)
      setComponents(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const getComponent = useCallback(async (componentId) => {
    try {
      return await componentAPI.getComponent(componentId)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const createComponent = useCallback(async (componentData) => {
    setLoading(true)
    setError(null)

    try {
      const newComponent = await componentAPI.createComponent(componentData)
      cache.current.clear()
      return newComponent
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    components,
    loading,
    error,
    fetchComponents,
    getComponent,
    createComponent
  }
}

/**
 * useComponentInstance - Hook for managing component instances on cards
 */
export function useComponentInstance(cardId) {
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchCardComponents = useCallback(async () => {
    if (!cardId) return

    setLoading(true)
    setError(null)

    try {
      const response = await componentAPI.getCardComponents(cardId)
      setInstances(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [cardId])

  const addComponent = useCallback(async (componentId, props = {}) => {
    try {
      const instance = await componentAPI.createComponentInstance(cardId, componentId, props)
      setInstances(prev => [...prev, instance])
      return instance
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [cardId])

  const updateComponent = useCallback(async (instanceId, updates) => {
    try {
      await componentAPI.updateComponentInstance(instanceId, updates)
      setInstances(prev =>
        prev.map(inst =>
          inst.id === instanceId
            ? { ...inst, ...updates }
            : inst
        )
      )
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const deleteComponent = useCallback(async (instanceId) => {
    try {
      await componentAPI.deleteComponentInstance(instanceId)
      setInstances(prev => prev.filter(inst => inst.id !== instanceId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  // Fetch on mount
  useEffect(() => {
    fetchCardComponents()
  }, [fetchCardComponents])

  return {
    instances,
    loading,
    error,
    fetchCardComponents,
    addComponent,
    updateComponent,
    deleteComponent
  }
}

/**
 * useComponentSearch - Hook for searching components
 */
export function useComponentSearch() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const debounceTimer = useRef(null)

  const search = useCallback((searchQuery, type = null, category = null) => {
    setQuery(searchQuery)
    setLoading(true)

    // Debounce search
    clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(async () => {
      try {
        const response = await componentAPI.getComponents({
          search: searchQuery,
          type,
          category
        })
        setResults(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }, 300)
  }, [])

  return {
    query,
    results,
    loading,
    error,
    search
  }
}

/**
 * useComponentAnalytics - Hook for component usage analytics
 */
export function useComponentAnalytics(componentId) {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    if (!componentId) return

    setLoading(true)
    setError(null)

    try {
      const response = await componentAPI.getComponentAnalytics(componentId)
      setAnalytics(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [componentId])

  const trackUsage = useCallback(async (cardId) => {
    try {
      await componentAPI.trackComponentUsage(componentId, cardId)
    } catch (err) {
      setError(err.message)
    }
  }, [componentId])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  return {
    analytics,
    loading,
    error,
    fetchAnalytics,
    trackUsage
  }
}

/**
 * usePopularComponents - Hook for getting most popular components
 */
export function usePopularComponents(limit = 10) {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await componentAPI.getPopularComponents(limit)
        setComponents(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPopular()
  }, [limit])

  return { components, loading, error }
}

/**
 * useComponentMarketplace - Hook for marketplace operations
 */
export function useComponentMarketplace() {
  const [components, setComponents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination] = useState({ total: 0, offset: 0, limit: 20 })

  const fetchMarketplace = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const response = await componentAPI.getMarketplaceComponents(filters)
      setComponents(response)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const publishComponent = useCallback(async (componentId, marketplaceData) => {
    try {
      const result = await componentAPI.publishComponentToMarketplace(
        componentId,
        marketplaceData
      )
      return result
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    components,
    loading,
    error,
    pagination,
    fetchMarketplace,
    publishComponent
  }
}

/**
 * useComponentFilters - Hook for managing component filtering UI
 */
export function useComponentFilters() {
  const [filters, setFilters] = useState({
    type: null,
    category: null,
    search: ''
  })

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const clearFilters = useCallback(() => {
    setFilters({
      type: null,
      category: null,
      search: ''
    })
  }, [])

  return {
    filters,
    updateFilter,
    clearFilters
  }
}

/**
 * useComponentPreview - Hook for component preview rendering
 */
export function useComponentPreview(component) {
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!component) {
      setPreview(null)
      return
    }

    try {
      // Generate preview based on component type
      const previewData = {
        component_id: component.component_id,
        name: component.name,
        type: component.type,
        props: component.defaultProps,
        accessibility: component.accessibility,
        responsiveConfig: component.responsiveConfig
      }
      setPreview(previewData)
    } catch (err) {
      setError(err.message)
    }
  }, [component])

  return { preview, error }
}

/**
 * useComponentValidation - Hook for component prop validation
 */
export function useComponentValidation(component) {
  const [validationErrors, setValidationErrors] = useState({})

  const validate = useCallback((props) => {
    const errors = {}

    for (const [key, rule] of Object.entries(component.validation || {})) {
      const value = props[key]

      if (rule.required && value === undefined) {
        errors[key] = `${key} is required`
      }

      if (rule.type && value !== undefined && typeof value !== rule.type) {
        errors[key] = `${key} must be of type ${rule.type}`
      }

      if (rule.enum && value !== undefined && !rule.enum.includes(value)) {
        errors[key] = `${key} must be one of: ${rule.enum.join(', ')}`
      }

      if (rule.minLength && value?.length < rule.minLength) {
        errors[key] = `${key} must have minimum length ${rule.minLength}`
      }

      if (rule.maxLength && value?.length > rule.maxLength) {
        errors[key] = `${key} must have maximum length ${rule.maxLength}`
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [component.validation])

  return {
    validationErrors,
    validate,
    isValid: Object.keys(validationErrors).length === 0
  }
}

export default useComponentLibrary
