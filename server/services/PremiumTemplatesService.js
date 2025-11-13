/**
 * Premium Templates Service
 * Backend business logic for template management
 */

class PremiumTemplatesService {
  constructor(db) {
    this.db = db
    this.templateCache = new Map()
    this.cacheTTL = 3600000 // 1 hour
  }

  /**
   * Create a new template
   */
  async createTemplate(templateData, userId) {
    const {
      name,
      description,
      category,
      thumbnailUrl,
      previewHtml,
      componentStructure,
      designTokens = {},
      defaultValues = {},
      tags = [],
      responsiveConfig = {},
      animations = {},
      accessibilityNotes = '',
      seoKeywords = ''
    } = templateData

    if (!name || !category || !componentStructure) {
      throw new Error('Template name, category, and component structure are required')
    }

    const templateId = this._generateId()
    const now = new Date().toISOString()

    await this.db.execute(
      `INSERT INTO premium_templates (
        id, name, description, category, thumbnail_url, preview_html,
        component_structure, design_tokens, default_values, author_id,
        tags, responsive_config, animations, accessibility_notes, seo_keywords,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        templateId, name, description, category, thumbnailUrl, previewHtml,
        JSON.stringify(componentStructure), JSON.stringify(designTokens),
        JSON.stringify(defaultValues), userId, JSON.stringify(tags),
        JSON.stringify(responsiveConfig), JSON.stringify(animations),
        accessibilityNotes, seoKeywords, now, now
      ]
    )

    return { id: templateId, name, category, ...templateData }
  }

  /**
   * Get template by ID
   */
  async getTemplate(templateId) {
    // Check cache first
    if (this.templateCache.has(templateId)) {
      const cached = this.templateCache.get(templateId)
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data
      }
      this.templateCache.delete(templateId)
    }

    const [rows] = await this.db.execute(
      'SELECT * FROM premium_templates WHERE id = ? AND deleted_at IS NULL',
      [templateId]
    )

    if (rows.length === 0) return null

    const template = this._parseTemplateRow(rows[0])

    // Cache it
    this.templateCache.set(templateId, {
      data: template,
      timestamp: Date.now()
    })

    return template
  }

  /**
   * Get all templates with filters
   */
  async getAllTemplates(filters = {}) {
    const {
      category = null,
      search = '',
      isFeatured = false,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      limit = 100,
      offset = 0
    } = filters

    // Whitelist allowed sort columns to prevent SQL injection
    const allowedSortColumns = [
      'created_at', 'updated_at', 'name', 'category',
      'rating', 'download_count', 'clone_count'
    ]
    const validSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'

    // Validate sort order
    const validSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'

    let query = 'SELECT * FROM premium_templates WHERE deleted_at IS NULL'
    const params = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)'
      params.push(`%${search}%`, `%${search}%`)
    }

    if (isFeatured) {
      query += ' AND is_featured = TRUE'
    }

    query += ` ORDER BY ${validSortBy} ${validSortOrder} LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const [rows] = await this.db.execute(query, params)
    return rows.map(row => this._parseTemplateRow(row))
  }

  /**
   * Clone template for user
   */
  async cloneTemplate(templateId, cardId, userId, customizationData = {}) {
    const template = await this.getTemplate(templateId)
    if (!template) throw new Error('Template not found')

    const instanceId = this._generateId()
    const now = new Date().toISOString()

    await this.db.execute(
      `INSERT INTO template_instances (
        id, card_id, template_id, user_id, customization_data, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [instanceId, cardId, templateId, userId, JSON.stringify(customizationData), now]
    )

    // Increment clone count
    await this.db.execute(
      'UPDATE premium_templates SET clone_count = clone_count + 1 WHERE id = ?',
      [templateId]
    )

    return {
      id: instanceId,
      cardId,
      templateId,
      template,
      customizationData
    }
  }

  /**
   * Update template instance customization
   */
  async updateTemplateInstance(instanceId, customizationData) {
    const now = new Date().toISOString()

    await this.db.execute(
      'UPDATE template_instances SET customization_data = ?, last_modified_at = ? WHERE id = ?',
      [JSON.stringify(customizationData), now, instanceId]
    )

    return { id: instanceId, customizationData }
  }

  /**
   * Get templates by category
   */
  async getTemplatesByCategory(category, limit = 20) {
    return this.getAllTemplates({ category, limit })
  }

  /**
   * Get featured templates
   */
  async getFeaturedTemplates(limit = 12) {
    return this.getAllTemplates({ isFeatured: true, limit })
  }

  /**
   * Get popular templates
   */
  async getPopularTemplates(limit = 10) {
    const [rows] = await this.db.execute(
      `SELECT * FROM premium_templates 
       WHERE deleted_at IS NULL 
       ORDER BY download_count DESC, rating DESC 
       LIMIT ?`,
      [limit]
    )
    return rows.map(row => this._parseTemplateRow(row))
  }

  /**
   * Rate template
   */
  async rateTemplate(templateId, userId, rating, reviewText = '') {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    const ratingId = this._generateId()
    const now = new Date().toISOString()

    await this.db.execute(
      `INSERT INTO template_ratings (id, template_id, user_id, rating, review_text, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?, review_text = ?, updated_at = ?`,
      [ratingId, templateId, userId, rating, reviewText, now, now, rating, reviewText, now]
    )

    // Update average rating in templates table
    await this._updateTemplateRating(templateId)

    return { id: ratingId, rating, reviewText }
  }

  /**
   * Get template ratings
   */
  async getTemplateRatings(templateId) {
    const [rows] = await this.db.execute(
      'SELECT * FROM template_ratings WHERE template_id = ? ORDER BY created_at DESC',
      [templateId]
    )
    return rows
  }

  /**
   * Create template version
   */
  async createTemplateVersion(templateId, componentStructure, changesSummary, userId) {
    // Get next version number
    const [versionRows] = await this.db.execute(
      'SELECT MAX(version_number) as max_version FROM template_versions WHERE template_id = ?',
      [templateId]
    )

    const nextVersion = (versionRows[0]?.max_version || 0) + 1
    const versionId = this._generateId()
    const now = new Date().toISOString()

    await this.db.execute(
      `INSERT INTO template_versions (id, template_id, version_number, component_structure, changes_summary, created_by, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [versionId, templateId, nextVersion, JSON.stringify(componentStructure), changesSummary, userId, now]
    )

    return { id: versionId, version_number: nextVersion }
  }

  /**
   * Get template versions
   */
  async getTemplateVersions(templateId) {
    const [rows] = await this.db.execute(
      'SELECT * FROM template_versions WHERE template_id = ? ORDER BY version_number DESC',
      [templateId]
    )
    return rows.map(row => ({
      ...row,
      component_structure: JSON.parse(row.component_structure)
    }))
  }

  /**
   * Delete template (soft delete)
   */
  async deleteTemplate(templateId) {
    const now = new Date().toISOString()
    await this.db.execute(
      'UPDATE premium_templates SET deleted_at = ? WHERE id = ?',
      [now, templateId]
    )
    this.templateCache.delete(templateId)
    return { id: templateId, deleted: true }
  }

  /**
   * Publish template instance
   */
  async publishTemplateInstance(instanceId) {
    await this.db.execute(
      'UPDATE template_instances SET is_published = TRUE WHERE id = ?',
      [instanceId]
    )
    return { id: instanceId, is_published: true }
  }

  /**
   * Private helper: Parse template row from database
   */
  _parseTemplateRow(row) {
    return {
      id: row.id,
      name: row.name,
      description: row.description,
      category: row.category,
      thumbnailUrl: row.thumbnail_url,
      previewHtml: row.preview_html,
      componentStructure: JSON.parse(row.component_structure || '{}'),
      designTokens: JSON.parse(row.design_tokens || '{}'),
      defaultValues: JSON.parse(row.default_values || '{}'),
      authorId: row.author_id,
      rating: row.rating,
      downloadCount: row.download_count,
      cloneCount: row.clone_count,
      isFeatured: row.is_featured,
      isPremium: row.is_premium,
      tags: JSON.parse(row.tags || '[]'),
      responsiveConfig: JSON.parse(row.responsive_config || '{}'),
      animations: JSON.parse(row.animations || '{}'),
      accessibilityNotes: row.accessibility_notes,
      seoKeywords: row.seo_keywords,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  /**
   * Private helper: Update average rating
   */
  async _updateTemplateRating(templateId) {
    const [result] = await this.db.execute(
      'SELECT AVG(rating) as avg_rating FROM template_ratings WHERE template_id = ?',
      [templateId]
    )

    const avgRating = result[0]?.avg_rating || 0

    await this.db.execute(
      'UPDATE premium_templates SET rating = ? WHERE id = ?',
      [avgRating, templateId]
    )
  }

  /**
   * Private helper: Generate ID
   */
  _generateId() {
    return `tmpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export default PremiumTemplatesService
