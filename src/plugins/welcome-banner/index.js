/**
 * Welcome Banner Plugin
 * Example plugin that demonstrates the plugin system
 */

import { createPlugin } from '../../core/Plugin'
import WelcomeBanner from './components/WelcomeBanner'

const welcomeBannerPlugin = createPlugin({
  id: 'welcome-banner',
  name: 'Welcome Banner',
  version: '1.0.0',
  description: 'Displays a welcoming banner on the builder page',
  author: 'CardHelper Team',
  enabled: true,

  // Components provided by this plugin
  components: {
    WelcomeBanner
  },

  // Plugin settings
  settings: [
    {
      key: 'message',
      label: 'Banner Message',
      type: 'text',
      default: 'Welcome to CardHelper!'
    },
    {
      key: 'color',
      label: 'Banner Color',
      type: 'select',
      options: [
        { value: 'blue', label: 'Blue' },
        { value: 'purple', label: 'Purple' },
        { value: 'green', label: 'Green' }
      ],
      default: 'blue'
    }
  ],

  // Plugin hooks
  hooks: {
    'app:mounted': async function() {
      console.log('Welcome Banner plugin: App mounted')
    },
    'builder:opened': async function() {
      console.log('Welcome Banner plugin: Builder opened')
    }
  },

  // Initialize plugin
  initialize: async function(context) {
    console.log('Welcome Banner plugin initialized!')

    // You can access app context here
    // context.store, context.api, etc.

    // Register feature flag
    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.welcome-banner', true)
    }

    return true
  },

  // Cleanup when plugin is disabled
  destroy: async function() {
    console.log('Welcome Banner plugin destroyed!')
    return true
  }
})

export default welcomeBannerPlugin
