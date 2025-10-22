/**
 * Plugin Registry - Central hub for managing all plugins
 * Handles plugin registration, initialization, and lifecycle
 */

class PluginRegistry {
  constructor() {
    this.plugins = new Map()
    this.initializedPlugins = new Set()
    this.hooks = new Map()
  }

  /**
   * Register a plugin
   * @param {Object} plugin - Plugin configuration
   * @param {string} plugin.id - Unique plugin identifier
   * @param {string} plugin.name - Display name
   * @param {string} plugin.version - Plugin version
   * @param {Function} plugin.initialize - Initialization function
   * @param {Function} plugin.destroy - Cleanup function
   * @param {Array} plugin.dependencies - Array of plugin IDs this depends on
   * @param {Object} plugin.config - Plugin configuration
   */
  register(plugin) {
    if (!plugin.id) {
      throw new Error('Plugin must have an id')
    }

    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin ${plugin.id} is already registered`)
      return
    }

    // Validate plugin structure
    this.validatePlugin(plugin)

    this.plugins.set(plugin.id, {
      ...plugin,
      enabled: plugin.enabled !== false, // Default to enabled
      initialized: false,
      dependencies: plugin.dependencies || [],
      config: plugin.config || {}
    })

    console.log(`✓ Plugin registered: ${plugin.name} (${plugin.id})`)
  }

  /**
   * Initialize a plugin
   */
  async initialize(pluginId, context = {}) {
    const plugin = this.plugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    if (this.initializedPlugins.has(pluginId)) {
      console.warn(`Plugin ${pluginId} already initialized`)
      return
    }

    if (!plugin.enabled) {
      console.log(`Plugin ${pluginId} is disabled, skipping initialization`)
      return
    }

    // Initialize dependencies first
    for (const depId of plugin.dependencies) {
      if (!this.initializedPlugins.has(depId)) {
        await this.initialize(depId, context)
      }
    }

    // Run plugin initialization
    try {
      if (plugin.initialize) {
        await plugin.initialize(context)
      }

      this.initializedPlugins.add(pluginId)
      plugin.initialized = true

      console.log(`✓ Plugin initialized: ${plugin.name}`)
    } catch (error) {
      console.error(`Failed to initialize plugin ${pluginId}:`, error)
      throw error
    }
  }

  /**
   * Initialize all registered plugins
   */
  async initializeAll(context = {}) {
    const pluginIds = Array.from(this.plugins.keys())

    for (const pluginId of pluginIds) {
      const plugin = this.plugins.get(pluginId)
      if (plugin.enabled && !this.initializedPlugins.has(pluginId)) {
        await this.initialize(pluginId, context)
      }
    }
  }

  /**
   * Destroy a plugin
   */
  async destroy(pluginId) {
    const plugin = this.plugins.get(pluginId)

    if (!plugin || !this.initializedPlugins.has(pluginId)) {
      return
    }

    try {
      if (plugin.destroy) {
        await plugin.destroy()
      }

      this.initializedPlugins.delete(pluginId)
      plugin.initialized = false

      console.log(`✓ Plugin destroyed: ${plugin.name}`)
    } catch (error) {
      console.error(`Failed to destroy plugin ${pluginId}:`, error)
    }
  }

  /**
   * Enable a plugin
   */
  async enable(pluginId, context = {}) {
    const plugin = this.plugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    plugin.enabled = true

    if (!this.initializedPlugins.has(pluginId)) {
      await this.initialize(pluginId, context)
    }
  }

  /**
   * Disable a plugin
   */
  async disable(pluginId) {
    const plugin = this.plugins.get(pluginId)

    if (!plugin) {
      throw new Error(`Plugin ${pluginId} not found`)
    }

    plugin.enabled = false

    if (this.initializedPlugins.has(pluginId)) {
      await this.destroy(pluginId)
    }
  }

  /**
   * Get plugin by ID
   */
  getPlugin(pluginId) {
    return this.plugins.get(pluginId)
  }

  /**
   * Get all plugins
   */
  getAllPlugins() {
    return Array.from(this.plugins.values())
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins() {
    return this.getAllPlugins().filter(p => p.enabled)
  }

  /**
   * Check if plugin is enabled
   */
  isEnabled(pluginId) {
    const plugin = this.plugins.get(pluginId)
    return plugin ? plugin.enabled : false
  }

  /**
   * Register a hook
   */
  registerHook(hookName, callback, pluginId) {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, [])
    }

    this.hooks.get(hookName).push({
      callback,
      pluginId
    })
  }

  /**
   * Execute hooks
   */
  async executeHook(hookName, ...args) {
    const hooks = this.hooks.get(hookName) || []

    for (const hook of hooks) {
      const plugin = this.plugins.get(hook.pluginId)

      if (plugin && plugin.enabled) {
        try {
          await hook.callback(...args)
        } catch (error) {
          console.error(`Error executing hook ${hookName} for plugin ${hook.pluginId}:`, error)
        }
      }
    }
  }

  /**
   * Validate plugin structure
   */
  validatePlugin(plugin) {
    const required = ['id', 'name', 'version']

    for (const field of required) {
      if (!plugin[field]) {
        throw new Error(`Plugin missing required field: ${field}`)
      }
    }

    if (plugin.initialize && typeof plugin.initialize !== 'function') {
      throw new Error('Plugin initialize must be a function')
    }

    if (plugin.destroy && typeof plugin.destroy !== 'function') {
      throw new Error('Plugin destroy must be a function')
    }
  }

  /**
   * Clear all plugins (useful for testing)
   */
  clear() {
    this.plugins.clear()
    this.initializedPlugins.clear()
    this.hooks.clear()
  }
}

// Create singleton instance
const pluginRegistry = new PluginRegistry()

export default pluginRegistry
