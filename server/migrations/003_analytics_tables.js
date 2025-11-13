/**
 * Migration 003: Analytics Tables
 * Creates tables for tracking events, component usage, and performance metrics
 */

export async function migrate(db) {
  try {
    console.log('    Creating analytics_events table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(50) NOT NULL,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_card_id (card_id),
        INDEX idx_user_id (user_id),
        INDEX idx_event_type (event_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Creating component_usage table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS component_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        component_type VARCHAR(255) NOT NULL,
        count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_card_id (card_id),
        INDEX idx_component_type (component_type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Creating performance_metrics table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS performance_metrics (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        render_time_ms INT NOT NULL,
        component_count INT DEFAULT 0,
        field_count INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_card_id (card_id),
        INDEX idx_render_time (render_time_ms),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Creating ab_test_results table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS ab_test_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        test_name VARCHAR(255) NOT NULL,
        card_id_a VARCHAR(255) NOT NULL,
        card_id_b VARCHAR(255) NOT NULL,
        winner VARCHAR(255),
        variance_percentage DECIMAL(5, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_test_name (test_name),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Analytics tables created successfully')
  } catch (error) {
    console.error('    Failed to create analytics tables:', error.message)
    throw error
  }
}

export async function rollback(db) {
  try {
    console.log('    Rolling back analytics tables...')
    await db.execute('DROP TABLE IF EXISTS ab_test_results')
    await db.execute('DROP TABLE IF EXISTS performance_metrics')
    await db.execute('DROP TABLE IF EXISTS component_usage')
    await db.execute('DROP TABLE IF EXISTS analytics_events')
    console.log('    Analytics tables rolled back successfully')
  } catch (error) {
    console.error('    Failed to rollback analytics tables:', error.message)
    throw error
  }
}
