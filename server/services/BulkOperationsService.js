/**
 * Bulk Operations Service
 * Handles batch operations with progress tracking and error handling
 */

import Database from '../utils/database.js'

class BulkOperationsService {
  constructor() {
    this.db = Database
    this.activeJobs = new Map() // jobId -> job status
  }

  /**
   * Create a new bulk operation job
   */
  async createBulkJob(userId, operationType, recordCount, config = {}) {
    try {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const [result] = await this.db.execute(
        `INSERT INTO bulk_operation_jobs
         (job_id, user_id, operation_type, total_records, status, config, created_at)
         VALUES (?, ?, ?, ?, 'pending', ?, NOW())`,
        [jobId, userId, operationType, recordCount, JSON.stringify(config)]
      )

      this.activeJobs.set(jobId, {
        id: jobId,
        status: 'pending',
        current: 0,
        total: recordCount,
        errors: [],
        startedAt: new Date()
      })

      return { jobId, status: 'created' }
    } catch (error) {
      console.error('Failed to create bulk job:', error)
      throw error
    }
  }

  /**
   * Update job progress
   */
  async updateJobProgress(jobId, current, errors = []) {
    try {
      const job = this.activeJobs.get(jobId)
      if (job) {
        job.current = current
        job.errors = errors
        this.activeJobs.set(jobId, job)
      }

      await this.db.execute(
        `UPDATE bulk_operation_jobs
         SET processed_records = ?, failed_records = ?, updated_at = NOW()
         WHERE job_id = ?`,
        [current, errors.length, jobId]
      )
    } catch (error) {
      console.error('Failed to update job progress:', error)
    }
  }

  /**
   * Complete a bulk job
   */
  async completeJob(jobId, status = 'completed', errors = []) {
    try {
      const job = this.activeJobs.get(jobId)
      if (job) {
        job.status = status
        job.errors = errors
        job.completedAt = new Date()
      }

      await this.db.execute(
        `UPDATE bulk_operation_jobs
         SET status = ?, failed_records = ?, error_log = ?, completed_at = NOW(), updated_at = NOW()
         WHERE job_id = ?`,
        [status, errors.length, JSON.stringify(errors), jobId]
      )

      // Remove from active jobs after 5 minutes
      setTimeout(() => {
        this.activeJobs.delete(jobId)
      }, 300000)

      return { jobId, status }
    } catch (error) {
      console.error('Failed to complete job:', error)
      throw error
    }
  }

  /**
   * Get job status
   */
  getJobStatus(jobId) {
    const activeJob = this.activeJobs.get(jobId)
    if (activeJob) {
      return activeJob
    }

    // If not in memory, fetch from database
    return this.getJobFromDatabase(jobId)
  }

  /**
   * Get job from database
   */
  async getJobFromDatabase(jobId) {
    try {
      const [rows] = await this.db.execute(
        `SELECT * FROM bulk_operation_jobs WHERE job_id = ?`,
        [jobId]
      )

      if (rows.length === 0) {
        return null
      }

      const job = rows[0]
      return {
        id: job.job_id,
        status: job.status,
        operationType: job.operation_type,
        current: job.processed_records,
        total: job.total_records,
        errors: job.error_log ? JSON.parse(job.error_log) : [],
        createdAt: job.created_at,
        completedAt: job.completed_at
      }
    } catch (error) {
      console.error('Failed to get job from database:', error)
      return null
    }
  }

  /**
   * Execute bulk update operation
   */
  async executeBulkUpdate(records, fieldUpdates, progressCallback) {
    const errors = []

    for (let i = 0; i < records.length; i++) {
      try {
        const record = records[i]

        // Build update query dynamically
        const updates = fieldUpdates.map(update => `${update.field} = ?`)
        const values = fieldUpdates.map(update => update.value)

        // Assuming records have an 'id' field
        if (!record.id) {
          throw new Error('Record missing id field')
        }

        values.push(record.id)

        await this.db.execute(
          `UPDATE records SET ${updates.join(', ')} WHERE id = ?`,
          values
        )

        // Call progress callback
        if (progressCallback) {
          await progressCallback(i + 1, errors)
        }
      } catch (error) {
        errors.push({
          record: i,
          id: records[i].id,
          error: error.message
        })
      }
    }

    return { processed: records.length, errors }
  }

