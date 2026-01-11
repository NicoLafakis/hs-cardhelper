/**
 * @fileoverview Ai API route handler
 * @module server/routes/ai
 * @license MIT
 * @author CardHelper Team
 */

import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import pool from '../utils/database.js'
import { authenticateToken } from '../middleware/auth.js'
import { decrypt } from '../utils/encryption.js'

const router = express.Router()

// AI Model Tiers - Claude 4.5 family
const AI_MODELS = {
  HAIKU: 'claude-haiku-4-5-20251001',     // Fast, cheap - chatbot, quick help
  SONNET: 'claude-sonnet-4-5-20250929',   // Balanced - building new cards
  OPUS: 'claude-opus-4-5-20251101'        // Most powerful - debugging, major changes
}

// Get Claude API key (primary)
function getClaudeKey() {
  const claudeKey = process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY
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

// Detect task complexity to determine which model tier to use
function detectTaskComplexity(message, context = {}) {
  const messageLower = message.toLowerCase()
  const { currentComponents = 0, isDebugging = false, errorContext = null } = context

  // OPUS tier - debugging, errors, or major changes
  if (isDebugging || errorContext) {
    return 'OPUS'
  }

  // Keywords that suggest debugging or complex analysis
  const debugKeywords = ['debug', 'fix', 'error', 'broken', 'not working', "doesn't work", 'issue', 'problem', 'bug', 'wrong', 'help me understand', 'why is', 'analyze']
  if (debugKeywords.some(kw => messageLower.includes(kw))) {
    return 'OPUS'
  }

  // Keywords that suggest major layout changes (when card already has components)
  const majorChangeKeywords = ['redesign', 'restructure', 'completely change', 'start over', 'rebuild', 'major change', 'overhaul', 'reorganize', 'rethink', 'refactor']
  if (currentComponents > 3 && majorChangeKeywords.some(kw => messageLower.includes(kw))) {
    return 'OPUS'
  }

  // SONNET tier - building new cards or adding components
  const buildKeywords = ['create', 'build', 'add', 'make', 'generate', 'design', 'new card', 'component', 'layout', 'table', 'chart', 'button', 'form']
  if (buildKeywords.some(kw => messageLower.includes(kw))) {
    return 'SONNET'
  }

  // If there's substantial existing work and they're making changes
  if (currentComponents > 5) {
    return 'SONNET'
  }

  // Default to HAIKU for simple questions and chat
  return 'HAIKU'
}

// Tiered AI Provider - selects model based on task complexity
async function callTieredAI(systemPrompt, userPrompt, userId, options = {}) {
  const { taskTier = null, context = {} } = options
  
  // Determine the appropriate tier
  const tier = taskTier || detectTaskComplexity(userPrompt, context)
  const model = AI_MODELS[tier] || AI_MODELS.HAIKU
  
  console.log(`[AI] Using ${tier} tier (${model}) for request`)

  try {
    const claudeKey = getClaudeKey()
    const client = new Anthropic({ apiKey: claudeKey })

    const response = await client.messages.create({
      model: model,
      max_tokens: tier === 'OPUS' ? 4096 : (tier === 'SONNET' ? 3072 : 2048),
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
      provider: `claude-${tier.toLowerCase()}`,
      model: model,
      tier: tier
    }
  } catch (error) {
    console.error(`Claude ${tier} request failed:`, error.message)
    
    // Fallback to OpenAI if available
    if (userId) {
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
          provider: 'gpt-5-mini-fallback',
          model: 'gpt-5-mini-2025-08-07',
          tier: tier
        }
      } catch (openaiError) {
        console.error('OpenAI fallback also failed:', openaiError.message)
      }
    }
    
    throw error
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

    const result = await callTieredAI(systemPrompt, prompt, req.user.userId, {
      taskTier: 'SONNET',  // Building cards uses Sonnet
      context: { currentComponents: 0 }
    })

    try {
      const parsed = JSON.parse(result.content)
      res.json({ suggestion: parsed, provider: result.provider, model: result.model, tier: result.tier })
    } catch (parseError) {
      res.json({ suggestion: result.content, raw: true, provider: result.provider, model: result.model, tier: result.tier })
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

    const result = await callTieredAI(systemPrompt, description, req.user.userId, {
      taskTier: 'SONNET',  // Building tables uses Sonnet
      context: {}
    })

    try {
      const parsed = JSON.parse(result.content)
      res.json({ tableConfig: parsed, provider: result.provider, model: result.model, tier: result.tier })
    } catch (parseError) {
      res.json({ tableConfig: result.content, raw: true, provider: result.provider, model: result.model, tier: result.tier })
    }
  } catch (error) {
    console.error('Table wizard error:', error)
    res.status(500).json({ error: 'Failed to generate table configuration', details: error.message })
  }
})

