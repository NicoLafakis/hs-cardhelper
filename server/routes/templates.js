import express from 'express'
import db from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

// Get all templates for user
router.get('/', authenticateToken, (req, res) => {
  try {
    const templates = db.prepare('SELECT id, name, config, created_at FROM templates WHERE user_id = ? ORDER BY created_at DESC').all(req.user.userId)
    res.json(templates)
  } catch (error) {
    console.error('Get templates error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get single template
router.get('/:id', authenticateToken, (req, res) => {
  try {
    const template = db.prepare('SELECT id, name, config, created_at FROM templates WHERE id = ? AND user_id = ?').get(req.params.id, req.user.userId)

    if (!template) {
      return res.status(404).json({ error: 'Template not found' })
    }

    res.json(template)
  } catch (error) {
    console.error('Get template error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Save template
router.post('/', authenticateToken, (req, res) => {
  try {
    const { name, config } = req.body

    if (!name || !config) {
      return res.status(400).json({ error: 'Name and config are required' })
    }

    const result = db.prepare('INSERT INTO templates (user_id, name, config) VALUES (?, ?, ?)').run(
      req.user.userId,
      name,
      JSON.stringify(config)
    )

    res.json({
      id: result.lastInsertRowid,
      name,
      config,
      message: 'Template saved successfully'
    })
  } catch (error) {
    console.error('Save template error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete template
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const result = db.prepare('DELETE FROM templates WHERE id = ? AND user_id = ?').run(req.params.id, req.user.userId)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Template not found' })
    }

    res.json({ message: 'Template deleted successfully' })
  } catch (error) {
    console.error('Delete template error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
