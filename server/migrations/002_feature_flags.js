/**
 * Migration 002: Feature Flags
 * Creates the feature_flags table for managing feature toggles per user
 */

export async function migrate(db) {
  try {
    console.log('    Creating feature_flags table...')

    await db.execute(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        flag_key VARCHAR(255) NOT NULL,
        flag_value INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_flag (user_id, flag_key),
        INDEX idx_user_id (user_id),
        INDEX idx_flag_key (flag_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Feature flags table created successfully')
  } catch (error) {
    console.error('    Failed to create feature_flags table:', error.message)
    throw error
  }
}

export async function rollback(db) {
  try {
    console.log('    Rolling back feature_flags table...')
    await db.execute('DROP TABLE IF EXISTS feature_flags')
    console.log('    Feature flags table rolled back successfully')
  } catch (error) {
    console.error('    Failed to rollback feature_flags table:', error.message)
    throw error
  }
}
