/**
 * AI Service
 * Handles AI-powered features using OpenAI
 */

import { BaseService } from './BaseService'

export class AIService extends BaseService {
  constructor() {
    super('/ai')
  }

  /**
   * Get AI suggestions based on prompt
   */
  async getSuggestions(prompt, objectType, properties) {
    return await this.post('/suggest', {
      prompt,
      objectType,
      properties
    })
  }

  /**
   * Generate table configuration using AI wizard
   */
  async generateTableConfig(description, objectType, availableProperties) {
    return await this.post('/table-wizard', {
      description,
      objectType,
      availableProperties
    })
  }

  /**
   * Generate card layout suggestions
   */
  async generateLayout(objectType, selectedProperties) {
    const prompt = `Create a card layout for a ${objectType} that displays these properties: ${selectedProperties.join(', ')}`

    return await this.getSuggestions(prompt, objectType, selectedProperties)
  }

  /**
   * Generate component suggestions
   */
  async suggestComponents(objectType, purpose) {
    const prompt = `Suggest the best components to use for displaying ${objectType} data for the purpose of: ${purpose}`

    return await this.getSuggestions(prompt, objectType, [])
  }

  /**
   * Parse AI response for table wizard
   */
  parseTableWizardResponse(response) {
    try {
      if (response.success && response.data) {
        return {
          success: true,
          columns: response.data.columns || [],
          config: response.data.config || {}
        }
      }

      return {
        success: false,
        error: 'Failed to parse AI response'
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * Build AI prompt for card generation
   */
  buildCardPrompt(requirements) {
    const {
      objectType,
      purpose,
      dataPoints,
      style
    } = requirements

    return `Create a HubSpot CRM card for ${objectType} objects.
Purpose: ${purpose}
Data to display: ${dataPoints.join(', ')}
Style: ${style || 'professional'}
Suggest the best layout and components to use.`
  }
}

// Create singleton instance
const aiService = new AIService()

export default aiService
