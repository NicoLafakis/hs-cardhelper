/**
 * HubSpot Service
 * Handles HubSpot API integration
 */

import { BaseService } from './BaseService'

export class HubSpotService extends BaseService {
  constructor() {
    super('/hubspot')
  }

  /**
   * Validate HubSpot API key
   */
  async validate(apiKey) {
    return await this.post('/validate', { apiKey })
  }

  /**
   * Get available HubSpot objects
   */
  async getObjects() {
    return await this.get('/objects')
  }

  /**
   * Get properties for a specific object type
   */
  async getProperties(objectType) {
    return await this.get(`/properties/${objectType}`)
  }

  /**
   * Get object by ID
   */
  async getObject(objectType, objectId) {
    return await this.get(`/objects/${objectType}/${objectId}`)
  }

  /**
   * Search objects
   */
  async searchObjects(objectType, filters = {}) {
    return await this.post(`/objects/${objectType}/search`, filters)
  }

  /**
   * Format property value for display
   */
  formatPropertyValue(property, value) {
    if (!value) return '-'

    switch (property.type) {
      case 'date':
      case 'datetime':
        return new Date(value).toLocaleDateString()
      case 'number':
        return Number(value).toLocaleString()
      case 'bool':
      case 'boolean':
        return value ? 'Yes' : 'No'
      case 'enumeration':
        return property.options?.find(o => o.value === value)?.label || value
      default:
        return value
    }
  }

  /**
   * Get property label
   */
  getPropertyLabel(property) {
    return property.label || this.formatPropertyName(property.name)
  }

  /**
   * Format property name (convert snake_case to Title Case)
   */
  formatPropertyName(name) {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
}

// Create singleton instance
const hubspotService = new HubSpotService()

export default hubspotService
