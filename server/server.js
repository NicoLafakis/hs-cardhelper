import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { initializeDatabase } from './utils/database.js'
import authRoutes from './routes/auth.js'
import templateRoutes from './routes/templates.js'
import premiumTemplatesRoutes from './routes/premiumTemplates.js'
import settingsRoutes from './routes/settings.js'
import hubspotRoutes from './routes/hubspot.js'
import aiRoutes from './routes/ai.js'
import featureFlagsRoutes from './routes/featureFlags.js'
import smartBuilderRoutes from './routes/smartBuilder.js'
import analyticsRoutes from './routes/analytics.js'
import dataBindingsRoutes from './routes/dataBindings.js'
import componentLibraryRoutes from './routes/componentLibrary.js'
import setupWebSocketServer from './websocket/server.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const PORT = process.env.PORT || 3020

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database and start server
initializeDatabase()
  .then((database) => {
    // Routes
    app.use('/api/auth', authRoutes)
    app.use('/api/templates', templateRoutes)
    app.use('/api/premium-templates', premiumTemplatesRoutes)
    app.use('/api/settings', settingsRoutes)
    app.use('/api/hubspot', hubspotRoutes)
    app.use('/api/ai', aiRoutes)
    app.use('/api/feature-flags', featureFlagsRoutes)
    app.use('/api/smart-builder', smartBuilderRoutes)
    app.use('/api/analytics', analyticsRoutes)
    app.use('/api/data-bindings', dataBindingsRoutes)
    app.use('/api/component-library', componentLibraryRoutes)

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', message: 'CardHelper API is running' })
    })

    // Setup WebSocket server for real-time collaboration
    setupWebSocketServer(httpServer, database)
    console.log('[WebSocket] Real-time collaboration server initialized')

    // Error handling
    app.use((err, req, res) => {
      console.error('Server error:', err)
      res.status(500).json({ error: 'Internal server error' })
    })

    httpServer.listen(PORT, () => {
      console.log(`[Server] CardHelper running on port ${PORT}`)
      console.log(`[API] Available at http://localhost:${PORT}/api`)
      console.log(`[WebSocket] Real-time collaboration active`)
    })
  })
  .catch(err => {
    console.error('[Server] Failed to initialize database:', err)
    process.exit(1)
  })
