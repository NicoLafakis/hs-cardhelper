/**
 * Analytics React Hooks
 * Frontend integration for analytics and metrics
 */

import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'

const API_BASE = '/api/analytics'

/**
 * Hook for tracking events
 */
export function useAnalyticsTracking() {
  const trackEvent = useCallback(async (cardId, eventType, metadata = {}) => {
    try {
      await axios.post(`${API_BASE}/track-event`, {
        cardId,
        eventType,
        metadata
      })
      return { success: true }
    } catch (err) {
      console.error('Track event failed:', err)
      throw err
    }
  }, [])

  const trackComponent = useCallback(async (cardId, componentType, count = 1) => {
    try {
      await axios.post(`${API_BASE}/track-component`, {
        cardId,
        componentType,
        count
      })
      return { success: true }
    } catch (err) {
      console.error('Track component failed:', err)
      throw err
    }
  }, [])

  const trackPerformance = useCallback(async (cardId, renderTime, componentCount, fieldCount) => {
    try {
      await axios.post(`${API_BASE}/track-performance`, {
        cardId,
        renderTime,
        componentCount,
        fieldCount
      })
      return { success: true }
    } catch (err) {
      console.error('Track performance failed:', err)
      throw err
    }
  }, [])

  return { trackEvent, trackComponent, trackPerformance }
}

/**
 * Hook for fetching card metrics
 */
export function useCardMetrics(cardId, timeRange = '7d') {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE}/card/${cardId}`, {
        params: { timeRange }
      })
      setMetrics(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch metrics')
      console.error('Fetch metrics error:', err)
    } finally {
      setLoading(false)
    }
  }, [cardId, timeRange])

  useEffect(() => {
    if (cardId) {
      fetchMetrics()
    }
  }, [cardId, timeRange, fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}

/**
 * Hook for fetching user metrics
 */
export function useUserMetrics(userId, timeRange = '7d') {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE}/user/${userId}`, {
        params: { timeRange }
      })
      setMetrics(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user metrics')
      console.error('Fetch user metrics error:', err)
    } finally {
      setLoading(false)
    }
  }, [userId, timeRange])

  useEffect(() => {
    if (userId) {
      fetchMetrics()
    }
  }, [userId, timeRange, fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}

/**
 * Hook for component heatmap
 */
export function useComponentHeatmap(timeRange = '7d') {
  const [heatmap, setHeatmap] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchHeatmap = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE}/components`, {
        params: { timeRange }
      })
      setHeatmap(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch heatmap')
      console.error('Fetch heatmap error:', err)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchHeatmap()
  }, [timeRange, fetchHeatmap])

  return { heatmap, loading, error, refetch: fetchHeatmap }
}

/**
 * Hook for trending cards
 */
export function useTrendingCards(timeRange = '7d', limit = 10) {
  const [trending, setTrending] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTrending = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE}/trending`, {
        params: { timeRange, limit }
      })
      setTrending(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trending')
      console.error('Fetch trending error:', err)
    } finally {
      setLoading(false)
    }
  }, [timeRange, limit])

  useEffect(() => {
    fetchTrending()
  }, [timeRange, limit, fetchTrending])

  return { trending, loading, error, refetch: fetchTrending }
}

/**
 * Hook for system performance
 */
export function useSystemPerformance(timeRange = '7d') {
  const [performance, setPerformance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPerformance = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE}/performance`, {
        params: { timeRange }
      })
      setPerformance(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch performance')
      console.error('Fetch performance error:', err)
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    fetchPerformance()
  }, [timeRange, fetchPerformance])

  return { performance, loading, error, refetch: fetchPerformance }
}

/**
 * Hook for A/B test comparison
 */
export function useABTestComparison(cardIdA, cardIdB, timeRange = '7d') {
  const [comparison, setComparison] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchComparison = useCallback(async () => {
    if (!cardIdA || !cardIdB) return

    setLoading(true)
    setError(null)

    try {
      const response = await axios.get(`${API_BASE}/ab-test`, {
        params: { cardIdA, cardIdB, timeRange }
      })
      setComparison(response.data.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comparison')
      console.error('Fetch comparison error:', err)
    } finally {
      setLoading(false)
    }
  }, [cardIdA, cardIdB, timeRange])

  useEffect(() => {
    fetchComparison()
  }, [cardIdA, cardIdB, timeRange, fetchComparison])

  return { comparison, loading, error, refetch: fetchComparison }
}

/**
 * Hook for analytics status
 */
export function useAnalyticsStatus() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE}/health`)
        setStatus(response.data)
      } catch (err) {
        console.error('Analytics health check failed:', err)
      } finally {
        setLoading(false)
      }
    }

    checkStatus()
  }, [])

  return { status, loading }
}
