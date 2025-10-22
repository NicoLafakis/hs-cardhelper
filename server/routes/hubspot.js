import express from 'express'
import axios from 'axios'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { decrypt } from '../utils/encryption.js'

const router = express.Router()

// Get HubSpot API key for user
async function getHubSpotKey(userId) {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute('SELECT encrypted_key FROM api_keys WHERE user_id = ? AND service = ?', [userId, 'hubspot'])
    const result = results[0]
    if (!result) {
      throw new Error('HubSpot API key not found')
    }
    return decrypt(result.encrypted_key)
  } finally {
    connection.release()
  }
}

// Validate HubSpot API key
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const { apiKey } = req.body

    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' })
    }

    const response = await axios.get('https://api.hubapi.com/crm/v3/objects/contacts', {
      headers: { Authorization: `Bearer ${apiKey}` },
      params: { limit: 1 }
    })

    res.json({ valid: true, message: 'API key is valid' })
  } catch (error) {
    if (error.response?.status === 401) {
      res.status(401).json({ valid: false, error: 'Invalid API key' })
    } else {
      console.error('HubSpot validation error:', error)
      res.status(500).json({ error: 'Failed to validate API key' })
    }
  }
})

// Get available CRM objects
router.get('/objects', authenticateToken, async (req, res) => {
  try {
    await getHubSpotKey(req.user.userId)

    const objects = [
      { id: 'contacts', name: 'Contacts' },
      { id: 'companies', name: 'Companies' },
      { id: 'deals', name: 'Deals' },
      { id: 'tickets', name: 'Tickets' },
      { id: 'products', name: 'Products' },
      { id: 'line_items', name: 'Line Items' },
      { id: 'quotes', name: 'Quotes' }
    ]

    res.json(objects)
  } catch (error) {
    console.error('Get objects error:', error)
    res.status(500).json({ error: error.message || 'Failed to fetch objects' })
  }
})

// Get properties for a specific object
router.get('/properties/:objectType', authenticateToken, async (req, res) => {
  try {
    const { objectType } = req.params
    const apiKey = await getHubSpotKey(req.user.userId)

    const response = await axios.get(`https://api.hubapi.com/crm/v3/properties/${objectType}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    })

    const properties = response.data.results.map(prop => ({
      name: prop.name,
      label: prop.label,
      type: prop.type,
      fieldType: prop.fieldType
    }))

    res.json(properties)
  } catch (error) {
    if (error.response?.status === 401) {
      res.status(401).json({ error: 'Invalid or expired API key' })
    } else {
      console.error('Get properties error:', error)
      res.status(500).json({ error: 'Failed to fetch properties' })
    }
  }
})

export default router
