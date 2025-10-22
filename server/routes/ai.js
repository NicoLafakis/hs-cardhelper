import express from 'express'
import OpenAI from 'openai'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { decrypt } from '../utils/encryption.js'

const router = express.Router()

// Get OpenAI key for user
async function getOpenAIKey(userId) {
  const connection = await pool.getConnection()
  try {
    const [results] = await connection.execute('SELECT encrypted_key FROM api_keys WHERE user_id = ? AND service = ?', [userId, 'openai'])
    const result = results[0]
    if (!result) {
      throw new Error('OpenAI API key not found')
    }
    return decrypt(result.encrypted_key)
  } finally {
    connection.release()
  }
}

// Generate card configuration suggestions
router.post('/suggest', authenticateToken, async (req, res) => {
  try {
    const { prompt, objectType, properties } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const apiKey = await getOpenAIKey(req.user.userId)
    const openai = new OpenAI({ apiKey })

    const systemPrompt = `You are an AI assistant that helps create HubSpot CRM card configurations.
Given a user's description and available HubSpot object properties, generate a JSON configuration for a card component.

Available object type: ${objectType || 'Not specified'}
Available properties: ${properties ? JSON.stringify(properties) : 'Not specified'}

Generate a card configuration that includes:
- A title for the card
- A description of what the card displays
- Suggested components (like data tables, text fields, buttons)
- Data bindings to the appropriate HubSpot properties
- Any additional styling or layout suggestions

Return ONLY a valid JSON object with this structure:
{
  "title": "Card Title",
  "description": "What this card displays",
  "components": [
    {
      "type": "table|text|button",
      "label": "Component label",
      "properties": ["property1", "property2"],
      "config": {}
    }
  ]
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const suggestion = completion.choices[0].message.content

    try {
      const parsed = JSON.parse(suggestion)
      res.json({ suggestion: parsed })
    } catch (parseError) {
      res.json({ suggestion, raw: true })
    }
  } catch (error) {
    if (error.message === 'OpenAI API key not found') {
      return res.status(404).json({ error: 'OpenAI API key not configured' })
    }
    console.error('AI suggestion error:', error)
    res.status(500).json({ error: 'Failed to generate suggestions' })
  }
})

// Generate table configuration
router.post('/table-wizard', authenticateToken, async (req, res) => {
  try {
    const { description, objectType, availableProperties } = req.body

    if (!description || !objectType) {
      return res.status(400).json({ error: 'Description and object type are required' })
    }

    const apiKey = await getOpenAIKey(req.user.userId)
    const openai = new OpenAI({ apiKey })

    const systemPrompt = `You are an AI assistant that creates HubSpot data table configurations.
The user wants to create a table for ${objectType} objects.

Available properties: ${JSON.stringify(availableProperties || [])}

Based on the user's description, suggest:
1. Which properties to include as columns
2. Column labels (human-readable names)
3. Data formatting suggestions
4. Sort order if applicable

Return ONLY a valid JSON object:
{
  "columns": [
    {
      "property": "property_name",
      "label": "Column Label",
      "type": "text|number|date"
    }
  ],
  "sortBy": "property_name",
  "sortOrder": "asc|desc"
}`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: description }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })

    const suggestion = completion.choices[0].message.content

    try {
      const parsed = JSON.parse(suggestion)
      res.json({ tableConfig: parsed })
    } catch (parseError) {
      res.json({ tableConfig: suggestion, raw: true })
    }
  } catch (error) {
    if (error.message === 'OpenAI API key not found') {
      return res.status(404).json({ error: 'OpenAI API key not configured' })
    }
    console.error('Table wizard error:', error)
    res.status(500).json({ error: 'Failed to generate table configuration' })
  }
})

export default router
