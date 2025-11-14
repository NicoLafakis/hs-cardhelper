/**
 * Migration 004: Data Bindings Tables
 * Creates tables for conditional rendering, computed properties, formulas, lookups, and dependencies
 */

export async function migrate(db) {
  try {
    console.log('    Creating data_bindings table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS data_bindings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        binding_id VARCHAR(255) NOT NULL,
        field_id VARCHAR(255) NOT NULL,
        type ENUM('conditional', 'computed', 'formula', 'lookup', 'dependency') NOT NULL,
        source_field VARCHAR(255),
        \`condition\` JSON,
        formula LONGTEXT,
        lookup_table VARCHAR(255),
        match_field VARCHAR(255),
        return_field VARCHAR(255),
        depends_on JSON,
        metadata JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_binding (card_id, binding_id),
        INDEX idx_card_id (card_id),
        INDEX idx_field_id (field_id),
        INDEX idx_type (type),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Creating binding_evaluation_cache table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS binding_evaluation_cache (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        binding_id VARCHAR(255) NOT NULL,
        data_hash VARCHAR(255) NOT NULL,
        result JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP DEFAULT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 HOUR),
        UNIQUE KEY unique_cache_entry (card_id, binding_id, data_hash),
        INDEX idx_card_id (card_id),
        INDEX idx_expires_at (expires_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Creating binding_audit_log table...')
    await db.execute(`
      CREATE TABLE IF NOT EXISTS binding_audit_log (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id VARCHAR(255) NOT NULL,
        binding_id VARCHAR(255),
        user_id VARCHAR(255),
        action ENUM('create', 'update', 'delete', 'evaluate') NOT NULL,
        changes JSON,
        result VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_card_id (card_id),
        INDEX idx_user_id (user_id),
        INDEX idx_action (action),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Data bindings tables created successfully')
  } catch (error) {
    console.error('    Failed to create data bindings tables:', error.message)
    throw error
  }
}

export async function rollback(db) {
  try {
    console.log('    Rolling back data bindings tables...')
    await db.execute('DROP TABLE IF EXISTS binding_audit_log')
    await db.execute('DROP TABLE IF EXISTS binding_evaluation_cache')
    await db.execute('DROP TABLE IF EXISTS data_bindings')
    console.log('    Data bindings tables rolled back successfully')
  } catch (error) {
    console.error('    Failed to rollback data bindings tables:', error.message)
    throw error
  }
}
