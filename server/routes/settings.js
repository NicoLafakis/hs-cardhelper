import express from 'express'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { encrypt, decrypt } from '../utils/encryption.js'

const router = express.Router()

// Save API key
router.post('/:service', authenticateToken, async (req, res) => {
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

    const connection = await pool.getConnection()
    try {
      const [existing] = await connection.execute('SELECT id FROM api_keys WHERE user_id = ? AND service = ?', [req.user.userId, service])

      if (existing.length > 0) {
        await connection.execute('UPDATE api_keys SET encrypted_key = ? WHERE user_id = ? AND service = ?', [encryptedKey, req.user.userId, service])
      } else {
        await connection.execute('INSERT INTO api_keys (user_id, service, encrypted_key) VALUES (?, ?, ?)', [req.user.userId, service, encryptedKey])
      }

      res.json({ message: `${service} API key saved successfully` })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Save API key error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get API key status
router.get('/:service', authenticateToken, async (req, res) => {
  try {
    const { service } = req.params

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const connection = await pool.getConnection()
    try {
      const [apiKeys] = await connection.execute('SELECT id FROM api_keys WHERE user_id = ? AND service = ?', [req.user.userId, service])

      res.json({ hasKey: apiKeys.length > 0 })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get API key status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get decrypted API key (internal use)
router.get('/:service/key', authenticateToken, async (req, res) => {
  try {
    const { service } = req.params

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const connection = await pool.getConnection()
    try {
      const [results] = await connection.execute('SELECT encrypted_key FROM api_keys WHERE user_id = ? AND service = ?', [req.user.userId, service])
      const result = results[0]

      if (!result) {
        return res.status(404).json({ error: 'API key not found' })
      }

      const apiKey = decrypt(result.encrypted_key)
      res.json({ apiKey })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Get API key error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete API key
router.delete('/:service', authenticateToken, async (req, res) => {
  try {
    const { service } = req.params

    if (!['hubspot', 'openai'].includes(service)) {
      return res.status(400).json({ error: 'Invalid service' })
    }

    const connection = await pool.getConnection()
    try {
      const [result] = await connection.execute('DELETE FROM api_keys WHERE user_id = ? AND service = ?', [req.user.userId, service])

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'API key not found' })
      }

      res.json({ message: `${service} API key deleted successfully` })
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error('Delete API key error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
