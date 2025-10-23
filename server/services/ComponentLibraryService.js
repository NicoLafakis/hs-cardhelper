/**
 * Component Library Service
 * Manages component creation, usage, analytics, and marketplace
 */

export class ComponentLibraryService {
  constructor(db) {
    this.db = db
    this.components = new Map() // In-memory cache
    this.analyticsCache = new Map()
  }

  /**
   * Create or register a new component
   */
  async createComponent(componentData, userId) {
    const {
      name,
      type,
      category,
      description,
      props = {},
      defaultProps = {},
      validation = {},
      accessibility = {},
      responsiveConfig = {}
    } = componentData

    try {
      const result = await this.db.execute(
        `INSERT INTO components (name, type, category, description, props, defaultProps, 
         validation, accessibility, responsive_config, created_by)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, type, category, description, JSON.stringify(props), JSON.stringify(defaultProps),
         JSON.stringify(validation), JSON.stringify(accessibility), 
         JSON.stringify(responsiveConfig), userId]
      )

      const component = {
        id: result.insertId,
        component_id: `comp-${result.insertId}-${Date.now()}`,
        name,
        type,
        category,
        description,
        props,
        defaultProps,
        validation,
        accessibility,
        responsiveConfig,
        created_by: userId,
        created_at: new Date()
      }

      // Update component ID
      await this.db.execute(
        `UPDATE components SET component_id = ? WHERE id = ?`,
        [component.component_id, result.insertId]
      )

      this.components.set(component.component_id, component)
      return component
    } catch (error) {
      throw new Error(`Failed to create component: ${error.message}`)
    }
  }

  /**
   * Get component by ID
   */
  async getComponent(componentId) {
    const cached = this.components.get(componentId)
    if (cached) return cached

    const result = await this.db.execute(
      `SELECT * FROM components WHERE component_id = ?`,
      [componentId]
    )

    if (result.length === 0) {
      throw new Error(`Component not found: ${componentId}`)
    }

    const component = this._parseComponentRow(result[0])
    this.components.set(componentId, component)
    return component
  }

  /**
   * Get all components by type
   */
  async getComponentsByType(type) {
    const result = await this.db.execute(
      `SELECT * FROM components WHERE type = ? ORDER BY name ASC`,
      [type]
    )

    return result.map(row => this._parseComponentRow(row))
  }

  /**
   * Get all components by category
   */
  async getComponentsByCategory(category) {
    const result = await this.db.execute(
      `SELECT * FROM components WHERE category = ? ORDER BY name ASC`,
      [category]
    )

    return result.map(row => this._parseComponentRow(row))
  }

  /**
   * Get all available components
   */
  async getAllComponents(filters = {}) {
    let query = 'SELECT * FROM components WHERE 1=1'
    const params = []

    if (filters.type) {
      query += ' AND type = ?'
      params.push(filters.type)
    }

    if (filters.category) {
      query += ' AND category = ?'
      params.push(filters.category)
    }

    if (filters.search) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${filters.search}%`, `%${filters.search}%`)
    }

    query += ' ORDER BY name ASC'

    const result = await this.db.execute(query, params)
    return result.map(row => this._parseComponentRow(row))
  }

  /**
   * Create component instance on a card
   */
  async createComponentInstance(cardId, componentId, instanceProps) {
    try {
      const component = await this.getComponent(componentId)

      // Merge defaults with provided props
      const finalProps = { ...component.defaultProps, ...instanceProps }

      // Validate props
      this._validateProps(finalProps, component.validation)

      const result = await this.db.execute(
        `INSERT INTO component_instances (card_id, component_id, instance_id, props)
         VALUES (?, ?, ?, ?)`,
        [cardId, component.id, `inst-${component.id}-${Date.now()}`, JSON.stringify(finalProps)]
      )

      // Track usage
      await this.trackComponentUsage(component.id, cardId)

      return {
        id: result.insertId,
        instance_id: `inst-${component.id}-${Date.now()}`,
        card_id: cardId,
        component_id: componentId,
        props: finalProps,
        created_at: new Date()
      }
    } catch (error) {
      throw new Error(`Failed to create component instance: ${error.message}`)
    }
  }

