/**
 * @fileoverview Setup Server test setup
 * @module server/test/setup
 * @license MIT
 * @author CardHelper Team
 */

/**
 * Vitest Setup File for Server Tests
 * This file runs before all server-side tests
 */

import { vi, afterAll, afterEach } from 'vitest'
import dotenv from 'dotenv'

// Load test environment variables
dotenv.config({ path: '.env.test' })

// Set test environment
process.env.NODE_ENV = 'test'

// Mock database pool for unit tests
// Integration tests should use a real test database
export const mockPool = {
  execute: vi.fn(),
  query: vi.fn(),
  getConnection: vi.fn().mockResolvedValue({
    execute: vi.fn(),
    query: vi.fn(),
    release: vi.fn(),
  }),
  end: vi.fn(),
}

// Reset mocks between tests
afterEach(() => {
  vi.clearAllMocks()
})

// Cleanup after all tests
afterAll(async () => {
  // Add any cleanup logic here
})

/**
 * Helper to create a mock request object
 */
export function createMockRequest(overrides = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: null,
    ...overrides,
  }
}

/**
 * Helper to create a mock response object
 */
export function createMockResponse() {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    send: vi.fn().mockReturnThis(),
    set: vi.fn().mockReturnThis(),
  }
  return res
}

/**
 * Helper to create a mock next function
 */
export function createMockNext() {
  return vi.fn()
}
