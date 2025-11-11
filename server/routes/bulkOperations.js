/**
 * Bulk Operations Routes
 * API endpoints for batch operations
 */

import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import BulkOperationsService from '../services/BulkOperationsService.js'

const router = express.Router()

// Create a new bulk operation job
router.post('/create-job', authenticateToken, async (req, res) => {
  try {
    const { operationType, recordCount, config } = req.body

    if (!operationType || !recordCount) {
      return res.status(400).json({ error: 'Operation type and record count are required' })
    }

    const result = await BulkOperationsService.createBulkJob(
      req.user.userId,
      operationType,
      recordCount,
      config
    )

    res.json(result)
  } catch (error) {
    console.error('Create bulk job error:', error)
    res.status(500).json({ error: 'Failed to create bulk job' })
  }
})

// Execute bulk update
router.post('/execute-update', authenticateToken, async (req, res) => {
  try {
    const { jobId, records, fieldUpdates } = req.body

    if (!records || !fieldUpdates) {
      return res.status(400).json({ error: 'Records and field updates are required' })
    }

    const progressCallback = async (current, errors) => {
      await BulkOperationsService.updateJobProgress(jobId, current, errors)
    }

    const result = await BulkOperationsService.executeBulkUpdate(
      records,
      fieldUpdates,
      progressCallback
    )

    await BulkOperationsService.completeJob(
      jobId,
      result.errors.length === 0 ? 'completed' : 'completed_with_errors',
      result.errors
    )

    res.json({
      success: true,
      processed: result.processed,
      errors: result.errors
    })
  } catch (error) {
    console.error('Bulk update error:', error)
    res.status(500).json({ error: 'Failed to execute bulk update' })
  }
})

// Execute bulk delete
router.post('/execute-delete', authenticateToken, async (req, res) => {
  try {
    const { jobId, recordIds } = req.body

    if (!recordIds || recordIds.length === 0) {
      return res.status(400).json({ error: 'Record IDs are required' })
    }

    const progressCallback = async (current, errors) => {
      await BulkOperationsService.updateJobProgress(jobId, current, errors)
    }

    const result = await BulkOperationsService.executeBulkDelete(
      recordIds,
      progressCallback
    )

    await BulkOperationsService.completeJob(
      jobId,
      result.errors.length === 0 ? 'completed' : 'completed_with_errors',
      result.errors
    )

    res.json({
      success: true,
      processed: result.processed,
      errors: result.errors
    })
  } catch (error) {
    console.error('Bulk delete error:', error)
    res.status(500).json({ error: 'Failed to execute bulk delete' })
  }
})

// Execute bulk duplicate
router.post('/execute-duplicate', authenticateToken, async (req, res) => {
  try {
    const { jobId, recordIds } = req.body

    if (!recordIds || recordIds.length === 0) {
      return res.status(400).json({ error: 'Record IDs are required' })
    }

    const progressCallback = async (current, errors) => {
      await BulkOperationsService.updateJobProgress(jobId, current, errors)
    }

    const result = await BulkOperationsService.executeBulkDuplicate(
      recordIds,
      progressCallback
    )

    await BulkOperationsService.completeJob(
      jobId,
      result.errors.length === 0 ? 'completed' : 'completed_with_errors',
      result.errors
    )

    res.json({
      success: true,
      processed: result.processed,
      duplicated: result.duplicated,
      errors: result.errors
    })
  } catch (error) {
    console.error('Bulk duplicate error:', error)
    res.status(500).json({ error: 'Failed to execute bulk duplicate' })
  }
})

// Get job status
router.get('/job-status/:jobId', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params

    const status = BulkOperationsService.getJobStatus(jobId)

    if (!status) {
      return res.status(404).json({ error: 'Job not found' })
    }

    res.json(status)
  } catch (error) {
    console.error('Get job status error:', error)
    res.status(500).json({ error: 'Failed to get job status' })
  }
})

// Get user's bulk operation history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20

    const history = await BulkOperationsService.getUserBulkOperations(
      req.user.userId,
      limit
    )

    res.json({ history })
  } catch (error) {
    console.error('Get history error:', error)
    res.status(500).json({ error: 'Failed to get bulk operation history' })
  }
})

// Cancel a running job
router.post('/cancel-job', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.body

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' })
    }

    const result = await BulkOperationsService.cancelJob(jobId)

    res.json(result)
  } catch (error) {
    console.error('Cancel job error:', error)
    res.status(500).json({ error: 'Failed to cancel job' })
  }
})

export default router