// Generate formula from natural language
router.post('/generate-formula', authenticateToken, async (req, res) => {
  try {
    const { description, availableFields = [] } = req.body

    if (!description) {
      return res.status(400).json({ error: 'Formula description is required' })
    }

    const systemPrompt = `You are an AI assistant that converts natural language descriptions into mathematical formulas.

Available formula functions:
- SUM(...) - Add numbers together
- AVG(...) - Calculate average
- MAX(...) - Find maximum value
- MIN(...) - Find minimum value
- COUNT(...) - Count items
- ROUND(number, decimals) - Round to decimals
- ABS(number) - Absolute value
- CONCAT(...) - Combine text
- UPPER(text) - Convert to uppercase
- LOWER(text) - Convert to lowercase
- LEN(text) - Get text length
- IF(condition, trueValue, falseValue) - Conditional logic

Available fields: ${availableFields.join(', ')}

Rules:
1. Reference fields using \${fieldName} syntax
2. Use operators: +, -, *, /
3. Combine functions and fields naturally
4. Return ONLY a valid formula string, no explanation
5. For conditional logic, use IF(condition, trueValue, falseValue)

Examples:
- "Calculate 10% commission on deal value" → \${deal_value} * 0.10
- "Combine first and last name" → CONCAT(\${first_name}, " ", \${last_name})
- "Apply 20% discount if amount over 100" → IF(\${amount} > 100, \${amount} * 0.8, \${amount})

Return a JSON object:
{
  "formula": "your formula here",
  "explanation": "brief explanation of what the formula does"
}`

    const result = await callTieredAI(systemPrompt, description, req.user.userId, {
      taskTier: 'SONNET',  // Formula generation uses Sonnet
      context: {}
    })

    try {
      const parsed = JSON.parse(result.content)
      res.json({
        formula: parsed.formula,
        explanation: parsed.explanation,
        provider: result.provider,
        model: result.model,
        tier: result.tier
      })
    } catch (parseError) {
      // If AI doesn't return JSON, try to extract formula from text
      const formulaMatch = result.content.match(/formula["\s:]+([^"}\n]+)/i)
      res.json({
        formula: formulaMatch ? formulaMatch[1].trim() : result.content,
        explanation: 'Formula generated from description',
        provider: result.provider,
        model: result.model,
        tier: result.tier
      })
    }
  } catch (error) {
    console.error('Formula generation error:', error)
    res.status(500).json({ error: 'Failed to generate formula', details: error.message })
  }
})

// Chat endpoint for AI Assistant
router.post('/chat', async (req, res) => {
  try {
    const { message, context, recordType, currentComponents } = req.body

    if (!message) {
      return res.status(400).json({ error: 'Message is required' })
    }

    // Comprehensive HubSpot card building system prompt
    const systemPrompt = `${context || ''}

Current context:
- HubSpot Object Type: ${recordType || 'contact'}
- Current components on canvas: ${currentComponents || 0}

IMPORTANT INSTRUCTIONS:
1. When the user asks to create components, ALWAYS respond with a valid JSON array of components
2. Each component must have: type, x, y, width, height, defaultProps (and optionally propertyBinding)
3. Start positions at x: 16, y: 16 and increment y by component height + 16 for each new component
4. Use HubSpot's design language: clean spacing, #ff7a59 for primary color
5. Make cards practical and useful for CRM users
6. Bind components to HubSpot properties when appropriate (e.g., firstname, email, dealname)
7. Keep responses concise and helpful

When generating components, respond with valid JSON like:
[
  { "type": "text", "x": 16, "y": 16, "width": 350, "height": 32, "defaultProps": { "content": "Title", "fontSize": "18px", "fontWeight": "bold" } },
  { "type": "button", "x": 16, "y": 64, "width": 120, "height": 40, "defaultProps": { "label": "Action", "variant": "primary" } }
]

After the JSON, you can include a brief explanation of what was created.`

    // Auto-detect task complexity for chat - considers current card state
    const result = await callTieredAI(systemPrompt, message, null, {
      // Let it auto-detect: HAIKU for simple chat, SONNET for building, OPUS for debugging
      context: { 
        currentComponents: currentComponents || 0,
        isDebugging: false
      }
    })

    res.json({
      message: result.content,
      provider: result.provider,
      model: result.model,
      tier: result.tier
    })
  } catch (error) {
    console.error('AI chat error:', error)

    // Return a helpful fallback response instead of just an error
    res.json({
      message: `I apologize, but I'm having trouble connecting to the AI service. Here's what you can do instead:

1. **Use Templates**: Click on one of the quick start templates to instantly create a card layout
2. **Drag & Drop**: Drag components from the palette on the left side directly onto your canvas
3. **Manual Build**: Start with basic components like Text and Button, then customize in the property panel

Would you like me to suggest some components for "${req.body.message}"? Based on your request, you might want to try:

${generateFallbackSuggestions(req.body.message, req.body.recordType)}`,
      provider: 'fallback'
    })
  }
})

