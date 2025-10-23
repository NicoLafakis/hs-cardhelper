import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function runMigration() {
  let connection;
  try {
    console.log('🔧 Creating Premium Templates tables...\n')
    
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306
    })
    
    connection = await pool.getConnection()

    // Templates table
    console.log('Creating premium_templates table...')
    await connection.execute(`
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
    console.log('✅ premium_templates created\n')

    // Template instances
    console.log('Creating template_instances table...')
    await connection.execute(`
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
    console.log('✅ template_instances created\n')

    // Template ratings
    console.log('Creating template_ratings table...')
    await connection.execute(`
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
    console.log('✅ template_ratings created\n')

    // Template versions
    console.log('Creating template_versions table...')
    await connection.execute(`
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
    console.log('✅ template_versions created\n')

    // Template categories
    console.log('Creating template_categories table...')
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS template_categories (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(100),
        order_index INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✅ template_categories created\n')

    // Insert default categories
    console.log('Inserting default template categories...')
    await connection.execute(`
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
    console.log('✅ Default categories inserted\n')

    connection.release()
    pool.end()

    console.log('🎉 All Premium Templates tables created successfully!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    if (connection) connection.release()
    process.exit(1)
  }
}

runMigration()
