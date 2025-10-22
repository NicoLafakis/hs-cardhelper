/**
 * Plugin Manager - React integration for the plugin system
 * Provides hooks and components for working with plugins
 */

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import pluginRegistry from './PluginRegistry'

// Create context for plugin system
const PluginContext = createContext(null)

/**
 * Plugin Provider Component
 * Wraps the app to provide plugin functionality
 */
export function PluginProvider({ children }) {
  const [plugins, setPlugins] = useState([])
  const [initialized, setInitialized] = useState(false)

  // Initialize plugins on mount
  useEffect(() => {
    const init = async () => {
      try {
        // Import all plugin modules
        await loadPlugins()

        // Initialize all enabled plugins
        await pluginRegistry.initializeAll({
          // Add any context needed by plugins
        })

        setPlugins(pluginRegistry.getAllPlugins())
        setInitialized(true)
      } catch (error) {
        console.error('Failed to initialize plugins:', error)
      }
    }

    init()
  }, [])

  // Refresh plugin list
  const refreshPlugins = useCallback(() => {
    setPlugins(pluginRegistry.getAllPlugins())
  }, [])

  // Enable plugin
  const enablePlugin = useCallback(async (pluginId) => {
    await pluginRegistry.enable(pluginId)
    refreshPlugins()
  }, [refreshPlugins])

  // Disable plugin
  const disablePlugin = useCallback(async (pluginId) => {
    await pluginRegistry.disable(pluginId)
    refreshPlugins()
  }, [refreshPlugins])

  // Execute hook
  const executeHook = useCallback(async (hookName, ...args) => {
    await pluginRegistry.executeHook(hookName, ...args)
  }, [])

  const value = {
    plugins,
    initialized,
    enablePlugin,
    disablePlugin,
    executeHook,
    refreshPlugins
  }

  return (
    <PluginContext.Provider value={value}>
      {children}
    </PluginContext.Provider>
  )
}

/**
 * Hook to access plugin system
 */
export function usePlugins() {
  const context = useContext(PluginContext)

  if (!context) {
    throw new Error('usePlugins must be used within PluginProvider')
  }

  return context
}

/**
 * Hook to check if a plugin is enabled
 */
export function usePluginEnabled(pluginId) {
  const { plugins } = usePlugins()
  const plugin = plugins.find(p => p.id === pluginId)
  return plugin ? plugin.enabled : false
}

/**
 * Hook to execute a plugin hook
 */
export function usePluginHook(hookName) {
  const { executeHook } = usePlugins()

  return useCallback(
    (...args) => executeHook(hookName, ...args),
    [executeHook, hookName]
  )
}

/**
 * Component to conditionally render based on plugin state
 */
export function PluginGuard({ pluginId, children, fallback = null }) {
  const enabled = usePluginEnabled(pluginId)

  return enabled ? children : fallback
}

/**
 * Load all plugin modules
 */
async function loadPlugins() {
  // This will be populated as we create plugins
  // For now, just a placeholder
  const pluginModules = import.meta.glob('../plugins/*/index.js', { eager: true })

  for (const path in pluginModules) {
    const module = pluginModules[path]
    if (module.default) {
      pluginRegistry.register(module.default)
    }
  }
}

export default PluginProvider
