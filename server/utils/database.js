import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { runMigrations } from './migrationRunner.js'

dotenv.config()

// Create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})

/**
 * Initialize database by running all pending migrations
 */
export async function initializeDatabase() {
  try {
    console.log('[Database] Initializing database...')

    // Run all pending migrations
    await runMigrations()

    console.log('[Database] Database initialization complete!')
    return pool
  } catch (error) {
    console.error('[Database] Failed to initialize database:', error)
    throw error
  }
}

export default pool
