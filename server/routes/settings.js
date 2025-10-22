import express from 'express'
import db from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { encrypt, decrypt } from '../utils/encryption.js'

const router = express.Router()

// Save API key
router.post('/:service', authenticateToken, (req, res) => {
  try {
    const { service } = req.params
    const { apiKey } = req.body

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' })
    }

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const encryptedKey = encrypt(apiKey)

    const existing = db.prepare('SELECT id FROM api_keys WHERE user_id = ? AND service = ?').get(req.user.userId, service)

    if (existing) {
      db.prepare('UPDATE api_keys SET encrypted_key = ? WHERE user_id = ? AND service = ?').run(encryptedKey, req.user.userId, service)
    } else {
      db.prepare('INSERT INTO api_keys (user_id, service, encrypted_key) VALUES (?, ?, ?)').run(req.user.userId, service, encryptedKey)
    }

    res.json({ message: `${service} API key saved successfully` })
  } catch (error) {
    console.error('Save API key error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get API key status
router.get('/:service', authenticateToken, (req, res) => {
  try {
    const { service } = req.params

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const apiKey = db.prepare('SELECT id FROM api_keys WHERE user_id = ? AND service = ?').get(req.user.userId, service)

    res.json({ hasKey: !!apiKey })
  } catch (error) {
    console.error('Get API key status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get decrypted API key (internal use)
router.get('/:service/key', authenticateToken, (req, res) => {
  try {
    const { service } = req.params

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const result = db.prepare('SELECT encrypted_key FROM api_keys WHERE user_id = ? AND service = ?').get(req.user.userId, service)

    if (!result) {
      return res.status(404).json({ error: 'API key not found' })
    }

    const apiKey = decrypt(result.encrypted_key)
    res.json({ apiKey })
  } catch (error) {
    console.error('Get API key error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete API key
router.delete('/:service', authenticateToken, (req, res) => {
  try {
    const { service } = req.params

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const result = db.prepare('DELETE FROM api_keys WHERE user_id = ? AND service = ?').run(req.user.userId, service)

    if (result.changes === 0) {
      return res.status(404).json({ error: 'API key not found' })
    }

    res.json({ message: `${service} API key deleted successfully` })
  } catch (error) {
    console.error('Delete API key error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
