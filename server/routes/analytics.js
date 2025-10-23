/**
 * Analytics Routes
 * API endpoints for metrics, tracking, and performance data
 */

import express from 'express'
import AnalyticsService from '../services/AnalyticsService.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

/**
 * Track an event
 * POST /api/analytics/track-event
 */
router.post('/track-event', authenticateToken, async (req, res) => {
  try {
    const { cardId, eventType, metadata } = req.body
    const userId = req.user?.id

    // Validation
    if (!cardId || !eventType) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'cardId and eventType are required'
      })
    }

    if (!['view', 'edit', 'create', 'delete', 'share'].includes(eventType)) {
      return res.status(400).json({
        error: 'INVALID_EVENT_TYPE',
        message: 'Invalid event type'
      })
    }

    const result = await AnalyticsService.trackCardEvent(
      cardId,
      userId,
      eventType,
      metadata || {}
    )

    res.json({
      success: true,
      event: result.event
    })
  } catch (err) {
    console.error('Track event error:', err)
    res.status(500).json({
      error: 'TRACKING_FAILED',
      message: 'Failed to track event'
    })
  }
})

/**
 * Track component usage
 * POST /api/analytics/track-component
 */
router.post('/track-component', authenticateToken, async (req, res) => {
  try {
    const { cardId, componentType, count } = req.body

    if (!cardId || !componentType) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'cardId and componentType are required'
      })
    }

    await AnalyticsService.trackComponentUsage(cardId, componentType, count || 1)

    res.json({ success: true })
  } catch (err) {
    console.error('Track component error:', err)
    res.status(500).json({
      error: 'TRACKING_FAILED',
      message: 'Failed to track component'
    })
  }
})

/**
 * Track performance metric
 * POST /api/analytics/track-performance
 */
router.post('/track-performance', authenticateToken, async (req, res) => {
  try {
    const { cardId, renderTime, componentCount, fieldCount } = req.body

    if (!cardId || renderTime === undefined) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'cardId and renderTime are required'
      })
    }

    await AnalyticsService.trackPerformanceMetric(
      cardId,
      renderTime,
      componentCount || 0,
      fieldCount || 0
    )

    res.json({ success: true })
  } catch (err) {
    console.error('Track performance error:', err)
    res.status(500).json({
      error: 'TRACKING_FAILED',
      message: 'Failed to track performance'
    })
  }
})

/**
 * Get card metrics
 * GET /api/analytics/card/:cardId?timeRange=7d
 */
router.get('/card/:cardId', authenticateToken, async (req, res) => {
  try {
    const { cardId } = req.params
    const { timeRange } = req.query

    const metrics = await AnalyticsService.getCardMetrics(cardId, timeRange || '7d')

    res.json({
      success: true,
      data: metrics
    })
  } catch (err) {
    console.error('Get card metrics error:', err)
    res.status(500).json({
      error: 'FETCH_FAILED',
      message: 'Failed to fetch card metrics'
    })
  }
})

/**
 * Get user metrics
 * GET /api/analytics/user/:userId?timeRange=7d
 */
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params
    const { timeRange } = req.query

    // User can only see their own metrics
    if (req.user?.id !== userId) {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: 'Cannot access other user metrics'
      })
    }

    const metrics = await AnalyticsService.getUserMetrics(userId, timeRange || '7d')

    res.json({
      success: true,
      data: metrics
    })
  } catch (err) {
    console.error('Get user metrics error:', err)
    res.status(500).json({
      error: 'FETCH_FAILED',
      message: 'Failed to fetch user metrics'
    })
  }
})

/**
 * Get component heatmap
 * GET /api/analytics/components?timeRange=7d
 */
router.get('/components', authenticateToken, async (req, res) => {
  try {
    const { timeRange } = req.query

    const heatmap = await AnalyticsService.getComponentHeatmap(timeRange || '7d')

    res.json({
      success: true,
      data: heatmap
    })
  } catch (err) {
    console.error('Get component heatmap error:', err)
    res.status(500).json({
      error: 'FETCH_FAILED',
      message: 'Failed to fetch component heatmap'
    })
  }
})

/**
 * Get trending cards
 * GET /api/analytics/trending?timeRange=7d&limit=10
 */
router.get('/trending', authenticateToken, async (req, res) => {
  try {
    const { timeRange, limit } = req.query

    const trending = await AnalyticsService.getTrendingCards(
      timeRange || '7d',
      parseInt(limit) || 10
    )

    res.json({
      success: true,
      data: trending
    })
  } catch (err) {
    console.error('Get trending error:', err)
    res.status(500).json({
      error: 'FETCH_FAILED',
      message: 'Failed to fetch trending cards'
    })
  }
})

/**
 * Get system performance
 * GET /api/analytics/performance?timeRange=7d
 */
router.get('/performance', authenticateToken, async (req, res) => {
  try {
    const { timeRange } = req.query

    const performance = await AnalyticsService.getSystemPerformance(timeRange || '7d')

    res.json({
      success: true,
      data: performance
    })
  } catch (err) {
    console.error('Get performance error:', err)
    res.status(500).json({
      error: 'FETCH_FAILED',
      message: 'Failed to fetch system performance'
    })
  }
})

/**
 * Compare A/B test
 * GET /api/analytics/ab-test?cardIdA=xxx&cardIdB=yyy&timeRange=7d
 */
router.get('/ab-test', authenticateToken, async (req, res) => {
  try {
    const { cardIdA, cardIdB, timeRange } = req.query

    if (!cardIdA || !cardIdB) {
      return res.status(400).json({
        error: 'INVALID_REQUEST',
        message: 'cardIdA and cardIdB are required'
      })
    }

    const comparison = await AnalyticsService.compareABTest(
      cardIdA,
      cardIdB,
      timeRange || '7d'
    )

    res.json({
      success: true,
      data: comparison
    })
  } catch (err) {
    console.error('A/B test error:', err)
    res.status(500).json({
      error: 'COMPARISON_FAILED',
      message: 'Failed to compare cards'
    })
  }
})

/**
 * Health check
 * GET /api/analytics/health
 */
router.get('/health', async (req, res) => {
  res.json({
    service: 'Analytics',
    status: 'operational',
    capabilities: [
      'Event tracking',
      'Component usage',
      'Performance metrics',
      'Card engagement',
      'User analytics',
      'Component heatmap',
      'Trending analysis',
      'A/B testing',
      'System performance'
    ],
    timestamp: new Date()
  })
})

export default router
