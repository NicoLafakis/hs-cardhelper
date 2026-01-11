/**
 * @fileoverview Auth.spec E2E test suite
 * @module e2e/auth.spec
 * @license MIT
 * @author CardHelper Team
 */

/**
 * E2E Test: Authentication Flow
 * Tests the complete login/signup/logout user journey
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.goto('/login')
    await page.evaluate(() => localStorage.clear())
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/)
  })

  test('should show login form', async ({ page }) => {
    await page.goto('/login')
    
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('button', { name: /login|sign in/i }).click()
    
    // Should show validation messages
    await expect(page.getByText(/email|required/i)).toBeVisible()
  })

  test('should navigate to signup from login', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('link', { name: /sign up|create account/i }).click()
    
    await expect(page).toHaveURL(/\/signup/)
  })

  test('should show signup form', async ({ page }) => {
    await page.goto('/signup')
    
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible()
    await expect(page.getByRole('textbox', { name: /password/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up|create/i })).toBeVisible()
  })

  // This test requires a real backend connection
  test.skip('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')
    
    await page.getByRole('textbox', { name: /email/i }).fill('test@example.com')
    await page.getByRole('textbox', { name: /password/i }).fill('password123')
    await page.getByRole('button', { name: /login|sign in/i }).click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/)
  })
})

test.describe('Protected Routes', () => {
  test('should not access dashboard without auth', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.goto('/dashboard')
    
    await expect(page).toHaveURL(/\/login/)
  })

  test('should not access builder without auth', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.goto('/builder/1')
    
    await expect(page).toHaveURL(/\/login/)
  })

  test('should not access settings without auth', async ({ page }) => {
    await page.evaluate(() => localStorage.clear())
    await page.goto('/settings')
    
    await expect(page).toHaveURL(/\/login/)
  })
})
