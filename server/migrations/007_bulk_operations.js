/**
 * Migration 007: Bulk Operations
 * Creates tables for tracking bulk operation jobs and their progress
 */

export async function migrate(db) {
  try {
    console.log('    Creating bulk_operation_jobs table...')

    await db.execute(`
      CREATE TABLE IF NOT EXISTS bulk_operation_jobs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id VARCHAR(255) UNIQUE NOT NULL,
        user_id INT NOT NULL,
        operation_type ENUM('update', 'delete', 'duplicate', 'export', 'import') NOT NULL,
        total_records INT NOT NULL DEFAULT 0,
        processed_records INT NOT NULL DEFAULT 0,
        failed_records INT NOT NULL DEFAULT 0,
        status ENUM('pending', 'running', 'completed', 'failed', 'cancelled', 'completed_with_errors') NOT NULL DEFAULT 'pending',
        config JSON,
        error_log JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_job_id (job_id),
        INDEX idx_status (status),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Creating bulk_operation_records table...')

    await db.execute(`
      CREATE TABLE IF NOT EXISTS bulk_operation_records (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_id VARCHAR(255) NOT NULL,
        record_id VARCHAR(255),
        status ENUM('pending', 'success', 'failed') NOT NULL DEFAULT 'pending',
        error_message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_job_id (job_id),
        INDEX idx_status (status),
        FOREIGN KEY (job_id) REFERENCES bulk_operation_jobs(job_id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    console.log('    Bulk operations tables created successfully')
  } catch (error) {
    console.error('    Failed to create bulk operations tables:', error.message)
    throw error
  }
}

export async function rollback(db) {
  try {
    console.log('    Rolling back bulk operations tables...')
    await db.execute('DROP TABLE IF EXISTS bulk_operation_records')
    await db.execute('DROP TABLE IF EXISTS bulk_operation_jobs')
    console.log('    Bulk operations tables rolled back successfully')
  } catch (error) {
    console.error('    Failed to rollback bulk operations tables:', error.message)
    throw error
  }
}
