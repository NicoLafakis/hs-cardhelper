/**
 * Feature Flags Service
 * Handles feature flag management
 */

import { BaseService } from './BaseService'

export class FeatureFlagsService extends BaseService {
  constructor() {
    super('/feature-flags')
  }

  /**
   * Get all feature flags
   */
  async getAll() {
    return await this.get()
  }

  /**
   * Set a single feature flag
   */
  async setFlag(key, value) {
    return await this.post('', { key, value })
  }

  /**
   * Set multiple feature flags at once
   */
  async setBulk(flags) {
    return await this.post('/bulk', { flags })
  }

  /**
   * Delete a feature flag
   */
  async deleteFlag(key) {
    return await super.delete(`/${key}`)
  }

  /**
   * Reset all feature flags to defaults
   */
  async reset() {
    return await this.post('/reset')
  }

  /**
   * Sync local flags with backend
   */
  async syncFlags(localFlags) {
    const result = await this.getAll()

    if (result.success) {
      const serverFlags = result.data.flags
      const merged = { ...localFlags, ...serverFlags }

      // Save merged flags to server
      await this.setBulk(merged)

      return {
        success: true,
        flags: merged
      }
    }

    return result
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(flags, featureKey, defaultValue = false) {
    return flags[featureKey] !== undefined ? flags[featureKey] : defaultValue
  }
}

// Create singleton instance
const featureFlagsService = new FeatureFlagsService()

export default featureFlagsService
