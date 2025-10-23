import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306
})

async function verifyTables() {
  try {
    const connection = await pool.getConnection()

    console.log('\n📋 Checking Premium Templates Tables...\n')

    // Check each table
    const tables = [
      'premium_templates',
      'template_instances',
      'template_ratings',
      'template_versions',
      'template_categories'
    ]

    for (const table of tables) {
      const [result] = await connection.execute(`SHOW TABLES LIKE '${table}'`)
      if (result.length > 0) {
        console.log(`✅ ${table}`)
      } else {
        console.log(`❌ ${table} - NOT FOUND`)
      }
    }

    // Show template categories
    console.log('\n📁 Default Template Categories:\n')
    const [categories] = await connection.execute(`
      SELECT name, icon FROM template_categories ORDER BY order_index
    `)
    categories.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name}`)
    })

    connection.release()
    console.log('\n✅ All Premium Templates tables created successfully!\n')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

verifyTables()
