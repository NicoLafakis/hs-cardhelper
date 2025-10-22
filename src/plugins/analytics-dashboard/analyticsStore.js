/**
 * Analytics Store
 * Stores and manages analytics data
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAnalyticsStore = create(
  persist(
    (set, get) => ({
      // Events log
      events: [],

      // Template usage tracking
      templates: [],

      // Component usage stats
      componentStats: {},

      /**
       * Add an analytics event
       */
      addEvent: (eventName, data = {}) => set((state) => ({
        events: [
          ...state.events,
          {
            name: eventName,
            data,
            timestamp: new Date().toISOString()
          }
        ]
      })),

      /**
       * Track template usage
       */
      trackTemplate: (templateId, action) => set((state) => {
        const existing = state.templates.find(t => t.id === templateId)

        if (existing) {
          return {
            templates: state.templates.map(t =>
              t.id === templateId
                ? {
                    ...t,
                    uses: t.uses + 1,
                    lastUsed: new Date().toISOString(),
                    actions: [...(t.actions || []), { action, timestamp: new Date().toISOString() }]
                  }
                : t
            )
          }
        } else {
          return {
            templates: [
              ...state.templates,
              {
                id: templateId,
                uses: 1,
                lastUsed: new Date().toISOString(),
                actions: [{ action, timestamp: new Date().toISOString() }]
              }
            ]
          }
        }
      }),

      /**
       * Track component usage
       */
      trackComponent: (componentType) => set((state) => ({
        componentStats: {
          ...state.componentStats,
          [componentType]: (state.componentStats[componentType] || 0) + 1
        }
      })),

      /**
       * Get popular components
       */
      getPopularComponents: () => {
        const { componentStats } = get()
        return Object.entries(componentStats)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      },

      /**
       * Get events in time range
       */
      getEventsInRange: (startDate, endDate) => {
        const { events } = get()
        return events.filter(e => {
          const eventDate = new Date(e.timestamp)
          return eventDate >= startDate && eventDate <= endDate
        })
      },

      /**
       * Clear all analytics data
       */
      clearAll: () => set({
        events: [],
        templates: [],
        componentStats: {}
      }),

      /**
       * Get summary stats
       */
      getSummary: () => {
        const { events, templates, componentStats } = get()

        return {
          totalEvents: events.length,
          totalTemplates: templates.length,
          totalComponents: Object.values(componentStats).reduce((a, b) => a + b, 0),
          mostUsedTemplate: templates.sort((a, b) => b.uses - a.uses)[0],
          mostUsedComponent: Object.entries(componentStats)
            .sort(([, a], [, b]) => b - a)[0]?.[0]
        }
      }
    }),
    {
      name: 'analytics-storage',
      version: 1
    }
  )
)

export default useAnalyticsStore
