/**
 * Template Service
 * Handles template CRUD operations
 */

import { BaseService } from './BaseService'

export class TemplateService extends BaseService {
  constructor() {
    super('/templates')
  }

  /**
   * Get all templates
   */
  async getAll() {
    return await this.get()
  }

  /**
   * Get template by ID
   */
  async getById(id) {
    return await this.get(`/${id}`)
  }

  /**
   * Create new template
   */
  async create(name, config) {
    return await this.post('', { name, config })
  }

  /**
   * Update template
   */
  async update(id, name, config) {
    return await this.put(`/${id}`, { name, config })
  }

  /**
   * Delete template
   */
  async delete(id) {
    return await super.delete(`/${id}`)
  }

  /**
   * Duplicate template
   */
  async duplicate(id) {
    const result = await this.getById(id)

    if (result.success) {
      const template = result.data
      return await this.create(
        `${template.name} (Copy)`,
        template.config
      )
    }

    return result
  }

  /**
   * Export template as JSON
   */
  exportTemplate(template) {
    const json = JSON.stringify(template, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = `${template.name}.json`
    link.click()

    URL.revokeObjectURL(url)
  }

  /**
   * Import template from JSON
   */
  async importTemplate(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const template = JSON.parse(e.target.result)
          const result = await this.create(template.name, template.config)
          resolve(result)
        } catch (error) {
          reject(new Error('Invalid template file'))
        }
      }

      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  /**
   * Validate template config
   */
  validateConfig(config) {
    if (!config || typeof config !== 'object') {
      return false
    }

    // Add more validation as needed
    return true
  }
}

// Create singleton instance
const templateService = new TemplateService()

export default templateService
