/**
 * Premium Templates React Hooks
 * Custom hooks for template operations
 */

import { useState, useCallback, useEffect, useRef } from 'react'
import api from '../api/api.js'

/**
 * Main hook for premium template operations
 * Handles CRUD, filtering, searching, and pagination
 */
export const usePremiumTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({ limit: 20, offset: 0 })
  const [filters, setFilters] = useState({ category: null, search: '', featured: false })

  const fetchTemplates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        limit: pagination.limit,
        offset: pagination.offset,
        ...filters,
        featured: filters.featured ? 'true' : 'false'
      })

      const response = await api.get(`/api/templates?${params}`)
      setTemplates(response.data.templates)
    } catch (err) {
      setError(err.message)
      console.error('Fetch templates error:', err)
    } finally {
      setLoading(false)
    }
  }, [pagination, filters])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const setCategory = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }))
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }, [])

  const setSearch = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search }))
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }, [])

  const setFeatured = useCallback((featured) => {
    setFilters((prev) => ({ ...prev, featured }))
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }, [])

  const nextPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
  }, [])

  const previousPage = useCallback(() => {
    setPagination((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit)
    }))
  }, [])

  return {
    templates,
    loading,
    error,
    pagination,
    setCategory,
    setSearch,
    setFeatured,
    nextPage,
    previousPage,
    refresh: fetchTemplates
  }
}

/**
 * Hook for cloning templates
 * Handles clone operation with loading and error states
 */
export const useTemplateClone = () => {
  const [cloning, setCloning] = useState(false)
  const [error, setError] = useState(null)
  const [clonedInstance, setClonedInstance] = useState(null)

  const cloneTemplate = useCallback(async (templateId, cardId, customizationData = {}) => {
    setCloning(true)
    setError(null)
    try {
      const response = await api.post(`/api/templates/${templateId}/clone`, {
        cardId,
        customizationData
      })
      setClonedInstance(response.data.instance)
      return response.data.instance
    } catch (err) {
      setError(err.message)
      console.error('Clone template error:', err)
      throw err
    } finally {
      setCloning(false)
    }
  }, [])

  return {
    cloning,
    error,
    clonedInstance,
    cloneTemplate
  }
}

/**
 * Hook for rating templates
 * Handles rating submission and review
 */
export const useTemplateRating = (templateId) => {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const submitRating = useCallback(async () => {
    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      await api.post(`/api/templates/${templateId}/rate`, {
        rating,
        reviewText: review
      })
      setSuccess(true)
      setRating(0)
      setReview('')
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message)
      console.error('Rating submission error:', err)
    } finally {
      setSubmitting(false)
    }
  }, [templateId, rating, review])

  return {
    rating,
    setRating,
    review,
    setReview,
    submitting,
    error,
    success,
    submitRating
  }
}

/**
 * Hook for template search with debouncing
 * Prevents excessive API calls during typing
 */
export const useTemplateSearch = (delay = 500) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(null)
  const debounceTimer = useRef(null)

  const performSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearching(true)
    setError(null)

    try {
      const response = await api.get(`/api/templates?search=${encodeURIComponent(query)}`)
      setSearchResults(response.data.templates)
    } catch (err) {
      setError(err.message)
      console.error('Search error:', err)
    } finally {
      setSearching(false)
    }
  }, [])

  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query)

      // Clear existing timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }

      // Set new timer
      debounceTimer.current = setTimeout(() => {
        performSearch(query)
      }, delay)
    },
    [performSearch, delay]
  )

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  return {
    searchQuery,
    handleSearch,
    searchResults,
    searching,
    error
  }
}

/**
 * Hook for popular templates
 * Fetches trending/popular templates
 */
export const usePopularTemplates = (limit = 10) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/api/templates/popular?limit=${limit}`)
        setTemplates(response.data.templates)
      } catch (err) {
        setError(err.message)
        console.error('Fetch popular templates error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPopular()
  }, [limit])

  return { templates, loading, error }
}

/**
 * Hook for featured templates
 * Fetches curated/featured templates
 */
export const useFeaturedTemplates = (limit = 12) => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeatured = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/api/templates/featured?limit=${limit}`)
        setTemplates(response.data.templates)
      } catch (err) {
        setError(err.message)
        console.error('Fetch featured templates error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeatured()
  }, [limit])

  return { templates, loading, error }
}

/**
 * Hook for template preview
 * Generates and manages template preview
 */
export const useTemplatePreview = (templateId) => {
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPreview = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get(`/api/templates/${templateId}`)
        const template = response.data.template
        setPreview({
          html: template.previewHtml,
          structure: template.componentStructure,
          tokens: template.designTokens,
          defaults: template.defaultValues
        })
      } catch (err) {
        setError(err.message)
        console.error('Preview fetch error:', err)
      } finally {
        setLoading(false)
      }
    }

    if (templateId) {
      fetchPreview()
    }
  }, [templateId])

  return { preview, loading, error }
}

/**
 * Hook for template instances
 * Manages user's cloned templates and customizations
 */
export const useTemplateInstances = () => {
  const [instances, setInstances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const updateInstance = useCallback(async (instanceId, customizationData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.put(`/api/templates/instances/${instanceId}`, {
        customizationData
      })
      setInstances((prev) =>
        prev.map((inst) => (inst.id === instanceId ? response.data.instance : inst))
      )
      return response.data.instance
    } catch (err) {
      setError(err.message)
      console.error('Update instance error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const publishInstance = useCallback(async (instanceId) => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.post(`/api/templates/instances/${instanceId}/publish`)
      return response.data
    } catch (err) {
      setError(err.message)
      console.error('Publish instance error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    instances,
    loading,
    error,
    updateInstance,
    publishInstance
  }
}