  /**
   * Update component instance
   */
  async updateComponentInstance(instanceId, updates) {
    const { props, styles, animations, dataBinding, eventHandlers } = updates

    try {
      const setParts = []
      const params = []

      if (props) {
        setParts.push('props = ?')
        params.push(JSON.stringify(props))
      }
      if (styles) {
        setParts.push('styles = ?')
        params.push(JSON.stringify(styles))
      }
      if (animations) {
        setParts.push('animations = ?')
        params.push(JSON.stringify(animations))
      }
      if (dataBinding) {
        setParts.push('data_binding = ?')
        params.push(JSON.stringify(dataBinding))
      }
      if (eventHandlers) {
        setParts.push('event_handlers = ?')
        params.push(JSON.stringify(eventHandlers))
      }

      params.push(instanceId)

      await this.db.execute(
        `UPDATE component_instances SET ${setParts.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        params
      )

      return { success: true, message: 'Component instance updated' }
    } catch (error) {
      throw new Error(`Failed to update component instance: ${error.message}`)
    }
  }

  /**
   * Get card component instances
   */
  async getCardComponents(cardId) {
    const result = await this.db.execute(
      `SELECT ci.*, c.name, c.type, c.props, c.defaultProps
       FROM component_instances ci
       JOIN components c ON ci.component_id = c.id
       WHERE ci.card_id = ?
       ORDER BY ci.created_at DESC`,
      [cardId]
    )

    return result.map(row => ({
      id: row.id,
      instance_id: row.instance_id,
      card_id: row.card_id,
      component_id: row.component_id,
      component_name: row.name,
      component_type: row.type,
      props: JSON.parse(row.props || '{}'),
      styles: JSON.parse(row.styles || '{}'),
      animations: JSON.parse(row.animations || '{}'),
      dataBinding: JSON.parse(row.data_binding || '{}'),
      eventHandlers: JSON.parse(row.event_handlers || '{}'),
      created_at: row.created_at
    }))
  }

  /**
   * Delete component instance
   */
  async deleteComponentInstance(instanceId) {
    try {
      await this.db.execute(
        `DELETE FROM component_instances WHERE id = ?`,
        [instanceId]
      )
      return { success: true, message: 'Component instance deleted' }
    } catch (error) {
      throw new Error(`Failed to delete component instance: ${error.message}`)
    }
  }

  /**
   * Track component usage for analytics
   */
  async trackComponentUsage(componentId, cardId, userId = null) {
    try {
      const existing = await this.db.execute(
        `SELECT * FROM component_usage_analytics WHERE component_id = ? AND card_id = ?`,
        [componentId, cardId]
      )

      if (existing.length > 0) {
        await this.db.execute(
          `UPDATE component_usage_analytics SET usage_count = usage_count + 1, 
           last_used = CURRENT_TIMESTAMP WHERE component_id = ? AND card_id = ?`,
          [componentId, cardId]
        )
      } else {
        await this.db.execute(
          `INSERT INTO component_usage_analytics (component_id, card_id, user_id)
           VALUES (?, ?, ?)`,
          [componentId, cardId, userId]
        )
      }
    } catch (error) {
      console.error('Failed to track component usage:', error)
    }
  }

  /**
   * Get component usage analytics
   */
  async getComponentAnalytics(componentId) {
    const result = await this.db.execute(
      `SELECT * FROM component_usage_analytics WHERE component_id = ? ORDER BY usage_count DESC`,
      [componentId]
    )

    return {
      component_id: componentId,
      total_usage: result.reduce((sum, row) => sum + row.usage_count, 0),
      usage_by_card: result,
      most_used_cards: result.slice(0, 5)
    }
  }

  /**
   * Get most popular components
   */
  async getPopularComponents(limit = 10) {
    const result = await this.db.execute(
      `SELECT c.*, COUNT(cia.id) as total_usage, AVG(cia.usage_count) as avg_usage
       FROM components c
       LEFT JOIN component_usage_analytics cia ON c.id = cia.component_id
       GROUP BY c.id
       ORDER BY total_usage DESC
       LIMIT ?`,
      [limit]
    )

    return result.map(row => ({
      ...this._parseComponentRow(row),
      total_usage: row.total_usage || 0,
      avg_usage: parseFloat(row.avg_usage) || 0
    }))
  }

  /**
   * Publish component to marketplace
   */
  async publishComponentToMarketplace(componentId, marketplaceData, creatorId) {
    try {
      const result = await this.db.execute(
        `INSERT INTO component_marketplace (component_id, creator_id, title, description, 
         thumbnail_url, preview_url, tags, source_code, dependencies)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          componentId,
          creatorId,
          marketplaceData.title,
          marketplaceData.description,
          marketplaceData.thumbnail_url,
          marketplaceData.preview_url,
          JSON.stringify(marketplaceData.tags || []),
          JSON.stringify(marketplaceData.source_code || {}),
          JSON.stringify(marketplaceData.dependencies || [])
        ]
      )

      return { success: true, marketplace_id: result.insertId }
    } catch (error) {
      throw new Error(`Failed to publish component: ${error.message}`)
    }
  }

  /**
   * Get marketplace components
   */
  async getMarketplaceComponents(filters = {}) {
    let query = `SELECT * FROM component_marketplace WHERE is_public = TRUE`
    const params = []

    if (filters.search) {
      query += ` AND (title LIKE ? OR description LIKE ? OR tags LIKE ?)`
      params.push(`%${filters.search}%`, `%${filters.search}%`, `%${filters.search}%`)
    }

    if (filters.sort === 'popular') {
      query += ` ORDER BY download_count DESC`
    } else if (filters.sort === 'rated') {
      query += ` ORDER BY rating DESC`
    } else {
      query += ` ORDER BY created_at DESC`
    }

    const limit = filters.limit || 20
    const offset = filters.offset || 0
    query += ` LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const result = await this.db.execute(query, params)
    return result.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      source_code: JSON.parse(row.source_code || '{}'),
      dependencies: JSON.parse(row.dependencies || '[]')
    }))
  }

  /**
   * Create component version
   */
  async createComponentVersion(componentId, versionData, userId) {
    try {
      // Get current version number
      const versionResult = await this.db.execute(
        `SELECT MAX(version_number) as max_version FROM component_versions WHERE component_id = ?`,
        [componentId]
      )

      const nextVersion = (versionResult[0]?.max_version || 0) + 1

      await this.db.execute(
        `INSERT INTO component_versions (component_id, version_number, changes_description, 
         props_schema, component_code, created_by)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          componentId,
          nextVersion,
          versionData.changes_description,
          JSON.stringify(versionData.props_schema || {}),
          JSON.stringify(versionData.component_code || {}),
          userId
        ]
      )

      return { success: true, version: nextVersion }
    } catch (error) {
      throw new Error(`Failed to create component version: ${error.message}`)
    }
  }

  /**
   * Private helper methods
   */
  _parseComponentRow(row) {
    return {
      id: row.id,
      component_id: row.component_id,
      name: row.name,
      type: row.type,
      category: row.category,
      description: row.description,
      props: JSON.parse(row.props || '{}'),
      defaultProps: JSON.parse(row.defaultProps || '{}'),
      validation: JSON.parse(row.validation || '{}'),
      accessibility: JSON.parse(row.accessibility || '{}'),
      responsiveConfig: JSON.parse(row.responsive_config || '{}'),
      created_by: row.created_by,
      created_at: row.created_at
    }
  }

  _validateProps(props, validationRules) {
    for (const [key, rule] of Object.entries(validationRules)) {
      const value = props[key]

      if (rule.required && value === undefined) {
        throw new Error(`Property '${key}' is required`)
      }

      if (rule.type && value !== undefined && typeof value !== rule.type) {
        throw new Error(`Property '${key}' must be of type ${rule.type}`)
      }

      if (rule.enum && value !== undefined && !rule.enum.includes(value)) {
        throw new Error(`Property '${key}' must be one of: ${rule.enum.join(', ')}`)
      }

      if (rule.minLength && value?.length < rule.minLength) {
        throw new Error(`Property '${key}' must have minimum length ${rule.minLength}`)
      }

      if (rule.maxLength && value?.length > rule.maxLength) {
        throw new Error(`Property '${key}' must have maximum length ${rule.maxLength}`)
      }
    }
  }
}

export default ComponentLibraryService
