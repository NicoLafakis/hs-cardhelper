/**
 * Feature Flags Migration
 * Creates the feature_flags table
 */

import pool from '../utils/database.js'

export async function up() {
  console.log('Running migration: 002_feature_flags')

  const connection = await pool.getConnection()
  try {
    // Create feature_flags table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS feature_flags (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        flag_key VARCHAR(255) NOT NULL,
        flag_value INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_flag (user_id, flag_key)
      )
    `)

    // Create index for faster lookups
    await connection.execute(`
      CREATE INDEX IF NOT EXISTS idx_feature_flags_user_id
      ON feature_flags(user_id)
    `)

    console.log('✓ Feature flags table created')
  } finally {
    connection.release()
  }
}

export async function down() {
  console.log('Rolling back migration: 002_feature_flags')

  const connection = await pool.getConnection()
  try {
    await connection.execute('DROP TABLE IF EXISTS feature_flags')
    await connection.execute('DROP INDEX IF EXISTS idx_feature_flags_user_id ON feature_flags')

    console.log('✓ Feature flags table dropped')
  } finally {
    connection.release()
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up().catch(err => {
    console.error('Migration failed:', err)
    process.exit(1)
  })
}

export default { up, down }
