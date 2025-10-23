/**
 * Smart Builder API Routes
 * AI-powered card generation and layout optimization
 */

import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
  generateCardLayoutFromDescription,
  suggestHubSpotMappings,
  suggestLayoutImprovements,
  suggestComponents
} from '../services/SmartBuilder.js'

const router = express.Router()

/**
 * POST /api/smart-builder/generate-layout
 * Generate card layout from natural language description
 */
router.post('/generate-layout', authenticateToken, async (req, res) => {
  try {
    const { description } = req.body

    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        error: 'Description is required and must be a string'
      })
    }

    if (description.length < 10) {
      return res.status(400).json({
        error: 'Description must be at least 10 characters'
      })
    }

    if (description.length > 1000) {
      return res.status(400).json({
        error: 'Description must be less than 1000 characters'
      })
    }

    const result = await generateCardLayoutFromDescription(description, req.user.id)

    res.json({
      success: true,
      layout: result.layout,
      provider: result.provider,
      tokensUsed: result.tokensUsed
    })
  } catch (error) {
    console.error('Generate layout error:', error)
    res.status(500).json({
      error: 'Failed to generate layout',
      message: error.message
    })
  }
})

/**
 * POST /api/smart-builder/suggest-hubspot-mappings
 * Suggest HubSpot field mappings for card fields
 */
router.post('/suggest-hubspot-mappings', authenticateToken, async (req, res) => {
  try {
    const { cardLayout, hubspotProperties } = req.body

    if (!cardLayout || !cardLayout.fields) {
      return res.status(400).json({
        error: 'Card layout with fields is required'
      })
    }

    const properties = hubspotProperties || []

    const result = await suggestHubSpotMappings(cardLayout, properties)

    res.json({
      success: true,
      mappings: result.mappings,
      provider: result.provider,
      tokensUsed: result.tokensUsed
    })
  } catch (error) {
    console.error('HubSpot mappings error:', error)
    res.status(500).json({
      error: 'Failed to generate HubSpot mappings',
      message: error.message
    })
  }
})

/**
 * POST /api/smart-builder/suggest-improvements
 * Get suggestions for layout improvements
 */
router.post('/suggest-improvements', authenticateToken, async (req, res) => {
  try {
    const { cardLayout } = req.body

    if (!cardLayout) {
      return res.status(400).json({
        error: 'Card layout is required'
      })
    }

    const result = await suggestLayoutImprovements(cardLayout)

    res.json({
      success: true,
      suggestions: result.suggestions,
      provider: result.provider,
      tokensUsed: result.tokensUsed
    })
  } catch (error) {
    console.error('Layout improvements error:', error)
    res.status(500).json({
      error: 'Failed to generate improvement suggestions',
      message: error.message
    })
  }
})

/**
 * POST /api/smart-builder/suggest-components
 * Get component recommendations for card
 */
router.post('/suggest-components', authenticateToken, async (req, res) => {
  try {
    const { description } = req.body

    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        error: 'Description is required and must be a string'
      })
    }

    const result = await suggestComponents(description)

    res.json({
      success: true,
      recommendations: result.recommendations,
      provider: result.provider,
      tokensUsed: result.tokensUsed
    })
  } catch (error) {
    console.error('Component suggestions error:', error)
    res.status(500).json({
      error: 'Failed to generate component suggestions',
      message: error.message
    })
  }
})

/**
 * GET /api/smart-builder/health
 * Check smart builder service status
 */
router.get('/health', (req, res) => {
  const claudeKey = process.env.CLAUDE_API_KEY
  const status = claudeKey ? 'ready' : 'not-configured'

  res.json({
    service: 'Smart Builder',
    status,
    model: 'claude-haiku-4-5-20251001',
    capabilities: [
      'generate-layout',
      'suggest-hubspot-mappings',
      'suggest-improvements',
      'suggest-components'
    ]
  })
})

export default router
