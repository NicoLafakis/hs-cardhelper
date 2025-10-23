/**
 * Component Library API Routes
 * Endpoints for managing components, instances, analytics, and marketplace
 */

import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import ComponentLibraryService from '../services/ComponentLibraryService.js'
import pool from '../utils/database.js'

const router = express.Router()
const componentLibraryService = new ComponentLibraryService(pool)

// ============================================================
// Component Management Endpoints
// ============================================================

/**
 * POST /api/component-library/components
 * Create a new component
 */
router.post('/components', authMiddleware, async (req, res) => {
  try {
    const component = await componentLibraryService.createComponent(req.body, req.user.id)
    res.json({ success: true, component })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * GET /api/component-library/components/:componentId
 * Get component by ID
 */
router.get('/components/:componentId', async (req, res) => {
  try {
    const component = await componentLibraryService.getComponent(req.params.componentId)
    res.json(component)
  } catch (error) {
    res.status(404).json({ error: error.message })
  }
})

/**
 * GET /api/component-library/components
 * Get all components with optional filters
 */
router.get('/components', async (req, res) => {
  try {
    // Service initialized at module level
    const filters = {
      type: req.query.type,
      category: req.query.category,
      search: req.query.search
    }
    const components = await componentLibraryService.getAllComponents(filters)
    res.json(components)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * GET /api/component-library/components/type/:type
 * Get components by type
 */
router.get('/components/type/:type', async (req, res) => {
  try {
    // Service initialized at module level
    const components = await componentLibraryService.getComponentsByType(req.params.type)
    res.json(components)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * GET /api/component-library/components/category/:category
 * Get components by category
 */
router.get('/components/category/:category', async (req, res) => {
  try {
    // Service initialized at module level
    const components = await componentLibraryService.getComponentsByCategory(req.params.category)
    res.json(components)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * GET /api/component-library/popular
 * Get most popular components
 */
router.get('/popular', async (req, res) => {
  try {
    // Service initialized at module level
    const limit = req.query.limit || 10
    const components = await componentLibraryService.getPopularComponents(limit)
    res.json(components)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============================================================
// Component Instance Endpoints
// ============================================================

/**
 * POST /api/component-library/instances
 * Create component instance on a card
 */
router.post('/instances', authMiddleware, async (req, res) => {
  try {
    // Service initialized at module level
    const { cardId, componentId, props } = req.body

    if (!cardId || !componentId) {
      return res.status(400).json({ error: 'cardId and componentId are required' })
    }

    const instance = await componentLibraryService.createComponentInstance(cardId, componentId, props)
    res.json({ success: true, instance })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * GET /api/component-library/instances/card/:cardId
 * Get all component instances for a card
 */
router.get('/instances/card/:cardId', async (req, res) => {
  try {
    // Service initialized at module level
    const instances = await componentLibraryService.getCardComponents(req.params.cardId)
    res.json(instances)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * PUT /api/component-library/instances/:instanceId
 * Update component instance
 */
router.put('/instances/:instanceId', authMiddleware, async (req, res) => {
  try {
    // Service initialized at module level
    const result = await componentLibraryService.updateComponentInstance(req.params.instanceId, req.body)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * DELETE /api/component-library/instances/:instanceId
 * Delete component instance
 */
router.delete('/instances/:instanceId', authMiddleware, async (req, res) => {
  try {
    // Service initialized at module level
    const result = await componentLibraryService.deleteComponentInstance(req.params.instanceId)
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============================================================
// Analytics Endpoints
// ============================================================

/**
 * GET /api/component-library/analytics/:componentId
 * Get component usage analytics
 */
router.get('/analytics/:componentId', async (req, res) => {
  try {
    // Service initialized at module level
    const analytics = await componentLibraryService.getComponentAnalytics(req.params.componentId)
    res.json(analytics)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * POST /api/component-library/track-usage
 * Track component usage
 */
router.post('/track-usage', authMiddleware, async (req, res) => {
  try {
    // Service initialized at module level
    const { componentId, cardId } = req.body
    await componentLibraryService.trackComponentUsage(componentId, cardId, req.user.id)
    res.json({ success: true })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============================================================
// Marketplace Endpoints
// ============================================================

/**
 * GET /api/component-library/marketplace
 * Get marketplace components
 */
router.get('/marketplace', async (req, res) => {
  try {
    // Service initialized at module level
    const filters = {
      search: req.query.search,
      sort: req.query.sort,
      limit: req.query.limit,
      offset: req.query.offset
    }
    const components = await componentLibraryService.getMarketplaceComponents(filters)
    res.json(components)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

/**
 * POST /api/component-library/marketplace/publish
 * Publish component to marketplace
 */
router.post('/marketplace/publish', authMiddleware, async (req, res) => {
  try {
    // Service initialized at module level
    const result = await componentLibraryService.publishComponentToMarketplace(
      req.body.componentId,
      req.body.marketplaceData,
      req.user.id
    )
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============================================================
// Versioning Endpoints
// ============================================================

/**
 * POST /api/component-library/versions
 * Create component version
 */
router.post('/versions', authMiddleware, async (req, res) => {
  try {
    // Service initialized at module level
    const result = await componentLibraryService.createComponentVersion(
      req.body.componentId,
      req.body.versionData,
      req.user.id
    )
    res.json(result)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

// ============================================================
// Health Check
// ============================================================

/**
 * GET /api/component-library/health
 * Health check endpoint
 */
router.get('/health', async (req, res) => {
  try {
    // Service initialized at module level
    res.json({
      status: 'healthy',
      message: 'Component Library service is running',
      timestamp: new Date()
    })
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message })
  }
})

export default router
