/**
 * Base Plugin Class
 * Provides a template for creating new plugins
 */

export class Plugin {
  constructor(config = {}) {
    this.id = config.id || this.constructor.name
    this.name = config.name || this.id
    this.version = config.version || '1.0.0'
    this.description = config.description || ''
    this.author = config.author || ''
    this.enabled = config.enabled !== false
    this.dependencies = config.dependencies || []
    this.config = config.config || {}

    // Plugin can provide these
    this.components = config.components || {} // React components to register
    this.routes = config.routes || [] // Additional routes
    this.services = config.services || {} // Services to register
    this.hooks = config.hooks || {} // Hook listeners
    this.settings = config.settings || [] // Plugin settings schema
  }

  /**
   * Initialize the plugin
   * Override this in your plugin class
   */
  async initialize(context) {
    console.log(`Initializing plugin: ${this.name}`)

    // Register hooks
    if (this.hooks) {
      this.registerHooks(context)
    }
  }

  /**
   * Cleanup when plugin is disabled/destroyed
   * Override this in your plugin class
   */
  async destroy() {
    console.log(`Destroying plugin: ${this.name}`)
  }

  /**
   * Register plugin hooks
   */
  registerHooks(context) {
    if (!context.pluginRegistry) return

    for (const [hookName, callback] of Object.entries(this.hooks)) {
      context.pluginRegistry.registerHook(
        hookName,
        callback.bind(this),
        this.id
      )
    }
  }

  /**
   * Get plugin configuration
   */
  getConfig() {
    return {
      id: this.id,
      name: this.name,
      version: this.version,
      description: this.description,
      author: this.author,
      enabled: this.enabled,
      dependencies: this.dependencies,
      config: this.config,
      components: this.components,
      routes: this.routes,
      services: this.services,
      settings: this.settings,
      initialize: this.initialize.bind(this),
      destroy: this.destroy.bind(this)
    }
  }
}

/**
 * Helper function to create a plugin
 */
export function createPlugin(config) {
  return {
    id: config.id,
    name: config.name || config.id,
    version: config.version || '1.0.0',
    description: config.description || '',
    author: config.author || '',
    enabled: config.enabled !== false,
    dependencies: config.dependencies || [],
    config: config.config || {},
    components: config.components || {},
    routes: config.routes || [],
    services: config.services || {},
    hooks: config.hooks || {},
    settings: config.settings || [],
    initialize: config.initialize || (async () => {}),
    destroy: config.destroy || (async () => {})
  }
}

export default Plugin
