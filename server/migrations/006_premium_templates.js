/**
 * Migration: Premium Card Templates System
 * Tables for template management, cloning, versions, ratings
 */

export async function migrate(db) {
  try {
    // Templates table - store template definitions
    await db.execute(`
      CREATE TABLE IF NOT EXISTS premium_templates (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) NOT NULL,
        thumbnail_url VARCHAR(500),
        preview_html LONGTEXT,
        component_structure JSON NOT NULL,
        design_tokens JSON,
        default_values JSON,
        author_id VARCHAR(36),
        rating FLOAT DEFAULT 0,
        download_count INT DEFAULT 0,
        clone_count INT DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        is_premium BOOLEAN DEFAULT TRUE,
        tags JSON,
        responsive_config JSON,
        animations JSON,
        accessibility_notes TEXT,
        seo_keywords VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        INDEX idx_category (category),
        INDEX idx_is_featured (is_featured),
        INDEX idx_rating (rating),
        INDEX idx_download_count (download_count),
        INDEX idx_created_at (created_at)
      )
    `)

    // Template instances - track cloned templates
    await db.execute(`
      CREATE TABLE IF NOT EXISTS template_instances (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        card_id VARCHAR(36) NOT NULL,
        template_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        customization_data JSON,
        is_published BOOLEAN DEFAULT FALSE,
        last_modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_card_id (card_id),
        INDEX idx_template_id (template_id),
        INDEX idx_user_id (user_id),
        FOREIGN KEY (template_id) REFERENCES premium_templates(id) ON DELETE CASCADE
      )
    `)

    // Template ratings - user ratings and reviews
    await db.execute(`
      CREATE TABLE IF NOT EXISTS template_ratings (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        template_id VARCHAR(36) NOT NULL,
        user_id VARCHAR(36) NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        helpful_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_template_rating (template_id, user_id),
        INDEX idx_template_id (template_id),
        INDEX idx_user_id (user_id),
        FOREIGN KEY (template_id) REFERENCES premium_templates(id) ON DELETE CASCADE
      )
    `)

    // Template versions - version history
    await db.execute(`
      CREATE TABLE IF NOT EXISTS template_versions (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        template_id VARCHAR(36) NOT NULL,
        version_number INT NOT NULL,
        component_structure JSON NOT NULL,
        changes_summary VARCHAR(500),
        created_by VARCHAR(36),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_template_version (template_id, version_number),
        INDEX idx_template_id (template_id),
        FOREIGN KEY (template_id) REFERENCES premium_templates(id) ON DELETE CASCADE
      )
    `)

    // Template categories - predefined template categories
    await db.execute(`
      CREATE TABLE IF NOT EXISTS template_categories (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(100),
        order_index INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Insert default template categories
    await db.execute(`
      INSERT IGNORE INTO template_categories (id, name, description, icon, order_index) VALUES
      (UUID(), 'Contact Cards', 'Professional contact and profile cards', '👤', 1),
      (UUID(), 'Product Cards', 'E-commerce and product showcase cards', '🛍️', 2),
      (UUID(), 'Dashboard Widgets', 'Analytics and data dashboard cards', '📊', 3),
      (UUID(), 'Form Templates', 'Pre-built form layouts and wizards', '📝', 4),
      (UUID(), 'Landing Page Cards', 'Hero and landing page components', '🚀', 5),
      (UUID(), 'Listing Cards', 'List and directory cards', '📋', 6),
      (UUID(), 'Gallery Cards', 'Image and media gallery cards', '🖼️', 7),
      (UUID(), 'Event Cards', 'Event and calendar cards', '📅', 8),
      (UUID(), 'Social Cards', 'Social media and engagement cards', '📱', 9),
      (UUID(), 'Pricing Cards', 'Pricing table and comparison cards', '💰', 10)
    `)

    console.log('✅ Premium Templates migration completed successfully')
  } catch (error) {
    console.error('❌ Premium Templates migration failed:', error.message)
    throw error
  }
}

export async function rollback(db) {
  try {
    await db.execute('DROP TABLE IF EXISTS template_versions')
    await db.execute('DROP TABLE IF EXISTS template_ratings')
    await db.execute('DROP TABLE IF EXISTS template_instances')
    await db.execute('DROP TABLE IF EXISTS premium_templates')
    await db.execute('DROP TABLE IF EXISTS template_categories')
    console.log('✅ Premium Templates rollback completed')
  } catch (error) {
    console.error('❌ Premium Templates rollback failed:', error.message)
    throw error
  }
}
