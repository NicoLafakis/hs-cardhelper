/**
 * Premium Templates API Routes
 * REST endpoints for template management
 */

import express from 'express'
import { authMiddleware } from '../middleware/auth.js'
import database from '../utils/database.js'
import PremiumTemplatesService from '../services/PremiumTemplatesService.js'

const router = express.Router()
const templatesService = new PremiumTemplatesService(database)

/**
 * Create new template (Admin only typically)
 * POST /templates
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      componentStructure,
      thumbnailUrl,
      previewHtml,
      designTokens,
      defaultValues,
      tags,
      responsiveConfig,
      animations,
      accessibilityNotes,
      seoKeywords
    } = req.body

    if (!name || !category || !componentStructure) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const template = await templatesService.createTemplate(
      {
        name,
        description,
        category,
        thumbnailUrl,
        previewHtml,
        componentStructure,
        designTokens,
        defaultValues,
        tags,
        responsiveConfig,
        animations,
        accessibilityNotes,
        seoKeywords
      },
      req.userId
    )

    res.status(201).json({ success: true, template })
  } catch (error) {
    console.error('Create template error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get template by ID
 * GET /templates/:templateId
 */
router.get('/:templateId', async (req, res) => {
  try {
    const template = await templatesService.getTemplate(req.params.templateId)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    res.json({ success: true, template })
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get all templates with filters
 * GET /templates?category=contact&search=pro&featured=true&limit=20
 */
router.get('/', async (req, res) => {
  try {
    const {
      category = null,
      search = '',
      featured = false,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      limit = 20,
      offset = 0
    } = req.query

    const templates = await templatesService.getAllTemplates({
      category,
      search,
      isFeatured: featured === 'true',
      sortBy,
      sortOrder,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })

    res.json({ success: true, templates, count: templates.length })
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get templates by category
 * GET /templates/category/:category
 */
router.get('/category/:category', async (req, res) => {
  try {
    const { limit = 20 } = req.query
    const templates = await templatesService.getTemplatesByCategory(
      req.params.category,
      parseInt(limit)
    )
    res.json({ success: true, templates, count: templates.length })
  } catch (error) {
    console.error('Get category templates error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get featured templates
 * GET /templates/featured
 */
router.get('/featured', async (req, res) => {
  try {
    const { limit = 12 } = req.query
    const templates = await templatesService.getFeaturedTemplates(parseInt(limit))
    res.json({ success: true, templates, count: templates.length })
  } catch (error) {
    console.error('Get featured templates error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get popular templates
 * GET /templates/popular
 */
router.get('/popular', async (req, res) => {
  try {
    const { limit = 10 } = req.query
    const templates = await templatesService.getPopularTemplates(parseInt(limit))
    res.json({ success: true, templates, count: templates.length })
  } catch (error) {
    console.error('Get popular templates error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Clone template
 * POST /templates/:templateId/clone
 */
router.post('/:templateId/clone', authMiddleware, async (req, res) => {
  try {
    const { cardId, customizationData = {} } = req.body

    if (!cardId) {
      return res.status(400).json({ error: 'Card ID is required' })
    }

    const instance = await templatesService.cloneTemplate(
      req.params.templateId,
      cardId,
      req.userId,
      customizationData
    )

    res.status(201).json({ success: true, instance })
  } catch (error) {
    console.error('Clone template error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Update template instance
 * PUT /templates/instances/:instanceId
 */
router.put('/instances/:instanceId', authMiddleware, async (req, res) => {
  try {
    const { customizationData } = req.body

    const instance = await templatesService.updateTemplateInstance(
      req.params.instanceId,
      customizationData
    )

    res.json({ success: true, instance })
  } catch (error) {
    console.error('Update instance error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Rate template
 * POST /templates/:templateId/rate
 */
router.post('/:templateId/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, reviewText = '' } = req.body

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' })
    }

    const ratingRecord = await templatesService.rateTemplate(
      req.params.templateId,
      req.userId,
      rating,
      reviewText
    )

    res.json({ success: true, rating: ratingRecord })
  } catch (error) {
    console.error('Rate template error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get template ratings
 * GET /templates/:templateId/ratings
 */
router.get('/:templateId/ratings', async (req, res) => {
  try {
    const ratings = await templatesService.getTemplateRatings(req.params.templateId)
    res.json({ success: true, ratings, count: ratings.length })
  } catch (error) {
    console.error('Get ratings error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Create template version
 * POST /templates/:templateId/versions
 */
router.post('/:templateId/versions', authMiddleware, async (req, res) => {
  try {
    const { componentStructure, changesSummary } = req.body

    if (!componentStructure) {
      return res.status(400).json({ error: 'Component structure is required' })
    }

    const version = await templatesService.createTemplateVersion(
      req.params.templateId,
      componentStructure,
      changesSummary,
      req.userId
    )

    res.status(201).json({ success: true, version })
  } catch (error) {
    console.error('Create version error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Get template versions
 * GET /templates/:templateId/versions
 */
router.get('/:templateId/versions', async (req, res) => {
  try {
    const versions = await templatesService.getTemplateVersions(req.params.templateId)
    res.json({ success: true, versions, count: versions.length })
  } catch (error) {
    console.error('Get versions error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Delete template (soft delete)
 * DELETE /templates/:templateId
 */
router.delete('/:templateId', authMiddleware, async (req, res) => {
  try {
    const result = await templatesService.deleteTemplate(req.params.templateId)
    res.json({ success: true, ...result })
  } catch (error) {
    console.error('Delete template error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Publish template instance
 * POST /templates/instances/:instanceId/publish
 */
router.post('/instances/:instanceId/publish', authMiddleware, async (req, res) => {
  try {
    const result = await templatesService.publishTemplateInstance(req.params.instanceId)
    res.json({ success: true, ...result })
  } catch (error) {
    console.error('Publish instance error:', error)
    res.status(500).json({ error: error.message })
  }
})

/**
 * Health check
 * GET /health
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'premium-templates',
    endpoints: 12,
    timestamp: new Date().toISOString()
  })
})

export default router
