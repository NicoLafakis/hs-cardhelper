/**
 * Settings Service
 * Handles API key management and settings
 */

import { BaseService } from './BaseService'

export class SettingsService extends BaseService {
  constructor() {
    super('/settings')
  }

  /**
   * Save API key for a service
   */
  async saveApiKey(service, apiKey) {
    return await this.post(`/${service}`, { apiKey })
  }

  /**
   * Get API key status
   */
  async getKeyStatus(service) {
    return await this.get(`/${service}`)
  }

  /**
   * Get API key (decrypted)
   */
  async getApiKey(service) {
    return await this.get(`/${service}/key`)
  }

  /**
   * Delete API key
   */
  async deleteApiKey(service) {
    return await super.delete(`/${service}`)
  }

  /**
   * Test API key validity
   */
  async testApiKey(service, apiKey) {
    // Service-specific testing logic
    switch (service) {
      case 'hubspot':
        return await this.testHubSpotKey(apiKey)
      case 'openai':
        return await this.testOpenAIKey(apiKey)
      default:
        return { success: false, error: 'Unknown service' }
    }
  }

  /**
   * Test HubSpot API key
   */
  async testHubSpotKey(apiKey) {
    // This would call HubSpot API to validate
    // For now, just check format
    return {
      success: apiKey && apiKey.length > 0,
      error: apiKey ? null : 'Invalid API key'
    }
  }

  /**
   * Test OpenAI API key
   */
  async testOpenAIKey(apiKey) {
    // This would call OpenAI API to validate
    // For now, just check format
    return {
      success: apiKey && apiKey.startsWith('sk-'),
      error: apiKey?.startsWith('sk-') ? null : 'Invalid API key format'
    }
  }
}

// Create singleton instance
const settingsService = new SettingsService()

export default settingsService
