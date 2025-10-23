/**
 * Smart Builder React Hooks
 * Frontend integration for AI-powered card generation
 */

import { useState, useCallback } from 'react'
import axios from 'axios'

const API_BASE = '/api/smart-builder'

/**
 * Hook for generating card layout from description
 */
export function useGenerateLayout() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [layout, setLayout] = useState(null)
  const [tokensUsed, setTokensUsed] = useState(0)

  const generate = useCallback(async (description) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE}/generate-layout`, {
        description
      })

      setLayout(response.data.layout)
      setTokensUsed(response.data.tokensUsed)
      return response.data.layout
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to generate layout'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { generate, loading, error, layout, tokensUsed }
}

/**
 * Hook for suggesting HubSpot field mappings
 */
export function useSuggestHubSpotMappings() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mappings, setMappings] = useState([])
  const [tokensUsed, setTokensUsed] = useState(0)

  const suggest = useCallback(async (cardLayout, hubspotProperties) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE}/suggest-hubspot-mappings`, {
        cardLayout,
        hubspotProperties
      })

      setMappings(response.data.mappings)
      setTokensUsed(response.data.tokensUsed)
      return response.data.mappings
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to suggest mappings'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { suggest, loading, error, mappings, tokensUsed }
}

/**
 * Hook for getting layout improvement suggestions
 */
export function useLayoutImprovements() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [suggestions, setSuggestions] = useState(null)
  const [tokensUsed, setTokensUsed] = useState(0)

  const getSuggestions = useCallback(async (cardLayout) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE}/suggest-improvements`, {
        cardLayout
      })

      setSuggestions(response.data.suggestions)
      setTokensUsed(response.data.tokensUsed)
      return response.data.suggestions
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to get suggestions'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { getSuggestions, loading, error, suggestions, tokensUsed }
}

/**
 * Hook for suggesting components
 */
export function useSuggestComponents() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [tokensUsed, setTokensUsed] = useState(0)

  const suggest = useCallback(async (description) => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_BASE}/suggest-components`, {
        description
      })

      setRecommendations(response.data.recommendations)
      setTokensUsed(response.data.tokensUsed)
      return response.data.recommendations
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to suggest components'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { suggest, loading, error, recommendations, tokensUsed }
}

/**
 * Hook for smart builder health check
 */
export function useSmartBuilderStatus() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const check = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${API_BASE}/health`)
      setStatus(response.data)
    } catch (err) {
      setStatus({ status: 'error', message: err.message })
    } finally {
      setLoading(false)
    }
  }, [])

  return { status, loading, check }
}

export default {
  useGenerateLayout,
  useSuggestHubSpotMappings,
  useLayoutImprovements,
  useSuggestComponents,
  useSmartBuilderStatus
}
