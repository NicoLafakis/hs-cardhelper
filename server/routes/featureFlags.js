/**
 * Feature Flags Routes
 * API endpoints for managing feature flags
 */

import express from 'express'
import db from '../db/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all feature flags for the current user
router.get('/', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM feature_flags WHERE user_id = ?')
    const flags = stmt.all(req.user.userId)

    // Convert array to object
    const flagsObj = {}
    flags.forEach(flag => {
      flagsObj[flag.flag_key] = flag.flag_value === 1
    })

    res.json({ flags: flagsObj })
  } catch (error) {
    console.error('Error getting feature flags:', error)
    res.status(500).json({ error: 'Failed to get feature flags' })
  }
})

// Set a feature flag
router.post('/', authenticateToken, (req, res) => {
  try {
    const { key, value } = req.body

    if (!key) {
      return res.status(400).json({ error: 'Flag key is required' })
    }

    const stmt = db.prepare(`
      INSERT INTO feature_flags (user_id, flag_key, flag_value)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, flag_key)
      DO UPDATE SET flag_value = ?, updated_at = CURRENT_TIMESTAMP
    `)

    const numValue = value ? 1 : 0
    stmt.run(req.user.userId, key, numValue, numValue)

    res.json({ success: true, key, value })
  } catch (error) {
    console.error('Error setting feature flag:', error)
    res.status(500).json({ error: 'Failed to set feature flag' })
  }
})

// Set multiple feature flags at once
router.post('/bulk', authenticateToken, (req, res) => {
  try {
    const { flags } = req.body

    if (!flags || typeof flags !== 'object') {
      return res.status(400).json({ error: 'Flags object is required' })
    }

    const stmt = db.prepare(`
      INSERT INTO feature_flags (user_id, flag_key, flag_value)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, flag_key)
      DO UPDATE SET flag_value = ?, updated_at = CURRENT_TIMESTAMP
    `)

    const transaction = db.transaction(() => {
      Object.entries(flags).forEach(([key, value]) => {
        const numValue = value ? 1 : 0
        stmt.run(req.user.userId, key, numValue, numValue)
      })
    })

    transaction()

    res.json({ success: true, count: Object.keys(flags).length })
  } catch (error) {
    console.error('Error setting feature flags:', error)
    res.status(500).json({ error: 'Failed to set feature flags' })
  }
})

// Delete a feature flag
router.delete('/:key', authenticateToken, (req, res) => {
  try {
    const { key } = req.params

    const stmt = db.prepare('DELETE FROM feature_flags WHERE user_id = ? AND flag_key = ?')
    stmt.run(req.user.userId, key)

    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting feature flag:', error)
    res.status(500).json({ error: 'Failed to delete feature flag' })
  }
})

// Reset all feature flags to defaults
router.post('/reset', authenticateToken, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM feature_flags WHERE user_id = ?')
    stmt.run(req.user.userId)

    res.json({ success: true })
  } catch (error) {
    console.error('Error resetting feature flags:', error)
    res.status(500).json({ error: 'Failed to reset feature flags' })
  }
})

export default router
