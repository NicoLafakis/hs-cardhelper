/**
 * Data Bindings Routes
 * API endpoints for managing and evaluating data bindings
 */

import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import DataBindingsService from '../services/DataBindingsService.js'

const router = express.Router()

// Middleware: Require authentication for all routes
router.use(authenticateToken)

/**
 * POST /api/data-bindings/create
 * Create a new data binding for a card
 */
router.post('/create', async (req, res) => {
  try {
    const { cardId, binding } = req.body

    // Validation
    if (!cardId) {
      return res.status(400).json({ error: 'Missing cardId' })
    }
    if (!binding || !binding.id || !binding.fieldId || !binding.type) {
      return res.status(400).json({ error: 'Invalid binding configuration' })
    }

    const supportedTypes = ['conditional', 'computed', 'formula', 'lookup', 'dependency']
    if (!supportedTypes.includes(binding.type)) {
      return res.status(400).json({ error: `Unsupported binding type: ${binding.type}` })
    }

    const result = await DataBindingsService.createBinding(cardId, binding)
    res.json(result)
  } catch (err) {
    console.error('Create binding error:', err)
    res.status(500).json({ error: 'Failed to create binding', message: err.message })
  }
})

/**
 * POST /api/data-bindings/evaluate
 * Evaluate a single binding with data
 */
router.post('/evaluate', async (req, res) => {
  try {
    const { cardId, bindingId, data } = req.body

    // Validation
    if (!cardId || !bindingId || !data) {
      return res.status(400).json({ error: 'Missing cardId, bindingId, or data' })
    }

    const result = await DataBindingsService.evaluateBinding(cardId, bindingId, data)
    res.json(result)
  } catch (err) {
    console.error('Evaluate binding error:', err)
    res.status(500).json({ error: 'Failed to evaluate binding', message: err.message })
  }
})

/**
 * POST /api/data-bindings/evaluate-all
 * Evaluate all bindings for a card with a data record
 */
router.post('/evaluate-all', async (req, res) => {
  try {
    const { cardId, data } = req.body

    // Validation
    if (!cardId || !data) {
      return res.status(400).json({ error: 'Missing cardId or data' })
    }

    const result = await DataBindingsService.evaluateAllBindings(cardId, data)
    res.json(result)
  } catch (err) {
    console.error('Evaluate all bindings error:', err)
    res.status(500).json({ error: 'Failed to evaluate bindings', message: err.message })
  }
})

/**
 * GET /api/data-bindings/card/:cardId
 * Get all bindings for a card
 */
router.get('/card/:cardId', async (req, res) => {
  try {
    const { cardId } = req.params

    if (!cardId) {
      return res.status(400).json({ error: 'Missing cardId' })
    }

    const result = await DataBindingsService.getCardBindings(cardId)
    res.json(result)
  } catch (err) {
    console.error('Get card bindings error:', err)
    res.status(500).json({ error: 'Failed to retrieve bindings', message: err.message })
  }
})

/**
 * PUT /api/data-bindings/update
 * Update a binding
 */
router.put('/update', async (req, res) => {
  try {
    const { cardId, bindingId, updates } = req.body

    // Validation
    if (!cardId || !bindingId || !updates) {
      return res.status(400).json({ error: 'Missing cardId, bindingId, or updates' })
    }

    const result = await DataBindingsService.updateBinding(cardId, bindingId, updates)
    res.json(result)
  } catch (err) {
    console.error('Update binding error:', err)
    res.status(500).json({ error: 'Failed to update binding', message: err.message })
  }
})

/**
 * DELETE /api/data-bindings/delete
 * Delete a binding
 */
router.delete('/delete', async (req, res) => {
  try {
    const { cardId, bindingId } = req.body

    // Validation
    if (!cardId || !bindingId) {
      return res.status(400).json({ error: 'Missing cardId or bindingId' })
    }

    const result = await DataBindingsService.deleteBinding(cardId, bindingId)
    res.json(result)
  } catch (err) {
    console.error('Delete binding error:', err)
    res.status(500).json({ error: 'Failed to delete binding', message: err.message })
  }
})

/**
 * GET /api/data-bindings/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Data Bindings',
    supportedTypes: ['conditional', 'computed', 'formula', 'lookup', 'dependency'],
    capabilities: {
      conditional: 'Show/hide based on field conditions',
      computed: 'Transform field values (uppercase, concatenate, etc)',
      formula: 'Evaluate mathematical and function-based formulas',
      lookup: 'Join with external data tables',
      dependency: 'Create dependent field relationships'
    }
  })
})

export default router
