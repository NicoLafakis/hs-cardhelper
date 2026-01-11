/**
 * @fileoverview Builder.spec E2E test suite
 * @module e2e/builder.spec
 * @license MIT
 * @author CardHelper Team
 */

/**
 * E2E Test: Builder Canvas
 * Tests the card builder functionality
 */

import { test, expect } from '@playwright/test'

// Helper to setup authenticated state
async function setupAuth(page) {
  // This would normally use a test account or mock auth
  // For now, we'll skip these tests if not authenticated
  await page.goto('/login')
  // TODO: Implement proper auth setup for E2E tests
}

test.describe('Builder Canvas', () => {
  // These tests require authentication
  test.beforeEach(async ({ page }) => {
    // Skip if we can't authenticate
    // In a real setup, you'd have test credentials or mock auth
    test.skip(true, 'Requires authentication setup')
  })

  test('should display component palette', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Component palette should be visible
    await expect(page.getByTestId('component-palette')).toBeVisible()
  })

  test('should display canvas area', async ({ page }) => {
    await page.goto('/builder/new')
    
    await expect(page.getByTestId('canvas')).toBeVisible()
  })

  test('should display property panel', async ({ page }) => {
    await page.goto('/builder/new')
    
    await expect(page.getByTestId('property-panel')).toBeVisible()
  })

  test('should add component via drag and drop', async ({ page }) => {
    await page.goto('/builder/new')
    
    const textComponent = page.getByTestId('palette-text')
    const canvas = page.getByTestId('canvas')
    
    // Drag text component to canvas
    await textComponent.dragTo(canvas)
    
    // Component should appear on canvas
    await expect(page.getByTestId('canvas-component')).toBeVisible()
  })

  test('should select component on click', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Add a component first
    const textComponent = page.getByTestId('palette-text')
    const canvas = page.getByTestId('canvas')
    await textComponent.dragTo(canvas)
    
    // Click on the component
    await page.getByTestId('canvas-component').click()
    
    // Should show selection indicators
    await expect(page.getByTestId('canvas-component')).toHaveClass(/selected/)
  })

  test('should delete component with delete key', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Add and select a component
    const textComponent = page.getByTestId('palette-text')
    const canvas = page.getByTestId('canvas')
    await textComponent.dragTo(canvas)
    await page.getByTestId('canvas-component').click()
    
    // Press delete key
    await page.keyboard.press('Delete')
    
    // Component should be removed
    await expect(page.getByTestId('canvas-component')).not.toBeVisible()
  })

  test('should undo with Ctrl+Z', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Add a component
    const textComponent = page.getByTestId('palette-text')
    const canvas = page.getByTestId('canvas')
    await textComponent.dragTo(canvas)
    
    // Undo
    await page.keyboard.press('Control+z')
    
    // Component should be removed
    await expect(page.getByTestId('canvas-component')).not.toBeVisible()
  })

  test('should redo with Ctrl+Y', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Add a component, then undo
    const textComponent = page.getByTestId('palette-text')
    const canvas = page.getByTestId('canvas')
    await textComponent.dragTo(canvas)
    await page.keyboard.press('Control+z')
    
    // Redo
    await page.keyboard.press('Control+y')
    
    // Component should reappear
    await expect(page.getByTestId('canvas-component')).toBeVisible()
  })
})

test.describe('Preview Mode', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(true, 'Requires authentication setup')
  })

  test('should toggle preview mode', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Click preview button
    await page.getByRole('button', { name: /preview/i }).click()
    
    // Should show preview
    await expect(page.getByTestId('preview-panel')).toBeVisible()
  })

  test('should show mock data in preview', async ({ page }) => {
    await page.goto('/builder/new')
    
    // Add a data-bound component
    // ... component setup ...
    
    // Switch to preview
    await page.getByRole('button', { name: /preview/i }).click()
    
    // Should show mock data values
    await expect(page.getByText(/john|jane|acme/i)).toBeVisible()
  })
})
