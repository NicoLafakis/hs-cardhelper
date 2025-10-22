/**
 * Feature Flags Routes
 * API endpoints for managing feature flags
 */

import express from 'express'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all feature flags for the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection()
    try {
      const [flags] = await connection.execute('SELECT * FROM feature_flags WHERE user_id = ?', [req.user.userId])

      // Convert array to object
      const flagsObj = {}
      flags.forEach(flag => {
        flagsObj[flag.flag_key] = flag.flag_value === 1
      })

      res.json({ flags: flagsObj })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error getting feature flags:', error)
    res.status(500).json({ error: 'Failed to get feature flags' })
  }
})

// Set a feature flag
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { key, value } = req.body

    if (!key) {
      return res.status(400).json({ error: 'Flag key is required' })
    }

    const connection = await pool.getConnection()
    try {
      const numValue = value ? 1 : 0

      // MySQL upsert syntax
      await connection.execute(`
        INSERT INTO feature_flags (user_id, flag_key, flag_value)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE flag_value = ?, updated_at = CURRENT_TIMESTAMP
      `, [req.user.userId, key, numValue, numValue])

      res.json({ success: true, key, value })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error setting feature flag:', error)
    res.status(500).json({ error: 'Failed to set feature flag' })
  }
})

// Set multiple feature flags at once
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { flags } = req.body

    if (!flags || typeof flags !== 'object') {
      return res.status(400).json({ error: 'Flags object is required' })
    }

    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      for (const [key, value] of Object.entries(flags)) {
        const numValue = value ? 1 : 0
        await connection.execute(`
          INSERT INTO feature_flags (user_id, flag_key, flag_value)
          VALUES (?, ?, ?)
          ON DUPLICATE KEY UPDATE flag_value = ?, updated_at = CURRENT_TIMESTAMP
        `, [req.user.userId, key, numValue, numValue])
      }

      await connection.commit()

      res.json({ success: true, count: Object.keys(flags).length })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error setting feature flags:', error)
    res.status(500).json({ error: 'Failed to set feature flags' })
  }
})

// Delete a feature flag
router.delete('/:key', authenticateToken, async (req, res) => {
  try {
    const { key } = req.params

    const connection = await pool.getConnection()
    try {
      await connection.execute('DELETE FROM feature_flags WHERE user_id = ? AND flag_key = ?', [req.user.userId, key])

      res.json({ success: true })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error deleting feature flag:', error)
    res.status(500).json({ error: 'Failed to delete feature flag' })
  }
})

// Reset all feature flags to defaults
router.post('/reset', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection()
    try {
      await connection.execute('DELETE FROM feature_flags WHERE user_id = ?', [req.user.userId])

      res.json({ success: true })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Error resetting feature flags:', error)
    res.status(500).json({ error: 'Failed to reset feature flags' })
  }
})

export default router
