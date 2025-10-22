/**
 * Advanced AI Features Plugin
 * Enhances card building with advanced AI capabilities
 */

import { createPlugin } from '../../core/Plugin'
import NaturalLanguageBuilder from './components/NaturalLanguageBuilder'
import SmartSuggestions from './components/SmartSuggestions'
import AIAssistant from './components/AIAssistant'

const advancedAIPlugin = createPlugin({
  id: 'advanced-ai',
  name: 'Advanced AI Features',
  version: '1.0.0',
  description: 'Natural language builder, smart suggestions, and AI assistant for card building',
  author: 'CardHelper Team',
  enabled: true,
  dependencies: [], // Could depend on openai API key being configured

  components: {
    NaturalLanguageBuilder,
    SmartSuggestions,
    AIAssistant
  },

  services: {
    ai: {
      // Generate card from natural language
      generateFromDescription: async (description, objectType = 'contact') => {
        try {
          const { aiAPI } = await import('../../../api/api')
          const response = await aiAPI.suggest(description, objectType, [])
          return response.data
        } catch (error) {
          console.error('AI generation failed:', error)
          return null
        }
      },

      // Get smart suggestions for current card
      getSuggestions: async (currentCard) => {
        // This would call an AI endpoint to analyze the card
        // For now, return mock suggestions
        return [
          {
            type: 'layout',
            title: 'Improve Visual Hierarchy',
            description: 'Add a header section to make the card title more prominent',
            impact: 'high'
          }
        ]
      },

      // Generate component recommendations
      recommendComponents: async (objectType, purpose) => {
        const { aiAPI } = await import('../../../api/api')
        const prompt = `Recommend components for a ${objectType} card designed for: ${purpose}`

        try {
          const response = await aiAPI.suggest(prompt, objectType, [])
          return response.data
        } catch (error) {
          console.error('Component recommendation failed:', error)
          return []
        }
      },

      // Auto-generate card title and description
      generateMetadata: async (components) => {
        // Analyze components and generate appropriate title/description
        const componentTypes = components.map(c => c.type).join(', ')

        return {
          title: `Custom Card with ${components.length} components`,
          description: `Displays ${componentTypes}`
        }
      },

      // Smart field mapping suggestions
      suggestFieldMapping: (sourceFields, targetComponent) => {
        // Suggest which fields to map to component properties
        const suggestions = {}

        sourceFields.forEach(field => {
          if (field.name.toLowerCase().includes('email')) {
            suggestions[field.name] = 'email'
          } else if (field.name.toLowerCase().includes('phone')) {
            suggestions[field.name] = 'phone'
          } else if (field.name.toLowerCase().includes('name')) {
            suggestions[field.name] = 'title'
          }
        })

        return suggestions
      }
    }
  },

  config: {
    features: {
      naturalLanguageBuilder: true,
      smartSuggestions: true,
      aiAssistant: true,
      autoFieldMapping: true
    },

    // AI model configuration
    modelSettings: {
      temperature: 0.7,
      maxTokens: 1000,
      model: 'gpt-4-mini'
    }
  },

  hooks: {
    'component:added': async function(component) {
      // When a component is added, could suggest related components
      console.log('Advanced AI: Component added, analyzing for suggestions...')
    },

    'card:saved': async function(card) {
      // When card is saved, could generate metadata or suggestions
      console.log('Advanced AI: Card saved, generating metadata...')
    }
  },

  initialize: async function(context) {
    console.log('Advanced AI Features plugin initialized!')

    // Check if OpenAI API key is configured
    try {
      const { settingsAPI } = await import('../../../api/api')
      const status = await settingsAPI.getKeyStatus('openai')

      if (!status.data.hasKey) {
        console.warn('Advanced AI: OpenAI API key not configured. Some features may not work.')
      } else {
        console.log('Advanced AI: OpenAI API key configured ✓')
      }
    } catch (error) {
      console.error('Advanced AI: Failed to check API key status', error)
    }

    // Set feature flag
    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.advanced-ai', true)
    }

    return true
  },

  destroy: async function() {
    console.log('Advanced AI Features plugin destroyed!')
    return true
  }
})

export default advancedAIPlugin