  /**
   * Execute bulk delete operation
   */
  async executeBulkDelete(recordIds, progressCallback) {
    const errors = []

    for (let i = 0; i < recordIds.length; i++) {
      try {
        await this.db.execute(
          `DELETE FROM records WHERE id = ?`,
          [recordIds[i]]
        )

        if (progressCallback) {
          await progressCallback(i + 1, errors)
        }
      } catch (error) {
        errors.push({
          record: i,
          id: recordIds[i],
          error: error.message
        })
      }
    }

    return { processed: recordIds.length, errors }
  }

  /**
   * Execute bulk duplicate operation
   */
  async executeBulkDuplicate(recordIds, progressCallback) {
    const errors = []
    const duplicated = []

    for (let i = 0; i < recordIds.length; i++) {
      try {
        // Fetch original record
        const [rows] = await this.db.execute(
          `SELECT * FROM records WHERE id = ?`,
          [recordIds[i]]
        )

        if (rows.length === 0) {
          throw new Error('Record not found')
        }

        const original = rows[0]
        delete original.id // Remove id to create new record

        // Insert duplicate
        const columns = Object.keys(original)
        const placeholders = columns.map(() => '?').join(', ')
        const values = Object.values(original)

        const [result] = await this.db.execute(
          `INSERT INTO records (${columns.join(', ')}) VALUES (${placeholders})`,
          values
        )

        duplicated.push(result.insertId)

        if (progressCallback) {
          await progressCallback(i + 1, errors)
        }
      } catch (error) {
        errors.push({
          record: i,
          id: recordIds[i],
          error: error.message
        })
      }
    }

    return { processed: recordIds.length, duplicated, errors }
  }

  /**
   * Get user's bulk operation history
   */
  async getUserBulkOperations(userId, limit = 20) {
    try {
      const [rows] = await this.db.execute(
        `SELECT job_id, operation_type, total_records, processed_records,
                failed_records, status, created_at, completed_at
         FROM bulk_operation_jobs
         WHERE user_id = ?
         ORDER BY created_at DESC
         LIMIT ?`,
        [userId, limit]
      )

      return rows.map(row => ({
        jobId: row.job_id,
        operationType: row.operation_type,
        totalRecords: row.total_records,
        processedRecords: row.processed_records,
        failedRecords: row.failed_records,
        status: row.status,
        createdAt: row.created_at,
        completedAt: row.completed_at
      }))
    } catch (error) {
      console.error('Failed to get user bulk operations:', error)
      return []
    }
  }

  /**
   * Cancel a running job
   */
  async cancelJob(jobId) {
    try {
      const job = this.activeJobs.get(jobId)
      if (job) {
        job.status = 'cancelled'
        this.activeJobs.set(jobId, job)
      }

      await this.db.execute(
        `UPDATE bulk_operation_jobs
         SET status = 'cancelled', updated_at = NOW()
         WHERE job_id = ?`,
        [jobId]
      )

      return { jobId, status: 'cancelled' }
    } catch (error) {
      console.error('Failed to cancel job:', error)
      throw error
    }
  }

  /**
   * Cleanup old completed jobs (older than 30 days)
   */
  async cleanupOldJobs() {
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      await this.db.execute(
        `DELETE FROM bulk_operation_jobs
         WHERE status IN ('completed', 'failed', 'cancelled')
         AND completed_at < ?`,
        [thirtyDaysAgo]
      )

      console.log('Old bulk operation jobs cleaned up')
    } catch (error) {
      console.error('Failed to cleanup old jobs:', error)
    }
  }
}

export default new BulkOperationsService()
