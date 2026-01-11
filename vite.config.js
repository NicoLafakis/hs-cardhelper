/**
 * @fileoverview Vite build configuration for CardHelper
 * @module vite.config
 * @description Configures Vite dev server, build settings, and React plugin
 * @license MIT
 * @author CardHelper Team
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3020',
        changeOrigin: true,
      }
    }
  }
})
