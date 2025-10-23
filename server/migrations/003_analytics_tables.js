/**
 * Database Migration: Analytics Tables
 * Adds analytics_events, component_usage, and performance_metrics tables
 */

export async function up(connection) {
  try {
    console.log('🔄 Creating analytics tables...')

    // Analytics events table
    await connection.query(`
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
      )
    `)

    // Component usage table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS component_usage (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        component_type VARCHAR(255) NOT NULL,
        count INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_card_id (card_id),
        INDEX idx_component_type (component_type),
        INDEX idx_created_at (created_at)
      )
    `)

    // Performance metrics table
    await connection.query(`
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
      )
    `)

    // A/B test results table
    await connection.query(`
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
      )
    `)

    console.log('✅ Analytics tables created successfully')
    return true
  } catch (err) {
    console.error('❌ Analytics migration failed:', err)
    throw err
  }
}

export async function down(connection) {
  try {
    console.log('🔄 Dropping analytics tables...')

    await connection.query('DROP TABLE IF EXISTS ab_test_results')
    await connection.query('DROP TABLE IF EXISTS performance_metrics')
    await connection.query('DROP TABLE IF EXISTS component_usage')
    await connection.query('DROP TABLE IF EXISTS analytics_events')

    console.log('✅ Analytics tables dropped')
    return true
  } catch (err) {
    console.error('❌ Analytics rollback failed:', err)
    throw err
  }
}
