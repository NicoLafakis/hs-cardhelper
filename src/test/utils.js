/**
 * @fileoverview Utils Test utility
 * @module src/test/utils
 * @license MIT
 * @author CardHelper Team
 */

/**
 * Test utilities and helpers for CardHelper tests
 */

import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '../contexts/ToastContext'
import { PluginProvider } from '../core/PluginManager'

/**
 * Custom render function that wraps components with required providers
 */
export function renderWithProviders(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <ToastProvider>
        <PluginProvider>{children}</PluginProvider>
      </ToastProvider>
    </BrowserRouter>
  )

  return render(ui, { wrapper: Wrapper, ...options })
}

/**
 * Create a mock component for testing
 */
export function createMockComponent(overrides = {}) {
  return {
    id: Date.now() + Math.random(),
    type: 'text',
    x: 100,
    y: 100,
    width: 200,
    height: 100,
    zIndex: 0,
    parentId: null,
    children: [],
    defaultProps: {
      content: 'Test content',
    },
    ...overrides,
  }
}

/**
 * Create a mock user for testing auth
 */
export function createMockUser(overrides = {}) {
  return {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  }
}

/**
 * Create a mock template for testing
 */
export function createMockTemplate(overrides = {}) {
  return {
    id: 1,
    name: 'Test Template',
    config: {
      components: [],
    },
    created_at: new Date().toISOString(),
    ...overrides,
  }
}

/**
 * Wait for async operations to complete
 */
export async function waitForAsync() {
  await new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Mock API response helper
 */
export function mockApiResponse(data, success = true) {
  return {
    data: success ? { success: true, data } : { success: false, error: data },
  }
}

// Re-export testing library utilities
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
