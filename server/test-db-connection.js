import pool from './utils/database.js'

async function testConnection() {
  try {
    console.log('[Test] Testing database connection...')
    const connection = await pool.getConnection()

    const [rows] = await connection.execute('SELECT 1 as test')
    console.log('[Test] ✅ Database connection successful!')
    console.log('[Test] Test query result:', rows)

    // Check what tables exist
    const [tables] = await connection.execute('SHOW TABLES')
    console.log('[Test] Existing tables:', tables.length)
    tables.forEach(row => {
      console.log('  -', Object.values(row)[0])
    })

    connection.release()
    await pool.end()

  } catch (error) {
    console.error('[Test] ❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

testConnection()
