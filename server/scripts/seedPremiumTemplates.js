/**
 * Seed Premium Templates Database
 * Loads template JSON files into the database
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../utils/database.js'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEMPLATES_DIR = path.join(__dirname, '../../src/templates')

// Category mapping
const CATEGORIES = {
  'contact-cards': 'Contact Cards',
  'product-cards': 'Product Cards',
  'dashboard-widgets': 'Dashboard Widgets',
  'form-templates': 'Form Templates',
  'landing-page-cards': 'Landing Page Cards',
  'gallery-cards': 'Gallery Cards',
  'event-cards': 'Event Cards'
}

async function seedTemplates() {
  let connection

  try {
    console.log('[Seed] Starting premium templates seed...')

    connection = await pool.getConnection()

    // Read all template directories
    const categories = await fs.readdir(TEMPLATES_DIR)

    let totalTemplates = 0

    for (const category of categories) {
      const categoryPath = path.join(TEMPLATES_DIR, category)
      const stat = await fs.stat(categoryPath)

      if (!stat.isDirectory()) continue

      console.log(`\n[Seed] Processing category: ${CATEGORIES[category] || category}`)

      // Read all template files in this category
      const files = await fs.readdir(categoryPath)
      const jsonFiles = files.filter(f => f.endsWith('.json'))

      for (const file of jsonFiles) {
        const filePath = path.join(categoryPath, file)
        const fileContent = await fs.readFile(filePath, 'utf-8')
        const template = JSON.parse(fileContent)

        // Generate unique template ID if not provided
        const templateId = template.templateId || `tmpl-${uuidv4().split('-')[0]}`

        // Check if template already exists
        const [existing] = await connection.execute(
          'SELECT id FROM premium_templates WHERE template_id = ?',
          [templateId]
        )

        if (existing.length > 0) {
          console.log(`  ✓ Template already exists: ${template.name}`)
          continue
        }

        // Insert template
        await connection.execute(
          `INSERT INTO premium_templates (
            template_id,
            name,
            description,
            category,
            thumbnail_url,
            preview_html,
            component_structure,
            design_tokens,
            default_values,
            tags,
            responsive_config,
            animations,
            accessibility_notes,
            seo_keywords,
            is_featured,
            is_premium,
            rating,
            download_count,
            clone_count
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            templateId,
            template.name,
            template.description,
            template.category,
            template.thumbnailUrl || null,
            template.previewHtml || null,
            JSON.stringify(template.componentStructure),
            JSON.stringify(template.designTokens),
            JSON.stringify(template.defaultValues),
            JSON.stringify(template.tags || []),
            JSON.stringify(template.responsiveConfig || {}),
            JSON.stringify(template.animations || {}),
            template.accessibilityNotes || '',
            template.seoKeywords || '',
            false, // is_featured
            false, // is_premium
            0, // rating (will be calculated)
            0, // download_count
            0  // clone_count
          ]
        )

        totalTemplates++
        console.log(`  ✓ Added: ${template.name}`)
      }
    }

    console.log(`\n[Seed] ✅ Successfully seeded ${totalTemplates} templates!`)

  } catch (error) {
    console.error('[Seed] ❌ Error seeding templates:', error)
    throw error
  } finally {
    if (connection) {
      connection.release()
    }
    // Close the pool to allow script to exit
    await pool.end()
  }
}

// Run seed
seedTemplates()
  .then(() => {
    console.log('[Seed] Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('[Seed] Fatal error:', error)
    process.exit(1)
  })
