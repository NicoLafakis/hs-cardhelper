/**
 * Analytics Dashboard Plugin
 * Provides insights and metrics about card usage
 */

import { createPlugin } from '../../core/Plugin'
import AnalyticsDashboard from './components/AnalyticsDashboard'
import useAnalyticsStore from './analyticsStore'

const analyticsDashboardPlugin = createPlugin({
  id: 'analytics-dashboard',
  name: 'Analytics Dashboard',
  version: '1.0.0',
  description: 'Track usage metrics, popular components, and card performance',
  author: 'CardHelper Team',
  enabled: true,

  components: {
    AnalyticsDashboard
  },

  services: {
    analytics: {
      // Track an event
      trackEvent: (eventName, data = {}) => {
        const { addEvent } = useAnalyticsStore.getState()
        addEvent(eventName, data)
      },

      // Get all events
      getEvents: () => {
        return useAnalyticsStore.getState().events
      },

      // Get events by type
      getEventsByType: (eventName) => {
        const { events } = useAnalyticsStore.getState()
        return events.filter(e => e.name === eventName)
      },

      // Get analytics summary
      getSummary: () => {
        const { events, templates } = useAnalyticsStore.getState()

        return {
          totalEvents: events.length,
          totalTemplates: templates.length,
          popularComponents: useAnalyticsStore.getState().getPopularComponents(),
          recentActivity: events.slice(-10).reverse()
        }
      },

      // Track template usage
      trackTemplateUsage: (templateId, action) => {
        const { trackTemplate } = useAnalyticsStore.getState()
        trackTemplate(templateId, action)
      },

      // Export analytics data
      exportData: () => {
        const data = useAnalyticsStore.getState()
        const json = JSON.stringify(data, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `analytics-${new Date().toISOString()}.json`
        link.click()

        URL.revokeObjectURL(url)
      }
    }
  },

  hooks: {
    'app:mounted': async function() {
      this.services.analytics.trackEvent('app_opened')
    },

    'component:added': async function(component) {
      this.services.analytics.trackEvent('component_added', {
        componentType: component.type
      })
    },

    'template:saved': async function(template) {
      this.services.analytics.trackEvent('template_saved', {
        templateId: template.id,
        componentCount: template.components?.length || 0
      })
    },

    'template:loaded': async function(template) {
      this.services.analytics.trackTemplateUsage(template.id, 'loaded')
    }
  },

  initialize: async function(context) {
    console.log('Analytics Dashboard plugin initialized!')

    // Set feature flag
    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.analytics-dashboard', true)
    }

    return true
  },

  destroy: async function() {
    console.log('Analytics Dashboard plugin destroyed!')
    return true
  }
})

export default analyticsDashboardPlugin
