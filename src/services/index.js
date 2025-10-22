/**
 * Services Index
 * Central export point for all services
 */

export { default as authService } from './AuthService'
export { default as templateService } from './TemplateService'
export { default as settingsService } from './SettingsService'
export { default as hubspotService } from './HubSpotService'
export { default as aiService } from './AIService'
export { default as featureFlagsService } from './FeatureFlagsService'
export { BaseService } from './BaseService'

// Re-export for convenience
import authService from './AuthService'
import templateService from './TemplateService'
import settingsService from './SettingsService'
import hubspotService from './HubSpotService'
import aiService from './AIService'
import featureFlagsService from './FeatureFlagsService'

export const services = {
  auth: authService,
  template: templateService,
  settings: settingsService,
  hubspot: hubspotService,
  ai: aiService,
  featureFlags: featureFlagsService
}

export default services
