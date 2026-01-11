/**
 * @fileoverview Vitest test configuration for server-side tests
 * @module vitest.server.config
 * @description Configures Vitest for testing Express backend and services
 * @license MIT
 * @author CardHelper Team
 */

/// <reference types="vitest" />
import { defineConfig } from 'vite'

/**
 * Vitest configuration for server-side (Node.js) tests
 * Run with: npm run test:server
 */
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['server/**/*.{test,spec}.{js,mjs}'],
    exclude: ['node_modules', 'dist', 'src/**'],
    setupFiles: ['./server/test/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage/server',
      exclude: [
        'node_modules/',
        'server/test/',
        'src/**',
      ],
    },
    testTimeout: 30000, // Longer timeout for DB operations
    hookTimeout: 30000,
  },
})
