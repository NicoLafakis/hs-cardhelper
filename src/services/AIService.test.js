/**
 * @fileoverview A I Service.test Frontend service
 * @module src/services/AIService.test
 * @license MIT
 * @author CardHelper Team
 */

/**
 * AI Service Tests
 * Tests for the AIService class
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AIService } from './AIService'

// Create mock api
const mockApi = {
  post: vi.fn(),
  get: vi.fn(),
}

describe('AIService', () => {
  let aiService

  beforeEach(() => {
    vi.clearAllMocks()
    // Create fresh instance with mocked api
    aiService = new AIService()
    aiService.api = mockApi
  })

  describe('chat', () => {
    it('should send chat request with correct parameters', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { message: 'Hello, I can help you build cards!' },
      })

      await aiService.chat(
        'Create a contact card',
        'HubSpot context',
        'contact',
        5
      )

      // Verify the request was made correctly
      expect(mockApi.post).toHaveBeenCalledWith(
        '/ai/chat',
        {
          message: 'Create a contact card',
          context: 'HubSpot context',
          recordType: 'contact',
          currentComponents: 5,
        },
        {}
      )
    })
  })

  describe('getSuggestions', () => {
    it('should send suggestions request with prompt and properties', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { suggestions: [] },
      })

      await aiService.getSuggestions('Create a deal card', 'deal', [
        'dealname',
        'amount',
      ])

      expect(mockApi.post).toHaveBeenCalledWith(
        '/ai/suggest',
        {
          prompt: 'Create a deal card',
          objectType: 'deal',
          properties: ['dealname', 'amount'],
        },
        {}
      )
    })
  })

  describe('generateTableConfig', () => {
    it('should request table configuration generation', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: {
          columns: [{ property: 'firstname', label: 'First Name' }],
        },
      })

      await aiService.generateTableConfig(
        'Show contacts with name and email',
        'contact',
        ['firstname', 'lastname', 'email']
      )

      expect(mockApi.post).toHaveBeenCalledWith(
        '/ai/table-wizard',
        {
          description: 'Show contacts with name and email',
          objectType: 'contact',
          availableProperties: ['firstname', 'lastname', 'email'],
        },
        {}
      )
    })
  })

  describe('generateLayout', () => {
    it('should generate layout suggestions', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { layout: {} },
      })

      await aiService.generateLayout('company', ['name', 'industry', 'revenue'])

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[1].prompt).toContain('company')
      expect(callArgs[1].prompt).toContain('name')
    })
  })

  describe('suggestComponents', () => {
    it('should suggest components based on purpose', async () => {
      mockApi.post.mockResolvedValueOnce({
        data: { suggestions: [] },
      })

      await aiService.suggestComponents('ticket', 'track support cases')

      expect(mockApi.post).toHaveBeenCalled()
      const callArgs = mockApi.post.mock.calls[0]
      expect(callArgs[1].prompt).toContain('ticket')
      expect(callArgs[1].prompt).toContain('track support cases')
    })
  })

  describe('parseTableWizardResponse', () => {
    it('should parse successful response', () => {
      const response = {
        success: true,
        data: {
          columns: [
            { property: 'firstname', label: 'First Name', type: 'text' },
          ],
          config: { sortBy: 'firstname' },
        },
      }

      const result = aiService.parseTableWizardResponse(response)

      expect(result.success).toBe(true)
      expect(result.columns).toHaveLength(1)
      expect(result.config.sortBy).toBe('firstname')
    })

    it('should handle failed response', () => {
      const response = { success: false }

      const result = aiService.parseTableWizardResponse(response)

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should handle missing data', () => {
      const response = { success: true }

      const result = aiService.parseTableWizardResponse(response)

      expect(result.success).toBe(false)
    })
  })

  describe('buildCardPrompt', () => {
    it('should build comprehensive prompt', () => {
      const requirements = {
        objectType: 'contact',
        purpose: 'Display key contact information',
        dataPoints: ['firstname', 'email', 'phone'],
        style: 'professional',
      }

      const prompt = aiService.buildCardPrompt(requirements)

      expect(prompt).toContain('contact')
      expect(prompt).toContain('Display key contact information')
      expect(prompt).toContain('firstname')
      expect(prompt).toContain('professional')
    })

    it('should use default style if not provided', () => {
      const requirements = {
        objectType: 'deal',
        purpose: 'Track deals',
        dataPoints: ['dealname', 'amount'],
      }

      const prompt = aiService.buildCardPrompt(requirements)

      expect(prompt).toContain('professional')
    })
  })
})
