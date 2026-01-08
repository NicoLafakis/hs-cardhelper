/**
 * AI Service Tests
 * Tests for the AIService class
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import aiService from './AIService'

// Mock the fetch API
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('AIService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('chat', () => {
    it('should send chat request with correct parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: { message: 'Hello, I can help you build cards!' }
        })
      })

      await aiService.chat(
        'Create a contact card',
        'HubSpot context',
        'contact',
        5
      )

      // Verify the request was made correctly
      expect(mockFetch).toHaveBeenCalled()
      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toContain('/ai/chat')
      const body = JSON.parse(options.body)
      expect(body.message).toBe('Create a contact card')
      expect(body.context).toBe('HubSpot context')
      expect(body.recordType).toBe('contact')
      expect(body.currentComponents).toBe(5)
    })
  })

  describe('getSuggestions', () => {
    it('should send suggestions request with prompt and properties', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: { suggestions: [] }
        })
      })

      await aiService.getSuggestions(
        'Create a deal card',
        'deal',
        ['dealname', 'amount']
      )

      expect(mockFetch).toHaveBeenCalled()
      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toContain('/ai/suggest')
      const body = JSON.parse(options.body)
      expect(body.prompt).toBe('Create a deal card')
      expect(body.objectType).toBe('deal')
      expect(body.properties).toEqual(['dealname', 'amount'])
    })
  })

  describe('generateTableConfig', () => {
    it('should request table configuration generation', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            columns: [
              { property: 'firstname', label: 'First Name' }
            ]
          }
        })
      })

      await aiService.generateTableConfig(
        'Show contacts with name and email',
        'contact',
        ['firstname', 'lastname', 'email']
      )

      expect(mockFetch).toHaveBeenCalled()
      const [url, options] = mockFetch.mock.calls[0]
      expect(url).toContain('/ai/table-wizard')
      const body = JSON.parse(options.body)
      expect(body.description).toBe('Show contacts with name and email')
      expect(body.objectType).toBe('contact')
      expect(body.availableProperties).toContain('firstname')
    })
  })

  describe('generateLayout', () => {
    it('should generate layout suggestions', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: { layout: {} }
        })
      })

      await aiService.generateLayout('company', ['name', 'industry', 'revenue'])

      expect(mockFetch).toHaveBeenCalled()
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.prompt).toContain('company')
      expect(body.prompt).toContain('name')
    })
  })

  describe('suggestComponents', () => {
    it('should suggest components based on purpose', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: { suggestions: [] }
        })
      })

      await aiService.suggestComponents('ticket', 'track support cases')

      expect(mockFetch).toHaveBeenCalled()
      const body = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(body.prompt).toContain('ticket')
      expect(body.prompt).toContain('track support cases')
    })
  })

  describe('parseTableWizardResponse', () => {
    it('should parse successful response', () => {
      const response = {
        success: true,
        data: {
          columns: [
            { property: 'firstname', label: 'First Name', type: 'text' }
          ],
          config: { sortBy: 'firstname' }
        }
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
        style: 'professional'
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
        dataPoints: ['dealname', 'amount']
      }

      const prompt = aiService.buildCardPrompt(requirements)

      expect(prompt).toContain('professional')
    })
  })
})
