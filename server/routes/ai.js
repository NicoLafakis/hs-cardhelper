import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { decrypt } from '../utils/encryption.js'

const router = express.Router()

// Get Claude API key (primary)
function getClaudeKey() {
  const claudeKey = process.env.CLAUDE_API_KEY
  if (!claudeKey) {
    throw new Error('Claude API key not configured')
  }
  return claudeKey
}

// Get OpenAI key (backup)
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

// AI Provider wrapper - tries Claude first, falls back to GPT-5 Mini
async function callAIProvider(systemPrompt, userPrompt, userId) {
  let claudeError = null
  let openaiError = null

  // Try Claude Haiku first
  try {
    const claudeKey = getClaudeKey()
    const client = new Anthropic({ apiKey: claudeKey })

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    return {
      content: response.content[0].type === 'text' ? response.content[0].text : '',
      provider: 'claude-haiku'
    }
  } catch (error) {
    claudeError = error
    console.warn('Claude Haiku request failed, attempting fallback to GPT-5 Mini:', error.message)
  }

  // Fallback to GPT-5 Mini
  try {
    const openaiKey = await getOpenAIKey(userId)
    const client = new OpenAI({ apiKey: openaiKey })

    const completion = await client.chat.completions.create({
      model: 'gpt-5-mini-2025-08-07',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })

    return {
      content: completion.choices[0].message.content,
      provider: 'gpt-5-mini-fallback'
    }
  } catch (error) {
    openaiError = error
    console.error('Both Claude and GPT-5 Mini failed:', { claudeError: claudeError?.message, openaiError: openaiError?.message })
    throw new Error(`AI provider failed: Claude - ${claudeError?.message}, GPT-5 Mini - ${openaiError?.message}`)
  }
}

// Generate card configuration suggestions
router.post('/suggest', authenticateToken, async (req, res) => {
  try {
    const { prompt, objectType, properties } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

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

    const result = await callAIProvider(systemPrompt, prompt, req.user.userId)

    try {
      const parsed = JSON.parse(result.content)
      res.json({ suggestion: parsed, provider: result.provider })
    } catch (parseError) {
      res.json({ suggestion: result.content, raw: true, provider: result.provider })
    }
  } catch (error) {
    console.error('AI suggestion error:', error)
    res.status(500).json({ error: 'Failed to generate suggestions', details: error.message })
  }
})

// Generate table configuration
router.post('/table-wizard', authenticateToken, async (req, res) => {
  try {
    const { description, objectType, availableProperties } = req.body

    if (!description || !objectType) {
      return res.status(400).json({ error: 'Description and object type are required' })
    }

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

    const result = await callAIProvider(systemPrompt, description, req.user.userId)

    try {
      const parsed = JSON.parse(result.content)
      res.json({ tableConfig: parsed, provider: result.provider })
    } catch (parseError) {
      res.json({ tableConfig: result.content, raw: true, provider: result.provider })
    }
  } catch (error) {
    console.error('Table wizard error:', error)
    res.status(500).json({ error: 'Failed to generate table configuration', details: error.message })
  }
})

export default router
