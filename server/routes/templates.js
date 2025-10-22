import express from 'express'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all templates for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection()
    try {
      const [templates] = await connection.execute('SELECT id, name, config, created_at FROM templates WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId])
      res.json(templates)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single template
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection()
    try {
      const [templates] = await connection.execute('SELECT id, name, config, created_at FROM templates WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId])
      const template = templates[0]

      if (!template) {
        return res.status(404).json({ error: 'Template not found' })
      }

      res.json(template)
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Save template
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, config } = req.body

    if (!name || !config) {
      return res.status(400).json({ error: 'Name and config are required' })
    }

    const connection = await pool.getConnection()
    try {
      const [result] = await connection.execute('INSERT INTO templates (user_id, name, config) VALUES (?, ?, ?)', [
        req.user.userId,
        name,
        JSON.stringify(config)
      ])

      res.json({
        id: result.insertId,
        name,
        config,
        message: 'Template saved successfully'
      })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Save template error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete template
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const connection = await pool.getConnection()
    try {
      const [result] = await connection.execute('DELETE FROM templates WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId])

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Template not found' })
      }

      res.json({ message: 'Template deleted successfully' })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Delete template error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
