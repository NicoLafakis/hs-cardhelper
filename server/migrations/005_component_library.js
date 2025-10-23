/**
 * Component Library Database Migration
 * Creates tables for managing reusable UI components
 */

export async function migrate(db) {
  const queries = [
    // Components table - stores component definitions and metadata
    `CREATE TABLE IF NOT EXISTS components (
      id INT PRIMARY KEY AUTO_INCREMENT,
      card_id INT NOT NULL,
      component_id VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(255) NOT NULL,
      type ENUM('form', 'data-display', 'feedback', 'navigation', 'layout', 'media') NOT NULL,
      category VARCHAR(100) NOT NULL,
      description TEXT,
      props JSON,
      defaultProps JSON,
      validation JSON,
      accessibility JSON,
      responsive_config JSON,
      metadata JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_by INT,
      KEY card_id (card_id),
      KEY type (type),
      KEY category (category),
      KEY created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Component instances table - tracks component usage across cards
    `CREATE TABLE IF NOT EXISTS component_instances (
      id INT PRIMARY KEY AUTO_INCREMENT,
      card_id INT NOT NULL,
      component_id INT NOT NULL,
      instance_id VARCHAR(255) UNIQUE NOT NULL,
      props JSON NOT NULL,
      styles JSON,
      position JSON,
      animations JSON,
      data_binding JSON,
      event_handlers JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY card_id (card_id),
      KEY component_id (component_id),
      FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Component usage analytics - tracks which components are most popular
    `CREATE TABLE IF NOT EXISTS component_usage_analytics (
      id INT PRIMARY KEY AUTO_INCREMENT,
      component_id INT NOT NULL,
      card_id INT NOT NULL,
      user_id INT,
      usage_count INT DEFAULT 1,
      last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      interaction_data JSON,
      performance_metrics JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      KEY component_id (component_id),
      KEY card_id (card_id),
      KEY user_id (user_id),
      KEY last_used (last_used),
      FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Component library marketplace table
    `CREATE TABLE IF NOT EXISTS component_marketplace (
      id INT PRIMARY KEY AUTO_INCREMENT,
      component_id INT NOT NULL,
      creator_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      thumbnail_url VARCHAR(500),
      preview_url VARCHAR(500),
      download_count INT DEFAULT 0,
      rating DECIMAL(3, 2),
      rating_count INT DEFAULT 0,
      tags JSON,
      version VARCHAR(20) DEFAULT '1.0.0',
      source_code JSON,
      dependencies JSON,
      license VARCHAR(50) DEFAULT 'MIT',
      is_public BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      KEY component_id (component_id),
      KEY creator_id (creator_id),
      KEY download_count (download_count),
      KEY rating (rating)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,

    // Component versions - track changes over time
    `CREATE TABLE IF NOT EXISTS component_versions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      component_id INT NOT NULL,
      version_number INT NOT NULL,
      changes_description TEXT,
      props_schema JSON,
      component_code JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_by INT,
      KEY component_id (component_id),
      KEY version_number (version_number),
      FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  ]

  for (const query of queries) {
    await db.execute(query)
  }

  console.log('✓ Component library migration completed')
}

export async function rollback(db) {
  const tables = [
    'component_versions',
    'component_marketplace',
    'component_usage_analytics',
    'component_instances',
    'components'
  ]

  for (const table of tables) {
    await db.execute(`DROP TABLE IF EXISTS ${table}`)
  }

  console.log('✓ Component library tables rolled back')
}