// Generate fallback suggestions when AI is unavailable
function generateFallbackSuggestions(message, recordType) {
  const messageLower = message.toLowerCase()
  let suggestions = []

  if (messageLower.includes('contact') || recordType === 'contact') {
    suggestions.push('• A **Text** component bound to "firstname" and "lastname"')
    suggestions.push('• A **Text** component bound to "email" with blue color')
    suggestions.push('• A **Button** for "Send Email" action')
  }

  if (messageLower.includes('deal') || recordType === 'deal') {
    suggestions.push('• A **Stat** component showing deal "amount"')
    suggestions.push('• A **Progress** bar for deal stage')
    suggestions.push('• A **Badge** showing deal status')
  }

  if (messageLower.includes('table')) {
    suggestions.push('• A **Table** with columns for your data')
    suggestions.push('• Configure columns in the property panel')
  }

  if (messageLower.includes('chart') || messageLower.includes('graph')) {
    suggestions.push('• A **Bar Chart** for comparing values')
    suggestions.push('• A **Line Chart** for trends over time')
    suggestions.push('• A **Pie Chart** for distributions')
  }

  if (messageLower.includes('button')) {
    suggestions.push('• A **Button** with primary, secondary, or danger variants')
    suggestions.push('• Set the action URL in the property panel')
  }

  if (suggestions.length === 0) {
    suggestions.push('• Start with a **Text** component for your title')
    suggestions.push('• Add **Stat** components for key metrics')
    suggestions.push('• Use **Button** components for actions')
  }

  return suggestions.join('\n')
}

// Debug/Analyze endpoint - Always uses Opus for complex analysis
router.post('/debug', authenticateToken, async (req, res) => {
  try {
    const { issue, cardConfig, errorMessage, currentComponents } = req.body

    if (!issue) {
      return res.status(400).json({ error: 'Issue description is required' })
    }

    const systemPrompt = `You are an expert HubSpot card developer and debugger. You have deep knowledge of:
- HubSpot CRM card architecture and UI Extensions
- React component best practices
- Data binding and property mapping
- Common card configuration issues

Your task is to analyze the user's issue and provide a detailed, actionable solution.

Current card configuration:
${cardConfig ? JSON.stringify(cardConfig, null, 2) : 'Not provided'}

Error message (if any): ${errorMessage || 'None'}
Number of components: ${currentComponents || 'Unknown'}

Provide your response in this format:
1. **Issue Analysis**: What's causing the problem
2. **Root Cause**: The underlying issue
3. **Solution**: Step-by-step fix
4. **Code/Config Changes**: Specific changes needed (as JSON if applicable)
5. **Prevention**: How to avoid this in the future`

    const result = await callTieredAI(systemPrompt, issue, req.user.userId, {
      taskTier: 'OPUS',  // Always use Opus for debugging
      context: { isDebugging: true, currentComponents }
    })

    res.json({
      analysis: result.content,
      provider: result.provider,
      model: result.model,
      tier: result.tier
    })
  } catch (error) {
    console.error('Debug analysis error:', error)
    res.status(500).json({ error: 'Failed to analyze issue', details: error.message })
  }
})

// Major redesign endpoint - Always uses Opus for complex restructuring
router.post('/redesign', authenticateToken, async (req, res) => {
  try {
    const { request, currentConfig, objectType, targetGoals } = req.body

    if (!request) {
      return res.status(400).json({ error: 'Redesign request is required' })
    }

    const systemPrompt = `You are a senior HubSpot card architect. Your expertise is in redesigning and restructuring CRM cards for optimal user experience and functionality.

Current card configuration:
${currentConfig ? JSON.stringify(currentConfig, null, 2) : 'Starting fresh'}

HubSpot Object Type: ${objectType || 'contact'}
Target Goals: ${targetGoals || 'Improve usability and clarity'}

Your task is to completely redesign/restructure the card based on the user's request.

Provide:
1. **Design Strategy**: Your approach to the redesign
2. **New Layout**: Complete JSON configuration for the redesigned card
3. **Component Changes**: What was added, removed, or modified
4. **UX Improvements**: How the changes improve user experience
5. **Data Bindings**: Recommended HubSpot property bindings

Return the new component configuration as a valid JSON array.`

    const result = await callTieredAI(systemPrompt, request, req.user.userId, {
      taskTier: 'OPUS',  // Always use Opus for major redesigns
      context: { currentComponents: currentConfig?.components?.length || 0 }
    })

    res.json({
      redesign: result.content,
      provider: result.provider,
      model: result.model,
      tier: result.tier
    })
  } catch (error) {
    console.error('Redesign error:', error)
    res.status(500).json({ error: 'Failed to generate redesign', details: error.message })
  }
})

// Get current AI model configuration
router.get('/models', (req, res) => {
  res.json({
    tiers: {
      HAIKU: {
        model: AI_MODELS.HAIKU,
        description: 'Fast responses for chatbot and quick help',
        useCases: ['Simple Q&A', 'Quick suggestions', 'Basic chat']
      },
      SONNET: {
        model: AI_MODELS.SONNET,
        description: 'Balanced performance for building cards',
        useCases: ['Creating new cards', 'Adding components', 'Generating tables', 'Formula creation']
      },
      OPUS: {
        model: AI_MODELS.OPUS,
        description: 'Most powerful for complex analysis',
        useCases: ['Debugging issues', 'Major redesigns', 'Complex problem solving']
      }
    },
    autoDetection: {
      enabled: true,
      description: 'The chat endpoint automatically selects the appropriate model based on task complexity'
    }
  })
})

export default router
