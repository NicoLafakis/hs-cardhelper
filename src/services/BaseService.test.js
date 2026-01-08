/**
 * BaseService Tests
 * Tests for the service layer base class
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BaseService } from './BaseService.js'

// Mock the api module
vi.mock('../api/api.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}))

import api from '../api/api.js'

describe('BaseService', () => {
  let service

  beforeEach(() => {
    vi.clearAllMocks()
    service = new BaseService('/test')
  })

  describe('constructor', () => {
    it('should set basePath', () => {
      expect(service.basePath).toBe('/test')
    })

    it('should use empty string if no basePath provided', () => {
      const noPathService = new BaseService()
      expect(noPathService.basePath).toBe('')
    })
  })

  describe('buildPath', () => {
    it('should combine basePath with path', () => {
      const result = service.buildPath('/items')
      expect(result).toBe('/test/items')
    })

    it('should return basePath if no path provided', () => {
      const result = service.buildPath()
      expect(result).toBe('/test')
    })
  })

  describe('get', () => {
    it('should make GET request and return success response', async () => {
      const mockData = { id: 1, name: 'Test' }
      api.get.mockResolvedValue({ data: mockData })

      const result = await service.get('/items')

      expect(api.get).toHaveBeenCalledWith('/test/items', {})
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('should handle errors', async () => {
      api.get.mockRejectedValue(new Error('Network error'))

      const result = await service.get('/items')

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('post', () => {
    it('should make POST request with data', async () => {
      const mockData = { id: 1 }
      const postData = { name: 'New Item' }
      api.post.mockResolvedValue({ data: mockData })

      const result = await service.post('/items', postData)

      expect(api.post).toHaveBeenCalledWith('/test/items', postData, {})
      expect(result.success).toBe(true)
    })
  })

  describe('put', () => {
    it('should make PUT request with data', async () => {
      const mockData = { id: 1, name: 'Updated' }
      const putData = { name: 'Updated' }
      api.put.mockResolvedValue({ data: mockData })

      const result = await service.put('/items/1', putData)

      expect(api.put).toHaveBeenCalledWith('/test/items/1', putData, {})
      expect(result.success).toBe(true)
    })
  })

  describe('delete', () => {
    it('should make DELETE request', async () => {
      api.delete.mockResolvedValue({ data: { deleted: true } })

      const result = await service.delete('/items/1')

      expect(api.delete).toHaveBeenCalledWith('/test/items/1', {})
      expect(result.success).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should extract error message from response', async () => {
      const error = {
        response: {
          data: { error: 'Validation failed' },
        },
      }
      api.get.mockRejectedValue(error)

      const result = await service.get('/items')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Validation failed')
    })

    it('should use error.message as fallback', async () => {
      api.get.mockRejectedValue(new Error('Connection refused'))

      const result = await service.get('/items')

      expect(result.error).toBe('Connection refused')
    })
  })
})
