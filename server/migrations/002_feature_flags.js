/**
 * Feature Flags Migration
 * Creates the feature_flags table
 */

import db from '../db/database.js'

export function up() {
  console.log('Running migration: 002_feature_flags')

  // Create feature_flags table
  db.exec(`
    CREATE TABLE IF NOT EXISTS feature_flags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      flag_key TEXT NOT NULL,
      flag_value INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, flag_key)
    )
  `)

  // Create index for faster lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_feature_flags_user_id
    ON feature_flags(user_id)
  `)

  console.log('✓ Feature flags table created')
}

export function down() {
  console.log('Rolling back migration: 002_feature_flags')

  db.exec('DROP TABLE IF EXISTS feature_flags')
  db.exec('DROP INDEX IF EXISTS idx_feature_flags_user_id')

  console.log('✓ Feature flags table dropped')
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  up()
}

export default { up, down }
