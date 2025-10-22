/**
 * Export/Import Plugin
 * Adds ability to export and import templates as JSON files
 */

import { createPlugin } from '../../core/Plugin'

const exportImportPlugin = createPlugin({
  id: 'export-import',
  name: 'Export/Import Templates',
  version: '1.0.0',
  description: 'Export and import templates as JSON files',
  author: 'CardHelper Team',
  enabled: true,

  // Plugin services
  services: {
    export: {
      exportTemplate: (template) => {
        const json = JSON.stringify(template, null, 2)
        const blob = new Blob([json], { type: 'application/json' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${template.name}.json`
        link.click()

        URL.revokeObjectURL(url)
      }
    },
    import: {
      importTemplate: async (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()

          reader.onload = (e) => {
            try {
              const template = JSON.parse(e.target.result)
              resolve(template)
            } catch (error) {
              reject(new Error('Invalid template file'))
            }
          }

          reader.onerror = () => reject(new Error('Failed to read file'))
          reader.readAsText(file)
        })
      }
    }
  },

  initialize: async function(context) {
    console.log('Export/Import plugin initialized!')

    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.export-import', true)
    }

    return true
  },

  destroy: async function() {
    console.log('Export/Import plugin destroyed!')
    return true
  }
})

export default exportImportPlugin
