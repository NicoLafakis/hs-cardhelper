/**
 * AI-Powered Smart Builder
 * Uses Claude Haiku to generate card layouts from natural language
 */

import Anthropic from '@anthropic-ai/sdk'

const CLAUDE_MODEL = 'claude-haiku-4-5-20251001'

/**
 * Generate card layout from natural language description
 */
export async function generateCardLayoutFromDescription(description) {
  const claudeKey = process.env.CLAUDE_API_KEY

  if (!claudeKey) {
    throw new Error('Claude API key not configured')
  }

  const client = new Anthropic({ apiKey: claudeKey })

  const systemPrompt = `You are an expert card/component designer. Given a natural language description, generate a detailed card layout specification in JSON format.

Output should be a valid JSON object with:
{
  "name": "Card name",
  "description": "What this card does",
  "layout": "grid" | "flex" | "stack",
  "columns": number (1-12),
  "sections": [
    {
      "id": "unique_id",
      "type": "header" | "content" | "form" | "image" | "video" | "table" | "chart",
      "title": "Section title",
      "content": "Content description",
      "fields": ["field1", "field2"],
      "width": "full" | "half" | "third",
      "height": "auto" | "small" | "medium" | "large"
    }
  ],
  "fields": [
    {
      "id": "field_id",
      "name": "Display Name",
      "type": "text" | "email" | "phone" | "date" | "select" | "checkbox" | "textarea",
      "required": true | false,
      "placeholder": "Placeholder text",
      "validation": "validation_rule"
    }
  ],
  "theme": {
    "primaryColor": "#3b82f6",
    "accentColor": "#10b981",
    "spacing": "comfortable" | "compact" | "spacious"
  },
  "suggestions": ["suggestion1", "suggestion2"]
}

IMPORTANT: Return ONLY valid JSON, no markdown or explanation.`

  const userPrompt = `Generate a card layout for: ${description}`

  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse JSON response
    let cardLayout
    try {
      cardLayout = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse Claude response:', responseText)
      throw new Error('Invalid card layout JSON from AI')
    }

    return {
      layout: cardLayout,
      provider: 'claude-haiku',
      tokensUsed: response.usage.output_tokens
    }
  } catch (error) {
    console.error('AI Card Generation Error:', error)
    throw error
  }
}

/**
 * Suggest HubSpot field mappings for a card
 */
export async function suggestHubSpotMappings(cardLayout, hubspotProperties = []) {
  const claudeKey = process.env.CLAUDE_API_KEY

  if (!claudeKey) {
    throw new Error('Claude API key not configured')
  }

  const client = new Anthropic({ apiKey: claudeKey })

  const systemPrompt = `You are a HubSpot expert. Given a card layout and available HubSpot properties, suggest intelligent field mappings.

Available HubSpot property types:
- Contact: firstname, lastname, email, phone, company, hs_lead_status
- Company: name, website, industry, numberofemployees
- Deal: dealname, dealstage, amount, closedate, pipeline
- Ticket: subject, content, hs_ticket_priority, hs_ticket_status

Return JSON array of mappings:
[
  {
    "cardField": "field_id_from_card",
    "hubspotProperty": "hubspot_property_name",
    "confidence": 0.95,
    "reasoning": "Why this mapping makes sense"
  }
]

IMPORTANT: Return ONLY valid JSON array, no markdown or explanation.`

  const userPrompt = `Card fields: ${JSON.stringify(cardLayout.fields)}
Available HubSpot properties: ${JSON.stringify(hubspotProperties)}

Suggest the best mappings for these fields to HubSpot properties.`

  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    let mappings
    try {
      mappings = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse HubSpot mappings:', responseText)
      throw new Error('Invalid mappings JSON from AI')
    }

    return {
      mappings,
      provider: 'claude-haiku',
      tokensUsed: response.usage.output_tokens
    }
  } catch (error) {
    console.error('HubSpot Mapping Error:', error)
    throw error
  }
}

/**
 * Suggest optimal component placement and layout improvements
 */
export async function suggestLayoutImprovements(cardLayout) {
  const claudeKey = process.env.CLAUDE_API_KEY

  if (!claudeKey) {
    throw new Error('Claude API key not configured')
  }

  const client = new Anthropic({ apiKey: claudeKey })

  const systemPrompt = `You are a UX designer. Given a card layout, provide suggestions to improve:
1. Visual hierarchy
2. Component placement
3. Spacing and alignment
4. Mobile responsiveness
5. Accessibility

Return JSON with suggestions:
{
  "improvements": [
    {
      "aspect": "visual_hierarchy" | "placement" | "spacing" | "mobile" | "accessibility",
      "issue": "What could be better",
      "suggestion": "Recommended fix",
      "impact": "high" | "medium" | "low",
      "priority": number (1-10)
    }
  ],
  "overallScore": number (0-100),
  "summary": "Brief summary of recommendations"
}

IMPORTANT: Return ONLY valid JSON, no markdown.`

  const userPrompt = `Analyze this card layout for improvements:
${JSON.stringify(cardLayout, null, 2)}`

  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    let suggestions
    try {
      suggestions = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse suggestions:', responseText)
      throw new Error('Invalid suggestions JSON from AI')
    }

    return {
      suggestions,
      provider: 'claude-haiku',
      tokensUsed: response.usage.output_tokens
    }
  } catch (error) {
    console.error('Layout Improvement Suggestions Error:', error)
    throw error
  }
}

/**
 * Generate component recommendations for a card
 */
export async function suggestComponents(cardDescription) {
  const claudeKey = process.env.CLAUDE_API_KEY

  if (!claudeKey) {
    throw new Error('Claude API key not configured')
  }

  const client = new Anthropic({ apiKey: claudeKey })

  const systemPrompt = `You are a component architecture expert. Given a card description, recommend the best components to use.

Available components:
- Header, Title, Subtitle, Body, Badge, Button, Input, Select, Checkbox, Radio
- DatePicker, TimePicker, TextArea, RichEditor, FileUpload
- Image, Video, Chart, Table, List, Grid, Carousel
- Modal, Tooltip, Popover, Dropdown, Tabs, Accordion
- Card, Panel, Section, Divider, Spacer, Container

Return JSON recommendations:
{
  "recommendations": [
    {
      "component": "ComponentName",
      "reason": "Why this component fits",
      "placement": "Where to place it",
      "props": {
        "key": "value"
      }
    }
  ],
  "componentCount": number,
  "complexity": "simple" | "moderate" | "complex"
}

IMPORTANT: Return ONLY valid JSON, no markdown.`

  const userPrompt = `Recommend components for: ${cardDescription}`

  try {
    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''

    let recommendations
    try {
      recommendations = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse component recommendations:', responseText)
      throw new Error('Invalid recommendations JSON from AI')
    }

    return {
      recommendations,
      provider: 'claude-haiku',
      tokensUsed: response.usage.output_tokens
    }
  } catch (error) {
    console.error('Component Suggestions Error:', error)
    throw error
  }
}

export default {
  generateCardLayoutFromDescription,
  suggestHubSpotMappings,
  suggestLayoutImprovements,
  suggestComponents
}
