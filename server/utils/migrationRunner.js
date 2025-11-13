/**
 * Database Migration Runner
 * Tracks and executes migrations in order
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Create migrations tracking table if it doesn't exist
 */
async function createMigrationsTable(connection) {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

/**
 * Get list of executed migrations
 */
async function getExecutedMigrations(connection) {
  const [rows] = await connection.execute('SELECT name FROM migrations ORDER BY name')
  return rows.map(row => row.name)
}

/**
 * Mark migration as executed
 */
async function markMigrationExecuted(connection, migrationName) {
  await connection.execute('INSERT INTO migrations (name) VALUES (?)', [migrationName])
}

/**
 * Get all migration files from the migrations directory
 */
async function getAllMigrationFiles() {
  const migrationsDir = path.join(__dirname, '../migrations')
  const files = fs.readdirSync(migrationsDir)

  return files
    .filter(file => file.endsWith('.js'))
    .sort() // Sort to ensure correct order (001, 002, 003, etc.)
}

/**
 * Run all pending migrations
 */
export async function runMigrations() {
  let connection

  try {
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

    connection = await pool.getConnection()

    console.log('🔄 Starting database migrations...')

    // Create migrations tracking table
    await createMigrationsTable(connection)

    // Get executed migrations
    const executedMigrations = await getExecutedMigrations(connection)
    console.log(`✓ Found ${executedMigrations.length} previously executed migrations`)

    // Get all migration files
    const migrationFiles = await getAllMigrationFiles()
    console.log(`✓ Found ${migrationFiles.length} total migration files`)

    // Filter pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    )

    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations. Database is up to date!')
      connection.release()
      await pool.end()
      return
    }

    console.log(`📋 Running ${pendingMigrations.length} pending migrations:\n`)

    // Execute pending migrations
    for (const migrationFile of pendingMigrations) {
      const migrationPath = path.join(__dirname, '../migrations', migrationFile)

      try {
        console.log(`  🔄 Running: ${migrationFile}`)

        // Import and execute migration
        const migration = await import(`file://${migrationPath}`)

        if (typeof migration.migrate !== 'function') {
          throw new Error(`Migration ${migrationFile} does not export a 'migrate' function`)
        }

        // Run the migration
        await migration.migrate(connection)

        // Mark as executed
        await markMigrationExecuted(connection, migrationFile)

        console.log(`  ✅ Completed: ${migrationFile}\n`)
      } catch (error) {
        console.error(`  ❌ Failed: ${migrationFile}`)
        console.error(`     Error: ${error.message}\n`)
        throw error
      }
    }

    console.log('✅ All migrations completed successfully!')

    connection.release()
    await pool.end()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    if (connection) {
      connection.release()
    }
    throw error
  }
}

/**
 * Check migration status
 */
export async function checkMigrationStatus() {
  let connection

  try {
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

    connection = await pool.getConnection()

    // Create migrations table if it doesn't exist
    await createMigrationsTable(connection)

    // Get executed migrations
    const executedMigrations = await getExecutedMigrations(connection)

    // Get all migration files
    const migrationFiles = await getAllMigrationFiles()

    // Filter pending migrations
    const pendingMigrations = migrationFiles.filter(
      file => !executedMigrations.includes(file)
    )

    console.log('\n📊 Migration Status:\n')
    console.log(`  Total migrations: ${migrationFiles.length}`)
    console.log(`  Executed: ${executedMigrations.length}`)
    console.log(`  Pending: ${pendingMigrations.length}\n`)

    if (executedMigrations.length > 0) {
      console.log('✅ Executed migrations:')
      executedMigrations.forEach(migration => {
        console.log(`   - ${migration}`)
      })
      console.log('')
    }

    if (pendingMigrations.length > 0) {
      console.log('⏳ Pending migrations:')
      pendingMigrations.forEach(migration => {
        console.log(`   - ${migration}`)
      })
      console.log('')
    } else {
      console.log('✅ Database is up to date!\n')
    }

    connection.release()
    await pool.end()

    return {
      total: migrationFiles.length,
      executed: executedMigrations.length,
      pending: pendingMigrations.length
    }
  } catch (error) {
    console.error('❌ Failed to check migration status:', error)
    if (connection) {
      connection.release()
    }
    throw error
  }
}

// If run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2]

  if (command === 'status') {
    checkMigrationStatus()
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
  } else {
    runMigrations()
      .then(() => process.exit(0))
      .catch(() => process.exit(1))
  }
}
