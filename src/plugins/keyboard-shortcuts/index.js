/**
 * Keyboard Shortcuts Plugin
 * Adds advanced keyboard shortcuts to the app
 */

import { createPlugin } from '../../core/Plugin'

const keyboardShortcutsPlugin = createPlugin({
  id: 'keyboard-shortcuts',
  name: 'Keyboard Shortcuts',
  version: '1.0.0',
  description: 'Advanced keyboard shortcuts for power users',
  author: 'CardHelper Team',
  enabled: true,

  // Shortcuts configuration
  config: {
    shortcuts: [
      {
        key: 'ctrl+s',
        action: 'save',
        description: 'Save current template'
      },
      {
        key: 'ctrl+shift+s',
        action: 'saveAs',
        description: 'Save template as...'
      },
      {
        key: 'ctrl+n',
        action: 'new',
        description: 'New template'
      },
      {
        key: 'ctrl+o',
        action: 'open',
        description: 'Open template'
      },
      {
        key: 'delete',
        action: 'deleteComponent',
        description: 'Delete selected component'
      },
      {
        key: 'ctrl+d',
        action: 'duplicateComponent',
        description: 'Duplicate selected component'
      }
    ]
  },

  initialize: async function(context) {
    console.log('Keyboard Shortcuts plugin initialized!')

    // Register keyboard event listener
    this.handleKeydown = (e) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.key.toLowerCase()
      ].filter(Boolean).join('+')

      const shortcut = this.config.shortcuts.find(s => s.key === key)

      if (shortcut) {
        e.preventDefault()
        console.log(`Executing shortcut: ${shortcut.action}`)
        // Execute action via hook
        context.pluginRegistry?.executeHook(`shortcut:${shortcut.action}`, e)
      }
    }

    window.addEventListener('keydown', this.handleKeydown)

    if (context.featureFlags) {
      context.featureFlags.setFlag('plugin.keyboard-shortcuts', true)
    }

    return true
  },

  destroy: async function() {
    console.log('Keyboard Shortcuts plugin destroyed!')

    // Clean up event listener
    if (this.handleKeydown) {
      window.removeEventListener('keydown', this.handleKeydown)
    }

    return true
  }
})

export default keyboardShortcutsPlugin
