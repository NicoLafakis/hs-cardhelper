/**
 * Advanced Components Plugin
 * Adds powerful new component types to the card builder
 */

import { createPlugin } from '../../core/Plugin'
import ChartComponent from './components/ChartComponent'
import TimelineComponent from './components/TimelineComponent'
import GalleryComponent from './components/GalleryComponent'
import VideoComponent from './components/VideoComponent'
import CustomHTMLComponent from './components/CustomHTMLComponent'
import ProgressComponent from './components/ProgressComponent'

const advancedComponentsPlugin = createPlugin({
  id: 'advanced-components',
  name: 'Advanced Components',
  version: '1.0.0',
  description: 'Adds charts, timelines, galleries, videos, and custom HTML components',
  author: 'CardHelper Team',
  enabled: true,

  // Register all new component types
  components: {
    ChartComponent,
    TimelineComponent,
    GalleryComponent,
    VideoComponent,
    CustomHTMLComponent,
    ProgressComponent
  },

  // Component metadata for the builder
  config: {
    componentTypes: [
      {
        id: 'chart',
        name: 'Chart',
        category: 'data-visualization',
        icon: 'BarChart3',
        component: ChartComponent,
        defaultConfig: {
          type: 'bar',
          data: [
            { name: 'Jan', value: 400 },
            { name: 'Feb', value: 300 },
            { name: 'Mar', value: 600 },
            { name: 'Apr', value: 800 },
            { name: 'May', value: 500 }
          ],
          xKey: 'name',
          yKey: 'value',
          title: 'Monthly Data',
          height: 300
        },
        properties: [
          { key: 'type', label: 'Chart Type', type: 'select', options: ['bar', 'line', 'area', 'pie'] },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'height', label: 'Height (px)', type: 'number' },
          { key: 'xKey', label: 'X-Axis Key', type: 'text' },
          { key: 'yKey', label: 'Y-Axis Key', type: 'text' }
        ]
      },
      {
        id: 'timeline',
        name: 'Timeline',
        category: 'data-visualization',
        icon: 'Timeline',
        component: TimelineComponent,
        defaultConfig: {
          title: 'Activity Timeline',
          events: [
            {
              date: new Date().toISOString(),
              title: 'Recent Activity',
              description: 'Latest event in the timeline'
            }
          ],
          showDates: true,
          showTimes: false
        },
        properties: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'showDates', label: 'Show Dates', type: 'boolean' },
          { key: 'showTimes', label: 'Show Times', type: 'boolean' }
        ]
      },
      {
        id: 'gallery',
        name: 'Image Gallery',
        category: 'media',
        icon: 'Images',
        component: GalleryComponent,
        defaultConfig: {
          title: 'Gallery',
          images: [],
          columns: 3,
          showCaptions: true
        },
        properties: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'columns', label: 'Columns', type: 'number', min: 1, max: 4 },
          { key: 'showCaptions', label: 'Show Captions', type: 'boolean' }
        ]
      },
      {
        id: 'video',
        name: 'Video',
        category: 'media',
        icon: 'Video',
        component: VideoComponent,
        defaultConfig: {
          url: '',
          title: 'Video',
          autoplay: false,
          controls: true,
          loop: false,
          muted: false,
          height: '360px'
        },
        properties: [
          { key: 'url', label: 'Video URL', type: 'text', placeholder: 'https://www.youtube.com/watch?v=...' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'autoplay', label: 'Autoplay', type: 'boolean' },
          { key: 'controls', label: 'Show Controls', type: 'boolean' },
          { key: 'loop', label: 'Loop', type: 'boolean' },
          { key: 'muted', label: 'Muted', type: 'boolean' }
        ]
      },
      {
        id: 'custom-html',
        name: 'Custom HTML',
        category: 'advanced',
        icon: 'Code',
        component: CustomHTMLComponent,
        defaultConfig: {
          html: '<p>Your custom HTML here...</p>',
          title: 'Custom Content',
          allowScripts: false
        },
        properties: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'html', label: 'HTML Content', type: 'textarea' },
          { key: 'allowScripts', label: 'Allow Scripts (UNSAFE)', type: 'boolean' }
        ]
      },
      {
        id: 'progress',
        name: 'Progress Bar',
        category: 'metrics',
        icon: 'Activity',
        component: ProgressComponent,
        defaultConfig: {
          value: 65,
          max: 100,
          label: 'Progress',
          showPercentage: true,
          showValue: true,
          color: 'blue',
          size: 'md'
        },
        properties: [
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'value', label: 'Current Value', type: 'number' },
          { key: 'max', label: 'Maximum Value', type: 'number' },
          { key: 'color', label: 'Color', type: 'select', options: ['blue', 'green', 'red', 'yellow', 'purple', 'gray'] },
          { key: 'size', label: 'Size', type: 'select', options: ['sm', 'md', 'lg'] },
          { key: 'showPercentage', label: 'Show Percentage', type: 'boolean' },
          { key: 'showValue', label: 'Show Value', type: 'boolean' }
        ]
      }
    ]
  },

  // Plugin initialization
  initialize: async function(context) {
    console.log('Advanced Components plugin initialized!')
    console.log('Registered components:', Object.keys(this.components))

    // Register component types in the builder store if available
    if (context.registerComponentTypes) {
      this.config.componentTypes.forEach(componentType => {
        context.registerComponentTypes(componentType)
      })
    }

    // Set feature flag
    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.advanced-components', true)
    }

    return true
  },

  destroy: async function() {
    console.log('Advanced Components plugin destroyed!')
    return true
  },

  // Helper functions for components
  services: {
    chart: {
      // Helper to format data for charts
      formatChartData: (data, xKey, yKey) => {
        if (!Array.isArray(data)) return []
        return data.map(item => ({
          [xKey]: item[xKey] || item.name || item.label,
          [yKey]: Number(item[yKey] || item.value || 0)
        }))
      },

      // Generate sample chart data
      generateSampleData: (count = 5) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return Array.from({ length: count }, (_, i) => ({
          name: months[i],
          value: Math.floor(Math.random() * 1000)
        }))
      }
    },

    timeline: {
      // Sort events by date
      sortEvents: (events) => {
        return [...events].sort((a, b) => new Date(b.date) - new Date(a.date))
      },

      // Group events by date
      groupByDate: (events) => {
        const groups = {}
        events.forEach(event => {
          const date = new Date(event.date).toDateString()
          if (!groups[date]) groups[date] = []
          groups[date].push(event)
        })
        return groups
      }
    },

    gallery: {
      // Validate image URLs
      validateImages: (images) => {
        return images.filter(img => {
          const url = img.url || img.src || img
          return typeof url === 'string' && url.length > 0
        })
      },

      // Create thumbnail URLs
      createThumbnail: (url, size = '200x200') => {
        // This could integrate with an image service
        return url
      }
    }
  }
})

export default advancedComponentsPlugin
